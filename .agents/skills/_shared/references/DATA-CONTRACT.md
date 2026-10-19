# 研究数据契约

本契约只解释字段语义与数据不变量；版本及结构以对应 Schema 为准：
[档案](../schemas/catalog.schema.json)、[观察批次](../schemas/observations.schema.json)、
[研究会话](../schemas/research-session.schema.json)、[发布输入](../schemas/publication.schema.json)、
[META](../schemas/github-meta.schema.json)。未知字段、重复 JSON 键及非法日期均拒绝。

## 身份与分类

- `id = github:<repository_id>:<component_id>`；仓库数字 ID 与已分配组件 ID 是身份，名称和路径不是。
  改名、路径移动保留身份，旧位置进入 `aliases`；相同 URL 下重建而数字 ID 不同的仓库是另一身份。
- 同仓库不同组件可分别建档；`entry_type` 表示条目类型，技术主类与业务主类各一个，`tags` 可多个。
  分类含义由[研究规范](../../dsh-plugin-insight/references/RESEARCH-STANDARD.md)定义，目录收录不证明可安装。

## 指纹、来源与证据

- `fingerprints` 保存各方面最后一次成功核查的内容版本：`directory` 为目录条目，`code` 为代码，
  `release` 为发布版本及产物，`compatibility` 为支持声明及已验证环境，`maintenance` 为维护状态。
  指纹是固定提交、文件树／文件 SHA 或确定性内容哈希，不能用采集时间代替；未检查的方面省略并保留旧值。
  默认分支与发布包的指纹不可互相冒充。
- `sources` 绑定 URL、`revision` 与 `retrieved_at`；`membership` 表示该来源的 present／removed／unknown。
  来源按 URL 比较最新成功快照，一个来源缺席不代表所有来源均已移除。
- 来源与证据对象只追加；同一 ID 的对象必须完全相同，内容变化使用新 ID。证据 ID 全局唯一，来源 ID 在插件内唯一。
- 证据 `kind` 区分作者声明、源码核查、本地测试、真实宿主验收与独立反馈，均绑定版本并记录边界。
  `artifact` 引用材料；执行证据还必须有 `environment` 与执行结果文件，材料不得保存凭据。
- `research_depth` 的 catalog／source／tested／host_verified 表示已有证据层级；提高层级须有对应证据。
  历史执行证据不自动证明当前版本通过，源码与作者声明不等于运行效果。

## 结论与依赖

- `findings` 保存主题、结论、判断性质、`evidence_ids`、`dependencies`、`reviewed_at` 与状态。
  依赖绑定稳定插件 ID、核查方面及当时指纹，跨插件比较必须记录相关对象的依赖。
- 生态供给结论也依赖来源总体指纹，可将目录作为 `resource` 条目并依赖其 `directory` 指纹；
  目录变化不冒充单个插件代码变化。
- `needs_review` 表示依赖变化后待复核，不表示结论已被证伪；原文和证据保留。
  只有显式更新依赖、证据与复核时间的结论才能恢复有效，普通采集不自动解除失效状态。

## 观察批次与档案合并

- 批次提交成功检查对象的完整当前元数据；来源、证据、结论可只提交新增或复核部分。
  `findings: []` 保留已有结论，不表示删除。未检查对象不写入，失败对象进入 `errors`。
- `run_id` 唯一标识一次检查；同 ID 不得重复应用。`last_checked_at` 只在成功检查后更新，且不得晚于批次 `checked_at`，
  也不得早于档案已有检查时间。纯错误批次只追加失败记录，不改变插件档案。
- 来源移除或仓库归档保留对象与历史；超时、403、404、截断不能推断删除或不可用。
  `init` 仅适用于空档案，`update` 用于已有档案；两者均不物理删除历史条目。
- 写入必须同时满足基础档案摘要、候选结果摘要及结构约束，拒绝过期计划、损坏计划和并发覆盖。
  档案与会话写入采用独占锁和原子替换；已有锁不得被自动抢占。

## 研究会话与脚本检查点

- 会话 `id` 标识一轮研究，`checked_at` 为本轮检查基准时间，`previous_digest` 绑定对照会话。
  新轮次使用新 ID 且时间晚于前轮；同轮续跑保留原会话与完成材料。
- 来源 `complete` 表示本轮范围内完整读取，不表示插件可用；未知来源／代码 `revision` 为 null，不能编造版本。
  候选的 `source_urls` 必须对应会话来源，身份、路径与指纹保持可追溯。
- `changes` 中 added 表示前轮没有该身份；moved、content_changed、sources_changed 分别表示位置、内容指纹和来源变化。
  无变化为 unchanged，不能确认则为 unknown。仅当相关前轮来源均完整核查且候选缺席，才可标记 removed_from_source。
  缩小范围不算生态删除；变化标记可重叠，不能相加为对象总数，也不能据此免除本轮重新分析。
- `research_limit` 与 `selected_ids` 同时存在或同时省略；省略表示全部，有限上限为正的安全整数。
  所选 ID 固定为完整列表顺序的前 N 项，缺席条目追加在后。新增、更新、移除、未变、未知共用额度，每个稳定 ID 计一次。
  受阻项占名额，续跑不补位、不重置；未选项保留 pending，但不接受完成、受阻或重试状态变更。
- 新会话条目从 pending 开始；blocked 带受阻原因，complete 必须带检查点。
  所选范围的 complete／blocked／total 与完整列表 listed、未选 deferred 分开统计，不能把未选条目称作已研究。
- 检查点绑定已应用的观察批次、运行 ID、固定版本与材料摘要；当前档案必须匹配提交的指纹、证据和检查时间。
  本轮结论须显式复核，时间不早于会话基准，并有对应版本源码证据；时间较新本身不证明研究已完成。
  无固定版本或无源码核查不能成为 complete，材料不存在或摘要不符即失效，不得静默覆盖原件。
- 会话完成表示研究材料与入档完成，不表示目标插件验收通过。只读队列选择不提供并发认领语义。

## 发布输入、META 与统计字段

- 发布输入只组织已有成果，不成为研究事实或结论的替代真相源；推荐对象必须为已完成项。
  `metadata` 以稳定插件 ID 关联快照，仓库数字 ID 和名称必须匹配；`history` 兼容旧输入。
  可选 `catalog` 引用已有运行历史，首次 added 时间不因重复研究而重置。
- META 的 `captured_at` 是采集时间，`pushed_at` 是仓库推送时间，两者不能混用。
  缺失／失败值为 null 并保留错误，不用 0 代替未知；GitHub 与 npm 各自时间及窗口独立保留。
- 可选 `npm` 绑定已核实的 `package_name`、下载量、窗口、来源与错误；缺少该对象不等于下载量为零。
  返回包名、窗口与非负整数下载数须匹配，否则记未知；下载量不等于用户数。
- 可选 `code_update` 绑定研究基线、当前提交、变更路径和核查时间；`script_changed` 为 true／false／null 三态。
  它表示待重新洞察的脚本变化，独立于 findings 的依赖失效状态，不改写研究深度或完成检查点。
- 工程统计的 `revision`／`component`／`coverage` 界定版本、组件及完整或抽读范围；工具版本、内容摘要与排除项须保留。
  静态能力候选不是正式能力数，`confirmed_count: null` 表示未确认，不能转成 0；统计材料同样不可覆盖检查点已绑定的原件。
