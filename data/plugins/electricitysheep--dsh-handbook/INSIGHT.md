# dsh-handbook

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[7da3e3f](https://github.com/Electricitysheep/dsh-handbook/tree/7da3e3f6de93046f2a4260b2450620c15bd1c0c0)

<!-- BEGIN META -->
[![GitHub ★ 939](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=939&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Electricitysheep/dsh-handbook)
<!-- END META -->

> **功能**：DeepSeek Harness 中文优先的学习手册与生态观察，涵盖上手、插件开发、案例和调优。

> **亮点**：把首次回复、插件生效和应用练习拆成可见的过关点，便于定位新人卡在安装、配置还是扩展接线。这个贡献来自教学编排，适合用作带新人或自学的路线。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：首页更新了版本警告，入门正文和模板仍留在不同的旧版本条件。读者从章节或模板直接进入时，需要逐例核对，尤其在迁移权限或会话时。性能附录的正确率分母也需单独澄清。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 新手要完成什么，三天路线相比章节目录增加了什么？](#detail-section-11)
  - [Q02 · 仓库交付的是可加载扩展还是出版内容？](#detail-section-12)
  - [Q03 · 版本警告能否防止用户将旧命令用到新宿主？](#detail-section-13)
  - [Q04 · 作者的性能结果能回答什么，采用成本该怎么衡量？](#detail-section-14)
  - [Q05 · 如何用一项可逆练习采用手册，并验证逐例标版本的增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：刚接触 DSH 的中文开发者可以按三天学习路径，从拿到一条回复练到读懂示例插件的接线，再选案例和调优章节。

相比直接浏览架构说明或章节目录，手册提供可依次检查的练习；熟悉 DSH 的开发者可直接按宿主版本查官方文档。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 中文学习路径 | 从首次运行走到示例接线 | 操作按对应宿主版本核对 |
| 案例、FAQ 与迁移对照 | 定位相似任务和版本坑 | 历史材料与外部工具需独立验证 |
| 私有示例模板 | 阅读 agent/request 接线 | 旧依赖线，适合独立练习 |

**流程与依赖**

| 依赖 | 用途 | 使用条件与边界 |
|---|---|---|
| Markdown 或 Docsify 页面 | 阅读路线、案例和 FAQ | 网页加载依赖 CDN，可从固定提交直接阅读 Markdown |
| 匹配的 DSH、Node 与 Profile | 可选入门练习 | 核对目标宿主版本，样例包依赖约束留在旧版线 |
| 模型渠道 | 产生实际回复 | 仅动手任务需要，按独立环境与凭据配置 |

| 步骤 | 操作 | 判断与退路 |
|---|---|---|
| 读路线 | 选首次回复练习并记录目标宿主 | 命令与目标版本不符就切回官方资料 |
| 做练习 | 在独立目录尝试一个小任务 | 检查有无回复；需要升级权限就暂停 |
| 选读进阶 | 成功后再查 Profile 或插件接线 | 只在能核对版本条件时继续 |

**效果与成本**

| 阶段 | 现金与资源成本 | 人工时间与条件 |
|---|---|---|
| 首次 | 阅读无需请求；动手依所选模型计费 | 核对版本并准备独立配置，时长未测 |
| 持续 | 请求费用随任务而变 | 宿主升级后复核使用的片段 |
| 恢复与退出 | 重试可能带来新请求 | 停止旧命令，清理练习目录、凭据及配置 |

| 效果 | 当前材料 | 待验证 |
|---|---|---|
| 学习与排障 | 每阶段有可见过关点 | 新手用时、求助率和完成率 |
| 基准教学 | 作者列出固定任务和历史耗时 | 正确率分母和当前环境下可复现性 |

> **思考**：首页更新了版本警告，入门正文和模板仍留在不同的旧版本条件。读者从章节或模板直接进入时，需要逐例核对，尤其在迁移权限或会话时。性能附录的正确率分母也需单独澄清。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把首次回复、插件生效和应用练习拆成可见的过关点，便于定位新人卡在安装、配置还是扩展接线。这个贡献来自教学编排，适合用作带新人或自学的路线。[Q01](#research-q01) [Q02](#research-q02)

Docsify 配置把首页、侧栏和搜索整合到一个阅读入口，双语路径缺页时返回英文首页。独立示例将策略和宿主接线分开，但其包约束必须按目标宿主重查。编辑流程按类型落入 FAQ 或章节并记录源帖，固定源码只能证明流程说明存在。

<a id="detail-section-5"></a>

### 1.4 主要限制

首页更新了版本警告，入门正文和模板仍留在不同的旧版本条件。读者从章节或模板直接进入时，需要逐例核对，尤其在迁移权限或会话时。性能附录的正确率分母也需单独澄清。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用固定宿主完成一次隔离的入门练习。记录命令、版本和是否收到回复，遇到版本错配就回对应的官方指南。把基准附录用于学习对照设计，生产选型另做复现。[Q04](#research-q04) [Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持学习路径、静态站点入口与私有模板的存在。版本提示只界定作者陈述范围；当前宿主兼容、读者成功率和下述试验均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、docs/roadmap.md、_sidebar.md、index.html、examples/plugin-template/package.json、examples/plugin-template/src/index.ts、docs/research/feedback-pipeline.md、docs/02-quickstart.md、docs/16-migration.md、docs/benchmark.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖根目录文档入口、中文路线、版本差异、迁移资产、基准附录、反馈规则和独立示例接线。未逐篇复核双语一致性、线上发布、作者历史运行、外部插件或当前官方环境。
- 下一步：先固定目标宿主和最小练习；记录收到回复、版本误用及排障时间，再和只看首页版本警告的同条件路径比较。

**分析版本**

- **仓库**：[Electricitysheep/dsh-handbook](https://github.com/Electricitysheep/dsh-handbook)
- **版本号**：未声明（[固定提交 7da3e3f](https://github.com/Electricitysheep/dsh-handbook/tree/7da3e3f6de93046f2a4260b2450620c15bd1c0c0)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在每个练习旁写清宿主固定版本、过关结果与版本失配时的停用信号，用同背景读者对照定位时间、错版次数和求助次数。若核对负担抵消收益，或错误没有减少，就放弃这层标注。尚未验证。[Q05](#research-q05)

先固定目标宿主和最小练习；记录收到回复、版本误用及排障时间，再和只看首页版本警告的同条件路径比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 57 | 9937 | — | — | 132582 |
| .md | example | 1 | 75 | — | — | 508 |
| .ts | example | 4 | 185 | 147 | 12 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Electricitysheep/dsh-handbook/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Electricitysheep/dsh-handbook/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Electricitysheep/dsh-handbook/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：中文学习者能否用这份手册完成一项可核查的 DSH 入门或迁移任务，且知道何时切回与宿主版本匹配的官方材料？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 新手要完成什么，三天路线相比章节目录增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

手册适合刚接触 DSH、需要把概念转成可检查操作的中文开发者。第 1 天从理解到跑出一次 headless 回复，第 2 天要求示例插件加载且有生效信号，第 3 天转向案例和调优。其具体贡献是把目标、操作和过关条件并排组织：例如，如果已经拿到一次回复却仍没有插件生效信号，学习者可以把排查范围从安装缩小到插件接线。按阶段编排也适合重复带新人或回看首次配置。

作者称官方材料偏架构、缺少上手路径。本轮可直接确认的是手册自身提供了可走的顺序，相比只浏览章节目录，多了中途可检查的结果。若读者已熟悉 Profile 或官方对应版本已有完整示例，导航增量会变小。“3 天能开发插件”是作者目标，未找到该人群的对照完成率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-64](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/README.md#L47-L64)

项目明确面向从安装到开发的学习者，并提出与官方架构资料的差异。

<details>
<summary>查看原文（18行）</summary>

```text
## 🎯 这是什么

**DeepSeek Harness（`dsh`）**是 DeepSeek 官方 2026-08-13 开源的 Agent 运行时——一个"一切皆插件"（everything is a plugin）的框架。

<img width="614" height="230" alt="image" src="https://github.com/user-attachments/assets/19482c24-2208-468e-ad38-9096d9270f8d" />

但官方文档以架构说明为主，**缺少一条从零上手的路径**。

**这本白皮书补上这条路**：从"什么是 Agent 运行时"讲起，到安装、使用、开发插件、性能调优——每一章都有可复制、可运行的命令，全部在本机实测验证。**目标是：任何一个开发者，跟着这本书都能从 0 到 1 用起来、写起来。**

### 为什么值得读（而不是只看官方文档）

| 官方文档 | 本白皮书|
|---|---|
| 架构视角（AGENTS.md / architecture.md） | **新手视角**：一条从 0 到 1 的路径|
| 零散示例 | **每章可运行**，命令全部实测|
| 无中文教程 | **中文优先**，英文同步|
| 无生态实操 | **真实插件/PR 拆解**（含踩坑与安全约束）|
```

</details>

**依据 2 · 源码核查**：[docs/roadmap.md:5-26](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/docs/roadmap.md#L5-L26)

第一阶段以真实回复为过关点，第二阶段再要求插件的生效信号。

<details>
<summary>查看原文（22行）</summary>

```text
## Day 1：理解 + 跑起来（第 1-2 章）

**目标**：理解 dsh 是什么，能独立启动、对话、配置。

| 时间 | 任务 | 验收 |
|---|---|---|
| 30 分钟 | 读第 1 章（三个直觉 + 能力矩阵） | 能向别人解释"dsh 和 Claude Code 的区别" |
| 30 分钟 | 第 2 章动手：`dsh web` 对话 + headless | 能启动 UI 完成一次对话；能跑一条 headless 命令 |
| 30 分钟 | 配置模型/推理档位 + 排障速查 | 能改 settings.yaml；能解决端口占用 |

**验收**：`dsh --profile headless "你好"` 有回复。

## Day 2：理解骨架 + 第一个插件（第 3-4 章）

**目标**：理解 profile/插件机制，写出第一个能跑的插件。

| 时间 | 任务 | 验收 |
|---|---|---|
| 1 小时 | 第 3 章（profile、挂载、host/client、扩展点、坑） | 能挂载社区插件（Git 面板） |
| 1.5 小时 | 第 4 章抄写示例提速插件：纯函数 + agent/request 注入 | 插件加载无错，日志出现决策输出 |

**验收**：自己的插件在 dsh 里生效（日志证明注入发生）。
```

</details>

**依据 3 · 源码核查**：[_sidebar.md:1-7](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/_sidebar.md#L1-L7)

目录将入门、插件开发、案例和调优分成可跳转阶段。

```text
* [首页](/README.md)
* [学习路径 · 3 天计划](/docs/roadmap.md)
  * [Day 1：理解 + 跑起来（第 1-2 章）](/docs/roadmap.md?id=day-1：理解-跑起来（第-1-2-章）)
  * [Day 2：理解骨架 + 第一个插件（第 3-4 章）](/docs/roadmap.md?id=day-2：理解骨架-第一个插件（第-3-4-章）)
  * [Day 3：实战 + 调优（第 5-6 章）](/docs/roadmap.md?id=day-3：实战-调优（第-5-6-章）)
  * [之后：按需深入](/docs/roadmap.md?id=之后：按需深入)
  * [学习原则（白皮书全程）](/docs/roadmap.md?id=学习原则（白皮书全程）)
```

#### 缺口

- 缺少同背景新手的任务日志。
  **影响**：可确认导航结构，不能估计重复痛点的发生率、节时或完成率。
  **进一步探讨**：给相同经验的读者同一固定宿主和练习，比较所用入口、求助次数和是否过关。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 仓库交付的是可加载扩展还是出版内容？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

这是仓库根目录下的文档资源。入口是静态网页和 Markdown：页面配置让 Docsify 加载 README 与侧栏，并配置搜索和复制代码。语言开关用路径是否在英文页面列表中来选择配对页，否则跳英文首页。页面渲染依赖外链脚本，离线可从固定提交直接阅读 Markdown；网页搜索和语言切换的在线结果未独立复测。

插件接线位于 examples 下的独立私有模板包。它导出 apply(ctx)，给 agent/request 链装处理器，等待下游结果，再覆盖 reasoningEffort。这个具体接线证明示例具有可教学的宿主入口，但仓库根无 npm 包清单，不能当作这个资源本身会接管请求。模板分离策略与宿主接线适合做代码阅读练习。维护侧另有人工反馈分类、更新目标和记录路径，脚本片段本身无法证明每周定时完成。

#### 证据与依据

**依据 1 · 源码核查**：[index.html:690-717](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/index.html#L690-L717)

静态页面的入口和文档功能由 Docsify 配置提供。

<details>
<summary>查看原文（28行）</summary>

```text
    window.$docsify = {
      name: 'DeepSeek Harness 白皮书',
      nameLink: '/',
      repo: 'https://github.com/Electricitysheep/dsh-handbook',
      loadSidebar: true,
      alias: {
        '/.*/_sidebar.md': '/_sidebar.md'
      },
      maxLevel: 3,
      subMaxLevel: 2,
      homepage: 'README.md',
      auto2top: true,
      notFoundPage: true,
      externalLinkTarget: '_blank',
      search: {
        maxAge: 86400000,
        paths: 'auto',
        placeholder: '搜索文档',
        noData: '没有找到结果',
        depth: 3
      },
      copyCode: {
        buttonText: '复制',
        errorText: '复制失败',
        successText: '已复制'
      },
      plugins: [dshAlertPlugin, dshMermaidSrcSaver, dshTogglePlacer, dshLangPlugin]
    };
```

</details>

**依据 2 · 源码核查**：[index.html:752-771](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/index.html#L752-L771)

双语跳转有首页退路，渲染和搜索脚本走外部 CDN。

<details>
<summary>查看原文（20行）</summary>

```text
      // 语言切换：跳到当前页面的另一语言版本；无对应版本时回对方首页
      document.getElementById('dshLangToggle').addEventListener('click', function () {
        var path = dshCurrentPath();
        var target;
        if (/\.en$/.test(path)) {
          target = path.replace(/\.en$/, '');
        } else {
          target = DSH_EN_PAGES.indexOf(path) >= 0 ? path + '.en' : 'README.en';
        }
        location.hash = '#/' + target;
        this.blur();
      });

      window.addEventListener('resize', dshPlaceThemeToggle);
    })();
  </script>

  <script src="//cdn.jsdelivr.net/npm/docsify@4/lib/docsify.min.js"></script>
  <script src="//cdn.jsdelivr.net/npm/docsify@4/lib/plugins/search.min.js"></script>
  <script src="//cdn.jsdelivr.net/npm/docsify@4/lib/plugins/emoji.min.js"></script>
```

</details>

**依据 3 · 源码核查**：[examples/plugin-template/package.json:1-16](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/examples/plugin-template/package.json#L1-L16)

私有样例包有自己的导出及旧宿主依赖。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-plugin-template",
  "version": "0.1.0",
  "description": "dsh host plugin template — copy and customize (from dsh-handbook ch.4)",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "exports": {
    ".": { "types": "./src/index.ts", "default": "./src/index.ts" },
    "./package.json": "./package.json"
  },
  "engines": { "node": ">=20" },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": ">=0.1.2-rc.1 <0.2.0"
  },
```

</details>

**依据 4 · 源码核查**：[examples/plugin-template/src/index.ts:24-36](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/examples/plugin-template/src/index.ts#L24-L36)

事件接线存在于示例目录，等待下游后改写推理字段。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx: Context): void {
  // npm doesn't re-export dsh's event-type augmentation; widen at the boundary.
  const on = ctx.on as unknown as (
    event: string,
    handler: (payload: Record<string, unknown>, next: () => unknown) => unknown | Promise<unknown>,
  ) => void

  on('agent/request', async (payload, next) => {
    const seed = await next() as { reasoningEffort?: unknown } // ⚠️ await next()
    const effort = decidePolicy({ recentCalls: recentToolCalls(payload.agent), selected: 'high' })
    return { ...seed, reasoningEffort: effort }
  })
}
```

</details>

**依据 5 · 源码核查**：[docs/research/feedback-pipeline.md:22-44](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/docs/research/feedback-pipeline.md#L22-L44)

归档步骤将分类、引帖和记账分开，文档描述人工维护过程。

<details>
<summary>查看原文（23行）</summary>

```text
### ② 评估（10 分钟）

新知识分类：

| 类别 | 判据 | 沉淀目标 |
|---|---|---|
| **FAQ 候选** | 高频问题 / 有明确 workaround | docs/faq.md |
| **章节补充** | 深度踩坑 / 新边界 / 根因分析 | 对应章（2-14） |
| **生态收录** | 社区项目 / 插件 / 工具 | docs/07-ecosystem.md |
| **成本/安全** | token 消耗 / 安全边界 | 第 13/14 章 |
| **无需收录** | 闲聊 / 过时 / 重复已有内容 | —（忽略） |

### ③ 沉淀（20-40 分钟）

- 按类别更新对应文件（保持手册"实测 + 诚实"风格）
- 引用真实帖号（`#xxx` 链接）
- 标注推断内容（"（推断，待实测）"）
- 已收录内容的帖子响应中**回贴告知**（"已收录进手册 X 处"——激励社区贡献）

### ④ 记录（5 分钟）

更新 `docs/research/feedback-log.md`：

```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 版本警告能否防止用户将旧命令用到新宿主？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

首页的警告是有用的先验提醒，但继续沿侧栏阅读时仍需逐例对版本。README 写明作者实测基线 0.1.0-rc.6，并将 0.2.2-alpha.3 作为文中较新版本提示。它声称 0.2.2 线 Node 最低 24.9，而第 2 章仍列 22.19，并将其作为一种故障退路。模板又把 dsh-agent 约束在 0.1.2-rc.1 到 0.2.0 之前。这三个陈述指向不同条件，首页并未把每条教程和样例统一到同一宿主。发现的是文档版本分层与易误用处，实际新宿主的具体错误或可用版本需要另验。

阅读概念只需文档本身；运行练习才需要匹配的 Node、宿主及其配置。迁移章将权限、子代理和会话各自列出，甚至指出 hooks matcher 大小写可能让安全动作失效。这些是旧版作者核对及社区线索，对安全相关操作尤其不能跨版照抄。应先记宿主与包版本，遇到示例与相应官方 API 或依赖约束不符时，停止练习并切回相应版本的官方说明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-36](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/README.md#L25-L36)

首页同时给出旧基线、作者所述破坏性变化和新 Node 门槛。

<details>
<summary>查看原文（12行）</summary>

````text
> [!WARNING]
> **正文实测基线是 `0.1.0-rc.6`（版本线同步到 `v0.1.3-alpha.1`），当前 DSH 已是 `v0.2.2-alpha.3`。** 自该基线以来有破坏性变更：Node `>=24.9`（0.2.2 起）、`engines.dsh` 强制校验（0.2.1-alpha.4 起）、`ctx.menus` 移除（0.2.2-alpha.3，改名 `ctx.contextMenus`）；另有 `@deepseek-ai/dsh-client-runtime` 在 0.1.2 移除、Typert codec 在 0.1.6-alpha.2 改为 `create()`。按本手册操作前，请以[官方文档](https://deepseek-harness.github.io/deepseek-harness/)与[升级指南](https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/upgrade-guide)为准；正文示例可能仍按 0.1 API 编写。

## 🚀 快速体验（30 秒）

```bash
# 1. 安装（需要 Node.js ≥ 24.9）
npx -y @deepseek-ai/dsh web

# 2. 浏览器打开 http://127.0.0.1:3080，开始对话
# 3. 或跑一次性任务（适合脚本/CI）
dsh --profile headless "你好，请用一句话介绍自己"
````

</details>

**依据 2 · 源码核查**：[docs/02-quickstart.md:39-48](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/docs/02-quickstart.md#L39-L48)

入门正文另给较旧的 Node 建议，显示按章节复制存在版本错配可能。

<details>
<summary>查看原文（10行）</summary>

```text
### Node 版本红线（≥22.19）

社区实测发现 **Node < 22.19 会触发两个致命缺失**：

| 缺失 API | 报错示例 | 触发帖号 |
|---|---|---|
| `node:zlib` 无 `createZstdDecompress` | `TypeError: zlib.createZstdDecompress is not a function` | [#100](https://github.com/deepseek-ai/deepseek-harness/discussions/100) |
| `AbortSignal.timeout` 未实现 | `AbortSignal.timeout is not a function` | [#311](https://github.com/deepseek-ai/deepseek-harness/discussions/311) |

**Workaround**：用 nvm/volta/fnm 切换到 `22.19.0+`。Node 24 早期版本（如 v24.15）也可能触发 `install-lefthook failed`——若遇此错，pin 到 `22.19.0` 最稳 ([#748](https://github.com/deepseek-ai/deepseek-harness/discussions/748))。
```

</details>

**依据 3 · 源码核查**：[examples/plugin-template/package.json:12-19](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/examples/plugin-template/package.json#L12-L19)

模板清单将 dsh-agent peer 依赖限定在 0.2.0 之前。

```text
  "engines": { "node": ">=20" },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": ">=0.1.2-rc.1 <0.2.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": "0.1.2-rc.1",
```

**依据 4 · 作者声明**：[docs/16-migration.md:12-24](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/docs/16-migration.md#L12-L24)

迁移资产需要分别核对，权限与会话不存在统一的复制操作。

<details>
<summary>查看原文（13行）</summary>

```text
## 16.1 资产对照表（实测）

| Claude Code 资产 | DSH 兼容性 | 实际情况 |
| --- | --- | --- |
| 项目 `CLAUDE.md` | 原生，零改动 | `instructionFileCandidates` 默认含 `CLAUDE.md`，从项目根到 cwd 自动发现 |
| 全局 `~/.claude/CLAUDE.md` | 一个符号链接 | 全局位只认 `$DSH_HOME/AGENTS.md`，链过去即可 |
| 技能（`SKILL.md`） | 格式原样兼容 | 前置元数据按开放对象解析，未知键（`allowed-tools` 等）忽略。注意 `.claude/skills` **不是** DSH 默认技能根，要落到 `~/.dsh/skills` 或 `<项目>/.dsh/skills` |
| MCP（`.mcp.json`） | 无损机械转换 | 每个服务器一行 `dsh-mcp-client` 配置（stdio 与 streamable-http），工具名两边一致，引用它们的技能不用改 |
| hooks | 官方桥，部分事件 | `dsh-hooks-claude-code` 原样跑现有配置，30 个事件映射 7 个，仅 command 型。**坑**：matcher 对 DSH 工具名大小写敏感，`Bash` 匹配不到小写的 `bash` 工具，安全 hook 会静默失效（官方讨论区 #582），修复前 matcher 写小写 |
| 权限规则 | 非原生，可桥接 | DSH 只有三档粗预设。`deny`/`ask` 可在 `tools/pre-execute` 强制执行（社区插件），`allow` 无对应物 |
| 子代理（`.claude/agents`） | 无法直接导入 | DSH 预设是 `agent.cordis.yml` 目录而非 markdown，现实路径是转成技能（前置元数据几乎一致） |
| 斜杠命令（`.claude/commands`） | 无文件等价物 | DSH 命令是代码注册的，用户可调用技能是文件级替代 |
| 会话 | 最难，别手写 | 会话文件是 v0 格式 + zstd 帧 + 严格事件校验，官方明确不承诺兼容。历史会话用 [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import)（13 个来源，可反向导出） |
```

</details>

#### 缺口

- 未执行旧模板对新宿主的加载。
  **影响**：不能确定失败时点、具体报错或当前宿主安全行为。
  **进一步探讨**：先核对目标版本清单和官方升级记录，再在可清理 Profile 上用最小样例比较加载与退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 作者的性能结果能回答什么，采用成本该怎么衡量？

**研究主题**：效果与总成本、缺陷与关键质疑

#### 完整回答

基准附录适合看作者怎样控制部分变量：同模型和网关、独立目录、五个任务、每任务三轮，分别报告人工验收和耗时。它提供了每轮秒数和两个扩展任务的验收标准，读者能据此看到同一工具在单步统计与长文本输出上的差距可能不同。单工具按协议应有 5×3=15 次，表格却给每工具 45/45；若存在额外子判据，本文未说明怎样累加。仓库没有附录所指的完整本地输入产物目录。因此这些结果只能作为作者报告的历史示例，无法从这份文档独立确认正确率分母或当前排名。

对采用者更有用的成本单位是“一次通过验收的入门任务”。读文档自身无需模型调用；动手练习的首次人工成本是核对版本、准备隔离目录和配置。持续使用需要随升级重新核对命令；失败可能要重试、清理 Profile 和处理测试凭据，模型调用的现金成本取决于选用渠道与实际请求。三天路径是计划，基准秒数不能用于推算读者能省多久。

#### 证据与依据

**依据 1 · 作者声明**：[docs/benchmark.md:9-22](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/docs/benchmark.md#L9-L22)

作者描述受控变量、人工正确性判断以及扩展任务的验收口径。

<details>
<summary>查看原文（14行）</summary>

```text
| 项 | 说明 |
|---|---|
| 模型 | `deepseek-v4-flash`（三 agent 均走 opencode-go 网关 + 同一 key，公平对照） |
| Agent | dsh（headless profile）、opencode（`opencode run`）、omp（`--print` 非交互） |
| 任务 | T1 创建文件 / T2 搜索统计 / T3 修复 bug + 验证 / T4 读数据生成报告 + 自复核 / T5 多文件重构 + 测试通过 |
| 环境 | Windows 11 + Node 24，独立工作目录，无预置上下文 |
| 度量 | 耗时（秒）+ 正确性（人工核对产物/输出） |

任务说明（T4/T5 为合成数据，无隐私风险）：

| 任务 | 输入 | 要求 | 人工核对标准 |
|---|---|---|---|
| T4 生成报告 | `data.json`（4 条合成销售记录） | 生成 `report.md`：数据表格 + 汇总（总销量/总营收/最畅销），自复核 | 汇总数字与数据一致（397 / 130853 / 耳机） |
| T5 多文件重构 | `mathops.py` + 依赖它的 `main.py`（含断言） | 把 `multiply` 的乘法逻辑提取为 `_multiply` 辅助函数，不改 `main.py`，`python main.py` 通过 | 出现 `_multiply` 且 multiply 委托调用、断言全过 |
```

</details>

**依据 2 · 源码核查**：[docs/benchmark.md:24-42](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/docs/benchmark.md#L24-L42)

原始秒数按每个工具五任务三轮呈现，与结果表每工具 45/45 的分母未直接对齐。

<details>
<summary>查看原文（19行）</summary>

```text
## 结果（3 轮采样，取中位数）

| Agent | T1 创建文件 | T2 搜索统计 | T3 修 bug+验证 | T4 生成报告 | T5 多文件重构 | 总计（中位） | 正确率 |
|---|---|---|---|---|---|---|---|
| **omp** | 10s ✅ | 11s ✅ | 15s ✅ | 21s ✅ | 13s ✅ | **70s** | 45/45 |
| **dsh** | 22s ✅ | 15s ✅ | 48s ✅ | 26s ✅ | 19s ✅ | **130s** | 45/45 |
| **opencode** | 35s ✅ | 37s ✅ | 42s ✅ | 30s ✅ | 28s ✅ | **172s** | 45/45 |

> 总计 = 5 任务中位数相加；扩展前（仅 T1-T3）为 omp 36s / dsh 85s / opencode 114s。

![benchmark 柱状图](./assets/benchmark-bar.svg)

原始 3 轮（秒）：

| Agent | 轮次 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|
| dsh | 1 / 2 / 3 | 11 / 27 / 22 | 11 / 15 / 22 | 27 / 48 / 74 | 30 / 26 / 25 | 19 / 25 / 18 |
| opencode | 1 / 2 / 3 | 18 / 35 / 35 | 19 / 37 / 37 | 50 / 41 / 42 | 30 / 49 / 30 | 28 / 28 / 32 |
| omp | 1 / 2 / 3 | 9 / 10 / 12 | 9 / 11 / 12 | 13 / 33 / 15 | 23 / 21 / 17 | 16 / 12 / 13 |
```

</details>

**依据 3 · 源码核查**：[docs/benchmark.md:58-75](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/docs/benchmark.md#L58-L75)

公开命令及两个任务文本，完整素材和输出指向作者本地目录。

<details>
<summary>查看原文（18行）</summary>

````text
## 可复现

```bash
# 三个 agent 的命令（独立目录）
dsh --profile headless "任务"
opencode run "任务" --model opencode-go/deepseek-v4-flash
omp "任务" --model deepseek-v4-flash --print
```

T4/T5 任务原文（T1-T3 见上一版本记录）：

<!-- [style] 任务原文代码块统一补 text 语言标签 -->
```text
T4: 读取当前目录 data.json 中的数据，生成 markdown 报告 report.md：包含每行数据的表格（产品/销量/单价三列）和汇总（总销量、总营收、最畅销产品），生成后自己复核汇总数字与 data.json 一致，完成后回复 已生成
T5: 重构 mathops.py：把 multiply 函数内的乘法逻辑提取为私有辅助函数 _multiply(a, b)，multiply 改为调用 _multiply；main.py 依赖 mathops.py 并包含断言测试，不得改动 main.py；重构后运行 python main.py 验证所有断言通过，完成后回复 已重构
```

> 完整任务定义、合成数据与产物：`~/agent-bench/bench-ext/`（T4/T5 每 agent 独立目录）；T1-T3 见 `~/agent-bench/`。白皮书仓库内 `benchmark/` 目录规划中。
````

</details>

**依据 4 · 源码核查**：[docs/roadmap.md:5-15](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/docs/roadmap.md#L5-L15)

路径里的预估是任务计划，过关点是拿到回复。

<details>
<summary>查看原文（11行）</summary>

```text
## Day 1：理解 + 跑起来（第 1-2 章）

**目标**：理解 dsh 是什么，能独立启动、对话、配置。

| 时间 | 任务 | 验收 |
|---|---|---|
| 30 分钟 | 读第 1 章（三个直觉 + 能力矩阵） | 能向别人解释"dsh 和 Claude Code 的区别" |
| 30 分钟 | 第 2 章动手：`dsh web` 对话 + headless | 能启动 UI 完成一次对话；能跑一条 headless 命令 |
| 30 分钟 | 配置模型/推理档位 + 排障速查 | 能改 settings.yaml；能解决端口占用 |

**验收**：`dsh --profile headless "你好"` 有回复。
```

</details>

#### 缺口

- 缺逐轮原始产物、完整输入和可对应 45/45 的打分记录。
  **影响**：不能独立复核正确率或将耗时外推到当前宿主、网络与模型。
  **进一步探讨**：补齐版本、输入、输出、用量和逐轮标准，再按通过任务数重新计算耗时与费用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何用一项可逆练习采用手册，并验证逐例标版本的增量？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议初学者先完成一项可逆试读：只选第 1 天的 headless 最小任务，固定宿主版本，在可丢弃目录确认能得到回复，并记录对应命令、版本及结果。成功后才选读 Profile 或插件章。版本约束不匹配、所需权限超出练习范围、或必须依据旧性能表为生产做决定时，暂停按手册操作，回到对应宿主文档；阅读笔记可保留，清理练习目录和测试凭据即可结束。

可检验的扩展是假设每个练习附上自己的宿主固定版本、预期输出及明确的失配停止信号后，会比只在首页标旧版本更容易排查。依据是路线已有过关标准，而正文的版本线存在局部冲突。最小验证选一个命令和一个插件加载练习，让基础相近的学习者用相同宿主分别读两版材料，记录成功、版本误用、首次定位时间和求助次数。保持题目及验收相同；若错版操作与求助未减少，或额外阅读抵消定位收益，就不支持该改动。此方案未在项目中实施或运行。

#### 证据与依据

**依据 1 · 源码核查**：[docs/roadmap.md:5-26](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/docs/roadmap.md#L5-L26)

已有的可观察过关点能在对照中保持固定。

<details>
<summary>查看原文（22行）</summary>

```text
## Day 1：理解 + 跑起来（第 1-2 章）

**目标**：理解 dsh 是什么，能独立启动、对话、配置。

| 时间 | 任务 | 验收 |
|---|---|---|
| 30 分钟 | 读第 1 章（三个直觉 + 能力矩阵） | 能向别人解释"dsh 和 Claude Code 的区别" |
| 30 分钟 | 第 2 章动手：`dsh web` 对话 + headless | 能启动 UI 完成一次对话；能跑一条 headless 命令 |
| 30 分钟 | 配置模型/推理档位 + 排障速查 | 能改 settings.yaml；能解决端口占用 |

**验收**：`dsh --profile headless "你好"` 有回复。

## Day 2：理解骨架 + 第一个插件（第 3-4 章）

**目标**：理解 profile/插件机制，写出第一个能跑的插件。

| 时间 | 任务 | 验收 |
|---|---|---|
| 1 小时 | 第 3 章（profile、挂载、host/client、扩展点、坑） | 能挂载社区插件（Git 面板） |
| 1.5 小时 | 第 4 章抄写示例提速插件：纯函数 + agent/request 注入 | 插件加载无错，日志出现决策输出 |

**验收**：自己的插件在 dsh 里生效（日志证明注入发生）。
```

</details>

**依据 2 · 源码核查**：[README.md:25-36](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/README.md#L25-L36)

现有全站版本提醒可作对照组。

<details>
<summary>查看原文（12行）</summary>

````text
> [!WARNING]
> **正文实测基线是 `0.1.0-rc.6`（版本线同步到 `v0.1.3-alpha.1`），当前 DSH 已是 `v0.2.2-alpha.3`。** 自该基线以来有破坏性变更：Node `>=24.9`（0.2.2 起）、`engines.dsh` 强制校验（0.2.1-alpha.4 起）、`ctx.menus` 移除（0.2.2-alpha.3，改名 `ctx.contextMenus`）；另有 `@deepseek-ai/dsh-client-runtime` 在 0.1.2 移除、Typert codec 在 0.1.6-alpha.2 改为 `create()`。按本手册操作前，请以[官方文档](https://deepseek-harness.github.io/deepseek-harness/)与[升级指南](https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/upgrade-guide)为准；正文示例可能仍按 0.1 API 编写。

## 🚀 快速体验（30 秒）

```bash
# 1. 安装（需要 Node.js ≥ 24.9）
npx -y @deepseek-ai/dsh web

# 2. 浏览器打开 http://127.0.0.1:3080，开始对话
# 3. 或跑一次性任务（适合脚本/CI）
dsh --profile headless "你好，请用一句话介绍自己"
````

</details>

**依据 3 · 源码核查**：[docs/research/feedback-pipeline.md:34-44](https://github.com/Electricitysheep/dsh-handbook/blob/7da3e3f6de93046f2a4260b2450620c15bd1c0c0/docs/research/feedback-pipeline.md#L34-L44)

已有流程能记录具体问题和归属章节，适合收集错版反馈。

<details>
<summary>查看原文（11行）</summary>

```text
### ③ 沉淀（20-40 分钟）

- 按类别更新对应文件（保持手册"实测 + 诚实"风格）
- 引用真实帖号（`#xxx` 链接）
- 标注推断内容（"（推断，待实测）"）
- 已收录内容的帖子响应中**回贴告知**（"已收录进手册 X 处"——激励社区贡献）

### ④ 记录（5 分钟）

更新 `docs/research/feedback-log.md`：

```

</details>

#### 缺口

- 没有学习者完成记录或逐例版本标注的对照试验。
  **影响**：只能建议可逆的小范围阅读，不能承诺提速或规模化推广。
  **进一步探讨**：先记录小样本，再检查路径是否因额外核对变长，比较失败定位和实际过关。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
