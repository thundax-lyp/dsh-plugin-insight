# dsh-lighthouse

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[d72f8ac](https://github.com/7gzgn/dsh-lighthouse/tree/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：按显式名册汇总作品本地、GitHub、市场、npm和PR等待，提供面板/工具/CLI及落盘卡片。

> **核心亮点**：显式作品名册结合多源状态与可点击看板，少手工切平台。详见[Q01](#research-q01)。

> **风险与缺陷**：PR首50标题匹配/失败空、无来源HTTP放行可能暴露PAT可见私有信息，无预算遍历与直接覆盖写需补。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 灯塔回答什么，统一采集是否等于同一时刻事实？](#detail-section-11)
  - [Q02 · 身份、认证和读写边界是什么？](#detail-section-12)
  - [Q03 · GitHub和PR数字在哪些条件下站不住？](#detail-section-13)
  - [Q04 · 状态HTTP接口能保证只给可信读者吗？](#detail-section-14)
  - [Q05 · 采集和落盘的资源/恢复成本有哪些？](#detail-section-15)
  - [Q06 · 测试与前端行为有什么证据？](#detail-section-16)
  - [Q07 · 推荐结论和继续探讨路径？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多作品发布后的收录与使用线索跟踪。详见[Q01](#research-q01)。

手工多平台/API查询与表格，当前不是发布验收或SLA监测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 多源报告 | 发布后概览 | 身份/完整性需核 |
| 名册管理 | 显式选择/补空 | 本地直接覆盖 |
| 状态面板 | 一键查看 | 无来源准入/PAT数据 |
| CLI/卡片 | 离线分享 | 敏感持久材料 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node/DSH工具slot | 入口 | ABI匹配 |
| 显式名册/本地路径 | 作品选择 | 无发现/需可信 |
| GitHub PAT/网络 | 远端来源 | 权限/限额/私有数据 |
| webServer/市场 | 状态口/登记表 | 准入与origin耦合 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 备份并建显式名册 | 用户 | owner/repo真实 |
| 核token/路由范围 | 用户 | 私有数据受控 |
| 采集查看分源状态 | 工具/用户 | 失败不按无事实 |
| 对照PR身份与完整性 | 用户 | 决策有原始来源 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 名册/PAT、本地目录、市场访问与报告存储资源；金额未知 | 明确作品/私有数据/最小权限、备份原名册，工时未知 | 远端无mutation不等本地不写；默认report会落HTML |
| 持续使用 | 多API/目录遍历、缓存与报告磁盘；结果token及API额度另计 | 核PR身份、源错误、缓存与数据完整性，实际工时未知 | 没有模型生成数字不等总费用为零；真实时延/节时未量化 |
| 失败恢复 | 名册/报告备份和重新采集资源；重试可能仍悬挂或覆盖 | 分别处理无预算查询、误覆盖、私有报告外发 | 按实际文件/请求状态恢复；资源金额与恢复时间未知 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| 多源概览 | 统一采集 | 非同时间快照 |
| PR等待 | 近期样本对照 | 标题认领/分页/失败空 |
| 读不到区分 | 分源错误 | CLI总0/私有404仍偏差 |

> **思考**：PR首50标题匹配/失败空、无来源HTTP放行可能暴露PAT可见私有信息，无预算遍历与直接覆盖写需补。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：显式作品名册结合多源状态与可点击看板，少手工切平台。详见[Q01](#research-q01)。

显式作品名册结合多源状态与可点击看板，少手工切平台。详见[Q01](#research-q01)。

多源可注入/缓存可借鉴，需精确身份/准入/预算与原子持久化。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

PR首50标题匹配/失败空、无来源HTTP放行可能暴露PAT可见私有信息，无预算遍历与直接覆盖写需补。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，公开本机使用也核PR/权限/失败状态。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

聚合/错误隔离可查，PR认领、无来源路由权限与采集/写盘预算缺口影响可靠采用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/collect.js、lib/fleet.js、lib/status-route.js、lib/render.js、client.js、bin/dsh-lighthouse.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整host/collect/fleet/status/CLI，client取数与render关键链，未穷尽动画/布局，不运行网络/测试/目标。
- 下一步：优先从PR身份/搜索失败/无来源并发/链接环/同秒覆盖核快照契约。

**分析版本**

- **仓库**：[7gzgn/dsh-lighthouse](https://github.com/7gzgn/dsh-lighthouse)
- **版本号**：0.3.3（[固定提交 d72f8ac](https://github.com/7gzgn/dsh-lighthouse/tree/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究可追溯快照/精确PR身份和受控有界采集写入，比较误诊/披露/恢复成本，尚未验证。详见[Q07](#research-q07)。

优先从PR身份/搜索失败/无来源并发/链接环/同秒覆盖核快照契约。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 131 | 106 | 12 | — |
| .js | source | 6 | 1914 | 1460 | 347 | — |
| .md | source | 1 | 168 | — | — | 1752 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-lighthouse/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-lighthouse/issues?q=is%3Aissue+created%3A2026-09-22T07%3A35%3A53.691Z..2026-10-22T07%3A35%3A53.691Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-lighthouse/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A35%3A53.691Z..2026-10-22T07%3A35%3A53.691Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多源作品看板如何认领事实，权限/完整性/数据时间与本地写入的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 灯塔回答什么，统一采集是否等于同一时刻事实？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向维护多个已发布作品的人，显式名册指定owner/repo/localDir，用侧栏面板、模型report和独立CLI查看本地版本/文件数、GitHub仓库/关注、市场收录下载、npm发布与PR等待比较。少在多平台切换和手工汇总，贡献是按作品聚合来源、保留单源错误和人类可读卡片，不是自动发布或认领作品。

共享collectAll可减少计算口径漂移，但每入口各自发请求，面板跳过npm、匿名路由缓存60秒而市场缓存5分钟，采集也非跨API一致快照，不能按README“数字必然一致”理解同一时刻保证。hasSmoke只是存在test/smoke.mjs，不是运行通过；本地版本/文件数和pushedAt也不能证明本地与远端同一提交。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-22](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/README.md#L17-L22)

共享数字主张。

```text
右上角一个「刷新」，打开面板时自动拉一次；数据来自 host 那条只读接口 `/dsh-lighthouse/status` ——
同一个数字在**面板、工具、卡片**里必然一致（走的是同一条采集路径）。

本地拿的是什么版本、GitHub 有没有动静、**市场收没收录、被下载多少次**、给收录 PR 等了多久（对比上游中位数）——
全部来自 API，**一个数字都不经模型生成**，读不到就写"读不到"。

```

**依据 2 · 源码核查**：[lib/collect.js:49-75](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L49-L75)

本地文件和smoke存在。

<details>
<summary>查看原文（27行）</summary>

```text
 * @param {object} work 名册条目
 * @returns {Promise<object>} 本地事实
 */
export async function collectLocal(work) {
  if (work.localDir === null) return { available: false, reason: '名册里没有 localDir' };
  const dir = work.localDir;
  const out = { available: true, dir };
  try {
    const text = await readFile(join(dir, 'package.json'), 'utf8');
    const manifest = parseLoose(text);
    out.name = manifest.name ?? null;
    out.version = manifest.version ?? null;
    out.compatible = Object.keys(manifest?.dsh?.compatibility?.dshReleases ?? {});
    // 中文显示名：优先 dsh.displayName（插件自己声明），也顺手带出 homepage 当直达链接的候选
    out.displayName = typeof manifest?.dsh?.displayName === 'string' ? manifest.dsh.displayName : null;
    out.homepage = typeof manifest.homepage === 'string' ? manifest.homepage : null;
  } catch (err) {
    out.available = false;
    out.reason = `读不到 package.json：${err instanceof Error ? err.message : String(err)}`;
    return out;
  }
  out.files = await countFiles(dir);
  try {
    const st = await stat(join(dir, 'test', 'smoke.mjs'));
    out.hasSmoke = st.isFile();
  } catch {
    out.hasSmoke = false;
```

</details>

**依据 3 · 源码核查**：[lib/collect.js:420-478](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L420-L478)

并行采集和汇总。

<details>
<summary>查看原文（59行）</summary>

```text
 * @returns {Promise<object>} 报告
 */
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
      includeNpm ? collectNpm(work.name, { fetchImpl }) : Promise.resolve({ available: false, reason: '已跳过' }),
    ]);
    const market = marketFactOf(registry, work.name);
    // 直达链接：名册显式给的优先；否则 GitHub 仓库；npm 与市场页面能确定才给（不确定就不编）。
    const links = {
      github: work.url ?? `https://github.com/${fleet.owner}/${work.repo}`,
      npm: `https://www.npmjs.com/package/${work.name}`,
      market: market.listed === true ? market.page : null,
    };
    return { work, local, github, market, npm, links };
  }));

  const waiting = works
    .map((w) => w.github.pr)
    // 用 `!= null` 同时挡 null 与 undefined：prIndex 为空时 collectGitHub 根本不会挂 pr 字段
    .filter((pr) => pr != null && pr.state === 'open')
    .map((pr) => (now - Date.parse(pr.createdAt)) / 3600000);

  return {
    generatedAt: new Date(now).toISOString(),
    owner: fleet.owner,
    upstream,
    market: {
      url: marketUrl,
      available: registry.available === true,
      updated: registry.updated ?? null,
      count: registry.count ?? null,
      reason: registry.reason ?? null,
    },
    works,
    summary: {
      works: works.length,
      published: works.filter((w) => w.github.exists === true).length,
      listed: works.filter((w) => w.market?.listed === true).length,
      totalDownloads: works.reduce((sum, w) => sum + (w.market?.listed === true ? Number(w.market.downloads ?? 0) : 0), 0),
      totalStars: works.reduce((sum, w) => sum + Number(w.github.stars ?? 0), 0),
      openPrs: waiting.length,
      longestWaitHours: waiting.length > 0 ? Math.max(...waiting) : null,
    },
  };
}
```

</details>

**依据 4 · 源码核查**：[lib/status-route.js:111-120](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/status-route.js#L111-L120)

面板不查npm。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 身份、认证和读写边界是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

validateFleet要求显式owner/非空works并规范空字段，名册同步只补nameZh/url空值、包名不一致只报告。GitHub PAT按显式tokenFile/env文件/默认home文件读，Bearer只构造到固定GitHub API；市场url可来自宿主getOrigin或输入，发Origin/Referer而不带PAT。npm固定registry。defineTool导入失败退恒等便于CLI，但不证明缺宿主契约仍可正常工具注册。

“只读”应限定远端无mutation。collectUpstream有GraphQL POST，只包含query不写业务，不符合所有请求GET字面；fleet init/sync写本地名册，report默认写HTML，CLI可JSON。工具参数fleetFile/reportDir/localDir/tokenFile没有工作区root限制，使用者应明确这些文件访问/覆盖不是无副作用。Node>=18、DSH0.2系工具/slot、可选webServer、已有GitHub权限、可达市场/npm和本地目录为实际依赖。

#### 证据与依据

**依据 1 · 源码核查**：[lib/fleet.js:42-95](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/fleet.js#L42-L95)

显式校验。

<details>
<summary>查看原文（54行）</summary>

```text
 */
export function validateFleet(data) {
  const errors = [];
  if (data === null || typeof data !== 'object') {
    return { ok: false, errors: ['名册不是对象'] };
  }
  const owner = data.owner;
  if (typeof owner !== 'string' || owner.trim() === '') {
    errors.push('名册缺 owner（GitHub 账号）—— 不猜，必须显式写');
  }
  if (!Array.isArray(data.works) || data.works.length === 0) {
    errors.push('名册的 works 必须是非空数组');
  } else {
    data.works.forEach((work, index) => {
      if (work === null || typeof work !== 'object') {
        errors.push(`works[${index}] 不是对象`);
        return;
      }
      if (typeof work.name !== 'string' || work.name.trim() === '') errors.push(`works[${index}] 缺 name`);
      if (typeof work.repo !== 'string' || work.repo.trim() === '') errors.push(`works[${index}] 缺 repo`);
      if (work.localDir !== undefined && typeof work.localDir !== 'string') errors.push(`works[${index}] 的 localDir 必须是字符串`);
      if (work.nameZh !== undefined && typeof work.nameZh !== 'string') errors.push(`works[${index}] 的 nameZh 必须是字符串`);
      if (work.url !== undefined && typeof work.url !== 'string') errors.push(`works[${index}] 的 url 必须是字符串`);
      if (work.mirrors !== undefined && !Array.isArray(work.mirrors)) errors.push(`works[${index}] 的 mirrors 必须是数组`);
    });
  }
  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    errors: [],
    fleet: {
      version: typeof data.version === 'number' ? data.version : FLEET_VERSION,
      owner: owner.trim(),
      upstream: {
        owner: data.upstream?.owner ?? 'awesome-dsh-plugin',
        repo: data.upstream?.repo ?? 'awesome-dsh-plugin',
        branch: data.upstream?.branch ?? 'main',
      },
      works: data.works.map((work) => ({
        name: work.name.trim(),
        repo: work.repo.trim(),
        category: typeof work.category === 'string' ? work.category : null,
        localDir: typeof work.localDir === 'string' && work.localDir !== '' ? work.localDir : null,
        /** 中文显示名（不填就退回 package.json 的 dsh.displayName，再退回英文名）。 */
        nameZh: typeof work.nameZh === 'string' && work.nameZh.trim() !== '' ? work.nameZh.trim() : null,
        /** 直达链接（不填就按 owner/repo 生成 GitHub 地址）。 */
        url: typeof work.url === 'string' && work.url.trim() !== '' ? work.url.trim() : null,
        /** 额外的发布源（例如 Gitee / GitLab / npm），形如 { platform, url }。 */
        mirrors: Array.isArray(work.mirrors)
          ? work.mirrors
            .filter((m) => m !== null && typeof m === 'object' && typeof m.url === 'string' && m.url !== '')
            .map((m) => ({ platform: typeof m.platform === 'string' ? m.platform : 'other', url: m.url }))
          : [],
      })),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:51-66](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/index.js#L51-L66)

token候选。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:98-126](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/index.js#L98-L126)

报告落盘。

<details>
<summary>查看原文（29行）</summary>

```text
 * 跑一次报告（工具与 CLI 共用）。
 * @param {object} input 参数
 * @returns {Promise<object>} `{ ok, report, htmlPath, jsonPath, errors }`
 */
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
    });
  }
  return { ok: true, report, ...paths, fleetPath };
}

/**
```

</details>

**依据 4 · 源码核查**：[lib/index.js:270-323](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/index.js#L270-L323)

sync补空。

<details>
<summary>查看原文（54行）</summary>

```text
          const read = await readFleet(fleetPath);
          const fleet = read.fleet;
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
            return {
              ok: true,
              data: {
                action: 'sync',
                fleetPath,
                updated: fixed,
                mismatched,
                count: next.works.length,
              },
            };
          }
          return {
            ok: true,
            data: {
              action: 'show',
              fleetPath,
              owner: fleet?.owner ?? null,
              count: fleet?.works?.length ?? 0,
              names: (fleet?.works ?? []).map((w) => w.name),
```

</details>

**依据 5 · 源码核查**：[lib/collect.js:291-335](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L291-L335)

GraphQL POST query。

<details>
<summary>查看原文（45行）</summary>

```text
  let json = null;
  try {
    const text = await res.text();
    json = text === '' ? null : JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, json };
}

/**
 * 用 GraphQL 取上游的合并节奏：**只要两个时间字段**。
 *
 * 为什么值得单独开一条路（2026-10-17 实测）：REST 的
 * `pulls?state=closed&sort=updated&per_page=60` 要 **49 秒** —— 时间全花在传那一大坨
 * PR 对象上（每个 PR 自带几十个字段）；GraphQL 只回 `createdAt/mergedAt`，
 * 100 条只要 **1.3 秒**（快约 38 倍）。这是整条数据口最大的瓶颈。
 *
 * @returns {Promise<{waits:number[], openCount:number|null}|null>} 不可用返回 null（调用方回退 REST）
 */
async function upstreamViaGraphQL({ upstream, token, fetchImpl, sample }) {
  try {
    const query = 'query($owner:String!,$name:String!,$n:Int!){repository(owner:$owner,name:$name){'
      + 'merged:pullRequests(last:$n,states:MERGED){nodes{createdAt mergedAt}}'
      + 'open:pullRequests(states:OPEN){totalCount}}}';
    const res = await postJson('https://api.github.com/graphql', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'dsh-lighthouse',
      Authorization: `Bearer ${token}`,
    }, {
      query,
      variables: { owner: upstream.owner, name: upstream.repo, n: sample },
    }, fetchImpl);
    if (res.status !== 200 || res.json === null) return null;
    const repo = res.json?.data?.repository;
    const nodes = repo?.merged?.nodes;
    if (!Array.isArray(nodes)) return null;
    const waits = nodes
      .map((node) => (Date.parse(node.mergedAt) - Date.parse(node.createdAt)) / 3600000)
      .filter((h) => Number.isFinite(h) && h >= 0)
      .sort((a, b) => a - b);
    if (waits.length === 0) return null;
    const openCount = Number.isFinite(repo?.open?.totalCount) ? repo.open.totalCount : null;
    return { waits, openCount };
```

</details>

**依据 6 · 源码核查**：[package.json:82-92](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/package.json#L82-L92)

peer范围。

<details>
<summary>查看原文（11行）</summary>

```text
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-client-ui-slots": {
      "optional": true
    },
    "@deepseek-ai/dsh-system-prompt": {
      "optional": true
    },
    "@deepseek-ai/dsh-tools": {
      "optional": true
    }
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · GitHub和PR数字在哪些条件下站不住？

**研究主题**：缺陷与关键质疑

#### 完整回答

repo API404直接exists=false，未区分私有仓无权可见；200缺stars/forks字段用0，形状未严格校验。403解释为“像没带token走匿名”只是猜测，其他权限/限额亦可触发。PR索引搜索author:type:pr首50，无上游repo过滤/翻页，失败返回[]无不可用状态；每work仅按title包含owner/repo选第一项，不验证PR目标/内容，子串相似也可误领。因而“无PR”可能漏分页/搜索失败，旧无关PR也可能被认领，不能据此催上游。

GraphQL上游取last:n merged，REST退化取最近updated的closed再筛merged，两种样本口径不同；REST把closed返回长度填openCount，语义错误。median取上中位且没有类型/复杂度分层，等待超中位不是异常/SLA证明。PR匹配和上游样本都需明示来源/完整性，open issue计数包括PR不是纯留言人数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/collect.js:104-159](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L104-L159)

仓库缺值/PR标题认领。

<details>
<summary>查看原文（56行）</summary>

```text
 */
export async function collectGitHub(work, { owner, token, fetchImpl = fetch, prIndex = null }) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'dsh-lighthouse',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
    return out;
  }

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
```

</details>

**依据 2 · 源码核查**：[lib/collect.js:166-184](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L166-L184)

首50/失败空。

<details>
<summary>查看原文（19行）</summary>

```text
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
  } catch {
    return [];
  }
}

/**
 * 把市场登记表拉一次（要同源头，否则被拒 —— 实测）。
 * @param {object} opts 选项
 * @returns {Promise<object>} `{ available, updated, count, list, reason }`
```

</details>

**依据 3 · 源码核查**：[lib/collect.js:307-395](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L307-L395)

两种样本和openCount。

<details>
<summary>查看原文（89行）</summary>

```text
 * 100 条只要 **1.3 秒**（快约 38 倍）。这是整条数据口最大的瓶颈。
 *
 * @returns {Promise<{waits:number[], openCount:number|null}|null>} 不可用返回 null（调用方回退 REST）
 */
async function upstreamViaGraphQL({ upstream, token, fetchImpl, sample }) {
  try {
    const query = 'query($owner:String!,$name:String!,$n:Int!){repository(owner:$owner,name:$name){'
      + 'merged:pullRequests(last:$n,states:MERGED){nodes{createdAt mergedAt}}'
      + 'open:pullRequests(states:OPEN){totalCount}}}';
    const res = await postJson('https://api.github.com/graphql', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'dsh-lighthouse',
      Authorization: `Bearer ${token}`,
    }, {
      query,
      variables: { owner: upstream.owner, name: upstream.repo, n: sample },
    }, fetchImpl);
    if (res.status !== 200 || res.json === null) return null;
    const repo = res.json?.data?.repository;
    const nodes = repo?.merged?.nodes;
    if (!Array.isArray(nodes)) return null;
    const waits = nodes
      .map((node) => (Date.parse(node.mergedAt) - Date.parse(node.createdAt)) / 3600000)
      .filter((h) => Number.isFinite(h) && h >= 0)
      .sort((a, b) => a - b);
    if (waits.length === 0) return null;
    const openCount = Number.isFinite(repo?.open?.totalCount) ? repo.open.totalCount : null;
    return { waits, openCount };
  } catch {
    return null;
  }
}

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
    }
    if (waits.length === 0) {
      out.reason = '样本里没有已合并的 PR';
      return out;
    }
    out.available = true;
    out.samples = waits.length;
    out.medianHours = waits[Math.floor(waits.length / 2)];
    out.minHours = waits[0];
    out.maxHours = waits[waits.length - 1];
    return out;
  } catch (err) {
    out.reason = `网络失败：${err instanceof Error ? err.message : String(err)}`;
    return out;
  }
}

/**
 * npm 上有没有这个包（只回答有/没有/查不动）。
 * @param {string} name 包名
 * @param {object} opts 选项
 * @returns {Promise<object>} npm 事实
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 状态HTTP接口能保证只给可信读者吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

接口仅拒非GET/HEAD及与marketUrl不同源的Origin/Referer；无来源头直接放行，不检查socket peer/Host/身份。Origin同源是浏览器上下文线索而非可信账户，非浏览器可省略/伪造。同源UI跳过匿名60秒缓存，且没有in-flight去重，反复请求可借PAT重复采集；并发匿名冷请求也各自采集。不能以作者“公开仓库数字”为由假设所有返回公开，因为PAT可能能读私有仓、报告含本地绝对路径和配置错误。实际远端可达仍取决宿主监听/外层准入，本次不宣称已复现攻击。

marketUrl同时当采集目的地和准入基准，若显式改成非宿主市场同源，合法面板Referer会被拒；缺/坏url可导致带来源全拒而无来源仍放行。HEAD也执行全部采集并send body，没有专门轻量路径。建议可信本机且敏感数据边界清楚才考虑开路由，不能用无来源推本机。

#### 证据与依据

**依据 1 · 源码核查**：[lib/status-route.js:51-93](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/status-route.js#L51-L93)

来源规则/同源识别。

<details>
<summary>查看原文（43行）</summary>

```text
  let cache = null; // { at, payload }

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
    }
  }

  /** 这次请求是不是界面（同源）来的。 */
  function fromUi(request) {
    const seen = sourceOf(request);
    if (seen === null) return false;
    try {
      return new URL(seen).origin === new URL(marketUrl).origin;
    } catch {
      return false;
    }
  }

```

</details>

**依据 2 · 源码核查**：[lib/status-route.js:95-125](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/status-route.js#L95-L125)

准入/缓存/采集。

<details>
<summary>查看原文（31行）</summary>

```text
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
    } catch (err) {
      send(response, 500, { ok: false, error: err instanceof Error ? err.message : String(err) });
    }
  };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:348-365](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/index.js#L348-L365)

路由实际注册/PAT。

<details>
<summary>查看原文（18行）</summary>

```text
            marketUrl: cfg.marketUrl ?? defaultMarketUrl(host),
            // 延迟解析：注册路由时还没有 token，第一次请求时再拿。
            // 注意：`resolveToken` 返回的**就是字符串**（不是 { token, from } 那种对象）——
            // 写成 `.then((found) => found.token)` 会拿到 undefined，于是整条口子**静默退化成匿名请求**；
            // 实测后果：匿名额度 60/小时一用完，7 个仓库全 403，面板上一片"读不到仓库"。
            token: () => resolveToken(cfg.tokenFile),
          }),
        }, 'dsh-lighthouse: status route'));
      });
    }
  } catch {
    /* 没有 web server 的表面（例如纯 CLI）：观察区缺席，其它能力不受影响 */
  }

  if (cfg.announceToAgent !== false && ctx.systemPrompt !== undefined
    && typeof ctx.systemPrompt.section === 'function') {
    disposers.push(ctx.systemPrompt.section({
      name: 'plugin:lighthouse',
```

</details>

**依据 4 · 源码核查**：[lib/collect.js:49-75](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L49-L75)

本地路径入报告。

<details>
<summary>查看原文（27行）</summary>

```text
 * @param {object} work 名册条目
 * @returns {Promise<object>} 本地事实
 */
export async function collectLocal(work) {
  if (work.localDir === null) return { available: false, reason: '名册里没有 localDir' };
  const dir = work.localDir;
  const out = { available: true, dir };
  try {
    const text = await readFile(join(dir, 'package.json'), 'utf8');
    const manifest = parseLoose(text);
    out.name = manifest.name ?? null;
    out.version = manifest.version ?? null;
    out.compatible = Object.keys(manifest?.dsh?.compatibility?.dshReleases ?? {});
    // 中文显示名：优先 dsh.displayName（插件自己声明），也顺手带出 homepage 当直达链接的候选
    out.displayName = typeof manifest?.dsh?.displayName === 'string' ? manifest.dsh.displayName : null;
    out.homepage = typeof manifest.homepage === 'string' ? manifest.homepage : null;
  } catch (err) {
    out.available = false;
    out.reason = `读不到 package.json：${err instanceof Error ? err.message : String(err)}`;
    return out;
  }
  out.files = await countFiles(dir);
  try {
    const st = await stat(join(dir, 'test', 'smoke.mjs'));
    out.hasSmoke = st.isFile();
  } catch {
    out.hasSmoke = false;
```

</details>

#### 缺口

- 同版本宿主webServer实际监听/外层准入和部署的私有项目权限
  **影响**：决定非本机可达性和披露范围，插件层缺身份检查不等已实证外部攻击
  **进一步探讨**：只读宿主部署/准入契约，并以私有项目假数据和无来源请求验证边界设计

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采集和落盘的资源/恢复成本有哪些？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

整表Promise.all且作品间并发能避免逐件串行等待，market缓存按fetch实例和url分桶、仅成功命中TTL减少大表重复读取，单源错误保留较好。可是网络get/post没timeout/signal、响应全文text无大小限，作品数无并发上限；模型工具180秒超时不向这些调用传abort。countFiles用stat跟symlink，未visited/深度/文件数预算，循环链接可能长时间递归，访问失败被计0容易像真实文件数。

fleet write直接覆盖目标，没有临时原子rename/备份/锁；sync整份重写可能丢外部并发编辑。报告名截到秒，同秒同目录并发覆盖；默认持久HTML可能含私有仓、目录与指标，应按敏感材料保管。HTML对文本/属性转义是正面，但链接只转义不限制scheme，名册/本地homepage/市场page应可信；不把无script依赖推任意输入无交互风险。卸载清工具/route但不删名册/报告。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 名册/PAT、本地目录、市场访问与报告存储资源；金额未知 | 明确作品/私有数据/最小权限、备份原名册，工时未知 | 远端无mutation不等本地不写；默认report会落HTML |
| 持续使用 | 多API/目录遍历、缓存与报告磁盘；结果token及API额度另计 | 核PR身份、源错误、缓存与数据完整性，实际工时未知 | 没有模型生成数字不等总费用为零；真实时延/节时未量化 |
| 失败恢复 | 名册/报告备份和重新采集资源；重试可能仍悬挂或覆盖 | 分别处理无预算查询、误覆盖、私有报告外发 | 按实际文件/请求状态恢复；资源金额与恢复时间未知 |


#### 证据与依据

**依据 1 · 源码核查**：[lib/collect.js:24-43](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L24-L43)

跟链接递归。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/collect.js:86-96](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L86-L96)

无预算全文网络。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/collect.js:186-233](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L186-L233)

TTL常量、按fetchImpl的WeakMap桶与成功hit分支；耗时注释仅作者记录，非本轮实测。

<details>
<summary>查看原文（48行）</summary>

```text
/** 登记表缓存的默认时长（登记表一天才更新一两次，5 分钟缓存完全够）。 */
export const REGISTRY_TTL_MS = 300_000;

/**
 * 登记表缓存：**按 fetchImpl 实例分桶**。
 * 真 fetch 共用一个桶（拿到真实收益），测试自建的假 fetch 各用各的（互不污染）。
 */
const registryCache = new WeakMap();

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
  }
}

/**
 * 拉市场登记表（带进程内缓存）。
 *
 * 为什么缓存：这份表 **4.4MB**，本地 HTTP 拉一次要 **2.8 秒**（2026-10-17 实测），
 * 而它一天才更新一两次 —— 面板每刷一次都重拉纯属浪费。
 * **只缓存成功结果**：读不到时如实返回，绝不留假数据。
 */
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

**依据 4 · 源码核查**：[lib/collect.js:420-447](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L420-L447)

无并发上限。

<details>
<summary>查看原文（28行）</summary>

```text
 * @returns {Promise<object>} 报告
 */
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
      includeNpm ? collectNpm(work.name, { fetchImpl }) : Promise.resolve({ available: false, reason: '已跳过' }),
    ]);
    const market = marketFactOf(registry, work.name);
    // 直达链接：名册显式给的优先；否则 GitHub 仓库；npm 与市场页面能确定才给（不确定就不编）。
    const links = {
      github: work.url ?? `https://github.com/${fleet.owner}/${work.repo}`,
      npm: `https://www.npmjs.com/package/${work.name}`,
      market: market.listed === true ? market.page : null,
    };
    return { work, local, github, market, npm, links };
