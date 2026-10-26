# feiyu-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[4c198e4](https://github.com/AirPineApplea/feiyu-memory/tree/4c198e4fb6b86695b497d08a1f680c196d9a0431)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory)
<!-- END META -->

> **实现功能**：为Harness保存人格内核、判断和情景日记，并在后续会话按相关性召回记忆。

> **核心亮点**：以三声部区分人格、判断和事件，结合本地派生索引与预算召回塑造连续感；贡献是记忆叙事与管理安排，不是事实准确或隐私保证。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：隐私门未覆盖全部额外模型请求：session/event将原文赋lastUserText，judgeWorthKeeping直接buildJudgeInput并llm.stream；scrub只在后续consolidate。固定版面板也明确不自加鉴权，不能用“无CORS”替代访问控制。静态可核，未发送真实秘密复现。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要个人三声部记忆，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · 事件整理、隐私门、合并与召回如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使个人三声部记忆的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从事件整理、隐私门、合并与召回的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用个人三声部记忆，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向接受个人陪伴式记忆、愿意人工检查本地日记的低敏感娱乐用户；交付应区分人格规则、自发判断与事件转述，不将模型推断当作用户事实或生产知识库。

手写persona和会话摘要可提供简单替代；插件额外价值是自动叙事与选择性召回，增加模型判断和隐私责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| feiyu_note | 保存自发判断 | 工具写入不是用户事实 |
| judge/固化 | 选择并整理会话记忆 | 模型路由；judge原文未清洗 |
| 本地召回/提示注入 | 跨会话叙事连续 | 相关性/随机性非事实保证 |
| 日记查看 | 核对记忆归属 | 面板认证须核部署 |
| 忘记 | 删除单条记忆 | 不撤销已发模型数据 |
| 导出 | 保存档案包 | 含个人记忆需保管 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22、DSH>=0.2.0-rc.2及Cordis ~4.0.4 | 必需 | 宿主事件和提示注入 | 版本兼容仅声明 |
| systemPrompt/agents/sessions/llm | 必需 | 收集、judge/固化与召回 | 无可用模型不能完成固化 |
| 本地~/.dsh/feiyu-diary读写 | 必需 | 人格、日记与索引原件 | 持久失败需保留原档与排查 |
| 低敏感输入与模型处理授权 | 效果/隐私必需 | 后台额外模型调用 | judge原文未清洗，不能依赖硬拦覆盖全链 |
| webServer/tools | 可选 | 面板和feiyu_note | 缺失降级，不影响全部核心 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 先审模型路由与隐私链，用低敏感profile | 不把本地落盘误作全本地处理 |
| 2 | 对话后查看人格/判断/日记来源 | 错记先修正或忘记 |
| 3 | 新会话核对召回与相关性 | 不将随机熟悉感当事实正确 |
| 4 | 退出前备份/按需清理档案 | 本地删除不能撤销已发模型数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地档案和模型资源，金额未知 | 审隐私/路由并核第一条记忆 | 作者明示非生产玩具 |
| 持续使用 | judge/固化token、提示注入和磁盘增长 | 复核误记、来源与召回 | 注入预算不等于总成本封顶 |
| 失败恢复 | 重建/备份与重复模型调用 | 定位错归因和删除残留 | 外发内容无法靠本地忘记撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 连续感 | 三声部与本地召回实现 | 陪伴体验和长期相关性 |
| 隐私清洗 | consolidate前scrub与固定规则 | judge原文路径及未知密钥形态 |
| 可管理性 | 面板查看/忘记/导出 | 部署鉴权与跨会话隔离保证 |

