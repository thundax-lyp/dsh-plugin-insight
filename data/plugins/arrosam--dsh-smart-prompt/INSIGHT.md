# dsh-smart-prompt

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[ebdd664](https://github.com/Arrosam/dsh-smart-prompt/tree/ebdd66439b20c50650288af8e91361f273c4aeeb)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Arrosam/dsh-smart-prompt) [![npm 30d 363](https://img.shields.io/static/v1?label=npm+30d&message=363&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-smart-prompt) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-smart-prompt)
<!-- END META -->

> **实现功能**：发送前改写输入草稿，可追问缺失信息、参考会话并检查关键字面细节。

> **核心亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持发送前可撤回澄清加确定性字面gate的具体组合。硬事实检查相对仅提示模型保留信息更可检查，但未对照其他产品源码，不接受作者生态独占主张。

> **风险与缺陷**：[Q03](#research-q03) 说明anchor存在不等于否定、权限和关系语义不变，fenced代码亦不作anchor。最重要的采用条件仍是用户对照原稿审阅，不能把保留计数当语义合格率。

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
  - [Q01 · 什么草稿值得先改写，相比直接交给agent增加什么？](#detail-section-11)
  - [Q02 · 追问、事实检查和长度门怎样衔接？](#detail-section-12)
  - [Q03 · 保留anchor能否保证意图和授权不变？](#detail-section-13)
  - [Q04 · 多轮追问与检索的总成本如何计算？](#detail-section-14)
  - [Q05 · 可否把猜测作为显式决策差异让用户逐项确认？](#detail-section-15)
  - [Q06 · 哪类用户可试，什么输出应保留原稿？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：主要面对口语、指代或缺验收条件的任务草稿，用户交付的是自己确认过的可执行提示词。直接让agent追问也能完成澄清，此项将澄清放到发送前，提供恢复原稿、模式选择和硬事实检查。新增价值是便于先审阅输入，而不是证明任务执行更正确。已经精确且授权敏感的指令，改写可能增加不必要环节；短草稿变长也不自动代表信息更全。

参照直接发送原稿让agent澄清和人工润色；没有对同类增强器做同版本能力排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 草稿改写 | Light/Standard/Detailed整理需求 | 需可用模型，需人审语义 |
| 分轮追问 | 获取用户决定的缺失信息 | 预算耗尽或Skip会结束追问 |
| 字面保留gate | 检查路径标识符等anchor | 有类型数量限制，不证明语义 |
| 长度gate | 控制改写膨胀 | floor、模式与事实补回例外 |

#### 启动与依赖
| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH llm与webServer | 必需 | 模型和接口 | 改写失败并保留原稿 |
| 可用模型路由 | 必需 | 改写与追问 | 返回NO_ROUTE |
| sessions、附件存储 | 场景必需 | 历史与附件 | 相关上下文受限 |
| web搜索 | 可选 | Stardea想法 | 默认关闭，不影响普通改写 |

#### 启动步骤
| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户选模型模式及上下文 | 选定数据发送范围 |
| 改写 | 用户点击星形按钮 | 模型结果或追问面板 |
| 复核 | 用户回答并核对原稿 | 权限、条件和事实一致 |
| 发送或撤销 | 用户确认后发送 | 异常用Revert恢复 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 已有模型及宿主 | 选择模式与上下文权限 | 耗时未知 |
| 持续使用 | 改写、追问、搜索、repair调用 | 回答与审阅新增猜测 | 供应商缓存收益未知 |
| 失败恢复 | 已发生调用与重试 | 恢复原稿、重查授权语义 | 返工成本无测量 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 字面保留 | 提取、检查、repair与末尾补回 | 语义关系不变 |
| 澄清 | 有预算追问和回答记忆 | 问题必要性与用户负担 |
| 长度控制 | ratio加600字符floor | Standard默认无上限及事实再注入例外 |

> **思考**：[Q03](#research-q03) 说明anchor存在不等于否定、权限和关系语义不变，fenced代码亦不作anchor。最重要的采用条件仍是用户对照原稿审阅，不能把保留计数当语义合格率。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持发送前可撤回澄清加确定性字面gate的具体组合。硬事实检查相对仅提示模型保留信息更可检查，但未对照其他产品源码，不接受作者生态独占主张。

[Q01](#research-q01) 与 [Q02](#research-q02) 支持发送前可撤回澄清加确定性字面gate的具体组合。硬事实检查相对仅提示模型保留信息更可检查，但未对照其他产品源码，不接受作者生态独占主张。

orchestrator与Cordis隔离、gate纯函数化便于确定性核查。字面anchor数量上限、代码claim和事实优先长度是重要设计取舍，移植应保留这些边界并补语义对照；不从注释测试宣称实测通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 说明anchor存在不等于否定、权限和关系语义不变，fenced代码亦不作anchor。最重要的采用条件仍是用户对照原稿审阅，不能把保留计数当语义合格率。

<a id="detail-section-6"></a>

### 1.5 使用建议

愿意审阅发送前文本、经常写模糊需求的人可从Light和非关键任务试用；先关闭不必要搜索，检查模型与附件发送范围，再对照原稿看约束、否定和权限。成功是相同任务更少来回且总费用和确认时间可接受；出现新增授权、改变验收、长代码丢失或猜测被误当事实时恢复原稿。无需预改写的精确命令直接保持原输入。当前只支持受控试用，不能称无需猜测或自动安全。 [Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

改写、追问与字面gate有源码支持；语义保真和净交付收益未验证；决策差异卡是假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/orchestrate.ts、src/fidelity.ts、src/anchors.ts、src/length-gate.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：README、入口、orchestrate、anchors、fidelity及length-gate固定源码。
- 下一步：- 已检查固定源码和README。
- 未执行模型、目标测试、浏览器或宿主安装。
- 语义保真、下游质量与全流程成本仍缺实测。

**分析版本**

- **仓库**：[Arrosam/dsh-smart-prompt](https://github.com/Arrosam/dsh-smart-prompt)
- **版本号**：1.2.0（[固定提交 ebdd664](https://github.com/Arrosam/dsh-smart-prompt/tree/ebdd66439b20c50650288af8e91361f273c4aeeb)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 的未验证方向是新增约束与授权的显式差异确认，按越界率、发现率与确认时间验证，若误报负担抵消收益则否定。

- 已检查固定源码和README。
- 未执行模型、目标测试、浏览器或宿主安装。
- 语义保真、下游质量与全流程成本仍缺实测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1175 | — | — | 17261 |
| .js | source | 25 | 6110 | 4286 | 1834 | — |
| .mjs | source | 1 | 193 | 163 | 20 | — |
| .ts | source | 38 | 7185 | 4364 | 2203 | — |
| .mjs | test | 30 | 12974 | 10562 | 1180 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Arrosam/dsh-smart-prompt/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Arrosam/dsh-smart-prompt/issues?q=is%3Aissue+created%3A2026-09-24T05%3A56%3A44.701Z..2026-10-24T05%3A56%3A44.701Z)

暂未获取：近30天关闭。

统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：草稿改写能否在澄清目标时保住用户事实和决策权？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么草稿值得先改写，相比直接交给agent增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

主要面对口语、指代或缺验收条件的任务草稿，用户交付的是自己确认过的可执行提示词。直接让agent追问也能完成澄清，此项将澄清放到发送前，提供恢复原稿、模式选择和硬事实检查。新增价值是便于先审阅输入，而不是证明任务执行更正确。已经精确且授权敏感的指令，改写可能增加不必要环节；短草稿变长也不自动代表信息更全。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-38](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/README.md#L23-L38)

发送前改写、撤回与错误保留原稿。

<details>
<summary>查看原文（16行）</summary>

```text
## Use it

1. Type a draft, for example:
   > can you change maxRatioFor in src/host/config.ts to 2.5 and check it with `pnpm build`
2. Click **✦**. After a few seconds the draft becomes:
   > Change `maxRatioFor` in `src/host/config.ts` to `2.5`, then verify with `pnpm build`.
3. A short note above the composer shows the result: how many hard facts were kept, the length change, and the time taken.
4. Not happy with it? Use the **Revert | Retry** buttons next to ✦:
   - **Revert** puts your original draft back.
   - **Retry** generates a new version from your original draft.

   They stay available until you edit or send the draft.

Click ✦ again while it is working to cancel. If anything goes wrong (no model, timeout, network error), your draft is left untouched and a short error explains why.

Slash commands work too: in `/bugfix <text>` the command stays as is and only the text is rewritten.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 追问、事实检查和长度门怎样衔接？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

orchestrator建立同一RefineChat，将草稿、可选上下文和附件交给模型，按模式解析问题并逐轮等待用户。追问预算耗尽或Skip时，Standard/Detailed可要求猜测补充。回答归入lengthBase并重新提取anchors。结果先检查事实与长度，最多一次repair，无工具检索；仍缺失的字面anchor追加到末尾。长度最终检查对再注入事实让步。依赖llm与webServer，session、附件和web搜索按场景提供。此链路能解释回退，却不是对模型语义的证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/orchestrate.ts:315-340](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/src/orchestrate.ts#L315-L340)

模型会话、查找预算与提取事实。

<details>
<summary>查看原文（26行）</summary>

```text
  const policy = FOLLOW_UP_POLICY[input.mode]
  // Questions a recalled memo already used count against the cap.
  const recalledAsked = memo?.asked ?? 0
  let questionsLeft = Math.max(0, maxQuestions - recalledAsked)
  // Only invite questions when someone can answer them; otherwise the rewrite stays as before.
  // A recalled memo ends the asking, except in a mode that asks again after answers.
  const canAsk = maxQuestions > 0 && input.sessionId !== '' && deps.askUser !== undefined
    && (memo === undefined || (policy.askAgain && questionsLeft > 0))
  const ask = canAsk ? deps.askUser?.(input.sessionId) : undefined

  // ---- the refinement's one conversation: system prompt and tools fixed from here on ----
  const sources = lookupSources(deps, input, ask !== undefined)
  const instructions = ask !== undefined
    ? [questionsPrompt(maxQuestions), stardeaPrompt(stardeaIdeas, stardeaRounds), answersPrompt()]
    : memo !== undefined ? [answersPrompt()] : []
  const chat = new RefineChat({
    llm, route, config: cfg,
    lookups: new Lookups([...sources.session, ...sources.web]),
    system: (withTools) => buildSystemPrompt(input.mode, cfg, [...instructions, ...attachmentExtra, ...(withTools ? [lookupPrompt(lookupRounds)] : [])]),
  })
  // The rewrite steps share one round budget; the web serves Stardea ideas only.
  const rewriteBudget = new RoundBudget(lookupRounds)
  const rewriteTools = Lookups.namesOf(sources.session)
  const noTools: ReadonlySet<string> = new Set()

  let anchors = cfg.fidelityGate ? extractAnchors(draft) : []
```

</details>

**依据 2 · 源码核查**：[src/orchestrate.ts:363-418](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/src/orchestrate.ts#L363-L418)

追问循环和回答并入检查基线。

<details>
<summary>查看原文（56行）</summary>

```text
  // ---- follow-up rounds, with Stardea ideas on request ----
  // Light runs one round; Standard and Detailed ask one question per round until nothing is
  // missing or the cap is reached (FOLLOW_UP_POLICY).
  const ideaTools = Lookups.namesOf([...sources.session, ...sources.web])
  while (ask !== undefined && parsed.questions.length > 0) {
    const asked = parsed.questions
    askedCount += asked.length
    questionsLeft -= asked.length
    const questions = asked.map((question, index) => ({ id: questionId(index), question, header: QUESTION_HEADER }))
    // Settling the questions stops any idea request still running, so the rewrite never waits for one.
    const asking = new AbortController()
    const ideas = new IdeaBook()
    const stardea: Stardea = async (id, signal) => {
      const question = questions.find((candidate) => candidate.id === id)
      if (question === undefined || asking.signal.aborted) return refuse(ERR.NO_RUN, MESSAGE.NO_RUN)
      const result = await chat.step({ text: stardeaTurn(id, question.question, ideas.has(id), stardeaIdeas) },
        new RoundBudget(stardeaRounds), ideaTools, AbortSignal.any([signal, input.signal, asking.signal]))
      if (!result.ok) return failureOf(result.failure, cfg)
      const found = parseIdeas(result.text)
      if (found.length === 0) return refuse(ERR.EMPTY_OUTPUT, MESSAGE.NO_IDEAS)
      return { ok: true, ideas: ideas.add(id, found, stardeaIdeas) } satisfies StardeaOutcome
    }
    let reply: SeamAnswer | undefined
    try {
      reply = await ask(questions, input.signal, stardea)
    } catch {
      // Dismissed: the refinement is cancelled (checked below).
      reply = undefined
    } finally {
      asking.abort()
    }
    const answered = reply !== undefined ? answeredQuestions(asked, reply) : []
    // Remembered before the abort check: answers given just before a cancel still count.
    if (answered.length > 0) {
      memo = { asked: recalledAsked + askedCount, answered: [...(memo?.answered ?? []), ...answered] }
      memory?.remember(input.sessionId, draft, memo)
    }
    if (input.signal.aborted) return aborted()

    // Nothing answered (Skip): Light keeps the rewrite; Standard and Detailed rewrite with guesses.
    if (answered.length === 0 && !policy.guessOnSkip) break

    // ---- rewrite once more, in the same conversation ----
    const state: FollowUpState = answered.length === 0 ? { kind: 'skipped' } : policy.askAgain ? askState('limit') : { kind: 'limit' }
    const turn = answered.length > 0 ? answersTurn(formatAnswers(answered)) : skippedTurn()
    const next = await chat.step({ text: turn + statusNote(state) }, rewriteBudget, rewriteTools, input.signal)
    if (!next.ok) return failureOf(next.failure, cfg)
    parsed = parseRewrite(next.text, state.kind === 'open' ? questionsForReply(policy, questionsLeft) : 0)
    const folded = normalizeOutput(parsed.text)
    if (folded === '') return refuse(ERR.EMPTY_OUTPUT, MESSAGE.UNUSABLE_OUTPUT)
    enhanced = folded
  }

  // The length budget covers what the user supplied: the draft plus their answers.
  const lengthBase = memo !== undefined ? draft + '\n' + memo.answered.map((a) => a.answer).join('\n') : draft
  if (memo !== undefined && cfg.fidelityGate) anchors = extractAnchors(lengthBase)
```

</details>

**依据 3 · 源码核查**：[src/orchestrate.ts:420-454](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/src/orchestrate.ts#L420-L454)

repair、再注入和长度优先级。

<details>
<summary>查看原文（35行）</summary>

```text
  // ---- gates ----
  let fidelity = checkFidelity(anchors, enhanced)
  const verdict = cfg.lengthGate ? lengthVerdict(lengthBase, enhanced, maxRatio) : { kind: 'ok' as const, ratio: 1 }

  if ((fidelity.missing.length > 0 || verdict.kind === 'converge') && !input.signal.aborted) {
    const clauses: string[] = []
    if (verdict.kind === 'converge') clauses.push(lengthRepairClause(charLength(enhanced), verdict.charBudget))
    if (fidelity.missing.length > 0) clauses.push(repairClause(fidelity.missing))

    // The repair runs no lookups: it only reworks the rewrite already in the conversation.
    const repair = await chat.step({ text: clauses.join('\n').trim() }, new RoundBudget(0), noTools, input.signal)
    if (repair.ok) {
      const repaired = cleanRewrite(repair.text)
      if (repaired !== '') {
        enhanced = repaired
        fidelity = checkFidelity(anchors, enhanced)
      }
    }
  }
  if (input.signal.aborted) return aborted()

  // ---- deterministic last resort: never silently lose a fact ----
  let reinjected = 0
  if (cfg.fidelityGate && fidelity.missing.length > 0) {
    const block = reinjectionBlock(fidelity.missing)
    if (block !== '') {
      enhanced = enhanced + block
      reinjected = fidelity.missing.length
    }
  }

  // ---- final length judgement: a re-appended fact outranks the ceiling ----
  const final = lengthVerdict(lengthBase, enhanced, maxRatio)
  if (cfg.lengthGate && reinjected === 0 && final.kind === 'converge') {
    return refuse(ERR.LENGTH_EXCEEDED, MESSAGE.lengthExceeded(charLength(enhanced), final.charBudget, formatRatio(final.ratio)))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 保留anchor能否保证意图和授权不变？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。anchors识别路径、标识符、版本和特定数字模式，最多200项，短于2字符或超过部分长度的片段有限制，fenced code被claim但不作为anchor记录。即使文件名和数字全部仍在，否定句、条件顺序或“只检查不执行”仍可能改变；将遗漏字符串放到末尾也不能证明其与正文关系正确。独立纯函数gate和单次修复便于测试复用，但作者注释的“所有增强器都不检查”等生态独占说法未得到独立参照支持。

#### 证据与依据

**依据 1 · 源码核查**：[src/anchors.ts:22-27](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/src/anchors.ts#L22-L27)

数量和长度边界。

```text
/** Maximum anchors tracked; beyond this the gate reports honestly rather than growing unbounded. */
const MAX_ANCHORS = 200
/** Anchors shorter than this are noise (single letters, one-digit numbers). */
const MIN_LENGTH = 2
/** Cap for one kept span. */
const MAX_CODE_LENGTH = 120
```

**依据 2 · 源码核查**：[src/anchors.ts:44-65](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/src/anchors.ts#L44-L65)

fenced code不记录及有限模式集。

<details>
<summary>查看原文（22行）</summary>

````text
/**
 * Ordered matchers; earlier matchers claim their spans so later ones cannot re-read
 * them. A fenced code block is CLAIMED but not recorded — it is normally the payload
 * the user pasted, not a fact the surrounding prose must reproduce — while an inline
 * \`code\` span is short, specific, and always recorded.
 */
const MATCHERS: ReadonlyArray<Matcher> = [
  { kind: 'code', pattern: /```[\s\S]*?```/g, claimOnly: true },
  { kind: 'code', pattern: /`[^`\n]+`/g },
  { kind: 'url', pattern: /https?:\/\/[^\s<>()[\]"'`]+/g },
  { kind: 'ref', pattern: /(?:^|[\s(\[{,，。；;])@([A-Za-z0-9_][A-Za-z0-9_./-]{1,})/g },
  // any path with at least one separator: absolute, drive-lettered, ./-relative, or bare-relative
  { kind: 'path', pattern: /(?:[A-Za-z]:)?(?:\/|\.{1,2}\/)?[A-Za-z0-9_.@-]+(?:\/[A-Za-z0-9_.@*-]+)+/g },
  // bare file names carrying a known extension
  { kind: 'path', pattern: new RegExp('\\b[A-Za-z0-9_@-][A-Za-z0-9_.@-]*\\.(?:' + FILE_EXTENSIONS + ')\\b', 'gi') },
  { kind: 'version', pattern: /\bv?\d+(?:\.\d+){1,3}(?:-rc\.?\d*)?\b/gi },
  { kind: 'number', pattern: /\b\d+(?:\.\d+)?\s?(?:%|px|em|rem|ms|s|m|h|kb|mb|gb|tb|k|w|次|个|秒|分钟|小时|天|行|条|页)\b/gi },
  // dotted paths first: they must claim the whole token before camelCase reads a segment
  { kind: 'identifier', pattern: /\b[a-z][A-Za-z0-9]*(?:\.[a-z][A-Za-z0-9]*){1,4}\b/g },
  { kind: 'identifier', pattern: /\b[a-z][a-zA-Z0-9]*(?:[A-Z][A-Za-z0-9]*)+\b/g },
  { kind: 'identifier', pattern: /\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g },
  { kind: 'identifier', pattern: /\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b/g },
````

</details>

**依据 3 · 源码核查**：[src/fidelity.ts:30-38](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/src/fidelity.ts#L30-L38)

判断是anchor存在而非语义蕴含。

```text
export function checkFidelity(anchors: readonly Anchor[], enhanced: string): FidelityOutcome {
  const raw = typeof enhanced === 'string' ? enhanced : ''
  const normalized = normalizeForMatch(raw)
  const stripped = stripWhitespace(raw)
  const missing: Anchor[] = []
  for (const anchor of anchors) {
    if (!anchorSurvives(anchor, normalized, raw, stripped)) missing.push(anchor)
  }
  return { total: anchors.length, kept: anchors.length - missing.length, missing }
```

#### 缺口

- 否定、授权和条件关系保真，以及改写后的任务质量没有对照。
  **影响**：不可把硬事实计数当作安全或语义证书。
  **进一步探讨**：用相同草稿含否定、一次性授权和代码payload对比原稿与改写执行结果，记录越界率。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 多轮追问与检索的总成本如何计算？

**研究主题**：效果与总成本

#### 完整回答

一个合格提示词需用户确认后让下游完成同一任务，成本必须含改写、追问、Stardea、检索、repair和返工。共享聊天前缀可能有缓存条件收益，仍需供应商实际报告；每轮追问与每次想法按钮可能追加调用。附件和历史会发到所选模型，外部搜索会追加隐私与网络边界。用户还要回答和复核猜测。配置提供预算上限，却没有给本轮任务的现金与时间数据，不能从“更清晰”推断净节省。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:68-89](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/README.md#L68-L89)

作者列出追问、想法、检索和repair成本。

<details>
<summary>查看原文（22行）</summary>

```text
In **Standard** and **Detailed** mode the questions come one at a time. After each answer the prompt is rewritten and, if something only you can decide is still missing, the next question opens, until nothing is missing or **Follow-up questions** (the limit, default 5) have been asked in total. Then, and also when you click **Skip** or questions cannot be asked at all (limit 0, or an API request without a session), the remaining gaps are filled with guesses, and each guess is listed under **Guessed details** (`## 猜测补充` for a Chinese draft) at the end of the rewrite, so you can see and correct them. **×** still cancels without changing your draft. In **Light** mode every question comes in one panel, and the prompt is rewritten once with your answers.

### Stardea (星念)

Not sure how to answer a question? Click the **Stardea** button next to it. Stardea suggests up to 4 answers (set **Stardea ideas per click**). It finds them by searching the current conversation, proposing its own ideas, and, if you turn on **Stardea web search**, searching the web with DSH's web search. Each suggestion is labeled with where it came from.

- Tick one or more suggestions, with or without your own words. Everything you tick and type becomes that question's answer.
- None of them fit? Click **Stardea** again. It adds more suggestions below the earlier ones, each different from them, and the earlier ones stay.
- Each click searches for up to **Stardea search rounds** rounds (default 1; see [Settings](#settings)). With 0 rounds, Stardea only proposes its own ideas. Web search is off by default, and works only when DSH has a web search provider set up.

### Token use

When a refine finishes, the note above the composer shows its tokens as `input(cached) - output`. For example, `tokens 1200(3400) - 560` means 1,200 input tokens that missed the cache, 3,400 input tokens read from the cache, and 560 output tokens. The figures cover every model call of the refine, Stardea included. They appear only when the model provider reports token use.

All model calls of one refine continue a single conversation, so each call starts with the previous call's request unchanged. Providers with prompt caching then bill those repeated tokens as cache hits. Lookup results found earlier, including those found by Stardea, stay available to the later calls.

## What it guarantees

- **Nothing important is lost.** Before rewriting, the plugin lists the hard facts in your draft: file paths, identifiers, numbers and versions, URLs, `code`, and @mentions. It then checks that each one survived. If the model dropped one, it gets one more try. If a fact is still missing, it is added back at the end under "Preserved original details".
- **Nothing is invented.** A vague draft is not padded with made-up requirements. Gaps are asked about instead. In Standard and Detailed modes, a gap still open when asking ends is filled with a guess that is listed under **Guessed details**; in Light mode it is marked `(TBD: …)`.
- **No runaway length in Light mode.** A Light rewrite may grow to 2× the draft, and always at least 600 characters. A longer result gets one chance to shorten. If it is still too long, it is discarded and your draft is kept. Standard and Detailed modes have no length cap by default (set `standardMaxRatio` to add one).
- **Few model calls per click**: the rewrite, one more rewrite per round of follow-up questions (in Light mode only when you answered; in Standard and Detailed modes also after **Skip**), and one repair. Each lookup round adds one call, up to **Session lookup rounds** (default 3). Each Stardea click adds one call, plus up to **Stardea search rounds** more (default 1).
```

</details>

**依据 2 · 源码核查**：[src/orchestrate.ts:375-383](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/src/orchestrate.ts#L375-L383)

Stardea每次单独调用与预算。

```text
    const stardea: Stardea = async (id, signal) => {
      const question = questions.find((candidate) => candidate.id === id)
      if (question === undefined || asking.signal.aborted) return refuse(ERR.NO_RUN, MESSAGE.NO_RUN)
      const result = await chat.step({ text: stardeaTurn(id, question.question, ideas.has(id), stardeaIdeas) },
        new RoundBudget(stardeaRounds), ideaTools, AbortSignal.any([signal, input.signal, asking.signal]))
      if (!result.ok) return failureOf(result.failure, cfg)
      const found = parseIdeas(result.text)
      if (found.length === 0) return refuse(ERR.EMPTY_OUTPUT, MESSAGE.NO_IDEAS)
      return { ok: true, ideas: ideas.add(id, found, stardeaIdeas) } satisfies StardeaOutcome
```

#### 缺口

- 同任务最终成功率、完整调用费用与复核耗时未知。
  **影响**：无法判断预改写是否比直接问agent划算。
  **进一步探讨**：对同批草稿统计完整下游交付成本与用户确认时间，含撤销和失败样本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否把猜测作为显式决策差异让用户逐项确认？

**研究主题**：新假设与验证

#### 完整回答

从字面保留不能约束新增意思，以及跳过后会猜测两点推导，未验证设计是将新增约束、权限和交付要求列成差异卡，用户只确认真正需要的部分。它不同于把所有猜测作为正文一次接受，可能更好保留决策权；新增负担是更多确认和语义差异识别误报。最小实验使用含模糊授权的草稿，与现版猜测章节比较用户发现新增条件的比例、确认时间及下游越界。若误报太多或越界不降，便不支持该方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/orchestrate.ts:402-418](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/src/orchestrate.ts#L402-L418)

Skip后继续生成和回答合并。

<details>
<summary>查看原文（17行）</summary>

```text
    // Nothing answered (Skip): Light keeps the rewrite; Standard and Detailed rewrite with guesses.
    if (answered.length === 0 && !policy.guessOnSkip) break

    // ---- rewrite once more, in the same conversation ----
    const state: FollowUpState = answered.length === 0 ? { kind: 'skipped' } : policy.askAgain ? askState('limit') : { kind: 'limit' }
    const turn = answered.length > 0 ? answersTurn(formatAnswers(answered)) : skippedTurn()
    const next = await chat.step({ text: turn + statusNote(state) }, rewriteBudget, rewriteTools, input.signal)
    if (!next.ok) return failureOf(next.failure, cfg)
    parsed = parseRewrite(next.text, state.kind === 'open' ? questionsForReply(policy, questionsLeft) : 0)
    const folded = normalizeOutput(parsed.text)
    if (folded === '') return refuse(ERR.EMPTY_OUTPUT, MESSAGE.UNUSABLE_OUTPUT)
    enhanced = folded
  }

  // The length budget covers what the user supplied: the draft plus their answers.
  const lengthBase = memo !== undefined ? draft + '\n' + memo.answered.map((a) => a.answer).join('\n') : draft
  if (memo !== undefined && cfg.fidelityGate) anchors = extractAnchors(lengthBase)
```

</details>

**依据 2 · 源码核查**：[src/fidelity.ts:30-38](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/src/fidelity.ts#L30-L38)

现gate不识别新增条件。

```text
export function checkFidelity(anchors: readonly Anchor[], enhanced: string): FidelityOutcome {
  const raw = typeof enhanced === 'string' ? enhanced : ''
  const normalized = normalizeForMatch(raw)
  const stripped = stripWhitespace(raw)
  const missing: Anchor[] = []
  for (const anchor of anchors) {
    if (!anchorSurvives(anchor, normalized, raw, stripped)) missing.push(anchor)
  }
  return { total: anchors.length, kept: anchors.length - missing.length, missing }
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪类用户可试，什么输出应保留原稿？

**研究主题**：采用判断

#### 完整回答

愿意审阅发送前文本、经常写模糊需求的人可从Light和非关键任务试用；先关闭不必要搜索，检查模型与附件发送范围，再对照原稿看约束、否定和权限。成功是相同任务更少来回且总费用和确认时间可接受；出现新增授权、改变验收、长代码丢失或猜测被误当事实时恢复原稿。无需预改写的精确命令直接保持原输入。当前只支持受控试用，不能称无需猜测或自动安全。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-54](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/README.md#L30-L54)

恢复、模式与附件范围。

<details>
<summary>查看原文（25行）</summary>

```text
4. Not happy with it? Use the **Revert | Retry** buttons next to ✦:
   - **Revert** puts your original draft back.
   - **Retry** generates a new version from your original draft.

   They stay available until you edit or send the draft.

Click ✦ again while it is working to cancel. If anything goes wrong (no model, timeout, network error), your draft is left untouched and a short error explains why.

Slash commands work too: in `/bugfix <text>` the command stays as is and only the text is rewritten.

### Modes

Switch the improvement method fast by **holding the ✦ star** in the composer, or choose it in **Settings → Plugins → dsh-smart-prompt**. Both change the same saved setting, so they always agree. Hold the star for a moment (or start sliding it sideways) and a capsule-shaped mode bar opens above it, floating over the page without moving anything. Left to right it shows **Detailed ← Standard → Light**, each with its icon and name, with the active mode under your pointer. Slide to the mode you want and let go: the setting is saved at once. Sliding past either end stays on that end (it does not wrap around); letting go without sliding, or pressing **Esc**, keeps the mode. A click without holding or sliding still improves the draft.

The star's icon shows the active mode, also after a reload: a stretched star writing on a page for **Detailed**, the usual ✦ for **Standard**, and a lightning bolt for **Light**. While a rewrite runs, each icon has its own animation: the ✦ spins (Standard), the star-pen writes its line on the page again and again (Detailed), and the lightning bolt strikes with a quick double flash (Light).

The first time the star appears, a small window above the composer explains the hold-and-slide and what each mode does. It shows once per browser and never blocks the composer: keep typing, or close it with **Got it** or ×.

- **Standard** (default) — restructures the draft so an agent can execute it: deliverable, constraints, steps, output format. It never leaves `(TBD: …)` notes: what only you can decide is asked **one question at a time** (see [Follow-up questions](#follow-up-questions)), and once asking ends the remaining gaps are filled with guesses listed under **Guessed details** at the end of the rewrite.
- **详细模式 (Detailed)** — goes further: ordered next steps, the cautions to watch while executing, and the exact standard for every concrete detail. The prompt sets no length target; the bar is that the executing agent never has to guess a detail. It shares Standard's settings, including the optional length ceiling (`standardMaxRatio`, uncapped by default), and Standard's follow-up questions: one at a time, no `(TBD: …)` notes, guesses listed under **Guessed details** once asking ends. When the draft only names a direction instead of a result — a short qualifier like "softer", a request like "give me a sense of…", an analogy like "light like feather", a mood reference like "a vibe of kawaii bass" — it asks what exactly you want and points you at **Stardea (星念)** for candidate answers.
- **Light** — only removes filler and clears up ambiguity, keeping the draft's structure (at most 2× the draft).

### Attachments

Images and files attached in the composer are sent to the refining model along with the draft, so "fix the error in this screenshot" or "follow the attached spec" is rewritten with them in view. Text files are read, up to the first 20,000 characters of each. Other files are named but not read. The attachments stay in the composer and still go to the agent when you send. Wait for file uploads to finish before you click ✦.
```

</details>

**依据 2 · 源码核查**：[src/anchors.ts:44-51](https://github.com/Arrosam/dsh-smart-prompt/blob/ebdd66439b20c50650288af8e91361f273c4aeeb/src/anchors.ts#L44-L51)

代码payload非anchor解释停止条件。

````text
/**
 * Ordered matchers; earlier matchers claim their spans so later ones cannot re-read
 * them. A fenced code block is CLAIMED but not recorded — it is normally the payload
 * the user pasted, not a fact the surrounding prose must reproduce — while an inline
 * \`code\` span is short, specific, and always recorded.
 */
const MATCHERS: ReadonlyArray<Matcher> = [
  { kind: 'code', pattern: /```[\s\S]*?```/g, claimOnly: true },
````

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
