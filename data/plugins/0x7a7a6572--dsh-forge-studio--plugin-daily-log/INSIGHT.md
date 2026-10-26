# @zzerx/dsh-plugin-daily-log

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[be18a39](https://github.com/0x7A7A6572/dsh-forge-studio/tree/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,593](https://img.shields.io/static/v1?label=npm+30d&message=1%2C593&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log)
<!-- END META -->

> **实现功能**：聚合Git提交和本地Claude、Codex、DSH对话，按项目与时间下钻活动，由会话模型按模板撰写并保存或导出工作报告。

> **核心亮点**：将Git和三类本地日志归一为项目活动，按agent启用工具并用组索引下钻，再由模型按模板成文。详见[Q02](#research-q02)。

> **风险与缺陷**：Git超过500条无截断收据，agent scan丢service partial/错误；提示确认没有状态token，approval缺失/never放行，任意输出目录可同名覆盖。活动不等于业务完成。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 报告面向谁，怎样才算完成业务目标？](#detail-section-11)
  - [Q02 · 数据采集到成文的实际流程是什么？](#detail-section-12)
  - [Q03 · 哪些采集缺口会被隐藏或误当完整？](#detail-section-13)
  - [Q04 · 确认、写入和数据披露受什么硬约束？](#detail-section-14)
  - [Q05 · 依赖与读者流程怎样组织？](#detail-section-15)
  - [Q06 · 按需门和持久化的恢复边界是什么？](#detail-section-16)
  - [Q07 · 成本效果、推荐与创新方向是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要按项目和时间整理工作汇报、同时拥有 Git 或本地 Agent 日志的个人。目标是可溯源的报告草稿，使用者仍须确认真实交付与未完成事项。

直接基线是人工浏览 git log 和多个本地聊天记录后写汇报；比较必须用相同项目、时间窗和作者，核漏项与把讨论误写为完成的比例，同时记录人工核查时间。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多源采集 | Git/Claude/Codex/DSH活动 | 有日志不等于工作完成，缺口需核 |
| 组索引/下钻 | 控首屏与按会话阅读 | 不约束底层整文件读取 |
| 按需工具 | 常驻1再scope注册15 | 是上下文优化，不是授权 |
| 模板生成 | 当前模型按骨架成文 | 提示礼仪，无确定性事实校验 |
| 保存/导出 | 本地历史和markdown | 无强确认token，同名覆盖/路径需核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH storageDomain/settings/remote和Web设置页 | 核心 | 保存源、模板、报告与UI | 需匹配宿主代际 |
| tools、agent.ctx及可选systemPrompt/commands | 会话桥 | 按需工具与/report | 桥可降级，UI可用不证明工具可用 |
| Git程序和repo refs/身份 | Git渠道 | argv git log/config | 无邮箱可能全作者，非完整工作证明 |
| 本地Claude/Codex/DSH日志与读权限 | 对话渠道 | 按cwd/时间解析 | 不兼容/不可读可能被跳过 |
| 当前模型与上下文预算 | 成文必需 | 按模板综合活动 | 不是插件自带离线生成器 |
| 输出目录权限与内容披露许可 | 导出/模型读取前提 | 保存/分享markdown | 无插件物理写根保证 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配源 | 选项目、渠道和明确日期 | 核路径/cwd/作者，别直接全库 |
| 启用 | daily_log或带需求/report | 工具出现并读完整引导 |
| 采集 | 索引后按组下钻 | 对照失败/上限，空结果不当无工作 |
| 成文 | 模板引导归纳，补问隐性工作 | 区分完成/讨论/建议，不照抄模型自述 |
| 审阅 | 人核正文、来源和敏感信息 | 用户明确同意再存/导出 |
| 保存 | 指定批准目录与不冲突标题 | 核文件和报告历史，保留必要证据 |

包需构建lib发布，源码TS/React与大量DSH rc.1开发依赖可见；本轮只读，不执行build或扫描真实用户数据。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用本地Git/日志与模型，无金额依据 | 配源、作者/日期和模板，核本地敏感日志 | 各格式兼容与源校对时间未知 |
| 持续使用 | 扫描Git/整日志IO、模型下钻归纳tokens | 按源下钻与归纳审阅 | token/耗时依数据量，渲染索引不等采集有界 |
| 失败恢复 | 重扫/重读模型与文件恢复资源 | 复核漏项、部分工具启用、覆盖文件和错误汇总 | 缺收据增加人工回溯，恢复时间/金额未量化 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 汇总跨源活动 | Git/三类日志归一到项目活动 | 未证明召回完整，讨论不等于交付 |
| 控上下文首屏 | 按需15工具、组索引和下钻 | 全entries结构化与扫描成本仍存在 |
| 模板化成文 | prompt/骨架分离，历史与markdown导出 | 确认礼仪为软约束，事实需人核 |

> **思考**：Git超过500条无截断收据，agent scan丢service partial/错误；提示确认没有状态token，approval缺失/never放行，任意输出目录可同名覆盖。活动不等于业务完成。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将Git和三类本地日志归一为项目活动，按agent启用工具并用组索引下钻，再由模型按模板成文。详见[Q02](#research-q02)。

将Git和三类本地日志归一为项目活动，按agent启用工具并用组索引下钻，再由模型按模板成文。详见[Q02](#research-q02)。

按 Agent 限定按需工具作用域与组索引下钻值得借鉴，减少常态上下文负担；但注册中途失败缺局部回滚、采集无全链覆盖收据，影响恢复和完整性，详见 [Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Git超过500条无截断收据，agent scan丢service partial/错误；提示确认没有状态token，approval缺失/never放行，任意输出目录可同名覆盖。活动不等于业务完成。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，优先保留渠道截断/失败收据并加确认/安全导出，再以个人匿名语料核事实与漏项。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献由固定提交源码支持；端到端报告或记忆质量未经运行对照；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 packages/plugin-daily-log/README.md、packages/plugin-daily-log/package.json、packages/plugin-daily-log/src/index.ts、packages/plugin-daily-log/src/service.ts、packages/plugin-daily-log/src/agent/reference.ts、packages/plugin-daily-log/src/agent/tool-gate.ts、packages/plugin-daily-log/src/agent/tool-dispatcher.ts、packages/plugin-daily-log/src/agent/scan-render.ts、packages/plugin-daily-log/src/agent/tools.ts、packages/plugin-daily-log/src/sources/git.ts、packages/plugin-daily-log/src/sources/codex.ts、packages/plugin-daily-log/src/sources/conversation-jsonl.ts 及固定范围 inventory；组件：packages/plugin-daily-log。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件关键服务/四渠道结构、Git/Codex/解析、agent派发门/扫描/确认和模板流程；不全代码审计，不扫描用户真实数据或执行目标build/宿主。
- 下一步：采用 [Q07](#research-q07) 的 501 提交、损坏日志和跨日追加样本；核显式部分结果、事实链接、确认与不覆盖导出，不安排真实工作数据或绩效认证。

**分析版本**

- **仓库**：[0x7A7A6572/dsh-forge-studio](https://github.com/0x7A7A6572/dsh-forge-studio)
- **版本号**：0.4.3（[固定提交 be18a39](https://github.com/0x7A7A6572/dsh-forge-studio/tree/be18a392f0c5c60a5253eb267b2f622d3a0e6555)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索渠道覆盖收据、活动ID事实链接、正文hash确认和版本/批准根导出，比较召回/误报与额外成本；未实现。详见[Q07](#research-q07)。

采用 [Q07](#research-q07) 的 501 提交、损坏日志和跨日追加样本；核显式部分结果、事实链接、确认与不覆盖导出，不安排真实工作数据或绩效认证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 49 | — | — | 766 |
| .mjs | source | 1 | 31 | 16 | 10 | — |
| .ts | source | 36 | 3939 | 3065 | 554 | — |
| .tsx | source | 12 | 856 | 748 | 69 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核固定组件多源工作报告链，区分活动与完成、渲染折叠与采集完整、提示确认与硬授权。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 报告面向谁，怎样才算完成业务目标？

**研究主题**：场景与需求

#### 完整回答

面向有Git提交或本地Claude/Codex/DSH对话的知识工作者，按日期/项目整理日报周报月报。Git提供提交活动，对话提供提问与模型回答，模板给业务章节；无需每个项目都有Git。历史报告本地管理、导出Markdown，适合先由本人校对再用于工作汇报。

合格结果须可回到真实活动，区分已完成产出、讨论方案、模型建议和未完成事项。同功能多次提交可合并，但聊天里说完成不证明代码/业务真的交付，commit题目也不证明效果。未提交、会议、协作和线下工作本来不全，模型被提示向人补问而非猜。

基线是人手浏览git log与多个聊天记录再编写。增量在跨源发现、按组下钻和模板辅助，报告仍由当前会话模型亲自写，不是确定性从事件生成经过业务验收的事实账本。

#### 证据与依据

**依据 1 · 作者声明**：[packages/plugin-daily-log/README.md:3-3](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/README.md#L3-L3)

报告场景作者定位。

```text
工作日报告插件：把 **Git 提交**与**本地 agent 对话**（DeepSeek / Claude / Codex）汇总起来，按你自己的模板生成日报 / 周报 / 月报。不只面向开发者——只有本地对话记录，同样能出一份工作总结。
```

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/agent/reference.ts:17-34](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/reference.ts#L17-L34)

真实数据、确认范围及补问/写作引导。

<details>
<summary>查看原文（18行）</summary>

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
].join('\n')

```

</details>

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/service.ts:277-290](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/service.ts#L277-L290)

prepare只解析模板，不执行独立生成。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 数据采集到成文的实际流程是什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host打开daily-log storage domain，提供sources/reports/templates服务和设置页，注册Git/Claude/Codex/DSH四渠道。每项目按probe判渠道再scan，来源统一标sourceLabel/channel。Git用execFile argv，不拼shell；对话按项目cwd归属与时间解析，用户消息剥白名单注入包裹而助手正文保留。

常态只挂daily_log派发器和短指针，模型调用或/report启用时按agent.ctx注册15工具和引导。WeakMap防同agent重复，工具作用域依赖宿主scoped API；详细引导还通过派发器返回文本投递，避免只依赖可能缺失的agent systemPrompt。启用是发现/上下文优化，不是权限批准。

scan默认render为会话/分支组索引，summary选首问末答，raw下钻。prepare给模板prompt/skeleton，模型归纳后save存人提供的markdown，不自校验正文与活动逐条对应。贡献是采集/可缩放浏览/按需工具接线，不是新报告模型。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/src/index.ts:56-80](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/index.ts#L56-L80)

domain/服务/渠道和设置。

<details>
<summary>查看原文（25行）</summary>

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

/** 建 gate：一次 enable 同时注入 15 个工具 + 详细引导段。 */
```

</details>

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/index.ts:83-94](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/index.ts#L83-L94)

按scope注册全工具。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/agent/tool-gate.ts:43-64](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/tool-gate.ts#L43-L64)

按agent幂等与释放。

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

**依据 4 · 源码核查**：[packages/plugin-daily-log/src/agent/tool-dispatcher.ts:45-69](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/tool-dispatcher.ts#L45-L69)

调用scope和引导投递。

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

**依据 5 · 源码核查**：[packages/plugin-daily-log/src/agent/scan-render.ts:141-183](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/scan-render.ts#L141-L183)

分组索引/summary/折叠。

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

**依据 6 · 源码核查**：[packages/plugin-daily-log/src/service.ts:294-304](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/service.ts#L294-L304)

save接受markdown。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些采集缺口会被隐藏或误当完整？

**研究主题**：缺陷与关键质疑

#### 完整回答

Git最多请求501条后slice500，provider只返回ActivityEntry[]，没有上限截断标记。service的truncated仅在渠道抛错时为true，因此超500提交可以无提示丢第501及后续。更进一步，agent scan只合并r.entries，丢r.truncated/truncatedHint，渠道部分失败可在模型侧变成正常少量/空活动。渲染层“未展开分组”提示只覆盖已采集entries的展示预算，不保证原始渠道全量。

Codex逐文件read失败直接continue，解析无效JSON/非目标role/无时间窗等返回undefined，没有每文件未读/未解析计数。日期目录按日志文件创建的年月日筛选，而同会话可能跨日追加；需核跨日事件位于旧目录是否漏选。非YYYY-MM-DD回全库也不代表日期语义一致。

Git“默认本人”最终回git config user.email，缺失时空过滤取全作者；--author默认按Git模式匹配，并非严格邮箱身份验证。parseGitLog用|分隔，提交subject/author含|会移位，不能当可靠结构协议。白名单剥壳减少注入噪声，但用户正讨论同名标签的合法内容也可能被删；它不证明敏感信息全部脱敏或日志提示注入已经无效。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/src/sources/git.ts:50-72](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/sources/git.ts#L50-L72)

作者空值不过滤和管道分隔。

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

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/sources/git.ts:101-122](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/sources/git.ts#L101-L122)

请求501后slice500无元数据。

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

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/service.ts:208-239](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/service.ts#L208-L239)

错误才truncated。

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

**依据 4 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:194-212](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/tools.ts#L194-L212)

agent scan只取entries丢错误状态。

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

**依据 5 · 源码核查**：[packages/plugin-daily-log/src/sources/codex.ts:15-41](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/sources/codex.ts#L15-L41)

日期目录选择。

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

**依据 6 · 源码核查**：[packages/plugin-daily-log/src/sources/codex.ts:95-110](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/sources/codex.ts#L95-L110)

读取失败continue。

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

**依据 7 · 源码核查**：[packages/plugin-daily-log/src/sources/conversation-jsonl.ts:15-45](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/sources/conversation-jsonl.ts#L15-L45)

白名单正则剥壳。

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

- 不同客户端日志版本、跨日续写与异常行的真实覆盖率未有语料对照。
  **影响**：不能给扫描召回率或报告完整性保证。
  **进一步探讨**：构造跨日同会话、坏行、不可读文件、501+提交和无邮箱案例，核原始数量与显式缺失收据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 确认、写入和数据披露受什么硬约束？

**研究主题**：缺陷与关键质疑

#### 完整回答

引导要求先确认日期项目、展示正文再经用户确认保存/导出，但没有阶段状态机或确认token。saveReport只检非空markdown，工具/remote直调可越过prepare/展示；不能声称每份报告都有机器可验的人确认。

写工具pre-execute仅当approval存在且policy ask才请求确认；never、无seam或无agent对应undefined会放行。这是作者避免禁弹窗模式确定性拒绝的选择，不是禁止写入的safe-mode围栏。服务端export允许input.outputDir或配置/家目录，mkdir递归后writeFile标题.md，标题过滤路径符号但不核输出目录allowlist、不防同名覆盖或链接目标。未实际导出，不能称已经越界写入。

源路径与本地聊天内容可以进入模型工具结果，按需注册不等于按项目最小授权，所有session共享svc配置的项目。组索引减少首轮显示，不意味着所有结构化entries不可能进入宿主日志。导出/转发报告前应核秘密、个人信息和第三方对话，剥系统包裹不是脱敏。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/src/agent/reference.ts:22-34](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/reference.ts#L22-L34)

确认礼仪是提示。

<details>
<summary>查看原文（13行）</summary>

```text
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
].join('\n')

```

</details>

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/service.ts:294-315](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/service.ts#L294-L315)

save非空与任意输出目录/覆盖写。

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

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:74-84](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/tools.ts#L74-L84)

ask仅policy ask。

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

**依据 4 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:539-548](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/tools.ts#L539-L548)

approval缺失/never放行。

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

**依据 5 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:198-212](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/tools.ts#L198-L212)

默认scan所有来源与结构化entries。

<details>
<summary>查看原文（15行）</summary>

```text
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

#### 缺口

- 宿主remote/工具权限与实际文件系统ACL/链接状态未在组件内确定。
  **影响**：不把任意目录参数直接推断为已发生未授权写入。
  **进一步探讨**：可继续核同版本remote授权与可写根策略，受控同名/链接输出比较拒绝点。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖与读者流程怎样组织？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动强依赖 storageDomain 保存来源、模板和报告，工具/提示桥分别晚挂；因此 UI 正常不保证会话工具已挂载。Git 依赖本机程序、refs 和作者身份，对话依赖匹配的本地日志格式及读权限。成文由当前会话模型完成，不是插件自带离线报告器。

应先明确日期、项目、作者和披露许可，再由索引进入原文；跨源空结果与错误必须逐项核对，不能把少量记录当全部工作。准备模板、模型归纳、人工审阅、保存导出是不同责任阶段。包需构建 lib；本轮不构建、不扫描用户数据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/src/index.ts:56-80](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/index.ts#L56-L80)

核心服务依赖。

<details>
<summary>查看原文（25行）</summary>

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

/** 建 gate：一次 enable 同时注入 15 个工具 + 详细引导段。 */
```

</details>

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/index.ts:97-116](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/index.ts#L97-L116)

可选工具/提示/指令桥。

<details>
<summary>查看原文（20行）</summary>

```text
export function installDailyLogAgentBridgeWhenReady(ctx: Context, settings: DailyLogSettingsAccess): void {
  const gate = createDailyLogGate(ctx)
  ctx.effect(() => () => gate.dispose())
  // tools 与 systemPrompt 仍分开 inject：任一缺失只降级该部分（沿用原有容错姿态）。
  void ctx.inject(['tools'], (toolsCtx) => {
    try {
      installDailyLogTools(toolsCtx, gate)
    } catch (error) {
      toolsCtx.logger.error('[plugin-daily-log] agent tools install failed — daily_log_* unavailable to sessions:', error)
    }
  })
  void ctx.inject(['systemPrompt'], (promptCtx) => {
    try {
      installDailyLogPointerPrompt(promptCtx)
    } catch (error) {
      promptCtx.logger.error('[plugin-daily-log] pointer prompt install failed:', error)
    }
  })
  installReportCommand(ctx, gate, settings)
}
```

</details>

**依据 3 · 作者声明**：[packages/plugin-daily-log/README.md:41-46](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/README.md#L41-L46)

作者开发命令。

````text

```bash
pnpm --filter @zzerx/dsh-plugin-daily-log typecheck   # tsc --noEmit
pnpm --filter @zzerx/dsh-plugin-daily-log build       # lib/index.js + lib/client.js + lib/types
```

````

**依据 4 · 源码核查**：[packages/plugin-daily-log/src/service.ts:308-315](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/service.ts#L308-L315)

输出前提。

```text
  async exportReport(id: ReportId, outputDir?: string): Promise<string> {
    const report = this.reports.get(id)
    if (!report) throw new Error('report ' + id + ' not found')
    const dir = outputDir?.trim() || this.configuredOutputDir() || join(homedir(), 'daily-log-reports')
    await mkdir(dir, { recursive: true })
    const safe = report.title.replace(/[\\/:*?"<>|]/g, '-').trim() || 'report'
    const filePath = join(dir, safe + '.md')
    await writeFile(filePath, report.markdown, 'utf8')
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 按需门和持久化的恢复边界是什么？

**研究主题**：工程质量与复用

#### 完整回答

按agent WeakMap避免重复启用，all Set保留release用于插件停用统一清理。createDailyLogGate先逐个register再加guidance，只有全部成功才返回总disposer；若中途register抛错，没有catch回滚已注册子项，gate.enable也在contribution成功后才记installed。故部分失败可能留下部分工具，下次重试重复注册；是否宿主自动回收需另核，不能从一次enable错误推断绝无残留。

all Set持有每个成功release直到插件卸载，WeakMap本身不保证相关scope立即释放；长进程大量会话的保留成本未测。domain close在effect及apply失败调用但void不等待；渠道采集顺序执行，Git execFile设maxBuffer无timeout，日志readFile整文件读，渲染折叠并不限制首次解析内存和扫描时长。

服务和提示做了错误/空结果区分的局部设计，但provider内部continue和tools丢truncated又破坏可见性。更优先的是统一采集收据，再谈按组索引节省多少上下文；不能把低显示行数等同低全部执行成本。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/src/index.ts:83-94](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/index.ts#L83-L94)

逐个register无局部回滚。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/agent/tool-gate.ts:43-64](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/tool-gate.ts#L43-L64)

成功后记installed与all到卸载。

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

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/index.ts:56-78](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/index.ts#L56-L78)

domain清理/失败路径。

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

**依据 4 · 源码核查**：[packages/plugin-daily-log/src/sources/git.ts:21-31](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/sources/git.ts#L21-L31)

buffer限制无timeout。

<details>
<summary>查看原文（11行）</summary>

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

**依据 5 · 源码核查**：[packages/plugin-daily-log/src/sources/codex.ts:95-110](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/sources/codex.ts#L95-L110)

整文件读取。

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

**依据 6 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:203-212](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/tools.ts#L203-L212)

错误元数据丢失。

<details>
<summary>查看原文（10行）</summary>

```text
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

#### 缺口

- 注册中途异常/会话销毁与长进程资源保留无受控轨迹。
  **影响**：不能判断实际重复工具或内存增长幅度。
  **进一步探讨**：故障注入第N个注册及多会话退出，核注册数/disposer/堆保留与重试幂等。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 成本效果、推荐与创新方向是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先观察。多源采集、scope工具启用和组下钻是实用组合，但Git截断无标记、扫描工具丢渠道失败、文件写入无独立范围/不覆盖保证，会影响报告可信度。修前不把输出当完整工作证明；可信个人环境也应对原始窗口、作者和省略项逐一核对。

可探讨“活动覆盖收据与事实链接”。每渠道返回扫描范围、读/跳过/失败/截断数量与续页游标，agent/UI保留partial；报告每项绑定活动ID并标完成/讨论/待确认，保存带正文hash确认token，导出带预期不存在/版本与批准根。相较现有提示，目标减少静默漏项和未确认覆盖，不是自动认证绩效。

未实现。最小对照用501提交、坏日志/跨日续写、缺邮箱、模型虚构完成项和同名导出，比较召回、显式缺口、事实误报、写入拒绝及人工耗时；若收据/链接的额外成本不能减少漏项误报，不计有效创新。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-daily-log/src/sources/git.ts:101-122](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/sources/git.ts#L101-L122)

覆盖收据方案基线。

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

**依据 2 · 源码核查**：[packages/plugin-daily-log/src/agent/tools.ts:194-212](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/agent/tools.ts#L194-L212)

partial透传缺口。

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

**依据 3 · 源码核查**：[packages/plugin-daily-log/src/service.ts:294-315](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-daily-log/src/service.ts#L294-L315)

确认hash和输出版本方案基线。

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

#### 缺口

- 人工汇总与插件的召回、事实误报、总token/时间缺少同语料对照。
  **影响**：不能量化省时或报告质量提升。
  **进一步探讨**：固定匿名多源时间窗与人工核验事实表，再比较收据完整性、准确和总成本。
- 覆盖收据/事实链接/确认hash和版本导出方案未实现。
  **影响**：不计现有功能或提高推荐。
  **进一步探讨**：先最小故障语料对照漏项可见性和新增人工负担。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
