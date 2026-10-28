# Bruce Awesome DSH Plugins

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[f85109b](https://github.com/bruc3van/awesome-dsh-plugin/tree/f85109b23772fc20811d59ded0b86c62dc73b63e)

<!-- BEGIN META -->
[![GitHub ★ 472](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=472&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bruc3van/awesome-dsh-plugin)
<!-- END META -->

> **功能**：整理 DSH 插件目录，并生成核实 npm/Git 安装目标的官方发现页订阅索引

> **亮点**：[Q02](#research-q02) 将目录目标转为宿主可读且核实安装身份的索引，保留产物依据和发布异常门禁。

> **主要限制**：[Q03](#research-q03) 元数据核验、Star和featured选择不等于安全审查、实机兼容或采用效果；索引有1000上限和编辑优先。

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
  - [Q01 · 谁使用目录，根组件是什么类型？](#detail-section-11)
  - [Q02 · 候选怎样转成宿主索引？](#detail-section-12)
  - [Q03 · verified与精选能证明安全和最佳采用价值吗？](#detail-section-13)
  - [Q04 · 怎样利用资源并检验选择解释的价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为DSH用户提供可浏览目录和官方发现页订阅，根对象是资源而非单个插件。

GitHub搜索和逐仓README确认安装目标；目录减少发现与安装身份拼接。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 可读目录/订阅索引 | 发现核实安装目标 | 不证明目标包安全或有效 |
| 发布门禁 | 阻止来源失败/异常坍缩 | 仍需线上部署与宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持自定义发现源的DSH | 订阅必需 | 读取format1索引 | 直接浏览上游目录 |
| 索引/Git/npm网络 | 相关操作必需 | 获取候选/产物 | 保留已有配置，回上游核实 |
| 候选自身宿主/权限/费用 | 安装必需 | 实现具体任务 | 不批装，先逐项核实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 读者浏览目录并选一个任务相关目标 | 来源与真实用途明确 |
| 2 | 用户在独立profile添加索引 | 发现页可读，逐项核兼容 |
| 3 | 用户核候选权限与退出 | 未知则回上游，不以收录替代审查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 索引网络与可选profile | 添加源、核一个候选 | 节时未测 |
| 持续 | 维护端Git/npm和产物读取 | 编辑/核验与用户逐包复核 | 维护工时未知 |
| 失败恢复 | 刷新/重新获取 | 解释来源失败与版本差异 | 线上恢复未验收 |
| 退出 | 已装插件仍独立存在 | 关闭源并逐插件处理 | 移除源不等于卸所有插件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 安装目标发现 | tarball/范围与format验证 | 实机成功率 |
| 选包质量 | Star/featured策略可解释 | 安全、收益与任务适配最佳性 |

> **思考**：[Q03](#research-q03) 元数据核验、Star和featured选择不等于安全审查、实机兼容或采用效果；索引有1000上限和编辑优先。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将目录目标转为宿主可读且核实安装身份的索引，保留产物依据和发布异常门禁。

[Q02](#research-q02) 产物元数据一致性核验和异常目录门禁可借鉴；[Q03](#research-q03)排名语义需展示真实编辑与Star混合机制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 元数据核验、Star和featured选择不等于安全审查、实机兼容或采用效果；索引有1000上限和编辑优先。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 可先作候选线索，独立profile只试一个任务相关目标；来源、权限或兼容不清就回上游核实，不批量安装。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

索引生成、安装声明核验与选择策略有源码支持；线上订阅/安装、安全和采用效果未验收。

- 已检查：作者 README、包清单、源码路径 README.md、scripts/host-market/generate.mjs、scripts/host-market/npm.mjs、scripts/host-market/policy.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根订阅说明与官方宿主索引生成/npm核验/选择/发布策略；未全量复核目录仓库、Git验证器或线上托管服务。
- 下一步：对同一组选包任务比较现有索引和展示核验层级/入选原因版，测误信率、选对目标时间和维护负担；不改善则停止扩展。

**分析版本**

- **仓库**：[bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin)
- **版本号**：未声明（[固定提交 f85109b](https://github.com/bruc3van/awesome-dsh-plugin/tree/f85109b23772fc20811d59ded0b86c62dc73b63e)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导明确展示核验层级和入选原因的未验证改进，用误信率与选包耗时比较；不改善则推翻。

对同一组选包任务比较现有索引和展示核验层级/入选原因版，测误信率、选对目标时间和维护负担；不改善则停止扩展。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 53 | 27403 | — | — | 985752 |
| .mjs | source | 43 | 9438 | 7887 | 1118 | — |
| .mjs | test | 8 | 899 | 867 | 29 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/bruc3van/awesome-dsh-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：目录的安装目标核验与选择策略是否足以支持读者正确采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用目录，根组件是什么类型？

**研究主题**：场景与需求

#### 完整回答

根组件是目录和订阅资源resource，不是被安装后扩展模型的插件。DSH用户可把index URL加入官方发现页，再查看候选的宿主要求；独立市场插件另行存在，README明确只订阅无需安装safer-dsh-market。合格产物是能够定位核实过的安装目标和适配范围，不能由收录仓库数推断独立可用插件数。直接GitHub搜索/上游README安装是基线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-31](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/README.md#L11-L31)

订阅流程、独立市场与核验边界

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选怎样转成宿主索引？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

generateIndex从curated v2 feed中取得command模式安装目标，区分npm和Git，按包或Git目标去重；npm核验获取tarball并检查bundle声明及宿主范围是否与registry元数据相符，保留tarball/integrity依据。候选过排除策略后由选择器截断，再构造format:1索引交给官方parseMarketIndex验证。发布策略拒绝来源读取失败、空目录、超过上限以及相对前次大幅坍缩。贡献是把可读目录变成可机读、带安装身份核验的宿主发现源，而不是新插件功能。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/host-market/generate.mjs:174-223](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/scripts/host-market/generate.mjs#L174-L223)

feed→分离目标→去重

<details>
<summary>查看原文（50行）</summary>

```text
export async function generateIndex(
  feed,
  fetchPackument,
  fetchGit = readGitTarget,
  verifyNpm,
) {
  if (feed?.schema_version !== 2 || !Array.isArray(feed.entries))
    throw new Error('Expected a curated market-v2 feed')
  const npmRanks = new Map(), gitRanks = new Map(), ranks = new Map()
  const blockedRepositories = new Set(
    (feed.excludedRepositories ?? []).map((name) => String(name).toLowerCase()),
  )
  const targets = new Map()
  const gitTargets = new Map()
  const sourceTargets = new Set()
  const diagnostics = []
  const rows = [...feed.entries, ...(feed.featured?.entries ?? [])]
  for (const row of rows) {
    if (row.packages?.mode !== 'command') continue
    const rank = {
      stars: Number.isFinite(row.stargazers_count) && row.stargazers_count >= 0
        ? row.stargazers_count : -1,
      repo: row.full_name ?? '',
      row,
    }
    for (const target of row.packages.targets ?? []) {
      const parsed = npmTarget(target.install)
      sourceTargets.add(target.install)
      if (!parsed) {
        const classified = classifyTarget(target.install)
        if (classified.kind === 'git') {
          const key = JSON.stringify(classified)
          if (!gitTargets.has(key)) {
            gitTargets.set(key, { ...classified, target: target.install })
            gitRanks.set(key, rank)
          }
        } else if (!diagnostics.some((d) => d.target === target.install))
          diagnostics.push({
            target: target.install,
            status: 'unsupported',
            ...classified,
          })
        continue
      }
      if (!targets.has(parsed.name)) {
        targets.set(parsed.name, new Set())
        npmRanks.set(parsed.name, rank)
      }
      targets.get(parsed.name).add(parsed.selector)
    }
```

</details>

**依据 2 · 源码核查**：[scripts/host-market/npm.mjs:15-41](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/scripts/host-market/npm.mjs#L15-L41)

tarball与范围核验

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

**依据 3 · 源码核查**：[scripts/host-market/generate.mjs:348-375](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/scripts/host-market/generate.mjs#L348-L375)

索引构造/官方解析及失败计数

<details>
<summary>查看原文（28行）</summary>

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
  return {
    index,
    diagnostics,
    candidates: entries.length + gitEntries.length,
    npmCandidates: entries.length,
    gitCandidates: gitEntries.length,
    uniqueTargets: sourceTargets.size,
    npmEvidence: results.flatMap((r) => r.evidence ?? []),
    gitEvidence: gitResults.flatMap((r) => r.evidence),
    selection,
    repositoryExclusions,
    fetchFailures: [...results, ...gitResults].filter(
      (result) => result.fetchFailed,
    ).length,
```

</details>

**依据 4 · 源码核查**：[scripts/host-market/policy.mjs:4-25](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/scripts/host-market/policy.mjs#L4-L25)

发布门禁

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · verified与精选能证明安全和最佳采用价值吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。npm核验针对身份、bundle和兼容声明，不运行目标包，也不审计全部行为或收益。排序先按仓库Star，再让featured仓库优先进入截断集合，最终仍Star排序，且硬上限1000。因而README“按Star选前1000”需要连同编辑优先规则理解；关注度与编者选择不证明安全、实际宿主可用或相对任务最佳。来源失败使生成命令失败只是发布链门禁，本轮未运行线上订阅端到端，不能确认当前托管状态。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/host-market/npm.mjs:23-34](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/scripts/host-market/npm.mjs#L23-L34)

只对声明一致性作核验

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[scripts/host-market/generate.mjs:60-88](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/scripts/host-market/generate.mjs#L60-L88)

Star、featured优先与截断

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

**依据 3 · 源码核查**：[scripts/host-market/policy.mjs:1-25](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/scripts/host-market/policy.mjs#L1-L25)

上限/失败/坍缩门禁

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[scripts/host-market/generate.mjs:353-361](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/scripts/host-market/generate.mjs#L353-L361)

索引自己声明非安全审查

```text
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

#### 缺口

- 实际宿主订阅、安装成功率与编辑选择效果无本轮验收
  **影响**：不能把元数据核验升级为安全或采用排名
  **进一步探讨**：用独立profile核一个安装目标及关闭订阅路径，逐包审阅任务与权限

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样利用资源并检验选择解释的价值？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

需要支持自定义发现源的DSH、可达索引和每个候选自身依赖。读者可先浏览目录，独立profile订阅并只选一个真实任务相关目标；若兼容/来源或权限说不清，回上游核查而不批装。维护者承担Git/npm网络、tarball读取、分类和编辑核验；用户承担插件自身成本，本轮无全周期测量。由Star与featured混合选择推导未验证假设：直接展示“身份已核、兼容仅声明、编辑入选原因”可减少用户误把收录当安全认证。比较现有索引与加解释版本的选包任务，测误信安全/兼容的比例和找对目标耗时；未改善或增加维护不值得时否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-31](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/README.md#L21-L31)

用户配置和逐插件条件

<details>
<summary>查看原文（11行）</summary>

```text
1. **确认版本**：将 DSH 升级到 **V0.2.1-rc.2 或更高版本**。
2. **开启自定义市场**：打开左侧 **插件**，点击 **实验性插件** 旁的 **更多**，找到 **自定义插件市场** 并开启。启用后，插件页会显示 **已安装 / 发现** 两个标签页。
3. **打开索引源配置**：进入 **发现**。首次使用时点击 **添加索引源**；已有市场时，展开左上角的市场名称下拉菜单，选择 **管理索引源…**。
4. **添加订阅**：在 **索引 URL** 中粘贴上面的 `index.json` 地址，点击 **添加**。确认地址出现在已添加的索引源列表后，关闭弹窗；配置保存在当前 profile 中。
5. **浏览和安装**：在市场下拉菜单中选择 **Bruce 的精选插件**；如需重新读取数据，点击 **刷新**。按分类（含编辑推荐）、关键词或 npm/Git、近期更新、Star 标签查找插件，查看版本要求后再安装。

如果没有看到「发现」，请先检查 DSH 是否为 V0.2.1-rc.2 及以上版本，以及「自定义插件市场」是否已开启。只开启功能还不会自动添加本订阅源，仍需完成上面的添加步骤。

仅订阅官方「发现」页**无需安装 `safer-dsh-market`**；如需独立市场界面、多选安装和安装后 AI 审查，可另行安装市场插件。开启「自定义插件市场」与市场插件自己的「启用安全市场」开关是两个不同入口。

收录经过核实的 npm 目标及固定完整提交的 Git 组合包，核实 bundle 声明、时间及官方宿主兼容范围规则，因此不是完整仓库目录；收录不代表安全审查或实机兼容保证。订阅先排除未审批、归档、禁用、黑名单及无效安装来源，再将通过核验的插件按仓库 Star 数降序选取前 1000 个；官方发现页支持中英文分类（含编辑推荐）、npm/Git 与近期更新/Star 标签、关键词搜索及 Star/仓库更新时间排序。
```

</details>

**依据 2 · 源码核查**：[scripts/host-market/generate.mjs:60-88](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/scripts/host-market/generate.mjs#L60-L88)

选择来源为假设依据

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

**依据 3 · 源码核查**：[scripts/host-market/npm.mjs:15-41](https://github.com/bruc3van/awesome-dsh-plugin/blob/f85109b23772fc20811d59ded0b86c62dc73b63e/scripts/host-market/npm.mjs#L15-L41)

核验真实范围

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

#### 缺口

- 选择解释是否减少误信、订阅相对搜索的节时及维护工时未知
  **影响**：不能证明目录改善采用决策
  **进一步探讨**：同一组候选选择任务做盲比，记录来源核对与错误安装意图

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
