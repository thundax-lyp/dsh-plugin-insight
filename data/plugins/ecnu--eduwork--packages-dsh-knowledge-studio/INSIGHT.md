# EduWork Knowledge Studio

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[a43a4d4](https://github.com/ECNU/EduWork/tree/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio)

<!-- BEGIN META -->
[![GitHub ★ 250](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=250&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ECNU/EduWork) [![npm 30d 1,595](https://img.shields.io/static/v1?label=npm+30d&message=1%2C595&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-knowledge-studio) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-knowledge-studio)
<!-- END META -->

> **功能**：DSH工作区资料创作插件，将对话生成接到Studio修订、学习交互与真实文件交接；引用合法/快照状态和生成答案仍需独立核验。

> **亮点**：当前同会话到学习草稿/真实工件的管理链、条件轮末最终版与失败历史/只重导出机制，比散落聊天复制多了可管理交接。共享服务属直接依赖，输出正确与教学效果仍未证，见[Q01](#research-q01)/[Q03](#research-q03)。

> **主要限制**：引用可选且只验ID/结构；索引fresh比较当前索引而非实时重读文件，合法答案索引也不证答案真值。无索引创作仍静态加载Ladybug native；正常工具/直启RPC权限路径不同，见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 知识创作是什么组件，正常界面到生成工具如何接通？](#detail-section-11)
  - [Q02 · 资料、模型、引用和学习反馈分别验证什么？](#detail-section-12)
  - [Q03 · 完成/修订/导出/退出是否与真实工件一致？](#detail-section-13)
  - [Q04 · 无需先建索引是否等于轻量无运行时，成本怎么核？](#detail-section-14)
  - [Q05 · 应如何试用，独立生产方向怎样区别已有引用和修订？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为已有兼容DSH的教师和培训资料维护者，把允许的资料整理成可追问、可修订的学习草稿；场景明确而需求/学习效果未验证，见[Q01](#research-q01)。

与同宿主普通创作技能/共享Office及手工制卡比，已核增量为来源范围、成果交互/修订/快照与文件交接；没有独立任务净收益，不重复计入底座Agent/官方格式处理，见[Q01](#research-q01)/[Q05](#research-q05)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| knowledge-studio Skill | 指引Studio成果/同目标修订 | 可禁用，不替代普通创作技能或事实核验 |
| create_artifact：quiz | 生成可作答测验 | 同一工具的kind，correctIndex由生成结果给出，须核答案 |
| create_artifact：flashcards | 生成正反面卡片/复习状态 | 题材/内容核验；复习记录不等学习改善 |
| create_artifact：report | 来源驱动报告与DOCX | 共享/受管Office运行时，结构不等事实 |
| create_artifact：table | 结构化表与XLSX | 列/内容和格式条件，不等数值正确 |
| create_artifact：slides | 演示与讲稿/PPTX | 页数/导出/保真按实际工件另核 |
| create_artifact：mindmap | 主题树/引用/追问 | 树结构有校验，主题关系语义仍需核 |
| create_artifact：audio | 音频脚本/语音生成入口 | 语音/媒体readiness；本轮未全审渲染 |
| create_artifact：video | 分镜/视频生成入口 | 媒体/可选语音运行时，本轮未全审渲染 |
| knowledge_studio_status | 读已有索引状态 | 旧检索开关显式true，不开始索引 |
| knowledge_studio_search | 既有索引词法检索 | 同开关/有效本地索引，不等实时全源 |
| knowledge_studio_read | 取确切索引chunk | 同开关，hash对索引不是实时磁盘 |
| knowledge_studio_neighbors | 取索引邻近内容 | 同开关及现有chunk |
| Studio交互界面 | 浏览/回答/翻卡/追问并回存 | 需构建Client/兼容Host，普通创建经对话工具 |
| 同目标修订/轮末呈现 | 保代次并交最后有效版 | 依execution/turn接口，非所有RPC自动同门控 |
| 导出/实际文件预览 | 交保存文件/可下载数据 | 原生viewer由Host处理；兼容预览读实际字节 |
| retry-export | 合格保存正文仅重Office导出 | 仅条件shared-office，不绕受管工具拒绝 |

**流程与依赖**

| 依赖 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH Host/Client与Node24.18+ | 核心必需 | workspace/fs/tools/模型/技能/remote与实际Studio UI | 先核版本/构建与加载，源码client未跟踪成品，不声称安装即用 |
| Artifact Services0.3.1 | bundle必需 | 精确配套Office/媒体/转写等共享接口 | 缺失不能满足inject；不要错配README旧版或重复注册 |
| 平台Ladybug0.20.1 native | 当前模块加载需要 | 即使无索引，静态import也require平台绑定 | 缺optional native/不支持平台会throw；先准备，不以无索引绕过 |
| 允许的资料/工作区FS | 生成必需 | 范围/大小/类型受限的本地读取 | 无可引用内容拒绝，不自动放宽；核宿主真实权限 |
| 已配置模型/可外发授权 | 生成必需 | 宿主Agent及独立内容stream | 未选模型报错，不能把本地索引当生成全离线 |
| 可写数据目录/磁盘 | 保存/交互/导出必需 | artifacts.json、历史/快照和exports；索引另有workspaces | 写失败显式未落盘，备份后处理；未证跨进程强一致 |
| Office工具或共享Python | Office模式需要，quiz/卡片不需先启 | DOCX/PPTX/XLSX创建与结构检查 | 正文可保留但导出失败；按受管/共享路径分别恢复，不绕拒绝 |
| 浏览器/转换/语音等 | PDF/预览/音视频条件需要 | 实际字节预览/转换/媒体与声音 | readiness/类型有条件，缺失明确处理，不当所有平台已装 |
| 本地索引/旧检索工具开关 | 非创作前提 | 已有索引词法检索；显式开关才额外四工具 | 无索引读原文件；索引可能旧，fresh不能替代活源检查 |

| 步骤 | 操作者与动作 | 判据/失败 |
|---|---|---|
| 限范围 | 用户选允许公开资料/格式与pathPrefix | 空范围失败，不当全工作区理解 |
| 发起 | Studio写请求草稿，宿主Agent按技能调用生成工具 | 点击不保证模型已调用；核实际artifactId |
| 生成 | 插件取有限资料，独立请求模型并校验结构/ID | 纯文本/正常结束不等事实支持 |
| 保存/交付 | 插件保存内容/尝试实际导出，条件轮末定最终版；Client读取 | 文件/权限/版本分别核，不能只看completed |
| 验收/复习 | 教师核原文/答案，用户答题/翻卡/追问 | correctIndex相等不等外部真值/学习改善 |
| 修订/退出 | 用户指定同目标修订或合格重导出；关闭服务取消等待 | 保存历史/已耗费用/输出不自动回滚 |

**效果与成本**

| 阶段 | 钱/机器资源 | 人工与时间 | 失败/退出处理 |
|---|---|---|---|
| 首次 | 兼容Host/Client、native/共享包；Office/媒体另有环境资源，金额未知 | 核范围/模型/构建发行物、授权与事实小样，耗时未知 | 先公开quiz/卡片，不为试用全装媒体 |
| 持续 | 宿主决策＋独立生成token、状态/快照/输出磁盘、可选媒体算力 | 核答案/引用、改资料与索引、审核导出 | 会话token选项/idle不是现金或总时长cap |
| 失败恢复 | 重生成可能再次收费；合格shared-office仅重导出 | 保草稿/历史，分权限、模型截断、格式和写盘故障 | 受管Office失败不能不受管绕过；旧成功回显带warning |
| 退出 | 快照/导出/原件保留占磁盘，外部模型费已发生 | 备份需要的原文件与成果、撤插件配置、核进程/残留 | 删除仅标记，close取消等待非全回滚，未验完整卸载 |

| 层次 | 材料支持的效果 | 未知/验收 |
|---|---|---|
| 已核源码 | 统一资料创作/修订/交互和代表真实文件链 | 不把共享能力全算本插件原创 |
| 作者/接口声明 | 多格式、引用/学习反馈与兼容平台 | 版本README旧，引用/结构/评分界限见Q02/Q03 |
| 独立结果 | 本轮无实际生成/教师或学习任务对照 | 支持率、错误/漏项、总准备成本与学生独立结果 |

> **思考**：引用可选且只验ID/结构；索引fresh比较当前索引而非实时重读文件，合法答案索引也不证答案真值。无索引创作仍静态加载Ladybug native；正常工具/直启RPC权限路径不同，见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：当前同会话到学习草稿/真实工件的管理链、条件轮末最终版与失败历史/只重导出机制，比散落聊天复制多了可管理交接。共享服务属直接依赖，输出正确与教学效果仍未证，见[Q01](#research-q01)/[Q03](#research-q03)。

已有串行/原子保存、条件轮末修订和最后成功回显、保存正文后的合格导出恢复/权限拒绝边界；不是跨进程事务/教学真值/全部入口统一审批。索引fresh与file_实时检查需区别，见[Q02](#research-q02)/[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

引用可选且只验ID/结构；索引fresh比较当前索引而非实时重读文件，合法答案索引也不证答案真值。无索引创作仍静态加载Ladybug native；正常工具/直启RPC权限路径不同，见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有兼容环境且允许外发公开小资料者，可试quiz/卡片并人工核答案；不直接学生评分/大批生成，不强开Office/媒体，见[Q04](#research-q04)/[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码闭合插件/Client构建接线、普通卡片到工具、资料/模型/引用/交互及代表Office/持久失败路径。未构建安装或运行模型/Office/媒体/宿主，不全审所有共享服务；限公开小资料、人工核答案的试用。

- 已检查：作者 README、包清单、源码路径 packages/dsh-knowledge-studio/README.md、packages/dsh-knowledge-studio/cordis.patch.yml、packages/dsh-knowledge-studio/lib/artifact-lifecycle.js、packages/dsh-knowledge-studio/lib/artifacts.js、packages/dsh-knowledge-studio/lib/atomic-json.js、packages/dsh-knowledge-studio/lib/basic-evidence.js、packages/dsh-knowledge-studio/lib/export-recovery.js、packages/dsh-knowledge-studio/lib/generation-policy.js、packages/dsh-knowledge-studio/lib/generation.js、packages/dsh-knowledge-studio/lib/index.js、packages/dsh-knowledge-studio/lib/indexer.js、packages/dsh-knowledge-studio/lib/ladybug.js、packages/dsh-knowledge-studio/lib/manager.js、packages/dsh-knowledge-studio/lib/office-tools.js、packages/dsh-knowledge-studio/lib/skill.js、packages/dsh-knowledge-studio/lib/store.js、packages/dsh-knowledge-studio/lib/studio-content.js、packages/dsh-knowledge-studio/lib/studio-export.js、packages/dsh-knowledge-studio/lib/studio-instructions.js、packages/dsh-knowledge-studio/lib/tools.js、packages/dsh-knowledge-studio/package.json、packages/dsh-knowledge-studio/packages/artifact-services/lib/dsh.js、packages/dsh-knowledge-studio/packages/artifact-services/lib/office-preview.js、packages/dsh-knowledge-studio/packages/artifact-services/lib/office.js、packages/dsh-knowledge-studio/packages/artifact-services/package.json、packages/dsh-knowledge-studio/skills/knowledge-studio/SKILL.md、packages/dsh-knowledge-studio/src/client/StudioArtifact.tsx、packages/dsh-knowledge-studio/src/client/file-preview.ts、packages/dsh-knowledge-studio/src/client/index.tsx、packages/dsh-knowledge-studio/tsdown.config.ts 及固定范围 inventory；组件：packages/dsh-knowledge-studio。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计器覆盖表列MD/JS/MJS/TS/TSX/JSX等，未计共享Office核心Python；含文档/测试/共享包，非本插件原创代码/工时。固定组件源码，聚焦正常UI→工具→原资料/既有索引→有限模型生成/引用→学习与代表Office交接/持久失败。未构建/运行目标、模型/测试/Office/媒体，不全审所有格式/共享工具/官方viewer内部、宿主安全与平台/退出；源版本不当线上统一版本。
- 下一步：先核普通卡片真实工具/结果与file_、旧索引、错误但合法引用、模型截断和导出拒绝，再三组对照条目支持/教师成本与学习结果，见[Q02](#research-q02)至[Q05](#research-q05)。

**分析版本**

- **仓库**：[ECNU/EduWork](https://github.com/ECNU/EduWork)
- **版本号**：0.6.2（Studio包；配套Artifact Services0.3.1）（[固定提交 a43a4d4](https://github.com/ECNU/EduWork/tree/a43a4d424c9d25668589dfe94a3871318ce299ff)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先补索引与活文件对齐，再在现有快照/修订上核条目级事实和答案支持/教师确认，三组对照误用与总投入；现有能力已等效就否定，见[Q05](#research-q05)。

先核普通卡片真实工具/结果与file_、旧索引、错误但合法引用、模型截断和导出拒绝，再三组对照条目支持/教师成本与学习结果，见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计器仅覆盖下表MD/JS/MJS/TS/TSX/JSX等文件，未计共享Office核心Python；含文档/测试/共享包，不代表本插件原创量或工时。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 41 | 2084 | — | — | 33346 |
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

[![Issue 未关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/ECNU/EduWork/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 31](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=31&color=737b86&logo=github)](https://github.com/ECNU/EduWork/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/ECNU/EduWork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核正常UI/工具/资料生成/引用/实际工件与失败边界，判断受控试用及条目级支持验证增量。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 知识创作是什么组件，正常界面到生成工具如何接通？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

本对象是@eduwork/dsh-knowledge-studio这个DSH Host＋Client插件，entry_type=plugin，不是整个EduWork桌面、独立Agent或只有技能。当前package声明Studio0.6.2并精确依赖共享Artifact Services0.3.1；README仍写0.6.0/0.3.0，不能沿用为当前包版本，也不据源码号声称npm发行物已发布可用。Node要求24.18+，DSH peer从0.2.1-rc.2到0.3前；无强制机构服务的inject声明，不把整发行版账号当本组件必需。

bundle patch先加载共享成果服务再Studio。实际Host main为lib/index.js，Service注入workspace/fs/settings/skills/llm/agents和artifactServices，创建manager/ArtifactEngine，默认安装一个knowledge_studio_create_artifact工具与可禁用Skill；indexedRetrievalTools只有显式true才另注册四个旧检索工具。八种kind是同一生成工具的分支，不是八个独立模型工具。

Client不是只有export声明：tsdown把src/client/index.tsx编为lib/client.js；源码apply实际mount remote并注入knowledgeStudio，按宿主layout能力选择官方sidebar tab/slot或旧details/overlay入口。固定git树未跟踪生成后的lib/client.js，故已核是源码构建/挂载接线，未验证编译产物或安装后的UI。正常artifact卡片先把人可读请求放入对话草稿并submit，要求按knowledge-studio技能创建；宿主Agent是否正确调用仍是运行前提。真正工具execute用当前Agent cwd解析工作区→artifacts.start→wait；另有RPC invokeStudio的直启分支，不能拿备用RPC冒充所有正常点击。

为已使用兼容DSH的教师/培训资料维护者，把允许的资料组织成可管理、可追问、可下载的学习草稿；真实需求强度、教师节时与学习效果未验证。逐操作能力表见[能力清单](#能力清单)，共享服务附带工具不都算本插件新增。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-knowledge-studio/package.json:1-23](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/package.json#L1-L23)

包0.6.2/main/client等出口。

<details>
<summary>查看原文（23行）</summary>

```text
{
  "name": "@eduwork/dsh-knowledge-studio",
  "version": "0.6.2",
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
    "./client": "./lib/client.js",
    "./remote": "./lib/typert.remote-client.js",
    "./typert": "./lib/typert.host.js",
    "./parser": "./lib/parser.js",
    "./store": "./lib/store.js",
    "./tokenizer": "./lib/tokenizer.js",
    "./artifacts": "./lib/artifacts.js",
    "./media-timeline": "./lib/media-timeline.js",
    "./media-providers": "./lib/media-providers.js",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/package.json:44-66](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/package.json#L44-L66)

bundle/client与构建脚本。

<details>
<summary>查看原文（23行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-workspace",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web",
      "immediately": true
    }
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build:media": "node scripts/build-video-template.mjs",
    "build:host": "tsdown --config tsdown.host.config.ts",
    "build:client": "tsdown",
    "build": "npm run build:media && npm run build:host && npm run build:client && npm run build:licenses",
```

</details>

**依据 3 · 源码核查**：[packages/dsh-knowledge-studio/package.json:83-110](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/package.json#L83-L110)

原生包及DSH peer约束。

<details>
<summary>查看原文（28行）</summary>

```text
  "optionalDependencies": {
    "@ladybugdb/core-darwin-arm64": "0.20.1",
    "@ladybugdb/core-darwin-x64": "0.20.1",
    "@ladybugdb/core-linux-arm64": "0.20.1",
    "@ladybugdb/core-linux-x64": "0.20.1",
    "@ladybugdb/core-win32-x64": "0.20.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.5 <4.1.0",
    "@deepseek-ai/dsh-api-remotes": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-api-session-controller": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-conversation": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-layout": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-workspace": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-fs": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-home-paths": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-llm": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-settings": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-skill": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-typert-protocol": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-workspace": ">=0.2.1-rc.2 <0.3.0-0",
    "@deepseek-ai/schemastery": ">=3.18.5 <3.19.0",
    "react": "^18.2.0",
    "zod": "^4.4.3",
    "@deepseek-ai/dsh-client-locale": ">=0.2.1-rc.2 <0.3.0-0"
  },
  "peerDependenciesMeta": {
```

</details>

**依据 4 · 源码核查**：[packages/dsh-knowledge-studio/package.json:183-211](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/package.json#L183-L211)

Node要求/共享包0.3.1依赖。

<details>
<summary>查看原文（29行）</summary>

```text
    "semver": "7.7.4"
  },
  "engines": {
    "node": ">=24.18.0"
  },
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "workspace",
    "studio",
    "knowledge-base",
    "ladybugdb"
  ],
  "publishConfig": {
    "access": "public",
    "provenance": true
  },
  "license": "MIT",
  "dependencies": {
    "playwright-core": "^1.63.0",
    "react-dom": "18.3.1",
    "remark-gfm": "4.0.1",
    "remark-parse": "11.0.0",
    "unified": "11.0.5",
    "@eduwork/dsh-artifact-services": "0.3.1"
  },
  "workspaces": [
    "packages/artifact-services"
```

</details>

**依据 5 · 源码核查**：[packages/dsh-knowledge-studio/README.md:1-6](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/README.md#L1-L6)

README仍旧版本，未当源码版本真相源。

```text
# DSH Knowledge Studio

版本：Studio `0.6.0` / Artifact Services `0.3.0`，要求 Node.js 24.18+ 与 DSH 0.2.1-rc.2。无需 EduWork 桌面桥接或机构账号。

[English](README_EN.md)

```

**依据 6 · 源码核查**：[packages/dsh-knowledge-studio/packages/artifact-services/package.json:1-13](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/packages/artifact-services/package.json#L1-L13)

配套源码包0.3.1。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "@eduwork/dsh-artifact-services",
  "version": "0.3.1",
  "type": "module",
  "description": "Shared Office, speech and media services for applications and DSH tools",
  "license": "MIT",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./office": "./lib/office.js",
    "./official-office": "./lib/official-office.js",
    "./office-tools": "./lib/office-tools.js",
    "./speech": "./lib/speech.js",
```

</details>

**依据 7 · 源码核查**：[packages/dsh-knowledge-studio/cordis.patch.yml:1-8](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/cordis.patch.yml#L1-L8)

真实Host两服务加载顺序。

```text
# Installs idle: Workspace Knowledge starts only after explicit first-use consent.
- insert:
    - id: dsh-artifact-services
      name: '@eduwork/dsh-artifact-services/dsh'
      config: {}
    - id: dsh-knowledge-studio
      name: '@eduwork/dsh-knowledge-studio'
      config: {}
```

**依据 8 · 源码核查**：[packages/dsh-knowledge-studio/lib/index.js:15-40](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/index.js#L15-L40)

Service实际注入/实例/工具Skill安装。

<details>
<summary>查看原文（26行）</summary>

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
    }
    ctx.effect(() => async () => {
      await this.artifacts.close()
      await this.manager.close()
    }, 'dsh-knowledge-studio: close tasks and local stores')
```

</details>

**依据 9 · 源码核查**：[packages/dsh-knowledge-studio/tsdown.config.ts:7-22](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/tsdown.config.ts#L7-L22)

客户端构建指向实际入口。

<details>
<summary>查看原文（16行）</summary>

```text
export default defineConfig({
  entry: { client: 'src/client/index.tsx' }, outDir: 'lib', format: 'cjs', platform: 'browser', target: 'es2022',
  alias: {
    'node:process': clientShim('process'),
    'node:path': clientShim('path'),
    'node:url': clientShim('url'),
  },
  dts: false, sourcemap: false, clean: false,
  deps: { neverBundle: external, alwaysBundle: specifier => !external(specifier) },
  inputOptions: { resolve: { conditionNames: ['browser', 'import', 'require', 'default'], aliasFields: [['browser']] } },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: 'window.__ModuleLoader__.load({ id: "@eduwork/dsh-knowledge-studio", factory: (require) => {',
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
```

</details>

**依据 10 · 源码核查**：[packages/dsh-knowledge-studio/src/client/index.tsx:970-976](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/src/client/index.tsx#L970-L976)

Client apply mount remote/取service。

```text
export async function apply(ctx: any) {
  ctx.effect(() => ctx.locale.register(NS, dictionaries), 'studio: dictionaries')
  const t = ctx.locale.bind(NS)
  const disposeRemote = await ctx.remote.$mount(knowledgeStudioRemote)
  const officialSidebar=typeof ctx.layout.openDetails!=='function'
  ctx.inject(['remote.knowledgeStudio', 'remote.session',...(officialSidebar?['sidebarRight','sidebarRightTabs']:[])], (surfaceCtx: any) => {
    const service = surfaceCtx.remote.knowledgeStudio
```

**依据 11 · 源码核查**：[packages/dsh-knowledge-studio/src/client/index.tsx:1040-1078](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/src/client/index.tsx#L1040-L1078)

官方tab/slot与legacy挂载分支。

<details>
<summary>查看原文（39行）</summary>

```text
    const previewFile = officialSidebar
      ? (sessionId:string,path:string)=>openStudioFilePreview(surfaceCtx.sidebarRight,sessionId,path)
      : undefined
    const disposers = [
      ...(!officialSidebar?[
      surfaceCtx.slots.inject('shell.overlay',()=>surfaceCtx.slots.register({name:'shell.overlay',id:'knowledge-studio-reader',order:0,inject:()=>({surface})},ReadingLayer)),
      surfaceCtx.slots.inject('shell.overlay', () =>
        surfaceCtx.slots.register({name:'shell.overlay',id:'knowledge-studio-entry',order:10,
          inject:()=>({surface,sessions:surfaceCtx.sessions})},StudioBlankEntry)),
      surfaceCtx.slots.inject('conversation.session.header.utilities', () =>
        surfaceCtx.slots.register({name:'conversation.session.header.utilities',id:'knowledge-studio-entry',order:30,
          inject:()=>({surface,sessions:surfaceCtx.sessions})},StudioHeaderEntry))]:[]),
      ...(officialSidebar?[
        surfaceCtx.sidebarRightTabs.register({id:'@eduwork/dsh-knowledge-studio',kind:'knowledge-studio',title:()=> 'Studio',guide:[{order:30,title:()=> 'Studio',description:()=>t('sidebarDescription')}]}),
        surfaceCtx.slots.inject('sidebar.right.pane.tab',()=>surfaceCtx.slots.register({name:'sidebar.right.pane.tab',locale:NS,key:'@eduwork/dsh-knowledge-studio',inject:()=>({surface,service,sessionMeta,openFile,previewFile,tabHandles,officialSidebar})},LocalizedSidebarStudio)),
      ]:[surfaceCtx.slots.inject('details', () => {
        let disposeEntry: undefined | (() => void)
        const activation = {
          activate() {
            if (disposeEntry) return
            disposeEntry = surfaceCtx.slots.register(
              {
                name: 'details', locale: NS,
                priority: -50,
                inject: () => ({ surface, service, sessionMeta, openFile }),
              },
              LocalizedSessionDetails,
            )
          },
          deactivate() {
            disposeEntry?.()
            disposeEntry = undefined
          },
        }
        surface.bind(activation)
        return () => {
          activation.deactivate()
          surface.bind(undefined)
        }
```

</details>

**依据 12 · 源码核查**：[packages/dsh-knowledge-studio/src/client/index.tsx:762-776](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/src/client/index.tsx#L762-L776)

普通artifact卡片走对话草稿submit。

<details>
<summary>查看原文（15行）</summary>

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
        return
```

</details>

**依据 13 · 源码核查**：[packages/dsh-knowledge-studio/lib/studio-instructions.js:11-22](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/studio-instructions.js#L11-L22)

真实草稿指令而非直接RPC执行。

<details>
<summary>查看原文（12行）</summary>

```text
export function artifactRequest(capability,parameters={}) {
  const lines=[]
  for(const parameter of capability.parameters||[]) {
    const value=parameters[parameter.id]
    if(value==null||!parameterVisible(parameter,parameters))continue
    const option=parameter.options?.find(option=>canonical(option.value)===canonical(value)&&parameterVisible(option,parameters))
    // Empty selections can be explicit choices (e.g. music off); blank text is optional.
    if(value===''&&!option)continue
    lines.push(`${parameter.label}：${option?.label||String(value)}`)
  }
  return `请基于当前工作区生成${capability.title}，并将成果保存在 Studio。${lines.length?'\n\n'+lines.join('\n'):''}\n\n按 knowledge-studio 技能创建并登记成果，完成后确认其出现在 Studio 最近成果中。保留可核验的资料来源。资料不足时请明确说明。直接使用工作区原始资料。`
}
```

</details>

**依据 14 · 源码核查**：[packages/dsh-knowledge-studio/lib/tools.js:23-30](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/tools.js#L23-L30)

默认一个生成工具/八kind。

```text
export function installKnowledgeStudioTools(ctx, manager, artifacts, {indexedRetrievalTools=false}={}) {
  if (artifacts) ctx.tools.register(defineTool({
    name: 'knowledge_studio_create_artifact',
    description: 'Generate and save a grounded Studio report, mindmap, quiz, flashcards, table, slides, audio or video using current workspace files. Only report success when status is completed. To fix or improve the SAME deliverable in this turn, including a completed file needing edits, pass its returned artifactId as retryArtifactId or reuse its targetKey. Prior versions remain saved and only the final version appears in recent artifacts. Use distinct targetKey values only when the user requests separate deliverables, never for revision numbers or title changes.',
    parameters: {
      kind: { type: 'string', required: true, enum: ['quiz', 'flashcards', 'report', 'mindmap', 'table', 'slides', 'audio', 'video'] },
      retryArtifactId: {type:'string',description:'ArtifactId from this turn to revise the same deliverable, whether its last attempt failed or completed. Keeps prior versions.'},
      targetKey: {type:'string',description:'Stable identity for a user-requested deliverable, unchanged across retries, title/focus changes and completed-file edits. Use different keys only for separate requested outputs, not v1/v2/v3.'},
```

**依据 15 · 源码核查**：[packages/dsh-knowledge-studio/lib/tools.js:59-74](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/tools.js#L59-L74)

真实workspace/start/wait及检索开关。

<details>
<summary>查看原文（16行）</summary>

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
    },
    presentCall: args => ({ card: 'generic', title: `Studio · ${args.kind}`, kind: 'read' }),
  }))

  if(!indexedRetrievalTools)return
  ctx.tools.register(defineTool({
```

</details>

**依据 16 · 源码核查**：[packages/dsh-knowledge-studio/lib/tools.js:74-149](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/tools.js#L74-L149)

四个旧检索工具均在开关后注册并实际调用manager。

<details>
<summary>查看原文（76行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'knowledge_studio_status',
    description: 'Report the optional local knowledge-index status. Studio creation reads source files directly and does not require this index. This never starts indexing.',
    parameters: {},
    output: {
      schema: { type: 'object', additionalProperties: false, properties: {
        indexed: { type: 'boolean', required: true }, statusJSON: { type: 'string', required: true },
      } },
      render: (_args, value) => renderJSON('knowledge_studio_status', JSON.parse(value.statusJSON)),
    },
    async execute(_args, exec) {
      const workspace = await manager.workspaceForAgent(exec.agent)
      const status = await manager.status(workspace)
      return { indexed: status.indexed, statusJSON: JSON.stringify({ ...status, studioRequiresIndex:false, task: manager.task(workspace.id) }) }
    },
    presentCall: () => ({ card: 'generic', title: 'Check workspace knowledge', kind: 'read' }),
  }))

  ctx.tools.register(defineTool({
    name: 'knowledge_studio_search',
    description: 'Search the locally indexed current DSH Workspace. Returns revision-bound Evidence ids, paths, headings, locators, and text. Try several lexical queries when the first wording is too broad.',
    parameters: {
      query: { type: 'string', required: true, description: 'Natural-language, filename, symbol, path, or keyword query.' },
      limit: { type: 'integer', description: 'Maximum results, 1-50; defaults to 10.' },
      path_prefix: { type: 'string', description: 'Optional workspace-relative path prefix.' },
    },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: {
        results: { type: 'array', required: true, items: { type: 'object', additionalProperties: true } },
      } },
      render: (_args, value) => renderJSON('knowledge_studio_results', value.results),
      presentationMeta: (_args, value) => searchMeta(value.results),
    },
    async execute(args, exec) {
      const workspace = await manager.workspaceForAgent(exec.agent)
      return { results: await manager.search(workspace, args.query, { limit: args.limit, pathPrefix: args.path_prefix }) }
    },
    presentCall: args => ({ card: 'generic', title: `Search workspace · ${args.query}`, kind: 'search', rawInput: args.query }),
    presentResult: (_args, result) => searchViewFromResult(result),
  }))

  ctx.tools.register(defineTool({
    name: 'knowledge_studio_read',
    description: 'Read one exact indexed chunk returned by knowledge_studio_search.',
    parameters: { chunk_id: { type: 'string', required: true } },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: {
        found: { type: 'boolean', required: true }, chunkJSON: { type: 'string', required: true },
      } },
      render: (_args, value) => renderJSON('knowledge_studio_chunk', JSON.parse(value.chunkJSON)),
    },
    async execute(args, exec) {
      const workspace = await manager.workspaceForAgent(exec.agent)
      const chunk = await manager.readChunk(workspace, args.chunk_id)
      return { found: Boolean(chunk), chunkJSON: JSON.stringify(chunk) }
    },
    presentCall: () => ({ card: 'generic', title: 'Read workspace evidence', kind: 'read' }),
  }))

  ctx.tools.register(defineTool({
    name: 'knowledge_studio_neighbors',
    description: 'Read deterministic context around one indexed chunk: preceding/following chunks and explicitly linked files.',
    parameters: { chunk_id: { type: 'string', required: true } },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: {
        found: { type: 'boolean', required: true }, neighborsJSON: { type: 'string', required: true },
      } },
      render: (_args, value) => renderJSON('knowledge_studio_neighbors', JSON.parse(value.neighborsJSON)),
    },
    async execute(args, exec) {
      const workspace = await manager.workspaceForAgent(exec.agent)
      const neighbors = await manager.neighbors(workspace, args.chunk_id)
      return { found: Boolean(neighbors), neighborsJSON: JSON.stringify(neighbors) }
    },
    presentCall: () => ({ card: 'generic', title: 'Read neighboring evidence', kind: 'read' }),
  }))
```

</details>

**依据 17 · 源码核查**：[packages/dsh-knowledge-studio/lib/index.js:89-107](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/index.js#L89-L107)

备用RPC确有直启artifact分支。

<details>
<summary>查看原文（19行）</summary>

```text

  async readEvidence(workspaceId, evidenceId) {
    return { workspaceId, evidence: await this.manager.readEvidence(this.workspace(workspaceId), evidenceId) }
  }

  async invokeStudio(workspaceId, capabilityId, parameters, sessionId) {
    const workspace = this.workspace(workspaceId)
    const capability = this.registry.get(capabilityId)
    if (!capability) throw new Error(`Unknown Studio capability: ${capabilityId}`)
    if (!capability.available) throw new Error(`${capability.title} is not available in this build yet`)
    if (typeof capability.execute === 'function') {
      return capability.execute({ ctx: this.ctx, workspace, parameters: parameters ?? {}, sessionId, manager: this.manager })
    }
    if (capability.execution === 'conversation') {
      return { action: 'compose', prompt: capability.prompt, capabilityId: capability.id }
    }
    if (capability.execution === 'artifact') {
      return { action: 'artifact', capabilityId: capability.id, artifact: await this.artifacts.start(workspace, capability.id, parameters, sessionId) }
    }
```

</details>

**依据 18 · 源码核查**：[packages/dsh-knowledge-studio/lib/manager.js:33-38](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/manager.js#L33-L38)

工具绑定Agent cwd的已注册workspace。

```text
  async workspaceForAgent(agent) {
    const cwd = agent?.session?.header?.cwd
    if (!cwd) throw new Error('This tool requires a DSH session attached to a workspace')
    const workspace = await this.#ctx.workspaceRegistry.resolveByPath(cwd)
    if (!workspace) throw new Error(`No DSH workspace owns the current session directory: ${cwd}`)
    return workspace
```

**依据 19 · 源码核查**：[packages/dsh-knowledge-studio/lib/skill.js:12-24](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/skill.js#L12-L24)

真实注册model/user可调用Skill。

<details>
<summary>查看原文（13行）</summary>

```text
export function installKnowledgeStudioSkill(ctx) {
  const raw = readFileSync(skillURL, 'utf8')
  const content = bodyOf(raw)
  return ctx.skills.register({
    name: 'knowledge-studio',
    description: raw.match(/^description: (.+)$/m)[1].trim(),
    whenToUse: raw.match(/^whenToUse: (.+)$/m)[1].trim(),
    invocation: { modelInvocable: true, userInvocable: true },
    source: 'bundled',
    path: skillPath,
    resourceBase: { kind: 'directory', path: dirname(skillPath) },
    content,
  })
```

</details>

#### 缺口

- 未构建/安装客户端或运行兼容宿主；未观测正常Agent按卡片请求调用与教师实际任务。
  **影响**：不能把源码slot接线、八kind或README安装例子当发行UI可用、八个Agent或学习成效验收。
  **进一步探讨**：在已准备的兼容宿主用公开短资料核一次卡片→工具→成果出现，记录不调用工具/版本不配等失败，再与普通创作技能对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 资料、模型、引用和学习反馈分别验证什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

ArtifactEngine先看既有index状态；有索引且不在scan/write阶段才查本地词法结果，未建索引则basicEvidence通过Host FS临时读原文件：最多48文档、2000受支持文件，文本256KiB/PDF8MiB，按词命中排序并限条数；已有索引的低召回仅在未指定pathPrefix时可sample。显式资料范围空则失败，不自动放宽。扫描含工作区contains、相对范围、跳过symlink/常见依赖目录与大小限制；这些不是所有宿主权限/竞态已审完的证明。

来源变短标签并加入Evidence Bundle，独立generateText沿当前会话或默认provider/model调用ctx.llm.stream；它要求纯文本JSON，拒tool-call、错误/截断/无finish/空正文，保存usage等。这里是固定检索→一次内容请求→结构校验/导出链，已核内部生成不运行自主工具决策循环；失败后是否修订由宿主Agent/用户再发起。题目校验检查题干/选项/合法correctIndex，正文校验结构/非空、过滤不在allowed集合的evidenceIds；引用明确可选，过滤后可为空。这些不证明答案事实、数值、引用语义支持或覆盖整份资料，答题“正确”只是用户选项等于同一生成结果的correctIndex。

已实现引用快照：保存路径/行页/两个hash和最多500字符摘录；不是完整原文件。readArtifact会重新算fresh，但两分支不同：file_引用verifyBasicCitation真实重读文件/PDF并比revisionHash；索引引用只manager.readEvidence→store的Chunk/CitationAnchor查询，比当前索引hash，并未该调用链重读磁盘。若文件变而索引没更新且记录仍同，fresh比较仍可为true；不泛称所有引用实时核源。UI确显示fresh=false的已变化标记并允许追问/打开来源，提示存在仍不等独立真值。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:465-487](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L465-L487)

index/files选择、有限检索和范围空失败、引用可选。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/lib/basic-evidence.js:9-27](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/basic-evidence.js#L9-L27)

真实临时读取/上限/hash/词排序。

<details>
<summary>查看原文（19行）</summary>

```text
// Bounded, ephemeral file reads through the host FS. No database or model call.
export async function basicEvidence(fs, workspace, query, { signal, limit = 32, pathPrefix = '' } = {}) {
  const scan = await scanWorkspace(fs, workspace, { signal, maxReadDocuments: 48,
    pathPrefix, maxFiles: 2000, maxTextFileBytes: 256 * 1024, maxPdfFileBytes: 8 * 1024 * 1024 })
  const terms = new Set(tokenize(query))
  const candidates = []
  for (const document of scan.documents) {
    const parsed = document.parsed ?? parseDocument({ path: document.path, text: document.text })
    for (const section of parsed.sections) for (const chunk of section.chunks) {
      const revisionHash = hash(document.text ?? JSON.stringify(parsed))
      const excerptHash = hash(chunk.content)
      const id = hash(`${workspace.id}\0${document.path}\0${revisionHash}\0${chunk.lineStart}\0${chunk.pageStart}\0${excerptHash}`)
      const tokens = new Set(tokenize(`${document.path} ${section.title} ${chunk.content}`))
      candidates.push({ ...chunk, path: document.path, heading: section.title,
        id: `file_${id}`, chunkId: `file_${id}`, evidenceId: `file_${id}`,
        revisionHash, excerptHash, score: [...terms].filter(term => tokens.has(term)).length })
    }
  }
  return candidates.sort((a, b) => b.score - a.score).slice(0, limit)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-knowledge-studio/lib/indexer.js:38-88](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/indexer.js#L38-L88)

路径/范围/symlink和文件大小检查。

<details>
<summary>查看原文（51行）</summary>

```text
  const rootTarget = await fileSystem.resolve(workspace.path, { signal })
  const rootInfo = await fileSystem.stat(rootTarget, signal)
  if (rootInfo?.type !== 'directory') throw new Error(`Workspace directory is unavailable: ${workspace.path}`)
  const rootProcessPath = fileSystem.processPath(rootTarget)
  const documents = []
  const presentPaths = []
  const unchangedPaths = []
  const knownByPath = new Map(manifest.map(entry => [String(entry.path).replaceAll('\\', '/'), entry]))
  const skipped = { unsupported: 0, tooLarge: 0, symlink: 0, outside: 0, unreadable: 0 }
  const stack = [{ target: rootTarget, processPath: rootProcessPath }]
  let discovered = 0

  scan: while (stack.length > 0) {
    if (signal?.aborted) throw signal.reason ?? new Error('Workspace indexing aborted')
    const current = stack.pop()
    const entries = await fileSystem.listDir(current.target, signal)
    if (entries.some(item => ['pyvenv.cfg', 'python.exe', 'python3.exe'].includes(item.name.toLowerCase()))) continue
    for (const entry of entries) {
      if (!fileSystem.contains(rootTarget, entry.target)) {
        skipped.outside += 1
        continue
      }
      const entryProcessPath = fileSystem.processPath(entry.target)
      const path = displayRelative(rootProcessPath, entryProcessPath)
      if (pathPrefix && path !== pathPrefix && !path.startsWith(pathPrefix + '/') && !(entry.type === 'directory' && pathPrefix.startsWith(path + '/'))) continue
      const pathInfo = await fileSystem.lstat(entry.name, { cwd: current.processPath }, signal).catch(() => undefined)
      if (pathInfo?.type === 'symlink') {
        skipped.symlink += 1
        continue
      }
      if (entry.type === 'directory') {
        // Detect Python runtimes without discarding sibling attachments.
        const managedEnvironment = /(?:^|\/)\.[^/]+\/environments(?:\/|$)/i.test(path)
        if (!managedEnvironment && !ignoredDirectories.has(entry.name.toLowerCase())) stack.push({ target: entry.target, processPath: entryProcessPath })
        continue
      }
      if (ignoredFiles.has(entry.name.toLowerCase())) {
        skipped.unsupported += 1
        continue
      }
      if (entry.type !== 'file' || !isSupportedDocumentPath(path)) {
        skipped.unsupported += 1
        continue
      }
      discovered += 1
      if (discovered > maxFiles) throw new Error(`Workspace contains more than ${maxFiles} supported files; narrow the workspace or raise maxFiles`)
      const info = entry.version ? entry : await fileSystem.stat(entry.target, signal)
      if (!info || info.type === 'other' || info.type === 'directory') continue
      const pdf = isSupportedPdfPath(path)
      const sizeLimit = pdf ? maxPdfFileBytes : maxTextFileBytes
      if (typeof info.size === 'number' && info.size > sizeLimit) {
```

</details>

**依据 4 · 源码核查**：[packages/dsh-knowledge-studio/lib/manager.js:163-181](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/manager.js#L163-L181)

status与词法查询不自动重建索引。

<details>
<summary>查看原文（19行）</summary>

```text
  async status(workspace) {
    await this.#restoreTask(workspace.id)
    const databasePath = this.databasePath(workspace.id)
    const store = await this.#store(workspace)
    if (!store) return { indexed: false, files: 0, chunks: 0, databasePath }
    const status = await store.status()
    return { indexed: Boolean(status.workspace?.indexedAt), ...status }
  }

  async search(workspace, query, options) {
    return (await this.searchDetailed(workspace, query, options)).results
  }

  async searchDetailed(workspace, query, options = {}) {
    const store = await this.#store(workspace)
    if (!store) throw new Error('This workspace knowledge index is not ready yet')
    const limit = Math.max(1, Math.min(50, Number(options.limit) || 10))
    const results = await store.search(query, { ...options, limit })
    return { results, trace: { engine: 'local-lexical', remote: false } }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-knowledge-studio/lib/generation.js:8-20](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/generation.js#L8-L20)

会话/默认模型选择。

<details>
<summary>查看原文（13行）</summary>

```text
function modelSelection(ctx, sessionId) {
  const agent = sessionId ? ctx.agents?.get(sessionId) : null
  const request = agent?.session?.requestHeader()?.config
  const fallback = ctx.agentDefaultModel?.currentSelection?.()
  const provider = request?.provider ?? fallback?.provider
  const model = request?.model ?? fallback?.model
  return provider && model ? { provider, model } : null
}

async function generateText(ctx, { sessionId, system, prompt, signal, maxTokens, purpose = 'knowledge-studio', idleTimeoutMs = 90_000, preparedGeneration }) {
  const selection = preparedGeneration?.selection ?? modelSelection(ctx, sessionId)
  if (!selection || !ctx.llm?.stream) throw new Error('No DSH model is available for Studio generation')
  if (!Number.isFinite(idleTimeoutMs) || idleTimeoutMs <= 0) throw new Error('Invalid model stream idle timeout')
```

</details>

**依据 6 · 源码核查**：[packages/dsh-knowledge-studio/lib/generation.js:33-61](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/generation.js#L33-L61)

真实stream/结束与tool-call/空输出判据。

<details>
<summary>查看原文（29行）</summary>

```text
  try {
    const policy = preparedGeneration?.policy ?? await generationPolicy(ctx, selection, sessionId, controller.signal, maxTokens)
    controller.signal.throwIfAborted()
    const { options } = policy
    generation = policy.generation
    activity()
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

**依据 7 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:489-519](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L489-L519)

有限生成各分支、校验/使用引用快照。

<details>
<summary>查看原文（31行）</summary>

```text
      if (artifact.kind === 'quiz') {
        const difficulty = { easy: '基础', medium: '中等', hard: '进阶' }[artifact.parameters.difficulty]
        const result = await generateText(this.#ctx, {
          sessionId, signal, purpose: 'knowledge-studio-quiz',
          system: '你是严谨的学习测验编辑。只能使用 Evidence Bundle，不得编造事实或引用。干扰项应可信但可由证据明确排除。只输出严格 JSON，不调用工具。',
          prompt: `生成 ${artifact.parameters.count} 道${difficulty}难度的单选题。题目覆盖不同知识点，避免仅考文件名或无意义细节。${common}\n\n输出：{"title":"测验标题","questions":[{"question":"题干","options":["选项A","选项B","选项C","选项D"],"correctIndex":0,"explanation":"基于证据的解释","evidenceIds":["S1"]}]}。correctIndex 从 0 开始；资料较少时允许少于请求题数；只填写确有对应依据的 evidenceIds。`,
        })
        draftText=result.text;generation=result.generation??null
        generated = validateQuiz(bundle.restore(artifact.kind,result.text), evidence, artifact.parameters.count)
      } else if (artifact.kind === 'flashcards') {
        const result = await generateText(this.#ctx, {
          sessionId, signal, purpose: 'knowledge-studio-flashcards',
          system: '你是严谨的学习卡片编辑。只能使用 Evidence Bundle，不得编造事实或引用。卡片正面应提出一个清晰问题，背面给出简洁且充分的答案。只输出严格 JSON，不调用工具。',
          prompt: `生成 ${artifact.parameters.count} 张抽认卡，覆盖不同知识点。${common}\n\n输出：{"title":"卡片标题","cards":[{"front":"正面问题","back":"背面答案","evidenceIds":["S1"]}]}。资料较少时允许少于请求卡片数；只填写确有对应依据的 evidenceIds。`,
        })
        draftText=result.text;generation=result.generation??null
        generated = validateFlashcards(bundle.restore(artifact.kind,result.text), evidence, artifact.parameters.count)
      } else {
        const result=await generateText(this.#ctx,{
          sessionId,signal,purpose:`knowledge-studio-${artifact.kind}`,
          system:'你是资料驱动的内容编辑。只依据提供的来源，缺失信息明确说明。输出严格 JSON。标题、引用、备注为可选，缺少则省略，不为补齐格式编造内容。不得执行或输出可执行代码。',
          prompt:`${(await readCreationGuidance(artifact.kind,{signal})).map(ref=>`共享创作参考（${ref.source}）：\n${ref.markdown}`).join('\n\n')}\n\n${studioInstructions(artifact.kind,artifact.parameters)}\n${common}\n输出格式：${CONTENT_SCHEMAS[artifact.kind]}`,
        })
        draftText=result.text;generation=result.generation??null
        generated=validateContent(artifact.kind,bundle.restore(artifact.kind,result.text),evidence)
      }
      const used = new Set(contentItems(generated).flatMap(item => item.evidenceIds))
      const citations = []
      for (const item of evidence.filter(value => used.has(value.evidenceId))) {
        const current = item.evidenceId.startsWith('file_') ? item : await this.#manager.readEvidence(workspace, item.evidenceId)
        if (current) citations.push(citationSnapshot(current))
```

</details>

**依据 8 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:264-291](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L264-L291)

题目/卡片验证允许引用空，不验答案事实。

<details>
<summary>查看原文（28行）</summary>

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
}

function validateFlashcards(text, evidence, requested) {
  const parsed = parseJSON(text)
  const allowed = new Set(evidence.map(item => item.evidenceId))
  const cards = []
  for (const item of Array.isArray(parsed.cards) ? parsed.cards : []) {
    const evidenceIds = [...new Set(Array.isArray(item?.evidenceIds) ? item.evidenceIds.filter(id => allowed.has(id)) : [])]
    if (!String(item?.front ?? '').trim() || !String(item?.back ?? '').trim()) continue
    cards.push({ id: `card${cards.length + 1}`, front: String(item.front).trim().slice(0, 700), back: String(item.back).trim().slice(0, 1400), evidenceIds })
    if (cards.length >= requested) break
  }
  if (!cards.length) throw new Error('模型未返回具有正反面内容的有效闪卡')
  return { title: String(parsed.title ?? '工作区抽认卡').trim().slice(0, 120) || '工作区抽认卡', cards }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-knowledge-studio/lib/studio-content.js:25-47](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/studio-content.js#L25-L47)

结构/非空/引用集合过滤，不是语义支持检查。

<details>
<summary>查看原文（23行）</summary>

````text
export function validateContent(kind, raw, evidence) {
  const source = text(raw, 2_000_000,'成果 JSON').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const parsed = JSON.parse(source)
  const allowed = new Set(evidence.map(item => item.evidenceId))
  const key = { report:'sections', mindmap:'nodes', table:'rows', slides:'slides', audio:'segments', video:'scenes' }[kind]
  if (!key || !Array.isArray(parsed[key]) || !parsed[key].length) throw new Error('模型未返回有效成果内容')
  const columns = kind === 'table' ? list(parsed.columns??[],26,'数据表字段').map(value => text(value, 200,'字段名称')) : undefined
  if (kind === 'table' && !columns?.length) throw new Error('数据表缺少字段')
  const items = list(parsed[key],kind==='slides'?40:kind==='mindmap'?300:kind==='table'?1000:200,'成果条目').map((item, index) => {
    if(!item||typeof item!=='object'||Array.isArray(item))throw new Error(`第 ${index+1} 项必须是对象`)
    const evidenceIds = [...new Set((Array.isArray(item.evidenceIds)?item.evidenceIds:[]).filter(id=>allowed.has(id)))]
    const common = { id: kind === 'mindmap' ? text(item.id, 60) : `item${index + 1}`, evidenceIds }
    if (kind === 'table') {
      if (!Array.isArray(item.cells) || item.cells.length > columns.length) throw new Error('数据表行与字段数量不一致')
      return { ...common, cells: columns.map((_,index) => text(item.cells[index], 32000,'单元格')) }
    }
    if (kind === 'report') return { ...common, heading:text(item.heading, 300,'小节标题'), body:text(item.body, 100000,'小节正文') }
    if (kind === 'mindmap') return { ...common, parentId:text(item.parentId,60), label:text(item.label,100), body:text(item.body) }
    if (kind === 'audio') return { ...common, speaker:item.speaker === 'B' ? 'B' : 'A', text:text(item.text, 1800) }
    if (kind === 'slides') return {...normalizeSlide(item),...common}
    return { ...common, heading:text(item.heading,80), bullets:list(item.bullets??[],6,'屏显要点').map(value => text(value,300,'要点')), notes:text(item.notes,50000,'讲稿'), narration:text(item.narration,12000,'旁白') }
  })
  if (items.some(item => !String(item.body || item.text || item.label || item.heading || item.title || item.quote || item.cells?.join('') || (kind==='slides'?slideOutline(item).join(''):item.narration||item.bullets?.join('')) || '').trim())) throw new Error('成果存在空白内容')
````

</details>

**依据 10 · 源码核查**：[packages/dsh-knowledge-studio/lib/generation.js:78-93](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/generation.js#L78-L93)

引用快照字段/500字符摘录。

<details>
<summary>查看原文（16行）</summary>

```text
function citationSnapshot(evidence) {
  return {
    evidenceId: evidence.evidenceId,
    chunkId: evidence.chunkId,
    path: evidence.path,
    heading: evidence.heading,
    locator: evidence.locator,
    pageStart: evidence.pageStart,
    pageEnd: evidence.pageEnd,
    lineStart: evidence.lineStart,
    lineEnd: evidence.lineEnd,
    excerpt: evidence.content.slice(0, 500),
    excerptHash: evidence.excerptHash,
    revisionHash: evidence.revisionHash,
    fresh: true,
  }
```

</details>

**依据 11 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:323-337](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L323-L337)

fresh两条实际消费路径。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 12 · 源码核查**：[packages/dsh-knowledge-studio/lib/basic-evidence.js:30-43](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/basic-evidence.js#L30-L43)

file_真实重读/hash比较。

<details>
<summary>查看原文（14行）</summary>

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
}
```

</details>

**依据 13 · 源码核查**：[packages/dsh-knowledge-studio/lib/manager.js:196-199](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/manager.js#L196-L199)

索引readEvidence真正callee。

```text
  async readEvidence(workspace, evidenceId) {
    const store = await this.#store(workspace)
    return store ? store.readEvidence(evidenceId) : null
  }
```

**依据 14 · 源码核查**：[packages/dsh-knowledge-studio/lib/store.js:405-412](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/store.js#L405-L412)

只查现有索引Chunk/CitationAnchor，不读活文件。

```text
  readEvidence(evidenceId) {
    return this.#serialize(async () => {
      const [row] = await this.#rows(
        'MATCH (c:Chunk)-[:HAS_EVIDENCE]->(e:CitationAnchor {id: $evidenceId}) RETURN e.id AS evidenceId, e.path AS path, e.locator AS locator, e.pageStart AS pageStart, e.pageEnd AS pageEnd, e.lineStart AS lineStart, e.lineEnd AS lineEnd, e.excerptHash AS excerptHash, e.revisionHash AS revisionHash, c.id AS chunkId, c.heading AS heading, c.content AS content',
        { evidenceId },
      )
      return row ? normalizeChunk(row) : null
    })
```

**依据 15 · 源码核查**：[packages/dsh-knowledge-studio/src/client/index.tsx:352-357](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/src/client/index.tsx#L352-L357)

正确性UI只是比生成correctIndex。

```text
    const answer = artifact.interaction?.answers?.[question.id]
    const revealed = Boolean(artifact.interaction?.revealed?.[question.id])
    const correct = revealed && Number(answer) === Number(question.correctIndex)
    const completed = questions.filter(
      (item: any) => artifact.interaction?.revealed?.[item.id],
    ).length
```

**依据 16 · 源码核查**：[packages/dsh-knowledge-studio/src/client/StudioArtifact.tsx:120-121](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/src/client/StudioArtifact.tsx#L120-L121)

实际已变化标记消费。

```text
  const itemLinks=(item:any)=><span style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>{item.evidenceIds?.map((id:string)=>{
    const index=artifact.citations?.findIndex((c:any)=>c.evidenceId===id),c=artifact.citations?.[index];return c?<button key={id} style={{...btn,padding:'2px 6px',fontSize:10}} onClick={()=>showEvidence(c)} title={c.path}>[{index+1}]{c.fresh===false?' 已变化':''}</button>:null
```

**依据 17 · 源码核查**：[packages/dsh-knowledge-studio/src/client/index.tsx:750-760](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/src/client/index.tsx#L750-L760)

来源展示分索引/文件快照，非总能显示完整原文。

<details>
<summary>查看原文（11行）</summary>

```text
  const showEvidence = (item: any) =>
    run(async () => {
      const id = item.evidenceId
      const value = id && !id.startsWith('file_')
        ? (await unwrap<any>(service.readEvidence(workspace.id, id))).evidence
        : item
      setEvidence(
        value
          ? { ...value, path: value.path || item.path, content: value.content || value.excerpt || item.excerpt }
          : { ...item, content: item.content || item.excerpt || '原始内容已经变化。' },
      )
```

</details>

#### 缺口

- 未跑召回/引用语义/题目答案/旧索引对照；未全审所有FS实现、PDF解析与各内容类型。
  **影响**：合法JSON、有效ID或fresh=true可能仍缺关键事实/依赖旧索引；不能直接当自动出题准确、教学评分或全工作区理解。
  **进一步探讨**：用已知答案短资料核每题与正文主张，注入无引/错但合法ID/旧索引和改文件；对照文件与索引分支，分开记录结构过关、来源状态和语义支持。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 完成/修订/导出/退出是否与真实工件一致？

**研究主题**：工程质量与复用、缺陷与关键质疑、效果与总成本

#### 完整回答

生成开始先保存running任务并绑定AbortController；得到正文/引用后先保存ready内容再尝试Office或媒体文件，最后才置completed，异常则failed/cancelled并保留partial draft/代次等。ArtifactStore在实例内串行变更，临时0600新文件+rename原子替换；重启把running/queued转interrupted，不自动重跑模型。写盘失败的terminal会明确persistenceError而非假称已落盘；这不证明多进程合并、磁盘灾难恢复或所有子进程都终止。

若execution提供session.snapshotEvents且有本轮turn/start，retryArtifactId/targetKey可把同轮同kind成品修订放同一id并保attempts；session turn/end hook等待对应任务再settle，presentArtifact在open期间显示等待轮末，最后修改失败时可回显此前成功版并给warning。缺该turn接口/直接RPC时不能概括同样受轮末门控；这也不保证宿主自动修好内容。Client确轮询readArtifact并传给StudioArtifact/ArtifactPanel，答案/翻卡等交互经remote回存，而非只服务端元数据。

report/table/slides的Office分支在有Agent和相应工具时走ctx.tools.execute create→validate→inspect，携parent/agent/signal，并核实际输出realpath在工作区再复制；工具拒绝会throw，调用者不会把该异常吞成不受管Python回退。缺工具或没有execution的直启路径才可返回null而用共享exportDocument→runOffice→真实Python execFile，故不能称所有入口都有相同工具审批。结构验证/inspect不证明内容事实或渲染保真。

预览已有Office不重跑模型：原生入口交所属Session文件地址给官方Sidebar，兼容服务renderOfficePreview读取实际文件字节并按hash缓存；PDF有明确两路径：仅officeFormatFor(kind)有值且officialOfficeRuntime()条件成立时，取已保存Office（没有则先生成该Office）交convertOfficeFile；转换异常清临时目录后重抛，不自动换浏览器。未进入该条件分支时，调用exportDocument(...,html)，再由Chromium setContent/page.pdf打印。HTML子路径对幻灯片/已有Office可读取实际Office预览，其他则从保存的报告正文或contentMarkdown重组HTML。因此不能泛称PDF始终直接转换原Office或始终同一渲染器；分页、字体、外部编辑保留和版式/内容一致性均未实测。合格shared-office导出失败可校验保存内容/引用集合hash后只重导出，office-tools失败禁止用该入口绕权限；这不是再次核活文件或所有失败都能无费恢复。删除是标deletedAt，未删除导出文件；close发送abort并等待本插件任务，已耗模型费/已写工件不会自动回滚。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:441-456](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L441-L456)

真实任务/控制器/后台promise。

<details>
<summary>查看原文（16行）</summary>

```text
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
    return artifact
```

</details>

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:521-544](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L521-L544)

先存内容、真实导出后completed/失败保存。

<details>
<summary>查看原文（24行）</summary>

```text
      const savedSources=new Set(citations.map(citation=>citation.evidenceId))
      for(const item of contentItems(generated))item.evidenceIds=item.evidenceIds.filter(id=>savedSources.has(id))
      const interaction = artifact.kind === 'quiz' ? { current: 0, answers: {}, revealed: {} } : { current: 0, flipped: false, grades: {} }
      const ready={...artifact,title:generated.title,content:generated,citations,interaction,generation}
      const officeFormat=officeFormatFor(artifact.kind)
      if(officeFormat)exportState={version:1,format:officeFormat,validatedContentHash:validateSavedOfficeContent(ready),validatedAt:now(),provider:execution?.agent&&this.#ctx.tools?.get({docx:'office_document',pptx:'office_presentation',xlsx:'office_spreadsheet'}[officeFormat])?'office-tools':'shared-office',phase:'running',attempts:1,lastAttemptAt:now()}
      await this.#store.update(artifact.id,{...ready,phase:'export',...(exportState?{exportState}:{})})
      const exports=[]
      const exportDirectory=artifactExportDirectory(this.#outputRoot,artifact)
      if(['audio','video'].includes(artifact.kind)) {
        const media=await renderMedia(ready,exportDirectory,signal,message=>{void this.#store.update(artifact.id,{phase:'render',message}).catch(error=>this.#ctx.logger?.warn?.('Studio progress persistence failed',error))},this.#mediaProviders,{sessionId,workspace,execution})
        const {attachments=[],...file}=media
        exports.push(file,...attachments)
      }
      if(officeFormat) {
        const directory=exportDirectory
        exports.push(await exportWithOfficeTools(this.#ctx,ready,directory,officeFormat,{execution,signal}) || await exportDocument(ready,directory,officeFormat,{signal}))
      }
      signal.throwIfAborted()
      await this.#store.update(artifact.id, { status: 'completed', phase: 'done', processed: 2, total: 2, exports, message: '',...(exportState?{exportState:{...exportState,phase:'complete',completedAt:now()}}:{}) })
    } catch (error) {
      const partialText=error?.partialText||draftText
      await this.#store.failAttempt(artifact.id, { status: signal.aborted ? 'cancelled' : 'failed', phase: 'done', message: safeMessage(error),generation:error?.generation??generation,...(exportState?{exportState:{...exportState,phase:'failed',lastError:safeMessage(error),blocked:deniedExport(error)}}:{}),...(partialText?{draft:{text:partialText,format:'json',reason:exportState?'export':error?.code==='STUDIO_OUTPUT_LIMIT'?'output-limit':error?.partialText?'interrupted':'validation',generation:error?.generation??generation,evidenceLabels}}:{}) })
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:86-133](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L86-L133)

重启中断/实例内串行/未落盘terminal显式标记。

<details>
<summary>查看原文（48行）</summary>

```text
  async #readState() {
    let state
    try { state = normalizeState(JSON.parse(await readFile(this.#path, 'utf8'))) }
    catch (error) {
      if (error?.code !== 'ENOENT') throw error
      state = emptyState()
    }
    let changed = false
    for (let index=0;index<state.artifacts.length;index++) {
      const artifact=state.artifacts[index]
      if (['queued', 'running'].includes(artifact.status)) {
        artifact.status = 'interrupted'
        artifact.phase = 'done'
        artifact.message = canRetryOfficeExport(artifact)?'上次进程在导出完成前退出，已保存正文，可重试导出。':'上次进程在生成完成前退出，请重新生成。'
        artifact.updatedAt = now()
        changed=true
      }
      if(artifact.lifecycle?.state==='open') {
        state.artifacts[index]=settleArtifact(artifact,{kind:'interrupted'})
        changed=true
      }
    }
    if (changed) await this.#write(state)
    this.#state=state
    return this.#state
  }

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
    return task
```

</details>

**依据 4 · 源码核查**：[packages/dsh-knowledge-studio/lib/atomic-json.js:6-23](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/atomic-json.js#L6-L23)

0600临时文件/rename与保原件，非多进程事务。

<details>
<summary>查看原文（18行）</summary>

```text
// Rename preserves the previous file on failure. Never unlink the destination
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

**依据 5 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifact-lifecycle.js:1-42](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifact-lifecycle.js#L1-L42)

条件turn、呈现门和旧成功恢复。

<details>
<summary>查看原文（42行）</summary>

```text
// Session events own turn boundaries; tool completion is only an attempt.
export function executionTurn(execution) {
  const session=execution?.agent?.session
  if(!session?.snapshotEvents)return null
  const events=session.snapshotEvents()
  for(let index=events.length-1;index>=0;index--) {
    const event=events[index]
    if(event.type==='turn/end')return null
    if(event.type==='turn/start')return {sessionId:String(session.id),turn:event.data.turn}
  }
  return null
}
export function presentArtifact(artifact) {
  if(artifact.lifecycle?.state!=='open'||artifact.persistenceError)return artifact
  return {...artifact,attemptStatus:artifact.status,status:'running',
    phase:artifact.status==='running'?artifact.phase:'turn',
    message:artifact.status==='completed'?'成果已生成，等待本轮对话结束':artifact.status==='failed'?'本次尝试未完成，等待本轮修复结果':artifact.message}
}
export function sameArtifactTarget(artifact,kind,parameters) {
  return artifact.kind===kind&&
    (artifact.parameters.pathPrefix||'')===(parameters.pathPrefix||'')
}
export function attemptSnapshot(artifact) {
  const {attempts,lifecycle,...attempt}=artifact
  return {...attempt,callId:lifecycle?.callId||null,finishedAt:artifact.updatedAt}
}

export function settleArtifact(artifact,reason) {
  const endedAt=new Date().toISOString()
  const lifecycle={...artifact.lifecycle,state:'settled',endedAt,reason:reason?.kind||'completed'}
  if(artifact.status!=='completed') {
    const successful=[...(artifact.attempts||[])].reverse().find(attempt=>attempt.status==='completed')
    if(successful) return {...successful,
      id:artifact.id,workspaceId:artifact.workspaceId,sessionId:artifact.sessionId,
      ...(artifact.deletedAt?{deletedAt:artifact.deletedAt}:{}),
      lifecycle,updatedAt:endedAt,
      attempts:[...(artifact.attempts||[]).filter(attempt=>attempt!==successful),attemptSnapshot(artifact)],
      revisionWarning:`最后一次修改未完成，显示第 ${successful.version} 版；修改记录已保留。`,
    }
  }
  return {...artifact,lifecycle,updatedAt:endedAt}
}
```

</details>

**依据 6 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:136-164](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L136-L164)

同轮目标修订/历史与条件。

<details>
<summary>查看原文（29行）</summary>

```text
  create(workspace, kind, parameters, sessionId = null, lifecycle = null, retryArtifactId = null) {
    if (!SUPPORTED_KINDS.has(kind)) throw new Error(`Unsupported interactive artifact: ${kind}`)
    return this.#mutate(state => {
      const timestamp = now()
      const candidates=lifecycle?state.artifacts.filter(item=>!item.deletedAt&&item.workspaceId===String(workspace.id)&&item.sessionId===sessionId&&item.lifecycle?.state==='open'&&item.lifecycle.turn===lifecycle.turn):[]
      let previous
      if(retryArtifactId) {
        previous=candidates.find(item=>item.id===retryArtifactId)
        if(!previous||previous.kind!==kind||!['failed','cancelled','completed'].includes(previous.status))throw new Error('retryArtifactId must identify a finished attempt of the same kind in this turn; wait for any running attempt first')
      } else if(lifecycle?.targetKey) {
        previous=candidates.find(item=>item.lifecycle.targetKey===lifecycle.targetKey)
        if(previous&&(previous.kind!==kind||!['failed','cancelled','completed'].includes(previous.status)))throw new Error('This target has a different kind or is still running; wait for it before revising the same deliverable')
      } else {
        // Focus/title change during revisions; explicit keys preserve separate deliverables.
        const matching=candidates.filter(item=>!item.lifecycle.targetKey&&sameArtifactTarget(item,kind,parameters))
        if(matching.length===1&&['failed','cancelled','completed'].includes(matching[0].status))previous=matching[0]
      }
      const artifact = {
        id: previous?.id || `artifact_${randomUUID().replaceAll('-', '')}`, kind, workspaceId: String(workspace.id), workspaceTitle: workspace.title,
        sessionId,
        title: `${workspace.title} · ${{quiz:'测验',flashcards:'闪卡',report:'报告',mindmap:'思维导图',table:'数据表',slides:'演示文稿',audio:'音频概览',video:'视频概览'}[kind]}`, parameters,
        status: 'running', phase: 'retrieve', processed: 0, total: null, message: '',
        content: null, citations: [], interaction: {}, version: previous ? previous.version+1 : 1, createdAt: previous?.createdAt || timestamp, updatedAt: timestamp,
        ...(lifecycle?{lifecycle:{...lifecycle,targetKey:previous?.lifecycle.targetKey||lifecycle.targetKey||null,state:'open'},attempts:previous?[...(previous.attempts||[]),attemptSnapshot(previous)]:[]}:{}),
      }
      if(previous)state.artifacts[state.artifacts.indexOf(previous)]=artifact
      else state.artifacts.push(artifact)
      return artifact
    })
```

</details>

**依据 7 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:303-319](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L303-L319)

真实session/event turn/end调用settle。

<details>
<summary>查看原文（17行）</summary>

```text
  constructor(ctx, manager, { artifactPath, mediaProviders, writeArtifactState } = {}) {
    this.#ctx = ctx
    this.#manager = manager
    this.#mediaProviders = mediaProviders
    this.#store = new ArtifactStore(artifactPath,{writeState:writeArtifactState})
    this.#outputRoot = join(artifactPath ? dirname(artifactPath) : dshHomePath('plugins','dsh-knowledge-studio'), 'exports')
    ctx.on?.('session/event',(session,event)=>{
      if(event.type!=='turn/end')return
      const settlement=this.settleTurn(session.id,event.data.turn,event.data.reason)
      this.#settlements.add(settlement)
      void settlement.catch(error=>ctx.logger?.warn?.('Studio turn settlement failed',error)).finally(()=>this.#settlements.delete(settlement))
    })
  }

  async settleTurn(sessionId,turn,reason) {
    await Promise.allSettled([...this.#tasks.values()].filter(task=>task.sessionId===String(sessionId)&&task.turn===turn).map(task=>task.promise))
    return this.#store.settleTurn(sessionId,turn,reason)
```

</details>

**依据 8 · 源码核查**：[packages/dsh-knowledge-studio/src/client/index.tsx:711-727](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/src/client/index.tsx#L711-L727)

当前UI真实轮询readArtifact。

<details>
<summary>查看原文（17行）</summary>

```text
    let timer: ReturnType<typeof setTimeout>
    const load = async () => {
      try {
        const value = await unwrap<any>(service.readArtifact(artifactId))
        if (!disposed) setArtifact(value.artifact)
      } catch (cause: any) {
        if (!disposed) setError(cause?.message || String(cause))
      } finally {
        if (!disposed) timer = setTimeout(load, 2000)
      }
    }
    void load()
    return () => {
      disposed = true
      clearTimeout(timer)
    }
  }, [artifactId])
```

</details>

**依据 9 · 源码核查**：[packages/dsh-knowledge-studio/src/client/index.tsx:803-807](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/src/client/index.tsx#L803-L807)

交互调用并消费回包。

```text
  const updateArtifact = async (action: string, itemId: string, value: any) => {
    const result = await unwrap<any>(
      service.updateArtifactInteraction(artifact.id, action, itemId, value),
    )
    setArtifact(result.artifact)
```

**依据 10 · 源码核查**：[packages/dsh-knowledge-studio/src/client/index.tsx:884-912](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/src/client/index.tsx#L884-L912)

真实渲染/导出/管理/学习子组件消费。

<details>
<summary>查看原文（29行）</summary>

```text
  if (artifactId)
    return (
      <StudioArtifact artifact={artifact?.id===artifactId?artifact:null} back={()=>setArtifactId('')} close={close}
        expanded={!officialSidebar&&surface.getSnapshot().reading} expand={officialSidebar?undefined:()=>surface.setReading(true)}
        memory={surface.sessionState(sessionId).mindmaps?.[artifactId]}
        remember={(value:any)=>surface.remember(sessionId,{mindmaps:{...surface.sessionState(sessionId).mindmaps,[artifactId]:value}})}
        showEvidence={showEvidence} askAI={askArtifact}
        previewFile={previewFile ? (path:string)=>previewFile(sessionId,path) : undefined}
        exportFile={async(format:string)=>(await unwrap<any>(service.exportArtifact(artifactId,format))).file}
        manage={async(action:string,value:string)=>{
          if(action==='retry') {
            surface.setReading(false)
            const capability=workspace.capabilities.find((c:any)=>c.id===artifact.kind)
            surface.remember(sessionId,{awaitingArtifactSince:new Date().toISOString(),artifactId:''})
            inputActions.setDraft(artifactRequest(capability,artifact.parameters));inputActions.submit();return
          }
          const result=await unwrap<any>(service.manageArtifact(artifactId,action,value,sessionId))
          if(action==='delete')setArtifactId('');else setArtifact(result.artifact)
          await refresh()
        }}>
      <ArtifactPanel
        artifact={artifact}
        back={() => setArtifactId('')}
        close={close}
        update={updateArtifact}
        askAI={askArtifact}
        showEvidence={showEvidence}
      />
      </StudioArtifact>
```

</details>

**依据 11 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:210-232](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L210-L232)

交互持久变更与状态检查。

<details>
<summary>查看原文（23行）</summary>

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
      artifact.updatedAt = now()
      return artifact
```

</details>

**依据 12 · 源码核查**：[packages/dsh-knowledge-studio/lib/office-tools.js:8-34](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/office-tools.js#L8-L34)

真实受管工具链、拒绝throw、路径约束复制。

<details>
<summary>查看原文（27行）</summary>

```text
export async function exportWithOfficeTools(ctx,artifact,directory,format,{execution,signal}={}) {
  const name={docx:'office_document',xlsx:'office_spreadsheet',pptx:'office_presentation'}[format]
  if(!name||!execution?.agent||!ctx.tools?.get(name))return null
  const spec=officeSpec(artifact)
  const call=async arguments_=>{
    signal?.throwIfAborted()
    const result=await ctx.tools.execute({callId:randomUUID(),rootCallId:execution.rootCallId||execution.callId,parent:execution.token,agent:execution.agent,signal,name,arguments:arguments_})
    if(result.isError)throw new Error(result.error?.message||'Office 文件生成未获批准或未完成')
    for(const context of result.additionalContexts||[])execution.deferContext?.(context)
    if(result.concludesTurn)execution.concludeTurn?.()
    return {value:result.value,report:JSON.parse(result.value.reportJSON)}
  }
  const output=`.studio/office/${artifact.id}-${randomUUID().slice(0,8)}.${format}`
  const created=await call({action:'create',output_path:output,spec_json:JSON.stringify(spec)})
  if(created.report.ok!==true||created.value.relativePath!==output)throw new Error('Office 工具未返回预期成果')
  const validation=await call({action:'validate',input_path:output})
  if(validation.report.valid!==true)throw new Error('Office 文件结构验证未通过')
  const inspected=await call({action:'inspect',input_path:output})
  if(inspected.report.ok!==true)throw new Error('Office 文件读取验证未通过')
  const root=await ctx.fs.resolve('.',{cwd:execution.agent.session.header.cwd,signal})
  const source=await ctx.fs.resolve(output,{cwd:execution.agent.session.header.cwd,signal})
  const rootPath=await realpath(ctx.fs.processPath(root)),sourcePath=await realpath(ctx.fs.processPath(source)),rel=relative(rootPath,sourcePath)
  if(isAbsolute(rel)||rel==='..'||rel.startsWith('..\\')||rel.startsWith('../'))throw new Error('Office 输出超出当前工作区')
  await mkdir(directory,{recursive:true})
  const path=join(directory,`${artifact.id}.${format}`)
  await copyFile(sourcePath,path)
  return {format,path,fileName:`${artifact.id}.${format}`,provider:'office-tools',workspacePath:output,validation:validation.report.summary||{valid:true},...(format==='pptx'?{pageCount:created.report.slide_count,sourcePages:created.report.source_pages,adaptations:created.report.adaptations}:{})}
```

</details>

**依据 13 · 源码核查**：[packages/dsh-knowledge-studio/lib/studio-export.js:92-100](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/studio-export.js#L92-L100)

共享Office实际create/validate。

```text
  } else if (['docx','pptx','xlsx'].includes(format)) {
    const kind={docx:'document',pptx:'presentation',xlsx:'spreadsheet'}[format]
    const exists=await stat(path).then(()=>true,error=>{if(error.code==='ENOENT')return false;throw error})
    if(exists){const validation=await runOffice({projectPath:directory,signal,request:normalizeOfficeRequest(kind,{action:'validate',input_path:artifact.id+'.'+format})});if(validation.report.valid!==true)throw new Error('Office 文件结构验证未通过');return {format,path,fileName:artifact.id+'.'+format,...(format==='pptx'?{pageCount:validation.report.summary?.slide_count}:{})}}
    const result=await runOffice({projectPath:directory,signal,request:normalizeOfficeRequest(kind,{action:'create',output_path:artifact.id+'.'+format,spec_json:JSON.stringify(officeSpec(artifact))})})
    if(result.report.ok!==true)throw new Error('Office creation failed')
    const validation=await runOffice({projectPath:directory,signal,request:normalizeOfficeRequest(kind,{action:'validate',input_path:artifact.id+'.'+format})})
    if(validation.report.valid!==true)throw new Error('Office 文件结构验证未通过')
    return {format,path,fileName:`${artifact.id}.${format}`,...(format==='pptx'?{pageCount:result.report.slide_count,sourcePages:result.report.source_pages,adaptations:result.report.adaptations}:{})}
```

**依据 14 · 源码核查**：[packages/dsh-knowledge-studio/packages/artifact-services/lib/office.js:176-188](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/packages/artifact-services/lib/office.js#L176-L188)

共享callee真实Python execFile/timeout/signal。

<details>
<summary>查看原文（13行）</summary>

```text
  if(request.action==='validate'&&request.format!=='pdf') {
    const inputPath=await officeInputPath(projectPath,request.inputPath)
    if((await stat(inputPath)).size>256*1024*1024)throw new Error('Office input exceeds the 256 MiB validation limit')
  }
  const invocation = buildOfficeInvocation(request, projectPath)
  const stdout = await execFilePromise(privatePython(environment), invocation.args, {
    cwd: projectPath, env: environment, windowsHide: true, timeout: 180_000,
    signal, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024,
  }, execFileImpl)
  let report
  try {
    report = JSON.parse(stdout.trim())
  } catch {
```

</details>

**依据 15 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:361-375](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L361-L375)

预览不再生成、未完成导出限制。

<details>
<summary>查看原文（15行）</summary>

```text
  async export(artifactId,format) {
    const artifact=await this.#store.read(artifactId)
    if(format==='preview') {
      const format=officeFormatFor(artifact.kind),file=artifact.exports?.find(item=>item.format===format)
      if(!format||!file)throw new Error(`${format?.toUpperCase()||'Office'} 文件尚未生成，请先完成文件生成`)
      // Viewing never creates/recreates a file or invokes a model, including old
      // artifacts whose text survived an unsuccessful Office export.
      return renderOfficePreview(file.path)
    }
    if(format==='draft') {
      if(!artifact.draft?.text)throw new Error('此成果没有未完成草稿')
      return {format:'txt',fileName:`${artifact.id}-draft.txt`,data:Buffer.from(artifact.draft.text).toString('base64')}
    }
    if(!artifact.content)throw new Error('成果尚未生成内容')
    if(officeFormatFor(artifact.kind)&&artifact.status!=='completed'&&['docx','pptx','xlsx','html','pdf'].includes(format))throw new Error('文件尚未成功导出，请使用“重试导出”；重新生成会再次调用模型')
```

</details>

**依据 16 · 源码核查**：[packages/dsh-knowledge-studio/src/client/file-preview.ts:1-8](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/src/client/file-preview.ts#L1-L8)

原生预览按所属Session打开原文件地址。

```text
import { sessionFileAddress } from '@deepseek-ai/dsh-util-workspace-path'

// Use the owning Studio tab's Session, never the globally selected Session.
// The official reader resolves and authorizes the original file on the Host.
export function openStudioFilePreview(sidebar: { openResource(address: string): unknown }, sessionId: string, path: string) {
  if (!sessionId || !path) throw new Error('A Session and a saved file are required for preview')
  return sidebar.openResource(sessionFileAddress(sessionId, path))
}
```

**依据 17 · 源码核查**：[packages/dsh-knowledge-studio/packages/artifact-services/lib/office-preview.js:41-64](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/packages/artifact-services/lib/office-preview.js#L41-L64)

兼容预览真实字节与快照/cache。

<details>
<summary>查看原文（24行）</summary>

```text
export async function renderOfficePreview(filePath, signal, runtime = { execFile, environment: process.env }) {
  signal?.throwIfAborted()
  const environment=runtime.environment||process.env
  let python
  try {python=privatePython(environment)} catch(error){throw new Error('Office 预览运行时尚未就绪，请稍后重试',{cause:error})}
  if (typeof python !== 'string' || python.trim() === '') {
    throw new Error('Office 预览运行时尚未就绪，请稍后重试')
  }
  // Read and authorize at the caller on every request; a cache hit never bypasses
  // reading the current file. Convert these exact bytes in an isolated snapshot.
  const handle=await open(filePath,'r')
  let source
  try {assertOfficeSourceSize((await handle.stat()).size);source=await handle.readFile();assertOfficeSourceSize(source.length)} finally {await handle.close()}
  signal?.throwIfAborted()
  const sourceHash=digest(source),rendererVersion='fixed-page-v1:'+digest(await readFile(rendererPath))
  const fontFingerprint=digest(JSON.stringify({platform:process.platform,python,fonts:environment.DSH_OFFICE_FONT_FINGERPRINT||'system-default',config:environment.FONTCONFIG_FILE||'',path:environment.FONTCONFIG_PATH||'',locale:environment.LANG||''}))
  const extension=extname(filePath).toLowerCase()
  const cacheKey=digest(JSON.stringify([sourceHash,rendererVersion,fontFingerprint,extension]))
  const previous=cache.get(cacheKey)
  if(previous&&Date.now()-previous.at<CACHE_TTL){cache.delete(cacheKey);cache.set(cacheKey,previous);return structuredClone(previous.value)}
  const directory=await mkdtemp(join(tmpdir(),'dsh-office-preview-'))
  try {
    const snapshot=join(directory,'source'+extension)
    await writeFile(snapshot,source)
```

</details>

**依据 18 · 源码核查**：[packages/dsh-knowledge-studio/lib/studio-export.js:55-66](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/studio-export.js#L55-L66)

HTML子路径分实际Office预览与保存正文/Markdown重组。

<details>
<summary>查看原文（12行）</summary>

```text
  else if (format === 'html') {
    if(artifact.kind==='slides'||artifact.exports?.some(file=>file.format===officeFormatFor(artifact.kind))) {
      // Reuse the actual Office artifact, including legacy files or a file edited
      // outside Studio. Preview, HTML and PDF never recompose stored slide text.
      const original=artifact.exports?.find(file=>file.format===officeFormatFor(artifact.kind))
      const file=original??await exportDocument(artifact,directory,'pptx')
      assertOfficeSourceSize((await stat(file.path)).size)
      const preview=await renderOfficePreview(file.path)
      await writeFile(path,preview.html)
      return {format,path,fileName:`${artifact.id}.${format}`}
    }
    const body = artifact.kind === 'report' ? reportHTML(artifact) : `<pre>${escapeHTML(contentMarkdown(artifact))}</pre>`
```

</details>

**依据 19 · 源码核查**：[packages/dsh-knowledge-studio/lib/studio-export.js:68-91](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/studio-export.js#L68-L91)

PDF条件Office转换与HTML/Chromium打印两路径，转换异常重抛。

<details>
<summary>查看原文（24行）</summary>

```text
  } else if (format === 'pdf') {
    const officeFormat=officeFormatFor(artifact.kind)
    if(officeFormat&&officialOfficeRuntime()) {
      // Export the saved Office file, including external edits. Do not rebuild
      // its contents as HTML or silently print with a different renderer.
      const original=artifact.exports?.find(file=>file.format===officeFormat)
        ?? await exportDocument(artifact,directory,officeFormat,{signal})
      const conversionDirectory=await mkdtemp(join(directory,`${artifact.id}-pdf-`))
      try {
        const pdfPath=join(conversionDirectory,`${artifact.id}.pdf`)
        const conversion=await convertOfficeFile({inputPath:original.path,outputPath:pdfPath,signal})
        return {format,path:pdfPath,fileName:`${artifact.id}.pdf`,provider:conversion.provider,sourcePath:original.path}
      } catch(error) {await rm(conversionDirectory,{recursive:true,force:true});throw error}
    }
    const html=await exportDocument(artifact,directory,'html')
    const {chromium}=await import('playwright-core')
    const {browserExecutable}=await createMediaRuntime()
    const browser=await chromium.launch({executablePath:browserExecutable,headless:true})
    try {
      const page=await browser.newPage();await page.route('**/*',route=>route.abort())
      await page.setContent(await readFile(html.path,'utf8'))
      await page.evaluate(()=>document.fonts.ready)
      await page.pdf(artifact.kind==='slides'?{path,preferCSSPageSize:true,printBackground:true,margin:{top:0,bottom:0,left:0,right:0}}:{path,format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'10mm',right:'10mm'}})
    } finally {await browser.close()}
```

</details>

**依据 20 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:391-423](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L391-L423)

恢复只重导出、checkpoint比对与拒绝绕受管工具。

<details>
<summary>查看原文（33行）</summary>

```text
  #retryOfficeExport(artifactId) {
    if(this.#tasks.has(artifactId))return Promise.reject(new Error('成果正在处理，请等待当前任务完成'))
    const controller=new AbortController(),signal=controller.signal
    let accept,reject
    const accepted=new Promise((resolve,fail)=>{accept=resolve;reject=fail})
    const promise=Promise.resolve().then(async()=>{
      let started=false,exportState
      try {
        const artifact=await this.#store.read(artifactId)
        if(!canRetryOfficeExport(artifact))throw new Error('此成果没有可恢复的导出失败记录；未完成正文或无效来源草稿不能重试导出')
        if(!this.#ctx.workspaceRegistry.get(artifact.workspaceId))throw new Error('原工作区不可用')
        const contentHash=validateSavedOfficeContent(artifact)
        if(artifact.exportState?.validatedContentHash&&artifact.exportState.validatedContentHash!==contentHash)throw new Error('保存的正文或来源已变化，不能使用原导出校验记录')
        // A governed tool denial must never become an ungoverned Python retry.
        if(artifact.exportState?.provider==='office-tools')throw new Error('此导出使用受管 Office 工具，请从原对话重新执行导出工具以保留权限检查')
        signal.throwIfAborted()
        exportState={version:1,format:officeFormatFor(artifact.kind),validatedContentHash:contentHash,validatedAt:artifact.exportState?.validatedAt||now(),provider:'shared-office',phase:'running',attempts:(artifact.exportState?.attempts||1)+1,lastAttemptAt:now(),recoveredFromLegacy:isLegacyOfficeExportFailure(artifact)||Boolean(artifact.exportState?.recoveredFromLegacy)}
        const running=await this.#store.update(artifactId,{status:'running',phase:'export',message:'正在使用已保存正文重试导出',processed:1,total:2,exportState})
        started=true;accept(running)
        const directory=join(this.#outputRoot,artifactId,'export-'+randomUUID().slice(0,8))
        const file=await exportDocument(artifact,directory,exportState.format,{signal})
        signal.throwIfAborted()
        // Only this successful file attempt changes completion; original model
        // statistics, content, citations and raw draft remain untouched.
        await this.#store.update(artifactId,{status:'completed',phase:'done',processed:2,total:2,message:'',exports:[...(artifact.exports||[]).filter(item=>item.format!==file.format),file],exportState:{...exportState,phase:'complete',completedAt:now()}})
      }catch(error) {
        if(!started){reject(error);return}
        await this.#store.failAttempt(artifactId,{status:signal.aborted?'cancelled':'failed',phase:'done',message:safeMessage(error),exportState:{...exportState,phase:'failed',lastError:safeMessage(error),blocked:deniedExport(error)}})
      }
    }).finally(()=>{this.#tasks.delete(artifactId)})
    this.#tasks.set(artifactId,{controller,promise})
    return accepted
  }
```

</details>

**依据 21 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:31-38](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L31-L38)

恢复校验是保存正文/来源集合/hash，不是最新活源。

```text
const officeContentHash=artifact=>createHash('sha256').update(stableJSON({kind:artifact.kind,content:artifact.content,citations:artifact.citations})).digest('hex')
function validateSavedOfficeContent(artifact) {
  if(!officeFormatFor(artifact.kind)||!artifact.content||!Array.isArray(artifact.citations))throw new Error('没有可恢复的已校验 Office 正文')
  const ids=artifact.citations.map(citation=>citation.evidenceId)
  if(ids.some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length||artifact.citations.some(citation=>typeof citation.path!=='string'||!citation.path))throw new Error('保存的来源快照不完整，不能重试导出')
  const checked=validateContent(artifact.kind,JSON.stringify(artifact.content),artifact.citations)
  if(stableJSON(checked)!==stableJSON(artifact.content))throw new Error('保存的正文未通过完整校验，不能重试导出')
  return officeContentHash(artifact)
```

**依据 22 · 源码核查**：[packages/dsh-knowledge-studio/lib/export-recovery.js:13-16](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/export-recovery.js#L13-L16)

导出恢复资格条件。

```text
export function canRetryOfficeExport(artifact) {
  return Boolean(artifact&&!artifact.deletedAt&&officeFormatFor(artifact.kind)&&['failed','interrupted','cancelled'].includes(artifact.status)&&artifact.content&&
    ((artifact.exportState?.version===1&&artifact.exportState.validatedContentHash&&artifact.exportState.phase!=='complete'&&!artifact.exportState.blocked&&artifact.exportState.provider!=='office-tools')||isLegacyOfficeExportFailure(artifact)))
}
```

**依据 23 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:340-357](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L340-L357)

取消/删除标记/再生成不同动作。

<details>
<summary>查看原文（18行）</summary>

```text
  async manage(artifactId, action, value, sessionId) {
    if(action==='retry-export')return this.#retryOfficeExport(artifactId)
    const artifact = await this.#store.read(artifactId)
    if (action === 'cancel') { this.#tasks.get(artifactId)?.controller.abort(new Error('用户取消生成')); return this.wait(artifactId) }
    if (action === 'rename') {
      const title=String(value||'').trim().slice(0,150); if(!title)throw new Error('名称不能为空')
      return this.#store.update(artifactId,{title})
    }
    if (action === 'delete') {
      this.#tasks.get(artifactId)?.controller.abort(new Error('用户移除成果'))
      await this.wait(artifactId)
      return this.#store.update(artifactId,{deletedAt:now()})
    }
    if (action === 'retry') {
      if(this.#tasks.has(artifactId))throw new Error('成果仍在生成')
      const workspace=this.#ctx.workspaceRegistry.get(artifact.workspaceId)
      if(!workspace)throw new Error('原工作区不可用')
      return this.start(workspace,artifact.kind,artifact.parameters,sessionId || artifact.sessionId)
```

</details>

**依据 24 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:571-575](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L571-L575)

关闭仅abort并等待管理任务。

```text
  async close() {
    for (const task of this.#tasks.values()) task.controller.abort(new Error('Knowledge Studio is stopping'))
    await Promise.allSettled([...this.#tasks.values()].map(task => task.promise))
    await Promise.allSettled([...this.#settlements])
    this.#tasks.clear()
```

#### 缺口

- 未运行崩溃/取消/多进程/宿主权限与实际Office预览、Python/浏览器进程退出；未全审媒体和所有共享服务。
  **影响**：不能把实例内原子写当跨Profile强一致、completed当教学真值、工具入口的审批当所有RPC保证，或关闭当无残留/费用回滚。
  **进一步探讨**：在备份后的单进程公开样例分别测模型截断、拒绝写、导出失败/只重导、断电重启和旧成功回显；核磁盘真实工件/任务与权限而非仅UI状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 无需先建索引是否等于轻量无运行时，成本怎么核？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

索引状态不是创作前提，但原生数据库运行时仍可能是加载前提：Host静态import manager→store→ladybug，ladybug在模块顶层按平台require绑定，平台不支持或optional native缺失就throw。因此不能以basicEvidence不建库推无需Ladybug。默认索引检索工具关着，也不等根插件不加载该依赖。

模型调用会发送所选资料；独立生成继承会话选择/显式maxTokens和可用reasoningEffort，否则用模型默认值，记录budgetSource。90秒是流无活动的idle超时，每个chunk重置，不是总耗时或现金cap；normal卡片还经过宿主Agent决策请求，不能只按一次内部生成估费。完整依赖与四阶段成本表见综合段落；只做公开小资料的quiz/flashcards可不先启Office/媒体，但仍需兼容宿主/客户端、native、模型和可写状态目录。

报告/表/幻灯片自动导出路径需要相应Office工具或共享Python；PDF/预览/视频有额外运行时，音频要可用语音provider，不能把源码available或capability检测当机器已装好。此内部链的Office导出在正文生成后执行，环境不满足可先耗模型请求再导出失败，需预先核环境。共享服务和官方Office/Python/浏览器/语音各自失败/许可/保真边界仍在，本轮不执行准备或给未知费用编数字。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-knowledge-studio/lib/index.js:1-4](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/index.js#L1-L4)

Host静态import manager。

```text
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { ArtifactEngine } from './artifacts.js'
import { StudioRegistry } from './capabilities.js'
import { KnowledgeIndexManager } from './manager.js'
```

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/lib/manager.js:1-7](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/manager.js#L1-L7)

manager静态import store。

```text
import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { dshHomePath } from '@deepseek-ai/dsh-home-paths'
import { scanWorkspace } from './indexer.js'
import { INDEX_FORMAT_VERSION, WorkspaceKnowledgeStore } from './store.js'
import { TaskJournal } from './task-journal.js'
```

**依据 3 · 源码核查**：[packages/dsh-knowledge-studio/lib/store.js:1-6](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/store.js#L1-L6)

store静态import ladybug。

```text
import { createHash } from 'node:crypto'
import { dirname } from 'node:path'
import { mkdir } from 'node:fs/promises'
import { Database, Connection } from './ladybug.js'
import { parseDocument } from './parser.js'
import { tokenCounts, tokenize } from './tokenizer.js'
```

**依据 4 · 源码核查**：[packages/dsh-knowledge-studio/lib/ladybug.js:5-35](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/ladybug.js#L5-L35)

平台require在顶层，缺native/不支持就throw。

<details>
<summary>查看原文（31行）</summary>

```text
const platformPackages = Object.freeze({
  'darwin-arm64': '@ladybugdb/core-darwin-arm64',
  'darwin-x64': '@ladybugdb/core-darwin-x64',
  'linux-arm64': '@ladybugdb/core-linux-arm64',
  'linux-x64': '@ladybugdb/core-linux-x64',
  'win32-x64': '@ladybugdb/core-win32-x64',
})

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
}

export const { Database, Connection } = binding
```

</details>

**依据 5 · 源码核查**：[packages/dsh-knowledge-studio/package.json:83-89](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/package.json#L83-L89)

optionalDependencies平台native0.20.1，不是无需运行时。

```text
  "optionalDependencies": {
    "@ladybugdb/core-darwin-arm64": "0.20.1",
    "@ladybugdb/core-darwin-x64": "0.20.1",
    "@ladybugdb/core-linux-arm64": "0.20.1",
    "@ladybugdb/core-linux-x64": "0.20.1",
    "@ladybugdb/core-win32-x64": "0.20.1"
  },
```

**依据 6 · 源码核查**：[packages/dsh-knowledge-studio/lib/generation-policy.js:3-25](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/generation-policy.js#L3-L25)

会话/adapter预算继承，不是全局费用cap。

<details>
<summary>查看原文（23行）</summary>

```text
export async function generationPolicy(ctx, selection, sessionId, signal, explicitMaxTokens) {
  const request = sessionId ? ctx.agents?.get(sessionId)?.session?.requestHeader()?.config : undefined
  const selected = request && (!request.provider || request.provider === selection.provider) && (!request.model || request.model === selection.model) ? request : undefined
  const info = await ctx.llm.resolveModelInfo?.(selection.provider, selection.model, signal)
  signal?.throwIfAborted()
  const options = {}
  const requestedCap = explicitMaxTokens ?? selected?.maxTokens
  if (requestedCap !== undefined) {
    if (!Number.isSafeInteger(requestedCap) || requestedCap <= 0) throw new Error('模型输出预算必须是正整数')
    options.maxTokens = requestedCap
  }
  const effort = selected?.reasoningEffort
  // Routes such as a model with thinking but no effort controls must receive
  // no stale effort left by an older session or a different model.
  if (effort && info?.reasoning?.efforts?.some(item => item.id === effort)) options.reasoningEffort = effort
  return {
    options,
    generation: {
      ...selection,
      maxTokens: options.maxTokens ?? info?.defaultMaxTokens ?? null,
      reasoningEffort: options.reasoningEffort ?? info?.reasoning?.defaultEffort ?? null,
      budgetSource: options.maxTokens !== undefined ? 'explicit' : 'model-default',
    },
```

</details>

**依据 7 · 源码核查**：[packages/dsh-knowledge-studio/lib/generation.js:21-47](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/generation.js#L21-L47)

idle timer重置与真实流。

<details>
<summary>查看原文（27行）</summary>

```text
  const controller = new AbortController()
  const abort = () => controller.abort(signal?.reason ?? new Error('Studio generation cancelled'))
  if (signal?.aborted) abort()
  else signal?.addEventListener('abort', abort, { once: true })
  let timer
  const activity = () => {
    clearTimeout(timer)
    timer = setTimeout(() => controller.abort(Object.assign(new Error('模型服务长时间没有返回内容，本次生成已中断，请稍后重试。'), { code: 'STUDIO_MODEL_IDLE' })), idleTimeoutMs)
  }
  const assembler = new BlockAssembler()
  let generation
  activity()
  try {
    const policy = preparedGeneration?.policy ?? await generationPolicy(ctx, selection, sessionId, controller.signal, maxTokens)
    controller.signal.throwIfAborted()
    const { options } = policy
    generation = policy.generation
    activity()
    let terminalReceived = false
    const messages = [createUserMessage({
      content: [{ type: 'text', text: prompt }],
      source: { kind: 'plugin', plugin: 'dsh-knowledge-studio' },
    })]
    for await (const chunk of ctx.llm.stream({ ...selection, ...options, messages, system, sessionId, purpose, signal: controller.signal })) {
      controller.signal.throwIfAborted()
      activity()
      if (chunk.type === 'finish') terminalReceived = true
```

</details>

**依据 8 · 源码核查**：[packages/dsh-knowledge-studio/lib/index.js:65-81](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/index.js#L65-L81)

capabilities等候服务/按media readiness给条件。

<details>
<summary>查看原文（17行）</summary>

```text
  }

  workspaceStatus(workspaceId) {
    return this.snapshot(this.workspace(workspaceId))
  }

  async listCapabilities() {
    await this.ctx.artifactServices.ready
    const media=await this.mediaProviders.describe()
    const runtime=await this.ctx.artifactServices.mediaReadiness()
    const hasSpeech=media.speech.some(p=>p.available&&p.voices.length)
    return this.registry.list().map(cap=>['audio','video'].includes(cap.id)?{
      ...cap,available:runtime.available&&(cap.id==='video'||hasSpeech),
      unavailableReason:!runtime.available?runtime.reason:cap.id==='audio'&&!hasSpeech?'没有可用音色，请先准备本机语音或选择已配置的语音服务。':undefined,
      parameters:[...cap.parameters,...mediaParameters(cap.id,media)],
    }:cap)
  }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:425-440](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L425-L440)

音视频执行前核runtime/语音/音色。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 10 · 源码核查**：[packages/dsh-knowledge-studio/packages/artifact-services/lib/dsh.js:17-34](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/packages/artifact-services/lib/dsh.js#L17-L34)

共享服务真实注入/注册Office/媒体/转写和技能。

<details>
<summary>查看原文（18行）</summary>

```text
  static inject=['tools','fs','permissionPresets','skills']
  constructor(ctx,config={}) {
    super(ctx,'artifactServices')
    this.media=createMediaProviders()
    this.speech=this.media.speechService
    this.imageGenerationEnabled=config.images?.enabled===true
    this.images=new ImageService({enabled:this.imageGenerationEnabled,onChange:()=>this.refreshImageProviders()})
    this.transcription=new TranscriptionService()
    this.registerTranscriptionProvider(createWhisperCppTranscriptionProvider(config.transcription?.local))
    this.ready=loadMusicCatalog(this.media,config.bgmRoot)
    installOfficeTools(ctx)
    installMediaTools(ctx,this)
    installTranscriptionTools(ctx,this)
    if(this.imageGenerationEnabled)installImageTools(ctx,this)
    if(config.skills!==false) {
      const dispose=installArtifactSkills(ctx,{images:this.imageGenerationEnabled?this.images:undefined})
      ctx.effect(()=>dispose,'dsh-artifact-services: skills')
    }
```

</details>

**依据 11 · 源码核查**：[packages/dsh-knowledge-studio/README.md:60-79](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/README.md#L60-L79)

运行环境与出站/Office/媒体限制是声明，不当本轮安装验收。

<details>
<summary>查看原文（20行）</summary>

```text

成果完成与失败可接入宿主的[插件通知协议](https://github.com/ECNU/EduWork/blob/main/docs/PLUGIN_NOTIFICATIONS.md)。通知服务可选，未安装时仍可使用 Studio；成果状态和点击导航由 Studio 自己管理。

Office 需要另行准备 Python 3.12+ 和共享包的 `python/requirements.txt`，以 `DSH_OFFICE_PYTHON` 指向解释器。PDF、视频使用 Chromium；可注入已准备的运行时，独立渲染首次使用可准备 Remotion 浏览器；Studio 的能力检查本身不会下载组件，离线使用须事先配置。共享媒体运行时固定 Remotion `4.0.520`、mediabunny `1.55.5`、React/React DOM `18.3.1`。Windows System.Speech 和 macOS 系统 say 可使用本机已安装的音色离线配音；其他系统或厂商可通过统一接口注册语音提供方。音频转写通过共享 ASR 服务扩展，本地 whisper.cpp 可执行文件与模型需宿主另行准备，不随 npm 包分发。详见 [扩展接口](docs/ARCHITECTURE.md)。

## 开发与边界

[开发和测试](docs/DEVELOPMENT.md) · [架构](docs/ARCHITECTURE.md) · [迁移](docs/MIGRATION.md) · [版本记录](CHANGELOG.md) · [发布流程](https://github.com/ecnu/EduWork/blob/main/packages/dsh-knowledge-studio/docs/RELEASING.md)

索引和检索在本机运行。生成报告或媒体脚本会调用用户配置的模型并发送所需资料；费用和数据处理由该模型服务决定。打开 Studio 不会自动扫描全工作区或启动模型任务。

对话与 Studio 复用同一套 Office、语音、媒体生成和真实文件预览服务。Studio 保留资料引用与学习交互；可编辑 React 视频工程等高级操作由对话工具提供，并非每个对话工具都有 Studio 卡片。

Office 处理支持文档中列出的结构化功能，不承诺完整 Office 排版、宏或演示动画编辑；公式重算复用官方 LibreOffice Kit。字幕按实际语音片段同步，不承诺逐字时间戳。可编辑视频工程会执行工作区 React 代码，只应渲染可信工程。

项目代码按 [MIT](LICENSE) 提供。Remotion、Chromium、PDF.js 和其他依赖保留自己的许可；MIT 不覆盖它们的全部使用条件。见 [第三方说明](THIRD_PARTY_NOTICES.md) 和 [配乐来源](https://github.com/ecnu/EduWork/blob/main/packages/dsh-knowledge-studio/packages/artifact-services/media/BGM-USAGE.md)。

平台支持取决于已准备的 Office、语音与媒体运行环境，要求见[平台说明](https://github.com/ecnu/EduWork/blob/main/packages/dsh-knowledge-studio/packages/artifact-services/docs/PLATFORMS.md)。

源码、Issue 与 PR 统一在 [EduWork](https://github.com/ecnu/EduWork/tree/main/packages/dsh-knowledge-studio)。开发命令在 `EduWork/packages/dsh-knowledge-studio` 中执行，npm 安装保持独立；发布流程见[包维护说明](https://github.com/ecnu/EduWork/blob/main/docs/PACKAGES.md)。
```

</details>

#### 缺口

- 未装运行时/核发布包字节、首轮CPU磁盘/模型账单/所有平台，以及完整卸载/保留数据。
  **影响**：不能从无需索引推低安装负担、从token选项推固定费用，或承诺退出即删除快照/导出和无后台残留。
  **进一步探讨**：先确认兼容已准备环境、允许外发公开资料和备份/数据目录，记录宿主与内部请求总usage、人工核答案/修订和实际恢复/退出时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应如何试用，独立生产方向怎样区别已有引用和修订？

**研究主题**：采用判断、新假设与验证

#### 完整回答

对已有兼容DSH/配套运行时和模型、允许发送资料且能人工核答案的人，建议仅用公开小资料试quiz/flashcards，再决定Office等。对照是宿主普通创作技能/共享Office加手工制卡；现有增量是同会话内资料范围、可管理修订/交互/引用与文件交接，不把类型数量/结构验证当任务效果。

已有短标签过滤、引用hash/变化标记、工作区扫描边界、同轮目标历史/最终版、输出预算/失败草稿/合格导出恢复，不再包装成未来新增。先把索引fresh口径与活文件对齐；可证伪的进一步方向是条目级事实/答案“来源确支持/待核/已被反证”的交接与教师确认状态，选择性导出已核内容，区别于仅合法ID/快照未变。它不是已实现，也不让模型自评代替教师或学生独立结果。

最小三组对照：同模型/同公开资料的普通技能+人工、当前Studio、加上述交接。任务含无引、合法但不支持的引用、数值/答案错误、源改而索引旧、信息不足和正常可用题。量关键主张支持率、误判正确/漏项、教师准备与返工总时间、请求总token/现金/磁盘、学生独立答题/迁移结果；只比较题量或自报correct不算。若手工核验已等效，或新增步骤没改善误用且增加总投入，就否定独立插件机会，不为它新造教学平台。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-knowledge-studio/lib/studio-content.js:28-47](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/studio-content.js#L28-L47)

现有ID/结构校验的确切边界，未来不能重复。

<details>
<summary>查看原文（20行）</summary>

```text
  const allowed = new Set(evidence.map(item => item.evidenceId))
  const key = { report:'sections', mindmap:'nodes', table:'rows', slides:'slides', audio:'segments', video:'scenes' }[kind]
  if (!key || !Array.isArray(parsed[key]) || !parsed[key].length) throw new Error('模型未返回有效成果内容')
  const columns = kind === 'table' ? list(parsed.columns??[],26,'数据表字段').map(value => text(value, 200,'字段名称')) : undefined
  if (kind === 'table' && !columns?.length) throw new Error('数据表缺少字段')
  const items = list(parsed[key],kind==='slides'?40:kind==='mindmap'?300:kind==='table'?1000:200,'成果条目').map((item, index) => {
    if(!item||typeof item!=='object'||Array.isArray(item))throw new Error(`第 ${index+1} 项必须是对象`)
    const evidenceIds = [...new Set((Array.isArray(item.evidenceIds)?item.evidenceIds:[]).filter(id=>allowed.has(id)))]
    const common = { id: kind === 'mindmap' ? text(item.id, 60) : `item${index + 1}`, evidenceIds }
    if (kind === 'table') {
      if (!Array.isArray(item.cells) || item.cells.length > columns.length) throw new Error('数据表行与字段数量不一致')
      return { ...common, cells: columns.map((_,index) => text(item.cells[index], 32000,'单元格')) }
    }
    if (kind === 'report') return { ...common, heading:text(item.heading, 300,'小节标题'), body:text(item.body, 100000,'小节正文') }
    if (kind === 'mindmap') return { ...common, parentId:text(item.parentId,60), label:text(item.label,100), body:text(item.body) }
    if (kind === 'audio') return { ...common, speaker:item.speaker === 'B' ? 'B' : 'A', text:text(item.text, 1800) }
    if (kind === 'slides') return {...normalizeSlide(item),...common}
    return { ...common, heading:text(item.heading,80), bullets:list(item.bullets??[],6,'屏显要点').map(value => text(value,300,'要点')), notes:text(item.notes,50000,'讲稿'), narration:text(item.narration,12000,'旁白') }
  })
  if (items.some(item => !String(item.body || item.text || item.label || item.heading || item.title || item.quote || item.cells?.join('') || (kind==='slides'?slideOutline(item).join(''):item.narration||item.bullets?.join('')) || '').trim())) throw new Error('成果存在空白内容')
```

</details>

**依据 2 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifacts.js:323-337](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifacts.js#L323-L337)

现有fresh分支需区分，不当未来无新鲜度。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 3 · 源码核查**：[packages/dsh-knowledge-studio/lib/artifact-lifecycle.js:13-42](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/lib/artifact-lifecycle.js#L13-L42)

已有最终呈现/失败恢复，不算未来新增。

<details>
<summary>查看原文（30行）</summary>

```text
export function presentArtifact(artifact) {
  if(artifact.lifecycle?.state!=='open'||artifact.persistenceError)return artifact
  return {...artifact,attemptStatus:artifact.status,status:'running',
    phase:artifact.status==='running'?artifact.phase:'turn',
    message:artifact.status==='completed'?'成果已生成，等待本轮对话结束':artifact.status==='failed'?'本次尝试未完成，等待本轮修复结果':artifact.message}
}
export function sameArtifactTarget(artifact,kind,parameters) {
  return artifact.kind===kind&&
    (artifact.parameters.pathPrefix||'')===(parameters.pathPrefix||'')
}
export function attemptSnapshot(artifact) {
  const {attempts,lifecycle,...attempt}=artifact
  return {...attempt,callId:lifecycle?.callId||null,finishedAt:artifact.updatedAt}
}

export function settleArtifact(artifact,reason) {
  const endedAt=new Date().toISOString()
  const lifecycle={...artifact.lifecycle,state:'settled',endedAt,reason:reason?.kind||'completed'}
  if(artifact.status!=='completed') {
    const successful=[...(artifact.attempts||[])].reverse().find(attempt=>attempt.status==='completed')
    if(successful) return {...successful,
      id:artifact.id,workspaceId:artifact.workspaceId,sessionId:artifact.sessionId,
      ...(artifact.deletedAt?{deletedAt:artifact.deletedAt}:{}),
      lifecycle,updatedAt:endedAt,
      attempts:[...(artifact.attempts||[]).filter(attempt=>attempt!==successful),attemptSnapshot(artifact)],
      revisionWarning:`最后一次修改未完成，显示第 ${successful.version} 版；修改记录已保留。`,
    }
  }
  return {...artifact,lifecycle,updatedAt:endedAt}
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-knowledge-studio/skills/knowledge-studio/SKILL.md:10-18](https://github.com/ECNU/EduWork/blob/a43a4d424c9d25668589dfe94a3871318ce299ff/packages/dsh-knowledge-studio/skills/knowledge-studio/SKILL.md#L10-L18)

已有创作/修订与实际检查指引，不当独立质量证明。

```text
使用当前对话组织成果，不创建另一套对话。普通问答正常回答；普通文件创作由对应创作技能及共享工具处理，不因用户提到报告、演示或视频就切换到 Studio。

用户明确请求 Studio 成果时使用 `knowledge_studio_create_artifact`，保留用户的 kind、count、focus、pathPrefix、template、columns、style 及媒体选项。具体创作规范由共享服务提供，本技能不维护另一套设计规则。工具读取本次授权范围的原始资料；不要虚构来源或把资料读取范围描述为整个工作区。

同一轮内，一个交付物及其修订保持为一个成果。使用返回的 artifactId 作为 retryArtifactId，或保留原 targetKey；即使上次已生成文件，继续改进也沿用该目标。focus 可描述新修改，来源范围保持用户要求。不要用 v1/v2/v3 新目标规避修订。只有独立请求的多个交付物使用不同目标；不同种类和后续轮次仍按工具契约分别处理。

Studio 保留中间版本，在实际对话轮次结束后呈现最终版本。工具成功仅说明文件生成，按实际检查决定是否需要修订；失败时保留已生成内容并说明具体问题，不宣称成功。

打开和关闭预览要保留对话。文件成果展示实际文件预览，下载提供工具返回的文件；实际页数、条目数、时长以结果为准。源码、原文件和辅助资料按用途区分，不把它们当作重复成果。
```

#### 缺口

- 缺教师真实任务/普通技能对照、学生独立结果与条目支持交接原型。
  **影响**：不能把可生成/可追问直接当更好教学、老师愿继续用或独立生产需求；不能据目录定位新建大平台。
  **进一步探讨**：先做小公开资料事实核验，再按三组测总投入与独立结果；未改善或权限/费用不可接受就保留原技能与人工制卡。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
