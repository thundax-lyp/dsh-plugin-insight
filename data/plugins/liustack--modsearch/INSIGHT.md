# ModSearch

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[d5582ce](https://github.com/liustack/modsearch/tree/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c)

<!-- BEGIN META -->
[![GitHub ★ 898](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=898&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liustack/modsearch) [![npm 30d 47,908](https://img.shields.io/static/v1?label=npm+30d&message=47%2C908&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch)
<!-- END META -->

> **功能**：为 DSH 提供多引擎网页搜索、X 搜索和页面读取。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示多引擎搜索接入 DSH，同时提供 X 与页面读取；没有独立对照证明更强。

> **主要限制**：[Q03](#research-q03) 与 [Q04](#research-q04) 显示不同 DSH 输出保留的路由信息不同，代理和云路径存在限制，不能将私网防护当作全面隔离。

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
  - [Q01 · 谁需要多引擎搜索，相对宿主原生 web 和单服务商有什么增量？](#detail-section-11)
  - [Q02 · DSH 搜索和页面请求如何走到引擎并返回？](#detail-section-12)
  - [Q03 · 故障转移、额度和 X 降级如何表达？](#detail-section-13)
  - [Q04 · 页面抓取的内网、代理和云披露边界是什么？](#detail-section-14)
  - [Q05 · 安装和使用成本是什么，何时停止？](#detail-section-15)
  - [Q06 · 能否用统一的脱敏路由摘要补足宿主侧丢失的故障转移上下文？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在 DSH 对话中检索外部信息并核查页面的用户。

宿主原生 web 搜索及单一服务商已能检索；多引擎与降级标记提供额外路由选择，收益未量化。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| web 搜索 | 经多引擎提供结果 | 宿主返回不含完整尝试轨迹 |
| X 搜索 | 查询社交内容 | 后备 web 结果标为 degraded |
| 页面读取 | 返回内容、不确定性和警告 | 代理和云路径有不同网络边界 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=22.13 和 dist | 是 | 启动包内 CLI | 无法执行 |
| 兼容 DSH web 与 tools | DSH 接入必需 | 注册 provider 和工具 | 功能不可用或部分跳过 |
| 搜索服务与网络 | 搜索需要 | 获取外部结果 | 尝试后备或失败 |
| 账号或密钥 | 视引擎而定 | 使用相应提供方 | 相关引擎不可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户检查宿主、凭据和数据外发许可 | 可以恢复既有入口 |
| 检索 | 模型发出查询或 URL | 查看来源与降级状态 |
| 核验 | 用户打开原始来源交叉检查 | 来源不可核验时不依赖结论 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 网络下载及引擎费用未知 | 核对版本与配置 | Node 版本受限 |
| 使用 | 服务配额和网络开销未知 | 复核结果与数据外发 | 免费额度可能变化 |
| 故障恢复 | 重试可能消耗服务配额 | 检查路由与冷却 | 宿主输出不含完整尝试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多引擎 | 代码支持候选与后备 | 真实成功率 |
| X 降级 | 代码标记 degraded | 实际数据完整性 |
| 页面保护 | 直连逐跳检查与地址固定 | 代理和云服务全面安全性 |

> **思考**：[Q03](#research-q03) 与 [Q04](#research-q04) 显示不同 DSH 输出保留的路由信息不同，代理和云路径存在限制，不能将私网防护当作全面隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示多引擎搜索接入 DSH，同时提供 X 与页面读取；没有独立对照证明更强。

[Q02](#research-q02) 通过子进程接入宿主，[Q03](#research-q03) 控制期限与故障链；信息在不同投影中有所裁剪，行为尚未经宿主验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 与 [Q04](#research-q04) 显示不同 DSH 输出保留的路由信息不同，代理和云路径存在限制，不能将私网防护当作全面隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议在可信配置和隔离凭据下小范围试用，逐项核对来源；数据不能外发或降级不适合时回退。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码机制已按固定版本检查；外部服务、宿主执行、搜索质量及收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh/index.js、src/router.ts、src/search.ts、src/providers/http/network.ts、src/providers/httpFetch.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交的 DSH 接入、路由、搜索、网络和依赖；未运行目标项目或外部网络，未逐项审计所有引擎。
- 下一步：隔离宿主用固定伪引擎对照现有投影与 [Q06](#research-q06) 的统一脱敏摘要，测量来源和回退识别、敏感信息泄露及开销；另检查本地、代理和云抓取边界。

**分析版本**

- **仓库**：[liustack/modsearch](https://github.com/liustack/modsearch)
- **版本号**：5.10.11（[固定提交 d5582ce](https://github.com/liustack/modsearch/tree/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设在 web 和 X 输出增加由实际尝试记录生成的统一脱敏路由摘要，可降低回退来源误识别；X 现有 source/status 不是新增，效果和宿主兼容尚未验证。

隔离宿主用固定伪引擎对照现有投影与 [Q06](#research-q06) 的统一脱敏摘要，测量来源和回退识别、敏感信息泄露及开销；另检查本地、代理和云抓取边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 4164 | — | — | 53899 |
| .js | source | 4 | 2231 | 1666 | 476 | — |
| .mjs | source | 11 | 670 | 540 | 95 | — |
| .mjs | test | 3 | 104 | 87 | 3 | — |
| .ts | test | 27 | 8817 | 7566 | 733 | — |
| .ts | source | 30 | 6582 | 4926 | 1125 | — |
| .ts | example | 1 | 50 | 39 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/liustack/modsearch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=12&color=737b86&logo=github)](https://github.com/liustack/modsearch/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/liustack/modsearch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 搜索接入、多引擎故障与页面获取边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要多引擎搜索，相对宿主原生 web 和单服务商有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在 DSH 对话中查询外部网页、X 和读取页面的人是目标用户。原生 web 工具和单服务商搜索已能完成部分检索；本组件将多个后端接入同一个 DSH 搜索接口并增加 X 与页面读取，便于失效时换路。README.md:7-9 是作者关于免费与强度的主张，并非独立比较，准确率、成功率、隐私影响和用户需求频率未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-9](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/README.md#L7-L9)

作者描述搜索、X 与页面获取。

```text
<p align="center"><b>In the chat app your model can search the web. On the API it cannot. ModSearch puts the web back: web search, X search, page fetch. Free, no signup, no API key.</b></p>

<p align="center">🥇 <b>The strongest free web search plugin for DeepSeek Harness (dsh)</b> 🥇</p>
```

**依据 2 · 源码核查**：[dsh/index.js:62-75](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/dsh/index.js#L62-L75)

注册搜索提供者及两个工具。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.searchProvider !== false) {
    registerSearchProvider(ctx, config);
  }
  // Registered as raw JSON-Schema tool definitions (no dsh package imports:
  // the developer-preview registry accepts these and out-of-tree resolution
  // of @deepseek-ai/dsh-tools is not yet reliable), so this plugin owns its
  // own argument validation inside execute.
  if (config.xSearch !== false) {
    registerXSearchTool(ctx);
  }
  if (config.readPage !== false) {
    registerReadPageTool(ctx);
  }
```

</details>

#### 缺口

- 没有固定版本宿主与外部服务运行验证
  **影响**：无法推断真实成功率、兼容性或检索准确率
  **进一步探讨**：隔离凭据，用可控引擎和宿主验证并对照来源

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 搜索和页面请求如何走到引擎并返回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

dsh/index.js:62-75 注册 web provider、x_search 和 read_page；135-169 的 provider 构造查询、运行包内 CLI，并把摘要、不确定性与来源投给宿主。349-365 通过 Node 子进程解析 JSON 并对 unavailable 抛错；960-976 将取消 signal 传给子进程。x_search 的结果投影包含状态、source、items 与 uncertainty，read_page 还返回 warnings；web provider 的结果没有完整 attempts 或引擎使用明细，不能认为所有路由信息均对模型可见。未运行宿主链路。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:135-169](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/dsh/index.js#L135-L169)

web provider 调用 CLI，返回文本与来源。

<details>
<summary>查看原文（35行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:224-241](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/dsh/index.js#L224-L241)

X 工具返回降级状态与来源。

<details>
<summary>查看原文（18行）</summary>

```text
    async execute(args, exec) {
      if (typeof args?.query !== 'string' || args.query.trim() === '') {
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

**依据 3 · 源码核查**：[dsh/index.js:288-303](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/dsh/index.js#L288-L303)

页面工具返回内容与 warnings。

<details>
<summary>查看原文（16行）</summary>

```text
    async execute(args, exec) {
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

**依据 4 · 源码核查**：[dsh/index.js:349-365](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/dsh/index.js#L349-L365)

运行包内 CLI 并解析结果。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:960-976](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/dsh/index.js#L960-L976)

子进程使用 signal。

<details>
<summary>查看原文（17行）</summary>

```text
function run(command, args, signal, env) {
  return new Promise((resolve, reject) => {
    const child = spawnHidden(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      signal,
      env,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => resolve({ stdout, stderr, code }));
```

</details>

#### 缺口

- 没有固定版本宿主与外部服务运行验证
  **影响**：无法推断真实成功率、兼容性或检索准确率
  **进一步探讨**：隔离凭据，用可控引擎和宿主验证并对照来源

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 故障转移、额度和 X 降级如何表达？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

src/router.ts:100-104、125-141 明确命令行强制 engine 时不追加其他引擎，普通配置才是软偏好。src/search.ts:305-365 顺序尝试候选和密钥且受总 deadline 限制，365-396 记录脱敏失败，部分持久限制写冷却；437-446 把 X 由普通 web 回答标为 web/degraded。dsh/index.js:224-241 的 X 工具保留此状态但省略 attempts 和 warnings；web provider 也不携带完整尝试轨迹。因此引擎可用性、第三方覆盖和上游返回真实性不能由一次成功推定，实际故障率与额度未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/router.ts:100-104](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/src/router.ts#L100-L104)

强制引擎无后备。

```text
 * An explicit --engine is a hard force: the chain holds exactly that engine,
 * with no preference list appended and no local floor. If it cannot do the job
 * it fails loudly rather than quietly spending another engine's quota. The
 * `engine` in the config file stays a soft preference (still backed by the
 * role defaults and the fetch floor), because a config choice is not a demand.
```

**依据 2 · 源码核查**：[src/search.ts:305-365](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/src/search.ts#L305-L365)

按候选和密钥尝试并受期限限制。

<details>
<summary>查看原文（61行）</summary>

```text
  for (const engine of candidates) {
    const failuresBeforeEngine = failures.length;
    const settings = engineSettings(engine.name, config, env);
    const model = options.model || settings.model || engine.defaultModel;
    const apiKeys = splitApiKeys(settings.apiKey);
    const configuredKeyRuns =
      apiKeys.length > 0
        ? apiKeys.map((apiKey, keyIndex) => ({ apiKey, keyIndex }))
        : [{ apiKey: undefined, keyIndex: undefined }];
    const keyRuns = controller
      ? [
          ...configuredKeyRuns.filter(
            (run) =>
              run.keyIndex === undefined ||
              !coolingEntry(controller.state, engine.name, controller.now, run.keyIndex),
          ),
          ...configuredKeyRuns.filter(
            (run) =>
              run.keyIndex !== undefined &&
              coolingEntry(controller.state, engine.name, controller.now, run.keyIndex),
          ),
        ]
      : configuredKeyRuns;

    let output: EngineOutput | undefined;
    let successfulStartedAt = 0;
    let successfulKeyIndex: number | undefined;
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
        );
        successfulStartedAt = startedAt;
        successfulKeyIndex = keyRun.keyIndex;
        break;
      } catch (error) {
```

</details>

**依据 3 · 源码核查**：[src/search.ts:365-396](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/src/search.ts#L365-L396)

记录失败并有条件冷却。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/search.ts:437-446](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/src/search.ts#L437-L446)

X 降级标为 web 和 degraded。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:224-241](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/dsh/index.js#L224-L241)

X 输出保留状态但没有尝试数组。

<details>
<summary>查看原文（18行）</summary>

```text
    async execute(args, exec) {
      if (typeof args?.query !== 'string' || args.query.trim() === '') {
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

#### 缺口

- 没有固定版本宿主与外部服务运行验证
  **影响**：无法推断真实成功率、兼容性或检索准确率
  **进一步探讨**：隔离凭据，用可控引擎和宿主验证并对照来源

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 页面抓取的内网、代理和云披露边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

src/providers/http/network.ts:43-61 仅允许 HTTP(S) 且拒绝 URL 内凭据，99-150 检查解析地址，默认阻止私网并为直连返回固定地址；httpFetch.ts:150-156、183-205 对每个跳转检查，直连固定 socket，而系统代理自行解析 DNS、不固定。network.ts:200-228 的云披露检查在 DNS 查不到时不阻止云引擎，并非私有目标永不外传的证明；允许私网选项也改变本地抓取边界。源码可见防护设计，代理、DNS 重绑定、云服务及 adversarial 目标未实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/providers/http/network.ts:43-61](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/src/providers/http/network.ts#L43-L61)

限制协议与嵌入凭据。

<details>
<summary>查看原文（19行）</summary>

```text
export function normalizeFetchUrl(input: string): URL {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Fetch URL is required.');
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`Invalid URL: ${trimmed}`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http/https URLs are supported.');
  }

  if (parsed.username || parsed.password) {
    throw new Error('URL with embedded credentials is not allowed.');
```

</details>

**依据 2 · 源码核查**：[src/providers/http/network.ts:99-150](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/src/providers/http/network.ts#L99-L150)

DNS 检查及地址固定。

<details>
<summary>查看原文（52行）</summary>

```text
export async function assertSafeRemoteTarget(
  url: URL,
  allowPrivateNetwork: boolean,
  signal?: AbortSignal,
): Promise<PinnedTarget> {
  if (isBlockedHostname(url.hostname)) {
    throw new Error(`Blocked hostname: ${url.hostname}`);
  }

  const hostname = stripIpv6Brackets(url.hostname);

  // A literal IP is its own validated target: pin straight to it.
  const ipFamily = isIP(hostname);
  if (ipFamily > 0) {
    if (!allowPrivateNetwork && isPrivateIpAddress(hostname)) {
      if (isLoopbackIpAddress(hostname)) {
        throw new Error(privateNetworkBlockMessage(hostname));
      }
      throw new Error(`Blocked private network target: ${hostname}`);
    }
    return { hostname, address: hostname, family: ipFamily };
  }

  let resolved: Array<{ address: string; family: number }>;
  try {
    resolved = await lookupAll(hostname, signal);
  } catch (error) {
    if (signal?.aborted) {
      throw signal.reason;
    }
    throw new Error(
      `DNS lookup failed for host ${hostname}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (resolved.length === 0) {
    throw new Error(`Host ${hostname} did not resolve to any IP address.`);
  }

  if (!allowPrivateNetwork) {
    const blocked = resolved.find(
      (record) => !isFakeIpPoolAddress(record.address) && isPrivateIpAddress(record.address),
    );
    if (blocked) {
      throw new Error(privateNetworkBlockMessage(hostname, blocked.address));
    }
  }

  // Return the first validated address. The direct path pins the socket here
  // so a later DNS change cannot swap in one the check never saw.
  const [chosen] = resolved;
  return { hostname, address: chosen.address, family: chosen.family };
```

</details>

**依据 3 · 源码核查**：[src/providers/httpFetch.ts:183-205](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/src/providers/httpFetch.ts#L183-L205)

每跳检查与代理不固定 DNS。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/providers/http/network.ts:200-228](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/src/providers/http/network.ts#L200-L228)

云披露检查及 DNS 不可知时行为。

<details>
<summary>查看原文（29行）</summary>

```text
export async function inspectCloudDisclosureTarget(
  url: URL,
  signal?: AbortSignal,
): Promise<CloudDisclosureInspection> {
  if (isBlockedHostname(url.hostname)) {
    return { reserved: true, addresses: [] };
  }

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

#### 缺口

- 没有固定版本宿主与外部服务运行验证
  **影响**：无法推断真实成功率、兼容性或检索准确率
  **进一步探讨**：隔离凭据，用可控引擎和宿主验证并对照来源

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装和使用成本是什么，何时停止？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

package.json:55-56 要求 Node >=22.13，包内 dist 是 DSH 桥接所需；dsh/index.js:340-344 指明源码安装缺构建时应改用包名安装。网络服务商的可用性、账号、配额及代理依配置和时间变化，默认免费主张不保证长期免费或覆盖。应用场景要求用户审查查询及 URL 是否可交第三方，先隔离测试并核验来源；若降级不适合、隐私不允许或依赖不可用则停止并使用既有宿主或可信检索。成本、收益及兼容性未实测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:55-56](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/package.json#L55-L56)

Node 版本约束。

```text
  "engines": {
    "node": ">=22.13"
```

**依据 2 · 源码核查**：[dsh/index.js:340-344](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/dsh/index.js#L340-L344)

缺构建的失败提示。

```text
    throw new Error(
      `modsearch's CLI build is missing (${cli}). This happens when the plugin was ` +
        'installed from its GitHub repository, which ships source only. Remove the ' +
        'plugin and add it again by package name: @liustack/modsearch',
    );
```

**依据 3 · 作者声明**：[README.md:7-9](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/README.md#L7-L9)

作者描述无密钥和多服务商。

```text
<p align="center"><b>In the chat app your model can search the web. On the API it cannot. ModSearch puts the web back: web search, X search, page fetch. Free, no signup, no API key.</b></p>

<p align="center">🥇 <b>The strongest free web search plugin for DeepSeek Harness (dsh)</b> 🥇</p>
```

#### 缺口

- 没有固定版本宿主与外部服务运行验证
  **影响**：无法推断真实成功率、兼容性或检索准确率
  **进一步探讨**：隔离凭据，用可控引擎和宿主验证并对照来源

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否用统一的脱敏路由摘要补足宿主侧丢失的故障转移上下文？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现状与反证：src/search.ts:472-480 的 CLI 结果已有 requestedSource、实际 source、status、warnings 和 attempts；dsh/index.js:144-169 的 web provider 只投影摘要、不确定性和来源，未传完整 attempts。X 工具 dsh/index.js:224-241 已暴露 source 和 degraded，因此“增加降级标签”对 X 并非新增，且不能据此推断 web 路径对模型可见同样的路由上下文。

未验证方案：由路由器从已验证的尝试记录生成统一、可选的脱敏路由摘要：请求源、实际源、状态、是否发生回退、尝试次数以及超时／额度／其他的粗粒度原因；禁止原始错误、密钥、查询和 URL。X 路径保留现有 source/status，并补充同一摘要；web seam 若无结构化扩展位，则通过明确标记的短文本附到 content，而不是假定宿主支持新字段。失败原因只能由实际记录映射，无法判定时标 unknown，不能声称来源可信或结果准确。

验证与否定：在隔离宿主以同一固定伪引擎和相同输入，对照现行投影、统一摘要两组，覆盖首选成功、超时后回退、额度后回退、X 到 web 降级、全部失败、取消及伪造错误中的敏感信息。以真实尝试日志为裁判，比较模型与用户能否识别回退及来源，检查 X 既有字段无回归、失败/取消行为不变；记录错误识别率、泄露次数、响应体大小和耗时。若相对现状不能减少回退误识别，或任何敏感数据泄露、来源/状态不符、X 现有标记回归、宿主不接受额外文本，或经测量的成本超过收益，就否定该方案或退回现状。以上均为假设与验收条件，未实现或运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/search.ts:437-446](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/src/search.ts#L437-L446)

降级标签的判定。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:224-241](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/dsh/index.js#L224-L241)

X 工具暴露状态。

<details>
<summary>查看原文（18行）</summary>

```text
    async execute(args, exec) {
      if (typeof args?.query !== 'string' || args.query.trim() === '') {
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

**依据 3 · 源码核查**：[dsh/index.js:144-169](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/dsh/index.js#L144-L169)

web 适配输出边界。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/search.ts:460-480](https://github.com/liustack/modsearch/blob/d5582ce9f2e0af09eeb85f0eb3d46eb93b5caa2c/src/search.ts#L460-L480)

CLI 结果由路由器写入来源、状态、警告和尝试记录。

<details>
<summary>查看原文（21行）</summary>

```text
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

    return {
      ...body,
      source: actualSource,
      requestedSource,
      engine: engine.name,
      model,
      status,
      warnings: [...warnings, ...engineWarnings],
      attempts,
```

</details>

#### 缺口

- 统一路由摘要及宿主呈现均未实现或测试
  **影响**：无法确定其是否改善识别、兼容宿主或控制泄露和额外成本
  **进一步探讨**：隔离宿主以相同伪引擎记录运行现状和原型，比较可观察性、泄露与响应成本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
