# dsh-workflow-templates

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[26755f7](https://github.com/988hj7tczd-oss/dsh-workflow-templates/tree/26755f75a043418eeb3f59fa0a57a60542740abc)

<!-- BEGIN META -->
[![npm 30d 385](https://img.shields.io/static/v1?label=npm+30d&message=385&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workflow-templates) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workflow-templates)
<!-- END META -->

> **功能**：12 个预置 JS workflow 编排脚本目录，提供列出、搜索、渲染调用起点和静态校验四工具。

> **亮点**：提供可检索的编排脚本起点和轻量格式诊断，减少空白起草。详见[Q01](#research-q01)。

> **主要限制**：invalid 模板仍可 run，缺参仅文字提醒；部分模板返回与描述不符，不能把格式校验当业务验收。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 模板库提供了什么入口？](#detail-section-11)
  - [Q02 · 静态校验能阻止错误模板进入 run 吗？](#detail-section-12)
  - [Q03 · 内置模板是否完成所宣称的任务？](#detail-section-13)
  - [Q04 · 首次、持续及失败恢复如何核算成本效果？](#detail-section-14)
  - [Q05 · 怎样证伪强校验与业务输出契约能减少误用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户明确需要 DSH workflow 大规模多 Agent 编排时，从常见任务模板起步。

从零手写 workflow JS 并手动维护目录；该包提供可检索起点。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 目录/搜索 | 找 12 模板 | 非业务验收 |
| run 起点 | 提供三参数 | 不自动执行 |
| 静态校验 | 格式诊断 | invalid 仍可展示 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH tools | 模板查询 | 不可用 |
| 官方 workflow | 真正编排 | 仅输出起点 |
| 真实任务数据 | 脚本执行 | 可能空泛 |

#### 试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 选模板 | 匹配真实任务 | 场景正确 |
| 审脚本 | 补参数/数据源 | 可执行 |
| 执行验收 | 官方 workflow | 输出符合业务契约 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包/模板磁盘、DSH及可选官方workflow服务，价格未知 | 配templatesDir、读脚本/参数/信任源，工时未知 | 本插件只返回素材，不启动多Agent |
| 持续使用 | 目录与全文在内存；输出完整脚本进入模型上下文；后续编排另耗模型资源 | 补真实数据/参数及输出契约，审核每模板，工时未知 | 模板parallel不提供本插件级总并发/模型预算，量未知 |
| 失败恢复 | 修改/重载素材、重跑官方编排及可能重复工具副作用资源 | 区分格式、缺参、模型输出和业务失败，人工恢复，工时未知 | 本库不持有执行收据或补偿状态，不能承诺安全重放 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 目录检索 | 12 模板 | 用户匹配度 |
| 起点输出 | meta/script/args | 官方执行兼容 |
| 格式校验 | 错误/警告 | 业务正确性 |

> **思考**：invalid 模板仍可 run，缺参仅文字提醒；部分模板返回与描述不符，不能把格式校验当业务验收。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：提供可检索的编排脚本起点和轻量格式诊断，减少空白起草。详见[Q01](#research-q01)。

Cordis 插件同步读取模板、静态检查后注册四工具；run 渲染 Markdown 而不调用 workflow。

<a id="detail-section-5"></a>

### 1.4 主要限制

invalid 模板仍可 run，缺参仅文字提醒；部分模板返回与描述不符，不能把格式校验当业务验收。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先 list/search，审模板代码及来源；补真实 args 和数据接入，只有明确需要多 Agent 时调用官方 workflow；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

目录/四工具可核；静态错误只告警，内置周报/漏洞模板与声称业务输出有差距；实际执行未验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tools/wf-template-run.ts、src/lib/catalog.ts、src/lib/render.ts、src/lib/validate.ts、templates/INDEX.md、templates/docs/weekly-report.js、templates/security/dep-vuln-sweep.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交 README、四工具装配、目录/渲染以及周报和漏洞两份代表性模板；未运行工作流。
- 下一步：隔离执行 invalid/缺参模板观察保护；在官方 workflow 中运行周报/漏洞模板核对真实输出。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-workflow-templates](https://github.com/988hj7tczd-oss/dsh-workflow-templates)
- **版本号**：0.1.1（[固定提交 26755f7](https://github.com/988hj7tczd-oss/dsh-workflow-templates/tree/26755f75a043418eeb3f59fa0a57a60542740abc)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

默认拒绝已知invalid/缺参并补业务输入输出契约，反证条件与维护代价见[Q05](#research-q05)。

隔离执行 invalid/缺参模板观察保护；在官方 workflow 中运行周报/漏洞模板核对真实输出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 375 | — | — | 4101 |
| .ts | source | 9 | 985 | 774 | 143 | — |
| .js | source | 12 | 435 | 314 | 72 | — |
| .ts | test | 1 | 141 | 108 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-workflow-templates/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-workflow-templates/issues?q=is%3Aissue+created%3A2026-09-22T06%3A41%3A25.837Z..2026-10-22T06%3A41%3A25.837Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-workflow-templates/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A41%3A25.837Z..2026-10-22T06%3A41%3A25.837Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 12 个 workflow 模板的模型工具入口、静态校验与代表性模板语义是否达到宣称输出。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模板库提供了什么入口？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

插件从包内 templates 加载 12 个 JS 模板，注册 list/search/run/validate 四个模型工具。wf_template_run 按名称取模板，将 META、脚本全文和默认/调用方 args 渲染成官方 workflow 工具的调用起点，并只探测该工具在当前 agent 作用域是否可见；它不主动调用 workflow。因此实际多 Agent 编排由后续用户/模型明确发起，插件本身只是素材目录与静态检查。README 的“官方契约对齐”是作者主张，本轮仅能核对本包代码。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-35](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/README.md#L12-L35)

作者定位 12 模板和非自动执行边界。

<details>
<summary>查看原文（24行）</summary>

```text
DSH（DeepSeek Harness）预置 Workflow 模板库插件：内置 12 个（目标 50+）可复用
workflow 编排脚本模板，提供 `wf_template_list / wf_template_search / wf_template_run /
wf_template_validate` 四个面向模型的工具，携带模板格式静态校验，并把模板内容交给官方
`workflow` 工具（tool-workflow）的发起机制。

> 项目定位（2026-08 调研结论）：DSH 有完整 workflow 引擎与 `workflow` 工具，但
> **没有模板库**。本插件补上这一块：把高频多步任务固化为"编排脚本模板"
> （源 1：anthropics 插件 workflows 的形态），并声明哪些模板**必须走官方
> `workflow` 工具执行**（源 2：claude-security 的权威执行入口立场）。模板校验
> **对齐**官方 tool-workflow 契约（源 3：`packages/workflow/tool-workflow/README.md`）
> ——对齐点见下文「校验器与官方契约的关系」；本插件自有的扩展字段（`tags` /
> `args` / `REQUIRED_REASON`）均为可选且缺失只发警告，**不会比官方更严格地
> 拒绝官方合法脚本**。
> 上游参考均为 Proprietary，本插件仅参考其结构，模板正文全部自写，**MIT 许可**。

## workflow 工具的使用边界（必读）

- 仅当模型/用户**显式要求** workflow 或**大规模多智能体编排**时使用官方 `workflow`
  工具（一次编写 JS 编排脚本、扇出多个 subagent、按阶段返回结构化 JSON）；
  一两个委派直接用普通 subagent，不要用 workflow。
- 本模板库**不绕过**这一边界：`wf_template_run` 只产出"调起 workflow 工具的完整起点"
  （meta / script / args 三参数 + 参数填充引导），**不自动执行**——执行权在模型与你，
  以及官方 `workflow` 工具。模板是"引导素材"，不是自动执行器。
- 固定 Ralph 循环由官方 `tool-ralph` 提供，模板库**不包含**它，避免重复。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:37-63](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/index.ts#L37-L63)

加载目录并注册四工具。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  const templatesDir = config.templatesDir && config.templatesDir !== ''
    ? config.templatesDir
    : `${fileURLToPath(new URL('..', import.meta.url))}templates`
  const catalog = loadCatalogSync(templatesDir)
  if (catalog.missing) {
    throw new Error(`dsh-workflow-templates: 模板目录不存在：${templatesDir}（可用 config.templatesDir 覆盖）`)
  }
  if (catalog.entries.length === 0) {
    throw new Error(`dsh-workflow-templates: 模板目录为空：${templatesDir}`)
  }

  const invalid = catalog.entries.filter((e) => !validateTemplateText(e.body, templateBaseName(e.relPath)).ok)
  if (invalid.length > 0) {
    ctx.logger.warn(
      `[dsh-workflow-templates] ${invalid.length} 个模板未通过静态校验（可用 wf_template_validate 查看）：` +
      invalid.map((e) => `${e.name}${e.issues.some((i) => i.severity === 'error') ? ' ✗' : ''}`).join(', '),
    )
  }
  ctx.logger.info(`[dsh-workflow-templates] 已加载 ${catalog.entries.length} 个 workflow 模板，根目录 ${templatesDir}`)

  const runDeps = { catalog: catalog.entries, workflowToolName: config.workflowToolName ?? 'workflow' }
  ctx.tools.register(defineWfTemplateList(catalog.entries))
  ctx.tools.register(defineWfTemplateSearch(catalog.entries))
  ctx.tools.register(defineWfTemplateRun(ctx, runDeps))
  ctx.tools.register(defineWfTemplateValidate(catalog.entries))
}
```

</details>

**依据 3 · 源码核查**：[src/tools/wf-template-run.ts:18-45](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/tools/wf-template-run.ts#L18-L45)

取模板、可见性探测与渲染。

<details>
<summary>查看原文（28行）</summary>

```text
export function defineWfTemplateRun(ctx: Context, deps: RunToolDeps) {
  return defineTool({
    name: 'wf_template_run',
    description:
      '取一个预置 workflow 模板的完整内容，输出调起官方 `workflow` 工具的起点：meta/script/args 三参数、参数填充引导、权威执行入口声明，并探测当前会话 workflow 工具是否可见（不可见给出"工具未启用"提示）。只产出起点，**不自动执行**——执行权在模型/用户与官方 workflow 工具。',
    parameters: {
      name: { type: 'string', required: true, description: '模板名称（wf_template_list 返回的 name）' },
      args: {
        type: 'object',
        additionalProperties: true,
        description: '可选：按 META.args 填充模板参数的 JSON 对象；未填的必填参数会在输出中标出',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(params, exec) {
      const entry = deps.catalog.find((e) => e.name === params.name)
      if (entry === undefined) {
        const names = deps.catalog.map((e) => e.name).sort().join('、')
        return `未找到模板 \`${params.name}\`。可用模板：${names}（或先调用 \`wf_template_list\`）。`
      }
      const payload = buildRunPayload(entry, params.args)
      // 以调用方 agent 为作用域探测 workflow 工具可见性（缺省为全局视角）。
      const visible = ctx.tools.get(deps.workflowToolName, exec.agent) !== undefined
      return renderRunMarkdown(entry, payload, { visible, workflowToolName: deps.workflowToolName })
    },
```

</details>

**依据 4 · 源码核查**：[src/lib/render.ts:9-30](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/lib/render.ts#L9-L30)

META/script/args 装配。

<details>
<summary>查看原文（22行）</summary>

```text
/** 按 META.args 默认值 + 调用方提供值装配 args，并指出仍未填充的必填参数。 */
export function buildRunPayload(entry: TemplateEntry, provided?: Record<string, unknown>): RunPayload {
  const meta: RunPayload['meta'] = {
    name: entry.meta.name,
    description: entry.meta.description,
    tags: entry.meta.tags,
  }
  if (entry.meta.phases !== undefined) meta.phases = entry.meta.phases

  const args: Record<string, unknown> = {}
  const spec = entry.meta.args ?? {}
  for (const [key, item] of Object.entries(spec)) {
    if (item !== undefined && item !== null && item.default !== undefined) {
      args[key] = item.default
    }
  }
  if (provided !== undefined) {
    for (const [key, value] of Object.entries(provided)) args[key] = value
  }
  const missingRequired = Object.keys(spec).filter((key) => spec[key]?.required === true && args[key] === undefined)
  return { meta, script: entry.body, args, missingRequired }
}
```

</details>

#### 缺口

- 未在 DSH 官方 workflow 工具中执行模板。
  **影响**：工具兼容与编排质量未知。
  **进一步探讨**：隔离选典型模板填参，在官方 workflow 工具中执行并查返回 JSON。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 静态校验能阻止错误模板进入 run 吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

apply 对加载模板逐个静态校验，但发现 invalid 只写 logger.warn，依然注册四工具；run 按名称找到条目后直接 buildRunPayload，不检查该条目的 validate.ok 或 missingRequired。返回文案提示缺失必填参数，仍完整给出脚本；若模型无视提示继续调用 workflow，运行时可能以 undefined 参数执行。模板扩展目录可覆盖，因此一份静态错误或恶意内容即使告警也会展示给模型。此处只证明提示式约束，不能称强制校验门禁。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:41-62](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/index.ts#L41-L62)

invalid 只告警后照常注册。

<details>
<summary>查看原文（22行）</summary>

```text
  const catalog = loadCatalogSync(templatesDir)
  if (catalog.missing) {
    throw new Error(`dsh-workflow-templates: 模板目录不存在：${templatesDir}（可用 config.templatesDir 覆盖）`)
  }
  if (catalog.entries.length === 0) {
    throw new Error(`dsh-workflow-templates: 模板目录为空：${templatesDir}`)
  }

  const invalid = catalog.entries.filter((e) => !validateTemplateText(e.body, templateBaseName(e.relPath)).ok)
  if (invalid.length > 0) {
    ctx.logger.warn(
      `[dsh-workflow-templates] ${invalid.length} 个模板未通过静态校验（可用 wf_template_validate 查看）：` +
      invalid.map((e) => `${e.name}${e.issues.some((i) => i.severity === 'error') ? ' ✗' : ''}`).join(', '),
    )
  }
  ctx.logger.info(`[dsh-workflow-templates] 已加载 ${catalog.entries.length} 个 workflow 模板，根目录 ${templatesDir}`)

  const runDeps = { catalog: catalog.entries, workflowToolName: config.workflowToolName ?? 'workflow' }
  ctx.tools.register(defineWfTemplateList(catalog.entries))
  ctx.tools.register(defineWfTemplateSearch(catalog.entries))
  ctx.tools.register(defineWfTemplateRun(ctx, runDeps))
  ctx.tools.register(defineWfTemplateValidate(catalog.entries))
```

</details>

**依据 2 · 源码核查**：[src/tools/wf-template-run.ts:35-45](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/tools/wf-template-run.ts#L35-L45)

run 未校验条目。

<details>
<summary>查看原文（11行）</summary>

```text
    async execute(params, exec) {
      const entry = deps.catalog.find((e) => e.name === params.name)
      if (entry === undefined) {
        const names = deps.catalog.map((e) => e.name).sort().join('、')
        return `未找到模板 \`${params.name}\`。可用模板：${names}（或先调用 \`wf_template_list\`）。`
      }
      const payload = buildRunPayload(entry, params.args)
      // 以调用方 agent 为作用域探测 workflow 工具可见性（缺省为全局视角）。
      const visible = ctx.tools.get(deps.workflowToolName, exec.agent) !== undefined
      return renderRunMarkdown(entry, payload, { visible, workflowToolName: deps.workflowToolName })
    },
```

</details>

**依据 3 · 源码核查**：[src/lib/render.ts:18-30](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/lib/render.ts#L18-L30)

缺参只加入 missingRequired。

<details>
<summary>查看原文（13行）</summary>

```text
  const args: Record<string, unknown> = {}
  const spec = entry.meta.args ?? {}
  for (const [key, item] of Object.entries(spec)) {
    if (item !== undefined && item !== null && item.default !== undefined) {
      args[key] = item.default
    }
  }
  if (provided !== undefined) {
    for (const [key, value] of Object.entries(provided)) args[key] = value
  }
  const missingRequired = Object.keys(spec).filter((key) => spec[key]?.required === true && args[key] === undefined)
  return { meta, script: entry.body, args, missingRequired }
}
```

</details>

**依据 4 · 源码核查**：[src/lib/render.ts:128-135](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/lib/render.ts#L128-L135)

输出文字提醒补参。

```text
  if (payload.missingRequired.length > 0) {
    lines.push(`> 尚未填写的必填参数：${payload.missingRequired.map((k) => `\`${k}\``).join('、')}——发起前请补全（本工具支持用 args 参数填充）。`)
    lines.push('')
  }
  lines.push('### 使用边界')
  lines.push('- 仅当模型/用户**显式要求** workflow 或大规模多智能体编排时使用官方 `workflow` 工具；一两处委派直接用普通 subagent。')
  lines.push('- 本模板库不绕过该边界：模板是"引导素材"，`wf_template_run` 只产出起点。')
  return lines.join('\n')
```

#### 缺口

- 未在目标 DSH 运行非法模板。
  **影响**：模型是否按警告停下未知。
  **进一步探讨**：隔离目录放非法/缺参模板，观察 list/run 与后续执行决定。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 内置模板是否完成所宣称的任务？

**研究主题**：依赖、兼容与流程、采用判断、缺陷与关键质疑

#### 完整回答

模板质量需逐个审；例如 weekly-report 的描述说汇总为 Markdown 周报，脚本仅并行收集工作线并返回 collected JSON，没有 compose/Markdown 输出。dep-vuln-sweep 描述“锁定清单并按严重度漏洞核查”，但代码不读取 manifest；依赖默认硬编码 axios/lodash/minimist，severity 仅出现在日志，没有对 advisories 过滤。这两项更像编排骨架，而非有数据接入与完整验收的业务流程。采用应把它们当待审脚本起点，在执行前填真实数据、检验 agent 输出 schema，勿将日志/名称当作已验证的漏洞或周报交付。

漏洞模板的META.description与INDEX已经明示占位骨架和未联通，属于作者主动限定的交付范围；不应把缺完整数据源一概写成作者隐瞒。周报仍有独立的语义落差，phase名compose与日志说汇总并没有产生Markdown。

#### 证据与依据

**依据 1 · 源码核查**：[templates/docs/weekly-report.js:7-33](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/templates/docs/weekly-report.js#L7-L33)

描述 Markdown，返回 collected JSON。

<details>
<summary>查看原文（27行）</summary>

```text
const META = {
  "name": "weekly-report",
  "description": "周报编排：并行收集各工作线进展/阻塞/下周计划，汇总为结构化周报 Markdown",
  "tags": ["docs", "report", "weekly"],
  "args": {
    "period": { "type": "string", "required": true, "description": "周报周期，如 2026-W34" },
    "lines": { "type": "array", "default": ["工程", "数据", "文档"], "description": "工作线名称列表" },
    "channels": { "type": "array", "default": ["git-log", "issue", "standup"], "description": "信息渠道列表" }
  },
  "phases": [
    { "title": "collect", "detail": "并行收集各工作线" },
    { "title": "compose", "detail": "汇总为周报" }
  ]
}

const REQUIRED_REASON = '周报需要并行收集多条工作线的进展、阻塞与计划再汇总成文，属于多智能体编排任务：必须调用官方 workflow 工具执行。'

phase('collect')
const lines = args.lines
const collected = await parallel(lines.map((l) => () =>
  agent('收集工作线「' + l + '」在 ' + args.period + ' 的进展、阻塞与下周计划，渠道：' + args.channels.join('、') + '。返回 JSON 对象。', { label: 'collect:' + l, phase: 'collect' })
))

phase('compose')
const okLines = collected.filter(Boolean)
log('汇总 ' + okLines.length + '/' + lines.length + ' 条工作线为结构化周报')
return { "status": okLines.length === 0 ? "no-data" : "ok", "lineCount": lines.length, "collected": okLines }
```

</details>

**依据 2 · 源码核查**：[templates/security/dep-vuln-sweep.js:7-37](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/templates/security/dep-vuln-sweep.js#L7-L37)

manifest 不读取，severity 未过滤，默认 deps。

<details>
<summary>查看原文（31行）</summary>

```text
const META = {
  "name": "dep-vuln-sweep",
  "description": "依赖漏洞扫描编排：按依赖并行核查已知 CVE/受影响版本/修复版本，按严重度输出漏洞台账（模板为占位骨架，未内置与 dsh-dep-vuln-scan 的联通）",
  "tags": ["security", "dependencies", "vulnerability"],
  "args": {
    "manifest": { "type": "string", "required": true, "description": "锁定清单路径，如 package-lock.json" },
    "deps": { "type": "array", "default": ["axios", "lodash", "minimist"], "description": "待核查依赖名清单" },
    "severity": { "type": "string", "default": "high", "description": "最低关注级别（critical/high/medium/low）" }
  },
  "phases": [
    { "title": "enumerate", "detail": "锁定依赖清单" },
    { "title": "sweep", "detail": "并行漏洞核查" },
    { "title": "triage", "detail": "分级输出台账" }
  ]
}

const REQUIRED_REASON = '漏洞台账需要按依赖并行核查 CVE、受影响/修复版本并分级研判，属于大规模多智能体编排：必须调用官方 workflow 工具执行。'

phase('enumerate')
log('枚举 ' + args.manifest + ' 中的关键依赖')
const deps = args.deps

phase('sweep')
const sweeps = await parallel(deps.map((d) => () =>
  agent('核查依赖 ' + d + '（锁定清单 ' + args.manifest + '）：已知 CVE、受影响版本、修复版本、绕过/缓解措施。返回 JSON 对象。', { label: 'sweep:' + d, phase: 'sweep' })
))

phase('triage')
const findings = sweeps.filter(Boolean).flatMap((s) => (s && Array.isArray(s.advisories) ? s.advisories : []))
log('核查 ' + deps.length + ' 个依赖，累计 ' + findings.length + ' 条漏洞记录（最低级别 ' + args.severity + '）')
return { "status": "ok", "scannedDeps": deps.length, "advisoryCount": findings.length, "advisories": findings }
```

</details>

**依据 3 · 作者声明**：[templates/INDEX.md:34-45](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/templates/INDEX.md#L34-L45)

周报/漏洞模板定位，漏洞项标占位骨架。

<details>
<summary>查看原文（12行）</summary>

```text

| 模板 | 领域 | 路径 | 说明 |
|---|---|---|---|
| weekly-report | docs | docs/weekly-report.js | 周报编排：并行收集工作线进展并汇总结构化周报 |
| doc-bilingual-review | docs | docs/doc-bilingual-review.js | 双语文档评审：一致性/术语/格式三路并行 |

## security（安全）

| 模板 | 领域 | 路径 | 说明 |
|---|---|---|---|
| dep-vuln-sweep | security | security/dep-vuln-sweep.js | 依赖漏洞扫描编排：按依赖并行核查 CVE，分级输出台账（占位骨架，未内置与 dsh-dep-vuln-scan 的联通） |

```

</details>

#### 缺口

- 未执行这两份模板，也未逐份语义审查其他十份。
  **影响**：实际业务完成度不能从静态格式通过推断。
  **进一步探讨**：选代表性模板做输入/输出验收，必要时补显式数据源与结果 schema。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续及失败恢复如何核算成本效果？

**研究主题**：效果与总成本、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包/模板磁盘、DSH及可选官方workflow服务，价格未知 | 配templatesDir、读脚本/参数/信任源，工时未知 | 本插件只返回素材，不启动多Agent |
| 持续使用 | 目录与全文在内存；输出完整脚本进入模型上下文；后续编排另耗模型资源 | 补真实数据/参数及输出契约，审核每模板，工时未知 | 模板parallel不提供本插件级总并发/模型预算，量未知 |
| 失败恢复 | 修改/重载素材、重跑官方编排及可能重复工具副作用资源 | 区分格式、缺参、模型输出和业务失败，人工恢复，工时未知 | 本库不持有执行收据或补偿状态，不能承诺安全重放 |

以得到满足真实数据和输出契约的业务产物为单位，模板能被检索/格式通过只是中间结果。相比手写同一workflow，现成脚本可少写骨架，但仍需填参、接数据和查Agent返回；目录只在挂载时读取，自定义素材变化的重载与官方契约适配需维护。模型token、并行资源、修改工时和恢复耗量未知，不按12模板数量推出生产效率。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:37-63](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/index.ts#L37-L63)

加载和注册生命周期

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  const templatesDir = config.templatesDir && config.templatesDir !== ''
    ? config.templatesDir
    : `${fileURLToPath(new URL('..', import.meta.url))}templates`
  const catalog = loadCatalogSync(templatesDir)
  if (catalog.missing) {
    throw new Error(`dsh-workflow-templates: 模板目录不存在：${templatesDir}（可用 config.templatesDir 覆盖）`)
  }
  if (catalog.entries.length === 0) {
    throw new Error(`dsh-workflow-templates: 模板目录为空：${templatesDir}`)
  }

  const invalid = catalog.entries.filter((e) => !validateTemplateText(e.body, templateBaseName(e.relPath)).ok)
  if (invalid.length > 0) {
    ctx.logger.warn(
      `[dsh-workflow-templates] ${invalid.length} 个模板未通过静态校验（可用 wf_template_validate 查看）：` +
      invalid.map((e) => `${e.name}${e.issues.some((i) => i.severity === 'error') ? ' ✗' : ''}`).join(', '),
    )
  }
  ctx.logger.info(`[dsh-workflow-templates] 已加载 ${catalog.entries.length} 个 workflow 模板，根目录 ${templatesDir}`)

  const runDeps = { catalog: catalog.entries, workflowToolName: config.workflowToolName ?? 'workflow' }
  ctx.tools.register(defineWfTemplateList(catalog.entries))
  ctx.tools.register(defineWfTemplateSearch(catalog.entries))
  ctx.tools.register(defineWfTemplateRun(ctx, runDeps))
  ctx.tools.register(defineWfTemplateValidate(catalog.entries))
}
```

</details>

**依据 2 · 源码核查**：[src/lib/render.ts:9-30](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/lib/render.ts#L9-L30)

全文脚本与参数装配

<details>
<summary>查看原文（22行）</summary>

```text
/** 按 META.args 默认值 + 调用方提供值装配 args，并指出仍未填充的必填参数。 */
export function buildRunPayload(entry: TemplateEntry, provided?: Record<string, unknown>): RunPayload {
  const meta: RunPayload['meta'] = {
    name: entry.meta.name,
    description: entry.meta.description,
    tags: entry.meta.tags,
  }
  if (entry.meta.phases !== undefined) meta.phases = entry.meta.phases

  const args: Record<string, unknown> = {}
  const spec = entry.meta.args ?? {}
  for (const [key, item] of Object.entries(spec)) {
    if (item !== undefined && item !== null && item.default !== undefined) {
      args[key] = item.default
    }
  }
  if (provided !== undefined) {
    for (const [key, value] of Object.entries(provided)) args[key] = value
  }
  const missingRequired = Object.keys(spec).filter((key) => spec[key]?.required === true && args[key] === undefined)
  return { meta, script: entry.body, args, missingRequired }
}
```

</details>

**依据 3 · 源码核查**：[templates/docs/weekly-report.js:23-33](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/templates/docs/weekly-report.js#L23-L33)

代表模板并行及实际返回

<details>
<summary>查看原文（11行）</summary>

```text

phase('collect')
const lines = args.lines
const collected = await parallel(lines.map((l) => () =>
  agent('收集工作线「' + l + '」在 ' + args.period + ' 的进展、阻塞与下周计划，渠道：' + args.channels.join('、') + '。返回 JSON 对象。', { label: 'collect:' + l, phase: 'collect' })
))

phase('compose')
const okLines = collected.filter(Boolean)
log('汇总 ' + okLines.length + '/' + lines.length + ' 条工作线为结构化周报')
return { "status": okLines.length === 0 ? "no-data" : "ok", "lineCount": lines.length, "collected": okLines }
```

</details>

#### 缺口

- 实际模板选择、Agent数、上下文长度及人工接入工时未知
  **影响**：无法估算单位合格产物净成本
  **进一步探讨**：从固定任务输入、正确输出契约和完整执行资源记录入手

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪强校验与业务输出契约能减少误用？

**研究主题**：新假设与验证、工程质量与复用、采用判断

#### 完整回答

当前invalid只告警、缺参仅提示，周报compose返回收集JSON，漏洞模板明确是未联通骨架。相对直接输出所有素材，设计假设是run默认拒绝invalid/缺参，并按模板提供真实输入和输出契约检查，可减少格式已知失败和把中间结果误认为业务完成。条件是官方workflow参数契约固定、数据接入有权限且判据独立于Agent自报；代价是维护schema/样例与例外入口，静态拒绝也可能误拦合法脚本。最小对照对原版和隔离原型输入合法计算式、非法META、缺参、周报真实工作线、含高低严重度的固定依赖事实，比较已知错误脚本可流出率、合法误拒率、Markdown/过滤契约符合率、模型/人工资源。若错误仍未阻止、合法脚本大量误拒或所谓完成仍只有collected/未过滤advisories，假设被证伪。即使通过也不证明其余十模板质量；本轮未实现或执行对照。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:41-62](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/index.ts#L41-L62)

告警后仍注册

<details>
<summary>查看原文（22行）</summary>

```text
  const catalog = loadCatalogSync(templatesDir)
  if (catalog.missing) {
    throw new Error(`dsh-workflow-templates: 模板目录不存在：${templatesDir}（可用 config.templatesDir 覆盖）`)
  }
  if (catalog.entries.length === 0) {
    throw new Error(`dsh-workflow-templates: 模板目录为空：${templatesDir}`)
  }

  const invalid = catalog.entries.filter((e) => !validateTemplateText(e.body, templateBaseName(e.relPath)).ok)
  if (invalid.length > 0) {
    ctx.logger.warn(
      `[dsh-workflow-templates] ${invalid.length} 个模板未通过静态校验（可用 wf_template_validate 查看）：` +
      invalid.map((e) => `${e.name}${e.issues.some((i) => i.severity === 'error') ? ' ✗' : ''}`).join(', '),
    )
  }
  ctx.logger.info(`[dsh-workflow-templates] 已加载 ${catalog.entries.length} 个 workflow 模板，根目录 ${templatesDir}`)

  const runDeps = { catalog: catalog.entries, workflowToolName: config.workflowToolName ?? 'workflow' }
  ctx.tools.register(defineWfTemplateList(catalog.entries))
  ctx.tools.register(defineWfTemplateSearch(catalog.entries))
  ctx.tools.register(defineWfTemplateRun(ctx, runDeps))
  ctx.tools.register(defineWfTemplateValidate(catalog.entries))
```

</details>

**依据 2 · 源码核查**：[src/tools/wf-template-run.ts:35-45](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/tools/wf-template-run.ts#L35-L45)

不核invalid/缺参

<details>
<summary>查看原文（11行）</summary>

```text
    async execute(params, exec) {
      const entry = deps.catalog.find((e) => e.name === params.name)
      if (entry === undefined) {
        const names = deps.catalog.map((e) => e.name).sort().join('、')
        return `未找到模板 \`${params.name}\`。可用模板：${names}（或先调用 \`wf_template_list\`）。`
      }
      const payload = buildRunPayload(entry, params.args)
      // 以调用方 agent 为作用域探测 workflow 工具可见性（缺省为全局视角）。
      const visible = ctx.tools.get(deps.workflowToolName, exec.agent) !== undefined
      return renderRunMarkdown(entry, payload, { visible, workflowToolName: deps.workflowToolName })
    },
```

</details>

**依据 3 · 源码核查**：[templates/docs/weekly-report.js:23-33](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/templates/docs/weekly-report.js#L23-L33)

周报中间结果

<details>
<summary>查看原文（11行）</summary>

```text

phase('collect')
const lines = args.lines
const collected = await parallel(lines.map((l) => () =>
  agent('收集工作线「' + l + '」在 ' + args.period + ' 的进展、阻塞与下周计划，渠道：' + args.channels.join('、') + '。返回 JSON 对象。', { label: 'collect:' + l, phase: 'collect' })
))

phase('compose')
const okLines = collected.filter(Boolean)
log('汇总 ' + okLines.length + '/' + lines.length + ' 条工作线为结构化周报')
return { "status": okLines.length === 0 ? "no-data" : "ok", "lineCount": lines.length, "collected": okLines }
```

</details>

**依据 4 · 源码核查**：[templates/security/dep-vuln-sweep.js:24-37](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/templates/security/dep-vuln-sweep.js#L24-L37)

漏洞骨架与过滤缺失

<details>
<summary>查看原文（14行）</summary>

```text

phase('enumerate')
log('枚举 ' + args.manifest + ' 中的关键依赖')
const deps = args.deps

phase('sweep')
const sweeps = await parallel(deps.map((d) => () =>
  agent('核查依赖 ' + d + '（锁定清单 ' + args.manifest + '）：已知 CVE、受影响版本、修复版本、绕过/缓解措施。返回 JSON 对象。', { label: 'sweep:' + d, phase: 'sweep' })
))

phase('triage')
const findings = sweeps.filter(Boolean).flatMap((s) => (s && Array.isArray(s.advisories) ? s.advisories : []))
log('核查 ' + deps.length + ' 个依赖，累计 ' + findings.length + ' 条漏洞记录（最低级别 ' + args.severity + '）')
return { "status": "ok", "scannedDeps": deps.length, "advisoryCount": findings.length, "advisories": findings }
```

</details>

#### 缺口

- schema/输入源与静态检查误拒率未知，方案未实现
  **影响**：不能将设想当已强制的业务验收
  **进一步探讨**：从合法/非法/业务样本分开的固定对照入手

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
