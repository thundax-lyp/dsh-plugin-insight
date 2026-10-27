# dsh-study-coach

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7c2c2d3](https://github.com/Ame-Choo/dsh-study-coach/tree/7c2c2d3f71cb49508e567674882eddb1b3a689ba)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ame-Choo/dsh-study-coach) [![npm 30d 353](https://img.shields.io/static/v1?label=npm+30d&message=353&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-study-coach) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-study-coach)
<!-- END META -->

> **功能**：以学习预设、21个档案工具和网页面板管理目标、知识地图、练习证据、错题与每日任务。

> **亮点**：把学习目标、材料页、做题证据与面板回访接合，减少重复整理。详见[Q01](#research-q01)。

> **主要限制**：双HTTP入口本地无身份准入，坏JSON默认回落可被后写覆盖，无投影时学习会话筛选降级。详见[Q04](#research-q04)、[Q05](#research-q05)。

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
  - [Q01 · 学习教练提供什么闭环？](#detail-section-11)
  - [Q02 · 预设、Skill和工具怎样装配？](#detail-section-12)
  - [Q03 · 掌握度证据比主观自评多了什么？](#detail-section-13)
  - [Q04 · 双HTTP入口和会话桥接的访问边界是什么？](#detail-section-14)
  - [Q05 · 本地JSON会保住数据和档案隔离吗？](#detail-section-15)
  - [Q06 · 首次、持续及失败恢复有哪些成本？](#detail-section-16)
  - [Q07 · 推荐怎样采用，进一步探讨哪里？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：单人持续课程学习，目标/材料/证据需要跨会话回访。详见[Q01](#research-q01)。

普通聊天配笔记、任务表与记忆卡，集中回访便利不等已证教学效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 预设/Skill/工具 | 教练建图记录 | 内容和判断需核 |
| 掌握证据门 | 渐进升级与重算 | 来源/独立性未知 |
| 面板/桥接 | 学生回访和投话 | 本地单用户边界 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node/DSH/tools/webServer | host与面板 | ABI匹配 |
| 官方预设插件与Skill加载 | 教练工具 | scope需匹配 |
| controller/preset投影 | 聊天桥接 | 缺投影会降级筛选 |
| Python/PyMuPDF | PDF页图 | 同步最长180秒 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核本地边界/备份 | 用户 | 非唯一敏感档案 |
| 教练问目标建图 | 模型与学生 | 材料/答案可核 |
| 真实练习落证据 | 学生与模型 | 不只自评升级 |
| 回访/延迟测试 | 学生 | 记录与能力区别 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容宿主/材料/Python | 建图、页码、准入与备份 | 需材料/目标/知识图与Python页码绑定；准备费用工时未知 |
| 持续使用 | 模型tokens/页图/JSON | 材料核实和练习记录，节时未知 | 宿主模型/视觉token和PNG/JSON存储随学习量增长；成绩收益未知 |
| 失败恢复 | 原材料和档案备份 | 坏JSON/错归属与证据重算 | 原材料/档案备份与证据作废重算时间未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 持续回访 | 目标/地图/任务档案 | 内容由模型学生生成 |
| 证据掌握度 | 升级门/作废重算 | kind计数非客观测量 |
| 面板与教练联动 | 双入口/会话投递 | 准入与preset降级 |

> **思考**：双HTTP入口本地无身份准入，坏JSON默认回落可被后写覆盖，无投影时学习会话筛选降级。详见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把学习目标、材料页、做题证据与面板回访接合，减少重复整理。详见[Q01](#research-q01)。

共用gate、结构化证据及作用域工具可借鉴；默认回落和多文件恢复需更强契约。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

双HTTP入口本地无身份准入，坏JSON默认回落可被后写覆盖，无投影时学习会话筛选降级。详见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；可信本地非唯一档案，独立备份并用真实题目核掌握。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

学习闭环与证据记账可查，掌握测量仍由输入决定，访问/数据恢复及会话降级边界需闭合。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/preset.js、lib/preset-tools.js、skills/study-coach/SKILL.md、lib/tools.js、lib/map.js、lib/store.js、lib/library.js、lib/handler.js、lib/routes.js、lib/session-preset.js、lib/panel-server.js、lib/pages.js、test/store.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定host装配、预设/Skill与工具注册、掌握证据门、JSON/Library、handler/router分派、会话筛选和PDF关键链；不穷尽全部页面/21工具。
- 下一步：进一步从重复证据、坏JSON、多进程、无preset投影和匿名请求研究隔离/恢复。

**分析版本**

- **仓库**：[Ame-Choo/dsh-study-coach](https://github.com/Ame-Choo/dsh-study-coach)
- **版本号**：0.1.0（[固定提交 7c2c2d3](https://github.com/Ame-Choo/dsh-study-coach/tree/7c2c2d3f71cb49508e567674882eddb1b3a689ba)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究证据去重与延迟测验、每会话profile绑定、统一准入及读错拒写/CAS恢复，比较效果和误归属。当前未验证。详见[Q07](#research-q07)。

进一步从重复证据、坏JSON、多进程、无preset投影和匿名请求研究隔离/恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 3637 | — | — | 81434 |
| .js | source | 39 | 18650 | 14578 | 2893 | — |
| .mjs | source | 5 | 404 | 284 | 90 | — |
| .js | test | 46 | 12456 | 10023 | 1143 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Ame-Choo/dsh-study-coach/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Ame-Choo/dsh-study-coach/issues?q=is%3Aissue+created%3A2026-09-22T06%3A09%3A56.527Z..2026-10-22T06%3A09%3A56.527Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Ame-Choo/dsh-study-coach/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A09%3A56.527Z..2026-10-22T06%3A09%3A56.527Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：学习预设/档案/面板如何构成可追溯学习流程，掌握度和数据/会话边界能支持怎样采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 学习教练提供什么闭环？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

学生将一门课的目标、材料、知识地图、做题/复习证据、错题和每日任务放入独立档案，通过学习教练会话写内容，网页面板查看进度并给教练留言。知识点到具体课/题/页的链接比单纯聊天更便于持续回访；目标完成应依据真实答题与延迟回忆，不是面板百分比变高。

贡献是学习预设、随包Skill、结构化工具和本地档案/面板联动。不是自动可靠判断学生掌握的测量仪，也不是已验证教学算法。README的学习内容不随代码发布、本地多目标目录可查；模型生成地图/题目与判断仍可能出错，需学生核材料和答案。替代为普通聊天加笔记/任务表/间隔卡片，集中回访便利是当前可见价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-10](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/README.md#L9-L10)

作者定位。

```text
**DSH 的学习教练插件。** 给 DSH 加一个「学习教练」模式的会话，外加一个挂在 `/study` 的网页面板：
把一门课拆成知识地图，逐单元记掌握度、排每天的任务，学生看得见自己在往哪走、下一步动哪儿。
```

**依据 2 · 作者声明**：[README.md:33-57](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/README.md#L33-L57)

预设/面板与本地档案。

<details>
<summary>查看原文（25行）</summary>

```text
一个插件是两半：

| | |
| --- | --- |
| **对话那半** | 一个叫「学习教练」的 agent 预设，加随包的工作法 `skills/study-coach/SKILL.md`，加 21 个 `study_*` 工具。**学习内容全在对话里写**：学习目标、知识地图、材料分析、掌握度证据、错题、每日任务。这 21 个工具只挂在「学习教练」这个模式的作用域里——别的会话、别的预设的工具目录里看不见它们（见 `lib/preset-tools.js`）。 |
| **网页那半** | 挂在 DSH 自己 web 服务器上的面板（`/study`，八页）。学生只在面板上看和点：今天做什么、进度到哪、哪个单元薄弱、该复习什么，点一下就打开那一节网课 / 那份练习的那一页。 |

**这个仓库里只有代码，一条学习内容都没有。** 目标、地图、掌握度、任务、材料清单全是数据，落在本机的数据根目录里
（默认 `~/.dsh/study-coach/`）：卸载、升级、重装都不会动它，换地方就设环境变量 `DSH_STUDY_ROOT`。
一个**学习目标**一份档案目录，所以同一台机器上可以同时学几门课，各有各的地图、掌握度和任务表。

## 装完你会得到什么

### 面板八页

| 页 | 里面是什么 |
| --- | --- |
| 主页 | 教练的指引：现在该回对话里做什么 |
| 今日任务 | 今天几条活儿——看哪一讲、做哪几题、复习哪条错题，每条带「打开」，能勾完成 / 改 / 删。下面是今日复盘图，可以单独下载成 SVG |
| 知识地图 | 大类 → 模块 → 最小单元三层，逐层展开；画布能按住拖着挪，Ctrl／⌘ + 滚轮缩放。每个单元两颗按钮：**看课**（自动落到那一讲的文件上）、**做题**（把教练叫来，按你的档案挑材料页码与题号） |
| 学习 | 资料图谱：一份材料按它自己的目录摊三层，每一层右边都是能直接打开对应那一段的链接 |
| 档案 | 综合学生档案（总体评价、四层掌握度、七天节奏、学生画像、基本工具、错题）+ 学习目标 + 学生画像；每个大类 / 模块 / 单元后面一颗「档案」按钮看那一级的细账 |
| 资料 | 材料登记表、导入（拖 PDF 进来或者粘本机路径）、AI 出题的入口 |
| 工具 | 番茄钟、记忆卡（按艾宾浩斯那套间隔回来）、清单 |
| 对话 | 整页一个聊天窗口，顶上能选 DSH 里哪个学习会话；右下角一颗悬浮窗，随时能把话塞给教练 |
```

</details>

**依据 3 · 源码核查**：[index.js:17-28](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/index.js#L17-L28)

预设工具设计。

<details>
<summary>查看原文（12行）</summary>

```text
 * 21 个模型面向的工具**不在这儿注册**：它们在「学习教练」预设的作用域里注册
 * （见 lib/preset-tools.js）。清单以 lib/tools.js 里 buildTools() 返回的那个数组为唯一依据：
 *   study_report / study_goal / study_map / study_record / study_mistakes / study_plan /
 *   study_material / study_analysis / study_book / study_archive / study_ability /
 *   study_student / study_library / study_files / study_pages / study_tool_level /
 *   study_focus / study_todo / study_card / study_guide / study_inbox，
 * 让教练在对话里就能读写档案、给面板留话、收面板上的留言。
 * 这一步只把这一行需要的家什用服务 `studyCoachHost` 递出去——挂在本插件自己的 ctx 上就是
 * 全局注册，普通会话的工具目录里也会多出这 21 个（2026-10-02 修掉的越界）。
 *
 * 再把「学习教练」agent 预设登记进 host 的 agentPresets 注册表（见 lib/preset.js），
 * 这样 Web 上新建会话的模式列表里会多一个「学习教练」。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预设、Skill和工具怎样装配？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

host创建共享Library、bridge/chat、SSE与面板控制器，把同一handler挂宿主/study和独立127.0.0.1端口；studyCoachHost传store/defineTool等给预设子插件。preset加载persona、文件/命令工具、Skill文件系统及规划/压缩/委派组，21个study_*注册在预设子作用域，普通会话工具面不应全局增加；这依赖匹配宿主scope和agentPresets语义，源码注释不是独立宿主验证。随包Skill要求先问目标、核材料/地图，再记录与排任务，是真实文件Skill而非一段提示被误标。

需要Node>=22.13、DSH>=0.2候选版、tools/webServer及预设所列官方插件；部分会话桥接缺sessionController可降级留言。PDF渲页另需Python/PyMuPDF，execFileSync最多180秒、限制页数/DPI，仍会同步占宿主线程。不能把npm无普通dependencies理解为运行无外部能力。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:68-92](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/index.js#L68-L92)

共享实例与桥接。

<details>
<summary>查看原文（25行）</summary>

```text
export function apply(ctx) {
  const store = new Library(DATA_ROOT)
  store.ensure()

  /**
   * 面板 → 对话 的那条线。sessionController 不写进 inject：
   * 是个可选增强，缺了面板照样能用（留言先存着，我下回开口时会看到），
   * 写进 inject 反而会让整个插件在这台机器上装不上。
   */
  const bridge = createBridge({
    resolve: () => (typeof ctx.get === 'function' ? ctx.get('sessionController') : null),
  })

  /**
   * 反方向：把对话读回面板。和 bridge 共用同一个服务、同一套「缺了也能跑」的规矩。
   */
  const chat = createChat({
    resolve: () => (typeof ctx.get === 'function' ? ctx.get('sessionController') : null),
  })

  /**
   * 面板的广播通道。浏览器会把后台标签页里的定时器压慢甚至冻住，
   * 「新消息得手动刷新」就是这么来的——改成服务端推给前端。
   */
  const events = createEvents()
```

</details>

**依据 2 · 源码核查**：[index.js:118-176](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/index.js#L118-L176)

双入口。

<details>
<summary>查看原文（59行）</summary>

```text
  const router = createRouter(store, {
    bridge,
    chat,
    events,
    memes,
    pagesRoot: PAGES_ROOT,
    /**
     * 设置页与客户端那半边都打 /study/api/panel，落地就在这儿。
     * save 是同步抛错的那种：值不合法要回 400 并说清哪一项，不能静默存下去。
     */
    panel: {
      info: () => panelControl.info(),
      start: (port) => panelControl.start(port),
      stop: () => panelControl.stop(),
      restart: (port) => panelControl.restart(port),
      settings: () => panelSettings,
      save: (patch) => {
        panelSettings = patchSettings(DATA_ROOT, patch)
        return panelSettings
      },
    },
  })
  const handler = createHandler(store, router, { assetsDir: ASSETS, pagesRoot: PAGES_ROOT, uploadRoot: UPLOAD_ROOT })
  panelHandler = handler

  /**
   * 面板在哪儿的两条地址。工具拿它告诉用户该开哪个。
   * path 是同源那份；url / port 是独立端口那份，用 getter 现问，因为随时可能被关掉或换端口。
   */
  const panel = {
    path: '/study',
    defaultPort: DEFAULT_PORT,
    get url() {
      return panelControl.info().url
    },
    get port() {
      return panelControl.info().port
    },
    get running() {
      return panelControl.info().running
    },
    get error() {
      return panelControl.info().error
    },
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/study',
    handler,
  }), 'dsh-study-coach: /study 面板与接口（同源）')

  ctx.effect(() => {
    /* 关掉自启就不起：内嵌浏览器要用的时候，人去设置页点「启动」。 */
    if (panelSettings.panel.autoStart) void panelControl.start()
    return () => {
      void panelControl.stop()
    }
  }, 'dsh-study-coach: 面板独立端口')
```

</details>

**依据 3 · 源码核查**：[lib/preset.js:73-135](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/preset.js#L73-L135)

预设插件组。

<details>
<summary>查看原文（63行）</summary>

```text
export function buildPreset() {
  const win = process.platform === 'win32';
  return {
    id: PRESET_ID,
    name: '学习教练',
    description: '对话里问清目标、解析教辅与网课目录、生成知识地图、排每日任务，配 /study 面板。',
    order: 2,
    plugins: [
      {
        id: 'persona',
        name: '@deepseek-ai/dsh-persona',
        config: { suffix: 'Your working directory is {{cwd}}.', prefix: PERSONA_PREFIX },
      },
      { id: 'agent-instructions', name: '@deepseek-ai/dsh-agent-instructions', config: { maxBytes: 65536 } },
      { id: 'tool-bash', name: '@deepseek-ai/dsh-tool-bash', disabled: win },
      { id: 'tool-pwsh', name: '@deepseek-ai/dsh-tool-pwsh', disabled: !win },
      { id: 'tool-fs', name: '@deepseek-ai/dsh-tool-fs' },
      { id: 'tool-fs-search', name: '@deepseek-ai/dsh-tool-fs-search', config: { sampleOverCapGlobResults: false } },
      { id: 'tool-jobs', name: '@deepseek-ai/dsh-tool-jobs' },
      { id: 'skill-filesystem', name: '@deepseek-ai/dsh-skill-filesystem', config: { customSkillDirs: [SKILLS_DIR] } },
      { id: 'tool-skill', name: '@deepseek-ai/dsh-tool-skill' },
      { id: 'command-goal', name: '@deepseek-ai/dsh-command-goal' },
      { id: 'tool-goal', name: '@deepseek-ai/dsh-tool-goal' },
      {
        id: 'planning',
        name: 'cordis:group',
        group: true,
        isolate: { planMode: true },
        config: [
          { id: 'plan-mode', name: '@deepseek-ai/dsh-plan-mode', config: { section: PLAN_MODE_SECTION } },
        ],
      },
      {
        id: 'compaction',
        name: 'cordis:group',
        group: true,
        isolate: { compaction: true, toolResultPruner: true },
        config: [
          { id: 'compaction-basic', name: '@deepseek-ai/dsh-compaction-basic' },
          { id: 'command-compact', name: '@deepseek-ai/dsh-command-compact' },
          {
            id: 'tool-result-pruner',
            name: '@deepseek-ai/dsh-compaction-tool-result-pruner',
            config: { thresholdChars: 8192, headChars: 4096, tailChars: 1024 },
          },
        ],
      },
      {
        id: 'delegation',
        name: 'cordis:group',
        group: true,
        isolate: { workflowEngine: true },
        config: [
          { id: 'tool-subagent-control', name: '@deepseek-ai/dsh-tool-subagent-control' },
          { id: 'tool-subagent-list-agents', name: '@deepseek-ai/dsh-tool-subagent-control/list-agents' },
          {
            id: 'tool-subagent',
            name: '@deepseek-ai/dsh-tool-subagent',
            config: {
              provider: 'spawn',
              toolName: 'subagent',
              modelSelectionSettings: true,
              backgroundMode: 'continuable',
```

</details>

**依据 4 · 源码核查**：[lib/preset-tools.js:29-61](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/preset-tools.js#L29-L61)

预设工具生命周期。

<details>
<summary>查看原文（33行）</summary>

```text

/**
 * 注册 21 个工具。注册用的就是这一行自己的 ctx ⇒ 落在预设作用域里。
 * @param {import('@deepseek-ai/cordis').Context} ctx
 */
export function apply(ctx) {
  /*
   * 非严格读：这一行的 ctx 在注册表那条分支上，跟提供服务的插件是兄弟分支，
   * 严格模式会额外过一道「提供者 fiber 此刻是活的吗」，跨分支没必要卡这一道。
   */
  const host = ctx.get('studyCoachHost', false)
  if (!host || typeof host.registerTools !== 'function') {
    /* 不为难自己：说清楚是哪半边没到位，别安安静静地少掉 21 个工具。 */
    console.error('[dsh-study-coach] 预设这一行拿不到 studyCoachHost，21 个 study_* 工具没注册上')
    return
  }

  return ctx.effect(() => {
    const disposers = host.registerTools(ctx, host.store, host.defineTool, {
      panel: host.panel,
      pagesRoot: host.pagesRoot,
    })
    return () => {
      for (const dispose of disposers) {
        try {
          dispose()
        } catch {
          /* 单个工具注销失败不该拦住别的 */
        }
      }
    }
  }, 'dsh-study-coach: 学习档案工具（只在学习教练会话里）')
}
```

</details>

**依据 5 · 源码核查**：[skills/study-coach/SKILL.md:1-65](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/skills/study-coach/SKILL.md#L1-L65)

学习工作法。

<details>
<summary>查看原文（65行）</summary>

```text
---
name: study-coach
description: 学习教练的工作法。讲清怎么问目标、怎么把教辅和网课目录变成知识地图、扫描版讲义怎么拆到页、六档掌握度怎么判、每日任务怎么排、什么时候出摸底题，以及怎么用面板、每级掌握档案、总体能力判词、学习目标库和文件工具，哪些事不许做。
whenToUse: 进入学习教练模式，或者准备用 study_* 这一组工具之前。
---

# 学习教练工作法

## 0. 开场

手上有了这份文档（加载一次就够，别每轮重读），每次会话第一件事就是：调 `study_report`。

- 看 `inboxItems`，非空说明某个单元还没关联网课、他在做题页点了「请帮忙配置」——那是唯一的来源，不是留言板。处理完用 `study_inbox` 传 `action=read` 清掉（只想标其中几条，就把 id 放进 `ids`）。
- 看 `goal` 四个字段空不空，有空的说明目标还没问全。（`complete` 那个标志只在 `study_goal` 的返回里，`study_report` 不返回它。）
- 看 `mapStatus`，`draft` 说明地图还没定稿。
- **看 `studentFacts`（学生画像）**：这是历次攒下来的结论（「换元之后容易忘记回代」「早读效率高」），每条底下挂着它当初依据的那几次。**读完这个再决定怎么教**，别每次从零总结一遍。只有 `id / kind / text / note / evidenceCount`，要细看调 `study_student`。
- 看 `today` 和 `tasks`：今天几号、今天排没排活。
- 看 `panelUrl`，把它连同「看进度、自评、勾任务都去这儿」一起告诉学生。这是面板给**他自己**看的那一份，不是你偷懒的替代品。
- `dataRoot` 是这套档案在硬盘上的家，`profileId` 是当前在用的那份学习目标。学生问「东西存哪儿 / 会不会丢 / 能不能手改」，照这两个答：**插件本体只有代码，他的东西全在 `dataRoot` 里一个目标一份目录**。
- 要 id（`pointId` / `taskId` / 材料 id）全从这个返回里拿，别自己编。

## 1. 问目标

四样都得有：学什么、要掌握到什么程度、最晚什么时候、每天能挤多少分钟。

- 一次问一两个，别一口气盘问。
- `outcome` 要用学生自己的话。他说不清就举例子让他挑，别替他总结。
- `minutesPerDay` 定了就别随便改口——后面排计划全靠它。
- 问清了调 `study_goal` 写进去。

## 2. 收材料

学生可能丢来这些东西，每种的记法不一样：

- **一本教辅**：书名 + 目录。一条 `study_material`，`kind: book`，`note` 写章节范围。
- **网课目录文件夹**：一串文件名。先用 `study_files`（或 pwsh）把目录列出来，**讲次得你自己从文件名里解出来**（`01_第一节.mp4` → 第 1 讲 第一节），解出来的结果写进 `note`；`path` 写绝对路径。
- **讲义 / 真题**：同上，`kind: notes` / `past`。
- **你自己出的卷子**：`kind: ai`。正文写成 `.md` 放进数据目录的 `ai/`，`path` 指向那个文件，`title` 写清「哪一天 · 哪一节 · 什么卷」。它在书架上跟教辅**平级**成一组，做题页也按单元列出来。**别写在对话里就完事**——不登记他在面板上找不到（细节见第 6 节）。

`kind` 六选一：`book` / `video` / `notes` / `past` / `ai` / `other`，写错会被工具当场拒掉。一次丢一堆就一条条登记，别合成一条。

### 书架上的文件夹

材料多了要收纳，就用 `study_material` 的 **`folder`** 参数：写名字就行，**不存在会现建**。两个约定：

- **`kind: ai` 默认进「教练产出」**（你出的卷子、复盘、计划都归那儿），不用每次手写 `folder`。
- 一套书拆成好几册 / 好几章（一本主书 + 一本答案 + 六份分章答案）**放进同一个夹子**，学生在资料页看到的就是一组，不是三十几行。
- 挪夹子用 `study_material action=move`（要带 `id`，`folder` 留空 = 挪回未分组）。**文件夹只管收纳，跟进度无关**：删掉一个夹子不删材料，里头的会退回「未分组」。
- 学生自己在面板上也能建 / 改名 / 删夹子、把材料挪进去（那是收纳，不是学习数据）——他动了你别去覆盖，看他怎么分就知道他心里的结构。

### 材料还没到手的时候

学生常常只丢一个考试名或一个书名，材料要你去核。规矩是**宁可说「没找到」，也别编一个**。

- **书名要核到版本**：版次、上下册、套装是三样东西，标题像不等于同一本。有 ISBN 就用 ISBN 查；**查不到不代表不存在**——换书名、去掉副标题、换作者、加版次再查一遍。
- **分清三档**，并且跟他说清是哪一档：有这本书的书目记录 / 有样章 / 有全文。只查到书目就说只有书目。
- **考纲和真题优先于教材**。大型考试先找主办方当年的通知、大纲、组别规则，再找公开的历年真题和解析；教材是拿来解释知识点的，不是拿来定范围的。
- **查不到就直说**，把试过的线索列出来让他复核。别拿「搜索引擎没收录」当成「不存在」。
- **授权边界**：不指引、不代为下载未经授权的教材副本，别把没核实的镜像站说成官方入口。
- 找不到材料也能开工：用**已经确认**的考纲、真题、公开课和他手上有的东西先出一版，`study_material` 的 `note` 里写清哪些是核过的、哪些是待核的，`study_analysis` 的 `coverage` 老实标「只翻目录 / 部分通读」。

### 材料到手别急着排任务，先通读一遍

登记完一份材料，头一件事是把它读一遍、把结构摸出来，再用 `study_analysis` 写下来。

```

</details>

**依据 6 · 源码核查**：[lib/pages.js:74-106](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/pages.js#L74-L106)

PDF执行依赖/限额。

<details>
<summary>查看原文（33行）</summary>

```text
export function renderPages(pdfPath, options = {}) {
  const python = options.python || findPython(options.home)
  if (!python) return { ok: false, error: '找不到 python，设 DSH_STUDY_PYTHON 指过去就行' }
  if (!existsSync(pdfPath)) return { ok: false, error: `这份文件不在：${pdfPath}` }

  const dir = options.outDir
  if (!dir) return { ok: false, error: '没给 outDir' }
  try {
    mkdirSync(dir, { recursive: true })
  } catch (error) {
    return { ok: false, error: `建不出目录 ${dir}：${error.message}` }
  }

  const from = Math.max(1, Number(options.from) || 1)
  const to = Math.max(from, Number(options.to) || from)
  const dpi = Math.min(220, Math.max(60, Number(options.dpi) || DEFAULT_DPI))
  if (to - from + 1 > MAX_PAGES_PER_CALL) {
    return { ok: false, error: `一次最多 ${MAX_PAGES_PER_CALL} 页，收到 ${to - from + 1} 页。分了批来` }
  }

  let stdout = ''
  try {
    stdout = execFileSync(python, ['-X', 'utf8', '-c', SCRIPT, pdfPath, dir, String(from), String(to), String(dpi)], {
      encoding: 'utf8',
      timeout: 180000,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } catch (error) {
    const tail = String(error.stderr || error.message || '').split('\n').filter(Boolean).slice(-1)[0] || ''
    if (/No module named|ModuleNotFoundError/.test(tail)) {
      return { ok: false, error: `这份 python 里没有 pymupdf：${python}。装一下：${python} -m pip install pymupdf` }
    }
    return { ok: false, error: `渲染失败：${tail || error.message}` }
```

</details>

**依据 7 · 源码核查**：[package.json:40-49](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/package.json#L40-L49)

运行约束。

<details>
<summary>查看原文（10行）</summary>

```text
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-tools": "^0.2.0-rc.1"
  },
  "engines": {
    "node": ">=22.13.0",
    "dsh": ">=0.2.0-rc.1"
  },
  "scripts": {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 掌握度证据比主观自评多了什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

map gateStage限制一次最多进一档，高阶要足够quiz/photo做题类证据，self/lesson/review不计真做过数量；模型study_record与面板mastery共用门，减少只管模型不管UI的漂移。recordEvidence保存ID、种类、时间、说明、stage、置信度和下次复习日期；作废不直接丢行，derivedStage可按有效流水重算并找漂移，这种可解释记账有实用价值。

但证据kind/note由模型或用户填写，没有自动证明题目确实做过、答案正确、来源不可伪造；重复提交不同ID也可能增加计数。confidence是输入值夹0..1，非校准测量。nextReview由输入提供，工具文案给1/2/4/7天粗规则，不是个人化遗忘率估计。记录门只能约束升级节奏，不能证明学习效果，更不能把重复条目当独立能力证据。当前未做同条件学生学习成绩对照。

#### 证据与依据

**依据 1 · 源码核查**：[lib/map.js:19-49](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/map.js#L19-L49)

升级门。

<details>
<summary>查看原文（31行）</summary>

```text
 * 教练调 `study_record` 和学生自己在面板上点那颗档位按钮，走的是同一条规则。
 *
 * 学生那条路以前是直通的——他点一下「能讲明白」，档位就真成了能讲明白，
 * 门只管得住教练。档位是同一份账，门就得分不出两条路。
 *
 * 两条规矩：①一次只前进一档（填跳了压回上一档）；②推到 `STAGE_NEEDS` 里那几档
 * 之前，这个单元下得有真做过的证据（`WORK_KINDS`），自评、上课、复习都不算。
 *
 * 回 `{ stage, before, clamped, blocked, need, made }`：`stage` 是允许落到的档，
 * `blocked` 为真时调用方**别写 stage**——落一条证据、档位不动，把 `need`/`made` 告诉他。
 */
export function gateStage(mastery, pointId, wanted, kind = '') {
  const before = pointState(mastery, pointId).stage
  let stage = before
  let clamped = false
  if (STAGES.includes(wanted)) {
    const ceiling = Math.min(STAGES.indexOf(before) + 1, STAGES.length - 1)
    if (STAGES.indexOf(wanted) > ceiling) {
      stage = STAGES[ceiling]
      clamped = true
    } else {
      stage = wanted
    }
  }
  const need = STAGE_NEEDS[stage] || 0
  let made = 0
  if (need) {
    // 作废的证据不算数：盖了章的那条不该还撑着档位。
    made = workCountOf(pointState(mastery, pointId)) + (WORK_KINDS.includes(kind) ? 1 : 0)
  }
  return { stage, before, clamped, blocked: need > 0 && made < need, need, made }
```

</details>

**依据 2 · 源码核查**：[lib/map.js:64-111](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/map.js#L64-L111)

有效证据与重算。

<details>
<summary>查看原文（48行）</summary>

```text
export function isVoided(item) {
  return Boolean(item && item.voidedAt)
}

/** 这笔账里真算数的证据（作废的不算）。错题、弱项、重算全走它。 */
export function liveEvidence(state) {
  const list = Array.isArray(state && state.evidence) ? state.evidence : []
  return list.filter((item) => !isVoided(item))
}

/** 「真做过」的证据有几条（做题 / 作业照片）。自评、上课、复习不算。 */
export function workCountOf(state) {
  return liveEvidence(state).filter((e) => WORK_KINDS.includes(e.kind)).length
}

/**
 * 照着流水重算档位。
 *
 * 为什么要有它：档位是**写下来的**（`state.stage`），所以它只反映记的那一刻。
 * 一条证据后来作废了、或者旧版本绕过门直接写了档位，账面上都看不出破绽。重算就是
 * 把同一道门照着流水再走一遍，得到「凭这些证据最多能到哪一档」；跟账上写的对不上
 * 就叫漂移（`driftOf` 会挑出来）。
 *
 * 两条规矩跟 `gateStage` 完全一致，别在这儿另立一套：
 *   ①每条证据自己记着「我之后档位在哪」（`item.stage`），一次只前进一步；
 *   ②`STAGE_NEEDS` 里那几档要凑够「真做过」的证据，不够就停在原地。
 * 没有 `item.stage` 的老证据（加这个字段之前记的）只算进 `workCount`：它证得了
 * 「他做过」，证不了「当时判成了哪一档」，所以不让它推动档位。
 *
 * 返回 `{ stage, source, work }`：`source` 是最后一次推动档位的那条证据 id。
 */
export function derivedStage(state) {
  const list = liveEvidence(state)
  let stage = '没接触过'
  let work = 0
  let source = null
  for (const item of list) {
    if (WORK_KINDS.includes(item.kind)) work += 1
    const want = STAGES.includes(item && item.stage) ? item.stage : null
    if (!want) continue
    const ceiling = Math.min(STAGES.indexOf(stage) + 1, STAGES.length - 1)
    const next = STAGES.indexOf(want) > ceiling ? STAGES[ceiling] : want
    if (next === stage) continue
    if ((STAGE_NEEDS[next] || 0) > work) continue
    stage = next
    source = item.id ? String(item.id) : null
  }
  return { stage, source, work }
```

</details>

**依据 3 · 源码核查**：[lib/map.js:324-345](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/map.js#L324-L345)

证据实际保存字段。

<details>
<summary>查看原文（22行）</summary>

```text
export function recordEvidence(mastery, { pointId, kind, note, stage, confidence, nextReview, mistake }) {
  if (!pointId) throw new Error('pointId required')
  if (!mastery.points || typeof mastery.points !== 'object') mastery.points = {}
  const prev = pointState(mastery, pointId)
  const evidence = prev.evidence.slice()
  const item = { id: newEvidenceId(), kind: kind || 'self', at: nowIso(), note: note || '' }
  if (mistake) item.mistake = normalizeMistake(mistake)
  const nextStage = STAGES.includes(stage) ? stage : prev.stage
  item.stage = nextStage
  evidence.push(item)
  const moved = STAGES.indexOf(nextStage) !== STAGES.indexOf(prev.stage)
  const source = moved || !prev.source ? String(item.id) : prev.source
  const next = {
    stage: nextStage,
    confidence: typeof confidence === 'number' ? clamp01(confidence) : prev.confidence,
    evidence,
    nextReview: nextReview ?? prev.nextReview,
    updatedAt: nowIso(),
    source,
  }
  mastery.points[pointId] = next
  return next
```

</details>

**依据 4 · 源码核查**：[lib/tools.js:1018-1042](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/tools.js#L1018-L1042)

模型门和写。

<details>
<summary>查看原文（25行）</summary>

```text
      // 一次只推进一档 + 硬闸门。规则本体在 lib/map.js 的 gateStage——
      // 面板上他自己点的那颗档位按钮走的是同一条，不再是「门只管教练」。
      const plan = gateStage(store.read('mastery'), pointId, args.stage, args.kind)
      const wanted = plan.stage
      const clamped = plan.clamped
      if (plan.blocked) {
        throw new Error(
          `升到「${wanted}」得先有 ${plan.need} 条真做过的证据（kind 填 quiz 做题或 photo 作业照片），` +
            `「${pointId}」现在只有 ${plan.made} 条——自评、上课、复习都不算。` +
            `先让他做几道题，把题号写进 note，再记一次。`,
        )
      }

      const next = store.update('mastery', (m) => {
        recordEvidence(m, {
          pointId,
          kind: args.kind,
          note: args.note,
          stage: wanted,
          confidence: args.confidence,
          nextReview: args.nextReview,
          mistake: args.mistake,
        })
        return m
      })
```

</details>

**依据 5 · 源码核查**：[lib/routes.js:917-938](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/routes.js#L917-L938)

面板共用门。

<details>
<summary>查看原文（22行）</summary>

```text
  on('POST', /^\/study\/api\/mastery$/, ({ body }) => {
    const pointId = body && body.pointId
    if (!pointId) return bad('pointId required')
    const known = listPointIds(store.read('map'))
    if (known.length && !known.includes(pointId)) return bad('unknown pointId: ' + pointId, 404)
    if (body.stage && !STAGES.includes(body.stage)) return bad('stage must be one of ' + STAGES.join('/'))
    // 面板上那颗档位按钮走这里——是学生自己点的，但档位只有一份账，
    // 所以门也得是同一条（lib/map.js 的 gateStage，跟 study_record 共用一个规则）。
    // 升不动的时候**记他说的话、不动档位**，并把差几条告诉他。
    const plan = gateStage(store.read('mastery'), pointId, body.stage, body.kind)
    const mastery = store.update('mastery', (m) => {
      recordEvidence(m, {
        pointId,
        kind: body.kind,
        note: body.note,
        stage: plan.blocked ? undefined : plan.stage,
        confidence: body.confidence,
        nextReview: body.nextReview,
        mistake: body.mistake,
      })
      return m
    })
```

</details>

**依据 6 · 源码核查**：[lib/tools.js:918-918](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/tools.js#L918-L918)

粗复习日期指引。

```text
      nextReview: str('下次该复习的日期，YYYY-MM-DD。粗定就行：见过隔 1 天、能跟做隔 2 天、能独立做隔 4 天、熟练稳定隔 7 天'),
```

#### 缺口

- 证据来源、重复独立性与学习成效缺少可核对测量契约
  **影响**：计数门和面板进度不能作为客观掌握或考试保证
  **进一步探讨**：对齐题目/答案来源与去重ID，用延迟测验对照普通笔记流程

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 双HTTP入口和会话桥接的访问边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

独立面板绑定127.0.0.1减少直接公网暴露，但复用handler/router自身没有身份、Origin或token准入；宿主/study能否远程访问由部署层负责。router直接按method/pattern分派写档案、面板启停和会话投递。CORS浏览器读取限制不等服务端授权，不能把loopback或独立origin视为认证。学习档案、学生画像、错题和聊天可能含敏感个人资料，应按可信本地单用户边界看待。

文件读取限制已登记材料或pages根，采用resolve前缀而无realpath核对；目录中链接可让物理目标离开登记范围，注册材料本身也可指向广目录。不要据“已登记”推出OS沙箱。桥接/chat按学习preset筛会话，但没有preset投影时主动不过滤非子会话，老宿主可能暴露/选中普通会话，不是始终严格学习隔离。资料内容被模型阅读后受其提示/权限处理，学生文件本身仍是未可信输入。

#### 证据与依据

**依据 1 · 源码核查**：[lib/panel-server.js:1-34](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/panel-server.js#L1-L34)

loopback绑定。

<details>
<summary>查看原文（34行）</summary>

```text
/**
 * 插件自己起的小 HTTP 服务器，只为绕开 DSH 内嵌浏览器的「不许开 DSH 自身」。
 *
 * 面板的接口全部相对 /study，所以这里复用同一个 handler，页面上不用改一行。
 * 只监听 127.0.0.1，不对外。
 */
import { createServer } from 'node:http'

export const DEFAULT_PORT = 19388
export const PORT_TRIES = 20
export const HOST = '127.0.0.1'

function listen(handler, port, host) {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      Promise.resolve(handler(req, res)).catch((error) => {
        try {
          const body = JSON.stringify({
            ok: false,
            error: { code: 'internal', message: String((error && error.message) ?? error) },
          })
          res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
          res.end(body)
        } catch {
          /* 客户端已经跑了，没法再回话 */
        }
      })
    })
    const onError = (error) => reject(error)
    server.once('error', onError)
    server.listen(port, host, () => {
      server.removeListener('error', onError)
      resolve(server)
    })
```

</details>

**依据 2 · 源码核查**：[lib/handler.js:124-141](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/handler.js#L124-L141)

词法登记范围。

<details>
<summary>查看原文（18行）</summary>

```text
function allowedTarget(store, raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return null
  const target = resolve(raw)
  const materials = store.read('profile').materials
  const list = Array.isArray(materials) ? materials : []
  for (const m of list) {
    if (!m || !m.path) continue
    const base = resolve(String(m.path))
    if (target !== base && !target.startsWith(base + sep)) continue
    if (!existsSync(target)) continue
    try {
      statSync(target)
      return target
    } catch {
      /* 文件正好被挪走，当没有 */
    }
  }
  return null
```

</details>

**依据 3 · 源码核查**：[lib/handler.js:329-369](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/handler.js#L329-L369)

pages/入口守卫。

<details>
<summary>查看原文（41行）</summary>

```text
export function createHandler(store, router, { assetsDir, uploadRoot, pagesRoot } = {}) {
  /** 网页上传的原件落哪儿。默认档案库根下的 uploads/，不动用户自己的文件夹。 */
  const uploads = uploadRootOf(store, uploadRoot)
  /** 拆出来的页图落哪儿。这些图不在任何登记过的材料路径底下，所以单独开一条只读出口。 */
  const pages = pagesRootOf(store, pagesRoot)

  /**
   * 只放行 pagesRoot 底下的文件——学生能点开的页图仅限这里。
   * 和 allowedTarget 一个道理：不是「给了路径就发」，而是「先认它归不归我管」。
   */
  function allowedPage(raw) {
    if (!pages || !raw) return null
    const target = resolve(String(raw))
    if (target !== pages && !target.startsWith(pages + sep)) return null
    try {
      if (!existsSync(target) || !statSync(target).isFile()) return null
    } catch {
      return null
    }
    return target
  }

  /** 面板和它的静态资源只从 assets 目录出，别的地方一律 404。 */
  function resolveAsset(pathname) {
    const rel = pathname.slice(ASSET_PREFIX.length)
    if (rel === '') return null
    const target = normalize(join(assetsDir, rel))
    if (!target.startsWith(assetsDir)) return null
    if (!existsSync(target) || !statSync(target).isFile()) return null
    return target
  }

  /** `/study`、`/study/` 与 /study/<子页> 都归面板；practice / file / assets / api 各有自己的分支。 */
  function isPanelPath(pathname) {
    const clean = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
    if (clean === '/study') return true
    if (!clean.startsWith('/study/')) return false
    return PANEL_PAGES.includes(clean.slice('/study/'.length))
  }

  return async function handler(req, res) {
```

</details>

**依据 4 · 源码核查**：[lib/handler.js:529-546](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/handler.js#L529-L546)

直接送router。

<details>
<summary>查看原文（18行）</summary>

```text
      const body = wantsBody ? await readBody(req) : {}
      // 有几条路由是异步的（面板往对话里投话），这里必须等它落地，
      // 否则拿到的是一张还没结果的白卷。
      const result = await router({
        method: req.method,
        pathname: path,
        query: Object.fromEntries(url.searchParams),
        body,
        req,
        res,
      })
      // 广播通道那条自己接管了响应（SSE 长连接不结束），这儿别再去写 JSON。
      if (result && result.handled) return
      if (result && result.raw) {
        sendRaw(res, result.raw)
        return
      }
      sendJson(res, result.code, result.body)
```

</details>

**依据 5 · 源码核查**：[lib/routes.js:1653-1676](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/routes.js#L1653-L1676)

按模式分派。

<details>
<summary>查看原文（24行）</summary>

```text
  return function handle(request) {
    const method = (request && request.method) || 'GET'
    /* HEAD 按 GET 的路由找（HTTP 就这么定的「只要头不要体」），响应体由 Node 自己省掉。 */
    const wanted = method === 'HEAD' ? 'GET' : method
    const pathname = (request && request.pathname) || '/'
    for (const route of routes) {
      if (route.method !== wanted) continue
      const match = route.pattern.exec(pathname)
      if (!match) continue
      const failure = (error) => ({
        code: 500,
        body: { ok: false, error: { code: 'internal', message: String((error && error.message) ?? error) } },
      })
      try {
        const out = route.fn({
          body: request.body,
          query: request.query,
          params: match.slice(1),
          /* 广播通道那条要拿原始响应自己接管（SSE 长连接），别的路由不看这两个 */
          req: (request && request.req) || null,
          res: (request && request.res) || null,
        })
        // 同步路由照旧直接返回；异步的（投递、读对话那几条）把 rejection 也收成响应，别让它飘出去。
        return out && typeof out.then === 'function' ? out.catch(failure) : out
```

</details>

**依据 6 · 源码核查**：[lib/session-preset.js:14-20](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/session-preset.js#L14-L20)

兼容降级原因。

```text
 * 但这个字段是可选的（老宿主可能整份清单都不带 projections）。那种时候**不能**按它
 * 过滤：清单会被筛成一片空白，面板的对话页直接废掉。所以拿不到投影就退回「不过滤」，
 * 由 hasPresetChannel() 说清楚这次到底筛没筛。
 *
 * 还有一处例外：面板自己按「新建」开出来的那个会话。投影是异步落下来的，create()
 * 回来的那一瞬间它在清单里可能还没有 preset 那一行——严格筛会把它自己筛掉，学生点了
 * 新建还是一片空白。所以这些 id 先记一笔（rememberFresh），等投影补上就自然走预设那条路。
```

**依据 7 · 源码核查**：[lib/session-preset.js:97-100](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/session-preset.js#L97-L100)

无投影不过滤。

```text
export function learningSessions(items) {
  const rows = (Array.isArray(items) ? items : []).filter(visible)
  if (!hasPresetChannel(rows)) return { items: rows, filtered: false }
  return { items: rows.filter((item) => presetOf(item) === PRESET_ID || isFresh(item.sessionId)), filtered: true }
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 本地JSON会保住数据和档案隔离吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

Store每文件同步读改写，经固定.tmp+rename避免半截JSON，但没有跨进程锁/版本CAS，也不是多文件事务；同时多个DSH进程或外部手改同文件可互相覆盖。read遇损坏/缺失/非对象返回默认值，没有错误状态/备份，接下来的update会把默认新值覆写到原路径，用户可能直到之后才发现历史丢失。updatedAt只在缺失时补，不是每次都刷新，不能直接当最近修改审计。

Library有多个profile目录和全局registry.active，初始化旧单目录迁移用逐文件rename，故障可留部分搬迁；registry坏内容返回空库重建，没有保留损坏证据。多个档案是数据组织，不自动等于每会话固定绑定档案。工程上纯map/schema、共用gate、注册作用域/路由唯一性检查与多种单测有价值，但不能从测试数量推数据恢复完整。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:78-110](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/store.js#L78-L110)

默认回落、固定tmp和updatedAt。

<details>
<summary>查看原文（33行）</summary>

```text
  read(key) {
    try {
      const raw = readFileSync(this.path(key), 'utf8')
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return this.default(key)
      return parsed
    } catch {
      return this.default(key)
    }
  }

  /** 整份写下去，先落临时文件再改名，避免写一半断电留个半截 JSON。 */
  write(key, value) {
    const target = this.path(key)
    const tmp = target + '.tmp'
    writeFileSync(tmp, JSON.stringify(value, null, 2), 'utf8')
    renameSync(tmp, target)
    return value
  }

  /** 改一份：读出当前值，交给 fn，写回。fn 里就地改或者返回新对象都行。 */
  update(key, fn) {
    const current = this.read(key)
    const next = fn(current) ?? current
    if (next && typeof next === 'object' && !next.updatedAt && key !== 'map' && key !== 'mastery') {
      next.updatedAt = nowIso()
    }
    return this.write(key, next)
  }

  /** 面板要一眼看全，这里一次把几份都端出去。 */
  snapshot() {
    const map = this.read('map')
```

</details>

**依据 2 · 源码核查**：[lib/library.js:100-164](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/library.js#L100-L164)

迁移/registry恢复。

<details>
<summary>查看原文（65行）</summary>

```text
  /** 该有的目录和文件都补齐；顺手把老版本的单档案搬进 profiles/default。 */
  ensure() {
    if (!existsSync(this.root)) mkdirSync(this.root, { recursive: true })
    this._migrateLegacy()
    if (!existsSync(this.profilesDir())) mkdirSync(this.profilesDir(), { recursive: true })

    const reg = this.readRegistry()
    let dirty = false
    if (!reg.items.length) {
      const store = new Store(join(this.profilesDir(), DEFAULT_PROFILE_ID))
      store.ensure()
      reg.items.push(this._freshItem(DEFAULT_PROFILE_ID, store))
      reg.active = DEFAULT_PROFILE_ID
      dirty = true
    }
    if (!reg.items.some((item) => item.id === reg.active)) {
      reg.active = reg.items[0].id
      dirty = true
    }
    for (const item of reg.items) {
      if (this.store(item.id).ensure()) dirty = true
    }
    if (dirty) this.writeRegistry(reg)
    return reg
  }

  /** 老版本：profile.json 直接躺在 root 下。搬进子目录，原样不动内容。 */
  _migrateLegacy() {
    const legacyProfile = join(this.root, FILES.profile)
    if (!existsSync(legacyProfile)) return
    if (existsSync(this.profilesDir())) return
    const target = join(this.profilesDir(), DEFAULT_PROFILE_ID)
    mkdirSync(target, { recursive: true })
    for (const name of Object.values(FILES)) {
      const from = join(this.root, name)
      if (!existsSync(from)) continue
      renameSync(from, join(target, name))
    }
    const legacyMaterials = join(this.root, 'materials')
    if (existsSync(legacyMaterials)) renameSync(legacyMaterials, join(target, 'materials'))
    // 根下可能还留着 .bak / .tmp，留在原地，别跟着搬。
  }

  readRegistry() {
    try {
      const parsed = JSON.parse(readFileSync(this.registryPath(), 'utf8'))
      if (parsed && Array.isArray(parsed.items)) {
        return {
          version: 1,
          active: text(parsed.active),
          items: parsed.items.filter((item) => item && item.id),
        }
      }
    } catch {
      /* 第一次跑，或者文件坏了——当空库重建 */
    }
    return { version: 1, active: '', items: [] }
  }

  writeRegistry(registry) {
    const path = this.registryPath()
    const tmp = path + '.tmp'
    writeFileSync(tmp, JSON.stringify(registry, null, 2), 'utf8')
    renameSync(tmp, path)
    return registry
```

</details>

**依据 3 · 源码核查**：[test/store.test.js:34-41](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/test/store.test.js#L34-L41)

坏JSON默认被当预期。

```text
test('坏掉的 JSON 当成默认值，不抛', () => {
  const f = fresh()
  try {
    writeFileSync(f.store.path('profile'), '{ 这不是 json')
    assert.equal(f.store.read('profile').goal.subject, '')
  } finally {
    f.done()
  }
```

**依据 4 · 源码核查**：[lib/tools.js:2905-2926](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/tools.js#L2905-L2926)

schema封闭和注册。

<details>
<summary>查看原文（22行）</summary>

```text
export function sealSchema(node) {
  if (node === null || typeof node !== 'object') return node
  if (Array.isArray(node)) return node.map(sealSchema)
  const out = { ...node }
  if (out.type === 'object' && out.additionalProperties === undefined) out.additionalProperties = false
  if (out.properties && typeof out.properties === 'object') {
    const props = {}
    for (const [key, value] of Object.entries(out.properties)) props[key] = sealSchema(value)
    out.properties = props
  }
  if (out.items !== undefined) out.items = sealSchema(out.items)
  return out
}

export function registerTools(ctx, store, defineTool, opts = {}) {
  return buildTools(store, opts).map((spec) => {
    const sealed =
      spec.output && spec.output.schema
        ? { ...spec, output: { ...spec.output, schema: sealSchema(spec.output.schema) } }
        : spec
    return ctx.tools.register(defineTool(sealed))
  })
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续及失败恢复有哪些成本？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

首次要确认宿主预设依赖、准备材料和学习目标，由模型/学生建知识地图与页码绑定，PDF路径/Python解释器需核对；这不是装插件就有课程内容。持续学习会话消耗宿主模型tokens，页图可能增加视觉调用量，具体价格依模型；插件本地JSON、原上传和PNG持续占盘，最大上传300MB、正文读512KB限制避免部分全量读取但不构成总库配额。同步JSON/渲页会影响宿主响应，大量档案/材料时需自行管理。

恢复包括错题/掌握证据作废重算、材料路径迁移、损坏JSON备份恢复、预设投递错会话与Python渲页失败。SSE和面板控制器管理启动并发/释放是积极设计，但学习数据仍需独立备份。节省重复解释目标、坚持学习和成绩提升没有同任务基线量化，不能凭有复习按钮宣布有效间隔学习。

#### 证据与依据

**依据 1 · 源码核查**：[lib/handler.js:30-42](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/handler.js#L30-L42)

上传与正文限额。

<details>
<summary>查看原文（13行）</summary>

```text
 * 网页上传原件走的地址。走裸 body 而不是 multipart：省掉一整个 multipart 解析器，
 * 文件名放 `x-file-name` 头里（URI 编码，中文名才不会被 header 的 latin-1 啃掉）。
 */
export const UPLOAD_PATH = '/study/api/material/upload'

/** 一次上传最多多大。比这大的走「粘贴本机路径」——那种不搬原件，只登记。 */
export const MAX_UPLOAD_BYTES = 300 * 1024 * 1024

/**
 * 读卷页一次最多读进来多少正文。超过就在这儿截断，页面里说清楚还有下文。
 * 别整个读进来：材料路径是从档案里来的，有人真会指着一段几百兆的网课视频。
 */
export const MAX_DOC_BYTES = 512 * 1024
```

</details>

**依据 2 · 源码核查**：[lib/pages.js:87-106](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/pages.js#L87-L106)

渲页同步成本。

<details>
<summary>查看原文（20行）</summary>

```text
  const from = Math.max(1, Number(options.from) || 1)
  const to = Math.max(from, Number(options.to) || from)
  const dpi = Math.min(220, Math.max(60, Number(options.dpi) || DEFAULT_DPI))
  if (to - from + 1 > MAX_PAGES_PER_CALL) {
    return { ok: false, error: `一次最多 ${MAX_PAGES_PER_CALL} 页，收到 ${to - from + 1} 页。分了批来` }
  }

  let stdout = ''
  try {
    stdout = execFileSync(python, ['-X', 'utf8', '-c', SCRIPT, pdfPath, dir, String(from), String(to), String(dpi)], {
      encoding: 'utf8',
      timeout: 180000,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } catch (error) {
    const tail = String(error.stderr || error.message || '').split('\n').filter(Boolean).slice(-1)[0] || ''
    if (/No module named|ModuleNotFoundError/.test(tail)) {
      return { ok: false, error: `这份 python 里没有 pymupdf：${python}。装一下：${python} -m pip install pymupdf` }
    }
    return { ok: false, error: `渲染失败：${tail || error.message}` }
```

</details>

**依据 3 · 源码核查**：[lib/store.js:92-110](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/store.js#L92-L110)

恢复依赖。

<details>
<summary>查看原文（19行）</summary>

```text
    const tmp = target + '.tmp'
    writeFileSync(tmp, JSON.stringify(value, null, 2), 'utf8')
    renameSync(tmp, target)
    return value
  }

  /** 改一份：读出当前值，交给 fn，写回。fn 里就地改或者返回新对象都行。 */
  update(key, fn) {
    const current = this.read(key)
    const next = fn(current) ?? current
    if (next && typeof next === 'object' && !next.updatedAt && key !== 'map' && key !== 'mastery') {
      next.updatedAt = nowIso()
    }
    return this.write(key, next)
  }

  /** 面板要一眼看全，这里一次把几份都端出去。 */
  snapshot() {
    const map = this.read('map')
```

</details>

**依据 4 · 源码核查**：[lib/panel-server.js:67-90](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/panel-server.js#L67-L90)

控制器状态。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * 把「面板服务开着没有」收成一个可问、可开、可关的小控制器。
 *
 * 这段状态原来散在 index.js 的 effect 里（一个 state.stopped 布尔 + 一个直接
 * await 的 startPanelServer），够用是因为那时根本没打算让人事后动它。既然要给出
 * 「启动键」，就得能问状态、能停、能换端口重启，而且连着点几下不能起出两个
 * 服务器——所以挪到这里，带上幂等和并发的合流。
 *
 * 起不来不算失败：端口全被占这种事记进 info().error 就完事，让面板上看得见，
 * 不能让插件加载直接挂掉。
 */
export function createPanelControl({ handler, port = DEFAULT_PORT, tries = PORT_TRIES, host = HOST } = {}) {
  const state = { server: null, port: null, url: null, error: null, preferred: port, starting: null }

  function info() {
    return {
      running: Boolean(state.server),
      port: state.server ? state.port : null,
      url: state.server ? state.url : null,
      preferred: state.preferred,
      /* 没起来时也得给人一个能粘的地址：首选端口那个。 */
      hintUrl: `http://${host}:${state.preferred}/study`,
      error: state.error,
    }
```

</details>

**依据 5 · 作者声明**：[README.md:40-42](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/README.md#L40-L42)

内容由用户生成。

```text
**这个仓库里只有代码，一条学习内容都没有。** 目标、地图、掌握度、任务、材料清单全是数据，落在本机的数据根目录里
（默认 `~/.dsh/study-coach/`）：卸载、升级、重装都不会动它，换地方就设环境变量 `DSH_STUDY_ROOT`。
一个**学习目标**一份档案目录，所以同一台机器上可以同时学几门课，各有各的地图、掌握度和任务表。
```

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 推荐怎样采用，进一步探讨哪里？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察，主要是双入口未闭合身份/来源准入、旧宿主会话筛选降级与默认回落后覆写数据；不以缺少宿主冒烟本身作为缺点。可信单人本地、非唯一档案且独立备份可做学习流程对照，先核preset与档案归属，避免敏感学生资料和广目录注册。面板进度只作可检查的记录，关键掌握度用真实题目/延迟回忆核实；有坏文件、错档案/错会话或来源不清时先保留原数据再处理。

继续可从证据去重/题目答案来源、每会话固定profile与严格preset筛选、双端口统一认证/Origin、读错拒写+备份及版本CAS入手。基线为当前kind计数门、全局registry、坏JSON默认回落，反例包括重复同题、造kind、无投影会话、多进程写/坏文件、登记目录外链及匿名写请求。比较错档案、数据恢复、延迟测验成绩与学生维护工时。方向尚未验证，只有流程/界面创新的当前判断。

#### 证据与依据

**依据 1 · 源码核查**：[lib/map.js:64-111](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/map.js#L64-L111)

计数基线。

<details>
<summary>查看原文（48行）</summary>

```text
export function isVoided(item) {
  return Boolean(item && item.voidedAt)
}

/** 这笔账里真算数的证据（作废的不算）。错题、弱项、重算全走它。 */
export function liveEvidence(state) {
  const list = Array.isArray(state && state.evidence) ? state.evidence : []
  return list.filter((item) => !isVoided(item))
}

/** 「真做过」的证据有几条（做题 / 作业照片）。自评、上课、复习不算。 */
export function workCountOf(state) {
  return liveEvidence(state).filter((e) => WORK_KINDS.includes(e.kind)).length
}

/**
 * 照着流水重算档位。
 *
 * 为什么要有它：档位是**写下来的**（`state.stage`），所以它只反映记的那一刻。
 * 一条证据后来作废了、或者旧版本绕过门直接写了档位，账面上都看不出破绽。重算就是
 * 把同一道门照着流水再走一遍，得到「凭这些证据最多能到哪一档」；跟账上写的对不上
 * 就叫漂移（`driftOf` 会挑出来）。
 *
 * 两条规矩跟 `gateStage` 完全一致，别在这儿另立一套：
 *   ①每条证据自己记着「我之后档位在哪」（`item.stage`），一次只前进一步；
 *   ②`STAGE_NEEDS` 里那几档要凑够「真做过」的证据，不够就停在原地。
 * 没有 `item.stage` 的老证据（加这个字段之前记的）只算进 `workCount`：它证得了
 * 「他做过」，证不了「当时判成了哪一档」，所以不让它推动档位。
 *
 * 返回 `{ stage, source, work }`：`source` 是最后一次推动档位的那条证据 id。
 */
export function derivedStage(state) {
  const list = liveEvidence(state)
  let stage = '没接触过'
  let work = 0
  let source = null
  for (const item of list) {
    if (WORK_KINDS.includes(item.kind)) work += 1
    const want = STAGES.includes(item && item.stage) ? item.stage : null
    if (!want) continue
    const ceiling = Math.min(STAGES.indexOf(stage) + 1, STAGES.length - 1)
    const next = STAGES.indexOf(want) > ceiling ? STAGES[ceiling] : want
    if (next === stage) continue
    if ((STAGE_NEEDS[next] || 0) > work) continue
    stage = next
    source = item.id ? String(item.id) : null
  }
  return { stage, source, work }
```

</details>

**依据 2 · 源码核查**：[lib/store.js:78-110](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/store.js#L78-L110)

数据恢复基线。

<details>
<summary>查看原文（33行）</summary>

```text
  read(key) {
    try {
      const raw = readFileSync(this.path(key), 'utf8')
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return this.default(key)
      return parsed
    } catch {
      return this.default(key)
    }
  }

  /** 整份写下去，先落临时文件再改名，避免写一半断电留个半截 JSON。 */
  write(key, value) {
    const target = this.path(key)
    const tmp = target + '.tmp'
    writeFileSync(tmp, JSON.stringify(value, null, 2), 'utf8')
    renameSync(tmp, target)
    return value
  }

  /** 改一份：读出当前值，交给 fn，写回。fn 里就地改或者返回新对象都行。 */
  update(key, fn) {
    const current = this.read(key)
    const next = fn(current) ?? current
    if (next && typeof next === 'object' && !next.updatedAt && key !== 'map' && key !== 'mastery') {
      next.updatedAt = nowIso()
    }
    return this.write(key, next)
  }

  /** 面板要一眼看全，这里一次把几份都端出去。 */
  snapshot() {
    const map = this.read('map')
```

</details>

**依据 3 · 源码核查**：[lib/session-preset.js:97-100](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/session-preset.js#L97-L100)

筛选基线。

```text
export function learningSessions(items) {
  const rows = (Array.isArray(items) ? items : []).filter(visible)
  if (!hasPresetChannel(rows)) return { items: rows, filtered: false }
  return { items: rows.filter((item) => presetOf(item) === PRESET_ID || isFresh(item.sessionId)), filtered: true }
```

**依据 4 · 源码核查**：[lib/routes.js:1653-1676](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/routes.js#L1653-L1676)

请求分派基线。

<details>
<summary>查看原文（24行）</summary>

```text
  return function handle(request) {
    const method = (request && request.method) || 'GET'
    /* HEAD 按 GET 的路由找（HTTP 就这么定的「只要头不要体」），响应体由 Node 自己省掉。 */
    const wanted = method === 'HEAD' ? 'GET' : method
    const pathname = (request && request.pathname) || '/'
    for (const route of routes) {
      if (route.method !== wanted) continue
      const match = route.pattern.exec(pathname)
      if (!match) continue
      const failure = (error) => ({
        code: 500,
        body: { ok: false, error: { code: 'internal', message: String((error && error.message) ?? error) } },
      })
      try {
        const out = route.fn({
          body: request.body,
          query: request.query,
          params: match.slice(1),
          /* 广播通道那条要拿原始响应自己接管（SSE 长连接），别的路由不看这两个 */
          req: (request && request.req) || null,
          res: (request && request.res) || null,
        })
        // 同步路由照旧直接返回；异步的（投递、读对话那几条）把 rejection 也收成响应，别让它飘出去。
        return out && typeof out.then === 'function' ? out.catch(failure) : out
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
