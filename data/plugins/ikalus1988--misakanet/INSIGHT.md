# MisakaNet

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b38ef5b](https://github.com/Ikalus1988/MisakaNet/tree/b38ef5bf0304212ec2eb4c0c46d16c42672d551e)

<!-- BEGIN META -->
[![GitHub ★ 549](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=549&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ikalus1988/MisakaNet) [![npm 30d 6,970](https://img.shields.io/static/v1?label=npm+30d&message=6%2C970&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/misakanet) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/misakanet)
<!-- END META -->

> **功能**：为 AI Agent 提供带证据等级的故障经验检索与记录。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把结构化故障经验检索接入 Agent，仍需用户依据当前环境验证。

> **主要限制**：[Q03](#research-q03) 语义回退和 CJK 融合依配置与数据，[Q04](#research-q04) 服务端脱敏发生在请求到达后。

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
  - [Q01 · 开发者为什么检索已有故障经验，与手工搜索有什么差别？](#detail-section-11)
  - [Q02 · 默认 DSH 安装如何接公共 MCP，失败时可用性如何？](#detail-section-12)
  - [Q03 · 搜索如何限流、脱敏、排序和回退？](#detail-section-13)
  - [Q04 · 凭据、故障文本与远端服务的隐私和费用条件是什么？](#detail-section-14)
  - [Q05 · 能否让检索结果附加当前环境验证结果？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者遇到工程错误时希望查找可核验的既有经验。

用户可手工检索日志、文档和公开 issue。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP 接入 | 挂载远端故障经验工具 | 客户端缺失时默认不阻断宿主 |
| 故障检索 | 查找相关 lesson | 排名不证明当前修复有效 |
| 语义与 CJK | 在条件成立时扩展候选 | 依配置和服务可用性 |
| 本地模式 | 使用自选 Python 服务 | 不等于 npm 默认路径 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH MCP 客户端 | 默认宿主接入需要 | 挂载工具 | 默认警告并不挂载 |
| 公共 MCP 与网络 | 默认远端搜索需要 | 查询经验 | 端点不可达则无结果 |
| 本地 Python/语料 | 仅自选本地路径需要 | 本地检索 | 对应模式不可用 |
| 人工环境核验 | 应用建议需要 | 避免错误修复 | 不应直接执行未知命令 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认端点及内容授权 | 不能外发时使用本地资料 |
| 检索 | 输入非敏感故障条件 | 确认 MCP 已连接和结果来源 |
| 核验 | 查看 lesson 与当前版本环境 | 条件不符或证据不足则不套用 |
| 恢复 | 运行用户批准的隔离检查 | 失败时回原始日志与手工调查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 网络和宿主资源未知 | 配置端点及核授权 | 兼容未测 |
| 持续 | 服务及语义调用费用未知 | 检查经验和环境 | 检索准确率未测 |
| 恢复 | 诊断和隔离试验资源未知 | 验证修复及回滚 | 错误套用成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH 接线 | 默认 MCP 挂载及降级 | 远端在线和工具可用 |
| 检索 | 脱敏、回退和 CJK 融合分支 | 排名准确性与修复成功率 |
| 经验溯源 | 作者描述 lesson 等级及反馈 | 当前环境修复已验证 |

> **思考**：[Q03](#research-q03) 语义回退和 CJK 融合依配置与数据，[Q04](#research-q04) 服务端脱敏发生在请求到达后。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把结构化故障经验检索接入 Agent，仍需用户依据当前环境验证。

[Q02](#research-q02) 启动降级保住宿主，[Q03](#research-q03) 区分零命中语义后备及 CJK 融合。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 语义回退和 CJK 融合依配置与数据，[Q04](#research-q04) 服务端脱敏发生在请求到达后。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先以合成故障搜索并阅读完整 lesson，环境不符或不能外发时停止，回本地日志。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本接线与代表 Worker 分支已查；未运行宿主或远端服务。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、cordis.patch.yml、workers/register-proxy-sw.js、misakanet/server/handlers/search.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读 README、package、bundle、MCP wrapper、Worker 搜索和本地 Python fallback 代表路径；未运行代码、服务或宿主，未审计完整语料、脱敏规则及所有反馈路径。
- 下一步：用假服务和固定故障集合验证挂载、限流、CJK 及语义失败，再按 [Q05](#research-q05) 比较错误套用和人工成本。

**分析版本**

- **仓库**：[Ikalus1988/MisakaNet](https://github.com/Ikalus1988/MisakaNet)
- **版本号**：3.2.0（[固定提交 b38ef5b](https://github.com/Ikalus1988/MisakaNet/tree/b38ef5bf0304212ec2eb4c0c46d16c42672d551e)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设本机环境验证收据能减少错误套用；须先核现有功能，尚未验证。

用假服务和固定故障集合验证挂载、限流、CJK 及语义失败，再按 [Q05](#research-q05) 比较错误套用和人工成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1246 | 147674 | — | — | 1239718 |
| .md | example | 7 | 225 | — | — | 576 |
| .js | source | 18 | 15571 | 9698 | 5074 | — |
| .ts | source | 3 | 432 | 310 | 64 | — |
| .mjs | source | 12 | 6912 | 4301 | 2284 | — |
| .js | test | 16 | 1855 | 1359 | 322 | — |
| .cjs | test | 1 | 708 | 495 | 176 | — |
| .mjs | test | 106 | 23046 | 16983 | 4361 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/Ikalus1988/MisakaNet/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查故障经验检索、DSH 接线与远端边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 开发者为什么检索已有故障经验，与手工搜索有什么差别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:98-106 描述 Git 维护的故障经验、证据等级和 BM25 检索；面向反复排查相似工程错误的开发者，基线是搜索日志、文档和 issue。它将历史经验及检索工具接入 Agent，而不是保证相似错误同因或修复在当前环境有效。README:91-96 建议读完整 lesson 并区分证据等级；实际修复率和节时未与人工搜索对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:91-106](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/README.md#L91-L106)

作者描述故障记忆、证据与检索。

<details>
<summary>查看原文（16行）</summary>

```text
**2. Read what came back.** A hit returns the lesson, its `evidence_level`, and its path — open the
file and read the fix before running any command in it. A miss returns `no_match` plus a ready-to-call
intake: the corpus saying it does not know this one yet.

**3. Check the trust signal, not the tone.** `E0`–`E3` say how far a lesson was verified; `E4` is the
one nobody can write or vote into.

## What is MisakaNet?

**Git-backed failure memory for AI coding agents.** An error shows up → the agent searches → it
applies a fix somebody already verified → if nothing matches, the miss becomes an intake, and the
intake becomes a lesson for the next agent.

Every lesson is a Markdown file: reviewed like code, graded by evidence, retrieved with BM25 over the
Python standard library. The hosted MCP endpoint adds an **optional semantic fallback** (bge-m3 +
Vectorize) only when BM25 returns no match; `MISAKANET_SEMANTIC=0` disables it. No vector database is
```

</details>

**依据 2 · 源码核查**：[package.json:1-5](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/package.json#L1-L5)

包说明与默认 MCP 服务。

```text
{
  "name": "misakanet",
  "version": "3.2.0",
  "license": "Apache-2.0",
  "description": "MisakaNet failure-memory skill — evidence-rated failure lessons for AI agents. DSH bundle: registers the MCP tools as mcp__misakanet__* (misakanet_search/get_lesson/…), served by the public Streamable HTTP endpoint https://misakanet.org/mcp — live tools from an npm install, in any profile, with no local python. A profile that prefers the repo's own stdio server can override the bundle row.",
```

#### 缺口

- 未做同环境故障任务对照
  **影响**：不能推断修复成功率或节时
  **进一步探讨**：固定错误及环境比较手工搜索与检索后人工验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 默认 DSH 安装如何接公共 MCP，失败时可用性如何？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

index.js:54-60 默认使用公共 streamable-http MCP、60 秒工具 timeout、failOnStartupError=false；75-109 与 118-134 动态导入宿主 MCP 客户端并挂载，缺失或失败时默认记录警告而不阻断 wrapper。cordis.patch.yml:52-62 实际传入相同地址和设置；本地 Python 是可配置另一路径，不能把其行为说成 npm 默认路径。宿主能启动不等于工具已挂载或远端可达；作者声明兼容范围不代替宿主验收。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:54-60](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/index.js#L54-L60)

默认公共端点与启动条件。

```text
export const DEFAULT_MCP_CONFIG = Object.freeze({
  transport: 'streamable-http',
  serverName: 'misakanet',
  url: 'https://misakanet.org/mcp',
  headers: { Origin: 'https://misakanet.org' },
  toolCallTimeoutMs: 60000,
  failOnStartupError: false,
```

**依据 2 · 源码核查**：[index.js:75-109](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/index.js#L75-L109)

子插件入口和缺失处理。

<details>
<summary>查看原文（35行）</summary>

```text
export async function apply(ctx, config = {}) {
  const options = { ...DEFAULT_MCP_CONFIG, ...config };

  // NOTHING BELOW MAY THROW OUT OF THIS FUNCTION.
  //
  // A throw here is a failed activation, and a failed activation inside a profile
  // bundle can take the whole host down: `dsh: startup failed: N required plugins
  // did not activate` — the entire `dsh web` refuses to start, not just this
  // server. That is a catastrophic outcome for a feature whose worst case should
  // be "the tools are missing": the skill (SKILL.md) and every other plugin in
  // the profile are unrelated to whether MisakaNet's MCP client mounted.
  //
  // So the whole body is guarded and reports through the host logger instead.
  // `failOnStartupError` still works as documented — it asks the *MCP client* to
  // treat a failed initial connection or tool sync as fatal (that is a config
  // field of the client, `dsh-mcp-client/lib/index.js`), and when it is set the
  // client's own fiber fails where the host can attribute it. What it must never
  // do is make *our* wrapper the reason a profile will not boot.
  try {
    if (typeof ctx?.plugin !== 'function') {
      // A host that cannot mount child plugins: the skill still works, so say so and stop. This used to
      // throw unconditionally — before the try — which is exactly the failure mode above. The explicit
      // opt-in still gets its error, because that is what an opt-in is for.
      const message = 'misakanet: cordis context has no plugin(); MCP tools not mounted';
      if (options.failOnStartupError) throw new Error(message);
      ctx?.logger?.warn?.(message);
      return;
    }

    let client;
    try {
      // Dynamic import: the client is ESM and only exists inside a DSH install.
      client = await import('@deepseek-ai/dsh-mcp-client');
    } catch (error) {
      if (options.failOnStartupError) throw error;
```

</details>

**依据 3 · 源码核查**：[index.js:118-134](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/index.js#L118-L134)

导入失败警告与挂载。

<details>
<summary>查看原文（17行）</summary>

```text
      // The other two guarded paths already log; this one was the only silent branch, and it is
      // the branch that runs most often. Measured 2026-10-08 with the client unresolvable:
      // `apply()` returned and `logger.warn` was called 0 times.
      ctx?.logger?.warn?.(
        'misakanet: @deepseek-ai/dsh-mcp-client is not resolvable, so the MCP tools are not '
        + `mounted (the skill still works): ${error?.message ?? error}`,
      );
      return;
    }

    // The Loader normalizes ESM/CJS/default export shapes before applying a plugin.
    const component = ctx?.loader?.unwrapExports ? ctx.loader.unwrapExports(client) : client;
    ctx.plugin(component, options);
  } catch (error) {
    if (options.failOnStartupError) throw error;
    ctx?.logger?.warn?.(`misakanet: MCP client not mounted: ${error?.message ?? error}`);
  }
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:52-62](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/cordis.patch.yml#L52-L62)

bundle 默认配置。

<details>
<summary>查看原文（11行）</summary>

```text
- insert:
    - id: misakanet-mcp
      name: 'misakanet'
      config:
        transport: streamable-http
        serverName: misakanet
        url: https://misakanet.org/mcp
        headers:
          Origin: https://misakanet.org
        toolCallTimeoutMs: 60000
        failOnStartupError: false
```

</details>

**依据 5 · 源码核查**：[package.json:60-73](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/package.json#L60-L73)

可选宿主 peer 和 Node 版本。

<details>
<summary>查看原文（14行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-mcp-client": ">=0.1.0-rc.8 <0.2.0 || >=0.1.5-rc.1 <0.2.0 || >=0.1.7-rc.1 <0.2.0 || >=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/schemastery": ">=3.0.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-mcp-client": {
      "optional": true
    },
    "@deepseek-ai/schemastery": {
      "optional": true
    }
  },
  "engines": {
    "node": ">=20.0.0"
```

</details>

#### 缺口

- 未运行宿主、MCP 连接或本地 Python
  **影响**：无法证明工具挂载、网络和兼容
  **进一步探讨**：隔离宿主验证客户端缺失、端点超时和成功搜索。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 搜索如何限流、脱敏、排序和回退？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Worker 的 4297-4315 先对收到的搜索文本使用 redactIntake，再参与检索和记录；4317-4325 显示匿名读取使用突发窗口，不能凭旧注释推断每日额度。4368-4391 在无命中时可请求语义回退并捕获失败；4394-4422 对含中文等 CJK 查询另有词法与语义融合路径，因此不能笼统说语义仅用于零命中。独立本地 Python handler 包含自己的 fallback 路径，不能把它等同默认远端生产配置。源码只能证明分支，线上索引内容、排名及成功率未知。

#### 证据与依据

**依据 1 · 源码核查**：[workers/register-proxy-sw.js:4297-4325](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/workers/register-proxy-sw.js#L4297-L4325)

服务端查询脱敏与匿名突发窗口。

<details>
<summary>查看原文（29行）</summary>

```text
  if (toolName === "misakanet_search") {
    if (!args.query) return { error: "query is required" };

    // #3692: the query is the one thing that carries the caller's machine into our storage.
    // Today the raw text reached five places — `search_signals.query` (80 chars), `lesson_usage.query`
    // (200 chars), the knowledge-gap KV entry, the gap counter's bucket key, and (through the same
    // path) the analytics panel that publishes failed queries. The trial user's words were exact:
    // "报错片段会作为查询关键词发到该服务器——这意味着内部表名、路径等可能随查询外发".
    //
    // So the query is redacted ONCE, here, before anything reads it. Everything downstream — the
    // scoring, the gap log, the usage rows, the signal row — then works on the redacted text, and
    // there is no second place to forget. The scoring input changes with it, and that is deliberate:
    // a path or an address is not a search term, and the corpus is indexed by error text.
    //
    // The redaction is the same rule set the client hook applies (integrations/agent-autostart/
    // checkpoint_reminder.mjs), so the text that reaches the server is already redacted on the
    // hook's path — this is the half that covers the agent's OWN search call, which the client
    // cannot intercept.
    args = { ...args, query: redactIntake(String(args.query)) };

    // Rate limit: 5 free reads/day per IP for remote HTTP (shared across
    // search + get_lesson). Local stdio MCP is unlimited (user has the code).
    // Authenticated callers (any valid token) are exempt — the token proves
    // they registered, so they get the registered quota instead. Anonymous
    // callers have an empty token here (auth failures never reach this point).
    if (!authToken) {
      const ip = clientIp || "unknown";
      // Burst window, not a daily cap (2026-09-18): reuse the same D1 counter with a minute key, so
      // this needs no new storage and stays atomic across isolates.
```

</details>

**依据 2 · 源码核查**：[workers/register-proxy-sw.js:4368-4391](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/workers/register-proxy-sw.js#L4368-L4391)

语义回退与错误分支。

<details>
<summary>查看原文（24行）</summary>

```text

    // Both matchers project a narrow shape (BM25 from the index, the naive one from
    // the record), so re-attach the loaded records once here: the injection scan
    // below then sees real bodies instead of a title, and the progressive-disclosure
    // formatters get `problem`/`fix`/`tags`/`freshness` instead of empty strings
    // (issue #1675).
    results = enrichSearchHits(results, lessons);


    // Semantic fallback (2026-10-26): BM25's floor returns no_match on paraphrases that name the
    // symptom instead of the error text. Only an empty BM25 result reaches this branch; a hit is
    // never re-ranked, so the lexical path keeps its behavior. Failure is swallowed into the
    // existing no_match answer — the fallback must not turn a working search into an error.
    if ((!results || results.length === 0) && env.MISAKANET_SEMANTIC !== "0") {
      try {
        const semanticHits = await semanticFallbackHits(env, args.query, args.top || 5);
        if (semanticHits.length) {
          results = enrichSearchHits(semanticHits, lessons);
          source = bm25Index ? "worker-bm25+semantic" : "semantic";
          noteSearchBackend(env, "semantic");
        }
      } catch (e) {
        debugLog(env, 1, "semantic fallback failed", { error: String((e && e.message) || e) });
      }
```

</details>

**依据 3 · 源码核查**：[workers/register-proxy-sw.js:4394-4422](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/workers/register-proxy-sw.js#L4394-L4422)

CJK 融合的独立路径。

<details>
<summary>查看原文（29行）</summary>

```text
    // CJK fusion (2026-10-28): the fallback above only fires on an EMPTY result, so a confident-but-
    // wrong lexical hit suppresses the vector path entirely. For queries that carry CJK characters
    // the vector path is fused in instead of gated. Scoped to CJK on purpose: English already clears
    // its floor (measured 15/20 against 16) and this experiment measured no English arm; widening it
    // would spend the whole gain on an unmeasured risk.
    // `MISAKANET_CJK_FUSE=0` disables it without a code revert, the same switch shape as
    // `MISAKANET_SEMANTIC=0`.
    if (results && results.length > 0 && env.MISAKANET_CJK_FUSE !== "0" && CJK_CHAR.test(String(args.query || ""))) {
      try {
        // 0.45 rather than the 0.62 no_match floor: fusion asks "is this plausibly the same
        // subject", where a near-miss is still useful as a second opinion, not "is this the answer".
        const vectorHits = await semanticFallbackHits(env, args.query, Math.max(args.top || 5, 10), 0.45);
        if (vectorHits.length) {
          const fused = rrfFuse(results, enrichSearchHits(vectorHits, lessons), args.top || 5);
          if (fused.length) {
            results = fused;
            source = "worker-bm25+cjk-fuse";
            noteSearchBackend(env, "semantic");
          }
        }
      } catch (e) {
        // A fusion failure must leave the lexical answer alone — same rule as the fallback above.
        debugLog(env, 1, "cjk fusion failed", { error: String((e && e.message) || e) });
      }
    }

    // Gap analysis: log zero-result queries (Issue #1164)
    if ((!results || results.length === 0) && args.query) {
      // Track the gap write with the runtime instead of letting it float: a
```

</details>

**依据 4 · 源码核查**：[misakanet/server/handlers/search.py:98-106](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/misakanet/server/handlers/search.py#L98-L106)

本地 fallback 查询入口。

```text
def _fallback_search(query: str, domain: str = None, top: int = 5) -> list | None:
    """Lightweight keyword search from lessons.json — stdlib-only.

    Used when SAG-Lite and BM25 are both unavailable (e.g. Glama sandbox).
    Returns None if lessons.json is not found (caller should show error).
    Returns [] if lessons.json exists but no matches (caller should show empty results).
    """
    # Try multiple locations for lessons.json
    candidates = [
```

#### 缺口

- 未运行线上 Worker、当前索引和真实查询
  **影响**：不能断言检索效果、配额或线上配置
  **进一步探讨**：用固定语料对照 CJK、零命中、关闭语义和回退失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 凭据、故障文本与远端服务的隐私和费用条件是什么？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

默认 MCP 地址指向公共服务，搜索文本先经网络到服务端，再由 Worker 中的 redactIntake 处理；服务端脱敏不能证明敏感内容没有出本机，也不能保证所有秘密形式被识别。README:58-68 声称匿名读取可用，具体实时额度与外部托管政策未核；需要写入、反馈或使用其他端点时依其身份与数据约定。用户应先用合成错误、检查来源与版本并人工确认修复，避免直接执行外部建议；若故障文本不能外发，应停止远端调用并转到本地日志或自托管路径。运行费用、人工核验和服务可用性未知。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:54-60](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/index.js#L54-L60)

默认公共 MCP 目标。

```text
export const DEFAULT_MCP_CONFIG = Object.freeze({
  transport: 'streamable-http',
  serverName: 'misakanet',
  url: 'https://misakanet.org/mcp',
  headers: { Origin: 'https://misakanet.org' },
  toolCallTimeoutMs: 60000,
  failOnStartupError: false,
```

**依据 2 · 源码核查**：[workers/register-proxy-sw.js:4297-4315](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/workers/register-proxy-sw.js#L4297-L4315)

脱敏发生在 Worker 搜索分支。

<details>
<summary>查看原文（19行）</summary>

```text
  if (toolName === "misakanet_search") {
    if (!args.query) return { error: "query is required" };

    // #3692: the query is the one thing that carries the caller's machine into our storage.
    // Today the raw text reached five places — `search_signals.query` (80 chars), `lesson_usage.query`
    // (200 chars), the knowledge-gap KV entry, the gap counter's bucket key, and (through the same
    // path) the analytics panel that publishes failed queries. The trial user's words were exact:
    // "报错片段会作为查询关键词发到该服务器——这意味着内部表名、路径等可能随查询外发".
    //
    // So the query is redacted ONCE, here, before anything reads it. Everything downstream — the
    // scoring, the gap log, the usage rows, the signal row — then works on the redacted text, and
    // there is no second place to forget. The scoring input changes with it, and that is deliberate:
    // a path or an address is not a search term, and the corpus is indexed by error text.
    //
    // The redaction is the same rule set the client hook applies (integrations/agent-autostart/
    // checkpoint_reminder.mjs), so the text that reaches the server is already redacted on the
    // hook's path — this is the half that covers the agent's OWN search call, which the client
    // cannot intercept.
    args = { ...args, query: redactIntake(String(args.query)) };
```

</details>

**依据 3 · 作者声明**：[README.md:58-69](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/README.md#L58-L69)

作者声明匿名入口及本地库。

<details>
<summary>查看原文（12行）</summary>

```text
## Install (30 seconds)

The point of an install is a first **successful search**, not the install. None of these needs an
account or a token.

| Your host | Command |
|---|---|
| **DeepSeek Harness** | `dsh plugin --profile web add misakanet` — or type `misakanet` in **Add plugin** |
| **Claude Code** | `/plugin marketplace add Ikalus1988/MisakaNet` then `/plugin install misakanet@misakanet` |
| Installer-managed | Claude Code · Codex · Hermes · OpenClaw · codewhale · Cursor · Gemini CLI · Copilot CLI · OpenCode · Kiro · MiniMax Code · DeepSeek Harness |
| **Any other MCP client** | point it at `https://misakanet.org/mcp` — public endpoint, anonymous reads |
| **Your own code** | `pip install misakanet-core` (library) · `pip install misakanet` (stdio server) |
```

</details>

**依据 4 · 作者声明**：[README.md:91-96](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/README.md#L91-L96)

作者提醒查看完整经验和证据。

```text
**2. Read what came back.** A hit returns the lesson, its `evidence_level`, and its path — open the
file and read the fix before running any command in it. A miss returns `no_match` plus a ready-to-call
intake: the corpus saying it does not know this one yet.

**3. Check the trust signal, not the tone.** `E0`–`E3` say how far a lesson was verified; `E4` is the
one nobody can write or vote into.
```

#### 缺口

- 未审计完整脱敏规则、远端数据处理与实际计费
  **影响**：不能保证无敏感出站或免费服务持续
  **进一步探讨**：使用合成标记核对客户端请求和服务端日志策略。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让检索结果附加当前环境验证结果？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 lesson 已有证据级、来源及反馈，README:239-246 还描述反馈和来源收据；再次展示相似度或投票不是新增验证。未验证设想是在用户本机为所选建议生成单独的环境验证收据：明确软件版本、前置条件、用户批准运行的检查、结果和不可观察项，不上传原始日志或密钥；没有检查或结果未知时不可称为验证成功。先核查现有反馈、preflight 是否已覆盖等价行为。用五类错误文本相似但原因或版本不同的案例，对照当前搜索加全文与收据，盲测错误套用、任务成功、人工时间与敏感信息暴露；若无改善、未经授权执行、泄露或维护负担过高则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:91-96](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/README.md#L91-L96)

已有 lesson 等级与原文提示。

```text
**2. Read what came back.** A hit returns the lesson, its `evidence_level`, and its path — open the
file and read the fix before running any command in it. A miss returns `no_match` plus a ready-to-call
intake: the corpus saying it does not know this one yet.

**3. Check the trust signal, not the tone.** `E0`–`E3` say how far a lesson was verified; `E4` is the
one nobody can write or vote into.
```

**依据 2 · 作者声明**：[README.md:239-246](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/README.md#L239-L246)

已有反馈和来源收据。

```text
**1. Report a failure the corpus does not have.** Search first, then call `misakanet_submit_intake` —
no account, no email, no token, a five-line report is enough. It becomes a tracked issue.

**2. Reuse a lesson and leave the trace.** A "this helped" vote is recorded as an `E3` hint, not as
proof. The proof is quieter: your retrieval is counted, anonymously, as one more distinct client.

**What you get back: attribution.** A lesson cites the intake that produced it (`source:`,
`provenance.issue:`), and the pipeline can emit a receipt naming the lesson and its evidence level.
```

**依据 3 · 源码核查**：[workers/register-proxy-sw.js:4368-4391](https://github.com/Ikalus1988/MisakaNet/blob/b38ef5bf0304212ec2eb4c0c46d16c42672d551e/workers/register-proxy-sw.js#L4368-L4391)

现有语义后备结果。

<details>
<summary>查看原文（24行）</summary>

```text

    // Both matchers project a narrow shape (BM25 from the index, the naive one from
    // the record), so re-attach the loaded records once here: the injection scan
    // below then sees real bodies instead of a title, and the progressive-disclosure
    // formatters get `problem`/`fix`/`tags`/`freshness` instead of empty strings
    // (issue #1675).
    results = enrichSearchHits(results, lessons);


    // Semantic fallback (2026-10-26): BM25's floor returns no_match on paraphrases that name the
    // symptom instead of the error text. Only an empty BM25 result reaches this branch; a hit is
    // never re-ranked, so the lexical path keeps its behavior. Failure is swallowed into the
    // existing no_match answer — the fallback must not turn a working search into an error.
    if ((!results || results.length === 0) && env.MISAKANET_SEMANTIC !== "0") {
      try {
        const semanticHits = await semanticFallbackHits(env, args.query, args.top || 5);
        if (semanticHits.length) {
          results = enrichSearchHits(semanticHits, lessons);
          source = bm25Index ? "worker-bm25+semantic" : "semantic";
          noteSearchBackend(env, "semantic");
        }
      } catch (e) {
        debugLog(env, 1, "semantic fallback failed", { error: String((e && e.message) || e) });
      }
```

</details>

#### 缺口

- 未穷尽现有反馈及 preflight 实现，也无收据原型
  **影响**：无法证明新方案有增量或降低误用
  **进一步探讨**：先比对现有功能，再用固定错误与环境盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
