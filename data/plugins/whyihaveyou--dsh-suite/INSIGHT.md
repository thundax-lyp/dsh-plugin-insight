# dsh-suite（目录与维护工具）

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5649509](https://github.com/whyihaveyou/dsh-suite/tree/5649509411de7fb95c8f024e728cbf28f8ac48ac)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite)
<!-- END META -->

> **功能**：维护 DSH 插件目录、双语入口和分层兼容检查脚本，另含独立插件与脚手架子包。

> **亮点**：把候选发现、分类、兼容检查和可读表格接在同一维护链，为人工筛选提供连续入口；增量是信息组织，不是插件功能验收。[Q01](#research-q01)

> **主要限制**：统一ok/broken可混合静态、环境策略和组装检查，历史成功并集又不随失败退出；因此徽章可能被误读为当前版本功能通过。[Q03](#research-q03)

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
  - [Q01 · 根仓库是可安装插件还是发现与兼容线索目录？](#detail-section-11)
  - [Q02 · 发现与页面生成如何流转，覆盖到哪里？](#detail-section-12)
  - [Q03 · 兼容徽章能证明运行可用吗？](#detail-section-13)
  - [Q04 · 如何低风险使用目录，维护投入与改进假设是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：寻找DSH扩展的用户可用统一目录筛候选，维护者可查看分层兼容线索，再逐项核查原仓库。[Q01](#research-q01)

直接翻topic和原仓库能获得来源但缺统一描述与状态；根目录把这些入口集中，不能继承子包运行能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| topic发现脚本 | 收集新仓库并启发式分类 | 受搜索和响应完整性限制 |
| 兼容检查脚本 | 记录静态/安装/组装线索 | 不执行核心模型任务或浏览器验收 |
| 双语README生成 | 将目录字段变成阅读入口 | 不独立验证描述和状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 浏览器或Markdown阅读器 | 读目录必需 | 筛候选与打开来源 | 可直接读原仓库 |
| Node >=22、npm/npx与网络 | 维护检查必需 | 查询和临时安装 | 检查失败须保留未知或具体错误 |
| GitHub认证 | 自动发现必需 | 搜索topic | 脚本无token退出 |
| 磁盘与临时HOME | 安装检查必需 | 隔离各候选 | 空间、策略或网络可致环境失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 筛选 | 读者按任务看少量候选 | 确认真实条目类型 |
| 核查 | 读者打开原仓库固定版本 | 对照徽章层级与日期 |
| 维护 | 维护者另授权运行发现/检查 | 保留分页与分层报告，失败不推广为不可用 |
| 决定 | 读者独立核查安装及任务结果 | 不符则退出目录判断回原始来源 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 阅读网络资源未知 | 筛选候选与辨别层级，耗时未知 | 不需安装根包 |
| 持续维护 | 查询、下载、临时安装和磁盘未知 | 翻译、分类及环境排障 | 并行最多4并不代表固定总成本 |
| 失败恢复 | 重试网络与构建资源未知 | 区分策略失败和插件失败，核对历史结果 | 没有完整功能结果便不能承诺可用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 候选入口 | 发现与生成源码存在 | 在线完整覆盖及误分类率 |
| 兼容线索 | 静态/安装/组装检查实现 | 功能与浏览器可用性 |
| 维护隔离 | 每项独立HOME与并行上限 | 实际资源和故障恢复成本 |

> **思考**：统一ok/broken可混合静态、环境策略和组装检查，历史成功并集又不随失败退出；因此徽章可能被误读为当前版本功能通过。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把候选发现、分类、兼容检查和可读表格接在同一维护链，为人工筛选提供连续入口；增量是信息组织，不是插件功能验收。[Q01](#research-q01)

每项独立HOME和有界并行降低交叉污染；报告保留层结果便于复核。但搜索完整性检查、简化版本语义与历史成功失效机制值得改进。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

统一ok/broken可混合静态、环境策略和组装检查，历史成功并集又不随失败退出；因此徽章可能被误读为当前版本功能通过。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

把目录当查候选的入口，逐项回到固定版本原仓库；不要把ok、历史安装验证或根仓库子包介绍当当前任务已通过。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

发现、检查与生成脚本有固定源码支持；在线覆盖和目标插件可用性未验证；分层失效展示为假设。

- 已检查：作者 README、包清单、源码路径 package.json、scripts/discover-plugins.mjs、scripts/compat-check.mjs、scripts/gen-readme.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查根资源的发现、兼容检查与README生成子集；没有运行脚本或安装任何候选。其他子包能力分开研究，根包应为resource。
- 下一步：用固定搜索原件核对完整性，用同组安装/策略失败样本检查徽章解释，并另做目标插件核心功能验收。

**分析版本**

- **仓库**：[whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite)
- **版本号**：0.1.0（[固定提交 5649509](https://github.com/whyihaveyou/dsh-suite/tree/5649509411de7fb95c8f024e728cbf28f8ac48ac)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

利用已有分层报告给各项加精确版本与失效条件，可能减少把历史组装结果当当前功能结果的误读；同样本比较误读和维护负担，不能视为已实现。[Q04](#research-q04)

用固定搜索原件核对完整性，用同组安装/策略失败样本检查徽章解释，并另做目标插件核心功能验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 40 | 8919 | — | — | 157824 |
| .mjs | source | 18 | 5383 | 4328 | 714 | — |
| .js | source | 20 | 4923 | 4222 | 467 | — |
| .ts | source | 9 | 1596 | 1280 | 173 | — |
| .mjs | test | 1 | 207 | 181 | 8 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/whyihaveyou/dsh-suite/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：目录根资源能提供哪些可靠发现线索，其兼容徽章是否足以支持选择？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根仓库是可安装插件还是发现与兼容线索目录？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根包private且只有生成README与兼容检查脚本，没有运行时入口或bundle声明；它是目录与维护工具资源，子包商店、脚手架和看板另有身份，不能并入根组件能力。面向寻找DSH扩展的用户和维护目录的人，合格结果是拿到候选来源、描述和有限兼容线索后进一步核查。相对手工翻topic，自动收集和分类、双语表格提供统一入口；README声称“都还能跑”超出其实际检查能证明的范围，尤其表格本身保留broken与unknown，不能作为可用性承诺。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-15](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/package.json#L1-L15)

private根包仅维护脚本。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "dsh-suite",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Bilingual curated DeepSeek Harness plugin directory — daily compat CI, create-dsh-plugin scaffold, own plugins.",
  "license": "MIT",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "gen:readme": "node scripts/gen-readme.mjs",
    "compat:check": "node scripts/compat-check.mjs",
    "compat:check:layer1": "node scripts/compat-check.mjs --layers 1"
  }
```

</details>

**依据 2 · 源码核查**：[scripts/gen-readme.mjs:90-99](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/gen-readme.mjs#L90-L99)

渲染兼容字段与描述为表格。

<details>
<summary>查看原文（10行）</summary>

```text
function renderTable(items, lang) {
  const header = lang === 'zh'
    ? '| 插件 | ⭐ | 兼容 | 描述 |'
    : '| Plugin | ⭐ | Compat | Description |';
  const sep = '|---|---|---|---|';
  const rows = items.map((p) => {
    const stars = typeof p.stars === 'number' ? p.stars : 0;
    return `| ${pluginLink(p)} | ${stars} | ${compatCell(p)} | ${desc(p, lang)} |`;
  });
  return [header, sep, ...rows];
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 发现与页面生成如何流转，覆盖到哪里？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

发现脚本用GitHub topic搜索，逐页最多15页，把新仓库与现有repo字符串集合对比；根据名字、描述和工具链关键字启发式分到插件或观察列表。新条目不猜npm包名，中文描述标untranslated，兼容默认unknown；仅有新增时写回JSON。README生成器读取plugins数组，渲染中英文并替换模板区。发现循环没有检查HTTP状态或incomplete_results，json.items缺失被当空数组并终止；故接口错误或搜索限制可能形成静默覆盖缺口，不能据无新增推断全生态未变。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/discover-plugins.mjs:104-132](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/discover-plugins.mjs#L104-L132)

候选字段及unknown初始状态。

<details>
<summary>查看原文（29行）</summary>

```text
function makeEntry(repo, meta) {
  const name = repo.split('/')[1];
  const desc = clean(meta.description) || '(no description)';
  // zh is DELIBERATELY not copied from the English description: pasting the repo
  // description into both fields is what created the zh==en placeholder pollution
  // (587 committed entries). Auto-ingested entries are untranslated by definition;
  // the explicit 'untranslated' marker keeps the translation backlog countable and
  // satisfies the schema's "zh required" rule without faking a translation.
  const descZh = 'untranslated';
  const entry = {
    id: slug(repo),
    name,
    npm: null,
    repo,
    url: `https://github.com/${repo}`,
    category: meta.category,
    description: { en: desc, zh: descZh }, // en = repo description verbatim; zh = 'untranslated' until a translator pass
    author: repo.split('/')[0],
    stars: meta.stars,
    last_push: meta.last_push || '',
    license: meta.license || 'unknown',
    tags: [],
    dsh: { minVersion: '', peerCordis: '', node: '' },
    compat: { status: 'unknown', dshVersion: '', lastVerified: '', note: '' },
    install: '',
    featured: false,
    isOfficialBeta: false,
    language: meta.language || 'unknown',
    sourceNote: 'auto',
```

</details>

**依据 2 · 源码核查**：[scripts/discover-plugins.mjs:150-165](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/discover-plugins.mjs#L150-L165)

分页停止与缺少响应完整性验证。

<details>
<summary>查看原文（16行）</summary>

```text
  // pull topic full list (search API, paginated, max 15 pages = 1500 repos)
  const topic = [];
  for (let page = 1; page <= 15; page++) {
    const res = await fetch(SEARCH + page + '&sort=stars&order=desc', {
      headers: {
        Authorization: `bearer ${token}`,
        'User-Agent': 'dsh-suite-hourly-discover',
        Accept: 'application/vnd.github+json',
      },
    });
    const json = await res.json();
    const items = json.items || [];
    topic.push(...items);
    if (items.length < 100) break;
    if (topic.length >= (json.total_count || 0)) break;
  }
```

</details>

**依据 3 · 源码核查**：[scripts/discover-plugins.mjs:185-224](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/discover-plugins.mjs#L185-L224)

启发式分类和新增写回。

<details>
<summary>查看原文（40行）</summary>

```text
    if (!desc) {
      meta.category = 'tools';
      meta.watchReason = '占位';
      newWatch.push(makeEntry(repo, meta));
    } else if (!isDshNamed(repo) && !isDshDesc(desc)) {
      meta.category = categorize(repo, desc);
      meta.watchReason = '蹭tag';
      newWatch.push(makeEntry(repo, meta));
    } else if (isToolchain(repo, desc)) {
      meta.category = 'utility';
      meta.watchReason = '工具链';
      newWatch.push(makeEntry(repo, meta));
    } else {
      meta.category = categorize(repo, desc);
      newPlugins.push(makeEntry(repo, meta));
    }
  }

  const total = newPlugins.length + newWatch.length;
  if (total === 0) {
    console.log(`discover-plugins: no new repos — topic ${topic.length} scanned, ${tracked.size} already tracked`);
    return; // idempotent
  }

  // dedupe ids across the full combined set (id is the unique anchor key)
  const allIds = new Set([...plugins, ...watchlist].map((e) => e.id));
  for (const e of [...newPlugins, ...newWatch]) {
    if (allIds.has(e.id)) { e.id = `${e.id}-${e.author.toLowerCase()}`; }
    allIds.add(e.id);
  }

  data.plugins = plugins.concat(newPlugins);
  data.watchlist = watchlist.concat(newWatch);
  data._meta.totals = { plugins: data.plugins.length, watchlist: data.watchlist.length };
  data._meta.generated_at = new Date().toISOString();
  data._meta.source = 'hourly discover-plugins (topic dsh-plugin)';

  writeFileSync(DATA, JSON.stringify(data, null, 1) + '\n', 'utf8');
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`discover-plugins: +${newPlugins.length} plugins, +${newWatch.length} watchlist (topic ${topic.length} scanned, ${elapsed}s)`);
```

</details>

**依据 4 · 源码核查**：[scripts/gen-readme.mjs:164-179](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/gen-readme.mjs#L164-L179)

JSON到双语README。

<details>
<summary>查看原文（16行）</summary>

```text
function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  const plugins = Array.isArray(data.plugins) ? data.plugins : [];
  const watchlistCount = Array.isArray(data.watchlist) ? data.watchlist.length : 0;

  const catalogEn = renderCatalog(plugins, 'en');
  const catalogZh = renderCatalog(plugins, 'zh');

  const enBefore = readFileSync(README_EN, 'utf8');
  const zhBefore = readFileSync(README_ZH, 'utf8');

  const enAfter = inject(enBefore, catalogEn, plugins.length);
  const zhAfter = inject(zhBefore, catalogZh, plugins.length);

  writeFileSync(README_EN, enAfter, 'utf8');
  writeFileSync(README_ZH, zhAfter, 'utf8');
```

</details>

#### 缺口

- 本轮未取得在线搜索分页原件及完整性标志。
  **影响**：不能验证当前目录覆盖率或遗漏规模。
  **进一步探讨**：另固定搜索响应、状态码与incomplete_results，并与独立来源比较。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 兼容徽章能证明运行可用吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能。三层分别做peer/engines静态比较、临时HOME安装、dump-config文本包含候选名称检查；没有模型任务、插件核心执行或浏览器验收。静态比较的parseVersion丢弃预发布信息，且只实现semver子集；无法解释的范围返回null。安装失败含构建策略原因仍会写broken，因此红色不总是插件自身故障。L3的名称子串匹配也不是精确模块树验证。compat-installed与历史集合做并集，只添加成功记录，当前失败不移除旧项；历史安装验证可能滞后，必须看每项时间和原始层结果。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/compat-check.mjs:89-123](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/compat-check.mjs#L89-L123)

简化版本比较丢弃pre。

<details>
<summary>查看原文（35行）</summary>

```text
function parseVersion(v) {
  if (typeof v !== 'string') return null;
  const m = v.trim().match(/^[v=]?(\d+)\.(\d+)\.(\d+)(?:[-+][0-9A-Za-z.-]+)?/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: '' };
}

function cmp(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  return 0;
}

function satisfies(version, range) {
  const v = parseVersion(version);
  if (!v) return null;
  range = String(range || '').trim();
  if (range === '' || range === '*' || range === 'x' || range === 'latest' || range === 'any') return true;

  const ors = range.split('||').map((s) => s.trim()).filter(Boolean);
  if (ors.length === 0) return null;

  let sawNull = false;
  for (const orPart of ors) {
    const ands = orPart.split(/\s+/).filter(Boolean);
    let partOk = true;
    for (const raw of ands) {
      const r = cmpSatisfies(v, raw);
      if (r === null) { sawNull = true; partOk = false; break; }
      if (r === false) { partOk = false; break; }
    }
    if (partOk) return true;
  }
  return sawNull ? null : false;
```

</details>

**依据 2 · 源码核查**：[scripts/compat-check.mjs:365-443](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/compat-check.mjs#L365-L443)

安装、错误分类和文本组装判据。

<details>
<summary>查看原文（79行）</summary>

```text
function classifyInstall(code, stdout, stderr) {
  const out = `${stdout}\n${stderr}`;
  if (code !== 0) {
    if (/not in the npm registry|E404|404 Not Found/i.test(out)) {
      return { cls: 'notfound', note: 'npm package not found in registry' };
    }
    if (/allowBuilds|blocked until allowed|onlyBuiltDependencies|ignored build scripts/i.test(out)) {
      return { cls: 'fail', note: 'install blocked by pnpm build-script policy (allowBuilds) — plugin likely OK, CI policy blocks git prepare scripts' };
    }
    const first = out.split(/\r?\n/).filter(Boolean).slice(-4).join(' | ');
    return { cls: 'fail', note: `install failed (exit ${code}): ${first.slice(0, 160)}` };
  }
  if (/declares no dsh\.bundle|not a profile layer/i.test(out)) {
    return { cls: 'nobundle', note: 'installed but declares no dsh.bundle (not a DSH plugin layer)' };
  }
  return { cls: 'ok', note: '' };
}

// Layer 2 + 3 for one entry. Each entry gets its own isolated DSH_HOME so a
// broken peer-resolution in one plugin can never cascade into another.
async function installAndAssemble(entry, { dshHome, profile, addTimeout, gitTimeout }) {
  const spec = entry.spec; // npm name or git URL
  const isGit = entry.src === 'git';
  const timeoutMs = (isGit ? gitTimeout : addTimeout) * 1000;
  const started = Date.now();
  // Per-entry isolation: each plugin installs into its own DSH_HOME subdir so
  // a broken peer resolution or a corrupt profile can never cascade into the
  // next entry's verdict (ids are lowercase-hyphen slugs, safe as dir names).
  const home = join(dshHome, entry.id);
  mkdirSync(home, { recursive: true }); // dsh lazily creates profiles/, but spawn's cwd must pre-exist

  // Installs are network-bound and occasionally flaky; retry genuine failures
  // once. Deterministic outcomes (notfound / nobundle) are NOT retried.
  let add = await spawnCapture('npx', ['-y', '@deepseek-ai/dsh', 'plugin', '--profile', profile, 'add', spec], {
    timeoutMs,
    cwd: home,
    env: { DSH_HOME: home },
  });
  let inst = classifyInstall(add.code, add.stdout, add.stderr);
  let retried = false;
  // Only retry non-timeout failures — a timeout usually means a genuinely huge
  // repo (e.g. a 161MB git source) or a deadlock, and re-running just doubles
  // the wait.
  if (inst.cls === 'fail' && !add.timedOut) {
    retried = true;
    add = await spawnCapture('npx', ['-y', '@deepseek-ai/dsh', 'plugin', '--profile', profile, 'add', spec], {
      timeoutMs,
      cwd: home,
      env: { DSH_HOME: home },
    });
    inst = classifyInstall(add.code, add.stdout, add.stderr);
  }
  const layer2 = {
    verdict: inst.cls === 'ok' ? 'ok' : inst.cls, // ok | nobundle | notfound | fail
    note: add.timedOut ? `timeout after ${timeoutMs / 1000}s (process killed)${retried ? ' [retried]' : ''}`
      : retried ? `failed once, retried — ${inst.note}`
      : inst.note,
    elapsedMs: add.elapsedMs,
  };
  if (inst.cls !== 'ok') {
    return { layer2, layer3: null, finalVerdict: layer2.verdict, elapsedMs: Date.now() - started };
  }

  // Layer 3: config must actually assemble the plugin into the profile.
  const dc = await spawnCapture('npx', ['-y', '@deepseek-ai/dsh', '--profile', profile, '--dump-config'], {
    timeoutMs: 60000,
    cwd: home,
    env: { DSH_HOME: home },
  });
  const cfg = `${dc.stdout}\n${dc.stderr}`;
  const hay = cfg.toLowerCase();
  const needles = [entry.npmName, entry.id, entry.name].filter(Boolean).map((s) => s.toLowerCase());
  const found = dc.code === 0 && needles.some((n) => n && hay.includes(n));
  const layer3 = {
    verdict: found ? 'ok' : 'broken',
    note: found ? '' : dc.timedOut ? 'dump-config timeout' : `dump-config exit=${dc.code} but plugin not found in composed tree`,
    elapsedMs: dc.elapsedMs,
  };
  return { layer2, layer3, finalVerdict: layer3.verdict, elapsedMs: Date.now() - started };
```

</details>

**依据 3 · 源码核查**：[scripts/compat-check.mjs:620-650](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/compat-check.mjs#L620-L650)

静态与安装结果可统一写状态。

<details>
<summary>查看原文（31行）</summary>

```text
  // Persist verdicts back into plugins.json (only when --write).
  // Layer 2/3 ground truth wins over layer 1 for the entries it actually tested.
  if (args.write) {
    let changed = 0;
    const byId = new Map(layer1.map((r) => [r.id, r]));
    const byId23 = new Map(layer23.map((r) => [r.id, r]));
    for (const p of plugins) {
      const r23 = byId23.get(p.id);
      const r = byId.get(p.id);
      if (!r) continue;
      let verdict = null, note = '';
      if (r23) {
        const v2 = r23.layer2 && r23.layer2.verdict; // ok | nobundle | notfound | fail
        if (v2 === 'ok') {
          // Installed fine — layer 3 decides between ok and broken.
          verdict = (r23.layer3 && r23.layer3.verdict === 'broken') ? 'broken' : 'ok';
          note = verdict === 'broken' ? (r23.layer3.note || 'installed but not in composed config') : '';
        } else if (v2 === 'fail' || v2 === 'notfound') {
          // The install itself failed — that IS broken, with the real reason.
          verdict = 'broken';
          note = r23.layer2.note || 'install failed';
        }
        // v2 === 'nobundle' (or layer2 missing): not a DSH plugin layer —
        // do not flip status; a static engines warning is not actionable here.
      }
      if (verdict === null && !r23 && (r.verdict === 'ok' || r.verdict === 'broken')) {
        // Entry was NOT tested by layer 2/3 this run — keep layer 1's static verdict.
        // (Tested-but-nobundle entries fall through: a non-plugin's static
        // engines warning is noise, not a compat verdict.)
        verdict = r.verdict;
        note = r.verdict === 'broken' ? r.note : '';
```

</details>

**依据 4 · 源码核查**：[scripts/compat-check.mjs:708-730](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/compat-check.mjs#L708-L730)

历史安装成功集合并集保留。

<details>
<summary>查看原文（23行）</summary>

```text
  if (layer23.length && args.write) {
    // Gate behind --write: compat-installed.json is a committed artifact
    // (rolling L3-verified set consumed by site/build.mjs for evidence badges).
    // UNION-merge with the previous file so a partial/debug run (e.g. a
    // featured-only sweep) never clobbers the accumulated verified set:
    // previous ids stay, this run's ids are added, same-id entries refresh.
    const prev = (() => { try { return JSON.parse(readFileSync(INSTALLED_PATH, 'utf8')); } catch { return null; } })();
    const installed = layer23.filter((r) => r.layer3 && r.layer3.verdict === 'ok');
    const verifiedAt = nowIso().slice(0, 10);
    const entries = {};
    if (prev && prev.entries && typeof prev.entries === 'object') Object.assign(entries, prev.entries);
    for (const r of installed) {
      entries[r.id] = { id: r.id, name: r.name, spec: r.spec, src: r.src || 'npm', verified_at: verifiedAt, layer: 3 };
    }
    const installedIds = Object.keys(entries).sort();
    const installedDoc = {
      generated_at: nowIso(),
      dshVersion,
      count: installedIds.length,
      ids: installedIds,
      entries,
    };
    writeFileSync(INSTALLED_PATH, JSON.stringify(installedDoc, null, 2) + '\n', 'utf8');
```

</details>

#### 缺口

- 未复跑检查或回读线上CI原件。
  **影响**：不能判断当前每个徽章与目标版本的实际可用性。
  **进一步探讨**：对所选候选固定版本另核查安装、核心功能和退出路径，不从绿色推广为通过。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何低风险使用目录，维护投入与改进假设是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

读目录的成本主要是筛选和核对原仓库；执行维护脚本则需要Node、npm/npx、网络和GitHub认证，并可能安装第三方包到临时HOME，不能把零运行依赖解释为无资源或安全成本。安装并行限制最多4，超时和重试限制减少单项拖累，但总网络与磁盘、排障时间未知。适合把目录当候选入口，当前建议小范围试用查找流程，不能据徽章批量安装。由Q03可提出分开静态、安装、组装与功能状态并为历史记录绑定精确版本和失效条件的假设；同组新旧失败样本检查是否减少误读，若维护负担增加而误读不降则否定。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/compat-check.mjs:385-425](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/compat-check.mjs#L385-L425)

隔离HOME、超时和重试。

<details>
<summary>查看原文（41行）</summary>

```text
async function installAndAssemble(entry, { dshHome, profile, addTimeout, gitTimeout }) {
  const spec = entry.spec; // npm name or git URL
  const isGit = entry.src === 'git';
  const timeoutMs = (isGit ? gitTimeout : addTimeout) * 1000;
  const started = Date.now();
  // Per-entry isolation: each plugin installs into its own DSH_HOME subdir so
  // a broken peer resolution or a corrupt profile can never cascade into the
  // next entry's verdict (ids are lowercase-hyphen slugs, safe as dir names).
  const home = join(dshHome, entry.id);
  mkdirSync(home, { recursive: true }); // dsh lazily creates profiles/, but spawn's cwd must pre-exist

  // Installs are network-bound and occasionally flaky; retry genuine failures
  // once. Deterministic outcomes (notfound / nobundle) are NOT retried.
  let add = await spawnCapture('npx', ['-y', '@deepseek-ai/dsh', 'plugin', '--profile', profile, 'add', spec], {
    timeoutMs,
    cwd: home,
    env: { DSH_HOME: home },
  });
  let inst = classifyInstall(add.code, add.stdout, add.stderr);
  let retried = false;
  // Only retry non-timeout failures — a timeout usually means a genuinely huge
  // repo (e.g. a 161MB git source) or a deadlock, and re-running just doubles
  // the wait.
  if (inst.cls === 'fail' && !add.timedOut) {
    retried = true;
    add = await spawnCapture('npx', ['-y', '@deepseek-ai/dsh', 'plugin', '--profile', profile, 'add', spec], {
      timeoutMs,
      cwd: home,
      env: { DSH_HOME: home },
    });
    inst = classifyInstall(add.code, add.stdout, add.stderr);
  }
  const layer2 = {
    verdict: inst.cls === 'ok' ? 'ok' : inst.cls, // ok | nobundle | notfound | fail
    note: add.timedOut ? `timeout after ${timeoutMs / 1000}s (process killed)${retried ? ' [retried]' : ''}`
      : retried ? `failed once, retried — ${inst.note}`
      : inst.note,
    elapsedMs: add.elapsedMs,
  };
  if (inst.cls !== 'ok') {
    return { layer2, layer3: null, finalVerdict: layer2.verdict, elapsedMs: Date.now() - started };
```

</details>

**依据 2 · 源码核查**：[scripts/compat-check.mjs:447-463](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/compat-check.mjs#L447-L463)

并行上限。

<details>
<summary>查看原文（17行）</summary>

```text
async function checkLayer23(entries, opts) {
  const results = new Array(entries.length);
  let cursor = 0;
  async function worker() {
    while (cursor < entries.length) {
      const i = cursor++;
      const e = entries[i];
      try {
        results[i] = { ...(await installAndAssemble(e, opts)), id: e.id, name: e.name, spec: e.spec, src: e.src };
      } catch (err) {
        results[i] = { id: e.id, name: e.name, spec: e.spec, src: e.src, layer2: { verdict: 'fail', note: `unexpected: ${err.message}`.slice(0, 160) }, layer3: null, finalVerdict: 'fail', elapsedMs: 0 };
      }
    }
  }
  const n = Math.max(1, Math.min(opts.installConcurrency || 4, entries.length));
  await Promise.all(Array.from({ length: n }, worker));
  return results;
```

</details>

**依据 3 · 源码核查**：[scripts/compat-check.mjs:683-699](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/scripts/compat-check.mjs#L683-L699)

详细报告已有分层结果，可作为改进基础。

<details>
<summary>查看原文（17行）</summary>

```text
  const report = {
    generated_at: nowIso(),
    dshVersion,
    cordisVersion,
    nodeVersion,
    layers_run: [1, ...(layer23.length ? [2, 3] : [])],
    layer23_scope: want23 ? args.scope : null,
    layer23_skipped: skipReason || null,
    summary,
    summary_catalog: catalogSummary,
    summary_watchlist: watchSummary,
    results: layer1,
    layer2: layer23.map((r) => ({ id: r.id, name: r.name, spec: r.spec, src: r.src, verdict: r.layer2?.verdict, note: r.layer2?.note || '', elapsedMs: r.layer2?.elapsedMs || 0 })),
    layer3: layer23.map((r) => ({ id: r.id, name: r.name, spec: r.spec, src: r.src, verdict: r.layer3?.verdict, note: r.layer3?.note || '', elapsedMs: r.layer3?.elapsedMs || 0 })),
    layer2_summary: l23Summary(layer23, 'layer2'),
    layer3_summary: l23Summary(layer23, 'layer3'),
  };
```

</details>

#### 缺口

- 没有目录找候选耗时与误选率对照。
  **影响**：不能证明比topic或其他目录节省时间。
  **进一步探讨**：同一任务比较找候选、核查到可用的总时间与误读徽章次数。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
