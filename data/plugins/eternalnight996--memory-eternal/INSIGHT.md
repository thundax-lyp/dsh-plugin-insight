# Memory Eternal

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[e27ffe5](https://github.com/EternalNight996/memory-eternal/tree/e27ffe507986b470a828801b66bfe6a798cd760b)

<!-- BEGIN META -->
[![GitHub ★ 139](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=139&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EternalNight996/memory-eternal) [![npm 30d 13,160](https://img.shields.io/static/v1?label=npm+30d&message=13%2C160&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/memory-eternal) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/memory-eternal)
<!-- END META -->

> **功能**：跨会话沉淀和审阅知识卡，并提供核心记忆与用量账本

> **亮点**：[Q01](#research-q01) 本地知识库配合人工审核与用量观测。

> **主要限制**：[Q03](#research-q03) 审核和本机存储均无法决定模型路由是否会接收对话与核心卡。

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
  - [Q01 · 适合什么任务？](#detail-section-11)
  - [Q02 · 如何采集和注入？](#detail-section-12)
  - [Q03 · 本机数据库是否意味着资料留在本机？](#detail-section-13)
  - [Q04 · 部署与成本怎样界定？](#detail-section-14)
  - [Q05 · 怎样验证质量和净收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者在 DSH 与其他 MCP 客户端之间反复交代项目知识。

维护项目说明并在每次任务中显式加入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 手工说明 | 人工直接控制上下文 | 重复加载与维护 |
| Memory Eternal | 审核与多入口复用 | 需核对模型路由、数据保留和成本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 或 MCP 宿主 | 按入口 | 访问记忆库 | 先固定一个客户端 |
| 模型路由 | 蒸馏可选 | 可能处理正文 | 使用已核对路由 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 虚构知识和隔离库 | 记下配置 |
| 运行 | 比较待审、批准和拒绝 | 记录调用和上下文 |
| 复核 | 对比无插件基线 | 检查正确率及账单 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 部署和本机存储未知 | 设定路由与审核策略耗时未知 | 取决于宿主 |
| 持续 | 模型与存储用量未知 | 审核、纠错与清理耗时未知 | 受频率及内容长度影响 |
| 恢复 | 备份和回退未知 | 处理保留资料耗时未知 | 取决于数据管理要求 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 审核与可见性 | 逐阶段对照 | 只让预期卡进入复用 |
| 净收益 | 比较用量与人工耗时 | 区分召回和蒸馏开销 |

> **思考**：[Q03](#research-q03) 审核和本机存储均无法决定模型路由是否会接收对话与核心卡。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 本地知识库配合人工审核与用量观测。

普通召回与核心系统提示分开，蒸馏路径具备重试。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 审核和本机存储均无法决定模型路由是否会接收对话与核心卡。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 以隔离 vault 和虚构数据验证审核、检索和核心注入。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的让多个客户端复用同一批已审核项目知识。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的让多个客户端复用同一批已审核项目知识。未执行目标代码或实际宿主验证。
- 下一步：将批准前、批准后与撤销状态分别验收。

**分析版本**

- **仓库**：[EternalNight996/memory-eternal](https://github.com/EternalNight996/memory-eternal)
- **版本号**：0.21.0（[固定提交 e27ffe5](https://github.com/EternalNight996/memory-eternal/tree/e27ffe507986b470a828801b66bfe6a798cd760b)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 审核后复用稳定项目约束可能减少重复输入，需计入审核及蒸馏开销。

将批准前、批准后与撤销状态分别验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 11 | 3244 | 2848 | 275 | — |
| .js | source | 50 | 16999 | 12901 | 3453 | — |
| .md | source | 16 | 2768 | — | — | 94402 |
| .tsx | source | 1 | 7884 | 7256 | 548 | — |
| .jsx | source | 1 | 53 | 37 | 12 | — |
| .mjs | test | 87 | 10861 | 8964 | 1001 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/EternalNight996/memory-eternal/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：让多个客户端复用同一批已审核项目知识

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对频繁跨会话和客户端切换的开发者，作者提出同一 SQLite vault、审核队列和记忆账本。相对手工维护说明，它能形成可查看的待审条目并复用已批准知识。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-23](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/README.md#L15-L23)

作者描述共享库、审核和账本

```text
> **Your AI forgets every session. Give it a memory it can trust.**
>
> Local-first, review-gated, measurable — one SQLite vault shared by DSH, Claude Code, Codex, Cursor and any MCP client.

- 🔍 **Review before it counts** — new cards wait in a review queue; approve or reject from the Web UI or terminal; every change is written to an immutable audit log.
- 🧾 **Token ledger** — see how much recall injected, how many distillation calls ran, and how often recall was actually useful.
- 🏠 **Local-first, no cloud** — SQLite + Markdown on your own disk. No third-party memory framework, no account. Memory data never leaves the machine; only the News page fetches public RSS / Hacker News on demand (titles, excerpts and outbound links only).
- ⭐ **Core memory** — promote approved cards to always-on memory; every session gets them automatically, and the review queue still decides what qualifies.
- 🧭 **Reader & layout** — clickable table of contents in the card reader, plus a compact / normal / large layout setting for the whole memory UI.
```

**依据 2 · 作者声明**：[README.md:27-47](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/README.md#L27-L47)

作者描述 DSH 与 MCP 入口

<details>
<summary>查看原文（21行）</summary>

````text
## ⚡ Quick start

**DeepSeek Harness (desktop / web)**

```bash
dsh plugin --profile desktop add memory-eternal
# reopen DSH → sidebar "Memory"
```

**Claude Code, Codex or Cursor — same vault via MCP**

```bash
npm i -g memory-eternal
dsh-memory connect claude    # or: codex / cursor
```

**Any MCP client**

```bash
npx -y -p memory-eternal dsh-memory mcp
```
````

</details>

#### 缺口

- 跨客户端实际兼容性须验证。
  **影响**：有机会减少重复输入。
  **进一步探讨**：选一个项目决策做小规模复用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何采集和注入？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

采集可走原文卡或经模型蒸馏；原文分支仍持久化正文并按审核配置设状态。核心记忆独立刷新并注册为系统提示段。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:752-769](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/index.js#L752-L769)

关闭蒸馏或缺少 LLM 时直接存原文卡

<details>
<summary>查看原文（18行）</summary>

```text
      // 成本控制：distillEnabled=false 时不调 LLM，直接存原文卡（零蒸馏成本）
      const source = DSH_AGENT
      if (cfg.distillEnabled === false || !llm) {
        const rawTitle = deriveTitle(text)
        const rawKind = guessRawKind({ title: rawTitle, body: text })
        const out = await captureCard(root, {
          kind: rawKind,
          title: rawTitle.length >= 6 && !looksTruncated(rawTitle) ? rawTitle : '对话原文记录',
          tags: ['raw'],
          body: text,
          source,
          status: resolveAuditStatus(cfg, rawKind, source || 'unknown'),
          submittedBy: source || 'unknown',
          severity: 'info',
          reason: 'AI 自动沉淀（原文卡）',
        }, { threshold: cfg.dedupThreshold })
        if (out.ok) { countWrite(); logCapture(sessionId, 'created', '原文卡（蒸馏已关闭）', { path: out.path ?? out.rel, kind: rawKind }) }
        else if (out.duplicate) { countWrite(); logCapture(sessionId, 'appended', '与已有卡重复 → 追加更新记录', { path: out.duplicate.path }) }
```

</details>

**依据 2 · 源码核查**：[index.js:1053-1076](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/index.js#L1053-L1076)

获取核心记忆并定期刷新系统提示段

<details>
<summary>查看原文（24行）</summary>

```text
    const refresh = async () => {
      try {
        const cfg = settings.get() ?? {}
        if (cfg.enabled === false || cfg.coreMemoryEnabled === false) { clearSection(); lastText = ''; return }
        const { coreMemoryPrompt } = await import('./lib/core-memory.js')
        const out = await coreMemoryPrompt(vaultDir(), {
          enabled: true,
          limit: cfg.coreMemoryLimit,
          maxChars: cfg.coreMemoryMaxChars,
        })
        if (!alive) return
        if (!out.text) { clearSection(); lastText = ''; return }
        if (out.text === lastText) return
        lastText = out.text
        clearSection()
        disposeSection = ctx.systemPrompt.section({
          name: 'memory-eternal: core-memory',
          order: 120,
          text: out.text,
        })
      } catch { /* 核心记忆失败不能影响普通对话 */ }
    }
    refresh()
    timer = setInterval(refresh, 5000)
```

</details>

#### 缺口

- 原文与蒸馏的存储内容和成本不同。
  **影响**：核心记忆可能进入每次模型调用。
  **进一步探讨**：标记一条无敏虚构核心卡并检查上下文。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本机数据库是否意味着资料留在本机？

**研究主题**：缺陷与关键质疑

#### 完整回答

源码将对话正文及候选上下文交给配置的 LLM 路由蒸馏，并可能重试。核心记忆也进入系统提示。默认审核 all 可配置关闭，状态审核不能代替传输许可。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:139-143](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/index.js#L139-L143)

审核配置可选全审或免审

```text
  //   auditMode: 'all'=全部要审(默认) | 'none'=全部免审直接入库
  //   auditExemptAgents: 免审的智能体名列表（如 codex / claude-code / 本地 DSH）
  //   auditExemptKinds: 免审的知识类型列表（如 tool / mistake）
  // 命中任一免审条件 → 新卡直接 approved 入库，否则进 pending 待审
  auditMode: z.union([z.const('all'), z.const('none')]).default('all'),
```

**依据 2 · 源码核查**：[index.js:820-852](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/index.js#L820-L852)

正文和邻近项交给选定模型路由，失败可能重试

<details>
<summary>查看原文（33行）</summary>

```text
        const attempt = (budget, ms) => { llmCalls++; return summarizeTurnDetailed(llm, route, text, { signal: AbortSignal.timeout(ms), existing: neighbors, maxTokens: budget, sessionId }) }
        let detailed = await attempt(maxTokens, baseTimeout)
        if (detailed.failure && isTimeoutFailure(detailed.failure)) {
          const longer = Math.min(Math.max(Math.round(baseTimeout * 2.5), baseTimeout + 30000), 180000)
          logCapture(sessionId, 'listen', `蒸馏超时（${route.provider}/${route.model}）：可能是模型冷启动 → 以 ${Math.round(longer / 1000)}s 超时重试同一候选`)
          detailed = await attempt(maxTokens, longer)
        }
        // #18 建议 3 + #24：撞输出上限不是「模型坏了」，把上限一路翻倍到 schema 上限。
        // 旧实现只翻倍**一次**：1200 → 2400 仍不够就照样退成原文卡，尽管 4000 本来装得下
        // （issue #24 里 9 次失败中有一半正是被这一限制吃掉的）。
        // #48：JSON 被截断（TRUNCATED_OUTPUT）与 MAX_TOKENS 同类处理 —— 靠加倍预算而不是换模型
        const truncLike = (x) => Boolean(x && (x.code === 'MAX_TOKENS' || x.code === 'TRUNCATED_OUTPUT'))
        let prevBudget = maxTokens
        for (const bigger of maxTokenLadder(maxTokens)) {
          if (!truncLike(detailed.failure)) break
          logCapture(sessionId, 'listen', `输出撞到上限（${detailed.failure.code}，maxTokens=${prevBudget}）→ 以 ${bigger} 重试同一候选（${route.provider}/${route.model}）`)
          detailed = await attempt(bigger, baseTimeout)
          prevBudget = bigger

        }
        if (detailed.card !== undefined) { result = detailed.card; failure = null; break }
        if (detailed.failure) {
          const f = { ...detailed.failure, provider: route.provider, model: route.model }
          // 「模型回了散文」要记住：下次选路把它排到最后，别每轮都先白烧一次（issue #47）
          if (f.code === 'MODEL_NOT_JSON') {
            try { const st = await import('./lib/model-strikes.js'); st.recordModelStrike(process.env, route, f.code) } catch { /* 记不下来不影响主流程 */ }
          }
          failures.push(f)
          // 只保留第一个：旧实现每轮覆盖，最终上报的是**最后一个兜底候选**的错误，
          // 真正有信息量的主因被彻底丢弃（#18 根因 2）。
          if (!failure) failure = f
          const more = i < routes.length - 1
          logCapture(sessionId, 'fail', `蒸馏调用失败（${route.provider}/${route.model}）：${f.code} ${f.message}${more ? ' → 换下一个 provider 重试' : ''}`)
```

</details>

**依据 3 · 源码核查**：[index.js:1064-1072](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/index.js#L1064-L1072)

核心记忆写入系统提示

```text
        if (!out.text) { clearSection(); lastText = ''; return }
        if (out.text === lastText) return
        lastText = out.text
        clearSection()
        disposeSection = ctx.systemPrompt.section({
          name: 'memory-eternal: core-memory',
          order: 120,
          text: out.text,
        })
```

#### 缺口

- 远程模型路由会改变资料流向。
  **影响**：本机落盘、模型处理与卡片审核要分开核对。
  **进一步探讨**：测试前明确路由和配置。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署与成本怎样界定？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者给出 DSH 插件和 MCP 接入。账本记录字符和调用等指标，实际 token 与费用依模型和重试。先限制测试到隔离本机 vault。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-53](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/README.md#L27-L53)

作者提供 profile、MCP 与本机界面用法

<details>
<summary>查看原文（27行）</summary>

````text
## ⚡ Quick start

**DeepSeek Harness (desktop / web)**

```bash
dsh plugin --profile desktop add memory-eternal
# reopen DSH → sidebar "Memory"
```

**Claude Code, Codex or Cursor — same vault via MCP**

```bash
npm i -g memory-eternal
dsh-memory connect claude    # or: codex / cursor
```

**Any MCP client**

```bash
npx -y -p memory-eternal dsh-memory mcp
```

**Browser or terminal**

```bash
dsh-memory open              # http://127.0.0.1:7999
npx -y -p memory-eternal dsh-memory tui   # live queue in the terminal
````

</details>

**依据 2 · 作者声明**：[README.md:56-64](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/README.md#L56-L64)

作者列出账本观测指标

```text
## 🧾 Does it actually save tokens?

Most memory products <em>say</em> they save tokens. We think you should check. The plugin ships a built-in **memory ledger** (Runtime status → Memory ledger) that records:

| Recorded | What it means |
|---|---|
| recall: hits + injected characters | how much memory actually entered the context |
| capture: LLM calls + input/output characters | what distillation cost you |
| usefulness: useful / not-useful feedback | whether recalled memories actually helped |
```

**依据 3 · 源码核查**：[index.js:820-836](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/index.js#L820-L836)

超时和截断可增加调用次数

<details>
<summary>查看原文（17行）</summary>

```text
        const attempt = (budget, ms) => { llmCalls++; return summarizeTurnDetailed(llm, route, text, { signal: AbortSignal.timeout(ms), existing: neighbors, maxTokens: budget, sessionId }) }
        let detailed = await attempt(maxTokens, baseTimeout)
        if (detailed.failure && isTimeoutFailure(detailed.failure)) {
          const longer = Math.min(Math.max(Math.round(baseTimeout * 2.5), baseTimeout + 30000), 180000)
          logCapture(sessionId, 'listen', `蒸馏超时（${route.provider}/${route.model}）：可能是模型冷启动 → 以 ${Math.round(longer / 1000)}s 超时重试同一候选`)
          detailed = await attempt(maxTokens, longer)
        }
        // #18 建议 3 + #24：撞输出上限不是「模型坏了」，把上限一路翻倍到 schema 上限。
        // 旧实现只翻倍**一次**：1200 → 2400 仍不够就照样退成原文卡，尽管 4000 本来装得下
        // （issue #24 里 9 次失败中有一半正是被这一限制吃掉的）。
        // #48：JSON 被截断（TRUNCATED_OUTPUT）与 MAX_TOKENS 同类处理 —— 靠加倍预算而不是换模型
        const truncLike = (x) => Boolean(x && (x.code === 'MAX_TOKENS' || x.code === 'TRUNCATED_OUTPUT'))
        let prevBudget = maxTokens
        for (const bigger of maxTokenLadder(maxTokens)) {
          if (!truncLike(detailed.failure)) break
          logCapture(sessionId, 'listen', `输出撞到上限（${detailed.failure.code}，maxTokens=${prevBudget}）→ 以 ${bigger} 重试同一候选（${route.provider}/${route.model}）`)
          detailed = await attempt(bigger, baseTimeout)
```

</details>

#### 缺口

- 用量显示不能直接证明净节约。
  **影响**：部署成本包含审核和清理。
  **进一步探讨**：记录实际模型用量和审核时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证质量和净收益？

**研究主题**：新假设与验证

#### 完整回答

相同虚构任务比较手工说明、普通召回和核心注入，记录待审、批准、拒绝的可见性和错误召回，另核对每组模型调用与审核耗时。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:997-1009](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/index.js#L997-L1009)

普通召回提示和审核提示随配置生效

<details>
<summary>查看原文（13行）</summary>

```text
      if (!cfg || cfg.enabled === false || cfg.autoRecall !== true) return
      const text = [
        '你拥有一个本地「记忆核心」（SQLite 知识库，位于 ' + vaultDir() + '）。',
        '规则：',
        '1. 每轮对话结束后，值得长期复用的内容会被自动沉淀成知识卡，你无需询问用户、也无需手动保存。',
        '2. 当任务需要项目背景、历史决策、之前讨论过的方案或领域知识时，先调用 memory_recall 检索相关卡片，再作答。',
        '3. 若检索结果为空，就诚实说明当前记忆库没有相关内容，不要编造。',
        '4. 知识卡存储在 SQLite 数据库中（memory-eternal.db），**禁止**用文件工具直接读写 vault 目录下的任何文件。沉淀记忆必须通过 memory_recall 工具或 /memory-eternal/api/write API。',
        '5. 若下方出现「自动沉淀异常」，必须在本次回复的第一句用中文转述该异常并提醒用户处理，不要自行猜测或尝试修复。',
        '6. 已批准的技能卡（kind=skill）记录本机实际可用的技能；需要某技能时先 memory_recall 查询「技能名/技能用途」，再用 skill 工具加载同名技能。技能卡只是索引与说明，不替代 skill 工具，也不代表技能已启用。',
        // 审核红线（主上 2026-09-12 强制要求）：只在审核真正生效时注入。
        ...((cfg.auditMode ?? 'all') === 'none' ? [] : [
          '7. **审核红线（强制）**：写卡一律停在 pending，由用户在「审核中心」审批。**禁止**调用 /memory-eternal/api/audit/approve 或 /audit/reject 代替用户审批，也不得用任何等价方式绕过审核；用户说「记录一下 / 增加记忆」不等于允许免审入库。需要立刻可用时，写卡后明确告知用户「已进审核中心，待批准」。',
```

</details>

**依据 2 · 作者声明**：[README.md:56-64](https://github.com/EternalNight996/memory-eternal/blob/e27ffe507986b470a828801b66bfe6a798cd760b/README.md#L56-L64)

作者把召回字符、调用和反馈列为观测项

```text
## 🧾 Does it actually save tokens?

Most memory products <em>say</em> they save tokens. We think you should check. The plugin ships a built-in **memory ledger** (Runtime status → Memory ledger) that records:

| Recorded | What it means |
|---|---|
| recall: hits + injected characters | how much memory actually entered the context |
| capture: LLM calls + input/output characters | what distillation cost you |
| usefulness: useful / not-useful feedback | whether recalled memories actually helped |
```

#### 缺口

- 没有独立基准证明更省 token。
  **影响**：可识别准确性收益是否值得额外开销。
  **进一步探讨**：将批准前、批准后与撤销状态分别验收。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
