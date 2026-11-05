# dsh-stock-watch

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ea92259](https://github.com/Awu12277/dsh-stock-watch/tree/ea922597583d339f4e0fba0facae95b5a127d004)

<!-- BEGIN META -->
[![GitHub ★ 86](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=86&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Awu12277/dsh-stock-watch) [![npm 30d 979](https://img.shields.io/static/v1?label=npm+30d&message=979&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-stock-watch) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-stock-watch)
<!-- END META -->

> **功能**：在 DSH 展示自选行情和图表，并提供研究会话入口。

> **亮点**：[Q01](#research-q01) 将行情列表接到DSH，研究入口另有会话副作用。

> **主要限制**：[Q02](#research-q02) 安装可能复制全局Skill并注入提示，报价live也不证明实时。

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
  - [Q01 · 股票浮窗怎样得到行情与触发标记？](#detail-section-11)
  - [Q02 · 研究按钮和首次启动有哪些副作用？](#detail-section-12)
  - [Q03 · 怎样只试行情并退出？](#detail-section-13)
  - [Q04 · 怎样避免把拉取时间当行情时间？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在Agent工作台查看自选列表的个人用户。

切换独立行情页面并手工开启研究对话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 行情 | 展示列表及图表 | 需核对数据源时间 |
| 阈值 | 按用户价格标记 | 机械比较 |
| 研究入口 | 开启新对话 | 产生模型与文件副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer | 必需 | 同源数据路由 | 使用原行情页 |
| 行情API | 必需 | 报价与图表 | 显示失败并回源 |
| 模型与Skill | 研究才需要 | 新会话分析 | 试用保持禁用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离profile和临时Skill目录 | 禁复制或记录文件 |
| 展示 | 小量列表核对live与时间 | 失败回原源 |
| 退出 | 关闭禁用并读回文件会话 | 保留用户已有Skill |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 网络和存储未知 | 隔离Skill目录 | 未实测 |
| 持续使用 | 接口与可选模型费用未知 | 核对来源及报价 | 按数量 |
| 失败恢复 | 清理耗时未知 | 逐项检查Skill和空会话 | 不盲删已有目录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 行情浮窗 | 固定数据请求与行失败字段 | 时效准确性 |
| 阈值提示 | 简单价格比较 | 适合交易的结论 |
| 研究入口 | 创建并发送会话 | 生成质量 |

> **思考**：[Q02](#research-q02) 安装可能复制全局Skill并注入提示，报价live也不证明实时。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将行情列表接到DSH，研究入口另有会话副作用。

[Q02](#research-q02) 副作用跨出profile且复制失败仅记录日志，需明确清理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 安装可能复制全局Skill并注入提示，报价live也不证明实时。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先只读展示，不启研究。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定请求、展示字段和副作用已静态核查，行情时效与模型研究效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定host行情、技能复制、系统提示和研究按钮。
- 下一步：核对来源时间、失败标记、临时Skill和会话。

**分析版本**

- **仓库**：[Awu12277/dsh-stock-watch](https://github.com/Awu12277/dsh-stock-watch)
- **版本号**：1.1.0（[固定提交 ea92259](https://github.com/Awu12277/dsh-stock-watch/tree/ea922597583d339f4e0fba0facae95b5a127d004)）
- **版本日期**：2026-09-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 接收时间与行情时间分开可能减少新鲜度误读。

核对来源时间、失败标记、临时Skill和会话。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2464 | 2165 | 210 | — |
| .md | source | 3 | 414 | — | — | 5610 |
| .mjs | source | 7 | 873 | 728 | 103 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Awu12277/dsh-stock-watch/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：行情展示与研究入口的数据和副作用有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 股票浮窗怎样得到行情与触发标记？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望在DSH里查看自选列表的用户，可从固定行情接口读取报价和分时。host并行请求每个symbol，失败返回quote:null，只有有报价的行才写live=true、price和阈值trigger；结果updatedAt是本机响应时间。买卖标记由用户目标价与当前price直接比较，属于阈值提示。相比切到独立行情页面，这集中在Agent界面；固定源码不证明行情实时、准确或可作为交易依据。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:356-369](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/index.js#L356-L369)

失败降级和机械阈值

<details>
<summary>查看原文（14行）</summary>

```text
async function fetchQuoteResult(symbol, includeMinutes) {
  try {
    const json = await fetchJson(MINUTE_API.replace("{code}", normalizeApiCode(symbol.code)));
    return parseMinuteJson(symbol.code, json, includeMinutes);
  } catch {
    return { quote: null, prices: [] };
  }
}

function computeTrigger(price, buyPrice, sellPrice) {
  if (buyPrice === undefined && sellPrice === undefined) return "none";
  if (sellPrice !== undefined && price >= sellPrice) return "sell";
  if (buyPrice !== undefined && price <= buyPrice) return "buy";
  return "wait";
```

</details>

**依据 2 · 源码核查**：[index.js:540-561](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/index.js#L540-L561)

按组并行请求

<details>
<summary>查看原文（22行）</summary>

```text
  register("/dsh-stock-watch/quotes", async (req, res) => {
    try {
      const q = queryOf(req);
      const groupIndex = parseInt(q.get("group") ?? "0", 10) || 0;
      const includeMinutes = q.get("minutes") === "1";
      let loaded;
      const groupsParam = q.get("groups");
      if (groupsParam) {
        try {
          const clientGroups = normalizeClientGroups(JSON.parse(groupsParam));
          loaded = clientGroups ? { groups: clientGroups, source: "local", path: null } : await loadGroups();
        } catch {
          loaded = await loadGroups();
        }
      } else {
        loaded = await loadGroups();
      }
      const groups = loaded.groups;
      const safeIdx = groups.length > 0 ? Math.min(groupIndex, groups.length - 1) : 0;
      const group = groups[safeIdx] || groups[0] || null;
      const symbols = group ? group.symbols : [];
      const results = await Promise.all(symbols.map((s) => fetchQuoteResult(s, includeMinutes)));
```

</details>

**依据 3 · 源码核查**：[index.js:567-600](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/index.js#L567-L600)

live字段与本机updatedAt

<details>
<summary>查看原文（34行）</summary>

```text
        const parsed = results[i] ?? { quote: null, prices: [] };
        if (!parsed.quote && !firstError) firstError = "拉取失败";
        const q2 = parsed.quote;
        const row = {
          code: sym.code,
          name: q2 ? q2.name : sym.name || sym.code,
          trigger: "none",
          live: false,
        };
        if (sym.buyPrice !== undefined) row.buyPrice = sym.buyPrice;
        if (sym.sellPrice !== undefined) row.sellPrice = sym.sellPrice;
        if (q2) {
          live += 1;
          row.live = true;
          row.price = q2.price;
          row.changePercent = q2.changePercent;
          row.changeAmount = q2.changeAmount;
          row.high = q2.high;
          row.low = q2.low;
          row.volume = q2.volume;
          row.amount = q2.amount;
          row.trigger = computeTrigger(q2.price, sym.buyPrice, sym.sellPrice);
          if (includeMinutes && parsed.prices && parsed.prices.length > 0) row.minutes = parsed.prices;
        }
        rows.push(row);
      }
      sendJson(res, 200, {
        groups: groups.map((g) => ({ name: g.name, count: g.symbols.length })),
        groupIndex: safeIdx,
        rows,
        live: live > 0,
        updatedAt: Date.now(),
        config: { source: loaded.source, path: loaded.path },
        diag: { firstError },
```

</details>

**依据 4 · 作者声明**：[README.md:82-87](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/README.md#L82-L87)

作者注明数据源

```text
### 数据源

- 行情快照 + 分时：`https://web.ifzq.gtimg.cn/appstock/app/minute/query?code={code}&r=0.1`
- 日/周/月 K 线：`https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param={code},{period},,,{count},qfq`

解析逻辑（字段索引、K 线 `[date, open, close, high, low, volume]` 列序、昨收由 `现价/(1+涨跌幅%)` 反推）与 [stocking 的 market.ts](https://github.com/Awu12277/stocking/blob/main/src/market.ts) 保持一致。Host 端使用 Node 原生 `fetch` 直连（部署即使未挂载 web fetch provider 或沙箱封锁网络，本插件也不受影响）。
```

#### 缺口

- 第三方接口时效、报价语义与稳定性未验证
  **影响**：不能从live或更新时间推断交易所实时数据
  **进一步探讨**：用固定响应夹具及来源时间对照展示

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 研究按钮和首次启动有哪些副作用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

apply先ensureUserSkills，将自带两个Skill复制到默认~/.agents/skills，已有SKILL.md则跳过；异常记日志继续，不回滚已复制部分。禁用变量和自定义目录可控制此行为。它不只在当前profile读数据。host还把条件式研究和复盘文字加入systemPrompt，由模型判断是否匹配，并非代码级只对按钮触发。客户端研究按钮创建会话后再发prompt，发送失败可能留空会话，按钮防抖不等跨请求去重。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:29-65](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/index.js#L29-L65)

全局技能复制与开关

<details>
<summary>查看原文（37行）</summary>

```text
const BUNDLED_SKILLS = ["investment-research", "frontend-design"];

// ---------------------------------------------------------------------------
// 技能注入：安装插件（首次启动 dsh web）时把自带技能复制到用户技能目录
// ~/.agents/skills/<name>/，让「一键分析」引用的技能真正可用（此前只是随包文件）。
// - 目标已存在 SKILL.md 则跳过，尊重用户已有/自定义版本（删除后重启可重新注入）
// - 可用环境变量覆盖：DSH_STOCK_WATCH_SKILLS_DIR（目标目录）、DSH_STOCK_WATCH_NO_SKILLS=1（禁用）
// ---------------------------------------------------------------------------
function copyDirSync(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, entry.name);
    const d = join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else copyFileSync(s, d);
  }
}

function ensureUserSkills() {
  if (process.env.DSH_STOCK_WATCH_NO_SKILLS === "1") return;
  const skillsRoot = process.env.DSH_STOCK_WATCH_SKILLS_DIR || join(homedir(), ".agents", "skills");
  for (const skill of BUNDLED_SKILLS) {
    const src = join(SKILLS_SRC_DIR, skill);
    const dest = join(skillsRoot, skill);
    try {
      if (existsSync(join(dest, "SKILL.md"))) continue; // 已存在：尊重用户版本，不覆盖
      if (!existsSync(join(src, "SKILL.md"))) continue; // 包内缺失（本地开发可能没拷）：跳过
      copyDirSync(src, dest);
      writeFileSync(
        join(dest, "_user_meta.json"),
        JSON.stringify({ name: skill, installedAt: Date.now(), source: "dsh-stock-watch" }, null, 2),
      );
      console.log(`[dsh-stock-watch] 已注入技能 ${skill} -> ${dest}`);
    } catch (e) {
      console.error(`[dsh-stock-watch] 技能 ${skill} 注入失败:`, e && e.message ? e.message : e);
    }
  }
```

</details>

**依据 2 · 源码核查**：[index.js:484-493](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/index.js#L484-L493)

启动时执行

<details>
<summary>查看原文（10行）</summary>

```text
function apply(ctx) {
  // 安装/启动时把自带技能注入用户技能目录（幂等：已有则跳过）
  try {
    ensureUserSkills();
  } catch (e) {
    console.error("[dsh-stock-watch] 技能注入异常:", e && e.message ? e.message : e);
  }

  const register = (path, handler) =>
    ctx.effect(() => ctx.webServer.register({ kind: "exact", path, handler }), `dsh-stock-watch: ${path}`);
```

</details>

**依据 3 · 源码核查**：[index.js:639-668](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/index.js#L639-L668)

条件写在系统文本

<details>
<summary>查看原文（30行）</summary>

```text
  // 一键分析配套：客户端只发送简短消息「分析{公司名}（代码）」，这里注入一条条件式系统指令，
  // 保证任何会话中出现「分析某家公司」类请求时，依次使用 investment-research / frontend-design 两个技能。
  // 条件式措辞：仅对分析上市公司的请求生效，其它对话不受影响。
  const sp = typeof ctx.get === "function" ? ctx.get("systemPrompt") : undefined;
  if (sp) {
    ctx.effect(
      () => sp.section({
        name: "dsh-stock-watch.analysis",
        order: 200,
        text: "当用户消息以「分析」开头、且意图是分析某家上市公司（而非代码、思路等其他对象）时：依次使用技能 investment-research 完成投资研究分析，再使用技能 frontend-design 生成一个介绍该公司的网站。",
      }),
      "dsh-stock-watch: analysis prompt section",
    );

    // 扇形菜单注入：客户端只发送「每日复盘/行情分析/涨停分析」几个字，
    // 完整提示词在此条件式注入——仅当用户消息匹配对应关键词时按框架执行。
    ctx.effect(
      () => sp.section({
        name: "dsh-stock-watch.fan-prompts",
        order: 201,
        text: "当用户消息为「每日复盘」或以「每日复盘」开头时，执行以下每日复盘任务：\n"
          + FAN_PROMPTS.每日复盘
          + "\n当用户消息为「行情分析」或以「行情分析」开头时，执行以下行情分析任务：\n"
          + FAN_PROMPTS.行情分析
          + "\n当用户消息为「涨停分析」或以「涨停分析」开头时，执行以下涨停分析任务：\n"
          + FAN_PROMPTS.涨停分析,
      }),
      "dsh-stock-watch: fan prompt section",
    );
  }
```

</details>

**依据 4 · 源码核查**：[client.js:905-939](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/client.js#L905-L939)

新会话与prompt路径

<details>
<summary>查看原文（35行）</summary>

```text
        analyzingRef.current = true;
        setAnalyzing(true);
        try {
          // 1) 创建新会话：优先沿用当前会话所属 workspace；找不到则回退用当前会话的 cwd
          const curId = sessions ? sessions.current : undefined;
          const ws = (workspaces && Array.isArray(workspaces.items))
            ? workspaces.items.find((w) => curId && Array.isArray(w.sessionIds) && w.sessionIds.indexOf(curId) >= 0)
            : null;
          let createPayload = {};
          if (ws && ws.workspaceId) createPayload = { workspaceId: ws.workspaceId };
          else {
            const cur = (sessions && sessions.byId) ? sessions.byId[curId] : null;
            if (cur && cur.cwd) createPayload = { cwd: cur.cwd };
          }
          const created = await api.sessions.create(createPayload);
          if (!(created && created.result && created.result.ok)) throw new Error("创建新会话失败");
          const sessionId = created.result.value && created.result.value.sessionId;
          if (!sessionId) throw new Error("session.create 未返回 sessionId");
          // 2) 向新会话发送提示词（排队执行）
          const res = await api.sessions.prompt({
            sessionId,
            mode: "queue",
            content: [{ type: "text", text }],
          });
          const accepted = !!(res && res.result && res.result.ok && res.result.value && res.result.value.accepted);
          // 3) 跳到新对话；跳转失败如实提示（消息已发送，去会话列表查看）
          let opened = true;
          try { sessionsSvc.open(sessionId); } catch { opened = false; }
          if (accepted) {
            flash(opened ? "已在新对话发送「" + label + "」✓" : "「" + label + "」已发送 ✓ 未能自动跳转，请在会话列表查看", opened ? "#00ff41" : YELLOW);
          } else {
            flash("「" + label + "」请求未被接受", YELLOW);
          }
        } catch (e) {
          flash((label || "分析") + "失败：" + ((e && e.message) || "未知错误"), "#ff5252");
```

</details>

#### 缺口

- 宿主systemPrompt兼容、按钮失败恢复和路由外层权限未实测
  **影响**：可能遗留全局文件或新会话，不能认定仅局部安装
  **进一步探讨**：隔离技能目录与无模型测试会话记录副作用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样只试行情并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

使用独立profile并在启动前禁用Skill复制或指定临时技能目录，只展示合成自选列表与小量股票，不点击研究按钮。接口需要host原生网络请求，行情内容和CDN图表另有来源信任；选中研究功能后还会产生模型费用及生成文件，不能算纯浮窗成本。检查报价失败标记和配置保存后，关闭浮窗并禁用插件，再清理测试localStorage、临时Skill与新建会话。默认全局目录已有用户Skill时保留，不按同名目录盲删。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:47-64](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/index.js#L47-L64)

技能目录选择

<details>
<summary>查看原文（18行）</summary>

```text
function ensureUserSkills() {
  if (process.env.DSH_STOCK_WATCH_NO_SKILLS === "1") return;
  const skillsRoot = process.env.DSH_STOCK_WATCH_SKILLS_DIR || join(homedir(), ".agents", "skills");
  for (const skill of BUNDLED_SKILLS) {
    const src = join(SKILLS_SRC_DIR, skill);
    const dest = join(skillsRoot, skill);
    try {
      if (existsSync(join(dest, "SKILL.md"))) continue; // 已存在：尊重用户版本，不覆盖
      if (!existsSync(join(src, "SKILL.md"))) continue; // 包内缺失（本地开发可能没拷）：跳过
      copyDirSync(src, dest);
      writeFileSync(
        join(dest, "_user_meta.json"),
        JSON.stringify({ name: skill, installedAt: Date.now(), source: "dsh-stock-watch" }, null, 2),
      );
      console.log(`[dsh-stock-watch] 已注入技能 ${skill} -> ${dest}`);
    } catch (e) {
      console.error(`[dsh-stock-watch] 技能 ${skill} 注入失败:`, e && e.message ? e.message : e);
    }
```

</details>

**依据 2 · 源码核查**：[index.js:311-313](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/index.js#L311-L313)

原生fetch和超时

```text
async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
```

**依据 3 · 源码核查**：[index.js:492-498](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/index.js#L492-L498)

host路由

```text
  const register = (path, handler) =>
    ctx.effect(() => ctx.webServer.register({ kind: "exact", path, handler }), `dsh-stock-watch: ${path}`);

  register("/dsh-stock-watch/config", async (_req, res) => {
    const loaded = await loadGroups();
    sendJson(res, 200, { groups: loaded.groups, source: loaded.source, path: loaded.path });
  });
```

**依据 4 · 作者声明**：[README.md:114-118](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/README.md#L114-L118)

配置持久化

```text
## 配置与持久化

- 自选股配置（分组、代码、买卖目标价）存浏览器 `localStorage`（key：`stocking.config.v1`）
- 首次打开自动从 `~/.stocking/settings.json` 一次性迁移（失败则用默认分组），之后 localStorage 为唯一数据源
- 重置：`localStorage.removeItem('stocking.config.v1')` 后刷新页面
```

#### 缺口

- 实际行情限流、路由身份和清理未验证
  **影响**：不能支持多用户部署或长期准确性结论
  **进一步探讨**：本机隔离环境核对请求和新增文件，会话逐个读回

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样避免把拉取时间当行情时间？

**研究主题**：新假设与验证

#### 完整回答

可在当前updatedAt之外试验单独展示数据源时间、接收时间和过期状态。固定旧报价、网络超时及正常时间响应，对照用户是否误以为报价刚更新，测误判和额外请求；若源接口没有可靠时间或提示仍误导，就明确仅显示接收时间并不承诺实时。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:593-600](https://github.com/Awu12277/dsh-stock-watch/blob/ea922597583d339f4e0fba0facae95b5a127d004/index.js#L593-L600)

当前统一updatedAt

```text
      sendJson(res, 200, {
        groups: groups.map((g) => ({ name: g.name, count: g.symbols.length })),
        groupIndex: safeIdx,
        rows,
        live: live > 0,
        updatedAt: Date.now(),
        config: { source: loaded.source, path: loaded.path },
        diag: { firstError },
```

#### 缺口

- 数据源是否返回可验证行情时间未知
  **影响**：新增标签可能没有有效依据
  **进一步探讨**：先检查固定接口样本及字段再做界面对照

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
