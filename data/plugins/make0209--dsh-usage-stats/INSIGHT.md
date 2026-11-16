# dsh-usage-stats

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8992d30](https://github.com/Make0209/dsh-usage-stats/tree/8992d306cdca8857b4362868d591fde3689765b0)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Make0209/dsh-usage-stats) [![npm 30d 1,736](https://img.shields.io/static/v1?label=npm+30d&message=1%2C736&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-usage-stats) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-usage-stats)
<!-- END META -->

> **功能**：在 DSH 设置页提供用量热力图、Token 与缓存统计、账户余额和工作区别名管理。

> **亮点**：插件把已登记工作区的持久化会话和实时事件归并到 Web 设置页。与逐个查会话相比，用户可以从工作区和日期回查使用波动。复用宿主的会话、工作区和设置槽位，插件自身实现归属、去重、展示及别名。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：面板完成扫描后无法让用户判断缺少活动还是漏算。未匹配路径的记录会被跳过，部分错误仅在扫描中可见，且统计刷新不重跑回填。余额首选 Windows 子进程还会把凭据置入 argv。两处边界分别限制对账和部署。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 用户如何从工作区活动进入复盘，较手动查看会话多出什么？](#detail-section-11)
  - [Q02 · 持久化与实时事件怎样并入同一快照，在哪些情况下漏计？](#detail-section-12)
  - [Q03 · 余额如何取凭据并出网，公开或非 Windows 宿主能否沿用？](#detail-section-13)
  - [Q04 · 修改别名后在什么条件下能跨重启保留，失败从哪里看出来？](#detail-section-14)
  - [Q05 · 从安装到一次可对账的周用量复盘，需要哪些条件和人工？](#detail-section-15)
  - [Q06 · 增加每工作区覆盖状态，能否减少错误地把漏算当成不活跃？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常跨工作区使用 DSH Web 的个人开发者可以按近期回合及 Token 使用找出值得回查的工作区和日期。按同一用户、时区与已登记路径抽查原始事件，才能完成一次可信的周复盘。

逐个会话复盘需要人工分组，已有本地日志脚本也可以按同一口径汇总并保留异常明细。插件增加面板、定时刷新与跨期查看，仍依赖相同宿主日志，并把覆盖核对留给使用者。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工作区用量快照 | 聚合历史回合和消息 Token，按日期浏览 | 依赖宿主会话与工作区映射，无法归属的记录被跳过 |
| 实时更新 | 处理新会话事件和补读序号缺口 | 依赖宿主持久化与通知顺序 |
| 账户余额 | 查询 DeepSeek 账户余额 | 依赖宿主凭据、子进程和 Windows 命令 |
| 工作区别名 | 帮用户识别列表和热力图中的工作区 | 跨重启保存要求 JSON 后端实际写入 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Web profile、固定包和 patch | 启动必需 | 定位宿主与浏览器入口 | 版本或模块格式不匹配时无法确认加载 |
| sessionQuery、workspaceRegistry、timer、webServer 与设置槽位 | 使用看板必需 | 加载日志、识别工作区、轮询和渲染 | 宿主服务不兼容会阻止加载或令页面无数据 |
| JSON storage 后端 | 跨重启保留别名需要 | 保存工作区映射 | 可收到即时成功但之后丢失 |
| DeepSeek 凭据、子进程服务、Windows 命令和联网 | 余额需要 | 从官方接口查询余额 | 余额显示缺配置或错误，统计仍是独立路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者比对固定源码与安装包，并查 Web 宿主服务和访问边界 | 可以明确装载版本和接口依赖，未知则保留观察状态 |
| 加载 | 在隔离 Web profile 挂载固定包 | 可见用量设置页，统计路由能返回结构化快照 |
| 复盘 | 用户选择工作区和日期，以原始日志抽查事件 | 日期、归属和用量分项相符，记录缺失则回到日志 |
| 退出 | 用户导出仍需保存的别名并移除插件 | 页面和路由撤回，原始日志仍可使用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 历史扫描占读盘、计算及内存，金额未知 | 需核对包版本、宿主配置及工作区路径 | 扫描耗时、峰值和迁移成本未测 |
| 持续使用 | 事件折叠、页面轮询，以及有条件的账户查询 | 周复盘需对照抽查，别名需维护 | 现金、人工和错误率分别未知 |
| 失败恢复 | 可能需要重复读日志、重启 profile 或补录别名 | 诊断记录缺口、版本或权限，回到原始数据 | 无可靠合格任务单位成本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 近期用量复盘 | 固定源码显示设置页、历史与实时聚合及日切片 | 实际节时、覆盖一致率 |
| 余额查询 | 有凭据选择、Windows 子进程、解析、缓存与失败分支 | 目标宿主可用性、密钥可见范围 |
| 别名 | 客户端可查看更新并由 JSON 后端保存 | 失败可见性欠缺，重启后成功比例未知 |

> **思考**：面板完成扫描后无法让用户判断缺少活动还是漏算。未匹配路径的记录会被跳过，部分错误仅在扫描中可见，且统计刷新不重跑回填。余额首选 Windows 子进程还会把凭据置入 argv。两处边界分别限制对账和部署。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：插件把已登记工作区的持久化会话和实时事件归并到 Web 设置页。与逐个查会话相比，用户可以从工作区和日期回查使用波动。复用宿主的会话、工作区和设置槽位，插件自身实现归属、去重、展示及别名。[Q01](#research-q01) [Q02](#research-q02)

把持久化读取与事件流串行合并、用序号区分重叠和缺口，是可移植的机制。移植依赖可靠事件序号和可重读存储；当前一次性路径索引与进度提示无法报告完整归属。别名异步回执还需要把存储失败传回界面。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

面板完成扫描后无法让用户判断缺少活动还是漏算。未匹配路径的记录会被跳过，部分错误仅在扫描中可见，且统计刷新不重跑回填。余额首选 Windows 子进程还会把凭据置入 argv。两处边界分别限制对账和部署。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先确认固定版本分发与目标宿主的装载条件。目前适合追踪进展。条件满足时，优先在隔离 Web profile 用可核对的工作区记录验证最近一周的计数与归属。在需要远程访问、准备输入真实凭据或需要用量对账时，先独立核对数据覆盖和路由权限。 [Q05](#research-q05) [Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持设置页、按工作区归并、历史回填与部分错误分支的机制判断。覆盖状态属于待验证设计。宿主兼容、发布物一致性、路径归属结果和实际节时尚未确认。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核对固定仓库根包的清单、配置补丁、两份 JS 和 README。未把宿主内部访问控制、凭据审计或外部发布物视为已经核实。npm 版本来自同轮单独保存的 META。
- 下一步：使用同一时区的固定会话样本，分别注入 cwd 迁移、读取错误与序号缺口，对照原始日志和面板输出。用替代凭据核查目标宿主访问权限与子进程调用记录，再断开 JSON 存储核对别名失败提示与重启留存。

**分析版本**

- **仓库**：[Make0209/dsh-usage-stats](https://github.com/Make0209/dsh-usage-stats)
- **版本号**：1.0.0（[固定提交 8992d30](https://github.com/Make0209/dsh-usage-stats/tree/8992d306cdca8857b4362868d591fde3689765b0)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在快照中保留未归属、读失败和完成补读的分项，向用户显示哪些工作区的零值仍需核对。用同一批混入路径迁移与读取异常的记录比较误判和复核耗时，只有提示减少误判且负担可接受才保留。[Q06](#research-q06)

使用同一时区的固定会话样本，分别注入 cwd 迁移、读取错误与序号缺口，对照原始日志和面板输出。用替代凭据核查目标宿主访问权限与子进程调用记录，再断开 JSON 存储核对别名失败提示与重启留存。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1210 | 1158 | 24 | — |
| .md | source | 1 | 65 | — | — | 653 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-16），可前往 [GitHub Issues](https://github.com/Make0209/dsh-usage-stats/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：经常跨多个已登记工作区使用 DSH Web 的个人开发者，能否用插件复盘近期回合和 Token 使用，并知道什么时候需要回到原始记录？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户如何从工作区活动进入复盘，较手动查看会话多出什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常在多个登记工作区间切换的个人开发者，可以在 DSH Web 设置页按时间回看用量，先找出活动密集日期，再定位到某个工作区。相较于逐会话翻阅持久化记录，插件先按工作区和本地日期归拢回合与消息用量，前端拿到快照后直接给出热力图及同页明细。这一层减少人工归并步骤，能说明哪里值得追查。合格复盘应能用抽查的已登记工作区记录复现同日回合和各 Token 项。

设定页的调用链由根包的 bundle patch 载入宿主，Web 端把独立模块注册到 settings.section，页面调用同源统计 API。Host 对已经归属的回合和消息用量分别累计。前端默认给近 90 天摘要，另可切近 30 天或全部。近 30／90 天从每日桶累计，而全部用 Host 累计值。热力图按自然周建 53 周格子，没记录的日期也会画格。缓存命中率是缓存读 Token 除以输入加缓存读 Token，图中回合是 turn/end 数，不等于用户数或会话数。总 Token 是多个用量字段相加，收支核对要按提供商计费口径重算。单一短会话只需读原会话，跨人或跨账单汇总还缺范围与对账输入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-10](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/README.md#L5-L10)

作者列出面板能力和时间范围。

```text
DeepSeek Harness 插件：GitHub 风格用量热力图 + Token / 缓存命中 / 账户余额看板 + 工作区别名管理。

- **热力图**：53 周 GitHub 绿，每完成一个回合点亮；悬停按工作区显示次数明细与当日 Token
- **统计卡片**：总花费 Token（分项）、缓存命中率、账户余额（DeepSeek 官方接口）、总使用次数、连续使用、各工作区 Token 进度条
- **工作区别名**：头部「✎ 工作区别名」管理，持久化保存（`$DSH_HOME/storages` 的 KV 单元 `usage-stats-aliases`）
- 时间范围切换（近 30 天 / 近 90 天 / 全部）、动画、亮暗主题自适应
```

**依据 2 · 源码核查**：[package.json:6-27](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/package.json#L6-L27)

宿主导出、客户端入口与 Web 依赖定位。

<details>
<summary>查看原文（22行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings-general"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:3-5](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/cordis.patch.yml#L3-L5)

挂载真实包名。

```text
- insert:
    - id: usage-stats
      name: dsh-usage-stats
```

**依据 4 · 源码核查**：[lib/client.js:677-685](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L677-L685)

设置槽位实际注册 UsagePage。

```text
    exports.inject = ['timer']
    exports.apply = (ctx) => {
      const slots = ctx.get('slots')
      if (slots === undefined) return
      slots.inject('settings.section', () => slots.register(
        { name: 'settings.section', id: 'usage-stats', order: 30, label: () => '用量统计' },
        () => React.createElement(UsagePage, { timerCtx: ctx }),
      ))
    }
```

**依据 5 · 源码核查**：[lib/client.js:245-261](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L245-L261)

页面使用三个同源 API。

<details>
<summary>查看原文（17行）</summary>

```text
    // 与 Host 半的数据接口（webServer 路由）
    const getStats = () => fetch('/api/usage-stats', { headers: { accept: 'application/json' } }).then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status)
      return r.json()
    })
    const getBalance = (force) => fetch('/api/usage-stats/balance' + (force ? '?force=1' : ''), { headers: { accept: 'application/json' } }).then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status)
      return r.json()
    })
    const setAliasRpc = (workspaceId, alias) => fetch('/api/usage-stats/alias', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ workspaceId, alias }),
    }).then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status)
      return r.json()
    })
```

</details>

**依据 6 · 源码核查**：[lib/index.js:315-335](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L315-L335)

快照的每日和总体数据形态。

<details>
<summary>查看原文（21行）</summary>

```text
    for (const pair of byDay) {
      const date = pair[0]
      const day = pair[1]
      if (date < cutoff) continue
      byDayArr.push({
        date,
        turns: day.turns,
        tokens: { input: day.tokens.input, output: day.tokens.output, cacheRead: day.tokens.cacheRead, cacheWrite: day.tokens.cacheWrite, reasoning: day.tokens.reasoning },
        perWorkspace: Array.from(day.perWs, (p) => ({ workspaceId: p[0], turns: p[1] })),
        byWorkspace: Array.from(day.byWs, (p) => ({ workspaceId: p[0], input: p[1].input, output: p[1].output, cacheRead: p[1].cacheRead, cacheWrite: p[1].cacheWrite, reasoning: p[1].reasoning })),
      })
    }
    byDayArr.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    return {
      scan: { started: scan.started, done: scan.done, scanned: scan.scanned, total: scan.total, failed: scan.failed },
      generatedAt: Date.now(),
      workspaces: Array.from(wsMeta.values(), (w) => ({ id: w.id, title: w.title, path: w.path })),
      aliases: Object.assign({}, aliases),
      totals: { turns: totals.turns, sessions: sessionCount.size, input: totals.input, output: totals.output, cacheRead: totals.cacheRead, cacheWrite: totals.cacheWrite, reasoning: totals.reasoning },
      perWorkspace: Array.from(perWorkspace, (p) => ({ workspaceId: p[0], turns: p[1].turns, input: p[1].input, output: p[1].output, cacheRead: p[1].cacheRead, cacheWrite: p[1].cacheWrite, reasoning: p[1].reasoning })),
      byDay: byDayArr,
```

</details>

**依据 7 · 源码核查**：[lib/client.js:59-90](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L59-L90)

30／90 天切片使用每日桶。

<details>
<summary>查看原文（32行）</summary>

```text
    function rangeAgg(stats, range) {
      if (stats === null) return { totals: { turns: 0, sessions: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0 }, perWs: [] }
      if (range === 'all') return { totals: stats.totals, perWs: stats.perWorkspace }
      let cutoff
      if (range === '30d') cutoff = fmtDate(new Date(Date.now() - 29 * 86400000))
      else cutoff = fmtDate(new Date(Date.now() - 89 * 86400000))
      const t = { turns: 0, sessions: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0 }
      const per = new Map()
      for (const day of stats.byDay) {
        if (day.date < cutoff) continue
        t.turns += day.turns
        t.input += day.tokens.input
        t.output += day.tokens.output
        t.cacheRead += day.tokens.cacheRead
        t.cacheWrite += day.tokens.cacheWrite
        t.reasoning += day.tokens.reasoning
        for (const w of day.byWorkspace) {
          let p = per.get(w.workspaceId)
          if (p === undefined) { p = { workspaceId: w.workspaceId, turns: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0 }; per.set(w.workspaceId, p) }
          p.input += w.input
          p.output += w.output
          p.cacheRead += w.cacheRead
          p.cacheWrite += w.cacheWrite
          p.reasoning += w.reasoning
        }
        for (const w of day.perWorkspace) {
          let p = per.get(w.workspaceId)
          if (p === undefined) { p = { workspaceId: w.workspaceId, turns: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0 }; per.set(w.workspaceId, p) }
          p.turns += w.turns
        }
      }
      return { totals: t, perWs: Array.from(per.values()) }
```

</details>

**依据 8 · 源码核查**：[lib/client.js:351-362](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L351-L362)

组合用量和日历格子。

<details>
<summary>查看原文（12行）</summary>

```text
      const totalTokens = agg.totals.input + agg.totals.output + agg.totals.cacheRead + agg.totals.cacheWrite + agg.totals.reasoning
      const cacheRate = rateOf(agg.totals.input, agg.totals.cacheRead)
      const st = streaks(dayMap)

      const today = new Date()
      const todayKey = fmtDate(today)
      const sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
      const start = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() - 52 * 7)
      const cells = []
      for (let i = 0; i < 53 * 7; i++) {
        const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
        cells.push({ date: fmtDate(d), month: d.getMonth(), year: d.getFullYear() })
```

</details>

**依据 9 · 源码核查**：[lib/client.js:27-31](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L27-L31)

命中率分母定义。

```text
    function rateOf(input, cacheRead) {
      const denom = input + cacheRead
      if (denom <= 0) return 0
      return (cacheRead / denom) * 100
    }
```

#### 缺口

- 同一批日志的人工复核和插件结果尚无对照。
  **影响**：只能判断流程少了手工归并，无法给出一致率或节时。
  **进一步探讨**：抽取固定用户时区的已归属会话，逐项对照工作区、日期和指标。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 持久化与实时事件怎样并入同一快照，在哪些情况下漏计？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

回填和实时处理按会话串行，序号避免一般的重复折叠。激活后先读 workspaceRegistry，建立工作区路径和会话成员映射，然后 listSessions 逐个按记录 cwd 字符串找精确匹配，读取持久化事件。每遇到 turn/end 增加一个回合，assistant/message 的 usage 更新 Token。站在实时事件侧可先用已知成员关系，否则再按 cwd 查路径；因此实时和历史归属规则并不完全相同。首次事件或序号跳跃会读完整快照补缺，普通相邻序号直接累计。按页打开后的轮询频率从回填期间约两秒减到完成后约十五秒，用户读到内存摘要而非原始日志。

路径表只在一次性回填中填充，未完全匹配、工作区新登记后表未更新、历史 cwd 迁移等都会使记录无法归属。历史列表查询异常被捕获后仍可结束扫描，不能以完成标志推断有覆盖。缺 header 和无法匹配的记录计入 scanned 而无失败原因。读取异常才增加 failed 并设置序号 -1；Client 只在进度可见时展示失败计数，普通刷新重读快照不会重跑已经 started 的回填。首次实时快照或缺口补读只折叠已持久化事件，若落盘晚于通知则需要后续事件使其被重新读取。以上条件限制了自动历史回填的解释，缺失数据容易被当成没有活动。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:87-131](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L87-L131)

Token 和回合分别聚合，较早记录仍进累计值。

<details>
<summary>查看原文（45行）</summary>

```text
  function addUsage(wsId, time, usage) {
    const input = num(usage && usage.inputTokens)
    const output = num(usage && usage.outputTokens)
    const cacheRead = num(usage && usage.cacheReadTokens)
    const cacheWrite = num(usage && usage.cacheWriteTokens)
    const reasoning = num(usage && usage.reasoningTokens)
    totals.input += input
    totals.output += output
    totals.cacheRead += cacheRead
    totals.cacheWrite += cacheWrite
    totals.reasoning += reasoning
    const ws = ensureWs(wsId)
    ws.input += input
    ws.output += output
    ws.cacheRead += cacheRead
    ws.cacheWrite += cacheWrite
    ws.reasoning += reasoning
    const date = dayKey(time)
    if (date < cutoffKey()) return
    const day = ensureDay(date)
    day.tokens.input += input
    day.tokens.output += output
    day.tokens.cacheRead += cacheRead
    day.tokens.cacheWrite += cacheWrite
    day.tokens.reasoning += reasoning
    const dw = ensureDayWs(day, wsId)
    dw.input += input
    dw.output += output
    dw.cacheRead += cacheRead
    dw.cacheWrite += cacheWrite
    dw.reasoning += reasoning
  }
  function addTurn(wsId, time) {
    const date = dayKey(time)
    ensureWs(wsId).turns += 1
    totals.turns += 1
    if (date < cutoffKey()) return
    const day = ensureDay(date)
    day.turns += 1
    day.perWs.set(wsId, (day.perWs.get(wsId) || 0) + 1)
  }
  function foldEvent(wsId, time, type, data) {
    if (type === 'turn/end') addTurn(wsId, time)
    else if (type === 'assistant/message' && data && data.usage) addUsage(wsId, time, data.usage)
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:132-194](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L132-L194)

序号和串行队列控制实时去重与补读。

<details>
<summary>查看原文（63行）</summary>

```text
  function foldEvents(wsId, events, fromSeq) {
    for (const ev of events) {
      if (fromSeq !== undefined) {
        const s = typeof ev.seq === 'number' ? ev.seq : -1
        if (s <= fromSeq) continue
      }
      if (ev.type === 'turn/end' || ev.type === 'assistant/message') foldEvent(wsId, ev.time, ev.type, ev.data)
    }
  }
  function lastSeqOf(events) {
    let last = 0
    for (const ev of events) {
      const s = typeof ev.seq === 'number' ? ev.seq : -1
      if (s > last) last = s
    }
    return last
  }
  function enqueue(sid, task) {
    const prev = chains.get(sid) || Promise.resolve()
    const next = prev.then(() => task(), () => task())
    chains.set(sid, next)
    return next
  }
  function wsForLiveSession(session, sid) {
    let wsId = memberOf.get(sid)
    if (wsId !== undefined) return wsId
    const header = session && session.header
    const cwd = header && typeof header.cwd === 'string' ? header.cwd : ''
    if (cwd === '') return undefined
    wsId = pathIndex.get(cwd)
    if (wsId !== undefined) memberOf.set(sid, wsId)
    return wsId
  }
  async function processLiveEvent(sid, wsId, event) {
    const seq = typeof event.seq === 'number' ? event.seq : -1
    const last = sessionSeq.get(sid)
    if (last === undefined) {
      try {
        const snap = await ctx.sessionQuery.readSession(sid)
        if (snap && Array.isArray(snap.events)) {
          foldEvents(wsId, snap.events)
          sessionSeq.set(sid, lastSeqOf(snap.events))
          sessionCount.add(sid)
        }
      } catch (err) { /* retry on the next event */ }
      return
    }
    if (seq <= last) return
    if (seq > last + 1) {
      try {
        const snap = await ctx.sessionQuery.readSession(sid)
        if (snap && Array.isArray(snap.events)) {
          foldEvents(wsId, snap.events, last)
          sessionSeq.set(sid, lastSeqOf(snap.events))
        }
      } catch (err) { /* keep last; retry later */ }
      return
    }
    foldEvent(wsId, event.time, event.type, event.data)
    sessionSeq.set(sid, seq)
    sessionCount.add(sid)
  }

```

</details>

**依据 3 · 源码核查**：[lib/index.js:195-265](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L195-L265)

扫描路径映射、跳过、异常与实时订阅。

<details>
<summary>查看原文（71行）</summary>

```text
  // ---------- baseline scan over durable logs ----------
  async function runBaseline() {
    if (scan.started) return
    scan.started = true
    try {
      const workspaces = ctx.workspaceRegistry.list()
      for (const w of workspaces) {
        const id = w && w.id
        const path = w && typeof w.path === 'string' ? w.path : ''
        const title = w && typeof w.title === 'string' ? w.title : ''
        if (id === undefined) continue
        wsMeta.set(id, { id, title, path })
        if (path !== '') pathIndex.set(path, id)
        if (w && Array.isArray(w.sessionIds)) {
          for (const sid of w.sessionIds) memberOf.set(sid, id)
        }
      }
    } catch (err) {
      console.error('[usage-stats] workspace list failed:', err)
    }
    let records = []
    try {
      records = await ctx.sessionQuery.listSessions()
    } catch (err) {
      console.error('[usage-stats] session list failed:', err)
    }
    scan.total = Array.isArray(records) ? records.length : 0
    for (const record of records) {
      if (record === undefined || record === null || record.header === undefined) {
        scan.scanned += 1
        continue
      }
      const sid = record.header.id
      const cwd = typeof record.header.cwd === 'string' ? record.header.cwd : ''
      const wsId = cwd === '' ? undefined : pathIndex.get(cwd)
      if (sid === undefined || wsId === undefined) {
        scan.scanned += 1
        continue
      }
      await enqueue(sid, async () => {
        try {
          if (sessionSeq.has(sid)) return
          const snap = await ctx.sessionQuery.readSession(sid)
          if (snap && Array.isArray(snap.events)) {
            foldEvents(wsId, snap.events)
            sessionSeq.set(sid, lastSeqOf(snap.events))
            sessionCount.add(sid)
          }
        } catch (err) {
          sessionSeq.set(sid, -1)
          scan.failed += 1
        } finally {
          scan.scanned += 1
        }
      })
      await ctx.timeout(0)
    }
    scan.done = true
  }

  // ---------- live feed ----------
  ctx.on('session/event', (session, event) => {
    if (event === undefined || event === null) return
    const type = event.type
    if (type !== 'turn/end' && type !== 'assistant/message') return
    const sid = session && session.id
    if (typeof sid !== 'string') return
    const wsId = wsForLiveSession(session, sid)
    if (wsId === undefined) return
    enqueue(sid, () => processLiveEvent(sid, wsId, event))
  })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:473-480](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L473-L480)

统计请求在 scan.started 后只取快照。

```text
  if (webServer !== undefined) {
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/api/usage-stats',
      handler: (req, res) => {
        if (!scan.started) void runBaseline()
        sendJson(res, 200, snapshot())
      },
```

**依据 5 · 源码核查**：[lib/client.js:273-294](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L273-L294)

统计轮询的回填／完成节奏。

<details>
<summary>查看原文（22行）</summary>

```text
      React.useEffect(() => {
        let alive = true
        let scanDone = false
        const refreshStats = () => {
          getStats().then((data) => {
            if (!alive) return
            if (data && data.scan) scanDone = !!data.scan.done
            setStats(data)
          }, () => {})
        }
        const refreshBalance = () => {
          getBalance(false).then((data) => {
            if (alive && data) setBalance(data)
          }, () => {})
        }
        refreshStats()
        refreshBalance()
        const fast = timer.interval(() => { if (!scanDone) refreshStats() }, 2000)
        const slow = timer.interval(() => { if (scanDone) refreshStats() }, 15000)
        const bal = timer.interval(() => { refreshBalance() }, 60000)
        return () => { alive = false; fast(); slow(); bal() }
      }, [])
```

</details>

**依据 6 · 源码核查**：[lib/client.js:608-615](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L608-L615)

失败计数与回填进度提示一同消失。

```text
        aliasOpen ? aliasPanel : null,
        scanning ? React.createElement('div', { className: 'uh-progress' },
          React.createElement('span', {}, '正在统计历史会话 ' + scan.scanned + ' / ' + scan.total + (scan.failed > 0 ? '（' + scan.failed + ' 个读取失败）' : '')),
          React.createElement('div', { className: 'uh-bar' }, React.createElement('div', { className: 'uh-fill', style: { width: pct + '%' } })),
        ) : null,
        isEmpty ? React.createElement('div', { className: 'uh-panel' },
          React.createElement('div', { className: 'uh-empty' }, '还没有使用记录。开始对话后，这里会点亮。'),
        ) : React.createElement(React.Fragment, null,
```

#### 缺口

- 宿主事件通知和日志持久化的相对时序没有固定版本宿主证据。
  **影响**：会影响最后一个实时事件遗漏窗口。
  **进一步探讨**：将序号缺口、通知先到和日志后到注入可控宿主，对照每次快照与事件序列。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 余额如何取凭据并出网，公开或非 Windows 宿主能否沿用？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

页面挂载即请求余额，随后每分钟重新查询，用户刷新会请求绕过五分钟缓存。Host 从 llm-deepseek 设置选择凭据引用，通过 credentials 服务取值，然后用 subprocess 请求硬编码的 DeepSeek /user/balance。首选 curl.exe 把 Bearer 值拼到进程 argv，回退 PowerShell 使用环境变量。两个命令均是 Windows 形式，代码没有 curl 或其他平台路径；在宿主找不到可执行文件时，返回查询失败。缺凭据／缺子进程服务有分支，余额响应与统计响应是不同路径，余额失败不应一并解释为回合数据缺失。

首选命令含密钥值，可被有相应权限的本机进程检查或进程启动审计接触。实际可见性取决于系统和宿主记录策略。统计快照返回工作区路径，路由注册处和余额、别名 handler 未见组件级授权检查，外部安全性取决于 webServer 和部署边界。应避免凭这个插件的接口形态推断可外露，也不要打开页面后才假定余额查询需要用户主动触发。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:26-32](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L26-L32)

依赖服务从宿主上下文取用。

```text
function apply(ctx) {
  const subprocess = ctx.get('subprocess')
  const credentials = ctx.get('credentials')
  const settings = ctx.get('settings')
  const sandboxPolicy = ctx.get('sandboxPolicy')
  const storage = ctx.get('storage')
  const webServer = ctx.get('webServer')
```

**依据 2 · 源码核查**：[lib/index.js:408-441](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L408-L441)

解析凭据引用、失败分支与两条 Windows 命令。

<details>
<summary>查看原文（34行）</summary>

```text
  async function fetchBalance(force) {
    const now = Date.now()
    if (force !== true && balanceCache.payload !== null && now - balanceCache.fetchedAt < 300000) return balanceCache.payload
    let ref = 'DEEPSEEK_API_KEY'
    if (settings !== undefined) {
      try {
        const section = settings.get('llm-deepseek')
        if (section !== null && typeof section === 'object' && typeof section.apiKeyEnv === 'string' && section.apiKeyEnv.length > 0) ref = section.apiKeyEnv
      } catch (err) { /* default ref */ }
    }
    let key
    if (credentials !== undefined) {
      try {
        const hit = await credentials.resolve(ref)
        if (hit !== null && hit !== undefined && typeof hit.value === 'string' && hit.value.length > 0) key = hit.value
      } catch (err) { /* unconfigured */ }
    }
    if (key === undefined) {
      const payload = { status: 'missing-key' }
      balanceCache = { fetchedAt: now, payload }
      return payload
    }
    if (subprocess === undefined) {
      const payload = { status: 'error', message: '进程服务不可用，无法查询余额' }
      balanceCache = { fetchedAt: now, payload }
      return payload
    }
    const url = 'https://api.deepseek.com/user/balance'
    const cwd = spawnCwd()
    const psCommand = "$h=@{Authorization='Bearer '+$env:DSH_UBK}; (Invoke-RestMethod -Uri 'https://api.deepseek.com/user/balance' -Headers $h -TimeoutSec 30) | ConvertTo-Json -Compress -Depth 5"
    const attempts = [
      { argv: ['curl.exe', '-sS', '-L', '-m', '30', '-H', 'Accept: application/json', '-H', 'Authorization: Bearer ' + key, url], env: undefined },
      { argv: ['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', psCommand], env: { DSH_UBK: key } },
    ]
```

</details>

**依据 3 · 源码核查**：[lib/index.js:442-469](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L442-L469)

解析余额并把失败诊断返回客户端。

<details>
<summary>查看原文（28行）</summary>

```text
    let lastDiag = ''
    for (const attempt of attempts) {
      const result = await runAttempt(attempt.argv, attempt.env, cwd)
      if (result === null) {
        lastDiag = '无法启动查询进程'
        continue
      }
      const body = (result.text || '').trim()
      if (result.exitCode === 0 && body.length > 0) {
        const parsed = parseBalance(body)
        if (parsed !== null && parsed.unavailable) {
          const payload = { status: 'unavailable', message: 'DeepSeek 接口返回余额不可用（is_available=false）' }
          balanceCache = { fetchedAt: now, payload }
          return payload
        }
        if (parsed !== null && parsed.currencies.length > 0) {
          const payload = { status: 'ok', currencies: parsed.currencies, fetchedAt: now }
          balanceCache = { fetchedAt: now, payload }
          return payload
        }
        lastDiag = body.slice(0, 300)
      } else {
        lastDiag = (result.errText || body).trim().slice(0, 300)
      }
    }
    const payload = { status: 'error', message: '余额查询失败', detail: lastDiag }
    balanceCache = { fetchedAt: now, payload }
    return payload
```

</details>

**依据 4 · 源码核查**：[lib/index.js:329-335](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L329-L335)

快照带工作区路径。

```text
      scan: { started: scan.started, done: scan.done, scanned: scan.scanned, total: scan.total, failed: scan.failed },
      generatedAt: Date.now(),
      workspaces: Array.from(wsMeta.values(), (w) => ({ id: w.id, title: w.title, path: w.path })),
      aliases: Object.assign({}, aliases),
      totals: { turns: totals.turns, sessions: sessionCount.size, input: totals.input, output: totals.output, cacheRead: totals.cacheRead, cacheWrite: totals.cacheWrite, reasoning: totals.reasoning },
      perWorkspace: Array.from(perWorkspace, (p) => ({ workspaceId: p[0], turns: p[1].turns, input: p[1].input, output: p[1].output, cacheRead: p[1].cacheRead, cacheWrite: p[1].cacheWrite, reasoning: p[1].reasoning })),
      byDay: byDayArr,
```

**依据 5 · 源码核查**：[lib/index.js:472-513](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L472-L513)

三个路由无组件级身份条件。

<details>
<summary>查看原文（42行）</summary>

```text
  // ---------- HTTP data routes for the client half ----------
  if (webServer !== undefined) {
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/api/usage-stats',
      handler: (req, res) => {
        if (!scan.started) void runBaseline()
        sendJson(res, 200, snapshot())
      },
    }))
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/api/usage-stats/balance',
      handler: async (req, res) => {
        let force = false
        try {
          const url = new URL(req.url ?? '/', 'http://x')
          force = url.searchParams.get('force') === '1'
        } catch (err) { /* default */ }
        sendJson(res, 200, await fetchBalance(force))
      },
    }))
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/api/usage-stats/alias',
      handler: async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        const body = await readBody(req, 16 * 1024)
        let args = null
        try {
          args = JSON.parse(body)
        } catch (err) { /* invalid json */ }
        const result = args !== null && args !== undefined && typeof args.workspaceId === 'string'
          ? setAlias(args.workspaceId, args.alias)
          : { ok: false, message: 'bad-request', aliases: Object.assign({}, aliases) }
        sendJson(res, 200, result)
      },
    }))
```

</details>

**依据 6 · 源码核查**：[lib/client.js:273-298](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L273-L298)

挂载即查询余额，缓存周期内的重复请求和手动绕过。

<details>
<summary>查看原文（26行）</summary>

```text
      React.useEffect(() => {
        let alive = true
        let scanDone = false
        const refreshStats = () => {
          getStats().then((data) => {
            if (!alive) return
            if (data && data.scan) scanDone = !!data.scan.done
            setStats(data)
          }, () => {})
        }
        const refreshBalance = () => {
          getBalance(false).then((data) => {
            if (alive && data) setBalance(data)
          }, () => {})
        }
        refreshStats()
        refreshBalance()
        const fast = timer.interval(() => { if (!scanDone) refreshStats() }, 2000)
        const slow = timer.interval(() => { if (scanDone) refreshStats() }, 15000)
        const bal = timer.interval(() => { refreshBalance() }, 60000)
        return () => { alive = false; fast(); slow(); bal() }
      }, [])

      const onRefresh = () => {
        getStats().then((d) => { if (d) setStats(d) }, () => {})
        getBalance(true).then((d) => { if (d) setBalance(d) }, () => {})
```

</details>

#### 缺口

- 固定目标宿主的访问控制、审计记录和命令可用性未核。
  **影响**：不能判断远端用户可达性或密钥实际暴露。
  **进一步探讨**：检查所选宿主的 webServer 注册链，并以替代凭据测试请求权限和命令审计。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 修改别名后在什么条件下能跨重启保留，失败从哪里看出来？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

用户可在用量页输入别名并回车，或批量保存。浏览器发出 POST，Host 只接受已有工作区 ID，把文字去空白和截断为 80 字符，空值删除。服务立即更新内存，给出成功响应并将整份别名表排入串行写链。JSON storage 后端必须成功打开 usage-stats-aliases 单元，且写链最终 setGlobal 成功，后续重启的 loadAll 才读得到。前端收到成功后刷新本地别名，把请求失败静默吞掉，批量提交会立即关闭编辑面板。后端 KV 缺失时直接跳过写入，写入失败只写控制台，故当前显示改名成功不保证跨重启保留。卸载回调关闭 KV，代码未等待别名写链完成。这个状态属于插件本身，不能从 DSH 会话日志回填。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:254-261](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L254-L261)

别名写入的 HTTP 方法与载荷。

```text
    const setAliasRpc = (workspaceId, alias) => fetch('/api/usage-stats/alias', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ workspaceId, alias }),
    }).then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status)
      return r.json()
    })
```

**依据 2 · 源码核查**：[lib/client.js:330-349](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L330-L349)

前端立即更新或忽略失败，批量保存关闭面板。

<details>
<summary>查看原文（20行）</summary>

```text
      const saveAlias = (wsId, value) => {
        setAliasRpc(wsId, String(value === undefined ? '' : value).trim()).then((res) => {
          if (res && res.ok && res.aliases) {
            setStats((prev) => (prev === null ? prev : Object.assign({}, prev, { aliases: res.aliases })))
          }
        }, () => {})
      }
      const openAliasPanel = () => {
        const drafts = {}
        workspaces.forEach((w) => { drafts[w.id] = typeof aliases[w.id] === 'string' ? aliases[w.id] : '' })
        setAliasDrafts(drafts)
        setAliasOpen(true)
      }
      const saveAllAliases = () => {
        for (const id of Object.keys(aliasDrafts)) {
          const current = typeof aliases[id] === 'string' ? aliases[id] : ''
          if (aliasDrafts[id] !== current) saveAlias(id, aliasDrafts[id])
        }
        setAliasOpen(false)
      }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:267-309](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L267-L309)

读取、后台异步写入、回执和卸载关闭。

<details>
<summary>查看原文（43行）</summary>

```text
  // ---------- workspace aliases (durable, schema-free KV unit) ----------
  async function loadAliases() {
    if (storage === undefined) return
    try {
      const backend = storage.backend.get('json')
      if (backend === undefined || backend === null || backend.kv === undefined) return
      const unit = await backend.kv.open({ name: 'usage-stats-aliases', version: 0, tables: [], hasGlobal: true })
      kvUnit = unit
      const snap = await unit.loadAll()
      const g = snap && snap.global
      if (g !== null && g !== undefined && typeof g === 'object') {
        for (const key of Object.keys(g)) {
          const value = g[key]
          if (typeof value === 'string' && value.trim() !== '') aliases[key] = value
        }
      }
    } catch (err) {
      console.error('[usage-stats] alias storage unavailable:', err)
    }
  }
  function persistAliases() {
    const snapshotAliases = {}
    for (const key of Object.keys(aliases)) snapshotAliases[key] = aliases[key]
    aliasWriteChain = aliasWriteChain.then(() => {
      if (kvUnit === null || kvUnit === undefined) return undefined
      return kvUnit.setGlobal(snapshotAliases).catch((err) => {
        console.error('[usage-stats] alias persist failed:', err)
      })
    })
  }
  function setAlias(wsId, raw) {
    const alias = typeof raw === 'string' ? raw.trim().slice(0, 80) : ''
    if (!wsMeta.has(wsId)) return { ok: false, message: 'unknown-workspace', aliases: Object.assign({}, aliases) }
    if (alias === '') delete aliases[wsId]
    else aliases[wsId] = alias
    persistAliases()
    return { ok: true, aliases: Object.assign({}, aliases) }
  }
  ctx.effect(() => () => {
    const unit = kvUnit
    kvUnit = null
    if (unit !== null && unit !== undefined) void unit.close().catch(() => {})
  })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:494-513](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L494-L513)

HTTP 正常响应与业务成功的含义。

<details>
<summary>查看原文（20行）</summary>

```text
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/api/usage-stats/alias',
      handler: async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        const body = await readBody(req, 16 * 1024)
        let args = null
        try {
          args = JSON.parse(body)
        } catch (err) { /* invalid json */ }
        const result = args !== null && args !== undefined && typeof args.workspaceId === 'string'
          ? setAlias(args.workspaceId, args.alias)
          : { ok: false, message: 'bad-request', aliases: Object.assign({}, aliases) }
        sendJson(res, 200, result)
      },
    }))
```

</details>

#### 缺口

- 实际宿主 JSON 后端的 flush 和 close 语义未核。
  **影响**：即刻关闭时的持久化竞态范围未知。
  **进一步探讨**：用可恢复的临时 profile，分别注入 KV 缺失、拒写和成功写，等待响应后重开核对。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从安装到一次可对账的周用量复盘，需要哪些条件和人工？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

目前适合先观察。README 给出包名安装和本地 patch 两种方式；固定 Git 清单是 1.0.0，本轮 META 捕获的 npm latest 为 0.1.16，直接照作者的无版本命令不能确认拿到这套源码。测试需固定来源和选定宿主 Web profile，先查宿主 sessionQuery、workspaceRegistry、timer、webServer 及设置槽位。README 还声称安装后刷新即可，本轮没有对应宿主证据。即使模块可见，回填仍需面对 cwd 归属和失败不可见的问题。远端共用场景还涉及路径信息与路由鉴权，余额又另需可信环境、凭据、Windows 命令和网络。

合格任务按一次同一时区的周复盘计算。选两个已登记的测试工作区，对照各一份留有原始事件的会话，核对工作区分组、日期、回合和用量字段，再添加一个非登记 cwd 或坏日志验证失败可见性。安装配置、首次扫描的 CPU／内存或耗时，以及日常轮询的网络开销未测，人工排障和复核时间也未知。源码看不到额外 AI 推理来生成统计，但余额依赖使用外部账户 API，现金支出无法由源码推出。若页面能显示但记录漏计、未知范围未标识或余额查询条件不合适，回到原始日志和官方账户页，按原 profile 移除插件并检查页面／路由是否撤回。需要保留别名时先保存映射，卸载后是否保留取决于实际存储生命周期。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-42](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/README.md#L18-L42)

作者给出软件包命令与手动挂载流程。

<details>
<summary>查看原文（25行）</summary>

````text
## 安装

本插件是标准的 DSH 社区插件包（声明 `dsh.bundle` manifest + web client 半），数据全部来自持久化会话日志，安装后自动回填历史。

### 方式一：官方插件命令（推荐）

```bash
dsh plugin --profile web add dsh-usage-stats
```

安装后刷新页面即可，无需手动改配置、无需重启。

### 方式二：手动注册（本地包）

1. 把本目录放入任意位置，并在 `$DSH_HOME/profiles/node_modules/` 下创建指向本目录的符号链接（Windows 用 junction）：
   ```powershell
   New-Item -ItemType Junction -Path "$env:DSH_HOME\profiles\node_modules\dsh-usage-stats" -Target "<本目录绝对路径>"
   ```
2. 在 `$DSH_HOME/profiles/web/cordis.patch.yml` 添加一行：
   ```yaml
   - insert:
       - id: usage-stats
         name: dsh-usage-stats
   ```
   用户 patch 层会被热重载：保存后刷新页面即可。
````

</details>

**依据 2 · 源码核查**：[package.json:1-6](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/package.json#L1-L6)

固定 Git 版本是 1.0.0。

```text
{
  "name": "dsh-usage-stats",
  "version": "1.0.0",
  "description": "DeepSeek Harness 用量统计插件：GitHub 风格热力图、Token/缓存命中/账户余额看板、工作区别名管理",
  "type": "module",
  "main": "lib/index.js",
```

**依据 3 · 源码核查**：[lib/index.js:1-4](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L1-L4)

三项初始宿主依赖。

```text
// dsh-usage-stats 插件 Host 半（永久版）
// 数据聚合 + 账户余额 + 工作区别名持久化，通过 webServer 路由向客户端提供数据。
const name = 'dsh-usage-stats'
const inject = ['sessionQuery', 'workspaceRegistry', 'timer']
```

**依据 4 · 源码核查**：[lib/index.js:195-253](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L195-L253)

回填的实际资源路径与归属前提。

<details>
<summary>查看原文（59行）</summary>

```text
  // ---------- baseline scan over durable logs ----------
  async function runBaseline() {
    if (scan.started) return
    scan.started = true
    try {
      const workspaces = ctx.workspaceRegistry.list()
      for (const w of workspaces) {
        const id = w && w.id
        const path = w && typeof w.path === 'string' ? w.path : ''
        const title = w && typeof w.title === 'string' ? w.title : ''
        if (id === undefined) continue
        wsMeta.set(id, { id, title, path })
        if (path !== '') pathIndex.set(path, id)
        if (w && Array.isArray(w.sessionIds)) {
          for (const sid of w.sessionIds) memberOf.set(sid, id)
        }
      }
    } catch (err) {
      console.error('[usage-stats] workspace list failed:', err)
    }
    let records = []
    try {
      records = await ctx.sessionQuery.listSessions()
    } catch (err) {
      console.error('[usage-stats] session list failed:', err)
    }
    scan.total = Array.isArray(records) ? records.length : 0
    for (const record of records) {
      if (record === undefined || record === null || record.header === undefined) {
        scan.scanned += 1
        continue
      }
      const sid = record.header.id
      const cwd = typeof record.header.cwd === 'string' ? record.header.cwd : ''
      const wsId = cwd === '' ? undefined : pathIndex.get(cwd)
      if (sid === undefined || wsId === undefined) {
        scan.scanned += 1
        continue
      }
      await enqueue(sid, async () => {
        try {
          if (sessionSeq.has(sid)) return
          const snap = await ctx.sessionQuery.readSession(sid)
          if (snap && Array.isArray(snap.events)) {
            foldEvents(wsId, snap.events)
            sessionSeq.set(sid, lastSeqOf(snap.events))
            sessionCount.add(sid)
          }
        } catch (err) {
          sessionSeq.set(sid, -1)
          scan.failed += 1
        } finally {
          scan.scanned += 1
        }
      })
      await ctx.timeout(0)
    }
    scan.done = true
  }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:273-298](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L273-L298)

页面后台查询频率与刷新行为。

<details>
<summary>查看原文（26行）</summary>

```text
      React.useEffect(() => {
        let alive = true
        let scanDone = false
        const refreshStats = () => {
          getStats().then((data) => {
            if (!alive) return
            if (data && data.scan) scanDone = !!data.scan.done
            setStats(data)
          }, () => {})
        }
        const refreshBalance = () => {
          getBalance(false).then((data) => {
            if (alive && data) setBalance(data)
          }, () => {})
        }
        refreshStats()
        refreshBalance()
        const fast = timer.interval(() => { if (!scanDone) refreshStats() }, 2000)
        const slow = timer.interval(() => { if (scanDone) refreshStats() }, 15000)
        const bal = timer.interval(() => { refreshBalance() }, 60000)
        return () => { alive = false; fast(); slow(); bal() }
      }, [])

      const onRefresh = () => {
        getStats().then((d) => { if (d) setStats(d) }, () => {})
        getBalance(true).then((d) => { if (d) setBalance(d) }, () => {})
```

</details>

**依据 6 · 源码核查**：[lib/index.js:287-309](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L287-L309)

别名独立写入与关闭的退出边界。

<details>
<summary>查看原文（23行）</summary>

```text
  function persistAliases() {
    const snapshotAliases = {}
    for (const key of Object.keys(aliases)) snapshotAliases[key] = aliases[key]
    aliasWriteChain = aliasWriteChain.then(() => {
      if (kvUnit === null || kvUnit === undefined) return undefined
      return kvUnit.setGlobal(snapshotAliases).catch((err) => {
        console.error('[usage-stats] alias persist failed:', err)
      })
    })
  }
  function setAlias(wsId, raw) {
    const alias = typeof raw === 'string' ? raw.trim().slice(0, 80) : ''
    if (!wsMeta.has(wsId)) return { ok: false, message: 'unknown-workspace', aliases: Object.assign({}, aliases) }
    if (alias === '') delete aliases[wsId]
    else aliases[wsId] = alias
    persistAliases()
    return { ok: true, aliases: Object.assign({}, aliases) }
  }
  ctx.effect(() => () => {
    const unit = kvUnit
    kvUnit = null
    if (unit !== null && unit !== undefined) void unit.close().catch(() => {})
  })
```

</details>

#### 缺口

- 固定 Git 版本与 npm 发布物未对应。
  **影响**：不能把 npm 最新版的安装行为视为本次研究的实现。
  **进一步探讨**：在测试环境准备前先核对包 tarball 与 Git 文件摘要。
- 合格周复盘任务的用时和正确性尚无实际数据。
  **影响**：无法量化节时、资源与恢复代价。
  **进一步探讨**：在同一数据集比较会话手工汇总与插件输出的对账差异、人工时间与扫描阻塞。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 增加每工作区覆盖状态，能否减少错误地把漏算当成不活跃？

**研究主题**：新假设与验证

#### 完整回答

可以验证一个尚未实现的设计假设。现有快照只给全局 scanned、total、failed 和各工作区统计，路径不匹配会增加 scanned，面板完成后没有失败提示。建议由 Host 在每条日志读取、归属、增量补读后分别记录阶段状态，把未归属、读取失败和成功归属的计数联同统计推给页面。无法确定归属的记录放总体未知组，避免硬塞给某个工作区。界面在能确认覆盖的范围内才将空格解释为无活动，有未知时允许回到记录核对。这样会增加跟踪状态和解释负担，还可能需要维护可随工作区变化的映射。

最小验证保持聚合逻辑和界面布局其余部分不变，准备正常、未登记、路径迁移和读失败四类记录，在当前视图与显示覆盖的视图中分别执行相同的周复盘。观察错误把未计入当成不活跃的次数、复核用时和额外的错误归属。如果提示不能降低误判、把未知错误转成工作区缺失或令中等规模数据复核时间增加到失去探索价值，则不支持该方案。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:215-248](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L215-L248)

全局记录跳过与读取失败区别存在，但跳过未归因。

<details>
<summary>查看原文（34行）</summary>

```text
    let records = []
    try {
      records = await ctx.sessionQuery.listSessions()
    } catch (err) {
      console.error('[usage-stats] session list failed:', err)
    }
    scan.total = Array.isArray(records) ? records.length : 0
    for (const record of records) {
      if (record === undefined || record === null || record.header === undefined) {
        scan.scanned += 1
        continue
      }
      const sid = record.header.id
      const cwd = typeof record.header.cwd === 'string' ? record.header.cwd : ''
      const wsId = cwd === '' ? undefined : pathIndex.get(cwd)
      if (sid === undefined || wsId === undefined) {
        scan.scanned += 1
        continue
      }
      await enqueue(sid, async () => {
        try {
          if (sessionSeq.has(sid)) return
          const snap = await ctx.sessionQuery.readSession(sid)
          if (snap && Array.isArray(snap.events)) {
            foldEvents(wsId, snap.events)
            sessionSeq.set(sid, lastSeqOf(snap.events))
            sessionCount.add(sid)
          }
        } catch (err) {
          sessionSeq.set(sid, -1)
          scan.failed += 1
        } finally {
          scan.scanned += 1
        }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:328-335](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/index.js#L328-L335)

快照只有扫描汇总和工作区用量。

```text
    return {
      scan: { started: scan.started, done: scan.done, scanned: scan.scanned, total: scan.total, failed: scan.failed },
      generatedAt: Date.now(),
      workspaces: Array.from(wsMeta.values(), (w) => ({ id: w.id, title: w.title, path: w.path })),
      aliases: Object.assign({}, aliases),
      totals: { turns: totals.turns, sessions: sessionCount.size, input: totals.input, output: totals.output, cacheRead: totals.cacheRead, cacheWrite: totals.cacheWrite, reasoning: totals.reasoning },
      perWorkspace: Array.from(perWorkspace, (p) => ({ workspaceId: p[0], turns: p[1].turns, input: p[1].input, output: p[1].output, cacheRead: p[1].cacheRead, cacheWrite: p[1].cacheWrite, reasoning: p[1].reasoning })),
      byDay: byDayArr,
```

**依据 3 · 源码核查**：[lib/client.js:608-615](https://github.com/Make0209/dsh-usage-stats/blob/8992d306cdca8857b4362868d591fde3689765b0/lib/client.js#L608-L615)

完成后进度和异常计数消失。

```text
        aliasOpen ? aliasPanel : null,
        scanning ? React.createElement('div', { className: 'uh-progress' },
          React.createElement('span', {}, '正在统计历史会话 ' + scan.scanned + ' / ' + scan.total + (scan.failed > 0 ? '（' + scan.failed + ' 个读取失败）' : '')),
          React.createElement('div', { className: 'uh-bar' }, React.createElement('div', { className: 'uh-fill', style: { width: pct + '%' } })),
        ) : null,
        isEmpty ? React.createElement('div', { className: 'uh-panel' },
          React.createElement('div', { className: 'uh-empty' }, '还没有使用记录。开始对话后，这里会点亮。'),
        ) : React.createElement(React.Fragment, null,
```

#### 缺口

- 增加覆盖提示是否改善人类判断没有验证。
  **影响**：仍是设计假设，不构成现有贡献或已出现的需求。
  **进一步探讨**：固定日志和用户任务，比较有无覆盖提示的误判及核对用时。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
