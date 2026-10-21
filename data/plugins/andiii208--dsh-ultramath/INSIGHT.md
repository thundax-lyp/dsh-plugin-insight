# dsh-ultramath

> 向DSH同步数学建模竞赛预设、模型库和论文模板，组织推导、编码、验算及评审流程。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[37d95b1](https://github.com/Andiii208/dsh-ultramath/tree/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1)

<!-- BEGIN META -->
[![GitHub ★ 35](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/dsh-ultramath) [![npm 30d 1,512](https://img.shields.io/static/v1?label=npm+30d&message=1%2C512&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ultramath) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ultramath)
<!-- END META -->

**使用建议**：适合学习或可控建模试验，先用已知解小题验证数据→代码→论文链。人工检查赛事AI使用规则与数值，保留同步目录备份。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：竞赛/学习团队需要从题目到可复算论文的产物链，合格交付须数据、代码、数值与论文一致且遵守赛事规则。

- **建议**：由目录产物与数字冻结推导，可把各阶段收据绑定脚本/数据hash，独立验算只读输入与结果，验收通过才提升论文引用版本。未验证；改CSV或代码后应使引用失效，并用异方法核算检验错误传播。

适合学习或可控建模试验，先用已知解小题验证数据→代码→论文链。人工检查赛事AI使用规则与数值，保留同步目录备份。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

人工团队和脚本模板可完成全链，插件将责任清单与资料集中，未消除验算负担。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Skill**：数学建模流程与模型库。
- **Agent/Preset**：UltraMath主控和阶段角色预设。
- **后台**：启动同步预设、模板与技能并公告。

**流程与依赖**

DSH预设/skill发现、subagent/workflow等能力、Python库与LaTeX；效果依赖题目数据和专家判断。

启动同步→选主控/阶段预设→推导编码实际求解→独立验算→论文编译→盲评回退；人工模式由触发词改变提示流程。

**效果与成本**

首次工具链与目录熟悉，持续多Agent/三席模型费、实际计算、编译和人工复核；未测获奖率或总成本。

可能减少阶段遗漏，获奖级成果和全自动质量没有本轮证据。

- **思考**：门禁是否强制保证正确和诚信？多数B1-B9、独立盲评和数字冻结是persona/技能纪律，lib主要同步/公告，未见中央产物状态机硬执行；同模型评委不等于独立专家。启动同步还可能覆盖目标自定义内容并清退旧预设。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：增量是产物目录、阶段责任、独立验算和数字冻结组织成可复用工作流；模型库/LaTeX与宿主delegation由既有工具提供，不据“首个/获奖级”宣称创新。

增量是产物目录、阶段责任、独立验算和数字冻结组织成可复用工作流；模型库/LaTeX与宿主delegation由既有工具提供，不据“首个/获奖级”宣称创新。

结构校验、字节级同步和读写根分离可借鉴；同步不是挂载注册，持久副本和回滚需明确。 源码依据：[lib/index.js](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/lib/index.js)、[SKILL.md](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/SKILL.md)、[presets/ultramath/agent.cordis.yml](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/presets/ultramath/agent.cordis.yml)、[scripts/check_figures.py](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/scripts/check_figures.py)。

<a id="detail-section-5"></a>

### 主要限制

门禁是否强制保证正确和诚信？多数B1-B9、独立盲评和数字冻结是persona/技能纪律，lib主要同步/公告，未见中央产物状态机硬执行；同模型评委不等于独立专家。启动同步还可能覆盖目标自定义内容并清退旧预设。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[Andiii208/dsh-ultramath](https://github.com/Andiii208/dsh-ultramath)
- **版本号**：0.6.3（[固定提交 37d95b18](https://github.com/Andiii208/dsh-ultramath/tree/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、SKILL.md、presets/ultramath/agent.cordis.yml、scripts/check_figures.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、SKILL.md、presets/ultramath/agent.cordis.yml、scripts/check_figures.py；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：小型有解析解题、故意错数和失效图表，检查每阶段是否真运行；重复启动/自定义文件/卸载测副本保留和覆盖，区分提示门与程序拒绝。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由目录产物与数字冻结推导，可把各阶段收据绑定脚本/数据hash，独立验算只读输入与结果，验收通过才提升论文引用版本。未验证；改CSV或代码后应使引用失效，并用异方法核算检验错误传播。

小型有解析解题、故意错数和失效图表，检查每阶段是否真运行；重复启动/自定义文件/卸载测副本保留和覆盖，区分提示门与程序拒绝。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：a8493255f994fe7c9828dfe13c19010c76e22874c29b7adf1a4dffe20b9f2c66。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 39 | 6354 | — | — | 58250 |
| .js | source | 1 | 567 | 440 | 88 | — |
| .mjs | source | 4 | 755 | 637 | 50 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Andiii208/dsh-ultramath/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
