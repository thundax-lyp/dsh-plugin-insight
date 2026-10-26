# dsh-trend-radar

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[238ccd9](https://github.com/863683348/dsh-trend-radar/tree/238ccd97948617fe8dd92f9ee5c5c05360592026)

<!-- BEGIN META -->
[![npm 30d 111](https://img.shields.io/static/v1?label=npm+30d&message=111&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-trend-radar) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-trend-radar)
<!-- END META -->

> **实现功能**：按需采集 GitHub dsh-plugin topic/awesome 快照并生成趋势报告、关键词雷达和实验性 Web 面板。

> **核心亮点**：把 GitHub/awesome 快照历史转成可查询趋势与 session 面板起点。详见[Q01](#research-q01)。

> **风险与缺陷**：数据目录不存在且首次直接 collect 时，先读后建目录可使快照受 ENOENT 阻断；top100 更新排序不是全生态，详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 三个工具和面板实际如何工作？](#detail-section-11)
  - [Q02 · 首次使用能否生成快照？](#detail-section-12)
  - [Q03 · 榜单/类别热度能否反映整个生态？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想观察 DSH 插件新增、stars 变化和 awesome 收录趋势。

人工定时抓 GitHub 搜索并保存快照；插件提供按需读写与差分。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 快照 | 历史数据 | 首轮空目录失败 |
| 报告/雷达 | 差分分析 | top100/重复提醒 |
| Web 投影 | 只读面板 | 未运行验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| GitHub API 网络与配额 | 新快照必需 | 检索 topic 与 awesome | 只能读旧数据 |
| 可写 dataDir | 历史/首轮必需 | JSONL 快照与 watch 状态 | 新目录首轮会 ENOENT |
| DSH Web projection | 仅面板必需 | 可视化最近快照 | 工具文字仍可能可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 初始化 | 建空 dataDir | 首轮可采集 |
| 快照 | 间隔采两次 | 差分可查 |
| 核对 | 对照 GitHub/awesome | 口径清晰 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | GitHub API 网络及可写 JSONL dataDir；API 配额/存储价格未知 | 先建数据目录，配置 awesome 源并记录榜单口径；耗时未知 | 新目录首轮 readSnapshots 可 ENOENT，需先处理 |
| 持续使用 | 显式快照请求受 API 配额影响，JSONL 随批次增长；数值未知 | 定期调用并核新增/移除、类别映射和前100抽样；工时未知 | 没有后台自动采集或提醒 |
| 失败恢复 | 限流/网络失败与重复采样可能追加请求和磁盘备份；成本未知 | 修复目录/回填快照、去重 watch 提醒、纠正误判；耗时未知 | 排序抖动和重复通知影响未做真实时间序列对照 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 快照 | 按需采集 | 首轮失败 |
| 报告 | 差分/排名 | 生态覆盖 |
| 面板 | session projection | Web 兼容 |

> **思考**：数据目录不存在且首次直接 collect 时，先读后建目录可使快照受 ENOENT 阻断；top100 更新排序不是全生态，详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 GitHub/awesome 快照历史转成可查询趋势与 session 面板起点。详见[Q01](#research-q01)。

把 GitHub/awesome 快照历史转成可查询趋势与 session 面板起点。详见[Q01](#research-q01)。

Host 三工具读写 JSONL/订阅文件；GitHub API 查询 topic top100 与 awesome tree；projection 推给实验客户端。

<a id="detail-section-5"></a>

### 1.4 主要限制

数据目录不存在且首次直接 collect 时，先读后建目录可使快照受 ENOENT 阻断；top100 更新排序不是全生态，详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先隔离建立空目录并复核首轮成功，再核查报告采样分母与类别映射；勿把 top100 榜当全生态。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持按需趋势分析；仅在数据目录不存在且首次直接调用 collect/快照、先 readSnapshots 后 appendSnapshot 的路径下会受 ENOENT 阻断。已有目录或先写 watch 时未必触发；未执行复现。top100/类别默认值限制报告口径。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、lib/index.js、lib/github.js、lib/trends.js、lib/storage.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交 README、Host、GitHub 采集、趋势/存储；未调用外部 API、目标插件或 Web。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。 父侧已接受条件性目录故障判断与 observe 建议；未执行目标复现。
- 下一步：空目录首次调用、top100 排序波动、类别映射与重复 watch check 的隔离测试；Web 面板另验。

**分析版本**

- **仓库**：[863683348/dsh-trend-radar](https://github.com/863683348/dsh-trend-radar)
- **版本号**：0.2.1（[固定提交 238ccd9](https://github.com/863683348/dsh-trend-radar/tree/238ccd97948617fe8dd92f9ee5c5c05360592026)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

修复空目录初始化、稳定 cohort/分页及类别映射和 watch 游标，才能形成可靠趋势雷达；待验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

空目录首次调用、top100 排序波动、类别映射与重复 watch check 的隔离测试；Web 面板另验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 148 | — | — | 1532 |
| .js | source | 5 | 719 | 565 | 114 | — |
| .mjs | source | 1 | 19 | 14 | 4 | — |
| .mjs | test | 1 | 149 | 131 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-trend-radar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-trend-radar/issues?q=is%3Aissue+created%3A2026-09-22T06%3A58%3A00.182Z..2026-10-22T06%3A58%3A00.182Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-trend-radar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A58%3A00.182Z..2026-10-22T06%3A58%3A00.182Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实首轮快照是否可用、趋势口径、订阅是否自动推送及 experimental 面板边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 三个工具和面板实际如何工作？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

插件注册 trend_snapshot、trend_report、trend_watch；快照工具按 staleHours 窗口在显式调用时采 GitHub topic 搜索与 awesome 列表，写 JSONL；报告基于本地历史计算 star 变化和新收录，watch 持久化关键词并在 check 时比较最新两次快照。session projection 可把最近一次快照/报告映射到实验性 Web 面板，并在新 turn 清空。README 开头的“每小时快照”是新鲜度阈值，并无后台定时器；watch 也不是持续自动通知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-16](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/README.md#L1-L16)

作者列三工具和趋势目标。

<details>
<summary>查看原文（16行）</summary>

```text
# dsh-trend-radar — 生态行情面板 (Ecosystem trend dashboard)

**别人是目录，你是仪表盘。** 每小时对 `dsh-plugin` topic 与 awesome-dsh-plugin 收录列表做一次快照（本地 JSONL 历史），然后从**时间维度**分析趋势：周报、新插件雷达、star 增速榜、类别热度、收录覆盖率 —— 并带一个 experimental 的 **Web 面板**（增长曲线、类别热度、Top 榜单）直接叠在会话输入框上方。

## 为什么需要它

- 现有市场/目录都是"当前时刻"的静态视图；**趋势是空白**——没有人在看"这周新增了什么、谁在涨、哪个类别在热"。
- 快照只占本地磁盘（每条约几十 KB JSONL），分析全部本地完成。

## 工具

| 工具 | 作用 |
| --- | --- |
| `trend_snapshot` | 立即采集一次快照（GitHub `topic:dsh-plugin` 搜索 + awesome 收录树），追加到本地历史；窗口期内自动跳过（`force: true` 强制） |
| `trend_report` | 分析历史 → 周报：新增插件、star 增速榜、类别热度、awesome 覆盖率；支持 `days` 窗口与 `keywords` 过滤 |
| `trend_watch` | 关键词订阅雷达：`add`/`remove`/`list`/`check`——新品命中或 star 突增（≥`surgeStars`）即报 |
```

</details>

**依据 2 · 作者声明**：[README.md:65-70](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/README.md#L65-L70)

FAQ 明言无后台 timer。

```text
## FAQ

- **How often should I snapshot?** The `trend_snapshot` tool auto-skips inside the `staleHours` window (default 1h). There is no background timer; collection happens when a tool runs and the history is stale.
- **Rate limits?** Anonymous GitHub search is 10 req/min / 60 req/h — plenty for hourly snapshots. Set `githubTokenEnv` (e.g. `GH_T`) to a token for 5000 req/h.
- **Where is the data?** `dataDir` (default `.dsh/trends`): append-only `snapshots-YYYY-MM-DD.jsonl` plus `watch.json`. Delete files to reset history.
- **The Web UI dashboard?** On the roadmap — same experimental client-panel path as dsh-plugin-focus.
```

**依据 3 · 源码核查**：[lib/index.js:74-124](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/lib/index.js#L74-L124)

快照只在工具执行时采集。

<details>
<summary>查看原文（51行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "trend_snapshot",
    description: "Collect a fresh ecosystem snapshot of the dsh-plugin topic (GitHub search, top 100 repos) plus the awesome-dsh-plugin listing, append it to the local trend history, and report what changed since the previous snapshot. Run when the user asks for current ecosystem state or when trend data may be stale.",
    parameters: {
      force: { type: "boolean", description: "Collect even when a fresh snapshot already exists (default false — auto-skip within the stale window)." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ts: { type: "integer", required: true },
          total: { type: "integer", required: true },
          awesome: { type: "integer", required: true },
          added: { type: "array", required: true, items: { type: "string" } },
          removed: { type: "array", required: true, items: { type: "string" } },
          text: { type: "string", required: true },
        },
      },
      render: (_args, value) => [{ type: "text", text: value.text }],
    },
    execute: async (args, exec) => {
      const dir = await dirFor(exec);
      const history = readSnapshots(dir);
      const latest = history[history.length - 1];
      const fresh = !args.force && latest !== undefined && Date.now() - latest.ts < staleHours * 3600_000;
      let added = [];
      let removed = [];
      let total = 0;
      let awesomeCount = 0;
      let ts = latest?.ts ?? 0;
      let text;
      if (fresh) {
        total = (latest.repos ?? []).length;
        awesomeCount = (latest.awesome ?? []).length;
        text = "Snapshot is fresh (" + new Date(latest.ts).toISOString() + ", " + total + " repos) — use force:true to re-collect.";
      } else {
        const snap = await collectSnapshot(token);
        appendSnapshot(dir, snap);
        history.push(snap);
        const delta = history.length >= 2 ? deltaBetween(history[history.length - 2], snap) : { added: snap.repos, removed: [] };
        added = delta.added.map((r) => r.name);
        removed = delta.removed.map((r) => r.name);
        total = snap.repos.length;
        awesomeCount = snap.awesome.length;
        ts = snap.ts;
        text = "Collected snapshot " + new Date(snap.ts).toISOString() + ": " + total + " repos (" + added.length + " new), " + awesomeCount + " listed on awesome-dsh-plugin.";
      }
      await emitDashboard(exec, 7);
      return { ts, total, awesome: awesomeCount, added, removed, text };
    },
```

</details>

**依据 4 · 源码核查**：[lib/index.js:179-229](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/lib/index.js#L179-L229)

watch list/add/remove/check。

<details>
<summary>查看原文（51行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "trend_watch",
    description: "Manage keyword subscriptions and check them against the newest snapshot delta: new plugins matching a keyword, and star surges (>= configurable threshold). Use to alert on new plugins or rising stars in a specific area (e.g. wechat, notification, security).",
    parameters: {
      action: { type: "string", required: true, enum: ["list", "add", "remove", "check"], description: "list subscriptions, add a keyword, remove a keyword, or check the latest delta against all subscriptions." },
      keyword: { type: "string", description: "Keyword for add/remove (lowercased, trimmed)." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          keywords: { type: "array", required: true, items: { type: "string" } },
          matches: { type: "array", required: true, items: { type: "object", additionalProperties: false, properties: { name: { type: "string", required: true }, keyword: { type: "string", required: true }, stars: { type: "integer", required: true }, created: { oneOf: [{ type: "integer" }, { type: "null" }], required: true }, desc: { type: "string", required: true } } } },
          text: { type: "string", required: true },
        },
      },
      render: (_args, value) => [{ type: "text", text: value.text }],
    },
    execute: async (args, exec) => {
      const dir = await dirFor(exec);
      let keywords = readWatch(dir);
      const action = args.action;
      if (action === "add" || action === "remove") {
        const k = normalizeKeyword(args.keyword ?? "");
        if (k.length === 0) throw new Error("trend_watch: keyword required for " + action);
        if (action === "add" && !keywords.includes(k)) keywords.push(k);
        if (action === "remove") keywords = keywords.filter((x) => x !== k);
        writeWatch(dir, keywords);
        return { keywords, matches: [], text: "Watch keywords (" + action + " " + (args.keyword ?? "") + "): " + keywords.join(", ") };
      }
      const history = readSnapshots(dir);
      let matches = [];
      let text;
      if (action === "list") {
        text = "Watch keywords: " + (keywords.length === 0 ? "(none)" : keywords.join(", "));
      } else {
        if (history.length < 2) {
          text = "Need at least 2 snapshots to check — run trend_snapshot first.";
        } else {
          const delta = deltaBetween(history[history.length - 2], history[history.length - 1]);
          const newMatches = filterByKeywords(delta.added, keywords);
          const surgeMatches = filterByKeywords(delta.starDeltas.filter((d) => d.delta >= surgeStars).map((d) => ({ name: d.name, desc: "+" + d.delta + " stars", topics: [] })), keywords);
          matches = [...newMatches, ...surgeMatches];
          text = "Checked " + keywords.length + " keyword" + (keywords.length === 1 ? "" : "s") + ": " + matches.length + " match" + (matches.length === 1 ? "" : "es") + " in the latest delta.";
        }
      }
      return { keywords, matches, text };
    },
    presentCall: (args) => ({ card: "generic", title: "Trend watch: " + (args.action ?? ""), kind: "other", rawInput: args }),
  }));
```

</details>

**依据 5 · 源码核查**：[lib/index.js:231-259](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/lib/index.js#L231-L259)

session projection 面板。

<details>
<summary>查看原文（29行）</summary>

```text
  // Session projection: the latest dashboard payload, for the web panel
  // (useProjection('trendBoard')). Emitted by trend_report / trend_snapshot;
  // reset at each turn start so stale snapshots never linger.
  ctx.inject(["sessionProjections"], (projectionCtx) => {
    projectionCtx.sessionProjections.register({
      key: "trendBoard",
      schema: zod.union([
        zod.object({
          ts: zod.number(),
          snapshots: zod.number(),
          total: zod.number(),
          awesomeCoverage: zod.number(),
          series: zod.array(zod.object({ ts: zod.number(), count: zod.number() })),
          newPlugins: zod.array(zod.object({ name: zod.string(), stars: zod.number(), desc: zod.string(), category: zod.string() })),
          starGainers: zod.array(zod.object({ name: zod.string(), delta: zod.number(), stars: zod.number() })),
          categoryHeat: zod.array(zod.object({ category: zod.string(), count: zod.number() })),
        }),
        zod.null(),
      ]),
      init: () => null,
      apply: (state, event) => {
        if (event.type === "trend/update") return event.data;
        if (event.type === "turn/start") return null;
        return state;
      },
      view: (state) => state,
      stateVersion: 1,
    });
  });
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 首次使用能否生成快照？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

dirFor 只解析路径；在数据目录不存在、首次直接调用 trend_snapshot 的 collect 路径时，先执行 readSnapshots(dir) 的 readdirSync，appendSnapshot 的 mkdirSync 还未运行，因此可在外部请求前遭 ENOENT 阻断。若目录已存在，或先通过 watch 写入目录，此条件未必成立；这是固定源码的条件性判断，未执行首轮复现。修复可在 readSnapshots 处理 ENOENT 或在首次读前初始化目录。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:95-113](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/lib/index.js#L95-L113)

快照先读历史再追加。

<details>
<summary>查看原文（19行）</summary>

```text
    execute: async (args, exec) => {
      const dir = await dirFor(exec);
      const history = readSnapshots(dir);
      const latest = history[history.length - 1];
      const fresh = !args.force && latest !== undefined && Date.now() - latest.ts < staleHours * 3600_000;
      let added = [];
      let removed = [];
      let total = 0;
      let awesomeCount = 0;
      let ts = latest?.ts ?? 0;
      let text;
      if (fresh) {
        total = (latest.repos ?? []).length;
        awesomeCount = (latest.awesome ?? []).length;
        text = "Snapshot is fresh (" + new Date(latest.ts).toISOString() + ", " + total + " repos) — use force:true to re-collect.";
      } else {
        const snap = await collectSnapshot(token);
        appendSnapshot(dir, snap);
        history.push(snap);
```

</details>

**依据 2 · 源码核查**：[lib/storage.js:9-32](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/lib/storage.js#L9-L32)

readSnapshots 直接 readdirSync，mkdir 只在 append。

<details>
<summary>查看原文（24行）</summary>

```text
/** Read all snapshots (oldest first), tolerating a missing/corrupt tail. */
export function readSnapshots(dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".jsonl")).sort();
  const out = [];
  for (const f of files) {
    for (const line of readFileSync(join(dir, f), "utf8").split(/\r?\n/)) {
      if (line.trim().length === 0) continue;
      try {
        out.push(JSON.parse(line));
      } catch {
        /* skip corrupt line */
      }
    }
  }
  return out;
}

/** Append one snapshot to today's jsonl file (created on demand). */
export function appendSnapshot(dir, snapshot) {
  mkdirSync(dir, { recursive: true });
  const date = new Date(snapshot.ts).toISOString().slice(0, 10);
  const file = join(dir, "snapshots-" + date + ".jsonl");
  writeFileSync(file, JSON.stringify(snapshot) + "\n", { flag: "a" });
  return file;
```

</details>

**依据 3 · 作者声明**：[README.md:24-29](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/README.md#L24-L29)

默认 dataDir。

```text
## 配置

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `dataDir` | `.dsh/trends` | 快照与订阅的存储目录（相对宿主 fs cwd） |
| `staleHours` | `1` | 快照新鲜度窗口（小时） |
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 榜单/类别热度能否反映整个生态？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断、新假设与验证

#### 完整回答

采集只取 GitHub search 按 updated 排序的前 100 个 topic:dsh-plugin 仓库；超过 100 或排序波动会让老仓库进出集合，deltaBetween 可把它们误当新增/移除，也遗漏不带 topic 的插件。computeReport 的 categoryByName 默认空映射，调用方未传类别表，故类别热度基本全落在 unlisted；awesomeCoverage 的分母是这 100 个搜索结果，而非全生态。watch check 只看最新两条快照，无已报告游标，多次 check 可重复同一提醒。采用时应明示采样口径、固定覆盖源与去重游标，且先确保数据目录存在。

成本分期：首次使用涉及GitHub API 网络及可写 JSONL dataDir；API 配额/存储价格未知，人工需先建数据目录，配置 awesome 源并记录榜单口径；耗时未知；持续使用涉及显式快照请求受 API 配额影响，JSONL 随批次增长；数值未知，人工需定期调用并核新增/移除、类别映射和前100抽样；工时未知；失败恢复涉及限流/网络失败与重复采样可能追加请求和磁盘备份；成本未知，人工需修复目录/回填快照、去重 watch 提醒、纠正误判；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：Q02 读目录在创建前执行，Q03 只取按 updated 排序的前100且 watch 无已报告游标；相对当前按需快照，先做空目录初始化、稳定分页/cohort 与通知游标，可提高首轮成功率和趋势解释稳定性。代价是分页 API 配额、状态迁移与持续维护，不等于覆盖全生态。最小证伪：用空 dataDir、超过100条的两批重排假数据和重复 check，要求首轮可写、恒定集合不伪造新增且相同事件只报一次；任一失败则假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[lib/github.js:32-37](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/lib/github.js#L32-L37)

top 100 updated 排序。

```text
/** Fetch the newest 100 `topic:dsh-plugin` repos. */
export async function fetchTopicRepos(token) {
  const url = BASE + "/search/repositories?q=topic:dsh-plugin&sort=updated&order=desc&per_page=100";
  const res = await fetch(url, { headers: ghHeaders(token) });
  if (!res.ok) throw new Error("GitHub search failed: HTTP " + res.status);
  return parseSearchItems(await res.json());
```

**依据 2 · 源码核查**：[lib/trends.js:11-23](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/lib/trends.js#L11-L23)

集合差与 star 变化。

<details>
<summary>查看原文（13行）</summary>

```text
/** Diff two consecutive snapshots. */
export function deltaBetween(prev, cur) {
  const prevStars = new Map((prev.repos ?? []).map((r) => [r.name, r.stars ?? 0]));
  const curRepos = new Map((cur.repos ?? []).map((r) => [r.name, r]));
  const added = (cur.repos ?? []).filter((r) => !prevStars.has(r.name));
  const removed = (prev.repos ?? []).filter((r) => !curRepos.has(r.name));
  const starDeltas = (cur.repos ?? [])
    .filter((r) => prevStars.has(r.name))
    .map((r) => ({ name: r.name, delta: (r.stars ?? 0) - (prevStars.get(r.name) ?? 0), stars: r.stars ?? 0 }))
    .filter((d) => d.delta !== 0)
    .sort((a, b) => b.delta - a.delta);
  return { added, removed, starDeltas };
}
```

</details>

**依据 3 · 源码核查**：[lib/trends.js:42-95](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/lib/trends.js#L42-L95)

类别默认 unlisted、覆盖率分母。

<details>
<summary>查看原文（54行）</summary>

```text
export function computeReport(snapshots, opts = {}) {
  const periodDays = opts.periodDays ?? 7;
  const now = opts.now ?? Date.now();
  const maxGainers = opts.maxGainers ?? 10;
  const maxNew = opts.maxNew ?? 10;
  const categoryByName = opts.categoryByName ?? {};
  if (snapshots.length === 0) {
    return { snapshots: 0, periodDays, newPlugins: [], starGainers: [], categoryHeat: [], awesomeCoverage: 0, total: 0 };
  }
  const latest = snapshots[snapshots.length - 1];
  const windowStart = cutoffMs(periodDays, now);
  const inWindow = snapshots.filter((s) => s.ts >= windowStart);
  const base = inWindow.length > 1 ? inWindow[0] : snapshots[0];
  const delta = deltaBetween(base, latest);

  const newPlugins = delta.added
    .filter((r) => (r.created ?? 0) >= windowStart || (r.created === undefined))
    .slice(0, maxNew)
    .map((r) => ({
      name: r.name,
      stars: r.stars ?? 0,
      created: r.created ?? null,
      desc: (r.desc ?? "").slice(0, 140),
      category: categoryOf(r, categoryByName),
    }));

  const starGainers = delta.starDeltas.slice(0, maxGainers).map((d) => ({
    name: d.name,
    delta: d.delta,
    stars: d.stars,
  }));

  const catCount = new Map();
  for (const r of delta.added) {
    const c = categoryOf(r, categoryByName);
    catCount.set(c, (catCount.get(c) ?? 0) + 1);
  }
  const categoryHeat = [...catCount.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const total = (latest.repos ?? []).length;
  const awesomeCoverage = total === 0 ? 0 : (latest.awesome ?? []).filter((n) => (latest.repos ?? []).some((r) => r.name === n)).length / total;
  return {
    snapshots: snapshots.length,
    periodDays,
    windowStart,
    latestTs: latest.ts,
    total,
    awesomeCoverage,
    newPlugins,
    starGainers,
    categoryHeat,
  };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:152-173](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/lib/index.js#L152-L173)

report 未传类别映射。

<details>
<summary>查看原文（22行）</summary>

```text
    execute: async (_args, exec) => {
      const dir = await dirFor(exec);
      const history = readSnapshots(dir);
      const days = Number.isInteger(_args.days) && _args.days > 0 ? _args.days : 7;
      const report = computeReport(history, { periodDays: days });
      const keywords = Array.isArray(_args.keywords) ? _args.keywords.filter((k) => typeof k === "string") : [];
      let newPlugins = report.newPlugins;
      if (keywords.length > 0) {
        const matches = filterByKeywords(report.newPlugins.map((p) => ({ name: p.name, desc: p.desc, topics: [p.category] })), keywords);
        newPlugins = report.newPlugins.filter((p) => matches.some((m) => m.name === p.name));
      }
      const withFiltered = { ...report, newPlugins };
      await emitDashboard(exec, days);
      return {
        snapshots: report.snapshots,
        periodDays: report.periodDays,
        total: report.total,
        awesomeCoverage: report.awesomeCoverage,
        newPlugins,
        starGainers: report.starGainers,
        categoryHeat: report.categoryHeat,
        text: renderReport(withFiltered),
```

</details>

**依据 5 · 源码核查**：[lib/index.js:210-226](https://github.com/863683348/dsh-trend-radar/blob/238ccd97948617fe8dd92f9ee5c5c05360592026/lib/index.js#L210-L226)

watch 无游标只看末两条。

<details>
<summary>查看原文（17行）</summary>

```text
      const history = readSnapshots(dir);
      let matches = [];
      let text;
      if (action === "list") {
        text = "Watch keywords: " + (keywords.length === 0 ? "(none)" : keywords.join(", "));
      } else {
        if (history.length < 2) {
          text = "Need at least 2 snapshots to check — run trend_snapshot first.";
        } else {
          const delta = deltaBetween(history[history.length - 2], history[history.length - 1]);
          const newMatches = filterByKeywords(delta.added, keywords);
          const surgeMatches = filterByKeywords(delta.starDeltas.filter((d) => d.delta >= surgeStars).map((d) => ({ name: d.name, desc: "+" + d.delta + " stars", topics: [] })), keywords);
          matches = [...newMatches, ...surgeMatches];
          text = "Checked " + keywords.length + " keyword" + (keywords.length === 1 ? "" : "s") + ": " + matches.length + " match" + (matches.length === 1 ? "" : "es") + " in the latest delta.";
        }
      }
      return { keywords, matches, text };
```

</details>

#### 缺口

- 未对真实 GitHub 搜索结果做时间序列对照。
  **影响**：漏检/误报程度随生态规模和排序变化。
  **进一步探讨**：多页/固定 cohort 采集对照，加入类别映射与 watch 已报告游标。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
