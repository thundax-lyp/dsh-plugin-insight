# 洞察交付验收操作

本操作将预检查、无损逐题读取、显式验收决定和批量暂存连接起来。研究充分性仍由父 Agent 逐题判断，依据为[逐题流程](../../dsh-plugin-insight/references/QUESTION-WORKFLOW.md)和[输出标准](OUTPUT-STANDARD.md#交付验收)。过程对象结构见[验收 Schema](../../_shared/schemas/research-acceptance.schema.json)，状态与摘要语义见[数据契约](../../_shared/references/DATA-CONTRACT.md#观察批次与候选合并)。

命令在工程根执行；所有输出放在本轮已有目录，使用尚不存在的新文件名。运行中修改交付后必须重新预检查和审阅，不覆盖旧 bundle 或决定。本入口不扫描来源、不运行目标代码、不修改正式快照，也不自动 plan／apply、提交或发布。

## 预检查并固定交付

父 Agent 将已经就绪的交付路径写入本轮 `DELIVERIES.json`，数组每项为 `{ id, observations, report, display }`，沿用原 stage-batch 接口；路径可为工程内绝对路径或相对工程根的路径。可按一项或多项分批，不等待整轮，也不包括受阻或尚未交付项。

```sh
npm run acceptance -- prepare --work data/runs/<round>/WORK.json \
  --input data/runs/<round>/DELIVERIES.json --out data/runs/<round>/BUNDLE.json
```

复用 WORK、观察、展示／META及逐题校验器，核对固定身份、版本、指纹、证据和报告问题入口。绑定观察、报告、DISPLAY、PLAN（存在时）及观察引用的全部证据字节，包括额外原件。源码交付须有唯一同身份同版本的 `REVIEWED-SOURCE.json` 完整问题对象；不从旧摘要补造问答。不支持的手工证据形态应先明确完善交付，不能伪装为源码材料绕过校验。

预检查成功只证明所列结构与材料可读取，不证明回答充分、原文支持解释、评分准确或目标插件运行通过。

## 按题阅读与关键依赖补查

```sh
npm run acceptance -- read --bundle data/runs/<round>/BUNDLE.json --plugin <id>
npm run acceptance -- read --bundle data/runs/<round>/BUNDLE.json --plugin <id> --question Q01
npm run acceptance -- read --bundle data/runs/<round>/BUNDLE.json --plugin <id> --artifact <原件标签>
```

总览列出总目标、问题／状态、三项综合 findings、评分／采用、报告路径、计划引用和补充材料入口。父 Agent 先读计划及报告，再读取每一道问题的完整答案、依据说明、对应原文和所有未知项。读取器不按字符截断、不删重复论证、不以摘要替代答案。工具输出截断时使用 `--out` 保存到本轮新文件，再分段补读，不能宣称已读完截断部分。

原件标签优先读取本轮实际文件；文件不存在时，从当前快照按完整标签取得已有嵌入原件及摘要，不把历史标签中的 runs 路径当作必需的本机文件。`--artifact` 返回完整原件内容和摘要，适用于独立补查或已合并原件；交付载荷摘要继续绑定这些内容。

对会改变贡献、限制、采用或评分的关键主张继续定向回源，检查反证和上下游／外部依赖。补充材料列表中的每份原件必须独立核查；有关键依赖缺口时明确 `needs_supplement` 并退回 worker，不能因字段齐全放行。历史有效范围未知可以保留，但必须判断其是否影响核心采用结论。

读取不写入“已读”标记，脚本也不自动生成通过理由；后续决定是审阅者声明，不是证明模型确实理解了材料。

## 提交验收决定

父 Agent 撰写 `REVIEWS.json`，包含 `reviewer` 和 `items`。每项必须完整覆盖 bundle 的问题与补充材料，不允许重复或额外条目。

| 字段 | 内容 |
|---|---|
| `id`、`delivery_digest` | 从总览取得，绑定实际交付 |
| `decision`、`reason` | accept／revise，完整的综合验收理由 |
| `questions` | 每题 `{ id, decision, reason }`；逐题解释回答、证据、反证及未知项是否足够，不能用统一通过语代替判断 |
| `dependencies.decision`、`reason` | sufficient／needs_supplement，说明关键依赖覆盖及剩余边界 |
| `dependencies.checks` | 非空 `{ target, evidence, conclusion }` 数组，记录实际核对的关键依赖或关键机制与具体材料定位，不伪造已执行检查 |
| `dependencies.supplements` | 每份补充原件 `{ path, decision, reason }`；没有补充材料时显式为空数组 |

```sh
npm run acceptance -- submit --bundle data/runs/<round>/BUNDLE.json \
  --input data/runs/<round>/REVIEWS.json --out data/runs/<round>/DECISIONS.json
```

submit 重新核对交付摘要，校验决定覆盖并生成绑定整个 bundle 的决定包。允许保存 revise 结果；整体 accept 不能覆盖某题 revise 或依赖 needs_supplement。提交不会改变 WORK，不表示已经暂存。原件修订后重新 prepare、读取受影响问题并提交新的完整决定，不能只改摘要继承旧通过。

## 批量暂存与恢复

```sh
npm run acceptance -- stage --bundle data/runs/<round>/BUNDLE.json \
  --decisions data/runs/<round>/DECISIONS.json
```

只接受该 bundle 对应的全项 accept。stage 重新检查文件与决定，再调用现有 `stageRecords`；在 WORK 锁内对实际读入的记录核对预审载荷摘要，失败不保存部分检查点。正式快照保持不变，父 Agent 再按 INIT 执行计划和合并。

整批已按同一交付暂存时返回 `already_staged`，不重复写入；若批内只有部分条目已暂存，停止并为剩余条目重新准备独立批次，不自动修改选择或撤销旧检查点。WORK 或基线漂移、交付变化、摘要不符与语义退回均须先处理原因，不通过手改过程状态继续。

旧 stage／stage-batch 保留兼容。本流程的语义决定只能由父 Agent 提交，worker 只交付研究；不能用低层入口代替新流程要求的验收。

已暂存后发现需要退修时，先按[会话恢复](SESSION-OPERATIONS.md#新轮次与同轮恢复)的 `snapshot reopen` 解除该项检查点并保留旧记录，再允许 worker 修改交付。重新 prepare、读取受影响问题并撰写完整决定；不能覆盖旧 bundle、决定或直接覆盖暂存记录。

## 实现与边界

命令与导出函数由 [research-acceptance.mjs](../scripts/research-acceptance.mjs) 实现。`stageRecords` 的可选记录核对回调在锁内、WORK 保存前运行，比较观察、报告、展示输入和全部嵌入证据；现有调用方默认行为不变。

此链减少重复协议拼接与临时脚本，不自动缩减研究问题、不生成判断、不承诺 TOKEN 或质量提升。报告与当前正式数据结构不变；BUNDLE、REVIEWS、DECISIONS 只是可清理的本轮过程材料，不能成为下一轮或当前快照的必需依赖。

固定版本重放、拒绝边界和验证限制见[实施验证](ACCEPTANCE-CHAIN-EVIDENCE.md)。
