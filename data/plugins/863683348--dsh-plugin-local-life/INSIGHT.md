# dsh-plugin-local-life

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c7abe09](https://github.com/863683348/dsh-plugin-local-life/tree/c7abe0935ceab43d784019fb42caf600b3aaadc5)

<!-- BEGIN META -->
[![npm 30d 857](https://img.shields.io/static/v1?label=npm+30d&message=857&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-local-life) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-local-life)
<!-- END META -->

> **功能**：提供本地生活算术工具，含预算、分摊、比价、折扣、换算、贷款与清单。

> **亮点**：把常见日常算术的确定性 helper 接入 Agent，减少口算并统一提示假设；增量主要在工具化和工作流组合，非新算法。详见[Q01](#research-q01)。

> **主要限制**：loan 执行读取 schema 未声明的本金/利率/期限；compareUnitPrices 用数值数量直接比较 kg/g 等不同单位，可能错误标出最低价。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 主要用户任务、合格结果与相对普通计算器的增量是什么？](#detail-section-11)
  - [Q02 · 动作参数与纯函数的接口是否完整，尤其贷款和比较单价？](#detail-section-12)
  - [Q03 · 金额、贷款和表格边界哪些会造成静默误算？](#detail-section-13)
  - [Q04 · 首次/持续/恢复成本和工程复用条件是什么？](#detail-section-14)
  - [Q05 · 如何补齐接口与单位契约，当前该怎样使用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：对话中快速生成可复算的个人算术草稿；需明确币种、单位和实际交易条款。详见[Q01](#research-q01)。

普通计算器/表格能完成同类算术；插件需证明工具参数完整、同口径正确且减少总复核成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地算术 | 预算、分摊、折扣与换算 | 输入口径需明确，人工复核 |
| 贷款 | 等额本息/本金草稿 | 工具 schema 缺本金等参数 |
| 商品比价 | 按数量比较单价 | 不换算不同 unit，限同单位 |
| 出行清单 | 生成静态场景事项 | 不是实时当地规则 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt、Cordis | 必需 | 注册工具和指导 | 模型不能调用 |
| 明确币种、单位和价格口径 | 正确计算必需 | 同条件算术 | 比价或财务值可能误导 |
| 独立复核 | 资金任务必需 | 防止边界误算 | 不宜直接决策 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 安装组合行并重启 DSH | local_life 可见 |
| 输入 | 用户写清币种、单位、税费与条款 | 工具参数完整且可复算 |
| 计算 | Agent 调用相应 action | 结果含明确假设 |
| 核对 | 与独立计算器/交易文书比较 | 不把草稿作为最终资金决定 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH 环境，金额未知 | 安装、输入单位/税费/利率约定；耗时未知 | 宿主兼容未测 |
| 持续使用 | 本地计算资源；数值未知 | 核输入与结果、更新清单；耗时未知 | 无外部实时价格 |
| 失败恢复 | 误购/误算风险；损失未知 | 重输参数并与独立计算器/交易条款对照 | schema 和异单位缺口 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 日常算术 | 多种纯函数与模型工具路由 | 宿主实际调用和用户理解 |
| 贷款 | 纯函数计算分期 | 工具 schema 缺关键参数 |
| 比价 | 同单位数字比较 | 异单位转换缺失、真实交易口径 |

> **思考**：loan 执行读取 schema 未声明的本金/利率/期限；compareUnitPrices 用数值数量直接比较 kg/g 等不同单位，可能错误标出最低价。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把常见日常算术的确定性 helper 接入 Agent，减少口算并统一提示假设；增量主要在工具化和工作流组合，非新算法。详见[Q01](#research-q01)。

纯函数与薄壳分离、独立测试可借鉴；参数 schema 和单位契约需一同校验，不能只测纯函数。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

loan 执行读取 schema 未声明的本金/利率/期限；compareUnitPrices 用数值数量直接比较 kg/g 等不同单位，可能错误标出最低价。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在低风险、同单位且人工复核的算术任务观察；跨单位比价和贷款勿直接用于资金决策。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认纯函数和工具注册；贷款参数 schema 缺失、跨单位比价未换算，关键财务正确性未得到宿主/独立算例验证。改进是假设。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、lib/index.js、lib/local.js、test/local.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、package、工具壳、纯函数及作者测试；未执行目标代码、宿主调用或真实财务验证；旧 META 仅复用。
- 下一步：在隔离宿主对 loan/compare 做端到端参数检验，用 1kg/500g、负利率、分摊舍入与非法日期构成可复算反例，再与独立计算器对照。

**分析版本**

- **仓库**：[863683348/dsh-plugin-local-life](https://github.com/863683348/dsh-plugin-local-life)
- **版本号**：0.3.2（[固定提交 c7abe09](https://github.com/863683348/dsh-plugin-local-life/tree/c7abe0935ceab43d784019fb42caf600b3aaadc5)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是 action 判别式 schema 与维度单位契约，输出换算步骤和舍入差额，使用异单位、缺参数与负利率夹具做端到端对照。详见[Q05](#research-q05)。

在隔离宿主对 loan/compare 做端到端参数检验，用 1kg/500g、负利率、分摊舍入与非法日期构成可复算反例，再与独立计算器对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 554 | 497 | 35 | — |
| .md | source | 4 | 160 | — | — | 1341 |
| .mjs | test | 1 | 200 | 175 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-plugin-local-life/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地生活算术工具是否把财务与购物计算可靠地交给模型使用，哪些接口/单位缺口会误导答案？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 主要用户任务、合格结果与相对普通计算器的增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户在 DSH 对话中处理预算、分摊、单价、折扣、换算、流水、贷款、食谱与出行清单；合格结果应明确币种、计价单位、税/小费、还款利率与期限，数字可复算，且与真实交易条款一致。作者 README 称工具包做日常算术；固定源码确有一个 local_life 模型工具与 10 个 action、可选 systemPrompt 提示。增量主要是把确定性 JS helper 暴露给 Agent 并减少模型心算，算法本身是常规算术。没有外部价格、银行报价或持久记账接入，真实资金决策仍需人工对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-37](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/README.zh.md#L1-L37)

作者列出本地生活用途并声称纯确定性逻辑。

<details>
<summary>查看原文（37行）</summary>

````text
# dsh-plugin-local-life

面向 [DeepSeek Harness](https://github.com/deepseek-ai/dsh) agent 的**本地生活工具包**：预算规划、账单分摊、单价换算、折扣计算、单位换算与出行清单。日常算术，交给插件。

## 安装

```bash
dsh plugin --profile <profile> add dsh-plugin-local-life
```

重启 DSH 后，`local_life` 工具全局注册。

## 工具

| 动作 | 用途 |
| --- | --- |
| `budget` | 月度预算：收入按类别（金额或百分比）分配，含储蓄与结余 |
| `split` | 账单分摊：均分或按权重，支持小费与取整 |
| `price` | 单价换算（如每公斤 / 每 100 克多少钱） |
| `discount` | 折扣计算：百分比折扣或满减（带门槛） |
| `convert` | 单位换算 —— 重量（斤/公斤/磅）、长度（里/公里/尺/英里）、容量（升/加仑）、温度（°C/°F） |
| `checklist` | 出行清单（city / airport / outdoor / self-drive） |
| `ledger` | 记账流水汇总（分类/月度合计） |
| `loan` | 贷款分期（等额本息/等额本金、月供与总利息）

## 配置

均为可选项，写在组合行的 `config` 里：

| 键 | 默认值 | 含义 |
| --- | --- | --- |
| `personaSection` | `true` | 是否注册本地生活提示词段 |
| `sectionOrder` | `6` | 提示词段顺序（persona 为 0，升序） |

## 设计

纯逻辑（`lib/local.js`）零 DSH/Cordis 依赖、可独立单测；`lib/index.js` 是薄 Cordis 壳。无文件系统访问，全部确定性、无副作用。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:43-60](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/index.js#L43-L60)

提示词与 10 个 action 注册。

<details>
<summary>查看原文（18行）</summary>

```text
const SECTION_TEXT = [
  "Local-life guidance:",
  "- Use the `local_life` tool for everyday arithmetic: `budget` for monthly plans, `split` for bill splitting (equal or weighted, with optional tip), `price` for unit-price comparison, `discount` for percent-off / amount-off math, `convert` for units (jin/kg, li/km, C/F, L/gallon...).",
  "- For outings and trips, offer the relevant `checklist` (city / airport / outdoor / self-drive).",
  "- Always state the assumptions (tax included? tip? currency) before quoting numbers.",
  "- Track spending with `ledger` (category/month summaries) and evaluate loans with `loan` (equal-payment or equal-principal schedules).",
  "- For shopping, run `compare` (spec-normalized unit prices + stacked discounts) and for cooking run `recipe_cost` (per-serving cost).",
].join("\n");

function apply(ctx, config) {
  ctx.tools.register(defineTool({
    name: "local_life",
    description: "Local-life helper: `budget` (monthly budget plan from income and category amounts/percentages, with savings and leftover), `split` (split a bill equally or by weights, optional tip and rounding), `price` (unit-price comparison, e.g. price per kg), `discount` (percent-off or amount-off with threshold), `convert` (unit conversion: weight jin/kg/lb, length li/km/chi/mile, volume L/gallon, temperature C/F), `checklist` (trip/outing checklist by scenario: city/airport/outdoor/self-drive), `ledger` (expense ledger summary by category and month), `loan` (loan amortization: equal-payment or equal-principal schedules), `compare` (spec-normalized unit-price comparison and stacked discounts/thresholds), `recipe_cost` (ingredient list -> total and per-serving cost). Use it for everyday finance, shopping, cooking, and travel planning.",
    parameters: {
      action: {
        type: "string", required: true,
        enum: ["budget", "split", "price", "discount", "convert", "checklist", "ledger", "loan", "compare", "recipe_cost"],
        description: "Which local-life helper to run.",
```

</details>

**依据 3 · 源码核查**：[lib/index.js:107-180](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/index.js#L107-L180)

工具执行分支和提示词 section。

<details>
<summary>查看原文（74行）</summary>

```text
    execute: async (args) => {
      const action = args.action;
      let text = "";
      let value;
      let values;
      switch (action) {
        case "budget":
          values = budgetPlan({ income: args.income, items: args.items, savingsPct: args.savingsPct });
          text = values.text + (values.balanced ? "" : "\n\nOver budget — reduce categories or increase income.");
          break;
        case "split":
          values = splitBill({ total: args.total, people: args.people, weights: args.weights, tipPct: args.tipPct, roundTo: args.roundTo });
          text = values.text;
          break;
        case "price":
          values = unitPrice({ price: args.price, amount: args.amount, amountUnit: args.amountUnit, compareUnit: args.compareUnit });
          text = values.text;
          break;
        case "discount":
          values = discount({ price: args.price, offPct: args.offPct, offAmount: args.offAmount, threshold: args.threshold });
          text = values.text;
          break;
        case "convert":
          values = unitConvert({ value: args.value, from: args.from, to: args.to });
          value = values.value;
          text = values.text;
          break;
        case "checklist":
          text = tripChecklist({ scenario: args.scenario });
          break;
        case "ledger":
          text = summarizeLedger({ entries: args.entries }).text;
          break;
        case "loan":
          if (args.amortization === "equal-principal") {
            text = amortizeEqualPrincipal({ principal: args.principal, annualRate: args.annualRate, years: args.years }).text;
          } else {
            text = amortize({ principal: args.principal, annualRate: args.annualRate, years: args.years }).text;
          }
          break;
        case "compare":
          if (args.products && args.products.length > 0) {
            text = compareUnitPrices({ items: args.products, normalize: args.normalize, unit: args.unit }).text;
            if (args.discounts && args.discounts.length > 0) {
              text = text + "\n\n" + stackDiscounts({ price: args.basePrice, discounts: args.discounts }).text;
            }
          } else if (args.discounts && args.discounts.length > 0) {
            text = stackDiscounts({ price: args.basePrice, discounts: args.discounts }).text;
          } else {
            throw new Error("local_life: compare needs products or discounts");
          }
          break;
        case "recipe_cost":
          text = recipeCost({ name: args.topic, servings: args.servings, ingredients: args.ingredients }).text;
          break;
        default:
          throw new Error("local_life: unknown action '" + action + "'");
      }
      return { action, text, value, values };
    },
    presentCall: (args) => ({
      card: "generic",
      title: "Local life: " + args.action,
      kind: "other",
      rawInput: args,
    }),
  }));

  if (config.personaSection) {
    ctx.effect(() => ctx.systemPrompt.section({
      name: "local-life:instructions",
      order: config.sectionOrder,
      text: SECTION_TEXT,
    }), "local-life.section()");
```

</details>

#### 缺口

- 未对照真实交易规则、模型工具调用与宿主呈现
  **影响**：不能确认数值被用户正确理解和采纳
  **进一步探讨**：用匿名预算/购物/贷款案例核输入、工具调用、可复算输出和用户确认

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 动作参数与纯函数的接口是否完整，尤其贷款和比较单价？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

外壳使用 defineTool 注册 action enum，再分派给 lib/local.js 纯函数。预算、分摊、单价、折扣、换算等参数已在 schema 列出，但 loan 执行读取 args.principal、args.annualRate、args.years，而 parameters 中没有这三个字段；若宿主遵照工具 schema 生成/过滤参数，贷款只能收到 undefined，纯函数默认 principal=0 后抛错。compare 执行读 args.unit、recipe_cost 读 args.topic，schema 同样未声明。更严重的是 compareUnitPrices 仅按 price/quantity 计算，再乘 normalize；虽然每行记录 unit，但不做不同单位间转换，同表比较 1kg 与 500g 会给错误排序。README/description 的“spec-normalized”因此只在数量使用同一单位时成立。作者测试仅同为 kg 的比较，没有覆盖异单位或模型 schema 端到端。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:56-93](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/index.js#L56-L93)

工具参数列表缺 principal/annualRate/years、unit、topic。

<details>
<summary>查看原文（38行）</summary>

```text
    parameters: {
      action: {
        type: "string", required: true,
        enum: ["budget", "split", "price", "discount", "convert", "checklist", "ledger", "loan", "compare", "recipe_cost"],
        description: "Which local-life helper to run.",
      },
      income: { type: "number", description: "Monthly income (budget)." },
      items: {
        type: "array",
        items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, amount: { type: "number" }, pct: { type: "number" } } },
        description: "Budget categories [{name, amount|pct}] (budget).",
      },
      savingsPct: { type: "number", description: "Savings percent of income (budget)." },
      total: { type: "number", description: "Bill total (split)." },
      people: { type: "integer", description: "Number of people (split)." },
      weights: { type: "array", items: { type: "number" }, description: "Per-person weights (split)." },
      tipPct: { type: "number", description: "Tip percent (split)." },
      roundTo: { type: "number", description: "Round each share up to this multiple (split)." },
      price: { type: "number", description: "Price paid (price/discount)." },
      amount: { type: "number", description: "Amount bought (price)." },
      amountUnit: { type: "string", description: "Amount unit, e.g. g/kg/斤 (price)." },
      compareUnit: { type: "string", description: "Comparison unit, e.g. kg/100g (price)." },
      offPct: { type: "number", description: "Percent off 0-100 (discount)." },
      offAmount: { type: "number", description: "Fixed amount off (discount)." },
      threshold: { type: "number", description: "Minimum spend for amount-off (discount)." },
      value: { type: "number", description: "Value to convert (convert)." },
      from: { type: "string", description: "Source unit (convert)." },
      to: { type: "string", description: "Target unit (convert)." },
      scenario: { type: "string", description: "city | airport | outdoor | self-drive (checklist)." },
      entries: { type: "array", items: { type: "object", additionalProperties: true }, description: "Ledger entries [{date, category, amount, note}] (ledger)." },
      amortization: { type: "string", enum: ["equal-payment", "equal-principal"], description: "Amortization method (loan)." },
      products: { type: "array", items: { type: "object", additionalProperties: true }, description: "Products [{name, price, quantity, unit}] (compare unit prices)." },
      discounts: { type: "array", items: { type: "object", additionalProperties: true }, description: "Discounts [{pct} | {amount} | {threshold, pct|amount}] (compare stacking)." },
      basePrice: { type: "number", description: "Starting price for discount stacking (compare)." },
      normalize: { type: "number", description: "Normalize unit prices to this quantity, default 1000 (compare)." },
      servings: { type: "number", description: "How many servings the recipe yields (recipe_cost)." },
      ingredients: { type: "array", items: { type: "object", additionalProperties: true }, description: "Ingredients [{name, quantity, unitPrice, unit}] (recipe_cost)." },
    },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:140-160](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/index.js#L140-L160)

执行分支读取缺失的参数。

<details>
<summary>查看原文（21行）</summary>

```text
        case "loan":
          if (args.amortization === "equal-principal") {
            text = amortizeEqualPrincipal({ principal: args.principal, annualRate: args.annualRate, years: args.years }).text;
          } else {
            text = amortize({ principal: args.principal, annualRate: args.annualRate, years: args.years }).text;
          }
          break;
        case "compare":
          if (args.products && args.products.length > 0) {
            text = compareUnitPrices({ items: args.products, normalize: args.normalize, unit: args.unit }).text;
            if (args.discounts && args.discounts.length > 0) {
              text = text + "\n\n" + stackDiscounts({ price: args.basePrice, discounts: args.discounts }).text;
            }
          } else if (args.discounts && args.discounts.length > 0) {
            text = stackDiscounts({ price: args.basePrice, discounts: args.discounts }).text;
          } else {
            throw new Error("local_life: compare needs products or discounts");
          }
          break;
        case "recipe_cost":
          text = recipeCost({ name: args.topic, servings: args.servings, ingredients: args.ingredients }).text;
```

</details>

**依据 3 · 源码核查**：[lib/local.js:206-213](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/local.js#L206-L213)

本金默认 0 且需正值。

```text
/** Equal-payment (annuity) loan amortization schedule. */
export function amortize({ principal = 0, annualRate = 0, years = 0 } = {}) {
  const p = Number(principal);
  const r = Number(annualRate) / 100 / 12;
  const n = Math.floor(Number(years) * 12);
  if (!Number.isFinite(p) || p <= 0) throw new Error("local: principal must be a positive number");
  if (!Number.isFinite(n) || n <= 0) throw new Error("local: years must be positive");
  const payment = r > 0 ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;
```

**依据 4 · 源码核查**：[lib/local.js:266-299](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/local.js#L266-L299)

比较只用数字数量，未转换 unit。

<details>
<summary>查看原文（34行）</summary>

```text
/** Compare unit prices across products (spec-normalized). */
export function compareUnitPrices({ items = [], normalize = 1000, unit = "kg" } = {}) {
  const list = (Array.isArray(items) ? items : []).filter((x) => x && x.name);
  if (list.length === 0) throw new Error("local: at least one item with a name is required");
  const norm = Number(normalize) > 0 ? Number(normalize) : 1000;
  const rows = list.map((it) => {
    const price = Number(it.price);
    const qty = Number(it.quantity);
    if (!Number.isFinite(price) || price < 0) throw new Error("local: item price must be a non-negative number");
    if (!Number.isFinite(qty) || qty <= 0) throw new Error("local: item quantity must be positive");
    const perUnit = price / qty;
    return {
      name: String(it.name),
      price: round2(price),
      quantity: qty,
      unit: String(it.unit || unit),
      unitPrice: round2(perUnit),
      perNormalized: round2(perUnit * norm),
    };
  });
  const best = rows.reduce((a, b) => (b.perNormalized < a.perNormalized ? b : a));
  const worst = rows.reduce((a, b) => (b.perNormalized > a.perNormalized ? b : a));
  const savings = round2(worst.perNormalized - best.perNormalized);
  const savingsPct = worst.perNormalized > 0 ? round2((savings / worst.perNormalized) * 100) : 0;
  const text = [
    "# Unit price comparison (per " + norm + " " + unit + ")",
    "",
    "| Item | Price | Qty | Unit price | Per " + norm + " " + unit + " |",
    "|------|-------|-----|-----------|-------------------|",
    ...rows.map((r) => "| " + r.name + (r.name === best.name ? " (best)" : "") + " | " + r.price + " | " + r.quantity + " " + r.unit + " | " + r.unitPrice + " | " + r.perNormalized + " |"),
    "",
    "Best: " + best.name + " | worst: " + worst.name + " | save " + savings + " per " + norm + " " + unit + " (" + savingsPct + "%)",
  ].join("\n");
  return { rows, best: best.name, worst: worst.name, savings, savingsPct, normalizedTo: norm, unit, text };
```

</details>

**依据 5 · 源码核查**：[test/local.test.mjs:133-146](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/test/local.test.mjs#L133-L146)

测试商品均为 kg。

<details>
<summary>查看原文（14行）</summary>

```text
test("compareUnitPrices normalizes specs and finds the best deal", () => {
  const res = compareUnitPrices({
    items: [
      { name: "A", price: 12, quantity: 1, unit: "kg" },
      { name: "B", price: 20, quantity: 2, unit: "kg" },
      { name: "C", price: 8, quantity: 0.5, unit: "kg" },
    ],
    normalize: 1000,
  });
  assert.equal(res.best, "B", "20/2 = 10 per kg is cheapest");
  assert.equal(res.worst, "C", "8/0.5 = 16 per kg is dearest");
  assert.equal(res.rows[1].perNormalized, 10000);
  assert.ok(res.savings > 0);
  assert.ok(res.text.includes("# Unit price comparison"));
```

</details>

#### 缺口

- 未实测宿主 defineTool 对未声明字段的实际透传/丢弃行为
  **影响**：贷款动作真实失败率和错误表现仍需宿主核查
  **进一步探讨**：在隔离宿主调用 loan/compare，覆盖未声明字段和 kg/g 混用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 金额、贷款和表格边界哪些会造成静默误算？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

splitBill 的 roundTo 分支逐人向上取整，返回的 sharesSum 可超过 grandTotal，却只计算未输出 adjustment，用户须决定溢出金额归属。budgetPlan 接受 savingsPct 任意数，负数可能增加结余；贷款函数校验本金/年数但未校验 annualRate 非负或有限，负利率进入月供公式，结果可不符合普通贷款语义。compare 不做单位换算是最直接的误购风险。ledger 的月份只取 date 前 7 字符且输入类别/注释直接拼 Markdown 表格，无日期规范化/转义；不适合把外部不可信流水当作可审计账本。以上均为代码边界，不代表已在真实交易中发生损失。

#### 证据与依据

**依据 1 · 源码核查**：[lib/local.js:52-85](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/local.js#L52-L85)

账单向上取整与合计。

<details>
<summary>查看原文（34行）</summary>

```text
/** Split a bill N ways with optional weights and tip. */
export function splitBill({ total = 0, people = 2, weights = [], tipPct = 0, roundTo } = {}) {
  const t = Number(total);
  const n = Math.max(1, Math.floor(people));
  const tip = Number(tipPct || 0);
  if (!Number.isFinite(t) || t < 0) throw new Error("local: total must be a non-negative number");
  if (tip < 0) throw new Error("local: tipPct must be non-negative");
  const grand = t * (1 + tip / 100);
  let shares;
  if (Array.isArray(weights) && weights.length === n && weights.every((w) => Number(w) > 0)) {
    const sum = weights.reduce((a, w) => a + Number(w), 0);
    shares = weights.map((w) => (grand * Number(w)) / sum);
  } else {
    shares = Array.from({ length: n }, () => grand / n);
  }
  const rounded = shares.map((s) => (roundTo == null ? round2(s) : Math.ceil((s - 1e-9) / roundTo) * roundTo));
  const sum = rounded.reduce((a, b) => a + b, 0);
  const adjustment = roundTo == null ? round2(sum - grand) : round2(grand - sum);
  if (roundTo == null && Math.abs(adjustment) > 0.01) {
    rounded[n - 1] = round2(rounded[n - 1] - adjustment);
  }
  return {
    total: t,
    tipPct: tip,
    grandTotal: round2(grand),
    people: n,
    shares: rounded,
    sharesSum: round2(rounded.reduce((a, b) => a + b, 0)),
    text: [
      "Bill: " + t + (tip > 0 ? " + " + tip + "% tip" : "") + " = " + round2(grand),
      ...rounded.map((s, i) => "- Person " + (i + 1) + ": " + s),
      "Sum: " + round2(rounded.reduce((a, b) => a + b, 0)),
    ].join("\n"),
  };
```

</details>

**依据 2 · 源码核查**：[lib/local.js:13-49](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/local.js#L13-L49)

储蓄比例未做范围校验。

<details>
<summary>查看原文（37行）</summary>

```text
/** Monthly budget plan: allocate income across categories. */
export function budgetPlan({ income = 0, items = [], savingsPct = 0 } = {}) {
  const inc = Number(income);
  if (!Number.isFinite(inc) || inc < 0) throw new Error("local: income must be a non-negative number");
  const list = Array.isArray(items) ? items.filter((x) => x && x.name) : [];
  const allocated = [];
  let used = 0;
  for (const it of list) {
    let amount;
    if (typeof it.amount === "number" && Number.isFinite(it.amount)) {
      amount = it.amount;
    } else if (typeof it.pct === "number" && Number.isFinite(it.pct)) {
      amount = (inc * it.pct) / 100;
    } else {
      throw new Error("local: each budget item needs amount or pct");
    }
    if (amount < 0) throw new Error("local: budget item amounts must be non-negative");
    allocated.push({ name: it.name, amount: round2(amount) });
    used += amount;
  }
  const savings = (inc * Number(savingsPct || 0)) / 100;
  const leftover = inc - used - savings;
  return {
    income: inc,
    savings: round2(savings),
    items: allocated,
    allocatedTotal: round2(used),
    leftover: round2(leftover),
    balanced: leftover >= 0,
    text: [
      "Income: " + inc,
      "Savings target: " + round2(savings),
      ...allocated.map((a) => "- " + a.name + ": " + a.amount),
      "Allocated total: " + round2(used),
      "Leftover: " + round2(leftover) + (leftover >= 0 ? "" : " (over budget!)"),
    ].join("\n"),
  };
```

</details>

**依据 3 · 源码核查**：[lib/local.js:169-203](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/local.js#L169-L203)

流水日期截取和 Markdown 拼接。

<details>
<summary>查看原文（35行）</summary>

```text
/** Summarize an expense ledger: category and month totals. */
export function summarizeLedger({ entries = [] } = {}) {
  const list = Array.isArray(entries) ? entries.filter((e) => e) : [];
  const rows = list.map((e, i) => {
    const amount = Number(e.amount);
    if (!Number.isFinite(amount)) throw new Error("local: ledger amount must be a number");
    return { date: String(e.date || ""), category: String(e.category || "other"), amount, note: String(e.note || "") };
  });
  const byCategory = {};
  const byMonth = {};
  for (const r of rows) {
    byCategory[r.category] = (byCategory[r.category] || 0) + r.amount;
    const month = r.date.slice(0, 7);
    if (month) byMonth[month] = (byMonth[month] || 0) + r.amount;
  }
  const total = rows.reduce((s, r) => s + r.amount, 0);
  const catRows = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const monthRows = Object.entries(byMonth).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const text = [
    "# Ledger summary",
    "",
    "Total: " + round2(total) + " (" + rows.length + " entries)",
    "",
    "## By category",
    "| Category | Amount |",
    "|----------|--------|",
    ...catRows.map(([k, v]) => "| " + k + " | " + round2(v) + " |"),
    "",
    "## By month",
    "| Month | Amount |",
    "|-------|--------|",
    ...monthRows.map(([k, v]) => "| " + k + " | " + round2(v) + " |"),
  ].join("\n");
  const obj = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, round2(v)]));
  return { total: round2(total), count: rows.length, byCategory: obj(byCategory), byMonth: obj(byMonth), text };
```

</details>

**依据 4 · 源码核查**：[lib/local.js:206-264](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/local.js#L206-L264)

贷款利率未经有限/非负检查。

<details>
<summary>查看原文（59行）</summary>

```text
/** Equal-payment (annuity) loan amortization schedule. */
export function amortize({ principal = 0, annualRate = 0, years = 0 } = {}) {
  const p = Number(principal);
  const r = Number(annualRate) / 100 / 12;
  const n = Math.floor(Number(years) * 12);
  if (!Number.isFinite(p) || p <= 0) throw new Error("local: principal must be a positive number");
  if (!Number.isFinite(n) || n <= 0) throw new Error("local: years must be positive");
  const payment = r > 0 ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;
  let balance = p;
  const schedule = [];
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPart = payment - interest;
    balance -= principalPart;
    schedule.push({ no: i, payment: round2(payment), interest: round2(interest), principal: round2(principalPart), balance: round2(Math.max(0, balance)) });
  }
  const totalPayment = payment * n;
  const totalInterest = totalPayment - p;
  const text = [
    "# Loan schedule (equal payment)",
    "",
    "Principal: " + round2(p) + ", annual rate: " + Number(annualRate) + "%, term: " + years + " year(s)",
    "Monthly payment: " + round2(payment) + ", total payment: " + round2(totalPayment) + ", total interest: " + round2(totalInterest),
    "",
    "| # | Payment | Interest | Principal | Balance |",
    "|---|---------|----------|-----------|---------|",
    ...schedule.map((s) => "| " + s.no + " | " + s.payment + " | " + s.interest + " | " + s.principal + " | " + s.balance + " |"),
  ].join("\n");
  return { monthly: round2(payment), totalPayment: round2(totalPayment), totalInterest: round2(totalInterest), schedule, text };
}

/** Equal-principal loan amortization schedule. */
export function amortizeEqualPrincipal({ principal = 0, annualRate = 0, years = 0 } = {}) {
  const p = Number(principal);
  const r = Number(annualRate) / 100 / 12;
  const n = Math.floor(Number(years) * 12);
  if (!Number.isFinite(p) || p <= 0) throw new Error("local: principal must be a positive number");
  if (!Number.isFinite(n) || n <= 0) throw new Error("local: years must be positive");
  const principalPart = p / n;
  let balance = p;
  const schedule = [];
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const payment = principalPart + interest;
    balance -= principalPart;
    schedule.push({ no: i, payment: round2(payment), interest: round2(interest), principal: round2(principalPart), balance: round2(Math.max(0, balance)) });
  }
  const totalInterest = schedule.reduce((s, x) => s + x.interest, 0);
  const text = [
    "# Loan schedule (equal principal)",
    "",
    "Principal: " + round2(p) + ", annual rate: " + Number(annualRate) + "%, term: " + years + " year(s)",
    "Monthly principal: " + round2(principalPart) + ", total interest: " + round2(totalInterest),
    "",
    "| # | Payment | Interest | Principal | Balance |",
    "|---|---------|----------|-----------|---------|",
    ...schedule.map((s) => "| " + s.no + " | " + s.payment + " | " + s.interest + " | " + s.principal + " | " + s.balance + " |"),
  ].join("\n");
  return { monthlyPrincipal: round2(principalPart), totalInterest: round2(totalInterest), schedule, text };
```

</details>

**依据 5 · 源码核查**：[lib/local.js:266-299](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/local.js#L266-L299)

异单位商品误比风险。

<details>
<summary>查看原文（34行）</summary>

```text
/** Compare unit prices across products (spec-normalized). */
export function compareUnitPrices({ items = [], normalize = 1000, unit = "kg" } = {}) {
  const list = (Array.isArray(items) ? items : []).filter((x) => x && x.name);
  if (list.length === 0) throw new Error("local: at least one item with a name is required");
  const norm = Number(normalize) > 0 ? Number(normalize) : 1000;
  const rows = list.map((it) => {
    const price = Number(it.price);
    const qty = Number(it.quantity);
    if (!Number.isFinite(price) || price < 0) throw new Error("local: item price must be a non-negative number");
    if (!Number.isFinite(qty) || qty <= 0) throw new Error("local: item quantity must be positive");
    const perUnit = price / qty;
    return {
      name: String(it.name),
      price: round2(price),
      quantity: qty,
      unit: String(it.unit || unit),
      unitPrice: round2(perUnit),
      perNormalized: round2(perUnit * norm),
    };
  });
  const best = rows.reduce((a, b) => (b.perNormalized < a.perNormalized ? b : a));
  const worst = rows.reduce((a, b) => (b.perNormalized > a.perNormalized ? b : a));
  const savings = round2(worst.perNormalized - best.perNormalized);
  const savingsPct = worst.perNormalized > 0 ? round2((savings / worst.perNormalized) * 100) : 0;
  const text = [
    "# Unit price comparison (per " + norm + " " + unit + ")",
    "",
    "| Item | Price | Qty | Unit price | Per " + norm + " " + unit + " |",
    "|------|-------|-----|-----------|-------------------|",
    ...rows.map((r) => "| " + r.name + (r.name === best.name ? " (best)" : "") + " | " + r.price + " | " + r.quantity + " " + r.unit + " | " + r.unitPrice + " | " + r.perNormalized + " |"),
    "",
    "Best: " + best.name + " | worst: " + worst.name + " | save " + savings + " per " + norm + " " + unit + " (" + savingsPct + "%)",
  ].join("\n");
  return { rows, best: best.name, worst: worst.name, savings, savingsPct, normalizedTo: norm, unit, text };
```

</details>

#### 缺口

- 交易条款、舍入规则和真实数据分布未核
  **影响**：不能量化误差发生率或资金损失
  **进一步探讨**：用公开可复算案例覆盖极端比例、异单位、负利率、非法日期与舍入差额

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次/持续/恢复成本和工程复用条件是什么？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

首次需要 DSH 的 tools/systemPrompt 与 package peer 依赖，安装组合行后重启，选定币种/单位/税费口径；没有网络账号或文件存储依赖，纯计算模块可单测。持续成本主要是用户补足正确输入、人工复核结果、维护清单和业务单位，计算资源很低但具体时间未知。失败恢复需要识别缺参数抛错、不同单位误比或错误贷款假设，重新输入并用独立计算器/官方交易文书核对；不能把工具输出直接当财务建议。工程上纯 helper 与薄 Cordis 壳分离、已有独立单测是可复用设计，但测试没有贯通 schema 到模型调用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-53](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/package.json#L1-L53)

包版本、peer 依赖和测试脚本。

<details>
<summary>查看原文（53行）</summary>

```text
{
  "name": "dsh-plugin-local-life",
  "version": "0.3.2",
  "description": "Local-life toolkit for DeepSeek Harness agents: budgets, bill splitting, unit-price comparison with spec normalization, stacked discounts, unit conversions (jin/li/chi, C/F), expense-ledger summaries, loan amortization, recipe costing, and trip checklists",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./local": "./lib/local.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.zh.md"
  ],
  "scripts": {
    "test": "node --test test/",
    "prepublishOnly": "node --test test/"
  },
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "cordis",
    "plugin",
    "bundle",
    "local",
    "life",
    "budget",
    "split",
    "convert",
    "ledger",
    "amortization",
    "loan",
    "shopping",
    "recipe",
    "discount"
  ],
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-fs": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-system-prompt": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:29-41](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/index.js#L29-L41)

宿主注入与配置。

<details>
<summary>查看原文（13行）</summary>

```text
/** Cordis plugin name (registered with the loader). */
const name = "local-life";

/** Services this plugin must resolve before it applies. */
const inject = ["tools", "systemPrompt"];

/** Composition-row configuration for the plugin entry. */
const Config = z.object({
  /** Register the local-life prompt-guidance section. */
  personaSection: z.boolean().default(true),
  /** Order of the section (ascending; persona is 0). */
  sectionOrder: z.number().default(6),
});
```

</details>

**依据 3 · 源码核查**：[lib/index.js:52-55](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/index.js#L52-L55)

薄工具注册壳。

```text
function apply(ctx, config) {
  ctx.tools.register(defineTool({
    name: "local_life",
    description: "Local-life helper: `budget` (monthly budget plan from income and category amounts/percentages, with savings and leftover), `split` (split a bill equally or by weights, optional tip and rounding), `price` (unit-price comparison, e.g. price per kg), `discount` (percent-off or amount-off with threshold), `convert` (unit conversion: weight jin/kg/lb, length li/km/chi/mile, volume L/gallon, temperature C/F), `checklist` (trip/outing checklist by scenario: city/airport/outdoor/self-drive), `ledger` (expense ledger summary by category and month), `loan` (loan amortization: equal-payment or equal-principal schedules), `compare` (spec-normalized unit-price comparison and stacked discounts/thresholds), `recipe_cost` (ingredient list -> total and per-serving cost). Use it for everyday finance, shopping, cooking, and travel planning.",
```

**依据 4 · 源码核查**：[test/local.test.mjs:1-16](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/test/local.test.mjs#L1-L16)

作者测试导入纯函数，不经过模型工具。

<details>
<summary>查看原文（16行）</summary>

```text
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  amortize,
  compareUnitPrices,
  recipeCost,
  stackDiscounts,
  amortizeEqualPrincipal,
  budgetPlan,
  summarizeLedger,
  discount,
  splitBill,
  tripChecklist,
  unitConvert,
  unitPrice,
} from "../lib/local.js";
```

</details>

#### 缺口

- 目标宿主兼容、实测处理时间和恢复代价未核
  **影响**：不能报效率提升或采用总成本
  **进一步探讨**：同任务对比插件、人工计算器和一次人工复核所需时间与错误数

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何补齐接口与单位契约，当前该怎样使用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证改进是把各 action 做成独立判别式参数 schema，loan 明确本金/利率/期限及单位，compare 先将同类重量/容量/长度转成基准单位并拒绝跨维度或未知单位，输出每一步换算、舍入与来源口径；对资金相关计算加入边界/性质测试和宿主端到端工具调用。最小验证用 1kg 对 500g、贷款参数缺失、负利率、分摊舍入差和恶意流水文本，比较工具值与独立计算器。当前可在低风险、同单位、参数齐全的个人算术场景观察，预算或贷款只作草稿；对于跨单位商品比价与贷款不宜依赖。推荐 observe，待 schema 和单位转换修正且独立对照后再试用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:56-93](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/index.js#L56-L93)

单一 schema 缺 action 特定必需参数。

<details>
<summary>查看原文（38行）</summary>

```text
    parameters: {
      action: {
        type: "string", required: true,
        enum: ["budget", "split", "price", "discount", "convert", "checklist", "ledger", "loan", "compare", "recipe_cost"],
        description: "Which local-life helper to run.",
      },
      income: { type: "number", description: "Monthly income (budget)." },
      items: {
        type: "array",
        items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, amount: { type: "number" }, pct: { type: "number" } } },
        description: "Budget categories [{name, amount|pct}] (budget).",
      },
      savingsPct: { type: "number", description: "Savings percent of income (budget)." },
      total: { type: "number", description: "Bill total (split)." },
      people: { type: "integer", description: "Number of people (split)." },
      weights: { type: "array", items: { type: "number" }, description: "Per-person weights (split)." },
      tipPct: { type: "number", description: "Tip percent (split)." },
      roundTo: { type: "number", description: "Round each share up to this multiple (split)." },
      price: { type: "number", description: "Price paid (price/discount)." },
      amount: { type: "number", description: "Amount bought (price)." },
      amountUnit: { type: "string", description: "Amount unit, e.g. g/kg/斤 (price)." },
      compareUnit: { type: "string", description: "Comparison unit, e.g. kg/100g (price)." },
      offPct: { type: "number", description: "Percent off 0-100 (discount)." },
      offAmount: { type: "number", description: "Fixed amount off (discount)." },
      threshold: { type: "number", description: "Minimum spend for amount-off (discount)." },
      value: { type: "number", description: "Value to convert (convert)." },
      from: { type: "string", description: "Source unit (convert)." },
      to: { type: "string", description: "Target unit (convert)." },
      scenario: { type: "string", description: "city | airport | outdoor | self-drive (checklist)." },
      entries: { type: "array", items: { type: "object", additionalProperties: true }, description: "Ledger entries [{date, category, amount, note}] (ledger)." },
      amortization: { type: "string", enum: ["equal-payment", "equal-principal"], description: "Amortization method (loan)." },
      products: { type: "array", items: { type: "object", additionalProperties: true }, description: "Products [{name, price, quantity, unit}] (compare unit prices)." },
      discounts: { type: "array", items: { type: "object", additionalProperties: true }, description: "Discounts [{pct} | {amount} | {threshold, pct|amount}] (compare stacking)." },
      basePrice: { type: "number", description: "Starting price for discount stacking (compare)." },
      normalize: { type: "number", description: "Normalize unit prices to this quantity, default 1000 (compare)." },
      servings: { type: "number", description: "How many servings the recipe yields (recipe_cost)." },
      ingredients: { type: "array", items: { type: "object", additionalProperties: true }, description: "Ingredients [{name, quantity, unitPrice, unit}] (recipe_cost)." },
    },
```

</details>

**依据 2 · 源码核查**：[lib/local.js:88-103](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/local.js#L88-L103)

已有单位因子可供明确换算。

<details>
<summary>查看原文（16行）</summary>

```text
const UNIT_FACTORS = {
  weight: { g: 1, kg: 1000, 克: 1, 公斤: 1000, 千克: 1000, 斤: 500, 磅: 453.59237, oz: 28.349523 },
  volume: { ml: 1, L: 1000, 升: 1000, 毫升: 1, 加仑: 3785.411784, gallon: 3785.411784, cup: 236.588 },
  length: { m: 1, km: 1000, cm: 0.01, 米: 1, 公里: 1000, 千米: 1000, 里: 500, 尺: 0.333333, 英里: 1609.344, mile: 1609.344, ft: 0.3048 },
};

/** Unit price: normalize an amount to price-per-comparison-unit. */
export function unitPrice({ price = 0, amount = 0, amountUnit = "g", compareUnit = "kg" } = {}) {
  const p = Number(price);
  const a = Number(amount);
  if (!Number.isFinite(p) || !Number.isFinite(a) || a <= 0) throw new Error("local: price and positive amount required");
  let factor = null;
  for (const table of Object.values(UNIT_FACTORS)) {
    if (amountUnit in table && compareUnit in table) {
      factor = table[compareUnit] / table[amountUnit];
      break;
```

</details>

**依据 3 · 源码核查**：[lib/local.js:266-299](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/local.js#L266-L299)

现有比较无单位转换。

<details>
<summary>查看原文（34行）</summary>

```text
/** Compare unit prices across products (spec-normalized). */
export function compareUnitPrices({ items = [], normalize = 1000, unit = "kg" } = {}) {
  const list = (Array.isArray(items) ? items : []).filter((x) => x && x.name);
  if (list.length === 0) throw new Error("local: at least one item with a name is required");
  const norm = Number(normalize) > 0 ? Number(normalize) : 1000;
  const rows = list.map((it) => {
    const price = Number(it.price);
    const qty = Number(it.quantity);
    if (!Number.isFinite(price) || price < 0) throw new Error("local: item price must be a non-negative number");
    if (!Number.isFinite(qty) || qty <= 0) throw new Error("local: item quantity must be positive");
    const perUnit = price / qty;
    return {
      name: String(it.name),
      price: round2(price),
      quantity: qty,
      unit: String(it.unit || unit),
      unitPrice: round2(perUnit),
      perNormalized: round2(perUnit * norm),
    };
  });
  const best = rows.reduce((a, b) => (b.perNormalized < a.perNormalized ? b : a));
  const worst = rows.reduce((a, b) => (b.perNormalized > a.perNormalized ? b : a));
  const savings = round2(worst.perNormalized - best.perNormalized);
  const savingsPct = worst.perNormalized > 0 ? round2((savings / worst.perNormalized) * 100) : 0;
  const text = [
    "# Unit price comparison (per " + norm + " " + unit + ")",
    "",
    "| Item | Price | Qty | Unit price | Per " + norm + " " + unit + " |",
    "|------|-------|-----|-----------|-------------------|",
    ...rows.map((r) => "| " + r.name + (r.name === best.name ? " (best)" : "") + " | " + r.price + " | " + r.quantity + " " + r.unit + " | " + r.unitPrice + " | " + r.perNormalized + " |"),
    "",
    "Best: " + best.name + " | worst: " + worst.name + " | save " + savings + " per " + norm + " " + unit + " (" + savingsPct + "%)",
  ].join("\n");
  return { rows, best: best.name, worst: worst.name, savings, savingsPct, normalizedTo: norm, unit, text };
```

</details>

**依据 4 · 源码核查**：[test/local.test.mjs:102-153](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/test/local.test.mjs#L102-L153)

作者测试涵盖纯函数常规路径但未覆盖两项关键反例。

<details>
<summary>查看原文（52行）</summary>

```text
test("amortize equal-payment schedule math", () => {
  const loan = amortize({ principal: 120000, annualRate: 6, years: 10 });
  assert.equal(loan.schedule.length, 120);
  assert.ok(loan.monthly > 1000 && loan.monthly < 1500, "monthly around 1332");
  assert.ok(loan.totalInterest > 30000 && loan.totalInterest < 45000);
  assert.ok(Math.abs(loan.schedule[119].balance) < 1, "final balance ~0");
  const sumPrincipal = loan.schedule.reduce((s, x) => s + x.principal, 0);
  assert.ok(Math.abs(sumPrincipal - 120000) < 5, "principal sums to ~120000");
});

test("amortize zero-rate loan", () => {
  const loan = amortize({ principal: 12000, annualRate: 0, years: 1 });
  assert.equal(loan.monthly, 1000);
  assert.equal(loan.totalInterest, 0);
});

test("amortizeEqualPrincipal decreasing payments", () => {
  const loan = amortizeEqualPrincipal({ principal: 12000, annualRate: 12, years: 1 });
  assert.equal(loan.schedule.length, 12);
  assert.equal(loan.monthlyPrincipal, 1000);
  assert.ok(loan.schedule[0].payment > loan.schedule[11].payment, "payment decreases");
  assert.ok(loan.totalInterest > 0);
});

test("loan functions reject bad input", () => {
  assert.throws(() => amortize({ principal: 0, annualRate: 5, years: 1 }));
  assert.throws(() => amortize({ principal: 1000, annualRate: 5, years: 0 }));
  assert.throws(() => amortizeEqualPrincipal({ principal: -5, annualRate: 5, years: 1 }));
});


test("compareUnitPrices normalizes specs and finds the best deal", () => {
  const res = compareUnitPrices({
    items: [
      { name: "A", price: 12, quantity: 1, unit: "kg" },
      { name: "B", price: 20, quantity: 2, unit: "kg" },
      { name: "C", price: 8, quantity: 0.5, unit: "kg" },
    ],
    normalize: 1000,
  });
  assert.equal(res.best, "B", "20/2 = 10 per kg is cheapest");
  assert.equal(res.worst, "C", "8/0.5 = 16 per kg is dearest");
  assert.equal(res.rows[1].perNormalized, 10000);
  assert.ok(res.savings > 0);
  assert.ok(res.text.includes("# Unit price comparison"));
});

test("compareUnitPrices validates items", () => {
  assert.throws(() => compareUnitPrices({ items: [] }));
  assert.throws(() => compareUnitPrices({ items: [{ name: "x", price: 1, quantity: 0 }] }));
  assert.throws(() => compareUnitPrices({ items: [{ name: "x", price: -1, quantity: 1 }] }));
});
```

</details>

#### 缺口

- 判别式 schema、换算拒绝与端到端验证尚未实现
  **影响**：不能把设想算作现有贡献
  **进一步探讨**：实现最小原型，针对反例和真实宿主调用对照输出

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
