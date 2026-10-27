# OpenWrite

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[8c5297d](https://github.com/LiPu-jpg/Openwrite/tree/8c5297da5726f35895f86b6e457da40b7e544ea4)

<!-- BEGIN META -->
[![GitHub ★ 884](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=884&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LiPu-jpg/Openwrite) [![npm 30d 6,332](https://img.shields.io/static/v1?label=npm+30d&message=6%2C332&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openwrite) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openwrite)
<!-- END META -->

> **功能**：在 DSH 中规划、写作、审稿和管理长篇小说，作品保存在本地目录。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示贡献在于把本地小说领域后端、可信作品上下文和DSH对话/工作台组织为持续创作流程。桥层不把上游Core与DSH能力算为自身算法原创；相对手工文件管理有机制上的交接改善，写作质量与节时未知。

> **主要限制**：[Q03](#research-q03) 补查Core确认已有项目锁、revision校验、恢复前checkpoint和drafted run续接，不能再把恢复能力写成缺失。关键质疑收窄为模型响应、正文替换和任务结算之间的跨步骤中断一致性；源码可见保护不等于全故障点无重复或无丢稿保证。

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
  - [Q01 · 小说作者为何使用领域工作台而非通用对话？](#detail-section-11)
  - [Q02 · 请求怎样绑定作品与写操作权限？](#detail-section-12)
  - [Q03 · 环境恢复等于写作任务安全恢复吗？](#detail-section-13)
  - [Q04 · 怎样限定作者试用成本与退出？](#detail-section-14)
  - [Q05 · 任务重试前核对稿件版本是否值得增加？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要持续管理设定、大纲和正文的长篇作者，可在作品副本上试做完整章节流程。

通用DSH对话加人工Markdown管理无需领域后端，但作品资料、审稿与导出由作者接线。OpenWrite Core是领域能力来源，桥层贡献按集成评估，未证明优于所有写作工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 创作预设 | 建立小说领域会话入口 | 依赖匹配DSH；历史别名不代表新模型 |
| 作品桥接 | 绑定工作区并调用Studio领域动作 | 权限与Core契约必需 |
| 托管运行时 | 准备固定环境、检查健康及清理子进程 | 环境恢复不等同任务恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 精确兼容DSH与Node>=22.19 | 是 | 会话、工具和工作台 | 按发布兼容表回退 |
| managed运行时或外部Studio | 是 | 小说领域动作 | 停止写入，重试准备 |
| 模型配置 | 生成/评审必需 | 生成文本及评审 | 只能检查环境与管理素材 |
| 作品副本与备份 | 试用必需 | 隔离错误与回退 | 不在唯一原稿试写 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份并选择匹配发行 | 不自动升级宿主 |
| 启动 | 工作台准备运行时并选作品副本 | 健康与版本匹配 |
| 创作 | 配模型预算并试做一章 | 作者可核查和编辑 |
| 恢复 | 核对任务与已有稿后显式重试 | 状态不清则停止回退 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载固定uv、Python与依赖，资源量未知 | 备份、匹配宿主和配置模型，耗时未知 | 需要联网与磁盘 |
| 持续 | 聊天、生成和评审API费用未知 | 维护设定并校稿，时间未知 | 不同模型分别计费 |
| 恢复与退出 | 重复生成可能再计费 | 核对任务、稿件与备份 | 环境恢复不会自动续跑写作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 作品接线 | 可信工作区和请求上下文 | 全部生成handler及中断点是否一致 |
| 环境恢复 | 代际环境、稿件checkpoint与任务续接 | 真实平台故障恢复表现 |
| 创作产出 | 领域操作与工作台集成 | 质量、连续性、节时和单位成本 |

> **思考**：[Q03](#research-q03) 补查Core确认已有项目锁、revision校验、恢复前checkpoint和drafted run续接，不能再把恢复能力写成缺失。关键质疑收窄为模型响应、正文替换和任务结算之间的跨步骤中断一致性；源码可见保护不等于全故障点无重复或无丢稿保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示贡献在于把本地小说领域后端、可信作品上下文和DSH对话/工作台组织为持续创作流程。桥层不把上游Core与DSH能力算为自身算法原创；相对手工文件管理有机制上的交接改善，写作质量与节时未知。

[Q03](#research-q03)代际环境、锁、完成标记与健康版本校验值得复用，根preset摘要拒绝覆盖用户修改也有明确所有权。移植需兼容宿主生命周期、Core契约和多平台进程停止；不能只搬运下载器便承诺任务恢复。 Core额外核查见[Q03](#research-q03)：显式确认、版本冲突、恢复前checkpoint和任务重试携带已完成状态可复用；移植还需保证各生成handler遵循这些状态，不能只复用存储器。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 补查Core确认已有项目锁、revision校验、恢复前checkpoint和drafted run续接，不能再把恢复能力写成缺失。关键质疑收窄为模型响应、正文替换和任务结算之间的跨步骤中断一致性；源码可见保护不等于全故障点无重复或无丢稿保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先备份作品，在副本完成单章从规划到导出，分别设定聊天、生成和评审预算。恢复后先核对已保存正文与任务状态；无法辨认写入范围、发生串作品或预算失控时停止并使用备份。只建议有试用，不把作者的旧版验收当成本轮宿主验证。

采用建议：[Q04](#research-q04) 先备份作品，在副本完成单章从规划到导出，分别设定聊天、生成和评审预算。恢复后先核对已保存正文与任务状态；无法辨认写入范围、发生串作品或预算失控时停止并使用备份。只建议有试用，不把作者的旧版验收当成本轮宿主验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查DSH桥、工作区接线、工具策略、托管运行时，并从固定Git wheel只读解包核对Core请求路由、稿件版本恢复与任务续接。未执行目标代码或故障实验；当前0.2.28为未发布候选。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、plugin.mjs、packages/openwrite-bridge/src/index.ts、packages/openwrite-bridge/src/client.ts、packages/openwrite-bridge/src/tool-policy.ts、packages/openwrite-bridge/src/managed-runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的DSH集成、桥层、托管运行时及固定Core wheel内请求上下文、正文恢复与任务续接源码；只读解包，未执行插件、模型、目标测试或故障实验。
- 下一步：对同一作品副本固定模型和预算记录完整章节流程，检查稿件版本、失败重试及成本；恢复核对假设以重复/覆盖错误和人工时间为判断，不安排本轮执行。

**分析版本**

- **仓库**：[LiPu-jpg/Openwrite](https://github.com/LiPu-jpg/Openwrite)
- **版本号**：0.2.28（[固定提交 8c5297d](https://github.com/LiPu-jpg/Openwrite/tree/8c5297da5726f35895f86b6e457da40b7e544ea4)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将未来假设收窄为权威续接状态的一致性预览，复用Core已有drafted run和completed清单，不把续接本身当新功能。先排除现有界面已等价展示，再比较作者在故障场景下的错误重试及额外确认；无改善则否定。

对同一作品副本固定模型和预算记录完整章节流程，检查稿件版本、失败重试及成本；恢复核对假设以重复/覆盖错误和人工时间为判断，不安排本轮执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 104 | 10227 | — | — | 157440 |
| .mjs | source | 32 | 4652 | 4189 | 266 | — |
| .mjs | test | 12 | 3218 | 2538 | 563 | — |
| .ts | source | 37 | 14806 | 13511 | 695 | — |
| .ts | test | 15 | 1491 | 1308 | 93 | — |
| .tsx | test | 22 | 6734 | 6045 | 148 | — |
| .tsx | source | 27 | 13278 | 12198 | 481 | — |
| .js | source | 5 | 170 | 150 | 5 | — |

</details>

**活跃度**

[![近30天新建 53](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=53&color=737b86&logo=github)](https://github.com/LiPu-jpg/Openwrite/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 52](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=52&color=737b86&logo=github)](https://github.com/LiPu-jpg/Openwrite/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH中的本地小说工作台怎样组合领域后端、作品上下文和恢复机制，能否支持作者有限试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 小说作者为何使用领域工作台而非通用对话？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者需要持续管理人物、设定、大纲、正文、审稿与导出；合格结果是自己复核过且可以继续编辑的本地作品，而不是一次模型回复。README把DSH定义为Agent与界面提供者，OpenWrite Core负责领域逻辑，bridge明确是HTTP薄桥。相对聊天加手工Markdown管理，项目把作品目录、专用操作与工作台放在同一流程，能减少跨工具搬运的结构性摩擦；没有作者任务对照，不能说小说质量或速度已经改善。当前源码包版本0.2.28而README明确未发布，因此不能把候选源码研究说成已发布0.2.27包的独立验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-38](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/README.md#L27-L38)

明确产品分工以及候选/发布边界。

<details>
<summary>查看原文（12行）</summary>

```text
这是 [OpenWrite](https://github.com/LiPu-jpg/Openwrite/tree/native-core) 的 dsh 插件版本。
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 提供 Agent 与交互界面，OpenWrite Core 提供小说领域能力；人物、设定、大纲、正文和评审保存在本地作品目录。

## 开发中：0.2.28（未发布）

Core 5.8.19 候选补修已合并，22 项 CI 全部通过；修复 CRLF/emoji 选区坐标，以及中断升级恢复和损坏安装包缓存重试，见 [选区与升级补修](docs/SELECTION_UPGRADE_REPAIRS.md)。前轮修复及 #123 的 Windows 回执见 [回复补修记录](docs/ISSUE_123_FOLLOWUP.md)。剩余宿主正式发布与 Android/Termux 实机两项继续跟踪，本轮不发布；下面的 npm/GitHub 安装入口仍为已发布的 0.2.27。

## 0.2.27

工作台新增 OpenCode Go Console 认证，捆绑 Core 5.8.16，自动读取本机官方 CLI 的有效凭据和工作区信息；不必手工复制会过期的 Console 令牌。评审首次调用遵守模型输出预算，补充旧会话永久别名和跨平台回归。真实工作台连接测试、流式写作及 Go 安全评审已通过。见 [OpenCode Go 接入](docs/OPENCODE_GO.md) 和 [旧报告复核与待办](docs/CLOSED_ISSUE_FOLLOWUPS.md)。正式发行状态、各平台验收和安装包校验值见 [发布验收](docs/RELEASE_ACCEPTANCE.md)。

[GitHub 0.2.27](https://github.com/LiPu-jpg/Openwrite/releases/tag/v0.2.27) 与 [npm 0.2.27](https://www.npmjs.com/package/dsh-openwrite/v/0.2.27) 均已发布，`@latest` 已更新到 0.2.27。两处公开下载包均与 CI 验收包逐字节一致，可使用下方安装命令获取本次修复。
```

</details>

**依据 2 · 作者声明**：[README.md:118-140](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/README.md#L118-L140)

实际使用入口、领域操作及模型配置。

<details>
<summary>查看原文（23行）</summary>

```text
## 开始使用

1. 执行 `dsh web`，打开它给出的浏览器地址，点击侧栏 **OpenWrite**。等待环境就绪后，选择作品目录。
2. 入口自动建立 **OpenWrite 创作** 会话；点击 **创作** 即可打开工作台，无需先发消息。对话模型在 dsh 中配置；小说生成与评审模型在「任务 → 模型」配置。
3. 和 Agent 讨论题材、人物与大纲，确认后再开始写章。已有旧稿可通过「任务 → 导入与导出」接入。

| 日常操作 | 入口 |
|---|---|
| 看进度、继续写作 | `/progress`、`/write-next` |
| 审稿、修改选段 | `/review-chapter`、`/revise-span` |
| 查伏笔、设定与写法记忆 | `/foreshadow`、`/canon`、`/learn` |
| 导出成稿 | `/export-book` 或「任务 → 导入与导出」 |

已有会话不会自动切换预设。详细操作与工作区规则见 [使用流程](docs/WORKFLOWS.md)。

**界面语言**：面板已内置中文与英文词典，跟随 dsh 语言设置。切换方法：Settings → General → Language → English（选择后存为 `locale.preference`）。Agent 的 persona 和所有技能入口要求用作者的对话语言回复；运行环境与任务状态提供英文，Studio 报错附带英文说明和稳定错误码。已有作品内容不会自动翻译，正文按作者指定的语言生成。

## 配置模型

安装和环境健康检查不需要模型 API Key，也不会调用写作模型。与 Agent 对话、生成章节和审稿需要可用的模型配置；使用收费服务商时会产生 API 费用。

- **对话模型**：在 dsh 宿主中配置，用于 OpenWrite 创作会话。
- **小说生成、评审与测试模型**：在「任务 → 模型」添加服务商，按服务商提供的信息填写模型名、接口地址和 API Key。不要把密钥粘贴到对话、作品正文或 Git 仓库。
```

</details>

**依据 3 · 源码核查**：[packages/openwrite-bridge/src/index.ts:2-6](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/packages/openwrite-bridge/src/index.ts#L2-L6)

桥层不拥有小说领域核心实现。

```text
/**
 * `@dsh-novel/openwrite-bridge`: a dsh plugin registering `novel_*` tools that
 * call the local OpenWrite Studio HTTP action surface. dsh owns agent
 * orchestration; OpenWrite owns the novel domain logic; this package is a thin
 * bridge over the HTTP contract only.
```

#### 缺口

- 小说质量及作者持续使用反馈未独立核查
  **影响**：不能以功能齐全推导写作收益
  **进一步探讨**：用同一大纲和章节任务比较通用对话与工作台的修订量、交接和可继续编辑性

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求怎样绑定作品与写操作权限？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

bridge根据每次请求懒读取宿主workspaceRegistry，把可信工作区ID解析为路径；注册表不可用时返回null交给domain拒绝。HTTP入口先经过宿主connection的requestRejection，未有连接服务则503。client的WorkspaceContext以规范化绝对路径为身份，ID与epoch仅为诊断；因此多个工作区不应靠浏览器自报路径切换。工具策略将只读、生成、写入分类，未知操作按写处理，计划模式与只读沙箱阻止变更。由此可以支持“先讨论再修改”的接线设计，但不能把这段策略直接等同Core所有写入路径已穷尽审计。标准bundle使用managed运行时，external模式需要自行维护Studio及token。

#### 证据与依据

**依据 1 · 源码核查**：[packages/openwrite-bridge/src/index.ts:46-89](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/packages/openwrite-bridge/src/index.ts#L46-L89)

宿主注册表解析、身份拒绝、managed/external选择及控制路由。

<details>
<summary>查看原文（44行）</summary>

```text
export function apply(ctx: Context, config: Config) {
  // The web host process mounts ctx.workspaceRegistry. Resolve it lazily on
  // every call: plugin start order must not strand the lookup, an absent
  // registry (null) fails closed in the domain, and ctx.inject(['webServer',
  // ...]) would silently never fire if we inject-required a second service.
  const resolveWorkspace = (workspaceId: string): string | undefined | null => {
    const registry = ctx.get('workspaceRegistry')
    if (registry === undefined) return null
    return registry.get(workspaceId as WorkspaceId)?.path
  }
  // A supplied legacy baseUrl remains external; the standard bundle selects managed explicitly.
  const runtime = config.mode === 'managed' ? new ManagedRuntime(
    config.runtimeRoot ?? join(process.env['DSH_HOME']?.trim() || join(homedir(), '.dsh'), 'openwrite'),
    config.artifacts ?? fileURLToPath(new URL('../../../release/', import.meta.url)),
  ) : undefined
  const authorizeRequest = (headers: Record<string, string | string[] | undefined>): number | undefined => {
    const connection = ctx.get('connection')
    return connection ? connection.requestRejection({ headers }) : 503
  }
  const domain = new NovelDomainService(ctx, { authorizeRequest, baseUrl: config.baseUrl, timeoutMs: config.timeoutMs, outputDir: config.outputDir, resolveWorkspace,
    ...(runtime ? { connect: () => runtime.ensure() }
      : config.authToken ? { connect: async () => ({ baseUrl: config.baseUrl, token: config.authToken }) } : {}),
  })
  ctx.effect(() => () => runtime?.dispose(), 'openwrite: owned runtime cleanup')
  ctx.inject(['webServer'], webCtx => webCtx.effect(() => webCtx.webServer.register({
    kind: 'exact', path: '/studio-panel/runtime', handler: async (req, res) => {
      const respond = (code: number, data: unknown) => { res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(data)) }
      const rejection = authorizeRequest(req.headers)
      if (rejection !== undefined) { respond(rejection, { error: 'dsh browser authentication required', message: 'dsh browser authentication required', code: 'AUTHENTICATION_REQUIRED' }); return }
      if (req.method === 'GET') { respond(200, runtime?.status() ?? { phase: 'ready', message: 'Using an external writing environment' }); return }
      if (req.method !== 'POST' || req.headers['x-openwrite-studio'] !== '1') { respond(405, { error: 'Method not allowed', message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }); return }
      const chunks: Buffer[] = []
      let size = 0
      for await (const chunk of req) { size += chunk.length; if (size > 1024) { respond(413, { error: 'Request too large', message: 'Request too large', code: 'REQUEST_TOO_LARGE' }); return }; chunks.push(Buffer.from(chunk)) }
      try {
        const action = JSON.parse(Buffer.concat(chunks).toString()).action
        if (action === 'cancel') await runtime?.cancel()
        else if (action === 'prepare' || action === 'retry') void runtime?.ensure().catch(() => {})
        else { respond(400, { error: 'Unknown action', message: 'Unknown action', code: 'INVALID_ACTION' }); return }
        respond(202, runtime?.status() ?? { phase: 'ready' })
      } catch { respond(400, { error: 'Invalid request', message: 'Invalid request', code: 'INVALID_INPUT' }) }
    },
  }), 'openwrite: runtime controls'))
  ctx.inject(['webServer'], webCtx => domain.registerWebRoutes(webCtx))
```

</details>

**依据 2 · 源码核查**：[packages/openwrite-bridge/src/client.ts:35-56](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/packages/openwrite-bridge/src/client.ts#L35-L56)

工作区路径编码与请求级身份契约。

<details>
<summary>查看原文（22行）</summary>

```text
/** HTTP header values are bytes, so Unicode paths need explicit wire encoding.
 * Plain ASCII retains the old contract, including literal percent characters. */
export function workspaceRootHeaders(root: string, lowercase = false): Record<string, string> {
  const name = lowercase ? 'x-openwrite-workspace-root' : 'X-OpenWrite-Workspace-Root'
  return /[^\x20-\x7e]/.test(root)
    ? { [name]: encodeURIComponent(root), [name + (lowercase ? '-encoding' : '-Encoding')]: 'uri' }
    : { [name]: root }
}

/**
 * Request-scoped Workspace identity, per docs/WORKSPACE_CONTEXT_CONTRACT.md §3.
 * `workspaceRoot` is the canonical (realpath'd) absolute path — the only root
 * identity; the id/epoch fields are audit/diagnostic metadata.
 */
export interface WorkspaceContext {
  workspaceRoot: string
  workspaceId?: string
  sessionId?: string
  contextEpoch?: number
  toolCallId?: string
  rootCallId?: string
  toolName?: string
```

</details>

**依据 3 · 源码核查**：[packages/openwrite-bridge/src/tool-policy.ts:36-59](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/packages/openwrite-bridge/src/tool-policy.ts#L36-L59)

未知操作保守分类，计划模式及沙箱写入拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
/** Unknown and preview operations fail closed: previews can persist confirmation records. */
export function novelEffect(name: string, args: unknown): NovelEffect {
  if (reads.has(name)) return 'read'
  const values = args && typeof args === 'object' ? args as Record<string, unknown> : {}
  if (name === 'novel_write_chapter' && values.dry_run === true) return 'read'
  if (readActions[name]?.includes(String(values.action))) return 'read'
  if (name === 'novel_model_benchmark' && values.action === 'run') return 'generate'
  return generates.has(name) ? 'generate' : 'write'
}

export function novelPolicyDenial(ctx: Context, execution: Readonly<ToolExecution>): string | undefined {
  if (!execution.name.startsWith('novel_')) return
  const effect = novelEffect(execution.name, execution.arguments)
  if (effect === 'read') return
  const agent = execution.agent
  if (!agent) return 'OPENWRITE_POLICY_REQUIRED: writing requires an Agent session'
  // Plan state can live in the preset realm; consult the executing Agent.
  const plan = agent.ctx.get('planMode')
  if (plan?.get(agent).active) return 'OPENWRITE_PLAN_MODE: plan mode cannot generate or persist changes'
  const policy = ctx.get('sandboxPolicy')
  if (!policy || policy.resolve({ session: agent.session }).mode === 'read-only') {
    return 'OPENWRITE_READ_ONLY: the session does not permit writing'
  }
  return
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 环境恢复等于写作任务安全恢复吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

环境恢复和任务恢复需要分别判断，但Core并非没有续接保护。只读解包固定Git blob中的Core 5.8.19后，studio_http 299—311行显示请求头解析后选择每个root对应的app；manuscript_editing 181—227行的历史恢复必须显式确认，在项目写锁内校验当前revision，先保留恢复前checkpoint，再原子替换正文并把旧审稿标为过期。task_runner 186—220行只允许失败、取消、中断或部分失败任务重试，章节写作复用drafted run，连写保留_resume_runs、_already_completed和_already_used，避免无条件从头生成。task_store 376—410行拒绝把别的工作区running记录当本作品恢复。这些源码提供具体状态与写入保障，不能再以未解包为缺口。

托管层仍负责代际环境、依赖校验和健康版本匹配，ready仅表示后端可服务，任务是否重试仍由作者决定。当前最关键未知是模型返回与稿件落盘、任务结果更新之间发生进程终止时，整条链是否在各中断点保持一致；恢复函数和重试参数不能独自证明所有生成handler都遵循幂等语义。本轮没有执行故障试验，不能承诺无丢稿或重复计费。

[固定Core wheel](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/release/openwrite-5.8.19-py3-none-any.whl) 内 `tools/manuscript_editing.py` 第190—211行

```python
        if not confirm:
            raise ManuscriptEditingError("恢复版本需要显式确认", code="CONFIRMATION_REQUIRED")
        clean_chapter = self._chapter_id(chapter_id)
        clean_version = self._version_id(version_id)
        try:
            with ProjectWriteLock(
                self.project_root,
                self.novel_id,
                operation=f"manuscript_restore:{clean_chapter}:{clean_version}",
            ):
                path = self.chapter_path(clean_chapter)
                current = path.read_bytes().decode("utf-8")
                if not self.revision_matches(current_revision, self.fingerprint(current)):
                    raise ManuscriptEditingError("当前正文已变化", code="STALE_REVISION")
                version, content = self.load(clean_chapter, clean_version)
                self.checkpoint(
                    clean_chapter,
                    reason="restore",
                    label=f"恢复前: {clean_version}",
                    content=current,
                )
                self._atomic_text(path, content)
```

[固定Core wheel](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/release/openwrite-5.8.19-py3-none-any.whl) 内 `tools/task_runner.py` 第186—220行

```python
    def retry(self, task_id: str) -> dict[str, Any]:
        previous = self.store.load(task_id)
        if previous is None:
            raise TaskStoreError("Task not found")
        if not previous.get("retryable"):
            raise TaskStoreError("Task is not retryable")
        result = self.store.materialize_result(previous)
        partial_failure = previous.get("status") == "completed" and bool(
            result.get("failed_chapters")
        )
        if (
            previous.get("status") not in {"failed", "cancelled", "interrupted"}
            and not partial_failure
        ):
            raise TaskStoreError("Only failed, cancelled or interrupted tasks can be retried")
        payload = self.store.materialize_input(previous)
        result = self.store.materialize_result(previous)
        from tools.chapter_run_v2 import ChapterRunV2Store

        runs = ChapterRunV2Store(self.project_root, self.novel_id)
        if previous.get("type") == "chapter_write":
            latest = runs.latest_for_chapter(
                str(previous.get("chapter_id") or payload.get("chapter_id") or "")
            )
            if latest and latest.status == "drafted":
                payload["run_id_v2"] = latest.run_id
        if previous.get("type") == "continuous_write":
            payload["_resume_runs"] = {
                run.chapter_id: run.run_id
                for run in reversed(runs.list(statuses={"drafted"}, limit=200))
            }
        if result.get("completed_chapters"):
            payload["_already_completed"] = list(result["completed_chapters"])
        if result.get("usage"):
            payload["_already_used"] = dict(result["usage"])
```

[固定Core wheel](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/release/openwrite-5.8.19-py3-none-any.whl) 内 `tools/task_store.py` 第376—406行

```python
    def record_root_mismatch(self, task: dict[str, Any]) -> bool:
        """Whether a persisted record was pinned to a different workspace root."""
        recorded = str(task.get("workspace_root") or "").strip()
        if not recorded:
            return False
        return os.path.realpath(recorded) != os.path.realpath(self.project_root)

    def recover_interrupted(self) -> list[dict[str, Any]]:
        recovered: list[dict[str, Any]] = []
        for task in self.list(statuses={"running"}, limit=500):
            if self.record_root_mismatch(task):
                # A record pinned to another root must never be recovered here.
                recovered.append(
                    self.transition(
                        str(task["task_id"]),
                        status="failed",
                        updates={
                            "error": {
                                "code": "WORKSPACE_CONTEXT_MISMATCH",
                                "message": "任务工作区与当前工作区不一致",
                                "recoverable": False,
                            }
                        },
                        event="task_failed",
                    )
                )
                continue
            recovered.append(
                self.transition(
                    str(task["task_id"]),
                    status="interrupted",
```

#### 证据与依据

**依据 1 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:513-576](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/packages/openwrite-bridge/src/managed-runtime.ts#L513-L576)

锁、代际环境、校验与完成标记构成可恢复安装。

<details>
<summary>查看原文（64行）</summary>

```text
  private async lock(signal: AbortSignal): Promise<() => Promise<void>> {
    for (;;) {
      signal.throwIfAborted()
      try {
        return await acquireLock(this.root, {
          realpath: false, stale: 30_000, update: 5_000, retries: 0,
          onCompromised: () => this.controller?.abort(),
        })
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ELOCKED') throw error
        this.update('waiting', 'Another OpenWrite instance is preparing the environment; waiting')
        await this.wait(250, undefined, { signal })
      }
    }
  }

  private async prepare(signal: AbortSignal): Promise<BackendConnection> {
    const manifest = JSON.parse(await readFile(join(this.artifacts, 'runtime-manifest.json'), 'utf8')) as RuntimeManifest
    const platform = manifest.platforms[`${process.platform}-${process.arch}`]
    if (!platform) throw new UnsupportedRuntimePlatformError(`${process.platform}/${process.arch}`)
    if (!manifest.wheel || !manifest.requirements) throw new Error('The package is missing Core or dependency checksums')
    const wheel = join(this.artifacts, manifest.wheel.file)
    const requirements = join(this.artifacts, manifest.requirements.file)
    if (await sha256(wheel) !== manifest.wheel.sha256 || await sha256(requirements) !== manifest.requirements.sha256) {
      throw new Error('Package verification failed; reinstall OpenWrite')
    }
    for (const artifact of manifest.dependency_wheels ?? []) {
      if (await sha256(join(this.artifacts, artifact.file)) !== artifact.sha256) throw new Error('Platform dependency verification failed; reinstall OpenWrite')
    }
    await mkdir(this.root, { recursive: true, mode: 0o700 })
    const unlock = await this.lock(signal)
    let python: string
    try {
      const generation = createHash('sha256').update(JSON.stringify(manifest)).digest('hex').slice(0, 24)
      const destination = join(this.root, 'environments', generation)
      python = join(destination, process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python')
      if (await readFile(join(destination, '.complete'), 'utf8').catch(() => '') !== generation) {
        const uv = await this.extract(platform.uv, signal)
        const basePython = await this.extract(platform.python, signal)
        this.update('installing', 'Installing isolated dependencies; first use may take several minutes')
        await rm(destination, { recursive: true, force: true })
        try {
          await this.command(uv, ['venv', '--python', basePython, destination], signal)
          await this.command(uv, ['pip', 'sync', '--python', python, '--require-hashes', '--only-binary', ':all:',
            ...(manifest.dependency_wheels?.length ? ['--find-links', join(this.artifacts, 'wheels')] : []), requirements], signal)
          await this.command(uv, ['pip', 'install', '--python', python, '--no-deps', wheel], signal)
          await this.command(python, ['-I', '-c', 'from tools.studio_http import health_payload; from tools.studio import create_server; assert health_payload()["contract_version"] == 1'], signal)
          await writeFile(join(destination, '.complete'), generation)
        } catch (error) { await rm(destination, { recursive: true, force: true }); throw error }
      }
      signal.throwIfAborted()
      this.update(this.recovered ? 'recovering' : 'starting', this.recovered ? 'Recovering the writing environment' : 'Starting the writing environment')
      const connection = await this.start(python, manifest, signal)
      const pending = join(this.root, 'active.' + randomUUID() + '.json')
      try {
        await writeFile(pending, JSON.stringify({ generation, coreVersion: manifest.core_version }))
        await rename(pending, join(this.root, 'active.json'))
      } catch (error) {
        this.connection = undefined
        if (this.child) await stopOwnedProcess(this.child)
        throw error
      } finally { await rm(pending, { force: true }) }
      return connection
    } finally { await unlock() }
```

</details>

**依据 2 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:632-644](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/packages/openwrite-bridge/src/managed-runtime.ts#L632-L644)

版本健康校验后明确在途任务仍需显式重试。

<details>
<summary>查看原文（13行）</summary>

```text
      const health = await fetch(connection.baseUrl + '/api/health', {
        headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
      })
      const result = await health.json() as Record<string, unknown>
      if (!health.ok || result.core_version !== manifest.core_version || result.contract_version !== manifest.contract_version) {
        throw new Error('Writing backend version or API mismatch; reinstall OpenWrite')
      }
      this.connection = connection
      started = true
      if (!this.recovered) this.restartAttempts = 0
      this.update('ready', this.recovered
        ? 'The writing environment recovered; in-progress writing and review tasks require an explicit retry'
        : 'The writing environment is ready')
```

</details>

**依据 3 · 源码核查**：[plugin.mjs:42-75](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/plugin.mjs#L42-L75)

摘要标记保护自定义内容，清理只回收已知租约。

<details>
<summary>查看原文（34行）</summary>

```text
  const expected = await digestTree(source)
  const marker = join(destination, '.openwrite-managed.json')
  await withLock(async () => {
    const existing = await readFile(marker, 'utf8').then(JSON.parse).catch(() => null)
    if (existing && (existing.source !== expected || existing.tree !== await digestTree(destination))) {
      throw new Error(`OpenWrite preset ${id} was modified; copy it to a custom preset before reinstalling this version`)
    }
    if (!existing) {
      if (await lstat(destination).then(() => true).catch(error => { if (error.code === 'ENOENT') return false; throw error })) {
        throw new Error(`OpenWrite preset ${id} already exists without an ownership marker; preserve it under a custom preset name first`)
      }
      const staging = join(managedRoot, 'preset-' + randomUUID())
      await mkdir(staging, { recursive: true })
      try {
        await cp(source, staging, { recursive: true })
        await writeFile(join(staging, '.openwrite-managed.json'), JSON.stringify({ source: expected, tree: expected, version }))
        await rename(staging, destination)
      } finally { await rm(staging, { recursive: true, force: true }) }
    }
    await writeFile(lease, JSON.stringify({ pid: process.pid }), { mode: 0o600 })
  })
  // 0.1 resolves session identities through these directories. They must outlive
  // a host and a plugin upgrade; removing them strands historical sessions.
  ctx.effect(() => async () => withLock(async () => {
    await rm(lease, { force: true })
    for (const entry of await readdir(leases)) {
      const file = join(leases, entry)
      try {
        const record = JSON.parse(await readFile(file, 'utf8'))
        try { process.kill(record.pid, 0) }
        catch (error) { if (error.code === 'ESRCH') await rm(file, { force: true }) }
      } catch { /* unknown files never grant deletion authority */ }
    }
  }))
```

</details>

**依据 4 · 作者声明**：[README.md:30-32](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/README.md#L30-L32)

作者明确保留候选状态和平台未验收范围。

```text
## 开发中：0.2.28（未发布）

Core 5.8.19 候选补修已合并，22 项 CI 全部通过；修复 CRLF/emoji 选区坐标，以及中断升级恢复和损坏安装包缓存重试，见 [选区与升级补修](docs/SELECTION_UPGRADE_REPAIRS.md)。前轮修复及 #123 的 Windows 回执见 [回复补修记录](docs/ISSUE_123_FOLLOWUP.md)。剩余宿主正式发布与 Android/Termux 实机两项继续跟踪，本轮不发布；下面的 npm/GitHub 安装入口仍为已发布的 0.2.27。
```

#### 缺口

- 模型调用、稿件落盘与任务结果之间所有中断点的一致性未执行核验
  **影响**：现有checkpoint与重试续接源码不能升级为全链无丢稿/无重复保证
  **进一步探讨**：针对模型返回前后、稿件替换前后、任务完成记录前后分别终止进程，核对稿件版本、run_id、completed清单及重复计费

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定作者试用成本与退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合愿意备份作品、能配置模型并复核生成文本的长篇作者，先在作品副本上完成一章规划、生成、修订和导出。初次运行需要下载uv、Python和锁定依赖，占用网络磁盘及准备时间；聊天、生成与评审模型分别配置，计费不能只算一次写章。持续成本包括维护设定、校对连续性、多个评审/生成调用及版本升级。失败后先核对既有稿件和任务状态，再决定重试；退出应保留作品、预设和凭据，按文档回退匹配宿主版本。若出现作品串用、旧稿被覆盖、恢复状态无法辨认或成本无法预测，停止在原作上写入并改回备份编辑。源码说明的可恢复环境为有限试用提供基础，但没有本轮实际安装证据，不给值得长期安装结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-80](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/README.md#L65-L80)

版本固定、升级停止宿主、初次运行环境下载及备份迁移要求。

<details>
<summary>查看原文（16行）</summary>

````text
`@latest` 在执行安装或升级命令时选择 npm 最新发布版本，不会自动替换正在运行的服务。无需在安装时编译源码。升级前停止 dsh，并核对目标版本的宿主兼容说明。需要复现或回退时，使用 `dsh-openwrite@0.2.8` 等精确版本；对应版本的 [npm 包](https://www.npmjs.com/package/dsh-openwrite)与 [Release 预编译包](https://github.com/LiPu-jpg/Openwrite/releases) 为同一份已验收产物。

也可把这段话交给有终端权限的 Agent：

```text
请按 https://github.com/LiPu-jpg/Openwrite 的 README 和对应 Release 安装 OpenWrite。
先核对 Release 验收结果和精确 dsh 版本，再用 dsh plugin --profile web add -w dsh-openwrite@latest 安装。
如宿主不兼容，安装最后一个匹配且已验收的精确版本，不自动升级宿主。
已有本地安装先备份并迁移，保留作品、自定义预设、凭据和其他插件。
启动 dsh web，指导我点击 OpenWrite、准备环境并选择自己的作品。
不要调用写作模型做安装检查，不要自动升级宿主或放宽 pnpm 构建授权。
```

首次使用会下载固定版本的 uv、Python 3.12 和锁定依赖，保存在当前 dsh 的专属目录。无需预装 Python，也无需克隆两个分支。目标平台为 macOS arm64/x64、Linux x64、Windows x64；各平台通过情况以发布验收报告为准。模型费用另计。

具体的源码安装、升级、迁移和卸载见 [安装指南](docs/INSTALL.md)。
````

</details>

**依据 2 · 作者声明**：[README.md:120-140](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/README.md#L120-L140)

生成与评审模型分开配置并计费。

<details>
<summary>查看原文（21行）</summary>

```text
1. 执行 `dsh web`，打开它给出的浏览器地址，点击侧栏 **OpenWrite**。等待环境就绪后，选择作品目录。
2. 入口自动建立 **OpenWrite 创作** 会话；点击 **创作** 即可打开工作台，无需先发消息。对话模型在 dsh 中配置；小说生成与评审模型在「任务 → 模型」配置。
3. 和 Agent 讨论题材、人物与大纲，确认后再开始写章。已有旧稿可通过「任务 → 导入与导出」接入。

| 日常操作 | 入口 |
|---|---|
| 看进度、继续写作 | `/progress`、`/write-next` |
| 审稿、修改选段 | `/review-chapter`、`/revise-span` |
| 查伏笔、设定与写法记忆 | `/foreshadow`、`/canon`、`/learn` |
| 导出成稿 | `/export-book` 或「任务 → 导入与导出」 |

已有会话不会自动切换预设。详细操作与工作区规则见 [使用流程](docs/WORKFLOWS.md)。

**界面语言**：面板已内置中文与英文词典，跟随 dsh 语言设置。切换方法：Settings → General → Language → English（选择后存为 `locale.preference`）。Agent 的 persona 和所有技能入口要求用作者的对话语言回复；运行环境与任务状态提供英文，Studio 报错附带英文说明和稳定错误码。已有作品内容不会自动翻译，正文按作者指定的语言生成。

## 配置模型

安装和环境健康检查不需要模型 API Key，也不会调用写作模型。与 Agent 对话、生成章节和审稿需要可用的模型配置；使用收费服务商时会产生 API 费用。

- **对话模型**：在 dsh 宿主中配置，用于 OpenWrite 创作会话。
- **小说生成、评审与测试模型**：在「任务 → 模型」添加服务商，按服务商提供的信息填写模型名、接口地址和 API Key。不要把密钥粘贴到对话、作品正文或 Git 仓库。
```

</details>

**依据 3 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:632-644](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/packages/openwrite-bridge/src/managed-runtime.ts#L632-L644)

环境恢复不自动重试写作任务。

<details>
<summary>查看原文（13行）</summary>

```text
      const health = await fetch(connection.baseUrl + '/api/health', {
        headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
      })
      const result = await health.json() as Record<string, unknown>
      if (!health.ok || result.core_version !== manifest.core_version || result.contract_version !== manifest.contract_version) {
        throw new Error('Writing backend version or API mismatch; reinstall OpenWrite')
      }
      this.connection = connection
      started = true
      if (!this.recovered) this.restartAttempts = 0
      this.update('ready', this.recovered
        ? 'The writing environment recovered; in-progress writing and review tasks require an explicit retry'
        : 'The writing environment is ready')
```

</details>

#### 缺口

- 单位章节账单、人工修订量与迁移耗时未知
  **影响**：无法给出节时或单位合格稿件成本
  **进一步探讨**：固定作品与模型预算记录完整生成评审账单、失败重试及作者校对时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 任务重试前核对稿件版本是否值得增加？

**研究主题**：新假设与验证

#### 完整回答

补查Core后，简单增加“续接已有草稿”不再是新的方向：task_runner已有drafted run复用与已完成章节清单。更窄的未验证假设是将这些权威状态连同当前稿件revision组成重试前一致性预览，明确区分“可接续草稿”“已完成不重做”“需人工确认冲突”，且不靠界面日志猜测。价值只可能在作者理解和决策层，不能重复宣称后端缺少恢复能力。先核对Studio现有恢复界面是否已表达这些状态；若已有等价交互，本次不另造创新。若仍有读者理解缺口，在作品副本故障点上盲评原界面与预览，记录重复请求、错误覆盖、恢复时间和额外确认次数；没有改善就否定。

[固定Core wheel](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/release/openwrite-5.8.19-py3-none-any.whl) 内 `tools/task_runner.py` 第201—220行

```python
        payload = self.store.materialize_input(previous)
        result = self.store.materialize_result(previous)
        from tools.chapter_run_v2 import ChapterRunV2Store

        runs = ChapterRunV2Store(self.project_root, self.novel_id)
        if previous.get("type") == "chapter_write":
            latest = runs.latest_for_chapter(
                str(previous.get("chapter_id") or payload.get("chapter_id") or "")
            )
            if latest and latest.status == "drafted":
                payload["run_id_v2"] = latest.run_id
        if previous.get("type") == "continuous_write":
            payload["_resume_runs"] = {
                run.chapter_id: run.run_id
                for run in reversed(runs.list(statuses={"drafted"}, limit=200))
            }
        if result.get("completed_chapters"):
            payload["_already_completed"] = list(result["completed_chapters"])
        if result.get("usage"):
            payload["_already_used"] = dict(result["usage"])
```

#### 证据与依据

**依据 1 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:632-644](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/packages/openwrite-bridge/src/managed-runtime.ts#L632-L644)

ready提示明确仍要显式重试，是核对设计的推导起点。

<details>
<summary>查看原文（13行）</summary>

```text
      const health = await fetch(connection.baseUrl + '/api/health', {
        headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
      })
      const result = await health.json() as Record<string, unknown>
      if (!health.ok || result.core_version !== manifest.core_version || result.contract_version !== manifest.contract_version) {
        throw new Error('Writing backend version or API mismatch; reinstall OpenWrite')
      }
      this.connection = connection
      started = true
      if (!this.recovered) this.restartAttempts = 0
      this.update('ready', this.recovered
        ? 'The writing environment recovered; in-progress writing and review tasks require an explicit retry'
        : 'The writing environment is ready')
```

</details>

**依据 2 · 源码核查**：[packages/openwrite-bridge/src/client.ts:45-56](https://github.com/LiPu-jpg/Openwrite/blob/8c5297da5726f35895f86b6e457da40b7e544ea4/packages/openwrite-bridge/src/client.ts#L45-L56)

已有请求上下文和任务相关诊断标识可作为接线基础但非完成证明。

<details>
<summary>查看原文（12行）</summary>

```text
 * Request-scoped Workspace identity, per docs/WORKSPACE_CONTEXT_CONTRACT.md §3.
 * `workspaceRoot` is the canonical (realpath'd) absolute path — the only root
 * identity; the id/epoch fields are audit/diagnostic metadata.
 */
export interface WorkspaceContext {
  workspaceRoot: string
  workspaceId?: string
  sessionId?: string
  contextEpoch?: number
  toolCallId?: string
  rootCallId?: string
  toolName?: string
```

</details>

#### 缺口

- 现有工作台是否已完整呈现权威续接状态及作者是否误解尚未知
  **影响**：不能判断新增预览是否有实际增量
  **进一步探讨**：先核查现有任务详情交互和作者恢复案例，再做同状态两种呈现的盲评

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
