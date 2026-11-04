# dsh-stock-quotes

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[80d5f88](https://github.com/AhaCrazy/dsh-stock-quotes/tree/80d5f885b9dda54961d8e0814c26c538cab73630)

<!-- BEGIN META -->
[![npm 30d 331](https://img.shields.io/static/v1?label=npm+30d&message=331&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-stock-quotes) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-stock-quotes)
<!-- END META -->

> **功能**：在 DSH 侧栏及对话工具中查看公开股票和板块行情。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把公开行情批量查询结果结构化接入 Agent 和侧栏，保留缺失字段和未解析项；不证明价格准确或实时。

> **主要限制**：[Q03](#research-q03) 的歧义代码采用首个命中，asOf 与客户端时间均取本机而非行情发生时间；不能仅凭显示价格和时间判断实时性或交易所。

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
  - [Q01 · 该插件提供什么参考入口，相比直接查看行情网站有何增量？](#detail-section-11)
  - [Q02 · 标的如何映射并取回数据，失败及空结果怎样表示？](#detail-section-12)
  - [Q03 · 代码歧义、时点与曲线来源怎样影响解释？](#detail-section-13)
  - [Q04 · 使用者需要承担什么成本，何时应停止依赖面板结果？](#detail-section-14)
  - [Q05 · 强制消歧并区分数据源时点是否能减少误解？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 DSH 界面查看公开行情的用户可用侧栏和模型工具作为参考入口，见 [Q01](#research-q01)。

相比直接查询行情网站或专用软件，插件整合 DSH 界面，不拥有独立行情源或交易能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| stock_quote | 查询一组标的的结构化参考报价 | 依赖公开接口；本机请求时间不是行情时间 |
| 自选面板 | 在侧栏查看和管理列表 | 浏览器本地存储；失败保留旧价并显示错误 |
| 名称建议 | 按名称或代码选择标的 | 外部索引或缓存可能过期 |
| 趋势曲线 | 展示行情源提供的时间序列 | 单独发起网络请求，数据覆盖和时效未知 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配的 Node 与 DSH Host | 工具必需 | 注册 stock_quote | 兼容未实测 |
| DSH Web 与 slots | 面板必需 | 侧栏、设置与显示 | 无法使用面板 |
| 东方财富公开端点及网络 | 行情必需 | 查询报价与趋势 | 请求失败或无数据，旧值不可视为新报价 |
| CDN 或缓存索引 | 名称建议条件 | 将名称映射到代码 | 索引不可用时建议可能缺失或过期 |
| 浏览器 localStorage | 列表持久化条件 | 保存自选与设置 | 不可写时可能无法保留 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户检查宿主兼容与数据源条款 | 选用可确认市场的代码 |
| 查询 | 用户在面板或对话中请求 | 返回名称、市场和字段符合目标 |
| 核对 | 用户检查错误、缺失及来源时间 | 无可靠时点或标的不符时停止依赖 |
| 恢复 | 用户转到合适行情来源 | 独立核对行情与具体用途 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 数据服务费用和权限未知 | 配置宿主及自选 | 未测安装耗时 |
| 持续使用 | 报价、趋势和索引网络资源未知 | 核对市场、时点和来源 | 服务 SLA 与调用限制未知 |
| 失败恢复 | 重试与替代查询资源未知 | 区分旧值、错误与未解析项 | 源数据时间不能由本机时间代替 |
| 退出 | 本地列表残留未知 | 按需导出或删除列表 | 存储受浏览器环境影响 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构化查询 | 批量请求及未解析项 | 准确率和延迟 |
| 侧栏观察 | 自动刷新与错误显示源码 | 实际宿主渲染与用户理解 |
| 名称建议与曲线 | 索引和趋势端点接线 | 来源时效和覆盖 |

> **思考**：[Q03](#research-q03) 的歧义代码采用首个命中，asOf 与客户端时间均取本机而非行情发生时间；不能仅凭显示价格和时间判断实时性或交易所。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把公开行情批量查询结果结构化接入 Agent 和侧栏，保留缺失字段和未解析项；不证明价格准确或实时。

[Q02](#research-q02) 区分缺失数值和零、批量查询并保留失败状态；[Q03](#research-q03) 两份解析实现和本机时间标签仍需谨慎维护。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的歧义代码采用首个命中，asOf 与客户端时间均取本机而非行情发生时间；不能仅凭显示价格和时间判断实时性或交易所。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 将结果作为公开数据参考，明确市场并核对名称、错误与实际来源时点；重要用途回到合适数据来源核实。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持公开行情工具、面板接线及失败处理；报价准确性、时效和数据服务条款未验证。候选确认属于未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、quotes.js、client.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 Host 工具、标的映射和批量请求，Client 面板、索引、趋势与刷新代表路径；未审全部交互，也未验证服务或行情。
- 下一步：用合成接口响应核对歧义代码、缺失字段、失败和慢请求，再在授权环境与数据源核对时点；本次未运行目标代码、测试、真实宿主或行情请求。

**分析版本**

- **仓库**：[AhaCrazy/dsh-stock-quotes](https://github.com/AhaCrazy/dsh-stock-quotes)
- **版本号**：2.0.2（[固定提交 80d5f88](https://github.com/AhaCrazy/dsh-stock-quotes/tree/80d5f885b9dda54961d8e0814c26c538cab73630)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设显式市场候选确认并区分来源报价时间，可减少错选与时效误读；尚未实现或验证。

用合成接口响应核对歧义代码、缺失字段、失败和慢请求，再在授权环境与数据源核对时点；本次未运行目标代码、测试、真实宿主或行情请求。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1220 | — | — | 10967 |
| .js | source | 4 | 3138 | 2530 | 441 | — |
| .mjs | source | 2 | 142 | 103 | 24 | — |
| .mjs | test | 4 | 703 | 601 | 42 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AhaCrazy/dsh-stock-quotes/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AhaCrazy/dsh-stock-quotes/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)

暂未获取：近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对行情查询、标的映射和时间边界，界定可参考的使用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 该插件提供什么参考入口，相比直接查看行情网站有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望在 DSH 对话旁查阅公开行情的用户，可使用侧栏列表查看自选，并让 Agent 调用 stock_quote 查询标的。Host 将工具注册到宿主，Client 注册面板及设置入口；它把公开数据接到当前会话和侧栏，但没有独立交易所数据、交易执行或准确性验证。相比切换行情网页，它可在同一界面查看和把结构化报价交给模型；来源、延迟与标的仍须核对，作者也把数据限定为延时或快照参考，不可据此推断交易实时性。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-16](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/README.md#L10-L16)

作者描述用途并将数据限定为参考快照。

```text
一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件：在侧边栏数据面板里显示**自选股实时行情**，同时注册 `stock_quote` 工具，让 Agent 能在对话里直接回答"茅台现在多少钱"这类问题。

- **面板**：A 股 / 港股 / 美股自选股一张表 —— 最新价、涨跌额、涨跌幅、今开 / 最高 / 最低、成交额；15 秒自动刷新；右键菜单、拖拽排序、多选批量操作。
- **工具**：`stock_quote` 一次批量取回一只或多只行情（不带参数时用配置里的默认自选股）。
- **外观中性**：侧边栏默认叫「数据」、图标是普通表格样式，显示名称可配置 —— 看起来像通用数据视图，而不是行情软件。

> 行情来自公开接口的**延时/快照数据**，仅供查看，**不构成任何投资建议**，不用于交易决策。
```

**依据 2 · 源码核查**：[index.js:123-146](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/index.js#L123-L146)

工具定义和 Host 请求接线。

<details>
<summary>查看原文（24行）</summary>

```text
export function buildToolDefinition(defaultSymbols = FALLBACK_SYMBOLS) {
  return {
    name: 'stock_quote',
    description: DESCRIPTION,
    parameters: PARAMETERS,
    output: {
      schema: OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: renderQuotes(value) }],
    },
    isConcurrencySafe: () => true,
    presentCall(args) {
      const raw = args === null || typeof args !== 'object' ? undefined : args.symbols;
      const list = typeof raw === 'string' ? [raw] : Array.isArray(raw) ? raw : [];
      const shown = list.filter((entry) => typeof entry === 'string');
      return {
        card: 'generic',
        title: shown.length > 0 ? `查询行情 ${shown.join(' ')}` : '查询自选股行情',
        kind: 'fetch',
      };
    },
    async execute(args, exec) {
      const result = await fetchQuotes(requestedSymbols(args, defaultSymbols), { signal: exec?.signal });
      return { ...result, source: SOURCE };
    },
```

</details>

**依据 3 · 源码核查**：[index.js:238-247](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/index.js#L238-L247)

Host 在 tools 服务注册工具。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Register the `stock_quote` tool on the profile.
 * @param ctx - the plugin's Host context.
 * @param config - the row's config, whose `defaultSymbols` seeds the watchlist.
 */
export function apply(ctx, config = {}) {
  const configured = config !== null && typeof config === 'object' && Array.isArray(config.defaultSymbols)
    ? config.defaultSymbols.filter((entry) => typeof entry === 'string' && entry.trim() !== '')
    : [];
  ctx.tools.register(buildToolDefinition(configured.length > 0 ? configured : FALLBACK_SYMBOLS));
```

</details>

**依据 4 · 源码核查**：[client.js:2471-2495](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/client.js#L2471-L2495)

Client 注册主面板、配置及侧栏入口。

<details>
<summary>查看原文（25行）</summary>

```text
      const t = ctx.locale.bind(NS);
      /** Re-read on every projection by the sidebar, so a rename needs no reload. */
      const currentName = () => displayName(t);

      ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main',
        key: PANEL_ID,
        locale: NS,
      }, StockQuotesPage));

      // The bundle's own page is where "this plugin's settings" is looked for, so
      // the same control also renders there (keyed by the package name).
      ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
        name: 'plugins.bundle.config',
        key: PKG,
        locale: NS,
      }, BundleSettingsCard));

      const registerIcon = () => ctx.slots.register({
        name: 'sidebar.panellist',
        id: PANEL_ID,
        order: 30,
        label: currentName,
        locale: NS,
      }, PanelIcon);
```

</details>

#### 缺口

- 未验证实际宿主显示、数据准确性或用户节时
  **影响**：不能说明实时准确或节省操作成本
  **进一步探讨**：在隔离宿主与权威数据源按相同标的核对名称、市场、字段和报价时点。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 标的如何映射并取回数据，失败及空结果怎样表示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 将输入展开为候选市场代码、去重后向东方财富批量端点发请求；按每个输入的候选顺序取首个返回项，找不到的进入 unresolved，数字缺失则省略而不是写零。Host 默认超时 10 秒并结合调用方取消，HTTP 错误向上抛出；无代码或空数组时工具改用 Host 配置默认列表。浏览器有独立的一份解析与批请求实现，列表保存在 localStorage，初次及列表变化时发请求；失败保留上一批报价、显示错误条并进行退避，成功但部分未返回时行显示未找到。两份解析代码需同步维护，不能将结构化输出视为数据准确保证。

#### 证据与依据

**依据 1 · 源码核查**：[quotes.js:78-114](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L78-L114)

将输入展开为候选 secid。

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

**依据 2 · 源码核查**：[quotes.js:118-128](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L118-L128)

无效数字保持缺失。

<details>
<summary>查看原文（11行）</summary>

```text
 * Coerce a quote field into a finite number.
 * @param value - raw field value; Eastmoney uses `"-"` for "not applicable".
 * @returns The number, or undefined when the field carries no value.
 */
export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
```

</details>

**依据 3 · 源码核查**：[quotes.js:206-245](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L206-L245)

请求计划、请求前时间和超时取消。

<details>
<summary>查看原文（40行）</summary>

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
  }
  const timer = setTimeout(
    () => controller.abort(new Error(`stock quote request timed out after ${timeoutMs}ms`)),
    timeoutMs,
  );

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
```

</details>

**依据 4 · 源码核查**：[quotes.js:247-261](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L247-L261)

按候选顺序选择返回项并收集 unresolved。

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

**依据 5 · 源码核查**：[index.js:105-111](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/index.js#L105-L111)

缺少有效输入回退配置列表。

```text
function requestedSymbols(args, defaultSymbols) {
  const raw = args === null || typeof args !== 'object' ? undefined : args.symbols;
  const list = typeof raw === 'string' ? [raw] : Array.isArray(raw) ? raw : [];
  const wanted = list
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter((entry) => entry !== '');
  return wanted.length > 0 ? wanted : defaultSymbols;
```

**依据 6 · 源码核查**：[client.js:877-927](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/client.js#L877-L927)

浏览器独立批量请求与候选选择。

<details>
<summary>查看原文（51行）</summary>

```text
    /** One requested batch, resolved back onto the requested spellings. */
    async function fetchQuotes(inputs, options) {
      const { signal } = options || {};
      const list = (Array.isArray(inputs) ? inputs : [inputs])
        .map((entry) => String(entry === undefined || entry === null ? '' : entry).trim())
        .filter((entry) => entry !== '');
      const plan = list.map(candidateSecids);
      const secids = [];
      for (const group of plan) {
        for (const secid of group) if (secids.indexOf(secid) === -1) secids.push(secid);
      }
      if (secids.length === 0) return { quotes: [], unresolved: list };

      const url = `${BATCH_ENDPOINT}?secids=${encodeURIComponent(secids.join(','))}`
        + `&fields=${BATCH_FIELDS}&invt=2&fltt=2&_=${Date.now()}`;
      const response = await fetch(url, { signal, cache: 'no-store', headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();

      const diff = payload && payload.data ? payload.data.diff : undefined;
      const rows = Array.isArray(diff) ? diff : diff === undefined || diff === null ? [] : [diff];
      const bySecid = new Map();
      for (const row of rows) bySecid.set(`${row.f13}.${row.f12}`, row);

      const quotes = [];
      const unresolved = [];
      for (let index = 0; index < list.length; index++) {
        let row;
        for (const secid of plan[index]) {
          const hit = bySecid.get(secid);
          if (hit !== undefined) { row = hit; break; }
        }
        if (row === undefined) { unresolved.push(list[index]); continue; }
        const code = row.f12 === undefined || row.f12 === null ? '' : String(row.f12);
        quotes.push({
          symbol: list[index],
          code,
          name: typeof row.f14 === 'string' ? row.f14 : '',
          market: marketName(row.f13, code),
          price: toNumber(row.f2),
          changePct: toNumber(row.f3),
          change: toNumber(row.f4),
          high: toNumber(row.f15),
          low: toNumber(row.f16),
          open: toNumber(row.f17),
          preClose: toNumber(row.f18),
          volume: toNumber(row.f5),
          amount: toNumber(row.f6),
        });
      }
      return { quotes, unresolved };
```

</details>

**依据 7 · 源码核查**：[client.js:1237-1257](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/client.js#L1237-L1257)

成功替换列表，失败保留旧值和错误。

<details>
<summary>查看原文（21行）</summary>

```text
      const runRefresh = React.useCallback(async (signal) => {
        const list = symbolsRef.current;
        if (list.length === 0) {
          setView({ status: 'ready', quotes: [], updatedAt: Date.now(), error: '' });
          return true;
        }
        try {
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

**依据 8 · 源码核查**：[client.js:1282-1301](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/client.js#L1282-L1301)

刷新失败后退避。

<details>
<summary>查看原文（20行）</summary>

```text
      // Auto refresh with backoff: consecutive failures stretch the interval up to
      // two minutes instead of hammering an endpoint that is already unhappy.
      React.useEffect(() => {
        if (!auto) return undefined;
        let cancelled = false;
        let timer = null;
        const tick = async () => {
          if (cancelled) return;
          if (document.visibilityState !== 'hidden') {
            const ok = await runRefresh();
            failuresRef.current = ok ? 0 : Math.min(failuresRef.current + 1, 3);
          }
          if (cancelled) return;
          timer = window.setTimeout(tick, Math.min(refreshMs * 2 ** failuresRef.current, 120000));
        };
        timer = window.setTimeout(tick, refreshMs);
        return () => {
          cancelled = true;
          if (timer !== null) window.clearTimeout(timer);
        };
```

</details>

#### 缺口

- 未运行 HTTP 超时、取消或浏览器渲染
  **影响**：不能保证具体宿主和数据源失败时的用户体验
  **进一步探讨**：在本地隔离宿主模拟空响应、HTTP 失败、部分返回和慢请求，观察显示及输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 代码歧义、时点与曲线来源怎样影响解释？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

裸六位代码按首位启发式生成两个市场候选，首个命中即用，因此必须核对返回名称和市场。上交所与深交所等明确前后缀可以限定对应候选，但 US、O、N 后缀及 nasdaq/nyse 前缀都会转成同一组三个美国市场候选，并未强制唯一交易所。Host 的 asOf 在 fetch 请求发出之前由本机时钟生成；请求字段未包含来源报价时间，所以它不能证明成交时间或实时性。客户端更新时间在成功返回后取本机时间，同样不是行情生成时点。曲线另向趋势端点请求，名称建议从外部 CDN 或 raw main 回退取得并在浏览器缓存；这些来源可失效或过期，且不是行情质量保证。

#### 证据与依据

**依据 1 · 源码核查**：[quotes.js:53-64](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L53-L64)

美国市场候选及后缀映射。

<details>
<summary>查看原文（12行）</summary>

```text
function secidsForMarket(market, body) {
  if (market === 'sh') return [`1.${body}`];
  if (market === 'sz' || market === 'bj') return [`0.${body}`];
  if (market === 'hk') return [`116.${hkCode(body)}`];
  if (market === 'us') return US_MARKETS.map((secidMarket) => `${secidMarket}.${body}`);
  return [];
}

/** Exchange suffixes seen in exports from 同花顺 / 通达信 / Yahoo. */
const SUFFIX_MARKETS = {
  SH: 'sh', SS: 'sh', SZ: 'sz', BJ: 'bj', HK: 'hk', US: 'us', O: 'us', N: 'us', A: 'us',
};
```

</details>

**依据 2 · 源码核查**：[quotes.js:83-113](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L83-L113)

前后缀和裸六位代码候选逻辑。

<details>
<summary>查看原文（31行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[quotes.js:206-219](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L206-L219)

asOf 在请求之前生成。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[quotes.js:20-24](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L20-L24)

请求的字段没有行情时间字段。

```text
 * Requested fields: f12 code, f13 market, f14 name, f2 price, f3 change pct,
 * f4 change amount, f5 volume (lots), f6 turnover, f15 high, f16 low, f17 open,
 * f18 previous close, f20 total market cap, f21 float market cap.
 */
const BATCH_FIELDS = 'f12,f13,f14,f2,f3,f4,f5,f6,f15,f16,f17,f18,f20,f21';
```

**依据 5 · 源码核查**：[client.js:1237-1247](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/client.js#L1237-L1247)

客户端成功后记录本机更新时间。

<details>
<summary>查看原文（11行）</summary>

```text
      const runRefresh = React.useCallback(async (signal) => {
        const list = symbolsRef.current;
        if (list.length === 0) {
          setView({ status: 'ready', quotes: [], updatedAt: Date.now(), error: '' });
          return true;
        }
        try {
          const result = await fetchQuotes(list, signal ? { signal } : undefined);
          if (signal && signal.aborted) return true;
          setView({ status: 'ready', quotes: result.quotes, updatedAt: Date.now(), error: '' });
          return true;
```

</details>

**依据 6 · 源码核查**：[client.js:327-344](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/client.js#L327-L344)

建议索引从固定版本 CDN 和 raw main 回退。

<details>
<summary>查看原文（18行）</summary>

```text
     * Name search. No public search endpoint sends a CORS header, so the searchable
     * list is generated by `scripts/build-index.mjs`, committed to the repository and
     * served from a CDN: one request, cached in localStorage for a day.
     *
     * The CDN URLs are pinned to this release, not to `main`, so the bytes the panel
     * searches are the bytes that shipped with this version: the npm tarball first
     * (the plugin is distributed through the registry), then the git release tag, then
     * raw `main` as a fallback for a development checkout whose version is not
     * published yet. `tests/meta.test.mjs` keeps INDEX_VERSION equal to package.json.
     */
    const INDEX_VERSION = '2.0.2';
    const INDEX_URLS = [
      `https://cdn.jsdelivr.net/npm/dsh-stock-quotes@${INDEX_VERSION}/data/securities.json`,
      `https://cdn.jsdelivr.net/gh/AhaCrazy/dsh-stock-quotes@v${INDEX_VERSION}/data/securities.json`,
      'https://raw.githubusercontent.com/AhaCrazy/dsh-stock-quotes/main/data/securities.json',
    ];
    const INDEX_KEY = 'dsh-stock-quotes/index';
    const INDEX_TTL = 24 * 60 * 60 * 1000;
```

</details>

**依据 7 · 源码核查**：[client.js:413-436](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/client.js#L413-L436)

曲线独立请求趋势端点并按候选尝试。

<details>
<summary>查看原文（24行）</summary>

```text
    const TREND_ENDPOINT = 'https://push2his.eastmoney.com/api/qt/stock/trends2/get';

    /**
     * Intraday close series for one entry, trying each candidate market the
     * spelling allows. `close` is what the sparkline draws; `average` and `volume`
     * are what the focus chart reads out.
     * @param input - a watchlist spelling.
     * @param signal - optional abort signal.
     * @param days - 1 for today, 5 for the last five sessions.
     * @returns `{ day, t, v, vol, avg }` rows in chronological order; empty when
     *   nothing answers.
     */
    async function fetchTrend(input, signal, days = 1) {
      for (const secid of candidateSecids(input)) {
        try {
          const url = `${TREND_ENDPOINT}?secid=${encodeURIComponent(secid)}`
            + `&fields1=f1,f2&fields2=f51,f53,f56,f58&ndays=${days}&iscr=0&iscca=0&_=${Date.now()}`;
          const response = await fetch(url, { signal, cache: 'no-store', headers: { accept: 'application/json' } });
          if (!response.ok) continue;
          const payload = await response.json();
          const rows = payload !== null && payload !== undefined && payload.data
            ? payload.data.trends
            : undefined;
          if (!Array.isArray(rows) || rows.length === 0) continue;
```

</details>

#### 缺口

- 未验证行情源真实延迟、盘中停牌、跨市场单位与索引更新
  **影响**：不能据面板时间断言数据发生时刻或不同数据可直接比较
  **进一步探讨**：向数据源核对交易所、价格币种、源时间与行情延迟，并对同一代码在不同市场比较。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用者需要承担什么成本，何时应停止依赖面板结果？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需要兼容 DSH 的工具与 Web 槽位，并选择明确市场代码；Host 默认自选与浏览器本地自选各自维护。浏览器周期性请求公开行情与趋势，建议索引来自外部地址并保存在 localStorage，因此网络可用性、服务策略、请求量、浏览器存储和观察列表暴露于行情请求方都应纳入判断。失败时旧价保留并显示错误，不能把本机显示时间当作来源时间。用户可用它观察资料，但当代码与名称不符、字段缺失、出现错误或需要可靠时效时，应停止使用该结果并到合适的行情来源再次核实；数据仅供查看，不支持由本研究推导交易决策。现金费用、授权条款、调用限额及真实维护时间未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:18-20](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/package.json#L18-L20)

包声明 Node 与 DSH 的最低版本。

```text
  "engines": {
    "node": ">=20",
    "dsh": ">=0.2.0"
```

**依据 2 · 源码核查**：[cordis.patch.yml:7-19](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/cordis.patch.yml#L7-L19)

Host 默认列表与浏览器列表独立配置。

<details>
<summary>查看原文（13行）</summary>

```text
# `config.defaultSymbols` is the watchlist the tool falls back to when the model
# calls `stock_quote` without arguments. Edit this list (or override it in
# the profile's own patch layer) to change the defaults.
- insert:
    - id: stock-quotes
      name: 'dsh-stock-quotes'
      config:
        defaultSymbols:
          - sh000001
          - sh600519
          - sz300750
          - hk00700
          - usAAPL
```

</details>

**依据 3 · 源码核查**：[client.js:932-953](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/client.js#L932-L953)

浏览器读写本地自选列表。

<details>
<summary>查看原文（22行）</summary>

```text
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw !== null) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed
              .filter((entry) => typeof entry === 'string' && entry.trim() !== '')
              .map((entry) => entry.trim());
          }
        }
      } catch {
        /* A blocked or corrupt store falls back to the defaults. */
      }
      return DEFAULT_SYMBOLS.slice();
    }

    function writeWatchlist(list) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch {
        /* Persisting is a convenience; the page still works without it. */
      }
```

</details>

**依据 4 · 源码核查**：[client.js:890-894](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/client.js#L890-L894)

行情请求将候选 secid 放入远端 URL。

```text
      const url = `${BATCH_ENDPOINT}?secids=${encodeURIComponent(secids.join(','))}`
        + `&fields=${BATCH_FIELDS}&invt=2&fltt=2&_=${Date.now()}`;
      const response = await fetch(url, { signal, cache: 'no-store', headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
```

**依据 5 · 源码核查**：[client.js:1237-1256](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/client.js#L1237-L1256)

失败保留旧报价并设置错误。

<details>
<summary>查看原文（20行）</summary>

```text
      const runRefresh = React.useCallback(async (signal) => {
        const list = symbolsRef.current;
        if (list.length === 0) {
          setView({ status: 'ready', quotes: [], updatedAt: Date.now(), error: '' });
          return true;
        }
        try {
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
```

</details>

**依据 6 · 作者声明**：[README.md:10-16](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/README.md#L10-L16)

作者限制为公开延时或快照数据。

```text
一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件：在侧边栏数据面板里显示**自选股实时行情**，同时注册 `stock_quote` 工具，让 Agent 能在对话里直接回答"茅台现在多少钱"这类问题。

- **面板**：A 股 / 港股 / 美股自选股一张表 —— 最新价、涨跌额、涨跌幅、今开 / 最高 / 最低、成交额；15 秒自动刷新；右键菜单、拖拽排序、多选批量操作。
- **工具**：`stock_quote` 一次批量取回一只或多只行情（不带参数时用配置里的默认自选股）。
- **外观中性**：侧边栏默认叫「数据」、图标是普通表格样式，显示名称可配置 —— 看起来像通用数据视图，而不是行情软件。

> 行情来自公开接口的**延时/快照数据**，仅供查看，**不构成任何投资建议**，不用于交易决策。
```

#### 缺口

- 第三方服务权限、限流、费用和市场数据许可未核验
  **影响**：不能估算长期稳定性与完整成本
  **进一步探讨**：用户在采用前核对数据来源条款和本地网络环境，实测回退路径。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 强制消歧并区分数据源时点是否能减少误解？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：对于多候选代码先展示各市场和名称并要求用户确认，再把请求时间与可核验的数据源报价时间分开标注，可能减少选错标的和把请求时间当行情时间的情况。增量是明确用户确认与来源时点，不只是把原始输入和市场名放在结果中；前提是数据源确实提供可信时间，拿不到时应保持未知。可构造沪深同号、多个美国市场和无源时间的查询集，对比当前首个命中与候选确认的错选率、误读率及额外操作；若错选不降或时间仍被误认为实时，则假设不成立。现有源码没有这个确认步骤。

#### 证据与依据

**依据 1 · 源码核查**：[quotes.js:102-108](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L102-L108)

裸六位代码生成两个候选。

```text
  if (/^\d{6}$/.test(body)) {
    // 92xxxx are Beijing codes that start with 9; every other 4/8/0/1/2/3 code is
    // Shenzhen or Beijing on market 0, and 5/6/9 are Shanghai. Try the likely
    // market first, then the other one, so index codes such as `000300` still work.
    const primary = /^92\d{4}$/.test(body) ? 'sz' : (/^[569]/.test(body) ? 'sh' : 'sz');
    const secondary = primary === 'sh' ? 'sz' : 'sh';
    return [...secidsForMarket(primary, body), ...secidsForMarket(secondary, body)];
```

**依据 2 · 源码核查**：[quotes.js:247-259](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L247-L259)

从结果选择首个命中。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[quotes.js:216-219](https://github.com/AhaCrazy/dsh-stock-quotes/blob/80d5f885b9dda54961d8e0814c26c538cab73630/quotes.js#L216-L219)

asOf 是本机请求前时间。

```text
  }

  const asOf = new Date().toISOString();
  if (secids.length === 0) return { quotes: [], unresolved: list, asOf };
```

#### 缺口

- 候选确认与源时间展示未实现且缺少对照
  **影响**：无法证明改善或操作成本
  **进一步探讨**：以合成返回构造歧义代码和缺时间场景，测量误选与额外确认时间。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
