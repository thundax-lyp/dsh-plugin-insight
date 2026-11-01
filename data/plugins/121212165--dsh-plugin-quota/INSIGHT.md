# dsh-plugin-quota

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[03c45a4](https://github.com/121212165/dsh-plugin-quota/tree/03c45a4850d567679efdbd8070d02f0aa270bfd8)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/121212165/dsh-plugin-quota) [![npm 30d 117](https://img.shields.io/static/v1?label=npm+30d&message=117&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-quota) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-quota)
<!-- END META -->

> **功能**：在 DSH 会话中提供 token、估算费用与预算趋势仪表。

> **亮点**：将实时用量、预测与预算提示集中到会话。[Q01](#research-q01)

> **主要限制**：提示模型收尾不是已验证的硬预算，费率、事件覆盖及今日重启口径均影响结果。[Q03](#research-q03)

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
  - [Q01 · 用量仪表面向谁，相比手工查账提供什么？](#detail-section-11)
  - [Q02 · 会话用量如何读取与恢复？](#detail-section-12)
  - [Q03 · 预算刹车是否是强制拦截或可靠账单上限？](#detail-section-13)
  - [Q04 · 如何配置和检验预测及成本？](#detail-section-14)
  - [Q05 · 已有提醒与预测之外如何降低预算超支？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在会话期间观察用量和预算的用户；基线是手工查日志或供应商账单。[Q01](#research-q01)

手工查看模型账单与会话日志。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 仪表 | 会话 token 与估价 | 事件和价格依赖 |
| 提醒 | 模型上下文预算提示 | 不保证拦截 |
| 预测 | 估计剩余步骤 | 数据不足为未知 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH 与用量事件 | 必需 | 会话仪表 | 查账单 |
| sessionProjections | 可选 | 会话重放 | 回退内存 |
| 预算、费率 | 对应预测或估价需要 | 告警与估算 | 显示未知或不显示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 用户设置低预算及费率 | 确认来源与计费 |
| 测试 | 运行短会话并查看仪表 | 缺事件则查日志 |
| 对账 | 比较账单与重启后数据 | 不一致停止依赖估算 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与模型 | 配置预算及费率 | 事件兼容未测 |
| 持续 | 模型费用与提示 token | 检查用量 | 预测非上限 |
| 恢复 | 可能需要重算 | 对账及维护价格 | 今日汇总重启归零 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 仪表 | 会话投影与提示 | 实时准确性 |
| 预算 | 阈值提醒与预测 | 强制拦截和实际节费 |

> **思考**：提示模型收尾不是已验证的硬预算，费率、事件覆盖及今日重启口径均影响结果。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将实时用量、预测与预算提示集中到会话。[Q01](#research-q01)

投影不可用回退内存；预算通过提示与面板警告，今日内存汇总重启归零。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

提示模型收尾不是已验证的硬预算，费率、事件覆盖及今日重启口径均影响结果。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

低预算短任务先核对事件及价格，超过阈值仍以供应商限额为准。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持投影回退与提示阈值；未运行宿主或对账。

- 已检查：作者 README、包清单、源码路径 README.md、src/plugin.ts、src/meter.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 12 文件、4 排除、零解析错误；静态检查提示与投影，不运行目标。
- 下一步：固定宿主、模型及费率，验证事件、重启和供应商账单差异。

**分析版本**

- **仓库**：[121212165/dsh-plugin-quota](https://github.com/121212165/dsh-plugin-quota)
- **版本号**：0.2.0（[固定提交 03c45a4](https://github.com/121212165/dsh-plugin-quota/tree/03c45a4850d567679efdbd8070d02f0aa270bfd8)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：用户选择硬上限时由宿主调用前确认，可能降低超支，须对照已有警告与预测。[Q05](#research-q05)

固定宿主、模型及费率，验证事件、重启和供应商账单差异。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 684 | 612 | 74 | — |
| .md | source | 1 | 84 | — | — | 1638 |
| .ts | source | 4 | 977 | 769 | 128 | — |
| .ts | test | 3 | 842 | 702 | 53 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/121212165/dsh-plugin-quota/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用量仪表如何统计与预测，预算提醒是否强制阻止模型调用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用量仪表面向谁，相比手工查账提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望在 DSH 会话中观察 token、轮次与预算趋势的用户可查看仪表和预测；插件把摘要注入模型上下文。相对手工查供应商账单，它更贴近运行过程，但预测依赖历史、费用依赖配置且无法证明自动节省；短会话和无预算用户可能无需额外仪表。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-30](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/README.md#L17-L30)

作者描述用量、预算和预测。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:329-356](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/src/plugin.ts#L329-L356)

提示区和命令面板读取数据。

<details>
<summary>查看原文（28行）</summary>

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
```

</details>

#### 缺口

- 未运行宿主、模型或供应商账单
  **影响**：无法确认事件覆盖、费用精度和模型遵循提醒
  **进一步探讨**：固定宿主及费率，比较跨重启用量、预测与供应商账单

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话用量如何读取与恢复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件尝试注册宿主 sessionProjections，用该投影读取当前会话；缺服务或读取异常则退回进程内 sessions，日汇总仅内存且重启归零。投影的持久性依赖宿主事件与重放实际工作，不能从代码断言所有宿主版本均支持；价格可由本地配置或可选数据库校准。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:161-185](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/src/plugin.ts#L161-L185)

持久会话、内存日汇总与可选价格校准。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:192-220](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/src/plugin.ts#L192-L220)

投影注册和回退。

<details>
<summary>查看原文（29行）</summary>

```text
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

#### 缺口

- 未运行宿主、模型或供应商账单
  **影响**：无法确认事件覆盖、费用精度和模型遵循提醒
  **进一步探讨**：固定宿主及费率，比较跨重启用量、预测与供应商账单

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预算刹车是否是强制拦截或可靠账单上限？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

当前检查到的代码把用量和 80%/100% 文本提醒放进 system prompt 和命令面板，要求模型自行收尾；该路径没有证明强制阻止下一次模型调用。预算为 token 而非货币，估算取决于事件、模型价格和配置；用户需另设供应商限额，重启后的今日汇总也可能归零。

#### 证据与依据

**依据 1 · 源码核查**：[src/meter.ts:105-125](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/src/meter.ts#L105-L125)

提示阈值与紧凑仪表。

<details>
<summary>查看原文（21行）</summary>

```text
}

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

**依据 2 · 源码核查**：[src/plugin.ts:329-343](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/src/plugin.ts#L329-L343)

提示注入和失败跳过。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:346-362](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/src/plugin.ts#L346-L362)

命令面板与超限提示。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:165-169](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/src/plugin.ts#L165-L169)

今日汇总内存限制。

```text
  const sessions = new Map<string, TrackedTotals>(Object.entries(store.load()) as Array<[string, TrackedTotals]>);
  /** daily rollup keyed YYYY-MM-DD — session ids are uuids without dates, so
   * "today" cannot be derived by filtering session keys. In-memory only:
   * restarts zero it, a pre-existing behavior /qm-top's 今日 inherits. */
  const daily = new Map<string, TrackedTotals>();
```

#### 缺口

- 未运行宿主、模型或供应商账单
  **影响**：无法确认事件覆盖、费用精度和模型遵循提醒
  **进一步探讨**：固定宿主及费率，比较跨重启用量、预测与供应商账单

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何配置和检验预测及成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要 DSH、可获得的用量事件及模型价格配置；作者说明 budgetTokens 为零时没有预算进度，窗口或增长未知时预测为 null。先用低风险短会话配置预算与价格，核对事件、重启后会话值和实际账单；缺数据或费率不匹配时只视为提示而非零成本。模型调用与人工对账仍有成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-42](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/README.md#L38-L42)

作者说明预算与预测未知值。

```text
| `totals.json` | `{ <sessionId>: UsageTotals }`，本插件的内部账 | quota 自己（重启续算） |
| `history.json` | `{ <sessionId>: StepUsage[] }`，每会话最近 64 步，预测的根据 | quota 自己 |
| `summary.json` | `QuotaSummary`：`budgetTokens`/`maxSessionTokens`/`maxSessionRatio`/`nextTurnEstTokens`/`todayTokens`/`todayCostMicros`/`currency` + `contextWindow`/`stepsUntilFull`/`stepsUntilBudget` | **家族契约**：task-forge `/relay` 派发前读它，预算吃紧就提前警告 |

没配 `budgetTokens` 时 `maxSessionRatio` 是 `null` 而不是 0——"烧到几成"没有预算是无意义的，读方不能自己猜一个。`contextWindow`/`stepsUntilFull`/`stepsUntilBudget` 同理：没配模型窗口、或增速 ≤ 0 算不出撑满点时发布 `null`。这三个是**追加**字段，`summary.json` 与 `history.json` 的既有字段和语义都不动（task-forge、ide-hub 都在读），只加不改不删。每 4 步（以及 `/qm-reset` 后）重新发布一次。
```

**依据 2 · 作者声明**：[README.md:54-59](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/README.md#L54-L59)

作者说明配置及默认预算。

````text
重启 dsh 即用（默认配置就能工作：仪表注入 + `/qm` 面板）。需要预算进度条或估花费时，把本仓库根目录 `cordis.patch.yml` 里的 `budgetTokens` / `prices` 示例**并进** profile 的 `cordis.patch.yml`（并进同一个 YAML 数组，不要另起文档追加）。price-aware 是官方面向宿主侧的参考实现，与本插件用 `accounting: own|assume-price-aware` 共存，不冲突。

## 配置

```yaml
budgetTokens: 0      # 单会话 token 预算，0 = 不显示进度条
````

**依据 3 · 源码核查**：[src/plugin.ts:197-220](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/src/plugin.ts#L197-L220)

宿主投影可用性。

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

#### 缺口

- 未运行宿主、模型或供应商账单
  **影响**：无法确认事件覆盖、费用精度和模型遵循提醒
  **进一步探讨**：固定宿主及费率，比较跨重启用量、预测与供应商账单

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有提醒与预测之外如何降低预算超支？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：宿主在用户显式选择硬上限时，在下一次调用前比较预计用量并要求确认，可能降低超支。现有系统提示已有 80%/100% 警告、预测和摘要契约，不能把它们当作硬拦截；未知下一次用量和其他宿主等价控制，可能误阻必要收尾。对照已有提醒，在正常、突增和无预测场景测超支、误拦及恢复时间，收益不足则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/meter.ts:105-125](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/src/meter.ts#L105-L125)

已有预算警告。

<details>
<summary>查看原文（21行）</summary>

```text
}

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

**依据 2 · 源码核查**：[src/plugin.ts:329-343](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/src/plugin.ts#L329-L343)

已有提示注入。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[README.md:38-42](https://github.com/121212165/dsh-plugin-quota/blob/03c45a4850d567679efdbd8070d02f0aa270bfd8/README.md#L38-L42)

已有预测和摘要契约。

```text
| `totals.json` | `{ <sessionId>: UsageTotals }`，本插件的内部账 | quota 自己（重启续算） |
| `history.json` | `{ <sessionId>: StepUsage[] }`，每会话最近 64 步，预测的根据 | quota 自己 |
| `summary.json` | `QuotaSummary`：`budgetTokens`/`maxSessionTokens`/`maxSessionRatio`/`nextTurnEstTokens`/`todayTokens`/`todayCostMicros`/`currency` + `contextWindow`/`stepsUntilFull`/`stepsUntilBudget` | **家族契约**：task-forge `/relay` 派发前读它，预算吃紧就提前警告 |

没配 `budgetTokens` 时 `maxSessionRatio` 是 `null` 而不是 0——"烧到几成"没有预算是无意义的，读方不能自己猜一个。`contextWindow`/`stepsUntilFull`/`stepsUntilBudget` 同理：没配模型窗口、或增速 ≤ 0 算不出撑满点时发布 `null`。这三个是**追加**字段，`summary.json` 与 `history.json` 的既有字段和语义都不动（task-forge、ide-hub 都在读），只加不改不删。每 4 步（以及 `/qm-reset` 后）重新发布一次。
```

#### 缺口

- 未运行宿主、模型或供应商账单
  **影响**：无法确认事件覆盖、费用精度和模型遵循提醒
  **进一步探讨**：固定宿主及费率，比较跨重启用量、预测与供应商账单

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
