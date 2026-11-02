# Awesome DSH Plugins

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[2cc89cb](https://github.com/bruc3van/awesome-dsh-plugin/tree/2cc89cbe69393a84cc362d97bd4b32e3df020f93)

<!-- BEGIN META -->
[![GitHub ★ 486](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=486&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bruc3van/awesome-dsh-plugin)
<!-- END META -->

> **功能**：提供 DSH 插件分类目录与可订阅到官方发现页的安装目标索引。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将候选身份/产物依据与宿主可读索引连接，减少目标解析与发布不一致。

> **主要限制**：[Q03](#research-q03) 入选编辑优先/Star混合，metadata核实非安全/实机/收益背书；顶限和缺mapping不等不适用。

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
  - [Q01 · 目录资源解决哪段选包问题？](#detail-section-11)
  - [Q02 · 候选怎样转成发布索引？](#detail-section-12)
  - [Q03 · 1000排名、编辑与验证意味着什么？](#detail-section-13)
  - [Q04 · 怎样采用且不把维护成本藏起来？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH用户需要从仓库线索找到一个任务相关候选安装目标。

手工GitHub/npm搜索和逐仓查bundle；资源不提供插件运行本体。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分类目录 | 寻找任务候选 | 非全是可运行插件 |
| 安装索引 | 映射npm/Git身份 | 上限/缺映射非质量判定 |
| 包核验 | 元数据/字节一致性 | 非代码安全或实机兼容 |
| 排名/精选 | 降低浏览成本 | 编辑优先+Star非客观质量 |
| 发布门 | 防错误/骤降数据替换 | 源码门非线上已成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持订阅的DSH/profile | 用户需要 | 发现页消费 | 作者版本声明待实测 |
| GitHub/npm/托管网络 | 维护/订阅需要 | 刷新来源与产物 | 失败保旧但可能过时 |
| 单目标权限/版本核对 | 安装前提 | 真实采用 | 收录不代替授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 订阅 | 用户核URL/profile/时间 | 正确索引源 |
| 筛选 | 按任务看候选 | 核编辑/Star非质量 |
| 试用 | 独立profile单目标 | 上游权限/版本/任务通过 |
| 退出 | 移源/逐包清理 | 已装插件不自动卸载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 索引/候选网络 | 添加源核一个目标 | 节时未测 |
| 持续 | 维护端Git/npm/tarball | 审批/用户逐包复核 | 工时未知 |
| 失败恢复 | 刷新/旧数据/重生成 | 查来源失败/版本差异 | 线上恢复未验 |
| 退出 | 插件数据独立保留 | 移源及逐包处理 | 不等整体卸载 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 身份发现 | registry/tarball/format核验 | 真实安装成功率 |
| 选包 | 分类/编辑/Star策略 | 安全/收益/最佳适配 |
| 发布一致 | artifact/hash/atomic门 | 线上最新状态 |
| 时间 | 入口集中 | 单位合格选包净成本 |

> **思考**：[Q03](#research-q03) 入选编辑优先/Star混合，metadata核实非安全/实机/收益背书；顶限和缺mapping不等不适用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将候选身份/产物依据与宿主可读索引连接，减少目标解析与发布不一致。

[Q02](#research-q02) 内存包校验/发布artifact一致性与双ref原子push可借鉴；[Q03](#research-q03)不得将其当目标代码审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 入选编辑优先/Star混合，metadata核实非安全/实机/收益背书；顶限和缺mapping不等不适用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 独立profile只试单个任务候选，上游核权限/版本，不批装；不清回原仓库。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码核候选/npm包验证/排名/发布关键路径，未抓线上源或安装目标；仅作为候选发现试用。

- 已检查：作者 README、包清单、源码路径 README.md、CATALOG.md、.github/CI.md、scripts/host-market/generate.mjs、scripts/host-market/npm.mjs、scripts/host-market/vendor/fetchers.ts、scripts/host-market/policy.mjs、scripts/host-market/candidates.mjs、.github/workflows/refresh-host-market.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：README/CATALOG/CI、候选/generate/npm/policy与同提交vendor fetcher/npm和CI发布关键段；复核旧findings。未全量审目录/全部Git路径/Host安装器/托管状态，不执行目标。
- 下一步：固定release source/hash对Host读取；单目标权限/版本任务与手工查包对照，再做核验分层/编辑原因误信试验。

**分析版本**

- **仓库**：[bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin)
- **版本号**：未声明（[固定提交 2cc89cb](https://github.com/bruc3van/awesome-dsh-plugin/tree/2cc89cbe69393a84cc362d97bd4b32e3df020f93)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 决策处展示核验层级和入选原因，若不降误信或增加负担即否定。

固定release source/hash对Host读取；单目标权限/版本任务与手工查包对照，再做核验分层/编辑原因误信试验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 58 | 29721 | — | — | 1072208 |
| .mjs | source | 43 | 9490 | 7927 | 1127 | — |
| .mjs | test | 8 | 899 | 867 | 29 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/bruc3van/awesome-dsh-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查目录到安装索引的身份/发布保障与选包质量边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目录资源解决哪段选包问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本根是DSH目录/订阅资源，不是单个插件；safer-dsh-market是另一个可选安装器。面向要找一个任务相关扩展的用户，分类/搜索/宿主发现页订阅把GitHub仓库线索映射为npm或固定Git安装目标，相对自己逐仓查清单减少身份核对。合格结果是找到可解释来源、权限/版本适配的候选并在副本验证，不是订阅后批量安装。

README区分全仓库目录和最多1000安装目标订阅，并明确收录不等安全/实机兼容；仓库数量是作者该快照统计，不应说这些全是可运行插件。目录的人工审批、manifest/产物验证是不同层，不把Star/“大量用户验证”文案当本轮独立采用证据。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:11-31](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/README.md#L11-L31)

订阅/宿主版本/独立市场边界。

<details>
<summary>查看原文（21行）</summary>

````text
## 订阅到 DSH 官方「发现」页

**适用版本：DSH V0.2.1-rc.2 及以上。** 这里的版本要求针对官方「发现」页的第三方订阅功能；各插件仍需满足详情中声明的宿主版本要求。

**订阅链接：[https://bruc3van.com/dsh-plugins/index.json](https://bruc3van.com/dsh-plugins/index.json)**

```text
https://bruc3van.com/dsh-plugins/index.json
```

1. **确认版本**：将 DSH 升级到 **V0.2.1-rc.2 或更高版本**。
2. **开启自定义市场**：打开左侧 **插件**，点击 **实验性插件** 旁的 **更多**，找到 **自定义插件市场** 并开启。启用后，插件页会显示 **已安装 / 发现** 两个标签页。
3. **打开索引源配置**：进入 **发现**。首次使用时点击 **添加索引源**；已有市场时，展开左上角的市场名称下拉菜单，选择 **管理索引源…**。
4. **添加订阅**：在 **索引 URL** 中粘贴上面的 `index.json` 地址，点击 **添加**。确认地址出现在已添加的索引源列表后，关闭弹窗；配置保存在当前 profile 中。
5. **浏览和安装**：在市场下拉菜单中选择 **Bruce 的精选插件**；如需重新读取数据，点击 **刷新**。按分类（含编辑推荐）、关键词或 npm/Git、近期更新、Star 标签查找插件，查看版本要求后再安装。

如果没有看到「发现」，请先检查 DSH 是否为 V0.2.1-rc.2 及以上版本，以及「自定义插件市场」是否已开启。只开启功能还不会自动添加本订阅源，仍需完成上面的添加步骤。

仅订阅官方「发现」页**无需安装 `safer-dsh-market`**；如需独立市场界面、多选安装和安装后 AI 审查，可另行安装市场插件。开启「自定义插件市场」与市场插件自己的「启用安全市场」开关是两个不同入口。

收录经过核实的 npm 目标及固定完整提交的 Git 组合包，核实 bundle 声明、时间及官方宿主兼容范围规则，因此不是完整仓库目录；收录不代表安全审查或实机兼容保证。订阅先排除未审批、归档、禁用、黑名单及无效安装来源，再将通过核验的插件按仓库 Star 数降序选取前 1000 个；官方发现页支持中英文分类（含编辑推荐）、npm/Git 与近期更新/Star 标签、关键词搜索及 Star/仓库更新时间排序。
````

</details>

**依据 2 · 源码核查**：[README.md:85-101](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/README.md#L85-L101)

目录/机器数据/推荐文案。

<details>
<summary>查看原文（17行）</summary>

```text
按分类浏览每个分类下的全部项目，见 [CATALOG.md](./CATALOG.md)——目录按类目分册，索引页列出每一册。

## 🧭 用户索引

| 我想要…… | 直接去哪里 |
| --- | --- |
| 30 秒选出一个插件 | [精选推荐](#-精选推荐)：从「我想让 DSH 做什么」出发，按场景分组列出社区优秀插件 |
| 第一次装插件 | [新手入门组合](#-新手入门组合)：按当前问题选一套组合，不用一次装很多 |
| 按热度翻完整榜单 | [社区热度榜](#-社区热度榜)（首页 Top 50）· [TOP200.md](./TOP200.md)（完整 Top 200） |
| 按分类浏览全部项目 | [CATALOG.md](./CATALOG.md)（全量目录）· [生态全景](#-生态全景)（分类概览） |
| 看看作者们自己提交的新插件 | [作者自荐](#-作者自荐)（首页最近 10 条）· [SHOWCASE.md](./SHOWCASE.md)（全部） |
| 用程序消费插件数据 | [data/market.json](./data/market.json)——面向下游市场的精选文件（≤1000 条、≤1 MB，见[接口规范](https://github.com/bruc3van/dsh-desktop-safe-market/blob/master/docs/market-json-spec.md)）；[data/repositories.json](./data/repositories.json)——每日自动快照，含星数、许可证、活跃度等元数据 |
| 收录或推荐你自己的插件 | [推荐或修正插件](#-推荐或修正插件) / [CONTRIBUTING](./CONTRIBUTING.md) |

## ⭐ 精选推荐

**这里不按星数排名，但优先选择社区验证的高星项目**——绝大多数推荐来自 Star Top 200：它们解决明确问题、说明完整、仍在维护且经过大量用户验证；少数是几十 Star 但无可替代的项目。从你的问题出发，找到最接近的一行，点进去就是答案；收录不等于安全或兼容性背书。想看按热度排名的完整榜单，见[社区热度榜](#-社区热度榜)。各分类条目下方附有界面截图，点击截图即可直达仓库首页。
```

</details>

**依据 3 · 源码核查**：[CATALOG.md:1-17](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/CATALOG.md#L1-L17)

目录范围非兼容背书。

<details>
<summary>查看原文（17行）</summary>

```text
# DSH 插件全量目录 / Complete DSH Plugin Catalog

[返回中文首页](./README.md) · [Back to English home](./README_EN.md) · [Star Top 200](./TOP200.md) · [作者自荐 / Author showcase](./SHOWCASE.md) · [JSON data](./data/repositories.json)

本页自动收录 GitHub [`dsh-plugin` Topic](https://github.com/topics/dsh-plugin) 下已提供项目简介、并经维护者核实（[data/approved.json](./data/approved.json)）的公开仓库。960 个蹭 Topic 的非插件仓库（平台本体、其他 Agent 工具、同名目录站等）以及经编辑部拉黑的仓库已剔除，清单与理由见 [data/curated.json](./data/curated.json)。新增仓库先进入[待审核队列](./data/review/pending.md)，经人工核实后才会收录。本页是索引，不代表人工推荐、兼容性验证或安全背书。

目录按类目分册：条目总量已超过 GitHub 单页 Markdown 的渲染上限，下表每一行都是一册完整名单。

This page automatically lists public repositories under GitHub's [`dsh-plugin` topic](https://github.com/topics/dsh-plugin) that have a description set and have been verified by the maintainer ([data/approved.json](./data/approved.json)). 960 repositories that ride the topic without being DSH plugins (the platform itself, other agent tools, competing catalogs), plus editorially blacklisted repositories, are excluded — see [data/curated.json](./data/curated.json) for the full list and reasons. New repositories enter the [review queue](./data/review/pending.md) first and appear here only after human verification. It is an index, not a claim of editorial recommendation, compatibility, or security review.

The catalog is split into one volume per category — the full list outgrew GitHub's single-page Markdown rendering limit. Each row below is a complete volume.

- Repositories: **22471**
- Primary languages: **40**
- Declared licenses: **20522**
- Refreshed: **2026-11-01 UTC**
- 最近人工复核 / Last review merge: **2026-11-02**
```

</details>

#### 缺口

- 真实发现页/安装任务与独立用户结果未验。
  **影响**：不能证明推荐最佳或安装成功率。
  **进一步探讨**：固定Host在独立profile选一个目标，对照上游清单/权限/实际任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选怎样转成发布索引？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

buildCandidates结合快照/审批/策展和包映射，未映射标pending不是不兼容；generator按目标去重，npm selector解析tag为精确版本、验name/version、bundle声明、宿主range和发布时间。npm核验真实下载tarball、压缩/解压限额、registry integrity、内存解包且不执行目标；还比较实际manifest bundle/engines与registry，metadata来自最高版本包。这是身份/产物一致性核验，不是只取README。

parseMarketIndex再校格式；publishability拒来源读取失败、空/超1000及较前快照骤降20%以上。CI发布读同次artifact、校hash/计数/不接受symlink，双ref atomic push；main变动重生成而非rebase旧验证件，有界交接不等后续发布已成功。Git核验存在另路径，本轮未全审Git transport/manifest解析，不能把npm覆盖泛化全部目标。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/host-market/candidates.mjs:11-67](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/candidates.mjs#L11-L67)

候选映射/审批/缺口。

<details>
<summary>查看原文（57行）</summary>

```text
export function buildCandidates({ market, snapshot, curated, approved, packages }) {
  if (market.schema_version !== 2 || packages.schema_version !== 1)
    throw Error('Unsupported candidate input schema')
  const existing = [...market.entries, ...(market.featured?.entries ?? [])]
  const seen = new Set(existing.map(row => row.full_name.toLowerCase()))
  const mappings = new Map(Object.entries(packages.entries).map(([key, value]) => [key.toLowerCase(), value]))
  const { repos } = filterPool(snapshot, curated, approved)
  const excludedRepositories = [...new Set([
    ...Object.keys(curated.excluded_repos || {}),
    ...Object.keys(curated.leaderboard_exclusions || {}),
    ...Object.keys(curated.market_exclusions || {}),
    ...SELF_EXCLUDED_REPOS,
  ].map((name) => name.toLowerCase()))].sort()
  const extra = [], pending = []
  let manual = 0
  for (const { repo, category } of repos) {
    const key = repo.full_name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    const record = mappings.get(key)
    const block = record ? packagesBlockFor(record) : undefined
    if (block?.mode === 'command') extra.push({ ...buildEntry(repo, category), packages: block })
    else if (block?.mode === 'manual') manual++
    else pending.push({ full_name: repo.full_name, stargazers_count: repo.stargazers_count })
  }
  extra.sort(compare)
  pending.sort(compare)
  // Sorting before target dedup ensures a shared package uses its highest-star repository.
  const unique = new Map()
  const snapshotByName = new Map(snapshot.repositories.map(repo => [repo.full_name.toLowerCase(), repo]))
  for (const row of existing) {
    const key = row.full_name.toLowerCase()
    const repo = snapshotByName.get(key)
    const record = mappings.get(key)
    if (!unique.has(key)) unique.set(key, {
      ...row,
      ...(repo ? buildEntry(repo, categoryForRepo(curated, repo)) : {}),
      ...(record ? { packages: packagesBlockFor(record) } : {}),
    })
  }
  return {
    ...market,
    excludedRepositories,
    entries: [...unique.values(), ...extra].sort(compare),
    featured: { ...market.featured, entries: [] },
    featuredRepositories: [...new Set((market.featured?.entries ?? []).map(row => row.full_name).filter(Boolean))],
    subscriptionCandidates: {
      policy: 'approved-mapped-pool-v1',
      selectionPolicy: SELECTION_POLICY,
      communityRepositories: market.entries.length,
      eligiblePoolRepositories: repos.length,
      additionalMappedRepositories: extra.map(row => row.full_name),
      outsideDirectoryManual: manual,
      outsideDirectoryWithoutMapping: pending.length,
      pendingPreview: pending.slice(0, 200),
      pendingPreviewLimit: 200,
      note: `Missing mappings are pending evidence, not incompatibility. Every candidate is source-verified before the final top-${MAX_PLUGINS}-by-stars selection; repository and package counts differ.`,
```

</details>

**依据 2 · 源码核查**：[scripts/host-market/generate.mjs:93-140](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/generate.mjs#L93-L140)

registry目标身份和range。

<details>
<summary>查看原文（48行）</summary>

```text
export function projectPackage(name, selectors, packument) {
  const diagnostics = []
  const versions = []
  const wanted = [
    ...new Set(
      selectors.map((selector) =>
        semver.valid(selector) ? selector : packument['dist-tags']?.[selector],
      ),
    ),
  ]
  for (const version of wanted) {
    const manifest = packument.versions?.[version]
    const range = manifest ? dshRange(manifest) : undefined
    const reason =
      !semver.valid(version) ||
      manifest?.name !== name ||
      manifest.version !== version
        ? 'missing or mismatched manifest'
        : !isBundle(manifest)
          ? 'not a declared DSH bundle'
          : range instanceof Error
            ? 'invalid DSH compatibility range'
            : !Number.isFinite(Date.parse(packument.time?.[version]))
              ? 'missing registry publish time'
              : null
    if (reason) {
      diagnostics.push({
        name,
        version: version ?? null,
        code: {
          'missing or mismatched manifest': 'invalid_manifest',
          'not a declared DSH bundle': 'not_dsh_bundle',
          'invalid DSH compatibility range': 'invalid_host_range',
          'missing registry publish time': 'missing_publish_time',
        }[reason],
        status: 'excluded',
        reason: range instanceof Error ? range.message : reason,
      })
      continue
    }
    versions.push({
      version,
      publishTimestamp: Math.floor(Date.parse(packument.time[version]) / 1000),
      source: { type: 'npm', registry: REGISTRY },
      ...(typeof range === 'string' ? { engines: { dsh: range } } : {}),
    })
  }
  versions.sort((a, b) => semver.rcompare(a.version, b.version))
```

</details>

**依据 3 · 源码核查**：[scripts/host-market/npm.mjs:15-41](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/npm.mjs#L15-L41)

实际包对registry一致性。

<details>
<summary>查看原文（27行）</summary>

```text
  for (const version of plugin.versions) {
    const registryManifest = packument.versions[version.version]
    const { files, manifest } = await npmTarball(
      plugin.name,
      version.version,
      registryManifest.dist,
      limits,
    )
    const range = dshRange(manifest)
    const expected = version.engines?.dsh
    // npm can reorder peer keys; intersected ranges must match semantically.
    const matches = range === expected || (
      typeof range === 'string' && typeof expected === 'string' &&
      semver.subset(range, expected, { includePrerelease: true }) &&
      semver.subset(expected, range, { includePrerelease: true })
    )
    if (!isBundle(manifest) || range instanceof Error || !matches)
      throw Error(
        `${plugin.name}@${version.version}: tarball bundle/engines differ from registry metadata`,
      )
    if (!highest) highest = { files, manifest }
    evidence.push({
      name: plugin.name,
      version: version.version,
      tarball: registryManifest.dist.tarball,
      integrity: registryManifest.dist.integrity,
    })
```

</details>

**依据 4 · 源码核查**：[scripts/host-market/vendor/fetchers.ts:55-86](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/vendor/fetchers.ts#L55-L86)

integrity/仅文件内存解包/限额。

<details>
<summary>查看原文（32行）</summary>

```text
/** Whether `bytes` match one supported hash of a subresource-integrity string. */
function matchesIntegrity(bytes: Uint8Array, integrity: string): boolean {
  const supported = new Set(getHashes())
  const hashes = integrity.trim().split(/\s+/u).map(token => /^(sha\d+)-([A-Za-z0-9+/=]+)/u.exec(token)).filter(match => match !== null)
  const usable = hashes.filter(([, algorithm]) => supported.has(algorithm as string))
  return usable.length > 0 && usable.some(([, algorithm, digest]) => createHash(algorithm as string).update(bytes).digest('base64') === digest)
}

/** Unpack the regular files of an npm tarball below its top directory, without `node_modules`, into memory. */
function unpack(bytes: Uint8Array, label: string, maxBytes: number): Promise<PackageFiles> {
  return new Promise((resolve, reject) => {
    const files = new Map<string, FileEntry>()
    let total = 0
    const parser = new Parser({ strict: true })
    parser.on('entry', (entry: ReadEntry) => {
      const path = PackageFiles.resolve('', entry.path.split('/').slice(1).join('/'))
      if (entry.type !== 'File' || path === undefined || path === '' || path.split('/').includes('node_modules')) {
        entry.resume()
        return
      }
      const chunks: Buffer[] = []
      entry.on('data', (chunk: Buffer) => {
        total += chunk.length
        if (total > maxBytes) parser.abort(new Error(`unpacked tarball exceeds ${maxBytes} bytes`))
        else chunks.push(chunk)
      })
      entry.on('end', () => {
        const contents = Buffer.concat(chunks)
        files.set(path, { size: contents.length, read: () => Promise.resolve(contents) })
      })
    })
    parser.on('error', (error: Error) => { reject(new Error(`${label}: ${error.message}`)) })
```

</details>

**依据 5 · 源码核查**：[scripts/host-market/vendor/fetchers.ts:100-120](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/vendor/fetchers.ts#L100-L120)

下载/身份核验。

<details>
<summary>查看原文（21行）</summary>

```text
export async function npmTarball(
  name: string, version: string, dist: { readonly tarball?: unknown; readonly integrity?: unknown } | undefined, limits: FetchLimits,
): Promise<{ files: PackageFiles; manifest: Manifest }> {
  const label = `${name}@${version}`
  if (typeof dist?.tarball !== 'string' || typeof dist.integrity !== 'string') throw new Error(`${label}: registry lists no tarball with integrity`)
  const response = await fetch(dist.tarball, { signal: AbortSignal.timeout(limits.timeoutMs) })
  if (!response.ok) throw new Error(`${label}: tarball answered HTTP ${response.status}`)
  const chunks: Uint8Array[] = []
  let total = 0
  // A successful response has a body; throwing inside the loop cancels it.
  for await (const chunk of response.body as ReadableStream<Uint8Array>) {
    total += chunk.length
    if (total > limits.maxTarballBytes) throw new Error(`${label}: tarball exceeds ${limits.maxTarballBytes} bytes`)
    chunks.push(chunk)
  }
  const bytes = Buffer.concat(chunks)
  if (!matchesIntegrity(bytes, dist.integrity)) throw new Error(`${label}: tarball does not match its registry integrity`)
  const files = await unpack(bytes, label, limits.maxTarballBytes)
  const manifest = await readManifest(files, '')
  if (manifest?.name !== name || manifest.version !== version) throw new Error(`${label}: tarball package.json does not name ${label}`)
  return { files, manifest }
```

</details>

**依据 6 · 源码核查**：[scripts/host-market/generate.mjs:348-361](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/generate.mjs#L348-L361)

格式解析。

<details>
<summary>查看原文（14行）</summary>

```text
  const selection = selectTopPlugins(eligiblePlugins, ranks, MAX_PLUGINS, featured)
  const selectedPlugins = selection.plugins
  diagnostics.push(...applyPresentation(selectedPlugins))
  const index = {
    format: 1,
    title: { en: "Bruce's Plugin Picks", zh: 'Bruce 的精选插件' },
    description: {
      en: "DSH community plugin picks by Bruce, sourced from awesome-dsh-plugin. npm metadata and Git commits are verified; inclusion is not a security review.",
      zh: 'Bruce 整理的 DSH 社区插件精选，数据来自 awesome-dsh-plugin。核实 npm 元数据与 Git 提交；收录不代表安全审查。',
    },
    metadata: applyDiscovery(selectedPlugins, ranks, { featured }),
    plugins: selectedPlugins,
  }
  parseMarketIndex(index, INDEX_URL)
```

</details>

**依据 7 · 源码核查**：[scripts/host-market/policy.mjs:1-27](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/policy.mjs#L1-L27)

发布异常门。

<details>
<summary>查看原文（27行）</summary>

```text
export const MAX_PLUGINS = 1000
export const SELECTION_POLICY = `top-${MAX_PLUGINS}-verified-plugins-by-stars-v1`

/** Refuse publishing incomplete reads, an oversized index, or a suspiciously collapsed catalog. */
export function assertPublishable({ index, fetchFailures = 0 }, previous) {
  if (fetchFailures)
    throw new Error(
      'Source lookup failed; see staging report. Published data was not replaced.',
    )
  if (!index.plugins.length)
    throw new Error(
      'No eligible bundles; see staging report. Published data was not replaced.',
    )
  if (index.plugins.length > MAX_PLUGINS) {
    throw new Error(
      `Index contains ${index.plugins.length} plugins; the published cap is ${MAX_PLUGINS}.`,
    )
  }
  const previousCount = previous
    ? Math.min(previous.plugins.length, MAX_PLUGINS)
    : 0
  if (previous && index.plugins.length < previousCount * 0.8) {
    throw new Error(
      `Index collapsed from ${previous.plugins.length} to ${index.plugins.length}; review staging diagnostics before replacing published data`,
    )
  }
}
```

</details>

**依据 8 · 源码核查**：[.github/workflows/refresh-host-market.yml:98-140](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/.github/workflows/refresh-host-market.yml#L98-L140)

artifact/hash/atomic/冲突重生成。

<details>
<summary>查看原文（43行）</summary>

```text
          python3 - <<'PYCODE'
          import hashlib, json, os
          from pathlib import Path
          root = Path('release-data')
          names = ['dsh-market-index.json', 'dsh-market-index.report.json']
          if sorted(p.name for p in root.iterdir()) != sorted(names):
              raise SystemExit('Unexpected artifact contents')
          payloads = []
          for name in names:
              path = root / name
              if path.is_symlink() or not path.is_file() or path.stat().st_size > 5 * 1024 * 1024:
                  raise SystemExit('Invalid artifact file')
              payloads.append(path.read_bytes())
          index, report = map(json.loads, payloads)
          hashes = [hashlib.sha256(body).hexdigest() for body in payloads]
          if report['indexSha256'] != hashes[0] or report['fetchFailures'] != 0 or not 0 < len(index['plugins']) <= 1000 or report['included'] != len(index['plugins']):
              raise SystemExit('Artifact consistency check failed')
          for name, body in zip(names, payloads):
              (Path('data') / name).write_bytes(body)
          release = dict(format=1, sourceSha=os.environ['SOURCE_SHA'], triggerSha=os.environ['TRIGGER_SHA'], runId=int(os.environ['RUN_ID']), indexSha256=hashes[0], auditSha256=hashes[1])
          Path('data/dsh-market-release.json').write_text(json.dumps(release, indent=2) + '\n')
          PYCODE
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add data/dsh-market-index.json data/dsh-market-index.report.json data/dsh-market-release.json
          git commit -m "data: publish validated DSH market snapshot"
          # Credentials exist only in this step; artifacts are never executed.
          gh auth setup-git
          # Never rebase validated artifacts onto different source inputs.
          if git push --atomic origin HEAD:refs/heads/main HEAD:refs/heads/market-release; then
            exit 0
          fi
          git fetch --depth=1 origin main
          if [ "$(git rev-parse FETCH_HEAD)" = "$SOURCE_SHA" ]; then
            echo "::error::Publication failed without a main update; check permissions and market-release."
            exit 1
          fi
          if [[ ! "$RETRY_COUNT" =~ ^[0-2]$ ]] || [ "$RETRY_COUNT" -ge 2 ]; then
            echo "::error::main kept moving; automatic regeneration limit reached."
            exit 1
          fi
          gh workflow run refresh-host-market.yml --ref main -f retry_count="$((RETRY_COUNT + 1))"
          echo "::notice::main moved; queued fresh generation instead of publishing stale artifacts."
```

</details>

#### 缺口

- 远端发布状态/全部Git路径和Host消费未验。
  **影响**：源码门不保证托管最新或每安装目标可用。
  **进一步探讨**：固定某次release source/hash与Host实际读取对照，Git路径另定向验。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 1000排名、编辑与验证意味着什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

selectTopPlugins先按Star/仓库/名称排序，再把featured分组放前截到max，最后重新按Star展示。所以展示可看似纯Star，但入选是编辑优先+Star混合；README“按Star前1000”不完整描述，不能当客观质量排行榜。顶限外/缺mapping不等坏插件，低Star可能更适合用户任务。

源码核bundle声明/版本范围可降低错目标，不会证明源代码安全、无恶意安装脚本、权限合理或真实任务收益；不执行tarball是生成器安全边界，而安装器后续行为不在根资源保证内。单个registry integrity只核registry给的字节不是作者可信认证。上游包/托管源会变化，固定本轮源审不等线上当前订阅，外部URL仅作为固定文档声明未访问。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/host-market/generate.mjs:60-88](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/generate.mjs#L60-L88)

featured先截再按Star展示。

<details>
<summary>查看原文（29行）</summary>

```text
/** Rank verified plugins by repository stars, then cap the published selection. */
export function selectTopPlugins(plugins, ranks, max = MAX_PLUGINS, featured = new Set()) {
  const compareText = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
  const rankOf = (plugin) => ranks.get(plugin.name) ?? { stars: -1, repo: '' }
  const compare = (a, b) => {
    const left = rankOf(a), right = rankOf(b)
    return (
      right.stars - left.stars ||
      compareText(left.repo, right.repo) ||
      compareText(a.name, b.name)
    )
  }
  const ordered = [...plugins].sort(compare)
  const featuredRepos = new Set(
    [...featured].map((name) => String(name).toLowerCase()),
  )
  const isFeatured = (plugin) => featuredRepos.has(rankOf(plugin).repo.toLowerCase())
  const selected = [
    ...ordered.filter(isFeatured),
    ...ordered.filter((plugin) => !isFeatured(plugin)),
  ]
    .slice(0, max)
    .sort(compare)
  const last = selected.at(-1)
  return {
    plugins: selected,
    eligiblePlugins: ordered.length,
    droppedByLimit: Math.max(0, ordered.length - selected.length),
    cutoffStars: last ? (rankOf(last).stars ?? -1) : null,
```

</details>

**依据 2 · 源码核查**：[scripts/host-market/generate.mjs:340-358](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/generate.mjs#L340-L358)

实际featured来源/声明。

<details>
<summary>查看原文（19行）</summary>

```text
  const featured = new Set(
    [
      ...(feed.featuredRepositories ?? []),
      ...(feed.featured?.entries ?? []).map((entry) => entry.full_name),
    ]
      .filter(Boolean)
      .map((name) => String(name).toLowerCase()),
  )
  const selection = selectTopPlugins(eligiblePlugins, ranks, MAX_PLUGINS, featured)
  const selectedPlugins = selection.plugins
  diagnostics.push(...applyPresentation(selectedPlugins))
  const index = {
    format: 1,
    title: { en: "Bruce's Plugin Picks", zh: 'Bruce 的精选插件' },
    description: {
      en: "DSH community plugin picks by Bruce, sourced from awesome-dsh-plugin. npm metadata and Git commits are verified; inclusion is not a security review.",
      zh: 'Bruce 整理的 DSH 社区插件精选，数据来自 awesome-dsh-plugin。核实 npm 元数据与 Git 提交；收录不代表安全审查。',
    },
    metadata: applyDiscovery(selectedPlugins, ranks, { featured }),
```

</details>

**依据 3 · 源码核查**：[scripts/host-market/npm.mjs:23-41](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/npm.mjs#L23-L41)

核验层级仅产物/兼容字段。

<details>
<summary>查看原文（19行）</summary>

```text
    const range = dshRange(manifest)
    const expected = version.engines?.dsh
    // npm can reorder peer keys; intersected ranges must match semantically.
    const matches = range === expected || (
      typeof range === 'string' && typeof expected === 'string' &&
      semver.subset(range, expected, { includePrerelease: true }) &&
      semver.subset(expected, range, { includePrerelease: true })
    )
    if (!isBundle(manifest) || range instanceof Error || !matches)
      throw Error(
        `${plugin.name}@${version.version}: tarball bundle/engines differ from registry metadata`,
      )
    if (!highest) highest = { files, manifest }
    evidence.push({
      name: plugin.name,
      version: version.version,
      tarball: registryManifest.dist.tarball,
      integrity: registryManifest.dist.integrity,
    })
```

</details>

**依据 4 · 源码核查**：[README.md:29-31](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/README.md#L29-L31)

资源自己声明非安全/实机保证。

```text
仅订阅官方「发现」页**无需安装 `safer-dsh-market`**；如需独立市场界面、多选安装和安装后 AI 审查，可另行安装市场插件。开启「自定义插件市场」与市场插件自己的「启用安全市场」开关是两个不同入口。

收录经过核实的 npm 目标及固定完整提交的 Git 组合包，核实 bundle 声明、时间及官方宿主兼容范围规则，因此不是完整仓库目录；收录不代表安全审查或实机兼容保证。订阅先排除未审批、归档、禁用、黑名单及无效安装来源，再将通过核验的插件按仓库 Star 数降序选取前 1000 个；官方发现页支持中英文分类（含编辑推荐）、npm/Git 与近期更新/Star 标签、关键词搜索及 Star/仓库更新时间排序。
```

#### 缺口

- 全量目标安全、真实收益/线上源漂移未核。
  **影响**：不可批量安装或把入选当批准。
  **进一步探讨**：逐目标审权限/安装脚本/固定版本，核本次订阅hash/生成时间并做单任务试验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用且不把维护成本藏起来？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

官方发现页订阅依作者声明的DSH>=0.2.1-rc.2与网络/当前profile；根无需安装市场插件。用户首次添加源并核一个候选、持续逐包看版本/权限；维护者另付GitHub/npm抓取、tarball I/O/审批/发布重试工时。没有本包收费不等用户选包/误装/模型成本为0，真实省时未测。失败保留旧发布是合理策略但可能过时，需解释读取失败，不强行清空/批装。退出关源不卸已装插件，逐包处理数据/权限。建议仅当发现线索试用，来源/兼容不清回上游。

可探索详情显示核验层级、精确来源/时间/hash与入选原因，把metadata核实、编辑入选、实机结果分栏。已有审计报告/分类/非安全提示是基线，增量是用户决策处减少误信，不是新增verified徽章。让用户在当前页面与分层说明间找同一任务候选，比较误把收录当安全、选包时间、低Star漏选与阅读负担；若现有信息等效或负担高于收益，否定。未实现。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:13-29](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/README.md#L13-L29)

订阅依赖/无需市场插件。

<details>
<summary>查看原文（17行）</summary>

````text
**适用版本：DSH V0.2.1-rc.2 及以上。** 这里的版本要求针对官方「发现」页的第三方订阅功能；各插件仍需满足详情中声明的宿主版本要求。

**订阅链接：[https://bruc3van.com/dsh-plugins/index.json](https://bruc3van.com/dsh-plugins/index.json)**

```text
https://bruc3van.com/dsh-plugins/index.json
```

1. **确认版本**：将 DSH 升级到 **V0.2.1-rc.2 或更高版本**。
2. **开启自定义市场**：打开左侧 **插件**，点击 **实验性插件** 旁的 **更多**，找到 **自定义插件市场** 并开启。启用后，插件页会显示 **已安装 / 发现** 两个标签页。
3. **打开索引源配置**：进入 **发现**。首次使用时点击 **添加索引源**；已有市场时，展开左上角的市场名称下拉菜单，选择 **管理索引源…**。
4. **添加订阅**：在 **索引 URL** 中粘贴上面的 `index.json` 地址，点击 **添加**。确认地址出现在已添加的索引源列表后，关闭弹窗；配置保存在当前 profile 中。
5. **浏览和安装**：在市场下拉菜单中选择 **Bruce 的精选插件**；如需重新读取数据，点击 **刷新**。按分类（含编辑推荐）、关键词或 npm/Git、近期更新、Star 标签查找插件，查看版本要求后再安装。

如果没有看到「发现」，请先检查 DSH 是否为 V0.2.1-rc.2 及以上版本，以及「自定义插件市场」是否已开启。只开启功能还不会自动添加本订阅源，仍需完成上面的添加步骤。

仅订阅官方「发现」页**无需安装 `safer-dsh-market`**；如需独立市场界面、多选安装和安装后 AI 审查，可另行安装市场插件。开启「自定义插件市场」与市场插件自己的「启用安全市场」开关是两个不同入口。
````

</details>

**依据 2 · 源码核查**：[scripts/host-market/policy.mjs:5-25](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/policy.mjs#L5-L25)

来源失败保旧。

<details>
<summary>查看原文（21行）</summary>

```text
export function assertPublishable({ index, fetchFailures = 0 }, previous) {
  if (fetchFailures)
    throw new Error(
      'Source lookup failed; see staging report. Published data was not replaced.',
    )
  if (!index.plugins.length)
    throw new Error(
      'No eligible bundles; see staging report. Published data was not replaced.',
    )
  if (index.plugins.length > MAX_PLUGINS) {
    throw new Error(
      `Index contains ${index.plugins.length} plugins; the published cap is ${MAX_PLUGINS}.`,
    )
  }
  const previousCount = previous
    ? Math.min(previous.plugins.length, MAX_PLUGINS)
    : 0
  if (previous && index.plugins.length < previousCount * 0.8) {
    throw new Error(
      `Index collapsed from ${previous.plugins.length} to ${index.plugins.length}; review staging diagnostics before replacing published data`,
    )
```

</details>

**依据 3 · 源码核查**：[scripts/host-market/generate.mjs:60-88](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/scripts/host-market/generate.mjs#L60-L88)

入选原因展示动机。

<details>
<summary>查看原文（29行）</summary>

```text
/** Rank verified plugins by repository stars, then cap the published selection. */
export function selectTopPlugins(plugins, ranks, max = MAX_PLUGINS, featured = new Set()) {
  const compareText = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
  const rankOf = (plugin) => ranks.get(plugin.name) ?? { stars: -1, repo: '' }
  const compare = (a, b) => {
    const left = rankOf(a), right = rankOf(b)
    return (
      right.stars - left.stars ||
      compareText(left.repo, right.repo) ||
      compareText(a.name, b.name)
    )
  }
  const ordered = [...plugins].sort(compare)
  const featuredRepos = new Set(
    [...featured].map((name) => String(name).toLowerCase()),
  )
  const isFeatured = (plugin) => featuredRepos.has(rankOf(plugin).repo.toLowerCase())
  const selected = [
    ...ordered.filter(isFeatured),
    ...ordered.filter((plugin) => !isFeatured(plugin)),
  ]
    .slice(0, max)
    .sort(compare)
  const last = selected.at(-1)
  return {
    plugins: selected,
    eligiblePlugins: ordered.length,
    droppedByLimit: Math.max(0, ordered.length - selected.length),
    cutoffStars: last ? (rankOf(last).stars ?? -1) : null,
```

</details>

**依据 4 · 源码核查**：[.github/CI.md:40-46](https://github.com/bruc3van/awesome-dsh-plugin/blob/2cc89cbe69393a84cc362d97bd4b32e3df020f93/.github/CI.md#L40-L46)

维护/发布边界。

```text
## 并发和故障恢复

- 各写入工作流保留独立 concurrency group；共享一个组会让不同类型的 pending 任务相互淘汰。工作流开始时读取最新 main，避免队列中旧事件生成旧数据。
- v1、v2、展示页、快照和扩容推送最多尝试三次。遇到 main 前进时，从新 tip 重新生成；扩容重试保留 GitHub API token。最后一次失败后不再生成一份不会推送的数据。
- 宿主发布始终使用本次验证的 artifact，`main` 和 `market-release` 同时推进；不 rebase 或强推旧产物。main 前进导致失败时，显式排队全新生成，最多自动重试两次。权限错误、dispatch 失败、重试耗尽仍报红。排队成功只表示已交接，需查看后续运行确认最终发布。
- npm 发布串行完成；digest 相同则退出，版本冲突由现有脚本重新读取 registry 并重试。取消运行不能撤销已经发送的 registry 请求。
- 工作流校验不等于发布前统一审批门：独立的 main 校验和发布入口可能并行。保护规则、npm trusted publisher 配置、外部服务可用性仍由实际远端运行确认。
```

#### 缺口

- 用户误信/单位选包成本和新展示无对照。
  **影响**：不能把源规模当采用价值。
  **进一步探讨**：独立profile单目标测完整决策/退出，做分层信息对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