> **思考**：隐私门未覆盖全部额外模型请求：session/event将原文赋lastUserText，judgeWorthKeeping直接buildJudgeInput并llm.stream；scrub只在后续consolidate。固定版面板也明确不自加鉴权，不能用“无CORS”替代访问控制。静态可核，未发送真实秘密复现。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以三声部区分人格、判断和事件，结合本地派生索引与预算召回塑造连续感；贡献是记忆叙事与管理安排，不是事实准确或隐私保证。参见[Q01](#research-q01)、[Q02](#research-q02)。

以三声部区分人格、判断和事件，结合本地派生索引与预算召回塑造连续感；贡献是记忆叙事与管理安排，不是事实准确或隐私保证。参见[Q01](#research-q01)、[Q02](#research-q02)。

派生索引与三声部有清晰可借鉴处；隐私应沿所有出站数据流验证，不能只看privacy模块存在。面板应接宿主认证，多文件档案与异步队列仍需恢复核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

隐私门未覆盖全部额外模型请求：session/event将原文赋lastUserText，judgeWorthKeeping直接buildJudgeInput并llm.stream；scrub只在后续consolidate。固定版面板也明确不自加鉴权，不能用“无CORS”替代访问控制。静态可核，未发送真实秘密复现。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，不用于正式工作、多人或敏感会话。仅愿审代码与日记的个人可在无秘密样本中评估，先核judge路由及出站；错归因、敏感召回或面板暴露即停用，删除目录不等于撤回模型数据。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

叙事记忆与召回链可核；静态识别judge隐私门缺口，未实际发送秘密或运行宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/index.mjs、src/core/privacy.mjs、src/core/judge.mjs、src/core/recall.mjs、src/core/archive.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮复核既有findings并读取固定事件/模型/隐私/召回/面板分支；未执行测试或宿主，也未完整审计所有导入导出。
- 下一步：用合成敏感格式和低敏感对话追踪每次模型输入及落盘/召回，核归属、认证、忘记和停止行为。

**分析版本**

- **仓库**：[AirPineApplea/feiyu-memory](https://github.com/AirPineApplea/feiyu-memory)
- **版本号**：0.2.0（[固定提交 4c198e4](https://github.com/AirPineApplea/feiyu-memory/tree/4c198e4fb6b86695b497d08a1f680c196d9a0431)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把隐私策略放到所有模型出站共用门，并以来源/事实-推断/敏感级/确认状态控制召回，面板走宿主认证。用合成凭据追踪judge、固化、手记与日志，任何未脱敏出站或确认前误召回即否定；假设未验证，可能降低自然感并增复核。参见[Q05](#research-q05)。

用合成敏感格式和低敏感对话追踪每次模型输入及落盘/召回，核归属、认证、忘记和停止行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 24 | 6496 | 3826 | 2149 | — |
| .md | source | 7 | 2626 | — | — | 31195 |
| .js | source | 1 | 449 | 350 | 66 | — |
| .mjs | test | 13 | 4057 | 3285 | 340 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AirPineApplea/feiyu-memory/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 4c198e4fb6b86695b497d08a1f680c196d9a0431 和截止 2026-10-23T01:41:11Z 范围内，个人三声部记忆能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要个人三声部记忆，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是“下一次仍像同一条鱼”的个人娱乐体验，作者明确排除正式办公。原办法是长上下文或手写persona，插件用人格、我自己想的、情景日记区分归属，再按相关性/新鲜度召回。合格结果应是熟悉感同时不把推断当事实；三声部提供解释结构但并未证明归因和隐私正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-28](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/README.md#L14-L28)

作者非生产与隐私未验证声明

<details>
<summary>查看原文（15行）</summary>

```text
## ⚠️ 先说清楚（**装之前请务必读完这 200 字**）

- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
- **它会读取你们对话的内容**来做总结。默认全部本地处理、密钥硬拦、
  第三方隐私自动泛化（细节见[隐私](#隐私)一节的自我声明）—— 但**这些声明没有被第三方验证过**。
- 所以：**在意隐私的话，请先读代码。**
  插件本体只有 **12 个文件、3317 行**（含注释），纯 JS、**零运行时依赖、零构建步骤**，
  可以直接读完。不放心就别装，这是最省事的判断。
- 记忆存在 `~/.dsh/feiyu-diary/`。**删掉那个目录就等于忘光**，不会残留任何东西。

> 一句话：把它当成一个会记事的小玩具，别当成会保管秘密的保险箱。

```

</details>

**依据 2 · 作者声明**：[README.md:74-94](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/README.md#L74-L94)

三声部叙事划分

<details>
<summary>查看原文（21行）</summary>

````text

| | 内容 | 谁写的 |
|---|---|---|
| **人格内核** | 说话方式、底线、缺点 | 出厂设定 + 你改的。**是条文，冷的是对的** |
| **我自己想的** | 判断。`kind:"note"` | **它自己**。想到了就用 `feiyu_note` 记一句 |
| **最近的事 / 突然想起来** | 事件。其他 `kind` | 固化流程写的**转述** |

少了一栏（第三区），前两栏就会顶上来 —— 它读到的"我"全是规定加转述，
没有一句是自己长出来的。**别扭的根源不是语气，是位置。**

判据就一句：

```
事件：「我把 4519 写成 4159，他让我确认。」        ← 历史
判断：「别人给的数据跟出处对不上时，先问，别照抄。」  ← 我
```

注意 `我对他的一些印象` 那一条：**每条印象都必须带一个具体瞬间**（破折号后面那半句）。
这一条是刻意的 —— 只写"讨厌铺垫"读起来是给人建档，写上"我铺垫了三段，他说'说重点'"
才像一本日记。细节见下方[三条设计原则](#三条设计原则)第 3 条。

````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事件整理、隐私门、合并与召回如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

agent/session事件接真人消息并保留原文，停止一轮后调用judge，再在consolidate对最近transcript清洗并调用当前模型，写档后本地索引选择记忆注入systemPrompt；feiyu_note另记判断，面板提供state/forget/export。需宿主事件、LLM路由与可写目录，先配置低敏感样本、检查落盘再开新会话核召回；缺模型或档案异常只能降级，不能当完整记忆。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:672-695](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/host/index.mjs#L672-L695)

原文事件流到lastUserText/transcript

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    try {
      if (!config.enabled) return;
      const id = session?.id;
      if (typeof id !== 'string') return;
      const s = stateOf(id);

      if (event?.type === 'user/message') {
        // 必须过滤掉注入的消息，只要真人打的字
        if (event.data?.source?.kind !== 'user') return;
        const text = (event.data.content ?? [])
          .filter((b) => b?.type === 'text')
          .map((b) => b.text)
          .join('\n')
          .trim();
        if (text === '') return;

        s.turn += 1;
        s.lastUserSeq = event.seq;
        s.lastUserText = text;
        s.renderCache = { turn: -1, text: '' }; // 新一轮，作废缓存
        if (SUPPRESS_RE.test(text)) s.suppressedUntil = s.turn;
        s.transcript.push({ role: 'user', text });
        if (s.transcript.length > 40) s.transcript.splice(0, s.transcript.length - 40);
```

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:817-857](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/host/index.mjs#L817-L857)

judge选择模型并发请求

<details>
<summary>查看原文（41行）</summary>

```text
  async function judgeWorthKeeping(sessionId) {
    const s = stateOf(sessionId);
    const said = String(s.lastUserText ?? '').trim();
    if (said === '') return { keep: false, why: '这一轮他没说话' };

    const llm = ctx.get('llm');
    if (llm === undefined) return { keep: true, why: '没有 llm 服务，按默认记' };

    const selection = ctx.get('agentDefaultModel')?.currentSelection?.() ?? undefined;
    const provider = selection?.provider;
    const model = config.model || selection?.model;
    if (typeof provider !== 'string' || typeof model !== 'string') {
      return { keep: true, why: '拿不到模型信息，按默认记' };
    }

    // 手记里的话当**补充**判据（不是唯一判据 —— 新用户的 手记 里没有判据，
      // 判据本体在 judge.mjs 里随插件发）
    let handNotes = [];
    try {
      const p = path.join(archiveDirectory, HANDNOTE_FILE);
      if (existsSync(p)) handNotes = selectHandNotes(readFileSync(p, 'utf8'));
    } catch {
      // 读不到就不给，不影响判断
    }

    const built = buildJudgeInput({ lastUserText: said, handNotes });
    const opts = {
      provider,
      model,
      system: built.system,
      messages: [{ role: 'user', content: [{ type: 'text', text: built.user }] }],
      maxTokens: JUDGE_MAX_TOKENS,
      temperature: 0,
      // 后台任务绝不继承前台的思考档位（踩过：900 token 全烧在推理上）
      reasoningEffort: 'off',
      signal: abort.signal,
    };

    try {
      let raw = '';
      for await (const chunk of llm.stream(opts)) {
```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:954-1008](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/host/index.mjs#L954-L1008)

固化清洗及合并输入

<details>
<summary>查看原文（55行）</summary>

```text
    // 只取本次会话中"还没记过"的那部分：最近几轮足够，不用全量
    const recent = s.transcript.slice(-12);
    if (recent.length === 0) {
      log('没有可总结的对话，跳过固化');
      return;
    }

    log(`固化开始：${recent.length} 条消息 → ${provider}/${model}`);

    const transcript = recent
      .map((m) => `${m.role === 'user' ? '他' : '我'}：${m.text}`)
      .join('\n\n');

    // 隐私：先洗再发。密钥硬拦 + 第三方泛化都在这一步生效。
    const scrubOpts = {
      thirdParty: config.thirdPartyRedaction !== false,
      amountThreshold: config.amountThreshold,
    };
    const scrubbed = scrub(transcript, scrubOpts);

    const recentDiary = archive.diary
      .slice(-5)
      .map((e) => `- ${e.text}`)
      .join('\n');

    // ── 能不能续写上一条？──
    //
    // 固化每次看"最后 12 条消息"，越往后素材越全 —— 同一段对话会被续着写
    // 成 138 / 232 / 309 字三张快照，讲的是同一件事，占掉「最近的事」三个位。
    // 所以：同一个 session、轮数差在窗口内、而且还没到 appendMaxChars，
    // 就把上一条一起给模型，让它只写"多出来的那部分"。
    const appendWindow = Number.isFinite(config.appendWindowTurns) ? config.appendWindowTurns : 4;
    const appendMax = DEFAULT_CONSOLIDATION.appendMaxChars;
    const lastEvent = [...archive.diary]
      .reverse()
      .find((e) => e.kind !== 'note' && e.session === sessionId);
    const extendTarget =
      lastEvent &&
      Number.isFinite(lastEvent.turn) &&
      s.turn - lastEvent.turn <= appendWindow &&
      lastEvent.text.length < appendMax
        ? lastEvent
        : null;
    // 两种都打 —— 下次一眼看出是"没找到可续的"还是"找到了但模型不听话"
    log(
      extendTarget
        ? `续写判断：接上一条 ${extendTarget.id}（轮数差 ${s.turn - extendTarget.turn}，${extendTarget.text.length} 字）`
        : `续写判断：没有可续的（最后一条事件 turn=${lastEvent?.turn ?? "—"}，本轮 turn=${s.turn}）`,
    );

    const built = buildConsolidationInput({
      transcript: scrubbed.text,
      relationship: archive.relationship,
      recentDiary,
      extend: extendTarget,
```

</details>

**依据 4 · 源码核查**：[src/core/recall.mjs:27-59](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/core/recall.mjs#L27-L59)

本地派生倒排索引

<details>
<summary>查看原文（33行）</summary>

```text
export function buildIndex(entries) {
  const postings = new Map();
  const df = new Map();
  const lengths = new Map();
  const list = Array.isArray(entries) ? entries : [];

  for (const entry of list) {
    // 以正文为主索引；已存的关键词额外加权（重复计入），因为它们是刻意提炼过的
    const tokens = tokenize(entry.text ?? '');
    if (Array.isArray(entry.keywords)) {
      for (const k of entry.keywords) {
        const kt = tokenize(k);
        tokens.push(...kt, ...kt);
      }
    }
    if (tokens.length === 0) continue;

    const tf = new Map();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);

    for (const [t, n] of tf) {
      let bucket = postings.get(t);
      if (bucket === undefined) {
        bucket = new Map();
        postings.set(t, bucket);
      }
      bucket.set(entry.id, n);
      df.set(t, (df.get(t) ?? 0) + 1);
    }
    lengths.set(entry.id, tokens.length);
  }

  return { postings, df, lengths, N: lengths.size };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使个人三声部记忆的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最强支持是consolidate有scrub且密钥规则无开关，但judge先直接发送lastUserText；buildJudgeInput仅trim并返回said，没有清洗。故“发模型前密钥都拦掉”不适用于完整额外请求链。模型是否远程取决于配置，本轮未调用，不称已经泄露。面板state/forget/export处理器未见认证门且注释主动依赖无CORS，部署不能照搬其威胁假设。可借鉴派生索引、0600原子写与来源分层，不能混为安全审计通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/judge.mjs:101-115](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/core/judge.mjs#L101-L115)

judge不scrub直接返回原文

<details>
<summary>查看原文（15行）</summary>

```text
export function buildJudgeInput(input = {}) {
  const said = String(input.lastUserText ?? '').trim();
  const notes = (Array.isArray(input.handNotes) ? input.handNotes : [])
    .filter((n) => typeof n === 'string' && n.trim() !== '')
    .map((n) => `- ${n.trim()}`);

  const system =
    notes.length === 0
      ? JUDGE_SYSTEM
      : `${JUDGE_SYSTEM}

── 补充：这个用户自己说过的话（也算判据）──
${notes.join('\n')}`;

  return { system, user: said };
```

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:842-857](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/host/index.mjs#L842-L857)

judge原文进入llm.stream

<details>
<summary>查看原文（16行）</summary>

```text
    const built = buildJudgeInput({ lastUserText: said, handNotes });
    const opts = {
      provider,
      model,
      system: built.system,
      messages: [{ role: 'user', content: [{ type: 'text', text: built.user }] }],
      maxTokens: JUDGE_MAX_TOKENS,
      temperature: 0,
      // 后台任务绝不继承前台的思考档位（踩过：900 token 全烧在推理上）
      reasoningEffort: 'off',
      signal: abort.signal,
    };

    try {
      let raw = '';
      for await (const chunk of llm.stream(opts)) {
```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:967-972](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/host/index.mjs#L967-L972)

scrub只在固化路径

```text
    // 隐私：先洗再发。密钥硬拦 + 第三方泛化都在这一步生效。
    const scrubOpts = {
      thirdParty: config.thirdPartyRedaction !== false,
      amountThreshold: config.amountThreshold,
    };
    const scrubbed = scrub(transcript, scrubOpts);
```

**依据 4 · 源码核查**：[src/host/index.mjs:1288-1294](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/host/index.mjs#L1288-L1294)

作者面板防护假设

```text
   * 路由挂在应用自己的源上，**故意不设 CORS 头** —— 浏览器里别的网站
   * `fetch` 它拿不到响应体（默认跨源策略读不到），这条是真正有意义的防护。
   *
   * 本机其他进程当然能 curl 它。但它们本来就能直接读
   * `~/.dsh/feiyu-diary/` 里的明文 jsonl —— **威胁面没有变大**。
   * 所以不要因为"怕被读"就往这里加自创的鉴权：那是假的安全感，
   * 真正的秘密（密钥）在发给模型之前就已经被拦掉了（SPEC §6.3）。
```

**依据 5 · 源码核查**：[src/host/index.mjs:1375-1395](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/host/index.mjs#L1375-L1395)

state/forget处理器

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.inject(['webServer'], (scope) => {
    scope.effect(() => {
      const routes = [
        {
          kind: 'exact',
          path: `${PANEL_BASE}/state`,
          handler: async (req, res) => {
            if (req.method !== 'GET') return panelReply(res, 405, { ok: false, error: 'method' });
            await loadPromise;
            return panelReply(res, 200, panelState());
          },
        },
        {
          kind: 'exact',
          path: `${PANEL_BASE}/forget`,
          handler: async (req, res) => {
            if (req.method !== 'POST') return panelReply(res, 405, { ok: false, error: 'method' });
            try {
              const body = await readPanelBody(req);
              const removed = await forgetEntry(body?.id);
              return panelReply(res, 200, { ok: true, removed, count: archive.diary.length });
```

</details>

#### 缺口

- 宿主外层是否统一认证及所有出站分支尚未验收
  **影响**：不能给敏感数据处理保证
  **进一步探讨**：用本地可追踪模型桩和部署认证检查所有调用面，避免真实秘密

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需审路由/隐私并检查首批日记；持续付judge、固化、注入与人工纠错成本，召回本地不等于总流程零模型token；失败恢复需定位错记来源、修档和重核召回，外发不可因删目录撤回。作者给出的约260token/预算和月费用是声明，不作本轮实测或通用报价，现金/工时未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:842-852](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/host/index.mjs#L842-L852)

judge额外请求预算

<details>
<summary>查看原文（11行）</summary>

```text
    const built = buildJudgeInput({ lastUserText: said, handNotes });
    const opts = {
      provider,
      model,
      system: built.system,
      messages: [{ role: 'user', content: [{ type: 'text', text: built.user }] }],
      maxTokens: JUDGE_MAX_TOKENS,
      temperature: 0,
      // 后台任务绝不继承前台的思考档位（踩过：900 token 全烧在推理上）
      reasoningEffort: 'off',
      signal: abort.signal,
```

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:1011-1019](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/host/index.mjs#L1011-L1019)

固化另一次请求

```text
    const messages = [{ role: 'user', content: [{ type: 'text', text: built.user }] }];
    const opts = {
      provider,
      model,
      system: built.system,
      messages,
      maxTokens: config.maxTokens,
      temperature: 0.2,
      signal: signal ?? abort.signal,
```

**依据 3 · 源码核查**：[src/core/recall.mjs:1-13](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/core/recall.mjs#L1-L13)

本地召回的有限含义

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * 记忆召回 —— 完全本地、零模型 token。
 *
 * 为什么不用 SQLite / 向量库：
 *  - 向量库要下载模型 + 占几百 MB，还得开 GPU 之外的线程池，与"轻到不像插件"背道而驰
 *  - SQLite 要么引原生依赖（插件装不上），要么赌运行时有 `node:sqlite`
 *  - 倒排索引对我们这个量级（十年日记 ≈ 几千条）是**毫秒级**的，
 *    而且索引是纯派生的 —— 每次加载重建，不需要存盘，文件坏了也不影响档案本体
 *
 * 打分 = a·文本相似度 + b·salience + c·新鲜度 − d·最近刚提过的惩罚
 *
 * 分流刻意保留随机性：人本来就是"联想到什么说什么"，
 * 每次都精准翻出最相关的那条，是数据库，不是鱼。
```

</details>

#### 缺口

- 长期误记、隐私漏报和模型总费用无独立数据
  **影响**：无法评价真实连续感与复核代价
  **进一步探讨**：低敏感合成对话逐条核归因并记录所有模型调用/纠错

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从事件整理、隐私门、合并与召回的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

假设是统一出站门和可确认记忆。现有只洗固化而漏judge说明隐私不能按业务函数各自约定；所有模型请求应经过同一scrub并给阻断收据。事实/推断/敏感级与来源事件绑定，仅自动召回确认的低敏感事实。合成凭据跨judge/固化/手记/日志追踪，漏出或误归因率不降就否定，需同时测确认负担与体验退步。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/privacy.mjs:129-148](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/core/privacy.mjs#L129-L148)

可复用密钥硬门及泛化规则

<details>
<summary>查看原文（20行）</summary>

```text
  // 1) 密钥先做，且无条件做。后面任何一步出错，密钥都已经没了。
  let blocked = false;
  for (const [re, label] of SECRET_RULES) {
    if (!re.test(out)) continue;
    re.lastIndex = 0;
    out = out.replace(re, () => {
      blocked = true;
      bump('secret', label);
      return SECRET_PLACEHOLDER;
    });
  }

  // 2) 格式类 / 人名类
  if (thirdParty) {
    for (const rule of RULES) {
      if (rule.group === 'name' && !redactNames) continue;
      out = out.replace(rule.re, (...args) => {
        bump('thirdParty', rule.label);
        return typeof rule.replace === 'function' ? rule.replace(...args) : rule.replace;
      });
```

</details>

**依据 2 · 源码核查**：[src/core/judge.mjs:101-115](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/core/judge.mjs#L101-L115)

未统一出站门的证据

<details>
<summary>查看原文（15行）</summary>

```text
export function buildJudgeInput(input = {}) {
  const said = String(input.lastUserText ?? '').trim();
  const notes = (Array.isArray(input.handNotes) ? input.handNotes : [])
    .filter((n) => typeof n === 'string' && n.trim() !== '')
    .map((n) => `- ${n.trim()}`);

  const system =
    notes.length === 0
      ? JUDGE_SYSTEM
      : `${JUDGE_SYSTEM}

── 补充：这个用户自己说过的话（也算判据）──
${notes.join('\n')}`;

  return { system, user: said };
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用个人三声部记忆，何时应停止？

**研究主题**：采用判断

#### 完整回答

建议观察，明确不用于办公/秘密/多人档案。愿读代码的个人可仅用无敏感样本核三声部、模型出站和忘记；成功是来源可解释、不误当用户事实且能停止注入。发现原文外发不合预期、错归因或面板暴露就停用，检查本地档案及外部模型处理政策；不承诺删目录消除所有副本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-28](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/README.md#L14-L28)

作者明确采用边界

<details>
<summary>查看原文（15行）</summary>

```text
## ⚠️ 先说清楚（**装之前请务必读完这 200 字**）

- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
- **它会读取你们对话的内容**来做总结。默认全部本地处理、密钥硬拦、
  第三方隐私自动泛化（细节见[隐私](#隐私)一节的自我声明）—— 但**这些声明没有被第三方验证过**。
- 所以：**在意隐私的话，请先读代码。**
  插件本体只有 **12 个文件、3317 行**（含注释），纯 JS、**零运行时依赖、零构建步骤**，
  可以直接读完。不放心就别装，这是最省事的判断。
- 记忆存在 `~/.dsh/feiyu-diary/`。**删掉那个目录就等于忘光**，不会残留任何东西。

> 一句话：把它当成一个会记事的小玩具，别当成会保管秘密的保险箱。

```

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:842-857](https://github.com/AirPineApplea/feiyu-memory/blob/4c198e4fb6b86695b497d08a1f680c196d9a0431/src/host/index.mjs#L842-L857)

额外模型处理必须进入采用判断

<details>
<summary>查看原文（16行）</summary>

```text
    const built = buildJudgeInput({ lastUserText: said, handNotes });
    const opts = {
      provider,
      model,
      system: built.system,
      messages: [{ role: 'user', content: [{ type: 'text', text: built.user }] }],
      maxTokens: JUDGE_MAX_TOKENS,
      temperature: 0,
      // 后台任务绝不继承前台的思考档位（踩过：900 token 全烧在推理上）
      reasoningEffort: 'off',
      signal: abort.signal,
    };

    try {
      let raw = '';
      for await (const chunk of llm.stream(opts)) {
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
