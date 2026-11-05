# StudyHub

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[07b5469](https://github.com/EricWang1358/dsh-web-studyhub/tree/07b5469fe002beb762584a440e3b96836ee7d4e0)

<!-- BEGIN META -->
[![GitHub ★ 165](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=165&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EricWang1358/dsh-web-studyhub) [![npm 30d 812](https://img.shields.io/static/v1?label=npm+30d&message=812&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ericwang1358/dsh-daily-flashcard) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ericwang1358/dsh-daily-flashcard)
<!-- END META -->

> **功能**：把讲义等资料生成有来源的练习题，支持复习、题库与音频转录。

> **亮点**：[Q01](#research-q01) 把选段、候选和发布组成可查流程。

> **主要限制**：[Q03](#research-q03) 模型审核不等于题目正确，模型调用也会外发片段。

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
  - [Q01 · 选段出题比手做卡片多了什么？](#detail-section-11)
  - [Q02 · 审核完成后如何避免重复发布？](#detail-section-12)
  - [Q03 · 本地资料什么时候会发给提供方？](#detail-section-13)
  - [Q04 · 如何先用且保留人工退路？](#detail-section-14)
  - [Q05 · 来源回链能减少发现错题的时间吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用讲义复习的学生可评估生成题与来源回链。

手工编题可核查出处，但要逐题关联。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 选段出题 | 从讲义生成卡片 | 需要模型连接 |
| 发布 | 将通过审核的内容写入题库 | 需核对版本和正确性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH | 必需 | 加载界面 | 无法使用 |
| 模型或转录凭据 | 相应功能需要 | 处理输入 | 改用手工题目 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 导入可外发资料 | 核对权限 |
| 核查 | 生成草稿并复读来源 | 确认后发布 |
| 退出 | 保留本地资料 | 继续手工 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 配置与资源费未知 | 安装耗时未知 | 选合适 provider |
| 持续 | 模型费未知 | 审核耗时未知 | 样例练习与生成不同 |
| 恢复 | 重试费未知 | 修题耗时未知 | 版本或提交异常 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 来源绑定 | 选段随候选进入题库 | 学习效果与题目质量 |

> **思考**：[Q03](#research-q03) 模型审核不等于题目正确，模型调用也会外发片段。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把选段、候选和发布组成可查流程。

审核、计划、写入和回执可区分。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 模型审核不等于题目正确，模型调用也会外发片段。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用可外发资料先生成少量题并人工核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的选段出题、题库发布与模型数据边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/contexts/generation/selection.js、lib/contexts/generation/jobs/publish-step.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的选段出题、题库发布与模型数据边界。未执行目标代码或实际宿主验证。
- 下一步：固定讲义和题目做盲评

**分析版本**

- **仓库**：[EricWang1358/dsh-web-studyhub](https://github.com/EricWang1358/dsh-web-studyhub)
- **版本号**：4.3.6（[固定提交 07b5469](https://github.com/EricWang1358/dsh-web-studyhub/tree/07b5469fe002beb762584a440e3b96836ee7d4e0)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较回链对错题审核的帮助。

固定讲义和题目做盲评

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 201 | 27205 | — | — | 738061 |
| .js | source | 1106 | 108665 | 84656 | 16940 | — |
| .mjs | source | 157 | 24251 | 20922 | 2351 | — |
| .jsx | source | 384 | 42913 | 36955 | 4203 | — |
| .mjs | test | 1308 | 183417 | 162597 | 7938 | — |
| .mjs | example | 41 | 2760 | 2499 | 171 | — |
| .md | example | 6 | 493 | — | — | 3893 |
| .cjs | example | 1 | 59 | 50 | 4 | — |
| .js | example | 2 | 275 | 251 | 11 | — |
| .jsx | test | 4 | 246 | 214 | 10 | — |
| .cjs | test | 1 | 25 | 15 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/EricWang1358/dsh-web-studyhub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 114](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=114&color=737b86&logo=github)](https://github.com/EricWang1358/dsh-web-studyhub/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 121](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=121&color=737b86&logo=github)](https://github.com/EricWang1358/dsh-web-studyhub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：选段出题、题库发布与模型数据边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 选段出题比手做卡片多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

从讲义选一段后，生成路径读取对应证据，并把选段附到通过审核的卡片。与手工复制题干和页码相比可减少重复标记，但引用存在并不证明题目、答案或原文关系正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-33](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/README.md#L24-L33)

作者描述来源回链与练习

<details>
<summary>查看原文（10行）</summary>

```text
## What you can do

- **Make questions from your own sources.** Pick pages or chapters and generate flashcards, single- or multiple-choice, open-response or fill-in-the-blank questions. Every question cites its passage, and you review the draft before you publish it.
- **Move between questions and sources.** A citation opens the passage it came from. In a source, paragraph and table markers lead to the questions and explanations linked to them.
- **Practise and review.** Start today's study from the **Study library**, follow a **Learning flow** (a short lesson, then practice), click **Help me understand** on any question, and let FSRS-6 schedule your reviews.
- **Add exam focus highlights, even from screenshots.** Drop chat screenshots, whiteboard photos or scope notes into **Add exam focus…** (works with both vision and text-only models such as DeepSeek): focus topics schedule at shorter intervals, go first in daily rounds and study plans, and generate deeper application and advanced questions. Once topics are saved, the home shows how many are mastered, not yet and without questions, with a link to practise the ones you can't do yet; **Course settings** lists each topic with its questions.
- **Find weak points.** Use **Mistakes & weak points**, **Statistics** and **Mock exam**, which offers a multiple-choice paper, a case paper or an oral interview.
- **Finish with a daily recap.** After answering 10 distinct questions in one course on the same day, generate one recap across its chapters. Retries count once. Choose a friendly or professional tone and opt into automatic generation in Settings. Recaps use the source reader; saving one as a source and publishing on CSDN are separate actions.
- **Turn recordings into text.** Import a lecture recording, or transcribe a **Live class** as it happens, and get a Chinese–English transcript you can generate questions from.
- **Read and organise.** The reader has a table of contents, search, **Translate this page** and **Practise these pages**. Courses, **Study notes**, **Tasks** and a **Knowledge outline** keep a term's work together.
```

</details>

**依据 2 · 源码核查**：[lib/contexts/generation/selection.js:119-145](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/lib/contexts/generation/selection.js#L119-L145)

选段取证与保存候选

<details>
<summary>查看原文（27行）</summary>

```text
      const selection = await resolve(args.selection, scopedRequest);
      const destination = await bank.get(args.deckId);
      const deck = destination.deck || destination;
      if (!Array.isArray(deck.cards)) throw new Error('Destination deck is unavailable');
      const expectedVersion = args.expectedVersion ?? destination.version ?? deck.contentVersion ?? 0;
      const sources = await evidence(selection, scopedRequest);
      await update(state => {
        state.selectionJobs ||= [];
        if (state.selectionJobs.some(job => job.operationId === args.operationId)) return;
        state.selectionJobs.push({ operationId: args.operationId, fingerprint, deckId: args.deckId, deckTitle: deck.title || '', expectedVersion,
          selection, request: { count, kind, focus: args.focus || '' }, sources, status: 'preparing', candidates: [], accepted: [],
          reviewPassed: false, createdAt: new Date().toISOString() });
      });
      try {
        const draft = await generateDeck(modelFor(scopedRequest), {
          count, kind, sources, notation: resolveNotation('auto', sources), existing: deck.cards.map(card => card.objective).filter(Boolean),
          language: args.language || (scopedRequest.language === 'en' ? 'English' : '中文'), focus: `${args.focus || ''}\nSelected passage: ${selection.quote}`,
          onAuthored: async draft => {
            await save(args.operationId, { candidates: draft.cards, candidateTitle: draft.title, status: 'reviewing' });
            scopedRequest.onProgress?.({ written: draft.cards.length, operationId: args.operationId });
          },
          onReviewed: review => save(args.operationId, { review }),
        }, stage => scopedRequest.onProgress?.({ stage, operationId: args.operationId }));
        const accepted = draft.cards.map(card => ({ ...card, selections: [clone(selection)] }));
        scopedRequest.onProgress?.({ passed: accepted.length, operationId: args.operationId });
        const job = await save(args.operationId, { accepted, editorial: draft.editorial, reviewPassed: true, status: 'reviewed' });
        return commit(job, undefined, scopedRequest);
```

</details>

#### 缺口

- 未测教学效果
  **影响**：不能推断学习提升
  **进一步探讨**：对比同段资料的引用正确率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 审核完成后如何避免重复发布？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

选段使用 operationId 和指纹拒绝同 ID 不同请求，已通过审核则进入 commit。发布任务路径只有草稿和题库版本一致才复用旧计划；使用运行时 commit 时提交并保留回执。快速发布路径另有免审分支，不能把所有写入都视为模型审核。

#### 证据与依据

**依据 1 · 源码核查**：[lib/contexts/generation/selection.js:114-130](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/lib/contexts/generation/selection.js#L114-L130)

指纹与重试

<details>
<summary>查看原文（17行）</summary>

```text
    modelFor(request);
    return exclusive(args.operationId, request, async scopedRequest => {
      const existing = await get(args.operationId);
      if (existing && existing.fingerprint !== fingerprint) throw new Error('Operation ID was already used for a different request');
      if (existing?.reviewPassed) return commit(existing, undefined, scopedRequest);
      const selection = await resolve(args.selection, scopedRequest);
      const destination = await bank.get(args.deckId);
      const deck = destination.deck || destination;
      if (!Array.isArray(deck.cards)) throw new Error('Destination deck is unavailable');
      const expectedVersion = args.expectedVersion ?? destination.version ?? deck.contentVersion ?? 0;
      const sources = await evidence(selection, scopedRequest);
      await update(state => {
        state.selectionJobs ||= [];
        if (state.selectionJobs.some(job => job.operationId === args.operationId)) return;
        state.selectionJobs.push({ operationId: args.operationId, fingerprint, deckId: args.deckId, deckTitle: deck.title || '', expectedVersion,
          selection, request: { count, kind, focus: args.focus || '' }, sources, status: 'preparing', candidates: [], accepted: [],
          reviewPassed: false, createdAt: new Date().toISOString() });
```

</details>

**依据 2 · 源码核查**：[lib/contexts/generation/jobs/publish-step.js:23-50](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/lib/contexts/generation/jobs/publish-step.js#L23-L50)

计划重用、发布与快速路径

<details>
<summary>查看原文（28行）</summary>

```text
/** The check of a publication; one that an earlier Attempt already made (and kept) is not paid for again while the draft and the deck are what they were. */
async function planned({ call, read, plans, stepKey, base, ask, onProgress, draft, meta, quick }) {
  const kept = await plans?.load(stepKey);
  if (kept) {
    const state = await read(), target = publicationTarget(state, get(state.drafts, draft.id, 'Draft'), base);
    const same = kept.expect.draftId === draft.id && kept.expect.draftVersion === draft.draftVersion;
    if (same && (kept.expect.before?.contentVersion ?? null) === (target ? target.contentVersion || 0 : null)) return kept;
  }
  const plan = { ...await call('draft.publish.plan', { ...base, ...(quick ? { quick: true } : { ask, onProgress }) }), deckTitle: draft.title, meta };
  await plans?.save(stepKey, plan);
  return plan;
}

/** Publish `draft` ({ id, draftVersion, title }) with `base` (the arguments of `draft.publish`); resolves with the receipt.
 * `meta` is kept with the plan for whoever finds the write done later. */
export async function publishDraft({ call, read, models, signal, commit, plans, stepKey = PUBLISH_STEP, base, draft, onProgress, meta, quick = false }) {
  // The same batch asked twice (its reply could not be read) is told apart by how many times it was asked.
  const asked = new Map();
  const ask = (system, prompt, { cardIds }) => {
    const key = digestOf(cardIds), retry = asked.get(key) ?? 0;
    asked.set(key, retry + 1);
    return models.call(system, prompt, { stage: 'Publication review', kind: 'review', unit: stepKey, card: key, retry, feature: REVIEW_FEATURE, signal });
  };
  const plan = await planned({ call, read, plans, stepKey, base, ask, onProgress, draft, meta, quick });
  // The quick publication (a pasted case with answers) takes every question as it is: there is no review to have made and nothing to decide.
  const write = async decided => receiptOf(quick ? await call('draft.publish.quick', { id: base.id, draftVersion: base.draftVersion })
    : await call('draft.publish', { ...base, planned: true, publishDecision: decided.decision }));
  return commit ? commit(stepKey, async () => plan, { publish: write }) : write(plan);
```

</details>

#### 缺口

- 未复现中断或并发
  **影响**：不能保证全部重复提交被拦
  **进一步探讨**：用测试题库演练恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地资料什么时候会发给提供方？

**研究主题**：缺陷与关键质疑

#### 完整回答

用户生成和求助会送选段文本给 DSH 模型；音频转录另有提供方。固定模型路径会解析 provider 和 model 并传播取消信号，数据落本地并不等于所有处理本地。需分别核对资料授权和供应方策略。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:188-202](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/README.md#L188-L202)

作者列出的出站数据

<details>
<summary>查看原文（15行）</summary>

```text
## Data and privacy

**Stays on your computer**

- The library: sources and their original files, decks, answers and review schedules, saved in shards. By default it is in the DSH session's workspace folder; choose another folder in **Settings › Library & model**.
- Transcription keys, in `study/` in your DSH home (by default `~/.dsh/study/`). They never enter the library, exports or backups. DSH keeps the model keys. (A MinerU token saved by a version before 3.5.5 stays in `study/mineru.json`; nothing reads it any more, and you can delete it.)
- The usage frequency record, if you turn it on in **Settings › Usage frequency record**. It is off by default, and StudyHub never sends it anywhere ([details](docs/usage-frequency.md)).

**Leaves your computer only when you use the feature**

- Generating questions or asking for help sends the selected source text to your model provider through DSH. **Suggest a focus** sends only titles and headings.
- Recordings go to your transcription provider. PDF conversion with MinerU runs on this computer; installing it downloads the program and its models (from mainland mirrors or the official sources) and uploads nothing.
- The update check asks GitHub for the latest version and sends no study data.

**Backups and older libraries**
```

</details>

**依据 2 · 源码核查**：[lib/index.js:140-166](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/lib/index.js#L140-L166)

实际模型路由和信号

<details>
<summary>查看原文（27行）</summary>

```text
    const started = performance.now();
    const timeout = AbortSignal.timeout(timeoutMs);
    const signal = AbortSignal.any([timeout, ...(externalSignal ? [externalSignal] : [])]),
      chosen = selectedRoute || route();
    if (!chosen) throw new Error("No model is available for generation");
    // The learner's generation level (Settings) applies to question work only:
    // 陪学 forces the lowest level and corrections / audio carry their own.
    const selected = light || correctionReasoning ? chosen : await effortRoute(ctx, chosen, signal);
    const effort = light && !correctionReasoning ? await lightEffort(ctx, selected.provider, selected.model, signal) : null;
    let reasoningEffort = effort?.id ?? selected.reasoningEffort;
    if (correctionReasoning) {
      // A correction never inherits the parent chat's high reasoning setting.
      reasoningEffort = await correctionEffort(ctx, selected, correctionReasoning, signal);
    }
    const refusal = reasoningEffort === undefined ? undefined : refusedEfforts.get(refusedKey(selected, reasoningEffort));
    if (refusal !== undefined) reasoningEffort = refusal || undefined;
    const call = await ctx.llm.resolveCallConfig(
      {
        provider: selected.provider,
        model: selected.model,
        ...(reasoningEffort === undefined
          ? {}
          : { reasoningEffort: ReasoningEffortId(reasoningEffort) }),
        ...(((effort?.off && refusal === undefined) || correctionReasoning || task === 'assist') && maxTokens ? { maxTokens } : {}),
      },
      signal,
    );
```

</details>

**依据 3 · 源码核查**：[lib/contexts/generation/selection.js:133-141](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/lib/contexts/generation/selection.js#L133-L141)

选段进入出题材料

```text
        const draft = await generateDeck(modelFor(scopedRequest), {
          count, kind, sources, notation: resolveNotation('auto', sources), existing: deck.cards.map(card => card.objective).filter(Boolean),
          language: args.language || (scopedRequest.language === 'en' ? 'English' : '中文'), focus: `${args.focus || ''}\nSelected passage: ${selection.quote}`,
          onAuthored: async draft => {
            await save(args.operationId, { candidates: draft.cards, candidateTitle: draft.title, status: 'reviewing' });
            scopedRequest.onProgress?.({ written: draft.cards.length, operationId: args.operationId });
          },
          onReviewed: review => save(args.operationId, { review }),
        }, stage => scopedRequest.onProgress?.({ stage, operationId: args.operationId }));
```

#### 缺口

- 未捕获模型或转录请求
  **影响**：实际留存和费用未知
  **进一步探讨**：用合成文本检查模型调用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何先用且保留人工退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先浏览示例课、练已有题，再用可外发讲义生成少量草稿，人工点开来源和答案再决定发布。需要兼容 DSH；出题和转录的凭据分开。若结果不可靠，保留资料并继续手工编题。安装、审阅和请求成本未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-22](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/README.md#L17-L22)

宿主与用途

```text
- **Made for:** students who learn from slides, PDFs, notes and recorded lectures, in English or Chinese.
- **Cost:** StudyHub is free and open source (MIT). Browsing sources, answering questions and review scheduling are free, with no model calls. Generating questions and AI help are billed by your model provider. StudyHub shows the estimated tokens before a generation run and the actual tokens after it, and **Statistics** totals the last 7 or 30 days.
- **Network and cost:** supported regions, free allowances and pricing depend on each provider’s current terms. If installing from the GitHub address fails, see the notes under [Quick start](#quick-start).
- **Computers:** the install links below cover Windows x64 and macOS on Apple silicon. For other systems, check current DSH support or use the web version with Node.js 22.19 or later.
- **Requires:** DSH 0.2 (0.2.0-rc.2 or later, below 0.3).
- **Your data:** the library is a folder on your computer. [Data and privacy](#data-and-privacy) lists what is sent where.
```

**依据 2 · 作者声明**：[README.md:36-45](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/README.md#L36-L45)

任务与凭据分离

<details>
<summary>查看原文（10行）</summary>

```text
## Quick start

| You want to | You need | Cost |
| --- | --- | --- |
| Take the sample course and tour, browse sources, practise existing questions | StudyHub only | Free, no model calls |
| Generate questions, explanations and **Help me understand** | A model provider key in DSH **Settings › Models** | Billed by your provider, for example the [DeepSeek API](https://platform.deepseek.com/) |
| Turn recordings into text | A transcription key in StudyHub **Settings › Audio transcription** | SiliconFlow SenseVoice supports recording transcription. Gemini and Groq availability and allowances depend on the provider |

1. **Install DSH** (skip this if you have it). Use the official [Windows x64 installer](https://download.deepseek.com/desktop/dsh-latest-windows-x64.exe) or [macOS Apple silicon installer](https://download.deepseek.com/desktop/dsh-latest-macos-arm64.dmg). On any other computer, install Node.js 22.19 or later and run `npx @deepseek-ai/dsh web`.
2. **Install StudyHub.** In DSH, open **Plugins**, click **Add plugin**, paste this address and click **Enable**:
```

</details>

**依据 3 · 源码核查**：[lib/contexts/generation/jobs/publish-step.js:38-50](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/lib/contexts/generation/jobs/publish-step.js#L38-L50)

发布有单独提交阶段

<details>
<summary>查看原文（13行）</summary>

```text
export async function publishDraft({ call, read, models, signal, commit, plans, stepKey = PUBLISH_STEP, base, draft, onProgress, meta, quick = false }) {
  // The same batch asked twice (its reply could not be read) is told apart by how many times it was asked.
  const asked = new Map();
  const ask = (system, prompt, { cardIds }) => {
    const key = digestOf(cardIds), retry = asked.get(key) ?? 0;
    asked.set(key, retry + 1);
    return models.call(system, prompt, { stage: 'Publication review', kind: 'review', unit: stepKey, card: key, retry, feature: REVIEW_FEATURE, signal });
  };
  const plan = await planned({ call, read, plans, stepKey, base, ask, onProgress, draft, meta, quick });
  // The quick publication (a pasted case with answers) takes every question as it is: there is no review to have made and nothing to decide.
  const write = async decided => receiptOf(quick ? await call('draft.publish.quick', { id: base.id, draftVersion: base.draftVersion })
    : await call('draft.publish', { ...base, planned: true, publishDecision: decided.decision }));
  return commit ? commit(stepKey, async () => plan, { publish: write }) : write(plan);
```

</details>

#### 缺口

- 未安装或使用真实课程
  **影响**：不知道课堂适用性
  **进一步探讨**：用一页合成讲义核对草稿和退出

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 来源回链能减少发现错题的时间吗？

**研究主题**：新假设与验证

#### 完整回答

对照有无来源回链的同一题组，植入答案错配与无关引用，观察审核者定位耗时与漏错。如果引用导致误信或没有缩短耗时，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/contexts/generation/selection.js:133-145](https://github.com/EricWang1358/dsh-web-studyhub/blob/07b5469fe002beb762584a440e3b96836ee7d4e0/lib/contexts/generation/selection.js#L133-L145)

候选与选段绑定

<details>
<summary>查看原文（13行）</summary>

```text
        const draft = await generateDeck(modelFor(scopedRequest), {
          count, kind, sources, notation: resolveNotation('auto', sources), existing: deck.cards.map(card => card.objective).filter(Boolean),
          language: args.language || (scopedRequest.language === 'en' ? 'English' : '中文'), focus: `${args.focus || ''}\nSelected passage: ${selection.quote}`,
          onAuthored: async draft => {
            await save(args.operationId, { candidates: draft.cards, candidateTitle: draft.title, status: 'reviewing' });
            scopedRequest.onProgress?.({ written: draft.cards.length, operationId: args.operationId });
          },
          onReviewed: review => save(args.operationId, { review }),
        }, stage => scopedRequest.onProgress?.({ stage, operationId: args.operationId }));
        const accepted = draft.cards.map(card => ({ ...card, selections: [clone(selection)] }));
        scopedRequest.onProgress?.({ passed: accepted.length, operationId: args.operationId });
        const job = await save(args.operationId, { accepted, editorial: draft.editorial, reviewPassed: true, status: 'reviewed' });
        return commit(job, undefined, scopedRequest);
```

</details>

#### 缺口

- 无审核者数据
  **影响**：收益未证
  **进一步探讨**：固定讲义和题目做盲评

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
