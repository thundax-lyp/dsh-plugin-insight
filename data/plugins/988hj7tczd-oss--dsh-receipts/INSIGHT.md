# dsh-receipts

> 从本地DSH会话日志汇总使用记录，结合Git信息生成Markdown和离线HTML报告。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[ebc1ae1](https://github.com/988hj7tczd-oss/dsh-receipts/tree/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-receipts) · [![npm 30d 77](https://img.shields.io/static/v1?label=npm+30d&message=77&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-receipts)
<!-- END META -->

**使用建议**：当前先在复制日志和Git关闭模式审阅。修复越界目标及时间窗传递后再启用交叉核对；分享HTML前检查路径与会话内容，活动时长不当收益。

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

- **用途**：适合个人回顾会话和工具活动；会话痕迹不能直接作为生产率、节省工时或业务影响证明。

- **建议**：未验证假设：把日志时间窗和允许Git目标明确传给纯交叉核对接口，并区分活动跨度与可归因产出，可减少报告误导。用窗外提交、越界cwd、长空闲及并发会话夹具比较是否误读和重复计时；不推断节省工时。

当前先在复制日志和Git关闭模式审阅。修复越界目标及时间窗传递后再启用交叉核对；分享HTML前检查路径与会话内容，活动时长不当收益。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

替代是手工日志和git log或专门时间追踪器；本项目聚合使用痕迹，不测真实工时和产出因果。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：receipts日志汇总与MD/HTML报告生成

**流程与依赖**

receipts工具经ctx.fs适配mineSessions解析JSONL/zstd、周期与项目过滤，再由report渲染MD/HTML；Git交叉核对调用mine-transcripts.mjs的Node execFile函数。

宿主tools/fs/systemPrompt与日志格式，Node压缩能力或zstd回退、可选Git；README开发布局依赖dsh-src。输出到允许根内已存在目录，路径脱敏可选。

解析周期/根→ctx.fs读取日志→汇总与截断→可选Git交叉→渲染写MD/HTML→用户审阅；损坏日志明确skip，未经核对不把总数当完整活动。

**效果与成本**

首次确认日志格式、允许根、压缩支持和输出隐私；运行消耗本地I/O和Git扫描，现金无外部API费依据。人工需审日志内容、误分类和分享前脱敏，历史很大时耗时需测。

可降低个人日志整理成本，但存在Git边界和统计口径缺口，无生产率或业务价值独立验证。

- **思考**：根约束接线有缺口：工具把越界project标unavailable却保留cwd，随后attachGitCrossCheck不检查状态，对所有非空cwd执行git -C log，可能仍读越界Git信息。工具调用也未传since/until，函数默认since=0/until=now，Git计数可能覆盖全历史。活动时长用首尾事件跨度，不等于连续劳动；redactPaths默认关且只去路径，不等于会话文本脱敏。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：实际增量是将本地会话、工具调用和Git痕迹组织成可离线审阅的个人报告，支持压缩日志与失败跳过材料。相对手工翻日志更便于自省；这不是工时计费系统，Git提交与模型工作不能建立因果归属。

实际增量是将本地会话、工具调用和Git痕迹组织成可离线审阅的个人报告，支持压缩日志与失败跳过材料。相对手工翻日志更便于自省；这不是工时计费系统，Git提交与模型工作不能建立因果归属。

模型侧日志IO经ctx.fs、根检查与skip清单比全权子进程更可审；Git辅助函数仍绕过该适配且忽略状态，边界必须端到端核查。渲染含HTML转义，离线文件仍可能含敏感内容。

源码依据：[src/index.ts](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/src/index.ts)、[src/tools/receipts.ts](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/src/tools/receipts.ts)、[scripts/mine-transcripts.mjs](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/mine-transcripts.mjs)、[scripts/report.mjs](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/report.mjs)。

<a id="detail-section-5"></a>

### 主要限制

根约束接线有缺口：工具把越界project标unavailable却保留cwd，随后attachGitCrossCheck不检查状态，对所有非空cwd执行git -C log，可能仍读越界Git信息。工具调用也未传since/until，函数默认since=0/until=now，Git计数可能覆盖全历史。活动时长用首尾事件跨度，不等于连续劳动；redactPaths默认关且只去路径，不等于会话文本脱敏。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-receipts](https://github.com/988hj7tczd-oss/dsh-receipts)
- **版本号**：0.1.1（[固定提交 ebc1ae1c](https://github.com/988hj7tczd-oss/dsh-receipts/tree/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/tools/receipts.ts、scripts/mine-transcripts.mjs、scripts/report.mjs、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：用越界cwd、窗外提交、压缩损坏、长空闲与脱敏样本核输出；本轮未读用户真实日志、未跑目标脚本。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：把日志时间窗和允许Git目标明确传给纯交叉核对接口，并区分活动跨度与可归因产出，可减少报告误导。用窗外提交、越界cwd、长空闲及并发会话夹具比较是否误读和重复计时；不推断节省工时。

用越界cwd、窗外提交、压缩损坏、长空闲与脱敏样本核输出；本轮未读用户真实日志、未跑目标脚本。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：e3cc4fb33f8632a3b96a89bacc1d8cae85da6a23605a08020ca46b25800c8114。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 267 | — | — | 3257 |
| .mjs | source | 2 | 1297 | 979 | 210 | — |
| .ts | source | 2 | 292 | 212 | 61 | — |
| .ts | test | 1 | 580 | 469 | 51 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-receipts/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
