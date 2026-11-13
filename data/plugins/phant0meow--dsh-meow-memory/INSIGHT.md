# Meow Memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[4b88599](https://github.com/Phant0Meow/dsh-meow-memory/tree/4b885996d40fc8f029cf35bae5e8f989b638c290)

<!-- BEGIN META -->
[![GitHub ★ 388](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=388&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Phant0Meow/dsh-meow-memory) [![npm 30d 36,121](https://img.shields.io/static/v1?label=npm+30d&message=36%2C121&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-memory) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-memory)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供分层、跨会话项目记忆和自动整理。

> **亮点**：[Q01](#research-q01) 将工作区记忆和压缩重注入接回宿主；[Q02](#research-q02) 通过能力探测适配两代整理模型路由。

> **主要限制**：[Q02](#research-q02) 整理后恢复依赖进程内状态和宿主选择事件，[Q03](#research-q03) 封存计数不能证明内容正确。

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
  - [Q01 · 记忆从哪里进当前会话，哪些状态会跳过？](#detail-section-11)
  - [Q02 · 整理走哪个模型，何时能恢复主模型？](#detail-section-12)
  - [Q03 · 怎样判断整理完成、主模型已恢复及净负担？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复在多个会话续接项目的用户，需要自动找回已核实的上下文。

人工维护项目笔记，开新会话手工导入，显式选择模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 记忆注入 | 续接项目上下文 | 信任及读入开关生效 |
| 整理路由 | 使用指定模型做后台整理 | 依赖宿主能力及可用模型 |
| 整理记录 | 观察封存条目 | 计数不代表事实正确 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 和 SQLite | 需要 | 事件与记忆持久化 | 停用并手工维护 |
| 可信工作区 | 注入需要 | 控制来源 | 默认暂停 |
| 可用 delegate 模型 | 可选 | 后台整理 | 不启用替换 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 用户 | 备份并用独立项目 | 不能隔离则停止 |
| 核查 | 用户 | 比较初轮及压缩后的上下文 | 回人工笔记 |
| 验收 | 用户 | 核整理后下一轮模型 | 关闭 delegate |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地存储 | 信任和配置 | 宿主未验 |
| 持续 | 上下文、整理模型及存储 | 核实事实与来源 | 净节时未知 |
| 恢复 | 备份和可能重试 | 复核模型和漏注入 | 重启未验 |
| 退出 | 记忆数据仍需核对 | 暂停读入并管理副本 | 删除边界未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 续接 | 注入与压缩恢复链 | 真实事实质量 |
| 整理 | 日志封存数及分支 | 业务完成情况 |
| 模型选择 | 新旧两代 API | 真实恢复 |

> **思考**：[Q02](#research-q02) 整理后恢复依赖进程内状态和宿主选择事件，[Q03](#research-q03) 封存计数不能证明内容正确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将工作区记忆和压缩重注入接回宿主；[Q02](#research-q02) 通过能力探测适配两代整理模型路由。

[Q01](#research-q01) 注入失败放行原消息；[Q02](#research-q02) 同一宿主按能力选择一路，恢复状态仅在内存。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 整理后恢复依赖进程内状态和宿主选择事件，[Q03](#research-q03) 封存计数不能证明内容正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 仅用非敏感项目比较注入和下一普通轮模型，不清楚时停用 delegate 与读入。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认读入门、注入、双路径模型选择和整理记账。真实回切、耗时与记忆准确率未知。

- 已检查：作者 README、包清单、源码路径 README.md、src/dream.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读宿主读入、外部信任、压缩、delegate 与梦境计数；未审完整数据库、客户端或运行目标。
- 下一步：两代宿主下分别对照首次、压缩、主动选模和整理中断，核请求路由与数据库回执。

**分析版本**

- **仓库**：[Phant0Meow/dsh-meow-memory](https://github.com/Phant0Meow/dsh-meow-memory)
- **版本号**：0.32.7（[固定提交 4b88599](https://github.com/Phant0Meow/dsh-meow-memory/tree/4b885996d40fc8f029cf35bae5e8f989b638c290)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 试验并列显示整理模型与恢复后的实际模型是否减少错认，尚未验证。

两代宿主下分别对照首次、压缩、主动选模和整理中断，核请求路由与数据库回执。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 1 | 42 | 39 | 3 | — |
| .mjs | source | 14 | 3510 | 2886 | 463 | — |
| .md | source | 47 | 3799 | — | — | 64855 |
| .ts | source | 34 | 12815 | 9069 | 3136 | — |
| .mjs | test | 18 | 4191 | 3605 | 421 | — |

</details>

**活跃度**

[![Issue 未关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/Phant0Meow/dsh-meow-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 44](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=44&color=737b86&logo=github)](https://github.com/Phant0Meow/dsh-meow-memory/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=41&color=737b86&logo=github)](https://github.com/Phant0Meow/dsh-meow-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 在读入项目记忆和后台整理时，如何确定实际注入内容、调用模型及恢复结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 记忆从哪里进当前会话，哪些状态会跳过？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

跨会话重做项目任务时，人工笔记需主动找回。插件在 agent/pre-step 等下游决定后，筛选真实用户消息、跳过子代理，并按工作区、会话和信任判断是否读库。外来未信任库先插提示后跳过读取；关闭当前会话读入同样跳过。压缩待办触发从数据库重建快照，在当前用户消息前插入并清待办。只有插件自己的检索失败被捕获后回到原消息，下游错误照常传播。持续自动复用降低主动检索步骤，记忆来源被信任不说明事实可靠。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-21](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/README.md#L12-L21)

作者描述分层、快照、压缩和信任。

<details>
<summary>查看原文（10行）</summary>

```text
- **七层记忆**：`soul`（AI 自身）/ `user`（用户信息与偏好）/ `project`（项目信息，含 `subcategory`）/ `fact`（原子事实）/ `lesson`（教训与纠正）/ `topic`（进行中的话题，带目标句）/ `rules`（设计原则与行为准则）。每层一张 SQLite 表，UUID 带时间前缀，id 顺序即创建顺序。
- **首轮注入（长期记忆块）**：第一条用户消息前注入 soul / user / 设计原则 / 记忆导引。记忆作为独立 plugin snapshot 消息放在真实 user 消息之前，**不改写用户 prompt**；**首轮不跑关键词命中**（命中从第二轮起）。
- **每消息关键词命中**：从第二条用户消息起，每条真实用户消息检索 fact/lesson/rules/topic（全局 + 当前 project 锚定），top-2 命中注入。命中基于**条目关键词**而非全文。
- **当前 project 锚定**：带 project 参数即锚定该会话的当前项目；未锚定时命中只搜全局（用户闲聊不误伤）。
- **缓存友好设计**：静态 `meow-memory:guide` section 在 system prompt 中注册一次——文本恒定，破坏不了 provider 的 KV 缓存。
- **压缩后重注入**：会话压缩后，下一轮自动重新注入长期记忆快照 + 本会话查阅过的项目全景 + 本会话写入过的记忆原文，AI 不会因为压缩突然失忆。
- **七层之上的三件事**：写入自动去重合并、按 `updated_at` 展示记忆时间戳、全局信息用全局标记（区别于留空）。
- **按窗口 dream**：窗口空闲 ≥3 小时即允许整理，由该窗口自己的主 agent 分三轮处理（原子记忆 / topic / 项目总结），**峰时抑制**（默认北京时间 09:00–12:00、14:00–18:00，API 峰谷电价峰时）不触发。也可敲 `/dream` 立刻手动整理。
- **反思**：单次任务内连续 ≥7 个工具 step 后，插件询问模型自上次整理以来是否有值得记忆的内容。最后工具是 `memory_*` 视为已主动记忆、不重复反思。
- **外部记忆库信任门**：工作区自带的 `.dsh-meow` 若非本机创建（如 clone 的外部仓库），默认暂停注入/检索/整理——首轮提示一次，`/meow-trust` 一键信任、即刻生效；本机创建与升级前打开过的工作区自动信任，正常使用零感知。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1445-1456](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/src/index.ts#L1445-L1456)

真实 pre-step 包装与失败放行。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.on('agent/pre-step', async ({ agent, messages, signal }, next) => {
    const decision = await next()
    try {
      // preStepInject 内部把 decision 当透传黑盒（any）；出口 cast 回宿主形状。
      return (await preStepInject({ agent, signal }, decision)) as typeof decision
    } catch (e) {
      try {
        ctx.logger.warn(`meow-memory: pre-step 注入失败（fail-open 放行原始消息）: ${e instanceof Error ? e.message : String(e)}`)
      } catch { /* 日志失败不阻塞 */ }
      return decision
    }
  })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1464-1498](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/src/index.ts#L1464-L1498)

会话来源、信任和读入门。

<details>
<summary>查看原文（35行）</summary>

```text
    // （如 dsh-femo 的角色上下文）。注意不能只看 parentSession——GUI fork/续写的
    // 主会话也有 parentSession（真机踩坑 2026-08-17：fca10feb 被误判为子代理导致注入全失效）。
    if (agent.session.header.origin === 'subagent') return decision
    registerLiveAgent(agent)
    const sid = sessionIdOfAgent(agent)
    const ws = workspaceOfAgent(agent)

    // 真实用户消息（跳过插件通知等，source.kind='plugin' 的进不来）。
    const userMsgs = decision.messages.filter((m: { source?: { kind?: string } }) => m.source?.kind === 'user')
    if (userMsgs.length === 0) return decision // 工具轮/纯插件消息：不注入

    // 外部记忆库信任门（#64）：.dsh-meow 非本机创建且未信任 → 全部记忆路径暂停
    //（下方重注入/首轮快照/命中链都不会走到）。首个用户消息前插一次性说明（不
    // 读库、不算注入），给出 /meow-trust 恢复方式。信任是活检查：/meow-trust 后
    // 下一轮即恢复正常注入，无需重启。提示记账在全局注册表（工作区文件可预置，
    // 不能当标记）。
    if (ws !== null && isUntrustedMemoryWorkspace(ws)) {
      if (!hasExternalNoticeShown(ws)) {
        markExternalNoticeShown(ws)
        try {
          const notice = resolveSlotText('external-memory-notice')
          const rewritten = [...decision.messages]
          rewritten.splice(rewritten.indexOf(userMsgs[0]), 0, createMemoryNoticeMessage(notice))
          ctx.logger.info('meow-memory: external memory library detected — paused until /meow-trust')
          return { ...decision, messages: rewritten }
        } catch {
          /* 提示失败不阻塞：按无提示停用处理 */
        }
      }
      return decision
    }

    // 记忆门控（issue #38/#28）：本窗口「停止读入」或工作区被配置停用 → 跳过全部
    // 注入路径（重注入/首轮快照/引导/命中链）。读的入口统一在此封口。
    if (ws !== null && memoryReadOff(ws, sid)) return decision
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1500-1518](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/src/index.ts#L1500-L1518)

压缩待办到快照注入。

<details>
<summary>查看原文（19行）</summary>

```text
    // 压缩重注入（v0.21.0）：compaction/end 成功后置位的待办——下一个含真实用户
    // 消息的请求在消息前注入「长期记忆快照 + 本会话此前查阅过的项目全景」，然后清待办。
    // 本轮不跑命中链路（等同新首轮：快照先行，命中从下一轮起）。待办置位但无可注入
    // 内容（库空且项目全空）也一并清除，避免每个用户消息轮空转重查。
    if (ws && isReinjectPending(ws, sid, resolved.projectDir)) {
      const lastUser = userMsgs[userMsgs.length - 1]
      const db = getDb(ws, resolved.projectDir)
      const reinj = buildReinjection(db, ws, sid, readProjectQueried(ws, sid, resolved.projectDir), {
        hitTopK: resolved.hitTopK,
        titleMax: resolved.titleMax,
      }, resolved.projectDir)
      clearReinjectPending(ws, sid, resolved.projectDir)
      if (reinj !== null) {
        const rewritten = [...decision.messages]
        rewritten.splice(rewritten.indexOf(lastUser), 0, createMemorySnapshotMessage(reinj.text, { kind: 'reinjection', ids: reinj.injectedIds }))
        ctx.logger.info(`meow-memory: post-compaction memory re-injected (${reinj.text.length} chars)`)
        return { ...decision, messages: rewritten }
      }
      return decision
```

</details>

#### 缺口

- 真实宿主注入内容和记忆准确率未验证
  **影响**：不能保证使用的是当前事实
  **进一步探讨**：用隔离项目对照原文、首次注入和压缩后内容

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 整理走哪个模型，何时能恢复主模型？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

配置 delegate.model 时，具 agent.model.select 的宿主在 pre-step 选择整理路由，保存主路由并按设置继承、指定或省略 effort；旧宿主改 agent/request 返回，检测到新能力则透传，两路互斥。普通轮恢复只在当前还显示 delegate 路由且没有发现用户主动选择时进行。该判断从事件尾部扫描 model/selection，遇到不同路由的 request/header 停止。记录存在有界内存 Map，重启或超出上限不保留；若宿主的事件语义变化或主动选择与插件调用被同样标记，不能仅看分支存在推断恢复成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1746-1761](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/src/index.ts#L1746-L1761)

只配置后启用，使用有界会话 Map。

<details>
<summary>查看原文（16行）</summary>

```text
  if (resolved.delegate.modelSpec !== undefined) {
    const spec = resolved.delegate.modelSpec
    const delegateEffort = resolved.delegate.effort
    // #71：sid → 主模型路由 + 我们写下的 delegate 路由（配对保存，避免把 delegate 当主模型）
    const delegateRestore = new Map<string, { main: ModelRoute; route: ModelRoute }>()
    const MAX_DELEGATE_TRACKED = 512
    const rememberOverride = (sid: string, main: ModelRoute, route: ModelRoute): void => {
      if (sid === 'unknown' || delegateRestore.has(sid)) return
      delegateRestore.set(sid, { main, route })
      // 进程级 Map 兜底上限（Map 保留插入序）：只保最近 MAX_DELEGATE_TRACKED 个会话
      while (delegateRestore.size > MAX_DELEGATE_TRACKED) {
        const oldest = delegateRestore.keys().next().value
        if (oldest === undefined) break
        delegateRestore.delete(oldest)
      }
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1766-1801](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/src/index.ts#L1766-L1801)

新版 select、effort 和恢复。

<details>
<summary>查看原文（36行）</summary>

```text
    ctx.on('agent/pre-step', async (payload: { agent?: { model?: { select?: unknown }; session?: { header?: SessionHeaderLike } }; modelSelection?: unknown }, next: () => Promise<unknown>) => {
      const agent = payload?.agent
      // 运行时能力检测：宿主没有 agent.model.select（≤0.2.1.x）→ 本 listener 不作为，
      // 覆盖由下方 agent/request waterfall 承担。两路互斥，同一宿主只走一条。
      if (agent === undefined || typeof (agent as { model?: { select?: unknown } }).model?.select !== 'function') return next()
      if (agent.session?.header?.origin === 'subagent') return next()
      const sel = payload.modelSelection as ModelRoute | undefined
      const sid = sessionIdOfAgent(agent as never)
      const events = sessionEventsOf(agent.session as never)
      if (isMemoryTaskTurn(events)) {
        const route: ModelRoute = { provider: spec.provider ?? sel?.provider, model: spec.model ?? sel?.model }
        rememberOverride(sid, mainRouteOf(sel ?? {}), route)
        ctx.logger.info(`meow-memory: memory task turn → model override ${route.provider}/${route.model}${delegateEffort === undefined ? ' (effort stripped)' : ` (effort ${delegateEffort})`}`)
        // #98 effort 语义映射到 select：strip=缺省（0.2.2 文档：omitted effort follows
        // adapter defaults，天然=剥离）；inherit=传主模型当前 effort；显式值原样传。
        ;(agent as unknown as { model: { select: (s: ModelRoute) => void } }).model.select(
          delegateEffort === 'inherit' && sel?.reasoningEffort !== undefined
            ? { provider: route.provider, model: route.model, reasoningEffort: String(sel.reasoningEffort) }
            : delegateEffort !== undefined && delegateEffort !== 'inherit'
              ? { provider: route.provider, model: route.model, reasoningEffort: delegateEffort }
              : { provider: route.provider, model: route.model },
        )
        return next()
      }
      const remembered = delegateRestore.get(sid)
      if (remembered === undefined) return next() // 没覆盖过 / 已还原：零开销放行
      delegateRestore.delete(sid)
      if (userSelectedAfterOverride(events, remembered.route)) return next()
      if (sel?.provider !== remembered.route.provider || sel?.model !== remembered.route.model) return next() // 用户换了别的模型：放行
      ctx.logger.info(`meow-memory: restore main model ${remembered.main.provider}/${remembered.main.model} after memory task turn`)
      ;(agent as unknown as { model: { select: (s: ModelRoute) => void } }).model.select({
        provider: remembered.main.provider,
        model: remembered.main.model,
        ...(remembered.main.reasoningEffort === undefined ? {} : { reasoningEffort: remembered.main.reasoningEffort }),
      })
      return next()
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1803-1843](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/src/index.ts#L1803-L1843)

旧版请求改写和条件恢复。

<details>
<summary>查看原文（41行）</summary>

```text
    ctx.on('agent/request', async (payload: { agent?: { model?: { select?: unknown }; session?: { header?: SessionHeaderLike } } }, next: () => Promise<unknown>) => {
      const config = await next() as ModelRoute
      const agent = payload?.agent
      // #110：0.2.2+ 宿主（有 agent.model.select）禁止 waterfall 改 route——路由由
      // 上方 pre-step select 承担，此处只透传（改了会整轮失败）。
      if (agent === undefined || typeof (agent as { model?: { select?: unknown } }).model?.select === 'function') return config
      if (agent.session?.header?.origin === 'subagent') return config
      const sid = sessionIdOfAgent(agent)
      const events = sessionEventsOf(agent.session as never)
      if (isMemoryTaskTurn(events)) {
        // 只在本会话还没记过时记：同一反思轮第 2 步起解析出的是我们写下的 delegate 路由，
        // 记错会把 delegate 存成主模型（真机日志一次反思有 2 个 header）。无会话 id 不记（防串会话）。
        const route: ModelRoute = { provider: spec.provider ?? config.provider, model: spec.model ?? config.model }
        if (sid !== 'unknown' && !delegateRestore.has(sid)) {
          delegateRestore.set(sid, { main: mainRouteOf(config), route })
          // 进程级 Map 兜底上限（Map 保留插入序）：只保最近 MAX_DELEGATE_TRACKED 个会话
          while (delegateRestore.size > MAX_DELEGATE_TRACKED) {
            const oldest = delegateRestore.keys().next().value
            if (oldest === undefined) break
            delegateRestore.delete(oldest)
          }
        }
        ctx.logger.info(`meow-memory: memory task turn → model override ${spec.provider ?? '(inherit)'}/${spec.model ?? ''}${resolved.delegate.effort === undefined ? ' (effort stripped)' : ` (effort ${resolved.delegate.effort})`}`)
        // #98：effort 随覆盖一并处理（ ReasoningEffortId 是模型声明的不透明值，无法
        // 在覆盖点探测目标模型支持什么——默认剥离，显式配置才下发）。
        const { reasoningEffort: _mainEffort, ...rest } = config
        return {
          ...rest,
          ...(spec.provider !== undefined ? { provider: spec.provider } : {}),
          ...(spec.model !== undefined ? { model: spec.model } : {}),
          ...(resolved.delegate.effort !== undefined && resolved.delegate.effort !== 'inherit' ? { reasoningEffort: resolved.delegate.effort } : resolved.delegate.effort === 'inherit' && _mainEffort !== undefined ? { reasoningEffort: String(_mainEffort) } : {}),
        }
      }
      const remembered = delegateRestore.get(sid)
      if (remembered === undefined) return config // 没覆盖过 / 已还原：零开销放行
      delegateRestore.delete(sid)
      if (userSelectedAfterOverride(events, remembered.route)) return config
      if (config.provider !== remembered.route.provider || config.model !== remembered.route.model) return config // 用户换了别的模型：放行
      ctx.logger.info(`meow-memory: restore main model ${remembered.main.provider}/${remembered.main.model} after memory task turn`)
      const { reasoningEffort: _inherited, ...rest } = config
      return { ...rest, provider: remembered.main.provider, model: remembered.main.model, ...(remembered.main.reasoningEffort === undefined ? {} : { reasoningEffort: remembered.main.reasoningEffort }) }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:572-589](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/src/index.ts#L572-L589)

事件区分和尾部扫描。

<details>
<summary>查看原文（18行）</summary>

```text
function mainRouteOf(config: ModelRoute): ModelRoute {
  return { provider: config.provider, model: config.model, ...(config.reasoningEffort === undefined ? {} : { reasoningEffort: String(config.reasoningEffort) }) }
}

// #71：覆盖之后用户是否亲手选过模型？宿主 selectForNextRequest 会 append model/selection。
// 反向扫描：先撞到 model/selection = 用户选择（含选中 delegate 本身）；先撞到路由不等于
// delegate 的 request/header = 覆盖之前的历史，结束（覆盖前后的 header 都是 delegate/主模型，
// 不会误判）。零分配，O(尾部事件)。
function userSelectedAfterOverride(events: readonly unknown[], route: ModelRoute): boolean {
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i] as { type?: string; data?: { header?: { config?: ModelRoute } } } | undefined
    if (e?.type === 'model/selection') return true
    if (e?.type === 'request/header') {
      const c = e.data?.header?.config
      if (c?.provider !== route.provider || c?.model !== route.model) return false
    }
  }
  return false
```

</details>

#### 缺口

- 新旧宿主 model/selection 实际来源与重启恢复未测
  **影响**：下一普通轮可能需人工确认 provider/model
  **进一步探讨**：在两代宿主分别跑整理、主动改模型、中止与重启，记录下一轮有效路由

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样判断整理完成、主模型已恢复及净负担？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

正常梦境收尾先停止心跳，封存条目、标记 finish，再写真实 stamped/groups 计数。已中断分支按重试上限释放或封存；计数是封存量，不能替代事实质量、完整保留或模型费用。隔离项目用几条有原文的笔记复核记忆和实际 provider，再比较人工笔记与自动注入时的模型请求、复核和退出负担。假设同时展示本轮有效模型和下一轮实际恢复可减少误判，基线是当前日志及用户模型控件；若对正确辨认无增益，不增加提示。异常时停用 delegate、暂停读入并回人工笔记。

#### 证据与依据

**依据 1 · 源码核查**：[src/dream.ts:461-477](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/src/dream.ts#L461-L477)

正常收尾及日志计数边界。

<details>
<summary>查看原文（17行）</summary>

```text
/** 收尾：封存全部条目（updated_at=T）+ 清租约 + 记 last_dream_time。失败不阻塞（日志兜底）。 */
function finalizeDream(db: ReturnType<typeof getDb>, sessionId: string, workspace: string, dir: string, T: number, reason: 'done' | 'aborted', groupsCount: number, onDreamState?: DreamStateCallback): void {
  stopDreamHeartbeat(sessionId) // 租约即清，心跳立刻退役（不等下一个 60s tick 自愈）
  try {
    const stamped = db.stampDream(sessionId, T)
    db.finishDream(sessionId, Date.now())
    db.logDream(
      `window dream ${reason}: ${shortSessionId(sessionId)} groups=${groupsCount} stamped=${stamped} T=${new Date(T).toISOString()}`,
      // #108：changes 落真实计数（此前两处调用硬编码 {before:undefined,after:undefined}
      // → JSON {}，查库的人会误读成"什么都没改"）。stamped=本轮封存/完结条目数。
      { stamped, groups: groupsCount },
    )
    dreamLog(workspace, dir, `dream ${reason} session=${shortSessionId(sessionId)} groups=${groupsCount} stamped=${stamped}`)
    onDreamState?.(sessionId, 'dreamed')
  } catch (e) {
    dreamLog(workspace, dir, `dream ${reason} finish error: ${String(e)}`)
  }
```

</details>

**依据 2 · 源码核查**：[src/dream.ts:631-645](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/src/dream.ts#L631-L645)

中断重试或封存回执。

<details>
<summary>查看原文（15行）</summary>

```text
      db.releaseDream(sessionId)
      dreamLog(workspace, dir, `dream recovered zero-progress session=${shortSessionId(sessionId)} fails=${fails}/${DREAM_MAX_ATTEMPTS} -> released (retry next sweep)`)
      return 0
    }
    dreamLog(workspace, dir, `dream recovered zero-progress session=${shortSessionId(sessionId)} fails=${fails} -> sealed (cap reached)`)
    console.warn(`[meow-memory] dream 连续失败 ${fails} 次后中断（窗口 ${shortSessionId(sessionId)}），按封存收尾不再自动重试；该窗口正常对话产生新活动后可重新自动整理，或手动 /dream`)
  }
  const stamped = db.stampDream(sessionId, T)
  db.finishDream(sessionId, Date.now())
  db.logDream(
    `window dream recovered (interrupted): ${shortSessionId(sessionId)} stamped=${stamped} T=${new Date(T).toISOString()}`,
    { stamped }, // #108：changes 落真实计数，不再硬编码空对象
  )
  dreamLog(workspace, dir, `dream recovered session=${shortSessionId(sessionId)} stamped=${stamped}`)
  return stamped
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1790-1801](https://github.com/Phant0Meow/dsh-meow-memory/blob/4b885996d40fc8f029cf35bae5e8f989b638c290/src/index.ts#L1790-L1801)

已有主模型恢复观测点。

<details>
<summary>查看原文（12行）</summary>

```text
      const remembered = delegateRestore.get(sid)
      if (remembered === undefined) return next() // 没覆盖过 / 已还原：零开销放行
      delegateRestore.delete(sid)
      if (userSelectedAfterOverride(events, remembered.route)) return next()
      if (sel?.provider !== remembered.route.provider || sel?.model !== remembered.route.model) return next() // 用户换了别的模型：放行
      ctx.logger.info(`meow-memory: restore main model ${remembered.main.provider}/${remembered.main.model} after memory task turn`)
      ;(agent as unknown as { model: { select: (s: ModelRoute) => void } }).model.select({
        provider: remembered.main.provider,
        model: remembered.main.model,
        ...(remembered.main.reasoningEffort === undefined ? {} : { reasoningEffort: remembered.main.reasoningEffort }),
      })
      return next()
```

</details>

#### 缺口

- 单位合格项目续接的模型调用和人工核对成本未知
  **影响**：不能将后台整理换成净节时承诺
  **进一步探讨**：比较同一任务并计反思、梦境和纠错全部开销

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
