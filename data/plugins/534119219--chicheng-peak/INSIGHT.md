# chicheng-peak

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b89dc9a](https://github.com/534119219/chicheng-peak/tree/b89dc9a63eb270736fae63e43445b421477c02ab)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-peak)
<!-- END META -->

> **实现功能**：按配置峰谷时窗显示页面/输入框光效与角标，并由Host提前调度模板提醒到可选消息渠道。

> **核心亮点**：把阶段可视和页面关闭后的多渠道调度集中，减少计时发信接线，非新计价/可靠消息算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：重叠窗/override显示与提醒可不一致，先标fired失败不重试且持久化延迟可重复，本地仍称已发；热重载tearDown未重置。详见[Q02](#research-q02)。

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
  - [Q01 · 适合谁，阶段到视觉/外部提醒如何工作？](#detail-section-11)
  - [Q02 · 贡献与时窗/投递/生命周期关键限制是什么？](#detail-section-12)
  - [Q03 · 依赖、访问权限和读者步骤是什么？](#detail-section-13)
  - [Q04 · 三阶段成本效果和失败恢复怎样界定？](#detail-section-14)
  - [Q05 · 工程复用、投递状态假设及采用结论是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：人工按确认的时段安排任务/接提醒，不自动验证费率或调整请求。

人工时钟/日历与渠道提醒可替代，插件集中光效/调度也增加规则与漏重恢复维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 配置时窗 | 显示峰谷阶段 | 不读取真实计费规则 |
| 视觉/本地通知 | 页面状态提示 | 页面/权限和轮询限制 |
| Host提醒 | 关页面仍调度 | Host/渠道需在线，非不漏不重 |
| 多渠道 | 模板推送 | 发起非送达，未知先查询 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer/webRuntime和Node内置API | Host必需 | 状态/配置POST路由与30秒调度 | 主进程停机不能后台继续 |
| Web locale/slots/界面依赖 | 可视必需 | 边框/输入框/角标/设置 | DOM/轮询需匹配 |
| chicheng-push或messaging服务/渠道 | 外部推送必需 | 模板提醒发往目标 | 失败仍记fired，非可靠重试队列 |
| 浏览器Notification权限/打开页面 | 本地通知必需 | 系统提醒 | 未授权静默，收到不等读者看见 |
| 正确时区/窗口/当前计费规则 | 解读必需 | 配置阶段而非读账单 | 作者默认不证明当前官方价格 |
| DSH_HOME目录读写/备份 | 必需 | config/fired共享文件 | 无profile名，多个进程可能竞争 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定插件/宿主，核真实计费模型/时区规则 | 默认窗仅作者冻结记录，不能直接算省钱 |
| 配置 | 先视觉，选互不重叠窗口与明确自有渠道 | 确认目标/模板外发内容，不测试发给他人 |
| 对照 | 核状态/转折/预计提醒和实际渠道结果 | lastFired非成功投递，不据本地文案当已送达 |
| 恢复 | 查发送未知/持久化/服务状态再处理 | 不盲重发，跨重启/热重载单独核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/可选推送渠道，金额未知 | 时窗/计价规则/目标与权限核对 | 不自动优化或切换模型请求 |
| 持续使用 | Host30秒tick、Client5–120秒轮询/动画/2秒重定位 | 更新规则/渠道和管理打扰 | 外部服务限制/费用另计 |
| 失败恢复 | 配置/fired文件与未知投递核查 | 区分未发、失败、未知/重复和错过 | 10分钟追赶有限，固定时间只当前分钟 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 阶段可见 | 按配置时窗/override画光效 | 当前真实API费率/适用账号模型 |
| 提前提醒 | Host定时独立页面 | 收件人收到、跨崩溃不漏不重 |
| 调整使用时间 | 人工可看提示安排任务 | 实际省钱/任务延迟/质量收益 |

> **思考**：重叠窗/override显示与提醒可不一致，先标fired失败不重试且持久化延迟可重复，本地仍称已发；热重载tearDown未重置。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把阶段可视和页面关闭后的多渠道调度集中，减少计时发信接线，非新计价/可靠消息算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

把阶段可视和页面关闭后的多渠道调度集中，减少计时发信接线，非新计价/可靠消息算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

时间函数/模板/渠道dispatch分层、配置clamp、固定POST/fence、临时文件rename、去重和effect清理是实际工程点；原子单文件写不等跨config/fired一致事务，也不等多进程锁。

<a id="detail-section-5"></a>

### 1.4 主要限制

重叠窗/override显示与提醒可不一致，先标fired失败不重试且持久化延迟可重复，本地仍称已发；热重载tearDown未重置。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，先核真实适用规则、统一转折/投递收据/热重载，提醒仅辅助不直接作省钱依据。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持配置阶段可视化与Host定时多渠道提醒；重叠窗/强制阶段、失败标记和延迟持久化使显示及投递语义不完整，默认时窗不证明当前计费。有效转折与投递状态收据尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Host时窗/持久化/调度/dispatch/围栏/生命周期及Client轮询/本地文案；未全面审光效布局或上游推送实现，不认定当前价格。
- 下一步：进一步探讨先用重叠窗/override/DST/失败/崩溃/多实例/热重载夹具核协议，再以受控目标查投递，不盲重发。

**分析版本**

- **仓库**：[534119219/chicheng-peak](https://github.com/534119219/chicheng-peak)
- **版本号**：0.1.0（[固定提交 b89dc9a](https://github.com/534119219/chicheng-peak/tree/b89dc9a63eb270736fae63e43445b421477c02ab)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨规则版本/有效转折与持久投递状态收据，统一unknown/查询恢复和实例隔离，渠道维护成本未验证。详见[Q05](#research-q05)。

进一步探讨先用重叠窗/override/DST/失败/崩溃/多实例/热重载夹具核协议，再以受控目标查投递，不盲重发。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 164 | — | — | 1933 |
| .js | source | 2 | 2991 | 2624 | 215 | — |
| .mjs | test | 4 | 549 | 434 | 61 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-peak/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-peak/issues?q=is%3Aissue+created%3A2026-09-22T07%3A14%3A19.558Z..2026-10-22T07%3A14%3A19.558Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-peak/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A14%3A19.558Z..2026-10-22T07%3A14%3A19.558Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核配置时窗的可视阶段和后台提醒，区分实际计费、尝试/受理/送达及重复恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合谁，阶段到视觉/外部提醒如何工作？

**研究主题**：场景与需求、功能与机制

#### 完整回答

适合想按自己确认的时段安排API使用、在Web看阶段/倒计时或提前提醒的人。输入时区、峰窗/override、提前分钟、模板/渠道，输出配置阶段光效/角标和消息尝试。成功需时窗确实适用当前计费产品、提醒正确投递；颜色不代表真实请求费率或省钱效果。作者冻结默认时段/半价说明只作声明，本文不背书其现行有效性。

Host从DSH_HOME/peakvalley加载config和fired，30秒tick依阶段候选时间减提前量，10分钟追赶去重后走messaging、pushNotifier或loopback HTTP；保存lastResult供UI看。Client轮询POST状态，独立页面/输入框光效、角标和Notification。本地阶段通知仅页面开着/有权限，外部调度不依赖页面但依赖Host进程/渠道。API有POST/Host/Origin fence和分方法处理，注册/清理纳入effect。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:26-49](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L26-L49)

路径/作者默认窗。

<details>
<summary>查看原文（24行）</summary>

```text
const DATA_ROOT = process.env.DSH_HOME
  ? join(process.env.DSH_HOME, "peakvalley")
  : join(homedir(), ".dsh", "peakvalley");
const CONFIG_PATH = join(DATA_ROOT, "config.json");
const FIRED_PATH = join(DATA_ROOT, "fired.json");

// ---------------------------------------------------------------- defaults

const PHASES = { PEAK: "peak", VALLEY: "valley" };

/** Official DeepSeek peak windows (Asia/Shanghai), effective 2026-08-17. */
const OFFICIAL_WINDOWS = [
  { start: "09:00", end: "12:00" },
  { start: "14:00", end: "18:00" },
];

const TIMEZONES = ["Asia/Shanghai", "Asia/Hong_Kong", "Asia/Tokyo", "Asia/Singapore", "Asia/Seoul", "UTC", "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles"];

const DEFAULT_CONFIG = {
  version: 1,
  enabled: true,
  timezone: "Asia/Shanghai",
  windows: structuredClone(OFFICIAL_WINDOWS),
  override: "auto", // auto | peak | valley
```

</details>

**依据 2 · 源码核查**：[lib/index.js:130-159](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L130-L159)

持久化载入。

<details>
<summary>查看原文（30行）</summary>

```text
async function loadStore() {
  const stored = await loadJson(CONFIG_PATH, {});
  config = { ...structuredClone(DEFAULT_CONFIG), ...stored };
  config.edge = { ...structuredClone(DEFAULT_CONFIG.edge), ...(config.edge ?? {}) };
  // legacy migration: edge.composer { enabled, glowDirection } → top-level composer
  if (stored && stored.composer === undefined && stored.edge && stored.edge.composer) {
    config.composer.enabled = stored.edge.composer.enabled !== false;
    config.composer.glowDirection = ["in", "out"].includes(stored.edge.composer.glowDirection)
      ? stored.edge.composer.glowDirection
      : DEFAULT_CONFIG.composer.glowDirection;
  }
  config.composer = { ...structuredClone(DEFAULT_CONFIG.composer), ...(config.composer ?? {}) };
  // legacy migration: edge.badge (boolean) → top-level badge
  if (stored && stored.badge === undefined && stored.edge && typeof stored.edge.badge === "boolean") {
    config.badge.enabled = stored.edge.badge;
  }
  config.badge = {
    enabled: config.badge.enabled !== false,
    desktop: { ...DEFAULT_CONFIG.badge.desktop, ...(config.badge?.desktop ?? {}) },
    mobile: { ...DEFAULT_CONFIG.badge.mobile, ...(config.badge?.mobile ?? {}) },
  };
  config.localNotify = { ...DEFAULT_CONFIG.localNotify, ...(config.localNotify ?? {}) };
  config.reminders = {
    peak: { ...DEFAULT_CONFIG.reminders.peak, ...(config.reminders?.peak ?? {}) },
    valley: { ...DEFAULT_CONFIG.reminders.valley, ...(config.reminders?.valley ?? {}) },
  };
  if (!Array.isArray(config.windows) || config.windows.length === 0) config.windows = structuredClone(OFFICIAL_WINDOWS);
  try {
    const fired = await loadJson(FIRED_PATH, []);
    if (Array.isArray(fired)) firedKeys = new Set(fired.slice(-2000));
```

</details>

**依据 3 · 源码核查**：[lib/index.js:591-614](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L591-L614)

提醒主链。

<details>
<summary>查看原文（24行）</summary>

```text
async function fireReminder(ctx, phase) {
  const r = config.reminders[phase];
  if (!r || r.enabled !== true) return null;
  const now = Date.now();
  const tz = config.timezone;

  // 1) transition reminders: phase start − leadMinutes (fires once per
  //    occurrence; catch-up window of 10 minutes covers restarts)
  const starts = phaseStarts(new Date(now - 10 * 60000), phase, config);
  for (const s of starts) {
    const lead = Number(r.leadMinutes) || 0;
    const reminderAt = s.at.getTime() - lead * 60000;
    if (reminderAt > now) continue; // not due yet
    if (now - reminderAt > 10 * 60000) continue; // stale
    if (lead > 0 && now > s.at.getTime() + 10 * 60000) continue; // transition long past
    const key = `${phase}:transition:${s.at.toISOString()}`;
    if (firedKeys.has(key)) continue;
    firedKeys.add(key);
    const values = buildValues(config, phase, s.at);
    const result = await sendReminderMessage(ctx, config, phase, values, r.channel);
    r.lastFiredAt = new Date().toISOString();
    r.lastResult = result;
    scheduleSave();
    console.info(`[chicheng-peak] reminder fired (${key}) ok=${result?.ok === true}`);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:465-506](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L465-L506)

三种渠道。

<details>
<summary>查看原文（42行）</summary>

```text
/** Dispatch one push: messaging target | pushNotifier service | /push/api/send. */
async function dispatchPush(ctx, title, content, channel) {
  const raw = String(channel ?? "all").trim();
  if (raw.startsWith("messaging:")) {
    const rest = raw.slice("messaging:".length);
    const sep = rest.indexOf(":");
    if (sep <= 0) return { ok: false, error: `无效的消息平台目标 "${raw}"` };
    const platform = rest.slice(0, sep);
    const chatId = rest.slice(sep + 1);
    const messaging = resolveMessaging(ctx);
    if (!messaging || typeof messaging.send !== "function") {
      return { ok: false, error: "messaging-core 服务不可用（未安装或未挂载）" };
    }
    try {
      await messaging.send(platform, chatId, `${title}\n\n${content}`);
      return { ok: true, sent: 1, total: 1, source: "messaging", platform, chatId };
    } catch (error) {
      return { ok: false, sent: 0, total: 1, source: "messaging", error: error instanceof Error ? error.message : String(error) };
    }
  }
  const channels = raw !== "" && raw !== "all" ? [raw] : "all";
  const notifier = resolvePushNotifier(ctx);
  if (notifier && typeof notifier.send === "function") {
    try {
      const result = await notifier.send({ title, content, channels });
      return result ?? { ok: false, error: "push 服务无返回" };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }
  // HTTP fallback (chicheng-push exposes /push/api/send)
  try {
    const port = ctx?.webServer?.port ?? 3080;
    const response = await fetch(`http://127.0.0.1:${port}/push/api/send`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, content, channels }),
    });
    const parsed = await response.json().catch(() => null);
    return parsed ?? { ok: false, error: `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1019-1066](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L1019-L1066)

路由/tick/清理。

<details>
<summary>查看原文（48行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: "/peakvalley/api",
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: "forbidden", message: "forbidden" } });
        return;
      }
      if (req.method !== "POST") {
        writeJson(res, 405, { ok: false, error: { code: "method-error", message: "method not allowed" } });
        return;
      }
      const pathname = new URL(req.url ?? "/", "http://peakvalley.invalid").pathname;
      const segments = pathname.split("/").filter(Boolean);
      const method = segments[0] === "peakvalley" && segments[1] === "api" && segments.length === 3 ? segments[2] : undefined;
      if (method === undefined || method.includes("/") || method === "") {
        writeError(res, new PeakValleyError("not-found", "unknown peakvalley API method", 404));
        return;
      }
      try {
        const payload = await readJsonBody(req);
        const handler = api[method];
        if (typeof handler !== "function") throw new PeakValleyError("not-found", `unknown peakvalley API method "${method}"`, 404);
        writeOk(res, await handler(payload));
      } catch (error) {
        writeError(res, error);
      }
    },
  }), "chicheng-peak: /peakvalley/api routes");

  // 30s tick: fire due reminders (independent of any open browser page)
  tickTimer = setInterval(() => {
    void onTick();
  }, 30000);
  tickTimer.unref?.();

  ctx.effect(() => () => {
    tearDown = true;
    currentCtx = null;
    if (tickTimer !== null) clearInterval(tickTimer);
    tickTimer = null;
    if (storeDirtyTimer !== null) {
      clearTimeout(storeDirtyTimer);
      storeDirtyTimer = null;
    }
    void flushConfig();
    void flushFired();
  }, "chicheng-peak: teardown");
```

</details>

**依据 6 · 源码核查**：[lib/client.js:309-336](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/client.js#L309-L336)

Client轮询/重定位。

<details>
<summary>查看原文（28行）</summary>

```text
      poll: function () {
        api("status").then(function (s) {
          runtime.status = s;
          applyOverlay(s);
          runtime.detectLocalNotifications(s, true);
          runtime.publish();
          try { console.info("[chicheng-peak] status:", s.phase, s.edge && s.edge.enabled ? "edge-on" : "edge-off"); } catch (e) { /* ignore */ }
        }).catch(function () {
          hideOverlay();
          try { console.warn("[chicheng-peak] status fetch failed"); } catch (e) { /* ignore */ }
        });
      },
      refreshNow: function () { runtime.poll(); },
      start: function () {
        if (runtime.timer !== null) return;
        runtime.poll();
        var tick = function () {
          var secs = (runtime.status && runtime.status.pollSeconds) || 15;
          runtime.refreshNow();
          runtime.timer = setTimeout(tick, Math.max(5, Math.min(120, secs)) * 1000);
        };
        runtime.timer = setTimeout(tick, 15000);
        // Lightweight local re-measure (no network): bounds the composer
        // glow/badge lag to ~2s for layout moves that fire no events (e.g.
        // toggling the sidebars reflows the composer without resize/scroll).
        runtime._repositionTimer = setInterval(function () {
          repositionDynamic();
        }, 2000);
```

</details>

**依据 7 · 源码核查**：[lib/client.js:435-473](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/client.js#L435-L473)

本地通知。

<details>
<summary>查看原文（39行）</summary>

```text
      detectLocalNotifications: function (s, fromPoll) {
        if (!s.localNotify || !s.localNotify.enabled) return;
        var title = "";
        var body = "";
        if (s.localNotify.onTransition !== false && s.phase && runtime.lastPhase !== null && s.phase !== runtime.lastPhase) {
          var isPeakNow = s.phase === "peak";
          title = isPeakNow ? "DeepSeek 高峰期开始" : "DeepSeek 低峰期开始";
          body = isPeakNow ? "当前为高峰期（09:00–12:00 / 14:00–18:00）" : "当前为低峰期（空闲时段）";
          if (!fromPoll) {
            // forced poll after saving/opening settings — still notify
          }
        } else if (s.localNotify.onReminder === true) {
          var pk = s.reminders && s.reminders.peak ? s.reminders.peak.lastFiredAt : null;
          var vl = s.reminders && s.reminders.valley ? s.reminders.valley.lastFiredAt : null;
          if (pk && pk !== runtime.lastPeakFired) {
            title = (s.reminders.peak.title || "高峰期提醒");
            body = "已通过推送渠道发送高峰期提醒";
          } else if (vl && vl !== runtime.lastValleyFired) {
            title = (s.reminders.valley.title || "低峰期提醒");
            body = "已通过推送渠道发送低峰期提醒";
          }
        }
        runtime.lastPhase = s.phase;
        runtime.lastPeakFired = s.reminders && s.reminders.peak ? s.reminders.peak.lastFiredAt : null;
        runtime.lastValleyFired = s.reminders && s.reminders.valley ? s.reminders.valley.lastFiredAt : null;
        if (title !== "") sendLocalNotification(title, body);
      },
    };

    function localNotificationSupported() {
      return typeof window !== "undefined" && "Notification" in window;
    }

    function sendLocalNotification(title, body) {
      if (!localNotificationSupported()) return;
      if (Notification.permission !== "granted") return;
      try {
        new Notification(String(title), { body: String(body), tag: "chicheng-peak", silent: false });
      } catch (e) { /* ignore */ }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献与时窗/投递/生命周期关键限制是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献在配置阶段、可视光效和关闭页面仍可调度的多渠道提醒统一，减少单独计时/发消息接线；它不自动改变模型调用或验证真实计费，也不是可靠消息队列。

时窗phaseAt按所有区间并集，nextTransition检查前后阶段，但phaseStarts直接把每窗start/end当peak/valley，不核是否真变相。sanitize只验证每窗start<end，不合并/拒绝重叠；配置09–12与11–14时会把12当valley提醒，实际仍peak。override强制状态时nextTransition无转折，调度phaseStarts却未检查override，显示/提醒可能不同。跨日窗口不支持；DST使用当前参考偏移估算未来本地时刻，源码已注明切换附近可能偏一小时。

投递先firedKeys.add再await，失败也写lastFired并保存，后续不重试该key；发出后持久化延迟120ms，崩溃/保存失败可重启重复，没有幂等投递ID。配置/去重共享DSH_HOME且模块全局，多profile/进程不隔离；tick无全局singleflight，慢HTTP无timeout可叠加不同key。卸载tearDown=true，apply未重置，复用模块热加载后tick会一直return。

本地onReminder仅看lastFiredAt变化就称“已通过推送渠道发送”，不看lastResult.ok，失败也可能显示已发送。messaging.send返回即sent1不等收件端送达，HTTP fallback把JSON直接返回、不核HTTP状态/业务信封。Host fence能减浏览器跨站，但无Origin允许、Host是头，不能替代外层身份/渠道发送授权。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:293-306](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L293-L306)

区间并集/override。

<details>
<summary>查看原文（14行）</summary>

```text
/** True when `minutes` (local minute of day) is inside any [start, end) window. */
function isPeakAt(minutes, windows) {
  return windows.some((w) => {
    const s = parseHM(w.start);
    const e = parseHM(w.end);
    if (s === null || e === null || e <= s) return false;
    return minutes >= s && minutes < e;
  });
}

function phaseAt(date, cfg) {
  if (cfg.override === "peak") return PHASES.PEAK;
  if (cfg.override === "valley") return PHASES.VALLEY;
  return isPeakAt(zonedMinutes(date, cfg.timezone), cfg.windows) ? PHASES.PEAK : PHASES.VALLEY;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:313-335](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L313-L335)

真实转折。

<details>
<summary>查看原文（23行）</summary>

```text
function nextTransition(now, cfg) {
  // In forced mode the schedule is suspended — no transitions to report.
  if (cfg.override !== "auto") return null;
  const tz = cfg.timezone;
  const current = phaseAt(now, cfg);
  const boundaries = [];
  for (let dayOffset = 0; dayOffset <= 2; dayOffset += 1) {
    const bp = zonedParts(new Date(now.getTime() + dayOffset * 86400000), tz);
    for (const w of cfg.windows) {
      const s = parseHM(w.start);
      const e = parseHM(w.end);
      if (s === null || e === null || e <= s) continue;
      boundaries.push({ min: s, at: zonedEpoch(bp.y, bp.m, bp.d, s, tz, now) });
      boundaries.push({ min: e, at: zonedEpoch(bp.y, bp.m, bp.d, e, tz, now) });
    }
  }
  boundaries.sort((a, b) => a.at - b.at);
  for (const b of boundaries) {
    if (b.at <= now.getTime()) continue;
    const before = phaseAt(new Date(b.at - 60000), cfg);
    const after = isPeakAt(b.min, cfg.windows) ? PHASES.PEAK : PHASES.VALLEY;
    if (before !== after) return { at: new Date(b.at), phase: after };
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:343-363](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L343-L363)

逐窗候选未合并。

<details>
<summary>查看原文（21行）</summary>

```text
function phaseStarts(from, phase, cfg) {
  const tz = cfg.timezone;
  const out = [];
  for (let dayOffset = 0; dayOffset <= 2; dayOffset += 1) {
    const bp = zonedParts(new Date(from.getTime() + dayOffset * 86400000), tz);
    const candidates = [];
    for (const w of cfg.windows) {
      const s = parseHM(w.start);
      const e = parseHM(w.end);
      if (s === null || e === null || e <= s) continue;
      candidates.push({ min: s, phase: PHASES.PEAK });
      candidates.push({ min: e, phase: PHASES.VALLEY });
    }
    for (const c of candidates) {
      if (c.phase !== phase) continue;
      const at = zonedEpoch(bp.y, bp.m, bp.d, c.min, tz, from);
      if (at > from.getTime()) out.push({ at: new Date(at), phase });
    }
  }
  out.sort((a, b) => a.at - b.at);
  return out;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:669-693](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L669-L693)

窗口sanitize。

<details>
<summary>查看原文（25行）</summary>

```text
function sanitizeWindow(w) {
  const s = parseHM(w?.start);
  const e = parseHM(w?.end);
  if (s === null || e === null || e <= s) return null;
  return { start: formatHM(s), end: formatHM(e) };
}

/** Validate + clamp a client-submitted config snapshot; returns { ok, config?, error? }. */
function sanitizeConfig(input) {
  if (!input || typeof input !== "object") return { ok: false, error: "配置格式无效" };
  const out = structuredClone(DEFAULT_CONFIG);
  out.enabled = input.enabled !== false;
  const tz = typeof input.timezone === "string" ? input.timezone : "Asia/Shanghai";
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: tz });
    out.timezone = tz;
  } catch {
    out.timezone = "Asia/Shanghai";
  }
  const windows = Array.isArray(input.windows)
    ? input.windows.map(sanitizeWindow).filter(Boolean)
    : [];
  if (windows.length === 0) return { ok: false, error: "至少需要一个有效的高峰时段（开始时间必须早于结束时间）" };
  out.windows = windows;
  out.override = ["auto", "peak", "valley"].includes(input.override) ? input.override : "auto";
```

</details>

**依据 5 · 源码核查**：[lib/index.js:200-202](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L200-L202)

作者DST局限。

```text
// assembly for a local wall-clock minute estimates the offset from the current
// instant, which is exact for fixed-offset zones (Asia/Shanghai etc.) and
// only off by an hour around a DST switch for zones that observe one.
```

**依据 6 · 源码核查**：[lib/index.js:606-614](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L606-L614)

先标后发/失败保存。

```text
    const key = `${phase}:transition:${s.at.toISOString()}`;
    if (firedKeys.has(key)) continue;
    firedKeys.add(key);
    const values = buildValues(config, phase, s.at);
    const result = await sendReminderMessage(ctx, config, phase, values, r.channel);
    r.lastFiredAt = new Date().toISOString();
    r.lastResult = result;
    scheduleSave();
    console.info(`[chicheng-peak] reminder fired (${key}) ok=${result?.ok === true}`);
```

**依据 7 · 源码核查**：[lib/index.js:165-192](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L165-L192)

延迟持久化。

<details>
<summary>查看原文（28行）</summary>

```text
function scheduleSave() {
  if (storeDirtyTimer !== null) return;
  storeDirtyTimer = setTimeout(() => {
    storeDirtyTimer = null;
    void flushConfig();
    void flushFired();
  }, 120);
}

async function flushConfig() {
  try {
    await mkdir(DATA_ROOT, { recursive: true });
    const tmp = `${CONFIG_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify(config, null, 2), "utf8");
    await rename(tmp, CONFIG_PATH);
  } catch (error) {
    console.error("[chicheng-peak] config flush failed:", error);
  }
}

async function flushFired() {
  try {
    await mkdir(DATA_ROOT, { recursive: true });
    const tmp = `${FIRED_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify([...firedKeys].slice(-2000), null, 0), "utf8");
    await rename(tmp, FIRED_PATH);
  } catch (error) {
    console.error("[chicheng-peak] fired flush failed:", error);
```

</details>

**依据 8 · 源码核查**：[lib/index.js:644-649](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L644-L649)

tearDown判定。

```text
async function onTick() {
  if (tearDown) return;
  try {
    if (!config.enabled) return;
    await fireReminder(currentCtx, PHASES.PEAK);
    await fireReminder(currentCtx, PHASES.VALLEY);
```

**依据 9 · 源码核查**：[lib/index.js:1007-1009](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L1007-L1009)

apply不重置。

```text
async function apply(ctx, configArg) {
  await loadStore();
  currentCtx = ctx;
```

**依据 10 · 源码核查**：[lib/index.js:1050-1065](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L1050-L1065)

tick/卸载设置。

<details>
<summary>查看原文（16行）</summary>

```text
  tickTimer = setInterval(() => {
    void onTick();
  }, 30000);
  tickTimer.unref?.();

  ctx.effect(() => () => {
    tearDown = true;
    currentCtx = null;
    if (tickTimer !== null) clearInterval(tickTimer);
    tickTimer = null;
    if (storeDirtyTimer !== null) {
      clearTimeout(storeDirtyTimer);
      storeDirtyTimer = null;
    }
    void flushConfig();
    void flushFired();
```

</details>

**依据 11 · 源码核查**：[lib/client.js:447-460](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/client.js#L447-L460)

失败也可称已发。

<details>
<summary>查看原文（14行）</summary>

```text
          var pk = s.reminders && s.reminders.peak ? s.reminders.peak.lastFiredAt : null;
          var vl = s.reminders && s.reminders.valley ? s.reminders.valley.lastFiredAt : null;
          if (pk && pk !== runtime.lastPeakFired) {
            title = (s.reminders.peak.title || "高峰期提醒");
            body = "已通过推送渠道发送高峰期提醒";
          } else if (vl && vl !== runtime.lastValleyFired) {
            title = (s.reminders.valley.title || "低峰期提醒");
            body = "已通过推送渠道发送低峰期提醒";
          }
        }
        runtime.lastPhase = s.phase;
        runtime.lastPeakFired = s.reminders && s.reminders.peak ? s.reminders.peak.lastFiredAt : null;
        runtime.lastValleyFired = s.reminders && s.reminders.valley ? s.reminders.valley.lastFiredAt : null;
        if (title !== "") sendLocalNotification(title, body);
```

</details>

**依据 12 · 源码核查**：[lib/index.js:824-840](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L824-L840)

请求头围栏。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

#### 缺口

- 渠道接受/下游送达与发送未知没有统一幂等收据。
  **影响**：lastFired或API返回不能保证人收到，恢复可漏或重复。
  **进一步探讨**：可先定义pending/accepted/failed/unknown并用渠道消息ID查询，再研究持久outbox而非盲重试。
- 默认时窗是否适用当前产品/模型、时区规则和费率未由代码确定。
  **影响**：不能凭边框推断实际便宜或省固定比例。
  **进一步探讨**：可从当前账号/产品的原始计费条款和账单核对，显式保存规则版本及适用范围。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、访问权限和读者步骤是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包0.1.0 Host仅内置模块，仍硬需webServer/webRuntime；推送另依外部插件/渠道凭据/目标，不能把零第三方运行时依赖当无需外部服务。数据路径只有DSH_HOME无profile，configArg未用于隔离/合并。API test可直接自定义消息和渠道，fireNow检查阶段提醒开关但非统一enabled，需把访问控制当发送权限处理。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer/webRuntime和Node内置API | Host必需 | 状态/配置POST路由与30秒调度 | 主进程停机不能后台继续 |
| Web locale/slots/界面依赖 | 可视必需 | 边框/输入框/角标/设置 | DOM/轮询需匹配 |
| chicheng-push或messaging服务/渠道 | 外部推送必需 | 模板提醒发往目标 | 失败仍记fired，非可靠重试队列 |
| 浏览器Notification权限/打开页面 | 本地通知必需 | 系统提醒 | 未授权静默，收到不等读者看见 |
| 正确时区/窗口/当前计费规则 | 解读必需 | 配置阶段而非读账单 | 作者默认不证明当前官方价格 |
| DSH_HOME目录读写/备份 | 必需 | config/fired共享文件 | 无profile名，多个进程可能竞争 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定插件/宿主，核真实计费模型/时区规则 | 默认窗仅作者冻结记录，不能直接算省钱 |
| 配置 | 先视觉，选互不重叠窗口与明确自有渠道 | 确认目标/模板外发内容，不测试发给他人 |
| 对照 | 核状态/转折/预计提醒和实际渠道结果 | lastFired非成功投递，不据本地文案当已送达 |
| 恢复 | 查发送未知/持久化/服务状态再处理 | 不盲重发，跨重启/热重载单独核 |

模板内容出本机到所选消息服务，测试/立即触发也有真实外发；本轮不调用这些接口，不发送任何通知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/package.json#L1-L4)

包版本。

```text
{
  "name": "chicheng-peak",
  "version": "0.1.0",
  "description": "DSH 峰谷提醒插件：依据 DeepSeek 官方峰谷定价时段（高峰 09:00–12:00 / 14:00–18:00，其余为低峰），在网页边缘渲染带呼吸、流光效果的橙色（高峰）/ 蓝色（低峰）边框，并可在到达高峰/低峰前按自定义提前量，通过消息推送渠道（Server酱 / Bark / 钉钉 / TG / 飞书 / Webhook…）或消息平台发送自定义标题与内容的提醒。",
```

**依据 2 · 源码核查**：[lib/index.js:21-30](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L21-L30)

Host依赖/共享路径。

<details>
<summary>查看原文（10行）</summary>

```text
const name = "chicheng-peak";
const inject = ["webServer", "webRuntime"];

// ---------------------------------------------------------------- paths

const DATA_ROOT = process.env.DSH_HOME
  ? join(process.env.DSH_HOME, "peakvalley")
  : join(homedir(), ".dsh", "peakvalley");
const CONFIG_PATH = join(DATA_ROOT, "config.json");
const FIRED_PATH = join(DATA_ROOT, "fired.json");
```

</details>

**依据 3 · 源码核查**：[lib/index.js:965-999](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L965-L999)

test/fireNow发送边界。

<details>
<summary>查看原文（35行）</summary>

```text
    /** Send a test reminder (renders template for peak/valley, or custom text). */
    test: async (payload) => {
      const kind = String(payload?.kind ?? "peak");
      const channel = String(payload?.channel ?? "all").trim() || "all";
      if (!["peak", "valley", "custom"].includes(kind)) throw new PeakValleyError("bad-request", `未知的测试类型 "${kind}"`);
      const transitionAt = new Date();
      const phase = kind === "custom" ? PHASES.PEAK : kind;
      const values = buildValues(config, phase, transitionAt);
      if (kind === "custom") {
        values.phase = "自定义测试";
        const title = String(payload?.title ?? "峰谷提醒测试").trim() || "峰谷提醒测试";
        const content = String(payload?.content ?? "这是一条来自峰谷提醒插件的测试消息。").trim();
        const result = await dispatchPush(ctx, title, content, channel);
        return { result, title, content };
      }
      const title = renderTemplate(String(payload?.title ?? config.reminders[phase]?.title ?? ""), values) || `${PHASE_TEXTS[phase]?.zh ?? phase}提醒`;
      const content = renderTemplate(String(payload?.content ?? config.reminders[phase]?.content ?? ""), values);
      const result = await dispatchPush(ctx, title, content, channel);
      return { result, title, content, values };
    },

    /** Manual "fire now" for a phase reminder (useful while tuning templates). */
    fireNow: async (payload) => {
      const phase = String(payload?.phase ?? "peak");
      if (![PHASES.PEAK, PHASES.VALLEY].includes(phase)) throw new PeakValleyError("bad-request", `未知的阶段 "${phase}"`);
      if (config.reminders[phase]?.enabled !== true) {
        return { skipped: true, reason: "该阶段提醒未启用" };
      }
      const transitionAt = new Date();
      const values = buildValues(config, phase, transitionAt);
      const result = await sendReminderMessage(ctx, config, phase, values, config.reminders[phase].channel);
      const r = config.reminders[phase];
      r.lastFiredAt = new Date().toISOString();
      r.lastResult = result;
      scheduleSave();
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1007-1009](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L1007-L1009)

配置参数未使用。

```text
async function apply(ctx, configArg) {
  await loadStore();
  currentCtx = ctx;
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本效果和失败恢复怎样界定？

**研究主题**：效果与总成本

#### 完整回答

视觉提示本身不请求模型，不能自动把工作移到低费时段。周期网络/DOM重测和动画有开销，渠道可能有额度/费用；如果为等低谷延误任务，经济结果还要计人工/等待和业务时限。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/可选推送渠道，金额未知 | 时窗/计价规则/目标与权限核对 | 不自动优化或切换模型请求 |
| 持续使用 | Host30秒tick、Client5–120秒轮询/动画/2秒重定位 | 更新规则/渠道和管理打扰 | 外部服务限制/费用另计 |
| 失败恢复 | 配置/fired文件与未知投递核查 | 区分未发、失败、未知/重复和错过 | 10分钟追赶有限，固定时间只当前分钟 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 阶段可见 | 按配置时窗/override画光效 | 当前真实API费率/适用账号模型 |
| 提前提醒 | Host定时独立页面 | 收件人收到、跨崩溃不漏不重 |
| 调整使用时间 | 人工可看提示安排任务 | 实际省钱/任务延迟/质量收益 |

外部定时只有10分钟追赶，额外固定时刻要求currentMin相同，停机越窗会漏；cfg变更/手动触发与定时key可能形成不同结果。恢复先查lastResult和渠道真实记录，不能用最近触发时间判已投递，也不应因当前未收到就重复发送。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:599-613](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L599-L613)

追赶/标记。

<details>
<summary>查看原文（15行）</summary>

```text
  const starts = phaseStarts(new Date(now - 10 * 60000), phase, config);
  for (const s of starts) {
    const lead = Number(r.leadMinutes) || 0;
    const reminderAt = s.at.getTime() - lead * 60000;
    if (reminderAt > now) continue; // not due yet
    if (now - reminderAt > 10 * 60000) continue; // stale
    if (lead > 0 && now > s.at.getTime() + 10 * 60000) continue; // transition long past
    const key = `${phase}:transition:${s.at.toISOString()}`;
    if (firedKeys.has(key)) continue;
    firedKeys.add(key);
    const values = buildValues(config, phase, s.at);
    const result = await sendReminderMessage(ctx, config, phase, values, r.channel);
    r.lastFiredAt = new Date().toISOString();
    r.lastResult = result;
    scheduleSave();
```

</details>

**依据 2 · 源码核查**：[lib/index.js:617-637](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L617-L637)

固定分钟。

<details>
<summary>查看原文（21行）</summary>

```text
  // 2) extra daily fixed times (only while the phase is active)
  const times = parseTimesList(r.times);
  if (times.length > 0) {
    const p = zonedParts(new Date(now), tz);
    const currentMin = p.h * 60 + p.min;
    const currentPhase = phaseAt(new Date(now), config);
    if (currentPhase === phase) {
      // fire when the current minute matches a configured time (or we are
      // within its 60s window and it has not fired for today)
      const todayKey = `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
      for (const min of times) {
        if (currentMin !== min) continue;
        const key = `${phase}:daily:${todayKey}:${min}`;
        if (firedKeys.has(key)) continue;
        firedKeys.add(key);
        const at = new Date(zonedEpoch(p.y, p.m, p.d, min, tz, new Date()));
        const values = buildValues(config, phase, at);
        const result = await sendReminderMessage(ctx, config, phase, values, r.channel);
        r.lastFiredAt = new Date().toISOString();
        r.lastResult = result;
        scheduleSave();
```

</details>

**依据 3 · 源码核查**：[lib/index.js:495-506](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L495-L506)

HTTP无本地timeout。

<details>
<summary>查看原文（12行）</summary>

```text
  // HTTP fallback (chicheng-push exposes /push/api/send)
  try {
    const port = ctx?.webServer?.port ?? 3080;
    const response = await fetch(`http://127.0.0.1:${port}/push/api/send`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, content, channels }),
    });
    const parsed = await response.json().catch(() => null);
    return parsed ?? { ok: false, error: `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
```

</details>

**依据 4 · 源码核查**：[lib/client.js:309-336](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/client.js#L309-L336)

轮询/DOM资源。

<details>
<summary>查看原文（28行）</summary>

```text
      poll: function () {
        api("status").then(function (s) {
          runtime.status = s;
          applyOverlay(s);
          runtime.detectLocalNotifications(s, true);
          runtime.publish();
          try { console.info("[chicheng-peak] status:", s.phase, s.edge && s.edge.enabled ? "edge-on" : "edge-off"); } catch (e) { /* ignore */ }
        }).catch(function () {
          hideOverlay();
          try { console.warn("[chicheng-peak] status fetch failed"); } catch (e) { /* ignore */ }
        });
      },
      refreshNow: function () { runtime.poll(); },
      start: function () {
        if (runtime.timer !== null) return;
        runtime.poll();
        var tick = function () {
          var secs = (runtime.status && runtime.status.pollSeconds) || 15;
          runtime.refreshNow();
          runtime.timer = setTimeout(tick, Math.max(5, Math.min(120, secs)) * 1000);
        };
        runtime.timer = setTimeout(tick, 15000);
        // Lightweight local re-measure (no network): bounds the composer
        // glow/badge lag to ~2s for layout moves that fire no events (e.g.
        // toggling the sidebars reflows the composer without resize/scroll).
        runtime._repositionTimer = setInterval(function () {
          repositionDynamic();
        }, 2000);
```

</details>

#### 缺口

- 无提醒完整投递率、端到端延迟/干扰成本或同任务账单节省对照。
  **影响**：不能承诺可靠准时或省钱。
  **进一步探讨**：可用自有受控目标/固定时钟材料研究漏重/未知，再比较同等任务效果、真实账单和等待成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程复用、投递状态假设及采用结论是什么？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

时间函数/模板/渠道dispatch分层、配置clamp、固定POST/fence、临时文件rename、去重和effect清理是实际工程点；原子单文件写不等跨config/fired一致事务，也不等多进程锁。

可探讨未验证的“规则版本与投递状态收据”。先统一并集合并后的有效转折，强制override的显示/调度同规则，记录规则来源/适用模型/版本。按发生时刻+规则版本生成稳定消息ID，在持久outbox写pending再发送，区分accepted/failed/unknown，渠道支持时用幂等/查询，UI按真实结果措辞；profile/实例隔离和卸载取消/重载重置明确。代价是状态/恢复协议、渠道接口和隐私维护；不保证最终人阅读。可用重叠窗、DST、override、发送失败、发后保存前崩溃、多进程和热重载夹具研究，重复/未知不隐藏。

推荐observe。视觉按自定义规则提示有用，但提醒失败/重复、规则一致和复用模块调度需先修清，价格默认不能直接采信。继续可先核配置规则和有效转折、UI送达措辞及投递收据，再研究受控目标；出现错阶段、发送未知/失败却称成功、重复/错目标或热重载不调度，应停依赖提醒，回原始时钟/渠道记录，不盲重发。本轮无外部消息操作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:174-192](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L174-L192)

原子单文件写。

<details>
<summary>查看原文（19行）</summary>

```text
async function flushConfig() {
  try {
    await mkdir(DATA_ROOT, { recursive: true });
    const tmp = `${CONFIG_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify(config, null, 2), "utf8");
    await rename(tmp, CONFIG_PATH);
  } catch (error) {
    console.error("[chicheng-peak] config flush failed:", error);
  }
}

async function flushFired() {
  try {
    await mkdir(DATA_ROOT, { recursive: true });
    const tmp = `${FIRED_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify([...firedKeys].slice(-2000), null, 0), "utf8");
    await rename(tmp, FIRED_PATH);
  } catch (error) {
    console.error("[chicheng-peak] fired flush failed:", error);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:343-363](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L343-L363)

统一转折假设起点。

<details>
<summary>查看原文（21行）</summary>

```text
function phaseStarts(from, phase, cfg) {
  const tz = cfg.timezone;
  const out = [];
  for (let dayOffset = 0; dayOffset <= 2; dayOffset += 1) {
    const bp = zonedParts(new Date(from.getTime() + dayOffset * 86400000), tz);
    const candidates = [];
    for (const w of cfg.windows) {
      const s = parseHM(w.start);
      const e = parseHM(w.end);
      if (s === null || e === null || e <= s) continue;
      candidates.push({ min: s, phase: PHASES.PEAK });
      candidates.push({ min: e, phase: PHASES.VALLEY });
    }
    for (const c of candidates) {
      if (c.phase !== phase) continue;
      const at = zonedEpoch(bp.y, bp.m, bp.d, c.min, tz, from);
      if (at > from.getTime()) out.push({ at: new Date(at), phase });
    }
  }
  out.sort((a, b) => a.at - b.at);
  return out;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:606-614](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L606-L614)

outbox起点。

```text
    const key = `${phase}:transition:${s.at.toISOString()}`;
    if (firedKeys.has(key)) continue;
    firedKeys.add(key);
    const values = buildValues(config, phase, s.at);
    const result = await sendReminderMessage(ctx, config, phase, values, r.channel);
    r.lastFiredAt = new Date().toISOString();
    r.lastResult = result;
    scheduleSave();
    console.info(`[chicheng-peak] reminder fired (${key}) ok=${result?.ok === true}`);
```

**依据 4 · 源码核查**：[lib/index.js:1055-1065](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js#L1055-L1065)

生命周期起点。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.effect(() => () => {
    tearDown = true;
    currentCtx = null;
    if (tickTimer !== null) clearInterval(tickTimer);
    tickTimer = null;
    if (storeDirtyTimer !== null) {
      clearTimeout(storeDirtyTimer);
      storeDirtyTimer = null;
    }
    void flushConfig();
    void flushFired();
```

</details>

**依据 5 · 源码核查**：[lib/client.js:447-460](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/client.js#L447-L460)

结果措辞起点。

<details>
<summary>查看原文（14行）</summary>

```text
          var pk = s.reminders && s.reminders.peak ? s.reminders.peak.lastFiredAt : null;
          var vl = s.reminders && s.reminders.valley ? s.reminders.valley.lastFiredAt : null;
          if (pk && pk !== runtime.lastPeakFired) {
            title = (s.reminders.peak.title || "高峰期提醒");
            body = "已通过推送渠道发送高峰期提醒";
          } else if (vl && vl !== runtime.lastValleyFired) {
            title = (s.reminders.valley.title || "低峰期提醒");
            body = "已通过推送渠道发送低峰期提醒";
          }
        }
        runtime.lastPhase = s.phase;
        runtime.lastPeakFired = s.reminders && s.reminders.peak ? s.reminders.peak.lastFiredAt : null;
        runtime.lastValleyFired = s.reminders && s.reminders.valley ? s.reminders.valley.lastFiredAt : null;
        if (title !== "") sendLocalNotification(title, body);
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
