# EduWork Knowledge Studio

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[0e78219](https://github.com/ECNU/EduWork/tree/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio)

<!-- BEGIN META -->
[![GitHub ★ 285](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=285&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ECNU/EduWork) [![npm 30d 2,243](https://img.shields.io/static/v1?label=npm+30d&message=2%2C243&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-knowledge-studio) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-knowledge-studio)
<!-- END META -->

> **功能**：在 DSH 工作区使用资料与模型创建、管理和学习多种内容成果。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示工作区资料、模型生成、来源快照和学习交互连成同会话的成果流程；共享能力属于配套服务，未证明净节时。

> **主要限制**：[Q03](#research-q03) 显示题目校验只检查结构和引用 ID，索引型 fresh 不重读文件；用户仍须核对活源与每个答案，不能把标记当事实保证。

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
  - [Q01 · 谁可以用 Studio 制作什么，它比普通对话和手工制卡增加什么？](#detail-section-11)
  - [Q02 · 一次测验如何从资料变为可交互成果，失败会留下什么？](#detail-section-12)
  - [Q03 · 题目格式和引用新鲜标记能证明答案正确并有原文支持吗？](#detail-section-13)
  - [Q04 · 加载、生成和保存分别依赖什么？](#detail-section-14)
  - [Q05 · 如何安全评估一份测验草稿并何时退出？](#detail-section-15)
  - [Q06 · 活源比对加条目级审核能否改善草稿可信度？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：教师或培训资料维护者可在兼容 DSH 工作区，用允许发送给模型的资料制作并审核测验或卡片草稿。

普通对话配合人工复制、制卡及审核也能完成任务；集中状态与草稿交接的实际净收益仍需比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 创建测验 | 依据工作区资料生成题目草稿 | 需模型和可读资料，答案需人工核对 |
| 创建卡片 | 生成正反面学习卡片 | 引用可为空，事实未自动验证 |
| 来源检查 | 比较文件或索引中的摘要 | 索引 fresh 不保证活文件未变化 |
| 学习交互 | 保存答题、揭示和卡片状态 | 仅已完成成果可交互 |
| 成果保存 | 保留状态、草稿和可选导出 | 写失败可能未落盘，跨进程一致未知 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Node | 加载需要 | 工作区、文件、会话与 UI | 版本不匹配不能假定可用 |
| Artifact Services 0.3.2 | Host 注入需要 | 共享 Office 与媒体服务 | 缺失不能满足声明注入 |
| 平台 Ladybug 绑定 | 当前模块加载需要 | 本地索引存储 | 缺失或平台不支持时抛错 |
| 工作区与允许读取的资料 | 生成需要 | 提供证据片段 | 无内容时拒绝生成 |
| 已配置模型与外发许可 | 生成需要 | 生成测验与卡片文本 | 缺模型失败，费用和隐私由实际服务决定 |
| Office、浏览器或媒体运行时 | 对应格式需要 | 导出及预览 | 不应将这些条件当作基本测验的已验证环境 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选公开资料并确认模型外发许可 | 核实宿主与资料权限 |
| 生成 | 用户发起小批测验 | 查看实际状态与来源范围 |
| 审核 | 教师逐题对照当前原文 | 题干、答案与干扰项均有依据 |
| 恢复 | 用户处理失败或事实不符 | 保留原资料与需要的成果，停止扩展生成 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主、native 和服务资源费用未知 | 确认版本、资料与外发许可 | 未验证目标平台 |
| 持续 | 模型 token、存储及可选导出费用未知 | 核对来源、题目与答案 | 无同任务总成本对照 |
| 恢复 | 重试模型与存储费用未知 | 检查失败草稿和保存状态 | 未验证跨进程恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 资料生成 | 工作区来源到模型与成果的链路 | 事实准确率与教师净节时 |
| 引用 | ID 过滤与文件或索引摘要比对 | 引用是否支持每条答案 |
| 交互 | 测验和卡片状态可保存 | 学生独立学习效果 |

> **思考**：[Q03](#research-q03) 显示题目校验只检查结构和引用 ID，索引型 fresh 不重读文件；用户仍须核对活源与每个答案，不能把标记当事实保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示工作区资料、模型生成、来源快照和学习交互连成同会话的成果流程；共享能力属于配套服务，未证明净节时。

[Q02](#research-q02) 的文件范围、模型终止检查与成果记录原子换入有具体实现；[Q03](#research-q03) 的不同来源新鲜度口径须与事实审核分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示题目校验只检查结构和引用 ID，索引型 fresh 不重读文件；用户仍须核对活源与每个答案，不能把标记当事实保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先用公开短资料小批试作并逐题核对；来源、答案、权限或成本不符时停止并回人工制卡。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持有条件的生成和保存机制；题目事实、真实宿主与学习效果未由本次验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-knowledge-studio/README.md、packages/dsh-knowledge-studio/package.json、packages/dsh-knowledge-studio/src/client/index.tsx、packages/dsh-knowledge-studio/lib/index.js、packages/dsh-knowledge-studio/lib/tools.js、packages/dsh-knowledge-studio/lib/manager.js、packages/dsh-knowledge-studio/lib/artifacts.js、packages/dsh-knowledge-studio/lib/generation.js、packages/dsh-knowledge-studio/lib/atomic-json.js、packages/dsh-knowledge-studio/lib/basic-evidence.js、packages/dsh-knowledge-studio/lib/store.js、packages/dsh-knowledge-studio/lib/ladybug.js 及固定范围 inventory；组件：packages/dsh-knowledge-studio。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查客户端成果入口、Host 工具、测验生成、资料引用、native 加载与成果保存；未全面审计 Office、媒体、所有客户端和宿主权限，不运行目标或模型。
- 下一步：在隔离工作区用同一公开文档，对比手工制卡，记录答案支持率、陈旧索引、失败恢复、模型费用与教师审核时间。

**分析版本**

- **仓库**：[ECNU/EduWork](https://github.com/ECNU/EduWork)
- **版本号**：0.6.3（[固定提交 0e78219](https://github.com/ECNU/EduWork/tree/0e7821994002f4142298b72d72577e79c16db506)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出把实时源比对和教师逐题确认绑定成果版本的未验证假设，需与普通人工审校对照成本与误通过率。

在隔离工作区用同一公开文档，对比手工制卡，记录答案支持率、陈旧索引、失败恢复、模型费用与教师审核时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 43 | 2128 | — | — | 34799 |
| .js | source | 72 | 6548 | 5953 | 236 | — |
| .mjs | source | 48 | 2597 | 2486 | 76 | — |
| .tsx | source | 12 | 2011 | 1928 | 24 | — |
| .ts | source | 13 | 442 | 410 | 9 | — |
| .jsx | source | 2 | 19 | 17 | 1 | — |
| .mjs | test | 37 | 4067 | 3809 | 17 | — |
| .tsx | example | 5 | 120 | 117 | 1 | — |
| .md | example | 1 | 10 | — | — | 237 |
| .mjs | example | 2 | 33 | 30 | 1 | — |

</details>

**活跃度**

[![近30天新建 31](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=31&color=737b86&logo=github)](https://github.com/ECNU/EduWork/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/ECNU/EduWork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查工作区资料生成学习成果的链路、事实边界与试用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁可以用 Studio 制作什么，它比普通对话和手工制卡增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

有兼容 DSH 工作区、可发送资料的模型及人工审核能力的教师或培训资料维护者，可尝试从允许使用的小份资料生成测验和卡片草稿。作者描述资料驱动创作、引用和学习交互；客户端成果卡把请求填入会话并提交，Host 注册 create_artifact 工具，工具从当前 Agent 会话解析工作区、启动并等待成果。相对普通对话后复制制卡，这提供了同会话交接、成果与交互状态管理；Office 和媒体由配套服务提供，不应全部归为 Studio 自创。尚无独立教师对照，不能证明更快或学习效果更好。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-knowledge-studio/README.md:1-18](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/README.md#L1-L18)

作者描述范围及成果。

<details>
<summary>查看原文（18行）</summary>

```text
# DSH Knowledge Studio

版本：Studio `0.6.0` / Artifact Services `0.3.0`，要求 Node.js 24.18+ 与 DSH 0.2.1-rc.2。无需 EduWork 桌面桥接或机构账号。

[English](README_EN.md)

为 DeepSeek Harness 的工作区提供资料驱动的创作与学习工具。直接使用现有文件、对话和模型配置；直接读取原始资料，已有本地索引可供成果检索使用。

| Studio | 成果 |
| --- | --- |
| 报告 | 简报、学习指南、自定义报告；DOCX、PDF、Markdown |
| 演示文稿 | 可编辑 PPTX、PDF、HTML |
| 数据表 | XLSX、CSV |
| 思维导图 | 节点浏览、引用和追问；PNG、SVG、Markdown |
| 测验 / 闪卡 | 答题反馈、学习进度；含答案的 Markdown、PDF |
| 音频 / 视频概览 | WAV、MP4、字幕、可选旁白和配乐、视频预览 |

成果使用官方侧栏全屏阅读，保留原会话与输入草稿，引用可追溯到工作区资料。支持的成果类型见上表。
```

</details>

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/src/client/index.tsx:762-775](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/src/client/index.tsx#L762-L775)

成果入口转成会话请求。

<details>
<summary>查看原文（14行）</summary>

```text
  const invoke = (capability: any, parameters: any = {}) =>
    run(async () => {
      if (capability.execution === 'conversation') {
        inputActions.setDraft(capability.prompt || BUILTIN_CAPABILITIES.find((item: any) => item.id === capability.id)?.prompt)
        inputActions.submit()
        return
      }
      if (capability.execution === 'artifact') {
        surface.setReading(false)
        surface.remember(sessionId, { awaitingArtifactSince: new Date().toISOString(), artifactId: '' })
        setDialog(null)
        setArtifactId('')
        inputActions.setDraft(artifactRequest(capability, parameters))
        inputActions.submit()
```

</details>

**依据 3 · 源码核查**：[packages/dsh-knowledge-studio/lib/index.js:15-35](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/index.js#L15-L35)

Host 注入、创建服务并注册工具。

<details>
<summary>查看原文（21行）</summary>

```text
export class KnowledgeStudioService extends TypertRemoteService {
  static Config = Config
  static inject = ['tools', 'workspaceRegistry', 'fs', 'settings', 'skills', 'llm', 'agents', 'agentDefaultModel', 'artifactServices']

  constructor(ctx, config = {}) {
    super(ctx, 'knowledgeStudio')
    this.settingsScope = typeof ctx.settings.register === 'function'
      ? ctx.settings.register(SETTINGS_NAMESPACE, KnowledgeStudioSettingsSchema, {
        base: mergeDefaultSettings(config), applies: 'live', validate: validateSettings,
      })
      : { get: () => liveSettings(config) }
    this.manager = new KnowledgeIndexManager(ctx, config)
    this.mediaProviders = ctx.artifactServices.media
    this.artifacts = new ArtifactEngine(ctx, this.manager, {...config,mediaProviders:this.mediaProviders})
    this.registry = new StudioRegistry()
    this.uiPreferences = new StudioUIPreferences(config.uiPreferencesPath)
    installStudioNotifications(ctx, this)
    installKnowledgeStudioTools(ctx, this.manager, this.artifacts,{indexedRetrievalTools:config.indexedRetrievalTools===true})
    if(config.skills!==false) {
      const disposeSkill = installKnowledgeStudioSkill(ctx)
      ctx.effect(() => disposeSkill, 'dsh-knowledge-studio: bundled skill')
```

</details>

**依据 4 · 源码核查**：[packages/dsh-knowledge-studio/lib/tools.js:23-34](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/tools.js#L23-L34)

注册成果创建工具和参数。

<details>
<summary>查看原文（12行）</summary>

```text
export function installKnowledgeStudioTools(ctx, manager, artifacts, {indexedRetrievalTools=false}={}) {
  if (artifacts) ctx.tools.register(defineTool({
    name: 'knowledge_studio_create_artifact',
    description: 'Generate and save a grounded Studio report, mindmap, quiz, flashcards, table, slides, audio or video using current workspace files. Only report success when status is completed. To fix or improve the SAME deliverable in this turn, including a completed file needing edits, pass its returned artifactId as retryArtifactId or reuse its targetKey. Prior versions remain saved and only the final version appears in recent artifacts. Use distinct targetKey values only when the user requests separate deliverables, never for revision numbers or title changes.',
    parameters: {
      kind: { type: 'string', required: true, enum: ['quiz', 'flashcards', 'report', 'mindmap', 'table', 'slides', 'audio', 'video'] },
      retryArtifactId: {type:'string',description:'ArtifactId from this turn to revise the same deliverable, whether its last attempt failed or completed. Keeps prior versions.'},
      targetKey: {type:'string',description:'Stable identity for a user-requested deliverable, unchanged across retries, title/focus changes and completed-file edits. Use different keys only for separate requested outputs, not v1/v2/v3.'},
      count: { type: 'integer' },
      difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
      focus: { type: 'string' },
      pathPrefix: { type:'string',description:'Optional existing INPUT source file or directory relative to the workspace root. Omit or use an empty string to read workspace sources. This is NOT an output destination: saving to Studio does not mean pathPrefix="studio". Never invent a directory.' },
```

</details>

**依据 5 · 源码核查**：[packages/dsh-knowledge-studio/lib/tools.js:59-68](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/tools.js#L59-L68)

从当前 Agent 工作区启动并等待。

<details>
<summary>查看原文（10行）</summary>

```text
    async execute(args, exec) {
      const workspace = await manager.workspaceForAgent(exec.agent)
      const artifact = await artifacts.start(workspace, args.kind, args, exec.agent?.session?.id, exec.signal, exec)
      const result = await artifacts.wait(artifact.id)
      const retry=result.lifecycle?.state==='open'?` 本轮继续修正或完善同一成果（包括已生成的文件）时，保留 kind=${result.kind}，传 retryArtifactId="${result.id}" 或沿用原 targetKey；不要给修订版本另起 targetKey。中间版本会保留在历史中，成果区在轮末仅展示最终版本。`:''
      const pptx=result.exports?.find(file=>file.format==='pptx')
      const pages=pptx?.pageCount?` 实际 PPTX 为 ${pptx.pageCount} 页。${pptx.adaptations?.length?'已按可读空间自动换行或续页，保留完整内容。':''}`:''
      const items=result.content?.questions??result.content?.cards
      const count=result.status==='completed'&&items?` 实际生成 ${items.length} ${result.kind==='quiz'?'道题目':'张卡片'}${items.length<result.parameters.count?`（请求 ${result.parameters.count}）`:''}。`:''
      return { artifactId: result.id, status: result.status, message: (result.message || '成果已保存在 Studio 右栏，可答题、翻卡和继续追问。')+pages+count+retry }
```

</details>

#### 缺口

- 没有教师任务或学习效果的同条件对照
  **影响**：不能将功能接线等同实测教学收益
  **进一步探讨**：以公开资料对比手工制卡的准确率、返工和时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一次测验如何从资料变为可交互成果，失败会留下什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具以 Agent 当前会话 cwd 解析归属工作区，再创建成果任务并等待；引擎按索引是否存在及是否正在写入决定查询索引或通过宿主文件系统临时扫描，范围扫描最多读取 48 份文件，找不到可引用片段时拒绝。随后将证据片段组织成提示，通过所选 DSH 模型流生成文本，检查完成标志和 JSON，再生成题目并保存引用快照与交互初始状态。模型不可用、流中断或超限会报告失败；后续导出完成才标 completed，失败尝试可保存部分草稿。成果记录写入采用进程内串行与临时文件 rename，写失败可暴露未持久化状态；这不证明跨进程一致、生成事实正确或模型数据处理已获授权。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-knowledge-studio/lib/manager.js:33-38](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/manager.js#L33-L38)

从当前会话定位工作区。

```text
  async workspaceForAgent(agent) {
    const cwd = agent?.session?.header?.cwd
    if (!cwd) throw new Error('This tool requires a DSH session attached to a workspace')
    const workspace = await this.#ctx.workspaceRegistry.resolveByPath(cwd)
    if (!workspace) throw new Error(`No DSH workspace owns the current session directory: ${cwd}`)
    return workspace
```

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/lib/tools.js:59-68](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/tools.js#L59-L68)

创建并等待成果。

<details>
<summary>查看原文（10行）</summary>

```text
    async execute(args, exec) {
      const workspace = await manager.workspaceForAgent(exec.agent)
      const artifact = await artifacts.start(workspace, args.kind, args, exec.agent?.session?.id, exec.signal, exec)
      const result = await artifacts.wait(artifact.id)
      const retry=result.lifecycle?.state==='open'?` 本轮继续修正或完善同一成果（包括已生成的文件）时，保留 kind=${result.kind}，传 retryArtifactId="${result.id}" 或沿用原 targetKey；不要给修订版本另起 targetKey。中间版本会保留在历史中，成果区在轮末仅展示最终版本。`:''
      const pptx=result.exports?.find(file=>file.format==='pptx')
      const pages=pptx?.pageCount?` 实际 PPTX 为 ${pptx.pageCount} 页。${pptx.adaptations?.length?'已按可读空间自动换行或续页，保留完整内容。':''}`:''
      const items=result.content?.questions??result.content?.cards
      const count=result.status==='completed'&&items?` 实际生成 ${items.length} ${result.kind==='quiz'?'道题目':'张卡片'}${items.length<result.parameters.count?`（请求 ${result.parameters.count}）`:''}。`:''
      return { artifactId: result.id, status: result.status, message: (result.message || '成果已保存在 Studio 右栏，可答题、翻卡和继续追问。')+pages+count+retry }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:425-455](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L425-L455)

创建记录、任务和取消控制。

<details>
<summary>查看原文（31行）</summary>

```text
  async start(workspace, kind, parameters, sessionId, signal, execution) {
    const normalized = normalizeParameters(kind, parameters)
    if(['audio','video'].includes(kind)&&this.#ctx.artifactServices?.mediaReadiness) {
      signal?.throwIfAborted()
      const runtime=await this.#ctx.artifactServices.mediaReadiness()
      if(!runtime.available)throw new Error(runtime.reason)
      if(kind==='audio'||normalized.narration!==false&&normalized.narration!=='off') {
        const catalog=await this.#mediaProviders.describe()
        const selected=catalog.speech.find(provider=>provider.id===(normalized.provider||'system'))
        if(!selected?.available||!selected.voices.length)throw new Error('所选语音服务不可用，请重新选择语音服务；视频也可以明确选择不配音。')
        for(const voice of [normalized.voice,normalized.voiceB].filter(Boolean)) {
          if(!selected.voices.some(item=>item.id===voice))throw new Error('所选音色已不可用，请重新选择音色。')
        }
      }
      signal?.throwIfAborted()
    }
    const turn=executionTurn(execution)
    const targetKey=parameters?.targetKey
    if(targetKey!==undefined&&(typeof targetKey!=='string'||!targetKey.trim()||targetKey.length>200))throw new Error('targetKey must be a nonempty string of at most 200 characters')
    const lifecycle=turn?{...turn,callId:String(execution.callId||execution.rootCallId||''),targetKey:targetKey||null}:null
    const artifact = await this.#store.create(workspace, kind, normalized, turn?.sessionId||sessionId, lifecycle, parameters?.retryArtifactId)
    const controller = new AbortController()
    const abort = () => controller.abort(signal?.reason ?? new Error('Studio generation cancelled'))
    if (signal?.aborted) abort()
    else signal?.addEventListener('abort', abort, { once: true })
    const promise = this.#run(artifact, workspace, sessionId, controller.signal, execution).finally(() => {
      signal?.removeEventListener('abort', abort)
      this.#tasks.delete(artifact.id)
    })
    this.#tasks.set(artifact.id, { controller, promise,sessionId:turn?.sessionId,turn:turn?.turn })
    void promise
```

</details>

**依据 4 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:465-497](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L465-L497)

选索引或文件、限制片段并调用模型。

<details>
<summary>查看原文（33行）</summary>

```text
      const focus = artifact.parameters.focus
      const query = focus || (artifact.kind === 'quiz' ? '核心概念 关键事实 原理 方法 注意事项' : '核心概念 定义 原理 要点 方法')
      const status = this.#manager.status ? await this.#manager.status(workspace) : { indexed: true }
      const task = this.#manager.task?.(workspace.id)
      const useIndex = status.indexed && !['scan', 'write'].includes(task?.phase)
      const evidenceLimit=Math.min(40,(Number(artifact.parameters.count)||6)*3)
      let evidence
      if (useIndex) {
        evidence = (await this.#manager.searchDetailed(workspace, query, { limit: evidenceLimit, pathPrefix:artifact.parameters.pathPrefix, signal })).results
        if (evidence.length < 4 && !artifact.parameters.pathPrefix) evidence = await this.#manager.sample(workspace, evidenceLimit)
      } else {
        evidence = await basicEvidence(this.#ctx.fs, workspace, query, { signal, pathPrefix:artifact.parameters.pathPrefix, limit: evidenceLimit })
      }
      await this.#store.update(artifact.id, { sourceMode: useIndex ? 'index' : 'files', sourceScope: `${useIndex ? '本地索引检索' : '按本次读取的资料生成，最多读取 48 个文件，不代表覆盖整个工作区'} · ${evidence.length} 条来源片段${artifact.parameters.pathPrefix ? ' · 范围：'+artifact.parameters.pathPrefix : ''}` })
      evidence = evidence.filter(item => item.evidenceId).slice(0, 40)
      if (!evidence.length) throw new Error(artifact.parameters.pathPrefix
        ? `输入资料范围 ${JSON.stringify(artifact.parameters.pathPrefix)} 内没有可引用内容。pathPrefix 是工作区内已有的输入文件或目录，不是 Studio 输出位置。请核对实际资料路径，修正或清空 pathPrefix 后用同一 artifactId 重试；不要改成其他成果类型。无需先建立索引。`
        : '当前工作区没有足够的可引用内容。请检查原始资料是否存在且可读取；无需先建立索引。')
      const bundle=createEvidenceBundle(evidence)
      evidence=bundle.evidence
      evidenceLabels=bundle.labels
      await this.#store.update(artifact.id, { phase: 'generate', processed: 1, total: 2 })
      const common = `输出语言：${artifact.parameters.language}。受众：${artifact.parameters.audience || '一般读者'}。难度：${artifact.parameters.difficulty || '适中'}。主题偏好：${focus || '覆盖工作区最重要的内容'}\n引用规则：引用为可选；没有对应来源就省略 evidenceIds，不要补造。evidenceIds 只能填写本次资料给出的短标签（例如 ["S1","S2"]）；不要生成或复制长哈希，不得猜测不存在的 S 编号。来源标签只放在 evidenceIds 中，正文不写编号。\n\nEvidence Bundle：\n${bundle.text}`
      let generated
      if (artifact.kind === 'quiz') {
        const difficulty = { easy: '基础', medium: '中等', hard: '进阶' }[artifact.parameters.difficulty]
        const result = await generateText(this.#ctx, {
          sessionId, signal, purpose: 'knowledge-studio-quiz',
          system: '你是严谨的学习测验编辑。只能使用 Evidence Bundle，不得编造事实或引用。干扰项应可信但可由证据明确排除。只输出严格 JSON，不调用工具。',
          prompt: `生成 ${artifact.parameters.count} 道${difficulty}难度的单选题。题目覆盖不同知识点，避免仅考文件名或无意义细节。${common}\n\n输出：{"title":"测验标题","questions":[{"question":"题干","options":["选项A","选项B","选项C","选项D"],"correctIndex":0,"explanation":"基于证据的解释","evidenceIds":["S1"]}]}。correctIndex 从 0 开始；资料较少时允许少于请求题数；只填写确有对应依据的 evidenceIds。`,
        })
        draftText=result.text;generation=result.generation??null
        generated = validateQuiz(bundle.restore(artifact.kind,result.text), evidence, artifact.parameters.count)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-knowledge-studio/lib/generation.js:17-20](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/generation.js#L17-L20)

模型依赖及缺失失败。

```text
async function generateText(ctx, { sessionId, system, prompt, signal, maxTokens, purpose = 'knowledge-studio', idleTimeoutMs = 90_000, preparedGeneration }) {
  const selection = preparedGeneration?.selection ?? modelSelection(ctx, sessionId)
  if (!selection || !ctx.llm?.stream) throw new Error('No DSH model is available for Studio generation')
  if (!Number.isFinite(idleTimeoutMs) || idleTimeoutMs <= 0) throw new Error('Invalid model stream idle timeout')
```

**依据 6 · 源码核查**：[packages/dsh-knowledge-studio/lib/generation.js:39-61](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/generation.js#L39-L61)

模型流、完成标记、空文本与截断检查。

<details>
<summary>查看原文（23行）</summary>

```text
    let terminalReceived = false
    const messages = [createUserMessage({
      content: [{ type: 'text', text: prompt }],
      source: { kind: 'plugin', plugin: 'dsh-knowledge-studio' },
    })]
    for await (const chunk of ctx.llm.stream({ ...selection, ...options, messages, system, sessionId, purpose, signal: controller.signal })) {
      controller.signal.throwIfAborted()
      activity()
      if (chunk.type === 'finish') terminalReceived = true
      assembler.push(chunk)
    }
    controller.signal.throwIfAborted()
    const finish = assembler.finish
    if (['error', 'aborted'].includes(finish?.kind)) throw Object.assign(new Error(`Studio model failed: ${diagnostic(finish.failure?.message ?? finish.failure ?? finish.kind)}`), { code: finish.kind === 'aborted' ? 'STUDIO_MODEL_ABORTED' : finish.failure?.code })
    const blocks = assembler.blocks()
    if (blocks.some(block => block.type === 'tool-call')) throw new Error('Studio generation must return text only')
    const text = blocks.filter(block => block.type === 'text').map(block => block.text).join('\n').trim()
    if (finish?.kind === 'max-tokens') throw outputLimitError(text, generation)
    if (!terminalReceived) throw Object.assign(new Error('模型连接结束时没有返回完成标记，成果尚未完成。'), { code: 'STUDIO_STREAM_INTERRUPTED' })
    if (!text) throw Object.assign(new Error(blocks.some(block => block.type === 'reasoning')
      ? '模型已结束，但只返回了推理内容，没有生成正文。请重试生成；这不表示资料上下文或输出额度已耗尽。'
      : '模型已结束，但没有返回正文。请重试生成；这不表示资料上下文或输出额度已耗尽。'), { code: 'STUDIO_EMPTY_OUTPUT' })
    return { text, selection, generation: { ...generation, finishKind: finish.kind, ...(assembler.usage ? { usage: assembler.usage } : {}) } }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:515-527](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L515-L527)

保存生成内容、引用与交互初态。

<details>
<summary>查看原文（13行）</summary>

```text
      const used = new Set(contentItems(generated).flatMap(item => item.evidenceIds))
      const citations = []
      for (const item of evidence.filter(value => used.has(value.evidenceId))) {
        const current = item.evidenceId.startsWith('file_') ? item : await this.#manager.readEvidence(workspace, item.evidenceId)
        if (current) citations.push(citationSnapshot(current))
      }
      const savedSources=new Set(citations.map(citation=>citation.evidenceId))
      for(const item of contentItems(generated))item.evidenceIds=item.evidenceIds.filter(id=>savedSources.has(id))
      const interaction = artifact.kind === 'quiz' ? { current: 0, answers: {}, revealed: {} } : { current: 0, flipped: false, grades: {} }
      const ready={...artifact,title:generated.title,content:generated,citations,interaction,generation}
      const officeFormat=officeFormatFor(artifact.kind)
      if(officeFormat)exportState={version:1,format:officeFormat,validatedContentHash:validateSavedOfficeContent(ready),validatedAt:now(),provider:execution?.agent&&this.#ctx.tools?.get({docx:'office_document',pptx:'office_presentation',xlsx:'office_spreadsheet'}[officeFormat])?'office-tools':'shared-office',phase:'running',attempts:1,lastAttemptAt:now()}
      await this.#store.update(artifact.id,{...ready,phase:'export',...(exportState?{exportState}:{})})
```

</details>

**依据 8 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:539-543](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L539-L543)

完成及失败记录。

```text
      signal.throwIfAborted()
      await this.#store.update(artifact.id, { status: 'completed', phase: 'done', processed: 2, total: 2, exports, message: '',...(exportState?{exportState:{...exportState,phase:'complete',completedAt:now()}}:{}) })
    } catch (error) {
      const partialText=error?.partialText||draftText
      await this.#store.failAttempt(artifact.id, { status: signal.aborted ? 'cancelled' : 'failed', phase: 'done', message: safeMessage(error),generation:error?.generation??generation,...(exportState?{exportState:{...exportState,phase:'failed',lastError:safeMessage(error),blocked:deniedExport(error)}}:{}),...(partialText?{draft:{text:partialText,format:'json',reason:exportState?'export':error?.code==='STUDIO_OUTPUT_LIMIT'?'output-limit':error?.partialText?'interrupted':'validation',generation:error?.generation??generation,evidenceLabels}}:{}) })
```

**依据 9 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:113-132](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L113-L132)

串行修改和未落盘失败状态。

<details>
<summary>查看原文（20行）</summary>

```text
  #mutate(operation, recoverTerminal=false) {
    const task = this.#tail.then(async () => {
      const state = clone(await this.#load())
      for(const artifact of state.artifacts)if(artifact.persistenceError) {
        delete artifact.persistenceError
        artifact.message='上次保存失败，任务已停止；失败记录现已恢复。'
      }
      const result = await operation(state)
      try {await this.#write(state)}
      catch(error) {
        if(!recoverTerminal)throw error
        // An executing task has ended but storage is still unavailable. Expose
        // an explicit unsaved terminal result, never an ownerless running task.
        result.persistenceError=safeMessage(error)
        result.message=`成果记录保存失败，任务已停止；当前失败状态尚未落盘。${safeMessage(error)}`
      }
      this.#state=state
      return clone(result)
    })
    this.#tail = task.catch(() => {})
```

</details>

**依据 10 · 源码核查**：[packages/dsh-knowledge-studio/lib/atomic-json.js:7-23](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/atomic-json.js#L7-L23)

临时文件换入与失败处理。

<details>
<summary>查看原文（17行）</summary>

```text
// to work around Windows readers, antivirus or indexing handles.
export async function writeAtomicJSON(path,state,{renameFile=rename,wait=sleep}={}) {
 const temporary=`${path}.${process.pid}.${randomUUID()}.tmp`
 try {
  await mkdir(dirname(path),{recursive:true})
  await writeFile(temporary,JSON.stringify(state,null,2)+'\n',{encoding:'utf8',mode:0o600,flag:'wx'})
  for(let attempt=0;;attempt++) {
   try {await renameFile(temporary,path);break}
   catch(error) {
    if(!['EPERM','EBUSY','EACCES'].includes(error.code)||attempt>=7)throw error
    await wait(Math.min(50*2**attempt,400))
   }
  }
 } catch(cause) {
  throw Object.assign(new Error(`Studio 成果记录保存失败（${cause.code||'IO'}），原文件已保留；请稍后重试。`,{cause}),{code:cause.code||'STUDIO_PERSISTENCE',persistenceFailure:true})
 } finally {await unlink(temporary).catch(()=>{})}
}
```

</details>

#### 缺口

- 未运行生成、故障注入或并发进程
  **影响**：不能证明目标环境可用、完整恢复或实际质量
  **进一步探讨**：隔离工作区用公开资料测试模型失败、存储中断和恢复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 题目格式和引用新鲜标记能证明答案正确并有原文支持吗？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

不能。validateQuiz 检查题干、选项、答案索引在范围内，并过滤不属于本次证据集合的 ID；引用允许为空，也没有检查题目或答案是否被片段语义支持。生成提示要求依据证据只是给模型的指令；合法索引并不证明真实正确。查看成果时，file_ 引用重新读取文件并比较内容摘要，索引引用则通过当前索引读取 evidence 并比较摘要；若实际文件变了而索引未刷新，索引相同仍可能标 fresh。使用者必须回读当前原文并人工核验每个题干、选项、答案和引用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:264-277](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L264-L277)

题目结构及可空证据 ID 过滤。

<details>
<summary>查看原文（14行）</summary>

```text
function validateQuiz(text, evidence, requested) {
  const parsed = parseJSON(text)
  const allowed = new Set(evidence.map(item => item.evidenceId))
  const questions = []
  for (const item of Array.isArray(parsed.questions) ? parsed.questions : []) {
    const options = Array.isArray(item?.options) ? item.options.map(option => typeof option==='string'?option.trim():'') : []
    const correctIndex = item?.correctIndex
    const evidenceIds = [...new Set(Array.isArray(item?.evidenceIds) ? item.evidenceIds.filter(id => allowed.has(id)) : [])]
    if (!String(item?.question ?? '').trim() || options.length < 2 || options.some(option=>!option) || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) continue
    questions.push({ id: `q${questions.length + 1}`, question: String(item.question).trim().slice(0, 800), options, correctIndex, explanation: String(item.explanation ?? '').trim().slice(0, 1200), evidenceIds })
    if (questions.length >= requested) break
  }
  if (!questions.length) throw new Error('模型未返回可作答的有效题目')
  return { title: String(parsed.title ?? '工作区测验').trim().slice(0, 120) || '工作区测验', questions }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:483-497](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L483-L497)

引用可选的提示与测验验证。

<details>
<summary>查看原文（15行）</summary>

```text
      const bundle=createEvidenceBundle(evidence)
      evidence=bundle.evidence
      evidenceLabels=bundle.labels
      await this.#store.update(artifact.id, { phase: 'generate', processed: 1, total: 2 })
      const common = `输出语言：${artifact.parameters.language}。受众：${artifact.parameters.audience || '一般读者'}。难度：${artifact.parameters.difficulty || '适中'}。主题偏好：${focus || '覆盖工作区最重要的内容'}\n引用规则：引用为可选；没有对应来源就省略 evidenceIds，不要补造。evidenceIds 只能填写本次资料给出的短标签（例如 ["S1","S2"]）；不要生成或复制长哈希，不得猜测不存在的 S 编号。来源标签只放在 evidenceIds 中，正文不写编号。\n\nEvidence Bundle：\n${bundle.text}`
      let generated
      if (artifact.kind === 'quiz') {
        const difficulty = { easy: '基础', medium: '中等', hard: '进阶' }[artifact.parameters.difficulty]
        const result = await generateText(this.#ctx, {
          sessionId, signal, purpose: 'knowledge-studio-quiz',
          system: '你是严谨的学习测验编辑。只能使用 Evidence Bundle，不得编造事实或引用。干扰项应可信但可由证据明确排除。只输出严格 JSON，不调用工具。',
          prompt: `生成 ${artifact.parameters.count} 道${difficulty}难度的单选题。题目覆盖不同知识点，避免仅考文件名或无意义细节。${common}\n\n输出：{"title":"测验标题","questions":[{"question":"题干","options":["选项A","选项B","选项C","选项D"],"correctIndex":0,"explanation":"基于证据的解释","evidenceIds":["S1"]}]}。correctIndex 从 0 开始；资料较少时允许少于请求题数；只填写确有对应依据的 evidenceIds。`,
        })
        draftText=result.text;generation=result.generation??null
        generated = validateQuiz(bundle.restore(artifact.kind,result.text), evidence, artifact.parameters.count)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:322-337](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L322-L337)

文件引用与索引引用的不同 fresh 路径。

<details>
<summary>查看原文（16行）</summary>

```text
  list(workspaceId) { return this.#store.list(workspaceId) }
  async read(artifactId, {attempt = false} = {}) {
    const stored = await this.#store.read(artifactId)
    const artifact = attempt ? stored : presentArtifact(stored)
    const workspace = this.#ctx.workspaceRegistry.get(artifact.workspaceId)
    if (!workspace || !artifact.citations?.length) return artifact
    const citations = []
    for (const citation of artifact.citations) {
      if (citation.evidenceId.startsWith('file_')) {
        citations.push({ ...citation, fresh: await verifyBasicCitation(this.#ctx.fs, workspace, citation) })
        continue
      }
      const current = await this.#manager.readEvidence(workspace, citation.evidenceId)
      citations.push({ ...citation, fresh: Boolean(current && current.revisionHash === citation.revisionHash && current.excerptHash === citation.excerptHash) })
    }
    return { ...artifact, citations }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-knowledge-studio/lib/basic-evidence.js:30-42](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/basic-evidence.js#L30-L42)

文件引用实时读取并比较内容摘要。

<details>
<summary>查看原文（13行）</summary>

```text
// Revalidate a persisted file citation without relying on an ephemeral index.
export async function verifyBasicCitation(fs, workspace, citation) {
  try {
    const root = await fs.resolve(workspace.path)
    const target = await fs.resolve(citation.path, { cwd: workspace.path })
    if (!fs.contains(root, target)) return false
    const stat = await fs.stat(target)
    const pdf = isSupportedPdfPath(citation.path)
    if (stat?.type !== 'file' || stat.size > (pdf ? 8 * 1024 * 1024 : 256 * 1024)) return false
    const text = pdf ? null : await fs.readText(target)
    const parsed = pdf ? await parsePdfBytes({ path: citation.path, bytes: await fs.readBytes(target, undefined, 8 * 1024 * 1024) }) : null
    return hash(text ?? JSON.stringify(parsed)) === citation.revisionHash
  } catch { return false }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-knowledge-studio/lib/manager.js:196-198](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/manager.js#L196-L198)

索引引用读取已有 store。

```text
  async readEvidence(workspace, evidenceId) {
    const store = await this.#store(workspace)
    return store ? store.readEvidence(evidenceId) : null
```

#### 缺口

- 没有教师逐题核验与陈旧索引实验
  **影响**：无法估计事实错误、无依据内容或误导率
  **进一步探讨**：修改已索引源文件，对照 fresh 标记及逐题事实核验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 加载、生成和保存分别依赖什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

源码包版本为 0.6.3，精确依赖 Artifact Services 0.3.2，Node 声明至少 24.18；README 的 0.6.0／0.3.0 属旧作者文案，不能直接作为当前包版本。Host 注入 workspace、fs、tools、模型及共享服务；manager 导入 store、store 静态导入 Ladybug 绑定，当前模块加载会按平台 require 对应 native 包，缺失或不支持的平台抛错，即使之后走无索引文件路径也不能假定无需该绑定。生成会把资料片段发给用户配置模型，费用及数据处理取决于实际服务；Office、音视频需要额外运行时。存储、模型费用和人工审校时间均未测量。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-knowledge-studio/package.json:1-14](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/package.json#L1-L14)

当前源码包版本和入口。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "@eduwork/dsh-knowledge-studio",
  "version": "0.6.3",
  "eduworkNotificationProtocol": 1,
  "dshKnowledgeStudio": {
    "capabilities": [
      "configurableSkills"
    ]
  },
  "description": "A workspace-native creation studio for DeepSeek Harness, with local source retrieval and AI-powered documents, learning tools, audio, and video.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/package.json:85-90](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/package.json#L85-L90)

平台 native 可选依赖声明。

```text
  "optionalDependencies": {
    "@ladybugdb/core-darwin-arm64": "0.20.1",
    "@ladybugdb/core-darwin-x64": "0.20.1",
    "@ladybugdb/core-linux-arm64": "0.20.1",
    "@ladybugdb/core-linux-x64": "0.20.1",
    "@ladybugdb/core-win32-x64": "0.20.1"
```

**依据 3 · 源码核查**：[packages/dsh-knowledge-studio/package.json:187-188](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/package.json#L187-L188)

Node 版本声明。

```text
  "engines": {
    "node": ">=24.18.0"
```

**依据 4 · 源码核查**：[packages/dsh-knowledge-studio/package.json:203-210](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/package.json#L203-L210)

许可及共享包版本。

```text
  "license": "MulanPSL-2.0 AND MIT",
  "dependencies": {
    "playwright-core": "^1.63.0",
    "react-dom": "18.3.1",
    "remark-gfm": "4.0.1",
    "remark-parse": "11.0.0",
    "unified": "11.0.5",
    "@eduwork/dsh-artifact-services": "0.3.2"
```

**依据 5 · 源码核查**：[packages/dsh-knowledge-studio/lib/index.js:15-28](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/index.js#L15-L28)

Host 注入与共享服务。

<details>
<summary>查看原文（14行）</summary>

```text
export class KnowledgeStudioService extends TypertRemoteService {
  static Config = Config
  static inject = ['tools', 'workspaceRegistry', 'fs', 'settings', 'skills', 'llm', 'agents', 'agentDefaultModel', 'artifactServices']

  constructor(ctx, config = {}) {
    super(ctx, 'knowledgeStudio')
    this.settingsScope = typeof ctx.settings.register === 'function'
      ? ctx.settings.register(SETTINGS_NAMESPACE, KnowledgeStudioSettingsSchema, {
        base: mergeDefaultSettings(config), applies: 'live', validate: validateSettings,
      })
      : { get: () => liveSettings(config) }
    this.manager = new KnowledgeIndexManager(ctx, config)
    this.mediaProviders = ctx.artifactServices.media
    this.artifacts = new ArtifactEngine(ctx, this.manager, {...config,mediaProviders:this.mediaProviders})
```

</details>

**依据 6 · 源码核查**：[packages/dsh-knowledge-studio/lib/manager.js:4-7](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/manager.js#L4-L7)

manager 静态导入 store。

```text
import { dshHomePath } from '@deepseek-ai/dsh-home-paths'
import { scanWorkspace } from './indexer.js'
import { INDEX_FORMAT_VERSION, WorkspaceKnowledgeStore } from './store.js'
import { TaskJournal } from './task-journal.js'
```

**依据 7 · 源码核查**：[packages/dsh-knowledge-studio/lib/store.js:1-5](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/store.js#L1-L5)

store 静态导入 native 封装。

```text
import { createHash } from 'node:crypto'
import { dirname } from 'node:path'
import { mkdir } from 'node:fs/promises'
import { Database, Connection } from './ladybug.js'
import { parseDocument } from './parser.js'
```

**依据 8 · 源码核查**：[packages/dsh-knowledge-studio/lib/ladybug.js:13-32](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/ladybug.js#L13-L32)

平台选择及绑定缺失失败。

<details>
<summary>查看原文（20行）</summary>

```text
const platformKey = `${process.platform}-${process.arch}`
const packageName = platformPackages[platformKey]

if (!packageName) {
  throw new Error(
    `dsh-knowledge-studio does not support LadybugDB on ${platformKey}. ` +
    `Supported platforms: ${Object.keys(platformPackages).join(', ')}`,
  )
}

let binding
try {
  binding = require(packageName)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  throw new Error(
    `LadybugDB runtime ${packageName} is unavailable for ${platformKey}. ` +
    `Reinstall dsh-knowledge-studio with optional dependencies enabled. ${message}`,
    { cause: error },
  )
```

</details>

**依据 9 · 作者声明**：[packages/dsh-knowledge-studio/README.md:63-69](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/README.md#L63-L69)

额外运行时与模型外发作者说明。

```text
Office 需要另行准备 Python 3.12+ 和共享包的 `python/requirements.txt`，以 `DSH_OFFICE_PYTHON` 指向解释器。PDF、视频使用 Chromium；可注入已准备的运行时，独立渲染首次使用可准备 Remotion 浏览器；Studio 的能力检查本身不会下载组件，离线使用须事先配置。共享媒体运行时固定 Remotion `4.0.520`、mediabunny `1.55.5`、React/React DOM `18.3.1`。Windows System.Speech 和 macOS 系统 say 可使用本机已安装的音色离线配音；其他系统或厂商可通过统一接口注册语音提供方。音频转写通过共享 ASR 服务扩展，本地 whisper.cpp 可执行文件与模型需宿主另行准备，不随 npm 包分发。详见 [扩展接口](docs/ARCHITECTURE.md)。

## 开发与边界

[开发和测试](docs/DEVELOPMENT.md) · [架构](docs/ARCHITECTURE.md) · [迁移](docs/MIGRATION.md) · [版本记录](CHANGELOG.md) · [发布流程](https://github.com/ecnu/EduWork/blob/main/packages/dsh-knowledge-studio/docs/RELEASING.md)

索引和检索在本机运行。生成报告或媒体脚本会调用用户配置的模型并发送所需资料；费用和数据处理由该模型服务决定。打开 Studio 不会自动扫描全工作区或启动模型任务。
```

#### 缺口

- 未在目标系统安装构建或核实服务收费
  **影响**：不能确认实际平台兼容、费用及数据政策
  **进一步探讨**：确认运行时和模型服务许可后，以公开资料在隔离环境试用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何安全评估一份测验草稿并何时退出？

**研究主题**：采用判断、效果与总成本

#### 完整回答

已有兼容宿主和模型、可使用公开资料且能逐题审校的教师，可先选择一份短文档，生成小批测验，并分别核对来源版本、题目、答案和干扰项。调用者还须确认模型外发及存储权限，记录模型调用费用与人工审核和重试时间；格式校验与可交互不构成教学质量验收。若来源与当前文件不符、题目或答案无原文支持、服务权限或费用超出约定，或返工超过手工方式，应停止扩展生成，保留需要的资料和成果，回到普通对话及人工制卡。退出前应按实际部署核对保存位置与残留，本次未验证完整卸载。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:465-482](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L465-L482)

资料选择及缺乏来源时拒绝。

<details>
<summary>查看原文（18行）</summary>

```text
      const focus = artifact.parameters.focus
      const query = focus || (artifact.kind === 'quiz' ? '核心概念 关键事实 原理 方法 注意事项' : '核心概念 定义 原理 要点 方法')
      const status = this.#manager.status ? await this.#manager.status(workspace) : { indexed: true }
      const task = this.#manager.task?.(workspace.id)
      const useIndex = status.indexed && !['scan', 'write'].includes(task?.phase)
      const evidenceLimit=Math.min(40,(Number(artifact.parameters.count)||6)*3)
      let evidence
      if (useIndex) {
        evidence = (await this.#manager.searchDetailed(workspace, query, { limit: evidenceLimit, pathPrefix:artifact.parameters.pathPrefix, signal })).results
        if (evidence.length < 4 && !artifact.parameters.pathPrefix) evidence = await this.#manager.sample(workspace, evidenceLimit)
      } else {
        evidence = await basicEvidence(this.#ctx.fs, workspace, query, { signal, pathPrefix:artifact.parameters.pathPrefix, limit: evidenceLimit })
      }
      await this.#store.update(artifact.id, { sourceMode: useIndex ? 'index' : 'files', sourceScope: `${useIndex ? '本地索引检索' : '按本次读取的资料生成，最多读取 48 个文件，不代表覆盖整个工作区'} · ${evidence.length} 条来源片段${artifact.parameters.pathPrefix ? ' · 范围：'+artifact.parameters.pathPrefix : ''}` })
      evidence = evidence.filter(item => item.evidenceId).slice(0, 40)
      if (!evidence.length) throw new Error(artifact.parameters.pathPrefix
        ? `输入资料范围 ${JSON.stringify(artifact.parameters.pathPrefix)} 内没有可引用内容。pathPrefix 是工作区内已有的输入文件或目录，不是 Studio 输出位置。请核对实际资料路径，修正或清空 pathPrefix 后用同一 artifactId 重试；不要改成其他成果类型。无需先建立索引。`
        : '当前工作区没有足够的可引用内容。请检查原始资料是否存在且可读取；无需先建立索引。')
```

</details>

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:264-277](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L264-L277)

题目只作结构与索引检查。

<details>
<summary>查看原文（14行）</summary>

```text
function validateQuiz(text, evidence, requested) {
  const parsed = parseJSON(text)
  const allowed = new Set(evidence.map(item => item.evidenceId))
  const questions = []
  for (const item of Array.isArray(parsed.questions) ? parsed.questions : []) {
    const options = Array.isArray(item?.options) ? item.options.map(option => typeof option==='string'?option.trim():'') : []
    const correctIndex = item?.correctIndex
    const evidenceIds = [...new Set(Array.isArray(item?.evidenceIds) ? item.evidenceIds.filter(id => allowed.has(id)) : [])]
    if (!String(item?.question ?? '').trim() || options.length < 2 || options.some(option=>!option) || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) continue
    questions.push({ id: `q${questions.length + 1}`, question: String(item.question).trim().slice(0, 800), options, correctIndex, explanation: String(item.explanation ?? '').trim().slice(0, 1200), evidenceIds })
    if (questions.length >= requested) break
  }
  if (!questions.length) throw new Error('模型未返回可作答的有效题目')
  return { title: String(parsed.title ?? '工作区测验').trim().slice(0, 120) || '工作区测验', questions }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:210-230](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L210-L230)

完成后保存答题与卡片交互。

<details>
<summary>查看原文（21行）</summary>

```text
  interaction(artifactId, action, itemId, value) {
    return this.#mutate(state => {
      const artifact = state.artifacts.find(item => item.id === artifactId)
      if (!artifact) throw new Error(`Unknown Studio artifact: ${artifactId}`)
      if (artifact.status !== 'completed') throw new Error('Artifact generation is not complete')
      const length = artifact.kind === 'quiz' ? artifact.content?.questions?.length : artifact.content?.cards?.length
      const interaction = artifact.interaction && typeof artifact.interaction === 'object' ? artifact.interaction : {}
      if (action === 'reset') {
        artifact.interaction = artifact.kind === 'quiz' ? { current: 0, answers: {}, revealed: {} } : { current: 0, flipped: false, grades: {} }
      } else if (action === 'current') {
        artifact.interaction = { ...interaction, current: Math.max(0, Math.min(Math.max(0, Number(length) - 1), Number(value) || 0)), ...(artifact.kind === 'flashcards' ? { flipped: false } : {}) }
      } else if (artifact.kind === 'quiz' && action === 'answer') {
        artifact.interaction = { ...interaction, answers: { ...(interaction.answers ?? {}), [itemId]: Math.max(0, Number(value) || 0) } }
      } else if (artifact.kind === 'quiz' && action === 'reveal') {
        if (interaction.answers?.[itemId] == null) throw new Error('Choose an answer first')
        artifact.interaction = { ...interaction, revealed: { ...(interaction.revealed ?? {}), [itemId]: true } }
      } else if (artifact.kind === 'flashcards' && action === 'flip') {
        artifact.interaction = { ...interaction, flipped: Boolean(value) }
      } else if (artifact.kind === 'flashcards' && action === 'grade') {
        artifact.interaction = { ...interaction, flipped: false, grades: { ...(interaction.grades ?? {}), [itemId]: value === true } }
      } else throw new Error(`Unsupported artifact interaction: ${action}`)
```

</details>

**依据 4 · 作者声明**：[packages/dsh-knowledge-studio/README.md:67-73](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/README.md#L67-L73)

模型外发与格式环境边界。

```text
[开发和测试](docs/DEVELOPMENT.md) · [架构](docs/ARCHITECTURE.md) · [迁移](docs/MIGRATION.md) · [版本记录](CHANGELOG.md) · [发布流程](https://github.com/ecnu/EduWork/blob/main/packages/dsh-knowledge-studio/docs/RELEASING.md)

索引和检索在本机运行。生成报告或媒体脚本会调用用户配置的模型并发送所需资料；费用和数据处理由该模型服务决定。打开 Studio 不会自动扫描全工作区或启动模型任务。

对话与 Studio 复用同一套 Office、语音、媒体生成和真实文件预览服务。Studio 保留资料引用与学习交互；可编辑 React 视频工程等高级操作由对话工具提供，并非每个对话工具都有 Studio 卡片。

Office 处理支持文档中列出的结构化功能，不承诺完整 Office 排版、宏或演示动画编辑；公式重算复用官方 LibreOffice Kit。字幕按实际语音片段同步，不承诺逐字时间戳。可编辑视频工程会执行工作区 React 代码，只应渲染可信工程。
```

#### 缺口

- 未测总费用、人时和真实学生结果
  **影响**：不能确定净效益或适合批量使用
  **进一步探讨**：以同一文档比较人工制卡、错误率、模型费用与审核时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 活源比对加条目级审核能否改善草稿可信度？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可提出未验证假设：生成后先将每条引用与当前文件重新比对，再由教师逐题确认题干、答案和干扰项是否受引用支持，且把确认绑定内容版本；源文件或题目变化时将确认标为需复核。相对现有仅校验 ID 与索引摘要，此流程可能减少陈旧或无依据题目，但增加模型或人工成本，且实时内容读取与权限管理需明确。对照现有人工审校和当前流程，以相同题目比较误通过率、遗漏和总人时；若现有方式已等效或成本超过收益，则不引入额外机制。没有原型或试验，不能计为现有功能。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:264-277](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L264-L277)

结构和引用过滤的现有边界。

<details>
<summary>查看原文（14行）</summary>

```text
function validateQuiz(text, evidence, requested) {
  const parsed = parseJSON(text)
  const allowed = new Set(evidence.map(item => item.evidenceId))
  const questions = []
  for (const item of Array.isArray(parsed.questions) ? parsed.questions : []) {
    const options = Array.isArray(item?.options) ? item.options.map(option => typeof option==='string'?option.trim():'') : []
    const correctIndex = item?.correctIndex
    const evidenceIds = [...new Set(Array.isArray(item?.evidenceIds) ? item.evidenceIds.filter(id => allowed.has(id)) : [])]
    if (!String(item?.question ?? '').trim() || options.length < 2 || options.some(option=>!option) || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) continue
    questions.push({ id: `q${questions.length + 1}`, question: String(item.question).trim().slice(0, 800), options, correctIndex, explanation: String(item.explanation ?? '').trim().slice(0, 1200), evidenceIds })
    if (questions.length >= requested) break
  }
  if (!questions.length) throw new Error('模型未返回可作答的有效题目')
  return { title: String(parsed.title ?? '工作区测验').trim().slice(0, 120) || '工作区测验', questions }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:322-337](https://github.com/ECNU/EduWork/blob/0e7821994002f4142298b72d72577e79c16db506/packages/dsh-knowledge-studio/lib/artifacts.js#L322-L337)

文件及索引引用新鲜度差异。

<details>
<summary>查看原文（16行）</summary>

```text
  list(workspaceId) { return this.#store.list(workspaceId) }
  async read(artifactId, {attempt = false} = {}) {
    const stored = await this.#store.read(artifactId)
    const artifact = attempt ? stored : presentArtifact(stored)
    const workspace = this.#ctx.workspaceRegistry.get(artifact.workspaceId)
    if (!workspace || !artifact.citations?.length) return artifact
    const citations = []
    for (const citation of artifact.citations) {
      if (citation.evidenceId.startsWith('file_')) {
        citations.push({ ...citation, fresh: await verifyBasicCitation(this.#ctx.fs, workspace, citation) })
        continue
      }
      const current = await this.#manager.readEvidence(workspace, citation.evidenceId)
      citations.push({ ...citation, fresh: Boolean(current && current.revisionHash === citation.revisionHash && current.excerptHash === citation.excerptHash) })
    }
    return { ...artifact, citations }
```

</details>

#### 缺口

- 没有条目级确认原型与对照实验
  **影响**：无法判断实际误通过率及额外负担
  **进一步探讨**：比较直接人工审校、现有流程和候选方案，记录版本变更后的结果。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
