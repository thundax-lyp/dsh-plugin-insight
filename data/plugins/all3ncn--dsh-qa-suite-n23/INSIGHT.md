# dsh-qa-suite-N23

> 组合后台TypeScript诊断工具与提示驱动的本地多镜头代码审查命令。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[8f47356](https://github.com/All3nCN/dsh-qa-suite-N23/tree/8f473567166944bf9ea94afaad294ced49034691)

<!-- BEGIN META -->
[![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@all3cn/dsh-qa-suite-n23) [![最新发布 2026-09-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-02&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@all3cn/dsh-qa-suite-n23)
<!-- END META -->

**使用建议**：先核多项目下诊断归属；审查命令是提示流程，重要问题须代码复现，置信度不是准确率。

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

- **用途**：开发者编辑TS后取诊断，或主动组织本地代码审查并人工确认问题。

- **建议**：未验证假设：按会话/项目绑定诊断，并把诊断版本与审查范围作为输入证据，可减少错项目与泛化审查。交错两项目编辑/调用，注入真实缺陷对比问题接受率、漏报与总token；未改善则保留独立工具。

先核多项目下诊断归属；审查命令是提示流程，重要问题须代码复现，置信度不是准确率。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

明确吸收dsh-code-check及dsh-command-code-review，去掉PR回评；增量为合包与宿主接线，两个上游机制非本项目原创。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：code_check类型诊断
- **用户命令**：/code-review提示驱动本地审查
- **事件监听**：fs/observed编辑后防抖检查
- **后台**：tsc缓存和子进程生命周期

**流程与依赖**

fs/observed按项目防抖spawn tsc，缓存诊断供code_check读取；/code-review只是followup注入多子代理、评分、落报告的工作流文本，不是代码内调度器。

宿主tools/commands/fs事件与会话header、项目TypeScript/tsconfig；审查效果另依赖subagent、模型与写工具遵循提示。

编辑→按最近tsconfig检查→工具返回诊断；命令→Agent接提示→自行多镜头/去重/评分/写报告→人工核；失败tsc以unavailable报告。

**效果与成本**

后台编译CPU、每项目缓存与60秒超时；审查多模型调用、复核和报告写入额外费用与人工，未测合格问题单位成本。

可减少手动tsc与提示重复输入，无审查质量或效率实测。

- **思考**：code_check优先runtime.roots()[0]最近全局项目而非当前会话，已有缓存时不再用调用方cwd，可能把A项目诊断回给B。多镜头和80阈值只在提示中，由模型执行与自评分，不是可校准质量保障。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：组合确定性诊断与模型审查两个入口，提供局部开发便利；未见二者以诊断证据约束审查放行的共同机制，不能把合包视新质量闸门。

组合确定性诊断与模型审查两个入口，提供局部开发便利；未见二者以诊断证据约束审查放行的共同机制，不能把合包视新质量闸门。

直接Node运行tsc、abort/timeout、dirty重跑和dispose清理具体；prompt工作流与编译器实际执行应分别复用。

源码依据：[index.js](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/index.js)、[lib/core.js](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/core.js)、[lib/commands.js](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/commands.js)。

<a id="detail-section-5"></a>

### 主要限制

code_check优先runtime.roots()[0]最近全局项目而非当前会话，已有缓存时不再用调用方cwd，可能把A项目诊断回给B。多镜头和80阈值只在提示中，由模型执行与自评分，不是可校准质量保障。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[All3nCN/dsh-qa-suite-N23](https://github.com/All3nCN/dsh-qa-suite-N23)
- **版本号**：0.1.0（[固定提交 8f473567](https://github.com/All3nCN/dsh-qa-suite-N23/tree/8f473567166944bf9ea94afaad294ced49034691)）
- **版本日期**：2026-09-02（固定提交日期，北京时间；不是包发布日期）

- 已检查：index.js、lib/core.js、lib/commands.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来隔离双项目核缓存选择、正在运行返回旧诊断、取消/重跑；审查用标注缺陷和人工复现核，不运行本轮测试。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：按会话/项目绑定诊断，并把诊断版本与审查范围作为输入证据，可减少错项目与泛化审查。交错两项目编辑/调用，注入真实缺陷对比问题接受率、漏报与总token；未改善则保留独立工具。

未来隔离双项目核缓存选择、正在运行返回旧诊断、取消/重跑；审查用标注缺陷和人工复现核，不运行本轮测试。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：ef874150864b2a28dcea42bdecdbb1e63e7eee474c87745937c27082bc682a4c。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 290 | — | — | 1908 |
| .js | source | 3 | 849 | 648 | 100 | — |
| .mjs | test | 1 | 199 | 160 | 21 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/All3nCN/dsh-qa-suite-N23/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/All3nCN/dsh-qa-suite-N23/issues?q=is%3Aissue+created%3A2026-09-21T08%3A00%3A53.394Z..2026-10-21T08%3A00%3A53.394Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/All3nCN/dsh-qa-suite-N23/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A00%3A53.394Z..2026-10-21T08%3A00%3A53.394Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
