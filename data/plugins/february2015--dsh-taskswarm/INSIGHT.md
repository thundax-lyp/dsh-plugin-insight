# TaskSwarm：把多 Agent 变成任务生产线之后，谁来证明交付成立？

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

> 按依赖分波，在 Git worktree 中执行任务包，并提供评审、集成、状态观察与恢复。

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm)
<!-- END META -->

**本文目录**

- [洞察短评](#detail-section-1)
- [研究范围](#detail-section-2)
- [结论状态](#detail-section-3)
- [一、它试图解决什么问题](#detail-section-4)
- [二、核心贡献：方法迁移怎样变成宿主内能力](#detail-section-5)
- [三、关键质疑：调度完成是否意味着交付成立](#detail-section-6)
- [四、重点创新推演：从编排任务走向可验证交付](#detail-section-7)
- [五、依赖、流程与成本：贡献的兑现条件](#detail-section-8)
- [六、工程材料能证明到哪里](#detail-section-9)
- [活跃度](#detail-section-10)

核心贡献在于将 TaskPlane 的任务包与隔离编排移植到 DSH；值得继续研究的是，让验收证据成为调度、集成与恢复的共同依据。

<a id="detail-section-1"></a>

## 洞察短评

- **用途**：面向能拆分依赖、能定义验收的仓库开发任务，把多个执行者的工作组织为任务包、并行 lane 和串行集成流程。
- **亮点**：源码支持 DSH 原生 Agent 的创建、工具接线、任务进度持久化、隔离工作区与恢复编排。贡献主要是宿主适配和流程整合，waves、worktree、Reviewer 等方法明确来自 TaskPlane；尚无独立效果对照。
- **思考**：最关键的缺口是“完成”的证据约束：worker 自报完成、Reviewer 文本和 Git 合并能推进流程，但并未共同构成绑定最终代码版本的验收证明。因此协调能力成立，可靠交付增益仍待验证。
- **建议**：优先检验“与版本绑定的验收凭据能否同时约束集成、依赖放行和恢复”。先与简单 required checks／人工验收对照；若复杂协议没有额外收益，就采用简单方案。

<a id="detail-section-2"></a>

## 研究范围

- **仓库**：[february2015/dsh-taskswarm](https://github.com/february2015/dsh-taskswarm)
- **版本号**：`0.2.38`（[固定提交 032e2c9](https://github.com/february2015/dsh-taskswarm/tree/032e2c9d228c20cab65fe0ea061d78a7c753ab8c)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是 npm 发布日期）

<a id="detail-section-3"></a>

## 结论状态

- **已有贡献**：DSH 内的编排适配与流程整合有源码支持；独创算法和业务增效尚未证实。
- **重点创新推演**：[**H1 验收凭据、H2 产物条件依赖**](#innovation)是有依据但未验证的设计假设；**H3 可转交验收任务包**是证据更弱的业务探索。三者均不属于 TaskSwarm 已实现贡献。

<a id="detail-section-4"></a>

## 一、它试图解决什么问题

适用场景是有多项可拆分开发任务的项目：例如多个相对独立的功能模块、测试补齐或边界明确的修复。开发者仍需明确任务、依赖与验收标准；系统接手分波执行、工作区分配、进度观察和集成。合格交付是集成后的代码符合需求并通过共同验收，不能用启动的 Agent 数、勾选数、merged lane 数代替。

采用前可以用一个 Agent 串行执行，也可以人工开多个会话和 worktree，再逐一合并。后者已有隔离，却把任务分发、状态同步、重复劳动与故障处置交给操作员。TaskSwarm 尝试把这些协调动作变成可重复流程。它可能减少等待与盯场，但是否减少总人工、返工和合格交付成本，目前没有测量。

三类参照必须分开：

| 参照 | 可以支持的比较 | 当前边界 |
|---|---|---|
| 单 Agent 串行、人工管理 worktree | 检验编排是否值得付出协调成本 | 本次未运行共同任务，不能做效果排名 |
| TaskPlane 上游 | 判断技术归属和适配增量 | 作者明确声明 native port，多个模块标注 adapted/replaces；本次额外固定上游当前版本作结构参照，未完成历史逐行溯源 |
| DSH 原生委派 | 判断宿主内流程整合的价值 | README 的原生能力对比是作者口径；本次未固定并独立核查 DSH 版本，不能断言原生能力完全没有评审或恢复 |

[TaskPlane 固定版本 README](https://github.com/HenryLach/taskplane/blob/dfa342bebb71d8be4fe327b38bd2a291504aca65/README.md)已呈现任务包、waves/lanes、Reviewer、Merger 等同类机制；这里的当前参照不用于单独证明这些机制在 TaskSwarm 发布前的完整实现历史，归属判断还依赖 TaskSwarm 自身的声明和模块注释。

<a id="detail-section-5"></a>

## 二、核心贡献：方法迁移怎样变成宿主内能力

### C1：把跨进程编排方法接入 DSH 原生 Agent 生命周期

作者将其称为 TaskPlane 的 native port。实际核查中，[InProcessWorkerHost](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/in-process-host.ts#L36)通过 DSH agents 服务创建独立 session，设置 worktree cwd，挂载标准工具和 lane 工具，并在结束后回收会话；Reviewer 与 Merger 同样使用 DSH Agent。engine 通过 WorkerHost 接口调用执行者，避免将 Cordis 接线直接铺入调度逻辑。

**我们识别的贡献**是运行时适配：让 DSH 用户能够在同一宿主内使用已有编排范式，并将会话归属、工具供给和批次事件接起来。这是可复用的工程集成，不足以认定新的多 Agent 算法。其价值依赖 DSH API 稳定性；注册失败、工具挂载和权限授权中的容错并不证明所有宿主版本可用。

### C2：用任务包、工作分支与批次状态，把一次会话变成可恢复的工作单元

[worker mission 与 task_runner](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/worker/lane-tools.ts#L38)把 PROMPT.md 作为任务说明、STATUS.md 作为进度，要求逐项 advance 并建立 checkpoint。[worktree 实现](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/worktree.ts#L60)使新 lane 从集成分支开始，已有 lane 分支可以重新挂载；[恢复路径](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L678)会读取磁盘批次、复用 wavePlan 并跳过已 merged 的 lane。

**我们识别的贡献**是将说明、执行现场和编排状态外置，减少对聊天上下文的依赖。任务包和 checkpoint 也来自上游范式；本插件的增量是 DSH 接线及具体恢复、暂停和会话归属处理。代码支持“有恢复机制”，不支持“任意中断都无损恢复”。

### C3：把操作者的工作从逐个驱动执行者，移向任务设计与异常处置

[supervisor](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/supervisor.ts#L550)挂载提示段和控制工具；engine 发出 lane、wave、batch 事件，用户可以暂停、恢复、停止单 lane 或切换模型。人工暂停来源被记录，自动 supervisor 不能随意恢复 operator 暂停的批次。

这支持一个**业务流程贡献候选**：开发者可以集中处理任务契约与例外，而非频繁搬运上下文和盯每个会话。但前置拆任务、维护验收与兜底的负担可能增加。因此“责任分工发生变化”有实现依据，“总管理负担减少”仍是待验证判断，更没有付费意愿证据。

<a id="detail-section-6"></a>

## 三、关键质疑：调度完成是否意味着交付成立

### Q1：评审与合并之间，缺少绑定产物的验收约束

最强支持是：插件确实有独立 Reviewer、REVISE 分支、失败暂停、串行合并以及可配置验证命令。不能因此说它“完全没有质量控制”。关键问题在于这些控制的实际放行条件：

1. [Reviewer](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/worker/reviewer.ts#L111)把包含 REVISE 的回答判为 REVISE，其余判为 PASS；空文本或不符合格式的输出也落入后者。这是确定的解析行为，不是本次实测误放行率。
2. [runLane](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L489)中，exitCode 为 0 且任务状态为 done 或 blocked 时，不进入 workerFailed/notFinished 分支；只有 REVISE 明确阻断后续合并，none 没有被要求补评审。因此 blocked 也可能进入合并分支，不能把 blocked 理解为必然停止。
3. [readLatestVerdict](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L645)按排序后的最后一个 Markdown 文件查 PASS/REVISE，没有将结论绑定任务修订、代码 SHA 或验收环境；看到 PASS 不代表最终合并版本经过同一评审。
4. 普通 Git merge 成功后直接返回；mergeVerifyCommands 只传入冲突处理的 Merger 请求，并由 [Merger 提示词](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/worker/merger.ts#L106)要求执行。引擎随后依据模型返回的 SUCCESS/CONFLICT_RESOLVED 推进状态，没有统一验证所有合并后的代码与命令退出结果。

由此可以收窄核心承诺：TaskSwarm 有协调和辅助评审能力，但当前路径不足以证明“显式通过、最终产物验收后才交付”。若用户本来就保留最终 CI 与人工验收，这个限制可以被外部流程覆盖；此时需要测的是它是否仍减少协调时间，而不是直接认定整套系统无效。

**能改变判断的证据：** 在目标宿主中，未评审、空评审、blocked、过期 PASS、合并后测试失败的候选都被可靠挡住，且最后验收绑定实际集成版本。若外部保护已经做到，必须把收益归于完整组合，不能全算给插件。

### Q2：依赖图表达了顺序，但没有充分表达依赖何时才算兑现

[buildWaves](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/discover.ts#L125)对已纳入任务按拓扑分波；未知依赖被记入 unresolved 并视作满足，遇到环时将剩余任务放入一个 wave。它可以让宽松任务描述继续执行，却不能保证依赖前提成立。缺失 ID 也可能指向已完成、被扫描排除的任务，因此不能将所有未知依赖都判为错误；真正缺少的是可核实的区分。

engine 在 wave 内使用 Promise.all 启动任务，并串行合并；File Scope 在本次读取的生产源码中用于解析和质量提示，未见其参与文件冲突感知的 lane 分配。Review Level 也被解析，但未见 engine 据此强制门禁。这些声明字段不等于已经执行的约束。

**关键影响：** 没有声明依赖，不代表实现独立；文件互不重叠，也不保证接口语义独立。串行 merge 防止同时操作集成工作区，却不能消除语义冲突。同一份任务包若能在启动前识别依赖不完备，比事后多加 Reviewer 可能更划算。这是机制推断，尚无任务结果验证。

### Q3：恢复了计划和分支，是否恢复了“这一步已经正确完成”的事实

源码和 [模拟恢复测试](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/tests/engine.spec.mjs#L776)支持新 engine 实例读取批次、继续后续 wave，并把通知归属转到新会话。测试使用预设磁盘状态与 Fake/SlowWorkerHost；本次只阅读，未运行，也没有真实 kill-and-restart 结果。

另一方面，[status 持久化](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/status.ts#L74)直接写 JSON，读取解析失败时返回 null；未见临时文件原子替换。恢复会重读当前任务包，未绑定启动时的完整任务说明内容。代码 checkpoint、任务进度、评审和批次状态是不同写入，不能据此推断它们形成同一个事务。若任务会调用外部服务，Git checkpoint 更不能证明外部副作用是否已经执行或可安全重试。

因此贡献仍然成立于“恢复编排与代码现场”；把范围扩大到“恰好一次执行”或“恢复后语义一致”需要额外协议。现有 [Temporal Event History](https://docs.temporal.io/encyclopedia/event-history) 和 [Activities 幂等指引](https://github.com/temporalio/documentation/blob/main/docs/encyclopedia/activities/activity-definition.mdx)说明持久执行、重放及幂等已有成熟方法，下文推演不能宣称首次发明。

<a id="innovation"></a>

<a id="detail-section-7"></a>

## 四、重点创新推演：从编排任务走向可验证交付

**最值得继续研究的方向，是让同一套交付证据贯穿验收、依赖放行和恢复。** H1 先回答“什么才算交付”，H2 再回答“何时允许下游执行、何时可以复用旧结果”，H3 探索这种交付单元是否有跨团队转交价值。

| 方向 | 从什么发现推导 | 预期新增价值 | 优先级与状态 |
|---|---|---|---|
| **H1：验收凭据** | PASS、done 和 merge 没有共同绑定最终产物 | 将模型意见转为可核验、可失效的交付条件 | **优先验证**；设计假设 |
| **H2：产物条件依赖** | 顺序、merged 状态不足以证明依赖兑现或结果可复用 | 让调度与恢复依据实际交付条件，减少错误启动和返工 | H1 最小验证后再扩展；组合假设 |
| **H3：可转交验收任务包** | 任务、产物与证据可以外置 | 减少接手者重建上下文和重复验收的负担 | 先核实需求；业务探索 |

### H1：让验收凭据成为交付单元，模型负责提出结论，执行层负责核验结论

**状态：有源码依据的待验证设计假设，优先级最高。**

推导链为：任务包已有验收说明 → PASS 未绑定最终产物 → merge 又改变产物 → 所以需要对“哪个任务版本、哪份产物、在什么条件下通过何种检查”建立可失效的关联。

最小方案是在原有任务包旁保存验收凭据：任务说明摘要、基线和候选代码 SHA、检查策略版本、执行命令与退出结果、证据文件摘要、模型意见以及必要人工决定。执行层检查必需证据完整且对应当前产物，才允许进入 accepted；worker done、reviewed、merged 与 accepted 分开。合并后产物变化时，相关验收失效，重新检查；不让模型的一句 PASS 直接产生 accepted。

新意候选是把自然语言任务的证据约束贯穿 worker、reviewer 与集成阶段，而非增加一份 JSON 格式报告。结构化输出、CI required checks 本身已经存在，[GitHub 的 strict required checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)也处理目标分支更新后的检查问题。必须先比较这些简单办法。签名或内容摘要只能约束证据关联，不能证明测试充分、需求正确或执行者可信。

**最小验证：** 首先准备六类可判定场景：无评审、空评审、blocked、改代码后复用旧 PASS、无冲突但集成测试失败、合法通过。比较当前流程、严格 required checks 加人工验收、加入验收凭据三个条件。全部使用相同任务、模型与最终盲验标准。故障场景应无错误 accepted，合法路径不能被无谓阻断；再测总耗时、误拒绝和人工处理时间。首轮零漏放只证明覆盖的场景，不证明普遍可靠。

**否定条件：** 简单 required checks 已同样挡住问题，凭据方案仅增加维护；或凭据能齐全通过但独立验收仍频繁失败。此时收缩为常规工程修复，不包装成创新。

### H2：将依赖边从“前置任务 ID”升级为“可验证产物条件”，同时用于调度和恢复

**状态：有机制依据的待验证组合假设。**

推导链为：wavePlan 固定顺序 → unknown 可能代表已完成也可能代表漏任务 → merged 未必等于 accepted → 恢复又可能重读改变后的任务 → 所以依赖放行需要引用实际前置产物及其有效验收，而不仅是顺序或状态文字。

最小方案仅处理一个仓库：在任务依赖中注明所需接口／产物与版本，前置任务交付后生成关联凭据；下游启动前确认依赖可定位、产物存在、验收有效，并明确缺失／循环依赖的处置。恢复时比对任务说明、前置产物和验收策略变化，只有受影响任务失效，未受影响的结果可继续复用。File Scope 先作为冲突提示，不能冒充完整语义依赖模型。

这借鉴构建系统的产物依赖和缓存失效、CI 的验证以及持久工作流的方法，未证明全球新颖性。值得研究的差异是：在 LLM 可修改说明、实现与接口的工作中，条件化依赖能否减少无效并行和恢复后的隐性返工。不要预设越细的契约越好，编写契约本身也会消耗人工与 token。

**最小验证：** 使用前置产物缺失、前置结果不合格、重启前任务描述改变、互不相交文件但接口不兼容，以及真正独立任务五类场景。比较现有 waves、严格未知依赖检查、完整产物条件方案，先看错误启动、重复执行和错误复用，再看额外阻塞、定义任务的时间与合格任务成本。需分别比较 H1、H2 及组合，避免把门禁改进误归于调度设计。

**否定条件：** 增加依赖表达后仍不能预测多数返工，或串行／人工管理以更小总负担完成同样任务。若仅“未知依赖报错”就解决主要问题，应停在这一层。

### H3：把“多 Agent 执行工具”转化为“可转交的验收任务包”

**状态：探索性业务设想，证据弱于 H1/H2。**

TaskSwarm 已把任务、进度和代码现场外置；若再有可核验的产物与验收记录，可能支持不同会话、不同执行工具或不同服务方接手同一任务。交付物可以是“任务契约、候选代码、验收凭据与未决项”，接手者减少重建上下文和重新确认完成标准的时间。最先可探索的是重复性修复或测试补齐，避免从规格不清的大型项目起步。

它可能改变团队交接、外包或内部验收方式，但当前没有反复出现的用户需求、迁移行为或付费证据；Issue 为空也不说明没有需求。PR 加 CI 已能承担很多功能，跨工具格式与信任边界也会增加成本。此处不建议直接开发平台或按合格交付收费。

**最小验证：** 先访谈并观察三个实际交接团队，再用同类真实任务对照“现有 PR＋CI＋说明”与“验收任务包”。记录接手准备时间、遗漏、重复检查、返工和实际复用意愿。若现有流程已足够，或必须投入大量人工补包才可用，应撤回业务机会判断。

<a id="detail-section-8"></a>

## 五、依赖、流程与成本：贡献的兑现条件

| 条件 | 必要性与负担 | 失效或降级 |
|---|---|---|
| Node ≥22、Git、可用 DSH 宿主 | 安装与执行依赖；peerDependencies 用通配符且标 optional，不能作为兼容矩阵 | 公开 npm latest 不可用，GitHub 安装及宿主兼容未验；可退回人工 worktree |
| agents、模型路由、工具与权限 | Worker／Reviewer／Merger 要能创建、访问文件和运行 Git | 模型、工具或额度故障会中断；需要保留人工验收与处置 |
| 可表达的任务、依赖、共同验收 | 效果依赖；任务越耦合，拆分和集成可能越昂贵 | 规格不清或紧耦合时先用单 Agent／人工规划 |
| 每个 worktree 的环境与共享资源 | 代码目录隔离不自动隔离数据库、端口、凭据或外部写入 | 实验中隔离服务、限制副作用；不能仅凭 cwd 认定安全隔离 |
| 状态目录、任务包及 Git 分支 | 要维护恢复现场与版本关联 | 状态异常时先取证、核对，不能盲目重跑外部动作 |

用户准备任务包与基线 → plan 核对 → worker 并行执行并更新状态 → 可调用 Reviewer → 串行合并／冲突时 Merger → 操作者最终验收并集成。用户负担集中在任务定义、检查环境与例外处置；后台还有提示注入、模型调用、检查点、状态与消息写入。恢复和手工抢救均可能发生，不能用一句启动命令表示总流程复杂度。

现金成本包括全部 worker、reviewer、merger、supervisor 调用、失败重试及环境资源；人工时间包括任务拆分、配置、复核、冲突处理、恢复与迁移。两者分别记录。本次没有模型账单、耗时或合格任务数据，不输出收益百分比、ROI 或单位金额。

后续比较应固定验收标准，以总现金支出÷合格交付数计现金单位成本，同时报告总尝试数、合格率、端到端耗时和人工时间；零合格交付时无有限单位成本。模型、总预算或人工投入不一致时单列，不能把增加资源的收益算作编排机制胜出。

<a id="detail-section-9"></a>

## 六、工程材料能证明到哪里

本稿核查 README、package、调度与恢复、worktree、任务包、worker/reviewer/merger 接线、supervisor、持久化及相关测试的源码。没有安装插件、执行目标代码或测试，没有启动 DSH 或调用模型；研究深度为 source，不作全生态排名。

证据索引见 [EVIDENCE.json](EVIDENCE.json)，统计见同一证据包的 `inventory` 部分。采集时间、稳定身份与原件保存在证据包中。

### 代码规模与能力

运行的是本工程 inventory 工具，未运行目标代码。固定 Git 提交统计采用 sloc 0.3.2、TypeScript AST 5.9.3；本次纳入52个文件，默认排除列表为空，解析错误为空。这不表示所有扩展名都纳入或完成全面审计。

| 类型 | 路径角色 | 文件数 | 总行 | 代码行 | 注释行 | Markdown 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 3,638 | — | — | 33,158 |
| .ts | source | 23 | 5,548 | 4,189 | 1,050 | — |
| .js | source | 1 | 2,871 | 2,101 | 460 | — |
| .mjs | source | 4 | 1,448 | 920 | 433 | — |
| .mjs | test | 9 | 3,178 | 2,582 | 291 | — |

source 为路径分组，包含文档与脚本，不等于全部生产代码；Markdown 与 JS/TS 不合成 LOC，混合行可同时计代码和注释。纳入的继承／适配代码未做逐行原创量扣除，不能从统计推断原创量、人天或创新程度。

在该固定版本中，源码确认的正向能力包括任务包解析、依赖分波、worktree 隔离与串行集成、检查点、磁盘状态恢复、DSH 原生 worker/reviewer/merger 接线、supervisor 控制和独立本地 dashboard 服务。dashboard 不是已确认的宿主 UI 注册能力。

inventory 检出11个字面量工具名候选、14个 tswarm 命令名候选及别名／动态注册点；源码还显示 supervisor 注册封装和 worker 工具桥。它们是不同作用域中的定义或候选，不是本轮宿主可用总数。request_segment_expansion 的工具说明明确当前仅记录请求，没有动态分段扩展；无 SKILL.md 候选，也未确认注册的 Agent/Preset 定义数量，不能把 worker/reviewer 等角色数直接当注册数量。


- **模型工具**：源码定义 task_runner、review_step、notify_supervisor 与 escalate_to_supervisor 等任务执行和协作工具。
- **用户命令**：源码注册 tswarm-plan、tswarm-check、tswarm-status、tswarm-pause、tswarm-resume 与 tswarm-integrate 等命令。
- **后台**：按依赖分波执行，串行集成，持久化批次状态并提供恢复路径。

### 工程评价与可借鉴处

WorkerHost 将宿主接线与调度分开，便于固定边界后做确定性编排验证；串行 merge queue 将共享集成工作区的写操作集中；冲突时保留分支和现场，有利于诊断；operator pause 来源控制也值得复用。移植时仍需重接宿主生命周期、权限、模型与事件，并验证取消后的收尾和状态一致性。

最需要改进的共同点是状态语义：done、blocked、review verdict、merged 与真正验收之间缺少完整约束。源码中的“容错继续”有利于流程可用性，却可能放宽交付判定。Q1—Q3 已解释其影响，此处不重复一般代码风险列表。

[engine 测试](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/tests/engine.spec.mjs)覆盖模拟任务并行、依赖、冲突、暂停、停止、恢复和会话归属；这些材料体现可测试边界，但不是本次测试通过，也不能证明真实模型会正确评审或完成需求。没有发现足以支持总体质量、成本收益或真实用户采用的独立结果。

<a id="detail-section-10"></a>

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm/issues?q=is%3Aissue+created%3A2026-09-20T06%3A34%3A20.397Z..2026-10-20T06%3A34%3A20.397Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T06%3A34%3A20.397Z..2026-10-20T06%3A34%3A20.397Z)



统计日期：2026-10-20。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
