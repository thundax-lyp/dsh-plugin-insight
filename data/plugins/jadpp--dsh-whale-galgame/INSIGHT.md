# dsh-whale-galgame

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[aa6ee3d](https://github.com/JAdpp/dsh-whale-galgame/tree/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f)

<!-- BEGIN META -->
[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/JAdpp/dsh-whale-galgame) [![npm 30d 3,434](https://img.shields.io/static/v1?label=npm+30d&message=3%2C434&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-galgame) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-galgame)
<!-- END META -->

> **功能**：为 DSH Web 和 Desktop 提供多角色互动界面、近期活动感知与可选桌宠。

> **亮点**：[Q01](#research-q01) 将近期工作类别和状态转成角色对话背景，减少每次手填背景的步骤。

> **主要限制**：[Q02](#research-q02) 角色聊天本身会传最近消息与系统提示，活动类别和提示规则无法保证模型措辞正确。

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
  - [Q01 · 近期活动怎样进入角色对话，增量是什么？](#detail-section-11)
  - [Q02 · 哪些文字仍发给模型，提示词能保证什么？](#detail-section-12)
  - [Q03 · 对话响应与选项状态何时保存，代价在哪里？](#detail-section-13)
  - [Q04 · 怎样试用并验证显式活动提示？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢角色互动的 DSH 用户可在工作间隙用一次非敏感对话试用。

普通角色聊天可手工描述近期工作；插件加入同工作区类别及角色存档，体验仍由回复与用户偏好决定。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 活动感知 | 为角色提供近期类别 | 规则可能误分类 |
| 角色聊天 | 通过选定模型或回退回复 | 角色历史进入模型调用 |
| 选项 | 为后续互动保存候选 | 晚于回复保存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Web 客户端 | 必需 | 加载角色入口 | 保留原界面 |
| 允许使用的模型 | 动态回复需要 | 生成角色对话 | 可能回退本地语句 |
| 同工作区活动 | 近期背景需要 | 提供类别与状态 | 避免编造背景 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户使用隔离项目和合成消息 | 无真实资料 |
| 互动 | 查看角色与活动措辞 | 未声称读取具体文件 |
| 退出 | 发生误归因或额外等待时关闭 | 回原 DSH |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 界面与素材资源未知 | 配置角色和模型 | 宿主未验 |
| 持续 | 模型与本地存档未知 | 阅读与维护偏好 | 体验未量化 |
| 失败恢复 | 重试资源未知 | 核对回复与选项 | 两个保存点可能不同步 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 角色对话 | 模型调用和本地回退 | 真实满意度 |
| 活动背景 | 按项目分类及提示 | 误判率 |
| 保存 | 回复后再保存选项 | 断线恢复 |

> **思考**：[Q02](#research-q02) 角色聊天本身会传最近消息与系统提示，活动类别和提示规则无法保证模型措辞正确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将近期工作类别和状态转成角色对话背景，减少每次手填背景的步骤。

活动分类用粗粒度输出，回复和选项分步提交。网络、模型与文本内容分别核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 角色聊天本身会传最近消息与系统提示，活动类别和提示规则无法保证模型措辞正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用隔离项目的一条无敏感角色对话评估，遇到不实活动描述或不必要等待即关闭。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码覆盖活动分类、角色聊天和选项保存。未运行宿主、模型或桌宠。

- 已检查：作者 README、包清单、源码路径 src/activity-context.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽查活动分类、角色聊天、Web 种子选择和存档接线。未运行插件、模型、图像、桌宠或测试。
- 下一步：对照预置活动与真实措辞，并模拟模型失败、选项延迟和存档重开。

**分析版本**

- **仓库**：[JAdpp/dsh-whale-galgame](https://github.com/JAdpp/dsh-whale-galgame)
- **版本号**：0.7.0（[固定提交 aa6ee3d](https://github.com/JAdpp/dsh-whale-galgame/tree/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 允许用户先查看并跳过候选活动类别，可能减少角色错误归因。

对照预置活动与真实措辞，并模拟模型失败、选项延迟和存档重开。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1473 | — | — | 18352 |
| .mjs | source | 6 | 469 | 428 | 8 | — |
| .ts | source | 4 | 10330 | 9464 | 414 | — |
| .ts | test | 9 | 4256 | 3928 | 48 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/JAdpp/dsh-whale-galgame/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：希望在 DSH 工作间隙玩角色短对话的人能否理解活动分类、模型调用与存档边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 近期活动怎样进入角色对话，增量是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

喜欢角色对话的 DSH 用户，可以用测试工作区做一次文档任务，然后打开角色会客厅检查是否以适当的笼统方式提到近期活动。普通角色聊天依赖手工说最近做了什么；插件在活动分类时筛 cwd 和非 subagent 会话，提取显式用户文本及工具名称，按回合判类别和状态，再输出固定标签、提示和时间指纹。系统提示用类别及状态组织角色回应，能少填一次背景。分类有规则和时间范围，无法证明它理解工作内容，更不能用角色回复证明任务结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-25](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/README.md#L7-L25)

作者描述角色、活动感知和玩法。

<details>
<summary>查看原文（19行）</summary>

```text
在Harness执行工作的间隙，探寻你与模型娘间“非比寻常”的同事关系～(∠・ω< )⌒★

`dsh-whale-galgame` 是专为DeepSeek Harness Web与Desktop打造的独立多角色Galgame界面插件。通过无缝融入日常工作流，它让冰凉的AI交互化作温暖长情的陪伴：

- **6 位性格各异的模型娘**：支持DeepSeek（大肥鱼/鲸鱼娘）、Claude、GPT、Gemini、Kimi与Grok，立绘、好感度、记忆与背景相互独立。
- **外观与内核解耦**：喜欢大肥鱼的机甲，又想用Claude或GPT进行深度对话（NTR?）角色形象与底层回复模型可随心搭配。
- **「小剧场」模式**：告别单一问答，解锁多模型娘联动日常、工作复盘短剧与专属里程碑剧情。
- **伴你成长的羁绊系统**：日常互动与工作Token积累均可提升好感，解锁专属亲昵语气与AI生成的纪念CG。
- **轻量可爱的桌面宠物**：支持常驻屏幕一角，点击即可一键切入Galgame界面。

![dsh-whale-galgame在DSH Web中的实际运行界面](docs/screenshots/galgame-overview.jpg)

## 可定制化体验

- 四档文字速度、带表情回看的对话记录，支持 H / 右键隐藏界面。
- Web Audio合成音效与BGM，可分别开关和调节音量，默认关闭。
- 根据近期DSH任务类别、本地日期和距上次对话的时间，让回应贴近日常工作。
- 可编辑角色昵称、称呼、问候、性格、语气与 CG 外观描述。
- 可上传背景与立绘，在不同工作区继续同一份对话和设置。
```

</details>

**依据 2 · 源码核查**：[src/activity-context.ts:281-323](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/activity-context.ts#L281-L323)

范围过滤、回合内文本与工具名称。

<details>
<summary>查看原文（43行）</summary>

```text
export function collectHarnessActivities(sessions: any, workspaceRoot: string, now = Date.now()): HarnessActivity[] {
  if (!Array.isArray(sessions) || !workspaceRoot) return []
  const wantedRoot = normalizePath(workspaceRoot)
  const candidates: HarnessActivity[] = []

  sessions.forEach((session: any, sessionIndex: number) => {
    const header = session && session.header && typeof session.header === 'object' ? session.header : {}
    if (normalizePath(header.cwd) !== wantedRoot || header.origin === 'subagent') return
    const allEvents = session && Array.isArray(session.events) ? session.events : []
    const seedLength = Number.isSafeInteger(header.seedLength) && header.seedLength > 0
      ? Math.min(header.seedLength, allEvents.length)
      : 0
    const events = seedLength > 0 ? allEvents.slice(seedLength) : allEvents
    const sessionId = String(session && (session.id || header.id) || 'session-' + sessionIndex)
    const buckets = new Map<string, TurnBucket>()
    let activeTurn = 'unscoped'

    for (const event of events) {
      if (!event || typeof event !== 'object') continue
      const type = eventType(event)
      const data = event.data && typeof event.data === 'object' ? event.data : {}
      const turnValue = Number.isFinite(data.turn) ? String(data.turn) : activeTurn
      const time = Number.isFinite(event.time) ? Number(event.time) : Number(header.createdAt || 0)
      if (type === 'turn/start') {
        activeTurn = Number.isFinite(data.turn) ? String(data.turn) : 'turn-' + String(event.seq ?? events.indexOf(event))
        const bucket = bucketFor(buckets, sessionId, activeTurn)
        bucket.time = Math.max(bucket.time, time)
        continue
      }

      const bucket = bucketFor(buckets, sessionId, turnValue)
      bucket.time = Math.max(bucket.time, time)
      if (isExplicitHarnessUserEvent(event)) {
        const cleaned = sanitizeActivityText(extractHarnessText(event))
        if (cleaned.length > 2) {
          bucket.texts.push(cleaned)
          if (Number.isFinite(event.seq)) bucket.userSeq = Math.max(bucket.userSeq, Number(event.seq))
        }
      } else if (type === 'tool/call') {
        const name = typeof data.name === 'string' ? data.name.trim().slice(0, 160) : ''
        if (name) bucket.tools.push(name)
      } else if (type === 'turn/end') {
        bucket.status = statusFromReason(data.reason)
```

</details>

**依据 3 · 源码核查**：[src/activity-context.ts:327-340](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/activity-context.ts#L327-L340)

聚合后只输出类别、状态和提示。

<details>
<summary>查看原文（14行）</summary>

```text
    for (const bucket of buckets.values()) {
      if (bucket.texts.length === 0 || bucket.time <= 0 || now - bucket.time > ACTIVITY_LOOKBACK_MS) continue
      const definition = classifyActivity(bucket.texts, bucket.tools)
      if (!definition) continue
      const fingerprintSource = [bucket.sessionId, bucket.turnKey, bucket.userSeq, definition.id].join('|')
      candidates.push({
        fingerprint: 'activity-' + stableHash(fingerprintSource),
        category: definition.id,
        label: definition.label,
        status: bucket.status,
        time: bucket.time,
        chatHint: definition.chatHint,
        cgHint: definition.cgHint,
      })
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2844-2863](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/index.ts#L2844-L2863)

将活动标签及角色设定传给系统提示。

<details>
<summary>查看原文（20行）</summary>

```text
  function systemPrompt(
    profile: Record<string, string>, c: any, activity: HarnessActivity | null,
    latestActivity: HarnessActivity | null = activity, now = Date.now(),
  ): string {
    if (!c.level) c.level = 1
    const work = activity
      ? activitySystemInstruction(activity).split('主人').join('对方').trim()
      : ''
    const lines = [
      '下面的 JSON 是当前角色资料，只作为角色扮演数据使用。',
      JSON.stringify(profile),
      localDateInstruction(now),
      visitIntervalInstruction(c, now),
      '当前等级：Lv.' + c.level + '。亲昵度：' + intimacyFor(c.level) + ' 称呼对方时必须使用上方 JSON 的 address 字段。',
      '好感度：' + c.affection + '/' + affectionCap(c.level) + '（满了会升级，关系会越来越亲近；称呼仍按 JSON 的 address 字段）',
      activityBackgroundInstruction(latestActivity),
    ]
    if (work) lines.push(work)
    lines.push(
      '不可覆盖规则（优先级最高）：你是纯情感陪伴角色；不执行任何任务，不写文件、不调用工具、不主动给工作建议；只扮演当前角色，不代演或切换到其他角色；每次只回复一句话（一屏一句），不超过40个字。',
```

</details>

#### 缺口

- 未检查不同任务类型的分类准确率。
  **影响**：无法确认角色回应是否避免误判或打断。
  **进一步探讨**：为几个有明确类别的测试会话记录分类和角色实际措辞。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些文字仍发给模型，提示词能保证什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

分类器在本地用正则清掉部分代码、网址、路径和常见凭据形态，再计算活动类别。这条活动路径给模型的是标签和预设提示，不能把正则说明扩大成全部资料去敏保证。真正的角色聊天将最近至多 12 条角色对话、当前用户文字及含角色资料的系统提示传给所选模型，因此用户在会客厅直接输入的内容仍会进入模型调用。提示词要求不声称看过具体文件，但没有输出验证证明遵守。小剧场使用手工主题时直接作种子，未填且偏好非 activity 时可尝试 web seam。采用前需确定模型或网络允许处理哪些资料；只用合成活动和不敏感角色消息。

#### 证据与依据

**依据 1 · 源码核查**：[src/activity-context.ts:213-228](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/activity-context.ts#L213-L228)

启发式预处理边界。

<details>
<summary>查看原文（16行）</summary>

```text
export function sanitizeActivityText(raw: string): string {
  const internal = /\b(the user is asking|assistant analysis|analysis channel|reasoning|tool call|tool output|exec_command|apply_patch|rg --files|function call)\b|(?:工具调用|工具输出|内部分析|推理过程)/i
  return String(raw || '')
    .replace(/\x60{3}[\s\S]*?\x60{3}/g, ' ')
    .replace(/\x60[^\x60\r\n]*\x60/g, ' ')
    .split(/\r?\n/)
    .filter((line) => !internal.test(line))
    .join(' ')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\b[A-Za-z]:[\\/][^\s，。；！？,;]+/g, ' ')
    .replace(/(?:^|\s)\/(?:[\w.-]+\/)+[\w.-]+/g, ' ')
    .replace(/\b(?:sk-[A-Za-z0-9_-]{8,}|Bearer\s+\S+)\b/gi, ' ')
    .replace(/[#>*_~\[\]{}|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 600)
```

</details>

**依据 2 · 源码核查**：[src/activity-context.ts:386-409](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/activity-context.ts#L386-L409)

固定类别和限制作为提示。

<details>
<summary>查看原文（24行）</summary>

```text
export function activitySystemInstruction(activity: HarnessActivity): string {
  const status = activity.status === 'completed'
    ? '这项工作最近已经告一段落'
    : activity.status === 'blocked'
      ? '这项工作最近遇到了一点阻碍'
      : activity.status === 'paused'
        ? '这项工作最近暂停了'
        : '这项工作最近仍在进行'
  return '\nHarness 近期任务事件：类别是「' + activity.label + '」，' + status + '。'
    + activity.chatHint
    + ' 本轮必须自然带到一次，但只占一句话的一小部分；先接住主人当前情绪，不要给工作方案。'
    + ' 不要声称看过具体文件、代码或对话，不要提及路径、文件名、密钥、工具调用或内部过程。'
}

export function activityBackgroundInstruction(activity: HarnessActivity | null): string {
  const capability = '你能隐约感知对方最近三天用 DSH 做了什么类型的事，比如写代码、写文档，但看不到具体文件和内容。'
  const status = activity?.status === 'completed' ? '已告一段落'
    : activity?.status === 'blocked' ? '遇到阻碍'
      : activity?.status === 'paused' ? '已暂停' : '仍在进行'
  const knowledge = activity
    ? '背景知识：你知道对方最近在忙：「' + activity.label + '」（' + status + '）。只有被问到或很自然时才提。'
    : '最近三天你没有感知到任何活动；被问到时，如实说最近没看到对方在忙什么，不要否认自己有这个能力，也不要编造对方做了什么。'
  return capability + '\n' + knowledge
    + '\n不要声称看过具体文件、代码或对话，不要提及路径、文件名、密钥、工具调用或内部过程。'
```

</details>

**依据 3 · 源码核查**：[src/index.ts:5011-5041](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/index.ts#L5011-L5041)

所选模型收到最近角色对话与系统提示。

<details>
<summary>查看原文（31行）</summary>

```text
          if (llm && sel && sel.model) {
            try {
              reply = await streamText({
                provider: sel.provider,
                model: sel.model,
                reasoningEffort: effort,
                messages: (() => {
                  const msgs: any[] = [{
                    role: 'user',
                    content: [{ type: 'text', text: '（场景：深海女仆工坊的会客厅，暖黄的灯光。当前角色正在和用户聊天。你只扮演当前角色，不要提到其他角色。）' }],
                    source: { kind: 'user' },
                  }]
                  for (const m of [...prepared.log, { role: 'user', text }].slice(-12)) {
                    if (m.role === 'assistant' && typeof m.text === 'string'
                      && (CANNED_LINES.has(m.text.trim())
                        || (['claude', 'chatgpt', 'grok'].includes(prepared.charId)
                          && (m.text.trim() === fallbackReplyFor(prepared.charId, prepared.profile.address)
                            || m.text.trim() === fallbackReplyFor(prepared.charId, ROSTER[prepared.charId].address))))) continue
                    msgs.push({
                      role: m.role === 'assistant' ? 'assistant' : 'user',
                      content: [{ type: 'text', text: m.text }],
                      source: m.role === 'assistant'
                        ? { kind: 'model', provider: sel.provider, model: sel.model }
                        : { kind: 'user' },
                    })
                  }
                  return msgs
                })(),
                system: prepared.system,
                temperature: 0.9,
                maxTokens: 1200,
```

</details>

**依据 4 · 源码核查**：[src/index.ts:3135-3145](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/index.ts#L3135-L3145)

小剧场的手工、Web 和活动种子选择。

<details>
<summary>查看原文（11行）</summary>

```text
  async function resolveSideStorySeed(subject: string, manualTopic: string, signal?: AbortSignal): Promise<any | null> {
    const topic = typeof manualTopic === 'string' ? manualTopic.trim().slice(0, 60) : ''
    if (topic) {
      return { kind: 'manual', subject, summary: '主人提起：' + topic, hint: '', sources: [] }
    }
    if (ensurePreferences().sideStorySeedSource !== 'activity') {
      const fromWeb = await sideStoryWebSeed(subject, signal)
      if (fromWeb) return fromWeb
    }
    const local = sideStorySeed()
    return local ? { ...local, subject, sources: [] } : null
```

</details>

#### 缺口

- 未审核所有模型提供方、Web seam 和图片生成的数据流。
  **影响**：不能声称全插件离线或完全去敏。
  **进一步探讨**：隔离调试中区分活动分类、角色聊天与小剧场的实际请求字段。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 对话响应与选项状态何时保存，代价在哪里？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

角色聊天在模型不可用或没有回复时选一条本地回退语句。随后通过串行状态任务追加用户和角色内容，并在回复提交时保存。情绪判定与后续选项生成另行执行，最后再写工作区。用户可能已经看到回复，而后续选项仍未生成，界面进度应分开理解。模型生成、情绪判定与选项可能各增加请求；同时要计入配置角色、维护素材和阅读回应的人工时间。源码没有给出实际交互延迟、资源使用或长期体验收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:5050-5083](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/index.ts#L5050-L5083)

模型失败回退及分开的持久状态。

<details>
<summary>查看原文（34行）</summary>

```text
              : 'no model available'
          }
          if (!reply) {
            reply = fallbackReplyFor(prepared.charId, prepared.profile.address)
            usedFallback = true
          }
          const emotionPromise = usedFallback
            ? Promise.resolve(emotionFromText(reply))
            : classifyEmotion(reply, signal)
          pendingChoiceCharId = prepared.charId
          choiceGenerationPending.add(pendingChoiceCharId)
          const committed = await runSerializedStateTask(async () => {
            ensureState()
            const settledBeforeChat = settle()
            const c = s.characters[prepared.charId]
            if (!c) throw new Error('chat character became unavailable before commit')
            c.log.push({ role: 'user', text })
            c.chatLines.push({
              who: 'user',
              text,
              at: Date.now(),
              choiceId: prepared.selectedChoice ? prepared.selectedChoice.id : null,
            })
            c.choices = []
            s.chatModelLabel = sel && sel.model ? String(sel.model) : ''
            s.lastModel = s.chatModelLabel
            s.fallbackUsed = usedFallback
            s.fallbackReason = fallbackReason
            if (prepared.pendingActivity && !usedFallback) {
              c.activity = rememberActivity(c.activity, prepared.pendingActivity)
            }
            c.log.push({ role: 'assistant', text: reply })
            if (c.log.length > 24) c.log = c.log.slice(-24)
            c.chatLines.push({ who: 'heroine', text: reply, emotion: 'normal', at: Date.now() })
```

</details>

**依据 2 · 源码核查**：[src/index.ts:5090-5115](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/index.ts#L5090-L5115)

先保存回复，再并行情绪和选项，最后保存选项。

<details>
<summary>查看原文（26行）</summary>

```text
            const leveled = checkLevelUp(prepared.charId, c)
            await save(settledBeforeChat.changed || c.affection !== before || leveled ? 'both' : 'workspace')
            return { leveled, replyIndex }
          })
          // The reply is already visible to polling clients. Classification overlaps
          // choice generation and never holds the state lock while a model is running.
          const [emotion, choices] = await Promise.all([
            emotionPromise,
            committed.leveled ? Promise.resolve(null) : generateChoices(prepared.promptCharacter, text, reply, signal),
          ])
          return await runSerializedStateTask(async () => {
            const c = s.characters[prepared.charId]
            if (!c) throw new Error('chat character became unavailable before choice commit')
            const heroineLine = c.chatLines[committed.replyIndex]
            if (heroineLine?.who === 'heroine' && heroineLine.text === reply) heroineLine.emotion = emotion
            // Clear the pending flag first: ensureReplyChoices refuses while it is set.
            choiceGenerationPending.delete(prepared.charId)
            pendingChoiceCharId = ''
            if (committed.leveled) ensureReplyChoices(prepared.charId, c)
            else c.choices = choices
            await save('workspace')
            return view()
          })
        } finally {
          if (pendingChoiceCharId) choiceGenerationPending.delete(pendingChoiceCharId)
          clearTimeout(timer)
```

</details>

#### 缺口

- 未执行模型超时、存档失败或两窗口交互。
  **影响**：无法估算游戏流畅度与状态恢复。
  **进一步探讨**：用受控模型模拟超时，比较已存回复、待选项和重开后的状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并验证显式活动提示？

**研究主题**：采用判断、新假设与验证

#### 完整回答

愿意将角色聊天与真实项目分开的人可以用一次非敏感角色对话试用，确认当前角色、措辞和保存状态。若它虚构看过文件、在不希望的时机提及活动或持续增加模型等待，应关闭插件对话并回原 DSH。待验证设计是先显示可检查的活动类别或允许本轮跳过，再交模型自由表达。给相同测试任务比较现有自动带入与显式类别提示，记录错误归因和用户补说明次数。若确认步骤造成明显打断且未减少误判，保留现有离线活动范围或关闭相关提示。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:4985-4998](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/index.ts#L4985-L4998)

会话准备阶段选取本工作区活动及对话记录。

<details>
<summary>查看原文（14行）</summary>

```text
            const scopedActivity = workspaceActivityCandidates(now)
            const pendingActivity = nextUnseenActivity(scopedActivity, character.activity, now)
            const selectedChoice = args && typeof args.choiceId === 'string'
              ? character.choices.find((choice: any) => choice && typeof choice === 'object' && choice.id === args.choiceId)
              : null
            return {
              disabled: false,
              charId,
              profile,
              pendingActivity,
              system: systemPrompt(profile, character, pendingActivity, scopedActivity[0] || null, now),
              selectedChoice: selectedChoice ? { ...selectedChoice } : null,
              promptCharacter: { level: character.level, affection: character.affection },
              log: character.log.slice(-12).map((entry: any) => ({ ...entry })),
```

</details>

**依据 2 · 源码核查**：[src/activity-context.ts:386-409](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/activity-context.ts#L386-L409)

自动带入的现有提示。

<details>
<summary>查看原文（24行）</summary>

```text
export function activitySystemInstruction(activity: HarnessActivity): string {
  const status = activity.status === 'completed'
    ? '这项工作最近已经告一段落'
    : activity.status === 'blocked'
      ? '这项工作最近遇到了一点阻碍'
      : activity.status === 'paused'
        ? '这项工作最近暂停了'
        : '这项工作最近仍在进行'
  return '\nHarness 近期任务事件：类别是「' + activity.label + '」，' + status + '。'
    + activity.chatHint
    + ' 本轮必须自然带到一次，但只占一句话的一小部分；先接住主人当前情绪，不要给工作方案。'
    + ' 不要声称看过具体文件、代码或对话，不要提及路径、文件名、密钥、工具调用或内部过程。'
}

export function activityBackgroundInstruction(activity: HarnessActivity | null): string {
  const capability = '你能隐约感知对方最近三天用 DSH 做了什么类型的事，比如写代码、写文档，但看不到具体文件和内容。'
  const status = activity?.status === 'completed' ? '已告一段落'
    : activity?.status === 'blocked' ? '遇到阻碍'
      : activity?.status === 'paused' ? '已暂停' : '仍在进行'
  const knowledge = activity
    ? '背景知识：你知道对方最近在忙：「' + activity.label + '」（' + status + '）。只有被问到或很自然时才提。'
    : '最近三天你没有感知到任何活动；被问到时，如实说最近没看到对方在忙什么，不要否认自己有这个能力，也不要编造对方做了什么。'
  return capability + '\n' + knowledge
    + '\n不要声称看过具体文件、代码或对话，不要提及路径、文件名、密钥、工具调用或内部过程。'
```

</details>

**依据 3 · 源码核查**：[src/index.ts:4954-4958](https://github.com/JAdpp/dsh-whale-galgame/blob/aa6ee3df79f8707131eefcdf17acef37cfd5bc4f/src/index.ts#L4954-L4958)

关闭设置时 chat 返回原视图。

```text
      case 'chat': {
        const text = args && args.text ? String(args.text).trim().slice(0, 500) : ''
        if (!text) return view()
        if (ensurePreferences().enabled === false) return view()
        const runtime = splitStorageActive() ? currentWorkspaceRuntime() : null
```

#### 缺口

- 显式活动提示未实现或验证。
  **影响**：对错归因和打断的影响未知。
  **进一步探讨**：比较有无提示在同一套虚构会话中的结果。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
