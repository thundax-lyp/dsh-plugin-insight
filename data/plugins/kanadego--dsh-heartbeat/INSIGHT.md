# dsh-heartbeat

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2b98572](https://github.com/Kanadego/dsh-heartbeat/tree/2b98572231f8b1aa852fb04a49bec477eb8e9ee5)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Kanadego/dsh-heartbeat) [![npm 30d 8,682](https://img.shields.io/static/v1?label=npm+30d&message=8%2C682&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kanadego/dsh-heartbeat) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kanadego/dsh-heartbeat)
<!-- END META -->

> **功能**：为 DeepSeek Harness 增加定时心跳、素材采集与会话投递，用忙闲和频率条件决定何时主动开口。

> **亮点**：[Q01](#research-q01) 定时器将维护、素材、时机和已绑定会话连接起来，最终表述由目标会话的 Agent 决定。同一计划因静默条件与备料而得到不同结果。归档后台与正在投递的会话分别处理，有利于使用者定位看不到消息的原因 [Q03](#research-q03)。

> **主要限制**：[Q02](#research-q02) 表达静默发生前仍可能花费模型请求，并运行数据采集。原生视觉先将真实截图写入宿主附件，再交给模型 [Q04](#research-q04)。频率限制和本地加密分别覆盖消息次数、部分本地数据，试用需单独核对数据出口与后台预算。

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
  - [Q01 · 哪种常用会话需要主动提示，和固定定时提醒相比增加什么？](#detail-section-11)
  - [Q02 · 表达静默是否等于整跳没有模型成本，节律和限额分别控制什么？](#detail-section-12)
  - [Q03 · 后台归档、晚回包和卸载如何恢复，人工应核对哪些状态？](#detail-section-13)
  - [Q04 · 选择原生视觉或自动后备时，截图经过何处，失败后至少可能留下什么？](#detail-section-14)
  - [Q05 · 绑定观察和 B 站观看历史怎样进入素材路径，失效或停用时会怎样？](#detail-section-15)
  - [Q06 · 部署者需要核对什么宿主、权限与数据隔离条件，怎样小范围观察？](#detail-section-16)
  - [Q07 · 在不破坏提醒效果的前提下，先做一次廉价检查能减少无用心跳请求吗？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：每天在固定 DSH 会话工作的个人可以了解助手在空档主动提出一条可忽略话题的方式，是否保留取决于时机、素材和实际接收会话。

固定提醒可以低成本准时发同一文案，代价是由用户判断上下文和时机。在对话继续追问可取得高相关性，但依赖用户起头。插件用后台准备和忙闲检查连接这两步，牺牲了固定通知的可预测性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 心跳调度 | 定期运行维护、采集和条件任务 | 至少有 Host agents，重复触发可能因前跳忙而跳过 |
| 会话绑定 | 从观察会话提取有限文本，向绑定会话发提示 | 观察需活 Agent，投递会过滤归档目标 |
| 视觉摘要 | 用截图为提示提供上下文 | 依赖 Windows 采集、对应模型或 CLI；原生保存到宿主附件 |
| B 站素材 | 将部分观看历史加入有期限的素材池 | 需要凭据，轮询独立于心跳 |
| 账本、心事匣、摘抄本和报账 | 保存待办、便签、摘抄及素材使用情况 | 依赖宿主工具服务，写入边界和留存各自不同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ≥22.19.0、可用 Host agents | 启动必需 | 调度后台并获取会话 | 缺相应宿主能力时不能完成循环 |
| Host connection、slots 与 tools | 对应功能所需 | 面板、RPC 和小工具 | 可部分退化或拒绝敏感操作 |
| 已绑定的目标会话 | 常用会话接收时所需 | 将材料包交给对应 Agent | 归档目标被跳过，某些失败分支回后台 |
| Windows PowerShell、宿主附件及相应模型或 ModLens | 对应屏幕识别所需 | 获取截图，并可获得视觉摘要 | 系统采集可能关闭，原生失败可走后备 |
| 可用 B 站凭据 | 观看素材时所需 | 获取只读历史样本 | 保持无凭据可跳过该源 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核对 | 检查 Host、工作目录和默认配置 | 确定模型与数据范围后再装载 |
| 观察 | 用合成内容和不具备采屏能力的专用测试环境建立一个目标 | 分开核对启动、采集、静默与发言 |
| 退出 | 停用并分别核对宿主会话、附件与数据目录 | 确认定时退出和已发生动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Host、模型与隔离数据目录 | 绑定测试会话，审查各数据源 | 配置用时与模型消耗未测 |
| 持续 | 心跳、后台模型、可能的宿主附件存储 | 检查日志、任务回执及隐私范围 | 无统一每跳调用量或账单 |
| 失败与退出 | 已发生任务或附件可能继续占资源 | 停用、对照实际会话并处理保留数据 | 无真实退出用时及留存验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 有条件的主动提示 | 按策略准备、检查、投递或沉默 | 实际提醒及时性和有用率 |
| 后台会话恢复 | 归档触发轮换与审计 | 不同 Host 与重载间的恢复 |
| 静默与输出边界 | 初次与投递前检查，已产生输出另行记账 | 后台花费和误打扰频率 |

> **思考**：[Q02](#research-q02) 表达静默发生前仍可能花费模型请求，并运行数据采集。原生视觉先将真实截图写入宿主附件，再交给模型 [Q04](#research-q04)。频率限制和本地加密分别覆盖消息次数、部分本地数据，试用需单独核对数据出口与后台预算。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 定时器将维护、素材、时机和已绑定会话连接起来，最终表述由目标会话的 Agent 决定。同一计划因静默条件与备料而得到不同结果。归档后台与正在投递的会话分别处理，有利于使用者定位看不到消息的原因 [Q03](#research-q03)。

[Q03](#research-q03) 将已生成和及时完成分开看，归档恢复、模型等待超时、卸载取消都有分支。watchdog 以当前运行标识保护共享占位，确保上一跳迟返回时不会简单清掉下一跳的状态。会话和附件是 Host 负责保留的另一层，仍需独立检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 表达静默发生前仍可能花费模型请求，并运行数据采集。原生视觉先将真实截图写入宿主附件，再交给模型 [Q04](#research-q04)。频率限制和本地加密分别覆盖消息次数、部分本地数据，试用需单独核对数据出口与后台预算。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 适合先观察实现。用无真实聊天资料的隔离会话，保持 B 站账号未登录并选无自动截图能力的环境，通过实际 Host 日志核对启动、静默阶段的模型活动和目标会话。看到预算或数据出口与预期不符时，按 [Q03](#research-q03) 停止并检查已发生的工作。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查定时、绑定、两阶段门、归档与卸载、截图路径和两个素材来源。主动提示是否改善任务及预算尚无实测；前置门筛属于待验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、dist/chunk-GQRQJH3S.js、dist/index.js、src/core/orchestrator.ts、src/gate/gate.ts、src/screen/screenpulse.ts、src/core/ps.ts、src/screen/vision.ts、src/vault/vault.ts、src/sources/bilibili.ts、src/index.ts、src/rpc.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码查到 Host、面板、主循环、截图、观察与 B 站来源、停用。未实际运行安装、平台脚本、各模型认证、B 站账号与宿主附件清理，未逐一审查所有工具及迁移端点。
- 下一步：固定一个支持的 Host，以合成会话和网络桩回放忙闲、静默、归档及取消，记录模型事件和宿主可见提示。允许视觉时先用合成桌面复查附件与实际出口。

**分析版本**

- **仓库**：[Kanadego/dsh-heartbeat](https://github.com/Kanadego/dsh-heartbeat)
- **版本号**：2.2.1（[固定提交 2b98572](https://github.com/Kanadego/dsh-heartbeat/tree/2b98572231f8b1aa852fb04a49bec477eb8e9ee5)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 可试验在只求主动提示的模式提前筛掉没有可用投递目标的工作，对照后台模型请求、恢复后的第一条提示和误打扰。表达前仍重查实时条件。

固定一个支持的 Host，以合成会话和网络桩回放忙闲、静默、归档及取消，记录模型事件和宿主可见提示。允许视觉时先用合成桌面复查附件与实际出口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 28 | 2418 | — | — | 56148 |
| .js | source | 1 | 1601 | 1471 | 117 | — |
| .mjs | source | 4 | 841 | 653 | 132 | — |
| .ts | source | 64 | 15731 | 11210 | 3607 | — |
| .ts | test | 56 | 9615 | 7968 | 796 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Kanadego/dsh-heartbeat/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/Kanadego/dsh-heartbeat/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/Kanadego/dsh-heartbeat/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：经用户绑定的常用会话能否在合适时机获得可复核的主动提醒，哪些后台动作、屏幕数据和宿主权限在沉默或退出时仍可能发生？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪种常用会话需要主动提示，和固定定时提醒相比增加什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

每天使用同一 DSH 会话且愿意让助手主动提出活动线索的个人用户，可以在任务空档收到与自己项目或兴趣相关的短提示。根包经补丁挂到宿主 profile 后，宿主 agents 服务启用后台循环。后台心跳可绑定不同观察和投递目标，先准备候选素材，再由目标会话的 Agent 根据会话语境决定讲哪条或沉默。派送前剔除后台自身和归档目标，再尝试取得一个可用的目标 Agent；有候选但未能恢复时会记回退并使用后台 Agent，从而可能在后台会话有文字而常用会话没有。全部配置目标都归档时直接失败。和一个发固定文案的定时器相比，该实现把材料、时机和对话交付连在一起；提醒仍是模型内容，适合可忽略的提示，实时告警或交付承诺需要有确认的渠道。合格结果应是合适时机、目标会话和可追溯来源共同成立，不能仅按后台说话计数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-24](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/README.md#L13-L24)

作者解释候选素材、忙闲和绑定会话的用途。

<details>
<summary>查看原文（12行）</summary>

````text
## 它是做什么的

普通的对话里，你不说话，agent 就永远停在上一句。`dsh-heartbeat` 给她装上一颗按节律跳动的心脏（默认 60 分钟一跳，带 ±20% 随机浮动）：

1. **自己找话头**：平时按兴趣词自己上网闲逛（`web_search`），或者看一眼你最近在 B 站看什么视频，也可以从你们之前的聊天里捞还没聊透的话题，攒进素材池。
2. **先看你在不在忙**：每次想开口前，先过一道纯代码闸门——深夜静默窗、专注模式、你正在忙、今日次数满了、离上次说话太近，命中任何一条就安静退下，**后续一分钱 token 都不花**。
3. **进你的房间说话**：闸门放行后，后台把候选素材压成简短的备料包，投进你绑定的常用会话。真正开口的是你那个会话里的 agent——她结合你们当下的气氛决定说哪条、或者干脆不说；没说完的心事可以留进**心事匣**带到下一跳，想记下的句子和待办分别收进**摘抄本**与**账本**。

```
维护 → 采集(截图/观察/B站) → 闲逛 → 闸门 ──→ 反刍备料 → 投递到绑定会话 → 留痕
                                      │
                                 判「别说」→ 当场结束（不调模型）
````

</details>

**依据 2 · 源码核查**：[package.json:83-91](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/package.json#L83-L91)

声明 Web 与 DSH bundle。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": ["@deepseek-ai/dsh-client-locale"],
      "platform": "web"
    }
  }
```

**依据 3 · 源码核查**：[dist/index.js:1798-1804](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/dist/index.js#L1798-L1804)

发布服务端入口启动调度。

```text
  if (config.excerptTool !== false) {
    registerGlobalTool("excerpt", () => buildExcerptTool(guard, excerptFilePath(paths.dataDir)));
  }
  startOrchestrator(deps);
  ctx.effect(() => {
    const audit = (entry) => {
      try {
```

**依据 4 · 源码核查**：[src/core/orchestrator.ts:1767-1817](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L1767-L1817)

过滤归档后尝试目标，失败情况与回退本地 Agent。

<details>
<summary>查看原文（51行）</summary>

```text
  throwIfAborted(bc.signal, 'expression');
  const { deps, now } = bc;
  const { guard, paths, policy } = deps;
  const homeId = bc.agent?.session?.id ?? null;
  const { loadBindings, deliverTargets } = await import('./bindings.js');
  const data = loadBindings(guard, paths.settingsDir);
  // H-archived: an archived session resumes fine, but DSH's ArchivedSessionGate
  // rejects its pre-step — the turn ends `blocked` with zero output, and the
  // audit used to misfile that as a language failure. Check the disk truth for
  // archived ids BEFORE bringing any target live; the filter lives at the call
  // site, `deliverTargets` itself stays unfiltered (bindings keeps its
  // single-purpose semantics).
  const archived = loadArchivedSessionIds();
  const all = deliverTargets(data).filter((b) => b.sessionId !== homeId);
  const { usable: targets, skipped } = splitDeliverTargets(all, archived);
  if (skipped.length > 0) {
    appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
      event: 'deliver_target_skipped', reason: 'archived',
      targets: skipped.map((t) => t.sessionId).join(','),
    });
  }
  if (targets.length === 0 && all.length > 0) {
    appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
      event: 'spoke_failed', reason: 'all deliver targets archived',
    });
    noteBeat('spoke_failed', { reason: 'all deliver targets archived' });
    return;
  }
  let liveTarget: { sessionId: string; agent: HostAgent; release: () => void } | null = null;
  for (const b of targets) {
    const acquired = await acquireTargetAgent(deps, b.sessionId);
    if (acquired) { liveTarget = { sessionId: b.sessionId, ...acquired }; break; }
  }
  if (!liveTarget && targets.length > 0) {
    // Never silently reroute: an un-live target is the difference between
    // "she spoke to him" and "she spoke in her own room".
    appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
      event: 'spoke_fallback', reason: 'no deliver target could be brought live',
      targets: targets.map((t) => t.sessionId).join(','),
    });
  }
  const voiceAgent = liveTarget?.agent ?? bc.agent;
  if (!voiceAgent) {
    appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'spoke_failed', reason: 'no voice agent' });
    noteBeat('spoke_failed', { reason: 'no voice agent' });
    return;
  }
  const voiceSessionId = voiceAgent.session?.id ?? null;
  // 投递全程包在 try 里：无论成功、沉默还是中途 return，都要把我们 resume 出来的
  // agent 还回去（acquireTargetAgent 的注释里写了为什么不能留）。
  try {
```

</details>

**依据 5 · 源码核查**：[src/core/orchestrator.ts:1818-1836](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L1818-L1836)

素材包、模型选择和投递标识。

<details>
<summary>查看原文（19行）</summary>

```text
    // 投递文本 = 写法①（2026-09-10 定稿）：正文只留一句舞台提示，不点名插件/引擎室等机器细节。
    // 来源声明不进正文——它已在消息 source 元数据里（kind=plugin / plugin=heartbeat /
    // sections:[{name:'heartbeat', text:'expression'}]），轨迹视图按 messageSourceLabel() 标成 'plugin: heartbeat'。
    // 素材包三段式（2026-09-16 改版）：目标会话的 voiceAgent 收到素材包，自己判断
    // 要不要说、说哪条（或真心话）。buildMaterialPrompt 已含 ①②③（3条里≥2条 used>=1
    // 时自动加「也可以说一句真心话」）。它可以直接说素材里的一条，也可以顺着处境说
    // 想说的话；觉得没什么可说的可以沉默。
    // 本次投递编号（v1.9.0）：报账把它带回来，这一包的账才不会被上一包或下一包认领。
    const deliveryId = `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    // 心事匣 (v2.0.0): the note left for this beat rides in the package, so the
    // engine room neither reads it nor needs to know it exists.
    const notepad = readNotepadSafe(deps, 'deliver_package');
    const phrasePrompt = buildMaterialPrompt(materials, {
      deliveryId,
      // spec ②: the "我在干嘛" line rides on every delivery when vision
      // produced one this beat; absent otherwise (never invented).
      ...(typeof opts.doing === 'string' && opts.doing.trim()
        ? { doing: opts.doing.trim().slice(0, 80) }
        : {}),
```

</details>

#### 缺口

- 用户对提醒有用性和误打扰没有独立数据
  **影响**：不能从会话存在或活跃度推导主动消息有价值
  **进一步探讨**：比较相同个人任务中的固定提醒和上下文提醒并分别记录误打扰及保留的行动

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 表达静默是否等于整跳没有模型成本，节律和限额分别控制什么？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本

#### 完整回答

装载后安排一次约 15 秒的启动触发和独立重复触发，周期每次按设置和抖动重算；单次长任务中返回的重复触发会被进程内占位拦住。专注检查发生在普通工作前，可跳过本跳；可选 token saver 在有后台 Agent 的分支、维护之前检查最近绑定会话活动和系统离席，探测故障按不离席继续。表达闸门更晚，维护、周报、采集和浏览已经尝试过，条件满足时浏览会调用模型，合并画像与周报也可能调用模型。兼容发言条件包括静默时段、前台忙、用户活跃、日限和冷却。第一道表达判定拒绝会跳过后续视觉和反刍；准备后、实际提交表述前再查完整条件。它控制的是感知时序和消息量，无法用日限折算模型费用。专注状态同样不管理独立 B 站采集定时器。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/orchestrator.ts:2541-2569](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L2541-L2569)

启动与重复周期以相对定时器安排。

<details>
<summary>查看原文（29行）</summary>

```text
  const scheduleRecurring = (intervalMin: number) => {
    if (timer) clearTimeout(timer);
    if (disposed) return;
    const baseMs = Math.max(1, intervalMin) * 60_000;
    const jitterPct = clampJitterPct(deps.policy.heartbeat.intervalJitterPct);
    const delayMs = jitteredIntervalMs(baseMs, jitterPct);
    if (!lastScheduled || lastScheduled.intervalMin !== intervalMin || lastScheduled.jitterPct !== jitterPct) {
      appendAuditLine(deps.paths.logsDir + '/heartbeat.jsonl', { event: 'interval_scheduled', intervalMin, jitterPct, delayMs });
      lastScheduled = { intervalMin, jitterPct };
    }
    timer = setTimeout(() => {
      if (disposed) return;
      void beat(deps, 'interval');
      // Re-arm from the live policy: an interval edited on the card lands at
      // the next hop even if the reschedule hook did not fire.
      scheduleRecurring(Math.max(1, deps.policy.heartbeat.intervalMin));
    }, delayMs);
  };
  const scheduleFirst = () => {
    if (firstScheduled) return; // r5 fix: never queue more than one first beat
    firstScheduled = true;
    first = setTimeout(() => { void beat(deps, 'startup'); }, 15_000);
  };
  reschedule = (intervalMin: number) => {
    scheduleRecurring(intervalMin);
    deps.ctx.logger.info('heartbeat: interval rescheduled to %s min', intervalMin);
  };
  scheduleRecurring(deps.policy.heartbeat.intervalMin);
  scheduleFirst();
```

</details>

**依据 2 · 源码核查**：[src/core/orchestrator.ts:2327-2347](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L2327-L2347)

在主体前处理专注和单飞。

<details>
<summary>查看原文（21行）</summary>

```text
export async function beat(deps: OrchestratorDeps, trigger: BeatTrigger = 'interval'): Promise<void> {
  // Focus mode (v2.1.0): the cheapest possible exit — before the single-flight
  // flag, the watchdog and the notepad ordinal, so a silenced hop consumes no
  // beat slot, no daily count and no token. The timer keeps ticking; each tick
  // leaves one `silent` line and an "away" status naming when it lifts.
  // The pause is the OR of module state (same-process RPC) and data/focus.json
  // (the CLI's own process, and a restart): either set silences the beat.
  const focusNow = Date.now();
  const focusPending = resolveFocusUntil(deps.guard, deps.paths, focusPendingAt(focusNow), focusNow);
  if (focusPending) {
    const beatStart = new Date().toISOString();
    try {
      appendAuditLine(deps.paths.logsDir + '/heartbeat.jsonl', {
        event: 'silent', reason: 'focus-mode', until: new Date(focusPending).toISOString(),
      });
      writeBeatStatus(deps, { beatStart, wandered: false, focusUntil: focusPending });
    } catch { /* the pause must never break on status/audit */ }
    return;
  }
  if (beating) return; // single-flight per beat
  beating = true;
```

</details>

**依据 3 · 源码核查**：[src/core/orchestrator.ts:2283-2288](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L2283-L2288)

可选 token saver 和探测失败放行。

```text
async function tokenSaverActive(deps: OrchestratorDeps, signal?: AbortSignal): Promise<boolean> {
  if (!getRuntime().flags.tokenSaver()) return false;
  if (await userActiveInBoundSessions(deps)) return false;
  if (await probeWorkstationLocked(signal)) return true;
  const idle = await probeIdleSeconds(deps.guard, deps.paths, signal);
  return idle >= TOKEN_SAVER_IDLE_SECONDS; // idle < 0 (probe failed) fails open
```

**依据 4 · 源码核查**：[src/core/orchestrator.ts:2430-2465](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L2430-L2465)

表达发生在各前置阶段之后。

<details>
<summary>查看原文（36行）</summary>

```text
    if (agent) {
      deferredRetries = 0; // successful acquisition resets the backoff ladder
      const bc: BeatContext = { deps, agent, now, signal: ctl.signal };
      if (await tokenSaverActive(deps, ctl.signal)) {
        // Pause before maintenance/collect: a token saver that still paid for
        // consolidation would defeat its purpose. Status stays "silent".
        appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'silent', reason: 'token-saver' });
        noteBeat('silent', { reason: 'token-saver（你不在，心跳挂起）' });
        pausedAway = true;            // the status must say "away", not a normal scene
        scheduleTokenSaverWake(deps); // resume within minutes of his return
      } else {
        if (pausedSince) {
          appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
            event: 'token_saver_resumed', via: 'interval', heldMin: Math.round((Date.now() - pausedSince) / 60_000),
          });
        }
        clearTokenSaverWake();
        pausedSince = 0;
        heldChecks = 0;
        const phase = { signal: ctl.signal, cancelBeat: ctl };
        await withTimeout(maintenancePhase(bc), MAINTENANCE_TIMEOUT_MS, 'maintenance', phase);
        appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'phase_done', phase: 'maintenance' });
        await weeklyPhase(bc);
        await withTimeout(collectPhase(bc), COLLECT_TIMEOUT_MS, 'collect', phase);
        appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'phase_done', phase: 'collect' });
        wandered = await withTimeout(wanderPhase(bc), WANDER_TIMEOUT_MS, 'wander', phase);
        appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'phase_done', phase: 'wander' });
        // spec ⑥: refill wander is independent and may stack with a normal
        // wander in the same beat (user decision 2026-09-18).
        const refilled = await withTimeout(refillWanderPhase(bc), WANDER_TIMEOUT_MS, 'refill_wander', phase);
        if (refilled) {
          appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'phase_done', phase: 'refill_wander' });
        }
        wandered = wandered || refilled;
        await expressionPhases(bc);
      }
```

</details>

**依据 5 · 源码核查**：[src/core/orchestrator.ts:1636-1644](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L1636-L1644)

符合浏览策略时会进入模型搜索轮。

```text
async function wanderPhase(bc: BeatContext): Promise<boolean> {
  throwIfAborted(bc.signal, 'wander');
  const { deps, now } = bc;
  const { guard, paths, policy } = deps;
  const advice = adviseWander(guard, paths, policy, new Date(now));
  if (!advice.focus || !bc.agent) return false;
  const maxSeeds = advice.maxSeeds ?? policy.browse.maxSeedsPerVisit;
  const prompt = wanderPrompt(advice.focus, advice.query!, maxSeeds).join('\n');
  return runWanderTurn(bc, prompt, advice.focus, { label: 'wander', maxSeeds });
```

**依据 6 · 源码核查**：[src/core/orchestrator.ts:1980-1995](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L1980-L1995)

闸门拒绝时跳过表达后续。

<details>
<summary>查看原文（16行）</summary>

```text
async function expressionPhases(bc: BeatContext): Promise<void> {
  throwIfAborted(bc.signal, 'expression');
  const { deps, now } = bc;
  const { guard, paths, policy } = deps;
  const decision = await runGate(guard, policy, paths, now, bc.signal);
  if (decision.verdict === 'SILENT') {
    appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'silent', reason: decision.reason });
    noteBeat('silent', { reason: decision.reason });
    return;
  }
  if (!bc.agent) {
    appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'spoke_failed', reason: 'no heartbeat agent' });
    noteBeat('spoke_failed', { reason: 'no heartbeat agent' });
    return;
  }
  const digest = buildDigest(guard, paths, policy, { windowClass: decision.window.cls });
```

</details>

**依据 7 · 源码核查**：[src/gate/gate.ts:77-101](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/gate/gate.ts#L77-L101)

实际检查静默、忙、输入、日限与冷却。

<details>
<summary>查看原文（25行）</summary>

```text
export function evaluateGate(input: GateInputs): GateDecision {
  const { policy, sent, now } = input;
  if (inQuietHours(policy, now)) return { verdict: 'SILENT', reason: 'quiet hours' };
  if (input.frontClass === 'busy') {
    return { verdict: 'SILENT', reason: `busy window (${input.frontWhy})` };
  }
  if (input.presence === 'active') {
    return { verdict: 'SILENT', reason: `master actively typing (front=${input.frontClass})` };
  }
  if (sent.items.length >= policy.gate.maxDailySend) {
    return { verdict: 'SILENT', reason: `daily cap reached (${policy.gate.maxDailySend})` };
  }
  if (sent.items.length > 0) {
    const last = sent.items[sent.items.length - 1]!.ts;
    const leftMs = policy.gate.cooldownMinutes * 60_000 - (now - last);
    if (leftMs > 0) {
      return { verdict: 'SILENT', reason: `cooldown ${Math.ceil(leftMs / 60_000)}min left` };
    }
  }
  return {
    verdict: 'SPEAK',
    sentToday: sent.items.length,
    cap: policy.gate.maxDailySend,
    window: { cls: input.frontClass, why: input.frontWhy, source: input.frontSource },
  };
```

</details>

#### 缺口

- 每跳费用与前置阶段触发频率未知
  **影响**：不能给出安静时的模型费用上限
  **进一步探讨**：分别统计专注、离席、静默窗和通行时的维护、浏览及表达调用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 后台归档、晚回包和卸载如何恢复，人工应核对哪些状态？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

获取后台 Agent 时优先复用活会话或恢复已绑定的 Host session；检测到已归档后台会话则预定轮换。轮换先创建并解析新身份，保存新 ID 后才可择机归档旧会话，该次工作返回，下一跳使用新记录；失败保留待轮换标记。目标会话在发言前做最终检查，当目标模型空闲等待超时时会扫描该回合新增记录，看是否已有文字。已生成内容进入结算，哪怕后续再检查发现已到静默或限额变化；系统需要记住已经发生的输出，用户不能将事后拒绝理解为撤回。占位由本跳 token 负责回收，watchdog 与卸载会清除定时器并触发取消。停止后仍要核对已经提交的 Host 会话、日志及数据目录；卸载说明也明确保留运行数据，过程取消没有已发送内容回滚语义。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/orchestrator.ts:817-843](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L817-L843)

使用现有 Agent 或恢复已保存会话。

<details>
<summary>查看原文（27行）</summary>

```text
    const unwrap = (handle: unknown): HostAgent => (handle as { agent?: HostAgent }).agent ?? (handle as HostAgent);
    try {
      let agent: HostAgent;
      if (savedId) {
        // Three-state acquisition (r4 §8 P3 conclusions):
        //  1. live (session open in UI / already resumed) -> use the bare agent
        //  2. persisted but idle -> agents.resume
        //  3. no saved id -> agents.create (first boot)
        // Self-healing (r5): if the user DELETED the home session, resume
        // fails -> fall back to create so the heartbeat never dies.
        const live = safe(() => ctx.agents.get(savedId) as HostAgent | undefined, 'agents.get');
        if (live.ok && live.result) {
          appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'agent_reuse_live', sessionId: savedId });
          agent = live.result;
          // This branch skips `setup` by construction (the agent is already
          // published and owned), so it must re-pin the allow-list itself.
          rePinReusedAgent(deps, agent);
        } else {
          appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'agent_resume_start', sessionId: savedId });
          try {
            const handle = await withTimeout(Promise.resolve(ctx.agents.resume({ resumeSessionId: savedId, ...(agentOptions ? { agentOptions } : {}), setup })), 30_000, 'agents.resume timeout (30s)');
            agent = unwrap(handle);
            appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'agent_resume_ok', sessionId: savedId, model: agent.options?.model ?? '(none)' });
          } catch (resumeErr) {
            const resumeMessage = String(resumeErr);
            appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
              event: 'agent_resume_failed', sessionId: savedId,
```

</details>

**依据 2 · 源码核查**：[src/core/orchestrator.ts:682-715](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L682-L715)

先置新后台会话 ID，再可选归档旧会话。

<details>
<summary>查看原文（34行）</summary>

```text
async function rotateHome(deps: OrchestratorDeps, reason: string): Promise<void> {
  const { ctx, guard, paths } = deps;
  const old = readBeatState(guard, paths).sessionId;
  const freshId = `session-${randomUUID()}`;
  appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
    event: 'home_rotate_start', from: old, to: freshId, reason,
  });
  const handle = await withTimeout(
    Promise.resolve(ctx.agents.create({
      sessionId: freshId,
      meta: { cwd: paths.dataDir },
      ...(defaultAgentOptions(ctx) ? { agentOptions: defaultAgentOptions(ctx) } : {}),
      setup: makeHomeSetup(deps),
    })),
    30_000,
    'home rotate create timeout (30s)',
  );
  const agent = unwrapHomeHandle(handle);
  const realId = agent.session?.id ?? freshId;
  writeBeatState(guard, paths, { sessionId: realId });
  agentPromise = null; // next ensureAgent run acquires the new home
  appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
    event: 'home_rotate_done', from: old, to: realId, reason,
  });
  ctx.logger.info('heartbeat: home rotated %s -> %s (%s)', old ?? '(none)', realId, reason);
  if (shouldArchiveRotatedHome({ old, realId, enabled: deps.policy.heartbeat.archiveRotatedHome !== false })) {
    archiveSessionBestEffort(deps, old!, reason);
  }
}

/** Pure decision for retiring a rotated-out home (unit-tested): need a real
 * previous id that differs from the new one, and the policy switch on. */
export function shouldArchiveRotatedHome(input: { old?: string | null; realId: string; enabled: boolean }): boolean {
  return Boolean(input.old) && input.old !== input.realId && input.enabled;
```

</details>

**依据 3 · 源码核查**：[src/core/orchestrator.ts:2410-2426](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L2410-L2426)

轮换成功或失败均收束本跳，失败留待复试。

<details>
<summary>查看原文（17行）</summary>

```text
      const homeId = agent.session?.id;
      if (homeId && isArchivedSession(loadArchivedSessionIds(), homeId)) {
        homeRotatePending = `home session archived (${homeId})`;
      }
    }
    if (agent && homeRotatePending !== null) {
      try {
        await rotateHome(deps, homeRotatePending);
        homeRotatePending = null;
      } catch (e) {
        // Keep the flag: retry next beat. A beat on the fat home would only
        // re-fail with overflow anyway.
        appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'home_rotate_failed', error: String(e).slice(0, 160) });
      }
      writeBeatStatus(deps, { beatStart, wandered: false });
      appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'silent', reason: 'home rotated, next beat starts fresh' });
      return;
