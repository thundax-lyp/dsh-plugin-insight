# dsh-need-finder

> 按中英文需求匹配精选插件，并生成预设环境配方的有序安装计划。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[b0f559c](https://github.com/863683348/dsh-need-finder/tree/b0f559c2b69b34a640e0d477d8ff0210f3840414)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-need-finder) [![npm 30d 850](https://img.shields.io/static/v1?label=npm+30d&message=850&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-need-finder) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-need-finder)
<!-- END META -->

**使用建议**：适合找候选和列清单。先读命中理由与配方互斥说明，核对当前版本、依赖和宿主；apply输出命令不表示环境已经安装。

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

替代为目录分类浏览或模型猜测插件；本项目把候选匹配变确定规则，覆盖仍限精选快照。

<a id="detail-section-3"></a>

### 能力、依赖与流程

lib/match.js用英文词、中文二元组和名称/标签/描述权重本地排序，可按类别多样化；recipe.js读取JSON配方，按order生成命令，index注册plugin_guide与recipe。

- **模型工具**：plugin_guide需求匹配、recipe配方查询与计划

宿主tools/systemPrompt和Schemastery；包内guide-data.json/recipes.json为静态输入，不在运行时自行核实插件。

用户描述需求→词面评分并过滤→展示候选理由→搜索或选择配方→输出有序命令→用户另行验收安装。

<a id="detail-section-4"></a>

### 成本与效果

首次无需远端服务，需宿主peer依赖；持续成本是精选描述和配方维护、候选验证与安装命令复核。现金主要是宿主模型token，离线搜索不代表人工选型免费。

减少记名称和抄命令步骤，但没有需求匹配标注集或真实选型成功率。

<a id="detail-section-5"></a>

### 工程亮点

match与recipe纯逻辑拆分，命中details可解释、多样化有明确每类上限；可借鉴透明排序，需补上语言兜底与依赖计划端到端验证。

源码依据：[lib/index.js](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/index.js)、[lib/match.js](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/match.js)、[lib/recipe.js](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/recipe.js)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合不会记插件名、想先找少量候选的用户；安装计划仍需人工逐项确认。

- **建议**：待验证假设：在匹配结果中加入经过验证的场景条件与未满足条件，比单纯提高词权重更能缩短选型。对同义但无词面重合、中文分类和互斥配方需求比较人工合适率与误装率；没有宿主证据的条件保持未知。

适合找候选和列清单。先读命中理由与配方互斥说明，核对当前版本、依赖和宿主；apply输出命令不表示环境已经安装。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：plugin_guide需求匹配、recipe配方查询与计划

- **思考**：84项精选属于有意子集，词面相关不能证明实际能力和兼容。中文category兜底的实际代码仅拿en词集合匹配，中文词典项不会凭空增加中文分类召回。recipe apply只返回计划，dependsOn校验存在性但installPlan按order排序，不做真实依赖求解或执行。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者称需求语义导购；可确认增量是把可解释词面匹配和配方清单接进模型工具，避免模型自行猜名称。相对浏览目录，返回命中理由与命令更直接；这里语义是词典/子串规则，没有向量或模型语义推理。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[863683348/dsh-need-finder](https://github.com/863683348/dsh-need-finder)
- **版本号**：0.3.2（[固定提交 b0f559c2](https://github.com/863683348/dsh-need-finder/tree/b0f559c2b69b34a640e0d477d8ff0210f3840414)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/match.js、lib/recipe.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：用中文分类词、同义需求、互斥配方、dependsOn循环与版本不兼容样本核对召回和计划；本轮未运行目标代码。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：在匹配结果中加入经过验证的场景条件与未满足条件，比单纯提高词权重更能缩短选型。对同义但无词面重合、中文分类和互斥配方需求比较人工合适率与误装率；没有宿主证据的条件保持未知。

用中文分类词、同义需求、互斥配方、dependsOn循环与版本不兼容样本核对召回和计划；本轮未运行目标代码。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：891d02789a855743f04b1b7f7bb71ac398e79d378447e2624b4a7f2b6babdb86。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 250 | — | — | 2317 |
| .js | source | 3 | 566 | 463 | 78 | — |
| .mjs | source | 1 | 20 | 15 | 4 | — |
| .mjs | test | 2 | 171 | 144 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-need-finder/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
