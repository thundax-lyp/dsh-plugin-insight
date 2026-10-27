# dsh-domain-bridge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[9df384a](https://github.com/1Lany2a/dsh-domain-role/tree/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge)

<!-- BEGIN META -->
[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1Lany2a/dsh-domain-role) [![npm 30d 377](https://img.shields.io/static/v1?label=npm+30d&message=377&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-domain-bridge) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-domain-bridge)
<!-- END META -->

> **实现功能**：提供声明优先域寻址、分层暂停、持久消息队列、会话工厂、模型分派、命令菜单与静态工作台入口。

> **核心亮点**：把域寻址、分层暂停、持久队列与会话/模型接线组合，并加入跨进程状态锁、投递租约和可查询队列；增量是协作控制面，不是业务隔离或exactly-once。[Q01](#research-q01)、[Q03](#research-q03)

> **风险与缺陷**：持久认领已实现，但投递成功与终态非原子；追加队列不走重写锁，损坏暂停状态可放行。hub仅按Host判本机，不能独立证明请求身份。[Q04](#research-q04)、[Q10](#research-q10)

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
  - [Q01 · 域桥要交付什么协作结果，相对复制消息增加什么？](#detail-section-11)
  - [Q02 · 声明、暂停、队列与唤醒如何连接？](#detail-section-12)
  - [Q03 · 持久化租约和共享输出有哪些独立工程增量？](#detail-section-13)
  - [Q04 · 哪些边界仍会使暂停或恰好一次承诺不成立？](#detail-section-14)
  - [Q05 · 部署与恢复依赖哪些宿主和数据条件？](#detail-section-15)
  - [Q06 · 如何计算每条正确处理消息的总成本？](#detail-section-16)
  - [Q07 · 列表、回执和工作台分别能证明什么？](#detail-section-17)
  - [Q08 · 稳定消费收据能否补上投递租约后的不确定窗口？](#detail-section-18)
  - [Q09 · 现在适合哪类采用，何时停止？](#detail-section-19)
  - [Q10 · hub固定资源和local-only判定提供了什么边界？](#detail-section-20)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向按业务域分工的DSH会话协作，要求目标、暂停级和消息处理结果可追溯，不能只以delivered推断业务办结。

手工会话表与复制消息是直接替代；同一批域任务按正确目标实际办结、重复副作用、恢复时间和token比较，控制面功能数不替代结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 域寻址/声明 | 找负责会话 | 声明需维护，非租户隔离 |
| 暂停与持久队列 | 延后和恢复插件消息 | 只管介导路径，非系统冻结/消费保证 |
| 会话工厂/模型 | 创建入组及下一请求配置 | 需宿主API，默认恢复可能失败 |
| 队列查询/撤回 | 查插件inbox | 非宿主composer队列 |
| hub静态入口 | 服务可信space页面 | 固定资源且Host判定，非独立鉴权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH tools/agents | 必需 | 注册并寻址活会话 | API缺失按功能降级 |
| 域声明/home与可写stateDir | 协作必需 | 负责人、暂停和inbox | 损坏需停并核，不把空结果当无任务 |
| 会话/工作区/模型分派 | 工厂与唤醒按需 | 创建、入组和下一请求模型 | 分阶段回执，不盲重建 |
| Web命令/菜单服务 | UI可选 | 人工控制入口 | 路由注册成功仍需验 |
| 可信space文件及外层访问控制 | hub前提 | 页面/JSON静态服务 | Host检查不替代来源/身份认证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定域 | 用户明确项目/域/负责人和权限 | 声明唯一、目标可追溯 |
| 演练 | 用户dryRun寻址/暂停 | 无写入，OR命中解释正确 |
| 发送 | Agent按明确mode发送 | 核queued、delivered与真实消费分别 |
| 恢复 | 用户解所需级后查队列 | 剩余OR仍pending，关注delivering/写失败 |
| 模型/工厂 | 用户核创建入组和默认恢复 | 已创建不盲重试 |
| 停止 | 用户保留inbox/状态和会话轨迹 | 错域、重复或损坏即暂停依赖 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地名册/状态/队列与宿主配置 | 定域、负责人、模型及权限 | 安装/维护工时未知 |
| 持续使用 | 文件I/O、锁等待、全量队列读及会话token | 审队列和真实业务结果 | 不把inject当整体零成本 |
| 失败恢复 | 重投模型/副作用与文件恢复资源 | 去重、核租约/终态/默认模型 | 无重复率/单位合格任务金额 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 定向协作 | 声明寻址与三种投递 | 实际错域/任务办结率 |
| 暂停恢复 | OR重评与持久认领 | 消费exactly-once、损坏时策略 |
| 过程可见 | 详细回执与list_domain_queue | 比手工流程少多少恢复人工 |
| 工作台入口 | 固定7资源路由 | GUI部署及独立访问安全 |

> **思考**：持久认领已实现，但投递成功与终态非原子；追加队列不走重写锁，损坏暂停状态可放行。hub仅按Host判本机，不能独立证明请求身份。[Q04](#research-q04)、[Q10](#research-q10)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把域寻址、分层暂停、持久队列与会话/模型接线组合，并加入跨进程状态锁、投递租约和可查询队列；增量是协作控制面，不是业务隔离或exactly-once。[Q01](#research-q01)、[Q03](#research-q03)

把域寻址、分层暂停、持久队列与会话/模型接线组合，并加入跨进程状态锁、投递租约和可查询队列；增量是协作控制面，不是业务隔离或exactly-once。[Q01](#research-q01)、[Q03](#research-q03)

跨进程状态锁、持久认领、统一JSON出口和阶段错误回执可借鉴；必须同时保留追加未持同锁、投递/终态窗口与Host头信任的具体限制。[Q03](#research-q03)、[Q04](#research-q04)、[Q10](#research-q10)

<a id="detail-section-5"></a>

### 1.4 主要限制

持久认领已实现，但投递成功与终态非原子；追加队列不走重写锁，损坏暂停状态可放行。hub仅按Host判本机，不能独立证明请求身份。[Q04](#research-q04)、[Q10](#research-q10)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。先用无外部写入的合成域消息核寻址/四级暂停/恢复和模型默认，逐条对真实消费；错域、重复、漏投、状态损坏或误认系统冻结即停。[Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

声明/OR/锁与租约为源码支持机制；恰好消费一次、hub部署及实际协作效果未验证。稳定消费收据原型尚未实现。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-domain-bridge/README.md、plugins/dsh-domain-bridge/package.json、README.md、plugins/dsh-domain-bridge/lib/bridge.js、plugins/dsh-domain-bridge/lib/core/tools.js、plugins/dsh-domain-bridge/lib/core/shared.js、plugins/dsh-domain-bridge/lib/core/messaging.js、plugins/dsh-domain-bridge/lib/core/pause.js、plugins/dsh-domain-bridge/lib/core/registrations.js、plugins/dsh-domain-bridge/lib/core/session-factory.js、plugins/dsh-domain-bridge/lib/core/hub.js 及固定范围 inventory；组件：plugins/dsh-domain-bridge。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定bridge/shared/tools与messaging、pause、registrations、session-factory、hub关键链路；不穷尽bootstrap/wizard/menu与外部GUI，不运行目标或会话。
- 下一步：按 [Q08](#research-q08) 注入并发drain、追加/rename交错、终态写失败和超期恢复；按 [Q10](#research-q10) 分别核Host/socket与可信space，不运行目标。

**分析版本**

- **仓库**：[1Lany2a/dsh-domain-role](https://github.com/1Lany2a/dsh-domain-role)
- **版本号**：0.8.16（[固定提交 9df384a](https://github.com/1Lany2a/dsh-domain-role/tree/9df384a0556e8e1aa288f6f8d654deca0a371556)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在现有租约上加入稳定消费ID、接收端去重/完成收据、fencing及统一所有inbox写者协议，比较故障后重复/漏投及恢复负担；不是把已实现租约算新设想。[Q08](#research-q08)

按 [Q08](#research-q08) 注入并发drain、追加/rename交错、终态写失败和超期恢复；按 [Q10](#research-q10) 分别核Host/socket与可信space，不运行目标。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 1323 | — | — | 30557 |
| .js | source | 16 | 13772 | 10722 | 2368 | — |
| .mjs | test | 10 | 8072 | 6831 | 657 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1Lany2a/dsh-domain-role/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1Lany2a/dsh-domain-role/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1Lany2a/dsh-domain-role/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版域控制面如何把声明、暂停和消息恢复连接，现有锁/租约改善到哪里，哪些身份、并发与消费边界仍阻碍可靠采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 域桥要交付什么协作结果，相对复制消息增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向把工作拆成业务域、各域有负责会话的DSH用户。用户要按域找到负责者，选择followup/steer/inject，把消息投递并在暂停期间保留待处理项。合格任务须正确寻址、暂停策略可解释、队列和接收结果可追溯，而非只看工具返回delivered。

直接替代是手工会话表加复制消息。插件把声明优先寻址、四级暂停、会话工厂和队列检查接成控制面，减少反复找人及人工抄队列；模型与业务产出仍属于被唤起会话，它不提供跨域隔离或任务正确性证明。当前桥有12个工具定义和6命令接线，但注册函数可吞失败，定义数量不等运行可用数量。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/bridge.js:96-118](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/bridge.js#L96-L118)

实际工具表与命令接线，而非把注释11当当前数量。

<details>
<summary>查看原文（23行）</summary>

```text
      const defs = {
        list: buildListTool(ctx, config),
        send: buildSendTool(ctx, config),
        claim: buildClaimTool(ctx, config),
        release: buildReleaseTool(ctx, config),
        owners: buildListOwnersTool(ctx, config),
        create: buildCreateSessionTool(ctx, config),
        pause: buildSetDomainStateTool(ctx, config),
        withdraw: buildWithdrawMessageTool(ctx, config),
        listQueue: buildListDomainQueueTool(ctx, config),
        listModels: buildListModelsTool(ctx, config),
        setModel: buildSetModelTool(ctx, config),
        setDefaultModel: buildSetDefaultModelTool(ctx),
      }
      // v0.4.0：「已暂停」的人工控制入口 + 队列撤回入口；v0.6.0 模型分派；v0.6.1 全局默认模型入口。
      // 宿主没有对应 API 时工具照常注册、如实回 api-unavailable —— 注册本身永不抛。
      for (const definition of Object.values(defs)) registerTool(ctx, definition)
      // v0.7.0：六条宿主斜杠命令（/register /initialize /handoff /retire /pause /pause-all）。
      // v0.8.0：同一批定义既注册成命令，也挂到 popup 菜单路由上——一个实现，两个入口。
      // ⚠️ 0.8.1 修复：`ctx.get('commands')` / `ctx.get('webServer')` 在**未注入**时拿不到服务，
      // 于是命令没注册上（输入 /register 无反应）、菜单路由没挂上（弹出菜单后 404）。
      // 正确姿势是 `ctx.inject([...], child => ...)`，与 free-search 的 webServer 用法一致。
      const commandDefs = buildCommandDefs(ctx, { config, defs, runInitialize })
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:358-371](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L358-L371)

三种投递模式只调用宿主Agent接口。

<details>
<summary>查看原文（14行）</summary>

```text
export function deliverToAgent(agent, mode, payload) {
  if (mode === 'steer') {
    if (typeof agent?.steer !== 'function') return { ok: false, reason: 'steer-unsupported' }
    agent.steer(payload)
    return { ok: true, reason: null }
  }
  if (mode === 'inject') {
    if (typeof agent?.inject !== 'function') return { ok: false, reason: 'inject-unsupported' }
    agent.inject(payload)
    return { ok: true, reason: null }
  }
  if (typeof agent?.followup !== 'function') return { ok: false, reason: 'followup-unsupported' }
  agent.followup(payload)
  return { ok: true, reason: null }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 声明、暂停、队列与唤醒如何连接？

**研究主题**：功能与机制

#### 完整回答

入口硬注入tools/agents，运行层解析home、域声明与stateDir。发送把目标解析到域或会话，并检查接收端及发送端的适用暂停级；domain/session/project/global任一级命中即拦下，保存冻结信封及UUID到目标自身队列。dryRun不写队列，实际落盘失败明确queued:false。

恢复只解当前一级，然后重新评估剩余OR；仍受其他级控制则保持pending。无活Agent时按模型接线尝试resume，接线不足不应裸开模型回合。可投递后原子认领pending→delivering，调用宿主，再写终态。inject只注入、不立即跑模型；followup/steer可能触发额外模型工作，均非业务完成收据。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:658-679](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L658-L679)

按scope/key查状态并OR叠加。

<details>
<summary>查看原文（22行）</summary>

```text
export function lookupPauseRecord(states, scope, key) {
  const lower = String(key ?? '').toLowerCase()
  const real = String(scope ?? '').trim().toLowerCase() || SCOPE_DOMAIN
  const exact = states?.byScopeKey?.get(real + '\u0000' + lower)
  if (exact) return exact
  const loose = states?.byKey?.get(lower)
  if (!loose) return null
  return scopeOfRecord(loose) === real ? loose : null
}

/**
 * 一组候选键 → 命中（**OR 叠加**）。数据源是已经读进来的 states（list 路径）。
 * `lookupPauseRecord` 按 (scope,key) 精确取 ⇒ 跨 scope 同名字符串也不会互相顶掉。
 */
export function pauseHitsOfMap(states, candidates) {
  const hits = []
  for (const candidate of candidates || []) {
    if (!candidate || !candidate.key) continue
    const record = lookupPauseRecord(states, candidate.scope, candidate.key)
    if (record && record.paused === true) hits.push({ ...candidate, record })
  }
  return { hits: dedupePauseHits(hits), unreadable: [] }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:536-572](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L536-L572)

dryRun与实际入队边界。

<details>
<summary>查看原文（37行）</summary>

```text
          key: queueKey,
          mode,
          envelope,
          text,
          replyTo: replyKey,
          pausedByScopes: facts.pausedByScopes,
        })
        if (args.dryRun === true) {
          return {
            delivered: false,
            dryRun: true,
            queued: false,
            reason: 'domain-paused',
            target: String(args.target ?? ''),
            ...pausedFacts,
            ...unresolvedNote,
          ...unreadableNote,
            wakeBlocked: wakeEarly === 'off' ? null : 'domain-paused',
            wouldQueue: {
              key: queueKey,
              scope: queueScopeOf(queueKey),
              domain: facts.domain,
              mode,
              envelope,
              from: self.id ?? null,
              withdrawable: true,
              file: inbox.file,
            },
            declarationsFile: config.domainsFile,
            self,
            hint:
              `演练：**没有投递、也没有写队列**。真跑的话这条消息会以 pending 落进 ${inbox.file}（入队键＝${queueKey}），` +
              `可用 withdraw_domain_message 撤回；恢复要先解开**按着它的每一级**（见 pausedByScopes），` +
              `恢复时会重新评估 OR。`,
          }
        }
        const enqueued = appendInboxRecord(config.stateDir, queueKey, record)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:1140-1157](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L1140-L1157)

恢复时重评当前暂停状态。

<details>
<summary>查看原文（18行）</summary>

```text
  }
  const declarations = loadDeclarations(config.domainsFile)
  // ── v0.4.2：**重评 OR**（drain 的正确性来源）。一条 pending 能不能投，只看它目标**当下**的判定，
  // 与当初被哪一级拦下无关；仍被任何一级压着 ⇒ **保持 pending**，并说清是被谁压着。
  const press = pausePressersOfQueueKey(config, declarations, ctx, key)
  // 降级不静默：这条队列目标的状态文件读不懂 ⇒ 不拦（照常投），但把文件名带出来。
  if (press.unreadable.length) out.unreadableStateFiles = press.unreadable
  if (press.hits.length > 0) {
    out.attempted = false
    out.reason = 'still-pressed'
    out.stillPending = pending.map((record) => record.id)
    out.stillPausedBy = press.hits.map((hit) => ({
      scope: hit.scope,
      key: String(hit.key ?? ''),
      via: hit.via ?? null,
      side: hit.side ?? null,
      pausedAt: hit.record?.pausedAt ?? null,
      pausedBy: hit.record?.pausedBy ?? null,
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:1214-1257](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L1214-L1257)

认领、投递及状态写入的分离链路。

<details>
<summary>查看原文（44行）</summary>

```text
  for (const record of pending) {
    const id = record.id
    // ── F-18：同一进程里另一路 drain 正在投它 ⇒ 直接跳过（**不**重复投，也不报错）。
    if (deliveringIds.has(id)) {
      out.skippedInflight.push({ id, reason: 'inflight', error: null, status: INBOX_DELIVERING })
      continue
    }
    deliveringIds.add(id)
    try {
      // ── 落盘认领（pending ⇒ delivering）：锁内 CAS，是"这条归我投"的唯一裁决。
      // 另一路（同进程的、或跨进程的）读到 delivering/终态就回 not-pending ⇒ 只会有一个投递者。
      const claimed = claimInboxDelivery(config.stateDir, key, id, {
        staleMs: DELIVERING_STALE_MS,
        by: self?.id ?? null,
      })
      if (!claimed.ok) {
        out.skippedInflight.push({
          id,
          reason: claimed.reason ?? 'unknown',
          error: claimed.error ?? null,
          status: claimed.status ?? null,
        })
        continue
      }
      const mode = String(record.mode ?? 'followup').toLowerCase()
      let attempt
      try {
        const envelope = String(record.content ?? '')
        const payload = domainMessage({ self: { id: record.from ?? null, domains: [] }, envelope })
        attempt = deliverToAgent(agent, mode, payload)
      } catch (error) {
        attempt = { ok: false, reason: 'deliver-threw', error: messageOf(error) }
      }
      if (attempt.ok) {
        const wrote = updateInboxStatus(config.stateDir, key, id, INBOX_DELIVERED, {
          deliveredAt: new Date().toISOString(),
          deliveredBy: self?.id ?? null,
          // 终态不保留租约字段：队列里"已投递"的记录不该看起来像还在投。
          deliveringAt: null,
          deliveringBy: null,
        })
        out.delivered.push(id)
        // 消息**确实投出去了**，但状态没写进去 ⇒ 如实记账（下次恢复可能重投一次，重复优于丢消息）。
        if (!wrote.ok) out.statusWriteFailures.push({ id, status: INBOX_DELIVERED, error: wrote.error ?? wrote.reason })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 持久化租约和共享输出有哪些独立工程增量？

**研究主题**：贡献与相对优势、工程质量与复用

#### 完整回答

当前不应再说“文件状态完全没有锁/租约”。messaging复用registrations的wx跨进程锁，updateInboxStatus在锁内读改写，原子认领记录为delivering，5分钟后可由下一次drain接管；进程内deliveringIds另挡同进程并发。唯一临时文件及rename重试减少固定tmp竞争。这些比仅UI暂停和裸JSON覆盖具体得多。

公共tools出口把undefined、bigint、非有限数、循环等归一为可JSON往返的值，减少动作已发生却被宿主输出拒绝的风险。但归一不是保真业务类型证明，unknown/BigInt字符串消费者仍须读约定；锁也只约束参与同协议的写者，不能扩大成端到端exactly-once。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:43-68](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L43-L68)

有界锁重用，拒绝把旧缺锁结论套本版。

<details>
<summary>查看原文（26行）</summary>

```text
export const DELIVERING_STALE_MS = 5 * 60 * 1000

/**
 * 跨进程 `.lock` 通道（读-改-写用）。**与 registrations.js:171-238 同一份实现，不复制**：
 * `withDomainsLock(domainsFile, fn)` 的语义本来就只是"给一个文件路径，按 `<file>.lock` 用 `wx`
 * 独占（已存在必 EEXIST）+ 锁内 pid 判死接管 + `finally` 释放"，与"域名册"无关，所以这里只做
 * 一次改名导出（照抄 65 行锁逻辑会分叉——同源注释挡不住分叉）。
 *
 * 契约（与 withDomainsLock 逐字相同）：回 `{ok, value, reason, error}`，**永不抛**；
 * `fn` 抛错 ⇒ `{ok:false, reason:'function-threw'}`，锁照样在 finally 释放。
 * **不可重入**：同一进程对同一个文件嵌套取锁会等到超时（15 次 × 20ms ⇒ `reason:'locked'`），
 * 所以处理函数体内**绝不允许**再取同一把锁（见 updateInboxStatus / writeDomainStateAtomic）。
 * 遗留：竞争告警文案沿用 registrations.js 的「域名册锁」字样（同一个函数；改文案要动
 * registrations.js，本次任务不允许）。
 */
export function withFileLock(file, fn) {
  let locked = withDomainsLock(file, fn)
  // Windows 实测补丁：`wx` 撞上"对方**刚**删掉的那把锁"时报 EPERM/EACCES，而 registrations.js 的
  // lockContention() 只在"此刻还看得见锁文件"时才算争用 ⇒ 极小概率把一次正常争用误判成
  // `lock-failed`（2×20 条队列实测遇到 1/40：EPERM … open '<inbox>.lock'）。这里只对**这一类
  // 瞬时 IO 错**做有界重试（≤3 次 × 25ms）；锁的实现/语义仍是 registrations.js 那一份，没有第二套。
  for (let attempt = 0; attempt < 3 && !locked.ok && locked.reason === 'lock-failed' && transientLockError(locked.error); attempt++) {
    sleepMs(25)
    locked = withDomainsLock(file, fn)
  }
  return locked
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:167-181](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L167-L181)

状态读改写持锁。

<details>
<summary>查看原文（15行）</summary>

```text
export function updateInboxStatus(stateDir, key, id, status, extra) {
  const file = inboxFileFor(stateDir, key)
  const locked = withFileLock(file, () => {
    const inbox = loadInbox(stateDir, key)
    const index = inbox.records.findIndex((record) => record.id === id)
    if (index === -1) return { ok: false, reason: 'not-found', file: inbox.file }
    const before = inbox.records[index]
    const next = { ...before, ...(extra || {}), status }
    inbox.records[index] = next
    const written = rewriteInbox(stateDir, key, inbox.records)
    if (!written.ok) return { ok: false, reason: 'write-failed', error: written.error, file: inbox.file }
    return { ok: true, file: inbox.file, before, record: next }
  })
  if (locked.ok) return locked.value
  return { ok: false, reason: locked.reason === 'locked' ? 'locked' : 'lock-failed', error: locked.error, file }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:217-239](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L217-L239)

持久认领与过期接管。

<details>
<summary>查看原文（23行）</summary>

```text
export function claimInboxDelivery(stateDir, key, id, options) {
  const opts = options && typeof options === 'object' ? options : {}
  const staleMs = Number.isFinite(Number(opts.staleMs)) ? Number(opts.staleMs) : DELIVERING_STALE_MS
  const by = typeof opts.by === 'string' && opts.by ? opts.by : null
  const nowMs = Date.now()
  const file = inboxFileFor(stateDir, key)
  const locked = withFileLock(file, () => {
    const inbox = loadInbox(stateDir, key)
    const index = inbox.records.findIndex((record) => record.id === id)
    if (index === -1) return { ok: false, reason: 'not-found', file: inbox.file }
    const before = inbox.records[index]
    const reclaiming = before.status === INBOX_DELIVERING
    if (before.status !== INBOX_PENDING && !isStaleDelivering(before, nowMs, staleMs)) {
      return { ok: false, reason: 'not-pending', status: before.status ?? null, file: inbox.file }
    }
    const next = { ...before, status: INBOX_DELIVERING, deliveringAt: new Date(nowMs).toISOString(), deliveringBy: by }
    inbox.records[index] = next
    const written = rewriteInbox(stateDir, key, inbox.records)
    if (!written.ok) return { ok: false, reason: 'write-failed', error: written.error, file: inbox.file }
    return { ok: true, file: inbox.file, before, record: next, reclaimed: reclaiming }
  })
  if (locked.ok) return locked.value
  return { ok: false, reason: locked.reason === 'locked' ? 'locked' : 'lock-failed', error: locked.error, file }
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/tools.js:60-78](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/tools.js#L60-L78)

输出类型归一。

<details>
<summary>查看原文（19行）</summary>

```text
export function losslessValue(value, stack) {
  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') return DROP
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null
    return Object.is(value, -0) ? 0 : value
  }
  if (typeof value === 'bigint') return value.toString()
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.toISOString() : null
  // Only an ANCESTOR can be a cycle; a plain shared object is duplicated, exactly like stringify.
  if (stack.includes(value)) return null
  stack.push(value)
  try {
    if (Array.isArray(value)) {
      return value.map((item) => {
        const next = losslessValue(item, stack)
        // Sparse slots, undefined, functions and symbols all become null, exactly like stringify.
        return next === DROP ? null : next
      })
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/tools.js:122-138](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/tools.js#L122-L138)

全部工具统一经过输出出口。

<details>
<summary>查看原文（17行）</summary>

```text
export function tool(name, description, parameters, execute) {
  return {
    name,
    description,
    // 函数调用要求 object-rooted schema；这里统一包装。
    parameters: { type: 'object', properties: parameters },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render(_args, value) {
        return [{ type: 'text', text: JSON.stringify(value, null, 2) }]
      },
    },
    // Single choke point for lossless output: EVERY tool goes through pruneUndefined() on the way
    // out, so no individual branch (now or later) can make the host reject a whole call.
    async execute(args, exec) {
      return pruneUndefined(await execute.call(this, args, exec))
    },
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些边界仍会使暂停或恰好一次承诺不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

暂停只控制插件介导的发送/创建/唤醒，不能冻结已经运行的Agent、人工打开或其他宿主路径；force是显式绕暂停，非系统级授权。恢复读不到状态文件时当前实现记录unreadable但照常投递，因此损坏文件不是fail-closed暂停。

持久租约减少并发drain重复，但投递成功后终态写失败会保留delivering；5分钟后重投是源码明确接受的恢复选择。domainMessage每次新造UUID，不能据队列ID推断接收端自动去重。还有并发追加与重写需核：appendInboxRecord直接appendFileSync，状态更新则在锁内load后以rename替换整表，追加者不取相同锁；不同进程若追加恰落在load与rename间，新行可能被旧整表替换。这是静态交错推断，未在本轮复现。

模型切换先记全局默认、selectModel后再恢复；恢复失败如实报告，但没有围绕全部并发调用的全局事务。局部回执有助定位，不能等于业务只执行一次。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:1140-1146](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L1140-L1146)

损坏暂停状态在drain中不拦但报告。

```text
  }
  const declarations = loadDeclarations(config.domainsFile)
  // ── v0.4.2：**重评 OR**（drain 的正确性来源）。一条 pending 能不能投，只看它目标**当下**的判定，
  // 与当初被哪一级拦下无关；仍被任何一级压着 ⇒ **保持 pending**，并说清是被谁压着。
  const press = pausePressersOfQueueKey(config, declarations, ctx, key)
  // 降级不静默：这条队列目标的状态文件读不懂 ⇒ 不拦（照常投），但把文件名带出来。
  if (press.unreadable.length) out.unreadableStateFiles = press.unreadable
```

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:1247-1257](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L1247-L1257)

投递成功而状态失败可能重投。

<details>
<summary>查看原文（11行）</summary>

```text
      if (attempt.ok) {
        const wrote = updateInboxStatus(config.stateDir, key, id, INBOX_DELIVERED, {
          deliveredAt: new Date().toISOString(),
          deliveredBy: self?.id ?? null,
          // 终态不保留租约字段：队列里"已投递"的记录不该看起来像还在投。
          deliveringAt: null,
          deliveringBy: null,
        })
        out.delivered.push(id)
        // 消息**确实投出去了**，但状态没写进去 ⇒ 如实记账（下次恢复可能重投一次，重复优于丢消息）。
        if (!wrote.ok) out.statusWriteFailures.push({ id, status: INBOX_DELIVERED, error: wrote.error ?? wrote.reason })
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:128-155](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L128-L155)

无同锁append与整表rename的潜在交错。

<details>
<summary>查看原文（28行）</summary>

```text
export function appendInboxRecord(stateDir, key, record) {
  const file = inboxFileFor(stateDir, key)
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.appendFileSync(file, JSON.stringify(record) + '\n', 'utf8')
    return { ok: true, file, error: null }
  } catch (error) {
    return { ok: false, file, error: messageOf(error) }
  }
}

/**
 * Rewrite the whole queue atomically (status changes only; append stays the hot path).
 * **自己不加锁**：整表替换必须与调用方的"先读"处在同一个临界区里，所以只由
 * `updateInboxStatus()` 在 `withFileLock(<inbox file>)` 内调用。裸调本函数 = 丢更新（已复现）。
 */
export function rewriteInbox(stateDir, key, records) {
  const file = inboxFileFor(stateDir, key)
  const body = records.map((record) => JSON.stringify(record)).join('\n') + (records.length ? '\n' : '')
  try {
    // 唯一名 tmp（`<file>.<pid>.<rand>.tmp`）+ rename 重试 ≤10 次 × 10ms：与
    // registrations.js:281-308 的 writeAtomicUnique **同款，勿各写一套**。
    // 旧写法（固定名 `<file>.tmp` + 单次 rename）在并发重写同一队列时会 ENOENT 或
    // 静默覆盖别人的整表（审计 P1-02 已复现）。
    const written = writeAtomicUnique(file, body)
    return { ok: true, file, bytes: written.bytes }
  } catch (error) {
    return { ok: false, file, error: messageOf(error) }
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:338-344](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L338-L344)

每次投递消息新UUID。

```text
export function domainMessage({ self, envelope }) {
  return {
    id: randomUUID(),
    role: 'user',
    content: [{ type: 'text', text: envelope }],
    source: { kind: PLUGIN, senderSessionId: self?.id ?? null },
  }
```

**依据 5 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/session-factory.js:779-812](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/session-factory.js#L779-L812)

改会话模型后best-effort恢复全局默认。

<details>
<summary>查看原文（34行）</summary>

```text
  const request = { sessionId, provider, model }
  if (reasoningEffort) request.reasoningEffort = reasoningEffort
  try {
    await dispatch.selectModel(request)
    out.ok = true
    out.applied = 'next-request'
  } catch (error) {
    // Keep the host failure code verbatim (`session/writer-held`, `session/not-found`, ...).
    out.reason = typeof error?.code === 'string' && error.code ? error.code : messageOf(error)
    out.error = messageOf(error)
  }

  // selectModel's background side effect (saveSelection of the new choice) is undone here.
  const mustRestore = Boolean(before.raw) && !sameModelChoice(before.raw, { provider, model, reasoningEffort })
  const chosen = { provider, model, ...(reasoningEffort ? { reasoningEffort } : {}) }
  if (!mustRestore) {
    out.globalDefault.after = out.previous
    out.globalDefault.afterSource = before.raw ? 'unchanged' : 'no-previous'
  } else if (!defaults || typeof defaults.saveSelection !== 'function') {
    out.globalDefault.after = chosen
    out.globalDefault.afterSource = 'assumed-selected'
    out.globalDefault.error = before.error || 'agentDefaultModel-unavailable'
  } else {
    try {
      await defaults.saveSelection(before.raw)
      out.globalDefault.restored = true
      out.globalDefault.after = out.previous
      out.globalDefault.afterSource = 'restored-previous'
    } catch (error) {
      // Never pretend the restore worked: selectModel most likely left the choice as global default.
      out.globalDefault.after = chosen
      out.globalDefault.afterSource = 'assumed-selected'
      out.globalDefault.error = messageOf(error)
    }
```

</details>

#### 缺口

- 追加/重写跨进程交错、投递成功后崩溃及并发模型切换缺本轮故障注入。
  **影响**：不能给exactly-once、持久不丢或全局默认无干扰保证。
  **进一步探讨**：固定同一inbox，在load后暂停重写并追加新行，再放行rename；另在投递后终态前中断，核队列与接收计数。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 部署与恢复依赖哪些宿主和数据条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要匹配DSH0.2接口、有效tools/agents以及域名册和可写stateDir；会话工厂、工作区绑定、模型分派、Web命令等按服务可用性降级，不是注册成功就全部可用。域负责人和项目名属于声明身份，需要维护并确认归属。

恢复要分create、attach、pin、model、queue、wake和业务消费核对；源码把已创建但入组失败与根本未创建分开，避免重试盲建第二会话。持久状态位于宿主本地，外层访问控制与执行权限仍必须成立。默认新域会话workspace-write是收窄默认，不等批准任意业务写入。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/bridge.js:53-78](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/bridge.js#L53-L78)

强注入及默认workspace-write。

<details>
<summary>查看原文（26行）</summary>

```text
export default {
  name: 'domain-bridge',
  // sessionController / workspaceRegistry are deliberately NOT injected: a missing service must
  // degrade into an honest {created:false, reason} + pinned report, never into a loader failure.
  // See getSessionController() and getWorkspaceRegistry().
  inject: ['tools', 'agents'],
  apply(ctx, rawConfig) {
    try {
      // portable: every machine-specific path comes from the portable runtime layer
      // (deployment config > <home>/config.json > env > <home> defaults). A missing/broken home or
      // config degrades to empty/candidate paths that the readers already treat as "no data", so
      // apply still registers all 11 tools and reports "0 domains" instead of throwing.
      const runtime = resolveRuntime(rawConfig)
      const config = {
        home: runtime.home,
        configFile: runtime.configFile,
        indexFile: runtime.indexFile,
        domainsFile: runtime.domainsFile,
        ownerCli: runtime.ownerCli,
        // v0.3.3: 新建域会话建完立刻设的权限档名（部署里可用 read-only / workspace-write /
        // danger-full-access；'' / 'none' / 'keep' / 'skip' ＝ 不动，保持宿主默认）。
        // 写成 !== undefined 而不是 ||，这样配置里显式写 '' 才算「关掉」，不会被默认值顶掉。
        // v0.6.4（安全默认）：缺省值由 danger-full-access 收窄为 workspace-write。后台域会话无人值守
        // 仍不会卡在「等人点同意」，但不再默认拿到全盘写权限；要 danger-full-access 必须自己显式配置。
        domainSessionPreset:
          rawConfig && rawConfig.domainSessionPreset !== undefined
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/session-factory.js:1960-2002](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/session-factory.js#L1960-L2002)

创建成功/入组失败拆开回执。

<details>
<summary>查看原文（43行）</summary>

```text
          // (a) The attach half failed AFTER the session was created => retrying would leave a
          //     second orphan session. Keep the identity the host reported and report honestly.
          const attachFailure = workspaceId === null ? null : attachFailureOf(error)
          if (attachFailure) {
            workspaceInfo.attached = false
            workspaceInfo.attachError = attachFailure.error
            created = attachFailure.sessionId === null ? {} : { sessionId: attachFailure.sessionId }
          } else if (workspaceId !== null) {
            // (b) The workspaceId request failed outright (e.g. workspace/not-found) => degrade to
            //     the byte-identical v0.3.1 {cwd} request, ONCE. A second failure is final.
            workspaceInfo.attached = false
            workspaceInfo.createFallback = true
            workspaceInfo.createFallbackError = messageOf(error)
            try {
              created = await controller.create(cwdRequest)
            } catch (second) {
              return {
                created: false,
                reason: 'create-failed',
                error: messageOf(second),
                firstError: workspaceInfo.createFallbackError,
                request: cwdRequest,
                workspace: workspaceInfo,
                self,
              }
            }
          } else {
            return { created: false, reason: 'create-failed', error: messageOf(error), request, workspace: workspaceInfo, self }
          }
        }

        const sessionId =
          created && typeof created.sessionId === 'string' && created.sessionId ? created.sessionId : null
        if (!sessionId) {
          if (workspaceInfo.attachError !== null) {
            // The session exists and the host said so, but no id came back: report, NEVER rebuild.
            return {
              created: true,
              session: null,
              reason: 'created-but-workspace-attach-failed',
              error: workspaceInfo.attachError,
              request,
              workspace: workspaceInfo,
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/hub.js:41-47](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/hub.js#L41-L47)

GUI资源目录独立，缺home/资源可为空态。

```text
/** 工作台资源目录：显式配置优先，否则 `<home>/space`；都没有 ⇒ ''（调用方回空态）。 */
export function hubDirOf(config) {
  const explicit = config && config.spaceDir ? String(config.spaceDir).trim() : ''
  if (explicit) return explicit
  const home = config && config.home ? String(config.home).trim() : ''
  if (!home) return ''
  return path.join(home, 'space')
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何计算每条正确处理消息的总成本？

**研究主题**：效果与总成本

#### 完整回答

计量单位应为正确域最终完成处理且无重复副作用的消息，而非一个工具调用或一条delivered。首次需定义域、声明负责人、模型和权限、备份状态；持续含名册/状态/inbox I/O、队列审阅以及followup/steer唤起模型的token；inject本身不立即跑回合，但内容进入后续上下文也有成本。

恢复需要查statusWriteFailures、锁、delivering TTL和实际接收侧效果，必要时人工去重。列表最多返回200条是展示上限，loadInboxes先读所有队列，不能据limit推全部读取内存有界。同步文件读写和阻塞锁等待会占Host事件循环，实际规模/延迟未测。金额、合格率、重复率和每百条人工分钟均未知。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:358-371](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L358-L371)

模式对是否立即跑模型有区别。

<details>
<summary>查看原文（14行）</summary>

```text
export function deliverToAgent(agent, mode, payload) {
  if (mode === 'steer') {
    if (typeof agent?.steer !== 'function') return { ok: false, reason: 'steer-unsupported' }
    agent.steer(payload)
    return { ok: true, reason: null }
  }
  if (mode === 'inject') {
    if (typeof agent?.inject !== 'function') return { ok: false, reason: 'inject-unsupported' }
    agent.inject(payload)
    return { ok: true, reason: null }
  }
  if (typeof agent?.followup !== 'function') return { ok: false, reason: 'followup-unsupported' }
  agent.followup(payload)
  return { ok: true, reason: null }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:2090-2119](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L2090-L2119)

展示limit与先全量loadInboxes不同。

<details>
<summary>查看原文（30行）</summary>

```text
export function buildListDomainQueueTool(ctx, config) {
  return tool(
    'list_domain_queue',
    '**只读：列出插件落盘队列里的消息**（v0.8.14）。发送被「已暂停」拦下时消息会落盘入队（`<stateDir>/inbox/<key>.jsonl`），这里能看见 id / 状态 / 发件人 / 入队时间 / mode / 正文摘要，配合 `withdraw_domain_message` 就能撤（也可以只给 domain 撤最新一条）。默认只看 `pending`；`status` 可给 pending / delivering / delivered / failed / withdrawn / all。`domain` 可写域短名、`项目:域`、或会话 id（短号也行）。**边界**：这只管插件自己的队列——宿主 composer 里显示的「N 条排队消息」不在里面，插件看不见也撤不回（宿主边界）。',
    {
      domain: { type: 'string', description: '可选：只看某个队列（域短名 / `项目:域` / 会话 id 或短号）。不给就扫全部队列。' },
      status: { type: 'string', description: 'pending（默认）| delivering | delivered | failed | withdrawn | all。' },
      mine: { type: 'boolean', description: '默认 false；true ＝ 只看本会话（调用者）发出的。' },
      limit: { type: 'number', description: '最多返回多少条（默认 50，最大 200），按入队时间倒序。' },
    },
    async (args, exec) => {
      const self = describe(exec?.agent, emptyIndex())
      const statusArg = String(args.status ?? 'pending').trim().toLowerCase() || 'pending'
      const allowed = [INBOX_PENDING, INBOX_DELIVERING, INBOX_DELIVERED, INBOX_FAILED, INBOX_WITHDRAWN, 'all']
      if (!allowed.includes(statusArg)) {
        return {
          action: 'queue',
          outcome: 'invalid',
          reason: 'bad-status',
          status: statusArg,
          allowed,
          self,
          hint: 'status 只能是 pending / delivering / delivered / failed / withdrawn / all。',
        }
      }
      const limitRaw = Number(args.limit ?? 50)
      const limit = Number.isFinite(limitRaw) ? Math.min(200, Math.max(1, Math.trunc(limitRaw))) : 50
      const mineOnly = args.mine === true
      const domainArg = args.domain === undefined || args.domain === null ? '' : String(args.domain).trim()
      const inboxes = loadInboxes(config.stateDir)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/registrations.js:184-198](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/registrations.js#L184-L198)

同步wx及有界等待带资源负担。

<details>
<summary>查看原文（15行）</summary>

```text
  const payload = JSON.stringify({ pid: process.pid, at: new Date().toISOString() })
  let acquired = false
  let lastError = null
  for (let attempt = 0; attempt <= LOCK_RETRIES && !acquired; attempt++) {
    if (attempt > 0) sleepSync(LOCK_WAIT_MS)
    try {
      fs.writeFileSync(lockFile, payload, { flag: 'wx' })
      acquired = true
    } catch (error) {
      if (!lockContention(error, lockFile)) {
        return { ok: false, value: null, reason: 'lock-failed', error: messageOf(error) }
      }
      lastError = error
    }
  }
```

</details>

#### 缺口

- 真实消息工作负载下重复/漏投、模型token及恢复人工无同条件数据。
  **影响**：无法计算单位合格任务成本或净节时。
  **进一步探讨**：合成与授权真实批次分别记录排队到业务完成的全链时长、现金/usage、重试和人工恢复，不只计API成功。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 列表、回执和工作台分别能证明什么？

**研究主题**：工程质量与复用

#### 完整回答

list_domain_queue默认只看pending，可按目标/status/mine筛选，返回消息id、状态、发送者、时间和80字节预览，便于撤回与恢复；它明确不管理宿主composer队列。delivering是中间态，终态delivered只是宿主入口接受，不能抹去failed、状态写失败或业务未消费。

工程上可借鉴统一状态口径、逐阶段回执、持锁认领和JSON出口；工具注册失败会warn并给空disposer，故启动日志不等全部工具可见。文件中的作者“已复现/测试”注释是作者证据，本轮只查源码，不继承其运行通过。新增hub只是固定静态资源服务，GUI本体在外部space目录，不因路由存在就认为看板已部署。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:2090-2119](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L2090-L2119)

插件队列与宿主队列边界。

<details>
<summary>查看原文（30行）</summary>

```text
export function buildListDomainQueueTool(ctx, config) {
  return tool(
    'list_domain_queue',
    '**只读：列出插件落盘队列里的消息**（v0.8.14）。发送被「已暂停」拦下时消息会落盘入队（`<stateDir>/inbox/<key>.jsonl`），这里能看见 id / 状态 / 发件人 / 入队时间 / mode / 正文摘要，配合 `withdraw_domain_message` 就能撤（也可以只给 domain 撤最新一条）。默认只看 `pending`；`status` 可给 pending / delivering / delivered / failed / withdrawn / all。`domain` 可写域短名、`项目:域`、或会话 id（短号也行）。**边界**：这只管插件自己的队列——宿主 composer 里显示的「N 条排队消息」不在里面，插件看不见也撤不回（宿主边界）。',
    {
      domain: { type: 'string', description: '可选：只看某个队列（域短名 / `项目:域` / 会话 id 或短号）。不给就扫全部队列。' },
      status: { type: 'string', description: 'pending（默认）| delivering | delivered | failed | withdrawn | all。' },
      mine: { type: 'boolean', description: '默认 false；true ＝ 只看本会话（调用者）发出的。' },
      limit: { type: 'number', description: '最多返回多少条（默认 50，最大 200），按入队时间倒序。' },
    },
    async (args, exec) => {
      const self = describe(exec?.agent, emptyIndex())
      const statusArg = String(args.status ?? 'pending').trim().toLowerCase() || 'pending'
      const allowed = [INBOX_PENDING, INBOX_DELIVERING, INBOX_DELIVERED, INBOX_FAILED, INBOX_WITHDRAWN, 'all']
      if (!allowed.includes(statusArg)) {
        return {
          action: 'queue',
          outcome: 'invalid',
          reason: 'bad-status',
          status: statusArg,
          allowed,
          self,
          hint: 'status 只能是 pending / delivering / delivered / failed / withdrawn / all。',
        }
      }
      const limitRaw = Number(args.limit ?? 50)
      const limit = Number.isFinite(limitRaw) ? Math.min(200, Math.max(1, Math.trunc(limitRaw))) : 50
      const mineOnly = args.mine === true
      const domainArg = args.domain === undefined || args.domain === null ? '' : String(args.domain).trim()
      const inboxes = loadInboxes(config.stateDir)
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:2152-2168](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L2152-L2168)

列表带明确身份与预览。

<details>
<summary>查看原文（17行）</summary>

```text
        for (const record of records) {
          const status = record.status ?? null
          if (statusArg !== 'all' && status !== statusArg) continue
          if (mineOnly && String(record.from ?? '') !== String(self.id ?? '')) continue
          entries.push({
            id: record.id ?? null,
            key,
            scope: queueScopeOf(key),
            status,
            mode: record.mode ?? null,
            from: record.from ?? null,
            fromShort: shortId(record.from) ?? null,
            replyTo: record.replyTo ?? null,
            queuedAt: record.at ?? null,
            preview: clipToBytes(String(record.message ?? record.content ?? ''), 80),
            pausedByScopes: Array.isArray(record.pausedByScopes) ? record.pausedByScopes : null,
            deliveredAt: record.deliveredAt ?? null,
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/tools.js:18-36](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/tools.js#L18-L36)

注册失败降级不能冒充完整启动。

<details>
<summary>查看原文（19行）</summary>

```text
/** 两 realm 兼容注册：harness 优先（动态沙箱），否则走静态包的 ctx.tools.register。永不抛。 */
export function registerTool(ctx, definition) {
  try {
    if (
      typeof harness !== 'undefined' &&
      harness &&
      typeof harness.defineTool === 'function' &&
      typeof harness.registerTool === 'function'
    ) {
      return harness.registerTool(ctx, harness.defineTool(definition))
    }
    if (ctx && ctx.tools && typeof ctx.tools.register === 'function') {
      return ctx.tools.register(definition)
    }
    warn(`no tool registration API available; "${definition.name}" not registered`)
  } catch (error) {
    warn(`tool registration failed for "${definition.name}": ${error?.message || String(error)}`)
  }
  return () => {}
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:849-862](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L849-L862)

delivered说明只接受入inbox。

<details>
<summary>查看原文（14行）</summary>

```text
      return {
        delivered: true,
        mode,
        ...resolution,
        target: targetInfo,
        // v0.4.1: 只在这一轮**真的拉过活**（liveBefore=false 且成功）时才多这个键 ——
        // 目标本来就在线时，回执与 v0.3.6 逐字一致（一个键都不多）。
        ...(woke && woke.attempted && !woke.liveBefore ? { woke } : {}),
        ...(wokeAtDelivery ? { wokeAtDelivery } : {}),
        ...overrideNote,
        ...unresolvedNote,
          ...unreadableNote,
        self,
        note: '已接受进对方 inbox（本调用只返回"已送达"，不会返回对方的回复；对方会另发一条消息回来）。',
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 稳定消费收据能否补上投递租约后的不确定窗口？

**研究主题**：新假设与验证

#### 完整回答

假设不是再加一个已有的delivering租约，而是在其上引入稳定message_id/解析版本、接收端去重与消费确认、租约fencing token，并把追加与重写纳入同一并发协议。由“投出但终态失败后会重投”和“每次domainMessage新UUID”推导，目标是区分入队、宿主接受与业务完成，消除模糊重放。

最小对照用本版与原型，覆盖并行drain、append与rename交错、投递成功后崩溃、超期旧投递者回写和暂停文件损坏，核重复副作用、漏消息、误拒绝与恢复人时。若稳定ID仍不被接收端消费逻辑采用，或确认负担大却不减少错误，应否定净收益；假设尚未实现，不能计为本版贡献。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:1247-1257](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L1247-L1257)

明确承认状态失败后重投的窗口。

<details>
<summary>查看原文（11行）</summary>

```text
      if (attempt.ok) {
        const wrote = updateInboxStatus(config.stateDir, key, id, INBOX_DELIVERED, {
          deliveredAt: new Date().toISOString(),
          deliveredBy: self?.id ?? null,
          // 终态不保留租约字段：队列里"已投递"的记录不该看起来像还在投。
          deliveringAt: null,
          deliveringBy: null,
        })
        out.delivered.push(id)
        // 消息**确实投出去了**，但状态没写进去 ⇒ 如实记账（下次恢复可能重投一次，重复优于丢消息）。
        if (!wrote.ok) out.statusWriteFailures.push({ id, status: INBOX_DELIVERED, error: wrote.error ?? wrote.reason })
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:338-344](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L338-L344)

新UUID不等稳定消费身份。

```text
export function domainMessage({ self, envelope }) {
  return {
    id: randomUUID(),
    role: 'user',
    content: [{ type: 'text', text: envelope }],
    source: { kind: PLUGIN, senderSessionId: self?.id ?? null },
  }
```

**依据 3 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/messaging.js:128-155](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/messaging.js#L128-L155)

所有写者并发协议的推导依据。

<details>
<summary>查看原文（28行）</summary>

```text
export function appendInboxRecord(stateDir, key, record) {
  const file = inboxFileFor(stateDir, key)
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.appendFileSync(file, JSON.stringify(record) + '\n', 'utf8')
    return { ok: true, file, error: null }
  } catch (error) {
    return { ok: false, file, error: messageOf(error) }
  }
}

/**
 * Rewrite the whole queue atomically (status changes only; append stays the hot path).
 * **自己不加锁**：整表替换必须与调用方的"先读"处在同一个临界区里，所以只由
 * `updateInboxStatus()` 在 `withFileLock(<inbox file>)` 内调用。裸调本函数 = 丢更新（已复现）。
 */
export function rewriteInbox(stateDir, key, records) {
  const file = inboxFileFor(stateDir, key)
  const body = records.map((record) => JSON.stringify(record)).join('\n') + (records.length ? '\n' : '')
  try {
    // 唯一名 tmp（`<file>.<pid>.<rand>.tmp`）+ rename 重试 ≤10 次 × 10ms：与
    // registrations.js:281-308 的 writeAtomicUnique **同款，勿各写一套**。
    // 旧写法（固定名 `<file>.tmp` + 单次 rename）在并发重写同一队列时会 ENOENT 或
    // 静默覆盖别人的整表（审计 P1-02 已复现）。
    const written = writeAtomicUnique(file, body)
    return { ok: true, file, bytes: written.bytes }
  } catch (error) {
    return { ok: false, file, error: messageOf(error) }
```

</details>

#### 缺口

- 接收端是否能持久绑定稳定消息和业务效果尚无原型。
  **影响**：只能称改进假设，不能承诺exactly-once。
  **进一步探讨**：先在可丢弃计数任务上把message_id消费与副作用原子关联，比较故障后计数及恢复。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 现在适合哪类采用，何时停止？

**研究主题**：采用判断

#### 完整回答

建议观察。控制面整合、OR重评和持久投递认领有真实价值，但“正确域恰好办结一次”仍缺消费收据；状态损坏fail-open、未统一的追加/重写和外层身份条件使它不宜直接管理重要跨域副作用。

愿维护域声明的单人用户可先在无外部写入的合成会话测试暂停/恢复、队列撤回和模型分派，把每条业务结果与队列id人工对上。发现错域、重复副作用、消息消失、恢复改变别处全局模型或误把暂停当系统冻结应停止并保留文件/会话轨迹。没有同版本真实宿主验收，不给安装结论。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:1247-1257](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L1247-L1257)

状态与实际投递不原子，决定采用边界。

<details>
<summary>查看原文（11行）</summary>

```text
      if (attempt.ok) {
        const wrote = updateInboxStatus(config.stateDir, key, id, INBOX_DELIVERED, {
          deliveredAt: new Date().toISOString(),
          deliveredBy: self?.id ?? null,
          // 终态不保留租约字段：队列里"已投递"的记录不该看起来像还在投。
          deliveringAt: null,
          deliveringBy: null,
        })
        out.delivered.push(id)
        // 消息**确实投出去了**，但状态没写进去 ⇒ 如实记账（下次恢复可能重投一次，重复优于丢消息）。
        if (!wrote.ok) out.statusWriteFailures.push({ id, status: INBOX_DELIVERED, error: wrote.error ?? wrote.reason })
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/pause.js:1140-1146](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/pause.js#L1140-L1146)

损坏政策状态不阻止投递。

```text
  }
  const declarations = loadDeclarations(config.domainsFile)
  // ── v0.4.2：**重评 OR**（drain 的正确性来源）。一条 pending 能不能投，只看它目标**当下**的判定，
  // 与当初被哪一级拦下无关；仍被任何一级压着 ⇒ **保持 pending**，并说清是被谁压着。
  const press = pausePressersOfQueueKey(config, declarations, ctx, key)
  // 降级不静默：这条队列目标的状态文件读不懂 ⇒ 不拦（照常投），但把文件名带出来。
  if (press.unreadable.length) out.unreadableStateFiles = press.unreadable
```

**依据 3 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/session-factory.js:791-812](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/session-factory.js#L791-L812)

模型恢复可能失败，需停用标准。

<details>
<summary>查看原文（22行）</summary>

```text
  // selectModel's background side effect (saveSelection of the new choice) is undone here.
  const mustRestore = Boolean(before.raw) && !sameModelChoice(before.raw, { provider, model, reasoningEffort })
  const chosen = { provider, model, ...(reasoningEffort ? { reasoningEffort } : {}) }
  if (!mustRestore) {
    out.globalDefault.after = out.previous
    out.globalDefault.afterSource = before.raw ? 'unchanged' : 'no-previous'
  } else if (!defaults || typeof defaults.saveSelection !== 'function') {
    out.globalDefault.after = chosen
    out.globalDefault.afterSource = 'assumed-selected'
    out.globalDefault.error = before.error || 'agentDefaultModel-unavailable'
  } else {
    try {
      await defaults.saveSelection(before.raw)
      out.globalDefault.restored = true
      out.globalDefault.after = out.previous
      out.globalDefault.afterSource = 'restored-previous'
    } catch (error) {
      // Never pretend the restore worked: selectModel most likely left the choice as global default.
      out.globalDefault.after = chosen
      out.globalDefault.afterSource = 'assumed-selected'
      out.globalDefault.error = messageOf(error)
    }
```

</details>

<a id="research-q10"></a>

<a id="detail-section-20"></a>

### Q10 · hub固定资源和local-only判定提供了什么边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

hub通过固定表暴露7个静态资源名字，包含三个HTML页、JS、两个JSON和CSS，正确区分MIME并设nosniff/no-store；不存在任意URL拼接到用户路径的通用文件服务。缺主页面给部署提示，缺其他文件返回404，GUI本体不内嵌本组件。

localOnly只检查Host头是否localhost/127.0.0.1/[::1]，未检查socket来源、Origin或已认证用户。不能把“Host写本机”当“请求来自本机”的证明；可达远程部署和反代条件需外层webServer约束。固定文件名也不验证spaceDir内文件的符号链接真实路径或HTML/JS可信来源；同源动态脚本需维护者批准，静态白名单不等内容安全认证。

路由同步readFileSync，文件规模没有本模块上限，适合小型可信资源；本轮不打开工作台、不执行外部脚本。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/hub.js:22-33](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/hub.js#L22-L33)

实际7个白名单资源及CSS MIME。

<details>
<summary>查看原文（12行）</summary>

```text
const HUB_FILES = {
  hub: { file: 'hub.html', type: 'text/html; charset=utf-8' },
  network: { file: 'network.html', type: 'text/html; charset=utf-8' },
  topology: { file: 'topology.html', type: 'text/html; charset=utf-8' },
  'space.data.js': { file: 'space.data.js', type: 'text/javascript; charset=utf-8' },
  'space.json': { file: 'space.json', type: 'application/json; charset=utf-8' },
  'state.json': { file: 'state.json', type: 'application/json; charset=utf-8' },
  // v0.8.16：GUI 共用的视觉资产（v9 token / 卡片皮肤）外置成一份 CSS。
  // 必须按 text/css 发：浏览器对 `rel=stylesheet` 的响应做严格 MIME 检查，
  // 发成 application/octet-stream 会**整份样式被丢掉**（实测 cssRules=0，页面看着"没穿衣服"）。
  'v9-tokens.css': { file: 'v9-tokens.css', type: 'text/css; charset=utf-8' },
}
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/hub.js:50-56](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/hub.js#L50-L56)

localOnly只读Host，无socket/auth校验。

```text
/** 与 menu.js 同一口径的本机判定（Host 头，挡住跨站 / 非本机访问）。 */
function localOnly(req) {
  const host = String(req?.headers?.host || '').trim().toLowerCase()
  if (!host) return false
  if (host === '[::1]' || host.startsWith('[::1]:')) return true
  return host.startsWith('127.0.0.1:') || host.startsWith('localhost:') || host === '127.0.0.1' || host === 'localhost'
}
```

**依据 3 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/hub.js:103-125](https://github.com/1Lany2a/dsh-domain-role/blob/9df384a0556e8e1aa288f6f8d654deca0a371556/plugins/dsh-domain-bridge/lib/core/hub.js#L103-L125)

固定名字同步读文件及空态/错误响应。

<details>
<summary>查看原文（23行）</summary>

```text
export function hubRouteDefs(config) {
  const dir = hubDirOf(config)
  const defs = []
  for (const name of Object.keys(HUB_FILES)) {
    const def = HUB_FILES[name]
    const isHub = name === 'hub'
    defs.push({
      kind: 'exact',
      path: isHub ? `${PREFIX}/hub` : `${PREFIX}/hub/view/${name}`,
      handler: async (req, res) => {
        if (!localOnly(req)) return send(res, 403, 'local-only')
        if (req.method && req.method !== 'GET') return send(res, 405, 'method-not-allowed')
        if (!dir) return send(res, 200, placeholderHtml(dir), 'text/html; charset=utf-8')
        const file = path.join(dir, def.file)
        try {
          const body = fs.readFileSync(file)
          return send(res, 200, body, def.type)
        } catch (error) {
          if (error && error.code === 'ENOENT') {
            if (isHub) return send(res, 200, placeholderHtml(dir), 'text/html; charset=utf-8')
            return send(res, 404, `missing: ${def.file}`)
          }
          return send(res, 500, `unreadable: ${String((error && error.message) || error).replace(/[<&]/g, '')}`)
```

</details>

#### 缺口

- 远程/反代Host约束、space目录实际权限与页面来源未在本轮部署核对。
  **影响**：不能称local-only是独立访问控制或工作台已可安全用。
  **进一步探讨**：隔离部署分别改变Host与socket来源，核外层鉴权；审space文件、链接和大小后才加载。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
