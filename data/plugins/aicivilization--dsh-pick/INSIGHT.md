# dsh-pick

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[bbae391](https://github.com/AIcivilization/dsh-pick/tree/bbae391f560ccbf8438805d513abaf9142bc31d7)

<!-- BEGIN META -->
[![npm 30d 1,532](https://img.shields.io/static/v1?label=npm+30d&message=1%2C532&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pick) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pick)
<!-- END META -->

> **实现功能**：从插件目录搜索、比较和排行 DSH 插件，并提供下载指标与宿主安装入口。

> **核心亮点**：相对只看周下载或Star，增量在显式的去发布日指标、候选对照和安装前提醒；它改善信息组织，不能据统计指标推出安全、活跃用户或任务适用性。[Q01](#research-q01)

> **风险与缺陷**：所谓健康分仍由下载与发版代理指标构成，频繁发版会同时影响去噪基线和节奏加分；被排除样本不足又回退原始中位数，不支持“最值得安装”的因果结论。[Q03](#research-q03)

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
  - [Q01 · 去噪选型比简单热度榜多了什么？](#detail-section-11)
  - [Q02 · 目录如何更新并进入统一引擎？](#detail-section-12)
  - [Q03 · 健康分能否代表真实使用和维护质量？](#detail-section-13)
  - [Q04 · 如何使用而不被排名代替判断？](#detail-section-14)
  - [Q05 · 统计与功能证据分维度能否减少误推荐？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要缩小插件候选集的DSH用户；合格结果是带统计口径和兼容提醒的候选，不是以下载量替代源码或真实任务评估。

npm官网、市场和人工README比较能完成选型，去噪与统一候选对照减少搬运，但代码安全与功能适配仍需另查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 搜索与排行 | 缩小候选集合 | 目录覆盖和日期限制 |
| 去噪统计 | 比较下载基线、增长和节奏 | 不等于用户数或质量 |
| AI工具/面板对照 | 带口径传递候选数字 | 仍需场景及源码判断 |
| 安装委托 | 经确认交给宿主安装 | 目录入选不是安全许可 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20及可读目录 | 必需 | 引擎和内置数据 | 旧目录仍可作为有日期候选 |
| npm/GitHub镜像 | 更新与实时统计需 | 获取下载与发布 | 失败回退内置/缓存，非新鲜保证 |
| DSH插件管理器 | 安装才需 | 安装确认后委托宿主 | 不支持时返回终端命令 |
| dshmarket | 兼容提示可选 | 查询宿主兼容 | 未装时缺该提醒 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户说明任务并查候选 | 核对目录日期和统计口径 |
| 2 | 比较2–6项并阅读源码/依赖 | 不把健康分当适用结论 |
| 3 | 明确确认后由宿主安装 | 失败读管理器错误，必要时重启 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 插件与目录缓存，金额未知 | 学习指标和候选核查 | 不安装候选也可读数据 |
| 持续使用 | 每6小时更新和npm请求 | 复核功能、权限、兼容 | 下载不能替代人工研究 |
| 失败恢复 | 网络重试和目录回退 | 核对数据日期及安装状态 | 缓存可用不代表新数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少发布峰值影响 | 排除发布日/次日并取中位数 | 估计真实使用量的准确性 |
| 选型辅助 | 搜索、比较和提醒已接线 | 合格安装选择率或安全性 |

> **思考**：所谓健康分仍由下载与发版代理指标构成，频繁发版会同时影响去噪基线和节奏加分；被排除样本不足又回退原始中位数，不支持“最值得安装”的因果结论。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对只看周下载或Star，增量在显式的去发布日指标、候选对照和安装前提醒；它改善信息组织，不能据统计指标推出安全、活跃用户或任务适用性。[Q01](#research-q01)

相对只看周下载或Star，增量在显式的去发布日指标、候选对照和安装前提醒；它改善信息组织，不能据统计指标推出安全、活跃用户或任务适用性。[Q01](#research-q01)

引擎复用和更新原子写减少半目录风险，网络失败保留已有数据。validCatalog只检查最低包数与前50项字段，属于形状门槛而非全目录语义验收；移植时应增加数据来源和缺失状态审查。

<a id="detail-section-5"></a>

### 1.4 主要限制

所谓健康分仍由下载与发版代理指标构成，频繁发版会同时影响去噪基线和节奏加分；被排除样本不足又回退原始中位数，不支持“最值得安装”的因果结论。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

可把它当候选搜索和数字比较工具试用；先核对日期与兼容，再读目标插件权限和源码。安装前自行确认，不能把健康分当安全或推荐结论。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/metrics.js、lib/engine.js、lib/remote.js、plugin/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查引擎、指标、远程更新和安装委托；不把随包catalog的数值视为已独立验证需求或用户数。
- 下一步：按固定任务预注册候选验收标准，比较热度、去噪及源码证据三种选择方法的合格率和总核查时间；对频繁发版样本作敏感性分析，未执行。

**分析版本**

- **仓库**：[AIcivilization/dsh-pick](https://github.com/AIcivilization/dsh-pick)
- **版本号**：0.4.4（[固定提交 bbae391](https://github.com/AIcivilization/dsh-pick/tree/bbae391f560ccbf8438805d513abaf9142bc31d7)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把指标结论与源码/兼容证据分成独立维度，并为基线提供敏感性区间，可减少高热度误推荐；用已知任务盲选比较合格率与核查成本，没有提升则否定。[Q05](#research-q05)

按固定任务预注册候选验收标准，比较热度、去噪及源码证据三种选择方法的合格率和总核查时间；对频繁发版样本作敏感性分析，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 10 | 2862 | 2262 | 368 | — |
| .md | source | 1 | 232 | — | — | 2427 |
| .mjs | source | 2 | 147 | 108 | 21 | — |
| .js | test | 6 | 519 | 451 | 24 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-pick/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-pick/issues?q=is%3Aissue+created%3A2026-09-23T01%3A50%3A41.035Z..2026-10-23T01%3A50%3A41.035Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-pick/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T01%3A50%3A41.035Z..2026-10-23T01%3A50%3A41.035Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：AIcivilization/dsh-pick 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 去噪选型比简单热度榜多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件把需求搜索、候选比较、统计口径与安装入口放到一处，省去反复在npm和市场搬运数字。核心统计剔除发布日与次日并取中位数，能削弱部分发版尖峰。这个设计只改变代理指标，不给用户真实任务、权限或可靠性证据；“找到候选”可以成立，“挑对”仍需场景与源码核查。

#### 证据与依据

**依据 1 · 源码核查**：[lib/metrics.js:29-53](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/lib/metrics.js#L29-L53)

去噪是有限发布日排除而非真实用户测量。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * 日常基线：扣掉发布日影响后的每日中位数
 * 发布日当天 + 后一天很可能是拉取安装产生的虚高，剔除后再取中位数。
 * 中位数本身对尖峰不敏感，再剔一次发布日就更接近真实使用量。
 * @param {number[]} daily 近 30 天每日下载
 * @param {string[]} releaseDates 该窗口内发布过版本的日期（ISO）
 * @param {string} startISO 窗口首日（ISO）
 * @returns {number}
 */
export function baselineWithStart(daily = [], releaseDates = [], startISO = '') {
  if (!daily.length) return 0
  if (!releaseDates.length || !startISO) return median(daily)

  const spikes = new Set()
  const s = toDay(startISO)
  for (const d of releaseDates) {
    const n = toDay(d)
    if (n >= s && n <= s + daily.length) {
      spikes.add(n - s)        // 发布当天
      spikes.add(n - s + 1)    // 发布次日
    }
  }
  const kept = daily.filter((_, i) => !spikes.has(i))
  return kept.length >= 5 ? median(kept) : median(daily)
}
```

</details>

**依据 2 · 作者声明**：[README.md:66-82](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/README.md#L66-L82)

工具和安装前提醒的作者功能说明。

<details>
<summary>查看原文（17行）</summary>

```text

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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录如何更新并进入统一引擎？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

远程先取meta比较新旧，更新时拉目录，validCatalog过门槛后写临时文件再rename，最后reload内存。失败保留原数据，内置目录兜底；这改善可用性但可能陈旧。引擎从npm关键字搜索形成目录，deep默认仅覆盖下载前部，未深挖项不能假装有同等证据。安装通过宿主管理器，包名需在目录且有bundle提示。

#### 证据与依据

**依据 1 · 源码核查**：[lib/remote.js:79-106](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/lib/remote.js#L79-L106)

更新检查、校验与保留旧数据。

<details>
<summary>查看原文（28行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/engine.js:140-147](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/lib/engine.js#L140-L147)

deep按周下载选择产生覆盖边界。

```text
  // 深挖：日序列 + 发布历史 → 日常基线 / 增速 / 版本节奏 / 新鲜度
  // 注意：api.npmjs.org 并发稍高就开始 429，所以下载量请求必须低并发；
  //      registry.npmjs.org 宽松得多，可以并发。两段分开抓。
  // deepOnly 时只补缺失的；全量时按周下载取 Top N
  const targets = [...records.values()]
    .filter(r => (deepOnly ? !r.deep : true))
    .sort((a, b) => b.w - a.w)
    .slice(0, deep)
```

**依据 3 · 源码核查**：[plugin/index.js:386-407](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/plugin/index.js#L386-L407)

安装权限委托和目录门槛。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 健康分能否代表真实使用和维护质量？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。score对下载基线、增长、更新时间和发版节奏加权，没有功能正确性或用户留存项。频繁发布时剔除后少于5天又回退原始中位数，可能使所谓去噪失去原解释。新版多不等于维护质量高，下载也包含自动化。远程校验只检查前50项和包数，不能当全目录真实有效。它适合展示可解释数字，不宜自动做高风险安装决策。

#### 证据与依据

**依据 1 · 源码核查**：[lib/metrics.js:38-52](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/lib/metrics.js#L38-L52)

不足样本回退口径。

<details>
<summary>查看原文（15行）</summary>

```text
export function baselineWithStart(daily = [], releaseDates = [], startISO = '') {
  if (!daily.length) return 0
  if (!releaseDates.length || !startISO) return median(daily)

  const spikes = new Set()
  const s = toDay(startISO)
  for (const d of releaseDates) {
    const n = toDay(d)
    if (n >= s && n <= s + daily.length) {
      spikes.add(n - s)        // 发布当天
      spikes.add(n - s + 1)    // 发布次日
    }
  }
  const kept = daily.filter((_, i) => !spikes.has(i))
  return kept.length >= 5 ? median(kept) : median(daily)
```

</details>

**依据 2 · 源码核查**：[lib/metrics.js:89-102](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/lib/metrics.js#L89-L102)

加权分数全部来自代理变量。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * 综合评分 0~100，用于「首选 / 备选」的默认排序依据
 * 权重：日常基线 40% + 增速 25% + 新鲜度 20% + 版本节奏 15%
 * 注意：这是给面板用的默认口径，AI 拿到同样的字段可以自行调整权重并解释
 */
export function score({ baseline: b = 0, growth: g = null, age = null, cadence: c = null }) {
  const baselinePart = clamp01(Math.log10(Math.max(b, 1)) / 4)                    // 1 → 0, 1万 → 1
  const growthPart = g === null ? 0.5 : clamp01((g + 0.5) / 1.5)                  // -50% → 0, +100% → 1
  const agePart = age === null ? 0.4 : clamp01(1 - age / 180)                     // 今天 → 1, 180 天前 → 0
  const cadencePart = c === null ? 0.4 : clamp01(1 - (c - 1) / 21)                // 1天/版 → 1, 22天/版 → 0

  return Math.round(
    baselinePart * 40 + growthPart * 25 + agePart * 20 + cadencePart * 15
  )
```

</details>

**依据 3 · 源码核查**：[lib/remote.js:65-70](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/lib/remote.js#L65-L70)

形状校验的有限覆盖。

```text
/** 下载来的目录像不像样：包够多、字段齐。防止镜像返回半截文件或错误页 */
export function validCatalog(cat) {
  if (!cat || typeof cat !== 'object' || !cat.packages || typeof cat.packages !== 'object') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(cat.anchor || ''))) return false
  const list = Object.values(cat.packages)
  return list.length >= 500 && list.slice(0, 50).every(r => r && typeof r.n === 'string' && typeof r.w === 'number')
```

#### 缺口

- 指标对真实用户、合格任务的预测有效性未知
  **影响**：限制把首选排名当采用证据
  **进一步探讨**：在预定义任务集对照选择结果，并分析频繁发布和缺失样本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何使用而不被排名代替判断？

**研究主题**：效果与总成本、采用判断

#### 完整回答

先描述实际任务，读候选日期、数据缺失和兼容提醒，再查源码权限、外部服务及卸载路径；确认后才安装。纯读数据的试用范围可控，但安装候选会引入其自身成本，不能归为本工具已验收。网络更新和免费公开接口不证明长期可用或净节时，独立核查仍是必要人工投入。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:390-407](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/plugin/index.js#L390-L407)

安装前输入门槛与宿主错误处理。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/remote.js:101-106](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/lib/remote.js#L101-L106)

网络失败不升级数据新鲜度。

```text
    } catch (e) {
      lastError = e && e.message ? e.message : String(e)
    }
  }
  // 都连不上：不记 checkedAt，下一轮再试
  return { checked: true, updated: false, error: lastError }
```

#### 缺口

- 选型净耗时和错误安装减少量未知
  **影响**：不能宣称去噪提高用户决策质量
  **进一步探讨**：记录从需求到合格候选的总时间和被独立验收拒绝的比例。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 统计与功能证据分维度能否减少误推荐？

**研究主题**：新假设与验证

#### 完整回答

未验证设计把下载统计、功能源码证据、兼容和实际任务验收分开呈现，不折成一个健康分；为去噪显示剔除比例和区间。推导来自当前加权分的代理混淆。用同一任务盲选比较当前榜单和分维度方案的合格率、错误安装和核查时间，若增加认知负担而选择不改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/metrics.js:89-102](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/lib/metrics.js#L89-L102)

单分数混合代理变量是设计参照。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * 综合评分 0~100，用于「首选 / 备选」的默认排序依据
 * 权重：日常基线 40% + 增速 25% + 新鲜度 20% + 版本节奏 15%
 * 注意：这是给面板用的默认口径，AI 拿到同样的字段可以自行调整权重并解释
 */
export function score({ baseline: b = 0, growth: g = null, age = null, cadence: c = null }) {
  const baselinePart = clamp01(Math.log10(Math.max(b, 1)) / 4)                    // 1 → 0, 1万 → 1
  const growthPart = g === null ? 0.5 : clamp01((g + 0.5) / 1.5)                  // -50% → 0, +100% → 1
  const agePart = age === null ? 0.4 : clamp01(1 - age / 180)                     // 今天 → 1, 180 天前 → 0
  const cadencePart = c === null ? 0.4 : clamp01(1 - (c - 1) / 21)                // 1天/版 → 1, 22天/版 → 0

  return Math.round(
    baselinePart * 40 + growthPart * 25 + agePart * 20 + cadencePart * 15
  )
```

</details>

**依据 2 · 源码核查**：[lib/metrics.js:38-52](https://github.com/AIcivilization/dsh-pick/blob/bbae391f560ccbf8438805d513abaf9142bc31d7/lib/metrics.js#L38-L52)

剔除和回退支持敏感性区间需要。

<details>
<summary>查看原文（15行）</summary>

```text
export function baselineWithStart(daily = [], releaseDates = [], startISO = '') {
  if (!daily.length) return 0
  if (!releaseDates.length || !startISO) return median(daily)

  const spikes = new Set()
  const s = toDay(startISO)
  for (const d of releaseDates) {
    const n = toDay(d)
    if (n >= s && n <= s + daily.length) {
      spikes.add(n - s)        // 发布当天
      spikes.add(n - s + 1)    // 发布次日
    }
  }
  const kept = daily.filter((_, i) => !spikes.has(i))
  return kept.length >= 5 ? median(kept) : median(daily)
```

</details>

#### 缺口

- 分维度原型与效益未验证
  **影响**：不应计入当前能力
  **进一步探讨**：用小批任务及预注册验收标准比较。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
