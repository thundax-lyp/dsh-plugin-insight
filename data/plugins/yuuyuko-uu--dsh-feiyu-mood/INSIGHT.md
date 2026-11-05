# dsh-feiyu-mood

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[02fddca](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/tree/02fddcaae0763651ecd65af5f644fe61f19de4bd)

<!-- BEGIN META -->
[![GitHub ★ 243](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=243&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-feiyu-mood) [![npm 30d 13,033](https://img.shields.io/static/v1?label=npm+30d&message=13%2C033&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feiyu-mood) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feiyu-mood)
<!-- END META -->

> **功能**：依据对话回合生成角色心情与情绪时间线，并按设置向后续上下文提供状态。

> **亮点**：把轮次来源识别、模型判断、份级状态和限额上下文串联起来，为角色聊天提供可见时间线与可控状态提示。[Q01](#research-q01)、[Q02](#research-q02)

> **主要限制**：模型自报confidence不等于校准可信度，取上下文时记账也不等于已被宿主消费；持久化失败和串行调用等待仍可能影响连续性。[Q03](#research-q03)

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
  - [Q01 · 心情数值为谁服务，是什么性质的结果？](#detail-section-11)
  - [Q02 · 轮次事件怎样成为持久心情与下一轮上下文？](#detail-section-12)
  - [Q03 · 判断和持久化的主要反证是什么？](#detail-section-13)
  - [Q04 · 绑定、调用与更新有什么成本和副作用？](#detail-section-14)
  - [Q05 · 什么条件值得观察，怎样检验连续性机制？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望角色聊天有可见状态的DSH用户，可查看按会话或工作区归属的模拟心情。

参照手工角色状态笔记和提示词，本组件自动判断并记录，但不证明真实情感或更好聊天效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 回合心情判断 | 为角色状态生成delta和理由 | 额外模型调用，非真实情绪测量 |
| 多份状态与时间线 | 按绑定共享或隔离记录 | 同份多会话共享，需正确归属 |
| 限额上下文提示 | 让后续回复看到模拟状态 | 取文记账不等于消费回执 |
| 挂饰和设置 | 查看数值、时间线及规则 | webServer与客户端可用 |
| 检查与安装更新 | 查询版本并调用宿主管理接口 | POST安装有副作用，开发副本拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22、DSH>=0.2.1-rc.2与web客户端 | 必需 | 包与界面加载 | README旧门槛不能替代包要求 |
| agents、systemPrompt、llm、timer | 判断与注入必需 | 监听轮次、调用模型、挂上下文 | 不产生预期状态或注入 |
| webServer与宿主信任服务 | 管理条件 | 设置及状态API | connection不可用时本入口放行 |
| 正确绑定份和会话/工作区 | 必需 | 决定共享状态归属 | 默认未绑定，不自动生效 |
| 模型账号与预算 | 自动判断条件 | 每个合格回合额外判断 | 失败无delta，费用未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份配置与状态，绑定独立会话 | 份和会话对应正确 |
| 观察 | 用户关闭注入，运行普通对话 | 时间线归属、理由和调用可解释 |
| 评估 | 用户比较是否开启条件注入 | 核对额度与实际上下文 |
| 恢复 | 用户关闭autoJudge与注入并停用 | 新判断停止；保留旧历史边界 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地状态与包资源未测 | 绑定份、模型和注入规则 | README版本门槛较旧 |
| 持续 | 每轮额外模型调用，实际金额未知 | 核对理由、归属与额度 | maxTokens1000不是实际费用 |
| 失败恢复 | 失败判断、重试和存储资源未知 | 关判断/注入、备份与核对消费 | 写盘失败可静默，串行判断可能等待 |
| 退出 | 保留状态及既有历史 | 停用，手工维护角色状态 | 已入历史的文本不自动移除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模拟状态与时间线 | 模型delta、公式衰减及本地保存已接线 | 判断校准和持久化可靠性 |
| 限额上下文提示 | 显著性、confidence及日额度过滤 | 最终消费和聊天体验净收益 |
| 可见心情 | 挂饰状态路由与脚本已连接 | 实际宿主界面和长期效果 |

> **思考**：模型自报confidence不等于校准可信度，取上下文时记账也不等于已被宿主消费；持久化失败和串行调用等待仍可能影响连续性。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把轮次来源识别、模型判断、份级状态和限额上下文串联起来，为角色聊天提供可见时间线与可控状态提示。[Q01](#research-q01)、[Q02](#research-q02)

[Q02](#research-q02) 用归属版本与reset版本丢弃过期结果值得借鉴；[Q03](#research-q03) 取文时记账和静默落盘失败还不能组成消费事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

模型自报confidence不等于校准可信度，取上下文时记账也不等于已被宿主消费；持久化失败和串行调用等待仍可能影响连续性。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察独立会话且关闭注入，核对模型费用和份归属；重要连续性缺口未解决前不引入重要聊天。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持模拟心情与条件注入；真实体验、费用与校准未知，状态回执方向是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/selfupdate.mjs、assets/widget.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定Host判断、归属、存储与注入，widget状态轮询和selfupdate；没有运行模型、插件或宿主。
- 下一步：固定对话、模型与预算对照关闭/开启，注入失败、改绑和写盘故障分别记录消费及费用；不把模拟数字当真实心理状态。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-feiyu-mood](https://github.com/Yuuyuko-uu/dsh-feiyu-mood)
- **版本号**：0.9.0（[固定提交 02fddca](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/tree/02fddcaae0763651ecd65af5f644fe61f19de4bd)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索拟议变化到宿主消费回执的分阶段状态，以及可观测写盘和有界判断；须用中断、改绑和写盘失败检验，尚未实现。[Q05](#research-q05)

固定对话、模型与预算对照关闭/开启，注入失败、改绑和写盘故障分别记录消费及费用；不把模拟数字当真实心理状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 3181 | 2509 | 578 | — |
| .md | source | 2 | 957 | — | — | 15955 |
| .mjs | source | 1 | 244 | 200 | 34 | — |
| .mjs | test | 7 | 632 | 544 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：模拟心情能否保持正确会话归属与可控注入，额外模型判断和状态记账的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 心情数值为谁服务，是什么性质的结果？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向希望角色聊天有可见状态连续性的DSH个人用户，将对话后的模型判断转成心情值、七类情绪和理由，并在挂饰显示。合格结果是绑定会话的事件更新到正确状态、可查看和控制后续注入，而不是证明AI有真实感受。相对用户手工维护角色状态，它集中自动判断、时间衰减、时间线与提示上下文；模型情绪判断和角色提示本身仍是外部模型能力。作者“像活人”和低费用描述没有同条件对照，不能直接转成客观体验或心理状态结论。工作任务用户未必需要此额外状态。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-37](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/README.md#L1-L37)

作者说明角色状态、调用和注入。

<details>
<summary>查看原文（37行）</summary>

````text
# dsh-feiyu-mood ｜ 鱼的心情

> 给 AI 伙伴一个**会自己判断、你看得见**的心情。
>
> 不是关键词硬猜，也不是随机数 —— 每轮聊完，用 DSH 自己的模型判一次"这一轮它的心情往哪走"，
> 会起伏、也会自己慢慢回稳，像活人。右下角挂着一个小挂饰，点开就能看见它此刻什么心情。

> **先看三行**
> - 需要 **DSH ≥ `0.1.7-rc.1`**；版本不满足会被内核**静默跳过**（装了跟没装一样，不报错）
> - 每轮判断 = **一次很短的模型调用**（一天几十轮也就几分钱）；嫌贵可以在设置里关掉
> - 装完**必须重启一次** DSH（插件在 bundle 层组装）

---

## 一、它是怎么"有心情"的

```
你说一句话
   ↓
它回完这一轮（turn-stopping）
   ↓
插件把「你说的 + 它回的」拿去问模型：这一轮它心情往哪走？
   ↓
模型回来四个东西：心情涨跌(moodDelta) + 七根情绪各涨多少 + 一句理由 + 这次判断有多确定(confidence)
   ↓
心情值改动、记进时间线；**同一次变化只说一次**，把「刚才心里那一下」带给它
```

**关键点：说心情走的是 `systemPrompt.context`**（系统提示里单独一段），
不是改系统提示本身 —— 所以**不会破坏 DSH 的前缀缓存**，聊得再久也不会因此多花钱。

**设置页能直接看到那句话**：打开「鱼的心情」，「它会听到的那句话」那一块会告诉你现在是它会不会听到、
听到的是哪一句（预览 / 实际说出去的原文 + 时间）。

**一次变化只说一次**：这句话进了对话就留在历史里，下一轮它照样看得见，
重复说一遍只会变成背景音、把它的口气定死。另外判断没底的（`confidence` 低于门槛）
**只记进后台，不进它的嘴** —— 宁可不说，也别让一句猜的话借它的嘴出去。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:1403-1426](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L1403-L1426)

将模型delta转成模拟状态与时间线。

<details>
<summary>查看原文（24行）</summary>

```text
function applyDelta(s, delta, floor, minor) {
  // ⭐ 大心情值（mood）是“基调”，要慢：每轮只吃判定值的三分之一，几轮对话才累积挪一格
  //    （七根情绪才该即时地每轮动）。timeline 里 delta 记的是实际 mood 变化，跟显示对得上。
  //
  // ⭐ 0.8.5：两头**饱和**。
  //    起因：实测 872 条判定里正 577 / 负 86（幅度合计 +614 / −91），比例 6.7:1 ——
  //    判定长期偏正，心情贴着顶走，贴顶之后"怎么说都开心"，反而更平。
  //    只压判定词表（规则 1/2）还不够：越靠近顶，同一条好事越不该继续加分。
  //    所以 ≥85 时正的减半、≤40 时负的减半 —— 两头对称，不引入新的偏。
  const 在顶 = s.mood >= 85 && delta.moodDelta > 0
  const 在底 = s.mood <= 40 && delta.moodDelta < 0
  const 因子 = (在顶 || 在底) ? 0.5 : 1
  const moodStep = Math.round((delta.moodDelta * 因子) / MOOD_STEP_DIVISOR)
  s.mood = clamp(s.mood + moodStep, floor, 100)
  for (const [k] of DIMS) s.dims[k] = clamp(s.dims[k] + delta.dims[k], 0, 100)
  s.lastReason = delta.reason
  s.lastConfidence = delta.confidence
  s.minor = Boolean(minor)
  s.kind = ''
  s.lastNotedMood = s.mood
  s.updatedAt = Date.now()
  s.lastDecayAt = Date.now() // 刚变过，衰减计时归零
  s.timeline.push({ at: Date.now(), mood: Math.round(s.mood), delta: moodStep, reason: delta.reason, conf: delta.confidence, dims: displayDims(s), dimsDelta: { ...delta.dims } })
  return s
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 轮次事件怎样成为持久心情与下一轮上下文？

**研究主题**：功能与机制

#### 完整回答

每份心情可绑定多个会话，共享稳定份id状态；轮次停止时区分用户聊天、主动搭话与定时干活来源，用本轮用户与助手文本调用指定或当前模型。所有判断经单一Promise链串行，提交前复核归属版本和重置版本，避免改绑后旧结果落到新份。解析JSON后限制数值，心情步长除三并在两端减半，情绪分量直接夹取；写入state.json。context提供者再按模式、已注入标记、显著性、置信门槛和日额度过滤，返回文字前先保存处理标记。由此可见有意抑制重复，但“只说一次”是本地取文记账，并非宿主已消费或最终模型采用的事务收据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1326-1387](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L1326-L1387)

实际模型调用、输入截断及预算。

<details>
<summary>查看原文（62行）</summary>

```text
async function judge(ctx, agent, userText, reply, mode, o) {
  // ⭐ 判断用哪个模型：设置里选了就用选的；没选就跟着当前会话的模型走
  const picked = (o.judgeProvider && o.judgeModel) ? { provider: o.judgeProvider, model: o.judgeModel } : null
  const t = picked || 取模型(agent)
  if (!t) { diag('拿不到模型，跳过判断'); return null }
  let sys = 判断系统(o)
  let user
  if (mode === 'work') {
    sys += 干活轮补充(o)
    // ⭐ 主人说的话摆最前面、闹钟塞到最后一行括号里 —— 顺序就是权重，别让模型拿闹钟当理由
    user = '⚠️ 这一轮**不是' + o.owner + '在跟你说话**，是定时任务把你叫起来干活的。\n\n'
      + '**你这轮说的话（唯一判据，重点看这个）：**\n' + reply.slice(0, 1200)
      + '\n\n（下面这条只是闹钟，跟心情无关，别拿它当理由：「' + userText.slice(0, 100) + '」）'
      + '\n\n请判断**你自己这轮的心情变化**，只输出 JSON。'
  } else if (mode === 'talk') {
    sys += 搭话轮补充(o)
    user = '⚠️ 这一轮**不是' + o.owner + '在跟你说话，是你自己主动去找' + o.owner + '搭话的**。\n\n'
      + '**你开口说的话（唯一判据，重点看这个）：**\n' + reply.slice(0, 1200)
      + '\n\n（下面这条只是叫你开口的闹钟，跟心情无关，别拿它当理由：「' + userText.slice(0, 100) + '」）'
      + '\n\n请判断**你自己这轮的心情变化**，只输出 JSON。'
  } else {
    // ⭐ 两句话都摆，而且**按真实先后**：对方先说，它后回。
    //    以前回复放在前、对方的话放在后，判官按读到的顺序理解因果，
    //    reason 就写成「人家刚说…，它就软软地回了一句…」这种主宾颠倒（还会跨过门槛被注入回对话）。
    user = '**' + o.owner + '这轮说：**\n' + userText.slice(0, 1600)
      + '\n\n**你回的是（判据之一，重点看语气：是念叨、心疼、凶' + o.owner + '、还是撒娇）：**\n'
      + reply.slice(0, 1500)
      + '\n\n请按这个先后，把「' + o.owner + '说了什么」和「你怎么回应的」合起来判断你的心情变化，只输出 JSON。'
  }
  // 自己构造一条 user 消息（不 import @deepseek-ai/dsh-llm，见头注释）
  const messages = [{
    role: 'user',
    id: randomUUID(),
    content: [{ type: 'text', text: user }],
    source: { kind: 'plugin', plugin: 'dsh-feiyu-mood' },
  }]
  let out = ''
  const kinds = {}
  try {
    // ⭐ 0.7.9：**带上 sessionId** —— 有的中转（比如 opencodego）要求请求里带会话标识，
    //   不带就一律 `400 MissingSessionID`（心情就静默不判了）。以前没带，是因为确实有些
    //   中转不需要它；带上对不需要的那几家没有影响。
    let 会话号 = ''
    try {
      会话号 = String((agent && agent.session && agent.session.id) || o.会话号 || '')
    } catch { 会话号 = '' }
    for await (const chunk of ctx.llm.stream({
      provider: t.provider,
      model: t.model,
      system: sys,
      messages,
      ...(会话号 ? { sessionId: 会话号 } : {}),
      // ⭐ 400 太小：reason 是中文口语，规则第 7 条还要求"每条都不一样、有画面"，
      //    一长就被切在 JSON 中间 ⇒ 整轮白判（2026-10-21 统计到 19 次失败，7 次是被切掉的）。
      //    调大**不花钱**：maxTokens 只是上限，按实际吐出来的算。
      maxTokens: 1000,
      temperature: 0.2,
    })) {
      if (!chunk) continue
      kinds[chunk.type] = (kinds[chunk.type] || 0) + 1
      if (chunk.type === 'text-delta') out += chunk.text
      if (chunk.type === 'finish' && chunk.reason && chunk.reason.kind === 'error') { diag('判断 finish error：' + (chunk.reason.failure?.message || JSON.stringify(chunk.reason))); return null }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1541-1592](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L1541-L1592)

来源、串行与版本检查后保存。

<details>
<summary>查看原文（52行）</summary>

```text
        const info = lastUserTurnOf(agent.session, 对方) || (lastText ? 缓存这条() : null)
        if (!info || !info.text) {
          diag('turn-stopping 进了，但没拿到用户那句话（info=' + !!info + '，缓存=' + (lastText ? lastText.length + '字' : '空') + '）')
          return
        }
        const reply = lastAssistantTextOf(agent.session)
        // ⭐ 三种口径：干活（bili-duty-scan）/ 自己搭话（speak-up）/ 她本人在说话
        const kind = String(info.sourceKind || '')
        const mode = kind === 'bili-duty-scan' ? 'work' : (自主搭话.has(kind) ? 'talk' : '')
        const 称呼 = { self: 本人名(), owner: 对方名(), me: cfg.selfPronoun || '我', aliases: cfg.selfAliases, judgeProvider: cfg.judgeProvider, judgeModel: cfg.judgeModel }
        const key = slot.id // 属于发起判断的份，绝不在 await 后重新挑一个目标
        const version = judgeVersion
        const resetVersion = resetVersions.get(key)
        const valid = () => stillBound() && version === judgeVersion && resetVersion === resetVersions.get(key)
        judgeChain = judgeChain.then(async () => {
          if (!valid()) return // 排队期间已失效的任务不再调用模型
          const delta = await judge(ctx, agent, info.text, reply, mode, 称呼)
          if (!delta || !valid()) return
          const s = getState(key, cfg.moodBase, { persist: false, halfHours: cfg.decayHalfHours })
          // ⭐ 一点变化都没有的回合不记账：完整记录里只该留下真有过心情波动的
          const step = Math.round(delta.moodDelta / MOOD_STEP_DIVISOR)
          const anyDim = DIMS.some(([k]) => delta.dims[k] !== 0)
          // ⭐ 2026-10-23（issue #1 的可观测性问题）：以前这两种情况共用一句话，
          //    线上根本分不出「模型没判出来」和「这轮真的没变化」——排查时被那条日志误导了很久。
          if (step === 0 && !anyDim) {
            const 没判出来 = Number(delta.confidence) === 0 && !String(delta.reason || '').trim()
            diag((没判出来 ? '这轮没判出来（模型没给结论：confidence=0、没有 reason）' : '这轮判定无变化，不记入时间线')
              + (mode ? '（' + (mode === 'talk' ? '自己搭话' : '定时任务') + '）' : ''))
            return
          }
          // ⭐ 什么才算"显著"：心情涨跌够数，或者某一根情绪涨跌够数。
          //   以前任何一个维度动了就算，所以一天能记四十条 —— 那才是"被污染"的来源。
          const 显著 = Math.abs(delta.moodDelta) >= cfg.sigMood
            || DIMS.some(([k]) => Math.abs(delta.dims[k] || 0) >= cfg.sigDim)
          applyDelta(s, delta, cfg.moodFloor, !显著)
          // ⭐ 2026-11-04（反馈：心情在涨，但她读不到）：
          //   门槛原来是**逐条**比 —— 每轮 +1 永远跨不过 3，于是连着五轮涨了 5 点，
          //   一次都没注入（数字在动，行为不动）。
          //   现在加一路**累计**：没够格的小波动把幅度攒起来，攒够 sigMood 就抬成该告诉她。
          //   攒的量只在**真正注入时**清零，所以既不会漏掉长期小变化，也不至于抖一下就刷屏（日上限照旧兜底）。
          if (!显著) {
            s.sinceInject = Number(s.sinceInject || 0) + Math.abs(Number(delta.moodDelta) || 0)
            if (s.sinceInject >= cfg.sigMood) {
              s.minor = false
              diag('小波动累计到 ' + s.sinceInject.toFixed(1) + '（门槛 ' + cfg.sigMood + '），这次告诉她')
            }
          }
          saveState(key, s)
          diag((显著 ? '心情更新' : '小波动（只记账，不告诉她）')
            + '：mood=' + s.mood + '，' + (delta.reason || '（无理由）')
            + (mode ? '（' + (mode === 'talk' ? '自己搭话' : '定时任务') + '）' : ''))
        }).catch((e) => { diag('判断失败：' + (e && e.message)) })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1601-1640](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L1601-L1640)

过滤、额度与取文时标记。

<details>
<summary>查看原文（40行）</summary>

```text
      offs.push(agent.ctx.systemPrompt.context({
        name: 'feiyu-mood',
        order: 900,
        text: () => {
          try {
            const mode = cfg.injectMode
            if (!mode || mode === 'off') return ''
            const s = getState(当前键(), cfg.moodBase, { persist: false, halfHours: cfg.decayHalfHours })
            if (s.injectedFor === s.updatedAt) return ''
            if (s.minor) return ''   // 小波动只记账，不打扰她
            // 判得没底 → 只记账，不进她的嘴。
            // 同时把这次变化标成"处理过了"，免得每轮都重复记一条日志
            if (Number(s.lastConfidence) < cfg.injectConfidence) {
              diag('可信度 ' + s.lastConfidence + ' 低于门槛 ' + cfg.injectConfidence + '，这次不告诉她')
              s.injectedFor = s.updatedAt
              saveState(当前键(), s)
              return ''
            }
            // ⭐ 日上限：门槛调低之后靠它防"变背景音"（先到先得，当天的额度用完就不再提）
            const 今天0点 = new Date()
            今天0点.setHours(0, 0, 0, 0)
            const 今天说过 = (s.saidAt || []).filter((t) => Number(t) >= 今天0点.getTime()).length
            const 上限 = Math.max(0, Number(cfg.injectPerDay ?? 6))
            if (今天说过 >= 上限) {
              diag('今天的额度用完了（' + 今天说过 + '/' + 上限 + '），这次只记账、不告诉她')
              s.injectedFor = s.updatedAt     // 标成处理过，别每轮重复记日志
              saveState(当前键(), s)
              return ''
            }
            const line = moodLine(s, mode, undefined, 对方名())
            if (!line) return ''
            s.injectedFor = s.updatedAt
            s.sinceInject = 0                   // 说过了，累计清零
            s.lastInjectedText = line          // 存原文：设置页照这个显示
            s.lastInjectedAt = Date.now()
            s.saidAt = [...(s.saidAt || []), Date.now()].slice(-200)   // 记账：今天多了一次
            saveState(当前键(), s)
            diag('告诉她心情（' + mode + '）：' + line.replace(/\n/g, ' ').slice(0, 100))
            return line
          } catch (e) { diag('注入失败：' + (e && e.message)); return '' }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 判断和持久化的主要反证是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

confidence是模型自行给出的数，缺失时默认70，不是统计校准的正确率；低可信判断仍可进状态，门槛只阻止注入。自然衰减是公式而非新证据，却赋值confidence=100，因此数字不能理解成真实情绪确信度。写状态异常被吞，界面或日志可能表现为处理过但磁盘并未保存；同时context在真正消费前记账，失败轮次可能不再补注入。判断stream没有在该调用处传本地超时/取消，单一串行链若等待不结束会推迟后续判断；上游可能有超时，但此范围不能证明。可借鉴的是归属版本校验和过期结果丢弃，而不能泛化成完整事务或无损恢复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1268-1294](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L1268-L1294)

confidence缺失默认70。

<details>
<summary>查看原文（27行）</summary>

```text
function parseDelta(text, owner) {
  const s = String(text || '').trim()
  if (!s) return null
  // 容错：模型可能包了 markdown 或前后有杂字，取第一个 { 到最后一个 }
  let obj = null
  const a = s.indexOf('{')
  const b = s.lastIndexOf('}')
  if (a >= 0 && b > a) {
    try { obj = JSON.parse(s.slice(a, b + 1)) } catch (e) { /* ignore */ }
  }
  if (!obj) {
    try { obj = JSON.parse(s) } catch (e) { /* ignore */ }
  }
  if (!obj || typeof obj !== 'object') return null
  const delta = {
    moodDelta: clamp(Math.round(Number(obj.moodDelta) || 0), -10, 10),
    dims: { happy: 0, calm: 0, sweet: 0, heartache: 0, worry: 0, sad: 0, jealous: 0 },
    reason: normReason(obj.reason, owner).slice(0, 120),
    // 模型没写这个字段时按 70 算（不因为漏一个字段就把注入整个关掉），但留个日志
    confidence: Number.isFinite(Number(obj.confidence))
      ? clamp(Math.round(Number(obj.confidence)), 0, 100)
      : 70,
  }
  if (!Number.isFinite(Number(obj.confidence))) diag('判断没给 confidence，按 70 算')
  if (obj.dims && typeof obj.dims === 'object') {
    for (const [k] of DIMS) delta.dims[k] = clamp(Math.round(Number(obj.dims[k]) || 0), -10, 10)
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:844-850](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L844-L850)

状态写入失败静默。

```text
function writeStore(store) {
  try {
    mkdirSync(STORE_DIR, { recursive: true })
    const tmp = STATE_PATH + '.tmp'
    writeFileSync(tmp, JSON.stringify({ version: STATE_VERSION, moods: store.moods, lastActive: store.lastActive || '' }, null, 2), 'utf8')
    renameSync(tmp, STATE_PATH)
  } catch (e) { /* 持久化失败不拖垮对话 */ }
```

**依据 3 · 源码核查**：[lib/index.js:873-906](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L873-L906)

公式衰减赋confidence100。

<details>
<summary>查看原文（34行）</summary>

```text
function noteDecay(s, base) {
  const 往回落 = s.mood < s.lastNotedMood
  s.lastReason = 往回落
    ? '过了几个钟头，刚才那点劲儿慢慢淡了，心里回到平常的样子'
    : '过了几个钟头，心里那点别扭自己散了，人也松快回来'
  // 这是本地算出来的，不是模型猜的 —— 可信度给满，一定会说出来
  s.lastConfidence = 100
  s.updatedAt = Date.now()
  s.lastNotedMood = s.mood
  s.minor = false
  s.kind = 'decay'
  s.timeline.push({
    at: Date.now(), mood: Math.round(s.mood), delta: 0, conf: 100, kind: 'decay',
    reason: s.lastReason, dims: displayDims(s), dimsDelta: {},
  })
  diag('自然平复：mood=' + s.mood + '（' + s.lastReason + '）')
}

function decay(s, base, now, halfHours) {
  const ageMin = Math.max(0, now - s.lastDecayAt) / MIN
  if (ageMin < 1) return s // 不足 1 分钟不算衰减
  const 半衰 = clamp(Number(halfHours) || 12, 1, 168) * 60
  // 心情向 base 回落
  const km = 1 - Math.exp(-(Math.LN2 * ageMin) / 半衰)
  s.mood = s.mood + (base - s.mood) * km
  // 情绪向 0 衰减，半衰期 90 分钟（单根情绪比总心情散得快）
  const ke = 1 - Math.exp(-(Math.LN2 * ageMin) / 90)
  for (const [k] of DIMS) {
    s.dims[k] = Math.max(0, s.dims[k] * (1 - ke))
  }
  s.lastDecayAt = now
  // 跟"上次记过的那条"比，走了 3 格以上就记一条 ——
  // ⚠ 不能跟上一次调用比：面板每 20 秒轮询一次，单次只挪 0.x 格，永远攒不够
  if (Math.abs(s.mood - s.lastNotedMood) >= 3) noteDecay(s, base)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1372-1391](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L1372-L1391)

stream调用没有本地取消参数。

<details>
<summary>查看原文（20行）</summary>

```text
    for await (const chunk of ctx.llm.stream({
      provider: t.provider,
      model: t.model,
      system: sys,
      messages,
      ...(会话号 ? { sessionId: 会话号 } : {}),
      // ⭐ 400 太小：reason 是中文口语，规则第 7 条还要求"每条都不一样、有画面"，
      //    一长就被切在 JSON 中间 ⇒ 整轮白判（2026-10-21 统计到 19 次失败，7 次是被切掉的）。
      //    调大**不花钱**：maxTokens 只是上限，按实际吐出来的算。
      maxTokens: 1000,
      temperature: 0.2,
    })) {
      if (!chunk) continue
      kinds[chunk.type] = (kinds[chunk.type] || 0) + 1
      if (chunk.type === 'text-delta') out += chunk.text
      if (chunk.type === 'finish' && chunk.reason && chunk.reason.kind === 'error') { diag('判断 finish error：' + (chunk.reason.failure?.message || JSON.stringify(chunk.reason))); return null }
    }
  } catch (e) {
    diag('判断调用失败：' + (e && e.message))
    return null
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1630-1639](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L1630-L1639)

取文前保存记账。

<details>
<summary>查看原文（10行）</summary>

```text
            const line = moodLine(s, mode, undefined, 对方名())
            if (!line) return ''
            s.injectedFor = s.updatedAt
            s.sinceInject = 0                   // 说过了，累计清零
            s.lastInjectedText = line          // 存原文：设置页照这个显示
            s.lastInjectedAt = Date.now()
            s.saidAt = [...(s.saidAt || []), Date.now()].slice(-200)   // 记账：今天多了一次
            saveState(当前键(), s)
            diag('告诉她心情（' + mode + '）：' + line.replace(/\n/g, ' ').slice(0, 100))
            return line
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 绑定、调用与更新有什么成本和副作用？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

package要求Node>=22、DSH>=0.2.1-rc.2，README较旧的0.1.7门槛不能覆盖该要求；需agents/systemPrompt/webServer/llm/timer及web客户端。默认不绑定会话，用户必须配置份和作用域；每个符合条件的回合额外调用一次判断模型，输入截断到约1200-1600字符，maxTokens1000只是上限，不是费用报价。模型费用、Token与体验提升都未知。管理路由仅明确401/403才拒，connection缺失或异常放行；需按实际宿主信任配置使用。README称“只检查更新”，当前selfupdate实际上提供POST install并调用pluginManager.installBundle，可能改变安装状态；link开发副本会拒绝。退出须关autoJudge和注入、停用并备份本地状态；已有注入历史不会因此消失。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:43-61](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/package.json#L43-L61)

平台和版本要求。

<details>
<summary>查看原文（19行）</summary>

```text
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-settings-plugins"
      ]
    }
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.1-rc.2"
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:163-195](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L163-L195)

默认无绑定及判断开关。

<details>
<summary>查看原文（33行）</summary>

```text
const DEFAULTS = {
  targetSession: DEFAULT_SESSION,
  // ⭐ 0.7.0：按什么认「这一份」——'session' 认会话（跟以前一样）/ 'workspace' 认工作区。
  //    两种模式**二选一**：同一时刻只按一种解析，免得一份心情被两套归属同时抢。
  模式: 'session',
  slots: [],   // ⭐ 多份心情：{ id, label, selfName, ownerName, 工作区, sessions: [...] } 的清单（空 = 只有 targetSession 那一份）
  // ⭐ 有心情的那一位叫什么。默认写中性的「伙伴」—— 别人家不叫大肥鱼。
  selfName: '伙伴',
  // ⭐ 默认叫「用户」。别人装完不填也不会串成别人的名字；
  //    想改成自己的称呼，设置页第一栏填上就行，提示词里会跟着变。
  ownerName: '用户',
  // ⭐ 它自己怎么自称（写进 reason 里的那个「我」）。默认「我」；
  //    跑角色设定重的模型、它平时说「本小姐」「在下」，就填进去。
  selfPronoun: '我',
  selfAliases: '',   // TA 平时怎么叫你（逗号分隔）：判断时这些词是「在叫你」，不是名词的一部分
  judgeProvider: '', // 判断心情用哪个 provider（留空 = 跟着当前会话的模型走）
  judgeModel: '',    // 判断心情用哪个 model（留空 = 跟着当前会话）
  moodBase: 70,
  moodFloor: 0,
  // ⭐ 心情自己平复的快慢（小时，半衰期）。12 小时 = 隔一夜还留着余温
  decayHalfHours: 12,
  // ⭐ 怎么把心情告诉她：off 不告诉 / label 只说心情 / event 说这会儿的底子 + 是什么事
  injectMode: 'event',
  // ⭐ 判断的可信度门槛（0-100）：低于它只记账、不进她的嘴
  injectConfidence: 60,
  // ⭐ 什么才算"显著变化"（够不着就只记账、不告诉她）
  // ⭐ 2026-10-21 实测校准：判定给的原始涨跌平时就 +1~+3（心情又只吃 1/3 ⇒ 常动 1 格），
  //    原来 6/25 只有 9% 的回合能过，等于基本不注入。改成 3/4。
  sigMood: 3,   // 心情涨跌够这个数（原始值；心情实际只吃 1/3）
  sigDim: 5,    // 或者某一根情绪涨跌够这个数（心疼+5、担心+5 这种"突然一下"才触发）
  // ⭐ 每天最多跟她说几次（先到先得）：门槛调低之后靠它防"变背景音"
  injectPerDay: 6,
  autoJudge: true,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1712-1725](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L1712-L1725)

管理路由信任检查边界。

<details>
<summary>查看原文（14行）</summary>

```text
  const 只认本人 = (handler) => async (req, res) => {
    try {
      const 连接 = ctx.get('connection')
      const 拒 = 连接 && typeof 连接.requestRejection === 'function' ? 连接.requestRejection(req) : undefined
      if (拒 === 401 || 拒 === 403) {
        diag('管理接口拒了一次外来请求（' + 拒 + '）：' + String((req && req.url) || ''))
        try {
          res.writeHead(拒, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          res.end(JSON.stringify({ ok: false, error: 拒 === 401 ? 'authentication_required' : 'management_forbidden' }))
        } catch (e2) {}
        return
      }
    } catch (error) {}
    return handler(req, res)
```

</details>

**依据 4 · 源码核查**：[lib/selfupdate.mjs:145-186](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/selfupdate.mjs#L145-L186)

同源推断和实际安装调用。

<details>
<summary>查看原文（42行）</summary>

```text
  // 这个插件是以什么身份装的？从 profile 的 package.json 里把它那行依赖原样取出来 ——
  // 用它当 spec 才是"同源更新"，不会把 github 装的换成 npm 版。
  function 取安装来源() {
    const HOME = process.env.DSH_HOME || join(homedir(), '.dsh')
    const name = String(meta.name || '')
    if (!name) return ''
    let profiles = []
    try { profiles = readdirSync(join(HOME, 'profiles')) } catch (e) { return '' }
    for (const p of profiles) {
      const f = join(HOME, 'profiles', p, 'package.json')
      if (!existsSync(f)) continue
      try {
        const j = JSON.parse(readFileSync(f, 'utf8'))
        const dep = String((j.dependencies && j.dependencies[name]) || '')
        if (/^(github:|git\+|https?:)/i.test(dep)) return dep
      } catch (e) { /* 读不了就下一个 */ }
    }
    // 兜底：从 package.json 的仓库地址拼
    const m = /github\.com[/:]([^/]+)\/([^/#?]+)/i.exec(repoUrl)
    if (m) return 'github:' + m[1] + '/' + m[2].replace(/\.git$/i, '')
    return ''
  }

  async function install(ctx) {
    if (是开发副本) {
      return { ok: false, error: '这是本地开发副本（link: 进来的），一键更新会把你正在改的目录换成仓库里的版本 —— 要更新请在仓库里 git pull' }
    }
    const pm = ctx && ctx.pluginManager
    if (!pm || typeof pm.installBundle !== 'function') {
      return { ok: false, error: '这版 DSH 没有插件管理接口，装不了；请手动更新' }
    }
    const spec = 取安装来源() || (meta.name ? String(meta.name) : '')
    if (!spec) return { ok: false, error: '不知道该从哪儿装（既没有仓库地址，也没记录安装来源）' }
    try {
      log('一键更新：开始装 ' + spec)
      const r = await pm.installBundle(spec)
      log('一键更新：' + JSON.stringify(r && (r.applied ?? r.application ?? r.reason ?? r)))
      return { ok: true, spec, result: r || null }
    } catch (e) {
      log('一键更新失败：' + String((e && e.message) || e))
      return { ok: false, spec, error: String((e && e.message) || e) }
    }
```

</details>

**依据 5 · 源码核查**：[lib/selfupdate.mjs:219-240](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/selfupdate.mjs#L219-L240)

POST安装路由。

<details>
<summary>查看原文（22行）</summary>

```text
            send(res, 200, { ok: false, current, latest: null, error: String((e && e.message) || e) })
          }
        }),
      }))
      // ⭐ 一键更新：POST。装完的结果原样带回去（可能要重启才生效）
      ctx.effect(() => ctx.webServer.register({
        kind: 'exact',
        path: route + '/install',
        handler: 只认本人(async (req, res) => {
          if (req.method !== 'POST') { send(res, 405, { ok: false, error: '只接受 POST' }); return }
          try {
            const r = await install(ctx)
            send(res, 200, r)
          } catch (e) {
            log('一键更新路由失败：' + (e && e.message))
            send(res, 200, { ok: false, error: String((e && e.message) || e) })
          }
        }),
      }))
    } catch (e) {
      log('查更新路由注册失败：' + (e && e.message))
    }
```

</details>

**依据 6 · 作者声明**：[README.md:39-49](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/README.md#L39-L49)

只检查声明与源码边界对照。

<details>
<summary>查看原文（11行）</summary>

```text
## 一、设置页左上角：「检查更新」

点一下就去本插件自己的仓库比版本：

| 看到 | 意思 |
|---|---|
| 已经是最新版 | 本机和仓库一样 |
| 仓库里已经有 vX.Y.Z 了 | 有新版，下面直接给更新命令（可复制） |
| 暂时查不到（原因） | **没连上**，不代表没问题 |

只检查，不装不删。查一次记 6 小时，点按钮会绕过缓存重新查。
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件值得观察，怎样检验连续性机制？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议先观察而非直接把它引入重要会话。愿意承担额外模型调用的角色聊天用户可先在独立会话、注入关闭状态检查来源归属和时间线，确认输出可解释后才评估是否打开注入。如果出现跨份串状态、额度被消耗而未消费、持久化失败或费用超预期，应关闭autoJudge与注入并停用，保留备份。可推导一个未实现方向，把“拟议心情变化”“已返回上下文”“已被宿主确认消费”分成状态与回执，再增加模型超时及可观测写盘失败。它增加协议与存储负担，必须用中断、重试、改绑和写盘失败的同任务对照验证；若漏注入/重复不减且负担增加，就否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1551-1559](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L1551-L1559)

已有过期判断校验是进一步回执方向的基础。

```text
        const key = slot.id // 属于发起判断的份，绝不在 await 后重新挑一个目标
        const version = judgeVersion
        const resetVersion = resetVersions.get(key)
        const valid = () => stillBound() && version === judgeVersion && resetVersion === resetVersions.get(key)
        judgeChain = judgeChain.then(async () => {
          if (!valid()) return // 排队期间已失效的任务不再调用模型
          const delta = await judge(ctx, agent, info.text, reply, mode, 称呼)
          if (!delta || !valid()) return
          const s = getState(key, cfg.moodBase, { persist: false, halfHours: cfg.decayHalfHours })
```

**依据 2 · 源码核查**：[lib/index.js:1601-1640](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/02fddcaae0763651ecd65af5f644fe61f19de4bd/lib/index.js#L1601-L1640)

取文记账边界支持消费回执假设。

<details>
<summary>查看原文（40行）</summary>

```text
      offs.push(agent.ctx.systemPrompt.context({
        name: 'feiyu-mood',
        order: 900,
        text: () => {
          try {
            const mode = cfg.injectMode
            if (!mode || mode === 'off') return ''
            const s = getState(当前键(), cfg.moodBase, { persist: false, halfHours: cfg.decayHalfHours })
            if (s.injectedFor === s.updatedAt) return ''
            if (s.minor) return ''   // 小波动只记账，不打扰她
            // 判得没底 → 只记账，不进她的嘴。
            // 同时把这次变化标成"处理过了"，免得每轮都重复记一条日志
            if (Number(s.lastConfidence) < cfg.injectConfidence) {
              diag('可信度 ' + s.lastConfidence + ' 低于门槛 ' + cfg.injectConfidence + '，这次不告诉她')
              s.injectedFor = s.updatedAt
              saveState(当前键(), s)
              return ''
            }
            // ⭐ 日上限：门槛调低之后靠它防"变背景音"（先到先得，当天的额度用完就不再提）
            const 今天0点 = new Date()
            今天0点.setHours(0, 0, 0, 0)
            const 今天说过 = (s.saidAt || []).filter((t) => Number(t) >= 今天0点.getTime()).length
            const 上限 = Math.max(0, Number(cfg.injectPerDay ?? 6))
            if (今天说过 >= 上限) {
              diag('今天的额度用完了（' + 今天说过 + '/' + 上限 + '），这次只记账、不告诉她')
              s.injectedFor = s.updatedAt     // 标成处理过，别每轮重复记日志
              saveState(当前键(), s)
              return ''
            }
            const line = moodLine(s, mode, undefined, 对方名())
            if (!line) return ''
            s.injectedFor = s.updatedAt
            s.sinceInject = 0                   // 说过了，累计清零
            s.lastInjectedText = line          // 存原文：设置页照这个显示
            s.lastInjectedAt = Date.now()
            s.saidAt = [...(s.saidAt || []), Date.now()].slice(-200)   // 记账：今天多了一次
            saveState(当前键(), s)
            diag('告诉她心情（' + mode + '）：' + line.replace(/\n/g, ' ').slice(0, 100))
            return line
          } catch (e) { diag('注入失败：' + (e && e.message)); return '' }
```

</details>

#### 缺口

- 没有对角色体验、判断校准、同任务费用与上下文缓存影响的独立对照。
  **影响**：不能证明心情机制提高聊天连续性，也不能沿用README不多花钱或几分钱的收益说法。
  **进一步探讨**：固定模型、对话与预算，对照关闭和开启状态，分别记录额外调用、重复/漏注入与用户偏好。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
