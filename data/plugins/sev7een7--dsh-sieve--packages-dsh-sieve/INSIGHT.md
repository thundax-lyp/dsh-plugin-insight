# dsh-sieve

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1479158](https://github.com/Sev7eEn7/dsh-sieve/tree/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve)

<!-- BEGIN META -->
[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Sev7eEn7/dsh-sieve) [![npm 30d 1,523](https://img.shields.io/static/v1?label=npm+30d&message=1%2C523&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sieve) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sieve)
<!-- END META -->

> **功能**：为 DSH 提供工具输出筛选、历史上下文精简、技能按需展示和长任务监督。

> **亮点**：它在工具结果入档前做有门槛的删减，并把历史批量替换与原文指针连接起来；这是可复用的集成设计，部分机制有第三方移植归属，不能称为全新算法。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：保全原文并不保证模型会及时重读，判断失效也可能留下规则删减结果；净字符减少不能代替任务质量和总费用对照。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 独立判断器对长编码会话增加了什么，贡献是否来自本组件？](#detail-section-11)
  - [Q02 · 删减是否先保全原件，判断失效及历史重读如何处理？](#detail-section-12)
  - [Q03 · 判断服务、宿主与存储如何约束首次和持续使用成本？](#detail-section-13)
  - [Q04 · 自动监督与回退能保证办结吗，何种试用可检验收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长编码会话维护者可用它减少重复日志进入模型的机会；任务质量和原文可取回是合格条件。[Q01](#research-q01)

简单替代是手动筛选日志、只保留相关文件或直接使用宿主上下文压缩；本组件把这些工作接入事件链，但引入判断服务与归档维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工具结果筛选 | 减少重复日志 | 纯文本、归档成功、净字符达到门槛 |
| 历史批量替换 | 保留指针而减少旧结果 | 引用保护、原生会话事件与spillStore |
| Skill按需展示 | 缩小目录消息 | 保留点名与alwaysVisible，依赖判断器 |
| 检查点回退 | 恢复文件并分叉会话 | Git、停下Agent、部分失败需人工核对 |
| Hive调查 | 多角度只读研究 | subagent服务与沙箱支持，不能承诺无副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=0.2.1-rc.2 <0.2.2-0、Cordis 4.0.5系列 | 启动必需，包声明 | 宿主服务与事件 | 兼容性不能保证 |
| Jev凭据或本地Laya | 三类上下文处理必需 | 独立判断来源 | judgeReady阻止上下文改写 |
| spillStore与sessionProjections | 对应模块必需 | 原件与历史状态 | 子插件等待依赖，不能证明已生效 |
| Git与检查点目录 | 回退模块必需 | 工作区快照 | 无检查点，需人工恢复 |
| dsh-sieve-web | 可选 | 浏览器面板与凭据管理 | 后端可独立使用命令 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装匹配包并配置独立判断器 | 重启后检查/sieve status |
| 处理 | 插件接收工具结果并先保存原件 | 替代文本含指针，归档失败保留原文 |
| 验收 | 用户核对失败信息与任务结果 | 可按指针找回原文，再比较总账单 |
| 恢复 | 停止Agent后预览回退 | 分清文件恢复与会话分叉；部分失败按提示处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 判断服务或本地模型资源，金额未知 | 安装、凭据和profile核对，耗时未知 | 主模型之外还有判断器 |
| 持续 | 判断调用、spill和Git快照存储 | 核对原文和重读，时间未知 | 少传字符不等于净省费用 |
| 失败恢复 | 重试与快照空间，量未知 | 区分分叉失败和文件恢复，检查手改 | 快照受大小与保留期限制 |
| 退出 | 保留档案占用未知 | 关闭模块，恢复原输出并核对历史指针 | 不自动承诺清除历史替换 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 输出精简 | 已确认门槛、归档和替换机制 | 同任务净输入及总费用 |
| 历史整理 | 已确认引用保护与重读扣减 | 模型遗漏或重读频率 |
| 回退 | 已确认预览、撤销和部分失败提示 | 任意外部副作用恢复 |

> **思考**：保全原文并不保证模型会及时重读，判断失效也可能留下规则删减结果；净字符减少不能代替任务质量和总费用对照。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它在工具结果入档前做有门槛的删减，并把历史批量替换与原文指针连接起来；这是可复用的集成设计，部分机制有第三方移植归属，不能称为全新算法。[Q01](#research-q01) [Q02](#research-q02)

归档成功才替换、任务/配置修订校验、引用保护以及重读扣减值得借鉴，移植需宿主原生事件、存储和工具返回约定。工作区回退先保留撤销快照且报告分叉部分失败，但它并非覆盖外部服务的事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

保全原文并不保证模型会及时重读，判断失效也可能留下规则删减结果；净字符减少不能代替任务质量和总费用对照。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用可丢弃测试项目，只比较输出筛选而保留其他监督为观察模式；记录同任务结果、原文重读和判断费用。重要错误丢失或原文不可恢复时停止筛选。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

事件接线、原件归档及失败分支已有源码支持；任务收益仍未验证，反馈策略是未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/dsh-sieve/package.json、packages/dsh-sieve/cordis.patch.yml、packages/dsh-sieve/src/index.ts、packages/dsh-sieve/src/features/admission.ts、packages/dsh-sieve/src/features/forgetting.ts、packages/dsh-sieve/src/features/skills.ts、packages/dsh-sieve/src/runtime/config.ts、packages/dsh-sieve/src/features/checkpoint/index.ts、packages/dsh-sieve/src/features/hive/index.ts 及固定范围 inventory；组件：packages/dsh-sieve。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查上下文处理、依赖、检查点和Hive入口；未做全仓安全审计，未验证外部判断服务。
- 下一步：后续用固定失败日志与多文件任务比较关闭、规则和判断三组，保持主模型与验收标准相同；检查关键错误、总账单和人工恢复，任一质量退步即停止。

**分析版本**

- **仓库**：[Sev7eEn7/dsh-sieve](https://github.com/Sev7eEn7/dsh-sieve)
- **版本号**：0.4.1（[固定提交 1479158](https://github.com/Sev7eEn7/dsh-sieve/tree/147915819213e5f97841db512c07181d3af839e6)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是用重读输入、判断账单与人工恢复共同反馈删减策略，而不只最大化删字符；三组同任务对照若不能保持质量并降低总负担，应推翻它。[Q04](#research-q04)

后续用固定失败日志与多文件任务比较关闭、规则和判断三组，保持主模型与验收标准相同；检查关键错误、总账单和人工恢复，任一质量退步即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 68 | 12439 | 9253 | 2234 | — |
| .md | source | 1 | 27 | — | — | 208 |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/Sev7eEn7/dsh-sieve/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/Sev7eEn7/dsh-sieve/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Sev7eEn7/dsh-sieve/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立判断模型如何在保留原文可追溯性的条件下减少上下文，何时不值得接入？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 独立判断器对长编码会话增加了什么，贡献是否来自本组件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向工具输出很长、旧结果反复进入上下文或技能目录较大的 DSH 编码会话。合格结果应是在任务结果不退步的条件下减少模型输入，而不是面板字符数变小。与手动截取日志相比，插件在工具结果进入会话前处理、在后续步骤前批量替换历史，并保存可恢复原文；与只按年龄截断相比，它把文件重读、指向其他输出的引用和任务判断纳入条件。注册链路把这三项处理分别接入 tools/post-execute 与 agent/pre-step，构成可解释的集成增量。实现注释明确指出部分 forgetting、skills 和 checkpoint 代码移植自 MIT 代码，不能把全部机制归为本项目原创。README 的百分比来自作者特定轨迹和旧判断设置，并不证明当前版本或任意任务有同样收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-sieve/src/index.ts:165-172](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/index.ts#L165-L172)

三个上下文模块实际作为依赖子插件挂载。

```text
    ctx.plugin({
      name: 'sieve-runtime',
      inject: ['sessionProjections'],
      apply: (child: Context) => {
        const runtime = new SessionRuntime(child, agent => this.engineFor(agent))
        child.plugin({ name: 'sieve-admission', inject: ['tools', 'spillStore'], apply: (feature: Context) => { registerAdmission(feature, this, runtime) } })
        child.plugin({ name: 'sieve-forgetting', inject: ['spillStore'], apply: (feature: Context) => { registerForgetting(feature, this, runtime) } })
        child.plugin({ name: 'sieve-skills', inject: ['skills'], apply: (feature: Context) => { registerSkills(feature, this, runtime) } })
```

**依据 2 · 源码核查**：[packages/dsh-sieve/src/features/forgetting.ts:1-16](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/forgetting.ts#L1-L16)

说明批处理与第三方归属，不能据此宣称全新算法。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * Batched, log-backed forgetting.
 * Contains MIT-licensed third-party code, see THIRD_PARTY_NOTICES.md.
 *
 * Results of the most recent steps stay whole. Older command output, and
 * reads that a later read of the same lines superseded, are archived and
 * replaced by their ends and a pointer; the judge may add results inside the
 * recent window that the work has moved past. An older file read is the
 * judge's call, not the rules': a task that studies several files steps away
 * from them and comes back. A file read again after it was forgotten is not
 * forgotten by age again, and the re-read is charged against the saving.
 * Replacing a result breaks the cached prefix from there on, so replacements
 * wait until one batch saves `minBatchChars`, and a batch lands before one
 * request. There are no 50/70/85% context-window thresholds: on public SWE
 * trajectories most tasks never reach them, while a batch of old results pays
 * for its cache rebuild within a few requests.
```

</details>

**依据 3 · 作者声明**：[README.md:24-26](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/README.md#L24-L26)

作者对离线、在线数据及旧判断设置的限制。

```text
**−36%** request payload (offline replay, 100 trajectories) · **−21%** main model input tokens (live model, 80 runs) · **~0.3 s** per judgment · **0** DSH core patches

<sub>How each number was measured, and what it does not show: [offline replay](#offline-replay-results) · [live model results](#live-model-results-deepseek-flash). The live runs predate the current Jev / Laya setup.</sub>
```

#### 缺口

- 本版本在同任务下的合格结果与总输入成本未取得对照。
  **影响**：不能把字符删减转成稳定节时或净费用收益。
  **进一步探讨**：使用相同任务和主模型，对比关闭插件、仅规则和判断器三组并记录重读与失败。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 删减是否先保全原件，判断失效及历史重读如何处理？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

输出处理先等待下游决定，只处理被接受的纯文本非错误结果；过短、白名单工具和已标记结果直接通过。transform 先计算净删减门槛，要求保存原文后才能返回替代文本；归档失败、取消、任务或配置变化会保留原结果。判断超时并非一概“全文不变”，普通输出和测试日志可保留规则结果，所以应分别验证规则与判断器的影响。历史遗忘保护仍被引用的结果，文件读取只有后续同范围覆盖才按规则淘汰，老文件的其他删减依赖判断；批量达到净字符门槛后先写 spill，再追加原生 compaction/prune 和替代 tool/result。文件重读会扣减记录中的节省。Skill 筛选首次从未隐藏目录开始，只有返回有效judge结果才新增隐藏；后续从已持久隐藏集合开始，判断超时或未返回不自动恢复全部技能，而点名和alwaysVisible仍可恢复。catch异常才返回本次原始decision目录。这些分支不能合称“判断失败必恢复全部目录”。恢复原文需要模型实际追踪指针，原件存在不等于下游不会遗漏重要信息。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-sieve/src/features/admission.ts:240-280](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/admission.ts#L240-L280)

规则回退、原件保存与纯文本结果改写的实际链路。

<details>
<summary>查看原文（41行）</summary>

```text
      const early = rulesSaved > 0 ? archive() : undefined
      let omitted = new Set<number>()
      if (judging !== undefined) {
        const decisions = await untilAbort(judging, wait)
        // Late, failed or aborted: the rules result.
        if (decisions !== undefined && !decisions.some(decision => decision.reason?.startsWith('error:') === true)) {
          omitted = dropped(decisions.flatMap(decision => decision.outcome))
        }
      }
      const body = bodyWith(omitted)
      if (!valid() || finish(body, ESTIMATE_LOCATOR, '') === original) return undefined
      const ref = archived ?? await untilAbort(early ?? archive(), wait)
      if (ref === undefined || !valid()) return undefined
      const replacement = finish(body, ref.locator, ref.retrievalHint)
      if (replacement === original) return undefined
      const records: { id: string, changed: boolean }[] = []
      if (rulesId !== undefined) records.push({ id: rulesId, changed: true })
      if (judgeId !== undefined) records.push({ id: judgeId, changed: replacement !== finish(rulesBody, ref.locator, ref.retrievalHint) })
      return { sessionId, replacement, records }
    } finally {
      bound.dispose()
    }
  }

  ctx.on('tools/post-execute', async (exec, result, next): Promise<PostToolDecision> => {
    // Downstream exceptions and blocking decisions are not sieve failures.
    const decision = await next()
    const agent = exec.agent
    if (!config.enabled || decision.kind !== 'accept' || 'value' in decision || result.isError || exec.signal.aborted
      || agent === undefined || config.passThrough.includes(exec.name)) return decision
    const content = decision.content ?? result.content
    if (content.some(block => block.type !== 'text')) return decision
    const original = textOf(content)
    if (original.length < config.minChars || isSieveResult(original)) return decision
    const rewrite = await host.track(transform(exec, agent, original)).catch(() => {
      ctx.logger.warn('sieve: admission failed; keeping the original tool output')
      return undefined
    })
    if (rewrite === undefined) return decision
    receipts.set(exec, rewrite)
    return { ...decision, content: [{ type: 'text', text: rewrite.replacement }] }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-sieve/src/features/forgetting.ts:270-296](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/forgetting.ts#L270-L296)

引用保护与批量门槛。

<details>
<summary>查看原文（27行）</summary>

```text
      // A visible reference points into its source: forgetting the source would lose what the reference stands for.
      const referenced = new Set(state.references.filter(reference => onSurface(reference.seq)).flatMap(reference => reference.calls))
      const visible = state.candidates.filter(candidate => onSurface(candidate.seq) && !referenced.has(candidate.data.message.toolCallId))
      const age = (candidate: ForgetCandidate): number => state.steps - candidate.step
      const isRead = (candidate: ForgetCandidate): boolean => candidate.call?.name === 'read'
      const ranges = new Map(visible.map(candidate => [candidate.seq, readRange(candidate, cwdOf(candidate.call?.cwd))]))
      const superseded = new Set(visible.filter((candidate, index) => {
        const range = ranges.get(candidate.seq)
        return range !== undefined && visible.slice(index + 1).some(later => {
          const cover = ranges.get(later.seq)
          return cover?.identity === range.identity && cover.first <= range.first && cover.last >= range.last
        })
      }).map(candidate => candidate.seq))
      const estimate = (candidate: ForgetCandidate): number =>
        Math.max(0, candidate.chars - replacement(candidate, superseded.has(candidate.seq), config.edgeChars, '<archive>').length)
      const sum = (candidates: readonly ForgetCandidate[]): number => candidates.reduce((total, candidate) => total + estimate(candidate), 0)
      const aged = (candidate: ForgetCandidate): boolean => age(candidate) >= config.keepRecent && candidate.chars >= config.minChars
      // Only a later copy of the same lines retires a read by rule; a re-read file is not forgotten by age again.
      const rules = visible.filter(candidate => !ruled.has(candidate.seq) && estimate(candidate) > 0
        && (superseded.has(candidate.seq) || (!isRead(candidate) && aged(candidate))))
      const agedReads = visible.filter((candidate) => {
        if (!isRead(candidate) || ruled.has(candidate.seq) || superseded.has(candidate.seq) || rereadOf(candidate) !== undefined) return false
        const before = judgedBefore.get(candidate.seq)
        return aged(candidate) && estimate(candidate) > 0 && (before === undefined || age(candidate) >= 2 * before)
      })
      // One cache rebuild has to buy enough: below this the results wait for the next batch.
      if (sum(rules) + sum(agedReads) < config.minBatchChars) return
```

</details>

**依据 3 · 源码核查**：[packages/dsh-sieve/src/features/forgetting.ts:329-347](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/forgetting.ts#L329-L347)

归档完成才追加原生替换事件。

<details>
<summary>查看原文（19行）</summary>

```text
        const apply = async (selected: readonly ForgetCandidate[]): Promise<boolean> => {
          let applied = false
          for (const candidate of selected) {
            if (!valid() || bound.signal.aborted || !onSurface(candidate.seq)) break
            let ref
            try {
              ref = await untilAbort(host.track(ctx.spillStore.saveText({ owner: { sessionId },
                source: { kind: 'tool', toolName: candidate.call?.name ?? 'tool', callId: candidate.data.message.toolCallId, label: 'sieve-forgotten' },
                suggestedName: 'forgotten-output.txt', content: textOf(candidate.data.message.content),
              })), bound.signal)
            } catch { ctx.logger.warn('sieve: archive failed; keeping this tool result'); continue }
            if (ref === undefined || !valid() || !onSurface(candidate.seq)) continue
            const text = replacement(candidate, superseded.has(candidate.seq), config.edgeChars, ref.locator, ref.retrievalHint)
            if (text.length >= candidate.chars) continue
            const seq = SessionSeq(candidate.seq)
            agent.session.append('compaction/prune', { shadowedRange: { start: seq, end: seq }, shadowedSeqs: [seq], shadowedTokenCount: estimateMessage(candidate.data.message) })
            agent.session.append('tool/result', { ...candidate.data, message: freezeMessage<ToolResultMessage>({ ...candidate.data.message, content: [{ type: 'text', text }] }) }, {
              surfaceOp: { op: 'replace', startSeq: seq, endSeq: seq }, sourceEventSeqs: [seq],
            })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-sieve/src/features/forgetting.ts:386-401](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/forgetting.ts#L386-L401)

重读从节省记录中扣除。

<details>
<summary>查看原文（16行）</summary>

```text
  function chargeRereads(agent: Agent, visible: readonly ForgetCandidate[], rereadOf: (candidate: ForgetCandidate) => ForgottenRead | undefined): void {
    let seen = charged.get(agent)
    if (seen === undefined) { seen = new Set(); charged.set(agent, seen) }
    const sessionId = agent.session.header.id
    for (const candidate of visible) {
      const entry = rereadOf(candidate)
      if (entry === undefined || seen.has(entry.seq)) continue
      seen.add(entry.seq)
      const recorded = host.ledger(sessionId).some(record => record.specId === contextForget.id
        && typeof record.origin === 'object' && record.origin !== null && 'reread' in record.origin && record.origin.reread === entry.seq)
      if (recorded) continue
      runtime.for(agent).engine.recordRules(contextForget, {
        state: { reread: candidate.seq, forgotten: entry.seq },
        outcome: { reread: candidate.seq },
        origin: { reread: entry.seq },
        applied: true, savedChars: -Math.min(candidate.chars, entry.saved),
```

</details>

**依据 5 · 源码核查**：[packages/dsh-sieve/src/features/skills.ts:109-155](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/skills.ts#L109-L155)

点名恢复、alwaysVisible和失败保留目录。

<details>
<summary>查看原文（47行）</summary>

```text
      let hidden = new Set(state.hidden.filter(name => catalog.source.kind === 'skill-catalog' && catalog.source.entries.some(entry => entry.name === name)))
      const eligible = catalog.source.entries.length >= config.minSkills && catalog.source.entries.length <= config.maxSkills && words.trim() !== ''
      const first = !state.published
      const revealNamed = [...hidden].filter(name => named(words, name) || config.alwaysVisible.includes(name))
      if (mode === 'active') for (const name of revealNamed) hidden.delete(name)
      const shouldJudge = eligible && handled.get(agent) !== requestId && (first || (incoming !== undefined && hidden.size > 0))
      let judged: Decision<SkillDisclosureOutcome> | undefined
      if (shouldJudge) {
        handled.set(agent, requestId)
        const candidates = first ? catalog.source.entries : catalog.source.entries.filter(entry => hidden.has(entry.name))
        if (candidates.length > 0) {
          // The judge splits a large catalog into requests of its own size; the catalog is still one decision.
          const input = { userMessage: words, skills: candidates }
          const work = engine.decide(skillDisclosure, input, { signal: cancel, applied: false, origin: { userMessageId: requestId, firstCatalog: first } })
          const estimate = (value: Decision<SkillDisclosureOutcome>): void => {
            if (value.ledgerId === undefined) return
            const omitted = first ? new Set(value.judged?.hide.filter(name => !named(words, name) && !config.alwaysVisible.includes(name)) ?? []) : new Set<string>()
            const chars = textOf(catalog.content).length - textOf(filterCatalog(catalog, omitted).content).length
            void host.track(host.annotate(agent.session.header.id, value.ledgerId, { savedChars: chars }))
          }
          void work.then(estimate).catch(() => {})
          if (mode === 'active') {
            const bound = deadline(cancel, config.waitMs)
            try { judged = await untilAbort(work, bound.signal) } finally { bound.dispose() }
            if (!valid()) return decision
            if (judged?.source === 'judge') {
              if (first) hidden = new Set(judged.outcome.hide.filter(name => !named(words, name) && !config.alwaysVisible.includes(name)))
              else for (const name of judged.outcome.relevant) hidden.delete(name)
            }
          }
        }
      }
      if (mode === 'shadow') return decision
      if (!valid()) return decision
      const rewritten = filterCatalog(catalog, hidden)
      const entries = rewritten.source.kind === 'skill-catalog' ? rewritten.source.entries : []
      if (state.visible !== null && JSON.stringify(entries) === JSON.stringify(state.visible.entries) && JSON.stringify([...hidden]) === JSON.stringify(state.hidden)) {
        return { ...decision, messages: decision.messages.filter((_, at) => at !== index) }
      }
      const judgeChanged = judged?.source === 'judge' && (first ? hidden.size > 0
        : state.hidden.some(name => judged.outcome.relevant.includes(name) && !hidden.has(name)))
      if (judged?.ledgerId !== undefined && judgeChanged) {
        receipts.set(agent, { messageId: rewritten.id, ledgerId: judged.ledgerId })
      }
      return { ...decision, messages: decision.messages.map((message, at) => at === index ? rewritten : message) }
    } catch {
      ctx.logger.warn('sieve: skill disclosure failed; keeping the DSH catalog')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 判断服务、宿主与存储如何约束首次和持续使用成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

源码包声明 DSH >=0.2.1-rc.2 <0.2.2-0 和 Cordis 4.0.5 系列，补丁插入 sieve 并指定检查点目录；这证明分发意图，未证明实际宿主组合。Jev 自动凭据或本地 Laya 是独立判断来源，不借会话主模型；system-one 模式没有密钥会拒绝配置。缺判断来源时输出/历史/Skill处理在 judgeReady 处返回，监督模块可能仍执行确定性规则，因此“安装成功”不是省 token 生效的判据。首次需安装匹配包、配置判断来源和重启；持续增加判断请求、归档与检查点存储、重读和配置维护。默认判断超时4秒、归档等待另有预算，不是每次固定延迟。Jev金额、Laya硬件负担和单位合格任务人工时间都未知，不可把主模型少传字符当净收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-sieve/src/runtime/config.ts:241-264](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/runtime/config.ts#L241-L264)

独立判断类型和超时及输出规则默认值。

<details>
<summary>查看原文（24行）</summary>

```text
export const Config: z<Config> = z.object({
  judge: z.object({
    type: z.union(['auto', 'system-one', 'laya'] as const).default('auto'),
    model: z.string(),
    baseUrl: z.string(),
    apiKey: z.string(),
    timeoutMs: z.natural().min(1).max(MAX_TIMER_DELAY_MS).default(4000),
  }).default({}),
  modes: z.dict(z.union(DECISION_MODES)).default({}),
  recordState: z.boolean().default(false),
  admission: z.object({
    enabled: z.boolean().default(true),
    minChars: z.natural().min(1).default(1500),
    judgeMinChars: z.natural().min(1).default(8000),
    chunkChars: z.natural().min(1).default(1200),
    maxChunks: z.natural().min(3).max(48).default(48),
    waitMs: z.natural().min(1).max(MAX_TIMER_DELAY_MS),
    testLog: z.union(['off', 'rules', 'judge'] as const).default('rules'),
    dedup: z.boolean().default(true),
    foldSimilar: z.boolean().default(true),
    minNetChars: z.natural().min(1).default(300),
    minNetShare: z.number().min(0).max(1).default(0.1),
    passThrough: z.array(z.string()).default(['read_image', 'subagent', 'delegate']),
    contentTools: z.array(z.string()).default(['read', 'edit', 'write', 'str_replace_editor']),
```

</details>

**依据 2 · 源码核查**：[packages/dsh-sieve/src/runtime/config.ts:409-434](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/runtime/config.ts#L409-L434)

旧会话模型配置被拒绝，system-one要求密钥。

<details>
<summary>查看原文（26行）</summary>

```text
export function resolveConfig(config: Partial<Config> | undefined): ResolvedConfig {
  // The schema drops unknown keys; a profile written for the removed session-model judge must not load as if it worked.
  const raw = (config ?? {}) as Record<string, unknown>
  const rawJudge = typeof raw['judge'] === 'object' && raw['judge'] !== null ? raw['judge'] as Record<string, unknown> : {}
  if (rawJudge['type'] === 'llm' || rawJudge['type'] === 'off' || 'routes' in raw || 'provider' in rawJudge || 'maxOutputTokens' in rawJudge) {
    throw new Error('sieve: the session-model judge was removed (judge.type llm or off, judge.provider, judge.maxOutputTokens, routes); configure Jev or Laya')
  }

  const value = Config((config ?? {}) as Config)
  const judge = value.judge

  let resolved: ResolvedJudge
  if (judge.type === 'auto') {
    resolved = { type: 'auto', timeoutMs: judge.timeoutMs }
  } else if (judge.type === 'laya') {
    resolved = { type: 'laya', baseUrl: nonEmpty(judge.baseUrl), timeoutMs: judge.timeoutMs }
  } else {
    const apiKey = nonEmpty(judge.apiKey)
    if (apiKey === undefined) throw new Error('sieve: judge.type system-one needs judge.apiKey')
    resolved = {
      type: 'system-one',
      apiKey,
      baseUrl: nonEmpty(judge.baseUrl),
      model: nonEmpty(judge.model),
      timeoutMs: judge.timeoutMs,
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-sieve/cordis.patch.yml:1-6](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/cordis.patch.yml#L1-L6)

包补丁挂载及本地检查点目录。

```text
- insert:
    - id: sieve
      name: dsh-sieve
      config:
        checkpoint:
          root: !!js dshHomePath('sieve', 'checkpoints')
```

**依据 4 · 源码核查**：[packages/dsh-sieve/src/index.ts:146-171](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/index.ts#L146-L171)

持久ledger和session projection服务依赖。

<details>
<summary>查看原文（26行）</summary>

```text
    // The ledger needs the storage domain facility (mounted by dsh-base). Without it
    // sieve still decides; the latest records wait in memory and are stored once it opens.
    ctx.plugin({
      name: 'sieve-ledger',
      inject: ['storageDomain'],
      apply: async (child: Context) => {
        const domain = await child.storageDomain.open(ledgerDomain)
        const ledgers = new SessionLedgers(domain.table('sessions'), child.logger)
        this.ledgers = ledgers
        for (const { sessionId, record } of this.early.splice(0)) void ledgers.append(sessionId, record)
        child.effect(() => async () => {
          // Decisions still running record before the ledger closes, whether sieve or only storage unloads.
          await this.settle()
          if (this.ledgers === ledgers) this.ledgers = undefined
          await ledgers.drain()
          await domain.close()
        }, 'sieve.ledger')
      },
    })
    ctx.plugin({
      name: 'sieve-runtime',
      inject: ['sessionProjections'],
      apply: (child: Context) => {
        const runtime = new SessionRuntime(child, agent => this.engineFor(agent))
        child.plugin({ name: 'sieve-admission', inject: ['tools', 'spillStore'], apply: (feature: Context) => { registerAdmission(feature, this, runtime) } })
        child.plugin({ name: 'sieve-forgetting', inject: ['spillStore'], apply: (feature: Context) => { registerForgetting(feature, this, runtime) } })
```

</details>

**依据 5 · 源码核查**：[packages/dsh-sieve/src/features/admission.ts:98-98](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/admission.ts#L98-L98)

独立判断来源未就绪时此处理链路返回，不由安装状态推定改写生效。

```text
    if (mode === 'off' || !await host.judgeReady()) return undefined
```

**依据 6 · 源码核查**：[packages/dsh-sieve/src/features/forgetting.ts:235-235](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/forgetting.ts#L235-L235)

独立判断来源未就绪时此处理链路返回，不由安装状态推定改写生效。

```text
      if (!await host.judgeReady()) return
```

**依据 7 · 源码核查**：[packages/dsh-sieve/src/features/skills.ts:95-95](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/skills.ts#L95-L95)

独立判断来源未就绪时此处理链路返回，不由安装状态推定改写生效。

```text
      if (mode === 'off' || !await host.judgeReady()) return decision
```

#### 缺口

- 未取得判断服务当期账单、Laya设备消耗与合格任务耗时。
  **影响**：无法判定总费用是否因主模型输入减少而下降。
  **进一步探讨**：在限定任务样本记录判断调用、主模型账单、归档大小和人工处理时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自动监督与回退能保证办结吗，何种试用可检验收益？

**研究主题**：新假设与验证、采用判断

#### 完整回答

检查点模块由 Git 阴影存储和会话分叉组成，回退是用户命令，不自动恢复所有副作用。运行中的 Agent 拒绝回退；默认保留可能手改文件，回退前保存撤销快照，并在文件已恢复而分叉失败时明确报告只恢复文件。配置中监控与团队判断可处于 shadow，仅记录而不干预，审批默认关闭；不能把功能存在解释成严格完成门禁。Hive 注册工具并限制写入/委派工具，但 bash 只读约束仍依赖实际 sandboxPolicy。适合有可恢复测试仓库、愿意检查原文指针的维护者先只开启输出删减并保留监督为观察模式。由“重读扣减”机制可提出未验证假设：以每个合格任务的判断费用、重读输入与人工复核共同决定删减策略，可能比只最大化删字符更可靠。用固定任务、同一主模型比较规则/判断器/关闭三组；若净费用不降、失败定位变差或恢复不了原文，即推翻这项收益并关闭相应模块。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-sieve/src/features/checkpoint/index.ts:505-563](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/checkpoint/index.ts#L505-L563)

回退预检、保留手改、撤销快照和分叉失败的部分结果。

<details>
<summary>查看原文（59行）</summary>

```text
  /** `/sieve rewind`: the files, the conversation, or both, back to a checkpoint. */
  async rewind(agent: Agent, request: RewindRequest, signal: AbortSignal): Promise<{ ok: boolean, text: string }> {
    if (agent.status === 'running') return { ok: false, text: '代理还在运行。先停下它，再回退。' }
    const index = this.index
    if (index === undefined) return { ok: false, text: offText('no_index', this.config) }
    const sessionId = agent.session.header.id
    const own = index.of(sessionId)
    const checkpoint = request.id === undefined ? own.checkpoints.at(-1) : own.checkpoints.find(record => record.id === request.id)
    if (checkpoint === undefined) {
      return { ok: false, text: request.id === undefined ? '还没有检查点。' : `没有 #${request.id} 号检查点。/sieve checkpoints 列出全部。` }
    }
    // Without these the conversation cannot be forked: say so before any file is touched.
    if (request.scope !== 'files' && !request.preview && this.forkable(checkpoint)
      && (this.ctx.get('sessionQuery') === undefined || this.ctx.get('agents') === undefined)) {
      return { ok: false, text: 'DSH 没有挂载 sessionQuery 或 agents 服务，对话不能分叉；什么也没动。只回退文件用 /sieve rewind files。' }
    }
    const lines: string[] = []
    let files: FilesRewound | undefined
    if (request.scope !== 'conversation') {
      const refused = this.refusal(checkpoint.root)
      if (refused !== undefined) return { ok: false, text: refused }
      const project = this.project(checkpoint.root)
      const store = await this.open(project)
      if (!await hasCommit(store, checkpoint.commit)) return { ok: false, text: `#${checkpoint.id} 的快照已被清理。` }
      const now = await this.exclusive(project, () => scan(store))
      const plan = await this.exclusive(project, () => planRestore(store, checkpoint.commit, now.tree))
      const byHand = await this.handEdited(store, project, plan, now.tree, own.lastTree)
      const keep = new Set(request.force ? [] : byHand)
      signal.throwIfAborted()
      if (request.preview) {
        lines.push(`回到 #${checkpoint.id}（第 ${checkpoint.turn} 回合之前，“${checkpoint.label}”）时，文件会这样变：`, describePlan(plan, keep))
        if (keep.size > 0) lines.push('这些文件在代理最后一次修改之后又被改过（多半是手动），默认保留；加 force 一并回退，撤销快照可以找回。')
      } else {
        const undo = await this.exclusive(project, () => snapshot(store, `${sessionId}/undo-${Date.now()}`))
        const result = await this.exclusive(project, () => applyRestore(store, plan, keep))
        const after = await this.exclusive(project, () => scan(store))
        void index.setLastTree(sessionId, after.tree)
        files = { undo: undo.commit, result }
        lines.push(`文件已回到 #${checkpoint.id}：${describeResult(result)}。/sieve rewind undo 可以撤销。`)
      }
    }
    if (request.scope === 'files' || request.preview) {
      if (request.preview && request.scope !== 'files') lines.push(this.forkable(checkpoint) ? `对话会分叉成一个新会话，停在第 ${checkpoint.turn} 回合之前；原会话不变。` : '这个检查点在会话开头，对话不能再往前退。')
      if (files !== undefined) await this.filesRewound(sessionId, checkpoint, files)
      return { ok: true, text: lines.join('\n') }
    }
    if (!this.forkable(checkpoint)) {
      if (files !== undefined) await this.filesRewound(sessionId, checkpoint, files)
      return { ok: files !== undefined, text: [...lines, '这个检查点在会话开头，对话不能再往前退。'].join('\n') }
    }
    let forked: string
    try {
      forked = await this.fork(agent, checkpoint, signal)
    } catch (error) {
      const why = clip(error instanceof Error ? error.message : String(error), 200)
      if (files === undefined) return { ok: false, text: [...lines, `对话没能分叉（${why}），什么也没动。`].join('\n') }
      // The files went back already: the rewind stays one of the files, which undo can take back and this session is told about.
      await this.filesRewound(sessionId, checkpoint, files)
      return { ok: false, text: [...lines, `对话没能分叉（${why}）：只回退了文件，对话仍在这个会话里。`].join('\n') }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-sieve/src/runtime/config.ts:311-335](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/runtime/config.ts#L311-L335)

检查点限制、审批默认关闭和团队配置。

<details>
<summary>查看原文（25行）</summary>

```text
  checkpoint: z.object({
    enabled: z.boolean().default(true),
    root: z.string().default(''),
    keep: z.natural().min(1).default(50),
    maxAgeDays: z.natural().min(1).default(14),
    maxFileMb: z.number().min(0).default(5),
    maxFiles: z.natural().min(1).default(5000),
    maxTotalMb: z.number().min(0).default(200),
    ignore: z.array(z.string()).default([]),
    timeoutMs: z.natural().min(1).max(MAX_TIMER_DELAY_MS).default(30_000),
    propose: z.boolean().default(true),
    failures: z.natural().min(2).default(3),
  }).default({}),
  resume: z.object({
    enabled: z.boolean().default(true),
  }).default({}),
  approval: z.object({
    enabled: z.boolean().default(false),
  }).default({}),
  team: z.object({
    enabled: z.boolean().default(true),
    stuckAfter: z.natural().min(1).default(2),
    verifier: z.boolean().default(true),
    verifierMinutes: z.number().min(0).max(MAX_TIMER_DELAY_MS / 60_000).default(10),
  }).default({}),
```

</details>

**依据 3 · 源码核查**：[packages/dsh-sieve/src/runtime/config.ts:390-395](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/runtime/config.ts#L390-L395)

shadow默认决策不会因全局active自动升级。

```text
/** The mode a profile gives a decision: its own entry, else the default, which only lowers a shadow-by-default decision. */
export function profileModeOf(config: Pick<ResolvedConfig, 'modes' | 'defaultMode'>, id: DecisionId): DecisionMode {
  const own = config.modes.get(id)
  if (own !== undefined) return own
  if (!SHADOW_BY_DEFAULT.has(id)) return config.defaultMode
  return MODE_RANK[config.defaultMode] < MODE_RANK.shadow ? config.defaultMode : 'shadow'
```

**依据 4 · 源码核查**：[packages/dsh-sieve/src/features/hive/index.ts:153-194](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/hive/index.ts#L153-L194)

Hive注册只读策略与工具拦截的条件。

<details>
<summary>查看原文（42行）</summary>

```text
export function registerHive(ctx: Context, host: HiveHost, runtime: HiveRuntime): void {
  const config = host.config.hive
  ctx.effect(() => () => runtime.close(), 'sieve.hive')

  ctx.on('agent/created', ({ agent, source }) => {
    if (!runtime.isBee(agent)) return undefined
    runtime.beeOf(agent)?.attach(agent)
    // `restrict` accepts only names registered globally; anything else is denied by name in `tools/pre-execute`.
    const hidden = BEE_DENIED.filter(name => ctx.tools.get(name) !== undefined)
    if (hidden.length > 0) agent.ctx.tools.restrict({ deny: hidden })
    // The mode is a native session event: it holds when the bee is resumed later.
    if (source !== 'resume' && ctx.get('sandboxPolicy') !== undefined) setSandboxMode(agent.session, 'read-only')
    return undefined
  })

  ctx.on('session/event', (session, event) => {
    runtime.beeIn(session.header.id)?.observe(event)
  })

  ctx.on('agent/assistant-stream', ({ agent }) => {
    runtime.beeOf(agent)?.touch()
  })

  // Inbox delivery at the step boundary: `agent.inject` from a `session/event` observer would re-enter the session append.
  ctx.on('agent/pre-step', async ({ agent }, next) => {
    const decision = await next()
    if (decision.kind !== 'enter') return decision
    const told = runtime.beeOf(agent)?.boundary()
    return told === undefined ? decision : { ...decision, messages: [...decision.messages, told] }
  })

  ctx.on('agent/turn-stopping', async ({ agent, signal }) => {
    await runtime.beeOf(agent)?.lastCall(agent, signal)
  })

  ctx.on('tools/pre-execute', async (exec, next) => {
    const agent = exec.agent
    if (agent === undefined || !runtime.isBee(agent)) return next()
    if (BEE_DENIED.includes(exec.name)) return { kind: 'deny', reason: `${exec.name} is not available to a hive investigator: investigate and report, change nothing.` }
    const reason = runtime.beeOf(agent)?.closedReason
    if (reason !== undefined) return { kind: 'deny', reason }
    return next()
```

</details>

#### 缺口

- 新假设尚未做同条件任务对照。
  **影响**：不能确定组合监督带来的收益能覆盖判断与恢复负担。
  **进一步探讨**：按三组对照记录合格交付、总输入、判断费用、重读和人工恢复；任一组质量下降即停止升级。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
