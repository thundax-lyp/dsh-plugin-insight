# DSH 抖音助手

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7989640](https://github.com/LockyBee/dsh-douyin-agent/tree/7989640e340f0fd79e2de9874880d5197546e755)

<!-- BEGIN META -->
[![GitHub ★ 63](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=63&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LockyBee/dsh-douyin-agent) [![npm 30d 33,584](https://img.shields.io/static/v1?label=npm+30d&message=33%2C584&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-douyin-browser-local) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-douyin-browser-local)
<!-- END META -->

> **功能**：在专用 Edge 中自主观看抖音，记录兴趣，并按许可执行好友回复、分享及公开评论。

> **亮点**：从有限画面到模型决策再到浏览器动作的闭环接线实际存在，作品身份、新鲜观察、许可对象、预算和收据共同约束继续执行。相对固定滚动脚本增加决策与结果核对；Playwright和第三方分镜基础能力不算原创，兴趣或社交效果未实测。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：本人许可并不保证模型每条发言都符合本人意图。收据只到网页回读，页面变化、内容不合适和未知发送仍需人核对；观看预算也不是全天好友聊天的统一成本上限。当前不宜无看护开启互动。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 插件和独立客户端分别提供什么，观看循环是否真能继续执行工具？](#detail-section-11)
  - [Q02 · 评论、私信与分享如何获许可，未知发送如何处理？](#detail-section-12)
  - [Q03 · 相对人工刷视频，价值、依赖和总成本是什么？](#detail-section-13)
  - [Q04 · 谁可试用或应观察，哪个新假设值得验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望在本人专用抖音浏览器中进行人格化观看与有限许可互动的个人，源码提供持续观察、决策和工具动作循环。见 [Q01](#research-q01)。

比较人工刷视频与人工分享，以及简单定时滚动。当前材料不支持企业运营或客服自动化效果结论；独立软件任务对话只作为根包另一入口，不冒充本次完整核查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 观看工具 | 搜索、打开、播放与换片 | 专用Edge及真实作品状态，页面阻挡时停止 |
| 画面观察 | 对当前作品有限采样 | 不是完整视频或音轨理解 |
| 分镜精读入口 | 按已有样本读取指定格 | 与当前作品和缓存期限绑定，本文未全审实现 |
| 自主观看循环 | 模型连续选择停留、换片、搜索或停止 | 预算和时段门禁，旧作品决策丢弃 |
| 许可私信回复 | 对许可会话生成并发送 | 实际对外副作用，未知收据不重发 |
| 自主作品分享 | 向稳定许可对象发当前观察作品 | 同作品同对象去重，点击后未知暂停分享 |
| 公开评论 | 对当前作品生成有限文字评论 | 独立显式开关和尝试预算，规则过滤不等于内容保证 |
| douyin-open命令 | 打开专用窗口 | 不开始或延长观看轮次 |
| 用量及日报 | 从本机记录查看运行与观看结果 | 不等于已验证用户价值 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Windows、专用Edge与本人抖音登录 | 浏览必需 | 访问真实视频与消息 | 验证码/登录需本人处理，不能自动绕过 |
| 兼容DSH、支持图片的模型及附件服务 | 插件决策必需 | 把真实画面交给当前模型 | 缺图像能力拒绝自主观看 |
| 允许时段与每日观看/请求预算 | 观看必需 | 限制后台运行 | 额度可设不限，不能当统一成本保证 |
| 本人许可会话、稳定分享身份 | 社交动作必需 | 绑定收件对象与发送目标 | 未许可不应发送，弱兼容许可另有边界 |
| 可选音频模型或本地转写 | 音轨理解时必需 | 补足有限画面以外信息 | 未启用不等于已听完整片，当前路径未全审 |
| 完整本机锁、预算与收据记录 | 恢复必需 | 避免重复动作 | 损坏或未知不清空重置，应保留人工核对 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 本人登录专用Edge并配置图像模型 | 身份与模型明确，验证码本人处理 |
| 有界观看 | 用户先空许可名单、关评论、设有限预算 | 采样视频ID与播放推进可核，换片或预算异常就停 |
| 自主循环 | 模型据真实采样决策，控制器回读后执行 | 作品变化丢弃旧决策，连续无效决策停止 |
| 互动验收 | 另获同意后对测试会话核许可与收据 | 已点击未知不重发，保留记录回读；无收据人工核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器、图像模型与可选音频资源 | 登录、配置、许可身份与预算核查 | 金额及时间未测 |
| 持续使用 | 图像请求、全天许可聊天、可选音频和内存 | 内容、兴趣与收据复核 | 观看额度不覆盖所有聊天次数 |
| 失败恢复 | 未决任务、日志和收据保留 | 页面变化、登录与未知发送核对 | 不可删除锁/账本假称恢复 |
| 退出 | 保留必要本机状态 | 关闭观看与互动，核平台已发送消息 | 关闭应用不会撤回已发送内容 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自主执行 | 源码有观察/模型/动作/继续循环 | 真实平台当前可用与长期稳定 |
| 目标核对 | 模型等待后回读作品，点击前核收件人 | 页面变化下误识别率 |
| 重复发送控制 | 持久去重、单次点击与未知不重发 | 全故障组合及收件人实际接受 |
| 个性化与互动 | 基于观看行为记录兴趣 | 本人偏好准确性、有用互动和净成本 |

无合格有用互动数与全部费用/人工记录，不计算单位成本。

> **思考**：本人许可并不保证模型每条发言都符合本人意图。收据只到网页回读，页面变化、内容不合适和未知发送仍需人核对；观看预算也不是全天好友聊天的统一成本上限。当前不宜无看护开启互动。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：从有限画面到模型决策再到浏览器动作的闭环接线实际存在，作品身份、新鲜观察、许可对象、预算和收据共同约束继续执行。相对固定滚动脚本增加决策与结果核对；Playwright和第三方分镜基础能力不算原创，兴趣或社交效果未实测。见 [Q01](#research-q01)、[Q03](#research-q03)。

观察证据和作品ID绑定、最终点击前重核授权、发送收据与结果未知分离，提供浏览器Agent可靠性的具体设计参考。它们仍依赖DOM识别和本地记录，不等于平台API送达或内容质量验收。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

本人许可并不保证模型每条发言都符合本人意图。收据只到网页回读，页面变化、内容不合适和未知发送仍需人核对；观看预算也不是全天好友聊天的统一成本上限。当前不宜无看护开启互动。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察；先只在有限额度、空许可名单和关闭评论的非敏感账号核观看循环，真实发送另需双方同意。未知收据和身份异常即停，保留本机记录，回人工浏览与发送。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码级自主工具循环、许可身份和部分真实浏览器点击/回读链路，未执行目标程序或任何社交动作。作者自述平台结果不当本轮独立验收；采用结论为观察，建议队列为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh-plugin.mjs、native-watch-decision.mjs、autonomous-watch.mjs、core.mjs、autonomous-share.mjs、autonomous-comments.mjs、contact-authorization.mjs、outbound-send.mjs、chat-service.mjs、chat-browser.mjs、video-limits.mjs、task-limits.mjs、group-reply-trigger.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：主查DSH插件入口、图像决策、观看循环、预算、分享/私信许可与最终浏览器点击回读。未全审独立桌面任务循环、公开评论浏览器实现、音频服务、所有记忆合并和平台DOM识别；没有发任何消息或运行账号。
- 下一步：先对小额观看核作品ID/推进/预算与旧决策拒绝，再在另获双方同意的测试会话检查撤权、同名对象和点击后断线的不重发；关键内容与长期收益需独立测量。本轮全部未执行。

**分析版本**

- **仓库**：[LockyBee/dsh-douyin-agent](https://github.com/LockyBee/dsh-douyin-agent)
- **版本号**：1.4.6（[固定提交 7989640](https://github.com/LockyBee/dsh-douyin-agent/tree/7989640e340f0fd79e2de9874880d5197546e755)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可从未知分享暂停而观看继续的分离设计试验待发建议队列，让模型保留作品证据与收件人理由，用户逐项审阅后再放行。与现有许可后自动发送对照本人认可率、误对象/不合适内容、审阅时间和有效互动；若大多建议被否决或负担高于人工分享，缩小或放弃。方案未实现，需求与商业意愿未证。见 [Q04](#research-q04)。

先对小额观看核作品ID/推进/预算与旧决策拒绝，再在另获双方同意的测试会话检查撤权、同名对象和点击后断线的不重发；关键内容与长期收益需独立测量。本轮全部未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 77 | 14527 | 13932 | 350 | — |
| .md | source | 52 | 2535 | — | — | 78757 |
| .js | source | 3 | 329 | 310 | 13 | — |
| .cjs | source | 2 | 36 | 36 | 0 | — |
| .mjs | test | 143 | 18503 | 17009 | 664 | — |
| .jsx | source | 9 | 826 | 785 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/LockyBee/dsh-douyin-agent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=21&color=737b86&logo=github)](https://github.com/LockyBee/dsh-douyin-agent/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/LockyBee/dsh-douyin-agent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：自主观看和社交动作如何由模型决策执行，许可、预算与发送核对约束到哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件和独立客户端分别提供什么，观看循环是否真能继续执行工具？

**研究主题**：场景与需求、功能与机制

#### 完整回答

项目把本人许可下的抖音观看、兴趣记录、好友回复和分享组织为本地助手。根包包含DSH原生插件，也有独立软件入口；本轮重点检查插件接入及它复用的观看/发送服务，未把独立桌面任务聊天全部当作已核查。目标人群是愿意把自己的专用浏览器、模型和人格配置交给助手的个人，当前材料不证明商家运营需求或客服价值。

从源码看，它存在实际的模型观察—决策—动作—再观察循环，不只是固定编排或工具清单。dsh-plugin构造AutonomousWatch，决策provider复用DSH当前模型与附件服务；模型不支持图片或附件保存失败会拒绝。run先读取当前视频并采样，预留一次模型预算，调用decideWatch，再解析动作。模型等待后重新读取页面，作品改变就丢弃旧决策；skip调用下一条，search调用搜索和打开，stay等待后回读，comment和share进入各自服务，循环再继续，stop才结束。core把工具动作接到真实视频播放和截图实现。

这足以确认自主执行链路的源码接线，不能证明当前抖音页面和目标宿主已经连续工作。画面是有限采样，看到一格不等于看完整段，也不代表听懂音轨。合格结果至少要求操作仍针对同一作品、实际播放有推进、预算未被突破；长期兴趣是否真代表用户偏好还需要效果证据。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin.mjs:194-219](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/dsh-plugin.mjs#L194-L219)

插件为AutonomousWatch提供DSH模型决策与好友服务，实际连线。

<details>
<summary>查看原文（26行）</summary>

```text
  const getWatch=async(exec,starting)=>{
    if (!watchPromise) watchPromise=Promise.all([getController(),import('./autonomous-watch.mjs?v=18')]).then(async ([controller,{AutonomousWatch}])=>{
      if(starting) sharedPersona.initialize({importLegacy:false});
      const route=exec.agent?.session?.requestHeader?.()?.config ?? exec.agent?.options ?? {};
      return new AutonomousWatch({controller,videoLimits:controller.limits(),personaMemory:sharedPersona,commentService:await controller.getComments(),reportService:await controller.getReport(),source:'dsh',config:{apiKey:'',baseUrl:'https://api.deepseek.com',model:route.model||'deepseek-flash'},...(starting?{decisionProvider:createNativeWatchDecision({llm:optionalService(ctx,'llm'),attachments:optionalService(ctx,'attachments'),agent:exec.agent})}:{})});
    }).catch(error=>{watchPromise=undefined;throw error;});
    const watch=await watchPromise;
    if(starting) {
      if(watch.state().worker?.alive) throw new Error('已有自主观看在运行，请先停止。');
      const route = exec.agent?.session?.requestHeader?.()?.config ?? exec.agent?.options ?? {};
      watch.config.model = route.model || 'deepseek-flash';
      watch.agent.config.model = watch.config.model;
      watch.decisionProvider=createNativeWatchDecision({llm:optionalService(ctx,'llm'),attachments:optionalService(ctx,'attachments'),agent:exec.agent});
      sharedPersona.initialize({importLegacy:false});
    }
    return watch;
  };
  const getSpark = async (exec, starting) => {
    if(starting)throw new Error('自动续火花功能已移除。');
    const spark = await (await getController()).getSparkService();
    if (spark.agent) { spark.agent.usageLedger = new UsageLedger({ stateDir: (await getController()).limits().stateDir }); spark.agent.source = 'dsh'; if (starting) spark.agent.config.model = (exec.agent?.session?.requestHeader?.()?.config ?? exec.agent?.options ?? {}).model || 'deepseek-flash'; }
    if (starting && !spark.running && !spark.starting && !spark.busy) spark.setGreetingProvider(createNativeSparkGreeting({ llm: optionalService(ctx, 'llm'), agent: exec.agent }));
    return spark;
  };
  const watchSchedule = new ScheduledWatch({ source:'dsh', getVideoLimits: async () => (await getController()).limits(), getWatchState: async () => (await getWatch(settingsExec(),false)).state(), stopWatch:async()=> (await getWatch(settingsExec(),false)).stop({explicit:true}), startRound: async ({signal}) => { const watch=await getWatch(settingsExec(true),true); signal.throwIfAborted(); return watch.start({startSession:true},{explicit:true}); } });
  const friendInteractions=new FriendInteractions({getChat:async()=>(await getController()).getChatService(),getShare:async()=>(await getWatch(settingsExec(),false)).getShareService(),getSpark:async()=>(await getController()).getSparkService(),modelReady:()=>modelSettings.state().configured,startChat:async(chat,{signal})=>{chat.agent.config.model=modelSettings.state().model;chat.setReplyProvider(request=>{chat.agent.config.model=modelSettings.state().model;return createNativeWatchDecision({llm:optionalService(ctx,'llm'),attachments:optionalService(ctx,'attachments'),agent:settingsExec(true).agent,maxTokens:512})(request);});return chat.start({schedule:true,signal});}});
```

</details>

**依据 2 · 源码核查**：[native-watch-decision.mjs:6-18](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/native-watch-decision.mjs#L6-L18)

决策解析当前宿主路由并要求图像及附件服务。

<details>
<summary>查看原文（13行）</summary>

```text
export function createNativeWatchDecision({ llm, attachments, agent, maxTokens = 1200 }) {
  if (!Number.isSafeInteger(maxTokens) || maxTokens < 1 || maxTokens > 1200) throw new Error('原生模型生成上限须在1至1200之间。');
  const header = agent?.session?.requestHeader?.()?.config;
  const provider = header?.provider ?? agent?.options?.provider;
  const model = header?.model ?? agent?.options?.model;
  if (!provider || !model || typeof llm?.stream !== 'function' || typeof llm?.resolveModelInfo !== 'function') throw new Error('当前 DSH 未提供可核实的模型路由，不能启动自主观看。');
  return async function decide({ system, messages, signal }) {
    signal?.throwIfAborted();
    const info = await llm.resolveModelInfo(provider, model, signal);
    const shortReplyControls = Array.isArray(info?.reasoning?.efforts) && info.reasoning.efforts.some(effort => effort.id === 'off') ? { reasoningEffort: 'off' } : {};
    const hasImages = messages.some(message => Array.isArray(message.content) && message.content.some(part => part.type === 'image_url'));
    if (hasImages && (!info?.inputModalities?.includes('image') || typeof attachments?.saveImages !== 'function')) throw new Error('当前 DSH 模型或附件服务不能接收实际视频画面，已停止自主观看。');
    const converted = [];
```

</details>

**依据 3 · 源码核查**：[native-watch-decision.mjs:38-52](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/native-watch-decision.mjs#L38-L52)

真实llm.stream消费并要求完整stop终态，不完整不执行。

<details>
<summary>查看原文（15行）</summary>

```text
    let text = '', finish, usage = {}; const deltaIndexes=new Set();
    for await (const chunk of llm.stream({provider,model,messages:converted,system,maxTokens,...shortReplyControls,signal,sessionId:agent.session.id})) {
      signal?.throwIfAborted();
      if (chunk.type === 'text-delta') {
        deltaIndexes.add(chunk.index);
        text += chunk.text;
        if (text.length > 12_000) throw new Error('自主观看决策超过长度上限。');
      }
      if(chunk.type==='block-end'&&chunk.block?.type==='text'&&!deltaIndexes.has(chunk.index))text+=chunk.block.text;
      if(text.length>12_000)throw new Error('自主观看决策超过长度上限。');
      if (chunk.type === 'usage') usage = { ...chunk.usage, prompt_tokens: chunk.usage.inputTokens ?? null, completion_tokens: chunk.usage.outputTokens ?? null, total_tokens: chunk.usage.totalTokens ?? (Number.isSafeInteger(chunk.usage.inputTokens) && Number.isSafeInteger(chunk.usage.outputTokens) ? chunk.usage.inputTokens + chunk.usage.outputTokens : null) };
      if (chunk.type === 'finish') finish = chunk.reason;
    }
    if (finish?.kind !== 'stop' || !text.trim()) throw Object.assign(new Error(`DSH 自主观看决策未完整返回（${finish?.kind || '缺少完成标记'}），未执行动作。`), { usage, code:'WATCH_DECISION_INCOMPLETE' });
    return {text,usage};
```

</details>

**依据 4 · 源码核查**：[autonomous-watch.mjs:290-325](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/autonomous-watch.mjs#L290-L325)

循环采样、预算、模型决策与新鲜状态回读。

<details>
<summary>查看原文（36行）</summary>

```text
      while (true) {
        this.assertAllowed();
        const options=this.optionsService.state().policy;
        current = await this.skipLivePreviews(current);
        if ((current.state || current).video?.paused !== false) current = await this.execute('douyin_play');
        if (isLivePreview(current.state || current)) continue;
        const sampleStartedAt = this.now();
        this.phase='observing';this.save({phase:this.phase,pendingRequests:0});
        let observation = await this.execute('douyin_observe', { seconds: WATCH_LIMITS.sampleSeconds });
        const observedAt = this.now(), observedState = observation.state || observation;
        if (isLivePreview(observedState)) { current = observation; continue; }
        watchDecisionMessages(observation);
        this.liveSkipStreak = 0;
        const title = String(observedState.video?.title || '');
        if (options.exclude.some(word => title.toLocaleLowerCase().includes(word.toLocaleLowerCase()))) { current = await this.execute('douyin_next'); continue; }
        const evidenceId = observation.personaEvidenceId || observation.state?.personaEvidenceId || this.personaMemory.recordObservation(observation, { source: this.source, kind: 'visual' }).evidenceId;
        let viewing = observation.viewing;
        if (viewing) {
          if (viewing.evidenceId !== evidenceId || viewing.videoId !== observedState.video.id || typeof viewing.sampleId !== 'string' || typeof viewing.accepted !== 'boolean') throw failure('本次观看回执与作品观察不一致，没有写入兴趣。');
        } else viewing = this.viewing(evidenceId, current, observation, sampleStartedAt, `watch:${this.runId}:observe:${randomUUID()}`);
        observation = { ...observation, ...(viewing ? { viewing } : {}) };
        const shareContext = this.shareContext(observedState.video.id), commentContext = this.commentContext();
        const processedRecipients = Array.isArray(shareContext.processedRecipients) ? shareContext.processedRecipients.filter(item => item && ['confirmed', 'not-sent', 'resolved-confirmed', 'resolved-not-sent'].includes(item.status) && shareContext.recipients?.some(recipient => recipient.id === item.recipientId)).map(({ recipientId, status }) => ({ recipientId, status })) : [];
        const context = this.personaMemory.context() + (processedRecipients.length ? '\n\n当前作品分享去重摘要（宿主收据资料，不是聊天正文）：' + JSON.stringify({ videoId: observedState.video.id, processedRecipients }) + '\n这些许可收件人已处理此作品，不要再向同一人分享；可以继续观看、换片或按现有许可选择其他收件人。' : '');
        this.phase='model';this.pendingRequests=1;this.save({phase:this.phase,pendingRequests:1});let result,decisionError;
        try{this.reserveRequest();result=await this.agent.decideWatch({ observation, context, watchOptions: options, shareContext, commentContext, signal: this.abort.signal, decisionProvider: this.decisionProvider });}
        catch(error){if(!['WATCH_DECISION_FORMAT','WATCH_DECISION_INCOMPLETE'].includes(error?.code))throw error;decisionError=error;}
        finally{this.pendingRequests=0;this.phase='waiting';this.save({phase:this.phase,pendingRequests:0});}
        this.assertAllowed();
        if(decisionError){current=await this.recoverDecision(decisionError);continue;}
        let decision;try{decision=redact(parseWatchDecision(result.decision,{shareContext:this.shareContext(),commentContext:this.commentContext()}),[this.config.apiKey]);}catch(error){current=await this.recoverDecision(error);continue;}
        this.invalidDecisionStreak=0;this.save({decisionRetry:null});
        current = await this.execute('douyin_status');
        if (decision.action !== 'stop') current = await this.readyAfterModel(current);
        const freshState = current.state || current, freshAt = this.now(), modelWaitSeconds = (freshAt - observedAt) / 1000;
        if (decision.action !== 'stop' && freshState.video?.id !== observedState.video.id) {
```

</details>

**依据 5 · 源码核查**：[autonomous-watch.mjs:325-329](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/autonomous-watch.mjs#L325-L329)

作品变化放弃旧画面决策。

```text
        if (decision.action !== 'stop' && freshState.video?.id !== observedState.video.id) {
          if (!readyVideo(freshState) || freshState.video.paused !== false) throw failure('模型等待后作品已变化，但新作品尚未就绪或已暂停，未执行旧决策。', 'needs_user');
          this.save({ lastDecision: null, usage: result.usage });
          this.onEvent({ type: 'watch.decision-discarded', action: decision.action, reasonCode: 'observed-video-changed', expectedVideoId: observedState.video.id, currentVideoId: freshState.video.id, message: '作品已变化，放弃旧画面的决策并重新观察当前作品。' });
          continue;
```

**依据 6 · 源码核查**：[autonomous-watch.mjs:345-386](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/autonomous-watch.mjs#L345-L386)

根据动作实际执行浏览器、评论、分享或停留。

<details>
<summary>查看原文（42行）</summary>

```text
        if (decision.action === 'stop') break;
        let learned = false;
        if (decision.action === 'skip') {
          const switchStartedAt = this.now();
          current = await this.execute('douyin_next', {}, { expectedVideoId: observedState.video.id });
          if (current?.staleObservation || current?.reasonCode === 'observed-video-changed') {
            const latest = current.state;
            if (current.changed !== false || current.staleObservation !== true || current.reasonCode !== 'observed-video-changed' || current.expectedVideoId !== observedState.video.id || !readyVideo(latest) || latest.video.id === observedState.video.id || latest.video.paused !== false) throw failure('换片前作品变化的回执无法核对，未继续操作或学习。', 'needs_user');
            this.onEvent({ type: 'watch.decision-discarded', action: 'skip', reasonCode: 'observed-video-changed', expectedVideoId: observedState.video.id, currentVideoId: latest.video.id, message: '输入前作品已变化，未执行换片，重新观察当前作品。' });
            continue;
          }
          current = await this.skipLivePreviews(current);
          if (current.changed === false || !readyVideo(current.state || current) || (current.state || current).video.id === observedState.video.id) {
            const reasonCode = current.reasonCode || (!readyVideo(current.state || current) ? 'autonomous-switch-not-ready' : (current.state || current).video.id === observedState.video.id ? 'autonomous-switch-same-id' : 'autonomous-switch-changed-false');
            this.recordSwitchFailure('douyin_next',{...current,before:current.before||observedState.video,reasonCode},{startedAt:switchStartedAt,expectedVideoId:observedState.video.id,stage:'autonomous-verification'});
            throw failure('未确认切换到另一条就绪作品，已停止自主观看。');
          }
          if (gapTrusted && (viewing?.accepted === true || waited?.accepted === true)) learned = this.behavior(evidenceId, 'skip')?.accepted === true;
        } else if (decision.action === 'search') {
          const found = await this.execute('douyin_search', { query: decision.query });
          const first = (found.state || found).searchResults?.find(item => Number.isSafeInteger(item.index) && item.index >= 0);
          if (!first) throw failure('搜索没有返回可核对的作品，已停止自主观看。');
          current = await this.execute('douyin_open_video', { index: first.index });
        } else if (decision.action === 'comment') {
          if (freshState.video?.id !== observedState.video.id) throw failure('评论前作品已变化，未发布评论。', 'needs_user');
          this.phase='comment-model';this.pendingRequests=1;this.save({phase:this.phase,pendingRequests:1});let generated;
          try{this.reserveRequest();generated=await this.commentAgent.generate({ observation, signal: this.abort.signal, decisionProvider: this.decisionProvider });}
          finally{this.pendingRequests=0;this.phase='waiting';this.save({phase:this.phase,pendingRequests:0});}
          this.assertAllowed();
          if (generated.text !== null) {
            const delivery = await this.getCommentService().comment({ evidenceId, videoId: observedState.video.id, text: generated.text }, { signal: this.abort.signal, watchRunId: this.runId });
            this.onEvent({ type: 'watch.comment', delivery, usage: generated.usage });
            if (delivery?.deliveryUncertain) throw failure('评论发布结果未确认，请在抖音核对，已停止自主观看。', 'needs_user');
            if (delivery?.confirmed !== true) throw failure(delivery?.reason || '没有确认公开评论发布成功。', 'needs_user');
          }
        } else if (decision.action === 'share') {
          learned=await this.shareDecision(decision,{evidenceId,videoId:observedState.video.id});
        } else if (decision.action === 'stay') {
          const stayBefore = current, beforeState = freshState;
          if (beforeState.video?.id !== observedState.video.id || beforeState.video.paused !== false) throw failure('停留前作品或播放状态已变化，已停止自主观看，没有学习本次停留。', 'needs_user');
          const stayStartedAt = freshAt;
          this.phase='waiting';this.save({phase:this.phase,pendingRequests:0});await this.delayImpl(decision.seconds * 1000, this.abort.signal); this.assertAllowed();
```

</details>

**依据 7 · 源码核查**：[core.mjs:804-818](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/core.mjs#L804-L818)

控制器执行真实play/pause、capture与作品ID检查。

<details>
<summary>查看原文（15行）</summary>

```text
        if (name==='douyin_next'||name==='douyin_previous') return await this.switchVideo(name==='douyin_next'?1:-1,signal,{recordLearning:!autonomousRunId,expectedVideoId});
        if (name==='douyin_play'||name==='douyin_pause') {
          await (await this.currentVideo()).evaluate(async(video, play)=>{ if(play) await video.play();else video.pause(); },name==='douyin_play');
          if (name==='douyin_play') await wait(600,signal);
        }
        if (name==='douyin_observe'||name==='douyin_screenshot') {
          const result=await this.capture(name==='douyin_observe'?args.seconds??3:0,signal,{recordLearning:!autonomousRunId,sharedCaptureMode});
          if(sharedCaptureMode===undefined){this.storyboardFrames??=new StoryboardFrameStore();try{const id=this.storyboardFrames.remember(result);if(id)result.storyboardSampleId=id;}catch{this.storyboardFrames.clear();}}
          return result;
        }
        if(name==='douyin_video_zoom'){
          const state=await this.state({record:false});
          if(state.loginRequired||state.verificationRequired||state.privateChatVisible||state.unsupportedPage||state.videoSelection?.identityConflict||state.livePreview?.recognized||state.video?.id!==args.videoId)throw Error('当前页面或作品与原分镜不一致，未返回旧画面。');
          if(!this.storyboardFrames)throw Error('没有本入口的原分镜，请先观察当前作品。');
          return{state,...this.storyboardFrames.zoom(args)};
```

</details>

#### 缺口

- 连续观看和兴趣效果没有本轮真实平台结果。
  **影响**：不能把源码循环写成稳定在线Agent或个人偏好已学习准确。
  **进一步探讨**：固定小额度观看任务，核每次视频ID、播放推进、拒绝旧决策和预算账本，再由本人评估兴趣是否符合预期。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 评论、私信与分享如何获许可，未知发送如何处理？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

项目把“本人允许自动动作”与“每次动作目标仍一致”分开。分享要求许可收件人具有稳定会话身份、当前入口的真实作品观察、开启的好友总开关、有效观看会话和本进程运行ID；同作品同收件人已有处理记录会跳过。最终点击前再次核对授权，写clicking状态并限制一次点击。联系人兼容逻辑仍支持手动或旧许可，不能把所有路径都描述为相同强度的平台稳定身份；分享有额外稳定身份要求，私信则按实际授权类型匹配。

私信生成后再读取会话和消息水位，核原消息未变化、联系人许可仍在，进入共同发送锁。浏览器发送前核目标绑定和按钮几何位置，实际只点击一次；之后在同一会话读取新发出消息，匹配正文、新尾部身份与非失败状态后才返回confirmed。点击后未确认会变为delivery-uncertain，保留记录并不自动重发；确认收到但本地收据落盘失败也不得再发。这里的确认来自网页回读，不是独立收件人回执或官方服务端API保证。

公开评论是另一开关及独立每日/每轮尝试预算，文本过滤拒绝部分联系方式、私人信息、虚构经历和承诺；规则过滤不能证明内容一定合适或不会泄漏。开启许可后，模型能生成并发送，源码没有要求每条再经本人确认。故研究不执行任何登录、发送、评论或分享。授权名单、未知状态和对外内容质量共同决定可用性，不能因有锁和去重就称为已安全运行。

#### 证据与依据

**依据 1 · 源码核查**：[autonomous-share.mjs:121-139](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/autonomous-share.mjs#L121-L139)

分享逐次核总开关、许可稳定身份、作品证据和当前运行。

<details>
<summary>查看原文（19行）</summary>

```text
  allowed(input, { signal, watchRunId, operationId, sessionId } = {}) {
    signal?.throwIfAborted();
    if (this.closed) throw fail('此入口已关闭，停止自主分享。');
    if(!readFriendInteractionsEnabled(this.stateDir))throw fail('好友互动总开关已关闭，未继续自主分享。');
    const policy = this.policy(), ledger = this.ledger();
    if (!policy.enabled) throw fail('自主分享尚未启用。');
    if (this.unresolved(ledger, operationId).length) throw fail('存在未确认的自主分享，已暂停后续发送。');
    const own = operationId && ledger.operations.find(item => item.operationId === operationId);
    if (own && own.day !== day(this.now())) throw fail('已跨过上海日期，本次预留不转移到新一天，未继续分享。');
    if (!this.shareableRecipients().some(item => item.id === input.recipientId)) throw fail('收件人没有可用于原生作品卡片的稳定身份，未继续分享。', 403);
    this.evidence(input);
    const time = this.videoLimits.state();
    if (!time.allowed || time.session&&time.session.status!=='active' || sessionId && time.session?.id !== sessionId) throw fail(time.reason || '内部观看运行已结束或改变，停止自主分享。');
    const worker = read(path.join(this.stateDir, 'watch-loop.lock'), null);
    if (worker) {
      if (!alive(worker.pid) || !watchRunId || worker.runId !== watchRunId || worker.source !== this.source || worker.pid !== process.pid || worker.sessionId !== time.session?.id) throw fail('自主分享与当前共享观看入口或轮次不一致。');
    } else if (watchRunId) throw fail('原自主观看已停止，未继续分享。');
    const stopRequest = read(path.join(this.stateDir, 'watch-stop.request.json'), null);
    if (watchRunId && stopRequest?.runId === watchRunId) throw fail('用户已停止自主观看，停止分享。');
```

</details>

**依据 2 · 源码核查**：[autonomous-share.mjs:157-195](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/autonomous-share.mjs#L157-L195)

永久去重、预留、单次点击授权和确认/未知状态区分。

<details>
<summary>查看原文（39行）</summary>

```text
      const skipped = this.control(() => {
        const time = this.allowed(input, { signal: combined, watchRunId }); sessionId = time.session?.id;
        const ledger = this.ledger();
        const previous = ledger.operations.find(item => item.recipientId === input.recipientId && item.videoId === input.videoId);
        if (previous) {
          if (!processedStatuses.has(previous.status)) throw fail('同一作品对这位好友的分享收据尚未确认，未继续处理。');
          return { status: 'skipped', code: 'SHARE_ALREADY_PROCESSED', skipped: true, confirmed: false, deliveryUncertain: false, videoId: input.videoId, recipientId: input.recipientId, previousStatus: previous.status, reason: '同一作品已为此许可会话处理过，本次跳过分享，继续观看。' };
        }
        const date = day(this.now()); ledger.days[date] = (ledger.days[date] || 0) + 1;
        ledger.operations.push({ operationId, evidenceId: input.evidenceId, videoId: input.videoId, recipientId: input.recipientId, reason: input.reason || '', day: date, source: this.source, pid: process.pid, sessionId, status: 'reserved', startedAt: new Date(this.now()).toISOString() });
        write(this.files.ledger, ledger); reserved = true;
      });
      if (skipped) return skipped;
      const authorize = ({ phase, videoId, recipientId } = {}) => {
        if (finished || recipientId !== input.recipientId || videoId !== input.videoId || !['prepare', 'monitor', 'before-click'].includes(phase)) throw fail('可信分享授权与当前作品或收件人不一致。');
        this.allowed(input, { signal: combined, watchRunId, operationId, sessionId });
        if (phase === 'before-click') { if (clicked) throw fail('这项分享已授权一次点击，未再次发送。'); this.update(operationId, { status: 'clicking' }); clicked = true; }
        return true;
      };
      // 最终短输入与设置写入互斥；设置若遇到此阶段会明确返回忙，不能先报关闭成功再发送。
      authorize.beginDispatch = () => {
        if (finished || !clicked || releaseDispatch) throw fail('当前分享未获得一次有效的最终输入授权。');
        const release = this.acquireControl();let releaseInteractions;
        try { releaseInteractions=acquireFriendInteractionDispatch(this.stateDir);this.allowed(input, { signal: combined, watchRunId, operationId, sessionId }); }
        catch (error) { releaseInteractions?.();release(); throw error; }
        releaseDispatch = ()=>{try{releaseInteractions();}finally{release();}};
        return () => { releaseDispatch?.(); releaseDispatch = null; };
      };
      let send = this.send;
      if (!send) {
        const forwarder = await (this.getForwarder ? this.getForwarder() : this.controller?.getForwarder?.());
        if (!forwarder?.forwardAutonomous) throw fail('当前转发器尚未提供可信自主分享入口。');
        send = forwarder.forwardAutonomous.bind(forwarder);
      }
      const result = await send({ recipientId: input.recipientId, expectedVideoId: input.videoId }, { signal: combined, authorize, autonomousRunId: watchRunId });
      const confirmed = clicked && result?.confirmed === true && result.deliveryType === 'native-card' && result.videoId === input.videoId && typeof result.messageId === 'string' && !!result.messageId;
      const uncertain = !confirmed && (clicked || result?.deliveryUncertain === true || result?.confirmed === true);
      const failure = !confirmed ? failureOf(result?.failure || { code: uncertain ? 'SHARE_DELIVERY_UNCERTAIN' : 'SHARE_NOT_SENT', stage: uncertain ? 'receipt' : 'send', message: result?.reason || (uncertain ? '分享结果未确认，请核对收据。' : '没有发出可核对的作品卡片。') }) : null;
      this.update(operationId, { status: confirmed ? 'confirmed' : uncertain ? 'uncertain' : 'not-sent', completedAt: new Date(this.now()).toISOString(), ...(typeof result?.operationId === 'string' ? { forwardOperationId: result.operationId } : {}), ...(confirmed ? { messageId: result.messageId } : { failure }) });
```

</details>

**依据 3 · 源码核查**：[contact-authorization.mjs:23-44](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/contact-authorization.mjs#L23-L44)

兼容手动和旧许可，不能统称全部强稳定身份。

<details>
<summary>查看原文（22行）</summary>

```text
export function isStoredContactAuthorized(value) {
  if (!conversation(value) || typeof value.verifiedAt !== 'string' || !Number.isFinite(Date.parse(value.verifiedAt))) return false;
  if (['identityVersion', 'identityKind', 'identityHash'].some(key => value[key] !== undefined) && !hasStableConversationIdentity(value)) return false;
  if (value.authorizationKind === 'manual') return true;
  if (value.authorizationKind === 'existing-group') return value.isGroup === true && canAuthorizeConversation(value);
  if (value.authorizationKind === 'existing-conversation') return value.isGroup === false && canAuthorizeConversation(value);
  return value.isGroup === false && value.followed === true && (value.authorizationKind === undefined || value.authorizationKind === 'following');
}

export function matchesAuthorizedContact(stored, current) {
  if (!isStoredContactAuthorized(stored) || !conversation(current) || current.id !== stored.id || current.isGroup !== stored.isGroup) return false;
  if (stored.authorizationKind === 'manual') return true;
  if (hasStableConversationIdentity(stored)) return hasStableConversationIdentity(current) && current.identityKind === stored.identityKind && current.identityHash === stored.identityHash && current.identityBinding === stored.identityBinding && (['existing-conversation', 'existing-group'].includes(stored.authorizationKind) || current.followed === true);
  if (stored.identityVersion !== undefined) return false;
  if (['existing-conversation', 'existing-group'].includes(stored.authorizationKind)) {
    if (hasStableConversationIdentity(current)) return true;
    return nameOf(current) === nameOf(stored) && hasVerifiedConversationIdentity(current) && current.identityBinding === stored.identityBinding;
  }
  if (hasStableConversationIdentity(current)) return false;
  if (nameOf(current) !== nameOf(stored)) return false;
  if (current.followed !== true) return false;
  return !stored.identityBinding || hasVerifiedConversationIdentity(current) && current.identityBinding === stored.identityBinding;
```

</details>

**依据 4 · 源码核查**：[chat-service.mjs:805-836](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/chat-service.mjs#L805-L836)

发送前重读会话、水位和许可，再调用浏览器发送。

<details>
<summary>查看原文（32行）</summary>

```text
      delivery = await this.outbound.run({ recipientId: contact.id, purpose: 'reply', signal }, async () => {
        signal.throwIfAborted(); this.assertOwned();
        const currentPolicy = validatePolicy(load(this.policyFile, this.policy));
        const authorized = currentPolicy.allowlist.find(item => item.id === contact.id);
        if(!readFriendInteractionsEnabled(this.stateDir))throw revokeError(this.stateDir);
        if (!currentPolicy.enabled || !matchesAuthorizedContact(contact, authorized)) throw new Error('回复许可或会话绑定已变化，未发送。');
        if(backlog){const disk=load(this.watermarkFile,this.watermarks).contacts?.[contact.id];if(disk?.autoBacklog?.key!==mark.autoBacklog?.key||mark.autoBacklog.archiveIds.some(id=>!disk.unanswered?.some(item=>item.archiveId===id&&isOpenBacklogRecord(item)&&!['reserved','uncertain'].includes(item.autoAttempt?.state))))return {confirmed:false,deliveryUncertain:false,superseded:true};}
        const current = await this.browser.readConversation(contact.id, { allowed: true, signal, weak: ['manual', 'existing-conversation', 'existing-group'].includes(contact.authorizationKind), backgroundOnly: true });
        const messages = messagesOf(current);
        assertConversationSnapshot(contact, current);
        if (!compareMessageWatermark(expectedWatermark, messages, current).matches) {
          if (!backlog) this.queueSuperseded(contact, mark, mark.pending?.incoming || [], messages); this.persist();
          return { confirmed: false, deliveryUncertain: false, superseded: true };
        }
        const checkAuthorization=phase=>{signal.throwIfAborted();this.assertOwned();const policy=validatePolicy(load(this.policyFile,this.policy));if(!readFriendInteractionsEnabled(this.stateDir))throw revokeError(this.stateDir,phase);if(!policy.enabled||!matchesAuthorizedContact(contact,policy.allowlist.find(item=>item.id===contact.id)))throw new Error('回复许可或会话绑定已撤回，未继续发送。');if(imageActive&&phase==='before-click'&&this.outputAssets?.read(reply.stickerId)?.sha256!==imageAsset?.sha256)throw new Error('表情公开许可或内容已变化。');return true;};
        const authorize=({recipientId,phase}={})=>{if(recipientId!==contact.id||!['prepare','monitor','before-click'].includes(phase))throw new Error('回复发送核对的会话或阶段无效。');return checkAuthorization(phase);};
        authorize.beginDispatch=()=>{const release=acquireFriendInteractionDispatch(this.stateDir);try{checkAuthorization();if(backlog)this.reserveBacklogDispatch(mark);}catch(error){release();throw error;}return release;};
        checkAuthorization();entered = true; mark.status = 'inflight'; mark.pending = { ...mark.pending,phase:'sending',text:reply.text,recoveryEvidence:mark.pending.recoveryEvidence?{...mark.pending.recoveryEvidence,beforeDispatch:false}:null,at:new Date().toISOString() }; this.persist();
        const args = { allowed: true, signal, expectedContact: contact, expectedMessageIds: latest.map(item => item.id), expectedMessageContent: expectedContent, expectedMessageEvidence: { chronology: expectedWatermark.chronology, latestEndVerified: expectedWatermark.latestEndVerified }, authorize, weak: ['manual', 'existing-conversation', 'existing-group'].includes(contact.authorizationKind), backgroundOnly: true };
        if (!backlog && /^sticker:[a-f0-9]{64}$/.test(reply.stickerId || '') && this.outputAssets && typeof this.browser.sendImageMessage === 'function') {
          try { imageAsset = this.outputAssets.read(reply.stickerId); } catch { this.log('reply.sticker_unavailable', { recipientId: contact.id }); }
          if (imageAsset) {
            imageActive = true;
            const image = await this.browser.sendImageMessage(contact.id, imageAsset, args);
            imageActive = false;
            if (image?.confirmed === true) { imageDelivered = true; return image; }
            if (this.browser.canFallbackFromImage?.(image, contact.id) !== true) return image;
            this.log('reply.sticker_zero_input_fallback', { recipientId: contact.id, failureCode: image.failureCode });
          }
        }
        checkAuthorization();
        return this.browser.sendMessage(contact.id, reply.text, args);
```

</details>

**依据 5 · 源码核查**：[chat-browser.mjs:1597-1629](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/chat-browser.mjs#L1597-L1629)

点击前核绑定和控件，点击一次后回读同会话新消息。

<details>
<summary>查看原文（33行）</summary>

```text
        stop(signal); await checkPendingInput(); await authorized('before-click');
        await this.verifyContactBinding(page, contact, expectedContact, weak);
        if (await inputDispatched()) throw new Error('等待期间已发生发送输入，未再点击一次。');
        failureStage = 'authorization';
        if (authorize) { releaseDispatch = await authorize.beginDispatch(); if (typeof releaseDispatch !== 'function') throw new Error('最终输入控制没有返回可释放的许可。'); }
        await this.verifyContactBinding(page, contact, expectedContact, weak);
        await checkPendingInput();
        const finalPoint = await readSendPoint();
        if (!sameGeometry(finalPoint, stablePoint)) throw new Error('最终输入前发送控件移动、替换或被遮挡，未点击发送。');
        failureStage = 'dispatch';
        stop(signal); clicked = true;
        await page.mouse.click(finalPoint.clickX, finalPoint.clickY);
        releaseDispatch?.(); releaseDispatch = null;
        if (!await inputDispatched()) { if (await page.evaluate(token => window.__deepseekChatInputs?.[token]?.groupBlocked === true, witnessId)) { clicked = false; throw new Error('最终输入时群会话稳定身份已变化，未发送。'); } throw new Error('没有核对到真实发送输入，结果需要核对。'); }
        monitoring = false; clearInterval(monitor); stop(signal);
        failureStage = 'readback';
        const beforeIds = new Set(expected), sentCandidates = new Map();
        for (let attempt = 0; attempt < 20; attempt += 1) {
          if (attempt === 3 && !readableDraft(await editor.innerText().catch(() => ''))) {
            // 只重新挂载这个已授权会话一次，不重复输入或点击发送。
            const reopened = await this.select(page, recipientId, signal, { refresh: true, weak });
            if (reopened.flags.blocked || !matches(reopened.contact)) return { ...receipt, confirmed: false, deliveryUncertain: true, reason: '发送后无法重新核对原会话，未再次发送。' };
          }
          const after = await page.evaluate(readConversationDom, { ...expectedDomIdentity(contact), allowWeak: weak });
          if (!matches(after)) return { ...receipt, confirmed: false, deliveryUncertain: true, reason: '发送后会话发生变化，未再次发送。' };
          const messages = this.publicMessages(recipientId, after.messages);
          for (const item of messages) if (item.direction === 'outgoing' && item.text === message.trim() && item.arrivalClassification === 'new-tail' && !beforeIds.has(item.id) && item.serverConfirmed !== false) sentCandidates.set(item.id, messageFingerprint(item));
          const sent = sentCandidates.size === 1 ? messages.find(item => sentCandidates.has(item.id) && item.direction === 'outgoing' && item.text === message.trim() && sentCandidates.get(item.id) === messageFingerprint(item)) : null;
          if (sent && sent.serverConfirmed !== false && !sent.failed && !sent.pending) return { ...receipt, confirmed: true, messageId: sent.id, deliveryUncertain: false };
          if (sent?.failed) return { ...receipt, confirmed: false, deliveryUncertain: true, reason: '网页显示发送失败，未自动重试。' };
          stop(signal);
          await page.waitForTimeout(200);
        }
```

</details>

**依据 6 · 源码核查**：[chat-service.mjs:842-851](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/chat-service.mjs#L842-L851)

异常或缺收据明确未知，不自动重发。

<details>
<summary>查看原文（10行）</summary>

```text
      if (!entered) throw error;
      if(error.code==='CHAT_MAINTENANCE_REVOKED'&&error.safeBeforeDispatch&&mark.pending?.recoveryEvidence){mark.pending.recoveryEvidence.beforeDispatch=true;mark.pending.phase='stopped-before-send';allowMaintenanceRecovery(mark.pending);mark.status='ready';mark.reason='维护前未开始发送，待核对消息恢复。';this.persist();return;}
      mark.status = 'delivery-uncertain'; mark.reason = '发送中断或失败，需人工核对；不会自动重发。'; this.persist(); this.log('delivery.uncertain', { recipientId: contact.id, message: error.message }); return {confirmed:false,deliveryUncertain:true};
    }
    if (delivery?.superseded) { this.log('reply.superseded', { recipientId: contact.id }); return delivery; }
    if (delivery?.confirmed !== true || typeof delivery.messageId !== 'string' || !delivery.messageId.trim()) {
      const notSent = delivery?.confirmed === false && delivery.deliveryUncertain === false;
      mark.status = notSent ? 'paused' : 'delivery-uncertain'; mark.reason = notSent ? '发送前检查未通过，未点击发送；请核对会话与输入框状态。' : '未取得发送确认，需人工核对；不会自动重发。';
      if (notSent) {mark.pending.phase = 'not-sent';if(mark.pending.recoveryEvidence)mark.pending.recoveryEvidence.beforeDispatch=true;}
      this.persist(); this.log(notSent ? 'reply.not_sent' : 'delivery.uncertain', { recipientId: contact.id, failureCode: delivery?.failureCode || null, failureStage: delivery?.failureStage || null }); return delivery;
```

</details>

**依据 7 · 源码核查**：[outbound-send.mjs:74-94](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/outbound-send.mjs#L74-L94)

确认后保存共同收据，保存失败标未知而不重发。

<details>
<summary>查看原文（21行）</summary>

```text
    }
  }
  async run({ recipientId, purpose, signal } = {}, callback) {
    if (!identifier(recipientId) || !kinds.has(purpose) || typeof callback !== 'function') throw new TypeError('共同发送事务需要明确联系人、用途与本机发送函数。');
    const release = await this.acquire(signal);
    try {
      this.ledger(); signal?.throwIfAborted();
      const delivery = await callback();
      if (delivery?.confirmed === true && identifier(delivery.messageId)) {
        const ledger = this.ledger();
        if (!ledger.receipts.some(item => item.recipientId === recipientId && item.messageId === delivery.messageId)) {
          const at = new Date(this.now()).toISOString();
          ledger.receipts.push({ confirmed: true, date: shanghaiDay(Date.parse(at)), at, kind: purpose, recipientId, messageId: delivery.messageId, source: this.source });
          const temporary = `${this.receiptsFile}.${process.pid}.${randomUUID()}.tmp`;
          try { const descriptor = fs.openSync(temporary, 'wx', 0o600); try { fs.writeFileSync(descriptor, JSON.stringify(ledger, null, 2) + '\n'); fs.fsyncSync(descriptor); } finally { fs.closeSync(descriptor); } fs.renameSync(temporary, this.receiptsFile); }
          catch { throw Object.assign(new Error('消息已得到界面确认，但共同收据保存失败，需要人工核对，未自动重发。'), { code: 'OUTBOUND_RECEIPT_FAILED', deliveryUncertain: true }); }
          finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
        }
      }
      return delivery;
    } finally { release(); }
```

</details>

**依据 8 · 源码核查**：[autonomous-comments.mjs:23-27](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/autonomous-comments.mjs#L23-L27)

评论内容过滤只是具体规则。

```text
export function validateCommentText(value) {
  if (typeof value !== 'string' || !value.trim() || [...value.trim()].length > 200 || /[\x00-\x1f\x7f\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/.test(value)) throw fail('评论须为 1 至 200 字的单段纯文字。', 400);
  const text = value.trim(), folded = text.normalize('NFKC');
  if (/[@＠]|https?:|www\.|(?:[a-z0-9-]+\.)+(?:com|cn|net|org|io|dev|app|me|top|xyz|co|tv)\b|(?:\d[\s-]*){7,}|sk[-_][a-z0-9_-]{6,}|api[\s_-]*key|token|cookie|password|密钥|口令|验证码|身份证|手机号|手机号码|QQ|微信|私信|联系人|好友|账号/iu.test(folded)) throw fail('公开评论不能包含@、链接、联系方式、密钥或私人聊天与好友信息。', 400);
  if (/(?:我|我们|大肥鱼).{0,8}(?:保证|承诺|负责|一定(?:会|帮|给|送)|会(?:联系|见面|到场|付款|购买|送|转账|打钱|帮你))|(?:我|我们).{0,6}(?:亲自|实测|用过|去过|见过|买过|吃过|听完|看完)/u.test(folded)) throw fail('评论只能谈当前有限观察，不能编造现实经历或作现实承诺。', 400);
```

**依据 9 · 源码核查**：[autonomous-comments.mjs:60-78](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/autonomous-comments.mjs#L60-L78)

独立预算与待核实记录门禁。

<details>
<summary>查看原文（19行）</summary>

```text
  unresolved(ledger = this.ledger(), except) { return ledger.operations.filter(item => item.operationId !== except && ['reserved', 'clicking', 'uncertain'].includes(item.status)); }
  state() {
    const policy = this.policy(), ledger = this.ledger(), date = day(this.now()), time = this.videoLimits.state(), sessionId = time.session?.id || null, guard = read(this.files.send, null);
    if (guard && (!Number.isSafeInteger(guard.pid) || guard.pid < 1 || !identifier(guard.token))) throw fail('评论发送锁损坏，请先核对收据。');
    const recoveryRequired = Boolean(guard && !alive(guard.pid)), unresolved = this.unresolved(ledger);
    return { protocol: 'autonomous-comments-v1', enabled: policy.enabled, policy: { enabled: policy.enabled, dailyLimit: policy.dailyLimit, perSessionLimit: policy.perSessionLimit }, timeZone: 'Asia/Shanghai', daily: { date, attempts: ledger.days[date] || 0, remaining: Math.max(0, policy.dailyLimit - (ledger.days[date] || 0)) }, session: { id: sessionId, attempts: sessionId ? ledger.sessions[sessionId] || 0 : 0, remaining: sessionId ? Math.max(0, policy.perSessionLimit - (ledger.sessions[sessionId] || 0)) : 0 }, paused: unresolved.length > 0 || recoveryRequired, busy: Boolean(guard && alive(guard.pid)), recoveryRequired, needsReview: unresolved.map(({ operationId, videoId, sessionId, status, startedAt, browserOperationId }) => ({ operationId, videoId, sessionId, status, startedAt, browserOperationId })), recent: ledger.operations.slice(-10).map(({ operationId, videoId, sessionId, status, startedAt, completedAt, text, commentId }) => ({ operationId, videoId, sessionId, status, startedAt, completedAt, text, commentId })), receiptsFile: this.files.ledger };
  }
  context() { const state = this.state(); return { enabled: Boolean(state.enabled && !state.paused && state.daily.remaining > 0 && state.session.remaining > 0 && this.videoLimits.state().allowed), remainingDaily: state.daily.remaining, remainingSession: state.session.remaining, paused: state.paused, maxTextLength: 200 }; }
  configure(input = {}, { explicit = false } = {}) {
    if (!explicit) throw fail('自主评论许可只能由用户在本机设置。', 403);
    if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !['enabled', 'dailyLimit', 'perSessionLimit'].includes(key)) || typeof input.enabled !== 'boolean' || input.dailyLimit !== undefined && (!Number.isSafeInteger(input.dailyLimit) || input.dailyLimit < 1 || input.dailyLimit > 20) || input.perSessionLimit !== undefined && (!Number.isSafeInteger(input.perSessionLimit) || input.perSessionLimit < 1 || input.perSessionLimit > 3)) throw fail('评论设置只接受总开关、每日 1 至 20 次和单轮 1 至 3 次上限。', 400);
    this.control(() => { const policy = this.policy(); if (input.enabled && (this.unresolved().length || this.state().recoveryRequired)) throw fail('上次评论结果需要核对；重新开关不能清除未确认记录。'); write(this.files.policy, { ...policy, enabled: input.enabled, dailyLimit: input.dailyLimit ?? policy.dailyLimit, perSessionLimit: input.perSessionLimit ?? policy.perSessionLimit }); });
    if (!input.enabled) this.active?.abort.abort(fail('用户关闭了自主评论。'));
    return this.state();
  }
  evidence(input) {
    if (!evidencePattern.test(input.evidenceId) || !videoIdentity(input.videoId)) throw fail('评论必须引用已实际观察的同一抖音作品。', 400);
    const observation = this.personaMemory.snapshot().recentObservations?.find(item => item.id === input.evidenceId);
    if (!observation || observation.videoId !== input.videoId || observation.url !== `https://www.douyin.com/video/${input.videoId}` || !observation.sources?.includes(this.source) || observation.privacy !== 'internal-reference' || observation.visibility !== 'account-visible-unverified') throw fail('没有找到当前入口对同一作品的真实观察，未评论。');
```

</details>

#### 缺口

- 真实抖音页面变化、误目标率、收件人确认和公开评论没有本轮独立验收。
  **影响**：不能把网页回读和正则过滤升级为可靠社交代理保证。
  **进一步探讨**：在本人和收件人明确同意的独立测试会话中先验证撤权、同名对象、点击后断线及未知状态不重发；未经授权不做真实发送。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对人工刷视频，价值、依赖和总成本是什么？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

相对人自己刷视频并决定分享，它把采样、模型决策、播放行为、兴趣记录、许可发送和日报串在本机同一状态体系；相对简单定时滚动，它以模型输出和新鲜页面状态继续决策。可借鉴的贡献是把观察证据、当前作品、运行预算和发送收据关联，而不是宣称替人刷视频本身有已证实业务收益。浏览器自动化复用Playwright，分镜拼图明确复用第三方MIT实现，不能把这些基础能力算原创。

首次需要Windows、专用Edge、手动登录及验证码、兼容DSH和图像模型；源码安装另需Node22.13+与依赖。音频后端是可选路径，本次没有核查其完整协议。视频预算有允许时段、每日观看时间和模型请求数，null可表示不限；重启和暂停不应被当清空预算。好友普通聊天与观看时段分开，README明确普通许可聊天全天，好友/分享无次数业务上限，不能把观看的每日请求额度当成所有后台聊天的统一硬限。

持续资源包括有窗口浏览器、模型图像输入、可选音频、本机状态和日志。采样不等于全片理解；兴趣依据是播放与确认行为而非用户本人价值认可，因此个性化效果未知。失败时需要人工处理登录、验证码、页面结构变化、未知收据和损坏锁，不能删除账本来恢复计数。退出应先停止观看与好友/评论许可，核对未决发送和平台实际消息，保留本机收据和必要记录再关应用；没有时间、金额或合格互动数据，不计算节时和单位成本。

#### 证据与依据

**依据 1 · 源码核查**：[video-limits.mjs:24-32](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/video-limits.mjs#L24-L32)

观看日预算允许null不限，时段有界。

```text
export function validateVideoPolicy(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('视频时间设置必须是对象。');
  for (const key of Object.keys(input)) if (!['version','timeZone','enabled','windows','weekendWindows','sessionMinutes','dailyMinutes','dailyRequests'].includes(key)) throw new Error(`不支持的视频设置：${key}`);
  if (input.timeZone !== undefined && input.timeZone !== 'Asia/Shanghai') throw new Error('时间段固定按 Asia/Shanghai 计算。');
  const minutes=input.dailyMinutes!==undefined?input.dailyMinutes:input.sessionMinutes!==undefined?input.sessionMinutes:10,requests=input.dailyRequests===undefined?30:input.dailyRequests;
  for(const [name,value]of [['每日观看分钟',minutes],['每日模型请求次数',requests]])if(value!==null&&(!Number.isSafeInteger(value)||value<1))throw new Error(`${name}须为正整数或null（不限）。`);
  if(input.enabled!==undefined&&typeof input.enabled!=='boolean')throw new Error('允许观看须使用开关。');
  if (!Array.isArray(input.windows) || input.windows.length < 1 || input.windows.length > 16) throw new Error('请设置 1 至 16 个每日时间段，不能关闭全部时间限制。');
  for (const value of input.windows) parseWindow(value);
```

**依据 2 · 源码核查**：[video-limits.mjs:97-110](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/video-limits.mjs#L97-L110)

预算和状态按上海日期核对，配置修改不抹去账本。

<details>
<summary>查看原文（14行）</summary>

```text
  state(now=this.now()) {
    const policy=this.policy(),sessions=read(this.sessionsFile);if(!Number.isFinite(now))throw new Error('当前时间无效，未允许刷视频。');
    if(sessions.version!==1||sessions.current&&(!Number.isFinite(sessions.current.startAt)||typeof sessions.current.id!=='string'||!['active','ended','expired'].includes(sessions.current.status)||sessions.current.expiresAt!==null&&!Number.isFinite(sessions.current.expiresAt)))throw new Error('视频运行记录损坏，未继续观看。');
    const usage=this.accrue(this.usage(),policy,now),budget=this.budget(),date=dateKey(now),usedSeconds=usage.days[date]||0,requests=budget.days[date]||0;
    const remainingSeconds=policy.dailyMinutes===null?null:Math.max(0,policy.dailyMinutes*60-usedSeconds),remainingRequests=policy.dailyRequests===null?null:Math.max(0,policy.dailyRequests-requests),window=allowedWindow(policy,now);
    const worker=optional(path.join(this.stateDir,'watch-loop.lock'),null),saved=optional(path.join(this.stateDir,'watch-state.json'),null),lastRequestPending=worker&&Number.isSafeInteger(worker.pid)&&worker.pid>0&&alive(worker.pid)&&Number.isFinite(worker.heartbeatAt)&&now-worker.heartbeatAt>=0&&now-worker.heartbeatAt<5000&&saved?.pendingRequests===1&&['model','comment-model'].includes(saved.phase)&&typeof worker.runId==='string'&&saved.runId===worker.runId&&saved.sessionId===worker.sessionId&&saved.source===worker.source;
    let reason='',reasonCode='';if(!policy.enabled){reason='允许观看已关闭。';reasonCode='disabled';}else if(!window){reason='当前不在允许刷视频的时间段。';reasonCode='outside-window';}else if(remainingSeconds!==null&&remainingSeconds<=0){reason='今天的观看时长已用完，等待上海时间次日恢复。';reasonCode='daily-time';}else if(remainingRequests!==null&&remainingRequests<=0&&!lastRequestPending){reason='今天的观看模型请求次数已用完，等待上海时间次日恢复。';reasonCode='daily-requests';}
    const expiresAt=window?window.expiresAt:null,session=sessions.current?{...sessions.current,expiresAt}:null;
    return{protocol:'video-limits-v2',timeZone:'Asia/Shanghai',now,policy,session,window,allowed:!reason,reason,reasonCode,daily:{date,usedSeconds,remainingSeconds,requests,remainingRequests,timeLimitMinutes:policy.dailyMinutes,requestLimit:policy.dailyRequests},remainingSeconds:reason?0:remainingSeconds===null?expiresAt===null?null:Math.max(0,(expiresAt-now)/1000):expiresAt===null?remainingSeconds:Math.min(remainingSeconds,Math.max(0,(expiresAt-now)/1000))};
  }
  savePolicy(input,{explicit=false}={}) {
    if(!explicit)throw new Error('视频时间设置只能由用户在控制台明确修改。');
    const current=this.policy(),policy=validateVideoPolicy({...current,...input,...(input.sessionMinutes!==undefined&&input.dailyMinutes===undefined?{dailyMinutes:input.sessionMinutes}:{})});
    return this.control(()=>{const usage=this.accrue(this.usage(),current,this.now());write(this.policyFile,policy);if(!this.state().allowed)usage.active=null;write(this.usageFile,usage);return this.state();});
```

</details>

**依据 3 · 作者声明**：[README.md:11-23](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/README.md#L11-L23)

作者说明功能、默认许可边界及好友互动无次数业务上限。

<details>
<summary>查看原文（13行）</summary>

```text
| 自主观看 | 开启“允许自动观看”后，在允许时段和每日额度内挑片、停留、换片或停止；保留手动启动／暂停按钮 |
| 每日额度 | “高级选项”内设置每日观看分钟数和每日模型请求数，均可选不限 |
| 人格与兴趣 | 两版共用人格卡；兴趣依据实际播放进度、观看比例和已确认互动，看到主题不等于喜欢 |
| 好友互动 | 一个总开关管理许可会话的新消息回复及观看中的自主分享，默认开启；须由本人选择许可好友或群聊 |
| 群聊回复 | 仅回复已许可群聊中被 @ 或叫到设定昵称的消息 |
| 自主分享 | 通过官方面板发送当前实际观察作品的卡片，按平台稳定身份绑定收件人，同作品同会话去重 |
| 公开评论 | 独立开关，默认关闭；保留每日及每次观看的尝试上限，同作品不重复评论 |
| 静默观看 | 持续静音，核实窗口归属后尝试最小化；仍使用有窗口 Edge |
| 自检与用量 | 一键诊断、限定修复建议、实际请求与已报告 token 用量、进行中状态 |
| 观看日报 | 从本机观看记录生成 Markdown，不额外调用模型 |
| 可选音频 | 本地 Whisper 转写对白，视频音频还可选择 MiMo 或 MiniMax 云端后端 |

好友互动不设人数、回复请求数或分享次数的业务上限，模型调用仍会消耗额度。默认开启总开关不会自行添加许可会话。旧自动续火花／自动问候入口已移除。
```

</details>

**依据 4 · 作者声明**：[README.md:42-52](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/README.md#L42-L52)

作者声明Windows/Edge和宿主范围。

<details>
<summary>查看原文（11行）</summary>

````text
## 安装 1.4.6

DSH Desktop：打开“应用 → 桌面插件”，填写 `dsh-douyin-browser-local@1.4.6` 安装或更新。Desktop profile 由 Electron 管理，不要用普通 CLI 另改一份。更新后完全退出并重新打开同一份 DSH。

Web profile 在终端执行：

```powershell
dsh plugin --profile web add dsh-douyin-browser-local@1.4.6
```

插件需要 Windows、Microsoft Edge 和兼容 DSH。已检查 0.2.0-rc.2、0.2.1-rc.2 两代 SDK；完整允许版本以 `package.json` 的 `engines.dsh` 为准，不笼统保证任意 0.2.x 预发布宿主。设置通信适配常用 WebServer、Connection 与宿主 RPC 入口，第三方宿主仍以实际自检和加载结果为准。npm、GitHub Release 和插件市场分别同步；市场未更新时可核对固定 npm 版本。
````

</details>

**依据 5 · 作者声明**：[README.md:100-108](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/README.md#L100-L108)

作者说明有限分镜、第三方归属与图片成本不能定值。

```text
## 视频分镜与图片成本

观看决策、分享视频回复及视频观察工具会把同一作品的多张JPEG采样优先拼成一张带格编号的图片，默认总像素预算480000。每格时间写在模型可读的清单中，仍沿用原作品、播放与许可校验；它不扩大已观看的时间，也不增加音轨理解。普通照片、单帧或无法可靠解码的帧保留原路径。

独立软件对话和DSH普通视频工具可使用 `douyin_video_zoom`，传前次观察返回的 `storyboardSampleId`、`cell` 与同一 `videoId`，读取指定格的原图。仅限本入口最近一分钟采样；换片、登录或验证遮挡、过期时拒绝。原帧缓存有容量上限，退出或到期清理。自动好友回复目前默认使用分镜，不自动增加第二轮精读请求。

布局、编号和RGB拼图复用 [SAOS-3624/dsh-video-storyboard](https://github.com/SAOS-3624/dsh-video-storyboard) 的MIT源码，JPEG编解码使用带完整许可的纯JS实现，无需新增ffmpeg或外部ASR服务。只合成已经取得的真实采样；上游完整下载、全片扫描、字幕和ASR服务生命周期未接入后台。计费因模型不同，图片数量和像素减少不等于固定token数；用量看板仍只记录提供器实际回报。

### 共用专用浏览器页面
```

**依据 6 · 源码核查**：[outbound-send.mjs:34-66](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/outbound-send.mjs#L34-L66)

共享锁损坏或旧进程状态未知拒绝自动删除，恢复有人工负担。

<details>
<summary>查看原文（33行）</summary>

```text
  history(recipientId) {
    if (!identifier(recipientId)) throw new TypeError('读取发出凭据需要明确联系人。');
    return this.ledger().receipts.filter(item => item.recipientId === recipientId).map(item => structuredClone(item));
  }
  async acquire(signal) {
    fs.mkdirSync(this.stateDir, { recursive: true });
    const started = Date.now(), owner = { pid: process.pid, token: randomUUID(), source: this.source }; let retriedDisappearance = false, emptyObservedAt = null;
    while (true) {
      signal?.throwIfAborted();
      let descriptor;
      try { descriptor = fs.openSync(this.guardFile, 'wx', 0o600); }
      catch (error) {
        if (error.code !== 'EEXIST') throw error;
        let stat, contents, current;
        try { stat = fs.lstatSync(this.guardFile); if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 2048) throw Error(); if (stat.size > 0) contents = fs.readFileSync(this.guardFile, 'utf8'); }
        catch (inspectError) {
          if (inspectError.code === 'ENOENT') {
            if (retriedDisappearance && Date.now() - started >= this.waitMs) throw failure('另一项聊天或分享仍在发送，已保留待发内容，请稍后重试。', 'OUTBOUND_BUSY');
            retriedDisappearance = true; continue;
          }
          throw failure('共同发送锁不完整，需要核对；未自动移除。', 'OUTBOUND_RECOVERY_REQUIRED');
        }
        if (stat.size === 0) {
          const observedAt = Date.now(); emptyObservedAt ??= observedAt;
          const age = observedAt - Math.floor(stat.mtimeMs), waiting = observedAt - emptyObservedAt;
          if (!Number.isFinite(age) || age < 0 || age >= lockInitializationGraceMs || waiting >= lockInitializationGraceMs) throw failure('共同发送空锁未在启动宽限内写完，需要核对；未自动移除。', 'OUTBOUND_RECOVERY_REQUIRED');
          if (Date.now() - started >= this.waitMs) throw failure('另一项聊天或分享仍在发送，已保留待发内容，请稍后重试。', 'OUTBOUND_BUSY');
          await delay(Math.min(40, Math.max(1, lockInitializationGraceMs - age), Math.max(1, lockInitializationGraceMs - waiting), Math.max(1, this.waitMs - (Date.now() - started))), undefined, { signal });
          continue;
        }
        try { current = JSON.parse(contents); }
        catch { throw failure('共同发送锁不完整，需要核对；未自动移除。', 'OUTBOUND_RECOVERY_REQUIRED'); }
        if (!Number.isSafeInteger(current?.pid) || current.pid < 1 || !identifier(current.token)) throw failure('共同发送锁身份不明，需要核对；未自动移除。', 'OUTBOUND_RECOVERY_REQUIRED');
```

</details>

#### 缺口

- 真实观看收益、长期资源峰值、兴趣正确性和全部模型费用没有本轮对照。
  **影响**：不能以自动刷视频或分镜张数下降证明业务收益或低成本。
  **进一步探讨**：固定本人认可的候选片单与时间预算，记录有效发现、误分享、所有模型/音频调用、人工核对与浏览器资源。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁可试用或应观察，哪个新假设值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

本轮结论为观察。源码确有可继续执行工具的Agent循环和细致的许可、预算、收据逻辑，但作者自己仍列换片失败、正式包长时播放和公开评论确认等未完成边界。面对会向真实联系人发言的功能，只有静态源码和作者个别自述，尚不足以推荐无看护开启互动。想验证者应先用非敏感账号、有限观看额度、空许可名单并关闭评论，只核观看、旧决策拒绝和预算持久化；真实发送另需双方同意的测试对象。出现作品ID错配、未知收据、联系人绑定不符或播放推进异常就停，回人工浏览和人工发送，不清记录重开。

从观看可继续而未知分享暂停这一分离设计，可推导“待发建议队列”假设。模型先提出带作品证据、收件人和理由的分享建议，用户批量审阅后才放行，可能保留发现价值同时减少误发和事后核对。它相对现有许可后自动发送增加逐项意图确认，代价是人工打断和队列维护，并不是现有功能。最小对照在同一已同意测试对象与片单中比较自动发送和仅建议模式，测本人认可率、误对象/不合适内容数、审阅时间及真正有用的互动；若大部分建议被否决或审阅比人工分享更慢，假设应被否定或缩小范围。没有真实需求与付费材料，不把此设想叫市场机会。

#### 证据与依据

**依据 1 · 源码核查**：[autonomous-watch.mjs:234-248](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/autonomous-watch.mjs#L234-L248)

未知分享暂停后续分享，观看可继续，提供分离动作的事实依据。

<details>
<summary>查看原文（15行）</summary>

```text
      } else if (delivery?.deliveryUncertain) {
        if(delivery.confirmed!==false||delivery.deliveryType!=='native-card'||delivery.videoId!==videoId||delivery.recipientId!==recipientId||typeof delivery.operationId!=='string'||!delivery.operationId)throw failure('分享回执身份不完整，已停止自主观看。','needs_user');
        progress.completed++;progress.status='paused';save();
        this.onEvent({type:'watch.share-paused',code:'SHARE_DELIVERY_UNCERTAIN',message:'保留未确认的分享记录，暂停后续分享，不重发；继续观看。'});
        break;
      } else if (delivery?.confirmed===true&&delivery.deliveryType==='native-card'&&delivery.videoId===videoId&&delivery.recipientId===recipientId&&typeof delivery.operationId==='string'&&delivery.operationId&&typeof delivery.messageId==='string'&&delivery.messageId) {
        progress.confirmed++;
        learned=this.behavior(evidenceId,'share',delivery.operationId)?.accepted===true||learned;
      } else if(delivery?.confirmed===true) throw failure('分享收据缺少可核对的同作品与好友身份，已停止自主观看。','needs_user');
      progress.completed++;save();
      // 每人结束都会释放共同发送锁，短暂让出执行机会，避免连续分享挤占好友回复。
      if(index+1<recipients.length)await this.delayImpl(200,this.abort.signal);
    }
    if(progress.status==='sharing')progress.status='completed';
    this.phase='waiting';this.shareProgress={...progress};this.save({phase:this.phase,shareProgress:this.shareProgress,pendingRequests:0});
```

</details>

**依据 2 · 源码核查**：[autonomous-share.mjs:170-195](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/autonomous-share.mjs#L170-L195)

当前是许可后单次点击授权，不存在用户逐条建议审核队列。

<details>
<summary>查看原文（26行）</summary>

```text
      const authorize = ({ phase, videoId, recipientId } = {}) => {
        if (finished || recipientId !== input.recipientId || videoId !== input.videoId || !['prepare', 'monitor', 'before-click'].includes(phase)) throw fail('可信分享授权与当前作品或收件人不一致。');
        this.allowed(input, { signal: combined, watchRunId, operationId, sessionId });
        if (phase === 'before-click') { if (clicked) throw fail('这项分享已授权一次点击，未再次发送。'); this.update(operationId, { status: 'clicking' }); clicked = true; }
        return true;
      };
      // 最终短输入与设置写入互斥；设置若遇到此阶段会明确返回忙，不能先报关闭成功再发送。
      authorize.beginDispatch = () => {
        if (finished || !clicked || releaseDispatch) throw fail('当前分享未获得一次有效的最终输入授权。');
        const release = this.acquireControl();let releaseInteractions;
        try { releaseInteractions=acquireFriendInteractionDispatch(this.stateDir);this.allowed(input, { signal: combined, watchRunId, operationId, sessionId }); }
        catch (error) { releaseInteractions?.();release(); throw error; }
        releaseDispatch = ()=>{try{releaseInteractions();}finally{release();}};
        return () => { releaseDispatch?.(); releaseDispatch = null; };
      };
      let send = this.send;
      if (!send) {
        const forwarder = await (this.getForwarder ? this.getForwarder() : this.controller?.getForwarder?.());
        if (!forwarder?.forwardAutonomous) throw fail('当前转发器尚未提供可信自主分享入口。');
        send = forwarder.forwardAutonomous.bind(forwarder);
      }
      const result = await send({ recipientId: input.recipientId, expectedVideoId: input.videoId }, { signal: combined, authorize, autonomousRunId: watchRunId });
      const confirmed = clicked && result?.confirmed === true && result.deliveryType === 'native-card' && result.videoId === input.videoId && typeof result.messageId === 'string' && !!result.messageId;
      const uncertain = !confirmed && (clicked || result?.deliveryUncertain === true || result?.confirmed === true);
      const failure = !confirmed ? failureOf(result?.failure || { code: uncertain ? 'SHARE_DELIVERY_UNCERTAIN' : 'SHARE_NOT_SENT', stage: uncertain ? 'receipt' : 'send', message: result?.reason || (uncertain ? '分享结果未确认，请核对收据。' : '没有发出可核对的作品卡片。') }) : null;
      this.update(operationId, { status: confirmed ? 'confirmed' : uncertain ? 'uncertain' : 'not-sent', completedAt: new Date(this.now()).toISOString(), ...(typeof result?.operationId === 'string' ? { forwardOperationId: result.operationId } : {}), ...(confirmed ? { messageId: result.messageId } : { failure }) });
```

</details>

**依据 3 · 作者声明**：[README.md:83-87](https://github.com/LockyBee/dsh-douyin-agent/blob/7989640e340f0fd79e2de9874880d5197546e755/README.md#L83-L87)

作者明确当前状态和未完成的真实验证。

```text
顶部状态栏区分在线、观看中、准备中和需要处理。后台自动整理有完整证据且确认未发送的待答消息；身份不符或发送结果不明时保留记录并核对。不能只凭总开关开启认定服务已就绪。好友回复与观看分开运行，观看时仍检查许可会话的新消息，实际速度受页面读取和模型耗时影响。

遇到问题先运行“自检与用量 → 一键自检”，按报告处理限定修复项。登录、验证码、无效 Key、损坏记录和宿主适配不能靠删除锁、记忆或登录目录解决。发送结果不确定时保留收据并尝试回读核对；无法确认时不自动重发。

本机已核对许可个人私信的一次真实补答和平台确认、稳定身份与视频播放推进；本次修复另有隔离回归和打包检查。推荐流仍可能换片失败，当前正式包的连续两小时播放及始终低于 2 GB 尚未验收；DSH rc.3 正文显示反馈未定位，真实公开评论发布确认和长视频多批观察仍待验。历史结果保留各自版本，详见[本次验证范围](docs/verification/local-1.4.6-20261030.md)。
```

#### 缺口

- 待发建议队列及其互动质量/人工收益未实现验证。
  **影响**：不能称其已减少误发或形成业务需求。
  **进一步探讨**：同片单与已同意对象比较用户认可、错误、人工审阅和有效互动，再决定是否保留或退出。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
