# dsh-plugin-tavily

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[b759f32](https://github.com/1624318455/dsh-plugin-tavily/tree/b759f328e21c7dbc24da5f2266e84c2da4d227f8)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily)
<!-- END META -->

> **实现功能**：接管 DSH web_search 的 Tavily provider，并提供可选提取服务、设置卡和主机探测路由。

> **核心亮点**：整合搜索、提取、参数配置、多键轮换与回退，详见[Q01](#research-q01)。

> **风险与缺陷**：无 key search 在 HTTP 前抛缺凭据；符合持久缓存写入条件时原始 API key 会作为 JSON 键落盘；详见[Q02](#research-q02)。

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
  - [Q01 · 搜索/提取和 GUI 实际接入路径是什么？](#detail-section-11)
  - [Q02 · 无密钥搜索和持久缓存凭据安全是否与说明一致？](#detail-section-12)
  - [Q03 · 多键、回退、API 路由与成本如何界定？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中用 Tavily 网页检索并可配置页面提取与费用控制。

DSH 内建 DeepSeek web_search 或单独配置 Tavily 调用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 实现 | 边界 |
| --- | --- | --- |
| 搜索 | Tavily provider | 无 key 实际失败 |
| 提取 | Tavily/Firecrawl fetch | 外部费用 |
| 缓存 | TTL/LRU 与可选写盘 | 原始 key 落盘 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH web、webServer、settings 与 credentials | 必需 | 注册搜索、设置及路由 | 缺失时包无法按声明接入 |
| Tavily API key/额度 | 搜索必需 | 真实 web_search 请求 | 无 key 在请求前失败 |
| Firecrawl key/服务 | 仅启用该 fetch 时 | 页面提取 | 不用该 provider 不需要 |
| DeepSeek provider | 仅启用 fallbackEngine 时 | 部分网络/5xx 回退 | 无则该回退不可用 |
| GUI allowlist 宿主补丁 | 仅使用网页设置卡时 | 让卡可见 | 不同宿主版本需核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员核宿主版本、额度与凭据存放；先禁用 cacheFile | key 存入受控凭据位置；不把 probe 当免费 |
| 加载 | 管理员安装 patch，按需处理 GUI allowlist | 搜索 provider 可选；GUI 可见性单独核 |
| 任务 | 用户以测试查询做 Tavily search，按需提取 | 确认响应、计量与回退条件 |
| 验收/恢复 | 管理员核用量、失败码及缓存文件 | 若见凭据落盘立即停用 cacheFile 并处置 key |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Tavily API key/额度；可选 Firecrawl key，具体价格未知 | 安装 bundle patch，配置 key、GUI allowlist 与可选 cacheFile；人工耗时未知 | 宿主版本/许可及启用缓存前的凭据审查未验证 |
| 持续使用 | Tavily 搜索/提取请求、可选 Firecrawl 请求、缓存磁盘与网络；单位价格及频次未知 | 监测配额、缓存内容、轮换及失败回退；工时未知 | probe 可能发起付费搜索；不同请求的单位成本未测 |
| 失败恢复 | 重试/轮换/回退可能追加外部请求及额度；金额未知 | 禁用 cacheFile、轮换疑似泄露的 key，排查认证/GUI 补丁；耗时未知 | 原始 key 写盘路径需先父侧复核与环境处置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 搜索和提取接入 | Q01 源码证明 provider/路由注册 | 真实搜索质量与单位价格 |
| 多键与有条件回退 | Q03 源码证明对应分支 | 成功率、额外请求成本 |
| keyless 与持久缓存 | Q02 源码显示 keyless search 失败且原 key 可落盘 | 宿主额外保护与已部署暴露范围 |

> **思考**：无 key search 在 HTTP 前抛缺凭据；符合持久缓存写入条件时原始 API key 会作为 JSON 键落盘；详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：整合搜索、提取、参数配置、多键轮换与回退，详见[Q01](#research-q01)。

整合搜索、提取、参数配置、多键轮换与回退，详见[Q01](#research-q01)。

搜索 key ring、429 重试、按故障分类回退；缓存可落盘且键含敏感数据。

<a id="detail-section-5"></a>

### 1.4 主要限制

无 key search 在 HTTP 前抛缺凭据；符合持久缓存写入条件时原始 API key 会作为 JSON 键落盘；详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

待修复缓存与 keyless；需用真实凭据在受控 Profile 验证搜索/提取/回退及 API 权限；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态源码显示无 key search 与说明不符；当缓存启用、非空 cacheFile 已配置、成功结果入缓存且写盘成功时，缓存 JSON 键含原始 API key。GUI 需宿主 allowlist 补丁；未做真实调用或观察到实际泄漏。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/index.ts、src/provider.ts、src/client/index.ts、src/client/TavilyCard.tsx、tests/smoke.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的源码和文档；未调用 Tavily/Firecrawl 或运行宿主。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。 父侧已接受上述条件性源码风险及 not_recommended 依据；未声称真实密钥泄漏。
- 下一步：隔离无 key 搜索、cacheFile 凭据扫描、GUI allowlist、路由认证/CSRF、付费 probe 计费。

**分析版本**

- **仓库**：[1624318455/dsh-plugin-tavily](https://github.com/1624318455/dsh-plugin-tavily)
- **版本号**：0.6.2（[固定提交 b759f32](https://github.com/1624318455/dsh-plugin-tavily/tree/b759f328e21c7dbc24da5f2266e84c2da4d227f8)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

对缓存 key 使用不可逆标识、明确无 key 搜索路径并以正式扩展机制显示 GUI，可改善可用性和凭据边界；待验证，详见[Q02](#research-q02)。

隔离无 key 搜索、cacheFile 凭据扫描、GUI allowlist、路由认证/CSRF、付费 probe 计费。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 1 | 2690 | 2395 | 411 | — |
| .mjs | source | 3 | 1734 | 1330 | 399 | — |
| .md | source | 2 | 601 | — | — | 9088 |
| .ts | source | 10 | 4299 | 2914 | 1152 | — |
| .tsx | source | 3 | 1002 | 852 | 131 | — |
| .mjs | test | 5 | 812 | 556 | 200 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily/issues?q=is%3Aissue+created%3A2026-09-22T07%3A33%3A21.435Z..2026-10-22T07%3A33%3A21.435Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A33%3A21.435Z..2026-10-22T07%3A33%3A21.435Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核实 Tavily 搜索/提取接入、keyless 声明、持久缓存凭据及宿主 GUI 前提。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 搜索/提取和 GUI 实际接入路径是什么？

**研究主题：**场景与需求、贡献与相对优势、功能与机制

#### 完整回答

bundle patch 将 web.searchProvider 设为 tavily；插件注册 Tavily 搜索、Tavily Extract、Firecrawl fetch provider，并安装配置 section、probe/status 路由。提供参数卡、引擎切换、重试、缓存和多密钥轮换。网页 GUI 还受宿主 apiproxy WEB_SETTINGS_NAMESPACES allowlist 限制，README 让用户补丁修改安装的宿主文件；因此当前提交的“安装即用 GUI”取决于该手工补丁和宿主版本。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-16](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/cordis.patch.yml#L1-L16)

选主搜索并插入插件。

<details>
<summary>查看原文（16行）</summary>

```text
# dsh-plugin-tavily bundle: register the Tavily search provider into the ctx.web seam
# AND elect Tavily as the active web_search provider.
#
# The `web` row below is what makes web_search actually answer through Tavily. Without
# it, web_search keeps using the built-in DeepSeek provider (the source of confusing
# "no DeepSeek API key" errors). Installing this plugin now selects Tavily for you, so
# no manual yaml / DSH_WEB_SEARCH_PROVIDER edit is required — fill a key in the card
# and search. The card's Tavily/DeepSeek switch then picks which engine answers
# underneath (Tavily by default; official DeepSeek when switched off).
- id: web
  config:
    searchProvider: tavily

- insert:
    - id: web-search-tavily
      name: '@dsh-external/dsh-plugin-tavily'
```

</details>

**依据 2 · 源码核查**：[src/index.ts:364-438](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/index.ts#L364-L438)

三 provider、设置节与路由。

<details>
<summary>查看原文（75行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const entry = config
  let current: () => Config = () => config
  installSettingsSection(ctx, WEB_SEARCH_TAVILY_SETTINGS_NAMESPACE, Config, config, {
    setSource: (source) => {
      current = source
    },
    // The registration carries no resolved value: the provider projects the
    // section per search, so a committed change needs no re-registration.
    onChange: () => {},
  })
  const provider = new TavilySearchProvider(
    () => resolveOptions(ctx, current(), entry),
    // When the card's engine switch is `deepseek`, answer through the official
    // DeepSeek provider (the one registered by dsh-web-search-deepseek).
    () => deepseekSearch(ctx),
  )
  ctx.web.registerSearchProvider(provider)
  // Dual-half: also register a Tavily Extract-backed fetch provider. Selecting
  // it is opt-in via `fetchProvider: tavily-extract` (or DSH_WEB_FETCH_PROVIDER).
  ctx.web.registerFetchProvider(
    new TavilyExtractProvider(() => resolveOptions(ctx, current(), entry)),
  )
  // Optional second fetch provider: Firecrawl-backed page retrieval, inert
  // until `fetchProvider: firecrawl` is selected AND its own key resolves.
  ctx.web.registerFetchProvider(
    new FirecrawlFetchProvider(() => resolveFirecrawlOptions(ctx, current(), entry)),
  )
  // Server-side probe so the card can test a stored key (browsers cannot read
  // stored secrets back). POST /api/tavily-probe { apiKey?, clearKey? }.
  ctx.webServer.register({
    kind: 'exact',
    path: '/api/tavily-probe',
    handler: async (req, res) => {
      if (req.method !== 'POST') {
        sendJson(res, 405, { ok: false, code: 'other', error: 'method not allowed' })
        return
      }
      try {
        const body = await readJsonBody(req)
        const draft = typeof body.apiKey === 'string' ? body.apiKey : undefined
        const clearKey = body.clearKey === true
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify(await provider.probe(draft, clearKey)))
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error)
        if (detail === 'invalid JSON body' || detail === 'body too large') {
          sendJson(res, 400, { ok: false, code: 'other', error: detail })
          return
        }
        sendJson(res, 200, { ok: false, code: 'other', error: detail })
      }
    },
  })
  // Server-side status for the card's indicator: GET /api/tavily-status reads
  // the stored key (browsers cannot read it) and Tavily GET /usage — which
  // costs no search credits — then reports ok/low/error in a structured payload.
  ctx.webServer.register({
    kind: 'exact',
    path: '/api/tavily-status',
    handler: async (req, res) => {
      if (req.method !== 'GET') {
        sendJson(res, 405, { ok: false, code: 'other', error: 'method not allowed' })
        return
      }
      try {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify(await provider.status()))
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error)
        sendJson(res, 200, { ok: false, code: 'other', error: detail, checkedAt: Date.now() })
      }
    },
  })
  warnIfNotActiveSearchProvider(ctx)
```

</details>

**依据 3 · 作者声明**：[README.md:216-237](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/README.md#L216-L237)

GUI allowlist 手工补丁。

<details>
<summary>查看原文（22行）</summary>

````text
## Platform note (web GUI card visibility)

The web GUI serves a plugin's settings section to the browser only when its namespace is on the apiproxy allowlist (`WEB_SETTINGS_NAMESPACES` in `@deepseek-ai/dsh-host-apiproxy`). As of `0.1.0-rc.6` that list is hardcoded and the "let a plugin expose its own configuration" mechanism is deferred, so a freshly installed third-party card is filtered out even though the section is registered host-side. To make the **Web search (Tavily)** card render, add the namespace to the allowlist in your installed copy and restart dsh:

```js
// ~/.dsh/profiles/node_modules/@deepseek-ai/dsh-host-apiproxy/lib/index.js
// in the WEB_SETTINGS_NAMESPACES array:
"web-search-deepseek",
"web-search-tavily",   // ← add this line
```

The provider and all of its functionality work without this patch; only the GUI card is hidden. The patch is overwritten by `pnpm install --force` and by harness upgrades, so re-apply it after re-installing dependencies.

**Apply it with the included script** (idempotent; `--check` only reports):

```sh
node scripts/patch-apiproxy.mjs --check    # report whether a patch is needed
node scripts/patch-apiproxy.mjs            # patch every installed profile copy
node scripts/patch-apiproxy.mjs --profile web   # patch one profile
```

> **Server-side test of a stored key.** This plugin registers a host probe `POST /api/tavily-probe` that can test Tavily with a **stored** key server-side (keyless when none is set); `TavilySearchProvider.connectivityTest()` / `probe()` / `usage()` / `status()` are the programmatic host-side paths, and `GET /api/tavily-status` backs the card's status indicator. The browser cannot read stored secrets back, so the card's `Test API connection` button still requires re-entering an already-configured key.
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 无密钥搜索和持久缓存凭据安全是否与说明一致？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

README 多处称未配置 key 时 Tavily 搜索可 keyless，probe 的确能无 key 发请求；但 search 在进入 HTTP 前调用 requestKeyRing，若无 literal/credential/env key 就抛 WEB_PROVIDER_CREDENTIAL_MISSING，因此真正 web_search 的 keyless 路径在固定源码中不成立。缓存指纹 JSON 明文包含 apiKey；仅当缓存启用、非空 cacheFile 已配置、成功结果进入缓存且持久化写入成功时，schedulePersist 才把以该指纹为键的 entries 写入 JSON；此时文件键含原始 API key，并可能带 query/结果，与“凭据仅留 store/environment”预期冲突。应在修复前关闭 cacheFile，不把无 key 行为当可用。 这里是固定源码条件性数据流判断，未取得真实密钥或观察已部署泄漏。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-28](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/README.md#L11-L28)

keyless/凭据处理声明。

<details>
<summary>查看原文（18行）</summary>

```text
- **Install-and-use (no manual config)**: installing this plugin **auto-selects Tavily as the `web_search` provider** via its `cordis.patch.yml`. Paste a key in the card and search — no yaml or `DSH_WEB_SEARCH_PROVIDER` edits required.
- **Tavily/DeepSeek engine switch**: a GUI switch answers `web_search` with Tavily (default; keyless if no key) or falls back to the **official DeepSeek** provider — no uninstall needed. This is a real provider-switch UI, not a config file edit.
- **Server-side connectivity probe**: `POST /api/tavily-probe` lets the card test a **stored** key (browsers cannot read stored secrets), using keyless mode when none is set.
- **Status indicator**: a `GET /api/tavily-status` route reads the stored key and Tavily `GET /usage` (no search credits) and the card shows a live ✅/⚠️/❌ badge (normal / credits low / API error, or "no key"), refreshed by the host without re-entering the key.
- **Full professional parameter set in the GUI**: API key, API Base URL, `maxResults`, `searchDepth` (basic/advanced/fast/ultra-fast), `topic`, `includeAnswer`, `includeRawContent`, `timeout`, `days`, `chunksPerSource`, `timeRange`, `startDate`/`endDate`, `includeImages`, `includeDomains`/`excludeDomains`, and `country` are editable from the card; advanced fields are tucked into a collapsed `<details>` block so ordinary users are not overwhelmed.
- **Parameter presets**: one click stages a bundle of advanced values — **Deep research** (advanced depth, more results, raw content), **Quick summary** (basic depth, few results, detailed answer), **Live news** (news topic, day window) — then press Save; yaml-pinned fields are left alone.
- **Configuration-first priority**: `cordis.patch.yml` > WebUI > code defaults. Any field explicitly set in the yaml is shown disabled on the card with a "covered by config file" badge, so a stale UI value can never shadow a developer's pinned config.
- **API connectivity test**: a lightweight `Test API connection` button checks the currently entered key/base URL directly from the browser and reports success or the API error, now **classified** (invalid key / insufficient credits / rate limited / service down / timeout / network) with a targeted explanation per case. Stored keys cannot be read back by the browser by design, so testing an already-configured key requires re-entering it once (it is not saved again).
- **Usage & cost panel**: the card shows a live per-search credit/token estimate for the current settings, plus a `Check usage` button that reads Tavily `GET /usage` (remaining credits, search usage, plan) with the currently entered key. A host-side `usage()` method on the provider exposes the same data where the stored key is available.
- **Page extraction**: a Tavily Extract-backed fetch provider (`tavily-extract`) reads a full page from a URL and returns it as clean text/html — select it once and URL retrieval is answered by Tavily.
- **Optional Firecrawl extraction**: an alternative fetch provider (`firecrawl`) scrapes a page via Firecrawl `POST /scrape` (markdown, main content) — selectable when Tavily extracts a page poorly. It registers under its own id and credential (default ref `FIRECRAWL_API_KEY`); search always stays on Tavily. Inert until selected.
- **Persistent result cache**: `cacheFile` persists the TTL/LRU search cache to a JSON file (survives restarts; `~/` expands, relative paths resolve against the working directory). Best-effort and debounced — a failing disk never breaks a search. Off by default.
- **Rate-limit retry & cache**: extra attempts after a 429 response honor Tavily's `retry-after` with a bounded backoff, and an optional TTL cache serves identical searches to save credits — LRU-capped (default 200 entries) and, by default, skipped entirely for recency-sensitive searches (news/finance topics or any time window) so a "right now" question never gets a stale snapshot.
- **Concise debug logging**: an opt-in `debug` switch logs one readable line per search/extract (query excerpt, depth, credits, cache state, duration, classified error) — never the API key or raw response bodies.
- **Multi-key rotation & failover**: `apiKeyRefs` lists extra credential references (refs only — keys stay in the credentials store/environment) forming a rotation ring with the literal key and `apiKeyEnv`. A search rotates through the ring on key-level failures (429 / invalid key / insufficient credits); a key that fails 3 times in a row enters a 60s cooldown so the healthy keys take over.
- **Footnote citations**: `citeFormat: footnote` appends a numbered source block to the generated answer (`Sources:\n[1] title — url…`), so the model can cite sources by number; `plain` (default) keeps the answer alone.
- **Automatic fallback engine**: `fallbackEngine: deepseek` answers a search through the official DeepSeek provider when Tavily fails with a service-side problem (timeout / network / 5xx). Key-level faults (429/401) never trigger the fallback — they are credential problems, not outages.
- **Credential-first key handling**: per-search resolution order is literal `apiKey` → credentials service (`apiKeyEnv`) → `process.env[apiKeyEnv]`.
```

</details>

**依据 2 · 源码核查**：[src/provider.ts:398-425](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/provider.ts#L398-L425)

search 首先取 key ring。

<details>
<summary>查看原文（28行）</summary>

```text
  async search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult> {
    const options = this.resolveOptions()
    const started = Date.now()
    // The card's engine switch: `tavily` (default) answers through Tavily
    // (keyless if no key); `deepseek` answers through the official DeepSeek
    // provider. One switch, no overlapping modes.
    const enabled = await (options.resolveEnabled?.() ?? Promise.resolve(true))
    if (!enabled) {
      const deepseek = this.deepseekDelegate?.()
      if (deepseek === undefined) {
        throw new WebError(
          'Tavily is switched to the official DeepSeek provider, but no DeepSeek search is available;'
          + ' configure a DeepSeek key or switch back to Tavily',
          'WEB_PROVIDER_ERROR',
        )
      }
      const delegated = await deepseek(request, signal)
      if (delegated === undefined) {
        throw new WebError('official DeepSeek search returned no result', 'WEB_PROVIDER_ERROR')
      }
      debugLog(options, `search "${truncateQuery(request.query)}" -> deepseek engine, ${Date.now() - started}ms, ${delegated.sources.length} sources`)
      return delegated
    }
    // The rotation ring: literal key first, then every configured credential
    // reference. A search rotates through the ring on key-level failures.
    const keys = await requestKeyRing(options, signal)
    const stats: SearchStats = { cache: 'disabled' }
    const startIndex = this.rotationCursor % keys.length
```

</details>

**依据 3 · 源码核查**：[src/provider.ts:1230-1250](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/provider.ts#L1230-L1250)

空 ring 抛缺凭据。

<details>
<summary>查看原文（21行）</summary>

```text
  throwIfSearchAborted(signal)
  const ring: string[] = []
  const literal = options.apiKey
  if (literal !== undefined && literal.length > 0) ring.push(literal)
  if (options.resolveKeyRefs !== undefined) {
    const refs = [...new Set([
      ...(options.apiKeyRefs ?? []),
      options.apiKeyEnv ?? TAVILY_DEFAULT_API_KEY_ENV,
    ])]
    if (refs.length > 0) {
      const resolved = await abortable(options.resolveKeyRefs(refs), signal)
      for (const value of resolved) {
        if (value !== undefined && value.length > 0 && !ring.includes(value)) ring.push(value)
      }
    }
  } else {
    const single = await abortable(options.resolveApiKey?.() ?? Promise.resolve(undefined), signal)
    if (single !== undefined && single.length > 0 && !ring.includes(single)) ring.push(single)
  }
  if (ring.length === 0) throw credentialMissingError(options)
  return ring
```

</details>

**依据 4 · 源码核查**：[src/provider.ts:707-744](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/provider.ts#L707-L744)

probe 可无 key。

<details>
<summary>查看原文（38行）</summary>

```text
  async probe(
    draft?: string,
    clearKey = false,
  ): Promise<{ ok: boolean; mode: 'key' | 'keyless'; code?: string; error?: string }> {
    const options = this.resolveOptions()
    let apiKey = draft?.trim() ?? ''
    if (apiKey === '' && !clearKey) {
      try {
        apiKey = await resolveRequestApiKey(options)
      } catch (_resolveFailure) {
        apiKey = ''
      }
    }
    const mode: 'key' | 'keyless' = apiKey.length > 0 ? 'key' : 'keyless'
    try {
      const { signal: requestSignal, timeoutSignal } = makeRequestSignal(undefined, options.timeout)
      const headers: Record<string, string> = {
        'content-type': 'application/json',
        'accept': 'application/json',
        'user-agent': USER_AGENT,
      }
      let response: Response
      try {
        response = await fetch(`${options.baseURL}/search`, {
          method: 'POST',
          redirect: 'error',
          headers: apiKey.length > 0
            ? { ...headers, 'authorization': `Bearer ${apiKey}` }
            : headers,
          body: JSON.stringify({
            query: 'tavily',
            search_depth: 'basic',
            topic: 'general',
            include_answer: false,
            max_results: 1,
          }),
          ...requestSignal !== undefined ? { signal: requestSignal } : {},
        })
```

</details>

**依据 5 · 源码核查**：[src/provider.ts:773-799](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/provider.ts#L773-L799)

指纹含 raw apiKey。

<details>
<summary>查看原文（27行）</summary>

```text
  private cacheFingerprint(
    request: WebSearchRequest,
    options: TavilySearchProviderOptions,
    maxResults: number | undefined,
    apiKey: string,
  ): string {
    return JSON.stringify({
      query: request.query,
      maxResults,
      searchDepth: options.searchDepth,
      topic: options.topic,
      includeAnswer: options.includeAnswer,
      includeRawContent: options.includeRawContent,
      days: options.days,
      chunksPerSource: options.chunksPerSource,
      timeRange: options.timeRange,
      startDate: options.startDate,
      endDate: options.endDate,
      includeImages: options.includeImages,
      includeImageDescriptions: options.includeImageDescriptions,
      includeFavicon: options.includeFavicon,
      includeDomains: options.includeDomains,
      excludeDomains: options.excludeDomains,
      country: options.country,
      baseURL: options.baseURL,
      apiKey,
    })
```

</details>

**依据 6 · 源码核查**：[src/provider.ts:952-969](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/provider.ts#L952-L969)

缓存键写入 cacheFile。

<details>
<summary>查看原文（18行）</summary>

```text
  private schedulePersist(): void {
    if (this.cacheFile === undefined || this.cacheFile.length === 0) return
    this.cacheDirty = true
    if (this.persistTimer !== undefined) return
    this.persistTimer = setTimeout(() => {
      this.persistTimer = undefined
      if (!this.cacheDirty) return
      this.cacheDirty = false
      try {
        const entries: PersistedCache['entries'] = {}
        const now = Date.now()
        for (const [key, entry] of this.cache) {
          if (entry.expires > now) entries[key] = { expires: entry.expires, result: entry.result }
        }
        const file = expandHome(this.cacheFile!)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, JSON.stringify({ entries }), 'utf8')
        debugLog(this.resolveOptions(), `cache persisted ${Object.keys(entries).length} entries to ${file}`)
```

</details>

**依据 7 · 源码核查**：[src/provider.ts:810-832](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/provider.ts#L810-L832)

启用条件与缓存命中在网络请求前返回。

<details>
<summary>查看原文（23行）</summary>

```text
    // A per-request bound wins over the configured default; either may be absent.
    const maxResults = request.maxResults ?? options.maxResults ?? options.numResults
    const cacheTtl = options.cacheTtlMs ?? TAVILY_DEFAULT_CACHE_TTL_MS
    // Recency-sensitive searches never touch the cache: a snapshot from
    // seconds ago would betray a "right now" question.
    const freshSensitive = options.cacheBypassFresh !== false && isFreshSensitive(options)
    const cacheEnabled = cacheTtl > 0 && !freshSensitive
    stats.cache = freshSensitive ? 'bypassed' : 'disabled'
    const cacheKey = cacheEnabled
      ? this.cacheFingerprint(request, options, maxResults, apiKey)
      : undefined
    if (cacheKey !== undefined) {
      this.loadPersistedCache(options)
      const hit = this.cache.get(cacheKey)
      if (hit !== undefined && hit.expires > Date.now()) {
        // Move-to-front so the LRU eviction below drops the truly oldest entry.
        this.cache.delete(cacheKey)
        this.cache.set(cacheKey, hit)
        stats.cache = 'hit'
        return hit.result
      }
    }

```

</details>

#### 缺口

- 未运行无密钥调用或检查落盘文件
  **影响：**宿主额外 keyless 处理/磁盘权限效果未知
  **进一步探讨：**隔离测试无 key 搜索及 cacheFile 内容

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多键、回退、API 路由与成本如何界定？

**研究主题：**依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

搜索遇 key-level 失败轮换密钥、三次连续失败冷却 60 秒；429 可按 retry-after 重试。仅服务侧超时/网络/5xx 且配置 fallbackEngine=deepseek 时委托官方 provider，key 错误不回退。status 使用存储 key 读 usage，probe 可用存储 key 发一次付费 search；路由代码只校验 method/请求体，没有可见的路由内身份/CSRF 控制，实际保护要看宿主 webServer。Tavily 搜索/提取与 Firecrawl 都需外部额度及隐私审查，cache 查询内容需特别注意。

成本分期：首次使用涉及Tavily API key/额度；可选 Firecrawl key，具体价格未知，人工需安装 bundle patch，配置 key、GUI allowlist 与可选 cacheFile；人工耗时未知；持续使用涉及Tavily 搜索/提取请求、可选 Firecrawl 请求、缓存磁盘与网络；单位价格及频次未知，人工需监测配额、缓存内容、轮换及失败回退；工时未知；失败恢复涉及重试/轮换/回退可能追加外部请求及额度；金额未知，人工需禁用 cacheFile、轮换疑似泄露的 key，排查认证/GUI 补丁；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：已知 Q02 源码显示 cacheFile 持久化含 raw apiKey 的指纹，且无 key search 在 HTTP 前失败；相对现有缓存与配置入口，若改用不含凭据的稳定摘要并显式区分无 key probe/search，可保留复用与诊断而收窄凭据暴露。条件是迁移旧缓存键、避免跨 key 污染并承担开发与回归成本。最小证伪：在隔离临时缓存中用两枚测试 key、相同查询及无 key 场景，检查文件不含原 key、缓存不跨 key 命中且 search 错误与文档一致；任一原 key 留盘或跨 key 命中即推翻此设计假设。此为工程修复假设，不能据此宣称新搜索算法。

#### 证据与依据

**依据 1 · 源码核查**：[src/provider.ts:421-492](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/provider.ts#L421-L492)

轮换与有限回退。

<details>
<summary>查看原文（72行）</summary>

```text
    // The rotation ring: literal key first, then every configured credential
    // reference. A search rotates through the ring on key-level failures.
    const keys = await requestKeyRing(options, signal)
    const stats: SearchStats = { cache: 'disabled' }
    const startIndex = this.rotationCursor % keys.length
    let lastFailure: WebError | undefined
    for (let i = 0; i < keys.length; i++) {
      const key = keys[(startIndex + i) % keys.length]
      if (this.keyCooldownUntil(key) > Date.now()) continue
      try {
        const result = await this.tavilySearch(request, signal, options, key, stats)
        this.noteKeySuccess(key)
        this.rotationCursor = (startIndex + i + 1) % keys.length
        debugLog(
          options,
          `search "${truncateQuery(request.query)}" depth=${options.searchDepth} `
          + `results=${result.sources.length} credits=${estimateSearchCredits(options.searchDepth)} `
          + `cache=${stats.cache} ${Date.now() - started}ms`,
        )
        return result
      } catch (error: unknown) {
        const code = tavilyCodeOf(error)
        if (code !== undefined && isRotatableCode(code)) {
          // Key-level failure: another key in the ring may still work.
          this.noteKeyFailure(key)
          debugLog(options, `search "${truncateQuery(request.query)}" key rotated (${code}): ${describeSearchError(error)}`)
          lastFailure = error instanceof WebError
            ? error
            : new WebError(String(error), 'WEB_PROVIDER_ERROR')
          continue
        }
        debugLog(options, `search "${truncateQuery(request.query)}" failed: ${describeSearchError(error)}`)
        // Rate-limit/credit faults never trigger the fallback engine (they are
        // credential problems); a Tavily-side outage just might.
        const fallen = await this.tryTavilyFallback(options, request, signal, error)
        if (fallen !== undefined) return fallen
        throw error
      }
    }
    // Every ring entry was failed or in cooldown; surface the last failure
    // (or a clear message when the ring held only cooled-down keys).
    if (lastFailure !== undefined) throw lastFailure
    throw new WebError(
      'Tavily search failed: every API key in the rotation ring is in cooldown after repeated failures',
      'WEB_PROVIDER_ERROR',
    )
  }

  /**
   * When the Tavily call failed with a Tavily-side problem and `fallbackEngine`
   * is `deepseek`, answer through the official DeepSeek provider once.
   * @returns the delegated result, or `undefined` when no fallback applies.
   */
  private async tryTavilyFallback(
    options: TavilySearchProviderOptions,
    request: WebSearchRequest,
    signal: AbortSignal | undefined,
    original: unknown,
  ): Promise<WebSearchResult | undefined> {
    if (options.fallbackEngine !== 'deepseek') return undefined
    const code = tavilyCodeOf(original)
    if (code === undefined || !isFallbackCode(code)) return undefined
    const deepseek = this.deepseekDelegate?.()
    if (deepseek === undefined) return undefined
    try {
      const delegated = await deepseek(request, signal)
      if (delegated === undefined) return undefined
      debugLog(options, `search "${truncateQuery(request.query)}" fell back to DeepSeek (${code})`)
      return delegated
    } catch (_delegateFailure) {
      return undefined
    }
```

</details>

**依据 2 · 源码核查**：[src/provider.ts:833-865](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/provider.ts#L833-L865)

429 重试。

<details>
<summary>查看原文（33行）</summary>

```text
    const { signal: requestSignal, timeoutSignal } = makeRequestSignal(signal, options.timeout)
    const maxAttempts = options.retryMaxAttempts ?? TAVILY_DEFAULT_RETRY_MAX_ATTEMPTS
    let attempt = 0
    const requestBody = requestBodyOf(request, options, maxResults)

    for (;;) {
      let response: Response
      try {
        response = await fetch(`${options.baseURL}/search`, {
          method: 'POST',
          redirect: 'error',
          headers: {
            'authorization': `Bearer ${apiKey}`,
            'content-type': 'application/json',
            'accept': 'application/json',
            'user-agent': USER_AGENT,
          },
          body: requestBody,
          ...requestSignal !== undefined ? { signal: requestSignal } : {},
        })
      } catch (error: unknown) {
        throw classifiedSearchError(error, signal, timeoutSignal, options.timeout)
      }

      // Honor a rate-limited response with a bounded backoff before retrying.
      if (response.status === 429 && attempt < maxAttempts) {
        attempt += 1
        await abortableDelay(
          retryDelayMs(response.headers.get('retry-after'), attempt),
          requestSignal,
          timeoutSignal,
          options.timeout,
        )
```

</details>

**依据 3 · 源码核查**：[src/index.ts:392-435](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/index.ts#L392-L435)

probe/status 路由。

<details>
<summary>查看原文（44行）</summary>

```text
  // Server-side probe so the card can test a stored key (browsers cannot read
  // stored secrets back). POST /api/tavily-probe { apiKey?, clearKey? }.
  ctx.webServer.register({
    kind: 'exact',
    path: '/api/tavily-probe',
    handler: async (req, res) => {
      if (req.method !== 'POST') {
        sendJson(res, 405, { ok: false, code: 'other', error: 'method not allowed' })
        return
      }
      try {
        const body = await readJsonBody(req)
        const draft = typeof body.apiKey === 'string' ? body.apiKey : undefined
        const clearKey = body.clearKey === true
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify(await provider.probe(draft, clearKey)))
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error)
        if (detail === 'invalid JSON body' || detail === 'body too large') {
          sendJson(res, 400, { ok: false, code: 'other', error: detail })
          return
        }
        sendJson(res, 200, { ok: false, code: 'other', error: detail })
      }
    },
  })
  // Server-side status for the card's indicator: GET /api/tavily-status reads
  // the stored key (browsers cannot read it) and Tavily GET /usage — which
  // costs no search credits — then reports ok/low/error in a structured payload.
  ctx.webServer.register({
    kind: 'exact',
    path: '/api/tavily-status',
    handler: async (req, res) => {
      if (req.method !== 'GET') {
        sendJson(res, 405, { ok: false, code: 'other', error: 'method not allowed' })
        return
      }
      try {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify(await provider.status()))
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error)
        sendJson(res, 200, { ok: false, code: 'other', error: detail, checkedAt: Date.now() })
      }
```

</details>

**依据 4 · 源码核查**：[src/provider.ts:578-642](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/src/provider.ts#L578-L642)

status 读 usage。

<details>
<summary>查看原文（65行）</summary>

```text
  async status(signal?: AbortSignal): Promise<TavilyStatus> {
    const options = this.resolveOptions()
    const checkedAt = Date.now()
    let apiKey: string
    try {
      apiKey = await resolveRequestApiKey(options, signal)
    } catch (error: unknown) {
      if (error instanceof WebError && error.code === 'WEB_PROVIDER_CREDENTIAL_MISSING') {
        return { ok: false, code: 'no-key', checkedAt }
      }
      return { ok: false, code: 'other', error: String(error), checkedAt }
    }
    const { signal: requestSignal, timeoutSignal } = makeRequestSignal(signal, options.timeout)
    let response: Response
    try {
      response = await fetch(`${options.baseURL}${TAVILY_DEFAULT_USAGE_PATH}`, {
        method: 'GET',
        redirect: 'error',
        headers: {
          'authorization': `Bearer ${apiKey}`,
          'accept': 'application/json',
          'user-agent': USER_AGENT,
        },
        ...requestSignal !== undefined ? { signal: requestSignal } : {},
      })
    } catch (error: unknown) {
      if (timeoutSignal?.aborted === true) {
        return { ok: false, code: 'timeout', error: `timed out after ${options.timeout}ms`, checkedAt }
      }
      debugLog(options, `status failed: network ${String(error)}`)
      return { ok: false, code: 'network', error: String(error), checkedAt }
    }
    if (!response.ok) {
      let message = `HTTP ${response.status}`
      try {
        const parsed = await response.json() as TavilyError
        message = parsed.detail?.error ?? parsed.error ?? parsed.message ?? message
      } catch (_errorBodyReadFailure) {
        // Keep the status message.
      }
      const code = classifyTavilyHttpStatus(response.status, message)
      debugLog(options, `status failed: ${code} ${message}`)
      return { ok: false, code, error: message, checkedAt }
    }
    try {
      const usage = await response.json() as TavilyUsage
      const remaining = usage.key?.usage
      const limit = usage.key?.limit ?? null
      const low = remaining !== undefined && limit !== null && typeof limit === 'number'
        && remaining <= Math.max(1, limit * 0.2)
      debugLog(options, `status ok: remaining=${remaining ?? '?'} limit=${limit ?? 'unlimited'} plan=${usage.account?.current_plan ?? '?'}`)
      return {
        ok: true,
        code: low ? 'low' : 'ok',
        remaining,
        limit,
        searchUsed: usage.key?.search_usage,
        plan: usage.account?.current_plan,
        checkedAt,
      }
    } catch (error: unknown) {
      debugLog(options, `status failed: parse ${String(error)}`)
      return { ok: false, code: 'other', error: String(error), checkedAt }
    }
  }
```

</details>

**依据 5 · 作者声明**：[README.md:115-140](https://github.com/1624318455/dsh-plugin-tavily/blob/b759f328e21c7dbc24da5f2266e84c2da4d227f8/README.md#L115-L140)

费用/参数说明。

<details>
<summary>查看原文（26行）</summary>

```text
  - **Test API connection** — verifies the key/base URL you just entered; failures are classified (invalid key / insufficient credits / rate limited / service down / timeout / network) with a targeted explanation. Testing consumes one Tavily search credit. If a key is already configured but you have not typed one, the card tells you to re-enter it once; the browser intentionally cannot read stored secrets back.
  - **Estimated cost** — a live line shows the estimated credits and rough token count for the current depth/result/chunk settings.
  - **Check usage** — reads Tavily `GET /usage` with the currently entered key and shows the remaining credits, search usage, and plan. Stored keys must be re-entered once, like the connectivity test.
- **Advanced area (`🔧 Advanced Tavily request parameters`)**:
  - **Max results** — how many web results per search (1–20, default 5).
  - **Search depth** — `basic` (balanced), `advanced` (2 credits, deep), `fast`, or `ultra-fast` (1 credit, lowest latency).
  - **Topic** — `general`, `news`, or `finance`.
  - **Generated answer** — `true`/`basic` (quick) or `advanced` (detailed).
  - **Raw page content** — `false`, `markdown`, or `text`; enabling greatly increases context token usage.
  - **Chunks per source** — snippet chunks per source (1–3).
  - **Time range** — recency preset (`day`/`week`/`month`/`year`/`d`/`w`/`m`/`y`).
  - **Start date / End date** — precise `YYYY-MM-DD` publish windows.
  - **Include images / Image descriptions / Include favicon** — request richer result metadata.
  - **Include domains / Exclude domains** — site allow/deny lists.
  - **Country boost** — bias toward one country (general topic).
  - **Rate-limit retries** — extra attempts (0–5) after a 429; waits honor `retry-after` with a bounded backoff.
  - **Cache TTL (seconds)** — cache identical searches to save credits; 0 disables (0–3600).
  - **Cache max entries** — LRU cap on cached searches (1–10000, default 200); the oldest entry evicts past it.
  - **Skip cache for fresh queries** — when on (default), news/finance searches and searches with a time window bypass the cache entirely.
  - **Debug logging** — one concise line per search/extract (query excerpt, credits, cache state, duration, errors); never the key or raw bodies.
  - **Citation format** — `plain` (answer only, default) or `footnote` (appends `[1] title — url…` numbered sources the model can cite).
  - **Fallback engine** — `none` (default) or `DeepSeek (automatic)`: on a Tavily-side failure (timeout/network/5xx) the search is answered by the official DeepSeek provider.
  - **Request timeout (ms)** — default 30000.
  - **Recency window (days)** — optional recency filter for news/finance topics.

Every control has a short hint and a placeholder showing the default. Values are saved with the card's **Save** button and apply live; no service restart is needed.
```

</details>

#### 缺口

- 未调用 Tavily/Firecrawl、未测宿主路由认证
  **影响：**额度、成本和网络面无法确认
  **进一步探讨：**受控 Profile/测试凭据验证访问控制、消耗和回退

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
