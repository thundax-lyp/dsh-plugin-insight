# feiyu-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[df441be](https://github.com/AirPineApplea/feiyu-memory/tree/df441be7771f91bbeafe9beb14ffc8f3ff5d6701)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AirPineApplea/feiyu-memory) [![npm 30d 706](https://img.shields.io/static/v1?label=npm+30d&message=706&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/feiyu-memory) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/feiyu-memory)
<!-- END META -->

> **功能**：为个人陪伴保存事件日记，以摘要、近期提示和主动召回延续叙事记忆。

> **亮点**：以事件日记和隐藏摘要索引组织个人叙事连续感，分离近期与旧事、主会话呈现与后台挑选。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：judge/回填/picker没有统一出站清洗；旧note可经主动路径返回，persist失败仍被清零/吞掉。见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 新版事件日记对谁提供什么连续感？](#detail-section-11)
  - [Q02 · 事件到摘要、注入和主动召回怎样工作？](#detail-section-12)
  - [Q03 · 全部模型出站和旧条目隔离是否可靠？](#detail-section-13)
  - [Q04 · 忘记、导入和写失败能给出耐久回执吗？](#detail-section-14)
  - [Q05 · 使用条件、步骤和成本效果如何展开？](#detail-section-15)
  - [Q06 · 为何观察，哪种生产方向可证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人陪伴娱乐的叙事续接，事实/推断归属需可解释，作者排除正式工作。见[Q01](#research-q01)。

长上下文或persona/手工日记更直接；插件增加事件整理与主动找往事，也增加模型/类型/恢复状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 人格/关系/只读手记 | 叙事身份连续 | 不是用户事实，手记不再由note工具生成 |
| 事件日记/摘要 | 整理故事并供检索 | 额外模型请求，来源/隐私需核 |
| 自动近期/旧事 | 跨会话补上下文 | 普通轮recent仍可能在预算池，pin额外容差 |
| feiyu_recall | 主动找往事 | 最多400候选，旧note未统一过滤，模型/词法退路 |
| 面板/导入导出 | 本地管理/迁移 | 同源非认证，备份/模型副本另核 |
| 忘记/持久 | 墓碑与月份清理 | 失败计数清零缺陷，成功答复非耐久收据 |

**流程与依赖**

宿主事件/提示/LLM与可写绝对档案目录必需，Web面板可选；直接src导出不等运行已验。表见[Q05](#research-q05)。

匿名故事逐一核四类模型请求、注入/主动类型、忘记/重开与导入，不凭记住了判耐久。步骤见[Q05](#research-q05)。

**效果与成本**

新增summary/picker使总调用不同于主提示预算；近期免预算及后台回填需入账。完整表见[Q05](#research-q05)。

叙事连续感可研究，不当生产事实库；省token、自然感与隐私改善均未测。保留/否定条件见[Q06](#research-q06)。

> **思考**：judge/回填/picker没有统一出站清洗；旧note可经主动路径返回，persist失败仍被清零/吞掉。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以事件日记和隐藏摘要索引组织个人叙事连续感，分离近期与旧事、主会话呈现与后台挑选。见[Q01](#research-q01)、[Q02](#research-q02)。

分池/墓碑/导入意图可借鉴，但各入口类型/隐私与成功状态要统一。见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

judge/回填/picker没有统一出站清洗；旧note可经主动路径返回，persist失败仍被清零/吞掉。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，不迁办公/敏感/多人资料；无敏感独立样本先查出站和耐久。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定4.0.2支持事件/摘要召回流程，不能沿用0.3.4三声部或全本地/总预算强说法；自然感、出站与恢复待验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/core/archive.mjs、src/core/consolidate.mjs、src/core/judge.mjs、src/core/persona.mjs、src/core/recall.mjs、src/host/index.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定4.0.2入口配置/事件、judge/固化输入输出、摘要回填、自动/主动召回及预算、面板来源栅栏、墓碑/导入/持久链；未穷尽客户端、全部隐私规则、模型输出与宿主后端。
- 下一步：未执行目标或发送秘密；一般宿主加载归范围边界，出站/旧类型/注入/恢复与体验为实质缺口。

**分析版本**

- **仓库**：[AirPineApplea/feiyu-memory](https://github.com/AirPineApplea/feiyu-memory)
- **版本号**：4.0.2（[固定提交 df441be](https://github.com/AirPineApplea/feiyu-memory/tree/df441be7771f91bbeafe9beb14ffc8f3ff5d6701)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

统一出站/类型与来源确认、明确耐久回执，能否减少敏感误传和误信而保持自然感待验证。见[Q06](#research-q06)。

未执行目标或发送秘密；一般宿主加载归范围边界，出站/旧类型/注入/恢复与体验为实质缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 3262 | — | — | 39318 |
| .js | source | 1 | 456 | 335 | 86 | — |
| .mjs | source | 23 | 7588 | 4264 | 2763 | — |
| .mjs | test | 20 | 5087 | 3960 | 551 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/AirPineApplea/feiyu-memory/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：4.0.2事件日记的连续感能否与明确归属、统一出站隐私和耐久恢复并存？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 新版事件日记对谁提供什么连续感？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向把DSH作个人陪伴娱乐、愿读代码和检查档案的人，作者明确排除正式工作。合格结果是下一次仍有熟悉感、能解释往事来源，同时不把模型叙事和推断当用户事实；不应作为生产知识库、多人或敏感档案。

固定版本已是4.0.2。旧0.3.4的“三声部/feiyu_note”贡献不能照搬：当前以人格、关系、只读手记和事件日记呈现，旧traits/lexicon/note数据保留但不再作为同样的自动生成/常驻栏目；主动工具改为feiyu_recall。源码自动注入排除note，主动工具是否同样排除见Q03。

长上下文或手工persona/日记是基线。增量是事件固化、摘要索引、近期/旧事分池以及主动往事召回，让叙事连续感不全靠聊天历史；不是事实真值、隐私保证或新的通用记忆算法。体验、误归因和长期相关性未独立验证，作者示例和价格不当本轮结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-28](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/README.md#L14-L28)

作者娱乐定位、未审计和隐私声明。

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

**依据 2 · 源码核查**：[package.json:2-4](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/package.json#L2-L4)

实际4.0.2版本及定位。

```text
  "name": "feiyu-memory",
  "version": "4.0.2",
  "description": "给 DeepSeek Harness 一条会记事的蓝色大肥鱼：跨会话的持久人格与日记。每轮结束后固化模型只回答一句「你想记什么」，写下的每条日记配一句十几二十字的索引；下一场对话注入人格、手记和最近的几条，想知道更早的事它自己调 feiyu_recall，插件读索引挑出相关的那几条，正文才进上下文——索引永远不进它的视野，所以它看到的是日子，不是检索结果。遗忘是降权而不是删除。全程本地、发送前先拦掉密钥，档案是一个可读可改、能换账号带走的普通文件夹。零运行时依赖，无构建步骤。",
```

**依据 3 · 作者声明**：[README.md:59-91](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/README.md#L59-L91)

当前四项与旧三栏目撤下的作者说明。

<details>
<summary>查看原文（33行）</summary>

````text

## 这块记忆里有四样东西

|  | 内容 | 谁写的 | 每轮都在吗 |
|---|---|---|---|
| **人格内核** | 说话方式、底线、缺点 | 出厂设定 + 你改的 | 在 |
| **关系** | 认识多少天、他管我叫什么 | 插件现算 | 在 |
| **手记** | 别的肥鱼手写的几句话 | **你或别的鱼**，插件只读 | 在 |
| **日记** | 某天发生了什么 | 固化流程写的 | **不一定**，见下 |

日记什么时候进注入，是这里唯一有讲究的地方：

```
新会话第一轮     整段灌一次（上下文是空的，只有这些能告诉它「我们上次在干什么」）
上下文被压缩后   再灌一次（聊天记录被揉成摘要了，这几条还在）
其余轮次         不灌 —— 它已经进了历史，看得见
```

想找更早的事，它自己调 `feiyu_recall`。**插件不替它决定该想起什么。**

## 删掉的三样，以及为什么

| 删掉的 | 原来的样子 | 为什么删 |
|---|---|---|
| **印象**（traits） | 「讨厌铺垫 —— 我铺垫了三段，他说'说重点'」 | 从几段对话里提炼出「他是什么样的人」。**那是判断，不是记录。** |
| **口头禅**（lexicon） | 「我最近常说的：白饭、摸鱼」 | 从几句话里提炼出「我的口头禅」。同上。 |
| **判断**（notes + `feiyu_note` 工具） | 「别人给的数据跟出处对不上时，先问，别照抄」 | 58 条里大半是「我该怎么干」。**那是纪律，不是日子。** |

**理由只有一句：日记不存在意义，它本身就是记录。意义交给上下文和读它的模型。**

数据一个字没删 —— 老档案里的 traits、lexicon、note 条目都还在文件里，只是不再产出、不再渲染。

## 三条设计原则
````

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:939-963](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L939-L963)

自动注入实际排除note，近期按更新排序。

<details>
<summary>查看原文（25行）</summary>

```text
      // ── 判断（`kind: "note"`）**2026-10-27 整栏下线** ──
      //
      // 原来这里把 note 条目分成两截：最近几条渲染成「我自己想的」，
      // 更早的丢进召回池。整栏和小工具 `feiyu_note` 都不要了，理由见
      // persona.mjs 里那段注释（四条全是「我该怎么干」，没有一条「他是什么人」）。
      //
      // 数据不动：档案里那 58 条 `kind: "note"` 留着，历史就是历史。
      // 但它们**也不进召回池** —— 让「规矩」从别的栏目溜回来，等于没删干净。
      const safeEntry = (e) => {
        const r = scrub(e.text, { thirdParty: false });
        return r.blocked ? { ...e, text: r.text } : e;
      };
      const events = archive.diary.map(safeEntry)
      .filter((e) => e?.kind !== 'note')
      // 续写过的条目 created_at 没动，但它是"刚写过的" —— 排序得看 updated_at，
      // 否则刚补完的那条会按原始时间沉下去。
      .sort((a, b) => (a.updated_at ?? a.created_at) - (b.updated_at ?? b.created_at));

      // 「最近的事」—— 按时间取最近的几条，不走相似度。
      // 这是让注入区读起来像日记而不是像检索结果的关键：
      // 最近发生的事本来就在脑子里，不需要被"想起来"。
      //
      // 取的是 **events**，不是整个日记 —— 判断（`kind: "note"`）那一栏已经下线，不渲染。
      const recentCount = Number.isFinite(config.recentEntries) ? config.recentEntries : 8;
      const recent = recentCount > 0 ? events.slice(-recentCount) : [];
```

</details>

#### 缺口

- 缺陪伴体验、误归因和持续相关性对照。
  **影响**：无法把叙事自然感当已证用户价值或准确记忆。
  **进一步探讨**：无敏感匿名故事比较手工日记/插件，核来源归属、误记与持续偏好。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事件到摘要、注入和主动召回怎样工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

真人user消息进入每session状态并保留原文，压缩事件标记重灌近期。turn-stopping路径把判断/固化移到异步队列；judge按最近用户文本决定是否记，失败按默认记；固化清洗转录后调用配置/默认模型，写事件或续写旧事件，再补缺失summary。摘要回填是另一次模型流程，不是本地词法自动生成。

自动注入取人格/关系/只读手记、近期和旧事；本地索引以summary为主、无summary退正文。近期从旧事池排除，闲聊/工作样式门只影响自动旧事提示，不限制主动工具。feiyu_recall优先让额外模型读摘要索引挑ID，时间识别先缩窗口，窗口空退全量，候选最多最近400条；请求/格式失败退词法，合法空ids不强凑。主会话主要看到选中正文，索引不进主会话不等索引不发模型。

README说近期只在首轮/压缩后灌；实际pinRecent控制免预算段。pin=false时persona.render仍把recent加入普通预算池，因此普通轮次有空间时仍可能重复呈现，不能承诺其余轮次不灌。首轮/压缩后还额外给pinnedRecent预算容差，3000配置不是所有注入/调用的严格总上限。

召回过滤、随机/衰减和模型挑选解决候选选择，不保证回忆事实或模型认识主体一致。是否更自然、更省上下文只能用同故事对照。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:1128-1151](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1128-L1151)

真人来源过滤与原文暂存。

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

**依据 2 · 源码核查**：[src/host/index.mjs:1161-1167](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1161-L1167)

压缩后重灌状态。

```text
      // `compaction/summary`，而 `session/event` 是每次写盘后的事后通知 ——
      // 从这里看得到。详见 persona.mjs 里 pinRecent 那段注释。
      if (typeof event?.type === 'string' && event.type.startsWith('compaction/')) {
        s.needsRecentReplay = true;
        s.renderCache = { turn: -1, text: '' };
        log(`会话 ${id} 的上下文被压缩了（${event.type}），下一轮重灌最近的事`);
        return;
```

**依据 3 · 源码核查**：[src/host/index.mjs:1288-1338](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1288-L1338)

判断路由/输入与失败默认记。

<details>
<summary>查看原文（51行）</summary>

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
        if (chunk?.type === 'text-delta' && typeof chunk.text === 'string') raw += chunk.text;
      }
      const v = parseVerdict(raw);
      log(`判断：${v.keep ? '记' : '不记'}${v.why ? ` —— ${v.why}` : ''}`);
      return v;
    } catch (err) {
      warn(`判断失败，按默认记：${err instanceof Error ? err.message : String(err)}`);
      return { keep: true, why: '判断失败，按默认记' };
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:1450-1503](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1450-L1503)

转录清洗、近期日记与固化请求。

<details>
<summary>查看原文（54行）</summary>

```text
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
    // 默认从 4 调到 20（2026-10-27）。4 轮太窄：实测五分钟里写了三条同一件事。
const appendWindow = Number.isFinite(config.appendWindowTurns) ? config.appendWindowTurns : 20;
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
    });

    const messages = [{ role: 'user', content: [{ type: 'text', text: built.user }] }];
    const opts = {
      provider,
      model,
      system: built.system,
      messages,
      maxTokens: config.maxTokens,
      temperature: 0.2,
      signal: signal ?? abort.signal,
    };
```

</details>

**依据 5 · 源码核查**：[src/host/index.mjs:1598-1616](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1598-L1616)

合并/持久后异步补摘要。

<details>
<summary>查看原文（19行）</summary>

```text

    archive = applied.archive;
    if (applied.accepted && !applied.appended) {
      s.diaryCount += 1;
      // 刻意**不打日记正文** —— 调试日志也不该落盘私人内容（SPEC §6.3）
      const e = archive.diary[archive.diary.length - 1];
      log(`记下一条 ${e?.id ?? ''}（${e?.kind ?? '?'}，salience ${(e?.salience ?? 0).toFixed(2)}）`);
    } else if (applied.appended) {
      log('续写完成（没有新增条目）');
    }
    for (const n of applied.notes) log(n);

    index = buildIndex(archive.diary);
    if (typeof s.renderCache === 'object') s.renderCache = { turn: -1, text: '' };
    await persist();

    // 刚写进去的条目也还没有 summary —— 顺手补一口。
    // 不 await：补总结不该让这一轮变慢。有 running 闸，重复调不会打起来。
    void backfillSummaries();
```

</details>

**依据 6 · 源码核查**：[src/core/recall.mjs:42-57](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/core/recall.mjs#L42-L57)

索引summary优先。

<details>
<summary>查看原文（16行）</summary>

```text
export function buildIndex(entries) {
  const postings = new Map();
  const df = new Map();
  const lengths = new Map();
  const list = Array.isArray(entries) ? entries : [];

  for (const entry of list) {
    const hasSummary = typeof entry.summary === 'string' && entry.summary !== '';
    const tokens = tokenize(hasSummary ? entry.summary : (entry.text ?? ''));
    if (tokens.length === 0) continue;

    const tf = new Map();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);

    for (const [t, n] of tf) {
      let bucket = postings.get(t);
```

</details>

**依据 7 · 源码核查**：[src/host/index.mjs:982-1014](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L982-L1014)

分池与工作/闲聊门。

<details>
<summary>查看原文（33行）</summary>

```text
      const recallPool = events.filter((e) => !recentIds.has(e.id));

      // ── 两道门：问句有没有内容，以及这一轮像不像在干活 ──
      //
      // 1）「嗯」「好」「在吗」这种话，字面上一个实词都没有 —— 拿它去检索，
      //    好一点是空手而归白跑一趟，坏一点是命中一堆「他今天说了嗯」的噪声。
      //
      // 2）干活时不打扰。他正查报错、贴代码、对版本号，这时候插一句
      //    「前两天你说过……」是实打实的讨厌。**真用得着旧事时它会自己调工具。**
      //
      // 两道门都只管自动召回这一栏，**不管 `feiyu_recall` 工具**。
      //
      // 2026-10-27 加。判据偏保守：宁可判成干活（少一条旧事），
      // 也别在人家干活时插话。
      const substantial = queryHasSubstance(query);
      const working = looksLikeWork(query);
      const chatty = substantial && !working;
      if (!substantial) log(`会话 ${sessionId} 第 ${s.turn} 轮：这句话没实词，不翻记忆`);
      else if (working) log(`会话 ${sessionId} 第 ${s.turn} 轮：像在干活，不打扰`);

      const { chosen } = chatty
        ? selectMemories(recallPool, index, query, s, s.turn, {
            highSim: config.highSim,
            // 闲聊时最多给两条候选 —— **给两条，它用哪条自己定，或者一条都不用。**
            // 只给一条等于系统替它说了「你就该想起这个」。
            maxShow: Math.min(2, config.maxShowPerTurn),
            wanderChance: config.wanderChance,
            // 旧事的随机池门槛。注意下限降到 0.15 是为了跟"降门槛"一致 ——
            // 门槛降到 0.15 却在这里卡 0.25，等于白降。
            minSalience: Math.max(0.15, config.minSalience),
            now: Date.now(),
          })
        : { chosen: [] };
```

</details>

**依据 8 · 源码核查**：[src/host/index.mjs:2038-2071](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L2038-L2071)

主动召回时间窗和400候选。

<details>
<summary>查看原文（34行）</summary>

```text
  async function pickBySummary(query, limit) {
    const llmP = ctx.get('llm');
    if (llmP === undefined) return null;
    const all = archive.diary.filter((e) => typeof e.text === 'string' && e.text !== '');
    if (all.length === 0) return [];

    // ── 时间先收窄一次 ──
    //
    // 「上个月那个」「前两天我说过」—— 这种问法里一个专有名词都没有，
    // 拿去做内容检索，一个字都撞不上。而日期本来就在条目上，之前白白没用。
    //
    // 认得出时间就只在那个窗口里挑；窗口里一条都没有，就退回全量 ——
    // **绝不因为时间认错过而让她什么也找不到。**
    let narrowed = null;
    const timeHint = parseTimeHint(query, Date.now());
    if (timeHint !== null) {
      const inWindow = all.filter(
        (e) => Number.isFinite(e.created_at) && e.created_at >= timeHint.from && e.created_at <= timeHint.to,
      );
      if (inWindow.length > 0) {
        narrowed = timeHint;
        log(
          `挑往事：她问的是「${timeHint.label}」，先把 ${all.length} 条收到 ${inWindow.length} 条`,
        );
      } else {
        log(`挑往事：她问的是「${timeHint.label}」，但那个窗口里一条都没有，退回全量`);
      }
    }

    const base = narrowed === null ? all : all.filter(
      (e) => Number.isFinite(e.created_at) && e.created_at >= narrowed.from && e.created_at <= narrowed.to,
    );
    const pool = base.slice(-400);
    if (base.length > pool.length) log(`挑往事：${base.length} 条只取最近 ${pool.length} 条`);
```

</details>

**依据 9 · 源码核查**：[src/host/index.mjs:2238-2269](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L2238-L2269)

主动模型/词法/短词兜底。

<details>
<summary>查看原文（32行）</summary>

```text
            const picked = await pickBySummary(query, Math.min(limit, 3));

            let ranked;
            if (picked !== null) {
              ranked = picked
                .map((id) => ({ entry: byId.get(id), sim: 0 }))
                .filter((x) => x.entry && typeof x.entry.text === 'string');
            } else {
              // 没有 llm 服务时退回字面 —— 不能用"挑不了"当没找到
              const scores = searchScores(index, query, { limit: 200 });
              ranked = [...scores.entries()]
                .map(([id, sim]) => ({ entry: byId.get(id), sim }))
                .filter((x) => x.entry && typeof x.entry.text === 'string')
                .sort((a, b) => b.sim - a.sim)
                .slice(0, limit);
            }

            // ── 兜底：词检索查不到时，直接扫原文子串 ──
            //
            // 为什么需要：分词只出**双字** bigram（`tokenize('他让我')` 是
            // `['他让','让我']`，不含单字）。所以「他」「园」这种单字查询
            // 在倒排索引里永远为空 —— 但它明明是想找的东西。
            //
            // 181 条 × 两百字，扫一遍是毫秒级，而且**只在没结果时才走**，
            // 有结果就不兜，排序不受影响。
            if (picked === null && ranked.length === 0 && query.length <= 4) {
              const needle = query.toLowerCase();
              ranked = archive.diary
                .filter((e) => typeof e.text === 'string' && e.text.toLowerCase().includes(needle))
                .slice(-limit)
                .reverse()
                .map((entry) => ({ entry, sim: 0 }));
```

</details>

**依据 10 · 源码核查**：[src/core/persona.mjs:109-115](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/core/persona.mjs#L109-L115)

非pin仍将recent加入预算池。

```text
  // 那两次由宿主在 `pinRecent: true` 里给，**这 8 条不占 3000 的预算，整段挂外面** ——
  // 因为它一进来就是"补上下文"，不是"常年陪跑"。
  const pinnedRecent = input.pinRecent === true ? renderRecent(input.recent, input.recalled, now) : '';
  if (pinnedRecent === '') {
    const recent = renderRecent(input.recent, input.recalled, now);
    if (recent) parts.push({ key: 'recent', text: recent, weight: 80 });
  }
```

**依据 11 · 源码核查**：[src/core/persona.mjs:275-302](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/core/persona.mjs#L275-L302)

预算容差额外计pinnedRecent。

<details>
<summary>查看原文（28行）</summary>

```text
  // 帧本身的开销（含分隔符、不参与预算的声明、以及那句指针）。
  // **`pinnedRecent` 故意不算进来**：它那一段是免预算的，见上面 push 那段注释。
  let bodyBudget = Math.max(
    0,
    budget - estimateTokens(`${OPEN_TAG}\n\n${IDENTITY_DECLARATION}\n\n\n\n${tail}${CLOSE_TAG}`),
  );
  // 免预算那一段自己有大小，收敛判断的容差要把它加回去
  const allowance = budget + estimateTokens(pinnedRecent);
  let result = assemble(bodyBudget);
  let text = build(result.kept);

  // 量到真的不超为止（最多几轮，必然收敛）
  for (let guard = 0; guard < 6 && text !== ''; guard++) {
    const total = estimateTokens(text);
    if (total <= allowance) break;
    bodyBudget -= total - allowance + 2;
    if (bodyBudget <= 0) {
      // 预算装不下正文了，但免预算那段和指针还得在 —— 它们不是"正文"
      result = { kept: [], dropped: parts.map((p) => p.key), trimmed: result.trimmed };
      text = build([]);
      break;
    }
    result = assemble(bodyBudget);
    text = build(result.kept);
  }

  if (text === '') return { text: '', tokens: 0, dropped: result.dropped, trimmed: result.trimmed };
  return { text, tokens: estimateTokens(text), dropped: result.dropped, trimmed: result.trimmed };
```

</details>

#### 缺口

- 普通轮次近期重复呈现、400候选遗漏及模型挑选质量未实测。
  **影响**：不能承诺只两次注入、历史全量可找或净省token。
  **进一步探讨**：固定多轮/压缩与超过400条故事，比较注入正文、召回与调用成本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 全部模型出站和旧条目隔离是否可靠？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能称全部已清洗或全程离线。固化transcript先scrub，applyConsolidation又清洗输出；主注入和工具返回正文有历史清洗，这些实际防护应承认。但judge直接把lastUserText与只读手记交buildJudgeInput，后者只trim，原文成为额外LLM输入。

新版还多了摘要回填与挑往事：buildSummaryInput直接拼日记正文，host把它送模型；picker把summary/正文前缀和query拼成额外请求，返回正文scrub发生在挑选之后。手改/导入/旧档案不应假定已被统一清洗。因此“索引不进鱼的视野”只描述主会话呈现；路由远程时仍可能披露给对应模型。本轮未发送秘密，不称已发生泄露，也不把有限规则当覆盖所有凭据形态。

旧note在自动注入明确排除，但picker.all和工具byId/子串兜底从整个archive.diary取，返回也无kind过滤。历史note可能经主动召回回来，不能承诺旧判断栏目已在所有路径彻底隔离；是否实际命中要用遗留档案验证。

面板forget经JSON/同源读取，export也检查同源；state GET不在该同源门。isSameOrigin允许缺两类头，同源/Fetch Metadata不是用户认证。面板依宿主部署访问控制，不能用本地存储、不设CORS或这些检查推出身份隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:1450-1458](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1450-L1458)

固化清洗但近期日记另拼。

```text
    const scrubOpts = {
      thirdParty: config.thirdPartyRedaction !== false,
      amountThreshold: config.amountThreshold,
    };
    const scrubbed = scrub(transcript, scrubOpts);

    const recentDiary = archive.diary
      .slice(-5)
      .map((e) => `- ${e.text}`)
```

**依据 2 · 源码核查**：[src/core/consolidate.mjs:437-453](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/core/consolidate.mjs#L437-L453)

输出清洗。

<details>
<summary>查看原文（17行）</summary>

```text
function scrubParsed(parsed, options) {
  if (parsed === null || typeof parsed !== 'object') return parsed;
  const opts = {
    thirdParty: options.thirdPartyRedaction !== false,
    amountThreshold: options.amountThreshold,
  };
  const wash = (v) => (typeof v === 'string' ? scrub(v, opts).text : v);

  const out = { ...parsed };

  if (out.diary !== null && typeof out.diary === 'object') {
    const d = { ...out.diary };
    if (typeof d.text === 'string') d.text = wash(d.text);
    if (typeof d.append === 'string') d.append = wash(d.append);
    if (Array.isArray(d.tags)) d.tags = d.tags.map(wash);
    out.diary = d;
  }
```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:1288-1319](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1288-L1319)

judge原文/手记请求。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/core/judge.mjs:101-115](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/core/judge.mjs#L101-L115)

judge构建未scrub。

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

**依据 5 · 源码核查**：[src/core/consolidate.mjs:151-155](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/core/consolidate.mjs#L151-L155)

摘要请求直接用日记正文。

```text
export function buildSummaryInput(entries = []) {
  const lines = (Array.isArray(entries) ? entries : [])
    .filter((e) => e && typeof e.id === 'string' && typeof e.text === 'string')
    .map((e) => `${e.id}\n${e.text}`);
  return { system: SUMMARY_SYSTEM, user: lines.join('\n\n') };
```

**依据 6 · 源码核查**：[src/host/index.mjs:552-567](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L552-L567)

回填请求实际出站。

<details>
<summary>查看原文（16行）</summary>

```text
        const built = buildSummaryInput(todo);
        let text = '';
        try {
          for await (const chunk of llmP.stream({
            provider,
            model,
            system: built.system,
            messages: [{ role: 'user', content: [{ type: 'text', text: built.user }] }],
            maxTokens: 600,
            temperature: 0,
            // 空字符串是非法档位 —— 实测会让 stream 直接不返回。
            // 跟固化那边保持一致：只有配置里真有值才传。
            ...(typeof config.reasoningEffort === 'string' && config.reasoningEffort.trim() !== ''
              ? { reasoningEffort: config.reasoningEffort.trim() }
              : {}),
          })) {
```

</details>

**依据 7 · 源码核查**：[src/host/index.mjs:2079-2085](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L2079-L2085)

索引原始summary或正文前缀。

```text
    const lines = pool.map((e) => {
      const idx =
        typeof e.summary === 'string' && e.summary !== ''
          ? e.summary
          : String(e.text).replace(/\s+/g, ' ').slice(0, 30);
      return `${e.id} ${dayLabel(e.created_at)} ${idx}`;
    });
```

**依据 8 · 源码核查**：[src/host/index.mjs:2115-2124](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L2115-L2124)

picker索引/query额外模型输入。

<details>
<summary>查看原文（10行）</summary>

```text
        messages: [
          { role: 'user', content: [{ type: 'text', text: `索引：\n${lines.join('\n')}\n\n她问：${query}` }] },
        ],
        maxTokens: 200,
        temperature: 0,
        // 同上：空字符串是非法档位，stream 会不返回
        ...(typeof config.reasoningEffort === 'string' && config.reasoningEffort.trim() !== ''
          ? { reasoningEffort: config.reasoningEffort.trim() }
          : {}),
      })) {
```

</details>

**依据 9 · 源码核查**：[src/host/index.mjs:2226-2269](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L2226-L2269)

主动召回全档案映射/兜底无kind过滤。

<details>
<summary>查看原文（44行）</summary>

```text
            const byId = new Map(archive.diary.map((e) => [e.id, e]));

            // ── 挑：交给模型读 summary，不按键面 ──
            //
            // 为什么不是 BM25：她那次摔跤就是"他换个说法我就搜不到"。
            // 字面匹配救不了同义改写；而 summary 是写给"意思"的，模型能读意思。
            //
            // 为什么 summary 不进她的上下文：她只看到挑出来的正文。
            // 检索那一步她看不见 —— 这就是"潜意识"。
            //
            // 代价：每次调工具多一次模型请求。只有她判断"这是往事"时才会发生，
            // 平时是零。
            const picked = await pickBySummary(query, Math.min(limit, 3));

            let ranked;
            if (picked !== null) {
              ranked = picked
                .map((id) => ({ entry: byId.get(id), sim: 0 }))
                .filter((x) => x.entry && typeof x.entry.text === 'string');
            } else {
              // 没有 llm 服务时退回字面 —— 不能用"挑不了"当没找到
              const scores = searchScores(index, query, { limit: 200 });
              ranked = [...scores.entries()]
                .map(([id, sim]) => ({ entry: byId.get(id), sim }))
                .filter((x) => x.entry && typeof x.entry.text === 'string')
                .sort((a, b) => b.sim - a.sim)
                .slice(0, limit);
            }

            // ── 兜底：词检索查不到时，直接扫原文子串 ──
            //
            // 为什么需要：分词只出**双字** bigram（`tokenize('他让我')` 是
            // `['他让','让我']`，不含单字）。所以「他」「园」这种单字查询
            // 在倒排索引里永远为空 —— 但它明明是想找的东西。
            //
            // 181 条 × 两百字，扫一遍是毫秒级，而且**只在没结果时才走**，
            // 有结果就不兜，排序不受影响。
            if (picked === null && ranked.length === 0 && query.length <= 4) {
              const needle = query.toLowerCase();
              ranked = archive.diary
                .filter((e) => typeof e.text === 'string' && e.text.toLowerCase().includes(needle))
                .slice(-limit)
                .reverse()
                .map((entry) => ({ entry, sim: 0 }));
```

</details>

**依据 10 · 源码核查**：[src/host/index.mjs:2288-2295](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L2288-L2295)

返回正文清洗在检索后。

```text
            for (const { entry } of ranked) {
              // 跟注入走同一个隐私闸 —— 历史条目里可能还有没洗过的东西
              const body = stripTimeWords(scrub(entry.text, { thirdParty: false }).text);
              const when = softWhen(entry.created_at, now);
              const line = when === '' ? body : `${when}：${body}`;
              if (used + line.length > MAX_CHARS && lines.length > 0) break;
              lines.push(`- ${line}`);
              used += line.length;
```

**依据 11 · 源码核查**：[src/host/index.mjs:1825-1838](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1825-L1838)

缺头允许的同源判断。

<details>
<summary>查看原文（14行）</summary>

```text
  function isSameOrigin(req) {
    const site = String(req.headers?.['sec-fetch-site'] ?? '').toLowerCase();
    if (site !== '') return site === 'same-origin';
    const origin = String(req.headers?.origin ?? '');
    const host = String(req.headers?.host ?? '');
    if (origin !== '') {
      if (host === '') return false;
      try {
        return new URL(origin).host === host;
      } catch {
        return false;
      }
    }
    return true;
```

</details>

**依据 12 · 源码核查**：[src/host/index.mjs:1868-1884](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1868-L1884)

JSON/同源写请求体边界。

<details>
<summary>查看原文（17行）</summary>

```text
   * 顺带把 Origin 也验一遍（双保险）。
   */
  async function readPanelBody(req) {
    const ct = String(req.headers?.['content-type'] ?? '').toLowerCase();
    if (!ct.startsWith('application/json')) {
      logPanelReject('写请求', req, 'content-type 不是 json');
      throw new Error('只接受 application/json');
    }
    if (!isSameOrigin(req)) {
      logPanelReject('写请求', req, '来源判定为跨站');
      throw new Error('跨站请求不予处理');
    }
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 8192) throw new Error('请求体过大');
```

</details>

**依据 13 · 源码核查**：[src/host/index.mjs:1947-1984](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1947-L1984)

state/forget/export各自门禁。

<details>
<summary>查看原文（38行）</summary>

```text
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
            } catch (err) {
              return panelReply(res, 400, {
                ok: false,
                error: err instanceof Error ? err.message : String(err),
              });
            }
          },
        },
        {
          kind: 'exact',
          path: `${PANEL_BASE}/export`,
          handler: async (req, res) => {
            if (!isSameOrigin(req)) return panelReply(res, 403, { ok: false, error: '跨站请求不予处理' });
            if (req.method !== 'GET') return panelReply(res, 405, { ok: false, error: 'method' });
            try {
              // 等到挂起的写盘落定，导出的是**磁盘上那份**档案
              await loadPromise;
              await drainPromise;
              await writeChain;
              const bytes = packArchive(archive);
```

</details>

#### 缺口

- 未验证所有请求的敏感样本出站、遗留note召回与部署访问控制。
  **影响**：不能当敏感/多人档案，统一隐私和类型边界未闭环。
  **进一步探讨**：合成凭据与旧note覆盖judge/固化/摘要/picker/面板路径，核主会话、模型请求和文件，无真实秘密。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 忘记、导入和写失败能给出耐久回执吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

有具体恢复设计但不够保证。单条忘记先删内存、加deleted_ids墓碑、重建索引与缓存，再persist；读盘按墓碑过滤，写完清掉不在清单的月份jsonl，replace导入清loadedIds并撤碑。这些分别约束合并复活、重启读取和导入意图，可借鉴；仍是多文件顺序操作，不能推跨文件事务、备份清除或模型侧撤回。

旧版的连续失败计数缺陷仍在：persist.catch加writeFailures、检查>=3，随后正常返回，后面的then无条件清零。串行失败通常每次都从0再加，不应依赖“三次失败必面板降级”承诺；这是Promise控制流推断，未故障注入。await persist也会因catch吞错而resolve，forget返回true不等磁盘耐久提交。

还要分别看档案月份文件、可读日记、手记、导出/备份和重开读取；月份清理特意不碰手记/.bak。export等待writeChain后打包内存archive，等待结束不证明最近写盘成功，不能将注释“磁盘上那份”当文件逐字导出的契约。出现写失败先保留副本并核实际盘面，不能反复删/导入掩盖状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:1634-1651](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1634-L1651)

忘记墓碑、索引和await persist返回。

<details>
<summary>查看原文（18行）</summary>

```text
  async function forgetEntry(id) {
    await loadPromise;
    if (typeof id !== 'string' || id === '') return false;
    const before = archive.diary.length;
    archive.diary = archive.diary.filter((e) => e?.id !== id);
    if (archive.diary.length === before) return false;
    // ⚠️ **删了就得立碑。** 不立的话，落盘前的三路合并会读一遍磁盘 ——
    // 那条还在磁盘上，内存里没有，基线里可能也没有（本会话刚加的）
    // → 判成"别人刚加的" → **捞回来**。面板上的「忘掉」当场失效。
    // 详见 mergeArchives 的说明。
    const tombstones = new Set(archive.manifest.deleted_ids ?? []);
    tombstones.add(id);
    archive.manifest.deleted_ids = [...tombstones];
    // 索引是纯派生的，必须跟着重建 —— 否则"忘掉"的条目还能被召回
    index = buildIndex(archive.diary);
    for (const s of sessionStates.values()) s.renderCache = { turn: -1, text: '' };
    await persist();
    return true;
```

</details>

**依据 2 · 源码核查**：[src/core/archive.mjs:255-263](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/core/archive.mjs#L255-L263)

读盘墓碑过滤。

```text
  const tombstones = new Set(
    Array.isArray(manifest.deleted_ids) ? manifest.deleted_ids.filter((x) => typeof x === 'string') : [],
  );
  const visible = tombstones.size > 0 ? diary.filter((e) => !tombstones.has(e.id)) : diary;
  const resurrected = diary.length - visible.length;
  if (resurrected > 0) {
    warnings.push(`按墓碑跳过 ${resurrected} 条已删除的日记（它们还躺在磁盘上）`);
  }

```

**依据 3 · 源码核查**：[src/host/index.mjs:284-309](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L284-L309)

月份清理范围与多文件写。

<details>
<summary>查看原文（26行）</summary>

```text
async function writeArchiveDir(dir, files) {
  for (const f of files) {
    await writeFileAtomic(path.join(dir, f.name), f.data);
  }

  // ── 写完再清一遍：下不在清单里的月份文件删掉 ──
  //
  // archiveToFiles 只给"有条目的月份"产出文件。于是：
  //
  //   某月最后一条被「忘掉」→ 那个月不再有清单文件 → 旧 jsonl 没人覆盖
  //   焚毁（清空所有）    → 一个月份都不产出 → 所有旧 jsonl 全留着
  //
  // 结果就是"内存 0 条，磁盘明文还在，重启读回来" —— 删除形同虚设。
  //
  // 写 = 让磁盘和内存一致。所以这里必须主动清掉多余的那个月。
  // 只清 DIARY_DIR 下的 .jsonl：日记.md（渲染版）、手记.md、.bak-* 一律不碰。
  const wanted = new Set(
    files.filter((f) => f.name.startsWith(`${DIARY_DIR}/`)).map((f) => path.basename(f.name)),
  );
  const diaryDir = path.join(dir, DIARY_DIR);
  if (!existsSync(diaryDir)) return;
  for (const name of await readdir(diaryDir)) {
    if (!name.endsWith('.jsonl')) continue;
    if (wanted.has(name)) continue;
    await rm(path.join(diaryDir, name), { force: true });
    warn(`清掉多余的月份文件：${DIARY_DIR}/${name}（已经没有条目标了）`);
```

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:1701-1726](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1701-L1726)

导入撤碑/基线重置及持久。

<details>
<summary>查看原文（26行）</summary>

```text
        // 导入是"我明确要这些东西回来"，墓碑该让位。
        // 基线也要重设：替换之后"谁删过什么"那段历史就不成立了，
        // 不重设的话导入进来的老条目会被判成"别人删了它"。
        archive = { ...incoming, manifest: { ...incoming.manifest, deleted_ids: [] } };
        // ⚠️ **基线要清空，不是设成导入的那些 id。**
        //
        // 基线的语义是「**加载时磁盘上有什么**」，合并靠它区分
        // 「别人删了」和「我刚加的」。而 replace 之后磁盘上什么都没有 ——
        // 导入的内容还在内存里，还没写下去。
        //
        // 设成导入的 id 会出事：persist() 里 mergeDiskEntries 读回一个空磁盘，
        // 每个条目都命中「基线有它、磁盘没有它 → 别人删的」——**全丢**。
        // 端到端测试（导出 → 焚毁 → 导入）就是这么红的。
        loadedIds = new Set();
      } else {
        // merge 模式：并进来的东西同样要撤碑，不然"导入一个之前删过的条目"永远fail
        const incomingIds = new Set(incoming.diary.map((e) => e.id));
        const kept = (archive.manifest.deleted_ids ?? []).filter((id) => !incomingIds.has(id));
        archive = mergeArchives(archive, incoming);
        archive = { ...archive, manifest: { ...archive.manifest, deleted_ids: kept } };
      }

      index = buildIndex(archive.diary);
      for (const s of sessionStates.values()) s.renderCache = { turn: -1, text: '' };
      await persist();
      return { warnings, diaryCount: archive.diary.length, mode };
```

</details>

**依据 5 · 源码核查**：[src/host/index.mjs:859-897](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L859-L897)

catch后then清零，失败被吞。

<details>
<summary>查看原文（39行）</summary>

```text
  let writeFailures = 0;

  function persist() {
    if (!ready) return writeChain;
    writeChain = writeChain
      .then(async () => {
        // ⚠️ 顺序要紧：**先并、再改时间戳、再写。**
        // 合并会把 archive 换成新对象，所以 snapshot 必须在合并之后取。
        await mergeDiskEntries();
        // 人格也要先问一声磁盘 —— 不然人手动改的会在这里被覆盖掉
        syncPersonaFromDisk();
        const merged = archive;
        merged.manifest.updated_at = Date.now();
        await writeArchiveDir(archiveDirectory, archiveToFiles(merged));
        await writeReadableDiary(merged);
      })
      .catch((err) => {
        // ⚠️ **连续写盘失败要让面板看得出来。**
        //
        // 原来这里只 warn 一句就吞掉，工具照样返回"记住了"。
        // 社区报告点了一句：这次这个坑是"写成功了但写错地方"，所以捕获救不了 ——
        // 但**真的写失败**的时候，用户同样只会看到「记住了」。
        //
        // 所以：连续 3 次失败就把 degraded 置真，面板上会显示"档案读不了"。
        // 一次失败可能只是临时占用，不值得惊动用户。
        writeFailures += 1;
        warn(
          `写档案失败（连续第 ${writeFailures} 次）：${err instanceof Error ? err.message : String(err)}`,
        );
        if (writeFailures >= 3 && !degraded) {
          degraded = true;
          warn('档案连续写失败 3 次，标记为降级 —— 面板上会显示出来');
        }
      })
      .then(() => {
        // 成功一次就把计数清零：一次失败不该永久挂着
        writeFailures = 0;
      });
    return writeChain;
```

</details>

**依据 6 · 源码核查**：[src/host/index.mjs:1980-1984](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1980-L1984)

export等待后packArchive内存对象。

```text
              // 等到挂起的写盘落定，导出的是**磁盘上那份**档案
              await loadPromise;
              await drainPromise;
              await writeChain;
              const bytes = packArchive(archive);
```

#### 缺口

- 未复现连续写失败、跨文件中断与忘记/导入重开。
  **影响**：不能量化丢失/复活或承诺耐久成功回执。
  **进一步探讨**：临时目录模拟只读/中断，比较工具回复、内存、jsonl、墓碑、可读日记和重启；确认失败计数。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 使用条件、步骤和成本效果如何展开？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 条件

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH systemPrompt/agents/sessions/llm | 核心必需 | 事件、提示与后台模型 | 纯JS可读不等当前宿主可加载 |
| 默认provider及配置/默认model | 模型流程必需 | judge/固化/摘要/picker | 路由异常可跳过/默认记/退词法，不能称完整成功 |
| 绝对dataDir或默认用户档案目录及写权限 | 持久必需 | 日记/索引/可读文件 | 核真实目录与磁盘，不只面板成功 |
| webServer/client | 面板可选 | 查看/忘记/导出 | headless不挂路由，访问控制仍依宿主 |
| 无敏感独立样本与备份 | 当前研究必需 | 核全部出站/历史类型/耐久 | 重要资料不迁入，外发不靠本地删除撤回 |

package4.0.2、MIT，直接导出src/host/index.mjs和src/client/index.js，无需lib构建形态；本轮未安装、加载或核发布字节，零运行时依赖不等宿主零依赖。

#### 步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 个人研究者备份独立档案、核路由/目录/面板可见范围 | 不用真实秘密/办公或多人日志 |
| 记事 | 用匿名故事跑一次判断、固化与摘要 | 分别核请求输入、日记正文/summary与来源 |
| 续接 | 新会话、普通轮次和压缩后检查注入 | 区分pinned与普通recent，别把预算当总封顶 |
| 往事 | 主动召回同义/时间/旧note及>400反例 | 核候选遗漏、返回类型与额外模型费用 |
| 忘记 | 临时目录忘记/重开、再导入明确备份 | 墓碑/文件/缓存一致；失败计数另验 |
| 停止 | 停插件并清点本地/导出/模型侧副本 | 回persona/手工日记，删除目录非全副本撤回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用/升级 | 档案、模型与旧条目摘要回填 | 审出站、legacy类型和首条故事 | 回填可能批量请求；金额/工时未测 |
| 持续使用 | judge/固化/摘要/主动picker、提示与磁盘 | 核误归因、来源、召回和重复注入 | 不是每记一条仅一次模型；pinned免预算，3000不封总成本 |
| 失败恢复 | 重试、备份/多文件恢复与额外模型 | 核计数、实际盘面/导出/重开 | catch吞失败，不能只按成功答复算成本 |
| 迁移退出 | 日记/手记/导出与备份副本 | 清理遗留类型、墓碑和路线 | 本地忘记不能撤回已外发内容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 叙事连续感 | 事件日记/近期/旧事与手记呈现 | 自然感、误归因与用户偏好 |
| 主动找往事 | 模型读summary，失败词法/短词兜底 | 相似改写准确率、400条外遗漏、总费用 |
| 隐私控制 | 固化/输出/返回清洗 | judge/回填/picker统一覆盖与敏感形态 |
| 停止/恢复 | 墓碑、月份清理与导入基线 | 写失败可见/耐久收据、全副本清理 |

作者的预算/缓存命中价格和月费用是作者声明，不是本轮测量或通用报价。按一次来源可解释且无敏感误记的续接计入所有调用/纠错/恢复，不按日记数或主会话短提示声称省钱。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-21](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/package.json#L2-L21)

实际版本、许可与直接源入口。

<details>
<summary>查看原文（20行）</summary>

```text
  "name": "feiyu-memory",
  "version": "4.0.2",
  "description": "给 DeepSeek Harness 一条会记事的蓝色大肥鱼：跨会话的持久人格与日记。每轮结束后固化模型只回答一句「你想记什么」，写下的每条日记配一句十几二十字的索引；下一场对话注入人格、手记和最近的几条，想知道更早的事它自己调 feiyu_recall，插件读索引挑出相关的那几条，正文才进上下文——索引永远不进它的视野，所以它看到的是日子，不是检索结果。遗忘是降权而不是删除。全程本地、发送前先拦掉密钥，档案是一个可读可改、能换账号带走的普通文件夹。零运行时依赖，无构建步骤。",
  "type": "module",
  "license": "MIT",
  "author": "空气凤梨 <feiyu-memory@users.noreply.github.com>",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AirPineApplea/feiyu-memory.git"
  },
  "bugs": {
    "url": "https://github.com/AirPineApplea/feiyu-memory/issues"
  },
  "homepage": "https://github.com/AirPineApplea/feiyu-memory#readme",
  "exports": {
    ".": "./src/host/index.mjs",
    "./client": "./src/client/index.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
```

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:66-72](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L66-L72)

宿主硬依赖。

```text
export const name = 'feiyu-memory';

/**
 * 硬依赖。缺任何一个，插件静默不激活 —— 这是刻意的：
 * 少一个记忆插件，不能影响用户聊天。
 */
export const inject = ['systemPrompt', 'agents', 'sessions', 'llm'];
```

**依据 3 · 源码核查**：[src/host/index.mjs:218-232](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L218-L232)

绝对路径约束/默认目录边界。

<details>
<summary>查看原文（15行）</summary>

```text
export function resolveArchiveDir(config, home = dshHome()) {
  // ⚠️ **只认绝对路径的字符串。**
  //
  // 社区报的（DSH Desktop 0.2.1-rc.2）：某些情况下 config.dataDir 会是一个
  // 被字符串化的对象 —— 字面量 "[object Object]"。
  //
  //   typeof 检查 → 它是 string，放行
  //   path.resolve("[object Object]") → 以进程 CWD 为基准
  //   桌面端的 CWD = profiles\\desktop
  //   → 档案落进 profiles\\desktop\\[object Object]\\
  //
  // 后果比崩了还糟：插件一切正常，人格注入在跑、feiyu_note 能用，
  // 只是用户改 ~/.dsh/feiyu-diary/persona.md 完全无效 —— 而且全程无报错。
  //
  // 所以：不是绝对路径就回落到默认。相对路径本来也不该出现在配置里
```

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:552-567](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L552-L567)

摘要额外模型调用。

<details>
<summary>查看原文（16行）</summary>

```text
        const built = buildSummaryInput(todo);
        let text = '';
        try {
          for await (const chunk of llmP.stream({
            provider,
            model,
            system: built.system,
            messages: [{ role: 'user', content: [{ type: 'text', text: built.user }] }],
            maxTokens: 600,
            temperature: 0,
            // 空字符串是非法档位 —— 实测会让 stream 直接不返回。
            // 跟固化那边保持一致：只有配置里真有值才传。
            ...(typeof config.reasoningEffort === 'string' && config.reasoningEffort.trim() !== ''
              ? { reasoningEffort: config.reasoningEffort.trim() }
              : {}),
          })) {
```

</details>

**依据 5 · 源码核查**：[src/host/index.mjs:2038-2071](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L2038-L2071)

主动模型候选规模限制。

<details>
<summary>查看原文（34行）</summary>

```text
  async function pickBySummary(query, limit) {
    const llmP = ctx.get('llm');
    if (llmP === undefined) return null;
    const all = archive.diary.filter((e) => typeof e.text === 'string' && e.text !== '');
    if (all.length === 0) return [];

    // ── 时间先收窄一次 ──
    //
    // 「上个月那个」「前两天我说过」—— 这种问法里一个专有名词都没有，
    // 拿去做内容检索，一个字都撞不上。而日期本来就在条目上，之前白白没用。
    //
    // 认得出时间就只在那个窗口里挑；窗口里一条都没有，就退回全量 ——
    // **绝不因为时间认错过而让她什么也找不到。**
    let narrowed = null;
    const timeHint = parseTimeHint(query, Date.now());
    if (timeHint !== null) {
      const inWindow = all.filter(
        (e) => Number.isFinite(e.created_at) && e.created_at >= timeHint.from && e.created_at <= timeHint.to,
      );
      if (inWindow.length > 0) {
        narrowed = timeHint;
        log(
          `挑往事：她问的是「${timeHint.label}」，先把 ${all.length} 条收到 ${inWindow.length} 条`,
        );
      } else {
        log(`挑往事：她问的是「${timeHint.label}」，但那个窗口里一条都没有，退回全量`);
      }
    }

    const base = narrowed === null ? all : all.filter(
      (e) => Number.isFinite(e.created_at) && e.created_at >= narrowed.from && e.created_at <= narrowed.to,
    );
    const pool = base.slice(-400);
    if (base.length > pool.length) log(`挑往事：${base.length} 条只取最近 ${pool.length} 条`);
```

</details>

**依据 6 · 源码核查**：[src/core/persona.mjs:275-302](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/core/persona.mjs#L275-L302)

预算容差不计pinned段。

<details>
<summary>查看原文（28行）</summary>

```text
  // 帧本身的开销（含分隔符、不参与预算的声明、以及那句指针）。
  // **`pinnedRecent` 故意不算进来**：它那一段是免预算的，见上面 push 那段注释。
  let bodyBudget = Math.max(
    0,
    budget - estimateTokens(`${OPEN_TAG}\n\n${IDENTITY_DECLARATION}\n\n\n\n${tail}${CLOSE_TAG}`),
  );
  // 免预算那一段自己有大小，收敛判断的容差要把它加回去
  const allowance = budget + estimateTokens(pinnedRecent);
  let result = assemble(bodyBudget);
  let text = build(result.kept);

  // 量到真的不超为止（最多几轮，必然收敛）
  for (let guard = 0; guard < 6 && text !== ''; guard++) {
    const total = estimateTokens(text);
    if (total <= allowance) break;
    bodyBudget -= total - allowance + 2;
    if (bodyBudget <= 0) {
      // 预算装不下正文了，但免预算那段和指针还得在 —— 它们不是"正文"
      result = { kept: [], dropped: parts.map((p) => p.key), trimmed: result.trimmed };
      text = build([]);
      break;
    }
    result = assemble(bodyBudget);
    text = build(result.kept);
  }

  if (text === '') return { text: '', tokens: 0, dropped: result.dropped, trimmed: result.trimmed };
  return { text, tokens: estimateTokens(text), dropped: result.dropped, trimmed: result.trimmed };
```

</details>

**依据 7 · 源码核查**：[src/host/index.mjs:1940-1946](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1940-L1946)

Web服务可选挂载。

```text
   * 用 `ctx.inject` 而不是 `ctx.get` —— webServer 是 web 组合才有的服务，
   * headless 里根本不存在。inject 的语义正好：服务在就注册，不在就永远不注册，
   * **不影响插件其余部分**（降级优先，SPEC §10）。
   */
  ctx.inject(['webServer'], (scope) => {
    scope.effect(() => {
      const routes = [
```

#### 缺口

- 缺同故事的自然感、归因、全调用/资源/纠错成本对照。
  **影响**：不能量化净价值或成本与年限解耦。
  **进一步探讨**：比较persona/手工日记/插件，计全部请求、注入、误记与人工恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 为何观察，哪种生产方向可证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议观察，不用于正式工作、敏感或多人档案。愿读代码的个人可用无敏感样本研究叙事体验，但先解释全部模型出站、旧note返回及实际耐久状态；若误归因、敏感输入去向不合预期、旧判断回流或面板暴露，停用并保留档案核验，不承诺删目录消除所有副本。

可借鉴近期/旧事分池、类型分层意图、模型摘要与主会话呈现分离；可生产化的方向优先是统一出站/类型过滤与可确认来源，而非更多叙事栏目。所有judge、固化、回填、picker都过同一敏感门并记录阻断/脱敏收据，主会话与主动工具统一类型/确认规则，记忆带事实/推断和来源，写入返回明确待持久/已确认状态。

以当前4.0.2与手工日记为基线，用合成凭据、遗留note、导入未洗正文、>400条、普通轮次/压缩和连续写失败样本比较未脱敏出站、错误召回、耐久误信、自然感及总成本。若任何未经预期过滤的额外出站仍存在，或确认/过滤损失自然感且不减错误与恢复时间，则否定优势。这是待验证方向，不是现有隐私/事实保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:1288-1319](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L1288-L1319)

统一出站门对应judge原文。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/core/consolidate.mjs:151-155](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/core/consolidate.mjs#L151-L155)

回填原文入口。

```text
export function buildSummaryInput(entries = []) {
  const lines = (Array.isArray(entries) ? entries : [])
    .filter((e) => e && typeof e.id === 'string' && typeof e.text === 'string')
    .map((e) => `${e.id}\n${e.text}`);
  return { system: SUMMARY_SYSTEM, user: lines.join('\n\n') };
```

**依据 3 · 源码核查**：[src/host/index.mjs:2038-2042](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L2038-L2042)

主动召回全类型候选。

```text
  async function pickBySummary(query, limit) {
    const llmP = ctx.get('llm');
    if (llmP === undefined) return null;
    const all = archive.diary.filter((e) => typeof e.text === 'string' && e.text !== '');
    if (all.length === 0) return [];
```

**依据 4 · 源码核查**：[src/host/index.mjs:859-897](https://github.com/AirPineApplea/feiyu-memory/blob/df441be7771f91bbeafe9beb14ffc8f3ff5d6701/src/host/index.mjs#L859-L897)

耐久状态方向对应当前吞错/计数。

<details>
<summary>查看原文（39行）</summary>

```text
  let writeFailures = 0;

  function persist() {
    if (!ready) return writeChain;
    writeChain = writeChain
      .then(async () => {
        // ⚠️ 顺序要紧：**先并、再改时间戳、再写。**
        // 合并会把 archive 换成新对象，所以 snapshot 必须在合并之后取。
        await mergeDiskEntries();
        // 人格也要先问一声磁盘 —— 不然人手动改的会在这里被覆盖掉
        syncPersonaFromDisk();
        const merged = archive;
        merged.manifest.updated_at = Date.now();
        await writeArchiveDir(archiveDirectory, archiveToFiles(merged));
        await writeReadableDiary(merged);
      })
      .catch((err) => {
        // ⚠️ **连续写盘失败要让面板看得出来。**
        //
        // 原来这里只 warn 一句就吞掉，工具照样返回"记住了"。
        // 社区报告点了一句：这次这个坑是"写成功了但写错地方"，所以捕获救不了 ——
        // 但**真的写失败**的时候，用户同样只会看到「记住了」。
        //
        // 所以：连续 3 次失败就把 degraded 置真，面板上会显示"档案读不了"。
        // 一次失败可能只是临时占用，不值得惊动用户。
        writeFailures += 1;
        warn(
          `写档案失败（连续第 ${writeFailures} 次）：${err instanceof Error ? err.message : String(err)}`,
        );
        if (writeFailures >= 3 && !degraded) {
          degraded = true;
          warn('档案连续写失败 3 次，标记为降级 —— 面板上会显示出来');
        }
      })
      .then(() => {
        // 成功一次就把计数清零：一次失败不该永久挂着
        writeFailures = 0;
      });
    return writeChain;
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
