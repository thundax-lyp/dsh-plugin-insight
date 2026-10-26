# dsh-zh-ui

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[4ddff4f](https://github.com/1186258278/dsh-zh-ui/tree/4ddff4f2e320285f003b0c7ca74a152440c5d255)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：提供中文UI设计Skill、项目设计规范注入和静态zh_design_lint检查工具。

> **核心亮点**：把中文设计知识、项目级约束和可执行静态规则连成同一工作流，并明确静态与渲染边界。它相对“单独维护设计提示词、手工加载项目规范，再用通用 lint 与截图人工检查”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：CSS 解析基于正则且不渲染，无法判断真实对比度、字号、布局、字体加载和交互可用性。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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
  - [Q01 · 目标用户、反复任务、原有办法与合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、调用链、数据和状态如何实现核心能力？](#detail-section-12)
  - [Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？](#detail-section-15)
  - [Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？](#detail-section-16)
  - [Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？](#detail-section-17)
  - [Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？](#detail-section-18)
  - [Q09 · 对谁值得观察或试用，成功与停止标准是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 DSH 生成或审查中文 Web 界面的设计与前端团队可用它将中文排版设计 Skill、项目 DESIGN.md/token 注入和 HTML/CSS/组件源码静态检查组合到 DSH；合格结果是设计方向与项目 token 被正确带入任务，静态检查定位中文排版和样式问题，并由渲染审查补足视觉结论。详见[Q01](#research-q01)。

基线是单独维护设计提示词、手工加载项目规范，再用通用 lint 与截图人工检查。本项的价值主要来自把中文设计知识、项目级约束和可执行静态规则连成同一工作流，并明确静态与渲染边界；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 中文UI设计Skill | 提供中文排版硬规则、设计流程和风格预设。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 项目规范注入 | 把 DESIGN.md 与 design.tokens.json 注入当前会话上下文。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 静态设计检查 | 用 zh_design_lint 扫描源码中的排版、颜色和样式问题。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH skill/tools/system-prompt/working-directory服务 | 必需 | 注册Skill、lint与项目规范注入 | 缺一服务时对应能力不加载 |
| 项目 DESIGN.md/design.tokens.json | 规范注入时可选 | 提供项目方向与允许token | 缺失时不注入，不伪造默认项目规范 |
| HTML/CSS/SCSS/Vue/JSX/TSX/Svelte源码 | lint必需 | 静态扫描中文排版与样式规则 | 超出工作区或maxFiles时拒绝/截断并报告 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 先选择设计方向并准备项目规范/token | 文件范围和maxSpecChars明确 |
| 2 | 生成/修改界面后运行 zh_design_lint | finding带文件/规则且不越出工作区 |
| 3 | 用真实渲染检查对比度、字体、布局和交互 | 静态通过不当作视觉验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地扫描与可选渲染工具资源 | 制定DESIGN.md/token和调整规则集 | 规范编写与基线截图时间未知 |
| 持续使用 | 每次静态扫描与提示上下文token | 分类误报、修改样式并截图复核 | 每页finding处理分钟和误报率未知 |
| 失败恢复 | 重新扫描/回退设计文件 | 区分正则误判、token例外和真实违规 | 错误自动修复可能破坏视觉层级 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 中文设计引导 | Skill包含排版规则与预设 | 生成页面真实审美/任务适配 |
| 项目约束注入 | 每次prompt assembly读取规范而非缓存系统提示 | 截断和多文件冲突处理 |
| 静态lint | 十类规则和工作区边界可见 | 对比度、渲染字体、布局与交互无法静态判断 |

> **思考**：CSS 解析基于正则且不渲染，无法判断真实对比度、字号、布局、字体加载和交互可用性。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把中文设计知识、项目级约束和可执行静态规则连成同一工作流，并明确静态与渲染边界。它相对“单独维护设计提示词、手工加载项目规范，再用通用 lint 与截图人工检查”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

把中文设计知识、项目级约束和可执行静态规则连成同一工作流，并明确静态与渲染边界。它相对“单独维护设计提示词、手工加载项目规范，再用通用 lint 与截图人工检查”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 src/index.ts 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“用真实渲染检查对比度、字体、布局和交互｜静态通过不当作视觉验收”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

CSS 解析基于正则且不渲染，无法判断真实对比度、字号、布局、字体加载和交互可用性。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

中文界面团队可在源码审查阶段试用，并以真实渲染和可访问性测试复核静态结果。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：准备30个有标注的中文页面样本和5个项目token集，测每条规则精确率/召回率、每页修正分钟；再做截图对比度/字体/键盘检查，静态通过但关键视觉失败率不降即否定单独采用。

**分析版本**

- **仓库**：[1186258278/dsh-zh-ui](https://github.com/1186258278/dsh-zh-ui)
- **版本号**：0.2.0（[固定提交 4ddff4f](https://github.com/1186258278/dsh-zh-ui/tree/4ddff4f2e320285f003b0c7ca74a152440c5d255)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可让静态 finding 生成最小渲染探针和截图检查计划，把规则违规与实际视觉影响分层验证。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

准备30个有标注的中文页面样本和5个项目token集，测每条规则精确率/召回率、每页修正分钟；再做截图对比度/字体/键盘检查，静态通过但关键视觉失败率不降即否定单独采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 459 | — | — | 6257 |
| .mjs | source | 5 | 107 | 105 | 6 | — |
| .ts | source | 2 | 483 | 406 | 36 | — |
| .ts | test | 1 | 130 | 124 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1186258278/dsh-zh-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1186258278/dsh-zh-ui/issues?q=is%3Aissue+created%3A2026-09-22T15%3A12%3A59.966Z..2026-10-22T15%3A12%3A59.966Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1186258278/dsh-zh-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T15%3A12%3A59.966Z..2026-10-22T15%3A12%3A59.966Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 dsh-zh-ui 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是使用 DSH 生成或审查中文 Web 界面的设计与前端团队。反复任务是将中文排版设计 Skill、项目 DESIGN.md/token 注入和 HTML/CSS/组件源码静态检查组合到 DSH。原有办法为单独维护设计提示词、手工加载项目规范，再用通用 lint 与截图人工检查。合格结果必须达到“设计方向与项目 token 被正确带入任务，静态检查定位中文排版和样式问题，并由渲染审查补足视觉结论”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-zh-ui

English | [中文](README.zh.md)

A DeepSeek Harness (`dsh`) plugin for Chinese-language UI work. It has three parts:

1. **Skill `zh-ui-design`**: Chinese typography rules (spacing between Chinese and Latin/digits, full-width punctuation, CJK font stacks with fallbacks, line-height 1.6–1.8, 25–40 characters per line), an anti-"generated look" checklist, and a "design direction first" workflow and 4 style presets (observatory, night-shift, cobalt-poster, trust), each with complete CSS custom properties and nav / hero / pricing-card / CTA recipes. Preset text/background pairs are checked against WCAG AA (4.5:1).
2. **Project spec injection**: on every prompt assembly, reads `DESIGN.md` and `design.tokens.json` from the session's working directory and appends them as runtime context (not the cached system prompt). Nothing is injected when the files are absent.
3. **Tool `zh_design_lint`**: static scan of HTML / CSS / SCSS / Vue / JSX / TSX / Svelte sources and Tailwind classes. It does not render pages.

## zh_design_lint rules

| Rule | What it reports |
|---|---|
| `hardcoded-color` | Literal colors outside custom-property definitions (`--x:`), and Tailwind arbitrary colors `bg-[#…]`. Colors listed in `design.tokens.json` are allowed. |
| `off-scale-px` | px values in margin / padding / gap / font-size / border-radius / inset properties that are not multiples of the spacing base (default 4px); Tailwind `p-[13px]` etc. 0, 1, 2 and token px values are allowed. |
| `font-family-cjk` | `font-family` stacks with no Chinese font (PingFang SC, Microsoft YaHei, Noto Sans SC, …). `var(...)`, `inherit` and monospace stacks are skipped. |
| `cjk-latin-spacing` | Visible text where a Chinese character directly touches a Latin letter or digit. |
| `cjk-punctuation` | Half-width `, ; : ! ? .` next to Chinese characters. |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

src/index.ts 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“先选择设计方向并准备项目规范/token｜文件范围和maxSpecChars明确；生成/修改界面后运行 zh_design_lint｜finding带文件/规则且不越出工作区；用真实渲染检查对比度、字体、布局和交互｜静态通过不当作视觉验收”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:131-148](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/src/index.ts#L131-L148)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text
  if (config.injectProjectSpec) {
    {
      // Waterfall pattern mirrors @deepseek-ai/dsh-working-directory: async read, then append a context entry.
      ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
        const assembly = await next()
        if (context.agent === undefined) return assembly
        const text = await readProjectSpec(cwdOf(context.agent), config.specFiles, config.maxSpecChars)
        if (text) assembly.contexts.push({ name: 'zh-ui:project-spec', text, interpolate: false })
        return assembly
      })
    }
  }

  ctx.tools.register(defineTool({
    name: 'zh_design_lint',
    description:
      'Static lint for Chinese UI source (HTML, CSS, Vue, JSX/TSX, Tailwind classes). Reports literal colors '
      + 'outside tokens, px values off the spacing scale, font stacks with no Chinese font, missing spaces '
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-zh-ui",
  "version": "0.2.0",
  "description": "Chinese UI design spec for DeepSeek Harness: a zh-ui-design skill with CJK typography rules and style presets, project DESIGN.md / design.tokens.json injection, and a static zh_design_lint tool.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "files": [
    "lib",
    "skills",
    "cordis.patch.yml",
    "README.md",
    "README.zh.md",
    "LICENSE"
  ],
  "license": "MIT",
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "dsh",
    "design-system",
    "cjk",
    "typography",
    "lint"
  ],
  "engines": {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是把中文设计知识、项目级约束和可执行静态规则连成同一工作流，并明确静态与渲染边界。参照是“单独维护设计提示词、手工加载项目规范，再用通用 lint 与截图人工检查”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:131-148](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/src/index.ts#L131-L148)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text
  if (config.injectProjectSpec) {
    {
      // Waterfall pattern mirrors @deepseek-ai/dsh-working-directory: async read, then append a context entry.
      ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
        const assembly = await next()
        if (context.agent === undefined) return assembly
        const text = await readProjectSpec(cwdOf(context.agent), config.specFiles, config.maxSpecChars)
        if (text) assembly.contexts.push({ name: 'zh-ui:project-spec', text, interpolate: false })
        return assembly
      })
    }
  }

  ctx.tools.register(defineTool({
    name: 'zh_design_lint',
    description:
      'Static lint for Chinese UI source (HTML, CSS, Vue, JSX/TSX, Tailwind classes). Reports literal colors '
      + 'outside tokens, px values off the spacing scale, font stacks with no Chinese font, missing spaces '
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-zh-ui

English | [中文](README.zh.md)

A DeepSeek Harness (`dsh`) plugin for Chinese-language UI work. It has three parts:

1. **Skill `zh-ui-design`**: Chinese typography rules (spacing between Chinese and Latin/digits, full-width punctuation, CJK font stacks with fallbacks, line-height 1.6–1.8, 25–40 characters per line), an anti-"generated look" checklist, and a "design direction first" workflow and 4 style presets (observatory, night-shift, cobalt-poster, trust), each with complete CSS custom properties and nav / hero / pricing-card / CTA recipes. Preset text/background pairs are checked against WCAG AA (4.5:1).
2. **Project spec injection**: on every prompt assembly, reads `DESIGN.md` and `design.tokens.json` from the session's working directory and appends them as runtime context (not the cached system prompt). Nothing is injected when the files are absent.
3. **Tool `zh_design_lint`**: static scan of HTML / CSS / SCSS / Vue / JSX / TSX / Svelte sources and Tailwind classes. It does not render pages.

## zh_design_lint rules

| Rule | What it reports |
|---|---|
| `hardcoded-color` | Literal colors outside custom-property definitions (`--x:`), and Tailwind arbitrary colors `bg-[#…]`. Colors listed in `design.tokens.json` are allowed. |
| `off-scale-px` | px values in margin / padding / gap / font-size / border-radius / inset properties that are not multiples of the spacing base (default 4px); Tailwind `p-[13px]` etc. 0, 1, 2 and token px values are allowed. |
| `font-family-cjk` | `font-family` stacks with no Chinese font (PingFang SC, Microsoft YaHei, Noto Sans SC, …). `var(...)`, `inherit` and monospace stacks are skipped. |
| `cjk-latin-spacing` | Visible text where a Chinese character directly touches a Latin letter or digit. |
| `cjk-punctuation` | Half-width `, ; : ! ? .` next to Chinese characters. |
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是CSS 解析基于正则且不渲染，无法判断真实对比度、字号、布局、字体加载和交互可用性。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:131-148](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/src/index.ts#L131-L148)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text
  if (config.injectProjectSpec) {
    {
      // Waterfall pattern mirrors @deepseek-ai/dsh-working-directory: async read, then append a context entry.
      ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
        const assembly = await next()
        if (context.agent === undefined) return assembly
        const text = await readProjectSpec(cwdOf(context.agent), config.specFiles, config.maxSpecChars)
        if (text) assembly.contexts.push({ name: 'zh-ui:project-spec', text, interpolate: false })
        return assembly
      })
    }
  }

  ctx.tools.register(defineTool({
    name: 'zh_design_lint',
    description:
      'Static lint for Chinese UI source (HTML, CSS, Vue, JSX/TSX, Tailwind classes). Reports literal colors '
      + 'outside tokens, px values off the spacing scale, font stacks with no Chinese font, missing spaces '
```

</details>

#### 缺口

- 缺少针对“CSS 解析基于正则且不渲染，无法判断真实对比度、字号、布局、字体加载和交互可用性”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：准备30个有标注的中文页面样本和5个项目token集，测每条规则精确率/召回率、每页修正分钟；再做截图对比度/字体/键盘检查，静态通过但关键视觉失败率不降即否定单独采用。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：DSH skill/tools/system-prompt/working-directory服务｜必需｜注册Skill、lint与项目规范注入｜缺一服务时对应能力不加载；项目 DESIGN.md/design.tokens.json｜规范注入时可选｜提供项目方向与允许token｜缺失时不注入，不伪造默认项目规范；HTML/CSS/SCSS/Vue/JSX/TSX/Svelte源码｜lint必需｜静态扫描中文排版与样式规则｜超出工作区或maxFiles时拒绝/截断并报告。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“用真实渲染检查对比度、字体、布局和交互｜静态通过不当作视觉验收”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-zh-ui",
  "version": "0.2.0",
  "description": "Chinese UI design spec for DeepSeek Harness: a zh-ui-design skill with CJK typography rules and style presets, project DESIGN.md / design.tokens.json injection, and a static zh_design_lint tool.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "files": [
    "lib",
    "skills",
    "cordis.patch.yml",
    "README.md",
    "README.zh.md",
    "LICENSE"
  ],
  "license": "MIT",
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "dsh",
    "design-system",
    "cjk",
    "typography",
    "lint"
  ],
  "engines": {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:131-148](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/src/index.ts#L131-L148)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text
  if (config.injectProjectSpec) {
    {
      // Waterfall pattern mirrors @deepseek-ai/dsh-working-directory: async read, then append a context entry.
      ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
        const assembly = await next()
        if (context.agent === undefined) return assembly
        const text = await readProjectSpec(cwdOf(context.agent), config.specFiles, config.maxSpecChars)
        if (text) assembly.contexts.push({ name: 'zh-ui:project-spec', text, interpolate: false })
        return assembly
      })
    }
  }

  ctx.tools.register(defineTool({
    name: 'zh_design_lint',
    description:
      'Static lint for Chinese UI source (HTML, CSS, Vue, JSX/TSX, Tailwind classes). Reports literal colors '
      + 'outside tokens, px values off the spacing scale, font stacks with no Chinese font, missing spaces '
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：准备30个有标注的中文页面样本和5个项目token集，测每条规则精确率/召回率、每页修正分钟；再做截图对比度/字体/键盘检查，静态通过但关键视觉失败率不降即否定单独采用。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“设计方向与项目 token 被正确带入任务，静态检查定位中文排版和样式问题，并由渲染审查补足视觉结论”为合格单位。三阶段投入为：首次使用｜本地扫描与可选渲染工具资源｜制定DESIGN.md/token和调整规则集｜规范编写与基线截图时间未知；持续使用｜每次静态扫描与提示上下文token｜分类误报、修改样式并截图复核｜每页finding处理分钟和误报率未知；失败恢复｜重新扫描/回退设计文件｜区分正则误判、token例外和真实违规｜错误自动修复可能破坏视觉层级。当前源码只支持机制存在，效果维度为“中文设计引导｜Skill包含排版规则与预设｜生成页面真实审美/任务适配；项目约束注入｜每次prompt assembly读取规范而非缓存系统提示｜截断和多文件冲突处理；静态lint｜十类规则和工作区边界可见｜对比度、渲染字体、布局与交互无法静态判断”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-zh-ui

English | [中文](README.zh.md)

A DeepSeek Harness (`dsh`) plugin for Chinese-language UI work. It has three parts:

1. **Skill `zh-ui-design`**: Chinese typography rules (spacing between Chinese and Latin/digits, full-width punctuation, CJK font stacks with fallbacks, line-height 1.6–1.8, 25–40 characters per line), an anti-"generated look" checklist, and a "design direction first" workflow and 4 style presets (observatory, night-shift, cobalt-poster, trust), each with complete CSS custom properties and nav / hero / pricing-card / CTA recipes. Preset text/background pairs are checked against WCAG AA (4.5:1).
2. **Project spec injection**: on every prompt assembly, reads `DESIGN.md` and `design.tokens.json` from the session's working directory and appends them as runtime context (not the cached system prompt). Nothing is injected when the files are absent.
3. **Tool `zh_design_lint`**: static scan of HTML / CSS / SCSS / Vue / JSX / TSX / Svelte sources and Tailwind classes. It does not render pages.

## zh_design_lint rules

| Rule | What it reports |
|---|---|
| `hardcoded-color` | Literal colors outside custom-property definitions (`--x:`), and Tailwind arbitrary colors `bg-[#…]`. Colors listed in `design.tokens.json` are allowed. |
| `off-scale-px` | px values in margin / padding / gap / font-size / border-radius / inset properties that are not multiples of the spacing base (default 4px); Tailwind `p-[13px]` etc. 0, 1, 2 and token px values are allowed. |
| `font-family-cjk` | `font-family` stacks with no Chinese font (PingFang SC, Microsoft YaHei, Noto Sans SC, …). `var(...)`, `inherit` and monospace stacks are skipped. |
| `cjk-latin-spacing` | Visible text where a Chinese character directly touches a Latin letter or digit. |
| `cjk-punctuation` | Half-width `, ; : ! ? .` next to Chinese characters. |
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-zh-ui",
  "version": "0.2.0",
  "description": "Chinese UI design spec for DeepSeek Harness: a zh-ui-design skill with CJK typography rules and style presets, project DESIGN.md / design.tokens.json injection, and a static zh_design_lint tool.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "files": [
    "lib",
    "skills",
    "cordis.patch.yml",
    "README.md",
    "README.zh.md",
    "LICENSE"
  ],
  "license": "MIT",
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "dsh",
    "design-system",
    "cjk",
    "typography",
    "lint"
  ],
  "engines": {
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：准备30个有标注的中文页面样本和5个项目token集，测每条规则精确率/召回率、每页修正分钟；再做截图对比度/字体/键盘检查，静态通过但关键视觉失败率不降即否定单独采用。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 src/index.ts 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“把中文设计知识、项目级约束和可执行静态规则连成同一工作流，并明确静态与渲染边界”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“用真实渲染检查对比度、字体、布局和交互｜静态通过不当作视觉验收”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:131-148](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/src/index.ts#L131-L148)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text
  if (config.injectProjectSpec) {
    {
      // Waterfall pattern mirrors @deepseek-ai/dsh-working-directory: async read, then append a context entry.
      ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
        const assembly = await next()
        if (context.agent === undefined) return assembly
        const text = await readProjectSpec(cwdOf(context.agent), config.specFiles, config.maxSpecChars)
        if (text) assembly.contexts.push({ name: 'zh-ui:project-spec', text, interpolate: false })
        return assembly
      })
    }
  }

  ctx.tools.register(defineTool({
    name: 'zh_design_lint',
    description:
      'Static lint for Chinese UI source (HTML, CSS, Vue, JSX/TSX, Tailwind classes). Reports literal colors '
      + 'outside tokens, px values off the spacing scale, font stacks with no Chinese font, missing spaces '
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-zh-ui",
  "version": "0.2.0",
  "description": "Chinese UI design spec for DeepSeek Harness: a zh-ui-design skill with CJK typography rules and style presets, project DESIGN.md / design.tokens.json injection, and a static zh_design_lint tool.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "files": [
    "lib",
    "skills",
    "cordis.patch.yml",
    "README.md",
    "README.zh.md",
    "LICENSE"
  ],
  "license": "MIT",
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "dsh",
    "design-system",
    "cjk",
    "typography",
    "lint"
  ],
  "engines": {
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：准备30个有标注的中文页面样本和5个项目token集，测每条规则精确率/召回率、每页修正分钟；再做截图对比度/字体/键盘检查，静态通过但关键视觉失败率不降即否定单独采用。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“把中文设计知识、项目级约束和可执行静态规则连成同一工作流，并明确静态与渲染边界”和“CSS 解析基于正则且不渲染，无法判断真实对比度、字号、布局、字体加载和交互可用性”推导的新方向是可让静态 finding 生成最小渲染探针和截图检查计划，把规则违规与实际视觉影响分层验证。它不是当前能力。最小验证为准备30个有标注的中文页面样本和5个项目token集，测每条规则精确率/召回率、每页修正分钟；再做截图对比度/字体/键盘检查，静态通过但关键视觉失败率不降即否定单独采用。 若合格结果不改善、误差/副作用越界或恢复负担高于“单独维护设计提示词、手工加载项目规范，再用通用 lint 与截图人工检查”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:131-148](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/src/index.ts#L131-L148)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text
  if (config.injectProjectSpec) {
    {
      // Waterfall pattern mirrors @deepseek-ai/dsh-working-directory: async read, then append a context entry.
      ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
        const assembly = await next()
        if (context.agent === undefined) return assembly
        const text = await readProjectSpec(cwdOf(context.agent), config.specFiles, config.maxSpecChars)
        if (text) assembly.contexts.push({ name: 'zh-ui:project-spec', text, interpolate: false })
        return assembly
      })
    }
  }

  ctx.tools.register(defineTool({
    name: 'zh_design_lint',
    description:
      'Static lint for Chinese UI source (HTML, CSS, Vue, JSX/TSX, Tailwind classes). Reports literal colors '
      + 'outside tokens, px values off the spacing scale, font stacks with no Chinese font, missing spaces '
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：准备30个有标注的中文页面样本和5个项目token集，测每条规则精确率/召回率、每页修正分钟；再做截图对比度/字体/键盘检查，静态通过但关键视觉失败率不降即否定单独采用。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为小范围试用。中文界面团队可在源码审查阶段试用，并以真实渲染和可访问性测试复核静态结果。 试用成功标准是“设计方向与项目 token 被正确带入任务，静态检查定位中文排版和样式问题，并由渲染审查补足视觉结论”，并且 生成页面真实审美/任务适配、截断和多文件冲突处理、对比度、渲染字体、布局与交互无法静态判断 有可接受结果；停止标准包括发生CSS 解析基于正则且不渲染，无法判断真实对比度、字号、布局、字体加载和交互可用性所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“单独维护设计提示词、手工加载项目规范，再用通用 lint 与截图人工检查”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-zh-ui

English | [中文](README.zh.md)

A DeepSeek Harness (`dsh`) plugin for Chinese-language UI work. It has three parts:

1. **Skill `zh-ui-design`**: Chinese typography rules (spacing between Chinese and Latin/digits, full-width punctuation, CJK font stacks with fallbacks, line-height 1.6–1.8, 25–40 characters per line), an anti-"generated look" checklist, and a "design direction first" workflow and 4 style presets (observatory, night-shift, cobalt-poster, trust), each with complete CSS custom properties and nav / hero / pricing-card / CTA recipes. Preset text/background pairs are checked against WCAG AA (4.5:1).
2. **Project spec injection**: on every prompt assembly, reads `DESIGN.md` and `design.tokens.json` from the session's working directory and appends them as runtime context (not the cached system prompt). Nothing is injected when the files are absent.
3. **Tool `zh_design_lint`**: static scan of HTML / CSS / SCSS / Vue / JSX / TSX / Svelte sources and Tailwind classes. It does not render pages.

## zh_design_lint rules

| Rule | What it reports |
|---|---|
| `hardcoded-color` | Literal colors outside custom-property definitions (`--x:`), and Tailwind arbitrary colors `bg-[#…]`. Colors listed in `design.tokens.json` are allowed. |
| `off-scale-px` | px values in margin / padding / gap / font-size / border-radius / inset properties that are not multiples of the spacing base (default 4px); Tailwind `p-[13px]` etc. 0, 1, 2 and token px values are allowed. |
| `font-family-cjk` | `font-family` stacks with no Chinese font (PingFang SC, Microsoft YaHei, Noto Sans SC, …). `var(...)`, `inherit` and monospace stacks are skipped. |
| `cjk-latin-spacing` | Visible text where a Chinese character directly touches a Latin letter or digit. |
| `cjk-punctuation` | Half-width `, ; : ! ? .` next to Chinese characters. |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:131-148](https://github.com/1186258278/dsh-zh-ui/blob/4ddff4f2e320285f003b0c7ca74a152440c5d255/src/index.ts#L131-L148)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text
  if (config.injectProjectSpec) {
    {
      // Waterfall pattern mirrors @deepseek-ai/dsh-working-directory: async read, then append a context entry.
      ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
        const assembly = await next()
        if (context.agent === undefined) return assembly
        const text = await readProjectSpec(cwdOf(context.agent), config.specFiles, config.maxSpecChars)
        if (text) assembly.contexts.push({ name: 'zh-ui:project-spec', text, interpolate: false })
        return assembly
      })
    }
  }

  ctx.tools.register(defineTool({
    name: 'zh_design_lint',
    description:
      'Static lint for Chinese UI source (HTML, CSS, Vue, JSX/TSX, Tailwind classes). Reports literal colors '
      + 'outside tokens, px values off the spacing scale, font stacks with no Chinese font, missing spaces '
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：准备30个有标注的中文页面样本和5个项目token集，测每条规则精确率/召回率、每页修正分钟；再做截图对比度/字体/键盘检查，静态通过但关键视觉失败率不降即否定单独采用。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
