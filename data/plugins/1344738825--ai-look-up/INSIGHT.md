# AI Look-Up

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1dbc46d](https://github.com/1344738825/ai-look-up/tree/1dbc46d9d66aaed1ec2dc55c012977533f204fa4)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1344738825/ai-look-up)
<!-- END META -->

> **功能**：观察代理工具行为并在长任务中注入自审提醒与时间锚点。

> **亮点**：将节奏检测、目标漂移审查和提醒接入宿主事件。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：关闭 llmReview 不等于关闭 driftCheck；审查材料包含目标和工具摘要，需核对数据与费用。[Q03](#research-q03)

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
  - [Q01 · 谁需要中途自审，和手动检查相比如何？](#detail-section-11)
  - [Q02 · DSH 的审查材料和失败回退怎样工作？](#detail-section-12)
  - [Q03 · 关掉 llmReview 就能保证没有额外模型审查吗？](#detail-section-13)
  - [Q04 · 如何试用并处理误报或不可用？](#detail-section-14)
  - [Q05 · 已有独立 watcher 时效闸之外，如何防止直接审查旧结论干扰新目标？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长编码任务中需要发现重复失败或无产出的用户；基线是人工观察工具日志。[Q01](#research-q01)

用户人工查看代理行为并提出收束提醒。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 检测 | 重复或无产出提醒 | 误报未测 |
| 审查 | 模型分析行为摘要 | 数据与费用需确认 |
| 时效 | watcher 丢弃旧结果 | 直接审查为不同路径 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH 事件与注入 | 必需 | 行为检测与提醒 | 手工监控 |
| llm 服务 | 模型审查需要 | 生成独立建议 | 静态清单或无漂移审查 |
| 用户数据与预算许可 | 模型路径需要 | 发送摘要 | 关闭相关通道 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 用户核对各审查开关与数据范围 | 不接受外发则停用 |
| 试用 | 使用非敏感任务观察提醒 | 比较真实工具日志 |
| 处理 | 人工核查建议 | 误报或旧目标时忽略并调整 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主配置 | 审阅多通道开关 | 数据范围需确认 |
| 持续 | 额外审查模型用量 | 核对提醒 | 节时和误报未测 |
| 恢复 | 重试可能计费 | 停用或调整 | 时效保护按通道不同 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 提醒 | 行为材料和失败回退 | 真实任务收益 |
| 时效 | watcher 结果三道闸 | 直接异步通道效果 |

> **思考**：关闭 llmReview 不等于关闭 driftCheck；审查材料包含目标和工具摘要，需核对数据与费用。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将节奏检测、目标漂移审查和提醒接入宿主事件。[Q01](#research-q01) [Q02](#research-q02)

llmReview 和 driftCheck 分别控制不同审查路径；watcher 才有结果时效三道闸。[Q02](#research-q02) [Q03](#research-q03) [Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

关闭 llmReview 不等于关闭 driftCheck；审查材料包含目标和工具摘要，需核对数据与费用。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先审查各通道、数据和预算；非敏感任务试用并人工复核提醒。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持默认配置、材料与审查分支；未运行模型或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 13 文件、无排除和解析错误；重点静态核查 DSH 主入口，不运行目标。
- 下一步：隔离任务检查关闭各审查通道、数据外发、延迟返回和失败回退。

**分析版本**

- **仓库**：[1344738825/ai-look-up](https://github.com/1344738825/ai-look-up)
- **版本号**：0.8.3（[固定提交 1dbc46d](https://github.com/1344738825/ai-look-up/tree/1dbc46d9d66aaed1ec2dc55c012977533f204fa4)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：将 watcher 已有场景/时效/步数校验用于直接异步审查，可减少旧结论误导。[Q05](#research-q05)

隔离任务检查关闭各审查通道、数据外发、延迟返回和失败回退。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 643 | — | — | 8571 |
| .js | source | 2 | 1122 | 886 | 181 | — |
| .mjs | test | 2 | 1072 | 900 | 111 | — |

</details>

**活跃度**

[![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1344738825/ai-look-up/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：自审提醒如何触发并使用审查模型，延迟结论、隐私及成本边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要中途自审，和手动检查相比如何？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

运行长编码任务并可能重复失败或无产出的代理，可获得行为节奏提醒和本地时间锚点。相对用户手工盯进度，它自动汇总近期工具行为并提示复核；误报或额外模型调用也会打断任务，短任务未必受益。作者跨宿主适配及收益声明均未在本轮运行。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-20](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L1-L20)

入口描述行为检测、时间与审查路径。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * AI Look-Up — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * Watches the agent's behavioral rhythm and injects a self-review nudge when
 * aimless grinding is detected: the exact same command repeated, variant
 * commands that normalize to the same shape, long runs with zero file edits,
 * dense calls with zero output, and failure loops. Also anchors the agent's
 * unreliable sense of time by injecting the real local clock periodically.
 *
 * v0.4: when a trigger fires and the `llm` service is present, an independent
 * reviewer LLM call (same provider/model route as the main agent, temperature
 * 0, strict JSON verdict) judges the recent behavior; its verdict is injected
 * instead of the static checklist. Any reviewer failure falls back to the
 * static checklist, so the plugin degrades gracefully.
 *
 * Extension points (see the cordis-plugin-development skill):
 * - `tools/result`      observe final tool outcomes
 * - `session/event`     reset per-turn state on `user/message`, wrap-up check on `turn/end`
 * - `agent.inject()`    mid-run context, enters the next admitted step
 * - `llm` (optional)    independent reviewer calls
```

</details>

**依据 2 · 作者声明**：[README.md:5-9](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/README.md#L5-L9)

作者说明场景。

```text
让 AI 在长时间空跑时**中途自我审查**的会话钩子。ZCode 原生支持,DeepSeek Harness 走 cordis
bundle,WorkBuddy / CodeBuddy CLI 经 `adapters/workbuddy/` 接入;Claude Code / OpenCode /
Gemini CLI 有实验性适配。

AI 在长任务里最常见的浪费是**空跑**。表现是:同一个探针脚本换个名字反复跑(`_peek2.py`、`_peek3.py`、`_peek4.py`…),失败的命令原样重试,一两个小时里一次文件都没改。本插件用会话钩子盯着这些行为,命中就让 AI 停一下:对照最初目标,看最近几步有没有带来新东西,然后决定继续、换方法还是汇报。
```

#### 缺口

- 未运行 DSH、工具事件或审查模型
  **影响**：无法确认提醒有效性、数据流和成本
  **进一步探讨**：在隔离任务验证触发、失败回退、场景切换和用量

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 的审查材料和失败回退怎样工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

构造材料时按连续工具段折叠最近调用，截取首尾简述，并包含目标、统计和触发细节。默认 llmReview 开启，服务可用时以会话 provider/model 发起独立审查，失败回退静态清单；独立 watcher 的 deliverReview 默认关闭且需 key。此路径可能把任务与工具摘要交给模型并增加用量，截断不是已验证的敏感信息脱敏。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:105-124](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L105-L124)

两个审查通道默认值。

<details>
<summary>查看原文（20行）</summary>

```text
  // independent reviewer (v0.4): one LLM call per trigger, strict JSON verdict
  llmReview: true,
  llmTimeoutMs: 20000,
  reviewLogSize: 12,
  // fold-back edit detection (v0.5): file content returning to a seen state
  editFoldback: true,
  foldbackWindow: 5,
  // adaptive reminder effectiveness (v0.5): effective reminders fire more often
  adaptive: true,
  // goal-drift patrol (v0.5): every N calls the reviewer checks goal alignment
  driftCheck: true,
  driftCheckCalls: 30,
  driftCooldownSec: 900,
  // lesson ledger (v0.5): failures register pitfalls, new agents get the top ones
  lessons: true,
  // ── 第三通道:投递请求 + 独立 watcher（v0.7）──
  // deliverReview 默认关:它要花用户自己的 API 额度,只有显式开启才投递。
  deliverReview: false,
  // watcher 用的自有 key(投递前置条件之一);空则永不投递。
  llmApiKey: '',
```

</details>

**依据 2 · 源码核查**：[index.js:472-504](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L472-L504)

审查材料组成及截取。

<details>
<summary>查看原文（33行）</summary>

```text
function buildReviewMaterial(state, cfg, now, kind, detail) {
  const log = state.recentLog;
  // 先按"连续同工具段"折叠、再取最近 N 段:关键旧证据不因新同形刷屏被挤出窗口
  const runs = [];
  for (const e of log) {
    if (runs.length && runs[runs.length - 1][0].tool === e.tool) runs[runs.length - 1].push(e);
    else runs.push([e]);
  }
  const kept = runs.slice(-cfg.reviewLogSize);
  const logLines = kept.map((run) => {
    const t = run[0].tool ?? '?';
    const fails = run.filter((e) => !e.ok).length;
    const head = (run[0].brief || '无').slice(0, 40);
    const tail = (run[run.length - 1].brief || '').slice(0, 40);
    if (run.length > 1) {
      const mark = fails ? '✗' + fails + '/' + run.length + ', ' : '';
      return t + '×' + run.length + '(' + mark + head + ' … ' + tail + ')';
    }
    return '[' + t + (fails ? ' ✗' : '') + '] ' + head;
  });
  const dist = [...Object.entries(state.byTool)].sort((a, b) => b[1] - a[1]).slice(0, 4)
    .map(([k, v]) => k + '×' + v).join(', ');
  return [
    '【审查材料】触发: ' + kind,
    '【任务】' + clipGoal(state.goal),
    '【统计】' + minutesSince(state, now).toFixed(0) + ' 分钟/' + state.toolCalls
      + ' 次调用/修改 ' + state.edits + ',连败 ' + state.failStreak + ',累计败 '
      + state.totalFailures + '。',
    '【分布】' + (dist || '无'),
    '【最近调用(旧→新)】',
    ...logLines,
    detail ? '【细节】' + detail : '',
  ].filter(Boolean).join('\n');
```

</details>

**依据 3 · 源码核查**：[index.js:709-735](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L709-L735)

读取会话路由并调用模型。

<details>
<summary>查看原文（27行）</summary>

```text
    async review(agent, material, signal, system = REVIEW_SYSTEM) {
      const header = agent?.session?.requestHeader?.();
      const provider = header?.config?.provider ?? '';
      const model = header?.config?.model ?? '';
      if (llm === null || typeof llm.stream !== 'function') throw new Error('llm service unavailable');
      if (!provider || !model) throw new Error('no request-header route on this session');
      const options = {
        provider, model,
        system,
        messages: [{ role: 'user', content: [{ type: 'text', text: material }] }],
        temperature: 0,
        signal,
      };
      let text = '';
      for await (const chunk of llm.stream(options)) {
        if (chunk?.type === 'text' && typeof chunk.text === 'string') text += chunk.text;
        if (chunk?.type === 'finish') {
          const kind = chunk.reason?.kind;
          if (kind === 'error' || kind === 'aborted') {
            throw new Error('reviewer stream ended with ' + kind
              + ': ' + (chunk.reason?.failure?.message ?? ''));
          }
        }
      }
      if (!text.trim()) throw new Error('reviewer returned no text');
      return text;
    },
```

</details>

**依据 4 · 源码核查**：[index.js:763-793](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L763-L793)

异步审查与失败回退。

<details>
<summary>查看原文（31行）</summary>

```text
  const deliverOrReview = (agent, st, kind, detail, fallbackText, system = REVIEW_SYSTEM) => {
    const now = Date.now();
    // 第三通道投递:只在升级阶梯末档(提醒了还不改)才投——把作弊面从
    // "内容可篡改"压到"行为可跳过",且成本受控(多数会话到不了这一档)。
    if (st.reminders >= cfg.escalateAfterReminders) {
      deliverReviewRequest(cfg, st, now, kind, detail);
    }
    if (cfg.llmReview && reviewer.ready && !st.reviewInFlight) {
      st.reviewInFlight = true;
      const material = buildReviewMaterial(st, cfg, now, kind, detail);
      const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
        ? AbortSignal.timeout(cfg.llmTimeoutMs) : undefined;
      reviewer.review(agent, material, signal, system).then((raw) => {
        st.reviewInFlight = false;
        const verdict = parseVerdict(raw);
        if (!verdict) { deliver(agent, ctx, fallbackText); return; }
        if (verdict.verdict === 'on-track') {
          // 机械证据型忽略 on-track(触发条件本身即"非正轨"证据),模糊型用短确认
          deliver(agent, ctx, FUZZY_KINDS.has(kind) ? verdictText(verdict) : fallbackText);
          return;
        }
        // 非 on-track:机械证据型保留完整静态清单并附判定(与 ZCode 对齐);模糊型整体替换
        deliver(agent, ctx, FUZZY_KINDS.has(kind)
          ? verdictText(verdict)
          : fallbackText + '\n' + verdictText(verdict));
      }).catch((error) => {
        st.reviewInFlight = false;
        ctx?.logger?.warn?.('[ai-look-up] reviewer fell back to static checklist: %o', error);
        deliver(agent, ctx, fallbackText);
      });
      return;
```

</details>

#### 缺口

- 未运行 DSH、工具事件或审查模型
  **影响**：无法确认提醒有效性、数据流和成本
  **进一步探讨**：在隔离任务验证触发、失败回退、场景切换和用量

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 关掉 llmReview 就能保证没有额外模型审查吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能从这个开关单独得出。提醒审查由 llmReview 控制，目标漂移分支另检查 driftCheck 和 reviewer.ready 后调用 reviewer；独立 watcher 则有另一开关和 key 条件。若需限制数据外发和费用，应检查所有通道及实际模型服务配置；结论仅为建议，不证明识别正确。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:105-124](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L105-L124)

默认 llmReview、driftCheck 和独立通道。

<details>
<summary>查看原文（20行）</summary>

```text
  // independent reviewer (v0.4): one LLM call per trigger, strict JSON verdict
  llmReview: true,
  llmTimeoutMs: 20000,
  reviewLogSize: 12,
  // fold-back edit detection (v0.5): file content returning to a seen state
  editFoldback: true,
  foldbackWindow: 5,
  // adaptive reminder effectiveness (v0.5): effective reminders fire more often
  adaptive: true,
  // goal-drift patrol (v0.5): every N calls the reviewer checks goal alignment
  driftCheck: true,
  driftCheckCalls: 30,
  driftCooldownSec: 900,
  // lesson ledger (v0.5): failures register pitfalls, new agents get the top ones
  lessons: true,
  // ── 第三通道:投递请求 + 独立 watcher（v0.7）──
  // deliverReview 默认关:它要花用户自己的 API 额度,只有显式开启才投递。
  deliverReview: false,
  // watcher 用的自有 key(投递前置条件之一);空则永不投递。
  llmApiKey: '',
```

</details>

**依据 2 · 源码核查**：[index.js:763-772](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L763-L772)

提醒审查受 llmReview 控制。

<details>
<summary>查看原文（10行）</summary>

```text
  const deliverOrReview = (agent, st, kind, detail, fallbackText, system = REVIEW_SYSTEM) => {
    const now = Date.now();
    // 第三通道投递:只在升级阶梯末档(提醒了还不改)才投——把作弊面从
    // "内容可篡改"压到"行为可跳过",且成本受控(多数会话到不了这一档)。
    if (st.reminders >= cfg.escalateAfterReminders) {
      deliverReviewRequest(cfg, st, now, kind, detail);
    }
    if (cfg.llmReview && reviewer.ready && !st.reviewInFlight) {
      st.reviewInFlight = true;
      const material = buildReviewMaterial(st, cfg, now, kind, detail);
```

</details>

**依据 3 · 源码核查**：[index.js:1002-1023](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L1002-L1023)

漂移分支单独按 driftCheck 与 reviewer.ready 触发。

<details>
<summary>查看原文（22行）</summary>

```text
      // goal-drift patrol (v0.5): every N calls, the reviewer checks whether
      // current behavior still serves the original goal; silent when on-track
      if (cfg.driftCheck && reviewer.ready
          && st.toolCalls - st.callsAtLastDrift >= cfg.driftCheckCalls
          && now - st.lastDriftAt >= cfg.driftCooldownSec * 1000) {
        st.lastDriftAt = now;
        st.callsAtLastDrift = st.toolCalls;
        st.driftChecks += 1;
        const material = buildReviewMaterial(st, cfg, now, 'goal-drift', '巡检:目标对齐');
        const driftSignal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
          ? AbortSignal.timeout(cfg.llmTimeoutMs) : undefined;
        reviewer.review(agent, material, driftSignal, REVIEW_DRIFT_SYSTEM).then((raw) => {
          const verdict = parseVerdict(raw);
          if (verdict && verdict.verdict !== 'on-track') {
            deliver(agent, ctx, '🎯 【AI 抬头 · 目标漂移巡检】判定: ' + (DRIFT_LABEL[verdict.verdict] ?? verdict.verdict)
              + '\n漂移表现: ' + (verdict.reason || '(未给出)')
              + '\n收束建议: ' + (verdict.suggestion || '(未给出)')
              + '\n请对照最初任务,决定:把当前子任务收敛回主线 / 明确其为目标之一并告知用户 / 放弃。');
          }
        }).catch((error) => {
          ctx?.logger?.warn?.('[ai-look-up] drift patrol failed: %o', error);
        });
```

</details>

#### 缺口

- 未运行 DSH、工具事件或审查模型
  **影响**：无法确认提醒有效性、数据流和成本
  **进一步探讨**：在隔离任务验证触发、失败回退、场景切换和用量

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用并处理误报或不可用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要 DSH 事件与注入通道；可选 llm 审查产生模型费用并接收任务与近期工具摘要。先用非敏感短任务审阅配置，确认 llmReview、driftCheck 与独立通道，再对照工具日志判断提醒；误报、超时或不愿发送摘要时关闭相关路径或停用插件。不能把模型意见当完成验收，宿主兼容和延迟未测。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:105-124](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L105-L124)

审查开关及默认值。

<details>
<summary>查看原文（20行）</summary>

```text
  // independent reviewer (v0.4): one LLM call per trigger, strict JSON verdict
  llmReview: true,
  llmTimeoutMs: 20000,
  reviewLogSize: 12,
  // fold-back edit detection (v0.5): file content returning to a seen state
  editFoldback: true,
  foldbackWindow: 5,
  // adaptive reminder effectiveness (v0.5): effective reminders fire more often
  adaptive: true,
  // goal-drift patrol (v0.5): every N calls the reviewer checks goal alignment
  driftCheck: true,
  driftCheckCalls: 30,
  driftCooldownSec: 900,
  // lesson ledger (v0.5): failures register pitfalls, new agents get the top ones
  lessons: true,
  // ── 第三通道:投递请求 + 独立 watcher（v0.7）──
  // deliverReview 默认关:它要花用户自己的 API 额度,只有显式开启才投递。
  deliverReview: false,
  // watcher 用的自有 key(投递前置条件之一);空则永不投递。
  llmApiKey: '',
```

</details>

**依据 2 · 源码核查**：[index.js:472-504](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L472-L504)

发送材料。

<details>
<summary>查看原文（33行）</summary>

```text
function buildReviewMaterial(state, cfg, now, kind, detail) {
  const log = state.recentLog;
  // 先按"连续同工具段"折叠、再取最近 N 段:关键旧证据不因新同形刷屏被挤出窗口
  const runs = [];
  for (const e of log) {
    if (runs.length && runs[runs.length - 1][0].tool === e.tool) runs[runs.length - 1].push(e);
    else runs.push([e]);
  }
  const kept = runs.slice(-cfg.reviewLogSize);
  const logLines = kept.map((run) => {
    const t = run[0].tool ?? '?';
    const fails = run.filter((e) => !e.ok).length;
    const head = (run[0].brief || '无').slice(0, 40);
    const tail = (run[run.length - 1].brief || '').slice(0, 40);
    if (run.length > 1) {
      const mark = fails ? '✗' + fails + '/' + run.length + ', ' : '';
      return t + '×' + run.length + '(' + mark + head + ' … ' + tail + ')';
    }
    return '[' + t + (fails ? ' ✗' : '') + '] ' + head;
  });
  const dist = [...Object.entries(state.byTool)].sort((a, b) => b[1] - a[1]).slice(0, 4)
    .map(([k, v]) => k + '×' + v).join(', ');
  return [
    '【审查材料】触发: ' + kind,
    '【任务】' + clipGoal(state.goal),
    '【统计】' + minutesSince(state, now).toFixed(0) + ' 分钟/' + state.toolCalls
      + ' 次调用/修改 ' + state.edits + ',连败 ' + state.failStreak + ',累计败 '
      + state.totalFailures + '。',
    '【分布】' + (dist || '无'),
    '【最近调用(旧→新)】',
    ...logLines,
    detail ? '【细节】' + detail : '',
  ].filter(Boolean).join('\n');
```

</details>

**依据 3 · 源码核查**：[index.js:763-793](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L763-L793)

失败回退。

<details>
<summary>查看原文（31行）</summary>

```text
  const deliverOrReview = (agent, st, kind, detail, fallbackText, system = REVIEW_SYSTEM) => {
    const now = Date.now();
    // 第三通道投递:只在升级阶梯末档(提醒了还不改)才投——把作弊面从
    // "内容可篡改"压到"行为可跳过",且成本受控(多数会话到不了这一档)。
    if (st.reminders >= cfg.escalateAfterReminders) {
      deliverReviewRequest(cfg, st, now, kind, detail);
    }
    if (cfg.llmReview && reviewer.ready && !st.reviewInFlight) {
      st.reviewInFlight = true;
      const material = buildReviewMaterial(st, cfg, now, kind, detail);
      const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
        ? AbortSignal.timeout(cfg.llmTimeoutMs) : undefined;
      reviewer.review(agent, material, signal, system).then((raw) => {
        st.reviewInFlight = false;
        const verdict = parseVerdict(raw);
        if (!verdict) { deliver(agent, ctx, fallbackText); return; }
        if (verdict.verdict === 'on-track') {
          // 机械证据型忽略 on-track(触发条件本身即"非正轨"证据),模糊型用短确认
          deliver(agent, ctx, FUZZY_KINDS.has(kind) ? verdictText(verdict) : fallbackText);
          return;
        }
        // 非 on-track:机械证据型保留完整静态清单并附判定(与 ZCode 对齐);模糊型整体替换
        deliver(agent, ctx, FUZZY_KINDS.has(kind)
          ? verdictText(verdict)
          : fallbackText + '\n' + verdictText(verdict));
      }).catch((error) => {
        st.reviewInFlight = false;
        ctx?.logger?.warn?.('[ai-look-up] reviewer fell back to static checklist: %o', error);
        deliver(agent, ctx, fallbackText);
      });
      return;
```

</details>

**依据 4 · 源码核查**：[index.js:1002-1013](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L1002-L1013)

独立漂移调用条件。

<details>
<summary>查看原文（12行）</summary>

```text
      // goal-drift patrol (v0.5): every N calls, the reviewer checks whether
      // current behavior still serves the original goal; silent when on-track
      if (cfg.driftCheck && reviewer.ready
          && st.toolCalls - st.callsAtLastDrift >= cfg.driftCheckCalls
          && now - st.lastDriftAt >= cfg.driftCooldownSec * 1000) {
        st.lastDriftAt = now;
        st.callsAtLastDrift = st.toolCalls;
        st.driftChecks += 1;
        const material = buildReviewMaterial(st, cfg, now, 'goal-drift', '巡检:目标对齐');
        const driftSignal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
          ? AbortSignal.timeout(cfg.llmTimeoutMs) : undefined;
        reviewer.review(agent, material, driftSignal, REVIEW_DRIFT_SYSTEM).then((raw) => {
```

</details>

#### 缺口

- 未运行 DSH、工具事件或审查模型
  **影响**：无法确认提醒有效性、数据流和成本
  **进一步探讨**：在隔离任务验证触发、失败回退、场景切换和用量

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有独立 watcher 时效闸之外，如何防止直接审查旧结论干扰新目标？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：直接 llm 审查返回时也对会话目标版本、时间与步数做校验，过期则丢弃或标注，可能减少切换任务后的误导。现有 watcher 结果已有场景重置、TTL 和步数闸，故不是从零引入时效；直接异步回调与 watcher 分支不同，其他等价保护未穷尽。对照现有路径模拟等待期间换目标、快速推进与正常返回，测过期注入率、误丢和延迟；无改善或误丢过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:648-671](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L648-L671)

已有 watcher 三道时效闸。

<details>
<summary>查看原文（24行）</summary>

```text
function takeReviewResults(st, cfg, now) {
  const texts = [];
  let names;
  try { names = readdirSync(reviewDir()); } catch { return texts; }
  const sid = st.sessionId || 'default';
  for (const name of names) {
    if (!name.startsWith('res_') || !name.endsWith('.json')) continue;
    const p = join(reviewDir(), name);
    let res;
    try { res = JSON.parse(readFileSync(p, 'utf8')); } catch { safeUnlink(p); continue; }
    if (!res || typeof res !== 'object') { safeUnlink(p); continue; }
    // 不属于本会话的结论不要碰(可能是另一个会话的)
    if (res.session_id && String(res.session_id) !== String(sid)) continue;
    // 闸1: 场景指纹——用户换过指令则结论作废
    if ((res.prompt_resets ?? 0) !== (st.promptResets ?? 0)) { safeUnlink(p); continue; }
    // 闸2: 过期。finished_at 缺失或非数值一律作废——不可验证时效的结论不注入。
    // (Number('abc') 为 NaN,NaN > ttl 恒为 false,会把坏数据放过去,故显式判 finite。)
    const finishedAt = Number(res.finished_at);
    if (!Number.isFinite(finishedAt) || now / 1000 - finishedAt > cfg.resultTtlSec) { safeUnlink(p); continue; }
    // 闸3: 步数——结论对应几十步前的现场,AI 已走远
    const stepsBack = st.toolCalls - Number(res.tool_calls ?? 0);
    if (stepsBack > cfg.resultSettleCalls) { safeUnlink(p); continue; }
    if (res.verdict === 'error') { safeUnlink(p); continue; }  // 失败不注入,静默丢弃
    texts.push(formatReviewResult(res, Math.max(0, stepsBack)));
```

</details>

**依据 2 · 源码核查**：[index.js:763-793](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L763-L793)

直接审查异步回调。

<details>
<summary>查看原文（31行）</summary>

```text
  const deliverOrReview = (agent, st, kind, detail, fallbackText, system = REVIEW_SYSTEM) => {
    const now = Date.now();
    // 第三通道投递:只在升级阶梯末档(提醒了还不改)才投——把作弊面从
    // "内容可篡改"压到"行为可跳过",且成本受控(多数会话到不了这一档)。
    if (st.reminders >= cfg.escalateAfterReminders) {
      deliverReviewRequest(cfg, st, now, kind, detail);
    }
    if (cfg.llmReview && reviewer.ready && !st.reviewInFlight) {
      st.reviewInFlight = true;
      const material = buildReviewMaterial(st, cfg, now, kind, detail);
      const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
        ? AbortSignal.timeout(cfg.llmTimeoutMs) : undefined;
      reviewer.review(agent, material, signal, system).then((raw) => {
        st.reviewInFlight = false;
        const verdict = parseVerdict(raw);
        if (!verdict) { deliver(agent, ctx, fallbackText); return; }
        if (verdict.verdict === 'on-track') {
          // 机械证据型忽略 on-track(触发条件本身即"非正轨"证据),模糊型用短确认
          deliver(agent, ctx, FUZZY_KINDS.has(kind) ? verdictText(verdict) : fallbackText);
          return;
        }
        // 非 on-track:机械证据型保留完整静态清单并附判定(与 ZCode 对齐);模糊型整体替换
        deliver(agent, ctx, FUZZY_KINDS.has(kind)
          ? verdictText(verdict)
          : fallbackText + '\n' + verdictText(verdict));
      }).catch((error) => {
        st.reviewInFlight = false;
        ctx?.logger?.warn?.('[ai-look-up] reviewer fell back to static checklist: %o', error);
        deliver(agent, ctx, fallbackText);
      });
      return;
```

</details>

**依据 3 · 源码核查**：[index.js:1002-1020](https://github.com/1344738825/ai-look-up/blob/1dbc46d9d66aaed1ec2dc55c012977533f204fa4/index.js#L1002-L1020)

漂移审查异步返回与注入。

<details>
<summary>查看原文（19行）</summary>

```text
      // goal-drift patrol (v0.5): every N calls, the reviewer checks whether
      // current behavior still serves the original goal; silent when on-track
      if (cfg.driftCheck && reviewer.ready
          && st.toolCalls - st.callsAtLastDrift >= cfg.driftCheckCalls
          && now - st.lastDriftAt >= cfg.driftCooldownSec * 1000) {
        st.lastDriftAt = now;
        st.callsAtLastDrift = st.toolCalls;
        st.driftChecks += 1;
        const material = buildReviewMaterial(st, cfg, now, 'goal-drift', '巡检:目标对齐');
        const driftSignal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
          ? AbortSignal.timeout(cfg.llmTimeoutMs) : undefined;
        reviewer.review(agent, material, driftSignal, REVIEW_DRIFT_SYSTEM).then((raw) => {
          const verdict = parseVerdict(raw);
          if (verdict && verdict.verdict !== 'on-track') {
            deliver(agent, ctx, '🎯 【AI 抬头 · 目标漂移巡检】判定: ' + (DRIFT_LABEL[verdict.verdict] ?? verdict.verdict)
              + '\n漂移表现: ' + (verdict.reason || '(未给出)')
              + '\n收束建议: ' + (verdict.suggestion || '(未给出)')
              + '\n请对照最初任务,决定:把当前子任务收敛回主线 / 明确其为目标之一并告知用户 / 放弃。');
          }
```

</details>

#### 缺口

- 未运行 DSH、工具事件或审查模型
  **影响**：无法确认提醒有效性、数据流和成本
  **进一步探讨**：在隔离任务验证触发、失败回退、场景切换和用量

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
