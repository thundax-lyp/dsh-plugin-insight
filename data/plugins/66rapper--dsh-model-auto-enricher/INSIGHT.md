# dsh-model-auto-enricher

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[db011fe](https://github.com/66rapper/dsh-model-auto-enricher/tree/db011fe106a4d12b9c23128ac4ead3f1705b6fcd)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/66rapper/dsh-model-auto-enricher)
<!-- END META -->

> **功能**：按名称规则批量补齐DSH模型配置，提供预览、自动写入、备份和停用入口。

> **亮点**：集中批量diff、四字段补齐、预览/备份和状态，降低入口切换；不扩展服务端能力。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：2.3.0虽加例外/白名单，未知仍1M/image且默认自动直接写，无源版本保护，值真实性和恢复未闭环。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 批量补齐减少谁的什么工作？](#detail-section-11)
  - [Q02 · 新版例外、未知回退与保留策略如何工作？](#detail-section-12)
  - [Q03 · 自动触发、身份审计与停用/备份提供什么保证？](#detail-section-13)
  - [Q04 · 先备什么，怎样有限验证与算成本效果？](#detail-section-14)
  - [Q05 · 默认模式值得用吗，怎样改才可证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护大量渠道模型的重复配置，合格结果看真实请求和可恢复配置而非字段数。见[Q01](#research-q01)。

原生逐项配置较慢但直接选择真实规格；插件减少点击，不减少规格依据需求。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 名称规则/例外 | 批量规划四字段 | 未知1M/image不等真实能力；不纠旧错 |
| inspect/dryRun | 审逐字段diff | 只读零写，仍需上游依据 |
| 自动/手动run | 写模型配置 | 默认auto开，直接覆盖无CAS，共锁不完整 |
| 标识保护 | 避免常规name/id写入 | 四字段白名单真实，审计不是原件全量diff |
| 备份轮转 | 保留回退副本 | 秒级命名、保留20，非并发/崩溃保证 |
| self-disable | 只改patch保留bundles | UI二次点击，宿主HMR/普通写回另验 |

**流程与依赖**

Web宿主、目标profile读写和可装载js-yaml；必须另有真实规格依据。表见[Q04](#research-q04)。

真实profile不开默认自动链；复制profile先关autoWatch并只读diff，逐项验真后再评写入/恢复。步骤见[Q04](#research-q04)。

**效果与成本**

自动字段数不是净收益，须计真实能力测试、旧错误与备份/并发恢复。完整表见[Q04](#research-q04)。

批量规划便利可研究，不能从无待补项推模型最新最优；默认模式负担压过已证便利。见[Q05](#research-q05)。

> **思考**：2.3.0虽加例外/白名单，未知仍1M/image且默认自动直接写，无源版本保护，值真实性和恢复未闭环。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：集中批量diff、四字段补齐、预览/备份和状态，降低入口切换；不扩展服务端能力。见[Q01](#research-q01)、[Q02](#research-q02)。

承认非聊天/GPT-OSS例外、推理关键词收窄和白名单/停用；原件身份审计、版本写回和规格来源仍需完善。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

2.3.0虽加例外/白名单，未知仍1M/image且默认自动直接写，无源版本保护，值真实性和恢复未闭环。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

不推荐默认自动；只读/复制profile研究不等真实渠道可靠采用。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持批量规划/预览和新保护，但不能认证真实规格；不推荐默认自动写入，复制profile只读研究有明确边界。

- 已检查：作者 README、包清单、源码路径 README.zh.md、lib/client.js、lib/core.js、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定2.3.0 README/package、core名称/例外/档位/白名单、读取/审计/预览/写回/轮转/停用，host路由来源门/自动事件及client停用交互；未完整审所有系列规格、UI/宿主HMR或真实模型请求。
- 下一步：未执行目标、写用户配置或调用模型；加载为范围边界，规格、并发/停用/恢复与净成本为实质缺口。

**分析版本**

- **仓库**：[66rapper/dsh-model-auto-enricher](https://github.com/66rapper/dsh-model-auto-enricher)
- **版本号**：2.3.0（[固定提交 db011fe](https://github.com/66rapper/dsh-model-auto-enricher/tree/db011fe106a4d12b9c23128ac4ead3f1705b6fcd)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

保守未知、逐项来源批准与原件身份/版本安全发布，是否减少误赋能和总核验成本待验证。见[Q05](#research-q05)。

未执行目标、写用户配置或调用模型；加载为范围边界，规格、并发/停用/恢复与净成本为实质缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 437 | — | — | 6095 |
| .js | source | 3 | 2401 | 1910 | 328 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/66rapper/dsh-model-auto-enricher/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/66rapper/dsh-model-auto-enricher/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/66rapper/dsh-model-auto-enricher/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：批量补齐有无真实能力依据，默认自动写入能否保持配置语义并可靠恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 批量补齐减少谁的什么工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向维护大量DSH渠道模型、反复填写窗口、最大输出、输入模态和推理档位的用户。相对逐模型点设置，插件集中展示差异、只读预览、备份和批量写入；本身按本地名称规则处理，不向上游验证规格，也不扩展实际服务能力。

合格交付是节省配置步骤同时保持模型真实可用、用户标识和YAML语义，不让界面出现服务并不支持的图像/档位/上下文。README的“全部拉满/全自动”不能当规格证据。报告固定2.3.0，旧2.0.0的通用推理兜底和无白名单结论已更新；新防护需要承认，不能仍写所有未知名称都必加推理。

批量规划可带来入口便利，但错误配置会把原本少量点击移成逐模型能力验证和恢复。用途明确不等默认自动模式值得采用。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:7-29](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/README.zh.md#L7-L29)

作者配置摩擦和拉满宣称。

<details>
<summary>查看原文（23行）</summary>

```text
## 😫 为什么做这个插件？（真实痛点）

在 DSH 里每添加一个新的中转站或第三方 API 渠道，里面往往有十几个甚至几十个模型。
但是在 DSH 默认设置界面里，拉取或添加完模型后，**每一个模型都得你自己手动点开去调**：
- 要一个个手填 **上下文窗口**（默认是空的，或者被限制在 128k / 200k，不改很快就会爆上下文）；
- 要一个个手填 **最大输出 Token**（默认是空的）；
- 要一个个手动勾选 **「图片」多模态开关**（默认只勾了纯文本，不勾根本发不了截图）；
- 要一个个手动打开 **「推理等级」开关** 并添加 `max` 档位（默认没开，开了也只有 `low / medium / high`，没有最高 `max` 档）。

**十几个模型一个个点开改下来，又麻烦又累；以后每次往渠道里新加一两个模型，还得再重复折腾一遍！**

装上 **「DSH 模型补齐助手」** 后：
👉 **你只需要在设置里把渠道和模型加进去、点一下保存，剩下的调上下文（100 万）、开多模态发图、配思考强度档位（`low / high / max`）全部由插件在后台自动帮你一次性搞定！**

---

## 🛠️ 具体帮你省掉哪些手动操作？

| 你以前要手动挨个调的项 | DSH 默认刚加进来时 | 装上本插件后（全自动） |
|---|---|---|
| **1. 调上下文容量** | 空白未填，或被截断在 `128k` / `200k` / `256k` | 自动全部拉满到 **100 万长上下文（`1,000,000`）** |
| **2. 调最大输出** | 空白未填 | 自动按系列补齐 **`64,000` / `128,000`** 最大输出 |
| **3. 调多模态（发图）** | 默认只勾了「文本」，聊天框发不了图 | 自动为所有模型勾选 **「文本 + 图片」（`[text, image]`）** |
```

</details>

**依据 2 · 源码核查**：[package.json:2-5](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/package.json#L2-L5)

实际2.3.0。

```text
  "name": "dsh-model-auto-enricher",
  "version": "2.3.0",
  "description": "DSH 模型补齐助手：彻底解决在 DSH 添加新模型渠道后，还要把几十个模型一个个手动点开调上下文、勾多模态发图、配思考强度档位（low/high/max）的繁琐痛点；支持新加模型保存即自动补齐与一键批量补齐，写前自动时间戳备份。Model channel auto-enricher for DeepSeek Harness — eliminates manually configuring context windows, image input and reasoning effort tiers model by model.",
  "license": "MIT",
```

**依据 3 · 源码核查**：[lib/core.js:562-578](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L562-L578)

名称/id规则而非提供方能力查询。

<details>
<summary>查看原文（17行）</summary>

```text
export function planModel(providerId, model, apply = false) {
  const mutable = isPlainObject(model) ? model : {};
  const id = typeof mutable.id === 'string' ? mutable.id : String(mutable.id ?? '');
  const name = typeof mutable.name === 'string' ? mutable.name : '';
  const key = `${id} ${name}`.toLowerCase();

  // 优先匹配已知系列规则；若为全新/未知代号模型，自动落入 FALLBACK_SERIES_RULE 全量兜底规则
  const matchedSeries = SERIES_RULES.find((rule) => rule.test.test(key)) ?? null;
  const series = matchedSeries ?? FALLBACK_SERIES_RULE;
  // 专用向量/语音模型（embed / rerank / bge / whisper / tts / asr）不是对话模型：
  // 上下文窗口、最大输出、思考档位全部无意义，1M 上下文和 reasoningEfforts 纯属污染。
  // 只保留 input 归一（确保是纯文本），其余一律不补。
  const isNonChat = series.id === 'non-chat';
  const targetContext = isNonChat ? null : numOrNull(pickValue(series.contextWindow, key));
  const targetMaxTokens = isNonChat ? null : numOrNull(pickValue(series.maxTokens, key));
  const targetInput = Array.isArray(series.input) ? series.input.slice() : null;
  const seriesWantsReasoning = !isNonChat && matchReasoning(series.reasoning, key);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:210-217](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/index.js#L210-L217)

手动preview/run入口。

```text
      // POST /api/model-enricher/run
      if (segments[0] === 'run') {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: `method not allowed: ${req.method}` });
          return;
        }
        const body = await readJsonBody(req);
        const result = await runEnrich({ file: configuredFile, dryRun: body.dryRun === true });
```

#### 缺口

- 缺同模型集的真实规格正确率、请求成功和总人工对照。
  **影响**：不能把字段写入当能力已开放或净省时。
  **进一步探讨**：用已核能力的复制profile对照原生设置，记录误赋能、请求成功与全部验证时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 新版例外、未知回退与保留策略如何工作？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

planModel把id+name转小写，按系列规则首个命中；2.3.0新增优先GPT-OSS和non-chat例外，专用向量/语音不从空白补窗口/输出/推理，GPT-OSS不走通用图片/思考地板。这比旧版激进兜底有所收窄，但仍以名称推断，别名或代理不保证等于实际能力。

未知普通名称仍落universal：默认1M上下文、64k输出和text/image。推理现在只认thinking/reasoner/-r1/-r2/-high/-max等强特征或已有reasoning，不再因裸pro/preview等普遍开启；README“全部模型完整三档”比代码更强。

已有窗口/输出只升不降，input并集保留，已有reasoning会补low/high/max并保留自定义。新增non-chat例外并不修复旧版已写入的过大数值/图片；即使专用模型已有reasoning，alreadyHasReasoning仍可能补标准档。也就是说这是补齐器，不是迁移纠错器；不能因“保留原值”就认为保留了正确规格。

写入白名单确实仅允许contextWindow/maxTokens/input/reasoningEfforts，阻止常规引擎主动改name/id。但字段范围正确与字段值真实是两种验收；没有远端探测/协商证据，未知模型不能凭默认值当旗舰。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:64-67](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L64-L67)

默认1M上下文与64k输出常量。

```text
export const DEFAULT_CONTEXT_CAP = 1000000;

/** 通用最大输出兜底上限。 */
export const DEFAULT_MAX_TOKENS = 64000;
```

**依据 2 · 源码核查**：[lib/core.js:80-118](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L80-L118)

四字段白名单和优先例外。

<details>
<summary>查看原文（39行）</summary>

```text
export const WRITABLE_FIELDS = new Set(['contextWindow', 'maxTokens', 'input', 'reasoningEfforts']);

/** 自动补齐备份的保留份数（只轮转 `.bak-auto-enrich-*`，人工留痕不动）。 */
export const BACKUP_KEEP = 20;

/** 模态的规范输出顺序（合并后按此排序，保证幂等与可读性）。 */
export const CANONICAL_MODALITIES = ['text', 'image', 'audio', 'video', 'pdf'];

/* ------------------------------------------------------------------ 规则矩阵 */

/**
 * 系列规则矩阵。按序匹配 `id + ' ' + name` 的小写拼接串，**命中即停**，
 * 因此顺序有意义：`gpt-oss` 与 `non-chat` 必须放在最前。
 *
 * 字段语义：
 *  - `test`          命中该系列的正则
 *  - `contextWindow` 目标上下文（number 或 `(key) => number`）
 *  - `maxTokens`     目标最大输出（number 或 `(key) => number`）
 *  - `input`         目标模态（与现有模态取并集，绝不删减已有模态）
 *  - `reasoning`     boolean / RegExp / `(key) => boolean`，命中即要求补齐 reasoningEfforts
 */
export const SERIES_RULES = [
  {
    id: 'gpt-oss',
    label: 'GPT 开源版',
    test: /gpt-oss/,
    contextWindow: 128000,
    maxTokens: 64000,
    input: ['text'],
    reasoning: null,
  },
  {
    id: 'non-chat',
    label: '专用向量/语音模型',
    test: /\b(embed|embedding|rerank|reranker|bge-|whisper|tts|asr)\b/,
    contextWindow: null,
    maxTokens: null,
    input: ['text'],
    reasoning: null,
```

</details>

**依据 3 · 源码核查**：[lib/core.js:205-234](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L205-L234)

universal及收窄推理关键词。

<details>
<summary>查看原文（30行）</summary>

```text
 */
export const FALLBACK_SERIES_RULE = {
  id: 'universal',
  label: '通用新模型规则',
  contextWindow: DEFAULT_CONTEXT_CAP,
  maxTokens: DEFAULT_MAX_TOKENS,
  input: ['text', 'image'],
  // 与 UNIVERSAL_RULES.thinking 同口径：只认强特征词。裸 `pro` / `max` / `preview`
  // 会让 `some-pro-model` 这类普通模型被误判成推理模型（实测已复现）。
  reasoning: (key) =>
    /\bthinking\b|reasoner|-r1\b|-r2\b|-high$|-max$/.test(key) &&
    !/\blite\b|-lite|\bimage\b|-image|\bembed|\brerank|\bwhisper|\btts|\basr/.test(key),
};

/**
 * 通用底线规则（作用于任何系列，包括未命中任何系列规则的模型）。
 *  - `modality` 命中 → 保证 `input` 含 `image`
 *  - `thinking` 命中 → 保证 `reasoningEfforts` 含 `{ low, high, max }` 且保留自定义档位
 *  - 上下文底线见 `planModel()`：缺失或 ≤ CONTEXT_FLOOR 时按「规则上限」突破，
 *    且已有更大值绝不回退。
 *
 * 注意 `thinking` 必须只放**强特征词**：早期版本收过裸 `pro` / `max` / `preview`，
 * 结果 `some-pro-model`、`my-max-tokenizer`、`preview-endpoint` 这类非推理模型
 * 全被塞上思考档位（实测已复现）。系列自身的 `reasoning` 正则已经覆盖各自代际，
 * 这里只兜底「明确说自己会思考」的模型。
 */
export const UNIVERSAL_RULES = {
  modality: /vl|vision|image|multimodal/,
  thinking: /\bthinking\b|reasoner|-r1\b|-r2\b|\bqwq\b|-high$|-max$|thinking-/,
};
```

</details>

**依据 4 · 源码核查**：[lib/core.js:562-580](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L562-L580)

名称匹配/非聊天目标与地板例外。

<details>
<summary>查看原文（19行）</summary>

```text
export function planModel(providerId, model, apply = false) {
  const mutable = isPlainObject(model) ? model : {};
  const id = typeof mutable.id === 'string' ? mutable.id : String(mutable.id ?? '');
  const name = typeof mutable.name === 'string' ? mutable.name : '';
  const key = `${id} ${name}`.toLowerCase();

  // 优先匹配已知系列规则；若为全新/未知代号模型，自动落入 FALLBACK_SERIES_RULE 全量兜底规则
  const matchedSeries = SERIES_RULES.find((rule) => rule.test.test(key)) ?? null;
  const series = matchedSeries ?? FALLBACK_SERIES_RULE;
  // 专用向量/语音模型（embed / rerank / bge / whisper / tts / asr）不是对话模型：
  // 上下文窗口、最大输出、思考档位全部无意义，1M 上下文和 reasoningEfforts 纯属污染。
  // 只保留 input 归一（确保是纯文本），其余一律不补。
  const isNonChat = series.id === 'non-chat';
  const targetContext = isNonChat ? null : numOrNull(pickValue(series.contextWindow, key));
  const targetMaxTokens = isNonChat ? null : numOrNull(pickValue(series.maxTokens, key));
  const targetInput = Array.isArray(series.input) ? series.input.slice() : null;
  const seriesWantsReasoning = !isNonChat && matchReasoning(series.reasoning, key);
  const modalityFloor = series.id !== 'gpt-oss' && !isNonChat && UNIVERSAL_RULES.modality.test(key);
  const thinkingFloor = series.id !== 'gpt-oss' && !isNonChat && UNIVERSAL_RULES.thinking.test(key);
```

</details>

**依据 5 · 源码核查**：[lib/core.js:598-653](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L598-L653)

数值只升/模态并集/已有推理补档。

<details>
<summary>查看原文（56行）</summary>

```text
  /* --- 1) contextWindow：只升不降；缺失补齐；≤ 地板或低于目标上限时自动拉升 --- */
  // `non-chat` 专用模型（embed / rerank / whisper …）不做上下文兜底：给 embedding
  // 写 1M 上下文是纯噪音，且会掩盖真实配置缺口。
  let nextContext = before.contextWindow;
  if (isNonChat) {
    nextContext = before.contextWindow;
  } else if (before.contextWindow === null) {
    nextContext = targetContext ?? DEFAULT_CONTEXT_CAP;
  } else if (targetContext !== null) {
    nextContext = Math.max(targetContext, before.contextWindow);
  }
  if (nextContext !== before.contextWindow) {
    push('contextWindow', '上下文窗口', before.contextWindow, nextContext);
  }

  /* --- 2) maxTokens：同样只升不降，未知新模型兜底补齐 64,000 --- */
  let nextMaxTokens = before.maxTokens;
  if (before.maxTokens === null) {
    nextMaxTokens = targetMaxTokens;
  } else if (targetMaxTokens !== null) {
    nextMaxTokens = Math.max(targetMaxTokens, before.maxTokens);
  }
  if (nextMaxTokens !== before.maxTokens) {
    push('maxTokens', '最大输出', before.maxTokens, nextMaxTokens);
  }

  /* --- 3) input：并集补齐（绝不删减已有模态），保证多模态底线 --- */
  const desired = [];
  if (targetInput) desired.push(...targetInput);
  if (modalityFloor) desired.push('image');
  let nextInput = before.input;
  if (desired.length > 0) {
    const merged = before.input ? before.input.slice() : [];
    for (const modality of desired) if (!merged.includes(modality)) merged.push(modality);
    const canonical = sortedModalities([...new Set(merged)]);
    if (!sameStringArray(canonical, before.input ?? [])) nextInput = canonical;
  }
  if (!sameStringArray(nextInput ?? [], before.input ?? [])) {
    push('input', '模态支持', before.input, nextInput);
  }

  /* --- 4) reasoningEfforts：补齐 { low, high, max }，保留已有自定义档位 --- */
  const wantsReasoning = alreadyHasReasoning || seriesWantsReasoning || thinkingFloor;
  let nextReasoning = before.reasoningEfforts;
  const addedTiers = [];
  if (wantsReasoning) {
    const merged = before.reasoningEfforts ? { ...before.reasoningEfforts } : {};
    for (const tier of REASONING_TIERS) {
      if (!Object.prototype.hasOwnProperty.call(merged, tier)) {
        merged[tier] = tier;
        addedTiers.push(tier);
      }
    }
    if (addedTiers.length > 0) nextReasoning = merged;
  }
  if (addedTiers.length > 0) {
```

</details>

**依据 6 · 源码核查**：[lib/core.js:662-672](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L662-L672)

实际白名单逐项写回。

<details>
<summary>查看原文（11行）</summary>

```text
  if (apply && changes.length > 0) {
    for (const change of changes) {
      if (!WRITABLE_FIELDS.has(change.field)) {
        throw new Error(
          `dsh-model-auto-enricher 内部约束被破坏：试图写入不可写字段 "${change.field}"` +
            `（模型 "${id}"）。允许写入的字段只有 ${[...WRITABLE_FIELDS].join(' / ')}。` +
            `本插件绝不主动写模型展示名 name。`,
        );
      }
      mutable[change.field] = change.to;
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动触发、身份审计与停用/备份提供什么保证？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

autoWatch默认开，启动500ms、模型设置后650ms、reload后800ms可真实写配置，不必用户先点补齐。inspect/dryRun不写、没有变更就跳过；真实路径读入后在同一data上apply，秒级备份、序列化并覆盖，成功后自动备份轮转保留20份。顶部注释块被保留，主体dump会重排，不能称逐字保真。

新增身份审计值得承认，但边界具体：它比较apply后的ctx.data与重解析文本，主要约束序列化一致性；索引按provider+id建立，after找不到旧key会continue，所以不是覆盖ID更换/增删所有情况的独立原件diff。当前四字段白名单阻止正常路径改标识，本轮未发现实际name/id被改，不把审计边界写成已发生标识损坏。

真实写仍writeFileSync直接覆盖，无源版本/hash比较或临时rename；自动running只包自动链，手动run和self-disable未共用该锁。读到写间若外部保存可覆盖新配置，秒级同名备份也可能相撞；20份轮转不修复竞态。

新版提供self-disable：只改本插件patch disabled行、备份并reload，保留package.json bundles；客户端二次点击防误触。这是作者针对bundle/patch停用问题的回退路径，不把作者所报市场故障或零重启当本轮验证。停用也走同样非事务YAML覆盖，需保留现场核读回。

路由检查loopback socket/Host与Origin/Fetch-site，缺Origin允许；这是本机来源围栏而非账户认证。目标配置由插件file/路径解析决定，预览先核实际file。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:273-287](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/index.js#L273-L287)

默认autoWatch与无Web服务跳过。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx, config = {}) {
  const log = loggerOf(ctx);
  const webServer = readService(ctx, 'webServer');
  const configuredFile = typeof config?.file === 'string' && config.file.trim() ? config.file.trim() : undefined;
  const autoWatch = config?.autoWatch !== false;

  const state = {
    autoWatch,
    lastAutoEnrich: null,
    running: false,
  };

  if (!webServer || typeof webServer.register !== 'function') {
    log.warn?.(`[${PLUGIN_ID}] webServer 服务不可用：跳过 ${API_PREFIX} 路由注册`);
    return;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:293-319](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/index.js#L293-L319)

自动链锁与实际写。

<details>
<summary>查看原文（27行）</summary>

```text
  async function checkAndAutoEnrich(trigger) {
    if (!state.autoWatch || state.running) return;
    state.running = true;
    try {
      const status = await inspectConfig({ file: configuredFile });
      if (status && status.pendingCount > 0) {
        log.info?.(
          `[${PLUGIN_ID}] 检测到新加入或待优化的模型（触发源: ${trigger}，共 ${status.pendingModelCount} 个模型 / ${status.pendingCount} 处），正在自动智能补齐...`,
        );
        const result = await runEnrich({ file: configuredFile, dryRun: false });
        if (result.changed) {
          state.lastAutoEnrich = {
            at: new Date().toISOString(),
            trigger,
            changedCount: result.changedCount,
            changedModelCount: result.changedModelCount,
            backupPath: result.backupPath,
            summary: result.summary,
          };
          log.info?.(`[${PLUGIN_ID}] 自动补齐完成：${result.summary}`);
          await notifyHostConfigReload(ctx);
        }
      }
    } catch (error) {
      log.warn?.(`[${PLUGIN_ID}] 自动巡检补齐失败（${trigger}）：${error instanceof Error ? error.message : String(error)}`);
    } finally {
      state.running = false;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:343-363](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/index.js#L343-L363)

事件延迟与启动巡检。

<details>
<summary>查看原文（21行）</summary>

```text
    // 监听设置页保存事件（当用户在「模型」设置页新增或修改模型时，ns === 'llm-pi-ai'）
    try {
      if (typeof ctx.on === 'function') {
        const offSettings = ctx.on('settings/document-updated', (ns) => {
          if (!ns || String(ns).startsWith('llm')) {
            scheduleAutoEnrich(`settings/document-updated(${ns})`, 650);
          }
        });
        if (typeof offSettings === 'function') disposers.push(offSettings);

        const offReload = ctx.on('app-boot/config-reload', () => {
          scheduleAutoEnrich('app-boot/config-reload', 800);
        });
        if (typeof offReload === 'function') disposers.push(offReload);
      }
    } catch (error) {
      log.warn?.(`[${PLUGIN_ID}] 注册配置变更监听失败：${error instanceof Error ? error.message : String(error)}`);
    }

    // 插件挂载后做一次初始巡检，若当前已有未补齐的新模型则立即自动补齐
    scheduleAutoEnrich('plugin-startup', 500);
```

</details>

**依据 4 · 源码核查**：[lib/core.js:840-913](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L840-L913)

预览/原地apply/备份/审计/直接写及20份轮转。

<details>
<summary>查看原文（74行）</summary>

```text
 * 无变更时不写盘、不备份，返回 `changed: false`。
 */
export async function runEnrich(options = {}) {
  const dryRun = options.dryRun === true;
  const ctx = await readConfig(options.file);
  const analysis = analyze(ctx.data, false);

  const base = {
    ok: true,
    engine: PLUGIN_ID,
    engineVersion: ENGINE_VERSION,
    file: ctx.file,
    dryRun,
    providerCount: analysis.providerCount,
    modelCount: analysis.modelCount,
    changedCount: analysis.changes.length,
    changedModelCount: analysis.modelReports.filter((r) => r.needsEnrich).length,
    changes: analysis.changes,
    providers: analysis.providers,
  };

  if (analysis.changes.length === 0) {
    return {
      ...base,
      changed: false,
      backupPath: null,
      bytesBefore: Buffer.byteLength(ctx.raw, 'utf8'),
      bytesAfter: Buffer.byteLength(ctx.raw, 'utf8'),
      summary: '✨ 所有模型规格已是最新最优状态，无需修改！',
    };
  }

  if (dryRun) {
    return {
      ...base,
      changed: false,
      backupPath: null,
      bytesBefore: Buffer.byteLength(ctx.raw, 'utf8'),
      bytesAfter: null,
      summary:
        `🔍 预览模式（零写入）：共发现 ${analysis.changes.length} 处可补齐项，` +
        `涉及 ${base.changedModelCount} 个模型；未生成备份、未改动任何字节。`,
    };
  }

  // 真实写入路径：重新在 apply 模式下规划（同一份 data 就地补齐）+ 写前备份
  const applied = analyze(ctx.data, true);
  if (applied.changes.length === 0) {
    return { ...base, changed: false, backupPath: null, summary: '✨ 无需修改（二次规划为空，已跳过写入）。' };
  }

  const backupPath = `${ctx.file}.bak-auto-enrich-${timestamp()}`;
  copyFileSync(ctx.file, backupPath);

  const next = serializeConfig(ctx.header, ctx.data, ctx.yaml);

  // 写盘前的最后一道审计：逐模型比对「原文件解析结果」与「即将写出的对象」，
  // 只要有任何模型的 `name` / `id` 发生变化就立刻中止（此时备份已生成、尚未写盘，
  // 中止是安全的）。这是给未来迭代上的保险栓：即便有人给 changes 加了新字段，
  // 也不可能把展示名悄悄写进用户配置。
  const tampered = auditImmutableIdentity(ctx.data, next, ctx.yaml);
  if (tampered.length > 0) {
    throw new Error(
      `dsh-model-auto-enricher 写盘前审计失败：检测到 ${tampered.length} 处模型标识被改动 ` +
        `(${tampered.slice(0, 5).map((t) => `${t.provider}/${t.id}: ${t.field}`).join(', ')}` +
        `)。本插件绝不写 name / id，已中止写入，原配置未受影响。备份：${backupPath}`,
    );
  }

  writeFileSync(ctx.file, next, 'utf8');

  // 备份轮转：只裁剪本引擎自己生成的 .bak-auto-enrich-*，保留最近 20 个。
  // 人工留痕（bak-self-toggle / bak-removename 等）不动。
  const prunedBackups = pruneBackups(ctx.file, { keep: BACKUP_KEEP });
```

</details>

**依据 5 · 源码核查**：[lib/core.js:483-508](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L483-L508)

审计按新id查旧key，未命中跳过。

<details>
<summary>查看原文（26行）</summary>

```text
  // 建立 provider/model 两级的原值索引
  const beforeIndex = new Map();
  for (const { providerId, provider } of iterateProviders(beforeData)) {
    const models = Array.isArray(provider.models) ? provider.models : [];
    for (const model of models) {
      if (!isPlainObject(model)) continue;
      beforeIndex.set(`${providerId}\u0000${model.id}`, {
        id: model.id,
        name: model.name,
      });
    }
  }

  for (const { providerId, provider } of iterateProviders(afterData)) {
    const models = Array.isArray(provider.models) ? provider.models : [];
    for (const model of models) {
      if (!isPlainObject(model)) continue;
      const key = `${providerId}\u0000${model.id}`;
      const before = beforeIndex.get(key);
      if (!before) continue; // 新增/删除模型不归本审计管（本引擎从不增删模型）
      if (String(before.id) !== String(model.id)) {
        violations.push({ provider: providerId, id: String(before.id), field: 'id' });
      }
      if (String(before.name ?? '') !== String(model.name ?? '')) {
        violations.push({ provider: providerId, id: String(before.id), field: 'name' });
      }
```

</details>

**依据 6 · 源码核查**：[lib/core.js:276-282](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L276-L282)

秒级时间戳。

```text
export function timestamp(date = new Date()) {
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return (
    `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}` +
    `-${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`
  );
}
```

**依据 7 · 源码核查**：[lib/core.js:394-415](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L394-L415)

顶部注释拆分与YAML dump。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * 拆出文件顶部的注释块（含紧邻空行），与其余 YAML 主体。
 * 主体之外的一切字节都由这里原样保留 —— 注释头部保真的唯一实现点。
 */
export function splitCommentHeader(raw) {
  const lines = String(raw).split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (trimmed === '' || trimmed.startsWith('#')) i += 1;
    else break;
  }
  return { header: lines.slice(0, i).join('\n'), body: lines.slice(i).join('\n') };
}

/**
 * 用 js-yaml 序列化 YAML 主体，并回贴注释头部。
 * dump 选项与验证过的往返无损配置逐字一致（`indent: 2` / `lineWidth: -1` / `noRefs: true`）。
 */
export function serializeConfig(header, data, yaml) {
  const dumped = yaml.dump(data, { indent: 2, lineWidth: -1, noRefs: true });
  const body = dumped.endsWith('\n') ? dumped : `${dumped}\n`;
```

</details>

**依据 8 · 源码核查**：[lib/index.js:210-217](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/index.js#L210-L217)

手动写直接调用。

```text
      // POST /api/model-enricher/run
      if (segments[0] === 'run') {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: `method not allowed: ${req.method}` });
          return;
        }
        const body = await readJsonBody(req);
        const result = await runEnrich({ file: configuredFile, dryRun: body.dryRun === true });
```

**依据 9 · 源码核查**：[lib/core.js:947-1002](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L947-L1002)

self-toggle patch更新与备份/覆盖。

<details>
<summary>查看原文（56行）</summary>

```text
export async function setSelfDisabled(disabled, options = {}) {
  const next = disabled === true;
  const ctx = await readConfig(options.file);
  const rows = Array.isArray(ctx.data) ? ctx.data : [];
  const matches = rows.filter((row) => row && row.id === PLUGIN_ID);
  const pureMarker = (row) => Object.keys(row).every((key) => key === 'id' || key === 'disabled');

  let changed = false;

  if (matches.length === 0) {
    if (next) {
      rows.push({ id: PLUGIN_ID, disabled: true });
      changed = true;
    }
  } else if (next) {
    for (const row of matches) {
      if (row.disabled !== true) {
        row.disabled = true;
        changed = true;
      }
    }
  } else {
    // 先标记、后重建：`for-of` 遍历的是 filter 快照，边遍历边 splice 会让索引前移，
    // 连续多个 pureMarker 行时只删掉一半（实测 3 个只删 2 个），残留行会重新引出
    // `no loader entry matched`。这里改为一次性 filter 重建，语义确定。
    const removed = [];
    for (const row of matches) {
      if (pureMarker(row)) {
        removed.push(row);
      } else if (row.disabled !== false) {
        row.disabled = false;
        changed = true;
      }
    }
    if (removed.length > 0) {
      const kept = rows.filter((row) => !removed.includes(row));
      rows.length = 0;
      rows.push(...kept);
      changed = true;
    }
  }

  if (!changed) {
    return {
      ok: true,
      changed: false,
      disabled: next,
      backupPath: null,
      file: ctx.file,
      summary: next ? '插件当前已处于停用状态，无需修改。' : '插件当前为启用状态，无需修改。',
    };
  }

  const backupPath = `${ctx.file}.bak-self-toggle-${timestamp()}`;
  copyFileSync(ctx.file, backupPath);
  writeFileSync(ctx.file, serializeConfig(ctx.header, ctx.data, ctx.yaml), 'utf8');
```

</details>

**依据 10 · 源码核查**：[lib/client.js:713-733](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/client.js#L713-L733)

二次点击触发停用。

<details>
<summary>查看原文（21行）</summary>

```text
        /* 安全停用：两段式确认，第一下武装、第二下执行，避免误触 */
        var selfDisableState = useState(false);
        var selfDisableArmed = selfDisableState[0];
        var setSelfDisableArmed = selfDisableState[1];
        var selfDisableBusyState = useState(false);
        var selfDisableBusy = selfDisableBusyState[0];
        var setSelfDisableBusy = selfDisableBusyState[1];

        var selfDisable = useCallback(function () {
          if (selfDisableBusy) return;
          if (!selfDisableArmed) {
            setSelfDisableArmed(true);
            return;
          }
          setSelfDisableBusy(true);
          requestJson(API + "/self-disable", {
            method: "POST",
            headers: { "content-type": "application/json", accept: "application/json" },
            body: JSON.stringify({ disabled: true }),
          })
            .then(function (data) {
```

</details>

**依据 11 · 源码核查**：[lib/index.js:240-256](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/index.js#L240-L256)

停用路由与延后reload。

<details>
<summary>查看原文（17行）</summary>

```text
      // POST /api/model-enricher/self-disable  body { disabled?: boolean }
      // 安全停用通道：只写 patch 行，保留 dsh.profile.bundles，
      // 避免市场面板「移除 bundle + 写 disabled 行」造成的 no loader entry matched。
      if (segments[0] === 'self-disable') {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: `method not allowed: ${req.method}` });
          return;
        }
        const body = await readJsonBody(req);
        const result = await setSelfDisabled(body.disabled !== false, { file: configuredFile });
        if (result.changed) {
          // 停用会导致本插件被卸载，先让 HTTP 响应返回再触发重载
          setTimeout(() => {
            notifyHostConfigReload(ctx).catch(() => {});
          }, 120);
        }
        sendJson(res, 200, { ...result, autoWatch: state.autoWatch !== false });
```

</details>

**依据 12 · 源码核查**：[lib/index.js:80-103](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/index.js#L80-L103)

回环/同源判定。

<details>
<summary>查看原文（24行）</summary>

```text
/** loopback 围栏：与 DSH 既有路由同一口径（本机 127.0.0.1 / ::1 且同源）。 */
function isLoopbackRequest(req) {
  const address = req?.socket?.remoteAddress;
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false;
  const host = req.headers?.host;
  if (typeof host !== 'string') return false;
  let hostUrl;
  try {
    hostUrl = new URL(`http://${host}`);
  } catch {
    return false;
  }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') {
    return false;
  }
  if (req.headers['sec-fetch-site'] === 'cross-site') return false;
  const origin = req.headers.origin;
  if (origin === undefined) return true;
  try {
    return new URL(origin).host === hostUrl.host;
  } catch {
    return false;
  }
}
```

</details>

#### 缺口

- 未复现并发保存/备份相撞/崩溃与新停用路径的宿主行为。
  **影响**：不能保证不覆盖其他改动、可靠恢复或作者停用兼容结论。
  **进一步探讨**：复制profile交错自动/手动/外写/停用并模拟中断，核原文件、备份、标识和重载。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 先备什么，怎样有限验证与算成本效果？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 条件

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH WebServer/设置/重载与对应客户端 | 插件路径必需 | 状态、preview/run/停用与自动监听 | 无Web服务apply直接跳过，非通用headless补齐 |
| 可读写目标profile YAML与备份目录 | 写入必需 | 全文解析/备份/覆盖 | 先核file，不默认已选对profile |
| 可从候选路径装载的js-yaml | 核心必需 | load/dump | package未声明依赖不等运行无依赖，找不到则失败 |
| 上游真实能力依据与请求测试 | 合格配置必需 | 核窗口/输出/模态/推理 | 名称和“最新最优”摘要不能代替规格 |
| 复制profile与独立原件备份 | 当前研究必需 | 可回滚验证 | 真实profile不先开默认自动链 |

package2.3.0、MIT，lib host/client已在固定checkout中，无需以缺源码构建产物解释本项；加载/市场及制品对应仍未验。本轮未运行目标、改用户配置或调用真实模型。

#### 步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 隔离 | 用户复制profile并先设autoWatch=false，保存独立原件 | 启动不自动改真实配置，核实际file |
| 预览 | 用户只读inspect/dryRun看逐模型diff | 无备份/写入；核每项真实能力而非系列标签 |
| 核规格 | 用户比对提供方/实际部署限制 | 未知字段不接受1M/image等默认作证据 |
| 试写 | 仅复制profile人工确认后写 | 核id/name/YAML语义、备份和请求成功 |
| 恢复 | 用户核self-disable/读回或还原独立原件 | 不盲信“安全”标签；失效保现场再修配置 |
| 退出 | 回原生逐项设置或保留只读规划方式 | 清理自动触发和补错字段，旧错误不自动降回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地解析/备份存储 | 关自动、复制配置、核file和依赖 | 包无声明依赖仍需js-yaml；兼容工时未知 |
| 持续使用 | 本地巡检/写盘；能力测试可能需真实请求 | 每模型/代理更新重核规格与已有错误 | 本插件规则不调用模型验真，验证成本不能略 |
| 失败恢复 | 备份、重复请求和配置修复 | 核并发丢改、备份轮转与停用重载 | 秒级备份/直接写不保证恢复 |
| 升级退出 | 原件及必要备份保留 | 修旧1M/image/推理误配置、恢复插件状态 | 新例外不回滚既有字段 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 批量规划 | 名称规则和逐字段diff | 规格正确率、实际节省核验时间 |
| 标识保护 | 四字段白名单与序列化审计 | 不等完整原件身份diff/并发保护 |
| 自动写/备份 | 多事件触发、20份轮转 | 无误赋能、崩溃/并发恢复 |
| 停用入口 | 只改patch并保bundles | 目标宿主停用/重新启用可靠性 |

按“真实可用且可恢复的一组模型配置”计总核验、请求/错误和人工，不按自动补字段数算收益。没有资源/耗时数据，不能给净省钱或全模型安全结论。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-20](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/package.json#L2-L20)

实际版本、许可和lib导出。

<details>
<summary>查看原文（19行）</summary>

```text
  "name": "dsh-model-auto-enricher",
  "version": "2.3.0",
  "description": "DSH 模型补齐助手：彻底解决在 DSH 添加新模型渠道后，还要把几十个模型一个个手动点开调上下文、勾多模态发图、配思考强度档位（low/high/max）的繁琐痛点；支持新加模型保存即自动补齐与一键批量补齐，写前自动时间戳备份。Model channel auto-enricher for DeepSeek Harness — eliminates manually configuring context windows, image input and reasoning effort tiers model by model.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/66rapper/dsh-model-auto-enricher.git"
  },
  "homepage": "https://github.com/66rapper/dsh-model-auto-enricher#readme",
  "bugs": {
    "url": "https://github.com/66rapper/dsh-model-auto-enricher/issues"
  },
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:273-287](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/index.js#L273-L287)

Web必需路径。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx, config = {}) {
  const log = loggerOf(ctx);
  const webServer = readService(ctx, 'webServer');
  const configuredFile = typeof config?.file === 'string' && config.file.trim() ? config.file.trim() : undefined;
  const autoWatch = config?.autoWatch !== false;

  const state = {
    autoWatch,
    lastAutoEnrich: null,
    running: false,
  };

  if (!webServer || typeof webServer.register !== 'function') {
    log.warn?.(`[${PLUGIN_ID}] webServer 服务不可用：跳过 ${API_PREFIX} 路由注册`);
    return;
```

</details>

**依据 3 · 源码核查**：[lib/core.js:345-367](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L345-L367)

js-yaml候选动态装载。

<details>
<summary>查看原文（23行）</summary>

```text
/** 惰性装载 js-yaml（首次调用时才 import，且只装载一次）。 */
export async function loadYaml() {
  if (yamlModule) return yamlModule;
  if (!yamlLoading) {
    yamlLoading = (async () => {
      const tried = [];
      for (const candidate of yamlCandidates()) {
        if (!candidate) continue;
        if (!existsSync(candidate)) {
          tried.push(`(missing) ${candidate}`);
          continue;
        }
        try {
          const mod = await import(pathToFileURL(candidate).href);
          const y = mod && (mod.default ?? mod);
          if (y && typeof y.load === 'function' && typeof y.dump === 'function') {
            yamlModule = y;
            return y;
          }
          tried.push(`(bad api) ${candidate}`);
        } catch (error) {
          tried.push(`(${error instanceof Error ? error.message : String(error)}) ${candidate}`);
        }
```

</details>

**依据 4 · 源码核查**：[lib/core.js:840-913](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L840-L913)

预览和写入成本。

<details>
<summary>查看原文（74行）</summary>

```text
 * 无变更时不写盘、不备份，返回 `changed: false`。
 */
export async function runEnrich(options = {}) {
  const dryRun = options.dryRun === true;
  const ctx = await readConfig(options.file);
  const analysis = analyze(ctx.data, false);

  const base = {
    ok: true,
    engine: PLUGIN_ID,
    engineVersion: ENGINE_VERSION,
    file: ctx.file,
    dryRun,
    providerCount: analysis.providerCount,
    modelCount: analysis.modelCount,
    changedCount: analysis.changes.length,
    changedModelCount: analysis.modelReports.filter((r) => r.needsEnrich).length,
    changes: analysis.changes,
    providers: analysis.providers,
  };

  if (analysis.changes.length === 0) {
    return {
      ...base,
      changed: false,
      backupPath: null,
      bytesBefore: Buffer.byteLength(ctx.raw, 'utf8'),
      bytesAfter: Buffer.byteLength(ctx.raw, 'utf8'),
      summary: '✨ 所有模型规格已是最新最优状态，无需修改！',
    };
  }

  if (dryRun) {
    return {
      ...base,
      changed: false,
      backupPath: null,
      bytesBefore: Buffer.byteLength(ctx.raw, 'utf8'),
      bytesAfter: null,
      summary:
        `🔍 预览模式（零写入）：共发现 ${analysis.changes.length} 处可补齐项，` +
        `涉及 ${base.changedModelCount} 个模型；未生成备份、未改动任何字节。`,
    };
  }

  // 真实写入路径：重新在 apply 模式下规划（同一份 data 就地补齐）+ 写前备份
  const applied = analyze(ctx.data, true);
  if (applied.changes.length === 0) {
    return { ...base, changed: false, backupPath: null, summary: '✨ 无需修改（二次规划为空，已跳过写入）。' };
  }

  const backupPath = `${ctx.file}.bak-auto-enrich-${timestamp()}`;
  copyFileSync(ctx.file, backupPath);

  const next = serializeConfig(ctx.header, ctx.data, ctx.yaml);

  // 写盘前的最后一道审计：逐模型比对「原文件解析结果」与「即将写出的对象」，
  // 只要有任何模型的 `name` / `id` 发生变化就立刻中止（此时备份已生成、尚未写盘，
  // 中止是安全的）。这是给未来迭代上的保险栓：即便有人给 changes 加了新字段，
  // 也不可能把展示名悄悄写进用户配置。
  const tampered = auditImmutableIdentity(ctx.data, next, ctx.yaml);
  if (tampered.length > 0) {
    throw new Error(
      `dsh-model-auto-enricher 写盘前审计失败：检测到 ${tampered.length} 处模型标识被改动 ` +
        `(${tampered.slice(0, 5).map((t) => `${t.provider}/${t.id}: ${t.field}`).join(', ')}` +
        `)。本插件绝不写 name / id，已中止写入，原配置未受影响。备份：${backupPath}`,
    );
  }

  writeFileSync(ctx.file, next, 'utf8');

  // 备份轮转：只裁剪本引擎自己生成的 .bak-auto-enrich-*，保留最近 20 个。
  // 人工留痕（bak-self-toggle / bak-removename 等）不动。
  const prunedBackups = pruneBackups(ctx.file, { keep: BACKUP_KEEP });
```

</details>

**依据 5 · 源码核查**：[lib/core.js:947-1002](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L947-L1002)

停用恢复边界。

<details>
<summary>查看原文（56行）</summary>

```text
export async function setSelfDisabled(disabled, options = {}) {
  const next = disabled === true;
  const ctx = await readConfig(options.file);
  const rows = Array.isArray(ctx.data) ? ctx.data : [];
  const matches = rows.filter((row) => row && row.id === PLUGIN_ID);
  const pureMarker = (row) => Object.keys(row).every((key) => key === 'id' || key === 'disabled');

  let changed = false;

  if (matches.length === 0) {
    if (next) {
      rows.push({ id: PLUGIN_ID, disabled: true });
      changed = true;
    }
  } else if (next) {
    for (const row of matches) {
      if (row.disabled !== true) {
        row.disabled = true;
        changed = true;
      }
    }
  } else {
    // 先标记、后重建：`for-of` 遍历的是 filter 快照，边遍历边 splice 会让索引前移，
    // 连续多个 pureMarker 行时只删掉一半（实测 3 个只删 2 个），残留行会重新引出
    // `no loader entry matched`。这里改为一次性 filter 重建，语义确定。
    const removed = [];
    for (const row of matches) {
      if (pureMarker(row)) {
        removed.push(row);
      } else if (row.disabled !== false) {
        row.disabled = false;
        changed = true;
      }
    }
    if (removed.length > 0) {
      const kept = rows.filter((row) => !removed.includes(row));
      rows.length = 0;
      rows.push(...kept);
      changed = true;
    }
  }

  if (!changed) {
    return {
      ok: true,
      changed: false,
      disabled: next,
      backupPath: null,
      file: ctx.file,
      summary: next ? '插件当前已处于停用状态，无需修改。' : '插件当前为启用状态，无需修改。',
    };
  }

  const backupPath = `${ctx.file}.bak-self-toggle-${timestamp()}`;
  copyFileSync(ctx.file, backupPath);
  writeFileSync(ctx.file, serializeConfig(ctx.header, ctx.data, ctx.yaml), 'utf8');
```

</details>

#### 缺口

- 缺有真实能力ground truth的模型矩阵及全部恢复/请求成本。
  **影响**：不能量化误赋能与净便利，默认自动模式收益不足以支持采用。
  **进一步探讨**：复制profile覆盖文本/图像/推理/嵌入/别名/代理及并发，计成功率、回滚和全部人工。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 默认模式值得用吗，怎样改才可证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前不推荐默认自动补齐。多渠道重复配置确有负担，但未知名称仍默认超大窗口和图片，而真实写默认触发且缺并发前提，可能把少点几次设置换成请求失败和逐模型纠错。2.3.0的例外、白名单和停用入口是实际改善，不足以把名称识别变成规格认证。

若只研究规划便利，先关闭autoWatch，在复制profile只读预览，逐项核实际部署，再做明确批准的写入和请求对照。发现字段不被上游支持、YAML/标识变动、外写被覆盖或停用状态不明，保留原件与备份，停自动链回原生配置；不要反复写入让旧备份被轮转。

可验证方向是保守未知、不扩展未证字段、逐项来源和批准diff，再用原件快照身份比对、唯一备份、版本/CAS与原子替换发布。对照当前版与手动设置，在未知别名、专用/图像/推理模型、旧误配置及并发保存/停用矩阵测误赋能、成功请求、回滚和总人工时间。若不能减少错误或省下的点击抵不过核验/恢复负担，否定优势。未实现部分不能因现有四字段白名单就说已完成。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:205-216](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L205-L216)

仍激进的未知窗口/图片回退。

<details>
<summary>查看原文（12行）</summary>

```text
 */
export const FALLBACK_SERIES_RULE = {
  id: 'universal',
  label: '通用新模型规则',
  contextWindow: DEFAULT_CONTEXT_CAP,
  maxTokens: DEFAULT_MAX_TOKENS,
  input: ['text', 'image'],
  // 与 UNIVERSAL_RULES.thinking 同口径：只认强特征词。裸 `pro` / `max` / `preview`
  // 会让 `some-pro-model` 这类普通模型被误判成推理模型（实测已复现）。
  reasoning: (key) =>
    /\bthinking\b|reasoner|-r1\b|-r2\b|-high$|-max$/.test(key) &&
    !/\blite\b|-lite|\bimage\b|-image|\bembed|\brerank|\bwhisper|\btts|\basr/.test(key),
```

</details>

**依据 2 · 源码核查**：[lib/core.js:662-672](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L662-L672)

当前真实白名单保护。

<details>
<summary>查看原文（11行）</summary>

```text
  if (apply && changes.length > 0) {
    for (const change of changes) {
      if (!WRITABLE_FIELDS.has(change.field)) {
        throw new Error(
          `dsh-model-auto-enricher 内部约束被破坏：试图写入不可写字段 "${change.field}"` +
            `（模型 "${id}"）。允许写入的字段只有 ${[...WRITABLE_FIELDS].join(' / ')}。` +
            `本插件绝不主动写模型展示名 name。`,
        );
      }
      mutable[change.field] = change.to;
    }
```

</details>

**依据 3 · 源码核查**：[lib/core.js:885-913](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/core.js#L885-L913)

非CAS直接写与轮转。

<details>
<summary>查看原文（29行）</summary>

```text
  // 真实写入路径：重新在 apply 模式下规划（同一份 data 就地补齐）+ 写前备份
  const applied = analyze(ctx.data, true);
  if (applied.changes.length === 0) {
    return { ...base, changed: false, backupPath: null, summary: '✨ 无需修改（二次规划为空，已跳过写入）。' };
  }

  const backupPath = `${ctx.file}.bak-auto-enrich-${timestamp()}`;
  copyFileSync(ctx.file, backupPath);

  const next = serializeConfig(ctx.header, ctx.data, ctx.yaml);

  // 写盘前的最后一道审计：逐模型比对「原文件解析结果」与「即将写出的对象」，
  // 只要有任何模型的 `name` / `id` 发生变化就立刻中止（此时备份已生成、尚未写盘，
  // 中止是安全的）。这是给未来迭代上的保险栓：即便有人给 changes 加了新字段，
  // 也不可能把展示名悄悄写进用户配置。
  const tampered = auditImmutableIdentity(ctx.data, next, ctx.yaml);
  if (tampered.length > 0) {
    throw new Error(
      `dsh-model-auto-enricher 写盘前审计失败：检测到 ${tampered.length} 处模型标识被改动 ` +
        `(${tampered.slice(0, 5).map((t) => `${t.provider}/${t.id}: ${t.field}`).join(', ')}` +
        `)。本插件绝不写 name / id，已中止写入，原配置未受影响。备份：${backupPath}`,
    );
  }

  writeFileSync(ctx.file, next, 'utf8');

  // 备份轮转：只裁剪本引擎自己生成的 .bak-auto-enrich-*，保留最近 20 个。
  // 人工留痕（bak-self-toggle / bak-removename 等）不动。
  const prunedBackups = pruneBackups(ctx.file, { keep: BACKUP_KEEP });
```

</details>

**依据 4 · 源码核查**：[lib/index.js:273-302](https://github.com/66rapper/dsh-model-auto-enricher/blob/db011fe106a4d12b9c23128ac4ead3f1705b6fcd/lib/index.js#L273-L302)

默认自动链。

<details>
<summary>查看原文（30行）</summary>

```text
export function apply(ctx, config = {}) {
  const log = loggerOf(ctx);
  const webServer = readService(ctx, 'webServer');
  const configuredFile = typeof config?.file === 'string' && config.file.trim() ? config.file.trim() : undefined;
  const autoWatch = config?.autoWatch !== false;

  const state = {
    autoWatch,
    lastAutoEnrich: null,
    running: false,
  };

  if (!webServer || typeof webServer.register !== 'function') {
    log.warn?.(`[${PLUGIN_ID}] webServer 服务不可用：跳过 ${API_PREFIX} 路由注册`);
    return;
  }

  const handler = createHandler(ctx, config, state);

  // 后台自动巡检与补齐（带重入锁与幂等保护：若 pendingCount === 0 则 0 写入、0 副作用）
  async function checkAndAutoEnrich(trigger) {
    if (!state.autoWatch || state.running) return;
    state.running = true;
    try {
      const status = await inspectConfig({ file: configuredFile });
      if (status && status.pendingCount > 0) {
        log.info?.(
          `[${PLUGIN_ID}] 检测到新加入或待优化的模型（触发源: ${trigger}，共 ${status.pendingModelCount} 个模型 / ${status.pendingCount} 处），正在自动智能补齐...`,
        );
        const result = await runEnrich({ file: configuredFile, dryRun: false });
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
