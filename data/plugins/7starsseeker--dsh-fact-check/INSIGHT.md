# dsh-fact-check

> 为 DSH 提供多源网页事实核查 Skill，含来源路由和可选 Jev 判据工具。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[dd28c59](https://github.com/7starsseeker/dsh-fact-check/tree/dd28c59fb7552a43d40f03632b0247695fbda65b)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/7starsseeker/dsh-fact-check) · [![npm 30d 1495](https://img.shields.io/static/v1?label=npm+30d&message=1%2C495&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fact-check) · [![首次发布 2026-09-22](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-09-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fact-check)
<!-- END META -->

**使用建议**：经常做资料核查的人可先用低风险题目检查来源和正文；保留未核实，遇到转载、封闭生态或无反证时别自动升置信，重要结论由人复核。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
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

研究者把传闻或数字拆成可核实事实点，抓原文交叉与反向搜索，交付结论、缺口及可追溯来源。

参照记者多源核查、通用搜索Agent与模型记忆问答；未把作者语料结果视为对其他系统优势。

<a id="detail-section-3"></a>

### 能力、流程与依赖

lib/index.js在skills registry注册单一fact-check，现读SKILL并监听失效；正文规定搜索/正文/独立来源/反证，route做确定性来源建议，jev-verdict以冻结判据调用外部结构化模型并只允许降档。

- **Skill**：fact-check单一核查Skill及来源/输出流程。
- **后台**：provider现读与文件编辑失效监听。

可用公开搜索与正文链、DSH skills注册；可选Jev密钥/端点与Node脚本，子代理/归档只是推荐能力。

拆事实→国内外/垂直检索→抓正文→核独立与要素→反证→逐条状态与编号来源；可选路由/Jev辅助，失败明确降级。

零运行依赖的DSH Skill插件，也可目录使用；provider bundled rank600让本地同名覆盖，文件watch依宿主control，旧宿主需重读。

<a id="detail-section-4"></a>

### 效果、成本与限制

提高报告可追溯性、避免只凭模型记忆；未证明跨主题端到端事实准确率，也不替代专业判断。

首次具备搜索与正文抓取、选择可用渠道；每事实点多源/反向搜索增加时间与API费用，Jev可选收费，作者价目不作现价保证。人工独立性和原文复核仍必要。

两三来源和“没搜到反证”是否足以高置信？转载可共用单源，检索无反证也可能是覆盖不足；SKILL的要求不是机械验证。作者MEASUREMENTS的小型自建集只测局部判据，sufficient表现不足且工具明确不据此停止搜索，不能把support命中率外推整份事实报告可靠性。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对直接问模型凭记忆回答，贡献是把原文、来源独立性、反证和未核实状态写成可复用流程，并以确定性路由和可选判据辅助；DSH增量是Skill provider、同名优先级与编辑失效。搜索服务和Jev判断为外部能力，实际报告质量依执行者，非插件自动保证。

Skill描述/正文同源、读取失败拒绝而非冒充删除、编辑watch失效和判据冻结便于维护；“支持只降档”限制模型裁决作用值得借鉴。

源码依据：[lib/index.js](https://github.com/7starsseeker/dsh-fact-check/blob/dd28c59fb7552a43d40f03632b0247695fbda65b/lib/index.js)、[SKILL.md](https://github.com/7starsseeker/dsh-fact-check/blob/dd28c59fb7552a43d40f03632b0247695fbda65b/SKILL.md)、[tools/route.mjs](https://github.com/7starsseeker/dsh-fact-check/blob/dd28c59fb7552a43d40f03632b0247695fbda65b/tools/route.mjs)、[tools/jev-verdict.mjs](https://github.com/7starsseeker/dsh-fact-check/blob/dd28c59fb7552a43d40f03632b0247695fbda65b/tools/jev-verdict.mjs)、[MEASUREMENTS.md](https://github.com/7starsseeker/dsh-fact-check/blob/dd28c59fb7552a43d40f03632b0247695fbda65b/MEASUREMENTS.md)、[package.json](https://github.com/7starsseeker/dsh-fact-check/blob/dd28c59fb7552a43d40f03632b0247695fbda65b/package.json)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：研究者把传闻或数字拆成可核实事实点，抓原文交叉与反向搜索，交付结论、缺口及可追溯来源。

- **建议**：待验证假设：把每条事实的原始发布链与检索覆盖保存为证据图，并让结论门槛依事实类型和时效变化，可减少重复转载计独立及来源数够但要素缺失。依据是当前来源独立规范与局部判据不足，未实现图校验。用同源多转载、单一权威原件和新事件无反证三组盲审，对照独立性误判、未核实标注与时间成本；必须由独立标注者核对，模型自评不作真值。

经常做资料核查的人可先用低风险题目检查来源和正文；保留未核实，遇到转载、封闭生态或无反证时别自动升置信，重要结论由人复核。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认Skill注册与核查方法、工具及作者小样本记录；未执行真实核查、判据API或宿主验证，不能把作者量表当独立准确率。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **Skill**：fact-check单一核查Skill及来源/输出流程。
- **后台**：provider现读与文件编辑失效监听。

- **思考**：两三来源和“没搜到反证”是否足以高置信？转载可共用单源，检索无反证也可能是覆盖不足；SKILL的要求不是机械验证。作者MEASUREMENTS的小型自建集只测局部判据，sufficient表现不足且工具明确不据此停止搜索，不能把support命中率外推整份事实报告可靠性。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对直接问模型凭记忆回答，贡献是把原文、来源独立性、反证和未核实状态写成可复用流程，并以确定性路由和可选判据辅助；DSH增量是Skill provider、同名优先级与编辑失效。搜索服务和Jev判断为外部能力，实际报告质量依执行者，非插件自动保证。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：1.4.0；版本日期：2026-10-17（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[dd28c59f](https://github.com/7starsseeker/dsh-fact-check/tree/dd28c59fb7552a43d40f03632b0247695fbda65b)；本次截止 2026-10-21T03:36:14Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读Skill/provider、路由与判据源码、作者MEASUREMENTS；未复跑作者语料或核查真实事件，没有独立验证。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：9095f20e59f7303262238bd9aa7e1970afb323ee4661124664e5bda3a6962c75。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2127 | — | — | 38197 |
| .js | source | 1 | 211 | 112 | 85 | — |
| .mjs | source | 5 | 1524 | 1182 | 231 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：把每条事实的原始发布链与检索覆盖保存为证据图，并让结论门槛依事实类型和时效变化，可减少重复转载计独立及来源数够但要素缺失。依据是当前来源独立规范与局部判据不足，未实现图校验。用同源多转载、单一权威原件和新事件无反证三组盲审，对照独立性误判、未核实标注与时间成本；必须由独立标注者核对，模型自评不作真值。

独立标注多主题盲测，分开评来源独立、引文支持与报告结论，记录漏搜及成本；本轮未调用外部API。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/7starsseeker/dsh-fact-check/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
