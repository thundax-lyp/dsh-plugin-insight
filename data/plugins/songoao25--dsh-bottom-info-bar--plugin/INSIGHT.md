# DSH Bottom Info Bar

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3f09c9e](https://github.com/songoao25/dsh-bottom-info-bar/tree/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/plugin)

<!-- BEGIN META -->
[![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/songoao25/dsh-bottom-info-bar) [![npm 30d 36,152](https://img.shields.io/static/v1?label=npm+30d&message=36%2C152&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bottom-info-bar) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bottom-info-bar)
<!-- END META -->

> **功能**：在 DSH 输入框下显示当前模型、余额和会话用量。

> **亮点**：把模型流 token、会话谱系、未计价状态和余额聚在输入区。[Q01](#research-q01)

> **主要限制**：本地表价可覆盖流中金额，缺 usage 会漏记。凭据操作、后台请求及自更新超出纯展示。[Q01](#research-q01) [Q02](#research-q02)

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
  - [1.7 采用建议](#detail-section-8)
- [2 未来设计假设（未验证）](#detail-section-9)
- [3 辅助信息](#detail-section-10)
- [4 研究问题与完整回答](#detail-section-11)
  - [Q01 · 信息栏从哪里取模型用量，何时可以拿来核对费用？](#detail-section-12)
  - [Q02 · 余额、凭据与自更新是否只读，能否独立控制？](#detail-section-13)
  - [Q03 · 怎样试用并验证显示账本与真实账单分开是否减少误判？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在使用多个模型时就地查看会话用量和余额的用户。

使用宿主原有 token 投影，并按供应商账单手工核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 底栏 | 观察模型、余额与会话费用 | 依赖宿主与价目 |
| 本地账本 | 按会话汇总记录 | 未计价及漏记录需另核 |
| 设置操作 | 凭据与自更新 | 需要主动复核开关 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH 流、连接、凭据和槽位 | 宿主条件 | 用量与界面 | 回到宿主和供应商账单 |
| 可核对价表及用量 | 计价条件 | 估算成本 | 保留未计价 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离 Profile 关闭自更新 | 验证路由和选项 |
| 核对 | 对照本地与模拟账单 | 不同则停止以此判断 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地账本与配置 | 设定权限和对照 | 真实成本未知 |
| 持续 | 余额和价表查询资源 | 核查未计价及账单 | 卸载仍保留账本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 就地费用信息 | 聚合流 token 和价格 | 不等同账单 |

> **思考**：本地表价可覆盖流中金额，缺 usage 会漏记。凭据操作、后台请求及自更新超出纯展示。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把模型流 token、会话谱系、未计价状态和余额聚在输入区。[Q01](#research-q01)

对流中断及缺价有明确状态；实际价格选择与注释优先级不同。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地表价可覆盖流中金额，缺 usage 会漏记。凭据操作、后台请求及自更新超出纯展示。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离 Profile 先关闭自动更新，不填真实凭据，核对短任务与测试账单。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持流用量、账本和管理路由，真实计费及宿主兼容待验。

固定身份为 plugin 子目录，跟踪树仅有四个 Git 链接。审阅同提交的真实根清单、补丁与 lib。未执行插件、目标测试或账单请求。

本轮只读取固定源码与装配材料。以目录链接安装、宿主运行、模型任务和真实账单均未验收。

**分析版本**

- **仓库**：[songoao25/dsh-bottom-info-bar](https://github.com/songoao25/dsh-bottom-info-bar)
- **版本号**：1.24.6（[固定提交 3f09c9e](https://github.com/songoao25/dsh-bottom-info-bar/tree/3f09c9ea4bbbd363a59b867ec48cd2829ab88805)）
- **版本日期**：2026-11-13（固定提交日期，北京时间）

<a id="detail-section-8"></a>

### 1.7 采用建议

隔离 Profile 先关闭自动更新，不填真实凭据，核对短任务与测试账单。[Q03](#research-q03)

<a id="detail-section-9"></a>

## 2 未来设计假设（未验证）

明确并列供应商金额和本地估算范围，可能减少将账本当账单的误判。[Q03](#research-q03)

复核本地目录与链接、模拟价格冲突与无 usage、禁用更新及角色边界。

<a id="detail-section-10"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

组件范围是固定 Git 树中的 `plugin`。跟踪对象为四个符号链接，该范围的 inventory 没有常规文件统计。证据按链接关系读取同一提交根树的常规文件。不能将根仓库统计作为此组件自身代码规模。

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/songoao25/dsh-bottom-info-bar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/songoao25/dsh-bottom-info-bar/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/songoao25/dsh-bottom-info-bar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-11"></a>

## 4 研究问题与完整回答

**插件研究总目标**：信息栏汇总的费用与供应商账单如何区分，使用余额查询、凭据和自更新时有哪些运行边界？

<a id="research-q01"></a>

<a id="detail-section-12"></a>

### Q01 · 信息栏从哪里取模型用量，何时可以拿来核对费用？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

频繁切换模型的 DSH 用户可以在输入区就地看到本地账本。Host 监听 llm/stream，只保留最新 usage 快照，在完成或中断时最多提交一次；没有可用 usage 的流不会入账。源代码注释声称供应商报出金额优先，但条件实际先取 costOf 的结果，只有表算不出时才用 usage.cost；两者不同可能造成偏差。无法定价的记录单独计数，界面会标注部分费用缺失。会话汇总可以包含子代理，而顶部原生缓存字段口径不同；应以供应商账单为对照。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4345-4384](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/index.js#L4345-L4384)

流用量记录、金额选择及 unpriced 分支。

<details>
<summary>查看原文（40行）</summary>

```text
    async function recordUsage(options, usage, status) {
      const u = usage || {};
      // 数值清洗：uncachedInputTokens 的 != null 对 NaN 恒真、|| 0 挡不住 Infinity/负值——
      // 统一 sanitizeTokens（NaN/Infinity/负数/非数字 → 0），坏数值不进内存汇总也不落盘
      const rec = {
        id: randomUUID(),
        ts: Date.now(),
        model: options.model || '',
        provider: options.provider || '',
        sessionId: options.sessionId || '',
        purpose: options.purpose || '',
        input: sanitizeTokens(u.uncachedInputTokens != null ? u.uncachedInputTokens : u.inputTokens),
        cacheRead: sanitizeTokens(u.cacheReadTokens),
        cacheWrite: sanitizeTokens(u.cacheWriteTokens),
        output: sanitizeTokens(u.outputTokens),
        status: status === 'interrupted' ? 'interrupted' : 'completed',
      };
      // 单调时间戳由账本 worker 在写入时保证（同毫秒并发也不会串会话），主线程不再查 lastTs。
      // Freeze the actual price at usage time.  Historical totals must not
      // change merely because the plugin's reference price table is updated.
      const billed = costOf(rec, false);
      // ① 聚合商在 usage 中直接给出的真实金额（如 OpenRouter 的 usage.cost）——
      //    官方报出的钱优先级最高，聚合商场景从此免维护静态价目表；
      // ② 价目表换算（当前各家官方单价）；③ 都没有 → unpriced 待启动回填。
      const reportedCost = parseFiniteNonNegativeAmount(u.cost);
      if (billed == null && reportedCost != null) {
        rec.cost = reportedCost;
        rec.currency = Object.hasOwn(PROVIDER_REPORTED_CURRENCY, rec.provider)
          ? PROVIDER_REPORTED_CURRENCY[rec.provider]
          : modelCurrency(rec.provider, rec.model);
        rec.pricingStatus = 'priced';
        rec.pricingVersion = 'provider-reported-' + packageVersion();
      } else if (billed != null) {
        rec.currency = modelCurrency(rec.provider, rec.model);
        rec.cost = billed;
        rec.pricingStatus = 'priced';
        rec.pricingVersion = 'builtin-' + packageVersion();
      } else {
        rec.pricingStatus = 'unpriced';
        rec.pricingVersion = null;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4406-4442](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/index.js#L4406-L4442)

抓取最后一条 usage，结束或中断时提交。

<details>
<summary>查看原文（37行）</summary>

```text
    ctx.on('llm/stream', async function* (options, next) {
      try {
        activeUsageStreams += 1;
        let stream;
        try {
          stream = await next();
        } catch (err) {
          console.warn('[dsh-bottom-info-bar] llm/stream 获取失败，本次不记账', String((err && err.message) || err));
          throw err; // 保持错误向上传播：不把上游失败消化成空流（仅跳过记账逻辑）
        }
        let latestUsage = null;
        let sawFinish = false;
        let committed = false;
        async function commitUsage(status) {
          if (committed || !hasUsageTokens(latestUsage)) return;
          committed = true;
          try { await recordUsage(options, latestUsage, status); } catch (err) {
            ledgerError = { kind: 'journal-failed', message: String((err && err.message) || err), at: Date.now() };
            console.warn('[dsh-bottom-info-bar] 本次账单未保存', ledgerError.message);
          }
        }
        try {
          for await (const chunk of stream) {
            if (chunk && chunk.type === 'usage' && chunk.usage) {
              // DSH usage chunks are treated as snapshots.  Keep the last one
              // and commit it once when this model response finishes.
              latestUsage = Object.assign({}, chunk.usage);
            }
            if (chunk && chunk.type === 'finish') sawFinish = true;
            yield chunk;
          }
        } catch (err) {
          await commitUsage('interrupted');
          throw err;
        } finally {
          await commitUsage(sawFinish ? 'completed' : 'interrupted');
        }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4528-4560](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/index.js#L4528-L4560)

归集会话及子代理，并保留未计价记录。

<details>
<summary>查看原文（33行）</summary>

```text
      const ownedEntries = await store.ownedSessions(activeAccount, ownedSessionIds);
      for (const entry of ownedEntries) {
        matched = true;
        if (entry.minTs != null && (sinceTs == null || entry.minTs < sinceTs)) sinceTs = entry.minTs;
        acc.input += entry.input;
        acc.cacheRead += entry.cacheRead;
        acc.cacheWrite += entry.cacheWrite;
        acc.output += entry.output;
        acc.unpricedRecords += entry.unpricedRecords || 0;
        acc.unpricedTokens += entry.unpricedTokens || 0;
        for (const currency of Object.keys(entry.costs || {})) {
          acc.costs[currency] = (acc.costs[currency] || 0) + (Number(entry.costs[currency]) || 0);
        }
      }
      if (!matched) return null; // 明确传入但未命中（新会话尚无记账）→ 客户端显示 ¥0.000
      const denom = acc.input + acc.cacheRead + acc.cacheWrite;
      return {
        input: acc.input,
        cacheRead: acc.cacheRead,
        cacheWrite: acc.cacheWrite,
        output: acc.output,
        tokens: acc.input + acc.cacheRead + acc.cacheWrite + acc.output,
        costs: acc.costs || {},
        // 未计价记录数与 token 数：客户端据此显示"费用暂不可计算"，绝不把 0 当成真实花费
        unpricedRecords: acc.unpricedRecords,
        unpricedTokens: acc.unpricedTokens,
        // 按 token 计的缓存读取占比（一位小数）。注意口径：本字段覆盖当前会话**及其子代理**
        // （谱系合计），而底栏顶部那行"缓存命中"来自 DSH 原生 tokenUsage 投影（仅主 Agent）。
        hitRate: denom > 0 ? Math.round((acc.cacheRead / denom) * 1000) / 10 : null,
        // 该会话最早的记账时刻（Issue #245）：客户端据此在 tooltip 写明统计起点。
        // 没有它时客户端不编造"统计自何时"，只保留原有的含子代理说明。
        sinceTs: sinceTs,
      };
```

</details>

**依据 4 · 源码核查**：[lib/client.js:4004-4016](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/client.js#L4004-L4016)

将占位挂入宿主输入 dock。

<details>
<summary>查看原文（13行）</summary>

```text
        console.error('Bottom Info Bar 切换信息密度失败', err);
      });
    }

    slots.inject('conversation.composer.dock', function () {
      applyMode();
      return function () { if (occupantDispose) occupantDispose(); };
    });

    // 插件配置页与信息栏同一 bundle/生命周期；样式在插件页打开时复用。
    ctx.effect(function () {
      return bibSetInstallStyles();
    }, 'dsh-bottom-info-bar: plugin config styles');
```

</details>

**依据 5 · 源码核查**：[lib/client.js:4688-4711](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/client.js#L4688-L4711)

显示已计价与部分未计价。

<details>
<summary>查看原文（24行）</summary>

```text
            const costCNY = cs && cs.costs && cs.costs.CNY != null ? cs.costs.CNY : null;
            const costUSD = cs && cs.costs && cs.costs.USD != null ? cs.costs.USD : null;
            const symbol = usdSymbol ? '$' : '¥';
            const priced = costCNY != null || costUSD != null;
            const unpricedRecords = cs && cs.unpricedRecords ? cs.unpricedRecords : 0;
            // 有 token 但一条都没定价 → 绝不用 ¥0.000 冒充“没有花费”（审计 2026-10-05）：
            // 未收录模型只记账、不猜价，界面必须直说“暂不可计算”；部分未计价则前缀 ≈。
            const hasTokens = !!(cs && cs.tokens > 0);
            const costTxt = priced
              ? (unpricedRecords > 0 ? '≈' : '') + (costCNY != null ? '¥' + costCNY.toFixed(3) : '$' + costUSD.toFixed(3))
              : (hasTokens ? symbol + '—' : symbol + (0).toFixed(3));
            const today = usg.todaySpend != null ? t('ui.today', { symbol: symbol, value: fmt(usg.todaySpend, 3) }) : '';
            const month = usg.last30dSpend != null ? t('ui.lastDays', { symbol: symbol, value: fmt(usg.last30dSpend, 3) }) : '';
            const total = usg.totalSpend != null ? t('ui.allTime', { symbol: symbol, value: fmt(usg.totalSpend, 3) }) : '';
            const detail = [today, month, total].filter(function (s) { return s.length > 0; }).join(' · ');
            const costTitle = [t('ui.sessionIncludingSubagents', { costTxt: costTxt, value: detail ? '\n' + detail : '' })];
            if (!priced && hasTokens) costTitle.push(t('ui.pricingNotListedUsingDefaults'));
            else if (priced && unpricedRecords > 0) costTitle.push(t('ui.spendPartlyUnpriced'));
            // Issue #245：账本从插件开始运行时才有记录，装插件之前跑掉的调用不在里面。
            // 标签保持「本会话」不动，只在 tooltip 里如实写出统计起点；宿主没给出起点时
            // 一个字都不编（旧宿主 / 本会话尚无记账都走这条空路径）。
            if (cs && cs.sinceTs) costTitle.push(t('ui.sessionCostSince', { time: formatDateTime(cs.sinceTs) }));
            groups.push(fieldSpan('sessionCost', 'convo', React.createElement('span', {
              title: costTitle.join('\n') },
```

</details>

#### 缺口

- 未运行真实 Host、模型流和对账
  **影响**：无法确认实际费用偏差或覆盖率
  **进一步探讨**：用固定 mock 对照有无 usage、直接金额及表价冲突

<a id="research-q02"></a>

<a id="detail-section-13"></a>

### Q02 · 余额、凭据与自更新是否只读，能否独立控制？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

启动先合并本地价表，后台请求远程价目及余额，订阅及账单路径对已请求源刷新。Web API 借助 DSH connection.requestRejection，并要求配置变更走 POST；凭据写入限定引用名，写后刷新订阅状态。自更新只在检测为 Profile 安装且未由环境变量关闭时安排，访问设置页可以推迟本次自动流程，仍有安装及回滚路由。这些行为涉及本地凭据和包文件，不能把整个组件视为只读显示。固定组件中的清单和构建产物是 Git symlink，实际取证用同提交根目录的常规 blob；补充文件保留四条链接对象和内容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2086-2118](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/index.js#L2086-L2118)

自更新门槛、时序与设置页暂停。

<details>
<summary>查看原文（33行）</summary>

```text
    // ---------- 自更新（2026-09-25 用户拍板：一键自更新 + 全自动，除重启）----------
    // 宿主插件管理只有「安装 / 卸载 / 启用 / 停用」，没有「更新」，对已安装的包再填同一地址会被
    // inspect 以 already-installed 拦下 —— 用户侧原本唯一路径是「卸载 → 重装」。本插件零运行时依赖，
    // 因此「更新」只需替换包内自己的文件。五条硬边界见 src/self-update.js 顶部与决策文档。
    // 启动后延迟触发，避开宿主启动高峰；任何失败只记状态，绝不打断信息栏。
    // 环境变量 DSH_BOTTOM_INFO_BAR_SELF_UPDATE=off 可整体禁用（测试隔离用，见 tests/run-all.mjs）；
    // 另外只有「确实被当作 profile 插件装载」时才启用（见 isLoadedAsProfilePlugin：开发副本与
    // link: 安装天然排除，后者自更新会改写用户的工作副本）。
    const SELF_UPDATE_ENABLED = process.env.DSH_BOTTOM_INFO_BAR_SELF_UPDATE !== 'off' && isLoadedAsProfilePlugin()
    // 首次自动检查/安装的延迟：默认 30 秒 + 0–5 秒抖动（见 src/self-update.js 的 selfUpdateDelayMs）。
    // 原来固定 8 秒，恰好落在宿主自己的启动窗口里；issue #260 之后整体后移，并可用环境变量覆盖。
    const SELF_UPDATE_DELAY_MS = selfUpdateDelayMs(process.env)
    // 此次 DSH 启动期间只要用户进入过插件设置页，自动更新就留到下次重启。
    // 页面里点「检查更新」仍只检查；安装必须由确认动作触发。
    let updatePageVisited = false
    let selfUpdater = null
    if (SELF_UPDATE_ENABLED) {
      selfUpdater = createSelfUpdater({
        packageDir: PACKAGE_DIR,
        dataDir: DATA_DIR,
        runningVersion: packageVersion(),
        autoInstallAllowed: function () { return !updatePageVisited },
        log: function (message) { try { console.warn('[dsh-bottom-info-bar] ' + message) } catch (err) { /* 日志失败无害 */ } },
      })
      selfUpdater.loadState()
      // 定时器随插件生命周期清理：宿主 ctx 提供 effect；桩 ctx / 老宿主没有时退回直接挂定时器
      // （unref 保证不会拖住进程退出）。读 ctx.effect 一律包在 try 里 —— cordis 4 的 Context 是
      // Proxy，某些形态下读未声明的属性会抛 "without inject"，这一点本仓库已踩过三次。
      const scheduleSelfUpdate = function () {
        const timer = setTimeout(function () {
          if (updatePageVisited) return
          selfUpdater.run().catch(function () { /* 状态已落盘，无需上抛 */ })
        }, SELF_UPDATE_DELAY_MS)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4894-4924](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/index.js#L4894-L4924)

凭据写入与清除。

<details>
<summary>查看原文（31行）</summary>

```text
      // v1.24.0：额度凭据（阿里 AccessKey / Kimi Key）——插件设置页直接保存/清除。
      // 只读状态永远可用；写入只走白名单引用名，错误用稳定 code 回给客户端翻译。
      getCredentialConfig: async function () {
        return describeCredentialConfig();
      },
      setCredential: async function (args) {
        const ref = credentialConfigRef(args);
        if (!ref) return { ok: false, code: 'invalid-ref' };
        if (typeof ctx.credentials.set !== 'function') return { ok: false, code: 'write-unsupported' };
        const value = credentialConfigValue(args);
        if (!value) return { ok: false, code: 'invalid-value' };
        try {
          await ctx.credentials.set(ref, value);
        } catch (err) {
          // 宿主原始报错可能带路径/细节：只回稳定 code，不把原文透给界面。
          return { ok: false, code: 'write-failed' };
        }
        await refreshSubscriptionAfterCredential(ref);
        return Object.assign({ ok: true }, await describeCredentialConfig());
      },
      clearCredential: async function (args) {
        const ref = credentialConfigRef(args);
        if (!ref) return { ok: false, code: 'invalid-ref' };
        if (typeof ctx.credentials.unset !== 'function') return { ok: false, code: 'write-unsupported' };
        try {
          await ctx.credentials.unset(ref);
        } catch (err) {
          return { ok: false, code: 'write-failed' };
        }
        await refreshSubscriptionAfterCredential(ref);
        return Object.assign({ ok: true }, await describeCredentialConfig());
```

</details>

**依据 3 · 源码核查**：[lib/index.js:5205-5247](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/index.js#L5205-L5247)

共享宿主认证及路由方法限制。

<details>
<summary>查看原文（43行）</summary>

```text
    // Desktop validates dsh-app://app before forwarding, then deliberately removes renderer
    // Origin/Host headers and adds its private Host cookie. requestRejection() is the shared
    // boundary for both Web and Desktop; reproducing the browser-header check here rejects
    // legitimate desktop requests.
    ctx.inject(['connection', 'webServer'], function (webCtx) {
      webCtx.effect(function () {
        const dispose = webCtx.webServer.register({
          kind: 'prefix',
          path: ROUTE_PREFIX,
          handler: async function (req, res) {
            let method = '';
            try {
              const rejection = webCtx.connection.requestRejection(req);
              if (rejection !== undefined) {
                respond(res, rejection, { error: rejection === 401 ? 'authentication required' : 'request rejected' });
                return;
              }
              const url = new URL(req.url || '/', 'http://localhost');
              const path = url.pathname;
              if (!path.startsWith(ROUTE_PREFIX + '/')) {
                respond(res, 404, { error: 'not found' });
                return;
              }
              method = decodeURIComponent(path.slice(ROUTE_PREFIX.length + 1));
              if (method === 'downloadUsageRecords') {
                if (req.method !== 'GET') { respond(res, 405, { error: 'downloads require GET' }); return; }
                await streamUsageExport(req, res, url.searchParams.get('format'));
                return;
              }
              const fn = Object.hasOwn(ROUTES, method) ? ROUTES[method] : null;
              if (typeof fn !== 'function') {
                respond(res, 404, { error: 'unknown method: ' + method });
                return;
              }
              if (Object.hasOwn(MUTATING, method) && req.method !== 'POST') {
                respond(res, 405, { error: 'mutating methods require POST' });
                return;
              }
              let args = {};
              if (req.method === 'POST' || req.method === 'PUT') {
                const raw = await readBody(req, 64 * 1024);
                if (raw.length > 0) {
                  try { args = JSON.parse(raw); } catch (e) { respond(res, 400, { error: 'invalid JSON body' }); return; }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:5270-5285](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/index.js#L5270-L5285)

价表、余额和账单刷新，卸载不清本地账本。

<details>
<summary>查看原文（16行）</summary>

```text
    // 价目目录：① 离线兜底（磁盘缓存先同步合并）→ ② 回填 → ③ 异步拉远程增量（成功后再回填一次）
    const cachedPricing = loadPricingCacheFromDisk();
    if (cachedPricing) applyRemotePricingEntries(cachedPricing);
    backfillUnpricedRecords(); // 内置表已覆盖的部分先补算
    refreshRemotePricing('启动'); // 网络刷新异步进行；成功后内部会再次触发回填
    ctx.interval(function () { refreshRemotePricing('定时'); }, REMOTE_PRICING_REFRESH_MS);
    refreshAllBalances();
    refreshActiveSubscriptions(); // 惰性：无客户端请求过订阅源则不发起网络请求
    refreshActiveBilling(); // v1.7：账单型同样惰性
    refreshActiveModelCatalog(); // M5：启动即拉一次 DSH 目录名（llm 缺失时静默回退，绝不崩溃）
    ctx.interval(refreshAllBalances, 60000);
    ctx.interval(refreshActiveSubscriptions, 60000);
    ctx.interval(refreshActiveBilling, 60000); // v1.7

    // Every bill is already durable. Disposal closes storage; only an explicit settings action clears data.
    // 清理函数是异步的：账本在 worker 线程里，先冲刷并关闭 worker 再放行宿主卸载/退出。
```

</details>

**依据 5 · 源码核查**：[package.json:24-32](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/package.json#L24-L32)

根常规清单导出路径。

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
```

**依据 6 · 源码核查**：[cordis.patch.yml:13-15](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/cordis.patch.yml#L13-L15)

根常规补丁挂载。

```text
- insert:
    - id: bottom-info-bar
      name: 'dsh-bottom-info-bar'
```

#### 缺口

- 未验目标宿主连接认证、安装类型及实际供应商请求
  **影响**：无法保证每种部署的出站范围和回滚
  **进一步探讨**：使用隔离 Profile、替代凭据服务和禁用更新对照实际路由

<a id="research-q03"></a>

<a id="detail-section-14"></a>

### Q03 · 怎样试用并验证显示账本与真实账单分开是否减少误判？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先在隔离 Profile 关闭自更新并不写入新凭据，用短任务检查 token、币种和成本与模拟账单。成本包括本地日志、价表及余额刷新、独立对账的人工时间。可试验并列显示提供商金额与估算值及观测范围，观察用户能否更快发现实际账单与本地表差异；若增加信息噪音而不能降低错误确认则不采用。显示与实际账单不一致时停止以它作费用判断，停用插件并核查留存账本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4363-4384](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/index.js#L4363-L4384)

计价分支适合作为来源标签对照。

<details>
<summary>查看原文（22行）</summary>

```text
      // Freeze the actual price at usage time.  Historical totals must not
      // change merely because the plugin's reference price table is updated.
      const billed = costOf(rec, false);
      // ① 聚合商在 usage 中直接给出的真实金额（如 OpenRouter 的 usage.cost）——
      //    官方报出的钱优先级最高，聚合商场景从此免维护静态价目表；
      // ② 价目表换算（当前各家官方单价）；③ 都没有 → unpriced 待启动回填。
      const reportedCost = parseFiniteNonNegativeAmount(u.cost);
      if (billed == null && reportedCost != null) {
        rec.cost = reportedCost;
        rec.currency = Object.hasOwn(PROVIDER_REPORTED_CURRENCY, rec.provider)
          ? PROVIDER_REPORTED_CURRENCY[rec.provider]
          : modelCurrency(rec.provider, rec.model);
        rec.pricingStatus = 'priced';
        rec.pricingVersion = 'provider-reported-' + packageVersion();
      } else if (billed != null) {
        rec.currency = modelCurrency(rec.provider, rec.model);
        rec.cost = billed;
        rec.pricingStatus = 'priced';
        rec.pricingVersion = 'builtin-' + packageVersion();
      } else {
        rec.pricingStatus = 'unpriced';
        rec.pricingVersion = null;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:4688-4711](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/client.js#L4688-L4711)

当前界面已标部分未计价，尚需独立对照来源。

<details>
<summary>查看原文（24行）</summary>

```text
            const costCNY = cs && cs.costs && cs.costs.CNY != null ? cs.costs.CNY : null;
            const costUSD = cs && cs.costs && cs.costs.USD != null ? cs.costs.USD : null;
            const symbol = usdSymbol ? '$' : '¥';
            const priced = costCNY != null || costUSD != null;
            const unpricedRecords = cs && cs.unpricedRecords ? cs.unpricedRecords : 0;
            // 有 token 但一条都没定价 → 绝不用 ¥0.000 冒充“没有花费”（审计 2026-10-05）：
            // 未收录模型只记账、不猜价，界面必须直说“暂不可计算”；部分未计价则前缀 ≈。
            const hasTokens = !!(cs && cs.tokens > 0);
            const costTxt = priced
              ? (unpricedRecords > 0 ? '≈' : '') + (costCNY != null ? '¥' + costCNY.toFixed(3) : '$' + costUSD.toFixed(3))
              : (hasTokens ? symbol + '—' : symbol + (0).toFixed(3));
            const today = usg.todaySpend != null ? t('ui.today', { symbol: symbol, value: fmt(usg.todaySpend, 3) }) : '';
            const month = usg.last30dSpend != null ? t('ui.lastDays', { symbol: symbol, value: fmt(usg.last30dSpend, 3) }) : '';
            const total = usg.totalSpend != null ? t('ui.allTime', { symbol: symbol, value: fmt(usg.totalSpend, 3) }) : '';
            const detail = [today, month, total].filter(function (s) { return s.length > 0; }).join(' · ');
            const costTitle = [t('ui.sessionIncludingSubagents', { costTxt: costTxt, value: detail ? '\n' + detail : '' })];
            if (!priced && hasTokens) costTitle.push(t('ui.pricingNotListedUsingDefaults'));
            else if (priced && unpricedRecords > 0) costTitle.push(t('ui.spendPartlyUnpriced'));
            // Issue #245：账本从插件开始运行时才有记录，装插件之前跑掉的调用不在里面。
            // 标签保持「本会话」不动，只在 tooltip 里如实写出统计起点；宿主没给出起点时
            // 一个字都不编（旧宿主 / 本会话尚无记账都走这条空路径）。
            if (cs && cs.sinceTs) costTitle.push(t('ui.sessionCostSince', { time: formatDateTime(cs.sinceTs) }));
            groups.push(fieldSpan('sessionCost', 'convo', React.createElement('span', {
              title: costTitle.join('\n') },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:5279-5286](https://github.com/songoao25/dsh-bottom-info-bar/blob/3f09c9ea4bbbd363a59b867ec48cd2829ab88805/lib/index.js#L5279-L5286)

定时刷新和持久化退出边界。

```text
    refreshActiveModelCatalog(); // M5：启动即拉一次 DSH 目录名（llm 缺失时静默回退，绝不崩溃）
    ctx.interval(refreshAllBalances, 60000);
    ctx.interval(refreshActiveSubscriptions, 60000);
    ctx.interval(refreshActiveBilling, 60000); // v1.7

    // Every bill is already durable. Disposal closes storage; only an explicit settings action clears data.
    // 清理函数是异步的：账本在 worker 线程里，先冲刷并关闭 worker 再放行宿主卸载/退出。
    return async function () {
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
