# @y9931666/dsh-plugin-roundtable

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1457f19](https://github.com/9931666/dsh-plugin-roundtable/tree/1457f19ad9358c41929e344ef0f8f7132b3f26fc)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9931666/dsh-plugin-roundtable) [![npm 30d 1,570](https://img.shields.io/static/v1?label=npm+30d&message=1%2C570&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable) [![最新发布 2026-10-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable)
<!-- END META -->

> **功能**：把DSH会话组织为可视化专家圆桌，支持持久子代理、协作发言、红队评审和人类决策。

> **亮点**：把原生子代理调用组织成有状态、可讨论和可导出的评审流程；不是独立知识或正确共识保证。见 [Q01](#research-q01)。

> **主要限制**：发言粗估熔断不等真实账单硬上限，结构化证据和人类支持也不等已复现缺陷；复审授权布尔值和进程内锁有明确边界。见 [Q03](#research-q03)。

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
  - [Q01 · 圆桌相对原生子代理和人工评审增加什么？](#detail-section-11)
  - [Q02 · 专家、会议记录和复审如何接起来？](#detail-section-12)
  - [Q03 · 预算熔断与证据标签真正保证到哪里？](#detail-section-13)
  - [Q04 · 会议流程的首次、持续和失败恢复负担是什么？](#detail-section-14)
  - [Q05 · 哪些设计可借鉴，当前怎样试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合确有不同视角与人工裁决需要的方案评审，合格观点须有独立可核查依据。单模型/人工基线见 [Q01](#research-q01)。

原生子代理、单模型自审和人工评审；多角色/共识与导演解释不作正确性或内部推理透明证明。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 持久专家节点 | 多轮继续讨论 | 宿主子代理/模型可用性 |
| 会议协作与汇聚 | 组织发言和关系 | 图例/连线不必然真实执行路径 |
| 红队评审 | 保存方案、拆观点和复审 | 证据真实性仍需核实 |
| 人类表态 | 采纳/驳回及理由 | 决策记录不等缺陷事实 |
| 预算/状态 | 限制轮数及发言量 | 不是真实账单硬上限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH tools/subagents/agents/systemPrompt | 必需 | 工具/专家/提示 | 插件可能等待或不可用 |
| 可用模型与真实预算限制 | 专家工作必需 | 多轮与拆分调用 | 失败/费用需操作者控制 |
| 可写工作区状态目录 | 持久会议必需 | 记录与复审 | 写入失败需核部分状态 |
| userQuestions/Skill服务 | 可选 | 卡片/技能 | 降级，不能假定全部UI能力 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户定义非敏感议题、真实额度和验收 | 不以节点数作为目标 |
| 2 | 主持建会并选少量专家 | 角色与实际模型可核 |
| 3 | 收集观点、回源核证并人类表态 | 结构标签不代替复现 |
| 4 | 修订/导出并核总费用和后台 | 无新增价值即停止扩员 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型配置、状态磁盘和全局提示 | 定义议题、角色和验收标准 | 配置时间未知 |
| 持续使用 | 主持/专家历史、工具与观点拆分调用 | 核证据、表态、修订 | 发言粗估不等真实账单 |
| 失败恢复 | 重发/重启与部分状态 | 核节点、记录、已执行副作用 | 无跨进程/多文件事务保证 |
| 退出迁移 | 会议导出与状态保存 | 停止扩员、确认后台与未决项 | 关闭会议不撤销外部副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 协作组织 | 持久节点、主持权限与记录 | 相对单模型真缺陷增益 |
| 评审闭环 | 历史、去重和三态表态 | 观点真实性/修订正确性 |
| 成本控制 | 轮数/发言粗估熔断 | 全调用现金硬预算 |

> **思考**：发言粗估熔断不等真实账单硬上限，结构化证据和人类支持也不等已复现缺陷；复审授权布尔值和进程内锁有明确边界。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把原生子代理调用组织成有状态、可讨论和可导出的评审流程；不是独立知识或正确共识保证。见 [Q01](#research-q01)。

新鲜状态权限核对、覆盖保护和恢复出口可复用；真实成本、证据验证和多状态一致性需要额外契约。见 [Q03](#research-q03) 与 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

发言粗估熔断不等真实账单硬上限，结构化证据和人类支持也不等已复现缺陷；复审授权布尔值和进程内锁有明确边界。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议2–3专家和非敏感方案小范围试用，另设真实供应商额度并独立验收；观点重复或预算无法解释时停止扩员。具体流程见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

会议/评审组织机制有源码支持；缺陷质量、真实总预算和并发恢复未独立验证；边际增益策略是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tools.ts、src/members.ts、src/budget.ts、src/state.ts、src/rpc.ts、src/proxy-thinking.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定入口、持久节点创建/消息、主持人锁、预算、观点收集、复审历史和RPC表态；未逐项审阅全部拓扑/模型路由/导出/网络安全实现，未运行会议。
- 下一步：已检查源码；未执行目标会议、模型调用、作者测试或真实宿主验收。

**分析版本**

- **仓库**：[9931666/dsh-plugin-roundtable](https://github.com/9931666/dsh-plugin-roundtable)
- **版本号**：1.0.0-rc.5（[固定提交 1457f19](https://github.com/9931666/dsh-plugin-roundtable/tree/1457f19ad9358c41929e344ef0f8f7132b3f26fc)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为按证据独立性与观点边际增益决定追加评审，以减少重复发言和预算浪费；同现金预算对照及否定条件见 [Q05](#research-q05)。

已检查源码；未执行目标会议、模型调用、作者测试或真实宿主验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 1935 | — | — | 32429 |
| .mjs | source | 7 | 1387 | 1016 | 248 | — |
| .ts | source | 30 | 8156 | 5985 | 1754 | — |
| .tsx | source | 5 | 3125 | 2689 | 305 | — |
| .mjs | test | 18 | 2099 | 1691 | 210 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/9931666/dsh-plugin-roundtable/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/9931666/dsh-plugin-roundtable/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对可视化圆桌的持久专家、评审/人类表态和预算边界，区分过程与真实效果。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 圆桌相对原生子代理和人工评审增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是方案存在不同专业视角或需要红队复核、用户愿意承担汇总和决策的DSH任务。合格结果是可回指依据的独立观点、明确采纳/驳回和修订说明，而不是图上节点多或模型达成共识。相对逐次调用原生子代理与手工汇总，增量在会议状态、专家节点、连线、结构化评审与人类表态的组合；专家仍使用宿主子代理能力，角色提示不保证知识独立。README的代理思考是导演生成的说明/参数规划，不能视为黑盒工作模型内部推理或忠实性证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-50](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/README.md#L18-L50)

作者定义会议、协作、评审和导出流程。

<details>
<summary>查看原文（33行）</summary>

```text
> 你只负责抛出议题。DeepSeek 成为主持人，在拓扑图上拉起一圈专家节点，用带箭头的连线组织协作，经过汇聚网关汇总，遇到分歧时把决策权交还给你。

## 特性

### 会议组织
| 能力 | 说明 |
| --- | --- |
| **左主持 + 右圆桌拓扑** | 会话视图新增「圆桌会议」Tab：左侧主持人锚点、右侧环形专家节点、中央汇聚网关，连线带方向箭头，开会过程全程可视化。 |
| **持久子代理专家** | 每位专家都是独立可续聊的子代理，带着《全局协作总纲》（目标 / 角色边界 / 协作协议 / 安全红线）入会，可指定不同厂商模型。 |
| **可视化连线** | 悬停节点拖拽「＋」拉出连线；右键连线切换单向/双向通道或删除；双向通道两端各有一个箭头。 |
| **厂商 Logo 头像** | 专家头像显示真实厂商 Logo（DeepSeek / GLM / z.ai / Gemini / Claude / Kimi / MiniMax / 千问），未收录厂商自动回退为"品牌色块 + 缩写"。logo 图片可自行替换 `src/client/assets/logos/` 后重跑 `node scripts/generate-logos.mjs` 再构建。 |
| **状态呼吸灯** | 专家工作时节点边缘呼吸灯闪烁——纯 CSS 状态反馈，不消耗任何 Token。 |
| **画布图例（模式语义）** | 画布左上角写明「这张图在当前模式下怎么读」：主持人统筹=逐次派发、多模型平等=专家直达互辩、针锋相对=只挑毛病；系统补出来的骨架通道会标注「虚线 = 骨架通道，不是真实流转」。同一张图在三种模式下含义不同，图例把它写在图上是刻意的——不写清楚，用户会把它读成一张控制流程的路径图。**图例右上角有叉号可关闭**（关闭状态写进全局偏好，刷新后依然是关的）；随时可在设置页「画布图例」里重新打开——关掉必须还能找回来，否则"删除"就成了单向操作。 |
| **节点状态如实显示** | 节点直接显示持久子代理的真实状态：**工作中 / 空闲 / 就绪 / 未唤醒 / 宿主失联 / 已退出**（悬停可看完整说明）。刻意**不发明**「已完成 / 已失败」——子代理跑完一轮回到空闲，仍可被再次唤醒，说它"结束了"是错的。状态词刻意取短：节点只有 68px 宽，长标签会换行、溢出圆形卡片（`就绪（可唤醒）` 就这么翻过车），所以语义细节交给悬停提示，标签本身强制单行省略号。 |

### 协作与辩论
| 能力 | 说明 |
| --- | --- |
| **双协作模式 + 红队模式** | 「主持人统筹」一切经由主持人转达；「多模型平等」专家直达互辩，超预算自动闭麦；「针锋相对」专家只对定稿方案挑毛病。设置里切换，平等模式强制要求安全限制。 |
| **汇聚网关** | 所有发言经过确定性结构化归并，主持人一键拉取摘要，上下文不被十份报告淹没。 |
| **代理思考** | 黑盒干活模型（视频/图片生成等）也有透明思考链：导演模型先写 `[DeepSeek 代理思考]` 再翻译参数，UI 全程标注 `[渲染中]`。 |
| **人类决策卡片** | 专家分歧或需要拍板时，主持人发起决策、会议暂停，你来选方案 A / B 或自定义输入。 |

### 针锋相对评审
| 能力 | 说明 |
| --- | --- |
| **评审全流程** | 定稿方案 → `roundtable_start_review` 记录"问题 + 方案"（首轮 reviewPass=1）→ 拉红队专家（只挑毛病、不给替代方案）→ `roundtable_collect_review` 收集观点 → Web 评审弹窗自动打开。 |
| **逐条三态表态** | 每个观点独立一张卡片，可单独「支持 / 驳回 / 取消」（三态互切，支持可取消）；**驳回必填理由**（C2，无理由拒绝提交，理由计入 user-action 供主持人修订对照）；已认定数只计「支持」，缺陷进入下一轮方案修改。 |
| **观点证据分级** | 拆分时按观点给出证据（C1）：代码/bug 类附**可复现步骤**（`repro`），设计类缺陷附**论证链**（`argument`，不强制伪复现）；观点卡按类型展示证据徽标。 |
| **闭环复审（最多 3 轮）** | 用户表态 + 主持人修订后，`roundtable_finish_review` 结束本轮（落 `done` 并附修订说明）；再开下一轮复审（reviewPass+1，只核对旧缺陷是否修复）。`maxReviewPass=3`（首轮 + 最多复审 2 次），超上限继续须用户显式批准（C3，杜绝无限循环）。 |
| **影响概览** | 评审弹窗顶部显示已认定/已驳回/未表态计数；认定数 ≥ 3 提示"建议重新协商方案"（C4）。 |
| **Markdown 导出** | `roundtable_export_review` 把全部轮次/观点/表态/驳回理由/修订对照导出为一份交付物（C5），可留存或贴入 GitHub issue。 |
| **观点自动拆分** | 专家一条发言自动拆成多条独立观点，每条带维度标签 + 原文引用 + 观点序号 + 证据；拆分 LLM 优先，失败自动降级为本地按「观点 N」段落结构切分（零 token，不会整段糊在一起）。 |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:4-11](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/index.ts#L4-L11)

宿主子代理与拓扑接线。

```text
 * A host-plane plugin that registers the `roundtable_*` tools and one usage
 * section into the global system prompt. After installation any session can
 * run a visualized round-table meeting through natural language: the model
 * creates a meeting (it becomes the captain), adds expert nodes as durable
 * continuable subagents, wires directed edges, collects contributions through
 * the aggregation gateway, and asks the human when a decision is needed.
 * The Web GUI shows the meeting as a topology tab via the `conversation.view`
 * slot, fed by the `/plugins/dsh-plugin-roundtable/state` snapshot route.
```

**依据 3 · 源码核查**：[src/proxy-thinking.ts:1-6](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/proxy-thinking.ts#L1-L6)

导演说明与工作模型分开的模块定义。

```text
/**
 * Proxy Thinking (代理思考): when a black-box worker model (no visible
 * reasoning) must execute a task, the director model (DeepSeek) first writes
 * its own reasoning as `[DeepSeek 代理思考]`, then translates the goal into
 * exact worker parameters. The UI prefixes stages with
 * `[DeepSeek 代理思考]` / `[<worker> 渲染中]`.
```

#### 缺口

- 独立观点质量和多Agent相对单模型评审增益未知
  **影响**：不能把观点数量/一致意见当正确性
  **进一步探讨**：固定含已知缺陷方案，比较单模型自审、独立单次评审与圆桌，在相同总预算盲审真缺陷和误报

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 专家、会议记录和复审如何接起来？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口注册roundtable工具和全局使用提示，必需tools/subagents/agents/systemPrompt；可选问题卡和Skill服务缺失会降级而非整体等待。节点经宿主startActivation或旧startContinuable创建，后续通过sendMessage排入下一轮，失败返回false由调用方处理。主持人操作在会议锁内重读记录、核captain身份与预算。评审开始保存question/plan和轮次，已有未done记录拒绝覆盖；收集用utteranceId去重，优先LLM拆观点，失败按本地标记再整条兜底。用户三态表态写回，驳回理由必填。这些建立审阅状态链，未保证每条观点证据真实。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:49-67](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/index.ts#L49-L67)

必要和可选宿主能力。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * REQUIRED services only — and the list is load-gating, which is why it is
 * short. cordis has no "optional inject" form (`Inject` is `string[] | Record`
 * and the record form is only intercept config), so every name listed here
 * keeps the whole plugin fiber PENDING until that service exists: no
 * `roundtable_*` tools, no `/plugins/dsh-plugin-roundtable/*` routes and no GUI
 * tab. A missing OPTIONAL capability listed here therefore presents to the user
 * as "圆桌会议整个不见了 / 无法调用界面" with no error anywhere.
 *
 * `userQuestions` and `skills` are deliberately NOT listed: both are optional
 * capabilities that the plugin reads live through `ctx.get(...)`:
 *   - skills.ts hard constraint #1 — the plugin MUST load in a profile without
 *     the skill service and degrade to an empty catalog;
 *   - tools.ts falls back to `decision: 'unavailable'` when the userQuestions
 *     service is absent (the captain then states the draft in words).
 * v0.2.36 removed both from this list; v0.2.21 had already fixed the mirrored
 * over-constraint on the browser half (`connection`).
 */
export const inject = ['tools', 'subagents', 'agents', 'systemPrompt']
```

</details>

**依据 2 · 源码核查**：[src/members.ts:224-269](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/members.ts#L224-L269)

持久专家创建及后续消息。

<details>
<summary>查看原文（46行）</summary>

```text
  if (typeof subagents.startActivation === 'function') {
    request.prompt = [...prompt, { type: 'text', text: persona }]
    const started = await subagents.startActivation({
      provider: config.provider,
      label,
      request,
      signal,
      delivery: 'parent',
    })
    childId = started.childId
  } else if (typeof subagents.startContinuable === 'function') {
    const started = await subagents.startContinuable({
      provider: config.provider,
      label,
      request: { ...request, persona, toolFilter: nodeToolRestriction(delivery) },
      signal,
    })
    childId = started.childId
  } else {
    throw new Error('roundtable: the host exposes neither startActivation (0.2.1+) nor startContinuable (older) — cannot spawn a node')
  }
  node.id = String(childId)
}

/**
 * Deliver one message to a node as its next FIFO turn. Best effort: a failure
 * is logged and reported as `false` so the caller can decide.
 */
export async function deliverToNode(
  ctx: Context,
  captain: Agent,
  childId: string,
  text: string,
  signal: AbortSignal,
): Promise<boolean> {
  try {
    await ctx.subagents.sendMessage(
      captain,
      childId as SessionId,
      [{ type: 'text', text }],
      { signal },
    )
    return true
  } catch (error: unknown) {
    ctx.logger.warn(`roundtable: followup to node ${childId} failed: ${String(error)}`)
    return false
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:159-175](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/tools.ts#L159-L175)

锁内重读、主持人和预算门。

<details>
<summary>查看原文（17行）</summary>

```text
/** Lock + captain-permission gate + budget gate: the inner captain-tool boilerplate. */
async function withCaptainLock<T>(
  stateRoot: string,
  meetingId: string,
  captainId: string,
  action: string,
  operation: (fresh: Meeting) => Promise<T>,
  options: { allowMuted?: boolean } = {},
): Promise<T> {
  return withMeetingLock(meetingLockKey(stateRoot, meetingId), async () => {
    const fresh = await readMeeting(stateRoot, meetingId)
    if (fresh === undefined || fresh.captainSessionId !== captainId) {
      throw new Error(`only the captain of meeting "${meetingId}" may ${action}`)
    }
    assertUsable(fresh, options)
    return operation(fresh)
  })
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:1322-1355](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/tools.ts#L1322-L1355)

覆盖保护和复审历史。

<details>
<summary>查看原文（34行）</summary>

```text
      return withCaptainLock(stateRoot, located.id, captain.id, 'start a review', async (fresh) => {
        // S1 覆盖保护：进行中的评审（含已支持/驳回记录）不允许被静默覆盖。
        const existing = await readReview(stateRoot, fresh.id)
        if (existing !== undefined && existing.status !== 'done') {
          throw new Error(`a review is already in progress (status ${existing.status}) — finish it before starting a new pass`)
        }
        // 复审轮次（C3）：上一轮已 done → reviewPass+1；超上限须用户显式批准。
        const previousPass = existing?.status === 'done' && typeof existing.reviewPass === 'number' ? existing.reviewPass : 0
        const reviewPass = previousPass + 1
        const maxReviewPass = existing?.maxReviewPass ?? 3
        if (reviewPass > maxReviewPass && args.user_approved_extra_pass !== true) {
          throw new Error(`re-review cap reached (pass ${reviewPass} > max ${maxReviewPass}) — ask the user to approve continuing, then retry with user_approved_extra_pass=true, or export and finish the review`)
        }
        const now = Date.now()
        const review: ReviewRecord = {
          meetingId: fresh.id,
          question,
          plan,
          status: 'reviewing',
          reviewPass,
          maxReviewPass,
          schemaVersion: 2,
          viewpoints: [],
          startedAt: now,
          updatedAt: now,
          // 保留上一轮快照（闭环核对"旧缺陷是否修复"的依据）。
          history: existing?.status === 'done' ? [...(existing.history ?? []), {
            pass: existing.reviewPass,
            question: existing.question,
            plan: existing.plan,
            viewpoints: existing.viewpoints,
            finishedAt: existing.finishedAt ?? now,
          }] : [],
        }
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:1385-1433](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/tools.ts#L1385-L1433)

按发言去重与多层观点拆分。

<details>
<summary>查看原文（49行）</summary>

```text
      return withCaptainLock(stateRoot, located.id, captain.id, 'collect review', async (fresh) => {
        const review = await readReview(stateRoot, fresh.id)
        if (review === undefined) throw new Error('no review in progress — call roundtable_start_review first')
        // 幂等键 = utteranceId 集合（观点拆分后 viewpoint.id 已变，不能用作去重）。
        const collectedUtteranceIds = new Set(review.viewpoints.map((viewpoint) => viewpoint.utteranceId))
        const utterances = await readTranscript(stateRoot, fresh.id)
        const llm = ctx.get('llm') as SplitLlmLike | undefined
        const splitConfig = config.reviewSplit
        let collected = 0
        let splitAttempts = 0
        for (const utterance of utterances) {
          if (utterance.nodeKey === CAPTAIN_KEY) continue
          if (utterance.kind !== 'speech' && utterance.kind !== 'proxy-thinking') continue
          if (utterance.ts < review.startedAt) continue
          if (collectedUtteranceIds.has(utterance.id)) continue
          const content = utterance.content.replace(/\s+/g, ' ').trim()
          if (content === '') continue // 空发言跳过
          // 观点拆分（三道防线）：LLM 优先，任何失败 → 本地启发式兜底（零 token）→ 仍失败则整条兜底（seq=0）。
          let lines: Awaited<ReturnType<typeof splitUtterance>> | null = null
          if (llm !== undefined && splitConfig !== undefined) {
            try {
              lines = await splitUtterance(llm, splitConfig, utterance.nodeKey, content)
              splitAttempts += 1
            } catch {
              lines = null
            }
          }
          if (lines === null) {
            // 无 LLM 或 LLM 拆分失败：按「观点 N（…）」段落结构本地切分，保证观点逐条可认定。
            try {
              lines = splitByMarkers(content)
            } catch {
              lines = null
            }
          }
          if (lines !== null && lines.length > 0) {
            lines.forEach((line, index) => {
              review.viewpoints.push({
                id: `${utterance.id}#${index + 1}`,
                utteranceId: utterance.id,
                nodeKey: utterance.nodeKey,
                content: line.content,
                status: 'pending',
                quote: line.quote,
                dimension: line.dimension,
                evidence: line.evidence,
                ts: utterance.ts,
                seq: index + 1,
              })
```

</details>

**依据 6 · 源码核查**：[src/rpc.ts:472-486](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/rpc.ts#L472-L486)

三态及驳回理由检查。

<details>
<summary>查看原文（15行）</summary>

```text
            // V0.2.2 三态：pending/endorsed/rejected 可互切（支持可取消、驳回）。
            // 驳回必填理由（C2）：payload.reject_reason 非空，由 setViewpointStatus 强制。
            const body = payload as { meetingId?: unknown; viewpointId?: unknown; status?: unknown; reject_reason?: unknown } | undefined
            const meetingId = typeof body?.meetingId === 'string' ? body.meetingId : ''
            const viewpointId = typeof body?.viewpointId === 'string' ? body.viewpointId : ''
            const status = body?.status
            if (meetingId === '' || viewpointId === '') return fail('payload must be { meetingId, viewpointId, status }')
            if (status !== 'pending' && status !== 'endorsed' && status !== 'rejected') {
              return fail('status must be "pending" | "endorsed" | "rejected"')
            }
            const rejectReason = typeof body?.reject_reason === 'string' ? body.reject_reason : undefined
            if (status === 'rejected' && (rejectReason === undefined || rejectReason.trim() === '')) {
              return fail('rejecting a viewpoint requires a non-empty reject_reason (驳回必填理由)')
            }
            return applyViewpointStatus(runtime, meetingId, viewpointId, status, rejectReason)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预算熔断与证据标签真正保证到哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心质疑是过程量被误认成质量和现金预算。usedTokens在发言落地时按内容粗估累加，budgetExceeded依据此值和会议轮数，不含系统提示、历史、工具和所有调用成本；provider实报用量作为旁路观察，不改变熔断。因此设置max_tokens不能当现金硬上限，检查发生于新工作前也不能保证单次调用不越出剩余额度。观点的repro/argument来自模型输出结构，并非系统自动复现；人类支持仍是决策记录而非缺陷已证实。额外复审许可靠调用参数user_approved_extra_pass布尔值，代码没有独立用户凭据，须遵守真实授权。多进程状态锁也只是process-local，单文件原子写不等跨进程或多文件事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:248-259](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/tools.ts#L248-L259)

只按发言文本计数后落盘。

<details>
<summary>查看原文（12行）</summary>

```text
  if (options.opensNewRound === true) beginRound(meeting)
  await assertUsablePersisting(stateRoot, meeting)
  const full: MeetingUtterance = {
    ...utterance,
    id: randomUUID(),
    round: meeting.round,
    ts: Date.now(),
  }
  meeting.budget.usedTokens += estimateTokens(full.content)
  meeting.updatedAt = Date.now()
  await appendUtterance(stateRoot, meeting.id, full)
  await writeMeeting(stateRoot, meeting)
```

</details>

**依据 2 · 源码核查**：[src/budget.ts:9-14](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/budget.ts#L9-L14)

熔断使用的实际轴。

```text
export function budgetExceeded(meeting: Meeting): 'rounds' | 'tokens' | undefined {
  // 设 N 轮就能开 N 轮：`round` 是"已开启的轮次"，只有想开第 N+1 轮时才触顶。
  // （旧口径 `>=` 会让 maxRounds=10 实际只能开 9 轮——对面向用户的设置项不直觉。）
  if (meeting.round > meeting.budget.maxRounds) return 'rounds'
  if (meeting.budget.usedTokens >= meeting.budget.maxTokens) return 'tokens'
  return undefined
```

**依据 3 · 源码核查**：[src/budget.ts:75-84](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/budget.ts#L75-L84)

粗估公式。

<details>
<summary>查看原文（10行）</summary>

```text
/** Estimate the token cost of a text (coarse: ~0.6 tokens per CJK char, ~0.3 per latin). */
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

**依据 4 · 源码核查**：[src/tools.ts:1110-1123](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/tools.ts#L1110-L1123)

真实用量只缓存观察，不影响熔断。

<details>
<summary>查看原文（14行）</summary>

```text
      // 第 3 批：真实用量（provider 上报）。既作为派生输出，也 best-effort
      // 缓存回 `meeting.budget.usedTokensReal`，供快照与导出读取；熔断口径
      // 完全不受影响（仍走 usedTokens）。
      const realUsage = meetingRealUsage(
        ctx,
        meeting.nodes.filter((node) => node.status !== 'removed' && node.id !== '').map((node) => node.id),
      )
      if (realUsage.measuredSessions > 0 && meeting.budget.usedTokensReal !== realUsage.measuredTotal) {
        try {
          await withMeetingLock(meetingLockKey(stateRoot, meeting.id), async () => {
            const fresh = await readMeeting(stateRoot, meeting.id)
            if (fresh === undefined) return
            fresh.budget.usedTokensReal = realUsage.measuredTotal
            await writeMeeting(stateRoot, fresh)
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:1328-1334](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/tools.ts#L1328-L1334)

额外轮次只检查调用者传入布尔值。

```text
        // 复审轮次（C3）：上一轮已 done → reviewPass+1；超上限须用户显式批准。
        const previousPass = existing?.status === 'done' && typeof existing.reviewPass === 'number' ? existing.reviewPass : 0
        const reviewPass = previousPass + 1
        const maxReviewPass = existing?.maxReviewPass ?? 3
        if (reviewPass > maxReviewPass && args.user_approved_extra_pass !== true) {
          throw new Error(`re-review cap reached (pass ${reviewPass} > max ${maxReviewPass}) — ask the user to approve continuing, then retry with user_approved_extra_pass=true, or export and finish the review`)
        }
```

**依据 6 · 源码核查**：[src/state.ts:1-31](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/state.ts#L1-L31)

持久化与进程内锁边界。

<details>
<summary>查看原文（31行）</summary>

```text
/**
 * RoundTable durable state: atomic file persistence under
 * `<workspace>/<stateDir>/<meetingId>/` with per-meeting process-local locks.
 *
 * - `meeting.json`     — the Meeting record (nodes, edges, decisions, budget).
 * - `transcript.jsonl` — append-only utterance log (torn-tail tolerant on read).
 * - `review.json`      — 针锋相对评审记录（议题/方案/观点/支持标记）。
 * - `user-actions.jsonl` — UI 行为记录（主持人下轮执行）。
 * - `kb-digest.json`   — 知识库摘要缓存（C2：命中即免去重读）。
 * @module dsh-plugin-roundtable/state
 */

import { appendFile, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'
import type { FeedbackEntry, KbDigestEntry, KbDigestFile, Meeting, MeetingUtterance, ReviewRecord, UserAction } from './types.ts'

/** Stable directory id from a display name (keeps CJK, lowercases latin). */
export function sanitizeKey(value: string): string {
  const cleaned = value.trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-+|-+$/g, '')
  return cleaned === '' ? 'meeting' : cleaned
}

/** Process-local mutex chain keyed by an arbitrary lock key. */
const locks = new Map<string, Promise<unknown>>()

/** Serialize async operations sharing one key inside this process. */
export async function withMeetingLock<T>(key: string, operation: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve()
  const current = previous.then(operation, operation)
  locks.set(key, current.then(() => undefined, () => undefined))
```

</details>

#### 缺口

- 真实总支出、跨模型相关误报与跨进程并发未验证
  **影响**：不能宣称硬预算、安全放行或共识正确
  **进一步探讨**：同预算缺陷集核所有模型调用/工具/提示成本，并注入并发保存与未证实观点检查行为

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 会议流程的首次、持续和失败恢复负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要固定兼容DSH、持续子代理服务、所选模型接入与可写工作区状态目录；Web拓扑另依赖客户端槽和连接能力。全局usage提示会增加所有会话的可见规则，专家persona、历史、知识库摘要和观点拆分均可能增加模型支出。人类仍需读观点、鉴别证据、决定驳回/采纳并验收修改。失败时节点不在线、发信失败或状态写入只完成一部分都需要核对记录与宿主子代理，不应看到空闲就当业务结束。关闭会议和导出是状态管理，不能假定取消已产生的工具副作用或所有后台请求。没有真实同条件任务成本，不能宣称多模型讨论更便宜或更可靠。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:75-79](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/package.json#L75-L79)

固定宿主基线。

```text
    "test": "node --test test/",
    "test:inline": "node --test --test-isolation=none \"test/*.test.mjs\"",
    "prompt:budget": "node scripts/prompt-budget.mjs",
    "build": "tsc -p tsconfig.json --noEmit && tsc -p tsconfig.client.json --noEmit && tsdown -c tsdown.config.ts && tsc -p tsconfig.json --emitDeclarationOnly && tsc -p tsconfig.client.json --emitDeclarationOnly",
    "bundle:client": "tsdown -c tsdown.config.ts",
```

**依据 2 · 源码核查**：[src/index.ts:67-91](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/index.ts#L67-L91)

必需服务与默认状态目录/节点限制。

<details>
<summary>查看原文（25行）</summary>

```text
export const inject = ['tools', 'subagents', 'agents', 'systemPrompt']

/** Plugin configuration. */
export interface Config {
  /** State directory name under the captain's workspace (default `.roundtable`). */
  stateDir?: string
  /** `ctx.subagents` provider used to spawn nodes (default `spawn`). */
  memberProvider?: string
  /** Meeting size cap in nodes (default `8`). */
  maxNodes?: number
  /** Default collaboration mode (default `orchestrated`; `redteam` = 针锋相对评审). */
  defaultMode?: 'orchestrated' | 'egalitarian' | 'redteam'
  /** Node delegation depth cap (default `1`). */
  memberMaxDepth?: number
  /** Prompt-section order for the usage policy (default `116`). */
  promptSectionOrder?: number
}

export const Config: z<Config> = z.object({
  stateDir: z.string().default('.roundtable'),
  memberProvider: z.string().default('spawn'),
  maxNodes: z.natural().min(1).default(8),
  defaultMode: z.union(['orchestrated', 'egalitarian', 'redteam']).default('orchestrated'),
  memberMaxDepth: z.natural().default(1),
  promptSectionOrder: z.natural().default(116),
```

</details>

**依据 3 · 源码核查**：[src/index.ts:111-117](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/index.ts#L111-L117)

全局usage提示注册。

```text
  // Usage policy into the global system prompt. The text lives in prompt.ts so
  // that test/prompt-budget.test.mjs can assert its size.
  ctx.systemPrompt.section({
    name: 'roundtable:usage',
    order: config.promptSectionOrder ?? 116,
    text: usageSectionText(),
  })
```

**依据 4 · 源码核查**：[src/members.ts:252-278](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/members.ts#L252-L278)

发送失败和中断的best-effort处理。

<details>
<summary>查看原文（27行）</summary>

```text
export async function deliverToNode(
  ctx: Context,
  captain: Agent,
  childId: string,
  text: string,
  signal: AbortSignal,
): Promise<boolean> {
  try {
    await ctx.subagents.sendMessage(
      captain,
      childId as SessionId,
      [{ type: 'text', text }],
      { signal },
    )
    return true
  } catch (error: unknown) {
    ctx.logger.warn(`roundtable: followup to node ${childId} failed: ${String(error)}`)
    return false
  }
}

/** Request cancellation of one live node's current turn (fire and return). */
export function interruptNode(ctx: Context, captain: Agent, childId: string): void {
  try {
    ctx.subagents.interrupt(childId as SessionId, { kind: 'ancestor', agent: captain })
  } catch (error: unknown) {
    ctx.logger.warn(`roundtable: interrupt of node ${childId} failed: ${String(error)}`)
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:1402-1409](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/tools.ts#L1402-L1409)

观点拆分额外LLM路径。

```text
          // 观点拆分（三道防线）：LLM 优先，任何失败 → 本地启发式兜底（零 token）→ 仍失败则整条兜底（seq=0）。
          let lines: Awaited<ReturnType<typeof splitUtterance>> | null = null
          if (llm !== undefined && splitConfig !== undefined) {
            try {
              lines = await splitUtterance(llm, splitConfig, utterance.nodeKey, content)
              splitAttempts += 1
            } catch {
              lines = null
```

#### 缺口

- 会议总调用、人工判断和失败恢复耗时未知
  **影响**：无法比较合格方案单位成本
  **进一步探讨**：记录相同方案下所有节点/拆分/主持人用量、错误与人工表态修订时间，再与单模型/人工对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计可借鉴，当前怎样试用？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

值得借鉴的是主持人权限与锁内新鲜状态、对评审覆盖的拒绝、发言ID去重和允许闭麦后导出/补预算的恢复出口。移植代价在宿主子代理生命周期、权限继承、UI投影与多文件状态一致性。未验证假设是以证据有效性和观点边际增益决定下一轮/下一专家，而不只按文本量或轮数：先去重共同依据和重复缺陷，再只对未解决关键问题追加独立验证。最小验证固定缺陷集和总现金预算，对照当前轮次策略与边际策略，测真缺陷覆盖、重复率、误报、人工时间及超支；若未提高覆盖或明显增加等待则否定。建议trial于离线可公开方案、2–3位受控专家，设置真实供应商额度和独立验收；节点状态/共识/证据标签不能替代测试。若观点堆积、重复、预算不可解释或无人能裁决，停止扩员并导出未决问题。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:159-175](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/tools.ts#L159-L175)

权限/锁内核对。

<details>
<summary>查看原文（17行）</summary>

```text
/** Lock + captain-permission gate + budget gate: the inner captain-tool boilerplate. */
async function withCaptainLock<T>(
  stateRoot: string,
  meetingId: string,
  captainId: string,
  action: string,
  operation: (fresh: Meeting) => Promise<T>,
  options: { allowMuted?: boolean } = {},
): Promise<T> {
  return withMeetingLock(meetingLockKey(stateRoot, meetingId), async () => {
    const fresh = await readMeeting(stateRoot, meetingId)
    if (fresh === undefined || fresh.captainSessionId !== captainId) {
      throw new Error(`only the captain of meeting "${meetingId}" may ${action}`)
    }
    assertUsable(fresh, options)
    return operation(fresh)
  })
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:1322-1326](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/tools.ts#L1322-L1326)

未完成评审覆盖保护。

```text
      return withCaptainLock(stateRoot, located.id, captain.id, 'start a review', async (fresh) => {
        // S1 覆盖保护：进行中的评审（含已支持/驳回记录）不允许被静默覆盖。
        const existing = await readReview(stateRoot, fresh.id)
        if (existing !== undefined && existing.status !== 'done') {
          throw new Error(`a review is already in progress (status ${existing.status}) — finish it before starting a new pass`)
```

**依据 3 · 源码核查**：[src/tools.ts:1388-1409](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/tools.ts#L1388-L1409)

发言去重与拆分。

<details>
<summary>查看原文（22行）</summary>

```text
        // 幂等键 = utteranceId 集合（观点拆分后 viewpoint.id 已变，不能用作去重）。
        const collectedUtteranceIds = new Set(review.viewpoints.map((viewpoint) => viewpoint.utteranceId))
        const utterances = await readTranscript(stateRoot, fresh.id)
        const llm = ctx.get('llm') as SplitLlmLike | undefined
        const splitConfig = config.reviewSplit
        let collected = 0
        let splitAttempts = 0
        for (const utterance of utterances) {
          if (utterance.nodeKey === CAPTAIN_KEY) continue
          if (utterance.kind !== 'speech' && utterance.kind !== 'proxy-thinking') continue
          if (utterance.ts < review.startedAt) continue
          if (collectedUtteranceIds.has(utterance.id)) continue
          const content = utterance.content.replace(/\s+/g, ' ').trim()
          if (content === '') continue // 空发言跳过
          // 观点拆分（三道防线）：LLM 优先，任何失败 → 本地启发式兜底（零 token）→ 仍失败则整条兜底（seq=0）。
          let lines: Awaited<ReturnType<typeof splitUtterance>> | null = null
          if (llm !== undefined && splitConfig !== undefined) {
            try {
              lines = await splitUtterance(llm, splitConfig, utterance.nodeKey, content)
              splitAttempts += 1
            } catch {
              lines = null
```

</details>

**依据 4 · 源码核查**：[src/budget.ts:47-58](https://github.com/9931666/dsh-plugin-roundtable/blob/1457f19ad9358c41929e344ef0f8f7132b3f26fc/src/budget.ts#L47-L58)

闭麦后保留恢复出口。

<details>
<summary>查看原文（12行）</summary>

```text
 * @param meeting - meeting to test.
 * @param options.allowMuted - resolve/escalate paths (top up the budget, close,
 *   export, clear the user-action queue) stay reachable while muted; everything
 *   that produces new work still throws.
 */
export function assertUsable(meeting: Meeting, options: { allowMuted?: boolean } = {}): void {
  if (meeting.status === 'ended' || meeting.status === 'archived') {
    throw new MeetingEndedError(meeting.id)
  }
  if (options.allowMuted === true) return
  const axis = budgetExceeded(meeting)
  if (axis !== undefined) throw new MeetingMutedError(meeting.id, axis)
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
