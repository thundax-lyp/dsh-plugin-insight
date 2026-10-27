# oh-my-dsh

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6afcd57](https://github.com/1225Sakura/oh-my-deepseekharness/tree/6afcd572071d98896153492b9e7fecf18ea97352)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1225Sakura/oh-my-deepseekharness) [![npm 30d 2,109](https://img.shields.io/static/v1?label=npm+30d&message=2%2C109&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)
<!-- END META -->

> **功能**：为DSH提供角色技能、任务编排协议、团队状态与代码智能工具。

> **亮点**：相对单纯提示词角色集合，可核查增量是结构化阶段迁移、队员身份、文件邮箱和终态守卫，为团队交接提供外部状态。相对宿主原生子代理，它增加编排约定及可查看的进度账本；角色和skills继承OMC/OMX理念，不应把移植数量当原创。恢复能力仍不等同自动续跑或主仓合并正确性。 依据[Q03](#research-q03)。

> **主要限制**：关键质疑是持久账本能否覆盖读写失败并约束真正执行。readPhaseState的JSON解析失败会抛错，但readFile包在未检查错误码的catch中，读权限或I/O错误也可能返回null；transitionPhasePersist会将null作为initialPhaseState继续，静态链路因此不能支持所有异常都保留阶段的强主张。本轮未制造文件故障，不能称已复现丢失；此外队员登记发生在spawn之后，两个动作不是同一事务。 依据[Q04](#research-q04)。

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
  - [Q01 · 谁在什么场景需要它，合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、处理链及状态如何实现？](#detail-section-12)
  - [Q03 · 相对简单替代的实质增量是什么？](#detail-section-13)
  - [Q04 · 什么限制最可能使贡献不成立？](#detail-section-14)
  - [Q05 · 启动、持续与恢复依赖哪些条件？](#detail-section-15)
  - [Q06 · 全周期成本和实际效果支持到哪里？](#detail-section-16)
  - [Q07 · 实现有哪些可借鉴处和维护边界？](#detail-section-17)
  - [Q08 · 什么新假设值得验证，怎样推翻它？](#detail-section-18)
  - [Q09 · 对谁值得采用，何时停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是需要多角色规划、执行和评审的DSH开发者，原办法是人工分派代理并在聊天里维护状态。合格交付应是可定位的各队员产物、完成状态与主仓验收，而非角色数量。README将其定位为OMC/OMX适配，三种模式承担不同任务组织方式；短问题和单文件修改通常不值得额外协议开销。

宿主原生子代理加人工状态表；角色协议来源于OMC/OMX而非独立新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 硬路由委派 | 按tier/model派发 | 需宿主subagents |
| 团队状态 | 阶段、身份与邮箱 | 非自动合并保证 |
| 心跳检查 | 标记停滞队员 | 不自动杀死或恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| tools/skills/systemPrompt/commands | 必需 | 注册编排能力 | 启动拒绝 |
| subagents | 委派必需 | 真实派发 | 委派不可用 |
| 可写.omd | 团队必需 | 状态与邮箱 | 人工核对不得重置 |
| LSP本体 | 可选 | 代码智能 | 显式降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 安装重载后doctor | 确认当前实装版本 |
| 2 | 领队选择模式并派发 | 原代理与登记ID对应 |
| 3 | 核对队员产物再合并 | 状态与差异冲突则暂停 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node及模型账户 | 重载、doctor、角色配置 | 耗时未知 |
| 持续使用 | 多代理调用量未知 | 领队、评审与产物验收 | 无同条件总成本 |
| 失败恢复 | 可能重复调用 | 核对代理与.omd状态 | 派发和登记非同事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 团队交接 | 外部阶段和身份账本 | 故障恢复完整性 |
| 任务质量 | 提供角色协议与验收入口 | 合格率改善 |

> **思考**：关键质疑是持久账本能否覆盖读写失败并约束真正执行。readPhaseState的JSON解析失败会抛错，但readFile包在未检查错误码的catch中，读权限或I/O错误也可能返回null；transitionPhasePersist会将null作为initialPhaseState继续，静态链路因此不能支持所有异常都保留阶段的强主张。本轮未制造文件故障，不能称已复现丢失；此外队员登记发生在spawn之后，两个动作不是同一事务。 依据[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对单纯提示词角色集合，可核查增量是结构化阶段迁移、队员身份、文件邮箱和终态守卫，为团队交接提供外部状态。相对宿主原生子代理，它增加编排约定及可查看的进度账本；角色和skills继承OMC/OMX理念，不应把移植数量当原创。恢复能力仍不等同自动续跑或主仓合并正确性。 依据[Q03](#research-q03)。

可复用设计是runId隔离、终态不复活、registry文件锁与append-only邮箱，适合异步任务身份管理。移植须保留ID校验、原子写入和状态迁移，而非只搬协议文本。值得补强的是读文件错误分类与spawn登记之间的恢复协调；当前注释比可见catch的实际范围更强，维护者应以代码行为作为恢复边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键质疑是持久账本能否覆盖读写失败并约束真正执行。readPhaseState的JSON解析失败会抛错，但readFile包在未检查错误码的catch中，读权限或I/O错误也可能返回null；transitionPhasePersist会将null作为initialPhaseState继续，静态链路因此不能支持所有异常都保留阶段的强主张。本轮未制造文件故障，不能称已复现丢失；此外队员登记发生在spawn之后，两个动作不是同一事务。 依据[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

本次建议观察，尚不建议把团队编排交给该账本。独立工作树只能降低文件覆盖影响，无法解决派发已发生但登记缺失时的重复执行；读取失败后的null又可能误呈为新run。未核实存在无需依赖同一账本就能识别未知派发、接回原代理且保证不重做的完整路径。因此先审阅状态机制，只有补足这条恢复证据后再考虑任务试用。出现阶段重置或无登记派发时保留.omd及原代理，停止新派发并手工核对产物。 依据[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的机制判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/team.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本的作者说明、注册入口和下列实际源码；未执行目标代码、安装或真实宿主验收。
- 下一步：- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

**分析版本**

- **仓库**：[1225Sakura/oh-my-deepseekharness](https://github.com/1225Sakura/oh-my-deepseekharness)
- **版本号**：0.5.2（[固定提交 6afcd57](https://github.com/1225Sakura/oh-my-deepseekharness/tree/6afcd572071d98896153492b9e7fecf18ea97352)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是给每次spawn加持久意图和唯一dispatchId，再把未确认派发显式列为待协调，能减少代理已启动但登记缺失时的重复执行。最小实验在spawn前后、registry写前后分别中断，对比原流程与意图账本的重复派发数、可恢复任务数和人工核对时间。若宿主无法以dispatchId查询原代理，意图账本只增加文件而不能降低不确定性，应否定自动恢复收益。 依据[Q08](#research-q08)。

- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 174 | 22325 | — | — | 273988 |
| .mjs | source | 18 | 2710 | 2235 | 328 | — |
| .js | source | 30 | 6487 | 4728 | 1433 | — |
| .js | test | 46 | 10371 | 8875 | 946 | — |
| .mjs | example | 1 | 83 | 74 | 5 | — |
| .mjs | test | 1 | 66 | 42 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1225Sakura/oh-my-deepseekharness/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：基于宿主委派的团队状态与评审协议是否比人工多代理交接更可靠且可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么场景需要它，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标是需要多角色规划、执行和评审的DSH开发者，原办法是人工分派代理并在聊天里维护状态。合格交付应是可定位的各队员产物、完成状态与主仓验收，而非角色数量。README将其定位为OMC/OMX适配，三种模式承担不同任务组织方式；短问题和单文件修改通常不值得额外协议开销。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-12](https://github.com/1225Sakura/oh-my-deepseekharness/blob/6afcd572071d98896153492b9e7fecf18ea97352/README.md#L5-L12)

作者明确移植定位与模式。

```text
**DeepSeek Harness 的多智能体编排层** —— OMC / OMX 编排理念的 dsh 宿主适配实现。
Multi-agent orchestration layer for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), adapted from:

- [oh-my-claudecode (OMC)](https://github.com/Yeachan-Heo/oh-my-claudecode) — Claude Code 编排层
- [oh-my-codex (OMX)](https://github.com/Yeachan-Heo/oh-my-codex) — Codex 编排层

omd 以单个 dsh 插件交付：注入编排协议到系统提示词、注册 42 个 skill 目录 + 33 个 `omd-agent-*` 角色卡（66 个双语文件，会话技能目录共 75 条）与 2 个斜杠命令、挂载内置 MCP server 提供 55 个状态/记忆/协调/代码智能/graph 运行时工具。三种执行模式（autopilot / ralph / team）：autopilot 与 ralph 由 dsh 原生 `goal` / `ralph` 工具驱动前台循环；team 由 `lib/team.js` 领队运行时驱动（阶段状态机 + 队员 UUID 生命周期 + mailbox + heartbeat + merge 计划，无 tmux——dsh 无承载面）。

```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、处理链及状态如何实现？

**研究主题**：功能与机制

#### 完整回答

入口探测tools、skills、systemPrompt、commands，注册技能、命令、记忆、委派、heartbeat和HUD。omd_delegate通过宿主subagents硬路由派发，实际spawn与登记队员是两个动作。team模块按runId分目录保存phase、registry和mailbox；阶段迁移拒绝终态复活，队员UUID和终态约束使旧执行不直接覆盖新队员。心跳只检测stale并呈报，模型领队仍负责催促、接管和合并。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:16-26](https://github.com/1225Sakura/oh-my-deepseekharness/blob/6afcd572071d98896153492b9e7fecf18ea97352/lib/index.js#L16-L26)

宿主服务清单。

<details>
<summary>查看原文（11行）</summary>

```text
export const name = 'oh-my-dsh'
// 双清单语义（M1.1 修复）：
// - CORE_SERVICES：缺失即抛错（规格 §6.1 例外条款——没有它们插件根本无法工作）
// - inject 全量 = CORE_SERVICES + storage：storage 必须进 inject（cordis 对未 inject
//   服务的访问抛错——B1 教训；dsh-base 的 cordis.patch.yml 挂载了 dsh-storage 三件套，
//   任何 base profile 都保证它存在）。storage 缺失仍走降级不抛错（防御非 base profile）。
const CORE_SERVICES = ['tools', 'skills', 'systemPrompt', 'commands']
// M3 c1：subagents 进 inject（设计规格 §7-5：omd_delegate 用宿主 dsh-subagent 服务 spawn
// 指定 model）——cordis 对未 inject 服务的访问抛错（B1 教训）；dsh-base 每个模板都挂
// subagent 缝，缺席时 setup 内 tryGet 降级记 probeReport.delegate=unavailable。
export const inject = [...CORE_SERVICES, 'storage', 'subagents']
```

</details>

**依据 2 · 源码核查**：[lib/team.js:151-179](https://github.com/1225Sakura/oh-my-deepseekharness/blob/6afcd572071d98896153492b9e7fecf18ea97352/lib/team.js#L151-L179)

spawn外部完成后登记队员。

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * 登记队员（实际 spawn 由领队经 omd_delegate/subagent 完成后调用本函数落账）。
 * workerId 省略时生成 `w-<uuid8>`；status 初始 dispatched。
 */
export async function registerWorker({ cwd, runId, stateDir = '.omd', worker }) {
  assertIsoTs(worker.spawnedAt, 'spawnedAt')
  return withRegistryLock(cwd, runId, stateDir, async () => {
    const now = new Date().toISOString()
    const cur = (await readRegistry(cwd, runId, stateDir)) ?? { runId, createdAt: now, workers: {} }
    const workerId = worker.workerId ?? `w-${randomUUID().replaceAll('-', '').slice(0, 8)}`
    assertWorkerId(workerId)
    if (cur.workers[workerId]) throw new Error(`team: workerId 已存在: ${workerId}`)
    if (!worker.role) throw new Error('team: registerWorker 缺 role（生命周期必须绑定角色）')
    const w = {
      workerId, runId,
      dispatchId: worker.dispatchId ?? null,
      agentId: worker.agentId ?? null,
      role: worker.role,
      tier: worker.tier ?? null,
      phase: worker.phase ?? null,           // 服务哪个阶段（team-exec 等）
      status: 'dispatched',
      stale: false,
      spawnedAt: worker.spawnedAt ?? now,
      lastHeartbeatAt: worker.spawnedAt ?? now,
      note: worker.note ?? '',
    }
    cur.workers[workerId] = w
    await writeRegistry(cwd, runId, cur, stateDir)
    return w
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对简单替代的实质增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对单纯提示词角色集合，可核查增量是结构化阶段迁移、队员身份、文件邮箱和终态守卫，为团队交接提供外部状态。相对宿主原生子代理，它增加编排约定及可查看的进度账本；角色和skills继承OMC/OMX理念，不应把移植数量当原创。恢复能力仍不等同自动续跑或主仓合并正确性。

#### 证据与依据

**依据 1 · 源码核查**：[lib/team.js:189-209](https://github.com/1225Sakura/oh-my-deepseekharness/blob/6afcd572071d98896153492b9e7fecf18ea97352/lib/team.js#L189-L209)

终态与迁移拒绝。

<details>
<summary>查看原文（21行）</summary>

```text
/** 更新队员（状态迁移校验：终态不可复活；patch 仅允许 status/note/agentId/dispatchId/phase）。 */
export async function updateWorker({ cwd, runId, workerId, patch = {}, stateDir = '.omd' }) {
  return withRegistryLock(cwd, runId, stateDir, async () => {
    const reg = await readRegistry(cwd, runId, stateDir)
    const w = reg?.workers?.[workerId]
    if (!w) throw new Error(`team: worker 不存在: ${workerId}（run ${runId}）`)
    if (patch.status !== undefined) {
      if (!WORKER_STATUSES.includes(patch.status)) throw new Error(`team: 非法 status: ${patch.status}`)
      if (WORKER_TERMINAL.includes(w.status))
        throw new Error(`team: worker ${workerId} 已终态（${w.status}），不可复活——重新派发须 registerWorker 新 workerId`)
      if (w.status !== patch.status && !(STATUS_FLOW[w.status] ?? []).includes(patch.status))
        throw new Error(`team: 非法状态迁移 ${w.status} → ${patch.status}（合法: ${(STATUS_FLOW[w.status] ?? []).join('/') || '无'}）`)
      w.status = patch.status
      if (patch.status === 'running') {
        w.stale = false
        w.lastHeartbeatAt = new Date().toISOString() // 与 heartbeatWorker 语义对齐（评审修复：否则下轮立即重标 stale）
      }
    }
    for (const k of ['note', 'agentId', 'dispatchId', 'phase'])
      if (patch[k] !== undefined) w[k] = patch[k]
    await writeRegistry(cwd, runId, reg, stateDir)
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么限制最可能使贡献不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是持久账本能否覆盖读写失败并约束真正执行。readPhaseState的JSON解析失败会抛错，但readFile包在未检查错误码的catch中，读权限或I/O错误也可能返回null；transitionPhasePersist会将null作为initialPhaseState继续，静态链路因此不能支持所有异常都保留阶段的强主张。本轮未制造文件故障，不能称已复现丢失；此外队员登记发生在spawn之后，两个动作不是同一事务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/team.js:94-108](https://github.com/1225Sakura/oh-my-deepseekharness/blob/6afcd572071d98896153492b9e7fecf18ea97352/lib/team.js#L94-L108)

readFile错误返回null后允许initialPhaseState。

<details>
<summary>查看原文（15行）</summary>

```text
/** 读 phase.json：ENOENT=新 run（返回 null 懒建）；解析失败=损坏（抛错，绝不静默重置状态机）。 */
export async function readPhaseState(cwd, runId, stateDir = '.omd') {
  const file = join(teamRunDir(cwd, runId, stateDir), 'phase.json')
  let text
  try { text = await readFile(file, 'utf8') } catch { return null } // 不存在=新 run
  try { return JSON.parse(text) }
  catch (e) { throw new Error(`team: phase.json 损坏，拒绝静默重置（状态机保证会失效）: ${file}（${e?.message ?? e}）——人工检视后修复或删除该文件再操作`) }
}

/** 迁移并持久化（MCP 工具面用）：run 首次迁移时懒建 initial 态；损坏文件显式拒绝（评审修复#6）。 */
export async function transitionPhasePersist({ cwd, runId, to, note, stateDir = '.omd' }) {
  const file = join(teamRunDir(cwd, runId, stateDir), 'phase.json')
  const cur = (await readPhaseState(cwd, runId, stateDir)) ?? initialPhaseState()
  const next = transitionPhase(cur, to, { note })
  await atomicWriteJson(file, next)
```

</details>

#### 缺口

- readFile异常到重新初始化的路径未做故障注入验证。
  **影响**：不支持全面安全恢复主张。
  **进一步探讨**：区分ENOENT、EACCES、I/O错误并核查阶段文件是否被覆盖。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与恢复依赖哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

必需服务缺失会阻止启动，可选代码智能依赖缺席则降级；LSP服务器本体需用户安装配置。项目.omd承载阶段、邮箱、笔记和PRD，需要可写文件系统及备份策略。HUD loopback路由允许cwd读取摘要，README明确可关闭；非可信共享机器应关闭并核对访问范围。失败恢复由领队核对原代理和现有文件，不能只看stale就自动重派并合并。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:102-110](https://github.com/1225Sakura/oh-my-deepseekharness/blob/6afcd572071d98896153492b9e7fecf18ea97352/README.md#L102-L110)

HUD与可选依赖配置说明。

````text
| `codeIntel.lspServers` | `dict`，默认 `{}` | LSP 注册表：`{ <name>: { command, args?, languages?, env? } }`——语言服务器本体由用户环境提供 |

配置示例：

```yaml
# cordis.patch.yml
oh-my-dsh:
  language: zh
  tiers:
````

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全周期成本和实际效果支持到哪里？

**研究主题**：效果与总成本

#### 完整回答

首次需要安装、重载profile并运行doctor，还要配置角色模型与可选LSP。持续成本是多代理模型调用、评审回合和领队核对；失败恢复要对账spawn/registry及工作树。作者测试徽章和兼容声明属于作者报告，本轮未执行它们；没有合格任务对照不能把工具数量或自动模式等同于节时，尤其恢复责任仍在领队。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-29](https://github.com/1225Sakura/oh-my-deepseekharness/blob/6afcd572071d98896153492b9e7fecf18ea97352/README.md#L19-L29)

安装重载、doctor及宿主条件。

<details>
<summary>查看原文（11行）</summary>

````text
dsh plugin --profile <profile> add @sakura12/oh-my-deepseekharness

# 本地开发（指向本仓库路径；以你的检出路径替换）
dsh plugin --profile <profile> add /path/to/oh-my-deepseekharness
```

> `<profile>` 是 dsh 的隔离配置/插件组合单元（本机如 `web`）；`dsh plugin` 实为转发 pnpm 到该 profile 目录，add/remove 均用 npm 包名。**装完必须重启或重载 profile**（重开 `dsh web`）再开新会话，插件树才会重载生效——然后在会话里输入「setup omd」走安装向导，或直接 `/omd-doctor` 验装。

要求：Node.js ≥ 22.19；dsh 宿主兼容范围以 package.json 的 peerDependencies 为权威（0.1.2 / 0.1.5 / 0.1.7 三条 0.1.x 线与 0.2.0-rc 线；0.2.0-rc.2 实测全绿）。兼容性质证的逐条证据台账是仓内审计产物（`.omd/plans/`，gitignored），不随 npm 包发布。所有 `@deepseek-ai/*` 依赖均为宿主义务（peerDependencies，缺失自动降级，见下文「依赖边界」）。可选能力依赖（optionalDependencies，缺席显式降级不阻断）：`@ast-grep/napi`（ast_grep_* 工具）、`vscode-jsonrpc` / `vscode-languageserver-protocol` / `vscode-uri`（lsp_* 工具）。

验装：安装后在会话中输入 `/omd-doctor`（不确定可用入口时先 `/omd` 看速查）。
````

</details>

#### 缺口

- 没有同条件多代理任务的全周期费用与人工投入。
  **影响**：不能证明比原生子代理省成本。
  **进一步探讨**：保存原生委派与该编排的相同任务回执和合格产物。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可借鉴处和维护边界？

**研究主题**：工程质量与复用

#### 完整回答

可复用设计是runId隔离、终态不复活、registry文件锁与append-only邮箱，适合异步任务身份管理。移植须保留ID校验、原子写入和状态迁移，而非只搬协议文本。值得补强的是读文件错误分类与spawn登记之间的恢复协调；当前注释比可见catch的实际范围更强，维护者应以代码行为作为恢复边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/team.js:138-141](https://github.com/1225Sakura/oh-my-deepseekharness/blob/6afcd572071d98896153492b9e7fecf18ea97352/lib/team.js#L138-L141)

registry锁。

```text
 * 跨进程文件锁。跨进程兜底同 runstate.js 头注（expectUpdatedAt CAS 哲学）。
 */
function withRegistryLock(cwd, runId, stateDir, fn) {
  return withFileLock(registryPath(cwd, runId, stateDir), fn)
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么新假设值得验证，怎样推翻它？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是给每次spawn加持久意图和唯一dispatchId，再把未确认派发显式列为待协调，能减少代理已启动但登记缺失时的重复执行。最小实验在spawn前后、registry写前后分别中断，对比原流程与意图账本的重复派发数、可恢复任务数和人工核对时间。若宿主无法以dispatchId查询原代理，意图账本只增加文件而不能降低不确定性，应否定自动恢复收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/team.js:151-167](https://github.com/1225Sakura/oh-my-deepseekharness/blob/6afcd572071d98896153492b9e7fecf18ea97352/lib/team.js#L151-L167)

dispatchId与登记时序。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * 登记队员（实际 spawn 由领队经 omd_delegate/subagent 完成后调用本函数落账）。
 * workerId 省略时生成 `w-<uuid8>`；status 初始 dispatched。
 */
export async function registerWorker({ cwd, runId, stateDir = '.omd', worker }) {
  assertIsoTs(worker.spawnedAt, 'spawnedAt')
  return withRegistryLock(cwd, runId, stateDir, async () => {
    const now = new Date().toISOString()
    const cur = (await readRegistry(cwd, runId, stateDir)) ?? { runId, createdAt: now, workers: {} }
    const workerId = worker.workerId ?? `w-${randomUUID().replaceAll('-', '').slice(0, 8)}`
    assertWorkerId(workerId)
    if (cur.workers[workerId]) throw new Error(`team: workerId 已存在: ${workerId}`)
    if (!worker.role) throw new Error('team: registerWorker 缺 role（生命周期必须绑定角色）')
    const w = {
      workerId, runId,
      dispatchId: worker.dispatchId ?? null,
      agentId: worker.agentId ?? null,
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得采用，何时停止？

**研究主题**：采用判断

#### 完整回答

本次建议观察，尚不建议把团队编排交给该账本。独立工作树只能降低文件覆盖影响，无法解决派发已发生但登记缺失时的重复执行；读取失败后的null又可能误呈为新run。未核实存在无需依赖同一账本就能识别未知派发、接回原代理且保证不重做的完整路径。因此先审阅状态机制，只有补足这条恢复证据后再考虑任务试用。出现阶段重置或无登记派发时保留.omd及原代理，停止新派发并手工核对产物。

#### 证据与依据

**依据 1 · 源码核查**：[lib/team.js:189-200](https://github.com/1225Sakura/oh-my-deepseekharness/blob/6afcd572071d98896153492b9e7fecf18ea97352/lib/team.js#L189-L200)

终态不可复活约束。

<details>
<summary>查看原文（12行）</summary>

```text
/** 更新队员（状态迁移校验：终态不可复活；patch 仅允许 status/note/agentId/dispatchId/phase）。 */
export async function updateWorker({ cwd, runId, workerId, patch = {}, stateDir = '.omd' }) {
  return withRegistryLock(cwd, runId, stateDir, async () => {
    const reg = await readRegistry(cwd, runId, stateDir)
    const w = reg?.workers?.[workerId]
    if (!w) throw new Error(`team: worker 不存在: ${workerId}（run ${runId}）`)
    if (patch.status !== undefined) {
      if (!WORKER_STATUSES.includes(patch.status)) throw new Error(`team: 非法 status: ${patch.status}`)
      if (WORKER_TERMINAL.includes(w.status))
        throw new Error(`team: worker ${workerId} 已终态（${w.status}），不可复活——重新派发须 registerWorker 新 workerId`)
      if (w.status !== patch.status && !(STATUS_FLOW[w.status] ?? []).includes(patch.status))
        throw new Error(`team: 非法状态迁移 ${w.status} → ${patch.status}（合法: ${(STATUS_FLOW[w.status] ?? []).join('/') || '无'}）`)
```

</details>

#### 缺口

- 缺少独立于同一账本识别未知派发并接回原代理的可核查链路。
  **影响**：核心团队恢复可控性未成立，采用结论收窄为观察。
  **进一步探讨**：核查宿主dispatchId查询及attach接口，在派发前后中断时验证不重复执行。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
