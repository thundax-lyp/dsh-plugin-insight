---
name: dsh-plugin-init
description: 显式调用时编排整轮 DSH 插件研究：确认来源、生成列表、标记新增与移除、调用单插件洞察、管理断点并汇总推荐。适用于首轮、后续整轮及同轮恢复。
---

# 插件列表与研究编排

在工程根目录执行；依赖本 Skill 和洞察 Skill 的 `references/`、共享约定、`.agents/skills/_shared/schemas/`、Skill 内脚本和根 package，不能只复制 Skill 目录。
开始前阅读[数据契约](../_shared/references/DATA-CONTRACT.md)、[研究规范](../dsh-plugin-insight/references/RESEARCH-STANDARD.md)、
[输出标准](references/OUTPUT-STANDARD.md)。GitHub 来源与版本读取依赖当前环境可用的 GitHub Skill 或插件；
不假设特定 Skill 名称。Git 协作遵循根 `AGENTS.md`；运行时遵循 `.node-version`，并与 package.json 的 engines.node、本地验证及 CI 保持一致；依赖缺失时执行 `npm ci --ignore-scripts`。

专用脚本在 [scripts/](scripts)：来源清单使用 `build-research-input.mjs`，会话使用 `research-session.mjs`，
发布输入使用 `publication-data.mjs` 的 plan／apply；发布模板在 [assets/templates/publication/](assets/templates/publication)。
数据读写与批量 GitHub 身份核实复用 [共享脚本](../_shared/scripts)。依赖和稳定命令仍由根 package.json 维护。

## 调用参数

`$dsh-plugin-init [最大研究插件数]`，例如 `$dsh-plugin-init 3`。省略时研究全部；提供时必须为正整数。
新增、更新、删除（目录移除）、未变及未知条目共用同一个上限，每个稳定插件 ID 只计一次。
新会话将此参数传给 `start --limit N`；不传则省略该选项。完整列表仍保留，按清单顺序选取（目录缺席项追加在后），不按变更类型分配额外额度。
同轮恢复使用已固定的上限和选择，不重置计数；受阻项也占名额，不另找插件补位。

1. **区分新一轮与续跑。** 查看本地 `data/runs/` 和工作区；该目录被 Git 忽略，只用于过程、证据与断点。新轮次分配 YYYY-MM-DD-NN 可读目录，内部 ID 与时间字段仍按数据契约保留。用户要求继续时恢复原会话；明确开始新一轮时使用新 ID，
   新会话输出必须为 `data/runs/YYYY-MM-DD-NN/SESSION.json`，文件名不重复附时间；
   以最近可比会话作为 `--previous`，记录其范围差异。不因为已有档案改走另一个 Skill，不清空历史。
