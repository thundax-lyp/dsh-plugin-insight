# dsh-github-router

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[b5c056e](https://github.com/AngelosZou/dsh-github-router/tree/b5c056e1b50fb3446a153bae7ecf2d923f6f7923)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-github-router) [![npm 30d 1,602](https://img.shields.io/static/v1?label=npm+30d&message=1%2C602&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-github-router) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-github-router)
<!-- END META -->

> **实现功能**：提供PR、Issue、文件及API只读工具，通过API、gh、Git、HTML与可选镜像在宿主内降级取数。

> **核心亮点**：将多传输故障处理和PR逐部分取数封装为Agent读取流程，减少shell重试与人工拼接。详见[Q01](#research-q01)。

> **风险与缺陷**：URL缓存不绑定凭据主体，本地路径以origin匹配替代授权闭合；分页、HTML候选与镜像也限制完整性。详见[Q04](#research-q04)。

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
  - [Q01 · 为什么在宿主提供GitHub只读路由？](#detail-section-11)
  - [Q02 · 从工具调用到不同读取路线如何衔接？](#detail-section-12)
  - [Q03 · 宿主、凭据和本地Git边界是什么？](#detail-section-13)
  - [Q04 · 只读与缓存为什么仍存在实质风险？](#detail-section-14)
  - [Q05 · 工程拆分和测试能支持哪些判断？](#detail-section-15)
  - [Q06 · 首次、持续与失败恢复成本怎样判断？](#detail-section-16)
  - [Q07 · 采用条件和后续探讨方向是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：网络受限的Agent需要有来源标注的GitHub资料读取。详见[Q01](#research-q01)。

已配置的gh/API/GitHub连接器以及人工固定源码是替代；多路线减少重试但增加身份和一致性核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 五只读工具 | GitHub资料取数 | 身份/分页/路线需核对 |
| 多路线降级 | 减少shell网络重试 | 非统一快照 |
| 配置与Skill | 设置与Agent指导 | 依赖宿主契约 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=22.19与宿主peers | ESM/注册/配置 | 不匹配无法加载 |
| 凭据与proxy | 私有读取/连通 | 身份和缓存需隔离 |
| gh/git可选 | 后备路线 | 环境身份与插件token不同 |
| 独立缓存目录 | 持久取数 | URL键缺主体边界 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 选公共仓库与隔离目录 | 维护者 | 无共享私有身份 |
| probe并取固定SHA对象 | Agent | route/对象一致 |
| 核对分页、截断与官方内容 | 读者 | 不将部分数据写全量结论 |
| 出错隔离缓存与路线 | 维护者 | 不复用旧身份响应 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容宿主、凭据与代理 | 隔离目录及权限设计 | 需权限、代理、gh/git及私有缓存策略；准备工时未知 |
| 持续使用 | 额度/网络/缓存/模型上下文 | 核对来源、截断和SHA，节省未测 | 无新增独立服务不等无API/模型/磁盘费；尾延迟和节省未量化 |
| 失败恢复 | 清缓存与重新认证 | 判断分页缺失/错对象，恢复路线 | Git缓存持久写入；错身份隔离/分页/重新认证恢复工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 网络降级 | 多路线与错误矩阵 | 尾延迟累加 |
| PR上下文 | 逐部分route/列表cap | 单页不等全量 |
| 读取约束 | GET/argv/JSON.parse | 不等主体隔离和内容真实 |

> **思考**：URL缓存不绑定凭据主体，本地路径以origin匹配替代授权闭合；分页、HTML候选与镜像也限制完整性。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将多传输故障处理和PR逐部分取数封装为Agent读取流程，减少shell重试与人工拼接。详见[Q01](#research-q01)。

将多传输故障处理和PR逐部分取数封装为Agent读取流程，减少shell重试与人工拼接。详见[Q01](#research-q01)。

route/core拆分和纯函数测试便于核查；需补主体缓存、取消等待、repo锁与分页完整性。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

URL缓存不绑定凭据主体，本地路径以origin匹配替代授权闭合；分页、HTML候选与镜像也限制完整性。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；公共仓库单用户隔离环境可对照，私有多身份/共享存储先解决缓存与授权边界。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

多路由与只读构造可查；缓存主体、本地授权和内容完整性存在具体边界，身份快照收据为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/settings.js、lib/config.js、lib/core/runtime.js、lib/core/pr.js、lib/core/file.js、lib/routes/api.js、lib/routes/git.js、lib/routes/gh.js、lib/routes/html.js、lib/routes/mirror.js、lib/tools/api.js、lib/net.js、lib/cache.js、lib/util.js、test/cache-mirror.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：阅读固定提交入口、配置、runtime、PR和文件聚合关键段、API/gh/Git/HTML/mirror路线、缓存/HTTP及缓存测试；未穷尽浏览器和CONNECT实现，不执行目标。
- 下一步：进一步从身份切换同URL、百文件分页、多JSON候选、镜像内容和不同ref并发探讨来源快照契约。

**分析版本**

- **仓库**：[AngelosZou/dsh-github-router](https://github.com/AngelosZou/dsh-github-router)
- **版本号**：0.4.1（[固定提交 b5c056e](https://github.com/AngelosZou/dsh-github-router/tree/b5c056e1b50fb3446a153bae7ecf2d923f6f7923)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究身份分区缓存与对象/SHA/分页/截断来源清单，按换身份和错对象反例比较错误复用。当前未验证。详见[Q07](#research-q07)。

进一步从身份切换同URL、百文件分页、多JSON候选、镜像内容和不同ref并发探讨来源快照契约。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 856 | — | — | 7733 |
| .js | source | 26 | 4360 | 3591 | 580 | — |
| .mjs | source | 1 | 54 | 40 | 9 | — |
| .js | test | 11 | 1562 | 1378 | 109 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-github-router/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-github-router/issues?q=is%3Aissue+created%3A2026-09-22T05%3A23%3A40.793Z..2026-10-22T05%3A23%3A40.793Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-github-router/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A23%3A40.793Z..2026-10-22T05%3A23%3A40.793Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本多路由GitHub读取的贡献、身份授权、内容完整性与采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么在宿主提供GitHub只读路由？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向Agent在沙箱里因TLS/代理失败反复尝试shell命令、又需要读取PR、Issue与源码的开发者。合格结果应给请求对象的正文、代码及讨论，标注实际来源、截断和失败部分；不能把多路由返回内容等同同一时间完整仓库快照。README的价值主张是把网络故障重试收进工具内部，而非要求Agent自行升级权限。

简单替代是已有GitHub连接器、配置好的gh/API或人工提供固定源码。插件贡献是宿主多传输路线、按PR部分降级与结构化输出的组合，不是新GitHub协议或网络突破技术。gh/git/HTML各路线具备的信息不相同，route attribution比统一“成功”更有实际意义。README的无依赖与离线安装指没有新增运行时包，manifest仍列宿主peer依赖，不能理解为无宿主和无网络也能在线读GitHub。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-19](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/README.md#L5-L19)

作者提出五工具、多路由及上下文效率。

<details>
<summary>查看原文（15行）</summary>

```text
> Read-only GitHub access for a DeepSeek Harness project — load PRs, issues, files, and API data through tools that route internally (API, gh CLI, git protocol, page HTML, mirrors), so an agent never burns turns fighting shell-side TLS or proxy failures.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js >= 22.19](https://img.shields.io/badge/Node.js-%3E%3D22.19-brightgreen)](https://nodejs.org/)
[![npm version](https://img.shields.io/npm/v/dsh-github-router)](https://www.npmjs.com/package/dsh-github-router)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin bundle that gives agents GitHub reads without shell retries:

- **Five read-only tools** — `github_probe`, `github_pr`, `github_issue`, `github_file`, `github_api` — plus the `github-router` skill and a system-prompt guidance section. No write, push, comment, or mutation capability exists anywhere in the package.
- **In-tool routing** — every request runs host-side (outside the sandbox's TLS/proxy restrictions) and falls through a route ladder: `api.github.com` (direct → proxy) → `gh` CLI (read-only subcommands) → git protocol (plugin fetch cache, or a local clone read with log/diff/show only) → PR/issue page HTML (strict JSON island extraction) → user-configured raw mirrors.
- **One call, structured outcome** — PRs come back with metadata, discussion, reviews, commits, changed files, and the diff, each part annotated with the route that served it; failures return a route matrix instead of a dozen retried shell commands.
- **Connectivity probe** — `github_probe` reports which routes are live from the host in one call, with timings and a recommended route chain.
- **Zero runtime dependencies** — peers resolve from the DSH profile; proxied requests travel through the plugin's own CONNECT tunnel (no third-party HTTP stack), so the package installs fully offline.
- **Framework-declared settings page** — the plugin exports its `Config` schema, so DSH serves the `dsh-github-router` namespace to the browser and opening the plugin on **Plugins** page shows the page (secret token, proxy, route switches, cache TTLs, byte caps) with staged edits, override badges, and a write-only token control.
- **Context efficiency** — response caching with per-kind TTLs, byte caps everywhere, list caps with truncation notes, and rate-limit surfacing.
```

</details>

**依据 2 · 源码核查**：[lib/core/pr.js:125-138](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/core/pr.js#L125-L138)

各部分来源和已取得状态独立。

<details>
<summary>查看原文（14行）</summary>

```text
  const state = {
    pr: null,
    discussion: [],
    reviews: [],
    commits: [],
    files: [],
    diff: null,
    diffTruncated: false,
    routes: { meta: null, discussion: null, reviews: null, commits: null, files: null, diff: null },
    notes: [],
    // Which parts a route actually served. A successfully fetched empty
    // list is authoritative and must NOT trigger a fallback ladder — the
    // routes are failover, not fan-out (docs/design.md).
    fetched: { meta: false, discussion: false, reviews: false, commits: false, files: false, diff: false },
```

</details>

**依据 3 · 源码核查**：[package.json:67-71](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/package.json#L67-L71)

宿主peer依赖。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-credentials": "^0.1.7-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-tools": "^0.1.7-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/schemastery": "^3.18.4"
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从工具调用到不同读取路线如何衔接？

**研究主题**：功能与机制

#### 完整回答

入口装配动态settings options、一个Skill、guidance和五工具。buildRuntime每次构建API客户端、默认TTL磁盘缓存、凭据解析以及subprocess；token优先配置文字，再凭据服务，再进程环境，解析只在当次runtime按tokenEnv记忆。HTTP路线按direct/proxy阶梯尝试，ABORTED在这层立即抛出，其他失败保留为ROUTE_FAILED。

PR先API取元信息，再并行取所需列表/差异，并记录每部分来源，已成功得到的空列表不继续扇出。文件路线不同，为API contents、raw、可选mirror、最后Git，API文件返回blob SHA，raw/Git结果可仍用分支名ref。文件的raw请求不被routesApi关闭，并没有单独raw关闭项；github_api也直接调用API阶梯，不读取routes.api开关。开关应理解为部分聚合策略，不能当全局网络禁止策略。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:46-58](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/index.js#L46-L58)

入口注册面。

<details>
<summary>查看原文（13行）</summary>

```text
export const name = 'dsh-github-router'
export const inject = ['tools', 'subprocess', 'skills', 'systemPrompt']

export function apply(ctx, config = {}) {
  const options = installSettings(ctx, config).options

  registerSkill(ctx)
  registerGuidance(ctx)
  registerProbeTool(ctx, options)
  registerPrTool(ctx, options)
  registerIssueTool(ctx, options)
  registerFileTool(ctx, options)
  registerApiTool(ctx, options)
```

</details>

**依据 2 · 源码核查**：[lib/core/runtime.js:17-47](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/core/runtime.js#L17-L47)

每次构建及token解析。

<details>
<summary>查看原文（31行）</summary>

```text
export function buildRuntime(ctx, options) {
  const cache = new TtlCache()
  const api = new GithubApi({
    retries: options.retries,
    directTimeoutMs: options.directTimeoutMs,
    proxyTimeoutMs: options.proxyTimeoutMs,
    maxBytes: options.maxBytes,
  })
  const fetchImpl = (url, o) => fetchWithRetry(url, o)
  const credentials = ctx.get('credentials')
  const tokenMemo = new Map()
  const resolveToken = () => {
    const literal = options.token
    if (literal !== undefined && literal.length > 0) return Promise.resolve(literal)
    const envName = options.tokenEnv
    const hit = tokenMemo.get(envName)
    if (hit !== undefined) return hit
    const promise = (async () => {
      if (credentials !== undefined && typeof credentials.resolve === 'function') {
        try {
          const resolved = await credentials.resolve(credentialRef(envName))
          if (resolved && typeof resolved.value === 'string' && resolved.value.length > 0) return resolved.value
        } catch { /* fall through to env */ }
      }
      const env = process.env[envName]
      return typeof env === 'string' && env.length > 0 ? env : undefined
    })()
    tokenMemo.set(envName, promise)
    return promise
  }
  return { cache, api, fetchImpl, resolveToken, subprocess: ctx.get('subprocess'), options }
```

</details>

**依据 3 · 源码核查**：[lib/core/runtime.js:56-79](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/core/runtime.js#L56-L79)

阶梯和中止处理。

<details>
<summary>查看原文（24行）</summary>

```text
export async function attemptLadder(fn, options, spec = {}) {
  const proxy = effectiveProxy(options)
  const proxyFirst = spec.proxyFirst === true
  const attempts = []
  if (proxyFirst) {
    if (proxy !== undefined) attempts.push(['proxy', proxy])
    attempts.push(['direct', undefined])
  } else {
    attempts.push(['direct', undefined])
    if (proxy !== undefined) attempts.push(['proxy', proxy])
  }
  const errors = []
  for (const [label, proxyUrl] of attempts) {
    try {
      return { value: await fn(proxyUrl), via: label }
    } catch (error) {
      if (error && error.code === 'ABORTED') throw error
      errors.push(`${label}: ${String(error && error.code ? error.code + ' — ' : '')}${String(error && error.message ? error.message : error)}`)
    }
  }
  const err = new Error(errors.join(' | ').slice(0, 600))
  err.code = 'ROUTE_FAILED'
  err.attempts = errors
  throw err
```

</details>

**依据 4 · 源码核查**：[lib/core/pr.js:167-190](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/core/pr.js#L167-L190)

列表并行填充。

<details>
<summary>查看原文（24行）</summary>

```text
  if (state.pr !== null) {
    const apiGet = (path, query, ttl) =>
      attemptLadder(
        (proxy) => api.getJson(path, { token, signal, proxy, cache, ttlMs: ttl, forceRefresh, fetchImpl, query }),
        options,
      )
    const settle = []
    if (include.files) {
      settle.push(
        (async () => {
          try {
            const out = await apiGet(`/repos/${owner}/${repo}/pulls/${number}/files`, { per_page: 100 }, options.cacheTtlSeconds.content)
            state.files = capItems(
              (Array.isArray(out.value) ? out.value : []).map((f) => ({ path: f.filename ?? null, status: f.status ?? null, additions: f.additions ?? 0, deletions: f.deletions ?? 0 })),
              maxItems,
              state.notes,
              'files',
            )
            state.routes.files = 'api'
            state.fetched.files = true
          } catch (error) {
            state.notes.push(`api files: ${String(error && error.message ? error.message : error).slice(0, 180)}`)
          }
        })(),
```

</details>

**依据 5 · 源码核查**：[lib/core/file.js:80-120](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/core/file.js#L80-L120)

raw与mirror顺序。

<details>
<summary>查看原文（41行）</summary>

```text
  // ------------------------------------------------------- 2) raw/mirror routes
  if (result === null) {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`
    try {
      const attempt = await attemptLadder(
        (proxy) =>
          fetchText(rawUrl, {
            headers: { accept: 'text/plain', 'user-agent': 'dsh-github-router/0.1.0' },
            timeoutMs: proxy !== undefined ? options.proxyTimeoutMs : options.directTimeoutMs,
            proxy,
            signal,
            maxBytes,
            retries: 0,
          }),
        options,
      )
      if (attempt.value.ok) {
        result = { kind: 'file', path, ref, content: attempt.value.text, size: attempt.value.body.length, truncated: attempt.value.truncated, route: attempt.via === 'proxy' ? 'raw-proxy' : 'raw', notes }
      } else {
        failures.push(`raw: HTTP ${attempt.value.status}`)
      }
    } catch (error) {
      failures.push(`raw: ${String(error && error.message ? error.message : error).slice(0, 200)}`)
    }
  }

  if (result === null && options.routes.mirror && options.mirrors.length > 0) {
    try {
      const via = await fetchViaMirrors(owner, repo, ref, path, options.mirrors, {
        timeoutMs: options.directTimeoutMs,
        signal,
        maxBytes,
      })
      result = { kind: 'file', path, ref, content: via.content, size: via.size, truncated: via.truncated, route: 'mirror', notes }
    } catch (error) {
      failures.push(`mirror: ${String(error && error.message ? error.message : error).slice(0, 200)}`)
    }
  }

  // ------------------------------------------------------------ 3) git route
  if (result === null && options.routes.git && subprocess !== undefined) {
```

</details>

**依据 6 · 源码核查**：[lib/tools/api.js:54-73](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/tools/api.js#L54-L73)

API专用工具不检查路由开关。

<details>
<summary>查看原文（20行）</summary>

```text
      async execute(args, exec) {
        try {
          const path = guardApiPath(args && args.path)
          const query = sanitizeQuery(args && args.query)
          const runtime = buildRuntime(ctx, options())
          const token = await runtime.resolveToken()
          const attempt = await attemptLadder(
            (proxy) =>
              runtime.api.getJson(path, {
                token,
                signal: exec && exec.signal,
                proxy,
                cache: runtime.cache,
                ttlMs: options().cacheTtlSeconds.meta,
                forceRefresh: args && args.forceRefresh === true,
                fetchImpl: runtime.fetchImpl,
                query,
              }),
            options(),
          )
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 宿主、凭据和本地Git边界是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要Node>=22.19及匹配dsh-tools、credentials、cordis、schemastery；入口必须得到tools/subprocess/skills/systemPrompt。settings通过Config的volatile字段与configure(auto:false)接到框架，token标为secret、tokenEnv标为credential-ref；浏览器表单与服务端secret持久化最终依赖相同宿主契约，源码声明不等于完整宿主泄密审计。

gh路线使用固定argv读取并继承环境，走其已有认证，不自动等同插件token身份。Git新fetch只写插件默认存储目录或用户配置gitCacheDir，本地仓库候选由localRepo、repos和session cwd提供，通过origin URL匹配owner/repo后读取，并没有工作区根包含校验。因localRepo是模型可给的路径，不能把“origin匹配”当用户明确授权或只读工作区许可。用户需限制宿主可见文件/身份，不能仅依“没有push”推导无私有数据越权。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:64-71](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/package.json#L64-L71)

Node和peer要求。

```text
  "engines": {
    "node": ">=22.19.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-credentials": "^0.1.7-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-tools": "^0.1.7-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/schemastery": "^3.18.4"
```

**依据 2 · 源码核查**：[lib/config.js:38-66](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/config.js#L38-L66)

secret、volatile、路由和本地repo配置。

<details>
<summary>查看原文（29行）</summary>

```text
export const Config = z.object({
  /** Literal GitHub token (redacted on wire). Prefer tokenEnv. */
  token: z.string().role('secret').volatile(),
  /** Environment variable / credential ref naming the token. */
  tokenEnv: z.string().role('credential-ref').default('GITHUB_TOKEN').volatile(),
  /** Proxy URL for proxy routes. '' = inherit ambient proxy env; 'direct' = never proxy. */
  proxy: z.string().default('').volatile(),
  directTimeoutMs: z.number().min(1000).max(60000).default(8000).volatile(),
  proxyTimeoutMs: z.number().min(1000).max(60000).default(15000).volatile(),
  /** Retries for idempotent GETs on 429/5xx. */
  retries: z.number().min(0).max(3).default(1).volatile(),
  routesApi: z.boolean().default(true).volatile(),
  routesGh: z.boolean().default(true).volatile(),
  routesGit: z.boolean().default(true).volatile(),
  routesHtml: z.boolean().default(true).volatile(),
  /** Raw-content mirrors: OFF by default — the user must opt in. */
  routesMirror: z.boolean().default(false).volatile(),
  /** Raw-content mirror base URLs, e.g. ["https://ghproxy.net"]. Empty = none. */
  mirrors: z.array(z.string()).default([]).volatile(),
  /** PR/issue metadata cache TTL. */
  cacheTtlMeta: z.number().min(0).default(300).volatile(),
  /** Immutable-ish content (files, commits, diffs at a sha) cache TTL. */
  cacheTtlContent: z.number().min(0).default(86400).volatile(),
  /** Cap for every response body read by this plugin, in bytes. */
  maxBytes: z.number().min(16384).max(8388608).default(1048576).volatile(),
  /** Local repo paths granted for read-only git-route reads (log/diff/show only). */
  repos: z.array(z.string()).default([]).volatile(),
  /** Plugin-owned git fetch cache dir. '' = <DSH_HOME>/storages/dsh-github-router/git. */
  gitCacheDir: z.string().default('').volatile(),
```

</details>

**依据 3 · 源码核查**：[lib/settings.js:30-40](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/settings.js#L30-L40)

framework settings接线。

<details>
<summary>查看原文（11行）</summary>

```text
export function installSettings(ctx, config) {
  ctx.inject(['settings'], (sctx) => {
    sctx.effect(
      () => sctx.settings.configure({ auto: false }, ctx.fiber),
      'dsh-github-router: settings presentation',
    )
  })

  return {
    options: () => resolveOptions(liveSection(config)),
  }
```

</details>

**依据 4 · 源码核查**：[lib/routes/git.js:199-228](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/git.js#L199-L228)

候选本地路径与origin相等判定。

<details>
<summary>查看原文（30行）</summary>

```text
/** The session/local repo the git route may READ, or null. */
export async function findLocalRepo(subprocess, cwd, owner, repo, extraRepos, localRepo) {
  const candidates = []
  if (typeof localRepo === 'string' && localRepo.trim().length > 0) candidates.push(localRepo.trim())
  for (const r of extraRepos ?? []) candidates.push(r)
  if (typeof cwd === 'string' && cwd.length > 0) candidates.push(cwd)
  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null) continue
    const rootOut = await runCaptured(subprocess, {
      argv: ['git', '-C', candidate, 'rev-parse', '--show-toplevel'],
      graceMs: 10_000,
      env: childEnv(),
      maxStdout: 8192,
      maxStderr: 8192,
    })
    if (!rootOut.ok) continue
    const root = rootOut.stdout.text.trim().replace(/\/+$/, '')
    if (root.length === 0) continue
    const urlOut = await runCaptured(subprocess, {
      argv: ['git', '-C', root, 'config', '--get', 'remote.origin.url'],
      graceMs: 10_000,
      env: childEnv(),
      maxStdout: 8192,
      maxStderr: 8192,
    })
    if (!urlOut.ok) continue
    const parsed = ownerRepoFromUrl(urlOut.stdout.text)
    if (parsed !== null && parsed.owner.toLowerCase() === owner.toLowerCase() && parsed.repo.toLowerCase() === repo.toLowerCase()) {
      return root
    }
```

</details>

**依据 5 · 源码核查**：[lib/routes/gh.js:29-36](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/gh.js#L29-L36)

gh读取使用继承环境。

```text
async function ghJson(subprocess, argv, spec = {}) {
  const out = await runCaptured(subprocess, {
    argv,
    graceMs: spec.graceMs ?? 30_000,
    signal: spec.signal,
    env: childEnv(),
    maxStdout: spec.maxStdout ?? 1048576,
    maxStderr: 262144,
```

#### 缺口

- 同DSH_HOME多用户/多profile的存储与凭据隔离契约不在目标插件内闭合
  **影响**：不能认为私有响应缓存或本地读取按用户授权隔离
  **进一步探讨**：阅读对应宿主存储/文件授权边界，单独身份配置与目录隔离

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 只读与缓存为什么仍存在实质风险？

**研究主题**：缺陷与关键质疑

#### 完整回答

HTTP/API调用构造GET、输入guard与argv数组减少写接口和shell插值，HTML只JSON.parse不执行脚本，这些边界有源码支撑。但只读不等内容授权隔离。TTL缓存键只SHA1(URL)，目录默认共享DSH_HOME；API在网络请求前直接读取url缓存，未把token主体纳入键也未重验权限。在同目录凭据更换、移除或用户切换条件下，仍可能取得之前身份的私有响应。缓存JSON还明文保存正文，TTL不是加密或主体清除机制。

另有内容完整性限制。PR文件/commits请求per_page=100未见分页续取，最多展示项不等完整页数，不能做全仓覆盖声明。HTML提取所有application/json脚本，而非只认react-app.embeddedData，随后按PR形状、pullRequest键及标题长度挑候选，若页面含多个对象可能选错；严格JSON解析只证明不执行JS，不保证对象身份和内容真实。mirror接受HTTP(S)并以首个成功响应为内容，缺少与官方SHA内容核验。固定分支缓存默认一天也可能陈旧。

#### 证据与依据

**依据 1 · 源码核查**：[lib/cache.js:12-23](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/cache.js#L12-L23)

默认目录和URL哈希键。

<details>
<summary>查看原文（12行）</summary>

```text
export class TtlCache {
  constructor(dir = CACHE_DIR) {
    this.dir = dir
    this.mem = new Map()
  }

  keyFor(url) {
    return sha1(String(url))
  }

  fileFor(key) {
    return join(this.dir, key + '.json')
```

</details>

**依据 2 · 源码核查**：[lib/cache.js:55-64](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/cache.js#L55-L64)

明文JSON落盘。

<details>
<summary>查看原文（10行）</summary>

```text
  set(url, value, ttlMs, now = Date.now()) {
    if (!(ttlMs > 0)) return
    const key = this.keyFor(url)
    this.mem.set(key, { value, expiresAt: now + ttlMs })
    const file = this.fileFor(key)
    const tmp = file + '.tmp'
    try {
      mkdirSync(this.dir, { recursive: true })
      writeFileSync(tmp, JSON.stringify({ v: 1, ts: now, ttlMs, value }), 'utf8')
      renameSync(tmp, file)
```

</details>

**依据 3 · 源码核查**：[lib/routes/api.js:109-117](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/api.js#L109-L117)

先缓存命中无需身份重验。

```text
    if (cache !== undefined && ttlMs > 0 && !forceRefresh) {
      const hit = cache.get(url, ttlMs)
      if (hit !== undefined) return withMeta(hit.json, hit)
    }
    const fresh = await fetcher()
    if (cache !== undefined && ttlMs > 0 && fresh.ok) {
      cache.set(url, { json: fresh.json, headers: fresh.headers, status: fresh.status }, ttlMs)
    }
    return withMeta(fresh.json, fresh)
```

**依据 4 · 源码核查**：[lib/core/pr.js:174-210](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/core/pr.js#L174-L210)

单页文件和commits。

<details>
<summary>查看原文（37行）</summary>

```text
    if (include.files) {
      settle.push(
        (async () => {
          try {
            const out = await apiGet(`/repos/${owner}/${repo}/pulls/${number}/files`, { per_page: 100 }, options.cacheTtlSeconds.content)
            state.files = capItems(
              (Array.isArray(out.value) ? out.value : []).map((f) => ({ path: f.filename ?? null, status: f.status ?? null, additions: f.additions ?? 0, deletions: f.deletions ?? 0 })),
              maxItems,
              state.notes,
              'files',
            )
            state.routes.files = 'api'
            state.fetched.files = true
          } catch (error) {
            state.notes.push(`api files: ${String(error && error.message ? error.message : error).slice(0, 180)}`)
          }
        })(),
      )
    }
    if (include.commits) {
      settle.push(
        (async () => {
          try {
            const out = await apiGet(`/repos/${owner}/${repo}/pulls/${number}/commits`, { per_page: 100 }, options.cacheTtlSeconds.content)
            state.commits = capItems(
              (Array.isArray(out.value) ? out.value : []).map((c) => ({
                sha: c.sha ?? null,
                author: c.author && c.author.login ? c.author.login : c.commit && c.commit.author ? c.commit.author.name : null,
                date: c.commit && c.commit.author ? c.commit.author.date : null,
                message: truncateText(c.commit ? c.commit.message ?? '' : '', 2000).text,
              })),
              maxItems,
              state.notes,
              'commits',
            )
            state.routes.commits = 'api'
            state.fetched.commits = true
```

</details>

**依据 5 · 源码核查**：[lib/routes/html.js:23-38](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/html.js#L23-L38)

所有application/json解析。

<details>
<summary>查看原文（16行）</summary>

```text
/** Pull every application/json script island out of a GitHub HTML page. */
export function extractEmbeddedData(html) {
  const out = []
  const source = String(html ?? '').slice(0, MAX_ISLAND_BYTES)
  SCRIPT_RE.lastIndex = 0
  let match
  while ((match = SCRIPT_RE.exec(source)) !== null) {
    const attrs = match[1]
    const body = match[2]
    if (!/type\s*=\s*["']application\/json["']/i.test(attrs)) continue
    try {
      const parsed = JSON.parse(body)
      out.push(parsed)
    } catch { /* not a valid JSON island — skip, never evaluate */ }
  }
  return out
```

</details>

**依据 6 · 源码核查**：[lib/routes/html.js:122-138](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/html.js#L122-L138)

候选启发挑选。

<details>
<summary>查看原文（17行）</summary>

```text
/** Find the best PR-shaped node across all embedded JSON payloads. */
export function prFromPayloads(objects) {
  const candidates = []
  for (const obj of objects) {
    for (const { key, value } of walkJson(obj, (k, v) => isPrLike(v))) {
      candidates.push({ key, value })
    }
  }
  if (candidates.length === 0) return null
  // Prefer nodes reachable under a `pullRequest` key; then the richest shape.
  candidates.sort((a, b) => {
    const ak = a.key === 'pullRequest' ? 0 : 1
    const bk = b.key === 'pullRequest' ? 0 : 1
    if (ak !== bk) return ak - bk
    return b.value.title.length - a.value.title.length
  })
  const pr = candidates[0].value
```

</details>

**依据 7 · 源码核查**：[lib/routes/mirror.js:20-45](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/mirror.js#L20-L45)

镜像HTTP(S)及首个ok返回。

<details>
<summary>查看原文（26行）</summary>

```text
export function mirrorCandidates(owner, repo, ref, path, mirrors) {
  const out = []
  const raw = rawUrl(owner, repo, ref, path)
  const viaGithub = githubRawRouteUrl(owner, repo, ref, path)
  for (const mirror of mirrors ?? []) {
    const base = String(mirror).replace(/\/+$/, '')
    if (base.length === 0 || !/^https?:\/\//.test(base)) continue
    out.push(`${base}/${raw}`)
    out.push(`${base}/${viaGithub}`)
  }
  return out
}

/** Try each mirror candidate in order; returns the first usable body. */
export async function fetchViaMirrors(owner, repo, ref, path, mirrors, call) {
  const errors = []
  for (const url of mirrorCandidates(owner, repo, ref, path, mirrors)) {
    try {
      const raw = await fetchText(url, {
        headers: { accept: 'text/plain', 'user-agent': 'dsh-github-router/0.1.0' },
        timeoutMs: call.timeoutMs,
        signal: call.signal,
        maxBytes: call.maxBytes,
        retries: 0,
      })
      if (raw.ok) return { content: raw.text, truncated: raw.truncated, url, size: raw.body.length }
```

</details>

**依据 8 · 源码核查**：[lib/config.js:58-60](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/config.js#L58-L60)

内容TTL默认86400。

```text
  cacheTtlMeta: z.number().min(0).default(300).volatile(),
  /** Immutable-ish content (files, commits, diffs at a sha) cache TTL. */
  cacheTtlContent: z.number().min(0).default(86400).volatile(),
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程拆分和测试能支持哪些判断？

**研究主题**：工程质量与复用

#### 完整回答

入口、core聚合、route、HTTP隧道、缓存与展示分模块，可单独检查输入guard和传输实现；文件、API与PR独立路线也使行为差异必须按入口核对。TtlCache测试覆盖读写、过期、损坏与不同URL，不能据此认为已经验证主体隔离。固定.tmp文件配rename提供单写原子替换，但同键跨进程并发没有唯一tmp名，失败会吞掉；读到坏缓存当miss不会证明磁盘清理完毕，drop(key)又对传入hash再次hash，坏文件可能残留。

Git注释称per-cache-repo锁，实际键含PR号或ref，同仓不同ref仍可并发fetch并写共享FETCH_HEAD；锁只包fetch，不包后续读取，这限制快照一致性。HTTP readBody在声明Content-Length不大于cap时直接arrayBuffer，不在读取后重新限长；byte cap保证在这条路径依赖上游响应声明。重试等待使用普通setTimeout，取消期间最长等待Retry-After允许的120秒，工具超时与底层工作停止需要区分。上述是静态机制判断，未执行漏洞复现。

#### 证据与依据

**依据 1 · 源码核查**：[test/cache-mirror.test.js:9-35](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/test/cache-mirror.test.js#L9-L35)

缓存测试范围。

<details>
<summary>查看原文（27行）</summary>

```text
describe('TtlCache', () => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-github-router-test-'))
  const cache = new TtlCache(dir)

  it('round-trips values', () => {
    cache.set('https://example.com/a', { json: [1, 2] }, 60_000)
    const hit = cache.get('https://example.com/a', 60_000)
    assert.deepEqual(hit, { json: [1, 2] })
  })

  it('expires entries', () => {
    cache.set('https://example.com/b', { x: 1 }, 1000, Date.now() - 2000)
    assert.equal(cache.get('https://example.com/b', 1000), undefined)
  })

  it('treats corrupted files as misses', () => {
    const key = cache.keyFor('https://example.com/c')
    writeFileSync(join(dir, key + '.json'), '{{{not json', 'utf8')
    assert.equal(cache.get('https://example.com/c', 60_000), undefined)
  })

  it('distinguishes URLs by canonical string', () => {
    cache.set('https://example.com/a?ref=1', { v: 1 }, 60_000)
    cache.set('https://example.com/a?ref=2', { v: 2 }, 60_000)
    assert.deepEqual(cache.get('https://example.com/a?ref=1', 60_000), { v: 1 })
    assert.deepEqual(cache.get('https://example.com/a?ref=2', 60_000), { v: 2 })
  })
```

</details>

**依据 2 · 源码核查**：[lib/cache.js:37-73](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/cache.js#L37-L73)

坏缓存清理调用和固定tmp。

<details>
<summary>查看原文（37行）</summary>

```text
    try {
      const entry = JSON.parse(readFileSync(file, 'utf8'))
      if (entry === null || typeof entry !== 'object' || !Number.isFinite(entry.ts) || entry.v !== 1) {
        this.drop(key)
        return undefined
      }
      if (entry.ts + (Number.isFinite(entry.ttlMs) ? entry.ttlMs : 0) <= now) {
        this.drop(key)
        return undefined
      }
      this.mem.set(key, { value: entry.value, expiresAt: entry.ts + entry.ttlMs })
      return entry.value
    } catch {
      this.drop(key)
      return undefined
    }
  }

  set(url, value, ttlMs, now = Date.now()) {
    if (!(ttlMs > 0)) return
    const key = this.keyFor(url)
    this.mem.set(key, { value, expiresAt: now + ttlMs })
    const file = this.fileFor(key)
    const tmp = file + '.tmp'
    try {
      mkdirSync(this.dir, { recursive: true })
      writeFileSync(tmp, JSON.stringify({ v: 1, ts: now, ttlMs, value }), 'utf8')
      renameSync(tmp, file)
    } catch {
      try { unlinkSync(tmp) } catch { /* best effort */ }
    }
  }

  drop(url) {
    const key = this.keyFor(url)
    this.mem.delete(key)
    try { unlinkSync(this.fileFor(key)) } catch { /* already gone */ }
```

</details>

**依据 3 · 源码核查**：[lib/routes/git.js:49-59](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/git.js#L49-L59)

锁实现。

<details>
<summary>查看原文（11行）</summary>

```text
/** In-process mutex per cache repo: fetches to one repo are serialized. */
const repoLocks = new Map()
async function withRepoLock(key, fn) {
  const prev = repoLocks.get(key) ?? Promise.resolve()
  const next = prev.then(fn, fn)
  repoLocks.set(key, next.catch(() => {}))
  try {
    return await next
  } finally {
    if (repoLocks.get(key) === next) repoLocks.delete(key)
  }
```

</details>

**依据 4 · 源码核查**：[lib/routes/git.js:113-144](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/git.js#L113-L144)

锁键含不同PR/ref。

<details>
<summary>查看原文（32行）</summary>

```text
  async fetchPr(owner, repo, number, spec = {}) {
    return withRepoLock(`${owner}/${repo}#${number}`, async () => {
      const dir = await this.ensure(owner, repo)
      const env = childEnv(proxyEnv(spec.proxy))
      const head = await runCaptured(this.subprocess, {
        argv: ['git', '-C', dir, 'fetch', '--quiet', '--no-tags', '--depth=64', 'origin', `refs/pull/${number}/head:refs/pr/${number}/head`],
        graceMs: spec.graceMs ?? FETCH_GRACE_MS,
        signal: spec.signal,
        env,
        maxStdout: 8192,
        maxStderr: 16384,
      })
      const merge = await runCaptured(this.subprocess, {
        argv: ['git', '-C', dir, 'fetch', '--quiet', '--no-tags', '--depth=64', 'origin', `refs/pull/${number}/merge:refs/pr/${number}/merge`],
        graceMs: spec.graceMs ?? FETCH_GRACE_MS,
        signal: spec.signal,
        env,
        maxStdout: 8192,
        maxStderr: 16384,
      })
      if (!head.ok) {
        throw new Error(`git fetch failed: ${(head.stderr.text || head.spawnError || `exit ${head.exitCode}`).slice(0, 400)}`)
      }
      return { dir, mergeFetched: merge.ok, mergeError: merge.ok ? null : merge.stderr.text.slice(0, 300) }
    })
  }

  async fetchRef(owner, repo, ref, spec = {}) {
    return withRepoLock(`${owner}/${repo}@${ref}`, async () => {
      const dir = await this.ensure(owner, repo)
      const out = await runCaptured(this.subprocess, {
        argv: ['git', '-C', dir, 'fetch', '--quiet', '--no-tags', '--depth=1', 'origin', `+refs/heads/${ref}:refs/gh-router/${ref}`],
```

</details>

**依据 5 · 源码核查**：[lib/net.js:45-64](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/net.js#L45-L64)

信任Content-Length分支。

<details>
<summary>查看原文（20行）</summary>

```text
async function readBody(response, maxBytes) {
  const declared = Number(response.headers.get('content-length') || '0')
  if (declared > 0 && declared <= maxBytes) {
    const buf = Buffer.from(await response.arrayBuffer())
    return { data: buf, truncated: false }
  }
  const reader = response.body ? response.body.getReader() : null
  if (reader === null) return { data: Buffer.alloc(0), truncated: false }
  const chunks = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > maxBytes) {
        chunks.push(Buffer.from(value).subarray(0, maxBytes - (total - value.byteLength)))
        await reader.cancel().catch(() => {})
        return { data: Buffer.concat(chunks), truncated: true }
      }
```

</details>

**依据 6 · 源码核查**：[lib/net.js:165-194](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/net.js#L165-L194)

非signal等待及120秒Retry-After。

<details>
<summary>查看原文（30行）</summary>

```text
export async function fetchWithRetry(url, options) {
  const { retries = 0, onAttempt } = options
  let attempt = 0
  for (;;) {
    try {
      const result = await fetchOnce(url, options)
      if (onAttempt !== undefined) onAttempt('ok', result.status, attempt)
      if (result.ok || !isRetryableStatus(result.status) || attempt >= retries) return result
      const waitMs = retryDelayMs(result.headers['retry-after'], attempt)
      if (onAttempt !== undefined) onAttempt('retry', result.status, attempt)
      await new Promise((resolve) => setTimeout(resolve, waitMs))
      attempt += 1
    } catch (error) {
      if (error instanceof RouteError && (error.code === 'TIMEOUT' || error.code === 'TRANSPORT') && attempt < retries) {
        if (onAttempt !== undefined) onAttempt('retry', error.code, attempt)
        await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt))
        attempt += 1
      } else {
        throw error
      }
    }
  }
}

function retryDelayMs(retryAfter, attempt) {
  if (typeof retryAfter === 'string' && /^\d+$/.test(retryAfter)) {
    const seconds = Number(retryAfter)
    if (Number.isFinite(seconds) && seconds >= 0 && seconds <= 120) return seconds * 1000
  }
  return Math.min(5000, 500 * 2 ** attempt)
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本怎样判断？

**研究主题**：效果与总成本

#### 完整回答

首次成本是安装匹配宿主、选凭据身份、代理和gh/git，以及明确缓存目录和私有数据存储策略。无新增独立服务费，但GitHub额度、网络、Agent模型上下文与磁盘是持续资源；API优先、TTL和列表/字节cap机制可能减少重复取数，不代表已有量化节费。多路线最坏会累加direct/proxy超时、重试和Git fetch的90秒grace；PR各部分并发不能消除降级尾延迟。

持续还需确认ref是否固定、route和截断，遇到数据差异应使用固定SHA并比较官方来源，不要盲目forceRefresh放行私有缓存。失败恢复包括停用错误路线、清理/隔离旧身份缓存、重新认证、人工判断缺失分页与HTML候选；Git缓存初始化与fetch会写本地持久状态，重试不是完全无状态读。性能改善、请求数和修复工时没有同任务对照，未知不能填成节省百分比。

#### 证据与依据

**依据 1 · 源码核查**：[lib/config.js:45-66](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/config.js#L45-L66)

超时、重试、TTL及缓存配置。

<details>
<summary>查看原文（22行）</summary>

```text
  directTimeoutMs: z.number().min(1000).max(60000).default(8000).volatile(),
  proxyTimeoutMs: z.number().min(1000).max(60000).default(15000).volatile(),
  /** Retries for idempotent GETs on 429/5xx. */
  retries: z.number().min(0).max(3).default(1).volatile(),
  routesApi: z.boolean().default(true).volatile(),
  routesGh: z.boolean().default(true).volatile(),
  routesGit: z.boolean().default(true).volatile(),
  routesHtml: z.boolean().default(true).volatile(),
  /** Raw-content mirrors: OFF by default — the user must opt in. */
  routesMirror: z.boolean().default(false).volatile(),
  /** Raw-content mirror base URLs, e.g. ["https://ghproxy.net"]. Empty = none. */
  mirrors: z.array(z.string()).default([]).volatile(),
  /** PR/issue metadata cache TTL. */
  cacheTtlMeta: z.number().min(0).default(300).volatile(),
  /** Immutable-ish content (files, commits, diffs at a sha) cache TTL. */
  cacheTtlContent: z.number().min(0).default(86400).volatile(),
  /** Cap for every response body read by this plugin, in bytes. */
  maxBytes: z.number().min(16384).max(8388608).default(1048576).volatile(),
  /** Local repo paths granted for read-only git-route reads (log/diff/show only). */
  repos: z.array(z.string()).default([]).volatile(),
  /** Plugin-owned git fetch cache dir. '' = <DSH_HOME>/storages/dsh-github-router/git. */
  gitCacheDir: z.string().default('').volatile(),
```

</details>

**依据 2 · 源码核查**：[lib/routes/git.js:20-21](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/git.js#L20-L21)

fetch/read预算。

```text
const FETCH_GRACE_MS = 90_000
const READ_GRACE_MS = 20_000
```

**依据 3 · 源码核查**：[lib/routes/git.js:76-106](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/git.js#L76-L106)

init与remote持久化。

<details>
<summary>查看原文（31行）</summary>

```text
  async ensure(owner, repo) {
    const dir = this.repoDir(owner, repo)
    if (existsSync(join(dir, '.git'))) return dir
    try { mkdirSync(this.gitDir, { recursive: true }) } catch { /* exists */ }
    const init = await runCaptured(this.subprocess, {
      argv: ['git', 'init', '--quiet', dir],
      graceMs: 15_000,
      env: childEnv(),
      maxStdout: 8192,
      maxStderr: 8192,
    })
    if (!init.ok) throw new Error(`git init failed: ${init.stderr.text.slice(0, 300)}`)
    const add = await runCaptured(this.subprocess, {
      argv: ['git', '-C', dir, 'remote', 'add', 'origin', `https://github.com/${owner}/${repo}.git`],
      graceMs: 15_000,
      env: childEnv(),
      maxStdout: 8192,
      maxStderr: 8192,
    })
    if (!add.ok) {
      // A race with another process: recover with set-url.
      const set = await runCaptured(this.subprocess, {
        argv: ['git', '-C', dir, 'remote', 'set-url', 'origin', `https://github.com/${owner}/${repo}.git`],
        graceMs: 15_000,
        env: childEnv(),
        maxStdout: 8192,
        maxStderr: 8192,
      })
      if (!set.ok) throw new Error(`git remote setup failed: ${set.stderr.text.slice(0, 300)}`)
    }
    return dir
```

</details>

**依据 4 · 源码核查**：[lib/core/file.js:67-72](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/core/file.js#L67-L72)

API内容SHA/超cap降级。

```text
      if (value && typeof value === 'object' && typeof value.content === 'string') {
        const size = value.size ?? Buffer.from(value.content, 'base64').length
        if (size <= maxBytes) {
          result = { kind: 'file', path, ref: value.sha ?? ref, content: decodeBase64(value.content), size, truncated: false, route: 'api', notes }
        } else {
          notes.push(`api contents: file is ${size} bytes (cap ${maxBytes}); falling through to raw/git routes`)
```

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 采用条件和后续探讨方向是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前建议先观察，关键原因是URL缓存未绑定主体、本地localRepo没有工作区授权闭合，以及多路线完整性/一致性不能仅由read-only主张保证。公共仓库、单用户隔离DSH_HOME、不传私密token、禁用镜像且固定SHA的小范围对照仍有研究价值，但不宜把它直接配置为共享私有仓库读取通道。停止条件包括换身份仍返回旧私有数据、跨工作区取数、对象号不一致、截断未被识别。

值得继续讨论身份分区缓存和逐部分来源快照清单，前者将凭据主体/授权版本与缓存失效绑定，后者将对象ID、commit、分页覆盖和截断统一收据；还可把route开关变成明确拒绝策略。基线为独立gh/API读取并手工核对，最小反例包含同URL身份切换、超过100文件、多个JSON候选、镜像篡改和不同ref并发。预期是减少错误复用而不是单纯提升成功率，目前未验证，不声称已有隔离和效果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/routes/api.js:109-117](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/api.js#L109-L117)

当前缓存身份边界。

```text
    if (cache !== undefined && ttlMs > 0 && !forceRefresh) {
      const hit = cache.get(url, ttlMs)
      if (hit !== undefined) return withMeta(hit.json, hit)
    }
    const fresh = await fetcher()
    if (cache !== undefined && ttlMs > 0 && fresh.ok) {
      cache.set(url, { json: fresh.json, headers: fresh.headers, status: fresh.status }, ttlMs)
    }
    return withMeta(fresh.json, fresh)
```

**依据 2 · 源码核查**：[lib/routes/git.js:199-228](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/routes/git.js#L199-L228)

当前本地授权判定。

<details>
<summary>查看原文（30行）</summary>

```text
/** The session/local repo the git route may READ, or null. */
export async function findLocalRepo(subprocess, cwd, owner, repo, extraRepos, localRepo) {
  const candidates = []
  if (typeof localRepo === 'string' && localRepo.trim().length > 0) candidates.push(localRepo.trim())
  for (const r of extraRepos ?? []) candidates.push(r)
  if (typeof cwd === 'string' && cwd.length > 0) candidates.push(cwd)
  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null) continue
    const rootOut = await runCaptured(subprocess, {
      argv: ['git', '-C', candidate, 'rev-parse', '--show-toplevel'],
      graceMs: 10_000,
      env: childEnv(),
      maxStdout: 8192,
      maxStderr: 8192,
    })
    if (!rootOut.ok) continue
    const root = rootOut.stdout.text.trim().replace(/\/+$/, '')
    if (root.length === 0) continue
    const urlOut = await runCaptured(subprocess, {
      argv: ['git', '-C', root, 'config', '--get', 'remote.origin.url'],
      graceMs: 10_000,
      env: childEnv(),
      maxStdout: 8192,
      maxStderr: 8192,
    })
    if (!urlOut.ok) continue
    const parsed = ownerRepoFromUrl(urlOut.stdout.text)
    if (parsed !== null && parsed.owner.toLowerCase() === owner.toLowerCase() && parsed.repo.toLowerCase() === repo.toLowerCase()) {
      return root
    }
```

</details>

**依据 3 · 源码核查**：[lib/core/pr.js:174-210](https://github.com/AngelosZou/dsh-github-router/blob/b5c056e1b50fb3446a153bae7ecf2d923f6f7923/lib/core/pr.js#L174-L210)

当前单页覆盖边界。

<details>
<summary>查看原文（37行）</summary>

```text
    if (include.files) {
      settle.push(
        (async () => {
          try {
            const out = await apiGet(`/repos/${owner}/${repo}/pulls/${number}/files`, { per_page: 100 }, options.cacheTtlSeconds.content)
            state.files = capItems(
              (Array.isArray(out.value) ? out.value : []).map((f) => ({ path: f.filename ?? null, status: f.status ?? null, additions: f.additions ?? 0, deletions: f.deletions ?? 0 })),
              maxItems,
              state.notes,
              'files',
            )
            state.routes.files = 'api'
            state.fetched.files = true
          } catch (error) {
            state.notes.push(`api files: ${String(error && error.message ? error.message : error).slice(0, 180)}`)
          }
        })(),
      )
    }
    if (include.commits) {
      settle.push(
        (async () => {
          try {
            const out = await apiGet(`/repos/${owner}/${repo}/pulls/${number}/commits`, { per_page: 100 }, options.cacheTtlSeconds.content)
            state.commits = capItems(
              (Array.isArray(out.value) ? out.value : []).map((c) => ({
                sha: c.sha ?? null,
                author: c.author && c.author.login ? c.author.login : c.commit && c.commit.author ? c.commit.author.name : null,
                date: c.commit && c.commit.author ? c.commit.author.date : null,
                message: truncateText(c.commit ? c.commit.message ?? '' : '', 2000).text,
              })),
              maxItems,
              state.notes,
              'commits',
            )
            state.routes.commits = 'api'
            state.fetched.commits = true
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
