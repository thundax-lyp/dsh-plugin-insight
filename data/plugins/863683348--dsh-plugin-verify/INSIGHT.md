# dsh-plugin-verify

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[5a70cbd](https://github.com/863683348/dsh-plugin-verify/tree/5a70cbdc230ee19bb4578e52440e18cc93153ee8)

<!-- BEGIN META -->
[![npm 30d 831](https://img.shields.io/static/v1?label=npm+30d&message=831&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-verify) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-verify)
<!-- END META -->

> **实现功能**：通过关键词行号、JSON/YAML检查、URL/npm/GitHub探测及有界批量输出，提供核查线索和元数据。

> **核心亮点**：统一文本定位和多类元数据入口并保留单项行号，非语义事实证明或安全审计。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：60%关键词就verified/high未校准，batch丢证据/静默截断，YAML仅词法且rawfetch缺Host网络围栏。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，六模式怎样得到结果？](#detail-section-11)
  - [Q02 · 增量和verified/confidence/覆盖关键边界是什么？](#detail-section-12)
  - [Q03 · 依赖、外发范围和读者流程是什么？](#detail-section-13)
  - [Q04 · 三阶段成本和效果怎么判断？](#detail-section-14)
  - [Q05 · 工程复用、分级证据收据假设与推荐结论？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：主张下结论/配置或插件元数据检查前定位材料，仍需读原文/标准解析和真实验收。

rg+标准JSON/YAML解析器和直接API可替代；整合也引入统一OK语义误读和截断维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| claim | 关键词/行号线索 | verified非语义支持 |
| config | JSON语法/YAML词法 | 非Schema/Host加载 |
| URL/npm/repo | 响应/元数据 | 非安全/兼容/上架合格 |
| batch | 有界池/等级表 | 50截断/丢逐项证据，等级非概率 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配tools/fs/systemPrompt/schema契约 | 必需 | 注册verify/工作区解析读取 | containment与fs语义依宿主，不由本包独证 |
| 原生fetch/AbortSignal.timeout | 网络模式必需 | URL/registry/GitHub GET | Host网络策略未通过受管seam统一 |
| 文件/外部目标读取授权 | 必需 | 搜索文本或外发URL/包名/仓库名 | “只读”仍有数据暴露和网络副作用 |
| 人工读证据/目标语义判断 | 必需 | 判断真实主张/配置/兼容 | verified/high不是证明 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定义 | 把主张/配置/可达性分别定判据 | 不用统一OK代替业务验收 |
| 限范围 | 选无敏感scope/允许访问目标 | 先单项再batch，不默认探内网 |
| 核证 | 阅读命中上下文/语法结果/HTTP实际字段 | 反证/版本/未知与未扫范围单列 |
| 恢复 | 区分请求失败/不存在/内容不成立 | 不因high或404直接安装/发布/断言 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 兼容宿主/网络，金额未知 | 明确证据语义与允许范围 | 未自动核目标真实业务效果 |
| 持续使用 | 文件遍历/全文读取、最多50任务/8并发网络 | 读原文/排反例、处理rate limit | 字符cap非读取内存cap，batch丢逐条证据 |
| 失败恢复 | 重查/缩scope/网络诊断 | 核截断/取消/失败而非补结论 | URL GET可能已触达外部目标 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 定位线索 | 关键词/行号/snippet | 语义支持/否定/数字因果 |
| 配置检查 | JSON语法与YAML括号引号扫描 | Schema/宿主加载/业务配置正确 |
| 元数据 | HTTP状态/包存在/仓库字段 | 内容可信、制品安全、投稿要求达标 |
| 批量 | 有界池/顺序表与规则等级 | 统计置信度或真实误判率 |

> **思考**：60%关键词就verified/high未校准，batch丢证据/静默截断，YAML仅词法且rawfetch缺Host网络围栏。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：统一文本定位和多类元数据入口并保留单项行号，非语义事实证明或安全审计。详见[Q01](#research-q01)与[Q02](#research-q02)。

统一文本定位和多类元数据入口并保留单项行号，非语义事实证明或安全审计。详见[Q01](#research-q01)与[Q02](#research-q02)。

纯逻辑与Host分离、regex转义、SDK文件读取、JSON深度限制、网络timeout、保序有界池和提示effect清理值得复用。问题是将不同证据语义压成OK/verified/high，读者容易越过实际保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

60%关键词就verified/high未校准，batch丢证据/静默截断，YAML仅词法且rawfetch缺Host网络围栏。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，作线索而非证实/安全通行证，先修证据语义/覆盖与网络范围再评估。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持关键词行号、语法检查与网络元数据的统一入口；verified/high是规则标签，未证明语义事实，batch还丢证据/覆盖。分级检查与完整覆盖收据尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/verify.js、lib/batch.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定三个lib完整主要分支，扫描/评分/语法/网络/batch/Host注册；未运行目标或扫描真实工作区，不认定当前端点兼容。
- 下一步：进一步探讨先用否定/同词/数字/YAML/超50/大文件/重定向/慢body夹具核证据与边界，再比较人工复核误差。

**分析版本**

- **仓库**：[863683348/dsh-plugin-verify](https://github.com/863683348/dsh-plugin-verify)
- **版本号**：1.1.2（[固定提交 5a70cbd](https://github.com/863683348/dsh-plugin-verify/tree/5a70cbdc230ee19bb4578e52440e18cc93153ee8)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨分级检查/覆盖收据，batch保完整来源/反证，语法/Schema/加载分开并核网络策略，资源/人工成本未验证。详见[Q05](#research-q05)。

进一步探讨先用否定/同词/数字/YAML/超50/大文件/重定向/慢body夹具核证据与边界，再比较人工复核误差。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 157 | — | — | 1278 |
| .js | source | 3 | 688 | 548 | 111 | — |
| .mjs | source | 1 | 117 | 103 | 7 | — |
| .mjs | test | 2 | 215 | 199 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-verify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-verify/issues?q=is%3Aissue+created%3A2026-09-22T07%3A24%3A59.900Z..2026-10-22T07%3A24%3A59.900Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-verify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A24%3A59.900Z..2026-10-22T07%3A24%3A59.900Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核文本/配置/网络元数据与batch规则等级，区分线索、语法、响应和真实语义保证。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，六模式怎样得到结果？

**研究主题：**场景与需求、功能与机制

#### 完整回答

面向想先找文件线索、看配置语法或探测URL/npm/GitHub元数据再下结论的DSH用户。输入action/target/scope或批量列表，输出summary、claim verdict/行号证据或网络字段。成功需按具体命题读支持/反证、按真实Schema检查配置，网络状态仅说明当次响应，不是内容可信/安全证明。

claim从中英文/数字抽最多12关键词，通过ctx.fs解析/遍历默认最多500文件，逐词子串命中，每词每文件最多5次，返回前20证据，覆盖>=60%称verified。config先看扩展名或开头[/{，JSON.parse+深度64或YAML词法烟检。URL原生fetch GET跟重定向，npm取latest manifest，repo取元信息和可选Link近似提交数。batch截最多50，默认4/最高8并发，保持输入顺序并按规则给confidence。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:107-141](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L107-L141)

claim扫描。

<details>
<summary>查看原文（35行）</summary>

```text
  async function runClaim(target, scopeSpec, exec, cwd) {
    const keywords = extractKeywords(target, { max: 12 });
    const rootSpec = scopeSpec || (cwd || ".");
    const rootTarget = await ctx.fs.resolve(rootSpec, cwd !== undefined ? { cwd, signal: exec.signal } : { signal: exec.signal });
    const files = await collectFiles(ctx.fs, rootTarget, { maxFiles: config.maxFiles }, exec.signal);
    const evidence = [];
    const stats = keywords.map((k) => ({ term: k.term, hits: 0 }));
    let filesScanned = 0;
    for (const f of files) {
      const content = await readTextCapped(ctx.fs, f.target, config.maxFileBytes, exec.signal);
      if (content === null) continue;
      filesScanned += 1;
      for (let ki = 0; ki < keywords.length; ki++) {
        const re = new RegExp(escapeRegExp(keywords[ki].term), "gi");
        let count = 0;
        let m;
        while ((m = re.exec(content)) !== null && count < 5) {
          count += 1;
          if (evidence.length < config.maxEvidence) {
            const lineNo = content.slice(0, m.index).split(/\r?\n/).length;
            const lineStart = content.lastIndexOf("\n", m.index - 1) + 1;
            const lineEnd = content.indexOf("\n", m.index);
            evidence.push({
              file: f.rel,
              line: lineNo,
              term: keywords[ki].term,
              snippet: content.slice(lineStart, lineEnd === -1 ? content.length : lineEnd).trim().slice(0, 160),
            });
          }
        }
        stats[ki].hits += count;
      }
    }
    const result = scoreClaim(stats);
    return { verdict: result.verdict, score: result.pct, summary: { found: result.foundCount, total: result.totalCount, pct: result.pct }, evidence, filesScanned };
```

</details>

**依据 2 · 源码核查**：[lib/verify.js:37-69](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L37-L69)

关键词/阈值。

<details>
<summary>查看原文（33行）</summary>

```text
export function extractKeywords(claim, opts = {}) {
  const { max = 12 } = opts;
  const out = [];
  const seen = new Set();
  const push = (term, kind) => {
    const t = term.trim().toLowerCase();
    if (t.length === 0 || seen.has(t)) return;
    seen.add(t);
    out.push({ term: t, kind });
  };
  const text = String(claim || "");
  for (const m of text.matchAll(CJK_RE)) push(m[0], "cjk");
  for (const m of text.matchAll(EN_RE)) {
    if (!EN_STOPWORDS.has(m[0].toLowerCase())) push(m[0], "en");
  }
  for (const m of text.matchAll(NUM_RE)) push(m[0], "num");
  return out.slice(0, max);
}

/**
 * Turn per-keyword evidence counts into a verdict.
 * @param {{term:string, hits:number}[]} keywordStats
 * @returns {{verdict:'verified'|'partial'|'unsupported', foundCount:number, totalCount:number, pct:number}}
 */
export function scoreClaim(keywordStats) {
  const total = keywordStats.length;
  const found = keywordStats.filter((k) => k.hits > 0).length;
  const pct = total === 0 ? 0 : Math.round((found / total) * 100);
  let verdict = "unsupported";
  if (total === 0) verdict = "unsupported";
  else if (pct >= 60) verdict = "verified";
  else if (pct >= 30) verdict = "partial";
  return { verdict, foundCount: found, totalCount: total, pct };
```

</details>

**依据 3 · 源码核查**：[lib/verify.js:80-137](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L80-L137)

JSON/YAML。

<details>
<summary>查看原文（58行）</summary>

```text
export function validateJson(text, { maxDepth = 64 } = {}) {
  try {
    const value = JSON.parse(text);
    let depth = 0;
    const walk = (v, d) => {
      if (d > depth) depth = d;
      if (d > maxDepth) throw new Error("depth exceeds " + maxDepth);
      if (v && typeof v === "object") {
        for (const k of Object.keys(v)) walk(v[k], d + 1);
      }
    };
    walk(value, 0);
    return { ok: true, kind: typeof value, depth };
  } catch (e) {
    return { ok: false, error: String(e && e.message || e) };
  }
}

/**
 * YAML structural smoke check (not a full parser): non-empty, balanced
 * brackets/quotes, reasonable indentation. Reports the limitation honestly.
 * @param {string} text
 * @returns {{ok:boolean, error?:string, note?:string, depth?:number}}
 */
export function validateYamlSmoke(text) {
  const t = String(text || "");
  if (t.trim().length === 0) return { ok: false, error: "empty document" };
  const stack = [];
  const pairs = { "(": ")", "[": "]", "{": "}" };
  let inSingle = false;
  let inDouble = false;
  let maxIndent = 0;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (inSingle) {
      if (ch === "'" && t[i - 1] !== "\\") inSingle = false;
      continue;
    }
    if (inDouble) {
      if (ch === "\"" && t[i - 1] !== "\\") inDouble = false;
      continue;
    }
    if (ch === "'") inSingle = true;
    else if (ch === "\"") inDouble = true;
    else if (pairs[ch]) stack.push(pairs[ch]);
    else if (ch === ")" || ch === "]" || ch === "}") {
      if (stack.pop() !== ch) return { ok: false, error: "unbalanced " + ch + " at char " + i };
    } else if (ch === "\n") {
      let indent = 0;
      let j = i + 1;
      while (j < t.length && t[j] === " ") { indent++; j++; }
      if (indent > maxIndent) maxIndent = indent;
    }
  }
  if (inSingle) return { ok: false, error: "unterminated single quote" };
  if (inDouble) return { ok: false, error: "unterminated double quote" };
  if (stack.length > 0) return { ok: false, error: "unclosed " + stack[stack.length - 1] };
  return { ok: true, depth: maxIndent, note: "structural smoke check only — not a full YAML parser" };
```

</details>

**依据 4 · 源码核查**：[lib/verify.js:148-158](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L148-L158)

GET。

<details>
<summary>查看原文（11行）</summary>

```text
export async function checkUrl(fetchImpl, url, opts = {}) {
  const { timeoutMs = 20000 } = opts;
  const started = Date.now();
  try {
    const res = await fetchImpl(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "User-Agent": "dsh-plugin-verify" },
    });
    return { ok: res.ok, status: res.status, finalUrl: res.url || url, timeMs: Date.now() - started };
```

</details>

**依据 5 · 源码核查**：[lib/verify.js:172-192](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L172-L192)

npm字段。

<details>
<summary>查看原文（21行）</summary>

```text
export async function checkNpmPackage(fetchImpl, name, opts = {}) {
  const { timeoutMs = 20000 } = opts;
  try {
    const res = await fetchImpl("https://registry.npmjs.org/" + encodeURIComponent(name), {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "User-Agent": "dsh-plugin-verify" },
    });
    if (res.status === 404) return { ok: true, exists: false, name };
    if (!res.ok) return { ok: false, error: "registry " + res.status };
    const meta = await res.json();
    const latest = meta["dist-tags"] && meta["dist-tags"].latest;
    const v = latest && meta.versions && meta.versions[latest];
    return {
      ok: true,
      exists: true,
      name: meta.name || name,
      latest,
      hasDshBundle: Boolean(v && v.dsh && v.dsh.bundle),
      publishedAt: meta.time && meta.time[latest],
      description: String(meta.description || "").slice(0, 200),
    };
```

</details>

**依据 6 · 源码核查**：[lib/verify.js:206-241](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L206-L241)

GitHub字段。

<details>
<summary>查看原文（36行）</summary>

```text
export async function checkGitHubRepo(fetchImpl, fullName, opts = {}) {
  const { token, timeoutMs = 20000 } = opts;
  const headers = { "User-Agent": "dsh-plugin-verify", Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = "Bearer " + token;
  try {
    const repo = await fetchImpl("https://api.github.com/repos/" + encodeURIComponent(fullName), { headers, signal: AbortSignal.timeout(timeoutMs) });
    if (repo.status === 404) return { ok: true, exists: false, fullName };
    if (!repo.ok) return { ok: false, error: "github " + repo.status };
    const meta = await repo.json();
    const createdAt = meta.created_at || null;
    const ageDays = createdAt ? Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000)) : null;
    const topics = meta.topics || [];
    const out = {
      ok: true,
      exists: true,
      fullName: meta.full_name || fullName,
      defaultBranch: meta.default_branch,
      createdAt,
      ageDays,
      pushedAt: meta.pushed_at,
      topics,
      hasDshTopic: topics.includes("dsh-plugin"),
      description: String(meta.description || "").slice(0, 200),
    };
    try {
      const commits = await fetchImpl("https://api.github.com/repos/" + encodeURIComponent(fullName) + "/commits?per_page=1", { headers, signal: AbortSignal.timeout(timeoutMs) });
      if (commits.ok) {
        const link = commits.headers.get("link") || "";
        const last = /<([^>]+)>;\s*rel="last"/.exec(link);
        if (last) {
          const page = /[?&]page=(\d+)/.exec(last[1]);
          if (page) out.commitCount = Number(page[1]);
        }
      }
    } catch { /* optional */ }
    return out;
```

</details>

**依据 7 · 源码核查**：[lib/batch.js:9-46](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/batch.js#L9-L46)

批量上限/池。

<details>
<summary>查看原文（38行）</summary>

```text
export const MAX_BATCH_TASKS = 50;

/** Normalize the batch input into an ordered task list. */
export function normalizeTasks({ claims = [], urls = [], packages = [], repos = [], configs = [] } = {}) {
  const asList = (v) => (Array.isArray(v) ? v : v === undefined || v === null ? [] : [v]);
  const tasks = [];
  const push = (kind, value) => {
    const text = String(value === undefined || value === null ? "" : value).trim();
    if (text.length === 0) return;
    tasks.push({ kind, value: text });
  };
  for (const v of asList(claims)) push("claim", v);
  for (const v of asList(configs)) push("config", v);
  for (const v of asList(urls)) push("url", v);
  for (const v of asList(packages)) push("npm", v);
  for (const v of asList(repos)) push("repo", v);
  return tasks.slice(0, MAX_BATCH_TASKS);
}

/**
 * Run `worker` over `items` with at most `limit` in flight, preserving order.
 * Deterministic: the returned array is indexed like the input.
 */
export async function mapPool(items, limit, worker) {
  const list = Array.isArray(items) ? items : [];
  const size = Math.max(1, Math.min(Math.floor(limit) || 1, list.length || 1));
  const results = new Array(list.length);
  let cursor = 0;
  const run = async () => {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= list.length) return;
      results[index] = await worker(list[index], index);
    }
  };
  await Promise.all(Array.from({ length: size }, run));
  return results;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 增量和verified/confidence/覆盖关键边界是什么？

**研究主题：**贡献与相对优势、缺陷与关键质疑

#### 完整回答

增量是把文本定位、语法/网络元数据与批量表放在一个工具，保留单claim行号比无来源断言更可复核；纯helpers易审。但“验证”命名/等级强于所做检查。

关键词覆盖60%就verified，不检查否定、词项关系、数字/单位是否满足主张，也可能命中README声明/测试例子而非实现；CJK连续片段不分词，长句可漏。batch两关键词覆盖即可high，YAML smoke无论复杂语义也称high parsed cleanly；这些是规则标签，非校准概率/独立证据。batch claim还丢r.evidence/filesScanned，只留命中数/verdict，难以复核。

遍历目录失败直接return当前files，文件cap/大文件/二进制跳过无覆盖缺口；readTextCapped先完整readText再按JS字符length判大小，不是字节/内存读取上限。config无大小限制，JSON语法不检查业务Schema，.jsonc仍严格JSON不支持注释，YAML扫描不懂注释/多行标量/完整缩进语义。

网络用raw fetch而非Host受管策略，URL任意输入自动redirect，没有目标/重定向私网围栏或exec.signal合并；timeout为本地每请求，URL只等头未取消/消费body，不能当正文读取成功。npm存在/bundle字段不证明可装安全；GitHub提交/年龄/topic不等满足完整上架要求，URL将owner/repo整体encode为带%2F段，实际端点接受语义还需核。未执行网络复现，不将其说成已证实故障。

#### 证据与依据

**依据 1 · 源码核查**：[lib/verify.js:37-69](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L37-L69)

文本启发式。

<details>
<summary>查看原文（33行）</summary>

```text
export function extractKeywords(claim, opts = {}) {
  const { max = 12 } = opts;
  const out = [];
  const seen = new Set();
  const push = (term, kind) => {
    const t = term.trim().toLowerCase();
    if (t.length === 0 || seen.has(t)) return;
    seen.add(t);
    out.push({ term: t, kind });
  };
  const text = String(claim || "");
  for (const m of text.matchAll(CJK_RE)) push(m[0], "cjk");
  for (const m of text.matchAll(EN_RE)) {
    if (!EN_STOPWORDS.has(m[0].toLowerCase())) push(m[0], "en");
  }
  for (const m of text.matchAll(NUM_RE)) push(m[0], "num");
  return out.slice(0, max);
}

/**
 * Turn per-keyword evidence counts into a verdict.
 * @param {{term:string, hits:number}[]} keywordStats
 * @returns {{verdict:'verified'|'partial'|'unsupported', foundCount:number, totalCount:number, pct:number}}
 */
export function scoreClaim(keywordStats) {
  const total = keywordStats.length;
  const found = keywordStats.filter((k) => k.hits > 0).length;
  const pct = total === 0 ? 0 : Math.round((found / total) * 100);
  let verdict = "unsupported";
  if (total === 0) verdict = "unsupported";
  else if (pct >= 60) verdict = "verified";
  else if (pct >= 30) verdict = "partial";
  return { verdict, foundCount: found, totalCount: total, pct };
```

</details>

**依据 2 · 源码核查**：[lib/batch.js:49-75](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/batch.js#L49-L75)

规则confidence。

<details>
<summary>查看原文（27行）</summary>

```text
/** Confidence grading for one batch result (high / medium / low + basis). */
export function confidenceOf(result = {}) {
  const kind = result.kind;
  if (kind === "claim") {
    const hits = Number(result.summary && result.summary.found) || 0;
    if (result.verdict === "verified" && hits >= 2) return { level: "high", basis: [hits + " keyword evidence hits"] };
    if (result.verdict === "verified") return { level: "medium", basis: ["single keyword hit"] };
    if (result.verdict === "partial") return { level: "low", basis: ["partial keyword coverage"] };
    return { level: "low", basis: ["no evidence found"] };
  }
  if (kind === "url") {
    const status = result.summary && result.summary.status;
    if (typeof status !== "number") return { level: "low", basis: ["probe failed"] };
    if (status >= 200 && status < 300) return { level: "high", basis: ["HTTP " + status] };
    if (status >= 300 && status < 400) return { level: "medium", basis: ["redirect HTTP " + status] };
    return { level: "high", basis: ["HTTP " + status] };
  }
  if (kind === "npm" || kind === "repo") {
    if (result.error) return { level: "low", basis: ["probe error"] };
    const exists = result.summary && result.summary.exists;
    if (exists === true) return { level: "high", basis: ["registry confirms it exists"] };
    if (exists === false) return { level: "high", basis: ["registry confirms it is absent"] };
    return { level: "low", basis: ["inconclusive"] };
  }
  if (kind === "config") {
    if (result.error) return { level: "low", basis: ["unreadable"] };
    return { level: "high", basis: [result.ok ? "parsed cleanly" : "parse error located"] };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:202-215](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L202-L215)

batch丢证据/YAML。

<details>
<summary>查看原文（14行）</summary>

```text
            if (task.kind === "claim") {
              const r = await runClaim(task.value, String(args.scope || "").trim(), exec, cwd);
              return { kind: "claim", value: task.value, ok: r.verdict !== "unsupported", verdict: r.verdict, summary: r.summary, detail: r.verdict + " (" + r.summary.found + "/" + r.summary.total + " keywords)" };
            }
            if (task.kind === "config") {
              const t = await ctx.fs.resolve(task.value, cwd !== undefined ? { cwd, signal: exec.signal } : { signal: exec.signal });
              const content = await ctx.fs.readText(t, exec.signal);
              const lower = task.value.toLowerCase();
              if (/^[\s]*[\[{]/.test(content) || lower.endsWith(".json") || lower.endsWith(".jsonc")) {
                const r = validateJson(content);
                return { kind: "config", value: task.value, ok: r.ok, summary: { format: "json" }, detail: r.ok ? "valid JSON" : "invalid JSON: " + r.error };
              }
              const r = validateYamlSmoke(content);
              return { kind: "config", value: task.value, ok: r.ok, summary: { format: "yaml" }, detail: r.ok ? "YAML smoke check passed" : "YAML smoke check failed: " + r.error };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:56-96](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L56-L96)

静默截断和先全读。

<details>
<summary>查看原文（41行）</summary>

```text
async function collectFiles(fs, rootTarget, opts, signal) {
  const { maxFiles = 500 } = opts;
  const files = [];
  const queue = [{ target: rootTarget, rel: "." }];
  while (queue.length > 0) {
    const { target, rel } = queue.shift();
    let entries;
    try {
      entries = await fs.listDir(target, signal);
    } catch {
      return files;
    }
    for (const entry of entries) {
      const childRel = rel === "." ? entry.name : rel + "/" + entry.name;
      if (entry.type === "directory") {
        if (entry.name === ".git" || entry.name === "node_modules" || entry.name === ".npm-cache") continue;
        queue.push({ target: entry.target, rel: childRel });
      } else if (entry.type === "file") {
        if (entry.name === ".DS_Store") continue;
        if (files.length >= maxFiles) return files;
        files.push({ rel: childRel, target: entry.target });
      }
    }
  }
  return files;
}

/** Read a file as text through ctx.fs with a byte cap; null when unreadable/oversized/binary. */
async function readTextCapped(fs, target, maxBytes, signal) {
  try {
    const text = await fs.readText(target, signal);
    return text.length <= maxBytes ? text : null;
  } catch {
    try {
      const bytes = await fs.readBytes(target, signal, maxBytes);
      let nul = 0;
      for (let i = 0; i < bytes.length && i < 4096; i++) if (bytes[i] === 0) nul += 1;
      return nul > 8 ? null : Buffer.from(bytes).toString("utf8").slice(0, maxBytes);
    } catch {
      return null;
    }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:259-273](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L259-L273)

配置分流。

<details>
<summary>查看原文（15行）</summary>

```text
      if (action === "config") {
        const target = await ctx.fs.resolve(args.target, cwd !== undefined ? { cwd, signal: exec.signal } : { signal: exec.signal });
        const content = await ctx.fs.readText(target, exec.signal);
        const lower = String(args.target).toLowerCase();
        const looksJson = /^[\s]*[\[{]/.test(content);
        if (looksJson || lower.endsWith(".json") || lower.endsWith(".jsonc")) {
          const r = validateJson(content);
          return { action: "config", ok: r.ok, detail: r.ok ? "valid JSON" : "invalid JSON: " + r.error, summary: r.ok ? { format: "json", depth: r.depth } : { format: "json" } };
        }
        const r = validateYamlSmoke(content);
        return {
          action: "config",
          ok: r.ok,
          detail: r.ok ? "YAML smoke check passed" : "YAML smoke check failed: " + r.error,
          summary: r.ok ? { format: "yaml", depth: r.depth, note: r.note } : { format: "yaml" },
```

</details>

**依据 6 · 源码核查**：[lib/verify.js:148-158](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L148-L158)

任意URL/redirect/timeout。

<details>
<summary>查看原文（11行）</summary>

```text
export async function checkUrl(fetchImpl, url, opts = {}) {
  const { timeoutMs = 20000 } = opts;
  const started = Date.now();
  try {
    const res = await fetchImpl(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "User-Agent": "dsh-plugin-verify" },
    });
    return { ok: res.ok, status: res.status, finalUrl: res.url || url, timeMs: Date.now() - started };
```

</details>

**依据 7 · 源码核查**：[lib/verify.js:175-192](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L175-L192)

存在非安装验收。

<details>
<summary>查看原文（18行）</summary>

```text
    const res = await fetchImpl("https://registry.npmjs.org/" + encodeURIComponent(name), {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "User-Agent": "dsh-plugin-verify" },
    });
    if (res.status === 404) return { ok: true, exists: false, name };
    if (!res.ok) return { ok: false, error: "registry " + res.status };
    const meta = await res.json();
    const latest = meta["dist-tags"] && meta["dist-tags"].latest;
    const v = latest && meta.versions && meta.versions[latest];
    return {
      ok: true,
      exists: true,
      name: meta.name || name,
      latest,
      hasDshBundle: Boolean(v && v.dsh && v.dsh.bundle),
      publishedAt: meta.time && meta.time[latest],
      description: String(meta.description || "").slice(0, 200),
    };
```

</details>

**依据 8 · 源码核查**：[lib/verify.js:206-237](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L206-L237)

repo编码/近似字段。

<details>
<summary>查看原文（32行）</summary>

```text
export async function checkGitHubRepo(fetchImpl, fullName, opts = {}) {
  const { token, timeoutMs = 20000 } = opts;
  const headers = { "User-Agent": "dsh-plugin-verify", Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = "Bearer " + token;
  try {
    const repo = await fetchImpl("https://api.github.com/repos/" + encodeURIComponent(fullName), { headers, signal: AbortSignal.timeout(timeoutMs) });
    if (repo.status === 404) return { ok: true, exists: false, fullName };
    if (!repo.ok) return { ok: false, error: "github " + repo.status };
    const meta = await repo.json();
    const createdAt = meta.created_at || null;
    const ageDays = createdAt ? Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000)) : null;
    const topics = meta.topics || [];
    const out = {
      ok: true,
      exists: true,
      fullName: meta.full_name || fullName,
      defaultBranch: meta.default_branch,
      createdAt,
      ageDays,
      pushedAt: meta.pushed_at,
      topics,
      hasDshTopic: topics.includes("dsh-plugin"),
      description: String(meta.description || "").slice(0, 200),
    };
    try {
      const commits = await fetchImpl("https://api.github.com/repos/" + encodeURIComponent(fullName) + "/commits?per_page=1", { headers, signal: AbortSignal.timeout(timeoutMs) });
      if (commits.ok) {
        const link = commits.headers.get("link") || "";
        const last = /<([^>]+)>;\s*rel="last"/.exec(link);
        if (last) {
          const page = /[?&]page=(\d+)/.exec(last[1]);
          if (page) out.commitCount = Number(page[1]);
```

</details>

#### 缺口

- 关键词判断误报/漏报和confidence校准没有语义真值数据。
  **影响：**不能把verified/high当主张真实。
  **进一步探讨：**可从否定/无关同词/错误数字与完整出处夹具入手，分线索和语义核查状态。
- ctx.fs containment、网络允许范围及GitHub编码路由兼容依Host/目标协议。
  **影响：**不能把只读称隔离或把失败直接归目标不存在。
  **进一步探讨：**可固定宿主fs/网络策略与目标路由契约，限制目的地址并核重定向/取消，失败保留unknown。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、外发范围和读者流程是什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

包1.1.2依tools/fs/systemPrompt和schema，promptSectionfalse仍硬注入。工作区读走ctx.fs有受管接口价值，但实际允许范围依宿主，不能仅从resolve调用证明containment。网络直接全局fetch，不传宿主执行signal，只创建timeout；API收集包名/仓库名和URL可能暴露调查对象。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配tools/fs/systemPrompt/schema契约 | 必需 | 注册verify/工作区解析读取 | containment与fs语义依宿主，不由本包独证 |
| 原生fetch/AbortSignal.timeout | 网络模式必需 | URL/registry/GitHub GET | Host网络策略未通过受管seam统一 |
| 文件/外部目标读取授权 | 必需 | 搜索文本或外发URL/包名/仓库名 | “只读”仍有数据暴露和网络副作用 |
| 人工读证据/目标语义判断 | 必需 | 判断真实主张/配置/兼容 | verified/high不是证明 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定义 | 把主张/配置/可达性分别定判据 | 不用统一OK代替业务验收 |
| 限范围 | 选无敏感scope/允许访问目标 | 先单项再batch，不默认探内网 |
| 核证 | 阅读命中上下文/语法结果/HTTP实际字段 | 反证/版本/未知与未扫范围单列 |
| 恢复 | 区分请求失败/不存在/内容不成立 | 不因high或404直接安装/发布/断言 |

不写/不执行扫描内容是源码边界，不代表GET无副作用或没有敏感文本回显；关键词snippet进入模型上下文前应限定scope。本轮不调用工具探测目标，不扫描本机工作区。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/package.json#L1-L4)

包版本。

```text
{
  "name": "dsh-plugin-verify",
  "version": "1.1.2",
  "description": "Verification toolkit for DeepSeek Harness agents: evidence-based claim checking against workspace files with line citations, config validation (JSON/YAML), HTTP URL status checks, npm package checks, GitHub repo submission-readiness checks, and batch verification with bounded concurrency and per-result confidence grading",
```

**依据 2 · 源码核查**：[lib/index.js:34-49](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L34-L49)

硬依赖/配置。

<details>
<summary>查看原文（16行）</summary>

```text
const inject = ["tools", "fs", "systemPrompt"];

/** Composition-row configuration. */
const Config = z.object({
  /** Hard cap on files walked for claim evidence. */
  maxFiles: z.number().default(500),
  /** Per-file byte cap when reading for claim evidence. */
  maxFileBytes: z.number().default(1024 * 1024),
  /** Cap on total evidence entries returned. */
  maxEvidence: z.number().default(20),
  /** Network probe timeout. */
  timeoutMs: z.number().default(20000),
  /** Register the prompt-guidance section. */
  promptSection: z.boolean().default(true),
  /** Order of the prompt section. */
  sectionOrder: z.number().default(6),
```

</details>

**依据 3 · 源码核查**：[lib/index.js:107-116](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L107-L116)

ctx.fs读取。

<details>
<summary>查看原文（10行）</summary>

```text
  async function runClaim(target, scopeSpec, exec, cwd) {
    const keywords = extractKeywords(target, { max: 12 });
    const rootSpec = scopeSpec || (cwd || ".");
    const rootTarget = await ctx.fs.resolve(rootSpec, cwd !== undefined ? { cwd, signal: exec.signal } : { signal: exec.signal });
    const files = await collectFiles(ctx.fs, rootTarget, { maxFiles: config.maxFiles }, exec.signal);
    const evidence = [];
    const stats = keywords.map((k) => ({ term: k.term, hits: 0 }));
    let filesScanned = 0;
    for (const f of files) {
      const content = await readTextCapped(ctx.fs, f.target, config.maxFileBytes, exec.signal);
```

</details>

**依据 4 · 源码核查**：[lib/verify.js:148-156](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L148-L156)

rawfetch。

```text
export async function checkUrl(fetchImpl, url, opts = {}) {
  const { timeoutMs = 20000 } = opts;
  const started = Date.now();
  try {
    const res = await fetchImpl(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "User-Agent": "dsh-plugin-verify" },
```

**依据 5 · 源码核查**：[lib/index.js:321-326](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L321-L326)

提示开关。

```text
  if (config.promptSection) {
    ctx.effect(() => ctx.systemPrompt.section({
      name: "verify:instructions",
      order: config.sectionOrder,
      text: VERIFY_SECTION_TEXT,
    }), "verify.section()");
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本和效果怎么判断？

**研究主题：**效果与总成本

#### 完整回答

批量上限50且池保序是有界并发，输入先normalize再slice，超50静默截掉；前面claims/configs可挤掉后面网络任务。每个claim重扫scope，重复任务无共享索引。文件数cap不限制目录数/全文读取；网络body JSON无大小cap，提交数还有第二请求，真实总延迟不等timeoutMs。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 兼容宿主/网络，金额未知 | 明确证据语义与允许范围 | 未自动核目标真实业务效果 |
| 持续使用 | 文件遍历/全文读取、最多50任务/8并发网络 | 读原文/排反例、处理rate limit | 字符cap非读取内存cap，batch丢逐条证据 |
| 失败恢复 | 重查/缩scope/网络诊断 | 核截断/取消/失败而非补结论 | URL GET可能已触达外部目标 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 定位线索 | 关键词/行号/snippet | 语义支持/否定/数字因果 |
| 配置检查 | JSON语法与YAML括号引号扫描 | Schema/宿主加载/业务配置正确 |
| 元数据 | HTTP状态/包存在/仓库字段 | 内容可信、制品安全、投稿要求达标 |
| 批量 | 有界池/顺序表与规则等级 | 统计置信度或真实误判率 |

单claim返回证据上限与render前12再裁snippet，有读者上下文节省但也损失反证；应回原文件读全上下文。批量总结all completed仅按ok统计，partial claim也oktrue，不能理解成全部主张被证实。

#### 证据与依据

**依据 1 · 源码核查**：[lib/batch.js:12-25](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/batch.js#L12-L25)

按种类优先截50。

<details>
<summary>查看原文（14行）</summary>

```text
export function normalizeTasks({ claims = [], urls = [], packages = [], repos = [], configs = [] } = {}) {
  const asList = (v) => (Array.isArray(v) ? v : v === undefined || v === null ? [] : [v]);
  const tasks = [];
  const push = (kind, value) => {
    const text = String(value === undefined || value === null ? "" : value).trim();
    if (text.length === 0) return;
    tasks.push({ kind, value: text });
  };
  for (const v of asList(claims)) push("claim", v);
  for (const v of asList(configs)) push("config", v);
  for (const v of asList(urls)) push("url", v);
  for (const v of asList(packages)) push("npm", v);
  for (const v of asList(repos)) push("repo", v);
  return tasks.slice(0, MAX_BATCH_TASKS);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:199-204](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L199-L204)

并发/逐claim重扫。

```text
        const limit = Number.isInteger(args.concurrency) && args.concurrency > 0 ? Math.min(args.concurrency, 8) : 4;
        const raw = await mapPool(tasks, limit, async (task) => {
          try {
            if (task.kind === "claim") {
              const r = await runClaim(task.value, String(args.scope || "").trim(), exec, cwd);
              return { kind: "claim", value: task.value, ok: r.verdict !== "unsupported", verdict: r.verdict, summary: r.summary, detail: r.verdict + " (" + r.summary.found + "/" + r.summary.total + " keywords)" };
```

**依据 3 · 源码核查**：[lib/index.js:178-185](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L178-L185)

渲染裁证据。

```text
      render: (_args, value) => {
        const lines = ["[verify:" + value.action + "] " + (value.ok ? "OK" : "FAIL") + " — " + value.detail];
        if (value.verdict) lines.push("verdict: " + value.verdict + (value.score !== undefined ? " (score " + value.score + ")" : ""));
        if (value.summary) lines.push("summary: " + JSON.stringify(value.summary));
        if (value.table) lines.push("", value.table);
        for (const e of (value.evidence || []).slice(0, 12)) {
          lines.push("  " + e.file + ":" + e.line + " — " + String(e.snippet || "").slice(0, 120));
        }
```

**依据 4 · 源码核查**：[lib/batch.js:81-97](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/batch.js#L81-L97)

按ok总结。

<details>
<summary>查看原文（17行）</summary>

```text
export function summarizeBatch(results = []) {
  const list = Array.isArray(results) ? results : [];
  const byKind = {};
  const confidence = { high: 0, medium: 0, low: 0 };
  let failed = 0;
  for (const r of list) {
    byKind[r.kind] = (byKind[r.kind] || 0) + 1;
    const level = r.confidence && r.confidence.level;
    if (level === "high" || level === "medium" || level === "low") confidence[level] += 1;
    if (r.ok !== true) failed += 1;
  }
  const conclusion = list.length === 0
    ? "no tasks supplied"
    : failed === 0
      ? "all " + list.length + " check(s) completed successfully"
      : failed + " of " + list.length + " check(s) failed or were inconclusive";
  return { total: list.length, byKind, confidence, failed, conclusion };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:247-255](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L247-L255)

partial也ok。

```text
        const r = await runClaim(target, String(args.scope || "").trim(), exec, cwd);
        return {
          action: "claim",
          ok: r.verdict !== "unsupported",
          detail: "claim evidence check across " + r.filesScanned + " files",
          verdict: r.verdict,
          score: r.score,
          summary: r.summary,
          evidence: r.evidence,
```

#### 缺口

- 无规模资源/误判/人工复核时间相较rg+标准解析/API基线对照。
  **影响：**不能承诺验证更准或更便宜。
  **进一步探讨：**可固定公共仓库主张/配置与可控响应，计召回/误断言、阅读和恢复总成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程复用、分级证据收据假设与推荐结论？

**研究主题：**工程质量与复用、新假设与验证、采用判断

#### 完整回答

纯逻辑与Host分离、regex转义、SDK文件读取、JSON深度限制、网络timeout、保序有界池和提示effect清理值得复用。问题是将不同证据语义压成OK/verified/high，读者容易越过实际保证。

可探讨未验证的“分级检查与覆盖收据”。把文本命中命名线索、不做事实verified；按来源/行号/内容hash/版本保存支持与反证，batch保留同样证据。JSON语法/YAML词法/Schema/加载各独立状态，网络只记录响应状态/时间/最终目标并保留private/redirect策略结果；扫描/50任务截断和跳过原因显式。相对当前等级表能减少证据跃迁，代价是严格解析/安全网络适配、更多证据和人工语义复核。可用否定/同词反例、YAML注释/多行、超50/大文件、慢body/重定向内网与丢响应夹具研究。

推荐observe，单项可作定位/元数据辅助，但不作为事实验证/安全或上架通行证。继续先修命名/证据保留/覆盖和网络策略，再测固定材料误断言。遇无证据high、partial当成功、批量遗漏、网络越范围或解析不等加载时，停在原文/原始响应核对，不直接安装/发布。

#### 证据与依据

**依据 1 · 源码核查**：[lib/verify.js:74-94](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js#L74-L94)

转义/JSON。

<details>
<summary>查看原文（21行）</summary>

```text
export function escapeRegExp(term) {
  return String(term).replace(SPECIAL_RE, "\\$&");
}

// ---------------------------------------------------------------- config
/** Strict JSON validation with a depth cap. */
export function validateJson(text, { maxDepth = 64 } = {}) {
  try {
    const value = JSON.parse(text);
    let depth = 0;
    const walk = (v, d) => {
      if (d > depth) depth = d;
      if (d > maxDepth) throw new Error("depth exceeds " + maxDepth);
      if (v && typeof v === "object") {
        for (const k of Object.keys(v)) walk(v[k], d + 1);
      }
    };
    walk(value, 0);
    return { ok: true, kind: typeof value, depth };
  } catch (e) {
    return { ok: false, error: String(e && e.message || e) };
```

</details>

**依据 2 · 源码核查**：[lib/batch.js:32-46](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/batch.js#L32-L46)

保序池。

<details>
<summary>查看原文（15行）</summary>

```text
export async function mapPool(items, limit, worker) {
  const list = Array.isArray(items) ? items : [];
  const size = Math.max(1, Math.min(Math.floor(limit) || 1, list.length || 1));
  const results = new Array(list.length);
  let cursor = 0;
  const run = async () => {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= list.length) return;
      results[index] = await worker(list[index], index);
    }
  };
  await Promise.all(Array.from({ length: size }, run));
  return results;
```

</details>

**依据 3 · 源码核查**：[lib/batch.js:49-75](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/batch.js#L49-L75)

证据分级起点。

<details>
<summary>查看原文（27行）</summary>

```text
/** Confidence grading for one batch result (high / medium / low + basis). */
export function confidenceOf(result = {}) {
  const kind = result.kind;
  if (kind === "claim") {
    const hits = Number(result.summary && result.summary.found) || 0;
    if (result.verdict === "verified" && hits >= 2) return { level: "high", basis: [hits + " keyword evidence hits"] };
    if (result.verdict === "verified") return { level: "medium", basis: ["single keyword hit"] };
    if (result.verdict === "partial") return { level: "low", basis: ["partial keyword coverage"] };
    return { level: "low", basis: ["no evidence found"] };
  }
  if (kind === "url") {
    const status = result.summary && result.summary.status;
    if (typeof status !== "number") return { level: "low", basis: ["probe failed"] };
    if (status >= 200 && status < 300) return { level: "high", basis: ["HTTP " + status] };
    if (status >= 300 && status < 400) return { level: "medium", basis: ["redirect HTTP " + status] };
    return { level: "high", basis: ["HTTP " + status] };
  }
  if (kind === "npm" || kind === "repo") {
    if (result.error) return { level: "low", basis: ["probe error"] };
    const exists = result.summary && result.summary.exists;
    if (exists === true) return { level: "high", basis: ["registry confirms it exists"] };
    if (exists === false) return { level: "high", basis: ["registry confirms it is absent"] };
    return { level: "low", basis: ["inconclusive"] };
  }
  if (kind === "config") {
    if (result.error) return { level: "low", basis: ["unreadable"] };
    return { level: "high", basis: [result.ok ? "parsed cleanly" : "parse error located"] };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:202-215](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L202-L215)

batch收据起点。

<details>
<summary>查看原文（14行）</summary>

```text
            if (task.kind === "claim") {
              const r = await runClaim(task.value, String(args.scope || "").trim(), exec, cwd);
              return { kind: "claim", value: task.value, ok: r.verdict !== "unsupported", verdict: r.verdict, summary: r.summary, detail: r.verdict + " (" + r.summary.found + "/" + r.summary.total + " keywords)" };
            }
            if (task.kind === "config") {
              const t = await ctx.fs.resolve(task.value, cwd !== undefined ? { cwd, signal: exec.signal } : { signal: exec.signal });
              const content = await ctx.fs.readText(t, exec.signal);
              const lower = task.value.toLowerCase();
              if (/^[\s]*[\[{]/.test(content) || lower.endsWith(".json") || lower.endsWith(".jsonc")) {
                const r = validateJson(content);
                return { kind: "config", value: task.value, ok: r.ok, summary: { format: "json" }, detail: r.ok ? "valid JSON" : "invalid JSON: " + r.error };
              }
              const r = validateYamlSmoke(content);
              return { kind: "config", value: task.value, ok: r.ok, summary: { format: "yaml" }, detail: r.ok ? "YAML smoke check passed" : "YAML smoke check failed: " + r.error };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:321-326](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js#L321-L326)

提示清理。

```text
  if (config.promptSection) {
    ctx.effect(() => ctx.systemPrompt.section({
      name: "verify:instructions",
      order: config.sectionOrder,
      text: VERIFY_SECTION_TEXT,
    }), "verify.section()");
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
