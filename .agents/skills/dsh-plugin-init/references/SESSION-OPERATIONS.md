# 会话与合并恢复

状态语义见[数据契约](../../_shared/references/DATA-CONTRACT.md#唯一当前快照与本轮增量)，正常流程见[列表编排 Skill](../SKILL.md)。本页只规定暂存、合并、中断和清理的处理方式。

## 新轮次与同轮恢复

- 新轮次读取唯一当前快照及其摘要，不要求上一轮 SESSION 或归档。旧过程文件缺失不算正式快照损坏。已合并轮次不作为新调用的恢复目标；新调用先读取正式research_blocks排除已知同版本受阻，再按显式重试优先、更新、新项补足，选择与额度见数据契约。
- 同轮恢复读取本轮会话、固定选择、基线摘要及暂存材料，验证检查点后跳过完整项，不重置上限或替换受阻项；显式同轮重试见下方命令。
- 本轮材料丢失或摘要不符时，仅重做受影响的未合并记录；不能复制旧会话、刷新时间或从正式档案反写指纹以伪造完成。
- 当前快照缺少来源成员清单或比较维度时标 unknown，重新采集，不从历史 manifest 拼造完整基线。

## 拆分过程与迁移

新建 WORK 为 v2 索引：固定清单只存 INPUT，变化按下标存 QUEUE，状态与单项结果按内容摘要独立存放。SESSION 是指向 WORK 的兼容入口；读取器完成校验后还原既有内存结构，业务脚本不各自拼装。完整不变量见数据契约。

- `npm run snapshot -- migrate-work --work data/runs/<round>/WORK.json`：预览源格式、语义摘要和原文件大小，不写文件。
- 同命令加 `--apply`：持有 WORK 与 SESSION 锁，保留旧 WORK／SESSION 原始字节，准备依赖并校验，再原子切换 WORK；回读摘要一致才报告迁移完成。
- 原件保留在该轮 `migration-originals/work-storage-v1/`，迁移报告为 `WORK-MIGRATION.json`；备份、未知文件和中断残留不由 clean 自动删除。
- v1 继续兼容读取及暂存。v2 的 next、stage、block、plan、apply、prepare 与 assemble 共用读取器；旧 research 命令拒绝直接修改 v2 SESSION，使用 snapshot 对 WORK 操作。
- 路径、引用或摘要失效时停止，不静默回退原件或刷新摘要。切换前中断可重试；切换后中断以 WORK 为准恢复兼容入口和迁移报告。拆分不改变固定选择、观察批次、检查时间或正式快照。

## 正式快照存储迁移

`npm run snapshot -- migrate-storage --backup data/runs/<round>/migration-originals/catalog-v2/SNAPSHOT.json` 将旧 v1／v2 正式快照迁为 JSONL 索引与按 MD5 ID 分桶的组件 JSON。命令保存旧索引及旧引用图原始字节并核对完整语义摘要，持有正式锁且不改研究结论；重复执行只校验，不覆盖备份。清理前核对该备份完整。迁移不改变 WORK 基线，格式与恢复步骤见数据契约；中断事务核实无活动写入者后用 `npm run snapshot -- recover-storage` 回滚。业务读取使用共享 snapshot-storage。

## 组件推荐迁移与复核

`npm run snapshot -- assess-recommendations --input <ASSESSMENTS.json>` 预览；核对后加 `--apply` 持正式锁校验、原子合并并重生成页面。可用于给已有研究补推荐评估，不重做源码研究；不得据此宣称新安装或运行验证。旧组件缺字段时补为未评估、分数null；只对输入中已实际复核的组件赋予结论和分数，保留其他已有评估。历史独立推荐名单退出真相源，不从缺席推断不推荐。

输入必须包含 base_digest（共享digest对还原后的正式快照计算）、reviewed_at 和 assessments 映射；每个稳定ID对应 revision、decision、reason、criteria，criteria结构与单项ANALYSIS.recommendation一致。当前发布项仅接受匹配已完成研究版本及不早于研究时间的复核；未发布但保留研究档案的组件只允许observe／not_recommended，须引用确实存在的同版本源码证据并强制needs_review，不恢复发布记录。install另引用宿主验收。命令同步分析摘要但不改源码检查时间、原稿或轮次事务；正式基线变化时先重读再复核，不覆盖并发。已应用输入再次执行因基线变化而拒绝，应先回读当前结论，不自动重放。

## 暂存与最终合并

- 所选项为空时允许仅推进 discovery、来源核查信息与轮次时间，保留既有研究和展示记录；所选项全部受阻时，只要每项有完整持久block，也允许仅合并受阻原因；既无成功也无完整block则拒绝。
- plan 与 apply 均拒绝仍有 pending 所选项的 WORK；先完成或明确登记 blocked，再合并成功项及持久受阻记录。逐项 stage 仍可在同轮其他项 pending 时暂存，不实现部分合并后的重基线。

- 研究过程中的 plan／apply 只作用于本轮候选；正式快照在最终合并前保持不变。
- 合并计划同时绑定正式基线和候选摘要，核对身份、版本、证据、结论依赖和展示输入。正式基线变化时重新计划并审阅冲突。
- 支撑当前结论的分析与证据先准备到正式引用位置，再通过一致的事务提交当前状态。回读提交结果后才能报告已合并。
- 中断发生在提交点前，正式状态仍为旧快照；提交点后回读实际合并标识与摘要，已合并的增量不得重复应用。
- 单项失败或未完成不替换有效记录；需要标记旧结论失效时，将有证据的失效判断作为独立可校验记录处理。
- 锁存在时停止写入，核对 PID 和实际写入者；确认无活跃写入者后才能清理遗留锁，不自动抢占。

## 合并后清理

按[输出标准](OUTPUT-STANDARD.md#本地-runs-与-git-清单)检查本轮合并结果、当前引用及恢复需求。确认当前快照可独立校验和生成后，预览并清理无引用的已合并副本，不要求永久归档。
未合并增量、待处理失败材料、活动锁和用途不明的文件保留；当前引用仍指向 runs 时先完成落位，不能先删文件。
旧历史文件是否迁移或删除另按实际任务执行，本次规范变更本身不执行清理。

## 命令与兼容输出

- `npm run snapshot -- start --input <INPUT.json> --work data/runs/<round>/WORK.json [--limit N] [--retry-plugin <id>]`：重试参数可重复，仅在用户明确要求时传入；指定已登记受阻候选优先占正常额度。省略 `--limit` 默认40，绑定当前快照摘要并固定选择，不读取上轮会话。
- `block --work ... --plugin <id> --input <reason.json>`：reason包含稳定reason_code、可读reason及自包含问题详情；写入本轮block，最终由plan/apply落入正式快照。
- `retry --work ... --plugin <id>`：用户明确要求时，重置未合并的已选blocked项为pending后重新准备，原始失败材料保留；不改变固定选择或额度。已合并事务不能重置，开启新轮并指定--retry-plugin。
- `next --work ...` 返回本轮待处理项；`stage --work ... --plugin <id> --observations ... --report ... --display ...` 校验完整单项记录，只更新 WORK／本轮 SESSION。
- `plan --work ... --out ...` 产生合并候选；`apply --plan ...` 持锁复核并原子更新正式快照，重复执行同一结果不重复追加。
- apply 已成功而生成中断时，直接执行 `snapshot render`；不重新研究或重复应用观察。
- `snapshot validate` 和 `npm run check` 校验正式快照及派生成果；不要求旧 runs 或 manifest 存在。
- `snapshot clean --work ...` 预览；加 `--apply` 只清理已确认合并、全部完成的已知材料。未知文件保留，受阻项需要恢复时拒绝清理。
- `snapshot bootstrap` 仅用于现有旧数据的首次迁移，记录缺失原件，不制造新研究。已有正式快照时拒绝再次初始化。

轻量更新遵循数据契约“目录与维护信息的轻量更新”：新 WORK 固定 metadata_only_ids，旧 WORK 恢复保持原选择。先合并发现层，再按需执行 `npm run refresh:meta -- --plugin <稳定ID>`（可重复）定向刷新；不在未合并事务期间改写正式基线，不重新准备源码证据。

旧 research／publication 命令保留兼容读取能力，但不得对正式派生档案单独 apply。META 刷新同样先更新内存候选，校验正式快照摘要、持锁原子写入后再生成页面。