```

</details>

**依据 5 · 源码核查**：[lib/fleet.js:131-137](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/fleet.js#L131-L137)

直接覆盖。

```text
export async function writeFleet(file, fleet, deps = {}) {
  const write = deps.writeFileImpl ?? writeFile;
  const mk = deps.mkdirImpl ?? mkdir;
  await mk(dirname(file), { recursive: true });
  await write(file, `${JSON.stringify({ version: FLEET_VERSION, ...fleet }, null, 2)}\n`, 'utf8');
  return file;
}
```

**依据 6 · 源码核查**：[lib/render.js:386-400](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/render.js#L386-L400)

秒级文件名/写。

<details>
<summary>查看原文（15行）</summary>

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
  return out;
}
```

</details>

**依据 7 · 源码核查**：[lib/render.js:14-20](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/render.js#L14-L20)

HTML转义。

```text
function esc(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 测试与前端行为有什么证据？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

package test指向test/smoke.mjs，README声称假网络自测，但固定树清单不存在test目录该文件，本次不能将它当可读/可执行测试证据。可注入fetch/read/write使未来单源反例测试可行，但源码可注入不等已有覆盖。README兼容/速度数值为作者主张，不转独立验证。

client面板mount拉一次、手动刷新再取，未见持续轮询，和README“只工具/无前台服务”旧描述不一致，当前有真实UI与HTTP route。useStatus没有abort/请求序号，先后请求可能旧结果覆盖新结果、卸载后仍完成；CSS按id防重但读到的样式安装未清理链需与宿主生命周期区分。面板/工具/CLI分别render，CLI总行仍直接打印listed/downloads等，市场不可用时可出现0，与renderText明确不报0不同。共享采集不等每个展示入口不误导。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:45-50](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/package.json#L45-L50)

test脚本。

```text
    "test": "node test/smoke.mjs"
  },
  "publishConfig": {
    "access": "public"
  },
  "license": "MIT",