2. **确认来源，整理列表。** 核对用户来源；默认使用研究规范中的两个目录。固定来源版本、截止时间和覆盖边界，
   优先结构化条目，补充 README／CATALOG。使用 GitHub 插件，或可选 `capture-github.mjs`；后者仅采集仓库元数据、固定提交／文件树、部分根文件及最多100条发布记录，不能穷尽目录或跟踪全部依赖。
   目录解析、组件匹配和额外源码须另行核查；保留分页、截断和访问失败边界，不执行目标代码。
   核对稳定仓库／组件身份，去重并区分条目类型；身份未核实的候选另存问题记录，不编造 ID。
   按[会话契约](../_shared/references/DATA-CONTRACT.md#研究会话与脚本检查点)准备输入清单，
   格式参考[合成输入](assets/research-input.json)，不能将合成数据导入真实档案。真实目录使用稳定输入构建器，不为每轮临时创建脚本：
   ```sh
   npm run research:input -- \
     --source-awesome data/tmp/sources/awesome-dsh-plugin \
     --source-harness data/tmp/sources/awesome-deepseek-harness \
     --id <session_id> --checked-at <ISO时间> \
     --out data/runs/<round>/INPUT.json \
     --problems data/runs/<round>/INPUT-PROBLEMS.json
   ```
   只有完整读取并核对相应来源时才增加 `--complete-awesome` 或 `--complete-harness`；解析、身份或默认分支问题会让脚本保守降级该来源为不完整。
   工具必须使用既有档案的仓库数字 ID／组件路径复用稳定组件 ID，合并重定向别名并保留具体条目摘要；未解决身份不得静默丢弃。
3. **脚本生成本轮队列和变更标记。** 首轮省略 `--previous`；后续轮次必须给出可比的上轮会话。
   ```sh
   npm run research -- start --input data/runs/<round>/INPUT.json --previous data/runs/<previous_round>/SESSION.json --out data/runs/<round>/SESSION.json
   npm run research -- next --session data/runs/<round>/SESSION.json
   ```
   不覆盖已有会话；续跑直接调用 `next`。脚本比较新增、移除、路径／内容／来源变化、未变及无法确认，
   所有条目在新轮次重新排队，实际处理范围受可选上限限制。未变不代表免于分析；来源不完整不能推断移除。核对标记的语义边界，
   尤其版本未能确认、仅来源差异和前轮范围不同的情况。
   不复制旧会话并换用新 `checked_at` 来制造新轮次；格式修复走有审计记录的迁移。同一会话的候选、指纹和来源在 start 后固定，
   不得从当前档案反向回写以绕过 checkpoint 不一致。
4. **显式调用单插件洞察。** 对 next 返回的条目，读取并应用[单插件洞察 Skill](../dsh-plugin-insight/SKILL.md)。
   传入稳定 ID、固定源码版本、本轮截止时间、目标深度、来源证据、历史详情和输出位置；每轮所选条目重新分析，
   同轮只跳过 complete 项。洞察 Skill 返回证据、详情和独立观察批次，编排 Skill 检查返回范围和证据边界后入档。
   这属于用户显式启动本编排的流程内调用，不依赖隐式发现，也不自动创建子 Agent。
   检查单项交付是否附固定范围的 inventory 统计、能力清单、代码评价和可借鉴处；抽读子集必须标明，未知数量不填0。
   分析失败记受阻并继续其他条目；来源移除只表示目录缺席，核查当前仓库和采用影响，不物理删除历史。
5. **逐项保存、计划和应用。** 为该项保存证据、完整详情和唯一观察批次。空档案第一次写入用 `init`，
   之后一律用 `update`；这只是底层写入模式，不是两种研究流程。检查计划后应用：
   ```sh
   node .agents/skills/_shared/scripts/plugin-data.mjs plan --mode <init-or-update> --observations data/runs/<round>/observations/<plugin-slug>.json --out /tmp/dsh-plan.json
   node .agents/skills/_shared/scripts/plugin-data.mjs apply --plan /tmp/dsh-plan.json
   node .agents/skills/_shared/scripts/plugin-data.mjs validate --observations data/runs/<round>/observations/<plugin-slug>.json
   npm run research -- checkpoint --session data/runs/<round>/SESSION.json --plugin <plugin_id> --observations data/runs/<round>/observations/<plugin-slug>.json --report data/runs/<round>/insights/<plugin-slug>.md
   npm run research -- publish --session data/runs/<round>/SESSION.json --plugin <plugin_id> --out data/plugins/<plugin-slug>/INSIGHT.md
   npm run research -- manifest --session data/runs/<round>/SESSION.json --out data/manifests/<round>.json
   ```
   checkpoint 核对已应用数据、本轮核查时间、固定源码版本、材料及摘要，成功后才完成该项；publish 只把完成原稿提升为当前读者详情，manifest 在每次阶段交付或收口时更新 Git 内的复现清单。
   若 apply 后中断，先核对 `catalog.runs` 和批次，补做校验与 checkpoint，不重复 apply。
   已完成详情作为不可改写的本轮产物；后续修订使用新材料和新一轮，不静默覆盖检查点文件。
6. **恢复、受阻与收口。** 写入冲突、锁与中断处理见[会话与入档恢复](references/SESSION-OPERATIONS.md)。 每完成一项继续调用 `next`，已完成项被跳过。失败保存错误批次和部分材料，使用
   `block --session ... --plugin ... --reason ...` 登记原因，处理其他项；重试时用 `retry --session ... --plugin ...`。
   来源移除的条目也保留，尝试核查当前仓库及采用影响；无法读到源码时记受阻，不能伪造成功检查点。
   `next` 返回空但 blocked 非零仍未完成；不从“没有待处理项”推断全部成功。
   按[三层输出](references/OUTPUT-STANDARD.md#先分析再归纳与推荐)，先完成详情，
   再归纳分类列表的“用途／亮点／思考／建议”，最后生成推荐页；安装推荐与本周试用候选使用不同证据门槛。
   阶段汇总标注未完成项；会话与原始数据由轮次报告追溯。
   按输出标准维护 PLUGIN-PATHS.json 的稳定路径映射并准备 `data/catalog/PUBLICATION.json`，历史文件保留但不进入README，人工填写有依据的推荐摘要，
   在 capabilities 保存人工确认的正向能力条目与固定版本，未发现／未确认项省略；
   为每个已完成插件在 summaries 填写基于作者固定版本材料的功能简介（不超过80字符）、来源URL和版本，按输出标准生成标题下引用块，
   调用 `npm run capture:meta -- OWNER/REPO --out data/runs/<round>/snapshots/<plugin-slug>/META.json` 保存每个 GitHub 仓库 META，
   对已核实的插件 package.json 名称，在采集命令增加 --npm <exact-package-name>，记录最近30个完整UTC日期的下载数；
   没有确认的npm包时省略，不猜包名，不用0代替失败。
   已建立列表后的日常 META 刷新可直接运行 npm run refresh:meta；它只标记脚本更新，不替代洞察或改写检查点。
   保留轮次 META 快照，并复制为 data/plugins/<plugin-slug>/META.json；发布输入的 metadata 映射引用该当前副本；分类页按输出标准生成名字＋用途目录、META及四标签短评。
   标题、章节与Markdown版式维护 .agents/skills/dsh-plugin-init/assets/templates/publication/*.md，不写死到生成代码；脚本仅处理数据、排序和填充。
   将已审阅的 recommendations、metadata、summaries、capabilities 和 advice 写入 `data/runs/<round>/PUBLICATION-INPUT.json`，
   再用 plan／apply 更新当前发布输入；工具从 manifest 计算本轮范围，精确替换本轮完成项并保留未选项，拒绝未完成对象、版本不一致及没有 host_verified 证据的安装推荐：
   ```sh
   npm run publication -- plan --manifest data/manifests/<round>.json --input data/runs/<round>/PUBLICATION-INPUT.json --out /tmp/dsh-publication-plan.json
   npm run publication -- apply --plan /tmp/dsh-publication-plan.json
   ```
   不创建按轮次硬编码的发布脚本，不在生成代码中保存推荐判断；apply 前检查计划摘要，当前发布输入变化后重新生成计划。
   再执行 `npm run render:research` 生成 README、分类列表及追加Issue活跃度的详情展示页，不能手写 README 或添加工程使用内容。
   本周新增以已核实 npm 包的注册表 time.created 首次发布时间计算，不使用本工程入档时间；已有包发新版不算新增；README按本周新增、最新／最热／推荐、每类最热 5 个插件及更多入口的分类列表、研究出处、末尾更新时间合成；不放历史或过程说明。完成前运行 `npm run check`，
   人工检查叙述、采用判断、引用和本轮覆盖；脚本校验不证明实际业务收益。

本地 runs 只保存研究证据、报告和断点，不复制生成页面；Git 只保存 `data/manifests/`、当前档案和读者成果。清理按[保留规则](references/OUTPUT-STANDARD.md#本地-runs-与-git-清单)使用 `npm run maintain:runs` 先预览，不删除未知材料。

本 Skill 不自动安装第三方插件、安排周期任务、提交、推送或发布。

## 显式调用与职责

仅在用户点名本 Skill 或明确要求执行整轮列表研究时使用，不因提及某个插件就启动。
本 Skill 拥有会话队列、变化标记、plan／apply／checkpoint 与汇总发布；
单插件洞察 Skill 不自行改变队列或当前档案。只研究一个插件时可以单独显式调用洞察 Skill。
