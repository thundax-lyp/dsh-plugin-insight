# dsh-ui-ux-pro-max

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[94b4c4f](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/tree/94b4c4f298f8ea01d6f8155fea5af6fc86e50285)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max) [![npm 30d 5,812](https://img.shields.io/static/v1?label=npm+30d&message=5%2C812&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ui-ux-pro-max) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ui-ux-pro-max)
<!-- END META -->

> **功能**：为 DSH 提供离线 UI/UX 设计检索、建议与界面审查工具。

> **亮点**：将固定的 UI/UX 知识快照集成为离线 DSH 插件，提供设计系统建议、文本规则审查与定点检索三条路径，并增加中文查询扩展与结构化输出。上游已包含数据、BM25 和设计系统方法；本项目可归属的增量主要是纯 JS 移植、CJK/中文适配、DSH 工具封装与文档化。它减少的是查找与组合入口，不是经验证的界面质量改善。见 [Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：最关键的不确定点是文本命中能否代表具体产品/页面语境。工具不读取截图、DOM 或源码；短查询可能误判产品类别，平台不匹配的规则会折半排序但保留。因此返回的结构完整、规则数或相对 BM25 分数都不能证明结论适合当前界面。见 [Q04](#research-q04)。

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
  - [Q01 · 在 DSH 中，什么使用者能用这组工具完成哪类反复出现的 UI/UX 工作？它交付什么，原有办法是什么？](#detail-section-11)
  - [Q02 · 三项工具如何从 DSH 调用到本地数据，并形成各自不同的结果？](#detail-section-12)
  - [Q03 · 相对 DSH 原生能力、手工查资料和已有 UI/UX 知识库，它的可确认增量是什么，原创贡献边界在哪里？](#detail-section-13)
  - [Q04 · 哪些机制会让建议或审查与具体界面脱节，最影响主要价值的前提是什么？](#detail-section-14)
  - [Q05 · 首次安装、持续使用和退出各依赖什么，现金/人工成本有哪些可核实边界？](#detail-section-15)
  - [Q06 · 实现结构、错误边界和维护/验证信号对小范围采用意味着什么？](#detail-section-16)
  - [Q07 · 从现有机制可推导什么值得验证的增量，什么条件下推荐试用或停止？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已经在 DSH 中工作的产品设计师与前端开发者：新建页面时用自然语言查找产品类型、风格、配色、字体、布局与技术栈建议；已有页面时按文本描述检索 UX、移动端和 React 规则；缺少单项素材时定向搜索。交付是结构化建议与规则清单，不是修改后的界面、代码提交或真实 UX 评测。源码说明三个入口分别执行完整设计系统建议、文字目标审查和定点检索；README 将手动查设计资料与规则列为原有操作背景，但没有用户研究、任务频率或人工基线数据。因此重复需求合理但仍属适用场景推断。

开发者可手动翻查设计规范/设计系统资料，也可要求通用模型提供建议；DSH 宿主提供工具和技能加载能力，但当前代码增加固定 UI/UX 本地资料、领域检索与中文工具接口。未以同任务实验比较这些替代方案，故不宣称质量或节时胜出。见 [Q01](#research-q01) 与 [Q03](#research-q03)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 设计系统建议 | 从文本需求组合风格、配色、字体、布局和规范 | query 要具体；建议不是实际页面生成 |
| 文本 UX 审查 | 按页面/现象检索严重度排序的 UX 候选规则 | 不读取页面本身；平台不匹配规则仍可能保留 |
| 设计知识检索 | 按领域/技术栈查询本地资料 | 分数仅单次查询相对值；兜底非精确命中 |
| 内置 Skill | 提示模型选工具与解读结果 | 依宿主 skills 服务，工具不依赖技能注册即可使用 |

**流程与依赖**

| 依赖/条件 | 必需性 | 用途 | 不满足的影响 |
| --- | --- | --- | --- |
| 可加载 bundle 的 DSH profile 与 Cordis | 必需 | 装载插件并注册工具 | 工具不可用 |
| 兼容的 `@deepseek-ai/dsh-tools` 与 `@deepseek-ai/dsh-skill` API | 工具/技能运行所需 | 工具定义与可选内置 Skill | API 不兼容时载入或注册失败；本轮未验收宿主 |
| 随包 `data/index.json`、`data/fonts.json` | 检索所需 | 本地设计知识、字体表 | 文件缺失或 JSON 损坏时查询可能失败 |
| 用户提供具体页面/产品/平台文字 | 结果相关性所需 | 作为分类与 BM25 查询输入 | 查询短或上下文不足时类别/排序可能偏离 |
| Node 22.19+ 或 24+ 与 DSH profile 安装权限 | 安装所需 | 运行包入口及读取本地资源 | 无法安装或载入 |

| 步骤 | 操作者/插件动作 | 判据与失败处理 |
| --- | --- | --- |
| 1 | 将固定版本包加入隔离 DSH profile 并重载 | 三项工具出现在宿主；本轮未实际执行 |
| 2 | 新页面用含产品类型、行业、风格/目标的完整 query 调用 `design_recommend` | 核对分类、配色、字体、落地页及边界；短查询结果异常则改用 `design_search` |
| 3 | 已有页面用“页面+交互+现象+平台”调用 `design_review` | 将结果逐条对照界面；平台不匹配或泛化规则由人剔除 |
| 4 | 用 `design_search` 定点查领域/技术栈规范 | BM25 结果只作候选；`fallback` 结果不是精确命中 |
| 5 | 人工决定是否应用，并在实际页面验收 | 不合适时保留团队规范/人工评审；通过 profile 删除插件退出 |

| 阶段 | 现金/资源成本 | 人工时间 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次设置 | 需要 DSH 宿主与现有模型资源；插件无第三方运行时 npm 依赖 | 需在 profile 安装并重载 | 安装耗时、宿主费用未测；本轮未安装 |
| 持续使用 | 静态搜索使用本地数据，无运行网络请求；可能有宿主模型调用费用 | 提供上下文、甄别结果、转成实际设计并验收 | tokens/任务、建议采纳率与任务总耗时未知 |
| 失败与退出 | 重做模型调用可能产生额外费用，未量化 | 改长 query、指定领域或回到手工评审；从 profile 移除 | 误导结果概率、维护负担、退出耗时未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 查询本地设计素材 | 源码实现 JSON 数据检索和 BM25 排序 | 命中是否适合具体项目 |
| 生成设计系统候选 | 代码按产品域、推理规则和多域结果组成结构化候选 | 相比手工/通用模型的质量、完整性与时间 |
| 审查已有界面 | 代码按文本描述检索规则并排序 | 是否发现真实缺陷、准确率/漏报率 |
| 迁入实际产品 | 返回令牌/清单可供人工采用 | 页面可用性、转化、可访问性或用户满意度 |

> **思考**：最关键的不确定点是文本命中能否代表具体产品/页面语境。工具不读取截图、DOM 或源码；短查询可能误判产品类别，平台不匹配的规则会折半排序但保留。因此返回的结构完整、规则数或相对 BM25 分数都不能证明结论适合当前界面。见 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将固定的 UI/UX 知识快照集成为离线 DSH 插件，提供设计系统建议、文本规则审查与定点检索三条路径，并增加中文查询扩展与结构化输出。上游已包含数据、BM25 和设计系统方法；本项目可归属的增量主要是纯 JS 移植、CJK/中文适配、DSH 工具封装与文档化。它减少的是查找与组合入口，不是经验证的界面质量改善。见 [Q02](#research-q02)、[Q03](#research-q03)。

实现分层让宿主适配集中于 plugin 层，检索/领域函数与展示分离，数据仅在 repo 层读取；Dsh SchemaSpec 入口有 fail-fast 校验。这是可维护性的源码信号，不是运行质量证明。同步 JSON 读取与固定上游快照降低运行依赖，却带来数据新鲜度和文件损坏边界。本轮未运行包测试、兼容矩阵或宿主验收。见 [Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键的不确定点是文本命中能否代表具体产品/页面语境。工具不读取截图、DOM 或源码；短查询可能误判产品类别，平台不匹配的规则会折半排序但保留。因此返回的结构完整、规则数或相对 BM25 分数都不能证明结论适合当前界面。见 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合有 UI 判断能力、在 DSH 中反复查设计规则或准备界面方案的开发者，把输出作为候选清单和本地知识入口。先从一项可逆的页面任务开始，使用具体描述和明确平台；由人对照实际页面逐条确认。短 query、领域兜底和跨平台规则须谨慎处理。若无关建议或复核成本抵消便利，应停止并回到团队规范与人工评审。见 [Q04](#research-q04) 和 [Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持三项离线资料检索/组合工具及 DSH 集成的实现结论；上游资料和 BM25/设计系统方法的继承边界由项目溯源文档说明，但未独立逐行比对。文本命中对实际设计质量、用户收益、安装兼容及持续采用仍缺运行/用户证据。上下文绑定是待验证假设，不是当前已实现贡献。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、index.js、README.md、THIRD_PARTY_NOTICES.md、docs/DATA-PROVENANCE.md、docs/DSH-COMPAT.md、docs/ARCHITECTURE.md、lib/plugin/index.js、lib/plugin/config.js、lib/tools/design-recommend.js、lib/tools/design-review.js、lib/tools/design-search.js、lib/domain/design-system.js、lib/domain/review.js、lib/search/retriever.js、lib/search/bm25.js、lib/repo/store.js、skills/ui-ux-pro-max/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查本轮固定提交中包声明、bundle、三工具实现、核心生成/审查/搜索/数据读取、上游溯源、兼容说明和内置 Skill 指南。源 inventory 覆盖固定提交 tracked files，但人工审阅限核心调用链；未检查所有数据行、所有工具分支或在线站点；未下载/核对上游 commit；未安装、运行或测试插件；未收集用户/独立反馈。研究深度为 source。
- 下一步：本次只做固定提交静态源码检查；没有执行 npm test、verify:host、build、真实 DSH profile 安装或工具调用。文档记录维护者定义的测试和兼容验证，但不视作本轮运行证据。后续需在 Node 24.19.0 与隔离 DSH profile 中重跑兼容检查，并对一批设计/审查任务进行盲评对照。

**分析版本**

- **仓库**：[ChenYiming-aaa/dsh-ui-ux-pro-max](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max)
- **版本号**：1.4.1（[固定提交 94b4c4f](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/tree/94b4c4f298f8ea01d6f8155fea5af6fc86e50285)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：如果将文本检索结果绑定到页面/代码上下文、团队约束和可复核的交付清单，UI/UX 提示可能更少脱离实际产品，也可能减少遗漏基础约束的修改轮次。最小验证是在固定任务和宿主下对比当前文本检索流程与上下文绑定流程，盲评质量并记录无关建议、修改轮数与总成本；无提升或复核成本抵消收益即否定。当前实现本身不具备此上下文绑定能力。见 [Q07](#research-q07)。

本次只做固定提交静态源码检查；没有执行 npm test、verify:host、build、真实 DSH profile 安装或工具调用。文档记录维护者定义的测试和兼容验证，但不视作本轮运行证据。后续需在 Node 24.19.0 与隔离 DSH profile 中重跑兼容检查，并对一批设计/审查任务进行盲评对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 3091 | — | — | 38319 |
| .js | source | 42 | 7218 | 5727 | 1002 | — |
| .mjs | test | 17 | 2202 | 1724 | 289 | — |
| .mjs | source | 17 | 5258 | 4549 | 375 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对固定源码中三类 UI/UX 工具是否把可追溯的领域资料带入 DSH 设计流程，区分上游继承、本地化与宿主集成的增量，并限定文本检索和无运行效果证据时的采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在 DSH 中，什么使用者能用这组工具完成哪类反复出现的 UI/UX 工作？它交付什么，原有办法是什么？

**研究主题**：场景与需求、采用判断

#### 完整回答

适合已经在 DSH 中工作的产品设计师与前端开发者：新建页面时用自然语言查找产品类型、风格、配色、字体、布局与技术栈建议；已有页面时按文本描述检索 UX、移动端和 React 规则；缺少单项素材时定向搜索。交付是结构化建议与规则清单，不是修改后的界面、代码提交或真实 UX 评测。源码说明三个入口分别执行完整设计系统建议、文字目标审查和定点检索；README 将手动查设计资料与规则列为原有操作背景，但没有用户研究、任务频率或人工基线数据。因此重复需求合理但仍属适用场景推断。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:114-144](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/README.md#L114-L144)

项目列出三个工具的目的、参数及示例查询；这些声明界定产品预期用途，不证明用户成效。

<details>
<summary>查看原文（31行）</summary>

````text
## 使用方法

### 三个工具

| 工具 | 用途 | 主要参数 |
|---|---|---|
| `design_recommend` | 产品类型 + 关键词 → 完整设计系统：风格优先级、HEX 配色与 CSS 变量、字体搭配、落地页模式、UX 要点、反模式、旋钮 | `query`（必填）、`projectName`、`stack`、`variance`、`motion`、`density` |
| `design_review` | 按 UX + 移动端 + React 性能规范审查 UI，按严重度排序，附交付前检查清单 | `target`（必填）、`platform`、`maxRules` |
| `design_search` | 按领域或技术栈检索设计知识；可选 `includeDeprecated` 包含废弃条目 | `query`（必填）、`domain`、`stack`、`maxResults`、`includeDeprecated` |

`design_search` 的 `domain` 可选值：`style` / `color` / `chart` / `landing` / `product` / `ux` / `typography` / `icons` / `gsap` / `react` / `web` / `google-fonts`；`stack` 为 22 个技术栈之一（如 `react`、`nextjs`、`vue`、`flutter`、`swiftui`、`javafx`），与 `domain` 二选一。

`design_review` 的 `platform` 可选 `web`（默认）/ `mobile` / `desktop` / `react-native` / `flutter`。它只影响**同严重度内**的排序：匹配平台的规则优先，不匹配的降权保留而非过滤；`react-native` 与 `flutter` 会额外附加该技术栈的规范。

### 常见用法

按「你正在做什么」选工具，参数写手头真实的信息：

```text
# 新项目：先拿一整套方案
design_recommend("财务 数据看板 深色 高密度", projectName: "财务中台", stack: "react")

# 改版评审：页面和问题现象一起说
design_review("移动端登录页，提交后没有任何反馈", platform: "mobile")

# 只缺某一块：按领域定点补
design_search("毛玻璃 深色", domain: "style")
design_search("金融 信任蓝", domain: "color")
```

中文直接写中文（「金融」会映射到 fintech）；但 `gsap` / `react` / `web` / `google-fonts` 的语料是英文，保留术语命中更准（`scroll reveal`、`memo`）。
````

</details>

**依据 2 · 源码核查**：[lib/tools/design-recommend.js:15-30](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/tools/design-recommend.js#L15-L30)

design_recommend 以文本 query 生成建议，接受项目名、技术栈与三个设计旋钮。

<details>
<summary>查看原文（16行）</summary>

```text
export const designRecommendTool = {
  name: 'design_recommend',
  description:
    '根据产品类型 + 关键词生成完整设计系统建议：推荐设计风格（按优先级排序）、配色方案（HEX 令牌）、' +
    '字体搭配、落地页模式、UX 规范要点，并给出选择理由与反模式。中文查询自动映射到设计数据库。' +
    '创建新项目/页面、选择风格/配色/字体时使用。可选 stack 附加技术栈规范，可选 variance/motion/density' +
    '三个 1-10 旋钮调整大胆度/动效/密度。',
  timeoutMs: TIMEOUTS.designRecommend,
  isConcurrencySafe: () => true,
  parameters: {
    query: text('产品类型 + 行业 + 气质，如「财务 数据看板 深色」「beauty spa 疗愈」「AI 搜索 极简」', true),
    projectName: text('项目名称（可选，用于输出标题）'),
    stack: stringEnum(STACKS, '技术栈键（可选），附加该技术栈的实现规范'),
    variance: integer('大胆度旋钮 1-10：1=居中/极简，10=大胆/不对称（可选）'),
    motion: integer('动效旋钮 1-10：1=克制，10=复杂编排，会附加 GSAP 动效方案（可选）'),
    density: integer('密度旋钮 1-10：1=宽松，10=紧凑/看板，会覆盖间距刻度（可选）'),
```

</details>

**依据 3 · 源码核查**：[lib/tools/design-review.js:19-31](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/tools/design-review.js#L19-L31)

design_review 输入目标描述与平台，不接收截图、DOM 或源代码。

<details>
<summary>查看原文（13行）</summary>

```text
export const designReviewTool = {
  name: 'design_review',
  description:
    '按 UX 规范清单审查现有 UI：根据审查对象描述（页面/组件类型、关键词、平台）从 ' +
    `${uxSources}数据库中检索针对性规则，按严重度（严重/高/中/低）排序，` +
    '并附上交付前通用检查清单（视觉质量/交互/深浅色模式/布局/无障碍/性能/表单/导航）。' +
    '评审页面、检查无障碍、优化交互体验时使用。',
  timeoutMs: TIMEOUTS.designReview,
  isConcurrencySafe: () => true,
  parameters: {
    target: text('页面 + 现象，如「移动端登录页，提交后没有任何反馈」「数据看板首屏加载慢」「pricing 页 转化低」', true),
    platform: stringEnum(['web', 'mobile', 'desktop', 'react-native', 'flutter'], '目标平台（可选，默认 web）'),
    maxRules: integer('返回的针对性规范条数上限（可选，默认 8）'),
```

</details>

**依据 4 · 源码核查**：[lib/tools/design-search.js:23-37](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/tools/design-search.js#L23-L37)

design_search 面向本地领域或技术栈知识检索。

<details>
<summary>查看原文（15行）</summary>

```text
export const designSearchTool = {
  name: 'design_search',
  description:
    '在 UI/UX 设计智能库中按领域或技术栈检索：风格、配色、图表、落地页、产品类型、UX 规范、字体搭配、' +
    `图标、动效(GSAP)、React 性能、移动端接口规范、Google 字体，或 ${stackCount} 个技术栈之一。` +
    '返回按相关度排序的中文结构化结果。中文查询自动映射到英文语料。',
  timeoutMs: TIMEOUTS.designSearch,
  isConcurrencySafe: () => true,
  parameters: {
    query: text('检索关键词，如「毛玻璃 深色」「表单 校验 无障碍」「safe area 安全区」', true),
    domain: stringEnum(DOMAIN_KEYS, '领域键（可选）：style/color/chart/landing/product/ux/typography/icons/gsap/react/web/google-fonts'),
    stack: stringEnum(STACKS, '技术栈键（可选，与 domain 二选一）：如 react/nextjs/vue/flutter/swiftui/javafx'),
    maxResults: integer('返回条数上限（可选，默认 3）'),
    includeDeprecated: { type: 'boolean', description: '是否包含 deprecated 条目（可选，默认 false；仅 style/stack 有该状态）' },
  },
```

</details>

#### 缺口

- 没有真实用户的任务频率、原流程耗时或返工率。
  **影响**：无法证明该任务对目标用户足够频繁或这个工具减少了多少工作。
  **进一步探讨**：在限定人群中记录同一类设计任务的原流程步骤与合格结果，再与插件使用流程比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三项工具如何从 DSH 调用到本地数据，并形成各自不同的结果？

**研究主题**：功能与机制

#### 完整回答

profile 补丁将插件包加入 DSH；宿主 apply 根据配置注册三个工具，并在 skills 服务可用时注册一个内置 Skill。design_recommend 先以 product 域推断类别，再读取推理规则并检索 style、color、landing、typography；需要时组合 UX 与技术栈条目，最后输出设计系统结构。design_review 将用户给的页面/问题描述和平台合并为检索词，取 ux、web、react 规则（react-native/flutter 再附加对应栈），去重后按严重度优先、同级按相关度排序，附固定通用清单。design_search 则按显式或推断领域/技术栈返回命中行。检索采用 BM25 和中英查询扩展，数据从包内 JSON 同步读取，Google Fonts JSON 在首次访问时懒加载。工具只处理文本与静态资料。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:5-12](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/cordis.patch.yml#L5-L12)

profile bundle 注册 ui-ux-pro-max，并配置结果数量、审查规则数和技能开关。

```text
- insert:
    - id: ui-ux-pro-max
      name: dsh-ui-ux-pro-max
      # 默认值即下列三项；省略 config 等价于使用默认值。
      config:
        maxResults: 3
        reviewRules: 8
        skill: true
```

**依据 2 · 源码核查**：[lib/plugin/index.js:40-68](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/plugin/index.js#L40-L68)

apply 注册可选 Skill provider 与三个 DSH 工具；技能服务未就绪时工具仍注册并记录降级原因。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx, rawConfig = {}) {
  const config = normalizeConfig(rawConfig)
  let skillRegistered = false
  let skillsService
  try {
    // strict=false：只判断服务当前是否已声明，不因未激活而抛错。
    skillsService = ctx.reflect?.get?.('skills', false)
  } catch {
    skillsService = undefined
  }

  if (config.skill) {
    ctx.inject(['skills'], skillCtx => {
      skillCtx.skills.registerProvider(() => skillProvider)
      skillRegistered = true
    })
  }
  if (!config.skill) {
    ctx.logger?.debug?.('[dsh-ui-ux-pro-max] config.skill=false：跳过内置技能注册，三个工具照常注册。')
  } else if (!skillRegistered && skillsService === undefined) {
    ctx.logger?.debug?.(
      '[dsh-ui-ux-pro-max] skills 服务当前未就绪：内置技能将等待该服务；三个设计工具已照常注册。',
    )
  }

  for (const tool of buildTools(config)) {
    ctx.tools.register(tool)
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/domain/design-system.js:119-165](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/domain/design-system.js#L119-L165)

设计系统路径按 product 分类、应用 reasoning 与 dials，再查询多领域数据。

<details>
<summary>查看原文（47行）</summary>

```text
export function generateDesignSystem({ query, projectName, variance, motion, density, stack }) {
  const varianceInfo = resolveDial('variance', variance)
  const motionInfo = resolveDial('motion', motion)
  const densityInfo = resolveDial('density', density)

  // Step 1: 产品搜索 → 类别
  const productResult = search(query, 'product', SEARCH_CONFIG.product.maxResults)
  const productResults = productResult.results
  const category = productResults.length ? productResults[0].row['Product Type'] : 'General'

  // Step 2: 推理规则
  const reasoning = applyReasoning(category)
  let stylePriority = reasoning.stylePriority
  if (varianceInfo) {
    stylePriority = [...varianceInfo.styleKeywords, ...stylePriority]
  }

  // Step 3: 多领域搜索（style 用「查询 + 优先级词」增强）
  const styleQuery = stylePriority.length
    ? `${query} ${stylePriority.slice(0, 2).join(' ')}`
    : query
  const styleSearch = search(styleQuery, 'style', SEARCH_CONFIG.style.maxResults)
  const colorSearch = search(query, 'color', SEARCH_CONFIG.color.maxResults)
  const landingSearch = search(query, 'landing', SEARCH_CONFIG.landing.maxResults)
  const typographySearch = search(query, 'typography', SEARCH_CONFIG.typography.maxResults)

  const styleResults = styleSearch.results
  const colorResults = colorSearch.results
  const typographyResults = typographySearch.results
  const landingResults = landingSearch.results

  // Step 4: 挑选最佳匹配
  const bestStyle = selectBestMatch(styleResults.map(r => r.row), stylePriority)
  const bestColor = colorResults.length ? colorResults[0].row : {}
  const bestTypography = typographyResults.length ? typographyResults[0].row : {}
  const bestLanding = landingResults.length ? landingResults[0].row : {}

  // Step 5: 动效旋钮 → gsap 片段
  let motionSnippet = null
  if (motionInfo) {
    const gsapResult = search(`${query} ${motionInfo.tier}`, 'gsap', 5)
    const tiered = gsapResult.results.find(r => r.row['Intensity Tier'] === motionInfo.tier)
    motionSnippet = tiered ? tiered.row : (gsapResult.results[0]?.row ?? null)
  }

  // Step 6: UX 规范要点（三级召回，保证条数下限）
  const uxGuidelines = collectUxGuidelines({
```

</details>

**依据 4 · 源码核查**：[lib/domain/review.js:55-89](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/domain/review.js#L55-L89)

审查从文本 query 检索 ux/web/react，并对具体平台追加技术栈规范。

<details>
<summary>查看原文（35行）</summary>

```text
export function buildReview({ target, platform = 'web', maxRules = LIMITS.defaultReviewRules }) {
  const query = `${target} ${platform}`
  const sources = ['ux', 'web', 'react']
  const targetGroup = PLATFORM_GROUPS[platform] || 'web'

  const collected = []
  for (const domain of sources) {
    const result = search(query, domain, LIMITS.reviewRulesPerDomain)
    for (const { row, score } of result.results) {
      const severity = SEVERITY_ORDER[row.Severity] !== undefined ? row.Severity : 'Medium'
      const group = rowGroup(row.Platform)
      // 软过滤：平台不符的规则降权而不是丢弃——用户可能确实需要跨平台建议，
      // 但它不应挤掉本平台规则。
      const weight = group === '*' || group === targetGroup ? 1 : MISMATCH_PENALTY
      collected.push({
        category: row.Category || '',
        issue: row.Issue || row.Guideline || '',
        platform: row.Platform || platform,
        description: row.Description || '',
        do: row.Do || '',
        dont: row["Don't"] || '',
        severity,
        source: domain,
        score: score * weight,
      })
    }
  }

  // 目标平台本身就是技术栈（react-native / flutter）时，补该栈的框架规范，
  // 让这两个枚举值不只是「mobile 的同义词」。这些规则是该平台的专属规范，
  // 不参与平台降权（用户已经点名了这个平台）。
  if (STACKS.includes(platform)) {
    const stackResult = searchStack(query, platform, LIMITS.reviewRulesPerDomain)
    for (const { row, score } of stackResult.results || []) {
      const severity = SEVERITY_ORDER[row.Severity] !== undefined ? row.Severity : 'Medium'
```

</details>

**依据 5 · 源码核查**：[lib/domain/review.js:104-138](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/domain/review.js#L104-L138)

相同问题去重、严重度排序并生成摘要与优先规则。

<details>
<summary>查看原文（35行）</summary>

```text
  // 去重（同一 issue 只保留严重度最高的）
  const seen = new Map()
  for (const rule of collected) {
    const key = `${rule.category}|${rule.issue}`
    const prev = seen.get(key)
    if (!prev || (SEVERITY_ORDER[rule.severity] ?? 9) < (SEVERITY_ORDER[prev.severity] ?? 9)) {
      seen.set(key, rule)
    }
  }
  const unique = [...seen.values()]

  // 严重度排序：Critical > High > Medium > Low，同级按相关度
  unique.sort((a, b) => {
    const d = (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9)
    if (d !== 0) return d
    return b.score - a.score
  })

  const priorityRules = unique.slice(0, maxRules)
  const bySeverity = { Critical: 0, High: 0, Medium: 0, Low: 0 }
  for (const rule of priorityRules) {
    bySeverity[rule.severity] = (bySeverity[rule.severity] || 0) + 1
  }

  return {
    target,
    platform,
    summary: {
      matchedRules: priorityRules.length,
      bySeverity,
      checklistSections: QUICK_REFERENCE_CHECKLIST.length,
    },
    priorityRules,
    checklist: QUICK_REFERENCE_CHECKLIST,
  }
```

</details>

**依据 6 · 源码核查**：[lib/search/retriever.js:116-145](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/search/retriever.js#L116-L145)

search 对本地领域数据执行查询扩展、BM25 排序并标记单字查询兜底。

<details>
<summary>查看原文（30行）</summary>

```text
export function search(query, domain = null, maxResults = LIMITS.defaultResults, options = {}) {
  const effectiveDomain = domain || detectDomain(query)
  const config = DOMAIN_CONFIG[effectiveDomain] || DOMAIN_CONFIG.style
  const rows = effectiveDomain === 'google-fonts'
    ? getFontRows()
    : getDomainRows(effectiveDomain)

  const { expanded, terms } = buildQueryTerms(query)
  const rowFilter = deprecatedFilter(query, options)
  const matched = searchRows(rows, config.searchCols, terms, maxResults, rowFilter)
  let results = matched.map(({ row, score }) => ({ row: pick(row, config.outputCols), score }))

  // 已登记的单字查询（如「色」）扩展后仍可能零命中：该领域语料是按产品类型/
  // 场景组织的，未必含有扩展词。此时返回领域内的默认条目，比返回空数组更有用
  // ——空数组会被模型解读成「设计库里没有这个领域」。
  // 仅对 short.zh.js 里登记过的字生效，未登记的单字照常返回空。
  if (results.length === 0 && isKnownSingleCjkQuery(query)) {
    results = rows
      .filter(row => !rowFilter || rowFilter(row))
      .slice(0, maxResults)
      .map(row => ({ row: pick(row, config.outputCols), score: 0, fallback: true }))
  }

  return {
    domain: effectiveDomain,
    query,
    expandedQuery: expanded,
    count: results.length,
    results,
  }
```

</details>

**依据 7 · 源码核查**：[lib/repo/store.js:10-53](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/repo/store.js#L10-L53)

两份数据库从包内 JSON 读取并缓存，Google Fonts 首次读取后缓存。

<details>
<summary>查看原文（44行）</summary>

```text
const INDEX_URL = new URL('../../data/index.json', import.meta.url)
const FONTS_URL = new URL('../../data/fonts.json', import.meta.url)

let _db = null

function loadDb() {
  if (_db) return _db
  const raw = readFileSync(INDEX_URL, 'utf8')
  _db = JSON.parse(raw)
  return _db
}

/** 访问内置数据库 */
export function getDb() {
  return loadDb()
}

/** 领域数据行 */
export function getDomainRows(domain) {
  const db = loadDb()
  return db.domains[domain] || []
}

/** 技术栈数据行 */
export function getStackRows(stack) {
  const db = loadDb()
  return db.stacks[stack] || []
}

/** 推理规则行 */
export function getReasoningRows() {
  return loadDb().reasoning || []
}

let _fonts = null
let _fontsLoaded = false

/** Google Fonts 行（1.1MB，首次访问才加载） */
export function getFontRows() {
  if (_fontsLoaded) return _fonts
  const raw = readFileSync(FONTS_URL, 'utf8')
  const parsed = JSON.parse(raw)
  _fonts = parsed.googleFonts || []
  _fontsLoaded = true
```

</details>

**依据 8 · 源码核查**：[lib/search/bm25.js:35-68](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/search/bm25.js#L35-L68)

分词把连续 CJK 拆成二元 token 并保留整段，同时保留单字 CJK 查询。

<details>
<summary>查看原文（34行）</summary>

```text
export function tokenize(text) {
  const str = String(text).toLowerCase()
  const tokens = []
  let i = 0
  const n = str.length
  let buf = ''
  while (i < n) {
    const ch = str[i]
    if (isWordChar(ch)) {
      buf += ch
      i += 1
      continue
    }
    if (isCJK(ch)) {
      if (buf) { tokens.push(buf); buf = '' }
      // 收集连续 CJK 片段
      let cjk = ''
      while (i < n && isCJK(str[i])) { cjk += str[i]; i += 1 }
      if (cjk.length >= 2) {
        // 二元切分
        for (let k = 0; k < cjk.length - 1; k++) tokens.push(cjk.slice(k, k + 2))
        // 也保留整段（便于精确匹配）
        tokens.push(cjk)
      } else if (cjk.length === 1) {
        tokens.push(cjk)
      }
      continue
    }
    if (buf) { tokens.push(buf); buf = '' }
    i += 1
  }
  if (buf) tokens.push(buf)
  return tokens.filter(t => t.length >= 2 || (t.length === 1 && isCJK(t)))
}
```

</details>

#### 缺口

- 本轮没有安装插件或调用宿主工具。
  **影响**：不能确认固定源码在实际 profile 中能完整加载，也不能观察模型如何解释或采纳这些结果。
  **进一步探讨**：在隔离 DSH profile 中分别调用三个工具，核对宿主载入、参数校验、结果呈现及技能服务缺失时的退化行为。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对 DSH 原生能力、手工查资料和已有 UI/UX 知识库，它的可确认增量是什么，原创贡献边界在哪里？

**研究主题**：贡献与相对优势

#### 完整回答

可确认的工程增量是把一份固定 UI/UX 资料库接入 DSH，提供三种宿主工具、内置 Skill、中文查询扩展、结构化结果及本地离线检索。固定源码将数据库快照绑定到上游 ui-ux-pro-max-skill 的 56ea9cf（2026-10-15），项目文件自述已把 BM25/设计系统流程迁为纯 JavaScript并增加 CJK 分词、中文词典和 DSH 封装；因此资料库与基础 BM25/设计系统方法不能归为本项目原创。相对手工浏览资料，它把检索、领域组合和格式化结果收在一次工具调用中；相对 DSH 通用工具，它加入了领域专用资料与规则。没有对当前 DSH 原生能力和上游代码做独立逐项比较，也没有任务结果对照，故这只支持集成与本地化增量，不能证明设计质量或市场优势。

#### 证据与依据

**依据 1 · 作者声明**：[docs/DATA-PROVENANCE.md:49-57](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/docs/DATA-PROVENANCE.md#L49-L57)

维护者将 BM25 与设计系统流程对应到上游，并把纯 JS、离线 JSON、中文词典/CJK 与 DSH 工具列为本仓库自研/适配部分。

```text
## 4. 代码层血缘

- `lib/search/bm25.js` 对应上游 `core.py` 的 `BM25`：`k1=1.5`、`b=0.75`、IDF 公式
  `log((N - freq + 0.5) / (freq + 0.5) + 1)` 一致；本仓库额外加了 CJK 二元分词。
- `lib/domain/design-system.js` 对应上游 `design_system.py` 的 `SEARCH_CONFIG`、
  `_find_reasoning_rule`、`_apply_reasoning`、`_select_best_match` 五步流程。
- `lib/domain/dials.js` 对应上游 `DIAL_TIERS`；上游在 `137597b` 已包含三个 1-10 旋钮，
  本仓库做的是中文标签重实现与 DSH 工具封装。
- 本仓库自研部分：纯 JS、离线内置 JSON、中文词典与 CJK 分词、三个 DSH 工具与卡片输出。
```

**依据 2 · 作者声明**：[THIRD_PARTY_NOTICES.md:13-22](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/THIRD_PARTY_NOTICES.md#L13-L22)

第三方声明记录数据和检索/生成逻辑来自上游适配；可用于归属声明，未独立复现逐行对照。

<details>
<summary>查看原文（10行）</summary>

```text
- **What we did:** ported the CSV database (styles, colors, typography, UX
  guidelines, charts, landing patterns, icons, motion, React performance,
  app-interface, ui-reasoning, google-fonts, and 22 stack guideline files) and
  the BM25 search / design-system generation logic into a DeepSeek Harness
  plugin: pure-JavaScript reimplementation (no Python), offline-bundled JSON
  data, Chinese-first structured tool output, and three model tools
  (`design_recommend` / `design_review` / `design_search`).

The bundled data files (`data/index.json`, `data/fonts.json`) are a converted
copy of the CSV database shipped with the upstream skill.
```

</details>

**依据 3 · 作者声明**：[docs/DATA-PROVENANCE.md:11-16](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/docs/DATA-PROVENANCE.md#L11-L16)

内置数据指向固定上游仓库、commit 和数据目录，数据不是运行时同步。

```text
| 原始上游 | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)（MIT） |
| 数据目录 | `cli/assets/data/` |
| 当前快照 ref | `56ea9cf174ed86786187daa9de0e6247cb0747e4`（2026-10-15T09:04:34+07:00） |
| 快照时间 | `2026-10-18T03:59:34.490Z`（`generated` / `syncedAt`） |
| 溯源字段 | `upstream` / `upstreamRef` / `upstreamRefKind` / `upstreamRefDate` / `upstreamDataPath` / `sourcePath` / `syncedAt` / `lineageVerifiedAt` |
| 守卫 | `tests/check-package.mjs` 断言字段非空、ref 为 40 位 commit、两份数据一致 |
```

**依据 4 · 源码核查**：[lib/plugin/index.js:26-31](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/plugin/index.js#L26-L31)

工具规格在 DSH 边界统一适配 defineTool。

```text
export function buildTools(config = DEFAULT_CONFIG) {
  const resolved = normalizeConfig(config)
  return toolSpecs.map(spec => {
    assertToolSchemaDialect(spec)
    return defineTool(applyToolDefaults(spec, resolved))
  })
```

**依据 5 · 源码核查**：[lib/search/bm25.js:48-67](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/search/bm25.js#L48-L67)

CJK 二元分词和整段/单字保留是可直接核查的本地化实现。

<details>
<summary>查看原文（20行）</summary>

```text
    if (isCJK(ch)) {
      if (buf) { tokens.push(buf); buf = '' }
      // 收集连续 CJK 片段
      let cjk = ''
      while (i < n && isCJK(str[i])) { cjk += str[i]; i += 1 }
      if (cjk.length >= 2) {
        // 二元切分
        for (let k = 0; k < cjk.length - 1; k++) tokens.push(cjk.slice(k, k + 2))
        // 也保留整段（便于精确匹配）
        tokens.push(cjk)
      } else if (cjk.length === 1) {
        tokens.push(cjk)
      }
      continue
    }
    if (buf) { tokens.push(buf); buf = '' }
    i += 1
  }
  if (buf) tokens.push(buf)
  return tokens.filter(t => t.length >= 2 || (t.length === 1 && isCJK(t)))
```

</details>

**依据 6 · 作者声明**：[README.md:70-74](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/README.md#L70-L74)

项目宣称三个 DSH 工具、离线内置数据、中文优先与纯 JavaScript。

```text
- **三个工具**：生成设计系统、审查 UX、按领域或技术栈检索。
- **数据完全内置**：4319 行设计数据库随包发布，零网络、零 Python、零第三方运行时依赖。
- **中文优先**：全中文输出，400+ 中文术语映射 + CJK 二元分词；单字查询按领域兜底。
- **设计旋钮**：`variance` 大胆度 / `motion` 动效强度（附 GSAP 方案）/ `density` 密度，均为 1-10。
- **纯 JavaScript**：BM25 检索引擎 + 设计系统生成器，Node `^22.19 || >=24`。
```

#### 缺口

- 未在本轮获取或对照上游 56ea9cf 与当前 DSH 原生设计工具的完整源码/功能基线。
  **影响**：无法精确估算独立算法改动范围或断言相对所有现有方案的独特性。
  **进一步探讨**：固定上游与 DSH 宿主源码版本，逐文件对照 BM25、设计系统流程和已有工具，并用共同任务检验结果差异。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些机制会让建议或审查与具体界面脱节，最影响主要价值的前提是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

最大的前提是调用者把目标页面、交互和问题描述成足够具体的文本；工具本身不接收代码、DOM、截图或运行状态，所以它做的是规则检索和建议汇总，不是对当前界面的直接观察。作者 Skill 明确警告 design_recommend 的短查询可能误判 product 类别，导致整套建议偏离；design_search 的单字回退虽能返回带 fallback 标记的领域默认项，但这不是精确命中。design_review 的平台参数只改变同严重度内排序，不剔除其他平台规则；结果仍是清单，不验证规则是否适用于当前组件。因而核心价值在“提供可查候选和提醒”，不在自动发现缺陷或确认合规。关键质疑是静态命中数量与排序是否能代表当前产品语境的相关性；本源码没有质量标注或外部准确率数据回答这个问题。

#### 证据与依据

**依据 1 · 作者声明**：[skills/ui-ux-pro-max/SKILL.md:20-20](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/skills/ui-ux-pro-max/SKILL.md#L20-L20)

作者警告短查询可能误判产品类别，示例指出单字查询会令整套建议跑偏。

```text
**不要把 `design_recommend` 当搜索框。** 它会先用 `product` 域判定产品类别，单字或过短的查询容易得到偶然类别（例如 `色` 会落到 "Digital Signage / Kiosk"），再据此生成整套建议就会跑偏。查素材请用 `design_search`。
```

**依据 2 · 源码核查**：[lib/tools/design-review.js:28-31](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/tools/design-review.js#L28-L31)

审查入口只接收文本 target 与平台/规则数参数。

```text
  parameters: {
    target: text('页面 + 现象，如「移动端登录页，提交后没有任何反馈」「数据看板首屏加载慢」「pricing 页 转化低」', true),
    platform: stringEnum(['web', 'mobile', 'desktop', 'react-native', 'flutter'], '目标平台（可选，默认 web）'),
    maxRules: integer('返回的针对性规范条数上限（可选，默认 8）'),
```

**依据 3 · 源码核查**：[lib/domain/review.js:55-99](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/domain/review.js#L55-L99)

规则按文本检索并以平台不匹配权重折半进入候选，不是实际界面扫描。

<details>
<summary>查看原文（45行）</summary>

```text
export function buildReview({ target, platform = 'web', maxRules = LIMITS.defaultReviewRules }) {
  const query = `${target} ${platform}`
  const sources = ['ux', 'web', 'react']
  const targetGroup = PLATFORM_GROUPS[platform] || 'web'

  const collected = []
  for (const domain of sources) {
    const result = search(query, domain, LIMITS.reviewRulesPerDomain)
    for (const { row, score } of result.results) {
      const severity = SEVERITY_ORDER[row.Severity] !== undefined ? row.Severity : 'Medium'
      const group = rowGroup(row.Platform)
      // 软过滤：平台不符的规则降权而不是丢弃——用户可能确实需要跨平台建议，
      // 但它不应挤掉本平台规则。
      const weight = group === '*' || group === targetGroup ? 1 : MISMATCH_PENALTY
      collected.push({
        category: row.Category || '',
        issue: row.Issue || row.Guideline || '',
        platform: row.Platform || platform,
        description: row.Description || '',
        do: row.Do || '',
        dont: row["Don't"] || '',
        severity,
        source: domain,
        score: score * weight,
      })
    }
  }

  // 目标平台本身就是技术栈（react-native / flutter）时，补该栈的框架规范，
  // 让这两个枚举值不只是「mobile 的同义词」。这些规则是该平台的专属规范，
  // 不参与平台降权（用户已经点名了这个平台）。
  if (STACKS.includes(platform)) {
    const stackResult = searchStack(query, platform, LIMITS.reviewRulesPerDomain)
    for (const { row, score } of stackResult.results || []) {
      const severity = SEVERITY_ORDER[row.Severity] !== undefined ? row.Severity : 'Medium'
      collected.push({
        category: row.Category || '',
        issue: row.Guideline || row.Issue || '',
        platform,
        description: row.Description || '',
        do: row.Do || '',
        dont: row["Don't"] || '',
        severity,
        source: platform,
        score,
```

</details>

**依据 4 · 源码核查**：[lib/search/retriever.js:128-137](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/search/retriever.js#L128-L137)

已登记单字查询无精确结果时输出 score=0 的领域默认项并标 fallback。

<details>
<summary>查看原文（10行）</summary>

```text
  // 已登记的单字查询（如「色」）扩展后仍可能零命中：该领域语料是按产品类型/
  // 场景组织的，未必含有扩展词。此时返回领域内的默认条目，比返回空数组更有用
  // ——空数组会被模型解读成「设计库里没有这个领域」。
  // 仅对 short.zh.js 里登记过的字生效，未登记的单字照常返回空。
  if (results.length === 0 && isKnownSingleCjkQuery(query)) {
    results = rows
      .filter(row => !rowFilter || rowFilter(row))
      .slice(0, maxResults)
      .map(row => ({ row: pick(row, config.outputCols), score: 0, fallback: true }))
  }
```

</details>

**依据 5 · 作者声明**：[skills/ui-ux-pro-max/SKILL.md:93-99](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/skills/ui-ux-pro-max/SKILL.md#L93-L99)

文档要求把分数当查询内相对排序，并把 fallback/空命中作为有限线索解释。

```text
## 结果解读（避免误读）

- `score` 是**单次查询内**的 BM25 相对分，不是百分比或置信度；不要跨领域比较，也不要把 `0.00` 当成"完全无关"（领域兜底条目就是 0）。
- **空结果 = 本次查询没匹配**，不等于库里没有这个领域。改用 2-4 个字的关键词、英文术语，或换一个 `domain` 重试；已知领域时显式传入。
- 领域自动识别可能把查询带到相邻领域（例如「动」→ ux 的动效规范）；结果不对时显式指定 `domain`。
- 有 `fallback: true` 的结果表示"没精确命中、给的是领域默认条目"，汇报时要说明，不要把它包装成检索命中。

```

#### 缺口

- 不同表述、产品领域及平台下的命中精度和漏报率未知。
  **影响**：不能判断推荐/审查的错误会多频繁地误导，亦不能将严重度排序视为缺陷优先级验证。
  **进一步探讨**：构建匿名化代表任务与人工标注标准，分别比较 precision、遗漏、错误领域与人工复核后的可用建议。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 首次安装、持续使用和退出各依赖什么，现金/人工成本有哪些可核实边界？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

运行前需要能加载 Cordis/DSH profile 的宿主及兼容的 dsh-tools、dsh-skill API；包声明 Cordis 与 DSH skill/tools peer 依赖。工具检索和生成逻辑使用随包 JSON、Node 内建模块，不依赖运行时网络或第三方 npm 包；字体数据约 1.2MB且首次查询懒加载。安装需将 npm 包加入 desktop 或 web profile 并重启/重载；Skill 可配置不注册，三个工具仍可工作。持续使用主要成本是调用者提供足够上下文、辨别泛化/默认结果并人工转成设计决策。源码没有记忆用户数据或外发查询的路径；退出可从 profile bundle 移除。现金成本、模型 token 费用、配置时间和每个合格设计任务节时都没有实测，本轮不填数值。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-50](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/package.json#L24-L50)

包要求 Node 22.19+ 或 24+，声明 DSH/Cordis peer 依赖和 dsh.bundle.patch。

<details>
<summary>查看原文（27行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "test": "node tests/check-package.mjs && node tests/check-columns.mjs && node tests/check-config.mjs && node tests/smoke.mjs && node tests/check-counts.mjs && node tests/check-skill.mjs && node tests/check-i18n.mjs && node tests/contract.mjs && node tests/check-imports.mjs && node tests/check-schema.mjs && node tests/check-showcase.mjs && node tests/check-atlas.mjs && node tests/dom-smoke.mjs",
    "verify:host": "node --import ./tests/host/register.mjs tests/host/verify-host.mjs",
    "build": "node tools/showcase/build.mjs && node tools/atlas/build.mjs",
    "build:gallery": "node tools/showcase/build.mjs",
    "build:handbook": "node tools/atlas/build.mjs",
    "serve": "node tools/serve.mjs",
    "serve:gallery": "node tools/serve.mjs --root=gallery",
    "serve:handbook": "node tools/serve.mjs --root=handbook",
    "fonts": "node tools/atlas/fetch-fonts.mjs"
  },
  "publishConfig": {
    "access": "public"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-skill": ">=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0"
  },
```

</details>

**依据 2 · 作者声明**：[THIRD_PARTY_NOTICES.md:62-72](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/THIRD_PARTY_NOTICES.md#L62-L72)

项目声明无运行时 npm 依赖、使用宿主 API，检索/生成代码为纯 JavaScript。

<details>
<summary>查看原文（11行）</summary>

```text
## Dependencies

This plugin has **no runtime npm dependencies**. It imports the DSH host APIs
declared as peer dependencies and resolved from the host runtime:

- `@deepseek-ai/cordis` — runtime composition framework (Apache-2.0 / MIT)
- `@deepseek-ai/dsh-tools` — tool definition API
- `@deepseek-ai/dsh-skill` — bundled skill provider API

All search, ranking (BM25), and design-system generation logic in `lib/` is an
independent reimplementation in plain JavaScript with no third-party code.
```

</details>

**依据 3 · 源码核查**：[lib/repo/store.js:10-53](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/repo/store.js#L10-L53)

主索引与字体表是随包 JSON；字体文件首次读取再缓存。

<details>
<summary>查看原文（44行）</summary>

```text
const INDEX_URL = new URL('../../data/index.json', import.meta.url)
const FONTS_URL = new URL('../../data/fonts.json', import.meta.url)

let _db = null

function loadDb() {
  if (_db) return _db
  const raw = readFileSync(INDEX_URL, 'utf8')
  _db = JSON.parse(raw)
  return _db
}

/** 访问内置数据库 */
export function getDb() {
  return loadDb()
}

/** 领域数据行 */
export function getDomainRows(domain) {
  const db = loadDb()
  return db.domains[domain] || []
}

/** 技术栈数据行 */
export function getStackRows(stack) {
  const db = loadDb()
  return db.stacks[stack] || []
}

/** 推理规则行 */
export function getReasoningRows() {
  return loadDb().reasoning || []
}

let _fonts = null
let _fontsLoaded = false

/** Google Fonts 行（1.1MB，首次访问才加载） */
export function getFontRows() {
  if (_fontsLoaded) return _fonts
  const raw = readFileSync(FONTS_URL, 'utf8')
  const parsed = JSON.parse(raw)
  _fonts = parsed.googleFonts || []
  _fontsLoaded = true
```

</details>

**依据 4 · 作者声明**：[README.md:76-112](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/README.md#L76-L112)

文档给出 npm/profile 安装方式和重启步骤，属于作者说明，未在本轮实际安装。

<details>
<summary>查看原文（37行）</summary>

````text
## 安装

三种方式任选其一。当前版本 **1.4.1**；以 [npm 包页](https://www.npmjs.com/package/dsh-ui-ux-pro-max) 实际发布的版本为准。

### 从插件市场 / npm

```powershell
dsh plugin --profile desktop add --save-exact dsh-ui-ux-pro-max@1.4.1
dsh plugin --profile web     add --save-exact dsh-ui-ux-pro-max@1.4.1
```

> DSH Desktop 不把 `dsh` 加入 PATH，安装后请新开一个终端；若仍提示找不到命令，先执行 `npm install -g @deepseek-ai/dsh`。

### 从源码安装（Windows）

```powershell
git clone https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max.git
cd dsh-ui-ux-pro-max
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

脚本会按 `package.json` 的 `files[]` 白名单复制文件到 profile 的共享 `node_modules`，并幂等追加注册条目；支持 `-ProfileDir` / `-ProfileName`，`-WhatIf` 可先预览。

### 手动安装（任意平台）

把包放入 `<profile>\..\node_modules\dsh-ui-ux-pro-max\`，然后在 profile 的 `cordis.patch.yml` 追加：

```yaml
- insert:
    - id: ui-ux-pro-max
      name: dsh-ui-ux-pro-max
      config: {}
```

重启 DSH Desktop，或运行 `npx @deepseek-ai/dsh web`。

安装完成后可以问一句「推荐一个金融数据看板的设计风格」来验证工具是否生效。
````

</details>

**依据 5 · 源码核查**：[lib/plugin/config.js:13-40](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/plugin/config.js#L13-L40)

三个低风险设置限制为 maxResults、reviewRules 与 skill 开关，范围有输入校验。

<details>
<summary>查看原文（28行）</summary>

```text
export const DEFAULT_CONFIG = Object.freeze({
  maxResults: 3,
  reviewRules: 8,
  skill: true,
})

/**
 * 校验并规范化配置。未知字段被忽略；类型错误直接抛 TypeError。
 * @param {unknown} raw
 */
export function normalizeConfig(raw = {}) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new TypeError('config 必须是对象')
  }
  const value = { ...DEFAULT_CONFIG, ...raw }
  const int = (name, min, max) => {
    const n = value[name]
    if (!Number.isInteger(n) || n < min || n > max) {
      throw new TypeError(`${name} 必须是 ${min}-${max} 的整数`)
    }
    return n
  }
  if (typeof value.skill !== 'boolean') throw new TypeError('skill 必须是布尔值')
  return Object.freeze({
    maxResults: int('maxResults', 1, 8),
    reviewRules: int('reviewRules', 1, 20),
    skill: value.skill,
  })
```

</details>

**依据 6 · 作者声明**：[docs/DSH-COMPAT.md:13-26](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/docs/DSH-COMPAT.md#L13-L26)

兼容矩阵将多个宿主版本列为 CI/人工验证或仅声明，并说明 Cordis 为独立版本线；本轮未重跑这些验证。

<details>
<summary>查看原文（14行）</summary>

```text
| 宿主线 | 验证日期 | 状态 | 证据 / 说明 |
|---|---|---|---|
| `0.0.1-rc.1`（本机 `node_modules` 测试运行时） | 2026-10-18 | ⚠️ 非支持线 | `npm run verify:host` 7 项**全过**，但版本低于 peer 下限，不在支持区间内，仅作开发环境参考 |
| `0.1.1-rc.1` | 2026-10-18 | ✅ CI 自动验证 | `npm run verify:host`，7 项全过 |
| `0.2.0-rc.2` | 2026-10-18 | ✅ CI 自动验证 | 同上（基线已抬到 0.2.1-rc.2） |
| `0.2.1-rc.2` | 2026-10-18 | ✅ CI 自动验证 | 同上（当前 `VERIFIED_HOST` 基线） |
| `0.3.0+` | — | ❌ 未声明 | 上界为 `<0.3.0-0`；升级前需先验证再改区间 |

> 验证宿主以**实际加载插件的那份 `@deepseek-ai/*`** 为准。本机可能同时存在
> 全局 dsh、DSH Desktop 与 profile `node_modules` 多份运行时，不要混用。
>
> `@deepseek-ai/cordis` 是**独立发版**的 DI 框架（实测 4.0.4），版本号与 DSH 的
> 0.1.x / 0.2.x 线无关，因此 peer 声明保持 `*`；`lib/config.js` 的
> `VERIFIED_CORDIS_MAJOR` 只用于守卫「若把它写成区间，必须覆盖 4.x」。
```

</details>

#### 缺口

- 宿主真实安装时间、模型用量、持续复核和失败返工成本均未测。
  **影响**：不能比较每个合格任务的总成本，也不能证明少花时间或现金。
  **进一步探讨**：使用隔离 profile 与固定设计任务记录安装/切换时间、模型 tokens、人工修改、失败返工和退出步骤。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 实现结构、错误边界和维护/验证信号对小范围采用意味着什么？

**研究主题**：工程质量与复用

#### 完整回答

代码把 DSH API 集中在 plugin 层，工具定义、领域逻辑、搜索/数据、呈现和中文映射分层；仓库内置 DSH SchemaSpec 守卫，并为宿主兼容、工具契约、数据计数和分层安排测试脚本。静态源码可支持较清晰的模块边界、无网络主路径与固定数据快照；但本轮没有执行项目测试，也没有宿主验收，兼容矩阵和测试覆盖只作为仓库维护者记录。数据上游快照为 2026-10-15，运行不会自动更新；若上游规则变化，建议可能逐渐过期。读取 JSON 通过同步文件读和 JSON.parse，坏包会让工具调用失败；本轮未做损坏数据与大型字体表性能测试。工程信号使可复核的低风险试用可行，但不能直接推导长期维护稳定性。

#### 证据与依据

**依据 1 · 作者声明**：[docs/ARCHITECTURE.md:6-39](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/docs/ARCHITECTURE.md#L6-L39)

维护者描述 plugin/tools/domain/presentation/search/repo/i18n/config 分层和依赖边界。

<details>
<summary>查看原文（34行）</summary>

````text
## 1. 分层

```
L5  plugin/        唯一认识 DSH API 的地方：apply / skill / SchemaSpec 方言
L4  tools/         一个工具一个文件：definition + execute + render + 卡片
L3  domain/        业务纯函数：设计系统生成 / 审查 / 旋钮 / 推理规则 / 清单
    presentation/  Markdown 渲染（只读结构化数据，不写业务）
L2  search/        BM25 引擎 + 检索门面（search / searchStack / detectDomain）
    repo/          唯一读 data/*.json 的地方 + 能力数字派生
L1  i18n/          中文标签 / 词典 / 查询扩展（纯数据 + 纯函数）
L0  config.js      横切常量单一源（timeout / 条数 / 渲染预算 / VERIFIED_HOST）
```

依赖方向只能从高层指向低层：

```
plugin → tools → presentation/domain → search/repo → i18n → config
```

## 2. 五条铁律（由 `tests/check-imports.mjs` 自动守卫）

1. `i18n/**` 只能依赖 `i18n/**`。
2. `repo/**` 只能依赖 `config.js` 与 `repo/**`。
3. `search/**` 不得依赖 `domain/**`。
4. `domain/**` 不得依赖 `presentation/**`、`tools/**`、`plugin/**`；
   `presentation/**` 不得依赖 `domain/**`、`tools/**`、`plugin/**`。
5. 只有 `lib/repo/**` 可以出现 `data/` 路径；只有 `lib/plugin/**` 可以
   `import '@deepseek-ai/*'`。

另有：

- 无循环依赖。
- 除 `node:` 内置模块与 `lib/plugin/**` 的宿主 API 外，不允许 bare import（零第三方运行时依赖）。
- 根入口 `index.js` 只允许依赖 `lib/plugin/**`。
````

</details>

**依据 2 · 源码核查**：[lib/plugin/index.js:26-68](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/plugin/index.js#L26-L68)

入口对每个工具做 Schema 方言校验后注册，并把 DSH API 隔离在 plugin 层。

<details>
<summary>查看原文（43行）</summary>

```text
export function buildTools(config = DEFAULT_CONFIG) {
  const resolved = normalizeConfig(config)
  return toolSpecs.map(spec => {
    assertToolSchemaDialect(spec)
    return defineTool(applyToolDefaults(spec, resolved))
  })
}

/**
 * 插件主体：注册技能（skills 缝存在且 config.skill 未关闭时）与三个工具。
 * skills 缝不存在时明确记录降级原因，便于排查（工具仍可用）。
 * @param {object} ctx
 * @param {object} [rawConfig]
 */
export function apply(ctx, rawConfig = {}) {
  const config = normalizeConfig(rawConfig)
  let skillRegistered = false
  let skillsService
  try {
    // strict=false：只判断服务当前是否已声明，不因未激活而抛错。
    skillsService = ctx.reflect?.get?.('skills', false)
  } catch {
    skillsService = undefined
  }

  if (config.skill) {
    ctx.inject(['skills'], skillCtx => {
      skillCtx.skills.registerProvider(() => skillProvider)
      skillRegistered = true
    })
  }
  if (!config.skill) {
    ctx.logger?.debug?.('[dsh-ui-ux-pro-max] config.skill=false：跳过内置技能注册，三个工具照常注册。')
  } else if (!skillRegistered && skillsService === undefined) {
    ctx.logger?.debug?.(
      '[dsh-ui-ux-pro-max] skills 服务当前未就绪：内置技能将等待该服务；三个设计工具已照常注册。',
    )
  }

  for (const tool of buildTools(config)) {
    ctx.tools.register(tool)
  }
}
```

</details>

**依据 3 · 作者声明**：[docs/ARCHITECTURE.md:111-137](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/docs/ARCHITECTURE.md#L111-L137)

仓库列出测试覆盖地图，并提醒本地全绿不等于干净 clone 全绿；本轮未运行测试。

<details>
<summary>查看原文（27行）</summary>

```text
## 7. 测试地图

| 文件 | 抓什么 |
|---|---|
| `tests/check-package.mjs` | BOM / bundle patch / files[] / 生命周期脚本 / peer 区间（含 cordis 白名单）/ 数据计数 / 上游溯源 |
| `tests/check-columns.mjs` | 列配置 ⊆ 实际列（11 域 + 22 栈）/ 标签覆盖 / 无全空列 |
| `tests/check-config.mjs` | 配置默认值 / 范围校验 / Standard Schema / 工具默认值注入 |
| `tests/smoke.mjs` | 数据库、生成、审查、检索、中文输出、清单双源 |
| `tests/check-example.mjs` | 示例页静态规范（无障碍、令牌化、状态） |
| `tests/dom-smoke.mjs` | 示例页真实 DOM 交互（jsdom 缺失时跳过） |
| `tests/check-counts.mjs` | 能力数字 == `data/meta.json` |
| `tests/check-skill.mjs` | SKILL.md 覆盖全部领域/单字/platform 与关键口径，且正文不含 frontmatter |
| `tests/check-i18n.mjs` | 中文词典无重复键、扩展结果去重 |
| `tests/contract.mjs` | schema ↔ execute 返回值一致 |
| `tests/check-imports.mjs` | 分层、无环、data 路径唯一、宿主 API 边界 |
| `tests/check-schema.mjs` | SchemaSpec 方言 + 负例 |
| `tests/host/verify-host.mjs` | 真实宿主包兼容（`DSH_MODULE_ROOT` 指定，不进 `npm test`） |

### 测试环境的两种形态

| | 本地工作树（本机） | 干净 clone / CI |
|---|---|---|
| `node_modules` | 常为软链接到同级主工作树 | 不存在，需按需安装 |
| `dom-smoke` | 跑 jsdom 真实交互 | 缺 jsdom 时**静默跳过**（CI 另装隔离 jsdom 后强制跑） |
| `verify:host` | 解析到本机宿主版本 | 需 `DSH_MODULE_ROOT` 指向隔离安装目录 |

结论：**本地全绿 ≠ 干净 clone 全绿**，判断以 CI 为准。新增测试不要依赖本机路径或父工作树。
```

</details>

**依据 4 · 作者声明**：[docs/DATA-PROVENANCE.md:11-16](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/docs/DATA-PROVENANCE.md#L11-L16)

内置资料绑定到 2026-10-15 的上游快照且不是自动同步。

```text
| 原始上游 | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)（MIT） |
| 数据目录 | `cli/assets/data/` |
| 当前快照 ref | `56ea9cf174ed86786187daa9de0e6247cb0747e4`（2026-10-15T09:04:34+07:00） |
| 快照时间 | `2026-10-18T03:59:34.490Z`（`generated` / `syncedAt`） |
| 溯源字段 | `upstream` / `upstreamRef` / `upstreamRefKind` / `upstreamRefDate` / `upstreamDataPath` / `sourcePath` / `syncedAt` / `lineageVerifiedAt` |
| 守卫 | `tests/check-package.mjs` 断言字段非空、ref 为 40 位 commit、两份数据一致 |
```

**依据 5 · 源码核查**：[lib/repo/store.js:15-19](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/repo/store.js#L15-L19)

主数据库首次通过同步 readFileSync 与 JSON.parse 载入并缓存。

```text
function loadDb() {
  if (_db) return _db
  const raw = readFileSync(INDEX_URL, 'utf8')
  _db = JSON.parse(raw)
  return _db
```

#### 缺口

- 本轮未运行 package tests、CI 或真实宿主兼容任务。
  **影响**：不能把维护者测试设计写成当前环境下的通过结果。
  **进一步探讨**：遵守目标环境版本运行仓库检查，并对支持的 DSH 宿主版本执行隔离 host-compat；单独核查离线安装与损坏/缺失数据恢复。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 从现有机制可推导什么值得验证的增量，什么条件下推荐试用或停止？

**研究主题**：新假设与验证、采用判断

#### 完整回答

待验证假设：对有固定设计审查流程的 DSH 前端团队，如果把自然语言设计建议与项目实际页面/代码快照、团队约束和验收清单关联，并在生成后由人工复核，可能减少遗漏基础设计约束的轮次；当前插件没有页面感知，也没有证明这项收益。最小实验是在同一批熟悉 DSH 的开发者、相同的页面改造任务、固定宿主/模型/时间预算下，比较普通人工/模型流程与“插件提示后人工确认”流程，由盲评者按同一视觉、可访问性和实现约束评分，并记录修改轮数和无关建议比例；若质量未提高、误导建议增加或复核耗时抵消收益，就否定扩展假设。现有版本适合有 UI 判断能力的开发者将其作为设计资料索引与检查提示小范围试用；不适合把它当自动审计、无障碍认证或无需人工审核的设计决策。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools/design-recommend.js:64-75](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/tools/design-recommend.js#L64-L75)

工具将文本与旋钮/技术栈传给结构化生成器后直接返回建议结果，没有代码或 UI 输入。

<details>
<summary>查看原文（12行）</summary>

```text
  async execute(args) {
    const ds = generateDesignSystem({
      query: args.query,
      projectName: args.projectName,
      variance: args.variance,
      motion: args.motion,
      density: args.density,
      stack: args.stack,
    })
    ds.stackName = args.stack || null
    return ds
  },
```

</details>

**依据 2 · 源码核查**：[lib/tools/design-review.js:88-94](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/lib/tools/design-review.js#L88-L94)

审查仅从目标描述生成规则结果。

```text
  async execute(args) {
    return buildReview({
      target: args.target,
      platform: args.platform || 'web',
      maxRules: args.maxRules || LIMITS.defaultReviewRules,
    })
  },
```

**依据 3 · 作者声明**：[skills/ui-ux-pro-max/SKILL.md:46-56](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/skills/ui-ux-pro-max/SKILL.md#L46-L56)

作者建议输入具体页面/交互/现象并逐条核对规则，承认平台规则不匹配项仍保留。

<details>
<summary>查看原文（11行）</summary>

````text
连同**页面、关键交互、出错的现象**一起描述，得到按严重度排序的规范 + 交付前检查清单：

```
design_review(target: "移动端登录页，提交后没有任何反馈", platform: "mobile")
design_review(target: "数据看板首屏加载慢，图表出来晚", platform: "web", maxRules: 12)
```

- `target` 写具体：页面/组件 + 关键交互 + 状态或现象（「结算页优惠券输入 错误态」比「结算页」有用得多）。
- `platform` 只影响**同严重度内的先后**：**严重度仍是第一排序键**，匹配平台的规则靠前，不匹配的 ×0.5 降权但**保留**（不是硬过滤）。`desktop` 按 `web` 口径处理（库内没有桌面专属规则）；`react-native` / `flutter` 会额外追加该栈的框架规范。

把返回的规则当作检查清单逐条核对；若某条是刻意例外，在汇报里说明而不是悄悄跳过。
````

</details>

**依据 4 · 作者声明**：[docs/DSH-COMPAT.md:15-19](https://github.com/ChenYiming-aaa/dsh-ui-ux-pro-max/blob/94b4c4f298f8ea01d6f8155fea5af6fc86e50285/docs/DSH-COMPAT.md#L15-L19)

兼容记录区分 CI 自动验证、人工验证和仅声明覆盖；本次推荐仍基于源码、实际主机不在本轮复验。

```text
| `0.0.1-rc.1`（本机 `node_modules` 测试运行时） | 2026-10-18 | ⚠️ 非支持线 | `npm run verify:host` 7 项**全过**，但版本低于 peer 下限，不在支持区间内，仅作开发环境参考 |
| `0.1.1-rc.1` | 2026-10-18 | ✅ CI 自动验证 | `npm run verify:host`，7 项全过 |
| `0.2.0-rc.2` | 2026-10-18 | ✅ CI 自动验证 | 同上（基线已抬到 0.2.1-rc.2） |
| `0.2.1-rc.2` | 2026-10-18 | ✅ CI 自动验证 | 同上（当前 `VERIFIED_HOST` 基线） |
| `0.3.0+` | — | ❌ 未声明 | 上界为 `<0.3.0-0`；升级前需先验证再改区间 |
```

#### 缺口

- 插件建议对实际完成页面的质量、耗时和返工影响未知。
  **影响**：目前只能把它作为提示/检索工具，不能据此承诺效果提升或持续部署价值。
  **进一步探讨**：按相同任务和验收量表做小样本对照；记录盲评质量、遗漏率、无关建议、总耗时与模型成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
