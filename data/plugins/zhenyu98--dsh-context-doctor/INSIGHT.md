# Context Doctor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[41d5c2e](https://github.com/Zhenyu98/dsh-context-doctor/tree/41d5c2e4bbe0611b7928c4007bb28545f7ace38f)

<!-- BEGIN META -->
[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Zhenyu98/dsh-context-doctor)
<!-- END META -->

> **功能**：只读扫描 DSH 指令、技能目录与工具信息，估算上下文成本并给出重复和冲突线索。

> **亮点**：它把上下文排查从总量变成文件/技能/工具条目的归因线索，并让工具与面板复用同一报告，回执明确标出trimmed不可观测。增量是可复查诊断，不是精确tokenizer或已验证降低成本，见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：扫描估算不等于实际请求。工具参数未计token、读取失败会跳过、rank为来源启发式，重复未必可删；HTTP自身无鉴权或cwd授权规则，外层边界本轮未确认，不能把只读当作不披露信息，见 [Q03](#research-q03)。

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
  - [Q01 · 谁需要注入审计，相对计量条和手工检查增加什么？](#detail-section-11)
  - [Q02 · 指令、skills、tool/MCP 如何扫描估算并呈现？](#detail-section-12)
  - [Q03 · 哪些缺口影响裁剪和远程读取边界？](#detail-section-13)
  - [Q04 · 一次只读审计的成本、恢复与采用条件是什么？](#detail-section-14)
  - [Q05 · 如何验证由估算到实际裁剪效果的假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要定位DSH上下文膨胀来源的维护者，按指令、技能和工具/MCP给出估算与可定位回执；适用于诊断而非精确账单。

比较原生总计量条和人工逐文件查找。来源定位新增解释入口，实际模型token、最终装配和裁剪轨迹仍未取得，不能据估算数与颜色自动删减，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| context_audit | 只读定位指令/技能/工具来源 | 需要正确cwd和scope，非完整实际prompt快照 |
| developer回执 | 路径、条目、字节和重复线索定位 | 含短片段/元数据，trimmed unavailable |
| 规则重复与rank分析 | 筛选值得人工检查的候选 | 不证明冗余可删或真实胜出，固定启发式 |
| 会话面板与HTTP缓存 | 同一报告的可视比较和手动刷新 | 默认60秒缓存，HTTP自身不含访问鉴权/目录授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.19、Cordis^4.0.1、dsh-tools^0.1.2-rc.1 | 必需，包声明 | Host工具运行 | 作者提示Client版本错配可影响shell，本轮未验证 |
| fs/skills/tools及会话agent scope | 对应扫描必需 | 指令/目录/可见schema归因 | 缺scope或查询异常可能空/全局降级，不能当无注入 |
| webServer与Client slots/locale/store | 面板特定功能 | HTTP报告和输入行控件 | headless可保留工具；HTTP授权仍需外层核验 |
| 非敏感可读目录 | 安全诊断前提 | 路径、描述和重复片段会进入报告 | 只读不等于不披露，公开Host不宜直接试 |
| 实际装配trace与tokenizer | 精确裁剪验证另需 | 核对真正请求与任务质量 | 本版未提供，trimmed不可观测 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份profile并准备已知非敏感样本 | 明确宿主、插件、cwd与HTTP访问边界 |
| 审计 | 工具按会话scope读，面板按session获取回执 | 来源条目与样本对应，零项先查覆盖和scope |
| 判断 | 用户定向看原件与重复关系 | 不把估算/颜色当可删结论，修改需对应授权 |
| 验证/退出 | 修改后核对真实任务；不合要求移除重启 | 报告输出不能撤回，退回手工与原生计量 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Host/构建或安装资源，金额未知 | profile备份、兼容和样本检查 | 本轮未安装，不能推断耗时很低 |
| 持续诊断 | 文件读取、可选正文与报告上下文，金额未知 | 核对scope、TTL旧值和建议 | 报告自身消耗上下文，token估算非账单 |
| 失败恢复 | 重扫及兼容排障资源未知 | 分清不可读、缺scope、缓存和装配差异 | 当前结果不列完整覆盖错误，不自动填零解释 |
| 退出 | 已输出给模型/客户端的信息无法撤回 | 移除重启或恢复原profile | 不修改业务文件但仍有报告披露责任 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 来源定位 | 按文件/技能/工具生成统计与receipt | 与真实每次请求装配的一致性 |
| 冗余线索 | 完全重复段落、描述及rank启发式 | 是否应删、是否会损害约束和任务质量 |
| 成本解释 | 字符比例token及完整schema字节 | 真正tokenizer计数、账单与优化节省 |
| 面板诊断 | 同会话HTTP缓存和刷新 | 当前宿主可用、远程授权和端到端隐私边界 |

> **思考**：扫描估算不等于实际请求。工具参数未计token、读取失败会跳过、rank为来源启发式，重复未必可删；HTTP自身无鉴权或cwd授权规则，外层边界本轮未确认，不能把只读当作不披露信息，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把上下文排查从总量变成文件/技能/工具条目的归因线索，并让工具与面板复用同一报告，回执明确标出trimmed不可观测。增量是可复查诊断，不是精确tokenizer或已验证降低成本，见 [Q01](#research-q01)、[Q02](#research-q02)。

工具与面板共用引擎、文件路径/内容去重、按会话与语言缓存及显式trimmed unknown值得借鉴。参数字节与token口径分离、跳过无覆盖错误、固定rank和无自身鉴权的HTTP边界需明确解释；统计含src及入库lib产物，不能相加当原创代码量，见 [Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

扫描估算不等于实际请求。工具参数未计token、读取失败会跳过、rank为来源启发式，重复未必可删；HTTP自身无鉴权或cwd授权规则，外层边界本轮未确认，不能把只读当作不披露信息，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在受控本机profile用非敏感已知样本做来源诊断，核对cwd和scope；需要定位再取developer。任何裁剪先独立读原件并获得写入授权，随后验证真实任务。不用于精确计费或完整prompt审计；HTTP边界未确认或样本对不上就停止，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查只读扫描、规则分析、回执及工具/HTTP/Client链；精确token、最终装配、HTTP外层授权、当前宿主与裁剪收益未验证。只建议本机非敏感已知样本的限定诊断试用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、src/index.ts、src/audit.ts、src/scan.ts、src/analyze.ts、src/tokens.ts、src/routes.ts、src/client/index.ts、src/client/store.ts、src/client/ContextAuditRing.tsx、tsdown.config.ts、tsdown.client.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定源码与已入库lib代表线索，不重建或运行目标；Host/Client与扫描完整主链已读，未验证当前宿主、精确tokenizer、最终装配或HTTP外层认证。统计包含源与构建产物，非原创量。
- 下一步：后续用大参数工具、重复但不同作用域指令、不可读/超大文件及缓存变更样本，对照实际装配/tokenizer和任务质量；先核验HTTP边界，报告不默认保存完整prompt。本轮未执行。

**分析版本**

- **仓库**：[Zhenyu98/dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor)
- **版本号**：0.7.2（[固定提交 41d5c2e](https://github.com/Zhenyu98/dsh-context-doctor/tree/41d5c2e4bbe0611b7928c4007bb28545f7ace38f)）
- **版本日期**：2026-09-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可将实际装配trace与同tokenizer结果并列，区分候选/注入/裁剪/不可观测，再用固定任务回归检验建议。实际token虽降但任务质量下降、或不可观测被当空，即否定安全优化主张；本轮未执行，见 [Q05](#research-q05)。

后续用大参数工具、重复但不同作用域指令、不可读/超大文件及缓存变更样本，对照实际装配/tokenizer和任务质量；先核验HTTP边界，报告不默认保存完整prompt。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 275 | — | — | 3457 |
| .js | source | 13 | 3343 | 2970 | 432 | — |
| .mjs | source | 1 | 147 | 100 | 37 | — |
| .ts | source | 12 | 1719 | 1280 | 318 | — |
| .tsx | source | 1 | 412 | 333 | 45 | — |
| .ts | test | 8 | 864 | 713 | 70 | — |

</details>

**活跃度**

[![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/Zhenyu98/dsh-context-doctor/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Zhenyu98/dsh-context-doctor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：来源级上下文审计能支持哪些诊断，何时不足以代表实际请求或安全裁剪？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要注入审计，相对计量条和手工检查增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标人群是维护较多项目指令、技能目录和工具/MCP配置的DSH开发者，尤其是看到上下文计量变大却不知道从哪里检查的人。相对只看宿主计量条，插件把可观测来源拆为指令、技能描述、原生工具和MCP，并提供文件/条目定位、重复线索及建议；相对手工翻文件，它把相同报告同时交给模型工具与会话面板。合格结果是准确标出这次扫描的cwd、scope、覆盖与估算性质，帮助人定位问题，而非自动删除“浪费”。

这是原生Host/Client插件，context_audit只读取并返回报告，面板经HTTP复用同一引擎。工具不会裁剪或改文件；模型收到建议后的写入是另一个动作，不能以“审计工具只读”给后续修改授权。已有增量是按来源归因和可定位回执，不是新的tokenizer，也不证明总请求费用或任务效果改善。

README“模型每个请求到底背着多少”的主张必须收窄。实现扫描磁盘指令和注册表视图，未接最终prompt装配轨迹；trimmed固定unavailable。全局system提示、动态工具调用、按需正文和实际模型编码不被完整反演，因而报告不是某个真实请求的完整快照。只有在明确这些条件后，来源比较才有诊断意义。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-45](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/README.md#L35-L45)

作者提出计量归因及重复/冲突场景。

<details>
<summary>查看原文（11行）</summary>

```text
## Why

DSH 会话里，模型每个请求都自动携带一批注入物：层层叠加的 `AGENTS.md` 指令链、一百多个技能的目录摘要、几十个工具 schema、MCP 工具面。它们悄悄消耗输入 token，且经常出现跨文件重复段落、同名技能互相遮蔽、工具面膨胀——但平时没人量化，问题到上下文告警时才暴露。

| 之前 | 之后 |
|---|---|
| 只能靠上下文计量条猜个大概，说不清是谁在消耗 | 指令链 / 技能 catalog / 工具 schema / MCP 四项逐项给出 token 估算 |
| 重复指令、重复技能描述散落在各层文件里，无人察觉 | 自动检测跨文件完全相同的重复段落、描述完全相同的冗余技能 |
| 同名技能多来源并存时被静默遮蔽，模型用的是哪个要靠猜 | 报告冲突胜出者与被遮蔽者（rank shadow） |
| 看到告警只能手工翻文件找线索 | 模型可直接调用 `context_audit` 拿到分节报告与按严重度排序的裁剪建议 |

```

</details>

**依据 2 · 源码核查**：[src/index.ts:60-105](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/index.ts#L60-L105)

context_audit的实际注册与只读runAudit调用。

<details>
<summary>查看原文（46行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'context_audit',
    description:
      'Audit what this session injects into every model request: the AGENTS.md / CLAUDE.md '
      + 'instruction chain, the skills catalog, tool schemas, and MCP tools. Estimates the token '
      + 'cost of each, detects blocks duplicated across files, skills sharing one description, '
      + 'same-name skills shadowing each other, and MCP tool-surface bloat, then returns trimming '
      + 'suggestions ordered by severity. Read-only: it never modifies a file.',
    parameters: {
      cwd: { type: 'string', description: 'Directory to audit from. Defaults to the current session workspace.' },
      includeSkillBodies: {
        type: 'boolean',
        description: 'Also total the tokens of skill bodies. Loads each body, so it is slower. Defaults to false.',
      },
      maxSkillBodies: {
        type: 'number',
        description: 'How many skill bodies to count when includeSkillBodies is set. Defaults to 20.',
      },
      detail: {
        type: 'string',
        enum: ['summary', 'developer'],
        description: 'Output level: "summary" for the digest, "developer" to also attach a per-entry context-audit receipt.',
      },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value: Record<string, JsonValue>) => [
        { type: 'text', text: renderReport(value as unknown as AuditReport, reportLocale()) },
      ],
    },
    async execute(args, exec): Promise<Record<string, JsonValue>> {
      const agentCwd = (exec.agent as { session?: { header?: { cwd?: string } } } | undefined)
        ?.session?.header?.cwd
      const cwd = args.cwd ?? agentCwd ?? config.defaultCwd ?? process.cwd()
      const report = await runAudit(deps, {
        cwd,
        signal: exec.signal,
        ...(args.includeSkillBodies !== undefined ? { includeSkillBodies: args.includeSkillBodies } : {}),
        ...(args.maxSkillBodies !== undefined ? { maxSkillBodies: args.maxSkillBodies } : {}),
        ...(args.detail === 'developer' ? { detail: 'developer' as const } : {}),
        ...(exec.agent !== undefined ? { agent: exec.agent } : {}),
        locale: reportLocale(),
      })
      // AuditReport 结构保证值全部 JSON 安全；断言仅为满足 defineTool 的 JsonValue 签名。
      return report as unknown as Record<string, JsonValue>
    },
```

</details>

**依据 3 · 源码核查**：[src/audit.ts:125-147](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/audit.ts#L125-L147)

引擎读取一次技能列表并并行扫描三类来源。

<details>
<summary>查看原文（23行）</summary>

```text

  const [instructions, skillCatalog, toolSchemas] = await Promise.all([
    scanInstructionChain(fs, cwd, signal),
    scanSkillCatalog(skillList, signal),
    scanToolSchemas(tools, options.agent, signal),
  ])

  // 可选：统计技能正文总 token（前 N 个）
  let bodies: { count: number; totalTokens: number } | undefined
  if (options.includeSkillBodies === true) {
    const max = Math.max(1, Math.min(options.maxSkillBodies ?? 20, 100))
    let count = 0
    let totalTokens = 0
    for (const summary of skillList.slice(0, max)) {
      try {
        const def = await skills.get(summary.name, skillLookup)
        if (def !== undefined) {
          count++
          totalTokens += estimateTokens(def.content)
        }
      } catch {
        // 单个技能加载失败不影响整体
      }
```

</details>

**依据 4 · 源码核查**：[src/audit.ts:259-276](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/audit.ts#L259-L276)

开发回执明确trimmed unavailable，不能反演最终裁剪。

<details>
<summary>查看原文（18行）</summary>

```text

  return {
    kind: 'context-audit-receipt',
    version: 1,
    detail: 'developer',
    agentsFiles,
    skills,
    toolSchemas: { totalBytes: schemaItems.reduce((total, item) => total + item.bytes, 0), items: schemaItems },
    duplicateMcpEntries,
    shadowedSkills: input.conflicts,
    trimmed: { status: 'unavailable', items: [] },
    repairPlan: input.suggestions,
  }
}

/** SkillSummary 的 rank 不在公开类型里；按来源给启发式排序值（与官方 rank 语义一致：低者胜）。 */
export function rankOfSource(source: string): number {
  switch (source) {
```

</details>

#### 缺口

- 缺少真实请求装配轨迹与优化前后合格任务对照。
  **影响**：不能把扫描估算当实际账单，或声称裁剪后已节省且不损害质量。
  **进一步探讨**：对同一任务保存授权的实际装配/tokenizer结果，再逐项核对来源差异与任务输出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 指令、skills、tool/MCP 如何扫描估算并呈现？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

package指向已入库lib/index.js和Client构建，bundle patch插入context-doctor。Host注入fs/skills/tools/sessions，工具cwd优先显式参数、其次agent会话header、配置及进程cwd；把exec.signal和agent传给runAudit。HTTP按session取会话cwd与agent，Client在conversation.input.right注册控件，挂载或手动刷新时请求developer回执；卸载/刷新会abort旧浏览器fetch。已抽读入库lib入口确认相同token估算、context_audit和回执标记存在，未证明完整构建可重现。

指令扫描从cwd向上遇到第一个.git即停，再从该根到cwd逐层读AGENTS.md/CLAUDE.md。它按resolve后的真实路径及全文相同去重，超过256KiB或读取失败跳过，留下文件字节、估算token和跨文件段落重复。非git路径找不到根时只扫描起点，不能据结果推断系统所有指令来源。

skills.list带cwd和agent scope，目录token只累计description，不含名称及完整catalog包装；可选正文最多前100个、默认20个，按需get且失败略过。工具schemas优先带agent，异常退回全局，再异常为空。每个schema完整序列化用于bytes和签名，但token数只算name+description，参数JSON未计；MCP按mcp__server__tool名称解析，不是查询服务器真实身份。

重复段落要求连续非空行且长度至少40，同文件重复只算一次；描述比较会去大小写并合并空白。同名技能胜者按固定source rank和provider排序推断，不是读取宿主真正的胜出轨迹。token算法是ASCII/4与非ASCII/1.5上取整。面板原生工具与MCP分开显示，避免把MCP子集重复相加，这改善展示一致性但不增加估算准确度。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:5-36](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/package.json#L5-L36)

Host/Client产物入口与宿主模块依赖。

<details>
<summary>查看原文（32行）</summary>

```text
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-store",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-renderer"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/cordis.patch.yml#L1-L4)

bundle插入插件。

```text
# context-doctor bundle patch：把插件挂进 profile
- insert:
    - id: context-doctor
      name: 'dsh-context-doctor'
```

**依据 3 · 源码核查**：[src/index.ts:89-104](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/index.ts#L89-L104)

工具cwd、signal与agent实际传递。

<details>
<summary>查看原文（16行）</summary>

```text
    },
    async execute(args, exec): Promise<Record<string, JsonValue>> {
      const agentCwd = (exec.agent as { session?: { header?: { cwd?: string } } } | undefined)
        ?.session?.header?.cwd
      const cwd = args.cwd ?? agentCwd ?? config.defaultCwd ?? process.cwd()
      const report = await runAudit(deps, {
        cwd,
        signal: exec.signal,
        ...(args.includeSkillBodies !== undefined ? { includeSkillBodies: args.includeSkillBodies } : {}),
        ...(args.maxSkillBodies !== undefined ? { maxSkillBodies: args.maxSkillBodies } : {}),
        ...(args.detail === 'developer' ? { detail: 'developer' as const } : {}),
        ...(exec.agent !== undefined ? { agent: exec.agent } : {}),
        locale: reportLocale(),
      })
      // AuditReport 结构保证值全部 JSON 安全；断言仅为满足 defineTool 的 JsonValue 签名。
      return report as unknown as Record<string, JsonValue>
```

</details>

**依据 4 · 源码核查**：[src/scan.ts:39-73](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/scan.ts#L39-L73)

取首次.git及根到cwd层序。

<details>
<summary>查看原文（35行）</summary>

```text
 * AGENTS.md / CLAUDE.md，与 DSH 的 workspace instruction 注入链对齐。
 */
export async function scanInstructionChain(
  fs: FileSystem,
  cwd: string,
  signal: AbortSignal,
): Promise<InstructionChainResult> {
  // 1. 找 git 根
  let root = cwd
  let current = cwd
  for (;;) {
    if (await pathExists(fs, join(current, '.git'), signal)) {
      root = current
      break
    }
    const parent = dirname(current)
    if (parent === current) break
    current = parent
  }

  // 2. 从 cwd 向上收集到 root 的层级，再反转成外层 → 内层
  const layers: string[] = []
  current = cwd
  for (;;) {
    layers.push(current)
    if (current === root) break
    const parent = dirname(current)
    if (parent === current) break
    current = parent
  }
  layers.reverse()

  // 3. 逐层读指令文件
  //
  // 去重是必须的，否则报告会和模型实际看到的对不上（issue #8）。宿主的注入链
```

</details>

**依据 5 · 源码核查**：[src/scan.ts:86-128](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/scan.ts#L86-L128)

真实路径/相同内容去重和大小/读取失败跳过。

<details>
<summary>查看原文（43行）</summary>

```text
      try {
        target = await fs.resolve(fullPath, { signal })
      } catch {
        continue // 不存在 / 不可解析
      }
      // 符号链接在 resolve 后归一到同一真实路径，据此判重。
      const realPath = fs.processPath(target)
      if (seenPaths.has(realPath)) continue
      let info
      try {
        info = await fs.stat(target, signal)
      } catch {
        continue
      }
      if (info === undefined || info.type !== 'file') continue
      if (info.size !== undefined && info.size > MAX_FILE_BYTES) continue
      let text: string
      try {
        text = await fs.readText(target, signal)
      } catch {
        continue
      }
      // 内容逐字节相同的另一个文件：宿主同样只注入一份。
      if (rawFiles.some((file) => file.content === text)) {
        seenPaths.add(realPath)
        continue
      }
      seenPaths.add(realPath)
      rawFiles.push({
        path: realPath,
        bytes: info.size ?? Buffer.byteLength(text),
        tokens: estimateTokens(text),
        content: text,
      })
    }
  }

  const totalTokens = rawFiles.reduce((acc, f) => acc + f.tokens, 0)
  const duplicateBlocks = findDuplicateBlocks(rawFiles.map((f) => ({ path: f.path, content: f.content })))
  return {
    root,
    files: rawFiles.map(({ content: _content, ...rest }) => rest),
    totalTokens,
```

</details>

**依据 6 · 源码核查**：[src/scan.ts:157-182](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/scan.ts#L157-L182)

技能只累计description及归一重复描述。

<details>
<summary>查看原文（26行）</summary>

```text
    count: skillList.length,
    totalDescriptionTokens: total,
    bySource: [...bySource.entries()]
      .map(([source, v]) => ({ source, ...v }))
      .sort((a, b) => b.descriptionTokens - a.descriptionTokens),
    duplicateDescriptions: skillList.map((s) => ({ name: s.name, description: s.description }))
      .filter((s) => s.description !== '')
      .reduce<{ name: string; description: string; count: number }[]>((acc, s) => {
        const key = s.description.trim().toLowerCase().replace(/\s+/g, ' ')
        const hit = acc.find((h) => h.description.trim().toLowerCase().replace(/\s+/g, ' ') === key)
        if (hit !== undefined) hit.count++
        else acc.push({ ...s, count: 1 })
        return acc
      }, [])
      .filter((h) => h.count >= 2)
      .sort((a, b) => b.count - a.count),
  }
}

/** 工具 schema（模型每请求都会看到的固定成本）。 */
export interface ToolSchemaResult {
  visibleCount: number
  schemaTokens: number
  nativeCount: number
  nativeTokens: number
  mcp: McpSummary
```

</details>

**依据 7 · 源码核查**：[src/scan.ts:189-230](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/scan.ts#L189-L230)

工具schema可见性降级、完整字节与部分token统计。

<details>
<summary>查看原文（42行）</summary>

```text
export async function scanToolSchemas(
  tools: ToolRuntime,
  agent: unknown,
  signal: AbortSignal,
): Promise<ToolSchemaResult> {
  void signal
  let schemas: { name: string; description?: string; parameters?: unknown }[] = []
  try {
    schemas = tools.schemas(agent as never)
  } catch {
    try {
      schemas = tools.schemas()
    } catch {
      schemas = []
    }
  }
  let schemaTokens = 0
  let nativeCount = 0
  let nativeTokens = 0
  const items: ToolSchemaResult['items'] = []
  const mcpDuplicates = new Map<string, { name: string; server: string; bytes: number }[]>()
  for (const schema of schemas) {
    const serialised = stableJson(schema)
    const bytes = new TextEncoder().encode(serialised).byteLength
    const tokens = estimateTokens(schema.name) + estimateTokens(schema.description ?? '')
    const server = schema.name.startsWith('mcp__') ? schema.name.split('__')[1] ?? 'unknown' : undefined
    const schemaHash = hashSchema(schema.name.startsWith('mcp__')
      ? stableJson({ description: schema.description ?? '', parameters: schema.parameters ?? null })
      : serialised)
    items.push({ name: schema.name, bytes, tokens, schemaHash, ...(server !== undefined ? { server } : {}) })
    if (server !== undefined) {
      const duplicate = mcpDuplicates.get(schemaHash) ?? []
      duplicate.push({ name: schema.name, server, bytes })
      mcpDuplicates.set(schemaHash, duplicate)
    }
    schemaTokens += tokens
    if (schema.name.startsWith('mcp__')) continue
    nativeCount++
    nativeTokens += tokens
  }
  const mcp = groupMcpTools(schemas)
  return { visibleCount: schemas.length, schemaTokens, nativeCount, nativeTokens, mcp, items, mcpDuplicates }
```

</details>

**依据 8 · 源码核查**：[src/analyze.ts:47-70](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/analyze.ts#L47-L70)

跨文件段落最小长度和同文件去重。

<details>
<summary>查看原文（24行）</summary>

```text
export function findDuplicateBlocks(files: FileContent[], minLen = 40): DuplicateBlock[] {
  const buckets = new Map<string, string[]>()
  for (const file of files) {
    const seen = new Set<string>()
    for (const block of splitBlocks(file.content)) {
      if (block.length < minLen || seen.has(block)) continue
      seen.add(block)
      const list = buckets.get(block)
      if (list !== undefined) list.push(file.path)
      else buckets.set(block, [file.path])
    }
  }
  const out: DuplicateBlock[] = []
  for (const [text, paths] of buckets) {
    if (paths.length >= 2) {
      out.push({ text, tokens: estimateTokens(text), paths: [...paths].sort() })
    }
  }
  return out.sort((a, b) => b.tokens - a.tokens)
}

function normalizeDescription(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}
```

</details>

**依据 9 · 源码核查**：[src/audit.ts:277-289](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/audit.ts#L277-L289)

source rank固定启发式。

<details>
<summary>查看原文（13行）</summary>

```text
    case 'project-dsh': return 100
    case 'project-agents': return 200
    case 'runtime': return 250
    case 'user-dsh': return 300
    case 'user-agents': return 400
    case 'custom': return 500
    case 'bundled': return 600
    default: return 900
  }
}

interface SuggestionInput {
  instructions: { totalTokens: number; duplicateBlocks: { tokens: number; paths: string[] }[] }
```

</details>

**依据 10 · 源码核查**：[src/tokens.ts:9-17](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/tokens.ts#L9-L17)

具体token估算算法。

```text
export function estimateTokens(text: string): number {
  let ascii = 0
  let nonAscii = 0
  for (const ch of text) {
    if (ch.codePointAt(0)! < 0x80) ascii++
    else nonAscii++
  }
  return Math.ceil(ascii / 4 + nonAscii / 1.5)
}
```

**依据 11 · 源码核查**：[src/client/index.ts:38-52](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/client/index.ts#L38-L52)

Client实际注册原生输入行槽位。

<details>
<summary>查看原文（15行）</summary>

```text
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'context-doctor: dictionaries')

  const store = createAuditStore()

  ctx.slots.inject('conversation.input.right', () =>
    ctx.slots.register({
      name: 'conversation.input.right',
      // `.right` is a list seat: `id` identifies this occupant and `order`
      // fixes where it lands if another plugin ever shares the row.
      id: 'context-doctor',
      order: 20,
      store,
      locale: NS,
    }, ContextAuditRing))
}
```

</details>

**依据 12 · 源码核查**：[src/client/ContextAuditRing.tsx:181-208](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/client/ContextAuditRing.tsx#L181-L208)

会话参数、fetch与abort旧请求。

<details>
<summary>查看原文（28行）</summary>

```text
  const refresh = useCallback(() => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    actions.setState('loading', null)
    // `detail=developer` carries the per-entry receipt the breakdown lists.
    // `lang` is sent explicitly because the host cannot resolve the panel's
    // language on its own: the stored preference is optional and its absence
    // means "follow the browser" (issue #11). The locale plugin keeps
    // `<html lang>` on the active locale, so that is the reading to forward.
    const lang = document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
    const url = `${AUDIT_API}?session=${encodeURIComponent(sessionId)}&detail=developer&lang=${lang}`
    void fetch(url, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error(`audit ${response.status}`)
      return response.json() as Promise<{ ok: boolean; report: AuditUiState['report'] }>
    }).then(data => {
      if (controller.signal.aborted) return
      if (data.ok && data.report !== null && data.report !== undefined) actions.setReport(data.report)
      else actions.setState('error', 'empty audit response')
    }, () => {
      if (!controller.signal.aborted) actions.setState('error', 'audit transport error')
    })
  }, [actions, sessionId])

  useEffect(() => {
    refresh()
    return () => controllerRef.current?.abort()
  }, [refresh])
```

</details>

**依据 13 · 源码核查**：[lib/index.js:1-18](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/lib/index.js#L1-L18)

入库运行入口沿用启发式估算与外置宿主运行时。

<details>
<summary>查看原文（18行）</summary>

```text
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
//#region lib/types/tokens.js
/**
* 启发式 token 估算。
*
* 不依赖外部 tokenizer：英文（ASCII）约 4 字符/token，中文等非 ASCII 约 1.5
* 字符/token。结果用于比较相对成本与趋势，不是精确计数（精确值以模型
* tokenizer 为准）。
*/
function estimateTokens(text) {
	let ascii = 0;
	let nonAscii = 0;
	for (const ch of text) if (ch.codePointAt(0) < 128) ascii++;
	else nonAscii++;
	return Math.ceil(ascii / 4 + nonAscii / 1.5);
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些缺口影响裁剪和远程读取边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

首先，数值不能当总token。名称/描述之外的工具参数未计，技能名称和catalog包装未计，tokenizer仅按字符比例估算；另一方面扫描的文件不一定在当前模型的最终装配中。跳过大文件、无权限和工具schema查询失败没有显式覆盖错误集合，空项可能来自不可读或缺scope，不是已证明没有成本。developer回执有完整schema字节与签名，却仍不能把bytes换成精确token，也不能从trimmed=unavailable推断无裁剪。

其次，重复不等于可删。完全相同段落或归一化描述可能是在不同作用域刻意重复，固定source rank不能证明真实技能胜者；MCP签名是32位FNV-1a，适合作为诊断分组线索，不能作为无碰撞的安全身份或自动删除依据。建议由固定阈值触发，指令8000、技能描述3000、MCP4000或20工具等属于经验规则，未绑定模型窗口或任务质量；颜色和severity都不证明任务会失败。

第三，只读不代表数据不出环境。报告含真实路径、技能描述、工具信息和重复段落短预览，工具结果会进入模型上下文；HTTP developer回执也会返回这些内容。makeAuditRoutes只检查GET并接受显式cwd/session，不自行鉴权或限制允许扫描的目录；Host通过webServer.register直接注册。因此实际远程访问边界取决于宿主外层/网络配置，本轮未确认，不能宣称已存在未授权访问漏洞，也不能把“同源请求”当安全门。

缓存按detail/locale/session/cwd隔离，最长默认60秒并限32项，失败删除缓存；这减少重复读取，但文件和注册表变化在TTL内可能仍显示旧值，浏览器abort也不会取消Host新建的独立signal审计。试用宜限定本机、已知非敏感目录，裁剪前独立读取并经授权。

#### 证据与依据

**依据 1 · 源码核查**：[src/scan.ts:95-114](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/scan.ts#L95-L114)

不可读/超大文件被静默跳过。

<details>
<summary>查看原文（20行）</summary>

```text
      try {
        info = await fs.stat(target, signal)
      } catch {
        continue
      }
      if (info === undefined || info.type !== 'file') continue
      if (info.size !== undefined && info.size > MAX_FILE_BYTES) continue
      let text: string
      try {
        text = await fs.readText(target, signal)
      } catch {
        continue
      }
      // 内容逐字节相同的另一个文件：宿主同样只注入一份。
      if (rawFiles.some((file) => file.content === text)) {
        seenPaths.add(realPath)
        continue
      }
      seenPaths.add(realPath)
      rawFiles.push({
```

</details>

**依据 2 · 源码核查**：[src/scan.ts:189-230](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/scan.ts#L189-L230)

schema查询失败降级及参数不计token。

<details>
<summary>查看原文（42行）</summary>

```text
export async function scanToolSchemas(
  tools: ToolRuntime,
  agent: unknown,
  signal: AbortSignal,
): Promise<ToolSchemaResult> {
  void signal
  let schemas: { name: string; description?: string; parameters?: unknown }[] = []
  try {
    schemas = tools.schemas(agent as never)
  } catch {
    try {
      schemas = tools.schemas()
    } catch {
      schemas = []
    }
  }
  let schemaTokens = 0
  let nativeCount = 0
  let nativeTokens = 0
  const items: ToolSchemaResult['items'] = []
  const mcpDuplicates = new Map<string, { name: string; server: string; bytes: number }[]>()
  for (const schema of schemas) {
    const serialised = stableJson(schema)
    const bytes = new TextEncoder().encode(serialised).byteLength
    const tokens = estimateTokens(schema.name) + estimateTokens(schema.description ?? '')
    const server = schema.name.startsWith('mcp__') ? schema.name.split('__')[1] ?? 'unknown' : undefined
    const schemaHash = hashSchema(schema.name.startsWith('mcp__')
      ? stableJson({ description: schema.description ?? '', parameters: schema.parameters ?? null })
      : serialised)
    items.push({ name: schema.name, bytes, tokens, schemaHash, ...(server !== undefined ? { server } : {}) })
    if (server !== undefined) {
      const duplicate = mcpDuplicates.get(schemaHash) ?? []
      duplicate.push({ name: schema.name, server, bytes })
      mcpDuplicates.set(schemaHash, duplicate)
    }
    schemaTokens += tokens
    if (schema.name.startsWith('mcp__')) continue
    nativeCount++
    nativeTokens += tokens
  }
  const mcp = groupMcpTools(schemas)
  return { visibleCount: schemas.length, schemaTokens, nativeCount, nativeTokens, mcp, items, mcpDuplicates }
```

</details>

**依据 3 · 源码核查**：[src/scan.ts:242-246](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/scan.ts#L242-L246)

诊断签名是FNV-1a32位。

```text
function hashSchema(value: string): string {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619)
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`
}
```

**依据 4 · 源码核查**：[src/audit.ts:277-289](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/audit.ts#L277-L289)

rank为来源启发式，不是宿主实际胜出日志。

<details>
<summary>查看原文（13行）</summary>

```text
    case 'project-dsh': return 100
    case 'project-agents': return 200
    case 'runtime': return 250
    case 'user-dsh': return 300
    case 'user-agents': return 400
    case 'custom': return 500
    case 'bundled': return 600
    default: return 900
  }
}

interface SuggestionInput {
  instructions: { totalTokens: number; duplicateBlocks: { tokens: number; paths: string[] }[] }
```

</details>

**依据 5 · 源码核查**：[src/audit.ts:312-368](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/audit.ts#L312-L368)

固定阈值生成建议，未用模型任务效果。

<details>
<summary>查看原文（57行）</summary>

```text
  const out: { severity: 'high' | 'medium' | 'low'; text: string }[] = []

  if (input.instructions.totalTokens > 8000) {
    out.push({
      severity: 'high',
      text: t('s.instHeavy', { tokens: formatTokens(input.instructions.totalTokens) }),
    })
  }
  for (const block of input.instructions.duplicateBlocks.slice(0, 5)) {
    out.push({
      severity: 'medium',
      text: t('s.dupBlock', {
        tokens: formatTokens(block.tokens),
        n: block.paths.length,
        paths: block.paths.join(sep),
      }),
    })
  }

  if (input.skills.totalDescriptionTokens > 3000) {
    out.push({
      severity: 'medium',
      text: t('s.skillCatalog', {
        tokens: formatTokens(input.skills.totalDescriptionTokens),
        n: input.skills.count,
      }),
    })
  }
  for (const dup of input.skills.duplicateDescriptions.slice(0, 5)) {
    out.push({
      severity: 'medium',
      text: t('s.dupSkillDesc', { n: dup.count, name: dup.name }),
    })
  }
  if (input.skills.bodies !== undefined && input.skills.bodies.totalTokens > 20000) {
    out.push({
      severity: 'low',
      text: t('s.skillBodies', {
        n: input.skills.bodies.count,
        tokens: formatTokens(input.skills.bodies.totalTokens),
      }),
    })
  }

  if (input.tools.mcp.totalTokens > 4000 || input.tools.mcp.totalTools > 20) {
    out.push({
      severity: 'high',
      text: t('s.mcpBloat', {
        n: input.tools.mcp.totalTools,
        tokens: formatTokens(input.tools.mcp.totalTokens),
        servers: input.tools.mcp.servers.slice(0, 3).map((s) => `${s.server}(${s.tools})`).join(sep),
      }),
    })
  }
  if (input.tools.visibleCount > 40) {
    out.push({
      severity: 'low',
```

</details>

**依据 6 · 源码核查**：[src/audit.ts:231-276](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/audit.ts#L231-L276)

回执带路径/短预览且trimmed unavailable。

<details>
<summary>查看原文（46行）</summary>

```text
    duplicateBlocks: input.instructions.duplicateBlocks
      .filter(block => block.paths.includes(file.path))
      .map(block => ({ sha256: sha256(block.text), tokens: block.tokens, paths: block.paths, preview: preview(block.text) })),
  }))
  const skills = input.skillList.map(skill => ({
    name: skill.name,
    source: skill.source,
    provider: skill.provider,
    descriptionBytes: byteLength(skill.description),
    descriptionTokens: estimateTokens(skill.description),
    catalogInjected: true as const,
  }))
  const schemaItems = input.toolSchemas.items.map(item => ({
    name: item.name,
    bytes: item.bytes,
    tokens: item.tokens,
    schemaHash: item.schemaHash,
    ...(item.server !== undefined ? { server: item.server } : {}),
  }))
  const duplicateMcpEntries = [...input.toolSchemas.mcpDuplicates.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([schemaHash, items]) => ({
      schemaHash,
      names: items.map(item => item.name).sort(),
      servers: [...new Set(items.map(item => item.server))].sort(),
      bytes: items.reduce((total, item) => total + item.bytes, 0),
    }))
    .sort((a, b) => b.bytes - a.bytes || a.schemaHash.localeCompare(b.schemaHash))

  return {
    kind: 'context-audit-receipt',
    version: 1,
    detail: 'developer',
    agentsFiles,
    skills,
    toolSchemas: { totalBytes: schemaItems.reduce((total, item) => total + item.bytes, 0), items: schemaItems },
    duplicateMcpEntries,
    shadowedSkills: input.conflicts,
    trimmed: { status: 'unavailable', items: [] },
    repairPlan: input.suggestions,
  }
}

/** SkillSummary 的 rank 不在公开类型里；按来源给启发式排序值（与官方 rank 语义一致：低者胜）。 */
export function rankOfSource(source: string): number {
  switch (source) {
```

</details>

**依据 7 · 源码核查**：[src/routes.ts:60-77](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/routes.ts#L60-L77)

显式cwd优先，当前函数无目录授权规则。

<details>
<summary>查看原文（18行）</summary>

```text
  const explicit = parseQueryParam(url, 'cwd')
  if (explicit !== undefined && explicit !== '') return explicit
  const sessionId = parseQueryParam(url, 'session')
  if (sessionId !== undefined && sessionId !== '') {
    const session = config.sessions?.get(sessionId)
    if (session?.header.cwd !== undefined && session.header.cwd !== '') {
      return session.header.cwd
    }
  }
  return config.defaultCwd ?? process.cwd()
}

/** 构造审计路由（含 60s 缓存与 in-flight 复用）。 */
export function makeAuditRoutes(config: AuditRoutesConfig): WebRoute[] {
  const { deps, cacheTtlMs = 60_000 } = config
  const cache = new Map<string, { at: number; promise: Promise<AuditReport> }>()
  /** 缓存条目上限：防止不同 cwd 参数让缓存无限增长（超限时淘汰最旧条目）。 */
  const MAX_CACHE_ENTRIES = 32
```

</details>

**依据 8 · 源码核查**：[src/routes.ts:79-121](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/routes.ts#L79-L121)

TTL缓存与独立AbortController。

<details>
<summary>查看原文（43行）</summary>

```text
  const audit = (
    cwd: string,
    detail: 'summary' | 'developer',
    agent: object | undefined,
    sessionId: string,
    locale: HostLocaleId,
  ): Promise<AuditReport> => {
    // 缓存键要带上明细层级（两种报告结构不同）、会话（不同 agent 看到的技能层
    // 不同）和语言（建议文案随语言变化）。
    const key = `${detail} ${locale} ${sessionId} ${cwd}`
    const hit = cache.get(key)
    if (hit !== undefined && Date.now() - hit.at < cacheTtlMs) return hit.promise
    if (cache.size >= MAX_CACHE_ENTRIES) {
      const oldest = cache.keys().next().value
      if (oldest !== undefined) cache.delete(oldest)
    }
    const promise = runAudit(deps, {
      cwd,
      detail,
      locale,
      signal: new AbortController().signal,
      ...(agent !== undefined ? { agent } : {}),
    })
      .catch((error: unknown) => {
        // 失败不缓存，允许下次重试
        cache.delete(key)
        throw error
      })
    cache.set(key, { at: Date.now(), promise })
    return promise
  }

  return [{
    kind: 'exact',
    path: `${AUDIT_API_PREFIX}/audit`,
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (req.method !== 'GET') {
        json(res, 405, { ok: false, error: 'method-not-allowed' })
        return
      }
      const url = req.url ?? ''
      const cwd = resolveCwd(url, config)
      // `detail=developer` 附带逐条 receipt，浏览器面板用它展开「谁在占用」。
```

</details>

**依据 9 · 源码核查**：[src/routes.ts:110-139](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/routes.ts#L110-L139)

GET路由处理无自身认证闸。

<details>
<summary>查看原文（30行）</summary>

```text

  return [{
    kind: 'exact',
    path: `${AUDIT_API_PREFIX}/audit`,
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (req.method !== 'GET') {
        json(res, 405, { ok: false, error: 'method-not-allowed' })
        return
      }
      const url = req.url ?? ''
      const cwd = resolveCwd(url, config)
      // `detail=developer` 附带逐条 receipt，浏览器面板用它展开「谁在占用」。
      const detail = parseQueryParam(url, 'detail') === 'developer' ? 'developer' : 'summary'
      // agent 是技能查询的 scope key；解析不到时退化为不带 scope 的旧行为
      // （技能目录会是空的），但其余各项照常统计。
      const sessionId = parseQueryParam(url, 'session') ?? ''
      const agent = sessionId === '' ? undefined : config.agents?.get(sessionId)
      // 面板显式带上自己的语言：宿主设置里的 locale.preference 可以缺省（缺省
      // 即「跟随浏览器」），而 host 看不见浏览器（issue #11）。
      const locale = resolveHostLocale(parseQueryParam(url, 'lang'))
      audit(cwd, detail, agent, sessionId, locale).then(
        (report) => json(res, 200, { ok: true, report }),
        (error: unknown) => json(res, 500, {
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        }),
      )
    },
  }]
}
```

</details>

**依据 10 · 源码核查**：[src/index.ts:118-132](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/index.ts#L118-L132)

通过webServer直接注册，外层安全需另核查。

<details>
<summary>查看原文（15行）</summary>

```text
    deps,
    ...(sessions !== undefined ? { sessions: sessions as never } : {}),
    ...(agents !== undefined ? { agents: agents as never } : {}),
    ...(config.defaultCwd !== undefined ? { defaultCwd: config.defaultCwd } : {}),
    ...(config.cacheTtlMs !== undefined ? { cacheTtlMs: config.cacheTtlMs } : {}),
  })
  ctx.inject(['webServer'], (httpCtx) => {
    httpCtx.effect(() => {
      const disposers = routes.map((route) => httpCtx.webServer.register(route))
      return () => {
        for (const dispose of disposers) dispose()
      }
    }, 'context-doctor: routes')
  })
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一次只读审计的成本、恢复与采用条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可在受控本机DSH profile和非敏感样本里试用来源定位。固定包版本0.7.2，Node>=22.19，peer Cordis^4.0.1与dsh-tools^0.1.2-rc.1；Client依赖宿主模块表。作者警告旧宿主错配可能影响整个web shell，不能用“>=0.1.2”宣传推断今天所有版本都兼容。本轮检查源码和已入库bundle线索，未安装、重建或加载宿主。

首次应备份profile，准备一组已知指令/技能/工具样本，在已有会话调用summary，再按需要developer，核对cwd和scope是否与目标会话一致。持续使用的成本是磁盘扫描、可选技能正文读取、报告输出占用的新上下文，以及维护宿主服务/模块兼容。无模型费率、耗时和任务频率依据，不能把估算token直接换成现金节省；查询本身也不是没有代价。

失败先分清读取缺口、scope缺失、缓存旧值和宿主兼容。不要因为某项为0或绿色就删文件；修改前看原件、明确保留约束并获得对应写入授权，之后重启/刷新并用真实任务验证。退出移除插件并重启恢复原profile，审计本身没有改指令或工具配置，但已经发给模型或远程客户端的报告不会被撤回。

适合有具体上下文膨胀排查需求的人；对要求精确账单、完整prompt审计或已对外开放且外层认证不明的Host，当前证据不支持采用。若报告与已知样本不符、cwd/scope不明、HTTP边界不能确认，应停止并退回手工检查和宿主原生计量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:40-53](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/package.json#L40-L53)

peer和Node条件。

<details>
<summary>查看原文（14行）</summary>

```text
    "build": "./scripts/build.sh",
    "typecheck": "node scripts/setup-dsh-deps.mjs && tsc -p tsconfig.json --noEmit --pretty false",
    "test": "node --test 'tests/*.test.ts'"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-tools": "^0.1.2-rc.1"
  },
  "engines": {
    "node": ">=22.19"
  },
  "license": "BSD-3-Clause",
  "private": true
}
```

</details>

**依据 2 · 作者声明**：[README.md:48-53](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/README.md#L48-L53)

作者给出客户端错配与运行时外置边界。

````text
> **宿主版本要求**：DSH `>= 0.1.2-rc.1`（已对 0.1.2-rc.1 验证）。0.1.2 重排了客户端模块表（`dsh-client-runtime` 换成 `dsh-client-store`），旧版宿主请固定 [`v0.6.1`](https://github.com/Zhenyu98/dsh-context-doctor/releases/tag/v0.6.1) —— 版本错配会让**整个 web shell** 起不来，不只是本插件（见 [#9](https://github.com/Zhenyu98/dsh-context-doctor/issues/9)）。`@deepseek-ai/cordis` 与 `@deepseek-ai/dsh-tools` 是 peer 依赖，由宿主 profile 提供；插件不自带这两份运行时（自带会铸造第二个工具调度器，见 [#2](https://github.com/Zhenyu98/dsh-context-doctor/issues/2)）。

```sh
# 1. 安装（官方 bundle 插件机制；构建产物已入库，git 源安装无需构建）
dsh plugin --profile web add "github:Zhenyu98/dsh-context-doctor#main"

````

**依据 3 · 源码核查**：[src/audit.ts:148-166](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/audit.ts#L148-L166)

可选技能正文读取有数量上限且产生真实读取。

<details>
<summary>查看原文（19行）</summary>

```text
    }
    bodies = { count, totalTokens }
  }

  const conflicts = findRankShadows(skillList.map((s) => ({
    name: s.name,
    source: s.source,
    provider: s.provider,
    rank: rankOfSource(s.source),
  })))

  const suggestions = buildSuggestions({
    instructions,
    skills: { ...skillCatalog, ...(bodies !== undefined ? { bodies } : {}) },
    tools: toolSchemas,
    conflicts,
  }, options.locale ?? 'en')

  const report: AuditReport = {
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:91-121](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/routes.ts#L91-L121)

缓存复用及失败重试边界。

<details>
<summary>查看原文（31行）</summary>

```text
    if (cache.size >= MAX_CACHE_ENTRIES) {
      const oldest = cache.keys().next().value
      if (oldest !== undefined) cache.delete(oldest)
    }
    const promise = runAudit(deps, {
      cwd,
      detail,
      locale,
      signal: new AbortController().signal,
      ...(agent !== undefined ? { agent } : {}),
    })
      .catch((error: unknown) => {
        // 失败不缓存，允许下次重试
        cache.delete(key)
        throw error
      })
    cache.set(key, { at: Date.now(), promise })
    return promise
  }

  return [{
    kind: 'exact',
    path: `${AUDIT_API_PREFIX}/audit`,
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (req.method !== 'GET') {
        json(res, 405, { ok: false, error: 'method-not-allowed' })
        return
      }
      const url = req.url ?? ''
      const cwd = resolveCwd(url, config)
      // `detail=developer` 附带逐条 receipt，浏览器面板用它展开「谁在占用」。
```

</details>

**依据 5 · 源码核查**：[src/index.ts:89-105](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/index.ts#L89-L105)

工具返回报告而非修改文件。

<details>
<summary>查看原文（17行）</summary>

```text
    },
    async execute(args, exec): Promise<Record<string, JsonValue>> {
      const agentCwd = (exec.agent as { session?: { header?: { cwd?: string } } } | undefined)
        ?.session?.header?.cwd
      const cwd = args.cwd ?? agentCwd ?? config.defaultCwd ?? process.cwd()
      const report = await runAudit(deps, {
        cwd,
        signal: exec.signal,
        ...(args.includeSkillBodies !== undefined ? { includeSkillBodies: args.includeSkillBodies } : {}),
        ...(args.maxSkillBodies !== undefined ? { maxSkillBodies: args.maxSkillBodies } : {}),
        ...(args.detail === 'developer' ? { detail: 'developer' as const } : {}),
        ...(exec.agent !== undefined ? { agent: exec.agent } : {}),
        locale: reportLocale(),
      })
      // AuditReport 结构保证值全部 JSON 安全；断言仅为满足 defineTool 的 JsonValue 签名。
      return report as unknown as Record<string, JsonValue>
    },
```

</details>

**依据 6 · 源码核查**：[src/client/ContextAuditRing.tsx:181-208](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/client/ContextAuditRing.tsx#L181-L208)

客户端刷新与错误显示。

<details>
<summary>查看原文（28行）</summary>

```text
  const refresh = useCallback(() => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    actions.setState('loading', null)
    // `detail=developer` carries the per-entry receipt the breakdown lists.
    // `lang` is sent explicitly because the host cannot resolve the panel's
    // language on its own: the stored preference is optional and its absence
    // means "follow the browser" (issue #11). The locale plugin keeps
    // `<html lang>` on the active locale, so that is the reading to forward.
    const lang = document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
    const url = `${AUDIT_API}?session=${encodeURIComponent(sessionId)}&detail=developer&lang=${lang}`
    void fetch(url, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error(`audit ${response.status}`)
      return response.json() as Promise<{ ok: boolean; report: AuditUiState['report'] }>
    }).then(data => {
      if (controller.signal.aborted) return
      if (data.ok && data.report !== null && data.report !== undefined) actions.setReport(data.report)
      else actions.setState('error', 'empty audit response')
    }, () => {
      if (!controller.signal.aborted) actions.setState('error', 'audit transport error')
    })
  }, [actions, sessionId])

  useEffect(() => {
    refresh()
    return () => controllerRef.current?.abort()
  }, [refresh])
```

</details>

#### 缺口

- 缺少当前宿主兼容、外层HTTP授权、真实tokenizer误差和优化后的任务效果数据。
  **影响**：只能支持本机限定诊断试用，不能保证远程部署、精确计费或自动裁剪。
  **进一步探讨**：在明确版本的隔离profile以已知样本核对覆盖及HTTP边界，随后对授权裁剪做任务质量对照。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证由估算到实际裁剪效果的假设？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

已有工程亮点是工具与HTTP共用runAudit、scope/cwd显式传递、receipt保留定位和trimmed未知，以及HTTP按会话和语言缓存。它把解释依据带到来源级，比只有一个总计量条更便于复查。固定估算和重复阈值仍不能自动给出安全裁剪。

从Q01缺最终装配、Q03缺覆盖错误与精确编码，可以推导未验证假设：在宿主允许的边界接入一次实际装配trace，分别记录候选、已注入、被裁剪和不可观测条目，再把相同tokenizer计算与当前启发式并列，用任务回归结果决定建议是否保留，能够减少错误删减。新增成本是敏感上下文保存、模型tokenizer适配及trace与来源身份对应；不应默认存完整prompt。

最小实验使用固定任务集和版本，包含大JSON参数、重复但不同作用域的指令、同名技能、不可读/超大文件及缓存期间变更。比较当前估算建议与trace辅助建议的漏项、误判、实际输入token、合格任务率和人工修正时间。真实token减少但任务质量下降、或trace把不可观测当空，都推翻“更安全有效裁剪”的判断。该实验未执行，不将未来trace计入本版能力或评分。

#### 证据与依据

**依据 1 · 源码核查**：[src/audit.ts:125-147](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/audit.ts#L125-L147)

共用一次技能列表和并行扫描。

<details>
<summary>查看原文（23行）</summary>

```text

  const [instructions, skillCatalog, toolSchemas] = await Promise.all([
    scanInstructionChain(fs, cwd, signal),
    scanSkillCatalog(skillList, signal),
    scanToolSchemas(tools, options.agent, signal),
  ])

  // 可选：统计技能正文总 token（前 N 个）
  let bodies: { count: number; totalTokens: number } | undefined
  if (options.includeSkillBodies === true) {
    const max = Math.max(1, Math.min(options.maxSkillBodies ?? 20, 100))
    let count = 0
    let totalTokens = 0
    for (const summary of skillList.slice(0, max)) {
      try {
        const def = await skills.get(summary.name, skillLookup)
        if (def !== undefined) {
          count++
          totalTokens += estimateTokens(def.content)
        }
      } catch {
        // 单个技能加载失败不影响整体
      }
```

</details>

**依据 2 · 源码核查**：[src/audit.ts:259-276](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/audit.ts#L259-L276)

receipt目前明确trimmed不可用，是接trace的缺口。

<details>
<summary>查看原文（18行）</summary>

```text

  return {
    kind: 'context-audit-receipt',
    version: 1,
    detail: 'developer',
    agentsFiles,
    skills,
    toolSchemas: { totalBytes: schemaItems.reduce((total, item) => total + item.bytes, 0), items: schemaItems },
    duplicateMcpEntries,
    shadowedSkills: input.conflicts,
    trimmed: { status: 'unavailable', items: [] },
    repairPlan: input.suggestions,
  }
}

/** SkillSummary 的 rank 不在公开类型里；按来源给启发式排序值（与官方 rank 语义一致：低者胜）。 */
export function rankOfSource(source: string): number {
  switch (source) {
```

</details>

**依据 3 · 源码核查**：[src/scan.ts:218-239](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/scan.ts#L218-L239)

完整schema字节与部分token值存在差异。

<details>
<summary>查看原文（22行）</summary>

```text
    items.push({ name: schema.name, bytes, tokens, schemaHash, ...(server !== undefined ? { server } : {}) })
    if (server !== undefined) {
      const duplicate = mcpDuplicates.get(schemaHash) ?? []
      duplicate.push({ name: schema.name, server, bytes })
      mcpDuplicates.set(schemaHash, duplicate)
    }
    schemaTokens += tokens
    if (schema.name.startsWith('mcp__')) continue
    nativeCount++
    nativeTokens += tokens
  }
  const mcp = groupMcpTools(schemas)
  return { visibleCount: schemas.length, schemaTokens, nativeCount, nativeTokens, mcp, items, mcpDuplicates }
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record).sort().map(key => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:91-121](https://github.com/Zhenyu98/dsh-context-doctor/blob/41d5c2e4bbe0611b7928c4007bb28545f7ace38f/src/routes.ts#L91-L121)

同会话/语言/cwd缓存可用作比较基线。

<details>
<summary>查看原文（31行）</summary>

```text
    if (cache.size >= MAX_CACHE_ENTRIES) {
      const oldest = cache.keys().next().value
      if (oldest !== undefined) cache.delete(oldest)
    }
    const promise = runAudit(deps, {
      cwd,
      detail,
      locale,
      signal: new AbortController().signal,
      ...(agent !== undefined ? { agent } : {}),
    })
      .catch((error: unknown) => {
        // 失败不缓存，允许下次重试
        cache.delete(key)
        throw error
      })
    cache.set(key, { at: Date.now(), promise })
    return promise
  }

  return [{
    kind: 'exact',
    path: `${AUDIT_API_PREFIX}/audit`,
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (req.method !== 'GET') {
        json(res, 405, { ok: false, error: 'method-not-allowed' })
        return
      }
      const url = req.url ?? ''
      const cwd = resolveCwd(url, config)
      // `detail=developer` 附带逐条 receipt，浏览器面板用它展开「谁在占用」。
```

</details>

#### 缺口

- 装配trace接口、tokenizer一致性和裁剪后任务质量尚未验证。
  **影响**：不能声称已有精确审计或安全自动优化。
  **进一步探讨**：对所列固定样本比较覆盖、误删与实际任务结果，并审查敏感数据最小保存。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
