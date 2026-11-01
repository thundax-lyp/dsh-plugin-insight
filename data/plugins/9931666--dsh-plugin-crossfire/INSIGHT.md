# Crossfire

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7f1594f](https://github.com/9931666/dsh-plugin-crossfire/tree/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9931666/dsh-plugin-crossfire) [![npm 30d 1,021](https://img.shields.io/static/v1?label=npm+30d&message=1%2C021&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire)
<!-- END META -->

> **功能**：在 DSH 对已定稿成果组织红队评审并由用户逐条裁决。

> **亮点**：组织对抗观点并保留用户认定、驳回与理由。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：模型观点不等于真实缺陷；新宿主仅传 persona，注释所称只读 preset 透传未在请求构造中发现。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · Crossfire 面向什么评审，与执行型团队有何区别？](#detail-section-11)
  - [Q02 · 不同宿主启动红队时，只读限制是怎样实现的？](#detail-section-12)
  - [Q03 · 产生观点、收集和用户裁决是否证明缺陷成立？](#detail-section-13)
  - [Q04 · 如何在有权限风险的宿主上试用？](#detail-section-14)
  - [Q05 · 旧接口过滤之外，怎样避免新接口的只读能力被误认？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在交付前审视方案缺陷的用户；基线是人工评审或单代理自查。[Q01](#research-q01)

人工逐条检查或由单代理自审。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 红队 | 多维寻找缺陷 | 模型输出需核实 |
| 裁决 | 用户认定或驳回 | 驳回需理由 |
| 权限 | 旧接口过滤 | 新接口仅传文本，preset 透传未证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH tools、subagents、agents、systemPrompt | 必需 | 工具及专家 | 无法加载 |
| 模型与预算 | 评审需要 | 红队观点 | 人工评审 |
| 只读权限或隔离副本 | 试用必需 | 限制副作用 | 停止运行 |
| 用户与 UI | 裁决需要 | 逐条判断 | 转人工 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户提供成果、隔离副本与预算 | 核实专家权限 |
| 评审 | 启动专家并收集观点 | 失败或越权停止 |
| 裁决 | 用户核对证据并认定或驳回 | 不确定保留待定 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与模型 | 配置隔离及维度 | 宿主权限不同 |
| 持续 | 多专家 token | 逐条核验证据 | 检出率未测 |
| 恢复 | 重评可能再次计费 | 追踪状态 | 不保证全量发现 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 审查 | 专家调用及裁决规则 | 缺陷正确率 |
| 只读 | 旧接口过滤，新接口文本；preset 透传未证 | 当前宿主实际隔离 |

> **思考**：模型观点不等于真实缺陷；新宿主仅传 persona，注释所称只读 preset 透传未在请求构造中发现。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：组织对抗观点并保留用户认定、驳回与理由。[Q01](#research-q01) [Q03](#research-q03)

旧 subagent API 带过滤，新 API 只传 persona；注释所称 preset 透传在固定请求构造中未发现，文本约束不能当硬沙箱。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

模型观点不等于真实缺陷；新宿主仅传 persona，注释所称只读 preset 透传未在请求构造中发现。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离副本先核实专家工具权限，用户逐条复核，异常转人工。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持接口分支和裁决校验；未运行宿主或红队。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/members.ts、src/rpc.ts、src/redteam.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 60 文件、2 排除、零解析错误；静态核查接口及裁决，未运行宿主。
- 下一步：在隔离宿主核验新旧接口实际工具面及是否由宿主外部强制只读，并测试缺服务与专家失败。

**分析版本**

- **仓库**：[9931666/dsh-plugin-crossfire](https://github.com/9931666/dsh-plugin-crossfire)
- **版本号**：0.1.5（[固定提交 7f1594f](https://github.com/9931666/dsh-plugin-crossfire/tree/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：由宿主提供可证明只读 preset，启动时明确选择并验证实际工具权限，无法证明时停止；当前注释提出 preset 但调用未传 agentPreset。[Q05](#research-q05)

在隔离宿主核验新旧接口实际工具面及是否由宿主外部强制只读，并测试缺服务与专家失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 293 | — | — | 3861 |
| .ts | source | 30 | 7918 | 4974 | 2428 | — |
| .tsx | source | 4 | 2548 | 2045 | 422 | — |
| .mjs | test | 20 | 3314 | 2590 | 403 | — |
| .js | test | 1 | 172 | 127 | 37 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/9931666/dsh-plugin-crossfire/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/9931666/dsh-plugin-crossfire/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/9931666/dsh-plugin-crossfire/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：红队专家如何评审并由用户裁决，不同宿主的只读边界如何变化？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Crossfire 面向什么评审，与执行型团队有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有方案或成果、希望在交付前寻找缺陷的用户可按维度召集红队，再逐条裁决；作者将其定位为评审而非自动修复。相对单代理自查，它组织多个对抗视角和人类裁决，但更多调用不能证明发现真实缺陷；简单可验证问题可直接人工检查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-21](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/README.md#L1-L21)

作者描述对抗评审、裁决及只读意图。

<details>
<summary>查看原文（21行）</summary>

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
2. **不产出方案、不改代码、不自动修复。**
3. **红队专家只读。** 它们的工具是白名单：`read` / `read_image` / `glob` / `grep` + 一个 `crossfire_report`。能取证，不能动手。
4. **你的历史表态只用于去重与复审递进**，绝不会作为"用户画像"喂给红队 —— 否则模型会预判你的偏好而干脆不提某类问题，与"反方攻击"的初衷正好相反。
```

</details>

**依据 2 · 作者声明**：[README.md:36-58](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/README.md#L36-L58)

作者描述评审状态与工具。

<details>
<summary>查看原文（23行）</summary>

````text
## 用法

在对话里说一句「用针锋评审一下这个方案」，或者在卡片上点按钮 —— 两条路驱动的是**同一套状态机**。

```
draft ──送红队上场──▶ attacking ──收集观点──▶ judging ──定稿──▶ settled
                                                ▲                │
                                                └──── 开复审 ─────┘
                                                   （只核对旧账）
```

### 工具面（`crossfire_*`）

| 工具 | 作用 |
| --- | --- |
| `crossfire_open` | 把待验证对象摆上台（标题 + 正文 + 维度 + 强度）。状态 `draft` |
| `crossfire_stance` | 写入用户的立场与理由；没有就**从对话提炼**（`distilled=true`），但绝不虚构 |
| `crossfire_attack` | 按维度拉起只读红队专家。状态 `attacking` |
| `crossfire_collect` | 把专家发言拆成逐条可裁决的缺陷。状态 `judging` |
| `crossfire_finish` | 定稿，固化 known-flaws 清单并写入历史。状态 `settled` |
| `crossfire_recheck` | 复审：只核对上一轮已认定的缺陷是否修复 |
| `crossfire_export` | 导出 Markdown 交付物 |
| `crossfire_report` | **专家侧**：红队提交发言的唯一通道 |
````

</details>

#### 缺口

- 未运行宿主、红队模型或 UI
  **影响**：不能证明只读隔离、缺陷真实性与成本
  **进一步探讨**：固定宿主契约，在隔离仓库验证工具权限、专家失败和用户裁决

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 不同宿主启动红队时，只读限制是怎样实现的？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

旧接口 startContinuable 在请求中传 persona 和 expertToolRestriction；新接口 startActivation 将 persona 文本加入 prompt，未传 toolFilter。注释提出借助宿主静态只读 preset 并称可透传，但固定源码的 route 只构造 provider/model，agentOptions 另加 maxTokens，实际 request 未设置 agentPreset；所以只能将其视作注释中的意图，不能宣称已经透传或存在硬只读隔离。启动失败不记录成功派遣。

#### 证据与依据

**依据 1 · 源码核查**：[src/members.ts:227-235](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/members.ts#L227-L235)

源码说明新旧接口只读差异。

```text
  // 0.2.1 收敛了子代理契约：`startContinuable` 与 per-child `persona`/`toolFilter`
  // 一起被移除（persona 归 system-prompt / agent preset，工具面由 preset 拥有）。
  // 按运行时形状二选一，不把探测变成加载门禁：两个入口都缺才报错。
  //
  // **只读边界的退化**：旧宿主用 `toolFilter`（白名单）硬保证专家不能写、不能执行、
  // 不能联网；新宿主没有这个通道，边界退化为 persona 里的文字约束（见 redteam.ts
  // 的「工具边界」段）。要恢复硬边界，需要宿主提供只读 preset 并通过 `agentPreset`
  // 选择 —— 本文件已支持（见下方 agentPreset 透传），但 preset 必须在 profile 里
  // 静态声明，不能由插件运行时注册。
```

**依据 2 · 源码核查**：[src/members.ts:127-143](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/members.ts#L127-L143)

路由选项仅 provider/model。

<details>
<summary>查看原文（17行）</summary>

```text
export function resolveExpertRoute(
  expert: { provider?: string; model?: string },
  config: { defaultProvider?: string; defaultModel?: string },
): ExpertRoute {
  const explicitProvider = nonEmpty(expert.provider)
  const explicitModel = nonEmpty(expert.model)
  const fallbackProvider = nonEmpty(config.defaultProvider)
  const fallbackModel = nonEmpty(config.defaultModel)

  const agentOptions: { provider?: string; model?: string } = {}
  if (explicitProvider !== undefined) agentOptions.provider = explicitProvider
  // 只有 model：补一个默认 provider，否则这个 model 在多数路由上无解。
  else if (explicitModel !== undefined && fallbackProvider !== undefined) agentOptions.provider = fallbackProvider
  if (explicitModel !== undefined) agentOptions.model = explicitModel

  const route: ExpertRoute = { agentOptions }
  if (agentOptions.provider !== undefined) route.provider = agentOptions.provider
```

</details>

**依据 3 · 源码核查**：[src/members.ts:194-224](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/members.ts#L194-L224)

agentOptions 添加 maxTokens 后构造 request，未设置 agentPreset。

<details>
<summary>查看原文（31行）</summary>

```text
  // Per-request output cap: model max_tokens applied to every request this
  // expert makes (0/unset = the provider's own default).
  //
  // 路由（provider / model）由 `resolveExpertRoute` **一次决定**，记录与下发共用
  // 它的结果 —— 不允许出现"记录写 A、实际跑 B"（见该函数的注释）。
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

  const prompt: ContentBlock[] = [{ type: 'text', text: expertWelcome(input) }]
  const request: Record<string, unknown> = {
    prompt,
    parent,
    ...(Object.keys(agentOptions).length > 0 ? { agentOptions } : {}),
    ...(config.maxDepth === undefined ? {} : { maxDepth: config.maxDepth }),
```

</details>

**依据 4 · 源码核查**：[src/members.ts:252-278](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/members.ts#L252-L278)

接口选择、旧版过滤与启动失败。

<details>
<summary>查看原文（27行）</summary>

```text
  const label = `${EXPERT_LABEL_PREFIX}${record.reviewId}:${expert.key}`
  let childId: unknown
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
      request: { ...request, persona, toolFilter: expertToolRestriction() },
      signal,
    })
    childId = started.childId
  } else {
    throw new Error('crossfire: the host exposes neither startActivation (0.2.1+) nor startContinuable (older) — cannot spawn an expert')
  }
  // 落盘时机**在拉起成功之后**：拉起失败时什么都不记（调用方会把 status 记成
  // failed），避免留下一份"看起来下发过、其实没发出去"的原文。
  expert.persona = persona
  return String(childId)
```

</details>

#### 缺口

- 未运行宿主、红队模型或 UI
  **影响**：不能证明只读隔离、缺陷真实性与成本
  **进一步探讨**：固定宿主契约，在隔离仓库验证工具权限、专家失败和用户裁决

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 产生观点、收集和用户裁决是否证明缺陷成立？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不是。作者设计由人逐条认定、驳回或待定；RPC 对 rejected 要求非空理由。评审意见仍由模型产生，必须回源检查事实与影响；状态从 attacking 到 judging 只说明流程推进，不代表缺陷正确、专家完整或隔离已验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-62](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/README.md#L47-L62)

作者描述收集和人类三态裁决。

<details>
<summary>查看原文（16行）</summary>

```text
### 工具面（`crossfire_*`）

| 工具 | 作用 |
| --- | --- |
| `crossfire_open` | 把待验证对象摆上台（标题 + 正文 + 维度 + 强度）。状态 `draft` |
| `crossfire_stance` | 写入用户的立场与理由；没有就**从对话提炼**（`distilled=true`），但绝不虚构 |
| `crossfire_attack` | 按维度拉起只读红队专家。状态 `attacking` |
| `crossfire_collect` | 把专家发言拆成逐条可裁决的缺陷。状态 `judging` |
| `crossfire_finish` | 定稿，固化 known-flaws 清单并写入历史。状态 `settled` |
| `crossfire_recheck` | 复审：只核对上一轮已认定的缺陷是否修复 |
| `crossfire_export` | 导出 Markdown 交付物 |
| `crossfire_report` | **专家侧**：红队提交发言的唯一通道 |

### 卡片

在对话轨迹里占一张卡（`tool.call.toolview`，key = `crossfire_open`），每张缺陷一张子卡，可内联**认定 / 驳回（必填理由）/ 待定**，三态可互切。卡片每秒轮询快照，因此状态机一变它立刻跟着变。
```

</details>

**依据 2 · 源码核查**：[src/rpc.ts:472-486](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/rpc.ts#L472-L486)

状态输入校验和驳回理由。

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
```

</details>

**依据 3 · 源码核查**：[src/rpc.ts:803-824](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/rpc.ts#L803-L824)

收集后的状态转移。

<details>
<summary>查看原文（22行）</summary>

```text
    // 代价（刻意的）：拆分走 LLM 是十秒级的，持锁期间同一场评审的其它写操作会排队。
    // 同一场评审的写本就该串行 —— 用"排队"换"列表里不再出现重复项"。
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
```

</details>

#### 缺口

- 未运行宿主、红队模型或 UI
  **影响**：不能证明只读隔离、缺陷真实性与成本
  **进一步探讨**：固定宿主契约，在隔离仓库验证工具权限、专家失败和用户裁决

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何在有权限风险的宿主上试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

依赖 DSH tools、subagents、agents 和 systemPrompt；模型和用户裁决耗费时间及费用，UI/webServer 为可选服务。先确认宿主接口和专家实际工具权限，仅在隔离副本、小预算运行并人工核实每条证据；新接口代码未传 agentPreset，注释中静态 preset 的设想未由调用路径证明。若隔离不可确认或结果越权，应停止并转人工评审。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:40-53](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/index.ts#L40-L53)

强依赖和可选服务。

<details>
<summary>查看原文（14行）</summary>

```text
 *
 * cordis 没有"可选注入"这种形式（`Inject` 只有 `string[] | Record`，而 record
 * 形式是拦截配置），因此写在这里的每个名字都会让整个插件 fiber 保持 PENDING
 * 直到该服务存在：没有工具、没有 `/plugins/dsh-plugin-crossfire/*` 路由、没有
 * 卡片、也没有设置页。而缺一个**可选**能力却写在这里，在用户眼里就是"针锋整个
 * 不见了"，且任何地方都不报错。
 *
 * 所以 `llm` / `webServer` / `workspaceRegistry` / `connection` 一律**不列**，
 * 全部经 `ctx.get(...)` 或 harness-compat 的探测层懒取：
 *   - `llm` 缺席时，观点拆分退到本地启发式兜底（零 token、确定性）；
 *   - `webServer` 缺席时，只有设置页与卡片失联，host 侧与工具照常工作；
 *   - `connection` 缺席时，RPC 只走插件自有路由。
 */
export const inject = ['tools', 'subagents', 'agents', 'systemPrompt']
```

</details>

**依据 2 · 源码核查**：[src/members.ts:227-235](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/members.ts#L227-L235)

新宿主约束退化。

```text
  // 0.2.1 收敛了子代理契约：`startContinuable` 与 per-child `persona`/`toolFilter`
  // 一起被移除（persona 归 system-prompt / agent preset，工具面由 preset 拥有）。
  // 按运行时形状二选一，不把探测变成加载门禁：两个入口都缺才报错。
  //
  // **只读边界的退化**：旧宿主用 `toolFilter`（白名单）硬保证专家不能写、不能执行、
  // 不能联网；新宿主没有这个通道，边界退化为 persona 里的文字约束（见 redteam.ts
  // 的「工具边界」段）。要恢复硬边界，需要宿主提供只读 preset 并通过 `agentPreset`
  // 选择 —— 本文件已支持（见下方 agentPreset 透传），但 preset 必须在 profile 里
  // 静态声明，不能由插件运行时注册。
```

**依据 3 · 作者声明**：[README.md:47-62](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/README.md#L47-L62)

作者描述评审流程。

<details>
<summary>查看原文（16行）</summary>

```text
### 工具面（`crossfire_*`）

| 工具 | 作用 |
| --- | --- |
| `crossfire_open` | 把待验证对象摆上台（标题 + 正文 + 维度 + 强度）。状态 `draft` |
| `crossfire_stance` | 写入用户的立场与理由；没有就**从对话提炼**（`distilled=true`），但绝不虚构 |
| `crossfire_attack` | 按维度拉起只读红队专家。状态 `attacking` |
| `crossfire_collect` | 把专家发言拆成逐条可裁决的缺陷。状态 `judging` |
| `crossfire_finish` | 定稿，固化 known-flaws 清单并写入历史。状态 `settled` |
| `crossfire_recheck` | 复审：只核对上一轮已认定的缺陷是否修复 |
| `crossfire_export` | 导出 Markdown 交付物 |
| `crossfire_report` | **专家侧**：红队提交发言的唯一通道 |

### 卡片

在对话轨迹里占一张卡（`tool.call.toolview`，key = `crossfire_open`），每张缺陷一张子卡，可内联**认定 / 驳回（必填理由）/ 待定**，三态可互切。卡片每秒轮询快照，因此状态机一变它立刻跟着变。
```

</details>

#### 缺口

- 未运行宿主、红队模型或 UI
  **影响**：不能证明只读隔离、缺陷真实性与成本
  **进一步探讨**：固定宿主契约，在隔离仓库验证工具权限、专家失败和用户裁决

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 旧接口过滤之外，怎样避免新接口的只读能力被误认？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：由宿主提供可证明的只读 preset，并在启动请求中明确选择、核对最终专家工具集合；无法证明时拒绝开评，可能减少把文本约束误认为硬权限。反证是旧接口已有工具过滤，源码注释提出静态 preset 思路，但实际 agentOptions 仅包含 provider/model/maxTokens，request 未传 agentPreset，因此现有透传未证实且存在缺口；不排除宿主全局策略或其他等价保护。隔离对照新旧接口、有无 preset 及恶意工具请求，测越权率、误拒和延迟；若不能可靠证明或误拒过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/members.ts:127-143](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/members.ts#L127-L143)

实际路由构造 provider/model。

<details>
<summary>查看原文（17行）</summary>

```text
export function resolveExpertRoute(
  expert: { provider?: string; model?: string },
  config: { defaultProvider?: string; defaultModel?: string },
): ExpertRoute {
  const explicitProvider = nonEmpty(expert.provider)
  const explicitModel = nonEmpty(expert.model)
  const fallbackProvider = nonEmpty(config.defaultProvider)
  const fallbackModel = nonEmpty(config.defaultModel)

  const agentOptions: { provider?: string; model?: string } = {}
  if (explicitProvider !== undefined) agentOptions.provider = explicitProvider
  // 只有 model：补一个默认 provider，否则这个 model 在多数路由上无解。
  else if (explicitModel !== undefined && fallbackProvider !== undefined) agentOptions.provider = fallbackProvider
  if (explicitModel !== undefined) agentOptions.model = explicitModel

  const route: ExpertRoute = { agentOptions }
  if (agentOptions.provider !== undefined) route.provider = agentOptions.provider
```

</details>

**依据 2 · 源码核查**：[src/members.ts:194-224](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/members.ts#L194-L224)

请求仅补 maxTokens 并构造请求，未传 agentPreset。

<details>
<summary>查看原文（31行）</summary>

```text
  // Per-request output cap: model max_tokens applied to every request this
  // expert makes (0/unset = the provider's own default).
  //
  // 路由（provider / model）由 `resolveExpertRoute` **一次决定**，记录与下发共用
  // 它的结果 —— 不允许出现"记录写 A、实际跑 B"（见该函数的注释）。
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

  const prompt: ContentBlock[] = [{ type: 'text', text: expertWelcome(input) }]
  const request: Record<string, unknown> = {
    prompt,
    parent,
    ...(Object.keys(agentOptions).length > 0 ? { agentOptions } : {}),
    ...(config.maxDepth === undefined ? {} : { maxDepth: config.maxDepth }),
```

</details>

**依据 3 · 源码核查**：[src/members.ts:227-235](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/members.ts#L227-L235)

注释提出静态 preset，但注释声称透传与实际代码不符。

```text
  // 0.2.1 收敛了子代理契约：`startContinuable` 与 per-child `persona`/`toolFilter`
  // 一起被移除（persona 归 system-prompt / agent preset，工具面由 preset 拥有）。
  // 按运行时形状二选一，不把探测变成加载门禁：两个入口都缺才报错。
  //
  // **只读边界的退化**：旧宿主用 `toolFilter`（白名单）硬保证专家不能写、不能执行、
  // 不能联网；新宿主没有这个通道，边界退化为 persona 里的文字约束（见 redteam.ts
  // 的「工具边界」段）。要恢复硬边界，需要宿主提供只读 preset 并通过 `agentPreset`
  // 选择 —— 本文件已支持（见下方 agentPreset 透传），但 preset 必须在 profile 里
  // 静态声明，不能由插件运行时注册。
```

**依据 4 · 源码核查**：[src/members.ts:252-273](https://github.com/9931666/dsh-plugin-crossfire/blob/7f1594f1e4165741cdd4362a8a30c1e45b8f7ce4/src/members.ts#L252-L273)

新接口传 persona，旧接口传工具过滤。

<details>
<summary>查看原文（22行）</summary>

```text
  const label = `${EXPERT_LABEL_PREFIX}${record.reviewId}:${expert.key}`
  let childId: unknown
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
      request: { ...request, persona, toolFilter: expertToolRestriction() },
      signal,
    })
    childId = started.childId
  } else {
    throw new Error('crossfire: the host exposes neither startActivation (0.2.1+) nor startContinuable (older) — cannot spawn an expert')
```

</details>

#### 缺口

- 未运行宿主、红队模型或 UI
  **影响**：不能证明只读隔离、缺陷真实性与成本
  **进一步探讨**：固定宿主契约，在隔离仓库验证工具权限、专家失败和用户裁决

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
