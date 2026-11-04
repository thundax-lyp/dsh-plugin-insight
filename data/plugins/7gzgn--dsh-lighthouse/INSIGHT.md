# DSH Lighthouse

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0c9f8b5](https://github.com/7gzgn/dsh-lighthouse/tree/0c9f8b581762619270dac0403fbd0a3d343c7ca0)

<!-- BEGIN META -->
[![npm 30d 839](https://img.shields.io/static/v1?label=npm+30d&message=839&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lighthouse) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lighthouse)
<!-- END META -->

> **功能**：汇总作品的本地、GitHub、市场与 npm 状态，并生成观察面板和报告。

> **亮点**：[Q01](#research-q01) 的显式名册与 [Q02](#research-q02) 的多源聚合减少来回切换的组织步骤；结果仍需对照来源。

> **主要限制**：[Q03](#research-q03) 的单页标题匹配与失败空数组可能误导 PR 状态；[Q04](#research-q04) 的无来源头放行及本地直接写入需要按部署边界核查。

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
  - [Q01 · 谁需要它，它相对手工查询改变了什么？](#detail-section-11)
  - [Q02 · 各来源如何采集、缓存和处理失败？](#detail-section-12)
  - [Q03 · PR 和仓库状态能否作为完整的收录事实？](#detail-section-13)
  - [Q04 · 状态接口和本地写入有哪些边界？](#detail-section-14)
  - [Q05 · 使用需要哪些条件、成本和停止标准？](#detail-section-15)
  - [Q06 · 怎样设计可证伪的改进方向？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个作品的开发者可以按显式名册集中查看版本、仓库和市场状态。

逐个查看本地项目、GitHub、npm 和市场也能获得部分事实；组件将它们集中展示但各来源时间和权限不同。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 作品报告 | 汇总本地和外部状态 | PR 为单页标题匹配，来源可失败 |
| 名册管理 | 显式列出作品及回填信息 | init/sync 可直接重写本地文件 |
| 状态接口 | 供 Web 面板读取报告 | 无来源头请求放行，实际可达范围待核查 |
| HTML 报告 | 生成可查看卡片 | 默认写本地，可能含敏感数据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=18 与显式名册 | 运行需要 | 启动并确定作品 | 名册无效会报错 |
| GitHub、市场、npm API | 对应数据需要 | 取各来源事实 | 失败需检查原因，PR 搜索失败会为空 |
| GitHub PAT | 可选 | 扩大 GitHub 可见范围 | 私有数据与匿名路由的组合需谨慎 |
| 宿主 Web 服务及 slots | 面板需要 | 注册状态接口和显示 | 缺失时不应假定面板可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者备份名册并只填公开作品 | 核对账号与仓库身份 |
| 采集 | 调用工具或本地面板 | 查看每源错误及缓存时间 |
| 对照 | 维护者回 GitHub 核 PR | 不以标题匹配代替确认 |
| 收尾 | 检查报告路径和监听范围 | 隐私或恢复条件不明时停止使用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | API、名册及存储资源金额未知 | 核权限、隔离和备份 | 默认报告写入本地 |
| 持续 | 多源请求、额度与磁盘成本未知 | 核 PR、源错误和缓存 | 并发不等于有超时预算 |
| 失败恢复 | 重试与文件备份成本未知 | 恢复名册并检查报告暴露范围 | 直接写入不保证原子 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多源概览 | 名册与多个采集路径聚合 | 来源是否同一时刻和真实节时 |
| PR 状态 | 单页结果按标题认领 | 完整性及精确身份 |
| 来源失败 | 部分来源返回原因 | PR 错误与空列表的区分 |

> **思考**：[Q03](#research-q03) 的单页标题匹配与失败空数组可能误导 PR 状态；[Q04](#research-q04) 的无来源头放行及本地直接写入需要按部署边界核查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的显式名册与 [Q02](#research-q02) 的多源聚合减少来回切换的组织步骤；结果仍需对照来源。

[Q02](#research-q02) 的注入式采集与成功缓存便于分源分析；[Q03](#research-q03) 与 [Q04](#research-q04) 的身份、访问和写入边界需独立处理，不能靠看板完整性推断。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的单页标题匹配与失败空数组可能误导 PR 状态；[Q04](#research-q04) 的无来源头放行及本地直接写入需要按部署边界核查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先观察并在隔离公开名册下核对接口、数据及文件恢复；监听范围或来源不明时回到官方页面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已定向核查固定源码的采集和边界；具体部署可达性、私有数据暴露及真实收益均未验证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、lib/index.js、lib/collect.js、lib/status-route.js、lib/fleet.js、lib/render.js、bin/dsh-lighthouse.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核旧场景、机制、分发、成本、采用、价值、工程、贡献、质疑和假设；定向检查多源采集、PR、状态路由、工具、名册写入与报告。未运行目标代码、网络、宿主或测试，未穷尽 Client 样式。
- 下一步：固定宿主和插件版本，使用公开测试名册及假端点检查分页、误匹配、挂起、匿名路由、文件中断和恢复。

**分析版本**

- **仓库**：[7gzgn/dsh-lighthouse](https://github.com/7gzgn/dsh-lighthouse)
- **版本号**：0.3.4（[固定提交 0c9f8b5](https://github.com/7gzgn/dsh-lighthouse/tree/0c9f8b581762619270dac0403fbd0a3d343c7ca0)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出稳定 PR 身份、受控快照、预算及原子写入的未验证方案；若隔离对照不能降低误认和恢复风险则否定。

固定宿主和插件版本，使用公开测试名册及假端点检查分页、误匹配、挂起、匿名路由、文件中断和恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 133 | 108 | 12 | — |
| .js | source | 6 | 1937 | 1477 | 353 | — |
| .md | source | 1 | 168 | — | — | 1752 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/7gzgn/dsh-lighthouse/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查作品名册驱动的多源采集、PR 身份、状态路由及本地写入边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要它，它相对手工查询改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护多个作品的开发者可以建立明确的作品名册，将本地版本、GitHub 仓库、市场收录及 npm 状态汇总到工具输出、网页观察区或本地报告。手工打开各站点和项目目录也能查询同类信息；本项目的增量是围绕显式名册集中采集与展示，减少多处查找的组织工作。不同来源和缓存并非同一时刻的快照，展示完整不等于数据准确或真正节时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-21](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/README.md#L1-L21)

作者描述观察区和数据来源。

<details>
<summary>查看原文（21行）</summary>

```text
# dsh-lighthouse（灯塔）

**一屏看清你发出去的每个作品现在怎么样了 —— 而且能点开看。**

## 界面观察区（v0.2 新增）

DSH 侧栏多一个**灯塔图标**，点开就是一块观察面板 —— 每个作品一张卡：

| 看什么 | 怎么显示 |
| --- | --- |
| 发布了没有 | ✅ 已发布 ／ ❌ 仓库不存在 ／ ❌ 读不到 |
| 市场收录 | ✅ 已收录（带下载量）／ ⏳ 收录中 ／ ❌ 读不到 |
| 收录 PR | ✅ 已合并 ／ ⏳ 等 N 小时（天）／ —— 没有 |
| 星 · 关注 · 留言 | ⭐ / 👁 / 💬 三个数字（GitHub stars / watchers / open issues） |
| 本地与推送 | 本地版本 · 文件数 · 最后推送时间 |

右上角一个「刷新」，打开面板时自动拉一次；数据来自 host 那条只读接口 `/dsh-lighthouse/status` ——
同一个数字在**面板、工具、卡片**里必然一致（走的是同一条采集路径）。

本地拿的是什么版本、GitHub 有没有动静、**市场收没收录、被下载多少次**、给收录 PR 等了多久（对比上游中位数）——
全部来自 API，**一个数字都不经模型生成**，读不到就写"读不到"。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:102-120](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/index.js#L102-L120)

报告读取名册、采集并可写文件。

<details>
<summary>查看原文（19行）</summary>

```text
export async function runReport(input = {}, ctx = undefined) {
  const fleetPath = input.fleetFile ?? defaultFleetPath();
  const read = await readFleet(fleetPath);
  if (read.ok !== true) return { ok: false, errors: read.errors, fleetPath };

  const token = await resolveToken(input.tokenFile);
  const report = await collectAll(read.fleet, {
    token,
    marketUrl: input.marketUrl ?? defaultMarketUrl(ctx),
    includeNpm: input.includeNpm !== false,
  });
  report.tokenFound = token !== null;

  let paths = { htmlPath: null, jsonPath: null };
  if (input.writeFiles !== false) {
    paths = await writeReport(report, {
      dir: input.reportDir ?? defaultReportDir(),
      html: input.html !== false,
      json: input.json === true,
```

</details>

**依据 3 · 源码核查**：[lib/collect.js:426-453](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L426-L453)

按名册组合各数据源。

<details>
<summary>查看原文（28行）</summary>

```text
export async function collectAll(fleet, deps = {}) {
  const { token = null, fetchImpl = fetch, marketUrl = DEFAULT_MARKET_URL, includeNpm = true, now = Date.now() } = deps;

  // 三份"整表"各拉一次：登记表（5MB）、我开过的 PR、上游节奏
  const [registry, prIndex, upstream] = await Promise.all([
    fetchRegistry({ marketUrl, fetchImpl }),
    collectMyPulls({ owner: fleet.owner, token, fetchImpl }),
    collectUpstream({ upstream: fleet.upstream, token, fetchImpl }),
  ]);

  // 作品之间**必须并发**：串行查 7 个作品时整条口子要 11.6 秒（实测），
  // 面板上就表现为一段很长的"读取中"；并发后总耗时≈最慢的那一个（3~4 秒）。
  const works = await Promise.all(fleet.works.map(async (work) => {
    const [local, github, npm] = await Promise.all([
      collectLocal(work),
      collectGitHub(work, { owner: fleet.owner, token, fetchImpl, prIndex }),
      // npm 包名可以和目录/GitHub 仓库名不同（例：仓库 dsh-tool-gate，npm 包 dsh-ctx-gate）。
      // 名册里给了 work.npm 就用它，否则退回 work.name。
      includeNpm ? collectNpm(work.npm ?? work.name, { fetchImpl }) : Promise.resolve({ available: false, reason: '已跳过' }),
    ]);
    const market = marketFactOf(registry, work.name);
    // 直达链接：名册显式给的优先；否则 GitHub 仓库；npm 与市场页面能确定才给（不确定就不编）。
    const links = {
      github: work.url ?? `https://github.com/${fleet.owner}/${work.repo}`,
      npm: `https://www.npmjs.com/package/${work.npm ?? work.name}`,
      market: market.listed === true ? market.page : null,
    };
    return { work, local, github, market, npm, links };
```

</details>

#### 缺口

- 未在真实多项目环境对照手工流程
  **影响**：无法量化节时或实际使用价值
  **进一步探讨**：用公开作品核对各来源、时间和人工处理时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 各来源如何采集、缓存和处理失败？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

collectAll 先并发获取市场表、作者 PR 索引和上游统计，再对名册中每项并发读取本地、GitHub 和可选 npm。市场表成功结果按地址与 fetch 实例缓存，默认五分钟；大多数来源单独返回 unavailable 和原因，以便其它数据继续展示。但 GitHub 指标字段缺失时部分使用零，本地目录遍历读不到子目录也返回零，不能把所有零都解释为已完整核查。getJson 没有传入超时或取消信号，递归目录遍历也未见预算；单一请求或深层遍历可能拖住全体 Promise，工具外层超时是否中止底层工作本次未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/collect.js:23-44](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L23-L44)

文件遍历无法读取时返回零并无深度预算。

<details>
<summary>查看原文（22行）</summary>

```text
/** 递归数文件（用于"本地有多少东西"）。 */
async function countFiles(dir) {
  let total = 0;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    let st;
    try {
      st = await stat(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) total += await countFiles(full);
    else if (st.isFile()) total += 1;
  }
  return total;
```

</details>

**依据 2 · 源码核查**：[lib/collect.js:80-96](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L80-L96)

GET 请求未传 signal 或超时。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * 发一次 GET（不写任何东西）。
 * @param {string} url 地址
 * @param {object} headers 头
 * @param {Function} fetchImpl fetch
 * @returns {Promise<{status:number, json:any}>} 响应
 */
async function getJson(url, headers, fetchImpl) {
  const res = await fetchImpl(url, { method: 'GET', headers });
  let json = null;
  try {
    const text = await res.text();
    json = text === '' ? null : JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, json };
```

</details>

**依据 3 · 源码核查**：[lib/collect.js:111-137](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L111-L137)

仓库状态和缺字段时的零默认值。

<details>
<summary>查看原文（27行）</summary>

```text
  const out = { available: false, repo: `${owner}/${work.repo}` };
  try {
    const repoRes = await getJson(`https://api.github.com/repos/${owner}/${work.repo}`, headers, fetchImpl);
    if (repoRes.status === 404) {
      out.available = true;
      out.exists = false;
      return out;
    }
    if (repoRes.status !== 200 || repoRes.json === null) {
      // 403 多半是"没带 token 走了匿名"：匿名额度 60/小时，用完就全 403（实测踩过）
      out.reason = repoRes.status === 403
        ? '读仓库失败（HTTP 403）：像是没带 token 走了匿名（匿名额度 60/小时）'
        : `读仓库失败（HTTP ${repoRes.status}）`;
      return out;
    }
    out.available = true;
    out.exists = true;
    out.stars = repoRes.json.stargazers_count ?? 0;
    out.forks = repoRes.json.forks_count ?? 0;
    // 观察区要的两项：「关注」= watchers（GitHub 的 subscribers_count）；
    // 「留言」= 开着的 issue/PR 数（open_issues_count 两者都算，够用作"有没有人说话"）
    out.watchers = repoRes.json.subscribers_count ?? 0;
    out.openIssues = repoRes.json.open_issues_count ?? 0;
    out.pushedAt = repoRes.json.pushed_at ?? null;
    out.defaultBranch = repoRes.json.default_branch ?? null;
  } catch (err) {
    out.reason = `网络失败：${err instanceof Error ? err.message : String(err)}`;
```

</details>

**依据 4 · 源码核查**：[lib/collect.js:195-207](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L195-L207)

市场失败返回不可用原因。

<details>
<summary>查看原文（13行）</summary>

```text
async function fetchRegistryUncached({ marketUrl, fetchImpl }) {
  try {
    const res = await getJson(
      `${marketUrl}/dsh-market/registry`,
      { Accept: 'application/json', Origin: marketUrl, Referer: `${marketUrl}/` },
      fetchImpl,
    );
    if (res.status !== 200 || res.json === null) return { available: false, reason: `市场接口 HTTP ${res.status}`, list: [] };
    const registry = res.json.registry ?? {};
    const list = Array.isArray(registry.plugins) ? registry.plugins : [];
    return { available: true, updated: registry.updated ?? null, count: registry.count ?? list.length, list };
  } catch (err) {
    return { available: false, reason: `市场接口不可达：${err instanceof Error ? err.message : String(err)}`, list: [] };
```

</details>

**依据 5 · 源码核查**：[lib/collect.js:218-233](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L218-L233)

仅复用有效的成功缓存。

<details>
<summary>查看原文（16行）</summary>

```text
export async function fetchRegistry({
  marketUrl = DEFAULT_MARKET_URL,
  fetchImpl = fetch,
  cacheTtlMs = REGISTRY_TTL_MS,
  now = Date.now,
} = {}) {
  let bucket = registryCache.get(fetchImpl);
  if (bucket === undefined) {
    bucket = new Map();
    registryCache.set(fetchImpl, bucket);
  }
  const hit = bucket.get(marketUrl);
  if (hit !== undefined && hit.value.available === true && now() - hit.at < cacheTtlMs) return hit.value;
  const value = await fetchRegistryUncached({ marketUrl, fetchImpl });
  bucket.set(marketUrl, { at: now(), value });
  return value;
```

</details>

**依据 6 · 源码核查**：[lib/collect.js:426-445](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L426-L445)

整表与逐作品并发组合。

<details>
<summary>查看原文（20行）</summary>

```text
export async function collectAll(fleet, deps = {}) {
  const { token = null, fetchImpl = fetch, marketUrl = DEFAULT_MARKET_URL, includeNpm = true, now = Date.now() } = deps;

  // 三份"整表"各拉一次：登记表（5MB）、我开过的 PR、上游节奏
  const [registry, prIndex, upstream] = await Promise.all([
    fetchRegistry({ marketUrl, fetchImpl }),
    collectMyPulls({ owner: fleet.owner, token, fetchImpl }),
    collectUpstream({ upstream: fleet.upstream, token, fetchImpl }),
  ]);

  // 作品之间**必须并发**：串行查 7 个作品时整条口子要 11.6 秒（实测），
  // 面板上就表现为一段很长的"读取中"；并发后总耗时≈最慢的那一个（3~4 秒）。
  const works = await Promise.all(fleet.works.map(async (work) => {
    const [local, github, npm] = await Promise.all([
      collectLocal(work),
      collectGitHub(work, { owner: fleet.owner, token, fetchImpl, prIndex }),
      // npm 包名可以和目录/GitHub 仓库名不同（例：仓库 dsh-tool-gate，npm 包 dsh-ctx-gate）。
      // 名册里给了 work.npm 就用它，否则退回 work.name。
      includeNpm ? collectNpm(work.npm ?? work.name, { fetchImpl }) : Promise.resolve({ available: false, reason: '已跳过' }),
    ]);
```

</details>

#### 缺口

- 未运行网络、限流或中断场景
  **影响**：无法确定具体超时、失败传播和数据时效
  **进一步探讨**：用受控假端点及目录结构测试挂起、拒绝与缓存刷新。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · PR 和仓库状态能否作为完整的收录事实？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

作者 PR 搜索只请求每页 50 条且没有翻页，失败或非 200 返回空数组；每个作品再以 PR 标题包含 owner/repo 子串认领第一项。标题不含仓库名可能漏匹配，相似标题可能误匹配，查询失败与无 PR 也可能同样呈空。仓库 API 的 404 被当作不存在，但缺权或私有仓库不可见也可能表现为 404，因此不能据此断言作品不存在。上游统计只抽样查询，REST 退路取 closed 样本并将其长度赋给 openCount；显示含义需核对，不能当作真实未关闭数量。使用者应回原 PR 和 GitHub 权限核实。

#### 证据与依据

**依据 1 · 源码核查**：[lib/collect.js:111-117](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L111-L117)

GitHub 404 被标为 available 且 exists false。

```text
  const out = { available: false, repo: `${owner}/${work.repo}` };
  try {
    const repoRes = await getJson(`https://api.github.com/repos/${owner}/${work.repo}`, headers, fetchImpl);
    if (repoRes.status === 404) {
      out.available = true;
      out.exists = false;
      return out;
```

**依据 2 · 源码核查**：[lib/collect.js:141-175](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L141-L175)

标题子串匹配与单页作者 PR 查询。

<details>
<summary>查看原文（35行）</summary>

```text
  if (Array.isArray(prIndex)) {
    const needle = `${owner}/${work.repo}`;
    const mine = prIndex.filter((item) => String(item.title ?? '').includes(needle));
    out.pr = mine.length > 0
      ? {
        number: mine[0].number,
        state: mine[0].state,
        title: mine[0].title,
        createdAt: mine[0].created_at,
        closedAt: mine[0].closed_at ?? null,
        mergedAt: mine[0].pull_request?.merged_at ?? null,
      }
      : null;
  }
  return out;
}

/**
 * 我开过的全部 PR（一次拉完，给每个作品认领）。失败返回 `[]`。
 * @param {object} opts 选项
 * @returns {Promise<Array>} PR 列表
 */
export async function collectMyPulls({ owner, token, fetchImpl = fetch }) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'dsh-lighthouse',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const res = await getJson(
      `https://api.github.com/search/issues?q=${encodeURIComponent(`author:${owner} type:pr`)}&per_page=50`,
      headers,
      fetchImpl,
    );
    return res.status === 200 && Array.isArray(res.json?.items) ? res.json.items : [];
```

</details>

**依据 3 · 源码核查**：[lib/collect.js:175-178](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L175-L178)

失败回空数组。

```text
    return res.status === 200 && Array.isArray(res.json?.items) ? res.json.items : [];
  } catch {
    return [];
  }
```

**依据 4 · 源码核查**：[lib/collect.js:345-377](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L345-L377)

上游样本 REST 退路对 closed 查询长度赋值 openCount。

<details>
<summary>查看原文（33行）</summary>

```text
export async function collectUpstream({ upstream, token, fetchImpl = fetch, sample = 60 }) {
  const out = { available: false, upstream: `${upstream.owner}/${upstream.repo}` };
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'dsh-lighthouse',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    // 先试 GraphQL（快约 38 倍）；不可用（没 token / 形状不对 / 网络问题）再回退 REST
    let waits = null;
    if (typeof token === 'string' && token !== '') {
      const viaGraph = await upstreamViaGraphQL({ upstream, token, fetchImpl, sample });
      if (viaGraph !== null) {
        waits = viaGraph.waits;
        out.openCount = viaGraph.openCount;
      }
    }
    if (waits === null) {
      const res = await getJson(
        `https://api.github.com/repos/${upstream.owner}/${upstream.repo}/pulls?state=closed&sort=updated&direction=desc&per_page=${sample}`,
        headers,
        fetchImpl,
      );
      if (res.status !== 200 || !Array.isArray(res.json)) {
        out.reason = `读上游 PR 失败（HTTP ${res.status}）`;
        return out;
      }
      waits = res.json
        .filter((pr) => typeof pr.merged_at === 'string' && pr.merged_at !== '')
        .map((pr) => (Date.parse(pr.merged_at) - Date.parse(pr.created_at)) / 3600000)
        .filter((h) => Number.isFinite(h) && h >= 0)
        .sort((a, b) => a - b);
      out.openCount = res.json.length;
```

</details>

#### 缺口

- 没有对真实 PR 分页、标题和权限的核对
  **影响**：无法判断当前结果漏报或误认数量
  **进一步探讨**：按仓库 URL、PR 目标和作者核对分页数据及缺权响应。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 状态接口和本地写入有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

状态路由对带 Origin 或 Referer 的请求比较 marketUrl 同源，跨源拒绝；没有来源头时直接放行，然后可解析 PAT 并采集包含本地名册和仓库信息的报告。来源头并非调用者身份认证，若该路由可被其他进程或网络客户端访问，PAT 可见的私有仓库信息和本地路径可能进入响应；可达范围取决于宿主监听、认证和网络配置，本次未验证。远端采集大多是 GET，但本地 report 默认写 HTML，fleet init 写名册，sync 回填后重写文件；writeFleet 直接 writeFile，没看到原子替换或已有文件保护，因此只读网络不等于不修改本地文件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/status-route.js:53-79](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/status-route.js#L53-L79)

来源头缺失时放行，异常来源拒绝。

<details>
<summary>查看原文（27行）</summary>

```text
  /** 从请求头里取来源（Origin 优先，其次 Referer；都没有就返回 null）。 */
  function sourceOf(request) {
    const origin = request?.headers?.origin;
    if (typeof origin === 'string' && origin !== '') return origin;
    const referer = request?.headers?.referer;
    if (typeof referer === 'string' && referer !== '') return referer;
    return null;
  }

  /**
   * 跨源来的请求一律拒掉。
   *
   * 背景（实测）：**宿主不为插件注册的路由做认证** —— `webServer.register` 没有 auth 选项，
   * 宿主根 `/` 要认证（401），插件路由却是裸的。所以准入只能自己加：
   *   · 带了来源头（界面 fetch 会带 Referer）→ 必须与市场接口同源，否则 403；
   *   · 没带来源头（curl / 本机脚本）→ 放行。这些信息本来就是公开的（仓库名、star 数），
   *     真要挡本机进程也挡不住（它直接读工程目录就行），装样子没意义。
   * 另加一层缓存兜底：界面来的请求**永远实时**（刷新按钮必须真的刷新），
   * 匿名来源的重复请求 60 秒内吃缓存。
   */
  function fromElsewhere(request) {
    const seen = sourceOf(request);
    if (seen === null) return false;
    try {
      return new URL(seen).origin !== new URL(marketUrl).origin;
    } catch {
      return true; // 来源头读不懂：当作别处来的
```

</details>

**依据 2 · 源码核查**：[lib/status-route.js:94-121](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/status-route.js#L94-L121)

路由读取名册、解析 token 并返回采集报告。

<details>
<summary>查看原文（28行）</summary>

```text
  return async function handleStatus(request, response) {
    const method = String(request?.method ?? 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
      send(response, 405, { ok: false, error: 'method-not-allowed' });
      return;
    }
    if (fromElsewhere(request)) {
      send(response, 403, { ok: false, error: 'cross-origin-denied' });
      return;
    }
    if (fromUi(request) !== true && cache !== null && now() - cache.at < cacheTtlMs) {
      send(response, 200, cache.payload);
      return;
    }
    try {
      const read = await readFleetImpl(fleetFile);
      if (read.ok !== true) {
        send(response, 200, { ok: false, errors: read.errors, fleetPath: fleetFile });
        return;
      }
      // token 允许传函数：注册路由时它还没被解析，第一次请求时再拿
      // （省得为了它把 apply 变成异步 —— 插件加载不该等网络）
      const resolvedToken = typeof token === 'function' ? await token() : token;
      // 观察区不查 npm（省一次外网往返），其余与工具走同一条采集路径
      const report = await collect(read.fleet, { token: resolvedToken, marketUrl, includeNpm: false, now: now() });
      const payload = { ok: true, report };
      cache = { at: now(), payload };
      send(response, 200, payload);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:102-120](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/index.js#L102-L120)

报告默认写出文件。

<details>
<summary>查看原文（19行）</summary>

```text
export async function runReport(input = {}, ctx = undefined) {
  const fleetPath = input.fleetFile ?? defaultFleetPath();
  const read = await readFleet(fleetPath);
  if (read.ok !== true) return { ok: false, errors: read.errors, fleetPath };

  const token = await resolveToken(input.tokenFile);
  const report = await collectAll(read.fleet, {
    token,
    marketUrl: input.marketUrl ?? defaultMarketUrl(ctx),
    includeNpm: input.includeNpm !== false,
  });
  report.tokenFound = token !== null;

  let paths = { htmlPath: null, jsonPath: null };
  if (input.writeFiles !== false) {
    paths = await writeReport(report, {
      dir: input.reportDir ?? defaultReportDir(),
      html: input.html !== false,
      json: input.json === true,
```

</details>

**依据 4 · 源码核查**：[lib/index.js:246-265](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/index.js#L246-L265)

init 校验后直接写名册。

<details>
<summary>查看原文（20行）</summary>

```text
      async execute(args) {
        const a = args ?? {};
        const action = String(a.action ?? 'show').toLowerCase();
        const fleetPath = a.fleetFile ?? cfg.fleetFile ?? defaultFleetPath();
        try {
          if (action === 'init') {
            let works;
            try {
              works = JSON.parse(String(a.works ?? ''));
            } catch {
              return { ok: false, error: 'works 不是合法 JSON 数组字符串' };
            }
            const checked = validateFleet({
              owner: a.owner,
              upstream: { owner: a.upstreamOwner, repo: a.upstreamRepo },
              works,
            });
            if (checked.ok !== true) return { ok: false, error: checked.errors.join('；') };
            await writeFleet(fleetPath, checked.fleet);
            return {
```

</details>

**依据 5 · 源码核查**：[lib/index.js:272-304](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/index.js#L272-L304)

sync 只补空字段但最终重写名册。

<details>
<summary>查看原文（33行）</summary>

```text
          if (action === 'sync') {
            // 拿本地 package.json 回填 nameZh / url，并报告"名册与仓库对不上"的情况。
            // 只补**空**字段（不覆盖你手写的），对不上的只报告、不擅自改 name/repo。
            if (read.ok !== true) return { ok: false, error: read.errors.join('；') };
            const fixed = [];
            const mismatched = [];
            const next = JSON.parse(JSON.stringify(fleet));
            for (const work of next.works) {
              if (work.localDir === null) continue;
              let manifest = null;
              try {
                const text = await readFile(join(work.localDir, 'package.json'), 'utf8');
                manifest = parseLoose(text);
              } catch {
                mismatched.push({ name: work.name, problem: `读不到 ${work.localDir}\\package.json` });
                continue;
              }
              if (manifest.name && manifest.name !== work.name) {
                mismatched.push({ name: work.name, problem: `包名是 ${manifest.name}（名册写的 ${work.name}）` });
              }
              if (!work.nameZh && typeof manifest?.dsh?.displayName === 'string' && manifest.dsh.displayName !== '') {
                work.nameZh = manifest.dsh.displayName;
                fixed.push(`${work.name} 补中文名「${work.nameZh}」`);
              }
              if (!work.url) {
                const repo = manifest.repository?.url ?? manifest.homepage ?? null;
                if (typeof repo === 'string' && repo !== '') {
                  work.url = repo.replace(/^git\+/, '').replace(/\.git$/, '');
                  fixed.push(`${work.name} 补链接 ${work.url}`);
                }
              }
            }
            if (fixed.length > 0) await writeFleet(fleetPath, next);
```

</details>

**依据 6 · 源码核查**：[lib/fleet.js:126-138](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/fleet.js#L126-L138)

写名册直接调用 writeFile。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * 写名册（建目录、格式化、带尾换行）。
 * @param {string} file 路径
 * @param {object} fleet 名册
 * @param {object} [deps] 依赖
 * @returns {Promise<string>} 实际写入的路径
 */
export async function writeFleet(file, fleet, deps = {}) {
  const write = deps.writeFileImpl ?? writeFile;
  const mk = deps.mkdirImpl ?? mkdir;
  await mk(dirname(file), { recursive: true });
  await write(file, `${JSON.stringify({ version: FLEET_VERSION, ...fleet }, null, 2)}\n`, 'utf8');
  return file;
```

</details>

**依据 7 · 源码核查**：[lib/render.js:401-413](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/render.js#L401-L413)

报告直接写 HTML 或 JSON。

<details>
<summary>查看原文（13行）</summary>

```text
export async function writeReport(report, { dir, html = true, json = false, now = Date.now() } = {}) {
  const target = dir ?? join(process.env.USERPROFILE ?? process.env.HOME ?? '.', '.dsh', 'lighthouse-reports');
  await mkdir(target, { recursive: true });
  const stamp = new Date(now).toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const out = { htmlPath: null, jsonPath: null };
  if (html) {
    out.htmlPath = join(target, `lighthouse-${stamp}.html`);
    await writeFile(out.htmlPath, renderHtml(report), 'utf8');
  }
  if (json) {
    out.jsonPath = join(target, `lighthouse-${stamp}.json`);
    await writeFile(out.jsonPath, JSON.stringify(report, null, 2), 'utf8');
  }
```

</details>

#### 缺口

- 未验证宿主绑定地址、路由访问控制和实际文件权限
  **影响**：不能断言特定部署可被远程访问或已发生泄露
  **进一步探讨**：在隔离环境检查监听与匿名请求，禁止用真实私有 PAT 做公开测试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 使用需要哪些条件、成本和停止标准？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Node 18 以上、可读名册、本地目录或相应外部 API 是执行前提，GitHub PAT 可选但会改变可见范围，Web 面板还依赖宿主 webServer 和 slots。首次需核对作品身份和权限并备份名册，持续需核对 PR 匹配、来源错误、缓存时效及报告是否包含私有数据，失败时需重新采集或恢复文件；具体费用、时延和人工时间未知。考虑路由准入和 PR 误认风险，优先观察并在隔离、仅公开资料的环境进行验证；不能确认监听范围、结果来源或文件恢复方式时停止暴露界面和写入，回到官方页面手工核对。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:35-47](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/package.json#L35-L47)

Node 版本和测试入口声明。

<details>
<summary>查看原文（13行）</summary>

```text
    "watchers",
    "pull-request",
    "observability",
    "作品看板",
    "观察区"
  ],
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node test/smoke.mjs"
  },
  "publishConfig": {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:51-68](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/index.js#L51-L68)

PAT 来源与缺失退化。

<details>
<summary>查看原文（18行）</summary>

```text
export async function resolveToken(explicit) {
  const candidates = [];
  if (typeof explicit === 'string' && explicit !== '') candidates.push(explicit);
  if (typeof process.env.DSH_SLIPWAY_TOKEN_FILE === 'string' && process.env.DSH_SLIPWAY_TOKEN_FILE !== '') {
    candidates.push(process.env.DSH_SLIPWAY_TOKEN_FILE);
  }
  candidates.push(join(homedir(), '.dsh', '.gh-token'));
  candidates.push('D:\\dsh\\.gh-token');
  for (const file of candidates) {
    try {
      const text = await readFile(file, 'utf8');
      const token = text.trim();
      if (token !== '') return token;
    } catch {
      /* 换下一个 */
    }
  }
  return null;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:136-151](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/index.js#L136-L151)

报告工具及可配置本地输出。

<details>
<summary>查看原文（16行）</summary>

```text
  if (ctx.tools !== undefined && typeof ctx.tools.register === 'function') {
    disposers.push(ctx.tools.register(defineTool({
      name: 'lighthouse_report',
      description: [
        '一屏看清每个作品的现状：本地（版本/文件数/有无自测）、GitHub（star/fork/最后推送）、市场（**是否已收录、下载量、同类排名**）、收录 PR（等了多少 vs 上游中位数），并落一张可截图的 HTML 卡片。',
        '**只读**：全部是 GET 请求；某个数据源读不到就标"读不到"，不会编数字。',
        '名册（要看守哪些作品）来自 `~/.dsh/lighthouse-fleet.json`，可用 fleetFile 指到别处。',
      ].join('\n'),
      timeoutMs: TOOL_TIMEOUT_MS,
      parameters: {
        fleetFile: { type: 'string', description: '名册文件路径（默认 ~/.dsh/lighthouse-fleet.json）' },
        reportDir: { type: 'string', description: '卡片落盘目录（默认 ~/.dsh/lighthouse-reports）' },
        html: { type: 'boolean', description: '是否落 HTML 卡片（默认 true）' },
        includeNpm: { type: 'boolean', description: '是否顺手查 npm（默认 true）' },
        marketUrl: { type: 'string', description: `市场接口根地址（默认取宿主 web 服务的 origin，即 ${defaultMarketUrl()}）` },
        tokenFile: { type: 'string', description: 'PAT 文件路径（不填则按 env / ~/.dsh / D:\\dsh 依次找）' },
```

</details>

**依据 4 · 源码核查**：[lib/index.js:340-355](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/index.js#L340-L355)

Web 服务就绪后注册状态路由。

<details>
<summary>查看原文（16行）</summary>

```text
  try {
    if (typeof ctx.inject === 'function') {
      ctx.inject(['webServer'], (host) => {
        host.effect(() => host.webServer.register({
          kind: 'exact',
          path: STATUS_ROUTE,
          handler: createStatusHandler({
            fleetFile: cfg.fleetFile ?? defaultFleetPath(),
            marketUrl: cfg.marketUrl ?? defaultMarketUrl(host),
            // 延迟解析：注册路由时还没有 token，第一次请求时再拿。
            // 注意：`resolveToken` 返回的**就是字符串**（不是 { token, from } 那种对象）——
            // 写成 `.then((found) => found.token)` 会拿到 undefined，于是整条口子**静默退化成匿名请求**；
            // 实测后果：匿名额度 60/小时一用完，7 个仓库全 403，面板上一片"读不到仓库"。
            token: () => resolveToken(cfg.tokenFile),
          }),
        }, 'dsh-lighthouse: status route'));
```

</details>

**依据 5 · 源码核查**：[lib/status-route.js:94-121](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/status-route.js#L94-L121)

请求准入和输出路径。

<details>
<summary>查看原文（28行）</summary>

```text
  return async function handleStatus(request, response) {
    const method = String(request?.method ?? 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
      send(response, 405, { ok: false, error: 'method-not-allowed' });
      return;
    }
    if (fromElsewhere(request)) {
      send(response, 403, { ok: false, error: 'cross-origin-denied' });
      return;
    }
    if (fromUi(request) !== true && cache !== null && now() - cache.at < cacheTtlMs) {
      send(response, 200, cache.payload);
      return;
    }
    try {
      const read = await readFleetImpl(fleetFile);
      if (read.ok !== true) {
        send(response, 200, { ok: false, errors: read.errors, fleetPath: fleetFile });
        return;
      }
      // token 允许传函数：注册路由时它还没被解析，第一次请求时再拿
      // （省得为了它把 apply 变成异步 —— 插件加载不该等网络）
      const resolvedToken = typeof token === 'function' ? await token() : token;
      // 观察区不查 npm（省一次外网往返），其余与工具走同一条采集路径
      const report = await collect(read.fleet, { token: resolvedToken, marketUrl, includeNpm: false, now: now() });
      const payload = { ok: true, report };
      cache = { at: now(), payload };
      send(response, 200, payload);
```

</details>

#### 缺口

- 未跑宿主、远端 API、报告或修复恢复
  **影响**：不能确定安全部署、耗时和整体成本
  **进一步探讨**：隔离公开名册验证路由访问、PR 结果、输出及备份恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样设计可证伪的改进方向？

**研究主题**：新假设与验证

#### 完整回答

可探索把每次来源响应的时间、错误和稳定 PR 身份绑定到只读快照，并为采集设置取消预算、为本地写入增加原子替换；状态接口再使用与宿主一致的身份授权。现有实现已有显式名册、部分错误和缓存，所以新增的是可审阅的身份与快照关系，以及可验证的访问和恢复边界，不是从零引入采集。用含同名 PR、分页、私有数据、挂起请求和中断写入的隔离场景对照，若误认和恢复风险没有下降或额外维护成本不成比例，则否定。方案未实现，不能把设想写成现有功能。

#### 证据与依据

**依据 1 · 源码核查**：[lib/collect.js:141-175](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L141-L175)

现有以标题匹配且最多取一页。

<details>
<summary>查看原文（35行）</summary>

```text
  if (Array.isArray(prIndex)) {
    const needle = `${owner}/${work.repo}`;
    const mine = prIndex.filter((item) => String(item.title ?? '').includes(needle));
    out.pr = mine.length > 0
      ? {
        number: mine[0].number,
        state: mine[0].state,
        title: mine[0].title,
        createdAt: mine[0].created_at,
        closedAt: mine[0].closed_at ?? null,
        mergedAt: mine[0].pull_request?.merged_at ?? null,
      }
      : null;
  }
  return out;
}

/**
 * 我开过的全部 PR（一次拉完，给每个作品认领）。失败返回 `[]`。
 * @param {object} opts 选项
 * @returns {Promise<Array>} PR 列表
 */
export async function collectMyPulls({ owner, token, fetchImpl = fetch }) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'dsh-lighthouse',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const res = await getJson(
      `https://api.github.com/search/issues?q=${encodeURIComponent(`author:${owner} type:pr`)}&per_page=50`,
      headers,
      fetchImpl,
    );
    return res.status === 200 && Array.isArray(res.json?.items) ? res.json.items : [];
```

</details>

**依据 2 · 源码核查**：[lib/collect.js:80-96](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/collect.js#L80-L96)

当前 GET 未显式传取消信号。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * 发一次 GET（不写任何东西）。
 * @param {string} url 地址
 * @param {object} headers 头
 * @param {Function} fetchImpl fetch
 * @returns {Promise<{status:number, json:any}>} 响应
 */
async function getJson(url, headers, fetchImpl) {
  const res = await fetchImpl(url, { method: 'GET', headers });
  let json = null;
  try {
    const text = await res.text();
    json = text === '' ? null : JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, json };
```

</details>

**依据 3 · 源码核查**：[lib/status-route.js:53-79](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/status-route.js#L53-L79)

现有按来源头而非身份判断。

<details>
<summary>查看原文（27行）</summary>

```text
  /** 从请求头里取来源（Origin 优先，其次 Referer；都没有就返回 null）。 */
  function sourceOf(request) {
    const origin = request?.headers?.origin;
    if (typeof origin === 'string' && origin !== '') return origin;
    const referer = request?.headers?.referer;
    if (typeof referer === 'string' && referer !== '') return referer;
    return null;
  }

  /**
   * 跨源来的请求一律拒掉。
   *
   * 背景（实测）：**宿主不为插件注册的路由做认证** —— `webServer.register` 没有 auth 选项，
   * 宿主根 `/` 要认证（401），插件路由却是裸的。所以准入只能自己加：
   *   · 带了来源头（界面 fetch 会带 Referer）→ 必须与市场接口同源，否则 403；
   *   · 没带来源头（curl / 本机脚本）→ 放行。这些信息本来就是公开的（仓库名、star 数），
   *     真要挡本机进程也挡不住（它直接读工程目录就行），装样子没意义。
   * 另加一层缓存兜底：界面来的请求**永远实时**（刷新按钮必须真的刷新），
   * 匿名来源的重复请求 60 秒内吃缓存。
   */
  function fromElsewhere(request) {
    const seen = sourceOf(request);
    if (seen === null) return false;
    try {
      return new URL(seen).origin !== new URL(marketUrl).origin;
    } catch {
      return true; // 来源头读不懂：当作别处来的
```

</details>

**依据 4 · 源码核查**：[lib/fleet.js:126-138](https://github.com/7gzgn/dsh-lighthouse/blob/0c9f8b581762619270dac0403fbd0a3d343c7ca0/lib/fleet.js#L126-L138)

当前直接写入名册。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * 写名册（建目录、格式化、带尾换行）。
 * @param {string} file 路径
 * @param {object} fleet 名册
 * @param {object} [deps] 依赖
 * @returns {Promise<string>} 实际写入的路径
 */
export async function writeFleet(file, fleet, deps = {}) {
  const write = deps.writeFileImpl ?? writeFile;
  const mk = deps.mkdirImpl ?? mkdir;
  await mk(dirname(file), { recursive: true });
  await write(file, `${JSON.stringify({ version: FLEET_VERSION, ...fleet }, null, 2)}\n`, 'utf8');
  return file;
```

</details>

#### 缺口

- 改进方案没有实现或实验
  **影响**：不能断言误认或安全风险会下降
  **进一步探讨**：对已知反例和故障注入进行隔离对照并记录代价。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
