# dsh-stock-quotes

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b400f6f](https://github.com/AhaCrazy/dsh-stock-quotes/tree/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH 中展示股票观察列表和行情，并向模型提供 stock_quote 查询工具。

> **核心亮点**：相对让模型凭记忆报价，增量在结构化公共数据工具和面板，明确缺失项、市场和参考时间；主要是成熟行情接口集成，没有独立数据源或准确性验证贡献。[Q01](#research-q01)

> **风险与缺陷**：asOf在请求发起前取本机时间，不是交易所行情时间；裸六位代码尝试多个市场且首个命中即用，可能选中与用户意图不同标的，不能据显示时间和数字判断实时准确。[Q03](#research-q03)

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
  - [Q01 · 报价工具比模型直接回答增加什么？](#detail-section-11)
  - [Q02 · 不同代码怎样变成一个批请求？](#detail-section-12)
  - [Q03 · 为什么请求时间和裸码歧义最影响可信度？](#detail-section-13)
  - [Q04 · 什么试用方式最可控？](#detail-section-14)
  - [Q05 · 显式市场确认和双时间能否降低误用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望在DSH旁查看公开行情的用户；合格结果是代码、市场、字段和时间含义清楚的参考报价，而非交易执行或投资结论。

专业行情终端或浏览器网页数据更完整；本组件让DSH会话直接读结构化公开报价，便利取决于用户是否确有侧看需求。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| stock_quote | 把公开行情交给模型 | 需明确市场，unresolved不能补猜 |
| 观察列表面板 | 侧看批量标的 | 外部API可用性与数据延迟未知 |
| 失败状态与旧值 | 避免失败时静默清空 | 旧值仍可能误解，需核对来源时间 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools及Web | 对应入口必需 | 模型工具和面板 | 入口不能假定可用 |
| 东方财富公开接口可达 | 行情必需 | 批量数据 | 超时/错误明确返回；UI可能保留旧值 |
| 明确市场及代码 | 正确查询必需 | 标的定位 | 裸码候选有歧义，建议显式前后缀 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 加载插件并填写带市场代码观察列表 | 名称和市场与预期一致 |
| 2 | 工具或面板查询 | 核对unresolved、source和时间口径 |
| 3 | 失败/旧值时用原行情源核对 | 不把保留值或本机时间当实时证据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地插件与网络 | 核对市场代码及列表 | 无实测安装耗时 |
| 持续使用 | 批量接口和UI刷新资源；费用未知 | 复核标的和异常数据 | 无服务SLA或价格保证依据 |
| 失败恢复 | 超时/重试网络 | 区分旧值、未解析项与接口故障 | 本机asOf不是源时间 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型结构化报价 | 工具返回规范字段与unresolved | 数据准确、延迟和跨市场完整性 |
| 侧看观察列表 | 失败保留旧值并标状态 | 用户是否正确理解新鲜度 |

> **思考**：asOf在请求发起前取本机时间，不是交易所行情时间；裸六位代码尝试多个市场且首个命中即用，可能选中与用户意图不同标的，不能据显示时间和数字判断实时准确。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对让模型凭记忆报价，增量在结构化公共数据工具和面板，明确缺失项、市场和参考时间；主要是成熟行情接口集成，没有独立数据源或准确性验证贡献。[Q01](#research-q01)

相对让模型凭记忆报价，增量在结构化公共数据工具和面板，明确缺失项、市场和参考时间；主要是成熟行情接口集成，没有独立数据源或准确性验证贡献。[Q01](#research-q01)

独立行情模块有利测试与复用，数字缺失使用undefined不强填0，批请求减少往返；但Host和Client复制解析规则增加漂移风险。适合借鉴结构化数据与缺失表达，不应复用本机时间标签作为金融数据时效凭据。

<a id="detail-section-5"></a>

### 1.4 主要限制

asOf在请求发起前取本机时间，不是交易所行情时间；裸六位代码尝试多个市场且首个命中即用，可能选中与用户意图不同标的，不能据显示时间和数字判断实时准确。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

可当公开行情参考面板试用，优先使用明确市场代码。每次核对标的与旧值状态，重要数据到原行情源确认，不能将本机请求时间当行情发生时间。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、quotes.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查代码解析、Host工具结构、行情数据与UI过期状态；未联网查询行情、不验证价格或提供投资建议。
- 下一步：用固定代码/市场样本和可信源核对映射、币种、时间及缺失字段，故障下检查stale提示；未执行任何行情或投资判断。

**分析版本**

- **仓库**：[AhaCrazy/dsh-stock-quotes](https://github.com/AhaCrazy/dsh-stock-quotes)
- **版本号**：2.0.1（[固定提交 b400f6f](https://github.com/AhaCrazy/dsh-stock-quotes/tree/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是对歧义代码要求显式市场确认，并分开请求时间与来源报价时间，可减少错标的和新鲜度误解；比较查询集的错配与确认负担，若误配不降则否定。[Q05](#research-q05)

用固定代码/市场样本和可信源核对映射、币种、时间及缺失字段，故障下检查stale提示；未执行任何行情或投资判断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 943 | — | — | 8954 |
| .js | source | 4 | 3136 | 2529 | 439 | — |
| .mjs | source | 1 | 104 | 81 | 13 | — |
| .mjs | test | 4 | 703 | 601 | 42 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AhaCrazy/dsh-stock-quotes/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：AhaCrazy/dsh-stock-quotes 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 报价工具比模型直接回答增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

模型不应凭训练记忆生成当前价格。这里通过公开行情源取结构化结果，并把unresolved单列，面板也可显示观察列表。合格输出必须指明代码与市场、缺失字段和时间含义；不是交易建议。相对专业行情终端，插件主要减少在DSH中复制资料，未证明数据更准确或用户决策更好。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:29-38](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/index.js#L29-L38)

工具说明要求只报告返回价格。

<details>
<summary>查看原文（10行）</summary>

```text
/** Short spelling reminder for the result text; the full help rides the tool description. */
const SYMBOL_HINT = '示例：600519 / sh600519 / 00700 / AAPL';

const DESCRIPTION = [
  'Read the latest market quote (price, change, percentage, open/high/low, previous close, turnover)',
  'for one or more listed securities: Chinese A-shares, Hong Kong and US stocks.',
  'Call it with the symbols the user named; call it with no arguments for the configured watchlist.',
  SYMBOL_HELP,
  'Never guess a price: report only what this tool returns.',
].join(' ');
```

</details>

**依据 2 · 源码核查**：[quotes.js:247-261](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/quotes.js#L247-L261)

按请求归并并保留未解析项。

<details>
<summary>查看原文（15行）</summary>

```text
  const diff = payload?.data?.diff;
  const rows = Array.isArray(diff) ? diff : diff === undefined || diff === null ? [] : [diff];
  const bySecid = new Map(rows.map((row) => [`${row.f13}.${row.f12}`, row]));

  const quotes = [];
  const unresolved = [];
  for (let index = 0; index < list.length; index++) {
    const row = plan[index].map((secid) => bySecid.get(secid)).find((hit) => hit !== undefined);
    if (row === undefined) {
      unresolved.push(list[index]);
      continue;
    }
    quotes.push({ ...toQuote(row), symbol: list[index] });
  }
  return { quotes, unresolved, asOf };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 不同代码怎样变成一个批请求？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

candidateSecids把前缀/后缀、裸六位、港股短码和美国ticker转换为候选secid，再合并去重一次请求。每个输入取第一个返回行，数值缺失转undefined，避免伪造零。请求有AbortController和默认10秒超时。工具和客户端都各有实现，正常路径清楚但两份逻辑需同步，不能把无密钥等同长期可用服务承诺。

#### 证据与依据

**依据 1 · 源码核查**：[quotes.js:78-114](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/quotes.js#L78-L114)

代码到市场候选规则。

<details>
<summary>查看原文（37行）</summary>

```text
export function candidateSecids(input) {
  if (typeof input !== 'string') return [];
  const raw = input.trim();
  if (raw === '') return [];

  // Suffix notation: `600519.SH`, `000001.SZ`, `00700.HK`, `AAPL.US`, `AAPL.O`.
  const suffixed = /^([^.-]+)[.-]([A-Za-z]{1,2})$/.exec(raw);
  if (suffixed !== null) {
    const market = SUFFIX_MARKETS[suffixed[2].toUpperCase()];
    const body = suffixed[1].trim().toUpperCase();
    if (market !== undefined && body !== '') return secidsForMarket(market, body);
  }

  // Already a secid, e.g. `1.600519` (a market id of at most three digits).
  if (/^\d{1,3}\.[A-Za-z0-9._-]+$/.test(raw)) return [raw];

  const prefixed = /^(sh|sz|bj|hk|us|nasdaq|nyse)[.:_-]?(.+)$/i.exec(raw);
  const prefix = prefixed === null ? '' : prefixed[1].toLowerCase();
  const body = (prefixed === null ? raw : prefixed[2]).trim().toUpperCase();
  if (body === '') return [];

  if (prefix === 'nasdaq' || prefix === 'nyse') return secidsForMarket('us', body);
  if (prefix !== '') return secidsForMarket(prefix, body);

  if (/^\d{6}$/.test(body)) {
    // 92xxxx are Beijing codes that start with 9; every other 4/8/0/1/2/3 code is
    // Shenzhen or Beijing on market 0, and 5/6/9 are Shanghai. Try the likely
    // market first, then the other one, so index codes such as `000300` still work.
    const primary = /^92\d{4}$/.test(body) ? 'sz' : (/^[569]/.test(body) ? 'sh' : 'sz');
    const secondary = primary === 'sh' ? 'sz' : 'sh';
    return [...secidsForMarket(primary, body), ...secidsForMarket(secondary, body)];
  }
  if (/^\d{1,5}$/.test(body)) return secidsForMarket('hk', body);
  // Eastmoney boards (板块) live on market 90: `BK1036` is the 半导体 board.
  if (/^BK\d+$/.test(body)) return [`90.${body}`];
  if (/^[A-Z][A-Z0-9.-]*$/.test(body)) return secidsForMarket('us', body);
  return [];
```

</details>

**依据 2 · 源码核查**：[quotes.js:206-225](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/quotes.js#L206-L225)

去重、请求时间和取消。

<details>
<summary>查看原文（20行）</summary>

```text
export async function fetchQuotes(inputs, options = {}) {
  const { signal, timeoutMs = 10000, fetchImpl = globalThis.fetch } = options;
  const list = (Array.isArray(inputs) ? inputs : [inputs])
    .map((entry) => String(entry ?? '').trim())
    .filter((entry) => entry !== '');

  const plan = list.map(candidateSecids);
  const secids = [];
  for (const group of plan) {
    for (const secid of group) if (!secids.includes(secid)) secids.push(secid);
  }

  const asOf = new Date().toISOString();
  if (secids.length === 0) return { quotes: [], unresolved: list, asOf };

  const controller = new AbortController();
  const abortFromParent = () => controller.abort(signal?.reason);
  if (signal !== undefined) {
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener('abort', abortFromParent, { once: true });
```

</details>

**依据 3 · 源码核查**：[quotes.js:232-261](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/quotes.js#L232-L261)

批请求与首个命中映射。

<details>
<summary>查看原文（30行）</summary>

```text
  let payload;
  try {
    const url = `${BATCH_ENDPOINT}?secids=${encodeURIComponent(secids.join(','))}`
      + `&fields=${BATCH_FIELDS}&invt=2&fltt=2&_=${Date.now()}`;
    const response = await fetchImpl(url, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`quote endpoint answered HTTP ${response.status}`);
    payload = await response.json();
  } finally {
    clearTimeout(timer);
    if (signal !== undefined) signal.removeEventListener('abort', abortFromParent);
  }

  const diff = payload?.data?.diff;
  const rows = Array.isArray(diff) ? diff : diff === undefined || diff === null ? [] : [diff];
  const bySecid = new Map(rows.map((row) => [`${row.f13}.${row.f12}`, row]));

  const quotes = [];
  const unresolved = [];
  for (let index = 0; index < list.length; index++) {
    const row = plan[index].map((secid) => bySecid.get(secid)).find((hit) => hit !== undefined);
    if (row === undefined) {
      unresolved.push(list[index]);
      continue;
    }
    quotes.push({ ...toQuote(row), symbol: list[index] });
  }
  return { quotes, unresolved, asOf };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么请求时间和裸码歧义最影响可信度？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

asOf在发请求前以new Date生成，并没有解析源报价时间，不能证明价格是此刻成交或更新。六位裸码在两个市场候选中首个返回就取用，遇到同码指数/股票时用户意图可能错配。UI失败保留最后行情并设stale，优点是不中断阅读，但用户仍须看状态。上述风险是静态机制判断，本轮没有复现错误报价。

#### 证据与依据

**依据 1 · 源码核查**：[quotes.js:102-108](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/quotes.js#L102-L108)

两市场候选造成需要确认的歧义。

```text
  if (/^\d{6}$/.test(body)) {
    // 92xxxx are Beijing codes that start with 9; every other 4/8/0/1/2/3 code is
    // Shenzhen or Beijing on market 0, and 5/6/9 are Shanghai. Try the likely
    // market first, then the other one, so index codes such as `000300` still work.
    const primary = /^92\d{4}$/.test(body) ? 'sz' : (/^[569]/.test(body) ? 'sh' : 'sz');
    const secondary = primary === 'sh' ? 'sz' : 'sh';
    return [...secidsForMarket(primary, body), ...secidsForMarket(secondary, body)];
```

**依据 2 · 源码核查**：[quotes.js:218-219](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/quotes.js#L218-L219)

asOf是本机调用时间。

```text
  const asOf = new Date().toISOString();
  if (secids.length === 0) return { quotes: [], unresolved: list, asOf };
```

**依据 3 · 源码核查**：[client.js:1242-1255](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/client.js#L1242-L1255)

失败保留旧值和stale标记。

<details>
<summary>查看原文（14行）</summary>

```text
          const result = await fetchQuotes(list, signal ? { signal } : undefined);
          if (signal && signal.aborted) return true;
          setView({ status: 'ready', quotes: result.quotes, updatedAt: Date.now(), error: '' });
          return true;
        } catch (error) {
          if (signal && signal.aborted) return true;
          // A failed tick keeps the last good quotes on screen and reports the
          // failure in a strip; blanking the table would be worse than stale data.
          setView((previous) => ({
            ...previous,
            status: previous.quotes.length > 0 ? 'stale' : 'error',
            error: describeError(error),
          }));
          return false;
```

</details>

#### 缺口

- 报价源时间、市场映射准确率和延迟未知
  **影响**：不能宣称实时准确
  **进一步探讨**：用歧义代码及带市场代码对照可信行情源时间与名称。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么试用方式最可控？

**研究主题**：效果与总成本、采用判断

#### 完整回答

只作参考查询，先使用明确市场的代码并核对名称；未解析项保留，不由模型猜补。主要成本是外部网络、刷新和人工核对，未有费用或耗时测量；批量请求仅减少传输次数，不能推出数据质量。已有专业终端的人可只用插件搬运上下文，关键数值和时效仍回源确认。

#### 证据与依据

**依据 1 · 源码核查**：[quotes.js:30-34](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/quotes.js#L30-L34)

作者说明支持代码及不解析中文名。

```text
export const SYMBOL_HELP =
  'Accepted symbol spellings: A-share `600519`, `sh600519`, `sz000001`, `bj430047`, `600519.SH`, `000001.SZ`; '
  + 'Hong Kong `00700`, `hk00700`, `00700.HK`; US `AAPL`, `usAAPL`, `AAPL.US`; '
  + 'or a raw Eastmoney secid such as `1.600519`. A bare 1-5 digit number is read as Hong Kong, '
  + 'and Eastmoney boards use `BK1036`. Chinese names are not resolved by this tool; pass a code.';
```

**依据 2 · 源码核查**：[quotes.js:247-261](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/quotes.js#L247-L261)

未解析项和时间返回。

<details>
<summary>查看原文（15行）</summary>

```text
  const diff = payload?.data?.diff;
  const rows = Array.isArray(diff) ? diff : diff === undefined || diff === null ? [] : [diff];
  const bySecid = new Map(rows.map((row) => [`${row.f13}.${row.f12}`, row]));

  const quotes = [];
  const unresolved = [];
  for (let index = 0; index < list.length; index++) {
    const row = plan[index].map((secid) => bySecid.get(secid)).find((hit) => hit !== undefined);
    if (row === undefined) {
      unresolved.push(list[index]);
      continue;
    }
    quotes.push({ ...toQuote(row), symbol: list[index] });
  }
  return { quotes, unresolved, asOf };
```

</details>

#### 缺口

- 对话查价的净时间收益未知
  **影响**：不能量化采用价值
  **进一步探讨**：对照直接复制行情与工具查询的正确率和总核对耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显式市场确认和双时间能否降低误用？

**研究主题**：新假设与验证

#### 完整回答

未验证设计要求歧义代码先确认市场，展示请求时间并在来源提供时另列报价时间，来源缺失就明确未知。当前候选规则与本机asOf是直接参照。以含同码指数/股票、停牌和闭市样本做对照，比较错标的、错误新鲜度判断和确认步骤；若正确率无改善或确认负担过高，应保留轻量默认并收窄声明。

#### 证据与依据

**依据 1 · 源码核查**：[quotes.js:102-108](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/quotes.js#L102-L108)

市场确认的机制基础。

```text
  if (/^\d{6}$/.test(body)) {
    // 92xxxx are Beijing codes that start with 9; every other 4/8/0/1/2/3 code is
    // Shenzhen or Beijing on market 0, and 5/6/9 are Shanghai. Try the likely
    // market first, then the other one, so index codes such as `000300` still work.
    const primary = /^92\d{4}$/.test(body) ? 'sz' : (/^[569]/.test(body) ? 'sh' : 'sz');
    const secondary = primary === 'sh' ? 'sz' : 'sh';
    return [...secidsForMarket(primary, body), ...secidsForMarket(secondary, body)];
```

**依据 2 · 源码核查**：[quotes.js:218-219](https://github.com/AhaCrazy/dsh-stock-quotes/blob/b400f6fbe8771e8baa18fe9fd6e4bb48733ff779/quotes.js#L218-L219)

双时间设计的参照。

```text
  const asOf = new Date().toISOString();
  if (secids.length === 0) return { quotes: [], unresolved: list, asOf };
```

#### 缺口

- 来源时间可得性和用户理解改善未验证
  **影响**：不属于当前报价能力
  **进一步探讨**：先做离线样本界面对照，再决定是否修改协议。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
