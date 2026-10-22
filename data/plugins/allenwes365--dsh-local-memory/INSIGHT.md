# dsh-local-memory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[45045e4](https://github.com/AllenWES365/dsh-local-memory/tree/45045e44ffebecceca4f68ab4351895148bbc696)

<!-- BEGIN META -->
[![npm 30d 155](https://img.shields.io/static/v1?label=npm+30d&message=155&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-local-memory) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-local-memory)
<!-- END META -->

> **实现功能**：聚合Hindsight项目记忆库，发现缺失记忆项目并调用上游引擎播种。

> **核心亮点**：在上游平级banks之上增加“有哪些项目应有记忆”的负空间视图，并以聚合读取保留原库结构。主动跨库查看拓宽可见性，但不提供新的授权隔离或记忆推理算法。

> **风险与缺陷**：库ID用basename，两个不同根的同名repo映到同库，按项目隔离并非路径级保证；只读fan-out也会把多个项目内容交给同一调用者。播种复用入口不证明上游版本/配置生成相同结果。

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

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多项目开发者保留按项目的记忆库，同时主动跨库搜索和补建Git历史。

参照Hindsight单共享库或逐库检索；本项在读取时fan-out，不复制合并库，存储与记忆生成归Hindsight。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Skill**：本地Hindsight记忆运维说明
- **模型工具**：memory_banks/recall_all/projects/seed
- **Host 路由**：/local-memory/api项目与记忆操作
- **后台**：项目扫描和播种进程管理
- **界面**：本地记忆设置与检索

**流程与依赖**

工具/设置页读本地daemon banks，限并发逐库recall并分组；扫描registry工作根与Git元数据发现项目，以coding-agent::basename推库名，调用上游deepen.js后台播种。注册操作说明Skill。

已配置本地Hindsight daemon与coding-agents包、可发现deepen.js、Git项目和宿主tools/skills/webServer；上游可能使用模型，非严格离线。

发现项目/库→比较gitlog标记→选择跨库检索或授权播种→后台进程→按库事实更新时间核完成；失败按库返回不阻其他结果。

**效果与成本**

跨库查询按库规模产生延迟及可能模型费用，播种有Git读取、模型加工和存储成本；人工要核库归属/敏感内容，扫描深度与TTL有边界。

补充缺库发现和跨库视图有实现，无检索准确率、隔离效果或成本对照。

> **思考**：库ID用basename，两个不同根的同名repo映到同库，按项目隔离并非路径级保证；只读fan-out也会把多个项目内容交给同一调用者。播种复用入口不证明上游版本/配置生成相同结果。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：在上游平级banks之上增加“有哪些项目应有记忆”的负空间视图，并以聚合读取保留原库结构。主动跨库查看拓宽可见性，但不提供新的授权隔离或记忆推理算法。

在上游平级banks之上增加“有哪些项目应有记忆”的负空间视图，并以聚合读取保留原库结构。主动跨库查看拓宽可见性，但不提供新的授权隔离或记忆推理算法。

有界并发、单库错误隔离、播种仅限已发现Git项目、完成看实际gitlog而非定时假定值得复用。

源码依据：[lib/index.js](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js)、[skill/SKILL.md](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/skill/SKILL.md)。

<a id="detail-section-5"></a>

### 1.4 主要限制

库ID用basename，两个不同根的同名repo映到同库，按项目隔离并非路径级保证；只读fan-out也会把多个项目内容交给同一调用者。播种复用入口不证明上游版本/配置生成相同结果。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在已隔离配置的Hindsight上试；先检查同名项目库归属和跨库结果授权，别把“本地daemon”当完全离线。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AllenWES365/dsh-local-memory](https://github.com/AllenWES365/dsh-local-memory)
- **版本号**：0.1.0（[固定提交 45045e44](https://github.com/AllenWES365/dsh-local-memory/tree/45045e44ffebecceca4f68ab4351895148bbc696)）
- **版本日期**：2026-09-27（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、skill/SKILL.md、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来隔离daemon核同名项目、发现边界、播种版本/取消和跨库最小授权；本轮未访问daemon或运行deepen。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：以规范项目身份映射库、显式记录碰撞与跨库授权范围，可保留聚合视角而减少混库。用两同名repo、别名/移动、部分daemon失败核归属与越范围内容；发现碰撞不应静默播种。

未来隔离daemon核同名项目、发现边界、播种版本/取消和跨库最小授权；本轮未访问daemon或运行deepen。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：558f763cc0ba6e7b3de942f99eed9af0afda0e136ce7da929c526f45c4b8108e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1967 | 1477 | 357 | — |
| .md | source | 2 | 523 | — | — | 4403 |
| .mjs | test | 7 | 2446 | 2026 | 258 | — |
| .mjs | example | 1 | 29 | 12 | 14 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AllenWES365/dsh-local-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AllenWES365/dsh-local-memory/issues?q=is%3Aissue+created%3A2026-09-21T08%3A00%3A59.954Z..2026-10-21T08%3A00%3A59.954Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AllenWES365/dsh-local-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A00%3A59.954Z..2026-10-21T08%3A00%3A59.954Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
