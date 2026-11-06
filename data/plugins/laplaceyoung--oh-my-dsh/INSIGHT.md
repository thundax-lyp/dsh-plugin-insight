# oh-my-dsh

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[37b6671](https://github.com/LaplaceYoung/oh-my-dsh/tree/37b66715ce55f1ad7669f12d73c7a56763e90eeb)

<!-- BEGIN META -->
[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LaplaceYoung/oh-my-dsh)
<!-- END META -->

> **功能**：按独立 ESM 插件组织的 DSH 能力库，涵盖研究、编排、守卫等扩展示例。

> **亮点**：贡献是按扩展接缝拆分同行能力为可选包和测试素材，代表样本有真实服务调用；不把根包/作者数量当全部插件可用，见 [Q01](#research-q01)至 [Q03](#research-q03)。

> **主要限制**：报告存在、run complete、注册成功各不等于业务完成；研究可空源模板，tower无文件互斥/失败全收尾，guard缺服务可不挂，见 [Q02](#research-q02)至 [Q04](#research-q04)。

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
  - [Q01 · 根仓库是什么，给谁什么增量？](#detail-section-11)
  - [Q02 · 研究样本是否真正搜索与综合，失败返回什么？](#detail-section-12)
  - [Q03 · 编排与守卫样本实际约束到哪里？](#detail-section-13)
  - [Q04 · 作者烟测支持什么、怎样最小采用？](#detail-section-14)
  - [Q05 · 根库下一步可验证什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已维护DSH并有单一扩展缺口的工程师，可挑包改造；根库非一个完整产品，合格结果是单包真实任务验收，见 [Q01](#research-q01)。

宿主现有能力或仅开发一个缺包；本库提供可改实现/测试素材，模型、网络和权限仍归宿主。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 独立扩展库 | 按缺口选包 | 根非统一可用插件 |
| 研究样本 | 搜索/综合 | 模板可能无源 |
| tower样本 | 分批子Agent与review | 摘要协调，无文件锁 |
| 扫描样本 | 参数秘密检查 | 有guard才挂、有限名单正则 |

**流程与依赖**

#### 依赖

| 条件 | 是否必需 | 用途 | 不满足时 |
| --- | --- | --- | --- |
| pnpm/TypeScript与逐包构建 | 本库采用条件 | lib产物 | 根private非统一入口 |
| 匹配DSH/Cordis工具服务 | 必需 | 各包挂载 | 注册不等于服务充分 |
| web/llm及配置模型 | 研究样本条件 | 搜索/综合 | 空源或模板退化 |
| subagents/父Agent | tower条件 | 真实worker | unavailable或部分失败 |
| tools.guard | 扫描器条件 | 执行前拒绝 | 不存在则不挂 |

#### 步骤

| 步骤 | 动作 | 验收或退路 |
| --- | --- | --- |
| 选缺口 | 与宿主原能力比较 | 不按数量批装 |
| 查依赖 | 单包入口/服务/构建 | 固定宿主 |
| 隔离挂载 | 一个profile一包 | 真调用与退化分开 |
| 故障 | 取消/部分失败/缺服务 | 查残留不盲重跑 |
| 退出 | 停任务撤挂载核工具消失 | 外部写入另处理 |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | 构建/宿主/服务 | 按需选包配组合 | 未测耗时 |
| 持续 | 搜索/模型/多worker | API漂移与工具事件冲突 | 并发上限非总token预算 |
| 失败 | 活请求/worker/文件 | 分退化与部分成功 | 非事务回滚 |
| 退出 | 外部产物/文件 | 停任务再撤包 | disposer不回滚副作用 |

#### 效果

| 效果 | 支持 | 未确认 |
| --- | --- | --- |
| 扩展素材 | 独立包真实接缝 | 全库质量/生产可用 |
| 研究 | 搜索/综合与模板 | 正确覆盖/引用 |
| 编排 | 子Agent调用/review摘要 | 无冲突与完整收尾 |
| 守卫 | 参数正则与guard注册 | 最终宿主门禁/所有秘密 |

> **思考**：报告存在、run complete、注册成功各不等于业务完成；研究可空源模板，tower无文件互斥/失败全收尾，guard缺服务可不挂，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：贡献是按扩展接缝拆分同行能力为可选包和测试素材，代表样本有真实服务调用；不把根包/作者数量当全部插件可用，见 [Q01](#research-q01)至 [Q03](#research-q03)。

effect注销与纯函数便于复用；但代表样本退化结果/异常与服务缺失各有不同契约，测试数量不能代替这些差异的验收，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

报告存在、run complete、注册成功各不等于业务完成；研究可空源模板，tower无文件互斥/失败全收尾，guard缺服务可不挂，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察：维护者围绕一明确缺口读一包，固定宿主后在隔离profile核真实任务、缺服务和取消，保留原宿主退路。不全库挂载，状态解释不清或无实质需求则撤单包，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根workspace/挂载方式及三条代表执行/守卫链和真实烟测脚本已查；没有全库运行或逐包验收。观察，资格台账仅候选。

- 已检查：作者 README、包清单、源码路径 README.md、e2e/run-real-session.mjs、package.json、plugins/deep-research/package.json、plugins/deep-research/src/index.ts、plugins/secret-scanner/src/index.ts、plugins/tower/src/index.ts、pnpm-workspace.yaml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根清单/workspace/README、deep-research337行、tower342行、secret-scanner104行和真实会话烟测90行；三样本不外推全库，未审上游Host执行契约。
- 下一步：- 固定源码，不构建/挂载/运行测试、模型、搜索或worker。
- 作者计数与通过声明不当本轮结果。
- 根类型infrastructure，子插件是必要代表材料而非全库能力保证。

**分析版本**

- **仓库**：[LaplaceYoung/oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh)
- **版本号**：0.1.0（[固定提交 37b6671](https://github.com/LaplaceYoung/oh-my-dsh/tree/37b66715ce55f1ad7669f12d73c7a56763e90eeb)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是按宿主版本维护逐包退化/取消/业务验收资格台账，以三失败样本比较错误采用与维护负担，见 [Q05](#research-q05)。

- 固定源码，不构建/挂载/运行测试、模型、搜索或worker。
- 作者计数与通过声明不当本轮结果。
- 根类型infrastructure，子插件是必要代表材料而非全库能力保证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 94 | 30854 | — | — | 570401 |
| .mjs | source | 4 | 813 | 735 | 52 | — |
| .ts | source | 533 | 106781 | 81223 | 15165 | — |
| .ts | test | 530 | 50443 | 45342 | 1007 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/LaplaceYoung/oh-my-dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：根能力库如何帮助选择具体扩展，代表执行/守卫链与测试支持到什么程度？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根仓库是什么，给谁什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根条目是私有 workspace 能力库，非单个可直接挂载的原生插件或市场服务。各 plugins/<name> 是独立 ESM 包，用户选择、构建并在 Cordis 组合挂载。适合已开发/维护DSH、要找一个可改造扩展样例的工程师；不适合把根包一次安装当完整产品的人。贡献是把同行Agent能力拆成一组宿主扩展实现和测试素材，减少从空目录开始；模型、web、子Agent和工具权限仍来自宿主。

参照是直接用宿主能力或只开发缺少的一包。根 README 的530/524等数量与3731测试、真实6/6是作者快照口径；本轮不将其当逐包真实业务验收，也不逐个重数得出生产能力。根没有自动把所有包组合成稳定工作流的统一入口。为检验根主张，选择 deep-research/tower/secret-scanner 三条有执行/守卫含义的代表链，结论只覆盖样本；不向全库外推。合格结果是找到一个明确缺口的包，核真实接线与退化行为后单独采用，而非“能力越多越好”。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-21](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/package.json#L1-L21)

根private与workspace命令。

<details>
<summary>查看原文（21行）</summary>

```text
{
  "name": "oh-my-dsh",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "description": "Perpetual-motion swarm: close DSH feature gaps with plugins (never break the skeleton)",
  "scripts": {
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "typecheck": "pnpm -r run typecheck"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "esbuild"
    ]
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vitest": "^2.0.0",
    "@deepseek-ai/cordis": "^4.0.1"
  }
```

</details>

**依据 2 · 源码核查**：[pnpm-workspace.yaml:1-6](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/pnpm-workspace.yaml#L1-L6)

工作区逐插件包。

```text
packages:
  - 'plugins/*'
onlyBuiltDependencies:
  - esbuild
allowBuilds:
  esbuild: true
```

**依据 3 · 作者声明**：[README.md:133-167](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/README.md#L133-L167)

逐包挂载与作者测试路径。

<details>
<summary>查看原文（35行）</summary>

````text
## Install

```bash
git clone https://github.com/LaplaceYoung/oh-my-dsh.git
cd oh-my-dsh
pnpm install
```

Plugins are ESM packages under `plugins/<name>` (`@oh-my-dsh/<name>`). Mount them in a DSH
`cordis.yml` composition:

```yaml
- id: omd-deep-research
  name: '@oh-my-dsh/deep-research'
  config:
    provider: deepseek-official
    model: deepseek-v4-flash
```

## Quick start

```bash
# 1. All tests + typecheck
pnpm test
pnpm typecheck

# 2. Registration verification — boots DSH, mounts 530 plugins, asserts 2183 checks
bash e2e/run-e2e.sh

# 3. Real session — full agent stack + all plugins + one real DeepSeek turn
DEEPSEEK_API_KEY=… node --import tsx e2e/run-real-session.mjs e2e/dsh-src
```

## Architecture

````

</details>

**依据 4 · 源码核查**：[plugins/deep-research/package.json:1-17](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/deep-research/package.json#L1-L17)

代表包lib入口和构建依赖。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "@oh-my-dsh/deep-research",
  "version": "0.1.0",
  "type": "module",
  "description": "Autonomous multi-step web research — decompose, search, and synthesize a cited report",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vitest": "^2.0.0",
    "@deepseek-ai/cordis": "^4.0.1"
  }
```

</details>

#### 缺口

- 未逐审全库插件/组合冲突，也未独立验证数量和声称效果。
  **影响**：不能推荐整库一起挂载或把根视为所有能力均可用。
  **进一步探讨**：围绕单一缺口另定包/服务版本和端到端验收，逐包推进。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 研究样本是否真正搜索与综合，失败返回什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

deep-research 实际注册模型工具，启动时软取 web/llm；工具把问题拆为最多8子问题，并行web.search，再可选抓前若干源正文，最后模型综合或模板。存在真实服务调用，不只是Skill提示；但这是预设阶段执行，未见结果驱动继续搜索的开放Agent循环。全部搜索失败/无web会收空源，仍返回 report/sources/questions，模板明确写 no sources；模型分解/综合失败被吞并退化，不能只看返回报告就称研究完成。

fetchBodies开启后只保留去重源中的前maxSources篇，不是把其他来源保留并只增强前几篇；这是覆盖与深读的取舍。综合只给标题URL/片段，抓取片段上限600字符，模型引用仅提示[n]，没有独立核引用与结论一致性。工具 execute 不接exec信号，web/llm调用也未传取消/本地超时，不能声称取消后所有请求已停；底层服务是否另有限制未审。合格验收要看原始来源与问题覆盖，区分模板/模型综合，不能把有引用号当可核事实。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deep-research/src/index.ts:222-231](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/deep-research/src/index.ts#L222-L231)

真实注册和服务获取。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx: Context, config: Config = {}) {
  ctx.effect(() => {
    const tools = ctx.get('tools') as ToolsService
    const web = ctx.get('web') as WebLike | undefined
    const llm = ctx.get('llm') as LlmLike | undefined
    const disposers: (() => void)[] = []

    disposers.push(tools.register({
      name: 'deep_research',
      description: 'Autonomous multi-step web research: decompose a question, search/fetch sources in parallel, and synthesize a cited report.',
```

</details>

**依据 2 · 源码核查**：[plugins/deep-research/src/index.ts:269-329](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/deep-research/src/index.ts#L269-L329)

完整执行阶段与退化/正文替换。

<details>
<summary>查看原文（61行）</summary>

```text
      async execute(args: unknown): Promise<ResearchReport> {
        const { question, breadth } = args as { question?: string; breadth?: number }
        if (typeof question !== 'string' || question.trim() === '') {
          throw new Error('deep_research: question is required')
        }
        const b = clamp(breadth ?? config.maxSubquestions ?? 4, 1, 8)
        const maxSources = clamp(config.maxSourcesPerQuestion ?? 4, 1, 20)
        const maxChars = clamp(config.maxReportChars ?? 8000, 500, 100_000)

        // 1) Decompose: LLM when configured, else the deterministic heuristic.
        let questions = buildSubquestions(question, b)
        if (llm?.stream && config.model) {
          try {
            const generated = await decomposeViaLlm(llm, question, b, config)
            if (generated.length > 0) questions = generated
          } catch {
            /* keep heuristic decomposition */
          }
        }

        // 2) Research: parallel search per sub-question (skip sources already gathered).
        const gathered: ResearchSource[] = []
        if (web?.search) {
          const batches = await Promise.all(questions.map(async q => {
            try {
              const result = await web.search?.({ query: q, maxResults: maxSources })
              return result?.sources ?? []
            } catch {
              return []
            }
          }))
          for (const batch of batches) gathered.push(...batch)
        }
        // Optional deep read of the top sources.
        if (web?.fetch && config.fetchBodies === true) {
          const top = dedupeSources(gathered).slice(0, maxSources)
          const excerpts = await Promise.all(top.map(async s => {
            try {
              const result = await web.fetch?.({ url: s.url })
              return { ...s, snippet: extractExcerpt(result?.body, 600) || s.snippet }
            } catch {
              return s
            }
          }))
          gathered.length = 0
          gathered.push(...excerpts)
        }
        const sources = dedupeSources(gathered).slice(0, maxSources * questions.length)

        // 3) Synthesize: LLM when configured and sources exist, else the template.
        let report = buildReportTemplate(question, questions, sources, maxChars)
        if (llm?.stream && config.model && sources.length > 0) {
          try {
            const text = await synthesizeViaLlm(llm, question, sources, config)
            if (text.trim().length > 0) report = text.slice(0, maxChars)
          } catch {
            /* keep template report */
          }
        }

        return { report, sources, questions }
```

</details>

**依据 3 · 源码核查**：[plugins/deep-research/src/index.ts:130-151](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/deep-research/src/index.ts#L130-L151)

模板无源显式提示。

<details>
<summary>查看原文（22行）</summary>

```text
export function buildReportTemplate(
  question: string,
  questions: readonly string[],
  sources: readonly ResearchSource[],
  maxChars: number,
): string {
  const lines: string[] = [`# Deep Research: ${question}`, '']
  if (questions.length > 0) {
    lines.push('## Sub-questions', ...questions.map(q => `- ${q}`), '')
  }
  lines.push(`## Findings (${sources.length} source${sources.length === 1 ? '' : 's'})`, '')
  if (sources.length === 0) {
    lines.push('(no sources gathered — web search may be unavailable)', '')
  } else {
    sources.forEach((s, i) => {
      lines.push(`[${i + 1}] ${s.title ?? s.url}`, `    ${s.url}`)
      if (s.snippet) lines.push(`    ${s.snippet.slice(0, 240)}`)
      lines.push('')
    })
  }
  const text = lines.join('\n')
  return text.length > maxChars ? `${text.slice(0, maxChars)}…[truncated]` : text
```

</details>

**依据 4 · 源码核查**：[plugins/deep-research/src/index.ts:202-219](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/deep-research/src/index.ts#L202-L219)

仅提示模型引用，真实流收集。

<details>
<summary>查看原文（18行）</summary>

```text
/** Ask the LLM to synthesize a cited report from the gathered sources. */
async function synthesizeViaLlm(
  llm: LlmLike,
  question: string,
  sources: readonly ResearchSource[],
  config: Config,
): Promise<string> {
  const evidence = sources
    .map((s, i) => `[${i + 1}] ${s.title ?? s.url}\n${s.url}\n${s.snippet ?? ''}`)
    .join('\n\n')
  const chunks = llm.stream?.({
    provider: config.provider,
    model: config.model,
    system: 'You are a research analyst. Write a concise, well-cited report from the provided sources. Cite sources by their [n] number.',
    messages: [{ role: 'user', content: `Question: ${question}\n\nSources:\n${evidence}\n\nWrite the report:` }],
  })
  if (!chunks) return ''
  return collectText(chunks)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 编排与守卫样本实际约束到哪里？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

tower 实际以 subagents.start 分批并发跑任务，传父Agent与signal，可选次模型给worker；reviewer不覆写模型因而依赖父/提供方默认。缺子Agent服务或父上下文返回 unavailable，但render仍说run complete。冲突协调本质是共享brief中的自然语言所有权约定，未在此创建文件锁/隔离checkout；reviewer读的是worker输出摘要，提示要求重读输出，不自动读取真实diff。cleanup只是从review文本筛选待办，并不执行回滚/合并。

worker/start/result/dispose异常会使Promise.all拒绝，没有逐worker收失败的catch；其它并发worker可能已经执行，不保证整组失败时无副作用。reviewer失败单独转 unavailable，可选revisit再派一轮增加资源且同样无文件互斥。这支持有限编排便利，不等于事务性多人协作或结果已验收。

secret-scanner 注册实际 tools.guard，扫描名单内工具参数JSON的有限正则，命中返回拒绝理由；如果tools.guard不存在则不挂，不抛“未保护”。不扫描既有文件，也不覆盖名单外工具/编码后的秘密；序列化失败返回空匹配。单调拒绝语义来自宿主guard契约，本轮未审宿主执行器，不能从本包局部实现证明所有写入都阻断。三个样本共同说明：包声明和工具可见不等于底层服务/权限/失败收尾充分。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/tower/src/index.ts:79-115](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/tower/src/index.ts#L79-L115)

共享brief和摘要review输入。

<details>
<summary>查看原文（37行）</summary>

```text
export function buildTeamBrief(instructions: readonly string[]): string {
  const rows = instructions.map((ins, i) => `  W${i + 1}: ${ins}`)
  return [
    'You are one worker on a team of agents working on the SAME repository concurrently.',
    'Team plan:',
    ...rows,
    '',
    'Coordination rules:',
    '- Work only on your own instruction; do not edit files another worker owns.',
    '- If two instructions touch the same file, the earlier worker (W1) owns it; others read it and adapt.',
    '- Report what you changed and any conflict you noticed with another worker.',
  ].join('\n')
}

/** Build one worker's prompt from the brief + its instruction. */
export function buildWorkerPrompt(brief: string, instruction: string, index: number): string {
  return [
    brief,
    '',
    `Your task (W${index + 1}): ${instruction}`,
    '',
    'Complete the task, then summarize: what you changed, and any conflict with another worker.',
  ].join('\n')
}

/** Build the reviewer's prompt from the brief + collected worker outputs. */
export function buildReviewerPrompt(brief: string, results: readonly TowerWorkerResult[]): string {
  const rows = results.map((r, i) => `  W${i + 1}: ${r.summary}`)
  return [
    brief,
    '',
    'You are the team reviewer (the tower). Re-read the workers\' outputs and produce a review:',
    '- List any conflict or duplicated work between workers.',
    '- Say which changes need follow-up and why.',
    'Worker outputs:',
    ...rows,
  ].join('\n')
```

</details>

**依据 2 · 源码核查**：[plugins/tower/src/index.ts:218-276](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/tower/src/index.ts#L218-L276)

render、缺服务和真实分批start/result/dispose。

<details>
<summary>查看原文（59行）</summary>

```text
        render: (_args: unknown, value: unknown) => {
          const v = value as TowerResult
          const workerLines = v.workers.map((w, i) => `W${i + 1}: ${w.summary || `(${w.stopReason})`}`).join('\n')
          return [{
            type: 'text',
            text: `Tower run complete.\n\n## Workers\n${workerLines || '(none)'}\n\n## Review\n${v.review || '(no review)'}`,
          }]
        },
      },
      async execute(args: unknown, exec?: { agent?: unknown; signal?: unknown }): Promise<TowerResult> {
        const { instructions, label } = args as { instructions?: string[]; label?: string }
        if (!Array.isArray(instructions) || instructions.length === 0) {
          throw new Error('tower: instructions must be a non-empty array')
        }
        const plan = instructions.map(s => String(s))
        const maxWorkers = clamp(config.maxWorkers ?? 8, 1, 16)
        const provider = config.provider ?? 'spawn'
        const brief = buildTeamBrief(plan)

        // Degrade gracefully without the subagent seam or a parent agent.
        if (!subagents?.start || !exec?.agent) {
          return {
            plan,
            workers: plan.map(instruction => ({
              instruction,
              summary: '(tower unavailable: no subagent seam or no agent context)',
              stopReason: 'unavailable',
            })),
            review: '(tower unavailable)',
            cleanup: [],
          }
        }

        // 1) Workers, one per instruction, in parallel (bounded by maxWorkers).
        const workerResults: TowerWorkerResult[] = []
        for (let i = 0; i < plan.length; i += maxWorkers) {
          const batch = plan.slice(i, i + maxWorkers)
          const settled = await Promise.all(batch.map(async (instruction, j) => {
            const index = i + j
            const run = await subagents.start!(provider, {
              label: label ? `${label}/W${index + 1}` : `tower/W${index + 1}`,
              prompt: [{ type: 'text', text: buildWorkerPrompt(brief, instruction, index) }],
              parent: exec.agent,
              signal: exec.signal,
              ...(config.secondaryModel ? { agentOptions: config.secondaryModel } : {}),
              ...(config.outputSchema ? { outputSchema: config.outputSchema } : {}),
            })
            try {
              const result = await run.result
              return {
                instruction,
                summary: extractText(result.output),
                stopReason: result.stopReason ?? 'completed',
                ...(result.structured !== undefined ? { structured: result.structured } : {}),
              }
            } finally {
              await run.dispose()
            }
          }))
```

</details>

**依据 3 · 源码核查**：[plugins/tower/src/index.ts:280-334](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/tower/src/index.ts#L280-L334)

review失败/revisit/cleanup返回。

<details>
<summary>查看原文（55行）</summary>

```text
        // 2) Reviewer (primary model) re-reads the workers' outputs.
        let review = ''
        if (config.review !== false && subagents.start) {
          try {
            const run = await subagents.start(provider, {
              label: label ? `${label}/review` : 'tower/review',
              prompt: [{ type: 'text', text: buildReviewerPrompt(brief, workerResults) }],
              parent: exec.agent,
              signal: exec.signal,
            })
            try {
              const result = await run.result
              review = extractText(result.output)
            } finally {
              await run.dispose()
            }
          } catch {
            review = '(reviewer unavailable)'
          }
        }

        // 3) Revisit (optional): re-dispatch workers once more with the review feedback.
        let finalWorkers = workerResults
        if (config.revisit === true && review !== '' && review !== '(reviewer unavailable)' && subagents.start) {
          const revisited: TowerWorkerResult[] = []
          for (let i = 0; i < plan.length; i += maxWorkers) {
            const batch = plan.slice(i, i + maxWorkers)
            const settled = await Promise.all(batch.map(async (instruction, j) => {
              const index = i + j
              const run = await subagents.start!(provider, {
                label: label ? `${label}/W${index + 1}/revisit` : `tower/W${index + 1}/revisit`,
                prompt: [{ type: 'text', text: buildRevisitPrompt(brief, instruction, index, review) }],
                parent: exec.agent,
                signal: exec.signal,
                ...(config.secondaryModel ? { agentOptions: config.secondaryModel } : {}),
                ...(config.outputSchema ? { outputSchema: config.outputSchema } : {}),
              })
              try {
                const result = await run.result
                return {
                  instruction,
                  summary: extractText(result.output),
                  stopReason: result.stopReason ?? 'completed',
                  ...(result.structured !== undefined ? { structured: result.structured } : {}),
                }
              } finally {
                await run.dispose()
              }
            }))
            revisited.push(...settled)
          }
          finalWorkers = revisited
        }

        return { plan, workers: finalWorkers, review, cleanup: parseCleanup(review) }
```

</details>

**依据 4 · 源码核查**：[plugins/tower/src/index.ts:129-137](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/tower/src/index.ts#L129-L137)

cleanup仅文本筛选。

```text
/** Extract follow-up/revert items from the review text (pure). */
export function parseCleanup(review: string): string[] {
  return review
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- ') || line.startsWith('* '))
    .map(line => line.replace(/^[-*]\s+/, ''))
    .filter(line => /revert|follow.?up|conflict|duplicat|clean|remove|fix/i.test(line))
}
```

**依据 5 · 源码核查**：[plugins/secret-scanner/src/index.ts:37-71](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/secret-scanner/src/index.ts#L37-L71)

有限正则、工具名单、序列化失败空匹配。

<details>
<summary>查看原文（35行）</summary>

```text
/** Default secret patterns (conservative, low false-positive). */
export const DEFAULT_PATTERNS: readonly RegExp[] = [
  /\b(?:sk|pk|ghp|gho|ghs|xoxb|xoxp)-[A-Za-z0-9_-]{16,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,                       // AWS access key id
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"][^'"]{12,}['"]/i,
]

/** Scan text for secret patterns; returns matched pattern descriptions. */
export function scanSecrets(
  text: string,
  patterns: readonly RegExp[] = DEFAULT_PATTERNS,
): string[] {
  const found: string[] = []
  for (const pattern of patterns) {
    if (pattern.test(text)) found.push(pattern.source)
  }
  return found
}

/** Scan a tool call's serialized arguments; returns matched patterns. */
export function scanToolArguments(
  toolName: string,
  args: unknown,
  writeTools: readonly string[],
  patterns: readonly RegExp[] = DEFAULT_PATTERNS,
): string[] {
  if (!writeTools.includes(toolName)) return []
  let text: string
  try {
    text = JSON.stringify(args)
  } catch {
    return []
  }
  return scanSecrets(text, patterns)
```

</details>

**依据 6 · 源码核查**：[plugins/secret-scanner/src/index.ts:79-104](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/secret-scanner/src/index.ts#L79-L104)

实际guard注册，服务无guard不挂。

<details>
<summary>查看原文（26行）</summary>

```text

export function apply(ctx: Context, config: Config = {}) {
  ctx.effect(() => {
    const tools = ctx.get('tools') as ToolsService
    const writeTools = config.writeTools ?? ['write', 'edit', 'apply_patch', 'str_replace_editor']
    const patterns = [...DEFAULT_PATTERNS, ...(config.extraPatterns ?? []).map(p => new RegExp(p))]
    const disposers: (() => void)[] = []

    const guard = (execution: { name: string; arguments: unknown }): string | undefined => {
      if (config.enabled === false) return undefined
      const found = scanToolArguments(execution.name, execution.arguments, writeTools, patterns)
      if (found.length > 0) {
        return `secret-scan: potential secret written by ${execution.name} (patterns: ${found.join(', ')})`
      }
      return undefined
    }

    if (tools && typeof tools.guard === 'function') {
      disposers.push(tools.guard(guard))
    }

    return () => {
      for (const dispose of disposers.reverse()) dispose()
    }
  })
}
```

</details>

#### 缺口

- 未查宿主subagent取消/权限继承、guard最终执行次序和多包事件冲突。
  **影响**：不支持全库协作正确性/安全隔离保证。
  **进一步探讨**：对目标一包在匹配宿主核取消、部分失败、文件冲突与guard缺服务告警。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 作者烟测支持什么、怎样最小采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

真实会话脚本核四工具存在，直接执行一个rc_report内存报告，再让模型回复PLUGINS-OK；完成判据只是输出长度大于0。它没有让真实模型完整执行 deep_research/tower/秘密阻断业务任务，不能把6/6读成全部插件端到端通过。本轮只读脚本，不重放作者结果。单元与注册测试是工程素材，不给未跑的部署背书。

结论观察：有具体缺口的DSH维护者先从一包源码和注入服务开始，在隔离profile构建挂载，保留宿主原功能；第一轮验证实际调用、无服务退化、失败/取消与退出清理，再对一条非关键任务比较手工办法。不要按全库数量批量挂载，也不让tower共享写生产目录；若试secret-scanner，要实测guard缺失时不会误认保护生效。

首次有pnpm/TypeScript构建、宿主API匹配和组合配置，持续有宿主漂移、重复工具/事件耦合和维护；研究需搜索服务与模型费，tower每任务一worker、reviewer可加一轮与revisit，不由并发上限推总token上限。失败收尾查仍活worker/已写文件和外部请求，不能盲重跑；退出先停任务再撤挂载/重启核工具消失，effect disposer不自动回滚写盘/外部结果。没有净时间、金额或正确率测量。匹配不到真实需求或状态解释不清时撤单包回原宿主。

#### 证据与依据

**依据 1 · 源码核查**：[e2e/run-real-session.mjs:59-90](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/e2e/run-real-session.mjs#L59-L90)

真实烟测实际断言范围。

<details>
<summary>查看原文（32行）</summary>

```text
  const ctx = await boot('oh-my-dsh-real-session', configPath)
  try {
    // (a) Expected plugin tools are registered against the live registry.
    const expected = ['deep_research', 'tower', 'ohmy_hello', 'rc_report']
    for (const tool of expected) {
      check(`tool registered: ${tool}`, ctx.tools.get(tool) !== undefined)
    }

    // (b) Execute one oh-my-dsh plugin tool directly (in-memory, no LLM).
    try {
      const rcReport = ctx.tools.get('rc_report')
      const result = await rcReport.execute({}, { name: 'rc_report', arguments: {}, signal: new AbortController().signal })
      check('plugin tool executes (rc_report)', typeof result === 'string' && result.includes('entries'), String(result))
    } catch (e) {
      check('plugin tool executes (rc_report)', false, e?.message)
    }

    // (c) One real agent turn through the DeepSeek model.
    const output = await driveTurn(ctx, 'Reply with exactly: PLUGINS-OK')
    console.log(`  · agent output: ${output.slice(0, 200).replace(/\n/g, ' ')}`)
    check('real agent turn completed', output.length > 0, `${output.length} chars`)
  } finally {
    try { await ctx.dispose?.() } catch { /* best-effort */ }
  }
} catch (error) {
  failures++
  console.error('BOOT/RUN FAILED:', error?.message ?? error)
  if (error?.stack) console.error(error.stack.split('\n').slice(0, 6).join('\n'))
}

console.log(`\n${checks.length - failures}/${checks.length} checks passed`)
process.exit(failures === 0 ? 0 : 1)
```

</details>

**依据 2 · 作者声明**：[README.md:133-167](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/README.md#L133-L167)

作者逐包构建/测试路径。

<details>
<summary>查看原文（35行）</summary>

````text
## Install

```bash
git clone https://github.com/LaplaceYoung/oh-my-dsh.git
cd oh-my-dsh
pnpm install
```

Plugins are ESM packages under `plugins/<name>` (`@oh-my-dsh/<name>`). Mount them in a DSH
`cordis.yml` composition:

```yaml
- id: omd-deep-research
  name: '@oh-my-dsh/deep-research'
  config:
    provider: deepseek-official
    model: deepseek-v4-flash
```

## Quick start

```bash
# 1. All tests + typecheck
pnpm test
pnpm typecheck

# 2. Registration verification — boots DSH, mounts 530 plugins, asserts 2183 checks
bash e2e/run-e2e.sh

# 3. Real session — full agent stack + all plugins + one real DeepSeek turn
DEEPSEEK_API_KEY=… node --import tsx e2e/run-real-session.mjs e2e/dsh-src
```

## Architecture

````

</details>

**依据 3 · 源码核查**：[plugins/deep-research/src/index.ts:333-337](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/deep-research/src/index.ts#L333-L337)

注销工具，不回滚结果。

```text
    return () => {
      for (const dispose of disposers.reverse()) dispose()
    }
  })
}
```

**依据 4 · 源码核查**：[plugins/tower/src/index.ts:251-334](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/tower/src/index.ts#L251-L334)

worker/review/revisit资源。

<details>
<summary>查看原文（84行）</summary>

```text
        // 1) Workers, one per instruction, in parallel (bounded by maxWorkers).
        const workerResults: TowerWorkerResult[] = []
        for (let i = 0; i < plan.length; i += maxWorkers) {
          const batch = plan.slice(i, i + maxWorkers)
          const settled = await Promise.all(batch.map(async (instruction, j) => {
            const index = i + j
            const run = await subagents.start!(provider, {
              label: label ? `${label}/W${index + 1}` : `tower/W${index + 1}`,
              prompt: [{ type: 'text', text: buildWorkerPrompt(brief, instruction, index) }],
              parent: exec.agent,
              signal: exec.signal,
              ...(config.secondaryModel ? { agentOptions: config.secondaryModel } : {}),
              ...(config.outputSchema ? { outputSchema: config.outputSchema } : {}),
            })
            try {
              const result = await run.result
              return {
                instruction,
                summary: extractText(result.output),
                stopReason: result.stopReason ?? 'completed',
                ...(result.structured !== undefined ? { structured: result.structured } : {}),
              }
            } finally {
              await run.dispose()
            }
          }))
          workerResults.push(...settled)
        }

        // 2) Reviewer (primary model) re-reads the workers' outputs.
        let review = ''
        if (config.review !== false && subagents.start) {
          try {
            const run = await subagents.start(provider, {
              label: label ? `${label}/review` : 'tower/review',
              prompt: [{ type: 'text', text: buildReviewerPrompt(brief, workerResults) }],
              parent: exec.agent,
              signal: exec.signal,
            })
            try {
              const result = await run.result
              review = extractText(result.output)
            } finally {
              await run.dispose()
            }
          } catch {
            review = '(reviewer unavailable)'
          }
        }

        // 3) Revisit (optional): re-dispatch workers once more with the review feedback.
        let finalWorkers = workerResults
        if (config.revisit === true && review !== '' && review !== '(reviewer unavailable)' && subagents.start) {
          const revisited: TowerWorkerResult[] = []
          for (let i = 0; i < plan.length; i += maxWorkers) {
            const batch = plan.slice(i, i + maxWorkers)
            const settled = await Promise.all(batch.map(async (instruction, j) => {
              const index = i + j
              const run = await subagents.start!(provider, {
                label: label ? `${label}/W${index + 1}/revisit` : `tower/W${index + 1}/revisit`,
                prompt: [{ type: 'text', text: buildRevisitPrompt(brief, instruction, index, review) }],
                parent: exec.agent,
                signal: exec.signal,
                ...(config.secondaryModel ? { agentOptions: config.secondaryModel } : {}),
                ...(config.outputSchema ? { outputSchema: config.outputSchema } : {}),
              })
              try {
                const result = await run.result
                return {
                  instruction,
                  summary: extractText(result.output),
                  stopReason: result.stopReason ?? 'completed',
                  ...(result.structured !== undefined ? { structured: result.structured } : {}),
                }
              } finally {
                await run.dispose()
              }
            }))
            revisited.push(...settled)
          }
          finalWorkers = revisited
        }

        return { plan, workers: finalWorkers, review, cleanup: parseCleanup(review) }
```

</details>

#### 缺口

- 未构建挂载、请求模型/web、执行worker或guard样本，未测效果费用。
  **影响**：仅建议按缺口源码观察与后续隔离单包验收。
  **进一步探讨**：固定宿主后记录每次服务调用、退化状态、收尾和与手工基线差异。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 根库下一步可验证什么？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证方向是逐包资格台账：除注册成功，记录依赖缺失是否告警、真实结果/退化结果的状态、取消后残留和最小业务验收，以目标宿主版本绑定。当前已有workspace和注册/烟测素材可复用；增量是让消费者知道哪一包在什么条件下值得选，不是继续用包数覆盖真实需求。

最小对照只在三样本添加有限场景：全搜索失败、tower一个worker失败、guard缺服务；比较消费者能否正确区分未执行/部分成功/已完成，以及恢复用时。成本是每包契约维护与运行样本费用，不能强行统一所有功能。如果台账未改善错误采用却频繁过期，应停止或只保留最常用包。没有真实用户需求或对照，本轮仅提出候选。

#### 证据与依据

**依据 1 · 源码核查**：[e2e/run-real-session.mjs:59-79](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/e2e/run-real-session.mjs#L59-L79)

现有烟测可扩展但并非业务验收。

<details>
<summary>查看原文（21行）</summary>

```text
  const ctx = await boot('oh-my-dsh-real-session', configPath)
  try {
    // (a) Expected plugin tools are registered against the live registry.
    const expected = ['deep_research', 'tower', 'ohmy_hello', 'rc_report']
    for (const tool of expected) {
      check(`tool registered: ${tool}`, ctx.tools.get(tool) !== undefined)
    }

    // (b) Execute one oh-my-dsh plugin tool directly (in-memory, no LLM).
    try {
      const rcReport = ctx.tools.get('rc_report')
      const result = await rcReport.execute({}, { name: 'rc_report', arguments: {}, signal: new AbortController().signal })
      check('plugin tool executes (rc_report)', typeof result === 'string' && result.includes('entries'), String(result))
    } catch (e) {
      check('plugin tool executes (rc_report)', false, e?.message)
    }

    // (c) One real agent turn through the DeepSeek model.
    const output = await driveTurn(ctx, 'Reply with exactly: PLUGINS-OK')
    console.log(`  · agent output: ${output.slice(0, 200).replace(/\n/g, ' ')}`)
    check('real agent turn completed', output.length > 0, `${output.length} chars`)
```

</details>

**依据 2 · 源码核查**：[plugins/deep-research/src/index.ts:289-329](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/deep-research/src/index.ts#L289-L329)

有报告但空源/退化。

<details>
<summary>查看原文（41行）</summary>

```text
        // 2) Research: parallel search per sub-question (skip sources already gathered).
        const gathered: ResearchSource[] = []
        if (web?.search) {
          const batches = await Promise.all(questions.map(async q => {
            try {
              const result = await web.search?.({ query: q, maxResults: maxSources })
              return result?.sources ?? []
            } catch {
              return []
            }
          }))
          for (const batch of batches) gathered.push(...batch)
        }
        // Optional deep read of the top sources.
        if (web?.fetch && config.fetchBodies === true) {
          const top = dedupeSources(gathered).slice(0, maxSources)
          const excerpts = await Promise.all(top.map(async s => {
            try {
              const result = await web.fetch?.({ url: s.url })
              return { ...s, snippet: extractExcerpt(result?.body, 600) || s.snippet }
            } catch {
              return s
            }
          }))
          gathered.length = 0
          gathered.push(...excerpts)
        }
        const sources = dedupeSources(gathered).slice(0, maxSources * questions.length)

        // 3) Synthesize: LLM when configured and sources exist, else the template.
        let report = buildReportTemplate(question, questions, sources, maxChars)
        if (llm?.stream && config.model && sources.length > 0) {
          try {
            const text = await synthesizeViaLlm(llm, question, sources, config)
            if (text.trim().length > 0) report = text.slice(0, maxChars)
          } catch {
            /* keep template report */
          }
        }

        return { report, sources, questions }
```

</details>

**依据 3 · 源码核查**：[plugins/tower/src/index.ts:237-276](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/tower/src/index.ts#L237-L276)

unavailable和worker异常样本。

<details>
<summary>查看原文（40行）</summary>

```text
        // Degrade gracefully without the subagent seam or a parent agent.
        if (!subagents?.start || !exec?.agent) {
          return {
            plan,
            workers: plan.map(instruction => ({
              instruction,
              summary: '(tower unavailable: no subagent seam or no agent context)',
              stopReason: 'unavailable',
            })),
            review: '(tower unavailable)',
            cleanup: [],
          }
        }

        // 1) Workers, one per instruction, in parallel (bounded by maxWorkers).
        const workerResults: TowerWorkerResult[] = []
        for (let i = 0; i < plan.length; i += maxWorkers) {
          const batch = plan.slice(i, i + maxWorkers)
          const settled = await Promise.all(batch.map(async (instruction, j) => {
            const index = i + j
            const run = await subagents.start!(provider, {
              label: label ? `${label}/W${index + 1}` : `tower/W${index + 1}`,
              prompt: [{ type: 'text', text: buildWorkerPrompt(brief, instruction, index) }],
              parent: exec.agent,
              signal: exec.signal,
              ...(config.secondaryModel ? { agentOptions: config.secondaryModel } : {}),
              ...(config.outputSchema ? { outputSchema: config.outputSchema } : {}),
            })
            try {
              const result = await run.result
              return {
                instruction,
                summary: extractText(result.output),
                stopReason: result.stopReason ?? 'completed',
                ...(result.structured !== undefined ? { structured: result.structured } : {}),
              }
            } finally {
              await run.dispose()
            }
          }))
```

</details>

**依据 4 · 源码核查**：[plugins/secret-scanner/src/index.ts:97-104](https://github.com/LaplaceYoung/oh-my-dsh/blob/37b66715ce55f1ad7669f12d73c7a56763e90eeb/plugins/secret-scanner/src/index.ts#L97-L104)

无guard静默不挂。

```text
      disposers.push(tools.guard(guard))
    }

    return () => {
      for (const dispose of disposers.reverse()) dispose()
    }
  })
}
```

#### 缺口

- 未证明逐包台账维护收益。
  **影响**：不把候选作为已有根库功能或生产方向。
  **进一步探讨**：先用三类失败样本对照再决定是否扩大。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
