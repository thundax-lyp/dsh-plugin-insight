# dsh-eteams

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cd6bc01](https://github.com/2507483326/dsh-eteams/tree/cd6bc01ae511901e26c2b47d0a71e471dce262fd)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2507483326/dsh-eteams) [![npm 30d 1,404](https://img.shields.io/static/v1?label=npm+30d&message=1%2C404&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-eteams) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-eteams)
<!-- END META -->

> **功能**：为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。

> **亮点**：把手工多会话交接变成任务合同、成员副本、attempt token和事件/邮箱持久单元，角色可用不同模型；不把本地状态或角色数当效果。详见[Q01](#research-q01)。

> **主要限制**：非空报告即完成、依赖/链为弱序，spawn和文件不受DB事务回滚；启动10s快扫与60s grace可遗漏近期死尝试。详见[Q04](#research-q04)。

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
  - [Q01 · 团队到底交付什么，相对手工多会话有何增量？](#detail-section-11)
  - [Q02 · 工具身份、Web管理面与计划收口是不是同一授权？](#detail-section-12)
  - [Q03 · 派发/链/完成与重试真正保证什么？](#detail-section-13)
  - [Q04 · SQLite与重启对账解决什么，还遗漏什么？](#detail-section-14)
  - [Q05 · 工作目录、产物和删除可否当隔离与原子恢复？](#detail-section-15)
  - [Q06 · 角色、模型与人类交接分别依什么机制？](#detail-section-16)
  - [Q07 · 成本、计量与工程依据如何判读？](#detail-section-17)
  - [Q08 · 采用与可证伪方向是什么？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要角色分工和持续交接的DSH任务，需人工定义独立验收与共享目录责任。详见[Q01](#research-q01)。

手工多个Agent会话、复制简报与任务文档；本项持久任务/责任副本和交接流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多会话成员 | persona/模型分工 | 真子Agent，非文件隔离 |
| 任务状态/attempt | 分配领取交接 | completed为报告，弱依赖链 |
| 人类问答 | 记录问题/落点 | 依宿主真实用户授权 |
| 管理看板/用量 | 可见协作过程 | 管理面受信，台账非账单 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Node22.19或24+/SQLite | 本地状态 | 备份WAL/数据库、单写者假设 |
| DSH子Agent/模型/问答服务 | 真成员会话与人类问题 | 模型费/宿主权限另计 |
| 自己可写stateDir | 全局或工作区状态 | bundle硬编码个人盘符需修正 |
| 共享任务目录/人工验收 | 交付物与协作 | 非成员文件隔离/非自动验收 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 修路径/备份与限制管理面 | 维护者 | 不用作者个人stateDir |
| 定角色/模型/合同验收 | 用户/领队 | 清楚成本与共享写者 |
| 拆任务收口派发 | 领队 | 结构合法不等真人批准 |
| 成员claim/提交/独立核产物 | 成员/验收人 | token与实际验收分别成立 |
| 重启核尝试与外部受理 | 维护者 | grace遗漏/未知不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node SQLite/DSH、角色库/数据库/工作目录 | 修正bundle绝对状态路径、备份、定义角色/模型/合同与验收 | 模型/宿主价格和配置工时未知 |
| 持续使用 | 队长/成员/访谈多会话token、即刻重试、SQLite明细与工作文件 | 分解合同、审核报告/决策、处理交接和同目录冲突 | 成员副本跨任务可并行，maxMembers非总模型请求限额，净收益未测 |
| 失败恢复 | 数据库WAL/备份、保留会话及输出，可能重试额外模型请求 | 对齐attempt/token/会话活跃/已发生副作用，处理宽限期遗漏与孤儿 | DB事务不覆盖spawn/文件/模型，未知结果不可盲重放，恢复人时未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多会话责任 | 真实child/副本/attempt token | 多角色同条件质量增益 |
| 管理交付物 | 合同/事件/纪要/邮箱 | 非空报告的实际验收 |
| 持久恢复 | SQLite事务/死会话快扫 | 外部受理正好一次/近期grace后再判 |

> **思考**：非空报告即完成、依赖/链为弱序，spawn和文件不受DB事务回滚；启动10s快扫与60s grace可遗漏近期死尝试。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把手工多会话交接变成任务合同、成员副本、attempt token和事件/邮箱持久单元，角色可用不同模型；不把本地状态或角色数当效果。详见[Q01](#research-q01)。

副本身份和attempt token、错误不毒化本地锁与同库状态/事件/邮件事务可借鉴；不可扩张为外部事务。详见[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

非空报告即完成、依赖/链为弱序，spawn和文件不受DB事务回滚；启动10s快扫与60s grace可遗漏近期死尝试。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

试用，备份/可信管理面/明确人工验收，completed按成员报告解读，不能当全自动业务验收。详见[Q08](#research-q08)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

真实多会话与责任/交接记录有源码贡献；自报完成与恢复窗口不等独立验收/正好一次；受理验收收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/host/index.ts、src/host/config.ts、src/host/tools/identity.ts、src/host/tools/captainTools.ts、src/host/runtime/members.ts、src/host/runtime/assignment.ts、src/host/runtime/docs.ts、src/host/runtime/base.ts、src/host/runtime/webui.ts、src/host/runtime/reconcile.ts、src/host/runtime/askUser.ts、src/host/runtime/gaps.ts、src/host/runtime/teamOps.ts、src/host/runtime/usage.ts、src/host/state/usageStore.ts、src/host/state/store.ts、src/host/state/db.ts、src/host/state/lock.ts、src/host/commands/eteam.ts、tests/reconcile.test.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定TS核心入口/身份/派发claim完成重试/SQLite事务/对账/文档/问答及用量关键链，有界抽读Web与gap模块和代表测试；非全仓安全审计，不执行目标。
- 下一步：按spawn后DB失败、grace短期重启、活集合查询错、自报假完成与文件删除回滚核受理/验收收据。

**分析版本**

- **仓库**：[2507483326/dsh-eteams](https://github.com/2507483326/dsh-eteams)
- **版本号**：0.2.21（[固定提交 cd6bc01](https://github.com/2507483326/dsh-eteams/tree/cd6bc01ae511901e26c2b47d0a71e471dce262fd)）
- **版本日期**：2026-09-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

持久受理intent/固定childID、输入产物版本和独立验收收据，延期补判并区分查询未知与死亡，按崩溃/假完成反例证伪。详见[Q08](#research-q08)。

按spawn后DB失败、grace短期重启、活集合查询错、自报假完成与文件删除回滚核受理/验收收据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 3433 | — | — | 128614 |
| .mjs | source | 11 | 883 | 616 | 208 | — |
| .cjs | source | 6 | 209 | 185 | 23 | — |
| .ts | source | 110 | 31122 | 21522 | 8194 | — |
| .tsx | source | 68 | 14256 | 9579 | 4318 | — |
| .ts | test | 53 | 19078 | 15907 | 1891 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/2507483326/dsh-eteams/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/2507483326/dsh-eteams/issues?q=is%3Aissue+created%3A2026-09-22T10%3A41%3A54.451Z..2026-10-22T10%3A41%3A54.451Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/2507483326/dsh-eteams/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A41%3A54.451Z..2026-10-22T10%3A41%3A54.451Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认多会话团队的实际任务交付、身份/状态约束及恢复与验收边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 团队到底交付什么，相对手工多会话有何增量？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向需要队长拆解、不同角色/模型分工并保留过程的DSH任务。已有办法是手开多会话、复制简报、手写任务/结果；本项用角色/班底/任务副本、主任务与小任务合同、attempt/token、事件和邮箱组织多会话。成员通过startContinuable真的起独立子会话，persona与模型路线可不同，不能把它说成一个模型仅换口吻，也不能把每段提示称独立Skill。

新增交付物是带任务ID、验收章节、尝试与交接记录的任务单/SQLite状态，以及共享留言板、每任务纪要和计划/文档目录。它让任务有可查询的责任行和阶段记录，但实际工作质量与文件/业务验收仍由人/外部条件判定。README“你批准后执行”是高层描述；本版本approve_plan已下线，需看收口和派发实现，不能承接旧审批保证。状态存本地不等Agent任务不联网。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-37](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/README.md#L19-L37)

作者场景。

<details>
<summary>查看原文（19行）</summary>

```text
## 这是什么

ETeams 给 DeepSeek Harness 装上「一支团队」：你把目标丢给**领队**，领队把目标拆成任务、按**执行链**派给**成员**，每个成员在自己的子会话里独立干活，进度、失败、决策实时可见。

不是「一个大模型假装多个人」，而是真实的多会话协作，你可以自由调度成员，并给每个成员不同的模型。

- **包名** `dsh-eteams`，插件 id `eteams`，双端单包（宿主端 + 浏览器端）。
- **自包含**：构建产物已内联全部依赖，无运行时安装负担；状态存本机 SQLite（内置 `node:sqlite`），不联网、不上传。

## 三步上手

| 步骤         | 做什么                                                                  |
| ------------ | ----------------------------------------------------------------------- |
| **1 · 添加成员** | `/eteam` 面试式生成角色手册，落进全局角色库 —— 每个角色就是一张岗位卡。 |
| **2 · 组件团队** | 面板「团队」页从角色库挑人进班子，指定一人为领队。                      |
| **3 · 创建任务** | 对话里说清目标 → 领队拆解、你批准 → 自动派发执行，全程在面板围观。      |

## 特色

```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:77-91](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/index.ts#L77-L91)

approve_plan下线。

<details>
<summary>查看原文（15行）</summary>

```text
export { createMemberTools } from './tools/memberTools.js';
// eteams_approve_plan 已随审批环节重构下线（docs/35 §5#1），导出面随之撤销。
export {
  assignTask,
  advanceTask,
  claimTask,
  completeTask,
  failTask,
} from './runtime/assignment.js';

/** Best-effort human label for the calling agent (diagnostics only). */
function callerLabel(agent: Agent | undefined): string {
  if (agent === undefined) return 'unknown';
  const probe = agent as unknown as { name?: unknown; sessionId?: unknown };
  if (typeof probe.name === 'string' && probe.name !== '') return probe.name;
```

</details>

**依据 3 · 源码核查**：[src/host/runtime/members.ts:185-232](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/members.ts#L185-L232)

持续子会话与路线。

<details>
<summary>查看原文（48行）</summary>

```text
      : sessionDefaultRouteOf(env.ctx);
  // childId 由调用方预留、**先登记后 spawn**（用户 2026-09-22「领队的文本出现
  // 在了子成员中」）：子代理首次装配早于 startContinuable 兑现，登记滞后的窗
  // 口里常驻段判定查不到成员身份，成员首轮装配就会拿到主对话的领队段（领队子
  // 代理路径同款修法，见 captainAgent 的 dispatchCaptain）。预留 id 直接交给
  // 运行时，故登记键与真身一致；spawn 失败撤掉预登记再原样抛（调用方尚未改任
  // 何状态，见模块头）。
  const childId = randomUUID();
  const identity = {
    teamId: String(team.id),
    memberName: row.name,
    employeeId: row.employeeId,
    parentSessionId: String(captain.id),
  };
  registerMemberSession(childId, identity);
  let start: { childId: string; messageId: unknown };
  try {
    start = await env.ctx.subagents.startContinuable({
      provider: env.config.memberProvider,
      childId,
      // 标签 = 显示名（宿主会话头部读 label）：名字在前，工牌后缀带 (任务, 工号)
      // 作用域——副本行 = (工号, 大任务)，同名成员各是各的子会话。
      label: buildMemberLabel(row.mainTaskId ?? 0, row.employeeId ?? 0, row.name),
      request: {
        prompt: [
          {
            type: 'text',
            text: memberWelcome(team, row.name, template, taskBriefing(env, team, task)),
          },
        ],
        parent: captain,
        persona: personaText,
        toolFilter: { deny: [...MEMBER_DENIED_TOOLS] },
        ...(agentOptions !== undefined ? { agentOptions } : {}),
      },
      // 0.1.2 的入口对 signal 无保护调用 throwIfAborted()——env 缺 signal
      // （面板路径）时兜底成永不中止的信号。
      signal: env.signal ?? new AbortController().signal,
    });
  } catch (error) {
    unregisterMemberSession(childId);
    throw error;
  }
  // 兑现的 id 再登一次（幂等）；运行时若没采纳预留 id，把预留键撤掉别留幽灵条目。
  if (String(start.childId) !== childId) unregisterMemberSession(childId);
  registerMemberSession(String(start.childId), identity);
  return String(start.childId);
}
```

</details>

**依据 4 · 源码核查**：[src/host/runtime/docs.ts:1-18](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/docs.ts#L1-L18)

任务交付材料。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Team work documents（用户 2026-09-15 扁平化）：
 * `<work_dir>/teams/<主任务号>-slug>/` —— **一个主任务一个目录**，主任务与其
 * 全部小任务共用这个根（团队名不进路径：一块留言板 / 一个计划夹 / 一个文档夹
 * 是「一个主任务」的治理面）。`work_dir` 是建任务时冻结的当前会话目录
 * （task.work_dir，绝对路径），所以同一任务的目录不再随调用者在工作区间漂移。
 * 目录下固定四样：
 *
 * - `留言板.md`：create-only，领队与全员共用一块板；
 * - `<任务号>-slug.纪要.md`：每个任务一份（含主任务自己）——上半段是宿主幂等
 *   渲染的合同视图（替代原 contract.md），下半段「纪要正文」由模型写（替代原
 *   各任务目录的 notes.md）；
 * - `计划/`、`文档/`：宿主只建目录，里面文件名与份数完全自由（各 agent 自己
 *   新建，宿主不去重、不落模板）。
 *
 * Docs are NOT state truth — render failures warn but never block (docs/07.2).
 *
 * 存量旧布局（`teams/<团队>/tasks/<任务>/sub/<小任务>/` + contract.md + notes.md）
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具身份、Web管理面与计划收口是不是同一授权？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

工具每次按真实exec.agent.id解析身份。显式sessionTeam绑定优先赋captain，再查captain child/主任务mainSession/leader副本，成员须匹配持久副本sessionId且仍在册；成员工具上报还需running attempt token。这比让模型填成员名自报身份更强。成员spawn deny队长管理工具，提示段不是权限本体；普通成员不能仅凭工具入参冒captain。

但绑定本身被视作领队意图，Web /eteams-api多种读写依赖宿主外层访问控制，本handler没有自身Origin/peer/token/调用者检查，readBody也无体积上限。session-persona可传sessionId写persona，session-team决定后续工具captain身份。不能把工具身份守卫当HTTP管理面鉴权，也不能据缺本地检查声称真实公网越权。

主任务收口要求至少一非取消小任务、合同含非空精确## 验收标准、questionnaire非空或skipQuestionnaire=true。其证明的是结构字段存在，不查问题确问真人/答案授权，也不验证验收章节质量或标准实际通过。captain工具可自报skip；不是不可绕人类审批票据。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/tools/identity.ts:92-142](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/tools/identity.ts#L92-L142)

绑定优先与session成员身份。

<details>
<summary>查看原文（51行）</summary>

```text
  const sessionId = String(agent.id ?? '');
  if (sessionId === '') throw new ETeamsError('无法识别调用者身份（会话 id 为空）');
  const root = stateRootOf(env);
  const teams = await listTeams(root);
  // 绑定常驻（用户迭代 2026-09-10 锁定语义）：绑定不再随消息消费，凡绑定
  // 会话的 eteams_* 调用恒按绑定团队解析（sessionTeam.ts）。
  const boundTeamId = getSessionTeamId(sessionId);
  if (boundTeamId !== undefined) {
    const bound = teams.find((t) => String(t.id) === boundTeamId);
    if (bound) return { kind: 'captain', team: bound, actor: captainActor(bound) };
  }
  const childTeamId = captainChildTeamOf(sessionId);
  if (childTeamId !== undefined) {
    const childTeam = teams.find((t) => String(t.id) === childTeamId);
    if (childTeam) return { kind: 'captain', team: childTeam, actor: captainActor(childTeam) };
  }
  // 领队主会话身份（v6 派生）：任一任务行 main_session_id 快照命中；无任务
  // 团队退建队事件留痕（findTeamByCaptain，建队后首个任务落地前）。
  const asCaptain = await findTeamByCaptain(root, sessionId);
  if (asCaptain) return { kind: 'captain', team: asCaptain, actor: captainActor(asCaptain) };
  // 领队子代理会话（领队行 session_id）：注册表丢失后的冷恢复身份。
  const asLeaderChild = teams.find((t) => leaderRowOf(t)?.sessionId === sessionId);
  if (asLeaderChild) {
    return { kind: 'captain', team: asLeaderChild, actor: captainActor(asLeaderChild) };
  }
  // 成员身份走副本行（session_id 即成员子会话 id）。R1 离职截断：工牌
  // （班底行）已删的副本行不再解析出成员身份——其存活子会话的工面就地失效
  // （工具层按 caller 缺失拒绝），防止离职成员继续 claim/读箱。
  for (const team of teams) {
    const row = team.taskMembers.find(
      (r) =>
        r.sessionId === sessionId &&
        (r.employeeId === null || team.members.some((m) => m.employeeId === r.employeeId)),
    );
    if (row) {
      // 领队副本行（随大任务生灭的领队子会话，用户迭代 2026-09-08）按
      // captain 解析——它不是干活的成员，是本任务的主持者。
      if (row.isLeader === true) {
        return { kind: 'captain', team, actor: captainActor(team) };
      }
      return { kind: 'member', team, member: row, actor: memberActor(row) };
    }
  }
  throw new ETeamsError(
    '当前会话不在任何 eteams 团队中',
    '领队用 eteams_create_team 建队；成员由领队拉入团队',
  );
}

/** Shared listTeams re-export for tool factories. */
export { listTeams };
```

</details>

**依据 2 · 源码核查**：[src/host/runtime/members.ts:40-77](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/members.ts#L40-L77)

成员管理工具deny。

<details>
<summary>查看原文（38行）</summary>

```text
  return `${MEMBER_LABEL_PREFIX}${name}（${taskMemberBadge(mainTaskId, employeeId)}）`;
}

/**
 * Member tool names（createMemberTools 的注册面）。harness 0.1.2 起成员工具
 * 随根作用域注册（宿主移除了 registerContinuableSetup，per-child 装配只剩
 * persona/toolFilter）——领队子代理的拒见清单（CAPTAIN_CHILD_DENIED_TOOLS）
 * 与构建器子代理的过滤（builderToolFilter）按本表派生。task_board/
 * team_status/send_message 的成员视角已并入 captainTools 同名工具（身份分
 * 支），不在本表。与 tools/memberTools 保持同步（tests 有断言）。
 */
export const MEMBER_TOOL_NAMES: readonly string[] = [
  'eteams_claim_task',
  'eteams_decline_task',
  'eteams_append_progress',
  'eteams_complete_task',
  'eteams_fail_task',
];

/**
 * Captain tool names denied to members (one visibility, loud deny).
 * Every entry MUST be a registered tool name: spawn applies the list via
 * `tools.restrict({ deny })`, which fails loudly on unknown names inside
 * the child creation window. `eteams_approve_plan` deliberately is NOT
 * here — approval is panel-driven and the tool is never registered
 * (lifecycle.test.ts asserts its absence), so denying it would abort
 * every member/builder spawn with `tools.restrict() names unknown
 * global tool "eteams_approve_plan"`.
 */
export const MEMBER_DENIED_TOOLS: readonly string[] = [
  'eteams_create_team',
  'eteams_add_member',
  'eteams_member_save',
  'eteams_member_list',
  'eteams_build_report',
  'eteams_build_guide',
  'eteams_build_wait',
  'eteams_remove_member',
```

</details>

**依据 3 · 源码核查**：[src/host/runtime/webui.ts:715-727](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/webui.ts#L715-L727)

无body限额。

<details>
<summary>查看原文（13行）</summary>

```text
async function readBody(req: unknown): Promise<string> {
  const r = req as { on: (event: string, cb: (chunk?: Buffer) => void) => void };
  const chunks: Buffer[] = [];
  return await new Promise((resolve, reject) => {
    r.on('data', (chunk) => {
      if (chunk)
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as unknown as string));
    });
    r.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    r.on('error', reject);
  });
}

```

</details>

**依据 4 · 源码核查**：[src/host/runtime/webui.ts:899-949](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/webui.ts#L899-L949)

prefix入口和persona写。

<details>
<summary>查看原文（51行）</summary>

```text
      webServer.register({
        kind: 'prefix',
        path: ROUTE_PREFIX,
        handler: async (rawReq, rawRes) => {
          const req = rawReq as { method?: string; url?: string | undefined };
          const res = rawRes;
          try {
            const url = new URL(req.url ?? '/', 'http://localhost');
            const path = url.pathname.slice(ROUTE_PREFIX.length) || '/';
            // Decode once here: pathname arrives percent-encoded for non-ASCII
            // team ids / member names (CJK slugs are the norm, docs/09).
            const segments = path
              .split('/')
              .filter((s) => s !== '')
              .map((s) => {
                try {
                  return decodeURIComponent(s);
                } catch {
                  return s;
                }
              });
            if (req.method === 'POST' && segments[0] === 'client-log' && segments.length === 1) {
              const raw = await readBody(req);
              const written = appendClientLog(ctx, config, raw);
              sendJson(res, 200, { ok: true, written });
              return;
            }
            // ---------- panel writes (M5 first slice) ----------
            // POST /session-persona — the panel's member selection (docs/13.8.2):
            // the session agent's system prompt gains a persona band evaluated per
            // assembly (sessionPersona.ts). No conversation message is involved.
            if (
              req.method === 'POST' &&
              segments[0] === 'session-persona' &&
              segments.length === 1
            ) {
              const body = parseJsonObject(await readBody(req));
              const sessionId = str(body.sessionId, '');
              const name = str(body.name, '');
              if (sessionId === '' || name === '') {
                sendError(res, 400, 'sessionId / name 均不能为空');
                return;
              }
              setSessionPersona(sessionId, {
                name,
                ...(body.role !== undefined ? { role: str(body.role) } : {}),
                ...(body.duty !== undefined ? { duty: str(body.duty) } : {}),
                ...(body.personaMd !== undefined ? { personaMd: str(body.personaMd) } : {}),
              });
              sendJson(res, 200, { ok: true });
              return;
```

</details>

**依据 5 · 源码核查**：[src/host/runtime/assignment.ts:444-504](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L444-L504)

结构收口与skip。

<details>
<summary>查看原文（61行）</summary>

```text
export async function finalizeCommissionTask(
  env: RuntimeEnv,
  who: OpActor,
  taskId: number,
  params: {
    subject: string;
    description?: string;
    /** 合同 MD 全文（十六轮 DA29 单篇 MD 口径）。 */
    contractMd?: string;
    /** 问询留档（与 eteams_submit_task 的 questionnaire 同词表）。 */
    questionnaire?: string[];
    /** 显式跳过问询自检（用户已给全/要求直接开始）。 */
    skipQuestionnaire?: boolean;
  },
): Promise<TaskRecord> {
  const out = await withTeam(env, who.teamId, (team, _root, tx) => {
    const task = requireTask(team, taskId);
    if (task.parentId !== null) {
      throw new ETeamsError(`任务 ${task.id} 不是主任务（任务单），不能作为提交目标`);
    }
    if (task.status !== 'creating') {
      throw new ETeamsError(
        `主任务 ${task.id} 处于 ${task.status}，无需重复提交`,
        '拆解小任务请用 eteams_create_task（带 parentTaskId）',
      );
    }
    // 收口拆解质量闸（docs/taskOrchestrationRefinement 议题一）：主任务必须
    // 拆出至少一个未取消小任务，且每个小任务的合同都要含非空「## 验收标准」
    // 段——把「该不该拆 / 单元合不合格」从软约束变成可拒绝路径。
    const subs = team.tasks.filter((t) => t.parentId === task.id && t.status !== 'cancelled');
    if (subs.length === 0) {
      throw new ETeamsError(
        `主任务 ${task.id} 还没有任何小任务：先 eteams_create_task（parentTaskId=${task.id}）拆解，再收口`,
        '主任务必须拆出至少一个小任务（单站点也行）',
      );
    }
    for (const sub of subs) {
      if (sub.contractMd === undefined || sub.contractMd.trim() === '') {
        throw new ETeamsError(
          `小任务 ${sub.id}「${sub.subject}」缺少任务合同：先用 eteams_update_task 补上含「## 验收标准」的合同`,
          '收口前每个小任务都要有可验收的合同',
        );
      }
      if (!hasAcceptanceCriteria(sub.contractMd)) {
        throw new ETeamsError(
          `小任务 ${sub.id}「${sub.subject}」的合同缺少「## 验收标准」段`,
          '格式：二级标题「## 验收标准」+ 非空编号列表',
        );
      }
    }
    // 收口问询自检闸（用户 2026-09-12「应该要问就要在任务执行之前问」）：收口
    // 是开跑闸（creating→ready），未问询不得放行——必须带 questionnaire（问过
    // 用户的问题）或显式声明跳过（用户已给全/要求直接开始）。
    const asked = params.questionnaire !== undefined && params.questionnaire.length > 0;
    if (!asked && params.skipQuestionnaire !== true) {
      throw new ETeamsError(
        `主任务 ${task.id} 收口前必须先完成问询（FR-37）：用 eteams_ask_user（领队子代理）/ ask_user_question（主会话）向用户问清目标，再带 questionnaire 收口；用户已给全或要求直接开始时传 skipQuestionnaire=true。`,
        '问询发生在执行之前：收口（creating→ready）是开跑闸，未问询不得进「待开始」。',
      );
    }
    const oldDir = task.taskDir;
```

</details>

**依据 6 · 源码核查**：[src/host/tools/captainTools.ts:875-932](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/tools/captainTools.ts#L875-L932)

模型收口入口。

<details>
<summary>查看原文（58行）</summary>

```text
    name: 'eteams_submit_task',
    description:
      '对话任务入口（docs/26）：用户在对话中把一个任务交给团队时先调它——立即生成任务 ID（主任务/任务单容器）与专属任务文件夹，面板「任务」页立刻以「创建中」显示（旋转动画 + 状态「创建中」+ 不可点进）。提交后按工作流推进：先向用户问询明确目标（结论用 eteams_update_task 写回本主任务 description），再用 eteams_create_task（带 parentTaskId）把任务拆解成多个小任务（每个小任务 chain 站点即成员槽）；拆解全部完成后**必须**再调本工具带 taskId 收口：回写主题/说明并把「创建中」转「待开始」（面板随即可开跑）——收口须带 questionnaire（问过用户的问题清单）或 skipQuestionnaire=true（用户已给全/要求直接开始），两者皆无会被宿主拒绝（问询必须在执行前完成，且已迭代到无未决项——成员结论/合同里不得留「推荐默认 / 待复核」类项）。收口还会校验拆解质量：主任务下须有至少 1 个未取消小任务，且每个小任务的合同都要含非空「## 验收标准」段——缺任一即拒绝收口。面板手动创建的任务（docs/panelTaskCommission）同样传 taskId 收口。',
    parameters: {
      taskId: int(
        '收口目标主任务号（不带 = 新建主任务容器，先落「创建中」待拆解收口；带 = 拆解完成后收口，把「创建中」转「待开始」）',
      ),
      subject: strR('任务主题（一句话）'),
      description: str('当前对任务的理解/背景（问询后更新）'),
      questionnaire: strArr('收口时必带：问过用户的问题清单（留档；答案更新进 description；问询迭代到无未决项）'),
      skipQuestionnaire: bool('无需问询：用户已给全或要求直接开始时置 true（跳过收口问询自检）'),
    },
    output: {
      schema: {
        type: 'object' as const,
        properties: {
          ok: bool('是否成功'),
          taskId: int('主任务号'),
          status: str('任务状态'),
          folder: str('专属任务文件夹（相对工作区）'),
        },
        additionalProperties: false as const,
      },
      render: (_a, v) => text(`任务 #${v.taskId} 已提交（任务单文件夹 ${v.folder}）`),
    },
    execute: async (args, exec) => {
      const env = envForAgent(config, runtime, exec.agent, exec.signal);
      const caller = await resolveCaller(env, exec.agent!);
      if (caller.kind !== 'captain') throw new ETeamsError('只有领队可以提交对话任务');
      const who = { teamId: caller.team.id, actor: caller.actor };
      let task: TaskRecord;
      if (args.taskId !== undefined) {
        // 完善收口（docs/panelTaskCommission）：面板「创建中」容器一次性
        // 落定（回写 + creating→ready + 事件，单事务）。
        task = await finalizeCommissionTask(env, who, args.taskId, {
          subject: args.subject,
          ...(args.description !== undefined ? { description: args.description } : {}),
          ...(args.questionnaire !== undefined && args.questionnaire.length > 0
            ? { questionnaire: args.questionnaire }
            : {}),
          ...(args.skipQuestionnaire === true ? { skipQuestionnaire: true } : {}),
        });
      } else {
        // 锁定 + 增补守卫（用户迭代 2026-09-10；2026-09-12 加严「每个会话
        // 只有一个主任务」）：本对话已有主任务（**含 completed**——完成只是
        // 可回退标识）就不再开新容器——band 是软约束，这里是硬兜底（模型忘
        // 了带 taskId 或无视 band 时给出可执行出路）。锚点只有容器删除或
        // cancelled 才释放，故正常流程里本对话不会再建第二个主任务。
        const freshBefore = await readTeam(stateRootOf(env), caller.team.id);
        // env.sessionId 缺省（无会话上下文的调用）按无锚定处理：'' 在判据里
        // 恒返回 undefined，不误拦面板等无会话路径。
        const anchored =
          freshBefore !== undefined ? anchoredMainTaskOf(freshBefore, env.sessionId ?? '') : undefined;
        if (anchored !== undefined) {
          throw new ETeamsError(
            `本对话已有主任务 #${anchored.id}「${anchored.subject}」——一个对话只有一个主任务（完成也不新开），不要再另建主任务`,
            caller.team.hasLeader
              ? `新请求用 eteams_dispatch_captain（taskId=${anchored.id}，message=用户原话）转交领队，由领队在主任务下增补小任务`
```

</details>

**依据 7 · 源码核查**：[src/host/runtime/webui.ts:968-1008](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/webui.ts#L968-L1008)

session-team管理写入及已开始对话换队守卫

<details>
<summary>查看原文（41行）</summary>

```text
            // POST /session-team — the composer's 团队 selection (docs/26):
            // binds the conversation to a team; the session agent's prompt
            // gains a 团队绑定 band (sessionTeam.ts) with the conversation
            // task workflow and the leadership branch (领队 / 主窗口充当
            // 领队 / 团队建在他会话的可行动提示).
            //
            // 锁定守卫（用户迭代 2026-09-10「1 个主对话只能有 1 个团队」；
            // 2026-09-13「开始对话后才不能修改」收窄）：会话已绑定其他健在
            // 团队**且对话已开始**（有 turn/start）→ 409 拒绝；对话未开始
            // （空白会话可改选团队）放行覆盖写；同队重绑放行（刷新名字/
            // 时间）；旧队已删除放行（删队清绑定 + 客户端徽章解锁后的重选
            // 逃生口）。硬不变量仍由工具层守卫兜住（sessionTeam.ts 注记）。
            if (req.method === 'POST' && segments[0] === 'session-team' && segments.length === 1) {
              const body = parseJsonObject(await readBody(req));
              const sessionId = str(body.sessionId, '');
              const teamId = str(body.teamId, '');
              if (sessionId === '' || teamId === '') {
                sendError(res, 400, 'sessionId / teamId 均不能为空');
                return;
              }
              const located = locateTeam(ctx, config, teamId);
              if (located === undefined) {
                sendError(res, 404, `团队「${teamId}」不存在`);
                return;
              }
              const existing = getSessionTeamBinding(sessionId);
              if (existing !== undefined && existing.teamId !== teamId) {
                const current = locateTeam(ctx, config, existing.teamId);
                const liveAgent = (ctx as unknown as RuntimeContext).agents?.get(sessionId);
                if (current !== undefined && conversationStarted(liveAgent)) {
                  sendError(
                    res,
                    409,
                    `本对话已固定为团队「${current.team.name}」——一个对话只能绑定一个团队`,
                  );
                  return;
                }
              }
              setSessionTeam(sessionId, { teamId, name: located.team.name, boundAt: Date.now() });
              sendJson(res, 200, { ok: true });
              return;
```

</details>

#### 缺口

- 固定宿主webServer的管理身份与跨会话路由授权
  **影响**：HTTP入口能改会话绑定/管理状态，工具身份正确不能独立证明共享部署隔离
  **进一步探讨**：核宿主路由认证及session-team写权限，按不同用户/目标会话而非不可猜ID判授权

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 派发/链/完成与重试真正保证什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

dispatchCore在进程内team锁下读快照，异步prepare先起成员，再同步SQLite事务写attempt/状态/事件/邮件，提交后渲染和唤醒。已有pending/running会拦重复派发，claim匹配副本行后发token；requireLiveAttempt核assignee、taskMemberId、running与token，改派吊销旧token后迟到报告不能直接改当前尝试。这是有实质状态机约束的执行接线。

依赖已撤硬闸，只排序提示；链是弱顺序，任意成员可追加/乱序派，frontier按成功站点推进。不能将DAG/链图宣传成前置完成或严格逐站审核保证。同成员跨主任务副本独立占用，没有全队总并发/模型请求预算。

complete只要求非空output并存changedPaths自报，标attempt succeeded；链所有站有成功才task completed、最后小任务可收组并续派下一棒。没有执行验收标准、核输出文件存在或独立审核结果，completed是协议报告完成。后续派发/唤醒失败不回滚已完成状态，邮件保留但无持续消费者时不等必送达。failTask立即同成员重试至maxRetries后wait领队，重试不核外部副作用是否已发生，idempotencyNote只是文案，不能承诺重复执行安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/runtime/assignment.ts:681-723](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L681-L723)

锁/先prepare后tx。

<details>
<summary>查看原文（43行）</summary>

```text
async function dispatchCore(
  env: RuntimeEnv,
  teamId: TeamKey,
  actor: Actor,
  /** 派发锚任务：captainFor 按本任务行快照解析主会话（v6，docs/51）。 */
  anchorTaskId: number,
  prepare: (team: TeamState, captain: Agent | undefined) => Promise<AssignmentPlan>,
  apply: (
    team: TeamState,
    tx: TeamTx,
    plan: AssignmentPlan,
    wakes: Wake[],
  ) => {
    task: TaskRecord;
    attempt: AttemptRecord;
  },
): Promise<{ team: TeamState; task: TaskRecord; attempt: AttemptRecord }> {
  const root = stateRootOf(env);
  return locks.withLock(teamLockKey(root, String(teamId)), async () => {
    const team = readTeamSync(root, teamId);
    if (team === undefined) {
      throw new ETeamsError(
        `团队「${String(teamId)}」不存在`,
        '用 eteams_team_status 查看当前团队，或先 eteams_create_team',
      );
    }
    const anchorTask = team.tasks.find((t) => t.id === anchorTaskId);
    const plan = await prepare(
      team,
      anchorTask === undefined ? undefined : await captainFor(env, team, anchorTask),
    );
    const wakes: Wake[] = [];
    const result = withTeamTx(root, team.id, (tx) => {
      const out = apply(team, tx, plan, wakes);
      writeTeamInTx(tx, team);
      return out;
    });
    renderTeamDocs(env.workspace, team, (msg) => env.ctx.logger.warn(msg));
    await runWakes(wakes);
    return { team, ...result };
  });
}

```

</details>

**依据 2 · 源码核查**：[src/host/runtime/assignment.ts:972-1030](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L972-L1030)

依赖弱闸/重复派/乱序。

<details>
<summary>查看原文（59行）</summary>

```text
  const task = requireTask(team, params.taskId);
  const isStation = task.chain.length > 0;
  if (params.forReassign !== true) {
    // 用户迭代 2026-09-11：draft/wait 已并入 ready，唯一可派发态就是 ready
    // （派发不再改状态——成员领取才 ready→start）。
    if (task.status !== 'ready') {
      throw new ETeamsError(
        `任务 ${task.id} 处于 ${task.status}，只能指派 ready 任务`,
        '检查任务状态，或用 eteams_reassign_task 改派',
      );
    }
    // 依赖不再拦截派发（用户 2026-09-14「闸门拦住去掉吧，不然任意调度时会出问题」）：
    // 依赖只作**排布提示**（面板执行序 subExecutionOrder 仍按兄弟依赖拓扑排），
    // 派发口不再按依赖拒绝——领队可任意顺序调度（有链任务按链当前站推进），
    // 是否等前置由领队判断，宿主不挡。
    // 父容器还在「创建中」（面板手动创建占位，docs/panelTaskCommission）：
    // 计划未定不派发——单任务路径与 eteams_assign_task 两条派发路径共此闸。
    if (task.parentId !== null) {
      const parent = team.tasks.find((t) => t.id === task.parentId);
      if (parent?.status === 'creating') {
        throw new ETeamsError(
          `主任务 ${parent.id} 创建中，等完善收口后再派发小任务 ${task.id}`,
        );
      }
    }
    // 防重复派发（用户迭代 2026-09-11「派发归入 start 语义」后新增）：派发不
    // 再改状态，`ready` 不再是「尚未派发」的充分判据——已有在办/待接取尝试
    // 就不允许再派一次（否则点两次「开始」/换人会叠出两条待接取）。
    const live = liveAttemptOf(task);
    if (live !== undefined) {
      throw new ETeamsError(
        `任务 ${task.id} 已有进行中的指派（${live.member}，attempt ${live.id}）`,
        '等该尝试接取/失败/婉拒，或用 eteams_reassign_task 改派',
      );
    }
  }
  const row = resolveAssigneeRow(team, task, params.member);
  // 占用判定（v7 副本行语义）：改派回原执行者时本任务自己的占用不算忙。
  assertNotBusy(row, params.forReassign === true ? task.id : undefined);
  // 弱顺序链（用户 2026-09-13）：成员不在链上即追加到链尾——指派任意在册成员
  // 都成立，不再要求 deviation_note（链只作「大致从前往后」的弱约束，成员可
  // 任意顺序执行）。已在链上则复用其既有站位，不重复追加。
  const stationIndex = ensureChainStation(task, row);
  await ensureSpawned(env, team, row, task, captain);
  return {
    task,
    row,
    isStation,
    stationIndex,
    kind: params.kind ?? (isStation ? 'stage' : 'initial'),
    ...((params.deviationNote ?? '').trim() !== ''
      ? { deviation: params.deviationNote!.trim() }
      : {}),
  };
}

/**
 * 确保成员在任务执行链上有站位（弱顺序链，用户 2026-09-13）：`isStation` 的
 * 任务里，成员不在链上就**追加到链尾**（站点引用 = 工号，无号退按名；空
```

</details>

**依据 3 · 源码核查**：[src/host/runtime/assignment.ts:1829-1874](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L1829-L1874)

claim token。

<details>
<summary>查看原文（46行）</summary>

```text
export async function claimTask(
  env: RuntimeEnv,
  team: TeamState,
  member: TaskMemberRecord,
  taskId: number,
): Promise<{ attempt: AttemptRecord; token: string; task: TaskRecord; inboxPreview: string[] }> {
  const out = await withTeam(env, team.id, (fresh, _root, tx) => {
    const task = requireTask(fresh, taskId);
    if (task.assignee !== member.name) {
      throw new ETeamsError(
        `任务 ${task.id} 未指派给你（当前：${task.assignee ?? '无'}）`,
        '用 eteams_task_board 查看你的任务',
      );
    }
    // 待接取尝试按副本行 id 精确匹配（同名成员各是各的 attempt）。
    const attempt = task.attempts.find(
      (a) =>
        a.status === 'pending_accept' &&
        (a.taskMemberId !== undefined ? a.taskMemberId === member.id : a.member === member.name),
    );
    if (attempt === undefined) {
      throw new ETeamsError(
        `任务 ${task.id} 没有待接取的指派`,
        'attempt 可能已被吊销；等待领队重新指派',
      );
    }
    requireMember(fresh, member.employeeId ?? member.name);
    const token = generateToken();
    attempt.status = 'running';
    attempt.token = token;
    attempt.claimedAt = tx.now;
    applyTransition(task, 'start', tx.now);
    member.nowTaskId = task.id;
    emit(tx, fresh.id, memberActor(member), 'attempt.claimed', {
      taskId: task.id,
      attemptId: attempt.id,
    });
    // 容器同步：小任务真跑起来了（start）→ 容器 start。
    syncGroupOfSubtaskInTx(tx, fresh, task);
    const box = memberBoxOf(member);
    const inbox = readBoxQuiet(env, fresh.id, box.box);
    const inboxPreview = inbox.slice(-5).map((m) => `[${m.kind}] ${m.content.slice(0, 160)}`);
    return { team: fresh, attempt, token, task, inboxPreview };
  });
  renderTeamDocs(env.workspace, out.team, (msg) => env.ctx.logger.warn(msg));
  return { attempt: out.attempt, token: out.token, task: out.task, inboxPreview: out.inboxPreview };
```

</details>

**依据 4 · 源码核查**：[src/host/runtime/assignment.ts:2201-2236](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L2201-L2236)

真实attempt校验。

<details>
<summary>查看原文（36行）</summary>

```text
function requireLiveAttempt(
  team: TeamState,
  row: TaskMemberRecord,
  params: { taskId: number; attemptId: number; token: string },
): { task: TaskRecord; attempt: AttemptRecord } {
  const task = requireTask(team, params.taskId);
  if (task.assignee !== row.name) {
    throw new ETeamsError(`任务 ${task.id} 未指派给你`, '只操作自己被指派的任务');
  }
  const attempt = task.attempts.find((a) => a.id === params.attemptId);
  const mine =
    attempt !== undefined &&
    (attempt.taskMemberId !== undefined
      ? attempt.taskMemberId === row.id
      : attempt.member === row.name);
  if (attempt === undefined || !mine) {
    throw new ETeamsError(
      `attempt ${params.attemptId} 不属于任务 ${task.id} 的当前执行`,
      'attempt 已吊销或不存在；重新查看 eteams_task_board',
    );
  }
  if (attempt.status !== 'running') {
    throw new ETeamsError(
      `attempt ${attempt.id} 状态为 ${attempt.status}，无法上报`,
      'attempt 已被吊销（改派/取消/挂起），所有权已变更；停止操作并等待新指派',
    );
  }
  if (attempt.token === '' || params.token !== attempt.token) {
    throw new ETeamsError(
      'token 校验失败',
      'attempt 已吊销，所有权已变更；用 eteams_task_board 确认状态并等待领队指令',
    );
  }
  return { task, attempt };
}

```

</details>

**依据 5 · 源码核查**：[src/host/runtime/assignment.ts:1961-2041](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L1961-L2041)

自报成功/收口。

<details>
<summary>查看原文（81行）</summary>

```text
    const { task, attempt } = requireLiveAttempt(fresh, member, params);
    const output = params.output.trim();
    if (output === '')
      throw new ETeamsError('完成产出说明不能为空', 'output 写清做了什么、改了哪些文件、如何验证');
    attempt.status = 'succeeded';
    attempt.endedAt = tx.now;
    attempt.result = { output, changedPaths: params.changedPaths };
    freeMember(fresh, task);
    const isStation = task.chain.length > 0;
    const wakes: Wake[] = [];
    // 弱顺序链推进（用户 2026-09-13）：frontier = 链上最靠前、尚无成功尝试的
    // 站点。还有未跑站点 → 中间站（任务回 ready，等领队从 frontier 续派）；
    // 全部站点都有成功尝试 → 收口。顺序接力场景与旧的「下一站」口径逐位一致；
    // 乱序/追加派发时不会误收口，而是**继续把剩余站点跑完**。
    const frontier = chainFrontier(task.chain.length, task.attempts);
    if (isStation && frontier < task.chain.length) {
      task.chainCursor = frontier - 1; // 使 nextChainStation = 最靠前的未跑站
      const next = task.chain[frontier]!;
      applyTransition(task, 'ready', tx.now);
      emit(tx, fresh.id, memberActor(member), 'task.stage_completed', {
        taskId: task.id,
        attemptId: attempt.id,
        payload: { station: attempt.stationIndex, next: next.member },
      });
      wakes.push(
        notifyCaptainInTx(
          tx,
          env,
          fresh,
          reportCompletedMail(task, {
            member: member.name,
            attemptId: attempt.id,
            isFinalStation: false,
            output,
            changedPaths: params.changedPaths,
            nextStation: next.member,
            nextStageBrief: next.stageBrief,
          }),
          { taskId: task.id, attemptId: attempt.id },
        ),
      );
      // 容器同步：中间站完成即回 ready（等领队推进下一站），无在办小任务时
      // 容器退回 ready（面板「开始」钮回来）。
      syncGroupOfSubtaskInTx(tx, fresh, task);
      return { team: fresh, task, done: false, wakes, actor: memberActor(member) };
    }
    // Final station or chainless: task completed (docs/35 §5#10：产出不落列，
    // 反查 attempts 最新成功行)。走到这里 = 无链，或链上所有站点都有成功尝试。
    const final = isStation;
    // 终站完成：cursor 记末站下标（进度口径 cursor+1 = 全长；docs/26 链语义）。
    if (isStation) task.chainCursor = task.chain.length - 1;
    applyTransition(task, 'completed', tx.now);
    task.completedAt = tx.now;
    emit(tx, fresh.id, memberActor(member), 'task.completed', {
      taskId: task.id,
      attemptId: attempt.id,
      payload: { output, changedPaths: params.changedPaths, isStation, final: final || !isStation },
    });
    // docs/26：组任务收口——末个小任务完成且全组 completed 时自动落组状态。
    completeGroupIfDoneInTx(tx, fresh, memberActor(member), task);
    // 容器同步：小任务完成收工，若无其他在办小任务 → 容器退回 ready（未收口
    // 时）；已全完成的收口在上一行落 completed，本同步对终态短路。
    syncGroupOfSubtaskInTx(tx, fresh, task);
    wakes.push(
      notifyCaptainInTx(
        tx,
        env,
        fresh,
        reportCompletedMail(task, {
          member: member.name,
          attemptId: attempt.id,
          isFinalStation: true,
          output,
          changedPaths: params.changedPaths,
        }),
        { taskId: task.id, attemptId: attempt.id },
      ),
    );
    return { team: fresh, task, done: true, wakes, actor: memberActor(member) };
  });
  renderTeamDocs(env.workspace, out.team, (msg) => env.ctx.logger.warn(msg));
```

</details>

**依据 6 · 源码核查**：[src/host/runtime/assignment.ts:2042-2064](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L2042-L2064)

后续失败warn。

<details>
<summary>查看原文（23行）</summary>

```text
  // 二十七轮 DA40 链式执行（用户「整体开始，所有小任务链式执行」）：小任务
  // 完成（终站收口）即以完成成员名义续派组内下一棒（复用整体开始同一派发
  // 核——一次只发一棒，按组内执行序找下一张可跑 ready 小任务），失败只记
  // 日志，不回滚也不吞掉成员的完成应答。组在本帧已收口（全组 completed）
  // 时不再续（终态守卫也拦，这里直接免调用）。
  if (out.done && out.task.parentId !== null) {
    const parent = out.team.tasks.find((t) => t.id === out.task.parentId);
    if (
      parent !== undefined &&
      parent.parentId === null &&
      !['completed', 'cancelled'].includes(parent.status)
    ) {
      try {
        await startGroupTask(env, { teamId: team.id, actor: out.actor }, out.task.parentId);
      } catch (error) {
        env.ctx.logger.warn(`链式续派失败：${String(error)}`);
      }
    }
  }
  await runWakes(out.wakes);
  return { task: out.task, done: out.done };
}

```

</details>

**依据 7 · 源码核查**：[src/host/runtime/assignment.ts:2073-2159](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L2073-L2159)

即刻重试/分诊。

<details>
<summary>查看原文（87行）</summary>

```text
    const { task, attempt } = requireLiveAttempt(fresh, member, params);
    const wakes: Wake[] = [];
    attempt.status = 'failed';
    attempt.endedAt = tx.now;
    attempt.error = params.error.trim();
    freeMember(fresh, task);
    task.retryCount += 1;
    // 重试上限读全局配置（docs/35 §3#3：maxRetries 不再随队）。
    const maxRetries = env.config.maxRetries;
    if (task.retryCount <= maxRetries) {
      // 立即同成员重试（docs/35 §5#8）：归位 ready（原 wait 已撤销——用户
      // 迭代 2026-09-11「重试排队」并入 ready）。
      // 重试贴在**同一站**（弱顺序链，用户 2026-09-13）：乱序重试不会被重算成
      // chainCursor+1 而贴错站。
      const retryStation = task.chain[attempt.stationIndex];
      const retry = makeAttempt(tx, task, {
        kind: 'retry',
        member: member.name,
        ...(member.id > 0 ? { taskMemberId: member.id } : {}),
        stationIndex: attempt.stationIndex,
      });
      applyTransition(task, 'ready', tx.now);
      task.assignee = member.name;
      member.nowTaskId = task.id;
      emit(tx, fresh.id, memberActor(member), 'task.retrying', {
        taskId: task.id,
        attemptId: attempt.id,
        payload: { retryCount: task.retryCount, maxRetries },
      });
      wakes.push(
        sendAssignmentInTx(env, tx, fresh, member, task, retry.id, {
          ...(retryStation !== undefined ? { stageBrief: retryStation.stageBrief } : {}),
          ...(task.chain.length > 0 ? { stationIndex: attempt.stationIndex } : {}),
          handoff: `重试 ${task.retryCount}/${maxRetries}。上次失败：${attempt.error}`,
        }),
      );
      // 容器同步：重试已重新派发（新在办尝试）→ 容器保持/回到 start。
      syncGroupOfSubtaskInTx(tx, fresh, task);
      return { team: fresh, task, retried: true, retryCount: task.retryCount, maxRetries, wakes };
    }
    // 自动重试超限 → wait（待领队分诊，用户迭代 2026-09-11）：领队收到失败
    // 汇报后分诊——小 bug 直接 reassign 重新派人 loop；流程/环境问题用
    // escalate 升级为 wait_user 问用户。不再开 DecisionRecord（那是「待用户」
    // 的载体，这里先交领队）。
    applyTransition(task, 'wait', tx.now);
    emit(tx, fresh.id, memberActor(member), 'task.wait', {
      taskId: task.id,
      attemptId: attempt.id,
      payload: { retryCount: task.retryCount },
    });
    // 容器同步：失败落 wait（无在办）→ 容器退回 ready（待领队分诊的卡片
    // 挂着，容器不再假装在执行）。
    syncGroupOfSubtaskInTx(tx, fresh, task);
    wakes.push(
      notifyCaptainInTx(
        tx,
        env,
        fresh,
        reportFailedMail(task, {
          member: member.name,
          attemptId: attempt.id,
          error: attempt.error,
          willRetry: false,
          retryCount: task.retryCount,
          maxRetries,
        }),
        { taskId: task.id, attemptId: attempt.id },
      ),
    );
    return {
      team: fresh,
      task,
      retried: false,
      retryCount: task.retryCount,
      maxRetries,
      wakes,
    };
  });
  renderTeamDocs(env.workspace, out.team, (msg) => env.ctx.logger.warn(msg));
  await runWakes(out.wakes);
  return {
    task: out.task,
    retried: out.retried,
    retryCount: out.retryCount,
    maxRetries: out.maxRetries,
  };
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · SQLite与重启对账解决什么，还遗漏什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

状态/事件/邮箱同BEGIN IMMEDIATE同步事务提交，抛错ROLLBACK，避免一个任务状态写了但同库事件没写的普通半步；WAL/NORMAL/busy_timeout3000，外键OFF，引用完整性由代码维护。进程内team FIFO锁拒绝也不毒化后续，是可靠性优点。但锁不是跨进程业务锁，dispatch在锁内await spawn后用旧team入事务，多host共享库虽SQLite写串行，也不能自动防旧快照覆盖。spawn成功到事务提交之间崩溃/写失败有外部会话已建、状态未登记窗口，没有见该帧自动dispose补偿；DB事务不回滚Agent创建和文件操作。

对账以agents.list活集合与DB在办attempt比较，缺会话且时长>=60s则撤销/paused，不把重启误当任务成功。只有启动立即与1/3/6/10s快扫，之后无周期；若启动时尝试年龄小于50s且没有新事件，全部快扫仍在宽限期，之后不会等到60s再扫，可能持续残留running。agents服务异常返回空集合，也可能把其实活的旧尝试误挂起。测试分别验证grace和不轮询，不覆盖二者组合的最终再判定。

因此已有持久状态与恢复诊断有价值，但不能称任意崩溃自动接续或正好一次执行。恢复应核活会话/已发生文件及外部动作，不仅看task卡。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/state/store.ts:110-143](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/state/store.ts#L110-L143)

事务。

<details>
<summary>查看原文（34行）</summary>

```text
export interface TeamTx {
  db: DatabaseSync;
  /** 事务所属团队（建队等发号场景为 undefined）。 */
  teamId?: number;
  /** 事务开始时刻（同一事务内所有 update_time 用它，保持一致）。 */
  now: number;
}

/**
 * Run `fn` inside one synchronous BEGIN IMMEDIATE … COMMIT transaction.
 * Anything thrown inside triggers ROLLBACK and rethrows; `fn` must not await.
 */
export function withTeamTx<T>(
  stateRoot: string,
  teamId: number | undefined,
  fn: (tx: TeamTx) => T,
): T {
  const db = getDb(stateRoot);
  ensureWorkspaceReady(stateRoot, db);
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn({ db, teamId, now: Date.now() });
    db.exec('COMMIT');
    return result;
  } catch (error) {
    try {
      db.exec('ROLLBACK');
    } catch {
      // 事务已自动回滚：清理动作本身失败不必掩盖原异常
    }
    throw error;
  }
}

```

</details>

**依据 2 · 源码核查**：[src/host/state/db.ts:147-169](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/state/db.ts#L147-L169)

连接/WAL配置。

<details>
<summary>查看原文（23行）</summary>

```text
  .DatabaseSync as typeof DatabaseSync;

// --------------------------------------------------------------------------
// 连接缓存：同进程每个状态根一条连接（单写者 + 全同步调用，语句不会交错）。
// --------------------------------------------------------------------------
const connections = new Map<string, DatabaseSync>();

/**
 * 取（或建）该状态根的连接：首次调用建目录、开库、设 PRAGMA 并执行 DDL
 * （全部 `IF NOT EXISTS`，重复执行幂等）；此后直接复用。
 */
export function getDb(stateRoot: string): DatabaseSync {
  const cached = connections.get(stateRoot);
  if (cached !== undefined) return cached;
  mkdirSync(dbDirOf(stateRoot), { recursive: true });
  const db = new DatabaseSyncCtor(dbFileOf(stateRoot));
  // 连接初始化（docs/27 §27.3）：WAL 单写多读 / NORMAL 崩溃最多丢最后一个
  // 事务 / 短暂持锁（杀软、索引器）时等待而非立即报错。外键保持默认 OFF
  // ——本设计不用外键，级联与引用完整性由写入代码负责。
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA synchronous = NORMAL;');
  db.exec('PRAGMA busy_timeout = 3000;');
  // v3 迁移先行：旧库把 roles/member 改名让位后，下方 DDL 才能建出新形状
```

</details>

**依据 3 · 源码核查**：[src/host/state/lock.ts:1-42](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/state/lock.ts#L1-L42)

本地锁。

<details>
<summary>查看原文（42行）</summary>

```text
/**
 * Process-local async mutexes (docs/09.3): per-team serialization. Locks are
 * keyed promise chains — no cross-process file locking (single-writer
 * assumption, NFR-03). Tails are retained per key (bounded by the number of
 * teams ever seen in this process); a throwing fn never poisons the chain.
 *
 * @module dsh-eteams/state/lock
 */

/** Keyed promise-chain mutex registry. */
export class LockMap {
  private readonly tails = new Map<string, Promise<unknown>>();

  /**
   * Run `fn` while holding the lock for `key`; concurrent callers queue FIFO.
   * @param key - lock key (`team:<root>:<id>`).
   * @param fn - the critical section.
   */
  async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const previous = this.tails.get(key) ?? Promise.resolve();
    const gated = previous.then(
      () => undefined,
      () => undefined,
    );
    const release = (async () => {
      await gated;
      return await fn();
    })();
    // Tail settles regardless of fn's outcome so the chain never rejects.
    const tail = release.then(
      () => undefined,
      () => undefined,
    );
    this.tails.set(key, tail);
    return release;
  }

  /** Test helper: number of tracked lock keys. */
  get size(): number {
    return this.tails.size;
  }
}
```

</details>

**依据 4 · 源码核查**：[src/host/runtime/assignment.ts:701-719](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L701-L719)

spawn先于入库。

<details>
<summary>查看原文（19行）</summary>

```text
    if (team === undefined) {
      throw new ETeamsError(
        `团队「${String(teamId)}」不存在`,
        '用 eteams_team_status 查看当前团队，或先 eteams_create_team',
      );
    }
    const anchorTask = team.tasks.find((t) => t.id === anchorTaskId);
    const plan = await prepare(
      team,
      anchorTask === undefined ? undefined : await captainFor(env, team, anchorTask),
    );
    const wakes: Wake[] = [];
    const result = withTeamTx(root, team.id, (tx) => {
      const out = apply(team, tx, plan, wakes);
      writeTeamInTx(tx, team);
      return out;
    });
    renderTeamDocs(env.workspace, team, (msg) => env.ctx.logger.warn(msg));
    await runWakes(wakes);
```

</details>

**依据 5 · 源码核查**：[src/host/runtime/reconcile.ts:38-75](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/reconcile.ts#L38-L75)

定时/活集合异常。

<details>
<summary>查看原文（38行）</summary>

```text
 * 进程内的「用户点停止 / 回合异常结束」都有 `turn/end` 事件、由中断观察者
 * （interruption.ts）实时处置；本模块只负责服务重启后**没有事件可依**的那批残留，
 * 启动对账一次即可，无需常驻轮询。
 */
const BOOT_SWEEP_DELAYS_MS = [1_000, 3_000, 6_000, 10_000];
/** 宽限期：在办时长不足此值不判死（给 spawn/冷恢复留窗口；用户 2026-09-18 拍板 60s）。 */
const GRACE_MS = 60_000;

let logger: RuntimeLogger | undefined;
let bootTimers: ReturnType<typeof setTimeout>[] = [];
let lastWarnAt = 0;

function warnThrottled(message: string): void {
  const at = Date.now();
  if (at - lastWarnAt < 60_000) return;
  lastWarnAt = at;
  logger?.warn(message);
}

/** 宿主活 agent 注册表的最小面（inject `agents`，cordis Service）。 */
interface LiveAgentsFace {
  list(): { id: unknown }[];
}

/**
 * 当前活 agent 的会话 id 集合（宿主权威存活信号）：重启后必然为空。方法**带
 * 接收者**调用（cordis 服务方法依赖 `this`）；服务缺失/异常一律当空集合。
 */
export function liveAgentIds(ctx: unknown): Set<string> {
  const agents = (ctx as { agents?: LiveAgentsFace }).agents;
  try {
    const list = agents?.list?.();
    if (!Array.isArray(list)) return new Set();
    return new Set(list.map((a) => String(a.id)));
  } catch {
    return new Set();
  }
}
```

</details>

**依据 6 · 源码核查**：[src/host/runtime/reconcile.ts:98-136](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/reconcile.ts#L98-L136)

grace过滤。

<details>
<summary>查看原文（39行）</summary>

```text
    let rows: InFlightAttemptRow[];
    try {
      rows = listInFlightAttempts(root);
    } catch (error) {
      warnThrottled(`eteams reconcile: 读取在办尝试失败（跳过本轮）：${String(error)}`);
      continue;
    }
    if (rows.length === 0) continue;
    const byTeam = new Map<number, InFlightAttemptRow[]>();
    for (const row of rows) {
      const bucket = byTeam.get(row.teamId);
      if (bucket === undefined) byTeam.set(row.teamId, [row]);
      else bucket.push(row);
    }
    const env: RuntimeEnv = {
      ctx: ctx as unknown as RuntimeContext,
      config,
      workspace: workspacePath,
    };
    for (const [teamId, attempts] of byTeam) {
      const team = readTeamSync(root, teamId);
      if (team === undefined) continue;
      for (const row of attempts) {
        // 宽限期：刚派出/冷恢复在途的会话可能还没在册，不判死。
        if (now - row.since < graceMs) continue;
        const sessionId = sessionIdOfAttempt(team, row);
        // 会话仍活着（含驻留 idle 的子代理）→ 真有工作在办，不动。
        if (sessionId !== '' && live.has(sessionId)) continue;
        try {
          const hit = await pauseTaskOnDeadSession(env, teamId, row.taskId);
          if (hit !== undefined) paused += 1;
        } catch (error) {
          warnThrottled(`eteams reconcile: 挂起任务失败：${String(error)}`);
        }
      }
    }
  }
  return paused;
}
```

</details>

**依据 7 · 源码核查**：[src/host/runtime/reconcile.ts:143-160](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/reconcile.ts#L143-L160)

仅快扫。

<details>
<summary>查看原文（18行）</summary>

```text
    void reconcileDeadSessions(ctx, config).catch((error) =>
      warnThrottled(`eteams reconcile: 对账失败（不影响会话）：${String(error)}`),
    );
  };
  // 启动立即跑一轮（重启前的会话全不在册）；此时 workspaceRegistry 往往未就绪 →
  // collectRoots 返回空、本轮 no-op，故紧接着补几轮快扫（见 BOOT_SWEEP_DELAYS_MS），
  // 注册表一就绪即生效。此后不再排期——进程内的中断由中断观察者按事件处置。
  run();
  for (const delay of BOOT_SWEEP_DELAYS_MS) {
    const handle = setTimeout(run, delay);
    // 绝不影响宿主退出：宿主进程不因这些 timer 被拖着不走。
    (handle as { unref?: () => void }).unref?.();
    bootTimers.push(handle);
  }
}

function clearBootTimers(): void {
  for (const handle of bootTimers) clearTimeout(handle);
```

</details>

**依据 8 · 源码核查**：[tests/reconcile.test.ts:169-200](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/tests/reconcile.test.ts#L169-L200)

live/grace断言。

<details>
<summary>查看原文（32行）</summary>

```text
  it('活集合为空（重启）→ 吊销 attempt、小任务挂起、容器同步挂起、留痕 session.dead', async () => {
    const teamId = seedTeam();
    const paused = await reconcileDeadSessions(fakeCtx([]), config, { graceMs: 0 });
    expect(paused).toBe(1);

    const team = readTeamSync(root, teamId)!;
    const sub = team.tasks.find((t) => t.id === SUB_TASK_ID)!;
    expect(sub.status).toBe('paused');
    expect(sub.attempts[0]!.status).toBe('revoked');
    // 容器由「有在办小任务」派生：小任务挂起后主任务同步挂起（用户迭代 2026-09-11）。
    expect(team.tasks.find((t) => t.id === GROUP_TASK_ID)!.status).toBe('paused');

    const suspended = readEventsSync(root, teamId).find((e) => e.type === 'task.suspended');
    expect(suspended).toBeDefined();
    expect((suspended!.payload as Record<string, unknown>).via).toBe('session.dead');
  });

  it('会话仍在活集合里 → 不判死、状态不动', async () => {
    const teamId = seedTeam();
    const paused = await reconcileDeadSessions(fakeCtx([MEMBER_SESSION]), config, { graceMs: 0 });
    expect(paused).toBe(0);
    const team = readTeamSync(root, teamId)!;
    expect(team.tasks.find((t) => t.id === SUB_TASK_ID)!.status).toBe('start');
    expect(team.tasks.find((t) => t.id === SUB_TASK_ID)!.attempts[0]!.status).toBe('running');
  });

  it('宽限期内（在办时长 < graceMs）→ 即使不在活集合里也不动', async () => {
    const teamId = seedTeam();
    // since = 1（远古），用「现在就是 since」模拟刚派出：now - since = 0 < grace。
    const paused = await reconcileDeadSessions(fakeCtx([]), config, { graceMs: 1_000, now: 1 });
    expect(paused).toBe(0);
    expect(readTeamSync(root, teamId)!.tasks.find((t) => t.id === SUB_TASK_ID)!.status).toBe('start');
```

</details>

**依据 9 · 源码核查**：[tests/reconcile.test.ts:229-240](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/tests/reconcile.test.ts#L229-L240)

无周期断言。

<details>
<summary>查看原文（12行）</summary>

```text
  it('install 只排启动快扫、不设常驻周期（用户 2026-09-18「去掉轮询」）', () => {
    const intervalSpy = vi.spyOn(globalThis, 'setInterval');
    const timeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    installDeadSessionReconciler(fakeCtx([]), config);
    // 启动快扫确实排了 timer（证明 spy 生效）……
    expect(timeoutSpy).toHaveBeenCalled();
    // ……但没有任何常驻周期扫描。
    expect(intervalSpy).not.toHaveBeenCalled();
    intervalSpy.mockRestore();
    timeoutSpy.mockRestore();
  });
});
```

</details>

#### 缺口

- 宿主startContinuable接受与DB提交之间的可恢复映射，以及启动grace后最终再判定
  **影响**：可能有孤儿会话或旧running残值，不能承诺自动接续和安全重试
  **进一步探讨**：核spawn后提交失败/崩溃与年龄<50s后无事件反例，持久记录外部受理身份并延迟补判

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工作目录、产物和删除可否当隔离与原子恢复？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

task.workDir冻结建任务时当前会话目录，一个主任务共享teams/<id>-slug，简报给出工程/留言板/纪要/文档绝对路径，降低成员自行猜路径与跨工作区漂移；docs是派生视图，留言板create-only、纪要分宿主合同与模型正文。该布局不是每成员worktree/sandbox，所有成员和其它进程仍可能写同项目/共享文件，依宿主工具权限和人为分工。

固定bundle stateDir硬编码C:/Users/epat/.eteams，优先于config默认.eteams；跨工作区共单库。作者Windows路径不是每位用户的数据根，首次必须审查/改成自己可写目录；POSIX上自定义绝对判据识别盘符，不保证node:path对盘符同Windows行为。workRoot配置存在，但docs用固定WORK_ROOT=teams，不把它当已有效任意路径设置。

删除未开始主任务会级联元数据/副本并在DB事务内rmTree任务目录，失败warn仍可提交删除；反过来rmTree已成功后后续DB错误回滚不会复原文件。rmTree用Dirent.isDirectory，普通符号链接本体unlink不递归，这一点不应夸大为必跟随链接，但目标根/父路径无物理路径租约仍有竞争。docs渲染失败亦只warn，卡片状态完成不代表材料齐全。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/runtime/docs.ts:63-129](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/docs.ts#L63-L129)

工作根/固定目录。

<details>
<summary>查看原文（67行）</summary>

```text
}

/**
 * 任务的工作根（绝对）：任务自带的 `work_dir` 就是建任务时冻结的**当前会话
 * 目录**——任务目录挂在哪从此由任务行自己说了算，不再随之后是谁在调用而漂移
 * （全局单库下同一个任务曾在多个工作区各物化一份的根因）。
 *
 * 旧行两列不齐（`work_dir` 是旧语义的相对值、或为空）时回退调用方工作区：这类
 * 行不参与物化（{@link isCurrentLayout} 判旧），此处只给面板显示/删除一个不炸的
 * 基址。
 */
export function taskWorkRootOf(workspace: string, team: TeamState, task: TaskRecord): string {
  const dir = rootTaskOf(team, task).workDir;
  return dir !== undefined && isAbsolutePath(dir) ? dir : workspace;
}

/**
 * 主任务目录（**相对 work_dir**，新规则纯派生）：`teams/<主任务号>-<slug>`。
 * 小任务不再有自己的目录——主任务与小任务同根（用户 2026-09-15
 * 「不需要这么细」）。
 */
export function taskRootDirRel(team: TeamState, task: TaskRecord): string {
  return `${WORK_ROOT}/${taskSlug(rootTaskOf(team, task))}`;
}

/** Absolute 主任务目录（新规则：基址 = 任务自己的 work_dir）。 */
export function taskRootDirAbs(workspace: string, team: TeamState, task: TaskRecord): string {
  return join(taskWorkRootOf(workspace, team, task), taskRootDirRel(team, task));
}

/**
 * 任务目录（相对 work_dir，面板显示 / 工具输出 / 打开文件夹）：建任务时分配
 * 的 `task_dir` 按字面返回（改主题后由 assignment.renameTaskFolder 重算），未
 * 分配则派生到主任务根。小任务没有自己的目录，上溯主任务。
 */
export function taskDirRel(team: TeamState, task: TaskRecord): string {
  const root = rootTaskOf(team, task);
  return root.taskDir ?? taskRootDirRel(team, root);
}

/** Absolute task folder for one task（基址 = 任务自己的 work_dir）。 */
export function taskDirAbs(workspace: string, team: TeamState, task: TaskRecord): string {
  return join(taskWorkRootOf(workspace, team, task), taskDirRel(team, task));
}

/**
 * 组目录（主任务目录）绝对路径——留言板 / 纪要 / 计划 / 文档都挂在这里。
 */
export function groupDirAbs(workspace: string, team: TeamState, task: TaskRecord): string {
  return taskDirAbs(workspace, team, rootTaskOf(team, task));
}

/**
 * 该任务是否参与物化：只有「主任务 + work_dir / task_dir 都已分配 + task_dir
 * 与当前规则相符」才算。两列不齐（旧库按「不管之前的任务」不回填）与旧布局
 * （`…/tasks/…`、`…/sub/…`）一律 false —— 不建目录、不写文件、不迁移。
 */
export function isCurrentLayout(team: TeamState, task: TaskRecord): boolean {
  if (task.parentId !== null) return false;
  if (task.workDir === undefined || task.taskDir === undefined) return false;
  return task.taskDir === taskRootDirRel(team, task);
}

/** 纪要文件名：`<任务号>-<slug>.纪要.md`。 */
export function minutesFileName(task: TaskRecord): string {
  return `${taskSlug(task)}${MINUTES_SUFFIX}`;
}
```

</details>

**依据 2 · 源码核查**：[src/host/runtime/members.ts:109-129](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/members.ts#L109-L129)

任务简报路径。

<details>
<summary>查看原文（21行）</summary>

```text
 * 通用成员简报组装（用户迭代 2026-09-11；2026-09-14 增队伍留言板；2026-09-15
 * 扁平化）：runtime 侧现读五个绝对路径——工程根（task.work_dir，建任务时冻结的
 * 当前会话目录，代码产出写这里）、任务目录（groupDirAbs，一个主任务一个目录）、
 * 队伍留言板（boardFileAbs）、本任务纪要（minutesFileAbs）、文档目录
 * （docDirAbs）——连同领队名（班底 is_leader 行，无领队时是主会话）交给纯文本
 * memberBriefing。出生包与每次指派信共用，保证「工作目录 / 留言板 / 纪要 /
 * 文档 / 领队 / 三节点汇报」始终在成员上下文里，且路径全部由宿主算好（模型照抄、
 * 不自己拼名字、不新建重复文件）。
 *
 * 工程根取任务自己的 work_dir 而非调用方工作区（2026-09-16 归属拆分）：成员看到
 * 的目录因此与任务绑定、不随领队/成员子会话开在哪个工作区而变（此前成员简报会
 * 把别的工作区当工程根，成员照它写代码就写错了地方）。
 */
export function taskBriefing(env: RuntimeEnv, team: TeamState, task: TaskRecord): string {
  const leader = team.hasLeader
    ? (team.members.find((m) => m.isLeader === true)?.name ?? '领队')
    : '主会话（用户对话窗口）';
  return memberBriefing({
    teamName: team.name,
    leaderName: leader,
    projectRoot: taskWorkRootOf(env.workspace, team, task),
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:17-29](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/cordis.patch.yml#L17-L29)

固定个人状态路径。

<details>
<summary>查看原文（13行）</summary>

```text
        # 状态根（用户迭代 2026-09-04 全局单库）：绝对路径 = 所有工作区共用
        # 这一个根——一个 eteams.db、一份成员库、一份用量台账；相对路径 =
        # per-workspace（<workspace>/<stateDir>，旧口径）。
        stateDir: C:/Users/epat/.eteams
        # Task working directory root: `<workspace>/<workRoot>/<主任务号>-slug/`
        # (一个主任务一个目录：留言板.md + <任务号>-slug.纪要.md + 计划/ + 文档/).
        workRoot: teams
        # Hard cap on concurrently existing members per team.
        maxMembers: 20
        # Same-member auto-retry budget before a task fails hard (D6).
        maxRetries: 3
        # Provider used to spawn member subagents ('spawn' or 'fork').
        memberProvider: spawn
```

</details>

**依据 4 · 源码核查**：[src/host/runtime/base.ts:147-160](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/base.ts#L147-L160)

绝对状态判据。

<details>
<summary>查看原文（14行）</summary>

```text
export function stateRootFor(
  config: Pick<ETeamsResolvedConfig, 'stateDir'>,
  workspacePath: string,
): string {
  const dir = config.stateDir;
  if (/^[a-zA-Z]:[\\/]/.test(dir) || dir.startsWith('\\\\') || dir.startsWith('/')) {
    return dir.replace(/[\\/]+$/, '');
  }
  return joinPath(workspacePath, dir);
}

/** Absolute state root for an env（绝对 stateDir 时即全局根，见 stateRootFor）。 */
export function stateRootOf(env: RuntimeEnv): string {
  return stateRootFor(env.config, env.workspace);
```

</details>

**依据 5 · 源码核查**：[src/host/runtime/assignment.ts:571-639](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L571-L639)

DB内目录删除。

<details>
<summary>查看原文（69行）</summary>

```text
export async function deleteTask(env: RuntimeEnv, who: OpActor, taskId: number): Promise<void> {
  const out = await withTeam(env, who.teamId, (team, _root, tx) => {
    const task = requireTask(team, taskId);
    if (!['creating', 'ready'].includes(task.status))
      throw new ETeamsError(
        `任务 ${task.id} 处于 ${task.status}，只能删除未开始（creating/ready）任务`,
      );
    const doomed = [task, ...team.tasks.filter((t) => t.parentId === task.id)];
    for (const sub of doomed.slice(1)) {
      if (sub.status !== 'ready')
        throw new ETeamsError(
          `小任务 ${sub.id} 处于 ${sub.status}，主任务不能级联删除`,
          '先处理（删除）该小任务，或等它完成',
        );
    }
    const doomedIds = new Set(doomed.map((t) => t.id));
    for (const other of team.tasks) {
      if (doomedIds.has(other.id)) continue;
      if (other.dependencies.some((dep) => doomedIds.has(dep))) {
        throw new ETeamsError(`任务 ${task.id} 被其他任务依赖`, '先移除下游任务的依赖');
      }
    }
    // 被删任务的开放决策随任务作废（docs/27 decisions 只存 open 行）。
    for (const decision of team.pendingDecisions) {
      if (decision.status === 'open' && doomedIds.has(decision.taskId)) {
        decision.status = 'resolved';
        decision.resolvedAt = tx.now;
        decision.note = 'task deleted';
      }
    }
    // 指向被删任务的实例行 now_task_id 清空（在办行一并松绑）。
    for (const row of team.taskMembers) {
      if (row.nowTaskId !== null && doomedIds.has(row.nowTaskId)) {
        row.nowTaskId = null;
      }
    }
    // 副本行级联删（v7 决策 5）：副本行生命周期跟随所属大任务；有子会话的
    // 行提交后先打断进行中的回合、再 drain 驻留（removeMember 同口径，会话
    // 记录随父会话回收）。
    const drained: string[] = [];
    const interrupted: TaskMemberRecord[] = [];
    team.taskMembers = team.taskMembers.filter((row) => {
      if (row.mainTaskId === null || !doomedIds.has(row.mainTaskId)) return true;
      interrupted.push(row);
      if (row.sessionId !== '') drained.push(row.sessionId);
      return false;
    });
    // 只有主任务有目录（用户 2026-09-15 扁平化）：删单个小任务不得连带删掉
    // 整个组的目录（留言板/纪要/计划/文档都在那）。
    const dir = task.parentId === null ? taskDirAbs(env.workspace, team, task) : undefined;
    team.tasks = team.tasks.filter((t) => !doomedIds.has(t.id));
    emit(tx, team.id, who.actor, 'task.deleted', {
      taskId: task.id,
      payload: {
        subject: task.subject,
        ...(doomed.length > 1 ? { cascade: doomed.map((t) => t.id) } : {}),
        ...(drained.length > 0 ? { drainedReplicas: drained.length } : {}),
      },
    });
    if (dir !== undefined && existsSync(dir)) {
      try {
        rmTree(dir);
      } catch (error) {
        env.ctx.logger.warn(`eteams: 任务文件夹删除失败（不阻塞状态）：${String(error)}`);
      }
    }
    return { team, drained, interrupted };
  });
  renderTeamDocs(env.workspace, out.team, (msg) => env.ctx.logger.warn(msg));
```

</details>

**依据 6 · 源码核查**：[src/host/runtime/teamOps.ts:942-952](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/teamOps.ts#L942-L952)

手动后序删除。

<details>
<summary>查看原文（11行）</summary>

```text
export function rmTree(target: string): void {
  for (const entry of readdirSync(target, { withFileTypes: true })) {
    const child = join(target, entry.name);
    if (entry.isDirectory()) {
      rmTree(child);
    } else {
      unlinkSync(child);
    }
  }
  rmdirSync(target);
}
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 角色、模型与人类交接分别依什么机制？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

角色手册通过systemPrompt段和spawn persona注入，成员路线读班底modelRoute，无覆盖时pin宿主当前默认，provider与spawn/fork传输分开。这是可配置多角色协作，不是自带注册多个官方preset，也没有证明不同模型一定增益。角色文本插值转义减少{{变量}}破坏装配，模型仍可误解任务。

/eteam真实用户命令开角色构建流程；子Agent问答通过eteams_ask_user调用宿主userQuestions，按用户是否看提问子会话/主对话是否在线选择落点，先落pending意图再等待答复，答后存answered，失败cancel并返回degraded提示。可追踪问答归属比散落聊天强，但依赖宿主userQuestions真实人类输入/目标授权；问询列表与skip本身不证明批准。

能力缺口报告的risk/verdict由遇拒子Agent自己判，宿主做确定性高风险拒绝、常设路线和同操作去重再落表，并非独立模型二次审查/自动可信权限提升。必须把建议换法/路线治理与底层宿主权限分开；本轮只核模块职责和核心选择路径，未完整审计所有风险分类规则。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/runtime/members.ts:153-185](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/members.ts#L153-L185)

persona/模型。

<details>
<summary>查看原文（33行）</summary>

```text
): Promise<string> {
  const template = memberTemplateOf(team, row.employeeId ?? row.name);
  const persona = template?.persona;
  // 人设手册全文（docs/36 建议 4）：personaMd 有烘全文时用它，结构字段不
  // 再渲染进 persona；无手册（旧数据）退回 executionPrompt，再缺则用
  // prompts/personas 的兜底人设（文本原样，2026-09-12 归位人设平面）。进
  // persona 前经 neutralizeInterpolation 转义——宿主对系统提示段做严格
  // {{变量}} 插值，用户 md 里的花括号引用会让整段装配抛错（sessionPersona
  // band 同口径）。
  const personaText = neutralizeInterpolation(
    persona?.personaMd !== undefined && persona.personaMd.trim() !== ''
      ? persona.personaMd
      : (persona?.executionPrompt ?? fallbackTeamMemberPersona(row.name)),
  );
  const route = template?.modelRoute;
  // 路线解析（模板覆盖 / 会话默认）提取成变量供 request 使用；spawn 成功后
  // 随归属注册表落账（harness 0.1.2 起 continuable setup hook 被宿主移除，
  // 归属登记点前移到 spawn；冷恢复会话的归属随唤醒补齐）。模型显示不再
  // 依赖声明路线登记——子会话徽章 2026-09-09 起改读客户端会话持久投影。
  const agentOptions =
    route !== undefined && route.model !== ''
      ? {
          // v9 provider 回归：覆盖路线带目录 provider（同 id 模型跨提供方
          // 消歧）；旧数据未记录时省略——运行时按会话默认解析（此前填
          // config.memberProvider 是 'spawn'/'fork' 传输名，不是 LLM
          // provider，实测 2026-09-08 修复）。
          ...(route.provider !== undefined && route.provider !== ''
            ? { provider: route.provider }
            : {}),
          model: route.model,
          ...(route.reasoningEffort ? { reasoningEffort: route.reasoningEffort } : {}),
        }
      : sessionDefaultRouteOf(env.ctx);
```

</details>

**依据 2 · 源码核查**：[src/host/commands/eteam.ts:1-43](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/commands/eteam.ts#L1-L43)

命令。

<details>
<summary>查看原文（43行）</summary>

```text
/**
 * /eteam 命令（docs/19.4, D18）：新增成员 · 角色构建师的命令面入口。斜杠
 * 输入本身不会到达模型，handler 把激活消息（`eTeam --add-people …`）显式
 * steer 到接收 agent 上；门禁 + 受理即写盘 + 持续构建子代理受理派发
 * （startBuilderChild）的编排随 handler 走，命令面一次性 UX 文本（busy/
 * 降级 notice）留在本文件。
 *
 * @module dsh-eteams/commands/eteam
 */
import { createUserMessage } from '@deepseek-ai/dsh-llm';
import type { Agent } from '@deepseek-ai/dsh-agent';
import type { CommandDefinition } from '@deepseek-ai/dsh-commands';
import type { SessionId } from '@deepseek-ai/dsh-session';
import type { Context } from '@deepseek-ai/cordis';
import type { ETeamsResolvedConfig } from '../config.js';
import {
  deliverNotice,
  resumeOptionsOf,
  type RuntimeContext,
} from '../runtime/base.js';
import {
  hasBuildSessionFile,
  readBuildSession,
  reportBuildProgress,
  cancelBuildSession,
} from '../runtime/roleBuilder.js';
import { rootForWrites } from '../runtime/webui.js';
import { startBuilderChild } from '../runtime/builderPhases.js';
import { annotateBuildSession, appendEngageDiag } from '../runtime/roleBuilder.js';
import { ACTIVATION_PREFIX } from '../prompts/system/roleBuilder.js';

/** The /eteam slash command name (DSH command names are lowercase, docs/19.4). */
export const ADD_PEOPLE_COMMAND = 'eteam';

/** The bare requirement body used when the invocation carries no arguments. */
export const ADD_PEOPLE_BARE_BODY = '我需要创建一个成员 【成员名称】，它的职责是【职责】。';

/**
 * Compose the activation message steered by the /eteam command: normalize a
 * leading `--add-people` (the command hint repeats it), fall back to the
 * bare template body, and prepend the activation marker.
 */
export function buildActivationMessage(rawInput: string): string {
```

</details>

**依据 3 · 源码核查**：[src/host/runtime/askUser.ts:120-199](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/askUser.ts#L120-L199)

问答落点/先意图后请求。

<details>
<summary>查看原文（80行）</summary>

```text
  const mainAgent = liveAgentOf(env.ctx, caller.mainSessionId);
  // 弹窗主对话优先（用户 2026-09-12）：用户不在提问子会话、且主对话有活代理
  // 时弹主对话，否则弹提问子会话自身。primaryIsMain 决定落点会话的记录（v14）。
  const primaryIsMain =
    !userInAskingSession && mainAgent !== undefined && mainAgent !== options.agent;
  const primary = primaryIsMain ? mainAgent : options.agent;

  const askId = newAskId();
  const now = Date.now();
  // 落点意图**先落库**（v14）：弹窗是阻塞的，面板需在待答期间就能拿到落点去
  // 跳转，不能等答完才写；主对话不在线退回提问子会话时再由 recordAskDeliverySync
  // 更正为提问会话。
  const deliverySessionId = primaryIsMain
    ? (caller.mainSessionId ?? caller.askingSessionId)
    : caller.askingSessionId;
  // 就地弹也落审计行（面板徽标的数据源）：pending → answered。
  insertAskSync(root, {
    askId,
    teamId: caller.teamId,
    askingSessionId: caller.askingSessionId,
    askingName: caller.askingName,
    askingKind: caller.askingKind,
    ...(caller.mainTaskId !== undefined ? { mainTaskId: caller.mainTaskId } : {}),
    questions,
    status: 'pending',
    // relaySessionId 审计留档：恒等于提问会话自身（旧转交时代的字段，保留
    // 兼容历史行读端）；v14 弹窗实际落点另落 delivery_session_id/is_main。
    relaySessionId: caller.askingSessionId,
    deliverySessionId,
    deliveryIsMain: primaryIsMain,
    createdAt: now,
    updatedAt: now,
  });
  const askOnce = (agent: unknown): Promise<{ answers: AskAnswer[] }> =>
    service.ask({
      questions,
      ...(agent !== undefined ? { agent } : {}),
      ...(env.signal !== undefined ? { signal: env.signal } : {}),
    });
  try {
    let reply: { answers: AskAnswer[] };
    try {
      reply = await askOnce(primary);
    } catch (primaryError) {
      // 主对话不在线（CALLER_NOT_LIVE）/弹窗被拒 → 退回提问子代理自己的
      // 对话再试一次（侧边栏未决标记仍引导用户）；同目标或无兜底则原样上抛。
      if (primary === options.agent || options.agent === undefined) throw primaryError;
      reply = await askOnce(options.agent);
      // 退回提问子会话成功：更正落点记录（面板据此跳到子会话作答）。
      recordAskDeliverySync(root, askId, caller.askingSessionId, false);
    }
    const answers = reply.answers
      .map(normalizeAskAnswer)
      .filter((a): a is AskAnswer => a !== undefined);
    answerAskSync(root, askId, answers);
    // 构建师分支（统一问答 2026-09-10）：构建子代理的问答由宿主自动写回
    // 构建会话——它同回合拿到 answers 继续起草，不再自己 build_report(answers)。
    // 判据与旧桥接一致（builderChildId 严格相等）；构建会话已终态/无访谈态
    // 时静默跳过（问答单照常回收，弹窗答案仍回传给调用者）。
    const buildSession = readBuildSession(root);
    if (buildSession?.builderChildId === caller.askingSessionId) {
      try {
        await answerBuildInterview(
          root,
          answers.map((a) => ({
            id: a.id,
            choice: a.custom !== undefined && a.custom !== '' ? `${a.custom}` : a.selected,
          })),
        );
      } catch {
        // 无访谈态/已终态：不拦问答返回。
      }
    }
    return { mode: 'self', askId, answers };
  } catch (error) {
    cancelAskSync(root, askId);
    return {
      mode: 'degraded',
      askId,
      reason: error instanceof Error ? error.message : String(error),
```

</details>

**依据 4 · 源码核查**：[src/host/runtime/gaps.ts:1-19](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/gaps.ts#L1-L19)

分级属上报方。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * 能力缺口的运行时编排（v16；docs/subagentCapabilityGap.md）。
 *
 * 分工（与设计稿的一处偏离，记在此处以免误读）：设计稿写「Layer 1 分级＝宿主
 * 调一次模型」，但 `RuntimeContext` 里**没有 llm 面**——宿主调不了模型。而分级
 * 要判的恰是「换做法能不能过」，**只有刚撞到拒绝的那个子代理知道**（它试过哪些
 * 替代）。所以分级由上报方自己做（口径写在 `eteams_report_gap` 的 description
 * 里），宿主负责三件它才做得了的事：
 *
 * 1. **Layer 0 确定性预筛**（本模块，零模型调用）：高风险直接拒、命中常设路线
 *    直接按路线走、同操作已有 open 缺口去重——都依据宿主已知事实（argv、
 *    工作区根、路线表），不猜。
 * 2. **校验与落表**（state/gaps 的落表闸：high 拒收、why 必挂验收标准、argv 必填）。
 * 3. **结构性活动的原子落地**（「定路线 + 沉淀常设路线」同一事务，见
 *    {@link applyGapRoute}）。
 *
 * 本模块只做这三件，**不碰**消息与弹窗：唤醒领队是调用方照既有纪律走
 * `eteams_send_message`，问用户走 `eteams_ask_user`（人面前那一段复用问答表）。
 *
```

</details>

#### 缺口

- 宿主用户问答的真实主体/投递契约与各模型在同任务的效果差异
  **影响**：不能将弹窗记录等同强批准，或把多模型分工当质量提升证据
  **进一步探讨**：核固定问答服务身份与选定任务的独立验收，不以角色数或提示长度当效果

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 成本、计量与工程依据如何判读？

**研究主题**：效果与总成本、工程质量与复用、依赖、兼容与流程

#### 完整回答

Node ^22.19||>=24以node:sqlite运行，DSH tools/subagents/agents/systemPrompt/commands/defaultModel/llm/userQuestions等硬服务需齐，Web另依客户端slot/投影；peer optional只影响安装依赖，不取消apply实际服务要求。README包badge0.2.18与package0.2.21需区分，固定版本以提交和manifest为准；checkout无lib，未验证发布构建字节。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node SQLite/DSH、角色库/数据库/工作目录 | 修正bundle绝对状态路径、备份、定义角色/模型/合同与验收 | 模型/宿主价格和配置工时未知 |
| 持续使用 | 队长/成员/访谈多会话token、即刻重试、SQLite明细与工作文件 | 分解合同、审核报告/决策、处理交接和同目录冲突 | 成员副本跨任务可并行，maxMembers非总模型请求限额，净收益未测 |
| 失败恢复 | 数据库WAL/备份、保留会话及输出，可能重试额外模型请求 | 对齐attempt/token/会话活跃/已发生副作用，处理宽限期遗漏与孤儿 | DB事务不覆盖spawn/文件/模型，未知结果不可盲重放，恢复人时未知 |

usage监听全进程session/event，assistant带usage才存明细/daily增量，没有按session+seq去重、历史回补或卸载flush，失败吞并节流warn；input/output无值填0，route/身份缓存也依事件/注册。它是观察台账，不是费用账单/完整计费来源，更无预算硬停。多成员、队长拆解、访谈和默认最多三次重试会增加模型请求；不能因为本地SQLite就称整体免费/不联网。源码同步事务和attempt token值得借鉴，但数据库同步操作/大列表/文件渲染需按规模看主线程代价。代表测试使用fake agents/SQLite临时workspace，仅阅读，不把断言数当独立生产效果。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-7](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/package.json#L1-L7)

版本。

```text
{
  "name": "dsh-eteams",
  "version": "0.2.21",
  "description": "ETeams for DeepSeek Harness: captain-led multi-agent team collaboration with execution chains, task slots, member dialogs and persistent state",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
```

**依据 2 · 源码核查**：[package.json:35-37](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/package.json#L35-L37)

Node。

```text
  "engines": {
    "node": "^22.19.0 || >=24"
  },
```

**依据 3 · 源码核查**：[src/host/index.ts:49-74](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/index.ts#L49-L74)

硬服务。

<details>
<summary>查看原文（26行）</summary>

```text
 * （dsh-agent-default-model 提供）供 spawn 侧会话默认路线 pin
 * （sessionDefaultRouteOf）——cordis 4 下同级插件服务必须显式声明才能从
 * ctx 读取，否则属性访问直接抛「cannot get property … without inject」
 * （实测 2026-09-07：dispatch 在 dispatchCaptainCore 内因此整体失败）。
 */
export const inject = [
  'tools',
  'subagents',
  'agents',
  'systemPrompt',
  'commands',
  'agentDefaultModel',
  // llm（dsh-llm 提供）供 /session-route 反查模型目录显示名（用户迭代
  // 2026-09-08「显示目录模型」：id 是限定串，座位显示的是目录 name）。
  'llm',
  // userQuestions（dsh-user-questions 提供）供 eteams_ask_user 就地弹分支
  // 直调 ctx.userQuestions.ask()（转交分支不依赖它）。
  'userQuestions',
];

/** Config schema consumed by the cordis loader (validated before apply). */
export { ETeamsConfig };

/** Offline verification surface (verify script / integration tests). */
export { createCaptainTools } from './tools/captainTools.js';
export { createCaptainDispatchTool } from './tools/captainDispatch.js';
```

</details>

**依据 4 · 源码核查**：[src/host/runtime/usage.ts:1-21](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/usage.ts#L1-L21)

无回补/flush声明与机制。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * 每日 Token 消耗计量（docs/28）：看板「Token 消耗」日历的数据面。
 *
 * 采集（28.2.3 方案 A）：根作用域 `session/event` firehose 旁路观察——eteams
 * 插件 ctx 无 scope 标签（untagged listener），收到本进程所有会话（主会话 +
 * 成员/领队子代理）的每个已提交事件（E7/E8）。第一方同型先例：dsh-session-
 * persistence 在插件安装路径上做 `ctx.on("session/created")` + `ctx.on(
 * "session/event")` + `ctx.sessions.list()`（E18）。装机冒烟项见 docs/28.8-3：
 * E8 语义、归属矩阵（成员/领队子代理/领队主会话/面板绑定会话/构建子代理）
 * 与 `ctx.sessions.list()` 的覆盖面需真实宿主验证。
 *
 * 存储（docs/40，2026-09-05 用户迭代简化版）：SQLite 两表即唯一存储——
 * usage_detail（明细，一次带 usage 的模型回复步一行）+ usage_daily_total
 * （总和，一天一行，增量 upsert）。无文件台账、无水位对账、无轮转：监听
 * 器看到的每个事件实时入库（失败节流 warn 降级继续）；重启前的历史不回
 * 补，存量 usage.jsonl 等文件保留在盘但不再读写。
 *
 * 计量绝不影响会话：监听器同步段只做 Map 读写，入库走串行队列；写路径失败
 * 吞错 + 1 分钟节流 warn（E7：dsh-session 本就逐监听者 contain）。
 *
 * @module dsh-eteams/runtime/usage
```

</details>

**依据 5 · 源码核查**：[src/host/runtime/usage.ts:285-322](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/usage.ts#L285-L322)

usage写入字段。

<details>
<summary>查看原文（38行）</summary>

```text
    return;
  }
  const sessionId = String(session.id);
  if (type === 'request/header') {
    // EpochHeader.config → provider/model（E4；按会话折叠）
    rememberRoute(sessionId, event.data.header?.config?.provider, event.data.header?.config?.model);
    return;
  }
  if (type === 'request/context') {
    // RequestContext：仅路线变化时记（E4），同样折叠
    rememberRoute(sessionId, event.data.provider, event.data.model);
    return;
  }
  // assistant/message：usage 缺失的 step 不记行（28.3.3，E2）
  const usage = event.data.usage;
  if (!usage) return;
  const workspace = workspaceOf(session);
  const root = stateRootFor(config, workspace);
  const route = routeCache.get(sessionId) ?? null;
  const at = event.time;
  const seq = event.seq;
  enqueueWrite(async () => {
    const identity = await resolveIdentity(sessionId, root);
    const row: UsageRecord = {
      at,
      day: dayKeyOf(at),
      sessionId,
      seq,
      teamId: identity.teamId,
      memberName: identity.memberName,
      roleKind: identity.roleKind,
      provider: route?.provider ?? null,
      model: route?.model ?? null,
      inputTokens: Number.isFinite(usage.inputTokens) ? usage.inputTokens : 0,
      outputTokens: Number.isFinite(usage.outputTokens) ? usage.outputTokens : 0,
      cacheReadTokens: toNullableCount(usage.cacheReadTokens),
      cacheWriteTokens: toNullableCount(usage.cacheWriteTokens),
      reasoningTokens: toNullableCount(usage.reasoningTokens),
```

</details>

**依据 6 · 源码核查**：[src/host/state/usageStore.ts:158-173](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/state/usageStore.ts#L158-L173)

无去重事务。

<details>
<summary>查看原文（16行）</summary>

```text
 * Persist one usage row: detail INSERT + day-total increment upsert in a
 * single immediate transaction. No dedup - cordis delivers each committed
 * event once per listener; the feature explicitly accepts eventual
 * consistency (docs/40). Throws on DB errors (the caller swallows + warns).
 */
export function recordUsage(db: DatabaseSync, row: UsageRecord): void {
  db.exec('BEGIN IMMEDIATE');
  try {
    writeUsageRow(db, row);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

```

</details>

**依据 7 · 源码核查**：[tests/reconcile.test.ts:169-200](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/tests/reconcile.test.ts#L169-L200)

fakehost恢复断言。

<details>
<summary>查看原文（32行）</summary>

```text
  it('活集合为空（重启）→ 吊销 attempt、小任务挂起、容器同步挂起、留痕 session.dead', async () => {
    const teamId = seedTeam();
    const paused = await reconcileDeadSessions(fakeCtx([]), config, { graceMs: 0 });
    expect(paused).toBe(1);

    const team = readTeamSync(root, teamId)!;
    const sub = team.tasks.find((t) => t.id === SUB_TASK_ID)!;
    expect(sub.status).toBe('paused');
    expect(sub.attempts[0]!.status).toBe('revoked');
    // 容器由「有在办小任务」派生：小任务挂起后主任务同步挂起（用户迭代 2026-09-11）。
    expect(team.tasks.find((t) => t.id === GROUP_TASK_ID)!.status).toBe('paused');

    const suspended = readEventsSync(root, teamId).find((e) => e.type === 'task.suspended');
    expect(suspended).toBeDefined();
    expect((suspended!.payload as Record<string, unknown>).via).toBe('session.dead');
  });

  it('会话仍在活集合里 → 不判死、状态不动', async () => {
    const teamId = seedTeam();
    const paused = await reconcileDeadSessions(fakeCtx([MEMBER_SESSION]), config, { graceMs: 0 });
    expect(paused).toBe(0);
    const team = readTeamSync(root, teamId)!;
    expect(team.tasks.find((t) => t.id === SUB_TASK_ID)!.status).toBe('start');
    expect(team.tasks.find((t) => t.id === SUB_TASK_ID)!.attempts[0]!.status).toBe('running');
  });

  it('宽限期内（在办时长 < graceMs）→ 即使不在活集合里也不动', async () => {
    const teamId = seedTeam();
    // since = 1（远古），用「现在就是 since」模拟刚派出：now - since = 0 < grace。
    const paused = await reconcileDeadSessions(fakeCtx([]), config, { graceMs: 1_000, now: 1 });
    expect(paused).toBe(0);
    expect(readTeamSync(root, teamId)!.tasks.find((t) => t.id === SUB_TASK_ID)!.status).toBe('start');
```

</details>

**依据 8 · 源码核查**：[src/host/runtime/usage.ts:358-375](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/usage.ts#L358-L375)

实际usage监听安装，无回补/flush契约及异常吞错

<details>
<summary>查看原文（18行）</summary>

```text
// ---------- 安装（docs/28.7：src/host/index.ts apply() 调用） ----------

/**
 * Root-scope firehose listener（docs/28.2.3 方案 A；E18 同型先例）：非
 * assistant/message·request/* 事件第一行早退。失败一律不外抛——计量绝不
 * 影响会话与装机。无对账/无 flush（docs/40：重启前历史不回补，写经串行
 * 队列实时入库，测试用 usageWritesIdle 等排空）。
 */
export function installUsageMeter(ctx: Context, config: ETeamsResolvedConfig): void {
  meterLog = (ctx as unknown as { logger: RuntimeLogger }).logger;
  ctx.on('session/event', (session, event) => {
    try {
      onSessionEvent(session as Session, event as SessionEvent, config);
    } catch (error) {
      warnThrottled(`eteams usage: 监听器异常（不影响会话）：${String(error)}`);
    }
  });
}
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 采用与可证伪方向是什么？

**研究主题**：采用判断、贡献与相对优势、新假设与验证

#### 完整回答

建议在备份且明确共享工作区责任的任务中试用。角色/任务副本身份、attempt token与状态/事件/邮件事务、合同材料和人类问答落点形成实际可追踪协作增量，相比手工多会话有更完整责任与交接单元。它仍把非空成员报告视成功、依赖/链非硬门，任务外部副作用和独立验收由使用者承担。首次修正个人硬编码状态目录、限制Web管理面、确认重启近期任务残留处理，不用于无人值守宣称全自动验收。

可推未验证“可恢复受理与验收收据”。参照spawn先于DB与自报完成，先持久外部受理intent/固定childID，未知时按宿主权威查受理不盲重spawn；每次attempt绑定工作目录/输入产物版本和独立验收证据，区分reported/accepted，完成只在指定验收者/规则认可后推进；grace延期补判，恢复不把服务查询失败当权威死亡。保持记录和隔离代价明确，不自动重放非幂等动作。

最小反例为spawn成功DB失败、崩溃50s内重启且后续无事件、agents.list临时错、迟到旧token、成员只写“完成”无产物、前置未完成乱序、双host旧快照、文件删后DB回滚。若有重复副作用/无产物仍accepted或死亡误判则否定收据假设；若额外验收/上下文维护成本大于手工交接节省，则不支持经济性。方向未实现验证，不计当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/runtime/assignment.ts:681-723](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L681-L723)

派发受理/DB边界。

<details>
<summary>查看原文（43行）</summary>

```text
async function dispatchCore(
  env: RuntimeEnv,
  teamId: TeamKey,
  actor: Actor,
  /** 派发锚任务：captainFor 按本任务行快照解析主会话（v6，docs/51）。 */
  anchorTaskId: number,
  prepare: (team: TeamState, captain: Agent | undefined) => Promise<AssignmentPlan>,
  apply: (
    team: TeamState,
    tx: TeamTx,
    plan: AssignmentPlan,
    wakes: Wake[],
  ) => {
    task: TaskRecord;
    attempt: AttemptRecord;
  },
): Promise<{ team: TeamState; task: TaskRecord; attempt: AttemptRecord }> {
  const root = stateRootOf(env);
  return locks.withLock(teamLockKey(root, String(teamId)), async () => {
    const team = readTeamSync(root, teamId);
    if (team === undefined) {
      throw new ETeamsError(
        `团队「${String(teamId)}」不存在`,
        '用 eteams_team_status 查看当前团队，或先 eteams_create_team',
      );
    }
    const anchorTask = team.tasks.find((t) => t.id === anchorTaskId);
    const plan = await prepare(
      team,
      anchorTask === undefined ? undefined : await captainFor(env, team, anchorTask),
    );
    const wakes: Wake[] = [];
    const result = withTeamTx(root, team.id, (tx) => {
      const out = apply(team, tx, plan, wakes);
      writeTeamInTx(tx, team);
      return out;
    });
    renderTeamDocs(env.workspace, team, (msg) => env.ctx.logger.warn(msg));
    await runWakes(wakes);
    return { team, ...result };
  });
}

```

</details>

**依据 2 · 源码核查**：[src/host/runtime/assignment.ts:1961-1982](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L1961-L1982)

自报完成。

<details>
<summary>查看原文（22行）</summary>

```text
    const { task, attempt } = requireLiveAttempt(fresh, member, params);
    const output = params.output.trim();
    if (output === '')
      throw new ETeamsError('完成产出说明不能为空', 'output 写清做了什么、改了哪些文件、如何验证');
    attempt.status = 'succeeded';
    attempt.endedAt = tx.now;
    attempt.result = { output, changedPaths: params.changedPaths };
    freeMember(fresh, task);
    const isStation = task.chain.length > 0;
    const wakes: Wake[] = [];
    // 弱顺序链推进（用户 2026-09-13）：frontier = 链上最靠前、尚无成功尝试的
    // 站点。还有未跑站点 → 中间站（任务回 ready，等领队从 frontier 续派）；
    // 全部站点都有成功尝试 → 收口。顺序接力场景与旧的「下一站」口径逐位一致；
    // 乱序/追加派发时不会误收口，而是**继续把剩余站点跑完**。
    const frontier = chainFrontier(task.chain.length, task.attempts);
    if (isStation && frontier < task.chain.length) {
      task.chainCursor = frontier - 1; // 使 nextChainStation = 最靠前的未跑站
      const next = task.chain[frontier]!;
      applyTransition(task, 'ready', tx.now);
      emit(tx, fresh.id, memberActor(member), 'task.stage_completed', {
        taskId: task.id,
        attemptId: attempt.id,
```

</details>

**依据 3 · 源码核查**：[src/host/runtime/reconcile.ts:98-160](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/reconcile.ts#L98-L160)

重启对账边界。

<details>
<summary>查看原文（63行）</summary>

```text
    let rows: InFlightAttemptRow[];
    try {
      rows = listInFlightAttempts(root);
    } catch (error) {
      warnThrottled(`eteams reconcile: 读取在办尝试失败（跳过本轮）：${String(error)}`);
      continue;
    }
    if (rows.length === 0) continue;
    const byTeam = new Map<number, InFlightAttemptRow[]>();
    for (const row of rows) {
      const bucket = byTeam.get(row.teamId);
      if (bucket === undefined) byTeam.set(row.teamId, [row]);
      else bucket.push(row);
    }
    const env: RuntimeEnv = {
      ctx: ctx as unknown as RuntimeContext,
      config,
      workspace: workspacePath,
    };
    for (const [teamId, attempts] of byTeam) {
      const team = readTeamSync(root, teamId);
      if (team === undefined) continue;
      for (const row of attempts) {
        // 宽限期：刚派出/冷恢复在途的会话可能还没在册，不判死。
        if (now - row.since < graceMs) continue;
        const sessionId = sessionIdOfAttempt(team, row);
        // 会话仍活着（含驻留 idle 的子代理）→ 真有工作在办，不动。
        if (sessionId !== '' && live.has(sessionId)) continue;
        try {
          const hit = await pauseTaskOnDeadSession(env, teamId, row.taskId);
          if (hit !== undefined) paused += 1;
        } catch (error) {
          warnThrottled(`eteams reconcile: 挂起任务失败：${String(error)}`);
        }
      }
    }
  }
  return paused;
}

/** Install the dead-session reconciler (root-scope, index.ts apply, 启动一次). */
export function installDeadSessionReconciler(ctx: Context, config: ETeamsResolvedConfig): void {
  logger = (ctx as unknown as { logger: RuntimeLogger }).logger;
  clearBootTimers();
  const run = (): void => {
    void reconcileDeadSessions(ctx, config).catch((error) =>
      warnThrottled(`eteams reconcile: 对账失败（不影响会话）：${String(error)}`),
    );
  };
  // 启动立即跑一轮（重启前的会话全不在册）；此时 workspaceRegistry 往往未就绪 →
  // collectRoots 返回空、本轮 no-op，故紧接着补几轮快扫（见 BOOT_SWEEP_DELAYS_MS），
  // 注册表一就绪即生效。此后不再排期——进程内的中断由中断观察者按事件处置。
  run();
  for (const delay of BOOT_SWEEP_DELAYS_MS) {
    const handle = setTimeout(run, delay);
    // 绝不影响宿主退出：宿主进程不因这些 timer 被拖着不走。
    (handle as { unref?: () => void }).unref?.();
    bootTimers.push(handle);
  }
}

function clearBootTimers(): void {
  for (const handle of bootTimers) clearTimeout(handle);
```

</details>

**依据 4 · 源码核查**：[src/host/runtime/assignment.ts:2201-2236](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L2201-L2236)

已存在token基线。

<details>
<summary>查看原文（36行）</summary>

```text
function requireLiveAttempt(
  team: TeamState,
  row: TaskMemberRecord,
  params: { taskId: number; attemptId: number; token: string },
): { task: TaskRecord; attempt: AttemptRecord } {
  const task = requireTask(team, params.taskId);
  if (task.assignee !== row.name) {
    throw new ETeamsError(`任务 ${task.id} 未指派给你`, '只操作自己被指派的任务');
  }
  const attempt = task.attempts.find((a) => a.id === params.attemptId);
  const mine =
    attempt !== undefined &&
    (attempt.taskMemberId !== undefined
      ? attempt.taskMemberId === row.id
      : attempt.member === row.name);
  if (attempt === undefined || !mine) {
    throw new ETeamsError(
      `attempt ${params.attemptId} 不属于任务 ${task.id} 的当前执行`,
      'attempt 已吊销或不存在；重新查看 eteams_task_board',
    );
  }
  if (attempt.status !== 'running') {
    throw new ETeamsError(
      `attempt ${attempt.id} 状态为 ${attempt.status}，无法上报`,
      'attempt 已被吊销（改派/取消/挂起），所有权已变更；停止操作并等待新指派',
    );
  }
  if (attempt.token === '' || params.token !== attempt.token) {
    throw new ETeamsError(
      'token 校验失败',
      'attempt 已吊销，所有权已变更；用 eteams_task_board 确认状态并等待领队指令',
    );
  }
  return { task, attempt };
}

```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
