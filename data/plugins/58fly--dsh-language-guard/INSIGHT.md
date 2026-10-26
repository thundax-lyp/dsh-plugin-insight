# dsh-language-guard

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[38411eb](https://github.com/58fly/dsh-language-guard/tree/38411ebd24d29f02c10f319f56c1a6110a7daff7)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard) [![npm 30d 126](https://img.shields.io/static/v1?label=npm+30d&message=126&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-language-guard) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-language-guard)
<!-- END META -->

> **实现功能**：用多位置系统提示、周期提醒和界面/命令配置设置DSH目标输出语言。

> **核心亮点**：比单句提示多出工具说明后与尾部复述、可选周期和明确语言来源配置，属于宿主提示适配，不是强制语言约束。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：不能改API tools schema或保证服从；/language实际模块级覆盖并非严格会话隔离，自动zh映射统一简体，多插件重复注入有上下文负担。[Q03](#research-q03)

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
  - [Q01 · 语言锁定面向什么任务，相对普通系统提示增加什么？](#detail-section-11)
  - [Q02 · 三种模式、周期notice与命令覆盖如何生效？](#detail-section-12)
  - [Q03 · 提示能否约束工具schema，重复注入与子agent有何边界？](#detail-section-13)
  - [Q04 · 配置、生效/停止流程与token人工成本如何？](#detail-section-14)
  - [Q05 · section顺序与验证脚本能证明何种工程性质？](#detail-section-15)
  - [Q06 · 按语言违例反馈自适应提醒能否更有效，怎样采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给长编码会话中经常语言漂移的人减少重复纠正，仍需核对代码与可见答复。

宿主原生语言偏好/一句系统提示为最小替代，未做真实漂移率对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| B/C多点提示 | 设置输出语言偏好 | 不强制解码，不改tools schema |
| D周期提醒 | 长会话重申目标语 | 顶层/首step/间隔命中，UI可见 |
| auto/manual | 语言来源控制 | auto的zh前缀统一zh-CN |
| language命令 | 临时覆盖/reset | 模块内单值，不严格隔离会话 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH systemPrompt/dsh-llm | 必需 | 提示/notice | 加载或消息构造受阻 |
| settings locale | 自动模式需要 | 语言来源 | 回退配置 |
| commands | 快捷命令需要 | 临时覆盖/reset | 仍可用配置模式 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 选择语言来源与B/C | 配置显示来源可解释 |
| 使用 | 对固定代码任务观察答复 | 目标语且代码/专名未损坏 |
| 恢复 | reset覆盖或停用检查 | 多会话组装语言均符合预期 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 无已核实金额 | 选auto/manual与强度 | 繁体需manual |
| 持续 | 每请求额外提示、D加notice | 检查可见语言及代码 | token与净节时未知 |
| 失败恢复/退出 | 重复请求成本未知 | reset覆盖或停用并核对注册 | 模块覆盖影响同进程 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 提示到位 | 三段order与周期门禁 | 模型服从和漂移率 |
| 自动语言 | locale纯函数映射 | 用户实际地区语需求 |
| 临时切换 | 模块内覆盖优先 | 严格会话隔离不成立 |

> **思考**：不能改API tools schema或保证服从；/language实际模块级覆盖并非严格会话隔离，自动zh映射统一简体，多插件重复注入有上下文负担。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：比单句提示多出工具说明后与尾部复述、可选周期和明确语言来源配置，属于宿主提示适配，不是强制语言约束。[Q01](#research-q01)、[Q02](#research-q02)

比单句提示多出工具说明后与尾部复述、可选周期和明确语言来源配置，属于宿主提示适配，不是强制语言约束。[Q01](#research-q01)、[Q02](#research-q02)

显式section顺序、保留decision字段、source幂等标记与三态迁移可借鉴；常数依赖宿主契约，验证提示命中不能替代输出质量测试。[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

不能改API tools schema或保证服从；/language实际模块级覆盖并非严格会话隔离，自动zh映射统一简体，多插件重复注入有上下文负担。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先与原生单句提示对照，从B/C检查可见答复和代码；只有长会话确有漂移才试D。多会话不要依赖/language隔离。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

提示注册/周期门禁和映射有源码证据；语言效果、内部推理和多会话隔离未验证；会话化/反馈提醒是假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/cycle.js、lib/state.js、lib/language.js、lib/commands.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查host section、周期、语言纯函数、命令和共享状态；未执行目标脚本、真实模型或完整客户端，不推断内部思维语言。
- 下一步：可进一步用双会话、长工具链和代码混排样本比较原生提示及B/C/D，记录可见语言、代码合格率和token。

**分析版本**

- **仓库**：[58fly/dsh-language-guard](https://github.com/58fly/dsh-language-guard)
- **版本号**：0.3.6（[固定提交 38411eb](https://github.com/58fly/dsh-language-guard/tree/38411ebd24d29f02c10f319f56c1a6110a7daff7)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是session绑定覆盖与可见语言违例反馈提醒，以双会话和代码混排任务检查污染、误纠正及总token，不推断内部思维语言。[Q06](#research-q06)

可进一步用双会话、长工具链和代码混排样本比较原生提示及B/C/D，记录可见语言、代码合格率和token。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 33 | 11272 | — | — | 161641 |
| .js | source | 7 | 2440 | 1693 | 560 | — |
| .mjs | source | 9 | 2095 | 1536 | 318 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对多位置语言提示、自动映射与临时覆盖作用域及采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 语言锁定面向什么任务，相对普通系统提示增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在长编码会话和英文工具说明后输出语言漂移的用户，目标是减少人工反复要求目标语言。相对单句系统提示，增量在头部、工具说明后和尾部多位置提示，加可选周期notice与语言来源可解释配置；不是语言解码约束器。作者宣称覆盖思考、答复、计划和工具description，但本轮只能核对提示文本存在，不能证实内部推理语言或输出服从。合格结果应是用户可见答复与工具卡片在不损坏代码/标识符前提下符合目标语言。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-63](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/README.md#L30-L63)

作者定义漂移问题、三位置和覆盖声明。

<details>
<summary>查看原文（34行）</summary>

```text
## Why you need it

The DSH system prompt is assembled from many sections: identity, plan policy, team policy, **tool descriptions**, deliverable references, deployment persona. The largest block by far is the tool documentation — written in English, and placed in the middle of the prompt.

Measured on DSH 0.2.1-rc.2 (everything after order 50): **98.1% of the characters and 99.8% of the ASCII** come from English tool documentation, and 5.7K–14K characters separate the opening section from the closing one. The model reads overwhelmingly English tokens, and so it drifts:

- The first few turns stay in your language;
- as soon as it starts chaining tool calls, reading long files, or reasoning at length, the reasoning slides back into English;
- nothing in your settings changed — the conversation simply got longer.

A single "please answer in Chinese" line at the very top of the system prompt is enough for a short session. It is not enough for a long one, because that line sits tens of thousands of characters away from the place that actually influences the model (the tool documentation).

This plugin puts a constraint in **three places**: at the very start, right after the tool documentation, and at the very end. The default level (Strong) costs roughly 146 extra characters per request and buys one restatement positioned after the English tool docs.

## What it does

Three resident system-prompt sections, registered through `ctx.systemPrompt.section()`, never disposed, switching level only switches their text:

| Section name | Order | Position | B | C | D |
| --- | --- | --- | --- | --- | --- |
| `language-guard:head` | `-2000` | Very first, before `harness:identity` (`-1000`) | ✅ | ✅ | ✅ |
| `language-guard:mid` | `5100` | After all tool docs (`tools:sdk`, `5000`), before deliverable references (`9000`) | ❌ | ✅ | ✅ |
| `language-guard:tail` | `11200` | Very last, after `deployment:persona-suffix` (`10200`) | ✅ | ✅ | ✅ |

The constraint covers **four language channels** (the fourth landed in 0.3.0):

| Channel | Where the constraint lives | Coverage |
| --- | --- | --- |
| Internal reasoning (reasoning / thinking) | `head` + `tail` | every level |
| User-facing reply text | `head` + `mid` + `tail` | every level |
| Plans, todos, reviews, subagent briefs | `head` | every level |
| **Tool-call `description` parameter** (the card title of `run_code` in PTC mode) | `head` + `mid` | every level (`mid` exists only at C / D, hence the extra line in `head`) |

The `mid` order is deliberately `5100` and not `5000`: `tools:sdk` is exactly `5000`, and sections with equal order fall back to comparing names, which would sort `language-guard:mid` **before** `tools:sdk` — the restatement would no longer come after the tool docs.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三种模式、周期notice与命令覆盖如何生效？

**研究主题**：功能与机制

#### 完整回答

B档head/tail，C/D增加mid，三者text函数读取当前语言且interpolate:false。D档在pre-step先await next，保留decision其他字段，只对top-level、第一step、有消息且turn整除间隔时插入一次带source.kind的notice。自动语言从宿主locale preference映射，缺失回退配置，三态模式保留旧用户非默认选择。/language写内存覆盖优先于模式与配置，reset清掉覆盖。该机制减少反复配置，却不强制模型输出验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:192-237](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/index.js#L192-L237)

三段注册和周期接线。

<details>
<summary>查看原文（46行）</summary>

```text
  // —— 三个常驻 section：一次性注册、永不 dispose，切档只切 text 返回值 ——
  // 空字符串会被 renderPrompt 的 `.filter(text => text.length > 0)` 过滤，
  // 因此 B 档的 mid 返回 "" 等价于「该段不存在」，不会留下空行。
  ctx.effect(
    () =>
      ctx.systemPrompt.section({
        name: HEAD_SECTION,
        order: -2000,
        interpolate: false,
        text: () =>
          headText({
            language: language(),
            preserveCodeTerms: preserveCodeTerms(),
            overrideHead: overrideHead(),
            extraRules: extraRules(),
          }),
      }),
    'language-guard: head section',
  );

  ctx.effect(
    () =>
      ctx.systemPrompt.section({
        name: MID_SECTION,
        order: 5100,
        interpolate: false,
        text: () => (strength() === 'B' ? '' : midText({ language: language() })),
      }),
    'language-guard: mid section',
  );

  ctx.effect(
    () =>
      ctx.systemPrompt.section({
        name: TAIL_SECTION,
        order: 11200,
        interpolate: false,
        text: () => tailText({ language: language(), preserveCodeTerms: preserveCodeTerms() }),
      }),
    'language-guard: tail section',
  );

  // —— D 档周期提醒：注册在插件根 ctx，payload 自带 agent ——
  ctx.effect(
    () => registerCycle(ctx, { strength, interval, language }),
    'language-guard: periodic reminder',
```

</details>

**依据 2 · 源码核查**：[lib/cycle.js:55-84](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/cycle.js#L55-L84)

周期门禁、子agent排除和spread。

<details>
<summary>查看原文（30行）</summary>

```text
export function registerCycle(ctx, { strength, interval, language }) {
  return ctx.on('agent/pre-step', async ({ agent, messages, turn, step }, next) => {
    const decision = await next();

    // 不拥有决策就原样返回（绝不能替换成自己的 enter）
    if (!decision || decision.kind === 'reject') return decision;

    // 只有 D 档需要周期提醒；其余档位直接透传下游决策
    if (strength() !== 'D') return decision;

    // 门禁：只在命中轮的第一个 step、且有真实输入时插入
    if (step !== 1) return decision;
    if (!Array.isArray(decision.messages) || decision.messages.length === 0) return decision;

    const every = interval();
    if (!Number.isFinite(every) || every < 1) return decision;
    if (turn % every !== 0) return decision;

    // 幂等：本步已经带过同款消息就不再追加
    if (decision.messages.some((message) => message?.source?.kind === SOURCE_KIND)) return decision;

    // 只对顶层会话注入，不污染子代理的紧凑上下文
    if (delegationDepthOf(agent) !== 0) return decision;

    // 插在「最后一个本步 claim 到的消息」之后、runtime context 之前
    const lastClaimed = decision.messages.findLastIndex((message) => messages.includes(message));
    const entered = decision.messages.toSpliced(lastClaimed + 1, 0, buildReminder(language()));

    return { ...decision, messages: entered };
  });
```

</details>

**依据 3 · 源码核查**：[lib/language.js:103-109](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/language.js#L103-L109)

旧配置选择迁移规则。

```text
export function effectiveMode({ languageMode, targetLanguage, defaultLanguage = 'zh-CN' }) {
  const mode = typeof languageMode === 'string' ? languageMode.trim().toLowerCase() : '';
  if (mode === MODE_MANUAL) return MODE_MANUAL;
  if (mode === MODE_AUTO) return MODE_AUTO;
  // 未设置：只有「用户从没改过 targetLanguage」才按自动处理
  const target = normalizeLocaleId(targetLanguage) ?? defaultLanguage;
  return target === defaultLanguage ? MODE_AUTO : MODE_MANUAL;
```

**依据 4 · 源码核查**：[lib/state.js:68-79](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/state.js#L68-L79)

覆盖优先级。

<details>
<summary>查看原文（12行）</summary>

```text
export function resolveLanguage(configured, options) {
  if (languageOverride) return languageOverride;
  const raw = typeof configured === 'string' ? configured.trim() : '';
  if (options && typeof options === 'object') {
    return resolveTargetLanguage({
      mode: options.mode,
      preference: options.preference,
      fallback: raw || DEFAULT_LANGUAGE,
      defaultLanguage: DEFAULT_LANGUAGE,
    });
  }
  return raw || DEFAULT_LANGUAGE;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 提示能否约束工具schema，重复注入与子agent有何边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能改写API tools schema，也不保证模型遵守目标语言；周期notice可在UI看见。同位dsh-context提示可以稳定排序但重复内容仍增加上下文。另/documentation把命令称为本会话切换，实际state.languageOverride是模块级单变量，handler不取sessionId，所有语言闭包均读取它；同进程多个会话可能共同受临时切换影响，不能称严格会话隔离。自动映射将任何zh前缀映为zh-CN，繁体需求应显式manual，不能从合法zh-TW UI标签推断保留地区。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:407-418](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/README.md#L407-L418)

作者限定schema与提示约束。

<details>
<summary>查看原文（12行）</summary>

```text
## Known limitations

- **The constraint wording is fixed Simplified Chinese.** Only the language name and code are substituted, so with `targetLanguage: "en"` the injected text reads "…一律使用English（语言代码 en）". Models handle this fine, but the prose is not localized. Localizing the templates is a future change.
- **The Periodic reminder is visible in the chat UI**, collapsed into one line reading "上下文注入 · language-guard · 语言自检". The English identifier `language-guard` **cannot be hidden** — the client renders `source.kind` verbatim as the injection label, exactly as it does for the official `agent-instructions` and `skill-invocation`. Localizing it would require a custom `conversation.chat.node` renderer for the context node; the first release does not do that.
- **The Client half has no turn counter**, so the panel cannot show "the next injection lands on turn X".
- **The quick switch menu lists five presets plus one "Custom" entry.** Custom BCP-47 tags must be typed into the settings field; in Manual mode with a value outside the presets, the menu gains a checked "Custom: <language>" entry so that six unchecked rows no longer look like "nothing was ever set". The menu cannot enumerate arbitrary tags — switching to another custom value still goes through the settings field.
- **Absolute locking, no per-turn escape hatch.** A deliberate trade-off: the plugin is "set once, applies throughout", so a turn-level instruction such as "answer in English *this once*" does **not** switch it away — change the setting or use `/language` instead. That is the opposite stance from "switch per turn"; if you need per-turn switching, this plugin is the wrong tool.
- **It cannot detect whether `dsh-context` is installed**, so the hint is permanent (see above).
- **Periodic never wakes an idle session.** `agent/pre-step` only fires while a turn is running, so no message means no reminder — a language guard should not generate conversation on its own.
- **The `mid` position could be squeezed by future plugins.** If another plugin inserts a section between order `5000` and `9000`, the "after the tool docs" semantics get diluted. The fix then is to raise `mid` to `8900` (still before deliverable references at `9000`); failing that, fall back to Basic, which does not depend on `mid`.
- **It cannot tell Simplified from Traditional Chinese.** DSH ships exactly two built-in interface languages, `zh` and `en` (`dsh-client-locale/lib/index.js:11`, `LOCALE_IDS = ["zh", "en"]`), and `zh` does not distinguish the two scripts — while the Host side cannot see the system language. So when the interface language is Chinese, auto mode always resolves to `zh-CN`. Users who need Traditional output should switch the language mode to Manual and pick `zh-TW`. The same holds for Japanese and Korean: on a standard install auto mode can only resolve to `zh-CN` or `en`, so pick 日本語 / 한국어 manually — if you installed the matching external language pack, its tag is passed through as-is.
- **It does not cover the API `tools` parameter itself.** The real tool schema sent to the model lives in the request's `tools` parameter, not in the system prompt; this plugin only asks the model, on the prompt side, to write the `description` parameter in the target language. It cannot rewrite the English wording in the schema. If the model does not comply, tool card titles stay English — an inherent limit of a prompt-level constraint, not a configuration problem.
```

</details>

**依据 2 · 源码核查**：[lib/state.js:32-50](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/state.js#L32-L50)

覆盖只保存在模块单值。

<details>
<summary>查看原文（19行）</summary>

```text
/** `/language` 命令的内存覆盖值；null 表示未覆盖，走配置值 */
let languageOverride = null;

/**
 * 设置 `/language` 的内存覆盖值。
 * @param {string} code BCP-47 语言标签
 */
export function setLanguageOverride(code) {
  languageOverride = typeof code === 'string' && code.trim() ? code.trim() : null;
}

/** 清除 `/language` 的内存覆盖值，回到配置里的 targetLanguage。 */
export function clearLanguageOverride() {
  languageOverride = null;
}

/** 读取 `/language` 的内存覆盖值（未设置时为 null）。 */
export function getLanguageOverride() {
  return languageOverride;
```

</details>

**依据 3 · 源码核查**：[lib/commands.js:45-49](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/commands.js#L45-L49)

命令handler没有session参数。

```text
        child.commands.register({
          name: 'language',
          description: '切换本会话的目标语言（只影响当前进程，不写入配置）',
          input: { hint: '<语言标签，如 ja；reset 恢复配置值>' },
          handler: ({ rawInput }) => {
```

**依据 4 · 源码核查**：[lib/language.js:78-84](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/language.js#L78-L84)

zh前缀统一映射。

```text
export function mapPreference(preference) {
  const id = normalizeLocaleId(preference);
  if (!id) return null;
  const primary = id.split('-')[0].toLowerCase();
  if (primary === 'zh') return 'zh-CN';
  if (primary === 'en') return 'en';
  return id;
```

#### 缺口

- 多会话临时切换的实际传播与模型语言遵循率未独立执行
  **影响**：不能确认隔离或语言漂移改善幅度
  **进一步探讨**：同profile两会话设不同语言，检查组装提示，再用固定任务比较漂移率

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置、生效/停止流程与token人工成本如何？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要兼容systemPrompt及周期用到的dsh-llm createUserMessage，settings/commands按功能注入。先明确自动还是manual，再从B/C开始，观察答复与代码术语；D只在长会话确有漂移时加入。持续每请求增加固定提示，D另加notice，字符数不能直接等同token或节时；不发独立LLM请求也不等没有成本。命令覆盖不落盘但在同进程共享，reset或重启才清除；停用插件要核对section/监听已撤销，不能用降B当关闭。

#### 证据与依据

**依据 1 · 源码核查**：[lib/cycle.js:16-17](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/cycle.js#L16-L17)

周期消息构造依赖宿主llm包。

```text
import { createUserMessage } from '@deepseek-ai/dsh-llm';
import { reminderText } from './text.js';
```

**依据 2 · 源码核查**：[lib/index.js:192-237](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/index.js#L192-L237)

即B也保留head/tail。

<details>
<summary>查看原文（46行）</summary>

```text
  // —— 三个常驻 section：一次性注册、永不 dispose，切档只切 text 返回值 ——
  // 空字符串会被 renderPrompt 的 `.filter(text => text.length > 0)` 过滤，
  // 因此 B 档的 mid 返回 "" 等价于「该段不存在」，不会留下空行。
  ctx.effect(
    () =>
      ctx.systemPrompt.section({
        name: HEAD_SECTION,
        order: -2000,
        interpolate: false,
        text: () =>
          headText({
            language: language(),
            preserveCodeTerms: preserveCodeTerms(),
            overrideHead: overrideHead(),
            extraRules: extraRules(),
          }),
      }),
    'language-guard: head section',
  );

  ctx.effect(
    () =>
      ctx.systemPrompt.section({
        name: MID_SECTION,
        order: 5100,
        interpolate: false,
        text: () => (strength() === 'B' ? '' : midText({ language: language() })),
      }),
    'language-guard: mid section',
  );

  ctx.effect(
    () =>
      ctx.systemPrompt.section({
        name: TAIL_SECTION,
        order: 11200,
        interpolate: false,
        text: () => tailText({ language: language(), preserveCodeTerms: preserveCodeTerms() }),
      }),
    'language-guard: tail section',
  );

  // —— D 档周期提醒：注册在插件根 ctx，payload 自带 agent ——
  ctx.effect(
    () => registerCycle(ctx, { strength, interval, language }),
    'language-guard: periodic reminder',
```

</details>

**依据 3 · 源码核查**：[lib/commands.js:68-89](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/commands.js#L68-L89)

reset与临时覆盖操作。

<details>
<summary>查看原文（22行）</summary>

```text
            if (raw === 'reset' || raw === 'default') {
              clearLanguageOverride();
              const restored = language();
              const currentMode = typeof mode === 'function' ? mode() : 'manual';
              const where = currentMode === 'manual' ? '配置中的目标语言' : '自动解析结果';
              return {
                kind: 'success',
                text: `已恢复为${where}：${languageLabel(restored)}（${restored}）`,
              };
            }

            if (!BCP47.test(raw)) {
              return {
                kind: 'error',
                text: `不是合法的 BCP-47 语言标签：${raw}（示例：zh-CN、zh-TW、en、ja、ko）`,
              };
            }

            setLanguageOverride(raw);
            return {
              kind: 'success',
              text: `本会话目标语言已切换为 ${languageLabel(raw)}（${raw}），下一条消息起生效。`,
```

</details>

#### 缺口

- 合格语言任务总token、纠正时间与模式差异未知
  **影响**：不能判定多点提示是否值得持续成本
  **进一步探讨**：同模型同任务比较单句原生提示、B/C/D的语言合格率、代码正确性和总token

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · section顺序与验证脚本能证明何种工程性质？

**研究主题**：工程质量与复用

#### 完整回答

显式mid order5100避免与tools:sdk5000同序时按名称排到工具说明前，周期spread保留宿主额外字段、幂等source标记与跳过子agent是可复用接线设计。纯语言解析让三态迁移和映射可独立检查。但源码自检、section命中或日志文字只能证明注册/组装，不等模型理解、实际服从或内部思维语言。迁移复用需核对目标宿主section order、消息source与生命周期，不能直接照搬常数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-63](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/README.md#L48-L63)

位置与同序排序依据。

<details>
<summary>查看原文（16行）</summary>

```text
| Section name | Order | Position | B | C | D |
| --- | --- | --- | --- | --- | --- |
| `language-guard:head` | `-2000` | Very first, before `harness:identity` (`-1000`) | ✅ | ✅ | ✅ |
| `language-guard:mid` | `5100` | After all tool docs (`tools:sdk`, `5000`), before deliverable references (`9000`) | ❌ | ✅ | ✅ |
| `language-guard:tail` | `11200` | Very last, after `deployment:persona-suffix` (`10200`) | ✅ | ✅ | ✅ |

The constraint covers **four language channels** (the fourth landed in 0.3.0):

| Channel | Where the constraint lives | Coverage |
| --- | --- | --- |
| Internal reasoning (reasoning / thinking) | `head` + `tail` | every level |
| User-facing reply text | `head` + `mid` + `tail` | every level |
| Plans, todos, reviews, subagent briefs | `head` | every level |
| **Tool-call `description` parameter** (the card title of `run_code` in PTC mode) | `head` + `mid` | every level (`mid` exists only at C / D, hence the extra line in `head`) |

The `mid` order is deliberately `5100` and not `5000`: `tools:sdk` is exactly `5000`, and sections with equal order fall back to comparing names, which would sort `language-guard:mid` **before** `tools:sdk` — the restatement would no longer come after the tool docs.
```

</details>

**依据 2 · 源码核查**：[lib/cycle.js:55-84](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/cycle.js#L55-L84)

宿主decision及幂等保护。

<details>
<summary>查看原文（30行）</summary>

```text
export function registerCycle(ctx, { strength, interval, language }) {
  return ctx.on('agent/pre-step', async ({ agent, messages, turn, step }, next) => {
    const decision = await next();

    // 不拥有决策就原样返回（绝不能替换成自己的 enter）
    if (!decision || decision.kind === 'reject') return decision;

    // 只有 D 档需要周期提醒；其余档位直接透传下游决策
    if (strength() !== 'D') return decision;

    // 门禁：只在命中轮的第一个 step、且有真实输入时插入
    if (step !== 1) return decision;
    if (!Array.isArray(decision.messages) || decision.messages.length === 0) return decision;

    const every = interval();
    if (!Number.isFinite(every) || every < 1) return decision;
    if (turn % every !== 0) return decision;

    // 幂等：本步已经带过同款消息就不再追加
    if (decision.messages.some((message) => message?.source?.kind === SOURCE_KIND)) return decision;

    // 只对顶层会话注入，不污染子代理的紧凑上下文
    if (delegationDepthOf(agent) !== 0) return decision;

    // 插在「最后一个本步 claim 到的消息」之后、runtime context 之前
    const lastClaimed = decision.messages.findLastIndex((message) => messages.includes(message));
    const entered = decision.messages.toSpliced(lastClaimed + 1, 0, buildReminder(language()));

    return { ...decision, messages: entered };
  });
```

</details>

**依据 3 · 源码核查**：[lib/language.js:103-109](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/language.js#L103-L109)

纯函数迁移决策。

```text
export function effectiveMode({ languageMode, targetLanguage, defaultLanguage = 'zh-CN' }) {
  const mode = typeof languageMode === 'string' ? languageMode.trim().toLowerCase() : '';
  if (mode === MODE_MANUAL) return MODE_MANUAL;
  if (mode === MODE_AUTO) return MODE_AUTO;
  // 未设置：只有「用户从没改过 targetLanguage」才按自动处理
  const target = normalizeLocaleId(targetLanguage) ?? defaultLanguage;
  return target === defaultLanguage ? MODE_AUTO : MODE_MANUAL;
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 按语言违例反馈自适应提醒能否更有效，怎样采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是把临时覆盖按sessionId保存，并用可见答复的语言违例检测选择是否提醒，保留代码/引文豁免；相比固定每N轮可能减少无效提示。不能声称检测内部推理语言，代价是分类误差、额外检查及状态清理。用双会话不同目标语和代码混排任务比较固定D与自适应策略，观察跨会话污染、可见语言错误及总token；若误纠正代码/专名或新增成本更高则否定。适合经常输出语言漂移的人小范围试用，避免依赖临时命令进行多会话隔离；先从简单原生提示作对照。

#### 证据与依据

**依据 1 · 源码核查**：[lib/state.js:32-50](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/state.js#L32-L50)

会话化覆盖可替换单值。

<details>
<summary>查看原文（19行）</summary>

```text
/** `/language` 命令的内存覆盖值；null 表示未覆盖，走配置值 */
let languageOverride = null;

/**
 * 设置 `/language` 的内存覆盖值。
 * @param {string} code BCP-47 语言标签
 */
export function setLanguageOverride(code) {
  languageOverride = typeof code === 'string' && code.trim() ? code.trim() : null;
}

/** 清除 `/language` 的内存覆盖值，回到配置里的 targetLanguage。 */
export function clearLanguageOverride() {
  languageOverride = null;
}

/** 读取 `/language` 的内存覆盖值（未设置时为 null）。 */
export function getLanguageOverride() {
  return languageOverride;
```

</details>

**依据 2 · 源码核查**：[lib/cycle.js:69-77](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/lib/cycle.js#L69-L77)

当前周期按turn而非违例反馈。

```text
    const every = interval();
    if (!Number.isFinite(every) || every < 1) return decision;
    if (turn % every !== 0) return decision;

    // 幂等：本步已经带过同款消息就不再追加
    if (decision.messages.some((message) => message?.source?.kind === SOURCE_KIND)) return decision;

    // 只对顶层会话注入，不污染子代理的紧凑上下文
    if (delegationDepthOf(agent) !== 0) return decision;
```

**依据 3 · 作者声明**：[README.md:418-418](https://github.com/58fly/dsh-language-guard/blob/38411ebd24d29f02c10f319f56c1a6110a7daff7/README.md#L418-L418)

可见工具description仍受模型遵从边界。

```text
- **It does not cover the API `tools` parameter itself.** The real tool schema sent to the model lives in the request's `tools` parameter, not in the system prompt; this plugin only asks the model, on the prompt side, to write the `description` parameter in the target language. It cannot rewrite the English wording in the schema. If the model does not comply, tool card titles stay English — an inherent limit of a prompt-level constraint, not a configuration problem.
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
