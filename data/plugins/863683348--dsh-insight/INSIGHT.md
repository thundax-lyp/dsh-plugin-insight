# dsh-insight

> 整合插件需求匹配、环境配方、健康评分、静态扫描与安装结论工具。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[6fcb8fc](https://github.com/863683348/dsh-insight/tree/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-insight) [![npm 30d 828](https://img.shields.io/static/v1?label=npm+30d&message=828&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-insight) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-insight)
<!-- END META -->

**使用建议**：当前只适合作为离线目录与扫描线索。先修复并验证total/points接口及扫描计数，再考虑使用统一结论；安装前仍需核固定版本与实际宿主。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、依赖与流程](#detail-section-3)
  - [成本与效果](#detail-section-4)
  - [工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

替代是分别查询精选目录、运行扫描器和人工判断；该项目把这些输出合并但不带来运行验收证据。

<a id="detail-section-3"></a>

### 能力、依赖与流程

lib/index.js注册plugin_guide/recipe/plugin_rank/plugin_audit/plugin_verdict；本地精选与catalog提供输入，scoring.js返回total，verdict.js按score.points判断。静态扫描只读指定目录根清单及lib/scripts/src一层有界源码。

- **模型工具**：plugin_guide、recipe、plugin_rank、plugin_audit、plugin_verdict

宿主tools/systemPrompt与Schemastery；依赖包内guide-data/catalog及用户指定本地目录，插件主逻辑无网络和LLM调用。

需求找候选或配方→读取健康分→可选扫描本地目录→verdict合成；recipe apply仅输出安装计划，不执行安装命令。

<a id="detail-section-4"></a>

### 成本与效果

首次需保持精选数据和评分目录更新；本地计算无新增远端请求，仍有宿主模型token与人工核源码成本。字段错接会造成重复排查，不能因离线就称低采用成本。

统一入口可能节约查询步骤，但核心决策接线缺陷限制当前价值，未有独立采用效果。

<a id="detail-section-5"></a>

### 工程亮点

匹配、配方、扫描、评分、裁决分层便于审阅；三个模块的字段契约不一致展示了纯模块测试无法替代端到端接线验证。可借鉴组合入口，不能复用install结论作为事实。

源码依据：[lib/index.js](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/lib/index.js)、[lib/scoring.js](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/lib/scoring.js)、[lib/verdict.js](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/lib/verdict.js)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合先整理候选插件再人工审阅的用户；不应把工具生成的install文字当宿主验收。

- **建议**：待验证假设：用统一带Schema的证据对象表达扫描覆盖、健康分及需求适配，再把结论限定为可追溯规则，可避免组合工具因字段漂移失真。以高分/低分、已扫零发现、未扫及高危四组端到端用例检查分支；只有接线通过后再研究阈值是否预测真实可用性。

当前只适合作为离线目录与扫描线索。先修复并验证total/points接口及扫描计数，再考虑使用统一结论；安装前仍需核固定版本与实际宿主。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：plugin_guide、recipe、plugin_rank、plugin_audit、plugin_verdict

- **思考**：scoreRecord返回total而verdictFor读取points，index原样传入，因此非高危且没有低匹配分支的记录也不能命中>=70的install或>=40的caution，输出score为undefined、理由health undefined。另plugin_audit用findings.length作scanned计数，不能据此知道读了几文件；零发现与未扫描也被混为not-scanned。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者试图以单一入口回答值得装吗；实际增量是将需求匹配、配方、健康信号和静态扫描汇到一个决策接口，减少多工具手工拼接。其核心是集成而非已验证的质量预测，当前评分到结论的字段接线存在明显缺口。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[863683348/dsh-insight](https://github.com/863683348/dsh-insight)
- **版本号**：0.1.0（[固定提交 6fcb8fc9](https://github.com/863683348/dsh-insight/tree/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/scoring.js、lib/verdict.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：固定版本端到端检查高健康分无高危、低分、低匹配、零发现扫描与未扫；本轮源码推导未运行目标代码。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：用统一带Schema的证据对象表达扫描覆盖、健康分及需求适配，再把结论限定为可追溯规则，可避免组合工具因字段漂移失真。以高分/低分、已扫零发现、未扫及高危四组端到端用例检查分支；只有接线通过后再研究阈值是否预测真实可用性。

固定版本端到端检查高健康分无高危、低分、低匹配、零发现扫描与未扫；本轮源码推导未运行目标代码。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：2013e69d2a9ffd4beafe7695d3dca7fcccf6a7e76d463e85a4efc1f9d92a42cf。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 103 | — | — | 875 |
| .js | source | 9 | 1549 | 1233 | 236 | — |
| .mjs | source | 1 | 32 | 24 | 4 | — |
| .mjs | test | 5 | 367 | 309 | 12 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-insight/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
