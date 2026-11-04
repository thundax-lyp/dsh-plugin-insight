# DSH Web Tools

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[686d87b](https://github.com/A3Boy/dsh-web-tools/tree/686d87bdf688e18966733c3d070fd3698779c255)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A3Boy/dsh-web-tools)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供多来源网页搜索与抓取，支持可配置后备链及 X、小红书原生访问。

> **亮点**：保持 web_search 和 web_fetch 的宿主入口，按认证、限流和取消区分后备行为。相比手工切换，它能在同次请求中尝试独立提供者并保留失败边界。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：Always 接受一次失败的工具完成，不能当作拿到可靠证据。平台后备也无法恢复权限受限的原生内容。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 模型何时获得工具，调用如何到达插件？](#detail-section-11)
  - [Q02 · 多提供者与 Always 模式分别保证了什么？](#detail-section-12)
  - [Q03 · 平台访问、目标授权和抓取各依赖什么，哪些错误不能由后备弥补？](#detail-section-13)
  - [Q04 · 哪些人值得试用，如何退出？](#detail-section-14)
  - [Q05 · 错误感知的双源切换何时值得保留？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：对经常需要引用原始网页的 DSH Web 用户，同一个会话可通过原有工具名访问不同检索提供者。

参照单一宿主提供者与遇限流后手工更换凭据。若单个来源已经稳定，额外路由、配置和权限核对的收益可能有限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多来源搜索与抓取 | 同一入口尝试不同后端 | 取决于配置与故障类型 |
| 原生平台路由 | 获取 X、小红书内容 | 要有专用浏览器与可用登录态 |
| 会话搜索模式 | 约束工具是否可用与是否必须尝试 | 一次失败完成也会满足 Always |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH Web Profile 与包 peer | 运行 Host 和设置界面 | 固定版宿主兼容待验证 |
| 供应商凭据或免密自建端点 | 提供网页搜索和抽取 | 双源需确认独立性 |
| 支持的浏览器和独立账号 | 可选原生平台 | 不与普通搜索共用登录资料 |

| 步骤 | 操作 | 失败处理 |
| --- | --- | --- |
| 配置 | 在隔离 Profile 固定包版本并设置两来源 | 核对宿主工具是否出现 |
| 对照 | 先仅测试普通搜索和抓取 | 将限流、认证、取消分开记录 |
| 退出 | 移除、重启并回读工具状态 | 若曾开启平台，确认专用 Profile 的清理 |

**效果与成本**

| 阶段 | 人工负担 | 现金和时间 |
| --- | --- | --- |
| 首次 | 配置 Profile 与凭据 | 未测搭建耗时 |
| 持续 | 看额度和错误并轮替失效 key | 记录实际 API 消耗，另计排障时间 |
| 恢复 | 切回单源，核对卸载与资料清理 | 未测最坏尾时延 |

| 预期结果 | 验收 | 边界 |
| --- | --- | --- |
| 主来源限流时仍能找到原文 | 记录可定位证据和尝试数 | 源码支持切换，效果未测 |
| 平台错误可辨 | 原生拒绝不伪装成网页结果 | 无真实平台验收 |

> **思考**：Always 接受一次失败的工具完成，不能当作拿到可靠证据。平台后备也无法恢复权限受限的原生内容。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：保持 web_search 和 web_fetch 的宿主入口，按认证、限流和取消区分后备行为。相比手工切换，它能在同次请求中尝试独立提供者并保留失败边界。见 [Q01](#research-q01)、[Q02](#research-q02)。

执行链区分池内认证轮换、提供者冷却和终止错误。平台 session 的停止和删除为独立操作。自定义提供者的固定连接边界与通用抓取的 DNS 预检分开判断。

<a id="detail-section-5"></a>

### 1.4 主要限制

Always 接受一次失败的工具完成，不能当作拿到可靠证据。平台后备也无法恢复权限受限的原生内容。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在隔离 Profile 测普通双源与单源。先预设来源、费用和时延上限，后回读可引用原文和原工具状态。如果不能恢复或成本超限，回到单源。见 [Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核对补丁、路由、故障分支及 Profile 生命周期。多来源在实际宿主上的兼容、净收益及效果仍待核实，故障注入比较是验证方案。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、src/host/index.ts、src/client/index.ts、src/host/registry.ts、README.md、src/host/search-mode-runtime.ts、src/host/sources/registry.ts、src/host/browser/session-manager.ts、src/host/provider-transport.ts、src/host/generic-fetch.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查了包和 patch、Host 与 Client 注册、搜索后备、回合钩子、专用浏览器生命周期和两个出站边界。未逐个核查全部适配器、平台 DOM、发布包与源码构建一致性或真实宿主。
- 下一步：先做隔离 Profile 工具和卸载烟测，再按故障注入矩阵比较资料任务。平台登录及出站检查用单独账号和受控目标。

**分析版本**

- **仓库**：[A3Boy/dsh-web-tools](https://github.com/A3Boy/dsh-web-tools)
- **版本号**：0.3.9（[固定提交 686d87b](https://github.com/A3Boy/dsh-web-tools/tree/686d87bdf688e18966733c3d070fd3698779c255)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先在隔离 Profile 做单源和双源限流对照。用原文命中率、尝试次数、尾时延及费用决定是否保留后备链。见 [Q05](#research-q05)。

先做隔离 Profile 工具和卸载烟测，再按故障注入矩阵比较资料任务。平台登录及出站检查用单独账号和受控目标。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 857 | — | — | 9511 |
| .mjs | source | 17 | 1927 | 1571 | 154 | — |
| .js | source | 98 | 25065 | 22041 | 3770 | — |
| .cjs | source | 6 | 1213 | 978 | 129 | — |
| .ts | source | 87 | 18665 | 14184 | 3064 | — |
| .tsx | source | 11 | 4782 | 4284 | 303 | — |
| .ts | test | 46 | 10001 | 8317 | 945 | — |
| .mjs | test | 4 | 1093 | 885 | 146 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/A3Boy/dsh-web-tools/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/A3Boy/dsh-web-tools/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/A3Boy/dsh-web-tools/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：使用 DSH Web 的研究工作者能否通过此插件减少单一网页检索服务故障带来的中断，哪些故障与数据边界需要由使用者承担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型何时获得工具，调用如何到达插件？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

频繁做网页资料搜集的 DSH Web 用户可以保留 web_search 和 web_fetch 两个工具名，同时更换执行后端。包的 Host 与 Web Client 分开导出，DSH manifest 指向补丁。补丁把 tool-web 的 search 和 fetch 显式打开，并给 web 指定两个插件提供者 ID。Host apply 分别注册 search 和 fetch，并以平台路由包装普通链；搜索请求先提取提示，再把平台或通用结果转成 sources。客户端注册设置区并在会话输入栏注入模式控制。相比直接换一次原生服务，实际增量在同一入口的多来源路由；若用户只用一个稳定服务，接管整个 Profile 的补丁会增加配置面。包清单和源码可支持接线判断，宿主版本行为仍需验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-17](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/package.json#L2-L17)

版本 0.3.9，Host/Web Client 导出分离

<details>
<summary>查看原文（16行）</summary>

```text
  "name": "dsh-web-tools",
  "version": "0.3.9",
  "description": "Multi-provider Web Search & Fetch for DeepSeek Harness — 9 deeply adapted providers, SearchHints, resilient fallback, and native X / Xiaohongshu retrieval",
  "icon": "assets/logo-icon.png",
  "author": "A3Boy",
  "license": "MIT",
  "type": "module",
  "main": "./lib/host/index.js",
  "exports": {
    ".": {
      "types": "./lib/host/index.d.ts",
      "default": "./lib/host/index.js"
    },
    "./client": {
      "types": "./lib/client/index.d.ts",
      "default": "./lib/client.js"
```

</details>

**依据 2 · 源码核查**：[package.json:33-46](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/package.json#L33-L46)

DSH manifest 指向 Cordis 补丁和 Web 客户端

<details>
<summary>查看原文（14行）</summary>

```text
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-api-remotes"
      ]
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:13-31](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/cordis.patch.yml#L13-L31)

启用宿主工具并选定插件两个提供者

<details>
<summary>查看原文（19行）</summary>

```text
- id: tool-web
  disabled: false
  config:
    search: true
    fetch: true
    searchMaxQueries: 4
    searchMaxResults: 8
    searchTimeoutMs: 60000
    fetchTimeoutMs: 30000
    fetchMaxOutputChars: 200000

- id: web
  config:
    searchProvider: dsh-web-tools
    fetchProvider: dsh-web-tools-fetch

- insert:
    - id: dsh-web-tools
      name: 'dsh-web-tools'
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:316-358](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/index.ts#L316-L358)

注册实际路由，包装 search 和 fetch

<details>
<summary>查看原文（43行）</summary>

```text
  // Wrap search provider with SpecializedSourceRouter for XHS / X transparent platform handling
  const routedSearchProvider = {
    id: PROVIDER_ID,
    available: () => generalSearchProvider.available(),
    search: async (request: { query: string; maxResults?: number }, signal?: AbortSignal) => {
      const outcome = await sourceRegistry.search(
        request.query,
        { maxResults: request.maxResults, hints: extractSearchHints(request.query) },
        signal,
      );
      if (outcome.error) {
        throw new Error(`[${outcome.error.code}] ${outcome.error.message}`);
      }
      return {
        sources: outcome.items.map((item) => ({
          url: item.url,
          title: item.title,
          snippet: item.snippet,
          publishedAt: item.publishedAt,
        })),
        truncated: false,
      };
    },
  };
  ctx.web.registerSearchProvider(routedSearchProvider as never);

  // Wrap fetch provider with SpecializedSourceRouter
  const routedFetchProvider = {
    id: `${PROVIDER_ID}-fetch`,
    available: () => generalFetchProvider.available(),
    fetch: async (request: { url: string }, signal?: AbortSignal) => {
      const outcome = await sourceRegistry.fetch(request.url, signal);
      return toRoutedFetchResponse(request.url, outcome);
    },
  };
  ctx.web.registerFetchProvider(routedFetchProvider as never);

  // Specialized Sources: Register Xiaohongshu and Twitter/X with NativeBrowserRuntime
  const nativeRuntime = createNativeBrowserRuntime();
  const xhsSource = new XiaohongshuSource(nativeRuntime);
  const xSource = new XSource(nativeRuntime);
  sourceRegistry.registerSource(xhsSource);
  sourceRegistry.registerSource(xSource);
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:78-86](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/client/index.ts#L78-L86)

注册客户端设置区

```text
  };

  registerSettingsSection(ctx, t, SectionWithBoundary, ui);

  // "联网搜索" per-session toggle — a small always-visible control at the left
  // end of the composer tool row (official `conversation.input.left` seat).
  // Session-scoped: the seat supplies `sessionId` as a standard prop. Because
  // this slot exposes no `inject`, a thin wrapper forwards the sessionId along
  // with locale-localized copy (re-renders when the page language flips).
```

**依据 6 · 源码核查**：[src/client/index.ts:103-118](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/client/index.ts#L103-L118)

向会话输入栏注入控件

<details>
<summary>查看原文（16行）</summary>

```text
        required: t("searchModeRequiredDesc"),
        off: t("searchModeOffDesc"),
      },
    });
  };

  ctx.slots.inject("conversation.input.left", () =>
    ctx.slots.register(
      {
        name: "conversation.input.left",
        id: "dsh-web-tools-search-mode",
        order: 30,
        // Localized projected label follows the active locale without re-register.
        label: () => t("searchModeLabel"),
      },
      SearchModeControl,
```

</details>

#### 缺口

- 固定版未在实际 Profile 加载
  **影响**：补丁兼容和 UI 可见性未验证
  **进一步探讨**：在隔离 Profile 对照启用前后工具清单并试一次搜索和抓取

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多提供者与 Always 模式分别保证了什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

多提供者把同一请求中不同故障分开处理。无可用凭据、全部失效或在冷却的池会被跳过。认证失败会把当前 key 标为不健康，尝试本池下一个；429、网络、超时等可重试非认证故障转下一个提供者，带 Retry-After 的限流记录冷却。调用者取消和终止类错误不继续。抓取另有能提取网页的链，随后可转通用 HTTP 抽取。与单一原生入口或手工换 key 比，这可以减少需要人为切换的故障；同后端共故障或最后一个服务失败时仍会返回错误，额外尝试会占时并可能产生额外 API 消耗。Always 对照 README 的资料可靠性描述，应理解为每轮完成一次工具尝试。结果钩子分别记录完成与成功，失败结果也能满足停止条件；完全没完成才先 steer 一次再 cancel。因此它不能单独保证找到外部证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/registry.ts:246-290](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/registry.ts#L246-L290)

跳过规则和每次尝试

<details>
<summary>查看原文（45行）</summary>

```text
          // Keyless sources (self-hosted SearXNG, or a custom source with auth
          // mode "none") execute with an empty key.
          entries = [new PoolEntry("", 0)];
        } else if (entries.length === 0) {
          attempts.push({ provider: providerName, outcome: "skipped-no-keys" });
          continue;
        }

        // Auth-invalid keys stay unhealthy until the credential actually
        // changes (refreshPool preserves healthy=false for persisted keys).
        // If the whole pool is unusable, skip this provider — do NOT reset.
        let usable = entries.filter((e) => e.healthy);
        if (usable.length === 0) {
          attempts.push({ provider: providerName, outcome: "skipped-no-healthy-keys" });
          continue;
        }

        // Provider-level cooldown (Retry-After). The store uses its own clock
        // (injectable for tests) — zero HTTP when cooling down.
        if (healthStore?.isCoolingDown(providerName)) {
          attempts.push({ provider: providerName, outcome: "skipped-cooldown" });
          continue;
        }

        // Provider-internal key failover: on AUTH failures only, try the next
        // healthy key in the SAME provider before falling back to another
        // provider. Non-auth failures (429/5xx/network/timeout) do not rotate
        // keys — they fall through to the next provider directly.
        let providerLevelDecision: "next-provider" | "break" | "terminal" | null = null;
        // Base URL from the request snapshot, so an override edit mid-request
        // cannot make one attempt dial a different host than another.
        const searchBaseUrl = entryInfo?.builtIn
          ? entryInfo.endpoint?.effectiveBaseUrl
          : cfg.providerBaseUrls[providerName];
        while (usable.length > 0) {
          const index = selectIndex(entries);
          const entry = entries[index];
          if (entry) reserveKey(entries, index);
          const started = Date.now();
          const providerOptions = cfg.providerOptions?.[providerName as keyof StoredProviderOptions];
          try {
            const outcome = await runWithTimeout(
              (s) =>
                adapter.search(request.query, maxResults, entry?.key ?? "", searchBaseUrl, {
                  signal: s,
```

</details>

**依据 2 · 源码核查**：[src/host/registry.ts:319-359](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/registry.ts#L319-L359)

认证轮换、限流冷却和终止分支

<details>
<summary>查看原文（41行）</summary>

```text
            if (decision === "non-retryable") {
              providerLevelDecision = "break";
              lastError = err;
              attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
              stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
              break;
            }
            // retryable:
            if (err.code === "auth") {
              // key indicted → mark unhealthy, try the next key in this pool
              markUnhealthy(entries, index);
              attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
              stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
              usable = entries.filter((e) => e.healthy);
              continue;
            }
            // non-auth retryable (429/5xx/network/timeout) → next provider
            lastError = err;
            // Only rate-limit errors carry a server-requested cooldown.
            if (err.code === "rate-limit" && typeof err.retryAfterMs === "number" && err.retryAfterMs > 0) {
              healthStore?.cooldownFor(providerName, err.retryAfterMs, "rate-limit");
            }
            attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
            stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
            providerLevelDecision = "next-provider";
            break;
          } finally {
            if (entry) releaseKey(entries, index);
          }
        }

        if (providerLevelDecision === "terminal") throw toWebError(lastError);
        if (providerLevelDecision === "break") break;
        // else fall through to the next provider in the chain
      }

      const reason = lastError
        ? `${lastError.code}: ${lastError.message}`
        : "no usable provider";
      const err = new WebToolsWebError(`web search failed after ${attempts.length} attempt(s): ${reason}`);
      err.attempts = attempts;
```

</details>

**依据 3 · 源码核查**：[src/host/registry.ts:445-481](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/registry.ts#L445-L481)

抓取终止或通用 HTTP fallback

<details>
<summary>查看原文（37行）</summary>

```text
          const err = toProviderError(error);
          if (err.code === "auth") markUnhealthy(entries, index);
          if (err.code === "rate-limit" && typeof err.retryAfterMs === "number" && err.retryAfterMs > 0) {
            healthStore?.cooldownFor(providerName, err.retryAfterMs, "rate-limit");
          }
          lastNativeError = err;
          attempts.push({ provider: providerName, outcome: `failed:${err.code}` });
          const decision = classifyFailure(err);
          // Caller cancellation or terminal URL/SSRF errors should abort immediately without fallback
          if (decision === "terminal") {
            const terminalErr = toWebError(error);
            terminalErr.attempts = attempts;
            throw terminalErr;
          }
          if (decision === "non-retryable") break;
          // retryable → try next fetch-capable provider in the chain
        } finally {
          if (entry) releaseKey(entries, index);
        }
      }

      // If caller aborted, do not proceed to built-in generic fetch
      if (signal?.aborted) {
        const abortErr = new WebToolsWebError("web fetch aborted by caller");
        abortErr.code = "WEB_ABORTED";
        abortErr.attempts = attempts;
        throw abortErr;
      }

      // 2. Fallback to built-in generic HTTP fetcher (Defuddle + linkedom)
      try {
        const res = await genericFetcher(request.url, {
          signal,
          timeoutMs: cfg.providerAttemptTimeoutMs,
        });
        attempts.push({ provider: "builtin-http", outcome: "success" });
        return {
```

</details>

**依据 4 · 作者声明**：[README.md:171-177](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/README.md#L171-L177)

作者对 Always 的强一致叙述

```text
* **429 Retry-After Cooldown**: Enforces zero-request cooldown windows when servers return `Retry-After` headers, skipping rate-limited providers immediately.
* **Configurable Routing Policies**: `web_search` supports Ordered, Round-Robin, and Random starting-provider selection. `web_fetch` always follows the deterministic fetch-capable chain.
* **Session-Level Search Mode**: A refined, compact picker in the composer offering three deterministic retrieval behaviors (defaults to Smart):
  * **Smart (智能联网)**: Elastic semantic dispatch. The agent autonomously determines whether real-time web retrieval is needed based on conversational intent.
  * **Always (始终联网)**: Strong-consistency knowledge verification. Mandates at least one completed `web_search` or `web_fetch` per turn to ensure claims are grounded in external sources.
  * **Off (关闭联网)**: Deterministic physical isolation. Replaces fragile prompt-only requests with a **three-tier runtime enforcement barrier** (dynamically withholds tools from the agent's schema, blocks model inertia via a monotonic guard before execution, and injects a single-turn explanation), ensuring zero outbound network leakage regardless of historical context.

```

**依据 5 · 源码核查**：[src/host/search-mode-runtime.ts:155-178](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/search-mode-runtime.ts#L155-L178)

完成和成功使用不同字段

<details>
<summary>查看原文（24行）</summary>

```text

  /**
   * Record that a web_search call COMPLETED. Completion (even a total provider
   * failure) satisfies "must research first"; success additionally records that
   * fresh web data was available.
   */
  markSearchResult(sessionId: string, succeeded: boolean): void {
    const state = this.turns.get(sessionId);
    if (!state) return;
    state.webSearchCompleted = true;
    state.webSearchSucceeded ||= succeeded;
  }

  /**
   * Record that a web_fetch call COMPLETED. A fetch also satisfies the
   * "must research first" requirement — a user-supplied URL is a valid
   * research action and must not be gated behind a pointless search.
   */
  markFetchResult(sessionId: string, succeeded: boolean): void {
    const state = this.turns.get(sessionId);
    if (!state) return;
    state.webFetchCompleted = true;
    state.webFetchSucceeded ||= succeeded;
  }
```

</details>

**依据 6 · 源码核查**：[src/host/search-mode-runtime.ts:401-423](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/search-mode-runtime.ts#L401-L423)

工具结果与停止的实际判据

<details>
<summary>查看原文（23行）</summary>

```text
      const stopResult = agent.ctx.on(
        "tools/result",
        (exec: { name?: string; agent?: { id: string } | null }, result: { isError?: boolean }) => {
          if (!exec.agent?.id) return;
          const succeeded = result?.isError === false;
          if (exec?.name === "web_search") runtime.markSearchResult(exec.agent.id, succeeded);
          else if (exec?.name === "web_fetch") runtime.markFetchResult(exec.agent.id, succeeded);
        },
      );

      const stopStopping = agent.ctx.on(
        "agent/turn-stopping",
        (payload: { turn: number; signal?: AbortSignal }) => {
          if (payload.signal?.aborted) return;
          const state = runtime.getTurn(agent.id);
          if (!state?.required || webResearchCompleted(state)) return;
          if (state.correctionCount === 0) {
            state.correctionCount += 1;
            agent.steer(messages.correction());
            return;
          }
          agent.cancel({ kind: "hook", reason: "required web research was not completed" });
        },
```

</details>

#### 缺口

- 没有独立提供者故障时的任务完成数据
  **影响**：无法判断 fallback 的净收益或 Always 下事实准确率
  **进一步探讨**：注入可控的认证错误和限流，记录尝试序列与真实证据命中率

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 平台访问、目标授权和抓取各依赖什么，哪些错误不能由后备弥补？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

X 和小红书源挂到同一平台注册表，原生路径依赖可启动的本地浏览器、专用 Profile 和可用登录态。平台被关闭或缺失可用普通网页查找；原生返回零条仍保留，取消、认证或权限等标记不可重试的失败直接返回。普通搜索索引因此只能作为发现线索，不能用作原生评论的替代证据。配置自定义服务还需分清出站和网页抓取两类边界。自定义传输会判定显式授权、DNS、私网和代理策略，拒绝重定向并对直接自定义连接固定地址；经代理的目标有单独授权条件。通用抓取则在手动重定向每跳预检 URL 和 DNS，再交给 fetch，请求前预检与最终连接之间仍需实测，不能借用自定义传输的固定地址结论。浏览器 resetSession 先停进程再删除专用 Profile；普通 dispose 只停止平台运行，不清除已有登录资料。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:353-358](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/index.ts#L353-L358)

平台源注入浏览器 runtime

```text
  // Specialized Sources: Register Xiaohongshu and Twitter/X with NativeBrowserRuntime
  const nativeRuntime = createNativeBrowserRuntime();
  const xhsSource = new XiaohongshuSource(nativeRuntime);
  const xSource = new XSource(nativeRuntime);
  sourceRegistry.registerSource(xhsSource);
  sourceRegistry.registerSource(xSource);
```

**依据 2 · 源码核查**：[src/host/sources/registry.ts:124-157](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/sources/registry.ts#L124-L157)

平台搜索保留零条和不可重试错误

<details>
<summary>查看原文（34行）</summary>

```text
    const source = this.sources.get(platform);
    if (!source || !this.isPlatformEnabled(platform)) {
      return fallbackSearchToGeneralWeb(
        query,
        platform,
        this.fallbackSearchProvider,
        req?.maxResults,
        signal,
      );
    }

    const nativeQuery = req?.hints?.cleanQuery?.trim() || query;
    const outcome = await source.search(nativeQuery, req, signal);
    // If native search succeeded (even 0 results), keep native outcome!
    if (outcome.error === undefined) {
      return { ...outcome, retrievalMode: "native-browser" };
    }

    // Do not hide platform authentication/access failures behind indexed web
    // results. They cannot provide native details or real comments and would
    // make an explicit platform search look successful when it was not.
    if (signal?.aborted || outcome.error.code === "aborted") {
      return outcome;
    }
    if (!outcome.error.retryable) {
      return outcome;
    }

    // Retryable browser/runtime failures may still use indexed discovery.
    return fallbackSearchToGeneralWeb(
      query,
      platform,
      this.fallbackSearchProvider,
      req?.maxResults,
```

</details>

**依据 3 · 源码核查**：[src/host/sources/registry.ts:193-215](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/sources/registry.ts#L193-L215)

详情同样区分原生成功、拒绝与后备

<details>
<summary>查看原文（23行）</summary>

```text
    const source = this.sources.get(targetPlatform);
    if (!source || !this.isPlatformEnabled(targetPlatform)) {
      return fallbackFetchToGeneralWeb(url, this.fallbackFetchProvider, signal);
    }

    const outcome = await source.fetch(url, signal);
    if (outcome.error === undefined && outcome.item) {
      return { ...outcome, retrievalMode: "native-browser" };
    }

    if (signal?.aborted || outcome.error?.code === "aborted") {
      return outcome;
    }

    // A source marks platform-auth, access-control, and invalid-detail errors
    // as non-retryable. Do not hide that concrete result behind a potentially
    // long general-provider chain that cannot recover native comments/session
    // data and may consume the tool's entire timeout budget.
    if (outcome.error && !outcome.error.retryable) {
      return outcome;
    }

    return fallbackFetchToGeneralWeb(url, this.fallbackFetchProvider, signal);
```

</details>

**依据 4 · 源码核查**：[src/host/browser/session-manager.ts:646-654](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/browser/session-manager.ts#L646-L654)

启动专用 Profile 浏览器

```text
      const profileDir = this.profileStore.ensureProfileDir(platform);
      const isVisible = desiredMode === "interactive";
      const config = PLATFORM_AUTH_CONFIG[platform];
      const startUrl = initialUrl || (isVisible ? config.initialUrl : undefined);

      let spawned: SpawnedBrowserProcess;
      try {
        spawned = await this.launcher(browser, profileDir, startUrl, isVisible, !isVisible);
      } catch (err) {
```

**依据 5 · 源码核查**：[src/host/browser/session-manager.ts:776-791](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/browser/session-manager.ts#L776-L791)

区分停止、显式重置与 dispose

<details>
<summary>查看原文（16行）</summary>

```text
  async stop(platform: BrowserPlatform): Promise<void> {
    return this.enqueue(platform, async () => {
      const rec = this.getRecord(platform);
      await this.internalStop(rec);
    });
  }

  async resetSession(platform: BrowserPlatform): Promise<void> {
    await this.stop(platform);
    this.profileStore.clearProfile(platform);
  }

  async dispose(): Promise<void> {
    this.disposed = true;
    const platforms = Array.from(this.records.keys());
    await Promise.all(platforms.map((p) => this.stop(p)));
```

</details>

**依据 6 · 源码核查**：[src/host/provider-transport.ts:501-546](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/provider-transport.ts#L501-L546)

明文、授权、地址和代理前置判断

<details>
<summary>查看原文（46行）</summary>

```text
    const isAuthorizedHttp = authorization?.allowHttp === true;
    const allowed = request.trust === "official"
      ? isLoopbackHost(parsed.hostname)
      : (policy.allowPublicHttp === true || isAuthorizedHttp);
    if (!allowed) {
      throw new TransportError(
        "destination-blocked",
        "Plain http:// endpoints are only allowed for loopback defaults or an explicitly authorized target",
      );
    }
  }

  // ---- 2. host authorization (before DNS) --------------------------------
  if (request.trust === "authorized" && !authorization) {
    throw new TransportError("destination-blocked", `Destination "${parsed.hostname}:${port}" is not authorized`);
  }
  if ((request.trust === "official" || request.trust === "authorized") && authorization?.allowHttp && parsed.protocol === "http:") {
    // explicit http grant for a non-loopback authorized target
  }

  // ---- 3. header hygiene -------------------------------------------------
  for (const name of Object.keys(request.headers)) assertHeaderName(name);

  // ---- 4. DNS pre-flight ------------------------------------------------
  // Runs BEFORE the proxy decision because the resolved address decides it: an
  // ambient HTTP proxy cannot reach private/LAN space (it dials from wherever
  // it runs), so a destination that resolves to a private address must be
  // dialed directly even when Windows has a system proxy configured. Without
  // this, a self-hosted source on 192.168.x.x could be saved and authorized and
  // still fail every search with `proxy-required`.
  const preflight = await preflightDns(parsed.hostname, request.trust, policy, deps);
  const pinned = preflight.addresses[0];
  const useTls = parsed.protocol === "https:";
  const privateDestination = preflight.addresses.some((record) => isPrivateOrRestrictedIp(record.address));

  // ---- 5. proxy decision (fail closed) ----------------------------------
  // Loopback and private destinations are connected directly: this only
  // bypasses proxy ROUTING, never the allowHttp/allowPrivate authorization or
  // the pinned connection below.
  const directDial = isLoopbackHost(parsed.hostname) || privateDestination;
  const proxyUrl = directDial ? undefined : deps.proxyUrl?.();
  let dispatcher: unknown;
  if (proxyUrl !== undefined && !(request.builtInOfficial === true) && !isLoopbackUrl(parsed.href)) {
    if (policy.allowProxy !== true) {
      throw new TransportError(
        "proxy-required",
```

</details>

**依据 7 · 源码核查**：[src/host/provider-transport.ts:553-585](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/provider-transport.ts#L553-L585)

禁止重定向，区分代理与直接固定地址

<details>
<summary>查看原文（33行）</summary>

```text
  // Only attach the custom dispatcher when we are NOT pinning, i.e. built-in
  // official endpoints (whose host is trusted by construction) and proxied
  // requests (where the proxy performs the connection).
  const signal = combineAbort(request.signal, policy.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS);

  const init: Record<string, unknown> = {
    method: request.method,
    headers: request.headers,
    // A 3xx must never re-send the credential to another origin.
    redirect: "error",
    signal: signal.signal,
    ...(request.body !== undefined ? { body: request.body } : {}),
  };
  let pinnedDispatcher: any = undefined;
  if (dispatcher !== undefined) {
    init.dispatcher = dispatcher;
  } else if (request.trust === "official") {
    // Built-in official endpoint: host is trusted by construction (no DNS
    // rebinding incentive — the credential goes where it was always going),
    // so the platform fetch resolves and connects normally. The redirect and
    // size guards above still apply.
  } else {
    // Operator-typed destination: always pinned to a pre-validated address.
    pinnedDispatcher = await createPinnedDispatcher({
      address: pinned.address,
      port,
      servername: parsed.hostname,
      useTls,
      connectTimeoutMs: policy.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
      connect: deps.connect,
      signal: signal.signal,
    });
    init.dispatcher = pinnedDispatcher;
```

</details>

**依据 8 · 源码核查**：[src/host/generic-fetch.ts:242-268](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/generic-fetch.ts#L242-L268)

通用抓取预检后进入手动重定向

<details>
<summary>查看原文（27行）</summary>

```text
    const validateAndResolveUrl = async (rawUrl: string): Promise<URL> => {
      try {
        const parsed = validateFetchUrl(rawUrl);
        await validateFetchDns(parsed.hostname, customDnsLookup, controller.signal);
        return parsed;
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          throw new GenericFetchError(
            abortCause === "timeout" ? "WEB_TIMEOUT" : "WEB_ABORTED",
            abortCause === "timeout" ? `Fetch timed out after ${timeoutMs}ms` : "Fetch aborted by caller",
            { url: rawUrl },
          );
        }
        if (err instanceof FetchSecurityError) {
          throw new GenericFetchError(err.code, err.message, { url: rawUrl });
        }
        throw err;
      }
    };

    let currentParsedUrl = await validateAndResolveUrl(initialUrl);
    let currentUrl = currentParsedUrl.href;
    let hopCount = 0;
    let response: Response | undefined;

    // Manual redirect loop to validate SSRF and DNS on every hop
    while (true) {
```

</details>

**依据 9 · 源码核查**：[src/host/generic-fetch.ts:317-339](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/generic-fetch.ts#L317-L339)

每跳校验重定向地址

<details>
<summary>查看原文（23行）</summary>

```text
        const location = response.headers.get("location");
        if (!location) {
          throw new GenericFetchError("WEB_HTTP_ERROR", `Redirect status ${response.status} missing Location header`, {
            statusCode: response.status,
            url: currentUrl,
          });
        }

        // Resolve relative redirect URL against current URL
        let nextUrl: string;
        try {
          nextUrl = new URL(location, currentUrl).href;
        } catch {
          throw new GenericFetchError("WEB_INVALID_URL", `Invalid redirect URL "${location}" from "${currentUrl}"`);
        }

        // Re-validate target URL and DNS for SSRF / loopback / private IP
        const validatedNext = await validateAndResolveUrl(nextUrl);
        currentParsedUrl = validatedNext;
        currentUrl = validatedNext.href;

        hopCount++;
        continue;
```

</details>

#### 缺口

- 未对 DNS 变化、代理及平台真实登录执行对抗或兼容测试
  **影响**：不能确认最终出站边界、长期会话可用性或评论完整性
  **进一步探讨**：用受控域名和本地私网哨兵验证连接地址，再用独立账号检查登录、过期与重置

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些人值得试用，如何退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

若同一 Web Profile 经常做带来源的研究，且已能配置两个独立服务，可先只启用普通搜索链，固定两个来源与任务后观察证据回收，而不在首轮开启社交账号和自定义网关。首次成本是创建 Profile、核对 patch 与设置凭据；持续成本是额度、失效 key 与链路尾时延；失败恢复要能区分认证和限流，必要时回到单一 Provider。以一次有可追溯证据且在预算内完成的任务计量，现金 API 支出与排障人时分开记录。README 给出 remove 和重启路径，移除后需回读原工具状态。曾开启平台时还应先确认专用 Profile 是否显式清理；只做普通搜索的试用不会引入该登录态。单一服务已经稳定或无法隔离凭据时，直接维持已有方案。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:208-224](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/README.md#L208-L224)

作者给出的安装、移除、重启与设置路径

<details>
<summary>查看原文（17行）</summary>

````text
## Installation & Updates

**DSH version support**: `0.1.0-rc.6` and later, including the `0.2.0-rc.x` and `0.2.1-rc.x` lines (both the `latest` and `next` channels are verified). The requirement lives in `peerDependencies`, which DSH uses to decide whether the plugin may activate; if the plugin stays inactive after a DSH upgrade, run `dsh plugin --profile web update dsh-web-tools` once.

```bash
# Install
dsh plugin --profile web add github:A3Boy/dsh-web-tools

# Update
dsh plugin --profile web update dsh-web-tools

# Remove
dsh plugin --profile web remove dsh-web-tools

```

Restart `dsh web` and navigate to `Settings` → `Web Search`.
````

</details>

**依据 2 · 源码核查**：[src/host/index.ts:232-253](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/index.ts#L232-L253)

凭据从 Host 按 ref 解析

<details>
<summary>查看原文（22行）</summary>

```text
  const resolveKeys = async (providerName: string) => {
    // Custom sources own host-derived refs (and may use two refs for Basic).
    // Resolve through the catalog so both kinds share one pool store, and a
    // custom source's key can never collide with a built-in's.
    const entry = buildSnapshot().get(providerName);
    if (entry && !entry.builtIn) {
      const refs = entry.refs;
      if (refs.username !== undefined || refs.password !== undefined) {
        // Basic auth uses two separate credentials refs so passwords containing
        // delimiters (comma, semicolon, space) are never corrupted by splitting.
        // If username is configured, return an account identifier so the pool
        // allocates a healthy dispatch slot rather than skipping the provider.
        const user = (await readCredential(ctx, refs.username ?? "")).value ?? "";
        return user ? `basic:${user}` : "";
      }
      if (refs.key === undefined) return "";
      const cred = await readCredential(ctx, refs.key);
      return cred.value ?? "";
    }
    const ref = credRefOf(providerName);
    const cred = await readCredential(ctx, ref);
    return cred.value ?? "";
```

</details>

**依据 3 · 源码核查**：[src/host/registry.ts:326-347](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/registry.ts#L326-L347)

认证、限流与重试成本来自不同支路

<details>
<summary>查看原文（22行）</summary>

```text
            // retryable:
            if (err.code === "auth") {
              // key indicted → mark unhealthy, try the next key in this pool
              markUnhealthy(entries, index);
              attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
              stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
              usable = entries.filter((e) => e.healthy);
              continue;
            }
            // non-auth retryable (429/5xx/network/timeout) → next provider
            lastError = err;
            // Only rate-limit errors carry a server-requested cooldown.
            if (err.code === "rate-limit" && typeof err.retryAfterMs === "number" && err.retryAfterMs > 0) {
              healthStore?.cooldownFor(providerName, err.retryAfterMs, "rate-limit");
            }
            attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
            stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
            providerLevelDecision = "next-provider";
            break;
          } finally {
            if (entry) releaseKey(entries, index);
          }
```

</details>

**依据 4 · 源码核查**：[src/host/browser/session-manager.ts:776-791](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/browser/session-manager.ts#L776-L791)

退出时停进程与重置浏览器资料是不同操作

<details>
<summary>查看原文（16行）</summary>

```text
  async stop(platform: BrowserPlatform): Promise<void> {
    return this.enqueue(platform, async () => {
      const rec = this.getRecord(platform);
      await this.internalStop(rec);
    });
  }

  async resetSession(platform: BrowserPlatform): Promise<void> {
    await this.stop(platform);
    this.profileStore.clearProfile(platform);
  }

  async dispose(): Promise<void> {
    this.disposed = true;
    const platforms = Array.from(this.records.keys());
    await Promise.all(platforms.map((p) => this.stop(p)));
```

</details>

#### 缺口

- 未观察实际任务成本、卸载后补丁状态或凭据清理
  **影响**：持续采用和生产上线没有验收依据
  **进一步探讨**：在隔离 Profile 检查关闭、移除、重启后原提供者与凭据状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 错误感知的双源切换何时值得保留？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是在主提供者发生间歇限流时，双源链能提高有出处任务的完成率，其代价可能是尾时延和额外请求。比较同一个隔离 Profile 中单源与双源两组，保持题集、模型、截止时间和主服务限流注入一致，第二来源可独立正常响应。记录成功定位原文率、尝试次数、p95、现金费用和排障人时。模型输出声称成功但没有原文应判失败。若成功率无改善，或尾时延和费用超过预设阈值，退回单源。现有链与冷却机制提供可测试条件，尚无本次独立效果数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/registry.ts:263-273](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/registry.ts#L263-L273)

冷却与不同故障可注入做对照

<details>
<summary>查看原文（11行）</summary>

```text
        // Provider-level cooldown (Retry-After). The store uses its own clock
        // (injectable for tests) — zero HTTP when cooling down.
        if (healthStore?.isCoolingDown(providerName)) {
          attempts.push({ provider: providerName, outcome: "skipped-cooldown" });
          continue;
        }

        // Provider-internal key failover: on AUTH failures only, try the next
        // healthy key in the SAME provider before falling back to another
        // provider. Non-auth failures (429/5xx/network/timeout) do not rotate
        // keys — they fall through to the next provider directly.
```

</details>

**依据 2 · 源码核查**：[src/host/registry.ts:335-359](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/registry.ts#L335-L359)

每个尝试和总失败提供可观测节点

<details>
<summary>查看原文（25行）</summary>

```text
            // non-auth retryable (429/5xx/network/timeout) → next provider
            lastError = err;
            // Only rate-limit errors carry a server-requested cooldown.
            if (err.code === "rate-limit" && typeof err.retryAfterMs === "number" && err.retryAfterMs > 0) {
              healthStore?.cooldownFor(providerName, err.retryAfterMs, "rate-limit");
            }
            attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
            stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
            providerLevelDecision = "next-provider";
            break;
          } finally {
            if (entry) releaseKey(entries, index);
          }
        }

        if (providerLevelDecision === "terminal") throw toWebError(lastError);
        if (providerLevelDecision === "break") break;
        // else fall through to the next provider in the chain
      }

      const reason = lastError
        ? `${lastError.code}: ${lastError.message}`
        : "no usable provider";
      const err = new WebToolsWebError(`web search failed after ${attempts.length} attempt(s): ${reason}`);
      err.attempts = attempts;
```

</details>

**依据 3 · 源码核查**：[src/host/search-mode-runtime.ts:155-178](https://github.com/A3Boy/dsh-web-tools/blob/686d87bdf688e18966733c3d070fd3698779c255/src/host/search-mode-runtime.ts#L155-L178)

不能用工具完成代替有效证据

<details>
<summary>查看原文（24行）</summary>

```text

  /**
   * Record that a web_search call COMPLETED. Completion (even a total provider
   * failure) satisfies "must research first"; success additionally records that
   * fresh web data was available.
   */
  markSearchResult(sessionId: string, succeeded: boolean): void {
    const state = this.turns.get(sessionId);
    if (!state) return;
    state.webSearchCompleted = true;
    state.webSearchSucceeded ||= succeeded;
  }

  /**
   * Record that a web_fetch call COMPLETED. A fetch also satisfies the
   * "must research first" requirement — a user-supplied URL is a valid
   * research action and must not be gated behind a pointless search.
   */
  markFetchResult(sessionId: string, succeeded: boolean): void {
    const state = this.turns.get(sessionId);
    if (!state) return;
    state.webFetchCompleted = true;
    state.webFetchSucceeded ||= succeeded;
  }
```

</details>

#### 缺口

- 未做相同任务的单源与双源对照
  **影响**：不量化可靠性收益
  **进一步探讨**：按上述观测指标执行受控故障注入

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
