# dsh-curate

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d3f8fc1](https://github.com/111222cjyq/dsh-curate/tree/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：按消息标重要性、改写模型可见文本，并以备份和区间摘要整理 DSH 会话上下文。

> **亮点**：将逐消息重要性、工具对约束、文本纠正和区间摘要组合为人工工作台；基础surface及编辑投影明确改编自已有项目，增量是组织方式而非全新摘要算法。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：确认后模型摘要直接写可见历史，没有逐段内容复核；格式配对和备份不保证语义保留。多区间异常可部分提交，备份只支撑手工恢复，不能等同自动撤销或事务隔离。[Q03](#research-q03) [Q02](#research-q02)次要区间直接丢弃、textOnly排除工具证据，节省输入不能替代保留关键事实；[Q03](#research-q03)不同provider历史兼容是单独门槛。

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
  - [Q01 · 人工整理相对阈值压缩增加什么？](#detail-section-11)
  - [Q02 · 编辑和区间压缩怎样改变模型可见历史？](#detail-section-12)
  - [Q03 · 备份与序号校验能保证完整恢复吗？](#detail-section-13)
  - [Q04 · 人工控制是否值得额外成本？](#detail-section-14)
  - [Q05 · 能否增加内容不变量与可试算摘要？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：了解长会话关键事实的人可手动筛选、纠正和压缩上下文，合格标准是后续任务仍保留重要约束。[Q01](#research-q01)

宿主阈值压缩减少人工步骤；新会话复制可重新控制上下文但丢位置关系。本插件用额外筛选成本换细粒度控制，净收益需同任务验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：人工消息标注、编辑与区间压缩工作台
- **Host 路由**：上下文读取、应用编辑和压缩接口

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Session与Web服务 | 启动必需 | 读取和写入上下文 | 工作台或写入不可用 |
| appendPluginRecord与消息投影 | 非用户消息编辑必需 | 助手工具上下文修改 | 仅部分编辑可用 |
| 当前摘要模型 | 区间压缩必需 | 分块生成摘要 | 返回不可用或调用失败 |
| 本地备份写权限 | 写入必需 | 写前保存原文 | 失败取消写入 |
| 官方compact命令 | 官方模式必需 | 宿主压缩 | 该模式不可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装重启并打开测试会话 | 工作台显示当前上下文 |
| 整理 | 用户标语气、编辑并确认 | 关键事实与范围明确 |
| 写入 | Host备份后投影或替换 | 检查成功、partial和flush状态 |
| 验收 | 用户检查下一请求与备份 | 语义符合要求，否则手工恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主与备份磁盘，金额未知 | 安装重启、学习消息与语气 | 需兼容Session投影API |
| 持续使用 | 每区间分块摘要调用与备份资源未知 | 筛选、纠错、检查后续质量 | token减少不等于总成本下降 |
| 失败恢复 | 重试模型与数据资源未知 | 查看partial、手工恢复备份 | 默认20份，无自动会话撤销 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 人工粒度控制 | 消息语气、编辑和区间替换 | 实际操作负担 |
| 格式护栏 | 序号、空闲、工具对与尾节点检查 | 所有并发与宿主兼容 |
| 信息保留 | 重要原文与备份机制 | 摘要丢失率和后续质量 |
| 成本节约 | 缩短后续可见文本 | 净费用、人工与失败恢复 |

> **思考**：确认后模型摘要直接写可见历史，没有逐段内容复核；格式配对和备份不保证语义保留。多区间异常可部分提交，备份只支撑手工恢复，不能等同自动撤销或事务隔离。[Q03](#research-q03) [Q02](#research-q02)次要区间直接丢弃、textOnly排除工具证据，节省输入不能替代保留关键事实；[Q03](#research-q03)不同provider历史兼容是单独门槛。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将逐消息重要性、工具对约束、文本纠正和区间摘要组合为人工工作台；基础surface及编辑投影明确改编自已有项目，增量是组织方式而非全新摘要算法。[Q01](#research-q01) [Q02](#research-q02)

纯函数surface与编辑规划、写前备份、明确partial结果值得借鉴；恢复方案诚实保留手工边界。审计失败不影响既有提交是可用性取舍，不能据此宣称每次修改都有完整成功审计。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

确认后模型摘要直接写可见历史，没有逐段内容复核；格式配对和备份不保证语义保留。多区间异常可部分提交，备份只支撑手工恢复，不能等同自动撤销或事务隔离。[Q03](#research-q03) [Q02](#research-q02)次要区间直接丢弃、textOnly排除工具证据，节省输入不能替代保留关键事实；[Q03](#research-q03)不同provider历史兼容是单独门槛。

<a id="detail-section-6"></a>

### 1.5 使用建议

先复制非关键会话，标明必须保留事实，少量应用与压缩后检查下一请求。练习从备份重建，清楚工具对和附件边界；无法承受手工恢复时保留原上下文。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

人工控制和写入护栏有固定源码支持；信息保留、并发事务与恢复效果未运行验证。候选摘要与不变量方案为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/surface.js、lib/backup.js、lib/edits.js、NOTICE.md、src/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定编辑、区间摘要、计划校验、备份和来源声明源码；未执行目标代码、测试、真实会话写入或模型调用。
- 下一步：核查投影后下一请求、关键约束保留、备份权限和恢复、多区间失败及并发增长，未执行。

**分析版本**

- **仓库**：[111222cjyq/dsh-curate](https://github.com/111222cjyq/dsh-curate)
- **版本号**：0.7.6（[固定提交 d3f8fc1](https://github.com/111222cjyq/dsh-curate/tree/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可先形成绑定输入序号的候选摘要，并以用户不变量和固定探针检查，再确认写入；同任务计入额外调用和人工，若信息遗失未减或成本过大则否定。未实现。[Q05](#research-q05)

核查投影后下一请求、关键约束保留、备份权限和恢复、多区间失败及并发增长，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1670 | — | — | 14513 |
| .mjs | source | 5 | 1568 | 1345 | 133 | — |
| .js | source | 8 | 12867 | 11477 | 944 | — |
| .mjs | test | 9 | 3574 | 3298 | 62 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/111222cjyq/dsh-curate/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验人工上下文整理的实际控制增量、信息保留与恢复负担。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 人工整理相对阈值压缩增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向长会话中已知哪些内容必须保留、哪些工具噪音可以缩短的人，合格结果是模型下一任务仍遵守关键事实与约束，同时上下文范围更符合用户需要。相对宿主到阈值自动压缩，它允许按消息标重要、一般和次要，并先修正错误文本，再决定区间摘要；相对复制到新会话，它保留原位置与日志关系。NOTICE明确surface fold、投影和部分编辑器改编自dsh-edit-turn及其panel，不能把这些基础能力算作独立原创。本次识别的增量在人工消息语气、工具对联动、编辑与区间摘要的工作台组合。控制权提升是设计解释，不等于后续任务质量或token节省已经验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-32](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/README.md#L17-L32)

作者定义人工筛选、编辑、压缩与原日志保留。

<details>
<summary>查看原文（16行）</summary>

```text
## 为什么需要它

长对话里最贵的不只是 token，还有**判断力**：

- 工具输出、运行日志、重复解释会挤占真正重要的上下文；
- 自动压缩不知道哪一句是需求、哪一句是过期草稿，容易把决定压掉；
- 只靠“再问一遍”无法纠正已经写进历史的错误措辞。

dsh-curate 不替人做自动摘要，而是把**模型可见的 surface** 摊开给人看：人可以精确保留、精确改写、按区间压缩，并清楚知道最后写进上下文的是什么。

## 功能

- **按轮整理**：把当前模型可见消息切成轮卡片，最后一条消息固定保留；支持最近 N 轮不压缩。
- **重要 / 默认 / 次要**：重要=原文保留；默认=压缩时生成常规摘要；次要=直接丢弃并只留一条省略标记。支持整轮批量设置，也支持单条覆盖。
- **原地改消息**：用户消息、助手正文/思维链、工具结果、注入上下文都能编辑；保存只是暂存，点「修改并应用到上下文」才写入，**不调用模型**。
- **真实 Chat 回显**：写入后 Chat 直接显示实际上下文里的文本；标题旁可在「修改后 / 原文」间切换。
```

</details>

**依据 2 · 作者声明**：[NOTICE.md:3-23](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/NOTICE.md#L3-L23)

改编归属明确，限制原创贡献判断。

<details>
<summary>查看原文（21行）</summary>

```text
`dsh-curate` is MIT-licensed. The following parts were adapted from other MIT
projects and keep their original attribution:

- `lib/surface.js` (surface fold, message readers) and parts of
  `lib/index.js` (loopback HTTP guard/body/error helpers) are adapted from
  **dsh-edit-turn 0.3.1**, Copyright (c) 2025 DDDMUC, MIT License.
- `lib/edits.js` (block readers, `plugin:dsh-curate/patch` record grammar,
  message projection for assistant replies, tool results and injected context)
  is adapted from dsh-edit-turn 0.3.1's `lib/patch.js`, Copyright (c) 2025
  DDDMUC, MIT License. The record type is renamed so both plugins can coexist in
  one process; the projection target shape was generalized to the other
  message-producing event types (tool/result, developer/message, non-human
  user/message).
- The prompt replacement carrier in `lib/index.js` (`user/message` with
  `source.kind: 'user'`, `editedBy`, and `surfaceOp: replace`) follows the
  contract established by dsh-edit-turn 0.3.1.
- Markdown conversion in `src/client.js` follows the approach of
  **dsh-edit-turn-panel**, an MIT local fork of the above; it bundles
  [marked](https://github.com/markedjs/marked) (MIT),
  [turndown](https://github.com/mixmark-io/turndown) (MIT),
  [turndown-plugin-gfm](https://github.com/mixmark-io/turndown-plugin-gfm) (MIT)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 编辑和区间压缩怎样改变模型可见历史？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

写入要求会话在当前进程打开且空闲、confirm为true和expectedLastSeq匹配。区间计划由validatePlan核对，摘要调用使用已投影的文本而非过时原事件，默认区间调用摘要模型，次要区间则直接丢弃并保留省略标记；之后以user/message surfaceOp replace替换可见区间，原日志仍追加保存。用户提示编辑走surface replacement，助手及工具结果等非提示编辑走插件记录与消息投影，工具参数保持原有结构。工具调用与结果边界、最后节点和重叠限制有源码校验，避免常见格式破坏。依赖宿主Session与投影API、Web路由、当前模型及本地备份权限；不能将保留原日志解读为模型仍看到原文。 0.7.6还可选只总结用户与助手正文的textOnly模式，工具结果、注入上下文、思维和工具声明不作为摘要源；这缩小输入，也会改变证据保留范围。不能把“只读文字视图”和“已修改模型上下文”混为一谈。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:887-923](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/index.js#L887-L923)

活跃空闲、确认和序号检查以及摘要后重检的具体顺序。

<details>
<summary>查看原文（37行）</summary>

```text
async function applyCuration(ctx, config, sessionId, body) {
  // Writes require the session to be open in this process. Never resume a cold
  // session just because a stale browser tab still holds its id: that would
  // spawn a hidden agent as a side effect.
  const live = findLiveSession(ctx, sessionId)
  if (!live || typeof live.append !== 'function') {
    throw new HttpError(409, 'session-not-active', '这条会话当前没有打开，无法写入。')
  }
  const events = await eventsForWrite(ctx, sessionId, live)
  if (!events) throw new HttpError(404, 'session-not-found', 'no session log for this id')
  if (isBusy(events)) throw new HttpError(409, 'busy', '这条会话还在工作，等它停下来再整理。')
  if (body.confirm !== true) throw new HttpError(400, 'confirm-required', '请先阅读并确认不可撤销提示。')
  const requested = Array.isArray(body.ops) ? body.ops : []
  const autoSummarize = body.autoSummarize === true
  const lastSeq = events.length > 0 ? events[events.length - 1].seq : -1
  // Staleness is checked before plan validation: a client that lost the race
  // must see 409 stale, not a misleading range error for the old surface.
  if (requireExpectedLastSeq(body) !== lastSeq) {
    throw new HttpError(409, 'stale', '打开工作台后会话又有了新消息，请刷新后再应用。')
  }
  const check = validatePlan(events, requested, { allowEmptySummary: autoSummarize })
  if (!check.ok) throw new HttpError(check.code === 'stale' ? 409 : 400, check.code, check.error)
  if (autoSummarize) {
    // The workbench no longer drafts per-block summaries. The model writes each
    // replacement just before the plan is committed, so a slow summary can
    // still race a new user message; re-check the surface head before writing.
    for (const op of check.ops) {
      if (op.kind !== 'summary') continue
      op.text = await summarizeOperation(ctx, config, live, events, op, { textOnly: body.textOnly === true })
      if (op.text.length > PLAN_LIMITS.maxSummaryChars) {
        throw new HttpError(400, 'summary-too-long', '摘要太长了，请缩小压缩范围或标记为次要后重试。')
      }
    }
    const latest = snapshotEvents(live) ?? (await readEvents(ctx, sessionId))
    const latestSeq = latest && latest.length > 0 ? latest[latest.length - 1].seq : -1
    if (latestSeq !== lastSeq) {
      throw new HttpError(409, 'stale', '压缩期间会话又有了新消息，已取消写入；请刷新后重试。')
```

</details>

**依据 2 · 源码核查**：[lib/index.js:852-882](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/index.js#L852-L882)

摘要读取有效投影文本并按块调用模型。

<details>
<summary>查看原文（31行）</summary>

```text
async function summarizeOperation(ctx, config, live, events, op, options = {}) {
  const tone = op.tone === 'minor' ? 'minor' : 'normal'
  const bySeq = new Map(events.map((event) => [event.seq, event]))
  const turns = turnIndex(events)
  // The model-visible text is what a summary has to describe: reply edits are a
  // projection, so the raw event alone would summarize wording the model no
  // longer reads.
  const textOnly = options.textOnly === true
  const source = sourceTextFor(events, bySeq, turns, op.shadowed, patchesOf(events), textOnly)
  if (source.trim() === '') {
    throw new HttpError(400, 'empty-range', textOnly ? '这个范围没有用户/助手的对话文本可摘要。' : '这个范围没有可摘要的文字。')
  }
  const route = await resolveRoute(ctx, config, live)
  const chunks = chunkSource(source, PLAN_LIMITS.summarizeChunkChars)
  const targetMax = tone === 'minor' ? 900 : 1_600
  const requestSessionId = live && typeof live.id === 'string' && live.id !== '' ? live.id : PLUGIN_ID
  const partials = []
  for (let index = 0; index < chunks.length; index += 1) {
    const partNote = chunks.length > 1 ? `\n\n这是第 ${index + 1}/${chunks.length} 段原文，只为这一段写摘要；不要重复其他段的内容。` : ''
    const prompt = [
      toneInstruction(tone),
      textOnly ? '本次只总结用户与助手的对话文本；不要臆测工具输出或注入上下文。' : '',
      `目标长度：不超过约 ${Math.max(120, Math.round(targetMax / Math.max(1, chunks.length)))} tokens。${partNote}`,
      '',
      '原文开始',
      chunks[index],
      '原文结束',
    ].filter((line) => line !== '').join('\n')
    partials.push(await streamSummary(route, prompt, targetMax, requestSessionId))
  }
  return partials.join('\n\n')
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1268-1311](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/index.js#L1268-L1311)

用户提示替换与非提示patch的两条写路径。

<details>
<summary>查看原文（44行）</summary>

```text
  const applied = []
  try {
    for (const op of changed) {
      if (op.mode === 'prompt') {
        const content = composePromptContent(op.blocks, op.text)
        const carrier = {
          type: 'user/message',
          data: {
            id: randomUUID(),
            role: 'user',
            content,
            // A prompt this plugin merely rewrote is still a human prompt: the
            // platform and every prompt consumer key on `kind: 'user'`. The
            // provenance rides in `editedBy` instead.
            source: { kind: 'user', editedBy: PLUGIN_ID },
          },
        }
        const event = live.append(carrier.type, carrier.data, {
          surfaceOp: { op: 'replace', startSeq: op.seq, endSeq: op.seq },
          sourceEventSeqs: [op.seq],
        })
        applied.push({
          mode: 'prompt',
          seq: op.seq,
          messageId: op.messageId,
          replaced: op.original,
          replacementSeq: event.seq,
        })
        continue
      }
      const patchTarget = op.append === true
        ? { seq: op.seq, append: true, kind: 'text', text: op.text }
        : { seq: op.seq, blockIndex: op.blockIndex, kind: op.blockKind, text: op.text }
      const recordSeq = sessionApi.appendPluginRecord(live, PATCH_TYPE, buildPatchData([patchTarget]))
      applied.push({
        mode: 'reply',
        seq: op.seq,
        messageId: op.messageId,
        blockIndex: op.blockIndex,
        blockKind: op.blockKind,
        ...(op.append === true ? { append: true } : {}),
        replaced: op.original,
        recordSeq,
      })
```

</details>

**依据 4 · 源码核查**：[lib/surface.js:372-410](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/surface.js#L372-L410)

尾节点与工具配对约束限制可压缩范围。

<details>
<summary>查看原文（39行）</summary>

```text
    if (endIdx > lastIdx) {
      return { ok: false, code: 'invalid-range', error: '压缩范围越过了会话末尾。' }
    }
    if (endIdx - startIdx + 1 > PLAN_LIMITS.maxRangeMessages) {
      return { ok: false, code: 'range-too-large', error: `一个压缩块最多覆盖 ${PLAN_LIMITS.maxRangeMessages} 条消息。` }
    }
    if (endIdx === lastIdx) {
      return { ok: false, code: 'tail-locked', error: '最后一条消息不能被压缩，请至少保留它。' }
    }
    const shadowed = nodes.slice(startIdx, endIdx + 1)
    for (const seq of shadowed) {
      const event = bySeq.get(seq)
      if (!event) return { ok: false, code: 'stale', error: '会话已经发生变化，请刷新后重新选择。' }
      if (event.type === 'system/message') {
        return { ok: false, code: 'system-locked', error: '系统提示不能被压缩。' }
      }
    }
    const callIds = new Set()
    const resultIds = new Set()
    for (const seq of shadowed) {
      const event = bySeq.get(seq)
      for (const call of toolCallsOf(event)) callIds.add(call.id)
      const result = toolResultCallOf(event)
      if (result !== undefined) resultIds.add(result)
    }
    for (const callId of callIds) {
      if (!resultIds.has(callId)) {
        return {
          ok: false,
          code: 'tool-pair',
          error: `第 ${startSeq}–${endSeq} 条消息里的工具调用没有包含对应的工具结果，请把范围扩大。`,
        }
      }
    }
    for (const resultId of resultIds) {
      if (!callIds.has(resultId)) {
        return {
          ok: false,
          code: 'tool-pair',
```

</details>

**依据 5 · 源码核查**：[src/client.js:3683-3697](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/src/client.js#L3683-L3697)

客户端将次要区间构成drop，仅默认区间要求模型summary。

<details>
<summary>查看原文（15行）</summary>

```text
          } else {
            // Minor segments are dropped by the host (it writes only the
            // omission marker); only Default segments get a model summary.
            const ops = opsSegments.map((segment) => ({
              kind: segment.tone === 'minor' ? 'drop' : 'summary',
              startSeq: segment.startSeq,
              endSeq: segment.endSeq,
              tone: segment.tone,
            }))
            let result
            try {
              result = await applyPlan(sessionId, lastSeq, ops, '', {
                autoSummarize: true,
                textOnly: summaryTextOnly,
              })
```

</details>

**依据 6 · 源码核查**：[lib/index.js:715-741](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/index.js#L715-L741)

textOnly摘要源明确省略工具、注入与思维，仍读取投影后文本。

<details>
<summary>查看原文（27行）</summary>

```text
function sourceTextFor(events, bySeq, turns, shadowed, patches, textOnly) {
  const parts = []
  for (const seq of shadowed) {
    const event = bySeq.get(seq)
    if (!event) continue
    const effective = projectEvent(event, patches)
    const heading = nodeHeading(effective, turnOfEvent(turns, effective))
    if (textOnly === true) {
      // Conversation-only summaries: user prompts and assistant text blocks,
      // without tool results, injected context, reasoning or tool calls.
      const role = roleOf(effective)
      if (role !== 'user' && role !== 'assistant') continue
      const text = readMessageBlocks(effective)
        .filter((block) => isTextBlock(block))
        .map((block) => block.text)
        .join('\n')
      if (text.trim() === '') continue
      parts.push(`${heading}\n${clampText(text, NODE_TEXT_CAP)}`)
      continue
    }
    const body = clampText(eventText(effective), NODE_TEXT_CAP)
    parts.push(`${heading}\n${body}`)
  }
  return parts.join('\n\n')
}

function chunkSource(source, size) {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 备份与序号校验能保证完整恢复吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

备份是写入前的自包含JSON，默认每会话保留20份，目录0700与文件0600，并非会话内撤销或事务回滚。多区间逐次append，异常返回已应用和剩余列表，代码明确允许部分提交；审计追加失败也不会回滚已经改变的surface。expectedLastSeq可拒绝打开后增长和摘要期间增长，但备份为异步I/O，后续append前没有本函数内的最终原子CAS；实际并发是否被宿主串行化需核查，不能把局部序号检查称为全局事务隔离。更影响核心价值的是确认后模型直接生成摘要，无逐段摘要人工复核，工具对保持只保证格式，不保证关键语义未丢失。备份保留原件也不能使模型自动恢复遗失信息。 作者还单列非DeepSeek模型可能不接受改写历史的边界，本地投影成功不能证明供应商接受历史或思维签名；需对目标模型单独验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/backup.js:17-49](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/backup.js#L17-L49)

保留上限与清理机制限制历史恢复窗口。

<details>
<summary>查看原文（33行）</summary>

```text
/** Default number of backups retained per session. */
const DEFAULT_RETENTION = 20

/** The root of the backup tree; override with DSH_CURATE_BACKUP_DIR. */
export function backupRoot() {
  const override = process.env.DSH_CURATE_BACKUP_DIR
  if (typeof override === 'string' && override.trim() !== '') return override.trim()
  return join(homedir(), '.local', 'share', 'dsh-curate', 'backups')
}

/** How many backups one session keeps (positive safe integer, max 999). */
export function backupRetention() {
  const raw = process.env.DSH_CURATE_BACKUP_KEEP
  const value = typeof raw === 'string' ? Number.parseInt(raw, 10) : Number.NaN
  return Number.isInteger(value) && value > 0 ? Math.min(value, 999) : DEFAULT_RETENTION
}

/** A filename-safe ISO timestamp (millisecond order sorts lexicographically). */
function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

/** Delete the oldest backups above the retention limit. Never throws. */
async function pruneBackups(dir) {
  try {
    const keep = backupRetention()
    const names = (await readdir(dir)).filter((name) => name.endsWith('.json')).sort()
    for (const name of names.slice(0, Math.max(0, names.length - keep))) {
      await unlink(join(dir, name)).catch(() => {})
    }
  } catch {
    // Retention is best effort: never fail a backup because pruning did.
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:944-993](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/index.js#L944-L993)

异步备份后逐区间append，不是单个原子多区间操作。

<details>
<summary>查看原文（50行）</summary>

```text
  let backupFile
  try {
    backupFile = await writeBackup(sessionId, {
      version: 1,
      kind: 'dsh-curate-apply',
      planId,
      createdAt,
      sessionId,
      label,
      surfaceBefore: foldSurface(events).nodes,
      lastSeq,
      ops: check.ops.map((op) => ({
        kind: op.kind,
        startSeq: op.startSeq,
        endSeq: op.endSeq,
        shadowed: op.shadowed,
        summary: op.text,
        events: op.shadowedEvents,
      })),
    })
  } catch (error) {
    throw new HttpError(500, 'backup-failed', `无法写入备份，已取消：${String((error && error.message) || error)}`)
  }

  const planRecordSeq = appendRecordOrThrow(live, `plugin:${PLUGIN_ID}/plan`, {
    version: 1,
    planId,
    createdAt,
    expectedLastSeq: lastSeq,
    label,
    ops: check.ops.map((op) => ({ kind: op.kind, startSeq: op.startSeq, endSeq: op.endSeq, text: op.text })),
  })

  const applied = []
  try {
    for (const op of check.ops) {
      const text = op.kind === 'drop' ? op.text.trim() === '' ? dropMarker(op) : op.text.trim() : frameSummary(op, op.nodeRecords, label)
      const carrier = {
        type: 'user/message',
        data: {
          id: randomUUID(),
          role: 'user',
          content: [{ type: 'text', text }],
          source: { kind: `plugin:${PLUGIN_ID}`, plugin: PLUGIN_ID },
        },
      }
      const event = live.append(carrier.type, carrier.data, {
        surfaceOp: { op: 'replace', startSeq: op.startSeq, endSeq: op.endSeq },
        sourceEventSeqs: [planRecordSeq, ...op.shadowed],
      })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1002-1035](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/index.js#L1002-L1035)

审计失败保留提交，写入失败返回partial而非回滚。

<details>
<summary>查看原文（34行）</summary>

```text
    const flush = await flushSession(ctx, live)
    let appliedRecordSeq = null
    try {
      appliedRecordSeq = sessionApi.appendPluginRecord(live, `plugin:${PLUGIN_ID}/applied`, {
        version: 1,
        planId,
        planRecordSeq,
        backupFile,
        applied,
      })
    } catch {
      // The surface is already committed; a missing audit record must not fail the apply.
    }
    return {
      ok: true,
      planId,
      planRecordSeq,
      appliedRecordSeq,
      applied,
      backupFile,
      flushed: flush.flushed,
      flushError: flush.flushError || null,
    }
  } catch (error) {
    return {
      __partial: {
        ok: false,
        code: 'apply-failed',
        error: String((error && error.message) || error),
        planId,
        planRecordSeq,
        backupFile,
        applied,
        remaining: check.ops.slice(applied.length).map((op) => ({ kind: op.kind, startSeq: op.startSeq, endSeq: op.endSeq })),
```

</details>

**依据 4 · 作者声明**：[README.md:118-126](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/README.md#L118-L126)

作者明确供应商历史接受范围，属需验证外部边界。

```text

- **推理签名 / thinking blocks**：部分模型要求 reasoning 内容带服务端签名，改写历史后签名与文本不一致，provider 可能拒绝请求；
- **不可变历史 / 服务端会话状态**：部分模型把历史保存在服务端，或要求严格的角色/消息顺序，客户端改写历史可能被忽略或报错；
- **缓存前缀**：修改历史会改变 prompt 前缀，依赖前缀缓存的模型会降低缓存命中；
- **消息格式约束**：不同 provider 对 tool 调用、注入上下文和 assistant 文本块的校验不同。

dsh-curate 的投影和显示层在 DSH 本地是正确的，但“本地投影成功”不等于“所有 provider 都接受改写后的历史”。**在非 DeepSeek 模型上请先做小规模验证，不要直接用于生产上下文。** 如果 provider 拒绝修改后的历史，回退到原文并从备份恢复。

## 上下文缓存与成本
```

#### 缺口

- 宿主并发串行化与故障后的人工重建可行性未验证。
  **影响**：不能保证所有竞争场景及恢复完整性。
  **进一步探讨**：在测试会话注入备份等待期间增长和第二区间append失败，核对surface与备份。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 人工控制是否值得额外成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

成本单位应是一段整理后仍能完成相同关键任务的会话，而不是压缩后的token数。首次安装重启并理解消息类型和语气，持续人工筛选、编辑及按区间模型摘要，失败时从备份手工抄回与检查工具配对都需计入。每个区间还可能分多个源块调用模型，摘要多并不自动降低本次费用；后续调用能否回本取决于任务长度和保留质量。备份含完整对话与附件，增加隐私和磁盘管理负担。金额、时间、信息丢失率均未测。适合明确知道保留约束且能用非关键测试任务验证的人小范围试用；审计原文必须持续可见或不能接受手工恢复的关键会话宜先保留原上下文，不能依赖20份备份承诺无限历史。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:864-882](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/index.js#L864-L882)

按源块调用摘要模型说明额外模型成本来源。

<details>
<summary>查看原文（19行）</summary>

```text
  const route = await resolveRoute(ctx, config, live)
  const chunks = chunkSource(source, PLAN_LIMITS.summarizeChunkChars)
  const targetMax = tone === 'minor' ? 900 : 1_600
  const requestSessionId = live && typeof live.id === 'string' && live.id !== '' ? live.id : PLUGIN_ID
  const partials = []
  for (let index = 0; index < chunks.length; index += 1) {
    const partNote = chunks.length > 1 ? `\n\n这是第 ${index + 1}/${chunks.length} 段原文，只为这一段写摘要；不要重复其他段的内容。` : ''
    const prompt = [
      toneInstruction(tone),
      textOnly ? '本次只总结用户与助手的对话文本；不要臆测工具输出或注入上下文。' : '',
      `目标长度：不超过约 ${Math.max(120, Math.round(targetMax / Math.max(1, chunks.length)))} tokens。${partNote}`,
      '',
      '原文开始',
      chunks[index],
      '原文结束',
    ].filter((line) => line !== '').join('\n')
    partials.push(await streamSummary(route, prompt, targetMax, requestSessionId))
  }
  return partials.join('\n\n')
```

</details>

**依据 2 · 源码核查**：[lib/backup.js:58-73](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/backup.js#L58-L73)

完整JSON写盘及权限与裁剪带来磁盘和隐私责任。

<details>
<summary>查看原文（16行）</summary>

```text
 */
export async function writeBackup(sessionId, payload, suffix = 'apply') {
  const root = backupRoot()
  const dir = join(root, String(sessionId))
  await mkdir(dir, { recursive: true, mode: 0o700 })
  // mkdir's mode is ignored for an existing directory; enforce it explicitly.
  await chmod(root, 0o700).catch(() => {})
  await chmod(dir, 0o700).catch(() => {})
  const label = typeof suffix === 'string' && suffix.trim() !== '' ? suffix.trim().replace(/[^a-z0-9-]/gi, '-') : 'apply'
  // Random suffix: two writes in the same millisecond must not overwrite one
  // another (and the audit record must point at the file it actually wrote).
  const file = join(dir, `${stamp()}-${randomBytes(4).toString('hex')}-${label}.json`)
  await writeFile(file, JSON.stringify(payload, null, 2), { encoding: 'utf8', mode: 0o600 })
  await chmod(file, 0o600).catch(() => {})
  await pruneBackups(dir)
  return file
```

</details>

**依据 3 · 作者声明**：[README.md:147-156](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/README.md#L147-L156)

作者说明不可撤销、备份、审计及空闲条件，需与源码一起理解。

<details>
<summary>查看原文（10行）</summary>

```text
## 安全与可恢复性

- 修改和压缩前写本地 JSON 备份，默认目录 `~/.local/share/dsh-curate/backups/<sessionId>/`，目录 `0700`、文件 `0600`；
- 会话日志 append-only；原文被 surface 替换阴影，但不会从日志消失；
- 应用前校验 `expectedLastSeq`，会话增长返回 `409 stale`；忙会话拒绝写入；
- 路由只监听 loopback，并校验 `Host` / `Origin`；
- 编辑不调用模型；只有「按整理结果压缩」会在确认后调用模型生成摘要；
- 每次写入产生 `edit-plan` / `edit-applied` / `plan` / `applied` / `compact` 审计记录。

备份路径、保留上限、provider/model 配置等细节见 [`docs/USAGE.md`](docs/USAGE.md)。
```

</details>

#### 缺口

- 没有同任务上下文质量、模型费用和人工时间对照。
  **影响**：无法确认收益覆盖整理与恢复成本。
  **进一步探讨**：用固定事实问答和后续编辑任务比较不压、官方compact和人工整理。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否增加内容不变量与可试算摘要？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的不变量清单与试算摘要，用户先选必须保留的约束、结论和来源，摘要只生成到候选层，再用固定探针问题检查这些不变量；用户确认候选摘要与节省估算后才写surface。状态由插件持有候选摘要与输入序号，写入仍须最终匹配序号，新增代价是额外模型探针、摘要审阅和候选失效处理。推导来自Q03的语义损失与无复核路径，不是要求所有区间都人工重写。最小验证以同事实会话比较当前直接压缩与候选方案，计入全部调用和人工时间，观察约束遗失及后续任务质量。若探针仍漏关键信息或复核成本大于重开会话，假设不成立。当前没有该保障，不能计入已实现能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:909-923](https://github.com/111222cjyq/dsh-curate/blob/d3f8fc1af3935e62becf7fe4a15b92f9a78e7f97/lib/index.js#L909-L923)

确认后即生成摘要，只有序号重检，为候选复核设计提供推导。

<details>
<summary>查看原文（15行）</summary>

```text
  if (autoSummarize) {
    // The workbench no longer drafts per-block summaries. The model writes each
    // replacement just before the plan is committed, so a slow summary can
    // still race a new user message; re-check the surface head before writing.
    for (const op of check.ops) {
      if (op.kind !== 'summary') continue
      op.text = await summarizeOperation(ctx, config, live, events, op, { textOnly: body.textOnly === true })
      if (op.text.length > PLAN_LIMITS.maxSummaryChars) {
        throw new HttpError(400, 'summary-too-long', '摘要太长了，请缩小压缩范围或标记为次要后重试。')
      }
    }
    const latest = snapshotEvents(live) ?? (await readEvents(ctx, sessionId))
    const latestSeq = latest && latest.length > 0 ? latest[latest.length - 1].seq : -1
    if (latestSeq !== lastSeq) {
      throw new HttpError(409, 'stale', '压缩期间会话又有了新消息，已取消写入；请刷新后重试。')
```

</details>

#### 缺口

- 不变量探针和候选摘要未实现或测量。
  **影响**：无法宣称降低信息丢失。
  **进一步探讨**：用含已知关键约束的测试会话做同预算质量对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
