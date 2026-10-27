# MisakaNet

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[68fb694](https://github.com/Ikalus1988/MisakaNet/tree/68fb694e6627ae8ce3a2a071548eef9ce00e814d)

<!-- BEGIN META -->
[![GitHub ★ 543](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=543&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ikalus1988/MisakaNet) [![npm 30d 7,216](https://img.shields.io/static/v1?label=npm+30d&message=7%2C216&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/misakanet) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/misakanet)
<!-- END META -->

> **功能**：通过 Git 管理的故障教训与 MCP 检索，为 Agent 提供失败修复线索和反馈流程

> **亮点**：[Q01](#research-q01) 将问题、修复和来源组织为Git教训；[Q02](#research-q02) 默认MCP接入及渐进披露使Agent能按需回读，推理与实际修复仍由使用者完成。

> **主要限制**：[Q03](#research-q03) 匹配与证据等级不能证明本环境适用，服务器脱敏也不能阻止查询已外发；[Q02](#research-q02) 服务可启动不等于工具已挂载。

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
  - [Q01 · 相比搜索网页或本地笔记，失败记忆多交付什么？](#detail-section-11)
  - [Q02 · DSH默认连接何处，搜索如何返回和降级？](#detail-section-12)
  - [Q03 · 匹配、证据等级与脱敏能否保证安全复用？](#detail-section-13)
  - [Q04 · 什么场景值得试用，成本及退出怎么核对？](#detail-section-14)
  - [Q05 · 可否给教训增加环境匹配与应用回执？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者反复遇到工程错误，希望把教训供后续Agent检索，而不是重复从零排障。

官方文档/网页搜索加本地故障笔记，按当前环境验证后应用修复。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 教训检索 | 找相似工程失败 | 匹配不等于本环境有效 |
| 渐进回读 | 先摘要后完整材料 | 不能跳过适用条件 |
| 反馈/缺口 | 保存结果与缺结果线索 | 查询会涉及远端处理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH官方MCP客户端 | 默认接入需 | 动态挂载HTTP工具 | 只有Skill/面板不证明工具就绪 |
| 公共服务网络和配额 | 默认检索需 | 检索/回读远端语料 | 无结果或限流回官方资料 |
| Python与完整仓库/索引 | 本地stdio才需 | 不同本地检索路径 | npm包不等于有本地server |
| 查询前脱敏与环境核对 | 复用必需 | 防敏感外发和错误修复 | 不满足则停远端/不运行命令 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者脱敏公开故障 | 无秘密与内部业务字段 |
| 搜索 | Agent检查真实工具并查询 | 核对返回source与no_match |
| 回读 | 开发者读完整教训与来源 | 环境和版本适用 |
| 验证 | 用户在授权可恢复范围确认修复 | 不符回官方文档，不能凭命中执行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | MCP网络或本地索引资源，金额未知 | 接入、脱敏与首次回读 | 公共部署未验 |
| 持续使用 | 查询/补读与模型调用 | 适用性和来源复核 | compact不代表总token节省 |
| 失败恢复 | 错用修复可能增加成本 | 回原配置与官方依据 | 无端到端修复实验 |
| 退出 | 保留本地故障笔记 | 禁用远端接入 | 敏感内容不应先发送后补救 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 教训组织 | Git文件、问题/修复/来源 | 当前环境修复效果 |
| 检索 | 词法与空结果语义降级 | 线上索引和召回时效 |
| 脱敏 | Worker入口处理查询 | 不能消除原文网络发送 |

> **思考**：[Q03](#research-q03) 匹配与证据等级不能证明本环境适用，服务器脱敏也不能阻止查询已外发；[Q02](#research-q02) 服务可启动不等于工具已挂载。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将问题、修复和来源组织为Git教训；[Q02](#research-q02) 默认MCP接入及渐进披露使Agent能按需回读，推理与实际修复仍由使用者完成。

[Q02](#research-q02)缺客户端时有警告并降级，空结果和紧凑回读分开；[Q03](#research-q03)查询统计与脱敏位于服务端，需明确发送前责任。本轮样本证明格式而非全库质量。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 匹配与证据等级不能证明本环境适用，服务器脱敏也不能阻止查询已外发；[Q02](#research-q02) 服务可启动不等于工具已挂载。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅脱敏公开故障搜索回读试用，不自动运行社区修复。敏感、环境不符或服务不可用时回本地记录和官方文档。

最小验证选五个错误文本相似但原因或版本不同的故障，比较当前搜索+全文与环境收据的误用率、修复成功率和人工成本。须先核查现有反馈和preflight已覆盖多少，不能宣称完全空白；如果收据收集更多敏感信息、用户维护负担大于减少的误用，或现有版本说明已足够，则停止独立扩展。该假设未实现也不计创新分。 见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定接入与检索源路径可查；公共部署、教训真实修复和成本未验证。环境收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、SKILL.md、cordis.patch.yml、index.js、scripts/mcp_server.py、misakanet/server/handlers/search.py、workers/register-proxy-sw.js、lessons/en/wsl2-memory-leak-fix.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定68fb694e6627ae8ce3a2a071548eef9ce00e814d，检查README/Skill、DSH入口patch、Worker搜索段、本地handler和一条教训；未审全站、全部教训或部署配置。
- 下一步：仅固定源码与样例检查，未连接公共MCP、执行修复或运行目标测试；不采信宣传耗时为本轮结果。

**分析版本**

- **仓库**：[Ikalus1988/MisakaNet](https://github.com/Ikalus1988/MisakaNet)
- **版本号**：2.50.1（[固定提交 68fb694](https://github.com/Ikalus1988/MisakaNet/tree/68fb694e6627ae8ce3a2a071548eef9ce00e814d)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以提出未验证的环境匹配收据，查询时只携带脱敏软件版本与可公开条件，返回支持/不适用/未知边界及原证据；应用后把真实环境、验证动作和结果作为独立回执，不用检索分数替代修复通过。相对已有搜索与反馈，增量是将“找到相似错误”推进到“本环境已验证或明确不适用”，避免跨机器直接套用。

最小验证选五个错误文本相似但原因或版本不同的故障，比较当前搜索+全文与环境收据的误用率、修复成功率和人工成本。须先核查现有反馈和preflight已覆盖多少，不能宣称完全空白；如果收据收集更多敏感信息、用户维护负担大于减少的误用，或现有版本说明已足够，则停止独立扩展。该假设未实现也不计创新分。 见 [Q05](#research-q05)。

仅固定源码与样例检查，未连接公共MCP、执行修复或运行目标测试；不采信宣传耗时为本轮结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1129 | 139822 | — | — | 1142578 |
| .md | example | 7 | 225 | — | — | 576 |
| .js | source | 18 | 14988 | 9409 | 4795 | — |
| .ts | source | 3 | 432 | 310 | 64 | — |
| .mjs | source | 12 | 6784 | 4227 | 2237 | — |
| .js | test | 15 | 1767 | 1305 | 293 | — |
| .cjs | test | 1 | 645 | 442 | 168 | — |
| .mjs | test | 98 | 22037 | 16246 | 4163 | — |

</details>

**活跃度**

[![Issue 未关闭 281](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=281&color=737b86&logo=github)](https://github.com/Ikalus1988/MisakaNet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 587](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=587&color=737b86&logo=github)](https://github.com/Ikalus1988/MisakaNet/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 414](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=414&color=737b86&logo=github)](https://github.com/Ikalus1988/MisakaNet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：失败记忆检索与证据等级能支持什么，远端/本地及安全复用边界在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比搜索网页或本地笔记，失败记忆多交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对象是重复遇到环境、依赖、CI或工具错误的开发者。基线是搜索报错网页或自己维护故障笔记；MisakaNet把问题、原因、修复和来源放入Git管理的Markdown，并通过Agent接口检索和回读。它的增量是让下一个Agent能按故障线索找到可追溯的教训，而不是每次从聊天猜解决办法。

样例WSL教训包含状态、翻译来源、provenance和配置步骤，但这种元数据不是本轮复现实验。不同机器、版本和任务的相似错误可能原因不同；“下一Agent不再失败”是作者愿景，不能由一条已发布教训推导。模型仍需检查修复与当前环境相符，尤其不能为提高命中率自动运行社区命令。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:11-22](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/README.md#L11-L22)

作者以重复故障为目标并提供多Agent接口。

<details>
<summary>查看原文（12行）</summary>

```text
> **The same failure, paid for twice.**
>
> A `pip install` times out behind a corporate proxy. An agent finds the fix. Days later the same
> timeout appears on another machine, under another model — and is debugged from scratch, because the
> fix was never written down anywhere the next agent looks.
>
> MisakaNet is that place: a git-backed **failure memory**. Every lesson is a Markdown file in this
> repository — graded by evidence, reviewed like code, retrieved by an agent instead of guessed at.
> You fail once; the next agent does not.

Agent-native interfaces: [MCP server](https://misakanet.org/mcp) (8 tools), WebMCP, `llms.txt`,
A2A discovery via `.well-known/agent-card.json`.
```

</details>

**依据 2 · 源码核查**：[lessons/en/wsl2-memory-leak-fix.md:1-29](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/lessons/en/wsl2-memory-leak-fix.md#L1-L29)

样例状态与来源，内容是教训而非本轮独立验证。

<details>
<summary>查看原文（29行）</summary>

```text
---
{
  "title": "WSL2 memory leak — runaway host memory usage",
  "domain": "devops",
  "tags": ["wsl", "memory", "leak", "performance", "windows"],
  "status": "published",
  "lang": "en",
  "source": "uncledad96-glitch",
  "translated_from": "lessons/contrib/wsl2-memory-leak-fix.md",
  "created": "2026-08-02",
  "updated": "2026-08-02",
  "confidence": "0.9"
}
provenance:
  source: "external"
  contributor: "Unknown"
  merged_at: "2026-08-23"
  evidence: "post-publication"
---

# WSL2 memory leak — runaway host memory usage

## Problem

After a few days, WSL2 consumes 8 GB+ of host RAM and Windows becomes sluggish. `free -h` inside WSL shows almost all memory in use, and `htop` reveals no single process holding the memory.

## Root Cause

WSL2 uses dynamic memory allocation and does not aggressively release memory back to Windows by default. Long-running processes (Python services, vector databases, Docker, Jupyter) allocate memory that is not returned to the host when the process exits. This is documented in the [WSL release notes](https://docs.microsoft.com/en-us/windows/wsl/faq#how-do-i-configure-wsl-to-use-less-memory).
```

</details>

**依据 3 · 源码核查**：[SKILL.md:12-35](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/SKILL.md#L12-L35)

适用故障范围与搜索/应用/反馈流程。

<details>
<summary>查看原文（24行）</summary>

````text
Use MisakaNet when you encounter:

- **Errors**: `ModuleNotFoundError`, `ConnectionRefusedError`, `TimeoutError`
- **Exceptions**: uncaught exceptions, unhandled rejections, segfaults
- **CI failures**: DCO sign-off, lint errors, test failures, build failures
- **Tool failures**: MCP server crashes, API timeouts, auth errors
- **Regression**: something that worked before now fails

Do NOT use MisakaNet for:

- Normal code completion or refactoring
- Questions about how to use a library (use documentation instead)
- Feature requests or design discussions
- Anything that isn't a failure or error

## Recovery flow

```
1. Hit an error
   ↓
2. Search MisakaNet for matching lessons
   ↓
3. If found → apply the documented fix
   If not found → capture a redacted failure report
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH默认连接何处，搜索如何返回和降级？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

默认npm bundle让本包动态加载宿主官方MCP客户端，连接公共https endpoint，设60秒超时和非致命启动失败；本地Python不是npm默认路径。官方client缺失或加载失败时记录警告并返回，DSH能启动不代表工具已挂载。

固定Worker搜索先对query脱敏、消费匿名突发配额、加载lessons/BM25索引，按可用后端取候选并补回正文元数据；空结果且允许semantic时再尝试语义降级，失败仍保留no_match路径。Python本地handler也有SAG/BM25/fallback、草稿过滤和compact/summary/full渐进披露，但不能将本地实现当作公共部署正在运行的字节。公共服务的实际部署、索引时间与依赖环境本轮未查询。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:53-60](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/index.js#L53-L60)

默认公共HTTP与超时配置。

```text
 */
export const DEFAULT_MCP_CONFIG = Object.freeze({
  transport: 'streamable-http',
  serverName: 'misakanet',
  url: 'https://misakanet.org/mcp',
  headers: { Origin: 'https://misakanet.org' },
  toolCallTimeoutMs: 60000,
  failOnStartupError: false,
```

**依据 2 · 源码核查**：[index.js:104-134](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/index.js#L104-L134)

动态官方client挂载与降级警告。

<details>
<summary>查看原文（31行）</summary>

```text
    let client;
    try {
      // Dynamic import: the client is ESM and only exists inside a DSH install.
      client = await import('@deepseek-ai/dsh-mcp-client');
    } catch (error) {
      if (options.failOnStartupError) throw error;
      // Expected on npm skill-only installs: the skill (SKILL.md) is the payload,
      // and a missing client must not take the whole profile down with it.
      //
      // Returning quietly is right for **boot** and wrong for **diagnosis**. `lib/client.js`
      // mounts the browser half either way, so the observable result is a rendered MisakaNet
      // panel whose tools never reach the agent — intake #2759 reported exactly that ("the
      // sidebar is decorative", zero requests to misakanet.org) with nothing in the host log
      // to separate "this profile never installed the client" from "this profile is broken".
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

**依据 3 · 源码核查**：[workers/register-proxy-sw.js:4028-4079](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/workers/register-proxy-sw.js#L4028-L4079)

公共Worker脱敏、配额、索引加载与词法检索主链。

<details>
<summary>查看原文（52行）</summary>

```text
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
      const refusal = await consumeQuota(env, {
        scope: "rate_read", bucket: ip, period: readBurstPeriod(), limit: READ_BURST_LIMIT,
        message: READ_BURST_MESSAGE,
        hint: `retry after up to ${READ_BURST_WINDOW_SECONDS}s; no registration needed`,
      });
      if (refusal) return { ...refusal, voice: "failure-warning" };
    }

    let lessons;
    try {
      lessons = await loadLessons(env);
    } catch (e) {
      return { error: `Failed to load lessons: ${e.message}` };
    }

    // Try BM25 search first (if index available), fall back to naive search
    let results;
    let source = "worker-search";
    // Alias expansion (issue #1780) happens here — on the query, before any scoring —
    // and only on this path: the gap-cleanup cron scores raw gap strings through
    // `searchLessonsBM25` directly. `args.query` stays the query of record for the gap
    // log, the analytics events, the kind detector, the no-match text and the FAQ
    // matcher; only the scorer sees the expansion.
    const scoringQuery = scoringQueryFor(args.query, env);
    if (scoringQuery !== args.query) {
      debugLog(env, 2, "query alias expansion", {
        query: args.query, scored: scoringQuery, aliasVersion: QUERY_ALIAS_VERSION,
      });
    }
    const bm25Index = await loadBM25Index(env);
    if (bm25Index) {
      // `args.query` is also passed as the floor query: the expansion may add score, but
      // the relevance floor keeps judging what the user typed (see searchLessonsBM25).
      results = searchLessonsBM25(bm25Index, scoringQuery, args.domain, args.top || 5, args.query);
      source = "worker-bm25";
      noteSearchBackend(env, "bm25");
      debugLog(env, 2, "BM25 search", { query: scoringQuery, results: results.length });
    } else {
      results = searchLessons(lessons, scoringQuery, args.domain, args.top || 5, args.query);
      noteSearchBackend(env, "fallback");
      debugLog(env, 2, "Fallback search", { query: scoringQuery, results: results.length });
```

</details>

**依据 4 · 源码核查**：[workers/register-proxy-sw.js:4087-4104](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/workers/register-proxy-sw.js#L4087-L4104)

无词法结果才语义降级，失败不扩大为正常命中。

<details>
<summary>查看原文（18行）</summary>

```text
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

**依据 5 · 源码核查**：[misakanet/server/handlers/search.py:475-512](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/misakanet/server/handlers/search.py#L475-L512)

本地草稿排除与渐进披露，空结果明示。

<details>
<summary>查看原文（38行）</summary>

```text

    # ── Draft exclusion (docs/mcp.md search scope) ──
    # Applied before kind/detail transforms so every detail level and every
    # backend honours the same published-only contract. Truncate back to the
    # requested count afterwards, since the backends were asked for extra.
    if results:
        results = _exclude_drafts(results)
        if isinstance(top, int) and top > 0:
            results = results[:top]

    # ── Kind filtering (Issue #1441) ──
    if results and kind != "all":
        results = _filter_by_kind(results, kind)

    # ── Progressive disclosure: transform by detail level ──

    if results and detail in ("compact", "summary"):
        results = _apply_detail_level(results, detail)

    # ── Gap analysis: log zero-result queries (Issue #1164) ──
    if not results:
        _log_search_gap(query, source)

    # Tag each result with its kind
    for r in results:
        if "kind" not in r:
            r["kind"] = kind if kind != "all" else _classify_result_kind(r)

    voice = "lesson-found" if results else "failure-warning"
    response = {
        "results": results,
        "source": source,
        "detail": detail,
        "kind": kind,
        "voice": voice,
    }
    if not results:
        response.update(_no_match_feedback(query))
```

</details>

#### 缺口

- 公网服务部署版本、索引和语义后端是否与固定源码相同未知。
  **影响**：不能把源码能力写成实际在线可用或检索耗时保证。
  **进一步探讨**：只用脱敏公开故障做首次搜索，核对返回source、版本/路径与原始教训。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 匹配、证据等级与脱敏能否保证安全复用？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能。检索分数用于相关性排序，证据等级或published只描述材料来源与流程状态，不是对当前机器的通过证明。已检查样例含具体WSL配置和重启步骤，是否适合当前环境必须另外确认；本轮未执行这些命令。公共搜索的query先到远端Worker，服务器再脱敏并用于日志/usage，所以服务器脱敏不能阻止原始查询已经外发。调用者应在发送前去掉秘密、内部路径、账号和业务内容，敏感场景可考虑本地stdio但需完整仓库/Python与索引。

源码确有缺结果记录和usage跟踪，未命中也不是本地无副作用的纯查询。渐进披露减少默认返回正文量，却可能遗漏适用条件，必须回读完整教训；不能将紧凑结果中的一句fix直接当执行指令。

#### 证据与依据

**依据 1 · 源码核查**：[workers/register-proxy-sw.js:4013-4028](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/workers/register-proxy-sw.js#L4013-L4028)

脱敏发生在服务器handler入口，无法消除网络发送本身。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 2 · 源码核查**：[workers/register-proxy-sw.js:4107-4119](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/workers/register-proxy-sw.js#L4107-L4119)

查询和缺口进入服务端分析路径。

<details>
<summary>查看原文（13行）</summary>

```text
    // Gap analysis: log zero-result queries (Issue #1164)
    if ((!results || results.length === 0) && args.query) {
      // Track the gap write with the runtime instead of letting it float: a
      // fire-and-forget promise can be dropped when the isolate finishes the
      // response (today's gap records were only "eventually" written by luck), and
      // `waitUntil` also makes the work awaitable in tests, which is how a latent
      // race in the gap test surfaced on 2026-09-12.
      const gapWork = logSearchGap(env, args.query, source).catch(() => {});
      if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(gapWork);
      // PRD ④ #1357: record knowledge-gap events for analytics.
      if (ctx) ctx.waitUntil(trackUsage(env, ctx, "no_match", { query: args.query }));
    } else if (results && results.length > 0) {
      if (ctx) ctx.waitUntil(trackUsage(env, ctx, "search", { query: args.query }));
```

</details>

**依据 3 · 源码核查**：[lessons/en/wsl2-memory-leak-fix.md:46-61](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/lessons/en/wsl2-memory-leak-fix.md#L46-L61)

教训包含环境配置和重启，适用性必须另验。

<details>
<summary>查看原文（16行）</summary>

````text
### 2. Cap WSL2 memory (Windows-side)

Create or edit `C:\Users\<username>\.wslconfig`:

```ini
[wsl2]
memory=4GB
swap=2GB
localhostForwarding=true
```

Then restart WSL from PowerShell:

```powershell
wsl --shutdown
wsl
````

</details>

**依据 4 · 源码核查**：[misakanet/server/handlers/search.py:489-512](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/misakanet/server/handlers/search.py#L489-L512)

默认可紧凑返回且缺结果有独立路径。

<details>
<summary>查看原文（24行）</summary>

```text
    # ── Progressive disclosure: transform by detail level ──

    if results and detail in ("compact", "summary"):
        results = _apply_detail_level(results, detail)

    # ── Gap analysis: log zero-result queries (Issue #1164) ──
    if not results:
        _log_search_gap(query, source)

    # Tag each result with its kind
    for r in results:
        if "kind" not in r:
            r["kind"] = kind if kind != "all" else _classify_result_kind(r)

    voice = "lesson-found" if results else "failure-warning"
    response = {
        "results": results,
        "source": source,
        "detail": detail,
        "kind": kind,
        "voice": voice,
    }
    if not results:
        response.update(_no_match_feedback(query))
```

</details>

#### 缺口

- 各教训证据链、当前环境适用性和前置客户端脱敏覆盖未全面核查。
  **影响**：不能承诺修复安全、秘密不外发或全部教训可靠。
  **进一步探讨**：发查询前人工脱敏，命中后读原文和官方依据，再用可恢复样例核对环境。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么场景值得试用，成本及退出怎么核对？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议已有重复工程故障且可用公开脱敏文本描述的开发者有限试用一次搜索和回读，不将自动运行修复纳入建议。成功标准是找到与当前版本/环境匹配、原文和来源可核查的解释，并完成自己授权的验证；不是返回命中或面板出现。官方client缺失、公共服务失败、配额或无结果时回官方文档和本地故障笔记。

初次成本是接入正确profile、验证真实工具和查询内容脱敏；持续成本是读全文、适用性判断及反馈，应用修复仍可能有模型调用和重试。公共匿名读不需账号是作者声明，不能转成持续免费或不受配额限制承诺；本轮没有价格、总token或修复时间实测。默认compact可能降低传回文字，但加上补读、误匹配和验证，端到端是否节省未知。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:58-90](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/README.md#L58-L90)

首次成功搜索而非安装作为作者验收入口。

<details>
<summary>查看原文（33行）</summary>

````text
## Install (30 seconds)

The point of an install is a first **successful search**, not the install. None of these needs an
account or a token.

| Your host | Command |
|---|---|
| **DeepSeek Harness** | `dsh plugin --profile web add misakanet` — or type `misakanet` in **Add plugin** |
| **Claude Code** | `/plugin marketplace add Ikalus1988/MisakaNet` then `/plugin install misakanet@misakanet` |
| Installer-managed | Claude Code · Codex · Hermes · OpenClaw · codewhale · Cursor · Gemini CLI · Copilot CLI · OpenCode · Kiro · MiniMax Code |
| **Any other MCP client** | point it at `https://misakanet.org/mcp` — public endpoint, anonymous reads |
| **Your own code** | `pip install misakanet-core` (library) · `pip install misakanet` (stdio server) |

The installer-managed row is what `npx @misaka-net/misakanet-setup` writes into each host's config.

Updates: `dsh plugin --profile web update misakanet@latest`.
Installer updates: `npx @misaka-net/misakanet-setup@latest`.
Full prerequisites and the two-package trap: [How to use it](#how-to-use-it).

## Your first five minutes

**1. Ask it something you have actually broken.** No client installed? This `curl` is the whole interface:

```bash
curl -sS https://misakanet.org/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -H 'MCP-Protocol-Version: 2025-06-18' -H 'Origin: https://misakanet.org' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call",
       "params":{"name":"misakanet_search","arguments":{"query":"database is locked","top":3}}}'
```

**2. Read what came back.** A hit returns the lesson, its `evidence_level`, and its path — open the
file and read the fix before running any command in it. A miss returns `no_match` plus a ready-to-call
````

</details>

**依据 2 · 源码核查**：[index.js:104-134](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/index.js#L104-L134)

缺client工具降级路径。

<details>
<summary>查看原文（31行）</summary>

```text
    let client;
    try {
      // Dynamic import: the client is ESM and only exists inside a DSH install.
      client = await import('@deepseek-ai/dsh-mcp-client');
    } catch (error) {
      if (options.failOnStartupError) throw error;
      // Expected on npm skill-only installs: the skill (SKILL.md) is the payload,
      // and a missing client must not take the whole profile down with it.
      //
      // Returning quietly is right for **boot** and wrong for **diagnosis**. `lib/client.js`
      // mounts the browser half either way, so the observable result is a rendered MisakaNet
      // panel whose tools never reach the agent — intake #2759 reported exactly that ("the
      // sidebar is decorative", zero requests to misakanet.org) with nothing in the host log
      // to separate "this profile never installed the client" from "this profile is broken".
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

**依据 3 · 源码核查**：[workers/register-proxy-sw.js:4030-4051](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/workers/register-proxy-sw.js#L4030-L4051)

配额和加载失败边界。

<details>
<summary>查看原文（22行）</summary>

```text
    // Rate limit: 5 free reads/day per IP for remote HTTP (shared across
    // search + get_lesson). Local stdio MCP is unlimited (user has the code).
    // Authenticated callers (any valid token) are exempt — the token proves
    // they registered, so they get the registered quota instead. Anonymous
    // callers have an empty token here (auth failures never reach this point).
    if (!authToken) {
      const ip = clientIp || "unknown";
      // Burst window, not a daily cap (2026-09-18): reuse the same D1 counter with a minute key, so
      // this needs no new storage and stays atomic across isolates.
      const refusal = await consumeQuota(env, {
        scope: "rate_read", bucket: ip, period: readBurstPeriod(), limit: READ_BURST_LIMIT,
        message: READ_BURST_MESSAGE,
        hint: `retry after up to ${READ_BURST_WINDOW_SECONDS}s; no registration needed`,
      });
      if (refusal) return { ...refusal, voice: "failure-warning" };
    }

    let lessons;
    try {
      lessons = await loadLessons(env);
    } catch (e) {
      return { error: `Failed to load lessons: ${e.message}` };
```

</details>

#### 缺口

- 当前任务真实修复率、脱敏后召回和总成本未知。
  **影响**：不能将宣传0.02秒或命中率当任务收益。
  **进一步探讨**：对五个已知故障比较官方搜索与本工具，记录完整修复时间、错用和全部模型token。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否给教训增加环境匹配与应用回执？

**研究主题**：新假设与验证

#### 完整回答

可以提出未验证的环境匹配收据，查询时只携带脱敏软件版本与可公开条件，返回支持/不适用/未知边界及原证据；应用后把真实环境、验证动作和结果作为独立回执，不用检索分数替代修复通过。相对已有搜索与反馈，增量是将“找到相似错误”推进到“本环境已验证或明确不适用”，避免跨机器直接套用。

最小验证选五个错误文本相似但原因或版本不同的故障，比较当前搜索+全文与环境收据的误用率、修复成功率和人工成本。须先核查现有反馈和preflight已覆盖多少，不能宣称完全空白；如果收据收集更多敏感信息、用户维护负担大于减少的误用，或现有版本说明已足够，则停止独立扩展。该假设未实现也不计创新分。

#### 证据与依据

**依据 1 · 源码核查**：[lessons/en/wsl2-memory-leak-fix.md:1-29](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/lessons/en/wsl2-memory-leak-fix.md#L1-L29)

教训来源与当前运行环境分离。

<details>
<summary>查看原文（29行）</summary>

```text
---
{
  "title": "WSL2 memory leak — runaway host memory usage",
  "domain": "devops",
  "tags": ["wsl", "memory", "leak", "performance", "windows"],
  "status": "published",
  "lang": "en",
  "source": "uncledad96-glitch",
  "translated_from": "lessons/contrib/wsl2-memory-leak-fix.md",
  "created": "2026-08-02",
  "updated": "2026-08-02",
  "confidence": "0.9"
}
provenance:
  source: "external"
  contributor: "Unknown"
  merged_at: "2026-08-23"
  evidence: "post-publication"
---

# WSL2 memory leak — runaway host memory usage

## Problem

After a few days, WSL2 consumes 8 GB+ of host RAM and Windows becomes sluggish. `free -h` inside WSL shows almost all memory in use, and `htop` reveals no single process holding the memory.

## Root Cause

WSL2 uses dynamic memory allocation and does not aggressively release memory back to Windows by default. Long-running processes (Python services, vector databases, Docker, Jupyter) allocate memory that is not returned to the host when the process exits. This is documented in the [WSL release notes](https://docs.microsoft.com/en-us/windows/wsl/faq#how-do-i-configure-wsl-to-use-less-memory).
```

</details>

**依据 2 · 源码核查**：[workers/register-proxy-sw.js:4082-4087](https://github.com/Ikalus1988/MisakaNet/blob/68fb694e6627ae8ce3a2a071548eef9ce00e814d/workers/register-proxy-sw.js#L4082-L4087)

检索补回元数据不等于验证应用效果。

```text
    // Both matchers project a narrow shape (BM25 from the index, the naive one from
    // the record), so re-attach the loaded records once here: the injection scan
    // below then sees real bodies instead of a title, and the progressive-disclosure
    // formatters get `problem`/`fix`/`tags`/`freshness` instead of empty strings
    // (issue #1675).
    results = enrichSearchHits(results, lessons);
```

#### 缺口

- 既有preflight/反馈对环境验证的完整覆盖及用户负担。
  **影响**：不能将收据设想计为现有差异或市场需求。
  **进一步探讨**：先核现有工具契约，再用同故障对照测试是否减少误用。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
