# dsh-oil-creator

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[58bd30d](https://github.com/oil-oil/dsh-oil-creator/tree/58bd30d0d05b04e149552e8bdb4ff0becae614f0)

<!-- BEGIN META -->
[![GitHub ★ 207](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=207&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/oil-oil/dsh-oil-creator)
<!-- END META -->

> **功能**：为 DSH Desktop 提供本地内容工作台，组织选题脚本、录屏工程、字幕封面、视觉审查与发布状态。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把开放本地文件、Desktop自有会话、Harness jobs和三图附件审查放进同一内容上下文，减少跨工具找材料的组织摩擦。上游媒体Skill与宿主会话能力不归插件原创，最终剪辑／视觉／发表仍人工负责。

> **主要限制**：[Q02](#research-q02) 文件存在驱动阶段不等质量，save review不核prepare/真实看图/图片版本，job killed不证进程树停止；[Q03](#research-q03) apply确认依赖调用方且整理回退非全事务，目录丢失还有作者明确宿主恢复失败。不能把片库完整性外观当无人值守内容验收。

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
  - [Q01 · 一内容一文件夹的Desktop工作台向谁增加什么？](#detail-section-11)
  - [Q02 · 目录／会话、产物阶段、job与视觉审查如何接线，失败能否保真？](#detail-section-12)
  - [Q03 · 配置确认、可选外部能力和恢复成本支持哪种试用？](#detail-section-13)
  - [Q04 · 作者验收和视觉报告能证明什么，下一项假设怎样被推翻？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：重复制作录屏短视频的创作者希望在一内容目录中跟进脚本、视频、字幕、封面与发布状态。原办法普通目录+剪辑软件+独立Skill；合格结果需材料可核、下一步明确且最终表达／发布由人确认。

普通文件夹、原剪辑软件、多个独立媒体Skill与人工待办；字幕／图像生成和平台发布来自外部依赖，根增量是Desktop原生工作台和文件/会话/job组织。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地片库/自有会话 | 一内容目录绑定材料与对话 | Desktop契约，目录恢复有作者失败记录 |
| 原生媒体jobs | 跟踪字幕/封面/烧录和导出等待 | 外部Skill/凭据，完成与取消须核原件/进程 |
| 三图视觉review | 真图片附件与结构报告 | save未核prepare/模型看图/当前hash |
| 配置/整理 | 预览再改设置/目录名称 | apply靠调用约定，批量回滚非全事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node22.19+／Desktop0.11.0+目标契约 | 核心必需 | 原生工作台和会话 | 独立Harness Web不等价 |
| standard/code与jobs/attachments等宿主服务 | 对应工具需 | Skill、长任务与图片审查 | 缺服务不提供该环节 |
| 本地内容目录与备份 | 核心需 | 普通文件材料和回退 | 不把旧会话当素材恢复 |
| 字幕／封面Skill与key | 媒体选配 | 外部转录/生成 | 缺配置只关对应环节 |
| ScreenStudio／Ego/平台登录 | 剪辑／发布选配 | 用户录制和平台草稿/同步 | 多偏macOS，发表仍人工 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主与复制内容，先核心片库 | 留独立备份，不先开外部服务 |
| 配置 | 只读setup、人工看精确目录／平台再apply | apply指引非不可绕过批准token |
| 会话 | 系统选正确内容目录，建自有原生会话 | 取消无新会话、不自动发消息 |
| 生产 | 人录制剪辑，选择性启job，核原件／字幕／图片 | job完成/阶段/review不等最终质量 |
| 退出 | 核后台终止和素材、卸载并按需撤key/login | 普通文件/overlay/会话保留，回原软件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Desktop/磁盘、可选软件 | 目录/版本/overlay与备份配置 | 工时金额未知 |
| 持续 | 可选转录/封面/图审模型、存储和平台 | 录制剪辑、专名和视觉复核 | 未测总节时或获客效果 |
| 失败恢复 | 重试模型、partial素材和备份空间 | 查真实进程、目录与整理残留 | killed非全部副作用停止 |
| 退出 | 留内容/overlay/会话空间 | 停预览job、撤key/login、迁回原流程 | 卸载不自动清用户资料 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 材料组织 | 文件扫描与自有会话绑定 | 真实创作效率与成果质量 |
| 长任务 | 原生job与取消清理路径 | 完整进程树/外部服务停止 |
| 视觉审查 | 三图真实attachments与结构报告 | 真看图、图版本和审美正确 |
| 平台闭环 | 可选外部Skill草稿/数据同步声明 | 全平台当前兼容与收益 |

> **思考**：[Q02](#research-q02) 文件存在驱动阶段不等质量，save review不核prepare/真实看图/图片版本，job killed不证进程树停止；[Q03](#research-q03) apply确认依赖调用方且整理回退非全事务，目录丢失还有作者明确宿主恢复失败。不能把片库完整性外观当无人值守内容验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把开放本地文件、Desktop自有会话、Harness jobs和三图附件审查放进同一内容上下文，减少跨工具找材料的组织摩擦。上游媒体Skill与宿主会话能力不归插件原创，最终剪辑／视觉／发表仍人工负责。

[Q02](#research-q02) owned session与folder、导航守卫和真实附件接线可追溯；进程命令片段匹配保守避免误杀但不等全终止确认。[Q03](#research-q03)布尔apply、重新预览与部分回退不提供持久批准计划/事务，报告明确限制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 文件存在驱动阶段不等质量，save review不核prepare/真实看图/图片版本，job killed不证进程树停止；[Q03](#research-q03) apply确认依赖调用方且整理回退非全事务，目录丢失还有作者明确宿主恢复失败。不能把片库完整性外观当无人值守内容验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)复制小库仅核心片库/脚本/自有会话trial，先预览不批量整理。核目录取消、重启、错库和卸载；素材保留或恢复不满足就回备份和原软件，再决定是否另验媒体／平台能力。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持Desktop插件入口、目录／自有会话、任务和图片附件接线；本轮无宿主／外部服务执行。阶段和review仅有限代理，取消／整理恢复有边界，版本绑定假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、docs/market-selftest.md、package.json、src/backgroundJobs.ts、src/catalog.ts、src/client/index.tsx、src/client/workbench.ts、src/index.ts、src/organize.ts、src/processAlive.ts、src/secretsHost.ts、src/service.ts、src/tools.ts、src/visualReview.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Desktop plugin source定向Host/Client注册、目录/会话、scan/阶段、jobs/进程清理、review、凭据与配置整理。未全审外部Skill、媒体实际质量、平台采集匹配和全部静态服务；无目标／宿主运行。
- 下一步：[Q04](#research-q04)先复制素材核目录与取消/恢复，再以四类图片变更反例测review版本绑定；发布外发另需许可与服务条款核查。本轮未安装、生成、上传或发表。

**分析版本**

- **仓库**：[oil-oil/dsh-oil-creator](https://github.com/oil-oil/dsh-oil-creator)
- **版本号**：0.2.1（[固定提交 58bd30d](https://github.com/oil-oil/dsh-oil-creator/tree/58bd30d0d05b04e149552e8bdb4ff0becae614f0)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)由附件与保存脱节推导三图digest+prepare receipt并在重生成后标stale，可能减少旧PASS沿用。四类复制素材对照陈旧通过、误阻断和复核投入；无改善或成本过高即否定，尚未实现不计贡献。

[Q04](#research-q04)先复制素材核目录与取消/恢复，再以四类图片变更反例测review版本绑定；发布外发另需许可与服务条款核查。本轮未安装、生成、上传或发表。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 524 | — | — | 11116 |
| .js | source | 3 | 13628 | 13058 | 1067 | — |
| .mjs | source | 4 | 1271 | 1170 | 38 | — |
| .ts | source | 56 | 7914 | 7199 | 109 | — |
| .tsx | source | 10 | 2270 | 2158 | 4 | — |
| .ts | test | 41 | 4063 | 3701 | 36 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/oil-oil/dsh-oil-creator/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/oil-oil/dsh-oil-creator/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/oil-oil/dsh-oil-creator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Desktop内容工作台的文件／会话／job闭环和视觉证据边界，限定核心片库采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 一内容一文件夹的Desktop工作台向谁增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是DSH Desktop原生内容工作台plugin，面向反复制作录屏／短视频的创作者，将选题、脚本、视频、字幕、三画幅封面、文章和发布状态放在同一内容目录。原办法是剪辑软件加普通文件夹、多个Skill和手工待办；合格结果是下一步材料和状态可追溯，最终录制剪辑／表达和发表仍由人确认。插件不把正文藏进专有数据库，overlay只存绑定、任务和发布等工作台状态，方便继续用原编辑器与文件工具。

Host apply按tools、jobs、attachments、systemPrompt、skills依赖分别注入；Client实际register Desktop workbench，缺desktopWorkbenches报错，因此独立Harness Web不是等价宿主。真实增量是把文件与原生会话／job／视觉附件衔接，而非字幕转录、封面图像生成或浏览器平台发布算法原创；这些来自可选外部Skill。作者本机安装／测试记录只支持其特定环境，不证明所有平台、核心内容效果或全链收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-44](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/README.md#L5-L44)

作者定位、本地目录、overlay与人确认的分工。

<details>
<summary>查看原文（40行）</summary>

````text
<p align="center">
  <strong>DeepSeek Harness 上的本地内容工作台。</strong><br>
  从选题、脚本、录屏工程到字幕、封面和发布状态，一条片子始终对应一个本地文件夹。
</p>

> [!NOTE]
> 当前开发目标为 Node.js 22.19+、DSH Desktop `0.11.0` 内置的 Harness `0.2.0-rc.2`；需要 Desktop 的 `desktopWorkbenches` 服务，不适用于独立 Harness Web。核心片库可独立使用；Screen Studio、字幕、封面、公众号和发布能力均可按需安装。

## 一条片子，就是一个文件夹

插件不建立封闭的内容数据库。正文和产物仍是普通文件，任何编辑器和 AI 文件工具都能读取：

```text
~/Movies/视频项目/
└── 2026-08-19_DeepSeek Harness 上手/
    ├── topic.md
    ├── script.md
    ├── DeepSeek Harness 上手.mp4
    ├── DeepSeek Harness 上手.srt
    ├── DeepSeek Harness 上手_subtitled.mp4
    ├── DeepSeek Harness 上手_3x4.png
    ├── DeepSeek Harness 上手_4x3.png
    ├── DeepSeek Harness 上手_16x9.png
    ├── visual-review.json
    ├── visual-review.md
    ├── publish-package.json
    └── 公众号文章/
```

插件只把工程绑定、手写发布标记、同步到的播放数据和生成任务等工作台状态存进 `~/.dsh-oil-creator/overlay.json`，不会把正文复制一份藏起来。

## 一条片子如何向前推进

| 阶段 | AI 与插件可以做什么 | 仍由人确认什么 |
| --- | --- | --- |
| 选题与脚本 | 新建规范目录，读写 `topic.md` / `script.md`，遵守长期脚本规则 | 选题方向和最终表达 |
| 录制与剪辑 | 绑定并打开 Screen Studio 工程，等待导出文件稳定落盘 | 录制、时间线剪辑和导出 |
| 字幕与封面 | 用 Harness Jobs 跟踪、等待和取消长任务；生成三画幅封面后交给多模态模型审查并保存报告 | 专有名词和最终视觉取舍 |
| 发布 | 把本地材料交给 `video-publisher` 准备多平台草稿 | 各平台最终“发表”按钮 |
| 数据回收 | 通过 Ego Browser 同步已发布作品的播放、赞、评和链接 | 登录状态和异常匹配结果 |
````

</details>

**依据 2 · 源码核查**：[src/index.ts:16-36](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/index.ts#L16-L36)

Host各服务注入实际入口。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const service = new OilCreatorService(ctx, config);
  ctx.inject(["settings"], (settingsCtx) => {
    settingsCtx.effect(() => registerCreatorSettingsNamespace(settingsCtx.settings));
  });
  ctx.inject(["tools"], (toolsCtx) => {
    registerCreatorTools(toolsCtx as never, service);
  });
  ctx.inject(["tools", "jobs"], (jobsCtx) => {
    registerCreatorJobTools(jobsCtx as never, service);
  });
  ctx.inject(["tools", "attachments"], (visualCtx) => {
    registerVisualReviewTools(visualCtx as never, service);
  });
  ctx.inject(["systemPrompt"], (promptCtx) => {
    registerLibraryPrompt(promptCtx as never, service);
  });
  ctx.inject(["skills"], (skillsCtx) => {
    registerCreatorWorkbenchSkill(skillsCtx as never);
  });
}
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:300-312](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/client/index.tsx#L300-L312)

实际注册Desktop内容工作台。

<details>
<summary>查看原文（13行）</summary>

```text

  const workbenches = desktopWorkbenchesOf(ctx);
  const credentialClient = credentialsOf(ctx);
  function BusinessPanel() {
    return <CreatorWorkbench face={contentFace} service={workbenches} credentials={credentialClient} t={ctx.locale.bind(NS)} />;
  }
  ctx.effect(() => workbenches.register({
    title: "内容工作台",
    repository: "https://github.com/oil-oil/dsh-oil-creator",
    description: "管理本地片库、脚本、字幕、封面与发布状态",
    panelTitle: "内容工作台",
    layout: { businessSide: "right", businessWidth: 0.7 },
  }, BusinessPanel), "dsh-oil-creator: workbench");
```

</details>

**依据 4 · 源码核查**：[src/client/workbench.ts:23-26](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/client/workbench.ts#L23-L26)

缺Desktop服务明确失败。

```text
export function desktopWorkbenchesOf(ctx: Services): CreatorWorkbenchService {
  const service = ctx.get("desktopWorkbenches") as CreatorWorkbenchService | undefined;
  if (service === undefined) throw new Error("请使用提供工作台服务的 DSH Desktop 打开内容工作台。");
  return service;
```

#### 缺口

- 创作者比手动目录+Skill是否减少漏步骤与总投入未对照。
  **影响**：不能把工作流完整外观当真实内容收益。
  **进一步探讨**：先用一条非敏感历史视频复制目录，记录原流程与工作台准备／复核总时间和漏材料。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录／会话、产物阶段、job与视觉审查如何接线，失败能否保真？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

UI新建内容先系统选目录，取消／导航变更拒绝继续，setLibraryRoot后createContent把已选root显式传Host；内容会话只复用ownsSession且完整folder匹配的绑定，选错目录报错，ensureSession后不自动发消息，关联存储失败会明确“会话已创建但关联未保存”。Host setScript可比folderPath拒切库同名错写，openContentPath用realpath和relative核目录范围。界面确认有实际路径，不能据此说所有模型工具都有同等不可绕过授权。

scanFolder以文件后缀找封面／字幕、按mtime选原视频和烧字幕视频，再合overlay；workflow有字幕和封面就进入publish，hasPublishPackage即packaged，不能当质量验收。job工具使用Harness jobs.start和按内容/字段排他Set，cancel abort后调用service.cancelMediaJob，清理异常报failed而不是killed。service按pid/命令片段terminateOwnedProcess，再写cancelled；该helper对查不到命令行或不匹配返回true，service不消费终止返回布尔值，因此不能据job killed保证所有进程／子树或远端服务停止。startTrackedJob退出回调直接patch状态、写失败被catch吞掉，本轮未验竞态恢复。

视觉prepare实际读三比例图片并attachments.saveImages返回refs，支持模型拿到图；saveVisualReview只要求pass时三图存在、summary/findings合法，写JSON和Markdown。它不强制先prepare、不核模型确实看图、不绑定图hash或当前版本，也不要求每比例都有检查。两文件分别atomicWrite，中间取消或失败可只存JSON，不是成对事务。结构报告不是视觉正确的证明，仍需人工看图和字幕专名。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:193-204](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/client/index.tsx#L193-L204)

系统目录选择、导航守卫与显式root。

<details>
<summary>查看原文（12行）</summary>

```text
    createContent: async (title) => {
      const remote = remoteOf();
      if (remote === undefined) throw new Error("remote unavailable");
      const service = desktopWorkbenchesOf(ctx);
      const originalSession = service.currentSession();
      const path = await pickCreatorDirectory(ctx);
      if (path === null || !service.isActive() || service.currentSession() !== originalSession) throw new Error("已取消选择资料目录。");
      unwrap(await remote.setLibraryRoot({ path }), "set root failed");
      const created = unwrap(await remote.createContent({ title, libraryRoot: path }), "create failed");
      if (!service.isActive() || service.currentSession() !== originalSession) throw new Error(`内容已保存到 ${created.folderPath}；会话已切换，请从对应片库打开。`);
      bumpLibrary();
      return created;
```

</details>

**依据 2 · 源码核查**：[src/client/workbench.ts:46-77](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/client/workbench.ts#L46-L77)

自有会话／完整目录复用、不自动发送与部分成功错误。

<details>
<summary>查看原文（32行）</summary>

```text
/** Never adopt a native or another workbench's saved session. No auto-send. */
export async function startContentSession(
  service: CreatorWorkbenchService,
  content: { id: string; folderPath: string },
  pickDirectory: () => Promise<string | null>,
): Promise<string | null> {
  const state = loadCreatorUiState(browserCreatorStorage());
  const saved = Object.entries({ ...state.sessionContents, ...Object.fromEntries(recentBindings.get(service) ?? []) }).find(([id, item]) =>
    item.requiresNewSession !== true && item.contentId === content.id && item.folder === content.folderPath && service.ownsSession(id));
  let folder = content.folderPath;
  if (saved === undefined) {
    const selected = await pickDirectory();
    if (selected === null || !service.isActive()) return null;
    // Business content must stay in its existing folder; do not silently switch
    // to the most recent workspace or a directory inferred from the repository.
    if (selected.replace(/[\\/]+$/, "") !== folder.replace(/[\\/]+$/, "")) {
      throw new Error(`请在目录选择器中选择这一期的资料目录：${folder}`);
    }
    // Keep the catalog path as the stable identity even if the picker returns a trailing slash.
  }
  if (!service.isActive()) return null;
  const sessionId = await service.ensureSession({ folder, ...(saved ? { sessionId: saved[0] } : {}) });
  if (!service.ownsSession(sessionId)) return null;
  const pending = recentBindings.get(service) ?? new Map();
  pending.set(sessionId, { contentId: content.id, folder });
  recentBindings.set(service, pending);
  const latest = loadCreatorUiState(browserCreatorStorage());
  if (!saveCreatorUiState(browserCreatorStorage(), {
    ...latest,
    sessionContents: { ...latest.sessionContents, [sessionId]: { contentId: content.id, folder } },
  })) throw new Error("会话已创建，但内容关联未保存。请保留当前内容并重试。");
  return service.isActive() && service.currentSession() === sessionId ? sessionId : null;
```

</details>

**依据 3 · 源码核查**：[src/service.ts:360-370](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/service.ts#L360-L370)

打开路径realpath范围。

<details>
<summary>查看原文（11行）</summary>

```text
  async openContentPath(request: { path: string }, signal: AbortSignal): Promise<Record<string, never>> {
    signal.throwIfAborted();
    const overlay = await loadOverlay(this.dataDir);
    const root = await realpath(overlay.libraryRoot ?? this.libraryRoot);
    const target = await realpath(request.path);
    const inside = relative(root, target);
    if (inside === ".." || inside.startsWith("../") || inside.startsWith("..\\") || isAbsolute(inside)) {
      throw new Error("只能打开当前资料目录里的文件。");
    }
    signal.throwIfAborted();
    await openExternalPath(target);
```

</details>

**依据 4 · 源码核查**：[src/service.ts:502-509](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/service.ts#L502-L509)

脚本folderPath防同名错库。

```text
  async setScript(request: SetScriptRequest, signal: AbortSignal): Promise<ContentDetail> {
    signal.throwIfAborted();
    const item = await this.find(request.id);
    if (item === undefined) throw new Error(`content not found: ${request.id}`);
    if (request.folderPath !== undefined && request.folderPath !== item.folderPath) throw new Error("资料位置已切换，脚本草稿已保留，请重新打开对应内容。");
    signal.throwIfAborted();
    await writeScript(item.folderPath, request.text);
    return this.getContent({ id: request.id }, signal);
```

**依据 5 · 源码核查**：[src/catalog.ts:119-139](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/catalog.ts#L119-L139)

阶段由产物存在和overlay推导。

<details>
<summary>查看原文（21行）</summary>

```text
export function pipelineOf(item: Omit<ContentSummary, "pipeline" | "workflow">): PipelineStage {
  if (item.hasPublishPackage) return "packaged";
  if (hasCover(item as ContentSummary)) return "covered";
  if (hasSubtitle(item as ContentSummary)) return "subtitled";
  return "raw";
}

export function workflowOf(
  item: Omit<ContentSummary, "pipeline" | "workflow">,
  overlay?: OverlayItem,
): WorkflowStage {
  if (anyPlatformPublished(item.publish)) return "live";
  const recorded = item.videoRaw !== undefined || item.videoSubtitled !== undefined;
  if (recorded) {
    if (hasSubtitle(item as ContentSummary) && hasCover(item as ContentSummary)) return "publish";
    return "finish";
  }
  if (item.studioPath !== undefined || overlay?.studioPath !== undefined) return "cut";
  if (overlay?.waitingForExport === true) return "finish";
  if (overlay?.readyToRecord === true) return "record";
  return "idle";
```

</details>

**依据 6 · 源码核查**：[src/catalog.ts:198-236](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/catalog.ts#L198-L236)

按后缀与mtime挑材料。

<details>
<summary>查看原文（39行）</summary>

```text
  const covers: ContentSummary["covers"] = {};
  const cover3x4 = names.find((name) => name.endsWith("_3x4.png"));
  const cover4x3 = names.find((name) => name.endsWith("_4x3.png"));
  const cover16x9 = names.find((name) => name.endsWith("_16x9.png"));
  if (cover3x4 !== undefined) covers["3x4"] = join(folderPath, cover3x4);
  if (cover4x3 !== undefined) covers["4x3"] = join(folderPath, cover4x3);
  if (cover16x9 !== undefined) covers["16x9"] = join(folderPath, cover16x9);

  const subtitles: ContentSummary["subtitles"] = {};
  const srt = names.find((name) => name.endsWith(".srt"));
  const ass = names.find((name) => name.endsWith(".ass"));
  if (srt !== undefined) subtitles.srt = join(folderPath, srt);
  if (ass !== undefined) subtitles.ass = join(folderPath, ass);

  const workDir = names.find((name) => name.endsWith(".subtitle-work"));
  if (workDir !== undefined) {
    const transcript = join(folderPath, workDir, "subtitle-transcript.json");
    const fallback = join(folderPath, workDir, "transcript.json");
    if (await fileExists(transcript)) subtitles.transcript = transcript;
    else if (await fileExists(fallback)) subtitles.transcript = fallback;
  }

  let videoRaw: string | undefined;
  let videoRawMtime = Number.NEGATIVE_INFINITY;
  let videoSubtitled: string | undefined;
  let videoSubtitledMtime = Number.NEGATIVE_INFINITY;
  for (const name of names) {
    if (!name.endsWith(".mp4") && !name.endsWith(".mov")) continue;
    const path = join(folderPath, name);
    const mtime = await fileMtime(path) ?? Number.NEGATIVE_INFINITY;
    if (isSubtitledVideoName(name)) {
      if (mtime >= videoSubtitledMtime) {
        videoSubtitled = path;
        videoSubtitledMtime = mtime;
      }
    } else if (mtime >= videoRawMtime) {
      videoRaw = path;
      videoRawMtime = mtime;
    }
```

</details>

**依据 7 · 源码核查**：[src/backgroundJobs.ts:66-125](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/backgroundJobs.ts#L66-L125)

排他任务、完成／清理失败和cancel接线。

<details>
<summary>查看原文（60行）</summary>

```text
function startExclusiveJob(
  jobs: JobRegistry,
  active: Set<string>,
  key: string,
  spec: Omit<JobSpec, "run">,
  run: () => JobHooks,
): JobId {
  if (active.has(key)) throw new Error(`${key}: background job is already running`);
  try {
    return jobs.start({
      ...spec,
      run: () => {
        if (active.has(key)) throw new Error(`${key}: background job is already running`);
        const hooks = run();
        active.add(key);
        void hooks.done.then(
          () => { active.delete(key); },
          () => { active.delete(key); },
        );
        return hooks;
      },
    });
  } catch (cause) {
    if (message(cause).includes("no job controller")) {
      throw new Error("background jobs unavailable: use the Harness standard or code preset with @deepseek-ai/dsh-tool-jobs");
    }
    throw cause;
  }
}

function mediaHooks(
  service: OilCreatorService,
  id: string,
  field: MediaField,
  start: (signal: AbortSignal) => Promise<unknown>,
): JobHooks {
  const controller = new AbortController();
  const done = (async (): Promise<JobOutcome> => {
    try {
      await start(controller.signal);
      const job = await service.waitForMediaJob(id, field, controller.signal);
      if (job.status === "done") {
        return { status: "completed", detail: field, result: job.output ?? `${id}: completed` };
      }
      return { status: "failed", detail: field, result: job.error ?? `${id}: failed` };
    } catch (cause) {
      if (controller.signal.aborted) {
        try {
          await service.cancelMediaJob(id, field);
        } catch (cleanupCause) {
          return { status: "failed", detail: "cancel cleanup failed", result: message(cleanupCause) };
        }
        return { status: "killed", detail: field, result: `${id}: cancelled` };
      }
      return { status: "failed", detail: field, result: message(cause) };
    }
  })();
  return {
    cancel: (reason) => {
      if (!controller.signal.aborted) controller.abort(new Error(reason ?? "cancelled"));
```

</details>

**依据 8 · 源码核查**：[src/service.ts:989-1007](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/service.ts#L989-L1007)

cancelMediaJob终止调用与状态patch。

<details>
<summary>查看原文（19行）</summary>

```text
  async cancelMediaJob(
    id: string,
    field: "burn" | "subtitleJob" | "coverJob",
  ): Promise<void> {
    const signal = new AbortController().signal;
    const detail = await this.getContent({ id }, signal);
    const job = detail[field];
    if (job.status !== "running") return;
    await terminateOwnedProcess(job.pid, JOB_COMMAND[field]);
    await this.patchItem(id, (next) => {
      const current = next[field];
      if (current?.status !== "running" || current.pid !== job.pid) return;
      next[field] = {
        status: "error",
        ...(current.startedAt === undefined ? {} : { startedAt: current.startedAt }),
        ...(current.output === undefined ? {} : { output: current.output }),
        error: "cancelled",
      };
    }, signal);
```

</details>

**依据 9 · 源码核查**：[src/processAlive.ts:33-79](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/processAlive.ts#L33-L79)

所有权检查失败不误杀，但布尔不证明实际退出。

<details>
<summary>查看原文（47行）</summary>

```text
  if (pid === undefined) return false;
  if (!pidAlive(pid)) return false;
  const command = pidCommand(pid);
  // A failed command-line lookup is not proof of ownership. Treating it as a
  // match could send SIGTERM/SIGKILL to an unrelated process after PID reuse.
  if (command === undefined) return false;
  return fragments.some((fragment) => command.includes(fragment));
}

export function jobPidStillOurs(pid: number | undefined, fragment: string): boolean {
  return jobPidMatches(pid, [fragment]);
}

export async function waitForPidExit(
  pid: number,
  fragments: readonly string[],
  timeoutMs = 2_000,
  intervalMs = 50,
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    if (!jobPidMatches(pid, fragments)) return true;
    await new Promise<void>((resolve) => setTimeout(resolve, intervalMs));
  }
  return !jobPidMatches(pid, fragments);
}

export async function terminateOwnedProcess(
  pid: number | undefined,
  fragments: readonly string[],
  termTimeoutMs = 2_000,
  killTimeoutMs = 1_000,
): Promise<boolean> {
  if (pid === undefined || !jobPidMatches(pid, fragments)) return true;
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // The process may have exited after the ownership check.
  }
  await waitForPidExit(pid, fragments, termTimeoutMs);
  if (jobPidMatches(pid, fragments)) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // The process may have exited after the second ownership check.
    }
    await waitForPidExit(pid, fragments, killTimeoutMs);
```

</details>

**依据 10 · 源码核查**：[src/service.ts:893-929](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/service.ts#L893-L929)

退出回调与patch失败吞掉。

<details>
<summary>查看原文（37行）</summary>

```text
  async startTrackedJob(
    id: string,
    field: "burn" | "subtitleJob" | "coverJob",
    launch: {
      python: string;
      script: string;
      args: readonly string[];
      output: string;
      env?: Record<string, string>;
    },
    signal: AbortSignal,
  ): Promise<ContentDetail> {
    const child = spawnPython(launch.python, launch.script, launch.args, launch.env);
    const pid = child.pid;
    if (pid === undefined) throw new Error(`${field} failed to start`);
    let stderr = "";
    child.stderr?.on("data", (chunk: Buffer | string) => {
      stderr = `${stderr}${String(chunk)}`.slice(-4000);
    });
    const startedAt = Date.now();
    child.once("exit", (code) => {
      const job: BurnJob = code === 0
        ? { status: "done", startedAt, output: launch.output }
        : {
          status: "error",
          startedAt,
          output: launch.output,
          error: stderr.trim() === "" ? `${field} failed: ${code}` : stderr.trim(),
        };
      void this.patchItem(id, (next) => {
        next[field] = job;
      }, new AbortController().signal).catch(() => undefined);
    });
    child.unref();
    return this.patchItem(id, (next) => {
      next[field] = { status: "running", startedAt, output: launch.output, pid };
    }, signal);
```

</details>

**依据 11 · 源码核查**：[src/visualReview.ts:61-91](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/visualReview.ts#L61-L91)

prepare三图读取并作为attachments。

<details>
<summary>查看原文（31行）</summary>

```text
async function prepareCoverReview(
  service: OilCreatorService,
  attachments: AttachmentStore,
  id: string,
  signal: AbortSignal,
): Promise<CoverReviewResult> {
  const detail = await service.getContent({ id }, signal);
  const missing = missingCoverRatios(detail.covers);
  if (missing.length > 0) throw new Error(`missing cover variants: ${missing.join(", ")}`);
  const candidates = COVER_RATIOS
    .flatMap((ratio) => {
      const path = detail.covers[ratio];
      return path === undefined ? [] : [{ ratio, path }];
    });
  if (candidates.length === 0) throw new Error(`no generated covers: ${id}`);
  const inputs = await Promise.all(candidates.map(async ({ path }) => {
    signal.throwIfAborted();
    const mediaType = imageMediaType(path);
    if (mediaType === undefined) throw new Error(`unsupported cover image: ${path}`);
    return { data: await readFile(path), mediaType, name: basename(path) };
  }));
  signal.throwIfAborted();
  const refs = await attachments.saveImages(inputs);
  return {
    id,
    title: detail.title,
    images: candidates.map((candidate, index) => ({
      ratio: candidate.ratio,
      attachment: refs[index] as ImageAttachmentRef,
    })),
  };
```

</details>

**依据 12 · 源码核查**：[src/visualReview.ts:116-135](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/visualReview.ts#L116-L135)

save仅三图存在和分文件写，不绑定审查证据。

<details>
<summary>查看原文（20行）</summary>

```text
export async function saveVisualReview(
  service: OilCreatorService,
  id: string,
  review: VisualReviewInput,
  signal: AbortSignal,
): Promise<{ jsonPath: string; markdownPath: string }> {
  signal.throwIfAborted();
  const detail = await service.getContent({ id }, signal);
  const missing = missingCoverRatios(detail.covers ?? {});
  if (review.verdict === "pass" && missing.length > 0) {
    throw new Error(`cannot pass visual review; missing cover variants: ${missing.join(", ")}`);
  }
  const createdAt = new Date().toISOString();
  const jsonPath = join(detail.folderPath, "visual-review.json");
  const markdownPath = join(detail.folderPath, "visual-review.md");
  const record = { schemaVersion: 1, id, createdAt, ...review };
  await atomicWrite(jsonPath, `${JSON.stringify(record, null, 2)}\n`);
  signal.throwIfAborted();
  await atomicWrite(markdownPath, reviewMarkdown(id, review, createdAt));
  return { jsonPath, markdownPath };
```

</details>

**依据 13 · 源码核查**：[src/visualReview.ts:202-220](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/visualReview.ts#L202-L220)

summary/findings字段验证无真实看图证明。

<details>
<summary>查看原文（19行）</summary>

```text
    execute: async (args, exec) => {
      if (args.id.trim() === "") throw new Error("id is required");
      if (args.summary.trim() === "") throw new Error("summary is required");
      const findings: VisualFinding[] = args.findings.map((finding) => {
        if (finding.asset.trim() === "" || finding.issue.trim() === "") {
          throw new Error("finding asset and issue are required");
        }
        return {
          severity: finding.severity,
          asset: finding.asset,
          issue: finding.issue,
          ...(finding.suggestion === undefined ? {} : { suggestion: finding.suggestion }),
        };
      });
      return saveVisualReview(service, args.id, {
        verdict: args.verdict,
        summary: args.summary,
        findings,
      }, exec.signal) as never;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配置确认、可选外部能力和恢复成本支持哪种试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需Node22.19+、Desktop0.11.0内置Harness0.2.0-rc.2的desktopWorkbenches契约，standard/code预置适合Skill、文件与jobs；独立Web和其他平台作者未验证。核心片库可不装外部媒体Skill，字幕需oil-subtitle和DashScope key，封面需oil-cover和ZenMux key，Screen Studio与Ego/平台登录偏macOS；它们的在线价格、条款和兼容本轮未查，不能填0。录制剪辑仍在原软件，草稿发布由外部video-publisher，最终发表保留人工。

secretsHost描述凭据只回configured/writable，resolve仅供执行取key，可退回环境变量；这支持不在设置／对话回显设计，不证明子进程／外部Skill／模型链绝无泄漏。setup工具文案要求精确确认才apply=true，但configureCreator服务只检查布尔与目录存在，没有保存预览token或批准记录。organize apply重新计算当前preview再两段rename，失败只尝试退回仍在staging的条目，已到目标的条目不全回滚，overlay在之后另存；不能宣称确认的固定计划与批量原子事务。

因此先复制少量内容目录，仅核心片库、脚本和自有会话trial，保留外部备份，先只预览整理，不装收费媒体／平台上传。首次成本为Desktop版本与目录/overlay配置，持续为媒体处理/模型/外部服务、磁盘、复核与平台登录维护，失败还要查任务真实终止、partial文件与目录状态。作者记录丢失目录恢复时宿主创建同名空目录，不能靠打开旧会话恢复原素材。卸载留正文、overlay与会话，须按需撤销外部key／登录和停预览/任务；回普通目录+原软件是退路，不自动删除内容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-11](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/README.md#L10-L11)

作者固定宿主与独立Web不适用。

```text
> [!NOTE]
> 当前开发目标为 Node.js 22.19+、DSH Desktop `0.11.0` 内置的 Harness `0.2.0-rc.2`；需要 Desktop 的 `desktopWorkbenches` 服务，不适用于独立 Harness Web。核心片库可独立使用；Screen Studio、字幕、封面、公众号和发布能力均可按需安装。
```

**依据 2 · 源码核查**：[package.json:1-23](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/package.json#L1-L23)

0.2.1与Node要求。

<details>
<summary>查看原文（23行）</summary>

```text
{
  "name": "dsh-oil-creator",
  "version": "0.2.1",
  "description": "AI-assisted local creator workbench for DeepSeek Harness",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/oil-oil/dsh-oil-creator.git"
  },
  "bugs": {
    "url": "https://github.com/oil-oil/dsh-oil-creator/issues"
  },
  "homepage": "https://github.com/oil-oil/dsh-oil-creator#readme",
  "keywords": [
    "deepseek-harness",
    "creator",
    "content-workflow",
    "video"
  ],
  "engines": {
    "node": ">=22.19.0"
  },
  "packageManager": "pnpm@10.16.1",
```

</details>

**依据 3 · 作者声明**：[README.md:102-124](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/README.md#L102-L124)

可选依赖、凭据和平台范围。

<details>
<summary>查看原文（23行）</summary>

```text
## 可选能力

核心片库和脚本管理不依赖下表中的外部工具。缺少某项时，只关闭对应环节。

| 能力 | 可选依赖 | 说明 |
| --- | --- | --- |
| 字幕转录、排版、预览和烧录 | [oil-subtitle](https://github.com/oil-oil/oil-subtitle) + `DASHSCOPE_API_KEY` | 首次 clone 后必须运行 `bash ~/.agents/skills/oil-subtitle/setup.sh`；Key 在[百炼控制台](https://bailian.console.aliyun.com)申请 |
| 三画幅封面 | [oil-cover](https://github.com/oil-oil/oil-cover) + `ZENMUX_API_KEY` | Key 在 [ZenMux](https://zenmux.ai) 申请 |
| Screen Studio 自动剪辑 | [screen-studio-editor](https://github.com/oil-oil/screen-studio-editor) | 仅 macOS；录制和导出仍在 Screen Studio 完成 |
| 多平台草稿与数据回收 | [Ego Lite](https://lite.ego.app/) + [video-publisher](https://github.com/oil-oil/video-publisher-skill) | 仅 macOS；需要提前登录各平台创作者后台 |
| 公众号图文 | [oil-video-article](https://github.com/oil-oil/oil-video-article) | 独立工作流，工作台负责展示已有文章 |

字幕和封面 Skill 留空时，插件会依次从 `~/.claude/skills`、`~/.codex/skills`、`~/.agents/skills` 自动发现；只有非标准安装位置才需要填写高级路径。

## 配置原则

设置入口位于 **内容工作台顶部 → 设置**。设置页只保留需要人决定的信息，例如内容目录、脚本规则和可选能力凭据；可以通过系统检查发现的路径不重复暴露。

- API Key 使用 Harness 官方凭据服务保存。页面只显示“已配置 / 未配置”，不会回显明文。
- 内容目录可以换成任意已有的绝对路径，每个直接子文件夹代表一条内容。
- `enabledPlatforms` 默认全开，包含小红书、抖音、B 站和视频号。关闭的平台不会参与 AI 发布或数据同步；全部关闭时不执行这两项操作。
- 脚本规则既可以在设置页修改，也可以让 AI 通过 `oil_script_rules` 记录和更新。
- Cordis 高级配置仍保留 `libraryRoot`、`dataDir`、`subtitleSkillDir` 和 `coverSkillDir`，用于自动发现无法覆盖的特殊环境。
```

</details>

**依据 4 · 源码核查**：[src/secretsHost.ts:27-64](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/secretsHost.ts#L27-L64)

描述与resolve分离、环境回退及执行env。

<details>
<summary>查看原文（38行）</summary>

```text
export async function describeCreatorSecrets(
  ctx: { get: (name: string) => unknown },
): Promise<CreatorSecrets> {
  const credentials = credentialsOf(ctx);
  if (credentials === undefined) {
    return { subtitle: envView("subtitle"), cover: envView("cover") };
  }
  const described: Record<string, { configured: boolean; writable: boolean; source?: string }> = {};
  for (const ref of [...refsFor("subtitle"), ...refsFor("cover")]) {
    described[ref] = await credentials.describe(ref);
  }
  return {
    subtitle: viewFromDescribe("subtitle", described),
    cover: viewFromDescribe("cover", described),
  };
}

export async function resolveCreatorSecret(
  ctx: { get: (name: string) => unknown },
  kind: SecretKind,
): Promise<string | undefined> {
  const credentials = credentialsOf(ctx);
  if (credentials !== undefined) {
    for (const ref of refsFor(kind)) {
      const hit = await credentials.resolve(ref);
      const value = hit?.value.trim();
      if (value !== undefined && value !== "") return value;
    }
  }
  for (const ref of refsFor(kind)) {
    const value = process.env[ref]?.trim();
    if (value !== undefined && value !== "") return value;
  }
  return undefined;
}

export function secretEnv(kind: SecretKind, value: string): Record<string, string> {
  return { [kind === "subtitle" ? "DASHSCOPE_API_KEY" : "ZENMUX_API_KEY"]: value };
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:80-87](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/tools.ts#L80-L87)

apply后用户确认是工具指引。

```text
  ctx.tools.register(defineTool({
    name: "oil_creator_setup",
    description:
      "Inspect the creator workspace, optional local capabilities, credential status, and current configuration. "
      + "Omit fields for a read-only diagnosis. Proposed changes are previewed unless apply=true. "
      + "Only use apply=true after the user confirms the exact directory and enabled platform changes.",
    parameters: {
      apply: { type: "boolean", description: "False previews changes. True saves them after user confirmation." },
```

**依据 6 · 源码核查**：[src/service.ts:456-491](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/service.ts#L456-L491)

service按apply布尔直接保存，不验证预览批准凭据。

<details>
<summary>查看原文（36行）</summary>

```text
  async configureCreator(
    request: CreatorSetupRequest,
    signal: AbortSignal,
  ): Promise<CreatorSetupResult> {
    signal.throwIfAborted();
    const proposal: CreatorSetupResult["proposal"] = {};
    if (request.libraryRoot !== undefined) proposal.libraryRoot = resolveUserPath(request.libraryRoot);
    if (request.enabledPlatforms !== undefined) {
      proposal.enabledPlatforms = normalizeEnabledPlatforms(request.enabledPlatforms);
    }
    if (!request.apply || Object.keys(proposal).length === 0) {
      return { applied: false, proposal, status: await this.getCreatorSetupStatus(signal) };
    }
    if (proposal.libraryRoot !== undefined) {
      const info = await stat(proposal.libraryRoot).catch(() => undefined);
      if (info === undefined || !info.isDirectory()) {
        throw new Error(`library root is not a directory: ${proposal.libraryRoot}`);
      }
    }
    await withOverlayLock(this.dataDir, async () => {
      const overlay = await loadOverlay(this.dataDir);
      if (proposal.libraryRoot !== undefined) overlay.libraryRoot = proposal.libraryRoot;
      const profile = overlay.profile ?? emptyProfile();
      if (proposal.enabledPlatforms !== undefined) {
        profile.enabledPlatforms = [...proposal.enabledPlatforms];
      }
      overlay.profile = profile;
      await saveOverlay(this.dataDir, overlay);
      this.rememberOverlay(overlay);
      if (proposal.libraryRoot !== undefined) {
        this.libraryRoot = proposal.libraryRoot;
        this.stopWatch();
      }
      this.invalidateCatalog();
    });
    return { applied: true, proposal, status: await this.getCreatorSetupStatus(signal) };
```

</details>

**依据 7 · 源码核查**：[src/service.ts:512-525](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/service.ts#L512-L525)

整理文件操作后再存overlay。

<details>
<summary>查看原文（14行）</summary>

```text
  async organizeLibrary(request: OrganizeRequest, signal: AbortSignal): Promise<OrganizePreview> {
    signal.throwIfAborted();
    const overlay = await loadOverlay(this.dataDir);
    const libraryRoot = overlay.libraryRoot ?? this.libraryRoot;
    if (!request.apply) {
      return previewOrganize(libraryRoot, overlay, request.ids);
    }
    const result = await applyOrganize(libraryRoot, overlay, request.ids);
    await withOverlayLock(this.dataDir, async () => {
      const latest = await loadOverlay(this.dataDir);
      await saveOverlay(this.dataDir, remapOverlayItems(latest, result.preview.moves));
    });
    this.invalidateCatalog();
    return result.preview;
```

</details>

**依据 8 · 源码核查**：[src/organize.ts:132-164](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/organize.ts#L132-L164)

重新预览与staging部分回退。

<details>
<summary>查看原文（33行）</summary>

```text
export async function applyOrganize(
  libraryRoot: string,
  overlay: OverlayStore,
  ids: readonly string[] = [],
): Promise<{ preview: OrganizePreview; overlay: OverlayStore }> {
  const preview = await previewOrganize(libraryRoot, overlay, ids);
  if (preview.moves.length === 0) {
    return { preview, overlay };
  }

  const staging = join(libraryRoot, STAGING);
  await mkdir(staging, { recursive: true });
  try {
    for (const move of preview.moves) {
      await rename(join(libraryRoot, move.from), join(staging, move.from));
    }
    for (const move of preview.moves) {
      await rename(join(staging, move.from), join(libraryRoot, move.to));
    }
  } catch (cause) {
    for (const move of preview.moves) {
      const staged = join(staging, move.from);
      const original = join(libraryRoot, move.from);
      if (await pathExists(staged) && !(await pathExists(original))) {
        await rename(staged, original).catch(() => undefined);
      }
    }
    throw cause;
  } finally {
    await rmdir(staging).catch(() => undefined);
  }

  return { preview, overlay: remapOverlayItems(overlay, preview.moves) };
```

</details>

**依据 9 · 作者声明**：[docs/market-selftest.md:25-35](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/docs/market-selftest.md#L25-L35)

作者保留丢目录恢复失败、卸载保留与窗口范围。

<details>
<summary>查看原文（11行）</summary>

```text
## 未通过与未验证

目录丢失恢复未通过：将已经确认的测试资料目录暂时移走，切到新会话，再从侧栏打开旧的内容工作台会话，原路径被重建为同名空目录。资料目录已在测试后还原。插件的 getContent / restoreSessionContent 不创建目录；已在 Desktop 内置 `@deepseek-ai/dsh-api-session-controller/lib/index.js` 确认创建会话入口会执行 `mkdir(cwd, { recursive: true })`。这是当前目标宿主的已知行为；本包不修改宿主会话控制器，也没有复制原生会话系统。投稿中明确记录该限制，不将目录丢失验收记为通过。

合同审核工作台切换时曾出现业务面板加载失败；第二工作台隔离测试因此使用经营看板完成。未更改合同审核插件。

2026-10-10 补充实测：重开 Desktop 后内容工作台加载正常；工作台主页 → 已安装显示内容工作台 v0.2.1、运行中。从该列表执行卸载，列表数量由 3 变为 2；对卸载前登记的 396 个本机片库、工作台状态及会话文件核对，缺失 0、内容改变 0。未上传这些文件或其文件名。

2026-10-10 最终公开来源复装：从 GitHub Release v0.2.1 的 latest/download 地址下载，SHA-256 与上传包一致（714753 bytes）；通过 Desktop 内置 CLI 安装并重启。四个运行文件逐字节匹配源构建，已安装列表显示内容工作台 v0.2.1、运行中。旧会话的 Shell 结果、内容关联均可恢复。另写入一条未发送的测试草稿，重启后仍保留在输入框，未自动发送，测试后已清空。

窗口缩放后业务面板没有遮挡公共侧栏；Tab 能到达业务搜索和内容条目。极窄窗口及全部尺寸组合未穷举，不声明覆盖全部窗口尺寸。
```

</details>

**依据 10 · 作者声明**：[README.md:133-137](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/README.md#L133-L137)

卸载不删内容、overlay和会话。

```text
## 卸载与旧版迁移

通过当前 Desktop 的插件管理入口卸载，再重启 Harness。内容目录、overlay 状态和已有会话不随插件删除。

新版 bundle patch 只插入本包；公共侧栏、工作台切换和原生聊天由 Desktop 管理。旧版如果在用户 profile 中额外手写过 `ui-sidebar: disabled`，升级时应检查并移除那项历史覆盖；不要把本项目的 patch 复制到用户配置。
```

#### 缺口

- 同版本Desktop真实UI、jobs终止／恢复、媒体和平台全链未由本轮执行。
  **影响**：不能推荐直接处理唯一素材或自动发布。
  **进一步探讨**：复制素材在固定宿主验目录取消、切库、重启、任务取消和卸载，再决定是否加外部能力。
- 外部服务价格、模型图审查准确性和平台匹配／登录长期维护未验证。
  **影响**：收益和现金／人工成本不能定量。
  **进一步探讨**：启用前核各服务实时条款和数据外发，单条公开样例计总成本并人工确认。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 作者验收和视觉报告能证明什么，下一项假设怎样被推翻？

**研究主题**：新假设与验证

#### 完整回答

market-selftest作者记录0.2.1在macOS arm64 Desktop0.11.0的安装、Shell、目录取消、会话隔离与卸载保留，也明确旧目录移走再开会话被宿主重建空目录未通过、极窄尺寸未穷举。它比无范围“全部测试通过”更有用，但仍是作者材料，不算本轮执行，Shell成功不证明字幕／封面／多平台完整内容闭环。

从Q02 prepare真实图片附件但save不绑定图版本推导未实现方向：视觉review保存本次三张图片digest和prepare receipt，封面再生成时报告转stale，可能减少旧PASS被用于新封面。相对当前JSON/Markdown增量是可复核的材料版本绑定，不等替代人工审美或证明模型看懂。最小实验用三图完备后保存PASS、替换其中一图、同名重生成、只写伪summary四组复制材料，比较当前与绑定方案的陈旧通过、误阻断及复核时间；若陈旧通过不降或正常迭代成本高于人工复核，则否定。该方向尚未实现，不计当前创新或采用分。

#### 证据与依据

**依据 1 · 作者声明**：[docs/market-selftest.md:13-35](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/docs/market-selftest.md#L13-L35)

作者安装／操作与明确失败范围。

<details>
<summary>查看原文（23行）</summary>

```text
## 已执行

- `pnpm check`：类型检查、构建、41 个测试文件 / 251 项测试通过。
- `pnpm pack`：预构建 Host、Client、Typert、采集脚本及 bundle patch 均在包内，包体低于 8 MiB。
- 通过 Desktop 内置 CLI 从该本地产物安装，重启后实际打开业务面板。旧包装器失效，使用随 Desktop 提供的 Harness 入口。
- 修复工具运行时重复实例：`@deepseek-ai/dsh-tools` 改为宿主 peer，开发依赖只用于构建与测试。安装后的 profile 不再持有另一份工具运行时。
- 在创作工作台会话执行 `printf 'HARNESS_TOOLS_OK\n'`，实际成功。网页工具也进入执行阶段，返回域名解析为非公网 IP 的网络策略错误；没有重现 `reading 'prepare'`。未将网页抓取记为成功。
- 无会话时可浏览内容、选择详情和脚本。新建内容取消目录选择后无新目录、内容记录或会话；确认后只在所选测试目录创建内容。
- 开始内容会话取消后没有创建会话；选错目录时明确报错，正确选中内容目录后创建原生工作台会话，未自动发送消息。
- 同一测试工作区分别创建原生、内容工作台、经营看板会话；逐个切换模式只显示对应会话，原目录资料未搬移。已有内容会话恢复了关联的业务选择。
- 侧栏可收起，新建会话后业务面板继续可用；标准业务 frame，不使用 customFrame。

## 未通过与未验证

目录丢失恢复未通过：将已经确认的测试资料目录暂时移走，切到新会话，再从侧栏打开旧的内容工作台会话，原路径被重建为同名空目录。资料目录已在测试后还原。插件的 getContent / restoreSessionContent 不创建目录；已在 Desktop 内置 `@deepseek-ai/dsh-api-session-controller/lib/index.js` 确认创建会话入口会执行 `mkdir(cwd, { recursive: true })`。这是当前目标宿主的已知行为；本包不修改宿主会话控制器，也没有复制原生会话系统。投稿中明确记录该限制，不将目录丢失验收记为通过。

合同审核工作台切换时曾出现业务面板加载失败；第二工作台隔离测试因此使用经营看板完成。未更改合同审核插件。

2026-10-10 补充实测：重开 Desktop 后内容工作台加载正常；工作台主页 → 已安装显示内容工作台 v0.2.1、运行中。从该列表执行卸载，列表数量由 3 变为 2；对卸载前登记的 396 个本机片库、工作台状态及会话文件核对，缺失 0、内容改变 0。未上传这些文件或其文件名。

2026-10-10 最终公开来源复装：从 GitHub Release v0.2.1 的 latest/download 地址下载，SHA-256 与上传包一致（714753 bytes）；通过 Desktop 内置 CLI 安装并重启。四个运行文件逐字节匹配源构建，已安装列表显示内容工作台 v0.2.1、运行中。旧会话的 Shell 结果、内容关联均可恢复。另写入一条未发送的测试草稿，重启后仍保留在输入框，未自动发送，测试后已清空。

窗口缩放后业务面板没有遮挡公共侧栏；Tab 能到达业务搜索和内容条目。极窄窗口及全部尺寸组合未穷举，不声明覆盖全部窗口尺寸。
```

</details>

**依据 2 · 源码核查**：[src/visualReview.ts:76-91](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/visualReview.ts#L76-L91)

真实附件作为版本绑定起点。

<details>
<summary>查看原文（16行）</summary>

```text
  const inputs = await Promise.all(candidates.map(async ({ path }) => {
    signal.throwIfAborted();
    const mediaType = imageMediaType(path);
    if (mediaType === undefined) throw new Error(`unsupported cover image: ${path}`);
    return { data: await readFile(path), mediaType, name: basename(path) };
  }));
  signal.throwIfAborted();
  const refs = await attachments.saveImages(inputs);
  return {
    id,
    title: detail.title,
    images: candidates.map((candidate, index) => ({
      ratio: candidate.ratio,
      attachment: refs[index] as ImageAttachmentRef,
    })),
  };
```

</details>

**依据 3 · 源码核查**：[src/visualReview.ts:122-134](https://github.com/oil-oil/dsh-oil-creator/blob/58bd30d0d05b04e149552e8bdb4ff0becae614f0/src/visualReview.ts#L122-L134)

保存未带图片identity/receipt。

<details>
<summary>查看原文（13行）</summary>

```text
  signal.throwIfAborted();
  const detail = await service.getContent({ id }, signal);
  const missing = missingCoverRatios(detail.covers ?? {});
  if (review.verdict === "pass" && missing.length > 0) {
    throw new Error(`cannot pass visual review; missing cover variants: ${missing.join(", ")}`);
  }
  const createdAt = new Date().toISOString();
  const jsonPath = join(detail.folderPath, "visual-review.json");
  const markdownPath = join(detail.folderPath, "visual-review.md");
  const record = { schemaVersion: 1, id, createdAt, ...review };
  await atomicWrite(jsonPath, `${JSON.stringify(record, null, 2)}\n`);
  signal.throwIfAborted();
  await atomicWrite(markdownPath, reviewMarkdown(id, review, createdAt));
```

</details>

#### 缺口

- 图片版本绑定能否减少旧review误用未试验。
  **影响**：未来机制不能算已有视觉验收保证。
  **进一步探讨**：按四组复制素材比较陈旧通过／误阻断／复核投入，不改善就放弃。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
