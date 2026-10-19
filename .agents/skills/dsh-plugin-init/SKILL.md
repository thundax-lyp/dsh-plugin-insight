---
name: dsh-plugin-init
description: 显式调用时编排整轮 DSH 插件研究：确认来源、生成列表、标记新增与移除、调用单插件洞察、管理断点并汇总推荐。适用于首轮、后续整轮及同轮恢复。
---

# 插件列表与研究编排

在工程根目录执行；依赖共享的 `docs/01-design/`、`schemas/`、`scripts/` 和根 package，不能只复制 Skill 目录。
开始前阅读[数据契约](../../../docs/01-design/DATA-CONTRACT.md)、[研究规范](../../../docs/01-design/RESEARCH-STANDARD.md)、
[输出标准](../../../docs/01-design/OUTPUT-STANDARD.md)。GitHub 来源与版本读取依赖当前环境可用的 GitHub Skill 或插件；
不假设特定 Skill 名称。Git 协作遵循根 `AGENTS.md`；运行时遵循 `.node-version`，依赖缺失时执行 `npm ci --ignore-scripts`。

## 调用参数

`$dsh-plugin-init [最大研究插件数]`，例如 `$dsh-plugin-init 3`。省略时研究全部；提供时必须为正整数。
新增、更新、删除（目录移除）、未变及未知条目共用同一个上限，每个稳定插件 ID 只计一次。
新会话将此参数传给 `start --limit N`；不传则省略该选项。完整列表仍保留，按清单顺序选取（目录缺席项追加在后），不按变更类型分配额外额度。
同轮恢复使用已固定的上限和选择，不重置计数；受阻项也占名额，不另找插件补位。

1. **区分新一轮与续跑。** 查看 `data/sessions/` 和工作区。用户要求继续时恢复原会话；明确开始新一轮时使用新 ID，
   以最近可比会话作为 `--previous`，记录其范围差异。不因为已有档案改走另一个 Skill，不清空历史。
