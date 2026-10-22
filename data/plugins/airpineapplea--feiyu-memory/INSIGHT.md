# feiyu-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[e887ac1](https://github.com/AirPineApplea/feiyu-memory/tree/e887ac1c0eb674e31726b4eccfe904c8c2762663)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory)
<!-- END META -->

> **实现功能**：把会话事件整理为本地人格、想法和情景日记，并在新会话按条件召回。

> **核心亮点**：相对把全部历史塞进提示，它用人格内核、‘我自己想的’和情景日记三种声音区分事实归属，并把隐私检查、合并和召回放在本地文件工作流中。增量是面向陪伴感的叙事结构与可检查落盘；记忆提取仍依赖规则/模型判断，不能视为事实数据库。 参见[Q03](#research-q03)。

> **风险与缺陷**：核心价值最怕把推断写成用户事实，或把敏感内容跨会话带回。密钥规则只能覆盖已知形态，人名与第三方识别存在漏报/误报；事件异步整理、模型判断和合并还可能丢上下文。作者明确称其为玩具并提示有 bug，这应直接压低生产采用，而不是宣传式‘本地即安全’。 参见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 本地日记式记忆适合什么非生产场景？](#detail-section-11)
  - [Q02 · 事件收集、隐私闸门、整理、落盘与召回如何串联？](#detail-section-12)
  - [Q03 · feiyu-memory 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 私密对话、错误归因和跨会话污染会怎样破坏价值？](#detail-section-14)
  - [Q05 · feiyu-memory 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 长期记忆的配置、复核、存储和纠错成本是多少？](#detail-section-16)
  - [Q07 · 三声部数据模型、隐私硬拦和可删除目录是否可靠？](#detail-section-17)
  - [Q08 · 能否引入来源证明与分层同意来降低记错和隐私风险？](#detail-section-18)
  - [Q09 · feiyu-memory 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向把 DSH 当陪伴或个人记录玩具、愿意让插件读取对话并人工查看本地日记的个人。输入是会话事件、纠正语句、手写便笺和配置；合格结果是人格事实、插件推断和情景记录不混声，密钥不落盘，新会话只召回相关片段，删除 ~/.dsh/feiyu-diary 后不再残留。生产知识库、多人环境和高敏感会话不适合。

参见[Q01](#research-q01)。

基线是手工维护 AGENTS.md/笔记并在需要时复制，维护显式但不自动；另一基线是全历史检索，覆盖广却更难区分事实与推断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 事件日记 | 把会话整理为时间线和情景记录 | 异步链与模型判断可能失真 |
| 三声部记忆 | 区分人格、插件推断与情景 | 仍需用户复核归因 |
| 条件召回 | 在新会话注入相关记忆 | 相关性和 token 成本未实测 |
| 隐私清洗 | 硬阻断常见密钥并可处理第三方信息 | 启发式不保证全覆盖 |
| 手写与面板 | 用户主动记录、查看和修正 | 管理接口需本地 Host 可用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 事件与 Agent 生命周期 | 必需 | 采集会话并在停止时整理 | 事件形状漂移会漏记或错记 |
| ~/.dsh/feiyu-diary | 必需 | 保存人格、想法与日记 | 权限失败或删除会失去记忆 |
| 隐私规则与用户配置 | 效果必需 | 阻断密钥并控制第三方信息 | 规则覆盖有限，需人工复核 |
| 模型/判断链 | 部分必需 | 判断与整理候选记忆 | 费用、稳定性和归因质量未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 安装后阅读隐私设置，用低敏感纠正语句试记 | 日记出现且密钥未落盘 |
| 记录 | 后台监听事件、判断、清洗并合并 | 三类声音和来源可区分 |
| 召回 | 新会话按相关性注入片段 | 只出现相关低敏感内容 |
| 纠错/退出 | 手改或删档案，必要时删除整个目录 | 重启后错误/敏感内容不再召回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地存储及可能模型资源；金额未知 | 审代码、配置隐私、检查首条日记 | 作者定位为玩具 |
| 持续使用 | 模型调用和磁盘增长；金额未知 | 复核三声部、纠错和整理 | 每百轮负担未知 |
| 失败恢复 | 可能需重建档案 | 定位来源、删除/修正并复测召回 | 泄露后的外部影响不可自动撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨会话连续性 | 事件整理和召回链在源码中存在 | 真实相关性和任务改善未测 |
| 归属可解释 | 人格/想法/情景三声部分开 | 自动归因误差未知 |
| 隐私与退出 | 密钥硬拦、目录可删除 | 规则漏报和外部备份残留未知 |

> **思考**：核心价值最怕把推断写成用户事实，或把敏感内容跨会话带回。密钥规则只能覆盖已知形态，人名与第三方识别存在漏报/误报；事件异步整理、模型判断和合并还可能丢上下文。作者明确称其为玩具并提示有 bug，这应直接压低生产采用，而不是宣传式‘本地即安全’。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对把全部历史塞进提示，它用人格内核、‘我自己想的’和情景日记三种声音区分事实归属，并把隐私检查、合并和召回放在本地文件工作流中。增量是面向陪伴感的叙事结构与可检查落盘；记忆提取仍依赖规则/模型判断，不能视为事实数据库。 参见[Q03](#research-q03)。

相对把全部历史塞进提示，它用人格内核、‘我自己想的’和情景日记三种声音区分事实归属，并把隐私检查、合并和召回放在本地文件工作流中。增量是面向陪伴感的叙事结构与可检查落盘；记忆提取仍依赖规则/模型判断，不能视为事实数据库。 参见[Q03](#research-q03)。

三声部结构、密钥硬阻断、写前清洗、显式本地目录和整目录删除路径有可解释性；事件 flush、keepAlive 清理及路由可选注入也显示对生命周期的关注。风险在于复杂异步链和大量启发式规则，任何一步的来源信息丢失都会让后续合并难以纠错；测试存在但本轮未运行。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心价值最怕把推断写成用户事实，或把敏感内容跨会话带回。密钥规则只能覆盖已知形态，人名与第三方识别存在漏报/误报；事件异步整理、模型判断和合并还可能丢上下文。作者明确称其为玩具并提示有 bug，这应直接压低生产采用，而不是宣传式‘本地即安全’。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。只在无生产数据、单人本地且接受逐条查看日记的环境评估；先关闭第三方/人名弱规则或使用低敏感样本，验证密钥拦截、错记删除和全目录清除。出现来源不明、删除后复现或敏感跨会话召回即停止。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认本地记忆抽取、检索注入、管理界面和持久化链存在；来源准确率、冲突纠正、删除完整性与隐私排除尚未做真实会话验收，分层可信记忆方向仍待实验，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/index.mjs、src/core/privacy.mjs、src/core/recall.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、host 事件链、privacy、judge/consolidate/recall、面板和测试目录结构；不运行测试或真实模型。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：用带真值标签的纠正、否定、第三方和密钥语料跑隔离实验，按合格召回、误记、敏感漏报、纠错分钟和删除后复现判定；任何真实密钥落盘或删除后召回即否定。

**分析版本**

- **仓库**：[AirPineApplea/feiyu-memory](https://github.com/AirPineApplea/feiyu-memory)
- **版本号**：0.2.0（[固定提交 e887ac1](https://github.com/AirPineApplea/feiyu-memory/tree/e887ac1c0eb674e31726b4eccfe904c8c2762663)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可为每条记忆附来源会话/事件摘要、事实/推断标签、敏感级别、过期时间和用户确认状态；默认只自动召回已确认低敏感事实，其余在面板建议区等待批准。它可能减少误记与跨会话泄露，但会增加复核负担并削弱‘自然记得’体验。 参见[Q08](#research-q08)。

用带真值标签的纠正、否定、第三方和密钥语料跑隔离实验，按合格召回、误记、敏感漏报、纠错分钟和删除后复现判定；任何真实密钥落盘或删除后召回即否定。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 24 | 6424 | 3783 | 2122 | — |
| .md | source | 7 | 2626 | — | — | 31195 |
| .js | source | 1 | 449 | 350 | 66 | — |
| .mjs | test | 13 | 3990 | 3229 | 339 | — |

</details>

**活跃度**

[![近30天新建 6](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=grey&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+created%3A2026-09-22T16%3A02%3A08.865Z..2026-10-22T16%3A02%3A08.865Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T16%3A02%3A08.865Z..2026-10-22T16%3A02%3A08.865Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 e887ac1c0eb674e31726b4eccfe904c8c2762663 上判断 feiyu-memory 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本地日记式记忆适合什么非生产场景？

**研究主题**：场景与需求

#### 完整回答

面向把 DSH 当陪伴或个人记录玩具、愿意让插件读取对话并人工查看本地日记的个人。输入是会话事件、纠正语句、手写便笺和配置；合格结果是人格事实、插件推断和情景记录不混声，密钥不落盘，新会话只召回相关片段，删除 ~/.dsh/feiyu-diary 后不再残留。生产知识库、多人环境和高敏感会话不适合。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-19](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/README.md#L16-L19)

作者明确非生产定位和隐私提醒。

```text
- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事件收集、隐私闸门、整理、落盘与召回如何串联？

**研究主题**：功能与机制

#### 完整回答

Host 监听 session/event、agent 生命周期和 turn-stopping，把事件整理进时间线；judge/gate 选择是否记忆，privacy 在处理前对密钥硬阻断并按配置处理第三方/人名，consolidate 合并档案，recall 在会话前选择片段。面板和 sidebar 入口展示日记，HTTP 路由与工具提供手写和管理入口。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:175-178](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/host/index.mjs#L175-L178)

Host 入口装配事件、文件、路由和工具链。

```text
export function apply(ctx, rawConfig) {
  const config = resolveConfig(rawConfig);
  /** 档案目录：在 apply 时一次算定，之后全程不变 */
  const archiveDirectory = resolveArchiveDir(config);
```

**依据 2 · 源码核查**：[src/core/privacy.mjs:9-12](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/core/privacy.mjs#L9-L12)

隐私模块把密钥检测定义为不可关闭的硬阻断。

```text
 *  2. secret —— 密钥。**硬阻断**，永远处理，没有开关。
 *     命中即替换，绝不入档、绝不进日志。
 *
 *  3. name / amount —— 弱信号。**只认高置信标记**。
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · feiyu-memory 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对把全部历史塞进提示，它用人格内核、‘我自己想的’和情景日记三种声音区分事实归属，并把隐私检查、合并和召回放在本地文件工作流中。增量是面向陪伴感的叙事结构与可检查落盘；记忆提取仍依赖规则/模型判断，不能视为事实数据库。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:175-178](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/host/index.mjs#L175-L178)

Host 入口装配事件、文件、路由和工具链。

```text
export function apply(ctx, rawConfig) {
  const config = resolveConfig(rawConfig);
  /** 档案目录：在 apply 时一次算定，之后全程不变 */
  const archiveDirectory = resolveArchiveDir(config);
```

**依据 2 · 源码核查**：[src/core/privacy.mjs:9-12](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/core/privacy.mjs#L9-L12)

隐私模块把密钥检测定义为不可关闭的硬阻断。

```text
 *  2. secret —— 密钥。**硬阻断**，永远处理，没有开关。
 *     命中即替换，绝不入档、绝不进日志。
 *
 *  3. name / amount —— 弱信号。**只认高置信标记**。
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 私密对话、错误归因和跨会话污染会怎样破坏价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心价值最怕把推断写成用户事实，或把敏感内容跨会话带回。密钥规则只能覆盖已知形态，人名与第三方识别存在漏报/误报；事件异步整理、模型判断和合并还可能丢上下文。作者明确称其为玩具并提示有 bug，这应直接压低生产采用，而不是宣传式‘本地即安全’。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/privacy.mjs:9-12](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/core/privacy.mjs#L9-L12)

隐私模块把密钥检测定义为不可关闭的硬阻断。

```text
 *  2. secret —— 密钥。**硬阻断**，永远处理，没有开关。
 *     命中即替换，绝不入档、绝不进日志。
 *
 *  3. name / amount —— 弱信号。**只认高置信标记**。
```

**依据 2 · 作者声明**：[README.md:16-19](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/README.md#L16-L19)

作者明确非生产定位和隐私提醒。

```text
- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
```

#### 缺口

- 真实多轮中事实、推断与情景三声部的误归因率及隐私规则漏报率
  **影响**：错误记忆会污染后续回答，敏感漏报会跨会话扩大暴露
  **进一步探讨**：构造含纠正、否定、第三方姓名、假 token 和真格式密钥的标注语料，测落盘/召回的精确率、召回率和删除后复现

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · feiyu-memory 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖 DSH Host/Client 事件、文件目录、面板路由与重启；部分总结/判断依赖模型或会话仍活跃。持续使用依赖日记目录权限、规则和用户定期复核。失败恢复需 flush 队列、查看诊断、修正/删除条目或整个目录，并确认 keepAlive/timer 和临时归档没有残留。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:175-178](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/host/index.mjs#L175-L178)

Host 入口装配事件、文件、路由和工具链。

```text
export function apply(ctx, rawConfig) {
  const config = resolveConfig(rawConfig);
  /** 档案目录：在 apply 时一次算定，之后全程不变 */
  const archiveDirectory = resolveArchiveDir(config);
```

**依据 2 · 作者声明**：[README.md:16-19](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/README.md#L16-L19)

作者明确非生产定位和隐私提醒。

```text
- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 长期记忆的配置、复核、存储和纠错成本是多少？

**研究主题**：效果与总成本

#### 完整回答

合格任务是新会话召回一条真实、相关且不泄露的记忆。首次要安装、审代码、设隐私与看首条日记；持续成本含模型调用、磁盘增长、每条记忆复核和纠错；失败恢复要定位错误来源、删改档案并验证未来召回。没有合格召回数、误记率、敏感漏报率和人工分钟数，不能计算单位记忆成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-19](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/README.md#L16-L19)

作者明确非生产定位和隐私提醒。

```text
- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
```

**依据 2 · 源码核查**：[src/core/privacy.mjs:9-12](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/core/privacy.mjs#L9-L12)

隐私模块把密钥检测定义为不可关闭的硬阻断。

```text
 *  2. secret —— 密钥。**硬阻断**，永远处理，没有开关。
 *     命中即替换，绝不入档、绝不进日志。
 *
 *  3. name / amount —— 弱信号。**只认高置信标记**。
```

#### 缺口

- 每百轮产生的条目数、模型费用、磁盘增长、人工复核分钟和合格召回数
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：固定 50 个会话、20 个可验证事实与 20 个诱饵，统计合格召回、误记、漏记、隐私命中、复核和纠错时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 三声部数据模型、隐私硬拦和可删除目录是否可靠？

**研究主题**：工程质量与复用

#### 完整回答

三声部结构、密钥硬阻断、写前清洗、显式本地目录和整目录删除路径有可解释性；事件 flush、keepAlive 清理及路由可选注入也显示对生命周期的关注。风险在于复杂异步链和大量启发式规则，任何一步的来源信息丢失都会让后续合并难以纠错；测试存在但本轮未运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:175-178](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/host/index.mjs#L175-L178)

Host 入口装配事件、文件、路由和工具链。

```text
export function apply(ctx, rawConfig) {
  const config = resolveConfig(rawConfig);
  /** 档案目录：在 apply 时一次算定，之后全程不变 */
  const archiveDirectory = resolveArchiveDir(config);
```

**依据 2 · 源码核查**：[src/core/privacy.mjs:9-12](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/core/privacy.mjs#L9-L12)

隐私模块把密钥检测定义为不可关闭的硬阻断。

```text
 *  2. secret —— 密钥。**硬阻断**，永远处理，没有开关。
 *     命中即替换，绝不入档、绝不进日志。
 *
 *  3. name / amount —— 弱信号。**只认高置信标记**。
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否引入来源证明与分层同意来降低记错和隐私风险？

**研究主题**：新假设与验证

#### 完整回答

可为每条记忆附来源会话/事件摘要、事实/推断标签、敏感级别、过期时间和用户确认状态；默认只自动召回已确认低敏感事实，其余在面板建议区等待批准。它可能减少误记与跨会话泄露，但会增加复核负担并削弱‘自然记得’体验。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/privacy.mjs:9-12](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/core/privacy.mjs#L9-L12)

隐私模块把密钥检测定义为不可关闭的硬阻断。

```text
 *  2. secret —— 密钥。**硬阻断**，永远处理，没有开关。
 *     命中即替换，绝不入档、绝不进日志。
 *
 *  3. name / amount —— 弱信号。**只认高置信标记**。
```

**依据 2 · 作者声明**：[README.md:16-19](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/README.md#L16-L19)

作者明确非生产定位和隐私提醒。

```text
- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
```

#### 缺口

- 来源证明与确认队列能否显著降低误记而不让用户放弃维护
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：A/B 比较自动召回与确认后召回，要求敏感误召回为零、事实精度提升且每周复核少于 10 分钟，否则否定

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · feiyu-memory 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察。只在无生产数据、单人本地且接受逐条查看日记的环境评估；先关闭第三方/人名弱规则或使用低敏感样本，验证密钥拦截、错记删除和全目录清除。出现来源不明、删除后复现或敏感跨会话召回即停止。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-19](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/README.md#L16-L19)

作者明确非生产定位和隐私提醒。

```text
- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
```

**依据 2 · 源码核查**：[src/core/privacy.mjs:9-12](https://github.com/AirPineApplea/feiyu-memory/blob/e887ac1c0eb674e31726b4eccfe904c8c2762663/src/core/privacy.mjs#L9-L12)

隐私模块把密钥检测定义为不可关闭的硬阻断。

```text
 *  2. secret —— 密钥。**硬阻断**，永远处理，没有开关。
 *     命中即替换，绝不入档、绝不进日志。
 *
 *  3. name / amount —— 弱信号。**只认高置信标记**。
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
