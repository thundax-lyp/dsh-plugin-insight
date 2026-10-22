# dsh-plugin-education

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[2d880f8](https://github.com/863683348/dsh-plugin-education/tree/2d880f86c9160652e27c1f4702265822e0e726e9)

<!-- BEGIN META -->
[![npm 30d 955](https://img.shields.io/static/v1?label=npm+30d&message=955&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-education) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-education)
<!-- END META -->

> **实现功能**：提供教案、测验结构校验、量规、学习卡片、可读性及成绩统计辅助。

> **核心亮点**：作者定位教学工具包；可确认增量是把结构化准备和基础计算作为确定工具交给模型调用，减少反复排版和数值汇总。相对纯模型生成，形式校验可重复；并没有自动理解题意、确认答案或评估学生真实能力。

> **风险与缺陷**：validateQuiz只检查结构和答案索引范围，合法索引也可能指向错误答案。readability把Flesch启发式分数映射A1-A2至C2，没有语言测评校准；中文只看句长。index参数对象重复定义items，后定义的grade通用对象覆盖quiz详细schema，削弱工具层字段约束。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、依赖与流程](#detail-section-3)
  - [1.3 成本与效果](#detail-section-4)
  - [1.4 工程亮点](#detail-section-5)
  - [1.5 用途与适用场景](#detail-section-6)
  - [1.6 能力、流程与成本](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 使用建议](#detail-section-9)
  - [1.9 核查说明与分析版本](#detail-section-10)
- [2 未来设计假设（未验证）](#detail-section-11)
- [3 辅助信息](#detail-section-12)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 场景与替代办法

替代是文档模板、表格统计和题库系统；项目把局部准备动作放进DSH，未提供题库或自适应教学引擎。

<a id="detail-section-3"></a>

### 1.2 能力、依赖与流程

lib/index.js注册edu_kit，action分派到education.js；代码按年级模板分配分钟、检查选项唯一和答案索引，生成TSV、量规表、学习计划与统计。

- **模型工具**：edu_kit教案、测验结构、量规、卡片、学习计划与成绩统计

宿主tools/systemPrompt和Schemastery；题目知识、答案、评分与课程约束由用户/模型提供，不访问课程数据库。

输入教学材料→选择模板/结构校验/统计→模型补内容→教师核答案与目标→导出卡片或教案；工具不替教师做专业判断。

<a id="detail-section-4"></a>

### 1.3 成本与效果

首次整理题目、分数和时间参数；模块无网络，宿主模型调用另计。持续人工核知识点、答案、评分依据和教学目标，卡片格式化节省不等同学习效果提高。

有减轻排版与算术步骤的机制价值，无学生学习增益或教师工时的独立验证。

<a id="detail-section-5"></a>

### 1.4 工程亮点

education纯函数与宿主壳分离，TSV去制表符换行利于导入；重复参数键和过度解释标签是接口验收重点。可复用结构操作，需显式标明校验边界。

源码依据：[lib/index.js](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/index.js)、[lib/education.js](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：适合教师准备材料骨架和汇总已有分数，内容正确性与教学适切性仍由教师负责。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **模型工具**：edu_kit教案、测验结构、量规、卡片、学习计划与成绩统计

> **思考**：validateQuiz只检查结构和答案索引范围，合法索引也可能指向错误答案。readability把Flesch启发式分数映射A1-A2至C2，没有语言测评校准；中文只看句长。index参数对象重复定义items，后定义的grade通用对象覆盖quiz详细schema，削弱工具层字段约束。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：作者定位教学工具包；可确认增量是把结构化准备和基础计算作为确定工具交给模型调用，减少反复排版和数值汇总。相对纯模型生成，形式校验可重复；并没有自动理解题意、确认答案或评估学生真实能力。

<a id="detail-section-9"></a>

### 1.8 使用建议

适合生成初稿和整理已有成绩。把quiz valid仅当结构检查，答案与学段由教师核对；可读性标签可参考，不能用于决定学生能力。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[863683348/dsh-plugin-education](https://github.com/863683348/dsh-plugin-education)
- **版本号**：0.3.2（[固定提交 2d880f86](https://github.com/863683348/dsh-plugin-education/tree/2d880f86c9160652e27c1f4702265822e0e726e9)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/education.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：用答案错误但结构合法、重复选项、缺字段、多语短文和不同年级样本核对输出状态；本轮未执行目标测试。

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：让工具输出结构有效、答案已核、教学适配三种独立状态，可减少valid被误读为题目正确。用格式合法但答案错误、文化背景依赖和多语阅读样本，比较教师漏检与改稿时间；不把可读性分数当能力认证。

用答案错误但结构合法、重复选项、缺字段、多语短文和不同年级样本核对输出状态；本轮未执行目标测试。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：5cbde8fa460804b7bd0996de1132469f551a9dbeaa19190cd5e98063fb667798。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 536 | 478 | 34 | — |
| .md | source | 4 | 158 | — | — | 1363 |
| .mjs | test | 1 | 184 | 161 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-plugin-education/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
