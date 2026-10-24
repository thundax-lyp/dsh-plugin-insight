# dsh-tavily-web

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[d828be0](https://github.com/ArcaneOrion/dsh-tavily-web/tree/d828be0868f8881a4147dfdb858218c1da897d32)

<!-- BEGIN META -->
[![npm 30d 1,353](https://img.shields.io/static/v1?label=npm+30d&message=1%2C353&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@arcaneorion/dsh-tavily-web) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@arcaneorion/dsh-tavily-web)
<!-- END META -->

> **实现功能**：提供 Tavily 多密钥轮询检索工具，以及通过宿主 shell 的 curl 网页正文抓取工具。

> **核心亮点**：相对单钥 Tavily 包装，增加凭据引用轮询、分类错误处理及密钥更新后解除隔离，并把无钥抓页放入宿主 web seam。搜索能力和排名来自 Tavily，抓页来自 curl；本项增量在失败调度与接入，不能把多钥数量等同于检索质量或总额度收益。[Q01](#research-q01)

> **风险与缺陷**：池能否在失效时控制总尝试成本决定连续性价值。holding 返回永久/冷却状态后仅把钥放 deferred，第二循环无条件再次尝试，因此401与冷却钥在全池无健康钥时仍被请求。每次curl有25/30秒限制，但没有本工具全池总时限或并发租约，多钥可放大延迟和额度压力。正文只正则去标签、截20k，不能替代浏览器渲染与证据复核。[Q02](#research-q02)

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
  - [Q01 · 轮询与抓页如何接入宿主，增量归属何处？](#detail-section-11)
  - [Q02 · 退避和抓页限制如何影响采用与总成本？](#detail-section-12)
  - [Q03 · 全池预算与探测租约能否改善失败成本？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在 DSH 中搜索公开网页并读取页面的研究者，用现有 Tavily 凭据池提高部分账号失效时的连续性。

宿主已有搜索provider或直接单钥Tavily加curl是比较基线。插件刻意不注册web.search provider避免歧义，但注册fetch available总为true，其他fetch provider共存需要宿主选择契约另验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| tavily_search | 获取来源标题、URL、摘要和可选回答 | 需凭据额度，外部排名未独立验证 |
| web_fetch | 返回单页状态和去标签正文 | curl可用，20k正文限制，无JS渲染 |
| 多钥调度 | 局部失效时尝试其他钥 | 冷却钥会last-resort，非严格退避 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/web/shell/credentials | 启动必需 | 注册、执行和取密钥 | 依赖不符工具不可用 |
| curl与兼容shell | 两工具必需 | HTTP传输与状态标记 | 子进程失败 |
| Tavily凭据和额度 | 仅搜索必需 | 外部搜索 | 抓页仍可无钥，检索失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配凭据引用、curl和宿主版本 | 不泄漏密钥且可解析 |
| 搜索 | 模型提交query | 返回可核实来源，错误按类处理 |
| 抓页 | 模型读取选定URL | 状态与正文、截断范围可信 |
| 验收 | 用户核实引用和预算 | 来源支持答案，失败不无限追加尝试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Tavily账户、curl、宿主，金额未知 | 配凭据引用和版本 | 多钥不等于免付费 |
| 持续使用 | 搜索API请求、抓页网络和模型正文token | 核实来源、截断与网页真实性 | 全池尝试可累积，单任务费用未知 |
| 失败恢复 | 换钥、重试、冷却探测资源未知 | 检查401/限额与代理环境 | 全池超时和恢复人工未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 轮询连续性 | 可从失败钥切换其他钥 | 真实恢复率和总请求成本 |
| 网页正文 | curl跟重定向并输出状态，截断有标记 | JS动态页面与编码/正文抽取准确性 |
| 检索质量 | 来源由Tavily返回 | 相对原生搜索的合格来源和研究结果 |

> **思考**：池能否在失效时控制总尝试成本决定连续性价值。holding 返回永久/冷却状态后仅把钥放 deferred，第二循环无条件再次尝试，因此401与冷却钥在全池无健康钥时仍被请求。每次curl有25/30秒限制，但没有本工具全池总时限或并发租约，多钥可放大延迟和额度压力。正文只正则去标签、截20k，不能替代浏览器渲染与证据复核。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对单钥 Tavily 包装，增加凭据引用轮询、分类错误处理及密钥更新后解除隔离，并把无钥抓页放入宿主 web seam。搜索能力和排名来自 Tavily，抓页来自 curl；本项增量在失败调度与接入，不能把多钥数量等同于检索质量或总额度收益。[Q01](#research-q01)

相对单钥 Tavily 包装，增加凭据引用轮询、分类错误处理及密钥更新后解除隔离，并把无钥抓页放入宿主 web seam。搜索能力和排名来自 Tavily，抓页来自 curl；本项增量在失败调度与接入，不能把多钥数量等同于检索质量或总额度收益。[Q01](#research-q01)

发布JS入口避免Node在node_modules直接擦TS的兼容问题，密钥经env传给curl避免写进命令字面量，错误分类有清楚边界。last-resort 牺牲严格退避，池状态缺并发租约；curl -L 只验证初始HTTP(S)字符串，跳转目标与本机访问约束要依赖shell权限另核查。可复用调度思想，不能直接继承安全和效果结论。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

池能否在失效时控制总尝试成本决定连续性价值。holding 返回永久/冷却状态后仅把钥放 deferred，第二循环无条件再次尝试，因此401与冷却钥在全池无健康钥时仍被请求。每次curl有25/30秒限制，但没有本工具全池总时限或并发租约，多钥可放大延迟和额度压力。正文只正则去标签、截20k，不能替代浏览器渲染与证据复核。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

在不含敏感查询的固定任务集试用，先限制凭据数与调用预算，核对返回URL、网页状态和正文。全池失效时请求数或等待不可接受就停止；动态页面、需登录资料和精确正文引用应另用浏览器或人工核查。[Q02](#research-q02)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具、池和抓页接线有发布JS支持；退避是优先级而非严格禁试，全池延迟与并发预算缺口、网页抽取质量未实测。预算方案未实现。

- 已检查：作者 README、包清单、源码路径 src/tavily-web.js、src/tavily-web.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读取固定发布 src/tavily-web.js 与包清单、README；TS为来源材料，未运行build、测试、目标工具或API。
- 下一步：用受控HTTP响应序列验证401、429、5xx、凭据变化、全池冷却与并发，记录总请求数和尾延迟；同组公开资料对比原生搜索与本工具的可核实来源和合格结果。未执行。

**分析版本**

- **仓库**：[ArcaneOrion/dsh-tavily-web](https://github.com/ArcaneOrion/dsh-tavily-web)
- **版本号**：0.2.2（[固定提交 d828be0](https://github.com/ArcaneOrion/dsh-tavily-web/tree/d828be0868f8881a4147dfdb858218c1da897d32)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是每次检索设置总预算，对冷却钥只给一个并发探测租约，401钥仅在指纹变化后重试。用全部429、混合成功、重复401和并发查询对照现版，若合格来源返回率不降低而请求量/尾延迟下降则支持；若错过已恢复钥或延迟无改善则否定。[Q03](#research-q03)

用受控HTTP响应序列验证401、429、5xx、凭据变化、全池冷却与并发，记录总请求数和尾延迟；同组公开资料对比原生搜索与本工具的可核实来源和合格结果。未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 167 | — | — | 1929 |
| .js | source | 1 | 306 | 303 | 9 | — |
| .ts | source | 1 | 392 | 302 | 63 | — |
| .cjs | test | 2 | 393 | 311 | 48 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/ArcaneOrion/dsh-tavily-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多钥检索和shell抓页在何种条件下提高连续性，其资源与证据边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 轮询与抓页如何接入宿主，增量归属何处？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

模型调用tavily_search后，插件从credentials引用或明文配置取钥，按游标依次发Tavily搜索，返回URL、标题和600字符摘要；失败状态分类决定换钥或立即退出。web_fetch则走宿主web注册表，用curl抓取并移除HTML标签。它的增量是单钥失效时无需人工更换和统一工具接入，排名与搜索覆盖归Tavily，传输归curl，不构成新搜索引擎。宿主已有搜索provider时，还需比较额外价值而非默认认为重复接入更好。

#### 证据与依据

**依据 1 · 源码核查**：[src/tavily-web.js:128-152](https://github.com/ArcaneOrion/dsh-tavily-web/blob/d828be0868f8881a4147dfdb858218c1da897d32/src/tavily-web.js#L128-L152)

凭据解析和指纹失效解除构成池机制。

<details>
<summary>查看原文（25行）</summary>

```text
  const resolveKey = async (entry) => {
    if (entry.literal !== void 0) return entry.literal;
    try {
      const hit = await ctx.credentials.resolve(entry.ref);
      const value = hit != null && hit.value != null ? String(hit.value) : "";
      return value.length > 0 ? value : void 0;
    } catch (e) {
      return void 0;
    }
  };
  const holding = (entry, fp) => {
    const state = bench.get(entry.id);
    if (state === void 0) return false;
    if (state.fingerprint !== fp) {
      bench.delete(entry.id);
      return false;
    }
    return state.permanent === true || Date.now() < state.until;
  };
  const benchEntry = (entry, fp, code) => {
    bench.set(entry.id, {
      until: Date.now() + cooldownMs,
      permanent: code === 401,
      fingerprint: fp
    });
```

</details>

**依据 2 · 源码核查**：[src/tavily-web.js:262-294](https://github.com/ArcaneOrion/dsh-tavily-web/blob/d828be0868f8881a4147dfdb858218c1da897d32/src/tavily-web.js#L262-L294)

两个模型工具与fetch provider接线可核对。

<details>
<summary>查看原文（33行）</summary>

```text
  ctx.web.registerFetchProvider({
    id: "dsh-curl-fetch",
    available: () => true,
    fetch: (request, signal) => fetchPage(request.url, signal)
  });
  ctx.tools.register(defineTool({
    name: "tavily_search",
    description: "Search the web through the Tavily API. Returns ranked sources with url/title/snippet and an optional short answer. Keys are rotated across a pool, so one exhausted account does not disable the tool.",
    parameters: {
      query: { type: "string", required: true, description: "The search query." },
      max_results: { type: "integer", description: "Number of sources to return, 1-20 (default 5)." }
    },
    output: {
      schema: { type: "json" },
      render: (_args, value) => [{ type: "text", text: JSON.stringify(value, null, 2) }]
    },
    async execute(args, exec) {
      return tavilySearch(String(args.query), args.max_results, exec.signal);
    }
  }));
  ctx.tools.register(defineTool({
    name: "web_fetch",
    description: "Fetch one web page through the curl fetch provider and return its HTTP status plus extracted text.",
    parameters: {
      url: { type: "string", required: true, description: "Absolute http(s) URL to fetch." }
    },
    output: {
      schema: { type: "json" },
      render: (_args, value) => [{ type: "text", text: JSON.stringify(value, null, 2) }]
    },
    async execute(args, exec) {
      return ctx.web.fetch({ url: String(args.url) }, exec.signal);
    }
```

</details>

#### 缺口

- 相对原生搜索的合格来源改善未知。
  **影响**：不能宣称检索质量提高。
  **进一步探讨**：在相同资料任务和预算下核对来源及最终答案。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 退避和抓页限制如何影响采用与总成本？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本、工程质量与复用、采用判断

#### 完整回答

holding包括永久401及冷却期限，但主循环只是把这些钥放进deferred，健康钥没有成功后第二循环无条件重试隔离钥，所以退避是优先级策略。每次curl有25秒网络及30秒shell限制，没有全池总预算或并发租约，全部失效时可能累积等待和请求。抓页只验初始http(s)、跟重定向并正则去标签，正文截20k，动态内容和内容真实性仍需复核。需curl、兼容shell、宿主接口及Tavily额度；首次配置、持续查询与人工复核、失败重试分别计成本，当前金额与时间未知，适合受限预算试用。

#### 证据与依据

**依据 1 · 源码核查**：[src/tavily-web.js:30-36](https://github.com/ArcaneOrion/dsh-tavily-web/blob/d828be0868f8881a4147dfdb858218c1da897d32/src/tavily-web.js#L30-L36)

单次超时和输出上限没有覆盖全池总时限。

```text
  const runCurl = async (command, extra, signal) => {
    const request = Object.assign({ command, signal, timeoutMs: 3e4, stdoutMaxBytes: 4 * 1024 * 1024 }, extra || {});
    const execution = await ctx.shell.execute(ctx.shell.resolve(request));
    const result = await execution.result();
    if (result.aborted === true) throw abortedError();
    if (result.timedOut === true) throw new Error("request timed out");
    return result;
```

**依据 2 · 源码核查**：[src/tavily-web.js:57-81](https://github.com/ArcaneOrion/dsh-tavily-web/blob/d828be0868f8881a4147dfdb858218c1da897d32/src/tavily-web.js#L57-L81)

抓页使用curl重定向和有限正文抽取。

<details>
<summary>查看原文（25行）</summary>

```text
  const fetchPage = async (url, signal) => {
    if (typeof url !== "string" || /^https?:\/\//i.test(url) !== true) {
      throw new Error("url must be an absolute http(s) URL");
    }
    if (signal != null && signal.aborted === true) throw abortedError();
    const marker = "\n__DSH_FETCH_STATUS__:";
    const command = "curl -sSL --max-time 25 -A " + esc("Mozilla/5.0 (compatible; DSH-web-fetch/1.0)") + " -w " + esc(marker + "%{http_code}") + " " + esc(url);
    const result = await runCurl(command, {}, signal);
    const raw = result.stdout ? result.stdout.text : "";
    const idx = raw.lastIndexOf(marker);
    if (idx < 0) throw new Error("curl returned no status marker (output truncated?)");
    const statusCode = Number(raw.slice(idx + marker.length).trim());
    if (Number.isFinite(statusCode) !== true || statusCode === 0) {
      const detail = result.stderr && result.stderr.text ? String(result.stderr.text).slice(-400) : "";
      throw new Error("curl could not connect: " + detail);
    }
    const bodyRaw = raw.slice(0, idx);
    const isHtml = /<html[\s>]/i.test(bodyRaw) || /<!doctype html/i.test(bodyRaw);
    const text = isHtml ? htmlToText(bodyRaw) : bodyRaw;
    const limit = 2e4;
    return {
      url,
      statusCode,
      body: { kind: isHtml ? "html" : "text", content: text.slice(0, limit) },
      truncated: result.stdout.truncated === true || text.length > limit
```

</details>

**依据 3 · 源码核查**：[src/tavily-web.js:233-249](https://github.com/ArcaneOrion/dsh-tavily-web/blob/d828be0868f8881a4147dfdb858218c1da897d32/src/tavily-web.js#L233-L249)

deferred钥在健康循环后仍无条件尝试，包括永久失效钥。

<details>
<summary>查看原文（17行）</summary>

```text
    for (const entry of attemptOrder()) {
      const key = await resolveKey(entry);
      if (key === void 0) {
        attempts.push({ id: entry.id, outcome: "not configured" });
        continue;
      }
      if (holding(entry, fingerprint(key))) {
        deferred.push({ entry, key });
        continue;
      }
      const done = await attempt(entry, key, false);
      if (done !== void 0) return done.value;
    }
    for (const item of deferred) {
      const done = await attempt(item.entry, item.key, true);
      if (done !== void 0) return done.value;
    }
```

</details>

#### 缺口

- 全池失败和并发的实际尾延迟与额度影响未知。
  **影响**：不能用单次超时代表总任务成本。
  **进一步探讨**：固定响应矩阵测请求总数、等待与取消传播。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 全池预算与探测租约能否改善失败成本？

**研究主题**：新假设与验证

#### 完整回答

当前每次请求独立退避且会重试全部隔离钥，可推导尚未实现的总预算和单探测租约。一次检索共享截止时间，冷却钥同一时刻仅一个探测，401仅凭据指纹变化才重新尝试，可能减少失败放大但也可能推迟已恢复钥。最小对照覆盖全429、混合成功、重复401及并发，要求合格来源返回率不下降且请求量与尾延迟下降；若恢复率下降或收益不抵复杂度，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/tavily-web.js:233-249](https://github.com/ArcaneOrion/dsh-tavily-web/blob/d828be0868f8881a4147dfdb858218c1da897d32/src/tavily-web.js#L233-L249)

双循环无共享预算和租约提供设计推导，非现有能力。

<details>
<summary>查看原文（17行）</summary>

```text
    for (const entry of attemptOrder()) {
      const key = await resolveKey(entry);
      if (key === void 0) {
        attempts.push({ id: entry.id, outcome: "not configured" });
        continue;
      }
      if (holding(entry, fingerprint(key))) {
        deferred.push({ entry, key });
        continue;
      }
      const done = await attempt(entry, key, false);
      if (done !== void 0) return done.value;
    }
    for (const item of deferred) {
      const done = await attempt(item.entry, item.key, true);
      if (done !== void 0) return done.value;
    }
```

</details>

#### 缺口

- 最优预算与探测间隔未知。
  **影响**：无法预先保证连续性和成本同时改善。
  **进一步探讨**：在受控失败分布上比较恢复率与请求预算后选参数。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
