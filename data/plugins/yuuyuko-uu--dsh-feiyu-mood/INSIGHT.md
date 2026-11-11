# 鱼的心情

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1f38503](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/tree/1f38503653bdd59e5996903d98eb03905c5e59a2)

<!-- BEGIN META -->
[![GitHub ★ 258](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=258&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-feiyu-mood) [![npm 30d 18,542](https://img.shields.io/static/v1?label=npm+30d&message=18%2C542&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feiyu-mood) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feiyu-mood)
<!-- END META -->

> **功能**：为 DSH 伙伴按轮判断心情，通过挂饰显示数值、情绪与时间线，并可配置心情提示。

> **亮点**：同一份状态可由关联会话更新，并以衰减、显著性和日限额决定何时显示或进入上下文。这个组合把手工记心情变成可回看的自动状态链路，差异集中在交互流程与反馈节制。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：置信度由判断模型自报，用户和助理文本从事件快照独立向后取值，出现跨轮配对时高置信理由仍可回注。管理和安装请求还依赖宿主连接服务明确拒绝。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 心情层相对固定人设或手工记录增加什么？](#detail-section-11)
  - [Q02 · 轮次如何变成下一轮上下文，何处可能归因错误？](#detail-section-12)
  - [Q03 · 开启、运行、排障和退出由谁承担，管理接口有何限制？](#detail-section-13)
  - [Q04 · 采用条件是什么，如何检验累计幅度是否改善反馈？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长期使用同一 DSH 伙伴、希望随时查阅交互后心情起伏的用户，可通过挂饰查看变化并选择是否回注提示。

固定人设控制语气，手工标注记录重要回合。前者不维护独立随时间变化的状态，后者更便于确认归因，但需要人工持续维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 心情时间线 | 回看伙伴状态变化 | 绑定会话且判断产生有效变动 |
| 上下文提示 | 在后续轮次给模型传入心情状态 | 受变化阈值、置信度和日额度限制 |
| 配置与更新 | 调整判断及查看更新 | 管理拒绝由宿主连接服务提供 |

**流程与依赖**

| 依赖 | 用途 | 成立条件 |
| --- | --- | --- |
| DSH 与 Node | 加载 Cordis 补丁和 Web 设置 | 包声明 DSH ≥ 0.2.1-rc.2、Node ≥ 22；匹配实际宿主 API |
| 模型供应商 | 追加情绪判定 | 同意传送裁剪后的对话，单独核对供应商和费用 |
| 宿主连接服务 | 管理路由拒绝请求 | 应在目标宿主确认未认证和非管理员调用被拒绝 |

| 阶段 | 操作 | 异常处理 |
| --- | --- | --- |
| 首次 | 隔离 profile 内加载固定版本并重启，绑定一个测试会话 | 设置入口不出现时查包声明和宿主日志 |
| 持续 | 对照挂饰状态、时间线和实际提示，先使用非敏感对话 | 出现错配则关回注并检查来源，停止额外模型请求时关自动判断 |
| 退出 | 停自动判断并备份 DSH_HOME 中该插件的状态和设置 | 卸载后重启，分别验证路由与本地文件是否仍在 |

**效果与成本**

| 成本项 | 负担与单位 | 边界 |
| --- | --- | --- |
| 模型现金支出 | 每个符合条件的轮次追加一次流式请求，按实际 token 与供应商价格核算 | 未采样，不能沿用 README 的金额 |
| 人工时间 | 每个正确配对的心情事件需核对来源、时间线及错误日志 | 群聊归因或连接服务有问题时排查成本更高 |
| 退出 | 备份、移除插件与重启耗时未测 | 本地状态与诊断文件需独立处理 |

| 效果 | 观察口径 | 边界 |
| --- | --- | --- |
| 降低手工追踪负担 | 每个归因正确且可解释的时间线事件，用人工标注与自动流程比较 | 记录变化不能证明体验改善 |
| 减少重复提示 | 按轮统计重复回注、错配和漏报 | 与只看挂饰的基线作比较，缓存收益未知 |

> **思考**：置信度由判断模型自报，用户和助理文本从事件快照独立向后取值，出现跨轮配对时高置信理由仍可回注。管理和安装请求还依赖宿主连接服务明确拒绝。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：同一份状态可由关联会话更新，并以衰减、显著性和日限额决定何时显示或进入上下文。这个组合把手工记心情变成可回看的自动状态链路，差异集中在交互流程与反馈节制。[Q01](#research-q01) [Q02](#research-q02)

判断队列串行并在模型调用前后验证绑定版本，防止改绑后的旧结果覆盖新状态。相同进程内的保护不能外推到多个宿主共享状态目录；临时文件改名也不提供持久化失败回报。

<a id="detail-section-5"></a>

### 1.4 主要限制

置信度由判断模型自报，用户和助理文本从事件快照独立向后取值，出现跨轮配对时高置信理由仍可回注。管理和安装请求还依赖宿主连接服务明确拒绝。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先保留观察。[Q03](#research-q03) 的鉴权和更新路由核查通过后，可用隔离 profile 的单会话做无敏感内容的对照。先看挂饰，核对正确归因后再开回注。未能确认请求拒绝或出现错配时停用自动判断，改用原会话的手工记录。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持事件、状态和回注链路。真实宿主的事件顺序、访问控制、模型开销和交互收益有待核实；带方向累计是假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、package.json、cordis.patch.yml、lib/selfupdate.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖当前包的关键宿主入口、状态和更新链路；未运行目标插件，未验证真实 DSH 网关、模型效果、价格或兼容矩阵。
- 下一步：先在隔离宿主用一条被允许与一条被拒绝的配置请求核对管理鉴权，并拦截安装管理器以确认更新来源；再回放带人工标注的两类小波动序列，对比错误归因、重复回注与成功事件数。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-feiyu-mood](https://github.com/Yuuyuko-uu/dsh-feiyu-mood)
- **版本号**：0.9.2（[固定提交 1f38503](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/tree/1f38503653bdd59e5996903d98eb03905c5e59a2)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可尝试把绝对幅度累计替换为带方向累计，保留同向小变动召回，同时减少反复震荡越线。若误报不降，或对持续真实变化的漏报与误报改善相当，就撤回该设计。[Q04](#research-q04)

先在隔离宿主用一条被允许与一条被拒绝的配置请求核对管理鉴权，并拦截安装管理器以确认更新来源；再回放带人工标注的两类小波动序列，对比错误归因、重复回注与成功事件数。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 3243 | 2547 | 601 | — |
| .md | source | 2 | 979 | — | — | 16286 |
| .mjs | source | 1 | 244 | 200 | 34 | — |
| .mjs | test | 8 | 708 | 604 | 19 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=16&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：给长期 DSH 伙伴会话增加可见、可反馈的心情状态有什么价值，什么条件会使反馈失真或成本失衡？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 心情层相对固定人设或手工记录增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

长期使用同一 DSH 伙伴的人可以在同一个挂饰中看心情变化，必要时让后续回复带上一句状态提示。固定人设能规定语气，手工记录也能标记重要事件，但前者没有随轮次更新的独立状态，后者需要用户自己记。这里把心情放进可衰减的数值状态，以时间线和设置开关控制何时显示或回注。源码默认心情向 70 回归，整体心情默认半衰期 12 小时，情绪维度 90 分钟。README 的整体三小时说法与配置不一致。面板数值可用作观察输入，不能据此认定回复更贴切。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-37](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/README.md#L15-L37)

作者描述从对话到时间线和一次注入的用途。

<details>
<summary>查看原文（23行）</summary>

````text
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

**依据 2 · 源码核查**：[lib/index.js:182-199](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L182-L199)

默认值定义了可调心情回落时间和注入阈值。

<details>
<summary>查看原文（18行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/index.js:900-916](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L900-L916)

总心情和情绪维度使用不同衰减时间，累计偏差够大才记录衰减。

<details>
<summary>查看原文（17行）</summary>

```text
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
  return s
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2027-2037](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L2027-L2037)

网页首页注入挂饰脚本且检查重复。

<details>
<summary>查看原文（11行）</summary>

```text
  // 6) 往页面注入挂饰脚本（桌面端唯一通道）
  try {
    ctx.on('webserver/index-inject', (table) => {
      if (!Array.isArray(table)) return
      for (const row of table) {
        if (row && ((row.kind === 'script-src' && row.src === '/dsh-feiyu-mood/widget.js')
          || (row.kind === 'script' && typeof row.text === 'string' && row.text.indexOf('/dsh-feiyu-mood/widget.js') >= 0))) return
      }
      table.push({ kind: 'script', placement: 'body', text: WIDGET_ROW_TEXT })
    })
  } catch (e) { diag('挂饰注入失败：' + (e && e.message)) }
```

</details>

#### 缺口

- 没有同一用户关闭与开启该机制的持续观察
  **影响**：无法判断是否有反复查看需要
  **进一步探讨**：比较同一伙伴任务中手工记录、仅看挂饰和回注三种做法

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 轮次如何变成下一轮上下文，何处可能归因错误？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

绑定会话在 turn-stopping 时优先回查快照，识别主持人群消息、定时任务和主动搭话，再取最新助理消息并提交串行判断。用户与助理文本片段会交给所选模型；如果没有单独指定完整的提供商与模型对，跟随会话模型。判断只在原绑定与重置版本仍有效时更新状态。新变化先看显著性和累计量，读取上下文时再看事件去重、置信度和日限额。危险在于用户消息和助理消息是两次独立的倒序查找，快照没有成对轮次校验，迟到事件或仅机器发起的轮次可能被配到旧话；群网桥识别失败也可整段退回用户文本。模型自报置信度只能筛选，不能验证归属。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1152-1198](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L1152-L1198)

快照倒序找用户消息，过滤来源，网桥批次解析失败回到原文本。

<details>
<summary>查看原文（47行）</summary>

```text
export function lastUserTurnOf(session, ownerName = '', 别名们 = []) {
  try {
    if (!session || typeof session.snapshotEvents !== 'function') {
      // ⚠ 1.5.x：静默返回过 —— 线上要能看出「事件读不到」而不是「这轮没说话」
      diag('会话上没有 snapshotEvents（' + (session ? typeof session.snapshotEvents : 'session 为空') + '）')
      return null
    }
    const ev = session.snapshotEvents() || []
    for (let i = ev.length - 1; i >= 0; i--) {
      const e = ev[i]
      if ((e && (e.type || e.kind)) !== 'user/message') continue
      const p = e.payload !== undefined ? e.payload : e.data
      // ⭐ 2026-10-23：不截断地取全文 → 先切掉网桥那些人设前缀 → 再截 1600。
      //    以前是「先截 2000 再判断」，网桥消息的人设正好占满前面，真人原话全被切掉。
      const txt = stripBridgePrefix(fullTextOf(p)).slice(0, 1600)
      if (!txt) continue
      const src = p && p.source && p.source.kind ? String(p.source.kind) : ''
      if (注入上下文.has(src)) continue          // 宿主注入的上下文：跳过
      if (外部触发.has(src) || 自主搭话.has(src)) return { text: txt, sourceKind: src }
      // ⭐ 0.7.3（issue #10）：子代理通知 / 定时任务 / 目标自动继续 —— 不是人在说话，跳过
      if (是机器来源(src)) {
        if (!见过的来源.has(src)) {
          见过的来源.add(src)
          diag('「' + src + '」这种来源不是人说的（子代理 / 定时任务 / 自动继续），心情不判')
        }
        continue
      }
      // ⭐ 0.7.1：QQ 桥 / 挂件这些「外面进来的话」= 她本人在说话，要判心情
      // ⭐ 0.7.7（issue #11）：群批要先按说话人拆 —— 只取 owner 那几行；别人的话不算她说的。
      //   拆出来但没有 owner 的发言 → 返回空 text，让上层直接跳过（别退回 inbox 缓存把整批当她说）。
      if (外网桥.has(src)) {
        const 批 = 拆群消息(txt, ownerName, 别名们)
        if (批) {
          if (!批.ownerSpoke) {
            diag('这批群消息里没有「' + ([ownerName, ...别名们].filter(Boolean).join(' / ') || '她') + '」说的话，这一轮不判心情')
          }
          return { text: 批.ownerSpoke ? 批.text : '', sourceKind: 'user' }
        }
        return { text: txt, sourceKind: 'user' }
      }
      if (src && src !== 'user' && !见过的来源.has(src)) {
        // 没见过的来源：不再静默跳过（以前就是这样把 QQ 那路漏掉的）。
        // 先当「有人在跟它说话」判一次，同时把来源记一笔，方便以后按需特判。
        见过的来源.add(src)
        diag('第一次见到的消息来源「' + src + '」—— 先按「她在说话」处理（心情照判）')
      }
      return { text: txt, sourceKind: 'user' }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1204-1216](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L1204-L1216)

另一独立倒序扫描查助理文本。

<details>
<summary>查看原文（13行）</summary>

```text
function lastAssistantTextOf(session) {
  try {
    if (!session || typeof session.snapshotEvents !== 'function') return ''
    const ev = session.snapshotEvents() || []
    for (let i = ev.length - 1; i >= 0; i--) {
      const e = ev[i]
      if ((e && (e.type || e.kind)) !== 'assistant/message') continue
      const p = e.payload !== undefined ? e.payload : e.data
      const txt = textOfMessage(p)
      if (txt) return txt
    }
  } catch (e) { /* ignore */ }
  return ''
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1583-1612](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L1583-L1612)

判断前后检查绑定和重置版本，失效响应不进入状态。

<details>
<summary>查看原文（30行）</summary>

```text
        const info = lastUserTurnOf(agent.session, 对方, 对方别名) || (lastText ? 缓存这条() : null)
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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1366-1423](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L1366-L1423)

确认请求模型、文本截取、会话标识和输出上限。

<details>
<summary>查看原文（58行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1643-1670](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L1643-L1670)

上下文按上次更新时间、显著性、置信度及日预算筛选。

<details>
<summary>查看原文（28行）</summary>

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
```

</details>

#### 缺口

- 宿主事件的交错与快照时序未运行测量
  **影响**：无法确定错误归因的出现频率
  **进一步探讨**：在不接真实群聊的宿主夹具中插入两轮与机器通知，逐个核对来源和助理配对

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 开启、运行、排障和退出由谁承担，管理接口有何限制？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

Cordis 补丁加载宿主入口，Web 扩展依赖设置服务，包声明 Node 22 及 DSH 0.2.1-rc.2 起。用户需要重启、绑定会话并核对模型提供商；每个满足判断条件的轮次发独立流请求，关闭回注并不会停止模型判定。状态文件经临时文件替换，读失败回空状态且写错误吞掉，跨进程共享同一个 DSH_HOME 时不能由这套写法证明安全。管理路由依赖宿主明确给出 401/403，缺接口或异常时继续交给处理函数。更新安装路径会调用宿主安装管理器，还会在多个 profile 中取第一个 URL 依赖，不能假定更新来源来自当前 profile。首次配置、诊断和备份归用户承担，模型开销取决于请求与单价。退出前先停自动判断，再备份本地状态并在隔离环境核查卸载和重启。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:25-60](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/package.json#L25-L60)

确认宿主与 Web 接线和最低版本。

<details>
<summary>查看原文（36行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "assets",
    "client.js",
    "cordis.patch.yml",
    "README.md",
    "CHANGELOG.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
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
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/cordis.patch.yml#L1-L3)

补丁插入宿主插件。

```text
- insert:
    - id: mood
      name: dsh-feiyu-mood
```

**依据 3 · 源码核查**：[lib/index.js:832-871](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L832-L871)

读失败回空；写临时文件并改名，写错误未上抛。

<details>
<summary>查看原文（40行）</summary>

```text
function readStore() {
  let raw = null
  try { raw = JSON.parse(readFileSync(STATE_PATH, 'utf8')) } catch (e) { raw = null }
  const store = { version: STATE_VERSION, moods: {}, lastActive: '' }
  if (!raw || typeof raw !== 'object') return store
  if (raw.moods && typeof raw.moods === 'object') {
    for (const [k, v] of Object.entries(raw.moods)) {
      if (v && typeof v === 'object') store.moods[String(k)] = normState(v)
    }
    store.lastActive = String(raw.lastActive || '')
    return store
  }
  // 老格式：整个文件就是一个心情
  try { writeFileSync(STATE_PATH + '.v1.bak', JSON.stringify(raw, null, 2), 'utf8') } catch (e) { /* 备份失败不拦着 */ }
  const k = 第一份键 || 兜底键
  store.moods[k] = normState(raw)
  store.lastActive = k
  diag('老心情（单份）已搬进「' + k + '」，原文件另存为 state.json.v1.bak')
  return store
}

function writeStore(store) {
  try {
    mkdirSync(STORE_DIR, { recursive: true })
    const tmp = STATE_PATH + '.tmp'
    writeFileSync(tmp, JSON.stringify({ version: STATE_VERSION, moods: store.moods, lastActive: store.lastActive || '' }, null, 2), 'utf8')
    renameSync(tmp, STATE_PATH)
  } catch (e) { /* 持久化失败不拖垮对话 */ }
}

function loadState(key) {
  const store = readStore()
  return store.moods[key] || blankState()
}

function saveState(key, s) {
  const store = readStore()
  store.moods[key] = s
  store.lastActive = key
  writeStore(store)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1763-1777](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L1763-L1777)

缺鉴权接口或异常时默认进入 handler。

<details>
<summary>查看原文（15行）</summary>

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
  }
```

</details>

**依据 5 · 源码核查**：[lib/selfupdate.mjs:145-185](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/selfupdate.mjs#L145-L185)

扫描 profile 依赖并调用 installBundle。

<details>
<summary>查看原文（41行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[lib/selfupdate.mjs:197-231](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/selfupdate.mjs#L197-L231)

自更新路由的守卫行为及 POST 安装接线。

<details>
<summary>查看原文（35行）</summary>

```text
    const 只认本人 = (handler) => async (req, res) => {
      try {
        const 连接 = typeof ctx.get === 'function' ? ctx.get('connection') : undefined
        const 拒 = 连接 && typeof 连接.requestRejection === 'function' ? 连接.requestRejection(req) : undefined
        if (拒 === 401 || 拒 === 403) {
          send(res, 拒, { ok: false, error: 拒 === 401 ? 'authentication_required' : 'management_forbidden' })
          return
        }
      } catch (e) {}
      return handler(req, res)
    }
    try {
      ctx.effect(() => ctx.webServer.register({
        kind: 'exact',
        path: route + '/update',
        handler: 只认本人(async (req, res) => {
          try {
            const url = new URL(req.url, 'http://127.0.0.1')
            const force = url.searchParams.get('refresh') === '1'
            send(res, 200, { ok: true, ...(await check(force)) })
          } catch (e) {
            log('查更新路由失败：' + (e && e.message))
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
```

</details>

#### 缺口

- 实际网关、连接组件及更新所用 profile 尚未验证
  **影响**：外部是否可达和宿主鉴权结果未知
  **进一步探讨**：隔离环境核验未登录和无管理权请求是否被拒，分别测有无连接服务；拦截安装器验证传入规格
- 判断请求量和费用没有采样
  **影响**：作者费用口径不能用于预算
  **进一步探讨**：记录合格回合数、实际请求量、输入输出 token、人工核对时长及失败

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用条件是什么，如何检验累计幅度是否改善反馈？

**研究主题**：新假设与验证、采用判断

#### 完整回答

保留观察结论。适合考虑它的人需要跨轮看状态，但接入前应先核验管理接口、供应商文本外发边界和事件配对。源码中的累计是 moodDelta 的绝对值之和，数次反方向小变化也可能越线；实际状态步长先除以三并取整，累计越线并不证明净变化大。可以在相同固定回合上对照单轮阈值、现有绝对幅度累计和按方向抵消的累计，按真有同向变化的召回及把来回震荡误当事件的比例评估。若方向抵消减少误播却漏掉同样多的真实变化，或人工标注者无法一致判定语境，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1601-1633](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L1601-L1633)

有状态变化时按原始绝对 moodDelta 累积，提升小变化为可回注状态。

<details>
<summary>查看原文（33行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1661-1680](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/1f38503653bdd59e5996903d98eb03905c5e59a2/lib/index.js#L1661-L1680)

注入消费记录文本和时间，真正返回提示时重置累计。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

#### 缺口

- 尚未对累计三种策略作同序列对照
  **影响**：不能把算法变化当体验改善
  **进一步探讨**：用同向小变化与交替涨跌的标注序列回放，另记配置丢失与未送达结果

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
