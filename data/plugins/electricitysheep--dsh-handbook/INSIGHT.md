# dsh-handbook

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[ebfb3e9](https://github.com/Electricitysheep/dsh-handbook/tree/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7)

<!-- BEGIN META -->
[![GitHub ★ 913](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=913&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Electricitysheep/dsh-handbook)
<!-- END META -->

> **功能**：提供DeepSeek Harness中文学习路径、配置示例、插件开发案例与生态观察材料。

> **亮点**：将架构资料组织为有目标、动作与验收的中文学习路径，贡献是教学与编辑组织，不是新增宿主能力。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：实测依赖旧版环境且完整基准输入产物未公开；五任务三轮与每Agent45/45分母不直接相符，不能据此作当前通用排名。[Q03](#research-q03)

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
  - [Q01 · 手册比零散架构材料增加什么学习交付？](#detail-section-11)
  - [Q02 · 学习和反馈维护是否形成可借鉴机制？](#detail-section-12)
  - [Q03 · 基准、版本和阅读成本能支持什么程度的判断？](#detail-section-13)
  - [Q04 · 读者怎样使用它，怎样验证学习路径确实有帮助？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为初学DSH、配置profile或开发首个插件的中文开发者组织阅读和动手顺序。

直接官方文档加自行整理笔记。手册价值在路径与中文组织，不能由章节数量推断学习效率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 中文学习路径 | 按目标进入DSH实践 | 对应版本需核对 |
| 历史案例与基准说明 | 了解验证和比较方法 | 作者报告，输入与分母仍有缺口 |
| 配置与FAQ导航 | 查找故障线索 | 不等于当前官方事实 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Markdown阅读与固定版本识别 | 阅读必需 | 学习和核对上下文 | 不照抄未匹配版本命令 |
| Node、DSH及模型凭据 | 动手练习必需 | 执行文中示例 | 需以当前宿主官方说明确认 |
| 独立测试目录 | 练习建议 | 保护真实工程 | 不在生产仓库直接练习 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 读者选择学习目标并核对版本 | 明确参考材料时间 |
| 2 | 在独立目录执行最小练习 | 对照章节和官方资料定位失败 |
| 3 | 以产物与解释验收 | 不把命令跑完当全部理解 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 阅读资源和可选模型调用 | 版本核对与环境配置 | 三天计划非独立节时实测 |
| 持续使用 | 练习的模型费用 | 对照官方更新命令 | 当前价格与命令兼容未验证 |
| 失败恢复 | 重试模型任务可能付费 | 还原副本、查配置及来源 | 旧版本workaround不一定适用 |
| 退出 | 保留读书笔记 | 删除练习环境、撤销测试凭据 | 文档阅读本身不需安装 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 学习导航 | 每天目标、任务与验收 | 实际学习时间及成功率 |
| 历史基准 | 作者给三轮耗时 | 公开输入与正确率分母 |
| 当前操作指导 | 文档有版本说明 | 每条命令当前兼容 |

> **思考**：实测依赖旧版环境且完整基准输入产物未公开；五任务三轮与每Agent45/45分母不直接相符，不能据此作当前通用排名。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将架构资料组织为有目标、动作与验收的中文学习路径，贡献是教学与编辑组织，不是新增宿主能力。[Q01](#research-q01) [Q02](#research-q02)

学习路径先运行、再插件、后案例与调优；每段给出可观察验收，例如headless有回复和插件日志出现决策。相比只给章节列表，行动和检查相邻更利于发现是安装失败还是理解未完成。

反馈流程规定扫描讨论、分类入FAQ/章节、标注推断与记录落位。这是人工编辑工作流，不是本次确认持续执行的自动服务；每周节奏和预计工时只是维护计划。可借鉴的是把社区问题绑定到具体章节及状态，但帖子数、互链和Star不能证明内容有效或学习效果。

<a id="detail-section-5"></a>

### 1.4 主要限制

实测依赖旧版环境且完整基准输入产物未公开；五任务三轮与每Agent45/45分母不直接相符，不能据此作当前通用排名。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

初学者可作为中文导航阅读，选一个小目标在独立目录练习；版本、权限和配置与对应官方资料交叉核对；需要当前产品比较或生产安全结论时不要只依赖本手册。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

文档路径和作者历史测量已核查；当前命令兼容和学习效果未实测；基准分母与公开fixture存在缺口。

- 已检查：作者 README、包清单、源码路径 README.md、docs/benchmark.md、docs/roadmap.md、docs/research/feedback-pipeline.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查文档资源和作者报告的历史实验材料，不执行安装/示例，不将外部当前产品事实视为已核验。
- 下一步：固定宿主和练习fixture，记录读者失败定位时间与最终独立完成率；先解释历史benchmark分母。

**分析版本**

- **仓库**：[Electricitysheep/dsh-handbook](https://github.com/Electricitysheep/dsh-handbook)
- **版本号**：未声明（[固定提交 ebfb3e9](https://github.com/Electricitysheep/dsh-handbook/tree/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7)）
- **版本日期**：2026-10-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

每段练习绑定宿主固定版本、公开输入与机器验收，用同背景新手对照求助次数和定位时间；未验证。[Q04](#research-q04)

固定宿主和练习fixture，记录读者失败定位时间与最终独立完成率；先解释历史benchmark分母。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 57 | 9937 | — | — | 132412 |
| .md | example | 1 | 75 | — | — | 508 |
| .ts | example | 4 | 185 | 147 | 12 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Electricitysheep/dsh-handbook/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Electricitysheep/dsh-handbook/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Electricitysheep/dsh-handbook/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：中文教程能否支持可核验的DSH学习实践，其版本与基准边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 手册比零散架构材料增加什么学习交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

资源面向首次接触DSH、想写第一个插件或理解配置的中文开发者。它将安装、profile、插件开发、案例与安全成本排成路径，学习结果应是独立启动一个会话、在副本环境加载小插件并解释依据，而不是读完章节或收藏链接。

相对直接查官方架构文档，手册增加按天目标、动作和验收的组织便利，值得作为导航；官方文档缺中文或其他工具能力受限等比较只是本报告作者主张，本文不将其当当前外部事实。手册不是DSH插件，也不提供新的宿主执行能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-75](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/README.md#L47-L75)

作者定位新手路径与不同读者交付。

<details>
<summary>查看原文（29行）</summary>

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

## 🎁 这本能给你什么


| 如果你是… | 你会得到 |
|---|---|
| 🆕 **第一次接触 dsh** | 3 天从 0 到 1 学习路径（每天有目标+验收） |
| 🛠 **开发者** | 可克隆的插件模板 + 配置参考大全（照抄能跑） |
| ⚖️ **正在选型** | 6 个主流 Agent 对比（表格+文字）+ 同模型实测 benchmark |
| ⚡ **要调优** | 推理档位策略 + 缓存命中率专题（实测 97%） |
| 📚 **要案例** | 5 个真实复杂案例（含耗时/产物/验证） |
```

</details>

**依据 2 · 源码核查**：[docs/roadmap.md:5-38](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/docs/roadmap.md#L5-L38)

三天学习任务分别有明确验收。

<details>
<summary>查看原文（34行）</summary>

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

## Day 3：实战 + 调优（第 5-6 章）

**目标**：能评估插件质量、调优性能、理解生态玩法。

| 时间 | 任务 | 验收 |
|---|---|---|
| 1 小时 | 第 5 章三个真实 PR（安全红线、沙箱约束、测试方法） | 能说出"写一个 PR 的完整闭环" |
| 1 小时 | 第 6 章性能模型（思考占 90%）+ 档位策略 + 坑 | 能给一个任务选档位、预估瓶颈 |
| 30 分钟 | 第 8-9 章扫读（工具/上下文、MCP/子代理/工作流）+ 术语表 | 知道 dsh 的能力全貌与扩展方向 |

**验收**：能给 dsh 生态贡献一个小改进或写一篇使用心得。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 学习和反馈维护是否形成可借鉴机制？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

学习路径先运行、再插件、后案例与调优；每段给出可观察验收，例如headless有回复和插件日志出现决策。相比只给章节列表，行动和检查相邻更利于发现是安装失败还是理解未完成。

反馈流程规定扫描讨论、分类入FAQ/章节、标注推断与记录落位。这是人工编辑工作流，不是本次确认持续执行的自动服务；每周节奏和预计工时只是维护计划。可借鉴的是把社区问题绑定到具体章节及状态，但帖子数、互链和Star不能证明内容有效或学习效果。

#### 证据与依据

**依据 1 · 源码核查**：[docs/roadmap.md:5-38](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/docs/roadmap.md#L5-L38)

阶段动作与验收在同一表内。

<details>
<summary>查看原文（34行）</summary>

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

## Day 3：实战 + 调优（第 5-6 章）

**目标**：能评估插件质量、调优性能、理解生态玩法。

| 时间 | 任务 | 验收 |
|---|---|---|
| 1 小时 | 第 5 章三个真实 PR（安全红线、沙箱约束、测试方法） | 能说出"写一个 PR 的完整闭环" |
| 1 小时 | 第 6 章性能模型（思考占 90%）+ 档位策略 + 坑 | 能给一个任务选档位、预估瓶颈 |
| 30 分钟 | 第 8-9 章扫读（工具/上下文、MCP/子代理/工作流）+ 术语表 | 知道 dsh 的能力全貌与扩展方向 |

**验收**：能给 dsh 生态贡献一个小改进或写一篇使用心得。
```

</details>

**依据 2 · 源码核查**：[docs/roadmap.md:51-56](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/docs/roadmap.md#L51-L56)

单测、实机与配置检查的学习原则。

```text
## 学习原则（白皮书全程）

1. **动手 > 阅读**：每章命令都跑一遍，不看会后悔
2. **先复制后理解**：第 4 章完整代码先跑通，再改参数理解机制
3. **单测 + 实机双证据**：开发插件时两个都要过
4. **善用 --dump-config**：疑惑时看合成配置，比猜快
```

**依据 3 · 源码核查**：[docs/research/feedback-pipeline.md:11-50](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/docs/research/feedback-pipeline.md#L11-L50)

反馈分类、引用与记录落位机制。

<details>
<summary>查看原文（40行）</summary>

````text
## 四步流程

### ① 扫描（5 分钟）

```bash
# 拉取官方库新帖（本周新增 + 我们未响应的高互动帖）
gh api graphql -f query='query { repository(owner: "deepseek-ai", name: "deepseek-harness") { discussions(first: 30) { nodes { number title category { name } comments { totalCount } } } } }'
```

筛选标准：本周新增帖 / comments 增长明显 / 我们响应过的帖中他人回复含新信息。

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

```markdown
## 2026-08-21 轮
| 来源帖 | 分类 | 沉淀位置 | 状态 |
|---|---|---|---|
| #xxxx | FAQ 候选 | faq.md 第 4 节 | ✅ 已沉淀 |
| #xxxx | 章节补充 | 03-profiles.md 3.4 | ✅ 已沉淀 |
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 基准、版本和阅读成本能支持什么程度的判断？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

固定材料明确实测基于2026-08-13的旧DSH/模型环境，README版本标注与正文实测线并不相同，不能直接视为本轮最新操作指南。基准给出Windows、同网关同key、五任务三轮与原始耗时，但完整输入产物仍指向作者本机~/agent-bench目录，仓库benchmark目录标为规划，复现材料不完整。

五任务乘三轮应为每Agent十五次任务；表中每Agent写45/45，与展示的试次数量不直接相符，可能是把三Agent总数混入分母，必须由作者解释，不能据表宣称每Agent四十五次全对。小样本同模型结果也不能证明一般能力排名。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Markdown阅读与固定版本识别 | 阅读必需 | 学习和核对上下文 | 不照抄未匹配版本命令 |
| Node、DSH及模型凭据 | 动手练习必需 | 执行文中示例 | 需以当前宿主官方说明确认 |
| 独立测试目录 | 练习建议 | 保护真实工程 | 不在生产仓库直接练习 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 阅读资源和可选模型调用 | 版本核对与环境配置 | 三天计划非独立节时实测 |
| 持续使用 | 练习的模型费用 | 对照官方更新命令 | 当前价格与命令兼容未验证 |
| 失败恢复 | 重试模型任务可能付费 | 还原副本、查配置及来源 | 旧版本workaround不一定适用 |
| 退出 | 保留读书笔记 | 删除练习环境、撤销测试凭据 | 文档阅读本身不需安装 |

#### 证据与依据

**依据 1 · 作者声明**：[README.md:470-473](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/README.md#L470-L473)

标注正文实测旧版本及示例环境。

```text
## ℹ️ 版本说明

- 正文实测基于 dsh `0.1.0-rc.6` / DeepSeek-V4-Flash-0731（2026-08-13 开源）；版本线已同步至 `v0.1.3-alpha.1`（npm 已发布线 `0.1.2-rc.1`）
- 示例环境：Windows 11 + Node 24
```

**依据 2 · 作者声明**：[docs/benchmark.md:9-32](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/docs/benchmark.md#L9-L32)

任务范围与45/45分母同表。

<details>
<summary>查看原文（24行）</summary>

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

## 结果（3 轮采样，取中位数）

| Agent | T1 创建文件 | T2 搜索统计 | T3 修 bug+验证 | T4 生成报告 | T5 多文件重构 | 总计（中位） | 正确率 |
|---|---|---|---|---|---|---|---|
| **omp** | 10s ✅ | 11s ✅ | 15s ✅ | 21s ✅ | 13s ✅ | **70s** | 45/45 |
| **dsh** | 22s ✅ | 15s ✅ | 48s ✅ | 26s ✅ | 19s ✅ | **130s** | 45/45 |
| **opencode** | 35s ✅ | 37s ✅ | 42s ✅ | 30s ✅ | 28s ✅ | **172s** | 45/45 |

> 总计 = 5 任务中位数相加；扩展前（仅 T1-T3）为 omp 36s / dsh 85s / opencode 114s。
```

</details>

**依据 3 · 作者声明**：[docs/benchmark.md:36-42](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/docs/benchmark.md#L36-L42)

提供三轮原始耗时。

```text
原始 3 轮（秒）：

| Agent | 轮次 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|
| dsh | 1 / 2 / 3 | 11 / 27 / 22 | 11 / 15 / 22 | 27 / 48 / 74 | 30 / 26 / 25 | 19 / 25 / 18 |
| opencode | 1 / 2 / 3 | 18 / 35 / 35 | 19 / 37 / 37 | 50 / 41 / 42 | 30 / 49 / 30 | 28 / 28 / 32 |
| omp | 1 / 2 / 3 | 9 / 10 / 12 | 9 / 11 / 12 | 13 / 33 / 15 | 23 / 21 / 17 | 16 / 12 / 13 |
```

**依据 4 · 作者声明**：[docs/benchmark.md:58-75](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/docs/benchmark.md#L58-L75)

命令和任务文本可查，但完整数据位于作者本机。

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

#### 缺口

- 完整benchmark输入产物与每Agent正确率分母未能对应。
  **影响**：不能独立复现正确性和耗时排名。
  **进一步探讨**：公开按Agent/任务/轮次编号的输入、输出、日志与验收清单，解释45/45分母。
- 章节命令未逐一对应当前宿主版本执行。
  **影响**：读者可能遇到预发布API与配置漂移。
  **进一步探讨**：对照固定宿主版本维护章节适用范围，先在副本验证一个最小示例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 读者怎样使用它，怎样验证学习路径确实有帮助？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议新手把它作为中文导航和问题清单，先选择一个最小目标，只在独立目录练习；关键命令与权限以对应版本的官方资料交叉核对。需要当前选型或生产安全结论的人，不应只引用手册的历史能力矩阵和小样本成绩。

未验证假设是给每段练习绑定宿主完整版本、输入fixture与可机器检查结果，比更新整篇概括更能减少新手卡住。最小对照让同背景读者分别用现有章节与版本化练习完成同一个插件挂载，记录失败定位时间、求助次数和最终解释正确性。若额外版本维护不能降低卡点，保留简洁导航而不扩展教程自动化。

#### 证据与依据

**依据 1 · 源码核查**：[docs/roadmap.md:11-26](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/docs/roadmap.md#L11-L26)

最小练习动作与验收可作为对照任务。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 2 · 作者声明**：[docs/benchmark.md:75-75](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/docs/benchmark.md#L75-L75)

缺公开输入产物是版本化练习的切入点。

```text
> 完整任务定义、合成数据与产物：`~/agent-bench/bench-ext/`（T4/T5 每 agent 独立目录）；T1-T3 见 `~/agent-bench/`。白皮书仓库内 `benchmark/` 目录规划中。
```

**依据 3 · 作者声明**：[README.md:467-473](https://github.com/Electricitysheep/dsh-handbook/blob/ebfb3e91da840b94eacd4f52ca8fa2690accd4b7/README.md#L467-L473)

作者承认预发布命令变化。

```text
- 章节/命令失效？rc 版本迭代所致，欢迎 issue 指正
- 想参与？见 [🤝 贡献指南（CONTRIBUTING）](./CONTRIBUTING.md) · 想看计划？[🗺️ 路线图（ROADMAP）](./ROADMAP.md) · 生态参与见 [第 7 章](./docs/07-ecosystem.md)

## ℹ️ 版本说明

- 正文实测基于 dsh `0.1.0-rc.6` / DeepSeek-V4-Flash-0731（2026-08-13 开源）；版本线已同步至 `v0.1.3-alpha.1`（npm 已发布线 `0.1.2-rc.1`）
- 示例环境：Windows 11 + Node 24
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
