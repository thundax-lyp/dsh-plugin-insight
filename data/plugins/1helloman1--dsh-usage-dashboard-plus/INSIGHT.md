# dsh-usage-dashboard-plus

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ee53a4d](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/tree/ee53a4d07d212f02fe64ec64eb8a9a84163bd439)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus) [![npm 30d 1,036](https://img.shields.io/static/v1?label=npm+30d&message=1%2C036&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-dashboard-plus) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-usage-dashboard-plus)
<!-- END META -->

> **实现功能**：在DSH侧栏显示DeepSeek余额和日志估算消费，并汇总外部视觉调用与每会话模型/延迟统计。

> **核心亮点**：把外部视觉用量和原会话统计接到余额/消费看板。详见[Q01](#research-q01)。

> **风险与缺陷**：明文session.jsonl被仅zstd解码成空，cacheWrite侧栏按input而投影按output，未知价仍套默认金额。详见[Q03](#research-q03)。

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
  - [Q01 · Plus把哪些用量信息汇到一起？](#detail-section-11)
  - [Q02 · 侧栏和会话投影如何计算？](#detail-section-12)
  - [Q03 · 哪些路径可能静默少算或错价？](#detail-section-13)
  - [Q04 · 准入、缓存和工程验证有什么边界？](#detail-section-14)
  - [Q05 · 采用结论和继续探讨方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户查看会话内外调用趋势、余额和缓存表现。详见[Q01](#research-q01)。

平台余额页与手工日志统计，汇总便利不等真实账单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 余额查询 | DeepSeek账户 | TTL主体未分区 |
| 日志估算 | 内外用量 | 格式/价格差异 |
| 会话投影 | 延迟缓存/调用 | 500行日志与独立算式 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| 旧宿主projection/settings | 看板折叠 | ABI匹配 |
| Node zstd API | 压缩日志 | 无engines提示 |
| 可信余额端点/key | 账户读取 | 缓存/接收方需核 |
| 正确格式日志和价表 | 消费估算 | 静默漏失/未知价 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核格式价格账户 | 用户 | 原日志/账单可对 |
| 小样例看两页面 | 用户 | cacheWrite口径一致 |
| 追加外部日志 | 用户 | 避免重复记录 |
| 异常回原账 | 用户 | 0不等无调用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容宿主/原日志/价表 | 核账户、格式和单位 | 日志格式/价表/单位需对齐；准备工时未知 |
| 持续使用 | 同步扫描解压/余额查询 | 对照原日志、账号账单与价格单位 | 无插件LLM调用；扫描/查询延迟和账单误差未量化 |
| 失败恢复 | 原日志和账单 | 查漏计/双记/价格与清缓存 | 原日志/账单复核和缓存恢复时间未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 余额与消费联看 | API+日志 | 不同主体/时间 |
| 外部视觉纳入 | JSONL追加读 | 重复/无覆盖回执 |
| 性能/调用统计 | 会话投影500日志 | TTFT含思考，计价独立 |

> **思考**：明文session.jsonl被仅zstd解码成空，cacheWrite侧栏按input而投影按output，未知价仍套默认金额。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把外部视觉用量和原会话统计接到余额/消费看板。详见[Q01](#research-q01)。

把外部视觉用量和原会话统计接到余额/消费看板。详见[Q01](#research-q01)。

投影与余额汇总有可读结构，副本测试不守生产逻辑，需统一计量内核。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

明文session.jsonl被仅zstd解码成空，cacheWrite侧栏按input而投影按output，未知价仍套默认金额。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，可信单用户只作趋势对照。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

多源汇总源码可查，但明文静默漏读、两套cacheWrite计价及未知模型默认价影响核心口径。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、test/isTokenDelta.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定完整侧栏日志/余额/route链、投影事件与计价、token副本测试和README；客户端仅功能契约不穷尽交互。
- 下一步：进一步从明文/坏帧、双计、未知价和跨时区研究覆盖回执。

**分析版本**

- **仓库**：[1HelloMan1/dsh-usage-dashboard-plus](https://github.com/1HelloMan1/dsh-usage-dashboard-plus)
- **版本号**：0.2.5（[固定提交 ee53a4d](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/tree/ee53a4d07d212f02fe64ec64eb8a9a84163bd439)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究统一版本化计量核、明确格式/覆盖/去重回执与账户cache，比较漏计/金额差。当前未验证。详见[Q05](#research-q05)。

进一步从明文/坏帧、双计、未知价和跨时区研究覆盖回执。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 194 | — | — | 1531 |
| .js | source | 2 | 1600 | 1441 | 109 | — |
| .mjs | test | 2 | 44 | 40 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/issues?q=is%3Aissue+created%3A2026-09-22T06%3A38%3A42.151Z..2026-10-22T06%3A38%3A42.151Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A38%3A42.151Z..2026-10-22T06%3A38%3A42.151Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**余额、日志估算和投影统计是否口径一致，完整性与准入如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Plus把哪些用量信息汇到一起？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

面向DSH个人用户，在侧栏看DeepSeek余额和按本地token估算的今日消费，设置看板再按会话/供应商/模型看调用日志、延迟/TTFT/缓存和CSV。Plus新增外部视觉调用JSONL并合并原stats投影，减少会话内外用量分散；贡献是现有余额接口、本地日志扫描与投影界面的组合，不是新计费协议。

余额是指定账户API返回，消费是本地价格表估算，二者时间范围/主体不同，不能直接做充值差额对账。作者“唯一维护仓库”等说法未独立核实，不作推荐依据。合格输出需能说明日志覆盖、未知模型价格、日期时区和缓存旧值，否则漂亮数字可能不完整。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-22](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/README.md#L5-L22)

作者功能与合并定位。

<details>
<summary>查看原文（18行）</summary>

```text
A fork of [dsh-usage-dashboard](https://www.npmjs.com/package/dsh-usage-dashboard) with **external vision-call accounting**: a sidebar-footer widget for [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness) showing your **DeepSeek API balance** and **today's spend**, estimated from session logs.

This is now the only actively maintained usage-dashboard repository. The former `dsh-stats-dashboard` implementation has been fully merged into Plus; do not install both statistics plugins in the same profile.

## What "Plus" adds

- **Counts external vision-model calls** (e.g. `dsh-vision-fallback`'s Mimo V2.5 requests) into the today-spend stats via an optional JSONL usage log — the base package only counts calls recorded in DSH session logs.
- Bundles a **pricing entry for `mimo-v2.5`** (opencode Zen GO rates) so those calls get a cost estimate out of the box (override via `prices`).

## Features

- **API balance** — resolves the DeepSeek key through the DSH credentials service and queries the balance endpoint (cached).
- **Today's spend (est.)** — scans session logs (and the external usage log) for today's token usage × price table.
- **Sidebar footer widget** — `余额 ¥xx · 今日 ¥xx`, click to open a detail card (calls, tokens, per-model breakdown, pricing notes).
- **Peak/off-peak pricing schedule** — date-gated DeepSeek rate tables (2026-08-17 onward).
- **Full usage dashboard** — per-provider/per-model calls, latency, TTFT, throughput, input/output/cache tokens, cache rate, and estimated cost.
- **Call-log analysis** — filter and search by session, provider, and model; inspect recent calls and export filtered rows as CSV.
- **Inherited Stats implementation** — the `usageDashboard` session projection, 500-row call-log cap, whole-session model aggregates, and replay-safe historical statistics are included in Plus.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:433-467](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L433-L467)

余额返回。

<details>
<summary>查看原文（35行）</summary>

```text
  const fetchBalance = async () => {
    const now = Date.now();
    if (balanceCache.value !== null && now - balanceCache.at < config.balanceCacheMs) return balanceCache.value;
    const key = await resolveApiKey();
    if (key === void 0) {
      const value = { available: false, error: `未配置 API Key（${config.apiKeyRef}）` };
      balanceCache = { at: now, value };
      return value;
    }
    try {
      const res = await fetch(`${balanceBase()}/user/balance`, {
        headers: { authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) {
        let detail = "";
        try {
          detail = (await res.text()).slice(0, 200);
        } catch { /* ignore */ }
        const value = { available: false, error: `balance API ${res.status}: ${detail}` };
        balanceCache = { at: now, value };
        return value;
      }
      const data = await res.json();
      const info = Array.isArray(data?.balance_infos) ? data.balance_infos[0] : void 0;
      const value = {
        available: data?.is_available === true,
        currency: info?.currency ?? "CNY",
        totalBalance: Number(info?.total_balance),
        grantedBalance: Number(info?.granted_balance),
        toppedUpBalance: Number(info?.topped_up_balance),
        fetchedAt: now
      };
      balanceCache = { at: now, value };
      return value;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:494-503](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L494-L503)

估算标记/价格。

<details>
<summary>查看原文（10行）</summary>

```text
        const [balance, usage] = await Promise.all([fetchBalance(), Promise.resolve(todayUsage())]);
        body = JSON.stringify({
          ok: true,
          estimated: true,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "local",
          generatedAt: Date.now(),
          balance,
          ...usage,
          externalCalls: readExternalCalls(config.externalUsageLog ?? ""),
          prices: { ...prices, ...schedule.length > 0 ? { _schedule: schedule } : {} }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 侧栏和会话投影如何计算？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

host注册usageDashboard投影，同时GET/HEAD /api/dsh-usage并行取余额和同步算使用。key先credentials.resolve再同名环境变量，baseURL可配置；余额缓存TTL默认60秒，usage缓存2秒。扫描sessionsRoot收session.jsonl.zstd或session.jsonl，按文件mtime窗口筛，再从request/header跟model、assistant/message usage逐条归本地日期；外部JSONL没有相同窗口筛，按ts或缺失时now累计。

投影从request/header/context记provider/model，step/start记时间，text/reasoning/tool-call任一有效增量作firstTokenTime，assistant/message归同turn/step算延迟和费用，最多500条调用日志但整会话模型聚合继续累积。TTFT是首任意token活动含思考/工具，不等首可见正文；无openStep或不匹配的message会忽略。依赖旧rc.6系列会话/投影/settings API与Node zstdDecompressSync，package无Node engines，实际宿主Node须支持该函数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:405-430](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L405-L430)

装配/凭据。

<details>
<summary>查看原文（26行）</summary>

```text
function apply(ctx, config) {
  // 注册 usageDashboard 会话投影（合并自 dsh-stats-dashboard）：设置页统计看板的数据源。
  ctx.effect(() => ctx.sessionProjections.register(usageDashboardProjectionDefinition),
    "usage-dashboard: usageDashboard projection unit");
  const prices = { ...DEFAULT_PRICES, ...(config.prices ?? {}) };
  const schedule = [...DEFAULT_PRICE_SCHEDULE, ...(config.priceSchedule ?? [])].sort((a, b) => a.from.localeCompare(b.from));
  let balanceCache = { at: 0, value: null };
  let usageCache = { at: 0, value: null };
  const sessionsRoot = config.sessionsRoot !== ""
    ? config.sessionsRoot
    : join(resolveDshHome(), "sessions");

  const resolveApiKey = async () => {
    const credentials = ctx.get("credentials");
    if (credentials !== void 0) {
      const hit = await credentials.resolve(credentialRef(config.apiKeyRef));
      if (hit !== void 0 && typeof hit.value === "string" && hit.value.trim() !== "") return hit.value.trim();
    }
    const ambient = process.env[config.apiKeyRef];
    if (ambient !== void 0 && ambient.trim() !== "") return ambient.trim();
    return void 0;
  };

  const balanceBase = () => {
    if (config.baseURL !== "") return config.baseURL.replace(/\/+$/, "");
    return (process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com").replace(/\/+$/, "");
```

</details>

**依据 2 · 源码核查**：[lib/index.js:223-318](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L223-L318)

侧栏扫描与外部调用。

<details>
<summary>查看原文（96行）</summary>

```text
function computeUsage(sessionsRoot, prices, schedule, scanWindowMs, externalUsageLog) {
  const now = Date.now();
  const todayKey = localDayKey(now);
  const days = /* @__PURE__ */ new Map();
  const today = emptyDayRec();
  days.set(todayKey, today);
  const accumulate = (rec, model, u, time) => {
    rec.files += 1;
    rec.events += 1;
    rec.tokens.input += u.inputTokens ?? 0;
    rec.tokens.output += u.outputTokens ?? 0;
    rec.tokens.cacheRead += u.cacheReadTokens ?? 0;
    rec.tokens.cacheWrite += u.cacheWriteTokens ?? 0;
    rec.calls += 1;
    const { price: p } = priceFor(model, time, prices, schedule);
    // cacheWrite tokens are billed as ordinary (cache-miss) input.
    const cost = ((u.inputTokens ?? 0) + (u.cacheWriteTokens ?? 0)) / 1e6 * p.input
      + ((u.cacheReadTokens ?? 0) / 1e6) * p.cacheRead
      + ((u.outputTokens ?? 0) / 1e6) * p.output;
    rec.cost += cost;
    let m = rec.byModel.get(model);
    if (m === void 0) {
      m = emptyModelRec();
      rec.byModel.set(model, m);
    }
    m.cost += cost;
    m.calls += 1;
    m.tokens.input += u.inputTokens ?? 0;
    m.tokens.output += u.outputTokens ?? 0;
    m.tokens.cacheRead += u.cacheReadTokens ?? 0;
    m.tokens.cacheWrite += u.cacheWriteTokens ?? 0;
  };
  const dayFor = (time) => {
    const key = localDayKey(time);
    let rec = days.get(key);
    if (rec === void 0) {
      rec = emptyDayRec();
      days.set(key, rec);
    }
    return rec;
  };
  const logs = collectLogs(sessionsRoot);
  for (const { path, mtimeMs } of logs) {
    if (now - mtimeMs > scanWindowMs) continue;
    let data;
    try {
      data = readFileSync(path);
    } catch {
      continue;
    }
    let text;
    try {
      text = decodeSessionLog(data);
    } catch {
      continue;
    }
    let currentModel = "(unknown)";
    for (const line of text.split("\n")) {
      if (line === "") continue;
      let ev;
      try {
        ev = JSON.parse(line);
      } catch {
        continue;
      }
      if (ev.type === "request/header" && ev.data?.header?.config?.model) {
        currentModel = ev.data.header.config.model;
        continue;
      }
      if (ev.type !== "assistant/message" || ev.data?.usage == null) continue;
      const time = typeof ev.time === "number" ? ev.time : now;
      accumulate(dayFor(time), currentModel, ev.data.usage, time);
    }
  }
  // 外部调用用量日志（如 vision-fallback 的视觉模型调用）。
  // "off" 关闭；空字符串走默认路径 <dsh home>/vision-fallback/usage.jsonl。
  if (externalUsageLog !== "off") {
    let externalPath = externalUsageLog;
    try {
      if (externalPath === "") externalPath = join(resolveDshHome(), "vision-fallback", "usage.jsonl");
      const data = readFileSync(externalPath, "utf8");
      for (const line of data.split("\n")) {
        if (line === "") continue;
        let rec;
        try {
          rec = JSON.parse(line);
        } catch {
          continue;
        }
        if (typeof rec?.model !== "string" || rec.model === "") continue;
        const time = typeof rec.ts === "number" ? rec.ts : now;
        accumulate(dayFor(time), rec.model, rec, time);
      }
    } catch {
      /* 日志不存在或不可读时忽略 */
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:618-674](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L618-L674)

投影事件。

<details>
<summary>查看原文（57行）</summary>

```text
const usageDashboardProjectionDefinition = {
  key: "usageDashboard",
  schema: projectionUsageSchema,
  init: () => ({
    current: null,
    openStep: null,
    models: {},
    logs: [],
    truncatedLogs: false
  }),
  apply: (state, event) => {
    switch (event.type) {
      case "request/header": {
        const config = event.data?.header?.config;
        if (typeof config !== "object" || config === null) return state;
        const provider = typeof config.provider === "string" ? config.provider : "unknown";
        const model = typeof config.model === "string" ? config.model : "unknown";
        return { ...state, current: { provider, model } };
      }
      case "request/context": {
        const data = event.data;
        if (typeof data !== "object" || data === null) return state;
        const provider = typeof data.provider === "string" ? data.provider : "unknown";
        const model = typeof data.model === "string" ? data.model : "unknown";
        return { ...state, current: { provider, model } };
      }
      case "step/start": {
        const current = state.current ?? { provider: "unknown", model: "unknown" };
        return {
          ...state,
          openStep: {
            provider: current.provider,
            model: current.model,
            turn: event.data.turn,
            step: event.data.step,
            startTime: event.time,
            firstTokenTime: null
          }
        };
      }
      case "assistant/chunk": {
        const open = state.openStep;
        if (open === null || open.turn !== event.data.turn || open.step !== event.data.step) return state;
        if (open.firstTokenTime !== null || !isTokenDelta(event.data.chunk)) return state;
        return {
          ...state,
          openStep: { ...open, firstTokenTime: event.time }
        };
      }
      case "assistant/message": {
        const open = state.openStep;
        if (open === null || open.turn !== event.data.turn || open.step !== event.data.step) return state;
        const usage = event.data.usage;
        const llmMs = Math.max(0, event.time - open.startTime);
        const ttftMs = open.firstTokenTime === null ? null : Math.max(0, open.firstTokenTime - open.startTime);
        const outputTokens = projectionUsageField(usage, "outputTokens");
        const decodeMs = open.firstTokenTime !== null && outputTokens > 0 ? Math.max(0, event.time - open.firstTokenTime) : null;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:26-35](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L26-L35)

token定义。

<details>
<summary>查看原文（10行）</summary>

```text
function isTokenDelta(chunk) {
  if (!chunk || typeof chunk !== "object") return false;
  switch (chunk.type) {
    case "text-delta":
    case "reasoning-delta":
      return Boolean(chunk.text);
    case "tool-call-delta":
      return Boolean(chunk.argumentsDelta) || chunk.name !== undefined;
    default:
      return false;
```

</details>

**依据 5 · 源码核查**：[package.json:52-74](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/package.json#L52-L74)

旧宿主peer。

<details>
<summary>查看原文（23行）</summary>

```text
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.1",
    "@deepseek-ai/dsh-home-paths": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-credentials": "^0.1.0-rc.6",
    "zod": "^4.4.3"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-client-ui-primitives": "^0.1.0-rc.6",
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-session-projection": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-settings": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-credentials": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-home-paths": "^0.1.0-rc.6",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/1HelloMan1/dsh-usage-dashboard-plus.git"
  },
  "bugs": {
    "url": "https://github.com/1HelloMan1/dsh-usage-dashboard-plus/issues"
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些路径可能静默少算或错价？

**研究主题：**缺陷与关键质疑

#### 完整回答

collectLogs同时收明文session.jsonl，但decodeSessionLog只找zstd magic帧再解压，没有无magic时返回原UTF8分支；普通明文日志因此返回空串。坏压缩帧/读失败/JSON行解析错误都静默跳过，未在API报告覆盖损失；目录用stat递归无visited/深度/总字节限制，链接环或巨型日志可阻塞事件循环，不能把scanWindow当扫描成本硬界限。外部日志无ID去重/与会话对应去重，重复写或双记同调用会多算。

侧栏未知模型套FALLBACK_PRICE且按模型名无provider，不能据有金额认价格已知。投影却未知价null、静态provider+model表，并且projectionCostOf把cacheWrite按output价，侧栏按input价，注释都说cacheWrite按输入计，两个页面可口径冲突；配置prices/schedule只传侧栏，投影不复用。日期localDayKey用系统本地而峰谷用Shanghai，部署跨时区的“今日”与价格时段不是同一时区。所有价仅固定源码口径，未验证当前官方账单价格。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:113-155](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L113-L155)

明文被收但只解zstd。

<details>
<summary>查看原文（43行）</summary>

```text
function zstdFrames(data) {
  const starts = [];
  let idx = data.indexOf(ZSTD_MAGIC);
  while (idx !== -1) {
    starts.push(idx);
    idx = data.indexOf(ZSTD_MAGIC, idx + 1);
  }
  return starts;
}

function decodeSessionLog(data) {
  const starts = zstdFrames(data);
  let text = "";
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1] : data.length;
    try {
      text += zstdDecompressSync(data.subarray(starts[i], end)).toString("utf8");
    } catch {
      // torn/incomplete final frame (live append) — skip
    }
  }
  return text;
}

function collectLogs(root, out = []) {
  let entries;
  try {
    entries = readdirSync(root);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(root, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) collectLogs(full, out);
    else if ((entry === "session.jsonl.zstd" || entry === "session.jsonl") && st.size > 0) out.push({ path: full, mtimeMs: st.mtimeMs });
  }
  return out;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:264-318](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L264-L318)

静默跳过和外部未去重。

<details>
<summary>查看原文（55行）</summary>

```text
  const logs = collectLogs(sessionsRoot);
  for (const { path, mtimeMs } of logs) {
    if (now - mtimeMs > scanWindowMs) continue;
    let data;
    try {
      data = readFileSync(path);
    } catch {
      continue;
    }
    let text;
    try {
      text = decodeSessionLog(data);
    } catch {
      continue;
    }
    let currentModel = "(unknown)";
    for (const line of text.split("\n")) {
      if (line === "") continue;
      let ev;
      try {
        ev = JSON.parse(line);
      } catch {
        continue;
      }
      if (ev.type === "request/header" && ev.data?.header?.config?.model) {
        currentModel = ev.data.header.config.model;
        continue;
      }
      if (ev.type !== "assistant/message" || ev.data?.usage == null) continue;
      const time = typeof ev.time === "number" ? ev.time : now;
      accumulate(dayFor(time), currentModel, ev.data.usage, time);
    }
  }
  // 外部调用用量日志（如 vision-fallback 的视觉模型调用）。
  // "off" 关闭；空字符串走默认路径 <dsh home>/vision-fallback/usage.jsonl。
  if (externalUsageLog !== "off") {
    let externalPath = externalUsageLog;
    try {
      if (externalPath === "") externalPath = join(resolveDshHome(), "vision-fallback", "usage.jsonl");
      const data = readFileSync(externalPath, "utf8");
      for (const line of data.split("\n")) {
        if (line === "") continue;
        let rec;
        try {
          rec = JSON.parse(line);
        } catch {
          continue;
        }
        if (typeof rec?.model !== "string" || rec.model === "") continue;
        const time = typeof rec.ts === "number" ? rec.ts : now;
        accumulate(dayFor(time), rec.model, rec, time);
      }
    } catch {
      /* 日志不存在或不可读时忽略 */
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:197-211](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L197-L211)

未知价fallback。

<details>
<summary>查看原文（15行）</summary>

```text
function priceFor(model, timeMs, prices, schedule) {
  const key = localDayKey(timeMs);
  let entry = null;
  for (const candidate of schedule) {
    if (candidate.from <= key) entry = candidate;
  }
  if (entry !== null) {
    const peak = isPeakHour(timeMs);
    const table = peak ? entry.peak : entry.idle;
    return {
      price: table[model] ?? FALLBACK_PRICE,
      label: `${entry.from} 起 · ${peak ? "高峰" : "空闲"}`
    };
  }
  return { price: prices[model] ?? FALLBACK_PRICE, label: "现行价格" };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:238-241](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L238-L241)

侧栏cacheWrite输入价。

```text
    // cacheWrite tokens are billed as ordinary (cache-miss) input.
    const cost = ((u.inputTokens ?? 0) + (u.cacheWriteTokens ?? 0)) / 1e6 * p.input
      + ((u.cacheReadTokens ?? 0) / 1e6) * p.cacheRead
      + ((u.outputTokens ?? 0) / 1e6) * p.output;
```

**依据 5 · 源码核查**：[lib/index.js:540-554](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L540-L554)

投影cacheWrite输出价。

<details>
<summary>查看原文（15行）</summary>

```text
function projectionPriceOf(provider, model) {
  return PROJECTION_PRICING[`${provider}\u0000${model}`] ?? null;
}

/**
 * 估算一次调用的费用（CNY）。缓存写入按未命中输入价计费；
 * 无计价条目返回 null。
 */
function projectionCostOf(price, usage) {
  if (price === null || typeof usage !== "object" || usage === null) return null;
  const input = typeof usage.inputTokens === "number" && Number.isFinite(usage.inputTokens) && usage.inputTokens > 0 ? usage.inputTokens : 0;
  const output = typeof usage.outputTokens === "number" && Number.isFinite(usage.outputTokens) && usage.outputTokens > 0 ? usage.outputTokens : 0;
  const cacheRead = typeof usage.cacheReadTokens === "number" && Number.isFinite(usage.cacheReadTokens) && usage.cacheReadTokens > 0 ? usage.cacheReadTokens : 0;
  const cacheWrite = typeof usage.cacheWriteTokens === "number" && Number.isFinite(usage.cacheWriteTokens) && usage.cacheWriteTokens > 0 ? usage.cacheWriteTokens : 0;
  return (input * price.inputUncachedCny + cacheRead * price.cacheReadCny + (cacheWrite + output) * price.outputCny) / 1e6;
```

</details>

**依据 6 · 源码核查**：[lib/index.js:409-410](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L409-L410)

配置仅侧栏。

```text
  const prices = { ...DEFAULT_PRICES, ...(config.prices ?? {}) };
  const schedule = [...DEFAULT_PRICE_SCHEDULE, ...(config.priceSchedule ?? [])].sort((a, b) => a.from.localeCompare(b.from));
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 准入、缓存和工程验证有什么边界？

**研究主题：**缺陷与关键质疑、工程质量与复用、效果与总成本

#### 完整回答

exact API仅检查GET/HEAD，没有本地connection.requestRejection/Origin/身份，远程部署必须宿主/反代另闭合；不据此直接断言所有部署匿名可达。余额请求可向配置或环境baseURL发Bearer，可信管理员需核接收者；错误正文取前200字符不是秘密脱敏保证。缓存先返回后才解析key，没有账户/endpoint指纹，TTL内换key可能短暂旧账户余额，多次并发请求也无inFlight合流。

测试isTokenDelta文件复制了一份函数再测试，未导入生产实现，只能证明副本，不足以防生产逻辑漂移；另一marketplace测试不等计量对账。本次只读。首次需旧版宿主匹配、价格/外部日志schema和账户核对；持续本地同步解压/扫描和余额查询，无插件额外LLM调用，浏览器看板/CSV还暴露模型与调用时间；恢复需原日志/账单对照和清缓存重算，静默缺失无法从正常ok识别。节省查账时间和真实费用误差未量化。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:433-470](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L433-L470)

余额cache/端点/错误。

<details>
<summary>查看原文（38行）</summary>

```text
  const fetchBalance = async () => {
    const now = Date.now();
    if (balanceCache.value !== null && now - balanceCache.at < config.balanceCacheMs) return balanceCache.value;
    const key = await resolveApiKey();
    if (key === void 0) {
      const value = { available: false, error: `未配置 API Key（${config.apiKeyRef}）` };
      balanceCache = { at: now, value };
      return value;
    }
    try {
      const res = await fetch(`${balanceBase()}/user/balance`, {
        headers: { authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) {
        let detail = "";
        try {
          detail = (await res.text()).slice(0, 200);
        } catch { /* ignore */ }
        const value = { available: false, error: `balance API ${res.status}: ${detail}` };
        balanceCache = { at: now, value };
        return value;
      }
      const data = await res.json();
      const info = Array.isArray(data?.balance_infos) ? data.balance_infos[0] : void 0;
      const value = {
        available: data?.is_available === true,
        currency: info?.currency ?? "CNY",
        totalBalance: Number(info?.total_balance),
        grantedBalance: Number(info?.granted_balance),
        toppedUpBalance: Number(info?.topped_up_balance),
        fetchedAt: now
      };
      balanceCache = { at: now, value };
      return value;
    } catch (error) {
      const value = { available: false, error: error instanceof Error ? error.message : String(error) };
      balanceCache = { at: now, value };
```

</details>

**依据 2 · 源码核查**：[lib/index.js:483-503](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L483-L503)

route仅方法检查。

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: "/api/dsh-usage",
    handler: async (req, res) => {
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405);
        res.end();
        return;
      }
      let body;
      try {
        const [balance, usage] = await Promise.all([fetchBalance(), Promise.resolve(todayUsage())]);
        body = JSON.stringify({
          ok: true,
          estimated: true,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "local",
          generatedAt: Date.now(),
          balance,
          ...usage,
          externalCalls: readExternalCalls(config.externalUsageLog ?? ""),
          prices: { ...prices, ...schedule.length > 0 ? { _schedule: schedule } : {} }
```

</details>

**依据 3 · 源码核查**：[test/isTokenDelta.test.mjs:4-27](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/test/isTokenDelta.test.mjs#L4-L27)

函数副本测试。

<details>
<summary>查看原文（24行）</summary>

```text
function isTokenDelta(chunk) {
  if (!chunk || typeof chunk !== "object") return false;
  switch (chunk.type) {
    case "text-delta":
    case "reasoning-delta":
      return Boolean(chunk.text);
    case "tool-call-delta":
      return Boolean(chunk.argumentsDelta) || chunk.name !== undefined;
    default:
      return false;
  }
}

test("isTokenDelta correctly detects delta tokens", () => {
  assert.equal(isTokenDelta({ type: "text-delta", text: "hello" }), true);
  assert.equal(isTokenDelta({ type: "text-delta", text: "" }), false);
  assert.equal(isTokenDelta({ type: "reasoning-delta", text: "thinking" }), true);
  assert.equal(isTokenDelta({ type: "reasoning-delta", text: "" }), false);
  assert.equal(isTokenDelta({ type: "tool-call-delta", argumentsDelta: '{"a":1}' }), true);
  assert.equal(isTokenDelta({ type: "tool-call-delta", name: "tool" }), true);
  assert.equal(isTokenDelta({ type: "tool-call-delta", argumentsDelta: "" }), false);
  assert.equal(isTokenDelta({ type: "other" }), false);
  assert.equal(isTokenDelta(null), false);
});
```

</details>

#### 缺口

- 部署宿主对exact API的准入、真实日志格式覆盖与上游账单口径
  **影响：**接口可读范围和估算完整性不能由GET或固定价推断
  **进一步探讨：**核宿主分派，明文/压缩/外部重复样例与原账单逐项对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用结论和继续探讨方向是什么？

**研究主题：**新假设与验证、采用判断

#### 完整回答

先观察，明文日志静默丢失、未知模型默认价与cacheWrite两套口径影响核心数字可信度。可信单用户、已核日志格式/价格且只作趋势参考可对照，不用于预算扣款/财务结算；先限定余额端点、禁未对账外部日志并明确估算与余额不同主体。出现侧栏/会话看板金额不一致、普通jsonl无数或切key旧余额时回原材料，不把0解释成无调用。

继续可研究统一带provider/模型/时区/价格版本的计量内核，未知价null、覆盖/坏行/去重回执，明文和压缩显式格式分支；流式有预算扫描与账户指纹cache/inFlight。基线为当前两条独立算式/静默跳过，反例包括同token不同cacheWrite价、未知模型、明文日志、坏zstd帧、双记录外部调用、跨时区午夜和TTL换账号。比较漏计/重复、金额差、扫描峰值及恢复工时，方向尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:123-134](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L123-L134)

格式基线。

<details>
<summary>查看原文（12行）</summary>

```text
function decodeSessionLog(data) {
  const starts = zstdFrames(data);
  let text = "";
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1] : data.length;
    try {
      text += zstdDecompressSync(data.subarray(starts[i], end)).toString("utf8");
    } catch {
      // torn/incomplete final frame (live append) — skip
    }
  }
  return text;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:238-241](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L238-L241)

侧栏算式。

```text
    // cacheWrite tokens are billed as ordinary (cache-miss) input.
    const cost = ((u.inputTokens ?? 0) + (u.cacheWriteTokens ?? 0)) / 1e6 * p.input
      + ((u.cacheReadTokens ?? 0) / 1e6) * p.cacheRead
      + ((u.outputTokens ?? 0) / 1e6) * p.output;
```

**依据 3 · 源码核查**：[lib/index.js:548-554](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L548-L554)

投影算式。

```text
function projectionCostOf(price, usage) {
  if (price === null || typeof usage !== "object" || usage === null) return null;
  const input = typeof usage.inputTokens === "number" && Number.isFinite(usage.inputTokens) && usage.inputTokens > 0 ? usage.inputTokens : 0;
  const output = typeof usage.outputTokens === "number" && Number.isFinite(usage.outputTokens) && usage.outputTokens > 0 ? usage.outputTokens : 0;
  const cacheRead = typeof usage.cacheReadTokens === "number" && Number.isFinite(usage.cacheReadTokens) && usage.cacheReadTokens > 0 ? usage.cacheReadTokens : 0;
  const cacheWrite = typeof usage.cacheWriteTokens === "number" && Number.isFinite(usage.cacheWriteTokens) && usage.cacheWriteTokens > 0 ? usage.cacheWriteTokens : 0;
  return (input * price.inputUncachedCny + cacheRead * price.cacheReadCny + (cacheWrite + output) * price.outputCny) / 1e6;
```

**依据 4 · 源码核查**：[lib/index.js:433-467](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js#L433-L467)

账户cache。

<details>
<summary>查看原文（35行）</summary>

```text
  const fetchBalance = async () => {
    const now = Date.now();
    if (balanceCache.value !== null && now - balanceCache.at < config.balanceCacheMs) return balanceCache.value;
    const key = await resolveApiKey();
    if (key === void 0) {
      const value = { available: false, error: `未配置 API Key（${config.apiKeyRef}）` };
      balanceCache = { at: now, value };
      return value;
    }
    try {
      const res = await fetch(`${balanceBase()}/user/balance`, {
        headers: { authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) {
        let detail = "";
        try {
          detail = (await res.text()).slice(0, 200);
        } catch { /* ignore */ }
        const value = { available: false, error: `balance API ${res.status}: ${detail}` };
        balanceCache = { at: now, value };
        return value;
      }
      const data = await res.json();
      const info = Array.isArray(data?.balance_infos) ? data.balance_infos[0] : void 0;
      const value = {
        available: data?.is_available === true,
        currency: info?.currency ?? "CNY",
        totalBalance: Number(info?.total_balance),
        grantedBalance: Number(info?.granted_balance),
        toppedUpBalance: Number(info?.topped_up_balance),
        fetchedAt: now
      };
      balanceCache = { at: now, value };
      return value;
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
