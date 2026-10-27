# ModSearch

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[df0cf76](https://github.com/liustack/modsearch/tree/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a)

<!-- BEGIN META -->
[![GitHub ★ 845](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=845&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liustack/modsearch) [![npm 30d 43,251](https://img.shields.io/static/v1?label=npm+30d&message=43%2C251&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch)
<!-- END META -->

> **功能**：为 DSH 和其他编码 Agent 提供多引擎网页搜索、X 搜索和页面读取。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)支持的贡献是复用DSH原生搜索接口，把异质引擎回退、预算和来源不确定性组织起来；不是首次提供DSH搜索，也不证明“最强免费”。

> **主要限制**：[Q03](#research-q03) 显示回退可能改变语料和URL披露位置，X转Web与云抽取并非同等证据，外部CLI提示也不是执行沙箱。可用性提升不能以静默扩大数据流或把降级当原请求完成为代价。

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
  - [Q01 · 为什么在DSH采用多引擎搜索？](#detail-section-11)
  - [Q02 · provider如何进入固定CLI和限时回退？](#detail-section-12)
  - [Q03 · 回退是否保持语料和隐私边界？](#detail-section-13)
  - [Q04 · 谁可以怎样试用而不把免费当无代价？](#detail-section-14)
  - [Q05 · 在发送前约束可用语料和披露范围是否更有价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要公开资料检索且愿意核查来源的DSH用户，可先用无敏感信息的小查询集比较原provider。

DSH已有原生web_search和可插拔provider；手工浏览可直接核查来源。ModSearch的增量按异质引擎预算/回退评估，不把网页摘要视为原始证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 原生搜索provider | 保留DSH web_search接口并回退引擎 | 外部渠道可用，available非服务保证 |
| X搜索 | 访问特定语料 | Grok缺失可降级公开Web |
| 单页读取 | 抽取网页供核查 | 默认云抓取可能披露URL，非原始HTML |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node及同包dist | 是 | 固定CLI | 无法执行 |
| DSH tools/web服务 | DSH必需 | 原生搜索provider | seam缺失会日志降级 |
| 可达引擎 | 是 | 搜索/抓取 | 回退或明确unavailable |
| 密钥/外部CLI登录 | 按引擎 | 额度及X来源 | 降级或失败 |
| URL披露许可 | 云抓取必需 | 第三方取页 | 无法确认则停止 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包并核查路由/披露 | 不发送敏感查询 |
| 小试 | 公开问题搜索及读页 | 来源、语料和warning清楚 |
| 比较 | 对照已有provider | 不因渠道多就认定更好 |
| 退出 | 固定批准引擎或恢复原渠道 | 不明云披露即停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包与所选CLI/服务资源未知 | 配置与披露范围核对 | 默认无key不等于无数据流 |
| 持续 | 多引擎额度/API费用未知 | 来源核查、密钥/登录维护 | 语料降级须识别 |
| 失败 | 多次尝试可能消耗配额 | 查看attempt、固定引擎或回退 | 整轮deadline限制等待 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可用性 | 限时回退和attempt记录 | 真实故障恢复率 |
| 可追溯 | 来源与语料降级表达 | 模型最终答案是否保留警告 |
| 检索收益 | 多渠道接线 | 准确率、节时和总费用 |

> **思考**：[Q03](#research-q03) 显示回退可能改变语料和URL披露位置，X转Web与云抽取并非同等证据，外部CLI提示也不是执行沙箱。可用性提升不能以静默扩大数据流或把降级当原请求完成为代价。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)支持的贡献是复用DSH原生搜索接口，把异质引擎回退、预算和来源不确定性组织起来；不是首次提供DSH搜索，也不证明“最强免费”。

[Q02](#research-q02)把显式强制与软偏好分开，失败不静默转花其他配额，deadline按剩余预算分配值得借鉴；[Q03](#research-q03)说明移植需保留语料与披露边界，适配层输出字符串累加也需单独评估内存，不能以时限代替资源限制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示回退可能改变语料和URL披露位置，X转Web与云抽取并非同等证据，外部CLI提示也不是执行沙箱。可用性提升不能以静默扩大数据流或把降级当原请求完成为代价。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用公开小查询比较已有provider，逐条检查来源和uncertainty，不发送内部URL及秘密查询。隐私范围不明先停止自动fetch；反复降级、来源不明或配额不可控时回到手工浏览或原provider。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持原生provider接线、回退预算及降级表达；未执行搜索或核实外部当前额度。路由前披露约束仅为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh/index.js、src/router.ts、src/search.ts、src/providers/firecrawl.ts、docs/security.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定DSH入口、router、search预算与Firecrawl披露片段，结合安全文档；未执行第三方代码、搜索或目标测试，不认证全网络防护。
- 下一步：固定公开查询与URL，记录来源合格率、语料降级、每次attempt及人工核查时间；路由约束假设先排除现配置已覆盖，不在本轮执行。

**分析版本**

- **仓库**：[liustack/modsearch](https://github.com/liustack/modsearch)
- **版本号**：5.10.10（[固定提交 df0cf76](https://github.com/liustack/modsearch/tree/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出按调用方语料/披露条件在规划前拒绝不合规回退的未验证方案，先排除配置已有等价功能，再比较错语料和披露错误；没有改善则停止。

固定公开查询与URL，记录来源合格率、语料降级、每次attempt及人工核查时间；路由约束假设先排除现配置已覆盖，不在本轮执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 4114 | — | — | 52325 |
| .js | source | 4 | 2217 | 1654 | 474 | — |
| .mjs | source | 11 | 670 | 540 | 95 | — |
| .mjs | test | 3 | 104 | 87 | 3 | — |
| .ts | test | 26 | 8591 | 7359 | 721 | — |
| .ts | source | 29 | 6444 | 4816 | 1110 | — |
| .ts | example | 1 | 50 | 39 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/liustack/modsearch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=13&color=737b86&logo=github)](https://github.com/liustack/modsearch/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/liustack/modsearch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多引擎搜索与页面读取怎样接入DSH，自动回退是否保留来源、预算和披露边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么在DSH采用多引擎搜索？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向模型API没有原生联网或用户不满意现有搜索渠道的检索任务，合格结果是可追溯来源、明确语料范围和能继续核查的页面内容。DSH已有ctx.web及web_search，项目选择替换provider而不是再造同名工具，保留原生schema与引用卡；X与focused read另注册工具。相对单一搜索API，增量是预算内多引擎回退与显式降级，而不是首次给所有DSH模型联网。作者“最强免费”及演示耗时均未由本轮验证；已有原生搜索满足需求时无需为引擎数量迁移。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:1-16](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/dsh/index.js#L1-L16)

明确已有原生web seam，provider和独立工具的职责。

<details>
<summary>查看原文（16行）</summary>

```text
// DeepSeek Harness (dsh) plugin: routes the harness's web capability through
// the modsearch CLI that ships in this very package. dsh already owns a web
// seam (`ctx.web`) with a native `web_search` tool over pluggable providers,
// so search plugs in as a provider instead of a competing tool: the model
// keeps the stable `web_search` schema and the UI keeps its citation cards,
// while the backend becomes modsearch's keyless engine chain. The two corpora
// dsh has no seam for, X and focused page reading, are registered as tools of
// their own; like modlens's `read_image`, a registered tool schema reaches
// the model on every request, so there is no trigger gamble. The engine is
// spawned from ../dist/main.js inside this package: no PATH lookup, no npx,
// the plugin and its engine version-lock together.
//
// Loaded via the cordis.patch.yml rows (see the package.json `dsh.bundle`
// manifest): one row mounts this plugin, one repoints the `web` seam's
// `searchProvider` at it. Engines, keys, and routing keep living in
// ~/.modsearch/config.json, shared with every harness.
```

</details>

**依据 2 · 作者声明**：[README.md:37-44](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/README.md#L37-L44)

作者功能主张及免费措辞，非本轮效果验证。

```text
## Features

- **🥇 The strongest free web search plugin for DeepSeek Harness (dsh):** one command installs it, `npx -y @deepseek-ai/dsh plugin --profile web add @liustack/modsearch@5.10.10`. In the desktop app's Add plugin dialog, enter `@liustack/modsearch`, not the GitHub URL. Details in [harness setup](docs/harness-setup.md#deepseek-harness-dsh).
- **Free out of the box, no signup.** Search and page fetch run on Firecrawl Keyless by default: [1,000 free credits/month](https://www.firecrawl.dev/blog/firecrawl-keyless-launch), no account, no API key, no card. Every fallback channel is free too: Antigravity CLI needs only a browser sign-in, and Tavily, Exa, and a free Firecrawl key each add their own monthly quota with no card required.
- **Automatic failover.** When a channel fails or exhausts its quota, the next one takes over.
- **Per-engine key rotation.** Give Tavily, Exa, Firecrawl, or Keenable multiple comma-separated keys. Authentication, rate-limit, and quota failures rotate to the next key before the engine chain falls back.
- **Searches X (Twitter).** With Grok Build installed, ModSearch queries the corpus that web indexes cannot reach.
- **Install once, use everywhere.** Works in Claude Code, Codex, Pi, and OpenCode.
```

#### 缺口

- 同查询集结果质量和原生provider对照未知
  **影响**：不能认定更强或更快
  **进一步探讨**：固定公开查询与来源标准，对照当前provider的可核查答案、失效率和人工核查时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · provider如何进入固定CLI和限时回退？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply在web服务注册modsearch provider，search把query/maxResults及40秒单引擎、55秒整轮预算交给同包dist/main.js。runCli通过当前Node执行固定CLI，解析stdout JSON并拒绝无summary或unavailable；引用项映射给宿主。search按候选引擎与密钥顺序尝试，记录失败、脱敏错误、耗时及已报告的费用；每次预算取剩余deadline，耗尽则记录跳过不再启动。router的显式--engine只选择该引擎，不静默花其他配额；配置engine则是软偏好。依赖同包已构建dist、匹配web/tools服务、网络及所选引擎的账户或登录；“available:true”只表示CLI接线存在，不证明外部引擎可用。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:135-174](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/dsh/index.js#L135-L174)

注册、参数预算、CLI调用与sources映射。

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

**依据 2 · 源码核查**：[dsh/index.js:348-370](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/dsh/index.js#L348-L370)

固定CLI的非零退出/JSON/不可用检查。

<details>
<summary>查看原文（23行）</summary>

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
    const attempts = (Array.isArray(entry.attempts) ? entry.attempts : [])
      .map((attempt) => `${attempt.engine}: ${attempt.error ?? 'skipped'}`)
      .join('; ');
    throw new Error(
      `modsearch could not reach the requested source${attempts ? ` (${attempts})` : ''}. ` +
        'Run `npx @liustack/modsearch doctor` in a terminal to check the engine setup.',
```

</details>

**依据 3 · 源码核查**：[dsh/index.js:958-975](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/dsh/index.js#L958-L975)

真实Node子进程argv及signal，输出收集。

<details>
<summary>查看原文（18行）</summary>

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
  });
```

</details>

**依据 4 · 源码核查**：[src/search.ts:305-340](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/src/search.ts#L305-L340)

逐引擎/密钥与deadline耗尽轨迹。

<details>
<summary>查看原文（36行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/search.ts:365-410](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/src/search.ts#L365-L410)

脱敏、失败记录、条件轮换及费用字段。

<details>
<summary>查看原文（46行）</summary>

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

    const durationSeconds = (Date.now() - successfulStartedAt) / 1000;
    // Surface the engine's own spend (exa dollars, firecrawl credits) on the
    // attempt, when it reported any. The orchestrator otherwise drops it.
    attempts.push({
      engine: engine.name,
      ...(apiKeys.length > 1 ? { keyIndex: successfulKeyIndex } : {}),
      ok: true,
```

</details>

**依据 6 · 源码核查**：[src/search.ts:503-519](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/src/search.ts#L503-L519)

每次尝试不超剩余全程预算。

<details>
<summary>查看原文（17行）</summary>

```text
function attemptBudget(
  timeoutMs: number,
  deadline: RunDeadline | undefined,
): { engineTimeoutMs: number; killAfterMs: number } | null {
  if (!deadline) {
    return { engineTimeoutMs: timeoutMs, killAfterMs: timeoutMs + KILL_GRACE_MS };
  }
  // Whole milliseconds: the start clock may carry fractions, and engines hand
  // this to AbortSignal.timeout, which rejects a fractional delay.
  const remaining = Math.floor(deadline.at - Date.now());
  if (remaining <= 0) {
    return null;
  }
  return {
    engineTimeoutMs: Math.min(timeoutMs, remaining),
    killAfterMs: Math.min(timeoutMs + DEADLINE_KILL_GRACE_MS, remaining),
  };
```

</details>

**依据 7 · 源码核查**：[src/router.ts:125-141](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/src/router.ts#L125-L141)

显式引擎强制，不另花其他引擎配额。

<details>
<summary>查看原文（17行）</summary>

```text
  const explicit = requestedEngine?.trim();
  if (explicit) {
    // Strict: force exactly this engine, no fallbacks. A silent switch to
    // another engine here is what burned other providers' quotas.
    const engine = findEngine(explicit);
    if (!engine) {
      notes.push(
        `Unknown engine "${explicit}" (--engine). Drop -e to let modsearch pick one that works, or name a known engine: ${listEngines().join(', ')}.`,
      );
    } else if (!engine.roles.includes(role)) {
      notes.push(
        `The ${engine.name} engine cannot ${role} (--engine forces it with no fallback). Drop -e to let modsearch pick an engine that can. ${engine.name} handles: ${engine.roles.join(', ')}.`,
      );
    } else {
      add(engine);
    }
    return { chain, notes };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回退是否保持语料和隐私边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

并非所有成功都等价。router把X不可达时由公开Web代答标为降级，不能把二手网页当X内部检索。默认Firecrawl页面抓取会把公开URL发到云端，返回的是云浏览器抽取Markdown而非原始HTML；关闭keylessFetch只限制自动无key抓取，有配置key或显式选择时仍可能使用云。安全文档明确页面内容不可信，提示约束不是防注入保证，agy会以dangerously-skip-permissions执行。另一方面，强制engine不回退和结果warnings是有用的可追溯设计。dsh子进程stdout/stderr累加到字符串，本段没有上限，不能仅凭引擎deadline推断内存也有界。

#### 证据与依据

**依据 1 · 源码核查**：[src/router.ts:46-65](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/src/router.ts#L46-L65)

X语料降级与unavailable明确表达。

<details>
<summary>查看原文（20行）</summary>

```text
/** Note added when the web answers a question that was aimed at X. */
export const X_DEGRADE_NOTE =
  'X itself was not reachable here (Grok Build missing, signed out, or failing), so this came from the public web, which cannot see inside X.';

export interface SourcePlan {
  source: Source;
  /** The engine to try first. Absent on an `unavailable` plan, which runs nothing. */
  engine?: SearchEngine;
  /** Added to the result when a fallback engine, not the first choice, answers. */
  degradeNote?: string;
  /** Engines to try after this one fails, in order. */
  fallbacks: SearchEngine[];
  /** Problems worth telling the user about, e.g. a config typo. */
  notes: string[];
  /**
   * No engine can serve this source. Instead of dropping the slot, emit an
   * explicit empty entry (status "unavailable") so a machine consumer sees the
   * source was asked for and could not be reached.
   */
  unavailable?: boolean;
```

</details>

**依据 2 · 源码核查**：[src/providers/firecrawl.ts:204-226](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/src/providers/firecrawl.ts#L204-L226)

私网目标拒绝及云披露限制。

<details>
<summary>查看原文（23行）</summary>

```text
  // A literal private target never leaves the machine. DNS-only classification
  // is advisory for cloud disclosure: standard 198.18/15 proxy fake IPs count
  // as public placeholders, and one real public answer makes the hostname
  // public. --allow-private-network remains local-only and never bypasses this.
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
```

</details>

**依据 3 · 源码核查**：[src/providers/firecrawl.ts:280-283](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/src/providers/firecrawl.ts#L280-L283)

云端抽取结果警告。

```text
  }

  const warnings = [
    'Fetched through Firecrawl in the cloud, which runs JavaScript. The content is Firecrawl markdown extraction, not the raw page as served.',
```

**依据 4 · 作者声明**：[docs/security.md:57-73](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/docs/security.md#L57-L73)

默认云抓取、配置限制、网页不可信和外部CLI权限边界。

<details>
<summary>查看原文（17行）</summary>

```text
Firecrawl public-page fetch is a cloud boundary: the URL of a public page is sent to Firecrawl's service, which reads it with a cloud browser. This is on by default (it is what makes a bare install fetch JavaScript pages), and every cloud-fetched result carries a warning naming the route. To keep automatic page fetch local-only, run `modsearch config set firecrawl.keylessFetch false`. A configured Firecrawl key or an explicit Firecrawl engine choice still enables it. Literal private and reserved targets never go to the cloud in any configuration. DNS-derived addresses follow the narrower disclosure rule below.

Proxy fake-IP mode in Clash, Clash Verge Rev, mihomo, and Surge works out of the box. Both the local guard and Firecrawl's cloud-disclosure check treat DNS answers in `198.18.0.0/15` as proxy fake-IP placeholders, so no `allowPrivateNetwork` switch is needed. The local socket stays pinned to the checked fake IP, and the Host header and TLS SNI keep the hostname. This exemption applies only to DNS answers. A literal URL such as `http://198.18.0.5/` stays blocked when `allowPrivateNetwork` is off and never goes to Firecrawl.

Split-tunnel VPNs that map public hostnames into other reserved ranges, and hosts-file accelerators such as Watt Toolkit / Steam++ that map them to loopback, still need `--allow-private-network` or the top-level `modsearch config set allowPrivateNetwork true`. This switch opens those addresses for the local fetcher only. When it is on, the local fetcher also trusts the OS certificate store, so it can accept a certificate issued by a local forwarding proxy's installed CA. It does not authorize cloud disclosure. Do not use it to reach genuinely internal addresses.

Firecrawl withholds a hostname only when every resolved address is private or reserved after the fake-IP exemption. Any public or fake-IP answer allows the public URL to be sent to Firecrawl. The local guard still blocks a hostname if any other DNS answer is private or reserved, even alongside a fake-IP or public answer.

## Untrusted page content

Fetched pages and search results are untrusted input. Prompts instruct the engine to treat page content strictly as data and never to follow instructions found inside it, but that is mitigation, not a guarantee. Run in a sandboxed working directory when the URLs are not yours.

ModSearch invokes `agy` with `--dangerously-skip-permissions` because prompt mode fails in some environments without it. The prompt restricts the agent to searching and fetching.

## Evidence, not invention

What an engine cannot verify goes into `uncertainty` rather than being filled in. The numeric `relevance` score from v1 looked precise and was fabricated, so v2 dropped it: ordering already carries relevance.
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:958-975](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/dsh/index.js#L958-L975)

适配层输出累加无本段字节上限。

<details>
<summary>查看原文（18行）</summary>

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
  });
```

</details>

#### 缺口

- 完整DNS/代理/重定向防护及外部CLI隔离未审计
  **影响**：不能将文档保护当任意URL安全保证
  **进一步探讨**：按固定network实现继续核查DNS重绑定、代理、私网与CLI运行账户，再做非敏感URL定向验证

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁可以怎样试用而不把免费当无代价？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议需要公开资料搜索的DSH用户先用不含私人项目名和秘密URL的小查询集，核对来源与uncertainty；已有原生provider够用时不必切换。无key配额来自外部服务，可能共享IP或受限，不能把README数字作为本轮确认的当前政策或承诺零费用。首次成本是安装匹配包和理解路由；持续涉及密钥/登录、额度与来源核查；失败会花多个引擎尝试时间及可能配额，虽有deadline也非即时结果。隐私要求高时先限制路由并核查配置，无法确保不披露URL就停止自动fetch，回到手工浏览或已批准搜索渠道。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:68-80](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/README.md#L68-L80)

引擎身份、账户/额度与配置声明。

<details>
<summary>查看原文（13行）</summary>

```text
Firecrawl and Keenable work with zero setup. Every other engine is one command away. Keys live in `~/.modsearch/config.json` (0600, masked when shown):

| Engine | Does | Free tier | Turn it on |
| :-- | :-- | :-- | :-- |
| Firecrawl (default) | web search + page fetch | keyless: 1,000 free credits/month, no signup. A free key adds your own 1,000/month | nothing, it works as installed |
| Keenable | web search | keyless: 1,000 requests/hour per IP (shared by everyone on that IP), no signup. A free key gives 100,000 requests/month of your own | nothing, it works as installed |
| Antigravity CLI | web search + page fetch | free, browser sign-in | install `agy` and sign in |
| Tavily | web search | 1,000 credits/month, no card | `modsearch config set tavily.apiKey <key>` |
| Exa | web search | $10/month recurring credit (~1,400 searches), no card | `modsearch config set exa.apiKey <key>` |
| Grok Build | X (Twitter) search | rides SuperGrok or X Premium | install `grok` and sign in |
| local | page fetch | built in, nothing to install | nothing |

Keys can also come from the environment (`TAVILY_API_KEY`, `EXA_API_KEY`, `FIRECRAWL_API_KEY`, `KEENABLE_API_KEY`). One engine can take multiple keys as a comma-separated value such as `key-one,key-two`, in either the config file or its environment variable. Multiple engines configured means automatic failover, best first. Every engine participates by default. Exclude one with `modsearch config set tavily.enabled false`. Using a Tavily-, Exa-, Firecrawl-, or Keenable-compatible third-party or self-hosted endpoint? Point the engine at it: `modsearch config set tavily.baseURL <url>`. Official endpoints stay built into the code and are never written as default config. Every knob, engine by engine, is in the [configuration guide](skills/modsearch/references/configure.md).
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:42-57](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/dsh/index.js#L42-L57)

provider与独立工具有不同整体预算。

<details>
<summary>查看原文（16行）</summary>

```text
// The CLI's --timeout is per engine, and a failed engine hands over to the
// next with a fresh budget, so each path also passes --deadline: the whole
// run's wall clock. The per-engine share stays well under the deadline so a
// failover engine still gets its turn, and the deadline stays under the
// harness budget so the run always ends in a result or the CLI's descriptive
// error, never the host's bare abort.
//
// Own tools: up to 120s per engine, 180s for the run, plus a cooperative
// backstop past the deadline.
const OWN_TOOL_ENGINE_TIMEOUT_MS = 120_000;
const OWN_TOOL_DEADLINE_MS = 180_000;
const OWN_TOOL_BACKSTOP_MS = OWN_TOOL_DEADLINE_MS + 20_000;
// The provider path runs under tool-web's budget (60s for the shipped search
// route): 40s for one engine leaves a fast fallback room inside a 55s run.
const PROVIDER_TIMEOUT_MS = 40_000;
const PROVIDER_DEADLINE_MS = 55_000;
```

</details>

**依据 3 · 源码核查**：[src/router.ts:125-141](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/src/router.ts#L125-L141)

固定引擎提供可控退路。

<details>
<summary>查看原文（17行）</summary>

```text
  const explicit = requestedEngine?.trim();
  if (explicit) {
    // Strict: force exactly this engine, no fallbacks. A silent switch to
    // another engine here is what burned other providers' quotas.
    const engine = findEngine(explicit);
    if (!engine) {
      notes.push(
        `Unknown engine "${explicit}" (--engine). Drop -e to let modsearch pick one that works, or name a known engine: ${listEngines().join(', ')}.`,
      );
    } else if (!engine.roles.includes(role)) {
      notes.push(
        `The ${engine.name} engine cannot ${role} (--engine forces it with no fallback). Drop -e to let modsearch pick an engine that can. ${engine.name} handles: ${engine.roles.join(', ')}.`,
      );
    } else {
      add(engine);
    }
    return { chain, notes };
```

</details>

#### 缺口

- 实际额度政策、失败账单和单位有效来源耗时未知
  **影响**：不能承诺免费或总成本更低
  **进一步探讨**：固定查询记录每attempt耗时/已返回费用与来源合格率，外部额度单独核实

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 在发送前约束可用语料和披露范围是否更有价值？

**研究主题**：新假设与验证

#### 完整回答

已实现结果warnings和显式强制引擎，由此可提出未验证的路由约束假设：让调用方先声明“只本地抓取”“不允许X转Web”等条件，规划阶段排除不满足引擎，再给明确不可用。不是把warning删掉，也不是泛化为已有隐私模式。先查当前配置能否等价表达需求；若已有便不加层。对公开/内部样例URL和X特定问题比较事后警告与事前约束，记录不期望披露、错语料答案、有效结果数和设置负担；若减少结果却不减少错误或配置更难则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/router.ts:46-65](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/src/router.ts#L46-L65)

当前降级在结果侧表达，可形成事前约束问题。

<details>
<summary>查看原文（20行）</summary>

```text
/** Note added when the web answers a question that was aimed at X. */
export const X_DEGRADE_NOTE =
  'X itself was not reachable here (Grok Build missing, signed out, or failing), so this came from the public web, which cannot see inside X.';

export interface SourcePlan {
  source: Source;
  /** The engine to try first. Absent on an `unavailable` plan, which runs nothing. */
  engine?: SearchEngine;
  /** Added to the result when a fallback engine, not the first choice, answers. */
  degradeNote?: string;
  /** Engines to try after this one fails, in order. */
  fallbacks: SearchEngine[];
  /** Problems worth telling the user about, e.g. a config typo. */
  notes: string[];
  /**
   * No engine can serve this source. Instead of dropping the slot, emit an
   * explicit empty entry (status "unavailable") so a machine consumer sees the
   * source was asked for and could not be reached.
   */
  unavailable?: boolean;
```

</details>

**依据 2 · 源码核查**：[src/router.ts:125-141](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/src/router.ts#L125-L141)

显式强制引擎说明规划阶段可拒绝静默回退。

<details>
<summary>查看原文（17行）</summary>

```text
  const explicit = requestedEngine?.trim();
  if (explicit) {
    // Strict: force exactly this engine, no fallbacks. A silent switch to
    // another engine here is what burned other providers' quotas.
    const engine = findEngine(explicit);
    if (!engine) {
      notes.push(
        `Unknown engine "${explicit}" (--engine). Drop -e to let modsearch pick one that works, or name a known engine: ${listEngines().join(', ')}.`,
      );
    } else if (!engine.roles.includes(role)) {
      notes.push(
        `The ${engine.name} engine cannot ${role} (--engine forces it with no fallback). Drop -e to let modsearch pick an engine that can. ${engine.name} handles: ${engine.roles.join(', ')}.`,
      );
    } else {
      add(engine);
    }
    return { chain, notes };
```

</details>

**依据 3 · 作者声明**：[docs/security.md:57-63](https://github.com/liustack/modsearch/blob/df0cf76aea06d31ca07c06322b0c7ad47b6d3a6a/docs/security.md#L57-L63)

自动云抓取与不同配置组合的披露条件。

```text
Firecrawl public-page fetch is a cloud boundary: the URL of a public page is sent to Firecrawl's service, which reads it with a cloud browser. This is on by default (it is what makes a bare install fetch JavaScript pages), and every cloud-fetched result carries a warning naming the route. To keep automatic page fetch local-only, run `modsearch config set firecrawl.keylessFetch false`. A configured Firecrawl key or an explicit Firecrawl engine choice still enables it. Literal private and reserved targets never go to the cloud in any configuration. DNS-derived addresses follow the narrower disclosure rule below.

Proxy fake-IP mode in Clash, Clash Verge Rev, mihomo, and Surge works out of the box. Both the local guard and Firecrawl's cloud-disclosure check treat DNS answers in `198.18.0.0/15` as proxy fake-IP placeholders, so no `allowPrivateNetwork` switch is needed. The local socket stays pinned to the checked fake IP, and the Host header and TLS SNI keep the hostname. This exemption applies only to DNS answers. A literal URL such as `http://198.18.0.5/` stays blocked when `allowPrivateNetwork` is off and never goes to Firecrawl.

Split-tunnel VPNs that map public hostnames into other reserved ranges, and hosts-file accelerators such as Watt Toolkit / Steam++ that map them to loopback, still need `--allow-private-network` or the top-level `modsearch config set allowPrivateNetwork true`. This switch opens those addresses for the local fetcher only. When it is on, the local fetcher also trusts the OS certificate store, so it can accept a certificate issued by a local forwarding proxy's installed CA. It does not authorize cloud disclosure. Do not use it to reach genuinely internal addresses.

Firecrawl withholds a hostname only when every resolved address is private or reserved after the fake-IP exemption. Any public or fake-IP answer allows the public URL to be sent to Firecrawl. The local guard still blocks a hostname if any other DNS answer is private or reserved, even alongside a fake-IP or public answer.
```

#### 缺口

- 当前配置是否已足够及用户是否误解warning未知
  **影响**：不能宣称新需求成立
  **进一步探讨**：先对照配置能力和真实误用案例，再测试事前约束的收益

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