```

**依据 2 · 源码核查**：[client.js:97-121](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/client.js#L97-L121)

无abort/序号的mount/refetch。

<details>
<summary>查看原文（25行）</summary>

```text
   * 拉一次状态。只读接口，失败就把原因原样显示出来（不编数字）。
   */
  function useStatus() {
    const [state, setState] = useState({ loading: true, report: null, error: null, at: 0 })
    const load = useCallback(function () {
      setState(function (prev) { return { ...prev, loading: true } })
      fetch(ROUTE, { credentials: "same-origin", cache: "no-store" })
        .then(function (res) { return res.json() })
        .then(function (json) {
          if (json && json.ok === true) {
            setState({ loading: false, report: json.report, error: null, at: Date.now() })
          } else {
            const why = (json && json.errors ? json.errors.join("；") : (json && json.error) || "读不到")
            setState({ loading: false, report: null, error: why, at: Date.now() })
          }
        })
        .catch(function (err) {
          setState({ loading: false, report: null, error: String((err && err.message) || err), at: Date.now() })
        })
    }, [])
    useEffect(function () { load() }, [load])
    return { ...state, reload: load }
  }

  /* --------------------------------------------------------------- 组件 */
```

</details>

**依据 3 · 源码核查**：[client.js:33-75](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/client.js#L33-L75)

style防重。

<details>
<summary>查看原文（43行）</summary>

```text
  /** 一次性注入样式，重复 apply 不叠加。 */
  function installStyles() {
    const id = "dsh-lighthouse-styles"
    if (document.getElementById(id)) return
    const node = document.createElement("style")
    node.id = id
    node.textContent = `
.lh-root { padding: 18px 22px 40px; max-width: 900px; margin: 0 auto; color: inherit;
  box-sizing: border-box; height: 100%; overflow-y: auto; }
.lh-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.lh-title { font-size: 18px; font-weight: 650; margin: 0; }
.lh-sub { font-size: 12px; opacity: .62; }
.lh-btn { margin-left: auto; font-size: 12px; padding: 4px 10px; border-radius: 7px; cursor: pointer;
  border: 1px solid rgba(128,128,128,.35); background: rgba(128,128,128,.08); color: inherit; }
.lh-btn:hover { background: rgba(128,128,128,.16); }
.lh-btn:disabled { opacity: .5; cursor: default; }
.lh-tiles { display: flex; gap: 10px; flex-wrap: wrap; margin: 14px 0 18px; }
.lh-tile { flex: 1 1 96px; min-width: 96px; border: 1px solid rgba(128,128,128,.22); border-radius: 10px; padding: 9px 12px; }
.lh-tile b { display: block; font-size: 19px; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1.25; }
.lh-tile span { font-size: 11px; opacity: .62; }
.lh-card { border: 1px solid rgba(128,128,128,.22); border-left-width: 3px; border-radius: 10px;
  padding: 11px 14px; margin-bottom: 10px; }
.lh-card.ok { border-left-color: #3fb950; }
.lh-card.wait { border-left-color: #d29922; }
.lh-card.bad { border-left-color: #f85149; }
.lh-row { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.lh-name { font-size: 13.5px; font-weight: 650; font-family: ui-monospace, Consolas, monospace; }
.lh-zh { font-size: 11.5px; opacity: .72; }
.lh-link { color: inherit; text-decoration: none; border-bottom: 1px dashed rgba(128,128,128,.55); }
.lh-link:hover { color: #58a6ff; border-bottom-color: #58a6ff; }
.lh-tag { font-size: 10.5px; opacity: .58; border: 1px solid rgba(128,128,128,.3); border-radius: 999px; padding: 0 7px; }
.lh-line { font-size: 12.5px; margin-top: 4px; display: flex; gap: 12px; flex-wrap: wrap; }
.lh-k { opacity: .58; }
.lh-num { font-variant-numeric: tabular-nums; font-weight: 600; }
.lh-state { font-size: 12px; }
.lh-dim { opacity: .55; }
.lh-err { color: #f85149; font-size: 12.5px; margin: 8px 0; }
.lh-empty { opacity: .6; font-size: 13px; padding: 24px 0; text-align: center; }
.lh-fx { position: fixed; inset: 0; width: 100vw; height: 100vh;
  pointer-events: none; z-index: 9999; }
`
    document.head.appendChild(node)
  }
