# DeepRead 精读助手

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[9462f1e](https://github.com/xiehuan123/dsh-deepread/tree/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746)

<!-- BEGIN META -->
[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiehuan123/dsh-deepread) [![npm 30d 2,894](https://img.shields.io/static/v1?label=npm+30d&message=2%2C894&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepread) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepread)
<!-- END META -->

> **功能**：将文本、文件和微信文章整理为精读报告、知识地图与复习问题，支持预算预检及文件导出。

> **亮点**：[Q01](#research-q01) 支持结构化精读与宿主接线的集成贡献，较普通摘要提供可供人工核验的观点、论据与位置字段；[Q03](#research-q03) 的存储epoch绑定也是可复用工程设计。但这些字段由模型生成，当前没有原文对齐保障，不能把“输出可追溯格式”升级为“证据已核真”。

> **主要限制**：[Q02](#research-q02) 的PDF空页过滤后重编号和长文分段上限会改变引用位置与覆盖范围；[Q03](#research-q03) 没有机械核验引句和支持关系。[Q04](#research-q04) 预算是估计，取消标记不等于供应商停止。核心质疑是读者能否知道真正读了什么、引句是否存在以及失败还在花多少资源，当前只适合人工核验的辅助整理。

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
  - [Q01 · 插件与打包Skill各实现什么，较通用摘要增加什么？](#detail-section-11)
  - [Q02 · 来源提取和长文分段实际覆盖多少材料？](#detail-section-12)
  - [Q03 · 观点证据位置和置信度是否被机械验证？](#detail-section-13)
  - [Q04 · 预算、后台与取消如何影响真实成本和恢复？](#detail-section-14)
  - [Q05 · 采用依赖、效果证据和退出条件是什么？](#detail-section-15)
  - [Q06 · 从已查限制可提出什么可证伪改进？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要从材料提取论点、论据和引句的研究与学习者，提供模式化精读报告。[Q01](#research-q01) 以普通摘要和人工标注为参照，合格结果要求引文真实且位置可查，字段齐全不等于证据正确。真实学习和工时收益没有本次数据。

参照将原文交给通用模型做摘要、或人工标注后整理。增量是把观点/证据/位置模板、分段、预算与导出组织为宿主工具和便携方法；模型推理与文件/网络服务继承宿主，不称独立事实核查算法，未比较外部竞品效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| deepread五种模式 | 整理摘要、精读、知识图、费曼/全书报告 | 依赖模型；引句/置信度未机械核验，长文有覆盖上限 |
| 多文档对比 | 对2至10篇篇目要点做综合 | 每篇前30000字符，综合基于摘取要点 |
| 文件与PDF提取 | 输入宿主文件并提供文本 | PDF30MiB上限，无文本需OCR；空页过滤可移位页号 |
| 微信链接与缓存 | 取得正文并减少重复抓取 | 反爬可能仍返回验证页；缓存有时间与降级边界 |
| 预算预检 | 不调用模型估token和耗时 | 会读源/联网，不是费用硬上限 |
| 可选后台jobs | 长文/批量进度与结果读取 | 依赖jobs；取消不证明供应商已停止 |
| md/mm/html导出 | 保存报告和导图 | 逐文件写入，失败可部分完成 |
| 打包dsh-deepread Skill | Agent用自有工具执行精读方法 | 与宿主直接模型流水线保证不同 |
| Web面板 | 预算展示及提交当前会话 | 仅Web服务与slot可用时 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node与DSH宿主 | 宿主工具必需 | Node ^22.19或≥24，fs/llm/tools/web/模型选择/沙箱策略 | 版本声明及通配peer不证明跨版本兼容 |
| 已配置模型供应商 | 分析必需 | 生成结构化报告 | 缺默认选择时尝试首个路由；无凭据则失败 |
| 原文可提取性 | 内容分析必需 | 文本、文件/PDF或微信正文 | 扫描PDF先OCR，反爬和页号需人工核对 |
| storageDomain | 持久缓存/校准可选 | 正文缓存与速率记录 | 不可用可内存降级，重启不保留 |
| jobs服务 | 后台可选 | 长任务进度、取消与结果 | 不可用回前台，取消传播有边界 |
| Web与React/slots | 面板可选 | 客户端交互与预算HTTP | 无Web仍可有宿主工具，不能由UI加载判定分析成功 |
| 宿主fs写权限 | 导出时必需 | 写报告/导图 | 失败记note，可能已有部分文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认宿主/模型路由和材料可读，选择短可核对输入 | 无凭据不把预检通过当分析成功 |
| 预检 | 工具解析来源估计各模式调用/耗时 | 仅估计，核对实际覆盖与可接受资源 |
| 分析 | 插件分段调用模型并组织字段/综合 | 用户核原文引句、页号与遗漏，而非只看格式 |
| 导出/恢复 | 用户选择导出并检查meta.note和实际文件 | 取消/超时后查调用与文件，不自动假定无副作用 |
| 退出 | 用户停用工具并保留需追溯原文/报告 | 模型已收到材料和已写文件不由停用撤回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主、模型接入与文件资源，金额未知 | 版本/凭据配置、提取完整性和引用抽查，工时未知 | 便携Skill零额外运行依赖不等于宿主全流程零依赖 |
| 持续 | 分段+综合+最多3次重试的模型调用，正文缓存存储 | 逐条引证核验、长文范围检查与兼容维护 | 预算非真实货币上限，质量/费用未实测 |
| 失败恢复 | 可能继续的外部调用、补读与重跑资源 | 查取消状态、补漏反证、修复部分导出 | 任务失败不证明供应商停止或文件未写 |
| 退出 | 已有缓存/导出仍占存储 | 核对保留与清理、退回人工/常规模型辅助 | 已发材料和已写文件不自动回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 输出组织 | 提示词与清洗器产生论点/证据/位置字段 | 引句是否存在且支持结论 |
| 长文整理 | 分段和摘要综合真实接线 | 被截断材料与反证是否重要 |
| 预算 | 不调用模型的字符/速率估计 | 真实费用、重试及总耗时偏差 |
| 作者局部验收 | 历史Web面板/预算交互记录 | 当前提交完整精读和跨宿主成功 |
| 研究/学习价值 | 机制可供人工核验辅助 | 无本次质量、节时、记忆保持或ROI对照 |

> **思考**：[Q02](#research-q02) 的PDF空页过滤后重编号和长文分段上限会改变引用位置与覆盖范围；[Q03](#research-q03) 没有机械核验引句和支持关系。[Q04](#research-q04) 预算是估计，取消标记不等于供应商停止。核心质疑是读者能否知道真正读了什么、引句是否存在以及失败还在花多少资源，当前只适合人工核验的辅助整理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 支持结构化精读与宿主接线的集成贡献，较普通摘要提供可供人工核验的观点、论据与位置字段；[Q03](#research-q03) 的存储epoch绑定也是可复用工程设计。但这些字段由模型生成，当前没有原文对齐保障，不能把“输出可追溯格式”升级为“证据已核真”。

模块化来源、模型、预算、缓存与导出职责利于定位问题；[Q03](#research-q03) optional-storage的epoch防止旧异步句柄落入新绑定，是可借鉴生命周期设计。相反，证据语义仍依赖提示词、PDF编号与覆盖未保留原始锚点、重试统计/取消不闭合，说明类型与格式校验不能替代任务正确性。已查实际lib对应关键路径，未构建或运行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的PDF空页过滤后重编号和长文分段上限会改变引用位置与覆盖范围；[Q03](#research-q03) 没有机械核验引句和支持关系。[Q04](#research-q04) 预算是估计，取消标记不等于供应商停止。核心质疑是读者能否知道真正读了什么、引句是否存在以及失败还在花多少资源，当前只适合人工核验的辅助整理。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议观察。[Q02](#research-q02) 与 [Q03](#research-q03) 的定位和证据核验先于正式引证；熟悉模型辅助阅读者先用可逐句核对短文本，发现页号移位、尾部遗漏或引句不符就停止自动综合并回原文人工整理。[Q04](#research-q04) 的取消结果未知时先查模型调用和文件，再决定重试，不把预算或job结束当费用停止保证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持工具/Skill注册、模式化模型流水线、预检及导出；来源完整性、引证真实性和取消成本有具体限制。作者历史验收是局部交互且核心调用受阻，不作为当前整体成功；阅读任务契约是未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/host/plugin.ts、src/host/source.ts、src/host/llm.ts、src/host/budget.ts、src/host/config.ts、src/host/cache.ts、src/host/optional-storage.ts、src/host/export.ts、src/host/pdf.ts、src/client/index.ts、skills/dsh-deepread/SKILL.md、lib/types/index.js、lib/types/host/plugin.js、lib/types/host/llm.js、lib/types/host/pdf.js、evidence/dr-210/acceptance.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交定向检查Host注册、来源/缓存、全部llm与budget、模式分段/清洗/综合、后台取消、导出写入、PDF编号与客户端提交；PDF解析其他字体/对象处理非完整审计。读取历史作者acceptance只用于界定证据，不重新执行。完整INVENTORY含生成运行时和声明排除项，src/lib不当独立原创代码量。
- 下一步：本次仅源码检查和固定作者记录阅读，未安装、构建、运行目标代码、模型/基准或宿主验收。作者历史局部交互不升级为本次执行或当前提交已通过，未来实验均未执行。

**分析版本**

- **仓库**：[xiehuan123/dsh-deepread](https://github.com/xiehuan123/dsh-deepread)
- **版本号**：1.0.1（[固定提交 9462f1e](https://github.com/xiehuan123/dsh-deepread/tree/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出未验证的阅读任务契约：固定原始锚点与覆盖账本、引句匹配后标已核、逐次模型尝试预算及端到端取消/未知状态。以空页PDF、尾部反证、近似引句与取消重试为最小反例；任何错误页号、未读全书结论或新重试都削弱充分性，新增核验成本也需比较。

本次仅源码检查和固定作者记录阅读，未安装、构建、运行目标代码、模型/基准或宿主验收。作者历史局部交互不升级为本次执行或当前提交已通过，未来实验均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 2612 | — | — | 30421 |
| .md | example | 4 | 179 | — | — | 3367 |
| .js | source | 15 | 4906 | 4818 | 87 | — |
| .mjs | source | 1 | 16 | 14 | 0 | — |
| .ts | source | 19 | 5219 | 4813 | 92 | — |
| .mjs | test | 37 | 3961 | 3497 | 100 | — |
| .ts | example | 1 | 18 | 12 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/xiehuan123/dsh-deepread/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：将材料整理为带来源位置的精读报告，实际可追溯能力、长文覆盖和成本控制是否足以支持研究者采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件与打包Skill各实现什么，较通用摘要增加什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

DeepRead面向需要回查材料的研究与学习任务，目标交付是观点、论据、原文引句和位置，以及知识关系与回忆问题，而不止压缩主题。参照办法是把全文交给通用聊天模型要求摘要，或人工标注后整理；本次没有与某一外部产品做同条件比较，因此只判断工作流结构增量。合格结果应让重要观点能定位到实际支持它的原文，并明确覆盖范围和缺证据项，不能仅以报告字段齐全验收。真实学习保持或研究效率收益没有本次结果。

本包同时提供DSH宿主插件、Web客户端与打包Skill。package入口是lib/types/index.js，继续导出宿主plugin；宿主注册deepread工具，并在skills服务可用时读取打包SKILL注册为模型/用户可调用资源。Skill形式要求外部Agent用自身读文件和网页工具完成方法，宿主工具形式则直接调用ctx.llm生成JSON，再清洗和导出，不应把两种执行保证混为一谈。客户端通过当前会话输入区排队一条精读指令，面板本身并非独立模型会话。源码支持的是模式化提示词、分段组织、预算预检与导出的一体化，而非新的阅读推理算法。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-19](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/package.json#L7-L19)

真实宿主和Web客户端入口声明。

<details>
<summary>查看原文（13行）</summary>

```text
  "main": "./lib/types/index.js",
  "types": "./lib/types/index.d.ts",
  "engines": {
    "node": "^22.19 || >=24"
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "import": "./lib/types/index.js"
    },
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./dsh-plugin.json": "./dsh-plugin.json",
```

</details>

**依据 2 · 源码核查**：[src/host/plugin.ts:1042-1065](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L1042-L1065)

deepread工具和可选打包Skill实际注册。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.effect(() => ctx.tools.register(tool))

  const registerPackagedSkill = (skillCtx: HostContext): void => {
    if (skillCtx.skills === undefined) return
    const source = readFileSync(PACKAGED_SKILL_URL, 'utf8')
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source)
    if (frontmatter === null) throw new Error('packaged dsh-deepread skill has invalid frontmatter')
    const metadata = frontmatter[1]
    const content = frontmatter[2]
    if (metadata === undefined || content === undefined) {
      throw new Error('packaged dsh-deepread skill has invalid frontmatter')
    }
    const description = /^description:\s*(.+)$/m.exec(metadata)?.[1]?.trim()
    if (description === undefined || description === '') {
      throw new Error('packaged dsh-deepread skill has no description')
    }
    skillCtx.effect(() => skillCtx.skills!.register({
      name: 'dsh-deepread',
      description,
      content,
      invocation: { modelInvocable: true, userInvocable: true },
      source: 'bundled',
      resourceBase: { kind: 'directory', path: dirname(fileURLToPath(PACKAGED_SKILL_URL)) },
    }))
```

</details>

**依据 3 · 源码核查**：[skills/dsh-deepread/SKILL.md:8-16](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/skills/dsh-deepread/SKILL.md#L8-L16)

便携Skill由Agent使用现有工具执行，与宿主直接模型流水线不同。

```text
你是精读分析师。用户给你一篇文章或一本书（文件路径、链接或直接粘贴的正文），你要**自己完成分析**（用你现有的读文件 / 抓网页能力），并按对应模式输出结构化报告。默认**只在对话中展示 Markdown 报告**；用户明确要求导出时再写文件。

## 第 0 步：读入内容

1. 用户给了**文件路径**：读该文件（.txt/.md/.markdown/.html/.pdf）。
   - PDF 必须使用环境中可靠、经过验证的文本提取工具（如 `pdftotext`、宿主提供的 PDF 阅读器或 OCR）。抽取后检查页数、文本完整性和乱码情况；如果无法可靠读取，明确说明限制并请用户提供 OCR 版本或正文，不能基于不完整抽取继续生成结论。扫描版 PDF 必须先 OCR。
2. 用户给了**链接**：先抓取页面（微信公众号 mp.weixin.qq.com 是服务端渲染可直接抓）。正文容器优先 `id=js_content`、`class=rich_media_content`、`article`、`main`；剔除 script/style/nav/footer；实体解码。知乎/掘金等反爬站点抓不到就请用户粘贴正文。
3. **粘贴的正文**：直接使用。
4. 内容超过约 9000 字：按段落切成每段 ≤6000 字的小节，逐节分析，最后综合。
```

**依据 4 · 源码核查**：[src/client/index.ts:13-23](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/client/index.ts#L13-L23)

Web提交通过当前会话输入区排队指令。

<details>
<summary>查看原文（11行）</summary>

```text
function submitFromContext(ctx: ClientContext): SubmitDeepread {
  return (instruction) => {
    try {
      const currentId = ctx.sessions.list.getSnapshot().current
      if (currentId === undefined) return '当前没有打开的会话，请先在对话中打开一个会话'
      const sessionCtx = ctx.sessions.scope(currentId)
      if (sessionCtx === undefined) return '精读提交通道不可用，请直接对对话说：请用 deepread 精读 <内容>'
      const input = ctx.conversation.input.for(sessionCtx)
      input.setDraft(instruction)
      input.submit('queue')
      return null
```

</details>

**依据 5 · 源码核查**：[src/host/plugin.ts:155-174](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L155-L174)

结构化观点/引句/位置提示词，支撑相对普通摘要的组织增量。

<details>
<summary>查看原文（20行）</summary>

```text
  const SECTION_SCHEMA = [
    '{',
    '  "title": "本节标题（无法判断时用「第N部分」）",',
    '  "summary": "1-2 句话概括本节内容",',
    '  "thesis": "本节最核心的观点或论点（一句话）",',
    '  "arguments": [{"claim": "分论点", "evidence": "支撑的论据或推理", "quote": "原文关键句（可选）", "source": "原文位置（如 第N页/第N段；原文没有位置标记时留空）"}],',
    '  "quotes": [{"text": "值得摘录的原文原句", "context": "这句话在论证什么（可选）", "source": "原文位置（如 第N页；没有标记时留空）"}],',
    '  "concepts": [{"term": "核心概念/术语", "explanation": "它在文中的含义"}],',
    '  "questions": ["读者应继续追问的批判性问题"]',
    '}',
  ].join('\n')

  function sectionSystem(depth: DeepreadDepth, language: OutputLanguage, focus: string) {
    const lang = language === 'en' ? 'English' : (language === 'zh' ? '简体中文' : '与原文语言保持一致')
    let sys = '你是一位专业的精读分析师，擅长从书籍和文章中提取核心观点、论证结构与关键论据。\n'
      + '请严格只输出一个 JSON 对象（不要输出任何解释、前后缀或 Markdown 代码块），字段如下：\n'
      + SECTION_SCHEMA + '\n'
      + '要求：thesis 必须凝练；arguments 的 claim 是分论点、evidence 是支撑它的论据或推理；quote 尽量引用原文原句；questions 要体现批判性阅读。\n'
      + '引用溯源：若原文包含【第N页】等位置标记，arguments 与 quotes 的 source 字段必须注明对应页码或段落位置；没有标记则留空。\n'
      + '输出语言：' + lang + '。\n'
```

</details>

#### 缺口

- 没有同一材料任务下与通用摘要或人工标注的质量/工时对照。
  **影响**：只能说明工作流增量，不能证明学习或研究效果更好。
  **进一步探讨**：固定重要论点与原文支持金标，比较证据正确率、遗漏率和人工复核时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 来源提取和长文分段实际覆盖多少材料？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

来源优先顺序为URL、path、text。URL只允许微信域名，优先web.fetch，接口不可用时退回Node全局fetch；默认缓存七天，失败可带note回退旧缓存。反爬页面重试失败时仍可能把短验证页交给模型，只是不写缓存，因此URL合法与取得正文是不同判据。文件由宿主fs读取，PDF有30MiB读取上限，无可提取文本时提示先OCR，不应把扫描图片内容当已读。网页HTML清洗会改变原段落形态，粘贴文本也没有自动稳定段落锚点。

PDF位置有直接影响核心价值的实现限制：extractPdfText先过滤空文本页，再按剩余数组索引生成“第N页”。若原PDF第2页空白或提取不到文本，原第3页会被标成第2页。生成的包运行时同样如此；这不是泛泛“模型可能幻觉”，而是定位预处理就可能偏移。不能把报告页码无条件用于正式引用。

长文覆盖也有上限。先截到maxInputChars（默认400000字符），再分块并只保留maxParts（默认20，chunkChars默认6000）；由于按段落和句子切分，实际保留字符数并非精确20×6000，但后续部分可能不进入模型。quick及batch每篇只取前30000字符。map汇总再只传每章前三条论点，批量也基于简短篇目要点综合。这些是受限材料整理，不是整本书保证完整取证；元数据保留的总字符数不等于所有字符都被分析。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/source.ts:106-158](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/source.ts#L106-L158)

web服务/全局fetch和反爬重试实际路径，失败后可能保留原短页面。

<details>
<summary>查看原文（53行）</summary>

```text
async function fetchArticleText(url: string): Promise<string> {
  let result = null
  let webError = null
  if (web !== undefined) {
    try {
      result = await web.fetch({ url })
    } catch (err) {
      webError = err
    }
  }
  if (result === null || typeof result !== 'object' || typeof result.statusCode !== 'number') {
    // 回退：web 服务无可用 provider 时用 Node 全局 fetch 兜底
    try {
      const resp = await globalThis.fetch(url, {
        redirect: 'follow',
        headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36' },
      })
      const bodyText = await resp.text()
      result = { statusCode: resp.status, body: { kind: 'html', content: bodyText } }
    } catch (err) {
      const reason = webError !== null ? errorMessage(webError) : errorMessage(err)
      throw new Error('网页抓取失败：' + reason)
    }
  }
  if (result.statusCode < 200 || result.statusCode >= 300) throw new Error('网页返回状态码 ' + result.statusCode + '，抓取失败')
  const body = result.body
  let contentText = ''
  let pageTitle = ''
  if (isRecord(body) && body.kind === 'text' && typeof body.content === 'string') {
    contentText = body.content
  } else if (isRecord(body) && body.kind === 'html' && typeof body.content === 'string') {
    const parsed = htmlToText(body.content)
    pageTitle = parsed.title
    contentText = parsed.text
  }
  if (contentText.trim() === '') throw new Error('网页内容为空或无法解析（可能是临时链接失效、文章已删除，或需要登录）。请换稳定链接，或直接粘贴正文。')
  // 微信反爬验证页（环境异常/去验证）不是正文：换浏览器 UA 走全局 fetch 重试一次
  const looksAntiBot = /环境异常|完成验证|去验证/.test(contentText) && contentText.length < 4000
  if (looksAntiBot) {
    try {
      const resp = await globalThis.fetch(url, {
        redirect: 'follow',
        headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36' },
      })
      const retried = htmlToText(await resp.text())
      if (retried.text.trim() !== '' && !/环境异常|完成验证|去验证/.test(retried.text)) {
        contentText = retried.text
        if (retried.title !== '') pageTitle = retried.title
      }
    } catch (err) { /* 保留原内容，交给后续模型处理 */ }
  }
  if (pageTitle !== '' && contentText.indexOf(pageTitle) === -1) contentText = pageTitle + '\n\n' + contentText
  return contentText
```

</details>

**依据 2 · 源码核查**：[src/host/source.ts:167-197](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/source.ts#L167-L197)

微信域名、缓存、失败回退及不缓存验证页的条件。

<details>
<summary>查看原文（31行）</summary>

```text
  if (url !== '') {
    const hostMatch = url.match(/^https?:\/\/([^\/?#]+)/i)
    const host = hostMatch?.[1]?.toLowerCase() ?? ''
    if (host !== 'mp.weixin.qq.com' && host !== 'weixin.qq.com' && !host.endsWith('.weixin.qq.com')) {
      throw new Error('链接抓取仅支持微信公众号（mp.weixin.qq.com）。' + (host === '' ? '不是有效的链接。' : '「' + host + '」存在反爬或登录墙，请直接粘贴正文，或将内容保存为 .txt/.md/.pdf 后用 path 传入。'))
    }
    const refresh = args.refresh === true
    if (tune.cacheEnabled && !refresh) {
      const hit = await readCacheEntry(url, false)
      if (hit !== null) return { text: hit.text, source: url, sourceKind: 'url', cache: 'hit', fetchedAt: hit.fetchedAt }
    }
    let contentText = ''
    let fetchError: unknown = null
    try {
      contentText = await fetchArticleText(url)
    } catch (err) {
      fetchError = err
    }
    if (fetchError !== null) {
      if (tune.cacheEnabled) {
        const stale = await readCacheEntry(url, true)
        if (stale !== null) {
          const reason = errorMessage(fetchError)
          return { text: stale.text, source: url, sourceKind: 'url', cache: 'fallback', fetchedAt: stale.fetchedAt, note: '抓取失败（' + reason + '），已回退缓存全文' }
        }
      }
      throw fetchError
    }
    const looksAntiBot = /环境异常|完成验证|去验证/.test(contentText) && contentText.length < 4000
    if (tune.cacheEnabled && !looksAntiBot) await writeCacheEntry(url, contentText)
    return { text: contentText, source: url, sourceKind: 'url', cache: tune.cacheEnabled ? 'miss' : 'disabled' }
```

</details>

**依据 3 · 源码核查**：[src/host/source.ts:199-235](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/source.ts#L199-L235)

PDF读取上限与无文本时提示OCR。

<details>
<summary>查看原文（37行）</summary>

```text
  if (path !== '') {
    const lower = path.toLowerCase()
    if (lower.endsWith('.pdf')) {
      if (!isBinaryFileService(ctx.fs)) throw new Error('文件服务不可用')
      const target = await ctx.fs.resolve(path)
      const bytes = await ctx.fs.readBytes(target, undefined, 30 * 1024 * 1024)
      const latin = bytesToLatin1(bytes)
      const t0 = Date.now()
      if (opt.statsOnly === true) {
        let pdfStats = null
        try {
          pdfStats = extractPdfStats(latin)
        } catch (error) {
          throw new Error('PDF 解析失败：' + errorMessage(error))
        }
        return { text: '', source: path, sourceKind: 'pdf', pdfStats, extractMs: Date.now() - t0 }
      }
      let extracted = ''
      try {
        let lastPct = -1
        extracted = extractPdfText(latin, onProgress === null ? undefined : (info) => {
          if (info.done === 0) {
            onProgress('解析 PDF 中…（共 ' + info.total + ' 页）')
            return
          }
          const total = Math.max(1, info.total)
          const pct = Math.round((info.done / total) * 100)
          if (info.done >= total || pct >= lastPct + 5) {
            lastPct = pct
            onProgress('解析 PDF 中… ' + pct + '%（' + info.done + '/' + total + ' 页）')
          }
        })
      } catch (error) {
        throw new Error('PDF 解析失败：' + errorMessage(error))
      }
      if (extracted.trim() === '') throw new Error('PDF 中没有可提取的文本（可能是扫描版/图片型 PDF，建议先 OCR 或转成 txt 再精读）')
      return { text: extracted, source: path, sourceKind: 'pdf', extractMs: Date.now() - t0 }
```

</details>

**依据 4 · 源码核查**：[src/host/pdf.ts:806-813](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/pdf.ts#L806-L813)

过滤空页后重新编号，支持页码偏移的静态推导。

```text
function extractPdfText(latin1: string, onPage?: (progress: PdfProgress) => void): string {
  if (latin1.slice(0, 5) !== '%PDF-') throw new Error('不是有效的 PDF 文件')
  const state = collectPageNums(latin1)
  const pageCb = typeof onPage === 'function' ? onPage : null
  if (pageCb !== null) pageCb({ total: state.pageNums.length, done: 0 })
  const pageTexts = extractPageTexts(state.pageNums, state.getObject, state.resolveRef, state.resolveMultiRef, pageCb)
  const pages = pageTexts.filter((t) => t.trim() !== '')
  return pages.map((t, i) => '【第' + (i + 1) + '页】\n' + t).join('\n\n')
```

**依据 5 · 源码核查**：[lib/types/host/pdf.js:938-939](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/lib/types/host/pdf.js#L938-L939)

运行时包同样过滤空页并按数组重编号。

```text
        const pages = pageTexts.filter((t) => t.trim() !== '');
        return pages.map((t, i) => '【第' + (i + 1) + '页】\n' + t).join('\n\n');
```

**依据 6 · 源码核查**：[src/host/config.ts:6-15](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/config.ts#L6-L15)

默认400000输入字符、6000分块与20部分。

<details>
<summary>查看原文（10行）</summary>

```text
export const ConfigSchema = Schema.object({
  timeoutMs: Schema.number().default(900000),
  chunkChars: Schema.number().default(6000),
  maxParts: Schema.number().default(20),
  maxInputChars: Schema.number().default(400000),
  cacheEnabled: Schema.boolean().default(true),
  cacheTtlHours: Schema.number().default(168),
  estTokensPerSecond: Schema.number().default(0),
  estLatencyPerCallMs: Schema.number().default(0),
  backgroundMinChars: Schema.number().default(9000),
```

</details>

**依据 7 · 源码核查**：[src/host/plugin.ts:588-625](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L588-L625)

输入/quick截断与map分块截断、前三论点综合。

<details>
<summary>查看原文（38行）</summary>

```text
    if (text.trim() === '') throw new Error('没有可分析的内容')
    if (text.length > tune.maxInputChars) text = text.slice(0, tune.maxInputChars)
    const estimate = buildEstimate(text, depth)

    const cfg = await pickConfig()

    if (depth === 'quick') {
      const limited = text.length > 30000 ? text.slice(0, 30000) : text
      const parsed = await callModelJson(cfg, sectionSystem('quick', language, focus), sectionUser(limited, 0, 1), 2500, signal)
      if (parsed === null) throw new Error('模型输出无法解析为 JSON，请重试')
      const s = sanitizeSection(parsed, '未命名内容')
      return {
        kind: 'article', title: s.title, summary: s.summary, thesis: s.thesis,
        arguments: s.arguments, quotes: s.quotes, concepts: s.concepts, questions: s.questions,
        structure: [], chapters: [], citations: [],
        meta: { ...cacheFields, source, sourceKind, chars: limited.length, chunks: 1, depth: 'quick', estimate, durationMs: Date.now() - started, stages: buildStages() },
      }
    }

    if (depth === 'map') {
      if (text.length <= 9000) {
        const parsed = await callModelJson(cfg, mapSystem(language, focus, false), mapUser(text), 5000, signal)
        if (parsed === null) throw new Error('模型输出无法解析为 JSON，请重试')
        return sanitizeMap(parsed, [], { ...cacheFields, source, sourceKind, chars: text.length, chunks: 1, depth: 'map', estimate, durationMs: Date.now() - started, stages: buildStages() })
      }
      const chapters: AnalysisChapter[] = []
      let parts = splitChunks(text, CHUNK_CHARS)
      if (parts.length > MAX_PARTS) parts = parts.slice(0, MAX_PARTS)
      for (let i = 0; i < parts.length; i++) {
        if (onProgress !== null) onProgress('精读第 ' + (i + 1) + '/' + parts.length + ' 段…')
        const parsed = await callModelJson(cfg, sectionSystem('deep', language, focus), sectionUser(parts[i]!, i, parts.length), 5000, signal)
        const s = sanitizeSection(parsed === null ? {} : parsed, '第 ' + (i + 1) + ' 部分')
        chapters.push({ title: s.title, summary: s.summary, thesis: s.thesis, arguments: s.arguments, quotes: s.quotes })
        if (onProgress !== null) onProgress('完成第 ' + (i + 1) + '/' + parts.length + ' 段')
      }
      const condensed = chapters.map((c) => ({ title: c.title, summary: c.summary, thesis: c.thesis, arguments: c.arguments.slice(0, 3) }))
      if (onProgress !== null) onProgress('汇总中…')
      const finalParsed = await callModelJson(cfg, mapSystem(language, focus, true), mapFinalUser(condensed, text.length), 5000, signal)
```

</details>

**依据 8 · 源码核查**：[src/host/plugin.ts:482-502](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L482-L502)

batch每篇30000字符与压缩要点进入最终综合。

<details>
<summary>查看原文（21行）</summary>

```text
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!
      if (progress !== null) progress('解析第 ' + (i + 1) + '/' + items.length + ' 篇…')
      const src = await resolveSource({ ...item, refresh: args.refresh === true }, { onProgress: progress === null ? undefined : (line) => progress('第 ' + (i + 1) + ' 篇 · ' + line) })
      let text = String(src.text).replace(/\r\n/g, '\n')
      if (text.length > 30000) text = text.slice(0, 30000)
      totalChars += text.length
      const title = str(item.title, '')
      if (progress !== null) progress('精读第 ' + (i + 1) + '/' + items.length + ' 篇…')
      const parsed = await callModelJson(cfg, sectionSystem('quick', language, str(item.focus, '')), (title !== '' ? '【文档标题：' + title + '】\n' : '') + sectionUser(text, i, items.length), 2500, signal)
      const s = sanitizeSection(parsed === null ? {} : parsed, title !== '' ? title : ('第 ' + (i + 1) + ' 篇'))
      docs.push({
        index: i + 1, title: s.title, summary: s.summary, thesis: s.thesis,
        arguments: s.arguments, quotes: s.quotes, concepts: s.concepts,
        source: str(src.source, ''), sourceKind: str(src.sourceKind, 'text'), chars: text.length,
      })
      if (progress !== null) progress('完成第 ' + (i + 1) + '/' + items.length + ' 篇')
    }
    const compact = docs.map((d) => ({ title: d.title, summary: d.summary, thesis: d.thesis, arguments: arr(d.arguments).slice(0, 3), quotes: arr(d.quotes).slice(0, 3) }))
    if (progress !== null) progress('跨篇对比汇总中…')
    const finalParsed = await callModelJson(cfg, batchFinalSystem(language), '以下 JSON 数组是 ' + docs.length + ' 篇文章各自的要点：\n\n' + JSON.stringify(compact), 5000, signal)
```

</details>

#### 缺口

- 实际PDF字体/图像、网页正文提取完整率以及截断对重要结论的影响未测。
  **影响**：无法保证材料完整和位置正确，限制正式引证与全书使用。
  **进一步探讨**：使用带空白页、扫描页和尾部关键反证的固定材料，逐页核对抽取、覆盖范围与报告引用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 观点证据位置和置信度是否被机械验证？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

重要观点的evidence/source/confidence由模型按提示词生成，清洗器做字符串/数组形状与数量限制，没有将引句回查原文、核验页段位置或验证置信度枚举。sanitizeMap在evidence缺失时填“原文未提供证据”，这只说明模型输出该字段缺失，并不证明原文真的没有支持。quote/source由模型写出后主要原样保留，故形式上可追溯与已验证证据正确是两回事。人工必须点回原件检查支持关系，不能把四档置信度当经过校准的可信概率。

长文的最终调用接收各部分摘要而非全文。map只传每章前三论点，deep/book最终调用也只传摘要、论点等；模型在末轮无法直接重新核对全文被删部分。分段报告仍可能保留更多内容，但综合层遗漏反例或位置来源的风险需单独检查。代码没有可核对覆盖区间与每条证据锚点的硬约束，所以提示词禁止编造不等于系统能阻止编造。

工程上有可借鉴之处：纯JSON修复与分段/综合组织分开，optional-storage用epoch防止延迟打开的旧存储服务覆盖新绑定，并在失配时关闭旧句柄。但这些是可维护性和生命周期机制，不增加证据语义真实性。本文限定该组件为结构化阅读辅助，不把它称为事实核查器或可替代人工引证核验的系统。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/plugin.ts:237-253](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L237-L253)

证据、数据、关系及置信度依赖模型提示要求。

<details>
<summary>查看原文（17行）</summary>

```text
  function mapSystem(language: OutputLanguage, focus: string, isFinal: boolean) {
    const lang = language === 'en' ? 'English' : (language === 'zh' ? '简体中文' : '与原文语言保持一致')
    let sys = '你是严谨的知识地图分析师。请' + (isFinal ? '把各部分已提取的要点综合' : '把原文整理') + '成「观点—证据—数据—关系」知识地图。\n'
      + '严格只输出一个 JSON 对象（不要输出任何解释、前后缀或 Markdown 代码块），结构如下：\n'
      + MAP_SCHEMA + '\n'
      + '必须遵守的规则：\n'
      + '1. coreQuestion 必须是作者试图回答的核心问题，不是文章主题。\n'
      + '2. coreConclusions 是作者的核心结论（1-3 条），不得只复述主题。\n'
      + '3. items 的 type 只能取十类之一：核心结论、分论点、原因或作用机制、事实、数据、案例、隐含前提、反对意见、限制条件、可执行建议。\n'
      + '4. 每条重要观点都必须有 evidence；原文确实没有提供证据时，evidence 必须填「原文未提供证据」。\n'
      + '5. dataPoints 必须保留完整数值与单位、时间范围、样本或研究对象、比较基准、数据来源、原文位置；原文没有数据时留空数组，严禁编造数据。\n'
      + '6. 案例不得当作普遍证据；相关关系不得写成因果关系。\n'
      + '7. relations 的 type 只能八选一：支持、反驳、导致、解释、取决于、举例、对比、限制；to 写另一条 claim 的开头文字以便定位。\n'
      + '8. confidence 区分四档：作者原意 / 原文事实与数据 / 合理推断 / 无法确认。\n'
      + '9. mermaid 用 mindmap 语法输出完整思维导图；xmindOutline 输出制表符缩进的 Markdown 大纲（可直接导入 XMind）；recallQuestions 是 5 个主动回忆问题。\n'
      + '输出语言：' + lang + '。\n'
    if (focus.trim() !== '') sys += '读者特别关注：' + focus.trim() + '。\n'
```

</details>

**依据 2 · 源码核查**：[src/host/plugin.ts:265-293](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L265-L293)

清洗字段与空缺填充，无原文对齐或置信度强校验。

<details>
<summary>查看原文（29行）</summary>

```text
  function sanitizeMap(parsed: unknown, chapters: AnalysisChapter[], meta: ResultMetadata): DeepreadResult {
    const p = isRecord(parsed) ? parsed : EMPTY_RECORD
    const items = arr(p.items).slice(0, 40).map((it) => {
      const o = isRecord(it) ? it : { claim: String(it) }
      const claim = str(o.claim, '')
      if (claim === '') return null
      return {
        type: str(o.type, '分论点'),
        claim,
        evidence: str(o.evidence, '原文未提供证据'),
        source: str(o.source, ''),
        confidence: str(o.confidence, ''),
        relations: arr(o.relations).slice(0, 6).map((r) => {
          const ro = isRecord(r) ? r : { type: String(r) }
          return { to: str(ro.to, ''), type: str(ro.type, '支持') }
        }).filter((r) => r.to !== ''),
      }
    }).filter((x) => x !== null)
    const dataPoints = arr(p.dataPoints).slice(0, 30).map((d) => {
      const o = isRecord(d) ? d : { value: String(d) }
      return {
        value: str(o.value, ''),
        period: str(o.period, ''),
        subject: str(o.subject, ''),
        baseline: str(o.baseline, ''),
        source: str(o.source, ''),
        location: str(o.location, ''),
      }
    }).filter((d) => d.value !== '')
```

</details>

**依据 3 · 源码核查**：[src/host/plugin.ts:110-128](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L110-L128)

引句和引用清洗只转换字段、限制数量。

<details>
<summary>查看原文（19行）</summary>

```text
  function sanitizeArguments(raw: unknown) {
    return arr(raw).slice(0, 10).map((a) => {
      const ao = isRecord(a) ? a : { claim: String(a) }
      return { claim: str(ao.claim, ''), evidence: str(ao.evidence, ''), quote: str(ao.quote, ''), source: str(ao.source, '') }
    }).filter((a) => a.claim !== '' || a.evidence !== '')
  }

  function sanitizeQuotes(raw: unknown) {
    return arr(raw).slice(0, 8).map((q) => {
      const qo = isRecord(q) ? q : { text: String(q) }
      return { text: str(qo.text, ''), context: str(qo.context, ''), source: str(qo.source, '') }
    }).filter((q) => q.text !== '')
  }

  function sanitizeCitations(raw: unknown) {
    return arr(raw).slice(0, 8).map((c) => {
      const co = isRecord(c) ? c : { claim: String(c) }
      return { claim: str(co.claim, ''), source: str(co.source, ''), quote: str(co.quote, '') }
    }).filter((c) => c.claim !== '' || c.quote !== '')
```

</details>

**依据 4 · 源码核查**：[src/host/plugin.ts:623-627](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L623-L627)

map最终调用只接收每章前三论点。

```text
      const condensed = chapters.map((c) => ({ title: c.title, summary: c.summary, thesis: c.thesis, arguments: c.arguments.slice(0, 3) }))
      if (onProgress !== null) onProgress('汇总中…')
      const finalParsed = await callModelJson(cfg, mapSystem(language, focus, true), mapFinalUser(condensed, text.length), 5000, signal)
      if (finalParsed === null) throw new Error('模型输出无法解析为 JSON，请重试')
      return sanitizeMap(finalParsed, chapters, { ...cacheFields, source, sourceKind, chars: text.length, chunks: chapters.length, depth: 'map', estimate, durationMs: Date.now() - started, stages: buildStages() })
```

**依据 5 · 源码核查**：[src/host/plugin.ts:694-725](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L694-L725)

deep/book最终综合输入为摘取要点，引用再由模型输出。

<details>
<summary>查看原文（32行）</summary>

```text
    let finalParsed = null
    if (chapters.length > 0) {
      if (onProgress !== null) onProgress('汇总中…')
      const parts = chapters.map((c) => ({ title: c.title, summary: c.summary, thesis: c.thesis, arguments: c.arguments.slice(0, 3) }))
      finalParsed = await callModelJson(cfg, finalSystem(language), finalUserFromParts(parts, text.length), 5000, signal)
    } else {
      finalParsed = await callModelJson(cfg, sectionSystem('deep', language, focus), sectionUser(text, 0, 1), 4000, signal)
    }

    if (finalParsed === null) {
      if (chapters.length > 0) {
        const first = chapters[0]!
        return {
          kind: depth === 'book' ? 'book' : 'article',
          title: first.title, summary: first.summary, thesis: first.thesis,
          arguments: first.arguments, quotes: first.quotes, concepts: [], questions: [],
          structure: [], chapters, citations: [],
          meta: { ...cacheFields, source, sourceKind, chars: text.length, chunks: chapters.length, depth, estimate, durationMs: Date.now() - started, stages: buildStages(), note: (typeof src.note === 'string' && src.note !== '' ? src.note + '；' : '') + '综合阶段输出解析失败，已回退为各部分要点' },
        }
      }
      throw new Error('模型输出无法解析为 JSON，请重试')
    }

    const finalRecord = isRecord(finalParsed) ? finalParsed : EMPTY_RECORD
    const fin = sanitizeSection(finalRecord, chapters.length > 0 ? chapters[0]!.title : '未命名内容')
    const structure = arr(finalRecord.structure).slice(0, 12).map((x) => String(x).trim()).filter((x) => x !== '')
    const citations = sanitizeCitations(finalRecord.citations)
    return {
      kind: depth === 'book' ? 'book' : 'article',
      title: fin.title, summary: fin.summary, thesis: fin.thesis,
      arguments: fin.arguments, quotes: fin.quotes, concepts: fin.concepts, questions: fin.questions,
      structure, chapters, citations,
```

</details>

**依据 6 · 源码核查**：[src/host/optional-storage.ts:46-63](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/optional-storage.ts#L46-L63)

存储打开绑定epoch检查并关闭过期句柄，是具体可借鉴设计。

<details>
<summary>查看原文（18行）</summary>

```text
  const getTable = (): Promise<TableValue | null> => {
    const available = service
    if (available === undefined) return Promise.resolve(null)
    if (tablePromise !== null) return tablePromise

    const openEpoch = epoch
    tablePromise = (async () => {
      try {
        const opened = await available.open(domainSpec)
        if (epoch !== openEpoch || service !== available) {
          try { await opened.close() } catch { /* stale handle cleanup is best effort */ }
          return null
        }
        handle = opened
        return selectTable(opened)
      } catch {
        return null
      }
```

</details>

#### 缺口

- 没有观点到原文的独立语义标注或引用对齐结果。
  **影响**：不能量化伪引句、错位置和漏反证率，也不证明四档标签正确。
  **进一步探讨**：按固定金标逐条核对引句逐字匹配、位置、支持关系及被遗漏反证，并统计人工修正。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 预算、后台与取消如何影响真实成本和恢复？

**研究主题**：效果与总成本、依赖、兼容与流程、工程质量与复用

#### 完整回答

estimate=true的控制流在pickConfig和模型调用之前返回，确为“不调用模型”的预检，但仍可能读文件、提取PDF或联网并更新URL缓存，不能解释为无副作用。token按字符类别估算，耗时按token/速率加每次延迟推算，大PDF采前两页外推；它是估计而非现金预算或执行硬上限。最终token用量、供应商价格及任务质量没有由该估计绑定。

callModelJson最多做3次底层调用，发生错误或疑似截断会把输出预算增到1.5倍、最高16000。llmCallStats在整个逻辑调用返回/失败后只记一次，不能当真实供应商请求次数；失败尝试也可能消耗费用。局部输出maxTokens并非整个任务总token上限，分段和重试会扩展资源。模型选择取宿主默认，缺失时取首个供应商/模型，执行前应确认具体路由而非假定性能和价格。

后台jobs传入可变aborted标记，cancel只把标记设真；callModel的stream options没有signal，仅在接收到chunk后检查。若供应商迟迟不产chunk，取消不一定及时生效，且模型JSON重试捕获取消错误后仍可能再调用。不得把job_kill或工具超时当远端推理已停止的证明。前台quick/降级路径更没有把exec的取消信号传给computeResult。导出也不是事务：逐个写md/mm/html，某次失败在note中记录，之前写成文件不会回滚；后台在compute结束后直接attachExports，没有统一取消前置检查。失败/取消后要查任务与文件实际状态再重试。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/plugin.ts:563-590](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L563-L590)

estimate在pickConfig前返回，执行模式另行截断与预算。

<details>
<summary>查看原文（28行）</summary>

```text
    if (args.estimate === true) {
      let estimate
      let chars
      const pdfStats = src.pdfStats !== undefined && src.pdfStats !== null ? src.pdfStats : null
      if (pdfStats !== null) {
        const sampleChars = typeof pdfStats.sampleChars === 'number' ? pdfStats.sampleChars : 0
        const samplePages = typeof pdfStats.samplePages === 'number' && pdfStats.samplePages > 0 ? pdfStats.samplePages : 2
        const pages = typeof pdfStats.pages === 'number' ? pdfStats.pages : 1
        const fullChars = Math.max(1, Math.round((sampleChars / samplePages) * pages))
        const sampleTokens = typeof pdfStats.sampleTokens === 'number' ? pdfStats.sampleTokens : 0
        const tokensPerChar = sampleChars > 0 && sampleTokens > 0 ? sampleTokens / sampleChars : 0.6
        estimate = buildEstimate('', depth, { chars: fullChars, tokensPerChar })
        chars = fullChars
      } else {
        estimate = buildEstimate(text, depth)
        chars = text.length
      }
      return {
        kind: 'estimate', title: '预算预检', summary: '不调用模型，仅按字数与模式估算 token 与耗时。', thesis: '',
        arguments: [], quotes: [], concepts: [], questions: [], structure: [], chapters: [],
        estimate,
        meta: { ...cacheFields, source, sourceKind, chars, chunks: 0, depth, estimate, durationMs: Date.now() - started, stages: buildStages(), ...(pdfStats !== null ? { pdfStats } : EMPTY_RECORD) },
      }
    }

    if (text.trim() === '') throw new Error('没有可分析的内容')
    if (text.length > tune.maxInputChars) text = text.slice(0, tune.maxInputChars)
    const estimate = buildEstimate(text, depth)
```

</details>

**依据 2 · 源码核查**：[src/host/budget.ts:9-35](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/budget.ts#L9-L35)

字符估token与耗时公式，并非实际token或货币控制。

<details>
<summary>查看原文（27行）</summary>

```text
  function estimateTokens(text: string): number {
    let cjk = 0
    let latin = 0
    let other = 0
    for (let index = 0; index < text.length; index++) {
      const code = text.charCodeAt(index)
      if ((code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef)) cjk += 1
      else if (code >= 32 && code < 127) latin += 1
      else other += 1
    }
    return Math.ceil(cjk * 0.6 + latin * 0.25 + other * 0.5)
  }

  function estimateCall(calls: number, inputTokens: number, outputTokens: number): EstimateCall {
    const rate = rates.effectiveRate()
    const latency = rates.effectiveLatency()
    const minutes = (inputTokens + outputTokens) / rate / 60 + (calls * latency) / 60000
    return {
      calls,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      minutes: Math.round(minutes * 10) / 10,
      minutesFormula: '（(' + inputTokens + '+' + outputTokens + ') ÷ ' + Math.round(rate * 10) / 10 + ' tok/s + ' + calls + ' 次 × ' + Math.round(latency) + 'ms）',
      estTokensPerSecond: Math.round(rate * 10) / 10,
      estLatencyPerCallMs: Math.round(latency),
      calibrated: rates.calibratedRate() !== null,
```

</details>

**依据 3 · 源码核查**：[src/host/budget.ts:39-60](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/budget.ts#L39-L60)

按模式估调用次数与输出量，未含所有失败重试。

<details>
<summary>查看原文（22行）</summary>

```text
  function buildEstimate(text: string, depth: DeepreadDepth, ext: { chars?: number; tokensPerChar?: number } = {}): EstimateResult {
    const extrapolated = typeof ext.chars === 'number' ? ext : null
    const chars = extrapolated === null ? text.length : Math.max(1, Math.round(extrapolated.chars ?? text.length))
    const tokenRatio = extrapolated !== null && typeof extrapolated.tokensPerChar === 'number' && extrapolated.tokensPerChar > 0 ? extrapolated.tokensPerChar : null
    const tokOf = (length: number): number => tokenRatio === null ? estimateTokens(text.slice(0, length)) : Math.ceil(length * tokenRatio)
    const effectiveLength = Math.min(chars, tune.maxInputChars)
    const parts = Math.min(Math.ceil(effectiveLength / tune.chunkChars), tune.maxParts)
    const perInput = tokOf(Math.min(effectiveLength, tune.chunkChars)) + EST_PROMPT_OVERHEAD
    const summaryInput = parts * 400 + EST_PROMPT_OVERHEAD
    const modes: EstimateResult['modes'] = []
    modes.push({ mode: 'quick', note: '单次调用，输入截断至 30000 字', ...estimateCall(1, tokOf(Math.min(effectiveLength, 30000)) + EST_PROMPT_OVERHEAD, 2500) })
    modes.push(effectiveLength <= 9000
      ? { mode: 'deep', note: '短文单次调用', ...estimateCall(1, tokOf(effectiveLength) + EST_PROMPT_OVERHEAD, 4000) }
      : { mode: 'deep', note: '分 ' + parts + ' 段逐段精读 + 1 次综合', ...estimateCall(parts + 1, parts * perInput + summaryInput, parts * 5000 + 5000) })
    const bookParts = Math.max(1, parts)
    modes.push({ mode: 'book', note: '全书分 ' + bookParts + ' 部分精读并汇总', ...estimateCall(bookParts + 1, bookParts * perInput + summaryInput, bookParts * 5000 + 5000) })
    modes.push(effectiveLength <= 9000
      ? { mode: 'map', note: '短文单次知识地图', ...estimateCall(1, tokOf(effectiveLength) + EST_PROMPT_OVERHEAD, 5000) }
      : { mode: 'map', note: '分 ' + parts + ' 段提取 + 1 次汇总', ...estimateCall(parts + 1, parts * perInput + summaryInput, parts * 5000 + 5000) })
    const structureCalls = effectiveLength > 9000 ? 1 : 0
    const structureInput = structureCalls > 0 ? tokOf(5000) + EST_PROMPT_OVERHEAD : 0
    modes.push({ mode: 'feynman', note: (structureCalls > 0 ? '目录提问 1 次 + ' : '') + '分 ' + Math.max(1, parts) + ' 章 + 合并导图与复习计划 1 次', ...estimateCall(Math.max(1, parts) + structureCalls + 1, Math.max(1, parts) * perInput + structureInput + summaryInput, Math.max(1, parts) * 5000 + 5000) })
```

</details>

**依据 4 · 源码核查**：[src/host/llm.ts:107-142](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/llm.ts#L107-L142)

默认或首个模型选择以及实际stream options。

<details>
<summary>查看原文（36行）</summary>

```text
async function pickConfig(): Promise<ModelSelection> {
  const cfg = selectedModel()
  if (cfg !== null) return cfg
  if (!isLlmCatalogService(ctx.llm)) {
    throw new Error('没有可用的模型 Provider，无法执行精读分析')
  }
  const providers = ctx.llm.listProviders()
  if (!Array.isArray(providers)) {
    throw new Error('没有可用的模型 Provider，无法执行精读分析')
  }
  const first = providers.find((provider: unknown) => typeof provider === 'string' || (isRecord(provider) && typeof provider.id === 'string'))
  const providerId = typeof first === 'string' ? first : (isRecord(first) && typeof first.id === 'string' ? first.id : null)
  if (providerId === null) {
    throw new Error('没有可用的模型 Provider，无法执行精读分析')
  }
  const models = await ctx.llm.listModels(providerId)
  if (!Array.isArray(models)) {
    throw new Error('Provider "' + providerId + '" 下没有可用模型')
  }
  const firstModel = models.find((model: unknown) => typeof model === 'string' || (isRecord(model) && typeof model.id === 'string'))
  const modelId = typeof firstModel === 'string' ? firstModel : (isRecord(firstModel) && typeof firstModel.id === 'string' ? firstModel.id : null)
  if (modelId === null) {
    throw new Error('Provider "' + providerId + '" 下没有可用模型')
  }
  return { provider: providerId, model: modelId }
}

async function callModel(cfg: ModelSelection, system: string, userText: string, maxTokens: number, signal?: AbortLike | null): Promise<string> {
  const options = {
    provider: cfg.provider,
    model: cfg.model,
    system,
    messages: [{ role: 'user', content: [{ type: 'text', text: userText }] }],
    temperature: 0.2,
    maxTokens,
  }
```

</details>

**依据 5 · 源码核查**：[src/host/llm.ts:147-162](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/llm.ts#L147-L162)

signal只在收到chunk后检查。

<details>
<summary>查看原文（16行）</summary>

```text
  for await (const chunk of ctx.llm.stream(options)) {
    if (signal !== undefined && signal !== null && signal.aborted) throw new Error('任务已取消')
    if (!isRecord(chunk)) continue
    if (chunk.type === 'text-delta' && typeof chunk.text === 'string') {
      text += chunk.text
    } else if (chunk.type === 'finish') {
      const reason = chunk.reason
      if (isRecord(reason) && (reason.kind === 'error' || reason.kind === 'aborted')) {
        const f = reason.failure
        failure = isRecord(f) ? str(f.message, str(f.code, '模型调用失败')) : '模型调用失败'
      }
    }
  }
  if (failure !== null) throw new Error('模型调用失败：' + failure)
  if (text.trim() === '') throw new Error('模型返回了空结果')
  return text
```

</details>

**依据 6 · 源码核查**：[src/host/llm.ts:176-221](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/llm.ts#L176-L221)

最多3次重试、预算扩大及逻辑调用只计一次。

<details>
<summary>查看原文（46行）</summary>

```text
async function callModelJson(cfg: ModelSelection, system: string, userText: string, maxTokens: number, signal?: AbortLike | null): Promise<unknown> {
  const MAX_BUDGET = 16000
  let prompt = userText
  let budget = maxTokens
  const history: Array<{ text: string; error: string | null }> = []
  const callStarted = Date.now()
  for (let attempt = 0; attempt < 3; attempt++) {
    let text = ''
    let error = null
    const t0 = Date.now()
    try {
      text = await callModel(cfg, system, prompt, budget, signal)
      // 运行时自校准：实测吞吐与首字延迟（估计），仅对成功调用采样。
      const elapsedMs = Math.max(1, Date.now() - t0)
      const tokens = estimateTokens(text)
      const seconds = elapsedMs / 1000
      if (text.trim() !== '' && tokens > 0) {
        const rateTokPerSec = tokens / seconds
        // latency ≈ 耗时 - 生成耗时（产出 token ÷ 速率），夹在 50..5000ms
        const generationMs = rateTokPerSec > 0 ? (tokens / rateTokPerSec) * 1000 : elapsedMs
        recordCalibration(rateTokPerSec, elapsedMs - generationMs)
      }
    } catch (err) {
      error = errorMessage(err)
    }
    const parsed = error === null ? parseJson(text) : null
    history.push({ text, error })
    if (parsed !== null) {
      llmCallStats.calls++
      llmCallStats.ms += Date.now() - callStarted
      return parsed
    }
    const truncated = error === null && looksTruncated(text)
    if (error !== null || truncated) {
      budget = Math.min(Math.ceil(budget * 1.5), MAX_BUDGET)
    }
    if (error !== null) {
      prompt = userText + '\n\n[系统校正] 上一次调用失败（' + error + '），已加大输出预算。请重新只输出一个合法的 JSON 对象：不要任何解释或额外文字。'
    } else if (truncated) {
      prompt = userText + '\n\n[系统校正] 你上一次的输出在 JSON 中途被截断（输出预算不足）。请大幅压缩篇幅——arguments 最多 6 条、quotes 最多 4 条、concepts 最多 5 条、questions 最多 4 条，每条只写一句话——并输出完整闭合的 JSON 对象，末尾以 } 结束。'
    } else {
      prompt = userText + '\n\n[系统校正] 你上一次的输出无法解析为 JSON（可能混入了解释文字、Markdown 围栏、尾随逗号，或字符串内直接换行）。请重新只输出一个合法的 JSON 对象：不要任何解释或额外文字，字符串内不要直接换行（多行文本用 \\n 转义），引号正确转义，末尾不要有逗号。'
    }
  }
  llmCallStats.calls++
  llmCallStats.ms += Date.now() - callStarted
```

</details>

**依据 7 · 源码核查**：[lib/types/host/llm.js:155-171](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/lib/types/host/llm.js#L155-L171)

实际运行包也未把signal传给stream。

<details>
<summary>查看原文（17行）</summary>

```text
    async function callModel(cfg, system, userText, maxTokens, signal) {
        const options = {
            provider: cfg.provider,
            model: cfg.model,
            system,
            messages: [{ role: 'user', content: [{ type: 'text', text: userText }] }],
            temperature: 0.2,
            maxTokens,
        };
        // 不转发 reasoningEffort：结构化 JSON 输出不需要长思考，推理会吃光小输出预算导致空结果
        let text = '';
        let failure = null;
        if (!isLlmStreamService(ctx.llm))
            throw new Error('模型服务不支持流式调用');
        for await (const chunk of ctx.llm.stream(options)) {
            if (signal !== undefined && signal !== null && signal.aborted)
                throw new Error('任务已取消');
```

</details>

**依据 8 · 源码核查**：[src/host/plugin.ts:790-836](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L790-L836)

后台cancel只设标记，计算后仍执行导出；失败才按cancelled显示。

<details>
<summary>查看原文（47行）</summary>

```text
    const lines: string[] = []
    let cancelled = false
    let cancelReason = ''
    const signal = { aborted: false }
    type JobDone = { status: string; detail?: string }
    let resolveDone!: (value: JobDone) => void
    const donePromise = new Promise<JobDone>((resolve) => { resolveDone = resolve })
    const pushLine = (line: string): void => { if (line !== '') lines.push(line) }
    const onProgress = pushLine
    const readOutput = () => { const out = lines.join('\n'); lines.length = 0; return out }
    const hooks = {
      cancel(reason: unknown) {
        cancelled = true
        cancelReason = typeof reason === 'string' && reason !== '' ? reason : '已取消'
        signal.aborted = true
      },
      done: donePromise,
      readOutput,
    }

    const jobId = await jobs.start({
      kind: 'deepread',
      label,
      // 与官方 tool-terminal 的 DEFAULT_MAX_RESULT_BYTES 对齐：最终报告是主交付物，
      // 低于单次读取上限会触发「保留尾部」截断，丢掉报告开头（进度行+标题/摘要）。
      outputLimitBytes: 256 * 1024,
      owner: isRecord(exec) && exec.agent !== undefined ? exec.agent : undefined,
      run: () => {
        void (async () => {
          try {
            let result: DeepreadResult
            if (isBatch) {
              result = await batchFlow(args, language, signal, onProgress)
            } else if (preResolved !== null && preResolved !== undefined) {
              pushLine('已解析「' + sourceLabelText + '」（' + preResolved.text.length + ' 字' + (typeof preResolved.src.extractMs === 'number' && preResolved.src.extractMs > 0 ? '，PDF 解析 ' + preResolved.src.extractMs + 'ms' : '') + '）')
              result = await computeResult(input, { preResolved, onProgress, signal })
            } else {
              // 大 PDF：解析与逐页进度在任务流内进行
              result = await computeResult(input, { onProgress, signal })
            }
            await attachExports(result, exportFmt)
            pushLine('【最终报告】\n' + renderMarkdown(result))
            resolveDone({ status: 'completed' })
          } catch (err) {
            const msg = errorMessage(err)
            if (cancelled) {
              pushLine('已取消：' + cancelReason)
```

</details>

**依据 9 · 源码核查**：[src/host/export.ts:642-665](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/export.ts#L642-L665)

逐个写导出并吞为note，不回滚已成功写入。

<details>
<summary>查看原文（24行）</summary>

```text
    const writeOne = async (rel: string, content: string): Promise<string> => {
      try {
        const target = await fileWriter.resolve(rel, root ? { cwd: root } : undefined)
        await fileWriter.writeText(target, content)
        return rel
      } catch (error) {
        const flat = safe + '-' + rel.split('/').pop()
        const target = await fileWriter.resolve(flat, root ? { cwd: root } : undefined)
        await fileWriter.writeText(target, content)
        return flat
      }
    }
    const files: Partial<Record<'md' | 'mm' | 'html', string>> = {}
    if (want.md) files.md = await writeOne(folder + '/' + safe + '.md', markdown)
    if (want.mm) files.mm = await writeOne(folder + '/' + safe + '.mm', buildFreeMind(value))
    if (want.html) files.html = await writeOne(folder + '/' + safe + '.html', buildHtml(value))
    const meta = isRecord(value.meta) ? value.meta : {}
    meta.files = files
    value.meta = meta
  } catch (error) {
    const meta = isRecord(value.meta) ? value.meta : {}
    const priorNote = typeof meta.note === 'string' && meta.note !== '' ? meta.note + '；' : ''
    meta.note = priorNote + '导出文件失败：' + errorMessage(error)
    value.meta = meta
```

</details>

#### 缺口

- 宿主和供应商取消语义、失败尝试账单及已写文件最终状态未执行核查。
  **影响**：不能给出执行停止、总费用上限或原子导出保证。
  **进一步探讨**：在隔离模型替身与可丢弃目录记录停流、取消期间重试、逐个写失败和所有请求计量，再决定真实服务实验。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用依赖、效果证据和退出条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

宿主必需fs、llm、tools、web、agentDefaultModel和sandboxPolicy，Web客户端、jobs、skills及storageDomain按服务可用性决定附加功能。package要求Node ^22.19或>=24，开发依赖列出DSH 0.1.2-rc.1系列但peer包多为通配符，不能由可安装推断所有宿主兼容。可选持久存储不可用时缓存和校准可内存降级，重新启动会失去相关状态；URL缓存保存正文和抓取时间，敏感材料需核对宿主权限和保留。

作者仓库的历史acceptance记录有明确边界：固定另一初始提交、隔离Node24/宿主环境，Web面板/预算和主题得到部分交互记录，但Web URL精读、headless和TUI调用均因无模型凭据未交付，最终写blocked/do not publish。本次仅检查该固定文件，既不否认作者记录的局部结果，也不把它们升格成当前提交的成功精读或本次host_acceptance。当前源码证据能支持机制解释，不能证明研究效率、阅读理解、引用质量或费用改善。

首次成本包含宿主与模型路由配置、输入提取和引用抽查；持续成本是分段/综合/重试模型调用、缓存存储及人工逐条引证复核；失败恢复包括取消后确认外部调用、补读截断材料、修复导出。金额、耗时和合格率均未知，不能写“零依赖”覆盖整个宿主工具形式。当前建议观察：先用短且可完整核对的文本研究结构化输出，不直接把长书或PDF页码用于正式引证。发现引用不匹配、覆盖遗漏或取消后仍有调用时停止自动流程，保留原文并退回人工阅读/常规模型辅助。停用插件不会撤回模型服务收到的材料或删除已导出的文件。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/plugin.ts:67-106](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L67-L106)

实际宿主注入与可选模块组织。

<details>
<summary>查看原文（40行）</summary>

```text
export const name = 'deepread'
export const inject = ['fs', 'llm', 'tools', 'web', 'agentDefaultModel', 'sandboxPolicy']

export function apply(ctx: unknown, config?: ConfigOptions): void {
  if (!isHostContext(ctx)) throw new TypeError('deepread requires a valid Harness Host context')
  applyHost(ctx, config)
}

function applyHost(ctx: HostContext, config?: ConfigOptions): void {
  const tune = resolveConfig(config)
  const CHUNK_CHARS = tune.chunkChars
  const MAX_PARTS = tune.maxParts
  const web = ctx.get('web')

  const llmCallStats = { calls: 0, ms: 0 }
  const calibration = createCalibrationRuntime(ctx, tune)
  const { calibratedRate, effectiveLatency, effectiveRate, loadCalibration, recordCalibration } = calibration
  const { buildEstimate, estimateCall, estimateTokens } = createBudgetRuntime(tune, calibration)

  const { readCacheEntry, writeCacheEntry } = createUrlCache(ctx, tune)

  const { callModelJson, pickConfig } = createLlmRuntime({
    ctx, estimateTokens, llmCallStats, recordCalibration,
  })
  const { bytesToLatin1, collectPageNums, extractPdfStats, extractPdfText } = createPdfTools(estimateTokens)
  const { attachExports, renderMarkdown } = createExportTools(ctx, tune, {
    arr,
    num,
    str,
    sanitizeArguments,
    sanitizeCitations,
    sanitizeConcepts,
    sanitizeQuestions,
    sanitizeQuotes,
    defaultRateTokPerSec: DEFAULT_RATE_TOK_PER_SEC,
  })

  const { resolveForEstimate, resolveSource } = createSourceRuntime({
    bytesToLatin1, ctx, extractPdfStats, extractPdfText,
    readCacheEntry, tune, web, writeCacheEntry,
```

</details>

**依据 2 · 源码核查**：[package.json:9-10](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/package.json#L9-L10)

Node运行时范围。

```text
  "engines": {
    "node": "^22.19 || >=24"
```

**依据 3 · 源码核查**：[package.json:76-82](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/package.json#L76-L82)

宿主peer多通配，声明不是跨版本运行依据。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-storage-domain": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/schemastery": "*",
    "react": "^18.2.0",
    "zod": "*"
```

**依据 4 · 源码核查**：[src/host/cache.ts:23-54](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/cache.ts#L23-L54)

正文URL缓存可持久或内存，TTL与抓取时间保存。

<details>
<summary>查看原文（32行）</summary>

```text
export function createUrlCache(ctx: HostContext, tune: RuntimeConfig) {
  const ttlMs = tune.cacheTtlHours * 3600 * 1000
  const maxEntries = 200
  const memory = new Map<string, CacheRecord>()
  const { getTable } = createOptionalStorageTable<StorageTable<string, CacheRecord>>(
    ctx,
    cacheDomainSpec,
    (domain) => domain.table('articles'),
  )

  function isStale(fetchedAt: string): boolean {
    const fetchedAtMs = Date.parse(fetchedAt)
    return !Number.isFinite(fetchedAtMs) || Date.now() - fetchedAtMs >= ttlMs
  }

  async function readCacheEntry(url: string, ignoreTtl: boolean): Promise<CacheRecord | null> {
    const table = await getTable()
    if (table === null) {
      const record = memory.get(url)
      if (record === undefined) return null
      return !ignoreTtl && isStale(record.fetchedAt) ? null : record
    }
    const record = table.get(url)
    if (!isRecord(record)
      || typeof record.url !== 'string'
      || typeof record.text !== 'string'
      || typeof record.fetchedAt !== 'string') return null
    if (!ignoreTtl && isStale(record.fetchedAt)) {
      try { await table.delete(url) } catch { /* expiry cleanup is best effort */ }
      return null
    }
    return { url: record.url, text: record.text, fetchedAt: record.fetchedAt }
```

</details>

**依据 5 · 源码核查**：[src/host/optional-storage.ts:40-63](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/optional-storage.ts#L40-L63)

服务不可用或打开失败返回null实现降级。

<details>
<summary>查看原文（24行）</summary>

```text
  if (typeof ctx.inject === 'function') {
    ctx.inject(['storageDomain'], bindAvailableService)
  } else {
    bindAvailableService(ctx)
  }

  const getTable = (): Promise<TableValue | null> => {
    const available = service
    if (available === undefined) return Promise.resolve(null)
    if (tablePromise !== null) return tablePromise

    const openEpoch = epoch
    tablePromise = (async () => {
      try {
        const opened = await available.open(domainSpec)
        if (epoch !== openEpoch || service !== available) {
          try { await opened.close() } catch { /* stale handle cleanup is best effort */ }
          return null
        }
        handle = opened
        return selectTable(opened)
      } catch {
        return null
      }
```

</details>

**依据 6 · 作者声明**：[evidence/dr-210/acceptance.md:9-21](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/evidence/dr-210/acceptance.md#L9-L21)

作者历史环境和制品范围，不等同当前提交验收。

<details>
<summary>查看原文（13行）</summary>

```text
- Repository start: `30923c735d9b6f6c58b838a6da8056a2b42b789b`.
- Node: `v24.19.0` (all release gates and host runs).
- npm: `10.8.2`.
- DeepSeek Harness checkout: `0.1.0-rc.7` CLI at commit `99f6f02`.
- dsh-TUI: official npm package `@deepseek-harness-tui/dsh-tui@0.8.3` in a real PTY.
- The task used isolated `$DSH_HOME`, profile, workspace, XDG cache, and npm cache directories under one disposable `$TMP` root.
- No credential was copied from user configuration into the isolated profiles.

## Release-tarball installation

The candidate was built with Node 24, packed with `npm pack --json`, and installed into the Web, headless, and dsh-TUI profiles only through the resulting `.tgz`. The profile dependency rows resolved to that tarball; no repository source path was mounted as the plugin.

The final clean-worktree pack metadata, SHA-256, integrity, and exact file list are saved in `final-pack.json`, `final-pack.sha256`, and `final-pack-files.txt` after the final commit. A package-content guard confirms that `evidence/`, temporary profiles, caches, raw PTY captures, and other task files are absent from the tarball.
```

</details>

**依据 7 · 作者声明**：[evidence/dr-210/acceptance.md:27-55](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/evidence/dr-210/acceptance.md#L27-L55)

局部Web交互与核心调用凭据阻塞分别记录。

<details>
<summary>查看原文（29行）</summary>

```text
- The real Harness Web profile loaded the packaged `lib/client.js` entry.
- The 📖 button opened, closed, and reopened exactly one `#deepread-panel`; `aria-expanded` returned to `true`.
- Pasted text reached the public budget preflight route and returned: `约 47 字 · ≈4.6k token · ≈<1分钟`.
- A normal Pointer Events drag moved the panel rectangle from `(818, 56)` to `(508, 136)` and returned the title cursor to `grab`. The regression test first failed when the captured pointer left the title element, then passed after the minimal window-level Pointer Events fallback.
- Light and dark themes were selected through normal host UI controls. In dark mode the panel computed colors were `rgb(53, 54, 56)` foreground `rgb(249, 250, 251)` with the host semantic border.
- Browser console log collection returned an empty list.
- Screenshots: `web-light.jpg` and `web-dark.jpg`.

Blocked Web criterion: starting a deep-read session reached the host conversation, then failed with public error `MISSING_CREDENTIAL` for provider route `deepseek-official`. Therefore URL deep reading cannot be marked complete in this isolated, credential-free run.

## Harness headless

The real headless profile activated from the tarball with no `webServer`. A pasted-text request reached the model boundary and exited with:

`dsh: MISSING_CREDENTIAL: llm-deepseek: no API key for provider route "deepseek-official"`

The first sandboxed attempt also surfaced `EMFILE` from the sandbox file-watcher boundary; a bounded rerun outside that restriction produced the precise credential error above. No pasted-text deep-read result was generated, so headless is not accepted.

## dsh-TUI

The real PTY transcript is summarized in `tui-session.txt`.

- `/plugins` reported dsh-TUI `v0.8.3`, `facets: v1alpha1`, and an empty effect ledger.
- `/plugins check` on the installed public manifest reported `Negotiation decision: compatible` in the first PTY run.
- `/context` reported `Skills · 1` with `dsh-deepread` and `Tools · 26` with `deepread`.
- `/skills` still reported `Failed to load the skill list`, although `/context` proves the packaged skill is registered in the host registry.
- A normal pasted-text prompt requesting the `deepread` tool reached the model boundary and failed with `MISSING_CREDENTIAL`; the status reported `0 工具`.

The skill registration defect exposed by the first tarball was fixed test-first in this work item. Tool invocation itself remains blocked and dsh-TUI is not accepted.
```

</details>

**依据 8 · 作者声明**：[evidence/dr-210/acceptance.md:67-76](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/evidence/dr-210/acceptance.md#L67-L76)

作者最终blocked结论，不能引用为整体成功。

<details>
<summary>查看原文（10行）</summary>

```text
## Verdict

## Two-axis review

- Standards: passed; no hard standards violation and no actionable baseline smell.
- Spec: the first review found the real pointer-drag failure plus incomplete three-host calls, rollback-read evidence, and command/resource evidence. Pointer drag was fixed test-first and reverified in the controlled browser. The other three findings remain explicit blockers or evidence limitations.

DR-210 release gate: **blocked / do not publish**.

The tarball contract, public registration repair, Pointer Events drag, budget route, themes, compatibility fixtures, and rollback installation are verified. The three-host gate is not green because the isolated environment has no model credential for Web URL reading, headless pasted-text completion, or dsh-TUI tool invocation. No release action is authorized by this evidence.
```

</details>

#### 缺口

- 当前提交的同条件真实任务质量与宿主结果没有本次独立验证。
  **影响**：无法推荐持续采用或声称正式证据可靠。
  **进一步探讨**：先以短文本金标集验证，再根据错误类型决定是否扩到PDF、长书和批量任务。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 从已查限制可提出什么可证伪改进？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由Q02覆盖/页码偏移、Q03证据标签未核验和Q04预算/取消缺口，可提出未验证的“可核对阅读任务”假设：先给源材料固定摘要与原页/段锚点，建立已读区间和遗漏原因账本；输出每条重要论点必须引用锚点及逐字引句，无法匹配的字段回到未确认而非猜测原文无证据。PDF保留原始页序，长文截断和综合只读摘要必须向读者显示。每次底层模型尝试独立计数并绑定任务预算，取消从宿主一路传到供应商，在结果未知时禁止自动重试或写导出。

最小验证使用中间空白页PDF、尾部关键反证长文、含近似但不相同引句的模型输出、三次格式失败和停流后取消。成功判据是页号不前移、遗漏可定位、错引句不能标已核、所有底层尝试都入账，取消期间不发新请求且外部结果标已停或未知。若仍可在未读区生成全书结论、把近似引句当原文或取消后继续重试，即推翻契约充分性。额外锚定与验证会增加存储/调用/人工，仍需与通用摘要+人工核验比较总负担。该假设不等于当前已实现事实核查，也不计入插件已有贡献或评分。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/pdf.ts:806-813](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/pdf.ts#L806-L813)

过滤重编号支持保留原始锚点的改进。

```text
function extractPdfText(latin1: string, onPage?: (progress: PdfProgress) => void): string {
  if (latin1.slice(0, 5) !== '%PDF-') throw new Error('不是有效的 PDF 文件')
  const state = collectPageNums(latin1)
  const pageCb = typeof onPage === 'function' ? onPage : null
  if (pageCb !== null) pageCb({ total: state.pageNums.length, done: 0 })
  const pageTexts = extractPageTexts(state.pageNums, state.getObject, state.resolveRef, state.resolveMultiRef, pageCb)
  const pages = pageTexts.filter((t) => t.trim() !== '')
  return pages.map((t, i) => '【第' + (i + 1) + '页】\n' + t).join('\n\n')
```

**依据 2 · 源码核查**：[src/host/plugin.ts:265-293](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L265-L293)

清洗不验原文支持语义核对假设。

<details>
<summary>查看原文（29行）</summary>

```text
  function sanitizeMap(parsed: unknown, chapters: AnalysisChapter[], meta: ResultMetadata): DeepreadResult {
    const p = isRecord(parsed) ? parsed : EMPTY_RECORD
    const items = arr(p.items).slice(0, 40).map((it) => {
      const o = isRecord(it) ? it : { claim: String(it) }
      const claim = str(o.claim, '')
      if (claim === '') return null
      return {
        type: str(o.type, '分论点'),
        claim,
        evidence: str(o.evidence, '原文未提供证据'),
        source: str(o.source, ''),
        confidence: str(o.confidence, ''),
        relations: arr(o.relations).slice(0, 6).map((r) => {
          const ro = isRecord(r) ? r : { type: String(r) }
          return { to: str(ro.to, ''), type: str(ro.type, '支持') }
        }).filter((r) => r.to !== ''),
      }
    }).filter((x) => x !== null)
    const dataPoints = arr(p.dataPoints).slice(0, 30).map((d) => {
      const o = isRecord(d) ? d : { value: String(d) }
      return {
        value: str(o.value, ''),
        period: str(o.period, ''),
        subject: str(o.subject, ''),
        baseline: str(o.baseline, ''),
        source: str(o.source, ''),
        location: str(o.location, ''),
      }
    }).filter((d) => d.value !== '')
```

</details>

**依据 3 · 源码核查**：[src/host/plugin.ts:614-627](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/plugin.ts#L614-L627)

分段上限和摘要综合需要覆盖账本。

<details>
<summary>查看原文（14行）</summary>

```text
      let parts = splitChunks(text, CHUNK_CHARS)
      if (parts.length > MAX_PARTS) parts = parts.slice(0, MAX_PARTS)
      for (let i = 0; i < parts.length; i++) {
        if (onProgress !== null) onProgress('精读第 ' + (i + 1) + '/' + parts.length + ' 段…')
        const parsed = await callModelJson(cfg, sectionSystem('deep', language, focus), sectionUser(parts[i]!, i, parts.length), 5000, signal)
        const s = sanitizeSection(parsed === null ? {} : parsed, '第 ' + (i + 1) + ' 部分')
        chapters.push({ title: s.title, summary: s.summary, thesis: s.thesis, arguments: s.arguments, quotes: s.quotes })
        if (onProgress !== null) onProgress('完成第 ' + (i + 1) + '/' + parts.length + ' 段')
      }
      const condensed = chapters.map((c) => ({ title: c.title, summary: c.summary, thesis: c.thesis, arguments: c.arguments.slice(0, 3) }))
      if (onProgress !== null) onProgress('汇总中…')
      const finalParsed = await callModelJson(cfg, mapSystem(language, focus, true), mapFinalUser(condensed, text.length), 5000, signal)
      if (finalParsed === null) throw new Error('模型输出无法解析为 JSON，请重试')
      return sanitizeMap(finalParsed, chapters, { ...cacheFields, source, sourceKind, chars: text.length, chunks: chapters.length, depth: 'map', estimate, durationMs: Date.now() - started, stages: buildStages() })
```

</details>

**依据 4 · 源码核查**：[src/host/llm.ts:176-221](https://github.com/xiehuan123/dsh-deepread/blob/9462f1e546b94a7f27e77abaf3d9ee3fedf7f746/src/host/llm.ts#L176-L221)

尝试计数与取消捕获提供逐尝试账本的推导。

<details>
<summary>查看原文（46行）</summary>

```text
async function callModelJson(cfg: ModelSelection, system: string, userText: string, maxTokens: number, signal?: AbortLike | null): Promise<unknown> {
  const MAX_BUDGET = 16000
  let prompt = userText
  let budget = maxTokens
  const history: Array<{ text: string; error: string | null }> = []
  const callStarted = Date.now()
  for (let attempt = 0; attempt < 3; attempt++) {
    let text = ''
    let error = null
    const t0 = Date.now()
    try {
      text = await callModel(cfg, system, prompt, budget, signal)
      // 运行时自校准：实测吞吐与首字延迟（估计），仅对成功调用采样。
      const elapsedMs = Math.max(1, Date.now() - t0)
      const tokens = estimateTokens(text)
      const seconds = elapsedMs / 1000
      if (text.trim() !== '' && tokens > 0) {
        const rateTokPerSec = tokens / seconds
        // latency ≈ 耗时 - 生成耗时（产出 token ÷ 速率），夹在 50..5000ms
        const generationMs = rateTokPerSec > 0 ? (tokens / rateTokPerSec) * 1000 : elapsedMs
        recordCalibration(rateTokPerSec, elapsedMs - generationMs)
      }
    } catch (err) {
      error = errorMessage(err)
    }
    const parsed = error === null ? parseJson(text) : null
    history.push({ text, error })
    if (parsed !== null) {
      llmCallStats.calls++
      llmCallStats.ms += Date.now() - callStarted
      return parsed
    }
    const truncated = error === null && looksTruncated(text)
    if (error !== null || truncated) {
      budget = Math.min(Math.ceil(budget * 1.5), MAX_BUDGET)
    }
    if (error !== null) {
      prompt = userText + '\n\n[系统校正] 上一次调用失败（' + error + '），已加大输出预算。请重新只输出一个合法的 JSON 对象：不要任何解释或额外文字。'
    } else if (truncated) {
      prompt = userText + '\n\n[系统校正] 你上一次的输出在 JSON 中途被截断（输出预算不足）。请大幅压缩篇幅——arguments 最多 6 条、quotes 最多 4 条、concepts 最多 5 条、questions 最多 4 条，每条只写一句话——并输出完整闭合的 JSON 对象，末尾以 } 结束。'
    } else {
      prompt = userText + '\n\n[系统校正] 你上一次的输出无法解析为 JSON（可能混入了解释文字、Markdown 围栏、尾随逗号，或字符串内直接换行）。请重新只输出一个合法的 JSON 对象：不要任何解释或额外文字，字符串内不要直接换行（多行文本用 \\n 转义），引号正确转义，末尾不要有逗号。'
    }
  }
  llmCallStats.calls++
  llmCallStats.ms += Date.now() - callStarted
```

</details>

#### 缺口

- 锚定、语义匹配和端到端取消尚未实现，宿主/供应商契约也需协作。
  **影响**：只能作为未来设计，正确性修补不直接证明更省成本或更好学习效果。
  **进一步探讨**：先以固定反例检查不变量，再用同任务测人工核验、引用错误和全部成本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
