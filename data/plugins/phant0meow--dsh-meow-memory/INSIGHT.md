# meow-memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[86a85a2](https://github.com/Phant0Meow/dsh-meow-memory/tree/86a85a2926e61d4aa643cce9c83540f06d961ea1)

<!-- BEGIN META -->
[![GitHub ★ 342](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=342&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Phant0Meow/dsh-meow-memory) [![npm 30d 20,717](https://img.shields.io/static/v1?label=npm+30d&message=20%2C717&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-memory) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-memory)
<!-- END META -->

> **功能**：为 DSH 提供跨会话项目记忆、召回和自动整理。

> **亮点**：将项目记忆、压缩后重注入和外部库信任门接入宿主；效果与节时未对照。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：注入失败会放行无记忆的原消息；信任来源不保证事实准确或以后无污染。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 跨会话记忆比人工项目笔记多什么？](#detail-section-11)
  - [Q02 · 首轮与压缩后注入的接线和失败分支是什么？](#detail-section-12)
  - [Q03 · 外部记忆信任门能证明内容可信吗？](#detail-section-13)
  - [Q04 · 如何试用和退出而不把注入当事实？](#detail-section-14)
  - [Q05 · 怎样检验可见的召回依据能否减少误用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望跨会话复用项目事实的 DSH 用户；基线是人工笔记与显式检索。[Q01](#research-q01)

人工维护 Markdown/AGENTS.md 并按需检索核对。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 记忆注入 | 带入项目背景 | 失败可放行无注入 |
| 外部库信任 | 阻止未经信任的库 | 信任不证明事实 |
| 整理 | 组织长期记忆 | 模型与资源成本未知 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Node SQLite | 必需 | 事件与数据库 | 不启用 |
| 明确工作区与可信库 | 必需 | 隔离和注入 | 外部库暂停 |
| 用户事实核验 | 持续需要 | 纠正记忆 | 不依赖输出 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离项目和非敏感样本 | 核对存储 |
| 试验 | 验证首轮、命中和压缩 | 对照原事实 |
| 退出 | 停用并按留存策略处理 | 串扰立即停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地存储 | 项目和信任配置 | 宿主未测 |
| 持续 | 模型上下文与整理成本未知 | 修正记忆 | 节时未测 |
| 恢复 | 数据备份 | 检查漏注入与清理 | 删除完整性未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 注入 | pre-step 处理与失败放行 | 真实召回质量 |
| 信任 | 未信任外部库暂停 | 内容事实正确 |

> **思考**：注入失败会放行无记忆的原消息；信任来源不保证事实准确或以后无污染。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将项目记忆、压缩后重注入和外部库信任门接入宿主；效果与节时未对照。[Q01](#research-q01) [Q02](#research-q02)

先执行下游 decision，插件注入异常 fail-open；外部库有独立信任门。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

注入失败会放行无记忆的原消息；信任来源不保证事实准确或以后无污染。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离项目核验首轮、压缩和外部库；错误时停用并回人工笔记。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 pre-step 失败和外部库暂停；未运行宿主、模型或数据库。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/trust.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 114 个指定扩展名文件、无排除或解析错误；静态核查 pre-step 与信任，未运行宿主或数据库。
- 下一步：固定 DSH 和 Node，用隔离项目检验首轮、压缩、错误及信任撤销。

**分析版本**

- **仓库**：[Phant0Meow/dsh-meow-memory](https://github.com/Phant0Meow/dsh-meow-memory)
- **版本号**：0.32.4（[固定提交 86a85a2](https://github.com/Phant0Meow/dsh-meow-memory/tree/86a85a2926e61d4aa643cce9c83540f06d961ea1)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：显示来源、项目、确认时间及失败状态可减少误用；须比较现有信任门与人工笔记。[Q05](#research-q05)

固定 DSH 和 Node，用隔离项目检验首轮、压缩、错误及信任撤销。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 1 | 42 | 39 | 3 | — |
| .mjs | source | 14 | 3404 | 2796 | 448 | — |
| .md | source | 47 | 3796 | — | — | 64104 |
| .ts | source | 34 | 12596 | 8908 | 3077 | — |
| .mjs | test | 18 | 4124 | 3546 | 415 | — |

</details>

**活跃度**

[![近30天关闭 37](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=37&color=737b86&logo=github)](https://github.com/Phant0Meow/dsh-meow-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨会话 SQLite 记忆如何注入和信任，失败及误用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨会话记忆比人工项目笔记多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望在 DSH 不同会话复用项目事实和偏好的用户；人工维护 Markdown 或 AGENTS.md 并自行检索是基线。插件把结构化存储、首轮快照、关键词命中、压缩后重注入与空闲整理组织起来，减少手动搬运；但作者功能描述和静态代码不能证明事实正确、节省 token 或改进任务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-23](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/README.md#L12-L23)

作者描述快照、项目和整理。

<details>
<summary>查看原文（12行）</summary>

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
- **客户端 UI**：注入文本折叠成横条、反思/dream 轮折叠成一条可展开的卡片、会话列表显示 dream 状态图标（🌙 已整理 / 呼吸灯 进行中 / 灰月牙斜杠 已跳过）。
- **无需另装运行时依赖**：`node:sqlite` + esbuild 产物（`lib/index.js`）；`schemastery` 和 `dsh-llm` 由 DSH 宿主解析提供。**无原生模块。**
```

</details>

**依据 2 · 源码核查**：[package.json:1-5](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/package.json#L1-L5)

包身份与功能。

```text
{
  "name": "meow-memory",
  "version": "0.32.4",
  "description": "Cross-session project memory for DeepSeek Harness: seven-layer SQLite memory, first-turn snapshot injection, per-message keyword hits, memory_remember/search/project tools, automatic reflection with reflection-fold UI, and idle-triggered dream consolidation (peak-hour suppressed).",
  "keywords": [
```

#### 缺口

- 未运行 DSH、数据库或模型
  **影响**：不能证明召回、隔离和任务收益
  **进一步探讨**：用隔离项目核验首轮、压缩、失败和外部库

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 首轮与压缩后注入的接线和失败分支是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

pre-step 先等待下游 decision，仅 enter 且非中止、有真实用户消息时处理，子代理不注入；首轮快照与后续命中按会话状态区分，压缩后走重注入。插件内部注入异常会警告并原样放行 decision，不阻塞宿主，因此用户任务可继续但本轮可能没有记忆；不能把对话继续当召回成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1407-1430](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/src/index.ts#L1407-L1430)

首轮判定及插件异常 fail-open。

<details>
<summary>查看原文（24行）</summary>

```text
  // 1) 注入：首轮快照（soul/user/设计原则/导引，仅一次）+ 命中链路（第二条起每条真实用户消息都跑）。
  // 首轮判定（真机踩坑 2026-08-16）：不能看 decision.messages[0]——首条用户消息可能与
  // 插件通知消息同批到达（如 user-approval 的 policy 变更通知，source.kind='plugin'），
  // messages[0] 未必是用户消息。正确判定 = 本会话日志里还没有任何 user/message
  // （harness 在 pre-step 之后才 append 当前消息，首条消息时日志必为空）+ 消息列表里
  // 存在真实用户消息（source.kind === 'user'）。
  // 首条消息：只注入长期记忆快照，绝不跑命中链路（用户拍板：命中从第二轮起）。
  // 进程重启后恢复的会话：日志已有 user/message → 视为首轮已注入，只走命中链路。
  const firstUserHandled = new Set<string>()
  // 热路径 fail-open（2026-09-10）：pre-step 是 async 监听器，插件逻辑抛错会沿
  // agent-loop 传播改变宿主 turn 的错误语义。包装器单独持有 next()——宿主 step
  // 自身的错误原样上抛（abort 语义在内），只有本插件自己的注入/检索失败才吞掉
  // （放弃本轮注入、放行原始 decision，与本插件其余路径的 fail-open 同风格）。
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
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1433-1448](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/src/index.ts#L1433-L1448)

decision、子代理及真实用户消息门控。

<details>
<summary>查看原文（16行）</summary>

```text
  // decision 形状来自宿主事件映射，这里透传不重塑（内部只做 kind/messages 只读访问）。
  const preStepInject = async ({ agent, signal }: { agent: any; signal: { aborted: boolean } }, decision: any): Promise<unknown> => {
    const t0 = Date.now()
    if (decision === undefined || decision.kind !== 'enter' || signal.aborted) return decision
    if (decision.messages.length === 0) return decision
    // 子代理不注入（origin === 'subagent'，dsh 权威标记）：它们的 prompt 由父代理提供
    // （如 dsh-femo 的角色上下文）。注意不能只看 parentSession——GUI fork/续写的
    // 主会话也有 parentSession（真机踩坑 2026-08-17：fca10feb 被误判为子代理导致注入全失效）。
    if (agent.session.header.origin === 'subagent') return decision
    registerLiveAgent(agent)
    const sid = sessionIdOfAgent(agent)
    const ws = workspaceOfAgent(agent)

    // 真实用户消息（跳过插件通知等，source.kind='plugin' 的进不来）。
    const userMsgs = decision.messages.filter((m: { source?: { kind?: string } }) => m.source?.kind === 'user')
    if (userMsgs.length === 0) return decision // 工具轮/纯插件消息：不注入
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1470-1492](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/src/index.ts#L1470-L1492)

压缩后重注入路径。

<details>
<summary>查看原文（23行）</summary>

```text

    // 记忆门控（issue #38/#28）：本窗口「停止读入」或工作区被配置停用 → 跳过全部
    // 注入路径（重注入/首轮快照/引导/命中链）。读的入口统一在此封口。
    if (ws !== null && memoryReadOff(ws, sid)) return decision

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
```

</details>

#### 缺口

- 未运行 DSH、数据库或模型
  **影响**：不能证明召回、隔离和任务收益
  **进一步探讨**：用隔离项目核验首轮、压缩、失败和外部库

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 外部记忆信任门能证明内容可信吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

未信任的外部工作区记忆库在 pre-step 被阻止并提示，/meow-trust 可写入信任记录后恢复；这减少未审阅仓库内容自动进入上下文的机会。信任是用户对来源的决定，不验证每条记忆的事实或消除后续污染；已信任或本机创建的库仍需审阅、纠错与控制存储访问。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1450-1463](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/src/index.ts#L1450-L1463)

外部库暂停与提示。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/trust.ts:184-199](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/src/trust.ts#L184-L199)

显式信任与失败结果。

<details>
<summary>查看原文（16行）</summary>

```text
    name: 'meow-trust',
    description: '信任当前工作区自带的记忆库（.dsh-meow 非本机创建时,meow-memory 会暂停注入/检索/整理;执行本命令恢复,即刻生效,无需重启）。',
    handler(invocation) {
      const agent = (invocation as { agent?: { session?: { header?: { cwd?: unknown } } } })?.agent
      const cwd = agent?.session?.header?.cwd
      if (typeof cwd !== 'string' || cwd.length === 0) {
        return { kind: 'error', text: '/meow-trust 无法确定当前窗口的工作区（会话无 cwd）。' }
      }
      if (markersDir === null) {
        return { kind: 'error', text: '/meow-trust 不可用：信任门未启用（本实例未完成装配）。' }
      }
      if (isTrustedWorkspace(cwd)) return { kind: 'success', text: '此工作区的记忆库已在信任名单中，无需重复信任。' }
      const ok = trustWorkspace(cwd, 'meow-trust')
      return ok
        ? { kind: 'success', text: '已信任此工作区的记忆库：注入 / 检索 / 整理 / 写入即刻恢复，无需重启。' }
        : { kind: 'error', text: '/meow-trust 写入信任注册表失败（全局目录不可写？），请检查 meow-memory 全局目录权限。' }
```

</details>

**依据 3 · 作者声明**：[README.md:17-21](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/README.md#L17-L21)

作者描述压缩和信任策略。

```text
- **压缩后重注入**：会话压缩后，下一轮自动重新注入长期记忆快照 + 本会话查阅过的项目全景 + 本会话写入过的记忆原文，AI 不会因为压缩突然失忆。
- **七层之上的三件事**：写入自动去重合并、按 `updated_at` 展示记忆时间戳、全局信息用全局标记（区别于留空）。
- **按窗口 dream**：窗口空闲 ≥3 小时即允许整理，由该窗口自己的主 agent 分三轮处理（原子记忆 / topic / 项目总结），**峰时抑制**（默认北京时间 09:00–12:00、14:00–18:00，API 峰谷电价峰时）不触发。也可敲 `/dream` 立刻手动整理。
- **反思**：单次任务内连续 ≥7 个工具 step 后，插件询问模型自上次整理以来是否有值得记忆的内容。最后工具是 `memory_*` 视为已主动记忆、不重复反思。
- **外部记忆库信任门**：工作区自带的 `.dsh-meow` 若非本机创建（如 clone 的外部仓库），默认暂停注入/检索/整理——首轮提示一次，`/meow-trust` 一键信任、即刻生效；本机创建与升级前打开过的工作区自动信任，正常使用零感知。
```

#### 缺口

- 未运行 DSH、数据库或模型
  **影响**：不能证明召回、隔离和任务收益
  **进一步探讨**：用隔离项目核验首轮、压缩、失败和外部库

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用和退出而不把注入当事实？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需兼容 DSH、Node SQLite、工作区和记忆数据库；用户还要承担本地敏感数据、模型上下文和自动整理成本。先在隔离项目写入非敏感事实，核对首轮、命中、压缩后和外部库未信任行为；发现串项目、过期事实或缺失时停用并回到人工笔记，按自身留存策略处理数据库。真实宿主、整理消耗和删除效果未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-23](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/README.md#L12-L23)

作者描述运行依赖和记忆策略。

<details>
<summary>查看原文（12行）</summary>

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
- **客户端 UI**：注入文本折叠成横条、反思/dream 轮折叠成一条可展开的卡片、会话列表显示 dream 状态图标（🌙 已整理 / 呼吸灯 进行中 / 灰月牙斜杠 已跳过）。
- **无需另装运行时依赖**：`node:sqlite` + esbuild 产物（`lib/index.js`）；`schemastery` 和 `dsh-llm` 由 DSH 宿主解析提供。**无原生模块。**
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1415-1430](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/src/index.ts#L1415-L1430)

插件失败时继续原始 decision。

<details>
<summary>查看原文（16行）</summary>

```text
  const firstUserHandled = new Set<string>()
  // 热路径 fail-open（2026-09-10）：pre-step 是 async 监听器，插件逻辑抛错会沿
  // agent-loop 传播改变宿主 turn 的错误语义。包装器单独持有 next()——宿主 step
  // 自身的错误原样上抛（abort 语义在内），只有本插件自己的注入/检索失败才吞掉
  // （放弃本轮注入、放行原始 decision，与本插件其余路径的 fail-open 同风格）。
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
```

</details>

**依据 3 · 源码核查**：[src/trust.ts:184-199](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/src/trust.ts#L184-L199)

信任操作。

<details>
<summary>查看原文（16行）</summary>

```text
    name: 'meow-trust',
    description: '信任当前工作区自带的记忆库（.dsh-meow 非本机创建时,meow-memory 会暂停注入/检索/整理;执行本命令恢复,即刻生效,无需重启）。',
    handler(invocation) {
      const agent = (invocation as { agent?: { session?: { header?: { cwd?: unknown } } } })?.agent
      const cwd = agent?.session?.header?.cwd
      if (typeof cwd !== 'string' || cwd.length === 0) {
        return { kind: 'error', text: '/meow-trust 无法确定当前窗口的工作区（会话无 cwd）。' }
      }
      if (markersDir === null) {
        return { kind: 'error', text: '/meow-trust 不可用：信任门未启用（本实例未完成装配）。' }
      }
      if (isTrustedWorkspace(cwd)) return { kind: 'success', text: '此工作区的记忆库已在信任名单中，无需重复信任。' }
      const ok = trustWorkspace(cwd, 'meow-trust')
      return ok
        ? { kind: 'success', text: '已信任此工作区的记忆库：注入 / 检索 / 整理 / 写入即刻恢复，无需重启。' }
        : { kind: 'error', text: '/meow-trust 写入信任注册表失败（全局目录不可写？），请检查 meow-memory 全局目录权限。' }
```

</details>

#### 缺口

- 未运行 DSH、数据库或模型
  **影响**：不能证明召回、隔离和任务收益
  **进一步探讨**：用隔离项目核验首轮、压缩、失败和外部库

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验可见的召回依据能否减少误用？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：在注入旁显示来源、项目范围、最后确认时间和本轮注入失败状态，可减少用户把过期或无关记忆当事实。现有信任门、时间戳和 fail-open 警告是反证；额外元数据也可能泄露私人信息或掩盖错误内容。对照现有 UI 与人工笔记，以错项目、外部库、压缩和检索失败样本测误用、漏报、恢复时间及模型成本；无改进则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-22](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/README.md#L17-L22)

已有时间戳、重注入和信任门声明。

```text
- **压缩后重注入**：会话压缩后，下一轮自动重新注入长期记忆快照 + 本会话查阅过的项目全景 + 本会话写入过的记忆原文，AI 不会因为压缩突然失忆。
- **七层之上的三件事**：写入自动去重合并、按 `updated_at` 展示记忆时间戳、全局信息用全局标记（区别于留空）。
- **按窗口 dream**：窗口空闲 ≥3 小时即允许整理，由该窗口自己的主 agent 分三轮处理（原子记忆 / topic / 项目总结），**峰时抑制**（默认北京时间 09:00–12:00、14:00–18:00，API 峰谷电价峰时）不触发。也可敲 `/dream` 立刻手动整理。
- **反思**：单次任务内连续 ≥7 个工具 step 后，插件询问模型自上次整理以来是否有值得记忆的内容。最后工具是 `memory_*` 视为已主动记忆、不重复反思。
- **外部记忆库信任门**：工作区自带的 `.dsh-meow` 若非本机创建（如 clone 的外部仓库），默认暂停注入/检索/整理——首轮提示一次，`/meow-trust` 一键信任、即刻生效；本机创建与升级前打开过的工作区自动信任，正常使用零感知。
- **客户端 UI**：注入文本折叠成横条、反思/dream 轮折叠成一条可展开的卡片、会话列表显示 dream 状态图标（🌙 已整理 / 呼吸灯 进行中 / 灰月牙斜杠 已跳过）。
```

**依据 2 · 源码核查**：[src/index.ts:1415-1430](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/src/index.ts#L1415-L1430)

已有 fail-open 警告。

<details>
<summary>查看原文（16行）</summary>

```text
  const firstUserHandled = new Set<string>()
  // 热路径 fail-open（2026-09-10）：pre-step 是 async 监听器，插件逻辑抛错会沿
  // agent-loop 传播改变宿主 turn 的错误语义。包装器单独持有 next()——宿主 step
  // 自身的错误原样上抛（abort 语义在内），只有本插件自己的注入/检索失败才吞掉
  // （放弃本轮注入、放行原始 decision，与本插件其余路径的 fail-open 同风格）。
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
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1450-1463](https://github.com/Phant0Meow/dsh-meow-memory/blob/86a85a2926e61d4aa643cce9c83540f06d961ea1/src/index.ts#L1450-L1463)

已有外部库阻止。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

#### 缺口

- 未运行 DSH、数据库或模型
  **影响**：不能证明召回、隔离和任务收益
  **进一步探讨**：用隔离项目核验首轮、压缩、失败和外部库

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
