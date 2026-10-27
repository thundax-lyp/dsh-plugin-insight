# dsh-plugin-quota

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f9a0f0f](https://github.com/121212165/dsh-plugin-quota/tree/f9a0f0fffbb9254da65a1a0925c73ba169c143c0)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/121212165/dsh-plugin-quota) [![npm 30d 93](https://img.shields.io/static/v1?label=npm+30d&message=93&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-quota) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-quota)
<!-- END META -->

> **功能**：追踪会话 token 与估算花费，提供仪表、下步用量及上下文窗口预测。

> **亮点**：将事后 usage 组织成模型可读提示和用户可查的下一步预估，属于会话决策集成增量；不是强制预算控制。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：软提示无法保证预算刹车；reset 未同步已提交事件 projection，且校准价格与累计价格路径不同，需验证账本一致性。见 [Q03](#research-q03)。

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
  - [Q01 · 仪表给谁提供什么额外决策？](#detail-section-11)
  - [Q02 · 预测与账本如何形成？](#detail-section-12)
  - [Q03 · 预算刹车和重置是否可靠？](#detail-section-13)
  - [Q04 · 配置和总成本是什么？](#detail-section-14)
  - [Q05 · 怎样验证可靠状态契约？](#detail-section-15)
  - [Q06 · 谁可试用以及何时停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长会话使用者在继续前查看用量和预测，以决策收尾；不以此保证硬现金上限。

人工查 provider usage 与账单是简单替代；仪表减少查找步骤但不替代账单，也不证明自动节省。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 用量面板与排行 | 查会话/今日模型用量 | 今日内存汇总非持久账单 |
| 预算/窗口预测 | 辅助决定下一步 | 需预算/窗口配置，非强制限制 |
| 模型可读仪表 | 提示模型预算状态 | 模型是否遵守未知 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node≥22.18、DSH commands/tools/systemPrompt | 启动必需 | 运行与注册界面 | 不满足则停止安装 |
| 准确价格和 contextWindow | 金额/窗口预测必需 | 费用与撑满估算 | 缺失不作精确预算判断 |
| sessionProjections | 恢复增强可选 | 从已提交事件恢复会话量 | 使用本地 Map fallback，需核对口径 |
| 只读 SQLite billingDbPath | 校准价格可选 | 读取最近计费日志 | 失败日志警告，回配置价格 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户配置预算、价格、窗口 | 与真实 provider 语义一致 |
| 2 | 用户以固定事件核对 qm/工具/提示/summary | 四入口金额与 token 一致 |
| 3 | 用户重置、重启并禁用 | 无旧账回流或重复计数，否则停止依赖 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/宿主和本地存储，金额未知 | 校准价格、预算与窗口，耗时未知 | usage 语义需对账 |
| 持续使用 | 提示 token 与文件写入，量未知 | 更新价格和窗口 | 无节省实测 |
| 失败恢复 | 重放/重试资源未知 | 核对文件损坏、重启与清零 | 日汇总内存状态会丢失 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 用量可见性 | 提示/命令/工具均接线 | 实际模型会否收尾 |
| 下一步预测 | 历史与窗口投影函数存在 | 误差和节费效果 |
| 账本恢复 | 文件与投影有路径 | reset、重启与校准一致性 |

> **思考**：软提示无法保证预算刹车；reset 未同步已提交事件 projection，且校准价格与累计价格路径不同，需验证账本一致性。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将事后 usage 组织成模型可读提示和用户可查的下一步预估，属于会话决策集成增量；不是强制预算控制。见 [Q01](#research-q01)、[Q02](#research-q02)。

meter 与 projection 纯函数适合复用；接线模块同时维护本地和事件投影，需为清零与价格更新定义统一语义。每文件原子替换不等于跨文件事务；异常回空应在读者预算界面明确标记。

<a id="detail-section-5"></a>

### 1.4 主要限制

软提示无法保证预算刹车；reset 未同步已提交事件 projection，且校准价格与累计价格路径不同，需验证账本一致性。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察；先验证 projection、重置、校准与四个读取入口一致，禁止当硬预算器使用。见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持用量投影与软提示；费用精度、重置一致性和节省效果未验证；统一读模型假设未验证。

- 已检查：作者 README、包清单、源码路径 src/plugin.ts、src/projection.ts、src/meter.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查；未执行目标代码、测试、数据库访问或宿主安装；未确认 provider usage 与实际账单一致。
- 下一步：固定事件序列逐笔对账，再做清零/重启/分叉及校准矩阵；统计误差、超额量、合格交付率和人工修正时间。

**分析版本**

- **仓库**：[121212165/dsh-plugin-quota](https://github.com/121212165/dsh-plugin-quota)
- **版本号**：0.2.0（[固定提交 f9a0f0f](https://github.com/121212165/dsh-plugin-quota/tree/f9a0f0fffbb9254da65a1a0925c73ba169c143c0)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的可重放清零基线与统一读模型可能减少多入口漂移；用固定事件、清零、重启及分叉矩阵证伪。见 [Q05](#research-q05)。

固定事件序列逐笔对账，再做清零/重启/分叉及校准矩阵；统计误差、超额量、合格交付率和人工修正时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 684 | 612 | 74 | — |
| .md | source | 1 | 84 | — | — | 1638 |
| .ts | source | 4 | 977 | 769 | 128 | — |
| .ts | test | 3 | 867 | 730 | 51 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-quota/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-quota/issues?q=is%3Aissue+created%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-quota/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：quota 能否把会话用量变成可靠的预算决策依据，而非仅显示事后统计？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 仪表给谁提供什么额外决策？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是运行长会话、需要在下一步前判断剩余预算的 DSH 使用者。合格结果应是用户知道已用量、估算下一步与窗口余量，并据此决定收尾或继续；不是仅多一张 token 卡。相对人工查响应 usage，插件将每步用量折叠、在系统提示注入简短仪表，并通过命令和工具提供预估。作者“模型自己刹”描述的是模型读取提示后的行为，并非确定性控制。原创范围应限定在这些信息组织和投影接线，README 已说明借鉴官方 presentation 与其他家族插件，不能将通用事件累计视为新算法。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-33](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/README.md#L17-L33)

作者列实时累计、提示、预测及家族契约

<details>
<summary>查看原文（17行）</summary>

```text
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

## 落盘与跨插件契约

```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:329-365](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L329-L365)

提示及 qm 命令是展示，不是调用拦截

<details>
<summary>查看原文（37行）</summary>

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
```

</details>

#### 缺口

- 缺少用户在预算临界任务中的决策样本
  **影响**：无法确认提示是否改变实际成本
  **进一步探讨**：比较同任务有/无仪表的合格率、超额量和人工投入

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预测与账本如何形成？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

assistant/message 事件有 usage 才累计，记录最后64步；每4步保存 totals、history 与 summary。会话 projection 另按已提交事件累计，可在宿主支持时优先读取；日汇总则仅保存在内存，重启会清空，且日期取 UTC。窗口预估从历史 prompt 增长与配置窗口推演，预算与窗口不是同一量，不能把线性预测当未来调用保障。分离纯 meter、projection、接线模块有利于复用，但正式 projection 与本地 Map 同时存在，展示渠道必须核对同一口径。文件 rename 只保证每个文件写入替换，不等于三个文件是一个跨文件事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:161-174](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L161-L174)

内存日汇总与64步历史状态

<details>
<summary>查看原文（14行）</summary>

```text
  const store = new MeterStore(config.dataPath);
  /** tracked totals carry per-model buckets for /qm-top; files written before
   * byModel existed simply lack the key, so it stays optional on read. */
  type TrackedTotals = UsageTotals & { byModel?: Record<string, UsageTotals> };
  const sessions = new Map<string, TrackedTotals>(Object.entries(store.load()) as Array<[string, TrackedTotals]>);
  /** daily rollup keyed YYYY-MM-DD — session ids are uuids without dates, so
   * "today" cannot be derived by filtering session keys. In-memory only:
   * restarts zero it, a pre-existing behavior /qm-top's 今日 inherits. */
  const daily = new Map<string, TrackedTotals>();
  /** per-session step history + last-seen model: the basis for the next-turn forecast
   * and for both session projections (fill point, budget burn-out) */
  const histories = new Map<string, StepUsage[]>(Object.entries(store.loadHistory()));
  const lastModel = new Map<string, string>();
  let dirty = 0;
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:246-260](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L246-L260)

usage 事件累计与每4步落盘

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

**依据 3 · 源码核查**：[src/plugin.ts:268-303](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L268-L303)

窗口和预算投影及跨插件 summary

<details>
<summary>查看原文（36行）</summary>

```text
  /** dsh gives plugins no model catalogue, so the context window comes from config —
   * the same price row that matched the model, or no fill point at all. */
  const contextWindowOf = (sessionId: string | undefined): number | null =>
    sessionId === undefined ? null : priceFor(config.prices, lastModel.get(sessionId) ?? 'unknown')?.contextWindow ?? null;

  /** the two session projections: when the window fills, when the budget burns out */
  const projectFor = (sessionId: string | undefined) => {
    const history = sessionId === undefined ? [] : histories.get(sessionId) ?? [];
    const contextWindow = contextWindowOf(sessionId);
    const window = contextWindow === null ? null : projectWindow(history, contextWindow, sessionId === undefined ? 0 : sessions.get(sessionId)?.turns);
    const budget = projectBudget(usedOf(sessionId === undefined ? undefined : sessions.get(sessionId)), config.budgetTokens, promptGrowth(history));
    return { contextWindow, window, budget };
  };

  const projectionLines = (sessionId: string | undefined): string[] => {
    const { contextWindow, window, budget } = projectFor(sessionId);
    return [renderWindowLine(window, contextWindow), renderBudgetLine(budget)];
  };

  /** Republish the budget contract every time the meter is flushed — other plugins
   * read summary.json without knowing session ids. */
  const publish = (): void => {
    const id = currentSessionId();
    const { contextWindow, window, budget } = projectFor(id);
    const summary = summarise({
      sessions: [...sessions.values()],
      today: aggregateToday(),
      budgetTokens: config.budgetTokens,
      forecast: id === undefined ? null : forecastFor(id),
      currency: config.prices[0]?.currency,
      now: new Date(),
      contextWindow,
      stepsUntilFull: window?.stepsToFull ?? null,
      stepsUntilBudget: budget.stepsLeft,
    });
    store.saveSummary(summary);
```

</details>

**依据 4 · 源码核查**：[src/projection.ts:60-76](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/projection.ts#L60-L76)

纯事件 projection

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预算刹车和重置是否可靠？

**研究主题**：缺陷与关键质疑

#### 完整回答

当前只能作为软提示和估算仪表，未见此模块注册模型调用前的预算拒绝器。qm 在已超额后显示警告，systemPrompt 交给模型自觉，因此不可用来保证现金上限。重置还存在具体状态一致性疑点：qm-reset 清本地 sessions/daily/histories 并写文件，但读取优先的 quota projection 没有相应 reset 事件；projection apply 只处理 assistant/message。宿主 projection 启用时，命令声称清零与当前面板可能不一致，这是静态代码可定位的缺口，尚未复现。价格校准也不能被理解为全面精确计费：calibrated 被传给 options，fold 与 projection 实际按 config.prices 算金额；需确认展示和累积账的口径。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:329-362](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L329-L362)

仅注入与事后警告

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:386-399](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L386-L399)

reset 清理本地 Map 与文件

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/projection.ts:66-75](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/projection.ts#L66-L75)

projection 不处理重置事件

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:176-205](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L176-L205)

校准价格仅进入 options；projection 使用 config.prices

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

**依据 5 · 源码核查**：[src/plugin.ts:229-240](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L229-L240)

fold 按 config.prices 累积

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

#### 缺口

- projection 重置冲突与校准金额差异未在宿主复现
  **影响**：可能误导预算与账目判断
  **进一步探讨**：同一事件序列分别启用 projection/校准，重置后核对各入口

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置和总成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要 Node≥22.18 和 DSH commands/tools/systemPrompt，预算和窗口需要用户准确配置；可选 billingDbPath 以只读 SQLite 取最近500条计费日志。未知价格、缓存口径和多币种混算不能由一个仪表自动补足。首次要核对 provider usage 语义及价格匹配，持续需要维护价格和窗口；系统提示注入本身增加上下文输入，未测具体增量。失败恢复包括损坏文件回空、进程重启丢失日汇总、核对最后未落盘事件。现金量和人工时均无实测，不能以免额外 API 推断总成本为0。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:35-39](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/package.json#L35-L39)

Node 版本约束

```text
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "prepare": "npm run build",
    "test": "node --test \"test/*.test.ts\"",
    "typecheck": "tsc --noEmit",
```

**依据 2 · 源码核查**：[src/plugin.ts:65-83](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L65-L83)

预算、窗口、价格和 SQLite 配置

<details>
<summary>查看原文（19行）</summary>

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
    }),
  ).default([]),
});
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:115-145](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L115-L145)

文件读失败退空与逐文件保存

<details>
<summary>查看原文（31行）</summary>

```text
  load(): Record<string, UsageTotals> {
    if (!existsSync(this.path)) return {};
    try {
      const parsed = JSON.parse(readFileSync(this.path, 'utf8'));
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, UsageTotals>) : {};
    } catch {
      return {};
    }
  }
  save(sessions: Record<string, UsageTotals>): void {
    writeAtomic(this.path, JSON.stringify(sessions, null, 2) + '\n');
  }
  loadHistory(): Record<string, StepUsage[]> {
    if (!existsSync(this.historyPath)) return {};
    try {
      const parsed = JSON.parse(readFileSync(this.historyPath, 'utf8'));
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      const out: Record<string, StepUsage[]> = {};
      for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
        if (Array.isArray(value)) out[key] = value.filter(isStep).slice(-HISTORY_LIMIT);
      }
      return out;
    } catch {
      return {};
    }
  }
  saveHistory(histories: Record<string, StepUsage[]>): void {
    writeAtomic(this.historyPath, JSON.stringify(histories, null, 2) + '\n');
  }
  saveSummary(summary: QuotaSummary): void {
    writeAtomic(this.summaryPath, JSON.stringify(summary, null, 2) + '\n');
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:176-188](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L176-L188)

只读读取计费数据库

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

#### 缺口

- usage 完整性、价格准确性与重启恢复未验收
  **影响**：现金与单位成本不可靠
  **进一步探讨**：以 provider 原账单和提交事件日志逐笔对账

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证可靠状态契约？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把“清零”定义为一条可重放的基线事件，并让会话投影、命令、卡片及 summary 共用同一读模型，可降低多账本漂移。推导来自 Q02 的双状态源与 Q03 的 reset 缺口。最小实验固定十条含缓存的 usage 事件，在第六条清零并重启/分叉；对照当前实现，检查四个入口是否一致、是否重复累计、是否丢失已提交事件。若多源现有设计在所有分支一致且新事件提高 replay 负担而没有减少差异，则不应引入新协议。跨插件读取者要消费版本化 summary，不能直接改既有字段含义。此是假设而非现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:197-218](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L197-L218)

projection 优先与 fallback 的双源

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:386-399](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L386-L399)

reset 只有本地状态操作

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/projection.ts:60-76](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/projection.ts#L60-L76)

可重放事件折叠接口

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁可试用以及何时停止？

**研究主题**：采用判断

#### 完整回答

建议观察，特别是将其当硬预算器或可审计账单的人应暂缓。它适合希望增加会话用量意识、愿意将数字视为估算的个人使用者；可先离线对账再考虑有限试用。先验收同一会话在 qm、quota_meter、提示和 summary 的一致性，再做重置、重启、projection 存在/缺失和价格校准。只要出现已清零却回读旧金额、缓存重复计费或汇总与原账不符，应停止依赖预算判断。没有宿主验收与节省实测，不推荐持续安装。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:346-365](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L346-L365)

qm 的读模型与超额提示

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:402-422](https://github.com/121212165/dsh-plugin-quota/blob/f9a0f0fffbb9254da65a1a0925c73ba169c143c0/src/plugin.ts#L402-L422)

工具 execute 与展示卡读取不完全相同

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
