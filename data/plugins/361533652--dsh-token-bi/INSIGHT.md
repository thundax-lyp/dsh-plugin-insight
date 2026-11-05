# dsh-token-bi

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b0b06ca](https://github.com/361533652/dsh-token-bi/tree/b0b06ca969e7a74a68278839c4506ee6be56e785)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：聚合 DSH 会话的 Token 用量，并按模型、日期和会话显示报告。

> **亮点**：[Q01](#research-q01) 将同一步样本替换、摘要用量和会话汇总集中展示。

> **主要限制**：[Q02](#research-q02) 固定偏移与实际读取权限要单独验证。

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
  - [Q01 · 总量如何产生？](#detail-section-11)
  - [Q02 · 日期及读取边界如何判断？](#detail-section-12)
  - [Q03 · 如何控制试用和退出成本？](#detail-section-13)
  - [Q04 · 怎样减少用量误判？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要核对 DSH 多会话用量与日期归属的开发者。

逐会话读原生用量或手工汇总日志。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 用量聚合 | 集中比较会话用量 | 依赖已报告的事件 |
| 报告缓存 | 较快显示快照 | 需核对时间与覆盖 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 和 Node | 必需 | 读取会话事件 | 保留人工查账 |
| 隔离会话 | 试用需要 | 核对数据权限 | 不使用真实资料 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户建立虚拟会话 | 保留原始用量 |
| 对照 | 操作者核对重复尝试及日期 | 解释差异 |
| 退出 | 移除临时链接和配置 | 按需检查缓存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主资源未知 | 准备 profile | 未实测 |
| 持续 | 扫描与存储资源未知 | 复核缓存和日期 | 需对照 |
| 恢复 | 重新扫描未知 | 检查快照和链接 | 耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 聚合 | 按事件替换汇总 | 实际账单 |
| 时间 | 按请求偏移投影 | 夏令时边界 |

> **思考**：[Q02](#research-q02) 固定偏移与实际读取权限要单独验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将同一步样本替换、摘要用量和会话汇总集中展示。

[Q01](#research-q01) 总量、按模型与按日同步扣除旧样本。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 固定偏移与实际读取权限要单独验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用虚拟数据验收。[Q02](#research-q02) 核对读权限再使用真实会话。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核对，未运行宿主与真实计量。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/collector.mjs、lib/usage.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定代表实现，未执行目标。
- 下一步：对照重复样本、日期、缓存、隔离与退出。

**分析版本**

- **仓库**：[361533652/dsh-token-bi](https://github.com/361533652/dsh-token-bi)
- **版本号**：0.1.0（[固定提交 b0b06ca](https://github.com/361533652/dsh-token-bi/tree/b0b06ca969e7a74a68278839c4506ee6be56e785)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 标明投影口径和偏移，检查日期误判。

对照重复样本、日期、缓存、隔离与退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 3045 | 2493 | 427 | — |
| .mjs | source | 4 | 1620 | 1246 | 264 | — |
| .md | source | 2 | 662 | — | — | 7042 |
| .mjs | test | 13 | 2036 | 1573 | 297 | — |
| .cjs | test | 1 | 72 | 48 | 15 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/361533652/dsh-token-bi/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用量折叠、时区和宿主读取各有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 总量如何产生？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

希望比较多个 DSH 会话用量的开发者，可以用聚合报告代替逐个打开日志。折叠从 assistant/message、assistant/attempt 提取 provider 用量，以 turn 和 step 定位样本；后到样本先扣除上一笔，再计入当前供应商、模型和日期。压缩摘要有独立用量分支。这样得到的是事件投影，而不是每个网络尝试的供应商账单；旧尝试已扣款但没有保留在最终样本时，汇总会低于账单口径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-37](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/README.md#L28-L37)

作者明确聚合任务

<details>
<summary>查看原文（10行）</summary>

```text
## 它解决什么问题

用 DSH 一段时间后，几个问题会冒出来：

- 这个月一共花了多少 token？散在 20 多个会话里，没有一个地方能看总量。
- 哪天突然变多了？是哪次任务把用量拉高的？
- 缓存命中率怎么样？—— 这一项容易被忽略但影响最大：`cacheRead` 通常是总量的绝大部分，因为每轮都要把整个上下文重新读一遍。
- 让子代理并行干活时，父会话和子会话各占多少？

这个插件把会话日志里 provider 上报的用量折叠成上述维度。
```

</details>

**依据 2 · 源码核查**：[lib/usage.mjs:223-249](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/lib/usage.mjs#L223-L249)

样本替换与日期归属

<details>
<summary>查看原文（27行）</summary>

```text
      case 'assistant/message':
      case 'assistant/attempt': {
        const usage = usageOf(event);
        if (usage === undefined) break;
        const turn = event.data?.turn;
        const step = event.data?.step;
        if (typeof turn !== 'number' || typeof step !== 'number') break;
        const buckets = bucketsOf(usage);
        const key = `${turn}:${step}`;
        const previous = slots.get(key);
        const route = routeOf(event);
        const provider = route?.provider ?? previous?.provider ?? 'unknown';
        const model = route?.model ?? previous?.model ?? 'unknown';
        const routeKey = `${provider}\u0000${model}`;
        const stamp = time ?? previous?.time ?? firstTime ?? 0;
        const day = localDay(stamp, offset);

        if (previous !== undefined) {
          subtract(totals, previous.buckets);
          subtract(bucketFor(previous.routeKey), previous.buckets);
          const previousDay = days.get(previous.day);
          if (previousDay !== undefined) subtract(previousDay, previous.buckets);
          const row = rows[previous.index];
          row.input -= previous.buckets.input;
          row.output -= previous.buckets.output;
          row.cacheRead -= previous.buckets.cacheRead;
          row.cacheWrite -= previous.buckets.cacheWrite;
```

</details>

**依据 3 · 源码核查**：[lib/usage.mjs:292-307](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/lib/usage.mjs#L292-L307)

摘要用量单列

<details>
<summary>查看原文（16行）</summary>

```text
      case 'compaction/summary': {
        // Compacting a long context is its own model call, and its usage does not
        // appear on any assistant message (verified against the store: no
        // assistant event carries the same numbers). Without this the tokens
        // spent summarising are invisible.
        const usage = event.data?.usage;
        if (usage === undefined || typeof usage !== 'object') break;
        const buckets = bucketsOf(usage);
        const stamp = time ?? firstTime ?? 0;
        const day = localDay(stamp, offset);
        const provider = typeof event.data?.provider === 'string' && event.data.provider.length > 0
          ? event.data.provider
          : 'unknown';
        const model = typeof event.data?.model === 'string' && event.data.model.length > 0
          ? event.data.model
          : 'unknown';
```

</details>

**依据 4 · 源码核查**：[lib/collector.mjs:470-489](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/lib/collector.mjs#L470-L489)

报告按会话和日期投影

<details>
<summary>查看原文（20行）</summary>

```text
      sessions.push({
        ...rest,
        totals: recordTotals,
        turns: recordTurns.size,
        models: [...recordModels.values()].sort((left, right) => right.total - left.total),
        firstTime: firstRowTime,
        lastTime: lastRowTime,
        days: [...recordDays].sort(),
        /**
         * Per-day totals for this session.
         *
         * Selecting a day narrows the session list to sessions active that day,
         * but each row's headline number was still the session's all-time total,
         * so the table disagreed with the model card above it. This lets the row
         * show the amount for the selected day instead.
         */
        dayTotals: Object.fromEntries(
          [...recordDayTotals.entries()].map(([day, buckets]) => [
            day,
            { ...buckets, total: buckets.input + buckets.output + buckets.cacheRead + buckets.cacheWrite },
```

</details>

#### 缺口

- 未对照宿主投影、原始事件和供应商结算
  **影响**：不能确认真实误差或覆盖
  **进一步探讨**：用同一步多次尝试、压缩和未报告用量对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 日期及读取边界如何判断？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

路由接收一个偏移值并应用到整个查询，不能为每个历史日期还原夏令时的偏移变化。持久快照可能先回旧值，随后安排刷新；per-session 缓存另检查覆盖。报告和详情由同源前缀路由返回，所读 handler 以路径分派并接受会话 ID，未见独立方法或用户授权校验。报告的会话记录含标题与工作目录等元数据，实际可读范围须以宿主和代理核对。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:222-248](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/index.js#L222-L248)

缓存与刷新条件

<details>
<summary>查看原文（27行）</summary>

```text
    const storeRoot = resolveStoreRoot(ctx);
    if (storeRoot !== undefined) {
      try {
        // One read, not two: `allowStale` accepts the entry regardless of the
        // fingerprint, and the returned `stale` flag says which it was.
        const hit = loadReportCache(storeRoot, { offsetMinutes, rangeDays }, storeFingerprint(storeRoot), true);
        if (hit !== undefined) {
          scheduleWarm(startBuild);
          return { ...hit.report, fromCache: true, cacheSavedAt: hit.savedAt, stale: hit.stale === true };
        }
      } catch {
        // Fall through to the per-session path below.
      }
    }

    // Otherwise assemble from the per-session records, but only when the cache
    // covers every session — serving an incomplete set would read as wrong
    // numbers rather than old ones.
    if (await cacheIsComplete(offsetMinutes, rangeDays)) {
      const stale = reportFromCache(offsetMinutes, rangeDays);
      if (stale !== undefined) {
        scheduleWarm(startBuild);
        return stale;
      }
    }

    return startBuild();
```

</details>

**依据 2 · 源码核查**：[index.js:330-352](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/index.js#L330-L352)

报告和详情分派

<details>
<summary>查看原文（23行）</summary>

```text
  /** Answer one request for this instance. */
  const serve = async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const path = url.pathname.replace(/\/+$/, '');
    const offsetMinutes = parseOffset(url.searchParams.get('offset'));
    const rangeDays = parseRange(url.searchParams.get('days'));
    try {
      if (path === `${ROUTE}/report`) {
        sendJson(res, 200, await readReport(offsetMinutes, rangeDays, url.searchParams.get('refresh') === '1'));
        return;
      }
      if (path === `${ROUTE}/days`) {
        sendJson(res, 200, await readDaily(offsetMinutes));
        return;
      }
      if (path === `${ROUTE}/session`) {
        const id = url.searchParams.get('id');
        if (typeof id !== 'string' || id.length === 0) {
          sendJson(res, 400, { error: 'a session id is required' });
          return;
        }
        sendJson(res, 200, await collector.sessionDetail(id, offsetMinutes));
        return;
```

</details>

**依据 3 · 源码核查**：[index.js:417-430](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/index.js#L417-L430)

单查询偏移和天数

<details>
<summary>查看原文（14行）</summary>

```text
function parseOffset(raw) {
  const fallback = -new Date().getTimezoneOffset();
  if (raw === null) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(-840, Math.min(840, Math.trunc(value)));
}

/** Window in whole days; `0` and anything unparseable mean "everything". */
function parseRange(raw) {
  if (raw === null || raw === 'all') return 0;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.min(3650, Math.trunc(value));
```

</details>

**依据 4 · 源码核查**：[lib/usage.mjs:74-96](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/lib/usage.mjs#L74-L96)

以统一偏移换算日期

<details>
<summary>查看原文（23行）</summary>

```text
export function localDay(time, timeZoneOffsetMinutes = -new Date(time).getTimezoneOffset()) {
  const shifted = time + timeZoneOffsetMinutes * 60_000;
  return new Date(shifted).toISOString().slice(0, 10);
}

/**
 * Fold one log into usage rows plus session-level counters.
 *
 * @param events decoded session events in seq order.
 * @param options.offsetMinutes viewer's UTC offset in minutes (defaults to the host zone).
 * @returns {{
 *   rows: Array<object>, totals: object, models: object, days: object,
 *   turns: number, steps: number, firstTime: number|undefined, lastTime: number|undefined,
 *   llmMs: number, toolMs: number,
 * }}
 */
export function foldUsage(events, options = {}) {
  const offset = options.offsetMinutes ?? -new Date().getTimezoneOffset();
  const rows = [];
  const slots = new Map();
  const totals = zero();
  const models = new Map();
  const days = new Map();
```

</details>

**依据 5 · 源码核查**：[lib/collector.mjs:64-76](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/lib/collector.mjs#L64-L76)

标题、路径与会话字段

<details>
<summary>查看原文（13行）</summary>

```text
export function summarizeSession(header, events, offsetMinutes, live) {
  const folded = foldUsage(events, { offsetMinutes });
  const prompt = firstPrompt(events);
  return {
    id: header.id,
    title: foldTitle(events) ?? fallbackTitle(prompt, header.id),
    prompt,
    createdAt: header.createdAt,
    cwd: header.cwd,
    parentSession: header.parentSession,
    delegationDepth: header.delegationDepth,
    agentPreset: header.agentPreset,
    live,
```

</details>

#### 缺口

- 未验证宿主网络授权、缓存时效与夏令时场景
  **影响**：无法确定实际数据暴露与历史日期准确性
  **进一步探讨**：用虚拟会话、错权限和跨偏移样本验证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何控制试用和退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者要求可用 Web 宿主与具 zstd 的 Node，当前说明以本地链接安装并完整重启。试用宜独立 profile 和无敏感会话，先对照四桶用量与日期。浏览器本地快照和服务端缓存可留存统计；停用后单独检查存储和链接。运行负担来自历史折叠、存储及界面刷新，未测真实大仓扫描。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-65](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/README.md#L41-L65)

作者说明依赖和安装

<details>
<summary>查看原文（25行）</summary>

````text
## 安装

### 前置条件

- DSH Desktop 或 `dsh` CLI（Web 界面）
- Node.js ≥ 22.15（会话日志是 zstd 压缩的，需要 `zlib` 的 zstd 支持）

### 从本地目录安装（当前可用方式）

```bash
git clone https://github.com/361533652/dsh-token-bi.git
dsh plugin --profile desktop add "link:/绝对路径/dsh-token-bi"
```

Windows 路径示例：

```powershell
dsh plugin --profile desktop add "link:E:\gitbub-project\dsh-token-bi"
```

`link:` 表示软链安装，改动仓库里的代码无需重装。安装完成后**完全退出并重启 DSH Desktop**（不是刷新页面）——客户端 bundle 的路径表在进程启动时构建一次。

### 验证

重启后左侧栏面板列表里会出现「Token 账单」，位置紧挨着「插件」。
````

</details>

**依据 2 · 作者声明**：[README.md:165-188](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/README.md#L165-L188)

缓存保留和刷新说明

<details>
<summary>查看原文（24行）</summary>

```text
### 缓存

- 单会话结果按 `(会话 id, revision)` 缓存，revision 是活跃会话的 seq 或持久会话的元数据；没变就复用。
- 整个报告缓存 10 秒，`refresh=1` 强制重建。
- 缓存键包含时间窗口，切换档位不会串数据。

### 什么时候刷新

页面里没有定时器，所有重建都由用户动作触发：

- **打开账单**：Host 只在面板被打开时挂载页面、切走即卸载，所以「挂载」就等于「刚打开」——此时带 `refresh=1`，第一个看到的数字就是打开那一刻的数字，不吃那 10 秒缓存。
- **切换 7 天 / 30 天 / 全部**：同样强制重建，刚点的那一档不会显示点击之前的快照。
- **切回窗口**（`visibilitychange` / `focus`）：离开再回来时重建一次；窗口在后台时不发请求。
- 想手动同步，点顶部的「刷新」。

面板开着但没人动，数字就静止不动——后台不占任何开销。

### 打开时先显示上次的数字

重建要一个来回，但用户不该看见空页。所以每次成功汇总后，报告会按时间窗口各存一份到浏览器 `localStorage`（`dsh-token-bi:report:v1:<天数>`）。重新打开面板时先画这份快照，刷新在背后跑：

- 页脚会写**「上次汇总于 HH:MM · 正在汇总…」**，而不是谎称这份数字是刚算的；刷新回来后变回「汇总于」。
- 快照超过 6 小时直接不用——一个隔夜的数字比一屏空白更容易误导人。
- 它只是用来画第一帧的缓存，不是数据源：服务端返回什么就整个替换，损坏或配额写满都只是退回冷启动，不影响功能。
```

</details>

**依据 3 · 源码核查**：[index.js:360-380](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/index.js#L360-L380)

路由效果和释放

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.effect(() => {
    const holder = (globalThis[ROUTE_SLOT] ??= { current: undefined, dispose: undefined });
    // A superseded instance keeps serving until the newer one takes over, so a
    // reload never leaves the route pointing at a disposed collector.
    holder.current = serve;
    if (holder.dispose === undefined) {
      holder.dispose = ctx.webServer.register({
        kind: 'prefix',
        path: ROUTE,
        handler: (req, res) => holder.current(req, res),
      });
    }

    return () => {
      if (holder.current === serve) holder.current = undefined;
      // Only the instance that owns the process route releases it; a reloaded
      // instance still holding the slot keeps the route alive.
      if (holder.current === undefined && holder.dispose !== undefined) {
        holder.dispose();
        holder.dispose = undefined;
        delete globalThis[ROUTE_SLOT];
```

</details>

#### 缺口

- 未安装、卸载或测试大历史
  **影响**：不能量化本机资源和残留
  **进一步探讨**：用临时 profile 核对启动、报告与退出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少用量误判？

**研究主题**：新假设与验证

#### 完整回答

可在已有旧快照标记旁显示这份报告使用的固定偏移和替换后样本口径，让用户判断跨时区日期变化是否源于统计方式。对照现有标记和增强提示，提供换日和换时区的虚拟数据，记录正确解释率及操作时间。若误判未下降，撤回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:182-188](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/README.md#L182-L188)

已有旧值提示

```text
### 打开时先显示上次的数字

重建要一个来回，但用户不该看见空页。所以每次成功汇总后，报告会按时间窗口各存一份到浏览器 `localStorage`（`dsh-token-bi:report:v1:<天数>`）。重新打开面板时先画这份快照，刷新在背后跑：

- 页脚会写**「上次汇总于 HH:MM · 正在汇总…」**，而不是谎称这份数字是刚算的；刷新回来后变回「汇总于」。
- 快照超过 6 小时直接不用——一个隔夜的数字比一屏空白更容易误导人。
- 它只是用来画第一帧的缓存，不是数据源：服务端返回什么就整个替换，损坏或配额写满都只是退回冷启动，不影响功能。
```

**依据 2 · 源码核查**：[index.js:417-422](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/index.js#L417-L422)

偏移计算

```text
function parseOffset(raw) {
  const fallback = -new Date().getTimezoneOffset();
  if (raw === null) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(-840, Math.min(840, Math.trunc(value)));
```

**依据 3 · 源码核查**：[lib/usage.mjs:223-244](https://github.com/361533652/dsh-token-bi/blob/b0b06ca969e7a74a68278839c4506ee6be56e785/lib/usage.mjs#L223-L244)

样本口径

<details>
<summary>查看原文（22行）</summary>

```text
      case 'assistant/message':
      case 'assistant/attempt': {
        const usage = usageOf(event);
        if (usage === undefined) break;
        const turn = event.data?.turn;
        const step = event.data?.step;
        if (typeof turn !== 'number' || typeof step !== 'number') break;
        const buckets = bucketsOf(usage);
        const key = `${turn}:${step}`;
        const previous = slots.get(key);
        const route = routeOf(event);
        const provider = route?.provider ?? previous?.provider ?? 'unknown';
        const model = route?.model ?? previous?.model ?? 'unknown';
        const routeKey = `${provider}\u0000${model}`;
        const stamp = time ?? previous?.time ?? firstTime ?? 0;
        const day = localDay(stamp, offset);

        if (previous !== undefined) {
          subtract(totals, previous.buckets);
          subtract(bucketFor(previous.routeKey), previous.buckets);
          const previousDay = days.get(previous.day);
          if (previousDay !== undefined) subtract(previousDay, previous.buckets);
```

</details>

#### 缺口

- 未验证用户对日期和 token 的理解
  **影响**：不能确定提示增量
  **进一步探讨**：先用固定样本做对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
