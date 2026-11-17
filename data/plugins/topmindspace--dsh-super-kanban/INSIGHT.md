# DSH Super Kanban

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[14811bf](https://github.com/topmindspace/dsh-super-kanban/tree/14811bf558d089ae827b27b47b69bc294a68fddf)

<!-- BEGIN META -->
[![GitHub ★ 113](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=113&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/topmindspace/dsh-super-kanban) [![npm 30d 3,396](https://img.shields.io/static/v1?label=npm+30d&message=3%2C396&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-kanban) [![最新发布 2026-11-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-kanban)
<!-- END META -->

> **功能**：把 DeepSeek Harness 会话整理成任务卡，集中查看进展、待处理和待验收交付。

> **亮点**：将主会话的结束事件和历史扫描收敛成带来源的待验收队列. 用户可回到会话核对交付。[Q01](#research-q01)

> **主要限制**：轮次结束不是验收完成。新状态自动扫描和 AI 默认打开，还须核对所读范围、宿主模型的去向及内部实际重试。[Q01](#research-q01) [Q03](#research-q03)

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
  - [Q01 · 从会话列表切到看板，什么被识别为待验收？](#detail-section-11)
  - [Q02 · 看板从本机什么资料构建任务，何时回退规则？](#detail-section-12)
  - [Q03 · 私有会话和模型调用预算有哪些直接边界？](#detail-section-13)
  - [Q04 · 怎样检验待验收板能减少漏看，同时不增加错验和模型成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同时维护多个 DSH 会话的操作员，可集中看任务来源、轮次结束和待验收项。

直接看原生会话列表和人工任务台账，适合会话不多或必须逐条维护交付状态的工作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 看板和验收队列 | 从任务打开原会话 | 任务完成由人检查 |
| 规则/AI 扫描 | 将会话提炼成卡片 | 模型有预算和回退，需确认数据流 |
| 任务事件提醒 | 在轮次结束处提示 | 适用主任务与有有效事件的会话 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 宿主 connection、webServer 和 slots | 必需 | 授权及显示 | 路由拒绝或无入口 |
| 可读 DSH home | 必需 | 提取事件与工作区 | 历史缺失或规则无法核实 |
| 匹配的宿主 LLM/预算 | 仅 AI | 分析摘要 | 退规则 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 创建不含私人材料的隔离 home | 确认源数据和 AI 设置 |
| 扫描 | 用户或后台执行 | 任务归属已知、规则或 AI 状态明确 |
| 验收 | 检查实际交付与回执 | 遗漏、重复或错验回原会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 存储与模型支出未知 | 隔离日志，确认数据流 | 默认自动与 AI 开启 |
| 持续 | 日志扫描与模型重试支出未知 | 核对任务、归属与实际交付 | 预算单位不等于服务账单 |
| 退出 | 重复分析已花成本待核 | 停用并回到手工台账 | 已发送给模型的内容无法靠退回消除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 验收提醒 | 及时观察主会话结束并去重 | 真实漏查率和误提醒数 |
| 任务整理 | 规则基础及有条件 AI | 归因准确、合格任务耗时 |
| 预算 | 有每日和每次扫描控制 | 实际请求、token 与现金总量 |

> **思考**：轮次结束不是验收完成。新状态自动扫描和 AI 默认打开，还须核对所读范围、宿主模型的去向及内部实际重试。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将主会话的结束事件和历史扫描收敛成带来源的待验收队列. 用户可回到会话核对交付。[Q01](#research-q01)

实时事件、增量日志和审阅去重有不同状态，规则回退隔离模型故障。记录分析预算仅便于规划，不能用于核算 API 实际次数。

<a id="detail-section-5"></a>

### 1.4 主要限制

轮次结束不是验收完成。新状态自动扫描和 AI 默认打开，还须核对所读范围、宿主模型的去向及内部实际重试。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察几条非敏感会话能否正确出现并回跳，再按真实交付验收。使用空白隔离 home，关闭 AI 后比较规则路径；私有日志或模型去向未知时停用。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定实现支持会话浏览和待人核对的状态。准确性、完整性和资源消耗停留在源码层判断。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、cordis.patch.yml、index.mjs、package.json、server/analyzer-llm.mjs、server/auth.mjs、server/service.mjs、server/sessions.mjs、server/store.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码核查从会话、扫描、模型调用到验收卡片，不运行代码。
- 下一步：做有人工验收标准的回放，以漏事件、错误合并、重复提醒和真实请求次数分别计量。

**分析版本**

- **仓库**：[topmindspace/dsh-super-kanban](https://github.com/topmindspace/dsh-super-kanban)
- **版本号**：0.10.3（[固定提交 14811bf](https://github.com/topmindspace/dsh-super-kanban/tree/14811bf558d089ae827b27b47b69bc294a68fddf)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用带来源序号的轮次结束提醒，可降低并行会话漏验收。对照人工列表记录漏看与错误通过，只有后者未上升且总人时下降才支持。[Q04](#research-q04)

做有人工验收标准的回放，以漏事件、错误合并、重复提醒和真实请求次数分别计量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 3282 | — | — | 49954 |
| .js | source | 1 | 8636 | 8056 | 300 | — |
| .mjs | source | 24 | 11419 | 9640 | 1186 | — |
| .mjs | test | 20 | 8931 | 7821 | 424 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/topmindspace/dsh-super-kanban/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/topmindspace/dsh-super-kanban/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/topmindspace/dsh-super-kanban/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多个并行 DSH 会话中，如何集中找到需要人工验收的任务，同时保留真实交付和资料流向的核对？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从会话列表切到看板，什么被识别为待验收？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合同时委托多个 DSH 会话、需要按任务验收的人。直接会话列表有消息来源，但操作者要人工记住哪一轮已结束、哪个交付物尚待检查。看板把观察到的主会话轮次结束映射为验收卡，即使扫描忙或关闭也尝试挂入。忽略会话、排除工作区、子 Agent、无主任务或已处理 seq 不会重复建卡；历史扫描用初次发现时间、已完成 seq 和此前撤卡时点判断是否再次提醒。原生界面没有这层主动待核对队列时，这是相对人工整理的增量。

轮次结束可以是完成、失败或需继续，事件本身没有验证仓库改动或交付物。作者描述的验收流程由用户打开目标、核对交付、确认或发送续单。看板无法替代代码、文档或其他实际交付的验收。并行会话少时手工列表更容易维护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-39](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/README.md#L25-L39)

作者要求核对交付才确认，续办由用户审阅草稿。

<details>
<summary>查看原文（15行）</summary>

```text
### 第一次使用

1. 从左侧栏打开 **任务看板**。在会话里可点右上角的看板图标打开右侧看板，或点常驻的悬浮入口展开悬浮看板。
2. 在设置中确认活跃周期，然后点击 **扫描**。默认扫描最近 30 天有活动的会话，结果可在扫描按钮提示或「维护」中查看。
3. 在 **待处理** 打开需要介入的会话，或进入任务详情查看验收条件和主交付物。
4. 核对交付物后点 **确认验收**。还需要补做时，点 **继续此任务**，检查草稿并放入关联会话或新会话，由你发送。

## 功能特色

### 核心概念

- **工作区** · 对应 DSH 的一个工作目录，自动出现在看板里。
- **项目** · 你自建的分组，可以把多个工作区的任务归到一起，带备注、到期日和归档。
- **任务** · 一件可验收的工作。属于一个工作区，可选归入一个项目，可关联多条会话，其中一条为主会话。
- **会话** · DSH 里实际执行工作的对话。看板从会话提取进展、阻塞和交付物，审批和发送仍在会话里完成。
```

</details>

**依据 2 · 源码核查**：[server/service.mjs:3756-3789](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/service.mjs#L3756-L3789)

实时轮次事件挂验收，排除忽略、子任务并去重。

<details>
<summary>查看原文（34行）</summary>

```text
  function start() {
    if (stopped || autoTimer) return;
    subscribeAiCatalogEvents();
    try {
      offSessionEvents = ctx?.on?.("session/event", (session, event) => {
        if (stopped || event?.type !== "turn/end") return;
        const id = session?.id || session?.header?.id;
        if (id && (state.ignoredSessions.includes(id) || state.suppressedSessions.includes(id))) return;
        const meta = id ? metaForSessionId(id) : null;
        const workspaceId = meta?.workspaceId;
        if (workspaceId && state.settings.excludeWorkspaces.includes(workspaceId)) return;
        // Pin the finished turn immediately: the card must appear even when the
        // scan is busy, deferred or disabled. The scan fills in the exact seq.
        if (id && meta?.origin !== "subagent" && !(Number(meta?.delegationDepth) > 0)) {
          const task = primaryTaskForSession(id);
          // Prefer the event's own sequence; the cached lastTurnEnd is the
          // previous turn and would dedupe a fresh turn into nothing.
          const liveSeq = Number(event?.seq) > 0 ? Number(event.seq) : 0;
          const alreadySeen = liveSeq > 0 && (Number(state.reviewSeen[id]) || 0) >= liveSeq;
          if (task && !alreadySeen && markTaskReview(task, {
            sessionId: id,
            seq: liveSeq,
            at: Date.now(),
            kind: event?.data?.reason?.kind || "completed",
          })) {
            schedulePersist();
            emitChanged("turn-end", 1);
          }
        }
        if (!state.settings.autoScan) return;
        const now = Date.now();
        turnScanSettledAt = now + TURN_SETTLE_MS;
        turnScanDeadline ||= now + TURN_SCAN_MAX_WAIT_MS;
      }, { global: true });
```

</details>

**依据 3 · 源码核查**：[server/service.mjs:1235-1278](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/service.mjs#L1235-L1278)

历史回放按时间、序号和撤回记录抑制重复提醒。

<details>
<summary>查看原文（44行）</summary>

```text
  /**
   * Scan-side turn-end bookkeeping. The first sighting of an old session only
   * seeds the ledger; a later turn-end on the same session pins a review card.
   */
  function markScanReview(meta) {
    const sessionId = meta?.id;
    const seq = Number(meta?.lastTurnEnd?.seq) || 0;
    if (!sessionId || !seq) return false;
    const firstSighting = !state.reviewSeen[sessionId];
    const seen = Number(state.reviewSeen[sessionId]) || 0;
    const fresh = Date.now() - (Number(meta.lastTurnEnd.time) || 0) <= REVIEW_FRESH_MS;
    const deferredAt = Number(state.reviewDeferred[sessionId]) || 0;
    // Observations that would not pin anyway (seed-only or already in the
    // ledger) must keep the deferred marker: an in-flight or early scan may
    // still be looking at a turn older than the one the user just dismissed.
    if (firstSighting ? !fresh : seen >= seq) {
      recordReviewSeen(sessionId, seq);
      return false;
    }
    if (meta.origin === "subagent" || Number(meta.delegationDepth) > 0) {
      recordReviewSeen(sessionId, seq);
      return false;
    }
    const task = primaryTaskForSession(sessionId);
    if (!task) {
      recordReviewSeen(sessionId, seq);
      return false;
    }
    // This observation would pin a card. Consume a deferred dismissal only
    // here, and only skip when it is the same turn (ended at or before the
    // dismissal). A later turn that landed before this scan still pins.
    // Values <= 1 are a legacy boolean sentinel that cannot tell turns apart.
    if (deferredAt) {
      consumeReviewDeferred(sessionId);
      recordReviewSeen(sessionId, seq);
      const turnTime = Number(meta.lastTurnEnd.time) || 0;
      if (deferredAt <= 1 || turnTime <= deferredAt) return false;
    } else {
      recordReviewSeen(sessionId, seq);
    }
    return markTaskReview(task, {
      sessionId,
      seq,
      at: meta.lastTurnEnd.time || Date.now(),
```

</details>

#### 缺口

- 实时和历史路由在繁忙会话中是否漏卡或重排未实测。
  **影响**：影响用户能否依赖待处理队列。
  **进一步探讨**：用两个已知有交付和一个失败轮次的会话核对卡片与实际结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 看板从本机什么资料构建任务，何时回退规则？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

Host 初始化 service，卸载时结束定时器和资源。Web 路由等待 connection、webServer，客户端注册主区、右栏和浮层。会话来源以 DSH home 的 sessions 为根，工作区映射读 storages/workspace.json，并按 inode、更新时间和大小复用。文件变更、缓存不足或若干状态变化时重新解析。遇到损坏文件保留上次可用元数据，与本轮新鲜信息区分。

符合范围的会话先做规则分析，再在 AI 开关、当前模型、冷却、低价值门和预算允许时构造摘要。模型路由缺失或预算用尽保留规则，超时与停止能延期，不能宣称全部会话都做了 AI 研判。使用不熟悉的实际日志格式前，要核对元数据、对应任务和手工编辑能否稳定延续。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:29-65](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/index.mjs#L29-L65)

服务寿命和实际路由挂载。

<details>
<summary>查看原文（37行）</summary>

```text
export function apply(ctx) {
  const service = createKanbanService({ ctx });

  ctx.effect(() => {
    const dispose = service.start?.();
    return () => {
      dispose?.();
      service.stop();
    };
  }, "super-kanban: service lifetime");

  ctx.inject(["connection", "webServer"], (webCtx) => {
    webCtx.effect(
      () =>
        webCtx.webServer.register({
          kind: "prefix",
          path: API_PREFIX,
          handler: async (req, res) => {
            // Owner-only: this board reads the user's private session logs.
            const admission = ownerAdmission(webCtx.connection, req);
            if (!admission.ok) {
              if (admission.error) {
                ctx.logger?.warn?.(`[super-kanban] admission failed: ${String(admission.error?.message || admission.error)}`);
              }
              sendJson(res, admission.status, { ok: false, error: "unauthorized" });
              return;
            }
            let url;
            try {
              url = new URL(req.url || "/", "http://localhost");
            } catch {
              sendJson(res, 400, { ok: false, error: "invalid-input", message: "invalid request URL" });
              return;
            }
            const route = url.pathname.slice(API_PREFIX.length) || "/";
            try {
              await service.handle(req, res, { route, url, method: req.method || "GET" });
```

</details>

**依据 2 · 源码核查**：[server/sessions.mjs:520-546](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/sessions.mjs#L520-L546)

本地会话根与工作区 registry 缓存。

<details>
<summary>查看原文（27行）</summary>

```text
export function createSessionSource({ dshHome } = {}) {
  if (!dshHome) throw new Error("createSessionSource requires dshHome");
  const home = dshHome;
  const sessionsRoot = path.join(home, "sessions");
  /**
   * file path -> { sigKey, actualSig, parsed }. Map iteration order is the LRU
   * order: reading an entry re-inserts it at the end, writing evicts the front.
   * Entries are only stored for successfully parsed logs.
   */
  const parsedCache = new Map();
  let workspaceRegistryCache = null;

  function readWorkspaceRegistry() {
    const file = path.join(home, "storages", "workspace.json");
    const diagnostics = [];
    let registry = { workspaces: [], sessionWorkspace: new Map() };
    try {
      const stat = fs.statSync(file);
      const signature = `${stat.ino}:${stat.mtimeMs}:${stat.size}`;
      if (workspaceRegistryCache?.signature === signature) return workspaceRegistryCache.value;
      const raw = JSON.parse(fs.readFileSync(file, "utf8"));
      if (!raw || typeof raw !== "object" || Array.isArray(raw) || !raw.tables || typeof raw.tables !== "object") {
        diagnostics.push({ kind: "workspace-registry", message: "workspace.json has an unexpected shape" });
        return { workspaces: [], sessionWorkspace: new Map(), diagnostics };
      }
      const table = raw.tables.workspaces && typeof raw.tables.workspaces === "object" ? raw.tables.workspaces : {};
      const order = Array.isArray(raw.global?.workspaceIds) ? new Set(raw.global.workspaceIds) : Object.keys(table);
```

</details>

**依据 3 · 源码核查**：[server/service.mjs:1718-1745](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/service.mjs#L1718-L1745)

变更、坏文件以及回放条件。

<details>
<summary>查看原文（28行）</summary>

```text
        const preEligible = meta ? isEligibleForAutoTask(meta, cutoff) : false;
        // "aiMissing" re-parses a session that never got an AI verdict. Only
        // worth the parse when an AI service exists; otherwise every incremental
        // scan would re-parse every unchanged session forever.
        const aiMissing = state.settings.aiEnabled && analyzerHasService() && !cached?.meta?.aiAt;
        const forceMainParse =
          preEligible && (mode === "full" || changed || !findTaskBySession(discovered.id) || aiMissing ||
            typeof meta.hasOpenTurn !== "boolean" || source.sessionLiveness(meta) !== meta.isLive);
        // Earlier caches preferred the projcache placeholder over a later
        // session/title event. Re-parse once so existing cards can pick up the
        // real title without waiting for a file change or a full scan.
        // An unchanged file that already failed to parse must not be retried
        // every incremental scan (the error path stores the current signature
        // for that reason). A later file change still retries via `changed`.
        const titleRevStale =
          Boolean(cached?.meta) && cached.meta.titleRev !== 2 && !cached.meta.parseError;
        if (changed || cached?.unparsed || forceMainParse || titleRevStale) {
          try {
            const result = parseDiscovered(discovered);
            parsed = result.parsed;
            const entry = cacheEntryFor(parsed, discovered);
            meta = entry.meta;
            cache.sessions[discovered.id] = entry;
          } catch (error) {
            const previous = cache.sessions[discovered.id];
            const message = String(error?.message || error);
            // Keep the last good metadata (the board stays usable) but store the
            // CURRENT signature: an unchanged corrupt file is then not re-read on
```

</details>

**依据 4 · 源码核查**：[server/service.mjs:1763-1804](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/service.mjs#L1763-L1804)

规则先跑，按资格形成 AI 候选及摘要。

<details>
<summary>查看原文（42行）</summary>

```text
        sessionsById.set(discovered.id, meta);
        if (parsed && eligible) {
          parsed.evidence = source.collectEvidence(parsed);
          const workspaceTitle = meta.workspaceTitle;
          const rules = analyzeSessionRules(parsed, {
            workspaceTitle,
            workspacePath: meta.workspacePath,
            maxTasks: state.settings.maxTasksPerSession || 3,
          });
          const context = buildV2Context(parsed, meta, workspaceTitle);
          context.attention = rules.tasks[0]?.attention;
          context.completionBasis = rules.tasks[0]?.completionBasis;
          // v2 token gate: low-value sessions and unchanged verdict inputs stay rules-only.
          const lowValue = isLowValueForAi(meta);
          if (lowValue) lowValueSkipped += 1;
          // A session whose last analysis failed cools down before it burns
          // another budget unit (upstream outages must not drain the daily budget).
          const failureCooling =
            cachedMeta?.aiErrorAt && Date.now() - (Date.parse(cachedMeta.aiErrorAt) || 0) < AI_ERROR_COOLDOWN_MS;
          const aiDue = state.settings.aiEnabled && !lowValue && !failureCooling && shouldRunAi(meta, cachedMeta);
          let digest = "";
          let digestBytes = 0;
          if (aiDue) {
            digest = source.buildDigest(parsed, {
              workspaceTitle,
              existingTasks: promptCandidateTasks(meta),
              baselineSeq: cachedMeta?.aiLastSeq || 0,
            });
            digestBytes = Buffer.byteLength(digest, "utf8");
            scanDigestBytes.push(digestBytes);
          }
          analysisJobs.push({
            meta,
            changed,
            firstAnalysis: !cachedMeta?.aiAt,
            digest,
            digestBytes,
            rules,
            context,
            lowValue,
            needsAi: aiDue,
          });
```

</details>

**依据 5 · 源码核查**：[server/service.mjs:1831-1867](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/service.mjs#L1831-L1867)

路由、预算与时间门控。

<details>
<summary>查看原文（37行）</summary>

```text
        const route = resolveAiRoute();
        if (!route.ok) {
          aiRouteMessage = route.message;
          state.scan.aiBudget = 0;
          state.scan.aiPending = aiJobs.length;
          logWarn(`[super-kanban] AI route unavailable (${route.reason}); rules only this scan`);
        } else {
          const perScanLimit = perScanAiLimit();
          // The contract defines the scan budget as min(due sessions, per-scan
          // limit, daily remaining); capping at the due count also keeps the
          // reported budget/progress meaningful (e.g. 1/2, not 1/150).
          const scanBudget = Math.max(0, Math.min(perScanLimit, dailyRemaining, aiJobs.length));
          const dailyCapped = dailyRemaining <= perScanLimit;
          state.scan.aiBudget = scanBudget;
          analyzer.resetBudget(scanBudget);
          if (scanBudget <= 0) {
            aiDeferredReason = "daily";
            aiBudgetExhausted = true;
            state.scan.aiPending = aiJobs.length;
            for (const job of aiJobs) job.llmBudgetExceeded = true;
            state.scan.message = t("今日 AI 预算已用完（{0}/{1}），本次仅规则分析", [state.usage.budgetUsed, state.settings.dailyAiCallLimit]);
            logWarn("[super-kanban] daily AI budget exhausted; rules only this scan");
          } else {
            state.scan.message = t("AI 研判 {0} 个会话（预算 {1}）…", [aiJobs.length, scanBudget]);
            broadcastScan(true);
            // Wall-clock guard for the whole AI stage: a slow/retrying provider
            // must never keep the scan mutex for hours.
            const aiDeadline = Date.now() + aiScanMaxMsValue;
            const phaseTimeout = AbortSignal.timeout(Math.max(1, Math.ceil(aiScanMaxMsValue)));
            const phaseSignal = AbortSignal.any([scanAbort.signal, phaseTimeout]);
            for (let index = 0; index < aiJobs.length; index += MAX_AI_CONCURRENCY) {
              if (scanCancel || stopped || !state.settings.aiEnabled) break;
              if (Date.now() >= aiDeadline) {
                aiDeferredReason = "time";
                for (const job of aiJobs.slice(index)) job.llmDeferred = true;
                logWarn("[super-kanban] AI stage wall-clock limit reached; remaining sessions deferred");
                break;
```

</details>

#### 缺口

- 针对不同宿主版本的日志编码和历史回放准确率未知。
  **影响**：旧任务映射或长会话可能缺部分来源。
  **进一步探讨**：在无敏感的副本中用人工标注的当前、旧格式及故损日志扫一轮。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 私有会话和模型调用预算有哪些直接边界？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

API 拿不到 connection.admit、认证返回格式不明、异常或非 owner 均拒绝，因此公开可用取决于宿主连接认证正确。访问边界和分析数据去向是两件事。新状态默认 autoScan 与 aiEnabled 都开；启动 3 秒后若仍空闲且已开启可触发扫描。AI 路由获选后，摘要和既有任务通过宿主 LLM 接口传入模型；若模型是远端，实际可见范围应以该配置及服务边界为准。

调用次数上限是分析单位，analyzer 内部发流、失败会重试，calls 与 attempts 分开。每日预算既不代表真实模型请求数也不给货币上限。模型不通时规则仍可生成可核对的内容，但规则和模型可能产生不同卡片。用户先用只含非敏感内容的 DSH home；如果启用连接无法说明摘要会发送给谁，保持禁用或改用纯规则、手工记录。

#### 证据与依据

**依据 1 · 源码核查**：[server/auth.mjs:24-39](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/auth.mjs#L24-L39)

非 owner 与异常 fail closed。

<details>
<summary>查看原文（16行）</summary>

```text
export function ownerAdmission(connection, req) {
  try {
    if (!connection || typeof connection.admit !== "function") return { ok: false, status: 403 };
    const admission = connection.admit(req);
    if (!admission || typeof admission !== "object") return { ok: false, status: 403 };
    if ("rejection" in admission) {
      const status = Number(admission.rejection);
      return { ok: false, status: Number.isInteger(status) && status >= 400 && status <= 599 ? status : 403 };
    }
    const principal = admission.peer?.principal;
    if (principal?.kind === "owner") return { ok: true };
    return { ok: false, status: 403 };
  } catch (error) {
    // An admission failure must never become an allow or an unhandled rejection.
    return { ok: false, status: 403, error };
  }
```

</details>

**依据 2 · 源码核查**：[server/store.mjs:126-148](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/store.mjs#L126-L148)

初始配置开启定时和 AI，并设置分析单位。

<details>
<summary>查看原文（23行）</summary>

```text
export const DEFAULT_SETTINGS = {
  autoScan: true,
  scanIntervalSeconds: 120,
  aiEnabled: true,
  /**
   * @deprecated v0.5 — the model is resolved from the DSH native LLM service
   * (`settings.aiProvider/aiModel` or the DSH default). Kept only so old states
   * and third-party clients keep loading; it is normalized but never used for
   * analysis. Slated for removal in v0.6.
   */
  model: "deepseek-flash",
  initialDays: 30,
  maxTasksPerSession: 3,
  excludeWorkspaces: [],
  lastScanAt: null,
  // v2 AI budget
  maxAiCallsPerScan: 40,
  dailyAiCallLimit: 150,
  // v3 model selection: "" = follow the DSH default model; set together.
  aiProvider: "",
  aiModel: "",
  /** "auto" = min(due sessions, daily remaining); "fixed" = maxAiCallsPerScan. */
  aiBudgetMode: "auto",
```

</details>

**依据 3 · 源码核查**：[server/service.mjs:3793-3801](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/service.mjs#L3793-L3801)

启动后自动扫描的具体时序。

```text
    // First scan should happen within ~8s of plugin boot.
    startupTimer = setTimeout(() => {
      startupTimer = null;
      if (stopped || scanPromise || aiBusy) return;
      if (state.settings.autoScan) startScan("incremental");
    }, 3000);
    if (typeof startupTimer.unref === "function") startupTimer.unref();
    autoTimer = setInterval(maybeAutoScan, 5000);
    if (typeof autoTimer.unref === "function") autoTimer.unref();
```

**依据 4 · 源码核查**：[server/analyzer-llm.mjs:174-214](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/analyzer-llm.mjs#L174-L214)

向宿主模型提交摘要以及一次分析中的内部尝试。

<details>
<summary>查看原文（41行）</summary>

```text
  async function analyze({ provider, model, digest, existingTasks, signal } = {}) {
    if (signal?.aborted) return { ok: false, error: "aborted", code: "aborted" };
    const llm = llmOf(ctx);
    if (!llm) return { ok: false, error: "llm service unavailable", code: "llm-unavailable" };
    if (!provider || !model) return { ok: false, error: "provider and model are required", code: "no-route" };
    if (budget.calls >= budget.limit || !reserveUnit()) return { ok: false, error: "scan-call-budget-exhausted", code: "budget" };

    const messages = [{ role: "user", content: [{ type: "text", text: buildUserText(digest, existingTasks) }] }];
    const correctionMessage = {
      role: "user",
      content: [
        {
          type: "text",
          text: t("注意：你上一次的输出不是合法 JSON（例如把 evidence 的 seq 写成了 \"seq=917\"）。请严格输出一个完整闭合的 JSON 对象；evidence 必须是 {\"seq\": 数字, \"kind\": \"...\", \"quote\": \"...\"}。不要输出 markdown 代码块。"),
        },
      ],
    };
    let lastExtractFailed = false;
    let lastError = null;
    budget.calls += 1;
    try {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const attemptMessages = lastExtractFailed ? [...messages, correctionMessage] : messages;
        const outcome = await streamOnce({ llm, provider, model, system: SYSTEM_PROMPT(), messages: attemptMessages, signal });
        budget.attempts += 1;
        if (!outcome.ok) {
          lastError = { code: outcome.code, error: outcome.message || outcome.code };
          if (outcome.code === "aborted") return { ok: false, error: "aborted", code: "aborted" };
          if (outcome.code === "truncated" || outcome.code === "tool-calls") break;
          const retryable = RETRYABLE_CODES.has(outcome.code);
          if (retryable && attempt < MAX_ATTEMPTS - 1) {
            const delay = Number(outcome.retryAfterMs) > 0 ? Math.min(Number(outcome.retryAfterMs), MAX_RETRY_DELAY_MS) : 800 * (attempt + 1);
            try {
              await delayFor(delay, undefined, { signal });
            } catch (error) {
              if (error?.name !== "AbortError") throw error;
              return { ok: false, error: "aborted", code: "aborted" };
            }
            continue;
          }
          break;
```

</details>

#### 缺口

- 可靠隔离、真实供应商数据处理、费用与上游重试计数未验证。
  **影响**：在有既存日志的 profile 中开始扫描前要先核对内容与模型范围。
  **进一步探讨**：用隔离 home、模拟 LLM 和 owner/non-owner 请求核对摘要、拒绝以及真实调用次数。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样检验待验收板能减少漏看，同时不增加错验和模型成本？

**研究主题**：新假设与验证、采用判断、效果与总成本

#### 完整回答

适合并行会话较多且能隔离数据的用户观察。先用不含私人资料的新 DSH home，准备若干任务，包括轮次失败、重复转录、重复扫描和隐私排除目录。主比较用规则模式，把原生会话列表和看板交叉分配给同一位验收者。核对合格件必须出现真实交付、可回跳会话并经用户确认；失败的轮次单独记录，使用空任务或重新弹卡都算误报。计入首次设置、重扫、确认、再次返工与退出成本。

假设展示会话到任务的关系和实时尾事件可减少漏查。若只让操作者更快同意但错误通过上升，或规则模式下重复卡需要重建人工台账，则不支持。模型作用只在独立授权后对照启用，按实际流请求与模型账单测量。到达标签/文件关联错误、owner 检查不符合环境或费用无法复核就停用并回到原会话。

#### 证据与依据

**依据 1 · 源码核查**：[server/service.mjs:1235-1278](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/service.mjs#L1235-L1278)

序号和撤回路径可定义重复提醒的对照。

<details>
<summary>查看原文（44行）</summary>

```text
  /**
   * Scan-side turn-end bookkeeping. The first sighting of an old session only
   * seeds the ledger; a later turn-end on the same session pins a review card.
   */
  function markScanReview(meta) {
    const sessionId = meta?.id;
    const seq = Number(meta?.lastTurnEnd?.seq) || 0;
    if (!sessionId || !seq) return false;
    const firstSighting = !state.reviewSeen[sessionId];
    const seen = Number(state.reviewSeen[sessionId]) || 0;
    const fresh = Date.now() - (Number(meta.lastTurnEnd.time) || 0) <= REVIEW_FRESH_MS;
    const deferredAt = Number(state.reviewDeferred[sessionId]) || 0;
    // Observations that would not pin anyway (seed-only or already in the
    // ledger) must keep the deferred marker: an in-flight or early scan may
    // still be looking at a turn older than the one the user just dismissed.
    if (firstSighting ? !fresh : seen >= seq) {
      recordReviewSeen(sessionId, seq);
      return false;
    }
    if (meta.origin === "subagent" || Number(meta.delegationDepth) > 0) {
      recordReviewSeen(sessionId, seq);
      return false;
    }
    const task = primaryTaskForSession(sessionId);
    if (!task) {
      recordReviewSeen(sessionId, seq);
      return false;
    }
    // This observation would pin a card. Consume a deferred dismissal only
    // here, and only skip when it is the same turn (ended at or before the
    // dismissal). A later turn that landed before this scan still pins.
    // Values <= 1 are a legacy boolean sentinel that cannot tell turns apart.
    if (deferredAt) {
      consumeReviewDeferred(sessionId);
      recordReviewSeen(sessionId, seq);
      const turnTime = Number(meta.lastTurnEnd.time) || 0;
      if (deferredAt <= 1 || turnTime <= deferredAt) return false;
    } else {
      recordReviewSeen(sessionId, seq);
    }
    return markTaskReview(task, {
      sessionId,
      seq,
      at: meta.lastTurnEnd.time || Date.now(),
```

</details>

**依据 2 · 源码核查**：[server/analyzer-llm.mjs:174-200](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/server/analyzer-llm.mjs#L174-L200)

支持区分分析单元与实际请求数。

<details>
<summary>查看原文（27行）</summary>

```text
  async function analyze({ provider, model, digest, existingTasks, signal } = {}) {
    if (signal?.aborted) return { ok: false, error: "aborted", code: "aborted" };
    const llm = llmOf(ctx);
    if (!llm) return { ok: false, error: "llm service unavailable", code: "llm-unavailable" };
    if (!provider || !model) return { ok: false, error: "provider and model are required", code: "no-route" };
    if (budget.calls >= budget.limit || !reserveUnit()) return { ok: false, error: "scan-call-budget-exhausted", code: "budget" };

    const messages = [{ role: "user", content: [{ type: "text", text: buildUserText(digest, existingTasks) }] }];
    const correctionMessage = {
      role: "user",
      content: [
        {
          type: "text",
          text: t("注意：你上一次的输出不是合法 JSON（例如把 evidence 的 seq 写成了 \"seq=917\"）。请严格输出一个完整闭合的 JSON 对象；evidence 必须是 {\"seq\": 数字, \"kind\": \"...\", \"quote\": \"...\"}。不要输出 markdown 代码块。"),
        },
      ],
    };
    let lastExtractFailed = false;
    let lastError = null;
    budget.calls += 1;
    try {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const attemptMessages = lastExtractFailed ? [...messages, correctionMessage] : messages;
        const outcome = await streamOnce({ llm, provider, model, system: SYSTEM_PROMPT(), messages: attemptMessages, signal });
        budget.attempts += 1;
        if (!outcome.ok) {
          lastError = { code: outcome.code, error: outcome.message || outcome.code };
```

</details>

**依据 3 · 作者声明**：[README.md:25-39](https://github.com/topmindspace/dsh-super-kanban/blob/14811bf558d089ae827b27b47b69bc294a68fddf/README.md#L25-L39)

作者工作流要求人确认交付。

<details>
<summary>查看原文（15行）</summary>

```text
### 第一次使用

1. 从左侧栏打开 **任务看板**。在会话里可点右上角的看板图标打开右侧看板，或点常驻的悬浮入口展开悬浮看板。
2. 在设置中确认活跃周期，然后点击 **扫描**。默认扫描最近 30 天有活动的会话，结果可在扫描按钮提示或「维护」中查看。
3. 在 **待处理** 打开需要介入的会话，或进入任务详情查看验收条件和主交付物。
4. 核对交付物后点 **确认验收**。还需要补做时，点 **继续此任务**，检查草稿并放入关联会话或新会话，由你发送。

## 功能特色

### 核心概念

- **工作区** · 对应 DSH 的一个工作目录，自动出现在看板里。
- **项目** · 你自建的分组，可以把多个工作区的任务归到一起，带备注、到期日和归档。
- **任务** · 一件可验收的工作。属于一个工作区，可选归入一个项目，可关联多条会话，其中一条为主会话。
- **会话** · DSH 里实际执行工作的对话。看板从会话提取进展、阻塞和交付物，审批和发送仍在会话里完成。
```

</details>

#### 缺口

- 真实漏查率、误验数和同条件人时/账单均未知。
  **影响**：不能据源码直接建议迁移。
  **进一步探讨**：给回放任务配人工标准，记录错误通过、漏看及全流程人时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