```

</details>

**依据 4 · 源码核查**：[bin/dsh-lighthouse.mjs:101-126](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/bin/dsh-lighthouse.mjs#L101-L126)

CLI汇总打印。

<details>
<summary>查看原文（26行）</summary>

```text
    if (result.ok !== true) {
      for (const e of result.errors) console.error(`❌ ${e}`);
      return 1;
    }
    const s = result.report.summary;
    console.log(`📡 作品看板｜${result.report.generatedAt}`);
    console.log(`  作品 ${s.works} · 已发布 ${s.published} · 已收录 ${s.listed} · 总下载 ${s.totalDownloads} · 待合 PR ${s.openPrs}`);
    for (const item of result.report.works) {
      const { work, local, github, market } = item;
      const bits = [];
      bits.push(local.available === true ? `本地 ${local.version ?? '?'}` : '本地 读不到');
      bits.push(github.exists === true ? `star ${github.stars}` : 'GitHub 无/读不到');
      bits.push(market.listed === true ? `市场已收录（${market.downloads} 下载）` : (market.available === true ? '市场未收录' : '市场读不到'));
      if (github.pr) bits.push(`PR #${github.pr.number} ${github.pr.mergedAt ? '已合并' : github.pr.state}`);
      console.log(`  · ${work.name}：${bits.join('｜')}`);
    }
    if (result.htmlPath) console.log(`\n卡片：${result.htmlPath}`);
    if (result.jsonPath) console.log(`JSON：${result.jsonPath}`);
    return 0;
  }

  console.error(`未知子命令：${cmd}\n\n${USAGE}`);
  return 2;
}

