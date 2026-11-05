# dsh-pick

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[925db29](https://github.com/AIcivilization/dsh-pick/tree/925db2950d58c2b8662e0f6fa14f8950a0739212)

<!-- BEGIN META -->
[![npm 30d 2,415](https://img.shields.io/static/v1?label=npm+30d&message=2%2C415&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pick) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pick)
<!-- END META -->

> **功能**：按需求检索 DSH 插件候选，比较 npm 与 GitHub 指标，并提供面板、对话工具和安装入口。

> **亮点**：它把需求词项搜索、去噪统计和四个对话工具接到同一目录，减少信息分散，贡献是信息组织而非质量保证。[Q01](#research-q01)、[Q02](#research-q02)

> **主要限制**：剔除发布日不能识别全部自动流量，健康度还为缺指标填默认值；高分不证明真实用户、可靠性或任务适配。[Q03](#research-q03)

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
  - [Q01 · 选插件顾问到底比下载榜多做了什么？](#detail-section-11)
  - [Q02 · 目录、指标和AI工具怎样把需求变成候选？](#detail-section-12)
  - [Q03 · 去噪基线与健康度能否代表真实使用和可采用性？](#detail-section-13)
  - [Q04 · 数据刷新和安装链有哪些条件与副作用？](#detail-section-14)
  - [Q05 · 如何使用这些指标，可推导什么更可靠的选择流程？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在多个DSH候选间比较的用户，可按需求查目录与统计，再独立核查任务适配。

参照手动浏览npm/GitHub数据，本组件集中统计、候选和对话入口；不代替固定版本业务验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| pick_search | 按需求查目录候选 | 词项匹配与下载加权，不验证任务 |
| pick_stats | 查询包的详细指标 | 每次最多8个合法包名，目录缺指标时实时查npm |
| pick_compare | 对照候选的多个指标 | 2~6个合法包名，统计最好不等于任务最好 |
| pick_rank | 查目录或来源榜单 | 截止时间与指标覆盖受目录限制 |
| 面板发到对话 | 携带需求与数字请求分析 | 不覆盖非空草稿，提交非最终答复保证 |
| 目录刷新 | 获取较新数据 | 有限格式校验与旧目录回退 |
| 安装和装卸管理 | 调用宿主包管理 | 显式操作有副作用，不固定研究提交 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20与DSH web客户端、webServer | 面板必需 | 提供目录与嵌入页面 | 无面板路由 |
| tools及模型账号 | 对话查询条件 | 注册四工具并由Agent分析 | 工具不可用或模型费用未知 |
| npm、CDN与GitHub网络 | 刷新条件 | 指标与远端目录 | 继续旧目录，须看截止时间 |
| pluginManager | 安装管理条件 | 装卸候选或更新自身 | 提供终端命令，不等于已安装 |
| dshmarket兼容接口 | 可选 | 前端兼容提示 | 缺失时不显示该判断 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 读取 | 用户核对目录来源与截止日 | 时间和缺失指标可辨 |
| 比较 | 用户按具体任务搜索并核数据 | 不把健康度当质量 |
| 核查 | 用户读候选版本、权限和退出 | 满足任务后才另行决定安装 |
| 恢复 | 用户停用或卸载本组件 | 已装候选需独立管理，不自动撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 包与目录存储，金额未知 | 配置入口、核目录来源 | 运行兼容未实测 |
| 持续 | 网络刷新与可选AI调用费用未知 | 解释指标并查任务适配 | 无选对率或节时数据 |
| 失败恢复 | 重试及旧目录资源未知 | 识别过期、核装卸结果 | 原子写保护完整性不保证数据真实 |
| 退出 | 已安装候选可能继续占资源 | 分别卸载组件和候选 | 本组件卸载不撤销其他包 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中比较 | 目录、四工具和面板已接线 | 对具体任务选对率 |
| 去噪统计 | 排除部分发版日并算中位数 | 剩余流量是否真实用户 |
| 安装便利 | 目录白名单与管理器调用 | 解析到的版本与实际可用 |

> **思考**：剔除发布日不能识别全部自动流量，健康度还为缺指标填默认值；高分不证明真实用户、可靠性或任务适配。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把需求词项搜索、去噪统计和四个对话工具接到同一目录，减少信息分散，贡献是信息组织而非质量保证。[Q01](#research-q01)、[Q02](#research-q02)

[Q04](#research-q04) 原子目录替换和占用重试值得复用；有限格式检查只防部分坏文件，不能称内容真实性校验。

<a id="detail-section-5"></a>

### 1.4 主要限制

剔除发布日不能识别全部自动流量，健康度还为缺指标填默认值；高分不证明真实用户、可靠性或任务适配。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

优先只读使用候选面板，独立检查任务证据与固定版本；不要自动按健康度安装。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持候选检索与统计整合；去噪正确性及选对率未知，任务证据层是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/engine.js、lib/metrics.js、lib/remote.js、plugin/index.js、plugin/tools.js、plugin/client.js、web/panel.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核固定版本指标、目录、工具、对话桥和安装链；未执行目标、npm请求或实际候选业务任务，不把作者竞品定位当独立比较。
- 下一步：固定候选、版本与任务，对照统计排序和加入任务证据后的合格率、误装及人工核查时间。

**分析版本**

- **仓库**：[AIcivilization/dsh-pick](https://github.com/AIcivilization/dsh-pick)
- **版本号**：0.5.1（[固定提交 925db29](https://github.com/AIcivilization/dsh-pick/tree/925db2950d58c2b8662e0f6fa14f8950a0739212)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将描述性热度与固定版本任务适配、证据覆盖分开，让选择对照实际合格任务；尚未实现和验证。[Q05](#research-q05)

固定候选、版本与任务，对照统计排序和加入任务证据后的合格率、误装及人工核查时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 12 | 3482 | 2758 | 467 | — |
| .md | source | 1 | 251 | — | — | 2869 |
| .mjs | source | 2 | 147 | 108 | 21 | — |
| .js | test | 7 | 642 | 561 | 45 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-pick/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-pick/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-pick/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统计去噪与候选比较是否能支撑具体任务选择，数据与安装边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 选插件顾问到底比下载榜多做了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向面对多个DSH候选、需要按需求缩小范围并比较指标的用户。相对手动浏览npm和GitHub，本组件把词典搜索、下载指标、来源榜、已装提示和对话工具集中起来，合格结果是有可追溯数据与限制的候选清单，用户再核查适配及任务能力。README“挑对”比找到更强，但源码没有对候选执行目标业务或验证合格交付；它的贡献是候选信息整理与统计启发式，不是已验证插件质量判断。README对dsh-find-plugin的比较仅作作者定位，本轮未检查另一插件，不作跨组件优劣结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-14](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/README.md#L8-L14)

作者定位与比较声明。

```text
**帮你在 DSH 生态里选对插件。**

说需求 → 找候选 → 多维比较 → 出结论。下载量只是证据，判断才算数。

> 定位对比：`dsh-find-plugin` 负责「**找到**」（搜 GitHub 仓库，按 star 排）；
> `dsh-pick` 负责「**挑对**」（算去噪指标，给首选 / 备选 / 不推荐）。
> 一个 `find_dsh_plugin`，一个 `pick_plugin`。
```

**依据 2 · 作者声明**：[README.md:65-85](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/README.md#L65-L85)

面板对话、四工具和安装流程声明。

<details>
<summary>查看原文（21行）</summary>

```text
**和对话联动**（这是插件版比独立网页好用的地方）：

- **+AI**：候选卡片、「候选」「结论」「我的监控」的标题上都有。点一下，把这块的需求和关键数字整理成一段话发到当前对话，AI 在对话里结合你的场景分析。只发结论和数字，不发原始数据；输入框里有你没发出的文字时不会覆盖。
- **在对话里直接问**：插件给 AI 注册了 4 个工具，不开面板也行，直接问「我想装个数据库插件，哪个靠谱？」，AI 会自己查目录、比较。

  | 工具 | 作用 |
  |---|---|
  | `pick_search` | 按需求找候选 |
  | `pick_stats` | 查几个插件的详细数据（目录里没有去噪指标的实时查 npm） |
  | `pick_compare` | 2~6 个插件逐项对比，标出每项最好的 |
  | `pick_rank` | 全部或某一类的排行 |

  每个工具的结果都带口径说明，并要求 AI 只引用工具给的数字，不自己推算。
- **安装**：候选卡片上点「安装 → 确认安装」，交给 DSH 的插件管理器装；已装的显示「✓ 已安装」。只能装目录里有的插件（带 `dsh-plugin` 关键字的 npm 包）。
- **装之前先看能不能装**：卡片上会提醒——
  - ✓ 兼容你的 DSH / ⚠ 和你的 DSH 不兼容（需要 …）：问的是插件市场（dshmarket）的兼容性接口，规则和它安装前的检查一致；没装插件市场就不显示这一项
  - ⚠ 没声明 dsh.bundle：DSH 一定拒绝安装
  - ⚠ tui 客户端插件：装进桌面版 / 网页版可能让 DSH 起不来
  - ⚠ 你已装同类：功能可能重叠

  装不了的不给「安装」按钮，AI 工具的结果里也带着同样的提醒。
```

</details>

**依据 3 · 源码核查**：[lib/engine.js:385-425](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/lib/engine.js#L385-L425)

词项匹配与下载加权的实际搜索。

<details>
<summary>查看原文（41行）</summary>

```text
export function searchByNeed(catalog, need, { limit = 12, category = null } = {}) {
  const terms = expandWords(need)
  if (!terms.length) return []

  const maxWeight = terms.reduce((s, t) => s + t.weight, 0)
  const scored = []
  for (const rec of Object.values(catalog.packages || {})) {
    if (category && rec.cat !== category) continue
    const hay = [(rec.n || ''), ...(rec.kw || []), rec.d || ''].join(' ').toLowerCase()
    let hit = 0
    let any = false
    for (const t of terms) {
      if (hay.includes(t.w)) { hit += t.weight; any = true }
    }
    if (!any) continue
    const relevance = hit / maxWeight
    // 下载量只做微弱加权，避免「发版本最勤」挤掉真正相关的
    const pop = Math.log10(Math.max(rec.w, 1)) / 6
    scored.push({ rec, relevance, score: relevance * 0.85 + pop * 0.15 })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map(x => ({
    name: x.rec.n,
    version: x.rec.v,
    category: x.rec.cat,
    description: x.rec.d,
    weekly: x.rec.w,
    monthly: x.rec.m,
    deep: x.rec.deep
      ? {
          baseline: x.rec.deep.base,
          growth: x.rec.deep.growth,
          cadence: x.rec.deep.cadence,
          ageDays: x.rec.deep.age,
          lastRelease: x.rec.deep.lastRelease,
          versions: x.rec.deep.versions,
          score: x.rec.deep.s,
        }
      : null,
    relevance: Math.round(x.relevance * 100),
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录、指标和AI工具怎样把需求变成候选？

**研究主题**：功能与机制

#### 完整回答

loadCatalog选择随包与缓存中较新的anchor/asOf目录，缺失则空目录；启动5秒后及每6小时尝试远端更新。搜索对名称、关键词和描述做词项包含匹配，相关度占0.85、周下载对数占0.15，不能称为语义模型检索。四个注册工具分别搜索、统计、比较2~6包和排行，附数据截止及注意说明；比较取每项最大/最小并以健康度排序，不会验证任务。+AI面板消息检查iframe来源与同源，草稿非空时不覆盖，重复排队文本跳过；否则setDraft后submit queue，成功状态代表提交而非最终分析正确。

#### 证据与依据

**依据 1 · 源码核查**：[lib/engine.js:315-333](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/lib/engine.js#L315-L333)

目录新旧选择与空回退。

<details>
<summary>查看原文（19行）</summary>

```text
/** a 比 b 新：先比统计截止日，再比构建日 */
export function newerCatalog(a, b) {
  if (!a || !a.packages) return false
  if (!b || !b.packages) return true
  const ka = `${a.anchor || ''}|${a.asOf || ''}`
  const kb = `${b.anchor || ''}|${b.asOf || ''}`
  return ka > kb
}

/**
 * 目录：随包自带的和每日更新的，用新的那份。
 * source 标出用的是哪份（'remote' 每日更新 / 'bundled' 随包自带），设置页显示用
 */
export async function loadCatalog({ env = process.env } = {}) {
  if (cache) return cache
  const [bundled, cached] = await Promise.all([readJson(CATALOG_PATH), readJson(cachePath(env))])
  const pick = newerCatalog(cached, bundled) ? { ...cached, source: 'remote' } : bundled ? { ...bundled, source: 'bundled' } : null
  cache = pick ? normalize(pick) : { asOf: null, anchor: null, packages: {}, total: 0, source: 'none' }
  return cache
```

</details>

**依据 2 · 源码核查**：[plugin/index.js:225-240](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/plugin/index.js#L225-L240)

远端调度与工具真实注册。

<details>
<summary>查看原文（16行）</summary>

```text
  // 每日更新的目录：启动时查一次，之后每 6 小时查一次（查不到就继续用手上的）
  const refresh = () => refreshCatalog().catch(() => {})
  const startTimer = setTimeout(refresh, 5000) // 别和 DSH 启动抢网络
  const timer = setInterval(refresh, CHECK_EVERY_MS)
  if (timer.unref) timer.unref()
  if (startTimer.unref) startTimer.unref()
  const stop = () => { clearTimeout(startTimer); clearInterval(timer) }
  if (typeof ctx.effect === 'function') ctx.effect(() => stop)
  else if (typeof ctx.on === 'function') ctx.on('dispose', stop)

  // AI 工具：DSH 有 tools 服务才注册（可选依赖，没有也不影响面板）
  ctx.inject(['tools'], (toolsCtx) => {
    const tools = toolsCtx.tools || (toolsCtx.get && toolsCtx.get('tools'))
    if (!tools || typeof tools.register !== 'function') return
    registerTools({ tools }, { installed: async () => (await installedNames(pluginManager)) || new Set() })
      .catch(e => console.warn('[dsh-pick] AI 工具注册失败', e))
```

</details>

**依据 3 · 源码核查**：[plugin/tools.js:215-237](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/plugin/tools.js#L215-L237)

比较指标及健康度排序。

<details>
<summary>查看原文（23行）</summary>

```text
      async execute(args) {
        const cat = await loadCatalog()
        const names = cleanNames(args.names, 6)
        if (names.length < 2) throw new Error('至少要两个合法的 npm 包名')
        const all = (await stats(cat, names)).map(withCatalogFields(cat))
        const rows = all.filter(r => r.source !== 'not-found')
        const missing = all.filter(r => r.source === 'not-found').map(r => r.name)
        const METRICS = [
          { label: '日常基线（越高越好）', get: r => r.deep && r.deep.baseline, better: 'max', fmt: num },
          { label: '近 7 日环比（越高越好）', get: r => r.deep && r.deep.growth, better: 'max', fmt: pct },
          { label: '最近更新（越近越好）', get: r => r.deep && r.deep.ageDays, better: 'min', fmt: n => `${n} 天前` },
          { label: '版本节奏（越短越活跃）', get: r => r.deep && r.deep.cadence, better: 'min', fmt: n => `${n} 天/版` },
          { label: '健康度（越高越好）', get: r => r.deep && r.deep.score, better: 'max', fmt: n => String(n) },
          { label: '周下载（含非人类流量）', get: r => r.weekly, better: 'max', fmt: num },
        ]
        const best = METRICS.map(m => {
          const vals = rows.map(r => [r.name, m.get(r)]).filter(([, x]) => x != null && !Number.isNaN(x))
          if (!vals.length) return { label: m.label, winner: null }
          vals.sort((a, b) => (m.better === 'max' ? b[1] - a[1] : a[1] - b[1]))
          return { label: m.label, winner: vals[0][0], value: m.fmt(vals[0][1]) }
        })
        rows.sort((a, b) => ((b.deep && b.deep.score) ?? -1) - ((a.deep && a.deep.score) ?? -1))
        return plain({ header: header(cat), best, rows: annotate(rows, cat, await installed()), missing })
```

</details>

**依据 4 · 源码核查**：[plugin/client.js:191-225](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/plugin/client.js#L191-L225)

对话输入保护与提交边界。

<details>
<summary>查看原文（35行）</summary>

```text
    async function sendToChat(sessionId, text) {
      const input = composerFor(sessionId)
      if (!input) return 'none'
      // 用户正在输入的内容不覆盖
      if (composerDraft(input)) return 'draft'
      // AI 忙着时连点几下，别排一串一样的
      if (queuedTexts(input).includes(text.trim())) return 'queued'
      input.setDraft(text)
      // 输入框更新是异步的：等它收到这句话再发，不然发出去的是空的
      for (let i = 0; i < 20 && !composerDraft(input); i += 1) await new Promise(r => setTimeout(r, 25))
      if (!composerDraft(input)) {
        if (input.focus) input.focus()
        return 'none'
      }
      await input.submit('queue')
      return 'sent'
    }

    /** 右侧栏里的完整面板：标题行 + 占满栏高的 iframe（iframe 自己滚动；目录信息面板里自带） */
    function PickPanel({ sessionId }) {
      const frame = useRef(null)
      const sid = sessionId ? String(sessionId) : ''

      useEffect(() => {
        const onMessage = async (e) => {
          const win = frame.current && frame.current.contentWindow
          if (!win || e.source !== win || e.origin !== window.location.origin) return
          const d = e.data
          if (!d || d.type !== 'dsh-pick:ask' || typeof d.text !== 'string' || !d.text.trim()) return
          let status = 'none'
          try { status = await sendToChat(sid, d.text.slice(0, 8000)) } catch { status = 'none' }
          win.postMessage({ type: 'dsh-pick:ask-result', id: d.id, status }, window.location.origin)
        }
        window.addEventListener('message', onMessage)
        return () => window.removeEventListener('message', onMessage)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 去噪基线与健康度能否代表真实使用和可采用性？

**研究主题**：缺陷与关键质疑

#### 完整回答

baseline剔除发布日和次日后取中位数，但剩少于5天回退所有有效天；它不能识别其他日期的CI、镜像或自动化流量，故“最接近真实使用量”是启发式假设。growth先去掉null再取最后两个7个观测，缺日期时不等于连续日历周；前7个总量为0时有增长直接给1，不是可比的真实比率。score将缺增长填0.5、缺新鲜度/节奏填0.4，并按40/25/20/15加权，这是面板偏好而非可靠性或需求证据。没有执行结果、权限、退出或成本合格性作为质量分项，因此高分不能证明该装；频繁发版亦不自动等于维护好。

#### 证据与依据

**依据 1 · 源码核查**：[lib/metrics.js:39-57](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/lib/metrics.js#L39-L57)

基线剔除及样本不足回退。

<details>
<summary>查看原文（19行）</summary>

```text
  // null = npm 那天没有数据（全网都是 0 的日子，见 engine.js 的 gapDays）：不算进中位数
  const valid = daily.filter(v => v != null)
  if (!valid.length) return 0
  if (!releaseDates.length || !startISO) return median(valid)

  const spikes = new Set()
  const s = toDay(startISO)
  for (const d of releaseDates) {
    const n = toDay(d)
    if (n >= s && n <= s + daily.length) {
      spikes.add(n - s)        // 发布当天
      spikes.add(n - s + 1)    // 发布次日
    }
  }
  const kept = daily.filter((v, i) => v != null && !spikes.has(i))
  return kept.length >= 5 ? median(kept) : median(valid)
}

/**
```

</details>

**依据 2 · 源码核查**：[lib/metrics.js:64-72](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/lib/metrics.js#L64-L72)

增长压缩有效观测与零基数处理。

```text
  const valid = daily.filter(v => v != null)
  if (valid.length < 14) return null
  const last7 = sum(valid.slice(-7))
  const prev7 = sum(valid.slice(-14, -7))
  if (prev7 === 0) return last7 > 0 ? 1 : null
  return (last7 - prev7) / prev7
}

/**
```

**依据 3 · 源码核查**：[lib/metrics.js:98-109](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/lib/metrics.js#L98-L109)

健康度默认值与权重。

<details>
<summary>查看原文（12行）</summary>

```text
export function score({ baseline: b = 0, growth: g = null, age = null, cadence: c = null }) {
  const baselinePart = clamp01(Math.log10(Math.max(b, 1)) / 4)                    // 1 → 0, 1万 → 1
  const growthPart = g === null ? 0.5 : clamp01((g + 0.5) / 1.5)                  // -50% → 0, +100% → 1
  const agePart = age === null ? 0.4 : clamp01(1 - age / 180)                     // 今天 → 1, 180 天前 → 0
  const cadencePart = c === null ? 0.4 : clamp01(1 - (c - 1) / 21)                // 1天/版 → 1, 22天/版 → 0

  return Math.round(
    baselinePart * 40 + growthPart * 25 + agePart * 20 + cadencePart * 15
  )
}

function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 数据刷新和安装链有哪些条件与副作用？

**研究主题**：依赖、兼容与流程、工程质量与复用、效果与总成本

#### 完整回答

Node>=20、DSH web客户端和webServer是面板条件；tools用于对话工具、pluginManager用于安装卸载，缺失时提供手动命令。远端只检查目录格式、至少500条及前50条名称和周下载，没有内容签名或逐项完整校验；原子临时写后rename并对占用退避重试保护文件完整性，但不证明来源或指标真实。安装API限制合法且目录存在的npm名，只在inst.b明确false时拒绝，缺声明未知并不在此直接拒绝；最终installBundle按包名解析，未绑定研究提交。前端兼容提示可依赖可选dshmarket接口，不能推为所有后端安装都经过同样检查。模型+AI有额外费用，npm/镜像查询和目录下载有网络资源；具体金额、等待与节时未知。发生错误保留旧目录，不应把旧数据当最新；停用与卸载不撤销已安装候选。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:27-33](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/package.json#L27-L33)

web客户端包声明。

```text
  "dsh": {
    "bundle": {
      "patch": "./plugin/cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
```

**依据 2 · 源码核查**：[lib/remote.js:38-60](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/lib/remote.js#L38-L60)

原子替换和占用重试。

<details>
<summary>查看原文（23行）</summary>

```text
 * 先写临时文件再改名替换：替换是原子的，读的一方要么看到旧文件、要么看到完整的新文件。
 * 被占用就退避重试几次；最后还是不行，删掉临时文件、把错抛出去（这一轮不换，下一轮再试）
 */
export async function writeAtomic(file, text, { tries = 5, wait = 150, renameImpl = rename } = {}) {
  await mkdir(dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  await writeFile(tmp, text, 'utf8')
  for (let i = 1; ; i++) {
    try {
      await renameImpl(tmp, file)
      return
    } catch (e) {
      if (!BUSY.has(e && e.code) || i >= tries) {
        await rm(tmp, { force: true }).catch(() => {})
        throw e
      }
      await new Promise(r => setTimeout(r, wait * 2 ** (i - 1)))
    }
  }
}

async function getJson(fetchImpl, url, timeoutMs) {
  const r = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs), headers: { accept: 'application/json' } })
```

</details>

**依据 3 · 源码核查**：[lib/remote.js:68-106](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/lib/remote.js#L68-L106)

有限目录校验与网络失败回退。

<details>
<summary>查看原文（39行）</summary>

```text
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(cat.anchor || ''))) return false
  const list = Object.values(cat.packages)
  return list.length >= 500 && list.slice(0, 50).every(r => r && typeof r.n === 'string' && typeof r.w === 'number')
}

/**
 * 检查并下载更新的目录。
 * @param {object} [opt]
 * @param {boolean} [opt.force] 不管 6 小时内查过没有，马上查
 * @returns {Promise<{checked: boolean, updated: boolean, anchor?: string, mirror?: string, error?: string}>}
 */
export async function refreshCatalog({ fetchImpl = globalThis.fetch, env = process.env, force = false, now = Date.now } = {}) {
  const state = await readState(env)
  if (!force && state.checkedAt && now() - Date.parse(state.checkedAt) < CHECK_EVERY_MS) {
    return { checked: false, updated: false }
  }
  const current = await loadCatalog({ env })
  let lastError = ''
  for (const base of MIRRORS) {
    try {
      const meta = await getJson(fetchImpl, base + 'meta.json', TIMEOUT_MS.meta)
      const done = async (result) => {
        await writeAtomic(statePath(env), JSON.stringify({ checkedAt: new Date(now()).toISOString(), anchor: meta.anchor || null, mirror: base }))
        return result
      }
      // meta 不比手上的新：不下载
      if (!newerCatalog({ ...meta, packages: {} }, current)) return done({ checked: true, updated: false, anchor: current.anchor, mirror: base })
      const cat = await getJson(fetchImpl, base + 'catalog.json', TIMEOUT_MS.catalog)
      if (!validCatalog(cat)) throw new Error('目录文件不完整')
      if (!newerCatalog(cat, current)) return done({ checked: true, updated: false, anchor: current.anchor, mirror: base })
      await writeAtomic(cachePath(env), JSON.stringify(cat))
      reloadCatalog({ ...cat, source: 'remote' })
      return done({ checked: true, updated: true, anchor: cat.anchor, mirror: base })
    } catch (e) {
      lastError = e && e.message ? e.message : String(e)
    }
  }
  // 都连不上：不记 checkedAt，下一轮再试
  return { checked: true, updated: false, error: lastError }
```

</details>

**依据 4 · 源码核查**：[plugin/index.js:171-181](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/plugin/index.js#L171-L181)

JSON POST与Origin host检查。

<details>
<summary>查看原文（11行）</summary>

```text
function isSafePost(req) {
  if (req.method !== 'POST') return false
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return false
  const origin = req.headers.origin
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}
```

</details>

**依据 5 · 源码核查**：[plugin/index.js:383-409](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/plugin/index.js#L383-L409)

安装白名单、bundle明确false及包名调用。

<details>
<summary>查看原文（27行）</summary>

```text
    // 安装目录里的插件：只装目录里有的（都是带 dsh-plugin 关键字的 npm 包），不接受任意包名
    track(ws.register({
      kind: 'exact',
      path: '/api-dsh-pick/install',
      handler: async (req, res) => {
        if (!isSafePost(req)) return sendJson(res, 403, { ok: false, message: '只接受本页面发出的请求' })
        const { name } = await readJsonBody(req)
        if (typeof name !== 'string' || !NAME_RE.test(name)) return sendJson(res, 400, { ok: false, message: '包名不对' })
        const rec = (await loadCatalog()).packages[name]
        if (!rec) return sendJson(res, 400, { ok: false, message: `${name} 不在 DSH 插件目录里，这里不装` })
        // 没声明 dsh.bundle 的包，DSH 一定拒绝安装：不白跑一趟 pnpm
        if (rec.inst && rec.inst.b === false) {
          return sendJson(res, 400, { ok: false, message: `${name} 没有声明 dsh.bundle，DSH 不能把它当插件安装` })
        }
        const command = pluginCommand(`add ${name}`, profile)
        if (!pluginManager || typeof pluginManager.installBundle !== 'function') {
          return sendJson(res, 200, { ok: false, message: '这个版本的 DSH 不能在这里装插件，请在终端执行命令', command })
        }
        try {
          const result = await pluginManager.installBundle(name, { enabled: true })
          const err = managerError(result)
          if (err) return sendJson(res, 200, { ok: false, message: `安装失败（${err}）`, command })
          return sendJson(res, 200, { ok: true, restart: result && result.application === 'restart-required' })
        } catch (e) {
          return sendJson(res, 200, { ok: false, message: `安装失败：${e.message}`, command })
        }
      },
```

</details>

**依据 6 · 源码核查**：[web/panel.js:140-185](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/web/panel.js#L140-L185)

可选市场兼容查询与前端提示。

<details>
<summary>查看原文（46行）</summary>

```text
const COMPAT = new Map() // 包名 → { status: 'compatible'|'incompatible'|'unknown', requirement }
let HOST_VERSION = null
let marketCompat = true
async function loadCompat(names) {
  if (!IN_DSH || !marketCompat) return
  const want = names.filter(n => !COMPAT.has(n)).slice(0, 64)
  if (!want.length) return
  want.forEach(n => COMPAT.set(n, null)) // 先占位：查不到也不反复查
  try {
    const r = await fetch('/dsh-market/discovery-compatibility', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ packages: want }),
    })
    if (r.status === 404) { marketCompat = false; return }
    if (!r.ok) return
    const j = await r.json()
    HOST_VERSION = j.hostVersion || HOST_VERSION
    for (const [n, v] of Object.entries(j.plugins || {})) COMPAT.set(n, v || null)
    renderCands($('#need').value.trim(), { keepCompat: true })
  } catch { /* 查不到就不显示 */ }
}

/** 已装插件里和它同类的（「其他」类不算，太杂） */
function sameKindInstalled(r) {
  if (!r.cat || r.cat === '其他' || INSTALLED.has(r.n)) return []
  return [...INSTALLED].filter(n => n !== r.n && n !== 'dsh-pick' && CAT.packages[n] && CAT.packages[n].cat === r.cat)
}

/**
 * 能不能装、为什么不能：目录里的安装信息（dsh.bundle、客户端平台）+ 插件市场给的兼容结论
 * @returns {{ok: boolean, warn: string[], good: string[]}}
 */
function installCheck(r) {
  const warn = []
  const good = []
  let ok = true
  const inst = r.inst
  if (inst && !inst.b) { ok = false; warn.push('没声明 dsh.bundle，DSH 装不了') }
  if (inst && inst.p && inst.p !== 'web') { ok = false; warn.push(`${inst.p} 客户端插件，装进这里可能让 DSH 起不来`) }
  const c = COMPAT.get(r.n)
  if (c && c.status === 'incompatible') {
    ok = false
    warn.push(`和你的 DSH${HOST_VERSION ? ' ' + HOST_VERSION : ''} 不兼容${c.requirement ? `（需要 ${c.requirement}）` : ''}`)
  } else if (c && c.status === 'compatible' && ok) {
    // 已经装不了（没 bundle、终端版）就不说「兼容」：版本对得上不等于装得上，两句放一起让人困惑
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何使用这些指标，可推导什么更可靠的选择流程？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可作为只读候选整理工具小范围试用，先提出具体任务，在相同目录截止日比较几项候选，人工检查官方包声明、权限与实际交付；不要从健康度直接安装。数据时间过旧、去噪样本不足或候选不支持任务时停止排行判断，回到原仓库和文档；安装前需单独核对版本与退路。由统计与合格任务的缺口可推导未实现的两层流程，先保留描述性热度，再附固定版本的任务适配与证据覆盖，不把未知指标默认值混成质量分。用同一候选集比较只看当前分数与增加任务证据后的选择，观察合格率、人工时间和错误安装；若没有改善或核查成本过大则否定。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/tools.js:215-237](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/plugin/tools.js#L215-L237)

指标比较与任务验证之间的边界。

<details>
<summary>查看原文（23行）</summary>

```text
      async execute(args) {
        const cat = await loadCatalog()
        const names = cleanNames(args.names, 6)
        if (names.length < 2) throw new Error('至少要两个合法的 npm 包名')
        const all = (await stats(cat, names)).map(withCatalogFields(cat))
        const rows = all.filter(r => r.source !== 'not-found')
        const missing = all.filter(r => r.source === 'not-found').map(r => r.name)
        const METRICS = [
          { label: '日常基线（越高越好）', get: r => r.deep && r.deep.baseline, better: 'max', fmt: num },
          { label: '近 7 日环比（越高越好）', get: r => r.deep && r.deep.growth, better: 'max', fmt: pct },
          { label: '最近更新（越近越好）', get: r => r.deep && r.deep.ageDays, better: 'min', fmt: n => `${n} 天前` },
          { label: '版本节奏（越短越活跃）', get: r => r.deep && r.deep.cadence, better: 'min', fmt: n => `${n} 天/版` },
          { label: '健康度（越高越好）', get: r => r.deep && r.deep.score, better: 'max', fmt: n => String(n) },
          { label: '周下载（含非人类流量）', get: r => r.weekly, better: 'max', fmt: num },
        ]
        const best = METRICS.map(m => {
          const vals = rows.map(r => [r.name, m.get(r)]).filter(([, x]) => x != null && !Number.isNaN(x))
          if (!vals.length) return { label: m.label, winner: null }
          vals.sort((a, b) => (m.better === 'max' ? b[1] - a[1] : a[1] - b[1]))
          return { label: m.label, winner: vals[0][0], value: m.fmt(vals[0][1]) }
        })
        rows.sort((a, b) => ((b.deep && b.deep.score) ?? -1) - ((a.deep && a.deep.score) ?? -1))
        return plain({ header: header(cat), best, rows: annotate(rows, cat, await installed()), missing })
```

</details>

**依据 2 · 源码核查**：[lib/metrics.js:98-109](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/lib/metrics.js#L98-L109)

默认填值支持拆分描述指标与质量假设。

<details>
<summary>查看原文（12行）</summary>

```text
export function score({ baseline: b = 0, growth: g = null, age = null, cadence: c = null }) {
  const baselinePart = clamp01(Math.log10(Math.max(b, 1)) / 4)                    // 1 → 0, 1万 → 1
  const growthPart = g === null ? 0.5 : clamp01((g + 0.5) / 1.5)                  // -50% → 0, +100% → 1
  const agePart = age === null ? 0.4 : clamp01(1 - age / 180)                     // 今天 → 1, 180 天前 → 0
  const cadencePart = c === null ? 0.4 : clamp01(1 - (c - 1) / 21)                // 1天/版 → 1, 22天/版 → 0

  return Math.round(
    baselinePart * 40 + growthPart * 25 + agePart * 20 + cadencePart * 15
  )
}

function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x }
```

</details>

**依据 3 · 源码核查**：[plugin/index.js:383-409](https://github.com/AIcivilization/dsh-pick/blob/925db2950d58c2b8662e0f6fa14f8950a0739212/plugin/index.js#L383-L409)

安装与固定版本证据分离。

<details>
<summary>查看原文（27行）</summary>

```text
    // 安装目录里的插件：只装目录里有的（都是带 dsh-plugin 关键字的 npm 包），不接受任意包名
    track(ws.register({
      kind: 'exact',
      path: '/api-dsh-pick/install',
      handler: async (req, res) => {
        if (!isSafePost(req)) return sendJson(res, 403, { ok: false, message: '只接受本页面发出的请求' })
        const { name } = await readJsonBody(req)
        if (typeof name !== 'string' || !NAME_RE.test(name)) return sendJson(res, 400, { ok: false, message: '包名不对' })
        const rec = (await loadCatalog()).packages[name]
        if (!rec) return sendJson(res, 400, { ok: false, message: `${name} 不在 DSH 插件目录里，这里不装` })
        // 没声明 dsh.bundle 的包，DSH 一定拒绝安装：不白跑一趟 pnpm
        if (rec.inst && rec.inst.b === false) {
          return sendJson(res, 400, { ok: false, message: `${name} 没有声明 dsh.bundle，DSH 不能把它当插件安装` })
        }
        const command = pluginCommand(`add ${name}`, profile)
        if (!pluginManager || typeof pluginManager.installBundle !== 'function') {
          return sendJson(res, 200, { ok: false, message: '这个版本的 DSH 不能在这里装插件，请在终端执行命令', command })
        }
        try {
          const result = await pluginManager.installBundle(name, { enabled: true })
          const err = managerError(result)
          if (err) return sendJson(res, 200, { ok: false, message: `安装失败（${err}）`, command })
          return sendJson(res, 200, { ok: true, restart: result && result.application === 'restart-required' })
        } catch (e) {
          return sendJson(res, 200, { ok: false, message: `安装失败：${e.message}`, command })
        }
      },
```

</details>

#### 缺口

- 没有以实际合格任务对照验证统计排序的选择效果。
  **影响**：不能证明去噪或健康度提高选对率，也不能给出可靠性排名。
  **进一步探讨**：固定任务、候选版本和预算，记录按指标选与人工证据选的合格交付、误装及核查负担。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
