# Agent Team

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3dfc9c2](https://github.com/limuyang2/agent-team/tree/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c)

<!-- BEGIN META -->
[![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/limuyang2/agent-team) [![npm 30d 2,165](https://img.shields.io/static/v1?label=npm+30d&message=2%2C165&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@limuyang2/dsh-agent-team) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@limuyang2/dsh-agent-team)
<!-- END META -->

> **功能**：在DSH创建独立root Agent成员，共享工作区，通过Leader任务板与消息协作。

> **亮点**：[Q02](#research-q02)独立配置/owned会话到真实Host执行入口；[Q03](#research-q03)Leader/owner真实权限与任务/通知交接；[Q04](#research-q04)有范围的持久恢复/停止。

> **主要限制**：[Q03](#research-q03)completed不等验收、fileScopes仅文本/共workspace；[Q04](#research-q04)spliced去重非完整inbox幂等，跨表/Host非事务，Web外围认证/当前Host兼容未验。

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
  - [Q01 · 独立成员团队适合什么任务，相对原生子Agent的增量是什么？](#detail-section-11)
  - [Q02 · 创建团队到真实Agent输入与用户结果怎样接通？](#detail-section-12)
  - [Q03 · Leader/所有者责任和资源权限是真限制还是提示词？](#detail-section-13)
  - [Q04 · 持久消息、恢复、停止/解散与Web身份有什么边界？](#detail-section-14)
  - [Q05 · 怎样判断值得组队，下一步可证伪方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：@limuyang2/dsh-agent-team0.1.4是MIT的DSH原生host+Web插件；成员为独立root Agent会话、共用工作区，不是它自己实现新模型runtime或子Agent树。用户可为Leader/执行/复核角色选不同provider/model/preset/权限/Skills/MCP，并通过任务/消息显式协作。适合确有可拆分任务、能审合并产物和多模型费用的开发者；成功是任务负责人清楚、交接可核且产物通过独立验收。

原生子Agent、人工多会话/任务清单与已有模型/Skill/MCP资源，比较同任务产物和总成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| root成员 | 分开上下文/模型 | 共享workspace非OS隔离 |
| Leader/owner任务 | 分派/更新/回报 | completed非验收 |
| 资源选择 | MCP/Skill guard | Host工具权限另核 |
| Kv/outbox恢复 | 保状态/送消息 | pending inbox幂等未证 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| 匹配Node/DSH0.1.1-rc.2家族服务 | 必需 | Agent/storage/workspace/Web | 未验当前0.2.x兼容 |
| provider/models/credentials | 成员执行必需 | 真Host模型工具循环 | 费用由使用者承担 |
| 现有preset/Skill/MCP/权限 | 角色按需 | 配置/guard | 本包不安装资源，Host解释另核 |
| 私有Host/隔离工作区/人工验收 | 采用前提 | 控共享副作用 | 无OS隔离/文件锁保证 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 基线 | 人工拆任务/原生子Agent比较 | 明确owner/验收人 |
| 准备 | 核Host/私有入口/最小资源 | Leader+一成员 |
| 运行 | 给确定小任务/分文件 | 真session/消息/产物 |
| 验收 | 独立测diff/测试/费用 | 不凭completed |
| 退出 | 停分派/cancel/idle/flush/备份 | 文件/外部副作用另核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/模型/存储未知 | 角色/权限/版本配置 | 旧HostAPI边界 |
| 持续 | 各成员token/重复上下文未知 | Leader调度/合并/验收 | 小模型不必净省 |
| 故障 | 重复/冲突/恢复未知 | 查outbox/inbox/文件 | 进程队列非跨实例锁 |
| 退出 | 会话/库/文件留存未知 | 停任务/flush/清配置 | 解散非副作用撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 独立成员 | 真Host create/resume | 当前Host可用/任务质量 |
| 任务交接 | Leader/owner/通知限制 | 独立验收/低返工 |
| 资源配置 | MCP/Skill guard/权限set | 完整工具/OS隔离 |
| 恢复 | Kv/outbox/resume/stop | pending幂等/强杀/回滚 |

> **思考**：[Q03](#research-q03)completed不等验收、fileScopes仅文本/共workspace；[Q04](#research-q04)spliced去重非完整inbox幂等，跨表/Host非事务，Web外围认证/当前Host兼容未验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)独立配置/owned会话到真实Host执行入口；[Q03](#research-q03)Leader/owner真实权限与任务/通知交接；[Q04](#research-q04)有范围的持久恢复/停止。

[Q03](#research-q03)以真实Agent identity绑定team工具与任务责任有价值；[Q04](#research-q04)outbox交付/状态与Host inbox/独立验收必须分清。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)completed不等验收、fileScopes仅文本/共workspace；[Q04](#research-q04)spliced去重非完整inbox幂等，跨表/Host非事务，Web外围认证/当前Host兼容未验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)观察；先私有匹配Host/两成员/隔离分文件任务，对照人工签收，完成/消息未知先停新分派。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持真实root成员/任务交接；当前Host依赖/私有访问与产物验收、恢复仍需验证，观察。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/config.ts、src/index.ts、src/runtime/team-command-handler.ts、src/runtime/team-message-dispatcher.ts、src/runtime/team-messages.ts、src/runtime/team-runtime.ts、src/runtime/team-tools.ts、src/service/agent-team-service.ts、src/storage/store.ts、src/transport/web.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：新组件source；核root身份/Host装配、draft/start/Agent create-resume/followup/workbench、Leader/owner/task工具身份与MCP/Skill guard、Kv/outbox/重启/stop/解散及Web代表入口；未全审80文件、assistant builder/附件/全部workspace读写、Host实际loop/原子持久/认证/沙箱或强杀恢复。
- 下一步：只读固定源码，不运行Agent/Host/模型/工具/测试/浏览器；无任务质量、节钱/节时、隔离或恢复独立验证。

**分析版本**

- **仓库**：[limuyang2/agent-team](https://github.com/limuyang2/agent-team)
- **版本号**：0.1.4（[固定提交 3dfc9c2](https://github.com/limuyang2/agent-team/tree/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)在已有owner/outbox上分开完成与独立验收收据/成本责任，对比人工签收小修，不计当前贡献。

只读固定源码，不运行Agent/Host/模型/工具/测试/浏览器；无任务质量、节钱/节时、隔离或恢复独立验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1352 | — | — | 13212 |
| .mjs | source | 1 | 45 | 41 | 1 | — |
| .ts | source | 38 | 7058 | 6584 | 10 | — |
| .tsx | source | 10 | 4536 | 4375 | 3 | — |
| .ts | test | 20 | 2750 | 2493 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/limuyang2/agent-team/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/limuyang2/agent-team/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/limuyang2/agent-team/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核真实Agent创建/followup与角色任务责任，区分状态/消息交付、产物验收和跨系统恢复/权限。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 独立成员团队适合什么任务，相对原生子Agent的增量是什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

@limuyang2/dsh-agent-team0.1.4是MIT的DSH原生host+Web插件；成员为独立root Agent会话、共用工作区，不是它自己实现新模型runtime或子Agent树。用户可为Leader/执行/复核角色选不同provider/model/preset/权限/Skills/MCP，并通过任务/消息显式协作。适合确有可拆分任务、能审合并产物和多模型费用的开发者；成功是任务负责人清楚、交接可核且产物通过独立验收。

基线为宿主原生子Agent/多个会话和人工分工清单。README用常见继承型子Agent作比较并说明框架不同，不能据作者例子说全部原生子Agent不能独立配置或必省token。集中多会话/任务责任与接线是本插件贡献，Host Agent模型工具执行和已有Skill/MCP为继承能力；此包不管理Skill/MCP安装。包peer仍指DSH0.1.1-rc.2家族，Node^22.19或>=24；固定源码非当前0.2.x宿主兼容验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-14](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/package.json#L1-L14)

当前包身份/版本/MIT/入口。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "@limuyang2/dsh-agent-team",
  "version": "0.1.4",
  "description": "Multi-agent team management plugin for DeepSeek Harness",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/limuyang2/agent-team.git"
  },
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "type": "module",
  "main": "lib/index.js",
```

</details>

**依据 2 · 源码核查**：[package.json:40-53](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/package.json#L40-L53)

实际DSH bundle/client。

<details>
<summary>查看原文（14行）</summary>

```text
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-primitives"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "tsdown",
```

</details>

**依据 3 · 源码核查**：[package.json:62-80](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/package.json#L62-L80)

Node与Host peer条件。

<details>
<summary>查看原文（19行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-agent-presets": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-client-runtime": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-client-ui-layout": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-client-ui-sidebar": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-host-apiproxy": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-host-webserver": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-llm": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-permission-presets": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-session": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-session-persistence": "^0.1.1-rc.2",
```

</details>

**依据 4 · 作者声明**：[README.md:11-14](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/README.md#L11-L14)

作者独立root/共享工作区定位。

```text

Build teams of independent AI agents inside DeepSeek Harness. Mix models and providers, assign one Leader, and let every member work in its own conversation while sharing the same Workspace.

Agent Team does **not** turn members into subagents. Every member is an independent root agent with its own model, session, context, permissions, reasoning mode, and tool activity. Team tasks, messages, and the shared Workspace provide the collaboration layer.
```

**依据 5 · 作者声明**：[README.md:22-36](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/README.md#L22-L36)

作者对子Agent比较及框架限定。

<details>
<summary>查看原文（15行）</summary>

```text
A common parent/subagent workflow reuses or inherits much of the parent runtime configuration. That is convenient, but it can make every task carry the same expensive model, broad tool catalog, and growing context. A small commit-message task, for example, may still run through the same high-capability model used for architecture and implementation.

Agent Team lets every member have an explicit, focused configuration:

| Concern | Common parent/subagent setup | Agent Team |
| --- | --- | --- |
| Model | Often reuses the parent model or one shared model policy | Choose a different provider and model for every member |
| Skills and MCP | A broad catalog may be inherited or exposed everywhere | Give each role only the Skills and MCP Servers it needs |
| Context | Planning, execution, tool output, and results accumulate together | Every member has an isolated Session and context window |
| Cost | Simple work may still consume an expensive general model | Route routine work to smaller or specialized models |
| Permissions | One broad permission policy can spread across the workflow | Set least-privilege defaults and runtime permissions per member |

This separation keeps the Leader focused on planning and verification, keeps specialists focused on execution, reduces irrelevant tool choices, and prevents one agent's context from growing with every detail produced by the whole team. Members send tasks, progress, and results explicitly instead of sharing an ever-expanding conversation.

> Subagent behavior varies by framework. The comparison above describes the common parent-inherited pattern; Agent Team's advantage is that model, tools, permissions, and context isolation are explicit product-level choices for every member.
```

</details>

**依据 6 · 作者声明**：[README.md:85-85](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/README.md#L85-L85)

作者Skill/MCP只选择现有资源说明。

```text
> **Skills and MCP scope:** Agent Team uses Skills and MCP Servers exposed through the standard DeepSeek Harness interfaces. This plugin does not provide installation, updates, or lifecycle management for Skills or MCP Servers. Install the appropriate Harness plugins to manage those resources first; Agent Team only lets an assistant select and use the resources already available in the active Profile.
```

**依据 7 · 源码核查**：[src/index.ts:27-42](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/index.ts#L27-L42)

真实必要Host服务。

<details>
<summary>查看原文（16行）</summary>

```text
export const name = 'agent-team'
export const inject = [
  'agents',
  'agentPresets',
  'apiProxy',
  'llm',
  'permissionPresets',
  'sessionPersistence',
  'sessions',
  'skills',
  'storageDomain',
  'systemPrompt',
  'tools',
  'webServer',
  'workspaceRegistry',
]
```

</details>

#### 缺口

- 当前Host/发行/持续任务需求、相对原生多Agent收益与费用未验证。
  **影响**：不因独立会话或混模型便承诺隔离/节钱。
  **进一步探讨**：先人工拆一项小任务，对照原生子Agent/多会话，固定Host/模型版本和验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 创建团队到真实Agent输入与用户结果怎样接通？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

service创建draft时必须恰一Leader、登记workspace存在且ok，为每成员snapshot配置与生成独立sessionId。start写starting，核workspace实际path/status，ensureMembersOnline，恢复消息后标active；失败mark error，不靠页面卡片假装已运行。ensureMemberOnline遇同session已live但无本插件handle报ownership_conflict，避免夺用别的live Agent。

setup挂成员preset、模型选择和身份/roster提示，注册team工具及筛选资源/权限，然后实际ctx.agents.create或persisted resume，attachSession到同一workspace，保存owned handle。输入经sendUserMessage样式路径建user消息、持久record再handle.agent.followup；任务assignment由outbox dispatcher同样followup，结果由Host真实Agent执行/会话事件回到workbench。插件本身不重写Host采样/工具循环，当前Host内部是否按预期执行为外部依赖。

workbench取owned session.events或持久inspect，通过projection组织会话；API team.workbench.get调用service。delivered表示followup已返回/消息记录更新，不是Agent完成任务、模型质量或人验收；不能以task completed或UI streaming当通过测试。

#### 证据与依据

**依据 1 · 源码核查**：[src/service/agent-team-service.ts:440-469](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/service/agent-team-service.ts#L440-L469)

真实Leader/workspace校验与独立sessionId。

<details>
<summary>查看原文（30行）</summary>

```text
  async createTeamDraft(raw: CreateTeamDraftInput): Promise<TeamAggregate> {
    const input = createTeamDraftInputSchema.parse(raw)
    const leaders = input.members.filter(member => member.role === 'leader')
    if (leaders.length !== 1) {
      throw new AgentTeamError('TEAM_INVALID_LEADER', 'A team must contain exactly one leader')
    }
    const workspace = this.ctx.workspaceRegistry.get(WorkspaceId(input.workspaceId))
    if (workspace === undefined || await workspace.status() !== 'ok') {
      throw new AgentTeamError('WORKSPACE_UNAVAILABLE', `Workspace '${input.workspaceId}' is unavailable`)
    }

    const now = new Date().toISOString()
    const members: Record<string, TeamMemberSlot> = {}
    let leaderSlotId = ''
    for (const item of input.members) {
      const assistant = requireAssistant(this.store, item.assistantId)
      const slotId = randomUUID()
      members[slotId] = {
        id: slotId,
        assistantId: assistant.id,
        displayName: assistant.name,
        role: item.role,
        assistantSnapshot: snapshotAssistant(assistant),
        permissionPresetId: assistant.permissionPresetId,
        ...(assistant.reasoningEffort === undefined ? {} : { reasoningEffort: assistant.reasoningEffort }),
        sessionId: `agent-team:${randomUUID()}`,
        desiredState: 'offline',
        lastRuntimeState: 'offline',
        joinedAt: now,
      }
```

</details>

**依据 2 · 源码核查**：[src/runtime/team-runtime.ts:665-705](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L665-L705)

实际starting/ensure/recover/active及workspace核查。

<details>
<summary>查看原文（41行）</summary>

```text
  private async startTeamUnlocked(teamId: string): Promise<TeamAggregate> {
    const team = this.service.getTeam(teamId)
    if (team.state !== 'draft' && team.state !== 'error') {
      throw new AgentTeamError('TEAM_NOT_ACTIVE', `Cannot start team in state '${team.state}'`)
    }
    await this.service.updateRuntimeTeam(
      teamId,
      current => ({
        ...current,
        state: 'starting',
        members: mapMembers(current, member => ({
          ...member,
          desiredState: 'online',
          lastRuntimeState: this.owned.has(member.sessionId) ? member.lastRuntimeState : 'starting',
        })),
      }),
      'team.starting',
      `Team ${team.name} is starting`,
    )
    try {
      await this.ensureMembersOnline(this.service.getTeam(teamId))
      await this.messages.recover(this.service.getTeam(teamId))
      return await this.service.updateRuntimeTeam(
        teamId,
        current => ({ ...current, state: 'active' }),
        'team.started',
        `Team ${team.name} started`,
      )
    } catch (error) {
      await this.markTeamError(teamId, error)
      throw error
    }
  }

  private async ensureMembersOnline(team: TeamAggregate): Promise<void> {
    const workspace = this.ctx.workspaceRegistry.get(WorkspaceId(team.workspaceId))
    if (workspace === undefined || await workspace.status() !== 'ok' || workspace.path !== team.workspacePath) {
      throw new AgentTeamError('WORKSPACE_UNAVAILABLE', `Workspace '${team.workspaceId}' is unavailable or changed`)
    }
    const materialized = new Set((await this.ctx.sessionPersistence.list()).map(header => String(header.id)))
    await mapConcurrent(Object.values(team.members), this.config.runtimeConcurrency, async member => {
```

</details>

**依据 3 · 源码核查**：[src/runtime/team-runtime.ts:711-746](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L711-L746)

实际ownership冲突与setup。

<details>
<summary>查看原文（36行）</summary>

```text
  private async ensureMemberOnline(
    team: TeamAggregate,
    member: TeamMemberSlot,
    persisted: boolean,
  ): Promise<void> {
    const prior = this.owned.get(member.sessionId)
    if (prior !== undefined) return
    const sessionId = SessionId(member.sessionId)
    const live = this.ctx.agents.get(sessionId)
    if (live !== undefined) {
      await this.service.updateRuntimeTeam(
        team.id,
        current => ({ ...current, state: 'ownership_conflict' }),
        'team.ownership_conflict',
        `Session ${member.sessionId} is live but not owned by Agent Team`,
      )
      throw new AgentTeamError(
        'AGENT_HANDLE_OWNERSHIP_CONFLICT',
        `Session '${member.sessionId}' is live without this plugin's AgentHandle`,
      )
    }

    try {
      this.activating.set(member.sessionId, { teamId: team.id, slotId: member.id })
      const modelSelection: ModelSelectionRef = {
        current: {
          provider: member.assistantSnapshot.provider,
          model: member.assistantSnapshot.model,
          ...(member.reasoningEffort === undefined
            ? {}
            : { reasoningEffort: ReasoningEffortId(member.reasoningEffort) }),
        },
        assembled: undefined,
      }
      const setup = async (agentCtx: Context): Promise<void> => {
        await this.ctx.agentPresets.mount(agentCtx, member.assistantSnapshot.agentPresetId)
```

</details>

**依据 4 · 源码核查**：[src/runtime/team-runtime.ts:766-778](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L766-L778)

真实team工具绑定命令handlers。

<details>
<summary>查看原文（13行）</summary>

```text
        registerTeamTools(agentCtx, {
          assertIdentity: agent => { this.assertToolIdentity(agent, team.id, member.id) },
          getTaskBoard: () => {
            const latest = this.service.getTeam(team.id)
            const tasks = JSON.parse(JSON.stringify(Object.values(latest.tasks))) as Array<Record<string, string | number | string[]>>
            return { teamId: latest.id, revision: latest.revision, tasks }
          },
          createTask: input => this.commands.createTask(team.id, member.id, input),
          updateTask: input => this.commands.updateTask(team.id, member.id, input),
          sendMessage: (recipientSlotId, content, type) => (
            this.commands.sendMemberMessage(team.id, member.id, recipientSlotId, content, type)
          ),
        })
```

</details>

**依据 5 · 源码核查**：[src/runtime/team-runtime.ts:879-910](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L879-L910)

真实Agent create/resume/attach/owned handle。

<details>
<summary>查看原文（32行）</summary>

```text
      }
      const agentOptions = {
        provider: member.assistantSnapshot.provider,
        model: member.assistantSnapshot.model,
      }
      const handle = persisted
        ? await this.ctx.agents.resume({ resumeSessionId: sessionId, agentOptions, setup })
        : await this.ctx.agents.create({
          sessionId,
          meta: { cwd: team.workspacePath, agentPreset: member.assistantSnapshot.agentPresetId },
          agentOptions,
          setup,
        })
      const workspace = this.ctx.workspaceRegistry.get(WorkspaceId(team.workspaceId))
      if (workspace === undefined) {
        await handle.dispose()
        throw new AgentTeamError('WORKSPACE_UNAVAILABLE', 'Workspace disappeared during start')
      }
      try {
        await workspace.attachSession(sessionId)
      } catch (error) {
        await handle.dispose()
        throw error
      }
      this.owned.set(member.sessionId, {
        teamId: team.id,
        slotId: member.id,
        handle,
        modelSelection,
      })
      this.activating.delete(member.sessionId)
      await this.setMemberRuntimeState(team.id, member.id, handle.agent.status)
```

</details>

**依据 6 · 源码核查**：[src/runtime/team-runtime.ts:566-597](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L566-L597)

真实用户消息持久record→Agent followup。

<details>
<summary>查看原文（32行）</summary>

```text
    const slotId = targetSlotId ?? team.leaderSlotId
    const target = team.members[slotId]
    if (target === undefined) throw new AgentTeamError('MEMBER_NOT_FOUND', `Unknown member '${slotId}'`)
    if (slotId !== team.leaderSlotId && !team.directMemberChat) {
      throw new AgentTeamError('INVALID_REQUEST', 'Direct member chat is disabled for this team')
    }
    const content = requireContent(rawContent)
    const owned = this.requireOwned(target.sessionId)
    const message = createUserMessage({
      content: [{ type: 'text', text: content }],
      source: { kind: 'user' },
    })
    const record = teamMessage({
      id: String(message.id),
      teamId,
      sender: { kind: 'user', id: 'local-user' },
      recipient: slotId === team.leaderSlotId
        ? { kind: 'leader', slotId }
        : { kind: 'member', slotId },
      type: 'instruction',
      content,
      idempotencyKey: String(message.id),
    })
    await this.service.putRuntimeMessage(record)
    try {
      owned.handle.agent.followup(message)
      const delivered = { ...record, deliveryState: 'delivered' as const }
      await this.service.putRuntimeMessage(delivered)
      return delivered
    } catch (error) {
      await this.service.putRuntimeMessage({ ...record, deliveryState: 'failed' })
      throw error
```

</details>

**依据 7 · 源码核查**：[src/runtime/team-message-dispatcher.ts:37-72](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-message-dispatcher.ts#L37-L72)

真实outbox followup/消息记录/出箱。

<details>
<summary>查看原文（36行）</summary>

```text
  async deliver(teamId: string, messageId: string): Promise<boolean> {
    const current = this.service.getTeam(teamId)
    const record = current.outbox[messageId]
    if (record === undefined) return true
    const slotId = record.recipient.slotId
    const recipient = slotId === undefined ? undefined : current.members[slotId]
    if (recipient === undefined) {
      await this.service.putRuntimeMessage({ ...record, deliveryState: 'failed' })
      return false
    }
    try {
      // Re-write queued before every retry so the durable message table reflects
      // that the aggregate outbox still owns delivery.
      await this.service.putRuntimeMessage({ ...record, deliveryState: 'queued' })
      const agent = this.port.resolveAgent(recipient.sessionId)
      if (!sessionHasMessage(agent, record.id)) agent.followup(messageFromRecord(current, record))
      await this.service.putRuntimeMessage({ ...record, deliveryState: 'delivered' })
      await this.service.updateRuntimeTeam(
        teamId,
        team => {
          if (team.outbox[messageId] === undefined) return team
          const outbox = { ...team.outbox }
          delete outbox[messageId]
          return { ...team, outbox }
        },
        'team.message_delivered',
        `Team message ${messageId} delivered`,
      )
      return true
    } catch (error) {
      await this.service.putRuntimeMessage({ ...record, deliveryState: 'failed' })
      this.port.warn(`agent-team: queued message ${messageId} delivery failed`, error)
      return false
    }
  }
}
```

</details>

**依据 8 · 源码核查**：[src/runtime/team-runtime.ts:107-126](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L107-L126)

真实workbench读live/persisted事件。

<details>
<summary>查看原文（20行）</summary>

```text
  async getWorkbench(teamId: string): Promise<TeamWorkbenchView> {
    const team = this.service.getTeam(teamId)
    const conversations = await Promise.all(Object.values(team.members).map(async member => {
      const owned = this.owned.get(member.sessionId)
      let events = owned?.handle.agent.session.events
      if (events === undefined) {
        try {
          events = (await this.ctx.sessionPersistence.inspect(SessionId(member.sessionId))).events
        } catch {
          events = []
        }
      }
      return this.projectMemberConversation(team, member, events)
    }))
    return {
      schemaVersion: 1,
      teamId: team.id,
      revision: team.revision,
      conversations,
    }
```

</details>

**依据 9 · 源码核查**：[src/transport/web.ts:340-345](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/transport/web.ts#L340-L345)

真实workbench API转service。

```text
        targetSlotId: z.string().min(1).optional(),
      }).strict().parse(request.payload)
      return service.sendUserMessage(payload.teamId, payload.content, payload.targetSlotId)
    }
    case 'team.workbench.get': return service.getWorkbench(idPayload.parse(request.payload).id)
    case 'team.member.stop': {
```

#### 缺口

- Host采样/工具循环、模型与所有UI实时结果未运行/独立核外部实现。
  **影响**：源码支持真实Agent创建/入队接线，不证明自动任务可靠交付。
  **进一步探讨**：在固定兼容Host做两成员确定小任务，核session/事件/任务/产物与独立验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Leader/所有者责任和资源权限是真限制还是提示词？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

team_create_task/update_task execute先assertIdentity(exec.agent)，runtime根据owned或activating的Agent ID核team/slot，不信模型参数自报身份。handler仅当前Leader可create/reassign，owner或Leader可update，任务/assignment在同一team aggregate更新，通知放outbox再deliver；成员状态/结果可以回Leader。这是相对人工多个会话清单的具体责任/交接机制，不仅并排UI。

completed/failed/cancelled等由调用参数直接写任务状态/result/error；没有此处分支核diff/测试或强制Leader签收，task完成非独立产物验收。fileScopes只记字段并进assignment文本，所核链无文件锁/文件系统白名单；共享workspace仍可能并发覆盖。模型上下文分开不等进程/磁盘/账号隔离，Leader也不能因此免人审。

资源选择并非只隐藏schema：setup对未选MCP restrict deny且执行guard，未选Skill用provider overlay不可调用并对skill工具参数加guard；缺资源/加载器拒启动，permissionPresets.set作用session，再检查关键提示section存在。但preset普通工具、MCP名称识别及Host权限解释/沙箱仍依赖外部，不保证每成员最小权限或禁止所有绕路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime/team-tools.ts:73-76](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-tools.ts#L73-L76)

create实际先assertIdentity。

```text
    execute: async (args, exec) => {
      handlers.assertIdentity(exec.agent)
      return handlers.createTask(args)
    },
```

**依据 2 · 源码核查**：[src/runtime/team-tools.ts:107-109](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-tools.ts#L107-L109)

update实际先assertIdentity。

```text
    execute: async (args, exec) => {
      handlers.assertIdentity(exec.agent)
      return handlers.updateTask(args)
```

**依据 3 · 源码核查**：[src/runtime/team-runtime.ts:931-937](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L931-L937)

真实Agent ID→owned/activating身份匹配。

```text
  private assertToolIdentity(agent: Agent | undefined, teamId: string, slotId: string): void {
    if (agent === undefined) throw new AgentTeamError('INVALID_REQUEST', 'Team tool requires an Agent caller')
    const owned = this.owned.get(String(agent.id))
    const identity = owned ?? this.activating.get(String(agent.id))
    if (identity === undefined || identity.teamId !== teamId || identity.slotId !== slotId) {
      throw new AgentTeamError('INVALID_REQUEST', 'Team tool caller identity does not match its scoped member')
    }
```

**依据 4 · 源码核查**：[src/runtime/team-command-handler.ts:27-83](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-command-handler.ts#L27-L83)

真实Leader建任务/owner/aggregate outbox与派发。

<details>
<summary>查看原文（57行）</summary>

```text
  async createTask(
    teamId: string,
    creatorSlotId: string,
    input: { title: string; description?: string; ownerSlotId?: string; fileScopes?: string[] },
  ): Promise<{ taskId: string; status: string; deliveryState?: 'queued' | 'delivered' }> {
    const team = this.service.getTeam(teamId)
    if (team.leaderSlotId !== creatorSlotId) {
      throw new AgentTeamError('INVALID_REQUEST', 'Only the current team leader may create tasks')
    }
    if (input.ownerSlotId !== undefined && team.members[input.ownerSlotId] === undefined) {
      throw new AgentTeamError('MEMBER_NOT_FOUND', `Unknown task owner '${input.ownerSlotId}'`)
    }
    const title = requireShortText(input.title, 'Task title', 500)
    const now = new Date().toISOString()
    const taskId = randomUUID()
    const status = input.ownerSlotId === undefined ? 'pending' as const : 'assigned' as const
    const owner = input.ownerSlotId === undefined ? undefined : team.members[input.ownerSlotId]
    const assignment = owner === undefined || owner.id === creatorSlotId
      ? undefined
      : createTaskDispatchMessage({
        team,
        senderSlotId: creatorSlotId,
        recipientSlotId: owner.id,
        taskId,
        type: 'instruction',
        content: assignmentContent(title, input.description?.trim() ?? '', uniqueStrings(input.fileScopes ?? [])),
      })
    await this.service.updateRuntimeTeam(
      teamId,
      current => ({
        ...current,
        tasks: {
          ...current.tasks,
          [taskId]: {
            id: taskId,
            title,
            description: input.description?.trim() ?? '',
            status,
            ...(input.ownerSlotId === undefined ? {} : { ownerSlotId: input.ownerSlotId }),
            createdBySlotId: creatorSlotId,
            dependencyIds: [],
            fileScopes: uniqueStrings(input.fileScopes ?? []),
            revision: 1,
            createdAt: now,
            updatedAt: now,
          },
        },
        outbox: assignment === undefined
          ? current.outbox
          : { ...current.outbox, [assignment.id]: assignment },
      }),
      'team.task_created',
      `Task ${title} created`,
    )
    if (assignment === undefined) return { taskId, status }
    const delivered = await this.port.deliverMessage(teamId, assignment.id)
    return { taskId, status, deliveryState: delivered ? 'delivered' : 'queued' }
```

</details>

**依据 5 · 源码核查**：[src/runtime/team-command-handler.ts:98-164](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-command-handler.ts#L98-L164)

真实所有者/Leader权限/写状态结果/通知。

<details>
<summary>查看原文（67行）</summary>

```text
    const task = team.tasks[input.taskId]
    if (task === undefined) throw new AgentTeamError('INVALID_REQUEST', `Unknown task '${input.taskId}'`)
    if (callerSlotId !== team.leaderSlotId && task.ownerSlotId !== callerSlotId) {
      throw new AgentTeamError('INVALID_REQUEST', 'A member may update only its own task')
    }
    if (input.ownerSlotId !== undefined) {
      if (callerSlotId !== team.leaderSlotId) {
        throw new AgentTeamError('INVALID_REQUEST', 'Only the team leader may reassign tasks')
      }
      if (team.members[input.ownerSlotId] === undefined) {
        throw new AgentTeamError('MEMBER_NOT_FOUND', `Unknown task owner '${input.ownerSlotId}'`)
      }
    }
    const nextOwnerSlotId = input.ownerSlotId ?? task.ownerSlotId
    const ownerChanged = input.ownerSlotId !== undefined && input.ownerSlotId !== task.ownerSlotId
    const shouldDispatchAssignment = ownerChanged
      && nextOwnerSlotId !== undefined
      && nextOwnerSlotId !== callerSlotId
    const shouldNotifyLeader = callerSlotId !== team.leaderSlotId
    const notification = shouldDispatchAssignment
      ? createTaskDispatchMessage({
        team,
        senderSlotId: callerSlotId,
        recipientSlotId: nextOwnerSlotId!,
        taskId: task.id,
        type: 'instruction',
        content: reassignmentContent(task.title, input.result, input.error),
      })
      : shouldNotifyLeader
        ? createTaskDispatchMessage({
          team,
          senderSlotId: callerSlotId,
          recipientSlotId: team.leaderSlotId,
          taskId: task.id,
          type: taskMessageType(input.status),
          content: taskUpdateContent(task.title, input.status, input.result, input.error),
        })
        : undefined
    await this.service.updateRuntimeTeam(
      teamId,
      current => ({
        ...current,
        tasks: {
          ...current.tasks,
          [input.taskId]: {
            ...current.tasks[input.taskId]!,
            status: input.status,
            ...(input.result === undefined ? {} : { result: input.result }),
            ...(input.error === undefined ? {} : { error: input.error }),
            ...(input.ownerSlotId === undefined ? {} : { ownerSlotId: input.ownerSlotId }),
            revision: current.tasks[input.taskId]!.revision + 1,
            updatedAt: new Date().toISOString(),
          },
        },
        outbox: notification === undefined
          ? current.outbox
          : { ...current.outbox, [notification.id]: notification },
      }),
      'team.task_updated',
      `Task ${task.title} entered ${input.status}`,
    )
    if (notification === undefined) return { taskId: input.taskId, status: input.status }
    const delivered = await this.port.deliverMessage(teamId, notification.id)
    return {
      taskId: input.taskId,
      status: input.status,
      deliveryState: delivered ? 'delivered' : 'queued',
```

</details>

**依据 6 · 源码核查**：[src/runtime/team-messages.ts:70-76](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-messages.ts#L70-L76)

fileScopes实际仅assignment文本。

```text
export function assignmentContent(title: string, description: string, fileScopes: readonly string[]): string {
  return [
    `A team task has been assigned to you: ${title}`,
    description.length === 0 ? undefined : `Description: ${description}`,
    fileScopes.length === 0 ? undefined : `File scopes: ${fileScopes.join(', ')}`,
    'Read the task board for the task id, mark it running when you begin, and report progress or the final result with team_update_task.',
  ].filter((line): line is string => line !== undefined).join('\n')
```

**依据 7 · 源码核查**：[src/runtime/team-runtime.ts:796-827](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L796-L827)

真实MCP restrict/guard与缺Skill拒绝。

<details>
<summary>查看原文（32行）</summary>

```text
        const deniedMcpTools = mcpTools
          .filter(tool => !selectedMcpServers.has(tool.serverName))
          .map(tool => tool.name)
        if (deniedMcpTools.length > 0) agentCtx.tools.restrict({ deny: deniedMcpTools })
        agentCtx.tools.guard(execution => {
          const serverName = mcpServerFromToolName(execution.name)
          return serverName === undefined || selectedMcpServers.has(serverName)
            ? undefined
            : 'This MCP Server is not selected for the assistant.'
        })
        const selectedSkills = new Set(member.assistantSnapshot.skillAllowlist)
        const skills = await this.ctx.skills.list({
          cwd: team.workspacePath,
          scope: agent,
        })
        const available = new Set(skills
          .filter(skill => isModelInvocable(skill) || isUserInvocable(skill))
          .map(skill => skill.name))
        const missing = [...selectedSkills].filter(name => !available.has(name))
        if (missing.length > 0) {
          throw new AgentTeamError(
            'SKILL_REFERENCE_INVALID',
            `Member '${member.displayName}' cannot access selected Skill(s): ${missing.join(', ')}`,
            { memberId: member.id, missing },
          )
        }
        if (selectedSkills.size > 0 && agentCtx.tools.get('skill', agent) === undefined) {
          throw new AgentTeamError(
            'SKILL_REFERENCE_INVALID',
            `Member '${member.displayName}' selected Skills, but its Agent Preset does not expose the skill loader`,
            { memberId: member.id },
          )
```

</details>

**依据 8 · 源码核查**：[src/runtime/team-runtime.ts:832-870](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L832-L870)

真实未选Skill overlay/执行guard/权限preset set。

<details>
<summary>查看原文（39行）</summary>

```text
        const skillSelectionProvider = `agent-team-selection-${member.id}`
        await registerScopedSkillProvider(agentCtx, () => ({
          name: skillSelectionProvider,
          list: async options => {
            const inherited = await this.ctx.skills.list({
              cwd: options.cwd,
              signal: options.signal,
              scope: presetScope,
            })
            return inherited.filter(skill => !selectedSkills.has(skill.name)).map(skill => ({
              name: skill.name,
              description: skill.description,
              invocation: { modelInvocable: false, userInvocable: false },
              source: 'runtime',
              provider: skillSelectionProvider,
              rank: 0,
              locator: skill.name,
            }))
          },
          get: async candidate => ({
            name: candidate.name,
            description: candidate.description,
            invocation: { modelInvocable: false, userInvocable: false },
            source: 'runtime',
            provider: skillSelectionProvider,
            content: '',
          }),
        }))
        agentCtx.tools.guard(execution => {
          if (execution.name !== 'skill') return undefined
          const name = skillNameFromArguments(execution.arguments)
          return name !== undefined && selectedSkills.has(name)
            ? undefined
            : 'This Skill is not selected for the assistant.'
        })
        this.ctx.permissionPresets.set(
          agent.session,
          member.permissionPresetId,
        )
```

</details>

**依据 9 · 源码核查**：[src/runtime/team-runtime.ts:871-877](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L871-L877)

真实提示section存在校验。

```text
        const assembly = await agentCtx.systemPrompt.assemble(assembleContextFor(agent))
        const names = new Set(assembly.sections.map(section => section.name))
        if (!names.has(identitySection) || !names.has(rosterSection)) {
          throw new AgentTeamError(
            'PRESET_PROMPT_INCOMPATIBLE',
            `Preset '${member.assistantSnapshot.agentPresetId}' replaced Agent Team prompt sections`,
          )
```

#### 缺口

- 全部Host工具/沙箱/名称识别、并发文件冲突与独立质量验收未全审/未测。
  **影响**：不把fileScopes当OS权限或completed当Leader验收，产品采用仍需人工合并。
  **进一步探讨**：最小权限/分文件任务，尝试未选资源/伪造slot/完成无产物和并发同文件，对照Host事件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 持久消息、恢复、停止/解散与Web身份有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

DomainAgentTeamStore真实将teams/messages等写宿主KvTable put/update；runtime队列exclusive是进程Map串行，不是持久互斥或跨实例锁。任务/outbox在team里同写，消息表/活动/Host followup另写：updateRuntimeTeam先store.update后activity/publish，后者失败不自动撤已存team，跨表与Host不是统一事务。

dispatcher每次retry先写queued，再sessionHasMessage查session.events的agent/inbox/spliced插入ID后followup，写delivered再删outbox。启动recover active/starting/error队伍、resume Agent并恢复outbox/queued；当前去重只查已spliced事件，不可据此保证尚在Host inbox但未spliced时绝无重复，Hostfollowup持久/幂等完整语义未独立核。delivered记录不是物理任务完成。

stopMember真Agent.cancel然后等idle，正常dispose取消keepInbox:true、等idle、flush warn并dispose；解散keepInbox:false，等待idle、flush失败warn继续、detachSession与删除team记录，失败可置delete_blocked。它有停止/退出接线，不撤共享workspace文件/外部副作用，flush警告不等持久成功，取消等待可能不覆盖外部工具物理退出。

Web由ctx.webServer直接注册API/SSE/upload；API核method/Origin/JSON/大小/schema后dispatch，sameOrigin在无Origin时放行且仅比较host，没有在本handler识别登录用户/owner。Host webServer外围认证是否覆盖需另核，不能把Origin当认证或承诺共享多租户安全，也不能据此断言部署已公开越权。采用限私有Host，当前版本兼容与外围认证不清先观察。

#### 证据与依据

**依据 1 · 源码核查**：[src/storage/store.ts:78-106](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/storage/store.ts#L78-L106)

真实Host KvTable团队/消息读写。

<details>
<summary>查看原文（29行）</summary>

```text
  getTeam(id: string): TeamAggregate | undefined {
    return this.teams.get(id)
  }

  listTeams(): TeamAggregate[] {
    return values(this.teams)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt) || left.id.localeCompare(right.id))
  }

  putTeam(value: TeamAggregate): Promise<void> {
    return this.teams.put(value.id, value)
  }

  updateTeam(id: string, update: (current: TeamAggregate) => TeamAggregate): Promise<TeamAggregate> {
    return this.teams.update(id, update)
  }

  deleteTeam(id: string): Promise<boolean> {
    return this.teams.delete(id)
  }

  listMessages(teamId: string): TeamMessage[] {
    return values(this.messages)
      .filter(message => message.teamId === teamId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id))
  }

  putMessage(value: TeamMessage): Promise<void> {
    return this.messages.put(value.id, value)
```

</details>

**依据 2 · 源码核查**：[src/service/agent-team-service.ts:811-833](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/service/agent-team-service.ts#L811-L833)

先team更新再activity/publish，消息另写。

<details>
<summary>查看原文（23行）</summary>

```text
  async updateRuntimeTeam(
    teamId: string,
    update: (team: TeamAggregate) => TeamAggregate,
    kind: string,
    summary: string,
  ): Promise<TeamAggregate> {
    const next = await this.store.updateTeam(teamId, current => {
      const candidate = update(current)
      return {
        ...candidate,
        revision: current.revision + 1,
        updatedAt: new Date().toISOString(),
      }
    })
    await this.activity(kind, teamId, next.revision, summary)
    this.publish('team', teamId, next.revision, kind)
    return next
  }

  async putRuntimeMessage(message: TeamMessage): Promise<void> {
    await this.store.putMessage(message)
    const team = requireTeam(this.store, message.teamId)
    this.publish('team', team.id, team.revision, 'team.message')
```

</details>

**依据 3 · 源码核查**：[src/runtime/team-runtime.ts:979-987](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L979-L987)

真实进程内exclusive Promise Map。

```text
  private exclusive<T>(teamId: string, operation: () => Promise<T>): Promise<T> {
    if (this.closing) return Promise.reject(new Error('Agent Team runtime is closing'))
    const prior = this.operations.get(teamId) ?? Promise.resolve()
    const current = prior.catch(() => undefined).then(operation)
    this.operations.set(teamId, current)
    void current.finally(() => {
      if (this.operations.get(teamId) === current) this.operations.delete(teamId)
    }).catch(() => undefined)
    return current
```

**依据 4 · 源码核查**：[src/runtime/team-message-dispatcher.ts:17-72](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-message-dispatcher.ts#L17-L72)

真实恢复/去重/queued-followup-delivered-outbox失败链。

<details>
<summary>查看原文（56行）</summary>

```text
  async recover(team: TeamAggregate): Promise<void> {
    for (const messageId of Object.keys(team.outbox)) {
      await this.deliver(team.id, messageId)
    }
    team = this.service.getTeam(team.id)
    const pending = this.service.listMessages(team.id).items.filter(message => message.deliveryState === 'queued')
    for (const record of pending) {
      const slotId = record.recipient.slotId
      if (slotId === undefined) continue
      const recipient = team.members[slotId]
      if (recipient === undefined) {
        await this.service.putRuntimeMessage({ ...record, deliveryState: 'failed' })
        continue
      }
      const agent = this.port.resolveAgent(recipient.sessionId)
      if (!sessionHasMessage(agent, record.id)) agent.followup(messageFromRecord(team, record))
      await this.service.putRuntimeMessage({ ...record, deliveryState: 'delivered' })
    }
  }

  async deliver(teamId: string, messageId: string): Promise<boolean> {
    const current = this.service.getTeam(teamId)
    const record = current.outbox[messageId]
    if (record === undefined) return true
    const slotId = record.recipient.slotId
    const recipient = slotId === undefined ? undefined : current.members[slotId]
    if (recipient === undefined) {
      await this.service.putRuntimeMessage({ ...record, deliveryState: 'failed' })
      return false
    }
    try {
      // Re-write queued before every retry so the durable message table reflects
      // that the aggregate outbox still owns delivery.
      await this.service.putRuntimeMessage({ ...record, deliveryState: 'queued' })
      const agent = this.port.resolveAgent(recipient.sessionId)
      if (!sessionHasMessage(agent, record.id)) agent.followup(messageFromRecord(current, record))
      await this.service.putRuntimeMessage({ ...record, deliveryState: 'delivered' })
      await this.service.updateRuntimeTeam(
        teamId,
        team => {
          if (team.outbox[messageId] === undefined) return team
          const outbox = { ...team.outbox }
          delete outbox[messageId]
          return { ...team, outbox }
        },
        'team.message_delivered',
        `Team message ${messageId} delivered`,
      )
      return true
    } catch (error) {
      await this.service.putRuntimeMessage({ ...record, deliveryState: 'failed' })
      this.port.warn(`agent-team: queued message ${messageId} delivery failed`, error)
      return false
    }
  }
}
```

</details>

**依据 5 · 源码核查**：[src/runtime/team-messages.ts:140-144](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-messages.ts#L140-L144)

去重实际仅查spliced事件。

```text
export function sessionHasMessage(agent: Agent, messageId: string): boolean {
  return agent.session.events.some(event => {
    if (event.type !== 'agent/inbox/spliced') return false
    return event.data.inserted.some(message => String(message.id) === messageId)
  })
```

**依据 6 · 源码核查**：[src/runtime/team-runtime.ts:601-621](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L601-L621)

实际恢复选队伍/ensure/recover/error。

<details>
<summary>查看原文（21行）</summary>

```text
  async recoverTeams(): Promise<void> {
    const recoverable = this.service.listTeams().items.filter(team =>
      team.state === 'active'
      || team.state === 'starting'
      || team.state === 'error')
    await mapConcurrent(recoverable, this.config.runtimeConcurrency, async team => {
      try {
        await this.exclusive(team.id, async () => {
          await this.ensureMembersOnline(team)
      await this.messages.recover(this.service.getTeam(team.id))
          await this.service.updateRuntimeTeam(
            team.id,
            current => ({ ...current, state: 'active' }),
            'team.recovered',
            `Team ${team.name} recovered after plugin startup`,
          )
        })
      } catch (error) {
        this.ctx.logger.warn(`agent-team: failed to recover team ${team.id}`, error)
        await this.markTeamError(team.id, error)
      }
```

</details>

**依据 7 · 源码核查**：[src/runtime/team-runtime.ts:129-145](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L129-L145)

真实stopMember cancel与等待。

<details>
<summary>查看原文（17行）</summary>

```text
  async stopMember(teamId: string, slotId: string): Promise<void> {
    const team = this.service.getTeam(teamId)
    if (team.state !== 'active') throw new AgentTeamError('TEAM_NOT_ACTIVE', `Team '${team.name}' is not active`)
    const member = team.members[slotId]
    if (member === undefined) throw new AgentTeamError('MEMBER_NOT_FOUND', `Unknown member '${slotId}'`)
    const owned = this.requireOwned(member.sessionId)
    owned.handle.agent.cancel({ kind: 'user' })
    await owned.handle.agent.whenIdle()
    await this.setMemberRuntimeState(teamId, slotId, 'idle')
    const current = this.service.getTeam(teamId)
    const currentMember = current.members[slotId]
    if (currentMember !== undefined) {
      this.service.publishConversation(
        teamId,
        current.revision,
        this.projectMemberConversation(current, currentMember, owned.handle.agent.session.events),
      )
```

</details>

**依据 8 · 源码核查**：[src/runtime/team-runtime.ts:625-645](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L625-L645)

真实keepInbox/flush/正常dispose。

<details>
<summary>查看原文（21行）</summary>

```text
  async dispose(): Promise<void> {
    if (this.closing) return
    this.closing = true
    this.disposeStatusListener()
    this.disposeConversationListener()
    await this.interactions.dispose()
    for (const timer of this.conversationPublishes.values()) clearTimeout(timer)
    this.conversationPublishes.clear()
    await Promise.allSettled([...this.operations.values()])
    const owned = [...this.owned.values()]
    for (const entry of owned) entry.handle.agent.cancel({ kind: 'disposed' }, { keepInbox: true })
    await Promise.allSettled(owned.map(entry => entry.handle.agent.whenIdle()))
    for (const entry of owned) {
      try {
        await this.ctx.sessions.flush(entry.handle.agent.session)
      } catch (error) {
        this.ctx.logger.warn(`agent-team: session flush failed for ${entry.handle.agent.id}`, error)
      }
    }
    await Promise.allSettled(owned.map(entry => entry.handle.dispose()))
    this.owned.clear()
```

</details>

**依据 9 · 源码核查**：[src/runtime/team-runtime.ts:478-516](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L478-L516)

真实解散所有权/删除状态/cancel/flush处置。

<details>
<summary>查看原文（39行）</summary>

```text
  dissolveTeam(teamId: string): Promise<void> {
    return this.exclusive(teamId, async () => {
      let team = this.service.getTeam(teamId)
      const members = Object.values(team.members)
      for (const member of members) {
        const sessionId = SessionId(member.sessionId)
        if (this.owned.get(member.sessionId) === undefined && this.ctx.agents.get(sessionId) !== undefined) {
          throw new AgentTeamError(
            'AGENT_HANDLE_OWNERSHIP_CONFLICT',
            `Session '${member.sessionId}' is live without this plugin's AgentHandle`,
          )
        }
      }

      if (team.state !== 'deleting') {
        team = await this.service.updateRuntimeTeam(
          teamId,
          current => ({ ...current, state: 'deleting' }),
          'team.deleting',
          `Team ${team.name} dissolution started`,
        )
      }

      try {
        const owned = members
          .map(member => ({ member, owned: this.owned.get(member.sessionId) }))
          .filter((entry): entry is { member: TeamMemberSlot; owned: OwnedAgent } => entry.owned !== undefined)
        for (const entry of owned) {
          entry.owned.handle.agent.cancel({ kind: 'user' }, { keepInbox: false })
        }
        await Promise.all(owned.map(entry => entry.owned.handle.agent.whenIdle()))

        for (const entry of owned) {
          try {
            await this.ctx.sessions.flush(entry.owned.handle.agent.session)
          } catch (error) {
            this.ctx.logger.warn(`agent-team: final session flush failed during dissolution for ${entry.member.sessionId}`, error)
          }
          await entry.owned.handle.dispose()
```

</details>

**依据 10 · 源码核查**：[src/runtime/team-runtime.ts:523-550](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L523-L550)

真实detach/delete与delete_blocked。

<details>
<summary>查看原文（28行）</summary>

```text
          const sessionIds = new Set([
            ...members.map(member => member.sessionId),
            ...Object.keys(team.retiredSessions),
          ])
          for (const sessionId of sessionIds) {
            await workspace.detachSession(SessionId(sessionId))
          }
        }

        await this.service.deleteTeamRecords(teamId)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        try {
          await this.service.updateRuntimeTeam(
            teamId,
            current => ({ ...current, state: 'delete_blocked' }),
            'team.delete_blocked',
            message,
          )
        } catch (updateError) {
          this.ctx.logger.warn(`agent-team: failed to persist blocked dissolution for ${teamId}`, updateError)
        }
        throw error instanceof AgentTeamError
          ? error
          : new AgentTeamError(
            'TEAM_DELETE_FAILED',
            `团队“${team.name}”解散失败：${message}`,
            { teamId, cause: message },
```

</details>

**依据 11 · 源码核查**：[src/transport/web.ts:57-77](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/transport/web.ts#L57-L77)

实际Web API/SSE/upload直接注册。

<details>
<summary>查看原文（21行）</summary>

```text
  const disposeApi = ctx.webServer.register({
    kind: 'exact',
    path: AGENT_TEAM_API_PATH,
    handler: async (request, response) => {
      await handleApi(request, response, config, service, ctx)
    },
  })
  const disposeEvents = ctx.webServer.register({
    kind: 'exact',
    path: AGENT_TEAM_EVENTS_PATH,
    handler: (request, response) => {
      handleEvents(request, response, clients)
    },
  })
  const disposeUpload = ctx.webServer.register({
    kind: 'exact',
    path: AGENT_TEAM_UPLOAD_PATH,
    handler: async (request, response) => {
      await handleUpload(request, response, service, ctx)
    },
  })
```

</details>

**依据 12 · 源码核查**：[src/transport/web.ts:131-164](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/transport/web.ts#L131-L164)

真实method/Origin/body/schema到dispatch。

<details>
<summary>查看原文（34行）</summary>

```text
async function handleApi(
  request: IncomingMessage,
  response: ServerResponse,
  config: Config,
  service: AgentTeamService,
  ctx: Context,
): Promise<void> {
  if (request.method !== 'POST') {
    writeJson(response, 405, failure('unknown', 'METHOD_NOT_ALLOWED', 'Only POST is supported'))
    return
  }
  if (!sameOrigin(request)) {
    writeJson(response, 403, failure('unknown', 'ORIGIN_REJECTED', 'Cross-origin requests are not allowed'))
    return
  }
  const contentType = request.headers['content-type'] ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) {
    writeJson(response, 415, failure('unknown', 'UNSUPPORTED_MEDIA_TYPE', 'Content-Type must be application/json'))
    return
  }

  let parsed: AgentTeamRequest
  try {
    const body = await readJson(request, config.maxRequestBytes)
    parsed = requestSchema.parse(body) as AgentTeamRequest
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request'
    writeJson(response, 400, failure('unknown', 'INVALID_REQUEST', message))
    return
  }

  try {
    const value = await dispatch(service, parsed)
    writeJson(response, 200, { requestId: parsed.requestId, ok: true, value })
```

</details>

**依据 13 · 源码核查**：[src/transport/web.ts:472-481](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/transport/web.ts#L472-L481)

实际无Origin放行/host比较。

<details>
<summary>查看原文（10行）</summary>

```text
function sameOrigin(request: IncomingMessage): boolean {
  const origin = request.headers.origin
  if (origin === undefined) return true
  const host = request.headers.host
  if (host === undefined) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
```

</details>

#### 缺口

- Host Kv持久/原子语义、pending inbox幂等/强杀恢复、外围认证和完整取消未知。
  **影响**：不能当exactly-once、跨实例协调、OS隔离或外部回滚保证，不推荐共享部署。
  **进一步探讨**：私有隔离Host注入queued/Host已收未spliced/活动写失败/flush失败/解散，查表/会话/文件后再决定重试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判断值得组队，下一步可证伪方向是什么？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

目前建议观察；需要独立配置角色且可拆分文件/验收的人，先核兼容Host/私有访问，用Leader+一成员在可丢弃workspace做明确小任务，不从多模型菜单直接开大团队。选最小权限/已有已审Skill/MCP，明确谁执行、谁独立验证，比较原生子Agent/人工两会话；文件冲突、completed无产物或消息去向未知就停新分派、回单Agent/人工任务清单核结果。

首次模型/权限/资源/preset/Host配置，持续各Agent token/重复上下文/任务通知/存储及Leader调度/合并/验证人时，失败重试与冲突修复、退出留存/共享文件和外部操作成本未知，不填0。runtimeConcurrency默认4是激活/恢复并发参数，不能当整个任务/费用硬上限；更小模型可能降单价也可能增返工，不计经济创新。卸载/解散不会证明撤回已写workspace与远端操作，先核在途/flush/备份。

独立假设：在现有任务owner/outbox上增加独立验收收据/成本与冲突责任，使completed与已验证产物分开，可能比只增成员/混模型减少返工。先比较人工Leader签收清单/现有插件小修，无必要不造新团队引擎。固定完成无文件、重复inbox、同文件冲突、权限拒绝与小模型返工样本，测合格率、错误交接/重复执行、合并人时和总成本；若清单足够或管理负担超收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime/team-command-handler.ts:136-164](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-command-handler.ts#L136-L164)

既有状态/结果与通知非验收。

<details>
<summary>查看原文（29行）</summary>

```text
    await this.service.updateRuntimeTeam(
      teamId,
      current => ({
        ...current,
        tasks: {
          ...current.tasks,
          [input.taskId]: {
            ...current.tasks[input.taskId]!,
            status: input.status,
            ...(input.result === undefined ? {} : { result: input.result }),
            ...(input.error === undefined ? {} : { error: input.error }),
            ...(input.ownerSlotId === undefined ? {} : { ownerSlotId: input.ownerSlotId }),
            revision: current.tasks[input.taskId]!.revision + 1,
            updatedAt: new Date().toISOString(),
          },
        },
        outbox: notification === undefined
          ? current.outbox
          : { ...current.outbox, [notification.id]: notification },
      }),
      'team.task_updated',
      `Task ${task.title} entered ${input.status}`,
    )
    if (notification === undefined) return { taskId: input.taskId, status: input.status }
    const delivered = await this.port.deliverMessage(teamId, notification.id)
    return {
      taskId: input.taskId,
      status: input.status,
      deliveryState: delivered ? 'delivered' : 'queued',
```

</details>

**依据 2 · 源码核查**：[src/config.ts:14-18](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/config.ts#L14-L18)

默认并发/直接成员聊天配置。

```text
export const Config: Schema<Config> = Schema.object({
  maxRequestBytes: Schema.number().min(1024).max(1024 * 1024).default(128 * 1024),
  sseHeartbeatMs: Schema.number().min(5_000).max(120_000).default(20_000),
  runtimeConcurrency: Schema.number().min(1).max(32).default(4),
  directMemberChatDefault: Schema.boolean().default(true),
```

**依据 3 · 源码核查**：[src/runtime/team-runtime.ts:867-870](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L867-L870)

真实成员权限设置依赖Host。

```text
        this.ctx.permissionPresets.set(
          agent.session,
          member.permissionPresetId,
        )
```

**依据 4 · 源码核查**：[src/runtime/team-runtime.ts:625-645](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-runtime.ts#L625-L645)

退出flush/keepInbox边界。

<details>
<summary>查看原文（21行）</summary>

```text
  async dispose(): Promise<void> {
    if (this.closing) return
    this.closing = true
    this.disposeStatusListener()
    this.disposeConversationListener()
    await this.interactions.dispose()
    for (const timer of this.conversationPublishes.values()) clearTimeout(timer)
    this.conversationPublishes.clear()
    await Promise.allSettled([...this.operations.values()])
    const owned = [...this.owned.values()]
    for (const entry of owned) entry.handle.agent.cancel({ kind: 'disposed' }, { keepInbox: true })
    await Promise.allSettled(owned.map(entry => entry.handle.agent.whenIdle()))
    for (const entry of owned) {
      try {
        await this.ctx.sessions.flush(entry.handle.agent.session)
      } catch (error) {
        this.ctx.logger.warn(`agent-team: session flush failed for ${entry.handle.agent.id}`, error)
      }
    }
    await Promise.allSettled(owned.map(entry => entry.handle.dispose()))
    this.owned.clear()
```

</details>

**依据 5 · 源码核查**：[src/runtime/team-messages.ts:70-76](https://github.com/limuyang2/agent-team/blob/3dfc9c29ea3610e2bf9494aaff6b41bae120de9c/src/runtime/team-messages.ts#L70-L76)

文件范围为分派说明。

```text
export function assignmentContent(title: string, description: string, fileScopes: readonly string[]): string {
  return [
    `A team task has been assigned to you: ${title}`,
    description.length === 0 ? undefined : `Description: ${description}`,
    fileScopes.length === 0 ? undefined : `File scopes: ${fileScopes.join(', ')}`,
    'Read the task board for the task id, mark it running when you begin, and report progress or the final result with team_update_task.',
  ].filter((line): line is string => line !== undefined).join('\n')
```

#### 缺口

- 需求/合格率/净收益、费用/人工、完整强杀与退出恢复未验证；验收收据增量也未测。
  **影响**：不以混模型/团队状态推出生产节时节费，方向不计已有能力。
  **进一步探讨**：相同小任务比原生/人工组，记录所有token/返工/人验/冲突恢复，满足净收益再扩。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
