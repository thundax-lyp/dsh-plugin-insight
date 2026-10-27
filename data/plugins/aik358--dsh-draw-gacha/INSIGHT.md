# dsh-draw-gacha

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9fd81e6](https://github.com/Aik358/dsh-draw-gacha/tree/9fd81e6db10944b6fa339aeb731e2850e1627b9a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aik358/dsh-draw-gacha) [![npm 30d 857](https://img.shields.io/static/v1?label=npm+30d&message=857&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-draw-gacha) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-draw-gacha)
<!-- END META -->

> **功能**：DSH Web 拉杆发送与流式信号驱动的 3D 娱乐抽卡演出。

> **亮点**：将消息发送、流式文本特征和动画游戏化结合，且不保存完整 reasoning。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **主要限制**：落地延迟回调未捕获当前 attempt，关掉旧局后立即开新局可能提前揭示；词面分数不可当能力度量。详见[Q03](#research-q03)与[Q04](#research-q04)。

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
  - [Q01 · 抽卡拉杆服务什么场景，能否代表模型质量？](#detail-section-11)
  - [Q02 · 消息发送、流统计和卡面结算如何串联？](#detail-section-12)
  - [Q03 · 跨会话和异步计时能否保证展示属于当前抽卡？](#detail-section-13)
  - [Q04 · 稀有度和信号计数的语义边界是什么？](#detail-section-14)
  - [Q05 · 部署与维护的主要代价是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户用抽卡动画消解模型回答等待；结果不代表模型质量。详见[Q01](#research-q01)。

普通发送可直接看模型回复；抽卡需证明娱乐体验足以抵消额外动画和资源。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 流信号结算 | 趣味随机感 | 非质量评价 |
| generation/attempt | 会话隔离 | 延迟揭示回调有缺口 |
| BGM/Skip | 控制演出 | 性能与无障碍未测 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH Web slots/useInput | 必需 | 拉杆/遮罩与草稿 | 不能提交或展示 |
| llm/stream/webServer | 必需 | 流观测与状态 API | 无信号结算 |
| 浏览器定时/Web Audio | 演出 | 动画/BGM | 动效或声音缺失 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | profile 加包并重启 web | 拉杆出现 |
| 触发 | 写草稿后拉杆到底/键盘确认 | 消息提交、遮罩启动 |
| 等待 | 至少十五秒且数据足或模型结束 | 自动落地，也可 Skip |
| 退出 | 关闭/点击继续 | 回到对话，不把稀有度当能力 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH Web/插件包，金额未知 | profile 安装及重启 | 兼容未实测 |
| 运行 | 140ms 状态轮询、Canvas/CSS 3D 与 Web Audio | 看演出/可跳过 | CPU/电量未知 |
| 维护 | 长会话 Map 状态、版本接口变化 | 修计时和档位 | 累积内存未测 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 趣味抽卡 | 拉杆、动画、BGM、Skip | 用户喜欢程度 |
| 会话信号 | reasoning/text 词面计数 | 任何答案质量预测力 |
| 隔离 | generation 和一般 attempt | 落地回调跨局安全 |

> **思考**：落地延迟回调未捕获当前 attempt，关掉旧局后立即开新局可能提前揭示；词面分数不可当能力度量。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将消息发送、流式文本特征和动画游戏化结合，且不保存完整 reasoning。详见[Q01](#research-q01)与[Q02](#research-q02)。

流代理保留原 chunk、辅助请求过滤和 generation 防旧状态值得借鉴；落地回调恒真、Map 生命周期需修。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

落地延迟回调未捕获当前 attempt，关掉旧局后立即开新局可能提前揭示；词面分数不可当能力度量。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

限个人娱乐试用；不能用稀有度评价模型。生产/演示场景先核异步串局和目标宿主兼容。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核信号和渲染路径；1.4 秒异步回调有跨局恒真条件，等级叙述与 Host 结果范围不一致；未在目标宿主执行。

- 已检查：作者 README、包清单、源码路径 README.zh.md、lib/index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、Host/Client/包声明；未运行目标插件或宿主，不验证动画实效；META 沿用旧批次。
- 下一步：目标宿主测连开两局 1.4 秒窗口、并发/工具调用、五档 UI 映射、长会话内存、性能/音频和减动效。

**分析版本**

- **仓库**：[Aik358/dsh-draw-gacha](https://github.com/Aik358/dsh-draw-gacha)
- **版本号**：0.1.7（[固定提交 9fd81e6](https://github.com/Aik358/dsh-draw-gacha/tree/9fd81e6db10944b6fa339aeb731e2850e1627b9a)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证修正包括 attempt 捕获、过期状态清理、档位文案对齐和轮询节流；需真实宿主计时/性能验证。详见[Q05](#research-q05)。

目标宿主测连开两局 1.4 秒窗口、并发/工具调用、五档 UI 映射、长会话内存、性能/音频和减动效。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 282 | — | — | 3888 |
| .js | test | 2 | 232 | 180 | 30 | — |
| .js | source | 2 | 1214 | 1133 | 69 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aik358/dsh-draw-gacha/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Aik358/dsh-draw-gacha/issues?q=is%3Aissue+created%3A2026-09-21T07%3A59%3A06.578Z..2026-10-21T07%3A59%3A06.578Z)

暂未获取：近30天关闭。

统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：娱乐化抽卡是否保持会话隔离、正确计时且不误导模型质量？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 抽卡拉杆服务什么场景，能否代表模型质量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件将发送消息与十五秒起的 3D 抽卡演出绑定，面向想要娱乐化模型等待过程的 DSH Web 用户。结果由模型 reasoning/text 的长度和词面信号计算，源码没有正确性或答案质量评估，页面也明确标注娱乐性。README 预览与体验描述均属作者展示，本轮仅核固定源码，不能据此证明实际观感或效率。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:11-41](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/README.zh.md#L11-L41)

作者定义拉杆、信号与娱乐边界

<details>
<summary>查看原文（31行）</summary>

```text
DeepSeek Harness（DSH）的模型调用效果方差很大，像抽卡一样忽好忽坏。这个插件把"抽卡"变成了字面意思：

1. 在发送区原生发送按钮右侧，出现一根 **3D 拟真机械拉杆**（金属壳体 + 长行程黄色握柄）。
2. 向下拉动握柄到底、金光满溢后松手——消息照常发送，同时全屏进入一场像素风抽卡演出。
3. 插件在后台持续读取本次模型的 **reasoning 思维链**（以及正文 text 通道），实时统计 10 类文本信号：
   - **计划**：`I will / I'll / I need / we need / we should / 我会 / 我需要 / 我们得…`
   - **验证**：`verify / check / test / confirm / double-check / make sure / 验证 / 检查 / 核实…`
   - **自纠错**：`however / wait / I was wrong / let me reconsider / 但是 / 重新 / 等等…`
   - **严谨性**：`constraint / trade-off / edge case / 约束 / 边界 / 权衡…`
   - **结构**：`first / second / step / finally / 首先 / 其次 / 总结…`
   - 以及 `let me / 让我` 等弱风格信号。
4. 统计足够充分后（**最短演出 15 秒 + 观测数据足量**，或模型已答完），返回舱落地，按信号稀有度揭示卡面：**白 · 小难梁 / 蓝 · 牢梁 / 黄 · 梁子 / 橙 · 梁圣 / 红 · 梁祖**。

> 拉杆拖动的信号会跨流式分片拼接统计（DeepSeek 会把单词切成 `I wi` + `ll`，插件做了跨 chunk 尾巴缓冲，不会漏检）。

## 核心演出

- **半透明灰遮罩**（`rgba(26,30,38,.62)` + 毛玻璃模糊）：不遮挡对话，随时能看见背后内容。
- **三舱下坠**：三个 CSS 3D 多面体返回舱从母舰分离，沿固定航向下坠——监听期间持续循环下落，模型答完才播放落地动画（白闪 → 压扁 → 冲击波 → 尘土）。
- **一大两小结算**：中间大卡是**「滑动变祖器」**梁系立绘 + 档位刻度（拉 → 燃 → 稳 → 夯），左右两张武器小卡；星级按稀有度点亮。
- **趣味文案**：每个档位多组随机抽卡台词，结果由 `seed` 驱动。
- **内置 BGM**：Web Audio 生成的 8 秒工业电子循环，可一键静音，无外部素材依赖。
- **操作**：右上角 ✕ 随时关闭；**SKIP** 按当前观测立即结算（不取消模型请求）；结算卡面点击任意处或「点击继续」关闭。
- 完整支持 `prefers-reduced-motion` 与窄屏布局。

## 为什么这样设计（理念）

- **结算条件 = 数据足量，不是模型答完**。模型可能干 40 分钟，但插件观测到足够信号（约 6000 字符 或 信号总数 ≥ 20）就会在最短 15 秒后落地结算，绝不陪你下坠 40 分钟。
- **`let me` 不是罪**。它只是弱风格信号；只有当验证/自纠错/结构信号都缺失时才产生轻微负分（有上限）。
- **不保存思维链**。Host 只保留计数、长度、阶段与极短采样，完整 reasoning 永不落盘、永不进入浏览器。
- **纯娱乐声明**：所有结论仅基于生成过程中的文本信号，不代表答案质量、模型能力、版本信息、人物能力或任何官方关系。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:64-88](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/index.js#L64-L88)

分数基于词面计数/长度

<details>
<summary>查看原文（25行）</summary>

```text
function score(s) {
  const c = s.counts;
  const observed = s.reasoningChars + s.textChars;
  const planning = Math.min(4, (c.iWill > 0 ? 1 : 0) + (c.iNeed > 0 ? 1 : 0) + (c.weNeed > 0 ? 2 : 0) + (c.weShould > 0 ? 1 : 0) + (c.lets > 0 ? 1 : 0));
  const rigor = Math.min(5, (c.verify > 0 ? 2 : 0) + (c.selfCorrect > 0 ? 2 : 0) + (c.constraint > 0 ? 1 : 0) + (c.structure > 0 ? 1 : 0));
  const length = observed >= 6000 ? 5 : observed >= 3000 ? 3 : observed >= 1200 ? 2 : observed >= 400 ? 1 : 0;
  // tool-calls 是中间状态（模型还在执行工具继续干活），不视为正常完成；
  // 只有 stop（或尚未 finish）才按正常路径结算，避免中途误判稀有度。
  const normal = s.finish === null || s.finish === 'stop';
  // let me 负向惩罚：比旧版更敏感（letMe/2 起算，强信号按 1/3 抵扣），但上限 2 不失控。
  const letMePenalty = Math.min(2, Math.max(0, Math.ceil(c.letMe / 2) - Math.floor((planning + rigor) / 3)));
  const total = planning + rigor + length + (normal ? 1 : 0) - letMePenalty;
  if (s.finish === 'error' || s.finish === 'aborted') return observed >= 1200 ? { rarity: 'gold', total } : { rarity: 'blue', total };
  if (observed >= 3000 && total >= 7 && normal) return { rarity: 'red', total };
  if (observed >= 1200 && total >= 3 && normal) return { rarity: 'gold', total };
  return { rarity: 'blue', total };
}
function result(s) {
  const scored = score(s);
  const observed = s.reasoningChars + s.textChars;
  if (scored.rarity === 'red' && observed >= 3000) return { rarity: 'red', tails: ['red', 'red', 'red'], stars: 6, centerStage: 'slam', finish: s.finish || 'stop', counts: s.counts, reasoningChars: s.reasoningChars, textChars: s.textChars, seed: s.generation, flavorText: '夯力过载，三舱全红！' };
  if (scored.rarity === 'red') return { rarity: 'red', tails: ['gold', 'red', 'gold'], stars: 5, centerStage: 'steady', finish: s.finish || 'stop', counts: s.counts, reasoningChars: s.reasoningChars, textChars: s.textChars, seed: s.generation, flavorText: '人物红，双侧金光落地。' };
  return { rarity: scored.rarity, tails: ['blue', 'gold', 'blue'], stars: 4, centerStage: 'pull', finish: s.finish || 'stop', counts: s.counts, reasoningChars: s.reasoningChars, textChars: s.textChars, seed: s.generation, flavorText: '人物金，双侧蓝色武器保底。' };
}
function visible(s) { return s ? { ok: true, sessionId: s.sessionId, generation: s.generation, phase: s.phase, reasoningChars: s.reasoningChars, textChars: s.textChars, counts: s.counts, provisionalRarity: score(s).rarity, finish: s.finish, result: s.result } : { ok: true, phase: 'idle', generation: 0, result: null }; }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1053-1055](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/client.js#L1053-L1055)

页面结果免责声明

```text
          reveal ? h('button', { className: 'dsg-close', type: 'button', onClick: reset }, '点 击 继 续') : null,
          renderStats(state.snapshot),
          h('small', { className: 'dsg-note' }, '本结果仅根据生成过程中的文本信号娱乐性结算，不代表答案质量、模型能力、版本信息或任何官方关系。')
```

#### 缺口

- 用户是否喜欢十五秒演出及其对等待感的影响未测
  **影响**：不能将娱乐稀有度当模型能力或生产力指标
  **进一步探讨**：真实会话做体验测量并清楚标示娱乐性

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 消息发送、流统计和卡面结算如何串联？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

浏览器拉杆满足草稿与空闲条件才调用 Host start，取得 sessionId 的 generation 后调用 inputActions.submit；Host 对 llm/stream 先 await 下游并逐 chunk 原样转发，过滤 compaction/session-title，按 sessionId 记录 reasoning/text 长度与十类正则信号，保留最多 120 字符尾部以统计跨 chunk 词。客户端轮询 state，首次观察数据后计十五秒，观测达到 6000 字符/20 信号或模型完结时可进入落地，40 秒兜底。宿主 API/slots 的目标版本联调未做。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:923-929](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/client.js#L923-L929)

拉杆提交、轮询与定时结算

```text
      const revealWhenReady = () => { if (finishScheduled || !state.overlay || !state.signalElapsed || !(state.dataSufficient || state.modelFinished)) return; finishScheduled = true; state.phase = 'landing'; notify(); ctx.timeout(() => { if (state.overlay && state.attempt === state.attempt) { state.phase = 'result'; state.flavor = pickFlavor(state.snapshot?.result?.rarity || 'blue', (state.snapshot?.result?.seed || 0) + (state.snapshot?.reasoningChars || 0)); notify(); } }, 1400); };
      const schedule = (phase, ms, attempt) => ctx.timeout(() => { if (state.overlay && state.attempt === attempt) { state.phase = phase; notify(); } }, ms);
      const launch = async (props) => { if (!inputReady(props)) return; const sessionId = String(props.sessionId || props.session?.id || ''); if (!sessionId) return; startMusicLoop(); attemptSeq += 1; const attempt = attemptSeq; state.locked = true; state.overlay = true; state.phase = 'charging'; state.sessionId = sessionId; state.snapshot = null; state.signalElapsed = false; state.signalStarted = false; state.dataSufficient = false; state.modelFinished = false; state.flavor = ''; finishScheduled = false; state.attempt = attempt; notify(); schedule('launching', 900, attempt); schedule('falling', 1800, attempt); ctx.timeout(() => { if (state.overlay && state.attempt === attempt) { if (!state.dataSufficient && !state.modelFinished && !state.signalElapsed) state.phase = 'waiting'; notify(); } }, 10000); ctx.timeout(() => { if (state.overlay && state.attempt === attempt) { state.signalElapsed = true; notify(); revealWhenReady(); } }, 40000); try { const started = await post('start', { sessionId }); if (!started || !started.ok) throw new Error('start rejected'); state.generation = started.generation; props.inputActions.submit(); notify(); } catch { reset(); } };
      const poll = () => { if (!state.overlay || !state.generation) return; post('state', { sessionId: state.sessionId, generation: state.generation }).then((snap) => { if (!snap || snap.stale) return; state.snapshot = snap; state.modelFinished = snap.phase === 'settled' || snap.phase === 'cancelled' || snap.phase === 'error'; const observed = (snap.reasoningChars || 0) + (snap.textChars || 0); if (!state.signalStarted && observed > 0) { state.signalStarted = true; const attempt = state.attempt; ctx.timeout(() => { if (state.overlay && state.attempt === attempt) { state.signalElapsed = true; notify(); revealWhenReady(); } }, 15000); } if (!state.dataSufficient) { const c = snap.counts || {}; const signalSum = (c.letMe||0) + (c.iNeed||0) + (c.iWill||0) + (c.weNeed||0) + (c.weShould||0) + (c.lets||0) + (c.verify||0) + (c.selfCorrect||0) + (c.constraint||0) + (c.structure||0); if (observed >= 6000 || signalSum >= 20) { state.dataSufficient = true; notify(); revealWhenReady(); } } if (state.modelFinished && !state.signalElapsed) state.phase = 'holding'; notify(); revealWhenReady(); }).catch(() => {}); };
      const skip = () => { if (!state.overlay || state.phase === 'result') return; attemptSeq += 1; state.attempt = attemptSeq; const presentation = skipPresentation(state.snapshot); state.snapshot = { ...(state.snapshot || {}), phase: 'settled', provisionalRarity: presentation.rarity, result: { rarity: presentation.rarity, tails: presentation.tails, stars: presentation.stars, centerStage: presentation.centerStage, finish: 'skip' } }; state.modelFinished = true; state.signalElapsed = true; state.signalStarted = true; state.dataSufficient = true; state.phase = 'result'; state.flavor = pickFlavor('skip', state.generation || 1); finishScheduled = true; notify(); };

      function Lever(props) { const [, redraw] = useState(0); const drag = useRef({ active: false, startY: 0 }); useEffect(() => subscribe(() => redraw((v) => v + 1)), []); /* Standard-props contract: this slot is rendered without owner props, so the live draft is read through the standard `useInput` selector hook. Hooks cannot run inside event handlers — resolve it once per render and hand every handler this widened view (an older host keeps its own `props.input`). */ const liveInput = typeof props.useInput === 'function' ? props.useInput((s) => s) : undefined; const view = liveInput === undefined ? props : { ...props, input: liveInput }; const down = (event) => { if (!inputReady(view)) return; drag.current.active = true; drag.current.startY = event.clientY; event.currentTarget.setPointerCapture(event.pointerId); state.phase = 'pulling'; state.pull = 0; notify(); }; const move = (event) => { if (!drag.current.active) return; state.pull = Math.max(0, Math.min(1, (event.clientY - drag.current.startY) / 82)); state.phase = state.pull >= .88 ? 'armed' : 'pulling'; notify(); }; const release = () => { if (!drag.current.active) return; drag.current.active = false; if (state.pull >= .88) launch(view); else { state.pull = 0; state.phase = 'hidden'; notify(); } }; const key = (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); state.pull = 1; state.phase = 'armed'; notify(); launch(view); } }; const className = `dsg-lever-control ${state.phase === 'pulling' ? 'is-pulling' : ''} ${state.phase === 'armed' || state.phase === 'launching' ? 'is-armed' : ''}`; return h('span', { className: 'dsg-lever-cell', title: '向下拉到底后发送并抽卡' }, h('button', { type: 'button', disabled: !inputReady(view), className, style: { '--pull': state.pull }, onPointerDown: down, onPointerMove: move, onPointerUp: release, onPointerCancel: release, onKeyDown: key, 'aria-label': '绘画抽卡拉杆' }, h('i', { className: 'dsg-lever-housing' }), h('i', { className: 'dsg-lever-slot' }), h('i', { className: 'dsg-lever-ticks' }), h('i', { className: 'dsg-lever-grip' }))); }
```

**依据 2 · 源码核查**：[lib/index.js:49-63](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/index.js#L49-L63)

跨 chunk 统计

<details>
<summary>查看原文（15行）</summary>

```text
  return out;
};
// 跨 chunk 增量匹配：保留上一 chunk 的尾部（最多 48 字符），拼接后匹配，
// 减去尾部单独能匹配到的数量 = 新增（含跨 chunk 拼出来的完整词）。
const TAIL_LEN = 120;
function scanChunk(state, text) {
  const tail = state.tail || '';
  const combined = tail + text;
  const now = countAll(combined);
  const prev = countAll(tail);
  for (const key of Object.keys(SIGNAL_SOURCES)) {
    state.counts[key] += Math.max(0, now[key] - prev[key]);
  }
  state.tail = combined.slice(-TAIL_LEN);
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:110-146](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/index.js#L110-L146)

session 状态、路由和流监听

<details>
<summary>查看原文（37行）</summary>

```text
function observe(options, chunk) {
  if (!options || !clean(options.sessionId) || aux.has(options.purpose)) return;
  const s = active.get(clean(options.sessionId));
  if (!s || s.generation !== generations.get(s.sessionId)) return;
  if (s.phase === 'armed') s.phase = 'running';
  if (chunk.type === 'reasoning-delta' || chunk.type === 'text-delta') {
    const t = typeof chunk.text === 'string' ? chunk.text : '';
    if (chunk.type === 'reasoning-delta') s.reasoningChars += t.length; else s.textChars += t.length;
    scanChunk(s, t);
  }
  else if (chunk.type === 'finish') {
    const r = typeof chunk.reason === 'string' ? chunk.reason : chunk.reason && (chunk.reason.kind || chunk.reason.type);
    s.finish = ['stop', 'tool-calls', 'max-tokens', 'aborted', 'error'].includes(r) ? r : 'error';
    if (s.finish === 'tool-calls') {
      // 模型要调用工具继续干活，任务尚未完成：保持 running，继续累计后续轮次的 reasoning/text。
      s.phase = 'running';
    } else {
      s.result = result(s);
      s.phase = s.finish === 'aborted' ? 'cancelled' : s.finish === 'error' ? 'error' : 'settled';
    }
  }
  s.updatedAt = stamp();
}
function json(res, status, value) { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(JSON.stringify(value)); }
function bodyOf(req) { return new Promise((resolve, reject) => { let raw = ''; req.on('data', (x) => { raw += x; if (raw.length > 65536) reject(new Error('body-too-large')); }); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } }); req.on('error', reject); }); }
function route(path, fn) { return { kind: 'exact', path, handler: (req, res) => { if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method-not-allowed' }); bodyOf(req).then(fn).then((v) => json(res, 200, v), (e) => json(res, 400, { ok: false, error: String(e.message || e) })); } }; }
export const name = 'draw-gacha';
export const inject = ['webServer'];
export function apply(ctx) {
  const routes = [route(`${prefix}/start`, start), route(`${prefix}/state`, getState), route(`${prefix}/cancel`, cancel)];
  ctx.effect(() => {
    const disposers = routes.map((r) => ctx.webServer.register(r));
    return () => disposers.forEach((dispose) => dispose());
  }, 'draw-gacha: routes');
  // 消费方防御(2026-08-18): 先 await next() 再迭代——链下游任何监听器返回
  // Promise 或 async iterable 都能安全透传, 不再要求下游必须"普通函数返回流"。
  ctx.on('llm/stream', (options, next) => (async function* () { try { for await (const chunk of await next()) { observe(options, chunk); yield chunk; } } catch (e) { observe(options, { type: 'finish', reason: 'error' }); throw e; } })());
```

</details>

**依据 4 · 作者声明**：[README.zh.md:93-96](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/README.zh.md#L93-L96)

作者说明宿主契约

```text
- Host 只读 `llm/stream` 并原样转发每个 chunk，不改写冻结的 `GenerateOptions`。
- 通过 `options.sessionId + generation` 隔离多会话；`purpose=compaction/session-title` 的辅助请求被排除。
- 信号统计支持中英双语思维链，跨 chunk 尾巴缓冲（120 字符）防止分片切词漏检。
- 想改演出：先改 `dev-preview.html` 预览，满意后再同步进 `lib/client.js`（两边代码一致）。
```

#### 缺口

- 目标 DSH 版本的 useInput、stream 与 route 行为未联调
  **影响**：发送/统计链只能按源码判断
  **进一步探讨**：目标版本覆盖普通、工具调用、并发会话和旧版 input props

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 跨会话和异步计时能否保证展示属于当前抽卡？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Host 的 generation 防止旧 state 读取，Client 常规定时也捕获 attempt；但 revealWhenReady 延迟 1400ms 的回调写了 state.attempt === state.attempt 恒真。如果第一局进入 landing 后关闭并在 1.4 秒内启动第二局，旧回调会把第二局切到 result，即使它尚未达到最短演出/观测条件。源码路径可复核，目标浏览器触发率未测。此处建议保存局部 attempt 并在回调比较。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:91-108](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/index.js#L91-L108)

generation 隔离旧状态

<details>
<summary>查看原文（18行）</summary>

```text
  if (!sessionId) return { ok: false, error: 'sessionId-required' };
  const generation = (generations.get(sessionId) || 0) + 1;
  generations.set(sessionId, generation);
  active.set(sessionId, { sessionId, generation, phase: 'armed', reasoningChars: 0, textChars: 0, counts: counts(), tail: '', finish: null, result: null, updatedAt: stamp() });
  return { ok: true, generation, phase: 'armed' };
}
function getState(body) {
  const s = active.get(clean(body.sessionId));
  if (!s) return visible(null);
  const generation = Number(body.generation);
  if (generation && generation !== s.generation) return { ok: false, stale: true, generation, result: null };
  return visible(s);
}
function cancel(body) {
  const s = active.get(clean(body.sessionId));
  if (!s || s.generation !== Number(body.generation)) return { ok: true, stale: true };
  if (s.phase === 'armed' || s.phase === 'running') { s.phase = 'cancelled'; s.finish = 'aborted'; s.result = result(s); s.updatedAt = stamp(); }
  return { ok: true };
```

</details>

**依据 2 · 源码核查**：[lib/client.js:919-927](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/client.js#L919-L927)

关闭、恒真检查与新局 attempt

```text
      const reset = () => { stopMusicLoop(); attemptSeq += 1; state.attempt = attemptSeq; state.overlay = false; state.locked = false; state.phase = 'hidden'; state.pull = 0; state.snapshot = null; state.signalElapsed = false; state.signalStarted = false; state.dataSufficient = false; state.modelFinished = false; state.flavor = ''; finishScheduled = false; notify(); };
      /* The close control keeps the original backend cancellation path; Skip deliberately bypasses it. */
      const close = () => { const sessionId = state.sessionId; const generation = state.generation; reset(); if (sessionId && generation) post('cancel', { sessionId, generation }).catch(() => {}); };
      /* 结算条件：最短演出已满 且 (观测数据已足量 或 模型已结束)。数据足量即结算，不等待模型答完。 */
      const revealWhenReady = () => { if (finishScheduled || !state.overlay || !state.signalElapsed || !(state.dataSufficient || state.modelFinished)) return; finishScheduled = true; state.phase = 'landing'; notify(); ctx.timeout(() => { if (state.overlay && state.attempt === state.attempt) { state.phase = 'result'; state.flavor = pickFlavor(state.snapshot?.result?.rarity || 'blue', (state.snapshot?.result?.seed || 0) + (state.snapshot?.reasoningChars || 0)); notify(); } }, 1400); };
      const schedule = (phase, ms, attempt) => ctx.timeout(() => { if (state.overlay && state.attempt === attempt) { state.phase = phase; notify(); } }, ms);
      const launch = async (props) => { if (!inputReady(props)) return; const sessionId = String(props.sessionId || props.session?.id || ''); if (!sessionId) return; startMusicLoop(); attemptSeq += 1; const attempt = attemptSeq; state.locked = true; state.overlay = true; state.phase = 'charging'; state.sessionId = sessionId; state.snapshot = null; state.signalElapsed = false; state.signalStarted = false; state.dataSufficient = false; state.modelFinished = false; state.flavor = ''; finishScheduled = false; state.attempt = attempt; notify(); schedule('launching', 900, attempt); schedule('falling', 1800, attempt); ctx.timeout(() => { if (state.overlay && state.attempt === attempt) { if (!state.dataSufficient && !state.modelFinished && !state.signalElapsed) state.phase = 'waiting'; notify(); } }, 10000); ctx.timeout(() => { if (state.overlay && state.attempt === attempt) { state.signalElapsed = true; notify(); revealWhenReady(); } }, 40000); try { const started = await post('start', { sessionId }); if (!started || !started.ok) throw new Error('start rejected'); state.generation = started.generation; props.inputActions.submit(); notify(); } catch { reset(); } };
      const poll = () => { if (!state.overlay || !state.generation) return; post('state', { sessionId: state.sessionId, generation: state.generation }).then((snap) => { if (!snap || snap.stale) return; state.snapshot = snap; state.modelFinished = snap.phase === 'settled' || snap.phase === 'cancelled' || snap.phase === 'error'; const observed = (snap.reasoningChars || 0) + (snap.textChars || 0); if (!state.signalStarted && observed > 0) { state.signalStarted = true; const attempt = state.attempt; ctx.timeout(() => { if (state.overlay && state.attempt === attempt) { state.signalElapsed = true; notify(); revealWhenReady(); } }, 15000); } if (!state.dataSufficient) { const c = snap.counts || {}; const signalSum = (c.letMe||0) + (c.iNeed||0) + (c.iWill||0) + (c.weNeed||0) + (c.weShould||0) + (c.lets||0) + (c.verify||0) + (c.selfCorrect||0) + (c.constraint||0) + (c.structure||0); if (observed >= 6000 || signalSum >= 20) { state.dataSufficient = true; notify(); revealWhenReady(); } } if (state.modelFinished && !state.signalElapsed) state.phase = 'holding'; notify(); revealWhenReady(); }).catch(() => {}); };
      const skip = () => { if (!state.overlay || state.phase === 'result') return; attemptSeq += 1; state.attempt = attemptSeq; const presentation = skipPresentation(state.snapshot); state.snapshot = { ...(state.snapshot || {}), phase: 'settled', provisionalRarity: presentation.rarity, result: { rarity: presentation.rarity, tails: presentation.tails, stars: presentation.stars, centerStage: presentation.centerStage, finish: 'skip' } }; state.modelFinished = true; state.signalElapsed = true; state.signalStarted = true; state.dataSufficient = true; state.phase = 'result'; state.flavor = pickFlavor('skip', state.generation || 1); finishScheduled = true; notify(); };
```

#### 缺口

- 真实 UI 极短时序是否可复现未测
  **影响**：演出/结果可能串局，不能保证最短等待约束
  **进一步探讨**：使用 fake clock/目标 UI 做关闭后速启回归，比较 captured attempt

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 稀有度和信号计数的语义边界是什么？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

README 用白蓝黄橙红五档描述，但 Host score 只产 blue/gold/red，最终三卡也只由这三类组成；浏览器的展示映射需要与 Host 区分，不能把五档均视为真实结算。十类正则中中文词组互相重叠，且多个模式可能匹配同段文本，分数不是独立思维能力度量；Host 仅保存计数、字符数、短尾部而未持久化完整 reasoning。真实模型输出分布和误判率未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:15-24](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/README.zh.md#L15-L24)

作者五档描述

<details>
<summary>查看原文（10行）</summary>

```text
3. 插件在后台持续读取本次模型的 **reasoning 思维链**（以及正文 text 通道），实时统计 10 类文本信号：
   - **计划**：`I will / I'll / I need / we need / we should / 我会 / 我需要 / 我们得…`
   - **验证**：`verify / check / test / confirm / double-check / make sure / 验证 / 检查 / 核实…`
   - **自纠错**：`however / wait / I was wrong / let me reconsider / 但是 / 重新 / 等等…`
   - **严谨性**：`constraint / trade-off / edge case / 约束 / 边界 / 权衡…`
   - **结构**：`first / second / step / finally / 首先 / 其次 / 总结…`
   - 以及 `let me / 让我` 等弱风格信号。
4. 统计足够充分后（**最短演出 15 秒 + 观测数据足量**，或模型已答完），返回舱落地，按信号稀有度揭示卡面：**白 · 小难梁 / 蓝 · 牢梁 / 黄 · 梁子 / 橙 · 梁圣 / 红 · 梁祖**。

> 拉杆拖动的信号会跨流式分片拼接统计（DeepSeek 会把单词切成 `I wi` + `ll`，插件做了跨 chunk 尾巴缓冲，不会漏检）。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1-63](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/index.js#L1-L63)

十类正则和叠加计数

<details>
<summary>查看原文（63行）</summary>

```text
const prefix = '/api/draw-gacha';
const aux = new Set(['compaction', 'session-title']);
const active = new Map();
const generations = new Map();
let clock = 0;
const stamp = () => ++clock;
const clean = (v) => typeof v === 'string' ? v.trim().slice(0, 256) : '';
const counts = () => ({ letMe: 0, iNeed: 0, iWill: 0, weNeed: 0, weShould: 0, lets: 0, verify: 0, selfCorrect: 0, constraint: 0, structure: 0 });
// 中文思维链信号词（放宽版）：中文无词边界，直接用字符串包含匹配；禁止单字，只用短语。
const CN = {
  letMe: '让我|我来|我试试|我试|我想|我先|我打算|我准备|我决定|我试着|我试着去|我来试试|我来做|我负责|我来说',
  iNeed: '我需要|我必须|我得|我要|我应该|我应当|我们得|我必须得|我得先|我需要确保|我必须确保',
  iWill: '我会|我将|我要|我打算|我准备|我将会|我将要|我会先|我接下来会',
  weNeed: '我们需要|我们要|我们得|咱们|让我们|我们一起|我们来|咱们一起|我们试试|让我们一起|我们打算',
  weShould: '我们应该|我们应当|我们有必要|我们最好',
  lets: '我们(一起|来)|咱们|咱们一起|让我们|让我们一起|我们试试',
  verify: '验证|检查|确认|测试|核实|校验|核对|复查|审查|审阅|测试一下|确认一下|验证一下|看一下|看看|查一下|检查一下|试一下|跑一下|测一下|复核|自查|排查|检测|检验|试验|试跑|跑一遍|过一遍|对照|比对|逐项|逐一|确认无误|检查无误',
  selfCorrect: '但是|然而|不过|重新|再想想|实际上|等等|更正|修正|我错了|等一下|换个角度|另一种|其实|反过来|仔细想想|再检查|哦对|差点忘了|补充一下|刚才说|另一方面|换个思路|换个说法|准确来说|严格来说|不对|错了|搞错了|更正一下|修正一下|我重新|重新考虑|再考虑|重新审视|重新评估|回头再看|回头检查|推翻|之前说|前面说|严格讲|说白了',
  constraint: '约束|限制|边界|权衡|风险|前提|假设|特殊情况|注意|小心|别忘了|潜在|例外|代价|成本|复杂度|仔细|关键|细节|极端情况|最坏情况|兜底|谨慎|保守|稳妥|容错|异常|边界情况|注意点|要点',
  structure: '首先|其次|最后|第一步|第二步|第三步|第四步|最后一步|总结|综上|步骤|计划|方案|流程|接下来|然后|先|再|最终|总而言之|整体|第三|第四|接着|随后|后续|下面|下一步|分步|分为|阶段|步骤一|步骤二|综上所述|最终结论|结论|总体来看|总的来说'
};
function matches(text, source) {
  if (typeof text !== 'string') return 0;
  const re = new RegExp(source, 'gi');
  let n = 0;
  while (re.exec(text) !== null) n++;
  return n;
}
// 信号源：英文正则 + 中文短语，逐项匹配（跨 chunk 由 scanChunk 拼接统计）
const SIGNAL_SOURCES = {
  letMe: ['\\blet\\s+me\\b', "\\blemme\\b", '\\bi\\s+guess\\b', '\\bi\\s+think\\b', '\\bi\\s+suppose\\b', '\\bi\\s+assume\\b', '\\bi\\s+believe\\b', '\\bi\\s+imagine\\b', '\\bi\\s+reckon\\b', '\\bi\\s+figured\\b', '\\bi\\s+wonder\\b', '\\bi\\s+take\\s+a\\s+look\\b', CN.letMe],
  iNeed: ['\\bi\\s+need\\b', '\\bi\\s+must\\b', '\\bi\\s+should\\b', '\\bi\\s+have\\s+to\\b', '\\bi\\s+got\\s+to\\b', '\\bi\\s+want\\s+to\\b', '\\bi\\s+ought\\s+to\\b', "\\bi'll\\s+need\\b", "\\bi'd\\s+need\\b", '\\bi\\s+need\\s+to\\b', CN.iNeed],
  iWill: ['\\bi\\s+will\\b', "\\bi'll\\b", '\\bi\\s+am\\s+going\\s+to\\b', "\\bi'm\\s+going\\s+to\\b", '\\bi\\s+plan\\s+to\\b', '\\bi\\s+intend\\s+to\\b', '\\bi\\s+shall\\b', "\\bi'd\\b", "\\bi'm\\s+going\\b", '\\bi\\s+am\\s+about\\s+to\\b', CN.iWill],
  weNeed: ['\\bwe\\s+need\\b', '\\bwe\\s+must\\b', '\\bwe\\s+should\\b', '\\bwe\\s+have\\s+to\\b', '\\bwe\\s+got\\s+to\\b', '\\bwe\\s+want\\s+to\\b', "\\bwe'll\\s+need\\b", '\\bwe\\s+need\\s+to\\b', '\\bwe\\s+can\\s+then\\b', CN.weNeed],
  weShould: ['\\bwe\\s+should\\b', '\\bwe\\s+ought\\s+to\\b', '\\bwe\\s+had\\s+better\\b', '\\bwe\\s+need\\s+to\\b', '\\bwe\\s+must\\b', "\\bwe'll\\s+have\\s+to\\b", '\\bwe\\s+can\\b', '\\bwe\\s+could\\b', CN.weShould],
  lets: ["\\blet'?s\\b", '\\blet\\s+us\\b', '\\bwe\\s+can\\b', '\\bwe\\s+could\\b', '\\bwe\\s+should\\b', '\\bwe\\s+might\\b', '\\bwe\\s+may\\b', '\\bwe\\s+will\\b', '\\bwe\\s+would\\b', '\\bwe\\s+are\\s+going\\s+to\\b', "\\bwe're\\s+going\\s+to\\b", CN.lets],
  verify: ['\\b(verify|verification|check|test|validate|confirm|ensure|assure|double-?check|re-?check|scrutinize|inspect|review|examine|prove)\\b', '\\b(must|need|should)\\s+check\\b', '\\b(check|test|verify)\\s+(if|whether|that)\\b', "\\b(let'?s|we|i)\\s+(check|test|verify|confirm)\\b", '\\b(make\\s+sure)\\b', '\\b(be\\s+sure)\\b', '\\b(see\\s+if)\\b', '\\b(look\\s+at|look\\s+into|look\\s+up)\\b', '\\b(try\\s+it|try\\s+this|try\\s+that)\\b', CN.verify],
  selfCorrect: ['\\b(however|but|yet|though|although|rethink|reconsider|instead|actually|hmm|wait|hold\\s+on|nevermind|never\\s+mind|correction|revise|revised|revisit|re-examine|rethink|alternatively|on\\s+the\\s+other\\s+hand|that\\s+said|that\\s+being\\s+said|let\\s+me\\s+reconsider|let\\s+me\\s+rethink|let\\s+me\\s+check\\s+again|actually\\s+no|oh\\s+wait|wait\\s+no|i\\s+was\\s+wrong|i\\s+misspoke|scratch\\s+that|let\\s+me\\s+start\\s+over)\\b', '\\b(but\\s+then|but\\s+wait|but\\s+actually|however\\s+,|however\\s+\\b)\\b', CN.selfCorrect],
  constraint: ['\\b(constraint|constraints|trade-?off|edge\\s+case|edge\\s+cases|risk|risks|invariant|boundary|boundaries|limitation|limitations|caveat|caveats|pitfall|pitfalls|gotcha|gotchas|exception|exceptions|corner\\s+case|special\\s+case|worst\\s+case|best\\s+case|prerequisite|dependency|dependencies|assumption|assumptions|precondition)\\b', '\\b(be\\s+careful|careful|caution|be\\s+mindful|mindful|watch\\s+out|note\\s+that|important\\s+to|it\\s+is\\s+important)\\b', CN.constraint],
  structure: ['\\b(first|second|third|fourth|fifth|finally|final|step|steps|plan|planned|next|then|afterwards|subsequently|meanwhile|lastly|last|firstly|secondly|thirdly|to\\s+begin|to\\s+start|in\\s+conclusion|conclusion|summarize|overview|outline|phase|stage|round|iteration|approach)\\b', '\\b(step\\s+1|step\\s+2|step\\s+3|part\\s+1|part\\s+2|phase\\s+1|phase\\s+2)\\b', CN.structure]
};
const countAll = (text) => {
  const out = {};
  for (const key of Object.keys(SIGNAL_SOURCES)) {
    let n = 0;
    for (const src of SIGNAL_SOURCES[key]) n += matches(text, src);
    out[key] = n;
  }
  return out;
};
// 跨 chunk 增量匹配：保留上一 chunk 的尾部（最多 48 字符），拼接后匹配，
// 减去尾部单独能匹配到的数量 = 新增（含跨 chunk 拼出来的完整词）。
const TAIL_LEN = 120;
function scanChunk(state, text) {
  const tail = state.tail || '';
  const combined = tail + text;
  const now = countAll(combined);
  const prev = countAll(tail);
  for (const key of Object.keys(SIGNAL_SOURCES)) {
    state.counts[key] += Math.max(0, now[key] - prev[key]);
  }
  state.tail = combined.slice(-TAIL_LEN);
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:64-88](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/index.js#L64-L88)

Host 只有三种 rarity

<details>
<summary>查看原文（25行）</summary>

```text
function score(s) {
  const c = s.counts;
  const observed = s.reasoningChars + s.textChars;
  const planning = Math.min(4, (c.iWill > 0 ? 1 : 0) + (c.iNeed > 0 ? 1 : 0) + (c.weNeed > 0 ? 2 : 0) + (c.weShould > 0 ? 1 : 0) + (c.lets > 0 ? 1 : 0));
  const rigor = Math.min(5, (c.verify > 0 ? 2 : 0) + (c.selfCorrect > 0 ? 2 : 0) + (c.constraint > 0 ? 1 : 0) + (c.structure > 0 ? 1 : 0));
  const length = observed >= 6000 ? 5 : observed >= 3000 ? 3 : observed >= 1200 ? 2 : observed >= 400 ? 1 : 0;
  // tool-calls 是中间状态（模型还在执行工具继续干活），不视为正常完成；
  // 只有 stop（或尚未 finish）才按正常路径结算，避免中途误判稀有度。
  const normal = s.finish === null || s.finish === 'stop';
  // let me 负向惩罚：比旧版更敏感（letMe/2 起算，强信号按 1/3 抵扣），但上限 2 不失控。
  const letMePenalty = Math.min(2, Math.max(0, Math.ceil(c.letMe / 2) - Math.floor((planning + rigor) / 3)));
  const total = planning + rigor + length + (normal ? 1 : 0) - letMePenalty;
  if (s.finish === 'error' || s.finish === 'aborted') return observed >= 1200 ? { rarity: 'gold', total } : { rarity: 'blue', total };
  if (observed >= 3000 && total >= 7 && normal) return { rarity: 'red', total };
  if (observed >= 1200 && total >= 3 && normal) return { rarity: 'gold', total };
  return { rarity: 'blue', total };
}
function result(s) {
  const scored = score(s);
  const observed = s.reasoningChars + s.textChars;
  if (scored.rarity === 'red' && observed >= 3000) return { rarity: 'red', tails: ['red', 'red', 'red'], stars: 6, centerStage: 'slam', finish: s.finish || 'stop', counts: s.counts, reasoningChars: s.reasoningChars, textChars: s.textChars, seed: s.generation, flavorText: '夯力过载，三舱全红！' };
  if (scored.rarity === 'red') return { rarity: 'red', tails: ['gold', 'red', 'gold'], stars: 5, centerStage: 'steady', finish: s.finish || 'stop', counts: s.counts, reasoningChars: s.reasoningChars, textChars: s.textChars, seed: s.generation, flavorText: '人物红，双侧金光落地。' };
  return { rarity: scored.rarity, tails: ['blue', 'gold', 'blue'], stars: 4, centerStage: 'pull', finish: s.finish || 'stop', counts: s.counts, reasoningChars: s.reasoningChars, textChars: s.textChars, seed: s.generation, flavorText: '人物金，双侧蓝色武器保底。' };
}
function visible(s) { return s ? { ok: true, sessionId: s.sessionId, generation: s.generation, phase: s.phase, reasoningChars: s.reasoningChars, textChars: s.textChars, counts: s.counts, provisionalRarity: score(s).rarity, finish: s.finish, result: s.result } : { ok: true, phase: 'idle', generation: 0, result: null }; }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:91-109](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/index.js#L91-L109)

内存状态与短尾部

<details>
<summary>查看原文（19行）</summary>

```text
  if (!sessionId) return { ok: false, error: 'sessionId-required' };
  const generation = (generations.get(sessionId) || 0) + 1;
  generations.set(sessionId, generation);
  active.set(sessionId, { sessionId, generation, phase: 'armed', reasoningChars: 0, textChars: 0, counts: counts(), tail: '', finish: null, result: null, updatedAt: stamp() });
  return { ok: true, generation, phase: 'armed' };
}
function getState(body) {
  const s = active.get(clean(body.sessionId));
  if (!s) return visible(null);
  const generation = Number(body.generation);
  if (generation && generation !== s.generation) return { ok: false, stale: true, generation, result: null };
  return visible(s);
}
function cancel(body) {
  const s = active.get(clean(body.sessionId));
  if (!s || s.generation !== Number(body.generation)) return { ok: true, stale: true };
  if (s.phase === 'armed' || s.phase === 'running') { s.phase = 'cancelled'; s.finish = 'aborted'; s.result = result(s); s.updatedAt = stamp(); }
  return { ok: true };
}
```

</details>

#### 缺口

- 浏览器映射的最终五档显示比例及真实输出分布未测
  **影响**：不宜从抽卡等级推断模型质量或精确概率
  **进一步探讨**：对固定样本标注信号重叠/分布，并核最终 UI 标签

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 部署与维护的主要代价是什么？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

需要 DSH Web 的 webServer、llm/stream、slots/useInput、定时 API；前端每 140ms 轮询本地 Host 状态，启用 Web Audio 生成 8 秒循环 BGM，可静音。Host 的 active/generations Map 在会话结束/关闭后不逐会话清理，直到插件卸载，长生命周期多会话可能累计状态；存储上无完整思维链落盘的源码路径。候选改进：过期会话清理、当前局 attempt 修复、Host/Client 等级文案对齐和轮询节流。资源曲线、安装可靠性及音频/无障碍体验未测，先作个人娱乐试用。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:43-61](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/README.zh.md#L43-L61)

作者安装路径

<details>
<summary>查看原文（19行）</summary>

````text
## 安装

### 方式一：DSH Profile 插件（推荐）

```bash
dsh plugin --profile web add @a9i5k4/dsh-draw-gacha
```

包内已声明 `dsh.bundle.patch`：`dsh plugin add` / dsh-market 安装时，插件行会由插件自带的 `cordis.patch.yml` 自动注入（Profile 的 `dsh.profile.bundles` 会包含该包），**无需**再手写下面这一行——重复添加会产生重复 loader entry。

只有手动 `link:` / 源码放置、且确认该包未进入 `dsh.profile.bundles` 时，才需要在 Profile 的 `cordis.patch.yml`（`$DSH_HOME/profiles/web/cordis.patch.yml`）补上插件行：

```yaml
- insert:
    - id: draw-gacha
      name: '@a9i5k4/dsh-draw-gacha'
```

重启 `dsh web` 即可。
````

</details>

**依据 2 · 源码核查**：[lib/client.js:862-920](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/client.js#L862-L920)

Web Audio 和状态管理

<details>
<summary>查看原文（59行）</summary>

```text
          const kickPhase = t % .5;
          const kick = kickPhase < .18 ? Math.sin(Math.PI * 2 * (48 + 96 * Math.exp(-32 * kickPhase)) * kickPhase) * Math.exp(-14 * kickPhase) * .34 : 0;
          seed = (seed * 1664525 + 1013904223) >>> 0;
          const noise = (seed / 4294967295) * 2 - 1;
          const snarePhase = (t + .5) % 1;
          const snare = snarePhase < .13 ? noise * Math.exp(-25 * snarePhase) * .16 : 0;
          const hatPhase = (t + .125) % .25;
          const hat = hatPhase < .035 ? noise * Math.exp(-90 * hatPhase) * .045 : 0;
          const pulse = Math.sin(Math.PI * 2 * 31 * t) * Math.exp(-beat * 6) * .045;
          const mix = bass + arp + pad + kick + snare + hat + pulse;
          const pan = (arpStep % 2 ? 1 : -1) * arp * .16;
          left[i] = Math.tanh(mix - pan) * .72;
          right[i] = Math.tanh(mix + pan) * .72;
        }
        return buffer;
      };
      const audioContext = () => {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        if (!MUSIC.context) MUSIC.context = new AudioContextClass();
        return MUSIC.context;
      };
      const startMusicLoop = () => {
        if (!MUSIC.enabled || MUSIC.source) return;
        const context = audioContext();
        if (!context) return;
        context.resume().catch(() => {});
        if (!MUSIC.buffer) MUSIC.buffer = createMusicBuffer(context);
        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = MUSIC.buffer;
        source.loop = true;
        gain.gain.setValueAtTime(.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(.13, context.currentTime + .24);
        source.connect(gain);
        gain.connect(context.destination);
        source.start();
        source.onended = () => { source.disconnect(); gain.disconnect(); };
        MUSIC.source = source;
        MUSIC.gain = gain;
      };
      const stopMusicLoop = () => {
        const source = MUSIC.source;
        const gain = MUSIC.gain;
        if (!source) return;
        MUSIC.source = null;
        MUSIC.gain = null;
        const now = MUSIC.context ? MUSIC.context.currentTime : 0;
        if (gain && MUSIC.context) {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(Math.max(.0001, gain.gain.value), now);
          gain.gain.exponentialRampToValueAtTime(.0001, now + .08);
        }
        try { source.stop(now + .09); } catch {}
      };
      const toggleMusic = () => { MUSIC.enabled = !MUSIC.enabled; if (MUSIC.enabled && state.overlay) startMusicLoop(); else stopMusicLoop(); notify(); };
      const pickFlavor = (rarity, seed) => { const pool = rarity === 'skip' ? FLAVOR.skip : rarity === 'error' ? FLAVOR.error : (raritySpec(rarity).flavor || FLAVOR[rarityId(rarity)] || FLAVOR.blue); return pool[Math.abs(seed || 0) % pool.length]; };
      const reset = () => { stopMusicLoop(); attemptSeq += 1; state.attempt = attemptSeq; state.overlay = false; state.locked = false; state.phase = 'hidden'; state.pull = 0; state.snapshot = null; state.signalElapsed = false; state.signalStarted = false; state.dataSufficient = false; state.modelFinished = false; state.flavor = ''; finishScheduled = false; notify(); };
      /* The close control keeps the original backend cancellation path; Skip deliberately bypasses it. */
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1058-1060](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/client.js#L1058-L1060)

140ms 轮询与清理

```text
      /* Keep the slot registration unchanged; only replace its visual implementation. */
      ctx.interval(poll, 140);
      ctx.effect(() => () => { style.remove(); reset(); listeners.clear(); });
```

**依据 4 · 源码核查**：[lib/index.js:89-109](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/index.js#L89-L109)

Map 状态

<details>
<summary>查看原文（21行）</summary>

```text
function start(body) {
  const sessionId = clean(body.sessionId);
  if (!sessionId) return { ok: false, error: 'sessionId-required' };
  const generation = (generations.get(sessionId) || 0) + 1;
  generations.set(sessionId, generation);
  active.set(sessionId, { sessionId, generation, phase: 'armed', reasoningChars: 0, textChars: 0, counts: counts(), tail: '', finish: null, result: null, updatedAt: stamp() });
  return { ok: true, generation, phase: 'armed' };
}
function getState(body) {
  const s = active.get(clean(body.sessionId));
  if (!s) return visible(null);
  const generation = Number(body.generation);
  if (generation && generation !== s.generation) return { ok: false, stale: true, generation, result: null };
  return visible(s);
}
function cancel(body) {
  const s = active.get(clean(body.sessionId));
  if (!s || s.generation !== Number(body.generation)) return { ok: true, stale: true };
  if (s.phase === 'armed' || s.phase === 'running') { s.phase = 'cancelled'; s.finish = 'aborted'; s.result = result(s); s.updatedAt = stamp(); }
  return { ok: true };
}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:141-148](https://github.com/Aik358/dsh-draw-gacha/blob/9fd81e6db10944b6fa339aeb731e2850e1627b9a/lib/index.js#L141-L148)

卸载清理

```text
    const disposers = routes.map((r) => ctx.webServer.register(r));
    return () => disposers.forEach((dispose) => dispose());
  }, 'draw-gacha: routes');
  // 消费方防御(2026-08-18): 先 await next() 再迭代——链下游任何监听器返回
  // Promise 或 async iterable 都能安全透传, 不再要求下游必须"普通函数返回流"。
  ctx.on('llm/stream', (options, next) => (async function* () { try { for await (const chunk of await next()) { observe(options, chunk); yield chunk; } } catch (e) { observe(options, { type: 'finish', reason: 'error' }); throw e; } })());
  ctx.effect(() => () => { active.clear(); generations.clear(); });
}
```

#### 缺口

- 长会话内存、CPU、音频兼容和安装成功率未测
  **影响**：不能给出明确成本/稳定性承诺
  **进一步探讨**：长会话压力、静音/减动效/安装矩阵验证

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
