# dsh-ark9canvas

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[adc7072](https://github.com/Aik358/dsh-ark9canvas/tree/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-ark9canvas) [![npm 30d 877](https://img.shields.io/static/v1?label=npm+30d&message=877&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas)
<!-- END META -->

> **实现功能**：为DSH提供多渠道图片工作台、批量任务和Agent生图审批队列，生成结果保存为本地路径。

> **核心亮点**：把Agent审批、人工工作台、批量结果和文件路径交付串联；图片模型与参考工作台尺寸公式归上游/参照设计。增量是流程接线和任务账目，非生成算法。

> **风险与缺陷**：“没有人点头就不计费”覆盖哪条路径？仅Agent工具走队列，面板generate路由loopback检查后直接执行，未见在handler另校验用户决策；loopback不等于用户身份。超时也可能后台继续生成；参考路径读取可能将本机文件发渠道。

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

> **用途**：按调用计费的图片任务需要人在生成前核对提示与参数，并跟踪部分成功和超时后台任务。

独立图片网页人工可控，Agent直接API容易缺预算门；插件聚合但双入口应统一授权。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：图片生成申请与已有图片列表。
- **Host 路由**：生成任务、审批、配置及文件读取接口。
- **界面**：生成/审批/提示词/记录工作台。
- **后台**：批量图片任务和结果保存。

**流程与依赖**

DSH tools/systemPrompt/webServer、兼容图片API、本地文件系统与可选better-sidebar；prompt源代理另引入外部输入。

配置渠道→Agent请求排审批或用户面板直生成→渠道执行多子任务→保存图片/日志→回传路径；超时先查现有批次再重试。

**效果与成本**

首次渠道/模型和保存目录配置，每张图片现金费用、失败重试和本地磁盘；部分成功与超时需对账，未测质量或省费。

让人在付费前检查提示、批量后查产物，不能由界面默认审批承诺所有调用零意外计费。

> **思考**：“没有人点头就不计费”覆盖哪条路径？仅Agent工具走队列，面板generate路由loopback检查后直接执行，未见在handler另校验用户决策；loopback不等于用户身份。超时也可能后台继续生成；参考路径读取可能将本机文件发渠道。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把Agent审批、人工工作台、批量结果和文件路径交付串联；图片模型与参考工作台尺寸公式归上游/参照设计。增量是流程接线和任务账目，非生成算法。

把Agent审批、人工工作台、批量结果和文件路径交付串联；图片模型与参考工作台尺寸公式归上游/参照设计。增量是流程接线和任务账目，非生成算法。

批量独立子任务、路径结果和审批状态有用；内存审批、跨会话notice及明文渠道配置需生命周期/归属验证。 源码依据：[lib/index.js](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js)、[lib/client.js](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/client.js)、[package.json](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“没有人点头就不计费”覆盖哪条路径？仅Agent工具走队列，面板generate路由loopback检查后直接执行，未见在handler另校验用户决策；loopback不等于用户身份。超时也可能后台继续生成；参考路径读取可能将本机文件发渠道。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用无付费的模拟接口检查审批和路径范围，再以明确预算少量试用。重要场景先收紧参考文件读取及Host端授权边界。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[Aik358/dsh-ark9canvas](https://github.com/Aik358/dsh-ark9canvas)
- **版本号**：0.4.1（[固定提交 adc7072a](https://github.com/Aik358/dsh-ark9canvas/tree/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1)）
- **版本日期**：2026-09-03（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、lib/client.js、package.json；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：模拟渠道记录请求数，验证拒绝/超时审批无上游请求、已批准生成超时不重复提交、跨会话归属、任意本地路径引用和直路由。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由审批与独立generate入口推导，可用Host端一次性授权绑定提示摘要、渠道、参考文件白名单及最大预算，每条付费路径均验证。未验证；改变参数/换渠道/重放授权/绕过UI直接调用都应拒绝，计费任务和授权一一对应。

模拟渠道记录请求数，验证拒绝/超时审批无上游请求、已批准生成超时不重复提交、跨会话归属、任意本地路径引用和直路由。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：c69a5c65e8f27a654fe03637e2624843e6ea51ef28d453d3cc23edd52f98bb7f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 487 | — | — | 5077 |
| .mjs | source | 2 | 178 | 145 | 24 | — |
| .js | source | 2 | 2096 | 1961 | 65 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Aik358/dsh-ark9canvas/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
