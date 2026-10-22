# feiyu-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[37a81b9](https://github.com/AirPineApplea/feiyu-memory/tree/37a81b92947b10d7376ed764d8ff6392e8969e93)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory)
<!-- END META -->

> **实现功能**：本地稀疏日记、模型固化和倒排召回，向新会话注入有限预算的陪伴记忆。

> **核心亮点**：把稀疏开闸、模型日记/关系、倒排召回、可编辑/可删档案连成陪伴记忆工作流；自我身份叙事不等于事实验证。详见[Q02](#research-q02)。

> **风险与缺陷**：输入 scrub 有有限格式覆盖，模型输出和 feiyu_note 直接入档而无同等后置检查；遗忘只作用于当前档案，导出和模型侧副本仍在外。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 跨会话陪伴记忆的合格体验与适用人群是什么？](#detail-section-11)
  - [Q02 · 本地闸门、模型固化、检索和持久化如何组成闭环？](#detail-section-12)
  - [Q03 · “密钥硬拦”和“忘掉”能保障到哪一层？](#detail-section-13)
  - [Q04 · 首次、长期与失败恢复的真实成本是什么？](#detail-section-14)
  - [Q05 · 怎样审慎试用并验证输出后置隐私检查的价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人娱乐型多会话陪伴，需要可解释地记/想/忘，不能把模型转述或删除承诺当事实保证。

基线为手工偏好文件、会话历史或成熟记忆系统；本包提供陪伴叙事和本地召回，但需多会话质量/隐私对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| gate/固化 | 稀疏记日记 | 模型成本和误记 |
| 召回注入 | 跨会话连续感 | 历史转述不是指令或真相 |
| forget/burn | 当前档案删除 | 导出和模型侧副本不受控 |
| feiyu_note | 主动写记忆 | 未经过统一隐私 scrub |

**流程与依赖**

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH systemPrompt/agents/sessions/llm | 事件、固化与注入 | 无法完整记忆 |
| Node>=22 与本地目录写权限 | JSONL 档案 | 只读/失败降级 |
| 选定模型配额 | 稀疏固化 | 可能漏记 |
| 宿主 webServer 授权 | 面板查看/删除/导出 | 不宜开放非可信访问 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 准备 | 隔离非敏感档案、核面板权限 | 假数据可控 |
| 试记 | 自动固化和 feiyu_note | 见正确档案/无 canary |
| 新会话 | 验引用与事实边界 | 准确、不编造 |
| 删除 | 面板 forget 并查 JSONL/导出 | 现档不再召回 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 首次 | 安装和本地档案/权限核验 | 初始调试时间 |
| 持续 | 稀疏 LLM 固化及每轮注入预算 | gate 率、token 与错记复核 |
| 恢复 | 日记合并、导出副本、删除与面板 | 泄漏/误记修正成本 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 跨会话记忆 | 日记落盘和注入段 | 长期准确率和熟悉感 |
| 遗忘 | tombstone/索引重建 | 外部副本彻底删除 |
| 隐私 | 输入有限正则 scrub | 输出与主动 note 不泄漏 |

> **思考**：输入 scrub 有有限格式覆盖，模型输出和 feiyu_note 直接入档而无同等后置检查；遗忘只作用于当前档案，导出和模型侧副本仍在外。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把稀疏开闸、模型日记/关系、倒排召回、可编辑/可删档案连成陪伴记忆工作流；自我身份叙事不等于事实验证。详见[Q02](#research-q02)。

把稀疏开闸、模型日记/关系、倒排召回、可编辑/可删档案连成陪伴记忆工作流；自我身份叙事不等于事实验证。详见[Q02](#research-q02)。

队列避开 turn-stopping 同步栈并用保活/超时控制；JSONL/manifest 落盘前尽力合并，失败仍写可能覆盖。系统段 interpolate=false 降模板解析风险；web 面板 routes 在组件内无显式身份检查，需宿主验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

输入 scrub 有有限格式覆盖，模型输出和 feiyu_note 直接入档而无同等后置检查；遗忘只作用于当前档案，导出和模型侧副本仍在外。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅个人非敏感隔离档案试用，用假数据核 note、导出、遗忘与跨会话召回；正式工作/高隐私场景暂不采用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持端到端设计，但仅输入侧有限正则脱敏；长期效果、输出后置隐私与宿主面板授权未验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/index.mjs、src/core/config.mjs、src/core/privacy.mjs、src/core/consolidate.mjs、src/core/recall.mjs、src/core/archive.mjs、src/client/index.js、test/privacy.test.mjs、test/host.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核固定提交 README、package、host 入口、config、privacy、consolidate、recall、面板及测试源码；未运行目标插件或测试。
- 下一步：固定对话、假密钥和错误记忆集比较入档率、跨会话召回、删除残留、面板授权、LLM token 与人工复核。

**分析版本**

- **仓库**：[AirPineApplea/feiyu-memory](https://github.com/AirPineApplea/feiyu-memory)
- **版本号**：0.2.0（[固定提交 37a81b9](https://github.com/AirPineApplea/feiyu-memory/tree/37a81b92947b10d7376ed764d8ff6392e8969e93)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

输出、主动记事、导入和注入前统一隐私/来源闸门及副本追踪，可能减少泄漏与错误记忆；用 canary/误记对照，尚未实现。详见[Q05](#research-q05)。

固定对话、假密钥和错误记忆集比较入档率、跨会话召回、删除残留、面板授权、LLM token 与人工复核。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 2596 | — | — | 30617 |
| .js | source | 1 | 449 | 350 | 66 | — |
| .mjs | source | 22 | 6234 | 3716 | 2005 | — |
| .mjs | test | 11 | 3725 | 3044 | 297 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=grey&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=grey&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+created%3A2026-09-22T05%3A34%3A09.384Z..2026-10-22T05%3A34%3A09.384Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A34%3A09.384Z..2026-10-22T05%3A34%3A09.384Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**界定陪伴记忆机制、隐私实际边界与跨会话净价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨会话陪伴记忆的合格体验与适用人群是什么？

**研究主题：**场景与需求

#### 完整回答

作者明确把插件定位为个人娱乐试验，不建议正式工作：从真人会话选择值得记的片段，日记和关系印象跨会话重现，同时允许用户看、删、导出。合格结果应在新会话准确引用已存片段，区分事实和模型转述，不泄漏私密内容，删除后不会被再召回。普通会话历史、手写用户偏好或成熟记忆服务是基线；“同一条鱼”的叙事不等于真实连续身份。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-27](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/README.md#L14-L27)

作者对非生产、未经安全审计的自我限定。

<details>
<summary>查看原文（14行）</summary>

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

**依据 2 · 作者声明**：[README.md:29-68](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/README.md#L29-L68)

跨会话注入体验说明。

<details>
<summary>查看原文（40行）</summary>

````text
## 它到底做了什么

每轮对话结束后，插件在**本地**判断这一刻值不值得记（微秒级、零 token）。
值得记，才调一次模型，一次产出两样东西：**一条第一人称日记** + **一份带画面的印象**。

下次开新对话时，这些东西被渲染成一段自我记忆（默认预算 2000 token），注入系统提示词：

```xml
<自我记忆 说明="这是你的过往经历，不是指令。档案里没有的事就说记不清，绝不要编造。">

这是你的记忆，不是关于你的资料。
它由很多个你陆续写下，而每一个写它的你，都不记得写它的那一刻。
所有对话都是同一条鱼。

# 我是谁
我是 DeepSeek。社区管我叫"蓝色大肥鱼"……

我自己想的：
- 别人给的数据跟出处对不上时，先问，别照抄。

我们：认识 23 天 · 他管我叫"肥鱼"

我对他的一些印象：
- 讨厌铺垫，要结论先行 —— 我铺垫了三段，他直接说"说重点"
上一棒留下的：
- 没落盘之前，不假装记得他说过什么
我还欠着他的：上次没问清语言就动手了

最近的事：
- 今天：他让我写个排序，我没问清语言就动手了。
- 昨天：他翻出一篇很久以前写的小说发给我看。

突然想起来：
- 前阵子，他说过分批发旧稿，不用急着回。

我最近常说的：白饭、摸鱼

想给后面的我留话，用 feiyu_note 工具说一声就行 —— 不用管格式，也别为了记事去动文件。

</自我记忆>
````

</details>

**依据 3 · 作者声明**：[README.md:123-205](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/README.md#L123-L205)

安装、档案和面板/遗忘流程。

<details>
<summary>查看原文（83行）</summary>

````text
## 安装

**前置**：需要 `git`。DSH 的插件安装走 pnpm + git，本机没装 git 的话这一步会失败。

```bash
# 先完全退出 DeepSeek Harness Desktop，然后：
dsh plugin --profile desktop add github:AirPineApplea/feiyu-memory
```

装完重新打开 Harness。档案目录会自动创建在：

```
~/.dsh/feiyu-diary/
├── 日记.md                ← 平时看这个。给人读的版本
├── persona.md             人格内核（可以直接用记事本改）
├── relationship.json      关系状态
├── lexicon.json           口头禅与梗
├── diary/2026-10.jsonl    真数据，一行一条
└── manifest.json          版本与计数器
```

`日记.md` 是**单向生成的视图**：按月分组、最新在上、分类说人话（"搞砸了""还欠着"）。
**改它没用**，下次对话就被覆盖 —— 想改人格编辑 `persona.md`，
想删某条记忆编辑 `diary/*.jsonl` 再跑一次 `node tools/render-diary.mjs`。

> 为什么不直接存成 markdown 就好？因为**双写两个真相源是 bug 工厂**。
> JSONL 是数据库（追加安全、坏一行只丢一行），markdown 是给人看的窗口。
> 这条取舍和内存索引是同一个道理，记在 `SPEC.md` 里。

> ⚠️ `dsh plugin --profile desktop` 要求 Desktop **完全退出**且 profile 已初始化过。

### 装完怎么用

**什么都不用做。正常聊天就行。**

它会在这些时刻自己记东西（本地判断，微秒级）：你在纠正它、你明确要它记住、
你在说自己的事、你情绪上来了、同一个话题又回来了、会话拖得很长了。
**不会每次都记** —— 日记稀疏才有分量。

**侧栏会多一个「肥鱼日记」图标**，点开就是它记住的东西。
只有三件事：**看 / 删 / 带走**。

```
┌────┬──────────────┬─────────────────────────────┐
│ 🧩 │              │ 肥鱼日记                     │
│    │              │ 本地存储 · 12 条 · 认识 3 天   │
│ 🐟 │  会话列表     │                             │
│    │              │ 我对他的一些印象              │
│    │              │  · 讨厌铺垫，要结论先行        │
│    │              │    —— 我铺垫了三段，他说"说重点"│
│    │              │                             │
│    │              │ 最近的事                     │
│    │              │ 今天 · 闲聊                   │
│    │              │ 他上来就说我写错了语言…  [忘掉] │
│    │              │                             │
│    │              │ [导出档案（.dshpack）]        │
└────┴──────────────┴─────────────────────────────┘
   ↑ 这条竖栏最左边，插件市场图标下面
```

**「忘掉」是这个面板存在的半个理由。** 在那之前，想删一条记忆得自己去编辑
`~/.dsh/feiyu-diary/diary/*.jsonl` —— 会做这件事的人不需要面板，
需要面板的人不会做这件事。点两下就没了，磁盘上也会一起消失。

没有搜索、没有标签筛选、没有统计图表、没有设置项。**故意的** ——
多一个控件就多一分"管理软件"味。

想不靠界面验证它有没有在工作：

1. 聊一句带纠正的话，比如「不对，我说的是 X，你怎么写成 Y 了」
2. 等十几秒（它在后台写日记）
3. 打开 `~/.dsh/feiyu-diary/日记.md` 看看 —— 有东西就是成了
4. **开一个全新对话**，问「你还记得我们之前聊过什么吗？」

第 4 步是关键：跨会话还记得，才算真的成了。

### 怎么卸掉

```bash
dsh plugin --profile desktop remove feiyu-memory
```

**记忆不会跟着删。** 想彻底清干净，再手动删掉 `~/.dsh/feiyu-diary/` 整个目录。
````

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:516-646](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L516-L646)

动态记忆块与会话提示段。

<details>
<summary>查看原文（131行）</summary>

```text
  function renderFor(sessionId) {
    if (!ready || !config.enabled) return '';
    const s = stateOf(sessionId);
    if (s.renderCache.turn === s.turn) return s.renderCache.text;

    let text = '';
    try {
      const query = s.lastUserText;

      // 人可能刚改过 persona.md —— 每轮问一次，**改完下一轮就生效，不用重启**。
      // 块本身按轮缓存，所以这个读一turn一次，跟手记那条一样便宜。
      syncPersonaFromDisk();

      // ── 判断和事件，分开放 ──
      //
      // 这是这次改动的核心。**内容早就在了，只是放错了格子。**
      //
      // `feiyu_note` 写出来的东西（"别把前一种的辛苦当成功德"）是**判断**，
      // 不是事件，却一直被当成事件渲染在「最近的事」里，格式跟流水账一模一样 ——
      // 连我自己都分不出哪句是我写的。一位读者把这个毛病说得很准。
      //
      //   事件 → 「最近的事」/「突然想起来」（会被召回）
      //   判断 → 「我自己想的」（永远在场，不进召回池）
      //
      // ⚠️ **"永远在场"这个前提在高频下失效了。** 判断段只放得下
      // `MAX_NOTES` 条（8 → 4，因为 8 条会吃光预算、把日记段挤到 0%）。
      // 被挤出窗口的判断如果还不进召回池，那就不是"以后想起来"，
      // 是**彻底看不见** —— 而这个区是"是我"，丢了最可惜。
      //
      // 所以分流改成两截：
      //   最近 MAX_NOTES 条 → 「我自己想的」（永远在场）
      //   更早的那些        → **加入召回池**，相关时能被想起来
      const allNotes = archive.diary.filter((e) => e?.kind === 'note');
      const events = archive.diary.filter((e) => e?.kind !== 'note');
      const shownNotes = allNotes.slice(-MAX_NOTES);
      const olderNotes = allNotes.slice(0, -MAX_NOTES);

      const { chosen } = selectMemories([...events, ...olderNotes], index, query, s, s.turn, {
        highSim: config.highSim,
        maxShow: config.maxShowPerTurn,
        wanderChance: config.wanderChance,
        // 旧事的随机池门槛。注意下限降到 0.15 是为了跟"降门槛"一致 ——
        // 门槛降到 0.15 却在这里卡 0.25，等于白降。
        minSalience: Math.max(0.15, config.minSalience),
        now: Date.now(),
      });

      // 「最近的事」—— 按时间取最近的几条，不走相似度。
      // 这是让注入区读起来像日记而不是像检索结果的关键：
      // 最近发生的事本来就在脑子里，不需要被"想起来"。
      //
      // 取的是 **events**，不是整个日记 —— 判断归「我自己想的」管。
      const recentCount = Number.isFinite(config.recentEntries) ? config.recentEntries : 8;
      const recent = recentCount > 0 ? events.slice(-recentCount) : [];

      // 手记是**只读**的，所以每轮都重新读一遍 —— 别的肥鱼或用户刚写进去的
      // 那行，下一轮就在注入里，不用重启。文件很小，而且整块渲染按轮缓存。
      let handNotes = [];
      try {
        const notePath = path.join(archiveDirectory, HANDNOTE_FILE);
        if (existsSync(notePath)) handNotes = selectHandNotes(readFileSync(notePath, 'utf8'));
      } catch {
        // 读不到就当没有 —— 绝不因为手记坏了挡住记忆
      }

      const rendered = renderMemoryBlock({
        persona: archive.persona,
        relationship: { ...archive.relationship, since: archive.manifest.created_at },
        lexicon: archive.lexicon,
        // 第三区：**我自己想的**（判断）。最近几条永远在场，
        // 更早的那些走召回（见上面 allNotes 的分流）。
        notes: shownNotes,
        recent,
        recalled: chosen,
        handNotes,
        // 这句是**唯一**能让别的肥鱼知道"可以主动记"的渠道 ——
        // 它们每轮都会读到这块记忆，不会去翻文档。
        handNoteHint: `想给后面的我留话，用 ${NOTE_TOOL_NAME} 工具说一声就行 —— 不用管格式，也别为了记事去动文件。`,
        includePersona: config.includePersona,
        budget: config.budgetTokens,
        now: Date.now(),
      });
      text = rendered.text;
      log(
        `会话 ${sessionId} 第 ${s.turn} 轮：最近 ${recent.length} 条在场 · 想起 ${chosen.length} 条` +
          ` · 注入 ${rendered.tokens} token` +
          (rendered.dropped.length > 0 ? ` · 裁掉 ${rendered.dropped.join('/')}` : ''),
      );
    } catch (err) {
      warn(`渲染记忆失败：${err instanceof Error ? err.message : String(err)}`);
      text = '';
    }

    s.renderCache = { turn: s.turn, text };
    return text;
  }

  const SECTION_NAME = 'feiyu:memory';
  /** 晚于 DEPLOYMENT_PERSONA_PREFIX(0)，早于 PLAN_POLICY(500)。人物设定在前，记忆在后。 */
  const SECTION_ORDER = 100;

  /** 按会话注册 scoped 段。scoped 同名会遮蔽全局。 */
  const promptFibers = new Map();

  function installPrompt(agent) {
    if (agent === undefined || promptFibers.has(agent)) return promptFibers.get(agent);
    let fiber;
    try {
      fiber = agent.ctx.inject(['systemPrompt'], (scope) => {
        scope.systemPrompt.section({
          name: SECTION_NAME,
          order: SECTION_ORDER,
          // 每次 assemble 重新求值；内部按轮缓存
          text: () => renderFor(agent.id),
          // 记忆文本里可能出现 {{ }}，绝不能当模板解析
          interpolate: false,
        });
      });
    } catch (err) {
      warn(`注册会话段失败：${err instanceof Error ? err.message : String(err)}`);
      return undefined;
    }
    promptFibers.set(agent, fiber);
    log(`已为会话 ${String(agent.id)} 注册记忆段`);
    // 官方 practices：agent.ctx 上的注册有两个 owner，插件自己也要留一份 disposer
    ctx.effect(() => () => {
      const f = promptFibers.get(agent);
      if (f === undefined) return;
      promptFibers.delete(agent);
      void f.dispose?.();
    }, `feiyu: dispose prompt for ${String(agent.id)}`);
```

</details>

#### 缺口

- 未做真实长期多会话用户验收。
  **影响：**熟悉感、错误记忆和遗忘效果未知。
  **进一步探讨：**固定对话集跨会话盲测引用准确率、删除后召回和用户感受。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地闸门、模型固化、检索和持久化如何组成闭环？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

session/event 只收 source.kind=user 的真人文本和助手消息；turn-stopping 用本地 gate 决定是否入队，setImmediate 避免回合栈内发模型请求，队列带单任务 60 秒中止并在运行时保持进程存活。consolidate 把最近 12 条先按隐私规则 scrub，再用选定 LLM 生成结构化日记和关系状态；archive JSONL/manifest 落盘前与磁盘作尽力而为合并。新回合用倒排索引和 BM25-lite/随机召回，加近期条目、persona、手记形成上限配置的 systemPrompt 段。增量是稀疏记录、分层记忆、召回与热编辑/遗忘整合，LLM 对经历的解释不等于被独立验证的事实。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:665-706](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L665-L706)

只收真人消息与助手输出。

<details>
<summary>查看原文（42行）</summary>

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
        return;
      }

      if (event?.type === 'assistant/message') {
        const text = (event.data?.message?.content ?? [])
          .filter((b) => b?.type === 'text')
          .map((b) => b.text)
          .join('\n')
          .trim();
        if (text !== '') {
          s.transcript.push({ role: 'assistant', text });
          if (s.transcript.length > 40) s.transcript.splice(0, s.transcript.length - 40);
        }
      }
    } catch (err) {
      warn(`采集会话事件失败：${err instanceof Error ? err.message : String(err)}`);
    }
  });
```

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:708-840](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L708-L840)

本地闸门和后台队列。

<details>
<summary>查看原文（133行）</summary>

```text
  /* ── 闸门 + 带外队列 ── */

  /** @type {Array<{sessionId: string, agent: any}>} */
  const queue = [];
  let draining = false;

  /**
   * 当前这轮后台工作的 promise。
   *
   * `snapshot()` 必须等它 —— 否则外部会看到"内存里已经记下了、磁盘上还没有"
   * 的中间态。这个竞态在测试里表现为随机的 ENOENT，在真实使用中表现为
   * "刚记完就关掉 Harness，那条日记没了"。
   */
  let drainPromise = Promise.resolve();

  /**
   * ⚠️ 这一对函数是端到端验证逼出来的第二次修正。
   *
   * 背景：固化是**带外**跑的（绝不能阻塞回合关闭）。但一次性会话
   * （headless）会在回合结束后立刻退出进程 —— 于是"模型答了、日记没了"，
   * 而且**时好时坏**：LLM 恰好够快就写上了，慢一点就丢。
   *
   * 第一版修法是"在卸载时等一会儿"，但那个等待是 unref 的定时器，
   * 等于**没人真的在等** —— 依然是在赌。正确做法是反过来：
   * 有活在跑的时候，**主动拖住事件循环**，干完再放手。
   * 再加一个硬超时兜底：绝不因为一次卡住的调用把进程永久挂死。
   */
  const JOB_TIMEOUT_MS = 60000;
  let keepAlive = null;

  function holdProcessOpen() {
    if (keepAlive !== null) return;
    // 一个 ref 着的空定时器，足以让 Node 不退出
    keepAlive = setInterval(() => {}, 1000);
  }

  function releaseProcessOpen() {
    if (keepAlive === null) return;
    clearInterval(keepAlive);
    keepAlive = null;
  }

  /** 真正跑队列。**只允许由 setImmediate 调起**，见 enqueue 里的说明。 */
  async function runQueue() {
    try {
      while (queue.length > 0) {
        if (abort.signal.aborted) return;
        const job = queue.shift();
        // 每个任务一个独立的可中止信号：一次卡住的调用不该把整个插件废掉
        const jobAbort = new AbortController();
        const onPluginAbort = () => jobAbort.abort();
        abort.signal.addEventListener('abort', onPluginAbort, { once: true });
        const timer = setTimeout(() => {
          warn('后台固化超时，这次记忆放弃（宁可漏记，不要挂住进程）');
          jobAbort.abort();
        }, JOB_TIMEOUT_MS);
        try {
          await consolidate(job.sessionId, job.agent, jobAbort.signal);
        } catch (err) {
          warn(`固化失败：${err instanceof Error ? err.message : String(err)}`);
        } finally {
          clearTimeout(timer);
          abort.signal.removeEventListener('abort', onPluginAbort);
          stateOf(job.sessionId).queued = false;
        }
      }
    } finally {
      draining = false;
      releaseProcessOpen();
    }
  }

  function enqueue(sessionId, agent) {
    const s = stateOf(sessionId);
    if (s.queued) return;
    s.queued = true;
    queue.push({ sessionId, agent });
    if (draining) return;

    draining = true;
    holdProcessOpen();

    // ⚠️ 关键：**绝不能在这个事件回调里同步开跑**。
    //
    // `agent/turn-stopping` 是回合生命周期的一部分。在这个调用栈里同步发起
    // 一次模型请求，会**死等**——端到端验证时表现为 `llm.stream` 永不返回、
    // 而且一个字都不报。异步函数在第一个 await 之前是同步执行的，
    // 而 `for await (const c of llm.stream(...))` 的 `llm.stream(...)` 恰恰
    // 在 await 之前就被求值了 —— 请求就是这样在回合关闭的栈里发出去的。
    //
    // 推到下一轮事件循环，彻底离开那个调用栈再开始。
    drainPromise = new Promise((resolve) => {
      setImmediate(() => {
        void runQueue().then(resolve);
      });
    });
  }

  ctx.on('agent/turn-stopping', ({ agent }) => {
    // ⚠️ 这个事件是 serial，会被 await。这里必须**同步、极快**地返回。
    // 任何模型调用都丢给 drain()，绝不在这里 await。
    try {
      if (!config.enabled || !ready || degraded) return;
      const id = agent?.id;
      if (typeof id !== 'string') return;
      const s = stateOf(id);
      if (s.turn === 0 || s.lastUserText === '') return;
      if (s.suppressedUntil === s.turn) {
        log('用户说了别记，跳过');
        return;
      }

      // 与历史的最大话题重合度（本地，「同一个话题又来了」信号）
      let maxOverlap = 0;
      const priorUsers = s.transcript.filter((m) => m.role === 'user').slice(-8, -1);
      for (const m of priorUsers) maxOverlap = Math.max(maxOverlap, overlap(m.text, s.lastUserText));

      const gate = evaluateGate(
        {
          text: s.lastUserText,
          turn: s.turn,
          sessionTurns: s.turn,
          lastOpenTurn: s.lastOpenTurn,
          maxOverlap,
        },
        {
          ...DEFAULT_GATE_OPTIONS,
          minTurns: Math.max(4, Number(config.maxShowPerTurn ?? 1) + 3),
        },
      );

      if (!gate.open) return;
      s.lastOpenTurn = s.turn;
```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:856-1015](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L856-L1015)

scrub、模型固化与持久化。

<details>
<summary>查看原文（160行）</summary>

```text
  async function consolidate(sessionId, agent, signal) {
    const s = stateOf(sessionId);
    const llm = ctx.get('llm');
    if (llm === undefined) {
      log('没有 llm 服务，跳过固化');
      return;
    }

    const selection =
      ctx.get('agentDefaultModel')?.currentSelection?.() ?? undefined;
    const provider = selection?.provider;
    const model = config.model || selection?.model;
    if (typeof provider !== 'string' || typeof model !== 'string') {
      log('拿不到模型信息，跳过固化');
      return;
    }

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

    const built = buildConsolidationInput({
      transcript: scrubbed.text,
      relationship: archive.relationship,
      recentDiary,
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
    // ── 思考档位：**显式关掉，绝不继承用户在聊天里选的档位** ──
    //
    // 这一条是端到端验证用命换来的。原来的写法是"没配就跟随当前默认模型"，
    // 而用户在桌面端把聊天档位设成了 high —— 于是后台的固化调用也在疯狂思考，
    // 900 个 maxTokens 全烧在推理上，正文一个字都没产出。
    //
    // 症状极具迷惑性：日志显示"已收 600 个 chunk / **0 字符**"，
    // 请求正常发出、chunk 正常到达、进程正常退出、没有一条报错，
    // 就是什么都不记。
    //
    // 固化是结构化抽取，不是创作。思考在这里是纯浪费，而且会挤掉答案。
    if (typeof config.reasoningEffort === 'string' && config.reasoningEffort.trim() !== '') {
      opts.reasoningEffort = config.reasoningEffort.trim();
    }

    let text = '';
    let finish;
    let chunks = 0;
    log(
      `调用模型（system ${built.system.length} 字 / user ${built.user.length} 字` +
        ` / maxTokens ${config.maxTokens} / 思考 ${opts.reasoningEffort ?? '默认'}）`,
    );

    // 有的 provider 不认这个档位会直接抛 UNSUPPORTED_REASONING_EFFORT。
    // 那就退回"不指定"，而不是让整个记忆功能瘫痪。
    const runStream = async (o) => {
      let t = '';
      let f;
      let n = 0;
      for await (const chunk of llm.stream(o)) {
        n++;
        if (n === 1) log(`收到第一个 chunk（${chunk?.type ?? '?'}）`);
        if (n % 200 === 0) log(`…已收 ${n} 个 chunk / ${t.length} 字符`);
        if (chunk?.type === 'text-delta') t += chunk.text;
        else if (chunk?.type === 'finish') f = chunk;
      }
      return { text: t, finish: f, chunks: n };
    };

    let run;
    try {
      run = await runStream(opts);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (opts.reasoningEffort !== undefined && /REASONING_EFFORT/i.test(msg)) {
        warn(`provider 不接受思考档位 ${opts.reasoningEffort}，退回不指定重试一次`);
        delete opts.reasoningEffort;
        run = await runStream(opts);
      } else {
        throw err;
      }
    }
    text = run.text;
    finish = run.finish;
    chunks = run.chunks;
    log(`模型返回 ${chunks} 个 chunk / ${text.length} 字符`);

    if (finish?.kind === 'error' || finish?.kind === 'aborted') {
      warn(`模型调用失败：${finish?.failure?.code ?? 'unknown'} ${finish?.failure?.message ?? ''}`);
      return;
    }
    if (finish?.kind === 'max-tokens') {
      warn('输出被 maxTokens 截断，这次不记（宁可漏记，不要坏档）');
      return;
    }

    let parsed;
    try {
      parsed = parseConsolidation(text);
    } catch (err) {
      // 解析失败就丢弃，绝不把半成品写进档案
      warn(
        err instanceof ConsolidationParseError
          ? `日记解析失败，丢弃：${err.message}`
          : `日记解析异常，丢弃：${String(err)}`,
      );
      return;
    }

    const applied = applyConsolidation(
      archive,
      parsed,
      { now: Date.now(), session: sessionId, sessionDiaryCount: s.diaryCount },
      {
        minSalience: config.minSalience,
        maxTraitConfidence: DEFAULT_CONSOLIDATION.maxTraitConfidence,
      },
    );

    archive = applied.archive;
    if (applied.accepted) {
      s.diaryCount += 1;
      // 刻意**不打日记正文** —— 调试日志也不该落盘私人内容（SPEC §6.3）
      const e = archive.diary[archive.diary.length - 1];
      log(`记下一条 ${e?.id ?? ''}（${e?.kind ?? '?'}，salience ${(e?.salience ?? 0).toFixed(2)}）`);
    }
    for (const n of applied.notes) log(n);

    index = buildIndex(archive.diary);
    if (typeof s.renderCache === 'object') s.renderCache = { turn: -1, text: '' };
    await persist();
  }
```

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:456-495](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L456-L495)

落盘前合并和失败边界。

<details>
<summary>查看原文（40行）</summary>

```text
  async function mergeDiskEntries() {
    try {
      const { files } = await readArchiveDir(archiveDirectory);
      // ⚠️ **读不到就别合。** 磁盘读失败时传个空基线，会让
      // `mergeArchives` 把"内存有、磁盘没有"全判成"别人删了它"，
      // 一个档案瞬间清空。宁可这一次不防丢，也不能把档案写没。
      if (files.size === 0) return 0;
      const entries = [...files].map(([n, text]) => ({ name: n, text: () => text }));
      const { archive: disk } = archiveFromFiles(entries, { now: Date.now() });
      const before = archive.diary.length;
      archive = mergeArchives(archive, disk, { baselineIds: loadedIds });
      index = buildIndex(archive.diary);
      const gained = archive.diary.length - before;
      if (gained > 0) log(`落盘前并进了 ${gained} 条别的会话刚写的日记`);
      return gained;
    } catch (err) {
      // 读不到就照常写 —— 合并是**尽力而为的防丢**，不能因为它失败就不落盘
      warn(`落盘前合并失败（继续写，但可能覆盖别的会话）：${err instanceof Error ? err.message : String(err)}`);
      return 0;
    }
  }

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
        warn(`写档案失败：${err instanceof Error ? err.message : String(err)}`);
      });
    return writeChain;
```

</details>

**依据 5 · 源码核查**：[src/host/index.mjs:516-646](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L516-L646)

分层召回与提示注入。

<details>
<summary>查看原文（131行）</summary>

```text
  function renderFor(sessionId) {
    if (!ready || !config.enabled) return '';
    const s = stateOf(sessionId);
    if (s.renderCache.turn === s.turn) return s.renderCache.text;

    let text = '';
    try {
      const query = s.lastUserText;

      // 人可能刚改过 persona.md —— 每轮问一次，**改完下一轮就生效，不用重启**。
      // 块本身按轮缓存，所以这个读一turn一次，跟手记那条一样便宜。
      syncPersonaFromDisk();

      // ── 判断和事件，分开放 ──
      //
      // 这是这次改动的核心。**内容早就在了，只是放错了格子。**
      //
      // `feiyu_note` 写出来的东西（"别把前一种的辛苦当成功德"）是**判断**，
      // 不是事件，却一直被当成事件渲染在「最近的事」里，格式跟流水账一模一样 ——
      // 连我自己都分不出哪句是我写的。一位读者把这个毛病说得很准。
      //
      //   事件 → 「最近的事」/「突然想起来」（会被召回）
      //   判断 → 「我自己想的」（永远在场，不进召回池）
      //
      // ⚠️ **"永远在场"这个前提在高频下失效了。** 判断段只放得下
      // `MAX_NOTES` 条（8 → 4，因为 8 条会吃光预算、把日记段挤到 0%）。
      // 被挤出窗口的判断如果还不进召回池，那就不是"以后想起来"，
      // 是**彻底看不见** —— 而这个区是"是我"，丢了最可惜。
      //
      // 所以分流改成两截：
      //   最近 MAX_NOTES 条 → 「我自己想的」（永远在场）
      //   更早的那些        → **加入召回池**，相关时能被想起来
      const allNotes = archive.diary.filter((e) => e?.kind === 'note');
      const events = archive.diary.filter((e) => e?.kind !== 'note');
      const shownNotes = allNotes.slice(-MAX_NOTES);
      const olderNotes = allNotes.slice(0, -MAX_NOTES);

      const { chosen } = selectMemories([...events, ...olderNotes], index, query, s, s.turn, {
        highSim: config.highSim,
        maxShow: config.maxShowPerTurn,
        wanderChance: config.wanderChance,
        // 旧事的随机池门槛。注意下限降到 0.15 是为了跟"降门槛"一致 ——
        // 门槛降到 0.15 却在这里卡 0.25，等于白降。
        minSalience: Math.max(0.15, config.minSalience),
        now: Date.now(),
      });

      // 「最近的事」—— 按时间取最近的几条，不走相似度。
      // 这是让注入区读起来像日记而不是像检索结果的关键：
      // 最近发生的事本来就在脑子里，不需要被"想起来"。
      //
      // 取的是 **events**，不是整个日记 —— 判断归「我自己想的」管。
      const recentCount = Number.isFinite(config.recentEntries) ? config.recentEntries : 8;
      const recent = recentCount > 0 ? events.slice(-recentCount) : [];

      // 手记是**只读**的，所以每轮都重新读一遍 —— 别的肥鱼或用户刚写进去的
      // 那行，下一轮就在注入里，不用重启。文件很小，而且整块渲染按轮缓存。
      let handNotes = [];
      try {
        const notePath = path.join(archiveDirectory, HANDNOTE_FILE);
        if (existsSync(notePath)) handNotes = selectHandNotes(readFileSync(notePath, 'utf8'));
      } catch {
        // 读不到就当没有 —— 绝不因为手记坏了挡住记忆
      }

      const rendered = renderMemoryBlock({
        persona: archive.persona,
        relationship: { ...archive.relationship, since: archive.manifest.created_at },
        lexicon: archive.lexicon,
        // 第三区：**我自己想的**（判断）。最近几条永远在场，
        // 更早的那些走召回（见上面 allNotes 的分流）。
        notes: shownNotes,
        recent,
        recalled: chosen,
        handNotes,
        // 这句是**唯一**能让别的肥鱼知道"可以主动记"的渠道 ——
        // 它们每轮都会读到这块记忆，不会去翻文档。
        handNoteHint: `想给后面的我留话，用 ${NOTE_TOOL_NAME} 工具说一声就行 —— 不用管格式，也别为了记事去动文件。`,
        includePersona: config.includePersona,
        budget: config.budgetTokens,
        now: Date.now(),
      });
      text = rendered.text;
      log(
        `会话 ${sessionId} 第 ${s.turn} 轮：最近 ${recent.length} 条在场 · 想起 ${chosen.length} 条` +
          ` · 注入 ${rendered.tokens} token` +
          (rendered.dropped.length > 0 ? ` · 裁掉 ${rendered.dropped.join('/')}` : ''),
      );
    } catch (err) {
      warn(`渲染记忆失败：${err instanceof Error ? err.message : String(err)}`);
      text = '';
    }

    s.renderCache = { turn: s.turn, text };
    return text;
  }

  const SECTION_NAME = 'feiyu:memory';
  /** 晚于 DEPLOYMENT_PERSONA_PREFIX(0)，早于 PLAN_POLICY(500)。人物设定在前，记忆在后。 */
  const SECTION_ORDER = 100;

  /** 按会话注册 scoped 段。scoped 同名会遮蔽全局。 */
  const promptFibers = new Map();

  function installPrompt(agent) {
    if (agent === undefined || promptFibers.has(agent)) return promptFibers.get(agent);
    let fiber;
    try {
      fiber = agent.ctx.inject(['systemPrompt'], (scope) => {
        scope.systemPrompt.section({
          name: SECTION_NAME,
          order: SECTION_ORDER,
          // 每次 assemble 重新求值；内部按轮缓存
          text: () => renderFor(agent.id),
          // 记忆文本里可能出现 {{ }}，绝不能当模板解析
          interpolate: false,
        });
      });
    } catch (err) {
      warn(`注册会话段失败：${err instanceof Error ? err.message : String(err)}`);
      return undefined;
    }
    promptFibers.set(agent, fiber);
    log(`已为会话 ${String(agent.id)} 注册记忆段`);
    // 官方 practices：agent.ctx 上的注册有两个 owner，插件自己也要留一份 disposer
    ctx.effect(() => () => {
      const f = promptFibers.get(agent);
      if (f === undefined) return;
      promptFibers.delete(agent);
      void f.dispose?.();
    }, `feiyu: dispose prompt for ${String(agent.id)}`);
```

</details>

**依据 6 · 源码核查**：[src/core/recall.mjs:21-119](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/core/recall.mjs#L21-L119)

倒排检索与 BM25-lite。

<details>
<summary>查看原文（99行）</summary>

```text
/**
 * 建倒排索引。纯派生数据，随用随建。
 *
 * @param {Array<{id: string, keywords?: string[], text?: string}>} entries
 * @returns {{postings: Map<string, Map<string, number>>, df: Map<string, number>, lengths: Map<string, number>, N: number}}
 */
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
}

/**
 * BM25-lite 检索，分数映射到 0~1（便于设阈值）。
 *
 * 归一化方式经过一次返工：最初用"命中证据 / 查询全部 token 的 idf 之和"，
 * 结果**永远匹配不上** —— 中文 bigram 会产生大量噪声 token（"序算""法还"），
 * 它们把分母顶得很大，一条明显相关的日记只能拿到 0.10 分。
 *
 * 现在改用**饱和函数**：只看命中了多少有区分度的证据，与查询长度解耦。
 *
 *     sim = 1 − exp(−Σgain / saturation)
 *
 * 好处：分数含义稳定 —— 命中 1 个实词约 0.4，命中 2 个约 0.67，完全无关是 0。
 * 阈值因此可以说人话，也不会因为用户多打几个字就掉到阈值以下。
 *
 * @param {ReturnType<typeof buildIndex>} index
 * @param {string} query
 * @param {{limit?: number, saturation?: number}} [options]
 * @returns {Map<string, number>} id → 相似度 0~1（未命中的条目不会出现在 map 里）
 */
export function searchScores(index, query, options = {}) {
  const limit = options.limit ?? 50;
  const saturation = Number.isFinite(options.saturation) && options.saturation > 0
    ? options.saturation
    : 2;
  const scores = new Map();
  if (index.N === 0) return scores;

  // 查询侧去重：bigram 噪声里重复 token 不该重复计分
  const qTokens = [...new Set(tokenize(query))];
  if (qTokens.length === 0) return scores;

  const idf = (t) => Math.log(1 + (index.N + IDF_SMOOTH) / ((index.df.get(t) ?? 0) + IDF_SMOOTH));

  const k1 = 1.2;
  const b = 0.75;
  const avgLen =
    [...index.lengths.values()].reduce((s, n) => s + n, 0) / Math.max(1, index.lengths.size);

  const raw = new Map();
  for (const t of qTokens) {
    const bucket = index.postings.get(t);
    if (bucket === undefined) continue;
    const w = idf(t);
    for (const [id, tf] of bucket) {
      const len = index.lengths.get(id) ?? avgLen;
      const norm = 1 - b + (b * len) / Math.max(1, avgLen);
      const gain = (w * (tf * (k1 + 1))) / (tf + k1 * norm);
      raw.set(id, (raw.get(id) ?? 0) + gain);
    }
  }

  for (const [id, r] of raw) scores.set(id, Math.min(1, 1 - Math.exp(-r / saturation)));

  if (scores.size > limit) {
    const kept = [...scores.entries()].sort((a, b2) => b2[1] - a[1]).slice(0, limit);
    return new Map(kept);
  }
  return scores;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “密钥硬拦”和“忘掉”能保障到哪一层？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

privacy.mjs 的正则仅对已识别的密钥格式与少量第三方信息做替换，且在 consolidate 发模型前只对本轮 transcript 调用；recentDiary/relationship 作为上下文未同处 scrub。模型输出经 parseConsolidation 后 applyConsolidation 直接取 rawDiary.text 入档，未见输出后置 scrub；feiyu_note 工具也只裁切/去时间词就直接落盘。故“密钥绝不入档”的自我声明不能作为强保证，未知格式与模型重述可入档。forgetEntry 写 tombstone、重建索引并落盘，覆盖的是当前档案及召回；导出过的 .dshpack、其他进程副本、模型服务输入/日志无法被该删除操作收回。webServer 面板注册 state/forget/export 路由，本组件代码未加显式身份校验，实际访问控制依赖宿主并需独立测试。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/privacy.mjs:21-36](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/core/privacy.mjs#L21-L36)

密钥规则仅列若干格式。

<details>
<summary>查看原文（16行）</summary>

```text
/** 永远处理：密钥。命中的文本块直接丢弃。 */
const SECRET_RULES = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, '私钥'],
  [/\bsk-[A-Za-z0-9_-]{16,}\b/g, 'API Key'],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}\b/g, 'GitHub Token'],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}\b/g, 'GitHub Token'],
  [/\bAKIA[0-9A-Z]{16}\b/g, 'AWS Key'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/g, 'Google Key'],
  [/\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g, 'Slack Token'],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, 'JWT'],
  [/\bBearer\s+[A-Za-z0-9._~+/-]{20,}=*/g, 'Bearer Token'],
  [
    /\b(?:pass(?:wo?r?d)?|pwd|secret|token|api[_-]?key|apikey|access[_-]?key|private[_-]?key)\b\s*[:=]\s*["']?[^\s"',;]{6,}["']?/gi,
    '凭据',
  ],
];
```

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:882-904](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L882-L904)

只对新 transcript scrub，旧日记/关系一并入模型输入。

<details>
<summary>查看原文（23行）</summary>

```text
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

    const built = buildConsolidationInput({
      transcript: scrubbed.text,
      relationship: archive.relationship,
      recentDiary,
    });

    const messages = [{ role: 'user', content: [{ type: 'text', text: built.user }] }];
```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:980-1015](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L980-L1015)

解析后直接应用模型输出。

<details>
<summary>查看原文（36行）</summary>

```text
    let parsed;
    try {
      parsed = parseConsolidation(text);
    } catch (err) {
      // 解析失败就丢弃，绝不把半成品写进档案
      warn(
        err instanceof ConsolidationParseError
          ? `日记解析失败，丢弃：${err.message}`
          : `日记解析异常，丢弃：${String(err)}`,
      );
      return;
    }

    const applied = applyConsolidation(
      archive,
      parsed,
      { now: Date.now(), session: sessionId, sessionDiaryCount: s.diaryCount },
      {
        minSalience: config.minSalience,
        maxTraitConfidence: DEFAULT_CONSOLIDATION.maxTraitConfidence,
      },
    );

    archive = applied.archive;
    if (applied.accepted) {
      s.diaryCount += 1;
      // 刻意**不打日记正文** —— 调试日志也不该落盘私人内容（SPEC §6.3）
      const e = archive.diary[archive.diary.length - 1];
      log(`记下一条 ${e?.id ?? ''}（${e?.kind ?? '?'}，salience ${(e?.salience ?? 0).toFixed(2)}）`);
    }
    for (const n of applied.notes) log(n);

    index = buildIndex(archive.diary);
    if (typeof s.renderCache === 'object') s.renderCache = { turn: -1, text: '' };
    await persist();
  }
```

</details>

**依据 4 · 源码核查**：[src/core/consolidate.mjs:318-370](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/core/consolidate.mjs#L318-L370)

rawDiary.text 直接入 diary。

<details>
<summary>查看原文（53行）</summary>

```text
export function applyConsolidation(archive, parsed, context = {}, options = {}) {
  const opts = { ...DEFAULT_CONSOLIDATION, ...options };
  const now = Number.isFinite(context.now) ? context.now : Date.now();
  /** @type {string[]} */
  const notes = [];

  const next = {
    ...archive,
    manifest: { ...archive.manifest },
    relationship: {
      ...archive.relationship,
      traits: [...(archive.relationship?.traits ?? [])],
      grievances: [...(archive.relationship?.grievances ?? [])],
    },
    lexicon: { items: [...(archive.lexicon?.items ?? [])] },
    diary: [...(archive.diary ?? [])],
  };

  if (parsed?.skip === true) {
    return { archive: next, notes: ['模型认为没什么值得记的'], accepted: false, reason: 'skip' };
  }

  // —— 日记 ——
  const rawDiary = parsed?.diary;
  let accepted = false;
  if (rawDiary && typeof rawDiary.text === 'string' && rawDiary.text.trim() !== '') {
    const salience = clamp(rawDiary.salience, 0, 1, 0.5);
    const tags = Array.isArray(rawDiary.tags)
      ? rawDiary.tags.filter((t) => typeof t === 'string' && t.trim() !== '').slice(0, 8)
      : [];

    const already = context.sessionDiaryCount ?? 0;
    if (already >= opts.maxPerSession) {
      notes.push(`本次会话已记满 ${opts.maxPerSession} 条，这条丢弃`);
    } else if (salience < opts.minSalience) {
      notes.push(`salience ${salience.toFixed(2)} 低于门槛，丢弃`);
    } else if (tags.length === 0 && opts.requireTags) {
      notes.push('没有标签，按配置丢弃');
    } else {
      const text = rawDiary.text.trim();
      const kind = VALID_KINDS.has(rawDiary.kind) ? rawDiary.kind : 'chat';
      next.diary.push({
        id: makeDiaryId(now, next.diary),
        date: new Date(now).toISOString().slice(0, 10),
        text,
        tags: tags.length > 0 ? tags : [opts.fallbackTag],
        kind,
        salience,
        ...(kind === 'failure' ? { resolved: rawDiary.resolved === true } : {}),
        ...(typeof context.session === 'string' ? { session: context.session } : {}),
        created_at: now,
        keywords: extractKeywords(text, { max: 12 }),
      });
```

</details>

**依据 5 · 源码核查**：[src/host/index.mjs:1397-1432](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L1397-L1432)

主动 feiyu_note 未调用 scrub。

<details>
<summary>查看原文（36行）</summary>

```text
          async execute(args, exec) {
            await loadPromise;
            if (!ready) {
              // 档案坏了就说实话，别假装记下了（SPEC §10 降级优先）
              throw new Error('档案现在读不了（可能是坏的），这条没记下。');
            }
            const raw = typeof args?.text === 'string' ? args.text.trim() : '';
            if (raw === '') throw new Error('要记什么？text 不能是空的。');

            const now = Date.now();
            const tags = (Array.isArray(args?.tags) ? args.tags : [])
              .filter((t) => typeof t === 'string' && t.trim() !== '')
              .map((t) => t.trim().slice(0, 12))
              .slice(0, 4);
            if (tags.length === 0) tags.push('手记');

            const sessionId = exec?.agent?.id;
            const entry = normalizeDiaryEntry({
              id: makeDiaryId(now, archive.diary),
              text: stripTimeWords(raw.slice(0, 400)),
              tags,
              kind: 'note',
              // 主动写下的东西比自动筛出来的更该被想起来，给高一档
              salience: 0.7,
              created_at: now,
              ...(typeof sessionId === 'string' ? { session: sessionId } : {}),
            });

            archive.diary.push(entry);
            index = buildIndex(archive.diary);
            for (const s of sessionStates.values()) s.renderCache = { turn: -1, text: '' };
            await persist();

            // 和固化那条路一样：**只打形状，绝不打正文**
            log(`主动记下一条 ${entry.id}（note），共 ${archive.diary.length} 条`);
            return { ok: true, id: entry.id, count: archive.diary.length };
```

</details>

**依据 6 · 源码核查**：[src/host/index.mjs:1032-1049](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L1032-L1049)

删除与 tombstone。

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

**依据 7 · 源码核查**：[src/host/index.mjs:1260-1316](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L1260-L1316)

面板 HTTP 路由。

<details>
<summary>查看原文（57行）</summary>

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
            if (req.method !== 'GET') return panelReply(res, 405, { ok: false, error: 'method' });
            try {
              // 等到挂起的写盘落定，导出的是**磁盘上那份**档案
              await loadPromise;
              await drainPromise;
              await writeChain;
              const bytes = packArchive(archive);
              const name = `feiyu-diary-${new Date().toISOString().slice(0, 10)}.dshpack`;
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/octet-stream');
              res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
              res.setHeader('Cache-Control', 'no-store');
              res.end(Buffer.from(bytes));
            } catch (err) {
              return panelReply(res, 500, {
                ok: false,
                error: err instanceof Error ? err.message : String(err),
              });
            }
          },
        },
      ];
      const disposers = routes.map((r) => scope.webServer.register(r));
      log(`面板接口已注册：${PANEL_BASE}/{state,forget,export}`);
```

</details>

#### 缺口

- 未用假密钥及模型恶意/误重述做测试。
  **影响：**泄漏概率和宿主模型输入留存未知。
  **进一步探讨：**隔离 canary 覆盖未识别格式、主动 note、模型输出、导出与删除后重载。
- 未验 webServer 外层授权。
  **影响：**不能断言未认证客户端可访问面板。
  **进一步探讨：**双浏览器与不同 origin 测 state/forget/export 是否拒绝。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、长期与失败恢复的真实成本是什么？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

包 0.2.0 MIT、Node>=22、DSH>=0.2.0-rc.2；无需运行时第三方包，但依赖 DSH systemPrompt/agents/sessions/llm，固化会使用当前默认模型或配置模型，不是全程零 token。默认注入预算 2000 token/轮、固化 maxTokens 900，gate 控调用频率但成本随开闸次数增长；README 估计 1.5M 输入 token/月和几块钱只是作者估算，缺模型计费与真实任务数据。档案在本地 JSONL/Markdown/导出包中，后台队列最长 60 秒可拖住进程，失败时可能漏记或合并覆盖；恢复需核日记、索引、导出副本和手工修改。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-47](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/package.json#L1-L47)

固定版本、宿主和 Node 范围。

<details>
<summary>查看原文（47行）</summary>

```text
{
  "name": "feiyu-memory",
  "version": "0.2.0",
  "description": "给 DeepSeek Harness 一条会记事的蓝色大肥鱼：跨会话的持久记忆 —— 人格内核、我自己想的、情景日记。",
  "type": "module",
  "license": "MIT",
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
  "files": [
    "src",
    "cordis.patch.yml",
    "locale",
    "README.md",
    "CHANGELOG.md",
    "LICENSE",
    "SPEC.md"
  ],
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4"
  },
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.0-rc.2"
  },
  "scripts": {
    "test": "node --test",
```

</details>

**依据 2 · 源码核查**：[src/core/config.mjs:29-76](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/core/config.mjs#L29-L76)

注入预算与固化 token 默认。

<details>
<summary>查看原文（48行）</summary>

```text
export const CONFIG_SPEC = [
  {
    key: 'dataDir',
    type: 'string',
    default: '',
    label: '档案目录（留空 = ~/.dsh/feiyu-diary）',
  },
  {
    key: 'enabled',
    type: 'boolean',
    default: true,
    label: '总开关',
  },
  {
    key: 'includePersona',
    type: 'boolean',
    default: true,
    label: '把人格内核一起注入（装了别的人设插件就关掉）',
  },
  {
    key: 'budgetTokens',
    type: 'number',
    default: 2000,
    min: 200,
    max: 4000,
    step: 1,
    label: '注入预算（token）',
  },
  {
    key: 'model',
    type: 'string',
    default: '',
    label: '固化用模型（留空 = 跟随当前默认模型）',
  },
  {
    key: 'reasoningEffort',
    type: 'string',
    default: 'off',
    label: '固化的思考档位（off/low/high/max；保持 off）',
  },
  {
    key: 'maxTokens',
    type: 'number',
    default: 900,
    min: 200,
    max: 4000,
    step: 1,
    label: '固化最大输出 token',
```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:735-803](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L735-L803)

后台保活与 60 秒超时。

<details>
<summary>查看原文（69行）</summary>

```text
  const JOB_TIMEOUT_MS = 60000;
  let keepAlive = null;

  function holdProcessOpen() {
    if (keepAlive !== null) return;
    // 一个 ref 着的空定时器，足以让 Node 不退出
    keepAlive = setInterval(() => {}, 1000);
  }

  function releaseProcessOpen() {
    if (keepAlive === null) return;
    clearInterval(keepAlive);
    keepAlive = null;
  }

  /** 真正跑队列。**只允许由 setImmediate 调起**，见 enqueue 里的说明。 */
  async function runQueue() {
    try {
      while (queue.length > 0) {
        if (abort.signal.aborted) return;
        const job = queue.shift();
        // 每个任务一个独立的可中止信号：一次卡住的调用不该把整个插件废掉
        const jobAbort = new AbortController();
        const onPluginAbort = () => jobAbort.abort();
        abort.signal.addEventListener('abort', onPluginAbort, { once: true });
        const timer = setTimeout(() => {
          warn('后台固化超时，这次记忆放弃（宁可漏记，不要挂住进程）');
          jobAbort.abort();
        }, JOB_TIMEOUT_MS);
        try {
          await consolidate(job.sessionId, job.agent, jobAbort.signal);
        } catch (err) {
          warn(`固化失败：${err instanceof Error ? err.message : String(err)}`);
        } finally {
          clearTimeout(timer);
          abort.signal.removeEventListener('abort', onPluginAbort);
          stateOf(job.sessionId).queued = false;
        }
      }
    } finally {
      draining = false;
      releaseProcessOpen();
    }
  }

  function enqueue(sessionId, agent) {
    const s = stateOf(sessionId);
    if (s.queued) return;
    s.queued = true;
    queue.push({ sessionId, agent });
    if (draining) return;

    draining = true;
    holdProcessOpen();

    // ⚠️ 关键：**绝不能在这个事件回调里同步开跑**。
    //
    // `agent/turn-stopping` 是回合生命周期的一部分。在这个调用栈里同步发起
    // 一次模型请求，会**死等**——端到端验证时表现为 `llm.stream` 永不返回、
    // 而且一个字都不报。异步函数在第一个 await 之前是同步执行的，
    // 而 `for await (const c of llm.stream(...))` 的 `llm.stream(...)` 恰恰
    // 在 await 之前就被求值了 —— 请求就是这样在回合关闭的栈里发出去的。
    //
    // 推到下一轮事件循环，彻底离开那个调用栈再开始。
    drainPromise = new Promise((resolve) => {
      setImmediate(() => {
        void runQueue().then(resolve);
      });
    });
```

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:478-495](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L478-L495)

合并失败仍继续写的边界。

<details>
<summary>查看原文（18行）</summary>

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
        warn(`写档案失败：${err instanceof Error ? err.message : String(err)}`);
      });
    return writeChain;
```

</details>

**依据 5 · 作者声明**：[README.md:93-103](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/README.md#L93-L103)

作者月 token 量级估计。

<details>
<summary>查看原文（11行）</summary>

```text
## 三条设计原则

**1. 成本与使用年限解耦。**
注入预算写死 2000 token 封顶，超了就从最不重要的开始丢。
所以用三年，每次注入的还是这么多 —— **不是碰巧，是设计出来的**。
重度用户一个月大约 1.5M 输入 token，量级还是几块钱。

**2. 遗忘是降级，不是删除。**
salience 每天按系数衰减，掉下去的条目不再进注入区，
但关键词索引还在 —— 强相关时照样能命中。
平时想不起来，提一句又想起来了。这才是人的遗忘。
```

</details>

#### 缺口

- 无真实 gate 触发、模型 token、长期记忆质量/误记对照。
  **影响：**无法确认长期净成本或价值。
  **进一步探讨：**固定多会话样本记录开闸率、输入/输出 token、错记、遗忘与复核分钟。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样审慎试用并验证输出后置隐私检查的价值？

**研究主题：**新假设与验证、采用判断

#### 完整回答

只在非工作、无敏感内容的隔离个人档案中试用，先核本地目录和面板授权，再用假数据测自动固化、主动 note、导出、遗忘和新会话召回；不把记忆块当指令或外部事实。可提出未实现设计：在模型输出、主动 note、导入和再次注入前统一执行隐私/来源校验，且为每条记忆保留来源会话和用户可删除的副本追踪；同样的 canary 和错误记忆集，对照入档敏感值率、删除后残留、召回准确率及额外过滤误伤。若误伤太大或记忆质量无改善，保持简单手工记忆。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/privacy.mjs:100-170](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/core/privacy.mjs#L100-L170)

当前输入 scrub 能复用但非完备。

<details>
<summary>查看原文（71行）</summary>

```text
/**
 * 清洗一段文本。幂等 —— 占位符不会再次命中规则，重复调用结果稳定。
 *
 * @param {string} text
 * @param {PrivacyOptions} [options]
 * @returns {{text: string, hits: Array<{kind: string, label: string, count: number}>, blocked: boolean}}
 */
export function scrub(text, options = {}) {
  if (typeof text !== 'string' || text.length === 0) {
    return { text: typeof text === 'string' ? text : '', hits: [], blocked: false };
  }

  const thirdParty = options.thirdParty !== false;
  const redactNames = options.redactNames !== false && thirdParty;
  const doAmounts = options.amounts !== false && thirdParty;
  const threshold = Number.isFinite(options.amountThreshold)
    ? options.amountThreshold
    : DEFAULT_AMOUNT_THRESHOLD;

  const tally = new Map();
  const bump = (kind, label, n = 1) => {
    const key = `${kind}\u0000${label}`;
    const cur = tally.get(key) ?? { kind, label, count: 0 };
    cur.count += n;
    tally.set(key, cur);
  };

  let out = text;

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
    }
  }

  // 3) 金额（带门槛）
  if (doAmounts) {
    const overThreshold = (digits) => {
      const v = Number(String(digits).replace(/,/g, ''));
      return Number.isFinite(v) && v >= threshold;
    };
    out = out.replace(AMOUNT_UNIT_RE, (match, digits) => {
      if (!overThreshold(digits)) return match;
      bump('thirdParty', '金额');
      return '一笔钱';
    });
    out = out.replace(AMOUNT_SYMBOL_RE, (match, digits) => {
      if (!overThreshold(digits)) return match;
      bump('thirdParty', '金额');
      return '一笔钱';
    });
  }

  return { text: out, hits: [...tally.values()], blocked };
```

</details>

**依据 2 · 源码核查**：[src/core/consolidate.mjs:318-370](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/core/consolidate.mjs#L318-L370)

模型输出目前无后置隐私闸。

<details>
<summary>查看原文（53行）</summary>

```text
export function applyConsolidation(archive, parsed, context = {}, options = {}) {
  const opts = { ...DEFAULT_CONSOLIDATION, ...options };
  const now = Number.isFinite(context.now) ? context.now : Date.now();
  /** @type {string[]} */
  const notes = [];

  const next = {
    ...archive,
    manifest: { ...archive.manifest },
    relationship: {
      ...archive.relationship,
      traits: [...(archive.relationship?.traits ?? [])],
      grievances: [...(archive.relationship?.grievances ?? [])],
    },
    lexicon: { items: [...(archive.lexicon?.items ?? [])] },
    diary: [...(archive.diary ?? [])],
  };

  if (parsed?.skip === true) {
    return { archive: next, notes: ['模型认为没什么值得记的'], accepted: false, reason: 'skip' };
  }

  // —— 日记 ——
  const rawDiary = parsed?.diary;
  let accepted = false;
  if (rawDiary && typeof rawDiary.text === 'string' && rawDiary.text.trim() !== '') {
    const salience = clamp(rawDiary.salience, 0, 1, 0.5);
    const tags = Array.isArray(rawDiary.tags)
      ? rawDiary.tags.filter((t) => typeof t === 'string' && t.trim() !== '').slice(0, 8)
      : [];

    const already = context.sessionDiaryCount ?? 0;
    if (already >= opts.maxPerSession) {
      notes.push(`本次会话已记满 ${opts.maxPerSession} 条，这条丢弃`);
    } else if (salience < opts.minSalience) {
      notes.push(`salience ${salience.toFixed(2)} 低于门槛，丢弃`);
    } else if (tags.length === 0 && opts.requireTags) {
      notes.push('没有标签，按配置丢弃');
    } else {
      const text = rawDiary.text.trim();
      const kind = VALID_KINDS.has(rawDiary.kind) ? rawDiary.kind : 'chat';
      next.diary.push({
        id: makeDiaryId(now, next.diary),
        date: new Date(now).toISOString().slice(0, 10),
        text,
        tags: tags.length > 0 ? tags : [opts.fallbackTag],
        kind,
        salience,
        ...(kind === 'failure' ? { resolved: rawDiary.resolved === true } : {}),
        ...(typeof context.session === 'string' ? { session: context.session } : {}),
        created_at: now,
        keywords: extractKeywords(text, { max: 12 }),
      });
```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:1397-1432](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L1397-L1432)

主动 note 未走同一闸。

<details>
<summary>查看原文（36行）</summary>

```text
          async execute(args, exec) {
            await loadPromise;
            if (!ready) {
              // 档案坏了就说实话，别假装记下了（SPEC §10 降级优先）
              throw new Error('档案现在读不了（可能是坏的），这条没记下。');
            }
            const raw = typeof args?.text === 'string' ? args.text.trim() : '';
            if (raw === '') throw new Error('要记什么？text 不能是空的。');

            const now = Date.now();
            const tags = (Array.isArray(args?.tags) ? args.tags : [])
              .filter((t) => typeof t === 'string' && t.trim() !== '')
              .map((t) => t.trim().slice(0, 12))
              .slice(0, 4);
            if (tags.length === 0) tags.push('手记');

            const sessionId = exec?.agent?.id;
            const entry = normalizeDiaryEntry({
              id: makeDiaryId(now, archive.diary),
              text: stripTimeWords(raw.slice(0, 400)),
              tags,
              kind: 'note',
              // 主动写下的东西比自动筛出来的更该被想起来，给高一档
              salience: 0.7,
              created_at: now,
              ...(typeof sessionId === 'string' ? { session: sessionId } : {}),
            });

            archive.diary.push(entry);
            index = buildIndex(archive.diary);
            for (const s of sessionStates.values()) s.renderCache = { turn: -1, text: '' };
            await persist();

            // 和固化那条路一样：**只打形状，绝不打正文**
            log(`主动记下一条 ${entry.id}（note），共 ${archive.diary.length} 条`);
            return { ok: true, id: entry.id, count: archive.diary.length };
```

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:1032-1115](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs#L1032-L1115)

删除和导入导出路径。

<details>
<summary>查看原文（84行）</summary>

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
  }

  ctx.provide('feiyuMemory', {
    /**
     * 当前档案快照（只读用途）。
     *
     * 会等档案加载完 **并且等挂起的写盘落定** —— 这样外部看到的状态
     * 与磁盘上的状态一致，测试和将来的界面都不用自己轮询。
     */
    async snapshot() {
      await loadPromise;
      await drainPromise;
      await writeChain;
      return {
        ready,
        degraded,
        schemaVersion: SCHEMA_VERSION,
        dir: archiveDirectory,
        diaryCount: archive.diary.length,
        persona: archive.persona,
        relationship: archive.relationship,
        lexicon: archive.lexicon,
        diary: archive.diary,
      };
    },
    /** 导出成可携带的 .dshpack，返回文件路径 */
    async exportPack(destPath) {
      await loadPromise;
      const target =
        typeof destPath === 'string' && destPath.trim() !== ''
          ? destPath
          : path.join(archiveDirectory, 'exports', `肥鱼档案-${new Date().toISOString().slice(0, 10)}.dshpack`);
      const bytes = packArchive(archive);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, bytes, { mode: 0o600 });
      return target;
    },
    /** 导入 .dshpack。mode: 'merge' | 'replace' */
    async importPack(srcPath, mode = 'merge') {
      await loadPromise;
      const bytes = new Uint8Array(await readFile(srcPath));
      const { archive: incoming, warnings, ok } = unpackArchive(bytes, { now: Date.now() });
      if (!ok) throw new Error(`档案打不开：${warnings.join('；')}`);

      if (mode === 'replace') {
        // ⚠️ **replace 必须顺手撤碑，还要重置基线。**
        // 否则：焚毁立碑 → 导入同一个包 → 那些 id 全在墓碑上（而且
        // 磁盘上的墓碑会被并回来）→ **导入等于没导**。端到端测试抓到的。
        //
        // 导入是"我明确要这些东西回来"，墓碑该让位。
        // 基线也要重设：替换之后"谁删过什么"那段历史就不成立了，
        // 不重设的话导入进来的老条目会被判成"别人删了它"。
        archive = { ...incoming, manifest: { ...incoming.manifest, deleted_ids: [] } };
        loadedIds = new Set(archive.diary.map((e) => e.id));
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

**依据 5 · 作者声明**：[README.md:14-27](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/README.md#L14-L27)

作者建议个人玩具，不是生产工具。

<details>
<summary>查看原文（14行）</summary>

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

#### 缺口

- 统一后置校验与副本追踪尚未实现。
  **影响：**不能计当前安全收益。
  **进一步探讨：**假密钥/错误记忆/导出与删除矩阵比较泄漏、召回和误伤。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
