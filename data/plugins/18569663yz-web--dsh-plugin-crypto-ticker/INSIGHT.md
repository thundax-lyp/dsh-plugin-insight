# dsh-plugin-crypto-ticker

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[84f1be4](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/tree/84f1be429c04c5d426e54d02b993d8972d4d841d)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker)
<!-- END META -->

> **实现功能**：在 DSH Web/Desktop 侧栏显示多源加密货币价格、24 小时涨跌与迷你走势。

> **核心亮点**：将公开行情源接入 DSH Web/Desktop GUI，整合代理、降级与宿主侧缓存，缩短离开工作台查看行情的操作；行情本身由交易所提供。详见[Q01](#research-q01)。

> **风险与缺陷**：collect 只需一个币有价就选源，缺价币可沿用无逐币时间的 lastGood；updatedAt 却为当前，另 schedule 写 ref 不重建计时器，可能误示新鲜和实际刷新频率。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 用户要获得什么行情信息，相比交易所网页/普通行情卡片的增量是什么？](#detail-section-11)
  - [Q02 · 多源降级、缓存、走势和新鲜度实际如何接线？](#detail-section-12)
  - [Q03 · 客户端轮询频率是否遵循部署配置，网络与代理成本有何边界？](#detail-section-13)
  - [Q04 · 如何从价格新鲜度和请求竞争推导最小改进？](#detail-section-14)
  - [Q05 · 当前版本适合何种用途，不应据何种数字决策？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人在 DSH 侧栏快速参考 USDT 现货行情；合格信息须含来源、逐币采集时间和陈旧标识。详见[Q01](#research-q01)。

直接打开交易所官方行情页可得实时价格与交易条件；插件需证明同条件来源/新鲜度足够清楚且总查看成本下降。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多源报价 | 获取 USDT 现货参考价 | 部分缺币沿旧价，逐币年龄未知 |
| 走势图 | 展示小时线和会话读数 | 走势来源可与报价不同 |
| 宿主缓存 | 多窗口共享已取快照 | 缓存失效时并发不去重 |
| 代理访问 | 受限网络经 HTTP CONNECT | https:// 代理不支持 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web/Desktop 和 Connection | 必需 | 侧栏/宿主 API | headless 无卡片 |
| OKX/Binance/CoinGecko 可达网络 | 行情必需 | 获取报价和部分走势 | 沿用旧价或断开 |
| 代理配置 | 受限网络下需要 | HTTP CONNECT | 仅支持 http:// 代理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 在 GUI profile 安装并重启 | 卡片可见 |
| 配置 | 设标的/代理/刷新参数 | API 回源且标的口径一致 |
| 观察 | 看价格、源与 stale | 与官方行情同时间核对 |
| 异常 | 全源失败/缺币时手动刷新或查代理 | 不把旧价作为交易依据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH GUI 和可达行情网络/代理；金额未知 | 安装、重启、核来源；耗时未知 | 当前网络与安装兼容未核 |
| 持续使用 | 轮询流量与缓存后上游请求；数量未知 | 对照交易所与旧价，维护代理；耗时未知 | 无 in-flight 合并 |
| 失败恢复 | 旧价误读可能致资金损失；数额未知 | 查源、缓存和代理，核官方报价；耗时未知 | 部分币旧价年龄不显示 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多源行情 | 三源顺序与旧价缓存源码 | 当前价格准确率和缺币情况 |
| 走势 | 小时序列加会话实时点 | 与顶层报价来源是否一致 |
| 请求节省 | 缓存窗口 | 并发标签在过期时无合并 |

> **思考**：collect 只需一个币有价就选源，缺价币可沿用无逐币时间的 lastGood；updatedAt 却为当前，另 schedule 写 ref 不重建计时器，可能误示新鲜和实际刷新频率。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将公开行情源接入 DSH Web/Desktop GUI，整合代理、降级与宿主侧缓存，缩短离开工作台查看行情的操作；行情本身由交易所提供。详见[Q01](#research-q01)。

将公开行情源接入 DSH Web/Desktop GUI，整合代理、降级与宿主侧缓存，缩短离开工作台查看行情的操作；行情本身由交易所提供。详见[Q01](#research-q01)。

宿主层解决 CORS/代理并限响应体可借鉴；同一缓存需补并发合并和逐币新鲜度契约。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

collect 只需一个币有价就选源，缺价币可沿用无逐币时间的 lastGood；updatedAt 却为当前，另 schedule 写 ref 不重建计时器，可能误示新鲜和实际刷新频率。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只作为个人参考并核交易所官方报价；不用于下单、风控或自动策略的唯一价格。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认行情链路和客户端卡片，但部分旧价新鲜度可能被顶层当前时间掩盖，动态轮询配置不会改变既有 interval；未核实时行情或目标 UI。改进是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、client.js、https.mjs、tests/smoke.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、Host/Client、传输层与作者测试；未执行目标代码、核实时行情/网络或真实 GUI；旧 META 仅复用。
- 下一步：以 mock 三源和固定时钟覆盖部分缺价、切源、全失败、并发标签与动态 schedule，再同时间点核官方报价和真实 GUI。

**分析版本**

- **仓库**：[18569663yz-web/dsh-plugin-crypto-ticker](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker)
- **版本号**：0.1.0（[固定提交 84f1be4](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/tree/84f1be429c04c5d426e54d02b993d8972d4d841d)）
- **版本日期**：2026-09-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是逐币 quoteAt/source/staleReason、并发 single-flight、按当前配置递归调度，模拟部分缺价/多标签与真实官方报价对照。详见[Q04](#research-q04)。

以 mock 三源和固定时钟覆盖部分缺价、切源、全失败、并发标签与动态 schedule，再同时间点核官方报价和真实 GUI。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1124 | 726 | 335 | — |
| .mjs | source | 1 | 205 | 135 | 58 | — |
| .md | source | 1 | 202 | — | — | 2448 |
| .mjs | test | 2 | 389 | 309 | 56 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**加密行情卡片能否在多源故障下清楚标示价格新鲜度、控制请求成本，并兑现可配置刷新？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户要获得什么行情信息，相比交易所网页/普通行情卡片的增量是什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

DSH Web/Desktop 用户在侧栏扫看 BTC、ETH 等 USDT 现货报价、24h 涨跌与迷你走势；合格结果须说明币种/计价单位、信源、取样时间和数据是否过期，不能把卡片作为交易执行价格。作者承诺免密钥、OKX→Binance→CoinGecko 三级降级、宿主缓存、系统代理和红涨绿跌。源码确认宿主 Connection Fetch 路由加客户端 sidebar.footer.action 卡片，及多源读取、代理传输和本地走势拼接。增量是把行情接入 DSH GUI 与共享宿主传输层；公开交易所接口、行情本身和交易决策不属于插件贡献。作者截图/测试是作者材料，本轮未独立验收 UI 或实时行情。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-33](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/README.md#L1-L33)

作者的侧栏位置、信息与降级承诺。

<details>
<summary>查看原文（33行）</summary>

````text
# dsh-plugin-crypto-ticker

给 [DSH（DeepSeek Harness）](https://github.com/deepseek-ai) Web GUI 用的加密货币行情卡片：**侧边栏左下角、余额与设置上方**，实时显示 BTC / ETH / SOL / JUP 等主流代币的价格、24 小时涨跌和迷你走势图。

**零依赖、免密钥、开箱即用**——不装任何其它插件也能正常显示（已在干净 profile 下用无头浏览器验证过）。

![侧边栏左下角的行情卡片](screenshot.png)

<sub>上图为真实页面截图（无头浏览器渲染，2× 像素密度）。完整界面见 [screenshot-full.png](screenshot-full.png)。</sub>

```
┌────────────────────────┐
│  …会话列表…             │
│                        │
│  行情             OKX ⟳   │
│  ● BTC   76,926  +1.72% ╱╲╱   │  ← 这张卡片
│  ● ETH    2,472  +3.72% ╱╲╱   │
│  ● SOL   102.00  +5.47% ╱╲╱   │
│  ● JUP     0.263 +13.4% ╱╲╱   │
│  ⚙ 设置                │
└────────────────────────┘
```

## 特性

- **红涨绿跌**（中文习惯），价格按量级自动选小数位，成交量按 K/M/B 缩写。
- **真实的 24 小时小时线**，不是装饰——首屏从交易所取 24 根 1H 收盘价，之后把实时读数续上去，线会一直动。
- 价格上跳标红、下跳标绿并短暂脉冲，扫一眼就知道刚在动。
- 点任意一行或表头 ⟳ 立即刷新；悬停看 24h 高/低、成交量、当前信源与更新时间。
- 侧边栏收成 56px 窄栏时自动变成「字标 + 价格」。
- 数据源自动降级：**OKX → Binance → CoinGecko**。全部不可用时保留最后已知价格并置灰、表头显示「已断开」，而不是清空界面。
- 宿主侧缓存，多个标签页共享同一份数据，不会因为开了三个窗口就把上游请求翻三倍。
- 自动适配系统代理（见下文），国内网络不用额外配置。
````

</details>

**依据 2 · 源码核查**：[index.js:73-122](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L73-L122)

信源顺序与默认标的。

<details>
<summary>查看原文（50行）</summary>

```text
/** Upstream failure classes the browser half renders differently. */
const SOURCES = [
  {
    id: 'okx',
    label: 'OKX',
    quote: okxQuotes,
    spark: okxSpark,
  },
  {
    id: 'binance',
    label: 'Binance',
    quote: binanceQuotes,
    spark: binanceSpark,
  },
  {
    id: 'coingecko',
    label: 'CoinGecko',
    quote: coingeckoQuotes,
    // CoinGecko's free tier has no keyless OHLC series, so this source is quote-only.
    spark: undefined,
  },
]

/**
 * The symbols shown when `config.symbols` is absent.
 *
 * JUP is Solana's Jupiter exchange token; it is quoted as a plain `JUPUSDT`
 * spot pair on OKX and Binance, so it needs no chain access — only the
 * CoinGecko id below for the last-resort source.
 */
export const DEFAULT_SYMBOLS = ['BTC', 'ETH', 'SOL', 'JUP']

/** CoinGecko addresses assets by id, not by ticker; these cover the shipped defaults and common asks. */
const COINGECKO_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  JUP: 'jupiter-exchange-solana',
  BNB: 'binancecoin',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  AVAX: 'avalanche-2',
  TON: 'the-open-network',
  LINK: 'chainlink',
  SUI: 'sui',
  LTC: 'litecoin',
  DOT: 'polkadot',
  TRX: 'tron',
}
```

</details>

**依据 3 · 源码核查**：[index.js:651-675](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L651-L675)

宿主共用 /api 路由。

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.connection.fetch.register({
    path: TICKER_PATH,
    methods: ['GET', 'POST'],
    requestBody: 'buffered',
    fetch: async (request) => {
      if (request.method === 'POST') {
        return jsonResponse({ ok: true, clientSeenAt: recordClientSeen(heartbeatPath, log) })
      }
      const force = new URL(request.url).searchParams.get('refresh') === '1'
      if (!force && cached !== undefined && Date.now() - cached.at < settings.cacheMs) {
        return jsonResponse(cached.payload)
      }
      try {
        const payload = await build(request.signal)
        // Only a live reading is worth caching; a stale snapshot must be retried next poll.
        if (!payload.degraded) cached = { at: Date.now(), payload }
        return jsonResponse(payload)
      } catch (error) {
        if (request.signal.aborted) return new Response(null, { status: 499 })
        log.warn(`${LOG_PREFIX} ticker query failed: ${String(error?.stack ?? error)}`)
        if (cached !== undefined) return jsonResponse({ ...cached.payload, degraded: true })
        return jsonResponse({ ok: false, error: 'internal', message: String(error?.message ?? error) })
      }
    },
  })
```

</details>

**依据 4 · 源码核查**：[client.js:245-309](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/client.js#L245-L309)

浏览器卡片拉取与展示状态。

<details>
<summary>查看原文（65行）</summary>

```text
		/**
		 * 侧边栏左下角的行情卡片；`wide` 为 false 时收缩成只显示币种字标的栏位。
		 * @param props 槽位 owner 传入的列状态（wide）。
		 * @returns 行情卡片元素。
		 */
		function CryptoTicker(props) {
			ensureStyle();
			const wide = !(props !== undefined && props.wide === false);
			const [snapshot, setSnapshot] = React.useState({ phase: "loading" });
			const [tick, setTick] = React.useState(0);
			const [flash, setFlash] = React.useState({});
			/** 上一轮价格，用于判断价格上/下跳并给出对应的颜色脉冲。 */
			const previous = React.useRef({});
			/** 卡片根节点，用来向上找到真正排布它的 flex 容器。 */
			const rootRef = React.useRef(null);
			/**
			 * 当前轮询间隔（ms）。宿主会在每份载荷里带上它配置的 schedule，
			 * 所以这里不写死；用 ref 让取到新值后不必重启定时器。
			 */
			const intervalRef = React.useRef(POLL_MS);

			React.useEffect(() => {
				let alive = true;
				const run = (force) => {
					const url = force ? ENDPOINT + "?refresh=1" : ENDPOINT;
					fetch(url, { headers: { accept: "application/json" } })
						.then((response) => response.ok ? response.json() : Promise.reject(new Error("HTTP " + response.status)))
						.then((body) => {
							if (!alive) return;
							if (body === null || typeof body !== "object" || body.ok !== true) {
								setSnapshot({ phase: "error", message: (body && body.message) || "行情不可用" });
								return;
							}
							const rows = Array.isArray(body.symbols) ? body.symbols : [];
							const nextFlash = {};
							for (const row of rows) {
								const before = previous.current[row.symbol];
								if (typeof before === "number" && typeof row.price === "number" && before !== row.price) {
									nextFlash[row.symbol] = row.price > before ? "up" : "down";
								}
								if (typeof row.price === "number") previous.current[row.symbol] = row.price;
							}
							// 宿主配置的刷新间隔（秒）优先于内置默认值。
							if (typeof body.schedule === "number" && body.schedule >= 5) {
								intervalRef.current = body.schedule * 1000;
							}
							setFlash(nextFlash);
							setSnapshot({
								phase: "ready",
								rows,
								source: body.source,
								updatedAt: body.updatedAt,
								degraded: body.degraded === true,
							});
						})
						.catch((error) => {
							if (!alive) return;
							setSnapshot({ phase: "error", message: String((error && error.message) || error) });
						});
				};
				run(tick > 0);
				// 定时器读 ref，所以 schedule 变了也不必重建。
				const timer = setInterval(() => { run(false) }, intervalRef.current);
				return () => { alive = false; clearInterval(timer) };
			}, [tick]);
```

</details>

#### 缺口

- 未核当前交易所 API、价格与真实 GUI
  **影响：**不能判断报价准确率、延迟和展示位置
  **进一步探讨：**同一时间戳对照交易所官方页面/API，实测 Web/Desktop 卡片

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多源降级、缓存、走势和新鲜度实际如何接线？

**研究主题：**功能与机制、缺陷与关键质疑

#### 完整回答

collect 顺序尝试三信源，只要某信源至少一个币有有效价就立即采用该信源，并不要求全部配置币完整。build 对每个币缺价时沿用 lastGood，标记 row.stale；但顶层 source 会写当前部分成功信源、updatedAt 总是当前 Date.now，缺失币的旧价格本身没有逐币采集时间，读者容易把陈旧价格误解为当前报价。全部失败时 degraded=true，既有 cached 的异常分支可返回旧数据；只有首次成功缓存，且没有 in-flight Promise 合并，同时打开多个标签页在缓存尚未建立/过期瞬间仍会并发请求上游，README 的“多个标签共享同一份数据”不能推导为请求数量恒定。走势每 5 分钟独立抓 OKX/Binance，可能与当前报价信源不同，CoinGecko 下仅有会话期实时点。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:539-571](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L539-L571)

缓存、lastGood 和任一可用币即胜出。

<details>
<summary>查看原文（33行）</summary>

```text
  /** Last good quote per symbol, retained so a total outage still renders a stale price. */
  const lastGood = new Map()
  /** Live readings per symbol, appended on every successful poll. */
  const ring = new Map(symbols.map((symbol) => [symbol, []]))
  /** Hourly series per symbol, re-read on the slow cadence. */
  const series = new Map()
  let cached
  let sparkReadAt = 0

  log.info(`${LOG_PREFIX} watching ${symbols.join(', ')} (sources: ${SOURCES.map((s) => s.label).join(' -> ')})`)

  /**
   * Ask every source in order and return the first complete answer.
   * @param signal - request cancellation.
   * @returns the winning source plus its quotes.
   */
  async function collect(signal) {
    const failures = []
    for (const source of SOURCES) {
      try {
        const quotes = await source.quote(symbols, signal, settings.upstreamTimeoutMs, proxy, log)
        const usable = quotes.filter((entry) => entry.price !== undefined)
        if (usable.length === 0) {
          failures.push(`${source.id}: no usable price`)
          continue
        }
        return { source, quotes, failures }
      } catch (error) {
        if (signal.aborted) throw error
        failures.push(`${source.id}: ${String(error?.message ?? error)}`)
      }
    }
    return { source: undefined, quotes: [], failures }
```

</details>

**依据 2 · 源码核查**：[index.js:575-603](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L575-L603)

走势独立按源刷新。

<details>
<summary>查看原文（29行）</summary>

```text
   * Refresh the hourly trend series from whichever source is answering.
   * @param signal - request cancellation.
   */
  async function refreshSeries(signal) {
    if (Date.now() - sparkReadAt < settings.sparklineCacheMs) return
    sparkReadAt = Date.now()
    for (const source of SOURCES) {
      if (source.spark === undefined) continue
      try {
        const next = new Map()
        for (const symbol of symbols) {
          next.set(symbol, await source.spark(symbol, signal, settings.upstreamTimeoutMs, proxy, log))
        }
        if ([...next.values()].some((points) => points.length > 1)) {
          for (const [symbol, points] of next) {
            if (points.length <= 1) continue
            series.set(symbol, points)
            // The series already carries the readings collected so far, so the live
            // ring restarts here instead of appending them a second time.
            ring.set(symbol, [])
          }
          return
        }
      } catch (error) {
        if (signal.aborted) throw error
        // A failed series only costs the sparkline, so the headline quote is kept either way.
      }
    }
  }
```

</details>

**依据 3 · 源码核查**：[index.js:610-648](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L610-L648)

逐币旧价与顶层 source/updatedAt。

<details>
<summary>查看原文（39行）</summary>

```text
  async function build(signal) {
    const { source, quotes, failures } = await collect(signal)
    if (source !== undefined) {
      for (const entry of quotes) {
        if (entry.price === undefined) continue
        lastGood.set(entry.symbol, entry)
        ring.set(entry.symbol, pushReading(ring.get(entry.symbol) ?? [], entry.price))
      }
      await refreshSeries(signal)
    }

    const degraded = source === undefined
    const rows = symbols.map((symbol) => {
      const fresh = quotes.find((entry) => entry.symbol === symbol)
      const entry = fresh?.price === undefined ? lastGood.get(symbol) : fresh
      return {
        symbol,
        price: entry?.price ?? null,
        changePercent: entry?.changePercent ?? null,
        high: entry?.high ?? null,
        low: entry?.low ?? null,
        volume24h: entry?.volume24h ?? null,
        volumeUnit: entry?.volumeUnit ?? null,
        trend: trendOf(series.get(symbol) ?? [], ring.get(symbol) ?? []),
        stale: fresh?.price === undefined,
      }
    })

    return {
      ok: true,
      degraded,
      source: source?.label ?? null,
      updatedAt: Date.now(),
      symbols: rows,
      failures: failures.slice(-3),
      // 浏览器半侧需要的展示配置：轮询间隔。放这里是为了让它跟着部署走，
      // 不必在客户端 bundle 里再写死一份。
      schedule: settings.schedule,
    }
```

</details>

**依据 4 · 源码核查**：[index.js:651-674](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L651-L674)

缓存窗口但无并发去重。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.connection.fetch.register({
    path: TICKER_PATH,
    methods: ['GET', 'POST'],
    requestBody: 'buffered',
    fetch: async (request) => {
      if (request.method === 'POST') {
        return jsonResponse({ ok: true, clientSeenAt: recordClientSeen(heartbeatPath, log) })
      }
      const force = new URL(request.url).searchParams.get('refresh') === '1'
      if (!force && cached !== undefined && Date.now() - cached.at < settings.cacheMs) {
        return jsonResponse(cached.payload)
      }
      try {
        const payload = await build(request.signal)
        // Only a live reading is worth caching; a stale snapshot must be retried next poll.
        if (!payload.degraded) cached = { at: Date.now(), payload }
        return jsonResponse(payload)
      } catch (error) {
        if (request.signal.aborted) return new Response(null, { status: 499 })
        log.warn(`${LOG_PREFIX} ticker query failed: ${String(error?.stack ?? error)}`)
        if (cached !== undefined) return jsonResponse({ ...cached.payload, degraded: true })
        return jsonResponse({ ok: false, error: 'internal', message: String(error?.message ?? error) })
      }
    },
```

</details>

**依据 5 · 作者声明**：[README.md:26-33](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/README.md#L26-L33)

作者对共享缓存与降级 UI 的描述。

```text
- **红涨绿跌**（中文习惯），价格按量级自动选小数位，成交量按 K/M/B 缩写。
- **真实的 24 小时小时线**，不是装饰——首屏从交易所取 24 根 1H 收盘价，之后把实时读数续上去，线会一直动。
- 价格上跳标红、下跳标绿并短暂脉冲，扫一眼就知道刚在动。
- 点任意一行或表头 ⟳ 立即刷新；悬停看 24h 高/低、成交量、当前信源与更新时间。
- 侧边栏收成 56px 窄栏时自动变成「字标 + 价格」。
- 数据源自动降级：**OKX → Binance → CoinGecko**。全部不可用时保留最后已知价格并置灰、表头显示「已断开」，而不是清空界面。
- 宿主侧缓存，多个标签页共享同一份数据，不会因为开了三个窗口就把上游请求翻三倍。
- 自动适配系统代理（见下文），国内网络不用额外配置。
```

#### 缺口

- 真实交易所部分缺价和并发访问频率未测
  **影响：**不能量化旧价误读与请求节省
  **进一步探讨：**用隔离三源夹具覆盖部分币缺价、全部失败和多标签并发

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 客户端轮询频率是否遵循部署配置，网络与代理成本有何边界？

**研究主题：**缺陷与关键质疑、效果与总成本、依赖、兼容与流程

#### 完整回答

Host 校验 schedule>=5 并在 payload 回传；Client 将 body.schedule 写入 intervalRef.current，但 setInterval 在 effect 建立时用一次 intervalRef.current，配置更新后并未重建 timer，故实际轮询仍按初始常量，除非手动刷新触发 effect 重建。每次缓存过期可能串行探测三信源，默认每源 8 秒超时；走势每币按顺序抓取，初次或慢网可能拖长响应。传输层用 Node http/tls 自建 HTTP CONNECT，仅支持 http:// 代理，响应头/体有上限；安装阶段的 GitHub/codeload 可达性属于作者当时环境报告，本轮不当作当前通用建议。首次成本是 DSH Web/Desktop 与可达行情网络，持续成本是轮询请求/流量和代理维护，失败恢复需查来源、陈旧价格、代理和缓存，金额/时间未知。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:519-536](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L519-L536)

Host 读取和发布刷新配置。

<details>
<summary>查看原文（18行）</summary>

```text
export function apply(ctx, config = {}) {
  const log = ctx.logger ?? console
  const symbols = resolveSymbols(config.symbols)
  const settings = {
    upstreamTimeoutMs: config.upstreamTimeoutMs ?? DEFAULTS.upstreamTimeoutMs,
    cacheMs: config.cacheMs ?? DEFAULTS.cacheMs,
    sparklineCacheMs: config.sparklineCacheMs ?? DEFAULTS.sparklineCacheMs,
    /**
     * Seconds between browser polls. Clamped to a sane floor: the Host already
     * serves a cache window, and a sub-second poll would only burn CPU in both
     * halves without showing anything new.
     */
    schedule: Number.isFinite(config.schedule) && config.schedule >= 5
      ? Math.floor(config.schedule)
      : DEFAULTS.schedule,
  }
  /** `config.proxy`: a URL to force, `false` to force direct, unset to auto-detect. */
  const proxy = config.proxy
```

</details>

**依据 2 · 源码核查**：[client.js:260-309](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/client.js#L260-L309)

更新 ref 不会修改既有 setInterval 周期。

<details>
<summary>查看原文（50行）</summary>

```text
			/**
			 * 当前轮询间隔（ms）。宿主会在每份载荷里带上它配置的 schedule，
			 * 所以这里不写死；用 ref 让取到新值后不必重启定时器。
			 */
			const intervalRef = React.useRef(POLL_MS);

			React.useEffect(() => {
				let alive = true;
				const run = (force) => {
					const url = force ? ENDPOINT + "?refresh=1" : ENDPOINT;
					fetch(url, { headers: { accept: "application/json" } })
						.then((response) => response.ok ? response.json() : Promise.reject(new Error("HTTP " + response.status)))
						.then((body) => {
							if (!alive) return;
							if (body === null || typeof body !== "object" || body.ok !== true) {
								setSnapshot({ phase: "error", message: (body && body.message) || "行情不可用" });
								return;
							}
							const rows = Array.isArray(body.symbols) ? body.symbols : [];
							const nextFlash = {};
							for (const row of rows) {
								const before = previous.current[row.symbol];
								if (typeof before === "number" && typeof row.price === "number" && before !== row.price) {
									nextFlash[row.symbol] = row.price > before ? "up" : "down";
								}
								if (typeof row.price === "number") previous.current[row.symbol] = row.price;
							}
							// 宿主配置的刷新间隔（秒）优先于内置默认值。
							if (typeof body.schedule === "number" && body.schedule >= 5) {
								intervalRef.current = body.schedule * 1000;
							}
							setFlash(nextFlash);
							setSnapshot({
								phase: "ready",
								rows,
								source: body.source,
								updatedAt: body.updatedAt,
								degraded: body.degraded === true,
							});
						})
						.catch((error) => {
							if (!alive) return;
							setSnapshot({ phase: "error", message: String((error && error.message) || error) });
						});
				};
				run(tick > 0);
				// 定时器读 ref，所以 schedule 变了也不必重建。
				const timer = setInterval(() => { run(false) }, intervalRef.current);
				return () => { alive = false; clearInterval(timer) };
			}, [tick]);
```

</details>

**依据 3 · 源码核查**：[index.js:555-603](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L555-L603)

串行信源及走势刷新。

<details>
<summary>查看原文（49行）</summary>

```text
  async function collect(signal) {
    const failures = []
    for (const source of SOURCES) {
      try {
        const quotes = await source.quote(symbols, signal, settings.upstreamTimeoutMs, proxy, log)
        const usable = quotes.filter((entry) => entry.price !== undefined)
        if (usable.length === 0) {
          failures.push(`${source.id}: no usable price`)
          continue
        }
        return { source, quotes, failures }
      } catch (error) {
        if (signal.aborted) throw error
        failures.push(`${source.id}: ${String(error?.message ?? error)}`)
      }
    }
    return { source: undefined, quotes: [], failures }
  }

  /**
   * Refresh the hourly trend series from whichever source is answering.
   * @param signal - request cancellation.
   */
  async function refreshSeries(signal) {
    if (Date.now() - sparkReadAt < settings.sparklineCacheMs) return
    sparkReadAt = Date.now()
    for (const source of SOURCES) {
      if (source.spark === undefined) continue
      try {
        const next = new Map()
        for (const symbol of symbols) {
          next.set(symbol, await source.spark(symbol, signal, settings.upstreamTimeoutMs, proxy, log))
        }
        if ([...next.values()].some((points) => points.length > 1)) {
          for (const [symbol, points] of next) {
            if (points.length <= 1) continue
            series.set(symbol, points)
            // The series already carries the readings collected so far, so the live
            // ring restarts here instead of appending them a second time.
            ring.set(symbol, [])
          }
          return
        }
      } catch (error) {
        if (signal.aborted) throw error
        // A failed series only costs the sparkline, so the headline quote is kept either way.
      }
    }
  }
```

</details>

**依据 4 · 源码核查**：[https.mjs:17-24](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/https.mjs#L17-L24)

传输头体大小上限。

```text
import { request as httpRequest } from 'node:http'
import { connect as netConnect } from 'node:net'
import { connect as tlsConnect } from 'node:tls'
/** Cap on a response body; the largest ticker table this plugin reads is about 500 KiB. */
const MAX_BODY_BYTES = 8 * 1024 * 1024

/** Cap on the response head; a legitimate one is a few hundred bytes. */
const MAX_HEAD_BYTES = 64 * 1024
```

**依据 5 · 作者声明**：[README.md:141-154](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/README.md#L141-L154)

作者代理环境说明。

<details>
<summary>查看原文（14行）</summary>

```text
## 系统代理（国内网络必读）

交易所接口在国内需要代理，而 **Node 的 `fetch` 不读 Windows 系统代理**（浏览器读，Node 不读）。如果什么都不做，插件会在每个信源上各超时 8 秒、界面显示「已断开」——而同一时刻用 PowerShell 测同一个 URL 却是通的，很容易误判成接口挂了。

所以宿主半侧自己解析代理，优先级从高到低：

1. `config.proxy`；
2. `HTTPS_PROXY` / `https_proxy` / `HTTP_PROXY` / `http_proxy` 环境变量；
3. Windows 注册表 `HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings`（即系统代理）；
4. 都没有则直连——没有代理的机器上直连本来就是对的。

本地（`127.0.0.1`）访问不受代理影响。只支持 `http://` 代理（CONNECT 隧道）；`https://` 代理会退回直连并在宿主日志告警。

没用 `undici` 的 `ProxyAgent`：它不是本插件的依赖，而 profile 的 `plugins/` 目录没有自己的 `node_modules`，去猜 DSH 安装目录里的 `undici` 太脆。Node 自带的 `http`/`tls` 永远在，`https.mjs` 直接开 CONNECT 隧道。
```

</details>

#### 缺口

- 未执行浏览器定时器、真实上游和代理
  **影响：**不能量化刷新偏差、流量、故障等待
  **进一步探讨：**固定时钟/模拟请求计数验证 schedule、并发与三源超时

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何从价格新鲜度和请求竞争推导最小改进？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

工程可借鉴点是宿主处理 CORS/代理、source 字段透明化、体限与超时；但“一个共享缓存”不等于并发 single-flight。未验证方向是每币记录实际 quoteAt、quoteSource、staleReason，旧价 UI 直接标示年龄；缓存刷新持有单个 in-flight Promise，并设 per-symbol 完整性阈值或按币补源，同时明确走势图独立来源。客户端用递归 setTimeout 读当前 schedule 并取消未完成请求，避免 intervalRef 失效和重叠。最小验证用同一时钟下两窗口并发、部分币缺价、源切换、全部失败、慢趋势、动态 schedule，量请求数、UI 旧价年龄和延迟。设想尚未实现，不计入当前贡献。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:555-571](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L555-L571)

任一有效币即可选源。

<details>
<summary>查看原文（17行）</summary>

```text
  async function collect(signal) {
    const failures = []
    for (const source of SOURCES) {
      try {
        const quotes = await source.quote(symbols, signal, settings.upstreamTimeoutMs, proxy, log)
        const usable = quotes.filter((entry) => entry.price !== undefined)
        if (usable.length === 0) {
          failures.push(`${source.id}: no usable price`)
          continue
        }
        return { source, quotes, failures }
      } catch (error) {
        if (signal.aborted) throw error
        failures.push(`${source.id}: ${String(error?.message ?? error)}`)
      }
    }
    return { source: undefined, quotes: [], failures }
```

</details>

**依据 2 · 源码核查**：[index.js:610-674](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L610-L674)

旧价缓存和路由刷新。

<details>
<summary>查看原文（65行）</summary>

```text
  async function build(signal) {
    const { source, quotes, failures } = await collect(signal)
    if (source !== undefined) {
      for (const entry of quotes) {
        if (entry.price === undefined) continue
        lastGood.set(entry.symbol, entry)
        ring.set(entry.symbol, pushReading(ring.get(entry.symbol) ?? [], entry.price))
      }
      await refreshSeries(signal)
    }

    const degraded = source === undefined
    const rows = symbols.map((symbol) => {
      const fresh = quotes.find((entry) => entry.symbol === symbol)
      const entry = fresh?.price === undefined ? lastGood.get(symbol) : fresh
      return {
        symbol,
        price: entry?.price ?? null,
        changePercent: entry?.changePercent ?? null,
        high: entry?.high ?? null,
        low: entry?.low ?? null,
        volume24h: entry?.volume24h ?? null,
        volumeUnit: entry?.volumeUnit ?? null,
        trend: trendOf(series.get(symbol) ?? [], ring.get(symbol) ?? []),
        stale: fresh?.price === undefined,
      }
    })

    return {
      ok: true,
      degraded,
      source: source?.label ?? null,
      updatedAt: Date.now(),
      symbols: rows,
      failures: failures.slice(-3),
      // 浏览器半侧需要的展示配置：轮询间隔。放这里是为了让它跟着部署走，
      // 不必在客户端 bundle 里再写死一份。
      schedule: settings.schedule,
    }
  }

  ctx.connection.fetch.register({
    path: TICKER_PATH,
    methods: ['GET', 'POST'],
    requestBody: 'buffered',
    fetch: async (request) => {
      if (request.method === 'POST') {
        return jsonResponse({ ok: true, clientSeenAt: recordClientSeen(heartbeatPath, log) })
      }
      const force = new URL(request.url).searchParams.get('refresh') === '1'
      if (!force && cached !== undefined && Date.now() - cached.at < settings.cacheMs) {
        return jsonResponse(cached.payload)
      }
      try {
        const payload = await build(request.signal)
        // Only a live reading is worth caching; a stale snapshot must be retried next poll.
        if (!payload.degraded) cached = { at: Date.now(), payload }
        return jsonResponse(payload)
      } catch (error) {
        if (request.signal.aborted) return new Response(null, { status: 499 })
        log.warn(`${LOG_PREFIX} ticker query failed: ${String(error?.stack ?? error)}`)
        if (cached !== undefined) return jsonResponse({ ...cached.payload, degraded: true })
        return jsonResponse({ ok: false, error: 'internal', message: String(error?.message ?? error) })
      }
    },
```

</details>

**依据 3 · 源码核查**：[client.js:266-309](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/client.js#L266-L309)

客户端轮询定时器。

<details>
<summary>查看原文（44行）</summary>

```text
			React.useEffect(() => {
				let alive = true;
				const run = (force) => {
					const url = force ? ENDPOINT + "?refresh=1" : ENDPOINT;
					fetch(url, { headers: { accept: "application/json" } })
						.then((response) => response.ok ? response.json() : Promise.reject(new Error("HTTP " + response.status)))
						.then((body) => {
							if (!alive) return;
							if (body === null || typeof body !== "object" || body.ok !== true) {
								setSnapshot({ phase: "error", message: (body && body.message) || "行情不可用" });
								return;
							}
							const rows = Array.isArray(body.symbols) ? body.symbols : [];
							const nextFlash = {};
							for (const row of rows) {
								const before = previous.current[row.symbol];
								if (typeof before === "number" && typeof row.price === "number" && before !== row.price) {
									nextFlash[row.symbol] = row.price > before ? "up" : "down";
								}
								if (typeof row.price === "number") previous.current[row.symbol] = row.price;
							}
							// 宿主配置的刷新间隔（秒）优先于内置默认值。
							if (typeof body.schedule === "number" && body.schedule >= 5) {
								intervalRef.current = body.schedule * 1000;
							}
							setFlash(nextFlash);
							setSnapshot({
								phase: "ready",
								rows,
								source: body.source,
								updatedAt: body.updatedAt,
								degraded: body.degraded === true,
							});
						})
						.catch((error) => {
							if (!alive) return;
							setSnapshot({ phase: "error", message: String((error && error.message) || error) });
						});
				};
				run(tick > 0);
				// 定时器读 ref，所以 schedule 变了也不必重建。
				const timer = setInterval(() => { run(false) }, intervalRef.current);
				return () => { alive = false; clearInterval(timer) };
			}, [tick]);
```

</details>

**依据 4 · 源码核查**：[https.mjs:114-129](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/https.mjs#L114-L129)

请求超时和 socket 中断边界。

<details>
<summary>查看原文（16行）</summary>

```text
export async function httpsGet(url, options) {
  const target = new URL(url)
  const proxy = options.proxy === undefined ? undefined : new URL(options.proxy)
  const timeout = AbortSignal.timeout(options.timeoutMs)
  const signal = options.signal === undefined ? timeout : AbortSignal.any([options.signal, timeout])
  // Only https upstreams are proxied: a plain-http target exists solely so a test can
  // point an exchange at a local server, and that server needs no tunnel.
  const socket = (proxy === undefined || target.protocol !== 'https:')
    ? openDirect(target, signal)
    : await openTunnel(proxy, target, signal)

  return new Promise((resolve, reject) => {
    /** Every exit path destroys the socket, so a failed read cannot leak a tunnel. */
    const fail = (error) => { socket.destroy(); reject(error) }
    signal.addEventListener('abort', () => { socket.destroy() }, { once: true })
    socket.once('error', fail)
```

</details>

#### 缺口

- 逐币来源、single-flight 和动态定时器未实现
  **影响：**不能把更准的新鲜度或更少请求算作现有效果
  **进一步探讨：**先构造 mock exchanges 反例，再对照作者 smoke 和目标宿主

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前版本适合何种用途，不应据何种数字决策？

**研究主题：**采用判断

#### 完整回答

可在行情仅供参考的个人 Web/Desktop 侧栏观察，开启后核每行是否 stale、顶层信源和实际交易所页面价格；不用它作交易下单、风险控制或自动套利的唯一数据源。尤其部分币种缺价时顶层更新时间不代表旧价年龄，用户应打开官方交易所确认。建议 observe，先修复逐币时间标识、动态 schedule 和并发请求控制，再用真实行情/宿主验证；README 的特定地区网络经验和“实时”字样均不替代当前实测。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:621-648](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js#L621-L648)

旧价没有逐币时间。

<details>
<summary>查看原文（28行）</summary>

```text
    const degraded = source === undefined
    const rows = symbols.map((symbol) => {
      const fresh = quotes.find((entry) => entry.symbol === symbol)
      const entry = fresh?.price === undefined ? lastGood.get(symbol) : fresh
      return {
        symbol,
        price: entry?.price ?? null,
        changePercent: entry?.changePercent ?? null,
        high: entry?.high ?? null,
        low: entry?.low ?? null,
        volume24h: entry?.volume24h ?? null,
        volumeUnit: entry?.volumeUnit ?? null,
        trend: trendOf(series.get(symbol) ?? [], ring.get(symbol) ?? []),
        stale: fresh?.price === undefined,
      }
    })

    return {
      ok: true,
      degraded,
      source: source?.label ?? null,
      updatedAt: Date.now(),
      symbols: rows,
      failures: failures.slice(-3),
      // 浏览器半侧需要的展示配置：轮询间隔。放这里是为了让它跟着部署走，
      // 不必在客户端 bundle 里再写死一份。
      schedule: settings.schedule,
    }
```

</details>

**依据 2 · 源码核查**：[client.js:266-309](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/client.js#L266-L309)

刷新配置不改变已建周期。

<details>
<summary>查看原文（44行）</summary>

```text
			React.useEffect(() => {
				let alive = true;
				const run = (force) => {
					const url = force ? ENDPOINT + "?refresh=1" : ENDPOINT;
					fetch(url, { headers: { accept: "application/json" } })
						.then((response) => response.ok ? response.json() : Promise.reject(new Error("HTTP " + response.status)))
						.then((body) => {
							if (!alive) return;
							if (body === null || typeof body !== "object" || body.ok !== true) {
								setSnapshot({ phase: "error", message: (body && body.message) || "行情不可用" });
								return;
							}
							const rows = Array.isArray(body.symbols) ? body.symbols : [];
							const nextFlash = {};
							for (const row of rows) {
								const before = previous.current[row.symbol];
								if (typeof before === "number" && typeof row.price === "number" && before !== row.price) {
									nextFlash[row.symbol] = row.price > before ? "up" : "down";
								}
								if (typeof row.price === "number") previous.current[row.symbol] = row.price;
							}
							// 宿主配置的刷新间隔（秒）优先于内置默认值。
							if (typeof body.schedule === "number" && body.schedule >= 5) {
								intervalRef.current = body.schedule * 1000;
							}
							setFlash(nextFlash);
							setSnapshot({
								phase: "ready",
								rows,
								source: body.source,
								updatedAt: body.updatedAt,
								degraded: body.degraded === true,
							});
						})
						.catch((error) => {
							if (!alive) return;
							setSnapshot({ phase: "error", message: String((error && error.message) || error) });
						});
				};
				run(tick > 0);
				// 定时器读 ref，所以 schedule 变了也不必重建。
				const timer = setInterval(() => { run(false) }, intervalRef.current);
				return () => { alive = false; clearInterval(timer) };
			}, [tick]);
```

</details>

**依据 3 · 作者声明**：[README.md:192-202](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/README.md#L192-L202)

作者局限和行情仅个人参考说明。

<details>
<summary>查看原文（11行）</summary>

```text
## 已知限制

- 只在 **web / desktop 的 Web GUI** 显示；headless、sdk、acp 等没有侧边栏的 profile 装上也不可见。
- 若只有 CoinGecko 可用（免费层无 K 线），走势图退化为「本次会话内的实时读数」曲线，冷启动时点数很少。
- 界面文案是中文硬编码，未接入 DSH 的 locale 字典（树外插件不走 `verify-client-ui-i18n`）。
- 只支持 `http://` 代理。
- 桌面端重建 profile（应用资源变化或「重置 Desktop」）会清掉 `plugins` 目录与 patch 行；用方式一安装则表现为依赖丢失，重装即可。

## 许可

MIT。行情数据版权归各交易所所有，仅供个人参考，不构成投资建议。
```

</details>

#### 缺口

- 真实市场数据延迟、GUI stale 呈现与当前安装兼容未核
  **影响：**不能推荐资金交易用途或量化可靠性
  **进一步探讨：**用受控模拟与当前官方行情对照，再作小范围非交易试用

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