2. **确认来源，整理列表。** 核对用户来源；默认使用研究规范中的两个目录。固定来源版本、截止时间和覆盖边界，
   优先结构化条目，补充 README／CATALOG。使用 GitHub 插件，或可选 `capture-github.mjs`；后者不能穷尽目录内容。
   核对稳定仓库／组件身份，去重并区分条目类型；身份未核实的候选另存问题记录，不编造 ID。
   按[会话契约](../../../docs/01-design/DATA-CONTRACT.md#研究会话与脚本检查点)准备输入清单，
   格式参考[合成输入](../../../examples/research-input.json)，不能将合成数据导入真实档案。
3. **脚本生成本轮队列和变更标记。** 首轮省略 `--previous`；后续轮次必须给出可比的上轮会话。
   ```sh
   npm run research -- start --input /tmp/dsh-research-input.json --previous data/sessions/<previous_id>.json --out data/sessions/<session_id>.json
   npm run research -- next --session data/sessions/<session_id>.json
   ```
   不覆盖已有会话；续跑直接调用 `next`。脚本比较新增、移除、路径／内容／来源变化、未变及无法确认，
   所有条目在新轮次重新排队，实际处理范围受可选上限限制。未变不代表免于分析；来源不完整不能推断移除。核对标记的语义边界，
   尤其版本未能确认、仅来源差异和前轮范围不同的情况。
4. **显式调用单插件洞察。** 对 next 返回的条目，读取并应用[单插件洞察 Skill](../dsh-plugin-insight/SKILL.md)。
   传入稳定 ID、固定源码版本、本轮截止时间、目标深度、来源证据、历史详情和输出位置；每轮所选条目重新分析，
   同轮只跳过 complete 项。洞察 Skill 返回证据、详情和独立观察批次，编排 Skill 检查返回范围和证据边界后入档。
   这属于用户显式启动本编排的流程内调用，不依赖隐式发现，也不自动创建子 Agent。
   检查单项交付是否附固定范围的 inventory 统计、能力清单、代码评价和可借鉴处；抽读子集必须标明，未知数量不填0。
   分析失败记受阻并继续其他条目；来源移除只表示目录缺席，核查当前仓库和采用影响，不物理删除历史。
5. **逐项保存、计划和应用。** 为该项保存证据、完整详情和唯一观察批次。空档案第一次写入用 `init`，
   之后一律用 `update`；这只是底层写入模式，不是两种研究流程。检查计划后应用：
   ```sh
   node scripts/plugin-data.mjs plan --mode <init-or-update> --observations data/observations/<run_id>.json --out /tmp/dsh-plan.json
   node scripts/plugin-data.mjs apply --plan /tmp/dsh-plan.json
   node scripts/plugin-data.mjs validate --observations data/observations/<run_id>.json
   npm run research -- checkpoint --session data/sessions/<session_id>.json --plugin <plugin_id> --observations data/observations/<run_id>.json --report data/reports/<detail>.md
   ```
   checkpoint 核对已应用数据、本轮核查时间、固定源码版本、材料及摘要，成功后才完成该项。
   若 apply 后中断，先核对 `catalog.runs` 和批次，补做校验与 checkpoint，不重复 apply。
   已完成详情作为不可改写的本轮产物；后续修订使用新材料和新一轮，不静默覆盖检查点文件。
6. **恢复、受阻与收口。** 每完成一项继续调用 `next`，已完成项被跳过。失败保存错误批次和部分材料，使用
   `block --session ... --plugin ... --reason ...` 登记原因，处理其他项；重试时用 `retry --session ... --plugin ...`。
   来源移除的条目也保留，尝试核查当前仓库及采用影响；无法读到源码时记受阻，不能伪造成功检查点。
   `next` 返回空但 blocked 非零仍未完成；不从“没有待处理项”推断全部成功。
   按[三层输出](../../../docs/01-design/OUTPUT-STANDARD.md#先分析再归纳与推荐)，先完成详情，
   再归纳分类列表的“用途／亮点／关键质疑／建议”，最后生成推荐页；安装推荐与本周试用候选使用不同证据门槛。
   阶段汇总标注未完成项；会话与原始数据由轮次报告追溯。
   按输出标准准备 `data/publications/current.json`，历史文件保留但不进入README，人工填写有依据的推荐摘要，
   调用 `npm run capture:meta -- OWNER/REPO --out data/snapshots/<run_id>/<plugin>-meta.json` 保存每个 GitHub 仓库 META，
   对已核实的插件 package.json 名称，在采集命令增加 --npm <exact-package-name>，记录最近30个完整UTC日期的下载数；
   没有确认的npm包时省略，不猜包名，不用0代替失败。
   已建立列表后的日常 META 刷新可直接运行 npm run refresh:meta；它只标记脚本更新，不替代洞察或改写检查点。
   将快照填入发布输入的 metadata 映射；分类页按输出标准生成名字＋用途目录、META及四标签短评。
   标题、章节与Markdown版式维护 templates/publication/*.md，不写死到生成代码；脚本仅处理数据、排序和填充。
   再执行 `npm run render:research` 生成 README、分类列表及追加Issue活跃度的详情展示页，不能手写 README 或添加工程使用内容。
   发布输入引用当前catalog以计算本周首次入档插件；README按本周新增、最新／最热／推荐、每类最热 5 个插件及更多入口的分类列表、研究出处、末尾更新时间合成；不放历史或过程说明。完成前运行 `npm run check`，
   人工检查叙述、采用判断、引用和本轮覆盖；脚本校验不证明实际业务收益。

本 Skill 不自动安装第三方插件、安排周期任务、提交、推送或发布。

## 显式调用与职责

仅在用户点名本 Skill 或明确要求执行整轮列表研究时使用，不因提及某个插件就启动。
本 Skill 拥有会话队列、变化标记、plan／apply／checkpoint 与汇总发布；
单插件洞察 Skill 不自行改变队列或当前档案。只研究一个插件时可以单独显式调用洞察 Skill。
