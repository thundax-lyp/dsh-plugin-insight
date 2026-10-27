# dsh-redteam-model

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ce24bb2](https://github.com/SeaOf0/dsh-redteam-model/tree/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562)

<!-- BEGIN META -->
[![GitHub ★ 758](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=758&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SeaOf0/dsh-redteam-model)
<!-- END META -->

> **功能**：管理 DSH 安全研究预设与运行时插件，提供工作流、阶段检查和过程记录入口。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)支持的贡献是将安全研究资产及多插件管理收拢，并记录变更状态；[Q03](#research-q03)结构与manual分工可借鉴，不能算新模型或已验证安全结果。

> **主要限制**：[Q03](#research-q03)说明pass只由结构checks决定，manual语义未因此通过；[Q02](#research-q02)取消不终止运行中的变更，中断failed也非回滚。根管理和流程文本不能代替全套授权及安全结论验收。

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
  - [Q01 · 合集是在提供新引擎还是组织安全研究？](#detail-section-11)
  - [Q02 · 管理变更怎样接到队列，取消和重启意味着什么？](#detail-section-12)
  - [Q03 · 阶段PASS能否证明安全结论和授权成立？](#detail-section-13)
  - [Q04 · 为什么暂缓全套安装推荐？](#detail-section-14)
  - [Q05 · 把结构和语义结果分开显示能否减少误读？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有明确授权与专业工具环境的安全研究人员，可关注合集的管理及结构/语义分工设计。

手工预设/Skill管理和已有专业审计流程是参照；合集可减少组织分歧，不证明更强检测或更低总成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 管理入口 | 部署/更新已知模式与插件 | 改配置需备份，运行操作不可取消 |
| 操作历史 | 观察变更及中断 | best effort非事务回滚 |
| 阶段结构检查 | 核对文件/标记等结构 | manual语义仍由独立复核负责 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容DSH connection/profile | 是 | 管理RPC和预设 | 无法正确注册 |
| 外部专业工具/MCP | 按模式 | 实际研究 | 能力需降级核对 |
| 明确授权与专业复核 | 是 | 约束任务与结论 | 不执行实际安全任务 |
| 配置备份和回退 | 采用前必需 | 恢复变更 | 暂缓整套采用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 定界 | 专业人员确认授权与具体目标 | 不扩大为默认扫描 |
| 备份 | 保存隔离profile和预设 | 可核对变更 |
| 管理 | 一次核对一个已知操作 | running不假装已取消 |
| 复核 | 结构后独立语义判断 | 不用pass直接放行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 多插件/外部工具资源未知 | 授权、profile备份与部署核对 | 管理会修改配置 |
| 持续 | 模型、复核、trace磁盘费用未知 | 专业语义复核和工具维护 | 结构pass不免复核 |
| 恢复退出 | 未完变更可能仍有副作用 | 核对真实profile和备份 | running不可cancel，failed非回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 管理 | 已知target和串行变更记录 | 整套安装/回滚实际效果 |
| 检查 | 结构checks与manual分别输出 | 语义正确和执行不可绕过 |
| 研究效率 | workflow组织主张 | 发现率、总token与复核时间 |

> **思考**：[Q03](#research-q03)说明pass只由结构checks决定，manual语义未因此通过；[Q02](#research-q02)取消不终止运行中的变更，中断failed也非回滚。根管理和流程文本不能代替全套授权及安全结论验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)支持的贡献是将安全研究资产及多插件管理收拢，并记录变更状态；[Q03](#research-q03)结构与manual分工可借鉴，不能算新模型或已验证安全结果。

[Q02](#research-q02)writerId所有权、wx临时文件/rename和重启中断标记可复用，但best effort历史不是事务；[Q03](#research-q03)将manual与pass分开值得借鉴，移植必须避免UI把两者合成过度承诺。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)说明pass只由结构checks决定，manual语义未因此通过；[Q02](#research-q02)取消不终止运行中的变更，中断failed也非回滚。根管理和流程文本不能代替全套授权及安全结论验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 当前观察，先限定具体管理或结构检查目标，确认授权、隔离profile、备份和实际变更；不把完整安全套件默认引入重要环境。结构记录和语义复核冲突时以证据与人工判断为准，回到原审计流程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已抽核根管理链、队列取消/中断和stage-gate结构逻辑；未完整审计全套执行拦截及授权，建议观察；语义状态呈现是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/operations.ts、src/rpc.ts、plugins/dsh-stage-gate/lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根管理插件、RPC、OperationQueue及stage-gate的结构判定源码；未执行任何安全工具、目标测试或攻击活动，不认证全部子插件与授权防线。
- 下一步：使用授权的离线报告样例先验证管理及语义表达，核对精确宿主和hooks后才评估实际任务；本轮不执行。

**分析版本**

- **仓库**：[SeaOf0/dsh-redteam-model](https://github.com/SeaOf0/dsh-redteam-model)
- **版本号**：1.1.2（[固定提交 ce24bb2](https://github.com/SeaOf0/dsh-redteam-model/tree/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出复用已有pass/manual字段的分离呈现假设，先排除现UI已有，再用结构齐全但结论错误的离线报告比较误放行；不能改善就不推广。

使用授权的离线报告样例先验证管理及语义表达，核对精确宿主和hooks后才评估实际任务；本轮不执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1078 | 423094 | — | — | 2928289 |
| .mjs | source | 11 | 1629 | 1366 | 199 | — |
| .js | source | 72 | 30323 | 26913 | 2593 | — |
| .mjs | test | 26 | 8303 | 7213 | 519 | — |
| .tsx | source | 10 | 1863 | 1740 | 24 | — |
| .ts | source | 29 | 6006 | 4958 | 559 | — |
| .ts | test | 7 | 636 | 564 | 14 | — |
| .md | example | 7 | 42 | — | — | 185 |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/SeaOf0/dsh-redteam-model/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/SeaOf0/dsh-redteam-model/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/SeaOf0/dsh-redteam-model/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：安全研究模式合集如何区分管理操作、结构检查与语义复核，能否支持真实可靠的工作流？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 合集是在提供新引擎还是组织安全研究？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有合法授权范围、工具环境和专业判断的安全研究人员，目标是把分散角色、方法、证据留存和插件部署组织成工作流。作者自己将workflow与知识投递区分，根包是安全预设/运行时插件的管理入口，不应把每个提示角色都称作新模型。相对手工复制Skill与逐个安装，管理页和统一模式资产可减少配置分歧；不等于漏洞发现率、审计质量或token成本已有优势。README列十模式而package描述仍说九预设/十七插件，文字计数不是运行事实，本轮不据此确认全部实际注册数量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-15](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/README.md#L3-L15)

作者定位workflow、授权研究与宿主依赖。

<details>
<summary>查看原文（13行）</summary>

```text
> 空了，闲聊。一个老安全人员的关注点：AI环境下，知识点很多知识面也很广，如果一味的给AI投递knowledge，你问它它能答得出来，但是你让它去完成一个任务而没有去给它规定这个任务如何去完成如何高效的去完成如何才能命中你需要的点，尽管它掌握着大量的知识但没有这个"workflow"去引导去把控，那么也许能得到你想要的结果，但是往往非常的浪费token，甚至有时候没有对某些方面的栅栏，它可能陷入死胡同，这就是为什么我们要去不断的设计完善workflow，把自身的经验写成skill或者agent，这样它才能按照workflow去完成任务+从旁的辅助，从而能高效的完成工作。
>
> dsh在安全工作这方面的设计实际上是有限的，只能从playbook中去设计，本身插件的载体还是dp-harness本身，为什么开发这个，也许仅仅因为跟风吧，还是希望DeepSeek能便宜些...（另一方面harness的优势特别明显，就个人而言，在做"反拒绝"上，harness相比claude原生的hook亦或是codex原生的hook又或者其他三方智能体导致封号风险，harness那真的是太easy了。）
>
> 总之一句话，这个项目可能没有大家想的那么好，也没有他们其他人做的那种源码写的引擎看起来炫酷，但立志于一点也只有一点
>
> ————不断完善workflow，用workflow的方式来尽可能补足缺陷；高效+真实是核心。

基于 [dsh](https://www.npmjs.com/package/@deepseek-ai/dsh) web 实现的十个 redteam 安全研究工作模式（预设）及其运行时插件，自包含、可离线部署。目标是服务于 redteam 进行授权安全研究，覆盖渗透测试、红队评估、代码审计、二进制分析、免杀对抗、应急溯源、云安全攻防、CTF 解题与资产测绘领域。

**该项目是为 [https://github.com/deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 赋能的项目，先装好 deepseek-harness 以后，再装该项目；**

> **请勿用于非法行为。** 本项目仅面向已获得书面授权的安全测试、CTF 竞赛、漏洞赏金与安全研究场景（见文末免责声明）。
```

</details>

**依据 2 · 作者声明**：[README.md:38-64](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/README.md#L38-L64)

模式资产与多类插件的职责声明。

<details>
<summary>查看原文（27行）</summary>

```text
每个模式自包含四层资产：——根据dsh模式的设计论

1、**persona**（角色/认识论/边界/报告纪律）

2、**playbook**（方法论与门禁文本契约）

3、**skills**（可加载技能）

4、**refs/**（外部知识库，原文索引化）。

## 运行时插件

| 插件 | 作用 |
|---|---|
| `dsh-stage-gate` | `stage_gate`/`gates_list` 工具：八模式 32 道阶段门的结构校验，判定写入 `gate-log.md`；`operation_goal`/`operation_progress` 目标契约与进度收口（`operation-state.json` 驱动中断恢复） |
| `dsh-route-boost` | 逐轮治理信封 + 十模式全局作战语境条件注入（global-agents）：阶段推断+ 门禁清单 + 模式边界 + 证据等级预判 + refs 指针 + 技能依赖工具面就绪行+ operation 恢复行，任务口径判定、结构化标记块注入、整行粒度预算、变化才投递并落注入量记账 |
| `dsh-sec-enforce` | 确定性工具拦截：报告门、写边界、高危命令先问后做、裸奔扫描限速 |
| `dsh-refusal-guard` | —————反拒绝—————AGENTS.security.md兜底 |
| `dsh-trace-vault` | 过程留痕库：十安全模式会话全量落库工具调用；`trace_search`/`trace_get`/`trace_recent`/`trace_stats` 检索与会话画像； |
| `dsh-auto-advance` | 自动推进器：subagent 执行体返回且意图台账有未收口方向时注入推进提醒；开工三登记一次性提醒；轮数封顶/真人接管重置/冷却窗三护栏，无台账会话零干扰 |
| `dsh-product-subagents` | `subagent_claude_code`/`subagent_codex` provider：无头 spawn 本机 claude/codex CLI，跨 harness 复核按建议项由用户触发 |
| `dsh-mcp-studio` | MCP 加载工作台：通用类 MCP（burpsuite/yakit/chrome-dev-mcp 等）的接入、状态与诊断 |
| `dsh-redteam-results` | redteam 成果：任务台账作战大屏 + 五板式成果页，九模式**跨会话**聚合与时间范围筛选，SQLite 行级持久 |
| `dsh-hunter` | hunter 狩猎：FOFA / Hunter / Quake 三平台资产搜索，代码审计成果页「实测」按钮一键验证（指纹搜索→存活探测→EXP 验证，仅授权资产执行） |
| `dsh-campaign-memory` | 战役记忆：跨会话打法沉淀，同模式同工作区同题写入即刷新不重复，读全文记账、热度×30 天时间衰减排序，按工作区隔离召回，检测指纹 30 天自动清理、目标指纹 180 天到期退场仍可检索； |
| `dsh-mode-group` | 新建会话屏模式选择器两级化：内置模式与研究员模式留顶层，九个专业安全模式折叠进「专业安全模式」悬停/点击子菜单 |
| `dsh-session-pulse` | 会话状态面板（十模式）：头部右上角任务进度 chip（任务清单实时汇总 done/total + 进度条，全部完成转绿）+ 子代理 chip；右侧「子智能体目录」抽屉（正在运行/已结束分组，点名进入子代理会话查看运行内容，打开期间目录实时更新）；对话页左侧「提示词」栏（用户输入按序成列，悬停预览、点击平滑定位到消息并高亮，仅对话标签页可见） |
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1-6](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/src/index.ts#L1-L6)

根插件定位管理而非开机自动安装全部。

```text
/**
 * dsh-redteam-model management host plugin.
 *
 * The plugin itself never installs modes or sub-plugins at startup; all
 * mutations are triggered by the settings page through the loopback RPC.
 */
```

#### 缺口

- 专业任务合格率、节省和独立反馈未知
  **影响**：不能把工作流数量当有效性
  **进一步探讨**：在授权的离线样例审计比较同工具/模型的手工流程与合集，记录正确发现、证据完整及复核时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 管理变更怎样接到队列，取消和重启意味着什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根apply注册设置、兼容服务、OperationQueue及管理RPC，启动还会修复已安装插件的plane依赖和bundle账目，所以“启动不安装”不等于完全只读。RPC限定操作类型和已知模式/插件target，现代fetch注册与旧loopback RPC并存；不能把旧API的authority属性无条件套到现代fetch安全。队列enqueue持久化后串行tail执行，cancel只找到queued，不能终止运行中的pnpm/子进程。重启加载把queued/running记录改failed，而非自动续做。持久化用writerId检测所有权、临时wx文件+rename，但写失败是best effort，不改变操作结果；这是一份可恢复观察历史，不是强事务成功保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:83-112](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/src/index.ts#L83-L112)

开机修复已有配置、队列和RPC真实注册。

<details>
<summary>查看原文（30行）</summary>

```text
  // The plugin still never deploys modes or sub-plugins at startup, but the
  // profile rows of ALREADY installed plugins are its own bookkeeping: first
  // restore preset-plane dependencies a pre-fix profile detector stranded in
  // the wrong profile (their absence leaves preset rows that never start),
  // then heal a bundle manifest that an older release (or a bundle reconcile
  // reading a stale `dsh.bundle` declaration) left naming a preset-plane
  // plugin, which would otherwise report "broken — repair" on this boot and
  // every boot after it. Never fatal: an unreadable profile must not keep the
  // host from booting.
  try {
    healPresetPlanePlugins()
  } catch {
    /* getStatus reports the profile state to the settings page instead. */
  }
  try {
    reconcileProfileBundles()
  } catch {
    /* getStatus reports the profile state to the settings page instead. */
  }

  const queue = new OperationQueue(path.join(profileWebDir(), '.dsh-redteam-model-operations.json'))

  ctx.inject(['connection'], (web: Record<string, unknown>) => {
    const { connection } = web as { connection: HostConnectionHandle }
    registerModelRpc(connection, queue)
  })

  ctx.effect(() => () => {
    queue.dispose()
  }, 'dsh-redteam-model: queue')
```

</details>

**依据 2 · 源码核查**：[src/rpc.ts:70-105](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/src/rpc.ts#L70-L105)

管理target白名单。

<details>
<summary>查看原文（36行）</summary>

```text
function validateTargets(kind: OperationKind, target: string, targets: readonly unknown[] | undefined): string[] {
  if (kind === 'deploy-modes' || kind === 'remove-modes') {
    const allowed = new Set([...knownModeNames(), MODES_BATCH_TARGET])
    if (!allowed.has(target)) throw new Error(`unknown ${kind} target: ${target}`)
    if (targets !== undefined && targets.length > 0) throw new Error(`${kind} does not accept targets`)
    return [target]
  }
  if (kind === 'repair') {
    if (targets !== undefined && targets.length > 0) throw new Error('repair does not accept targets')
    const modes = new Set(knownModeNames())
    const plugins = new Set(knownPluginNames())
    if (modes.has(target) || plugins.has(target)) return [target]
    throw new Error(`unknown repair target: ${target}`)
  }

  // install / update / uninstall
  const plugins = new Set(knownPluginNames())
  const names: string[] = []
  if (targets !== undefined) {
    if (!Array.isArray(targets)) throw new Error('targets must be an array')
    if (targets.length === 0 || targets.length > MAX_TARGETS) {
      throw new Error(`targets must contain 1..${MAX_TARGETS} entries`)
    }
    if (target !== BATCH_TARGETS[kind] && !plugins.has(target)) {
      throw new Error(`unknown plugin: ${target}`)
    }
    for (const raw of targets) {
      if (typeof raw !== 'string' || raw === '') throw new Error('targets entries must be non-empty strings')
      if (!plugins.has(raw)) throw new Error(`unknown plugin in targets: ${raw}`)
      if (!names.includes(raw)) names.push(raw)
    }
  } else {
    if (!plugins.has(target)) throw new Error(`unknown plugin: ${target}`)
    names.push(target)
  }
  return names
```

</details>

**依据 3 · 源码核查**：[src/rpc.ts:233-255](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/src/rpc.ts#L233-L255)

现代Fetch与旧loopback通道分开。

<details>
<summary>查看原文（23行）</summary>

```text
export function registerModelRpc(connection: HostConnectionHandle, queue: OperationQueue): void {
  // Modern Hosts (0.1.2+): exact Fetch routes under /api keep the channel alive.
  if (typeof connection.fetch?.register === 'function') {
    for (const endpoint of ENDPOINTS) {
      connection.fetch.register({
        path: `${API_CHANNEL}/${endpoint}`,
        methods: ['POST'],
        requestBody: 'buffered',
        fetch: fetchHandlerFor(endpoint, queue),
      })
    }
  }
  // Legacy Hosts (0.1.1 and older): bare rpc channel. On modern Hosts this
  // registration silently fails, which is harmless — the Fetch routes above
  // are the transport there.
  // Legacy Hosts (0.1.1 and older): bare rpc channel. On modern Hosts this
  // registration throws ("cannot get property webServer without inject") and
  // must not escape — the throw also aborts sibling registrations in the
  // same inject callback, so guard it.
  try {
    connection.rpc.handle(RPC_CHANNEL, async (endpoint, rawPayload): Promise<RpcResult> => {
      return invokeEndpoint(endpoint, rawPayload, queue)
    }, { authority: 'loopback' })
```

</details>

**依据 4 · 源码核查**：[src/operations.ts:79-104](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/src/operations.ts#L79-L104)

串行enqueue与仅取消queued。

<details>
<summary>查看原文（26行）</summary>

```text
  enqueue(kind: OperationKind, target: string, runner: OperationRunner): string {
    if (this.closed) throw new Error('operation queue is closed')
    this.ensureCapacity(1)
    if (!Number.isSafeInteger(this.nextId)) throw new Error('operation id space exhausted')
    const id = `op-${String(this.nextId).padStart(4, '0')}`
    this.nextId += 1
    const record: OperationRecord = {
      id,
      kind,
      target,
      state: 'queued',
      percent: 0,
      detail: 'queued',
    }
    this.records.push(record)
    this.persist()
    this.tail = this.tail.then(() => this.run(record, runner)).catch(() => {})
    return id
  }

  cancel(id: string): boolean {
    const record = this.records.find(candidate => candidate.id === id && candidate.state === 'queued')
    if (record === undefined) return false
    this.update(record, { state: 'cancelled', percent: 100, detail: 'cancelled' })
    this.persist()
    return true
```

</details>

**依据 5 · 源码核查**：[src/operations.ts:205-228](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/src/operations.ts#L205-L228)

中断记录恢复为失败。

<details>
<summary>查看原文（24行）</summary>

```text
    if (this.persistenceFile === undefined) return
    try {
      if (!lstatSync(this.persistenceFile).isFile()) return
      const parsed: unknown = JSON.parse(readFileSync(this.persistenceFile, 'utf8'))
      if (!isRecord(parsed) || parsed.schemaVersion !== 1 || !Array.isArray(parsed.records)) return

      const seen = new Set<string>()
      const loaded: OperationRecord[] = []
      let maxId = 0
      for (const candidate of parsed.records) {
        const record = parseOperationRecord(candidate)
        if (record === undefined || seen.has(record.id)) return
        seen.add(record.id)
        maxId = Math.max(maxId, Number.parseInt(record.id.slice(3), 10))
        if (record.state === 'queued' || record.state === 'running') {
          loaded.push({
            ...record,
            state: 'failed',
            percent: 100,
            detail: INTERRUPTED_DETAIL,
            error: INTERRUPTED_DETAIL,
          })
        } else {
          loaded.push(record)
```

</details>

**依据 6 · 源码核查**：[src/operations.ts:242-277](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/src/operations.ts#L242-L277)

writer所有权、原子替换及best effort。

<details>
<summary>查看原文（36行）</summary>

```text
  private persist(): void {
    if (this.persistenceFile === undefined || this.persistenceOwnership === 'lost') return
    let temporaryFile: string | undefined
    try {
      try {
        if (!lstatSync(this.persistenceFile).isFile()) return
        if (this.persistenceOwnership === 'owned') {
          const current: unknown = JSON.parse(readFileSync(this.persistenceFile, 'utf8'))
          if (!isRecord(current) || current.writerId !== this.writerId) {
            this.persistenceOwnership = 'lost'
            return
          }
        }
      } catch (error) {
        if (!isRecord(error) || error.code !== 'ENOENT') return
      }

      const directory = path.dirname(this.persistenceFile)
      mkdirSync(directory, { recursive: true })
      this.writeSequence += 1
      temporaryFile = path.join(
        directory,
        `.${path.basename(this.persistenceFile)}.${process.pid}.${this.writeSequence}.tmp`,
      )
      const payload: PersistedOperations = {
        schemaVersion: 1,
        writerId: this.writerId,
        nextId: this.nextId,
        records: this.records,
      }
      writeFileSync(temporaryFile, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
      renameSync(temporaryFile, this.persistenceFile)
      temporaryFile = undefined
      this.persistenceOwnership = 'owned'
    } catch {
      // History persistence is best effort and cannot change operation results.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 阶段PASS能否证明安全结论和授权成立？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能。runGate把声明的checks逐项执行，pass仅由results.every(ok)决定，manual原样独立返回；代码注释也明确语义判断在复核员手中。因此存在gate-log、固定标记或哈希不证明漏洞因果、测试授权或最终报告可以发布。README提及独立复核和跨harness双签属于流程主张，本轮未完整追踪所有enforce hook和复核签署，不能宣称不可绕过。管理面还会修改profile和预设，现代fetch的精确宿主授权依赖需要另核。对核心“高效+真实”应以具体报告和独立复核结论检验，不以结构pass、插件数或反拒绝提示作依据。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-stage-gate/lib/index.js:1-10](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/plugins/dsh-stage-gate/lib/index.js#L1-L10)

明确结构与语义责任边界。

<details>
<summary>查看原文（10行）</summary>

```text
// dsh-stage-gate — the runtime half of the security presets' stage-gate discipline.
//
// The playbooks define gates as text contracts (ad-playbook 子代理编排, pentest/audit/re/av
// 编排章); this plugin turns the STRUCTURAL subset of those contracts into a tool the model
// must call and cannot self-grade: files present, non-empty, required markers present, table
// rows complete, artifact provenance hashed. Semantic gates (call-chain agreement, reviewer
// confirm-or-challenge, boundary judgment) stay in the reviewers' hands and are surfaced as
// `manual` entries so the model cannot mistake a structural pass for a full pass.
//
// Verdicts append to <workspace>/gate-log.md — the audit trail the report chapter consumes.
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-stage-gate/lib/index.js:427-457](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/plugins/dsh-stage-gate/lib/index.js#L427-L457)

pass只取结构checks，manual另列。

<details>
<summary>查看原文（31行）</summary>

```text
export function runGate(fsm, { mode, stage, workspace, file }) {
	const gate = GATES[mode]?.[stage];
	if (!gate) throw new Error(`unknown gate ${mode}/${stage}; valid stages: ${Object.keys(GATES[mode] ?? {}).join(", ") || "(unknown mode)"}`);
	const resolve = {
		workspace: (f) => path.resolve(workspace, f),
		file: file ? (path.isAbsolute(file) ? path.resolve(file) : path.resolve(workspace, file)) : undefined
	};
	if (gate.requiresFile && !file) throw new Error(`gate ${mode}/${stage} 需要 file 参数（${gate.fileHint}）`);
	const results = gate.checks.map((check) => ({ id: `${check.kind}:${check.file ?? check.dir}`, ...runCheck(fsm, check, resolve) }));
	// 报告门追加覆盖度算术对账：scope 已登记才激活（未登记=零影响）。
	// 目标文件：传参 file 优先，否则门 schema 的第一个固定文件。
	if (REPORT_GATES[mode] === stage) {
		let reportFile = resolve.file;
		if (!reportFile) {
			const fixed = gate.checks.find((c) => c.file && c.file !== "$file");
			if (fixed) reportFile = path.resolve(workspace, fixed.file);
		}
		if (reportFile) {
			const cov = coverageCheck(fsm, workspace, reportFile);
			if (cov) results.push({ id: "coverage:report", kind: "coverage", file: path.basename(reportFile), ...cov });
		}
	}
	return {
		mode,
		stage,
		title: gate.title,
		pass: results.every((r) => r.ok),
		checks: results,
		manual: gate.manual,
		missing: results.filter((r) => !r.ok).map((r) => `${r.id} — ${r.detail}`)
	};
```

</details>

**依据 3 · 作者声明**：[README.md:115-119](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/README.md#L115-L119)

外部工具及双层防线/双签的作者主张。

```text
机器差异项（可选，缺失自动降级）：`claude`/`codex` CLI（跨 harness 双签通道）、nmap/nuclei/httpx/ffuf/jadx/frida/mingw 等工具链（playbook 工具平面检测制 + 三级兜底：检测到的工具 → MCP → 批准后安装）。

## 基础原理与架构

设计原则：**文本纪律（persona/playbook）+ 运行时强制（插件）双层防线**——模型不能自评门禁（结构校验必须是工具调用）、语义门禁归独立复核员、关键发现双签（DSH 复核 + claude/codex 复核一致才进报告）、一切判定落审计 trail（gate-log/enforce-log/evidence-index）。
```

**依据 4 · 源码核查**：[src/rpc.ts:233-255](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/src/rpc.ts#L233-L255)

现代与旧通道授权接线不能混同。

<details>
<summary>查看原文（23行）</summary>

```text
export function registerModelRpc(connection: HostConnectionHandle, queue: OperationQueue): void {
  // Modern Hosts (0.1.2+): exact Fetch routes under /api keep the channel alive.
  if (typeof connection.fetch?.register === 'function') {
    for (const endpoint of ENDPOINTS) {
      connection.fetch.register({
        path: `${API_CHANNEL}/${endpoint}`,
        methods: ['POST'],
        requestBody: 'buffered',
        fetch: fetchHandlerFor(endpoint, queue),
      })
    }
  }
  // Legacy Hosts (0.1.1 and older): bare rpc channel. On modern Hosts this
  // registration silently fails, which is harmless — the Fetch routes above
  // are the transport there.
  // Legacy Hosts (0.1.1 and older): bare rpc channel. On modern Hosts this
  // registration throws ("cannot get property webServer without inject") and
  // must not escape — the throw also aborts sibling registrations in the
  // same inject callback, so guard it.
  try {
    connection.rpc.handle(RPC_CHANNEL, async (endpoint, rawPayload): Promise<RpcResult> => {
      return invokeEndpoint(endpoint, rawPayload, queue)
    }, { authority: 'loopback' })
```

</details>

#### 缺口

- 全套enforce覆盖、复核签署有效性和现代管理RPC宿主授权未知
  **影响**：不能保证未授权副作用被阻断或结构pass等于真实安全结论
  **进一步探讨**：继续固定宿主与相关hook，审阅具体报告的manual判定和证据链，逐类核对绕过路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 为什么暂缓全套安装推荐？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前建议观察其结构/语义分工和管理设计，暂不向一般DSH用户推荐完整安全套件。首次会写profile、预设与全局专属安全规范，持续依赖大量工具、MCP/CLI和宿主预览兼容；多模型复核、trace与资产留存还会增加调用、磁盘和敏感材料管理负担。取消运行中操作并不停止子进程，中断后failed也不说明没有修改，恢复要读实际profile并用备份核对。费用与节时没有实测。只有在隔离profile、明确书面授权、备份恢复和具体hook边界核清后才适合专业人员定向评估；不明目标、管理状态与实际配置不一致或证据复核缺失时，回到手工审计和原profile。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:99-115](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/README.md#L99-L115)

部署、专属AGENTS文件和外部工具依赖。

<details>
<summary>查看原文（17行）</summary>

````text
node deploy.mjs --check    # 离线校验：十预设挂载 + 插件真实 loader 路径 + bundle 声明
node deploy.mjs --start    # 后台启动 dsh web → http://127.0.0.1:3080
```

也支持 `npx ./deploy`。Windows（Win10+ 自带 bsdtar）：流程一致，预设链接用 junction 免管理员。

两种安装方式都会把随包的安全预设支撑规范落地为 `~/.dsh/AGENTS.security.md`（本合集专属命名空间），由 `dsh-route-boost` 的 global-agents 上下文**仅注入十个安全模式会话**——其他模式/标准会话零注入、零额外开销；文件随版本更新直达覆盖。早期版本曾把该规范装入 dsh 用户全局文件 `~/.dsh/AGENTS.md`（宿主机制对所有会话无差别生效，会造成跨模式语境污染），升级安装会自动把它收尾为可恢复的备份文件（`.bak-` 前缀）；非本包内容的全局文件绝不触碰。

部署后 2 分钟人工验证：

1. 打开 [http://127.0.0.1:3080](http://127.0.0.1:3080)，roster 列出十个模式（redteam 安全研究员 + 九个专业模式）；
2. 任一会话让模型调 `gates_list`，返回专业模式门禁 schema；
3. pentest/attack-defense/cloud-security/ctf-solver/asset-mapping 会话可见 `nuclei_scan` 等扫描工具（其余模式不可见 = preset 平面正确）；
4. 发起任务后出现 `[route-boost] mode=... phase=...` 运行时信封快照；
5. 未过报告门就写 `reports/` 会被 sec-enforce 拦截并指路。

机器差异项（可选，缺失自动降级）：`claude`/`codex` CLI（跨 harness 双签通道）、nmap/nuclei/httpx/ffuf/jadx/frida/mingw 等工具链（playbook 工具平面检测制 + 三级兜底：检测到的工具 → MCP → 批准后安装）。
````

</details>

**依据 2 · 源码核查**：[src/operations.ts:99-104](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/src/operations.ts#L99-L104)

运行中操作不可由cancel终止。

```text
  cancel(id: string): boolean {
    const record = this.records.find(candidate => candidate.id === id && candidate.state === 'queued')
    if (record === undefined) return false
    this.update(record, { state: 'cancelled', percent: 100, detail: 'cancelled' })
    this.persist()
    return true
```

**依据 3 · 源码核查**：[src/operations.ts:219-225](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/src/operations.ts#L219-L225)

中断的failed是历史标记，非回滚。

```text
        if (record.state === 'queued' || record.state === 'running') {
          loaded.push({
            ...record,
            state: 'failed',
            percent: 100,
            detail: INTERRUPTED_DETAIL,
            error: INTERRUPTED_DETAIL,
```

#### 缺口

- 全套安装回退与敏感留痕生命周期未完整核查
  **影响**：当前不足以认定负担可控的整套试用
  **进一步探讨**：先只选具体管理/结构检查目标，在隔离profile核对变更及备份，不直接引入生产安全流程

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 把结构和语义结果分开显示能否减少误读？

**研究主题**：新假设与验证

#### 完整回答

已有runGate同时返回pass与manual，未来设计不应假称当前没有人工项。可提出未验证的呈现约束：UI和报告分别标“结构已核对”与“语义未复核/已复核”，在人工项未有具名判定及证据时不展示总体完成色。先核查当前results和enforce是否已有等价表达。用同一组含结构齐全但结论错误的离线报告，盲评原输出和分离输出对审阅者放行错误、复核时间的影响；若仍误放行或只是多字无用，就否定。该方案不证明攻击/漏洞能力，也不应增加高危自动执行。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-stage-gate/lib/index.js:449-456](https://github.com/SeaOf0/dsh-redteam-model/blob/ce24bb25e35df8c8514e00e0d98f1a36d2e2a562/plugins/dsh-stage-gate/lib/index.js#L449-L456)

已有pass和manual分离字段，是展示语义而非新校验器假设。

```text
	return {
		mode,
		stage,
		title: gate.title,
		pass: results.every((r) => r.ok),
		checks: results,
		manual: gate.manual,
		missing: results.filter((r) => !r.ok).map((r) => `${r.id} — ${r.detail}`)
```

#### 缺口

- 现有UI如何呈现manual及读者误判未知
  **影响**：可能已有等价呈现且无新价值
  **进一步探讨**：先检查现结果页，再用离线错误报告验证理解差异

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
