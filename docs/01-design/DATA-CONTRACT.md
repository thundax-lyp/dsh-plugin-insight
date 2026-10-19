# 共享数据契约（版本 1）

字段约束以[档案 Schema](../../schemas/catalog.schema.json)和
[观察批次 Schema](../../schemas/observations.schema.json)为准。JSON 使用 UTF-8，未知字段、
重复键及非法日期均应报错。`data/catalog.json` 保存当前档案和追加的运行历史。
同一插件内的证据与来源快照只追加；内容变化必须使用新 ID。
历史点评与档案版本由版本管理保留。文件位置、交付组合及追溯要求统一遵循
[输出标准](OUTPUT-STANDARD.md)。

## 身份与分类

`id` 格式为 `github:<数字 repository_id>:<component_id>`。GitHub 仓库数字 ID 在改名后保持稳定。
`component_id` 是分配后保持稳定的组件标识；单项目可用 `root`，不要用会变化的路径代替身份。
同仓库的多个子包可分别建档。路径移动保留组件 ID，旧位置记入 `aliases`；身份不明确时先核对。
同一 URL 下重新创建的仓库具有不同数字 ID，应作为不同身份处理。

`entry_type` 区分插件、技能、工具、客户端、基础设施、资料、占位和未知类型。
目录收录不证明可安装。技术主类、业务主类各一个，可有多个标签。
分类枚举见 Schema，含义见[研究规范](RESEARCH-STANDARD.md)；扩展分类时同步更新二者。

## 指纹、来源与证据

`fingerprints` 保存各方面最后一次成功核查的内容版本：`directory`（目录条目）、`code`（代码）、
`release`（发布）、`compatibility`（兼容性）、`maintenance`（维护状态）。使用提交／文件树／文件 SHA
或确定性内容哈希，不要用采集时间充当指纹。批次中省略未检查的方面，更新会保留旧指纹。
发布指纹描述实际发布版本及产物；默认分支代码和发布包分别核查。
兼容性指纹覆盖宿主支持声明，以及实际验证过的精确环境。

`sources` 记录固定来源 URL、版本和采集时间。新快照用新 ID；观察批次只需提交新快照，
或与历史完全相同的来源对象。目录快照可使用 `membership` 表示 present、removed 或 unknown。
按来源 URL 比较最新成功快照：一个目录移除不代表所有目录都已移除。
只有相关来源集合完成检查后才能标记 `removed_from_source`，混合状态通过证据说明。

原始采集结果的路径与命名遵循[输出标准](OUTPUT-STANDARD.md)，由证据的 `artifact` 引用，不保存凭据。
来源采集复用当前环境可用的 GitHub Skill 或插件。
可选的 `capture-github.mjs` 使用已认证的 `gh`，采集仓库元数据、固定提交／文件树、部分根目录文件
及最多 100 个发布记录；它不穷尽插件、不跟踪全部依赖、不执行目标代码。
目录解析、组件匹配及额外文件采集仍需研究流程完成。

证据 `kind` 分别为作者声明、源码核查、本地测试、真实宿主验收和独立反馈；字段值对应
`author_claim`、`source_inspection`、`local_test`、`host_acceptance`、`independent_feedback`。
每项绑定版本，注明边界；执行证据必须提供环境和执行结果文件。
证据 ID 全局唯一，可采用 `<插件ID>:<版本>:<用途>`。

## 结论与关联依赖

每条结论包含主题、正文、证据引用、判断性质、核查时间与依赖。
依赖绑定插件 ID、核查方面及当时指纹。跨插件比较、生态缺口判断必须记录相关插件依赖，
使某插件变化能影响其他档案中的比较结论。

生态供给判断还需跟踪来源总体指纹。可将目录来源作为 `resource` 条目建档，使用该仓库的
数字 ID 和稳定组件 ID，并让生态结论依赖它的 `directory` 指纹。
目录覆盖变化时重新考虑缺口判断，不必伪装成某个插件的代码变化。

`needs_review` 表示依赖变化后需要复核，不表示原结论已经错误。保留原文与证据；复核后显式提交
更新了依赖、证据和 `reviewed_at` 的结论。已过期结论不会因后续检查自动恢复为有效。
`research_depth` 表示提交记录的研究深度：catalog、source、tested、host_verified。
提高深度须有相应证据，但历史执行证据不自动覆盖当前版本。采用建议应同时检查结论状态和证据版本。

