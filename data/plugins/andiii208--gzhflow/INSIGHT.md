# gzhflow

> 为公众号内容提供素材、写作、风格质检、配图、排版和推草稿箱的技能及工具流程。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[3702335](https://github.com/Andiii208/gzhflow/tree/3702335770e30ebccc3790556d53aa14c30046f2)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)
<!-- END META -->

**使用建议**：适合已有公众号编辑流程者先只做本地质检/排版；事实审阅和正式发布仍由人确认，API权限与账户条件另核。

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

- **用途**：内容作者反复产稿并复用风格/经验，合格产物需事实准确、版权清楚、排版可读并经人发布。

- **建议**：由三种检查与四库推导，可把风格规则改为可解释建议，并将事实/版权审阅与发布收据独立；草稿任务用内容摘要识别未知结果。未验证；作者盲选样本测可读性/保真度，断网后对账不得重复建稿。

适合已有公众号编辑流程者先只做本地质检/排版；事实审阅和正式发布仍由人确认，API权限与账户条件另核。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

手工编辑工具能直接审稿发布；插件统一方法和脚本，但不替代编辑判断。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Skill**：公众号阶段工作流。
- **模型工具**：环境、风格/提示/HTML检查、排版、生图及推草稿。

**流程与依赖**

DSH tools/skills/subprocess、Python、文风资料和可选图片渠道；推草稿需微信账号凭据与当前API权限。

读素材/状态→写作→风格复核→可选配图→HTML排版检查→dry-run→人工授权后推草稿→人工发布/复盘回四库。

**效果与成本**

首次文风/主题/凭据设置；持续模型/图片费、人工事实与版权复核、排版和发布对账，未有合格文章成本实测。

可能减少反复搬运与漏检，分数变低不等于文章更好或更受欢迎。

- **思考**：去AI味分数能否代表好文章？词汇/标点规则不验证事实和论证，也可能误伤个人风格，作者注释已记录误杀与阈值收窄。推草稿链多次外部写入，dry-run不验证API权限，未知结果重试可能重传素材或建重复草稿。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对单次写作提示，增量是四库沉淀、阶段产物与确定性/自检/人工三种检查分工；方法源自作者旧工作流和外部风格研究，非原创内容质量算法。

相对单次写作提示，增量是四库沉淀、阶段产物与确定性/自检/人工三种检查分工；方法源自作者旧工作流和外部风格研究，非原创内容质量算法。

subprocess受宿主约束、密钥不进argv、dry-run明确不联网有价值；多次素材写入不具备全事务回滚。 源码依据：[dsh-preset/tools/gzhflow-tools.mjs](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs)、[dsh-preset/tools/gzhflow-skill.mjs](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-skill.mjs)、[scripts/ai_flavor_score.py](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/scripts/ai_flavor_score.py)、[scripts/publish_draft.py](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/scripts/publish_draft.py)、[package.json](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/package.json)。

<a id="detail-section-5"></a>

### 主要限制

去AI味分数能否代表好文章？词汇/标点规则不验证事实和论证，也可能误伤个人风格，作者注释已记录误杀与阈值收窄。推草稿链多次外部写入，dry-run不验证API权限，未知结果重试可能重传素材或建重复草稿。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[Andiii208/gzhflow](https://github.com/Andiii208/gzhflow)
- **版本号**：0.2.0（[固定提交 37023357](https://github.com/Andiii208/gzhflow/tree/3702335770e30ebccc3790556d53aa14c30046f2)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 dsh-preset/tools/gzhflow-tools.mjs、dsh-preset/tools/gzhflow-skill.mjs、scripts/ai_flavor_score.py、scripts/publish_draft.py、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读dsh-preset/tools/gzhflow-tools.mjs、dsh-preset/tools/gzhflow-skill.mjs、scripts/ai_flavor_score.py、scripts/publish_draft.py、package.json；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：固定作者文章与事实错误对照样本测误报，检查dry-run无外部请求；模拟上传成功/draft丢响应对账，不触碰真实账户。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由三种检查与四库推导，可把风格规则改为可解释建议，并将事实/版权审阅与发布收据独立；草稿任务用内容摘要识别未知结果。未验证；作者盲选样本测可读性/保真度，断网后对账不得重复建稿。

固定作者文章与事实错误对照样本测误报，检查dry-run无外部请求；模拟上传成功/draft丢响应对账，不触碰真实账户。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：025d2c7c70a6972e193c5d856c2ee0d03cbed79adca9ab9c75cbbf6522537793。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 92 | 12367 | — | — | 155804 |
| .mjs | source | 2 | 412 | 342 | 47 | — |
| .md | example | 7 | 412 | — | — | 4551 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Andiii208/gzhflow/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
