# DSH AgentTeams

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[369c278](https://github.com/NanmiCoder/dsh-agent-teams/tree/369c2785c473e546124ab1709664058e6ea93948)

<!-- BEGIN META -->
[![GitHub ★ 2,715](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C715&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NanmiCoder/dsh-agent-teams) [![npm 30d 53,456](https://img.shields.io/static/v1?label=npm+30d&message=53%2C456&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams)
<!-- END META -->

> **功能**：为 DSH 提供队长与可续聊成员、依赖任务、持久邮箱、质量门禁和 Web 团队视图。

> **亮点**：[Q02](#research-q02)和[Q03](#research-q03)将依赖、执行归属与成员续跑/邮箱持久化，[Q04](#research-q04)把验收声明、审查字节绑定和失败repair/recheck交接纳入任务状态，是超出团队UI的分工机制。Host子Agent/模型/工具与文件权限继承外部；attempt/审计/工具filter分别约束不同层，不能归为写入沙箱。

> **主要限制**：[Q02](#research-q02)批准confirmation非空不是用户新turn授权证明，accepted非完成；[Q03](#research-q03)attempt只约束团队状态/消息，[Q04](#research-q04)验收命令/changedPaths仍有成员自报、实际范围审计在后，[Q05](#research-q05)halt先状态后drain且delete是归档。负责人必须核真实工作区、外部副作用与成本。

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
  - [Q01 · 什么任务需要团队，当前插件和 Host 条件是什么？](#detail-section-11)
  - [Q02 · 计划批准与就绪调度怎样真正启动成员？](#detail-section-12)
  - [Q03 · 身份、attempt、邮箱和持久化能保证什么？](#detail-section-13)
  - [Q04 · 质量合同、范围和验收检查实际拦住什么？](#detail-section-14)
  - [Q05 · Web 控制、停队与删除是否真的停止并清除团队？](#detail-section-15)
  - [Q06 · 怎样有限试用、核成本并人工接手？](#detail-section-16)
  - [Q07 · 已有分工与质量贡献是什么，写前能力假设如何证伪？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 能拆独立工作、给依赖/完成证据并承担复核整合的负责人，用两名以上成员推进任务；成功是可追当前结果、正确归属且未互相覆盖。

[Q01](#research-q01) 手工子Agent+任务清单/消息已可分工；本项持久DAG/attempt、自动领取/恢复、直接邮箱和有界repair/recheck接上责任交接，未证明实际加速、少错或更省成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| staged计划/批准 | roster/DAG先审再启 | 只有required才staged，confirmation非强人类证明 |
| 任务调度 | 依赖/空闲领取、attempt归属与冷恢复 | Host接收非完成，副作用可重复 |
| 成员/邮箱 | 可续Agent、direct mail/状态 | delivered非读懂，filter非文件沙箱 |
| 质量回路 | 证据声明/字节绑定/审计/repair-recheck | verify并未在gate内自动运行，范围事后核 |
| 控制/归档 | halt/drain、退役/归档记录 | 停止可能部分失败，delete非擦除 |

**流程与依赖**

| 依赖或条件 | 具体版本/作用 | 缺失或边界 |
|---|---|---|
| 插件 | @nanmicoder/dsh-agent-teams0.1.29，MIT | Host+可选Web，发行包未验 |
| Node/DSH | Node^22.19.0或>=24；声明DSH>=0.1.2-alpha.2 | 推荐0.2.1-rc.2，0.2.2rc1适配声明非本轮运行 |
| 子Agent provider | 默认spawn，continuable/persona/filter或managed API | 首次spawn查能力，缺失报错 |
| Host工具/模型/权限 | 负责真实推理、工具和递归drain | 插件状态门非OS隔离 |
| 本地状态/worker | .agent-teams JSON/JSONL与审计worker/hash | 明文、同进程锁，磁盘/跨进程另核 |
| 负责人 | 拆分、budget、真实验收/整合 | 无独立复核不适合写并行 |

| 步骤 | 操作 | 核对与失败处理 |
|---|---|---|
| 准备 | 固定Host/provider，独立低权限工作区 | 两成员只读、预算和完成原件 |
| 计划 | 显式required，给role/assignee/deps | 后续明确用户批准/按钮，非空文字非证明 |
| 执行 | 看attempt/任务和邮箱结果 | accepted/delivered非完成，不手工重复启动 |
| 验收 | 核真命令、字节、审计gap与review | 自报passed不能代替独立验收 |
| 失败/退出 | 停新投递，halt后核drain/副作用，归档 | 不确定别立刻重派写，单Agent人工接手 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | Host/模型/本地存储未知 | 版本/角色/DAG/预算/验收配置分钟未知 |
| 持续 | 队长/多成员上下文、worker/邮箱/状态未知 | 核交接、真测试和整合，净节时未测 |
| 失败恢复 | 冷重跑/冲突/追加模型资源未知 | task/邮箱/文件/Host对账与恢复分钟未知 |
| 退出 | 归档/会话/外部数据保留资源未知 | 核drain、残留与备份，已写不可假定回滚 |

| 效果项 | 当前源码支持 | 尚不能证明 |
|---|---|---|
| 分工 | 持久DAG/assignee/attempt与自动领取 | 并行加速/少协调的真实净收益 |
| 归属 | stale任务/邮件拒绝，fork lead识别 | 文件/网络Exactly once或账户隔离 |
| 质量 | 结构证据、revision/gap及有界复审 | 命令真实通过/报告准确/安全合并 |
| 停止 | halted持久、递归drain与归档 | 所有工具静止、数据全删/副作用撤回 |
| 方向 | 写前能力可提出实验 | 未实现/未验，不计现有保障 |

> **思考**：[Q02](#research-q02)批准confirmation非空不是用户新turn授权证明，accepted非完成；[Q03](#research-q03)attempt只约束团队状态/消息，[Q04](#research-q04)验收命令/changedPaths仍有成员自报、实际范围审计在后，[Q05](#research-q05)halt先状态后drain且delete是归档。负责人必须核真实工作区、外部副作用与成本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)和[Q03](#research-q03)将依赖、执行归属与成员续跑/邮箱持久化，[Q04](#research-q04)把验收声明、审查字节绑定和失败repair/recheck交接纳入任务状态，是超出团队UI的分工机制。Host子Agent/模型/工具与文件权限继承外部；attempt/审计/工具filter分别约束不同层，不能归为写入沙箱。

[Q02](#research-q02)驻留park与冷恢复精确回退、[Q03](#research-q03)身份/attempt/邮箱以及[Q04](#research-q04)revision审计与有界修复有局部价值；状态/消息能力、工具集合、声明范围与真实副作用四层分开，不用README安全词或测试规模代运行证据。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)批准confirmation非空不是用户新turn授权证明，accepted非完成；[Q03](#research-q03)attempt只约束团队状态/消息，[Q04](#research-q04)验收命令/changedPaths仍有成员自报、实际范围审计在后，[Q05](#research-q05)halt先状态后drain且delete是归档。负责人必须核真实工作区、外部副作用与成本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 两成员只读评审、显式required和后续用户批准、固定预算/完成原件，按[Q04](#research-q04)核真实命令与字节。停队后独立核Host/工作区，未确认不重派写；归档保留，再回单Agent/人工清单，别把关标签/delete当擦除。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

0.1.29原生plugin代表执行/质量/停止归档链已静态核查；建议独立低权限工作区两成员只读试用，保留人工拆分复核。未运行Host/模型/冲突恢复，不能承诺人类强审批、文件隔离、Exactly once或净并行收益。

- 已检查：作者 README、包清单、源码路径 README_ZH.md、package.json、src/artifacts.ts、src/capabilities.ts、src/harness-compat.ts、src/index.ts、src/mailbox.ts、src/members.ts、src/quality-gates.ts、src/scheduler.ts、src/state.ts、src/tools.ts、src/web-routes.ts、src/workspace-audit-service.ts、src/workspace-audit-worker.ts、src/workspace-audit.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：前稿五题/12findings完整复核；当前Host注册/配置、staged/approve真实门、依赖attempt调度与Host子Agent/FIFO、任务更新/身份/邮箱持久、工具过滤、质量声明/字节绑定/worker hash、Web门、halt/drain和archive失败。未全审每profile/Host兼容分支、所有UI/策略/成员LLM/真实并行效果与HostOS权限。
- 下一步：只读固定源码与研究材料装配/结构校验，未安装/运行目标测试/Host/模型/真实账户或文件。未来隔离两成员只读试验，再授权核故障/冲突/审批/真实命令与恢复成本；写前能力只是候选。

**分析版本**

- **仓库**：[NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)
- **版本号**：0.1.29（[固定提交 369c278](https://github.com/NanmiCoder/dsh-agent-teams/tree/369c2785c473e546124ab1709664058e6ea93948)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07)在Host实际操作前绑定member/attempt/真实path能力，转派撤销旧能力；对照已有声明重叠+工具filter、独立工作区/人工合并，测越界/旧attempt写、误拒与恢复分钟。已有create scope门不当新发明；Host不可拦、独立工作区等价或负担更高即推翻，未实现。

只读固定源码与研究材料装配/结构校验，未安装/运行目标测试/Host/模型/真实账户或文件。未来隔离两成员只读试验，再授权核故障/冲突/审批/真实命令与恢复成本；写前能力只是候选。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 73 | 20113 | 17770 | 1105 | — |
| .md | source | 217 | 29993 | — | — | 467014 |
| .md | example | 44 | 3998 | — | — | 39474 |
| .mjs | test | 43 | 6800 | 5903 | 442 | — |
| .mjs | example | 27 | 2154 | 2021 | 90 | — |
| .ts | example | 2 | 136 | 100 | 26 | — |
| .js | source | 40 | 18558 | 16109 | 2472 | — |
| .ts | source | 32 | 14715 | 11340 | 2604 | — |
| .tsx | source | 7 | 2671 | 2404 | 141 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/NanmiCoder/dsh-agent-teams/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核团队从计划到真实成员执行、任务/消息、质量与停队归档的状态和副作用边界，推导采用与生产方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么任务需要团队，当前插件和 Host 条件是什么？

**研究主题**：场景与需求、依赖、兼容与流程、贡献与相对优势

#### 完整回答

本项是 @nanmicoder/dsh-agent-teams 0.1.29/MIT，Node ^22.19.0或>=24、包engines.dsh>=0.1.2-alpha.2，原生Host工具+Web客户端插件。README推荐Host0.2.1-rc.2并说明0.2.2-rc.1适配，不把最低声明或矩阵当本轮实际安装/模型可用；首次spawn还要已注册continuable provider及对应能力。Web观察入口是可选，不挂Web仍可工具运行。

场景是负责人能拆出独立工作、定义先后依赖和验收，并承担汇总/合并复核；成功不只是多Agent同时有输出，而是正确归属/顺序、质量结果可追到当前字节且未覆盖他人工作。直接替代是手动创建子Agent、共享任务清单和人工发消息。插件多做持久DAG、attempt归属、自动就绪领取、成员直接邮箱和质量修复/复审交接，真实分工增量应和界面便利分开；未证并行更快或净成本更低。

Host apply解析owner toolPolicies，默认stateDir .agent-teams、memberProvider spawn、memberMaxDepth0/maxMembers8，注册团队工具和capability；slash command默认开，Web依赖服务迟绑定。默认最大人数不是推荐并发或费用上限，成员模型/工具服务依赖Host和外部provider。此次完整重核旧五题与12findings，代表实际建队/批准/派发、任务/消息、质量、halt/archive链，不全审全部profile、UI绘图、每Host兼容分支或模型效果。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/package.json#L1-L18)

插件版本与Host/client双导出。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "@nanmicoder/dsh-agent-teams",
  "version": "0.1.29",
  "description": "AgentTeams for DeepSeek Harness: multi-agent team collaboration (captain, members, tasks with dependencies, messaging) driven by natural language, with a tree monitor in the web GUI",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:35-35](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/package.json#L35-L35)

MIT许可证。

```text
  "license": "MIT",
```

**依据 3 · 源码核查**：[package.json:59-80](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/package.json#L59-L80)

Node/DSH最低、bundle和client注入。

<details>
<summary>查看原文（22行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24",
    "dsh": ">=0.1.2-alpha.2"
  },
  "publishConfig": {
    "access": "public",
    "tag": "latest",
    "registry": "https://registry.npmjs.org/"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-ui-model-selection",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-client-ui-session",
```

</details>

**依据 4 · 作者声明**：[README_ZH.md:37-58](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/README_ZH.md#L37-L58)

作者功能/质量边界与推荐Host。

<details>
<summary>查看原文（22行）</summary>

```text
## 版本更新

[最新发布](https://github.com/NanmiCoder/dsh-agent-teams/releases/latest) 恢复 Harness `0.2.2-rc.1` 的成员模型回退，并改进任务收尾、活动更新和交付物审计。推荐宿主为 Harness `0.2.1-rc.2`。详见[测试矩阵](./compatibility.json)和[发布说明](./release-notes/v0.1.29.md)。

## 为什么需要 AgentTeams？

| 能力 | 带来的变化 |
| --- | --- |
| **队长式委派** | 当前会话负责建队、分配角色并汇总最终结果。 |
| **可续聊成员** | 成员是可持续唤醒的 DSH 子 Agent，可以继续执行聚焦的后续轮次。 |
| **带依赖的任务** | 任务有明确状态；依赖未完成时不能领取。 |
| **自动续领与安全接管** | 成员空闲后自动领取下一项就绪任务；转派会撤销旧 attempt，冷恢复会重试遗留任务，迟到结果无法覆盖。 |
| **成员直达消息** | 成员通过持久化邮箱直接联系队友或队长，不需要队长中转。 |
| **实时活动面板** | Web UI 用分段进度、可折叠成员树和可交互 DAG 展示实时工作；运行中的子任务会标出使用的模型，团队结束后仍保留完整成员与任务历史。 |
| **质量门禁** | 人只提供目标和约束。默认任务顺序是需求 → 实现 → 验证 → 审查 → 集成，失败后自动修复/复审，恢复团队必须显式 resume。第一版范围控制是完成时审计，不是 host 写入拦截。详见 [docs/quality-gates.md](./docs/quality-gates.md)。 |

对话卡片与活动面板接入 Harness 官方多语言服务，会随宿主在简体中文和英文之间实时切换；任务/成员状态、动态摘要、操作按钮、历史归档标识和无障碍文案都会同步更新，无需刷新页面，也不增加插件自己的语言设置。

## 安装与版本选择

**推荐组合：DeepSeek Harness `0.2.1-rc.2` + AgentTeams `0.1.29`。宿主仍为 RC 版本。**

```

</details>

**依据 5 · 源码核查**：[src/index.ts:194-223](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/index.ts#L194-L223)

默认config、tool policy解析及真实注册。

<details>
<summary>查看原文（30行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const resolved: ToolsConfig = {
    stateDir: config.stateDir ?? '.agent-teams',
    memberProvider: config.memberProvider ?? 'spawn',
    memberModel: config.memberModel,
    memberLlmProvider: config.memberLlmProvider,
    executionPrompt: config.executionPrompt,
    fallback: config.fallback,
    memberMaxDepth: config.memberMaxDepth ?? 0,
    maxMembers: config.maxMembers ?? 8,
    profiles: config.profiles ?? {},
    // Owner configuration is validated once, at mount: an empty or malformed
    // policy must never reach a member creation path.
    toolPolicies: parseToolPolicies(config.toolPolicies),
  }

  // Provider registration is a sibling plugin's effect (`subagent-spawn` /
  // `subagent-fork` rows), which can land after this mount under the Loader's
  // concurrent activation — so capability validation happens at the first
  // member spawn (`spawnMember`), the earliest point the provider list is
  // settled, rather than here.

  const agentTeamsRuntime = registerAgentTeamsTools(ctx, resolved)
  installTeamCapabilities(ctx, {
    stateDir: resolved.stateDir,
    isPendingMember: agentTeamsRuntime.isPendingMember,
    order: config.promptSectionOrder,
    // Keep the bounded profile directory available without extra tool calls.
    // installTeamCapabilities snapshots this once; no business state rewrites it.
    captainPrompt: () => usageSectionText(TEAM_TOOL_NAMES.join(', '), formatProfilesForPrompt(config.profiles)),
```

</details>

**依据 6 · 源码核查**：[src/index.ts:236-255](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/index.ts#L236-L255)

slash默认与Web可选/迟绑定。

<details>
<summary>查看原文（20行）</summary>

```text
  if (config.slashCommand ?? true) {
    ctx.inject(['commands'], (commandCtx) => {
      registerAgentTeamsCommand(commandCtx, () => config.profiles ?? {})
    })
    installAgentTeamsGestureBoundary(ctx, () => config.profiles ?? {})
  }

  // The activity panel data/artwork routes need the Web server and the
  // workspace registry, which headless profiles do not mount; under
  // concurrent activation they may also bind after this plugin. Register the
  // routes lazily: try now, then on each service binding event. In a webless
  // profile the plugin stays tool-only and never blocks boot.
  let webRegistered = false
  const registerWebSurface = (): void => {
    if (webRegistered) return
    const rawWebServer = (ctx.get(WEB_SERVER_KEYS[0]) ?? ctx.get(WEB_SERVER_KEYS[1])) as WebRouteHost | undefined
    const workspaceRegistry = (ctx.get(WORKSPACE_KEYS[0]) ?? ctx.get(WORKSPACE_KEYS[1])) as WorkspaceRegistry | undefined
    if (rawWebServer === undefined || workspaceRegistry === undefined) return
    const webServer = authenticatedWebRoutes(rawWebServer, () => ctx.get('connection') as BrowserRequestGate | undefined)
    webRegistered = true
```

</details>

**依据 7 · 源码核查**：[src/members.ts:1005-1023](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/members.ts#L1005-L1023)

实际provider/continuable/persona/filter前提检查。

<details>
<summary>查看原文（19行）</summary>

```text
  // Fail loud at the first use: provider registration is a sibling plugin's
  // effect and may settle after this plugin mounts. Capability checks here
  // mirror what startContinuable would reject, with an actionable error.
  const provider = ctx.subagents.getProvider(config.provider)
  if (provider === undefined) {
    throw new Error(
      `agent-teams: no subagent provider "${config.provider}" is registered (available: ${ctx.subagents.list().join(', ') || 'none'}) — `
      + 'check that the subagent provider row (e.g. subagent-spawn) is mounted in the composition',
    )
  }
  if (provider.prepareContinuable === undefined) {
    throw new Error(`agent-teams: provider "${config.provider}" does not support continuable members`)
  }
  const legacyCapabilities = provider.capabilities as unknown as { persona?: boolean; toolFilter?: boolean }
  if (!usesManagedActivations(ctx.subagents) && !legacyCapabilities.persona) {
    throw new Error(`agent-teams: provider "${config.provider}" cannot apply a member persona`)
  }
  if (!usesManagedActivations(ctx.subagents) && !legacyCapabilities.toolFilter) {
    throw new Error(`agent-teams: provider "${config.provider}" cannot restrict captain-only tools for members`)
```

</details>

#### 缺口

- 缺真实用户需求/单Agent或手工子Agent对照及安装Host/provider验收。
  **影响**：不能按DAG与并发清单推质量、加速或费用优势。
  **进一步探讨**：隔离工作区以两成员只读任务核版本/provider、依赖与人工整合成本，对照单Agent/手工分派。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 计划批准与就绪调度怎样真正启动成员？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

create只有approval==='required'才写phase staged；遗漏或automatic保留立即执行路径。提示协议要求staged完整计划、新user turn批准，但这不是程序对人类事件的证明。approve工具只检查confirmation非空、调用者为该队captain/fork lead及当前staged/graph/model有效；不核该字符串真来自用户或是否新一轮。Web Approve走Host请求门与captain/team绑定后直接同runtime，不需要模型填confirmation。应该将真实状态门和模型遵循审批协议分开。

staged计划在scheduler锁内明确拒派发。approveStagedTeam锁内validate graph/成员路由后先持久phase running/approvedAt，再kick；kick失败仅日志，因为批准已提交，不能重试审批制造假失败。调度在空闲/图变动kick，nextReady查pending、非reassigning且依赖满足，先指定成员再无assignee。锁内从fresh state检查halt/staged/member空闲，轮换attempt随机UUID/清旧结果、claimed/member working落盘，再生成assignment prompt。

真实spawnMember查continuable/persona/toolFilter支持，调用startMember并传persona、owner解析filter、captain parent及模型快照；compat优先startActivation(delivery parent)，否则startContinuable。后续deliver用Host followup/FIFO或steer API，成功表示prompt被Host接收，不是成员读完或任务完成。startActivation.result catch只防未处理拒绝，不将该Promise结算等同团队质量报告。

驻留成员idle但仍有open attempt会park，不仅凭registry absence就重试；冷进程未观测的durable attempt才可新attempt恢复一次。dispatch失败只在当前attempt仍匹配时回退，恢复失败则恢复旧generation并park，避免无限新attempt。attempt轮换能拒迟到团队状态，不能撤销旧成员之前改文件/发网络的副作用；进程死或Host投递结果未知仍需人工对账。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:1018-1061](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L1018-L1061)

create真实approval===required才staged及持久创建。

<details>
<summary>查看原文（44行）</summary>

```text
      const teamName = args.name.trim()
      if (teamName === '') throw new Error('team name must not be empty')
      const teamId = sanitizeKey(teamName)
      const staged = args.approval === 'required'
      // Some models materialize optional parameters as "" instead of omitting
      // them (issue #99). The profile is optional, so treat a blank value
      // exactly like an omitted one instead of failing every create call.
      const profileName = args.profile !== undefined && args.profile.trim() !== ''
        ? args.profile.trim()
        : undefined
      // Gateways materialize the optional `plan` object the same way (issue
      // #234): an empty shell carries no roster, so it is an omitted plan and
      // the profile / inline-plan exclusion below stays untouched.
      const inlinePlan = args.plan !== undefined && !isEmptyInlinePlan(args.plan) ? args.plan : undefined
      if (profileName !== undefined && inlinePlan !== undefined) throw new Error('choose either a configured profile or an inline plan')
      const created = await withTeamLock(captainLockKey(stateRoot, captain.id), async () => {
        const current = await findTeamByParticipant(stateRoot, captain.id, await leadIdentityOfAsync(ctx, captain.session))
        if (current !== undefined) {
          const leads = await sessionLeadsTeamAsync(ctx, current, captain.id)
          const relationship = leads ? 'lead' : 'belong to'
          const guidance = leads
            ? 'Use agent_teams_status and continue the existing team. Do not delete and recreate it merely to continue work. End it only when the user explicitly wants a separate new team.'
            : 'Continue your assigned member work and report to your captain; do not create a separate team.'
          throw new Error(`you already ${relationship} team "${current.name}" (id ${current.id}). ${guidance}`)
        }
        return withTeamLock(teamLockKey(stateRoot, teamId), async () => {
          const existing = await readTeam(stateRoot, teamId)
          if (existing !== undefined) {
            throw new Error(`team id "${teamId}" is taken by another captain — pick a different team name`)
          }
          if (profileName === undefined && inlinePlan === undefined) {
            const state: TeamState = {
              name: teamName,
              id: teamId,
              description: args.description,
              captainSessionId: captain.id,
              createdAt: Date.now(),
              members: [],
              tasks: [],
              taskSeq: 0,
              ...staged ? { phase: 'staged' as const, planReviewState: 'awaiting_review' as const } : {},
            }
            await createTeamDir(stateRoot, state)
            return { committed: true as const, state }
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:1281-1308](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L1281-L1308)

approval字符串只非空/主体与runtime调用。

<details>
<summary>查看原文（28行）</summary>

```text
    name: 'agent_teams_approve',
    description: 'Approve and start a staged team plan. Call this only in response to an explicit user approval in a new user turn; never call it during the turn that created or edited the plan. The Web Approve & Run button uses the same runtime directly.',
    parameters: {
      confirmation: { type: 'string', required: true, description: 'The user\'s explicit approval statement.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          status: { type: 'string', required: true },
          team_id: { type: 'string', required: true },
          members: { type: 'number', required: true },
          tasks: { type: 'number', required: true },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `Team ${value.team_id} approved and running (${value.members} members, ${value.tasks} tasks).`,
      }],
    },
    async execute(args, exec) {
      if (args.confirmation.trim() === '') throw new Error('explicit user approval text is required')
      const captain = requireCaptain(exec)
      const workspace = workspaceOf(captain)
      const team = await requireCaptainTeam(ctx, workspace, config, captain)
      const approved = await approveStagedTeam(captain, team.id, exec.signal)
      return { status: 'running', team_id: approved.teamId, members: approved.members, tasks: approved.tasks }
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:831-867](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L831-L867)

staged验证、running先落盘与kick失败不报批准失败。

<details>
<summary>查看原文（37行）</summary>

```text
  const approveStagedTeam: AgentTeamsRuntime['approveStagedTeam'] = async (captain, teamId, signal) => {
    const workspace = workspaceOf(captain)
    const stateRoot = stateRootOf(workspace, config)
    const runSignal = signal ?? new AbortController().signal
    const approved = await withTeamLock(teamLockKey(stateRoot, teamId), async () => {
      const fresh = await requireFreshCaptainTeam(ctx, stateRoot, teamId, captain.id)
      requireStagedTeam(fresh)
      // A staged removal has no child session to retain in history. Drop those
      // placeholders before transitioning to the stricter running shape.
      fresh.members = fresh.members.filter((member) => member.status !== 'removed')
      validateStagedGraph(fresh, true)
      const selections = []
      for (const member of fresh.members) {
        const selection = await resolveMemberLlmSelection(ctx, captain, {
          provider: member.provider, model: member.model, reasoningEffort: member.reasoningEffort, fallback: member.fallback,
        }, runSignal)
        selections.push(selection)
        member.provider = selection.provider
        member.model = selection.model
        member.reasoningEffort = selection.reasoningEffort
      }
      await validateMemberLlmSelections(ctx, selections, runSignal)
      fresh.phase = 'running'
      delete fresh.planReviewState
      fresh.approvedAt = Date.now()
      await writeTeam(stateRoot, fresh)
      return { teamId: fresh.id, members: fresh.members.length, tasks: fresh.tasks.length }
    })
    try {
      await scheduler.kickTeam(workspace, teamId, await liveLeadAnchorAgent(ctx, { captainSessionId: captain.id, name: teamId }, captain))
    } catch (error: unknown) {
      // Approval is already durably committed. A transient wake-up failure is
      // recoverable by the next status/member lifecycle kick and must not make
      // the UI report that an already-running team failed to approve.
      ctx.logger.warn(`agent-teams: post-approval kick failed for "${teamId}": ${String(error)}`)
    }
    return approved
```

</details>

**依据 4 · 源码核查**：[src/index.ts:361-384](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/index.ts#L361-L384)

Web绑定captain/team后直接approve并通知captain。

<details>
<summary>查看原文（24行）</summary>

```text
        const captain = ctx.agents.get(sessionId as import('@deepseek-ai/dsh-session').SessionId)
        if (captain === undefined) {
          res.writeHead(409, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          res.end(JSON.stringify({ error: 'captain session is not attached' }))
          return
        }
        const workspace = captain.session.header.cwd ?? process.cwd()
        const stateRoot = join(workspace, resolved.stateDir)
        const team = await findTeamByCaptain(stateRoot, captain.id, await leadIdentityOfAsync(ctx, captain.session))
        if (team === undefined || team.id !== teamId) {
          res.writeHead(404, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          res.end(JSON.stringify({ error: 'team not found for this captain' }))
          return
        }
        try {
          if (action === 'approve') {
            const approved = await agentTeamsRuntime.approveStagedTeam(captain, teamId)
            // The browser receives the HTTP result, so the model needs its own
            // control message. steer wakes an idle captain or joins its next
            // step; the tool approve path already returns to the model itself.
            try {
              captain.steer(createUserMessage({
                content: [{ type: 'text', text: stagedPlanApprovedContext(team.name) }],
                source: agentTeamsSource({ kind: 'agent-teams' }, observedSessionFormatVersion(captain)),
```

</details>

**依据 5 · 源码核查**：[src/scheduler.ts:202-207](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/scheduler.ts#L202-L207)

真实pending/依赖就绪挑选。

```text
function nextReadyTask(tasks: readonly TeamTask[], memberName: string): TeamTask | undefined {
  const ready = tasks.filter(task => task.status === 'pending'
    && task.reassigning !== true
    && unsatisfiedDependencies([...tasks], task.dependencies).length === 0)
  return ready.find(task => task.assignee === memberName)
    ?? ready.find(task => task.assignee === undefined)
```

**依据 6 · 源码核查**：[src/scheduler.ts:353-400](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/scheduler.ts#L353-L400)

halt/staged门、park/cold恢复和新attempt落盘。

<details>
<summary>查看原文（48行）</summary>

```text
        const ticket = await withTeamLock(teamLockKey(stateRoot, team.id), async (): Promise<DispatchTicket | undefined> => {
          const fresh = await readTeam(stateRoot, team!.id)
          if (fresh === undefined || fresh.halted === true || fresh.phase === 'staged') return undefined
          const currentMember = fresh.members.find(candidate => candidate.name === memberName && candidate.status !== 'removed')
          if (currentMember === undefined || !isMemberAvailable(ctx, currentMember)) return undefined
          const owned = ownedOpenTask(fresh.tasks, currentMember.name)
          // An idle edge observed by this scheduler parks the exact open
          // capability. Harness may dispose its AgentHandle after settlement,
          // so registry absence is not evidence that the owner was lost. Keep
          // the marker sticky across later kicks; only a durable attempt that
          // this process has not observed is eligible for one cold recovery.
          const parkedAttemptId = parkedAttempts.get(currentMember.id)
          const recoverOwned = owned !== undefined
            && (owned.attemptId === undefined || owned.attemptId !== parkedAttemptId)
          const task = recoverOwned ? owned : owned === undefined
            ? nextReadyTask(fresh.tasks, currentMember.name)
            : undefined
          if (task === undefined) {
            if (currentMember.status !== 'idle') {
              currentMember.status = 'idle'
              await writeTeam(stateRoot, fresh)
            }
            return undefined
          }
          const previousAssignee = task.assignee
          const previousStatus = recoverOwned ? task.status as 'claimed' | 'in_progress' : undefined
          const previousAttempt = recoverOwned ? task.attempt : undefined
          const previousAttemptId = recoverOwned ? task.attemptId : undefined
          const previousResult = recoverOwned ? {
            output: task.output, verdict: task.verdict, findings: task.findings,
            changedPaths: task.changedPaths, acceptanceResults: task.acceptanceResults, commandsRun: task.commandsRun,
          } : undefined
          const attemptId = beginTaskAttempt(task, currentMember.name)
          // A verdict must be able to say which revision was on disk when it
          // started, so a review that runs while someone else edits the tree
          // cannot later claim to have judged stable bytes (issue #161).
          if (isVerdictKind(taskKindOf(task))) {
            const scope = verdictScopePatterns(fresh, task)
            if (scope.length > 0) task.verdictStartSnapshot = snapshotWorkspacePaths(workspace, scope)
          }
          // A recovered generation is parked before delivery. This makes each
          // (member, attempt) recovery idempotent even if every status poll
          // sees a disposed handle. Fresh pending work remains unparked so a
          // genuinely lost first delivery can be recovered once.
          if (recoverOwned) parkedAttempts.set(currentMember.id, attemptId)
          else parkedAttempts.delete(currentMember.id)
          currentMember.status = 'working'
          await writeTeam(stateRoot, fresh)
```

</details>

**依据 7 · 源码核查**：[src/state.ts:171-197](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/state.ts#L171-L197)

新attempt清结果/随机ID/claimed。

<details>
<summary>查看原文（27行）</summary>

```text
/** Execution results belong to one attempt; a retry must produce its own evidence. */
function clearAttemptResult(task: TeamTask): void {
  task.output = undefined
  task.verdict = undefined
  task.findings = undefined
  task.changedPaths = undefined
  task.acceptanceResults = undefined
  task.commandsRun = undefined
}

/** Activate the task's current generation for one owner and return its capability id. */
export function activateTaskAttempt(task: TeamTask, assignee: string): string {
  const attemptId = randomUUID()
  task.status = 'claimed'
  task.assignee = assignee
  task.attemptId = attemptId
  task.handoffId = undefined
  task.reassigning = false
  clearAttemptResult(task)
  task.updatedAt = Date.now()
  return attemptId
}

/** Start a fresh task generation for one owner. */
export function beginTaskAttempt(task: TeamTask, assignee: string): string {
  task.attempt = (task.attempt ?? 0) + 1
  return activateTaskAttempt(task, assignee)
```

</details>

**依据 8 · 源码核查**：[src/scheduler.ts:448-477](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/scheduler.ts#L448-L477)

实际投递与仅当前attempt失败回退。

<details>
<summary>查看原文（30行）</summary>

```text
        const prompt = assignmentPrompt(ticket, config.stateDir, team.id, workOrderStale)
        const signal = new AbortController().signal
        const accepted = config.dispatch === undefined
          ? await deliverToMember(ctx, captain, ticket.memberId, prompt, signal)
          : await config.dispatch(captain, team.id, ticket.memberName, prompt, signal, 'queue', ticket.attemptId)
        if (accepted) return

        // Roll back only our exact failed dispatch. A concurrent captain
        // handoff has already changed the capability and wins.
        await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
          const fresh = await readTeam(stateRoot, team!.id)
          if (fresh === undefined) return
          const task = fresh.tasks.find(candidate => candidate.id === ticket.taskId)
          if (task?.attemptId !== ticket.attemptId) return
          if (ticket.recoveredOwned && ticket.previousStatus !== undefined && ticket.previousAttemptId !== undefined) {
            // Recovery delivery failed. Restore the durable generation instead
            // of returning it to pending, then keep it parked so later status
            // kicks cannot spend an unbounded sequence of fresh attempts.
            task.status = ticket.previousStatus
            task.assignee = ticket.previousAssignee
            task.attempt = ticket.previousAttempt
            task.attemptId = ticket.previousAttemptId
            Object.assign(task, ticket.previousResult)
            parkedAttempts.set(ticket.memberId, ticket.previousAttemptId)
          } else {
            task.status = 'pending'
            task.assignee = ticket.previousAssignee
            task.attemptId = undefined
            parkedAttempts.delete(ticket.memberId)
          }
```

</details>

**依据 9 · 源码核查**：[src/members.ts:1005-1055](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/members.ts#L1005-L1055)

provider检查、persona/filter/model与真实startMember。

<details>
<summary>查看原文（51行）</summary>

```text
  // Fail loud at the first use: provider registration is a sibling plugin's
  // effect and may settle after this plugin mounts. Capability checks here
  // mirror what startContinuable would reject, with an actionable error.
  const provider = ctx.subagents.getProvider(config.provider)
  if (provider === undefined) {
    throw new Error(
      `agent-teams: no subagent provider "${config.provider}" is registered (available: ${ctx.subagents.list().join(', ') || 'none'}) — `
      + 'check that the subagent provider row (e.g. subagent-spawn) is mounted in the composition',
    )
  }
  if (provider.prepareContinuable === undefined) {
    throw new Error(`agent-teams: provider "${config.provider}" does not support continuable members`)
  }
  const legacyCapabilities = provider.capabilities as unknown as { persona?: boolean; toolFilter?: boolean }
  if (!usesManagedActivations(ctx.subagents) && !legacyCapabilities.persona) {
    throw new Error(`agent-teams: provider "${config.provider}" cannot apply a member persona`)
  }
  if (!usesManagedActivations(ctx.subagents) && !legacyCapabilities.toolFilter) {
    throw new Error(`agent-teams: provider "${config.provider}" cannot restrict captain-only tools for members`)
  }
  const label = `${MEMBER_LABEL_PREFIX}${team.id}:${member.name}`
  // The legacy filter of a member without a configured tool policy: the
  // captain-only deny list plus the depth entries this host registers.
  const requestedFilter = resolvedFilter ?? memberToolFilter(config.maxDepth, restrictableToolNames(captain))
  // The lenient retry may drop names this host reports unknown; keep the exact
  // filter the host accepted for the durable member setup.
  let acceptedFilter = requestedFilter
  const start = await startMemberWithLenientFilter(
    toolFilter => {
      acceptedFilter = toolFilter
      const setup = { persona: memberPersona(team, member, stateDir, config.executionPrompt), toolFilter }
      return selections.withPending(captain.id, label, llmSelection, () => startMember(ctx.subagents, {
        provider: config.provider,
        label,
        request: {
          prompt: [{ type: 'text', text: initialPrompt ?? memberWelcome(team, member.name) }],
          parent: captain,
          persona: memberPersona(team, member, stateDir, config.executionPrompt),
          // Depth deny entries name host tools; resolve them against the
          // running host's registry so a renamed delegation tool cannot abort
          // the spawn (see memberToolFilter). Depth is still enforced by the
          // parent-chain guard installed at plugin mount. A filter the host
          // still rejects is retried without the names it reported.
          toolFilter,
          agentOptions: {
            provider: llmSelection.provider,
            model: llmSelection.model,
            ...llmSelection.reasoningEffort === undefined
              ? {}
              : { reasoningEffort: ReasoningEffortId(llmSelection.reasoningEffort) },
          },
```

</details>

**依据 10 · 源码核查**：[src/harness-compat.ts:71-82](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/harness-compat.ts#L71-L82)

实际managed activation或continuable创建。

<details>
<summary>查看原文（12行）</summary>

```text
export async function startMember(runtime: Context['subagents'], spec: MemberStartSpec): Promise<{ childId: SessionId }> {
  const host = runtime as unknown as CreationBoundary
  if (typeof host.startActivation === 'function') {
    const { persona: _persona, toolFilter: _filter, ...request } = spec.request
    const activation = await host.startActivation.call(runtime, { ...spec, request, delivery: 'parent' })
    // Preserve native settlement as the missing-report/error fallback on both
    // fresh and resumed activations. mailbox.ts deduplicates successful reports.
    void activation.result.catch(() => undefined)
    return activation
  }
  if (typeof host.startContinuable !== 'function') return unsupported('missing member creation API')
  return host.startContinuable.call(runtime, spec)
```

</details>

**依据 11 · 源码核查**：[src/members.ts:1093-1108](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/members.ts#L1093-L1108)

投递Host后返回accepted boolean。

<details>
<summary>查看原文（16行）</summary>

```text
export async function deliverToMember(
  ctx: Context,
  captain: Agent,
  childId: string,
  text: string,
  signal: AbortSignal,
  mode: 'queue' | 'steer' = 'queue',
): Promise<boolean> {
  try {
    const content = [{ type: 'text' as const, text }]
    if (mode === 'steer') await steerMemberPrompt(ctx.subagents, captain, brandedSessionId(childId), content, signal, ctx.agents.get(brandedSessionId(childId)))
    else await queueMemberPrompt(ctx.subagents, captain, brandedSessionId(childId), content, signal)
    return true
  } catch (error: unknown) {
    ctx.logger.warn(`agent-teams: prompt delivery to member ${childId} failed: ${String(error)}`)
    return false
```

</details>

**依据 12 · 源码核查**：[src/harness-compat.ts:313-345](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/harness-compat.ts#L313-L345)

真实followup/FIFO/steer调用及parent校验分支。

<details>
<summary>查看原文（33行）</summary>

```text
export async function queueMemberPrompt(
  runtime: Context['subagents'], parent: Agent, childId: SessionId,
  content: ContentBlock[], signal: AbortSignal,
): Promise<MessageId> {
  const host = boundary(runtime)
  const source = agentTeamsSource({ kind: 'agent-teams' }, observedSessionFormatVersion(parent))
  if (typeof host.followup === 'function') {
    return host.followup.call(runtime, parent, childId, content, { source, signal })
  }
  const deliver = host[hostPromptDeliver]
  if (typeof deliver === 'function') return deliver.call(runtime, parent, childId, content, source, signal, 'queue')
  const queue = host[hostPromptQueue]
  if (typeof queue !== 'function') return unsupported('missing host FIFO delivery')
  return queue.call(runtime, parent, childId, content, source, signal)
}

/** Coordination joins the nearest step, including waking an idle/cold child. */
export async function steerMemberPrompt(
  runtime: Context['subagents'], parent: Agent, childId: SessionId,
  content: ContentBlock[], signal: AbortSignal, live?: Agent,
): Promise<MessageId> {
  const host = boundary(runtime)
  const source = agentTeamsSource({ kind: 'agent-teams' }, observedSessionFormatVersion(live ?? parent))
  const deliver = host[hostPromptDeliver]
  if (typeof deliver === 'function') return deliver.call(runtime, parent, childId, content, source, signal, 'steer')
  if (typeof host.sendMessage === 'function') return host.sendMessage.call(runtime, parent, childId, content, { signal })
  if (typeof host.followup === 'function') {
    if (live === undefined) return queueMemberPrompt(runtime, parent, childId, content, signal)
    if (live.id !== childId || live.session.header.parentSession !== parent.id) throw new Error('invalid member steering authority')
    signal.throwIfAborted()
    const message = createUserMessage({ content, source })
    live.steer(message)
    return message.id
```

</details>

#### 缺口

- 未验证真实审批协议遵循、成员启动/投递/冷恢复与副作用。
  **影响**：提示不是强用户授权，接收不是完成，恢复仍可重复实际工作。
  **进一步探讨**：低权限隔离Host分开核缺confirmation/新turn/按钮、staged不启动、accepted未完成及断线/重启对账。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 身份、attempt、邮箱和持久化能保证什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

团队工具从exec.agent取调用Agent，workspace用session.header.cwd，stateRoot在workspace/config下。fresh captain锁内通过sessionLeadsTeamAsync确认记录队长或fork descendant，participant重新由session身份解析，不能由显示名自称。capabilities还对member的agent.ctx.tools.restrict deny captain-only工具，业务函数仍检查fresh身份；这不是OS账户/文件系统沙箱，Host全局其他工具由owner策略/Host决定。

update_task中队长不能直接覆盖active member-owned任务，须先reassign captain；成员必须是assignee并在当前任务有attempt时传匹配ID，缺参数提示重试同attempt，stale拒绝。terminal任务保原结果，只能追加有归属的补充证据；清attempt与重派是团队状态能力撤销，不是自动停掉文件/远端动作。模型知道旧ID不代表还能提交当前结果。

成员send_message不允许from冒充，source_task/source_attempt必须成对且匹配owner/current；重复内容按目标/来源attempt等去重，邮箱先本地JSONL持久后投递。scheduler会丢stale mail、claim delivery，Host投递accepted后mark delivered，失败release；delivered表示进入Host输入，不是人/模型已阅读、理解或回复。isCurrentMail核来源与目标attempt/status，后续read/receipt另算，不能用delivered承诺Exactly once业务。

state写入team.json和inbox JSONL经临时wx/replace helper；withTeamLock是模块Map Promise串行，保证同进程同key关键区，不是跨进程锁。普通读解析坏状态会throw，不应把损坏当空队继续创建；本轮未证双Host同时操作同工作区安全。团队记录/邮箱为明文，来源与task锁依赖Host可信进程，磁盘/备份/多进程权限另核。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:162-176](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L162-L176)

调用Agent/workspace/stateRoot真实来源。

<details>
<summary>查看原文（15行）</summary>

```text
function requireCaptain(exec: ToolRunContext): Agent {
  if (!exec.agent) {
    throw new Error('agent_teams tools require a calling agent (exec.agent was undefined)')
  }
  return exec.agent
}

/** The captain's workspace directory (team state root parent). */
function workspaceOf(agent: Agent): string {
  return agent.session.header.cwd ?? process.cwd()
}

/** Resolved absolute state root. */
function stateRootOf(workspace: string, config: ToolsConfig): string {
  return join(workspace, config.stateDir)
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:258-281](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L258-L281)

fresh captain/participant身份检查。

<details>
<summary>查看原文（24行）</summary>

```text
async function requireFreshCaptainTeam(
  ctx: Context,
  stateRoot: string,
  teamId: string,
  captainId: string,
): Promise<TeamState> {
  const fresh = await requireFreshTeam(stateRoot, teamId)
  if (!(await sessionLeadsTeamAsync(ctx, fresh, captainId))) {
    throw new Error(`only the captain of team "${fresh.name}" (session ${fresh.captainSessionId}) or one of its fork descendants may perform this operation`)
  }
  return fresh
}

/** Fresh state and caller identity rechecked inside the lock. */
async function requireFreshParticipant(
  ctx: Context,
  stateRoot: string,
  teamId: string,
  callerId: string,
): Promise<{ team: TeamState; identity: ParticipantIdentity }> {
  const fresh = await requireFreshTeam(stateRoot, teamId)
  const identity = await participantIdentityOf(ctx, fresh, callerId)
  if (identity === undefined) throw new Error(`you are no longer an active participant in team "${fresh.name}"`)
  return { team: fresh, identity }
```

</details>

**依据 3 · 源码核查**：[src/capabilities.ts:90-107](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/capabilities.ts#L90-L107)

member实际tools.restrict与prompt/生命周期。

<details>
<summary>查看原文（18行）</summary>

```text
    states.set(agent, state)
    active.add(state)
    try {
      if (member) revoke = agent.ctx.tools.restrict({
        deny: TEAM_TOOL_NAMES.filter(name => !MEMBER_TOOL_NAMES.includes(name)),
      })
      releaseLifetime = agent.ctx.effect(() => state.dispose, 'agent-teams: capability lifetime')
      return state
    } catch (error) { state.dispose(); throw error }
  }

  ctx.systemPrompt.section({
    name: 'agent-teams:usage', order: config.order ?? 117,
    text: ({ agent }) => {
      return agent !== undefined && states.get(agent)?.member ? TEAM_MEMBER_PROMPT : captainPrompt
    },
  })
  onAgentReady(ctx, agent => { attach(agent) })
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:1964-1992](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L1964-L1992)

captain takeover/assignee/current attempt及terminal补充路径。

<details>
<summary>查看原文（29行）</summary>

```text
      const updated = await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
        const { team: fresh, identity } = await requireFreshParticipant(ctx, stateRoot, team.id, caller.id)
        const task = requireTask(fresh, args.task_id)
        if (identity.kind === 'captain'
          && task.assignee !== undefined
          && task.assignee !== CAPTAIN_KEY
          && !TERMINAL_TASK_STATUSES.includes(task.status)
          && !(args.status === 'cancelled' && task.status === 'pending' && (task.attempt ?? 0) === 0 && task.reassigning !== true)) {
          throw new Error(`task ${task.id} is owned by member "${task.assignee}"; call agent_teams_reassign_task with assignee="captain" before takeover`)
        }
        if (identity.kind === 'member') {
          if (task.assignee !== identity.name) {
            throw new Error(`task ${task.id} is assigned to "${task.assignee ?? 'nobody'}", not you`)
          }
          if (task.attemptId !== undefined && (args.attempt_id === undefined || args.attempt_id.trim() === '')) {
            throw new Error(`missing attempt_id for task ${task.id}. Retry this update with attempt_id="${task.attemptId}" from your current assignment. This is a missing parameter, not a revoked attempt; do not restart the work or request reassignment.`)
          }
          if (task.attemptId !== undefined && args.attempt_id !== task.attemptId) {
            throw new Error(`stale attempt for task ${task.id}: expected the current attempt_id; stop work and request fresh assignment`)
          }
        }
        if (TERMINAL_TASK_STATUSES.includes(task.status)) {
          const appended = appendTaskEvidence(task, {
            ...args, findings: parseFindings(args.findings), changedPaths: normalizeBlankOptionalTaskFields(args).changedPaths,
            acceptanceResults: parseAcceptanceResults(args.acceptanceResults), commandsRun: parseCommandResults(args.commandsRun),
          }, identity.name)
          if (appended) await writeTeam(stateRoot, fresh)
          return {
            evidence_count: task.supplementalEvidence?.length ?? 0,
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:2213-2236](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L2213-L2236)

from/source双字段、stale/重复及先写邮箱。

<details>
<summary>查看原文（24行）</summary>

```text
        // `from` may only be the caller's own identity: impersonating another
        // member (or the captain) would poison the mailbox and event records.
        if (args.from !== undefined && args.from !== from) {
          throw new Error(`agent_teams_send_message: "from" must be your own identity ("${from}"), not "${args.from}"`)
        }
        const sourceTaskId = args.source_task_id?.trim() || undefined
        const sourceAttemptId = args.source_attempt_id?.trim() || undefined
        if ((sourceTaskId === undefined) !== (sourceAttemptId === undefined)) throw new Error('send_message requires source_task_id and source_attempt_id together')
        const source = sourceTaskId === undefined
          ? identity.kind === 'member' ? memberOpenTask(fresh, identity.name) ?? fresh.tasks.filter(item => item.assignee === identity.name && item.attemptId !== undefined).sort((a, b) => b.updatedAt - a.updatedAt)[0] : undefined
          : requireTask(fresh, sourceTaskId)
        if (sourceTaskId !== undefined && (source?.assignee !== identity.name || source.attemptId !== sourceAttemptId)) {
          throw new Error('stale or foreign source attempt; stop sending results from the revoked task')
        }
        const sourceFields = source?.attemptId === undefined ? {} : { sourceTaskId: source.id, sourceAttemptId: source.attemptId, sourceTaskStatus: source.status }
        const owned = to === CAPTAIN_KEY ? undefined : memberOpenTask(fresh, requireMember(fresh, to).name)
        const duplicate = (await readMailbox(stateRoot, fresh.id, to)).find(message => message.from === from
          && message.content === args.content && message.taskId === owned?.id && message.attemptId === owned?.attemptId
          && message.sourceTaskId === sourceFields.sourceTaskId && message.sourceAttemptId === sourceFields.sourceAttemptId && message.sourceTaskStatus === sourceFields.sourceTaskStatus
          && isCurrentMail(fresh, message) && (message.attemptId !== undefined || message.sourceAttemptId !== undefined || message.readAt === undefined))
        if (duplicate !== undefined) return { kind: 'duplicate' as const, message: duplicate, from }
        if (to === CAPTAIN_KEY) {
          const message = { ...createMessage(from, CAPTAIN_KEY, args.content), ...sourceFields, deliveryClaimedAt: Date.now() }
          await appendMailbox(stateRoot, fresh.id, CAPTAIN_KEY, message)
```

</details>

**依据 6 · 源码核查**：[src/mailbox.ts:11-24](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/mailbox.ts#L11-L24)

来源/目标attempt/status当前门与内容。

<details>
<summary>查看原文（14行）</summary>

```text
export function isCurrentMail(team: TeamState, message: TeamMessage): boolean {
  if (message.discardedAt !== undefined) return false
  if (message.sourceAttemptId !== undefined && !team.tasks.some(task => task.id === message.sourceTaskId
    && task.attemptId === message.sourceAttemptId && task.assignee === message.from
    && (message.sourceTaskStatus === undefined || !['completed', 'failed', 'cancelled'].includes(task.status) || message.sourceTaskStatus === task.status))) return false
  if (message.attemptId === undefined) return true
  return team.tasks.some(task => task.id === message.taskId && task.attemptId === message.attemptId
    && task.assignee === message.to && (task.status === 'claimed' || task.status === 'in_progress'))
}

/** Include structured provenance even in the status-tool fallback presentation. */
export function mailboxContent(message: TeamMessage): string {
  return (message.sourceTaskId === undefined ? ''
    : `[Source task ${message.sourceTaskId}, attempt_id ${message.sourceAttemptId}${message.sourceTaskStatus === undefined ? '' : `, status=${message.sourceTaskStatus}`}]\n`) + message.content
```

</details>

**依据 7 · 源码核查**：[src/scheduler.ts:326-348](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/scheduler.ts#L326-L348)

mail先claim、投递accepted才delivered、失败release。

<details>
<summary>查看原文（23行）</summary>

```text
        const unread = await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
          const fresh = await readTeam(stateRoot, team!.id)
          if (fresh === undefined) return []
          const pending = await readPendingMailbox(stateRoot, fresh.id, member!.name)
          await discardMailboxMessages(stateRoot, fresh.id, member!.name, pending.filter(message => !isCurrentMail(fresh, message)).map(message => message.id))
          const current = pending.filter(message => isCurrentMail(fresh, message))
          await claimMailboxDelivery(stateRoot, fresh.id, member!.name, current.map(message => message.id))
          return current
        })
        if (unread.length > 0) {
          const prompt = mailboxPrompt(team.id, member.name, unread)
          const signal = new AbortController().signal
          const accepted = config.dispatch === undefined
            ? await deliverToMember(ctx, captain, member.id, prompt, signal, 'steer')
            : await config.dispatch(captain, team.id, member.name, prompt, signal, 'steer')
          if (accepted) {
            await withTeamLock(teamLockKey(stateRoot, team.id), () => (
              markMailboxDelivered(stateRoot, team!.id, member!.name, unread.map(message => message.id))
            ))
          } else {
            await withTeamLock(teamLockKey(stateRoot, team.id), () => (
              releaseMailboxDelivery(stateRoot, team!.id, member!.name, unread.map(message => message.id))
            ))
```

</details>

**依据 8 · 源码核查**：[src/state.ts:440-454](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/state.ts#L440-L454)

实际JSONL读改写持久。

<details>
<summary>查看原文（15行）</summary>

```text
  agentKey: string,
  message: TeamMessage,
): Promise<void> {
  const file = join(stateRoot, teamId, 'inbox', `${sanitizeKey(agentKey)}.jsonl`)
  await mkdir(join(stateRoot, teamId, 'inbox'), { recursive: true })
  let existing = ''
  try {
    existing = await readFile(file, 'utf8')
  } catch (error: unknown) {
    if (!(error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT')) {
      throw error
    }
  }
  const separator = existing !== '' && !existing.endsWith('\n') ? '\n' : ''
  await atomicWriteText(file, `${existing}${separator}${JSON.stringify(message)}\n`)
```

</details>

**依据 9 · 源码核查**：[src/state.ts:67-83](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/state.ts#L67-L83)

Map Promise锁同进程串行。

<details>
<summary>查看原文（17行）</summary>

```text
export async function withTeamLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve()
  let release!: () => void
  const gate = new Promise<void>((resolve) => { release = resolve })
  const tail = previous.then(() => gate)
  locks.set(key, tail)
  await previous
  try {
    return await fn()
  } finally {
    release()
    // Drop this key's queue entry once we are still its tail, so settled
    // teams do not leave one resolved promise chained forever (the same
    // cleanup discipline as the scheduler's serializeMember). A successor
    // that already appended itself owns the map slot; keep its entry.
    if (locks.get(key) === tail) locks.delete(key)
  }
```

</details>

**依据 10 · 源码核查**：[src/state.ts:234-253](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/state.ts#L234-L253)

创建落盘与坏记录拒解析。

<details>
<summary>查看原文（20行）</summary>

```text
export async function createTeamDir(stateRoot: string, state: TeamState): Promise<void> {
  const dir = join(stateRoot, state.id)
  await mkdir(join(dir, 'inbox'), { recursive: true })
  await atomicWriteText(join(dir, 'team.json'), JSON.stringify(state, null, 2))
}

/**
 * Read one team record; `undefined` when absent.
 * @param stateRoot - resolved absolute state root directory.
 * @param teamId - the team's sanitized id.
 */
export async function readTeam(stateRoot: string, teamId: string): Promise<TeamState | undefined> {
  try {
    const raw = await readFile(join(stateRoot, teamId, 'team.json'), 'utf8')
    const value: unknown = JSON.parse(stripLeadingBom(raw))
    const team = coerceTeamState(value, teamId)
    if (team === undefined) {
      throw new Error(`invalid AgentTeams state in team "${teamId}": ${describeTeamStateDefect(value, teamId)}`)
    }
    return team
```

</details>

**依据 11 · 源码核查**：[src/state.ts:300-301](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/state.ts#L300-L301)

team真实writer调用。

```text
export async function writeTeam(stateRoot: string, state: TeamState, commit?: TeamWriteCommit): Promise<void> {
  await atomicWriteText(join(stateRoot, state.id, 'team.json'), JSON.stringify(state, null, 2), commit)
```

**依据 12 · 源码核查**：[src/state.ts:710-735](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/state.ts#L710-L735)

临时wx及受commit signal控制的replace接线。

<details>
<summary>查看原文（26行）</summary>

```text
async function atomicWriteText(file: string, content: string, commit?: TeamWriteCommit): Promise<void> {
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`
  try {
    await writeFile(temporary, content, { encoding: 'utf8', flag: 'wx' })
  } catch (error: unknown) {
    await rm(temporary, { force: true }).catch(() => undefined)
    throw error
  }
  // Stage bytes asynchronously. Guarded callers install the file and apply
  // its live effect in the same JS turn, so abort can never leave a canceled
  // route visible to a synchronous cold read while the rename is pending.
  const remove = (path: string) => rm(path, { force: true })
  let effectFailure: { error: unknown } | undefined
  const commitIfActive = (replace: () => void): boolean => {
    if (commit?.signal.aborted) return false
    replace()
    // An effect failure is not a filesystem failure. Do not let the Windows
    // retry/direct overwrite run the effect again.
    try { commit?.onCommit() } catch (error) { effectFailure = { error } }
    return true
  }
  await replaceFileAtomicOrDirect(temporary, file, content, {
    rename: commit === undefined ? (from, to) => rename(from, to) : async (from, to) => {
      if (!commitIfActive(() => renameSync(from, to))) await remove(from).catch(() => undefined)
    },
    writeFile: commit === undefined ? (target, payload) => writeFile(target, payload, 'utf8') : async (target, payload) => {
```

</details>

#### 缺口

- 未验Host身份fork边界、邮箱读回/重复投递、磁盘故障或多进程并发。
  **影响**：不能承诺跨账号隔离、消息被消费或跨Host状态一致。
  **进一步探讨**：隔离多会话核冒充/stale/from/attempt、投递已接未读，另双进程与磁盘失败核未覆盖状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 质量合同、范围和验收检查实际拦住什么？

**研究主题**：工程质量与复用、缺陷与关键质疑、功能与机制

#### 完整回答

创建任务对implementation/repair且声明inScope的开放写任务检查范围重叠，若无串行依赖就拒；普通kind work不受同一质量合同，不能把默认任务都称写沙箱。该门比较声明路径模式，不核每次Host真实写，未知文件/工具网络副作用仍可能发生。成员工具过滤又是独立层：managed host在child创建前实际tools.restrict(saved setup.filter)+persona，保存setup缺失会拒绝无约束resume，不能把过滤全当提示；它限制工具集合，不是按task.inScope拦每个文件调用。

update_task先parse成员声明的findings、acceptanceResults、commandsRun和changedPaths再evaluateQualityCompletion。review/requirements completed需pass且无未解决high/blocker；implementation/repair/verification/integration completed需每条acceptance与verify都有passed声明，声明失败不得completed；写任务changedPaths必须全in_scope。函数没有在这里替成员运行verify命令，也不证明成员没有漏报changedPaths或真实测试一定通过，passed首先是带结构的成员证据。

closing review/requirements/verification另readArtifactScope，bindReviewToRevision把当次文件digest/gaps/scope和开始快照drift写入task，令后续交付能检查审过哪批字节。status调用workspaceAuditor在worker实际读当前artifact/scope；artifactreader realpath检查、分块hash，并比较读前后fd/path版本，变化给gap。service默认最多16pending、120秒timeout给incomplete，审完重新比team JSON版本，变了再给gap，不把超时/旧结果当当前验收。它是读后审计，仍不是写入锁/分支隔离。

失败review needs_revision或verification可按有界策略生成repair→recheck依赖，reject与轮次上限会escalate到队长，不是永不失败的自动修复。实际工具将生成任务/重接依赖持久化并消息提示；业务交付还需负责人核真实文件/命令与报告，显示completed或pass不等于代码质量已独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/quality-gates.ts:38-39](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/quality-gates.ts#L38-L39)

仅implementation/repair开放状态范围。

```text
const WRITE_KINDS: readonly TaskKind[] = ['implementation', 'repair']
const OPEN_STATUSES: readonly TaskStatus[] = ['pending', 'claimed', 'in_progress']
```

**依据 2 · 源码核查**：[src/quality-gates.ts:347-360](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/quality-gates.ts#L347-L360)

声明scope双向匹配。

<details>
<summary>查看原文（14行）</summary>

```text
export function inScopeOverlap(
  left: readonly string[] | undefined,
  right: readonly string[] | undefined,
): string[] {
  if (left === undefined || right === undefined) return []
  const hits: string[] = []
  for (const a of left) {
    for (const b of right) {
      if (pathMatchesScope(a, b) || pathMatchesScope(b, a) || a === b) {
        if (!hits.includes(a)) hits.push(a)
      }
    }
  }
  return hits
```

</details>

**依据 3 · 源码核查**：[src/quality-gates.ts:451-464](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/quality-gates.ts#L451-L464)

创建范围重叠拒绝。

<details>
<summary>查看原文（14行）</summary>

```text
  if (WRITE_KINDS.includes(kind) && nonemptyStringList(input.inScope)) {
    for (const other of team.tasks) {
      if (!WRITE_KINDS.includes(taskKindOf(other))) continue
      if (!OPEN_STATUSES.includes(other.status)) continue
      if (dependencies.includes(other.id) || other.dependencies.includes('pending-new')) continue
      if (dependencies.includes(other.id)) continue
      const overlap = inScopeOverlap(input.inScope, other.inScope)
      if (overlap.length > 0) {
        return {
          ok: false,
          error: `inScope overlaps ${other.id} at ${overlap.join(', ')}; serialize these tasks or split the paths`,
        }
      }
    }
```

</details>

**依据 4 · 源码核查**：[src/members.ts:684-709](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/members.ts#L684-L709)

managed实际restrict/persona与缺setup拒绝。

<details>
<summary>查看原文（26行）</summary>

```text
    // New activations no longer persist persona/toolFilter in host descriptors.
    // Install them before the first request, and restore the exact saved values
    // after a cold resume. Historical descriptors remain owned by Harness.
    const savedTeam = pending.has(key) ? undefined : readTeamSync(stateRoot, teamId)
    const savedMember = savedTeam?.captainSessionId === parentSessionId
      ? savedTeam.members.find(member => member.id === child.id && member.name === memberName)
      : undefined
    const setup = pendingSetup.get(key) ?? savedMember?.runtimeSetup
    if (usesManagedActivations(ctx.subagents) && savedMember !== undefined
      && setup === undefined && descriptor.toolFilter === undefined) {
      disposeAdmission()
      throw new Error('agent-teams: saved member runtime setup is missing; refusing an unrestricted resume')
    }
    let disposeSetup = (): void => undefined
    if (usesManagedActivations(ctx.subagents) && setup !== undefined) {
      try {
        const stopFilter = childCtx.tools.restrict(setup.toolFilter)
        try {
          const stopPersona = childCtx.systemPrompt.section({
            name: 'deployment:persona-prefix',
            order: childCtx.systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_PREFIX'),
            text: setup.persona,
          })
          disposeSetup = () => { stopPersona(); stopFilter() }
        } catch (error) { stopFilter(); throw error }
      } catch (error) { disposeAdmission(); throw error }
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:2004-2031](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L2004-L2031)

声明证据→completion gate→字段/字节绑定。

<details>
<summary>查看原文（28行）</summary>

```text
        const input = normalizeBlankOptionalTaskFields(args)
        const findings = parseFindings(args.findings)
        const acceptanceResults = parseAcceptanceResults(args.acceptanceResults)
        const commandsRun = parseCommandResults(args.commandsRun)
        const gate = evaluateQualityCompletion(task, {
          status: args.status,
          output: args.output,
          verdict: args.verdict as ReviewVerdict | undefined,
          findings,
          changedPaths: input.changedPaths,
          acceptanceResults,
          commandsRun,
        })
        if (!gate.ok) throw new Error(gate.error ?? 'update_task rejected by quality gates')
        if (args.status !== undefined) {
          const transition = transitionError(task.status, args.status)
          if (transition !== undefined) throw new Error(transition)
          task.status = args.status
        }
        if (args.output !== undefined) task.output = args.output
        if (args.verdict !== undefined) task.verdict = args.verdict as ReviewVerdict
        if (findings !== undefined) task.findings = findings
        if (input.changedPaths !== undefined) task.changedPaths = input.changedPaths
        if (acceptanceResults !== undefined) task.acceptanceResults = acceptanceResults
        if (commandsRun !== undefined) task.commandsRun = commandsRun
        // A passing gate is evidence about a revision: record which one, so a
        // later edit cannot leave the team advertising an unreviewed revision.
        bindClosingVerdict(workspace, fresh, task)
```

</details>

**依据 6 · 源码核查**：[src/quality-gates.ts:546-606](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/quality-gates.ts#L546-L606)

实际各kind完成条件，work直接通过。

<details>
<summary>查看原文（61行）</summary>

```text
export function evaluateQualityCompletion(
  task: TeamTask,
  update: QualityCompletionUpdate,
): QualityCompletionResult {
  const nextStatus = update.status
  if (nextStatus !== undefined && nextStatus !== task.status) {
    if (!STATUS_TRANSITIONS[task.status].includes(nextStatus)) {
      return { ok: false, error: `task status cannot move from "${task.status}" to "${nextStatus}"` }
    }
  }

  const kind = taskKindOf(task)
  if (kind === 'work') return { ok: true }

  const verdict = update.verdict ?? task.verdict
  const findings = update.findings ?? task.findings
  if (kind === 'review' || kind === 'requirements') {
    if (nextStatus === 'completed') {
      if (verdict === undefined) return { ok: false, error: `${kind} cannot complete without verdict=pass` }
      if (verdict !== 'pass') return { ok: false, error: `${kind} with verdict=${verdict} cannot complete` }
      if (openHighFindings(findings).length > 0) {
        return { ok: false, error: `${kind} pass cannot leave unresolved high/blocker findings` }
      }
    }
    if (nextStatus === 'failed' && (verdict === 'needs_revision' || verdict === 'reject')) {
      if ((findings ?? []).length < 1) {
        return { ok: false, error: `${kind} ${verdict} requires at least one finding` }
      }
    }
    return { ok: true }
  }

  if (kind === 'implementation' || kind === 'repair' || kind === 'verification' || kind === 'integration') {
    const commands = update.commandsRun ?? task.commandsRun
    if (commands?.some((item) => item.status === 'failed') === true) {
      if (nextStatus === 'completed') {
        return { ok: false, error: 'verify failure must fail the task', requiredStatus: 'failed' }
      }
    }
    if (nextStatus !== 'completed') return { ok: true }
    const acceptanceResults = update.acceptanceResults ?? task.acceptanceResults
    if (acceptanceResults === undefined || !acceptanceCovered(task.acceptance, acceptanceResults)) {
      return { ok: false, error: `${kind} completion requires passed acceptanceResults for every acceptance item` }
    }
    if (commands === undefined || !verifyCovered(task.verify, commands)) {
      return { ok: false, error: `${kind} completion requires a passed commandsRun entry for every verify command` }
    }
    if (kind === 'implementation' || kind === 'repair') {
      const changed = update.changedPaths ?? task.changedPaths
      if (changed === undefined) {
        return { ok: false, error: `${kind} completion requires changedPaths` }
      }
      for (const path of changed) {
        const classification = classifyChangedPath(path, task.inScope ?? [], task.outOfScope ?? [])
        if (classification !== 'in_scope') {
          return { ok: false, error: `${kind} cannot complete: ${path} is ${classification}` }
        }
      }
    }
  }
  return { ok: true }
```

</details>

**依据 7 · 源码核查**：[src/tools.ts:190-213](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L190-L213)

真实artifact读取并绑定review字节/漂移。

<details>
<summary>查看原文（24行）</summary>

```text
function bindClosingVerdict(workspace: string, team: TeamState, task: TeamTask): void {
  if (task.status !== 'completed') return
  const kind = taskKindOf(task)
  if (kind !== 'review' && kind !== 'requirements' && kind !== 'verification') return
  if ((kind === 'review' || kind === 'requirements') && task.verdict !== 'pass') return
  const scope = verdictScopePatterns(team, task)
  if (scope.length === 0) return
  const read = readArtifactScope(workspace, scope)
  const duringDrift = task.verdictStartSnapshot === undefined
    ? []
    : artifactDrift(task.verdictStartSnapshot.artifacts, read.artifacts)
  const bound = bindReviewToRevision(team, task, {
    artifacts: read.artifacts,
    gaps: read.gaps,
    scope,
    duringDrift,
  })
  task.reviewedTaskId = bound.reviewedTaskId
  task.reviewedAttempt = bound.reviewedAttempt
  task.reviewedArtifacts = bound.reviewedArtifacts
  task.reviewedGaps = bound.reviewedGaps
  task.reviewedScope = bound.reviewedScope
  task.reviewedDuringDrift = bound.reviewedDuringDrift
  task.verdictStartSnapshot = undefined
```

</details>

**依据 8 · 源码核查**：[src/tools.ts:2359-2360](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L2359-L2360)

status实际调用worker auditor。

```text
      const activity = memberActivity(ctx, team.members.map((member) => member.id))
      const audit = await auditor.audit(workspace, team, stateRoot)
```

**依据 9 · 源码核查**：[src/workspace-audit-service.ts:61-79](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/workspace-audit-service.ts#L61-L79)

队列上限/无artifact与工作提交。

<details>
<summary>查看原文（19行）</summary>

```text
  audit(workspace: string, team: TeamState, stateRoot = join(workspace, '.agent-teams')): Promise<DeliveryAudit> {
    if (this.closed) return Promise.resolve(incomplete('workspace audit service was disposed; retry after reload'))
    if (deliveryArtifactPaths(team).length === 0 && deliveryScopePatterns(team).length === 0) {
      return Promise.resolve({ artifacts: [], expandedScope: [] })
    }
    const source = JSON.stringify(team)
    const key = `${resolve(workspace)}\0${resolve(stateRoot)}\0${team.id}\0${createHash('sha256').update(source).digest('hex')}`
    const existing = this.queue.find(job => job.key === key)
    if (existing !== undefined) return existing.promise
    if (this.jobs.size >= (this.options.maxPending ?? 16)) {
      return Promise.resolve(incomplete('workspace audit queue is full; retry instead of treating unaudited bytes as verified'))
    }
    let complete!: AuditJob['complete']
    const promise = new Promise<DeliveryAudit>(done => { complete = done })
    const job: AuditJob = { id: ++this.sequence, key, workspace, stateRoot, source, team: JSON.parse(source) as TeamState, promise, complete }
    this.jobs.add(job)
    this.queue.push(job)
    this.pump()
    return promise
```

</details>

**依据 10 · 源码核查**：[src/workspace-audit-service.ts:119-143](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/workspace-audit-service.ts#L119-L143)

timeout120s/worker与team版本重验。

<details>
<summary>查看原文（25行）</summary>

```text
        worker.on('error', error => { if (this.worker === worker) this.failWorker(`workspace audit worker failed: ${error.message}`) })
        worker.on('exit', code => { if (this.worker === worker) this.failWorker(`workspace audit worker exited (${code}) before completing its evidence`) })
      }
      this.worker.ref()
      this.timer = setTimeout(() => this.failWorker('workspace audit timed out; current bytes could not be verified'), this.options.timeoutMs ?? 120_000)
      this.worker.postMessage({ id: job.id, workspace: job.workspace, team: job.team })
    } catch (error) {
      this.failWorker(`workspace audit could not start: ${String(error)}`)
    }
  }

  private async finish(job: AuditJob, audit: DeliveryAudit): Promise<void> {
    try {
      // Hashing yields the host thread, so a newer task attempt, edit, archive
      // or replacement team can win while the worker is running. Never apply
      // the old answer to that new record, even when its artifact paths match.
      const current = await readTeam(job.stateRoot, job.team.id)
      if (current === undefined || JSON.stringify(current) !== job.source) {
        audit = { ...audit, gaps: [...audit.gaps ?? [], { pattern: '(team revision)', reason: 'team state changed during the workspace audit; retry the current revision' }] }
      }
    } catch (error) {
      audit = { ...audit, gaps: [...audit.gaps ?? [], { pattern: '(team revision)', reason: `team state could not be revalidated after the workspace audit: ${String(error)}` }] }
    }
    if (!this.jobs.delete(job)) return
    job.complete(this.closed ? incomplete('workspace audit service was disposed before its result could be applied') : audit)
```

</details>

**依据 11 · 源码核查**：[src/workspace-audit-worker.ts:6-10](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/workspace-audit-worker.ts#L6-L10)

worker实际调用audit。

```text
parentPort?.on('message', (job: { id: number; workspace: string; team: TeamState }) => {
  try {
    parentPort?.postMessage({ id: job.id, audit: auditTeamWorkspace(job.workspace, job.team) })
  } catch (error) {
    parentPort?.postMessage({ id: job.id, error: String(error) })
```

**依据 12 · 源码核查**：[src/workspace-audit.ts:31-55](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/workspace-audit.ts#L31-L55)

真实scope读取与不可读gap。

<details>
<summary>查看原文（25行）</summary>

```text
export function auditTeamWorkspace(workspace: string, team: TeamState): DeliveryAudit {
  const paths = deliveryArtifactPaths(team)
  const scopePatterns = deliveryScopePatterns(team)
  const [pathRead, scopeRead] = readArtifactScopes(workspace, [paths, scopePatterns]) as [
    { artifacts: ArtifactDigest[]; gaps: ArtifactScopeGap[] },
    { artifacts: ArtifactDigest[]; gaps: ArtifactScopeGap[] },
  ]
  const gaps: ArtifactScopeGap[] = []
  const seen = new Set<string>()
  const recordGap = (pattern: string, reason: string): void => {
    const key = `${pattern}\u0000${reason}`
    if (seen.has(key)) return
    seen.add(key)
    gaps.push({ pattern, reason })
  }
  for (const gap of [...pathRead.gaps, ...scopeRead.gaps]) recordGap(gap.pattern, gap.reason)
  for (const artifact of [...pathRead.artifacts, ...scopeRead.artifacts]) {
    // An unreadable path is not a gap in enumeration but a gap in evidence:
    // report it the same way so no surface treats it as a clean read.
    if (artifact.unreadable === true) recordGap(artifact.path, artifact.reason ?? 'path could not be read')
  }
  return {
    artifacts: pathRead.artifacts,
    expandedScope: scopeRead.artifacts.map((artifact) => ({ path: artifact.path, present: artifact.present })),
    ...gaps.length === 0 ? {} : { gaps },
```

</details>

**依据 13 · 源码核查**：[src/artifacts.ts:118-140](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/artifacts.ts#L118-L140)

realpath内界/分块hash和读前后版本核。

<details>
<summary>查看原文（23行）</summary>

```text
function hashFileConstantMemory(workspaceRoot: string, absolute: string): { sha256: string; size: number; stamp: string; mtimeMs: number } {
  const resolved = realpathSync(absolute)
  if (!insideRoot(workspaceRoot, resolved)) throw changedDuringRead()
  const expected = statSync(resolved, { bigint: true })
  const handle = openSync(resolved, 'r')
  try {
    const before = fstatSync(handle, { bigint: true })
    const stamp = `${resolved}\0${fileVersion(before)}`
    if (!before.isFile() || fileVersion(expected) !== fileVersion(before) || pathStamp(workspaceRoot, absolute) !== stamp) throw changedDuringRead()
    const hash = createHash('sha256')
    const buffer = Buffer.allocUnsafe(HASH_CHUNK_BYTES)
    let size = 0
    for (;;) {
      const read = readSync(handle, buffer, 0, buffer.byteLength, null)
      if (read <= 0) break
      size += read
      // `update` consumes the bytes synchronously, so the buffer is reused.
      hash.update(read === buffer.byteLength ? buffer : buffer.subarray(0, read))
    }
    if (fileVersion(before) !== fileVersion(fstatSync(handle, { bigint: true })) || pathStamp(workspaceRoot, absolute) !== stamp) throw changedDuringRead()
    return { sha256: hash.digest('hex'), size, stamp, mtimeMs: Number(before.mtimeNs) / 1_000_000 }
  } finally {
    closeSync(handle)
```

</details>

**依据 14 · 源码核查**：[src/quality-gates.ts:930-952](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/quality-gates.ts#L930-L952)

失败类型/reject和有界轮次升级。

<details>
<summary>查看原文（23行）</summary>

```text
export function planQualityFollowUp(
  team: TeamState,
  closed: TeamTask,
  options: PlanQualityFollowUpOptions = {},
): PlanQualityFollowUpResult {
  const empty = { created: [] as PlannedFollowUpTask[], tasks: [] as PlannedFollowUpTask[] }
  const escalate = (reason: string): PlanQualityFollowUpResult => ({ ...empty, escalated: true, status: 'escalated', reason })
  const kind = taskKindOf(closed)
  if (closed.status !== 'failed') return empty
  if (kind === 'review' || kind === 'requirements') {
    if (closed.verdict === 'reject') return escalate(`${closed.id} returned verdict=reject; automatic repair is not a substitute for a human decision`)
    if (closed.verdict !== 'needs_revision') return empty
  } else if (kind !== 'verification') {
    // Both quality gates share the findings → repair → re-check contract, so
    // a failed verification self-heals exactly like a failed review (#175B).
    return empty
  }

  const policy = resolveReviewPolicy(team.reviewPolicy)
  const currentRound = closed.round ?? 1
  const nextRound = currentRound + 1
  const maxRounds = kind === 'requirements' ? policy.requirementsMaxRounds : policy.codeMaxRounds
  if (nextRound > maxRounds) return escalate(`${closed.id} reached the ${kind} round ceiling (${maxRounds}); the loop cannot open round ${nextRound}`)
```

</details>

**依据 15 · 源码核查**：[src/quality-gates.ts:1019-1039](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/quality-gates.ts#L1019-L1039)

repair后recheck依赖与分工。

<details>
<summary>查看原文（21行）</summary>

```text
  const checker = schedulableAssignee(
    closed.assignee !== implementer ? closed.assignee : undefined,
    team,
    implementer,
  )
  const recheck: PlannedFollowUpTask = kind === 'verification'
    ? {
      id: `verification-round-${nextRound}`,
      kind: 'verification',
      subject: `verification-round-${nextRound}`,
      assignee: checker,
      dependencies: [repair.id ?? `repair-round-${nextRound}`],
      round: nextRound,
      objective: closed.objective ?? `Re-verify ${sourceId} after ${repair.id ?? `repair-round-${nextRound}`}`,
      acceptance: sanitizeReviewAcceptance(closed.acceptance),
      verify: verifyCommands,
    }
    : {
      id: `review-round-${nextRound}`,
      kind: 'review',
      subject: `review-round-${nextRound}`,
```

</details>

**依据 16 · 源码核查**：[src/tools.ts:2043-2056](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L2043-L2056)

实际生成后持久化/邮箱及escalation。

<details>
<summary>查看原文（14行）</summary>

```text
        if ((followUp?.created.length ?? 0) > 0) {
          const rewired = fresh.tasks.filter(item => priorDependencies.has(item.id) && JSON.stringify(priorDependencies.get(item.id)) !== JSON.stringify(item.dependencies))
          followUpSummary = `Automatic quality follow-up for ${task.id}: ${followUp!.created.map(item => `${item.id} (${item.kind}, owner=${item.assignee ?? 'unassigned'}, deps=${item.dependencies.join(',') || 'none'})`).join('; ')}.${rewired.length ? ` Updated dependencies: ${rewired.map(item => `${item.id} -> ${item.dependencies.join(',')}`).join('; ')}.` : ''} Use these tasks; do not create duplicate repair/review work.${followUp!.excludedFindings === undefined ? '' : ` Findings on default-excluded paths were not turned into a contract and stay with the user: ${followUp!.excludedFindings.join(', ')}.`}`
          followUpMessage = createMessage(CAPTAIN_KEY, CAPTAIN_KEY, followUpSummary)
        }
        if (followUp?.escalated === true) {
          await appendMailbox(stateRoot, fresh.id, CAPTAIN_KEY, createMessage(
            CAPTAIN_KEY,
            CAPTAIN_KEY,
            `Quality-gate loop escalated after ${task.id} (${task.kind ?? 'review'} verdict=${task.verdict}). Automatic repair/review stopped.${followUp.reason === undefined ? '' : ` Reason: ${followUp.reason}.`}${followUp.excludedFindings === undefined ? '' : ` Findings left for the user (default-excluded paths, not a member's to edit): ${followUp.excludedFindings.join(', ')}.`}`,
          ))
        }
        await writeTeam(stateRoot, fresh)
        if (followUpMessage !== undefined) await appendMailbox(stateRoot, fresh.id, CAPTAIN_KEY, followUpMessage)
```

</details>

**依据 17 · 源码核查**：[src/tools.ts:1532-1557](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L1532-L1557)

create_task实际调用validateCreateTask并拒绝gate失败。

<details>
<summary>查看原文（26行）</summary>

```text
      // persisted into team.json, where it would brick the team on reload.
      const input = normalizeBlankOptionalTaskFields(args)
      const created = await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
        const fresh = await requireFreshCaptainTeam(ctx, stateRoot, team.id, captain.id)
        const gate = validateCreateTask(fresh, {
          subject: input.subject,
          description: input.description,
          dependencies: input.dependencies,
          assignee: input.assignee,
          kind: input.kind as TaskKind | undefined,
          round: input.round,
          objective: input.objective,
          inScope: input.inScope,
          outOfScope: input.outOfScope,
          acceptance: input.acceptance,
          verify: input.verify,
          deliverables: input.deliverables,
          nonGoals: input.nonGoals,
          reviewedTaskId: input.reviewedTaskId,
          sourceTaskId: input.sourceTaskId,
          sourceFindingIds: input.sourceFindingIds,
          coverageOf: input.coverageOf,
          resume: input.resume,
          resumeReason: input.resumeReason,
        })
        if (!gate.ok) throw new Error(gate.error ?? 'create_task rejected by quality gates')
```

</details>

#### 缺口

- 未跑真实工作区冲突、漏报/虚报测试、审计超时/漂移与自动修复质量实验。
  **影响**：不能承诺写前阻止越界、命令已真执行或自动回路产出合格交付。
  **进一步探讨**：隔离仓库用声明/实际不一致与并发改文件、worker失败、拒绝/轮次上限验证，人工复核真实命令与字节。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · Web 控制、停队与删除是否真的停止并清除团队？

**研究主题**：缺陷与关键质疑、功能与机制、依赖、兼容与流程

#### 完整回答

Web路由通过authenticatedWebRoutes包装，connection服务缺失503，requestRejection非undefined即拒，之后才进业务。halt/plan route还要求attached captain和teamId匹配记录；这依赖Host浏览器准入，不自动证明每工作区多用户ACL或独立CSRF/人类审批。关闭Web标签只关观察，不是停队；作者也明确历史保留。

haltTeamWork先锁内把非terminal任务cancel、members idle、halted=true持久并发event，再cancel captain keepInbox，按记录captain找到anchor后真实targeted drain子成员，最后再cancel captain以压住结算唤醒；user队列仍保留。若anchor不live会warn并跳过drain仍返回halted状态，或signal/Host drain失败会在状态已halt后报错，所以“halted”不是所有子进程/工具已停的无条件保证。interruptMember本身只是fire-and-return best effort，不可替代drain。

agent_teams_delete实际语义是end/archive：锁内丢未读邮箱、成员removed/撤非terminal attempt后writeTeam，持久retired member IDs，await stopTeamMemberActivations，再把团队目录rename进archive。archive替换旧档有previous目录/失败恢复，清previous失败可能留隐藏恢复目录。团队任务/邮箱与成员会话历史仍存在，不是隐私擦除，删除不会撤回文件/网络副作用。drain兼容层若缺targetedAPI直接unsupported，不会假成功；Host递归排空/工具中止实效仍未运行验证。

退队/删除retired状态和capability/投递guard用于防旧成员再续，但不是OS权限撤销或磁盘历史销毁；多进程并行和Host可信插件仍在不同边界。退出需核当前Host进程/队列、已写文件与外部结果，而不是删.agent-teams或关面板就认为结束。

#### 证据与依据

**依据 1 · 源码核查**：[src/web-routes.ts:101-124](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/web-routes.ts#L101-L124)

真实Host connection准入缺失503/拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
export function authenticatedWebRoutes(
  server: WebRouteHost,
  connection: () => BrowserRequestGate | undefined,
): WebRouteHost {
  return {
    register(route) {
      return server.register({
        ...route,
        async handler(req, res) {
          const gate = connection()
          // Missing/disposing Connection is an assembly failure, never an
          // invitation to expose workspace state or accept plan mutations.
          const rejection = gate === undefined ? 503 : gate.requestRejection(req)
          if (rejection !== undefined) {
            res.writeHead(rejection, {
              'content-type': 'application/json; charset=utf-8',
              'cache-control': 'no-store',
            })
            res.end(JSON.stringify({ error: rejection === 503 ? 'authentication unavailable'
              : rejection === 401 ? 'unauthorized' : 'forbidden' }))
            return
          }
          await route.handler(req, res)
        },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:305-331](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/index.ts#L305-L331)

halt captain/team绑定与实际调用/失败响应。

<details>
<summary>查看原文（27行）</summary>

```text
        const captain = ctx.agents.get(sessionId as import('@deepseek-ai/dsh-session').SessionId)
        if (captain === undefined) {
          res.writeHead(409, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          res.end(JSON.stringify({ error: 'captain session is not attached' }))
          return
        }
        const workspace = captain.session.header.cwd ?? process.cwd()
        const stateRoot = join(workspace, resolved.stateDir)
        const team = await findTeamByCaptain(stateRoot, captain.id, await leadIdentityOfAsync(ctx, captain.session))
        if (team === undefined || team.id !== teamId) {
          res.writeHead(404, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          res.end(JSON.stringify({ error: 'team not found for this captain' }))
          return
        }
        try {
          const result = await haltTeamWork({
            ctx,
            stateRoot,
            teamId,
            captain,
          })
          res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          res.end(JSON.stringify(result))
        } catch (error: unknown) {
          ctx.logger.warn(`agent-teams: halt failed for ${teamId}: ${String(error)}`)
          res.writeHead(500, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          res.end(JSON.stringify({ error: 'failed to stop the team' }))
```

</details>

**依据 3 · 作者声明**：[README_ZH.md:131-146](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/README_ZH.md#L131-L146)

作者关闭标签不停止、历史/状态保留。

<details>
<summary>查看原文（16行）</summary>

```text
## 在工作区查看团队

从当前聊天标题栏或回复下方的团队卡片点击 **查看团队**，在原生「团队协作」标签页中查看成员分工、任务依赖和执行进度。入口跟随所属聊天，不放在通用工作区开始页。

页面直接呈现团队和任务内容；宽屏并排展示，窄分栏自动堆叠。点击任务可定位负责成员，成员图标可打开对应会话。关闭标签页不会停止团队；回到所属聊天可以再次打开。已完成团队保留归档，旧宿主继续使用活动面板。

## 工作方式

1. 当前会话创建团队并成为队长。
2. 队长按角色添加由可续聊子 Agent 驱动的成员。
3. 目标被拆成有负责人和显式依赖的任务。
4. 共享调度器依据真实 `running / idle / ready` 状态，为每个空闲成员原子领取一项就绪任务并唤醒它；驻留成员被中断时会停驻当前 attempt，可通过直接消息继续而不丢 capability；只有冷进程重启后的遗留任务才会生成新 attempt 恢复。
5. 成员携带当前 `attempt_id` 更新任务；转派或队长接管会先撤销旧 attempt、等待原成员安静，再启动新 attempt。
6. 队长汇总结果，随后归档完整团队记录。

团队状态保存在 `<workspace>/.agent-teams/`；Web 面板读取这份磁盘真相，并与实时子 Agent 活动合并展示。
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:564-620](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L564-L620)

halt先持久、双cancel/anchor缺失与drain。

<details>
<summary>查看原文（57行）</summary>

```text
  const halted = await withTeamLock(teamLockKey(input.stateRoot, input.teamId), async () => {
    const fresh = await requireFreshCaptainTeam(input.ctx, input.stateRoot, input.teamId, input.captain.id)
    if (fresh.halted === true) {
      return {
        teamName: fresh.name,
        captainSessionId: fresh.captainSessionId,
        cancelledTasks: fresh.tasks.filter((task) => task.status === 'cancelled').length,
        alreadyHalted: true,
        members: fresh.members.filter((member) => member.id !== '' && member.status !== 'removed').map((member) => ({ ...member })),
      }
    }
    const now = Date.now()
    let cancelledTasks = 0
    for (const task of fresh.tasks) {
      if (TERMINAL_TASK_STATUSES.includes(task.status)) continue
      cancelUnfinishedTask(task, 'Stopped from the captain chat.')
      cancelledTasks += 1
    }
    for (const member of fresh.members) {
      if (member.status === 'removed') continue
      member.status = 'idle'
    }
    fresh.halted = true
    fresh.haltedAt = now
    await writeTeam(input.stateRoot, fresh)
    appendTeamEvent(input.ctx, captainSessionOf(input.ctx, fresh.captainSessionId, input.captain.session), 'agent-teams/team-halted', {
      teamId: fresh.id,
      cancelledTasks,
    })
    return {
      teamName: fresh.name,
      captainSessionId: fresh.captainSessionId,
      cancelledTasks,
      alreadyHalted: false,
      members: fresh.members.filter((member) => member.id !== '' && member.status !== 'removed').map((member) => ({ ...member })),
    }
  })
  // Persist the stop boundary first, then abort the Captain before draining
  // children. Otherwise its current model turn can observe `halted`, call
  // resume, and race the still-running HTTP stop request.
  input.captain.cancel({ kind: 'user' }, { keepInbox: true })
  // Members are children of the recorded captain session, so the parent-bound
  // drain must run as that session when a fork requested the stop.
  const haltAnchor = input.captain.id === halted.captainSessionId
    ? input.captain
    : input.ctx.agents.get(halted.captainSessionId as SessionId)
  if (haltAnchor === undefined) {
    input.ctx.logger.warn(`agent-teams: captain session ${halted.captainSessionId} is not live; member activations of "${halted.teamName}" were not drained from this session`)
  } else {
    await stopTeamMemberActivations(input.ctx, haltAnchor, halted.members, input.signal)
  }
  // Interrupting a child emits a trailing subagent-settled notification. That
  // notification can start a fresh Captain turn after the first cancellation,
  // so close the stop boundary again once every child activation has drained.
  // Queued user input is preserved both times; only runtime-generated work is
  // prevented from silently resuming the halted team.
  input.captain.cancel({ kind: 'user' }, { keepInbox: true })
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:543-554](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L543-L554)

真实targeted drain与signal前门。

<details>
<summary>查看原文（12行）</summary>

```text
async function stopTeamMemberActivations(
  ctx: Context,
  captain: Agent,
  members: readonly TeamMember[],
  signal?: AbortSignal,
): Promise<void> {
  const memberIds = members.filter(member => member.id !== '').map(member => member.id as SessionId)
  if (memberIds.length === 0) return
  // Every supported exact host has targeted recursive drain. Unlike interrupt,
  // it closes admission and clears queued work before awaiting descendants.
  signal?.throwIfAborted()
  await drainMemberChildren(ctx.subagents, captain, memberIds)
```

</details>

**依据 6 · 源码核查**：[src/harness-compat.ts:516-523](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/harness-compat.ts#L516-L523)

实际Host drain API/缺失拒。

```text
export async function drainMemberChildren(runtime: Context['subagents'], parent: Agent, ids: readonly SessionId[]): Promise<void> {
  const host = runtime as unknown as {
    drainChildren?: (parent: Agent, ids: readonly SessionId[]) => Promise<void>
    drainContinuableChildren?: (parent: Agent, ids: readonly SessionId[]) => Promise<void>
  }
  const drain = host.drainChildren ?? host.drainContinuableChildren
  if (typeof drain !== 'function') return unsupported('missing targeted child drain')
  await drain.call(runtime, parent, ids)
```

**依据 7 · 源码核查**：[src/members.ts:1112-1124](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/members.ts#L1112-L1124)

interrupt只是best effort。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Request cancellation of one live member's current turn. Best effort, fire
 * and return; the target may keep running until it observes the signal.
 * @param ctx - the plugin context (injects `subagents`).
 * @param captain - the exact live captain agent (the member's parent).
 * @param childId - the member's durable child session id.
 */
export function interruptMember(ctx: Context, captain: Agent, childId: string): void {
  try {
    ctx.subagents.interrupt(brandedSessionId(childId), { kind: 'ancestor', agent: captain })
  } catch (error: unknown) {
    ctx.logger.warn(`agent-teams: interrupt of member ${childId} failed: ${String(error)}`)
  }
```

</details>

**依据 8 · 源码核查**：[src/tools.ts:2530-2562](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L2530-L2562)

delete撤attempt/retired/drain后archive。

<details>
<summary>查看原文（33行）</summary>

```text
    async execute(_args, exec) {
      const captain = requireCaptain(exec)
      const workspace = workspaceOf(captain)
      const stateRoot = stateRootOf(workspace, config)
      const team = await requireCaptainTeam(ctx, workspace, config, captain)
      const members = await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
        const fresh = await requireFreshCaptainTeam(ctx, stateRoot, team.id, captain.id)
        // Include previously removed members so deleting a pre-fix team also
        // retires durable catalog entries left behind by remove_member.
        const roster = fresh.members.map(member => ({ ...member }))
        for (const member of fresh.members) {
          await discardMailboxMessages(stateRoot, fresh.id, member.name, (await readUnreadMailbox(stateRoot, fresh.id, member.name)).map(message => message.id))
          if (member.status === 'removed') continue
          member.status = 'removed'
          for (const task of fresh.tasks) {
            if (task.assignee === member.name && !TERMINAL_TASK_STATUSES.includes(task.status)) invalidateTaskAttempt(task)
          }
        }
        await writeTeam(stateRoot, fresh)
        return roster
      })
      await recordRetiredMemberIds(stateRoot, members.map(member => member.id))
      await stopTeamMemberActivations(ctx, await memberOperationParent(ctx, team, captain), members, exec.signal)
      await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
        const fresh = await requireFreshCaptainTeam(ctx, stateRoot, team.id, captain.id)
        appendTeamEvent(ctx, captainSessionOf(ctx, fresh.captainSessionId, captain.session), 'agent-teams/team-deleted', {
          teamId: fresh.id,
        })
        // Archive, not delete: tasks (with their dependency graph) and the
        // mailboxes stay on disk for later review and dependency rebuilds.
        await archiveTeamDir(stateRoot, fresh.id)
      })
      return { deleted: true, team_name: team.name }
```

</details>

**依据 9 · 源码核查**：[src/state.ts:1189-1228](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/state.ts#L1189-L1228)

实际archive rename/失败恢复和previous清理。

<details>
<summary>查看原文（40行）</summary>

```text
export async function archiveTeamDir(stateRoot: string, teamId: string): Promise<void> {
  const archiveRoot = join(stateRoot, 'archive')
  await mkdir(archiveRoot, { recursive: true })
  const source = join(stateRoot, teamId)
  const target = join(archiveRoot, teamId)
  const previous = join(archiveRoot, `.${teamId}.previous-${randomUUID()}`)
  let displaced = false
  try {
    // The same Windows EPERM-on-rename applies at the directory boundary: a
    // delete-sharing violation on any file below `target` blocks the move, so
    // retry the transient-lock case before giving up.
    await renameWithRetry(target, previous)
    displaced = true
  } catch (error: unknown) {
    // Only ENOENT means there was nothing to displace; any other failure
    // (including a persistent EPERM lock) surfaces to the caller.
    if (!(error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT')) {
      throw error
    }
  }

  try {
    await renameWithRetry(source, target)
  } catch (error: unknown) {
    if (displaced) {
      try {
        await renameWithRetry(previous, target)
      } catch (restoreError: unknown) {
        throw new AggregateError(
          [error, restoreError],
          `failed to archive team "${teamId}" and restore its previous archive`,
        )
      }
    }
    throw error
  }

  // The new generation is authoritative. A failed cleanup only leaves a
  // hidden recovery directory, which archive discovery deliberately ignores.
  if (displaced) await rm(previous, { recursive: true, force: true }).catch(() => undefined)
```

</details>

**依据 10 · 源码核查**：[src/harness-compat.ts:351-386](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/harness-compat.ts#L351-L386)

真实retired-member投递guard在调用Host前核retired。

<details>
<summary>查看原文（36行）</summary>

```text
export function guardSubagentDelivery(
  ctx: Context, isRetired: (sender: Agent, targetId: SessionId) => Promise<boolean>,
): void {
  const runtime = ctx.subagents
  const host = boundary(runtime)
  const legacy = host.followup
  const queue = host[hostPromptQueue]
  const deliver = host[hostPromptDeliver]
  const send = host.sendMessage
  if (typeof legacy !== 'function' && ((typeof queue !== 'function' && typeof deliver !== 'function') || typeof send !== 'function')) {
    return unsupported('cannot install complete retired-member guard')
  }
  ctx.effect(() => {
    const descriptors = new Map<PropertyKey, PropertyDescriptor | undefined>([
      ['followup', Object.getOwnPropertyDescriptor(host, 'followup')],
      [hostPromptQueue, Object.getOwnPropertyDescriptor(host, hostPromptQueue)],
      [hostPromptDeliver, Object.getOwnPropertyDescriptor(host, hostPromptDeliver)],
      ['sendMessage', Object.getOwnPropertyDescriptor(host, 'sendMessage')],
    ])
    let active = true
    const check = async (sender: Agent, targetId: SessionId): Promise<void> => {
      if (active && await isRetired(sender, targetId)) {
        throw new SubagentError(`AgentTeams member "${targetId}" was retired and cannot be resumed`, 'NOT_RESUMABLE')
      }
    }
    const guardedLegacy: Followup = async (parent, childId, content, options) => {
      await check(parent, childId)
      return legacy!.call(runtime, parent, childId, content, options)
    }
    const guardedQueue: Queue = async (parent, childId, content, source, signal) => {
      await check(parent, childId)
      return queue!.call(runtime, parent, childId, content, source, signal)
    }
    const guardedSend: Send = async (sender, targetId, content, options) => {
      await check(sender, targetId)
      return send!.call(runtime, sender, targetId, content, options)
```

</details>

#### 缺口

- 未验Host准入/工作区授权、停队递归drain、外部工具停止、删除后重启和归档恢复。
  **影响**：不能承诺全子任务静止、全数据已删或所有副作用可撤销。
  **进一步探讨**：隔离Host停含排队/子孙的只读队伍，模拟anchor缺失/drain失败和归档rename失败，核进程、队列、记录与文件。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样有限试用、核成本并人工接手？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

能定义独立任务和复核结果的负责人，先固定0.1.29与真实Host/provider，在独立低权限工作区用两成员做只读评审；明确role/assignee/deps、完成原件和预算。创建显式approval required，先审计划再在后续用户明确指令或Web按钮批准，不把confirmation非空当人类批准证明；初次不让成员共享写同文件或触发真实网络/账号动作。

持续现金有每成员/队长LLM上下文、可能冷恢复重跑、审计worker/磁盘/消息等资源；人工有DAG拆分、声明scope、核验收命令和整合/冲突恢复。金额、tokens、分钟、实际加速与错误率未知，maxMembers8不是成本上限。模型路由快照可选择不同provider/model但未证明新计费或服务供给结构；多成员可能增加总用量，不能以并行墙钟潜在下降当经济收益。

失败时先读status与实际workspace/历史，确认task attempt、消息是否只delivered未消费、审计gaps和预算；旧成员可能已经改文件，拒stale状态不还原代码。halt先落状态后drain会部分失败，要停新投递并独立核Host，未确认不立即恢复/转派写工作。退出归档仍保邮箱/任务，成员会话与外部数据另核；保备份后用单Agent串行和人工清单接手，不直接删状态伪造未发生。发生重复执行、scope/审批不清或成本超预算即停止该团队试验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:59-61](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/package.json#L59-L61)

明确Node/Host最低条件。

```text
  "engines": {
    "node": "^22.19.0 || >=24",
    "dsh": ">=0.1.2-alpha.2"
```

**依据 2 · 源码核查**：[src/index.ts:194-208](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/index.ts#L194-L208)

默认state/provider/人数与owner策略。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const resolved: ToolsConfig = {
    stateDir: config.stateDir ?? '.agent-teams',
    memberProvider: config.memberProvider ?? 'spawn',
    memberModel: config.memberModel,
    memberLlmProvider: config.memberLlmProvider,
    executionPrompt: config.executionPrompt,
    fallback: config.fallback,
    memberMaxDepth: config.memberMaxDepth ?? 0,
    maxMembers: config.maxMembers ?? 8,
    profiles: config.profiles ?? {},
    // Owner configuration is validated once, at mount: an empty or malformed
    // policy must never reach a member creation path.
    toolPolicies: parseToolPolicies(config.toolPolicies),
  }
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:1281-1308](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L1281-L1308)

批准协议文字与实际非空门。

<details>
<summary>查看原文（28行）</summary>

```text
    name: 'agent_teams_approve',
    description: 'Approve and start a staged team plan. Call this only in response to an explicit user approval in a new user turn; never call it during the turn that created or edited the plan. The Web Approve & Run button uses the same runtime directly.',
    parameters: {
      confirmation: { type: 'string', required: true, description: 'The user\'s explicit approval statement.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          status: { type: 'string', required: true },
          team_id: { type: 'string', required: true },
          members: { type: 'number', required: true },
          tasks: { type: 'number', required: true },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `Team ${value.team_id} approved and running (${value.members} members, ${value.tasks} tasks).`,
      }],
    },
    async execute(args, exec) {
      if (args.confirmation.trim() === '') throw new Error('explicit user approval text is required')
      const captain = requireCaptain(exec)
      const workspace = workspaceOf(captain)
      const team = await requireCaptainTeam(ctx, workspace, config, captain)
      const approved = await approveStagedTeam(captain, team.id, exec.signal)
      return { status: 'running', team_id: approved.teamId, members: approved.members, tasks: approved.tasks }
```

</details>

**依据 4 · 源码核查**：[src/scheduler.ts:353-400](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/scheduler.ts#L353-L400)

冷恢复/attempt及持久状态。

<details>
<summary>查看原文（48行）</summary>

```text
        const ticket = await withTeamLock(teamLockKey(stateRoot, team.id), async (): Promise<DispatchTicket | undefined> => {
          const fresh = await readTeam(stateRoot, team!.id)
          if (fresh === undefined || fresh.halted === true || fresh.phase === 'staged') return undefined
          const currentMember = fresh.members.find(candidate => candidate.name === memberName && candidate.status !== 'removed')
          if (currentMember === undefined || !isMemberAvailable(ctx, currentMember)) return undefined
          const owned = ownedOpenTask(fresh.tasks, currentMember.name)
          // An idle edge observed by this scheduler parks the exact open
          // capability. Harness may dispose its AgentHandle after settlement,
          // so registry absence is not evidence that the owner was lost. Keep
          // the marker sticky across later kicks; only a durable attempt that
          // this process has not observed is eligible for one cold recovery.
          const parkedAttemptId = parkedAttempts.get(currentMember.id)
          const recoverOwned = owned !== undefined
            && (owned.attemptId === undefined || owned.attemptId !== parkedAttemptId)
          const task = recoverOwned ? owned : owned === undefined
            ? nextReadyTask(fresh.tasks, currentMember.name)
            : undefined
          if (task === undefined) {
            if (currentMember.status !== 'idle') {
              currentMember.status = 'idle'
              await writeTeam(stateRoot, fresh)
            }
            return undefined
          }
          const previousAssignee = task.assignee
          const previousStatus = recoverOwned ? task.status as 'claimed' | 'in_progress' : undefined
          const previousAttempt = recoverOwned ? task.attempt : undefined
          const previousAttemptId = recoverOwned ? task.attemptId : undefined
          const previousResult = recoverOwned ? {
            output: task.output, verdict: task.verdict, findings: task.findings,
            changedPaths: task.changedPaths, acceptanceResults: task.acceptanceResults, commandsRun: task.commandsRun,
          } : undefined
          const attemptId = beginTaskAttempt(task, currentMember.name)
          // A verdict must be able to say which revision was on disk when it
          // started, so a review that runs while someone else edits the tree
          // cannot later claim to have judged stable bytes (issue #161).
          if (isVerdictKind(taskKindOf(task))) {
            const scope = verdictScopePatterns(fresh, task)
            if (scope.length > 0) task.verdictStartSnapshot = snapshotWorkspacePaths(workspace, scope)
          }
          // A recovered generation is parked before delivery. This makes each
          // (member, attempt) recovery idempotent even if every status poll
          // sees a disposed handle. Fresh pending work remains unparked so a
          // genuinely lost first delivery can be recovered once.
          if (recoverOwned) parkedAttempts.set(currentMember.id, attemptId)
          else parkedAttempts.delete(currentMember.id)
          currentMember.status = 'working'
          await writeTeam(stateRoot, fresh)
```

</details>

**依据 5 · 源码核查**：[src/quality-gates.ts:546-606](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/quality-gates.ts#L546-L606)

质量完成依赖证据与声明范围。

<details>
<summary>查看原文（61行）</summary>

```text
export function evaluateQualityCompletion(
  task: TeamTask,
  update: QualityCompletionUpdate,
): QualityCompletionResult {
  const nextStatus = update.status
  if (nextStatus !== undefined && nextStatus !== task.status) {
    if (!STATUS_TRANSITIONS[task.status].includes(nextStatus)) {
      return { ok: false, error: `task status cannot move from "${task.status}" to "${nextStatus}"` }
    }
  }

  const kind = taskKindOf(task)
  if (kind === 'work') return { ok: true }

  const verdict = update.verdict ?? task.verdict
  const findings = update.findings ?? task.findings
  if (kind === 'review' || kind === 'requirements') {
    if (nextStatus === 'completed') {
      if (verdict === undefined) return { ok: false, error: `${kind} cannot complete without verdict=pass` }
      if (verdict !== 'pass') return { ok: false, error: `${kind} with verdict=${verdict} cannot complete` }
      if (openHighFindings(findings).length > 0) {
        return { ok: false, error: `${kind} pass cannot leave unresolved high/blocker findings` }
      }
    }
    if (nextStatus === 'failed' && (verdict === 'needs_revision' || verdict === 'reject')) {
      if ((findings ?? []).length < 1) {
        return { ok: false, error: `${kind} ${verdict} requires at least one finding` }
      }
    }
    return { ok: true }
  }

  if (kind === 'implementation' || kind === 'repair' || kind === 'verification' || kind === 'integration') {
    const commands = update.commandsRun ?? task.commandsRun
    if (commands?.some((item) => item.status === 'failed') === true) {
      if (nextStatus === 'completed') {
        return { ok: false, error: 'verify failure must fail the task', requiredStatus: 'failed' }
      }
    }
    if (nextStatus !== 'completed') return { ok: true }
    const acceptanceResults = update.acceptanceResults ?? task.acceptanceResults
    if (acceptanceResults === undefined || !acceptanceCovered(task.acceptance, acceptanceResults)) {
      return { ok: false, error: `${kind} completion requires passed acceptanceResults for every acceptance item` }
    }
    if (commands === undefined || !verifyCovered(task.verify, commands)) {
      return { ok: false, error: `${kind} completion requires a passed commandsRun entry for every verify command` }
    }
    if (kind === 'implementation' || kind === 'repair') {
      const changed = update.changedPaths ?? task.changedPaths
      if (changed === undefined) {
        return { ok: false, error: `${kind} completion requires changedPaths` }
      }
      for (const path of changed) {
        const classification = classifyChangedPath(path, task.inScope ?? [], task.outOfScope ?? [])
        if (classification !== 'in_scope') {
          return { ok: false, error: `${kind} cannot complete: ${path} is ${classification}` }
        }
      }
    }
  }
  return { ok: true }
```

</details>

**依据 6 · 源码核查**：[src/tools.ts:564-620](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L564-L620)

halt状态与drain非同一完成。

<details>
<summary>查看原文（57行）</summary>

```text
  const halted = await withTeamLock(teamLockKey(input.stateRoot, input.teamId), async () => {
    const fresh = await requireFreshCaptainTeam(input.ctx, input.stateRoot, input.teamId, input.captain.id)
    if (fresh.halted === true) {
      return {
        teamName: fresh.name,
        captainSessionId: fresh.captainSessionId,
        cancelledTasks: fresh.tasks.filter((task) => task.status === 'cancelled').length,
        alreadyHalted: true,
        members: fresh.members.filter((member) => member.id !== '' && member.status !== 'removed').map((member) => ({ ...member })),
      }
    }
    const now = Date.now()
    let cancelledTasks = 0
    for (const task of fresh.tasks) {
      if (TERMINAL_TASK_STATUSES.includes(task.status)) continue
      cancelUnfinishedTask(task, 'Stopped from the captain chat.')
      cancelledTasks += 1
    }
    for (const member of fresh.members) {
      if (member.status === 'removed') continue
      member.status = 'idle'
    }
    fresh.halted = true
    fresh.haltedAt = now
    await writeTeam(input.stateRoot, fresh)
    appendTeamEvent(input.ctx, captainSessionOf(input.ctx, fresh.captainSessionId, input.captain.session), 'agent-teams/team-halted', {
      teamId: fresh.id,
      cancelledTasks,
    })
    return {
      teamName: fresh.name,
      captainSessionId: fresh.captainSessionId,
      cancelledTasks,
      alreadyHalted: false,
      members: fresh.members.filter((member) => member.id !== '' && member.status !== 'removed').map((member) => ({ ...member })),
    }
  })
  // Persist the stop boundary first, then abort the Captain before draining
  // children. Otherwise its current model turn can observe `halted`, call
  // resume, and race the still-running HTTP stop request.
  input.captain.cancel({ kind: 'user' }, { keepInbox: true })
  // Members are children of the recorded captain session, so the parent-bound
  // drain must run as that session when a fork requested the stop.
  const haltAnchor = input.captain.id === halted.captainSessionId
    ? input.captain
    : input.ctx.agents.get(halted.captainSessionId as SessionId)
  if (haltAnchor === undefined) {
    input.ctx.logger.warn(`agent-teams: captain session ${halted.captainSessionId} is not live; member activations of "${halted.teamName}" were not drained from this session`)
  } else {
    await stopTeamMemberActivations(input.ctx, haltAnchor, halted.members, input.signal)
  }
  // Interrupting a child emits a trailing subagent-settled notification. That
  // notification can start a fresh Captain turn after the first cancellation,
  // so close the stop boundary again once every child activation has drained.
  // Queued user input is preserved both times; only runtime-generated work is
  // prevented from silently resuming the halted team.
  input.captain.cancel({ kind: 'user' }, { keepInbox: true })
```

</details>

**依据 7 · 源码核查**：[src/tools.ts:2530-2562](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L2530-L2562)

退出archive非擦除。

<details>
<summary>查看原文（33行）</summary>

```text
    async execute(_args, exec) {
      const captain = requireCaptain(exec)
      const workspace = workspaceOf(captain)
      const stateRoot = stateRootOf(workspace, config)
      const team = await requireCaptainTeam(ctx, workspace, config, captain)
      const members = await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
        const fresh = await requireFreshCaptainTeam(ctx, stateRoot, team.id, captain.id)
        // Include previously removed members so deleting a pre-fix team also
        // retires durable catalog entries left behind by remove_member.
        const roster = fresh.members.map(member => ({ ...member }))
        for (const member of fresh.members) {
          await discardMailboxMessages(stateRoot, fresh.id, member.name, (await readUnreadMailbox(stateRoot, fresh.id, member.name)).map(message => message.id))
          if (member.status === 'removed') continue
          member.status = 'removed'
          for (const task of fresh.tasks) {
            if (task.assignee === member.name && !TERMINAL_TASK_STATUSES.includes(task.status)) invalidateTaskAttempt(task)
          }
        }
        await writeTeam(stateRoot, fresh)
        return roster
      })
      await recordRetiredMemberIds(stateRoot, members.map(member => member.id))
      await stopTeamMemberActivations(ctx, await memberOperationParent(ctx, team, captain), members, exec.signal)
      await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
        const fresh = await requireFreshCaptainTeam(ctx, stateRoot, team.id, captain.id)
        appendTeamEvent(ctx, captainSessionOf(ctx, fresh.captainSessionId, captain.session), 'agent-teams/team-deleted', {
          teamId: fresh.id,
        })
        // Archive, not delete: tasks (with their dependency graph) and the
        // mailboxes stay on disk for later review and dependency rebuilds.
        await archiveTeamDir(stateRoot, fresh.id)
      })
      return { deleted: true, team_name: team.name }
```

</details>

#### 缺口

- 没有并行/串行对照、总费用和拆分/复核/恢复人时、实际退出验收。
  **影响**：不能证明净收益或适合长期生产并行，限受控只读试点。
  **进一步探讨**：同一小任务比单Agent/人工子Agent和双成员，记录任务质量、人工协调、总tokens/费用、冲突/重跑及恢复分钟。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 已有分工与质量贡献是什么，写前能力假设如何证伪？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

已有增量不只是团队面板：持久DAG/assignee/attempt把创建者、执行成员、复核与集成的责任和交接写入状态，并用依赖、邮箱与有界repair/recheck推进；相对手动子Agent+清单能少一些重复派发/状态协调。质量证据绑定实际artifact revision、审计当前字节与gaps也能约束陈旧pass展示，但不证明LLM报告真实、文件已安全合并或净节时。

核心质疑是团队能力与Host写副作用分离：attempt管状态/消息、工具filter管工具集合、inScope重叠管声明建图、completion/audit管事后证据，都不是每次实际写前同时核当前attempt和真实路径。候选可在支持Host接缝处发一次操作能力，绑定member/attempt/真实path及操作类别，撤派后拒旧能力；不把已有scope创建拒绝和tool restrict包装成候选新功能。并发还需要明确OS/Host边界，不能只加提示。

最小验证只在可丢弃仓库：合法跨scope读、未声明文件写、链接目标、转派期间在途写和外部动作，对比当前声明重叠+独立worktree/人工合并及最小Host能力门。看实际越界/旧attempt写次数、误拒合法任务、人工恢复和额外延迟；若独立工作区已有等价隔离、Host无法可靠拦实际动作或误拒/维护成本更高，则否定新方向。未实现原型或实测，不将它计现有生产保障。

#### 证据与依据

**依据 1 · 源码核查**：[src/scheduler.ts:353-400](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/scheduler.ts#L353-L400)

已有DAG领取/attempt真实机制。

<details>
<summary>查看原文（48行）</summary>

```text
        const ticket = await withTeamLock(teamLockKey(stateRoot, team.id), async (): Promise<DispatchTicket | undefined> => {
          const fresh = await readTeam(stateRoot, team!.id)
          if (fresh === undefined || fresh.halted === true || fresh.phase === 'staged') return undefined
          const currentMember = fresh.members.find(candidate => candidate.name === memberName && candidate.status !== 'removed')
          if (currentMember === undefined || !isMemberAvailable(ctx, currentMember)) return undefined
          const owned = ownedOpenTask(fresh.tasks, currentMember.name)
          // An idle edge observed by this scheduler parks the exact open
          // capability. Harness may dispose its AgentHandle after settlement,
          // so registry absence is not evidence that the owner was lost. Keep
          // the marker sticky across later kicks; only a durable attempt that
          // this process has not observed is eligible for one cold recovery.
          const parkedAttemptId = parkedAttempts.get(currentMember.id)
          const recoverOwned = owned !== undefined
            && (owned.attemptId === undefined || owned.attemptId !== parkedAttemptId)
          const task = recoverOwned ? owned : owned === undefined
            ? nextReadyTask(fresh.tasks, currentMember.name)
            : undefined
          if (task === undefined) {
            if (currentMember.status !== 'idle') {
              currentMember.status = 'idle'
              await writeTeam(stateRoot, fresh)
            }
            return undefined
          }
          const previousAssignee = task.assignee
          const previousStatus = recoverOwned ? task.status as 'claimed' | 'in_progress' : undefined
          const previousAttempt = recoverOwned ? task.attempt : undefined
          const previousAttemptId = recoverOwned ? task.attemptId : undefined
          const previousResult = recoverOwned ? {
            output: task.output, verdict: task.verdict, findings: task.findings,
            changedPaths: task.changedPaths, acceptanceResults: task.acceptanceResults, commandsRun: task.commandsRun,
          } : undefined
          const attemptId = beginTaskAttempt(task, currentMember.name)
          // A verdict must be able to say which revision was on disk when it
          // started, so a review that runs while someone else edits the tree
          // cannot later claim to have judged stable bytes (issue #161).
          if (isVerdictKind(taskKindOf(task))) {
            const scope = verdictScopePatterns(fresh, task)
            if (scope.length > 0) task.verdictStartSnapshot = snapshotWorkspacePaths(workspace, scope)
          }
          // A recovered generation is parked before delivery. This makes each
          // (member, attempt) recovery idempotent even if every status poll
          // sees a disposed handle. Fresh pending work remains unparked so a
          // genuinely lost first delivery can be recovered once.
          if (recoverOwned) parkedAttempts.set(currentMember.id, attemptId)
          else parkedAttempts.delete(currentMember.id)
          currentMember.status = 'working'
          await writeTeam(stateRoot, fresh)
```

</details>

**依据 2 · 源码核查**：[src/quality-gates.ts:451-464](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/quality-gates.ts#L451-L464)

已有建图scope重叠门作为反证。

<details>
<summary>查看原文（14行）</summary>

```text
  if (WRITE_KINDS.includes(kind) && nonemptyStringList(input.inScope)) {
    for (const other of team.tasks) {
      if (!WRITE_KINDS.includes(taskKindOf(other))) continue
      if (!OPEN_STATUSES.includes(other.status)) continue
      if (dependencies.includes(other.id) || other.dependencies.includes('pending-new')) continue
      if (dependencies.includes(other.id)) continue
      const overlap = inScopeOverlap(input.inScope, other.inScope)
      if (overlap.length > 0) {
        return {
          ok: false,
          error: `inScope overlaps ${other.id} at ${overlap.join(', ')}; serialize these tasks or split the paths`,
        }
      }
    }
```

</details>

**依据 3 · 源码核查**：[src/members.ts:684-709](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/members.ts#L684-L709)

已有真实工具filter非未来发明。

<details>
<summary>查看原文（26行）</summary>

```text
    // New activations no longer persist persona/toolFilter in host descriptors.
    // Install them before the first request, and restore the exact saved values
    // after a cold resume. Historical descriptors remain owned by Harness.
    const savedTeam = pending.has(key) ? undefined : readTeamSync(stateRoot, teamId)
    const savedMember = savedTeam?.captainSessionId === parentSessionId
      ? savedTeam.members.find(member => member.id === child.id && member.name === memberName)
      : undefined
    const setup = pendingSetup.get(key) ?? savedMember?.runtimeSetup
    if (usesManagedActivations(ctx.subagents) && savedMember !== undefined
      && setup === undefined && descriptor.toolFilter === undefined) {
      disposeAdmission()
      throw new Error('agent-teams: saved member runtime setup is missing; refusing an unrestricted resume')
    }
    let disposeSetup = (): void => undefined
    if (usesManagedActivations(ctx.subagents) && setup !== undefined) {
      try {
        const stopFilter = childCtx.tools.restrict(setup.toolFilter)
        try {
          const stopPersona = childCtx.systemPrompt.section({
            name: 'deployment:persona-prefix',
            order: childCtx.systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_PREFIX'),
            text: setup.persona,
          })
          disposeSetup = () => { stopPersona(); stopFilter() }
        } catch (error) { stopFilter(); throw error }
      } catch (error) { disposeAdmission(); throw error }
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:1974-1982](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L1974-L1982)

旧attempt只阻任务更新。

```text
        if (identity.kind === 'member') {
          if (task.assignee !== identity.name) {
            throw new Error(`task ${task.id} is assigned to "${task.assignee ?? 'nobody'}", not you`)
          }
          if (task.attemptId !== undefined && (args.attempt_id === undefined || args.attempt_id.trim() === '')) {
            throw new Error(`missing attempt_id for task ${task.id}. Retry this update with attempt_id="${task.attemptId}" from your current assignment. This is a missing parameter, not a revoked attempt; do not restart the work or request reassignment.`)
          }
          if (task.attemptId !== undefined && args.attempt_id !== task.attemptId) {
            throw new Error(`stale attempt for task ${task.id}: expected the current attempt_id; stop work and request fresh assignment`)
```

**依据 5 · 源码核查**：[src/quality-gates.ts:546-606](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/quality-gates.ts#L546-L606)

完成验收/声明范围的既有层。

<details>
<summary>查看原文（61行）</summary>

```text
export function evaluateQualityCompletion(
  task: TeamTask,
  update: QualityCompletionUpdate,
): QualityCompletionResult {
  const nextStatus = update.status
  if (nextStatus !== undefined && nextStatus !== task.status) {
    if (!STATUS_TRANSITIONS[task.status].includes(nextStatus)) {
      return { ok: false, error: `task status cannot move from "${task.status}" to "${nextStatus}"` }
    }
  }

  const kind = taskKindOf(task)
  if (kind === 'work') return { ok: true }

  const verdict = update.verdict ?? task.verdict
  const findings = update.findings ?? task.findings
  if (kind === 'review' || kind === 'requirements') {
    if (nextStatus === 'completed') {
      if (verdict === undefined) return { ok: false, error: `${kind} cannot complete without verdict=pass` }
      if (verdict !== 'pass') return { ok: false, error: `${kind} with verdict=${verdict} cannot complete` }
      if (openHighFindings(findings).length > 0) {
        return { ok: false, error: `${kind} pass cannot leave unresolved high/blocker findings` }
      }
    }
    if (nextStatus === 'failed' && (verdict === 'needs_revision' || verdict === 'reject')) {
      if ((findings ?? []).length < 1) {
        return { ok: false, error: `${kind} ${verdict} requires at least one finding` }
      }
    }
    return { ok: true }
  }

  if (kind === 'implementation' || kind === 'repair' || kind === 'verification' || kind === 'integration') {
    const commands = update.commandsRun ?? task.commandsRun
    if (commands?.some((item) => item.status === 'failed') === true) {
      if (nextStatus === 'completed') {
        return { ok: false, error: 'verify failure must fail the task', requiredStatus: 'failed' }
      }
    }
    if (nextStatus !== 'completed') return { ok: true }
    const acceptanceResults = update.acceptanceResults ?? task.acceptanceResults
    if (acceptanceResults === undefined || !acceptanceCovered(task.acceptance, acceptanceResults)) {
      return { ok: false, error: `${kind} completion requires passed acceptanceResults for every acceptance item` }
    }
    if (commands === undefined || !verifyCovered(task.verify, commands)) {
      return { ok: false, error: `${kind} completion requires a passed commandsRun entry for every verify command` }
    }
    if (kind === 'implementation' || kind === 'repair') {
      const changed = update.changedPaths ?? task.changedPaths
      if (changed === undefined) {
        return { ok: false, error: `${kind} completion requires changedPaths` }
      }
      for (const path of changed) {
        const classification = classifyChangedPath(path, task.inScope ?? [], task.outOfScope ?? [])
        if (classification !== 'in_scope') {
          return { ok: false, error: `${kind} cannot complete: ${path} is ${classification}` }
        }
      }
    }
  }
  return { ok: true }
```

</details>

**依据 6 · 源码核查**：[src/tools.ts:190-213](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/tools.ts#L190-L213)

实际review revision绑定贡献。

<details>
<summary>查看原文（24行）</summary>

```text
function bindClosingVerdict(workspace: string, team: TeamState, task: TeamTask): void {
  if (task.status !== 'completed') return
  const kind = taskKindOf(task)
  if (kind !== 'review' && kind !== 'requirements' && kind !== 'verification') return
  if ((kind === 'review' || kind === 'requirements') && task.verdict !== 'pass') return
  const scope = verdictScopePatterns(team, task)
  if (scope.length === 0) return
  const read = readArtifactScope(workspace, scope)
  const duringDrift = task.verdictStartSnapshot === undefined
    ? []
    : artifactDrift(task.verdictStartSnapshot.artifacts, read.artifacts)
  const bound = bindReviewToRevision(team, task, {
    artifacts: read.artifacts,
    gaps: read.gaps,
    scope,
    duringDrift,
  })
  task.reviewedTaskId = bound.reviewedTaskId
  task.reviewedAttempt = bound.reviewedAttempt
  task.reviewedArtifacts = bound.reviewedArtifacts
  task.reviewedGaps = bound.reviewedGaps
  task.reviewedScope = bound.reviewedScope
  task.reviewedDuringDrift = bound.reviewedDuringDrift
  task.verdictStartSnapshot = undefined
```

</details>

**依据 7 · 源码核查**：[src/quality-gates.ts:930-952](https://github.com/NanmiCoder/dsh-agent-teams/blob/369c2785c473e546124ab1709664058e6ea93948/src/quality-gates.ts#L930-L952)

已有失败分流/轮次升级。

<details>
<summary>查看原文（23行）</summary>

```text
export function planQualityFollowUp(
  team: TeamState,
  closed: TeamTask,
  options: PlanQualityFollowUpOptions = {},
): PlanQualityFollowUpResult {
  const empty = { created: [] as PlannedFollowUpTask[], tasks: [] as PlannedFollowUpTask[] }
  const escalate = (reason: string): PlanQualityFollowUpResult => ({ ...empty, escalated: true, status: 'escalated', reason })
  const kind = taskKindOf(closed)
  if (closed.status !== 'failed') return empty
  if (kind === 'review' || kind === 'requirements') {
    if (closed.verdict === 'reject') return escalate(`${closed.id} returned verdict=reject; automatic repair is not a substitute for a human decision`)
    if (closed.verdict !== 'needs_revision') return empty
  } else if (kind !== 'verification') {
    // Both quality gates share the findings → repair → re-check contract, so
    // a failed verification self-heals exactly like a failed review (#175B).
    return empty
  }

  const policy = resolveReviewPolicy(team.reviewPolicy)
  const currentRound = closed.round ?? 1
  const nextRound = currentRound + 1
  const maxRounds = kind === 'requirements' ? policy.requirementsMaxRounds : policy.codeMaxRounds
  if (nextRound > maxRounds) return escalate(`${closed.id} reached the ${kind} round ceiling (${maxRounds}); the loop cannot open round ${nextRound}`)
```

</details>

#### 缺口

- 写前attempt/真实路径能力门无原型，缺Host可拦契约和替代/误拒对照。
  **影响**：不能承诺阻实际越界或比隔离工作区更必要。
  **进一步探讨**：先固定Host能力与操作矩阵，比较当前方案/独立工作区与最小门，可靠性无增量或误拒负担更大即停止。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