## 执行工具与观察批次应用

共享执行脚本统一使用 `.mjs`，依赖和命令入口由根 `package.json` 与锁文件维护。
Node 版本以根 `.node-version` 为准，`engines.node`、本地验证及 CI 必须保持一致；
按用户要求核实 Codex 提供的运行时后更新，不以系统 PATH 中的默认 Node 代替。

观察批次对成功检查的插件提交完整当前元数据，但来源、证据、点评只需提交新增或已复核部分。
`findings: []` 表示保留已有点评。未检查的插件不写入批次。
失败目标写入 `errors`，不要从超时、403、404 或截断结果推断不可用或删除。
目录移除须来自成功且完整的来源比较。保留被移除或归档的条目；当前版本不提供物理删除操作。

`run_id` 标识一次检查。新检查使用新 ID；重复应用同一 ID 会报错且不写入。
`last_checked_at` 仅在插件检查成功后更新。无内容变化时记录运行与检查时间，保留点评。
只有错误的批次只追加失败记录，所有插件档案保持原样。

`plan` 生成候选档案、基础／结果摘要、语义变化与错误列表。
检查计划与文件差异后，`apply` 通过文件锁和原子替换写入。
基础档案变化、计划损坏或结果非法都会被拒绝；应基于最新档案重新生成，不能覆盖并发更新。
锁文件通过独占创建获得，正常结束后移除。发现已有锁时拒绝写入，不自动抢占。
进程崩溃后，先根据锁内 PID、时间及实际进程确认没有活跃写入者，再人工清理锁并重新生成计划。
原子替换要求临时文件与档案位于同一文件系统；跨机器协作遵循根 `AGENTS.md` 的仓库约束。
计划是本地数据，不是可执行脚本。初始化要求空档案；已有基线及后续新增条目都使用更新模式。

## 研究会话与脚本检查点

由列表编排 Skill（dsh-plugin-init）管理首轮、后续整轮和同轮续跑，逐项显式调用单插件洞察 Skill（dsh-plugin-insight）。
两者均设置 allow_implicit_invocation: false；用户可单独唤起洞察，编排启动后也可按明确步骤调用洞察。
列表编排独占队列、变化处理、入档与汇总；洞察仅交付一个组件的材料，不修改档案和会话。独立 Update Skill 已合并。
每轮重新确认来源、生成列表、分析全部条目。变更记录用于追踪，不决定哪些条目可以免于重新分析。
底层 `plugin-data.mjs` 的 `init/update` 仅控制空档案／已有档案写入，继续保留其历史和并发保护。

会话结构由[会话 Schema](../../schemas/research-session.schema.json)约束，
执行入口为 `npm run research --`（`scripts/research-session.mjs`）。输入参考
[合成输入](../../examples/research-input.json)：`id`、`checked_at`、`sources`、`plugins`。
来源记录 `url`、`revision`（未知为 null）、`complete`；complete 表示针对本轮范围完整读取，不等于插件可用。
候选记录稳定 `id`、`repository`、`path`、固定源码 `revision`（未知为 null）、`fingerprints` 和 `source_urls`。
GitHub 采集、身份确认、来源完整性和指纹正确性由研究者核实，脚本不自动推断。

`start` 固定输入，并记录上一轮摘要；新会话 ID 和截止时间必须不同且晚于上一轮。
相同身份标记 moved、content_changed、sources_changed、unchanged 或 unknown，新身份标记 added。
只在上轮相关来源全部在本轮完整检查、且候选缺席时标记 removed_from_source，否则为 unknown。
来源范围不可比时先说明边界，不能把范围缩小算作生态删除。目录移除不删除档案，也不证明仓库无法使用。
每个新会话全部条目从 pending 开始；同轮续跑读取已有文件，不重新执行 start。

