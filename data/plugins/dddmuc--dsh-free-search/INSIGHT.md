# dsh-free-search

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[c11ac5b](https://github.com/DDDMUC/dsh-free-search/tree/c11ac5b312bb529294f215f451b2d8879820fdfc)

<!-- BEGIN META -->
[![GitHub ★ 642](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=642&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DDDMUC/dsh-free-search) [![npm 30d 58,071](https://img.shields.io/static/v1?label=npm+30d&message=58%2C071&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search)
<!-- END META -->

> **功能**：为 DSH 接入多种网页搜索引擎，提供动态切换、失败回退与多源检索。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把多引擎、冷却和有限重试接到原生搜索，减少手工更换来源；这不证明每次都成功或总体成本低。

> **主要限制**：[Q02](#research-q02) 全部引擎失败会抛错，multi返回预算没有在所读层取消所有请求；[Q03](#research-q03) 静态免费标签不能保证零费用。

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
  - [Q01 · 核心增量是免费承诺还是多引擎适配？](#detail-section-11)
  - [Q02 · 接管、重试、总预算和最终失败如何实现？](#detail-section-12)
  - [Q03 · 免费、额度与不可信结果的限制是什么？](#detail-section-13)
  - [Q04 · 谁可试用，什么证据支持继续？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：无可用原生搜索provider的个人DSH用户，希望普通web_search仍可返回可核查网页来源。

原生单provider与人工浏览、简单网页抓取；索引服务归上游，免key不等于无限免费。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多引擎回退 | 失败后换来源 | 仍可能全部失败 |
| 多key轮换 | 处理额度与鉴权故障 | 重发会增加资源消耗 |
| 多源检索 | 合并已返回来源 | 返回预算不等同硬支出上限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH web seam | 必需 | 搜索provider注册 | 无法替代原生搜索 |
| 可用引擎与网络 | 必需至少一个 | 获取网页来源 | 可全部失败 |
| 付费引擎账号与key | 选用时必需 | 授权和计费 | 换key或回退仍可能消费 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户只开少数已知引擎 | 核对额度与回退策略 |
| 查询 | Agent用web_search | 查看真实生效源和引用 |
| 失败 | 插件分类重试或回退 | 最终错误由用户接管 |
| 退出 | 用户停用provider | 回原搜索与浏览器 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主和引擎配置 | 选择来源及额度 | 实际耗时未知 |
| 持续使用 | 多源请求、付费key和结果token | 核出处及质量 | 免key非零总成本 |
| 失败恢复 | 重试和key轮换消费 | 查分类与预算后请求 | 全部费用未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可用性退路 | 分类回退与冷却 | 当期引擎和反爬成功率 |
| 多源覆盖 | 并发部分结果合并 | 有效来源增加及全部请求停止 |

> **思考**：[Q02](#research-q02) 全部引擎失败会抛错，multi返回预算没有在所读层取消所有请求；[Q03](#research-q03) 静态免费标签不能保证零费用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把多引擎、冷却和有限重试接到原生搜索，减少手工更换来源；这不证明每次都成功或总体成本低。

[Q02](#research-q02) 共享入口校验、错误分类和取消预算值得借鉴；多层key/引擎重试需统一成本与取消边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 全部引擎失败会抛错，multi返回预算没有在所读层取消所有请求；[Q03](#research-q03) 静态免费标签不能保证零费用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从一个免key源和一个回退开始，比人工搜索的有效引用与总尝试；不要默认大规模并发。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

provider与回退有源码支持；当前引擎可用性、最终质量和总费用未验证，宣传强保证不采信。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/multi_policy.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定注册、串行回退与multi预算片段，Bing实际抓取和不可信正文包装；未逐27引擎验证也未运行服务。
- 下一步：对固定事实题比较原搜索与少源回退，追预算到点后的请求与账单；未执行。

**分析版本**

- **仓库**：[DDDMUC/dsh-free-search](https://github.com/DDDMUC/dsh-free-search)
- **版本号**：0.9.17（[固定提交 c11ac5b](https://github.com/DDDMUC/dsh-free-search/tree/c11ac5b312bb529294f215f451b2d8879820fdfc)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出以合格答案为单位记录全部尝试和费用，并区分响应到点与请求结束；未验证，若不能改善预算判断则否定。

对固定事实题比较原搜索与少源回退，追预算到点后的请求与账单；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1267 | — | — | 20374 |
| .js | source | 13 | 11469 | 9799 | 1430 | — |
| .mjs | source | 31 | 3310 | 2702 | 446 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/DDDMUC/dsh-free-search/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 30](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=30&color=737b86&logo=github)](https://github.com/DDDMUC/dsh-free-search/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=25&color=737b86&logo=github)](https://github.com/DDDMUC/dsh-free-search/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多引擎搜索能否形成有来源、费用透明的合格答案？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 核心增量是免费承诺还是多引擎适配？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是模型供应商没有原生搜索接口或用户不愿另配官方key时仍给DSH web_search提供搜索。相对原生单provider或手写抓网页脚本，本插件统一多个引擎、配置和回退，并把真实生效引擎带回；搜索索引和模型内置搜索属于上游。可确认的是适配与路由便利，不能把名称free-search及README“零成本”当全部任务免费、无限额度或不会失败的保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-40](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/README.md#L19-L40)

作者场景和免费/永不失败主张待检验。

<details>
<summary>查看原文（22行）</summary>

```text
### 为什么需要它

dsh 默认的搜索 provider 依赖 DeepSeek 官方 API key（`DEEPSEEK_API_KEY`）。如果你：
- 没有（或不想用）DeepSeek 官方 key，
- 用的是 opencode-go 这类网关（其 OpenAI 兼容端点不支持 `web_search` 工具），

……那么内置搜索必然失败，agent 会告诉你"无法联网"。

这个插件提供多个免费引擎 + 自动回退，彻底摆脱 DeepSeek 官方 key 的依赖。

### 特性

- **零成本** —— 多个免费引擎，无需 key、无需注册
- **多引擎可选**：DuckDuckGo（html/lite）、Bing、SearXNG（元搜索，支持自定义实例）、AnySearch、Exa、Tavily、Keenable、Firecrawl、Parallel、Perplexity、SerpBase、Serply、DeepSeek 官方、DeepSeek 原生搜索 API、You.com、百度千帆、Kimi、阿里云百炼、火山联网搜索（豆包搜索）、知乎全网/站内（`zhihu_global`/`zhihu_site`，经知乎开放平台 MCP）、OpenAI / Gemini / Claude 模型内置搜索
- **网页设置页** —— 引擎切换 + API key 配置（UI 中 key 脱敏显示"已配置"）+ 中英文切换；入口在左侧「插件」页的组件行配置（`plugins.row.config`，DSH 0.1.7-rc.1+）。远程访问（VPS / 反向代理 / 自定义域名）下也能用：桥接接口沿用宿主的 Host 围栏，`--trusted-host` 与 `--public-url` 声明的地址会放行（#84）
- **右侧浮动目录** —— 卡片右侧的页面留白里浮出「引擎 / 回退 / 语言池 / 搜索行为 / 抓取 / 性能」六个快捷跳转，滚动自动高亮当前项、点击平滑跳转；不占用正文宽度（正文布局与 0.9.6 一致），右侧留白不足时自动隐藏
- **多 key 轮换** —— 任何 key 字段（或对应环境变量）都可以用逗号 / 分号 / 换行分隔多把 key；遇到 401/402/429（鉴权失败、额度耗尽）先轮换同一引擎的下一把，再走引擎回退
- **弹出式切换命令** —— 聊天框输入 `/free-search-engine`，弹出引擎选择窗口，点选即切换（等效设置页 + 保存）
- **引擎测试** —— `free_search_test` 工具让 agent 一键测试所有引擎；设置页也有"测试引擎"按钮（直测当前引擎，不走回退链，付费引擎无 key 会明确报错）
- **全局引擎开关与回退优先级** —— 设置页可勾选/取消引擎（取消后全局生效：普通搜索 / Auto / `advanced_search` / `multi_search` / 引擎测试都不再用它），并可用 ↑↓ 调整全局回退顺序（一键恢复默认）
- **Multi 模式** —— 可把搜索引擎设为 `Multi Search`：`web_search` 按查询语言并发**对应语言池的全部**已启用引擎（不再是前 3 个；中文/英文池可在设置页编辑，每池最低 2 个引擎）、按 URL 合并去重（同站判定用 **eTLD+1**）、跨源命中的结果优先；设置页有 **Fast / Balanced / Deep** 三档强度，也可手填并发上限与目标成功源数；整轮检索共享 **30 秒总预算**，到点返回已有结果（代价是成倍消耗额度；multi 失败会自动退回单引擎回退链）
- **统一引擎回退** —— 任何引擎失败（付费/免费，缺 key/401/限流/网络）自动轮流尝试下一个引擎：首选引擎 → 其他引擎（exa/tavily/keenable/firecrawl/parallel/you 无 key 也会尝试，因为它们自带 keyless 免费额度）→ 剩余免费引擎，搜索永不直接失败；结果顶部注明实际生效的引擎（如 `Note: perplexity unavailable or failed, using exa.`）；失败按类别处理：额度/鉴权失败→本会话冷却该引擎，反爬→短退避，超时/5xx/限流→同引擎重试一次，解析失败/0 结果→不冷却（详见下文「失败分类与引擎冷却」）
```

</details>

**依据 2 · 源码核查**：[lib/index.js:767-785](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L767-L785)

Bing路径实际抓取网页。

<details>
<summary>查看原文（19行）</summary>

```text
async function searchBing(query, maxResults, options, signal) {
  // mkt：仅显式 bingMarket 才发。默认不发——mkt=zh-CN 在部分地区/线路会返回空 SERP 容器
  // （#71：海外 IP + mkt=zh-CN → b_algo=0），Bing 会按 Accept-Language 自行本地化。
  const profile = LANG_PROFILES[searchLanguage(configLanguage(options))];
  const params = new URLSearchParams({ q: query });
  if (options?.bingMarket) params.set("mkt", options.bingMarket);
  // Accept-Language：显式 bingMarket 时按 market 反推（避免中文 header 污染），否则用 lang 档案
  const acceptLang = options?.bingMarket
    ? (MARKET_TO_LANG[options.bingMarket] ?? activeAcceptLanguage)
    : (profile.acceptLang ?? activeAcceptLanguage);
  const adlt = options?.safeSearch ?? "off";
  if (adlt === "off") params.set("adlt", "off");
  else if (adlt === "moderate") params.set("adlt", "moderate");
  else if (adlt === "strict") params.set("adlt", "strict");
  // 注意（2026-10-13 实测）：Bing 会对可疑出口 IP 间歇性返回约 91KB 的「空 SERP」（b_algo 块数 0），
  // 表现为按请求频率收紧、减少请求后又自行恢复。曾加过「空 SERP 时多试一次」的兜底，但实测
  // 请求数翻倍反而更容易被压死，且根因在出口 IP 而非解析，故撤掉——修法应让 bing 不走可疑代理
  // （启动脚本的 NO_PROXY 排除 .bing.com 即可恢复）。
  const html = await fetchHtmlWithRetry(`${BING_URL}?${params}`, signal, acceptLang);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4504-4508](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L4504-L4508)

真实注册原生搜索provider。

```text
  registerOnce(() => ctx.web.registerSearchProvider(provider), provider, "search provider");

  // web_fetch 质量链接管：注册 fs-quality-fetch（直连 → exa contents → firecrawl → crawl4ai），
  // 未设置 fetchProviderId、或仍是出厂默认 http 时接管；已被显式指向其他 provider 时不抢占。
  // 与 web_search 的接管规则同构：运行时兜底，不依赖 bundle patch 是否落地。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 接管、重试、总预算和最终失败如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

provider.search包裹searchOnce，遇可轮换key错误才换key，最多有限尝试；searchOnce校验查询并读取动态配置，过滤冷却引擎。串行引擎链有30秒deadline，剩余预算组成AbortSignal；瞬态非限流错误同引擎重试一次，fallbackOn未包含类别则停止，全部失败最终throw，不是“搜索永不直接失败”。multi路径并发selectedEngines并与30秒计时Promise.race，先处理已返回结果；这一段没有取消未结束请求，所以返回预算不应直接当作全部网络和计费已停止。它有可复用的分类降级，但数量和时间限制须看实际链层级，不能只看宣传。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3930-3953](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L3930-L3953)

外层key轮换和校验。

<details>
<summary>查看原文（24行）</summary>

```text
  const provider = {
    id: "ddg",
    available() {
      return true;
    },
    // 单 query 结果缓存：key=query+maxResults+timeRangeLabel+preferred，Map 天然 LRU
    async search(request, signal) {
      // 轮换时机：首次失败后 keyRings 已经填充，此时再判断有几把 key。
      for (let attempt = 0; attempt < 10; attempt++) {
        try {
          return await provider.searchOnce(request, signal);
        } catch (error) {
          const keys = maxKeyRingLength();
          if (keys <= 1 || attempt >= keys - 1 || !isKeyRotationCandidate(error)) throw error;
          rotateAllKeyRings();
          logger.warn(`free-search: retrying with the next API key (${error?.message ?? error})`);
        }
      }
      throw new Error("all search engines failed");
    },
    async searchOnce(request, signal) {
      // 公共咽喉校验：web_search / advanced_search / raw-search 三条路径都经过这里
      if (request === null || typeof request !== "object" || typeof request.query !== "string" || request.query.trim().length === 0) {
        throw new Error("query is required");
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4055-4080](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L4055-L4080)

冷却、串行deadline与取消。

<details>
<summary>查看原文（26行）</summary>

```text
      // 失败感知回退（#36）：quota/auth/bot-wall 冷却中的引擎本轮直接跳过
      const cooldownNow = Date.now();
      const cooling = chain.filter((engine) => isCoolingDown(engine, cooldownNow));
      if (cooling.length > 0) {
        chain = chain.filter((engine) => !cooling.includes(engine));
        if (cooling.includes(preferred)) {
          preferredFailure = engineCooldowns.get(preferred) === COOLDOWN_SESSION_MS
            ? "after a terminal quota/auth failure"
            : "after an anti-bot block";
          preferredFailureClass = "cooldown";
        }
      }
      if (chain.length === 0) throw new Error("all search engines are unavailable (disabled or cooling down)");
      // 总超时预算：串行回退时限制整条引擎链的总时长，防止各引擎超时累加达分钟级
      const BUDGET_MS = SEARCH_BUDGET_MS;
      const deadline = Date.now() + BUDGET_MS;
      // 可变队列：transient 失败时把同一引擎插回一次再前进（#36）
      const retriedEngines = new Set();
      for (let qi = 0; qi < chain.length; qi++) {
        const engine = chain[qi];
        const remaining = deadline - Date.now();
        if (remaining <= 0) {
          throw new Error(`search timed out after ${BUDGET_MS / 1000}s`);
        }
        // 组合外部取消 signal + 剩余预算超时：官方 web_search 取消、引擎超时、总预算都能触发
        const effSignal = AbortSignal.any([...(signal !== undefined ? [signal] : []), AbortSignal.timeout(remaining)]);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4328-4364](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L4328-L4364)

重试、配置停止与最终抛错。

<details>
<summary>查看原文（37行）</summary>

```text
          lastError = new Error(`engine "${engine}" returned 0 results`);
          if (engine === preferred) { preferredFailure = "returned 0 results"; preferredFailureClass = "invalid-response"; }
          if (!fallbackOnSet.has("invalid-response")) {
            blockedFailure = { engine, failure: { class: "invalid-response", message: "returned 0 results" } };
            logger.warn('free-search: ' + engine + ' returned 0 results and "invalid-response" is not in fallbackOn, stopping');
            break;
          }
          logger.warn(`free-search: ${engine} returned 0 results, trying next engine`);
        } catch (error) {
          lastError = error;
          const failure = classifyFailure(error);
          const message = failure.message;
          if (engine === preferred) { preferredFailure = message; preferredFailureClass = failure.class; }
          applyFailureCooldown(engine, failure.class, failure.rateLimited);
          // transient（超时/5xx/网络）：同引擎重试一次再回退，避免一次抖动丢掉好引擎；
          // 限流（rateLimited）不重试——短窗内再发必再撞，已设 60s 冷却
          if (failure.class === "transient" && !failure.rateLimited && !retriedEngines.has(engine)) {
            retriedEngines.add(engine);
            logger.warn(`free-search: engine "${engine}" failed [transient] (${message}), retrying once`);
            chain.splice(qi + 1, 0, engine);
            continue;
          }
          if (!fallbackOnSet.has(failure.class)) {
            blockedFailure = { engine, failure };
            logger.warn('free-search: engine "' + engine + '" failed [' + failure.class + '] (' + message + ') and "' + failure.class + '" is not in fallbackOn, stopping');
            break;
          }
          logger.warn(`free-search: engine "${engine}" failed [${failure.class}] (${message}), trying next engine`);
        }
      }
      if (blockedFailure) {
        throw new Error(
          'search stopped after "' + blockedFailure.engine + '" failed: ' + blockedFailure.failure.message +
            ' — the failure class "' + blockedFailure.failure.class + '" is not enabled in fallbackOn, so no other engine was tried'
        );
      }
      throw lastError ?? new Error("all search engines failed");
```

</details>

**依据 4 · 源码核查**：[lib/index.js:4845-4882](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L4845-L4882)

multi返回预算与未完成请求的边界。

<details>
<summary>查看原文（38行）</summary>

```text
    // #69 §3：整次 multi 也有总预算——并发扇出与后面的串行补跑都不允许无限拖长。
    // 到点时**已返回的引擎照常入账**（部分结果优先），未返回的记为 timeout。
    const multiDeadlineAt = Date.now() + SEARCH_BUDGET_MS;
    const outcomes = [];
    const runEngine = async (engine) => {
      attemptedEngines.push(engine);
      try {
        outcomes.push({ engine, res: await runEngineTest(engine, q, timeRange, limit) });
      } catch (error) {
        outcomes.push({ engine, res: { ok: false, error: error instanceof Error ? error.message : String(error) } });
      }
    };
    await Promise.race([
      Promise.all(selectedEngines.map(runEngine)),
      new Promise((resolve) => setTimeout(resolve, Math.max(0, multiDeadlineAt - Date.now()))),
    ]);
    const settledEngines = new Set(outcomes.map((o) => o.engine));
    for (const engine of selectedEngines) {
      if (!settledEngines.has(engine)) failedEngines.push(`${engine} [timeout] (search budget exceeded)`);
    }
    const rawResults = [];

      for (const { engine, res } of outcomes) {
          if (res.ok) {
            // #69 §3：目标成功源数统计的是「真返回了结果的引擎」。原状只要 res.ok 就记进
            // enginesUsed，于是空手而归的引擎也被算作已用——备注会写成 enginesUsed: [a, b]
            // 而实际只有 a 有结果；更糟的是当所有引擎都返回空时 enginesUsed 仍非空，
            // 于是既不抛错也不提示，搜索"成功"地返回零结果。
            if ((res.sources ?? []).length > 0) {
              enginesUsed.push(engine);
              rawResults.push({ engine, sources: res.sources });
            } else {
              enginesEmpty.push(engine);
            }
          } else if (typeof res.error === "string" && (res.error.includes("not configured") || res.error.includes("requires"))) {
            skipped.push(engine);
          } else {
          failedEngines.push(`${engine} [${res.failureClass ?? classifyFailure(res.error).class}] (${res.error ?? "unknown error"})`);
```

</details>

#### 缺口

- multi未完成请求是否在更底层被取消未逐引擎核清
  **影响**：不能把30秒返回当硬支出上限
  **进一步探讨**：跟每引擎传入signal和服务账单，测试预算到点后是否仍请求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 免费、额度与不可信结果的限制是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

运行需要DSH web seam和可访问搜索网络，各引擎有不同账号、额度、解析和反爬前提；README同页把AnySearch列“无限免key”又说明匿名有限流，不能据静态分类给无限保证。多引擎并发和失败key轮换增加请求，某些引擎按次或token计费，结果去重不消除已发生消费。网页文字包装为untrusted并剥除同名边界标记，能明确数据边界但不是提示注入防护已验证。首次应仅启用少数已知引擎，持续核来源日期与实际费用，失败时查看实际引擎再决定重试；全失败返回错误有边界，用户仍可回原provider或人工浏览。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:109-128](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/README.md#L109-L128)

免费分类和匿名限流条件，均为固定作者说明。

<details>
<summary>查看原文（20行）</summary>

```text
「免费 / 付费」二分不足以决定**谁该进默认池**——真正的约束是额度模型：有没有免费量、有多少、用超了怎么算。按这个口径分五档（配置并发池时按这档选，能避免整池并发时额度翻倍）：

| 档位 | 引擎 | 超出后 |
|---|---|---|
| ① 无限免 key | `ddg` / `ddg-lite` / `bing` / `searxng` / `anysearch` | — |
| ② 匿名额度（不配 key 也能跑） | `exa` / `tavily` / `keenable` / `firecrawl` / `parallel` / `you`（每天 100 次） | 配 key 提额 |
| ③ 免费额度（需 key） | `zhihu_global` / `zhihu_site`（每日 5,000 次试用）、`doubao`（每月 500 次）、`baidu`（每日 50 次）、`aliyun`（新用户 200 次包） | 按量后付费 |
| ④ 付费升级（需 key 才有产出） | `serpbase`（注册送 100 次）/ `serply`（30 天 2,500 次）/ `perplexity` / `deepseek-official` / `deepseek-tools` / `kimi` | 按量 / 按次 |
| ⑤ 按次计费（模型内置，显式-only） | `openai` / `gemini` / `claude` | 按 token + 每次搜索 |

选默认池的经验：**① 打底 + ③ 打主力**；② 可以进但要知道它在烧匿名额度；④ 只在你确实需要该源时显式选用；⑤ 永不入池。完整的逐引擎额度事实与默认池提案见 [docs/engine-quota-tiers.md](./docs/engine-quota-tiers.md)。

#### 为什么免费引擎不需要 key？

- **AnySearch**：其 `v1/search` REST 接口提供匿名的公共搜索额度，无需注册或 API key。额度有限流（适合日常搜索），但作为免费引擎之一，与其他免费引擎互相回退，体验稳定。
- **Exa**：公开 MCP 端点（`mcp.exa.ai/mcp`）支持匿名调用，不配 key 也能用；配置 `EXA_API_KEY` 后可获得更高额度。
- **Tavily**：通过 `x-tavily-access-mode: keyless` 头走 keyless 匿名额度，不配 key 即可用；配置 `TAVILY_API_KEY` 后走账号档，额度更高、结果质量更稳定。
- **Keenable**：无 key 时走其公开 MCP 端点（`api.keenable.ai/mcp`）匿名调用；配置 `KEENABLE_API_KEY` 后走 REST API（`api.keenable.ai/v1/search`），额度更高、按组织限流。
- **Firecrawl**：其 `/v2/search` 端点**无需 key** 即可使用（官方文档明确说明，有匿名限流）；配置 `FIRECRAWL_API_KEY` 后可提高限额。支持 `tbs` 时间过滤（`qdr:h/d/w/m/y` 与自定义日期区间）。
- **You.com**：无 key 时走官方免 key 档（`api.you.com/v1/agents/search`），每天 100 次免费搜索，无需注册；配置 `YDC_API_KEY`（旧名 `YOUCOM_API_KEY` 继续兼容）后走官方 Search API（`ydc-index.io/v1/search`），额度更高。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:570-581](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L570-L581)

不可信正文边界实际包装。

<details>
<summary>查看原文（12行）</summary>

```text
// 也不给 source.snippet 本体加标记——同一字符串会原样显示在 DSH 前端的结果卡片里。
const UNTRUSTED_BOUNDARY_OPEN = "<untrusted-web-content>";
const UNTRUSTED_BOUNDARY_CLOSE = "</untrusted-web-content>";
const UNTRUSTED_BOUNDARY_TAG = /<\/?untrusted-web-content>/gi;

// 防伪造：剥掉网页文本里自带的同名边界标记，避免提前闭合边界
function stripBoundaryTags(text) {
  return typeof text === "string" ? text.replace(UNTRUSTED_BOUNDARY_TAG, "") : text;
}

function wrapUntrustedBlock(text) {
  return `${UNTRUSTED_BOUNDARY_OPEN}\n${stripBoundaryTags(text)}\n${UNTRUSTED_BOUNDARY_CLOSE}`;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3936-3945](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L3936-L3945)

多key重发会产生更多请求。

<details>
<summary>查看原文（10行）</summary>

```text
    async search(request, signal) {
      // 轮换时机：首次失败后 keyRings 已经填充，此时再判断有几把 key。
      for (let attempt = 0; attempt < 10; attempt++) {
        try {
          return await provider.searchOnce(request, signal);
        } catch (error) {
          const keys = maxKeyRingLength();
          if (keys <= 1 || attempt >= keys - 1 || !isKeyRotationCandidate(error)) throw error;
          rotateAllKeyRings();
          logger.warn(`free-search: retrying with the next API key (${error?.message ?? error})`);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:4358-4364](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L4358-L4364)

最终失败是可观察结果。

```text
      if (blockedFailure) {
        throw new Error(
          'search stopped after "' + blockedFailure.engine + '" failed: ' + blockedFailure.failure.message +
            ' — the failure class "' + blockedFailure.failure.class + '" is not enabled in fallbackOn, so no other engine was tried'
        );
      }
      throw lastError ?? new Error("all search engines failed");
```

#### 缺口

- 当期免费额度与搜索质量未查验
  **影响**：不能承诺零费用或总覆盖改善
  **进一步探讨**：以固定问题对照人工浏览并记录所有引擎调用和账单

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁可试用，什么证据支持继续？

**研究主题**：新假设与验证、采用判断

#### 完整回答

没有可用原生搜索provider的个人DSH用户，可先只启用一个免key引擎及一个回退，用非敏感问题试用，不默认开启所有付费源或multi。待验证方向是对一个合格可引用答案记录所有尝试、实际引擎和成本回执，同时把返回时限与后台请求结束分开，避免“有结果”和“免费可靠”混淆。比较原搜索、单源回退和有限multi，检查关键事实正确、出处有效、总请求、预算后仍运行的请求和人工核查。若反复全失败、引用无效或额外费用不可控，关闭该provider并回原搜索或人工浏览。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4328-4364](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L4328-L4364)

已有失败分类可作为逐尝试回执来源。

<details>
<summary>查看原文（37行）</summary>

```text
          lastError = new Error(`engine "${engine}" returned 0 results`);
          if (engine === preferred) { preferredFailure = "returned 0 results"; preferredFailureClass = "invalid-response"; }
          if (!fallbackOnSet.has("invalid-response")) {
            blockedFailure = { engine, failure: { class: "invalid-response", message: "returned 0 results" } };
            logger.warn('free-search: ' + engine + ' returned 0 results and "invalid-response" is not in fallbackOn, stopping');
            break;
          }
          logger.warn(`free-search: ${engine} returned 0 results, trying next engine`);
        } catch (error) {
          lastError = error;
          const failure = classifyFailure(error);
          const message = failure.message;
          if (engine === preferred) { preferredFailure = message; preferredFailureClass = failure.class; }
          applyFailureCooldown(engine, failure.class, failure.rateLimited);
          // transient（超时/5xx/网络）：同引擎重试一次再回退，避免一次抖动丢掉好引擎；
          // 限流（rateLimited）不重试——短窗内再发必再撞，已设 60s 冷却
          if (failure.class === "transient" && !failure.rateLimited && !retriedEngines.has(engine)) {
            retriedEngines.add(engine);
            logger.warn(`free-search: engine "${engine}" failed [transient] (${message}), retrying once`);
            chain.splice(qi + 1, 0, engine);
            continue;
          }
          if (!fallbackOnSet.has(failure.class)) {
            blockedFailure = { engine, failure };
            logger.warn('free-search: engine "' + engine + '" failed [' + failure.class + '] (' + message + ') and "' + failure.class + '" is not in fallbackOn, stopping');
            break;
          }
          logger.warn(`free-search: engine "${engine}" failed [${failure.class}] (${message}), trying next engine`);
        }
      }
      if (blockedFailure) {
        throw new Error(
          'search stopped after "' + blockedFailure.engine + '" failed: ' + blockedFailure.failure.message +
            ' — the failure class "' + blockedFailure.failure.class + '" is not enabled in fallbackOn, so no other engine was tried'
        );
      }
      throw lastError ?? new Error("all search engines failed");
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4845-4864](https://github.com/DDDMUC/dsh-free-search/blob/c11ac5b312bb529294f215f451b2d8879820fdfc/lib/index.js#L4845-L4864)

multi到点仍有未完成项，是预算边界验证起点。

<details>
<summary>查看原文（20行）</summary>

```text
    // #69 §3：整次 multi 也有总预算——并发扇出与后面的串行补跑都不允许无限拖长。
    // 到点时**已返回的引擎照常入账**（部分结果优先），未返回的记为 timeout。
    const multiDeadlineAt = Date.now() + SEARCH_BUDGET_MS;
    const outcomes = [];
    const runEngine = async (engine) => {
      attemptedEngines.push(engine);
      try {
        outcomes.push({ engine, res: await runEngineTest(engine, q, timeRange, limit) });
      } catch (error) {
        outcomes.push({ engine, res: { ok: false, error: error instanceof Error ? error.message : String(error) } });
      }
    };
    await Promise.race([
      Promise.all(selectedEngines.map(runEngine)),
      new Promise((resolve) => setTimeout(resolve, Math.max(0, multiDeadlineAt - Date.now()))),
    ]);
    const settledEngines = new Set(outcomes.map((o) => o.engine));
    for (const engine of selectedEngines) {
      if (!settledEngines.has(engine)) failedEngines.push(`${engine} [timeout] (search budget exceeded)`);
    }
```

</details>

#### 缺口

- 按合格答案完整计费是否改变选择未知
  **影响**：属于新假设
  **进一步探讨**：同任务对照有效引用率与全部尝试消耗

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
