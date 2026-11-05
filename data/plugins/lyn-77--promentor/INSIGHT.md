# ProMentor

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[90501c9](https://github.com/Lyn-77/ProMentor/tree/90501c96ebc4747667738dddd505a65996a1ccef)

<!-- BEGIN META -->
[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Lyn-77/ProMentor)
<!-- END META -->

> **功能**：通过Agent Skill把项目组织为讲义、源码导读、Lab与行为测试，配JSON进度和可选Dashboard。

> **亮点**：[Q01](#research-q01)/[Q05](#research-q05) 将源码阅读与实现练习流程结构化；无可信独立判题或学习效果证据。

> **主要限制**：[Q02](#research-q02) 成绩/测试可同工作区改动、恢复无版本校核；[Q03](#research-q03) 面板路径与授权边界不宜敏感远程共享。

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
  - [Q01 · 谁用它学习什么，合格交付和基线是什么？](#detail-section-11)
  - [Q02 · 生成、测试、提交与复习如何改变磁盘状态？](#detail-section-12)
  - [Q03 · DSH和独立Dashboard怎样读课程，权限边界如何？](#detail-section-13)
  - [Q04 · 启动、持续和失败恢复有哪些具体依赖成本？](#detail-section-14)
  - [Q05 · 哪些贡献可迁移，假设如何验证及采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 开发者在项目副本逐章学习架构，合格结果是独立实现与迁移，不只是测试100分。

普通AI解释源码或人工写练习；增量为依赖章节、Lab约定、提示及持久进度。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 课程规划生成 | 扫描项目、确认依赖大纲、生成讲义和Lab | 由Agent遵循指令，非固定正确课程 |
| 练习反馈与提交 | 测试命令、分层提示、attempt和进度 | 本地文件可改，非独立可信成绩 |
| 复习与源码对照 | Review实现与原始源码设计 | 可能泄露答案，迁移效果未知 |
| 进度面板 | DSH会话cwd或Python读取课程 | 授权/真实路径与全地址监听需修复 |
| 中断续生 | 按course列表与缺章目录续生成 | 无hash/原子完整性校验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持Skill的Agent和模型 | 必需 | 生成/讲解/评审 | 并非固定课程，质量取决上下文与模型 |
| 目标语言工具链 | Lab测试需 | 执行生成test_command | 必须先审命令；未隔离评测 |
| DSH插件预构建包/API | DSH面板需 | host文件读取和client插槽 | dist不入库，构建需harness工作区 |
| Python3与Dashboard资产 | 独立面板需 | 双根HTTP展示 | 实际监听::，不能当回环限定 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 生成一章 | 副本源码扫描、大纲确认并审文件 | 不跑未经审核test_command |
| 练习 | 独立实现并自行执行行为测试 | 100分仅当前测试通过 |
| 对照 | 新迁移题与参考断言人工核验 | 课程错误则停止依赖分数 |
| 退出 | 停服务/禁面板并备份进度提交 | 修路径与权限前不远程分享 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型扫描/生成tokens、构建资源 | 审大纲/源码引用和测试 | 费用/工时未知，非零内容成本 |
| 持续 | 讲解review模型与行为测试、面板探测 | 手写Lab及核反馈 | 独立学习收益未测 |
| 失败 | 重生成/工具链调试资源 | 校错测试、半章恢复和保存提交 | 无成绩事务/版本失效，恢复工时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 组织学习 | 章节/Lab/提示和进度约定存在 | 迁移掌握与节时未测 |
| 测试反馈 | 指令要求跑命令并展示期望/实际 | 测试质量/独立性无强制保证 |
| 课程展示 | 面板读取JSON/Markdown | 成绩可信与敏感访问未验证 |

> **思考**：[Q02](#research-q02) 成绩/测试可同工作区改动、恢复无版本校核；[Q03](#research-q03) 面板路径与授权边界不宜敏感远程共享。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)/[Q05](#research-q05) 将源码阅读与实现练习流程结构化；无可信独立判题或学习效果证据。

[Q02](#research-q02) 文件格式利于复用但无原子评测/恢复；[Q03](#research-q03) 面板词法与真实路径边界须分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 成绩/测试可同工作区改动、恢复无版本校核；[Q03](#research-q03) 面板路径与授权边界不宜敏感远程共享。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 观察一章非敏感副本；先审命令和题目，再独立迁移验证，读边界修复前不远程共享。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定材料确认Skill指令与两种面板读取路径；未生成课程、运行测试或测学习效果。

- 已检查：作者 README、包清单、源码路径 README.md、skills/promentor/SKILL.md、dsh-plugin/src/client-ui-promentor/src/client/index.ts、dsh-plugin/src/client-ui-promentor/src/client/dock.tsx、dsh-plugin/src/host-promentor/src/index.ts、skills/promentor/scripts/serve.py、dsh-plugin/README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Skill生成/测试/提交/恢复、参考约束、DSH会话cwd与Host读取、Python双根与绑定；未运行目标或生成课程。
- 下一步：固定90501c96ebc4747667738dddd505a65996a1ccef静态读取，额外Git原件serve.fixed.py供定位；未安装、服务监听或路径复现，学习与费用结果未知。

**分析版本**

- **仓库**：[Lyn-77/ProMentor](https://github.com/Lyn-77/ProMentor)
- **版本号**：未声明（[固定提交 90501c9](https://github.com/Lyn-77/ProMentor/tree/90501c96ebc4747667738dddd505a65996a1ccef)）
- **版本日期**：2026-09-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 版本绑定与独立审核课程是假设，以迁移学习和审核成本对照证伪，当前未实现。

固定90501c96ebc4747667738dddd505a65996a1ccef静态读取，额外Git原件serve.fixed.py供定位；未安装、服务监听或路径复现，学习与费用结果未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1207 | — | — | 9072 |
| .tsx | source | 14 | 1231 | 1101 | 20 | — |
| .ts | source | 12 | 802 | 650 | 67 | — |
| .mjs | source | 3 | 80 | 53 | 16 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Lyn-77/ProMentor/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：源码学习者能否由项目生成可审查课程，完成独立实现与有边界的成绩/进度展示？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用它学习什么，合格交付和基线是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向想理解当前开源系统架构而不止读代码的开发学习者。Skill指导Agent先扫描项目、拟大纲，经用户确认逐章生成讲义、带行号源码导读、接口Lab与行为测试，然后learn/test/hint/submit/review推进。相对临时让AI解释源码或自己写练习，增量是依赖有序的课程、手写任务、分层提示和进度文件约定，不是经认证的MIT课程，也不是学习效果测量器。

根主交付是AI Coding Agent Skill，DSH内置面板是可选辅助；不应仅因仓库含host/client源码把根项当已可安装原生插件。合格结果需大纲与真实代码相符、Lab能独立实现、测试覆盖关键行为且学生不靠看答案通过，最后能迁移解决新问题。README“零内容生产成本”只是作者宣传，模型生成、审核和纠错均有成本，静态存在这些指令不能证明学会架构。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-16](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/README.md#L1-L16)

根产品是Skill及可选DSH面板。

<details>
<summary>查看原文（16行）</summary>

```text
# ProMentor

> 把任意开源项目转成 MIT 风格的动手工程课程 在实践中学习

ProMentor 是一个 **AI Coding Agent Skill**。装上它，你的 AI 编程助手立刻化身为导师——扫描项目架构、生成阶梯式 Chapter、带你手写核心逻辑、自动判题、AI Code Review。

**学的不是算法题，是一个真实系统的架构设计能力。**

## 安装

### DSH Web GUI 内置 Dashboard（非DeepSeek Harness不需要看）

> 只有 DSH 需要本小节：它的 Dashboard 是 **GUI 内置插件**（Codex / Claude Code
> 等其他 Agent 的技能包自带静态网页，跳过本小节）。插件预构建产物随 Release 包
> 分发，仓库本身不含构建产物。

```

</details>

**依据 2 · 源码核查**：[skills/promentor/SKILL.md:60-120](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/SKILL.md#L60-L120)

确认大纲再生成课程链。

<details>
<summary>查看原文（61行）</summary>

````text
### 2.1 `/promentor init`

**触发**: 用户输入 `/promentor init`

**第一步：确认项目语言和结构**

1. 搜索入口文件（`main.go`、`main.py`、`app.ts`、`index.js` 等）
2. 搜索 package/namespace/module 声明
3. 统计文件数、代码行数
4. 告诉用户你识别到的项目信息，确认是否继续

**第二步：四轮扫描**（详见 `references/generation.md`）

1. 结构探测：获取文件树，识别模块边界
2. 核心类型识别：搜索 type/class/interface 声明，读取关键源码
3. 调用链追踪：从入口点追踪请求生命周期
4. 架构归纳：识别设计模式，拟定 Chapter 边界

**第三步：生成大纲**

在对话中展示课程大纲，包含：
- 每个 Chapter 的标题、难度、一句话简介
- Chapter 之间的依赖关系
- 预计总 Chapter 数

格式：
```
ProMentor 课程大纲：《{项目名} 内部设计》

Ch 0: 环境搭建              [easy]  开发环境配置和基础结构
Ch 1: HTTP Server 基础      [mid]   net/http Server 的生命周期
Ch 2: Router 设计           [hard]  为什么用 radix tree 而不是 map
Ch 3: Middleware 管道        [mid]   责任链模式实践
Ch 4: Context 系统          [hard]  请求上下文的设计哲学
Final: 组装 Mini Gin        [hard]  把所有组件拼成一个可用的框架

回复可调整：新增 / 删除 / 合并 / 调整顺序
```

**一定要等用户回复确认后**，才能进入第四步。用户可以增删改大纲。

**第四步：逐 Chapter 生成**

用户确认大纲后，按顺序为每个 Chapter 生成：

1. `lecture.md` —— 根据 `references/generation.md` 的生成规范
2. `source.md` —— 标注关键源码行
3. `lab.json` —— 定义接口签名
4. `lab_test.<ext>` —— 行为测试（详见 `references/generation.md`）
5. （仅 Final/组装章）可运行入口 —— 按目标语言惯例生成在课程根目录（详见 `references/generation.md`）

生成完一个 Chapter 后，汇报进度（"Ch 1/5 已生成..."），继续下一个。

**第五步：收尾**

1. 写入 `course.json` 和 `progress.json`（所有 Chapter 状态为 `not_started`）
2. 追加 `.promentor/` 到 `.gitignore`
3. 提示网页面板：**DSH Web GUI 已内置 ProMentor Dashboard**——用户点击会话输入框上方的
   `ProMentor` 按钮即可打开当前项目的课程面板（无需任何本地服务）。
   若 GUI 中未出现按钮（插件未安装），引导用户运行 `dsh-plugin/install.sh` 或使用
   备用方案 `python3 <promentor-skill>/scripts/serve.py` 启动独立仪表盘。
````

</details>

**依据 3 · 作者声明**：[README.md:167-173](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/README.md#L167-L173)

作者零内容生产成本主张。

```text

## 为什么是 ProMentor

- **比直接读源码有路线**：不是随机跳转，是有依赖关系的阶梯式学习路径
- **比视频课深入**：不是看别人写代码，是自己亲手实现核心逻辑
- **比博客系统化**：不是碎片化知识点，是完整理解一个系统的设计哲学
- **AI 原生**：课程由 AI 生成、AI 讲解、AI 判题、AI Review。零内容生产成本。
```

#### 缺口

- 课程质量与学习迁移未测
  **影响**：不能承诺掌握系统设计或零成本
  **进一步探讨**：用已知项目检查课程忠实性，再以迁移任务对照普通源码阅读

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 生成、测试、提交与复习如何改变磁盘状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

实际教学执行主要由SKILL指令约束Agent，而非一个强制工作流服务。init要求先查入口/语言、四轮扫描、用户确认大纲，然后写每章lecture/source/lab/test，收尾course.json/progress.json并追加.promentor到.gitignore。test从progress.current_chapter找lab.test_command在项目根执行，解析输出给期望/实际；任意项目或生成的命令不是沙盒化评测，执行安全仍依宿主批准和环境。

submit规定全测通过才成功，按比例算分、复制学生代码attempt_N、更新status/score/attempts/completed_at；没有服务端锁、不可篡改测试仓或原子成绩事务。学生、Agent与测试/进度在同工作区，所谓“学生不可改测试”“锁定成绩”是教学约定而非权限防篡改；分数只代表当前生成测试通过，不能代表独立掌握。模型既出题又解释/评审，错误断言与答案泄露都须人工校核。

init --resume仅比较course.json列表和已有章节目录，从首个缺失章继续；已有目录并不验证文件齐全、内容hash或项目提交版本。如果course.json未落盘就重做大纲，生成后源码改变也未有自动失效协议。恢复应先备份并核每章文件/测试命令，不能盲信目录存在。

#### 证据与依据

**依据 1 · 源码核查**：[skills/promentor/SKILL.md:101-120](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/SKILL.md#L101-L120)

生成文件与忽略目录副作用。

<details>
<summary>查看原文（20行）</summary>

```text
**第四步：逐 Chapter 生成**

用户确认大纲后，按顺序为每个 Chapter 生成：

1. `lecture.md` —— 根据 `references/generation.md` 的生成规范
2. `source.md` —— 标注关键源码行
3. `lab.json` —— 定义接口签名
4. `lab_test.<ext>` —— 行为测试（详见 `references/generation.md`）
5. （仅 Final/组装章）可运行入口 —— 按目标语言惯例生成在课程根目录（详见 `references/generation.md`）

生成完一个 Chapter 后，汇报进度（"Ch 1/5 已生成..."），继续下一个。

**第五步：收尾**

1. 写入 `course.json` 和 `progress.json`（所有 Chapter 状态为 `not_started`）
2. 追加 `.promentor/` 到 `.gitignore`
3. 提示网页面板：**DSH Web GUI 已内置 ProMentor Dashboard**——用户点击会话输入框上方的
   `ProMentor` 按钮即可打开当前项目的课程面板（无需任何本地服务）。
   若 GUI 中未出现按钮（插件未安装），引导用户运行 `dsh-plugin/install.sh` 或使用
   备用方案 `python3 <promentor-skill>/scripts/serve.py` 启动独立仪表盘。
```

</details>

**依据 2 · 源码核查**：[skills/promentor/SKILL.md:202-238](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/SKILL.md#L202-L238)

test命令与输出解析。

<details>
<summary>查看原文（37行）</summary>

````text
### 2.4 `/promentor test`

**触发**: `/promentor test`

**第一步：确定当前 Chapter**

1. 读取 `progress.json` 的 `current_chapter`
2. 如果没有 `current_chapter`，询问用户要测哪个 Chapter

**第二步：运行测试**

1. 读取 `lab.json` 中的 `test_command`
2. 在项目根目录执行测试命令
3. 捕获完整输出

**第三步：解析结果**

展示测试结果：

```
3/5 通过

✅ TestStaticRoute       (0.02s)
❌ TestParamRoute        (0.01s) —— params["id"] 期望 "42"，得到空 map
✅ TestMethodMismatch    (0.01s)
❌ TestNestedParamRoute  (0.01s) —— 嵌套参数解析失败
❌ TestWildcardRoute     (0.01s) —— 通配符未实现

静态路由没问题。参数路由挂了。需要提示吗？/promentor hint
```

**原则**：
- 通过和失败都要展示
- 对每个失败，简要解释"期望什么 vs 得到什么"
- 给出 1-2 句整体诊断
- 主动提示可以 `/promentor hint`

````

</details>

**依据 3 · 源码核查**：[skills/promentor/SKILL.md:276-300](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/SKILL.md#L276-L300)

提交成绩和复制快照是Agent指令。

<details>
<summary>查看原文（25行）</summary>

````text
### 2.6 `/promentor submit`

**触发**: `/promentor submit`

**第一步：全量测试**

1. 运行 `lab.json` 中的 `test_command`
2. 必须全部通过才算提交成功
3. 如果有失败，拒绝提交，建议学生继续修改

**第二步：记录成绩**

1. 计算分数：`(通过测试数 / 总测试数) * 100`
2. 复制学生代码到 `.promentor/submissions/{chapter_id}/attempt_{N}.<ext>`
3. 更新 `progress.json`：
   - `status`: `completed`（如果 100%）或保持 `in_progress`
   - `score`: 最终得分
   - `attempts`: +1
   - `completed_at`: 当前时间戳

**第三步：展示结果**

```
✅ 提交成功！5/5 全部通过，得分 100%

````

</details>

**依据 4 · 源码核查**：[skills/promentor/SKILL.md:501-511](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/SKILL.md#L501-L511)

resume按章节存在判断。

<details>
<summary>查看原文（11行）</summary>

```text
## 5. 断点续传（init --resume）

**触发**: `/promentor init --resume`

当 `init` 过程中断（用户关闭对话、网络超时等），用户重新运行 `init --resume` 时：

1. 检查 `.promentor/chapters/` 下已有哪些 Chapter 目录
2. 对比 `course.json` 中的 Chapter 列表
3. 从第一个缺失的 Chapter 继续生成
4. 已完成的 Chapter 不重复生成
5. 如果 `course.json` 不存在（中断在大纲确认前），从大纲生成步骤重新开始
```

</details>

#### 缺口

- Agent遵循程度、生成测试正确性与执行安全未验
  **影响**：成绩不是可信外部认证，恢复可能沿用半成品
  **进一步探讨**：审查test_command，在可丢弃环境校对独立参考测试并中断恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · DSH和独立Dashboard怎样读课程，权限边界如何？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

DSH dock在当前session summary取cwd，每10秒hasCourse，有课程才出按钮；点击将workspace存进共享panel store，data.ts经/promentor/data?ws=绝对目录&p=相对路径取JSON/Markdown。Host只允许GET/HEAD，realpath(workspace)后把.promentor和normalize(rel)做词法包含检查，再stat/readFile。未见session/授权工作区校验，客户端传ws不是服务端用户授权。

Host只canonicalize工作区，不realpath目标或.promentor：如果课程目录或内部文件是指向外部的symlink，stat/readFile会跟随，词法包含不等真实文件仍在目录内。这是固定源码的路径语义风险，未做利用复现；不能复述注释“每个读取都限制目录”为已验证保证。

独立serve.py双根给静态assets和当前项目.promentor，resolve目标后用字符串startswith(root)判包含，而非路径分段；同前缀兄弟目录可通过此判断，根本身是symlink也需核。服务实际bind ::，页面显示localhost不意味着仅监听回环，未见登录；私有课程与源码导读不宜直接暴露。全局PID已有其他项目时会停旧服务切当前项目，多个项目非独立同时服务。Dashboard展示文件/进度，不执行判题也不验证分数来源。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/client-ui-promentor/src/client/index.ts:36-73](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/dsh-plugin/src/client-ui-promentor/src/client/index.ts#L36-L73)

会话cwd到store和插槽。

<details>
<summary>查看原文（38行）</summary>

```text
  const store = createDashboardStore()

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-promentor: dictionaries')

  const triggerActions = (sessionId: SessionId): DashboardTriggerActions => ({
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    open: () => {
      const summary = ctx.sessions.list.getSnapshot().byId[sessionId]
      store.open(summary?.cwd ?? null)
    },
    close: () => store.close(),
    getWorkspace: () => ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd ?? null,
  })

  const panelActions = (): DashboardPanelActions => ({
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    close: () => store.close(),
    refresh: () => store.refresh(),
  })

  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
    name: 'conversation.input.dock',
    id: 'promentor',
    order: 20,
    locale: NS,
    inject: triggerActions,
  }, DashboardTrigger))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'promentor',
    order: 10,
    locale: NS,
    inject: panelActions,
  }, DashboardPanel))
}
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/client-ui-promentor/src/client/dock.tsx:27-60](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/dsh-plugin/src/client-ui-promentor/src/client/dock.tsx#L27-L60)

10秒探测与按钮显示。

<details>
<summary>查看原文（34行）</summary>

```text

export function DashboardTrigger({
  getSnapshot,
  subscribe,
  open,
  close,
  getWorkspace,
  t,
}: DashboardTriggerProps) {
  const state = useSyncExternalStore(subscribe, getSnapshot)
  const workspace = getWorkspace()
  const [available, setAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    if (workspace === null) {
      setAvailable(false)
      return
    }
    let cancelled = false
    const probe = (): void => {
      hasCourse(workspace).then((ok) => {
        if (!cancelled) setAvailable(ok)
      })
    }
    probe()
    const timer = setInterval(probe, PROBE_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [workspace])

  // The trigger only exists while the session workspace holds a course, so
  // the "course not initialized" state is unreachable from the dock.
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/host-promentor/src/index.ts:67-108](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/dsh-plugin/src/host-promentor/src/index.ts#L67-L108)

词法边界与跟随symlink读取。

<details>
<summary>查看原文（42行）</summary>

```text
    res.end()
    return
  }
  const url = new URL(req.url ?? '/', 'http://dsh.local')
  const workspace = url.searchParams.get('ws')
  const rel = url.searchParams.get('p')
  if (workspace === null || rel === null) {
    sendStatus(res, 400)
    return
  }
  try {
    const wsRoot = await realpath(workspace)
    const dataRoot = resolve(join(wsRoot, DATA_DIR))
    const relPath = normalize(rel)
    if (relPath === '' || isAbsolute(relPath) || relPath.startsWith('..')) {
      sendStatus(res, 400)
      return
    }
    const target = resolve(join(dataRoot, relPath))
    const inside = relative(dataRoot, target)
    if (inside.startsWith('..') || isAbsolute(inside)) {
      sendStatus(res, 403)
      return
    }
    const info = await stat(target)
    if (!info.isFile()) {
      sendStatus(res, 404)
      return
    }
    const ext = target.slice(target.lastIndexOf('.'))
    const type = CONTENT_TYPES[ext] ?? 'application/octet-stream'
    res.writeHead(200, {
      'content-type': type,
      'content-length': String(info.size),
      'cache-control': 'no-cache',
    })
    if (req.method === 'HEAD') {
      res.end()
      return
    }
    res.end(await readFile(target))
  } catch (error) {
```

</details>

**依据 4 · 源码核查**：[skills/promentor/scripts/serve.py:52-82](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/scripts/serve.py#L52-L82)

Python resolve加字符串前缀校验。

<details>
<summary>查看原文（31行）</summary>

```text
class ProMentorHandler(http.server.SimpleHTTPRequestHandler):
    """双根静态服务器：
    - /dashboard/*  -> 技能包内的构建产物（不向项目复制任何文件）
    - /.promentor/* -> 当前项目根目录的课程数据
    - 章节路由 SPA fallback：产物中不存在的路径返回主页壳
    """

    def __init__(self, *args, assets=None, project=None, base_path=BASE_PATH, **kwargs):
        self.assets = Path(assets).resolve()
        self.project = Path(project).resolve()
        self.base_path = base_path
        super().__init__(*args, **kwargs)

    def _safe(self, root: Path, rel: str) -> str:
        """将相对路径解析到 root 内，防止路径穿越"""
        target = (root / rel).resolve()
        if not str(target).startswith(str(root)):
            return str(root)
        return str(target)

    def translate_path(self, path):
        path = unquote(urlsplit(path).path)
        if path.startswith(f"{self.base_path}/"):
            rel = path[len(self.base_path):].lstrip("/")
            return self._safe(self.assets, rel)
        if path.startswith("/.promentor/"):
            rel = path[len("/.promentor/"):]
            return self._safe(self.project / ".promentor", rel)
        return self._safe(self.assets, path.lstrip("/"))

    def _redirect_home(self):
```

</details>

**依据 5 · 源码核查**：[skills/promentor/scripts/serve.py:332-369](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/scripts/serve.py#L332-L369)

跨项目停旧与全地址监听。

<details>
<summary>查看原文（38行）</summary>

```text
def cmd_start(args) -> int:
    """启动服务：部署产物、找端口、后台运行、打开浏览器"""
    signal.signal(signal.SIGTERM, handle_term)

    existing = load_pid()
    if existing and is_alive(existing):
        current_project = process_cwd(existing)
        if current_project and current_project != str(Path.cwd()):
            print(
                f"仪表盘正在服务其他项目（{current_project}）",
                flush=True,
            )
            print("自动切换为当前项目（停止旧进程并重新启动）", flush=True)
            cmd_stop()
        else:
            print("ProMentor Dashboard: 已在运行", flush=True)
            print_status(existing, args.base_path)
            return 0

    project = project_root()
    assets = assets_dir()
    port = free_port(args.port)
    url = f"http://localhost:{port}{args.base_path}/"

    handler = partial(
        ProMentorHandler,
        assets=assets,
        project=project,
        base_path=args.base_path,
    )
    try:
        httpd = ProMentorServer(("::", port), handler)
    except OSError as exc:
        print(f"错误：无法绑定端口 {port}（{exc}）", flush=True)
        sys.exit(1)

    if args.foreground:
        print(f"ProMentor Dashboard: {url}", flush=True)
```

</details>

#### 缺口

- 宿主外层访问控制、实际symlink/网络暴露未复现
  **影响**：不适合把敏感课程作为可信远程多用户面板
  **进一步探讨**：用无敏感样本核未授权ws、外链和同前缀兄弟路径，并检查监听地址/防火墙

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、持续和失败恢复有哪些具体依赖成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需支持Skill的Agent、读取目标源码的权限、相应模型与编译/测试工具链。课程内容和test_command生成可因项目语言而异，不能把提示词支持任意项目视为任意项目可运行。DSH还需webServer、slots/locale/sessions API及预构建插件；文档说dist不入库，源码镜像构建仍需harness工作区，固定源码不证明Release包安装成功。独立面板需Python3与构建后的dashboard资产，开发构建另有Next/React依赖。

首次成本是扫描tokens、课程生成与人工审大纲/测试；持续为讲解/提示/review模型tokens、语言运行时与行为测试、DSH10秒课程探测；失败为半章重生成、错误测试校正、学生提交/进度恢复及服务切项目。金额、时间和学习收益都未测，不能以不另收服务费或README宣传写零成本。init会写课程和.gitignore，测试命令可影响项目；在副本学习并先审命令。退出停止Python服务或禁用DSH面板，保留course/progress/submissions供核查，确认备份后才决定清课程；本轮未执行安装卸载。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-32](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/README.md#L11-L32)

构建产物与DSH可选安装条件。

<details>
<summary>查看原文（22行）</summary>

````text
### DSH Web GUI 内置 Dashboard（非DeepSeek Harness不需要看）

> 只有 DSH 需要本小节：它的 Dashboard 是 **GUI 内置插件**（Codex / Claude Code
> 等其他 Agent 的技能包自带静态网页，跳过本小节）。插件预构建产物随 Release 包
> 分发，仓库本身不含构建产物。

**安装（一条命令）**

```bash
# 方式 A（推荐）：下载 Release 的 promentor.zip 并解压
cd <解压目录>/promentor
bash dsh-plugin/install.sh

# 方式 B（源码）：clone 本仓库后先 make build
cd /path/to/ProMentor
bash dsh-plugin/install.sh
```

- 卸载：`bash dsh-plugin/uninstall.sh`

### 从release下载zip

````

</details>

**依据 2 · 源码核查**：[dsh-plugin/README.md:10-23](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/dsh-plugin/README.md#L10-L23)

源码镜像及harness构建依赖。

<details>
<summary>查看原文（14行）</summary>

```text
| 路径 | 内容 |
|------|------|
| `src/host-promentor/` | **插件源码**：host 数据网关（对应 deepseek-harness `packages/host/promentor`，入库） |
| `src/client-ui-promentor/` | **插件源码**：面板 UI（对应 deepseek-harness `packages/client/ui-promentor`，入库） |
| `dist/` | **预构建插件包**（安装用；**不入库**——发版时由 `make release` 构建进 Release zip） |

插件源码位于 deepseek-harness 仓库（`packages/host/promentor` +
`packages/client/ui-promentor`）；`src/` 是本仓库的同步镜像（供查阅，
构建仍需 harness 工作区，见 `rebuild-dist.sh`）。`dist/` 不提交 git：
要么从 Release 的 `promentor.zip` 获取（推荐），要么本地运行
`bash dsh-plugin/rebuild-dist.sh` 生成。

## 界面

```

</details>

**依据 3 · 源码核查**：[skills/promentor/SKILL.md:115-120](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/SKILL.md#L115-L120)

写入课程/进度与gitignore。

```text
1. 写入 `course.json` 和 `progress.json`（所有 Chapter 状态为 `not_started`）
2. 追加 `.promentor/` 到 `.gitignore`
3. 提示网页面板：**DSH Web GUI 已内置 ProMentor Dashboard**——用户点击会话输入框上方的
   `ProMentor` 按钮即可打开当前项目的课程面板（无需任何本地服务）。
   若 GUI 中未出现按钮（插件未安装），引导用户运行 `dsh-plugin/install.sh` 或使用
   备用方案 `python3 <promentor-skill>/scripts/serve.py` 启动独立仪表盘。
```

**依据 4 · 源码核查**：[skills/promentor/scripts/serve.py:332-369](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/scripts/serve.py#L332-L369)

全局单服务切换及资产/绑定。

<details>
<summary>查看原文（38行）</summary>

```text
def cmd_start(args) -> int:
    """启动服务：部署产物、找端口、后台运行、打开浏览器"""
    signal.signal(signal.SIGTERM, handle_term)

    existing = load_pid()
    if existing and is_alive(existing):
        current_project = process_cwd(existing)
        if current_project and current_project != str(Path.cwd()):
            print(
                f"仪表盘正在服务其他项目（{current_project}）",
                flush=True,
            )
            print("自动切换为当前项目（停止旧进程并重新启动）", flush=True)
            cmd_stop()
        else:
            print("ProMentor Dashboard: 已在运行", flush=True)
            print_status(existing, args.base_path)
            return 0

    project = project_root()
    assets = assets_dir()
    port = free_port(args.port)
    url = f"http://localhost:{port}{args.base_path}/"

    handler = partial(
        ProMentorHandler,
        assets=assets,
        project=project,
        base_path=args.base_path,
    )
    try:
        httpd = ProMentorServer(("::", port), handler)
    except OSError as exc:
        print(f"错误：无法绑定端口 {port}（{exc}）", flush=True)
        sys.exit(1)

    if args.foreground:
        print(f"ProMentor Dashboard: {url}", flush=True)
```

</details>

#### 缺口

- Release包兼容、工具链执行与费用工时未知
  **影响**：初次采用需审查，不是即装即用保证
  **进一步探讨**：可丢弃项目先验一章、备份恢复和服务停启，确认文件影响

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些贡献可迁移，假设如何验证及采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可借鉴的是按真实调用链拆章节、先确认大纲、明确Lab签名、行为测试和分层提示，以及通用JSON进度与只读展示分层。当前建议观察：开发者先在非敏感项目副本生成一章，手工核源码行号/接口/测试断言，审test_command后才自行运行，再用与课程测试不同的迁移任务判断是否会独立设计；不要把100分或“MIT风格”当能力证明。远程共享前必须修路径/授权与监听边界，否则停用面板仅用本地文件。

未实现方向是“版本绑定的可校核课程”：course记录源提交和选定符号hash，逐章保存生成证据、独立参考测试与审核收据，项目变化只失效受影响章节；成绩和提示分离，让新迁移题不由同一答案生成过程泄露。最小对照含错误/过拟合测试、半目录恢复、源码改版、读答案再提交和空白迁移题；比较课程事实准确率、独立任务成功、审核工时与错误成绩。若审核耗时超过直接阅读，或通过课程仍不能独立迁移，就削弱价值。停止条件是命令副作用不清、课程断言错误或敏感文件可被面板读出；退出先停服务并回读/备份学习文件，改人工源码阅读。

#### 证据与依据

**依据 1 · 源码核查**：[skills/promentor/SKILL.md:202-238](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/SKILL.md#L202-L238)

当前测试执行与反馈作比较基线。

<details>
<summary>查看原文（37行）</summary>

````text
### 2.4 `/promentor test`

**触发**: `/promentor test`

**第一步：确定当前 Chapter**

1. 读取 `progress.json` 的 `current_chapter`
2. 如果没有 `current_chapter`，询问用户要测哪个 Chapter

**第二步：运行测试**

1. 读取 `lab.json` 中的 `test_command`
2. 在项目根目录执行测试命令
3. 捕获完整输出

**第三步：解析结果**

展示测试结果：

```
3/5 通过

✅ TestStaticRoute       (0.02s)
❌ TestParamRoute        (0.01s) —— params["id"] 期望 "42"，得到空 map
✅ TestMethodMismatch    (0.01s)
❌ TestNestedParamRoute  (0.01s) —— 嵌套参数解析失败
❌ TestWildcardRoute     (0.01s) —— 通配符未实现

静态路由没问题。参数路由挂了。需要提示吗？/promentor hint
```

**原则**：
- 通过和失败都要展示
- 对每个失败，简要解释"期望什么 vs 得到什么"
- 给出 1-2 句整体诊断
- 主动提示可以 `/promentor hint`

````

</details>

**依据 2 · 源码核查**：[skills/promentor/SKILL.md:276-300](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/SKILL.md#L276-L300)

本地成绩与提交链。

<details>
<summary>查看原文（25行）</summary>

````text
### 2.6 `/promentor submit`

**触发**: `/promentor submit`

**第一步：全量测试**

1. 运行 `lab.json` 中的 `test_command`
2. 必须全部通过才算提交成功
3. 如果有失败，拒绝提交，建议学生继续修改

**第二步：记录成绩**

1. 计算分数：`(通过测试数 / 总测试数) * 100`
2. 复制学生代码到 `.promentor/submissions/{chapter_id}/attempt_{N}.<ext>`
3. 更新 `progress.json`：
   - `status`: `completed`（如果 100%）或保持 `in_progress`
   - `score`: 最终得分
   - `attempts`: +1
   - `completed_at`: 当前时间戳

**第三步：展示结果**

```
✅ 提交成功！5/5 全部通过，得分 100%

````

</details>

**依据 3 · 源码核查**：[skills/promentor/SKILL.md:501-511](https://github.com/Lyn-77/ProMentor/blob/90501c96ebc4747667738dddd505a65996a1ccef/skills/promentor/SKILL.md#L501-L511)

恢复缺版本完整性是改进参照。

<details>
<summary>查看原文（11行）</summary>

```text
## 5. 断点续传（init --resume）

**触发**: `/promentor init --resume`

当 `init` 过程中断（用户关闭对话、网络超时等），用户重新运行 `init --resume` 时：

1. 检查 `.promentor/chapters/` 下已有哪些 Chapter 目录
2. 对比 `course.json` 中的 Chapter 列表
3. 从第一个缺失的 Chapter 继续生成
4. 已完成的 Chapter 不重复生成
5. 如果 `course.json` 不存在（中断在大纲确认前），从大纲生成步骤重新开始
```

</details>

#### 缺口

- 真实教学效果、独立审核成本与修复可用性未知
  **影响**：假设不计当前能力或提高采用成熟度
  **进一步探讨**：一章对照普通AI读源码并保存负向用例结果

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
