# ModSearch

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[1ebc893](https://github.com/liustack/modsearch/tree/1ebc893da64208288d7882b125c50108b1270dea)

<!-- BEGIN META -->
[![GitHub ★ 962](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=962&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liustack/modsearch) [![npm 30d 63,136](https://img.shields.io/static/v1?label=npm+30d&message=63%2C136&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch)
<!-- END META -->

> **功能**：为 DSH 提供多引擎网页搜索、X 搜索和页面读取。

> **亮点**：为宿主既有网页搜索增加多引擎与超时回退，并在 X 降级时标出实际语料。HTTP 引擎复用同一代理选择规则，便于受限网络配置。见 [Q01](#research-q01) 至 [Q03](#research-q03)。

> **主要限制**：网页输出无法回溯每次回退。代理 DNS 与云取页另有边界，设置端点是否受鉴权保护也依赖部署。见 [Q03](#research-q03) 与 [Q04](#research-q04)。

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
  - [Q01 · 包怎样接入 DSH，搜索与阅读走哪条路径？](#detail-section-11)
  - [Q02 · 引擎回退和代理规则怎样影响一次检索？](#detail-section-12)
  - [Q03 · 模型看到的来源能否说明实际搜索过哪里？](#detail-section-13)
  - [Q04 · 代理、云读取和配置写入分别有什么边界？](#detail-section-14)
  - [Q05 · 怎样验证统一脱敏路由摘要能减少误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 中检索公开资料的用户，可把网页或 X 结果纳入回答，并对照原始链接验证。

宿主原生搜索与单一服务足以处理普通查询。ModSearch 在一个入口下组织多引擎、X 后备和按问题阅读，用户仍需核对结果和数据流。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 网页搜索 | 按预算检索公开网页 | 依服务与网络，宿主不展示完整尝试 |
| X 搜索 | 获取 X 或网页二手资料 | X 不可用时保留降级标记 |
| 页面读取 | 摘要或按问题抽取内容 | 云与代理各有外发和解析边界 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 22.13+ 与构建产物 | CLI 必需 | 运行搜索 | 检查包安装和 dist |
| 兼容 DSH provider 与工具 API | 宿主使用需用 | 注册入口 | 跳过或部分功能缺失 |
| 可达引擎及相应账号 | 视引擎而定 | 外部检索 | 按预算回退或失败 |
| 宿主或反代鉴权 | 开放管理界面前需核实 | 保护配置读写 | 限制访问或关设置卡 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户核对包、profile、引擎和代理 | 确认可恢复原宿主路由 |
| 2 | 用户发一条公开测试查询 | 对照引用原文与实际语料 |
| 3 | 用户检查回退或读取警告 | 无法核对时停用并回原工具 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包下载和引擎额度，费用未知 | 配置 profile、凭据和代理 | 兼容和用时未知 |
| 持续 | 搜索、回退及传输，金额未知 | 打开来源并核对语料 | 每份合格结果费用未知 |
| 失败与退出 | 重试消耗配额，数值未知 | 查 CLI 轨迹、保护配置并恢复原路由 | 宿主输出不能重建完整轨迹 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多引擎搜索 | 依据时间、可用性和失败种类安排后备 | 查询质量和稳定性 |
| 代理接入 | HTTP 请求显式使用代理分流 | 真实出口和各服务接受情况 |
| X 来源核对 | 网页回答标记为二手语料 | 用户能否一致识别及是否正确引用 |

> **思考**：网页输出无法回溯每次回退。代理 DNS 与云取页另有边界，设置端点是否受鉴权保护也依赖部署。见 [Q03](#research-q03) 与 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：为宿主既有网页搜索增加多引擎与超时回退，并在 X 降级时标出实际语料。HTTP 引擎复用同一代理选择规则，便于受限网络配置。见 [Q01](#research-q01) 至 [Q03](#research-q03)。

宿主绑定、预算调度、HTTP 请求和页面安全检查分层。运行事实由调度器覆盖，Web 与 X 的输出协议不同。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

网页输出无法回溯每次回退。代理 DNS 与云取页另有边界，设置端点是否受鉴权保护也依赖部署。见 [Q03](#research-q03) 与 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用公开查询核对目标引擎、输出和引用，再检查代理与管理权限。来源无法核对或请求不应外发时回原生工具。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持多引擎接线、代理适配及 X 降级语料标记。真实服务可用性、数据流与检索质量待验，统一摘要是未验证设想。

- 已检查：作者 README、包清单、源码路径 CHANGELOG.md、cordis.patch.yml、dsh/index.js、package.json、src/providers/firecrawl.ts、src/providers/http/network.ts、src/providers/httpFetch.ts、src/providers/keenable.ts、src/providers/youcom.ts、src/router.ts、src/search.ts、src/util/proxy.ts、src/util/timedRequest.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查包和宿主入口、代理、预算、X 降级、云及本地读取和配置路径。第三方服务内部、具体出网和宿主运行未核验。
- 下一步：用隔离环境做代理绕过、引擎拒绝、X 降级、云 URL 与匿名配置访问对照，记录原始来源和实际出网。

**分析版本**

- **仓库**：[liustack/modsearch](https://github.com/liustack/modsearch)
- **版本号**：5.10.12（[固定提交 1ebc893](https://github.com/liustack/modsearch/tree/1ebc893da64208288d7882b125c50108b1270dea)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把实际语料、引擎和回退标志加入同一份脱敏摘要，可能减少对搜索来源的误判。以固定回退场景和合格检索数比较识别效果。见 [Q05](#research-q05)。

用隔离环境做代理绕过、引擎拒绝、X 降级、云 URL 与匿名配置访问对照，记录原始来源和实际出网。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 4191 | — | — | 54462 |
| .js | source | 4 | 2231 | 1666 | 476 | — |
| .mjs | source | 11 | 670 | 540 | 95 | — |
| .mjs | test | 3 | 104 | 87 | 3 | — |
| .ts | test | 29 | 8951 | 7679 | 745 | — |
| .ts | source | 32 | 6625 | 4948 | 1147 | — |
| .ts | example | 1 | 50 | 39 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/liustack/modsearch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=10&color=737b86&logo=github)](https://github.com/liustack/modsearch/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/liustack/modsearch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户用 ModSearch 搜索公开网页或 X 时，如何判断真正的来源、回退和网络边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 包怎样接入 DSH，搜索与阅读走哪条路径？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

需要在 DSH 对话查公开资料的用户，可以让宿主原有 web_search 路由到 ModSearch，并使用单独的 x_search 和 read_page。根包导出 DSH 模块、声明 bundle patch，同时提供编译后的 CLI。patch 把 searchProvider 指向 modsearch，保留 web_fetch 的 http 提供者选择。宿主如果缺注册搜索提供者的 API，插件会跳过该注册并打印诊断。真正的 search、X 和页面阅读都调用 Node 子进程中的 CLI，根据调用加不同预算和参数，再解析 JSON。源码仓库若缺 dist，调用前会报缺构建产物，不能把插件成功显示在宿主列表当作已能搜索。read_page 输出可含摘要、正文和链接，原生 web_fetch 则继续负责宿主的原始取页入口。对比原生单引擎，新增的是路由、X 和聚焦阅读的组合。验收应核对选定 profile 下实际调用到的工具和能打开的来源。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-8](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/package.json#L2-L8)

CLI 包版本及 bin。

```text
  "name": "@liustack/modsearch",
  "version": "5.10.12",
  "description": "The strongest free web search plugin for coding agents. Plug-in web search, X search, and page fetch for models without native web access. Free out of the box: no signup, no API key (Firecrawl keyless, 1,000 free credits/month)",
  "type": "module",
  "bin": {
    "modsearch": "./dist/main.js"
  },
```

**依据 2 · 源码核查**：[package.json:55-73](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/package.json#L55-L73)

Node 要求、宿主入口和 bundle。

<details>
<summary>查看原文（19行）</summary>

```text
  "engines": {
    "node": ">=22.13"
  },
  "exports": {
    ".": "./dsh/index.js",
    "./dsh": "./dsh/index.js",
    "./client": "./dsh/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web",
      "immediately": true
    }
  },
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:9-16](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/cordis.patch.yml#L9-L16)

接管搜索，保留原 fetch 选择。

```text
- id: web
  config:
    searchProvider: modsearch
    fetchProvider: http

- insert:
    - id: modsearch
      name: '@liustack/modsearch'
```

**依据 4 · 源码核查**：[dsh/index.js:135-174](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L135-L174)

宿主注册、预算和 CLI 调用。

<details>
<summary>查看原文（40行）</summary>

```text
function registerSearchProvider(ctx, config) {
  if (typeof ctx.web?.registerSearchProvider !== 'function') {
    // A developer-preview surface move: degrade to the tools-only plugin,
    // but say so in the harness log instead of vanishing.
    console.error('[modsearch] web seam has no registerSearchProvider; search provider skipped');
    return;
  }
  const timeoutMs = config.providerTimeoutMs ?? PROVIDER_TIMEOUT_MS;
  const deadlineMs = config.providerDeadlineMs ?? PROVIDER_DEADLINE_MS;
  ctx.web.registerSearchProvider({
    id: 'modsearch',
    available: () => true,
    async search(request, signal) {
      const args = [
        '-q',
        request.query,
        '--source',
        'web',
        '--timeout',
        String(timeoutMs),
        '--deadline',
        String(deadlineMs),
      ];
      if (typeof request.maxResults === 'number') {
        args.push('--max-results', String(request.maxResults));
      }
      const entry = await runCli(args, signal);
      const lines = [entry.summary];
      const uncertainty = Array.isArray(entry.uncertainty) ? entry.uncertainty : [];
      if (uncertainty.length > 0) {
        lines.push(`Uncertain: ${uncertainty.join('; ')}`);
      }
      return {
        content: lines.filter(Boolean).join('\n'),
        sources: toSources(entry.items),
        // The CLI already enforces --max-results; the seam re-caps regardless.
        truncated: false,
      };
    },
  });
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:226-241](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L226-L241)

独立 X 工具调用。

<details>
<summary>查看原文（16行）</summary>

```text
        throw new Error('x_search needs a non-empty string "query".');
      }
      const cliArgs = ['-q', args.query, '--source', 'x', ...ownToolBudget()];
      if (typeof args.max_results === 'number' && args.max_results > 0) {
        cliArgs.push('--max-results', String(Math.floor(args.max_results)));
      }
      const entry = await runCli(cliArgs, exec.signal);
      // The canonical value is the evidence plus its provenance; routing
      // details (attempts, durations, engine spend) stay operational.
      return {
        status: entry.status,
        source: entry.source,
        summary: entry.summary,
        items: Array.isArray(entry.items) ? entry.items : [],
        uncertainty: Array.isArray(entry.uncertainty) ? entry.uncertainty : [],
      };
```

</details>

**依据 6 · 源码核查**：[dsh/index.js:289-303](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L289-L303)

独立阅读路径。

<details>
<summary>查看原文（15行）</summary>

```text
      if (typeof args?.url !== 'string' || !/^https?:\/\//i.test(args.url.trim())) {
        throw new Error('read_page needs an http(s) "url".');
      }
      const cliArgs = ['-u', args.url, ...ownToolBudget()];
      if (typeof args.query === 'string' && args.query.trim() !== '') {
        cliArgs.push('-q', args.query);
      }
      const entry = await runCli(cliArgs, exec.signal);
      return {
        summary: entry.summary,
        content: typeof entry.content === 'string' ? entry.content : '',
        ...(Array.isArray(entry.links) ? { links: entry.links } : {}),
        uncertainty: Array.isArray(entry.uncertainty) ? entry.uncertainty : [],
        warnings: Array.isArray(entry.warnings) ? entry.warnings : [],
      };
```

</details>

**依据 7 · 源码核查**：[dsh/index.js:337-374](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L337-L374)

检查构建、启动进程和解析响应。

<details>
<summary>查看原文（38行）</summary>

```text
function cliPath() {
  const cli = process.env.MODSEARCH_DSH_CLI || CLI_PATH;
  if (!existsSync(cli)) {
    throw new Error(
      `modsearch's CLI build is missing (${cli}). This happens when the plugin was ` +
        'installed from its GitHub repository, which ships source only. Remove the ' +
        'plugin and add it again by package name: @liustack/modsearch',
    );
  }
  return cli;
}

async function runCli(args, signal) {
  const cli = cliPath();
  const { stdout, stderr, code } = await run(process.execPath, [cli, ...args], signal, childEnv());
  if (code !== 0) {
    throw new Error(`modsearch failed (exit ${code}): ${(stderr || stdout).trim().slice(0, 500)}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    throw new Error(`modsearch produced no JSON: ${stdout.trim().slice(0, 300)}`);
  }
  const entry = Array.isArray(parsed.results) ? parsed.results[0] : undefined;
  if (!entry || typeof entry.summary !== 'string') {
    throw new Error('modsearch returned an envelope without a usable source entry');
  }
  if (entry.status === 'unavailable') {
    const attempts = (Array.isArray(entry.attempts) ? entry.attempts : [])
      .map((attempt) => `${attempt.engine}: ${attempt.error ?? 'skipped'}`)
      .join('; ');
    throw new Error(
      `modsearch could not reach the requested source${attempts ? ` (${attempts})` : ''}. ` +
        'Run `npx @liustack/modsearch doctor` in a terminal to check the engine setup.',
    );
  }
  return entry;
```

</details>

#### 缺口

- 未在真实 DSH profile 加载本版本。
  **影响**：宿主接口及包构建可用性仍未知。
  **进一步探讨**：在隔离 profile 检查工具表和实际子进程，以一条公开查询验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 引擎回退和代理规则怎样影响一次检索？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

HTTP 引擎请求使用统一 requestText。它用 URL 协议读代理变量，HTTPS 可回退 HTTP 代理，用 no_proxy 的通配、域后缀和端口排除相应目标。选中代理时为这次 fetch 加 undici dispatcher，请求和读正文沿同一 abort 信号，结束后关闭 dispatcher。传输错误会附一层 cause 并脱敏，但超时路径会输出自己的超时提示。对受支持的 HTTP 引擎，这让只通过代理出网的环境可以配置一条确定的路径，而子进程引擎是否遵守该规则还取决于自己的客户端。一次运行根据剩余总预算分配每个尝试，没有预算会记录跳过。密钥类错误才在同引擎旋转下一把钥匙，其他错误进入下一引擎。Firecrawl 无钥匙遇到 401 或 403 且响应含 VPN 或 proxy 提示时会给特定错误，即使代理已能连上也可能被提供方拒绝，不能把共享额度或可用性视为保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/util/proxy.ts:17-24](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/util/proxy.ts#L17-L24)

协议和大小写变量优先级。

```text
function proxyUriForProtocol(protocol: string, env: NodeJS.ProcessEnv): string | null {
  if (protocol === 'http:') {
    return firstNonEmpty([env.http_proxy, env.HTTP_PROXY]);
  }
  if (protocol === 'https:') {
    return firstNonEmpty([env.https_proxy, env.HTTPS_PROXY, env.http_proxy, env.HTTP_PROXY]);
  }
  return null;
```

**依据 2 · 源码核查**：[src/util/proxy.ts:34-80](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/util/proxy.ts#L34-L80)

排除列表的实际匹配。

<details>
<summary>查看原文（47行）</summary>

```text
function isExcludedByNoProxy(url: URL, env: NodeJS.ProcessEnv): boolean {
  const raw = env.no_proxy ?? env.NO_PROXY;
  if (raw === undefined) {
    return false;
  }
  const trimmed = raw.trim();
  if (trimmed === '') {
    return false;
  }
  if (trimmed === '*') {
    return true;
  }

  const hostname = url.hostname.toLowerCase();
  const port = urlPort(url);

  for (const part of trimmed.split(/[,\s]/)) {
    if (!part) {
      continue;
    }
    if (part === '*') {
      return true;
    }
    const parsed = part.match(/^(.+):(\d+)$/);
    const hostRaw = parsed ? parsed[1] : part;
    const entryHost = hostRaw.replace(/^\*?\./, '').toLowerCase();
    const entryPort = parsed ? Number.parseInt(parsed[2], 10) : undefined;
    if (entryPort !== undefined && entryPort !== port) {
      continue;
    }
    if (hostname === entryHost || hostname.endsWith(`.${entryHost}`)) {
      return true;
    }
  }
  return false;
}

/** Which system HTTP proxy to use for this URL, or null to go direct. */
export function resolveProxyForUrl(url: URL, env: NodeJS.ProcessEnv): string | null {
  const proxyUrl = proxyUriForProtocol(url.protocol, env);
  if (!proxyUrl) {
    return null;
  }
  if (isExcludedByNoProxy(url, env)) {
    return null;
  }
  return proxyUrl;
```

</details>

**依据 3 · 源码核查**：[src/util/timedRequest.ts:23-70](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/util/timedRequest.ts#L23-L70)

代理 dispatcher、cause、正文和清理。

<details>
<summary>查看原文（48行）</summary>

```text
export async function requestText(
  label: string,
  url: string,
  init: RequestInit,
  signal: AbortSignal,
  timeoutMs: number,
  secrets: ReadonlyArray<string | undefined | null>,
): Promise<{ response: Response; text: string }> {
  const fail = (error: unknown): Error =>
    signal.aborted
      ? new Error(`${label} timed out after ${timeoutMs} ms.`)
      : new Error(
          `${label} request failed: ${redactSecrets(
            formatErrorWithCause(error),
            secrets,
          )}`,
        );

  const proxyUrl = resolveProxyForUrl(new URL(url), process.env);
  // NO_PROXY was already applied above, so the agent gets an empty one and
  // always takes the proxy it is handed.
  const dispatcher = proxyUrl
    ? new EnvHttpProxyAgent({ httpProxy: proxyUrl, httpsProxy: proxyUrl, noProxy: '' })
    : undefined;
  try {
    let response: Response;
    try {
      // `dispatcher` is a Node/undici extension to fetch's options, not in the
      // DOM RequestInit type, so it is attached through a cast.
      response = await fetch(url, {
        ...init,
        signal,
        ...(dispatcher ? { dispatcher } : {}),
      } as RequestInit & { dispatcher?: Dispatcher });
    } catch (error) {
      throw fail(error);
    }
    try {
      return { response, text: await response.text() };
    } catch (error) {
      if (!response.ok && !signal.aborted) {
        return { response, text: '' };
      }
      throw fail(error);
    }
  } finally {
    await dispatcher?.close();
  }
```

</details>

**依据 4 · 源码核查**：[src/providers/youcom.ts:38-48](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/providers/youcom.ts#L38-L48)

真实 HTTP 引擎经公共包装发送查询。

<details>
<summary>查看原文（11行）</summary>

```text
  const url = new URL(YOUCOM_KEYLESS_ENDPOINT);
  url.searchParams.set('query', options.query);
  url.searchParams.set('count', String(maxResults));
  const { response, text } = await requestText(
    'youcom',
    url.toString(),
    { method: 'GET', headers: { accept: 'application/json' } },
    AbortSignal.timeout(options.timeoutMs),
    options.timeoutMs,
    [],
  );
```

</details>

**依据 5 · 源码核查**：[src/search.ts:332-360](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/search.ts#L332-L360)

剩余预算约束与跳过。

<details>
<summary>查看原文（29行）</summary>

```text
    for (let runIndex = 0; runIndex < keyRuns.length; runIndex += 1) {
      const keyRun = keyRuns[runIndex];
      const budget = attemptBudget(timeoutMs, deadline);
      if (!budget) {
        // The run is out of time: record the engine as skipped rather than
        // starting it, so the trail shows the deadline, not a silent gap.
        const message = `skipped: the run deadline of ${deadline?.ms} ms was used up before it could start.`;
        failures.push(`${engine.name}: ${message}`);
        attempts.push({ engine: engine.name, ok: false, error: message, durationSeconds: null });
        break;
      }
      const startedAt = Date.now();
      try {
        output = await callEngine(
          engine,
          {
            mode,
            query,
            url,
            model,
            maxResults: options.maxResults,
            extraPrompt: options.prompt,
            workdir: options.workdir,
            timeoutMs: budget.engineTimeoutMs,
            settings: { ...settings, apiKey: keyRun.apiKey },
            apiKeySecrets: apiKeys,
            allowPrivateNetwork,
          },
          budget.killAfterMs,
```

</details>

**依据 6 · 源码核查**：[src/search.ts:365-402](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/search.ts#L365-L402)

脱敏尝试、冷却及同引擎换钥匙条件。

<details>
<summary>查看原文（38行）</summary>

```text
      } catch (error) {
        // Engines redact their own errors, but attempts and warnings travel into
        // output and model contexts, so the record gets the belt too.
        const message = redactSecrets(
          error instanceof Error ? error.message : String(error),
          apiKeys,
        );
        const keyLabel = apiKeys.length > 1 ? ` (API key ${Number(keyRun.keyIndex) + 1})` : '';
        failures.push(`${engine.name}${keyLabel}: ${message}`);
        attempts.push({
          engine: engine.name,
          ...(apiKeys.length > 1 ? { keyIndex: keyRun.keyIndex } : {}),
          ok: false,
          error: message,
          durationSeconds: (Date.now() - startedAt) / 1000,
        });
        // A lasting failure (quota, region lock) is remembered so a later run
        // fails over first. A transient one (rate limit, timeout) records nothing.
        if (controller) {
          const entry = controller.record(engine.name, error, keyRun.keyIndex);
          if (entry) {
            const keyNote = keyRun.keyIndex === undefined ? '' : ` API key ${keyRun.keyIndex + 1}`;
            cooldownNotes.push(
              `The ${engine.name} engine${keyNote} hit a lasting limit (quota or region) and is now cooling until ${entry.until}.`,
            );
          }
        }
        const hasNextKey = runIndex + 1 < keyRuns.length;
        if (hasNextKey && isApiKeyFailure(error)) {
          continue;
        }
        break;
      }
    }

    if (!output) {
      continue;
    }
```

</details>

**依据 7 · 源码核查**：[src/providers/firecrawl.ts:109-137](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/providers/firecrawl.ts#L109-L137)

区分额度、认证和提供方代理拒绝。

<details>
<summary>查看原文（29行）</summary>

```text
  // The API's error body is foreign text that loves to echo the Authorization
  // header; scrub it before it travels into messages.
  const detail = redactSecrets(text.trim(), apiKeySecrets);
  const message = `firecrawl returned ${response.status} ${response.statusText}.${detail ? ` ${detail}` : ''}`;
  if (response.status >= 500) {
    throw new Error(message);
  }
  // A 402 or a credit/quota message is the quota class the cooldown layer reads.
  if (response.status === 402 || isQuotaFailureMessage(detail)) {
    throw new ApiKeyFailureError(
      `firecrawl is out of credits: ${detail || `HTTP ${response.status}`}. Add credit or set your own key at https://firecrawl.dev, or use another engine.`,
    );
  }
  if (response.status === 401 || response.status === 403) {
    if (!apiKey) {
      // Firecrawl turns anonymous calls away from IPs it reads as a VPN or a
      // proxy, which a machine behind a corporate or Clash-style proxy always
      // is. Waiting does not help there, so say what does.
      if (/VPN or proxy/i.test(detail)) {
        throw new Error(
          `firecrawl does not allow keyless use from a proxy or VPN exit IP. Set a free key: modsearch config set firecrawl.apiKey <key>, or use keenable or youcom. (${detail})`,
        );
      }
      throw new Error(
        `firecrawl rejected the keyless request (${response.status}). Anonymous access may be unavailable or rate-limited. Set your own key: modsearch config set firecrawl.apiKey <key>${detail ? ` (${detail})` : ''}`,
      );
    }
    throw new ApiKeyFailureError(
      `firecrawl rejected the API key (${response.status}). Fix it: modsearch config set firecrawl.apiKey <key>${detail ? ` (${detail})` : ''}`,
```

</details>

#### 缺口

- 实际代理出口、服务配额和跨提供方耗时未测。
  **影响**：不能保证接通、自动回退质量或总调用费用。
  **进一步探讨**：用同一测试请求分别走直连、代理、排除规则和注入的拒绝，记录每次实际出口和耗时。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模型看到的来源能否说明实际搜索过哪里？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

CLI 的路由器先按请求语料决定尝试链。X 单独请求时可用网页引擎作为后备，若同时已请求网页且没有 X 引擎，会保留显式不可用的 X 槽。X 计划由网页引擎回答时由调度器重写 actual source 为 web、status 为 degraded，并剥掉提供方返回的路由字段，避免引擎自己改写尝试信息。DSH 的 x_search 保留 source 和 status，可以知道是网页二手覆盖，却没有返回完整尝试和实际引擎。网页 provider 只交付摘要、不确定性与引用源，成功时不保留引擎、回退警告与尝试轨迹。read_page 会保留 warnings，能显示部分云或代理提示。读者可打开引用原文，但引用列表只能说明输出带了哪些链接，无法重构调用或证明提供方摘要准确。跨源补位应以实际语料、最终引擎和原始链接分别核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/router.ts:248-294](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/router.ts#L248-L294)

X 不可用和网页回退的选择。

<details>
<summary>查看原文（47行）</summary>

```text
    if (source === 'x') {
      // X has one engine. When it is unusable, the web is the only thing left,
      // and the answer must say it is second-hand. An explicit --engine carries
      // into that fallback too, so a hard force stays a hard force.
      const web = planRole('search', input.config, input.requestedEngine, env, input.cooldown);
      const social = chain.filter((engine) => engine.roles.includes('social'));
      if (social.length === 0) {
        if (webRequested) {
          // The web entry already answers this ground, so do not run a second
          // identical search. But do not silently drop the X slot either: emit
          // an explicit empty entry marked unavailable, so nobody mistakes the
          // web result for X coverage.
          return [
            {
              source: 'x' as Source,
              fallbacks: [],
              notes: [...notes, X_DEGRADE_NOTE],
              unavailable: true,
            },
          ];
        }
        return [
          {
            source: 'x' as Source,
            engine: web.chain[0],
            fallbacks: web.chain.slice(1),
            notes: [...notes, X_DEGRADE_NOTE],
          },
        ];
      }
      return [
        {
          source: 'x' as Source,
          engine: social[0],
          fallbacks: [...social.slice(1), ...web.chain],
          // Falling back to a web engine mid-run is still second-hand evidence,
          // so the caveat has to travel with the plan, not just the no-grok case.
          degradeNote: X_DEGRADE_NOTE,
          notes,
        },
      ];
    }

    // A web result answering a web request is not degraded. When X was also
    // asked for and is unreachable, the explicit unavailable X entry above
    // carries that caveat, so this entry stays a clean web answer.
    return [{ source, engine: chain[0], fallbacks: chain.slice(1), notes }];
```

</details>

**依据 2 · 源码核查**：[src/search.ts:419-447](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/search.ts#L419-L447)

成功后补回退提示并标出实际语料。

<details>
<summary>查看原文（29行）</summary>

```text
    const warnings = [...plan.notes, ...cooldownNotes, ...(controller?.warnings ?? [])];
    if (failures.length > 0) {
      const rotatedWithinEngine =
        failuresBeforeEngine === 0 &&
        failures.length > failuresBeforeEngine &&
        successfulKeyIndex !== undefined;
      warnings.push(
        rotatedWithinEngine && successfulKeyIndex !== undefined
          ? `Rotated to ${engine.name} API key ${successfulKeyIndex + 1} after: ${failures.join(' | ')}`
          : `Fell back to ${engine.name} after: ${failures.join(' | ')}`,
      );
      // A web engine answering an X request is second-hand evidence whether the
      // X engine was missing or died mid-run.
      if (plan.degradeNote && !engine.roles.includes('social')) {
        warnings.push(plan.degradeNote);
      }
    }

    // The corpus this answer really came from. An X plan served by a web engine
    // (Grok missing or dead) is second-hand web data: label it `web` with
    // `status: "degraded"` so nobody reads it as X coverage. A social engine
    // answering an X plan is the real thing.
    const requestedSource = plan.source;
    let actualSource: Source = plan.source;
    let status: SourceStatus = 'ok';
    if (plan.source === 'x' && !engine.roles.includes('social')) {
      actualSource = 'web';
      status = 'degraded';
    }
```

</details>

**依据 3 · 源码核查**：[src/search.ts:454-470](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/search.ts#L454-L470)

调度器移除提供方自报路由字段。

<details>
<summary>查看原文（17行）</summary>

```text
    // The local engine hands its own runtime notices back as `warnings`. Merge
    // those in after the routing ones. Other engines emit no warnings key.
    const engineWarnings = Array.isArray(body.warnings)
      ? (body.warnings as unknown[]).filter((line): line is string => typeof line === 'string')
      : [];

    // Routing facts and the warnings/attempts channels are stamped by modsearch,
    // never by the engine: strip any key the engine returned with these names so
    // it cannot rewrite who answered or forge a routing warning.
    delete body.source;
    delete body.requestedSource;
    delete body.engine;
    delete body.model;
    delete body.status;
    delete body.durationSeconds;
    delete body.warnings;
    delete body.attempts;
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:161-172](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L161-L172)

网页结果只投影内容和来源。

<details>
<summary>查看原文（12行）</summary>

```text
      const entry = await runCli(args, signal);
      const lines = [entry.summary];
      const uncertainty = Array.isArray(entry.uncertainty) ? entry.uncertainty : [];
      if (uncertainty.length > 0) {
        lines.push(`Uncertain: ${uncertainty.join('; ')}`);
      }
      return {
        content: lines.filter(Boolean).join('\n'),
        sources: toSources(entry.items),
        // The CLI already enforces --max-results; the seam re-caps regardless.
        truncated: false,
      };
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:232-241](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L232-L241)

X 保留状态和语料，不返回尝试。

<details>
<summary>查看原文（10行）</summary>

```text
      const entry = await runCli(cliArgs, exec.signal);
      // The canonical value is the evidence plus its provenance; routing
      // details (attempts, durations, engine spend) stay operational.
      return {
        status: entry.status,
        source: entry.source,
        summary: entry.summary,
        items: Array.isArray(entry.items) ? entry.items : [],
        uncertainty: Array.isArray(entry.uncertainty) ? entry.uncertainty : [],
      };
```

</details>

**依据 6 · 源码核查**：[dsh/index.js:296-303](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L296-L303)

页面阅读保留 warnings。

```text
      const entry = await runCli(cliArgs, exec.signal);
      return {
        summary: entry.summary,
        content: typeof entry.content === 'string' ? entry.content : '',
        ...(Array.isArray(entry.links) ? { links: entry.links } : {}),
        uncertainty: Array.isArray(entry.uncertainty) ? entry.uncertainty : [],
        warnings: Array.isArray(entry.warnings) ? entry.warnings : [],
      };
```

#### 缺口

- 宿主界面与模型上下文如何消费这些字段尚未验收。
  **影响**：不能推断用户一定能识别回退或证据的二手性质。
  **进一步探讨**：用固定代理返回一次 X 失败和网页成功，分别读取 CLI JSON、宿主工具输出和用户所见卡片。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 代理、云读取和配置写入分别有什么边界？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

本地取页每次重定向都先检查目标。直连使用检查结果钉住地址，代理路径仍有本地预检，但由代理重新解析，因此无法用本机预检证明代理实际连接相同地址。Firecrawl 另外拦字面私有和保留地址，对域名只在解析出的地址都被判私有或保留时阻止披露。普通 DNS 失败会视为未证实私有，混合公私地址也可能放行；实际抓取会把 URL 发送到提供方。搜索引擎同样需要接收查询，不能把默认网络限制理解成查询不外发。配置页路由可 GET 摘要、POST 写设置，限制请求体但该 handler 未检查身份或 Origin；部署应由宿主或反代保护。设置代码可改默认引擎和键控引擎地址，使用共享配置文件，所以同机不同 profile 不构成配置隔离。只适合在可控制出网和配置的环境先用公开、无敏感资料试用，遇到来源无法核对、路由外发不符合要求或配置端点可未授权访问时停用并回原生工具或本地资料。

#### 证据与依据

**依据 1 · 源码核查**：[src/providers/httpFetch.ts:106-142](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/providers/httpFetch.ts#L106-L142)

逐跳预检、代理与直接钉址分流。

<details>
<summary>查看原文（37行）</summary>

```text
  try {
    for (let i = 0; i <= maxRedirects; i += 1) {
      // Preflight every hop. Pin the socket on the direct path. A system HTTP
      // proxy does DNS itself, so that path does not pin.
      let pinned: PinnedTarget;
      try {
        pinned = await assertSafeRemoteTarget(currentUrl, allowPrivateNetwork, deadline);
      } catch (error) {
        if (deadline.aborted) {
          throw new Error(`Request timed out after ${timeoutMs} ms.`);
        }
        throw error;
      }
      const proxyUrl = resolveProxyForUrl(currentUrl, process.env);
      const dispatcher = proxyUrl
        ? proxyDispatcher(proxyUrl, allowPrivateNetwork)
        : pinnedDispatcher(pinned, allowPrivateNetwork);
      if (proxyUrl) {
        proxied = true;
      }
      dispatchers.push(dispatcher);

      const { response } = await fetchOnce(currentUrl, dispatcher, deadline, timeoutMs, userAgent);
      if (isRedirectStatus(response.status)) {
        const location = response.headers.get('location');
        if (!location) {
          throw new Error(`Redirect response (${response.status}) missing location header.`);
        }

        if (i === maxRedirects) {
          throw new Error(`Too many redirects. Max redirects: ${maxRedirects}.`);
        }

        const nextUrl = new URL(location, currentUrl);
        redirectChain.push(currentUrl.toString());
        currentUrl = nextUrl;
        continue;
```

</details>

**依据 2 · 源码核查**：[src/providers/http/network.ts:208-228](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/providers/http/network.ts#L208-L228)

云预检混合地址及普通 DNS 失败路径。

<details>
<summary>查看原文（21行）</summary>

```text
  const hostname = stripIpv6Brackets(url.hostname);
  const ipFamily = isIP(hostname);
  if (ipFamily > 0) {
    return { reserved: isPrivateIpAddress(hostname), addresses: [hostname] };
  }

  try {
    const resolved = await lookupAll(hostname, signal);
    const addresses = resolved.map((record) => record.address);
    return {
      reserved:
        addresses.length > 0 && addresses.every((address) => isPrivateForCloudDisclosure(address)),
      addresses,
    };
  } catch {
    // Out of time is the caller's deadline, not an unknown target.
    if (signal?.aborted) {
      throw signal.reason;
    }
    // Cannot confirm it is private from here, so do not block the cloud engine.
    return { reserved: false, addresses: [] };
```

</details>

**依据 3 · 源码核查**：[src/providers/firecrawl.ts:216-245](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/providers/firecrawl.ts#L216-L245)

私有地址挡下，允许的 URL 发往云 API。

<details>
<summary>查看原文（30行）</summary>

```text
  if (isLiteralReservedTarget(target)) {
    throw new Error(
      `firecrawl does not fetch the private or reserved target ${target.hostname}. Use the local engine instead.`,
    );
  }
  let disclosure: CloudDisclosureInspection;
  try {
    disclosure = await inspectCloudDisclosureTarget(target, deadline);
  } catch (error) {
    if (deadline.aborted) {
      throw new Error(`firecrawl timed out after ${options.timeoutMs} ms.`);
    }
    throw error;
  }
  if (disclosure.reserved) {
    const resolved =
      disclosure.addresses.length > 0 ? ` -> ${disclosure.addresses.join(', ')}` : '';
    throw new Error(
      `firecrawl does not fetch the private or reserved target ${target.hostname}${resolved}. If a VPN or proxy on this machine uses fake-IP DNS, a public hostname may look reserved here. Use the local engine instead.`,
    );
  }

  const startedAt = Date.now();
  const data = await firecrawlPost<FirecrawlScrapeResponse>(
    resolveEndpoint(options.settings.baseURL, FIRECRAWL_DEFAULT_BASE, '/v2/scrape'),
    apiKey,
    apiKeySecrets,
    {
      url: target.toString(),
      formats: ['markdown', 'links'],
```

</details>

**依据 4 · 源码核查**：[src/providers/keenable.ts:54-68](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/providers/keenable.ts#L54-L68)

搜索文本进入提供方请求。

<details>
<summary>查看原文（15行）</summary>

```text
  const { response, text } = await requestText(
    'keenable',
    resolveEndpoint(
      options.settings.baseURL,
      KEENABLE_DEFAULT_BASE,
      apiKey ? '/v1/search' : '/v1/search/public',
    ),
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: options.query, max_results: maxResults }),
    },
    AbortSignal.timeout(options.timeoutMs),
    options.timeoutMs,
    [...apiKeySecrets, options.settings.baseURL],
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:548-551](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L548-L551)

设置读写共享文件路径。

```text
/** ~/.modsearch/config.json, the one file every harness shares. */
function modsearchConfigPath() {
  return join(homedir(), '.modsearch', 'config.json');
}
```

**依据 6 · 源码核查**：[dsh/index.js:665-692](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L665-L692)

可设置引擎和提供方选项。

<details>
<summary>查看原文（28行）</summary>

```text
function applyCardSettings(patch) {
  const config = readModsearchConfig();
  if (patch?.engine !== undefined) {
    const pin = typeof patch.engine === 'string' ? patch.engine.trim() : '';
    if (pin === '') {
      // Empty is the CLI's own spelling of automatic, not a missing value.
      config.engine = '';
    } else {
      const engine = canonicalEngine(pin);
      if (!CARD_ENGINES.includes(engine)) {
        throw new Error(`unknown engine: ${patch.engine}`);
      }
      config.engine = engine;
    }
  }
  // Engine fields are edited one engine at a time, named by `target`. Absent
  // means this save touched no engine settings, which is what a pin-only save
  // looks like.
  if (patch?.target !== undefined) {
    const engine = canonicalEngine(patch.target);
    if (!CARD_ENGINES.includes(engine)) {
      throw new Error(`unknown engine: ${patch.target}`);
    }
    if (
      !KEYED_ENGINES.includes(engine) &&
      (patch.apiKey !== undefined || patch.baseURL !== undefined)
    ) {
      throw new Error(`${engine} takes no API key or base URL`);
```

</details>

**依据 7 · 源码核查**：[dsh/index.js:709-716](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L709-L716)

可变更 baseURL。

```text
    const settings = { ...config.engines[target] };
    if (patch.baseURL !== undefined) {
      const baseURL = typeof patch.baseURL === 'string' ? patch.baseURL.trim() : '';
      if (baseURL === '') {
        // Empty unsets the override, back to the official endpoint.
        delete settings.baseURL;
      } else if (!/^https?:\/\//i.test(baseURL)) {
        // The same rule the CLI applies, and for the same reason: this host
```

**依据 8 · 源码核查**：[dsh/index.js:900-951](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L900-L951)

管理路由的 GET/POST、上限及写入点。

<details>
<summary>查看原文（52行）</summary>

```text
function registerConfigRoute(ctx) {
  const route = {
    name: 'modsearch-config',
    kind: 'exact',
    path: '/modsearch/config',
    handler: async (req, res) => {
      const send = (status, body) => {
        res.writeHead(status, { 'content-type': 'application/json' });
        res.end(JSON.stringify(body));
      };
      if (req.method === 'GET') {
        try {
          const summary = engineSummary();
          if (new URL(req.url, 'http://localhost').searchParams.has('doctor')) {
            // null when the probe failed: the card then shows no readiness
            // section rather than inventing one.
            summary.readiness = await engineReadiness();
          }
          send(200, summary);
        } catch (error) {
          send(409, { error: String(error?.message ?? error) });
        }
        return;
      }
      if (req.method !== 'POST') {
        res.writeHead(405).end();
        return;
      }
      try {
        const chunks = [];
        let total = 0;
        for await (const chunk of req) {
          total += chunk.length;
          if (total > 64 * 1024) {
            send(413, { error: 'config payload too large' });
            req.destroy();
            return;
          }
          chunks.push(chunk);
        }
        applyCardSettings(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        // The cached verdict was about the file this save just rewrote. Serving
        // it for another minute would tell the card an engine is still unset
        // right after the key that sets it was stored.
        readinessCache = null;
        send(200, engineSummary());
      } catch (error) {
        send(400, { error: String(error?.message ?? error) });
      }
    },
  };
  ctx.effect(() => ctx.webServer.register(route), 'modsearch: settings route');
```

</details>

#### 缺口

- 实际宿主和反代的鉴权及代理 DNS 行为未验证。
  **影响**：部署层能否保护设置路由、是否允许敏感数据外发仍未知。
  **进一步探讨**：先以无敏感配置核对匿名请求和代理出口，再用隔离目标验证重定向和云拒绝。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证统一脱敏路由摘要能减少误判？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

可以比较一个只呈现必要字段的摘要，列出请求语料、实际语料、实际引擎和是否回退。它应从调度器生成的事实取值，沿用 X 已有状态，避免把错误正文、查询、凭据和代理地址加入用户输出。对照现有 DSH 网页和 X 投影，与模拟的统一摘要分别完成同一组任务。样本包括代理可达但提供方拒绝、密钥回退、X 改由网页回答，以及同时请求两个语料但 X 不可用。逐次对比用户能否指出实际语料和回退，核对真实来源链接，并记录每份合格结果的额外请求、输出 token、排障时间。若错误识别没有减少，或字段使凭据、查询或代理信息被披露，应回到现有最小输出。当前既没有这层统一输出，也没有真实成本对照。

#### 证据与依据

**依据 1 · 源码核查**：[src/search.ts:365-380](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/search.ts#L365-L380)

已有结构化尝试记录及脱敏入口。

<details>
<summary>查看原文（16行）</summary>

```text
      } catch (error) {
        // Engines redact their own errors, but attempts and warnings travel into
        // output and model contexts, so the record gets the belt too.
        const message = redactSecrets(
          error instanceof Error ? error.message : String(error),
          apiKeys,
        );
        const keyLabel = apiKeys.length > 1 ? ` (API key ${Number(keyRun.keyIndex) + 1})` : '';
        failures.push(`${engine.name}${keyLabel}: ${message}`);
        attempts.push({
          engine: engine.name,
          ...(apiKeys.length > 1 ? { keyIndex: keyRun.keyIndex } : {}),
          ok: false,
          error: message,
          durationSeconds: (Date.now() - startedAt) / 1000,
        });
```

</details>

**依据 2 · 源码核查**：[src/search.ts:417-447](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/src/search.ts#L417-L447)

已有实际语料和回退的运行事实。

<details>
<summary>查看原文（31行）</summary>

```text
    // Routing and runtime warnings, kept apart from the engine's epistemic
    // uncertainty. Config typos and degrade caveats travel on the plan.
    const warnings = [...plan.notes, ...cooldownNotes, ...(controller?.warnings ?? [])];
    if (failures.length > 0) {
      const rotatedWithinEngine =
        failuresBeforeEngine === 0 &&
        failures.length > failuresBeforeEngine &&
        successfulKeyIndex !== undefined;
      warnings.push(
        rotatedWithinEngine && successfulKeyIndex !== undefined
          ? `Rotated to ${engine.name} API key ${successfulKeyIndex + 1} after: ${failures.join(' | ')}`
          : `Fell back to ${engine.name} after: ${failures.join(' | ')}`,
      );
      // A web engine answering an X request is second-hand evidence whether the
      // X engine was missing or died mid-run.
      if (plan.degradeNote && !engine.roles.includes('social')) {
        warnings.push(plan.degradeNote);
      }
    }

    // The corpus this answer really came from. An X plan served by a web engine
    // (Grok missing or dead) is second-hand web data: label it `web` with
    // `status: "degraded"` so nobody reads it as X coverage. A social engine
    // answering an X plan is the real thing.
    const requestedSource = plan.source;
    let actualSource: Source = plan.source;
    let status: SourceStatus = 'ok';
    if (plan.source === 'x' && !engine.roles.includes('social')) {
      actualSource = 'web';
      status = 'degraded';
    }
```

</details>

**依据 3 · 源码核查**：[dsh/index.js:161-172](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L161-L172)

网页投影作为对照。

<details>
<summary>查看原文（12行）</summary>

```text
      const entry = await runCli(args, signal);
      const lines = [entry.summary];
      const uncertainty = Array.isArray(entry.uncertainty) ? entry.uncertainty : [];
      if (uncertainty.length > 0) {
        lines.push(`Uncertain: ${uncertainty.join('; ')}`);
      }
      return {
        content: lines.filter(Boolean).join('\n'),
        sources: toSources(entry.items),
        // The CLI already enforces --max-results; the seam re-caps regardless.
        truncated: false,
      };
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:232-241](https://github.com/liustack/modsearch/blob/1ebc893da64208288d7882b125c50108b1270dea/dsh/index.js#L232-L241)

X 已保留的状态与来源。

<details>
<summary>查看原文（10行）</summary>

```text
      const entry = await runCli(cliArgs, exec.signal);
      // The canonical value is the evidence plus its provenance; routing
      // details (attempts, durations, engine spend) stay operational.
      return {
        status: entry.status,
        source: entry.source,
        summary: entry.summary,
        items: Array.isArray(entry.items) ? entry.items : [],
        uncertainty: Array.isArray(entry.uncertainty) ? entry.uncertainty : [],
      };
```

</details>

#### 缺口

- 缺少已有输出的来源误判率和额外字段的代价。
  **影响**：不能判断统一摘要是否提高合格检索数。
  **进一步探讨**：用相同伪引擎、样本和验收规则比较两种显示，并单列泄漏测试。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
