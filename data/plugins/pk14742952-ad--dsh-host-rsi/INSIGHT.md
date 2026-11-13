# dsh-host-rsi

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7de2722](https://github.com/pk14742952-AD/dsh-host-rsi/tree/7de27224616f3bfcb3b596d86e5ea5a1a846fa74)

<!-- BEGIN META -->
[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pk14742952-AD/dsh-host-rsi)
<!-- END META -->

> **功能**：在 DSH Agent 的任务前后检索、捕获经验并可追加交付复查。

> **亮点**：[Q01](#research-q01) 的经验取用移到宿主任务开始处，[Q02](#research-q02) 说明任务变化与后续工具失败可触发检索。

> **主要限制**：[Q03](#research-q03) 需核对自动追加回合的成本、写入用户任务与回答的范围，以及异常退出时经验的落盘。

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
  - [Q01 · 重复执行 DSH 任务时，插件给手工维护经验的流程增加什么？](#detail-section-11)
  - [Q02 · 启用后经验从哪里来，又怎样送入 Agent？](#detail-section-12)
  - [Q03 · 自动复查及落盘会引入什么代价？](#detail-section-13)
  - [Q04 · 怎样判断经验注入是否带来可复验的净收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同一项目反复执行可检验任务时，取用相关经验与归纳执行结果。

手工维护项目说明和经验文件，在每次任务开始时显式提供。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 经验注入 | 任务前提供相关经验 | 命中及宿主接口 |
| 交付守卫 | 条件追加复查 | 可能增加调用和轨迹 |
| 经验捕获 | 后续任务复用 | 有条件持久化，检查数据范围 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主及适配 hooks | 必需 | 接收会话和回合事件 | 确认注册及回调消费 |
| 本地可写目录 | 捕获需要 | 保存经验和轨迹 | 独立核查实际写入 |
| Web 与注入接口 | 视能力 | 仪表板及提示替换 | 核各自退路 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 设置显式独立可写目录与无敏感样本 | 核初始设置 |
| 观察 | 重复跑固定验证任务并对照 | 核测试、命中和附加调用 |
| 退出 | 关闭总开关并验证新配置，再核对独立试验目录 | 确认无新增写入，按需移除存量并恢复手工说明 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与存储 | 构造对照及验收 | 版本兼容未验 |
| 持续 | 可能增加模型回合 | 查看误注入、存储和账单 | 实际净成本未知 |
| 退出 | 独立目录留存或清除 | 核可恢复状态 | 进程退出窗口需测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 经验复用 | 任务前检索和注入 | 真实准确率和效率 |
| 交付复查 | 按条件追加尝试 | 能否减少失败且控制成本 |

> **思考**：[Q03](#research-q03) 需核对自动追加回合的成本、写入用户任务与回答的范围，以及异常退出时经验的落盘。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的经验取用移到宿主任务开始处，[Q02](#research-q02) 说明任务变化与后续工具失败可触发检索。

[Q02](#research-q02) 兼容多个事件和注入入口，[Q03](#research-q03) 对索引按文件改名，异常退出测试须覆盖待写窗口。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 需核对自动追加回合的成本、写入用户任务与回答的范围，以及异常退出时经验的落盘。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用显式独立目录和无敏感任务试验。停用注入后验证宿主按新配置生效。要停止捕获与复查则关闭总开关，待停用后再单独核对和清理已写入的独立目录。按 [Q04](#research-q04) 的对照决定是否长期使用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定宿主及存储链已核。尚无运行对照及故障测量。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、index.js、lib/store.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核固定 DSH 插件、客户端及本地存储代码。
- 下一步：[Q04](#research-q04) 的模型质量、工具重复与落盘对照均待运行。

**分析版本**

- **仓库**：[pk14742952-AD/dsh-host-rsi](https://github.com/pk14742952-AD/dsh-host-rsi)
- **版本号**：0.3.1（[固定提交 7de2722](https://github.com/pk14742952-AD/dsh-host-rsi/tree/7de27224616f3bfcb3b596d86e5ea5a1a846fa74)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 通过重复验证任务的启用对照检验自动注入是否改善实际测试，且增加的回合和误命中可接受。

[Q04](#research-q04) 的模型质量、工具重复与落盘对照均待运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1935 | — | — | 25300 |
| .js | source | 13 | 3447 | 2620 | 696 | — |
| .mjs | source | 2 | 344 | 296 | 32 | — |
| .js | test | 15 | 2284 | 2000 | 85 | — |
| .mjs | test | 1 | 52 | 38 | 9 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/pk14742952-AD/dsh-host-rsi/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 RSI 如何在重复 DSH 任务中取用经验、收敛和追记，以及代价、持久化边界和启用对照。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 重复执行 DSH 任务时，插件给手工维护经验的流程增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在同一项目反复交付和验证的人。插件可在任务执行前按文本及项目提示检索经验，默认每任务至多两次、初次候选上限三条，并在回合末有条件地形成经验。相对每次打开手工经验文件，它改变了经验取用时机和输入来源，是否节省时间取决于检索准确率和回合末提取质量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-17](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/README.md#L15-L17)

作者描述经验积累和相似任务使用。

```text
> **它是什么？** 一个给 DSH（DeepSeek Harness）用的**宿主侧记忆 / 自进化插件**：
> 安静地观察每次会话——模型自检结论、工具成败、用户纠正与长期偏好——
> 把高价值经验沉淀为「**可信教训**」，下次遇到相似任务**自动注入**，让本地大模型**越用越强**。
```

**依据 2 · 源码核查**：[cordis.patch.yml:1-15](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/cordis.patch.yml#L1-L15)

默认开启及注入预算。

<details>
<summary>查看原文（15行）</summary>

```text
- insert:
    - id: dsh-host-rsi
      name: 'dsh-host-rsi'
      config:
        enabled: true            # 总开关；false 时插件完全空操作
        # dir 省略 = 默认 ~/.dsh/rsi-memory（DSH_HOME 环境变量可覆盖），不再写死盘符；
        # 如需自定义位置，取消注释并填绝对路径：
        # dir: "C:\\Users\\me\\.dsh\\rsi-memory"
        flushMs: 1000           # 后台写入防抖间隔（ms）
        dashboard: { enabled: true, host: "127.0.0.1", port: 0, recent: 15, webserver: true }   # 环回仪表板("打开仪表板"目标) + DSH 同源 /rsi 路由(设置页实时拉取)；port 0=随机，webserver=false 只留环回
        inject: { topK: 3, tokenBudget: 1000, candCap: 40, enabled: true, oncePerTask: false, selfCheck: true, maxInjectsPerTask: 2, reinjectOn: [tool-failure, repeated-failure], compactTopK: 1, compactTokenBudget: 300 }
        capture: { enabled: true, maxPerSession: 10, minChars: 300, dedupeThreshold: 0.8 }
        escalate: { enabled: true, maxCriticsPerSession: 3, selfConsistency: 1, threshold: 0.6 }
        convergence: { enabled: true, repeatThreshold: 3, models: [] }
        guard: { enabled: true, maxRetries: 2, maxPerSession: 4, thresholdEmpty: 400, thresholdFile: 2000, sameToolStreak: 3, fileTurnRe: 'file|write|create|generate|implement|fix|script|\.(?:js|ts|py|json|md|yml|yaml)|文件|创建|编写|生成|修复|脚本', tasksRe: 'write|create|fix|implement|optimize|design|analyze|generate|refactor|debug|test|build|migrate|check|translate|convert|编写|写|创建|修复|实现|优化|设计|分析|生成|重构|调试|测试|构建|迁移|检查|翻译|转换', recordTrajectory: true }
```

</details>

**依据 3 · 源码核查**：[index.js:853-878](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L853-L878)

采集使用回合任务、答案和工具上下文，有条件写入。

<details>
<summary>查看原文（26行）</summary>

```text
      if (cfg.capture.enabled) {
        const r = captureFromContext({
          task: { text: task },
          answerText: answer,
          toolResults: tools,
          userTap: event?.userTap,
          threshold: cfg.escalate.threshold,
        });
        const sig = outcomeSignal({ taskText: task, answerText: answer, toolResults: tools });
        runtime.lastReason = sig.hasVerifyTag ? 'verify-tag' : sig.hadFailure ? 'failure' : sig.ranTools ? 'tool-run' : 'decision';
        const existingTop = store.findSimilar(r.lesson, 8);
        if (r.capture && shouldCapture({ taskText: task, answerText: answer, toolResults: tools, cfg, session: s, existingTop })) {
          store.addLesson({ ...r.lesson, sourceRef: event?.id ?? null }); // enqueues background write
          store.addTrajectory({ ...r.trajectory, id: event?.id ?? undefined });
          s.captures += 1;
          runtime.captures += 1;
          runtime.lastCapture = task;

          const esc = shouldEscalate({ scorer: r.scorer, verdict: r.tag?.verdict, conf: r.tag?.conf, tag: r.tag, threshold: cfg.escalate.threshold, answerText: answer });
          if (esc.do && hasFollowup && criticBudgetOk({ cfg, session: s })) {
            const n = cfg.escalate.selfConsistency ?? 1;
            for (let i = 0; i < n && s.critics < (cfg.escalate.maxCriticsPerSession ?? 4); i += 1) {
              followup(criticPrompt(task, answer));
              s.critics += 1;
              runtime.critics += 1;
            }
```

</details>

#### 缺口

- 同类任务中的经验命中率与节时无测量。
  **影响**：会影响持续开启价值。
  **进一步探讨**：对照手工项目说明与插件运行。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启用后经验从哪里来，又怎样送入 Agent？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

宿主启用后打开本地经验存储，注册 pre-step、事件和回合结束处理。任务变化时用项目提示触发检索，工具失败可触发受限的补充注入。检索命中时优先用 agent.inject，缺少该能力时尝试系统提示分段接口，并撤去前次分段。兼容注册采用尝试分支，注册了部分事件的环境仍需实查整条链。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:328-340](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L328-L340)

总开关和打开经验存储。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx, config = {}) {
  const cfg = normalize(config);
  const disposers = [];

  // Master switch off -> full no-op, zero host interaction.
  if (cfg.enabled === false) return () => {};

  // Migration must run BEFORE openStore: openStore creates the dir layout, and
  // migrateLegacyDir skips copying when the target already exists. Only skip when the
  // user chose an explicit dir in config — a DSH_HOME-set default is still auto-migrated.
  if (!config.dir) migrateLegacyDir(cfg.dir);
  const store = openStore(cfg.dir, { flushMs: cfg.flushMs });
  store.ensureLayout();
```

</details>

**依据 2 · 源码核查**：[index.js:463-489](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L463-L489)

检索、替换与注入入口。

<details>
<summary>查看原文（27行）</summary>

```text
  function pushInjection(s, event, query, opts) {
    const block = store.search(query, opts); // in-memory, budget-capped
    if (!block) return false;
    const agent = event?.agent ?? safeGet(ctx, 'agent');
    if (agent?.inject) {
      try {
        agent.inject(block);
        return true;
      } catch {
        return false;
      }
    }
    const sp = safeGet(event, 'systemPrompt') ?? systemPromptService(ctx);
    if (sp?.section) {
      try {
        if (typeof s.injectDispose === 'function') {
          s.injectDispose();
          s.injectDispose = null;
        }
        const d = sp.section({ name: 'rsi-inject', order: 320, text: block });
        if (typeof d === 'function') s.injectDispose = d;
        return true;
      } catch {
        return false;
      }
    }
    return false;
```

</details>

**依据 3 · 源码核查**：[index.js:667-703](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L667-L703)

任务变化与失败后补充。

<details>
<summary>查看原文（37行）</summary>

```text
  function handlePreStep(event, source) {
    recordEvent(source);
    try {
      const key = sessionKey(event, ctx);
      const task = taskText(event) || lastUserBySession.get(key)?.task || '';
      const s = sess(key);
      if (!task) return;
      ensureSelfCheck(event);
      if (task !== s.lastTask) {
        s.lastTask = task;
        s.lastTaskInjectCount = 0;
        s.failureStreak = 0;
        s.pendingReinject = false;
        s.reinjectQuery = '';
        runtime.taskChanges += 1;
        const opts = {
          ...cfg.inject,
          topK: cfg.inject.topK,
          tokenBudget: cfg.inject.tokenBudget,
          // Scoping hint: lets the store/retrieve surface standing rules for THIS project
          // even when the task wording shares no vocabulary with them.
          project: eventProject(event, task),
        };
        if (pushInjection(s, event, task, opts)) {
          s.lastTaskInjectCount += 1;
          runtime.injects += 1;
          runtime.lastInject = task;
        }
      } else if (
        !cfg.inject.oncePerTask &&
        task &&
        s.lastTask === task &&
        s.lastTaskInjectCount < (cfg.inject.maxInjectsPerTask ?? 2)
      ) {
        const toolReinject = s.pendingReinject && reinjectAllowed('tool-failure');
        const repeatReinject = s.failureStreak >= 2 && reinjectAllowed('repeated-failure');
        if (toolReinject || repeatReinject) {
```

</details>

**依据 4 · 源码核查**：[index.js:1030-1056](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L1030-L1056)

DSH hooks 与兼容处理。

<details>
<summary>查看原文（27行）</summary>

```text
    for (const name of PRE_STEP_EVENTS) {
      try {
        ctx.on(name, (event, next) => {
          handlePreStep(event, name);
          return next?.();
        });
      } catch { /* host may not expose this event -> no-op */ }
    }
  }

  // (3) turn/end: failure tracking for balanced injection, plus gated capture and
  //     auto-escalate. Capture is short-circuited by shouldCapture BEFORE persistence;
  //     addLesson/addTrajectory only enqueue a backgrounded flush (no blocking I/O).
  if (ctx?.on) {
    try {
      ctx.on(SESSION_EVENT, handleSessionEvent);
    } catch { /* host may not expose session/event -> no-op */ }
    for (const name of TURN_END_EVENTS) {
      try {
        ctx.on(name, (event) => handleTurnEnd(event, name));
      } catch { /* host may not expose this event -> no-op */ }
    }
    for (const name of MESSAGE_EVENTS) {
      try {
        ctx.on(name, (event) => handleMessage(event, name));
      } catch { /* host may not expose this event -> no-op */ }
    }
```

</details>

#### 缺口

- 实际 DSH 版本的 hook 顺序和注入成功未验。
  **影响**：可能只看到部分行为。
  **进一步探讨**：用一条可追踪经验核对命中、替换和消费。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动复查及落盘会引入什么代价？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

交付守卫按任务、工具状态和答案等线索判定，条件触发时可能用 followup 再调用，且单独存在最终一次机会。仍未交付可将任务与答案记入轨迹。落盘计时器可以不阻止进程退出，独立临时文件改名也无跨索引事务。默认开启的捕获及轨迹应在无敏感数据的独立环境先量化追加调用和检查磁盘，再考虑共享或长期运行。 关闭 inject.enabled 后按新配置应用插件时不注册 pre-step 注入，用户消息注入路径也会提前返回。停全部新增行为应关闭总开关并核实宿主已重新应用配置。卸载回调会尝试关闭存储并 flush，已有索引、经验镜像和轨迹仍需单独处理。存储内部逐条删除只改索引，没有同步擦除镜像及轨迹的逻辑。试验用显式独立目录，完全停用后由操作者核对并按需清理该目录。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:536-557](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L536-L557)

守卫根据可见任务和执行信号推断。

<details>
<summary>查看原文（22行）</summary>

```text
  // usable answer. On a failure state the plugin asks the model to immediately re-output
  // a complete, closed deliverable instead of recording a broken lesson. Retry budget is
  // per turn (maxRetries) and per session (maxPerSession); after exhaustion the rejected
  // turn is logged as a quarantined trajectory so the user still sees what happened.
  function guardEligible(task, tools) {
    if (tools.length > 0) return true; // tool loops always worth watching
    const re = cfg.guard?.tasksRe;
    if (!re) return true;
    try {
      return new RegExp(re, 'i').test(String(task || ''));
    } catch {
      return false;
    }
  }
  function runGuard(s, event, task, answer, tools) {
    const g = cfg.guard || {};
    if (g.enabled === false) return false;
    if (!guardEligible(task, tools)) return false;
    const verdict = classifyLoop({
      answerText: answer,
      prevAnswerText: s.prevAnswer || '',
      toolCalls: tools.map((t) => t?.name).filter(Boolean),
```

</details>

**依据 2 · 源码核查**：[index.js:573-617](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L573-L617)

守卫预算、最终一次机会和未交付轨迹。

<details>
<summary>查看原文（45行）</summary>

```text
    runtime.guard.fired += 1;
    const maxPerSession = g.maxPerSession ?? 4;
    const maxRetries = g.maxRetries ?? 2;
    const attempt = s.guardAwaiting?.attempts || 0;
    const canRetry = hasFollowup && s.guardRetries < maxPerSession && attempt < maxRetries;
    if (canRetry) {
      s.guardAwaiting = { state: verdict.state, attempts: attempt + 1 };
      s.guardRetries += 1;
      runtime.guard.retries += 1;
      runtime.lastReason = `guard:${verdict.state}`;
      followup(guardCorrectionPrompt(task, verdict.state, answer, verdict.reason));
      return true;
    }
    // Instance-level final defense (issue#3: 3/50 instances finish empty-handed even with a
    // per-turn guard). When the per-turn retry budget is exhausted, issue ONE session-level
    // ultimatum before marking the instance undelivered; a subsequent OK still counts as a
    // rescue. Never more than once per session, and only when a followup channel exists.
    if (g.finalChance !== false && hasFollowup && !s.guardFinalChance) {
      s.guardFinalChance = true;
      s.guardAwaiting = { state: verdict.state, attempts: attempt + 1 };
      runtime.guard.finalChances += 1;
      runtime.lastReason = `guard-final-chance:${verdict.state}`;
      followup(guardFinalChancePrompt(task, verdict.state, verdict.reason));
      return true;
    }
    runtime.guard.undelivered += 1;
    s.guardAwaiting = null;
    runtime.lastReason = `guard-unresolved:${verdict.state}`;
    if (g.recordTrajectory !== false) {
      try {
        store.addTrajectory({
          id: event?.id ? `guard-${event.id}` : undefined,
          ts: Date.now(),
          task,
          answer,
          state: verdict.state,
          reason: verdict.reason,
          domain: 'guard',
          layer: 'Q',
          trusted: false,
          sourceKind: 'guard',
          summary: `delivery guard unresolved (${verdict.state}): ${verdict.reason}`,
        });
      } catch { /* trajectory write is best-effort */ }
    }
```

</details>

**依据 3 · 源码核查**：[lib/store.js:107-149](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/lib/store.js#L107-L149)

防抖计时器、待写队列与分别原子改名。

<details>
<summary>查看原文（43行）</summary>

```text
  // --- backgrounded, debounced flush ---
  function scheduleFlush() {
    dirty = true;
    if (disabled || flushTimer) return;
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flushSync();
    }, flushMs);
    if (typeof flushTimer.unref === 'function') flushTimer.unref(); // never hold the process
  }

  /**
   * Write all pending state to disk. Best-effort: returns true on success, keeps `dirty`
   * on failure so the next flush retries. Never throws.
   */
  function flushSync() {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (disabled) {
      // Persistence is off: nothing can be written. Drop queued traces/mirrors so the
      // buffers never grow unboundedly in a degraded session (they are unrecoverable
      // anyway — the dir is unwritable).
      dirty = false;
      trajBuf.length = 0;
      mirrorBuf.length = 0;
      return false;
    }
    if (!dirty && trajBuf.length === 0 && mirrorBuf.length === 0) return false;
    let ok = true;
    try {
      // Atomic replace: write to a sibling temp file then rename over the target, so a
      // crash mid-write leaves the previous intact index instead of a truncated one.
      const tmpIndex = indexFile + '.tmp';
      fs.writeFileSync(tmpIndex, JSON.stringify(rows, null, 2), 'utf8');
      fs.renameSync(tmpIndex, indexFile);
      const out = {};
      for (const [t, ids] of termIndex) out[t] = [...ids];
      const tmpTerm = termIndexFile + '.tmp';
      fs.writeFileSync(tmpTerm, JSON.stringify(out, null, 2), 'utf8');
      fs.renameSync(tmpTerm, termIndexFile);
    } catch {
```

</details>

**依据 4 · 源码核查**：[index.js:328-340](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L328-L340)

总开关关闭时 apply 直接返回，显式目录跳过默认目录迁移。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx, config = {}) {
  const cfg = normalize(config);
  const disposers = [];

  // Master switch off -> full no-op, zero host interaction.
  if (cfg.enabled === false) return () => {};

  // Migration must run BEFORE openStore: openStore creates the dir layout, and
  // migrateLegacyDir skips copying when the target already exists. Only skip when the
  // user chose an explicit dir in config — a DSH_HOME-set default is still auto-migrated.
  if (!config.dir) migrateLegacyDir(cfg.dir);
  const store = openStore(cfg.dir, { flushMs: cfg.flushMs });
  store.ensureLayout();
```

</details>

**依据 5 · 源码核查**：[index.js:726-734](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L726-L734)

关闭 inject.enabled 时跳过用户消息驱动的注入。

```text
  // injection reliable across DSH versions, also trigger at the user message itself. This
  // matches the durable "task change" gate: only the first time a task text appears.
  function maybeInjectOnUserMessage(key, content, event) {
    if (!cfg.inject.enabled || !content) return;
    try {
      const s = sess(key);
      if (content === s.lastTask) return;
      s.lastTask = content;
      s.lastTaskInjectCount = 0;
```

**依据 6 · 源码核查**：[index.js:1026-1039](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L1026-L1039)

关闭 inject.enabled 时不注册 pre-step 注入。

<details>
<summary>查看原文（14行）</summary>

```text
  // (2) Gated inject on pre-step. Default behavior is balanced: full injection on task
  //     change, then only small re-injections when the same task fails and reinjectOn
  //     enables that path. oncePerTask=true restores the old strict single-inject mode.
  if (cfg.inject.enabled && ctx?.on) {
    for (const name of PRE_STEP_EVENTS) {
      try {
        ctx.on(name, (event, next) => {
          handlePreStep(event, name);
          return next?.();
        });
      } catch { /* host may not expose this event -> no-op */ }
    }
  }

```

</details>

**依据 7 · 源码核查**：[index.js:1201-1210](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L1201-L1210)

卸载只尝试关闭存储。

<details>
<summary>查看原文（10行）</summary>

```text
    try { dashClose?.(); } catch { /* ignore */ }
    webRouteStore = null;
    webRouteCfg = null;
    webRouteSnapshot = null;
    webRoute = null;
    try {
      store.close();
    } catch {
      /* ignore */
    }
```

</details>

**依据 8 · 源码核查**：[lib/store.js:184-190](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/lib/store.js#L184-L190)

关闭存储调用 flushSync 后停止计时器。

```text
  /** Tear down: flush + stop the timer. Call on plugin cleanup. */
  function close() {
    flushSync();
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
```

**依据 9 · 源码核查**：[lib/store.js:64-71](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/lib/store.js#L64-L71)

索引、镜像和轨迹位于同一存储目录。

```text
export function openStore(dir, opts = {}) {
  const root = path.resolve(dir);
  const lessonsDir = path.join(root, 'lessons');
  const quarDir = path.join(root, 'quarantined');
  const trajDir = path.join(root, 'trajectories');
  const indexFile = path.join(root, 'index.json');
  const termIndexFile = path.join(root, 'termindex.json');
  const flushMs = opts.flushMs ?? 500;
```

**依据 10 · 源码核查**：[lib/store.js:365-381](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/lib/store.js#L365-L381)

逐条移除只修改索引，轨迹单独排队写入。

<details>
<summary>查看原文（17行）</summary>

```text

    /** Drop a lesson from the cache + inverted index (persisted on flush). */
    remove(id) {
      const keep = rows.filter((r) => r.id !== id);
      rows.length = 0;
      for (const r of keep) rows.push(r);
      removeTermsFor(id);
      scheduleFlush();
      return true;
    },

    /** Buffer a raw trace (written to trajectories/ on flush); returns the file path. */
    addTrajectory(trace) {
      const file = path.join(trajDir, `${trace.ts || now()}_${trace.id || newId()}.jsonl`);
      trajBuf.push({ file, body: JSON.stringify(trace) + '\n' });
      scheduleFlush();
      return file;
```

</details>

#### 缺口

- 硬退出丢失范围、磁盘内容和实际追加调用无测量。
  **影响**：影响留存边界与持续成本。
  **进一步探讨**：在独立临时存储注入可识别假数据，检查退出前后数据、额外回合和费用。
- 真实宿主上的配置重载及卸载后文件清单未验。
  **影响**：关闭一个开关后的活跃会话和数据留存仍需核实。
  **进一步探讨**：在独立目录重新应用配置并另开会话核无新增注入或写盘，停用后核对目录再清理。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样判断经验注入是否带来可复验的净收益？

**研究主题**：新假设与验证

#### 完整回答

挑选有固定验收结果的重复验证任务，在相同宿主、模型与工具预算下对照手工项目说明和启用 RSI 的独立副本。预置一条有关经验和一条同词干扰经验，用真实测试成功、重复工具次数、追加调用、时延和干扰命中验收。另在防抖窗口内及 flush 后分别强制退出，重开检查经验和轨迹。若新增回合或错误注入抵消收益，退回手工说明。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:463-489](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L463-L489)

经验检索和注入可作为对照变量。

<details>
<summary>查看原文（27行）</summary>

```text
  function pushInjection(s, event, query, opts) {
    const block = store.search(query, opts); // in-memory, budget-capped
    if (!block) return false;
    const agent = event?.agent ?? safeGet(ctx, 'agent');
    if (agent?.inject) {
      try {
        agent.inject(block);
        return true;
      } catch {
        return false;
      }
    }
    const sp = safeGet(event, 'systemPrompt') ?? systemPromptService(ctx);
    if (sp?.section) {
      try {
        if (typeof s.injectDispose === 'function') {
          s.injectDispose();
          s.injectDispose = null;
        }
        const d = sp.section({ name: 'rsi-inject', order: 320, text: block });
        if (typeof d === 'function') s.injectDispose = d;
        return true;
      } catch {
        return false;
      }
    }
    return false;
```

</details>

**依据 2 · 源码核查**：[index.js:1063-1077](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/index.js#L1063-L1077)

工具前后处理提供可观察节点。

<details>
<summary>查看原文（15行）</summary>

```text
  if (cfg.convergence.enabled !== false && ctx?.on) {
    try {
      ctx.on('tools/pre-execute', (exec, next) => {
        try {
          if (exec?.agent && isSourceEdit(exec.name) && convergenceActiveFor(exec.agent)) resetState(convergenceStateOf(exec.agent));
        } catch { /* never block the tool waterfall */ }
        return next?.();
      });
    } catch { /* host may not expose this event -> no-op */ }
    try {
      ctx.on('tools/post-execute', async (exec, result, next) => {
        let steer = null;
        try {
          if (exec?.agent && isShellTool(exec.name) && result?.isError !== true && convergenceActiveFor(exec.agent)) {
            steer = observeShell(convergenceStateOf(exec.agent), commandOf(exec.arguments), resultText(result), cfg.convergence.repeatThreshold, cfg.convergence.windowSize);
```

</details>

**依据 3 · 源码核查**：[lib/store.js:107-149](https://github.com/pk14742952-AD/dsh-host-rsi/blob/7de27224616f3bfcb3b596d86e5ea5a1a846fa74/lib/store.js#L107-L149)

落盘边界提供故障注入时点。

<details>
<summary>查看原文（43行）</summary>

```text
  // --- backgrounded, debounced flush ---
  function scheduleFlush() {
    dirty = true;
    if (disabled || flushTimer) return;
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flushSync();
    }, flushMs);
    if (typeof flushTimer.unref === 'function') flushTimer.unref(); // never hold the process
  }

  /**
   * Write all pending state to disk. Best-effort: returns true on success, keeps `dirty`
   * on failure so the next flush retries. Never throws.
   */
  function flushSync() {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (disabled) {
      // Persistence is off: nothing can be written. Drop queued traces/mirrors so the
      // buffers never grow unboundedly in a degraded session (they are unrecoverable
      // anyway — the dir is unwritable).
      dirty = false;
      trajBuf.length = 0;
      mirrorBuf.length = 0;
      return false;
    }
    if (!dirty && trajBuf.length === 0 && mirrorBuf.length === 0) return false;
    let ok = true;
    try {
      // Atomic replace: write to a sibling temp file then rename over the target, so a
      // crash mid-write leaves the previous intact index instead of a truncated one.
      const tmpIndex = indexFile + '.tmp';
      fs.writeFileSync(tmpIndex, JSON.stringify(rows, null, 2), 'utf8');
      fs.renameSync(tmpIndex, indexFile);
      const out = {};
      for (const [t, ids] of termIndex) out[t] = [...ids];
      const tmpTerm = termIndexFile + '.tmp';
      fs.writeFileSync(tmpTerm, JSON.stringify(out, null, 2), 'utf8');
      fs.renameSync(tmpTerm, termIndexFile);
    } catch {
```

</details>

#### 缺口

- 对照尚未执行。
  **影响**：实际任务质量、延迟和数据风险无法量化。
  **进一步探讨**：记录每轮测试、工具、模型调用和落盘结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
