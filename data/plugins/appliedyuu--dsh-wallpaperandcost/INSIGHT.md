# dsh-WallpaperAndCost

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5fa96d0](https://github.com/AppliedYuu/dsh-WallpaperAndCost/tree/5fa96d0a8f11240b625d79f515b924d11042d151)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AppliedYuu/dsh-WallpaperAndCost)
<!-- END META -->

> **功能**：为 DSH 提供壁纸设置、余额与会话费用显示。

> **亮点**：[Q01](#research-q01) 集中外观和费用显示，[Q02](#research-q02) 连接余额和本地会话估算。

> **主要限制**：[Q03](#research-q03) 未知模型不计价且历史使用当前表重估，不能替代账单。

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
  - [Q01 · 壁纸和费用组件相对原界面与平台账单有什么用途？](#detail-section-11)
  - [Q02 · 余额、会话费用与壁纸如何接线？](#detail-section-12)
  - [Q03 · 估算、历史价格和持久化有哪些反证？](#detail-section-13)
  - [Q04 · 凭据、外部素材及采用成本如何处理？](#detail-section-14)
  - [Q05 · 如何帮助用户判断费用估算可否用于预算决策？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户调整 DSH 外观并查看余额与会话消耗。

使用原生外观并在服务商账单查看费用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 壁纸 | 自定义外观 | 本地存储和素材权限 |
| 余额 | 查询服务商余额 | 需要凭据与网络 |
| 费用估算 | 按会话和价格计价 | 未知模型和历史价格有缺口 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH Web 与宿主服务 | 必需 | 界面和路由 | 无法使用 |
| DeepSeek 凭据 | 查余额需要 | 请求余额 | 返回缺凭据 |
| 会话日志与价格 | 估算需要 | 计算费用 | 结果缺失或未计价 |
| 本地存储与素材 | 壁纸需要 | 保留自定义图片 | 可能不能持久 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用测试会话与授权素材 | 核凭据和隐私 |
| 设置 | 选择壁纸并刷新 | 检查是否保留 |
| 查看 | 检查余额和未定价调用 | 缺信息不当零费用 |
| 对账 | 核服务商账单 | 不一致暂停预算决策 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 准备 | 存储和网络未知 | 配置凭据和素材 | 含敏感数据 |
| 使用 | 视频渲染及 API 费用未知 | 对账 | 模型可能未定价 |
| 恢复 | 本地数据成本未知 | 重导素材 | 持久失败可能静默 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 壁纸 | 本地设置和上传 | 性能和持久性 |
| 余额 | 凭据请求服务商 | 实际 API 可用 |
| 估算 | 价格乘 token 并计未定价 | 官方账单一致 |

> **思考**：[Q03](#research-q03) 未知模型不计价且历史使用当前表重估，不能替代账单。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中外观和费用显示，[Q02](#research-q02) 连接余额和本地会话估算。

[Q03](#research-q03) 当前价格表用于重算，未知模型不计入价格；本地存储可能静默失败。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 未知模型不计价且历史使用当前表重估，不能替代账单。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用授权素材和测试会话核显示，费用与官方账单对照，不一致时停用估算决策。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态检查余额、价格、日志及存储代表路径；未运行外部 API。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/client.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、清单、宿主费用和客户端存储代表路径；未运行 API、模型、宿主或提取脚本。
- 下一步：[Q05](#research-q05) 核现有 UI 后对照价格变更与账单。

**分析版本**

- **仓库**：[AppliedYuu/dsh-WallpaperAndCost](https://github.com/AppliedYuu/dsh-WallpaperAndCost)
- **版本号**：1.1.0（[固定提交 5fa96d0](https://github.com/AppliedYuu/dsh-WallpaperAndCost/tree/5fa96d0a8f11240b625d79f515b924d11042d151)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设公开计价版本与缺口有助核账；尚未验证。

[Q05](#research-q05) 核现有 UI 后对照价格变更与账单。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4122 | 3533 | 395 | — |
| .md | source | 1 | 106 | — | — | 1540 |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AppliedYuu/dsh-WallpaperAndCost/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AppliedYuu/dsh-WallpaperAndCost/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对壁纸存储、余额、费用估算及误差边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 壁纸和费用组件相对原界面与平台账单有什么用途？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:3-16 描述自定义壁纸、上传和 Wallpaper Engine 提取，及合并的余额与用量组件。相对原始界面和另开平台账单，它把外观与费用信息集中在 DSH，但视觉效果、性能与估算准确度未测；本地显示不替代官方账单或确保素材有授权。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-16](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/README.md#L3-L16)

作者描述功能。

<details>
<summary>查看原文（14行）</summary>

```text
A merged DSH web plugin combining **wallpaper customization** and the **DeepSeek balance & usage widget**.

## Features

### 🎨 Wallpaper (壁纸)
- 8 built-in curated gradients (暮色 / 深渊 / 晨曦 / 森林 / 星夜 / 暖阳 / 青空 / 石墨)
- Upload your own images **at full original resolution** (no compression), stored in IndexedDB
- **动态壁纸：上传 MP4/WebM 视频，自动静音循环播放**（铺底 `<video>` 元素，object-fit: cover）
- Crop editor: drag to pan + zoom (100%–250%) with a live viewport-proportional preview
- Independent **absolute opacity sliders (0–100%)** for the left sidebar, the conversation column and the right sidebar — the right-sidebar slider now drives **both** the dsh-better-sidebar panel *and* DSH's official right sidebar (dsh-client-ui-sidebar-right, detected via `[data-sidebar-right-panel]`); the slider auto-appears whenever either sidebar is present
- Wallpaper choice persists across restarts (localStorage + IndexedDB)
- **创意工坊壁纸提取（服务器目录）**：输入 Wallpaper Engine 创意工坊条目文件夹的绝对路径（`…steamapps\workshop\content\431960\<id>`），由内置的 `scripts/extract_scene_pkg.py` 解析 `scene.pkg` / `.tex`（含 LZ4 解压、DXT/RGBA→PNG、内嵌 MP4），提取最佳壁纸供预览与下载。需要运行 DSH 的机器装有 Python 3（脚本为纯 Python，Pillow 可选）。
  - **桌面端支持「选择文件夹…」**：DSH Desktop（Windows）上可直接用系统原生文件夹选择器选取条目文件夹，自动填入绝对路径，避免手输/粘贴路径出错而报"文件夹不存在"。
  - **路径自动规整 + 明确报错**：路径会先去空白、剥成对引号、展开 `~`，并校验是否为绝对路径；读取失败会区分「文件夹不存在」「没有权限读取该文件夹（含 Windows 受控文件夹访问拦截）」「路径不是文件夹」，不再把权限问题笼统报成"文件夹不存在"。
```

</details>

**依据 2 · 源码核查**：[package.json:1-27](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/package.json#L1-L27)

插件、客户端、价格及提取脚本入口。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "dsh-WallpaperAndCost",
  "version": "1.1.0",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "pricing.json",
    "scripts/extract_scene_pkg.py",
```

</details>

**依据 3 · 源码核查**：[lib/client.js:2084-2113](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/client.js#L2084-L2113)

客户端获取余额及会话费用。

<details>
<summary>查看原文（30行）</summary>

```text
      var refreshBalance = useCallback(function () {
        fetch("/api/deepseek-balance", { headers: { Accept: "application/json" } })
          .then(function (r) {
            return r.json();
          })
          .then(function (d) {
            setData(d);
            setErr(d && d.ok === false ? d.message || "查询失败" : null);
            setNow(Date.now());
          })
          .catch(function (e) {
            setErr(String((e && e.message) || e));
            setNow(Date.now());
          });
      }, []);

      var refreshCost = useCallback(
        function () {
          if (!sessionId) return;
          fetch(
            "/api/deepseek-session-cost?sessionId=" + encodeURIComponent(sessionId),
            { headers: { Accept: "application/json" } }
          )
            .then(function (r) {
              return r.json();
            })
            .then(function (d) {
              if (d && d.ok) setCost(d);
            })
            .catch(function () {});
```

</details>

#### 缺口

- 未做用户或账单对照
  **影响**：不能证明视觉收益和计费准确
  **进一步探讨**：用测试素材与账单对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 余额、会话费用与壁纸如何接线？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

client.js:2084-2113 分别请求余额和会话费用；index.js:1166-1186 从宿主凭据读取 DeepSeek key 并请求余额接口，缺 key 返回 503。index.js:716-752 读取会话日志、按 revision 和价格指纹缓存并为 assistant 消息重算；360-389 对已知模型按输入、缓存命中和输出 token 乘单价，未知模型计入 unpricedCalls。client.js:457-466 保存壁纸设置并调用 IndexedDB；未运行宿主、API 或图像。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2084-2113](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/client.js#L2084-L2113)

客户端请求费用和余额。

<details>
<summary>查看原文（30行）</summary>

```text
      var refreshBalance = useCallback(function () {
        fetch("/api/deepseek-balance", { headers: { Accept: "application/json" } })
          .then(function (r) {
            return r.json();
          })
          .then(function (d) {
            setData(d);
            setErr(d && d.ok === false ? d.message || "查询失败" : null);
            setNow(Date.now());
          })
          .catch(function (e) {
            setErr(String((e && e.message) || e));
            setNow(Date.now());
          });
      }, []);

      var refreshCost = useCallback(
        function () {
          if (!sessionId) return;
          fetch(
            "/api/deepseek-session-cost?sessionId=" + encodeURIComponent(sessionId),
            { headers: { Accept: "application/json" } }
          )
            .then(function (r) {
              return r.json();
            })
            .then(function (d) {
              if (d && d.ok) setCost(d);
            })
            .catch(function () {});
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1166-1186](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L1166-L1186)

凭据与余额请求。

<details>
<summary>查看原文（21行）</summary>

```text
  // 路由①：查余额 + 今日消费（官方数据优先，没有就用余额差估算兜底）
  // ---- GET /api/deepseek-balance ----------------------------------------
  ctx.effect(
    () => ctx.webServer.register({
      kind: "exact",
      path: BALANCE_ROUTE,
      // 流程：取 API key → 调 DeepSeek 余额接口 → 查今日消费(官方→估算) → 拼 JSON 返回
      handler: async (req, res) => {
        try {
          const hit = await ctx.credentials.resolve("DEEPSEEK_API_KEY");
          if (hit === void 0) {
            sendJson(res, 503, {
              ok: false,
              error: "no-api-key",
              message: "未配置 DEEPSEEK_API_KEY：请在 设置 → 模型 中填写 DeepSeek API Key。"
            });
            return;
          }
          const response = await fetch(balanceUrl(), {
            headers: {
              Authorization: `Bearer ${hit.value}`,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:716-752](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L716-L752)

会话日志读取与重算。

<details>
<summary>查看原文（37行）</summary>

```text
// 重放某会话的历史日志：把每条 AI 消息都算一遍钱，费用覆盖整个会话(含插件加载前的消息)；
// 带缓存：日志版本或价格指纹没变就直接用上次结果，且两次重放至少隔 2 秒；读不了返回 null
async function replaySessionCost(ctx, sessionId) {
  const persistence = ctx.get("sessionPersistence");
  if (persistence === void 0 || typeof persistence.readRaw !== "function" || typeof persistence.readStoredRevision !== "function") {
    return null;
  }
  let revision;
  try {
    revision = await persistence.readStoredRevision(sessionId);
  } catch (error) {
    ctx.logger.warn("dsh-WallpaperAndCost: failed to read session log revision");
    ctx.logger.warn(error);
    return null;
  }
  if (revision === void 0) return null;
  const state = refreshPriceRules();
  const cached = logCostCache.get(sessionId);
  if (cached !== void 0) {
    if (cached.revision === revision && cached.fingerprint === state.fingerprint) return cached;
    if (Date.now() - cached.at < REPLAY_MIN_INTERVAL_MS) return cached;
  }
  try {
    const raw = await persistence.readRaw(sessionId);
    if (raw === void 0 || raw === null || typeof raw.content !== "string") return null;
    const record = emptyRecord();
    for (const line of raw.content.split("\n")) {
      if (line === "") continue;
      let event;
      try {
        event = JSON.parse(line);
      } catch {
        continue;
      }
      if (event === null || typeof event !== "object" || event.type !== "assistant/message") continue;
      try {
        priceEventInto(record, event);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:360-389](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L360-L389)

价格计算及未定价计数。

<details>
<summary>查看原文（30行）</summary>

```text
export function priceEventInto(record, event) {
  const data = event && typeof event === "object" ? event.data : void 0;
  const usage = data && typeof data === "object" ? data.usage : void 0;
  if (!usage || typeof usage !== "object") return false;
  const input = toFinite(usage.inputTokens);
  const output = toFinite(usage.outputTokens);
  if (!Number.isFinite(input) && !Number.isFinite(output)) return false;
  const cacheRead = Math.max(0, toFinite(usage.cacheReadTokens) || 0);
  // `usage.inputTokens` is already the uncached (cache-miss) portion — the
  // token-meter usage projection maps it straight to `uncachedInputTokens` —
  // so it must NOT be reduced by cacheRead again.
  const uncached = Number.isFinite(input) ? input : 0;
  const out = Number.isFinite(output) ? output : 0;
  const rawModel = typeof data.message?.source?.model === "string" ? data.message.source.model : "unknown";
  const id = normalizeModel(rawModel);
  const at = typeof event.time === "number" ? event.time : Date.now();
  const p = priceAt(id, at);

  record.calls += 1;
  record.inputTokens += uncached;
  record.cacheReadTokens += cacheRead;
  record.outputTokens += out;

  let cost = 0;
  if (p === null) {
    record.unpricedCalls += 1;
  } else {
    cost = (uncached * p.input + cacheRead * p.cacheRead + out * p.output) / 1e6;// 费用 = tokens × 单价 ÷ 1M
    record.cost += cost;
    record.costUsd += cost / REFERENCE_USD_CNY;
```

</details>

**依据 5 · 源码核查**：[lib/client.js:457-466](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/client.js#L457-L466)

设置与壁纸上传的本地保存。

<details>
<summary>查看原文（10行）</summary>

```text
    function persist(next) {
      try {
        if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
          localStorage.setItem(KEY, JSON.stringify({ ...next, uploads: [] }));
        }
      } catch (e) {}
      try {
        // 持久化时去掉运行时 objectURL (重启后需重新创建)；Blob 由 persistUploadBlob 单独存一次
        const clean = (next.uploads || []).map((u) => { const c = { ...u }; delete c.url; delete c.blob; return c; });
        idbPut(IDB_UPLOADS_KEY, clean);
```

</details>

#### 缺口

- 未运行 API、会话或图像
  **影响**：不能证明余额与费用完整
  **进一步探讨**：用脱敏日志和官方账单对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 估算、历史价格和持久化有哪些反证？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

index.js:199-225 价格文件缺失或解析失败回落内置表；250-268 按模型正则与时间窗口选当前表价格，effectiveFrom 固定为 0，不能将历史估算当时价账单。360-389 未匹配模型仅增加 unpricedCalls；716-750 日志不可读返回 null、坏行跳过，缓存还可能短暂保留旧结果。client.js:457-466 对本地存储错误吞掉，外观设置刷新后不保证保存。结算须以服务商实际账单为准。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:199-225](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L199-L225)

价格表加载及回退。

<details>
<summary>查看原文（27行）</summary>

```text
 * 读取/热重载 pricing.json。
 * mtime 未变 → 直接返回缓存；变了 → 重新解析编译；读不到或全表非法 → 用内置兜底价。
 * @returns {{ peakWindows: Array<{startHour:number,endHour:number}>, models: Array<object> }} 编译后的计价表
 */
export function pricingTable() {
  let mtime = -1;
  try {
    mtime = statSync(PRICING_PATH).mtimeMs;
  } catch {
    mtime = -1; // 文件不存在
  }
  if (mtime !== -1 && mtime === pricingState.fileMtime) return pricingState.table;
  if (mtime === -1) {
    if (pricingState.fileMtime !== -1 || pricingState.table !== FALLBACK_PRICING) {
      console.warn(`dsh-WallpaperAndCost: 找不到 ${PRICING_FILE}，已回退到内置 flash 价`);
    }
    pricingState = { table: FALLBACK_PRICING, fingerprint: fingerprintOf(FALLBACK_PRICING), fileMtime: -1 };
    return pricingState.table;
  }
  try {
    const compiled = compilePricing(JSON.parse(readFileSync(PRICING_PATH, "utf8")));
    if (compiled === null) throw new Error("no usable model rule");
    pricingState = { table: compiled, fingerprint: fingerprintOf(compiled), fileMtime: mtime };
  } catch (error) {
    console.warn(`dsh-WallpaperAndCost: ${PRICING_FILE} 解析失败，已回退到内置 flash 价`, error instanceof Error ? error.message : error);
    pricingState = { table: FALLBACK_PRICING, fingerprint: fingerprintOf(FALLBACK_PRICING), fileMtime: mtime };
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:250-268](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L250-L268)

模型匹配与有效日期。

<details>
<summary>查看原文（19行）</summary>

```text
export function priceAt(model, timeMs) {
  const id = normalizeModel(model);
  const table = pricingTable();
  for (const entry of table.models) {
    // 正则全部非 /g，但保险起见重置 lastIndex
    entry.re.lastIndex = 0;
    if (!entry.re.test(id)) continue;
    const peak = entry.peak ? isPeak(table.peakWindows, timeMs) : false;
    const p = entry.peak ? (peak ? entry.peakPrice : entry.offPeakPrice) : entry.flatPrice;
    return {
      input: p.cacheMiss,
      cacheRead: p.cacheHit,
      output: p.output,
      peak,
      effectiveFrom: 0,
      label: entry.label
    };
  }
  return null;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:360-389](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L360-L389)

未知模型及计算。

<details>
<summary>查看原文（30行）</summary>

```text
export function priceEventInto(record, event) {
  const data = event && typeof event === "object" ? event.data : void 0;
  const usage = data && typeof data === "object" ? data.usage : void 0;
  if (!usage || typeof usage !== "object") return false;
  const input = toFinite(usage.inputTokens);
  const output = toFinite(usage.outputTokens);
  if (!Number.isFinite(input) && !Number.isFinite(output)) return false;
  const cacheRead = Math.max(0, toFinite(usage.cacheReadTokens) || 0);
  // `usage.inputTokens` is already the uncached (cache-miss) portion — the
  // token-meter usage projection maps it straight to `uncachedInputTokens` —
  // so it must NOT be reduced by cacheRead again.
  const uncached = Number.isFinite(input) ? input : 0;
  const out = Number.isFinite(output) ? output : 0;
  const rawModel = typeof data.message?.source?.model === "string" ? data.message.source.model : "unknown";
  const id = normalizeModel(rawModel);
  const at = typeof event.time === "number" ? event.time : Date.now();
  const p = priceAt(id, at);

  record.calls += 1;
  record.inputTokens += uncached;
  record.cacheReadTokens += cacheRead;
  record.outputTokens += out;

  let cost = 0;
  if (p === null) {
    record.unpricedCalls += 1;
  } else {
    cost = (uncached * p.input + cacheRead * p.cacheRead + out * p.output) / 1e6;// 费用 = tokens × 单价 ÷ 1M
    record.cost += cost;
    record.costUsd += cost / REFERENCE_USD_CNY;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:716-750](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L716-L750)

日志读取、缓存和坏行。

<details>
<summary>查看原文（35行）</summary>

```text
// 重放某会话的历史日志：把每条 AI 消息都算一遍钱，费用覆盖整个会话(含插件加载前的消息)；
// 带缓存：日志版本或价格指纹没变就直接用上次结果，且两次重放至少隔 2 秒；读不了返回 null
async function replaySessionCost(ctx, sessionId) {
  const persistence = ctx.get("sessionPersistence");
  if (persistence === void 0 || typeof persistence.readRaw !== "function" || typeof persistence.readStoredRevision !== "function") {
    return null;
  }
  let revision;
  try {
    revision = await persistence.readStoredRevision(sessionId);
  } catch (error) {
    ctx.logger.warn("dsh-WallpaperAndCost: failed to read session log revision");
    ctx.logger.warn(error);
    return null;
  }
  if (revision === void 0) return null;
  const state = refreshPriceRules();
  const cached = logCostCache.get(sessionId);
  if (cached !== void 0) {
    if (cached.revision === revision && cached.fingerprint === state.fingerprint) return cached;
    if (Date.now() - cached.at < REPLAY_MIN_INTERVAL_MS) return cached;
  }
  try {
    const raw = await persistence.readRaw(sessionId);
    if (raw === void 0 || raw === null || typeof raw.content !== "string") return null;
    const record = emptyRecord();
    for (const line of raw.content.split("\n")) {
      if (line === "") continue;
      let event;
      try {
        event = JSON.parse(line);
      } catch {
        continue;
      }
      if (event === null || typeof event !== "object" || event.type !== "assistant/message") continue;
```

</details>

**依据 5 · 源码核查**：[lib/client.js:457-466](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/client.js#L457-L466)

存储失败被捕获。

<details>
<summary>查看原文（10行）</summary>

```text
    function persist(next) {
      try {
        if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
          localStorage.setItem(KEY, JSON.stringify({ ...next, uploads: [] }));
        }
      } catch (e) {}
      try {
        // 持久化时去掉运行时 objectURL (重启后需重新创建)；Blob 由 persistUploadBlob 单独存一次
        const clean = (next.uploads || []).map((u) => { const c = { ...u }; delete c.url; delete c.blob; return c; });
        idbPut(IDB_UPLOADS_KEY, clean);
```

</details>

#### 缺口

- 未核所有模型价格及供应商账单
  **影响**：估算可能不完整或重算历史
  **进一步探讨**：对照不同时期价格与账单。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 凭据、外部素材及采用成本如何处理？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:11-29 描述 Web 客户端、价格表和提取脚本；余额路径读取宿主凭据，提取路径读取用户指定服务器目录并运行本地脚本（index.js:1336-1396）。图片、视频的存储、渲染性能和 API 费用未知，路径、账号及使用记录可能敏感。先用测试会话与已授权素材核余额和对账，确认存储和性能；价格缺失、读取失败、来源不明或账单不一致时停用估算决策并查官方数据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:11-29](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/package.json#L11-L29)

插件与资源。

<details>
<summary>查看原文（19行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "pricing.json",
    "scripts/extract_scene_pkg.py",
    "cordis.patch.yml",
    "README.md"
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1166-1186](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L1166-L1186)

访问宿主凭据和外部余额。

<details>
<summary>查看原文（21行）</summary>

```text
  // 路由①：查余额 + 今日消费（官方数据优先，没有就用余额差估算兜底）
  // ---- GET /api/deepseek-balance ----------------------------------------
  ctx.effect(
    () => ctx.webServer.register({
      kind: "exact",
      path: BALANCE_ROUTE,
      // 流程：取 API key → 调 DeepSeek 余额接口 → 查今日消费(官方→估算) → 拼 JSON 返回
      handler: async (req, res) => {
        try {
          const hit = await ctx.credentials.resolve("DEEPSEEK_API_KEY");
          if (hit === void 0) {
            sendJson(res, 503, {
              ok: false,
              error: "no-api-key",
              message: "未配置 DEEPSEEK_API_KEY：请在 设置 → 模型 中填写 DeepSeek API Key。"
            });
            return;
          }
          const response = await fetch(balanceUrl(), {
            headers: {
              Authorization: `Bearer ${hit.value}`,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1336-1396](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L1336-L1396)

提取目录检查与脚本调用。

<details>
<summary>查看原文（61行）</summary>

```text
  // ---- GET /api/wallpaper-workshop/extract?folder=<abs path> --------------
  // Runs scripts/extract_scene_pkg.py against a server-local Wallpaper Engine
  // workshop item folder (…steamapps\workshop\content\431960\<id>) and returns
  // the best extracted media (video / largest image / preview fallback).
  ctx.effect(
    () => ctx.webServer.register({
      kind: "exact",
      path: WORKSHOP_EXTRACT_ROUTE,
      // 流程：folder 参数 → 规整并校验路径 → 必须是存在的文件夹 → 跑脚本到输出目录 → 读产物列表；一个媒体都没有给 422
      handler: async (req, res) => {
        try {
          const raw = new URL(req.url ?? "/", "http://x").searchParams.get("folder") ?? "";
          const norm = normalizeWorkshopFolder(raw);
          if (norm.error === "empty") {
            sendJson(res, 400, {
              ok: false,
              error: "no-folder",
              message: "缺少 folder 参数（Wallpaper Engine 创意工坊条目文件夹的绝对路径）。"
            });
            return;
          }
          if (norm.error === "not-absolute") {
            sendJson(res, 400, { ok: false, error: "not-absolute", message: norm.message });
            return;
          }
          const folder = norm.folder;
          let st;
          try {
            st = statSync(folder);
          } catch (e) {
            // 把真实的失败原因告诉用户：权限问题不再被笼统地报成"文件夹不存在"
            const code = (e && e.code) || "";
            if (code === "EACCES" || code === "EPERM") {
              sendJson(res, 403, {
                ok: false,
                error: "no-permission",
                message: `没有权限读取该文件夹：${folder}（请检查文件夹访问权限；若开启了 Windows「受控文件夹访问」，需把 DSH 加入允许列表）。`
              });
            } else if (code === "ENOENT") {
              sendJson(res, 404, {
                ok: false,
                error: "not-found",
                message: `文件夹不存在：${folder}（请确认路径拼写、创意工坊条目 id 正确，且文件夹确实位于该位置）。`
              });
            } else {
              sendJson(res, 404, {
                ok: false,
                error: "not-found",
                message: `无法访问该文件夹：${folder}（${code || "未知错误"}）。`
              });
            }
            return;
          }
          if (!st.isDirectory()) {
            sendJson(res, 400, { ok: false, error: "not-dir", message: `路径不是文件夹：${folder}` });
            return;
          }
          const root = workshopOutRoot();
          mkdirSync(root, { recursive: true });
          const outDir = join(root, workshopJob(folder));
          const result = await runExtractScript(["--folder", folder, "--out", outDir]);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:360-389](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L360-L389)

未知模型及估算。

<details>
<summary>查看原文（30行）</summary>

```text
export function priceEventInto(record, event) {
  const data = event && typeof event === "object" ? event.data : void 0;
  const usage = data && typeof data === "object" ? data.usage : void 0;
  if (!usage || typeof usage !== "object") return false;
  const input = toFinite(usage.inputTokens);
  const output = toFinite(usage.outputTokens);
  if (!Number.isFinite(input) && !Number.isFinite(output)) return false;
  const cacheRead = Math.max(0, toFinite(usage.cacheReadTokens) || 0);
  // `usage.inputTokens` is already the uncached (cache-miss) portion — the
  // token-meter usage projection maps it straight to `uncachedInputTokens` —
  // so it must NOT be reduced by cacheRead again.
  const uncached = Number.isFinite(input) ? input : 0;
  const out = Number.isFinite(output) ? output : 0;
  const rawModel = typeof data.message?.source?.model === "string" ? data.message.source.model : "unknown";
  const id = normalizeModel(rawModel);
  const at = typeof event.time === "number" ? event.time : Date.now();
  const p = priceAt(id, at);

  record.calls += 1;
  record.inputTokens += uncached;
  record.cacheReadTokens += cacheRead;
  record.outputTokens += out;

  let cost = 0;
  if (p === null) {
    record.unpricedCalls += 1;
  } else {
    cost = (uncached * p.input + cacheRead * p.cacheRead + out * p.output) / 1e6;// 费用 = tokens × 单价 ÷ 1M
    record.cost += cost;
    record.costUsd += cost / REFERENCE_USD_CNY;
```

</details>

#### 缺口

- 未验证隐私、平台及费用
  **影响**：不能保证价格和素材安全
  **进一步探讨**：使用测试资料并核账单。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助用户判断费用估算可否用于预算决策？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有记录已经有 unpricedCalls、单模型及价格明细；再显示一个总价不是增量。设想将每次估算关联价格文件指纹、计价来源、重算时间与未定价调用数，在界面明确显示历史重估和覆盖缺口，再让用户决定去核官方账单或继续观察。对照现有费用显示，在价格变更、未知模型、坏日志及账单折扣下比较漏判与对账时间；若无法对应实际价格版本、未知显示为零成本或增加误导则否定。先核 UI 是否已有等价元数据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:199-225](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L199-L225)

当前表加载与回退。

<details>
<summary>查看原文（27行）</summary>

```text
 * 读取/热重载 pricing.json。
 * mtime 未变 → 直接返回缓存；变了 → 重新解析编译；读不到或全表非法 → 用内置兜底价。
 * @returns {{ peakWindows: Array<{startHour:number,endHour:number}>, models: Array<object> }} 编译后的计价表
 */
export function pricingTable() {
  let mtime = -1;
  try {
    mtime = statSync(PRICING_PATH).mtimeMs;
  } catch {
    mtime = -1; // 文件不存在
  }
  if (mtime !== -1 && mtime === pricingState.fileMtime) return pricingState.table;
  if (mtime === -1) {
    if (pricingState.fileMtime !== -1 || pricingState.table !== FALLBACK_PRICING) {
      console.warn(`dsh-WallpaperAndCost: 找不到 ${PRICING_FILE}，已回退到内置 flash 价`);
    }
    pricingState = { table: FALLBACK_PRICING, fingerprint: fingerprintOf(FALLBACK_PRICING), fileMtime: -1 };
    return pricingState.table;
  }
  try {
    const compiled = compilePricing(JSON.parse(readFileSync(PRICING_PATH, "utf8")));
    if (compiled === null) throw new Error("no usable model rule");
    pricingState = { table: compiled, fingerprint: fingerprintOf(compiled), fileMtime: mtime };
  } catch (error) {
    console.warn(`dsh-WallpaperAndCost: ${PRICING_FILE} 解析失败，已回退到内置 flash 价`, error instanceof Error ? error.message : error);
    pricingState = { table: FALLBACK_PRICING, fingerprint: fingerprintOf(FALLBACK_PRICING), fileMtime: mtime };
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:360-389](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L360-L389)

未定价与总价。

<details>
<summary>查看原文（30行）</summary>

```text
export function priceEventInto(record, event) {
  const data = event && typeof event === "object" ? event.data : void 0;
  const usage = data && typeof data === "object" ? data.usage : void 0;
  if (!usage || typeof usage !== "object") return false;
  const input = toFinite(usage.inputTokens);
  const output = toFinite(usage.outputTokens);
  if (!Number.isFinite(input) && !Number.isFinite(output)) return false;
  const cacheRead = Math.max(0, toFinite(usage.cacheReadTokens) || 0);
  // `usage.inputTokens` is already the uncached (cache-miss) portion — the
  // token-meter usage projection maps it straight to `uncachedInputTokens` —
  // so it must NOT be reduced by cacheRead again.
  const uncached = Number.isFinite(input) ? input : 0;
  const out = Number.isFinite(output) ? output : 0;
  const rawModel = typeof data.message?.source?.model === "string" ? data.message.source.model : "unknown";
  const id = normalizeModel(rawModel);
  const at = typeof event.time === "number" ? event.time : Date.now();
  const p = priceAt(id, at);

  record.calls += 1;
  record.inputTokens += uncached;
  record.cacheReadTokens += cacheRead;
  record.outputTokens += out;

  let cost = 0;
  if (p === null) {
    record.unpricedCalls += 1;
  } else {
    cost = (uncached * p.input + cacheRead * p.cacheRead + out * p.output) / 1e6;// 费用 = tokens × 单价 ÷ 1M
    record.cost += cost;
    record.costUsd += cost / REFERENCE_USD_CNY;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:716-750](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/index.js#L716-L750)

日志与价格指纹缓存。

<details>
<summary>查看原文（35行）</summary>

```text
// 重放某会话的历史日志：把每条 AI 消息都算一遍钱，费用覆盖整个会话(含插件加载前的消息)；
// 带缓存：日志版本或价格指纹没变就直接用上次结果，且两次重放至少隔 2 秒；读不了返回 null
async function replaySessionCost(ctx, sessionId) {
  const persistence = ctx.get("sessionPersistence");
  if (persistence === void 0 || typeof persistence.readRaw !== "function" || typeof persistence.readStoredRevision !== "function") {
    return null;
  }
  let revision;
  try {
    revision = await persistence.readStoredRevision(sessionId);
  } catch (error) {
    ctx.logger.warn("dsh-WallpaperAndCost: failed to read session log revision");
    ctx.logger.warn(error);
    return null;
  }
  if (revision === void 0) return null;
  const state = refreshPriceRules();
  const cached = logCostCache.get(sessionId);
  if (cached !== void 0) {
    if (cached.revision === revision && cached.fingerprint === state.fingerprint) return cached;
    if (Date.now() - cached.at < REPLAY_MIN_INTERVAL_MS) return cached;
  }
  try {
    const raw = await persistence.readRaw(sessionId);
    if (raw === void 0 || raw === null || typeof raw.content !== "string") return null;
    const record = emptyRecord();
    for (const line of raw.content.split("\n")) {
      if (line === "") continue;
      let event;
      try {
        event = JSON.parse(line);
      } catch {
        continue;
      }
      if (event === null || typeof event !== "object" || event.type !== "assistant/message") continue;
```

</details>

**依据 4 · 源码核查**：[lib/client.js:2100-2113](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/5fa96d0a8f11240b625d79f515b924d11042d151/lib/client.js#L2100-L2113)

已有会话费用显示入口。

<details>
<summary>查看原文（14行）</summary>

```text
      var refreshCost = useCallback(
        function () {
          if (!sessionId) return;
          fetch(
            "/api/deepseek-session-cost?sessionId=" + encodeURIComponent(sessionId),
            { headers: { Accept: "application/json" } }
          )
            .then(function (r) {
              return r.json();
            })
            .then(function (d) {
              if (d && d.ok) setCost(d);
            })
            .catch(function () {});
```

</details>

#### 缺口

- 未穷尽 UI 明细和没有原型
  **影响**：新增性与效果未验证
  **进一步探讨**：先核 UI 再用脱敏日志对照账单。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
