# feiyu-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[38b2d42](https://github.com/AirPineApplea/feiyu-memory/tree/38b2d42b5026d557bf69bb711d951055858b54e9)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AirPineApplea/feiyu-memory)
<!-- END META -->

> **实现功能**：为Harness保存人格内核、判断和情景日记，并在后续会话按相关性召回记忆。

> **核心亮点**：将人格、主观判断与事件日记分层，并把近期常驻与旧事召回分池，以本地索引控制持续记忆注入；增量在叙事与可管理流程，不是事实真值或隐私保证。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：多处清洗仍未覆盖judge额外模型出站，面板同源门也不等身份认证；persist失败计数在catch后被无条件清零，不能据“三次降级”承诺判断落盘可靠。[Q03](#research-q03)、[Q07](#research-q07)

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
  - [Q07 · 删除与写失败可见性是否保证档案可恢复且不会复活？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向接受个人陪伴式记忆、愿意人工检查本地日记的低敏感娱乐用户；交付应区分人格规则、自发判断与事件转述，不将模型推断当作用户事实或生产知识库。

长上下文与手写persona是直接替代，少自动固化但更易控制写入。比较同一组个人事件的归因、召回、额外模型费和纠错工时，娱乐熟悉感不能代替工作知识准确性。

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
| DSH systemPrompt/agents/sessions/llm | 核心必需 | 事件收集、固化和注入 | 降级不等完整记忆 |
| 当前模型路由 | judge/固化必需 | 额外模型请求 | 可能外发原文，先核许可 |
| 可写绝对档案目录 | 耐久必需 | 人格、关系与月日记 | 缺失回home默认，须核实际路径 |
| 可信宿主访问控制 | 面板前提 | 读取/忘记/导出 | 同源检查不替代认证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 隔离 | 用户只用娱乐无秘密样本 | 固定路由、目录并备份 |
| 核首条 | 用户对照三声部与实际文件 | 推断不当用户事实 |
| 复用 | 新会话核近期与旧事召回 | 来源正确且额外调用可接受 |
| 忘记 | 用户删测试条目后重启 | 读盘和墓碑一致，核其他副本 |
| 恢复 | 用户核文件而非只看面板 | 写错/外发/错归因即停用 |

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

> **思考**：多处清洗仍未覆盖judge额外模型出站，面板同源门也不等身份认证；persist失败计数在catch后被无条件清零，不能据“三次降级”承诺判断落盘可靠。[Q03](#research-q03)、[Q07](#research-q07)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将人格、主观判断与事件日记分层，并把近期常驻与旧事召回分池，以本地索引控制持续记忆注入；增量在叙事与可管理流程，不是事实真值或隐私保证。[Q01](#research-q01)、[Q02](#research-q02)

将人格、主观判断与事件日记分层，并把近期常驻与旧事召回分池，以本地索引控制持续记忆注入；增量在叙事与可管理流程，不是事实真值或隐私保证。[Q01](#research-q01)、[Q02](#research-q02)

可借鉴近期/旧事分池、墓碑读盘和月份文件清理的对应关系；持久化仍需耐久收据，失败计数和跨文件中断要单独核验。[Q07](#research-q07)

<a id="detail-section-5"></a>

### 1.4 主要限制

多处清洗仍未覆盖judge额外模型出站，面板同源门也不等身份认证；persist失败计数在catch后被无条件清零，不能据“三次降级”承诺判断落盘可靠。[Q03](#research-q03)、[Q07](#research-q07)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，不用于正式工作、多人或敏感会话。仅愿审代码与日记的个人可在无秘密样本中评估，先核judge路由及出站；错归因、敏感召回或面板暴露即停用，删除目录不等于撤回模型数据。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

叙事记忆与召回链可核；静态识别judge隐私门缺口，未实际发送秘密或运行宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/index.mjs、src/core/privacy.mjs、src/core/judge.mjs、src/core/recall.mjs、src/core/archive.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定host关键配置、事件/出站、召回、持久化、面板，以及privacy/archive/recall/judge；不执行目标、不发秘密、不穷尽客户端和全部模型输出。
- 下一步：按 [Q05](#research-q05) 对judge/固化/手记/历史注入追踪合成凭据；按 [Q07](#research-q07) 注入连续写失败和第N文件中断，核原文、持久化、面板与重启。全部为待执行方案。

**分析版本**

- **仓库**：[AirPineApplea/feiyu-memory](https://github.com/AirPineApplea/feiyu-memory)
- **版本号**：0.3.4（[固定提交 38b2d42](https://github.com/AirPineApplea/feiyu-memory/tree/38b2d42b5026d557bf69bb711d951055858b54e9)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把隐私策略放到所有模型出站共用门，并以来源/事实-推断/敏感级/确认状态控制召回，面板走宿主认证。用合成凭据追踪judge、固化、手记与日志，任何未脱敏出站或确认前误召回即否定；假设未验证，可能降低自然感并增复核。参见[Q05](#research-q05)。

按 [Q05](#research-q05) 对judge/固化/手记/历史注入追踪合成凭据；按 [Q07](#research-q07) 注入连续写失败和第N文件中断，核原文、持久化、面板与重启。全部为待执行方案。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 3013 | — | — | 36229 |
| .js | source | 1 | 446 | 347 | 66 | — |
| .mjs | source | 23 | 6874 | 3909 | 2430 | — |
| .mjs | test | 19 | 4850 | 3853 | 467 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

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

**依据 1 · 作者声明**：[README.md:14-28](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/README.md#L14-L28)

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

**依据 2 · 作者声明**：[README.md:73-93](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/README.md#L73-L93)

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

配置入口尝试从插件、profile、DSH安装与home位置加载schemastery，失败提供带validate的纯JS schema；dataDir仅接受绝对路径，避免以不可预期cwd落档，并在启动日志输出真实目录。召回先取最近事件，再把这些ID排出旧事候选池，避免高词面相似的近期条目占据又被渲染去重。机制可核，未在当前宿主安装验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:866-889](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L866-L889)

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

**依据 2 · 源码核查**：[src/host/index.mjs:1011-1051](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L1011-L1051)

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

**依据 3 · 源码核查**：[src/host/index.mjs:1148-1202](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L1148-L1202)

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

**依据 4 · 源码核查**：[src/core/recall.mjs:27-59](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/core/recall.mjs#L27-L59)

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

**依据 5 · 源码核查**：[src/host/index.mjs:179-196](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L179-L196)

Config提供可调用且validate的fallback。

<details>
<summary>查看原文（18行）</summary>

```text
 */
export const Config = (() => {
  const z = loadSchemastery();
  if (z !== undefined) return buildSchema(z);

  // ⚠️ **拿不到 schemastery 时不能返回 undefined。**
  //
  // 原来这里直接吞掉并导出 undefined，注释里写着「loader 会跳过校验」。
  // **那条假设是错的** —— 社区报告实测：没有 Config 时 DSH 会传一份**空模板**
  // （每个字段都是 `{}`），于是 `resolveConfig` 全部回落默认，
  // **用户改的任何配置都不生效**。铁证是：`cordis.patch.yml` 里显式写
  // `config: { debugLog: true }`，传进来还是 `{}` —— 那不是插件没读，是 DSH 没传。
  //
  // 所以这里兜一个**纯 JS 的形状等价物**。它只需要满足 loader 对 Config 的
  // 两个用法：`Config(dict)` 做校验/补默认，以及 `Config.toString()` / `.dict`
  // 之类的展示。没有 schemastery 的链式 API，就手写一个最小的。
  return buildPlainSchema();
})();
```

</details>

**依据 6 · 源码核查**：[src/host/index.mjs:216-232](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L216-L232)

仅接受绝对路径dataDir，否则回默认。

<details>
<summary>查看原文（17行）</summary>

```text
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
  // （基准是进程 CWD，用户不可能预测它是什么）。
  const raw = config?.dataDir;
  const explicit = typeof raw === 'string' && path.isAbsolute(raw.trim()) ? raw.trim() : '';
```

</details>

**依据 7 · 源码核查**：[src/host/index.mjs:734-768](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L734-L768)

近期常驻事件与旧事召回池分开。

<details>
<summary>查看原文（35行）</summary>

```text
      // 「最近的事」—— 按时间取最近的几条，不走相似度。
      // 这是让注入区读起来像日记而不是像检索结果的关键：
      // 最近发生的事本来就在脑子里，不需要被"想起来"。
      //
      // 取的是 **events**，不是整个日记 —— 判断归「我自己想的」管。
      const recentCount = Number.isFinite(config.recentEntries) ? config.recentEntries : 8;
      const recent = recentCount > 0 ? events.slice(-recentCount) : [];
      const recentIds = new Set(recent.map((e) => e.id));

      // ⚠️ **召回池里不能有「最近的事」那几条。**
      //
      // 实测抓到的坑：它们已经常驻了，却又混进召回池一起竞争 ——
      // 而"最近"天然含着你刚说过的话，字面命中率最高，于是**永远赢**。
      //
      // 具体表现：他问「赛博朋克让你想到什么」，召回选中了
      // 「他连着测了三句：赛博朋克、随心所欲、手机号……」—— 那是我自己写的
      // 测试记录，含所有测试词所以分最高；真正的赛博朋克日记永远出不来。
      // 而且那条已经在「最近的事」里，渲染时会被去重跳过，
      // 连「突然想起来」都不显示 —— 召回了，等于没召回。
      //
      // 排除之后：同一句话会去挑真正的旧事（实测赛博朋克那条命中了
      // 「边缘行者2 上线，总导演从今石之洋换成五十岚海」）。
      const olderNotes = allNotes.slice(0, -MAX_NOTES);
      const recallPool = [
        ...events.filter((e) => !recentIds.has(e.id)),
        ...olderNotes,
      ];

      const { chosen } = selectMemories(recallPool, index, query, s, s.turn, {
        highSim: config.highSim,
        maxShow: config.maxShowPerTurn,
        wanderChance: config.wanderChance,
        // 旧事的随机池门槛。注意下限降到 0.15 是为了跟"降门槛"一致 ——
        // 门槛降到 0.15 却在这里卡 0.25，等于白降。
        minSalience: Math.max(0.15, config.minSalience),
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使个人三声部记忆的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

consolidate在发送转录前有scrub，feiyu_note正文和tags也做规则清洗，历史事件注入另有密钥清洗兜底；这些是实际防护，不能再说只有固化一路清洗。但judge仍从lastUserText直接buildJudgeInput，后者只trim并拼手记，原文进入额外llm.stream；因此所有模型出站都已过滤的强主张仍不成立。是否远程取决于路由，本轮未发送秘密，不称已发生泄露。

面板当前对forget要求JSON及同源，对export也要求同源，应承认此边界；state GET无同源或独立认证门，Origin/Fetch Metadata不等用户认证，非浏览器调用者可设置这些头。部署仍依宿主访问控制，不能用“不设CORS”保证所有访问安全。

可借鉴本地派生索引、权限受限原子写、三声部分层与最近/旧事池分离；静态修补不证明记忆归因或体验正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/judge.mjs:101-115](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/core/judge.mjs#L101-L115)

judge输入保持原文，没有scrub。

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

**依据 2 · 源码核查**：[src/host/index.mjs:1036-1052](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L1036-L1052)

原文进入judge额外模型请求。

<details>
<summary>查看原文（17行）</summary>

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
        if (chunk?.type === 'text-delta' && typeof chunk.text === 'string') raw += chunk.text;
```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:1161-1171](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L1161-L1171)

固化转录被洗，但近期日记作为另一输入须另核。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:1523-1534](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L1523-L1534)

同源启发式不是身份认证。

<details>
<summary>查看原文（12行）</summary>

```text
  function isSameOrigin(req) {
    const site = String(req.headers?.['sec-fetch-site'] ?? '').toLowerCase();
    if (site === 'same-origin') return true;
    const origin = String(req.headers?.origin ?? '');
    const host = String(req.headers?.host ?? '');
    if (origin === '' || host === '') return false;
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
```

</details>

**依据 5 · 源码核查**：[src/host/index.mjs:1624-1654](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L1624-L1654)

state与forget/export有不同访问边界。

<details>
<summary>查看原文（31行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[src/host/index.mjs:1776-1794](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L1776-L1794)

主动记忆正文/tags先洗后截，属于已实现防护。

<details>
<summary>查看原文（19行）</summary>

```text
            const scrubbed = scrub(raw, {
              thirdParty: config.thirdPartyRedaction !== false,
              amountThreshold: config.amountThreshold,
            });
            if (scrubbed.blocked) {
              log(`主动记的那条命中了密钥规则，已替换（${scrubbed.hits.length} 处）`);
            }
            const now = Date.now();
            const tags = (Array.isArray(args?.tags) ? args.tags : [])
              .filter((t) => typeof t === 'string' && t.trim() !== '')
              .map((t) => scrub(t.trim(), { thirdParty: false }).text.slice(0, 12))
              .slice(0, 4);
            if (tags.length === 0) tags.push('手记');

            const sessionId = exec?.agent?.id;
            const entry = normalizeDiaryEntry({
              id: makeDiaryId(now, archive.diary),
              // 洗过再截 —— 先截再洗会把半截密钥留在末尾
              text: stripTimeWords(scrubbed.text.slice(0, 400)),
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

**依据 1 · 源码核查**：[src/host/index.mjs:1036-1046](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L1036-L1046)

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

**依据 2 · 源码核查**：[src/host/index.mjs:1205-1213](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L1205-L1213)

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

**依据 3 · 源码核查**：[src/core/recall.mjs:1-13](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/core/recall.mjs#L1-L13)

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

假设是统一出站门和可确认记忆。已有固化、主动手记和历史事件清洗，但仍漏judge说明隐私不能按业务函数各自约定；所有模型请求应经过同一scrub并给阻断收据。事实/推断/敏感级与来源事件绑定，仅自动召回确认的低敏感事实。合成凭据跨judge/固化/手记/日志追踪，漏出或误归因率不降就否定，需同时测确认负担与体验退步。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/privacy.mjs:160-179](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/core/privacy.mjs#L160-L179)

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

**依据 2 · 源码核查**：[src/core/judge.mjs:101-115](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/core/judge.mjs#L101-L115)

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

**依据 1 · 作者声明**：[README.md:14-28](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/README.md#L14-L28)

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

**依据 2 · 源码核查**：[src/host/index.mjs:1036-1051](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L1036-L1051)

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

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 删除与写失败可见性是否保证档案可恢复且不会复活？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

当前writeArchiveDir在写入清单后删除不再需要的月份jsonl，archiveFromFiles也应用deleted_ids墓碑，replace导入把loadedIds清空。三者分别约束物理残留、重启读取和导入合并，支持“删除后不应自动复活”的具体改善，但仍是多个文件顺序操作，非跨文件事务，手记/备份不在月份清理范围。

连续写失败提示存在可核查控制流缺陷。persist在catch中writeFailures加1并判断>=3，catch正常返回后无条件进入then把计数归0；串行链下一次失败再次从0开始，因而通常不能累计到第三次降级。成功和被catch吞掉的失败都走同一清零分支。这里是Promise控制流推断，未故障注入；不把它写成实测数据丢失，但应拒绝依赖“三次失败必在面板显现”。

采用前应分别观察工具答复、内存、实际jsonl与重启读取。备份恢复须保留墓碑和导入意图，写失败时不可把“记住了”当耐久提交收据。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:282-308](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L282-L308)

月份清单外jsonl被移除，其他文件明确不清。

<details>
<summary>查看原文（27行）</summary>

```text
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
  }
}
```

</details>

**依据 2 · 源码核查**：[src/core/archive.mjs:245-263](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/core/archive.mjs#L245-L263)

重启读取应用删除墓碑。

<details>
<summary>查看原文（19行）</summary>

```text
  //
  // 社区报的（这次比前两个严重）：焚毁 / 忘掉一条之后，内存里没了，
  // **磁盘上那份 jsonl 没被重写** —— 于是重启一读，删掉的内容全回来了。
  //
  // 为什么之前只在 mergeArchives 里过滤：那个函数是"磁盘 + 内存"的三路合并，
  // 它需要墓碑来判断"这条是我删的还是别人加的"。但**加载这一步不经过它** ——
  // 启动时直接 archiveFromFiles(entries)，磁盘上有什么就读什么。
  //
  // 所以过滤要做两处：合并时一次，**读盘时也要一次**。
  // （导入包依然是"先撤碑、再读"，见 importPack —— 那是用户明确要把东西拿回来。）
  const tombstones = new Set(
    Array.isArray(manifest.deleted_ids) ? manifest.deleted_ids.filter((x) => typeof x === 'string') : [],
  );
  const visible = tombstones.size > 0 ? diary.filter((e) => !tombstones.has(e.id)) : diary;
  const resurrected = diary.length - visible.length;
  if (resurrected > 0) {
    warnings.push(`按墓碑跳过 ${resurrected} 条已删除的日记（它们还躺在磁盘上）`);
  }

```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:630-665](https://github.com/AirPineApplea/feiyu-memory/blob/38b2d42b5026d557bf69bb711d951055858b54e9/src/host/index.mjs#L630-L665)

catch之后then无条件清零，失败计数不能正常累积。

<details>
<summary>查看原文（36行）</summary>

```text
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
```

</details>

#### 缺口

- 跨文件中断与重启恢复没有本轮故障注入。
  **影响**：不能证明任意断电时删除和导入均完整。
  **进一步探讨**：对第N个文件写/删失败、三次连续写失败及重启进行合成档案对照，观察落盘、面板和恢复收据。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
