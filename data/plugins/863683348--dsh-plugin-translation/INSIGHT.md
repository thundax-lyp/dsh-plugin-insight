# dsh-plugin-translation

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[2238d4d](https://github.com/863683348/dsh-plugin-translation/tree/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation) [![npm 30d 1,011](https://img.shields.io/static/v1?label=npm+30d&message=1%2C011&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation)
<!-- END META -->

> **实现功能**：为模型翻译提供切段、术语抽取、规则质检、语体指引与工作区翻译/术语记忆。

> **核心亮点**：把切段、规则、术语和风格记忆集中成模型可调用翻译辅助流程，减少重复约束交接；不是翻译模型或可靠语义评分器。详见[Q01](#research-q01)。

> **风险与缺陷**：quality从表面规则扣分，严重语义错仍可能高分；无版本条件读改写和缺cwd跳过containment也限制共享记忆可靠性。详见[Q03](#research-q03)。

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
  - [Q01 · 模型负责翻译时工具增加什么？](#detail-section-11)
  - [Q02 · 单工具动作及文件记忆怎么流动？](#detail-section-12)
  - [Q03 · 百分质量分和持久写有何限制？](#detail-section-13)
  - [Q04 · 工程和阶段成本如何？](#detail-section-14)
  - [Q05 · 可推导何种改进，当前怎样采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长文及技术翻译用户需要一致术语和形式核查，合格译文仍以独立语义正确为准。详见[Q01](#research-q01)。

普通翻译提示、手工分段、版本化词表和脚本QA是简单替代，插件集中调用但不取代语义判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 切段/候选术语 | 长文组织 | 形式规则需人确认 |
| QA/quality | 发现表面风险 | 不证明语义正确 |
| 词表/语体/译对记忆 | 跨轮一致 | 明确cwd、串行与备份 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| tools/systemPrompt/fs | 注册与存储 | API/DSL需匹配 |
| 明确session cwd | 文件containment | 缺失跳过本项边界检查 |
| 可写/备份词表 | 持久约束 | 并发覆盖和错误需恢复 |
| 翻译模型与人复核 | 真正译文质量 | 规则不能替代 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 配置工作区和备份 | 用户 | 三文件路径/容量明确 |
| 切段、确认词表翻译 | 模型/用户 | 词义与语体被确认 |
| 规则+语义复核 | 工具/用户 | 不以grade代替验收 |
| 串行写入正确译对 | 用户/Agent | 可撤回和恢复文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地宿主/词表文件 | 建立确认术语和语体 | 需会话工作区及确认术语；初配时间未知 |
| 持续使用 | 文本扫描/读写及原模型费用 | 语义复核，节省未测 | 无独立API不等总费为零；模型翻译/语义复核成本未知 |
| 失败恢复 | 文件备份和重新翻译 | 清错误译对、恢复并发覆盖 | 词表裁剪/并发覆盖需备份；重译/修复工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 切段术语 | 形式规则与词表 | 非语义识别 |
| 质量筛查 | 数字/长度/标点等扣分 | 不等翻译准确度 |
| 跨轮记忆 | 三类Markdown文件 | 错误、裁剪和并发需复核 |

> **思考**：quality从表面规则扣分，严重语义错仍可能高分；无版本条件读改写和缺cwd跳过containment也限制共享记忆可靠性。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把切段、规则、术语和风格记忆集中成模型可调用翻译辅助流程，减少重复约束交接；不是翻译模型或可靠语义评分器。详见[Q01](#research-q01)。

把切段、规则、术语和风格记忆集中成模型可调用翻译辅助流程，减少重复约束交接；不是翻译模型或可靠语义评分器。详见[Q01](#research-q01)。

纯逻辑与宿主接线分离、解释性规则可复用；需收窄总体quality语义并处理文件版本，测试分段不证明翻译质量。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

quality从表面规则扣分，严重语义错仍可能高分；无版本条件读改写和缺cwd跳过containment也限制共享记忆可靠性。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议单用户明确cwd、有词表备份的辅助试用；不自动放行高风险翻译，高分语义错、覆盖或路径不明时停写库。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

规则和记忆流程有源码支持；quality不等语义正确，存储并发与缺cwd存在边界。分层质检为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/translation.js、test/translation.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交入口、纯规则/质量函数、存储接线与测试阅读；不执行插件或翻译，不将启发式分写为真实语言准确率。
- 下一步：进一步探讨从语义错却形式正确、正确意译扣分、并发词表写和缺cwd四组反例入手，再比较一致率和总复核成本。

**分析版本**

- **仓库**：[863683348/dsh-plugin-translation](https://github.com/863683348/dsh-plugin-translation)
- **版本号**：0.3.2（[固定提交 2238d4d](https://github.com/863683348/dsh-plugin-translation/tree/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究规则命中位置与独立语义验收分层，以及确认译对的来源/失效关系，以否定翻反等固定反例比较错误放行。当前未验证。详见[Q05](#research-q05)。

进一步探讨从语义错却形式正确、正确意译扣分、并发词表写和缺cwd四组反例入手，再比较一致率和总复核成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 616 | 523 | 56 | — |
| .md | source | 4 | 172 | — | — | 1590 |
| .mjs | test | 1 | 228 | 200 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation/issues?q=is%3Aissue+created%3A2026-09-22T05%3A17%3A20.093Z..2026-10-22T05%3A17%3A20.093Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A17%3A20.093Z..2026-10-22T05%3A17%3A20.093Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本规则质检与工作区翻译记忆如何帮助翻译，哪些分数和存储边界影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型负责翻译时工具增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向反复翻译长文、技术资料或同一项目术语的DSH用户。模型仍负责翻译，工具负责切段、抽候选术语、数字/标点/长度等规则检查、术语一致性以及记忆；合格结果应是译文在语义正确基础上遵守已确认术语、数字和语体，不能以工具passed代替人工或独立质量判断。

简单替代是手工分段、维护术语表和脚本检查。插件把这些步骤接入translate_kit和systemPrompt指导，使模型能读取上次确认的术语/风格，减少重复约束交接。贡献是流程与工作区记忆组合，不是机器翻译模型或新的质量评估算法。候选术语主要按缩写、camelCase等形式规则提取，普通词汇或专业语义仍需人确认。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-4](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/README.md#L1-L4)

作者明确model translates、plugin辅助。

```text
# dsh-plugin-translation

A **translation toolkit** for [DeepSeek Harness](https://github.com/deepseek-ai/dsh) agents: chunking, glossary extraction, source–target QA, tone guides, and a durable translation memory. The model translates; the plugin chunks, checks, and remembers.

```

**依据 2 · 源码核查**：[lib/index.js:60-68](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/index.js#L60-L68)

先切段/术语、检查与持久化的指引。

```text
const SECTION_TEXT = [
  "Translation guidance:",
  "- For long texts, chunk first with `translate_kit` action `segment`, translate chunk by chunk, then `check` the full target against the source.",
  "- Build a glossary with `glossary` from the source and reuse it consistently.",
  "- Always run `check` before delivering: numbers, units, placeholders, brackets, and length must match the source.",
  "- Apply the appropriate `tone` guide (formal / colloquial / technical) for the target audience.",
  "- Save recurring pairs to the translation memory with `memo_add` and consult it with `memo_get`.",
  "- Maintain a durable term base with `glossary_add` / `glossary_get` / `glossary_remove`, and run `consistency` across chunks so one source term stays one translation.",
  "- Persist the register you settled on with `tone_save` / `tone_get`, and score every finished chunk with `quality` before delivery (target: B or better).",
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 单工具动作及文件记忆怎么流动？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口注入tools/systemPrompt/fs，单个translate_kit按action分派13类动作，纯计算调用translation.js，记忆/术语/语体动作通过ctx.fs读现有Markdown，合并或裁剪后写回。默认三个文件在工作区.dsh目录，保留上限分别200、200、50，读取结果新项优先，供模型作为后续翻译约束。

路径由exec.agent.session.header.cwd解析，resolveFileTarget在cwd存在时resolve工作区并contains检查；cwd缺失则只resolve配置文件，不做这项包含核对，实际权限还依宿主fs默认策略。写入采用read-modify-write，没有replaceIfVersion或本地队列。宿主fs和工具value-schema DSL需匹配，systemPrompt开关只控制指导段而不移除工具；不需要独立翻译API Key，但实际翻译模型仍由会话提供并计费。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:37-57](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/index.js#L37-L57)

服务及默认文件/容量。

<details>
<summary>查看原文（21行）</summary>

```text
/** Services this plugin must resolve before it applies. */
const inject = ["tools", "systemPrompt", "fs"];

/** Composition-row configuration for the plugin entry. */
const Config = z.object({
  /** Register the translation prompt-guidance section. */
  personaSection: z.boolean().default(true),
  /** Order of the section (ascending; persona is 0). */
  sectionOrder: z.number().default(6),
  /** Translation-memory file path, relative to the session workspace. */
  memoFile: z.string().default(".dsh/translation-memo.md"),
  /** Keep at most this many entries in the memory file. */
  maxMemoEntries: z.number().default(200),
  /** Glossary file path, relative to the session workspace. */
  glossaryFile: z.string().default(".dsh/translation-glossary.md"),
  /** Keep at most this many entries in the glossary file. */
  maxGlossaryEntries: z.number().default(200),
  /** Tone-memory file path, relative to the session workspace. */
  toneFile: z.string().default(".dsh/translation-tone.md"),
  /** Keep at most this many saved tone guides. */
  maxToneEntries: z.number().default(50),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:71-79](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/index.js#L71-L79)

cwd条件路径核对。

```text
async function resolveFileTarget(ctx, file, cwd, signal) {
  const target = await ctx.fs.resolve(file, cwd !== undefined ? { cwd, signal } : { signal });
  if (cwd !== undefined) {
    const cwdTarget = await ctx.fs.resolve(".", { cwd, signal });
    if (!ctx.fs.contains(cwdTarget, target)) {
      throw new Error('translation: memo file "' + file + '" escapes the session workspace');
    }
  }
  return target;
```

**依据 3 · 源码核查**：[lib/index.js:155-170](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/index.js#L155-L170)

记忆读合并写链。

<details>
<summary>查看原文（16行）</summary>

```text
        case "memo_get":
        case "memo_add": {
          const cwd = exec.agent?.session?.header?.cwd;
          const target = await resolveFileTarget(ctx, memoFile, cwd, exec.signal);
          path = ctx.fs.processPath(target);
          const info = await ctx.fs.stat(target, exec.signal);
          const existing = info !== undefined ? await ctx.fs.readText(target, exec.signal) : "";
          if (action === "memo_get") {
            text = renderMemo({ text: existing, maxEntries: args.maxEntries });
          } else {
            const entry = buildMemoEntry({
              source: args.source, target: args.target, lang: args.lang,
              now: new Date().toISOString(),
            });
            const next = appendMemo({ existing, entry, maxEntries: maxMemoEntries });
            await ctx.fs.writeText(target, next, undefined, exec.signal);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:205-216](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/index.js#L205-L216)

语体记忆同样按cwd与读改写。

<details>
<summary>查看原文（12行）</summary>

```text
        case "tone_get":
        case "tone_save": {
          const cwd3 = exec.agent?.session?.header?.cwd;
          const tTarget = await resolveFileTarget(ctx, toneFile, cwd3, exec.signal);
          const tInfo = await ctx.fs.stat(tTarget, exec.signal);
          const tExisting = tInfo !== undefined ? await ctx.fs.readText(tTarget, exec.signal) : "";
          if (action === "tone_get") {
            text = renderToneMemory({ text: tExisting, tone: args.tone, targetLang: args.targetLang, maxEntries: args.maxEntries });
          } else {
            const nextT = mergeToneEntry({ existing: tExisting, tone: args.tone, targetLang: args.targetLang, notes: args.notes, maxEntries: maxToneEntries, now: new Date().toISOString() });
            await ctx.fs.writeText(tTarget, nextT, undefined, exec.signal);
            text = "Saved tone guide to " + ctx.fs.processPath(tTarget) + ".\n\n" + renderToneMemory({ text: nextT, tone: args.tone, targetLang: args.targetLang, maxEntries: 3 });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 百分质量分和持久写有何限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

quality的fidelity从60、fluency从40起，按数字缺失、术语字符串未包含、长度比、语言片段、句数、重复标点与超长句扣分。这些是表面风险筛选，错误语义、否定翻反或无关译文只要形式相近仍可能高分，正确的意译/跨语种句式变化也可能被扣。不能把A/B或passed>=75称为真实翻译准确度，更不能把引导里的“B或更好”当交付充分条件。

记忆写入存在并发丢更新条件，两个调用读同一旧文件再各自全写，后写可能覆盖前者；宿主fs具体行为需确认，源码没有显式版本条件。缺cwd时containment跳过又弱于README“不能逃出workspace”的无条件说法。持久记忆也会保存用户给的错误译对或敏感源文，自动复用会放大错误，不是经过验证的翻译记忆库。

#### 证据与依据

**依据 1 · 源码核查**：[lib/translation.js:301-340](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/translation.js#L301-L340)

保真分只是规则扣分。

<details>
<summary>查看原文（40行）</summary>

```text
/** Heuristic translation quality score (0-100) with fidelity/fluency breakdown. */
export function scoreQuality({ source = "", target = "", glossary = [] } = {}) {
  const src = String(source);
  const tgt = String(target);
  if (!src.trim() || !tgt.trim()) throw new Error("translation: source and target are required");
  const issues = [];
  let fidelity = 60;
  let fluency = 40;
  // 1. numbers preserved
  const srcNums = src.match(/\d+(?:[.,]\d+)?/g) || [];
  const tgtNums = new Set(tgt.match(/\d+(?:[.,]\d+)?/g) || []);
  const missingNums = srcNums.filter((n) => !tgtNums.has(n));
  if (missingNums.length > 0) {
    const p = Math.min(24, missingNums.length * 8);
    fidelity -= p;
    issues.push("数字缺失 " + missingNums.length + " 个：" + missingNums.slice(0, 5).join(", ") + "（-" + p + "）");
  }
  // 2. glossary compliance
  const gMiss = [];
  for (const g of (Array.isArray(glossary) ? glossary : [])) {
    if (!g || !g.source || !g.target) continue;
    if (src.includes(g.source) && !tgt.includes(g.target)) gMiss.push(g.source);
  }
  if (gMiss.length > 0) {
    const p = Math.min(18, gMiss.length * 6);
    fidelity -= p;
    issues.push("术语未按术语表翻译：" + gMiss.slice(0, 5).join(", ") + "（-" + p + "）");
  }
  // 3. length ratio sanity
  const ratio = src.length > 0 ? tgt.length / src.length : 1;
  if (ratio < 0.4 || ratio > 3) {
    fidelity -= 8;
    issues.push("长度比 " + ratio.toFixed(2) + " 异常（-8）");
  }
  // 4. untranslated leakage
  const srcCJK = /[\u4e00-\u9fff]/.test(src);
  const asciiRuns = tgt.match(/[A-Za-z]{4,}(?:\s+[A-Za-z]{2,}){2,}/g) || [];
  if (srcCJK && asciiRuns.length > 0) {
    fidelity -= 10;
    issues.push("目标语言中疑似未翻译片段：「" + asciiRuns[0].slice(0, 30) + "」（-10）");
```

</details>

**依据 2 · 源码核查**：[lib/translation.js:342-373](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/translation.js#L342-L373)

流畅分/grade与未发现明显问题文本。

<details>
<summary>查看原文（32行）</summary>

```text
  // 5. sentence count parity
  const sSent = countSentences(src);
  const tSent = countSentences(tgt);
  if (sSent > 0 && Math.abs(sSent - tSent) / sSent > 0.5) {
    fluency -= 8;
    issues.push("句数不匹配（源 " + sSent + " / 译 " + tSent + "）（-8）");
  }
  // 6. doubled punctuation / spaces
  const doubles = (tgt.match(/[，。、；：,.;:]{2,}|\s{2,}/g) || []).length;
  if (doubles > 0) {
    const p = Math.min(12, doubles * 4);
    fluency -= p;
    issues.push("重复标点/空格 " + doubles + " 处（-" + p + "）");
  }
  // 7. over-long sentence
  const hasLong = tgt.split(/[.!?。！？]+/).some((s) => s.trim().length > 200);
  if (hasLong) {
    fluency -= 6;
    issues.push("存在超长句（>200 字符），建议拆分（-6）");
  }
  fidelity = Math.max(0, fidelity);
  fluency = Math.max(0, fluency);
  const score = fidelity + fluency;
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D";
  const text = [
    "# Translation quality: " + score + "/100 (" + grade + ")",
    "",
    "fidelity " + fidelity + "/60 | fluency " + fluency + "/40 | length ratio " + ratio.toFixed(2),
    "",
    issues.length === 0 ? "- 未发现明显问题" : issues.map((i) => "- " + i).join("\n"),
  ].join("\n");
  return { score, grade, fidelity, fluency, ratio: Math.round(ratio * 100) / 100, issues, text };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:71-79](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/index.js#L71-L79)

cwd缺失跳过包含检查。

```text
async function resolveFileTarget(ctx, file, cwd, signal) {
  const target = await ctx.fs.resolve(file, cwd !== undefined ? { cwd, signal } : { signal });
  if (cwd !== undefined) {
    const cwdTarget = await ctx.fs.resolve(".", { cwd, signal });
    if (!ctx.fs.contains(cwdTarget, target)) {
      throw new Error('translation: memo file "' + file + '" escapes the session workspace');
    }
  }
  return target;
```

**依据 4 · 源码核查**：[lib/index.js:161-170](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/index.js#L161-L170)

无显式版本读改写。

<details>
<summary>查看原文（10行）</summary>

```text
          const existing = info !== undefined ? await ctx.fs.readText(target, exec.signal) : "";
          if (action === "memo_get") {
            text = renderMemo({ text: existing, maxEntries: args.maxEntries });
          } else {
            const entry = buildMemoEntry({
              source: args.source, target: args.target, lang: args.lang,
              now: new Date().toISOString(),
            });
            const next = appendMemo({ existing, entry, maxEntries: maxMemoEntries });
            await ctx.fs.writeText(target, next, undefined, exec.signal);
```

</details>

#### 缺口

- 规则分与真实语义质量的相关性、并发写和缺cwd宿主行为未验证。
  **影响**：不能作自动翻译放行或共享工作区安全存储保证。
  **进一步探讨**：用独立人工标注的语义反例检验高分错误，并核对宿主fs版本/权限及并发两写的恢复路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程和阶段成本如何？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

纯函数模块不导入DSH，工具层只接线，这是可借鉴的分层；切段和记忆格式通过固定输入测试，方便维护规则边界。测试源码有切段长度和重拼全文断言，本轮只读未运行，不能证明语言效果。百分分项可解释但命名过强，需要在用户判断时保留“启发式筛查”语义。

首次成本是配置会话工作区、建立并确认术语/语体，默认不用额外服务；持续成本是文本扫描、Markdown文件读写、模型照表翻译和质检后的人工复核，词表上限意味着旧项裁剪可能需要外部备份。失败恢复需核对记忆被覆盖、清除错误译对、修复格式或在Git恢复文件，不应在quality高分后省略语义检查。没有工作负载/语言对质量和时间实测，不能从零独立API调用推断总费为零。

#### 证据与依据

**依据 1 · 源码核查**：[test/translation.test.mjs:1-35](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/test/translation.test.mjs#L1-L35)

纯函数导入和切段断言。

<details>
<summary>查看原文（35行）</summary>

```text
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  appendMemo,
  mergeToneEntry,
  parseToneMemory,
  removeToneEntry,
  renderToneMemory,
  scoreQuality,
  checkConsistency,
  mergeGlossaryEntry,
  parseGlossary,
  removeGlossaryEntry,
  renderGlossary,
  buildMemoEntry,
  extractTerms,
  qaCheck,
  renderMemo,
  segmentText,
  toneGuide,
} from "../lib/translation.js";

test("segmentText splits into bounded segments", () => {
  const segs = segmentText({ text: "One. Two. Three four five six.", maxLen: 12 });
  assert.ok(segs.length >= 2);
  assert.ok(segs.every((s) => s.text.length <= 12));
  assert.equal(segs[0].index, 1);
  assert.ok(segs.every((s) => s.text.length > 0));
});

test("segmentText preserves full text after rejoining", () => {
  const src = "Hello world. This is a longer sentence that should be split somewhere. Done!";
  const segs = segmentText({ text: src, maxLen: 30 });
  assert.equal(segs.map((s) => s.text).join(" "), src);
});
```

</details>

**依据 2 · 源码核查**：[lib/index.js:46-57](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/index.js#L46-L57)

三类容量与文件。

<details>
<summary>查看原文（12行）</summary>

```text
  /** Translation-memory file path, relative to the session workspace. */
  memoFile: z.string().default(".dsh/translation-memo.md"),
  /** Keep at most this many entries in the memory file. */
  maxMemoEntries: z.number().default(200),
  /** Glossary file path, relative to the session workspace. */
  glossaryFile: z.string().default(".dsh/translation-glossary.md"),
  /** Keep at most this many entries in the glossary file. */
  maxGlossaryEntries: z.number().default(200),
  /** Tone-memory file path, relative to the session workspace. */
  toneFile: z.string().default(".dsh/translation-tone.md"),
  /** Keep at most this many saved tone guides. */
  maxToneEntries: z.number().default(50),
```

</details>

**依据 3 · 源码核查**：[lib/translation.js:301-373](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/translation.js#L301-L373)

规则分结构清楚但不含语义检查。

<details>
<summary>查看原文（73行）</summary>

```text
/** Heuristic translation quality score (0-100) with fidelity/fluency breakdown. */
export function scoreQuality({ source = "", target = "", glossary = [] } = {}) {
  const src = String(source);
  const tgt = String(target);
  if (!src.trim() || !tgt.trim()) throw new Error("translation: source and target are required");
  const issues = [];
  let fidelity = 60;
  let fluency = 40;
  // 1. numbers preserved
  const srcNums = src.match(/\d+(?:[.,]\d+)?/g) || [];
  const tgtNums = new Set(tgt.match(/\d+(?:[.,]\d+)?/g) || []);
  const missingNums = srcNums.filter((n) => !tgtNums.has(n));
  if (missingNums.length > 0) {
    const p = Math.min(24, missingNums.length * 8);
    fidelity -= p;
    issues.push("数字缺失 " + missingNums.length + " 个：" + missingNums.slice(0, 5).join(", ") + "（-" + p + "）");
  }
  // 2. glossary compliance
  const gMiss = [];
  for (const g of (Array.isArray(glossary) ? glossary : [])) {
    if (!g || !g.source || !g.target) continue;
    if (src.includes(g.source) && !tgt.includes(g.target)) gMiss.push(g.source);
  }
  if (gMiss.length > 0) {
    const p = Math.min(18, gMiss.length * 6);
    fidelity -= p;
    issues.push("术语未按术语表翻译：" + gMiss.slice(0, 5).join(", ") + "（-" + p + "）");
  }
  // 3. length ratio sanity
  const ratio = src.length > 0 ? tgt.length / src.length : 1;
  if (ratio < 0.4 || ratio > 3) {
    fidelity -= 8;
    issues.push("长度比 " + ratio.toFixed(2) + " 异常（-8）");
  }
  // 4. untranslated leakage
  const srcCJK = /[\u4e00-\u9fff]/.test(src);
  const asciiRuns = tgt.match(/[A-Za-z]{4,}(?:\s+[A-Za-z]{2,}){2,}/g) || [];
  if (srcCJK && asciiRuns.length > 0) {
    fidelity -= 10;
    issues.push("目标语言中疑似未翻译片段：「" + asciiRuns[0].slice(0, 30) + "」（-10）");
  }
  // 5. sentence count parity
  const sSent = countSentences(src);
  const tSent = countSentences(tgt);
  if (sSent > 0 && Math.abs(sSent - tSent) / sSent > 0.5) {
    fluency -= 8;
    issues.push("句数不匹配（源 " + sSent + " / 译 " + tSent + "）（-8）");
  }
  // 6. doubled punctuation / spaces
  const doubles = (tgt.match(/[，。、；：,.;:]{2,}|\s{2,}/g) || []).length;
  if (doubles > 0) {
    const p = Math.min(12, doubles * 4);
    fluency -= p;
    issues.push("重复标点/空格 " + doubles + " 处（-" + p + "）");
  }
  // 7. over-long sentence
  const hasLong = tgt.split(/[.!?。！？]+/).some((s) => s.trim().length > 200);
  if (hasLong) {
    fluency -= 6;
    issues.push("存在超长句（>200 字符），建议拆分（-6）");
  }
  fidelity = Math.max(0, fidelity);
  fluency = Math.max(0, fluency);
  const score = fidelity + fluency;
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D";
  const text = [
    "# Translation quality: " + score + "/100 (" + grade + ")",
    "",
    "fidelity " + fidelity + "/60 | fluency " + fluency + "/40 | length ratio " + ratio.toFixed(2),
    "",
    issues.length === 0 ? "- 未发现明显问题" : issues.map((i) => "- " + i).join("\n"),
  ].join("\n");
  return { score, grade, fidelity, fluency, ratio: Math.round(ratio * 100) / 100, issues, text };
```

</details>

#### 缺口

- 缺少长文真实翻译中术语一致率、漏译/误译和人工复核时间对照。
  **影响**：无法量化比普通提示+外部术语表的净收益。
  **进一步探讨**：固定语言对与确认术语，对照有/无工具的独立合格译文、总token和复核时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可推导何种改进，当前怎样采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是把规则筛查与语义验收分开输出，保留规则命中原文位置而不汇成误导性总体准确分，并对人工确认译对建立来源/版本和撤回失效关系。推导来自当前高分可漏语义错和记忆无确认状态。最小验证用否定翻反、数字正确但无关、正确意译和术语变体的固定样例，对比当前grade与分层报告能否降低错误放行；若只是多一层模型自评而没有独立标签支持，不应升级为可靠验收。

建议单用户明确cwd、可备份术语文件的项目试用切段/规则筛查/记忆，不用于无人复核高风险翻译。先确认目录与容量、串行修改记忆，并以人工语义检查为最终标准；出现高分严重误译、共享并发覆盖或文件范围不清时停止自动写库，回外部表格/版本化词表。当前试用判断来自低成本可控辅助价值，不把研究范围外宿主运行当产品缺陷。

#### 证据与依据

**依据 1 · 源码核查**：[lib/translation.js:301-340](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/translation.js#L301-L340)

分层规则与语义区分的推导起点。

<details>
<summary>查看原文（40行）</summary>

```text
/** Heuristic translation quality score (0-100) with fidelity/fluency breakdown. */
export function scoreQuality({ source = "", target = "", glossary = [] } = {}) {
  const src = String(source);
  const tgt = String(target);
  if (!src.trim() || !tgt.trim()) throw new Error("translation: source and target are required");
  const issues = [];
  let fidelity = 60;
  let fluency = 40;
  // 1. numbers preserved
  const srcNums = src.match(/\d+(?:[.,]\d+)?/g) || [];
  const tgtNums = new Set(tgt.match(/\d+(?:[.,]\d+)?/g) || []);
  const missingNums = srcNums.filter((n) => !tgtNums.has(n));
  if (missingNums.length > 0) {
    const p = Math.min(24, missingNums.length * 8);
    fidelity -= p;
    issues.push("数字缺失 " + missingNums.length + " 个：" + missingNums.slice(0, 5).join(", ") + "（-" + p + "）");
  }
  // 2. glossary compliance
  const gMiss = [];
  for (const g of (Array.isArray(glossary) ? glossary : [])) {
    if (!g || !g.source || !g.target) continue;
    if (src.includes(g.source) && !tgt.includes(g.target)) gMiss.push(g.source);
  }
  if (gMiss.length > 0) {
    const p = Math.min(18, gMiss.length * 6);
    fidelity -= p;
    issues.push("术语未按术语表翻译：" + gMiss.slice(0, 5).join(", ") + "（-" + p + "）");
  }
  // 3. length ratio sanity
  const ratio = src.length > 0 ? tgt.length / src.length : 1;
  if (ratio < 0.4 || ratio > 3) {
    fidelity -= 8;
    issues.push("长度比 " + ratio.toFixed(2) + " 异常（-8）");
  }
  // 4. untranslated leakage
  const srcCJK = /[\u4e00-\u9fff]/.test(src);
  const asciiRuns = tgt.match(/[A-Za-z]{4,}(?:\s+[A-Za-z]{2,}){2,}/g) || [];
  if (srcCJK && asciiRuns.length > 0) {
    fidelity -= 10;
    issues.push("目标语言中疑似未翻译片段：「" + asciiRuns[0].slice(0, 30) + "」（-10）");
```

</details>

**依据 2 · 源码核查**：[lib/index.js:161-170](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/index.js#L161-L170)

写库缺少显式确认/版本状态。

<details>
<summary>查看原文（10行）</summary>

```text
          const existing = info !== undefined ? await ctx.fs.readText(target, exec.signal) : "";
          if (action === "memo_get") {
            text = renderMemo({ text: existing, maxEntries: args.maxEntries });
          } else {
            const entry = buildMemoEntry({
              source: args.source, target: args.target, lang: args.lang,
              now: new Date().toISOString(),
            });
            const next = appendMemo({ existing, entry, maxEntries: maxMemoEntries });
            await ctx.fs.writeText(target, next, undefined, exec.signal);
```

</details>

#### 缺口

- 分层报告与译对确认/失效方案没有独立语言质量对照。
  **影响**：只能提出改进假设，不能计入已有贡献。
  **进一步探讨**：使用独立标注反例与已确认词表，比较错放行和复核成本。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