`start --limit N` 可限制本轮最大研究插件数，N 必须是正的安全整数；省略时研究全部。
先生成完整列表与变更标记，再按清单顺序选取前 N 项（缺席条目追加在后）。新增、更新、目录移除、未变和未知共用上限，每个 ID 计一次。
会话可选字段 research_limit 与 selected_ids 必须同时存在，固定上限与所选 ID；旧会话省略两字段表示全部。
受阻项占名额，同轮恢复不补位、不重置限额；未选条目保留 pending，但不能 checkpoint、block 或 retry，不能称作已研究。
`next` 仅返回所选范围内第一个 pending 项及 complete／blocked／total 数量，另返回完整列表 listed 和未选 deferred 数量。
`block` 保存受阻原因，`retry` 恢复 pending；原始材料保存在快照和草稿中。
`checkpoint` 必须在观察批次应用后执行，核对运行 ID、当前档案指纹与检查时间、明确提交且重新核查的 findings、
对应固定版本的源码证据、项目内证据／报告路径，然后保存批次与报告摘要，状态改为 complete。
其 fresh 时间检查仅是必要条件，不能代替重新分析和人工语义核查。无固定版本或无源码分析只能保持受阻，
目录级档案可先保存，但不能冒充已完成洞察。保留未受本轮范围覆盖的历史结论，但不据此作本轮推荐。

应用成功但未登记时，核对 `catalog.runs` 后重试 checkpoint，不重复 apply；未应用批次则基于当前档案重新计划。
完成材料摘要不匹配时恢复和 CI 校验报错，不能静默覆盖；新结论使用新一轮和新文件。
会话写入使用独占锁和原子替换，不抢占已有锁；崩溃遗留锁按档案锁相同规则核对进程后人工恢复。
多个研究者共享同一队列时必须外部协调；next 是只读选择，不提供并发任务认领。
脚本不自动执行研究、模型调用或目标代码，也不自动生成点评和推荐。

## 发布输入和生成校验

研究数据和解析产物统一存放于 `data/`：`sessions` 为插件清单与进度，`snapshots` 为原始材料，
`observations` 为逐项观察批次，`reports` 为洞察文档及读者子页面，`publications/current.json` 为当前发布输入。
发布输入结构见[Schema](../../schemas/publication.schema.json)，不修改原 catalog／observations 字段。

生成器 `scripts/render-research.mjs` 从发布输入引用的会话和已完成观察批次读取范围、分类、详情及证据层级，
从检查点详情提取唯一四标签短评，结合人工推荐摘要生成 README 和分类页；历史字段兼容旧输入但不再渲染为README内容。
发布输入只负责选取和组织现有成果，不成为业务事实、证据或研究结论的替代真相源。
`validate:data` 包含生成结果一致性检查；缺页、检查点摘要变化、未完成对象被推荐或无验收证据的安装推荐会报错。

GitHub META 快照由 `schemas/github-meta.schema.json` 约束；发布输入可用 metadata 映射引用。
采集器独立读取仓库元数据与 Issue 搜索计数，部分失败保留 null 和错误，不改变研究深度、版本指纹或已完成检查点。
生成器核对仓库数字 ID 及名称，不能把别的仓库的活跃度贴到当前插件。

## 插件工程统计产物

`plugin-inventory.mjs` 输出版本1统计 JSON，包括 revision／component／coverage、工具版本、内容摘要、
按扩展名和角色分组的文件统计、排除项、Skill入口候选、AST能力候选及解析错误。
CLI包装固定使用锁定的 sloc；AST解析使用锁定 TypeScript。仅统计 md 与 JS／TS 文件，其他文件不计入代码规模。
候选计数不是 catalog 的正式能力字段；confirmed_count 为 null，研究者在详情核查并解释真实定义与有效范围。
已有来源与证据使用新的统计 artifact 引用，不能覆盖检查点已绑定的历史详情或观察批次。

META 可选 npm 对象保存 package_name、downloads_30d（失败为null）、window_start／window_end、source_url、captured_at 和 error。
采集器核对返回包名、窗口及非负整数下载量；不匹配也记为未知。历史无 npm 字段的快照仍有效。

META 的可选 code_update 保存研究基线提交、当前提交、script_changed（三态）、变更路径、核查时间及错误。
它独立于已确认的 findings 依赖失效状态，仅表示待重新分析，不能伪装成已完成新版本研究。
refresh-meta 按 publication.session 的列表操作，成功后切换当前 META 映射，失败项保留带错误的新快照以显示未知，旧快照不删除。

研究发布的 Markdown 版式以 `templates/publication/*.md` 为真相源；块脚本仅传入数据和选择结果。
模板渲染只做严格占位符替换，缺字段失败，不递归解释插入的研究文字；不执行模板表达式或目标代码。

发布输入可引用 catalog 路径，用运行历史中每个稳定插件 ID 的最早 added 时间计算本周新增。
本周按 Asia/Shanghai 的周一至更新时间计算，重复研究不重置；未提供或缺少首次入档记录时不猜测新增时间。