```

</details>

**依据 4 · 源码核查**：[src/core/orchestrator.ts:1845-1879](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L1845-L1879)

发言前复查，超时后检查实际生成文字。

<details>
<summary>查看原文（35行）</summary>

```text
    throwIfAborted(bc.signal, 'expression');
    // HB-14: re-check everything that decides "is this a good moment" - quiet
    // hours, cap, cooldown, busy window, actively typing - not just the first
    // two. The delivery happens minutes after the gate decision.
    const pre = await canSendLive(guard, policy, paths, Date.now(), bc.signal);
    if (!pre.ok) {
      appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'spoke_failed', reason: pre.reason });
      noteBeat('spoke_failed', { reason: pre.reason });
      return;
    }
    // 表达轮失败（目标忙 / 超时）不再把整跳打成 beat_error：那句话留在下一跳重来。
    const turnStart = Date.now(); // 报账对账窗口起点（2026-10-06）
    // H-67: watermark for the objective "did she speak" test below. `seq` is the
    // host's own log length, so scanning from it finds only what this turn added.
    const beforeSeq = voiceAgent.session?.seq ?? sessionEvents(voiceAgent.session).length;
    let spokenRaw: string;
    try {
      spokenRaw = await agentTurn(bc.deps, voiceAgent, phrasePrompt, 'expression', EXPRESSION_IDLE_WAIT_MS, bc.signal);
    } catch (e) {
      // H-67: a timed-out idle wait is not proof she stayed silent — the answer
      // may already have been streamed into the session. Only defer when the
      // session really gained nothing.
      const late = spokeTextSince(voiceAgent.session, beforeSeq);
      if (!late) {
        appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
          event: 'spoke_deferred', reason: 'target session busy', error: String(e).slice(0, 120),
        });
        noteBeat('spoke_failed', { reason: '目标会话正忙，本轮未投递' });
        return;
      }
      appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
        event: 'spoke_late', reason: 'turn did not settle in time but her text is in the session',
        text: late.slice(0, 80),
      });
      spokenRaw = late;
