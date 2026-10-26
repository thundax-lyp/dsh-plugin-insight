# @y9931666/dsh-plugin-roundtable

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e2cb127](https://github.com/9931666/dsh-plugin-roundtable/tree/e2cb127bc0c2654a92cf2db64256c982c78b90e4)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-roundtable) [![npm 30d 1,464](https://img.shields.io/static/v1?label=npm+30d&message=1%2C464&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable) [![最新发布 2026-10-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable)
<!-- END META -->

> **实现功能**：把Harness会话组织成持久专家圆桌，提供拓扑、发言汇聚、人工决策和红队评审。

> **核心亮点**：将专家持久身份、发言留档与即时唤醒分开，并把红队观点、人类表态与修订轮次结构化；贡献是协作责任与可检查记录，不是独立证据或多模型必然更准。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：预算门按发言字符估算，真实usage仅状态派生且冷节点不可测；网关按发言顺序拼接后整体截前4000字符，后续观点可能消失。角色讨论和支持表态不能替代缺陷复现，图上的边也不能自动等同严格执行流程。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要多角色圆桌协作，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · 角色调度、会话状态与结论交付如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使多角色圆桌协作的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从角色调度、会话状态与结论交付的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用多角色圆桌协作，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为需要多个观点、人工拍板和可留档评审的方案维护者，把主持会话组织成持久专家讨论；合格交付是观点、证据与决策可追踪，不是专家人数或拓扑图本身。

单Agent审稿和手动多会话提供低复杂度对照；只有同预算质量提升才支持多专家额外负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| roundtable_plan_meeting | 草案确认 | 依赖用户问答；缺失不等于批准 |
| roundtable_create | 建会及固定设置 | 确认草案及工作区状态 |
| roundtable_add_node | 创建持久专家 | 可用模型、角色与宿主子代理 |
| roundtable_remove_node | 移除专家 | 需核子代理清理 |
| roundtable_connect | 设置拓扑连线 | 图语义依协作模式 |
| roundtable_disconnect | 删除连线 | 不把图当严格工作流 |
| roundtable_speak | 持久报告发言 | 不唤醒接收者 |
| roundtable_send_message | 请求对方立即行动 | 模式权限，可能dropped |
| roundtable_summarize | 拉取确定性汇聚 | 字符截断，非证据审定 |
| roundtable_request_decision | 用户拍板 | 问答服务及人工决定 |
| roundtable_status | 查状态和用量 | 真实usage仅live可测部分 |
| roundtable_kb_digest | 记录KB要点缓存 | path/size/mtime非内容真实性 |
| roundtable_actions_clear | 清用户动作队列 | 坏行计数需如实处理 |
| roundtable_start_review | 开启红队轮次 | 超过三轮需显式用户批准 |
| roundtable_collect_review | 收集拆分观点 | LLM/本地兜底，需核原文 |
| roundtable_finish_review | 结束并记修订 | 不自动证明缺陷修复 |
| roundtable_export_review | 导出评审链 | 含观点和用户表态 |
| roundtable_export_meeting | 导出整场记录 | 进行中为快照，写本地export.md |
| roundtable_set_budget | 补充/收紧预算 | 发言量估算非真实费用 |
| roundtable_close | 结束会议 | 需核节点处置 |
| roundtable_proxy_think | 为黑盒工作模型准备导演参数 | 额外模型思考非工作模型真实内部过程 |
| 圆桌Tab/设置页 | 拓扑与角色/阵容管理 | 自建角色，无斜杠命令 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容Harness子代理/工具/会话API | 必需 | 持久专家与执行 | 宿主契约漂移可导致入口或节点失效 |
| 专家模型和可用路由 | 必需 | 实际讨论/红队 | 新增调用、模型差异与费用 |
| 工作区.roundtable及全局偏好可写 | 必需 | 会议和审阅状态 | 进程内锁不覆盖多个Host进程 |
| userQuestions/skills/Web界面 | 可选或对应流程需要 | 确认、技能及可视交互 | 缺服务降级，不能伪称用户已确认 |
| 观点拆分固定LLM路由 | 优先分支 | 将发言拆观点 | 默认deepseek-official不可用需本地兜底 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 主持人plan草案，用户确认角色/模式/预算 | 确认后create，不把不可用当批准 |
| 2 | 加节点、派发和收集持久发言 | speak不唤醒，send_message才请求行动 |
| 3 | 主持汇聚并核完整原文/证据 | 网关截断不等于全部观点 |
| 4 | 用户对评审观点表态，主持修订/结束 | 支持是用户判断不是缺陷自动实证 |
| 5 | 导出、关会并核专家状态 | 重启冷节点需明确重接，不自动重放未知任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多模型配置和本地状态，金额未知 | 设角色边界、模式、预算和验收 | 没有预置角色，需自定义 |
| 持续使用 | 专家上下文/输出、拆分LLM、可能工具成本 | 主持转交、审证、人工表态 | 发言估算预算不是实际账单上限 |
| 失败恢复 | 冷会话重接、重复模型/文件成本 | 核持久日志与未送达消息 | dropped与已落盘发言是不同结果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 组织与留档 | 持久节点、发言、评审与导出 | 最终方案质量对比单Agent |
| 状态/预算 | 发言量粗估门、live实际usage派生 | 冷会话不可测且真费用不受粗估硬控 |
| 汇聚 | 确定性抽核心并截断 | 旧文占满时后续关键观点被省略 |

> **思考**：预算门按发言字符估算，真实usage仅状态派生且冷节点不可测；网关按发言顺序拼接后整体截前4000字符，后续观点可能消失。角色讨论和支持表态不能替代缺陷复现，图上的边也不能自动等同严格执行流程。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将专家持久身份、发言留档与即时唤醒分开，并把红队观点、人类表态与修订轮次结构化；贡献是协作责任与可检查记录，不是独立证据或多模型必然更准。参见[Q01](#research-q01)、[Q02](#research-q02)。

将专家持久身份、发言留档与即时唤醒分开，并把红队观点、人类表态与修订轮次结构化；贡献是协作责任与可检查记录，不是独立证据或多模型必然更准。参见[Q01](#research-q01)、[Q02](#research-q02)。

留档和唤醒拆分、状态投影与预算恢复通道值得借鉴；复用需主持/专家所有权、未知送达不重放、汇聚覆盖及真实成本测量，图形UI不代替执行语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

预算门按发言字符估算，真实usage仅状态派生且冷节点不可测；网关按发言顺序拼接后整体截前4000字符，后续观点可能消失。角色讨论和支持表态不能替代缺陷复现，图上的边也不能自动等同严格执行流程。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合能主持和审证的方案维护者先用少量专家、短轮数试用，比较同预算单Agent；严格费用封顶、无人值守交付或不可重复副作用任务先观察。只依发言粗估不设账单保证，dropped/冷节点先查持久记录再重派。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

协作/留档/评审机制有源码支持；质量增益、真实成本控制及增量收据假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tools.ts、src/plan.ts、src/budget.ts、src/token-usage.ts、src/aggregator.ts、src/state.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读Host接线、21工具注册及关键发言/送达/评审、预算、usage、汇聚和草案；未完整审计全部RPC/UI/子代理生命周期或运行。
- 下一步：在可重复任务中对照单Agent/当前圆桌/增量收据，核关键反例覆盖、正确修改、实际用量和人工主持时间。

**分析版本**

- **仓库**：[9931666/dsh-plugin-roundtable](https://github.com/9931666/dsh-plugin-roundtable)
- **版本号**：1.0.0-rc.4（[固定提交 e2cb127](https://github.com/9931666/dsh-plugin-roundtable/tree/e2cb127bc0c2654a92cf2db64256c982c78b90e4)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可用按轮次/观点ID的增量汇聚收据，明确覆盖/遗漏与未决冲突，再以真实请求预算而非文本量限制新唤醒。对照单Agent和当前圆桌同预算任务，若质量不升、关键观点仍漏或实际费用越界则否定；假设未验证，追踪和收据会增上下文成本。参见[Q05](#research-q05)。

在可重复任务中对照单Agent/当前圆桌/增量收据，核关键反例覆盖、正确修改、实际用量和人工主持时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 1935 | — | — | 32429 |
| .mjs | source | 7 | 1387 | 1016 | 248 | — |
| .ts | source | 30 | 8121 | 5959 | 1748 | — |
| .tsx | source | 5 | 3125 | 2689 | 305 | — |
| .mjs | test | 17 | 1994 | 1606 | 199 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-roundtable/issues?q=is%3Aissue+created%3A2026-09-23T01%3A50%3A26.766Z..2026-10-23T01%3A50%3A26.766Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-roundtable/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T01%3A50%3A26.766Z..2026-10-23T01%3A50%3A26.766Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 e2cb127bc0c2654a92cf2db64256c982c78b90e4 和截止 2026-10-23T01:41:11Z 范围内，多角色圆桌协作能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要多角色圆桌协作，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

方案维护者希望多视角讨论可暂停拍板并留下“谁说了什么、谁支持什么”的记录。简单替代是单Agent自审或手工开多个会话；插件用持久专家、模式和评审卡改变组织与交接。合格输出须有可回指证据/决策和最终修订，图上热闹、观点数及人类支持均不自动证明方案正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-24](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/README.md#L16-L24)

作者圆桌场景

```text
## 一句话

> 你只负责抛出议题。DeepSeek 成为主持人，在拓扑图上拉起一圈专家节点，用带箭头的连线组织协作，经过汇聚网关汇总，遇到分歧时把决策权交还给你。

## 特性

### 会议组织
| 能力 | 说明 |
| --- | --- |
```

**依据 2 · 源码核查**：[src/tools.ts:838-843](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/tools.ts#L838-L843)

持久报告语义与核心输出格式

```text
    name: 'roundtable_speak',
    description: 'Report into the meeting transcript — the default channel: durable, feeds the aggregation gateway, and wakes nobody. Use this instead of roundtable_send_message unless someone must act right now. Keep the charter format and the report envelope [REPORT R{轮} {key}] 结论（≤3 条）｜证据｜待决策; [核心产出] is the exact segment the gateway captures. Leave `to` empty to submit to the gateway; set it to a participant key for a directed remark.',
    parameters: {
      content: { type: 'string', required: true, description: 'The full contribution text.' },
      to: { type: 'string', description: 'Directed audience: a node key or "captain". Empty submits to the aggregation gateway.' },
      kind: { type: 'string', enum: ['speech', 'proxy-thinking', 'retrieval'], description: 'Contribution kind (default speech). Use "proxy-thinking" when you speak for a black-box worker model, "retrieval" when reporting knowledge-base retrieval.' },
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 角色调度、会话状态与结论交付如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

主持人先plan确认草案再create，添加持久子代理后按模式转交；speak只写transcript不唤醒，send_message在锁内留发言后于锁外送达。summarize用确定性网关，review工具保存观点/表态/修订，UI读状态投影。需宿主子代理/模型/可写工作区，问答与skills可降级；失败dropped要与持久记录区分，重启冷节点不能假装live。

#### 证据与依据

**依据 1 · 源码核查**：[src/plan.ts:24-53](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/plan.ts#L24-L53)

草案与approved/revise/unavailable区别

<details>
<summary>查看原文（30行）</summary>

```text
 * 一张设置卡片所描述的会议草案（尚未创建）。
 *
 * 字段与 `roundtable_create` 的入参一一对应，外加 `skills` / `skillDelivery`，
 * 这样用户确认后主持人可以**原样**按草案创建会议，不再自行拍参数。
 */
export interface MeetingDraft {
  /** 会议名称（同时作为会议 id 的稳定来源）。 */
  name: string
  /** 会议背景与核心目标（总纲第一节）。 */
  goal: string
  /** 协作模式。 */
  mode: 'orchestrated' | 'egalitarian' | 'redteam'
  /** 轮数上限，超限闭麦。 */
  maxRounds: number
  /** Token 预算上限，超限闭麦。 */
  maxTokens: number
  /** 知识库目录（可空）：主持人按需读取其中文件转交专家。 */
  kbPath: string
  /** 本次会议选中的 skill 名称清单（可为空）。 */
  skills: string[]
  /** skill 传递方式：relay=主持人中转；direct=专家自行调用。 */
  skillDelivery: SkillDelivery
}

/** 卡片选项的两态解析结果。 */
export type PlanConfirmation =
  | { kind: 'approved' }
  | { kind: 'revise'; note: string }
  /** 服务缺失或用户没给任何选择：主持人应把它当作"再确认一次"。 */
  | { kind: 'unavailable'; note: string }
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:861-887](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/tools.ts#L861-L887)

speak留档链

<details>
<summary>查看原文（27行）</summary>

```text
    async execute(args, exec) {
      const caller = requireCaptain(exec)
      const stateRoot = stateRootOf(workspaceOf(caller), config.stateDir)
      const located = await locateParticipantMeeting(stateRoot, caller.id)
      const recorded = await withMeetingLock(meetingLockKey(stateRoot, located.id), async () => {
        const { meeting, identity } = await requireFreshParticipant(stateRoot, located.id, caller.id)
        const content = String(args.content ?? '').trim()
        if (content === '') throw new Error('content must not be empty')
        const speaker = identity.kind === 'captain' ? CAPTAIN_KEY : identity.name
        const to = args.to !== undefined ? String(args.to).trim() : undefined
        if (to !== undefined && to !== '' && !validEndpoint(meeting, to)) {
          throw new Error(`unknown directed audience "${to}"`)
        }
        const kind = (args.kind ?? 'speech') as 'speech' | 'proxy-thinking' | 'retrieval'
        const utterance = await recordUtterance(
          stateRoot,
          meeting,
          { nodeKey: speaker, kind, content, to: to === '' ? undefined : to },
          { opensNewRound: identity.kind === 'captain' },
        )
        return {
          utterance_id: utterance.id,
          round: utterance.round,
          tokens_used: estimateTokens(content),
          budget_remaining_tokens: Math.max(0, meeting.budget.maxTokens - meeting.budget.usedTokens),
        }
      })
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:917-946](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/tools.ts#L917-L946)

落盘与即时送达分开

<details>
<summary>查看原文（30行）</summary>

```text
      const prepared = await withMeetingLock(meetingLockKey(stateRoot, located.id), async () => {
        const { meeting, identity } = await requireFreshParticipant(stateRoot, located.id, caller.id)
        await assertUsablePersisting(stateRoot, meeting)
        const speaker = identity.kind === 'captain' ? CAPTAIN_KEY : identity.name
        if (meeting.mode !== 'egalitarian' && identity.kind === 'node' && to !== CAPTAIN_KEY) {
          throw new Error('orchestrated/redteam mode: nodes report to the captain only — the captain relays between nodes')
        }
        if (to === CAPTAIN_KEY) {
          // Captain-bound messages are persisted in the transcript; live steering happens after the lock.
          await recordUtterance(stateRoot, meeting, { nodeKey: speaker, kind: 'speech', content, to: CAPTAIN_KEY })
          return { kind: 'captain' as const, meeting, speaker }
        }
        const recipient = requireNode(meeting, to)
        if (recipient.id === '') throw new Error(`node "${to}" has no live subagent yet`)
        await recordUtterance(stateRoot, meeting, { nodeKey: speaker, kind: 'speech', content, to })
        return { kind: 'node' as const, meeting, speaker, recipient }
      })
      const captainLive = ctx.agents.get(prepared.meeting.captainSessionId as import('@deepseek-ai/dsh-session').SessionId)
      if (prepared.kind === 'captain') {
        if (captainLive !== undefined && prepared.speaker !== CAPTAIN_KEY) {
          const delivered = steerCaptain(captainLive, `RoundTable message from ${prepared.speaker}:\n\n${content}`)
          return { delivered: delivered ? 'live' : 'dropped' }
        }
        return { delivered: 'dropped' }
      }
      if (captainLive !== undefined) {
        const accepted = await deliverToNode(ctx, captainLive, prepared.recipient.id, content, exec.signal)
        return { delivered: accepted ? 'wake' : 'dropped' }
      }
      return { delivered: 'dropped' }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:157-194](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/index.ts#L157-L194)

工具配置与事件补录

<details>
<summary>查看原文（38行）</summary>

```text
  registerRoundTableTools(ctx, {
    stateDir: resolved.stateDir,
    memberProvider: resolved.memberProvider,
    maxNodes: resolved.maxNodes,
    defaultMode: resolved.defaultMode,
    memberMaxDepth: resolved.memberMaxDepth,
    // 观点拆分 LLM 路由：默认 deepseek-official/deepseek-v4-flash（实测可用），
    // 后续可配置化；不可用时 collect 自动整条兜底（三道防线②）。
    reviewSplit: {
      provider: 'deepseek-official',
      model: 'deepseek-v4-flash',
      maxOpinions: 3,
    },
    // Read live every spawn so a settings change applies to newly added
    // experts without a restart.
    getExpertLimits: () => {
      const prefs = runtime.prefs.get()
      return {
        maxTokens: prefs.expertMaxTokens ?? 0,
        maxOpinions: prefs.expertMaxOpinions ?? 0,
      }
    },
    // R2.2/D5：skill 传递方式的默认值，读设置页（实时）。
    getSkillDelivery: () => (runtime.prefs.get()).skillDelivery ?? 'relay',
    // R1 第 3 条：卡片默认值的设置页那一层。
    getPlannedDefaults: () => {
      const prefs = runtime.prefs.get()
      return {
        mode: prefs.defaultMode,
        maxRounds: prefs.maxRounds,
        maxTokens: prefs.maxTokens,
        skillDelivery: prefs.skillDelivery ?? 'relay',
      }
    },
  })
  // 第 1 批：接入宿主子代理生命周期 —— 专家产出自动落盘（即使它没调
  // roundtable_speak 或中途中断），失败原因写进 node.lastError。
  attachNodeEvents(ctx)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使多角色圆桌协作的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

核心质疑是多人机制是否带来净质量而非更多文字。budget只算文本，provider usage为另一个派生状态；网关每条160字符并在4000总长截头，长会下最新反例可能不进入主持摘要。普通speak不按拓扑强制执行，多模式消息权限也不能等同DAG调度。可借鉴同会议锁、原子写和留档/唤醒分离，但进程内锁不是跨Host事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/budget.ts:9-14](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/budget.ts#L9-L14)

预算门使用usedTokens

```text
export function budgetExceeded(meeting: Meeting): 'rounds' | 'tokens' | undefined {
  // 设 N 轮就能开 N 轮：`round` 是"已开启的轮次"，只有想开第 N+1 轮时才触顶。
  // （旧口径 `>=` 会让 maxRounds=10 实际只能开 9 轮——对面向用户的设置项不直觉。）
  if (meeting.round > meeting.budget.maxRounds) return 'rounds'
  if (meeting.budget.usedTokens >= meeting.budget.maxTokens) return 'tokens'
  return undefined
```

**依据 2 · 源码核查**：[src/budget.ts:75-84](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/budget.ts#L75-L84)

字符估算公式

<details>
<summary>查看原文（10行）</summary>

```text
/** Estimate the token cost of a text (coarse: ~0.6 tokens per CJK char, ~0.3 per latin). */
export function estimateTokens(text: string): number {
  let cjk = 0
  let other = 0
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0
    if (code >= 0x2e80) cjk += 1
    else if (char.trim() !== '') other += 1
  }
  return Math.ceil(cjk * 0.6 + other * 0.3)
```

</details>

**依据 3 · 源码核查**：[src/token-usage.ts:22-24](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/token-usage.ts#L22-L24)

真实usage仅派生且冷会话不可测

```text
 * 本模块只读、不写状态：把真实值作为 `roundtable_status` 的派生输出，而不是
 * 新落一个半成品字段（否则又是"定义了却没人用"的账）。冷会话（进程重启后的
 * 旧节点）取不到值 —— 宁可标注"不可测"，也不拿估算冒充实测。
```

**依据 4 · 源码核查**：[src/aggregator.ts:31-42](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/aggregator.ts#L31-L42)

顺序拼接并截前4000

<details>
<summary>查看原文（12行）</summary>

```text
/** Merge utterances into a compact, chronological exchange (who → whom: core point). */
export function aggregateUtterances(utterances: readonly MeetingUtterance[], maxLength = MAX_LENGTH): string {
  const lines: string[] = []
  for (const utterance of utterances) {
    if (utterance.kind !== 'speech' && utterance.kind !== 'proxy-thinking') continue
    const from = utterance.nodeKey
    const to = utterance.to ?? '网关'
    const body = compact(extractCore(utterance.summary ?? utterance.content), MAX_PER_UTTERANCE)
    lines.push(`[R${utterance.round}] ${from} → ${to}\n${body}`)
  }
  const text = `[汇聚网关·交锋摘要]\n${lines.join('\n\n') || '（暂无发言）'}`
  return text.length > maxLength ? `${text.slice(0, maxLength)}\n…(截断)` : text
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:917-932](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/tools.ts#L917-L932)

权限按模式及参与者判断

<details>
<summary>查看原文（16行）</summary>

```text
      const prepared = await withMeetingLock(meetingLockKey(stateRoot, located.id), async () => {
        const { meeting, identity } = await requireFreshParticipant(stateRoot, located.id, caller.id)
        await assertUsablePersisting(stateRoot, meeting)
        const speaker = identity.kind === 'captain' ? CAPTAIN_KEY : identity.name
        if (meeting.mode !== 'egalitarian' && identity.kind === 'node' && to !== CAPTAIN_KEY) {
          throw new Error('orchestrated/redteam mode: nodes report to the captain only — the captain relays between nodes')
        }
        if (to === CAPTAIN_KEY) {
          // Captain-bound messages are persisted in the transcript; live steering happens after the lock.
          await recordUtterance(stateRoot, meeting, { nodeKey: speaker, kind: 'speech', content, to: CAPTAIN_KEY })
          return { kind: 'captain' as const, meeting, speaker }
        }
        const recipient = requireNode(meeting, to)
        if (recipient.id === '') throw new Error(`node "${to}" has no live subagent yet`)
        await recordUtterance(stateRoot, meeting, { nodeKey: speaker, kind: 'speech', content, to })
        return { kind: 'node' as const, meeting, speaker, recipient }
```

</details>

#### 缺口

- 同预算单Agent/多专家质量与完整coverage未比较
  **影响**：无法判断多模型讨论是否值得额外费用
  **进一步探讨**：固定任务和验收标准，比较遗漏、正确修改、总用量与人工主持时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要设角色/模型/模式并理解确认卡；持续成本含各专家system/persona/历史、输出、拆观点模型和人工主持；失败需读日志、核dropped或冷节点、避免重复副作用。预算文本量只是交流刻度，实际费用取所有请求和可测覆盖，未知会话不能填零。没有每合格决策成本或净节时数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/token-usage.ts:4-24](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/token-usage.ts#L4-L24)

真实费用遗漏边界

<details>
<summary>查看原文（21行）</summary>

```text
 * 背景：`meeting.budget.usedTokens` 只累加**发言文本**的粗估（≈0.6 token/字），
 * 不含 system prompt、专家 persona、历史上下文与工具调用开销。真实会议数据
 * 里，它 7/7 场与"逐条发言文本估算"完全相等，而主持人自己的发言就吃掉
 * 38.9%（某一场达 73.4%）—— 用户设 200k，专家实际能用的远不到一半。v0.2.35
 * 只补了 UI 标注（"不是真实账单"），根因未修。
 *
 * 宿主其实有精确的 provider 上报值：
 * - `ctx.sessionProjections.snapshot(session, ['tokenUsage'])` 的
 *   `tokenUsage` 由每个 assistant settlement 的 usage 采样累加而来
 *   （`uncachedInputTokens` / `outputTokens` / `cacheReadTokens` /
 *   `cacheWriteTokens`，四桶互不重叠）；
 * - `Agent.session` 是拿到 `Session` 的现成入口（`tools.ts` 早已在用
 *   `agent.session.header.cwd`）。
 *
 * **明确否定的一条**：`ctx.subagents.sendMessage` / `startContinuable` 的返回值
 * 都不带 usage，`SubagentResult` / `SubagentRunEndInfo` 也没有 —— 想接真实用量
 * 只能走"子会话的 session"这条路。
 *
 * 本模块只读、不写状态：把真实值作为 `roundtable_status` 的派生输出，而不是
 * 新落一个半成品字段（否则又是"定义了却没人用"的账）。冷会话（进程重启后的
 * 旧节点）取不到值 —— 宁可标注"不可测"，也不拿估算冒充实测。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:163-168](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/index.ts#L163-L168)

观点拆分额外固定路由

```text
    // 观点拆分 LLM 路由：默认 deepseek-official/deepseek-v4-flash（实测可用），
    // 后续可配置化；不可用时 collect 自动整条兜底（三道防线②）。
    reviewSplit: {
      provider: 'deepseek-official',
      model: 'deepseek-v4-flash',
      maxOpinions: 3,
```

**依据 3 · 源码核查**：[src/tools.ts:934-946](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/tools.ts#L934-L946)

送达失败恢复责任

<details>
<summary>查看原文（13行）</summary>

```text
      const captainLive = ctx.agents.get(prepared.meeting.captainSessionId as import('@deepseek-ai/dsh-session').SessionId)
      if (prepared.kind === 'captain') {
        if (captainLive !== undefined && prepared.speaker !== CAPTAIN_KEY) {
          const delivered = steerCaptain(captainLive, `RoundTable message from ${prepared.speaker}:\n\n${content}`)
          return { delivered: delivered ? 'live' : 'dropped' }
        }
        return { delivered: 'dropped' }
      }
      if (captainLive !== undefined) {
        const accepted = await deliverToNode(ctx, captainLive, prepared.recipient.id, content, exec.signal)
        return { delivered: accepted ? 'wake' : 'dropped' }
      }
      return { delivered: 'dropped' }
```

</details>

#### 缺口

- 账单、主持工时与结果质量数据不足
  **影响**：不能支持成本下降或无人值守
  **进一步探讨**：同任务同总预算记录所有请求、人工修订和合格决策

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从角色调度、会话状态与结论交付的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

未验证方案把汇聚改成按观点ID/轮次增量收据，明确哪些发言已看、哪条被裁剪与冲突未解；预算则在新唤醒前依据可测真实请求并为冷节点预留unknown。它针对当前截头汇聚和发言粗估的局限。对照当前圆桌与单Agent，若关键反例仍漏、真用量失控或合格方案质量不升则否定，收据token与主持负担另计。

#### 证据与依据

**依据 1 · 源码核查**：[src/aggregator.ts:31-42](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/aggregator.ts#L31-L42)

汇聚覆盖改进切入点

<details>
<summary>查看原文（12行）</summary>

```text
/** Merge utterances into a compact, chronological exchange (who → whom: core point). */
export function aggregateUtterances(utterances: readonly MeetingUtterance[], maxLength = MAX_LENGTH): string {
  const lines: string[] = []
  for (const utterance of utterances) {
    if (utterance.kind !== 'speech' && utterance.kind !== 'proxy-thinking') continue
    const from = utterance.nodeKey
    const to = utterance.to ?? '网关'
    const body = compact(extractCore(utterance.summary ?? utterance.content), MAX_PER_UTTERANCE)
    lines.push(`[R${utterance.round}] ${from} → ${to}\n${body}`)
  }
  const text = `[汇聚网关·交锋摘要]\n${lines.join('\n\n') || '（暂无发言）'}`
  return text.length > maxLength ? `${text.slice(0, maxLength)}\n…(截断)` : text
```

</details>

**依据 2 · 源码核查**：[src/token-usage.ts:53-60](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/token-usage.ts#L53-L60)

真实用量带可测/不可测覆盖

```text
/** How many expert sessions could be measured for one meeting. */
export interface MeetingRealUsage {
  /** Sum of measured session totals. */
  measuredTotal: number
  /** Sessions that produced a provider-reported figure. */
  measuredSessions: number
  /** Child sessions that exist but could not be measured (cold / not live). */
  unmeasuredSessions: number
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用多角色圆桌协作，何时应停止？

**研究主题**：采用判断

#### 完整回答

适合愿主持和审证的开发/研究维护者先用两三位角色、低轮数和可重做任务试用；不适合要求严格账单封顶、自动质量认证或不可重复外部动作。成功是决策可回证据且同预算有增益；budget异常、摘要漏反例、dropped或冷节点应暂停查持久事实再派发，不依据UI状态重放。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:893-907](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/tools.ts#L893-L907)

即时消息返回wake/live/dropped

<details>
<summary>查看原文（15行）</summary>

```text
    name: 'roundtable_send_message',
    description: 'Send a direct message that WAKES the recipient as its next turn — use it only when they must act right now; ordinary reporting goes through roundtable_speak (durable, wakes nobody). When forwarding someone else\'s opinion, quote the reference R{n}[{speaker}] instead of pasting the full text. In "orchestrated" mode only the captain may message nodes (nodes report to the captain); in "egalitarian" mode any participant may message any other — this is how experts debate peer-to-peer.',
    parameters: {
      to: { type: 'string', required: true, description: 'Recipient: "captain" or a node key.' },
      content: { type: 'string', required: true, description: 'The message text.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          delivered: { type: 'string', required: true, description: 'wake (recipient node woken), live (captain steered), or dropped (best effort failed).' },
        },
      },
      render: (_args, value) => [{ type: 'text', text: `Message delivered via ${value.delivered}.` }],
```

</details>

**依据 2 · 源码核查**：[src/budget.ts:48-58](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/budget.ts#L48-L58)

闭麦仍留退出/补预算通道

<details>
<summary>查看原文（11行）</summary>

```text
 * @param options.allowMuted - resolve/escalate paths (top up the budget, close,
 *   export, clear the user-action queue) stay reachable while muted; everything
 *   that produces new work still throws.
 */
export function assertUsable(meeting: Meeting, options: { allowMuted?: boolean } = {}): void {
  if (meeting.status === 'ended' || meeting.status === 'archived') {
    throw new MeetingEndedError(meeting.id)
  }
  if (options.allowMuted === true) return
  const axis = budgetExceeded(meeting)
  if (axis !== undefined) throw new MeetingMutedError(meeting.id, axis)
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:1483-1496](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/tools.ts#L1483-L1496)

结束review是状态而非修复验收

<details>
<summary>查看原文（14行）</summary>

```text
      return withCaptainLock(stateRoot, located.id, captain.id, 'finish the review', async (fresh) => {
        const review = await readReview(stateRoot, fresh.id)
        if (review === undefined) throw new Error('no review in progress — call roundtable_start_review first')
        if (review.status === 'done') {
          return { status: review.status, review_pass: review.reviewPass, endorsed_count: countEndorsed(review), can_review_again: review.reviewPass < review.maxReviewPass }
        }
        if (review.status === 'reviewing') {
          throw new Error('review is still collecting viewpoints — call roundtable_collect_review before finishing')
        }
        review.status = 'done'
        review.finishedAt = Date.now()
        const summary = String(args.revised_plan_summary ?? '').trim()
        if (summary !== '') {
          // 本轮修订说明并入最后一条历史（无历史则新建），供下一轮"旧缺陷是否修复"核对。
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
