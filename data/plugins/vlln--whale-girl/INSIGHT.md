# whale-girl

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4b43504](https://github.com/vlln/whale-girl/tree/4b4350478c82d22d506a93567e52ab0ff90c2585)

<!-- BEGIN META -->
[![GitHub ★ 393](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=393&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vlln/whale-girl) [![npm 30d 4,296](https://img.shields.io/static/v1?label=npm+30d&message=4%2C296&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/whale-girl) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/whale-girl)
<!-- END META -->

> **功能**：在 DSH 网页中显示可拖拽互动的宠物，随任务和会话活动变换动作，并积累本机资历与可选回忆。

> **亮点**：纯账本、活动聚合与动画显示分层，把宿主任务转成可交互陪伴，短租约还使桌面伴侣崩溃后可恢复网页显示；主观价值没有实测。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：完成庆祝只对应宿主流程状态，保存失败又会静默继续；不能将XP和回忆当成果验收或可靠审计。全局记账、记忆文件保留和更新写面也须按实际边界使用。见[Q01](#research-q01)、[Q03](#research-q03)。

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
  - [Q01 · 宠物为谁提供什么增量，任务庆祝能证明什么？](#detail-section-11)
  - [Q02 · 后台、浏览器与桌面伴侣如何同步状态和恢复？](#detail-section-12)
  - [Q03 · 记忆、状态文件和更新操作留下哪些边界？](#detail-section-13)
  - [Q04 · 启用、持续和退出需什么投入，何时值得试？](#detail-section-14)
  - [Q05 · 能借鉴什么，能提出什么可验证的陪伴假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢工作界面视觉陪伴的本地 DSH Web 用户，可获得随活动变化的悬浮宠物；任务结果仍由原始交付验收。见[Q01](#research-q01)。

基线是不显示宠物、只读宿主状态；增量是活动反馈和养成记忆，不是模型任务质量或绩效证明。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 悬浮角色与互动 | 在Web界面拖拽、投喂和玩耍 | 需浏览器资源；互动不改变任务成果 |
| 活动动作反馈 | 显示运行、等待、完成和失败反应 | 聚合活动；庆祝不是业务验收 |
| 资历与称号 | 累积任务、会话和陪伴时长 | 全局本机账本，不是绩效记录 |
| 可选会话回忆 | 恢复或分叉时回顾有限任务标签 | 默认关闭；关开关保留磁盘文件 |
| 桌面在场协调 | 桌面伴侣在线时隐藏网页角色 | 独立应用需另装，45秒失联恢复 |
| 版本检查与更新 | 从设置卡查询并请求宿主更新 | 更新是安装写动作，依赖宿主管理服务 |

**流程与依赖**

网页路径依赖宿主活动服务、资源和可写目录；桌面伴侣单独安装，记忆默认关闭。完整条件见[Q04](#research-q04)。

检查活动一致、交互遮挡和重启保存，再决定是否保持开启；步骤与退出见[Q04](#research-q04)。

**效果与成本**

本地动画、轮询和存储资源及配置时间未知，无额外模型生成接线；各阶段成本见[Q04](#research-q04)。

活动反馈和TTL恢复有机制支持，情绪、专注和效率没有实测；效果表见[Q04](#research-q04)。

> **思考**：完成庆祝只对应宿主流程状态，保存失败又会静默继续；不能将XP和回忆当成果验收或可靠审计。全局记账、记忆文件保留和更新写面也须按实际边界使用。见[Q01](#research-q01)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：纯账本、活动聚合与动画显示分层，把宿主任务转成可交互陪伴，短租约还使桌面伴侣崩溃后可恢复网页显示；主观价值没有实测。见[Q01](#research-q01)、[Q02](#research-q02)。

账本纯函数、有界记忆、短租约与客户端完整撤销接线可借鉴；静默写失败与全局活动聚合限制可审计性，宿主认证不能由CSRF检查替代。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

完成庆祝只对应宿主流程状态，保存失败又会静默继续；不能将XP和回忆当成果验收或可靠审计。全局记账、记忆文件保留和更新写面也须按实际边界使用。见[Q01](#research-q01)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

本地单用户Web环境可先试拖拽、互动、完成/取消反应和重启保存。宠物遮挡控件、分心、误导状态或反复丢记录时停用，回宿主任务状态；共享或公网环境先不采用。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持活动驱动动画与有界本机记录，未运行宿主、浏览器或桌面应用；主观陪伴价值与资源耗用未知，可在本地单用户范围有限试用。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.mjs、lib/client/index.mjs、lib/src/pet-state.mjs、lib/src/session-events.mjs、lib/src/session-memory.mjs、lib/src/persistence.mjs、lib/src/presence.mjs、lib/src/config.mjs、lib/src/interact.mjs、lib/src/update-host.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向阅读根插件入口、客户端事件与清理、纯账本、记忆、持久化、presence与更新调用；独立desktop目录不作为已验证根插件能力，未执行目标代码或更新。
- 下一步：后续在本地profile核对完成、失败、取消、等待与重启保存，再记录遮挡、资源和用户继续使用意愿；不以XP增加作为业务收益。

**分析版本**

- **仓库**：[vlln/whale-girl](https://github.com/vlln/whale-girl)
- **版本号**：0.2.3（[固定提交 4b43504](https://github.com/vlln/whale-girl/tree/4b4350478c82d22d506a93567e52ab0ff90c2585)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是分开流程结束动画与用户确认合格提示，可能减少庆祝被误认成成果验收；比较理解、干扰和继续使用意愿，若增加确认负担或没有改善就放弃。见[Q05](#research-q05)。

后续在本地profile核对完成、失败、取消、等待与重启保存，再记录遮挡、资源和用户继续使用意愿；不以XP增加作为业务收益。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 111 | 5223 | — | — | 94165 |
| .mjs | source | 50 | 7258 | 5224 | 1800 | — |
| .cjs | source | 1 | 14 | 11 | 2 | — |
| .js | source | 3 | 2288 | 2185 | 93 | — |
| .mjs | test | 35 | 4290 | 3611 | 286 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/vlln/whale-girl/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：活动宠物如何提供陪伴反馈，其记账和显示边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 宠物为谁提供什么增量，任务庆祝能证明什么？

**研究主题**：场景与需求、贡献与相对优势、缺陷与关键质疑

#### 完整回答

它是 DSH Web GUI 的原生 bundle 宠物，Node 端订阅任务与会话活动，浏览器端自建悬浮角色、动画、拖拽和互动。它适合喜欢视觉陪伴、愿意在工作界面保留常驻装饰的人；合格结果是角色对活动作相应反应、互动不妨碍主工作、状态能够保留，而不是提高模型正确率或完成更多业务任务。基线是不显示宠物，依靠宿主任务状态和日志判断结果。

相对静态装饰，它把任务、会话和陪伴时长转成资历、称号与最近回忆，并让成功、失败、等待和运行产生不同动画。pet-state 的等级由 XP 计算，失败只记数不扣资历；投喂和玩耍返回配置回话而不改变账本，是降低养成压力的设计取舍。这些机制有源码依据，但没有真实用户证明它能减轻焦虑、提高专注或增加使用意愿。

庆祝信号使用宿主 job 的 settled/completed 状态。它没有检验输出内容、复核测试或业务验收，也不是独立的完成证明。账本订阅 owners:'all'，跨所有 owner 累积，不能把总任务数归到当前会话或某个用户的独立成果。取消任务不计完成/失败，请求错误可有情绪反应但不等于整个任务失败。因此宠物是活动反馈和陪伴层，用户仍需从宿主与实际交付检查结果。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-6](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/package.json#L1-L6)

包自述与原生入口。

```text
{
  "name": "whale-girl",
  "version": "0.2.3",
  "type": "module",
  "description": "DSH Web GUI 内的桌面宠物（QQ 宠物形态）",
  "main": "lib/index.mjs",
```

**依据 2 · 源码核查**：[lib/index.mjs:432-454](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/index.mjs#L432-L454)

全局任务订阅和完成/失败反馈。

<details>
<summary>查看原文（23行）</summary>

```text
      // killed（用户取消）中性：不计 XP、不记失败、不写回忆（F4 语义）。
      // 订阅面 owners:'all'：注册上下文不落在任何 agent scope 内，覆盖全部 owner（与
      // 按 owner 分域的订阅相反——宠物账本是全局积累，不随会话隔离）。
      ctx.jobs.events.subscribe({ owners: 'all' }, (event) => {
        if (event.type !== 'settled') return // 注册/进度/停止/移除不记账
        const snapshot = event.job
        const now = Date.now()
        if (snapshot.status === 'completed') {
          const result = recordTaskCompleted(state, snapshot.label ?? '未命名任务', now)
          state = result.state
          // F3：账本与庆祝同源——记账即开庆祝窗口。页面关闭期间完成任务（轮询缺席、
          // deriveActivity 看不到翻转）时，重开后首次轮询仍能看到本窗口，同样庆祝；
          // 与轮询翻转的 celebrate 取 max 不叠加（CELEBRATE_MS 同 BURST_MS）。
          celebrateUntil = Math.max(celebrateUntil, now + configRef.celebrateMs)
          scheduleSave()
          emitSignal('celebrate', { label: snapshot.label ?? '未命名任务', level: state.level })
          if (result.leveledUp) emitSignal('levelUp', { level: state.level })
        } else if (snapshot.status === 'failed') {
          state = recordFailure(state, now).state
          scheduleSave()
          emitSignal('failure', { level: state.level })
        }
        // 会话记忆写入①（开关门控）：任务 settle 按 owner 精确归属到会话；
```

</details>

**依据 3 · 源码核查**：[lib/src/pet-state.mjs:1-21](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/pet-state.mjs#L1-L21)

无衰减、资历账本与经验值。

<details>
<summary>查看原文（21行）</summary>

```text
// 积累型宠物账本：零负反馈——无衰减、无惩罚、无需求；一切向上积累。
// 契约：
// - 状态字段：level/xp（资历）、stats{tasksDone,failures,sessions,activeMs,firstSeenAt}、
//   titles（已解锁称号 id 数组）、memory（最近事件，环形，最多 MEMORY_MAX 条）、updatedAt。
// - 无 tick/衰减函数；所有变化都是事件驱动的纯函数，返回 { state, unlocked, leveledUp }，
//   不修改入参；称号由 stats 阈值派生（checkTitles 幂等）。
// - 等级 = xp 派生（xpForLevel 三角数列），禁止手写 level 字段。

export const INITIAL_STATE = Object.freeze({
  level: 1,
  xp: 0,
  stats: { tasksDone: 0, failures: 0, sessions: 0, activeMs: 0, firstSeenAt: null },
  titles: [],
  memory: [],
  updatedAt: 0,
})

export const MEMORY_MAX = 8
export const TASK_XP = 10
export const SESSION_XP = 5
export const RESUME_XP = 2
```

</details>

**依据 4 · 源码核查**：[lib/src/pet-state.mjs:91-103](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/pet-state.mjs#L91-L103)

完成记账和失败不扣分。

<details>
<summary>查看原文（13行）</summary>

```text
export function recordFailure(state, nowMs) {
  const n = state.stats.failures + 1
  return commit(state, { failures: n }, nowMs, `任务失败（第 ${n} 次）——没关系，再来`)
}

/** 新会话（source=startup）：资历 +SESSION_XP，记录首见时间，计入会话数。 */
export function recordSession(state, nowMs) {
  const n = state.stats.sessions + 1
  return commit(
    state,
    { sessions: n, firstSeenAt: state.stats.firstSeenAt ?? nowMs },
    nowMs,
    `新会话开启（第 ${n} 个）`,
```

</details>

**依据 5 · 源码核查**：[lib/src/interact.mjs:15-25](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/interact.mjs#L15-L25)

喂食与玩耍只返回互动回话。

<details>
<summary>查看原文（11行）</summary>

```text
export function applyAction(state, action, replies = null) {
  if (action === 'feed' || action === 'play') {
    const pool = replies?.[action]?.length > 0 ? replies[action] : FALLBACK_REPLIES[action]
    return {
      status: 200,
      body: { pet: state, reply: pool[Math.floor(Math.random() * pool.length)] },
    }
  }
  return { status: 400, body: { error: `unknown action "${action}"; expected "feed" or "play"` } }
}

```

</details>

#### 缺口

- 没有真实用户陪伴收益与干扰程度反馈
  **影响**：不能断言提升专注或缓解负面情绪
  **进一步探讨**：让目标用户在相似工作时段比较有无宠物的干扰、继续使用意愿与任务投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 后台、浏览器与桌面伴侣如何同步状态和恢复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Node apply 要求 jobs、agents、sessions、webServer，监听任务终态、agent 创建、请求错误与 session/event，把状态聚合成 /state。任务终态更新账本并触发 SSE 简短通知，浏览器收到通知重新请求完整快照；默认仍有 3 秒轮询兜底。SSE 本身不推整份账本，减少通知协议重复状态的负担，但快照仍是响应时刻的聚合，非每个事件独立确认。

客户端加载角色 manifest 和 sprite sheet，依据 activity、互动和时序选择表情。启动时同时建轮询、动画定时器和 EventSource；浏览器隐藏时暂停轮询与动画检查，回前台立即刷新，卸载关闭 SSE、计时器、观察者、事件监听和 DOM。源码可确认清理接线，但没有真实浏览器渲染、资源耗用或长期重载记录，不能称已证明无内存泄漏。

可选桌面伴侣是独立应用，不随 DSH bundle 自动安装。它通过 presence 续期让网页宠物隐藏，退出可显式 offline；意外崩溃后 45 秒 TTL 过期，网页端恢复。这个显示层租约比永久写“已启桌面版”更容易恢复。租约只说明消费者在场，不证明桌面渲染成功或任务正常；网络不稳定还会短暂出现/隐藏切换。

会话等待状态由 turn/end reason.kind=blocked 判定，完成庆祝与任务完成是不同信号。宠物动画不应混同当前子代理、主会话及所有任务的精确运行面板；需要定位哪个会话失败仍应查原始活动。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:32-39](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/index.mjs#L32-L39)

宿主注入与路由入口。

```text

export const name = 'whale-girl'
export const inject = ['jobs', 'agents', 'sessions', 'webServer']
/** 条目 Config schema：宿主按它校验条目 config 并把 volatile 叶子注入 apply 的 config。 */
export const Config = buildSchema()
// 路由端点 re-export（来源 src/routes.mjs；保持既有导出面）。
import { STATE_PATH, INTERACT_PATH, CONFIG_PATH, ROUTE_PREFIX, EVENTS_PATH, PRESENCE_PATH, SESSIONS_PATH, UPDATE_PATH } from './src/routes.mjs'
export { STATE_PATH, INTERACT_PATH, CONFIG_PATH, ROUTE_PREFIX, EVENTS_PATH, PRESENCE_PATH, SESSIONS_PATH, UPDATE_PATH }
```

**依据 2 · 源码核查**：[lib/index.mjs:580-605](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/index.mjs#L580-L605)

状态快照聚合和桌面在场字段。

<details>
<summary>查看原文（26行）</summary>

```text
        path: STATE_PATH,
        handler: async (req, res) => {
          try {
            if (req.method !== 'GET') {
              json(res, 405, { error: 'method not allowed; use GET' }, { allow: 'GET' })
              return
            }
            // 轮询端点：禁缓存，防止启发式缓存读到冻结状态。
            // 先跑 activity()（有记账副作用），再读 state——响应里的 pet 才是记账后的值。
            const act = activity()
            json(res, 200, {
              apiVersion: SNAPSHOT_API_VERSION,
              pet: state,
              activity: act,
              configRevision,
              companionOnline: companionOnline(companionUntil, Date.now()),
              // 会话记忆回读（开关 + 双窗口门控）：仅 MEMORY_WINDOW_MS 内随 /state
              // 下发（客户端按 at 去重播一次气泡）；关开关即刻撤下（syncMemoryConfig 清空）。
              ...(configRef.sessionMemory && memoryRecall !== null && Date.now() - memoryRecall.at <= MEMORY_WINDOW_MS
                ? { memory: memoryRecall }
                : {}),
            }, { 'cache-control': 'no-store' })
          } catch (error) {
            json(res, 500, { error: error instanceof Error ? error.message : String(error) })
          }
        },
```

</details>

**依据 3 · 源码核查**：[lib/src/session-events.mjs:18-28](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/session-events.mjs#L18-L28)

等待状态判定。

<details>
<summary>查看原文（11行）</summary>

```text
export function parseTurnEvent(event) {
  if (event === null || typeof event !== 'object') return null
  const type = typeof event.type === 'string' ? event.type : null
  if (type === 'turn/start') return { kind: 'start', blocked: false }
  if (type === 'turn/end') {
    const reason = typeof event.data === 'object' && event.data !== null ? event.data.reason : null
    const blocked = typeof reason === 'object' && reason !== null && reason.kind === 'blocked'
    return { kind: 'end', blocked }
  }
  return null
}
```

</details>

**依据 4 · 源码核查**：[lib/client/index.mjs:1356-1395](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/client/index.mjs#L1356-L1395)

SSE、轮询和前后台恢复。

<details>
<summary>查看原文（40行）</summary>

```text
    loadAssets()
    refresh()
    pollTimer = setInterval(refresh, cfg.pollMs)
    animTimer = setInterval(tick, TICK_MS)
    scheduleWander()
    armWorking()
    // ---- SSE 即时事件（v9）：Node half 事件发生时推送，收到立即 refresh() ——
    // 回合完成庆祝/欢迎/思考陪伴不再等 pollMs 轮询（默认 3s → 单次 /state 往返）。
    // EventSource 断线自动重连（内建，retry 3s）；轮询保留兜底（SSE 不可用时照常跑）。
    try {
      sse = new EventSource(EVENTS_PATH)
      sse.onmessage = () => refresh()
      // onerror 不处理：EventSource 内建自动重连；重连期间轮询兜底，宠物照常。
    } catch {
      // EventSource 不可用（罕见）：轮询兜底，宠物照常跑
    }
  }
  boot()

  // ---- 会话感知（v8：Node half 聚合，退役本地 sessions 订阅）----
  // 自渲染 client 无 ctx.sessions（官方注入面只给 __DSH_BOOT__），会话状态（think/wait/
  // 回合完成）改由 Node half 在 /state 下发（refresh 里读 act.sessionThink/sessionWait/
  // turnCompleted）。不再订阅 host sessions 服务——旧订阅在自渲染形态下 ctx 为空恒失效。
  armWorking() // 首次武装 working 插曲（后续由 refresh 的 sessionMood 变化驱动）

  // 回前台立即刷新（后台标签轮询被节流，状态可能陈旧）。
  // 页面隐藏时暂停轮询与动画检查（rAF 浏览器已自动停，这里把 JS 定时器也停掉，
  // 避免后台空转耗 CPU/电）；回前台重建定时器并立即刷新，行为与原先一致。
  const onVisibility = () => {
    if (document.visibilityState === 'visible') {
      if (pollTimer === null) pollTimer = setInterval(refresh, cfg.pollMs)
      if (animTimer === null) animTimer = setInterval(tick, TICK_MS)
      refresh()
    } else {
      if (pollTimer !== null) { clearInterval(pollTimer); pollTimer = null }
      if (animTimer !== null) { clearInterval(animTimer); animTimer = null }
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

```

</details>

**依据 5 · 源码核查**：[lib/client/index.mjs:1450-1478](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/client/index.mjs#L1450-L1478)

客户端卸载资源清理。

<details>
<summary>查看原文（29行）</summary>

```text
  const disposePet = () => {
    clearInterval(pollTimer)
    if (animTimer !== null) clearInterval(animTimer)
    if (sse !== null) sse.close()
    clearTimeout(wanderTimer)
    if (workingTimer !== null) clearTimeout(workingTimer)
    if (walkRaf !== null) cancelAnimationFrame(walkRaf)
    for (const t of bubbleTimers) clearTimeout(t) // 气泡残留计时器一并清
    bubbleTimers.clear()
    clearBubble() // 活动气泡引用清空（DOM 随 host.remove() 移除）
    dialogObserver.disconnect()
    document.removeEventListener('pointerdown', onDocPointerDown)
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('visibilitychange', onVisibility)
    document.removeEventListener('whale-girl:say', onPetSay)
    document.removeEventListener('whale-girl:fx', onPetFx)
    document.removeEventListener('whale-girl:status', onPetStatus)
    host.removeEventListener('mouseenter', onHostEnter)
    host.removeEventListener('mouseleave', onHostLeave)
    window.removeEventListener('resize', onResize)
    host.remove()
    style.remove()
  }
  // 插件整体卸载（client 条目卸载 / 重建）：宠物与设置卡片一起拆。
  const dispose = () => {
    disposePet()
    if (offSettings !== null) { offSettings(); offSettings = null }
  }
  return dispose
```

</details>

**依据 6 · 源码核查**：[lib/src/presence.mjs:5-15](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/presence.mjs#L5-L15)

短期租约与显式下线。

<details>
<summary>查看原文（11行）</summary>

```text
export const PRESENCE_TTL_MS = 45000 // 心跳有效窗口（桌面端每 15s 续命一次）

/** 心跳续命/下线：返回新的在场截止时刻（online=false 立即下线）。 */
export function pokePresence(companionUntil, nowMs, online = true) {
  return online ? nowMs + PRESENCE_TTL_MS : 0
}

/** 当前是否处于桌面伴侣在场窗口内（companionUntil 为截止时刻）。 */
export function companionOnline(companionUntil, nowMs) {
  return companionUntil > nowMs
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 记忆、状态文件和更新操作留下哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

账本保存到 dshHome/data/whale-girl/state.json，会话记忆另存 sessions.json；都先写同目录 tmp 再 rename，事件后 1 秒防抖，停用时最后保存。原子替换减少半份 JSON 暴露，但写失败被静默吞掉，加载失败回初始账本或空记忆。因此界面能继续动作并不证明状态已落盘；无写权限或坏文件可能到重启才表现为丢失。资历是可丢失的本机体验数据，不能用作可信绩效或任务审计记录。

sessionMemory 默认关闭。打开后记录会话标题、血缘和有限任务标签，并支持恢复/fork 的回忆气泡；owner 缺失的任务会退到最近活跃用户会话，故不是严格可审计的归属证据。开关关闭时写完已经产生的记录、丢掉内存副本，但磁盘文件保留，重新开启会继续使用。只把网页宠物隐藏也不等于停用后台记账；清除本机记录需要另处理文件。任务标签可能包含敏感业务名称，应按本机数据边界判断，而不是因为不是完整对话就当作无敏感内容。

版本卡片除了查看还有更新写面。GET 查询安装来源和上游版本，POST 调宿主 installBundle，保留当前 enabled 状态；读不到启停状态会拒绝更新。它不是定时强制自更新，且更新目标优先按宿主记录的安装来源；用户按按钮时仍是在改变安装版本，需要考虑新的代码和重启/应用状态。源码的跨源检查是 CSRF 约束，缺 Origin/Fetch-Site 默认允许，不等于独立身份认证。若把 DSH 对外开放，必须依靠宿主访问控制；本次没有证明这些公开状态/会话端点具备额外用户隔离。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:48-94](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/index.mjs#L48-L94)

两文件路径、原子替换及静默失败。

<details>
<summary>查看原文（47行）</summary>

```text
/** 状态文件：<dshHome>/data/whale-girl/state.json（不放插件目录——uninstall 会删）。 */
const DSH_HOME = process.env.DSH_HOME ?? resolve(import.meta.dirname, '../../..')
const STATE_FILE = join(DSH_HOME, 'data', 'whale-girl', 'state.json')
/** 会话记忆文件：<dshHome>/data/whale-girl/sessions.json（与账本分离：开关只停记忆，不动账本）。 */
const MEMORY_FILE = join(DSH_HOME, 'data', 'whale-girl', 'sessions.json')

/** 读取并归一化已保存状态；缺失/损坏返回 null。 */
function loadState() {
  try {
    return normalizeState(JSON.parse(readFileSync(STATE_FILE, 'utf8')))
  } catch {
    return null
  }
}

/** 原子写：同目录 .tmp + rename；失败不阻塞插件（状态仅本次运行有效）。 */
function saveState(next) {
  try {
    mkdirSync(dirname(STATE_FILE), { recursive: true })
    const tmp = `${STATE_FILE}.tmp`
    writeFileSync(tmp, serializeState(next))
    renameSync(tmp, STATE_FILE)
  } catch {
    // 持久化失败不阻塞插件：状态仅本次运行内有效。
  }
}

/** 读取并归一化会话记忆；缺失/损坏返回空账本（记忆可丢，仅影响气泡文案）。 */
function loadSessionMemory() {
  try {
    return normalizeSessionMemory(JSON.parse(readFileSync(MEMORY_FILE, 'utf8')))
  } catch {
    return emptySessionMemory()
  }
}

/** 原子写会话记忆（同 state 的 .tmp + rename）；失败不阻塞插件。 */
function saveSessionMemory(next) {
  try {
    mkdirSync(dirname(MEMORY_FILE), { recursive: true })
    const tmp = `${MEMORY_FILE}.tmp`
    writeFileSync(tmp, serializeSessionMemory(next))
    renameSync(tmp, MEMORY_FILE)
  } catch {
    // 记忆持久化失败不阻塞插件：下次事件重试。
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:189-231](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/index.mjs#L189-L231)

记忆开关和关边沿保存、保留磁盘。

<details>
<summary>查看原文（43行）</summary>

```text
  // ---- 会话记忆（sessionMemory 开关门控）----
  // 关 = 零读零写零副作用：memory 恒为 null，事件回调里的记忆分支全部跳过，
  // 文件留在磁盘上（用户可自行删除；下次开启接着用）。
  // 开 = 懒加载：首次启用时读文件，之后事件驱动写入、1s 防抖落盘（与账本同节拍）。
  // memoryRecall 是最近一次 agent/created 边沿的回读快照，随 /state 在
  // MEMORY_WINDOW_MS 窗口内下发——客户端按 at 去重后播报一次气泡。
  let memory = null
  let memoryRecall = null
  let memorySaveTimer = null
  const memoryEnabled = () => configRef.sessionMemory === true
  const ensureMemory = () => {
    if (memory === null && memoryEnabled()) memory = loadSessionMemory()
    return memory
  }
  const scheduleMemorySave = () => {
    if (memory === null) return
    clearTimeout(memorySaveTimer)
    memorySaveTimer = setTimeout(() => { if (memory !== null) saveSessionMemory(memory) }, 1000)
  }
  // 配置热更新时对齐开关状态：开→懒加载；关→先落盘再丢内存副本、撤下未播报的回读
  // （磁盘文件保留，见上）。关闭边沿的末次落盘是「把开启期间已记的写完」，不是关闭后继续写：
  // 防抖窗口（≤1s）内的记录不因拨开关而消失，此后 memory 恒为 null，零读零写。
  const syncMemoryConfig = () => {
    if (memoryEnabled()) {
      ensureMemory()
    } else {
      if (memory !== null) {
        clearTimeout(memorySaveTimer)
        saveSessionMemory(memory)
      }
      memory = null
      memoryRecall = null
    }
  }
  // ---- SSE 即时事件（v9：事件 → 宠物反应的延迟从 pollMs 轮询降到单次 /state 往返）----
  // 事件（turn 边沿/会话启动/任务终态/请求错误）发生时广播，client 收到立即 refresh()
  // 拉最新 /state——回合完成庆祝/欢迎/思考陪伴不再等下一个轮询周期（默认 3s）。
  // 轮询保留兜底（SSE 断线/不可用时宠物照常跑，EventSource 内建自动重连）。
  // 连接管理：res 写入失败（断连）即从集合移除；close 时清理（心跳一并停）。
  const sseClients = new Set()
  const broadcastEvent = () => {
    const line = 'data: {"type":"event"}\n\n'
    for (const res of sseClients) {
```

</details>

**依据 3 · 源码核查**：[lib/src/session-memory.mjs:1-33](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/session-memory.mjs#L1-L33)

有限记忆、归属退路与本地数据界限。

<details>
<summary>查看原文（33行）</summary>

```text
// 会话记忆（纯逻辑：零宿主依赖、零 IO，可单测）。
// 契约：
// - 存储是「sessionId → { parent?, title?, subagent?, at, tasks[] }」的独立文件（data/whale-girl/sessions.json，
//   与宠物账本 state.json 分离——两者生命周期与容错策略不同，见 src/persistence.mjs 的账本契约）。
// - 淘汰分预算：用户会话 SESSIONS_MAX 条、subagent 子会话 SUBAGENT_SESSIONS_MAX 条，各按 at 淘汰。
//   子会话永不播报回读，一次密集委派 spawn 出的几十个子会话不得把用户自己的会话挤出账本。
// - 血缘回读：fork 的会话在 header 里带 parentSession（DSH 会话头字段），链上逐级找最近一条有任务
//   记录的会话——这就是「分支会话也记得上次做了什么」的来源；链断（祖先未被记录）即返回 null，
//   不猜。
// - 归属：任务 settle 事件带 owner（JobView.owner?: SessionId，宿主按 agent 会话授权的属主会话 id），
//   精确归属；无属主的任务退回最近活跃的**用户**会话（落在子会话上等于丢掉——它的记忆永不播报），
//   无会话则跳过（不猜）。
// - 容错：normalizeSessionMemory 对手改/旧文件逐字段容错，越界裁剪（会话数、每会话任务数、标签长度
//   都有上限），非法返回空账本——记忆丢失只影响气泡文案，不阻塞插件。
// - 记录是**本机状态文件**：不进入模型上下文、不写会话日志、不上传网络（设置卡说明与此一致）。
//
// 归属测试：tests/session-memory.test.mjs。

/** 保留的最近**用户**会话数（超出按 at 淘汰最旧）。 */
export const SESSIONS_MAX = 64
/** subagent 子会话条目的独立预算：子会话永不播报回读，不得与用户会话竞争 SESSIONS_MAX
 *  （一次密集委派能 spawn 几十个子会话，共用一个预算会把用户自己的会话挤出账本）。 */
export const SUBAGENT_SESSIONS_MAX = 16
/** 每会话保留的任务条数（环形，最新在末尾）。 */
export const TASKS_MAX = 8
/** 任务标签长度上限（标签由宿主生产者给出，裁剪防手改文件撑爆气泡）。 */
export const LABEL_MAX = 160
/** 会话标题长度上限。 */
export const TITLE_MAX = 120
/** 血缘回读最大跳数（防手改文件造出的环把遍历拖死）。 */
export const LINEAGE_HOPS_MAX = 8

/** 空记忆账本。 */
```

</details>

**依据 4 · 源码核查**：[lib/index.mjs:456-469](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/index.mjs#L456-L469)

无owner时最近用户会话归属。

<details>
<summary>查看原文（14行）</summary>

```text
        if ((snapshot.status === 'completed' || snapshot.status === 'failed') && memoryEnabled()) {
          const owner = typeof snapshot.owner === 'string' && snapshot.owner !== '' ? snapshot.owner : lastSessionId
          // 无可归属会话时连账本都不加载：不猜归属，也不留一个空文件（末次落盘会把它写出去）。
          if (owner !== null) {
            const mem = ensureMemory()
            if (mem !== null) {
              memory = recordTask(mem, owner, {
                label: snapshot.label ?? '未命名任务',
                ok: snapshot.status === 'completed',
                at: now,
              })
              scheduleMemorySave()
            }
          }
```

</details>

**依据 5 · 源码核查**：[lib/index.mjs:631-649](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/index.mjs#L631-L649)

更新GET/POST入口及跨源校验。

<details>
<summary>查看原文（19行）</summary>

```text
            if (req.method === 'GET' || req.method === 'POST') {
              if (isCrossOrigin(req.headers, req.headers.host)) {
                json(res, 403, { error: 'cross-origin request rejected' })
                return
              }
              json(res, 200, req.method === 'GET' ? await updateHost.status() : await updateHost.apply(), { 'cache-control': 'no-store' })
              return
            }
            json(res, 405, { error: 'method not allowed; use GET or POST' }, { allow: 'GET, POST' })
          } catch (error) {
            json(res, 500, { error: error instanceof Error ? error.message : String(error) })
          }
        },
      }),
      webServer.register({
        kind: 'exact',
        path: INTERACT_PATH,
        handler: async (req, res) => {
          try {
```

</details>

**依据 6 · 源码核查**：[lib/src/update-host.mjs:212-241](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/update-host.mjs#L212-L241)

更新通过宿主包管理且保留启停。

<details>
<summary>查看原文（30行）</summary>

```text
  async function apply() {
    const manager = managerOf()
    if (manager === undefined || typeof manager.installBundle !== 'function') return { state: 'unsupported' }
    const checked = await status()
    if (checked.state !== 'update-available' || checked.latest === undefined) {
      // 检查本身没结论（限流 / 网络）时要说成「检查失败」，别让用户以为更新失败。
      return checked.state === 'unknown'
        ? { state: 'check-failed', ...(checked.reason === undefined ? {} : { errorCode: checked.reason }) }
        : { state: checked.state, current: checked.current }
    }
    const parsed = parseInstallSource(checked.current.source)
    // 本地路径安装要跟的是「包自己声明的仓库的默认分支」，别的一律跟 profile 记的那条 spec。
    const target = parsed !== undefined && parsed.kind === 'local' ? { ...checked.latest, repo: self.repository } : checked.latest
    const plan = updateSpecs(parsed, target)
    // 防御性：state 说「有新版」时 target 里一定有可装的标识，正常走不到这里。
    if (plan === undefined) return { state: 'failed', errorCode: 'unsupported-source' }
    const requestId = `${self.name}-update-${Date.now().toString(36)}`

    /** 装一个 spec 并把宿主的应用结果如实转成载荷。 */
    const runInstall = async (spec, step) => {
      const bundle = await selfBundle()
      // 读不到当前启停状态就不动手：宿主对「没传 enabled」的安装默认启用，会把用户关掉的宠物打开。
      if (bundle === undefined || typeof bundle.enabled !== 'boolean') {
        return { state: 'failed', errorCode: 'unknown-enabled-state' }
      }
      const result = await manager.installBundle(spec, { enabled: bundle.enabled, requestId: `${requestId}-${String(step)}` })
      const application = typeof result?.application === 'string' ? result.application : undefined
      const failure = result?.error
      return {
        state: applicationState(application),
```

</details>

**依据 7 · 源码核查**：[lib/src/interact.mjs:28-39](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/interact.mjs#L28-L39)

跨源检查缺头时默认放行，不是认证。

<details>
<summary>查看原文（12行）</summary>

```text
  const site = headers['sec-fetch-site']
  if (site !== undefined) return site !== 'same-origin' && site !== 'none'
  const origin = headers['origin']
  if (origin !== undefined) {
    try {
      return new URL(origin).host !== host
    } catch {
      return true
    }
  }
  return false
}
```

</details>

#### 缺口

- 静默保存失败没有本轮用户可见告警验证
  **影响**：不能保证资历与记忆已持久化
  **进一步探讨**：后续故障注入只读目录和坏JSON，检查是否有可识别恢复提示；不将丢失等同正常重置。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启用、持续和退出需什么投入，何时值得试？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

对只想要工作界面反馈的用户，可在本地单用户 Web profile 做有限试用；不需要模型额外生成宠物回话，也不需要另起桌面进程。它没有承担业务关键状态，关闭即可回原界面；资历和记忆想保留时先确认文件能写。独立桌面版另需 Node/Tauri 等环境，不能把作者的独立安装说明算成本轮已验证的平台支持。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web、jobs/agents/sessions/webServer | 网页宠物必需 | 活动聚合和界面数据 | 插件不挂载或活动不可得 |
| 客户端资源与角色 manifest | 动画必需 | 渲染精灵帧 | 占位或无法显示，本轮未实测 |
| 可写 dshHome 数据目录 | 保存必需 | 保留资历和可选记忆 | 当次继续但重启可能丢失 |
| sessionMemory 开关 | 会话回忆可选 | 记录有限任务摘要 | 默认关闭，不影响基本账本 |
| 独立桌面应用及网络 | 桌面常驻才需 | presence 与跨窗口显示 | 不随bundle提供，45秒失联恢复网页 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选择本地Web profile，核对保存目录 | 接受全局活动计数与记忆范围 |
| 加载 | 宿主加载bundle，浏览器显示角色 | 拖拽/互动不遮挡主要操作 |
| 观察 | 用户完成和取消小任务，检查等待/失败反应 | 与原始宿主状态一致，不用庆祝代替验收 |
| 持久化 | 用户重启后检查资历 | 未保留时先查目录权限，不伪造已保存 |
| 退出 | 用户停用插件，按需保留或清理数据 | 角色/连接消失，磁盘文件不会自动删除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地存储和浏览器资源，数额未知 | 安装、重启、调整位置大小；耗时未知 | 无额外模型调用接线 |
| 持续使用 | 轮询、动画和状态写入资源未知 | 判断是否干扰，按需隐藏/停用 | 情绪或效率收益未测 |
| 失败恢复 | 丢状态可能需要恢复文件备份 | 排查资源、目录与宿主接口 | 保存失败未阻塞界面 |
| 升级退出 | 更新下载及保留数据量未知 | 检查安装来源、停用及记忆文件 | 更新写操作需明确用户动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 活动陪伴 | 完成、失败、会话等待驱动状态 | 用户是否喜欢、是否分心 |
| 累积回忆 | 有界本地账本与可选会话记忆 | 真实保存可靠性与情绪收益 |
| 网页桌面交接 | presence TTL恢复设计 | 实际交接和平台表现 |
| 工作效率 | 没有控制对照 | 不能宣称节时或交付质量提高 |

试用停止条件应由体验判断。角色遮挡重要控件、动画分心、计数误导或写入失败导致反复丢失时，先关闭显示或停用，继续使用宿主原有任务状态。共享或公网宿主、要求严格会话隔离的人不在本次建议范围。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:21-40](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/package.json#L21-L40)

bundle/client与schema依赖。

<details>
<summary>查看原文（20行）</summary>

```text
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.4"
  },
  "scripts": {
    "gates": "node scripts/gates/run.mjs",
    "gates:ci": "node scripts/gates/run.mjs --group ci",
    "test": "node --test 'tests/*.test.mjs'",
    "build:client": "node scripts/build-client.mjs",
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:32-35](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/index.mjs#L32-L35)

活动服务依赖。

```text

export const name = 'whale-girl'
export const inject = ['jobs', 'agents', 'sessions', 'webServer']
/** 条目 Config schema：宿主按它校验条目 config 并把 volatile 叶子注入 apply 的 config。 */
```

**依据 3 · 源码核查**：[lib/src/config.mjs:23-38](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/config.mjs#L23-L38)

默认记忆关闭及轮询间隔。

<details>
<summary>查看原文（16行）</summary>

```text
export const DEFAULTS = Object.freeze({
  enabled: true,          // 网页端渲染开关（桌面伴侣并存时设 false 关闭网页端宠物，避免双宠物）
  sessionMemory: false,   // 会话记忆开关（本机记录任务摘要并在恢复/fork 会话时读回；见 src/session-memory.mjs）
  size: 110,              // 宠物尺寸 px（stage 盒 + sprite 上限）
  opacity: 1,             // 常态透明度 0.2–1（inert 0.25 是交互态，不在此配）
  walk: {
    enabled: true,        // 游走开关
    minWaitMs: 18000,     // 游走间隔下限
    maxWaitMs: 40000,     // 游走间隔上限
    minMs: 3000,          // 单次游走时长下限
    maxMs: 6000,          // 单次游走时长上限
    speedPxPerSec: 45,    // 游走速度
  },
  sleepAfterMs: 60000,    // 空闲多久进入睡眠
  pollMs: 3000,           // /state 轮询间隔
  bubbleMs: 2500,         // 回话气泡时长
```

</details>

**依据 4 · 源码核查**：[lib/client/index.mjs:1450-1478](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/client/index.mjs#L1450-L1478)

退出客户端资源。

<details>
<summary>查看原文（29行）</summary>

```text
  const disposePet = () => {
    clearInterval(pollTimer)
    if (animTimer !== null) clearInterval(animTimer)
    if (sse !== null) sse.close()
    clearTimeout(wanderTimer)
    if (workingTimer !== null) clearTimeout(workingTimer)
    if (walkRaf !== null) cancelAnimationFrame(walkRaf)
    for (const t of bubbleTimers) clearTimeout(t) // 气泡残留计时器一并清
    bubbleTimers.clear()
    clearBubble() // 活动气泡引用清空（DOM 随 host.remove() 移除）
    dialogObserver.disconnect()
    document.removeEventListener('pointerdown', onDocPointerDown)
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('visibilitychange', onVisibility)
    document.removeEventListener('whale-girl:say', onPetSay)
    document.removeEventListener('whale-girl:fx', onPetFx)
    document.removeEventListener('whale-girl:status', onPetStatus)
    host.removeEventListener('mouseenter', onHostEnter)
    host.removeEventListener('mouseleave', onHostLeave)
    window.removeEventListener('resize', onResize)
    host.remove()
    style.remove()
  }
  // 插件整体卸载（client 条目卸载 / 重建）：宠物与设置卡片一起拆。
  const dispose = () => {
    disposePet()
    if (offSettings !== null) { offSettings(); offSettings = null }
  }
  return dispose
```

</details>

**依据 5 · 源码核查**：[lib/index.mjs:814-821](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/index.mjs#L814-L821)

末次落盘与路由卸载。

```text
    return () => {
      clearTimeout(saveTimer)
      saveState(state) // 末次落盘：disable/卸载前保留最终状态
      // 会话记忆末次落盘（memory 仅在开关开启时非 null——关=零写，天然不落盘）。
      clearTimeout(memorySaveTimer)
      if (memory !== null) saveSessionMemory(memory)
      for (const dispose of disposers) dispose()
    }
```

#### 缺口

- 缺少长期资源占用与目标用户继续使用反馈
  **影响**：无法支持持续安装结论
  **进一步探讨**：在相似工作时段观察遮挡、CPU/内存和用户是否愿意保持开启。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能借鉴什么，能提出什么可验证的陪伴假设？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可复用点是把纯账本、活动信号与显示动画分开，SSE只通知快照变化，再用轮询兜底；桌面显示权用短租约而非永久标志。纯函数账本便于检查经验值与称号规则，不依赖模型生成即能提供可解释反馈；移植需要等价任务事件、浏览器生命周期和可写本地目录。

由“活动反馈能即时出现，但任务状态不证明内容合格”推导一个未验证假设：把情绪性庆祝和可核验完成提示分成独立视觉语义，可能减少用户把动画误当质量确认，又保留陪伴感。例如一组只表示流程结束，另一组只有用户确认交付才出现；并非本插件已有业务验收机制，也不主张必须增加工作负担。

最小验证采用同类小任务的有无宠物、现有动画、语义区分动画三种界面，记录用户能否准确说明“任务结束”和“成果合格”、重要状态遗漏、干扰次数与继续使用意愿。任务质量标准独立制定，不能以宠物XP当分数。如果语义误认没有下降、增加手动确认反而更烦，或者用户更喜欢关闭宠物，就放弃这一扩展。尚无数据证明情绪收益或付费意愿，不从插件存在推断市场需求。

#### 证据与依据

**依据 1 · 源码核查**：[lib/src/pet-state.mjs:1-21](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/pet-state.mjs#L1-L21)

纯账本规则与模型无关。

<details>
<summary>查看原文（21行）</summary>

```text
// 积累型宠物账本：零负反馈——无衰减、无惩罚、无需求；一切向上积累。
// 契约：
// - 状态字段：level/xp（资历）、stats{tasksDone,failures,sessions,activeMs,firstSeenAt}、
//   titles（已解锁称号 id 数组）、memory（最近事件，环形，最多 MEMORY_MAX 条）、updatedAt。
// - 无 tick/衰减函数；所有变化都是事件驱动的纯函数，返回 { state, unlocked, leveledUp }，
//   不修改入参；称号由 stats 阈值派生（checkTitles 幂等）。
// - 等级 = xp 派生（xpForLevel 三角数列），禁止手写 level 字段。

export const INITIAL_STATE = Object.freeze({
  level: 1,
  xp: 0,
  stats: { tasksDone: 0, failures: 0, sessions: 0, activeMs: 0, firstSeenAt: null },
  titles: [],
  memory: [],
  updatedAt: 0,
})

export const MEMORY_MAX = 8
export const TASK_XP = 10
export const SESSION_XP = 5
export const RESUME_XP = 2
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:432-454](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/index.mjs#L432-L454)

当前庆祝绑定流程状态。

<details>
<summary>查看原文（23行）</summary>

```text
      // killed（用户取消）中性：不计 XP、不记失败、不写回忆（F4 语义）。
      // 订阅面 owners:'all'：注册上下文不落在任何 agent scope 内，覆盖全部 owner（与
      // 按 owner 分域的订阅相反——宠物账本是全局积累，不随会话隔离）。
      ctx.jobs.events.subscribe({ owners: 'all' }, (event) => {
        if (event.type !== 'settled') return // 注册/进度/停止/移除不记账
        const snapshot = event.job
        const now = Date.now()
        if (snapshot.status === 'completed') {
          const result = recordTaskCompleted(state, snapshot.label ?? '未命名任务', now)
          state = result.state
          // F3：账本与庆祝同源——记账即开庆祝窗口。页面关闭期间完成任务（轮询缺席、
          // deriveActivity 看不到翻转）时，重开后首次轮询仍能看到本窗口，同样庆祝；
          // 与轮询翻转的 celebrate 取 max 不叠加（CELEBRATE_MS 同 BURST_MS）。
          celebrateUntil = Math.max(celebrateUntil, now + configRef.celebrateMs)
          scheduleSave()
          emitSignal('celebrate', { label: snapshot.label ?? '未命名任务', level: state.level })
          if (result.leveledUp) emitSignal('levelUp', { level: state.level })
        } else if (snapshot.status === 'failed') {
          state = recordFailure(state, now).state
          scheduleSave()
          emitSignal('failure', { level: state.level })
        }
        // 会话记忆写入①（开关门控）：任务 settle 按 owner 精确归属到会话；
```

</details>

**依据 3 · 源码核查**：[lib/client/index.mjs:1356-1372](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/client/index.mjs#L1356-L1372)

SSE和轮询组合。

<details>
<summary>查看原文（17行）</summary>

```text
    loadAssets()
    refresh()
    pollTimer = setInterval(refresh, cfg.pollMs)
    animTimer = setInterval(tick, TICK_MS)
    scheduleWander()
    armWorking()
    // ---- SSE 即时事件（v9）：Node half 事件发生时推送，收到立即 refresh() ——
    // 回合完成庆祝/欢迎/思考陪伴不再等 pollMs 轮询（默认 3s → 单次 /state 往返）。
    // EventSource 断线自动重连（内建，retry 3s）；轮询保留兜底（SSE 不可用时照常跑）。
    try {
      sse = new EventSource(EVENTS_PATH)
      sse.onmessage = () => refresh()
      // onerror 不处理：EventSource 内建自动重连；重连期间轮询兜底，宠物照常。
    } catch {
      // EventSource 不可用（罕见）：轮询兜底，宠物照常跑
    }
  }
```

</details>

**依据 4 · 源码核查**：[lib/src/presence.mjs:5-15](https://github.com/vlln/whale-girl/blob/4b4350478c82d22d506a93567e52ab0ff90c2585/lib/src/presence.mjs#L5-L15)

显示权使用TTL。

<details>
<summary>查看原文（11行）</summary>

```text
export const PRESENCE_TTL_MS = 45000 // 心跳有效窗口（桌面端每 15s 续命一次）

/** 心跳续命/下线：返回新的在场截止时刻（online=false 立即下线）。 */
export function pokePresence(companionUntil, nowMs, online = true) {
  return online ? nowMs + PRESENCE_TTL_MS : 0
}

/** 当前是否处于桌面伴侣在场窗口内（companionUntil 为截止时刻）。 */
export function companionOnline(companionUntil, nowMs) {
  return companionUntil > nowMs
}
```

</details>

#### 缺口

- 语义区分动画未实现、未做用户比较
  **影响**：不能称减少误认已成立
  **进一步探讨**：先以界面样稿比较理解和干扰，再决定是否修改。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
