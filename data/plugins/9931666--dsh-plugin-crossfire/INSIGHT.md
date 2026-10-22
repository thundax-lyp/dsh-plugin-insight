# @y9931666/dsh-plugin-crossfire

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[a6d4be3](https://github.com/9931666/dsh-plugin-crossfire/tree/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire) [![npm 30d 669](https://img.shields.io/static/v1?label=npm+30d&message=669&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire)
<!-- END META -->

> **实现功能**：把待核成果按维度交给只读工具受限的红队子agent，收集候选缺陷，由读者逐条认定或驳回，并保存定稿与旧缺陷复审历史。

> **核心亮点**：将只读工具受限专家、真实persona/发言、pending缺陷与人工理由/历史复审接为一套可追踪流程，不让专家自动作最终真值。详见[Q02](#research-q02)。

> **风险与缺陷**：Web缺connection时放行，actor和preferredRoot来自body非强授权；锁仅进程内，report发言/预算非事务，RPC collect没透传坏行数。endorsed/settled仍是人的状态而非独立复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 红队评审帮助什么决策，最终结论是什么性质？](#detail-section-11)
  - [Q02 · 从专家发言到逐条缺陷有哪些明确机制？](#detail-section-12)
  - [Q03 · 人裁决、Web信任与会话归属是否等价？](#detail-section-13)
  - [Q04 · 锁、持久化和历史复审有哪些恢复边界？](#detail-section-14)
  - [Q05 · 启动和评审流程需要什么？](#detail-section-15)
  - [Q06 · 专家与收集的实际成本怎样解释？](#detail-section-16)
  - [Q07 · 当前推荐与进一步探索从哪里入手？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已形成方案、代码解释或其他待核成果的人。开评审明确subject/立场/维度，红队专家挑缺陷，收集成逐条pending，由读者认定/驳回并写理由，定稿保历史；复审只核上一轮认定项。目标是让缺陷与个人裁决可见，而不是让多个模型投票自动证真。

合格产物须区分专家主张、定位/证据、人工接受或拒绝、尚待核项和复审结果。endorsed代表人接受该观点，不等于独立复现；专家人数和维度数不等于独立证据，尤其共享模型/上下文时会有相关偏差。settled也不必表示所有pending都处理完或产品可安全上线。

人工逐条审稿是基线，模型对抗辅助扩候选缺陷并留下裁决账本。插件不自动修代码，不承担最终业务/上线决策，收益应按真实缺陷召回、误报和裁决成本评价。

人工或单模型挑问题并手工留裁决；增量是多维专家候选、逐条理由与历史复核，真值仍需原材料/复现和人判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 专家攻击 | 按维度/persona拉子agent | toolFilter依宿主，意见非独立真值 |
| 缺陷收集 | LLM拆分/本地fallback/维度归一 | 噪声/重复过滤可影响候选 |
| 人工裁决 | 三态、驳回理由、known flaws | UI入口不等于强认证人签名 |
| 定稿/复审 | 同pass历史upsert、旧认定项重核 | settled可含pending，非全量重审 |
| 预算/导出 | 文本熔断与持久记录 | 非模型实账，跨进程/多文件事务需核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22、DSH tools/subagents/agents/systemPrompt | 必需 | 主持/专家与工具 | 对应Harness rc.2基线 |
| connection认证栅栏 | Web安全前提 | 浏览器Host/Origin/auth | 组件把它可选，缺失会放行须停用Web面 |
| webServer/客户端slots | UI需要 | 卡片和RPC/state | 缺服务工具仍可降级，不等于UI验收 |
| LLM路由/provider | 专家必需、拆分可选 | 红队推理/拆缺陷 | 拆分缺失/失败有本地fallback |
| 可写workspace状态目录 | 持久化 | 记录/转录/导出 | 文件权限和多进程协调需核 |
| 人工事实核验与裁决时间 | 业务必需 | 逐项接受/驳回 | 专家票数不能当真值 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/宿主，核认证栅栏与单进程状态 | Git源码需构建lib，npm包另核 |
| 开题 | 明确subject/立场/维度/强度预算 | 真实目标不由模型虚构 |
| 攻击 | 小量专家先读材料 | 核child、路由、persona与只读toolFilter |
| 收集 | 从发言拆成pending | 噪声/维度fallback/坏行与缺报告需可见 |
| 裁决 | 人逐条核证据，拒绝写理由 | pending保留，不强行结论 |
| 定稿 | 核known flaws/未定项和历史 | settled不等于零风险 |
| 复审 | 对旧认定项核修复 | 不当新范围全量审计 |

本轮不运行作者测试、专家模型或浏览器验收。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主/模型与构建依赖资源 | 设置维度、工作区/认证 | 内部API/构建兼容人工时间与费用未知 |
| 持续使用 | 多专家输入输出、可选拆分模型、UI轮询 | 人工裁决与专家结果审阅 | 文本估算预算非provider实际usage/金额 |
| 失败恢复 | 启动/坏日志/split fallback和状态恢复资源 | 核状态/预算差异，保留原件 | 无跨进程/多文件事务保证，恢复时间与费用未知 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 多角度找问题 | 维度/专家persona与只读工具限制 | 多模型意见相关，不是独立事实验证 |
| 防结论混淆 | pending/endorsed/rejected与理由历史 | 受人判断/身份与记录可靠性影响 |
| 复核旧缺陷 | 同pass历史与recheck | 不覆盖新缺陷/新范围 |
| 控过程规模 | 专家maxTokens、文本/轮次预算 | 已说文本估算非全部输入/工具/拆分usage |

budget估算CJK0.6和其他非空0.3字符，源注释明确不是模型真实用量；report限20k后按已存文本charge。应另外记录模型输入/输出/缓存usage、专家数、拆分调用和人工耗时。不能把预算150k当平台费用硬上限，也不声称缺陷准确率或交付质量量化提高。

> **思考**：Web缺connection时放行，actor和preferredRoot来自body非强授权；锁仅进程内，report发言/预算非事务，RPC collect没透传坏行数。endorsed/settled仍是人的状态而非独立复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将只读工具受限专家、真实persona/发言、pending缺陷与人工理由/历史复审接为一套可追踪流程，不让专家自动作最终真值。详见[Q02](#research-q02)。

将只读工具受限专家、真实persona/发言、pending缺陷与人工理由/历史复审接为一套可追踪流程，不让专家自动作最终真值。详见[Q02](#research-q02)。

record用同目录随机tmp+rename原子写，优先宿主atomic writer；每review进程内锁将读取/检查/变更/写串行。RPC collect锁内重读状态/转录，finish锁内按pass upsert历史，重复finish不叠相同pass，这是清楚的幂等设计。

锁是进程内，跨进程同文件可后写覆盖，原子写只防半文件不防丢更新；locks Map无清除键，长期review数量保留需测。readJson坏/缺/权限错误都undefined，readJsonLines读失败空items/malformed0，缺记录和不可读状态可混淆。坏JSONL行计数穿到engine.malformedLines，但RPC collect返回只collected/duplicates/noise/splitAttempts/recheck，没有透传malformedLines，UI调用者未必知道输入不全。

report先append transcript再mutateRecord charge/status，两文件不是事务，崩溃/并发边界可能留下已写发言而预算/状态未同步；预算检查在写前外层读，可能并发越上限。finish允许attacking/judging/settled且带pending快照，复审只从上一认定项构造，不是重新全量独立审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

Web缺connection时放行，actor和preferredRoot来自body非强授权；锁仅进程内，report发言/预算非事务，RPC collect没透传坏行数。endorsed/settled仍是人的状态而非独立复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，须真实connection认证栅栏、可信同信任用户、单进程状态与人工核证据；先小规模匿名成果。详见[Q07](#research-q07)。

合格产物须区分专家主张、定位/证据、人工接受或拒绝、尚待核项和复审结果。endorsed代表人接受该观点，不等于独立复现；专家人数和维度数不等于独立证据，尤其共享模型/上下文时会有相关偏差。settled也不必表示所有pending都处理完或产品可安全上线。

人工逐条审稿是基线，模型对抗辅助扩候选缺陷并留下裁决账本。插件不自动修代码，不承担最终业务/上线决策，收益应按真实缺陷召回、误报和裁决成本评价。

采用建议：有试用，须真实connection认证栅栏、可信同信任用户、单进程状态与人工核证据；先小规模匿名成果。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。发现/人工三态与历史接线完整，缺fence放行、声明式actor/根和跨进程/坏行透传边界需核。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、compatibility.json、src/index.ts、src/web-guard.ts、src/rpc.ts、src/state.ts、src/review.ts、src/engine.ts、src/members.ts、src/redteam.ts、src/tools.ts、src/budget.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定src关键状态/工具/RPC/专家/收集/锁/预算/认证链及包/兼容声明；不全前端审计，不执行专家模型/测试/宿主。
- 下一步：可继续用匿名材料/模拟专家的权限和故障矩阵核fence/actor/根、坏行与发言预算恢复，再盲评缺陷准确/重复及人工成本。

**分析版本**

- **仓库**：[9931666/dsh-plugin-crossfire](https://github.com/9931666/dsh-plugin-crossfire)
- **版本号**：0.1.3（[固定提交 a6d4be3](https://github.com/9931666/dsh-plugin-crossfire/tree/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索认证actor/允许根与record版本绑定、缺陷证据版本收据和可恢复发言/预算事件，比较未授权接受/缺口/复核成本；未实现。详见[Q07](#research-q07)。

可继续用匿名材料/模拟专家的权限和故障矩阵核fence/actor/根、坏行与发言预算恢复，再盲评缺陷准确/重复及人工成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 293 | — | — | 3861 |
| .ts | source | 30 | 7881 | 4948 | 2419 | — |
| .tsx | source | 4 | 2548 | 2045 | 422 | — |
| .mjs | test | 20 | 3264 | 2548 | 400 | — |
| .js | test | 1 | 172 | 127 | 37 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire/issues?q=is%3Aissue+created%3A2026-09-22T06%3A52%3A14.176Z..2026-10-22T06%3A52%3A14.176Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A52%3A14.176Z..2026-10-22T06%3A52%3A14.176Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**固定版本核红队发现/人工逐条裁决链、专家权限、Web/归属和持久化/成本边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 红队评审帮助什么决策，最终结论是什么性质？

**研究主题：**场景与需求

#### 完整回答

面向已形成方案、代码解释或其他待核成果的人。开评审明确subject/立场/维度，红队专家挑缺陷，收集成逐条pending，由读者认定/驳回并写理由，定稿保历史；复审只核上一轮认定项。目标是让缺陷与个人裁决可见，而不是让多个模型投票自动证真。

合格产物须区分专家主张、定位/证据、人工接受或拒绝、尚待核项和复审结果。endorsed代表人接受该观点，不等于独立复现；专家人数和维度数不等于独立证据，尤其共享模型/上下文时会有相关偏差。settled也不必表示所有pending都处理完或产品可安全上线。

人工逐条审稿是基线，模型对抗辅助扩候选缺陷并留下裁决账本。插件不自动修代码，不承担最终业务/上线决策，收益应按真实缺陷召回、误报和裁决成本评价。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-18](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/README.md#L1-L18)

作者红队发现/人裁决定位。

<details>
<summary>查看原文（18行）</summary>

```text
# 针锋 Crossfire

**把一个已经定稿的成果摆上台，让红队从指定维度分头攻击，由你逐条认定或驳回。**

Crossfire 是 DeepSeek Harness 的一个插件，只做一件事：**对抗式评审**。它不产出方案、不改代码、不自动修复 —— 它是验收器，不是执行器。

## 它和别的多智能体插件有什么不同

| | 协作型团队（如 AgentTeams） | 圆桌会议 | **针锋 Crossfire** |
| --- | --- | --- | --- |
| 目标 | 把活干完 | 开一场多角色会议 | **判定一份成果站不站得住** |
| 机器做什么 | 分工、执行、自动修复 | 统筹、转述、聚合 | **只挑错** |
| 谁下结论 | 流程门禁 | 主持人汇总 | **你，逐条** |
| 界面 | 成员树 / 任务 DAG | 拓扑图 + 面板 | **一张卡，四个状态** |

四条边界（越界即破坏了它存在的意义）：

1. **表态永远由人做。** 缺陷的认定 / 驳回只能在卡片上由你操作；插件**没有**、也**不该有**"代表认定缺陷"的工具。
```

</details>

**依据 2 · 源码核查**：[src/rpc.ts:473-487](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L473-L487)

三态与驳回理由。

<details>
<summary>查看原文（15行）</summary>

```text
        /* ---------------- 表态（**只允许人从界面调用**） ---------------- */
        case 'crossfire/defect.setStatus': {
          const defectId = typeof body.defectId === 'string' ? body.defectId : ''
          if (defectId === '') return fail('payload must be { reviewId, defectId, status }')
          const status = body.status
          if (status !== 'pending' && status !== 'endorsed' && status !== 'rejected') {
            return fail('status must be "pending" | "endorsed" | "rejected"')
          }
          const rejectReason = typeof body.rejectReason === 'string' ? body.rejectReason : ''
          if (status === 'rejected' && rejectReason.trim() === '') {
            return fail('rejecting a defect requires a non-empty reject_reason (驳回必填理由)')
          }
          const located = await load(reviewId, session, preferredRoot)
          const changed = await setDefectStatus(located.stateRoot, reviewId, defectId, status, rejectReason)
          return ok({ changed, status })
```

</details>

**依据 3 · 源码核查**：[src/rpc.ts:836-868](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L836-L868)

定稿快照与状态，无pending归零要求。

<details>
<summary>查看原文（33行）</summary>

```text
  if (step === 'finish') {
    const summary = typeof body.summary === 'string' ? body.summary.trim() : ''
    // 状态门禁 + 追加历史 + 置 settled 全在同一个临界区里（A6）。
    //
    // 此前门禁在锁外、锁内的 `mutateRecord` 回调又不重校状态，于是并发两次 finish
    // 会各自追加一条**同一个 pass** 的 history 快照 —— "这一轮定稿"在历史里出现两次，
    // 复审时同一批旧账被核对两遍。
    return await withCrossfireLock(reviewLockKey(stateRoot, reviewId), async () => {
      const current = await readRecord(stateRoot, reviewId)
      if (current === undefined) return fail(`no review "${reviewId}"`)
      if (current.status !== 'judging' && current.status !== 'attacking' && current.status !== 'settled') {
        return fail(`review "${reviewId}" is "${current.status}" — cannot settle now`)
      }
      const snapshot: PassSnapshot = {
        pass: current.reviewPass,
        subject: current.subject.content,
        stanceText: current.stance.text,
        dimensions: [...current.dimensions],
        intensity: current.intensity,
        defects: current.defects.map((defect) => ({ ...defect })),
        finishedAt: Date.now(),
        ...(summary === '' ? {} : { revisedSummary: summary }),
      }
      // **同一 pass 在 history 里只能有一条**：已存在就原地更新它。重复定稿应当是一次
      // 幂等的更新（用户改完表态又点一次定稿是合法操作），而不是又叠一份快照 ——
      // 叠出来的历史会让复审把同一批旧账核对两遍，且先写的那份永远是最旧的。
      const existing = current.history.findIndex((item) => item.pass === current.reviewPass)
      if (existing >= 0) current.history[existing] = snapshot
      else current.history = [...current.history, snapshot]
      current.status = 'settled'
      current.settledAt = Date.now()
      await writeRecord(stateRoot, current)
      return ok({ settled: true, counts: countDefects(current) })
```

</details>

**依据 4 · 源码核查**：[src/engine.ts:224-225](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/engine.ts#L224-L225)

复审不新增缺陷。

```text
    // 复审轮不新增缺陷：那一轮只核对上一轮已认定的项。
    if (isRecheckRound) continue
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从专家发言到逐条缺陷有哪些明确机制？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

工具与UI共用record/状态转换。attack按维度/roster规划专家，先写attacking和pending记录再启动subagents，成功后记录childId/真实persona/路由，失败记录note。persona只生成一次且成功后落盘，读者可看到真正发给该专家的同份提示，避免展示的提示与执行不一致。

专家toolFilter明确allow read/read_image/glob/grep/crossfire_report，并deny主持编排工具；不是单靠“只读”提示。report用exec.agent.id查子agent绑定，非红队拒绝，内容最多20k写append transcript，再累积文本估算预算和done状态。工具可见性/限制是否由具体provider准确执行依宿主契约。

collect按pass和utteranceId去重、滤进度噪声，优先LLM拆分，失败退本地marker，不能拆保整条pending；维度归一到所选集合并标fallback，历史驳回去重。贡献在发现/证据候选/人工三态/历史复审接线，而非自动判断缺陷真实。

#### 证据与依据

**依据 1 · 源码核查**：[src/rpc.ts:743-784](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L743-L784)

先持久状态再spawn及失败可见。

<details>
<summary>查看原文（42行）</summary>

```text
      const experts = planExperts(current, runtime.tools.maxExperts, roster)
      const isRecheck = current.reviewPass > 1 && current.history.length > 0
      if (isRecheck && current.defects.length === 0) current.defects = buildRecheckItems(current)
      current.experts = experts
      current.status = 'attacking'
      // 先落一次盘再拉起：卡片立刻能看到 attacking + pending，而不必等所有子代理都
      // 起来（真实拉起是十秒级的），锁内的记录也因此始终与盘上一致。
      await writeRecord(stateRoot, current)

      const failures: string[] = []
      for (const expert of experts) {
        const controller = new AbortController()
        try {
          const childId = await spawnExpert(
            ctx,
            {
              provider: runtime.tools.memberProvider,
              ...(runtime.tools.memberMaxDepth === undefined ? {} : { maxDepth: runtime.tools.memberMaxDepth }),
              // 专家继承主持人时的生效路由：写回记录后卡片才能把"继承"画成真实品牌块
              // （否则头像永远是中性灰 `?`，这条是用户反馈的缺陷）。
              ...(runtime.tools.defaultProvider === undefined ? {} : { defaultProvider: runtime.tools.defaultProvider }),
              ...(runtime.tools.defaultModel === undefined ? {} : { defaultModel: runtime.tools.defaultModel }),
            },
            current,
            expert,
            agent,
            controller.signal,
            { maxTokens: defaults.expertMaxTokens, maxOpinions: defaults.expertMaxOpinions },
          )
          expert.childId = childId
          expert.status = 'running'
          registerExpertChild(childId, { stateRoot, reviewId })
        } catch (error: unknown) {
          expert.status = 'failed'
          expert.note = error instanceof Error ? error.message : String(error)
          failures.push(`${expert.key}: ${expert.note}`)
        }
      }
      // 写回的是**同一批对象**（`current.experts` 就是 `experts`），所以 childId、
      // status、以及 spawnExpert 落下的 persona 一并持久化。
      current.experts = experts
      await writeRecord(stateRoot, current)
```

</details>

**依据 2 · 源码核查**：[src/members.ts:205-241](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/members.ts#L205-L241)

同份persona与toolFilter实际传宿主。

<details>
<summary>查看原文（37行）</summary>

```text
  const route = resolveExpertRoute(expert, config)
  const agentOptions: { provider?: string; model?: string; maxTokens?: number } = { ...route.agentOptions }
  if (limits.maxTokens !== undefined && limits.maxTokens > 0) {
    agentOptions.maxTokens = limits.maxTokens
  }

  // 把这位专家**实际使用的路由**写回记录：逐字段等于 `route` 的决定，取不到生效值
  // 就删掉该字段（"缺失 = 继承"必须看得见，而不是留一个空串或上一轮的残值）。
  if (route.provider === undefined) delete expert.provider
  else expert.provider = route.provider
  if (route.model === undefined) delete expert.model
  else expert.model = route.model

  // persona **只生成一次**：同一个常量既用于下发、也用于落盘。
  //
  // 这不是省一次函数调用，而是这个字段的正确性来源：如果下发与落盘各调一次
  // `expertPersona()`，任何一次参数漂移（或函数内部带了时间戳之类的非纯行为）都会让
  // "查看原提示词"显示的东西与专家真正收到的东西不是同一份 —— 而那正是我们要修的缺陷。
  const persona = expertPersona(input)

  const started = await ctx.subagents.startContinuable({
    provider: config.provider,
    label: `${EXPERT_LABEL_PREFIX}${record.reviewId}:${expert.key}`,
    request: {
      prompt: [{ type: 'text', text: expertWelcome(input) }] as ContentBlock[],
      parent,
      persona,
      toolFilter: expertToolRestriction(),
      ...(Object.keys(agentOptions).length > 0 ? { agentOptions } : {}),
      ...(config.maxDepth === undefined ? {} : { maxDepth: config.maxDepth }),
    },
    signal,
  })
  // 落盘时机**在 startContinuable 成功之后**：拉起失败时什么都不记（调用方会把
  // status 记成 failed），避免留下一份"看起来下发过、其实没发出去"的原文。
  expert.persona = persona
  return String(started.childId)
```

</details>

**依据 3 · 源码核查**：[src/redteam.ts:38-89](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/redteam.ts#L38-L89)

allow/deny工具面。

<details>
<summary>查看原文（52行）</summary>

```text
export const EXPERT_TOOL_ALLOW: readonly string[] = [
  // 只读检索：让专家能自己核实它引用的位置真的存在。
  'read',
  'read_image',
  'glob',
  'grep',
  // 唯一的发言通道：写评审 transcript，不碰工作区。
  'crossfire_report',
]

/**
 * 红队专家禁止使用的工具（黑名单）。
 *
 * 这里列的是全部**主持人专属**的 `crossfire_*` 工具：开评审、发起攻击、收集
 * 缺陷、定稿、复审、导出。这些都是主持人的编排权，专家一旦能调
 * `crossfire_collect`/`crossfire_finish`，就等于自己给自己结案，"表态由人做"
 * 当场失效。
 *
 * 为什么白名单之外还要再来一份黑名单：两者是**与**关系（必须同时在白名单里
 * 且不在黑名单里才可见）。将来有人为了加一个只读工具而改动
 * {@link EXPERT_TOOL_ALLOW} 时，不会顺带把编排权放开 —— 黑名单这一层与被修改
 * 的那一行无关，能拦住"删一项白名单等于多一份权限"的误操作。
 *
 * **注意**：`crossfire_report` 是**专家自己的**发言工具，绝不能列进本表。
 */
export const EXPERT_TOOL_DENY: readonly string[] = [
  'crossfire_open',
  'crossfire_attack',
  'crossfire_collect',
  'crossfire_finish',
  'crossfire_recheck',
  'crossfire_export',
  'crossfire_stance',
]

/** 专家的工具限制（宿主 subagent/tool 配置接受的形状）。 */
export interface ToolRestriction {
  /** 保持可见的全局工具。 */
  readonly allow?: readonly string[]
  /** 强制不可见的全局工具（与 allow 是"与"关系）。 */
  readonly deny?: readonly string[]
}

/**
 * 专家的工具限制。
 *
 * 每次返回**新的数组实例**，且以 `readonly` 声明：宿主侧可能在拿到后排序或增删，
 * 共用模块级数组会让一次改动污染后续所有专家。黑名单恒为全量主持人工具，
 * 与白名单内容无关 —— 它是与被修改的那一行**无关**的第二道闸。
 */
export function expertToolRestriction(): ToolRestriction {
  return { allow: [...EXPERT_TOOL_ALLOW], deny: [...EXPERT_TOOL_DENY] }
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:739-780](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/tools.ts#L739-L780)

红队绑定/report与计费。

<details>
<summary>查看原文（42行）</summary>

```text
    async execute(args, exec) {
      const caller = requireAgent(exec)
      // 宽限查询：归属索引是在 spawn 返回之后登记的，而子代理可能在那之前就已经
      // 跑完一轮（见 expert-events.ts 里对这段竞态的说明）。
      const located = await locateExpertChildWithGrace(caller.id)
      if (located === undefined) {
        throw new Error(
          'crossfire_report is only for red-team experts of a running review '
          + '(if you were just spawned, retry once — your review binding may still be settling)',
        )
      }
      const content = text(args.content)
      if (content === '') throw new Error('content must not be empty')

      const record = await readRecord(located.stateRoot, located.reviewId)
      if (record === undefined) throw new Error(`no review "${located.reviewId}"`)
      assertBudget(record)

      const expert = record.experts.find((candidate) => candidate.childId === caller.id)
      const expertKey = expert?.key ?? 'unknown'
      const utterance: ExpertUtterance = {
        id: randomUUID(),
        expertKey,
        kind: 'speech',
        content: content.slice(0, 20_000),
        pass: record.reviewPass,
        ts: Date.now(),
      }
      await appendTranscript(located.stateRoot, located.reviewId, utterance)
      const charged = estimateTokens(utterance.content)
      const remaining = await mutateRecord(located.stateRoot, located.reviewId, (current) => {
        chargeTokens(current, utterance.content)
        if (expert !== undefined) {
          const target = current.experts.find((candidate) => candidate.childId === caller.id)
          if (target !== undefined) {
            target.status = 'done'
            // 实时记下"提交过几次"。`defectCount` 要等 collect 拆分后才有值，
            // 在此之前卡片必须能显示这位专家确实交了东西。
            target.reportCount = (target.reportCount ?? 0) + 1
          }
        }
        return Math.max(0, current.budget.maxTokens - current.budget.usedTokens)
```

</details>

**依据 5 · 源码核查**：[src/engine.ts:201-229](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/engine.ts#L201-L229)

pass/噪声/幂等过滤。

<details>
<summary>查看原文（29行）</summary>

```text
export async function collectDefects(input: CollectInput): Promise<CollectOutcome> {
  const { record, transcript, llm } = input
  const allowed = record.dimensions
  const collectedUtterances = new Set(record.defects.map((defect) => defect.utteranceId))
  const isRecheckRound = record.reviewPass > 1 && record.history.length > 0

  const candidates: Defect[] = []
  let skippedNoise = 0
  let alreadyCollected = 0

  // 一道过滤 + 收集待拆分项：把"哪些要拆"与"怎么拆"分开，
  // 于是拆分环节可以对整批发言施加有界并发（见 collectWithConcurrency）。
  const pending: { utterance: ExpertUtterance; content: string }[] = []
  for (const utterance of transcript) {
    if (utterance.pass !== record.reviewPass) continue
    if (collectedUtterances.has(utterance.id)) {
      alreadyCollected += 1
      continue
    }
    if (isNoiseUtterance(utterance.kind, utterance.content)) {
      skippedNoise += 1
      continue
    }
    // 复审轮不新增缺陷：那一轮只核对上一轮已认定的项。
    if (isRecheckRound) continue

    const content = utterance.content.replace(/\s+/g, ' ').trim()
    if (content === '') continue
    pending.push({ utterance, content })
```

</details>

**依据 6 · 源码核查**：[src/engine.ts:235-255](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/engine.ts#L235-L255)

LLM拆分与本地fallback。

<details>
<summary>查看原文（21行）</summary>

```text
  const collectOne = async (
    item: { utterance: ExpertUtterance; content: string },
    _index: number,
    activeLlm?: SplitLlmLike,
  ): Promise<{ lines: Awaited<ReturnType<typeof splitByMarkers>>; usedLlm: boolean }> => {
    if (activeLlm === undefined) return { lines: splitByMarkers(item.content, allowed), usedLlm: false }
    try {
      // 立场必须一路传到拆分器：提示词要它判断"是否打穿立场"，而此前它拿不到立场 ——
      // 于是 strikes_stance 恒为 false。记录里的 stance 就是唯一来源，不另开参数。
      const lines = await splitUtterance(
        activeLlm,
        input.splitConfig,
        item.utterance.expertKey,
        item.content,
        allowed,
        record.stance.text,
      )
      return { lines, usedLlm: true }
    } catch {
      return { lines: splitByMarkers(item.content, allowed), usedLlm: false }
    }
```

</details>

**依据 7 · 源码核查**：[src/engine.ts:268-309](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/engine.ts#L268-L309)

整条兜底/维度归一/历史去重。

<details>
<summary>查看原文（42行）</summary>

```text
  for (const [position, item] of pending.entries()) {
    const lines = splitResults[position]?.lines ?? splitByMarkers(item.content, allowed)
    const utterance = item.utterance

    if (lines === null) {
      // 整条兜底（seq = 0）：宁可让用户看到一条大观点，也不要丢掉内容。
      candidates.push({
        id: utterance.id,
        utteranceId: utterance.id,
        expertKey: utterance.expertKey,
        content: item.content,
        dimension: allowed[0] ?? '其他',
        dimensionFallback: true,
        status: 'pending',
        ts: utterance.ts,
        seq: 0,
      })
      continue
    }

    for (const [index, line] of lines.entries()) {
      const resolved = resolveDimension(line.dimension, allowed)
      const defect: Defect = {
        id: `${utterance.id}#${index + 1}`,
        utteranceId: utterance.id,
        expertKey: utterance.expertKey,
        content: line.content,
        dimension: resolved.dimension,
        status: 'pending',
        ts: utterance.ts,
        seq: index + 1,
      }
      if (line.dimensionFallback === true || resolved.fallback) defect.dimensionFallback = true
      if (line.quote !== undefined) defect.quote = line.quote
      if (line.evidence !== undefined) defect.evidence = line.evidence
      if (line.strikesStance === true) defect.strikesStance = true
      candidates.push(defect)
    }
  }

  // 历史去重（D8 允许的唯一用法）：上轮被用户驳回的观点不再弹第二次。
  const { kept, dropped } = dropRejectedDuplicates(candidates, rejectedContents(record))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 人裁决、Web信任与会话归属是否等价？

**研究主题：**缺陷与关键质疑

#### 完整回答

自建RPC/state路由每次请求实时探ctx.connection.requestRejection，存在时施加Host/Origin与浏览器认证，抛错403；RPC只POST且1MiB body cap。比注册时快照缺失服务更能跟随后挂载状态。但connection缺席时rejectWebRequest明确放行，仅warn一次，因此最小profile下不是始终有浏览器认证的安全边界。

judgeActor拒空session、owner不一致，但actor来自body.session，旧无owner记录对任何非空session放行；它是客户端声明的一致性检查，不是服务端从认证凭据派生的会话身份。preferred stateRoot客户端可传且优先查，reviewId仅非空；源码未在这条路径统一校批准workspace根/规范ID，因此不能把路径/归属参数当权限凭证。需结合Host认证和进程文件权限判断实际范围，未执行越界请求或推断已暴露。

“只允许人从界面表态”是产品入口/工具面分离，路由本身收JSON，不证明每个决定都能归给特定真人或签署过的内容。专家白名单不含HTTP/shell降低模型直接改裁决面，但读者仍须信任浏览器、宿主服务和目标provider。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:238-269](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/index.ts#L238-L269)

每次实时fence与缺失warn。

<details>
<summary>查看原文（32行）</summary>

```text
    // 宿主 webserver 不会自动施加 Host/Origin + 浏览器认证栅栏，必须由路由自己
    // 调 `connection.requestRejection`。取不到该服务时放行（最小 profile 不能
    // 因此瘫痪），但只要能取到就一定要用。
    //
    // **刻意在每次请求时实时取，而不是在注册时快照一个闭包**（修红队评审抓出的
    // fail-open 窗口）：路由只在第一次 `registerWebSurface` 时注册（标记位堵死重
    // 注册），若那一刻 `connection` 还没挂载，快照下来的 `undefined` 就会让这两条
    // 路由**永久**失去信任栅栏 —— 而宿主稍后挂上 connection 也不会重新注册。实时取
    // 之后，栅栏一旦可用就立即生效，代价只是一次属性探测。
    // 「降级由调用方留痕」：实时取的同时只提醒一次，避免每个请求刷一条日志。
    const currentFence = fenceProbe(
      () => ctx.get('connection'),
      () => ctx.logger.warn('crossfire: connection.requestRejection is unavailable — plugin web routes run without the Host/Origin + browser-auth fence'),
    )

    if (!rpcRouteRegistered) {
      rpcRouteRegistered = true
      ctx.effect(() => webServer.register({
      kind: 'exact',
      path: RPC_ROUTE,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        const send = (status: number, body: unknown): void => {
          res.writeHead(status, {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store',
          })
          res.end(JSON.stringify(body))
        }
        const rejection = rejectWebRequest(currentFence(), req.headers)
        if (rejection !== undefined) {
          send(rejection, { ok: false, error: { code: 'forbidden', message: 'connection trust check failed' } })
          return
```

</details>

**依据 2 · 源码核查**：[src/index.ts:271-299](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/index.ts#L271-L299)

POST/body cap/dispatch。

<details>
<summary>查看原文（29行）</summary>

```text
        if ((req.method ?? 'GET').toUpperCase() !== 'POST') {
          send(405, { ok: false, error: { code: 'internal', message: 'this route accepts POST only' } })
          return
        }
        let body: unknown
        try {
          const chunks: Buffer[] = []
          let size = 0
          for await (const chunk of req) {
            size += (chunk as Buffer).length
            // 无上限的请求体等于让任何本机页面把整包塞进内存。
            if (size > MAX_RPC_BODY_BYTES) {
              send(413, { ok: false, error: { code: 'internal', message: 'request body too large' } })
              return
            }
            chunks.push(chunk as Buffer)
          }
          body = JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
        } catch {
          send(400, { ok: false, error: { code: 'internal', message: 'body must be JSON' } })
          return
        }
        const message = body as { endpoint?: unknown; payload?: unknown } | null
        if (message === null || typeof message !== 'object' || typeof message.endpoint !== 'string') {
          send(400, { ok: false, error: { code: 'internal', message: 'body must be { endpoint, payload? }' } })
          return
        }
        // dispatch 自身绝不抛错（见 rpc.ts）。
        send(200, await dispatchRpc(message.endpoint, message.payload))
```

</details>

**依据 3 · 源码核查**：[src/web-guard.ts:71-86](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/web-guard.ts#L71-L86)

fence缺席放行/抛错拒绝。

<details>
<summary>查看原文（16行）</summary>

```text
 *
 * A composition without the Connection service has no fence to apply and is let
 * through — the plugin must stay usable in minimal profiles. A fence that
 * *throws* is treated as a rejection: this is a security boundary, and failing
 * open would silently undo it.
 */
export function rejectWebRequest(
  fence: ConnectionFence | undefined,
  headers: IncomingMessage['headers'],
): 401 | 403 | undefined {
  if (fence === undefined) return undefined
  try {
    return fence.requestRejection({ headers })
  } catch {
    return 403
  }
```

</details>

**依据 4 · 源码核查**：[src/rpc.ts:242-259](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L242-L259)

owner/actor纯字符串比较与旧记录。

<details>
<summary>查看原文（18行）</summary>

```text
export function judgeActor(ownerSessionId: string | undefined, actorSession: string): ActorVerdict {
  if (actorSession === '') {
    return {
      ok: false,
      code: 'no-actor',
      message: 'this request carried no session identity — reload the page so the card can send one',
    }
  }
  // 没有 owner 的是早期数据：放行但标记为未绑定，调用方可以据此提示。
  if (ownerSessionId === undefined || ownerSessionId === '') return { ok: true, bound: false }
  if (ownerSessionId !== actorSession) {
    return {
      ok: false,
      code: 'foreign-owner',
      message: 'this review belongs to another session',
    }
  }
  return { ok: true, bound: true }
```

</details>

**依据 5 · 源码核查**：[src/rpc.ts:280-293](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L280-L293)

优先客户端stateRoot。

<details>
<summary>查看原文（14行）</summary>

```text
async function locateReview(
  ctx: Context,
  stateDir: string,
  reviewId: string,
  preferredRoot?: string,
): Promise<{ stateRoot: string; record: CrossfireRecord } | undefined> {
  const roots: string[] = []
  if (preferredRoot !== undefined && preferredRoot !== '') roots.push(preferredRoot)
  for (const root of candidateStateRoots(ctx, stateDir)) {
    if (!roots.includes(root)) roots.push(root)
  }
  for (const root of roots) {
    const record = await readRecord(root, reviewId)
    if (record !== undefined) return { stateRoot: root, record }
```

</details>

**依据 6 · 源码核查**：[src/rpc.ts:354-372](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L354-L372)

仅非空reviewId和body.session。

<details>
<summary>查看原文（19行）</summary>

```text
  const load = async (
    reviewId: string,
    session: string,
    preferredRoot?: string,
  ): Promise<{ stateRoot: string; record: CrossfireRecord }> => {
    if (reviewId === '') throw new Error('reviewId must not be empty')
    const located = await locateReview(ctx, stateDir, reviewId, preferredRoot)
    if (located === undefined) throw new Error(`no review "${reviewId}"`)
    const verdict = judgeActor(located.record.ownerSessionId, session)
    if (!verdict.ok) throw new Error(verdict.message)
    return located
  }

  return async (endpoint: string, payload: unknown): Promise<RpcResult> => {
    try {
      const body = (payload !== null && typeof payload === 'object' ? payload : {}) as Record<string, unknown>
      const session = typeof body.session === 'string' ? body.session : ''
      const reviewId = typeof body.reviewId === 'string' ? body.reviewId : ''
      const preferredRoot = typeof body.stateRoot === 'string' ? body.stateRoot : undefined
```

</details>

**依据 7 · 源码核查**：[src/rpc.ts:473-486](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L473-L486)

人表态JSON接口。

<details>
<summary>查看原文（14行）</summary>

```text
        /* ---------------- 表态（**只允许人从界面调用**） ---------------- */
        case 'crossfire/defect.setStatus': {
          const defectId = typeof body.defectId === 'string' ? body.defectId : ''
          if (defectId === '') return fail('payload must be { reviewId, defectId, status }')
          const status = body.status
          if (status !== 'pending' && status !== 'endorsed' && status !== 'rejected') {
            return fail('status must be "pending" | "endorsed" | "rejected"')
          }
          const rejectReason = typeof body.rejectReason === 'string' ? body.rejectReason : ''
          if (status === 'rejected' && rejectReason.trim() === '') {
            return fail('rejecting a defect requires a non-empty reject_reason (驳回必填理由)')
          }
          const located = await load(reviewId, session, preferredRoot)
          const changed = await setDefectStatus(located.stateRoot, reviewId, defectId, status, rejectReason)
```

</details>

#### 缺口

- 同版本宿主认证/会话绑定、provider toolFilter与文件范围没有真实运行证据。
  **影响：**不能给强人类身份、跨会话授权/只读沙箱验收。
  **进一步探讨：**可继续核宿主认证来源与provider过滤链，受控无权限/伪session/根外路径应明确拒绝。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 锁、持久化和历史复审有哪些恢复边界？

**研究主题：**工程质量与复用

#### 完整回答

record用同目录随机tmp+rename原子写，优先宿主atomic writer；每review进程内锁将读取/检查/变更/写串行。RPC collect锁内重读状态/转录，finish锁内按pass upsert历史，重复finish不叠相同pass，这是清楚的幂等设计。

锁是进程内，跨进程同文件可后写覆盖，原子写只防半文件不防丢更新；locks Map无清除键，长期review数量保留需测。readJson坏/缺/权限错误都undefined，readJsonLines读失败空items/malformed0，缺记录和不可读状态可混淆。坏JSONL行计数穿到engine.malformedLines，但RPC collect返回只collected/duplicates/noise/splitAttempts/recheck，没有透传malformedLines，UI调用者未必知道输入不全。

report先append transcript再mutateRecord charge/status，两文件不是事务，崩溃/并发边界可能留下已写发言而预算/状态未同步；预算检查在写前外层读，可能并发越上限。finish允许attacking/judging/settled且带pending快照，复审只从上一认定项构造，不是重新全量独立审计。

#### 证据与依据

**依据 1 · 源码核查**：[src/state.ts:43-56](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/state.ts#L43-L56)

进程内锁链。

<details>
<summary>查看原文（14行）</summary>

```text
 * 注意（已知限制，写在任务书里）：这是**进程内**锁，跨进程不互斥。多窗口同时
 * 操作同一场评审时，后写者覆盖前者，只靠原子写保证文件不会写坏。v0.1.0 接受。
 */
export async function withCrossfireLock<T>(key: string, operation: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve()
  const current = previous.then(operation, operation)
  locks.set(key, current.then(() => undefined, () => undefined))
  return current
}

/** 锁 key：同一场评审的操作互相串行。 */
export function reviewLockKey(stateRoot: string, reviewId: string): string {
  return `crossfire:${stateRoot}:${reviewId}`
}
```

</details>

**依据 2 · 源码核查**：[src/state.ts:105-118](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/state.ts#L105-L118)

atomic本地fallback。

<details>
<summary>查看原文（14行）</summary>

```text
  return hostAtomicWriter
}

/** Atomically publish a UTF-8 text file. */
export async function writeTextAtomic(file: string, text: string): Promise<void> {
  const hostWrite = await resolveHostWriter()
  if (hostWrite !== undefined) {
    await hostWrite(file, text)
    return
  }
  await mkdir(dirname(file), { recursive: true })
  const tmp = join(dirname(file), `.${randomUUID()}.tmp`)
  await writeFile(tmp, text, 'utf8')
  await rename(tmp, file)
```

</details>

**依据 3 · 源码核查**：[src/state.ts:149-154](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/state.ts#L149-L154)

坏/缺统一undefined。

```text
export async function readJsonFile<T>(file: string): Promise<T | undefined> {
  try {
    const text = await readFile(file, 'utf8')
    return JSON.parse(text) as T
  } catch {
    return undefined
```

**依据 4 · 源码核查**：[src/state.ts:177-195](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/state.ts#L177-L195)

读失败空、坏行计数。

<details>
<summary>查看原文（19行）</summary>

```text
export async function readJsonLines<T>(file: string): Promise<JsonLinesReport<T>> {
  let text: string
  try {
    text = await readFile(file, 'utf8')
  } catch {
    return { items: [], malformed: 0 }
  }
  const items: T[] = []
  let malformed = 0
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (trimmed === '') continue
    try {
      items.push(JSON.parse(trimmed) as T)
    } catch {
      malformed += 1
    }
  }
  return { items, malformed }
```

</details>

**依据 5 · 源码核查**：[src/engine.ts:311-317](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/engine.ts#L311-L317)

engine保留malformedLines。

```text
  return {
    added: kept,
    droppedDuplicates: dropped,
    skippedNoise,
    splitAttempts,
    alreadyCollected,
    malformedLines: input.malformed,
```

**依据 6 · 源码核查**：[src/rpc.ts:805-832](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L805-L832)

RPC collect不返回坏行计数。

<details>
<summary>查看原文（28行）</summary>

```text
    return await withCrossfireLock(reviewLockKey(stateRoot, reviewId), async () => {
      const current = await readRecord(stateRoot, reviewId)
      if (current === undefined) return fail(`no review "${reviewId}"`)
      if (current.status !== 'attacking' && current.status !== 'judging') {
        return fail(`review "${reviewId}" is "${current.status}" — cannot collect now`)
      }
      const transcript = await readTranscriptReport(stateRoot, reviewId)
      // 拆分阶段的有界并发上限住在 `reviewSplit` 里（engine 单点读取），
      // 因此这里不必单独传参 —— 工具侧读同一份配置，两边行为一致。
      const outcome = await collectDefects({
        record: current,
        transcript: transcript.items,
        malformed: transcript.malformed,
        llm,
        splitConfig: runtime.tools.reviewSplit,
      })
      // `collected` 报的是**真正追加的条数**，不是 `added.length`：并发的第二次调用
      // 一条都不该新增，报 added.length 会让用户看到"新增 3 条"而列表里一条没变。
      const appended = applyCollected(current, outcome.added)
      current.status = 'judging'
      await writeRecord(stateRoot, current)
      return ok({
        collected: appended,
        droppedDuplicates: outcome.droppedDuplicates,
        skippedNoise: outcome.skippedNoise,
        splitAttempts: outcome.splitAttempts,
        recheckRound: current.reviewPass > 1 && current.history.length > 0,
      })
```

</details>

**依据 7 · 源码核查**：[src/rpc.ts:843-868](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L843-L868)

锁内状态/历史upsert。

<details>
<summary>查看原文（26行）</summary>

```text
    return await withCrossfireLock(reviewLockKey(stateRoot, reviewId), async () => {
      const current = await readRecord(stateRoot, reviewId)
      if (current === undefined) return fail(`no review "${reviewId}"`)
      if (current.status !== 'judging' && current.status !== 'attacking' && current.status !== 'settled') {
        return fail(`review "${reviewId}" is "${current.status}" — cannot settle now`)
      }
      const snapshot: PassSnapshot = {
        pass: current.reviewPass,
        subject: current.subject.content,
        stanceText: current.stance.text,
        dimensions: [...current.dimensions],
        intensity: current.intensity,
        defects: current.defects.map((defect) => ({ ...defect })),
        finishedAt: Date.now(),
        ...(summary === '' ? {} : { revisedSummary: summary }),
      }
      // **同一 pass 在 history 里只能有一条**：已存在就原地更新它。重复定稿应当是一次
      // 幂等的更新（用户改完表态又点一次定稿是合法操作），而不是又叠一份快照 ——
      // 叠出来的历史会让复审把同一批旧账核对两遍，且先写的那份永远是最旧的。
      const existing = current.history.findIndex((item) => item.pass === current.reviewPass)
      if (existing >= 0) current.history[existing] = snapshot
      else current.history = [...current.history, snapshot]
      current.status = 'settled'
      current.settledAt = Date.now()
      await writeRecord(stateRoot, current)
      return ok({ settled: true, counts: countDefects(current) })
```

</details>

**依据 8 · 源码核查**：[src/tools.ts:753-780](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/tools.ts#L753-L780)

report读/check/append与charge分步。

<details>
<summary>查看原文（28行）</summary>

```text
      const record = await readRecord(located.stateRoot, located.reviewId)
      if (record === undefined) throw new Error(`no review "${located.reviewId}"`)
      assertBudget(record)

      const expert = record.experts.find((candidate) => candidate.childId === caller.id)
      const expertKey = expert?.key ?? 'unknown'
      const utterance: ExpertUtterance = {
        id: randomUUID(),
        expertKey,
        kind: 'speech',
        content: content.slice(0, 20_000),
        pass: record.reviewPass,
        ts: Date.now(),
      }
      await appendTranscript(located.stateRoot, located.reviewId, utterance)
      const charged = estimateTokens(utterance.content)
      const remaining = await mutateRecord(located.stateRoot, located.reviewId, (current) => {
        chargeTokens(current, utterance.content)
        if (expert !== undefined) {
          const target = current.experts.find((candidate) => candidate.childId === caller.id)
          if (target !== undefined) {
            target.status = 'done'
            // 实时记下"提交过几次"。`defectCount` 要等 collect 拆分后才有值，
            // 在此之前卡片必须能显示这位专家确实交了东西。
            target.reportCount = (target.reportCount ?? 0) + 1
          }
        }
        return Math.max(0, current.budget.maxTokens - current.budget.usedTokens)
```

</details>

#### 缺口

- 跨进程/崩溃在append与record写之间的恢复无故障注入轨迹。
  **影响：**不保证预算/发言和裁决多文件一致或跨进程无丢更新。
  **进一步探讨：**用同review双进程及固定断点核日志/record版本与可修复收据，不用真实评审材料。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动和评审流程需要什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22、DSH tools/subagents/agents/systemPrompt | 必需 | 主持/专家与工具 | 对应Harness rc.2基线 |
| connection认证栅栏 | Web安全前提 | 浏览器Host/Origin/auth | 组件把它可选，缺失会放行须停用Web面 |
| webServer/客户端slots | UI需要 | 卡片和RPC/state | 缺服务工具仍可降级，不等于UI验收 |
| LLM路由/provider | 专家必需、拆分可选 | 红队推理/拆缺陷 | 拆分缺失/失败有本地fallback |
| 可写workspace状态目录 | 持久化 | 记录/转录/导出 | 文件权限和多进程协调需核 |
| 人工事实核验与裁决时间 | 业务必需 | 逐项接受/驳回 | 专家票数不能当真值 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/宿主，核认证栅栏与单进程状态 | Git源码需构建lib，npm包另核 |
| 开题 | 明确subject/立场/维度/强度预算 | 真实目标不由模型虚构 |
| 攻击 | 小量专家先读材料 | 核child、路由、persona与只读toolFilter |
| 收集 | 从发言拆成pending | 噪声/维度fallback/坏行与缺报告需可见 |
| 裁决 | 人逐条核证据，拒绝写理由 | pending保留，不强行结论 |
| 定稿 | 核known flaws/未定项和历史 | settled不等于零风险 |
| 复审 | 对旧认定项核修复 | 不当新范围全量审计 |

本轮不运行作者测试、专家模型或浏览器验收。

#### 证据与依据

**依据 1 · 源码核查**：[compatibility.json:1-25](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/compatibility.json#L1-L25)

required/optional与rc.2基线。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "schemaVersion": 1,
  "recommendedHost": "0.2.0-rc.2",
  "previewTag": "next",
  "supportedHosts": [
    {
      "version": "0.2.0-rc.2",
      "track": "recommended"
    }
  ],
  "capabilities": {
    "required": [
      "tools",
      "subagents",
      "agents",
      "systemPrompt"
    ],
    "optional": [
      "connection",
      "llm",
      "webServer",
      "workspaceRegistry"
    ]
  },
  "baseline": {
```

</details>

**依据 2 · 源码核查**：[package.json:177-180](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/package.json#L177-L180)

Node条件。

```text
  "engines": {
    "node": ">=22.0.0"
  }
}
```

**依据 3 · 源码核查**：[src/index.ts:53-66](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/index.ts#L53-L66)

注入/专家上限/深度。

<details>
<summary>查看原文（14行）</summary>

```text
export const inject = ['tools', 'subagents', 'agents', 'systemPrompt']

/** 插件配置。 */
export interface Config {
  /** 评审状态目录名（相对会话工作区，默认 `.crossfire`）。 */
  stateDir?: string
  /** `ctx.subagents` 里用于拉起红队专家的 provider（默认 `spawn`）。 */
  memberProvider?: string
  /** 一场评审的专家数硬上限（默认 7，与固定维度池同宽）。 */
  maxExperts?: number
  /** 默认攻击强度档（默认 `standard`）。 */
  defaultIntensity?: 'quick' | 'standard' | 'deep'
  /** 专家子代理的委派深度上限（默认 1：专家不得再招人）。 */
  memberMaxDepth?: number
```

</details>

**依据 4 · 源码核查**：[src/rpc.ts:743-784](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L743-L784)

专家启动及状态。

<details>
<summary>查看原文（42行）</summary>

```text
      const experts = planExperts(current, runtime.tools.maxExperts, roster)
      const isRecheck = current.reviewPass > 1 && current.history.length > 0
      if (isRecheck && current.defects.length === 0) current.defects = buildRecheckItems(current)
      current.experts = experts
      current.status = 'attacking'
      // 先落一次盘再拉起：卡片立刻能看到 attacking + pending，而不必等所有子代理都
      // 起来（真实拉起是十秒级的），锁内的记录也因此始终与盘上一致。
      await writeRecord(stateRoot, current)

      const failures: string[] = []
      for (const expert of experts) {
        const controller = new AbortController()
        try {
          const childId = await spawnExpert(
            ctx,
            {
              provider: runtime.tools.memberProvider,
              ...(runtime.tools.memberMaxDepth === undefined ? {} : { maxDepth: runtime.tools.memberMaxDepth }),
              // 专家继承主持人时的生效路由：写回记录后卡片才能把"继承"画成真实品牌块
              // （否则头像永远是中性灰 `?`，这条是用户反馈的缺陷）。
              ...(runtime.tools.defaultProvider === undefined ? {} : { defaultProvider: runtime.tools.defaultProvider }),
              ...(runtime.tools.defaultModel === undefined ? {} : { defaultModel: runtime.tools.defaultModel }),
            },
            current,
            expert,
            agent,
            controller.signal,
            { maxTokens: defaults.expertMaxTokens, maxOpinions: defaults.expertMaxOpinions },
          )
          expert.childId = childId
          expert.status = 'running'
          registerExpertChild(childId, { stateRoot, reviewId })
        } catch (error: unknown) {
          expert.status = 'failed'
          expert.note = error instanceof Error ? error.message : String(error)
          failures.push(`${expert.key}: ${expert.note}`)
        }
      }
      // 写回的是**同一批对象**（`current.experts` 就是 `experts`），所以 childId、
      // status、以及 spawnExpert 落下的 persona 一并持久化。
      current.experts = experts
      await writeRecord(stateRoot, current)
```

</details>

**依据 5 · 源码核查**：[src/rpc.ts:836-868](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L836-L868)

定稿保快照。

<details>
<summary>查看原文（33行）</summary>

```text
  if (step === 'finish') {
    const summary = typeof body.summary === 'string' ? body.summary.trim() : ''
    // 状态门禁 + 追加历史 + 置 settled 全在同一个临界区里（A6）。
    //
    // 此前门禁在锁外、锁内的 `mutateRecord` 回调又不重校状态，于是并发两次 finish
    // 会各自追加一条**同一个 pass** 的 history 快照 —— "这一轮定稿"在历史里出现两次，
    // 复审时同一批旧账被核对两遍。
    return await withCrossfireLock(reviewLockKey(stateRoot, reviewId), async () => {
      const current = await readRecord(stateRoot, reviewId)
      if (current === undefined) return fail(`no review "${reviewId}"`)
      if (current.status !== 'judging' && current.status !== 'attacking' && current.status !== 'settled') {
        return fail(`review "${reviewId}" is "${current.status}" — cannot settle now`)
      }
      const snapshot: PassSnapshot = {
        pass: current.reviewPass,
        subject: current.subject.content,
        stanceText: current.stance.text,
        dimensions: [...current.dimensions],
        intensity: current.intensity,
        defects: current.defects.map((defect) => ({ ...defect })),
        finishedAt: Date.now(),
        ...(summary === '' ? {} : { revisedSummary: summary }),
      }
      // **同一 pass 在 history 里只能有一条**：已存在就原地更新它。重复定稿应当是一次
      // 幂等的更新（用户改完表态又点一次定稿是合法操作），而不是又叠一份快照 ——
      // 叠出来的历史会让复审把同一批旧账核对两遍，且先写的那份永远是最旧的。
      const existing = current.history.findIndex((item) => item.pass === current.reviewPass)
      if (existing >= 0) current.history[existing] = snapshot
      else current.history = [...current.history, snapshot]
      current.status = 'settled'
      current.settledAt = Date.now()
      await writeRecord(stateRoot, current)
      return ok({ settled: true, counts: countDefects(current) })
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 专家与收集的实际成本怎样解释？

**研究主题：**效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主/模型与构建依赖资源 | 设置维度、工作区/认证 | 内部API/构建兼容人工时间与费用未知 |
| 持续使用 | 多专家输入输出、可选拆分模型、UI轮询 | 人工裁决与专家结果审阅 | 文本估算预算非provider实际usage/金额 |
| 失败恢复 | 启动/坏日志/split fallback和状态恢复资源 | 核状态/预算差异，保留原件 | 无跨进程/多文件事务保证，恢复时间与费用未知 |

#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 多角度找问题 | 维度/专家persona与只读工具限制 | 多模型意见相关，不是独立事实验证 |
| 防结论混淆 | pending/endorsed/rejected与理由历史 | 受人判断/身份与记录可靠性影响 |
| 复核旧缺陷 | 同pass历史与recheck | 不覆盖新缺陷/新范围 |
| 控过程规模 | 专家maxTokens、文本/轮次预算 | 已说文本估算非全部输入/工具/拆分usage |

budget估算CJK0.6和其他非空0.3字符，源注释明确不是模型真实用量；report限20k后按已存文本charge。应另外记录模型输入/输出/缓存usage、专家数、拆分调用和人工耗时。不能把预算150k当平台费用硬上限，也不声称缺陷准确率或交付质量量化提高。

#### 证据与依据

**依据 1 · 源码核查**：[src/budget.ts:31-48](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/budget.ts#L31-L48)

文本估算非真实usage。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * 估算文本的 token 成本（粗估：CJK 0.6/字，其它非空白 0.3/字符，向上取整）。
 *
 * 口径与圆桌 `budget.ts` 的 `estimateTokens` **完全一致**（逐字符 `for...of`
 * 按码点遍历，`code >= 0x2e80` 记 CJK，空白不计入 other，最后 `Math.ceil`）。
 * 这是刻意照搬而不是重新设计：两个插件对同一段中文给出的预算数字必须可比。
 *
 * 再次强调：这是一个**已说出的文本长度估算**，不是模型真实用量。
 */
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

**依据 2 · 源码核查**：[src/tools.ts:759-780](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/tools.ts#L759-L780)

report截20k与charge。

<details>
<summary>查看原文（22行）</summary>

```text
      const utterance: ExpertUtterance = {
        id: randomUUID(),
        expertKey,
        kind: 'speech',
        content: content.slice(0, 20_000),
        pass: record.reviewPass,
        ts: Date.now(),
      }
      await appendTranscript(located.stateRoot, located.reviewId, utterance)
      const charged = estimateTokens(utterance.content)
      const remaining = await mutateRecord(located.stateRoot, located.reviewId, (current) => {
        chargeTokens(current, utterance.content)
        if (expert !== undefined) {
          const target = current.experts.find((candidate) => candidate.childId === caller.id)
          if (target !== undefined) {
            target.status = 'done'
            // 实时记下"提交过几次"。`defectCount` 要等 collect 拆分后才有值，
            // 在此之前卡片必须能显示这位专家确实交了东西。
            target.reportCount = (target.reportCount ?? 0) + 1
          }
        }
        return Math.max(0, current.budget.maxTokens - current.budget.usedTokens)
```

</details>

**依据 3 · 源码核查**：[src/members.ts:205-209](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/members.ts#L205-L209)

expert maxTokens约束。

```text
  const route = resolveExpertRoute(expert, config)
  const agentOptions: { provider?: string; model?: string; maxTokens?: number } = { ...route.agentOptions }
  if (limits.maxTokens !== undefined && limits.maxTokens > 0) {
    agentOptions.maxTokens = limits.maxTokens
  }
```

**依据 4 · 源码核查**：[src/engine.ts:235-255](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/engine.ts#L235-L255)

split模型与fallback额外成本。

<details>
<summary>查看原文（21行）</summary>

```text
  const collectOne = async (
    item: { utterance: ExpertUtterance; content: string },
    _index: number,
    activeLlm?: SplitLlmLike,
  ): Promise<{ lines: Awaited<ReturnType<typeof splitByMarkers>>; usedLlm: boolean }> => {
    if (activeLlm === undefined) return { lines: splitByMarkers(item.content, allowed), usedLlm: false }
    try {
      // 立场必须一路传到拆分器：提示词要它判断"是否打穿立场"，而此前它拿不到立场 ——
      // 于是 strikes_stance 恒为 false。记录里的 stance 就是唯一来源，不另开参数。
      const lines = await splitUtterance(
        activeLlm,
        input.splitConfig,
        item.utterance.expertKey,
        item.content,
        allowed,
        record.stance.text,
      )
      return { lines, usedLlm: true }
    } catch {
      return { lines: splitByMarkers(item.content, allowed), usedLlm: false }
    }
```

</details>

#### 缺口

- 没有相同材料下人工/单模型/多专家的真实缺陷召回、误报和总usage对照。
  **影响：**不能量化审查收益或预算金额。
  **进一步探讨：**固定匿名材料和人工核验事实表，盲评缺陷正确/新颖/重复，合计模型和人工成本。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 当前推荐与进一步探索从哪里入手？

**研究主题：**采用判断、新假设与验证

#### 完整回答

有条件试用。适合可信单人或同信任团队、已有稳定DSH子agent与connection认证、单进程状态目录且愿意逐条核证据的人。先小专家数/固定匿名成果，确认Web栅栏实际存在、owner/根参数边界和坏行可见，再用于真实方案；不把endorsed或settled当自动质量认证。缺connection的Web面不在此试用条件内。

进一步可探讨“证据与裁决版本收据”。每缺陷保原始发言/材料版本与证据定位、模型推断标签，人工决定绑定认证actor和预期record版本；追加发言与预算用可恢复事件日志，Web缺fence fail-closed并服务端绑定允许根/会话。这样保留人裁决流程，减少身份声明、坏行和丢更新造成的虚假确定性。

假设未实现。最小对照覆盖无fence/伪session/根外、坏行、report写后崩溃、并发finish与重开复审，比较未授权接受、错误历史、数据缺口可见、裁决复核时间和模型成本。若只增字段而不能提高读者回到原材料的成功率，不计有效创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/web-guard.ts:71-86](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/web-guard.ts#L71-L86)

failclosed方案基线。

<details>
<summary>查看原文（16行）</summary>

```text
 *
 * A composition without the Connection service has no fence to apply and is let
 * through — the plugin must stay usable in minimal profiles. A fence that
 * *throws* is treated as a rejection: this is a security boundary, and failing
 * open would silently undo it.
 */
export function rejectWebRequest(
  fence: ConnectionFence | undefined,
  headers: IncomingMessage['headers'],
): 401 | 403 | undefined {
  if (fence === undefined) return undefined
  try {
    return fence.requestRejection({ headers })
  } catch {
    return 403
  }
```

</details>

**依据 2 · 源码核查**：[src/rpc.ts:242-259](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L242-L259)

actor绑定方案基线。

<details>
<summary>查看原文（18行）</summary>

```text
export function judgeActor(ownerSessionId: string | undefined, actorSession: string): ActorVerdict {
  if (actorSession === '') {
    return {
      ok: false,
      code: 'no-actor',
      message: 'this request carried no session identity — reload the page so the card can send one',
    }
  }
  // 没有 owner 的是早期数据：放行但标记为未绑定，调用方可以据此提示。
  if (ownerSessionId === undefined || ownerSessionId === '') return { ok: true, bound: false }
  if (ownerSessionId !== actorSession) {
    return {
      ok: false,
      code: 'foreign-owner',
      message: 'this review belongs to another session',
    }
  }
  return { ok: true, bound: true }
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:753-780](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/tools.ts#L753-L780)

可恢复发言/预算方案基线。

<details>
<summary>查看原文（28行）</summary>

```text
      const record = await readRecord(located.stateRoot, located.reviewId)
      if (record === undefined) throw new Error(`no review "${located.reviewId}"`)
      assertBudget(record)

      const expert = record.experts.find((candidate) => candidate.childId === caller.id)
      const expertKey = expert?.key ?? 'unknown'
      const utterance: ExpertUtterance = {
        id: randomUUID(),
        expertKey,
        kind: 'speech',
        content: content.slice(0, 20_000),
        pass: record.reviewPass,
        ts: Date.now(),
      }
      await appendTranscript(located.stateRoot, located.reviewId, utterance)
      const charged = estimateTokens(utterance.content)
      const remaining = await mutateRecord(located.stateRoot, located.reviewId, (current) => {
        chargeTokens(current, utterance.content)
        if (expert !== undefined) {
          const target = current.experts.find((candidate) => candidate.childId === caller.id)
          if (target !== undefined) {
            target.status = 'done'
            // 实时记下"提交过几次"。`defectCount` 要等 collect 拆分后才有值，
            // 在此之前卡片必须能显示这位专家确实交了东西。
            target.reportCount = (target.reportCount ?? 0) + 1
          }
        }
        return Math.max(0, current.budget.maxTokens - current.budget.usedTokens)
```

</details>

**依据 4 · 源码核查**：[src/rpc.ts:843-868](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts#L843-L868)

版本收据/历史幂等基线。

<details>
<summary>查看原文（26行）</summary>

```text
    return await withCrossfireLock(reviewLockKey(stateRoot, reviewId), async () => {
      const current = await readRecord(stateRoot, reviewId)
      if (current === undefined) return fail(`no review "${reviewId}"`)
      if (current.status !== 'judging' && current.status !== 'attacking' && current.status !== 'settled') {
        return fail(`review "${reviewId}" is "${current.status}" — cannot settle now`)
      }
      const snapshot: PassSnapshot = {
        pass: current.reviewPass,
        subject: current.subject.content,
        stanceText: current.stance.text,
        dimensions: [...current.dimensions],
        intensity: current.intensity,
        defects: current.defects.map((defect) => ({ ...defect })),
        finishedAt: Date.now(),
        ...(summary === '' ? {} : { revisedSummary: summary }),
      }
      // **同一 pass 在 history 里只能有一条**：已存在就原地更新它。重复定稿应当是一次
      // 幂等的更新（用户改完表态又点一次定稿是合法操作），而不是又叠一份快照 ——
      // 叠出来的历史会让复审把同一批旧账核对两遍，且先写的那份永远是最旧的。
      const existing = current.history.findIndex((item) => item.pass === current.reviewPass)
      if (existing >= 0) current.history[existing] = snapshot
      else current.history = [...current.history, snapshot]
      current.status = 'settled'
      current.settledAt = Date.now()
      await writeRecord(stateRoot, current)
      return ok({ settled: true, counts: countDefects(current) })
```

</details>

#### 缺口

- 认证actor/记录版本、证据收据和可恢复事件方案未实现。
  **影响：**不计当前强身份/跨进程一致性或得分。
  **进一步探讨：**用故障/权限矩阵先核未授权拒绝和原材料复核率。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
