# Stock Analysis Plugin

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[4aeb5e8](https://github.com/Weaxs/stock-analysis-plugin/tree/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Weaxs/stock-analysis-plugin) [![npm 30d 1,631](https://img.shields.io/static/v1?label=npm+30d&message=1%2C631&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@weaxs/stock-analysis-plugin) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@weaxs/stock-analysis-plugin)
<!-- END META -->

> **功能**：多宿主证券研究工具集，共享 Python 行情、筛查与回测能力，另有 DSH 专用分发。

> **亮点**：用共享 Python 层保持跨宿主入口，并把工具发现与成本假设明确分层。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：模拟费用和时点可审阅，真实行情口径及复权仍须独立核对。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 固定仓库中哪个包才是 DSH 入口？](#detail-section-11)
  - [Q02 · 按需发现和回测模拟解决什么，不解决什么？](#detail-section-12)
  - [Q03 · 什么范围内可以试用复盘？](#detail-section-13)
  - [Q04 · 统一桥接能否降低历史复盘中漏算成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有固定历史资料的研究者可调用同一套工具复查行情与模拟结果。

对照手工运行研究脚本和使用带公式的表格。短任务可直接查原资料。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 研究工具 | 读取或组织数据 | 依赖 Python 与来源 |
| 回测 | 按规则模拟 | 只在声明的假设内解释 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| DSH 专用包 | 注册工具 | 匹配实际 Profile |
| Python 与固定历史数据 | 执行模拟 | 口径和权限需核对 |

| 步骤 | 操作 | 退出 |
| --- | --- | --- |
| 准备 | 隔离宿主与样本 | 记录费用假设 |
| 复盘 | 对照手算序列 | 不一致退回原数据 |

**效果与成本**

| 阶段 | 负担 | 计量 |
| --- | --- | --- |
| 首次 | 配置环境 | 搭建人时 |
| 持续 | 核对资料与结果 | 人工和服务费分开 |
| 退出 | 清理测试 Profile | 回读残留 |

| 结果 | 判据 | 边界 |
| --- | --- | --- |
| 可审计模拟 | 交易序列和费用能复现 | 不保证真实成交 |

> **思考**：模拟费用和时点可审阅，真实行情口径及复权仍须独立核对。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用共享 Python 层保持跨宿主入口，并把工具发现与成本假设明确分层。见 [Q01](#research-q01)、[Q02](#research-q02)。

多宿主共用 CLI，DSH 独立 bundle，按 scope 裁剪工具展示。

<a id="detail-section-5"></a>

### 1.4 主要限制

模拟费用和时点可审阅，真实行情口径及复权仍须独立核对。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在隔离 Profile 用已许可的固定样本核对复盘。结果不可复现就回到手工记录。见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

确认固定接线和部分回测成本计算。未验证真实数据、市场覆盖和策略效果。

- 已检查：作者 README、包清单、源码路径 package.json、dsh/package.json、dsh/cordis.patch.yml、dsh/index.ts、dsh/discovery.ts、tools/backtest.py、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽查 DSH 分发、Host、发现和回测关键片段。未跑目标代码或验证市场信息。
- 下一步：用离线样本核对解释器、工具可见性、费用与成交序列。

**分析版本**

- **仓库**：[Weaxs/stock-analysis-plugin](https://github.com/Weaxs/stock-analysis-plugin)
- **版本号**：0.1.4（[固定提交 4aeb5e8](https://github.com/Weaxs/stock-analysis-plugin/tree/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用同一历史样本对照插件与手算，检查交易序列、费用和核对人时。见 [Q04](#research-q04)。

用离线样本核对解释器、工具可见性、费用与成交序列。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 39 | 4420 | — | — | 58746 |
| .ts | source | 5 | 7286 | 6935 | 69 | — |
| .mjs | source | 5 | 171 | 139 | 21 | — |
| .ts | test | 15 | 2371 | 2021 | 114 | — |
| .mjs | test | 4 | 520 | 425 | 69 | — |
| .ts | example | 1 | 15 | 14 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Weaxs/stock-analysis-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/Weaxs/stock-analysis-plugin/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)

暂未获取：近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多宿主分发如何接入 DSH 研究工具，离线回测的输出如何人工复核？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 固定仓库中哪个包才是 DSH 入口？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

需要反复做行情研究和历史复盘的开发者，可使用共享 Python 工具，而无需每个宿主重写分析实现。固定根 npm 清单的入口是 Pi；仓库 dsh 子目录另有 @weaxs/dsh-stock-analysis 0.1.4，bundle 插入 Cordis 插件。DSH Host 注册 Skill 与模型工具，CLI 调用优先找项目虚拟环境，再用系统 Python，将 stdout 作为文本交给模型。根项目是多宿主插件源，不能把根 npm 包名当 DSH 安装名。相对手工跑多个脚本，主要增量是统一调用与结果交接，不由包装推出数据准确。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-15](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/package.json#L2-L15)

根包名、Pi 入口及技能

<details>
<summary>查看原文（14行）</summary>

```text
  "name": "@weaxs/stock-analysis-plugin",
  "version": "0.1.4",
  "description": "Pi Agent extension for stock analysis, screening, and strategy backtesting across A/HK/US/JP/KR/TW markets",
  "type": "module",
  "main": "./pi/index.ts",
  "pi": {
    "extensions": [
      "./pi/index.ts"
    ],
    "skills": [
      "./skills/stock-analysis/SKILL.md",
      "./skills/stock-screener/SKILL.md",
      "./skills/strategy-backtest/SKILL.md",
      "./skills/sector-rotation/SKILL.md",
```

</details>

**依据 2 · 源码核查**：[dsh/package.json:2-20](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/dsh/package.json#L2-L20)

DSH 专用版本、bundle 与 postinstall

<details>
<summary>查看原文（19行）</summary>

```text
  "name": "@weaxs/dsh-stock-analysis",
  "version": "0.1.4",
  "description": "DeepSeek Harness (dsh) plugin for stock analysis, screening, and strategy backtesting across A/HK/US/JP/KR/TW markets",
  "type": "module",
  "main": "./dist/index.js",
  "exports": {
    ".": "./dist/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./research-role": "./dist/research-role.js",
    "./research.patch.yml": "./research.patch.yml",
    "./deepseek-search.patch.yml": "./deepseek-search.patch.yml"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "postinstall": "node scripts/setup-python.mjs"
```

</details>

**依据 3 · 源码核查**：[dsh/cordis.patch.yml:1-6](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/dsh/cordis.patch.yml#L1-L6)

实际挂载名

```text
# dsh bundle layer: inserts this package's plugin entry into the profile
# composition. The entry module is resolved from the profile's node_modules
# and must export the cordis function-plugin form (name/inject/apply).
- insert:
    - id: stock-analysis
      name: "@weaxs/dsh-stock-analysis"
```

**依据 4 · 源码核查**：[dsh/index.ts:45-86](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/dsh/index.ts#L45-L86)

解释器选择、Python 调用与返回

<details>
<summary>查看原文（42行）</summary>

```text
// tools/ lives one level up: <pkg>/tools when published (here = dist/), repo tools/ in dev.
const toolsDir = join(here, "..", "tools");
const pkgRoot = dirname(toolsDir);
const isWin = process.platform === "win32";

function pythonBin(): string {
  // Staged-payload layout: the venv may still live at the repo root one level up.
  for (const root of [pkgRoot, join(pkgRoot, "..")]) {
    const candidate = venvPythonPath(root);
    if (existsSync(candidate)) return candidate;
  }
  // On Windows "python3" is usually the Microsoft Store stub — prefer "python".
  return isWin ? "python" : "python3";
}

async function runPy(script: string, args: string[]): Promise<string> {
  return executor(pythonBin(), [join(toolsDir, script), ...args]);
}

// One canonical stdout contract shared by every tool: execute returns the
// CLI's raw JSON text (same relay shape as the pi/openclaw adapters), render
// relays it to the model as a single text block.
const textOutput = {
  schema: { type: "string" as const },
  render: (_args: unknown, value: string) => [{ type: "text" as const, text: value }],
};

function pyTool<const S extends ParameterSchemaSpec>(opts: {
  name: string;
  description: string;
  parameters: S;
  script: string;
  argv: (args: InferArgs<S>) => string[];
}) {
  return defineTool({
    name: opts.name,
    description: opts.description,
    parameters: opts.parameters,
    output: textOutput,
    async execute(args) {
      return runPy(opts.script, opts.argv(args));
    },
```

</details>

**依据 5 · 源码核查**：[dsh/index.ts:119-142](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/dsh/index.ts#L119-L142)

Skill 注册和 Host 依赖

<details>
<summary>查看原文（24行）</summary>

```text
function registerSkills(ctx: Context) {
  if (!existsSync(skillsDir)) return;
  for (const child of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!child.isDirectory()) continue;
    const skillFile = join(skillsDir, child.name, "SKILL.md");
    if (!existsSync(skillFile)) continue;
    const raw = readFileSync(skillFile, "utf-8");
    ctx.skills.register({
      name: child.name,
      description: frontmatterValue(raw, "description") ?? child.name,
      // The registry-facing body drops the frontmatter (metadata is carried by
      // the explicit name/description fields above).
      content: raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trimStart(),
      source: "bundled",
      path: skillFile,
      resourceBase: { kind: "directory", path: join(skillsDir, child.name) },
    });
  }
}

// --- Plugin entry (cordis function-plugin form) ----------------------------

export const name = "stock-analysis";
export const inject = ["tools", "skills"];
```

</details>

#### 缺口

- 未在 DSH 真实加载制品
  **影响**：Host 接线不证明发布文件或工具可用
  **进一步探讨**：在测试 Profile 核对实际包名与一个离线命令

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 按需发现和回测模拟解决什么，不解决什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

Host 可以给本插件的工具集合注册 discovery，条件不满足会早退；有 agent scope 才按已加载集合裁剪展示。它改变提示可见面，不改变底层工具能力。回测读取显式滑点、佣金与印花税参数，并将买入价按滑点调整；这使研究者能审计模拟假设，但并不证明市场有此成交价或原始数据无偏。与零成本的手工策略比较，可在同一历史输入下看参数影响；数据源的覆盖、复权和未来数据泄漏应独立检查。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.ts:2544-2549](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/dsh/index.ts#L2544-L2549)

发现器在工具注册后接入

```text
  }));

  registerSkills(ctx);
  if (config.toolDiscovery !== false) {
    registerToolDiscovery(ctx, new Set(ctx.tools.schemas?.().filter(tool => !previousTools.has(tool.name)).map(tool => tool.name)));
  }
```

**依据 2 · 源码核查**：[dsh/discovery.ts:8-31](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/dsh/discovery.ts#L8-L31)

早退条件与按 agent 状态

<details>
<summary>查看原文（24行）</summary>

```text
export function registerToolDiscovery(ctx: Context, names: Set<string>) {
  if (typeof ctx.on !== "function" || typeof ctx.tools.get !== "function"
      || typeof ctx.tools.presentAs !== "function" || names.size === 0 || ctx.tools.get(SEARCH)) return;

  const states = new WeakMap<object, {catalog: ToolSchema[]; loaded: Set<string>}>();
  ctx.tools.register(defineTool({
    name: SEARCH,
    description: "搜索并加载股票分析工具；支持中文、英文关键词或确切工具名，如财务、get_quote、run_backtest。匹配工具将在下一次模型请求提供完整参数，可按原名直接调用。不会执行分析或扩大权限。",
    parameters: {
      query: {type: "string", required: true, description: "工具名称或功能关键词"},
      limit: {type: "integer", description: "最多加载数量，默认5，范围1到20"},
    },
    output: {schema: {type: "string"}, render: (_args, value) => [{type: "text", text: value}]},
    async execute({query, limit = 5}, exec) {
      const needle = query.trim().toLowerCase();
      const tokens = needle.match(/[a-z0-9_]+|\p{Script=Han}/gu) ?? [];
      const bigrams = (needle.match(/\p{Script=Han}+/gu) ?? [])
        .flatMap(text => [...text].slice(0, -1).map((_, index) => text.slice(index, index + 2)));
      const terms = [...new Set([...tokens, ...bigrams])];
      if (!terms.length || !Number.isInteger(limit) || limit < 1 || limit > 20) {
        return JSON.stringify({error: "query must contain searchable text and limit must be an integer from 1 to 20"});
      }
      const state = exec.agent && states.get(exec.agent);
      if (!state) return JSON.stringify({error: "Tool discovery is unavailable for this agent; use its directly exposed tools"});
```

</details>

**依据 3 · 源码核查**：[dsh/discovery.ts:48-63](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/dsh/discovery.ts#L48-L63)

裁剪可见集合

<details>
<summary>查看原文（16行）</summary>

```text
      return JSON.stringify({loaded: matches.map(({tool}) => ({name: tool.name, description: tool.description}))});
    },
  }));

  ctx.on("system-prompt/assemble", async (_assembly, context, next) => {
    const result = await next();
    if (!context.scope) return result;
    // PTC carries a generated SDK; leave that host-owned presentation intact.
    if (!result.tools.some(tool => tool.name === SEARCH) || result.tools.some(tool => tool.name === "run_code")) {
      states.delete(context.scope);
      return result;
    }
    const state = states.get(context.scope) ?? {catalog: [], loaded: new Set<string>()};
    state.catalog = result.tools.filter(tool => names.has(tool.name));
    states.set(context.scope, state);
    return {...result, tools: result.tools.filter(tool => !names.has(tool.name) || state.loaded.has(tool.name))};
```

</details>

**依据 4 · 源码核查**：[tools/backtest.py:398-412](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/tools/backtest.py#L398-L412)

滑点和费用字段

<details>
<summary>查看原文（15行）</summary>

```text
        raise ValueError("simulation.execution must be next_open or same_close")
    if execution == "next_open" and ("open" not in df or not np.isfinite(df["open"]).all() or (df["open"] <= 0).any()):
        raise ValueError("next_open requires finite positive open prices")
    slippage = float(sim_cfg.get("slippage", 0.001))
    commission = float(sim_cfg.get("commission", 0.0015))
    tax_raw = sim_cfg.get("stamp_tax")  # sell-side only (e.g. A股印花税); absent/empty = 0 (disabled)
    stamp_tax = float(0.0 if tax_raw is None else tax_raw)
    for name, rate in (("slippage", slippage), ("commission", commission), ("stamp_tax", stamp_tax)):
        if not 0 <= rate < 1:
            raise ValueError(f"simulation.{name} must be a rate in [0, 1), got {rate}")
    if commission + stamp_tax >= 1:
        raise ValueError(f"simulation commission + stamp_tax must be < 1, got {commission + stamp_tax}")

    entry = strategy.get("entry", {})
    exit_ = strategy.get("exit", {})
```

</details>

**依据 5 · 源码核查**：[tools/backtest.py:477-496](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/tools/backtest.py#L477-L496)

信号与模拟买价计算

<details>
<summary>查看原文（20行）</summary>

```text
            hit, reason = evaluate_conditions(df, entry_conditions, entry_logic, signal_idx, cache)
            if pending:
                if hit:
                    reason, signal_date = pending
                else:
                    pending = None
            if entry_gate is not None and not entry_gate[signal_idx]:
                hit, pending = False, None
            if hit and not tradable(row, "buy"):
                pending = (reason, signal_date)
                blocked_orders += 1
            if hit and tradable(row, "buy"):
                pending = None
                buy_price = fill_price * (1 + slippage)
                buy_amount = cash * size_frac
                shares = int(buy_amount / (buy_price * (1 + commission)) / lot_size) * lot_size
                if shares <= 0:
                    equity_curve.append({"date": date_str, "equity": round(cash, 2)})
                    continue
                cost = shares * buy_price * (1 + commission)
```

</details>

#### 缺口

- 未检查全部指标和数据源历史覆盖
  **影响**：不证明策略收益、模拟无偏或工具提示节省
  **进一步探讨**：固定公开样本逐笔对照成本和成交规则

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么范围内可以试用复盘？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

适合能验证原始历史数据的研究者在隔离 Profile 运行一次非交易复盘，先选固定数据与明确成本条件。DSH 依赖匹配的工具和 Skill peer，postinstall 可能需要包管理器允许构建；否则系统 Python 未必有数据依赖。持续成本是来源维护、重复核对、网络和计算，错误时要回到原始行情和手工记录，避免以新样本代替缺失。卸载只需按测试 Profile 清理接入并核对残留，本轮未检验真实持久目录。输出仅用于研究工具一致性，不产生交易决策。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:102-127](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/README.md#L102-L127)

安装、构建开关和数据依赖自述

<details>
<summary>查看原文（26行）</summary>

````text
### dsh (DeepSeek Harness) Plugin

```bash
dsh plugin --profile <你的profile> add @weaxs/dsh-stock-analysis
dsh --profile <你的profile>
```

作为 dsh bundle 安装：`dsh plugin add` 会把 `cordis.patch.yml` 叠加进 profile 组合，注册 71 个 tool + 21 个 skill。postinstall 自动建 `.venv`（pnpm 需在 profile 的 `pnpm-workspace.yaml` 里给本包配 `allowBuilds`，否则回退系统 `python3`）。

新版 dsh 的原生函数调用模式默认通过 `stock_tool_search` 按 Agent 搜索、加载所需工具，支持中文关键词或工具名；旧接口、搜索入口不可用时保留全量暴露。可设置 `toolDiscovery: false` 关闭，配置与 PTC 模式边界见下方接入文档。

详见 [`dsh/README.md`](dsh/README.md)。

### Python 依赖

```bash
pip install -r tools/requirements.txt
```

主要依赖：

| 包 | 用途 |
|---|------|
| akshare | A 股数据源（行情、资金流、财务、新闻，含 A 股 ETF） |
| yfinance | 港股 / 美股 / 日股 / 韩股 / 台股数据源 |
| pandas / numpy | 数据处理和数值计算 |
````

</details>

**依据 2 · 源码核查**：[dsh/package.json:52-56](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/dsh/package.json#L52-L56)

DSH peer 范围

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-skill": "^0.0.1-rc.1 || ^0.1.7-rc.1 || ^0.2.0-rc.2 || ^0.2.1-rc.2",
    "@deepseek-ai/dsh-tools": "^0.0.1-rc.1 || ^0.1.7-rc.1 || ^0.2.0-rc.2 || ^0.2.1-rc.2"
  }
```

**依据 3 · 源码核查**：[dsh/index.ts:50-61](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/dsh/index.ts#L50-L61)

虚拟环境失败后的解释器选择

<details>
<summary>查看原文（12行）</summary>

```text
function pythonBin(): string {
  // Staged-payload layout: the venv may still live at the repo root one level up.
  for (const root of [pkgRoot, join(pkgRoot, "..")]) {
    const candidate = venvPythonPath(root);
    if (existsSync(candidate)) return candidate;
  }
  // On Windows "python3" is usually the Microsoft Store stub — prefer "python".
  return isWin ? "python" : "python3";
}

async function runPy(script: string, args: string[]): Promise<string> {
  return executor(pythonBin(), [join(toolsDir, script), ...args]);
```

</details>

#### 缺口

- 未核对市场数据授权和实际可用性
  **影响**：不能承诺各市场行情连续、可比或实时
  **进一步探讨**：只用已许可的固定样本核对数据口径和恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 统一桥接能否降低历史复盘中漏算成本？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是在同一历史样本上，显式回测参数和宿主结果展示可减少手工复盘漏算成本。对照带公式的人工表格和插件工具，固定已知成交时点与费用规则，记录交易序列差异、不可解释价格、核对时间和数据缺失。若输入或复权不同导致难对齐，先修正样本；在同输入仍不能复现人工结果时，退回手工复盘。未拿历史模拟预测未来市场。

#### 证据与依据

**依据 1 · 源码核查**：[tools/backtest.py:398-412](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/tools/backtest.py#L398-L412)

费用假设能成为实验变量

<details>
<summary>查看原文（15行）</summary>

```text
        raise ValueError("simulation.execution must be next_open or same_close")
    if execution == "next_open" and ("open" not in df or not np.isfinite(df["open"]).all() or (df["open"] <= 0).any()):
        raise ValueError("next_open requires finite positive open prices")
    slippage = float(sim_cfg.get("slippage", 0.001))
    commission = float(sim_cfg.get("commission", 0.0015))
    tax_raw = sim_cfg.get("stamp_tax")  # sell-side only (e.g. A股印花税); absent/empty = 0 (disabled)
    stamp_tax = float(0.0 if tax_raw is None else tax_raw)
    for name, rate in (("slippage", slippage), ("commission", commission), ("stamp_tax", stamp_tax)):
        if not 0 <= rate < 1:
            raise ValueError(f"simulation.{name} must be a rate in [0, 1), got {rate}")
    if commission + stamp_tax >= 1:
        raise ValueError(f"simulation commission + stamp_tax must be < 1, got {commission + stamp_tax}")

    entry = strategy.get("entry", {})
    exit_ = strategy.get("exit", {})
```

</details>

**依据 2 · 源码核查**：[tools/backtest.py:477-496](https://github.com/Weaxs/stock-analysis-plugin/blob/4aeb5e8993c3f51eac18ffcc6c5fd53bb86f258d/tools/backtest.py#L477-L496)

成交调整可逐笔检查

<details>
<summary>查看原文（20行）</summary>

```text
            hit, reason = evaluate_conditions(df, entry_conditions, entry_logic, signal_idx, cache)
            if pending:
                if hit:
                    reason, signal_date = pending
                else:
                    pending = None
            if entry_gate is not None and not entry_gate[signal_idx]:
                hit, pending = False, None
            if hit and not tradable(row, "buy"):
                pending = (reason, signal_date)
                blocked_orders += 1
            if hit and tradable(row, "buy"):
                pending = None
                buy_price = fill_price * (1 + slippage)
                buy_amount = cash * size_frac
                shares = int(buy_amount / (buy_price * (1 + commission)) / lot_size) * lot_size
                if shares <= 0:
                    equity_curve.append({"date": date_str, "equity": round(cash, 2)})
                    continue
                cost = shares * buy_price * (1 + commission)
```

</details>

#### 缺口

- 未执行同样本对照
  **影响**：不能确认准确性或节约人时
  **进一步探讨**：用独立手算的小型数据构造可审计基准

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