```

</details>

**依据 5 · 源码核查**：[src/gate/gate.ts:255-269](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/gate/gate.ts#L255-L269)

已生成后按发生事实结算。

<details>
<summary>查看原文（15行）</summary>

```text
  // H-67 + HB-13: by the time this runs the sentence is already in the other
  // session, so the books settle whether or not the gate had moved on. The
  // verdict only tells the caller what a second look found; it never means "she
  // stayed silent". Refusing to book a sentence she did say is how the old code
  // lost deliveries it had actually made.
  const check = canSend(guard, policy, paths, now);
  const sent = readSentState(guard, paths, now);
  sent.items.push({
    ts: now,
    iso: new Date(now).toISOString(),
    kind,
    summary: String(summary).slice(0, 80),
  });
  saveJson(guard, sentFilePath(paths), sent);
  return check.ok ? { ok: true, sent } : { ok: false, reason: check.reason, sent };
```

</details>

**依据 6 · 源码核查**：[src/core/orchestrator.ts:2570-2592](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L2570-L2592)

停止调度、取消已开始的回合。

<details>
<summary>查看原文（23行）</summary>

```text
  // Host effect contract: fn runs immediately, returns the disposer.
  deps.ctx.effect(() => {
    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      if (first) clearTimeout(first);
      // Cancel an in-flight beat's agent turn: clearing the timers alone leaves
      // the current turn running, and the host waits for graceful task teardown
      // before it can exit (desktop update once stalled on exactly this).
      const cancelledInFlight = beating || beatCancel !== undefined;
      clearBeatWatchdog(); // H-03: the disposer must not leave a timer behind
      // ⑤A: cancel the in-flight agent turn FIRST — the host takes only the
      // first cancel cause, and a dispose must surface as `disposed` (the goal
      // round driver disarms on it). Aborting afterwards still stops the
      // phases at their next await (subprocesses killed, writes skipped); the
      // cancel that abort's onAbort would raise is ignored by the host.
      try {
        beatCancel?.();
      } catch { /* never rethrow from the disposer */ }
      try {
        if (beatAbort && !beatAbort.signal.aborted) beatAbort.abort('orchestrator disposed');
      } catch { /* never rethrow from the disposer */ }
      appendAuditLine(deps.paths.logsDir + '/heartbeat.jsonl', { event: 'orchestrator_disposed', beatCancelled: cancelledInFlight });
```

</details>

**依据 7 · 作者声明**：[README.md:135-144](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/README.md#L135-L144)

作者的宿主版本与保留数据的卸载说明。

<details>
<summary>查看原文（10行）</summary>

```text
## 版本兼容与卸载

| 插件版本                    | 适配的 DSH 版本                 |
| --------------------------- | ------------------------------- |
| **v2.2.0 – v2.2.1**（当前） | `0.2.0-rc.1` – `0.2.2-rc.1`     |
| v2.1.1 – v2.1.2             | `0.2.0-rc.1` – `0.2.1-rc.5`     |
| v2.0.0 – v2.0.1             | `0.2.0-rc.1` – `0.2.1-rc.2`     |
| v1.x 历史版本               | 见 [CHANGELOG.md](CHANGELOG.md) |

卸载执行 `dsh plugin --profile web remove @kanadego/dsh-heartbeat`，只拆插件本体，不动 `heartbeat-data` 目录。
```

</details>

#### 缺口

- 未在实际宿主模拟轮换、并发停止或计费
  **影响**：取消及时性和跨版本恢复不能承诺
  **进一步探讨**：使用合成会话触发归档和延迟，核对旧会话、新绑定、已出声记录及重新装载

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 选择原生视觉或自动后备时，截图经过何处，失败后至少可能留下什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Windows 屏幕采集由带超时 PowerShell 写临时 JPEG 和元数据，由插件加密保存图片；失败会清陈旧截图。源码 PowerShell 包装在非 Windows 直接返回失败，减少自动采屏能力，但不等于没有所有数据采集。诊断窗口与主动提示的视觉是不同阶段。表达闸门通过后，默认 auto 会先尝试原生引擎，失败再选择 ModLens CLI；原生通过宿主附件服务提前持久化截图，再将图片块连同文本指令交给宿主 Agent。即使后续图片不产生有效摘要或回合失败，附件已经保存的分支仍可能存在；宿主会按配置通道处理原生请求。插件解锁出来的临时图片在 finally 处理，附件库是另一份数据。成功识别后还将最多十个截断窗口标题放入后续摘要输入。截图与素材本地可使用 AES-GCM，Windows 走 DPAPI 保护 key，非 Windows 用权限文件；这层保护不覆盖独立宿主附件库和受托模型。访问权限、主机内容和通道处理规则不明确时，不适合用实际桌面作试用素材。

#### 证据与依据

**依据 1 · 源码核查**：[src/screen/screenpulse.ts:115-146](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/screen/screenpulse.ts#L115-L146)

实际采集、取消与加密持久化。

<details>
<summary>查看原文（32行）</summary>

```text
  try {
    const r = await runPowerShellFile(
      path.join(paths.assetsDir, 'screenpulse.ps1'),
      ['-outdir', paths.tmpDir, '-cap', String(windowCap)],
      45_000,
      signal,
    );
    // ⑤A: an aborted beat has no use for a fresh pulse, and writing one here
    // would count as a write after cancellation.
    if (signal?.aborted) {
      return { ok: false, capturedAt: null, hasShot: false, visibleCount: 0, error: 'aborted' };
    }
    if (r.status !== 0) {
      // HB-15 (B): the collector failed, so this beat has no picture of its
      // own. Whatever screen.jpg is still on disk belongs to an earlier beat
      // and would be read as the current screen - drop it instead of leaving
      // it to be mistaken for now.
      dropStaleShot(guard, paths);
      return { ok: false, capturedAt: null, hasShot: false, visibleCount: 0, error: `collector exit ${r.status}` };
    }
    const raw = fs.readFileSync(rawJson, 'utf8');
    const meta = JSON.parse(raw) as ScreenJson & { shot_path?: string };
    if (meta.shot_path && fs.existsSync(meta.shot_path)) {
      try {
        // Image first, then its stamp: only when both land is the shot this
        // beat's own. A half-finished pair is dropped right below.
        encryptFile(guard, meta.shot_path, screenJpgPath(paths));
        fs.writeFileSync(
          screenStampPath(paths),
          String(meta.captured_at ?? new Date(now).toISOString()),
          'utf8',
        );
```

</details>

**依据 2 · 源码核查**：[src/core/ps.ts:26-34](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/ps.ts#L26-L34)

非 Windows 平台探测直接退化。

```text
export function runPowerShell(args: string[], timeoutMs: number, signal?: AbortSignal): Promise<PsResult> {
  if (signal?.aborted) return Promise.resolve({ status: 1, stdout: '', stderr: 'aborted' });
  // v2.1.0: every caller of this module is a Windows-only probe (idle seconds,
  // foreground window, toasts, screen capture). Off Windows there is no binary
  // to spawn, so answer "probe failed" immediately — same degradation the
  // callers already implement, without paying a spawn attempt per beat.
  if (process.platform !== 'win32') {
    return Promise.resolve({ status: 1, stdout: '', stderr: `powershell unavailable on ${process.platform}` });
  }
```

**依据 3 · 源码核查**：[src/screen/vision.ts:312-329](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/screen/vision.ts#L312-L329)

原生视觉的解锁与最终清理。

<details>
<summary>查看原文（18行）</summary>

```text
  const settings = opts.settings ?? readVisionSettings(guard, paths);
  const prompt = opts.prompt ?? settings.prompt ?? NATIVE_VISION_PROMPT;
  const timeoutMs = opts.timeoutMs ?? VISION_TIMEOUT_MS;
  let shot: string | null = null;
  try {
    shot = unlockShot(guard, paths);
    if (!shot) return { ok: false, summary: null, error: 'no screenshot this beat', engine: 'native' };
    const raw = await opts.turn(shot, prompt, {
      timeoutMs,
      ...(opts.signal === undefined ? {} : { signal: opts.signal }),
    });
    const text = raw.trim();
    if (!text) return { ok: false, summary: null, error: 'native vision produced no summary', engine: 'native' };
    return { ok: true, summary: text.slice(0, VISION_MAX_SUMMARY), engine: 'native' };
  } catch (e) {
    return { ok: false, summary: null, error: scrubShotPath(String(e), shot, paths.tmpDir), engine: 'native' };
  } finally {
    if (shot) burnUnlocked(guard, shot);
```

</details>

**依据 4 · 源码核查**：[src/screen/vision.ts:362-389](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/screen/vision.ts#L362-L389)

auto 从原生失败回退 ModLens。

<details>
<summary>查看原文（28行）</summary>

```text
): Promise<ScreenVision> {
  const settings = opts.settings ?? readVisionSettings(guard, paths);
  const engine = opts.engine ?? resolveVisionEnginePrecedence(opts.configuredEngine, settings);
  const viaModlens = async (): Promise<ScreenVision> => ({
    ...(await describeScreenShot(guard, paths, {
      moduleUrl: opts.moduleUrl,
      mainPath: opts.mainPath,
      spawnCli: opts.spawnCli,
      timeoutMs: opts.timeoutMs,
      prompt: opts.prompt,
      provider: opts.provider,
      settings,
      signal: opts.signal,
    })),
    engine: 'modlens',
  });
  if (engine === 'modlens') return viaModlens();
  const native: ScreenVision = opts.turn
    ? await describeScreenShotNative(guard, paths, {
      turn: opts.turn,
      timeoutMs: opts.timeoutMs,
      prompt: opts.prompt,
      settings,
      signal: opts.signal,
    })
    : { ok: false, summary: null, error: 'native vision unavailable', engine: 'native' };
  if (engine === 'native' || native.ok) return native;
  // auto: the native read failed — the CLI is the documented fallback.
```

</details>

**依据 5 · 源码核查**：[src/core/orchestrator.ts:1075-1107](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L1075-L1107)

先保存宿主附件，再将引用交给 Agent。

<details>
<summary>查看原文（33行）</summary>

```text
  const attachments = lookup('attachments') as HostImageAttachmentStore | undefined;
  if (!attachments || typeof attachments.saveImage !== 'function') {
    throw new Error('attachments service unavailable');
  }
  // 能力闸门：宿主自己也这么查（session prompt 端点），否则 image 会被投影成
  // "[image omitted because this model accepts text only ...]" 的占位文本。
  const provider = agent.options?.provider;
  const model = agent.options?.model;
  const llm = lookup('llm') as HostModelInfoSource | undefined;
  if (provider && model && typeof llm?.resolveModelInfo === 'function') {
    const info = await llm.resolveModelInfo(provider, model);
    if (info?.inputModalities !== undefined && !info.inputModalities.includes('image')) {
      throw new Error(`model ${model} does not accept image input`);
    }
  }
  const image = await attachments.saveImage({
    data: new Uint8Array(fs.readFileSync(shotPath)),
    mediaType: 'image/jpeg',
    name: 'heartbeat-screen.jpg',
  });
  const { createUserMessage } = await import('@deepseek-ai/dsh-llm');
  // dsh-attachment 不是本插件的依赖：图片引用在这里只是"宿主给的对象，原样交还"，
  // 所以只在建消息这一处透传（类型由宿主包拥有，形状见 ImageBlock.attachment）。
  const content = [
    { type: 'text', text: prompt },
    { type: 'image', attachment: image },
  ] as unknown as Parameters<typeof createUserMessage>[0]['content'];
  const message = createUserMessage({
    content,
    source: { kind: 'heartbeat', plugin: 'heartbeat', form: 'snapshot', sections: [{ name: 'heartbeat', text: label }] },
  });
  const before = sessionEventCount(agent.session);
  agent.followup(message);
```

</details>

**依据 6 · 源码核查**：[src/core/orchestrator.ts:2017-2028](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L2017-L2028)

成功后向备料输入窗口标题。

<details>
<summary>查看原文（12行）</summary>

```text
  let screen: { vision: string; windows: string[] } | undefined;
  if (screenVision.ok && screenVision.summary) {
    const sj = readScreenJson(guard, paths);
    const titles = sj ? [sj.title, ...sj.windows.map((w) => w.title)].filter((t) => t && t.trim()) : [];
    screen = { vision: screenVision.summary, windows: titles.map((t) => t.trim().slice(0, 40)).slice(0, 10) };
  }
  appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
    event: 'screen_vision', ok: screenVision.ok,
    // engine names the engine behind the result (native / modlens); the event
    // keeps its old name and keys, and never carries the picture or its path.
    ...(screenVision.engine === undefined ? {} : { engine: screenVision.engine }),
    ...(screenVision.ok ? {} : { error: (screenVision.error ?? '').slice(0, 100) }),
```

</details>

**依据 7 · 源码核查**：[src/vault/vault.ts:244-253](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/vault/vault.ts#L244-L253)

非 DPAPI 主密钥按 0600 写入。

<details>
<summary>查看原文（10行）</summary>

```text
 * Publish a fresh master key on a host without DPAPI: the 32 raw bytes ARE the
 * file. Written to scratch first and renamed, so a concurrent reader sees either
 * no key or a complete one, and 0600 is applied before the bytes land in place.
 */
function publishPlainKeyFile(file: string, key: Buffer): void {
  const tmp = tmpPlainName(file);
  try {
    fs.writeFileSync(tmp, key, { mode: 0o600 });
    // Re-open what we are about to publish: a key nobody can read is dead data.
    if (!fs.readFileSync(tmp).equals(key)) throw new Error('vault: master key round-trip mismatch');
```

</details>

**依据 8 · 作者声明**：[README.md:100-106](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/README.md#L100-L106)

作者说明图片请求边界与独立宿主附件库。

```text
| `engine`          | 行为                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `auto`（缺省） | 先让心跳 agent 自己看截图；拿不到图、模型不接受图片、这一轮报错或超时，再回退 ModLens CLI                  |
| `native`       | 只走原生：截图作为图片内容交给心跳 agent（与在会话里贴一张图走的是同一条通道），不装 ModLens 也能用         |
| `modlens`      | 只走 ModLens CLI（v2.2.1 及更早的行为）                                                                   |

原有的 `provider` / `prompt` 照旧有效（`prompt` 同时覆盖原生引擎的固定提示词）。三种取值之外的值一律按 `auto` 处理——写错不会让视觉整个失效。三点如实说明：原生引擎每跳多一轮 agent 调用；这张截图会作为图片附件存进 DSH 自己的附件库（`$DSH_HOME/attachments/v1`，不经本插件的加密 vault），**且会作为图片内容随请求发给你配置的模型 provider**；附件库是内容寻址、只增不减的，同一画面只存一份，但不同画面每跳会多一份，插件这边没有清理接口——介意的话用 `native` 之外的引擎，或在 DSH 附件库处自行清理。审计日志只记 `engine` 与成败，绝不记画面内容或图片路径。
```

#### 缺口

- 未观察实际模型 provider 的接收、留存与多引擎请求次数
  **影响**：不能把本地文件加密当作外部匿名或不留存
  **进一步探讨**：使用合成桌面和可信隔离端点测量请求与附件存留

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 绑定观察和 B 站观看历史怎样进入素材路径，失效或停用时会怎样？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

会话观察仅扫描标记为观察且存在活 Agent 的会话。它从上一次位置往后读事件，跳过插件注入、非用户消息及无文本消息，将有限条数的首句截断为 inbox 条目。队列争锁失败时本条保留审计而丢弃，游标仍可推进；因此观察素材不是完整聊天备份。B 站源使用独立定时器启动及轮询，可显式禁用，无凭据时跳过。它在网络请求前持久化最后尝试时间，因此登录过期也不会按心跳反复请求。收到列表后按类型和历史去重，向 Bilibili 专用来源添加有限寿命的素材。处置函数清除今后的定时事件，已开始抓取在此函数未见单独中止。专注状态不阻止该独立采集；不需要账号历史时，应保持无登录凭据或明确禁用。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/orchestrator.ts:1371-1418](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L1371-L1418)

观察名单、游标、来源过滤与首句。

<details>
<summary>查看原文（48行）</summary>

```text
async function observeBoundSessions(bc: BeatContext): Promise<void> {
  throwIfAborted(bc.signal, 'observe');
  const { deps, now } = bc;
  const { guard, paths } = deps;
  const { loadBindings, observeTargets } = await import('./bindings.js');
  const { inboxAppend, inboxFilePath } = await import('../profile/inbox.js');
  const data = loadBindings(guard, paths.settingsDir);
  const targets = observeTargets(data);
  if (targets.length === 0) return;
  const cursorFile = path.join(paths.dataDir, 'cursors.json');
  const loaded = loadCursors(cursorFile);
  const cursors = loaded.sessions;
  if (loaded.discardedLegacy) {
    appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
      event: 'cursor_format_discarded',
      reason: 'pre-H-05 index-based cursors; re-scanning each session once from seq 0',
    });
  }
  const inboxFile = inboxFilePath(paths.dataDir);
  for (const b of targets) {
    try {
      const agent = ctx_getAgent(deps, b.sessionId);
      if (!agent) continue; // not live: nothing to observe this beat
      const cursor = Math.max(cursors[b.sessionId] ?? 0, 0);
      // Depth knobs (v1.8.0): perBeat caps messages per session per beat,
      // maxChars caps the note kept per message (first sentence).
      const { maxChars, perBeat } = deps.policy.observe;
      const events = sessionEvents(agent.session, cursor);
      let seq = cursor;
      let added = 0;
      for (const e of events) {
        if (added >= perBeat) break;
        const at = seq; // seq of this event
        seq += 1;
        if (e.type !== 'user/message') continue;
        const d = e.data as { source?: { kind?: string; plugin?: string }; content?: { type?: string; text?: string }[] } | undefined;
        // never observe our own injections — 'heartbeat' = v1.7.0 producer
        // kind (0.1.7 V4 refuses the retired generic 'plugin' wrapper);
        // 'plugin'/plugin:'heartbeat' still match rows written by older builds.
        if (d?.source && (d.source.kind === 'heartbeat' || d.source.kind === 'plugin' || d.source.plugin === 'heartbeat')) continue;
        const text = (d?.content ?? []).filter((c) => c.type === 'text').map((c) => c.text ?? '').join('').trim();
        if (!text) continue;
        const appended = inboxAppend(guard, inboxFile, {
          kind: 'chat',
          at: new Date(now).toISOString(),
          ref: `cursors.json#${b.sessionId}:${at}`,
          note: text.split(/[。！？\n]/)[0]!.slice(0, maxChars),
        });
```

</details>

**依据 2 · 源码核查**：[src/core/orchestrator.ts:1419-1435](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L1419-L1435)

锁冲突丢弃与游标推进。

<details>
<summary>查看原文（17行）</summary>

```text
        // HB-03: the lock belonged to another process (the CLI), so this
        // observation is dropped rather than written over their drain. Say so —
        // a silently missing observation is how the profile quietly loses facts.
        if (!appended) {
          appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
            event: 'inbox_locked', reason: 'another process holds the inbox lock; observation dropped',
            ref: `cursors.json#${b.sessionId}:${at}`,
          });
        }
        added += 1;
      }
      // H-05: persist progress even when the slice held no user text at all —
      // otherwise every beat re-scans the same stretch of non-text events.
      if (seq > (cursors[b.sessionId] ?? 0)) {
        cursors[b.sessionId] = seq;
        atomicWriteJsonSync(cursorFile, { version: 2, sessions: cursors });
        appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'observed', sessionId: b.sessionId, added, cursor: seq });
```

</details>

**依据 3 · 源码核查**：[src/sources/bilibili.ts:340-366](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/sources/bilibili.ts#L340-L366)

禁用、缺凭据、请求节流和出错。

<details>
<summary>查看原文（27行）</summary>

```text
  const cfg = policy.sources?.bilibili;
  if (cfg?.enabled === false) return { skipped: 'disabled' };

  const sessdata = resolveSessdata(guard, paths.dataDir, cfg?.cookieFile);
  if (!sessdata) {
    say('bilibili: no SESSDATA (vault/cookieFile) — source off');
    return { skipped: 'no-credential' };
  }

  const stateFile = bilibiliStatePath(paths.dataDir);
  const state = loadBiliState(guard, stateFile);
  if (now - state.lastFetchAt < BILI_FETCH_INTERVAL_MS) {
    return { skipped: 'throttled' };
  }
  // Throttle on ATTEMPT: a failing credential must not turn into a per-beat
  // retry hammer (research doc: 不重试轰炸).
  saveBiliState(guard, stateFile, { ...pruneBvids(state, now), lastFetchAt: now });

  const res = await fetchBiliHistory(sessdata, deps.fetchImpl);
  if (res === null) {
    say('bilibili: history/cursor fetch failed — skipping this round');
    return { skipped: 'fetch-failed' };
  }
  if (res.code !== 0) {
    // Notably -101 (not logged in / cookie expired): silent skip per spec.
    say(`bilibili: history/cursor code ${res.code} — skipping this round`);
    return { skipped: `code-${res.code}` };
```

</details>

**依据 4 · 源码核查**：[src/sources/bilibili.ts:375-405](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/sources/bilibili.ts#L375-L405)

选取、去重和带期限的素材入池。

<details>
<summary>查看原文（31行）</summary>

```text
  for (const raw of res.list) {
    const r = (raw ?? {}) as BiliRecord;
    const drop = shouldDropRecord(r);
    if (drop) {
      result.dropped = (result.dropped ?? 0) + 1;
      continue;
    }
    const bvid = r.history?.bvid;
    if (!bvid || recent.has(bvid)) {
      result.deduped = (result.deduped ?? 0) + 1;
      if (bvid) fresh.push({ bvid, at: now });
      continue;
    }
    const text = seedTextFor(r);
    if (!text) {
      result.dropped = (result.dropped ?? 0) + 1;
      continue;
    }
    try {
      // 'bilibili' source (2026-11-09): own lane, capped by SEED_SOURCE_CAPS
      // and NOT shared with the wander 'browse' news. Defaults: confidence =
      // SEED_SOURCE_DEFAULT_CONFIDENCE.bilibili (0.4) via the pool's own
      // default; hard TTL via the per-seed override.
      const added = addSeed(guard, poolFile, policy, {
        text,
        tag: 'scene',
        source: 'bilibili',
        category: 'topic',
        noMerge: true,
        ttlDaysOverride: BILI_SEED_TTL_DAYS,
      }, now, audit);
```

</details>

**依据 5 · 源码核查**：[src/sources/bilibili.ts:432-448](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/sources/bilibili.ts#L432-L448)

独立启动的周期和停止写法。

<details>
<summary>查看原文（17行）</summary>

```text
export function startBilibiliSource(deps: BiliDeps): () => void {
  stopBilibiliSource();
  const tick = (): void => {
    void runBilibiliSource(deps).catch(() => { /* never break the host */ });
  };
  tick();
  activeTimer = setInterval(tick, BILI_FETCH_INTERVAL_MS);
  activeTimer.unref?.();
  return stopBilibiliSource;
}

export function stopBilibiliSource(): void {
  if (activeTimer !== null) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
}
```

</details>

#### 缺口

- 未核实真实账号的历史范围与恢复、删除语义
  **影响**：只能确认请求路径和本地生命周期
  **进一步探讨**：用专用测试账号检查退出或停用后是否仍有该轮请求和入池

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 部署者需要核对什么宿主、权限与数据隔离条件，怎样小范围观察？

**研究主题**：依赖、兼容与流程、采用判断、效果与总成本

#### 完整回答

Node 清单要求至少 22.19 并列出多个 DSH LLM peer RC。主循环只依赖 agents 起步，Web 面板和管理端点则需要 connection/slots 等宿主服务。RPC 使用宿主 /api 准入，并从已登记方法分派。不能识别宿主门能力时只放行低敏感只读名册，不能把其余拒绝当作插件自有身份验证；方法存在也还需要核实真正的宿主前置路由。工具注册延迟等 Host tools 可用，失败记录审计。希望了解节律而不马上将活动数据给模型的用户，可以先读源码和默认政策，使用无业务对话的专用非 Windows test profile，保持 B 站未登录，只绑定一个合成会话，并记录无主动表达时也发生的模型调用，暂只观察。这仍有后台模型调用、持久化和会话维护成本。首次配置用户权限、宿主和目录，持续维护模型预算与日志，退出后核对宿主附件和数据目录；当前无真实宿主及预算对照支持把它用于个人生产环境。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:53-67](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/package.json#L53-L67)

Node、平台与声明的 Host LLM peers。

<details>
<summary>查看原文（15行）</summary>

```text
  "engines": {
    "node": ">=22.19.0"
  },
  "os": [
    "win32",
    "linux",
    "darwin"
  ],
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.2",
    "qrcode": "^1.5.4"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-llm": "^0.1.1-rc.2 || ^0.1.5-rc.2 || ^0.1.7-rc.1 || ^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-rc.1"
  },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:49-59](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/index.ts#L49-L59)

agents 是模块启动必需项。

<details>
<summary>查看原文（11行）</summary>

```text
 * `config` either way. It is attached lazily through `ctx.inject(['settings'], …)`
 * below, so the heartbeat starts on `agents` alone and picks the form up whenever
 * the service appears.
 */
export const inject = ['agents'];

export const Config = z.object({
  /** Override the runtime data dir (workspace guard boundary). Empty = default (<packageRoot>/data). */
  dataDir: z.string().default(''),
  /** UI-editable: heartbeat interval in minutes. 0 = use policy file / factory. */
  intervalMin: z.number().default(0),
```

</details>

**依据 3 · 源码核查**：[src/rpc.ts:660-692](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/rpc.ts#L660-L692)

宿主准入依赖及低敏感只读退路。

<details>
<summary>查看原文（33行）</summary>

```text
    // ── H-41 (2026-10-07): explicit dependency on the host's /api gate ────
    // This route is mounted under the host's `/api` prefix, and that prefix's
    // check is the ONLY authentication it has — the plugin keeps no credential
    // of its own. The host implements it as `connection.admit(req)`, which
    // returns `requestRejection(req)`'s verdict (Host/Origin fence + the
    // browser-auth secret; the `/api` prefix route calls it before dispatching,
    // so this exact path can never be reached without it). If a future host
    // drops or renames that check, the destructive endpoints above would be
    // reachable by anything that can POST to loopback — so fail closed on them
    // instead of guessing, and say so in the audit log once at registration.
    const gate = remoteCtx.connection as unknown as { admit?: unknown; requestRejection?: unknown };
    const hostGuarded = typeof gate.admit === 'function' || typeof gate.requestRejection === 'function';
    if (!hostGuarded) {
      try {
        appendAuditLine(deps.guard.assert(deps.paths.logsDir + '/heartbeat.jsonl'), {
          event: 'rpc_host_gate_missing',
          detail: 'connection.admit/requestRejection absent; all but the low-sensitivity read-only verbs are refused (⑦A)',
          allowed: [...GATE_SAFE_ENDPOINTS],
        });
      } catch { /* 审计失败不影响注册 */ }
    }

    const handler = async (endpoint: unknown, payload: unknown): Promise<RpcResult> => {
      const p = (payload ?? {}) as Record<string, unknown>;
      const fn = typeof endpoint === 'string' ? endpoints.get(endpoint) : undefined;
      if (!fn) return err('bad-request', `unknown endpoint ${JSON.stringify(endpoint)}`);
      if (!hostGuarded && !GATE_SAFE_ENDPOINTS.has(endpoint as string)) {
        return err('forbidden', `host gate unavailable; ${endpoint} is refused (H-41, ⑦A)`);
      }
      try {
        return await fn(p);
      } catch (e) {
        return err('internal', String(e).slice(0, 200));
```

</details>

**依据 4 · 源码核查**：[src/rpc.ts:698-717](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/rpc.ts#L698-L717)

实际注册受宿主转发的 RPC。

<details>
<summary>查看原文（20行）</summary>

```text
    remoteCtx.effect(
      () => remoteCtx.connection.fetch.register({
        path: RPC_ROUTE_PATH,
        methods: ['POST'],
        requestBody: 'buffered',
        fetch: async (request: Request): Promise<Response> => {
          let envelope: { type?: unknown; rpcId?: unknown; payload?: unknown };
          try {
            envelope = await request.json() as typeof envelope;
          } catch {
            return new Response('body is not JSON', { status: 400 });
          }
          const rpcId = envelope?.rpcId;
          if (envelope?.type !== 'client-request' || typeof rpcId !== 'string' || typeof envelope.payload !== 'object' || envelope.payload === null) {
            return new Response('invalid envelope', { status: 400 });
          }
          const p = envelope.payload as Record<string, unknown>;
          const endpoint = typeof p.endpoint === 'string' ? p.endpoint : '(missing endpoint)';
          const result = await handler(endpoint, p);
          return Response.json({ type: 'server-response', rpcId, result });
```

</details>

**依据 5 · 源码核查**：[src/index.ts:429-446](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/index.ts#L429-L446)

工具能力就绪后注册，没有则审计。

<details>
<summary>查看原文（18行）</summary>

```text
  // to an audit line on a host without a registerable ToolRuntime. One factory
  // now covers both; the audit event names are unchanged.
  const registerGlobalTool = (name: string, build: () => unknown): void => {
    ctx.inject(['tools'], (scoped: unknown) => {
      const audit = (entry: Record<string, unknown>): void => {
        try {
          appendAuditLine(guard.assert(paths.logsDir + '/heartbeat.jsonl'), entry);
        } catch { /* audit must never break startup */ }
      };
      try {
        const tools = (scoped as { tools?: { register(definition: unknown): () => void } }).tools;
        if (!tools || typeof tools.register !== 'function') throw new Error('ToolRuntime.register unavailable on this host');
        tools.register(build());
        audit({ event: `${name}_tool_registered` });
      } catch (e) {
        audit({ event: `${name}_tool_register_failed`, error: String(e).slice(0, 160) });
      }
    });
```

</details>

**依据 6 · 作者声明**：[README.md:87-94](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/README.md#L87-L94)

作者列出的加密与明文数据范围。

```text
## 数据与隐私

所有运行数据都收在 `~/.dsh/heartbeat-data`（也可通过插件配置 `dataDir` 或环境变量 `HEARTBEAT_DATA_DIR` 改位置）：

- **敏感数据整文件加密**：素材池（`seeds.jsonl`）、用户画像（`profile.*`）、心事匣、周报、屏幕快照与 B 站登录态均以 **AES-256-GCM** 加密落盘；主密钥 `data/vault.key` 在 Windows 上由系统 **DPAPI（仅当前账户可解）** 保护。
- **你写的东西保持明文**：设置项（`data/settings/`）、账本（`ledger.md`）、摘抄本（`excerpts.md`）和审计日志（`data/logs/heartbeat.jsonl`）直接用编辑器就能翻看。
- **隐私不出界**：全屏截图仅在视觉识别成功时提取一句状态摘要（「他此刻大概在…」），识别失败时画面与窗口标题绝不进入任何提示词；引擎室内部轮次受工具白名单硬限制。
- **换机与焚毁**：换电脑可在面板「设置 → 换机迁移」用口令打包导出、新机导入自动重加密；想彻底清空可跑 CLI `burn --yes`（三次覆写后删除运行时数据）。
```

#### 缺口

- 真实宿主版本、HTTP 认证链和低成本配置尚未验收
  **影响**：只适合观察实现及合成任务，不能推广到生产会话
  **进一步探讨**：固定一个 Host、检查未登录和跨站请求返回，然后以合成数据检查模型请求和全部输出

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 在不破坏提醒效果的前提下，先做一次廉价检查能减少无用心跳请求吗？

**研究主题**：新假设与验证

#### 完整回答

提出待验证设计。用可确定、跨整跳稳定的前提做前置筛选，例如仅需主动提示的模式中缺可用投递目标或用户暂停，跳过只为该次提示服务的模型步骤；独立的维护和离线资料可保持各自策略。表达前仍需重新确认忙闲与日限，避免把过时判断当送达。推导是当前日志能区分阶段，而静默可在已启动维护和浏览后发生；全部归档目标也在表达时才过滤。用相同定时输入、模拟 Host 会话事件和模型计数器重放现有和前置版本，分别测试短时恢复、长期归档、恢复后第一条有用提示和独立维护。只有单位合格提示的模型请求下降，且信息完整性、提醒及时性和误打扰没有明显恶化，才算成立；如果恢复后错过重要窗口，或失去资料维护使合格提示减少，推翻该配置下的收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/orchestrator.ts:2449-2465](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L2449-L2465)

大量条件阶段在表达决策前。

<details>
<summary>查看原文（17行）</summary>

```text
        const phase = { signal: ctl.signal, cancelBeat: ctl };
        await withTimeout(maintenancePhase(bc), MAINTENANCE_TIMEOUT_MS, 'maintenance', phase);
        appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'phase_done', phase: 'maintenance' });
        await weeklyPhase(bc);
        await withTimeout(collectPhase(bc), COLLECT_TIMEOUT_MS, 'collect', phase);
        appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'phase_done', phase: 'collect' });
        wandered = await withTimeout(wanderPhase(bc), WANDER_TIMEOUT_MS, 'wander', phase);
        appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'phase_done', phase: 'wander' });
        // spec ⑥: refill wander is independent and may stack with a normal
        // wander in the same beat (user decision 2026-09-18).
        const refilled = await withTimeout(refillWanderPhase(bc), WANDER_TIMEOUT_MS, 'refill_wander', phase);
        if (refilled) {
          appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'phase_done', phase: 'refill_wander' });
        }
        wandered = wandered || refilled;
        await expressionPhases(bc);
      }
```

</details>

**依据 2 · 源码核查**：[src/core/orchestrator.ts:1773-1793](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L1773-L1793)

归档目标到投递时才被筛掉。

<details>
<summary>查看原文（21行）</summary>

```text
  // H-archived: an archived session resumes fine, but DSH's ArchivedSessionGate
  // rejects its pre-step — the turn ends `blocked` with zero output, and the
  // audit used to misfile that as a language failure. Check the disk truth for
  // archived ids BEFORE bringing any target live; the filter lives at the call
  // site, `deliverTargets` itself stays unfiltered (bindings keeps its
  // single-purpose semantics).
  const archived = loadArchivedSessionIds();
  const all = deliverTargets(data).filter((b) => b.sessionId !== homeId);
  const { usable: targets, skipped } = splitDeliverTargets(all, archived);
  if (skipped.length > 0) {
    appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
      event: 'deliver_target_skipped', reason: 'archived',
      targets: skipped.map((t) => t.sessionId).join(','),
    });
  }
  if (targets.length === 0 && all.length > 0) {
    appendAuditLine(paths.logsDir + '/heartbeat.jsonl', {
      event: 'spoke_failed', reason: 'all deliver targets archived',
    });
    noteBeat('spoke_failed', { reason: 'all deliver targets archived' });
    return;
```

</details>

**依据 3 · 源码核查**：[src/core/orchestrator.ts:1845-1854](https://github.com/Kanadego/dsh-heartbeat/blob/2b98572231f8b1aa852fb04a49bec477eb8e9ee5/src/core/orchestrator.ts#L1845-L1854)

后置复查仍能拦截当下状态变化。

<details>
<summary>查看原文（10行）</summary>

```text
    throwIfAborted(bc.signal, 'expression');
    // HB-14: re-check everything that decides "is this a good moment" - quiet
    // hours, cap, cooldown, busy window, actively typing - not just the first
    // two. The delivery happens minutes after the gate decision.
    const pre = await canSendLive(guard, policy, paths, Date.now(), bc.signal);
    if (!pre.ok) {
      appendAuditLine(paths.logsDir + '/heartbeat.jsonl', { event: 'spoke_failed', reason: pre.reason });
      noteBeat('spoke_failed', { reason: pre.reason });
      return;
    }
```

</details>

#### 缺口

- 设想未实现，需求和阈值待验证
  **影响**：不能将预测节省计作当前贡献
  **进一步探讨**：为阶段行为与可交付结果做受控回放，分别测提醒与维护质量

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