main()
```

</details>

**依据 5 · 源码核查**：[lib/render.js:68-86](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/render.js#L68-L86)

文本市场不可用分支。

<details>
<summary>查看原文（19行）</summary>

```text
 */
export function renderText(report) {
  const lines = [];
  const s = report.summary;
  const marketReadable = report.market.available === true;
  lines.push(`作品看板｜${shortTime(report.generatedAt)}｜${report.owner}`);
  // 市场读不到时**不许显示 0 收录 / 0 下载** —— 那会让人以为"没人用"，而事实是"没读到"。
  lines.push(
    marketReadable
      ? `  汇总：${s.works} 个作品 · 已发布 ${s.published} · 市场已收录 ${s.listed} · 总下载 ${s.totalDownloads} · 总 star ${s.totalStars} · 待合 PR ${s.openPrs}`
      : `  汇总：${s.works} 个作品 · 已发布 ${s.published} · **市场数据读不到**（不显示 0，免得被当成没人用） · 总 star ${s.totalStars} · 待合 PR ${s.openPrs}`,
  );
  if (marketReadable) {
    lines.push(`  市场登记表：${report.market.count} 条（更新于 ${String(report.market.updated ?? '?')}）`);
  } else {
    lines.push(`  市场登记表：**读不到**（${report.market.reason ?? '未知原因'}）—— 已收录/下载量这几项本次一律不报数`);
  }
  if (report.upstream?.available === true) {
    lines.push(`  上游合并节奏：中位数 ${hoursText(report.upstream.medianHours)}（样本 ${report.upstream.samples} 个已合并 PR）`);
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 推荐结论和继续探讨路径？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察。显式名册和多源错误区分有用，但需要修正PR身份/完整性、无来源路由授权、网络/递归预算和报告覆盖，才能把私有作品状态安心交给面板。仅公开数据的可信本机可先审名册/权限后手动使用，不据无PR/0/超中位直接做发布与催审决策；远端无mutation不等本地不写或HTTP数据可公开。

继续研究带来源状态的作品快照——每来源记录精确版本/时间/权限和采样完整性，PR以upstream+head/内容身份确定，失败不折叠为空；受控身份准入/单飞缓存、全程deadline与有界遍历、原子名册和唯一报告名。反例包括私有404、PR第51条/标题碰撞、搜索503、REST/Graph样本差异、无来源并发、链接环、同秒双report和sync外部编辑。比较假无PR/假0/数据披露、API请求量、取消耗时和恢复工时，尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/collect.js:104-184](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js#L104-L184)

身份/失败基线。

<details>
<summary>查看原文（81行）</summary>

```text
 */
export async function collectGitHub(work, { owner, token, fetchImpl = fetch, prIndex = null }) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'dsh-lighthouse',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
    return out;
  }

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
  } catch {
    return [];
  }
}

/**
 * 把市场登记表拉一次（要同源头，否则被拒 —— 实测）。
 * @param {object} opts 选项
 * @returns {Promise<object>} `{ available, updated, count, list, reason }`
```

</details>

**依据 2 · 源码核查**：[lib/status-route.js:95-125](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/status-route.js#L95-L125)

准入/缓存基线。

<details>
<summary>查看原文（31行）</summary>

```text
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
    } catch (err) {
      send(response, 500, { ok: false, error: err instanceof Error ? err.message : String(err) });
    }
  };
```

</details>

**依据 3 · 源码核查**：[lib/fleet.js:131-137](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/fleet.js#L131-L137)

写盘基线。

```text
export async function writeFleet(file, fleet, deps = {}) {
  const write = deps.writeFileImpl ?? writeFile;
  const mk = deps.mkdirImpl ?? mkdir;
  await mk(dirname(file), { recursive: true });
  await write(file, `${JSON.stringify({ version: FLEET_VERSION, ...fleet }, null, 2)}\n`, 'utf8');
  return file;
}
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
