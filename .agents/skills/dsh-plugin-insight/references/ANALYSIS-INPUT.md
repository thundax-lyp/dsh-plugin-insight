# 单插件分析输入与装配

逐题回答完成、准备写 `ANALYSIS.json` 或修正装配错误时读取。研究流程见[洞察 Skill](../SKILL.md)，问题对象见[逐题流程](QUESTION-WORKFLOW.md#结构化装配接口)，评分定义见[评分标准](SCORING-STANDARD.md)。本页说明现有接口，不新增字段或评分规则。

## 前提与命令

使用父 Agent 固定的身份、提交、检查时间和独占目录。先完成 PLAN 与逐题回答，再写分析字段；已有准备材料核对后复用。

```sh
npm run assemble:insight -- --work <WORK.json> --plugin <id> --analysis <ANALYSIS.json>
```

装配器只处理当前已选 pending 项的人工／执行AI分析，校验完成后写出交付文件，不生成研究判断、不自动 stage，已有交付拒绝覆盖。无活跃 WORK 的独立研究不能编造事务字段。报错按完整字段路径修正 ANALYSIS 或 META 后重跑，不改 Schema 绕过约束。

## 必填字段速查

以下字段均必填，分组只为查阅，不在 JSON 中增加分组层级。文本非空，精确字段结构以本页及所引用的 Schema 为准。

| 内容 | 顶层字段 | 填写要求 |
| --- | --- | --- |
| 名称与自述 | `name`、`summary` | summary 是项目自身描述支持的单行功能摘要，最多80字符，不掺评价 |
| 问题对象 | `research_questions` | `goal` 与完整 `questions`；不得以摘要替代回答，结构见逐题流程 |
| 场景与实现 | `scenario`、`mechanism`、`baseline` | 说明用户任务、实际机制及原生／上游／简单替代 |
| 三项综合 | `contribution`、`critical_question`、`innovation_hypothesis` | 分别保存贡献论证、关键质疑和假设推演，并链接实际问题；没有贡献判断或新假设时说明原因 |
| 综合状态与性质 | `conclusion_status`、`conclusion_findings` | 状态分开解释已有贡献与未来假设；findings 结构见下节 |
| 创新与采用 | `innovation_scores`、`recommendation` | 执行AI独立判断，结构与证据门槛见下节，不从文案自动推断 |
| 使用条件与代价 | `dependencies`、`workflow`、`cost`、`value`、`adoption` | 覆盖依赖、操作、成本、效果和具体建议；按输出标准写表格，不将未知填0 |
| 工程与研究范围 | `engineering`、`scope`、`verification`、`distribution` | 保存工程评价、实际覆盖、未执行与验证方案；distribution 保留 JSON，不装配独立章节，影响判断的事实归入相关正文 |
| 固定源码 | `source_paths` | 非空路径数组，列出实际检查过且固定提交中存在的文件 |
| 能力摘要 | `capabilities` | 对象；键为契约规定的扩展类型，值为单行字符串，不用功能名作键、英文别名或数组 |
| 分类 | `technical_category`、`business_category` | 使用研究规范的现有枚举，按主要能力与用户任务判断 |

唯一可选顶层字段为 `capability_table`：人工撰写的能力／主要用途／使用条件与边界三列表格。新研究应提供；`capabilities` 仍保存正向摘要，不以表格改变其类型。其他字段不能自行添加。

## 综合结论与评分对象

枚举直接查[档案 Schema](../../_shared/schemas/catalog.schema.json)的 `$defs.finding.properties.topic` 与 `basis`；问题结构查[问题 Schema](../../_shared/schemas/research-questions.schema.json)。评分输入以本页对象结构及装配器为准，不能把档案中脚本生成的 score／evaluator 反填入输入。

- `conclusion_findings` 恰含 `contribution`、`critical_question`、`innovation_hypothesis`，每项仅含 `topic`、`basis`，使用档案 Schema 枚举，不重复正文。假设的 basis 必须为 `unverified`；引用推导材料不表示已验证。
- 三项综合正文由研究者完成。装配器将它们写入报告及同名 findings，绑定本次源码证据、当前 code 指纹、复核时间与 current 状态。额外证据、跨插件依赖及其他性质须逐条显式补充并校验。
- `innovation_scores` 恰按 technical／business 两轴提供，每轴含 `criteria`、`rationale`、`basis`。按评分标准给分项和理由；脚本只算总分并绑定版本、时间与证据，不将数值写入 Markdown。
- `recommendation` 含 `decision`、`reason`、`criteria`。criteria 为 scenario／advantage／evidence／cost，各含 score、rationale；按 adoption-v1 从实际问题独立取档。reason 为[三句具体用法](QUESTION-ADOPTION.md#最值得推荐的具体用法)的单行字符串。脚本只求和并绑定版本、时间、源码证据与 code 依赖，不从 adoption 文本推断结论，不使用 `trial_summary`。

## 输出与父 Agent 核对

`REVIEWED-SOURCE.json` 保存固定源码、inventory 和完整问题对象，不嵌入 META；META 经 DISPLAY 单独进入同组件 `meta.json`。旧包内 metadata 按数据契约兼容保留。

装配前后均核对真实 `entry_type`。目录收录、根目录或子包位置不能证明原生 DSH 插件身份，要看导出与接线。`entry_type` 不是 ANALYSIS 接口字段；若装配结果使用默认类型，向父 Agent 明示正确类型，在 stage 前按现有观察 Schema 修正并校验，不靠分类掩盖类型差异。

装配成功只表示结构通过；父 Agent 仍须核对问题回答、实际源码支持、评分理由、当前依赖、引用与成品。真实执行或外部反馈应按数据契约交付相应证据，不能伪装成源码条目塞入此装配器。
