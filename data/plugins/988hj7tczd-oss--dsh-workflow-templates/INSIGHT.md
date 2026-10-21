# dsh-workflow-templates

> 为 DSH 提供 Workflow 模板检索、静态校验和官方工具调用起点。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[26755f7](https://github.com/988hj7tczd-oss/dsh-workflow-templates/tree/26755f75a043418eeb3f59fa0a57a60542740abc)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-workflow-templates) · [![npm 30d 404](https://img.shields.io/static/v1?label=npm+30d&message=404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-workflow-templates)
<!-- END META -->

**使用建议**：只有明确要workflow时再选模板；先看完整脚本和参数，检查官方工具可见与阶段输出，再在隔离任务试。

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

- **用途**：明确需要多Agent编排的人选择高频模板并填参数，交付meta/script/args起点；不是自动执行工作流。

- **建议**：待验证假设：模板绑定宿主契约版本并用官方parser做兼容检查，再附每阶段输出断言，可减少静态通过但运行失败。由自写轻量校验与不加载官方schema推导，未实现。对计算return、未序列化对象、工具改名和失败阶段对照误接受/误拒绝及维护成本；新版本未知则标未验证。

只有明确要workflow时再选模板；先看完整脚本和参数，检查官方工具可见与阶段输出，再在隔离任务试。

核查状态：源码支持模板与起点装配；未执行官方workflow，静态有效不等于运行成功或合格交付。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

参照手写workflow与通用模板库；无端到端收益对照。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：wf_template_list/search/run/validate。

**流程与依赖**

catalog加载模板索引和搜索，validate轻量检查META/模块语句/return结构，wf_template_run组装payload并探测当前Agent的workflow工具可见性，只返回素材。

DSH tools与官方workflow引擎、各模板用到的Agent钩子/工具，开发构建依赖。

list/search→选模板→validate→run返回起点→用户/模型明确调用官方workflow→核产物；本插件不执行。

TS构建与相邻dsh-src link前置；生产裸包名入口，源码相对入口不能等同成品安装。

**效果与成本**

首次匹配工具/引擎版本，持续审模板输入和阶段产物；执行后模型/子代理费用另计，节省工时未测。

减少编排样板，不能替代任务分解、审批、运行错误处理或业务验收。

- **思考**：模板校验通过是否保证官方合法和安全？轻量语法/return检查不执行真实schema或运行时序列化，未知顶层调用仅警告；run名称不代表执行。模板也会依赖工具和任务输入，不能把12个样例概括为通用流程保证。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对每次从零写编排脚本，增量是可检索的自写模板、参数提示与格式检查，并坚持由官方工具执行；引擎/子代理能力归DSH，参考结构不算插件原创引擎。

相对每次从零写编排脚本，增量是可检索的自写模板、参数提示与格式检查，并坚持由官方工具执行；引擎/子代理能力归DSH，参考结构不算插件原创引擎。

catalog/render/validator分离、按调用Agent探测工具、扩展字段缺失只警告可借鉴；需要真实契约兼容证据。

固定源码依据：[src/index.ts](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/index.ts)、[src/lib/catalog.ts](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/lib/catalog.ts)、[src/lib/validate.ts](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/lib/validate.ts)、[src/lib/render.ts](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/lib/render.ts)、[src/tools/wf-template-run.ts](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/src/tools/wf-template-run.ts)、[templates/code-review/pr-deep-review.js](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/templates/code-review/pr-deep-review.js)、[package.json](https://github.com/988hj7tczd-oss/dsh-workflow-templates/blob/26755f75a043418eeb3f59fa0a57a60542740abc/package.json)。

<a id="detail-section-5"></a>

### 主要限制

模板校验通过是否保证官方合法和安全？轻量语法/return检查不执行真实schema或运行时序列化，未知顶层调用仅警告；run名称不代表执行。模板也会依赖工具和任务输入，不能把12个样例概括为通用流程保证。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.1；版本日期：2026-08-24（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[26755f75](https://github.com/988hj7tczd-oss/dsh-workflow-templates/tree/26755f75a043418eeb3f59fa0a57a60542740abc)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读index/catalog/validate/render/run及一个PR模板；未跑模板或官方引擎。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：模板绑定宿主契约版本并用官方parser做兼容检查，再附每阶段输出断言，可减少静态通过但运行失败。由自写轻量校验与不加载官方schema推导，未实现。对计算return、未序列化对象、工具改名和失败阶段对照误接受/误拒绝及维护成本；新版本未知则标未验证。

用官方parser和隔离引擎检查合法/非法return、工具改名、参数缺失与阶段失败；本轮不执行。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 375 | — | — | 4101 |
| .ts | source | 9 | 985 | 774 | 143 | — |
| .js | source | 12 | 435 | 314 | 72 | — |
| .ts | test | 1 | 141 | 108 | 25 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-workflow-templates/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
