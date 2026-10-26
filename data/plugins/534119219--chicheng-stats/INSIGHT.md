# chicheng-stats

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[53ee7d9](https://github.com/534119219/chicheng-stats/tree/53ee7d9bc356b16f7f461caeb89b85bd79c9a608)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-stats)
<!-- END META -->

> **实现功能**：DSH Web 全局用量统计、历史会话回填和可配置侧栏面板，附 DeepSeek 平台余额提示。

> **核心亮点**：把实时/历史用量与 Web 面板结合，详见[Q01](#research-q01)。

> **风险与缺陷**：桌面 zstd 历史默认跳过、水位淘汰可重计，自动导入平台 token 经同源 API 返回给浏览器；详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 全局用量是如何累计并回填的？](#detail-section-11)
  - [Q02 · 统计完整性与桌面端边界在哪里？](#detail-section-12)
  - [Q03 · 平台 token 导入及 API 安全边界是什么？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复分别消耗什么，如何判断成本效果？](#detail-section-14)
  - [Q05 · 怎样证伪复合身份与持久去重能改善统计完整性的假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：跨 Web/headless 会话查看 token 请求趋势、模型/提供方分布。

手工查会话日志或厂商用量页。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 实现 | 边界 |
| --- | --- | --- |
| 用量聚合 | 事件+历史扫描 | 非官方账单 |
| 平台悬停 | 余额/Token API | token 权限 |
| 历史回填 | zstd/JSONL | 桌面默认跳过 zstd |

**流程与依赖**

DSH session/event、webServer/webRuntime/credentials、Node zstd、leveldown；浏览器 Profile 可选。

启动回填→实时采集/周期扫描→UI/API 查看；可选平台数据悬停。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/leveldown原生依赖、首次历史读取解压与统计磁盘；价格未知 | 安装Web profile、核统计目录/日志格式与凭证授权，工时未知 | Electron默认跳过zstd；安装和覆盖率需按环境检查 |
| 持续使用 | 实时折叠、每5分钟扫描变化日志、聚合及最多3万明细持久化；可选平台API访问 | 检口径与统计新鲜度，工时未知 | 水位上限5000；净CPU/IO与平台API配额费用未知 |
| 失败恢复 | 重扫/重建、备份恢复及可能的凭证轮换资源，金额未知 | 核漏计重计、同名目录与桌面历史缺口；核临时副本/凭证访问，工时未知 | 不能据当前聚合自行推回完整明细；停用/重启不自动证明对账恢复 |

可视化本地用量趋势，不代表官方准确账单。

> **思考**：桌面 zstd 历史默认跳过、水位淘汰可重计，自动导入平台 token 经同源 API 返回给浏览器；详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把实时/历史用量与 Web 面板结合，详见[Q01](#research-q01)。

把实时/历史用量与 Web 面板结合，详见[Q01](#research-q01)。

seq 水位、(turn,step) last-wins、zstd 多帧解码、定时扫描和 JSON 持久化。

<a id="detail-section-5"></a>

### 1.4 主要限制

桌面 zstd 历史默认跳过、水位淘汰可重计，自动导入平台 token 经同源 API 返回给浏览器；详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先禁用平台 token 导入，仅测本地统计并对账；再评估同源 API 和浏览器凭据边界；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持事件统计与浏览器 token 导入；全量准确度和门禁实效未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js、test-backfill.mjs、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交；未运行真实会话/浏览器或导入 token。
- 下一步：对账、同名目录/5000 会话、桌面回填、路由授权与 token 导入测试。

**分析版本**

- **仓库**：[534119219/chicheng-stats](https://github.com/534119219/chicheng-stats)
- **版本号**：0.10.4（[固定提交 53ee7d9](https://github.com/534119219/chicheng-stats/tree/53ee7d9bc356b16f7f461caeb89b85bd79c9a608)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以稳定会话复合键和持久去重索引提升准确度，并将 token 导入限定到明确授权流程且不向浏览器返回原值；待验证，详见[Q02](#research-q02)、[Q03](#research-q03)。

对账、同名目录/5000 会话、桌面回填、路由授权与 token 导入测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 3853 | 3392 | 265 | — |
| .md | source | 1 | 194 | — | — | 1722 |
| .mjs | source | 1 | 60 | 50 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-stats/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-stats/issues?q=is%3Aissue+created%3A2026-09-22T07%3A38%3A25.109Z..2026-10-22T07%3A38%3A25.109Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-stats/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A38%3A25.109Z..2026-10-22T07%3A38%3A25.109Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实本地事件统计的覆盖率与平台 token 自动导入边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 全局用量是如何累计并回填的？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

Host 端监听 session/event 并按 session 的 seq 水位去重，按 turn/step 对相邻重复 usage 样本 last-wins；记录日聚合、请求明细、模型/提供方和时延。启动后扫描 $DSH_HOME/sessions 的 JSONL/zstd 日志并每 5 分钟按 mtime:size 轻扫，写入 stats 下 store/requests/settings。浏览器侧栏组件与统计弹窗经 /stats/api 读数据。此为本地事件统计，不等于厂商账单；README 中“所有会话”取决于日志可读、格式兼容和水位未丢。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:138-269](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L138-L269)

事件 fold/水位/请求样本。

<details>
<summary>查看原文（132行）</summary>

```text
/**
 * The counting engine. Events must be fed in ascending seq order per session
 * (live events arrive in order; scans replay logs in order); the fold is
 * synchronous, so live and scan ingestion share one instance without races.
 */
function createFold(initial = {}) {
  const days = new Map(Object.entries(initial.days ?? {}));
  const watermarks = new Map(Object.entries(initial.watermarks ?? {}));
  // In-memory only: a replace (same turn/step re-report) is always adjacent
  // in seq order, and the watermark makes replay impossible after restart.
  const lastUsage = new Map();
  // Provider model in force per session (from request/header snapshots).
  const sessionModels = new Map();
  // Provider in force per session (from request/header snapshots).
  const sessionProviders = new Map();
  // Per-request detail records (bounded ring; persisted to a separate file).
  const records = [];
  // Per-step timing: step/start → first content chunk (TTFT) and → usage
  // sample (total duration). Keyed `${sessionId}|${turn}|${step}`; entries are
  // removed on step/end so the maps stay bounded by in-flight steps.
  const stepStarts = new Map();
  const stepFirstChunks = new Map();

  /** @returns true when the event contributed a usage sample. */
  function ingest(sessionId, event) {
    // Track the model and provider each request was built under.
    if (event?.type === "request/header") {
      const model = modelOfEvent(event);
      if (model !== null) sessionModels.set(sessionId, model);
      const provider = providerOfEvent(event);
      if (provider !== null) sessionProviders.set(sessionId, provider);
    }
    const turn = event?.data?.turn;
    const step = event?.data?.step;
    const ts = Number.isFinite(event?.time) ? event.time : Date.now();
    if (turn !== undefined && step !== undefined) {
      const stepKey = `${sessionId}|${turn}|${step}`;
      if (event?.type === "step/start") {
        stepStarts.set(stepKey, ts);
        stepFirstChunks.delete(stepKey);
      } else if (event?.type === "step/end") {
        stepStarts.delete(stepKey);
        stepFirstChunks.delete(stepKey);
      } else if (event?.type === "assistant/chunk" && !stepFirstChunks.has(stepKey)) {
        const chunk = event?.data?.chunk;
        if (chunk !== null && typeof chunk === "object" && CONTENT_CHUNK_TYPES.has(chunk.type)) {
          stepFirstChunks.set(stepKey, ts);
        }
      }
    }
    const usage = usageOfEvent(event);
    if (usage === undefined) return false;
    const seq = event?.seq;
    if (Number.isFinite(seq)) {
      const seen = watermarks.get(sessionId) ?? -1;
      if (seq <= seen) return false;
      watermarks.set(sessionId, seq);
      if (watermarks.size > 5000) {
        // prune oldest-inserted watermarks; lost entries only risk re-counting
        // after a restart, and their sessions are re-scanned from scratch
        const firstKey = watermarks.keys().next().value;
        if (firstKey !== undefined) watermarks.delete(firstKey);
      }
    }
    const day = dayKey(ts);
    const tokens = usageTokens(usage);
    const input = usage.inputTokens ?? 0;
    const cacheRead = usage.cacheReadTokens ?? 0;
    const cacheWrite = usage.cacheWriteTokens ?? 0;
    const output = usage.outputTokens ?? 0;
    const model = sessionModels.get(sessionId) ?? "unknown";
    const provider = sessionProviders.get(sessionId) ?? "unknown";
    const stepKey = turn !== undefined && step !== undefined ? `${sessionId}|${turn}|${step}` : null;
    const start = stepKey !== null ? stepStarts.get(stepKey) : undefined;
    const firstChunk = stepKey !== null ? stepFirstChunks.get(stepKey) : undefined;
    const ttft = start !== undefined && firstChunk !== undefined ? firstChunk - start : null;
    const duration = start !== undefined ? ts - start : null;
    let bucket = days.get(day);
    if (bucket === undefined) {
      bucket = { requests: 0, tokens: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
      days.set(day, bucket);
    }
    const last = lastUsage.get(sessionId);
    if (last !== undefined && last.turn === turn && last.step === step) {
      // same request re-reported (usage chunk → final message): replace
      const previousDay = days.get(last.day);
      if (previousDay !== undefined) {
        previousDay.tokens = Math.max(0, previousDay.tokens - last.tokens);
        previousDay.input = Math.max(0, (previousDay.input ?? 0) - last.input);
        previousDay.output = Math.max(0, (previousDay.output ?? 0) - last.output);
        previousDay.cacheRead = Math.max(0, (previousDay.cacheRead ?? 0) - last.cacheRead);
        previousDay.cacheWrite = Math.max(0, (previousDay.cacheWrite ?? 0) - last.cacheWrite);
      }
      bucket.tokens += tokens;
      bucket.input = (bucket.input ?? 0) + input;
      bucket.output = (bucket.output ?? 0) + output;
      bucket.cacheRead = (bucket.cacheRead ?? 0) + cacheRead;
      bucket.cacheWrite = (bucket.cacheWrite ?? 0) + cacheWrite;
      const record = records[last.recordIndex];
      if (record !== undefined) {
        record.t = ts;
        record.model = model;
        record.provider = provider;
        record.input = input;
        record.cacheRead = cacheRead;
        record.cacheWrite = cacheWrite;
        record.output = output;
        record.ttft = ttft;
        record.duration = duration;
      }
    } else {
      bucket.requests += 1;
      bucket.tokens += tokens;
      bucket.input = (bucket.input ?? 0) + input;
      bucket.output = (bucket.output ?? 0) + output;
      bucket.cacheRead = (bucket.cacheRead ?? 0) + cacheRead;
      bucket.cacheWrite = (bucket.cacheWrite ?? 0) + cacheWrite;
      records.push({ t: ts, model, provider, session: sessionId, turn, step, input, cacheRead, cacheWrite, output, ttft, duration });
      while (records.length > MAX_RECORDS) records.shift();
    }
    lastUsage.set(sessionId, { turn, step, day, tokens, input, output, cacheRead, cacheWrite, recordIndex: records.length - 1 });
    return true;
  }

  /** Legacy day buckets lack the split fields; backfill them from records. */
  function ensureSplits(day, bucket) {
    if (typeof bucket.input === "number") return;
    let input = 0;
    let output = 0;
    let cacheRead = 0;
    let cacheWrite = 0;
    for (const record of records) {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:813-889](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L813-L889)

增量回填扫描。

<details>
<summary>查看原文（77行）</summary>

```text
/**
 * Incremental scan of the shared sessions root. Skips sessions whose file
 * identity (mtime:size) is unchanged since the last sweep; replays only
 * events past each session's seq watermark, so it is safe to run while live
 * counting is active and to run repeatedly (every sweep + once at startup
 * for backfill).
 */
async function scanOnce() {
  if (scanInFlight) return;
  scanInFlight = true;
  if (store.scan.startedAt === null) store.scan.startedAt = new Date().toISOString();
  try {
    const root = sessionsRoot();
    const projects = await readdir(root, { withFileTypes: true }).catch(() => []);
    let scanned = 0;
    let counted = 0;
    for (const project of projects) {
      if (!project.isDirectory() || !project.name.startsWith("--")) continue;
      const projectDir = join(root, project.name);
      const sessionDirs = await readdir(projectDir, { withFileTypes: true }).catch(() => []);
      for (const entry of sessionDirs) {
        if (!entry.isDirectory()) continue;
        const sessionDir = join(projectDir, entry.name);
        const zstdPath = join(sessionDir, "session.jsonl.zstd");
        const rawPath = join(sessionDir, "session.jsonl");
        let path = null;
        try {
          if (existsSync(zstdPath)) path = zstdPath;
          else if (existsSync(rawPath)) path = rawPath;
        } catch {
          // fall through
        }
        if (path === null) continue;
        let info;
        try {
          info = await stat(path);
        } catch {
          continue;
        }
        const metaKey = `${info.mtimeMs}:${info.size}`;
        if (store.scanMeta[entry.name] === metaKey) continue;
        try {
          const buffer = await readFile(path);
          const events = path.endsWith(".zstd") ? decodeSessionLog(buffer) : parseEventLines(buffer.toString("utf8"));
          const sessionId = headerId(events) ?? entry.name;
          for (const event of events) {
            if (event?.type === "session/title" && typeof event?.data?.title === "string" && event.data.title.trim() !== "") {
              sessionTitles.set(sessionId, event.data.title);
              scheduleSessionTitlesSave();
            }
            if (fold.ingest(sessionId, event)) counted += 1;
          }
          store.scanMeta[entry.name] = metaKey;
          scanned += 1;
        } catch (error) {
          console.warn(`[chicheng-stats] scan failed for ${path}:`, error instanceof Error ? error.message : String(error));
          // scanMeta intentionally not recorded → retried on the next sweep
        }
        if (scanned % 20 === 0) scheduleSave();
        // yield to the event loop between sessions so startup is not blocked
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    if (store.scan.finishedAt === null) store.scan.finishedAt = new Date().toISOString();
    store.scan.scannedSessions += scanned;
    store.scan.scannedEvents += counted;
    store.scan.lastScanAt = new Date().toISOString();
    if (counted > 0) scheduleRecordsSave();
    if (scanned > 0 || counted > 0) {
      console.info(`[chicheng-stats] scan: ${scanned} session(s), ${counted} usage sample(s) ingested`);
    }
    scheduleSave();
  } catch (error) {
    console.warn(`[chicheng-stats] scan failed:`, error instanceof Error ? error.message : String(error));
  } finally {
    scanInFlight = false;
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1742-1816](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L1742-L1816)

实时监听与定时扫描。

<details>
<summary>查看原文（75行）</summary>

```text
  // Live counting: every session event in this process (web-profile sessions;
  // headless sessions are covered by the periodic sweep instead).
  ctx.on("session/event", (session, event) => {
    const sessionId = session?.id ?? "?";
    try {
      if (event?.type === "session/title" && typeof event?.data?.title === "string" && event.data.title.trim() !== "") {
        sessionTitles.set(sessionId, event.data.title);
        scheduleSessionTitlesSave();
      }
      if (fold.ingest(sessionId, event)) {
        scheduleSave();
        scheduleRecordsSave();
      }
    } catch (error) {
      console.warn(`[chicheng-stats] live ingest failed:`, error instanceof Error ? error.message : String(error));
    }
  });

  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: "/stats/api",
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: "forbidden", message: "forbidden" } });
        return;
      }
      if (req.method !== "POST") {
        writeJson(res, 405, { ok: false, error: { code: "method-error", message: "method not allowed" } });
        return;
      }
      const pathname = new URL(req.url ?? "/", "http://stats.invalid").pathname;
      const method = pathname.startsWith("/stats/api/") ? pathname.slice(11) : undefined;
      if (method === undefined || method.includes("/") || method === "") {
        writeError(res, new StatsError("not-found", "unknown stats API method", 404));
        return;
      }
      try {
        const payload = await readJsonBody(req);
        const handler = api[method];
        if (typeof handler !== "function") throw new StatsError("not-found", `unknown stats API method "${method}"`, 404);
        writeOk(res, await handler(payload));
      } catch (error) {
        writeError(res, error);
      }
    },
  }), "chicheng-stats: /stats/api routes");

  ctx.effect(() => () => {
    tornDown = true;
    currentCtx = null;
    if (sweepTimer !== null) clearInterval(sweepTimer);
    sweepTimer = null;
    if (startupTimer !== null) clearTimeout(startupTimer);
    startupTimer = null;
    void flushStore();
    void flushRecords();
    void flushSettings();
    void flushSessionTitles();
  }, "chicheng-stats: teardown");

  // Backfill history shortly after startup, then sweep periodically for
  // sessions written by other processes (headless cron agents, etc.).
  startupTimer = setTimeout(() => {
    startupTimer = null;
    if (tornDown) return;
    void (async () => {
      await rebuildRecordsIfNeeded();
      await refreshSessionTitlesIfNeeded();
      if (!tornDown) await scanOnce();
    })();
  }, 1500);
  startupTimer.unref?.();
  sweepTimer = setInterval(() => {
    if (!tornDown) void scanOnce();
  }, SWEEP_INTERVAL_MS);
```

</details>

**依据 4 · 作者声明**：[README.md:3-18](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/README.md#L3-L18)

作者功能说明。

<details>
<summary>查看原文（16行）</summary>

```text
dsh Web 全局用量统计插件：在左侧栏"设置"按钮旁显示用量组件（一行小字或卡片，**可在 设置 → 用量统计 中自由配置**），点击打开完整的用量统计面板（Sub2API 风格的使用记录）。跨所有会话统计，包括 headless 定时任务等其他进程产生的会话。

## 功能特性

- **实时累计**：订阅 `session/event`，按 `(turn, step)` 去重计数每次 provider 请求的用量样本，并记录逐请求明细（时间 / 模型 / 会话 / 输入 / 缓存读 / 缓存写 / 输出）；
- **模型归属**：从 `request/header` 快照追踪每个请求使用的模型，支撑模型分布统计；
- **可配置侧边栏组件**：设置 → 用量统计 中可调整——
  - **通用**：显示模式（文字 / 卡片）、位置（设置按钮上方 / 下方）；
  - **文字模式**：自定义模板 + 12 个占位符、字号、文字颜色、粗细、对齐、背景填充（含背景颜色）、圆角、内边距；
  - **卡片模式**：卡片大小、每行列数（1/2/4）、显示项目（勾选）、标题字号与颜色、数值字号与颜色、间隔、圆角、边框粗细与颜色、背景颜色（默认 `#43454A`）；
  - 修改实时生效（约 5 秒内），无需重启；
- **统计面板**：点击组件弹出面板——时间范围选择（今日 / 近7天 / 近30天 / 本月 / 全部）、**提供方筛选**（全部 / 各提供方，可查看单一提供方用量）、概览、模型分布、Token 使用趋势图（SVG）、用量明细表（含首字节 / 总耗时）；
- **DeepSeek 平台悬停提示**：鼠标悬停侧边栏组件（文字/卡片/收起图标）时浮动显示 DeepSeek 开放平台数据——剩余金额、今日消费、今日 Token、今日请求。余额来自官方 `/user/balance`（读取 `DEEPSEEK_API_KEY`）；配置 `DEEPSEEK_PLATFORM_TOKEN` 后今日消费/Token 使用平台官方明细，否则今日消费为余额差估算（带 `≈`），Token 回退为本地统计。数据只在悬停时展示，**不进统计弹窗**；
- **历史回填 + 增量扫描**：启动后扫描 `$DSH_HOME/sessions` 下全部会话日志（zstd 多帧拼接，按帧切分后逐帧解压），只处理越过持久化 seq 水位的事件，与实时计数天然去重；此后每 5 分钟轻扫一次，覆盖其他进程写入的会话；
- **持久化**：聚合写入 `$DSH_HOME/stats/store.json`，明细写入 `$DSH_HOME/stats/requests.json`，组件设置写入 `$DSH_HOME/stats/settings.json`（均防抖原子写入），重启不丢；
- **只读安全**：不修改任何会话数据，对模型体验 / KV Cache 零影响。
```

</details>

#### 缺口

- 未用真实历史会话对账
  **影响**：跨进程覆盖率与账单一致性未知
  **进一步探讨**：与独立请求日志/厂商用量样本对账

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 统计完整性与桌面端边界在哪里？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

水位 Map 超过 5000 会删最早项，源码注释也承认重启后可能重复计数；scanMeta 以 session 目录 entry.name 为键而不含项目路径，若不同项目同名目录且 mtime:size 相同，第二个可能被跳过。zstd 解码在 Electron/Desktop 默认直接返回空数组以避免 native zstd CHECK-trap，因此桌面端默认不回填这些历史日志。聚合与请求明细分别持久化，明细上限 30000 条，统计全量与明细列表范围不同。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:143-200](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L143-L200)

水位淘汰。

<details>
<summary>查看原文（58行）</summary>

```text
function createFold(initial = {}) {
  const days = new Map(Object.entries(initial.days ?? {}));
  const watermarks = new Map(Object.entries(initial.watermarks ?? {}));
  // In-memory only: a replace (same turn/step re-report) is always adjacent
  // in seq order, and the watermark makes replay impossible after restart.
  const lastUsage = new Map();
  // Provider model in force per session (from request/header snapshots).
  const sessionModels = new Map();
  // Provider in force per session (from request/header snapshots).
  const sessionProviders = new Map();
  // Per-request detail records (bounded ring; persisted to a separate file).
  const records = [];
  // Per-step timing: step/start → first content chunk (TTFT) and → usage
  // sample (total duration). Keyed `${sessionId}|${turn}|${step}`; entries are
  // removed on step/end so the maps stay bounded by in-flight steps.
  const stepStarts = new Map();
  const stepFirstChunks = new Map();

  /** @returns true when the event contributed a usage sample. */
  function ingest(sessionId, event) {
    // Track the model and provider each request was built under.
    if (event?.type === "request/header") {
      const model = modelOfEvent(event);
      if (model !== null) sessionModels.set(sessionId, model);
      const provider = providerOfEvent(event);
      if (provider !== null) sessionProviders.set(sessionId, provider);
    }
    const turn = event?.data?.turn;
    const step = event?.data?.step;
    const ts = Number.isFinite(event?.time) ? event.time : Date.now();
    if (turn !== undefined && step !== undefined) {
      const stepKey = `${sessionId}|${turn}|${step}`;
      if (event?.type === "step/start") {
        stepStarts.set(stepKey, ts);
        stepFirstChunks.delete(stepKey);
      } else if (event?.type === "step/end") {
        stepStarts.delete(stepKey);
        stepFirstChunks.delete(stepKey);
      } else if (event?.type === "assistant/chunk" && !stepFirstChunks.has(stepKey)) {
        const chunk = event?.data?.chunk;
        if (chunk !== null && typeof chunk === "object" && CONTENT_CHUNK_TYPES.has(chunk.type)) {
          stepFirstChunks.set(stepKey, ts);
        }
      }
    }
    const usage = usageOfEvent(event);
    if (usage === undefined) return false;
    const seq = event?.seq;
    if (Number.isFinite(seq)) {
      const seen = watermarks.get(sessionId) ?? -1;
      if (seq <= seen) return false;
      watermarks.set(sessionId, seq);
      if (watermarks.size > 5000) {
        // prune oldest-inserted watermarks; lost entries only risk re-counting
        // after a restart, and their sessions are re-scanned from scratch
        const firstKey = watermarks.keys().next().value;
        if (firstKey !== undefined) watermarks.delete(firstKey);
      }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:457-473](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L457-L473)

桌面跳过 zstd 历史。

<details>
<summary>查看原文（17行）</summary>

```text
/** Decode a concatenated-frame `.jsonl.zstd` artifact into event objects. */
function decodeSessionLog(buffer) {
  // DeepSeek Harness Desktop bundles a Node runtime whose zlib native zstd
  // binding can CHECK-trap (SIGTRAP) on valid streaming zstd frames without
  // Frame_Content_Size — the exact shape the harness session-log writer
  // emits. The trap happens on a uv callback path, so try/catch cannot
  // contain it. Skip history backfill on Electron/Desktop runtimes by
  // default; set CHICHENG_ENABLE_SCAN=1 to opt back in.
  if (typeof process.versions?.electron === "string" && process.env.CHICHENG_ENABLE_SCAN !== "1") {
    return [];
  }
  const { frames, tornStart } = scanZstdFrames(buffer);
  const parts = [];
  for (const frame of frames) {
    parts.push(zlib.zstdDecompressSync(buffer.subarray(frame.start, frame.end)));
  }
  return parseEventLines(Buffer.concat(parts).toString("utf8"));
```

</details>

**依据 3 · 源码核查**：[lib/index.js:132-154](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L132-L154)

明细上限与聚合。

<details>
<summary>查看原文（23行）</summary>

```text
/** Max detail records kept in memory / on disk (oldest dropped beyond this). */
const MAX_RECORDS = 30000;

/** Content-delta chunk types — the first one marks the time-to-first-byte. */
const CONTENT_CHUNK_TYPES = new Set(["text-delta", "reasoning-delta", "tool-call-delta"]);

/**
 * The counting engine. Events must be fed in ascending seq order per session
 * (live events arrive in order; scans replay logs in order); the fold is
 * synchronous, so live and scan ingestion share one instance without races.
 */
function createFold(initial = {}) {
  const days = new Map(Object.entries(initial.days ?? {}));
  const watermarks = new Map(Object.entries(initial.watermarks ?? {}));
  // In-memory only: a replace (same turn/step re-report) is always adjacent
  // in seq order, and the watermark makes replay impossible after restart.
  const lastUsage = new Map();
  // Provider model in force per session (from request/header snapshots).
  const sessionModels = new Map();
  // Provider in force per session (from request/header snapshots).
  const sessionProviders = new Map();
  // Per-request detail records (bounded ring; persisted to a separate file).
  const records = [];
```

</details>

**依据 4 · 源码核查**：[lib/index.js:829-866](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L829-L866)

scanMeta 键与文件元数据。

<details>
<summary>查看原文（38行）</summary>

```text
    for (const project of projects) {
      if (!project.isDirectory() || !project.name.startsWith("--")) continue;
      const projectDir = join(root, project.name);
      const sessionDirs = await readdir(projectDir, { withFileTypes: true }).catch(() => []);
      for (const entry of sessionDirs) {
        if (!entry.isDirectory()) continue;
        const sessionDir = join(projectDir, entry.name);
        const zstdPath = join(sessionDir, "session.jsonl.zstd");
        const rawPath = join(sessionDir, "session.jsonl");
        let path = null;
        try {
          if (existsSync(zstdPath)) path = zstdPath;
          else if (existsSync(rawPath)) path = rawPath;
        } catch {
          // fall through
        }
        if (path === null) continue;
        let info;
        try {
          info = await stat(path);
        } catch {
          continue;
        }
        const metaKey = `${info.mtimeMs}:${info.size}`;
        if (store.scanMeta[entry.name] === metaKey) continue;
        try {
          const buffer = await readFile(path);
          const events = path.endsWith(".zstd") ? decodeSessionLog(buffer) : parseEventLines(buffer.toString("utf8"));
          const sessionId = headerId(events) ?? entry.name;
          for (const event of events) {
            if (event?.type === "session/title" && typeof event?.data?.title === "string" && event.data.title.trim() !== "") {
              sessionTitles.set(sessionId, event.data.title);
              scheduleSessionTitlesSave();
            }
            if (fold.ingest(sessionId, event)) counted += 1;
          }
          store.scanMeta[entry.name] = metaKey;
          scanned += 1;
```

</details>

#### 缺口

- 未造 5000+ 会话或同名项目目录
  **影响**：实际重复/漏计触发率未知
  **进一步探讨**：隔离构造同名目录、水位淘汰与桌面回填对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 平台 token 导入及 API 安全边界是什么？

**研究主题**：依赖、兼容与流程、采用判断、缺陷与关键质疑

#### 完整回答

“自动获取”会扫描 Chrome/Edge/360 浏览器 Profile 的 Local Storage LevelDB，若锁住则复制整个 LevelDB 到临时目录再读 DeepSeek userToken；importPlatformToken API 把 {token, source} 返回浏览器，随后客户端再调用 savePlatformToken 存 credentials。/stats/api 的门禁检查 Host、Origin、sec-fetch-site，但没有可见的会话级身份授权；同源脚本或可伪造 HTTP 头的本地进程可触达敏感 token 路由的条件需由宿主网络边界决定。启用前应明确用户知情与访问范围。DeepSeek 余额通过官方端点，今日消费缺平台 token 时用余额差估算，不能与官方账单等同。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1021-1041](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L1021-L1041)

Host/Origin/Fetch Metadata 门禁。

<details>
<summary>查看原文（21行）</summary>

```text
function isTrustedApiRequest(request, trustedHosts) {
  const host = header(request.headers, "host");
  if (host === undefined) return false;
  const hostUrl = parseAuthority(host);
  if (hostUrl === undefined) return false;
  const hosts = Array.isArray(trustedHosts) ? trustedHosts : [];
  const trusted = hosts.some((entry) => {
    const entryUrl = parseAuthority(entry);
    if (entryUrl === undefined) return false;
    return entryUrl.hostname === hostUrl.hostname && (entryUrl.port === "" || entryUrl.port === hostUrl.port);
  });
  if (!isLoopbackHostname(hostUrl.hostname) && !trusted) return false;
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

**依据 2 · 源码核查**：[lib/index.js:1359-1468](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L1359-L1468)

浏览器 LevelDB 扫描、拷贝与 token 返回。

<details>
<summary>查看原文（110行）</summary>

```text
// ---------------------------------------------------------------- DeepSeek platform token (browser import)

async function browserProfileLeveldbDirs() {
  const local = process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local");
  const roots = [
    join(local, "Google", "Chrome", "User Data"),
    join(local, "Microsoft", "Edge", "User Data"),
    join(local, "360ChromeX", "Chrome", "User Data"),
    join(local, "360Chrome", "Chrome", "User Data"),
    join("D:", "360ChromeX", "Chrome", "User Data"),
    join("D:", "360Chrome", "Chrome", "User Data"),
  ];
  const dirs = [];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name !== "Default" && !/^Profile \d+$/.test(entry.name) && !entry.name.startsWith("user-")) continue;
      const dir = join(root, entry.name, "Local Storage", "leveldb");
      if (existsSync(dir)) dirs.push(dir);
    }
  }
  return dirs;
}

const DEEPSEEK_STORAGE_KEY = Buffer.from("_https://platform.deepseek.com\u0000\u0001userToken");

/** Chromium localStorage stores `userToken` as a JSON object string like `{"value":"..."}`. */
function decodeLocalStorageValue(value) {
  if (value == null) return null;
  const raw = value.toString().slice(1);
  try {
    const parsed = JSON.parse(raw);
    if (parsed !== null && typeof parsed === "object" && typeof parsed.value === "string" && parsed.value.trim() !== "") {
      return parsed.value;
    }
  } catch {}
  return raw.trim() !== "" ? raw : null;
}

function readTokenFromLeveldbDir(leveldbDir) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (token) => {
      if (settled) return;
      settled = true;
      resolve(token);
    };
    let db;
    try {
      db = leveldown(leveldbDir);
      // Use the low-level callback API directly: levelup wraps open errors in
      // an unhandled 'error' event, which crashes the host when a live browser
      // holds the DB. leveldown reports the same failure through open()'s
      // callback instead.
      db.open((openErr) => {
        if (openErr) return done(null);
        db.get(DEEPSEEK_STORAGE_KEY, (getErr, value) => {
          const token = getErr ? null : decodeLocalStorageValue(value);
          try { db.close(() => {}); } catch {}
          done(token);
        });
      });
    } catch {
      done(null);
    }
  });
}

async function copyLeveldbToTemp(srcDir) {
  const tmpDir = await mkdtemp(join(tmpdir(), "chicheng-ds-"));
  const entries = await readdir(srcDir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (entry.name === "LOCK") continue;
    const src = join(srcDir, entry.name);
    const dest = join(tmpDir, entry.name);
    if (entry.isDirectory()) {
      await mkdir(dest, { recursive: true }).catch(() => {});
      const children = await readdir(src, { withFileTypes: true }).catch(() => []);
      for (const child of children) {
        await copyFile(join(src, child.name), join(dest, child.name)).catch(() => {});
      }
    } else {
      await copyFile(src, dest).catch(() => {});
    }
  }
  return tmpDir;
}

async function readPlatformTokenFromLeveldb(dir) {
  const direct = await readTokenFromLeveldbDir(dir);
  if (direct !== null) return direct;
  // If the browser is running and holds the LevelDB lock, read a temporary copy.
  const tmpDir = await copyLeveldbToTemp(dir).catch(() => null);
  if (tmpDir === null) return null;
  try {
    return await readTokenFromLeveldbDir(tmpDir);
  } finally {
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function importDeepseekPlatformToken() {
  const dirs = await browserProfileLeveldbDirs();
  for (const dir of dirs) {
    const token = await readPlatformTokenFromLeveldb(dir);
    if (token !== null) return { token, found: true, source: dir };
  }
  return { token: null, found: false };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1532-1551](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L1532-L1551)

导入/保存 API。

<details>
<summary>查看原文（20行）</summary>

```text
    /** Whether DEEPSEEK_PLATFORM_TOKEN is currently configured (no value). */
    platformTokenStatus: async () => {
      const ctx = currentCtx;
      if (ctx?.credentials?.describe == null) return { configured: false, writable: false };
      const desc = await ctx.credentials.describe("DEEPSEEK_PLATFORM_TOKEN");
      return { configured: desc?.configured === true, writable: desc?.writable === true };
    },

    /** Scan local Chrome/Edge profiles for a stored DeepSeek platform userToken. */
    importPlatformToken: async () => importDeepseekPlatformToken(),

    /** Persist a DeepSeek platform userToken via the credentials seam. */
    savePlatformToken: async (payload) => {
      const token = typeof payload?.token === "string" ? payload.token.trim() : "";
      if (token === "") throw new StatsError("invalid-token", "UserToken 不能为空", 400);
      const ctx = currentCtx;
      if (ctx?.credentials?.set == null) throw new StatsError("credentials-unavailable", "credentials service unavailable", 500);
      await ctx.credentials.set("DEEPSEEK_PLATFORM_TOKEN", token);
      deepseekCache = { at: 0, data: null };
      return { saved: true };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1760-1786](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L1760-L1786)

统一 API 路由。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: "/stats/api",
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: "forbidden", message: "forbidden" } });
        return;
      }
      if (req.method !== "POST") {
        writeJson(res, 405, { ok: false, error: { code: "method-error", message: "method not allowed" } });
        return;
      }
      const pathname = new URL(req.url ?? "/", "http://stats.invalid").pathname;
      const method = pathname.startsWith("/stats/api/") ? pathname.slice(11) : undefined;
      if (method === undefined || method.includes("/") || method === "") {
        writeError(res, new StatsError("not-found", "unknown stats API method", 404));
        return;
      }
      try {
        const payload = await readJsonBody(req);
        const handler = api[method];
        if (typeof handler !== "function") throw new StatsError("not-found", `unknown stats API method "${method}"`, 404);
        writeOk(res, await handler(payload));
      } catch (error) {
        writeError(res, error);
      }
    },
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1495-1503](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/client.js#L1495-L1503)

客户端取 token 并再保存。

```text
				if (platformBusy) return;
				setPlatformBusy(true);
				setPlatformTokenMessage("");
				try {
					const res = await call("importPlatformToken");
					if (res?.found === true && typeof res.token === "string" && res.token.trim() !== "") {
						setPlatformToken(res.token);
						await call("savePlatformToken", { token: res.token });
						const st = await call("platformTokenStatus");
```

**依据 6 · 作者声明**：[README.md:48-65](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/README.md#L48-L65)

平台用量和自动获取说明。

<details>
<summary>查看原文（18行）</summary>

````text
## DeepSeek 平台数据（悬停提示）

鼠标悬停侧边栏组件时，会显示 DeepSeek 开放平台的剩余金额 / 今日消费 / 今日 Token / 今日请求；此数据不会出现在统计弹窗里。

- **余额**：读取 `DEEPSEEK_API_KEY`（设置 → 模型，或 `~/.dsh/.credentials.yaml`）。
- **今日消费 / Token（官方）**：可选配置 `DEEPSEEK_PLATFORM_TOKEN`。
  - 推荐：在 **设置 → 用量统计 → DeepSeek 平台 UserToken** 中点击「自动获取」，插件会扫描本机 Chrome / Edge 浏览器里已登录的 `userToken` 并自动保存；找不到时提示先登录 platform.deepseek.com 再试。
  - 也可手动：登录 platform.deepseek.com → DevTools Console → `JSON.parse(localStorage.getItem('userToken')).value`，写入 `~/.dsh/.credentials.yaml`：

  ```yaml
  version: 1
  refs:
    DEEPSEEK_API_KEY: sk-...
    DEEPSEEK_PLATFORM_TOKEN: <platform userToken>
  ```

- **未配置平台 token 时**：今日消费按余额差估算（显示 `≈`），今日 Token / 请求回退为本地统计。
- Host 端接口 `POST /stats/api/deepseek` 有 60 秒缓存；API Key 与平台 token 不出本机。
````

</details>

#### 缺口

- 未在真实浏览器/DSH Host 试门禁
  **影响**：跨源/同源权限与 token 暴露范围未验证
  **进一步探讨**：隔离宿主测未登录请求、跨源、同源客户端和本地进程访问

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复分别消耗什么，如何判断成本效果？

**研究主题**：效果与总成本、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/leveldown原生依赖、首次历史读取解压与统计磁盘；价格未知 | 安装Web profile、核统计目录/日志格式与凭证授权，工时未知 | Electron默认跳过zstd；安装和覆盖率需按环境检查 |
| 持续使用 | 实时折叠、每5分钟扫描变化日志、聚合及最多3万明细持久化；可选平台API访问 | 检口径与统计新鲜度，工时未知 | 水位上限5000；净CPU/IO与平台API配额费用未知 |
| 失败恢复 | 重扫/重建、备份恢复及可能的凭证轮换资源，金额未知 | 核漏计重计、同名目录与桌面历史缺口；核临时副本/凭证访问，工时未知 | 不能据当前聚合自行推回完整明细；停用/重启不自动证明对账恢复 |

核算单位是正确覆盖约定会话范围且可与原事件核对的统计视图，不是面板能打开。相比人工逐日志统计，增量扫描可复用已处理元数据和聚合，但变动日志仍需读取、桌面默认缺历史，3万明细与日聚合保留范围不同；未测安装工时、扫描吞吐、官方账单误差和恢复时间，不填零也不推出净省费。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:813-889](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L813-L889)

变化日志扫描和保存

<details>
<summary>查看原文（77行）</summary>

```text
/**
 * Incremental scan of the shared sessions root. Skips sessions whose file
 * identity (mtime:size) is unchanged since the last sweep; replays only
 * events past each session's seq watermark, so it is safe to run while live
 * counting is active and to run repeatedly (every sweep + once at startup
 * for backfill).
 */
async function scanOnce() {
  if (scanInFlight) return;
  scanInFlight = true;
  if (store.scan.startedAt === null) store.scan.startedAt = new Date().toISOString();
  try {
    const root = sessionsRoot();
    const projects = await readdir(root, { withFileTypes: true }).catch(() => []);
    let scanned = 0;
    let counted = 0;
    for (const project of projects) {
      if (!project.isDirectory() || !project.name.startsWith("--")) continue;
      const projectDir = join(root, project.name);
      const sessionDirs = await readdir(projectDir, { withFileTypes: true }).catch(() => []);
      for (const entry of sessionDirs) {
        if (!entry.isDirectory()) continue;
        const sessionDir = join(projectDir, entry.name);
        const zstdPath = join(sessionDir, "session.jsonl.zstd");
        const rawPath = join(sessionDir, "session.jsonl");
        let path = null;
        try {
          if (existsSync(zstdPath)) path = zstdPath;
          else if (existsSync(rawPath)) path = rawPath;
        } catch {
          // fall through
        }
        if (path === null) continue;
        let info;
        try {
          info = await stat(path);
        } catch {
          continue;
        }
        const metaKey = `${info.mtimeMs}:${info.size}`;
        if (store.scanMeta[entry.name] === metaKey) continue;
        try {
          const buffer = await readFile(path);
          const events = path.endsWith(".zstd") ? decodeSessionLog(buffer) : parseEventLines(buffer.toString("utf8"));
          const sessionId = headerId(events) ?? entry.name;
          for (const event of events) {
            if (event?.type === "session/title" && typeof event?.data?.title === "string" && event.data.title.trim() !== "") {
              sessionTitles.set(sessionId, event.data.title);
              scheduleSessionTitlesSave();
            }
            if (fold.ingest(sessionId, event)) counted += 1;
          }
          store.scanMeta[entry.name] = metaKey;
          scanned += 1;
        } catch (error) {
          console.warn(`[chicheng-stats] scan failed for ${path}:`, error instanceof Error ? error.message : String(error));
          // scanMeta intentionally not recorded → retried on the next sweep
        }
        if (scanned % 20 === 0) scheduleSave();
        // yield to the event loop between sessions so startup is not blocked
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    if (store.scan.finishedAt === null) store.scan.finishedAt = new Date().toISOString();
    store.scan.scannedSessions += scanned;
    store.scan.scannedEvents += counted;
    store.scan.lastScanAt = new Date().toISOString();
    if (counted > 0) scheduleRecordsSave();
    if (scanned > 0 || counted > 0) {
      console.info(`[chicheng-stats] scan: ${scanned} session(s), ${counted} usage sample(s) ingested`);
    }
    scheduleSave();
  } catch (error) {
    console.warn(`[chicheng-stats] scan failed:`, error instanceof Error ? error.message : String(error));
  } finally {
    scanInFlight = false;
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1722-1817](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L1722-L1817)

实时采集、周期和退出持久化

<details>
<summary>查看原文（96行）</summary>

```text
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let sweepTimer = null;
let startupTimer = null;
let tornDown = false;

async function apply(ctx) {
  await loadStore();
  await loadRecords();
  await loadSettings();
  await loadSessionTitles();
  currentCtx = ctx;
  const fence = (req) => {
    try {
      return isTrustedApiRequest(req, ctx.webRuntime?.trustedHosts ?? []);
    } catch {
      return false;
    }
  };
  const api = buildApi();

  // Live counting: every session event in this process (web-profile sessions;
  // headless sessions are covered by the periodic sweep instead).
  ctx.on("session/event", (session, event) => {
    const sessionId = session?.id ?? "?";
    try {
      if (event?.type === "session/title" && typeof event?.data?.title === "string" && event.data.title.trim() !== "") {
        sessionTitles.set(sessionId, event.data.title);
        scheduleSessionTitlesSave();
      }
      if (fold.ingest(sessionId, event)) {
        scheduleSave();
        scheduleRecordsSave();
      }
    } catch (error) {
      console.warn(`[chicheng-stats] live ingest failed:`, error instanceof Error ? error.message : String(error));
    }
  });

  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: "/stats/api",
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: "forbidden", message: "forbidden" } });
        return;
      }
      if (req.method !== "POST") {
        writeJson(res, 405, { ok: false, error: { code: "method-error", message: "method not allowed" } });
        return;
      }
      const pathname = new URL(req.url ?? "/", "http://stats.invalid").pathname;
      const method = pathname.startsWith("/stats/api/") ? pathname.slice(11) : undefined;
      if (method === undefined || method.includes("/") || method === "") {
        writeError(res, new StatsError("not-found", "unknown stats API method", 404));
        return;
      }
      try {
        const payload = await readJsonBody(req);
        const handler = api[method];
        if (typeof handler !== "function") throw new StatsError("not-found", `unknown stats API method "${method}"`, 404);
        writeOk(res, await handler(payload));
      } catch (error) {
        writeError(res, error);
      }
    },
  }), "chicheng-stats: /stats/api routes");

  ctx.effect(() => () => {
    tornDown = true;
    currentCtx = null;
    if (sweepTimer !== null) clearInterval(sweepTimer);
    sweepTimer = null;
    if (startupTimer !== null) clearTimeout(startupTimer);
    startupTimer = null;
    void flushStore();
    void flushRecords();
    void flushSettings();
    void flushSessionTitles();
  }, "chicheng-stats: teardown");

  // Backfill history shortly after startup, then sweep periodically for
  // sessions written by other processes (headless cron agents, etc.).
  startupTimer = setTimeout(() => {
    startupTimer = null;
    if (tornDown) return;
    void (async () => {
      await rebuildRecordsIfNeeded();
      await refreshSessionTitlesIfNeeded();
      if (!tornDown) await scanOnce();
    })();
  }, 1500);
  startupTimer.unref?.();
  sweepTimer = setInterval(() => {
    if (!tornDown) void scanOnce();
  }, SWEEP_INTERVAL_MS);
  sweepTimer.unref?.();
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1429-1458](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L1429-L1458)

临时LevelDB复制和清理

<details>
<summary>查看原文（30行）</summary>

```text
async function copyLeveldbToTemp(srcDir) {
  const tmpDir = await mkdtemp(join(tmpdir(), "chicheng-ds-"));
  const entries = await readdir(srcDir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (entry.name === "LOCK") continue;
    const src = join(srcDir, entry.name);
    const dest = join(tmpDir, entry.name);
    if (entry.isDirectory()) {
      await mkdir(dest, { recursive: true }).catch(() => {});
      const children = await readdir(src, { withFileTypes: true }).catch(() => []);
      for (const child of children) {
        await copyFile(join(src, child.name), join(dest, child.name)).catch(() => {});
      }
    } else {
      await copyFile(src, dest).catch(() => {});
    }
  }
  return tmpDir;
}

async function readPlatformTokenFromLeveldb(dir) {
  const direct = await readTokenFromLeveldbDir(dir);
  if (direct !== null) return direct;
  // If the browser is running and holds the LevelDB lock, read a temporary copy.
  const tmpDir = await copyLeveldbToTemp(dir).catch(() => null);
  if (tmpDir === null) return null;
  try {
    return await readTokenFromLeveldbDir(tmpDir);
  } finally {
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
```

</details>

#### 缺口

- 真实日志规模、变动频率与依赖安装/恢复工时未知
  **影响**：无法给出总拥有成本或净资源收益
  **进一步探讨**：读者可从固定规模日志对账、扫描字节与恢复记录入手

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪复合身份与持久去重能改善统计完整性的假设？

**研究主题**：新假设与验证、工程质量与复用、采用判断

#### 完整回答

固定源码以entry.name缓存扫描元数据、水位最多保留5000项且lastUsage只在内存；桌面默认跳过zstd。这些分别限制跨项目身份、长历史去重和平台覆盖。相对当前增量扫描，设计假设是以规范项目路径加真实session ID/日志身份作复合键，并持久保存已核usage请求键和替换状态，能降低同名目录漏计与水位淘汰后重计，同时保留实时/扫描汇合。它不自动解决桌面解压或厂商计费口径。条件是可稳定提取身份、事务性更新去重和聚合、可维护旧数据迁移；代价是索引磁盘、写放大和恢复复杂度。最小对照用同一匿名事件语料覆盖两个同名目录/相同mtime:size、超过5000会话、实时后回填、chunk到final替换与重启，在原版和隔离原型按事件真值比较漏计、重计、聚合/明细偏差、扫描字节、索引大小和恢复耗时。若误差不下降或新增索引成本超过预定可接受预算，假设被证伪。本轮未实现或执行该对照；token导入不回传浏览器是独立访问边界改造，不能据此声称统计准确度提高。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:143-200](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L143-L200)

内存替换和有界水位

<details>
<summary>查看原文（58行）</summary>

```text
function createFold(initial = {}) {
  const days = new Map(Object.entries(initial.days ?? {}));
  const watermarks = new Map(Object.entries(initial.watermarks ?? {}));
  // In-memory only: a replace (same turn/step re-report) is always adjacent
  // in seq order, and the watermark makes replay impossible after restart.
  const lastUsage = new Map();
  // Provider model in force per session (from request/header snapshots).
  const sessionModels = new Map();
  // Provider in force per session (from request/header snapshots).
  const sessionProviders = new Map();
  // Per-request detail records (bounded ring; persisted to a separate file).
  const records = [];
  // Per-step timing: step/start → first content chunk (TTFT) and → usage
  // sample (total duration). Keyed `${sessionId}|${turn}|${step}`; entries are
  // removed on step/end so the maps stay bounded by in-flight steps.
  const stepStarts = new Map();
  const stepFirstChunks = new Map();

  /** @returns true when the event contributed a usage sample. */
  function ingest(sessionId, event) {
    // Track the model and provider each request was built under.
    if (event?.type === "request/header") {
      const model = modelOfEvent(event);
      if (model !== null) sessionModels.set(sessionId, model);
      const provider = providerOfEvent(event);
      if (provider !== null) sessionProviders.set(sessionId, provider);
    }
    const turn = event?.data?.turn;
    const step = event?.data?.step;
    const ts = Number.isFinite(event?.time) ? event.time : Date.now();
    if (turn !== undefined && step !== undefined) {
      const stepKey = `${sessionId}|${turn}|${step}`;
      if (event?.type === "step/start") {
        stepStarts.set(stepKey, ts);
        stepFirstChunks.delete(stepKey);
      } else if (event?.type === "step/end") {
        stepStarts.delete(stepKey);
        stepFirstChunks.delete(stepKey);
      } else if (event?.type === "assistant/chunk" && !stepFirstChunks.has(stepKey)) {
        const chunk = event?.data?.chunk;
        if (chunk !== null && typeof chunk === "object" && CONTENT_CHUNK_TYPES.has(chunk.type)) {
          stepFirstChunks.set(stepKey, ts);
        }
      }
    }
    const usage = usageOfEvent(event);
    if (usage === undefined) return false;
    const seq = event?.seq;
    if (Number.isFinite(seq)) {
      const seen = watermarks.get(sessionId) ?? -1;
      if (seq <= seen) return false;
      watermarks.set(sessionId, seq);
      if (watermarks.size > 5000) {
        // prune oldest-inserted watermarks; lost entries only risk re-counting
        // after a restart, and their sessions are re-scanned from scratch
        const firstKey = watermarks.keys().next().value;
        if (firstKey !== undefined) watermarks.delete(firstKey);
      }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:220-258](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L220-L258)

请求替换和明细维护

<details>
<summary>查看原文（39行）</summary>

```text
    const last = lastUsage.get(sessionId);
    if (last !== undefined && last.turn === turn && last.step === step) {
      // same request re-reported (usage chunk → final message): replace
      const previousDay = days.get(last.day);
      if (previousDay !== undefined) {
        previousDay.tokens = Math.max(0, previousDay.tokens - last.tokens);
        previousDay.input = Math.max(0, (previousDay.input ?? 0) - last.input);
        previousDay.output = Math.max(0, (previousDay.output ?? 0) - last.output);
        previousDay.cacheRead = Math.max(0, (previousDay.cacheRead ?? 0) - last.cacheRead);
        previousDay.cacheWrite = Math.max(0, (previousDay.cacheWrite ?? 0) - last.cacheWrite);
      }
      bucket.tokens += tokens;
      bucket.input = (bucket.input ?? 0) + input;
      bucket.output = (bucket.output ?? 0) + output;
      bucket.cacheRead = (bucket.cacheRead ?? 0) + cacheRead;
      bucket.cacheWrite = (bucket.cacheWrite ?? 0) + cacheWrite;
      const record = records[last.recordIndex];
      if (record !== undefined) {
        record.t = ts;
        record.model = model;
        record.provider = provider;
        record.input = input;
        record.cacheRead = cacheRead;
        record.cacheWrite = cacheWrite;
        record.output = output;
        record.ttft = ttft;
        record.duration = duration;
      }
    } else {
      bucket.requests += 1;
      bucket.tokens += tokens;
      bucket.input = (bucket.input ?? 0) + input;
      bucket.output = (bucket.output ?? 0) + output;
      bucket.cacheRead = (bucket.cacheRead ?? 0) + cacheRead;
      bucket.cacheWrite = (bucket.cacheWrite ?? 0) + cacheWrite;
      records.push({ t: ts, model, provider, session: sessionId, turn, step, input, cacheRead, cacheWrite, output, ttft, duration });
      while (records.length > MAX_RECORDS) records.shift();
    }
    lastUsage.set(sessionId, { turn, step, day, tokens, input, output, cacheRead, cacheWrite, recordIndex: records.length - 1 });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:829-866](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L829-L866)

同名扫描缓存键

<details>
<summary>查看原文（38行）</summary>

```text
    for (const project of projects) {
      if (!project.isDirectory() || !project.name.startsWith("--")) continue;
      const projectDir = join(root, project.name);
      const sessionDirs = await readdir(projectDir, { withFileTypes: true }).catch(() => []);
      for (const entry of sessionDirs) {
        if (!entry.isDirectory()) continue;
        const sessionDir = join(projectDir, entry.name);
        const zstdPath = join(sessionDir, "session.jsonl.zstd");
        const rawPath = join(sessionDir, "session.jsonl");
        let path = null;
        try {
          if (existsSync(zstdPath)) path = zstdPath;
          else if (existsSync(rawPath)) path = rawPath;
        } catch {
          // fall through
        }
        if (path === null) continue;
        let info;
        try {
          info = await stat(path);
        } catch {
          continue;
        }
        const metaKey = `${info.mtimeMs}:${info.size}`;
        if (store.scanMeta[entry.name] === metaKey) continue;
        try {
          const buffer = await readFile(path);
          const events = path.endsWith(".zstd") ? decodeSessionLog(buffer) : parseEventLines(buffer.toString("utf8"));
          const sessionId = headerId(events) ?? entry.name;
          for (const event of events) {
            if (event?.type === "session/title" && typeof event?.data?.title === "string" && event.data.title.trim() !== "") {
              sessionTitles.set(sessionId, event.data.title);
              scheduleSessionTitlesSave();
            }
            if (fold.ingest(sessionId, event)) counted += 1;
          }
          store.scanMeta[entry.name] = metaKey;
          scanned += 1;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:457-473](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js#L457-L473)

桌面默认跳过

<details>
<summary>查看原文（17行）</summary>

```text
/** Decode a concatenated-frame `.jsonl.zstd` artifact into event objects. */
function decodeSessionLog(buffer) {
  // DeepSeek Harness Desktop bundles a Node runtime whose zlib native zstd
  // binding can CHECK-trap (SIGTRAP) on valid streaming zstd frames without
  // Frame_Content_Size — the exact shape the harness session-log writer
  // emits. The trap happens on a uv callback path, so try/catch cannot
  // contain it. Skip history backfill on Electron/Desktop runtimes by
  // default; set CHICHENG_ENABLE_SCAN=1 to opt back in.
  if (typeof process.versions?.electron === "string" && process.env.CHICHENG_ENABLE_SCAN !== "1") {
    return [];
  }
  const { frames, tornStart } = scanZstdFrames(buffer);
  const parts = [];
  for (const frame of frames) {
    parts.push(zlib.zstdDecompressSync(buffer.subarray(frame.start, frame.end)));
  }
  return parseEventLines(Buffer.concat(parts).toString("utf8"));
```

</details>

#### 缺口

- 复合键/持久索引方案未实现，稳定身份与迁移开销未知
  **影响**：统计收益和运维代价尚无对照证据
  **进一步探讨**：从可复核匿名语料及失败重启的独立期望值入手

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
