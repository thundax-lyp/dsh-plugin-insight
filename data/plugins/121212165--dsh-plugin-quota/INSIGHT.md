# dsh-plugin-quota

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[a705c9d](https://github.com/121212165/dsh-plugin-quota/tree/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota) [![npm 30d 126](https://img.shields.io/static/v1?label=npm+30d&message=126&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota)
<!-- END META -->

> **实现功能**：会话 token/估算花费仪表与趋势预测插件，提供系统提示、命令、Agent 工具及跨插件摘要。

> **核心亮点**：把实时用量注入模型、提供按模型榜单和 summary.json 跨插件接口。详见[Q01](#research-q01)。

> **风险与缺陷**：billingDbPath 的校准只影响显示配置，未改变真实累计/预测；/qm-reset 不清投影，可能继续显示旧用量。详见[Q03](#research-q03)及[Q04](#research-q04)。

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
  - [Q01 · 用量仪表究竟提供哪类预算决策？](#detail-section-11)
  - [Q02 · 会话累计、预测和持久化如何实现？](#detail-section-12)
  - [Q03 · 计费日志自动校准真的覆盖账务价格吗？](#detail-section-13)
  - [Q04 · 清零命令和展示能保持同一账本吗？](#detail-section-14)
  - [Q05 · 试用前应怎样验收可靠性和成本？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长会话观察 token 消耗与预计窗口/预算余量；预算是提示而非硬限制。详见[Q01](#research-q01)。

宿主原始 usage/计费系统可作为对账基准；本插件减少人工观察但仍需价格口径校验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 实时仪表 | 观察用量 | 4步落盘；今日重启归零 |
| 价格校准 | 作者宣称覆盖 | 代码未进入折叠 |
| 清零 | 内存和文件 | 投影状态未重置 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH commands/tools/systemPrompt | 必需 | 入口与展示 | 无面板/工具 |
| session/event usage | 必需 | 实时累计 | 无数据 |
| sessionProjections | 可选 | 回放会话状态 | 退回内存/文件 |
| billingDbPath | 可选 | 作者计费校准 | 当前未改变折叠价格 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 配置 | 设预算、模型匹配和价格 | 明确币种 |
| 观察 | /qm 与 quota_meter | 对照原始 usage |
| 复核 | /qm-reset、重启及 summary | 核同一会话同值 |
| 扩用 | 其他插件读 summary | 先核刷新间隔 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 接入 | DSH 事件/投影/命令/工具 | 配价格与预算 | 宿主兼容未测 |
| 运行 | 每步事件折叠，每4步写盘 | 对账模型价格 | 费用估算偏差未知 |
| 运营 | 手工 /qm 核验 | 排查 reset/重启差异 | 不能作硬闸门 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| token 跟踪 | assistant/message 折叠 | 与宿主账单一致 |
| 预测 | 中位数/分位数外推 | 准确度 |
| 预算 | 系统提示警告 | 强制截断 |

> **思考**：billingDbPath 的校准只影响显示配置，未改变真实累计/预测；/qm-reset 不清投影，可能继续显示旧用量。详见[Q03](#research-q03)及[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把实时用量注入模型、提供按模型榜单和 summary.json 跨插件接口。详见[Q01](#research-q01)。

把实时用量注入模型、提供按模型榜单和 summary.json 跨插件接口。详见[Q01](#research-q01)。

纯函数计数和投影便于复用；账务价格源、reset 与双视图数据源需对齐。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

billingDbPath 的校准只影响显示配置，未改变真实累计/预测；/qm-reset 不清投影，可能继续显示旧用量。详见[Q03](#research-q03)及[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

限定为会话用量趋势工具；需要逐项验证价格、投影、清零和写盘后再让其他插件消费 summary.json。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核功能结构；价格校准未进入账务折叠，清零与投影/卡片存在不一致；宿主未实测。

- 已检查：作者 README、包清单、源码路径 README.md、src/plugin.ts、src/meter.ts、src/projection.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、src/plugin.ts、src/meter.ts、src/projection.ts、包声明；未运行插件/宿主/计费数据库。旧 META 仅复用。
- 下一步：目标宿主启投影，对照已知 usage、仅 billingDbPath、超预算、每1-4步落盘、重启、reset 及工具卡片。

**分析版本**

- **仓库**：[121212165/dsh-plugin-quota](https://github.com/121212165/dsh-plugin-quota)
- **版本号**：0.2.0（[固定提交 a705c9d](https://github.com/121212165/dsh-plugin-quota/tree/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未实现的改进：统一价格来源、让 reset 进入投影语义、展示时明确数据刷新与今日重启边界。详见[Q05](#research-q05)。

目标宿主启投影，对照已知 usage、仅 billingDbPath、超预算、每1-4步落盘、重启、reset 及工具卡片。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 84 | — | — | 1638 |
| .ts | source | 4 | 977 | 769 | 128 | — |
| .ts | test | 3 | 867 | 730 | 51 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/121212165/dsh-plugin-quota/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**实时会话预算仪表的账务、预测与清零是否保持一致，能否承担预算控制？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用量仪表究竟提供哪类预算决策？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

插件把 assistant/message 的 usage 折成会话 token、步数、估算花费，向系统提示注入一行状态，通过 /qm、/qm-top、quota_meter 展示，并把 summary.json 作为跨插件预算摘要。budgetTokens 为0时没有进度条，prices 未配置时只报 token。所谓“预算刹车”是模型看到警告自行收尾，代码没有阻止模型调用的硬限流。适用于人工/Agent 观察会话消耗，不宜作为财务账单或执行预算上限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-30](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/README.md#L5-L30)

作者称实时仪表/预测/刹车

<details>
<summary>查看原文（26行）</summary>

```text
**实时用量仪表 + 下一步预估 + 预算刹车** —— 每回合给模型一行实时 token/花费仪表，预算与上下文撑满都可预测；模型自己看得见，自己刹

[![GitHub stars](https://img.shields.io/github/stars/121212165/dsh-plugin-quota?style=social)](https://github.com/121212165/dsh-plugin-quota/stargazers) [![license](https://img.shields.io/badge/license-MIT-green)](LICENSE) [![tests](https://img.shields.io/badge/tests-node%20--test%20passing-brightgreen)]()

**60 秒上手**：`dsh plugin --profile web add github:121212165/dsh-plugin-quota` → 重启 dsh → 对话里输入 `/qm`（**零配置即用**，配 `prices` 才估钱、配 `budgetTokens` 才有进度条）

<!-- 截图版位：/qm 面板与实时仪表行 web UI 实拍截图 / GIF（待补） -->

</div>

> 🧩 **dsh 插件家族**（22 件）：总目录 **[dsh-plugin-family](https://github.com/121212165/dsh-plugin-family)** ｜ 兄弟插件：**[ide-hub](https://github.com/121212165/dsh-plugin-ide-hub)** 跨 IDE 统一管理 · **[task-forge](https://github.com/121212165/dsh-plugin-task-forge)** 跨窗口无损交接

dsh 插件：**实时用量仪表**——本会话 token/步数/估算花费实时追踪，并给出**下一步预估**与**会话窗口消耗预测**（第几步撑满上下文、第几步烧完预算）；同时是 dsh 插件家族的**通用插件开发测试模板**。

## 它做什么

- **实时追踪**：监听 `session/event`（assistant/message usage），每次模型回复后实时累计本会话的输入/输出/缓存命中 token，带价格表时同时估算花费（微单位累计，显示时格式化）；
- **注入系统提示**：每回合给模型一行实时仪表（`实时用量：13.8k tok / 50k ▰▰▰▱… · 5 步 · ≈0.0153 USD`），预算超限模型自己看得见；
- **/qm 面板**：本会话 + 今日全部会话合计，含预算进度条（`budgetTokens` > 0 时）和超预算警告；
- **下步预估**：`assistant/message` 的 `inputTokens` 就是上一步的未命中前缀，于是下一步的提示词 ≈ 上一步 input + 上一步 output（历史增量）+ 15% 工具结果裕量，缓存前缀按原样复用；输出区间取本会话各步的 P50/P85，按匹配到该模型的那一行价格折算，给成一个区间而不是假装精确的单个数。跑第一步之前**不编数字**，明说"还没有已完成的步"；
- **quota_meter 工具**：模型可自查，调用与结果都渲染成 generic 卡片（`presentCall`/`presentResult`），卡片标题带 `下步 ~30k`；
- **会话窗口消耗预测**（/qm 与 quota_meter 的两行，模型可自查自刹）：
  - **撑满预测**：把每步的提示词读成 `input + cacheRead + output`，步间增量取**中位数**（一条巨型工具结果不能冒充斜率），于是"按当前增速，第 N 步（再 M 步）撑满 128k 上下文"。增速 ≤ 0 就说"看不到撑满的迹象"，一个步都没有就说"还没有已完成的步"，`contextWindow` 没配就说算不出——**绝不印 Infinity / 除零的数**。`contextWindow` 只能来自配置：dsh 不给插件暴露模型目录，所以它挂在 `prices[]` 行上，按匹价格同一个 `priceFor()` 子串命中；
  - **预算预测**：`budgetTokens` 配了才有的数——"按当前增速，再 M 步烧到 100k（已用 53%）"，没预算/没增速同样直说；
  - 注入系统提示的那一行**不变长**（它每回合都跟着走，加字既烧 token 又推前缀漂移），预测只在 /qm 和工具里出现；
- **对家族发布预算契约**：见下表，别的插件读 `summary.json` 就够了，不需要知道会话 id 长什么样。
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:329-366](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L329-L366)

提示注入和 /qm

<details>
<summary>查看原文（38行）</summary>

```text
  if (config.inject) {
    ctx.systemPrompt.section({
      name: 'quota',
      order: 660,
      text: () => {
        try {
          const id = currentSessionId();
          const totals = readProjectedState() ?? (id !== undefined && sessions.has(id) ? sessions.get(id)! : aggregateToday());
          return totals.turns === 0 ? '' : renderCompactLine(totals, options());
        } catch (error) {
          log.warn(`quota section skipped: ${String(error)}`);
          return '';
        }
      },
    });
  }

  ctx.commands.register({
    name: 'qm',
    description: '实时用量仪表：本会话 token/步数/估算花费、下步预估与撑满/烧穿预测，及今日全部会话合计',
    handler: () => {
      const lines: string[] = [];
      const id = currentSessionId();
      const current = readProjectedState() ?? (id !== undefined ? sessions.get(id) : undefined);
      lines.push(renderMeter('▍ 本会话', current ?? emptyTotals(), options()));
      lines.push('');
      lines.push(renderForecastLine(current ? forecastFor(id) : null));
      lines.push(...projectionLines(id));
      lines.push('');
      lines.push(renderMeter('▍ 今日全部', aggregateToday(), options()));
      if (config.budgetTokens > 0 && current) {
        const used = usedOf(current);
        lines.push('');
        lines.push(used > config.budgetTokens ? `⚠ 已超出单会话预算 ${compactTokens(config.budgetTokens)}——收尾或 /qm-reset` : '');
      }
      return { kind: 'success', text: lines.filter((line) => line !== '').join('\n') };
    },
  });
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:402-424](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L402-L424)

quota_meter

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.tools.register(
    defineTool({
      name: 'quota_meter',
      description: '查看当前会话的实时 token 用量、估算花费，以及按当前增速第几步撑满上下文、第几步烧完预算。用户问"花了多少/还剩多少预算/还能跑几步"或长任务开始前自查时用。',
      parameters: {},
      output: {
        schema: { type: 'string' } as const,
        render: (_args, value) => [{ type: 'text', text: value }],
      },
      presentCall: () => presentCallCard('读取实时用量'),
      presentResult: (_args, _result) => {
        const id = currentSessionId();
        const totals = (id !== undefined ? sessions.get(id) : undefined) ?? emptyTotals();
        return presentResultCard(totals, options(), id === undefined ? null : forecastFor(id));
      },
      async execute() {
        const id = currentSessionId();
        const totals = readProjectedState() ?? ((id !== undefined ? sessions.get(id) : undefined) ?? aggregateAll());
        const forecast = id === undefined ? null : forecastFor(id);
        return [renderMeter('会话实时用量', totals, options()), renderForecastLine(forecast), ...projectionLines(id)].join('\n');
      },
    }),
  );
```

</details>

**依据 4 · 源码核查**：[src/meter.ts:107-125](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/meter.ts#L107-L125)

提示词警告只为建议

<details>
<summary>查看原文（19行）</summary>

```text
/** Budget warning grades injected after the gauge: 80% is a heads-up, 100%
 * tells the model to wrap up — the section is the one channel guaranteed to
 * reach the model every turn, so the nudge rides there. */
export function budgetWarningGrade(total: number, budgetTokens: number | undefined): string {
  if (!budgetTokens || budgetTokens <= 0 || !Number.isFinite(budgetTokens)) return '';
  const ratio = total / budgetTokens;
  if (ratio >= 1) return ' · ⚠ 预算已烧穿，强烈建议开新会话';
  if (ratio >= 0.8) return ' · ⚠ 预算已过 80%，注意收尾';
  return '';
}

/** One-line live gauge injected into the system prompt every turn. */
export function renderCompactLine(totals: UsageTotals, options: MeterOptions = {}): string {
  const total = totals.inputTokens + totals.outputTokens;
  const budgetPart = options.budgetTokens && options.budgetTokens > 0 ? ` / ${compactTokens(options.budgetTokens)} ${gauge(total / options.budgetTokens, 8)}` : '';
  const price = options.prices?.[0];
  const money = totals.costMicros > 0 && price ? ` · ≈${formatMoney(totals.costMicros, price.currency)}` : '';
  const warning = budgetWarningGrade(total, options.budgetTokens);
  return `实时用量：${compactTokens(total)} tok${budgetPart} · ${totals.turns} 步${money}${warning}（/qm 详情）`;
```

</details>

#### 缺口

- 目标 DSH 宿主使用量字段和提示注入时机未核
  **影响：**无法保证预算达到阈值后停止消耗
  **进一步探讨：**目标会话对照宿主用量与预算超限行为

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话累计、预测和持久化如何实现？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

注册 quota 会话投影，对提交的 assistant/message usage 纯函数累计并按模型分桶；并行 session/event 内存折叠作今日聚合/无投影降级。下步预测用最近64步、上一输入+输出加15%裕量、输出 P50/P85；窗口撑满按步间 prompt 增长中位数外推，预算按累计量与增速外推。totals/history/summary 原子写，但每4个事件才落盘/发布，内存“今日”跨重启归零，预测不是保证值。

#### 证据与依据

**依据 1 · 源码核查**：[src/projection.ts:58-77](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/projection.ts#L58-L77)

会话投影的事件折叠

<details>
<summary>查看原文（20行）</summary>

```text
/** Factory: prices come from Config at apply() time, the fold itself is pure
 * and synchronous and returns the same reference for unrelated events. */
export const quotaProjection = (prices: PriceRow[]): QuotaProjectionDefinition => ({
  key: 'quota',
  // 1 stays: byModel is schema-defaulted, so pre-byModel checkpoints still validate
  stateVersion: 1,
  stateSchema,
  init: () => ({ ...emptyTotals(), byModel: {} }),
  apply: (state, event) => {
    if (event?.type !== 'assistant/message') return state;
    const usage = event.data?.usage;
    if (!usage) return state;
    const model = event.data?.message?.source?.model ?? 'unknown';
    const cost = costMicrosOf(priceFor(prices, model), usage);
    const totals = addUsage(state, usage);
    const bucket = addUsage(state.byModel[model] ?? emptyTotals(), usage);
    bucket.costMicros = bucket.costMicros + cost;
    return { ...totals, costMicros: totals.costMicros + cost, byModel: { ...state.byModel, [model]: bucket } };
  },
});
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:165-173](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L165-L173)

今日聚合仅内存

```text
  const sessions = new Map<string, TrackedTotals>(Object.entries(store.load()) as Array<[string, TrackedTotals]>);
  /** daily rollup keyed YYYY-MM-DD — session ids are uuids without dates, so
   * "today" cannot be derived by filtering session keys. In-memory only:
   * restarts zero it, a pre-existing behavior /qm-top's 今日 inherits. */
  const daily = new Map<string, TrackedTotals>();
  /** per-session step history + last-seen model: the basis for the next-turn forecast
   * and for both session projections (fill point, budget burn-out) */
  const histories = new Map<string, StepUsage[]>(Object.entries(store.loadHistory()));
  const lastModel = new Map<string, string>();
```

**依据 3 · 源码核查**：[src/plugin.ts:246-260](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L246-L260)

每4事件刷盘

<details>
<summary>查看原文（15行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    if (event.type !== 'assistant/message') return;
    const usage = (event.data as { usage?: RawUsage }).usage;
    if (!usage) return;
    const sessionId = String((session as { id?: unknown }).id ?? 'session');
    const model = (event.data as { message?: { source?: { model?: string } } }).message?.source?.model ?? 'unknown';
    fold(sessions, sessionId, usage, model);
    fold(daily, today(), usage, model);
    histories.set(sessionId, [...(histories.get(sessionId) ?? []), stepOf(usage)].slice(-HISTORY_LIMIT));
    lastModel.set(sessionId, model);
    if (++dirty % 4 === 0) {
      store.save(Object.fromEntries(sessions));
      store.saveHistory(Object.fromEntries(histories));
      publish();
    }
```

</details>

**依据 4 · 源码核查**：[src/meter.ts:194-214](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/meter.ts#L194-L214)

下步估计

<details>
<summary>查看原文（21行）</summary>

```text
export function predictNextTurn(history: readonly StepUsage[], price: PriceRow | null): TurnForecast | null {
  const steps = usableSteps(history);
  if (!steps.length) return null;
  const last = steps[steps.length - 1]!;
  const inputEst = Math.round((last.input + last.output) * (1 + TOOL_SLACK));
  const cacheReadEst = last.cacheRead;
  const outputs = steps.map((step) => step.output);
  const outputP50 = percentile(outputs, 0.5);
  const outputP85 = percentile(outputs, 0.85);
  const at = (output: number): number => costMicrosOf(price, { inputTokens: inputEst, outputTokens: output, cacheReadTokens: cacheReadEst });
  return {
    inputEst,
    cacheReadEst,
    promptEst: inputEst + cacheReadEst,
    outputP50,
    outputP85,
    costP50Micros: at(outputP50),
    costP85Micros: at(outputP85),
    currency: price?.currency ?? null,
    basis: steps.length,
  };
```

</details>

**依据 5 · 源码核查**：[src/meter.ts:233-286](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/meter.ts#L233-L286)

窗口/预算外推

<details>
<summary>查看原文（54行）</summary>

```text
/** Median step-to-step prompt growth: a single huge tool result must not fake the
 * slope, so the middle delta wins and the mean never does. 0 below two steps. */
export function promptGrowth(history: readonly StepUsage[]): number {
  const steps = usableSteps(history);
  if (steps.length < 2) return 0;
  return percentile(steps.slice(1).map((step, index) => promptOf(step) - promptOf(steps[index]!)), 0.5);
}

export interface WindowProjection {
  /** prompt tokens in front of the model at the last observed step */
  promptNow: number;
  growthPerStep: number;
  /** more steps before promptNow reaches contextWindow; null = no honest fill point */
  stepsToFull: number | null;
  /** session step index where it fills; null with no fill point */
  fullAtStep: number | null;
  /** false for a flat or shrinking session — those never fill up */
  willGrow: boolean;
  /** steps behind the reading; under 2 the slope is not observable yet */
  basis: number;
}

/** When does this session's context window fill up? `observedSteps` is the session's
 * true step count when the retained history is shorter than the session (history is
 * capped per session), so the printed index is not off by the trim. */
export function projectWindow(history: readonly StepUsage[], contextWindow: number, observedSteps?: number): WindowProjection {
  const steps = usableSteps(history);
  const promptNow = steps.length ? promptOf(steps[steps.length - 1]!) : 0;
  const growthPerStep = promptGrowth(steps);
  const willGrow = growthPerStep > 0;
  const usable = Number.isFinite(contextWindow) && contextWindow > 0;
  let stepsToFull: number | null = null;
  if (usable && promptNow >= contextWindow) stepsToFull = 0;
  else if (usable && willGrow) stepsToFull = Math.ceil((contextWindow - promptNow) / growthPerStep);
  const at = Math.max(steps.length, observedSteps ?? 0);
  return { promptNow, growthPerStep, stepsToFull, fullAtStep: stepsToFull === null ? null : at + stepsToFull, willGrow, basis: steps.length };
}

export interface BudgetProjection {
  totalUsed: number;
  budgetTokens: number;
  /** steps until cumulative usage crosses the budget; null = no budget or no growth,
   * 0 = already crossed */
  stepsLeft: number | null;
  /** used/budget; null when there is no budget, so no ratio exists to report */
  ratio: number | null;
}

/** How many steps of this session's own growth still fit in `budgetTokens`. */
export function projectBudget(totalUsed: number, budgetTokens: number, growthPerStep: number): BudgetProjection {
  if (!Number.isFinite(budgetTokens) || budgetTokens <= 0) return { totalUsed, budgetTokens, stepsLeft: null, ratio: null };
  const remaining = budgetTokens - totalUsed;
  const stepsLeft = remaining <= 0 ? 0 : growthPerStep > 0 ? Math.ceil(remaining / growthPerStep) : null;
  return { totalUsed, budgetTokens, stepsLeft, ratio: totalUsed / budgetTokens };
```

</details>

#### 缺口

- 目标宿主投影注册/回放与会话事件重复投递未测
  **影响：**预测偏差/重启损失无法量化
  **进一步探讨：**目标宿主跨重启/分叉和长工具输出对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 计费日志自动校准真的覆盖账务价格吗？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

配置文案声称 billingDbPath 从 new-api 日志反推真实价格并覆盖 prices。代码只把校准行放进 options() 用于显示；投影和内存 fold 的 costMicros、forecastFor、窗口匹配仍用 config.prices。若仅配置 billingDbPath 而未配置 prices，累计 costMicros 始终为0，页面也不出现花费；若两者皆有，显示货币可能取校准 USD，但累计数字按原配置折算，存在单位/含义不一致。校准公式还把所有 token 使用同一平均单价，无法还原输入/输出/缓存分价。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:65-80](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L65-L80)

配置文字称覆盖价格

<details>
<summary>查看原文（16行）</summary>

```text
export const Config = Schema.object({
  enabled: Schema.boolean().default(true),
  dataPath: Schema.string(),
  budgetTokens: Schema.natural().default(0).description('单会话 token 预算，0 = 不显示进度条'),
  billingDbPath: Schema.string().description('new-api 的 one-api.db 路径；配置后自动从计费日志反推真实 $/M 价格，覆盖 prices'),
  inject: Schema.boolean().default(true).description('把实时仪表注入系统提示'),
  prices: Schema.array(
    Schema.object({
      match: Schema.string(),
      currency: Schema.string().default('CNY'),
      perMillion: Schema.object({
        input: Schema.number().default(0),
        output: Schema.number().default(0),
        cacheRead: Schema.number().default(0),
      }),
      contextWindow: Schema.number().description('该模型的上下文窗口，撑满预测的根据；缺省则不算撑满点'),
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:176-205](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L176-L205)

校准仅进入 options，投影注册仍用 config.prices

<details>
<summary>查看原文（30行）</summary>

```text
  let calibrated: PriceRow[] = [];
  if (config.billingDbPath) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const db = new DatabaseSync(expandHome(config.billingDbPath), { readOnly: true });
      const rows = db
        .prepare("SELECT model_name, quota, prompt_tokens + completion_tokens AS tokens FROM logs WHERE type = 2 ORDER BY created_at DESC LIMIT 500")
        .all() as Array<{ model_name: string; quota: number; tokens: number }>;
      db.close();
      calibrated = calibratePrices(rows.map((row) => ({ model: row.model_name, quota: Number(row.quota), tokens: Number(row.tokens) })));
      if (calibrated.length) log.info(`prices calibrated from billing logs: ${calibrated.length} models`);
    } catch (error) {
      log.warn(`price calibration skipped: ${String(error)}`);
    }
  }

  const options = (): { budgetTokens?: number; prices?: PriceRow[] } => ({
    ...(config.budgetTokens > 0 ? { budgetTokens: config.budgetTokens } : {}),
    ...(calibrated.length ? { prices: calibrated } : config.prices.length ? { prices: config.prices } : {}),
  });

  // Official projection model: the registry folds committed events eagerly and
  // replays the log on fork/resume, so per-session totals survive restarts —
  // the in-memory map below remains only for the daily rollup and as a
  // fallback when the projection seam is absent.
  try {
    (ctx as unknown as { inject?: (services: string[], setup: (sp: { register?: (definition: unknown) => unknown }) => void) => void }).inject?.(
      ['sessionProjections'],
      (sp) => {
        sp.register?.(quotaProjection(config.prices));
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:229-240](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L229-L240)

内存账务用 config.prices

<details>
<summary>查看原文（12行）</summary>

```text
  const fold = (map: Map<string, TrackedTotals>, key: string, usage: RawUsage, model: string): void => {
    let totals = map.get(key);
    if (!totals) {
      totals = { ...emptyTotals(), byModel: {} };
      map.set(key, totals);
    }
    const cost = costMicrosOf(priceFor(config.prices, model), usage);
    const folded = addUsage(totals, usage);
    folded.costMicros = totals.costMicros + cost;
    const buckets = { ...(totals.byModel ?? {}) };
    const bucket = addUsage(buckets[model] ?? emptyTotals(), usage);
    bucket.costMicros = bucket.costMicros + cost;
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:263-271](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L263-L271)

预测与窗口用 config.prices

```text
  const forecastFor = (sessionId: string | undefined) =>
    predictNextTurn(sessionId === undefined ? [] : histories.get(sessionId) ?? [], sessionId === undefined ? null : priceFor(config.prices, lastModel.get(sessionId) ?? 'unknown'));

  const usedOf = (totals: UsageTotals | undefined): number => totals ? totals.inputTokens + totals.outputTokens : 0;

  /** dsh gives plugins no model catalogue, so the context window comes from config —
   * the same price row that matched the model, or no fill point at all. */
  const contextWindowOf = (sessionId: string | undefined): number | null =>
    sessionId === undefined ? null : priceFor(config.prices, lastModel.get(sessionId) ?? 'unknown')?.contextWindow ?? null;
```

**依据 5 · 源码核查**：[src/meter.ts:414-435](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/meter.ts#L414-L435)

平均单价校准公式

<details>
<summary>查看原文（22行）</summary>

```text
/** Derive real prices from the relay's own billing logs: $/M per model = quota
 * / 500000 (new-api's $1) / tokens * 1e6, averaged over each model's calls.
 * These are the numbers the user is ACTUALLY billed, not brochure prices. */
export function calibratePrices(rows: BillingRow[]): PriceRow[] {
  const buckets = new Map<string, { billed: number; tokens: number; calls: number }>();
  for (const row of rows) {
    if (!row.model || !Number.isFinite(row.quota) || row.quota <= 0 || !Number.isFinite(row.tokens) || row.tokens <= 0) continue;
    const bucket = buckets.get(row.model) ?? { billed: 0, tokens: 0, calls: 0 };
    bucket.billed += row.quota;
    bucket.tokens += row.tokens;
    bucket.calls += 1;
    buckets.set(row.model, bucket);
  }
  const prices: PriceRow[] = [];
  for (const [model, bucket] of buckets) {
    if (bucket.tokens < 1000) continue; // not enough data to be meaningful
    const usdPerMillion = (bucket.billed / bucket.tokens) * 1e6 / 500_000;
    if (!Number.isFinite(usdPerMillion) || usdPerMillion <= 0) continue;
    const rounded = Math.round(usdPerMillion * 100) / 100;
    prices.push({ match: model, currency: 'USD', perMillion: { input: rounded, output: rounded, cacheRead: rounded } });
  }
  return prices.sort((a, b) => a.match.localeCompare(b.match));
```

</details>

#### 缺口

- 真实 new-api DB schema/币种与宿主价格未测
  **影响：**估计成本可能为零或币种错配，影响预算判断
  **进一步探讨：**隔离样本 DB 与已知价格逐字段对账

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 清零命令和展示能保持同一账本吗？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

/qm-reset 清空内存会话、今日、历史与 JSON，随后发布摘要；但没有重置已注册的官方会话投影。/qm、/qm-top、systemPrompt 与 quota_meter 执行优先读 readProjectedState，故投影可用时当前会话仍呈旧累计，而下一步预测/summary 已清零，形成仪表不一致。quota_meter 的 presentResult 又总读内存 totals，而 execute 优先读投影，工具卡片与文本也可能不同。需明确重置投影或把 reset 语义改为只清本地数据并清楚标示。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:197-220](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L197-L220)

投影注册与优先读取

<details>
<summary>查看原文（24行）</summary>

```text
  // Official projection model: the registry folds committed events eagerly and
  // replays the log on fork/resume, so per-session totals survive restarts —
  // the in-memory map below remains only for the daily rollup and as a
  // fallback when the projection seam is absent.
  try {
    (ctx as unknown as { inject?: (services: string[], setup: (sp: { register?: (definition: unknown) => unknown }) => void) => void }).inject?.(
      ['sessionProjections'],
      (sp) => {
        sp.register?.(quotaProjection(config.prices));
        log.info('quota projection registered');
      },
    );
  } catch (error) {
    log.warn(`projection registration skipped: ${String(error)}`);
  }

  const readProjectedState = (): QuotaState | null => {
    try {
      const session = (ctx as unknown as { agents?: { currentInitiator?: () => { session?: unknown } | undefined } | undefined }).agents?.currentInitiator?.()?.session;
      if (!session) return null;
      const sp = (ctx as unknown as { sessionProjections?: { stateOf?: (session: unknown, key: string) => QuotaState | undefined } | undefined }).sessionProjections;
      return sp?.stateOf?.(session, 'quota') ?? null;
    } catch {
      return null;
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:329-378](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L329-L378)

系统提示/命令优先投影

<details>
<summary>查看原文（50行）</summary>

```text
  if (config.inject) {
    ctx.systemPrompt.section({
      name: 'quota',
      order: 660,
      text: () => {
        try {
          const id = currentSessionId();
          const totals = readProjectedState() ?? (id !== undefined && sessions.has(id) ? sessions.get(id)! : aggregateToday());
          return totals.turns === 0 ? '' : renderCompactLine(totals, options());
        } catch (error) {
          log.warn(`quota section skipped: ${String(error)}`);
          return '';
        }
      },
    });
  }

  ctx.commands.register({
    name: 'qm',
    description: '实时用量仪表：本会话 token/步数/估算花费、下步预估与撑满/烧穿预测，及今日全部会话合计',
    handler: () => {
      const lines: string[] = [];
      const id = currentSessionId();
      const current = readProjectedState() ?? (id !== undefined ? sessions.get(id) : undefined);
      lines.push(renderMeter('▍ 本会话', current ?? emptyTotals(), options()));
      lines.push('');
      lines.push(renderForecastLine(current ? forecastFor(id) : null));
      lines.push(...projectionLines(id));
      lines.push('');
      lines.push(renderMeter('▍ 今日全部', aggregateToday(), options()));
      if (config.budgetTokens > 0 && current) {
        const used = usedOf(current);
        lines.push('');
        lines.push(used > config.budgetTokens ? `⚠ 已超出单会话预算 ${compactTokens(config.budgetTokens)}——收尾或 /qm-reset` : '');
      }
      return { kind: 'success', text: lines.filter((line) => line !== '').join('\n') };
    },
  });

  ctx.commands.register({
    name: 'qm-top',
    description: '按模型用量排行：本会话与今日全部会话的分模型 Top5（/qm-top）',
    handler: () => {
      try {
        const id = currentSessionId();
        const current = readProjectedState() ?? (id !== undefined ? sessions.get(id) : undefined);
        const todayTotals = daily.get(today());
        return {
          kind: 'success',
          text: [renderModelTop('▍ 本会话', current?.byModel, options()), '', renderModelTop('▍ 今日全部', todayTotals?.byModel, options())].join('\n'),
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:386-400](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L386-L400)

reset 仅清内存和文件

<details>
<summary>查看原文（15行）</summary>

```text
  ctx.commands.register({
    name: 'qm-reset',
    description: '清零实时用量仪表（全部会话），/qm 重新计',
    handler: () => {
      const count = sessions.size;
      sessions.clear();
      daily.clear();
      histories.clear();
      lastModel.clear();
      store.save({});
      store.saveHistory({});
      publish();
      return { kind: 'success', text: `已清零 ${count} 个会话的仪表，从下一步重新计。` };
    },
  });
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:411-421](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L411-L421)

卡片读内存，正文优先投影

<details>
<summary>查看原文（11行）</summary>

```text
      presentCall: () => presentCallCard('读取实时用量'),
      presentResult: (_args, _result) => {
        const id = currentSessionId();
        const totals = (id !== undefined ? sessions.get(id) : undefined) ?? emptyTotals();
        return presentResultCard(totals, options(), id === undefined ? null : forecastFor(id));
      },
      async execute() {
        const id = currentSessionId();
        const totals = readProjectedState() ?? ((id !== undefined ? sessions.get(id) : undefined) ?? aggregateAll());
        const forecast = id === undefined ? null : forecastFor(id);
        return [renderMeter('会话实时用量', totals, options()), renderForecastLine(forecast), ...projectionLines(id)].join('\n');
```

</details>

#### 缺口

- 目标宿主 reset 时投影状态是否有外部清理机制未核
  **影响：**用户可能误信清零或展示矛盾
  **进一步探讨：**宿主投影启用下触发 reset 比较命令/工具/摘要

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 试用前应怎样验收可靠性和成本？

**研究主题：**采用判断、新假设与验证、依赖、兼容与流程

#### 完整回答

可在具备 DSH commands/tools/systemPrompt/sessionProjections 的测试 profile 安装，先配明确模型价格及预算，运行已知 usage 步数，对照 /qm、工具卡片、summary.json 与宿主原始统计；随后测未配置价、仅 billingDbPath、重启、/qm-reset、超预算。可靠使用条件是价格口径一致、投影/内存同值、今日跨重启语义被理解；否则只采 token 趋势，禁作硬预算闸门。改进可统一有效价格表、明确持久化/今日口径并使 reset 处理投影。目标效果均未实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-68](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/README.md#L48-L68)

作者安装/配置

<details>
<summary>查看原文（21行）</summary>

````text
## 安装

```bash
dsh plugin --profile <你的profile> add github:121212165/dsh-plugin-quota
```

重启 dsh 即用（默认配置就能工作：仪表注入 + `/qm` 面板）。需要预算进度条或估花费时，把本仓库根目录 `cordis.patch.yml` 里的 `budgetTokens` / `prices` 示例**并进** profile 的 `cordis.patch.yml`（并进同一个 YAML 数组，不要另起文档追加）。price-aware 是官方面向宿主侧的参考实现，与本插件用 `accounting: own|assume-price-aware` 共存，不冲突。

## 配置

```yaml
budgetTokens: 0      # 单会话 token 预算，0 = 不显示进度条
inject: true         # 实时仪表注入系统提示
prices:              # 按模型 id 子串匹配，命中才估花费
  - match: space-bunny
    currency: USD
    perMillion: { input: 1, output: 2, cacheRead: 0.1 }
    contextWindow: 128000   # 撑满预测的根据；缺省则该模型只报下步预估，不算撑满点
```

`contextWindow` 必须是正有限数，否则启动即报错点名 `quota: prices[].contextWindow ...`。只想给窗口不想要价格时，把 `perMillion` 留默认 0 即可（估花费自然不出现）。
````

</details>

**依据 2 · 源码核查**：[src/plugin.ts:53-83](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L53-L83)

注入和配置

<details>
<summary>查看原文（31行）</summary>

```text
export const name = 'quota';
export const inject = ['commands', 'tools', 'systemPrompt'];

export interface Config {
  enabled: boolean;
  dataPath?: string;
  budgetTokens: number;
  inject: boolean;
  prices: PriceRow[];
  billingDbPath?: string;
}

export const Config = Schema.object({
  enabled: Schema.boolean().default(true),
  dataPath: Schema.string(),
  budgetTokens: Schema.natural().default(0).description('单会话 token 预算，0 = 不显示进度条'),
  billingDbPath: Schema.string().description('new-api 的 one-api.db 路径；配置后自动从计费日志反推真实 $/M 价格，覆盖 prices'),
  inject: Schema.boolean().default(true).description('把实时仪表注入系统提示'),
  prices: Schema.array(
    Schema.object({
      match: Schema.string(),
      currency: Schema.string().default('CNY'),
      perMillion: Schema.object({
        input: Schema.number().default(0),
        output: Schema.number().default(0),
        cacheRead: Schema.number().default(0),
      }),
      contextWindow: Schema.number().description('该模型的上下文窗口，撑满预测的根据；缺省则不算撑满点'),
    }),
  ).default([]),
});
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:246-260](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L246-L260)

持久化间隔

<details>
<summary>查看原文（15行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    if (event.type !== 'assistant/message') return;
    const usage = (event.data as { usage?: RawUsage }).usage;
    if (!usage) return;
    const sessionId = String((session as { id?: unknown }).id ?? 'session');
    const model = (event.data as { message?: { source?: { model?: string } } }).message?.source?.model ?? 'unknown';
    fold(sessions, sessionId, usage, model);
    fold(daily, today(), usage, model);
    histories.set(sessionId, [...(histories.get(sessionId) ?? []), stepOf(usage)].slice(-HISTORY_LIMIT));
    lastModel.set(sessionId, model);
    if (++dirty % 4 === 0) {
      store.save(Object.fromEntries(sessions));
      store.saveHistory(Object.fromEntries(histories));
      publish();
    }
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:386-424](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L386-L424)

reset/工具呈现

<details>
<summary>查看原文（39行）</summary>

```text
  ctx.commands.register({
    name: 'qm-reset',
    description: '清零实时用量仪表（全部会话），/qm 重新计',
    handler: () => {
      const count = sessions.size;
      sessions.clear();
      daily.clear();
      histories.clear();
      lastModel.clear();
      store.save({});
      store.saveHistory({});
      publish();
      return { kind: 'success', text: `已清零 ${count} 个会话的仪表，从下一步重新计。` };
    },
  });

  ctx.tools.register(
    defineTool({
      name: 'quota_meter',
      description: '查看当前会话的实时 token 用量、估算花费，以及按当前增速第几步撑满上下文、第几步烧完预算。用户问"花了多少/还剩多少预算/还能跑几步"或长任务开始前自查时用。',
      parameters: {},
      output: {
        schema: { type: 'string' } as const,
        render: (_args, value) => [{ type: 'text', text: value }],
      },
      presentCall: () => presentCallCard('读取实时用量'),
      presentResult: (_args, _result) => {
        const id = currentSessionId();
        const totals = (id !== undefined ? sessions.get(id) : undefined) ?? emptyTotals();
        return presentResultCard(totals, options(), id === undefined ? null : forecastFor(id));
      },
      async execute() {
        const id = currentSessionId();
        const totals = readProjectedState() ?? ((id !== undefined ? sessions.get(id) : undefined) ?? aggregateAll());
        const forecast = id === undefined ? null : forecastFor(id);
        return [renderMeter('会话实时用量', totals, options()), renderForecastLine(forecast), ...projectionLines(id)].join('\n');
      },
    }),
  );
```

</details>

**依据 5 · 源码核查**：[src/meter.ts:107-125](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/meter.ts#L107-L125)

软警告

<details>
<summary>查看原文（19行）</summary>

```text
/** Budget warning grades injected after the gauge: 80% is a heads-up, 100%
 * tells the model to wrap up — the section is the one channel guaranteed to
 * reach the model every turn, so the nudge rides there. */
export function budgetWarningGrade(total: number, budgetTokens: number | undefined): string {
  if (!budgetTokens || budgetTokens <= 0 || !Number.isFinite(budgetTokens)) return '';
  const ratio = total / budgetTokens;
  if (ratio >= 1) return ' · ⚠ 预算已烧穿，强烈建议开新会话';
  if (ratio >= 0.8) return ' · ⚠ 预算已过 80%，注意收尾';
  return '';
}

/** One-line live gauge injected into the system prompt every turn. */
export function renderCompactLine(totals: UsageTotals, options: MeterOptions = {}): string {
  const total = totals.inputTokens + totals.outputTokens;
  const budgetPart = options.budgetTokens && options.budgetTokens > 0 ? ` / ${compactTokens(options.budgetTokens)} ${gauge(total / options.budgetTokens, 8)}` : '';
  const price = options.prices?.[0];
  const money = totals.costMicros > 0 && price ? ` · ≈${formatMoney(totals.costMicros, price.currency)}` : '';
  const warning = budgetWarningGrade(total, options.budgetTokens);
  return `实时用量：${compactTokens(total)} tok${budgetPart} · ${totals.turns} 步${money}${warning}（/qm 详情）`;
```

</details>

#### 缺口

- 目标宿主 API 兼容、计费准确性和开销未知
  **影响：**试用不能推断为生产财务控制
  **进一步探讨：**目标宿主隔离 profile 完整验收上述矩阵

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
