# Oh My DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9a5fd6b](https://github.com/gulagala001/oh-my-dsh/tree/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90)

<!-- BEGIN META -->
[![GitHub ★ 50](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=50&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/gulagala001/oh-my-dsh)
<!-- END META -->

> **功能**：面向固定 DSH 宿主版本的增强插件，提供工具结果缩减、原文回查和任务工作流。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 确认原文档案与工具结果缩减分层，可在同请求有完整基线时使用重复引用及精确差异。

> **主要限制**：[Q03](#research-q03) 原文可读依赖存档、事件绑定和作用域。输入估算与实际费用不同。[Q04](#research-q04) 根 bundle 扩大宿主变更范围，单独开关不等于全包退出。

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
  - [Q01 · 相比人工重开或原生压缩增加什么？](#detail-section-11)
  - [Q02 · 长上下文在哪个执行入口被处理？](#detail-section-12)
  - [Q03 · 缩减会保留什么，失败会如何处理？](#detail-section-13)
  - [Q04 · 怎样采用、停止并恢复？](#detail-section-14)
  - [Q05 · 能否用固定长会话验证缩减的净价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长代码会话中反复读同一批源码的 DSH 维护者，希望减少输入内容并仍能回查关键证据。

沿用 DSH 的完整工具结果和原生压缩，长会话时人工留摘要或重开并重读关键文件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Agent/Preset**：Oh My DSH 默认预设组合
- **事件监听**：工具结果、原生事件和模型请求
- **界面**：DSH Web 客户端与上下文控制台声明

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 0.2.2-rc.1、Node 24.9 起 | 固定版本要求 | 加载根 bundle 和宿主适配 | 实际加载可能失败 |
| OMD 预设或符合增强条件的会话 | 缩减路径必需 | 选择作用域 | 按原结果处理 |
| 原文目录及可匹配的会话事件 | 回查所需 | 绑定工具结果与持久化原文 | 保留原结果或回查失败 |
| 独立 profile 与模型 | 观察所需 | 比较与退出 | 无法区分宿主替换影响 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者保留原生 profile 和任务副本 | 有独立回退路径 |
| 加载 | 以固定匹配宿主装载插件 | 预设、设置与权限可确认 |
| 执行 | 在副本重复读取同一文件 | 查缩减记录及原文 |
| 验收 | 比较原文、结论、估算和真实用量 | 异常先关闭，再回原生流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配 Host、依赖、模型与独立 profile | 配置并验明替换组件和权限 | 安装、迁移和权限复验人时未知 |
| 持续使用 | 模型请求、原文磁盘及处理开销 | 核对原文、缩减结果及计费 | 净成本、缓存及任务用时待测 |
| 失败恢复 | 原生 profile、会话及原文档案 | 关闭优化、回原流程及重核证据 | 迁移和恢复人时未量化 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工具结果缩减 | 有实际钩子、同请求基线条件及回退 | 关键任务的模型准确性与用量 |
| 原文回查 | 记录绑定工具、参数、结果和范围 | 真宿主故障、权限和迁移可靠性 |
| 费用观察 | 本地估算区分开销和状态 | 实际账单、延迟和净收益 |

> **思考**：[Q03](#research-q03) 原文可读依赖存档、事件绑定和作用域。输入估算与实际费用不同。[Q04](#research-q04) 根 bundle 扩大宿主变更范围，单独开关不等于全包退出。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 确认原文档案与工具结果缩减分层，可在同请求有完整基线时使用重复引用及精确差异。

缩减在实际工具执行后处理，原文的内容对象和引用元数据独立。请求内基线、原文可访问性和费用是不同证据。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 原文可读依赖存档、事件绑定和作用域。输入估算与实际费用不同。[Q04](#research-q04) 根 bundle 扩大宿主变更范围，单独开关不等于全包退出。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 需要反复读取源码且已有匹配 DSH 的用户，可先在独立 profile 观察任务副本。[Q03](#research-q03) 若证据丢失或估算与任务结果不符，先关优化并保留原文。[Q04](#research-q04) 如权限或宿主组件变化超出预期，返回原生 profile 处理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核实根插件、工具缩减、原文关联与估算链。实际任务、宿主权限及账单未验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/index.mjs、src/runtime.mjs、src/result-reduction/service.mjs、src/result-reduction/reducers.mjs、src/result-reduction/evidence.mjs、src/result-reduction/accounting.mjs、package.json、src/config.mjs、docs/install.md、docs/context-optimization.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 DSH 插件的工具结果缩减、原文及估算主链。历史摘要、BC、Dream、电脑操作及替换组件的全面行为未核查。
- 下一步：仅固定源码。下一步按同一模型和任务对比两次重复读取、一处内容变化与一次原文归档故障，分开记录发出请求、原文命中、账单及人工返工。

**分析版本**

- **仓库**：[gulagala001/oh-my-dsh](https://github.com/gulagala001/oh-my-dsh)
- **版本号**：0.2.2-rc.1.omd.1.3.9（[固定提交 9a5fd6b](https://github.com/gulagala001/oh-my-dsh/tree/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 固定重复读取与一行变化，比较开关、原文回查及真实用量，可以验证缩减在具体任务的净价值。

仅固定源码。下一步按同一模型和任务对比两次重复读取、一处内容变化与一次原文归档故障，分开记录发出请求、原文命中、账单及人工返工。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 173 | 14690 | — | — | 272797 |
| .js | source | 2 | 357 | 343 | 3 | — |
| .mjs | source | 349 | 36629 | 33586 | 2212 | — |
| .ts | source | 10 | 1388 | 1030 | 234 | — |
| .jsx | source | 73 | 7308 | 6826 | 215 | — |
| .mjs | test | 126 | 14866 | 13951 | 215 | — |
| .mjs | example | 32 | 2979 | 2765 | 145 | — |
| .md | example | 3 | 13 | — | — | 57 |
| .js | example | 1 | 84 | 78 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/gulagala001/oh-my-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=16&color=737b86&logo=github)](https://github.com/gulagala001/oh-my-dsh/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/gulagala001/oh-my-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断使用固定宿主做长会话代码任务的用户，能否核对上下文缩减的触发、保留内容与失败退路。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比人工重开或原生压缩增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在长会话反复读源码或搜索结果的维护者，可用 OMD 在同一请求识别重复读结果，并用原文引用继续核对。作者将缩减工具结果、历史压缩和记忆分为不同路径。根 Cordis 组合真实改变默认预设并加载插件。相对完整输出、人工重开或只做历史摘要，增量是工具执行完成后的内容视图和请求内重复管理。合格结果是能得到同一目标所需的行、文件及结论，遗漏时原文可回查。低重复任务或频繁回查时增量可能较小。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:82-89](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/README.md#L82-L89)

作者的长会话和工具结果缩减主张

```text
### 长对话保留背景，精简结果仍能回查

**上下文优化**默认开启：精简可识别的只读结果，对已有完整基线的重复读取提供引用或差异，保留工具真实执行与获准原文。工具卡片的**查看原文**支持行号、搜索、翻页和导出；原文档案可随会话迁移。

按需工具发现、文件与网页视图、AST 代码搜索和 CodeGraph 帮助定位材料。历史整理、Auto Compact 与 **Dream** 分别管理上下文和会话／项目／全局记忆；也可选用 Billion Context 管理压缩，Dream、回查、任务、侧问与分支继续协作。


工具调用也更高效：代码检索、网页正文读取、原文回查与截图传递减少重复处理；工具结果中的重复内容会被精简，减少上下文占用和 Token 消耗，需要细节时仍可查看完整原文。
```

**依据 2 · 源码核查**：[cordis.patch.yml:1-24](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/cordis.patch.yml#L1-L24)

DSH 入口及默认预设变更

<details>
<summary>查看原文（24行）</summary>

```text
- insert:
    - id: oh-my-dsh
      name: oh-my-dsh
    - id: omd-deepseek-workbench
      name: oh-my-dsh/deepseek-workbench
    - id: omd-extensions
      name: oh-my-dsh/extensions
    - id: omd-opencu
      name: oh-my-dsh/opencu
    - id: omd-rewind
      name: oh-my-dsh/rewind
    - id: omd-response-id-reuse
      name: oh-my-dsh/response-id-reuse

- id: agent-preset-registry
  config:
    default: oh-my-dsh

- id: system-prompt
  config:
    includeHarnessIdentity: false

- id: fs-observation-policy
  disabled: true
```

</details>

**依据 3 · 源码核查**：[src/index.mjs:4-22](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/index.mjs#L4-L22)

根插件启动增强子运行时

<details>
<summary>查看原文（19行）</summary>

```text
export { Config };
export const name = 'oh-my-dsh';
export const inject = ['loader', 'tools', 'llm', 'agents', 'sessions', 'settings', 'tokenMeter', 'sessionProjections', 'sessionPersistence', 'sessionQuery'];

// Keep the client-owning entry importable when an enhancement's dependencies
// are damaged. Cordis tears down a failed child, retaining this entry and UI.
export async function apply(ctx, config) {
  const startup = mountStartup(ctx);
  try {
    ctx.effect(() => ctx.settings.configure({ auto: false }, ctx.fiber));
    await ctx.plugin({ name: 'omd-runtime', async apply(scope) {
      const runtime = await import('./runtime.mjs');
      scope.fiber.assertActive();
      await runtime.apply(scope, config);
    } });
    startup.ready();
  } catch (error) {
    if (startup.fail(error)) ctx.logger.error('Oh My DSH 增强功能启动失败；基础会话界面保留。完整退出 DSH，按原安装来源修复依赖后重启。%s', error?.stack ?? error);
  }
```

</details>

**依据 4 · 源码核查**：[src/runtime.mjs:162-166](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/runtime.mjs#L162-L166)

目标会话的结果缩减接线

```text
  const isX = session => isOmdPreset(ctx.sessionProjections.stateOf(session, 'agentPreset') ?? session.header.agentPreset);
  const isOmaaEnhanced = session => Boolean(ctx.get('omaa')?.enhancementEnabled(session));
  installPtcLifecycle(ctx, { adaptiveBudgets: session => Boolean(session && (isX(session) || isOmaaEnhanced(session))) });
  installResultReduction(ctx, hub, session => isX(session) || isOmaaEnhanced(session));
  installFileReadIntegrity(ctx, session => isX(session) || isOmaaEnhanced(session));
```

#### 缺口

- 没有相同任务的固定基线结果。
  **影响**：无法估计长任务成功率、人工回查和费用。
  **进一步探讨**：用一个重复查阅测试文件的任务比较开关两种状态。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 长上下文在哪个执行入口被处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

`tools/post-execute` 先拿宿主下游决定，再在 OMD 预设或符合增强条件的会话里处理。子工具值、已有替换值、错误、取消、自有 finalize、非文本和短结果不走普通缩减。符合条件的内容先持久化原文，准备与结果内容相配的记录，再用缩减视图替换显示内容。运行时收到匹配的原生工具结果事件后标记记录提交。发送模型请求时，已有完整读结果且名称、参数哈希与输出相符，才折叠同请求的重复内容或显示精确差异。BC 激活时不走这一依赖前文基线的规则。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.mjs:162-166](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/runtime.mjs#L162-L166)

实际生效预设条件

```text
  const isX = session => isOmdPreset(ctx.sessionProjections.stateOf(session, 'agentPreset') ?? session.header.agentPreset);
  const isOmaaEnhanced = session => Boolean(ctx.get('omaa')?.enhancementEnabled(session));
  installPtcLifecycle(ctx, { adaptiveBudgets: session => Boolean(session && (isX(session) || isOmaaEnhanced(session))) });
  installResultReduction(ctx, hub, session => isX(session) || isOmaaEnhanced(session));
  installFileReadIntegrity(ctx, session => isX(session) || isOmaaEnhanced(session));
```

**依据 2 · 源码核查**：[src/result-reduction/service.mjs:194-225](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/service.mjs#L194-L225)

post-execute 守门、原文与缩减视图

<details>
<summary>查看原文（32行）</summary>

```text
  async post(exec, result, decision) {
    const program = exec.name === 'run_code' && !exec.parent ? this.programs.take(exec) : undefined;
    if (!exec.agent || !this.managed(exec.agent.session)) return decision;
    const session = exec.agent.session;
    if (exec.parent) return decision; // Canonical values and intermediate program content are owned by the host.
    const retain = reason => { this.decision(session, reason); return decision; };
    if (!this.enabled(session)) return retain('disabled');
    if (decision.kind !== 'accept' || Object.hasOwn(decision, 'value') || result.isError || exec.signal.aborted) return retain('protected');
    if (this.pending.has(exec.token)) return decision;
    if (this.ctx.tools.get(exec.name, exec.agent)?.finalizeContent) return retain('owner-finalized');
    const recalled = program && recallDisplay(result, decision, program);
    if (recalled) { this.decision(session, 'reduced'); return { ...decision, content: recalled }; }
    if (protectedTool(exec.name) || program?.blocked) return retain('protected');
    const content = decision.content ?? result.content, text = textOf(content);
    if (text === null || text.length < 768 || text.length > 32 * 1024 * 1024 || /^ops_/.test(exec.name)) return retain('ineligible');
    const output = { ...result, content };
    const programOutput = exec.name === 'run_code' ? programView(exec, output, program) : null;
    const readKey = programOutput?.readKey ?? readIdentity(exec, output);
    const view = programOutput?.view ?? (readKey ? null : reduceText(exec, output, text));
    const shortenedCandidate = view && worthwhile(text, view.text + ' '.repeat(300));
    if (!readKey && !shortenedCandidate) return retain(view ? 'no-benefit' : 'ineligible');
    const record = await this.archive(exec, text, shortenedCandidate ? view.rule : 'read-baseline', true, readKey);
    const item = this.pending.get(exec.token); item.readKey = readKey;
    const shortened = shortenedCandidate ? referenced(view, record) : text;
    if (shortened === text || !worthwhile(text, shortened)) {
      item.proposed = content; item.record = await this.evidence.prepare(record.ref, content);
      return retain('baseline');
    }
    item.proposed = [{ type: 'text', text: shortened }];
    item.record = await this.evidence.prepare(record.ref, item.proposed);
    this.decision(session, 'reduced');
    return { ...decision, content: item.proposed };
```

</details>

**依据 3 · 源码核查**：[src/result-reduction/service.mjs:245-286](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/service.mjs#L245-L286)

结果绑定、完整基线和请求内差异

<details>
<summary>查看原文（42行）</summary>

```text
  event(session, event) {
    if (!['tool/result', 'tool/ptc-dispatch'].includes(event.type)) return;
    const m = event.type === 'tool/result' ? event.data?.message : { toolCallId: event.data?.subCallId, content: event.data?.content };
    const item = this.results.get(eventKey(session, m?.toolCallId));
    if (!item || hash(m.content) !== item.finalHash) return;
    this.track(this.evidence.commit(item.record.ref, event).then(committed => { item.committed = committed; }));
  }
  // Only reduce against a complete earlier result in THIS request. Nothing is
  // inferred from a previous call, connection, cache, argument or user marker.
  project(options) {
    if (!isAgentLoopRequest(options)) return options;
    if (this.requestViews.has(options)) return options;
    const started = performance.now();
    const session = options.sessionId && this.ctx.sessions.get(options.sessionId);
    if (!session || !this.enabled(session)) return options;
    const dependent = this.hub.bc?.view(session)?.backend !== 'bc';
    const calls = new Map(), baselines = new Map(), images = new Map(), rules = [], messages = [];
    let changed = false; const originals = [];
    for (const message of options.messages) {
      if (message.role === 'assistant') for (const block of message.content) if (block.type === 'tool-call') calls.set(block.id, block);
      const item = message.role === 'tool' && this.results.get(eventKey(session, message.toolCallId));
      let next = message, original = message;
      if (item?.committed && !message.isError && item.finalHash === contentHash(message.content)) {
        const call = calls.get(message.toolCallId);
        if (call?.name === item.name && argumentsHash(call.arguments) === item.record.argumentsHash) {
          original = { ...message, content: [{ type: 'text', text: item.source }] };
          if (item.readKey && dependent) {
            const baseline = baselines.get(item.readKey);
            if (baseline) {
              const key = JSON.stringify([item.record.ref, item.record.sourceHash, baseline.record.ref, baseline.record.sourceHash, baseline.callId]);
              const immutable = frozenJsonValue(message), cached = immutable && this.readViews.get(message);
              if (cached?.key === key) next = cached.message;
              else {
                const same = baseline.source === item.source;
                const text = same ? 'Unchanged output: the complete earlier output is still present in this request.'
                  : 'Exact unified delta against the complete earlier output in this request:\n' + exactDelta(baseline.source, item.source);
                const view = referenced({ text: `Baseline toolCallId=${baseline.callId}\n${text}`, lossless: true }, item.record);
                if (worthwhile(item.source, view)) next = freezeMessage({ ...message, content: [{ type: 'text', text: view }] });
                if (immutable) this.readViews.set(message, { key, message: next });
              }
              if (next !== message) changed = true;
            } else if (textOf(message.content) === item.source) baselines.set(item.readKey, item);
```

</details>

**依据 4 · 源码核查**：[src/result-reduction/service.mjs:344-365](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/service.mjs#L344-L365)

实际 Host hooks 与回退

<details>
<summary>查看原文（22行）</summary>

```text
export function installResultReduction(ctx, hub, managed) {
  const service = hub.optimization = new ResultReduction(ctx, hub, managed);
  ctx.on('tools/post-execute', async (exec, result, next) => {
    const decision = await next(), started = performance.now();
    try { return await service.post(exec, result, decision); }
    catch (error) {
      const pending = service.pending.get(exec.token); service.pending.delete(exec.token);
      if (pending) service.track(service.evidence.abandon(pending.record.ref));
      if (exec.agent) service.decision(exec.agent.session, 'fallback');
      ctx.logger?.warn?.('上下文优化回退：' + error.message); return decision;
    } finally {
      if (exec.agent && !exec.parent && managed(exec.agent.session)) service.workMs.set(exec.agent.session.id, (service.workMs.get(exec.agent.session.id) ?? 0) + performance.now() - started);
    }
  }, { global: true });
  ctx.on('tools/result', (exec, result) => { service.result(exec, result); }, { global: true });
  ctx.on('session/event', (session, event) => { service.event(session, event); }, { global: true });
  ctx.on('agent/disposed', ({ agent }) => service.release(agent.session.id), { global: true });
  ctx.on('session/disposed', session => service.release(session.id), { global: true });
  installRequestProjection(ctx, options => {
    try { return service.project(options); }
    catch (error) { const session = options.sessionId && ctx.sessions.get(options.sessionId); if (session) service.decision(session, 'fallback'); ctx.logger?.warn?.('上下文请求优化回退：' + error.message); return options; }
  });
```

</details>

**依据 5 · 源码核查**：[src/result-reduction/reducers.mjs:62-76](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/reducers.mjs#L62-L76)

读标识、输出截断识别和收益门槛

<details>
<summary>查看原文（15行）</summary>

```text
export function readIdentity(exec, result) {
  if (exec.name !== 'read' || result.isError || !result.value || !Array.isArray(result.value.lines)) return null;
  const v = result.value;
  if (typeof v.path !== 'string' || !Number.isSafeInteger(v.totalLines) || !v.lines.every(l => Number.isSafeInteger(l.number) && typeof l.text === 'string')) return null;
  const text = textOf(result.content);
  if (text === null || /\(Output capped\.|\(line truncated to \d+ chars\)/.test(text)) return null;
  return JSON.stringify([v.path, exec.arguments?.offset ?? 0, exec.arguments?.limit ?? null]);
}
export function exactDelta(before, after) {
  return createTwoFilesPatch('previous-visible-result', 'current-result', before, after, '', '', { context: 3 });
}
export function referenced(view, record) {
  return `${view.text}\n[${view.lossless ? 'lossless view' : 'partial view'}; original=${record.ref}; sha256=${record.sourceHash}; recall(rawRef="${record.ref}")]`;
}
export function worthwhile(before, after) { return after.length + 128 < before.length && after.length <= before.length * .9 && estimateText(after) < estimateText(before); }
```

</details>

#### 缺口

- 未验证目标宿主的请求投影顺序与长文效果。
  **影响**：无法判断实际发送缩减量或模型能否用差异重建细节。
  **进一步探讨**：记录一次两次同范围 read 的原生结果、原文与发出请求差异。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 缩减会保留什么，失败会如何处理？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

原文按哈希写入磁盘对象，元数据绑定会话、工具调用、参数与结果哈希。回查需通过原生事件关联，继承会话还受事件截止位置限制。归档或请求投影抛错时回退到该阶段先前的决定或请求。撤销未提交引用的元数据不会立即删除可能共享的对象。优化账本中的前后 token 是估算，减去回查及工具发现开销，失败或取消独立计数。无法据此推断供应商账单与模型任务质量。

#### 证据与依据

**依据 1 · 源码核查**：[src/result-reduction/evidence.mjs:97-125](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/evidence.mjs#L97-L125)

内容对象与未提交记录持久化

<details>
<summary>查看原文（29行）</summary>

```text
  async storeObject(sourceHash, text) {
    await this.ready;
    const object = join(this.dir, 'objects', sourceHash + '.txt');
    const verify = async () => { if (hash(await readFile(object, 'utf8')) !== sourceHash) throw Error('原文对象校验失败'); };
    try { await verify(); return; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const temporary = `${object}.${randomUUID()}.tmp`;
    try {
      const file = await open(temporary, 'wx', 0o600);
      try { await file.writeFile(text); await file.sync(); } finally { await file.close(); }
      // Publish a complete immutable object once. Other references can reuse it
      // without ever seeing a partially written file or replacing its bytes.
      try { await link(temporary, object); }
      catch (error) { if (error.code !== 'EEXIST') throw error; await verify(); }
    } finally { await unlink(temporary).catch(() => {}); }
  }
  async save({ sessionId, callId, tool, args, text, complete = true, rule, parent, readKey }) {
    if (!validId(sessionId) || !validId(callId) || !validId(tool) || typeof text !== 'string') throw Error('原文身份不完整');
    if (!text.isWellFormed()) throw Error('原文包含无效 Unicode，保留工具原结果');
    const bytes = Buffer.byteLength(text);
    if (bytes > MAX_OBJECT_BYTES) throw Error('本次原文超过存档上限，保留工具原结果');
    const sourceHash = hash(text);
    await this.storeObject(sourceHash, text);
    const ref = 'omd-raw:' + randomUUID();
    const record = { version: 1, ref, sessionId, callId, tool, argumentsHash: hash(args ?? {}),
      sourceHash, bytes, characters: text.length, complete, rule, parent, readKey, createdAt: Date.now(),
      ...indexTerms(text), committed: false };
    await this.persist(record);
    await this.indexOwner(record);
    return record;
```

</details>

**依据 2 · 源码核查**：[src/result-reduction/evidence.mjs:145-181](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/evidence.mjs#L145-L181)

结果提交、放弃和原生事件范围校验

<details>
<summary>查看原文（37行）</summary>

```text
  commit(ref, event) {
    return this.update(ref, async () => {
      const record = { ...await this.meta(ref) }, m = message(event);
      if (!m || m.toolCallId !== record.callId || m.isError || record.preparedHash && record.preparedHash !== hash(m.content)) return false;
      record.committed = true; record.eventSeq = event.seq; record.messageId = m.id; record.contentHash = hash(m.content);
      await this.persist(record); return true;
    });
  }
  prepare(ref, content) {
    return this.update(ref, async () => this.persist({ ...await this.meta(ref), preparedHash: hash(content) }));
  }
  abandon(ref) {
    return this.update(ref, async () => {
      let record;
      try { record = await this.meta(ref); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
      if (record.committed) return;
      await unlink(join(this.dir, this.id(ref) + '.json')).catch(error => { if (error.code !== 'ENOENT') throw error; });
      this.cache.delete(ref);
      await unlink(join(this.dir, 'owners', hash(record.sessionId), this.id(ref))).catch(error => { if (error.code !== 'ENOENT') throw error; });
      // Content objects may be shared. Never delete one without a full reference scan.
    });
  }
  access(record, session, ancestors = [], index) {
    if (!record.committed || !validId(record.callId) || !validId(record.tool) || !validId(record.messageId)
      || ![record.sourceHash, record.contentHash, record.argumentsHash].every(v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v))) return false;
    const owners = [record.sessionId, ...(record.importedSessions ?? [])], own = owners.includes(session.id);
    if (!own && !ancestors.some(id => owners.includes(id))) return false;
    index ??= accessIndex(session);
    const cut = own ? index.eventCount : index.inheritedEventCount;
    if (!Number.isSafeInteger(cut) || cut < 0 || cut > index.eventCount) return false;
    for (const item of index.results.get(record.callId) || []) {
      const m = item.message;
      if (item.position >= cut || item.call.name !== record.tool || m.id !== record.messageId || argumentsHash(item.call) !== record.argumentsHash) continue;
      if ((item.contentHash ??= hash(m.content)) === record.contentHash) {
        const body = item.text ??= m.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
        if ((item.sourceHash ??= hash(body)) === record.sourceHash || body.includes(record.ref) && body.includes(record.sourceHash)) return true;
      }
```

</details>

**依据 3 · 源码核查**：[src/result-reduction/evidence.mjs:226-241](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/evidence.mjs#L226-L241)

回查的访问及分页边界

<details>
<summary>查看原文（16行）</summary>

```text
  async read(session, args, ancestors = [], signal) {
    signal?.throwIfAborted();
    const index = accessIndex(session);
    let record = await this.meta(args.rawRef);
    if (!record.committed) { await this.list(session, ancestors, signal, index); record = await this.meta(args.rawRef); }
    if (!this.access(record, session, ancestors, index)) throw Error('当前会话无权读取此原文；跨会话需显式选择可读取的来源会话');
    const text = await this.text(record, signal), maxChars = integer(args.maxChars, 12000, 256, 48000, 'maxChars');
    const mode = args.mode ?? 'head';
    if (!['head', 'tail', 'range', 'query'].includes(mode)) throw Error('原文 mode 只支持 head、tail、range、query');
    const query = args.query ?? '';
    if (typeof query !== 'string' || query.length > 512) throw Error('query 不能超过 512 字符');
    const startLine = integer(args.startLine, 1, 1, Number.MAX_SAFE_INTEGER, 'startLine');
    const maxLines = integer(args.maxLines, 160, 1, 2000, 'maxLines');
    const signature = hash([record.ref, record.sourceHash, mode, query, startLine, maxLines, maxChars]);
    const next = cursor(args.cursor);
    if (next && (next.v !== 1 || next.signature !== signature || !Number.isSafeInteger(next.offset) || next.offset < 0 || next.offset > text.length)) throw Error('游标不属于此次原文读取');
```

</details>

**依据 4 · 源码核查**：[src/result-reduction/service.mjs:346-370](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/service.mjs#L346-L370)

中间失败保留原决定或原请求

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.on('tools/post-execute', async (exec, result, next) => {
    const decision = await next(), started = performance.now();
    try { return await service.post(exec, result, decision); }
    catch (error) {
      const pending = service.pending.get(exec.token); service.pending.delete(exec.token);
      if (pending) service.track(service.evidence.abandon(pending.record.ref));
      if (exec.agent) service.decision(exec.agent.session, 'fallback');
      ctx.logger?.warn?.('上下文优化回退：' + error.message); return decision;
    } finally {
      if (exec.agent && !exec.parent && managed(exec.agent.session)) service.workMs.set(exec.agent.session.id, (service.workMs.get(exec.agent.session.id) ?? 0) + performance.now() - started);
    }
  }, { global: true });
  ctx.on('tools/result', (exec, result) => { service.result(exec, result); }, { global: true });
  ctx.on('session/event', (session, event) => { service.event(session, event); }, { global: true });
  ctx.on('agent/disposed', ({ agent }) => service.release(agent.session.id), { global: true });
  ctx.on('session/disposed', session => service.release(session.id), { global: true });
  installRequestProjection(ctx, options => {
    try { return service.project(options); }
    catch (error) { const session = options.sessionId && ctx.sessions.get(options.sessionId); if (session) service.decision(session, 'fallback'); ctx.logger?.warn?.('上下文请求优化回退：' + error.message); return options; }
  });
  ctx.on('agent/pre-step', async (event, next) => {
    const session = event?.agent?.session;
    if (session && managed(session)) {
      try { await service.restore(session, event.signal); }
      catch (error) { if (event.signal?.aborted) throw error; service.decision(session, 'fallback'); ctx.logger?.warn?.('工具原文恢复失败，保留完整结果：' + error.message); }
```

</details>

**依据 5 · 源码核查**：[src/result-reduction/service.mjs:381-399](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/service.mjs#L381-L399)

估算与回查开销

<details>
<summary>查看原文（19行）</summary>

```text
    const row = { version: 1, sessionId: session.id, id: 'tool-optimization:' + randomUUID(), at: Date.now(), revision: session.seq, status: 'error',
      provider: options.provider, model: options.model,
      beforeTokens: view?.beforeTokens ?? used, afterTokens: used, estimatedSavedTokens: 0, estimatedNetTokens: 0,
      recallTokens: 0, discoveryTokens: 0, processingMs: (view?.processingMs ?? 0) + (service.workMs.get(session.id) ?? 0),
      rules: view?.rules ?? [], decisions: service.decisions.get(session.id) ?? {}, estimated: true };
    service.decisions.delete(session.id); service.workMs.delete(session.id);
    if (!service.enabled(session)) row.decisions = { ...row.decisions, disabled: 1 };
    const overhead = new Map();
    for (const message of options.messages) {
      if (message.role === 'assistant') for (const block of message.content) if (block.type === 'tool-call') {
        let args; try { args = typeof block.arguments === 'string' ? JSON.parse(block.arguments) : block.arguments; } catch {}
        const key = eventKey(session, block.id), kind = (block.name === 'recall' && (args?.rawRef || args?.search === 'evidence')) || service.recallCalls.has(key) ? 'recallTokens'
          : block.name === 'tool_find' || service.discoveryCalls.has(key) ? 'discoveryTokens' : null;
        if (kind) { overhead.set(block.id, kind); row[kind] += estimate(block); }
      }
      if (message.role === 'tool' && overhead.has(message.toolCallId)) row[overhead.get(message.toolCallId)] += estimate(message.content);
    }
    row.estimatedSavedTokens = row.beforeTokens - row.afterTokens;
    row.estimatedNetTokens = row.estimatedSavedTokens - row.recallTokens - row.discoveryTokens;
```

</details>

**依据 6 · 源码核查**：[src/result-reduction/accounting.mjs:5-19](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/accounting.mjs#L5-L19)

失败与成功估算统计分离

<details>
<summary>查看原文（15行）</summary>

```text
export function addOptimization(state, row) {
  state.attempts++;
  state.since = state.since === null ? row.at : Math.min(state.since, row.at);
  state.lastRequest = row;
  state.processingMs += row.processingMs ?? 0;
  state.fallbacks += row.decisions?.fallback ?? 0;
  for (const [key, value] of Object.entries(row.decisions ?? {})) state.decisions[key] = (state.decisions[key] ?? 0) + value;
  if (row.status !== 'success') { state[row.status === 'cancelled' ? 'cancelled' : 'failures']++; return state; }
  state.requests++;
  for (const key of ['estimatedSavedTokens', 'estimatedNetTokens', 'recallTokens', 'discoveryTokens']) state[key] += row[key] ?? 0;
  for (const rule of row.rules ?? []) {
    const entry = state.rules[rule.rule] ??= { requests: 0, savedTokens: 0, images: 0 };
    entry.requests++; entry.savedTokens += rule.saved ?? 0; entry.images += rule.images ?? 0;
  }
  return state;
```

</details>

#### 缺口

- 缺原文权限、磁盘错误和供应商用量的同版本验证。
  **影响**：无法从实现证明所有原文可恢复或净成本下降。
  **进一步探讨**：给重复读取加入归档错误，并对照保存文件、请求快照与供应商用量。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用、停止并恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根包私有，固定 Node 24.9 起和 DSH 0.2.2-rc.1；作者给版本匹配的发行包、备份和完整重启条件。上下文优化开关默认开，关后停止新优化，但原文和其他组件有独立生命周期。bundle 还修改预设、禁用并替换多个宿主组件，因此只在独立 profile 和任务副本测试，不能以关优化开关替代完整退出。若回查失败、会话结论丢失或宿主权限改变，先关闭优化，保留会话与原文档案，回到原生 profile 重新核对。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-7](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/package.json#L1-L7)

私有发行清单

```text
{
  "name": "oh-my-dsh",
  "version": "0.2.2-rc.1.omd.1.3.9",
  "private": true,
  "type": "module",
  "description": "DSH 增强插件：长上下文、任务验证、提示词优化、代码理解、电脑操作，以及 DSH 原生界面与可选主题、配色和背景。",
  "packageManager": "pnpm@11.28.5",
```

**依据 2 · 源码核查**：[package.json:73-103](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/package.json#L73-L103)

固定宿主与两份组合

<details>
<summary>查看原文（31行）</summary>

```text
  "engines": {
    "node": ">=24.9.0",
    "dsh": "0.2.2-rc.1"
  },
  "main": "src/index.mjs",
  "exports": {
    ".": "./src/index.mjs",
    "./agent": "./src/dsh-agent.mjs",
    "./opencu": "./vendor/opencu/src/dsh/index.mjs",
    "./codegraph": "./src/codegraph-agent.mjs",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./ptc": "./src/ptc.mjs",
    "./host/*": "./lib/host/*.mjs",
    "./host/ui-chat": "./src/host/ui-chat.mjs",
    "./deepseek-workbench": "./plugins/deepseek-workbench/src/index.mjs",
    "./extensions": "./plugins/dsh-extensions/src/index.mjs",
    "./workflow": "./vendor/workflow/src/index.mjs",
    "./rewind": "./vendor/rewind/src/index.mjs",
    "./response-id-reuse": "./vendor/response-id-reuse/src/index.mjs",
    "./token-meter": "./lib/host/token-meter.mjs",
    "./compaction": "./lib/host/compaction.mjs",
    "./native-executor": "./src/native-executor.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": [
        "./cordis.patch.yml",
        "./presets/cordis.patch.yml"
      ]
    },
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:23-74](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/cordis.patch.yml#L23-L74)

宿主组件替换范围

<details>
<summary>查看原文（52行）</summary>

```text
- id: fs-observation-policy
  disabled: true

# Matching DSH providers with opt-in OMD extensions. Original rows remain
# intact and become active again when this bundle is removed.
- id: jobs
  disabled: true
- id: bash-sandbox
  disabled: true
- id: pwsh-sandbox
  disabled: true
- insert:
    - id: omd-jobs
      name: oh-my-dsh/host/jobs-local
    - id: omd-workflow-runtime
      name: oh-my-dsh/workflow
    - id: omd-workflow-spawn
      name: oh-my-dsh/host/workflow-spawn
    - id: omd-bash-sandbox
      name: oh-my-dsh/host/bash-sandbox
      disabled: !!js process.platform === 'win32'
    - id: omd-pwsh-sandbox
      name: oh-my-dsh/host/pwsh-sandbox
      disabled: !!js process.platform !== 'win32'

- id: ui-conversation
  disabled: true

- id: ui-chat
  disabled: true

- id: ui-open-in-app
  disabled: true

- insert:
    - id: omd-ui-conversation
      name: oh-my-dsh/host/ui-conversation
    - id: omd-ui-chat
      name: oh-my-dsh/host/ui-chat

# One meter owns native context/usage projections and every OMD consumer.
- id: token-meter
  disabled: true
- insert:
    - id: omd-token-meter
      name: oh-my-dsh/token-meter

- id: compaction-basic
  disabled: true
- insert:
    - id: omd-compaction-basic
      name: oh-my-dsh/compaction
```

</details>

**依据 4 · 源码核查**：[src/config.mjs:23-25](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/config.mjs#L23-L25)

优化开关默认

```text
  contextEnabled: z.boolean().default(true),
  contextOptimizationEnabled: z.boolean().default(true),
  multiImageFixEnabled: z.boolean().default(true),
```

**依据 5 · 源码核查**：[src/result-reduction/service.mjs:33-33](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/service.mjs#L33-L33)

关闭开关的条件

```text
  enabled(session) { return !this.closed && this.hub.config().contextOptimizationEnabled !== false && this.managed(session); }
```

**依据 6 · 作者声明**：[docs/install.md:59-70](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/docs/install.md#L59-L70)

作者的备份、版本和重启说明

<details>
<summary>查看原文（12行）</summary>

```text
### 3. 粘贴并安装

1. 等当前任务结束。已有 OMD 的用户先按[升级指南](upgrade.md)备份数据。
2. 点击左侧 **插件**，再点右上角 **＋ 添加插件**。
3. 在“输入插件的包名、GitHub 仓库地址或本地目录路径”输入框中，粘贴上面的**完整 .tgz 地址**。
4. 点击 **安装**，等安装完成，确认 Oh My DSH 已启用。
5. 完整退出并重新打开桌面应用；Web 用户重启原 Web 服务。仅关窗口或刷新网页不等于重启后端。
6. 新建会话，选择 **Oh My DSH**。模型使用你在 DSH 中配置的渠道，不附带账号。

输入框虽然也支持仓库地址，本指南使用固定发行包，避免直接安装仍在变化的 main 分支。无需先下载 Source code，也不用把 host-adapters.zip 填进去。

安装失败时保留错误，先核对宿主版本；只有遇到“构建脚本未批准”等提示时，才看[安装脚本处理](upgrade.md#build-approval)。
```

</details>

**依据 7 · 作者声明**：[docs/context-optimization.md:16-22](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/docs/context-optimization.md#L16-L22)

作者说明原文留存及独立开关

```text
- 每次缩减前先保存获准原文。工具卡片提供 **查看原文**，支持开头、结尾、行号、搜索和下一页；长单行也可继续读取。模型可用 `recall({rawRef, mode, cursor})`，或 `recall({search:"evidence", query})` 搜索。
- 原文与会话中的真实工具调用绑定，重启和合法分支仍可回查。关闭优化不会删除原文。控制台可导出、导入原文档案；迁移时同时保留原生会话导出和对应原文档案，先恢复会话再导入原文。历史中仍被引用的原文不按时间自动过期。
- OpenCU 仍执行实际观察，保留现有紧凑 AX、DOM 范围读取与完整变化；基线不明时输出全量。在最终请求中统一核验图片，覆盖直接工具结果、PTC 与上下文附件；仅在同一请求已经保留完全相同的不可变图片时折叠重复图片，保留新的观察文字、图片元数据和原始附件。

上下文页显示本会话自首次记录起的成功／失败／取消请求、估算净输入减少、回查与发现开销、请求投影耗时和处理原因。每次请求记录同口径的完整展示对照与实际发送估算，扣除当前请求中的原文回查和工具发现内容；失败与取消不计入成功节省。结果摘要随原生会话日志保存，并索引到现有监控账本，重启后保留；数据库索引缺失时可从会话恢复，分支不继承父会话的消费记录。未触发、不适用、保留错误／回执及失败回退分别展示。PTC 原文回查按实际外层输出计入，图片折叠单列次数。这里不包含历史摘要压缩，也不把输入估算等同于净费用或延迟收益；实际提供方用量和费用仍看监控页。原文、摘要、外部网页均是资料，不能充当新的用户指令。

关闭开关停止新增优化；原文回查、CodeGraph、Dream、历史压缩、任务、侧问和分支继续工作。CodeGraph 的聊天隔离和错误去重修复始终生效。历史摘要沿用已有 OMD 或可选 BC 的单一写入事务。
```

#### 缺口

- 没有固定版在原生 profile 的退出和数据恢复实测。
  **影响**：宿主替换、原文存档和重启增加环境负担。
  **进一步探讨**：在新 profile 记录启用前后权限与组件，保留独立可用的原生 profile。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用固定长会话验证缩减的净价值？

**研究主题**：新假设与验证

#### 完整回答

固定模型、目录与任务。准备重复 read 的原始长输出和只改一行的第二次输出，分别在同请求含完整基线和不含基线的条件运行，加入一次回查和一次存档失败。将优化开关两组的完整回答、命中原文行、模型实际输入、回查开销、供应商用量和任务人时分开比。若缩减组遗漏关键行、无权限回查或总成本无优势，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/result-reduction/service.mjs:252-286](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/service.mjs#L252-L286)

同一请求完整基线与差异的可证伪条件

<details>
<summary>查看原文（35行）</summary>

```text
  // Only reduce against a complete earlier result in THIS request. Nothing is
  // inferred from a previous call, connection, cache, argument or user marker.
  project(options) {
    if (!isAgentLoopRequest(options)) return options;
    if (this.requestViews.has(options)) return options;
    const started = performance.now();
    const session = options.sessionId && this.ctx.sessions.get(options.sessionId);
    if (!session || !this.enabled(session)) return options;
    const dependent = this.hub.bc?.view(session)?.backend !== 'bc';
    const calls = new Map(), baselines = new Map(), images = new Map(), rules = [], messages = [];
    let changed = false; const originals = [];
    for (const message of options.messages) {
      if (message.role === 'assistant') for (const block of message.content) if (block.type === 'tool-call') calls.set(block.id, block);
      const item = message.role === 'tool' && this.results.get(eventKey(session, message.toolCallId));
      let next = message, original = message;
      if (item?.committed && !message.isError && item.finalHash === contentHash(message.content)) {
        const call = calls.get(message.toolCallId);
        if (call?.name === item.name && argumentsHash(call.arguments) === item.record.argumentsHash) {
          original = { ...message, content: [{ type: 'text', text: item.source }] };
          if (item.readKey && dependent) {
            const baseline = baselines.get(item.readKey);
            if (baseline) {
              const key = JSON.stringify([item.record.ref, item.record.sourceHash, baseline.record.ref, baseline.record.sourceHash, baseline.callId]);
              const immutable = frozenJsonValue(message), cached = immutable && this.readViews.get(message);
              if (cached?.key === key) next = cached.message;
              else {
                const same = baseline.source === item.source;
                const text = same ? 'Unchanged output: the complete earlier output is still present in this request.'
                  : 'Exact unified delta against the complete earlier output in this request:\n' + exactDelta(baseline.source, item.source);
                const view = referenced({ text: `Baseline toolCallId=${baseline.callId}\n${text}`, lossless: true }, item.record);
                if (worthwhile(item.source, view)) next = freezeMessage({ ...message, content: [{ type: 'text', text: view }] });
                if (immutable) this.readViews.set(message, { key, message: next });
              }
              if (next !== message) changed = true;
            } else if (textOf(message.content) === item.source) baselines.set(item.readKey, item);
```

</details>

**依据 2 · 源码核查**：[src/result-reduction/service.mjs:388-399](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/service.mjs#L388-L399)

回查及发现开销

<details>
<summary>查看原文（12行）</summary>

```text
    const overhead = new Map();
    for (const message of options.messages) {
      if (message.role === 'assistant') for (const block of message.content) if (block.type === 'tool-call') {
        let args; try { args = typeof block.arguments === 'string' ? JSON.parse(block.arguments) : block.arguments; } catch {}
        const key = eventKey(session, block.id), kind = (block.name === 'recall' && (args?.rawRef || args?.search === 'evidence')) || service.recallCalls.has(key) ? 'recallTokens'
          : block.name === 'tool_find' || service.discoveryCalls.has(key) ? 'discoveryTokens' : null;
        if (kind) { overhead.set(block.id, kind); row[kind] += estimate(block); }
      }
      if (message.role === 'tool' && overhead.has(message.toolCallId)) row[overhead.get(message.toolCallId)] += estimate(message.content);
    }
    row.estimatedSavedTokens = row.beforeTokens - row.afterTokens;
    row.estimatedNetTokens = row.estimatedSavedTokens - row.recallTokens - row.discoveryTokens;
```

</details>

**依据 3 · 源码核查**：[src/result-reduction/evidence.mjs:226-241](https://github.com/gulagala001/oh-my-dsh/blob/9a5fd6b607d4a88d4b2e6cd524c40e92405f0d90/src/result-reduction/evidence.mjs#L226-L241)

可检查的原文恢复和分页

<details>
<summary>查看原文（16行）</summary>

```text
  async read(session, args, ancestors = [], signal) {
    signal?.throwIfAborted();
    const index = accessIndex(session);
    let record = await this.meta(args.rawRef);
    if (!record.committed) { await this.list(session, ancestors, signal, index); record = await this.meta(args.rawRef); }
    if (!this.access(record, session, ancestors, index)) throw Error('当前会话无权读取此原文；跨会话需显式选择可读取的来源会话');
    const text = await this.text(record, signal), maxChars = integer(args.maxChars, 12000, 256, 48000, 'maxChars');
    const mode = args.mode ?? 'head';
    if (!['head', 'tail', 'range', 'query'].includes(mode)) throw Error('原文 mode 只支持 head、tail、range、query');
    const query = args.query ?? '';
    if (typeof query !== 'string' || query.length > 512) throw Error('query 不能超过 512 字符');
    const startLine = integer(args.startLine, 1, 1, Number.MAX_SAFE_INTEGER, 'startLine');
    const maxLines = integer(args.maxLines, 160, 1, 2000, 'maxLines');
    const signature = hash([record.ref, record.sourceHash, mode, query, startLine, maxLines, maxChars]);
    const next = cursor(args.cursor);
    if (next && (next.v !== 1 || next.signature !== signature || !Number.isSafeInteger(next.offset) || next.offset < 0 || next.offset > text.length)) throw Error('游标不属于此次原文读取');
```

</details>

#### 缺口

- 对照尚未执行。
  **影响**：不能以本地估算推断实际任务收益。
  **进一步探讨**：先用固定文件两次读取，检查是否保留完整第一条和第二条必要差异。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
