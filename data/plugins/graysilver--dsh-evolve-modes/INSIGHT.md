# DSH Evolve Modes

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[58b2742](https://github.com/GraySilver/dsh-evolve-modes/tree/58b2742ec6f5c38200efdacd38f61c780d7977da)

<!-- BEGIN META -->
[![GitHub ★ 201](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=201&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GraySilver/dsh-evolve-modes) [![npm 30d 317](https://img.shields.io/static/v1?label=npm+30d&message=317&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@graysilver/dsh-evolve-modes) [![最新发布 2026-09-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@graysilver/dsh-evolve-modes)
<!-- END META -->

> **功能**：在 DSH Web 组合工作、思考和审查模式，并人工批准跨会话学习规则。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)独立模式与有逐字来源/备份的批准规则工作流，模型和运行时继承DSH。

> **主要限制**：[Q03](#research-q03)shell白名单不强制只读，off不取消已批准全局规则；引用正确不等推断全局适用，旧提议无目标版本绑定。

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
  - [Q01 · 可组合模式和学习服务什么任务？](#detail-section-11)
  - [Q02 · 学习如何保持来源且需人工批准？](#detail-section-12)
  - [Q03 · 哪些边界不能用模式名保证？](#detail-section-13)
  - [Q04 · 怎样控制成本与退出，增量假设是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH重复任务需要组合工作方式与稳定偏好。

每次复制审查提示、手工维护AGENTS规则。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 四维组合 | 计划/思考/质量/学习 | plan依赖官方服务 |
| fork审查 | 找缺口/验收清单 | shell非强只读 |
| 隔离学习 | 逐字来源提议 | 源模型/完整用户数据 |
| 批准规则/备份 | 跨会话复用/恢复 | 全局，off非撤销 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 相容DSH Web/Node/peer | 必需 | 模式/Remote/存储 | 实装升级重验 |
| 源会话模型/provider | 学习必需 | 辅助LLM/repair | 错误留批次 |
| fork/官方planMode/shell | 对应功能 | 审查与计划 | 无provider报unavailable |
| 人工审核/全局规则备份 | 必需 | 控误泛化/退出 | off不停止规则注入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 专用profile/低敏数据 | 核模型和已有规则 |
| 学习 | turn积累/辅助请求 | 看证据/失败/满队列 |
| 批准 | 用户判断全局适用 | 下一请求跨项目核注入 |
| 异常退出 | 停学习/评审并恢复规则 | 回手工文件/保留记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | profile/存储 | 配置/兼容/备份 | 耗时未知 |
| 持续 | 学习/repair/review模型token | 证据和全局适用复核 | 费用净收益未知 |
| 失败恢复 | 保留批次/备份 | 清积压/恢复误规则 | 多进程未验 |
| 退出 | 已批准规则/记录 | 删除/恢复/停包 | off本身不足 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 组合模式 | 四轴状态/prompt | 任务质量 |
| 学习隔离 | 单system/JSON无工具 | 推断正确/费用 |
| 可审规则 | 精确引用/pending/备份 | 全局合适/过期覆盖 |
| 计划/审查 | 工具名过滤/fork | shell强只读不成立 |

> **思考**：[Q03](#research-q03)shell白名单不强制只读，off不取消已批准全局规则；引用正确不等推断全局适用，旧提议无目标版本绑定。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)独立模式与有逐字来源/备份的批准规则工作流，模型和运行时继承DSH。

[Q02](#research-q02)隔离无工具调用、精确用户证据、单repair、pending去重与全局备份替换；进程内串行非跨进程保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)shell白名单不强制只读，off不取消已批准全局规则；引用正确不等推断全局适用，旧提议无目标版本绑定。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)专用低敏profile小批审阅，核实际注入/费用；异常停学习并删除/恢复全局规则。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

开发与实际lib入口学习/注入/turn钩子静态核查，未安装DSH/调用真实模型。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/evolution/learning.ts、src/evolution/prompt.ts、src/evolution/store.ts、src/storage.ts、src/evolution/messages.ts、src/evolution/service.ts、src/client/index.tsx、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核心四维控制、review、学习消息/LLM/parser/store/Remote/客户端批准及lib关键段；非完整宿主权限和全部UI审计，不运行目标。
- 下一步：学习/repair/取消/持久失败/满队列、off后注入、旧提议批准与真实任务/费用基线。

**分析版本**

- **仓库**：[GraySilver/dsh-evolve-modes](https://github.com/GraySilver/dsh-evolve-modes)
- **版本号**：0.4.1（[固定提交 58b2742](https://github.com/GraySilver/dsh-evolve-modes/tree/58b2742ec6f5c38200efdacd38f61c780d7977da)）
- **版本日期**：2026-09-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)批准绑定生成时目标revision可探索，若现有备份流程已同效或误拒负担更大即否定。

学习/repair/取消/持久失败/满队列、off后注入、旧提议批准与真实任务/费用基线。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 1618 | 1535 | 83 | — |
| .md | source | 3 | 477 | — | — | 4957 |
| .mjs | source | 3 | 33 | 29 | 0 | — |
| .tsx | source | 1 | 795 | 742 | 7 | — |
| .ts | source | 15 | 1961 | 1727 | 75 | — |
| .mjs | test | 1 | 411 | 386 | 0 | — |
| .ts | test | 1 | 476 | 429 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/GraySilver/dsh-evolve-modes/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/GraySilver/dsh-evolve-modes/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/GraySilver/dsh-evolve-modes/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核模式、评审及人工批准学习的权限/数据和全局状态边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可组合模式和学习服务什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向重复使用DSH Web、需要计划/思考/审查与稳定偏好管理的用户，以四个独立维度替代每次复制提示词。计划接官方planMode，第一性原理/Grilling注入提示；质量门禁在父turn停止时fork reviewer，仅报告；自进化是隔离模型提出规则、用户批准后跨会话使用，不是自动改模型权重或AGENTS.md。较手工规则文件，增量是来源证据、提议状态、备份与统一设置页；模型/存储/子Agent能力继承DSH。成功是复用合适规则且不误泛化，不能以提议数/模式数代替效果。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:12-18](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/README.md#L12-L18)

作者组合与版本说明。

```text
> 让 Agent 的工作方式可组合、可审查、可持续改进，最终实现 Agent Self Evoling。

**dsh-evolve-modes** 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的独立 Web 插件。它在输入区提供一个紧凑的工作流控制项，让你组合 Agent 的工作状态、思考策略、质量门禁和自进化行为。

插件不 fork DeepSeek Harness，不复制 Agent loop，也不修改核心代码。安装后，当前任务使用的组合始终显示在输入区旁；全局“自进化模式”设置则负责管理跨会话的学习提议和已批准规则。

> 当前版本 `0.4.0` 支持 DeepSeek Harness `0.1.1-rc.2`。仍使用 Harness `0.1.0-rc.6` 时，请安装插件 `0.3.1`。
```

**依据 2 · 源码核查**：[README.md:54-82](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/README.md#L54-L82)

四维度/默认/全局作用域。

<details>
<summary>查看原文（29行）</summary>

```text

点开控制项即可分别调整四个维度：

| 维度 | 选项 | 作用 |
| --- | --- | --- |
| **工作状态** | 正常 · 计划 | 立即完成任务，或进入官方 DSH 计划工作流。 |
| **思考策略** | 标准 · 第一性原理 · Grilling | 正常回答、显式梳理第一性原理，或通过分轮追问压力测试需求和决策。 |
| **质量门禁** | 关 · 对抗性审查 · 验收审查 | 不增加审查，独立寻找风险，或对照任务和已批准计划验收结果。 |
| **自进化** | 关 · 开 | 自动分析会话，生成待人工审阅的规则提议，自动优化AGENTS.md（但不改动 AGENTS.md）|

这不是互斥的“人格模式”，而是每个任务都可以重新组合的一组工作决策。

## 自进化模式

自进化用于从多个已完成的 Agent 协作中识别稳定的用户身份、偏好和工作要求。它默认是 **Propose（提议）**，只提出候选规则，不会自动改变后续行为。

### 默认设置

| 设置 | 默认值 | 说明 |
| --- | --- | --- |
| 自进化 | `Propose` | 新会话和没有明确保存自进化选择的旧会话默认开启。 |
| 学习批次 | `3` | 每累计完成 3 次父 Agent 回复后启动一次学习。可在全局设置中调整为 `1..100`。 |
| 待审阅提议上限 | `100` | 超过上限时不会继续堆积提议，可在全局设置中调整为 `1..1000`。 |
| 学习范围 | 已开启自进化的源会话 | 不再配置项目范围；当前会话打开自进化，就会纳入学习范围。 |
| 规则作用域 | 全局 | 应用后的规则跨会话生效，不绑定项目目录。 |

![自进化模式全局设置](https://raw.githubusercontent.com/GraySilver/dsh-evolve-modes/main/assets/evolve-modes-review.png)

### 学习数据如何被整理
```

</details>

**依据 3 · 源码核查**：[src/index.ts:129-164](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/index.ts#L129-L164)

review子Agent真实接线。

<details>
<summary>查看原文（36行）</summary>

```text
  signal: AbortSignal,
  shellTool: Config['shellTool'],
  profile: ReviewProfile,
): Promise<EvolveModeReview | undefined> {
  const input = currentTurnInput(agent, turn)
  if (input === undefined) return undefined
  const unavailable = (text: string): EvolveModeReview => ({ turn, profile, status: 'unavailable', text, createdAt: Date.now() })
  if (scope.subagents.getProvider('fork') === undefined) return unavailable('The fork subagent provider is unavailable.')
  try {
    const run = await scope.subagents.start('fork', {
      parent: agent,
      signal,
      label: profile,
      toolFilter: { allow: [...READ_ONLY_REVIEW_TOOLS, shellTool] },
      prompt: [{ type: 'text', text: reviewPrompt(profile, input) }],
    })
    try {
      const result = await run.result
      const text = result.output.map(block => block.type === 'text' ? block.text : '').join('')
      return result.stopReason === 'completed'
        ? { turn, profile, status: 'completed', text: text || 'Review completed without a text report.', createdAt: Date.now() }
        : unavailable(`The reviewer did not complete (${result.stopReason}).`)
    } finally {
      await run.dispose()
    }
  } catch (error: unknown) {
    return unavailable(error instanceof Error ? error.message : String(error))
  }
}

function isReasoningMode(value: string): value is ReasoningMode {
  return value === 'standard' || value === 'first-principles' || value === 'grilling'
}

function isQualityGate(value: string): value is QualityGate {
  return value === 'off' || value === 'general-review' || value === 'acceptance-review'
```

</details>

**依据 4 · 源码核查**：[src/index.ts:347-364](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/index.ts#L347-L364)

turn停止时学习与review。

<details>
<summary>查看原文（18行）</summary>

```text
          ? Promise.resolve()
          : learnFromTurns(scope, agent, batch, signal, evolutionStore, records),
      ])
      if (review !== undefined) await addReview(records, String(agent.session.id), review)
    })
  })
}

export type {
  AdversarialReview,
  EvolutionAction,
  EvolutionBackup,
  EvolutionCategory,
  EvolutionConfig,
  EvolutionConfigRequest,
  EvolutionDashboard,
  EvolutionDashboardRequest,
  EvolutionEvidence,
```

</details>

#### 缺口

- 真实任务改善、偏好准确率/复核负担未测。
  **影响**：只支持有条件试用而非自进化效果保证。
  **进一步探讨**：同任务比较手工规则与批准提议，记录错误泛化。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 学习如何保持来源且需人工批准？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

开启propose时turn写入待学习队列，达到默认3后读取所选轮用户消息/末个助手消息，最多最近100条，助手最多2000字符而用户不截字。使用源会话provider/model直接llm.stream，只有专属system及一条JSON用户消息，不创建Agent、不带工具/继承历史；但仍发送所选用户内容、现有全局规则和pending给同一路模型，并非本地处理。输出严格schema、动作/目标/scope校验，evidence必须是当前用户消息精确子串；首次无效可再一次repair调用。

recordLearningResult去重/限pending，成功持久结果后才清turn，失败记录run并保留批次。提议默认pending，不改已批准设置；设置页Apply→Remote proposal→store，先构造旧规则备份，再同一个global replacement写规则/状态/备份，进程内tail串行。compileLearnedInstructions对全部global规则构造section，下次模型请求使用。源码入口lib同样有学习stream、全局section和turn钩子，未只审开发src；不把进程内串行推成多进程事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/storage.ts:178-209](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/storage.ts#L178-L209)

批次入队/成功清理。

<details>
<summary>查看原文（32行）</summary>

```text
export async function queueEvolutionTurn(
  table: KvTable<string, StoredEvolveModeRecord>,
  sessionId: string,
  turn: number,
  learningBatchSize = 3,
): Promise<readonly number[]> {
  const current = recordFor(table, sessionId)
  if (current.evolution === 'off') return []
  const pendingEvolutionTurns = current.pendingEvolutionTurns.includes(turn)
    ? current.pendingEvolutionTurns
    : [...current.pendingEvolutionTurns, turn]
  await putRecord(table, sessionId, { ...current, pendingEvolutionTurns, updatedAt: Date.now() })
  return pendingEvolutionTurns.length >= learningBatchSize ? pendingEvolutionTurns : []
}

/** Remove turns from the pending learning batch after a successful analysis. */
export async function completeEvolutionBatch(
  table: KvTable<string, StoredEvolveModeRecord>,
  sessionId: string,
  turns: readonly number[],
): Promise<EvolveModeRecord> {
  const completed = new Set(turns)
  const current = recordFor(table, sessionId)
  return putRecord(table, sessionId, {
    ...current,
    pendingEvolutionTurns: current.pendingEvolutionTurns.filter(turn => !completed.has(turn)),
    updatedAt: Date.now(),
  })
}

export async function setLegacyMode(
  table: KvTable<string, StoredEvolveModeRecord>,
```

</details>

**依据 2 · 源码核查**：[src/evolution/messages.ts:5-61](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/messages.ts#L5-L61)

消息收集/截断。

<details>
<summary>查看原文（57行）</summary>

```text
const LEARNING_MESSAGE_LIMIT = 100
const LEARNING_ASSISTANT_CHARACTER_LIMIT = 2000
const ASSISTANT_HEAD_CHARACTER_LIMIT = LEARNING_ASSISTANT_CHARACTER_LIMIT / 2
const ASSISTANT_TAIL_CHARACTER_LIMIT = LEARNING_ASSISTANT_CHARACTER_LIMIT - ASSISTANT_HEAD_CHARACTER_LIMIT

function textContent(content: readonly { type: string; text?: string }[]): string {
  return content.flatMap(block => block.type === 'text' && typeof block.text === 'string' ? [block.text] : []).join('\n')
}

function truncateAssistantMessage(text: string): string {
  if (text.length <= LEARNING_ASSISTANT_CHARACTER_LIMIT) return text
  return `${text.slice(0, ASSISTANT_HEAD_CHARACTER_LIMIT)}...${text.slice(-ASSISTANT_TAIL_CHARACTER_LIMIT)}`
}

/** Keep full user messages and each selected turn's final visible assistant message. */
export function evolutionMessages(agent: Agent, turns: readonly number[]): EvolutionLearningMessage[] {
  const selected = new Set(turns)
  const userMessages: EvolutionLearningMessage[] = []
  const assistantByTurn = new Map<number, EvolutionLearningMessage>()
  let currentTurn: number | undefined
  for (const event of sessionEvents(agent.session)) {
    if (event.type === 'turn/start') {
      currentTurn = event.data.turn
      continue
    }
    if (currentTurn === undefined || !selected.has(currentTurn)) continue
    if (event.type === 'user/message' && event.data.source.kind === 'user') {
      const text = textContent(event.data.content).trim()
      if (text !== '') {
        userMessages.push({
          sessionId: String(agent.session.id),
          turn: currentTurn,
          eventSeq: event.seq,
          role: 'user',
          text,
        })
      }
      continue
    }
    if (event.type === 'assistant/message') {
      const text = textContent(event.data.message.content).trim()
      if (text !== '') {
        assistantByTurn.set(currentTurn, {
          sessionId: String(agent.session.id),
          turn: currentTurn,
          eventSeq: event.seq,
          role: 'assistant',
          text: truncateAssistantMessage(text),
        })
      }
    }
  }
  const recent = [...userMessages, ...assistantByTurn.values()]
    .sort((left, right) => left.eventSeq - right.eventSeq)
    .slice(-LEARNING_MESSAGE_LIMIT)
  return recent[0]?.role === 'assistant' ? recent.slice(1) : recent
}
```

</details>

**依据 3 · 源码核查**：[src/evolution/learning.ts:46-83](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/learning.ts#L46-L83)

源模型与隔离请求。

<details>
<summary>查看原文（38行）</summary>

```text
function learningRoute(agent: Agent): Pick<GenerateOptions, 'provider' | 'model' | 'maxTokens'> {
  const header = agent.session.requestHeader()
  const provider = header?.config.provider || agent.options.provider
  const model = header?.config.model || agent.options.model
  if (!provider || !model) {
    throw new Error('Self-evolution learning requires a resolved provider and model on the source session.')
  }
  const maxTokens = header?.config.maxTokens ?? agent.options.maxTokens
  return { provider, model, ...maxTokens === undefined ? {} : { maxTokens } }
}

/** Run one isolated auxiliary LLM call with no Agent, preset, tools, or inherited history. */
export async function runEvolutionLearningCall(
  scope: Context,
  agent: Agent,
  signal: AbortSignal,
  prompt: string,
): Promise<string> {
  signal.throwIfAborted()
  const route = learningRoute(agent)
  const messages = [createUserMessage({
    content: [{ type: 'text', text: prompt }],
    source: { kind: 'plugin', plugin: 'dsh-evolve-modes:evolution-learning' },
  })]
  const options: GenerateOptions = deepFreeze({
    ...route,
    messages,
    system: EVOLUTION_LEARNING_SYSTEM_PROMPT,
    signal,
    sessionId: agent.session.id,
  })
  const assembler = new BlockAssembler()
  let finished = false
  for await (const chunk of scope.llm.stream(options)) {
    signal.throwIfAborted()
    assembler.push(chunk)
    if (chunk.type === 'finish') finished = true
  }
```

</details>

**依据 4 · 源码核查**：[src/evolution/learning.ts:100-144](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/learning.ts#L100-L144)

一次repair与成功后清队列。

<details>
<summary>查看原文（45行）</summary>

```text
/** Analyze one accumulated learning batch and retire its turns only after a validated durable result. */
export async function learnFromTurns(
  scope: Context,
  agent: Agent,
  turns: readonly number[],
  signal: AbortSignal,
  store: EvolutionStore,
  records: KvTable<string, StoredEvolveModeRecord>,
): Promise<void> {
  const sessionId = String(agent.session.id)
  const run = {
    sessionId,
    turns,
  }
  try {
    const messages = evolutionMessages(agent, turns)
    const current = relevantState(store)
    const input: EvolutionLearningInput = { sessionId, messages, ...current }
    if (messages.some(message => message.role === 'user')) {
      const text = await runEvolutionLearningCall(scope, agent, signal, evolutionLearningPrompt(input))
      let drafts: EvolutionProposalDraft[]
      try {
        drafts = parseEvolutionLearningResult(text, input)
      } catch (error: unknown) {
        const repaired = await runEvolutionLearningCall(
          scope,
          agent,
          signal,
          evolutionLearningRepairPrompt(input, text, error),
        )
        drafts = parseEvolutionLearningResult(repaired, input)
      }
      await store.recordLearningResult({ ...run, status: 'completed', error: null }, drafts)
    } else {
      await store.recordLearningResult({ ...run, status: 'completed', error: null }, [])
    }
    await completeEvolutionBatch(records, sessionId, turns)
  } catch (error: unknown) {
    await store.recordLearningResult({
      ...run,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    }, [])
  }
}
```

</details>

**依据 5 · 源码核查**：[src/evolution/prompt.ts:155-211](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/prompt.ts#L155-L211)

精确用户原文证据校验。

<details>
<summary>查看原文（57行）</summary>

```text
export function parseEvolutionLearningResult(
  text: string,
  input: EvolutionLearningInput,
): EvolutionProposalDraft[] {
  const parsed: unknown = JSON.parse(jsonPayload(text))
  const result = learningResultSchema.parse(parsed)
  const messages = new Map(input.messages.filter(item => item.role === 'user').map(item => [item.eventSeq, item]))
  const settings = new Map(input.settings.map(item => [item.id, item]))
  const drafts: EvolutionProposalDraft[] = []
  for (const operation of result.operations) {
    if (operation.scope !== 'global') throw new Error('Project-scoped learning proposals are no longer supported.')
    if (operation.action === 'add') {
      if (operation.settingId !== null || operation.category === null || operation.content === null || operation.deleteReason !== null) {
        throw new Error('The learning result contains an invalid add operation.')
      }
    } else {
      if (operation.settingId === null) throw new Error(`${operation.action} requires an existing setting id.`)
      const target = settings.get(operation.settingId)
      if (target === undefined) throw new Error(`${operation.action} references an unknown setting.`)
      if (target.scope !== 'global' || target.projectRoot !== null) {
        throw new Error(`${operation.action} references a setting in a different scope.`)
      }
      if (operation.action === 'update'
        && (operation.category === null || operation.content === null || operation.deleteReason !== null)) {
        throw new Error('The learning result contains an invalid update operation.')
      }
      if (operation.action === 'delete'
        && (operation.category !== null || operation.content !== null || operation.deleteReason === null)) {
        throw new Error('The learning result contains an invalid delete operation.')
      }
    }
    const evidence = operation.evidence.map(item => {
      const message = messages.get(item.eventSeq)
      if (message === undefined || !message.text.includes(item.excerpt)) {
        throw new Error('Learning evidence must be copied exactly from a supplied user message.')
      }
      return {
        sessionId: message.sessionId,
        turn: message.turn,
        eventSeq: message.eventSeq,
        excerpt: item.excerpt,
      }
    })
    drafts.push({
      scope: operation.scope,
      projectRoot: null,
      action: operation.action,
      category: operation.category,
      content: operation.content?.trim() ?? null,
      targetId: operation.settingId,
      inference: operation.inference,
      deleteReason: operation.deleteReason,
      evidence,
    })
  }
  return drafts
}
```

</details>

**依据 6 · 源码核查**：[src/evolution/store.ts:178-232](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/store.ts#L178-L232)

去重/pending上限。

<details>
<summary>查看原文（55行）</summary>

```text
  async recordLearningResult(
    run: Omit<EvolutionLearningRun, 'id' | 'proposalCount' | 'createdAt'>,
    drafts: readonly EvolutionProposalDraft[],
  ): Promise<number> {
    return this.mutate((state, now) => {
      const proposals = [...state.proposals]
      let proposalCount = 0
      for (const draft of drafts) {
        const scope: EvolutionScope = 'global'
        const projectRoot = null
        if (draft.action === 'add' && state.settings.some(item => item.scope === scope
          && item.projectRoot === projectRoot
          && item.category === draft.category
          && item.content === draft.content)) continue
        if (draft.action === 'update') {
          const target = state.settings.find(item => item.id === draft.targetId)
          if (target !== undefined && target.category === draft.category && target.content === draft.content) continue
        }
        const duplicate = proposals.find(item => item.status === 'pending'
          && item.scope === scope
          && item.projectRoot === projectRoot
          && item.action === draft.action
          && item.targetId === draft.targetId
          && item.category === draft.category
          && item.content === draft.content)
        if (duplicate !== undefined) {
          const index = proposals.indexOf(duplicate)
          proposals[index] = { ...duplicate, evidence: mergeEvidence(duplicate.evidence, draft.evidence), updatedAt: now }
          proposalCount += 1
          continue
        }
        if (proposals.filter(item => item.status === 'pending').length >= state.config.maxPendingProposals) continue
        proposals.push({
          id: `proposal-${randomUUID()}`,
          ...draft,
          scope,
          projectRoot,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
        })
        proposalCount += 1
      }
      const learningRun: EvolutionLearningRun = {
        id: `run-${randomUUID()}`,
        ...run,
        proposalCount,
        createdAt: now,
      }
      return {
        value: proposalCount,
        state: { ...state, proposals, runs: [...state.runs, learningRun] },
      }
    })
  }
```

</details>

**依据 7 · 源码核查**：[src/evolution/store.ts:234-292](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/store.ts#L234-L292)

批准/备份/状态。

<details>
<summary>查看原文（59行）</summary>

```text
  async actOnProposal(id: string, action: 'apply' | 'dismiss'): Promise<void> {
    await this.mutate((state, now) => {
      const proposal = state.proposals.find(item => item.id === id)
      if (proposal === undefined) throw new Error(`Evolution proposal "${id}" was not found.`)
      if (proposal.status !== 'pending') return { value: undefined, state }
      if (action === 'dismiss') {
        return {
          value: undefined,
          state: {
            ...state,
            proposals: state.proposals.map(item => item.id === id ? { ...item, status: 'dismissed', updatedAt: now } : item),
          },
        }
      }

      const settings = [...state.settings]
      const backup = this.backupOf(state, proposal.scope, proposal.projectRoot, 'proposal', `Before applying ${proposal.action} proposal`, now)
      if (proposal.action === 'add') {
        if (proposal.category === null || proposal.content === null || proposal.targetId !== null) {
          throw new Error('The add proposal is no longer valid.')
        }
        settings.push({
          id: `setting-${randomUUID()}`,
          scope: proposal.scope,
          projectRoot: proposal.projectRoot,
          category: proposal.category,
          content: proposal.content,
          evidence: proposal.evidence,
          createdAt: now,
          updatedAt: now,
        })
      } else {
        const targetIndex = settings.findIndex(item => item.id === proposal.targetId)
        if (targetIndex === -1) throw new Error('The proposal target changed; refresh the proposal list.')
        const target = settings[targetIndex] as EvolutionSetting
        if (!sameScope(target, proposal.scope, proposal.projectRoot)) {
          throw new Error('The proposal target moved to a different instruction scope.')
        }
        if (proposal.action === 'update') {
          if (proposal.category === null || proposal.content === null) throw new Error('The update proposal is incomplete.')
          settings[targetIndex] = {
            ...target,
            category: proposal.category,
            content: proposal.content,
            evidence: mergeEvidence(target.evidence, proposal.evidence),
            updatedAt: now,
          }
        } else {
          settings.splice(targetIndex, 1)
        }
      }
      const proposals = state.proposals.map(item => {
        if (item.id === id) return { ...item, status: 'applied' as const, updatedAt: now }
        if (proposal.targetId !== null && item.status === 'pending' && item.targetId === proposal.targetId) {
          return { ...item, status: 'expired' as const, updatedAt: now }
        }
        return item
      })
      return { value: undefined, state: { ...state, settings, proposals, backups: [...state.backups, backup] } }
```

</details>

**依据 8 · 源码核查**：[src/evolution/store.ts:390-410](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/store.ts#L390-L410)

进程内串行持久替换。

<details>
<summary>查看原文（21行）</summary>

```text

  private mutate<T>(
    operation: (state: EvolutionState, now: number) => { readonly state: EvolutionState; readonly value: T },
  ): Promise<T> {
    const result = this.tail.then(async () => {
      const current = this.state()
      const now = Date.now()
      const outcome = operation(current, now)
      if (outcome.state !== current) {
        await this.global.set({
          ...outcome.state,
          revision: current.revision + 1,
          updatedAt: now,
        })
      }
      return outcome.value
    })
    this.tail = result.then(() => {}, () => {})
    return result
  }
}
```

</details>

**依据 9 · 源码核查**：[src/evolution/prompt.ts:96-111](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/prompt.ts#L96-L111)

全局规则编译。

<details>
<summary>查看原文（16行）</summary>

```text
}

function learningInputPayload(input: EvolutionLearningInput): object {
  return {
    sessionId: input.sessionId,
    settings: input.settings.map(item => ({
      id: item.id,
      scope: item.scope,
      category: item.category,
      content: item.content,
      evidence: item.evidence,
    })),
    pendingProposals: input.proposals.filter(item => item.status === 'pending').map(item => ({
      id: item.id,
      action: item.action,
      scope: item.scope,
```

</details>

**依据 10 · 源码核查**：[src/client/index.tsx:701-711](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/client/index.tsx#L701-L711)

用户apply/证据展示。

<details>
<summary>查看原文（11行）</summary>

```text
      <section style={settingsBandStyle}><h3 style={settingsHeadingStyle}>{t('settingsProposals')}</h3>{proposals.length === 0 ? <p style={settingsTextStyle}>{t('settingsNoProposals')}</p> : <div style={settingsListStyle}>{proposals.map(proposal => <ProposalRow key={proposal.id} proposal={proposal} t={t} saving={saving} onApply={() => mutate(() => evolution.proposal({ id: proposal.id, action: 'apply' }))} onDismiss={() => mutate(() => evolution.proposal({ id: proposal.id, action: 'dismiss' }))} />)}</div>}</section>
      <section style={settingsBandStyle}><div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' }}><h3 style={settingsHeadingStyle}>{t('settingsRules')}</h3><Button size="sm" variant="outline" icon={<IconPlusOutline16 size={14} />} disabled={saving} onClick={() => setDraft({ id: null, category: 'work_rule', content: '' })}>{t('settingsAddRule')}</Button></div>{draft === undefined ? null : <RuleEditor draft={draft} t={t} saving={saving} onCancel={() => setDraft(undefined)} onSave={(mutation) => mutate(() => evolution.setting({ mutation }))} />}{settings.length === 0 ? <p style={settingsTextStyle}>{t('settingsNoRules')}</p> : <div style={settingsListStyle}>{settings.map(setting => <RuleRow key={setting.id} setting={setting} t={t} saving={saving} onEdit={() => setDraft({ id: setting.id, category: setting.category, content: setting.content })} onDelete={() => { if (window.confirm(t('settingsDeleteConfirm'))) mutate(() => evolution.setting({ mutation: { action: 'delete', id: setting.id } })) }} />)}</div>}</section>
      <section style={settingsBandStyle}><h3 style={settingsHeadingStyle}>{t('settingsBackups')}</h3>{backups.length === 0 ? <p style={settingsTextStyle}>{t('settingsNoBackups')}</p> : <div style={settingsListStyle}>{backups.map(backup => <div key={backup.id} style={settingsItemStyle}><span style={settingsMetaStyle}>{backup.summary} · {new Date(backup.createdAt).toLocaleString()}</span><div style={settingsActionsStyle}><Button size="sm" variant="outline" icon={<IconRefreshOutline14 />} disabled={saving} onClick={() => { if (window.confirm(t('settingsRestoreConfirm'))) mutate(() => evolution.restore({ id: backup.id })) }}>{t('settingsRestore')}</Button></div></div>)}</div>}</section>
      <section style={settingsBandStyle}><h3 style={settingsHeadingStyle}>{t('settingsRuns')}</h3>{(dashboard?.runs ?? []).length === 0 ? <p style={settingsTextStyle}>{t('settingsNoRuns')}</p> : <div style={settingsListStyle}>{(dashboard?.runs ?? []).map(run => <div key={run.id} style={settingsItemStyle}><span style={settingsMetaStyle}>{run.status} · {run.turns.join(', ')} · {new Date(run.createdAt).toLocaleString()}</span>{run.error === null ? null : <span style={{ ...settingsMetaStyle, color: 'var(--dsw-alias-label-danger)' }}>{run.error}</span>}</div>)}</div>}</section>
    </>}
    <div style={{ ...settingsActionsStyle, justifyContent: 'flex-end' }}><Button size="sm" variant="outline" onClick={close}>{t('settingsCancel')}</Button></div>
  </div>
}

function ProposalRow({ proposal, t, saving, onApply, onDismiss }: { proposal: EvolutionDashboard['proposals'][number]; t: SettingsProps['t']; saving: boolean; onApply: () => void; onDismiss: () => void }) {
  return <div style={settingsItemStyle}><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}><strong style={settingsMetaStyle}>{proposal.action}</strong>{proposal.category === null ? null : <span style={settingsMetaStyle}>{categoryLabel(proposal.category, t)}</span>}</div>{proposal.content === null ? <span style={settingsTextStyle}>{proposal.deleteReason ?? ''}</span> : <span style={settingsTextStyle}>{proposal.content}</span>}<span style={settingsMetaStyle}>{t('settingsInference')}: {proposal.inference === 'explicit' ? t('settingsExplicit') : t('settingsImplicit')}</span><details><summary style={{ cursor: 'pointer', fontSize: 11 }}>{t('settingsEvidence')} ({proposal.evidence.length})</summary><div style={{ ...settingsMetaStyle, whiteSpace: 'pre-wrap' }}>{proposal.evidence.map(item => `${item.sessionId}#${item.turn}: ${item.excerpt}`).join('\n')}</div></details><div style={settingsActionsStyle}><Button size="sm" variant="outline" icon={<IconCheckOutline16 size={14} />} disabled={saving} onClick={onApply}>{t('settingsApply')}</Button><Button size="sm" variant="ghost" icon={<IconCloseOutline16 size={14} />} disabled={saving} onClick={onDismiss}>{t('settingsDismiss')}</Button></div></div>
```

</details>

**依据 11 · 源码核查**：[src/evolution/service.ts:30-46](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/service.ts#L30-L46)

Remote操作到store。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Apply or dismiss one automatic proposal, then return the refreshed dashboard. */
  async proposal(request: EvolutionProposalRequest): Promise<EvolutionDashboard> {
    await this.store.actOnProposal(request.id, request.action)
    return this.store.dashboard()
  }

  /** Add, update, or delete one approved rule and return the refreshed dashboard. */
  async setting(request: EvolutionSettingRequest): Promise<EvolutionDashboard> {
    await this.store.mutateSetting(request.mutation)
    return this.store.dashboard()
  }

  /** Restore one global backup and return the refreshed dashboard. */
  async restore(request: EvolutionRestoreRequest): Promise<EvolutionDashboard> {
    await this.store.restoreBackup(request.id)
    return this.store.dashboard()
  }
```

</details>

**依据 12 · 源码核查**：[lib/index.js:519-548](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/lib/index.js#L519-L548)

实际发布入口隔离LLM。

<details>
<summary>查看原文（30行）</summary>

```text
async function runEvolutionLearningCall(scope, agent, signal, prompt) {
	signal.throwIfAborted();
	const route = learningRoute(agent);
	const messages = [createUserMessage({
		content: [{
			type: "text",
			text: prompt
		}],
		source: {
			kind: "plugin",
			plugin: "dsh-evolve-modes:evolution-learning"
		}
	})];
	const options = deepFreeze({
		...route,
		messages,
		system: EVOLUTION_LEARNING_SYSTEM_PROMPT,
		signal,
		sessionId: agent.session.id
	});
	const assembler = new BlockAssembler();
	let finished = false;
	for await (const chunk of scope.llm.stream(options)) {
		signal.throwIfAborted();
		assembler.push(chunk);
		if (chunk.type === "finish") finished = true;
	}
	signal.throwIfAborted();
	if (!finished) throw new Error("The self-evolution learning model returned no terminal finish reason.");
	const terminalError = finishError(assembler.finish);
```

</details>

**依据 13 · 源码核查**：[lib/index.js:1324-1331](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/lib/index.js#L1324-L1331)

实际turn钩子。

```text
		scope.on("agent/turn-stopping", async ({ agent, turn, signal }) => {
			const state = stateOf(agent);
			const batch = state.evolution === "propose" ? await queueEvolutionTurn(records, String(agent.session.id), turn, evolutionStore.config().learningBatchSize) : [];
			if (state.quality === "off" && batch.length === 0) return;
			const [review] = await Promise.all([state.quality === "off" ? Promise.resolve(void 0) : reviewTurn(scope, agent, turn, signal, config.shellTool, state.quality), batch.length === 0 ? Promise.resolve() : learnFromTurns(scope, agent, batch, signal, evolutionStore, records)]);
			if (review !== void 0) await addReview(records, String(agent.session.id), review);
		});
	});
```

#### 缺口

- 存储底层durability/多进程、失败重试和宿主真实注入未运行。
  **影响**：不能保证exactly-once或全部崩溃恢复。
  **进一步探讨**：持久失败/重启/并发批准并核规则、队列、备份和真实模型输入。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些边界不能用模式名保证？

**研究主题**：缺陷与关键质疑

#### 完整回答

计划工具白名单含bash/pwsh，reviewer也允许shell；提示要求不修改，但插件按工具名过滤没有解析命令或只读沙箱，所以只读审查不是强制只读执行保证，仍受宿主权限。review fork继承上下文，只有学习call有无历史/无工具隔离，二者不能混称。

自进化off只阻止该源会话继续排学习；全局已批准规则section仅看是否有agent，不检查当前evolution模式，关开关不等撤销规则。scope只有global，项目特例误批会跨项目生效；精确引用证明用户说过，不能证明规则推断长期/全局适用。批准update检查目标仍存在/同scope，未绑定提议生成时的内容revision，人工编辑目标后旧提议可覆盖新意图。pending满会跳过新draft但批次仍可成功清理，应先清积压再以为信息已保留。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:45-64](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/index.ts#L45-L64)

plan允许shell。

<details>
<summary>查看原文（20行）</summary>

```text
const READ_ONLY_REVIEW_TOOLS = ['read', 'glob', 'grep', 'read_image'] as const
const PLAN_EXIT_TOOL = 'exit_plan_mode'

export interface Config { shellTool: 'bash' | 'pwsh' }
export const Config: z<Config> = z.object({ shellTool: z.union(['bash', 'pwsh'] as const).required() })

interface ReviewInput {
  readonly task: string
  readonly candidate: string
  readonly candidateKind: 'answer' | 'approved-plan'
}

/** Return the complete Plan-mode allow-list for a configured platform shell. */
export function planAllowedTools(shellTool: Config['shellTool']): readonly string[] {
  return [...READ_ONLY_REVIEW_TOOLS, shellTool, PLAN_EXIT_TOOL]
}

/** Test whether a requested tool may execute while official Plan mode is active. */
export function isPlanToolAllowed(name: string, shellTool: Config['shellTool']): boolean {
  return planAllowedTools(shellTool).includes(name)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:139-147](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/index.ts#L139-L147)

review同样允许shell。

```text
      parent: agent,
      signal,
      label: profile,
      toolFilter: { allow: [...READ_ONLY_REVIEW_TOOLS, shellTool] },
      prompt: [{ type: 'text', text: reviewPrompt(profile, input) }],
    })
    try {
      const result = await run.result
      const text = result.output.map(block => block.type === 'text' ? block.text : '').join('')
```

**依据 3 · 源码核查**：[src/index.ts:227-245](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/index.ts#L227-L245)

global注入与plan工具名守卫。

<details>
<summary>查看原文（19行）</summary>

```text
    scope.effect(() => scope.systemPrompt.section({
      name: 'evolve-mode:evolution',
      order: 81,
      text: ({ agent }) => agent === undefined
        ? ''
        : compileLearnedInstructions(evolutionStore.state()),
    }), 'dsh-evolve-modes: learned instructions prompt')

    scope.effect(() => scope.on('tools/pre-execute', async (execution, next) => {
      if (execution.agent === undefined || !planModeFor(execution.agent)?.get(execution.agent).active) return next()
      if (isPlanToolAllowed(execution.name, config.shellTool)) return next()
      return {
        kind: 'deny',
        reason: `Plan mode allows only ${planAllowedTools(config.shellTool).join(', ')}. Switch to Execute mode before running ${execution.name}.`,
      }
    }), 'dsh-evolve-modes: plan tool policy')

    scope.effect(() => scope.commands.register({
      name: 'evolve-mode',
```

</details>

**依据 4 · 源码核查**：[src/evolution/prompt.ts:175-202](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/prompt.ts#L175-L202)

证据/目标校验非语义。

<details>
<summary>查看原文（28行）</summary>

```text
        throw new Error(`${operation.action} references a setting in a different scope.`)
      }
      if (operation.action === 'update'
        && (operation.category === null || operation.content === null || operation.deleteReason !== null)) {
        throw new Error('The learning result contains an invalid update operation.')
      }
      if (operation.action === 'delete'
        && (operation.category !== null || operation.content !== null || operation.deleteReason === null)) {
        throw new Error('The learning result contains an invalid delete operation.')
      }
    }
    const evidence = operation.evidence.map(item => {
      const message = messages.get(item.eventSeq)
      if (message === undefined || !message.text.includes(item.excerpt)) {
        throw new Error('Learning evidence must be copied exactly from a supplied user message.')
      }
      return {
        sessionId: message.sessionId,
        turn: message.turn,
        eventSeq: message.eventSeq,
        excerpt: item.excerpt,
      }
    })
    drafts.push({
      scope: operation.scope,
      projectRoot: null,
      action: operation.action,
      category: operation.category,
```

</details>

**依据 5 · 源码核查**：[src/evolution/store.ts:206-218](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/store.ts#L206-L218)

pending满跳过。

<details>
<summary>查看原文（13行）</summary>

```text
          proposalCount += 1
          continue
        }
        if (proposals.filter(item => item.status === 'pending').length >= state.config.maxPendingProposals) continue
        proposals.push({
          id: `proposal-${randomUUID()}`,
          ...draft,
          scope,
          projectRoot,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
        })
```

</details>

**依据 6 · 源码核查**：[src/evolution/store.ts:267-282](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/store.ts#L267-L282)

apply仅存在/同scope检查。

<details>
<summary>查看原文（16行）</summary>

```text
        if (targetIndex === -1) throw new Error('The proposal target changed; refresh the proposal list.')
        const target = settings[targetIndex] as EvolutionSetting
        if (!sameScope(target, proposal.scope, proposal.projectRoot)) {
          throw new Error('The proposal target moved to a different instruction scope.')
        }
        if (proposal.action === 'update') {
          if (proposal.category === null || proposal.content === null) throw new Error('The update proposal is incomplete.')
          settings[targetIndex] = {
            ...target,
            category: proposal.category,
            content: proposal.content,
            evidence: mergeEvidence(target.evidence, proposal.evidence),
            updatedAt: now,
          }
        } else {
          settings.splice(targetIndex, 1)
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1183-1197](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/lib/index.js#L1183-L1197)

发布入口global/白名单一致。

<details>
<summary>查看原文（15行）</summary>

```text
		scope.effect(() => scope.systemPrompt.section({
			name: "evolve-mode:evolution",
			order: 81,
			text: ({ agent }) => agent === void 0 ? "" : compileLearnedInstructions(evolutionStore.state())
		}), "dsh-evolve-modes: learned instructions prompt");
		scope.effect(() => scope.on("tools/pre-execute", async (execution, next) => {
			if (execution.agent === void 0 || !planModeFor(execution.agent)?.get(execution.agent).active) return next();
			if (isPlanToolAllowed(execution.name, config.shellTool)) return next();
			return {
				kind: "deny",
				reason: `Plan mode allows only ${planAllowedTools(config.shellTool).join(", ")}. Switch to Execute mode before running ${execution.name}.`
			};
		}), "dsh-evolve-modes: plan tool policy");
		scope.effect(() => scope.commands.register({
			name: "evolve-mode",
```

</details>

#### 缺口

- 真实宿主shell权限、全局规则冲突和过期批准频度未验。
  **影响**：不能以off/计划/审核作安全隔离或自动纠错。
  **进一步探讨**：专用profile做off后注入/冲突更新和拒绝shell危险调用验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样控制成本与退出，增量假设是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

建议专用Web profile只用低敏感会话，先关闭自动学习或调大批次，确认源provider/model与费用；再一批少量任务查看逐字证据，人工只批准稳定全局偏好，核下一请求和另项目、关开关后的注入。质量审查另算子Agent模型时间；学习一次正常调用可能加一次repair，默认开启与用户完整消息会产生额外披露/token，费用未核不填0。DSH peer较窄且README0.4.0与manifest0.4.1不完全同步，升级先重验；不以安装成功推成兼容。

首次配置/备份、持续复核提议/全局冲突/模型资源、失败清积压与备份恢复、退出删除已批准规则并停插件均有成本。出现误泛化、旧提议覆盖或费用/披露不可控时停学习/评审，检查并删除或恢复全局规则，回手工AGENTS；off本身不足。

可探索批准绑定目标revision及生成时scope说明：现有同scope检查/备份/串行已存在，新增只防人工编辑后过期提议覆盖。对照当前流程做生成→人工改→批准、并发提议和恢复，计误覆盖、过期拒绝率、重新审核负担；若备份人工流程已同效或拒绝更扰人即否定。未实现，不算现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-39](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/package.json#L24-L39)

真实版本/Node/main与发布文件。

<details>
<summary>查看原文（16行）</summary>

```text
  "type": "module",
  "packageManager": "pnpm@10.15.0",
  "engines": { "node": "^22.19.0 || >=24.0.0" },
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
    "./client": { "types": "./lib/types/client/index.d.ts", "default": "./lib/client.js" },
    "./typert": { "types": "./lib/types/typert.d.ts", "default": "./lib/typert.host.js" },
    "./remote": { "types": "./lib/types/remote.d.ts", "default": "./lib/typert.remote-client.js" },
    "./package.json": "./package.json"
  },
  "files": ["lib", "src", "assets", "cordis.patch.yml", "README.md", "README.en.md", "LICENSE", "THIRD_PARTY_NOTICES.md"],
  "scripts": {
    "build": "tsdown && node scripts/normalize-artifacts.mjs && node scripts/copy-types.mjs && node scripts/verify-artifacts.mjs",
    "typecheck": "tsc --noEmit --incremental false",
```

</details>

**依据 2 · 源码核查**：[package.json:66-84](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/package.json#L66-L84)

宿主peer范围。

<details>
<summary>查看原文（19行）</summary>

```text
    "@deepseek-ai/dsh-api-remotes": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-agent": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-agent-presets": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-commands": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-llm": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-plan-mode": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-session": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-storage-domain": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-subagent": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-system-prompt": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-typert-protocol": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "@deepseek-ai/dsh-tools": "^0.1.1-rc.2 || ^0.1.2-rc.1",
    "react": "^18.2.0"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.1",
    "zod": "^4.4.3"
  },
  "devDependencies": {
```

</details>

**依据 3 · 源码核查**：[src/evolution/learning.ts:119-133](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/learning.ts#L119-L133)

额外repair调用。

<details>
<summary>查看原文（15行）</summary>

```text
      const text = await runEvolutionLearningCall(scope, agent, signal, evolutionLearningPrompt(input))
      let drafts: EvolutionProposalDraft[]
      try {
        drafts = parseEvolutionLearningResult(text, input)
      } catch (error: unknown) {
        const repaired = await runEvolutionLearningCall(
          scope,
          agent,
          signal,
          evolutionLearningRepairPrompt(input, text, error),
        )
        drafts = parseEvolutionLearningResult(repaired, input)
      }
      await store.recordLearningResult({ ...run, status: 'completed', error: null }, drafts)
    } else {
```

</details>

**依据 4 · 源码核查**：[src/evolution/store.ts:353-368](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/evolution/store.ts#L353-L368)

备份恢复。

<details>
<summary>查看原文（16行）</summary>

```text
  async restoreBackup(id: string): Promise<void> {
    await this.mutate((state, now) => {
      const backup = state.backups.find(item => item.id === id)
      if (backup === undefined) throw new Error(`Evolution backup "${id}" was not found.`)
      const before = this.backupOf(state, backup.scope, backup.projectRoot, 'restore', `Before restoring ${id}`, now)
      const settings = [
        ...state.settings.filter(item => !sameScope(item, backup.scope, backup.projectRoot)),
        ...backup.settings,
      ]
      const liveIds = new Set(settings.map(item => item.id))
      const proposals = state.proposals.map(item => (
        item.status === 'pending' && item.targetId !== null && !liveIds.has(item.targetId)
          ? { ...item, status: 'expired' as const, updatedAt: now }
          : item
      ))
      return { value: undefined, state: { ...state, settings, proposals, backups: [...state.backups, before] } }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:227-234](https://github.com/GraySilver/dsh-evolve-modes/blob/58b2742ec6f5c38200efdacd38f61c780d7977da/src/index.ts#L227-L234)

关闭学习不移除global注入。

```text
    scope.effect(() => scope.systemPrompt.section({
      name: 'evolve-mode:evolution',
      order: 81,
      text: ({ agent }) => agent === undefined
        ? ''
        : compileLearnedInstructions(evolutionStore.state()),
    }), 'dsh-evolve-modes: learned instructions prompt')

```

#### 缺口

- 真实费用/兼容/效果及版本批准策略未验。
  **影响**：限定可控profile试用。
  **进一步探讨**：记录模型请求与token、状态恢复工时，先测冲突频度。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
