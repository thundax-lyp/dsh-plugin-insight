# dsh-weknora-archive

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[f3fc189](https://github.com/AAAlenwow/dsh-weknora-archive/tree/f3fc189ac0b0c4ff77959a39e56115e8c59334d9)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：提取、摘要、去重并上传DSH会话到WeKnora知识库，补充官方只读检索插件的写入侧。

> **亮点**：补齐 DSH 到 WeKnora 的增量写入链，将会话提取、摘要、指纹去重与上传串成一个可调度流程。它相对“人工导出会话、整理 Markdown 后上传，或只使用 WeKnora 检索而不自动写入”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **主要限制**：摘要会把模型判断引入档案，隐私过滤和去重指纹不能保证敏感内容不外发或语义重复被识别。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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

> **用途**：已部署 WeKnora、希望把 DSH 对话沉淀为团队知识库的用户可用它按游标增量读取 DSH 会话，清洗并摘要后去重上传到 WeKnora，支持手动工具与定时归档；合格结果是只归档新增且符合筛选条件的会话，重复内容不重复写入，失败可定位并重试。详见[Q01](#research-q01)。

基线是人工导出会话、整理 Markdown 后上传，或只使用 WeKnora 检索而不自动写入。本项的价值主要来自补齐 DSH 到 WeKnora 的增量写入链，将会话提取、摘要、指纹去重与上传串成一个可调度流程；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 增量会话归档 | 按状态游标选择新增会话并形成归档记录。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 摘要与去重 | 对会话内容摘要并以指纹避免重复上传。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| WeKnora 上传 | 将整理结果写入指定知识库并记录处理状态。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 可读 DSH 会话存储 | 必需 | 按会话与游标提取新增内容 | 结构变化或权限不足时停止推进游标 |
| WeKnora URL、知识库ID与凭据 | 上传必需 | 创建知识条目 | 网络/鉴权失败保留未提交批次 |
| 摘要模型与隐私/筛选配置 | 摘要模式必需 | 压缩内容并排除指定会话 | 失败时允许原文模式或停止，不能伪摘要 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 读取上次游标并筛选新增会话 | 批次ID和会话范围可回读 |
| 2 | 清洗、摘要并计算去重指纹 | 敏感字段审阅；相同指纹不重复上传 |
| 3 | 上传 WeKnora 后才提交游标和回执 | 失败项留待重试，已上传未知时先查目标库 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | WeKnora存储/服务与可选模型费用 | 配置知识库、凭据、筛选和隐私策略 | 初始回填量与审阅小时未知 |
| 持续使用 | 摘要token、上传流量和知识库存储 | 复核摘要、处理重复和删除请求 | 每千会话成本与合格摘要率未知 |
| 失败恢复 | 重复摘要/上传可能再次计费 | 核目标库、区分已写/未写并修正游标 | 缺少幂等回执时可能重复条目 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 增量归档 | 会话读取、摘要、去重、上传链存在 | 游标在中断/并发下是否不漏不重 |
| 知识可检索性 | 写入侧补充只读检索插件 | 摘要后检索召回与任务质量 |
| 隐私边界 | 提供筛选和隐私说明 | 敏感内容漏传率与删除传播 |

> **思考**：摘要会把模型判断引入档案，隐私过滤和去重指纹不能保证敏感内容不外发或语义重复被识别。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：补齐 DSH 到 WeKnora 的增量写入链，将会话提取、摘要、指纹去重与上传串成一个可调度流程。它相对“人工导出会话、整理 Markdown 后上传，或只使用 WeKnora 检索而不自动写入”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 lib/index.js 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“上传 WeKnora 后才提交游标和回执｜失败项留待重试，已上传未知时先查目标库”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

摘要会把模型判断引入档案，隐私过滤和去重指纹不能保证敏感内容不外发或语义重复被识别。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已自建WeKnora且能接受内容外发者可观察，先用脱敏样本验证筛选、删除、重试和重复归档边界。 采用结论是观察，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：用50个含重复、敏感字段、超长文本和上传超时的合成会话，三次中断重跑；记录漏归档、重复条目、敏感字段泄漏、人工复核分钟和摘要费用，任何游标越过失败项即停止。

**分析版本**

- **仓库**：[AAAlenwow/dsh-weknora-archive](https://github.com/AAAlenwow/dsh-weknora-archive)
- **版本号**：0.3.0（[固定提交 f3fc189](https://github.com/AAAlenwow/dsh-weknora-archive/tree/f3fc189ac0b0c4ff77959a39e56115e8c59334d9)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可在上传前增加可复核的字段级隐私清单与内容寻址回执，让删除、重放和来源追踪成为归档协议的一部分。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

用50个含重复、敏感字段、超长文本和上传超时的合成会话，三次中断重跑；记录漏归档、重复条目、敏感字段泄漏、人工复核分钟和摘要费用，任何游标越过失败项即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 1170 | 882 | 223 | — |
| .md | source | 1 | 164 | — | — | 2031 |
| .mjs | test | 1 | 265 | 243 | 30 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AAAlenwow/dsh-weknora-archive/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 dsh-weknora-archive 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是已部署 WeKnora、希望把 DSH 对话沉淀为团队知识库的用户。反复任务是按游标增量读取 DSH 会话，清洗并摘要后去重上传到 WeKnora，支持手动工具与定时归档。原有办法为人工导出会话、整理 Markdown 后上传，或只使用 WeKnora 检索而不自动写入。合格结果必须达到“只归档新增且符合筛选条件的会话，重复内容不重复写入，失败可定位并重试”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-weknora-archive

**中文** · [English](#english)

把 DSH（DeepSeek Harness）会话**增量归档**进 [WeKnora](https://github.com/Tencent/WeKnora) 知识库的 host 端插件。是官方只读插件 `@wxg-prc-cpg/dsh-weknora`（4 个检索工具）的**写入侧互补**。

## 功能

| 工具 | 说明 |
|---|---|
| `weknora_archive_auto` | **全量自动归档**：扫描本机所有 DSH 项目，把每个项目的会话增量归档进各自的知识库（按项目名自动匹配/新建），已归档自动跳过，可重复执行；单个项目失败不影响其余项目。设计为被定时任务调用，实现无人值守归档；`project_keyword` 可选过滤，`dry_run` 预览 |
| `weknora_archive_session` | 归档某个项目的 DSH 会话：定位会话目录 → 解压会话存储 → 提取对话 → 总结 → 按标题去重后上传；知识库不存在时按项目名自动新建；首次归档附 `00_项目总览.md`；支持 `dry_run` 预览 |
| `weknora_archive_status` | 只读：列出本机会话项目目录与会话数，查看目标知识库内已归档文档与解析状态 |
| `weknora_archive_list_knowledge_bases` | 只读：列出该凭据可见的知识库 |
| `weknora_archive_create_knowledge_base` | 新建知识库（注意：新建库可能需在 WeKnora 端配置 embedding 模型，否则文档解析失败） |

工具名前缀可通过 `toolPrefix` 配置（默认 `weknora_archive`）。工具描述中英双语。

## 安装
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

lib/index.js 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“读取上次游标并筛选新增会话｜批次ID和会话范围可回读；清洗、摘要并计算去重指纹｜敏感字段审阅；相同指纹不重复上传；上传 WeKnora 后才提交游标和回执｜失败项留待重试，已上传未知时先查目标库”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:276-281](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/lib/index.js#L276-L281)

关键源码片段支持入口、注册或生命周期接线。

```text
    },
  });

  for (const definition of definitions) ctx.tools.register(definition);
  log(`dsh-weknora-archive: registered ${definitions.map((d) => d.name).join(', ')}`);
}
```

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-weknora-archive",
  "version": "0.3.0",
  "description": "Incrementally archive DSH sessions into a WeKnora knowledge base (Tencent WeKnora RAG): extract, summarize, dedupe, upload. 把 DSH 会话增量归档进 WeKnora 知识库（写入侧互补官方只读 dsh-weknora 插件）。",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "weknora",
    "knowledge-base",
    "session-archive",
    "rag"
  ],
  "license": "MIT",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "cordis.patch.yml",
    "lib",
    "test",
    "README.md"
  ],
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是补齐 DSH 到 WeKnora 的增量写入链，将会话提取、摘要、指纹去重与上传串成一个可调度流程。参照是“人工导出会话、整理 Markdown 后上传，或只使用 WeKnora 检索而不自动写入”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:276-281](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/lib/index.js#L276-L281)

源码证明本插件承担接线或编排，而非仅有文字描述。

```text
    },
  });

  for (const definition of definitions) ctx.tools.register(definition);
  log(`dsh-weknora-archive: registered ${definitions.map((d) => d.name).join(', ')}`);
}
```

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-weknora-archive

**中文** · [English](#english)

把 DSH（DeepSeek Harness）会话**增量归档**进 [WeKnora](https://github.com/Tencent/WeKnora) 知识库的 host 端插件。是官方只读插件 `@wxg-prc-cpg/dsh-weknora`（4 个检索工具）的**写入侧互补**。

## 功能

| 工具 | 说明 |
|---|---|
| `weknora_archive_auto` | **全量自动归档**：扫描本机所有 DSH 项目，把每个项目的会话增量归档进各自的知识库（按项目名自动匹配/新建），已归档自动跳过，可重复执行；单个项目失败不影响其余项目。设计为被定时任务调用，实现无人值守归档；`project_keyword` 可选过滤，`dry_run` 预览 |
| `weknora_archive_session` | 归档某个项目的 DSH 会话：定位会话目录 → 解压会话存储 → 提取对话 → 总结 → 按标题去重后上传；知识库不存在时按项目名自动新建；首次归档附 `00_项目总览.md`；支持 `dry_run` 预览 |
| `weknora_archive_status` | 只读：列出本机会话项目目录与会话数，查看目标知识库内已归档文档与解析状态 |
| `weknora_archive_list_knowledge_bases` | 只读：列出该凭据可见的知识库 |
| `weknora_archive_create_knowledge_base` | 新建知识库（注意：新建库可能需在 WeKnora 端配置 embedding 模型，否则文档解析失败） |

工具名前缀可通过 `toolPrefix` 配置（默认 `weknora_archive`）。工具描述中英双语。

## 安装
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是摘要会把模型判断引入档案，隐私过滤和去重指纹不能保证敏感内容不外发或语义重复被识别。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:276-281](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/lib/index.js#L276-L281)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

```text
    },
  });

  for (const definition of definitions) ctx.tools.register(definition);
  log(`dsh-weknora-archive: registered ${definitions.map((d) => d.name).join(', ')}`);
}
```

#### 缺口

- 缺少针对“摘要会把模型判断引入档案，隐私过滤和去重指纹不能保证敏感内容不外发或语义重复被识别”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：用50个含重复、敏感字段、超长文本和上传超时的合成会话，三次中断重跑；记录漏归档、重复条目、敏感字段泄漏、人工复核分钟和摘要费用，任何游标越过失败项即停止。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：可读 DSH 会话存储｜必需｜按会话与游标提取新增内容｜结构变化或权限不足时停止推进游标；WeKnora URL、知识库ID与凭据｜上传必需｜创建知识条目｜网络/鉴权失败保留未提交批次；摘要模型与隐私/筛选配置｜摘要模式必需｜压缩内容并排除指定会话｜失败时允许原文模式或停止，不能伪摘要。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“上传 WeKnora 后才提交游标和回执｜失败项留待重试，已上传未知时先查目标库”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-weknora-archive",
  "version": "0.3.0",
  "description": "Incrementally archive DSH sessions into a WeKnora knowledge base (Tencent WeKnora RAG): extract, summarize, dedupe, upload. 把 DSH 会话增量归档进 WeKnora 知识库（写入侧互补官方只读 dsh-weknora 插件）。",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "weknora",
    "knowledge-base",
    "session-archive",
    "rag"
  ],
  "license": "MIT",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "cordis.patch.yml",
    "lib",
    "test",
    "README.md"
  ],
```

</details>

**依据 2 · 源码核查**：[lib/index.js:276-281](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/lib/index.js#L276-L281)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

```text
    },
  });

  for (const definition of definitions) ctx.tools.register(definition);
  log(`dsh-weknora-archive: registered ${definitions.map((d) => d.name).join(', ')}`);
}
```

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：用50个含重复、敏感字段、超长文本和上传超时的合成会话，三次中断重跑；记录漏归档、重复条目、敏感字段泄漏、人工复核分钟和摘要费用，任何游标越过失败项即停止。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“只归档新增且符合筛选条件的会话，重复内容不重复写入，失败可定位并重试”为合格单位。三阶段投入为：首次使用｜WeKnora存储/服务与可选模型费用｜配置知识库、凭据、筛选和隐私策略｜初始回填量与审阅小时未知；持续使用｜摘要token、上传流量和知识库存储｜复核摘要、处理重复和删除请求｜每千会话成本与合格摘要率未知；失败恢复｜重复摘要/上传可能再次计费｜核目标库、区分已写/未写并修正游标｜缺少幂等回执时可能重复条目。当前源码只支持机制存在，效果维度为“增量归档｜会话读取、摘要、去重、上传链存在｜游标在中断/并发下是否不漏不重；知识可检索性｜写入侧补充只读检索插件｜摘要后检索召回与任务质量；隐私边界｜提供筛选和隐私说明｜敏感内容漏传率与删除传播”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-weknora-archive

**中文** · [English](#english)

把 DSH（DeepSeek Harness）会话**增量归档**进 [WeKnora](https://github.com/Tencent/WeKnora) 知识库的 host 端插件。是官方只读插件 `@wxg-prc-cpg/dsh-weknora`（4 个检索工具）的**写入侧互补**。

## 功能

| 工具 | 说明 |
|---|---|
| `weknora_archive_auto` | **全量自动归档**：扫描本机所有 DSH 项目，把每个项目的会话增量归档进各自的知识库（按项目名自动匹配/新建），已归档自动跳过，可重复执行；单个项目失败不影响其余项目。设计为被定时任务调用，实现无人值守归档；`project_keyword` 可选过滤，`dry_run` 预览 |
| `weknora_archive_session` | 归档某个项目的 DSH 会话：定位会话目录 → 解压会话存储 → 提取对话 → 总结 → 按标题去重后上传；知识库不存在时按项目名自动新建；首次归档附 `00_项目总览.md`；支持 `dry_run` 预览 |
| `weknora_archive_status` | 只读：列出本机会话项目目录与会话数，查看目标知识库内已归档文档与解析状态 |
| `weknora_archive_list_knowledge_bases` | 只读：列出该凭据可见的知识库 |
| `weknora_archive_create_knowledge_base` | 新建知识库（注意：新建库可能需在 WeKnora 端配置 embedding 模型，否则文档解析失败） |

工具名前缀可通过 `toolPrefix` 配置（默认 `weknora_archive`）。工具描述中英双语。

## 安装
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-weknora-archive",
  "version": "0.3.0",
  "description": "Incrementally archive DSH sessions into a WeKnora knowledge base (Tencent WeKnora RAG): extract, summarize, dedupe, upload. 把 DSH 会话增量归档进 WeKnora 知识库（写入侧互补官方只读 dsh-weknora 插件）。",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "weknora",
    "knowledge-base",
    "session-archive",
    "rag"
  ],
  "license": "MIT",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "cordis.patch.yml",
    "lib",
    "test",
    "README.md"
  ],
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：用50个含重复、敏感字段、超长文本和上传超时的合成会话，三次中断重跑；记录漏归档、重复条目、敏感字段泄漏、人工复核分钟和摘要费用，任何游标越过失败项即停止。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 lib/index.js 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“补齐 DSH 到 WeKnora 的增量写入链，将会话提取、摘要、指纹去重与上传串成一个可调度流程”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“上传 WeKnora 后才提交游标和回执｜失败项留待重试，已上传未知时先查目标库”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:276-281](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/lib/index.js#L276-L281)

固定源码用于评价职责和宿主耦合。

```text
    },
  });

  for (const definition of definitions) ctx.tools.register(definition);
  log(`dsh-weknora-archive: registered ${definitions.map((d) => d.name).join(', ')}`);
}
```

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-weknora-archive",
  "version": "0.3.0",
  "description": "Incrementally archive DSH sessions into a WeKnora knowledge base (Tencent WeKnora RAG): extract, summarize, dedupe, upload. 把 DSH 会话增量归档进 WeKnora 知识库（写入侧互补官方只读 dsh-weknora 插件）。",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "weknora",
    "knowledge-base",
    "session-archive",
    "rag"
  ],
  "license": "MIT",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "cordis.patch.yml",
    "lib",
    "test",
    "README.md"
  ],
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：用50个含重复、敏感字段、超长文本和上传超时的合成会话，三次中断重跑；记录漏归档、重复条目、敏感字段泄漏、人工复核分钟和摘要费用，任何游标越过失败项即停止。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“补齐 DSH 到 WeKnora 的增量写入链，将会话提取、摘要、指纹去重与上传串成一个可调度流程”和“摘要会把模型判断引入档案，隐私过滤和去重指纹不能保证敏感内容不外发或语义重复被识别”推导的新方向是可在上传前增加可复核的字段级隐私清单与内容寻址回执，让删除、重放和来源追踪成为归档协议的一部分。它不是当前能力。最小验证为用50个含重复、敏感字段、超长文本和上传超时的合成会话，三次中断重跑；记录漏归档、重复条目、敏感字段泄漏、人工复核分钟和摘要费用，任何游标越过失败项即停止。 若合格结果不改善、误差/副作用越界或恢复负担高于“人工导出会话、整理 Markdown 后上传，或只使用 WeKnora 检索而不自动写入”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:276-281](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/lib/index.js#L276-L281)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

```text
    },
  });

  for (const definition of definitions) ctx.tools.register(definition);
  log(`dsh-weknora-archive: registered ${definitions.map((d) => d.name).join(', ')}`);
}
```

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：用50个含重复、敏感字段、超长文本和上传超时的合成会话，三次中断重跑；记录漏归档、重复条目、敏感字段泄漏、人工复核分钟和摘要费用，任何游标越过失败项即停止。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为继续观察。已自建WeKnora且能接受内容外发者可观察，先用脱敏样本验证筛选、删除、重试和重复归档边界。 试用成功标准是“只归档新增且符合筛选条件的会话，重复内容不重复写入，失败可定位并重试”，并且 游标在中断/并发下是否不漏不重、摘要后检索召回与任务质量、敏感内容漏传率与删除传播 有可接受结果；停止标准包括发生摘要会把模型判断引入档案，隐私过滤和去重指纹不能保证敏感内容不外发或语义重复被识别所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“人工导出会话、整理 Markdown 后上传，或只使用 WeKnora 检索而不自动写入”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-weknora-archive

**中文** · [English](#english)

把 DSH（DeepSeek Harness）会话**增量归档**进 [WeKnora](https://github.com/Tencent/WeKnora) 知识库的 host 端插件。是官方只读插件 `@wxg-prc-cpg/dsh-weknora`（4 个检索工具）的**写入侧互补**。

## 功能

| 工具 | 说明 |
|---|---|
| `weknora_archive_auto` | **全量自动归档**：扫描本机所有 DSH 项目，把每个项目的会话增量归档进各自的知识库（按项目名自动匹配/新建），已归档自动跳过，可重复执行；单个项目失败不影响其余项目。设计为被定时任务调用，实现无人值守归档；`project_keyword` 可选过滤，`dry_run` 预览 |
| `weknora_archive_session` | 归档某个项目的 DSH 会话：定位会话目录 → 解压会话存储 → 提取对话 → 总结 → 按标题去重后上传；知识库不存在时按项目名自动新建；首次归档附 `00_项目总览.md`；支持 `dry_run` 预览 |
| `weknora_archive_status` | 只读：列出本机会话项目目录与会话数，查看目标知识库内已归档文档与解析状态 |
| `weknora_archive_list_knowledge_bases` | 只读：列出该凭据可见的知识库 |
| `weknora_archive_create_knowledge_base` | 新建知识库（注意：新建库可能需在 WeKnora 端配置 embedding 模型，否则文档解析失败） |

工具名前缀可通过 `toolPrefix` 配置（默认 `weknora_archive`）。工具描述中英双语。

## 安装
```

</details>

**依据 2 · 源码核查**：[lib/index.js:276-281](https://github.com/AAAlenwow/dsh-weknora-archive/blob/f3fc189ac0b0c4ff77959a39e56115e8c59334d9/lib/index.js#L276-L281)

源码证据只支撑窄范围试用/观察，不构成安装验收。

```text
    },
  });

  for (const definition of definitions) ctx.tools.register(definition);
  log(`dsh-weknora-archive: registered ${definitions.map((d) => d.name).join(', ')}`);
}
```

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：用50个含重复、敏感字段、超长文本和上传超时的合成会话，三次中断重跑；记录漏归档、重复条目、敏感字段泄漏、人工复核分钟和摘要费用，任何游标越过失败项即停止。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
