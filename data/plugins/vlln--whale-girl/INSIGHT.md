# Whale Girl

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c3f4afb](https://github.com/vlln/whale-girl/tree/c3f4afb400755062991c7e9991b745b3016abeeb)

<!-- BEGIN META -->
[![GitHub ★ 400](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=400&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vlln/whale-girl) [![npm 30d 4,328](https://img.shields.io/static/v1?label=npm+30d&message=4%2C328&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/whale-girl) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/whale-girl)
<!-- END META -->

> **功能**：在 DSH 网页中显示可互动宠物，随任务与会话活动变化并积累等级、称号和回忆。

> **亮点**：[Q01](#research-q01) 将普通动画与宿主任务/会话活动相连，后台事件驱动积累，与页面是否开启分离。 [Q02](#research-q02) 将成长账本和可选会话记忆分开，降低关闭记忆对宠物互动的耦合，但没有效率提升证据。

> **主要限制**：[Q01](#research-q01) 的 completed 与庆祝是流程状态，不能替代成果验收。 [Q02](#research-q02) 的保存失败静默继续、全局任务聚合与隐藏后继续记账，也使等级和回忆不适合当可靠审计。

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
  - [Q01 · 宠物如何从真实会话活动得到状态，较普通装饰增加什么？](#detail-section-11)
  - [Q02 · 成长与记忆保存什么，能否隔离模型上下文和退出读取？](#detail-section-12)
  - [Q03 · 安装、更新与持续使用付出什么，怎样判断值得保留？](#detail-section-13)
  - [Q04 · 如何检验成长提示是否反映有效任务而非活动量？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢视觉陪伴的本地 DSH 网页用户，可用宠物观察活动与互动；成果仍由原任务验收。

普通贴图或动画不接宿主状态，宿主任务面板提供更直接状态；宠物的增量是互动表达与积累，不是更准确的任务验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 互动宠物 | 拖拽、喂食、玩耍和视觉陪伴 | DSH 网页，不等于独立桌面应用 |
| 活动反应 | 表达任务完成、失败和会话活动 | 不是成果质量验收 |
| 等级与称号 | 本机积累活动记录 | 全局任务，保存失败可丢历史 |
| 可选会话回忆 | 续接时播报近期标签 | 默认关闭，有界父链，文件保留 |
| 配置与更新入口 | 调整宠物及按安装来源更新 | 更新依赖宿主包管理器和外网 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web、jobs/agents/sessions/webServer | 根插件必需 | 事件、快照与网页加载 | 无法据目录收录保证兼容 |
| 精灵 manifest 与图像 | 动画必需 | 将状态映射为动作 | 缺图显示占位，非正常动画 |
| 可写 DSH 数据目录 | 保留成长/记忆必需 | 本机 JSON | 写失败只留本次运行状态 |
| profile 包管理与外网 | 检查/执行更新时必需 | GitHub/npm来源与安装 | 更新不可用不等于宠物核心失效 |
| 本地单用户环境 | 本次试用边界 | 避免未核共享暴露 | 共享/公网外层授权另核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 加载 | 用户加入 web profile 后重启 | 显示宠物且不遮挡主要控件 |
| 检查 | 用户运行已知完成、取消和失败任务 | 对比原始任务状态，勿以经验当质量 |
| 选择记忆 | 用户按需打开会话记忆 | 知道本机文件保存标签、关闭仍保留文件 |
| 退出 | 用户隐藏或卸载，保留需要的状态副本 | 隐藏保留设置卡；停后台记账须卸载 |

**效果与成本**

[Q03](#research-q03) 分首次、持续、失败和退出列出资源及人工负担，未实测金额、资源或时间。

[Q03](#research-q03) 的效果表只支持活动表达与清理机制，不推出情绪或效率收益。

> **思考**：[Q01](#research-q01) 的 completed 与庆祝是流程状态，不能替代成果验收。 [Q02](#research-q02) 的保存失败静默继续、全局任务聚合与隐藏后继续记账，也使等级和回忆不适合当可靠审计。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将普通动画与宿主任务/会话活动相连，后台事件驱动积累，与页面是否开启分离。 [Q02](#research-q02) 将成长账本和可选会话记忆分开，降低关闭记忆对宠物互动的耦合，但没有效率提升证据。

[Q02](#research-q02) 纯函数账本、有界分预算记忆和完整客户端清理可借鉴。静默保存失败保可用性但牺牲历史可靠性；跨源拒绝与宿主授权是不同边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 的 completed 与庆祝是流程状态，不能替代成果验收。 [Q02](#research-q02) 的保存失败静默继续、全局任务聚合与隐藏后继续记账，也使等级和回忆不适合当可靠审计。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 适合本地单用户小范围试用。先检查完成/取消/失败反应和页面控件，默认关闭会话记忆；若庆祝误导、遮挡或分心就停用，回宿主任务面板，需停所有记账时卸载而不只隐藏。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核根 bundle、事件到动画的关键链路、记忆开关与清理。陪伴机制有源码依据，主观价值、资源与宿主兼容未实测；新里程碑设计为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.mjs、lib/src/pet-state.mjs、lib/src/activity.mjs、lib/src/session-memory.mjs、lib/client/index.mjs、lib/src/update-host.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根网页插件及定向事件、记忆、更新入口和清理；desktop 为独立应用只核分发边界。未执行目标代码、测试、安装、网页或宿主，未开展共享/公网授权验证。
- 下一步：按 [Q03](#research-q03) 对比完成/取消/失败及退出，再按 [Q04](#research-q04) 比较提示理解、干扰和资源；原始任务结果始终独立验收。

**分析版本**

- **仓库**：[vlln/whale-girl](https://github.com/vlln/whale-girl)
- **版本号**：0.2.4（[固定提交 c3f4afb](https://github.com/vlln/whale-girl/tree/c3f4afb400755062991c7e9991b745b3016abeeb)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设区分流程结束与用户确认里程碑可减少误读，但项目定位本是陪伴，新增确认可能反而打断；需对照理解与负担后决定。

按 [Q03](#research-q03) 对比完成/取消/失败及退出，再按 [Q04](#research-q04) 比较提示理解、干扰和资源；原始任务结果始终独立验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 111 | 5224 | — | — | 94227 |
| .mjs | source | 50 | 7264 | 5227 | 1802 | — |
| .cjs | source | 1 | 14 | 11 | 2 | — |
| .js | source | 3 | 2291 | 2188 | 93 | — |
| .mjs | test | 35 | 4322 | 3639 | 286 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/vlln/whale-girl/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/vlln/whale-girl/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/vlln/whale-girl/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本网页宠物能否提供有边界的活动提示与可退出陪伴，而不把活动量当工作成果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 宠物如何从真实会话活动得到状态，较普通装饰增加什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

Whale Girl 是 DSH 网页内的可拖动、喂食和玩耍的悬浮宠物，适合主动喜欢视觉陪伴的本地单用户；合格结果是活动变化有可理解的反馈、控件仍能使用，而不是完成更多业务任务。普通动画或静态贴图是直接替代，本组件增加与宿主任务、会话活动联动的状态和可积累记录。

根 Node 插件依赖 jobs、agents、sessions、webServer。它订阅所有 owner 的 settled 事件，completed 增加任务数和经验，failed 计失败，killed 不计经验也不计失败；事件广播让客户端重新读取快照，轮询是备用路径。账本用纯函数积累经验与称号，页面按状态播放对应动作，因此后台记账与页面是否开启分离。

这不是按当前可见会话隔离的业务统计。owners:all 明确聚合宿主任务，而 completed 只说明宿主任务生产者报告完成，没有独立的代码验收或用户认可条件。空任务/运行态消失也可触发备用庆祝。把这种反馈用于陪伴有合理机制，把等级当生产力或交付质量则超出证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-48](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/README.md#L21-L48)

作者安装与交互说明，支持定位但非效果验证。

<details>
<summary>查看原文（28行）</summary>

````text
## Installation

Official **bundle plugin** (`dsh.bundle` + `dsh.client` in root `package.json`), managed via the official profile:

```sh
dsh plugin --profile web add whale-girl                        # npm source (build artifacts ship in the package)
# to track the latest commit instead: dsh plugin --profile web add "github:vlln/whale-girl#main"
# or local directory: dsh plugin --profile web add <path-to-whale-girl>
```

**Restart web** after installing (bundle layers compose at startup); the pet appears bottom-right: click for its menu (🍗 feed / 🎾 play), drag to move, hover for the status bar (seniority level / task count / recent shared memories). Hidden on onboarding pages.

Update via `dsh plugin --profile web update whale-girl` (or switch the git ref), then restart.

## Usage

| You / event | Pet behavior |
|---|---|
| Drag the pet | Stretched diagonally (`drag`) |
| Menu 🍗 feed / 🎾 play | Chomping / ball toss (`eat`/`play`) → joy (`joy`) |
| Idle ≥60s | Naps (`sleep`); wakes on interaction (`wake`) |
| Task done / level-up / title / round done | Cheers (`celebrate`) |
| Task failed / request error | Startled (`error`) → disappointed (`disappointed`) |
| New session | Waves welcome (`welcome`) |
| Session running / thinking | Pensive company (`think`, occasional `working`) |
| Awaiting approval | Expectant waiting (`wait`) |
| Periodic wandering | Walking (`walk`) |
| Default | Idle standby (`idle`, random blinks / turns) |
````

</details>

**依据 2 · 源码核查**：[lib/index.mjs:419-452](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/index.mjs#L419-L452)

实际订阅所有 owner 的任务终态并修改账本、广播信号。

<details>
<summary>查看原文（34行）</summary>

```text
    const disposers = [
      // pet 服务（开放性窄缝）：只读快照 + 信号订阅。其他插件 inject ['whale-girl.pet']
      // 消费；服务缺席时消费方应容忍（whale-girl 自己处理 sessions 缺席即先例）。
      // 命名带 whale-girl 前缀避免与第三方插件的通用服务名（如 'pet'）撞名——
      // cordis 同 scope 同名服务直接抛 "service ... has been registered"（见
      // 2026-08-15-pet-service-namespace 决策记录）。
      // 不暴露任何写面（账本语义由 whale-girl 独占，防第三方破坏积累不变量）。
      ctx.provide('whale-girl.pet', {
        snapshot: () => ({ pet: state, activity: activity() }),
        onSignal: (fn) => signals.subscribe(fn),
      }),
      // 事件驱动记账（F1）：任务终态恰回调一次，与浏览器轮询解耦——
      // GUI 关闭期间完成/失败的任务也入账（此前靠轮询观察 running 翻转，漏记窗口大）。
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
```

</details>

**依据 3 · 源码核查**：[lib/src/pet-state.mjs:84-110](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/src/pet-state.mjs#L84-L110)

任务与会话经验按事件计数，未评价业务交付。

<details>
<summary>查看原文（27行）</summary>

```text
/** 任务完成：资历 +TASK_XP，记入统计与回忆。 */
export function recordTaskCompleted(state, taskLabel, nowMs) {
  const n = state.stats.tasksDone + 1
  return commit(state, { tasksDone: n }, nowMs, `完成任务「${truncate(taskLabel)}」（第 ${n} 个）`, TASK_XP)
}

/** 任务失败：只计数与回忆（不惩罚、不扣资历）。 */
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
    SESSION_XP,
  )
}

/** 续接/延续（source=resume/compact/clear）：+RESUME_XP，不计会话数、不记首见（不是新会话）。 */
export function recordSessionResume(state, nowMs) {
  return commit(state, {}, nowMs, '回到旧会话，继续陪伴', RESUME_XP)
```

</details>

**依据 4 · 源码核查**：[lib/src/activity.mjs:49-65](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/src/activity.mjs#L49-L65)

备用庆祝以活动变化推导，不能等同合格任务。

<details>
<summary>查看原文（17行）</summary>

```text
  for (const t of tasks) {
    const prev = known.get(t.id)
    if (prev === 'running' && t.status === 'completed') {
      completed.push(t.id)
      burst = betterBurst(burst, { name: 'celebrate', until: nowMs + BURST_MS })
    } else if (prev === 'running' && t.status === 'failed') {
      failed.push(t.id)
      burst = betterBurst(burst, { name: 'error', until: nowMs + errorMs })
    } else if (prev === 'running' && t.status === 'killed') {
      sawKill = true
    }
    known.set(t.id, t.status)
  }
  // 任务从列表消失也视为完成（列表可能只保留活跃任务）。
  // killed 中性：本轮观察到 running→killed 时不触发兜底庆祝（用户取消不是成就）。
  if (wasWorking && !working && !sawKill) {
    burst = betterBurst(burst, { name: 'celebrate', until: nowMs + BURST_MS })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 成长与记忆保存什么，能否隔离模型上下文和退出读取？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

成长账本与可选会话记忆是两份本机 JSON，分别位于 DSH 数据目录的 state.json 和 sessions.json。记忆记录会话标题、父链和有界任务标签，并非模型记忆。纯逻辑最多保留64个用户会话、16个子会话，每会话8条任务，父链查找有限跳数；子会话不播报回忆，避免密集委派挤掉用户会话和重复问候。

实际接线支持开关边界。默认会话记忆关闭，首次启用才读取文件；关闭边沿会把已开启期间待写内容最后保存一次，随后丢弃内存记忆和待播快照，停止后续记忆读写，磁盘文件保留。关闭记忆不关闭成长账本。任务优先按 owner 归属，没有 owner 时退回最近活跃会话，因此这种标签归属是有条件的推断。/state 仅在开关和时间窗满足时发送回忆供气泡显示；抽读路径未发现将其注入模型或上传至外部服务，不把该结论扩为全仓隐私审计。

持久化失败被 catch 吞掉，插件继续提供当前运行状态；损坏文件加载会返回空账本。因此“本机保存”不等于可靠审计或备份。网页关闭开关拆除计时器、SSE、监听器与宠物 DOM，保留设置卡供再次开启；整体卸载再移除设置卡。Node 仍能为后台任务记账，单纯隐藏宠物不是停止所有数据处理。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:48-93](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/index.mjs#L48-L93)

两个独立数据文件，读取/保存失败继续运行。

<details>
<summary>查看原文（46行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:189-221](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/index.mjs#L189-L221)

关闭边沿最后保存与之后零读写的实际开关逻辑。

<details>
<summary>查看原文（33行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/index.mjs:454-468](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/index.mjs#L454-L468)

owner 优先、最近会话后备归属。

<details>
<summary>查看原文（15行）</summary>

```text
        // 会话记忆写入①（开关门控）：任务 settle 按 owner 精确归属到会话；
        // 无属主（插件自起任务等）退回「最近活跃会话」，两者皆无则跳过——不猜归属。
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
```

</details>

**依据 4 · 源码核查**：[lib/index.mjs:589-600](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/index.mjs#L589-L600)

可选记忆仅在配置与窗口内随快照发到客户端。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/src/session-memory.mjs:19-31](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/src/session-memory.mjs#L19-L31)

有界会话数、任务数与父链跳数。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[lib/client/index.mjs:1447-1478](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/client/index.mjs#L1447-L1478)

隐藏宠物与整体卸载的清理范围不同。

<details>
<summary>查看原文（32行）</summary>

```text
  // 停宠物（enabled=false 的网页端渲染开关路径；幂等——计时器/监听器/节点均可重复清理）。
  // 只拆宠物本体，不拆设置卡片：卡片是 enabled 的唯一 UI 入口，连它一起拆会让
  // enabled=false 不可逆（卡片消失且刷新也回不来；见本次缺陷复盘）。
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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装、更新与持续使用付出什么，怎样判断值得保留？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

建议对喜欢界面陪伴的本地单用户作有条件试用，目的限定为活动提示与互动。安装按作者的 web profile 命令并重启；独立 desktop 伴侣是另一个应用，不随本包自动安装，本次不把桌面常驻能力算成网页插件已验。

依赖不仅是精灵图。宿主须提供任务/会话事件、webServer 与客户端加载；包页配置卡依赖宿主界面槽。更新检查可能访问 GitHub 或 npm，POST 通过 profile 包管理器实施更新。跨源检查能拒绝网页跨站请求，但不能替代宿主身份与会话授权；共享或公网部署的外层访问控制本轮没有核实，故试用范围限本地单用户，不从缺少目标执行推断已出现越权。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包和图像下载、宿主环境；金额未知 | 加入 profile、重启、核界面遮挡；耗时未知 | 桌面伴侣另装另计，不隐含 Rust 构建成本 |
| 持续使用 | 浏览器动画、轮询/SSE与本地账本；资源实耗未知 | 调整尺寸/游走/记忆，核对活动提示 | 不存在由已读宠物链路触发模型生成的证据，不能推为所有服务免费 |
| 失败恢复 | 保留配置与状态副本；存储增长未知 | 核坏文件和丢记录，退回宿主原始状态 | 保存失败可静默继续，历史不能用于审计 |
| 退出 | 保留状态文件的磁盘空间 | 隐藏宠物或卸载插件，需删除数据时另行处理 | 关闭会话记忆保留文件，隐藏不停止 Node 账本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态联动 | 事件触发记账和页面快照刷新 | 浏览器/宿主特定版本的实际反应 |
| 可退出互动 | 清理页面计时器、SSE和节点 | 长时资源与全部浏览器行为 |
| 陪伴价值 | 可积累、不因失败扣分的设计 | 情绪、专注、满意度与效率无独立对照 |

先用完成、取消、失败三个已知任务检查反应，再观察一段正常工作是否遮挡或分心。成功标准是理解提示来源且愿意保留；若误认为庆祝代表成果已合格、挡住控件、反复丢记录或干扰工作，就停用宠物并看宿主任务面板。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-33](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/README.md#L21-L33)

作者 web 安装、重启与更新方式。

<details>
<summary>查看原文（13行）</summary>

````text
## Installation

Official **bundle plugin** (`dsh.bundle` + `dsh.client` in root `package.json`), managed via the official profile:

```sh
dsh plugin --profile web add whale-girl                        # npm source (build artifacts ship in the package)
# to track the latest commit instead: dsh plugin --profile web add "github:vlln/whale-girl#main"
# or local directory: dsh plugin --profile web add <path-to-whale-girl>
```

**Restart web** after installing (bundle layers compose at startup); the pet appears bottom-right: click for its menu (🍗 feed / 🎾 play), drag to move, hover for the status bar (seniority level / task count / recent shared memories). Hidden on onboarding pages.

Update via `dsh plugin --profile web update whale-girl` (or switch the git ref), then restart.
````

</details>

**依据 2 · 作者声明**：[README.md:52-63](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/README.md#L52-L63)

桌面伴侣是单独应用，不能算成自动安装能力。

<details>
<summary>查看原文（12行）</summary>

````text
## Desktop Companion (Optional)

`desktop/` is a **standalone companion app** (Node engine + Tauri shell, zero runtime deps) that keeps the whale girl resident on your OS desktop. **Not installed via `dsh plugin`** — enable it yourself:

```sh
# Prereqs: Node ≥18; the rendering shell needs Rust (cargo)
npm install -g whale-girl-desktop   # npm install (engine + Tauri shell source included)
whale-girl-desktop --headless       # headless: presence heartbeat + state polling + SSE
cd "$(npm root -g)/whale-girl-desktop/src-tauri" && cargo build --release  # first build ~5-15 min; artifact target/release/whale-girl-desktop (~12MB)
./target/release/whale-girl-desktop   # transparent always-on-top desktop pet (defaults to local DSH on 3080)
# WHALE_GIRL_BASE_URL=http://IP:PORT points at a non-local DSH
# or from source: cd desktop && npm install && cd src-tauri && cargo build --release
````

</details>

**依据 3 · 源码核查**：[lib/index.mjs:624-636](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/index.mjs#L624-L636)

更新 GET/POST 具有跨源检查且调用宿主更新服务。

<details>
<summary>查看原文（13行）</summary>

```text
      // 版本与更新端点：GET 只读检查（卡片挂载时拉一次；要出网，同样挡跨源，免得别的页面刷上游配额），
      // POST 执行更新（写动作）。两者沿用 /interact 的跨源判据（sec-fetch-site / origin 对 host）。
      webServer.register({
        kind: 'exact',
        path: UPDATE_PATH,
        handler: async (req, res) => {
          try {
            if (req.method === 'GET' || req.method === 'POST') {
              if (isCrossOrigin(req.headers, req.headers.host)) {
                json(res, 403, { error: 'cross-origin request rejected' })
                return
              }
              json(res, 200, req.method === 'GET' ? await updateHost.status() : await updateHost.apply(), { 'cache-control': 'no-store' })
```

</details>

**依据 4 · 源码核查**：[lib/src/update-host.mjs:93-106](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/src/update-host.mjs#L93-L106)

更新依赖 profile 包管理器而非宠物自行保证安装能力。

<details>
<summary>查看原文（14行）</summary>

```text
  /** 宿主是否提供了可用的安装能力（决定这一行摆不摆更新动作）。 */
  function canInstall() {
    const manager = managerOf()
    return manager !== undefined && typeof manager.installBundle === 'function'
  }

  /** 宿主的包管理服务当前记录的自身安装来源（每次用时再取：插件可能比服务先起）。 */
  async function selfBundle() {
    const manager = managerOf()
    if (manager === undefined || typeof manager.listBundles !== 'function') return undefined
    try {
      const bundles = await manager.listBundles()
      if (!Array.isArray(bundles)) return undefined
      return bundles.find((bundle) => bundle !== null && typeof bundle === 'object' && bundle.name === self.name)
```

</details>

**依据 5 · 源码核查**：[lib/client/index.mjs:1447-1478](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/client/index.mjs#L1447-L1478)

退出与重新开启所需清理边界。

<details>
<summary>查看原文（32行）</summary>

```text
  // 停宠物（enabled=false 的网页端渲染开关路径；幂等——计时器/监听器/节点均可重复清理）。
  // 只拆宠物本体，不拆设置卡片：卡片是 enabled 的唯一 UI 入口，连它一起拆会让
  // enabled=false 不可逆（卡片消失且刷新也回不来；见本次缺陷复盘）。
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

#### 缺口

- 没有陪伴/分心、资源与同任务效果对照。
  **影响**：无法声称提升专注、情绪或任务效率，也不能量化持续成本。
  **进一步探讨**：让目标用户在同一工作负载下比较隐藏、普通装饰、状态联动三种界面，记录提示理解、遮挡、资源和继续使用意愿。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何检验成长提示是否反映有效任务而非活动量？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设是把当前“宿主任务完成”的庆祝与用户确认合格的里程碑明确区分，可能减少用户把活动量误认成业务进度。推导依据是任务 settled 到经验的直连，以及活动消失也能触发庆祝的备用路径。反证是项目本来定位陪伴宠物而非验收系统，用户也许不会产生这种误解；若如此就没有必要引入确认。

对照应保留相同宠物、任务和动画，只改变提示是否明确说明“流程结束”以及是否另设用户确认里程碑。使用含取消、失败后重试和表面完成但验收失败的任务，观察用户能否区分完成状态与合格结果，并记录额外确认次数、分心程度和继续使用意愿。若理解没有改善，或确认负担和打断超过收益，应放弃该改造。这个方向不计为插件已有贡献，也不把经验阈值重新包装为业务质量。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:435-448](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/index.mjs#L435-L448)

完成事件直接增加账本与庆祝，是假设来源。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/src/activity.mjs:62-65](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/src/activity.mjs#L62-L65)

备用活动结束触发庆祝，未核业务验收。

```text
  // 任务从列表消失也视为完成（列表可能只保留活跃任务）。
  // killed 中性：本轮观察到 running→killed 时不触发兜底庆祝（用户取消不是成就）。
  if (wasWorking && !working && !sawKill) {
    burst = betterBurst(burst, { name: 'celebrate', until: nowMs + BURST_MS })
```

**依据 3 · 源码核查**：[lib/src/pet-state.mjs:84-93](https://github.com/vlln/whale-girl/blob/c3f4afb400755062991c7e9991b745b3016abeeb/lib/src/pet-state.mjs#L84-L93)

完成加经验、失败不扣分，证明当前语义是陪伴。

<details>
<summary>查看原文（10行）</summary>

```text
/** 任务完成：资历 +TASK_XP，记入统计与回忆。 */
export function recordTaskCompleted(state, taskLabel, nowMs) {
  const n = state.stats.tasksDone + 1
  return commit(state, { tasksDone: n }, nowMs, `完成任务「${truncate(taskLabel)}」（第 ${n} 个）`, TASK_XP)
}

/** 任务失败：只计数与回忆（不惩罚、不扣资历）。 */
export function recordFailure(state, nowMs) {
  const n = state.stats.failures + 1
  return commit(state, { failures: n }, nowMs, `任务失败（第 ${n} 次）——没关系，再来`)
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
