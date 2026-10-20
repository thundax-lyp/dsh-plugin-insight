---
name: dsh-plugin-init
description: 显式调用时编排整轮 DSH 插件研究：以唯一当前快照为基线，生成本轮增量、管理断点，验证后合并并生成读者成果。适用于新一轮研究及同轮恢复。
---

# 插件列表与研究编排

在工程根目录执行。开始前阅读[数据契约](../_shared/references/DATA-CONTRACT.md)、[研究规范](../dsh-plugin-insight/references/RESEARCH-STANDARD.md)、[输出标准](references/OUTPUT-STANDARD.md)。
Git 协作遵循根 `AGENTS.md`；Node 遵循 `.node-version`，依赖缺失时执行 `npm ci --ignore-scripts`。
GitHub 来源与固定版本读取使用当前可用的 GitHub 插件或已认证工具，不执行目标插件代码。

## 当前快照与本轮增量

正式研究真相只有一份：当前档案及其引用的当前分析、证据和来源状态。发布输入只组织展示，README、分类页和详情展示页由当前快照生成。
`data/runs/<round>/` 只承载尚在处理的增量、检查点与失败材料，不是必须永久保存的第二套档案。
新一轮与当前快照比较，不要求上一轮 SESSION、manifest 链或 runs 归档；历史版本需要时从 Git 查阅。
具体合并、证据落位及清理条件以[数据契约](../_shared/references/DATA-CONTRACT.md#唯一当前快照与本轮增量)为准。

正式真相位于 `data/catalog/SNAPSHOT.json`，结构见共享 `snapshot.schema.json`；本轮工作入口为 `data/runs/<round>/WORK.json`，新建时使用 v2 小索引，INPUT、队列、会话状态与单项结果分开保存，完整逻辑结构见 `snapshot-work.schema.json`，拆分存储见 `work-storage.schema.json`。用过程读取器加载，不直接对 WORK／SESSION 执行 JSON 读取后假设内嵌完整数据。
使用 `npm run snapshot --` 完成 start／next／stage／block／plan／apply／render／validate／migrate-work／clean。`PLUGINS.json`、`PUBLICATION.json`、路径注册表、META 与页面是可重建的兼容输出，不再单独人工写入。
首次迁移才使用 `snapshot bootstrap`；它保留现有分析，明确列出缺失历史原件，不把迁移当成本轮研究。已有快照时不得重做 bootstrap。
旧 research／publication 的正式写入不再用于新流程；命令及恢复语义见[会话与合并恢复](references/SESSION-OPERATIONS.md)。

## 调用参数

`$dsh-plugin-init [本轮新增与更新总额度]`，例如 `$dsh-plugin-init 30`。省略时默认40；提供时必须为正整数。
每次未指定恢复轮次的调用启动新一轮；已有同日已合并轮次不代表本次请求已完成。
先核对当前快照中已有研究成果的条目（例如前轮已完成的40项，后续随档案增长），有变化或需要复核的项优先占用额度；确认未变的项保留原成果，不占额度。
若本轮额度为40，已有项中有 n 项需要更新，则再从尚无当前研究成果的条目中依目录顺序选择40−n项；n≥40时只选择前40个更新项，其余留待后轮。
“新项”指尚未完成研究，不限于本轮首次在目录发现。完整列表仍保留；新增不足时不凑数。
受阻或未知的待复核项占名额，不用其他条目掩盖失败；同轮恢复固定选择、不补位。具体选择不变量见数据契约。
同轮恢复使用已固定的选择和上限，不重置计数；未选项不冒充已研究。

## 执行流程

1. **读取基线并确定本轮。** 检查工作区和当前快照，记录其摘要；当前快照不存在才视为首次初始化。
   新轮次分配未占用的 `data/runs/YYYY-MM-DD-NN/`；继续任务时通过过程读取器恢复本轮会话和已完成的暂存记录，逐一验证引用摘要。旧过程需要拆分时先预览 `snapshot migrate-work --work ...`，再加 `--apply` 显式迁移，保留原件并核对语义摘要；不重建已清理轮次。
   旧 runs 缺失不阻止新研究。当前快照缺少某项比较依据时，将该维度标为 unknown，不从历史清单拼造事实。
2. **固定来源与生成列表。** 默认核查两个研究目录，固定 checkout 提交、检查时间和覆盖范围。
   使用稳定输入构建器，保存本轮 INPUT 与问题记录；来源 checkout 必须干净，构建前后 HEAD 不变。
   ```sh
   npm run research:input -- \
     --source-awesome data/tmp/sources/awesome-dsh-plugin \
     --source-harness data/tmp/sources/awesome-deepseek-harness \
     --id <session_id> --checked-at <ISO时间> \
     --out data/runs/<round>/INPUT.json \
     --problems data/runs/<round>/INPUT-PROBLEMS.json
   ```
   只有完整读取并核对来源后才增加相应 `--complete-awesome`／`--complete-harness`；解析、身份或默认分支问题使来源不完整。
   按仓库数字 ID 与已分配组件路径去重，保留重定向、组件碰撞和身份失败的具体记录，不编造 ID。
3. **形成固定队列。** 先核对所有已有研究成果，再用新项补足额度。已有项以其最后完成研究的版本为比较基线，不能被后续仅发现未研究的版本覆盖；比较位置／内容／来源变化、未变及未知，依赖失效也需复核。只有相关来源完整核查才可推断目录移除。
   固定本轮候选、来源、指纹、选择、上限和基线摘要，写入本轮会话；后续不反向改写它们以通过检查。
   ```sh
   npm run snapshot -- start --input data/runs/<round>/INPUT.json --work data/runs/<round>/WORK.json --limit <N>
   npm run snapshot -- next --work data/runs/<round>/WORK.json
   npm run prepare:selected -- --work data/runs/<round>/WORK.json
   ```
   Skill 未提供参数时使用40；`snapshot start` 省略 `--limit` 时同样默认40。prepare:selected 只读取固定提交、统计和采集材料/META，不运行目标代码，不生成观察或研究结论。
   选中的更新项和新项均完整分析；未变的已有项只核对后保留，不调用洞察、不伪造本轮完成记录。同轮恢复跳过已完成且材料校验一致的项。
4. **逐项调用单插件洞察。** 读取并应用[单插件洞察 Skill](../dsh-plugin-insight/SKILL.md)，传入稳定 ID、固定版本、截止时间、当前快照中的分析和证据、目标深度及本轮输出位置。
   该流程内调用不自动创建子 Agent。每项独立保存 inventory、证据、详细分析、观察批次及人工确认的摘要／能力／建议。
   核查场景、替代办法、安装与效果依赖、用户与异常流程、总成本和采用条件；不得用静态候选批量生成通用结论。
5. **校验并暂存完成记录。** 核对每项身份、版本、来源指纹、完整 findings 复核、证据引用、报告及材料摘要。
   计划与应用先针对本轮暂存的候选快照，不逐项写入正式档案；检查点代表本轮记录完整，不代表已合并或已通过宿主验收。
   每项 DISPLAY.json 含 metadata 对象、单项 summaries／capabilities／advice 对象与 recommendations 数组；各项必须由人工研究形成，结构与发布 Schema 一致。
   ```sh
   npm run snapshot -- stage --work data/runs/<round>/WORK.json --plugin <id> --observations <observations.json> --report <insight.md> --display <DISPLAY.json>
   ```
   失败保存部分材料与 reason JSON，再用 `snapshot block --work ... --plugin ... --input <reason.json>` 登记；继续其余所选项，不补位、不重复应用。
6. **形成合并候选。** 从已完成的详细分析归纳四标签短评和有条件推荐，再组织发布输入。安装推荐仍要求固定版本的真实宿主验收证据。
   使用 META 采集器保存本轮采集结果，npm 包名必须由源码核实；未知值不填0。
   将支撑当前结论的分析原文和必要证据落入正式快照引用的位置；发布输入只引用合并候选中的当前材料，不引用待清理的 runs 文件。
   未选、失败或未完成项保留正式快照的有效记录，不因本轮 pending／blocked 将旧成果移出发布；新证据足以使旧结论失效时，单独校验并标记待复核，调整推荐，不伪装成完成。
7. **最后合并与生成。** 汇总审阅本轮候选；检查正式基线摘要和依赖是否变化，冲突时重做合并计划，不覆盖并发修改。
   通过结构、身份、证据、依赖和语义校验后，再以一致的发布事务合并当前档案、分析／证据引用及展示输入；提交点前读者仍看到旧快照。
   从合并后的当前快照生成 README、分类页和详情展示页。旧 SESSION、runs 和历史 manifest 不参与当前发布有效性判断。
   ```sh
   npm run snapshot -- plan --work data/runs/<round>/WORK.json --out /tmp/dsh-snapshot-plan.json
   npm run snapshot -- apply --plan /tmp/dsh-snapshot-plan.json
   npm run check
   ```
   检查 plan 的基线、合并范围与保留项后才 apply；再人工核对叙述、引用、采用条件和覆盖范围。
8. **确认与清理。** 回读合并结果，确认本轮成功记录已落位、引用可解析、页面可由当前快照独立生成；写入合并结果后才清理本轮临时材料。
   使用 `snapshot clean --work ...` 预览，明确执行时加 `--apply`。仅清理已确认合并且全部完成的已知材料；受阻、未完成和未知文件保留，不删除活动锁。
   来源准备失败或仍有 blocked 时如实报告。所选上限内完成只代表所选范围完成，不代表全生态研究完成。

## 职责与授权

仅在用户点名本 Skill 或明确要求整轮研究时使用。编排拥有队列、增量暂存、合并和本地成果生成；单插件洞察只返回单项记录。
本 Skill 不自动安装第三方插件、安排周期任务、提交、推送或对外发布。更新规范不授权删除既有历史材料或迁移正式数据。
