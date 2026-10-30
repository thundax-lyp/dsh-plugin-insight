# @zzerx/dsh-plugin-daily-log

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[9fac17c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,782](https://img.shields.io/static/v1?label=npm+30d&message=1%2C782&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log)
<!-- END META -->

> **功能**：汇总Git和本地Agent活动，按需下钻并由会话模型按模板撰写工作报告。

> **亮点**：把跨源活动、按需工具和可缩放浏览接到报告草稿流程，保留模型/用户各自撰写与核验责任。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：截断/probe/partial和日期语义不形成全链覆盖收据，确认/导出也无绑定版本前提。见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 谁需要活动汇总，什么才算报告完成？](#detail-section-11)
  - [Q02 · 渠道采集、按需工具与成文怎样连接？](#detail-section-12)
  - [Q03 · 哪些完整性和时间缺口不容易被看见？](#detail-section-13)
  - [Q04 · 确认、导出与部分失败有哪些硬边界？](#detail-section-14)
  - [Q05 · 读者需哪些条件，怎样用和计成本？](#detail-section-15)
  - [Q06 · 当前采用与生产方向如何判断？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：定期整合多项目/多日志的个人工作汇报，以可回源、区分讨论和交付为目标。见[Q01](#research-q01)。

人工浏览git log/聊天再写报告更透明；插件整合发现与模板，也增加漏项和恢复核验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Git/本地对话采集 | 汇集项目活动 | 上限/日期/失败收据不完整，不等工作全量 |
| 按需工具与/report | 当前会话发现工具 | agent.ctx必需，非项目数据授权 |
| 索引/摘要/明细 | 限首屏并下钻 | 展示折叠不等采集/结构返回有界 |
| 模板/草稿历史 | 组织业务文字 | 当前模型撰写，事实由人核 |
| 保存/Markdown导出 | 留存与交付草稿 | 提示确认无正文hash，目录/同名覆盖另核 |
| 来源/模板/报告GUI | 管理入口 | 未完整审界面/宿主后端 |

**流程与依赖**

storageDomain与宿主scope桥、Git/匹配日志和当前会话模型；源码lib需构建或对应制品。详表见[Q05](#research-q05)。

先明确含时区窗口/项目/作者及披露，逐渠道核收据后下钻、成文、展示确认、核目录再写。步骤见[Q05](#research-q05)。

**效果与成本**

把补漏和回源核验计入一份合格报告，短首屏不证明低IO/模型/长期资源成本。完整表见[Q05](#research-q05)。

可以探索少切换的草稿组织便利，不能当完整工作证明或节时已验。保留/否定条件见[Q06](#research-q06)。

> **思考**：截断/probe/partial和日期语义不形成全链覆盖收据，确认/导出也无绑定版本前提。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把跨源活动、按需工具和可缩放浏览接到报告草稿流程，保留模型/用户各自撰写与核验责任。见[Q01](#research-q01)、[Q02](#research-q02)。

按agent发现工具和组索引下钻可借鉴，优先补全采集收据和局部失败恢复。见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

截断/probe/partial和日期语义不形成全链覆盖收据，确认/导出也无绑定版本前提。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，匿名样本验证日期/partial/写入和启用恢复后再评真实数据范围。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持多源草稿流程，未证明完整报告或业务事实；首屏简洁不替代采集收据，观察关键边界后再评采用。

- 已检查：作者 README、包清单、源码路径 packages/plugin-daily-log/README.md、packages/plugin-daily-log/package.json、packages/plugin-daily-log/src/agent/reference.ts、packages/plugin-daily-log/src/agent/scan-render.ts、packages/plugin-daily-log/src/agent/tool-dispatcher.ts、packages/plugin-daily-log/src/agent/tool-gate.ts、packages/plugin-daily-log/src/agent/tools.ts、packages/plugin-daily-log/src/index.ts、packages/plugin-daily-log/src/service.ts、packages/plugin-daily-log/src/sources/codex.ts、packages/plugin-daily-log/src/sources/conversation-jsonl.ts、packages/plugin-daily-log/src/sources/git.ts 及固定范围 inventory；组件：packages/plugin-daily-log。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件入口/声明、Git与Codex/通用JSONL解析、服务扫描/模板/保存/导出、按需工具与展示/门禁/注册恢复；未完整审Claude/DSH渠道、GUI、宿主scoped/存储/approval后端。
- 下一步：未执行目标或扫描真实用户日志；宿主加载为范围边界，覆盖/日期/事实与恢复成本保留研究缺口。

**分析版本**

- **仓库**：[0x7A7A6572/dsh-forge-studio](https://github.com/0x7A7A6572/dsh-forge-studio)
- **版本号**：0.4.3（[固定提交 9fac17c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

活动覆盖收据、事实链接和正文/导出版本确认，能否减少漏项误报及总恢复成本待验证。见[Q06](#research-q06)。

未执行目标或扫描真实用户日志；宿主加载为范围边界，覆盖/日期/事实与恢复成本保留研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 49 | — | — | 766 |
| .mjs | source | 1 | 31 | 16 | 10 | — |
| .ts | source | 36 | 3939 | 3065 | 554 | — |
| .tsx | source | 12 | 856 | 748 | 69 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/0x7A7A6572/dsh-forge-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：活动覆盖、事实归纳、确认与导出怎样可回源，何时只能称待核草稿？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要活动汇总，什么才算报告完成？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合有Git提交或本地Claude/Codex/DSH对话、定期整理项目工作汇报的个人；不要求每个项目都有Git。作者把多源活动和模板接入当前会话，用户确认后保存历史或导出Markdown。合格结果是草稿能回到活动证据，区分完成产出、讨论/模型建议和未完成工作，由本人确认业务事实。

人工浏览git log和多个聊天记录再写文档是基线。插件增加项目源管理、分组下钻和模板骨架，可能减少搜集和切换；报告仍由当前会话模型亲自写，不是插件确定性认证工作。提交主题不证明效果，聊天中的“完成”不证明真正交付；未提交、会议和线下工作还要补问。

贡献在采集/浏览/工具接线组合，不是新报告模型或独立Agent预设。旧已核材料与本轮字节相同仍重新查主链，不能将旧摘要或少量活动当本轮完整效果验证。

#### 证据与依据

**依据 1 · 作者声明**：[packages/plugin-daily-log/README.md:1-3](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/README.md#L1-L3)

作者多源工作报告定位。

```text
# @zzerx/dsh-plugin-daily-log

工作日报告插件：把 **Git 提交**与**本地 agent 对话**（DeepSeek / Claude / Codex）汇总起来，按你自己的模板生成日报 / 周报 / 月报。不只面向开发者——只有本地对话记录，同样能出一份工作总结。
```

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/agent/reference.ts:17-32](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/reference.ts#L17-L32)

要求真实数据、补问及模型亲自撰写/展示确认。

<details>
<summary>查看原文（16行）</summary>

```text
  '',
  '### 总则',
  '- data-driven：一切结论必须来自 daily_log_* 工具返回的真实数据，绝不编造或推测。',
  '- 诚实透明：空数据、工具失败如实告知，不用默认值掩盖。',
  '- 中文交流；报告用业务语言，不用代码流水账。',
  '',
  '### 收集（扫描前）',
  '- 先确认时间范围与项目集（daily_log_list_sources 查看已添加项目）；用户指令不完整时反问，不自行猜测。',
  '- 扫描结果为空/明显过少、提交信息过简（update/fix/wip 之类）→ 反问是否遗漏项目或范围有误。',
  '- 扫描后口头询问「是否有未提交/未完成/未体现在扫描结果里的工作（协助、会议、进行中会话等）」。',
  '',
  '### 生成（撰写正文）',
  '- 调用 daily_log_prepare_report 获取所选模板的指令/骨架引导，然后【你亲自撰写正文】。',
  '- 按骨架归类：feat/新增 → 核心产出；fix → 问题修复；refactor/perf → 技术优化；隐性工作 → 其他工作。',
  '- 同功能多次提交合并为一条业务描述。坏例：「修改了 user.ts 的 login 方法」；好例：「完成用户登录模块重构，提升可维护性」。',
  '- 写完先在回复中展示正文并询问是否调整；用户要求调整则按意见修改正文，改完再次询问；未经用户确认不得调用 daily_log_save_report / daily_log_export_report。',
```

</details>

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/service.ts:277-290](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/service.ts#L277-L290)

prepare提供模板prompt/骨架和来源信息。

<details>
<summary>查看原文（14行）</summary>

```text
  async prepareReport(input: ReportPrepareInput): Promise<ReportPrepareResult> {
    const ids = input.sourceIds ?? Array.from(this.sources.entries(), ([, s]) => s.id)
    const template = this.resolveTemplate(input.templateId)
    const parts = parseTemplate(template?.content ?? DEFAULT_TEMPLATE_SKELETON)
    return {
      reportType: input.reportType,
      dateRange: input.dateRange,
      sourceIds: ids,
      sourceCount: ids.length,
      template: {
        name: template?.name ?? BUILTIN_TEMPLATE,
        ...(parts.promptSection !== null ? { promptSection: parts.promptSection } : {}),
        skeletonSection: parts.skeletonSection,
      },
```

</details>

#### 缺口

- 没有同活动集的人工作业对照和业务事实验收。
  **影响**：不能从生成报告推净节时、完整性或绩效证据。
  **进一步探讨**：匿名活动集对照人工整理，核事实/漏项及全部审阅时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 渠道采集、按需工具与成文怎样连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host打开daily-log storageDomain并提供来源、报告、模板服务，builtinChannels采集Git与三类本地会话；按项目probe后顺序scan，将sourceLabel/channel归一。Git通过execFile argv执行，不拼shell。对话按项目cwd/时间抽取user与assistant，用户白名单包裹剥除，助手文本保留；剥壳不是脱敏或事实校验。

常驻daily_log派发器/短指针，调用时从agent.ctx取得工具scope，按需启用15工具和详细引导，/report提供另一入口。WeakMap控制同agent重复启用；缺agent scope会报错，不回落全局注册。这里的scope是工具发现和上下文优化，不是项目数据最小授权：scan仍可取得服务配置的全部source。

默认渲染组索引，summary取首问末答，raw下钻；footer的未展开组/行只说明已采集entries的展示截断，不说明原始渠道完整。工具仍返回结构化entries，是否进入全部模型上下文或宿主日志依宿主，不能把短首屏当所有成本/披露都受限。

prepare返回模板prompt/骨架；模型按其撰写，save只接受非空markdown并存档，不逐条核正文与活动对应。模板和提示可改善组织，不能自动认证任务结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/src/index.ts:56-78](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/index.ts#L56-L78)

域/服务/渠道与设置装配。

<details>
<summary>查看原文（23行）</summary>

```text
  const domain = await ctx.storageDomain.open(dailyLogDomain)
  try {
    ctx.effect(() => () => { void domain.close() })
    // 用 new（而非 ctx.plugin）：把 dailyLog 服务 provide 在本 apply 的 fiber 上，
    // 后续 ctx.inject(['tools'], ...) 子 fiber 才能沿祖先链读到 ctx.dailyLog。
    new DailyLogService(ctx, {
      domain,
      channels: builtinChannels,
      // 数据源页「DSH 工作区」组的候选来源（含每项目的 sessionIds，供 dsh 会话渠道）。
      workspaceProjects: () => readWorkspaceProjects(ctx),
      // 配置每次现取（volatile 引用值随设置热更新，不重挂插件）。
      readPreferences: () => dailyLogConfigOf(config),
    })
    // settings 句柄要交给 /report 指令（开关联动其注册与否），不再丢弃返回值。
    const settings = installDailyLogSettings(ctx, config)
    installDailyLogAgentBridgeWhenReady(ctx, settings)
    // 本插件自带设置页面（settings.section），关掉宿主按 schema 自建页面的策略。
    configureDailyLogSettingsPage(ctx)
  } catch (error) {
    void domain.close()
    throw error
  }
}
```

</details>

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/service.ts:208-239](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/service.ts#L208-L239)

probe和顺序scan归一。

<details>
<summary>查看原文（32行）</summary>

```text
  async scanSource(id: SourceId, range: DateRange): Promise<ScanResult> {
    await this.ensureMigrated()
    const source = this.sources.get(id)
    if (!source) throw new Error(`source ${id} not found`)
    const entries: ActivityEntry[] = []
    const errors: string[] = []
    for (const ch of this.channels) {
      let hit = false
      try {
        hit = await ch.probe(source.path)
      } catch {
        hit = false
      }
      if (!hit) continue
      try {
        const author = this.resolveGitAuthor(source)
        const got = await ch.scan({
          path: source.path,
          label: source.label,
          range,
          ...(author !== undefined ? { author } : {}),
        })
        entries.push(...got.map((e) => ({ ...e, sourceLabel: source.label, channel: ch.kind })))
      } catch (e) {
        errors.push(`[${ch.kind}] ${errText(e)}`)
      }
    }
    return {
      sourceId: id,
      entries,
      truncated: errors.length > 0,
      ...(errors.length > 0 ? { truncatedHint: errors.join('；') } : {}),
```

</details>

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/sources/git.ts:22-31](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/git.ts#L22-L31)

execFile argv及maxBuffer。

<details>
<summary>查看原文（10行）</summary>

```text
async function gitLog(projectPath: string, args: string[]): Promise<string> {
  try {
    const { stdout, stderr } = await execFileAsync('git', ['-C', projectPath, ...args], {
      maxBuffer: 10 * 1024 * 1024,
    })
    if (stderr && !stdout) return stderr
    return stdout
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(`git 扫描失败（${projectPath}）：${msg}`, { cause: error })
```

</details>

**依据 4 · 源码核查**：[packages/plugin-daily-log/src/agent/tool-gate.ts:13-29](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/tool-gate.ts#L13-L29)

agent.ctx缺失抛错。

<details>
<summary>查看原文（17行）</summary>

```text
/** agent scope ctx 的最小视图：tools 必需，systemPrompt 可缺（宿主可能未装配）。 */
export interface AgentScopeContext {
  readonly tools: {
    register(definition: ToolDefinition): () => void
  }
  readonly systemPrompt?: {
    section(section: { name: string; order: number; text: string }): () => void
  }
}

/** 读 agent 的 scope ctx；宿主未暴露时抛错（由调用方转成面向模型的错误文本）。 */
export function agentScopeOf(agent: Agent): AgentScopeContext {
  const scope = (agent as unknown as { ctx?: AgentScopeContext }).ctx
  if (scope === undefined || scope.tools === undefined) {
    throw new Error('[plugin-daily-log] agent scope context is unavailable (agent.ctx)')
  }
  return scope
```

</details>

**依据 5 · 源码核查**：[packages/plugin-daily-log/src/index.ts:80-94](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/index.ts#L80-L94)

按需工具与引导。

<details>
<summary>查看原文（15行）</summary>

```text
/** 建 gate：一次 enable 同时注入 15 个工具 + 详细引导段。 */
export function createDailyLogGate(ctx: Context): ToolGate {
  return createToolGate((scope) => {
    const disposers: Array<() => void> = []
    buildDailyLogTools(ctx.dailyLog, (definition) => {
      disposers.push(scope.tools.register(definition))
    })
    disposers.push(registerDailyLogGuidance(scope))
    return () => { for (const d of disposers.reverse()) d() }
  })
}

/**
 * agent 桥可选增强：tools 服务注册后挂常驻派发器（+ guard / pre-execute 钩子），
 * systemPrompt 注册后挂常驻短指针；/report 指令交给 settings 开关联动。
```

</details>

**依据 6 · 源码核查**：[packages/plugin-daily-log/src/agent/tool-dispatcher.ts:45-69](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/tool-dispatcher.ts#L45-L69)

派发器启用并返回引导。

<details>
<summary>查看原文（25行）</summary>

```text
      const agent = exec.agent
      if (agent === undefined) {
        return {
          enabled: false,
          message: 'Cannot determine the calling session scope, so the toolkit cannot be enabled. Ask the user to enable it (/report does that when the command is registered).',
          tools: [],
          guidance: DAILY_LOG_REFERENCE_TEXT,
        }
      }
      try {
        const fresh = gate.enable(agent)
        return {
          enabled: true,
          message: fresh
            ? 'Daily-log toolkit enabled for this session.'
            : 'Daily-log toolkit already enabled.',
          tools: [...DAILY_LOG_TOOL_NAMES],
          guidance: DAILY_LOG_REFERENCE_TEXT,
        }
      } catch (error) {
        return {
          enabled: false,
          message: 'Failed to enable the daily-log toolkit: ' + String(error) + '. Ask the user to enable it (/report does that when the command is registered).',
          tools: [],
          guidance: DAILY_LOG_REFERENCE_TEXT,
```

</details>

**依据 7 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:194-212](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/tools.ts#L194-L212)

全部source与结构化entries返回。

<details>
<summary>查看原文（19行）</summary>

```text
    async execute(args) {
      const since = args.since as string
      const until = args.until as string | undefined
      const range = { since, ...(until ? { until } : {}) }
      const list = await svc.listSources()
      const targets = args.source_id !== undefined
        ? list.filter((s) => s.id === (args.source_id as SourceId))
        : list
      const entries: ActivityEntry[] = []
      for (const s of targets) {
        const r = await svc.scanSource(s.id, range)
        entries.push(...r.entries)
      }
      // 下钻过滤在渲染与结构化返回上同时生效，避免显示与取值不一致。
      const filtered = filterEntries(entries, {
        ...(args.session_id !== undefined ? { sessionId: args.session_id as string } : {}),
        ...(args.keywords !== undefined ? { keywords: args.keywords as string } : {}),
      })
      return { entries: filtered, count: filtered.length }
```

</details>

**依据 8 · 源码核查**：[packages/plugin-daily-log/src/agent/scan-render.ts:141-183](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/scan-render.ts#L141-L183)

索引/摘要/展示预算和下钻。

<details>
<summary>查看原文（43行）</summary>

```text
export function renderScan(entries: readonly ActivityEntry[], options: RenderScanOptions = {}): string {
  const level = options.level ?? 'index'
  if (entries.length === 0) return '(no entries)'
  if (level === 'raw') return renderRaw(entries, options)
  const maxLines = options.maxLines ?? DEFAULT_MAX_LINES[level]
  const maxGroups = options.maxGroups ?? DEFAULT_MAX_GROUPS[level]
  const lines: string[] = []
  const folded: string[] = []
  for (const block of blocksOf(entries)) {
    const groups = groupsOf(block.entries)
    const summary = block.entries.reduce(
      (acc, e) => (e.kind === 'commit' ? { commits: acc.commits + 1, messages: acc.messages } : { commits: acc.commits, messages: acc.messages + 1 }),
      { commits: 0, messages: 0 },
    )
    const counts = [summary.commits > 0 ? summary.commits + ' 提交' : '', summary.messages > 0 ? summary.messages + ' 条消息' : ''].filter(Boolean).join(' / ')
    lines.push('[' + block.channel + '] ' + block.label + ' · ' + spanOf(block.entries) + ' · ' + counts + ' · ' + groups.length + ' 组')
    for (const g of groups.slice(0, maxGroups)) {
      if (level === 'summary') {
        lines.push('  ▸ ' + g.title + ' · ' + spanOf(g.entries) + ' · ' + countText(g))
        const q = firstUser(g)
        const a = lastAssistant(g)
        if (q) lines.push('    问：' + q)
        if (a) lines.push('    答：' + a)
      } else {
        lines.push('  · ' + g.title + ' · ' + spanOf(g.entries) + ' · ' + countText(g))
      }
    }
    if (groups.length > maxGroups) {
      const rest = groups.slice(maxGroups)
      folded.push(block.channel + '/' + block.label + ' ' + rest.length + ' 组（' + rest.slice(0, 3).map((g) => g.title).join('、') + (rest.length > 3 ? ' 等' : '') + '）')
    }
  }
  let truncatedLines = 0
  if (lines.length > maxLines) {
    truncatedLines = lines.length - maxLines
    lines.length = maxLines
  }
  const footer: string[] = []
  if (folded.length > 0) footer.push('… 未展开分组：' + folded.join('；'))
  if (truncatedLines > 0) footer.push('… 另有 ' + truncatedLines + ' 行未显示')
  const total = entries.reduce((n, _e) => n + 1, 0)
  footer.push('（共 ' + total + ' 条 · ' + blocksOf(entries).reduce((n, b) => n + groupsOf(b.entries).length, 0) + ' 组；下钻：level=summary，或 level=raw + session_id / keywords）')
  return lines.concat(footer).join('\n')
```

</details>

**依据 9 · 源码核查**：[packages/plugin-daily-log/src/service.ts:277-304](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/service.ts#L277-L304)

模板准备和非空正文保存。

<details>
<summary>查看原文（28行）</summary>

```text
  async prepareReport(input: ReportPrepareInput): Promise<ReportPrepareResult> {
    const ids = input.sourceIds ?? Array.from(this.sources.entries(), ([, s]) => s.id)
    const template = this.resolveTemplate(input.templateId)
    const parts = parseTemplate(template?.content ?? DEFAULT_TEMPLATE_SKELETON)
    return {
      reportType: input.reportType,
      dateRange: input.dateRange,
      sourceIds: ids,
      sourceCount: ids.length,
      template: {
        name: template?.name ?? BUILTIN_TEMPLATE,
        ...(parts.promptSection !== null ? { promptSection: parts.promptSection } : {}),
        skeletonSection: parts.skeletonSection,
      },
    }
  }

  async saveReport(input: ReportSaveInput): Promise<ReportRecord> {
    const markdown = input.markdown.trim()
    if (!markdown) throw new Error('报告正文不能为空')
    return this.createReport({
      title: input.title?.trim() || (input.reportType ?? '报告') + ' · ' + formatDateRange(input.dateRange),
      markdown,
      sourceIds: input.sourceIds,
      ...(input.templateId !== undefined ? { templateId: input.templateId } : {}),
      ...(input.reportType !== undefined ? { reportType: input.reportType } : {}),
      dateRange: input.dateRange,
    })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些完整性和时间缺口不容易被看见？

**研究主题**：缺陷与关键质疑

#### 完整回答

Git请求501条后slice500，provider只返回活动数组，未传上限截断收据。service的truncated来自scan异常，probe异常还被当无渠道跳过；agent scan仅合并r.entries，丢truncated/truncatedHint。因而小结果或空结果不能证明没有活动，渲染footer也不能弥补上游丢失。

作者默认本人最终回仓库user.email，缺失则不加过滤；Git --author是匹配规则，不是已认证个人身份。管道符分隔的日志对作者/主题含|没有可靠转义，会截断或错移字段，不是稳定结构协议。

Codex按日期目录挑候选，再全文读取；文件读失败continue，无逐文件失败数。只给YYYY-MM-DD since而不给until时，目录候选上限设为since当天，与Git不传until的查询范围不同；旧目录跨日续写还可能因目录不在窗内漏选。对话时间直接Date.parse：纯日期until是该日零点，不扩为整日；不可解析since回0。应把时区、起止时刻与候选目录覆盖一起核，不能把“本周”或纯日期参数自动等同一致完整窗口。

JSON无效、非目标角色、空正文或窗外会被跳过，没有每类跳过收据；白名单标签剥除也可能删掉正在讨论同名标签的合法用户文本。未实际扫描用户数据，上述为源码可见路径，未量化真实漏项率。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/src/sources/git.ts:18-20](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/git.ts#L18-L20)

500上限和文本分隔格式。

```text
/** 最多返回的 commit 条数（超出截断）。 */
const MAX_COMMITS = 500
const LOG_FORMAT = '%H|%an|%ai|%s|%D'
```

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/sources/git.ts:50-72](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/git.ts#L50-L72)

作者回落与管道符解析。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * 解析实际生效的作者过滤值：显式传入优先（`*`/`all` → 不过滤），
 * 未传入时回落到仓库自身的 user.email —— 即默认"仅本人提交"；都无法确定时不过滤。
 */
export async function resolveAuthorFilter(projectPath: string, author?: string): Promise<string> {
  const explicit = (author ?? '').trim()
  if (ALL_AUTHOR_VALUES.has(explicit.toLowerCase())) return ''
  if (explicit) return explicit
  return readRepoUserEmail(projectPath)
}

function parseGitLog(raw: string): Array<{ hash: string; author: string; date: string; message: string; branch: string }> {
  const trimmed = raw.trim()
  if (!trimmed) return []
  return trimmed.split('\n').map((line) => {
    const parts = line.split('|', 5)
    return {
      hash: (parts[0] ?? '').trim(),
      author: (parts[1] ?? '').trim(),
      date: (parts[2] ?? '').trim(),
      message: (parts[3] ?? '').trim(),
      branch: (parts[4] ?? '').trim(),
    }
```

</details>

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/sources/git.ts:101-122](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/git.ts#L101-L122)

请求上限加一后截断且无标记返回。

<details>
<summary>查看原文（22行）</summary>

```text
  async scan({ path, label, range, author }): Promise<ActivityEntry[]> {
    const authorFilter = await resolveAuthorFilter(path, author)
    // 用 --branches/--remotes/--tags 而非 --all：--all 会把 refs/stash 里的
    // stash 提交（'On <branch>: …' / 'index on <branch>: …'）当成本周工作。
    const args = [
      'log', '--branches', '--remotes', '--tags', `--format=${LOG_FORMAT}`,
      `--since=${range.since}`, `--max-count=${MAX_COMMITS + 1}`,
    ]
    if (range.until) args.push(`--until=${range.until}`)
    if (authorFilter) args.push(`--author=${authorFilter}`)
    const out = await gitLog(path, args)
    return parseGitLog(out).slice(0, MAX_COMMITS).map((c) => {
      const branch = primaryBranch(c.branch)
      return {
        ts: Date.parse(c.date) || 0,
        sourceLabel: label,
        kind: 'commit',
        title: c.message || '(no message)',
        body: `${c.hash} · ${c.date}${c.branch ? ` · ${c.branch}` : ''}`,
        ...(branch ? { group: branch, groupTitle: branch } : {}),
      }
    })
```

</details>

**依据 4 · 源码核查**：[packages/plugin-daily-log/src/service.ts:208-239](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/service.ts#L208-L239)

probe静默跳过/scan错误partial。

<details>
<summary>查看原文（32行）</summary>

```text
  async scanSource(id: SourceId, range: DateRange): Promise<ScanResult> {
    await this.ensureMigrated()
    const source = this.sources.get(id)
    if (!source) throw new Error(`source ${id} not found`)
    const entries: ActivityEntry[] = []
    const errors: string[] = []
    for (const ch of this.channels) {
      let hit = false
      try {
        hit = await ch.probe(source.path)
      } catch {
        hit = false
      }
      if (!hit) continue
      try {
        const author = this.resolveGitAuthor(source)
        const got = await ch.scan({
          path: source.path,
          label: source.label,
          range,
          ...(author !== undefined ? { author } : {}),
        })
        entries.push(...got.map((e) => ({ ...e, sourceLabel: source.label, channel: ch.kind })))
      } catch (e) {
        errors.push(`[${ch.kind}] ${errText(e)}`)
      }
    }
    return {
      sourceId: id,
      entries,
      truncated: errors.length > 0,
      ...(errors.length > 0 ? { truncatedHint: errors.join('；') } : {}),
```

</details>

**依据 5 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:194-212](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/tools.ts#L194-L212)

丢服务partial元数据。

<details>
<summary>查看原文（19行）</summary>

```text
    async execute(args) {
      const since = args.since as string
      const until = args.until as string | undefined
      const range = { since, ...(until ? { until } : {}) }
      const list = await svc.listSources()
      const targets = args.source_id !== undefined
        ? list.filter((s) => s.id === (args.source_id as SourceId))
        : list
      const entries: ActivityEntry[] = []
      for (const s of targets) {
        const r = await svc.scanSource(s.id, range)
        entries.push(...r.entries)
      }
      // 下钻过滤在渲染与结构化返回上同时生效，避免显示与取值不一致。
      const filtered = filterEntries(entries, {
        ...(args.session_id !== undefined ? { sessionId: args.session_id as string } : {}),
        ...(args.keywords !== undefined ? { keywords: args.keywords as string } : {}),
      })
      return { entries: filtered, count: filtered.length }
```

</details>

**依据 6 · 源码核查**：[packages/plugin-daily-log/src/sources/codex.ts:15-41](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/codex.ts#L15-L41)

目录窗口，until缺省since。

<details>
<summary>查看原文（27行）</summary>

```text
/** 生成时间窗内的日期目录路径（since/until 支持 YYYY-MM-DD；其它格式回退全库）。 */
async function listCandidates(root: string, range: DateRange): Promise<string[]> {
  const dayPattern = /^(\d{4})-(\d{2})-(\d{2})$/
  const since = dayPattern.exec(range.since)?.[0]
  if (!since) return [root] // 非标准日期（Monday 等）→ 全库遍历
  const until = range.until && dayPattern.exec(range.until) ? range.until : since
  const out: string[] = []
  const [sy, sm, sd] = since.split('-').map(Number)
  const [uy, um, ud] = until.split('-').map(Number)
  try {
    const years = await readdir(root)
    for (const y of years) {
      const yNum = Number(y)
      if (!Number.isInteger(yNum) || yNum < sy || yNum > uy) continue
      const ym = join(root, y)
      const months = await readdir(ym)
      for (const m of months) {
        const mNum = Number(m)
        if (!Number.isInteger(mNum)) continue
        if ((yNum === sy && mNum < sm) || (yNum === uy && mNum > um)) continue
        const ymd = join(ym, m)
        const days = await readdir(ymd)
        for (const d of days) {
          const dNum = Number(d)
          if (!Number.isInteger(dNum)) continue
          if ((yNum === sy && mNum === sm && dNum < sd) || (yNum === uy && mNum === um && dNum > ud)) continue
          out.push(join(ymd, d))
```

</details>

**依据 7 · 源码核查**：[packages/plugin-daily-log/src/sources/codex.ts:95-110](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/codex.ts#L95-L110)

整文件读及失败continue。

<details>
<summary>查看原文（16行）</summary>

```text
    for (const f of files) {
      const cwd = await fileCwd(f)
      if (cwd === undefined || normalizeCwd(cwd) !== want) continue
      let text: string
      try {
        text = await readFile(f, 'utf8')
      } catch {
        continue
      }
      // Codex 会话日志没有标题事件：以会话文件名（含 session id）作分组键。
      const session = { id: basename(f, '.jsonl') }
      for (const line of text.split('\n')) {
        const e = parseConversationLine(line, range, label, session)
        if (e) entries.push(e)
      }
    }
```

</details>

**依据 8 · 源码核查**：[packages/plugin-daily-log/src/sources/conversation-jsonl.ts:103-125](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/conversation-jsonl.ts#L103-L125)

解析/角色/时间过滤，纯日期直接Date.parse。

<details>
<summary>查看原文（23行）</summary>

```text
  const trimmed = line.trim()
  if (!trimmed) return undefined
  let obj: Record<string, unknown>
  try {
    obj = JSON.parse(trimmed) as Record<string, unknown>
  } catch {
    return undefined
  }
  const role = extractRole(obj)
  if (role === undefined) return undefined
  if (isInjectedMessage(obj)) return undefined
  const msg = (obj.message ?? obj.payload ?? obj) as Record<string, unknown> | undefined
  const raw = extractText(msg?.content ?? obj.content)
  if (!raw) return undefined
  // 助手输出不剥壳：它可能正当地在讨论这些标签。
  const text = role === 'user' ? stripInjectedWrappers(raw) : raw.trim()
  if (!text) return undefined
  if (role === 'user' && (SYNTHETIC_USER_LINE.test(text) || INJECTED_RESIDUE.test(text))) return undefined
  const ts = extractTs(obj)
  const since = Date.parse(range.since) || 0
  const until = range.until ? Date.parse(range.until) : undefined
  if (ts < since) return undefined
  if (until !== undefined && ts > until) return undefined
```

</details>

**依据 9 · 源码核查**：[packages/plugin-daily-log/src/sources/conversation-jsonl.ts:15-45](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/conversation-jsonl.ts#L15-L45)

白名单剥壳实现。

<details>
<summary>查看原文（31行）</summary>

```text
/** 宿主注入包裹块的白名单（成对标签整段剥离）。 */
const INJECTED_WRAPPERS = [
  'ide_selection',
  'ide_opened_file',
  'system-reminder',
  'command-name',
  'command-message',
  'command-args',
  'local-command-stdout',
  'local-command-caveat',
  'user-prompt-submit-hook',
  'task-notification',
  'environment_context',
  'INSTRUCTIONS',
  'skills_instructions',
  'collaboration_mode',
  'app-context',
  'permissions',
]

/** 剥壳后的系统提示残留（Codex 把 AGENTS.md 说明与 <INSTRUCTIONS> 放在同一块）。 */
const INJECTED_RESIDUE = /^#?\s*AGENTS\.md instructions$/i

/** 无正文的控制行（不是用户输入）。 */
const SYNTHETIC_USER_LINE = /^\[Request interrupted/i

/** 剥离白名单包裹块，返回剩余正文（已 trim）。 */
export function stripInjectedWrappers(text: string): string {
  let out = text
  for (const tag of INJECTED_WRAPPERS) {
    out = out.replace(new RegExp('<' + tag + '(?:\\s[^>]*)?>[\\s\\S]*?</' + tag + '>', 'g'), '')
```

</details>

#### 缺口

- 501提交、坏/跨日日志及各渠道边界的漏项与误归属未实测。
  **影响**：不能把报告当完整工作证明。
  **进一步探讨**：匿名fixtures构造501条、旧目录续写、until纯日期/缺省、坏JSON和缺邮箱，核渠道到agent最终收据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 确认、导出与部分失败有哪些硬边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

引导要求先确认范围、展示正文并在用户认可后保存/导出；服务save只检查正文非空，没有绑定展示正文hash的确认状态。写工具仅在宿主approval策略ask时请求确认；没有seam或never策略会继续执行，这是沿宿主交互策略的设计，不能宣称本插件强制每次人工确认，更不能把工具启用当写入授权。

导出用input.outputDir、配置或家目录，标题清路径符号但目录不做独立批准根检查，writeFile普通写入可同名覆盖，无预期不存在/版本前提。本轮没有导出，也没证明任何真实越界写入；读者应把目录和覆盖选择作为明确动作核对。

按需启用先逐个register再加引导，成功才返回总disposer并记installed。中途失败未见局部回滚；宿主是否自动清理仍未知，不能因enable失败就假定无残留。WeakMap旁all Set保留成功release直到插件dispose，长会话资源成本待测。域close在effect/失败路径void调用，具体耐久/清理依宿主，未审后端不作保证。

采集顺序执行；Git仅maxBuffer未设timeout，Codex全文readFile，组索引不限制底层扫描资源。日志内容可进入模型工具结果，所有已配置项目源不按当前会话自动最小化，用户仍需确定披露范围。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/src/agent/reference.ts:23-32](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/reference.ts#L23-L32)

提示确认礼仪。

<details>
<summary>查看原文（10行）</summary>

```text
  '### 收集（扫描前）',
  '- 先确认时间范围与项目集（daily_log_list_sources 查看已添加项目）；用户指令不完整时反问，不自行猜测。',
  '- 扫描结果为空/明显过少、提交信息过简（update/fix/wip 之类）→ 反问是否遗漏项目或范围有误。',
  '- 扫描后口头询问「是否有未提交/未完成/未体现在扫描结果里的工作（协助、会议、进行中会话等）」。',
  '',
  '### 生成（撰写正文）',
  '- 调用 daily_log_prepare_report 获取所选模板的指令/骨架引导，然后【你亲自撰写正文】。',
  '- 按骨架归类：feat/新增 → 核心产出；fix → 问题修复；refactor/perf → 技术优化；隐性工作 → 其他工作。',
  '- 同功能多次提交合并为一条业务描述。坏例：「修改了 user.ts 的 login 方法」；好例：「完成用户登录模块重构，提升可维护性」。',
  '- 写完先在回复中展示正文并询问是否调整；用户要求调整则按意见修改正文，改完再次询问；未经用户确认不得调用 daily_log_save_report / daily_log_export_report。',
```

</details>

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/service.ts:294-315](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/service.ts#L294-L315)

非空保存及普通路径导出/覆盖。

<details>
<summary>查看原文（22行）</summary>

```text
  async saveReport(input: ReportSaveInput): Promise<ReportRecord> {
    const markdown = input.markdown.trim()
    if (!markdown) throw new Error('报告正文不能为空')
    return this.createReport({
      title: input.title?.trim() || (input.reportType ?? '报告') + ' · ' + formatDateRange(input.dateRange),
      markdown,
      sourceIds: input.sourceIds,
      ...(input.templateId !== undefined ? { templateId: input.templateId } : {}),
      ...(input.reportType !== undefined ? { reportType: input.reportType } : {}),
      dateRange: input.dateRange,
    })
  }

  /** 返回导出文件的绝对路径。 */
  async exportReport(id: ReportId, outputDir?: string): Promise<string> {
    const report = this.reports.get(id)
    if (!report) throw new Error('report ' + id + ' not found')
    const dir = outputDir?.trim() || this.configuredOutputDir() || join(homedir(), 'daily-log-reports')
    await mkdir(dir, { recursive: true })
    const safe = report.title.replace(/[\\/:*?"<>|]/g, '-').trim() || 'report'
    const filePath = join(dir, safe + '.md')
    await writeFile(filePath, report.markdown, 'utf8')
```

</details>

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:74-84](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/tools.ts#L74-L84)

仅ask策略需要ask。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * pre-execute ask 门禁判定（纯函数，供单测）：
 * - policy === undefined：宿主未装配 approval（无 seam）→ 放行（保持原语义）；
 * - policy === 'never'：会话禁弹窗，ApprovalService 对一切 ask 确定性返回
 *   'rejected'（decide 在分发应答器之前直接拒绝）→ 弹确认只会让用户已在对话中
 *   确认的写操作被自动拒绝，等同「无交互通道」，放行；
 * - policy === 'ask'：宿主会真正弹确认 → 写工具先 ask。
 */
export function dailyLogWriteShouldAsk(policy: DailyLogApprovalPolicy | undefined): boolean {
  return policy === 'ask'
}
```

</details>

**依据 4 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:539-548](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/tools.ts#L539-L548)

实际pre-execute读取approval。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!isDailyLogTool(exec.name)) return next()
    if (!WRITE_TOOLS.has(exec.name)) return next()
    const approval = ctx.get('approval')
    if (approval === undefined) return next()
    const policy = exec.agent === undefined
      ? undefined
      : approval.overrideOf(exec.agent.session) ?? approval.config.policy ?? 'ask'
    if (!dailyLogWriteShouldAsk(policy)) return next()
    return { kind: 'ask', reason: 'The agent wants to ' + describeAction(exec.name) + ' in daily-log.' }
```

</details>

**依据 5 · 源码核查**：[packages/plugin-daily-log/src/index.ts:80-89](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/index.ts#L80-L89)

逐项注册，无局部catch回滚。

<details>
<summary>查看原文（10行）</summary>

```text
/** 建 gate：一次 enable 同时注入 15 个工具 + 详细引导段。 */
export function createDailyLogGate(ctx: Context): ToolGate {
  return createToolGate((scope) => {
    const disposers: Array<() => void> = []
    buildDailyLogTools(ctx.dailyLog, (definition) => {
      disposers.push(scope.tools.register(definition))
    })
    disposers.push(registerDailyLogGuidance(scope))
    return () => { for (const d of disposers.reverse()) d() }
  })
```

</details>

**依据 6 · 源码核查**：[packages/plugin-daily-log/src/agent/tool-gate.ts:43-64](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/tool-gate.ts#L43-L64)

成功后记installed及all Set清理。

<details>
<summary>查看原文（22行）</summary>

```text
export function createToolGate(contribution: GateContribution): ToolGate {
  const installed = new WeakMap<Agent, () => void>()
  const all = new Set<() => void>()
  let closed = false
  return {
    enable(agent) {
      if (closed || installed.has(agent)) return false
      const release = contribution(agentScopeOf(agent))
      installed.set(agent, release)
      all.add(release)
      return true
    },
    isEnabled(agent) {
      return !closed && installed.has(agent)
    },
    dispose() {
      closed = true
      for (const release of all) release()
      all.clear()
    },
  }
}
```

</details>

**依据 7 · 源码核查**：[packages/plugin-daily-log/src/index.ts:56-76](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/index.ts#L56-L76)

void域close。

<details>
<summary>查看原文（21行）</summary>

```text
  const domain = await ctx.storageDomain.open(dailyLogDomain)
  try {
    ctx.effect(() => () => { void domain.close() })
    // 用 new（而非 ctx.plugin）：把 dailyLog 服务 provide 在本 apply 的 fiber 上，
    // 后续 ctx.inject(['tools'], ...) 子 fiber 才能沿祖先链读到 ctx.dailyLog。
    new DailyLogService(ctx, {
      domain,
      channels: builtinChannels,
      // 数据源页「DSH 工作区」组的候选来源（含每项目的 sessionIds，供 dsh 会话渠道）。
      workspaceProjects: () => readWorkspaceProjects(ctx),
      // 配置每次现取（volatile 引用值随设置热更新，不重挂插件）。
      readPreferences: () => dailyLogConfigOf(config),
    })
    // settings 句柄要交给 /report 指令（开关联动其注册与否），不再丢弃返回值。
    const settings = installDailyLogSettings(ctx, config)
    installDailyLogAgentBridgeWhenReady(ctx, settings)
    // 本插件自带设置页面（settings.section），关掉宿主按 schema 自建页面的策略。
    configureDailyLogSettingsPage(ctx)
  } catch (error) {
    void domain.close()
    throw error
```

</details>

**依据 8 · 源码核查**：[packages/plugin-daily-log/src/sources/git.ts:22-31](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/git.ts#L22-L31)

进程buffer但无timeout参数。

<details>
<summary>查看原文（10行）</summary>

```text
async function gitLog(projectPath: string, args: string[]): Promise<string> {
  try {
    const { stdout, stderr } = await execFileAsync('git', ['-C', projectPath, ...args], {
      maxBuffer: 10 * 1024 * 1024,
    })
    if (stderr && !stdout) return stderr
    return stdout
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(`git 扫描失败（${projectPath}）：${msg}`, { cause: error })
```

</details>

**依据 9 · 源码核查**：[packages/plugin-daily-log/src/sources/codex.ts:95-108](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/codex.ts#L95-L108)

整日志物化。

<details>
<summary>查看原文（14行）</summary>

```text
    for (const f of files) {
      const cwd = await fileCwd(f)
      if (cwd === undefined || normalizeCwd(cwd) !== want) continue
      let text: string
      try {
        text = await readFile(f, 'utf8')
      } catch {
        continue
      }
      // Codex 会话日志没有标题事件：以会话文件名（含 session id）作分组键。
      const session = { id: basename(f, '.jsonl') }
      for (const line of text.split('\n')) {
        const e = parseConversationLine(line, range, label, session)
        if (e) entries.push(e)
```

</details>

#### 缺口

- 未核目标宿主的部分注册清理、覆盖/权限和长期scope释放。
  **影响**：不能保证失败无残留、保存有确认凭据或资源有界。
  **进一步探讨**：隔离profile模拟第N工具注册失败、同名导出、策略差异与多会话退出，核残留和实际文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 读者需哪些条件，怎样用和计成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 条件

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| storageDomain及匹配DSH服务 | 核心必需 | 来源/模板/报告持久化 | UI/工具分别核，打开失败不能成文闭环 |
| agent.ctx工具/提示、可选commands/approval | 会话流程相应必需 | 按需启用、/report与策略 | 缺scope不能启用，ask非统一强制确认 |
| 本机Git/refs/作者与日志读权限 | 对应渠道必需 | 活动采集 | 失败/缺作者不等没工作；报告留缺口 |
| 当前会话模型 | 归纳成文必需 | 看活动、按模板撰写 | 不是插件离线报告器；路线决定内容去向 |
| 模板、备份与明确导出目录 | 合格使用必需 | 业务结构和恢复 | 没确认目录/同名文件前不导出 |
| 构建lib或对应发布包 | 加载必需 | package main/client | checkout缺lib，源码目录不等直接可安装包 |

组件0.4.3、MIT，peer范围和build脚本按package；本轮未构建、安装、执行目标或扫描真实用户日志，未核npm对应，不能由Git无lib断言npm不可用。

#### 步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定界 | 用户明确项目/作者、带时区起止时刻和披露范围 | 渠道窗口一致；原始日志有备份 |
| 采集 | 模型启工具后scan，用户逐渠道核错误/上限/漏选 | 少量结果不当全量，必要时原生Git/日志补查 |
| 下钻 | 模型按组索引到摘要/明细 | 业务条目能回原活动，不把讨论当交付 |
| 撰写 | 模型prepare取模板后写草稿，用户补未提交/线下工作 | 逐项标完成/讨论/待确认并展示正文 |
| 保存 | 用户明确确认正文，模型调用保存 | 当前实现无hash收据，记录确认版本 |
| 导出/退出 | 用户核目录和同名文件后导出，或回人工整理 | 不覆盖未知文件；失败保留现场/草稿与数据备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/宿主、域存储与模型 | 配源/作者/日期/模板，核敏感内容 | 金额/兼容和设置工时未知 |
| 持续使用 | Git/整日志IO、模型下钻/归纳token | 补漏、回源、业务归纳审阅 | 短索引不等扫描或结构返回有界 |
| 失败恢复 | 重扫/重读、部分注册与文件恢复 | 核窗口/partial、覆盖版本和工具残留 | 无全链收据，恢复工时未测 |
| 升级退出 | 日志、域数据和导出备份 | 核未决草稿、源格式迁移和人工回退 | 未核真实迁移与宿主清理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨源收集 | 四渠道归一与项目标签 | 完整召回与身份/日期一致性 |
| 首屏简洁 | agent按需工具、组索引和下钻 | token/扫描/长期scope净成本 |
| 模板成文 | prompt/骨架和保存Markdown | 事实正确/遗漏与业务交付验收 |
| 保存导出 | 本地历史与指定目录文件 | 确认版本凭据、无覆盖/部分失败恢复 |

单位是一次经确认、可回源报告及全部补漏/恢复，不按扫描条数或首屏行数声称节时省钱。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/package.json:2-4](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/package.json#L2-L4)

组件版本。

```text
  "name": "@zzerx/dsh-plugin-daily-log",
  "version": "0.4.3",
  "description": "每日工作日志：聚合 Git 提交与本地 agent 对话（deepseek/claude/codex），按自定义模板生成日报/周报/月报；agent 工具按需注入，默认只挂一个 daily_log 派发器。",
```

**依据 2 · 源码核查**：[packages/plugin-daily-log/package.json:26-34](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/package.json#L26-L34)

lib主/客户端导出。

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
```

**依据 3 · 源码核查**：[packages/plugin-daily-log/package.json:48-70](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/package.json#L48-L70)

构建与宿主peer。

<details>
<summary>查看原文（23行）</summary>

```text
  "scripts": {
    "prepublishOnly": "node scripts/build.mjs",
    "build": "node scripts/build.mjs",
    "push:npm": "npm publish --registry=https://registry.npmjs.org",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "publishConfig": {
    "access": "public"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/cordis-plugin-loader": "^1.0.5",
    "@deepseek-ai/dsh-agent": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-brand": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-commands": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-llm": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-settings": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-storage-domain": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-system-prompt": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-typert-protocol": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-user-approval": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/schemastery": "^3.18.4"
```

</details>

**依据 4 · 作者声明**：[packages/plugin-daily-log/README.md:15-38](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/README.md#L15-L38)

作者流程和按需工具定位。

<details>
<summary>查看原文（24行）</summary>

```text
## 怎么用

在会话里说出需求即可，例如「帮我生成本周周报」：agent 先与你确认时间范围与项目，再扫描 Git 提交与本地 agent 对话，按模板章节把活动归纳成业务化报告，你确认后存进报告历史，可一键导出 `.md`。

| 方式 | 说明 |
|---|---|
| 敲 `/report 生成这周的周报` | 指令把你这句话续成一条用户消息交给模型，**不用重述需求**。注意要带需求：裸敲 `/report` 不产生模型轮次，那一轮自然也没有可投递引导的通道。 |
| 直接说「帮我生成本周周报」 | 模型自己启用整组工具，再走上面的流程。 |

## 能做什么

- **多源采集**：Git 仓库（`git log`）、Claude Code、Codex、DeepSeek harness 的会话记录。
- **报告历史 + 导出**：历史报告可查看 / 删除，一键导出 `.md` 到本地目录。
- **默认只统计本人提交**：Git 渠道按提交身份过滤（项目级 `author` > 设置里的邮箱 > 仓库的 `git config user.email`）；填 `*` 或 `all` 放开全作者。对话渠道没有作者维度，不受影响。
- **控制上下文占用**：扫描默认只给分组级索引（渲染行数只与「会话 / 分支」数量有关，与被折叠的消息条数无关），要看细节再取摘要或逐条明细；被折叠的分组会**显式列出名称与条数**，不会静默丢弃。
- **剥离注入内容**：宿主往会话里塞的包裹块（打开 / 选中的文件、环境与权限说明、AGENTS.md 提示、命令回显、任务通知）在解析阶段剥离，只按白名单标签匹配，正文里的普通尖括号内容不会被误伤。

## 模板

模板是「指令段（可选） + `<!-- DATA -->` + 骨架段」的 Markdown：两段都作为结构引导注入生成阶段，AI 按骨架章节撰写正文（不是占位符替换）。内置 default 提供五节骨架（核心产出 / 问题修复 / 技术优化 / 其他工作 / 下一步计划）；模板页可创建 / 编辑自定义模板。

## agent 工具

工具**默认不进模型上下文**：新会话只挂 1 个常驻派发器 `daily_log`；需要时才把 15 个 `daily_log_*` 工具注入本会话，启用后在该会话内保持可见，不跨会话泄漏。设置里的「注册 /report 指令」只管这个指令是否注册（默认开，关掉后模型仍可自行启用整组工具）。
```

</details>

**依据 5 · 源码核查**：[packages/plugin-daily-log/src/service.ts:277-315](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/service.ts#L277-L315)

prepare/save/export实际责任。

<details>
<summary>查看原文（39行）</summary>

```text
  async prepareReport(input: ReportPrepareInput): Promise<ReportPrepareResult> {
    const ids = input.sourceIds ?? Array.from(this.sources.entries(), ([, s]) => s.id)
    const template = this.resolveTemplate(input.templateId)
    const parts = parseTemplate(template?.content ?? DEFAULT_TEMPLATE_SKELETON)
    return {
      reportType: input.reportType,
      dateRange: input.dateRange,
      sourceIds: ids,
      sourceCount: ids.length,
      template: {
        name: template?.name ?? BUILTIN_TEMPLATE,
        ...(parts.promptSection !== null ? { promptSection: parts.promptSection } : {}),
        skeletonSection: parts.skeletonSection,
      },
    }
  }

  async saveReport(input: ReportSaveInput): Promise<ReportRecord> {
    const markdown = input.markdown.trim()
    if (!markdown) throw new Error('报告正文不能为空')
    return this.createReport({
      title: input.title?.trim() || (input.reportType ?? '报告') + ' · ' + formatDateRange(input.dateRange),
      markdown,
      sourceIds: input.sourceIds,
      ...(input.templateId !== undefined ? { templateId: input.templateId } : {}),
      ...(input.reportType !== undefined ? { reportType: input.reportType } : {}),
      dateRange: input.dateRange,
    })
  }

  /** 返回导出文件的绝对路径。 */
  async exportReport(id: ReportId, outputDir?: string): Promise<string> {
    const report = this.reports.get(id)
    if (!report) throw new Error('report ' + id + ' not found')
    const dir = outputDir?.trim() || this.configuredOutputDir() || join(homedir(), 'daily-log-reports')
    await mkdir(dir, { recursive: true })
    const safe = report.title.replace(/[\\/:*?"<>|]/g, '-').trim() || 'report'
    const filePath = join(dir, safe + '.md')
    await writeFile(filePath, report.markdown, 'utf8')
```

</details>

**依据 6 · 源码核查**：[packages/plugin-daily-log/src/agent/scan-render.ts:141-183](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/scan-render.ts#L141-L183)

展示预算边界。

<details>
<summary>查看原文（43行）</summary>

```text
export function renderScan(entries: readonly ActivityEntry[], options: RenderScanOptions = {}): string {
  const level = options.level ?? 'index'
  if (entries.length === 0) return '(no entries)'
  if (level === 'raw') return renderRaw(entries, options)
  const maxLines = options.maxLines ?? DEFAULT_MAX_LINES[level]
  const maxGroups = options.maxGroups ?? DEFAULT_MAX_GROUPS[level]
  const lines: string[] = []
  const folded: string[] = []
  for (const block of blocksOf(entries)) {
    const groups = groupsOf(block.entries)
    const summary = block.entries.reduce(
      (acc, e) => (e.kind === 'commit' ? { commits: acc.commits + 1, messages: acc.messages } : { commits: acc.commits, messages: acc.messages + 1 }),
      { commits: 0, messages: 0 },
    )
    const counts = [summary.commits > 0 ? summary.commits + ' 提交' : '', summary.messages > 0 ? summary.messages + ' 条消息' : ''].filter(Boolean).join(' / ')
    lines.push('[' + block.channel + '] ' + block.label + ' · ' + spanOf(block.entries) + ' · ' + counts + ' · ' + groups.length + ' 组')
    for (const g of groups.slice(0, maxGroups)) {
      if (level === 'summary') {
        lines.push('  ▸ ' + g.title + ' · ' + spanOf(g.entries) + ' · ' + countText(g))
        const q = firstUser(g)
        const a = lastAssistant(g)
        if (q) lines.push('    问：' + q)
        if (a) lines.push('    答：' + a)
      } else {
        lines.push('  · ' + g.title + ' · ' + spanOf(g.entries) + ' · ' + countText(g))
      }
    }
    if (groups.length > maxGroups) {
      const rest = groups.slice(maxGroups)
      folded.push(block.channel + '/' + block.label + ' ' + rest.length + ' 组（' + rest.slice(0, 3).map((g) => g.title).join('、') + (rest.length > 3 ? ' 等' : '') + '）')
    }
  }
  let truncatedLines = 0
  if (lines.length > maxLines) {
    truncatedLines = lines.length - maxLines
    lines.length = maxLines
  }
  const footer: string[] = []
  if (folded.length > 0) footer.push('… 未展开分组：' + folded.join('；'))
  if (truncatedLines > 0) footer.push('… 另有 ' + truncatedLines + ' 行未显示')
  const total = entries.reduce((n, _e) => n + 1, 0)
  footer.push('（共 ' + total + ' 条 · ' + blocksOf(entries).reduce((n, b) => n + groupsOf(b.entries).length, 0) + ' 组；下钻：level=summary，或 level=raw + session_id / keywords）')
  return lines.concat(footer).join('\n')
```

</details>

#### 缺口

- 缺同活动集的资源、token、补漏/纠错和总恢复对照。
  **影响**：不能量化净节时、成本或完整报告率。
  **进一步探讨**：比较人工与插件，计事实正确/漏项、全部IO/调用与人工时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前采用与生产方向如何判断？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察，尚不把草稿当完整工作证明。经常整合多源活动的个人有明确用途，但静默截断/日期与partial丢失妨碍判断“都找到了吗”，确认/覆盖前提和部分启用又影响恢复。维护者可在匿名临时数据里核窗口、作者、全部渠道和同名导出，不直接接敏感工作日志。若漏项无从解释、完成项无来源、错误启用或导出状态不明，停止成文/写入，保留草稿回原生日志和人工报告。

值得借鉴agent scope按需工具及索引下钻；未来优先是覆盖收据与事实链接，而非再扩展模板数。每渠道报告probe/读取/跳过/失败/截断和窗口/游标，agent/UI传递partial，正文项链接活动ID并标完成/讨论/待确认；保存绑定正文hash确认，导出带批准根与版本/预期不存在，局部启用失败可回滚。这是建议，不是现有功能。

对照当前版和人工整理，以501提交、probe失败、坏日志、旧目录跨日续写、纯日期until/缺省、无邮箱、虚构完成项、同名导出及第N工具失败为反例。比较漏项是否可见、事实误报、误覆盖、重复注册和总人工/模型成本；如果收据/确认负担不减错误或恢复时间，不计有效优势。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/src/sources/git.ts:101-122](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/sources/git.ts#L101-L122)

截断收据候选的当前基线。

<details>
<summary>查看原文（22行）</summary>

```text
  async scan({ path, label, range, author }): Promise<ActivityEntry[]> {
    const authorFilter = await resolveAuthorFilter(path, author)
    // 用 --branches/--remotes/--tags 而非 --all：--all 会把 refs/stash 里的
    // stash 提交（'On <branch>: …' / 'index on <branch>: …'）当成本周工作。
    const args = [
      'log', '--branches', '--remotes', '--tags', `--format=${LOG_FORMAT}`,
      `--since=${range.since}`, `--max-count=${MAX_COMMITS + 1}`,
    ]
    if (range.until) args.push(`--until=${range.until}`)
    if (authorFilter) args.push(`--author=${authorFilter}`)
    const out = await gitLog(path, args)
    return parseGitLog(out).slice(0, MAX_COMMITS).map((c) => {
      const branch = primaryBranch(c.branch)
      return {
        ts: Date.parse(c.date) || 0,
        sourceLabel: label,
        kind: 'commit',
        title: c.message || '(no message)',
        body: `${c.hash} · ${c.date}${c.branch ? ` · ${c.branch}` : ''}`,
        ...(branch ? { group: branch, groupTitle: branch } : {}),
      }
    })
```

</details>

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/service.ts:208-239](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/service.ts#L208-L239)

probe和partial应传递。

<details>
<summary>查看原文（32行）</summary>

```text
  async scanSource(id: SourceId, range: DateRange): Promise<ScanResult> {
    await this.ensureMigrated()
    const source = this.sources.get(id)
    if (!source) throw new Error(`source ${id} not found`)
    const entries: ActivityEntry[] = []
    const errors: string[] = []
    for (const ch of this.channels) {
      let hit = false
      try {
        hit = await ch.probe(source.path)
      } catch {
        hit = false
      }
      if (!hit) continue
      try {
        const author = this.resolveGitAuthor(source)
        const got = await ch.scan({
          path: source.path,
          label: source.label,
          range,
          ...(author !== undefined ? { author } : {}),
        })
        entries.push(...got.map((e) => ({ ...e, sourceLabel: source.label, channel: ch.kind })))
      } catch (e) {
        errors.push(`[${ch.kind}] ${errText(e)}`)
      }
    }
    return {
      sourceId: id,
      entries,
      truncated: errors.length > 0,
      ...(errors.length > 0 ? { truncatedHint: errors.join('；') } : {}),
```

</details>

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:194-212](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/agent/tools.ts#L194-L212)

模型侧partial丢失。

<details>
<summary>查看原文（19行）</summary>

```text
    async execute(args) {
      const since = args.since as string
      const until = args.until as string | undefined
      const range = { since, ...(until ? { until } : {}) }
      const list = await svc.listSources()
      const targets = args.source_id !== undefined
        ? list.filter((s) => s.id === (args.source_id as SourceId))
        : list
      const entries: ActivityEntry[] = []
      for (const s of targets) {
        const r = await svc.scanSource(s.id, range)
        entries.push(...r.entries)
      }
      // 下钻过滤在渲染与结构化返回上同时生效，避免显示与取值不一致。
      const filtered = filterEntries(entries, {
        ...(args.session_id !== undefined ? { sessionId: args.session_id as string } : {}),
        ...(args.keywords !== undefined ? { keywords: args.keywords as string } : {}),
      })
      return { entries: filtered, count: filtered.length }
```

</details>

**依据 4 · 源码核查**：[packages/plugin-daily-log/src/service.ts:294-315](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/service.ts#L294-L315)

正文确认/导出版本前提当前未绑定。

<details>
<summary>查看原文（22行）</summary>

```text
  async saveReport(input: ReportSaveInput): Promise<ReportRecord> {
    const markdown = input.markdown.trim()
    if (!markdown) throw new Error('报告正文不能为空')
    return this.createReport({
      title: input.title?.trim() || (input.reportType ?? '报告') + ' · ' + formatDateRange(input.dateRange),
      markdown,
      sourceIds: input.sourceIds,
      ...(input.templateId !== undefined ? { templateId: input.templateId } : {}),
      ...(input.reportType !== undefined ? { reportType: input.reportType } : {}),
      dateRange: input.dateRange,
    })
  }

  /** 返回导出文件的绝对路径。 */
  async exportReport(id: ReportId, outputDir?: string): Promise<string> {
    const report = this.reports.get(id)
    if (!report) throw new Error('report ' + id + ' not found')
    const dir = outputDir?.trim() || this.configuredOutputDir() || join(homedir(), 'daily-log-reports')
    await mkdir(dir, { recursive: true })
    const safe = report.title.replace(/[\\/:*?"<>|]/g, '-').trim() || 'report'
    const filePath = join(dir, safe + '.md')
    await writeFile(filePath, report.markdown, 'utf8')
```

</details>

**依据 5 · 源码核查**：[packages/plugin-daily-log/src/index.ts:80-89](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-daily-log/src/index.ts#L80-L89)

启用回滚方向对应当前分步注册。

<details>
<summary>查看原文（10行）</summary>

```text
/** 建 gate：一次 enable 同时注入 15 个工具 + 详细引导段。 */
export function createDailyLogGate(ctx: Context): ToolGate {
  return createToolGate((scope) => {
    const disposers: Array<() => void> = []
    buildDailyLogTools(ctx.dailyLog, (definition) => {
      disposers.push(scope.tools.register(definition))
    })
    disposers.push(registerDailyLogGuidance(scope))
    return () => { for (const d of disposers.reverse()) d() }
  })
```

</details>

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
