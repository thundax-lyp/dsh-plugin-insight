# Prompt Desk

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[fab9373](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/tree/fab9373ac396e430316b09693b654051583e9713)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk)
<!-- END META -->

> **实现功能**：在对话标题栏编辑全局及共享会话提示，并管理可注入的错误教训库。

> **核心亮点**：把提示编辑、教训条目、注入预览和自述草稿审核整合到对话标题栏。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：sessionPrompt 存于单个全局状态文件，且 POST 路由可改全局 AGENTS；宿主授权未证实。详见[Q01](#research-q01)、[Q04](#research-q04)。

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
  - [Q01 · 两个提示词面板的实际作用域和存储是什么？](#detail-section-11)
  - [Q02 · 错误经验怎么被选择并注入，成本上限是什么？](#detail-section-12)
  - [Q03 · 自动认错采集能否当成已验证的纠错事实？](#detail-section-13)
  - [Q04 · 面板 HTTP 路由及全局 AGENTS 写入有哪些信任边界？](#detail-section-14)
  - [Q05 · 适合怎样试用，什么情形不宜当会话私有记忆？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人 DSH 使用中维护全局指令与人工确认的错误教训。

通常手工编辑 AGENTS.md；此插件加面板和结构化复盘注入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 作用 | 边界 |
| --- | --- | --- |
| 界面 | 编辑提示/教训 | 共享状态 |
| 模型工具 | 动态注入 | token 成本 |
| 事件监听 | 草稿捕获 | 不等于事实 |

**流程与依赖**

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH systemPrompt | 注入 | 宿主兼容性 |
| webServer | 面板读写 | 权限未知 |
| assistant-stream | 草稿捕获 | scoped 事件未证实 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 隔离 | 安装固定 SHA | 版本可查 |
| 验证 | 双会话/权限测试 | 无意外串扰 |
| 采纳 | 人工审草稿 | 教训有事实依据 |

**效果与成本**

| 项目 | 代价/边界 |
| --- | --- |
| 注入 | 每轮重发最近最多200条教训 |
| 配置 | 改写全局 AGENTS 与共享 JSON |
| 审核 | 自动自述需人工确认 |

| 能力 | 源码状态 |
| --- | --- |
| 动态提示 | 已实现，共享 sessionPrompt |
| 错误教训 | 过滤后取最近 N 条 |
| 自动草稿 | 订阅可靠性未证实 |

> **思考**：sessionPrompt 存于单个全局状态文件，且 POST 路由可改全局 AGENTS；宿主授权未证实。详见[Q01](#research-q01)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把提示编辑、教训条目、注入预览和自述草稿审核整合到对话标题栏。详见[Q01](#research-q01)、[Q02](#research-q02)。

把提示编辑、教训条目、注入预览和自述草稿审核整合到对话标题栏。详见[Q01](#research-q01)、[Q02](#research-q02)。

动态 systemPrompt.section；可选 webServer 暴露 state/pending；状态 JSON 临时写改名；assistant-stream 最佳努力订阅。

<a id="detail-section-5"></a>

### 1.4 主要限制

sessionPrompt 存于单个全局状态文件，且 POST 路由可改全局 AGENTS；宿主授权未证实。详见[Q01](#research-q01)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人隔离 profile 验证路由权限和多会话行为；只采纳人工核实的教训。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码实现了可编辑和注入，但“本次对话”提示实际共享，自动采集事件作用域未验证，写指令的 HTTP 权限依赖宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅 README、package、index.js；未运行宿主/模型。
- 下一步：多会话隔离与写入权限试验、伪流采集准确率、不同教训长度 token 测量。

**分析版本**

- **仓库**：[1015677515/dsh-prompt-ErrorNotes-desk](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk)
- **版本号**：1.2.1（[固定提交 fab9373](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/tree/fab9373ac396e430316b09693b654051583e9713)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按会话隔离状态并验证路由权限、采集流，可降低跨会话串扰和误采；尚未实现。详见[Q05](#research-q05)。

多会话隔离与写入权限试验、伪流采集准确率、不同教训长度 token 测量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1046 | — | — | 14231 |
| .js | source | 2 | 2703 | 1347 | 1167 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/issues?q=is%3Aissue+created%3A2026-09-22T06%3A20%3A47.322Z..2026-10-22T06%3A20%3A47.322Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A20%3A47.322Z..2026-10-22T06%3A20%3A47.322Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核提示词作用域、经验注入与自动采集/HTTP 边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两个提示词面板的实际作用域和存储是什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

全局框直接读写 $DSH_HOME/AGENTS.md；另一个 sessionPrompt 与错误库、设置共存在单个 $DSH_HOME/prompt-desk/state.json。源码没有用会话 ID 为 sessionPrompt 分区，注入函数每轮读取同一状态。因此界面所称“本次对话”会跨新对话延续，属于持久共享提示而非会话隔离指令。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:89-98](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/README.md#L89-L98)

作者列出的文件位置。

<details>
<summary>查看原文（10行）</summary>

```text
## 它会动你的哪些文件

全局提示词**就是** DSH 自己那个 `$DSH_HOME/AGENTS.md` —— 也就是官方 `dsh-agent-instructions` 插件本来就会读的同一个文件。本插件**不另存副本**：两个都自称「全局提示词」的文件必然会漂移，而且只有一个真正会送达模型。

| 数据 | 位置 |
|---|---|
| 全局提示词 | `$DSH_HOME/AGENTS.md` |
| 本次对话提示词、错误库、面板开关 | `$DSH_HOME/prompt-desk/state.json` |

写入是**原子**的（先写 `.tmp` 再改名），崩溃不会截断你的提示词。浏览器半边完全不碰文件系统——所有读写都在宿主半边，所以不会写到 `$DSH_HOME` 之外。
```

</details>

**依据 2 · 源码核查**：[index.js:669-689](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L669-L689)

状态对象含单个 sessionPrompt。

<details>
<summary>查看原文（21行）</summary>

```text
function currentState(configLimit, { migrating = false } = {}) {
  const state = migrating ? readStateMigrating() : readState();
  const hasSession = state.sessionPrompt.trim() !== '';
  const globalPrompt = readTextFile(globalPromptPath(), '');
  const built = buildSectionText(state, configLimit, { lessonsEnabled: globalLessonsEnabled });

  return {
    // The build handshake: the panel compares this with its own constant and warns
    // when a stale bundle is talking to a newer Host (or the reverse).
    pluginVersion: PLUGIN_VERSION,
    stateVersion: STATE_VERSION,
    categories: CATEGORIES,

    // The global prompt is the harness's own AGENTS.md, read fresh every time so
    // an edit made in a text editor shows up on the next panel open.
    globalPrompt,
    globalPromptPath: globalPromptPath(),
    sessionPrompt: state.sessionPrompt,
    errors: state.errors,
    pending: state.pending,
    ui: state.ui,
```

</details>

**依据 3 · 源码核查**：[index.js:821-828](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L821-L828)

补丁直接修改同一状态字段。

```text
function applyPatch(patch, configLimit) {
  const state = readState();
  if (patch !== null && typeof patch === 'object') {
    const sessionPrompt = patchText(patch.sessionPrompt);
    if (sessionPrompt !== undefined) state.sessionPrompt = sessionPrompt;

    if (typeof patch.globalPrompt === 'string') writeTextFile(globalPromptPath(), patch.globalPrompt);

```

**依据 4 · 源码核查**：[index.js:1142-1155](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L1142-L1155)

系统提示段从共享状态读取。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.inject(['systemPrompt'], (scope) => {
    scope.systemPrompt.section({
      name: 'prompt-desk:mistakes-and-instructions',
      order: 10200,
      text: () => {
        try {
          return buildSectionText(readState(), configLimit, {
            lessonsEnabled: globalLessonsEnabled,
          }).text;
        } catch {
          return '';
        }
      },
    });
```

</details>

#### 缺口

- 未在实际多会话环境运行。
  **影响**：宿主可能额外隔离进程，但源码未实现。
  **进一步探讨**：隔离 profile 中用两个对话验证提示词串扰。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 错误经验怎么被选择并注入，成本上限是什么？

**研究主题**：贡献与相对优势、效果与总成本

#### 完整回答

仅带非空 lesson 的条目进入候选，先过滤后取最新 N 条并逆序，仅把教训文本加入系统提示词，不注入事件细节。默认 N=10、最大200、0可停经验注入；会话提示和自我认错提示不受 N=0 影响。每轮重建并重发提示段，实际 token 成本取决于教训总长度；源码对教训长度只建议、不硬限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:120-137](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/README.md#L120-L137)

作者描述注入规则。

<details>
<summary>查看原文（18行）</summary>

```text
## 注入是怎么工作的

本次对话提示词、以及**最近 10 条**错误经验，通过 `ctx.systemPrompt.section()` 注入，顺序值 `10200`（`DEPLOYMENT_PERSONA_SUFFIX`），即排在工具文档之后。

- `text` 传的是**函数**，所以改完**下一轮对话就生效**——不用重启，也不用重新注册。
- 只注入**教训**。`detail` 解释了事情经过，`type` 是这次的事故标题——两者描述的都是**某一个瞬间**，只有碰上长得像的下一次任务才有用；而教训是一条能迁移的规则。`detail` 同时是 token 最贵的一项，所以两者都只留在面板里。
- **没有教训的条目不注入**，面板里会标出来让你补。它不占注入条数的额度——上限数的是"真正注入的条数"，所以先筛掉再取最近 N 条。
- 条数上限是为了不让经验库变成 token 黑洞：完整列表始终在面板里可读，提示词里也会说明当前只显示了其中一部分。

### 注入条数可以自己设

**在错误库面板里直接填**（最方便）：面板里有一个「注入条数上限」输入框，填好点「保存」即可，下一轮对话生效。

| 字段 | 默认 | 含义 |
|---|---|---|
| `injectLimit` | `10` | 注入系统提示词的错误经验条数上限。`0` = 一条都不注入（会话提示词不受影响）；最大 `200`，填更大也会被夹到 200 |

**优先级**：面板里填的值优先；清空输入框并保存（或点「恢复默认」）就回到"跟随插件配置"。
```

</details>

**依据 2 · 源码核查**：[index.js:597-657](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L597-L657)

候选过滤、取最近、构造提示块。

<details>
<summary>查看原文（61行）</summary>

```text
function buildSectionText(state, configLimit, { lessonsEnabled = true } = {}) {
  const limit = effectiveInjectLimit(state, configLimit);

  const sessionBlock = state.sessionPrompt.trim() === ''
    ? ''
    : `## Session instructions (from the user, this conversation)\n${state.sessionPrompt.trim()}`;

  let errorBlock = '';
  let injectedCount = 0;

  /*
   * Entries that carry a lesson are the only ones that can be injected; everything
   * else is a story with no rule extracted from it yet.
   *
   * Computed unconditionally, before the export switch is consulted: the panel
   * reports "N of M injectable entries" even while injection is paused, and a
   * number that only exists while the switch is on would read as zero the moment
   * the user turns it off — exactly when they are looking at it to decide.
   */
  const injectable = state.errors.filter((entry) => (entry.lesson || '').trim() !== '');

  if (state.exportToPrompt && lessonsEnabled && injectable.length > 0 && limit > 0) {
    /*
     * Only the lesson is injected — not the incident that produced it.
     *
     * The incident is a story about one moment ("上次改 package.json 时用了
     * PowerShell"), and a story is only actionable if the next task happens to look
     * like that moment. The lesson is the rule the story was supposed to teach, and
     * a rule travels. Entries without a lesson therefore carry nothing transferable
     * and are skipped rather than injected as a bare incident; the panel marks them
     * so the user can fill the lesson in.
     *
     * The filter runs BEFORE the limit, so the limit counts entries that are
     * actually injected. Slicing first would let a few lesson-less entries silently
     * consume the budget and quietly shrink the block.
     */
    const recent = injectable.slice(-limit).reverse();
    injectedCount = recent.length;
    const lines = recent.map((entry) => `- ${(entry.lesson || '').trim()}`);
    /*
     * Title and trailer are Chinese and short on purpose: this block is re-sent on
     * every request, so every character is a per-turn cost. The English title
     * ("Mistakes you have made before — do not repeat them") and the English
     * truncation note cost roughly 3x their Chinese equivalents for the same
     * meaning, and the entries themselves are already Chinese.
     *
     * The denominator is the injectable count, not `state.errors.length`: saying
     * "共 8 条" while two of them cannot be injected would misdescribe what the
     * number is counting.
     */
    errorBlock = '## 别重犯以下错误\n'
      + lines.join('\n')
      + (injectable.length > limit
        ? `\n（仅显示最近 ${limit} 条，共 ${injectable.length} 条。）`
        : '');
  }

  const cueBlock = state.exportToPrompt ? `${CUE_TITLE}\n${CUE_BODY}` : '';

  const text = [sessionBlock, errorBlock, cueBlock].filter((part) => part !== '').join('\n\n');
  return { text, sessionBlock, errorBlock, cueBlock, injectedCount, injectableCount: injectable.length, limit };
```

</details>

**依据 3 · 源码核查**：[index.js:699-705](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L699-L705)

lessonMax 是建议而非硬限制。

```text
     */
    advice: {
      // Recommended ceiling for a lesson; longer is stored and injected anyway.
      lessonMax: LESSON_ADVICE_MAX,
      // Hard ceiling for the incident, enforced by the parser.
      incidentMax: MAX_INCIDENT_CHARS,
    },
```

**依据 4 · 源码核查**：[index.js:1142-1155](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L1142-L1155)

每轮动态取状态。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.inject(['systemPrompt'], (scope) => {
    scope.systemPrompt.section({
      name: 'prompt-desk:mistakes-and-instructions',
      order: 10200,
      text: () => {
        try {
          return buildSectionText(readState(), configLimit, {
            lessonsEnabled: globalLessonsEnabled,
          }).text;
        } catch {
          return '';
        }
      },
    });
```

</details>

#### 缺口

- 未测实际 token/延迟。
  **影响**：极长教训仍可推高每轮成本。
  **进一步探讨**：用不同条目长度做提示 token 测量。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动认错采集能否当成已验证的纠错事实？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

宿主监听 assistant-stream，按 agent 缓冲 text-delta，仅 committed 输出会解析；格式要在一行同时包含“错误经过”和“教训”，通过长度/占位符等过滤后加入最多20个待确认草稿。确认操作才转成错误库，说明采集只是模型自述候选，并非外部判定。代码自身承认全局 ctx 对 scoped 事件能否收到尚未证明，订阅失败被静默处理，因此自动捕获可靠性亦待验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:987-1024](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L987-L1024)

多处标记逐个解析。

<details>
<summary>查看原文（38行）</summary>

```text
function parseConfession(text) {
  if (typeof text !== 'string') return null;

  /*
   * Try **every** marker occurrence, earliest first, instead of only the first.
   *
   * This used to read the first occurrence, reject it if it did not open its line,
   * and give up on the message. That silently lost the real confession in the single
   * most common shape there is: a message that first *mentions* the marker (quoting
   * it, showing the format, discussing this feature) and then confesses. Measured
   * case: "先说 `我犯了个错误` 这个词，然后\n我犯了个错误：错误经过：真实错误 教训：真实教训"
   * returned null — the quotation consumed the whole message.
   *
   * Now a rejected occurrence is simply skipped, and the search continues to the
   * next one. Every rejection rule below is unchanged and still applied to each
   * candidate in turn; only the give-up-on-first-failure behaviour is gone. The
   * earliest occurrence that parses cleanly still wins, so a message with several
   * genuine confessions yields one draft — the documented maximum.
   */
  const positions = [];
  for (const marker of CONFESSION_MARKERS) {
    let from = 0;
    for (;;) {
      const found = text.indexOf(marker, from);
      if (found < 0) break;
      positions.push(found);
      from = found + marker.length; // + length: a stale match cannot repeat forever
    }
  }
  if (positions.length === 0) return null;
  positions.sort((a, b) => a - b);

  for (const at of positions) {
    const draft = parseConfessionAt(text, at);
    if (draft !== null) return draft;
  }
  return null;
}
```

</details>

**依据 2 · 源码核查**：[index.js:1032-1084](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L1032-L1084)

格式和占位符过滤。

<details>
<summary>查看原文（53行）</summary>

```text
function parseConfessionAt(text, at) {
  /*
   * The marker must open its line.
   *
   * Quoting the marker mid-sentence is the normal way a discussion of this feature
   * reads, and every such sentence used to become a draft. Only whitespace, list
   * bullets, ordered-list numbers and blockquote markers may precede it.
   */
  const lineStart = text.lastIndexOf('\n', at) + 1;
  if (!/^[\s\-*+>\d.]*$/.test(text.slice(lineStart, at))) return null;

  // Both labels must sit on the marker's own line; a confession is one line.
  const line = text.slice(at).split(/\r?\n/, 1)[0];

  const incidentMatch = INCIDENT_LABEL.exec(line);
  if (incidentMatch === null) return null;
  const lessonMatch = LESSON_LABEL.exec(line);
  if (lessonMatch === null) return null;
  // Order is fixed: a lesson before the incident is not the documented format.
  if (lessonMatch.index <= incidentMatch.index) return null;

  const incident = line
    .slice(incidentMatch.index + incidentMatch[0].length, lessonMatch.index)
    .trim();
  const rule = line.slice(lessonMatch.index + lessonMatch[0].length).trim();
  if (incident === '' || rule === '') return null;

  /*
   * Reject an echo of the instruction itself.
   *
   * The cue lives in the system prompt and spells the template out in full, so a
   * model that quotes the format back — "错误经过：<当时实际发生了什么> 教训：<…>" — would
   * otherwise be captured verbatim as a confession whose incident is "<当时实际发生了什么>".
   * Angle brackets are the tell: a genuine confession describes an incident and does
   * not wrap it in placeholders. Dropping the line is the right failure here; a
   * false draft costs the user a review round for nothing.
   */
  if (/[<>]/.test(incident) || /[<>]/.test(rule)) return null;

  // A quoted code fragment, not a description of what went wrong.
  if (CODE_START.test(incident)) return null;

  // Too short to describe anything, or so long it is clearly swept-up prose.
  if (incident.length < 4 || incident.length > MAX_INCIDENT_CHARS) return null;

  return {
    date: today(),
    category: OTHER,
    type: incident,
    lesson: rule,
    detail: '',
    source: 'auto',
  };
```

</details>

**依据 3 · 源码核查**：[index.js:1095-1102](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L1095-L1102)

待确认队列和去重。

```text
function queuePending(draft) {
  const state = readState();
  const key = (entry) => `${entry.type}\u0000${entry.lesson}`;
  if (state.pending.some((entry) => key(entry) === key(draft))) return false;
  state.pending.push(sanitizeEntry(draft));
  state.pending = state.pending.slice(-MAX_PENDING);
  saveState(state);
  return true;
```

**依据 4 · 源码核查**：[index.js:899-915](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L899-L915)

用户确认后入库。

<details>
<summary>查看原文（17行）</summary>

```text
    // Move a confirmed draft into the library, carrying whatever the user edited.
    if (patch.pendingAccept !== null && typeof patch.pendingAccept === 'object') {
      const id = patchText(patch.pendingAccept.id);
      const index = id === undefined ? -1 : state.pending.findIndex((item) => item.id === id);
      if (index >= 0) {
        const draft = state.pending[index];
        state.pending.splice(index, 1);
        const entry = sanitizeEntry({
          date: draft.date,
          category: patchText(patch.pendingAccept.category) ?? draft.category,
          type: patchText(patch.pendingAccept.type) ?? draft.type,
          lesson: patchText(patch.pendingAccept.lesson) ?? draft.lesson,
          detail: patchText(patch.pendingAccept.detail) ?? draft.detail,
          source: 'auto',
        });
        if (entry !== null) state.errors.push(entry);
      }
```

</details>

**依据 5 · 源码核查**：[index.js:1267-1319](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L1267-L1319)

流订阅及未证实的作用域。

<details>
<summary>查看原文（53行）</summary>

```text
  const streamBuffers = new Map();

  const onAssistantStream = (payload) => {
    try {
      const agentKey = payload.agent.id;

      if (payload.frame.type === 'start') {
        // Reset buffer for this stream attempt. Multiple starts before an end
        // shouldn't happen, but if they do, the latest start wins.
        streamBuffers.set(agentKey, []);
        return;
      }

      if (payload.frame.type === 'chunk' && payload.frame.chunk.type === 'text-delta') {
        const buf = streamBuffers.get(agentKey);
        if (buf !== undefined) buf.push(payload.frame.chunk.text);
        return;
      }

      if (payload.frame.type === 'end') {
        const buf = streamBuffers.get(agentKey);
        streamBuffers.delete(agentKey);
        if (buf === undefined || buf.length === 0) return;

        // Abandoned — the output never reached the conversation, skip it.
        if (payload.frame.outcome.kind === 'abandoned') return;

        const fullText = buf.join('');
        const draft = parseConfession(fullText);
        if (draft !== null) queuePending(draft);
      }
    } catch {
      // A listener failure must not break the event dispatch.
    }
  };

  /*
   * Subscribing is best-effort on purpose.
   *
   * Whether a listener registered on this plugin's global `ctx` actually receives
   * `agent/assistant-stream` — dispatched as `Scoped<Agent>` — could not be settled
   * from the API catalog, and it can go wrong in two different ways. The benign one
   * is that the event never arrives and capture stays inert. The dangerous one is
   * that the subscription call itself throws while the plugin is loading: DSH
   * startup is all-or-nothing, so a throw here would take the whole harness down
   * with it. Wrapping costs nothing and turns the worst case into "no automatic
   * capture" instead of "no harness".
   */
  try {
    ctx.on('agent/assistant-stream', onAssistantStream);
  } catch {
    // Leave capture inert; every other feature is unaffected.
  }
```

</details>

#### 缺口

- 无真实事件流或人工标注验证。
  **影响**：漏采、误采率未知。
  **进一步探讨**：伪造 committed/abandoned 流和人工审阅样本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 面板 HTTP 路由及全局 AGENTS 写入有哪些信任边界？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

可选 webServer 注册 GET/POST /prompt-desk/state，POST JSON patch 可改全局 AGENTS.md 与共享 sessionPrompt、经验库。插件路由未显示自己的鉴权、CSRF 或请求来源校验，是否由宿主统一保护未查证。状态与全局提示均调用 writeTextFile，先写带 pid 与递增计数的独占调用名 .tmp 再 rename；这只提供单文件替换，不是两个文件的事务，也没有并发版本比较；面板写入的是高优先级指令，部署前须验证宿主路由授权和跨源限制。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:821-829](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L821-L829)

patch.globalPrompt 直接写 AGENTS。

```text
function applyPatch(patch, configLimit) {
  const state = readState();
  if (patch !== null && typeof patch === 'object') {
    const sessionPrompt = patchText(patch.sessionPrompt);
    if (sessionPrompt !== undefined) state.sessionPrompt = sessionPrompt;

    if (typeof patch.globalPrompt === 'string') writeTextFile(globalPromptPath(), patch.globalPrompt);

    if (typeof patch.exportToPrompt === 'boolean') state.exportToPrompt = patch.exportToPrompt;
```

**依据 2 · 源码核查**：[index.js:1161-1214](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L1161-L1214)

GET/POST 注册与 JSON 写入路径。

<details>
<summary>查看原文（54行）</summary>

```text
  ctx.inject(['webServer'], (scope) => {
    const webServer = scope.webServer;

    scope.effect(() => {
      const dispose = webServer.register({
        kind: 'exact',
        path: `${BASE}/state`,
        handler: (req, res) => {
          const method = (req.method || 'GET').toUpperCase();

          if (method === 'GET') {
            try {
              // The GET route is the one place a repair write is allowed: it is a
              // user-driven read with no assembly in flight, and persisting migrated
              // ids once is what makes them stable for the edits that follow.
              sendJson(res, 200, currentState(configLimit, { migrating: true }));
            } catch (error) {
              sendJson(res, 500, { error: String(error && error.message ? error.message : error) });
            }
            return;
          }

          if (method !== 'POST') {
            res.statusCode = 405;
            res.end('method not allowed');
            return;
          }

          readBody(req).then(
            (text) => {
              let patch = null;
              try {
                patch = JSON.parse(text || '{}');
              } catch {
                sendJson(res, 400, { error: 'invalid JSON body' });
                return;
              }
              try {
                sendJson(res, 200, applyPatch(patch, configLimit));
              } catch (error) {
                sendJson(res, 500, { error: String(error && error.message ? error.message : error) });
              }
            },
            (error) => {
              sendJson(res, 400, { error: String(error && error.message ? error.message : error) });
            },
          );
        },
      });

      // `register` returns a disposer; hand it back so the route is removed when
      // this plugin unloads or reloads.
      return typeof dispose === 'function' ? dispose : undefined;
    });
```

</details>

**依据 3 · 作者声明**：[README.md:89-106](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/README.md#L89-L106)

作者说明全局 AGENTS 与手工保存。

<details>
<summary>查看原文（18行）</summary>

```text
## 它会动你的哪些文件

全局提示词**就是** DSH 自己那个 `$DSH_HOME/AGENTS.md` —— 也就是官方 `dsh-agent-instructions` 插件本来就会读的同一个文件。本插件**不另存副本**：两个都自称「全局提示词」的文件必然会漂移，而且只有一个真正会送达模型。

| 数据 | 位置 |
|---|---|
| 全局提示词 | `$DSH_HOME/AGENTS.md` |
| 本次对话提示词、错误库、面板开关 | `$DSH_HOME/prompt-desk/state.json` |

写入是**原子**的（先写 `.tmp` 再改名），崩溃不会截断你的提示词。浏览器半边完全不碰文件系统——所有读写都在宿主半边，所以不会写到 `$DSH_HOME` 之外。

### 作者自用的提示词（仅供参考，不会被套用）

仓库根目录有一份 [`AGENTS.example.md`](AGENTS.example.md)，是插件作者自己正在用的全局提示词原文，公开出来纯粹当**写法参考**：你可以看看别人怎么分节组织、怎么把"先自检再交付""删除前报范围"这类要求写成一条能照着执行的话，然后照自己的习惯改。

**它不会覆盖你的提示词，装插件也不会。** 说清楚以免误会：

- 安装插件不会写入你的 `AGENTS.md`。代码里唯一会写这个文件的地方是你在面板里点「保存」的那一刻，写的是**你自己输入框里的内容**，不是这个样例。
```

</details>

**依据 4 · 源码核查**：[index.js:390-403](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L390-L403)

状态临时文件写入。

<details>
<summary>查看原文（14行）</summary>

```text
 * Atomic write: a `.tmp` sibling then a rename, so a reader never observes a
 * half-written file and a crash cannot truncate the user's prompt.
 *
 * The temporary name is unique per call. It used to be a fixed `${path}.tmp`, which
 * was safe only because every write came from a user action; the Host now also
 * writes on its own (the pending queue), so two writers can overlap and a shared
 * temporary name would let them clobber each other's bytes before the rename.
 */
function writeTextFile(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.${process.pid.toString(36)}${idCounter.toString(36)}.tmp`;
  idCounter += 1;
  writeFileSync(tmp, text, 'utf8');
  renameSync(tmp, path);
```

</details>

#### 缺口

- 宿主 webServer 的鉴权/CSRF 未在插件仓库证明。
  **影响**：跨源或未授权修改风险不能定性为可利用漏洞。
  **进一步探讨**：在隔离实例审查宿主中间件并做无害请求测试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 适合怎样试用，什么情形不宜当会话私有记忆？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合信任本机宿主的个人工作流，在隔离 profile 先验证 route 权限、跨对话共享行为和 committed 流采集，再手动确认每条教训。团队多用户、敏感全局 AGENTS 或需会话隔离的场景不宜直接按“本次对话”标签理解。若真正需要隔离，可按 agent/session ID 存取状态并在提示注入时按作用域选择；此为改进设想，不是现有功能。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-18](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/README.md#L13-L18)

作者面板用途。

```text
| 面板 | 作用 |
|---|---|
| **提示词** | 编辑**跨对话**的全局提示词，以及**本次对话**的提示词（新对话会延续）。面板顶部显示哪一半当前正在生效。 |
| **错误库** | **按分类**归纳反复犯的错误：每条一个简短类型 + 一句教训，归入三档分类之一。**最近 10 条（条数可自己设）会被注入系统提示词**，让后续对话以极低的 token 成本吸取教训。agent 按格式汇报「我犯了个错误：错误经过：… 教训：…」时会被自动捕获成待确认草稿。 |

第二个面板的意义：一个反复犯同类错误的 agent，会在自己的上下文里收到一份简短的、按分类归好的提醒，成本远低于重新踩一遍坑再发现。
```

**依据 2 · 源码核查**：[index.js:669-689](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L669-L689)

单一共享状态。

<details>
<summary>查看原文（21行）</summary>

```text
function currentState(configLimit, { migrating = false } = {}) {
  const state = migrating ? readStateMigrating() : readState();
  const hasSession = state.sessionPrompt.trim() !== '';
  const globalPrompt = readTextFile(globalPromptPath(), '');
  const built = buildSectionText(state, configLimit, { lessonsEnabled: globalLessonsEnabled });

  return {
    // The build handshake: the panel compares this with its own constant and warns
    // when a stale bundle is talking to a newer Host (or the reverse).
    pluginVersion: PLUGIN_VERSION,
    stateVersion: STATE_VERSION,
    categories: CATEGORIES,

    // The global prompt is the harness's own AGENTS.md, read fresh every time so
    // an edit made in a text editor shows up on the next panel open.
    globalPrompt,
    globalPromptPath: globalPromptPath(),
    sessionPrompt: state.sessionPrompt,
    errors: state.errors,
    pending: state.pending,
    ui: state.ui,
```

</details>

**依据 3 · 源码核查**：[index.js:1330-1350](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L1330-L1350)

/lessons 明确跨会话生效。

<details>
<summary>查看原文（21行）</summary>

```text
   * The `text()` function for the prompt section only receives an opaque
   * `AssembleContext.scope` object — not the Agent id string that the command
   * handler sees on `invocation.agent.id`. Until the scope → id mapping is
   * proven by runtime inspection, the toggle is *global*: `/lessons off`
   * affects all agents. The user types it in one conversation and every
   * session stops receiving library injections. That's a safe simplification.
   */
  const lessonsCommand = {
    name: 'lessons',
    description: '临时开关：/lessons off 关闭错误经验注入，/lessons on 恢复。全局生效（跨对话）。',
    input: { hint: 'on 或 off' },
    handler(invocation) {
      const raw = invocation.rawInput.trim().toLowerCase();

      if (raw === 'off') {
        globalLessonsEnabled = false;
        return { kind: 'success', text: '已全局关闭错误经验注入。' };
      }
      if (raw === 'on') {
        globalLessonsEnabled = true;
        return { kind: 'success', text: '已全局恢复错误经验注入。' };
```

</details>

**依据 4 · 源码核查**：[index.js:1304-1319](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/fab9373ac396e430316b09693b654051583e9713/index.js#L1304-L1319)

采集订阅可靠性边界。

<details>
<summary>查看原文（16行）</summary>

```text
   * Subscribing is best-effort on purpose.
   *
   * Whether a listener registered on this plugin's global `ctx` actually receives
   * `agent/assistant-stream` — dispatched as `Scoped<Agent>` — could not be settled
   * from the API catalog, and it can go wrong in two different ways. The benign one
   * is that the event never arrives and capture stays inert. The dangerous one is
   * that the subscription call itself throws while the plugin is loading: DSH
   * startup is all-or-nothing, so a throw here would take the whole harness down
   * with it. Wrapping costs nothing and turns the worst case into "no automatic
   * capture" instead of "no harness".
   */
  try {
    ctx.on('agent/assistant-stream', onAssistantStream);
  } catch {
    // Leave capture inert; every other feature is unaffected.
  }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
