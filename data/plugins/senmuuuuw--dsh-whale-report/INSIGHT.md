# 鲸鱼记事本 DeepTrace

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[a20003e](https://github.com/SenmuuuuW/dsh-whale-report/tree/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SenmuuuuW/dsh-whale-report) [![npm 30d 970](https://img.shields.io/static/v1?label=npm+30d&message=970&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-report) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-report)
<!-- END META -->

> **功能**：从 DSH 会话事件生成日报、周报和自选区间使用报告。

> **亮点**：把用量、失败和可回查周期接进 DSH 报告。独立设置提案把单参数变更和观察窗口记录下来，见 [Q01](#research-q01) 和 [Q03](#research-q03)。

> **主要限制**：报告的估计能否对上真实费用，局部超时变低是否来自设置？部署权限、索引覆盖和变化后的任务分布都会改变判断，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

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
  - [Q01 · 哪些使用变化能靠报告定位？](#detail-section-11)
  - [Q02 · 费用及用量怎样对账？](#detail-section-12)
  - [Q03 · 报告出现建议后，是否会修改宿主设置？](#detail-section-13)
  - [Q04 · 怎样检验延长超时是否真的有收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合想定位一周用量或工具失败的 DSH 使用者，先用一个已保存周期核对原始会话，见 [Q01](#research-q01)。

原办法是手工读取会话记录并对账。统计跨多个会话时，可比较索引辅助定位与手工核查的成本，见 [Q02](#research-q02)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 周期报告 | 发现高用量和工具失败 | 依赖索引覆盖和实际会话 |
| 估算费用 | 查看定价区间差异 | 真实费用另行对账 |
| 设置提案 | 修改和观察 shell 超时 | 需 settings 与受控部署 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| sessionQuery、tools 和 storageDomain | 宿主必需 | 读取、索引及工具 | 缺少挂载能力 |
| Web server | 浏览器页面需要 | 报告接口 | 仅宿主能力可核查 |
| settings | 调整参数需要 | 读取和核对设置修订 | 仅报告主体可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 复制脱敏 profile 和日志 | 保留原设置 |
| 读报告 | 等待索引后查选定时间窗 | 记录漏项并核对原明细 |
| 退回 | 关闭报告并复查数据与设置 | 原流程可查询 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 索引磁盘和计算 | 选数据与窗口 | 资源待测 |
| 持续 | 增量索引、报表导出 | 校准费用及失败 | 估计不能代替账单 |
| 退出 | 索引和导出文件 | 检查删除及设置 | 卸载效果待实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 异常定位 | 可聚合周期和失败 | 故障解释准确率 |
| 设置反馈 | 提案、回读、验证和回滚 | 处理成本是否降低 |

> **思考**：报告的估计能否对上真实费用，局部超时变低是否来自设置？部署权限、索引覆盖和变化后的任务分布都会改变判断，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把用量、失败和可回查周期接进 DSH 报告。独立设置提案把单参数变更和观察窗口记录下来，见 [Q01](#research-q01) 和 [Q03](#research-q03)。

把持久索引、观察窗口和设置写入拆开。设置按修订防冲突，回滚重读当前值。部署须独立验证本机同源限制，见 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

报告的估计能否对上真实费用，局部超时变低是否来自设置？部署权限、索引覆盖和变化后的任务分布都会改变判断，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

优先比较只读报表和已知日志。先查 indexing 和覆盖，再核对原日志与账单，试用设置前另行验证隔离和回滚，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持周期报告、费用估算及受限的设置路径，部署鉴权、数值准确性和收益尚待验证。

- 已检查：作者 README、包清单、源码路径 package.json、tsdown.config.ts、cordis.patch.yml、src/index.ts、src/query-engine.ts、src/client/index.tsx、README.md、src/pricing.ts、src/apply/service.ts、src/api.ts、src/trust-fence.ts、src/apply/executor.ts、src/apply/rollback.ts、src/verify/verifier.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定 DSH 宿主、Web、聚合和设置路径。未执行插件、网络请求或真实账单比较。
- 下一步：对照固定事件总数与账单，再用同一组命令做隔离的超时配对回放，见 [Q04](#research-q04)。

**分析版本**

- **仓库**：[SenmuuuuW/dsh-whale-report](https://github.com/SenmuuuuW/dsh-whale-report)
- **版本号**：0.6.1（[固定提交 a20003e](https://github.com/SenmuuuuW/dsh-whale-report/tree/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4)）
- **版本日期**：2026-09-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把观察改为同类命令的配对回放，可检验单参数调整对合格任务是否有益。比较正确完成、尾部耗时和重复，见 [Q04](#research-q04)。

对照固定事件总数与账单，再用同一组命令做隔离的超时配对回放，见 [Q04](#research-q04)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1610 | — | — | 20272 |
| .js | source | 39 | 18300 | 16715 | 2123 | — |
| .mjs | source | 3 | 349 | 287 | 38 | — |
| .ts | source | 39 | 9169 | 7371 | 1299 | — |
| .tsx | source | 1 | 5850 | 5298 | 331 | — |
| .ts | test | 37 | 6604 | 5522 | 659 | — |
| .tsx | test | 3 | 757 | 670 | 35 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/SenmuuuuW/dsh-whale-report/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/SenmuuuuW/dsh-whale-report/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/SenmuuuuW/dsh-whale-report/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否从会话事件定位用量和失败，并可控地验证设置调整？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些使用变化能靠报告定位？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合维护本地 DSH 的用户追查上一周调用增长、缓存变化或 Shell 超时。合格结果是定位某批会话及模型、识别报告覆盖边界，并复核原记录。手工查事件可以复现单次问题。插件实际增量是订阅逐事件与 flush，后台读取基线及低频对账，将索引按选定区间聚合，避免每次读完整历史。索引版本不符或未建会标示 indexing，损坏会话被单独披露。Web 有侧栏服务时注册报告标签，没有时仍有抽屉。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:45-60](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/index.ts#L45-L60)

打开独立持久计数域。

<details>
<summary>查看原文（16行）</summary>

```text
  ctx.inject(["storageDomain"], async (domainCtx) => {
    const facility = (domainCtx as Context & { storageDomain: DomainFacility }).storageDomain;
    const domain = await facility.open(whaleDomain);
    ctx.effect(() => () => {
      void domain.close();
    });

    const services: ReportServices = {
      sessionQuery,
      index: domain.table("session_index"),
      periodStats: domain.table("period_stats"),
    };

    // v0.5.x repair：INGEST ONCE → QUERY MANY。
    const ingest = new IngestEngine({ sessionQuery, index: domain.table("session_index") });

```

</details>

**依据 2 · 源码核查**：[src/index.ts:72-109](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/index.ts#L72-L109)

会话订阅、后台索引与定时对账。

<details>
<summary>查看原文（38行）</summary>

```text
    // 官方增量 firehose（rc.2）：session/event 逐事件 → 只处理新增事件。
    ctx.effect(() => {
      const offEvent = ctx.on("session/event", (session, event) => {
        ingest.handleEvent(session.id, event as { type: string; seq?: number; time: number; data?: unknown });
      });
      const offCreated = ctx.on("session/created", (session) => {
        ingest.handleCreated(session.id, session.header.seedLength ?? 0);
      });
      const offDisposed = ctx.on("session/disposed", (session) => {
        void ingest.handleDisposed(session.id);
      });
      const offFlush = ctx.on("session/flush", (session) => {
        void ingest.flushSession(session.id);
      });
      return () => {
        offEvent();
        offCreated();
        offDisposed();
        offFlush();
      };
    });

    // 启动后台 ingest：索引建立期间不阻塞 UI（live 会话先挂缓冲再读基线，防丢事件）。
    setTimeout(() => {
      void ingest.bootstrap().catch(() => {});
      // v0.6 crash reconciliation（RFC §16）：PREPARED/MUTATING 恢复为 APPLIED/FAILED/CONFLICTED。
      void applyService.reconcile().catch(() => {});
    }, 3000);
    // 低频 fingerprint reconciliation（防御 firehose 之外的完整性兜底）。
    const reconcileTimer = setInterval(() => {
      void ingest.reconcile().catch(() => {});
      // live checkpoint（coalesced，≥5min 间隔；flush 只是 hint，这里兜底）
      void ingest.checkpoint(false).catch(() => {});
    }, 5 * 60_000);
    ctx.effect(() => () => {
      clearInterval(reconcileTimer);
      void ingest.dispose().catch(() => {});
    });
```

</details>

**依据 3 · 源码核查**：[src/query-engine.ts:31-53](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/query-engine.ts#L31-L53)

按区间聚合，未建和损坏有不同状态。

<details>
<summary>查看原文（23行）</summary>

```text
export function queryPeriod(index: QueryIndex, spec: PeriodSpec, headers: RawSessionHeader[], meta: QueryMeta): QueryOutput {
  const views: SessionBucketView[] = [];
  let indexedThrough = 0;
  let missing = 0;
  for (const h of headers) {
    const entry = index.get(h.id);
    if (entry === undefined || entry.v !== INDEX_VERSION || !Array.isArray(entry.buckets)) {
      missing += 1;
      continue;
    }
    views.push({ sessionId: entry.sessionId, buckets: entry.buckets as SessionBucketView["buckets"], titles: entry.titles });
    if (entry.lastMs > indexedThrough) indexedThrough = entry.lastMs;
  }
  // 跳过披露：ingest 判定损坏且无法恢复的会话（缺失索引不在此列 —— 那是 indexing 追赶）。
  const skippedCount = meta.skippedIds.size;
  const partial = skippedCount > 0
    ? { skippedSessionIds: [...meta.skippedIds], skippedCount, reasons: [...meta.skippedReasons].sort() }
    : emptyPartial();
  const stats = aggregateBuckets(views, spec, headers, partial);
  return {
    stats,
    meta: { ...meta, indexedThrough, indexing: missing > 0, missing },
  };
```

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:5813-5849](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/client/index.tsx#L5813-L5849)

Web 槽和抽屉备用路径。

<details>
<summary>查看原文（37行）</summary>

```text
export function apply(ctx: ClientContext): void {
  injectStyle();
  // 主题运行时：读持久化选择 → 解析（显式 > 宿主 > prefers-color-scheme > light）→
  // 写到 documentElement data-whale-theme；组件渲染前完成，无闪烁。
  if (themeRuntime === null) themeRuntime = new ThemeRuntime(browserThemeDeps());

  // 兜底 UI 永远挂载：better-sidebar 不存在时提供悬浮球抽屉；
  // 一旦 Tab 注册成功（tabRegistered 翻转），悬浮球自动隐藏。
  ctx.effect(() => {
    const host = document.createElement("div");
    host.setAttribute("data-whale-report", "");
    document.body.appendChild(host);
    const root: Root = createRoot(host);
    root.render(<FallbackDrawer />);
    return () => {
      root.unmount();
      host.remove();
    };
  });

  // Tab 优先：better-sidebar 的注册服务存在时，把深迹做进它的工作台。
  // 惰性注入：服务缺失只跳过回调，绝不阻塞装配。
  ctx.inject(["betterSidebar"], (injected) => {
    const service = injected.betterSidebar as BetterSidebarLike | undefined;
    if (service === undefined) return;
    ctx.effect(() =>
      service.registerTab({
        id: "dsh-whale-report:report",
        title: "深迹 DeepTrace",
        icon: (size) => <ChartIcon size={size} />,
        order: 90,
        single: true,
        component: () => <SidebarTab />,
      }),
    );
    setTabRegistered(true);
  });
```

</details>

#### 缺口

- 未采集真实大库完成率
  **影响**：首次启动和持续吞吐未知
  **进一步探讨**：用一组已知日志比对缺失数与报告

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 费用及用量怎样对账？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

聚合选定区间的模型用量并按真实事件时间选择价档，避免把不同日的同小时合并成同一价。实现对模型分类和部分 provider 单独套表，无法从日志推出任意供应商真实计费。报告进度、排除记录、套餐与价格变更均可使估计和账单不同。日常使用应先拿一个已知 provider 和时间切口验证聚合的 token，再比较账单适用的价格，不用全量估计给短时异常定因。索引会占资源且重建或长期会话的成本待测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:99-125](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/README.md#L99-L125)

作者解释价格和索引语义的口径。

<details>
<summary>查看原文（27行）</summary>

```text
### Historical pricing

DeepSeek pricing 按真实生效日期回溯（Asia/Shanghai）：

- before **2026-08-17**：legacy flat pricing
- **2026-08-17** onward：peak / off-peak pricing
- **2026-08-23** onward：weekends fully off-peak

### Complete session ingestion

- plugin 启动后新建的 sessions 会被 periodic reconcile 自动发现，**不需要 restart**
- repeated reconciliation 不重复计数

### Resume history

- normal resume 保留完整历史；only true fork inherited seed is excluded
- 升级 v0.6.1 后，旧 v17 index 自动失效并重建（见 Semantic migration）

### Semantic migration

v0.6.1 bumps the persisted accounting semantics: **INDEX_VERSION 18 · REPORT_SEM 7**. Old incompatible index / report state is not silently reused.

## Accounting model

DeepTrace cost = **complete event history** × **historically correct pricing**。

v0.6.1 同时修正了价格口径、session discovery 与 resume history——因此 **affected historical reports may change materially after upgrade**（历史报告的数字会按正确口径重算）。
```

</details>

**依据 2 · 源码核查**：[src/query-engine.ts:35-52](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/query-engine.ts#L35-L52)

按可用记录与窗口汇总。

<details>
<summary>查看原文（18行）</summary>

```text
  for (const h of headers) {
    const entry = index.get(h.id);
    if (entry === undefined || entry.v !== INDEX_VERSION || !Array.isArray(entry.buckets)) {
      missing += 1;
      continue;
    }
    views.push({ sessionId: entry.sessionId, buckets: entry.buckets as SessionBucketView["buckets"], titles: entry.titles });
    if (entry.lastMs > indexedThrough) indexedThrough = entry.lastMs;
  }
  // 跳过披露：ingest 判定损坏且无法恢复的会话（缺失索引不在此列 —— 那是 indexing 追赶）。
  const skippedCount = meta.skippedIds.size;
  const partial = skippedCount > 0
    ? { skippedSessionIds: [...meta.skippedIds], skippedCount, reasons: [...meta.skippedReasons].sort() }
    : emptyPartial();
  const stats = aggregateBuckets(views, spec, headers, partial);
  return {
    stats,
    meta: { ...meta, indexedThrough, indexing: missing > 0, missing },
```

</details>

**依据 3 · 源码核查**：[src/pricing.ts:127-155](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/pricing.ts#L127-L155)

用实际时间及模型、provider 分类选择价档。

<details>
<summary>查看原文（29行）</summary>

```text
export function computeCostTimed(
  perTimeModelTokens: { time: number; modelTokens: Record<string, ModelUsage> }[],
): TimedCostResult {
  const perModel: Record<string, number> = {};
  let total = 0;
  let peakCost = 0;
  let peakTokens = 0;
  let allTokens = 0;
  for (const { time, modelTokens } of perTimeModelTokens) {
    // 价格集由 priceSetForTime 唯一决定（8-17 前旧统一价回溯；之后按峰谷时段）。
    const tier = pricingTierForTime(time);
    const priceSet = priceSetForTime(time);
    for (const [model, usage] of Object.entries(modelTokens)) {
      const provider = model.includes("/") ? model.slice(0, model.indexOf("/")) : "deepseek";
      const mTier = modelTier(model);
      const prices = provider === "opencode-go" ? OPENCODE_GO_PRICES : priceSet;
      const cost = modelCost(usage, prices[mTier]);
      perModel[model] = (perModel[model] ?? 0) + cost;
      total += cost;
      const tokens = usageTotalTokens(usage);
      allTokens += tokens;
      // peakShare/peakRatio 只统计峰谷价期（8-17 起）的高峰行：旧统一价期无峰谷语义。
      if (tier === "peak" && time >= PEAK_OFFPEAK_EFFECTIVE_AT) {
        peakCost += cost;
        peakTokens += tokens;
      }
    }
  }
  return { perModel, total, peakShare: peakCost, peakRatio: allTokens > 0 ? peakTokens / allTokens : 0 };
```

</details>

#### 缺口

- 未核验现行计费及索引重建时间
  **影响**：金额只能作为估计
  **进一步探讨**：按同一时间区间及 provider 核对原账单与 token

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 报告出现建议后，是否会修改宿主设置？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

会话统计主链读取日志并写独立索引，但设置调整有单独的可写入口。提案服务用近七日窗口和工具失败线索构建 shell.timeoutMs 的建议。HTTP 申请通过基于 Host、Origin 与 Sec-Fetch-Site 的本机同源检查后，approve 接受提案路径和幂等键，后端重读期望值与修订号再写 settings，回读不符报冲突。同一个键能回送既有终态，无法仅凭这些检查推断跨进程事务原子性。信任检查没有在该函数核验操作者身份或网络对端，必须查看宿主实际部署和反代边界。缺 settings 时保留只读报告主体。回滚还会在目标已变化时拒绝，不能把卸载当作恢复设置。

#### 证据与依据

**依据 1 · 源码核查**：[src/apply/service.ts:63-95](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/apply/service.ts#L63-L95)

取数据建提案并跟踪状态。

<details>
<summary>查看原文（33行）</summary>

```text
  async createProposal(input: { improvementId?: string }): Promise<ApplyProposal | null> {
    const now = this.now();
    const from = now - 7 * 24 * 60 * 60 * 1000;
    const stats = await this.options.queryStats(from, now);
    const period = periodKey(LOOKBACK_PRESET, now);
    const improvements = computeImprovements({ stats, period, failedSessions: stats.toolFailedSessions, corrections: stats.correctionSignals });
    const wanted = input.improvementId;
    const item: ImprovementItem | null =
      wanted === undefined ? (improvements.find((i) => i.category === "TOOL") ?? null) : (improvements.find((i) => i.id === wanted) ?? null);
    const settings = this.adapter.readShellTimeout();
    const proposal = buildShellTimeoutProposal({ improvement: item, stats, settings, now });
    if (proposal === null) return null;
    const existing = this.store.proposalTable.get(proposal.id) as ApplyProposal | undefined;
    if (existing !== undefined && existing.status !== "superseded") {
      // conflicted / rejected / applied 的旧提案 → 置 superseded 并重新生成
      //（§29-E: 配置已变 / 旧 Apply 已结束, 新 cycle 需要新提案; apply_records 保留历史）。
      let stale = existing.status === "conflicted" || existing.status === "rejected" || existing.status === "applied";
      // proposed 但配置已变（值或 revision 与提案不符）→ 同样作废重生成（避免陈旧提案阻塞新 cycle）。
      if (!stale && existing.status === "proposed") {
        const current = this.adapter.readShellTimeout();
        stale = current !== null && (current.value !== existing.expectedBefore || current.revision !== existing.revisionAtProposal);
      }
      if (stale) {
        existing.status = "superseded";
        await this.store.proposalTable.put(existing.id, existing);
        await this.audit.append({ applyId: undefined, improvementId: proposal.improvementId, target: { ns: proposal.target.ns, path: proposal.target.path }, action: "proposal.superseded", result: "ok" });
      } else {
        return existing;
      }
    }
    await this.store.proposalTable.put(proposal.id, proposal);
    await this.audit.append({ applyId: undefined, improvementId: proposal.improvementId, target: { ns: proposal.target.ns, path: proposal.target.path }, action: "proposal.created", result: "ok" });
    return proposal;
```

</details>

**依据 2 · 源码核查**：[src/api.ts:278-289](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/api.ts#L278-L289)

报告 API 入口的信任检查。

<details>
<summary>查看原文（12行）</summary>

```text
export function registerApiRoutes(ctx: Context, server: WebServerLike, svc: ApiServices): void {
  ctx.effect(
    () =>
      server.register({
        kind: "prefix",
        path: "/whale/api",
        handler: async (req, res) => {
          if (!isTrustedApiRequest({ headers: req.headers })) {
            writeJson(res, 403, { ok: false, error: { code: "forbidden", message: "forbidden" } });
            return;
          }
          const pathname = new URL(req.url ?? "/", "http://dsh.internal").pathname;
```

</details>

**依据 3 · 源码核查**：[src/trust-fence.ts:31-49](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/trust-fence.ts#L31-L49)

检查请求头条件。

<details>
<summary>查看原文（19行）</summary>

```text
export function isTrustedApiRequest(request: ApiTrustRequest): boolean {
  const host = header(request.headers, "host");
  if (host === undefined) return false;
  let hostUrl: URL;
  try {
    hostUrl = new URL(`http://${host}`);
  } catch {
    return false;
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false;
  if (header(request.headers, "sec-fetch-site") === "cross-site") return false;
  const origin = header(request.headers, "origin");
  if (origin === undefined) return true;
  try {
    return new URL(origin).host === hostUrl.host;
  } catch {
    return false;
  }
}
```

</details>

**依据 4 · 源码核查**：[src/api.ts:482-498](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/api.ts#L482-L498)

批准入口只取提案及幂等字段。

<details>
<summary>查看原文（17行）</summary>

```text
            if (req.method === "POST" && method.startsWith("apply/") && method.endsWith("/approve")) {
              const apply = svc.apply;
              if (apply === undefined) { writeJson(res, 503, { ok: false, error: { code: "SETTINGS_UNAVAILABLE", message: "Apply 未启用" } }); return; }
              const id = method.slice("apply/".length, method.length - "/approve".length);
              const payload = (await readJsonBody(req)) as Record<string, unknown>;
              // Phase 1.5 §5：mutation truth 只来自 server-side stored proposal；
              // 客户端只允许提供 applyId（幂等键）。namespace/path/before/after 等字段一律忽略。
              const applyId = typeof payload.applyId === "string" ? payload.applyId : "";
              if (applyId === "" || applyId.length > 256) {
                writeJson(res, 422, { ok: false, error: { code: "INVALID_PROPOSAL", message: "applyId 缺失或格式非法" } });
                return;
              }
              try {
                const { record, already } = await apply.approve({ proposalId: id, applyId });
                writeJson(res, 200, { ok: true, already, record });
              } catch (error) {
                if (error instanceof ApplyError) { writeJson(res, applyErrorStatus(error.code), { ok: false, error: { code: error.code, message: error.message } }); return; }
```

</details>

**依据 5 · 源码核查**：[src/apply/executor.ts:76-101](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/apply/executor.ts#L76-L101)

检查提案与已执行记录。

<details>
<summary>查看原文（26行）</summary>

```text
  const proposal = store.proposalTable.get(input.proposalId) as ApplyProposal | undefined;
  if (proposal === undefined) throw new ApplyError(APPLY_ERROR_CODES.INVALID_PROPOSAL, "proposal not found");
  // applyId 必须属于该 proposal（跨提案重放/混淆防护）。
  if (!input.applyId.startsWith(`${proposal.id}::`)) {
    throw new ApplyError(APPLY_ERROR_CODES.INVALID_PROPOSAL, "applyId does not belong to this proposal");
  }
  if (proposal.status !== "proposed") {
    // 幂等: 已成功的 Apply 返回既有结果; 已失败/冲突的提案拒绝重复执行。
    const existing = store.recordTable.get(input.applyId) as ApplyRecord | undefined;
    if (existing !== undefined && (existing.status === "applied" || existing.status === "failed" || existing.status === "conflicted")) {
      return { record: existing, already: true };
    }
    throw new ApplyError(APPLY_ERROR_CODES.INVALID_PROPOSAL, `proposal status ${proposal.status}`);
  }

  // 幂等行: 先落 PREPARED(防双击/重放),同一 applyId 至多执行一次。
  const existing = store.recordTable.get(input.applyId) as ApplyRecord | undefined;
  if (existing !== undefined) {
    if (existing.status === "prepared" || existing.status === "mutating") {
      throw new ApplyError(APPLY_ERROR_CODES.IN_PROGRESS, "apply already in progress");
    }
    if (existing.status === "applied") return { record: existing, already: true };
    if (existing.status === "failed" || existing.status === "conflicted") {
      throw new ApplyError(APPLY_ERROR_CODES.ALREADY_APPLIED, `apply already settled as ${existing.status}`);
    }
  }
```

</details>

**依据 6 · 源码核查**：[src/apply/executor.ts:118-172](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/apply/executor.ts#L118-L172)

修订检查、写入及回读。

<details>
<summary>查看原文（55行）</summary>

```text
  // 乐观并发: 重读当前值 + revision（对照 proposal 存储值——客户端无法影响校验）。
  const current = adapter.readShellTimeout();
  if (current === null) {
    record.status = "failed";
    record.lastErrorCode = APPLY_ERROR_CODES.SETTINGS_UNAVAILABLE;
    await store.recordTable.put(input.applyId, record);
    await audit.append({ applyId: input.applyId, improvementId: proposal.improvementId, target: { ns: proposal.target.ns, path: proposal.target.path }, action: "apply.failed", result: "error", code: record.lastErrorCode });
    throw new ApplyError(APPLY_ERROR_CODES.SETTINGS_UNAVAILABLE, "shell settings unavailable");
  }
  if (current.revision !== proposal.revisionAtProposal || current.value !== proposal.expectedBefore) {
    record.status = "failed";
    record.lastErrorCode = APPLY_ERROR_CODES.CONFIG_CHANGED;
    proposal.status = "conflicted";
    await store.proposalTable.put(proposal.id, proposal);
    await store.recordTable.put(input.applyId, record);
    await audit.append({ applyId: input.applyId, improvementId: proposal.improvementId, target: { ns: proposal.target.ns, path: proposal.target.path }, action: "proposal.conflicted", result: "error", code: APPLY_ERROR_CODES.CONFIG_CHANGED });
    await audit.append({ applyId: input.applyId, improvementId: proposal.improvementId, target: { ns: proposal.target.ns, path: proposal.target.path }, action: "apply.failed", result: "error", code: APPLY_ERROR_CODES.CONFIG_CHANGED });
    throw new ApplyError(APPLY_ERROR_CODES.CONFIG_CHANGED, `config changed since proposal (value ${current.value} / revision ${current.revision})`);
  }

  // MUTATING → 写 settings(seam 原生 fence 第二层)。
  record.status = "mutating";
  await store.recordTable.put(input.applyId, record);
  await audit.append({ applyId: input.applyId, improvementId: proposal.improvementId, target: { ns: proposal.target.ns, path: proposal.target.path }, action: "apply.attempted", result: "ok" });

  let written: { value: number; revision: number };
  try {
    written = await adapter.updateShellTimeout({ expectedRevision: current.revision, expectedValue: current.value, nextValue: proposal.proposedAfter });
  } catch (error) {
    const code = error instanceof ApplyError ? error.code : APPLY_ERROR_CODES.APPLY_FAILED;
    record.status = "failed";
    record.lastErrorCode = code;
    if (code === APPLY_ERROR_CODES.CONFIG_CHANGED) proposal.status = "conflicted";
    await store.proposalTable.put(proposal.id, proposal);
    await store.recordTable.put(input.applyId, record);
    await audit.append({ applyId: input.applyId, improvementId: proposal.improvementId, target: { ns: proposal.target.ns, path: proposal.target.path }, action: "apply.failed", result: "error", code });
    throw error;
  }

  // 成功 → 回读确认 value == after。
  if (written.value !== proposal.proposedAfter) {
    record.status = "conflicted";
    record.lastErrorCode = APPLY_ERROR_CODES.TARGET_CHANGED;
    await store.recordTable.put(input.applyId, record);
    await audit.append({ applyId: input.applyId, improvementId: proposal.improvementId, target: { ns: proposal.target.ns, path: proposal.target.path }, action: "apply.failed", result: "error", code: APPLY_ERROR_CODES.TARGET_CHANGED });
    throw new ApplyError(APPLY_ERROR_CODES.TARGET_CHANGED, "value mismatch after write");
  }

  record.status = "applied";
  record.revisionAfter = written.revision;
  record.appliedAt = now;
  record.rollback.available = true;
  proposal.status = "applied";
  await store.proposalTable.put(proposal.id, proposal);
  await store.recordTable.put(input.applyId, record);
```

</details>

**依据 7 · 源码核查**：[src/apply/rollback.ts:24-59](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/apply/rollback.ts#L24-L59)

回滚遇目标变化拒绝。

<details>
<summary>查看原文（36行）</summary>

```text
  const record = store.recordTable.get(input.applyId) as ApplyRecord | undefined;
  if (record === undefined) throw new ApplyError(APPLY_ERROR_CODES.INVALID_PROPOSAL, "apply record not found");
  if (record.status !== "applied") throw new ApplyError(APPLY_ERROR_CODES.REVERT_FAILED, `apply status ${record.status}`);
  if (record.rollback.status === "reverted") throw new ApplyError(APPLY_ERROR_CODES.ALREADY_REVERTED, "already reverted");

  // 重读当前值: 只有 current == after 才允许回滚。
  const current = adapter.readShellTimeout();
  if (current === null) throw new ApplyError(APPLY_ERROR_CODES.SETTINGS_UNAVAILABLE, "shell settings unavailable");
  if (current.value !== record.after) {
    record.rollback.status = "conflicted";
    record.rollback.available = false;
    await store.recordTable.put(record.applyId, record);
    await audit.append({ applyId: record.applyId, improvementId: record.improvementId, target: { ns: record.target.ns, path: record.target.path }, action: "rollback.failed", result: "error", code: APPLY_ERROR_CODES.TARGET_CHANGED });
    throw new ApplyError(APPLY_ERROR_CODES.TARGET_CHANGED, `target changed after apply (current ${current.value}, applied ${record.after}); manual review required`);
  }

  const rollback: RollbackRecord = {
    rollbackId: input.rollbackId,
    applyId: record.applyId,
    target: { ...record.target },
    expectedCurrent: record.after,
    restoreTo: record.before,
    revisionBefore: current.revision,
    status: "requested",
  };
  await audit.append({ applyId: record.applyId, improvementId: record.improvementId, target: { ns: record.target.ns, path: record.target.path }, action: "rollback.attempted", result: "ok" });

  try {
    const written = await adapter.updateShellTimeout({
      expectedRevision: current.revision,
      expectedValue: current.value,
      nextValue: record.before,
    });
    if (written.value !== record.before) {
      rollback.status = "failed";
      throw new ApplyError(APPLY_ERROR_CODES.REVERT_FAILED, "value mismatch after rollback write");
```

</details>

#### 缺口

- 未执行对端鉴权、并发写或回滚
  **影响**：设置调整宜保留观察
  **进一步探讨**：在脱敏独立 profile 验证直接请求、双击和外部设置变更

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样检验延长超时是否真的有收益？

**研究主题**：新假设与验证、采用判断

#### 完整回答

验证以变更后的冷却窗口统计 shell 超时调用和会话，样本不足等待或结为不确定，充足后与目标阈值比较。降低超时可能仅指命令更晚失败或任务更简单。建议先只读地复制一日脱敏数据，和手工记录对照报告范围以及失败样例。若有受控配置回放，再将相同命令按原超时和新超时配对，比较成功任务数、尾部等待及重试。若狭义超时下降但完成数无增、耗时上升，则原建议未带来收益，恢复原设置。看到报告缺失或条件不齐时，停止试用该报告作判断。

#### 证据与依据

**依据 1 · 源码核查**：[src/verify/verifier.ts:33-81](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/verify/verifier.ts#L33-L81)

观测窗口、样本门槛和不可改写终态。

<details>
<summary>查看原文（49行）</summary>

```text
export async function evaluateVerify(
  deps: VerifyDeps,
  input: { applyId: string; force?: boolean },
): Promise<VerifyResult> {
  const { store, query, audit } = deps;
  const now = deps.now === undefined ? Date.now() : deps.now();
  const vr = store.verifyTable.get(input.applyId) as VerifyRecord | undefined;
  if (vr === undefined) throw new ApplyError(APPLY_ERROR_CODES.INVALID_PROPOSAL, "verify record not found");
  // Phase 1.6：终态不可变 —— VERIFIED / NOT_IMPROVED / INCONCLUSIVE / REVERTED 为 terminal，
  // 重复 verify 不得重算窗口、不得改写历史 verdict（重新评估 = 新 cycle / 新记录）。
  if (vr.status === "verified" || vr.status === "not_improved" || vr.status === "inconclusive" || vr.status === "reverted") {
    return { record: vr, status: vr.status, progress: { observations: 0, sessions: 0, window: null } };
  }

  // After 窗口: [appliedAt + cooldown, now)。
  const afterFrom = vr.appliedAt + vr.cooldownMs;
  const afterStats = await query(afterFrom, now);
  const observed = {
    value: Math.round(afterStats.rate * 10000) / 10000,
    sampleSize: afterStats.invocations,
    sessions: afterStats.sessions,
    window: { from: afterFrom, to: now },
  };
  vr.observed = observed;
  vr.updatedAt = now;

  const minObs = vr.minimumEvidence.observations;
  const minSess = vr.minimumEvidence.sessions;
  let next: VerifyStatus;
  let note: string | undefined;
  if (afterStats.invocations < minObs || afterStats.sessions < minSess) {
    if (now - vr.appliedAt >= vr.maxObservationWindowMs) {
      next = "inconclusive";
      note = `样本不足: ${afterStats.invocations} 次调用 / ${afterStats.sessions} 个会话(需 ≥${minObs} / ≥${minSess})`;
    } else {
      next = "observing";
      note = `观察中: ${afterStats.invocations}/${minObs} 次调用, ${afterStats.sessions}/${minSess} 个会话`;
    }
  } else {
    next = afterStats.rate <= vr.targetValue ? "verified" : "not_improved";
    note = next === "verified" ? `shell_timeout_rate ${(afterStats.rate * 100).toFixed(2)}% ≤ 目标 ${(vr.targetValue * 100).toFixed(2)}%` : `shell_timeout_rate ${(afterStats.rate * 100).toFixed(2)}% > 目标 ${(vr.targetValue * 100).toFixed(2)}% — REVERT RECOMMENDED`;
  }
  vr.status = next;
  if (next === "verified" || next === "not_improved" || next === "inconclusive") {
    vr.verdictAt = now;
    vr.verdict = note;
    await audit.append({ applyId: vr.applyId, improvementId: vr.proposalId, target: { ns: "shell", path: ["timeoutMs"] }, action: "verify.result", result: next === "verified" ? "ok" : "error", code: next });
  }
  await store.verifyTable.put(vr.applyId, vr);
```

</details>

**依据 2 · 源码核查**：[src/apply/rollback.ts:29-59](https://github.com/SenmuuuuW/dsh-whale-report/blob/a20003e6ddbd4352846bfbf6ad105127bfcc2ec4/src/apply/rollback.ts#L29-L59)

恢复需核对当前值并按修订写入。

<details>
<summary>查看原文（31行）</summary>

```text
  // 重读当前值: 只有 current == after 才允许回滚。
  const current = adapter.readShellTimeout();
  if (current === null) throw new ApplyError(APPLY_ERROR_CODES.SETTINGS_UNAVAILABLE, "shell settings unavailable");
  if (current.value !== record.after) {
    record.rollback.status = "conflicted";
    record.rollback.available = false;
    await store.recordTable.put(record.applyId, record);
    await audit.append({ applyId: record.applyId, improvementId: record.improvementId, target: { ns: record.target.ns, path: record.target.path }, action: "rollback.failed", result: "error", code: APPLY_ERROR_CODES.TARGET_CHANGED });
    throw new ApplyError(APPLY_ERROR_CODES.TARGET_CHANGED, `target changed after apply (current ${current.value}, applied ${record.after}); manual review required`);
  }

  const rollback: RollbackRecord = {
    rollbackId: input.rollbackId,
    applyId: record.applyId,
    target: { ...record.target },
    expectedCurrent: record.after,
    restoreTo: record.before,
    revisionBefore: current.revision,
    status: "requested",
  };
  await audit.append({ applyId: record.applyId, improvementId: record.improvementId, target: { ns: record.target.ns, path: record.target.path }, action: "rollback.attempted", result: "ok" });

  try {
    const written = await adapter.updateShellTimeout({
      expectedRevision: current.revision,
      expectedValue: current.value,
      nextValue: record.before,
    });
    if (written.value !== record.before) {
      rollback.status = "failed";
      throw new ApplyError(APPLY_ERROR_CODES.REVERT_FAILED, "value mismatch after rollback write");
```

</details>

#### 缺口

- 未执行配对任务
  **影响**：本地阈值通过不构成因果结论
  **进一步探讨**：对同组脱敏命令和固定机器复跑并计完整任务效果

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
