# DSH Trading

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[7470117](https://github.com/maddogfinance/dsh-trading/tree/7470117a3a07d3241282cbfa2ec58026065924f4)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/maddogfinance/dsh-trading)
<!-- END META -->

> **功能**：面向 DeepSeek Harness 的市场数据与回测研究工作台，支持本地行情、图表及历史成交材料核验。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把成交范围、重复、随机基线与样本检查组合成可追查的回测报告。

> **主要限制**：[Q03](#research-q03) 守卫按工具名称作判断。行情范围检查无法证明实际成交、名单完整性或盈利。

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
  - [Q01 · 这个工作台能复核哪种历史交易材料？](#detail-section-11)
  - [Q02 · 本地审计如何从材料得到报告？](#detail-section-12)
  - [Q03 · 授权检查和报告各能证明什么？](#detail-section-13)
  - [Q04 · 怎样做不涉及订单的最小试用？](#detail-section-14)
  - [Q05 · 独立材料清单能否揭示只交成功样本的问题？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有回测成交记录的研究者需要对照本地行情，检查输入和报告中的缺口。

使用表格或脚本独立比对申报成交、原始行情与样本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 回测审计 | 核验已提交的历史成交材料 | 依赖匹配行情与完整记录 |
| 工具守卫 | 按名称允许或拒绝工具调用 | 不能识别工具实际副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 研究配置 | 必需 | 注册审计和守卫 | 回独立脚本 |
| 匹配频率的本地行情与成交材料 | 必需 | 区间和样本核验 | 覆盖不符时停用报告 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 研究者准备合成成交和固定本地行情 | 数据范围可核对 |
| 核验 | 调用工具并阅读分项及盲区 | 识别错误和未证明状态 |
| 退出 | 报告无法对账时保留原始材料 | 回独立脚本或人工 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地行情及宿主资源 | 准备和对齐输入 | 用时未测 |
| 持续 | 读取数据与运行核验 | 核对范围和结果 | 每份合格报告成本未知 |
| 失败 | 保留原始材料 | 排查行情、数据和文件访问 | 恢复负担未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 历史成交核验 | 对照 K 线和统计检查 | 真实成交及盈利 |
| 授权辅助 | 预执行按名称判断 | 第三方工具的实际副作用与身份 |

> **思考**：[Q03](#research-q03) 守卫按工具名称作判断。行情范围检查无法证明实际成交、名单完整性或盈利。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把成交范围、重复、随机基线与样本检查组合成可追查的回测报告。

[Q02](#research-q02) 行情为空时拒绝发出结论。[Q03](#research-q03) 报告保留已知盲区，守卫判断范围可定位。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 守卫按工具名称作判断。行情范围检查无法证明实际成交、名单完整性或盈利。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用隔离配置和合成记录试验，优先用内联数据。报告与原始材料不符时回到人工对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查本地 CSV 组合、回测审计、工具守卫与报告盲区。未执行插件、模拟账户或真实订单。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、bundle/trading/cordis.patch.yml、packages/verdict/src/index.ts、packages/verdict/src/checks/fill-validation.ts、packages/verdict/src/report.ts、packages/risk-guard/src/index.ts、packages/risk-guard/src/policy.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根研究工作台和默认 bundle，抽查本地 CSV 挂载、历史成交审计与风险守卫。未全审行情供应方和图表功能。
- 下一步：用合成 CSV 和成交清单验证缺行情、价格越界、漏单及名称守卫边界。

**分析版本**

- **仓库**：[maddogfinance/dsh-trading](https://github.com/maddogfinance/dsh-trading)
- **版本号**：未声明（[固定提交 7470117](https://github.com/maddogfinance/dsh-trading/tree/7470117a3a07d3241282cbfa2ec58026065924f4)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可试验独立生成成交清单并对账，识别提交给核验工具时遗漏的记录。

用合成 CSV 和成交清单验证缺行情、价格越界、漏单及名称守卫边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 838 | — | — | 7074 |
| .mjs | example | 2 | 165 | 123 | 28 | — |
| .mjs | source | 2 | 122 | 87 | 23 | — |
| .tsx | source | 6 | 2681 | 2011 | 508 | — |
| .ts | source | 45 | 8230 | 5725 | 1907 | — |
| .ts | test | 28 | 5166 | 4163 | 413 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/maddogfinance/dsh-trading/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/maddogfinance/dsh-trading/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/maddogfinance/dsh-trading/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：回测研究者能否在隔离的 DSH 配置中复核本地历史成交清单，同时识别工具授权和结论的边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个工作台能复核哪种历史交易材料？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已经在外部生成回测成交清单的研究者，可以用 DSH 工具对照本地历史行情，检查申报的入场与出场价格、重复或重叠记录、样本和费用声明。原办法是手工查看表格或编写独立脚本。合格结果是一份带来源、检查项和缺口的报告。这里的模拟成交是调用者提供的历史记录。已查路径读取并分析这些记录，未见创建纸面订单、模拟账户或交易写入接口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:181-185](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/README.md#L181-L185)

作者明确声明仅用于研究及无订单执行接口。

```text
## Hard boundary: research only

This project deliberately has **no order-execution capability and no execution seam**. Tools read data and compute; nothing places, routes, or simulates-then-forwards orders. Contributions adding live trading execution are out of scope. Nothing here is investment advice.

`@dsh-trading/risk-guard` extends that stance over plugins this project does not ship: it refuses order-execution and fund-movement tool names at dsh's `tools/pre-execute` gate, so mounting a broker plugin in a `trading` profile does not quietly gain the ability to trade. Name matching is a heuristic and cannot be complete — the guard is defense in depth, not the guarantee. The guarantee is structural: there is no execution seam to reach.
```

**依据 2 · 源码核查**：[packages/verdict/src/index.ts:168-178](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/verdict/src/index.ts#L168-L178)

工具接受已经生成的回测 JSON 以及可选策略源码路径。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'audit_backtest',
    description: 'Audit a backtest artifact (JSON: {version:1, symbol, timeframe, trades:[{entryTime, exitTime, side, entryPrice, exitPrice}], costs?}) against real candles from the mounted market-data provider. Checks: fills inside the true bar range, trade independence (duplicates/overlaps), a seeded random-entry baseline ranked on close-to-close shadow returns, the self-reported vs shadow fill-model gap, sample-size power on both win-rate and mean-return dimensions, win-rate plausibility, and cost declaration; optional lookahead lint over codePaths (read from disk as given). Returns a verdict that can honestly be NOT PROVEN and lists its own blind spots. It never certifies profitability.',
    parameters: {
      artifactPath: { type: 'string', description: 'Path to the artifact JSON file. Provide this or artifactJson.' },
      artifactJson: { type: 'string', description: 'The artifact as an inline JSON string. Provide this or artifactPath.' },
      codePaths: { type: 'array', items: { type: 'string' }, description: `Strategy/backtest source files to lint alongside the audit (max ${MAX_CODE_FILES}).` },
      minDetectableEdge: { type: 'number', description: 'Win-rate edge the sample-size check tests for, as a PROBABILITY in (0, 0.5] — e.g. 0.05 for 5 percentage points. Default 0.05.' },
      priceTolerancePct: { type: 'number', description: 'Extra price tolerance (percent) for the fill-range check, for artifacts backtested on a different data vendor. Default 0 (exact against this provider).' },
      provider: { type: 'string', description: 'Market-data provider id. Omit for the default provider.' },
    },
```

</details>

**依据 3 · 源码核查**：[bundle/trading/cordis.patch.yml:7-30](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/bundle/trading/cordis.patch.yml#L7-L30)

默认组合 CSV、分析、核验与风险守卫。

<details>
<summary>查看原文（24行）</summary>

```text
- insert:
    - id: market-data
      name: '@dsh-trading/market-data'

    - id: market-data-provider
      name: '@dsh-trading/provider-csv'
      config:
        root: ./data

    - id: tool-market
      name: '@dsh-trading/tool-market'
      config:
        chartDir: ./charts

    # The evaluation harness: audit_backtest / lint_strategy_code judge
    # backtest artifacts against real candles — deterministic checks whose
    # verdict is allowed to be NOT PROVEN.
    - id: verdict
      name: '@dsh-trading/verdict'

    # Refuses order-execution and fund-movement tool names from ANY plugin in
    # this profile, not just ours. Remove this row to opt out deliberately.
    - id: risk-guard
      name: '@dsh-trading/risk-guard'
```

</details>

#### 缺口

- 未运行发行版，也未对比人工复核的实际工作量。
  **影响**：不能量化减少的错误或时间。
  **进一步探讨**：用有已知错误的小型合成成交清单与本地 CSV 比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地审计如何从材料得到报告？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具读内联 JSON 或进程可读文件，解析后按成交时间申请对应行情范围，行情为空则明确失败。随后校验成交价格、重叠和重复，按配置的种子运行随机入场基线并计算样本量及费用检查，返回聚合报告。成交区间检查把时间映射到不晚于该时刻的最后一根 K 线，再判断价格是否落在高低价范围内。已查审计执行只返回结果，没有订单状态或账户变更。

#### 证据与依据

**依据 1 · 源码核查**：[packages/verdict/src/index.ts:212-250](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/verdict/src/index.ts#L212-L250)

读取、解析、行情选择与无行情错误。

<details>
<summary>查看原文（39行）</summary>

```text
    async execute(args, _exec) {
      if (!args.artifactPath && !args.artifactJson) {
        throw new Error('provide artifactPath or artifactJson')
      }
      const raw = args.artifactPath
        ? await readFile(resolvePath(args.artifactPath), 'utf8')
        : args.artifactJson!
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        // Deliberately no snippet echo: the parse error would otherwise quote
        // the head of whatever file the path pointed at.
        throw new Error('artifact is not valid JSON')
      }
      const artifact = parseArtifact(parsed)
      if (args.minDetectableEdge !== undefined && !(args.minDetectableEdge > 0 && args.minDetectableEdge <= 0.5)) {
        throw new Error(`minDetectableEdge must be in (0, 0.5] as a probability (got ${args.minDetectableEdge})`)
      }

      // The artifact promises entry/exit times anywhere INSIDE their bars, and
      // providers filter by bar-open time — so pad the window by whole bars,
      // or the first trade's own entry bar gets cropped out of its audit.
      const periodMs = TIMEFRAME_MS[artifact.timeframe]
      let minEntry = Number.POSITIVE_INFINITY
      let maxExit = Number.NEGATIVE_INFINITY
      for (const trade of artifact.trades) {
        minEntry = Math.min(minEntry, Date.parse(trade.entryTime))
        maxExit = Math.max(maxExit, Date.parse(trade.exitTime))
      }
      const start = new Date(minEntry - FETCH_SLACK_BARS * periodMs).toISOString()
      const end = new Date(maxExit + periodMs).toISOString()
      const providerId = ctx.marketData.provider(args.provider).id
      const bars = await ctx.marketData.getOhlcv(
        { symbol: artifact.symbol, timeframe: artifact.timeframe, start, end },
        args.provider,
      )
      if (bars.length === 0) {
        throw new Error(`provider '${providerId}' returned no candles for ${artifact.symbol} ${artifact.timeframe} in [${start}, ${end}] — audit needs the same data the backtest ran on`)
```

</details>

**依据 2 · 源码核查**：[packages/verdict/src/index.ts:253-283](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/verdict/src/index.ts#L253-L283)

核验、基线、样本和报告返回。

<details>
<summary>查看原文（31行）</summary>

```text
      const checks: CheckResult[] = []
      if (args.codePaths && args.codePaths.length > 0) {
        const { findings, scanned, unreadable, notes } = await lintPaths(args.codePaths)
        checks.push(lintCheck(findings, scanned, unreadable, notes))
      }
      checks.push(fillCheck(validateFills(artifact.trades, bars, {
        durationMs: periodMs,
        ...args.priceTolerancePct !== undefined ? { priceTolerancePct: args.priceTolerancePct } : {},
      })))

      const barTimes = bars.map(b => Date.parse(b.time))
      const independence = effectiveTrades(artifact.trades, barTimes, periodMs)
      checks.push(independenceCheck(independence))

      const baseline = randomBaseline(independence.kept, bars, {
        simulations: config.simulations,
        seed: config.seed,
      })
      checks.push(baselineCheck(baseline))
      checks.push(fillModelCheck(baseline))

      const effectiveReturns = independence.kept.map(w => tradeReturn(w.trade))
      const power = samplePower(
        effectiveReturns,
        args.minDetectableEdge !== undefined ? { minDetectableEdge: args.minDetectableEdge } : {},
      )
      checks.push(powerCheck(power))
      checks.push(plausibilityCheck(power))
      checks.push(costsCheck(artifact))

      return assembleReport(artifact, checks, providerId)
```

</details>

**依据 3 · 源码核查**：[packages/verdict/src/checks/fill-validation.ts:35-59](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/verdict/src/checks/fill-validation.ts#L35-L59)

K 线价格和时间映射。

<details>
<summary>查看原文（25行）</summary>

```text
function withinBar(price: number, bar: Candle, tolerancePct: number): boolean {
  const slack = Math.max(REL_EPS, tolerancePct / 100)
  const lo = bar.low * (1 - slack)
  const hi = bar.high * (1 + slack)
  return price >= lo && price <= hi
}

/**
 * Index of the bar containing instant `t`: the last bar whose open time is
 * <= t. Returns -1 when t precedes the first bar — or, when `durationMs` is
 * given, when t falls at/after the LAST bar's close boundary (a time the
 * data simply does not cover; without the bound, fabricated far-future
 * trades would be silently validated against the final bar).
 */
export function barIndexAt(barTimes: readonly number[], t: number, durationMs?: number): number {
  let lo = 0
  let hi = barTimes.length - 1
  if (hi < 0 || t < barTimes[0]!) return -1
  if (durationMs !== undefined && t >= barTimes[hi]! + durationMs) return -1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (barTimes[mid]! <= t) lo = mid
    else hi = mid - 1
  }
  return lo
```

</details>

**依据 4 · 源码核查**：[packages/verdict/src/checks/fill-validation.ts:79-112](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/verdict/src/checks/fill-validation.ts#L79-L112)

逐项价格检查与同根 K 线统计。

<details>
<summary>查看原文（34行）</summary>

```text
  trades.forEach((trade, i) => {
    const entryIdx = barIndexAt(barTimes, Date.parse(trade.entryTime), durationMs)
    const exitIdx = barIndexAt(barTimes, Date.parse(trade.exitTime), durationMs)
    if (entryIdx < 0 || entryIdx >= bars.length) {
      issues.push({ tradeIndex: i, kind: 'entry-outside-data', detail: `entryTime ${trade.entryTime} is outside the candle window` })
      tradesOutsideData += 1
      return
    }
    const entryBar = bars[entryIdx]!
    if (!withinBar(trade.entryPrice, entryBar, tolerancePct)) {
      issues.push({
        tradeIndex: i,
        kind: 'impossible-entry-fill',
        detail: `entry ${trade.entryPrice} outside bar ${entryBar.time} range [${entryBar.low}, ${entryBar.high}]`,
      })
    }
    if (exitIdx >= 0 && exitIdx < bars.length) {
      const exitBar = bars[exitIdx]!
      if (!withinBar(trade.exitPrice, exitBar, tolerancePct)) {
        issues.push({
          tradeIndex: i,
          kind: 'impossible-exit-fill',
          detail: `exit ${trade.exitPrice} outside bar ${exitBar.time} range [${exitBar.low}, ${exitBar.high}]`,
        })
      }
      if (exitIdx === entryIdx) sameBarCount += 1
    } else {
      issues.push({ tradeIndex: i, kind: 'exit-outside-data', detail: `exitTime ${trade.exitTime} outside the candle window` })
      tradesOutsideData += 1
    }
    if (approxEqual(trade.entryPrice, entryBar.close)) closeFillCount += 1
  })

  return { issues, closeFillCount, sameBarCount, tradesChecked: trades.length, tradesOutsideData }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 授权检查和报告各能证明什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认守卫在宿主 tools/pre-execute 上仅按工具名做正则拒绝，未匹配的名称通过，精确允许名单还能豁免拒绝。allowlist 模式只通过列出的精确工具名。两种方式都只判断名称，不能校验实际副作用、执行者身份或提供逐单用户批准。回测报告也只能检查收到的材料，同一根 K 线的高低价无法证明成交顺序、流动性或完整成交列表，样本内筛选同样不可见。报告无已知缺陷不能支持盈利或真实成交。

#### 证据与依据

**依据 1 · 源码核查**：[packages/risk-guard/src/index.ts:39-54](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/risk-guard/src/index.ts#L39-L54)

预执行守卫及默认模式。

<details>
<summary>查看原文（16行）</summary>

```text
export const Config: z<Config> = z.object({
  mode: z.union(['denylist', 'allowlist'] as const).default('denylist'),
  deny: z.array(z.string()).default([...DEFAULT_DENY_PATTERNS]),
  allow: z.array(z.string()).default([]),
})

export function apply(ctx: Context, config: Config): void {
  const verdict = compilePolicy(config)
  ctx.on('tools/pre-execute', (exec, next) => {
    const decision = verdict(exec.name)
    if (!decision.allowed) {
      ctx.logger?.warn?.('risk-guard denied tool call %s', exec.name)
      return Promise.resolve({ kind: 'deny' as const, reason: decision.reason })
    }
    return next()
  })
```

</details>

**依据 2 · 源码核查**：[packages/risk-guard/src/policy.ts:18-32](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/risk-guard/src/policy.ts#L18-L32)

明确承认名称启发式的缺口。

<details>
<summary>查看原文（15行）</summary>

```text
 * Name matching is a HEURISTIC and cannot be complete — a broker tool called
 * `broker_action` matches nothing here. It is defense in depth for third-party
 * plugins, not the project's safety guarantee; that guarantee is structural
 * (dsh-trading defines no order-execution seam at all).
 */
export const DEFAULT_DENY_PATTERNS: readonly string[] = [
  // Order lifecycle, in both `verb_noun` and `noun_verb` spellings.
  '^(place|submit|send|create|open|cancel|amend|modify|replace|execute)_(order|orders|trade|trades)$',
  '^(order|orders|trade|trades)_(place|submit|send|create|cancel|amend|modify|replace|execute)$',
  // Bare directional verbs a broker or exchange plugin typically exposes.
  '^(buy|sell|short|cover|long)(_.*)?$',
  // Position lifecycle.
  '^(open|close|flatten|liquidate|exit)_(position|positions)$',
  // Money movement, including custody and on-chain transfers.
  '^(withdraw|withdrawal|deposit|transfer|remit|swap|bridge)(_.*)?$',
```

</details>

**依据 3 · 源码核查**：[packages/risk-guard/src/policy.ts:57-82](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/risk-guard/src/policy.ts#L57-L82)

两种模式和精确豁免。

<details>
<summary>查看原文（26行）</summary>

```text
export function compilePolicy(policy: GuardPolicy): (name: string) => GuardVerdict {
  const allow = new Set(policy.allow)
  if (policy.mode === 'allowlist') {
    return name => allow.has(name)
      ? { allowed: true }
      : {
          allowed: false,
          reason: `\`${name}\` is blocked: this deployment runs the dsh-trading risk guard in allowlist mode, where only explicitly permitted tools may run. ${HOW_TO_ALLOW}`,
        }
  }
  const denied = policy.deny.map((source, i) => {
    try {
      return new RegExp(source, 'i')
    } catch (cause) {
      throw new Error(`risk-guard: deny[${i}] is not a valid regular expression: ${source}`, { cause })
    }
  })
  return (name) => {
    if (allow.has(name)) return { allowed: true }
    const hit = denied.find(re => re.test(name))
    if (!hit) return { allowed: true }
    return {
      allowed: false,
      reason: `\`${name}\` is blocked by the dsh-trading risk guard: this deployment is research-only and does not place orders or move funds (matched \`${hit.source}\`). ${HOW_TO_ALLOW}`,
    }
  }
```

</details>

**依据 4 · 源码核查**：[packages/verdict/src/report.ts:240-278](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/verdict/src/report.ts#L240-L278)

盲区、未证明与无已知缺陷状态。

<details>
<summary>查看原文（39行）</summary>

```text
/** What this harness cannot see. Printed on every report, whatever the verdict. */
export const BLIND_SPOTS: readonly string[] = [
  'in-sample selection: it cannot see how many strategy variants were tried on this same window before this one was shown to it',
  'trade-list completeness: an artifact containing only the winning trades passes every check here',
  'fills finer than the declared timeframe: intrabar execution quality is invisible at this bar size',
]

/** Fold check results into the report. */
export function assembleReport(
  artifact: BacktestArtifact,
  checks: CheckResult[],
  provider = 'unknown',
): VerdictReport {
  if (checks.length === 0) {
    throw new Error('assembleReport: no checks were run — refusing to issue a verdict on nothing')
  }
  const returns = artifact.trades.map(tradeReturn)
  const meanPct = round((returns.reduce((s, r) => s + r, 0) / returns.length) * 100, 3)

  const hasError = checks.some(c => c.status === 'error')
  const hasNotProven = checks.some(c => c.status === 'not_proven')
  const substantiveSkipped = SUBSTANTIVE_CHECKS.filter(id =>
    !checks.some(c => c.id === id && c.status !== 'skipped'))
  const warnCount = checks.filter(c => c.status === 'warn').length

  const verdict: Verdict = hasError
    ? 'DEFECTS_FOUND'
    : hasNotProven || substantiveSkipped.length > 0
      ? 'NOT_PROVEN'
      : 'NO_DEFECTS_FOUND'
  const warnSuffix = warnCount > 0 ? ` ${warnCount} warning(s) remain unresolved below.` : ''
  const headline =
    verdict === 'DEFECTS_FOUND'
      ? 'Defects found: the reported results contain trades or code paths that could not exist live. Fix them before believing any metric.'
      : verdict === 'NOT_PROVEN'
        ? substantiveSkipped.length > 0 && !hasNotProven
          ? `Not proven: substantive check(s) did not run (${substantiveSkipped.join(', ')}) — a verdict without them would be worthless.${warnSuffix}`
          : `Not proven: no defect found, but this evidence cannot distinguish the results from luck. More (out-of-sample) trades, not more optimism.${warnSuffix}`
        : `No defects found at this sample size. This is NOT a certification of profitability — it means the results survived every check this harness knows, and it is blind to the limits listed at the bottom.${warnSuffix}`
```

</details>

#### 缺口

- 未验收 DSH 实际调用链与第三方工具授权。
  **影响**：守卫不能作为挂载经纪工具后的隔离保证。
  **进一步探讨**：在隔离宿主用无副作用假工具测匹配、未匹配和允许名单。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样做不涉及订单的最小试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

已有回测材料的研究者，可在隔离配置只挂载默认本地 CSV 路径，用内联合成成交数据核对越界价格与缺行情提示。宿主需要研究 bundle 和对应频率、时间覆盖及数据来源一致的 CSV。无需接入订单、账户或真实凭据。审计工具的文件输入允许绝对路径或从进程目录解析，已查路径函数没有工作区范围判断，故试用应优先内联数据和只含测试文件的独立宿主。若数据覆盖不足、路径权限与预期不符或报告不能对账，停止使用并回到原回测和行情人工核对。

#### 证据与依据

**依据 1 · 源码核查**：[bundle/trading/cordis.patch.yml:7-30](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/bundle/trading/cordis.patch.yml#L7-L30)

默认数据与守卫组成。

<details>
<summary>查看原文（24行）</summary>

```text
- insert:
    - id: market-data
      name: '@dsh-trading/market-data'

    - id: market-data-provider
      name: '@dsh-trading/provider-csv'
      config:
        root: ./data

    - id: tool-market
      name: '@dsh-trading/tool-market'
      config:
        chartDir: ./charts

    # The evaluation harness: audit_backtest / lint_strategy_code judge
    # backtest artifacts against real candles — deterministic checks whose
    # verdict is allowed to be NOT PROVEN.
    - id: verdict
      name: '@dsh-trading/verdict'

    # Refuses order-execution and fund-movement tool names from ANY plugin in
    # this profile, not just ours. Remove this row to opt out deliberately.
    - id: risk-guard
      name: '@dsh-trading/risk-guard'
```

</details>

**依据 2 · 源码核查**：[packages/verdict/src/index.ts:64-97](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/verdict/src/index.ts#L64-L97)

路径解析及策略扫描上限。

<details>
<summary>查看原文（34行）</summary>

```text
/** Cap on strategy source files read per call. */
const MAX_CODE_FILES = 16
/** Cap on characters scanned per source file. */
const MAX_CODE_CHARS = 512 * 1024
/** Bars of slack around the trade span when fetching audit candles — wide
 * enough to survive weekend/holiday gaps ahead of the first entry. */
const FETCH_SLACK_BARS = 5

function resolvePath(p: string): string {
  return isAbsolute(p) ? p : resolve(process.cwd(), p)
}

interface LintScan {
  findings: LintFinding[]
  scanned: number
  unreadable: string[]
  notes: string[]
}

async function lintPaths(paths: readonly string[]): Promise<LintScan> {
  const findings: LintFinding[] = []
  const unreadable: string[] = []
  const notes: string[] = []
  let scanned = 0
  if (paths.length > MAX_CODE_FILES) {
    notes.push(`${paths.length - MAX_CODE_FILES} file(s) beyond the ${MAX_CODE_FILES}-file cap were NOT scanned`)
  }
  for (const p of paths.slice(0, MAX_CODE_FILES)) {
    try {
      const text = await readFile(resolvePath(p), 'utf8')
      if (text.length > MAX_CODE_CHARS) {
        notes.push(`${p}: only the first ${MAX_CODE_CHARS} characters were scanned`)
      }
      findings.push(...lintSource(p, text.slice(0, MAX_CODE_CHARS)))
```

</details>

**依据 3 · 源码核查**：[packages/verdict/src/index.ts:213-250](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/verdict/src/index.ts#L213-L250)

内联输入和无行情分支。

<details>
<summary>查看原文（38行）</summary>

```text
      if (!args.artifactPath && !args.artifactJson) {
        throw new Error('provide artifactPath or artifactJson')
      }
      const raw = args.artifactPath
        ? await readFile(resolvePath(args.artifactPath), 'utf8')
        : args.artifactJson!
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        // Deliberately no snippet echo: the parse error would otherwise quote
        // the head of whatever file the path pointed at.
        throw new Error('artifact is not valid JSON')
      }
      const artifact = parseArtifact(parsed)
      if (args.minDetectableEdge !== undefined && !(args.minDetectableEdge > 0 && args.minDetectableEdge <= 0.5)) {
        throw new Error(`minDetectableEdge must be in (0, 0.5] as a probability (got ${args.minDetectableEdge})`)
      }

      // The artifact promises entry/exit times anywhere INSIDE their bars, and
      // providers filter by bar-open time — so pad the window by whole bars,
      // or the first trade's own entry bar gets cropped out of its audit.
      const periodMs = TIMEFRAME_MS[artifact.timeframe]
      let minEntry = Number.POSITIVE_INFINITY
      let maxExit = Number.NEGATIVE_INFINITY
      for (const trade of artifact.trades) {
        minEntry = Math.min(minEntry, Date.parse(trade.entryTime))
        maxExit = Math.max(maxExit, Date.parse(trade.exitTime))
      }
      const start = new Date(minEntry - FETCH_SLACK_BARS * periodMs).toISOString()
      const end = new Date(maxExit + periodMs).toISOString()
      const providerId = ctx.marketData.provider(args.provider).id
      const bars = await ctx.marketData.getOhlcv(
        { symbol: artifact.symbol, timeframe: artifact.timeframe, start, end },
        args.provider,
      )
      if (bars.length === 0) {
        throw new Error(`provider '${providerId}' returned no candles for ${artifact.symbol} ${artifact.timeframe} in [${start}, ${end}] — audit needs the same data the backtest ran on`)
```

</details>

**依据 4 · 作者声明**：[README.md:187-203](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/README.md#L187-L203)

作者给出 CSV 格式与发布组合入口。

<details>
<summary>查看原文（17行）</summary>

````text
## Data format (CSV provider)

```
data/
  AAPL/
    1d.csv        # header: time,open,high,low,close,volume
  BTC-USDT/
    1h.csv        # ISO-8601 UTC bar-open times, ascending
```

## Try it with dsh

One command — the published bundle pulls its six plugin rows from npm
(`client-frame` and `provider-futu` are opt-in, see below):

```sh
dsh plugin --profile trading add @dsh-trading/bundle
````

</details>

#### 缺口

- 固定版本宿主安装、行情复核负担和本地开销未测。
  **影响**：无法预测真实审计用时。
  **进一步探讨**：用同一合成行情记录手工与工具核查时间和失败结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 独立材料清单能否揭示只交成功样本的问题？

**研究主题**：新假设与验证

#### 完整回答

可以在回测生成端先保存包含完整成交数、时间范围和摘要的清单，再用它与提交给核验工具的子集对账。当前报告明确看不到是否省略亏损交易，单靠在区间内的成交也无法识别遗漏。用同一套合成数据分别交全量与挑选子集，比较漏报和复核时间。如果生成端清单本身无法独立验证或子集仍能通过，清单不能提高完整性结论。

#### 证据与依据

**依据 1 · 源码核查**：[packages/verdict/src/report.ts:240-245](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/verdict/src/report.ts#L240-L245)

报告声明成交列表完整性盲区。

```text
/** What this harness cannot see. Printed on every report, whatever the verdict. */
export const BLIND_SPOTS: readonly string[] = [
  'in-sample selection: it cannot see how many strategy variants were tried on this same window before this one was shown to it',
  'trade-list completeness: an artifact containing only the winning trades passes every check here',
  'fills finer than the declared timeframe: intrabar execution quality is invisible at this bar size',
]
```

**依据 2 · 源码核查**：[packages/verdict/src/index.ts:253-283](https://github.com/maddogfinance/dsh-trading/blob/7470117a3a07d3241282cbfa2ec58026065924f4/packages/verdict/src/index.ts#L253-L283)

当前核验依赖输入成交及所选行情。

<details>
<summary>查看原文（31行）</summary>

```text
      const checks: CheckResult[] = []
      if (args.codePaths && args.codePaths.length > 0) {
        const { findings, scanned, unreadable, notes } = await lintPaths(args.codePaths)
        checks.push(lintCheck(findings, scanned, unreadable, notes))
      }
      checks.push(fillCheck(validateFills(artifact.trades, bars, {
        durationMs: periodMs,
        ...args.priceTolerancePct !== undefined ? { priceTolerancePct: args.priceTolerancePct } : {},
      })))

      const barTimes = bars.map(b => Date.parse(b.time))
      const independence = effectiveTrades(artifact.trades, barTimes, periodMs)
      checks.push(independenceCheck(independence))

      const baseline = randomBaseline(independence.kept, bars, {
        simulations: config.simulations,
        seed: config.seed,
      })
      checks.push(baselineCheck(baseline))
      checks.push(fillModelCheck(baseline))

      const effectiveReturns = independence.kept.map(w => tradeReturn(w.trade))
      const power = samplePower(
        effectiveReturns,
        args.minDetectableEdge !== undefined ? { minDetectableEdge: args.minDetectableEdge } : {},
      )
      checks.push(powerCheck(power))
      checks.push(plausibilityCheck(power))
      checks.push(costsCheck(artifact))

      return assembleReport(artifact, checks, providerId)
```

</details>

#### 缺口

- 独立清单和对账没有实现或实验。
  **影响**：无法量化完整性改善。
  **进一步探讨**：在同一合成数据集注入漏单、重复与数据范围缺口。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
