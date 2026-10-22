# dsh-starter-zh

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[d97e7f9](https://github.com/863683348/dsh-starter-zh/tree/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe)

<!-- BEGIN META -->
[![npm 30d 128](https://img.shields.io/static/v1?label=npm+30d&message=128&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-starter-zh) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-starter-zh)
<!-- END META -->

> **实现功能**：在会话中提供欢迎、五阶段入门路线、四组固定插件建议和十项自查清单。

> **核心亮点**：统一中文资料入口降低重复组织路径，非自动诊断或有证据的动态推荐。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：欢迎引导未实现profile action，固定推荐无版本/评分/核查来源，自查不验证或保存完成状态。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，输入到资料输出怎样工作？](#detail-section-11)
  - [Q02 · 贡献与内容/行动契约限制是什么？](#detail-section-12)
  - [Q03 · 依赖、权限与读者流程是什么？](#detail-section-13)
  - [Q04 · 三阶段成本和效果怎样评价？](#detail-section-14)
  - [Q05 · 工程价值、版本化学习收据假设及采用结论？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH中文新手想知道profile/安装/写发布插件的学习步骤，需按实际版本实践。

直接中文教程/官方版本文档可替代；插件提供统一工具入口但增加安装/常驻提示和内容维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 欢迎/路线 | 五阶段学习 | profile action未实现 |
| 插件建议 | 四组固定名单 | 无动态评分/版本质量核查 |
| 自查 | 十项学习目标 | 自评非环境自动诊断 |
| 提示引导 | 鼓励调用工具 | 不保证模型必调用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH tools/systemPrompt/schema | 必需 | 注册资料工具/指引 | promptEnabledfalse仍硬注入systemPrompt |
| 模型正常调用工具 | 会话使用必需 | 选择action/解释资料 | 注入提示不保证自动调用 |
| 教程链接/对应版本文档 | 继续学习可选 | 读完整教程 | 工具只给路径/URL，不检查可访问或版本一致 |
| 用户隔离profile和操作授权 | 执行示例必需 | 安装/写插件/发布练习 | 输出命令不等授权自动执行 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/包，在可丢弃profile了解CLI | 先读官方当前命令，再按实际版本学习 |
| 查资料 | welcome/path/checklist分别查看 | 不调用未实现profile action |
| 练习 | 自己决定是否安装示例并保留结果 | 静态清单不自动判通过，所列插件另研究 |
| 恢复 | 按实际失败命令查配置/卸载 | 不因推荐名单直接批量安装/发布 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 兼容插件/模型，金额未知 | 阅读五阶段与核CLI版本 | 文档直读可替代安装 |
| 持续使用 | 常驻提示和工具文本tokens | 实践/核推荐来源 | 无后台抓取和自动更新 |
| 失败恢复 | 实际练习环境/插件卸载 | 保留失败输出查版本/配置 | 本工具不执行也不保存学习状态 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 中文路径 | 五阶段/十项清单 | 读者真掌握/完成目标 |
| 场景推荐 | 四组固定包名/理由 | 可安装性、当前质量和适合个人 |
| 会话入口 | action输出/提示引导 | 自动调用率/比直读文档省时 |

> **思考**：欢迎引导未实现profile action，固定推荐无版本/评分/核查来源，自查不验证或保存完成状态。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：统一中文资料入口降低重复组织路径，非自动诊断或有证据的动态推荐。详见[Q01](#research-q01)与[Q02](#research-q02)。

统一中文资料入口降低重复组织路径，非自动诊断或有证据的动态推荐。详见[Q01](#research-q01)与[Q02](#research-q02)。

纯数据/渲染与宿主注册分离、action枚举与结构化输出让内容易核，且不自动执行示例降低查询副作用；不足是欢迎/契约不同步和静态推荐无证据链。

<a id="detail-section-5"></a>

### 1.4 主要限制

欢迎引导未实现profile action，固定推荐无版本/评分/核查来源，自查不验证或保存完成状态。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，资料可读参考但先修profile断链和版本/推荐来源，再评估安装必要性。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持中文静态路线、插件清单和自查资料的工具入口；欢迎profile行动未实现，推荐缺版本证据，自查不验证学习完成。action同源和版本化学习路线尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/starter.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定两个lib文件的action/注册/提示、静态路线/推荐/清单及渲染；未分析配套教程或替所列插件背书，不运行目标。
- 下一步：进一步探讨先核action一致/版本链接/推荐来源，再对隔离新手任务比较直读教程和工具引导的成功及恢复人时。

**分析版本**

- **仓库**：[863683348/dsh-starter-zh](https://github.com/863683348/dsh-starter-zh)
- **版本号**：0.1.0（[固定提交 d97e7f9](https://github.com/863683348/dsh-starter-zh/tree/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨action/欢迎同源和版本化学习路线，推荐绑定研究证据、自评区分产物验证，维护成本未验证。详见[Q05](#research-q05)。

进一步探讨先核action一致/版本链接/推荐来源，再对隔离新手任务比较直读教程和工具引导的成功及恢复人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 224 | — | — | 1444 |
| .js | source | 2 | 243 | 205 | 25 | — |
| .mjs | source | 3 | 183 | 155 | 16 | — |
| .mjs | test | 2 | 90 | 81 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-starter-zh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-starter-zh/issues?q=is%3Aissue+created%3A2026-09-22T07%3A18%3A58.805Z..2026-10-22T07%3A18%3A58.805Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-starter-zh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A18%3A58.805Z..2026-10-22T07%3A18%3A58.805Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核中文入门资料工具的真实行为，区分静态路线/推荐与自动环境检查和学习成效。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，输入到资料输出怎样工作？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向刚接触DSH、想理解profile、安装和编写发布插件的中文读者。输入starter_zh四种action，输出欢迎语、五阶段学习路径、四组插件建议或十项自查文本；合格结果是读者知道下一项可核操作并能在自身版本完成练习，不是清单文本存在就环境已通过。

入口硬注入tools/systemPrompt，schema接受welcome/path/plugins/checklist。execute选择纯数组/渲染函数，工具输出action/text/items，render又把text和items各显示一次；没有环境扫描/网络/安装/写文件。可选常驻提示鼓励模型在新手问题时调用，但模型是否照做不由注册保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:23-35](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L23-L35)

依赖/配置。

<details>
<summary>查看原文（13行）</summary>

```text
const inject = ["tools", "systemPrompt"];

/** 组合行配置。 */
const Config = z.object({
  /** systemPrompt 注入的 section 排序（persona 为 0，越大越靠后）。 */
  sectionOrder: z.number().default(10),
  /** 是否注入新手引导提示词段。 */
  promptEnabled: z.boolean().default(true),
  /** 配套中文教程仓库地址（dsh-handbook-zh）。 */
  handbookUrl: z
    .string()
    .default("https://github.com/863683348/dsh-handbook-zh"),
});
```

</details>

**依据 2 · 源码核查**：[lib/index.js:40-68](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L40-L68)

四action和输出。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "starter_zh",
    description: "DSH 新手入门包：展示从 0 到 1 学习路径（path）、按场景推荐插件（plugins）、新手自查清单（checklist）、欢迎语（welcome）。当用户刚接触 DeepSeek Harness、问怎么开始/什么是 profile/装哪个插件/怎么写插件时使用。",
    parameters: {
      action: {
        type: "string",
        required: true,
        enum: ["welcome", "path", "plugins", "checklist"],
        description: "welcome = 欢迎语；path = 学习路径；plugins = 推荐插件清单；checklist = 自查清单。",
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          action: { type: "string", required: true },
          text: { type: "string", required: true },
          items: {
            type: "array",
            required: true,
            items: { type: "string" },
          },
        },
      },
      render: (_args, value) => [
        { type: "text", text: value.text },
        ...(value.items.length ? [{ type: "text", text: value.items.join("\n") }] : []),
      ],
```

</details>

**依据 3 · 源码核查**：[lib/index.js:70-98](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L70-L98)

执行/提示。

<details>
<summary>查看原文（29行）</summary>

```text
    execute: async (args) => {
      const action = args.action ?? "welcome";
      let text = "";
      let items = [];
      if (action === "welcome") {
        text = welcomeText({ handbookUrl: config.handbookUrl });
        items = checklist.map((c) => c.text);
      } else if (action === "path") {
        text = renderPath(learningPath);
        items = learningPath.map((p) => p.step + ". " + p.title);
      } else if (action === "plugins") {
        text = renderPlugins(recommendedPlugins);
        items = recommendedPlugins.map((g) => g.scenario + "：" + g.plugins.map((p) => p.name).join(", "));
      } else if (action === "checklist") {
        text = renderChecklist(checklist);
        items = checklist.map((c) => c.id);
      }
      return { action, text, items };
    },
    presentCall: (args) => ({
      card: "generic",
      title: "starter_zh · " + (args.action ?? "welcome"),
      kind: "other",
      rawInput: args,
    }),
  }));

  if (config.promptEnabled) {
    ctx.systemPrompt.section("starter-zh", STARTER_SECTION_TEXT, config.sectionOrder);
```

</details>

**依据 4 · 源码核查**：[lib/starter.js:8-44](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/starter.js#L8-L44)

五阶段。

<details>
<summary>查看原文（37行）</summary>

```text
export const learningPath = [
  {
    step: 1,
    title: "跑起来",
    zh: "安装 dsh，启动第一个会话（dsh web / headless）",
    action: "dsh web",
    doc: "01-快速开始.md",
  },
  {
    step: 2,
    title: "理解 profile",
    zh: "搞清 profile 与配置层叠加（bundles → cordis.patch.yml → 覆盖层）",
    action: "dsh --dump-config",
    doc: "02-理解-profile.md",
  },
  {
    step: 3,
    title: "装插件",
    zh: "从 awesome-dsh-plugin / npm 找到合适插件并安装到 profile",
    action: "dsh plugin --profile <name> add <plugin>",
    doc: "03-插件入门.md",
  },
  {
    step: 4,
    title: "写插件",
    zh: "用三件套（package.json + cordis.patch.yml + lib/index.js）写出第一个插件",
    action: "dsh plugin --profile <name> add <本地路径>",
    doc: "04-写第一个插件.md",
  },
  {
    step: 5,
    title: "发布",
    zh: "npm publish + GitHub dsh-plugin topic + awesome-dsh-plugin PR",
    action: "npm publish",
    doc: "06-发布插件.md",
  },
];
```

</details>

**依据 5 · 源码核查**：[lib/starter.js:87-98](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/starter.js#L87-L98)

十项清单。

<details>
<summary>查看原文（12行）</summary>

```text
export const checklist = [
  { id: "run", text: "能启动 dsh web 或 headless 会话" },
  { id: "profile", text: "理解自己的 profile 目录结构与配置层" },
  { id: "dump", text: "会看 --dump-config 输出，知道插件行出现在组合树里" },
  { id: "plugin-add", text: "成功安装过一个插件到 profile" },
  { id: "plugin-remove", text: "知道如何卸载插件" },
  { id: "tool", text: "在会话里让模型调用过至少一个插件工具" },
  { id: "write", text: "写出过一个最小插件（hello 工具）并本地验证" },
  { id: "fs", text: "了解 ctx.fs 与工作区 containment 校验" },
  { id: "publish-knowledge", text: "了解 npm publish + topic + awesome PR 全流程" },
  { id: "help", text: "知道遇到问题去哪查（官方文档 / 本教程 08-常见问题）" },
];
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献与内容/行动契约限制是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把中文入门资料和固定场景清单包成统一工具，模型无需每次临时组织路径；纯文本低副作用易审。但算法/研究增量很小，直接读教程可替代。

欢迎语引导starter_zh action=profile，schema和execute都没有profile；按schema会拒绝，绕过schema则返回空text/items。这是明确断链，不能声称提供新手profile模板。教程doc只存相对文件名并渲染纯文本，handbookUrl仅欢迎语拼接，不是版本绑定或自动读取教程内容。推荐列表硬编码12个包名/简短理由，包含自己与同作者生态，没有评分、来源、版本、兼容/质量证据或个性化选择；不能当已核安全/值得安装榜。工具不检查是否已装、是否完成清单，也不保存进度。

text已有详细路径/插件清单，items再次输出标题/组名造成重复但不是更完整研究。提示把“不要临时回答”写入常驻段，仍不能替代版本新鲜度和失败解释。

#### 证据与依据

**依据 1 · 源码核查**：[lib/starter.js:101-112](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/starter.js#L101-L112)

profile断链和教程拼接。

<details>
<summary>查看原文（12行）</summary>

```text
export function welcomeText({ handbookUrl } = {}) {
  const lines = [
    "欢迎使用 dsh-starter-zh 新手入门包！",
    "",
    "接下来你可以：",
    "1. 让我展示学习路径（starter_zh action=path）——从 0 到 1 五个阶段",
    "2. 让我推荐插件（starter_zh action=plugins）——按场景挑",
    "3. 逐项过一遍自查清单（starter_zh action=checklist）",
    "4. 查看新手 profile 模板（starter_zh action=profile）",
  ];
  if (handbookUrl) lines.push("", "配套中文教程：" + handbookUrl);
  return lines.join("\n");
```

</details>

**依据 2 · 源码核查**：[lib/index.js:43-48](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L43-L48)

无profile枚举。

```text
    parameters: {
      action: {
        type: "string",
        required: true,
        enum: ["welcome", "path", "plugins", "checklist"],
        description: "welcome = 欢迎语；path = 学习路径；plugins = 推荐插件清单；checklist = 自查清单。",
```

**依据 3 · 源码核查**：[lib/index.js:70-87](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L70-L87)

无profile分支。

<details>
<summary>查看原文（18行）</summary>

```text
    execute: async (args) => {
      const action = args.action ?? "welcome";
      let text = "";
      let items = [];
      if (action === "welcome") {
        text = welcomeText({ handbookUrl: config.handbookUrl });
        items = checklist.map((c) => c.text);
      } else if (action === "path") {
        text = renderPath(learningPath);
        items = learningPath.map((p) => p.step + ". " + p.title);
      } else if (action === "plugins") {
        text = renderPlugins(recommendedPlugins);
        items = recommendedPlugins.map((g) => g.scenario + "：" + g.plugins.map((p) => p.name).join(", "));
      } else if (action === "checklist") {
        text = renderChecklist(checklist);
        items = checklist.map((c) => c.id);
      }
      return { action, text, items };
```

</details>

**依据 4 · 源码核查**：[lib/starter.js:46-84](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/starter.js#L46-L84)

静态推荐。

<details>
<summary>查看原文（39行）</summary>

```text
/** 按场景推荐的新手插件清单。name 为 npm 包名。 */
export const recommendedPlugins = [
  {
    scenario: "刚开始",
    zh: "还没头绪时先装这几个",
    plugins: [
      { name: "dsh-starter-zh", zh: "新手引导（本插件）", why: "安装即得引导与自查清单" },
      { name: "dsh-recipe", zh: "场景配方", why: "要整套环境而不是单个插件时用" },
      { name: "dsh-need-finder", zh: "需求找插件", why: "用一句话需求匹配插件" },
    ],
  },
  {
    scenario: "专注与记忆",
    zh: "想让会话更持久、更专注",
    plugins: [
      { name: "dsh-plugin-focus", zh: "专注板", why: "跨会话钉住目标/约束/决策" },
      { name: "dsh-native-memory", zh: "原生记忆", why: "会话间长期记忆" },
      { name: "dsh-memory", zh: "记忆套件", why: "多种记忆方案选择" },
    ],
  },
  {
    scenario: "安全与治理",
    zh: "企业/团队场景的底线",
    plugins: [
      { name: "dsh-gov", zh: "治理套件", why: "策略/合规/审计一体化" },
      { name: "dsh-audit", zh: "插件健康审计", why: "体检已装插件" },
      { name: "dsh-security-guard", zh: "安全守卫", why: "安装前扫描" },
    ],
  },
  {
    scenario: "提效",
    zh: "日常开发提效",
    plugins: [
      { name: "dsh-feed", zh: "生态数据层", why: "聚合插件/仓库/更新信息" },
      { name: "dsh-insight", zh: "插件洞察", why: "指南+配方+排行+审计" },
      { name: "dsh-trend-radar", zh: "趋势雷达", why: "生态趋势看板" },
    ],
  },
];
```

</details>

**依据 5 · 源码核查**：[lib/starter.js:129-140](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/starter.js#L129-L140)

纯渲染相对文件/清单。

<details>
<summary>查看原文（12行）</summary>

```text
export function renderPath(path = learningPath) {
  const lines = ["从 0 到 1 学习路径："];
  for (const p of path) {
    lines.push(p.step + ". " + p.title + " — " + p.zh);
    lines.push("   命令: " + p.action + "  |  教程: " + p.doc);
  }
  return lines.join("\n");
}

/** 渲染检查清单。 */
export function renderChecklist(items = checklist) {
  return items.map((c) => "- [ ] " + c.text).join("\n");
```

</details>

**依据 6 · 源码核查**：[lib/index.js:65-67](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L65-L67)

重复渲染。

```text
      render: (_args, value) => [
        { type: "text", text: value.text },
        ...(value.items.length ? [{ type: "text", text: value.items.join("\n") }] : []),
```

#### 缺口

- 配套教程当前内容、CLI示例兼容与所列插件质量未由此固定数组核查。
  **影响**：不能把建议等同真实可安装/适用、安全或已完成学习。
  **进一步探讨**：可先固定宿主/教程版本和来源，逐个明确目标场景再独立核插件，不批量装清单。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、权限与读者流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包0.1.0导入schemastery/dsh-tools并依Host tools/systemPrompt；package还声明fs peer，但这两个文件未用fs，不能把声明解读成实际扫描能力。promptEnabledfalse仅关闭section注册，硬依赖表仍systemPrompt。handbookUrl只当字符串输出，不拉取/执行外部内容。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH tools/systemPrompt/schema | 必需 | 注册资料工具/指引 | promptEnabledfalse仍硬注入systemPrompt |
| 模型正常调用工具 | 会话使用必需 | 选择action/解释资料 | 注入提示不保证自动调用 |
| 教程链接/对应版本文档 | 继续学习可选 | 读完整教程 | 工具只给路径/URL，不检查可访问或版本一致 |
| 用户隔离profile和操作授权 | 执行示例必需 | 安装/写插件/发布练习 | 输出命令不等授权自动执行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/包，在可丢弃profile了解CLI | 先读官方当前命令，再按实际版本学习 |
| 查资料 | welcome/path/checklist分别查看 | 不调用未实现profile action |
| 练习 | 自己决定是否安装示例并保留结果 | 静态清单不自动判通过，所列插件另研究 |
| 恢复 | 按实际失败命令查配置/卸载 | 不因推荐名单直接批量安装/发布 |

输出路径涉及npm publish/插件安装等实际修改，属于读者决定的后续练习，不由这次查询自动触发。源码不访问本机敏感目录，使用时只传action，没有必要向它提供密钥/完整配置。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7-17](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L7-L17)

实际导入。

<details>
<summary>查看原文（11行）</summary>

```text
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import {
  checklist,
  learningPath,
  recommendedPlugins,
  renderChecklist,
  renderPath,
  renderPlugins,
  welcomeText,
} from "./starter.js";
```

</details>

**依据 2 · 源码核查**：[lib/index.js:23-35](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L23-L35)

依赖/handbook。

<details>
<summary>查看原文（13行）</summary>

```text
const inject = ["tools", "systemPrompt"];

/** 组合行配置。 */
const Config = z.object({
  /** systemPrompt 注入的 section 排序（persona 为 0，越大越靠后）。 */
  sectionOrder: z.number().default(10),
  /** 是否注入新手引导提示词段。 */
  promptEnabled: z.boolean().default(true),
  /** 配套中文教程仓库地址（dsh-handbook-zh）。 */
  handbookUrl: z
    .string()
    .default("https://github.com/863683348/dsh-handbook-zh"),
});
```

</details>

**依据 3 · 源码核查**：[lib/index.js:97-98](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L97-L98)

提示开关。

```text
  if (config.promptEnabled) {
    ctx.systemPrompt.section("starter-zh", STARTER_SECTION_TEXT, config.sectionOrder);
```

**依据 4 · 源码核查**：[lib/starter.js:24-42](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/starter.js#L24-L42)

安装/发布示例。

<details>
<summary>查看原文（19行）</summary>

```text
    step: 3,
    title: "装插件",
    zh: "从 awesome-dsh-plugin / npm 找到合适插件并安装到 profile",
    action: "dsh plugin --profile <name> add <plugin>",
    doc: "03-插件入门.md",
  },
  {
    step: 4,
    title: "写插件",
    zh: "用三件套（package.json + cordis.patch.yml + lib/index.js）写出第一个插件",
    action: "dsh plugin --profile <name> add <本地路径>",
    doc: "04-写第一个插件.md",
  },
  {
    step: 5,
    title: "发布",
    zh: "npm publish + GitHub dsh-plugin topic + awesome-dsh-plugin PR",
    action: "npm publish",
    doc: "06-发布插件.md",
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本和效果怎样评价？

**研究主题**：效果与总成本

#### 完整回答

工具无网络抓取/后台或本地状态，资源主要是常驻提示/工具文本tokens与读者实践。相较直接文档，安装/升级插件和宿主依赖也有成本；推荐包不会因本工具新版本之外自动刷新。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 兼容插件/模型，金额未知 | 阅读五阶段与核CLI版本 | 文档直读可替代安装 |
| 持续使用 | 常驻提示和工具文本tokens | 实践/核推荐来源 | 无后台抓取和自动更新 |
| 失败恢复 | 实际练习环境/插件卸载 | 保留失败输出查版本/配置 | 本工具不执行也不保存学习状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 中文路径 | 五阶段/十项清单 | 读者真掌握/完成目标 |
| 场景推荐 | 四组固定包名/理由 | 可安装性、当前质量和适合个人 |
| 会话入口 | action输出/提示引导 | 自动调用率/比直读文档省时 |

可读清单不证明真正理解profile/containment，也不证明能发布可维护插件；需要实际任务完成和失败恢复能力对照。不能因文档提生态规模或“填补空白”就推导学习效率。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:37-37](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L37-L37)

常驻引导内容。

```text
const STARTER_SECTION_TEXT = "If the user is new to DeepSeek Harness (asking how to start, what a profile is, which plugin to install, or how to write a plugin), use the `starter_zh` tool to walk them through the learning path, recommended plugins, and self-check checklist instead of improvising a one-off answer.";
```

**依据 2 · 源码核查**：[lib/index.js:70-87](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L70-L87)

静态输出无状态。

<details>
<summary>查看原文（18行）</summary>

```text
    execute: async (args) => {
      const action = args.action ?? "welcome";
      let text = "";
      let items = [];
      if (action === "welcome") {
        text = welcomeText({ handbookUrl: config.handbookUrl });
        items = checklist.map((c) => c.text);
      } else if (action === "path") {
        text = renderPath(learningPath);
        items = learningPath.map((p) => p.step + ". " + p.title);
      } else if (action === "plugins") {
        text = renderPlugins(recommendedPlugins);
        items = recommendedPlugins.map((g) => g.scenario + "：" + g.plugins.map((p) => p.name).join(", "));
      } else if (action === "checklist") {
        text = renderChecklist(checklist);
        items = checklist.map((c) => c.id);
      }
      return { action, text, items };
```

</details>

**依据 3 · 源码核查**：[lib/starter.js:87-98](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/starter.js#L87-L98)

自查而非自动检查。

<details>
<summary>查看原文（12行）</summary>

```text
export const checklist = [
  { id: "run", text: "能启动 dsh web 或 headless 会话" },
  { id: "profile", text: "理解自己的 profile 目录结构与配置层" },
  { id: "dump", text: "会看 --dump-config 输出，知道插件行出现在组合树里" },
  { id: "plugin-add", text: "成功安装过一个插件到 profile" },
  { id: "plugin-remove", text: "知道如何卸载插件" },
  { id: "tool", text: "在会话里让模型调用过至少一个插件工具" },
  { id: "write", text: "写出过一个最小插件（hello 工具）并本地验证" },
  { id: "fs", text: "了解 ctx.fs 与工作区 containment 校验" },
  { id: "publish-knowledge", text: "了解 npm publish + topic + awesome PR 全流程" },
  { id: "help", text: "知道遇到问题去哪查（官方文档 / 本教程 08-常见问题）" },
];
```

</details>

#### 缺口

- 无新手同版本任务完成率、首次成功时间或错误恢复学习对照。
  **影响**：不能承诺从0到1效果优于直读文档。
  **进一步探讨**：可用相同隔离任务对比纯教程与工具引导，计理解/练习/恢复人时并保留失败。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程价值、版本化学习收据假设及采用结论？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

纯数据/渲染与宿主注册分离、action枚举与结构化输出让内容易核，且不自动执行示例降低查询副作用；不足是欢迎/契约不同步和静态推荐无证据链。

可探讨未验证的“版本化学习路线”。让可用action从同一目录生成欢迎/参数/分支，路径绑定宿主版本和教程固定链接；推荐每项记录研究来源、适用条件/未知与更新时间。自查明确自评与实际任务产物区别，若保存进度只记读者明确结果，不自动伪造通过。相对当前散落数组，能降低失效入口和过时建议；代价是文档版本/推荐维护和用户状态隐私。可用不存在action、宿主版本变化、断链接、已装插件与练习失败夹具核输出，不应为丰富功能自动安装/发布。

推荐observe。纯中文路线可直接阅读参考，但当前缺失profile action和无证据推荐削弱安装必要性；继续可先修契约/版本来源，并比较直读教程。出现不支持命令、版本不符或建议要求装一堆不明插件时，停在资料核对，不执行/发布，改看匹配版本原文。本轮未安装目标或推荐包。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:43-48](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/index.js#L43-L48)

action单一源假设。

```text
    parameters: {
      action: {
        type: "string",
        required: true,
        enum: ["welcome", "path", "plugins", "checklist"],
        description: "welcome = 欢迎语；path = 学习路径；plugins = 推荐插件清单；checklist = 自查清单。",
```

**依据 2 · 源码核查**：[lib/starter.js:101-109](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/starter.js#L101-L109)

欢迎断链。

```text
export function welcomeText({ handbookUrl } = {}) {
  const lines = [
    "欢迎使用 dsh-starter-zh 新手入门包！",
    "",
    "接下来你可以：",
    "1. 让我展示学习路径（starter_zh action=path）——从 0 到 1 五个阶段",
    "2. 让我推荐插件（starter_zh action=plugins）——按场景挑",
    "3. 逐项过一遍自查清单（starter_zh action=checklist）",
    "4. 查看新手 profile 模板（starter_zh action=profile）",
```

**依据 3 · 源码核查**：[lib/starter.js:46-84](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/starter.js#L46-L84)

推荐证据假设。

<details>
<summary>查看原文（39行）</summary>

```text
/** 按场景推荐的新手插件清单。name 为 npm 包名。 */
export const recommendedPlugins = [
  {
    scenario: "刚开始",
    zh: "还没头绪时先装这几个",
    plugins: [
      { name: "dsh-starter-zh", zh: "新手引导（本插件）", why: "安装即得引导与自查清单" },
      { name: "dsh-recipe", zh: "场景配方", why: "要整套环境而不是单个插件时用" },
      { name: "dsh-need-finder", zh: "需求找插件", why: "用一句话需求匹配插件" },
    ],
  },
  {
    scenario: "专注与记忆",
    zh: "想让会话更持久、更专注",
    plugins: [
      { name: "dsh-plugin-focus", zh: "专注板", why: "跨会话钉住目标/约束/决策" },
      { name: "dsh-native-memory", zh: "原生记忆", why: "会话间长期记忆" },
      { name: "dsh-memory", zh: "记忆套件", why: "多种记忆方案选择" },
    ],
  },
  {
    scenario: "安全与治理",
    zh: "企业/团队场景的底线",
    plugins: [
      { name: "dsh-gov", zh: "治理套件", why: "策略/合规/审计一体化" },
      { name: "dsh-audit", zh: "插件健康审计", why: "体检已装插件" },
      { name: "dsh-security-guard", zh: "安全守卫", why: "安装前扫描" },
    ],
  },
  {
    scenario: "提效",
    zh: "日常开发提效",
    plugins: [
      { name: "dsh-feed", zh: "生态数据层", why: "聚合插件/仓库/更新信息" },
      { name: "dsh-insight", zh: "插件洞察", why: "指南+配方+排行+审计" },
      { name: "dsh-trend-radar", zh: "趋势雷达", why: "生态趋势看板" },
    ],
  },
];
```

</details>

**依据 4 · 源码核查**：[lib/starter.js:129-140](https://github.com/863683348/dsh-starter-zh/blob/d97e7f9d2a5d64ac8bbbb239e83e6a22070509fe/lib/starter.js#L129-L140)

纯渲染复用。

<details>
<summary>查看原文（12行）</summary>

```text
export function renderPath(path = learningPath) {
  const lines = ["从 0 到 1 学习路径："];
  for (const p of path) {
    lines.push(p.step + ". " + p.title + " — " + p.zh);
    lines.push("   命令: " + p.action + "  |  教程: " + p.doc);
  }
  return lines.join("\n");
}

/** 渲染检查清单。 */
export function renderChecklist(items = checklist) {
  return items.map((c) => "- [ ] " + c.text).join("\n");
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
