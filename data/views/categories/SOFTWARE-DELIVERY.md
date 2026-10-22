# 软件交付

[返回首页](../../../README.md)

代码开发、任务编排、调试与交付流程。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@adwmc/helm-d](#plugin-1334304098-packages-helmd) | 为DSH提供安全分析工作台，组织case、参考资料、领域工具输出、证据编号和结论记录。 | 先观察，继续核查宜限透明case模块与离线非敏感样本，人工核对证据语义、执行范围和preset变化；不以提示不拒绝当授权或质量保证。 |
| [@indexyz/dsh-autocompact](#plugin-1324229194-dsh-autocompact) | 为DSH按会话和模型设置提前自动压缩阈值，提供命令、全局默认设置页和状态入口。 | 适合熟悉原生压缩的人先用单会话单route试用，保留原生对照并核对关键约束和总费用；失败警告、摘要丢约束或成本上升时回默认。 |
| [7d-code-reviewer](#plugin-1336021761-root) | 一个注册到 DSH skills 的模板驱动代码审查 Skill，要求模型输出分级问题、评分与文字/HTML 报告。 | 以小范围 diff 试用，人工核行号/复现与 HTML 安全；避免分数代替审查结论。 |
| [agent-clinic](#plugin-1417442557-root) | 读取本地Agent会话与配置，生成带证据定位的诊断报告，并匹配可复核的改进处方。 | 先离线扫描少量会话并回读证据行，确认隐私与指纹保存策略；处方涉及配置修改时先备份并单独验证。 |
| [agent-development-constraints](#plugin-1404700411-root) | 将开发教训整理为项目约束库，提供提炼、精简流程及DSH约束提示和查询工具。 | 适合有重复事故且愿意维护规则检查的团队先选少量规则试用。 |
| [ai-look-up](#plugin-1401618027-root) | 监测重复命令、连续失败与目标漂移，向会话注入复盘提示并可调用审查模型。 | 先在非关键任务关闭第三通道，观察重复调用提醒的误报和冷却，再决定是否为审查增加预算。 |
| [Crossfire 针锋](#plugin-1399279897-root) | 在 DSH 对定稿成果组织只读红队评审，并由用户逐条认定或驳回缺陷。 | 有具体定稿要验的人先选少量维度；核对每条证据，保留驳回理由与成果版本，再决定复审，不把认定数当客观质量。 |
| [dock-base](#plugin-1340492184-root) | 为DSH web提供统一布局、视图实例、命令和设置注册服务，供功能插件按需组合。 | 有多视图组合需求可试用，先核对上下文与异步关闭；逐个研究功能插件而非默认全装。 |
| [dock-editor](#plugin-1340492335-root) | 为 dock 文件域增加同工作台的文本查看、编辑、保存与关闭提醒。 | 可对非关键小文本进行受控试用，保存后回读目标并留版本库或备份；对并发编辑和重要配置沿用有冲突检测的工具。 |
| [dock-files](#plugin-1340492214-root) | 为Dock提供文件树、viewer分派、文件变更与上传下载通道。 | 先用隔离工作区核对根目录与删除/传输行为，再接入重要文件。 |
| [dock-git](#plugin-1340492447-root) | 在 DSH Dock 中查看 Git 提交图与差异，并对会话仓库执行暂存、提交、分支和远端操作。 | 建议观察，先在隔离仓库核对钩子策略、破坏操作确认和远端失败恢复；团队质量门禁另作明确安排。 |
| [DSH Harness Switch](#plugin-1414577411-root) | 在 DSH 原生会话中切换原生适配与嵌入式 Kimi Code 执行核心。 | 明确需要Kimi内核且能核权限差异的开发者可评估；不能把DSH allowlist当对全部内部工具的第二道检查。 |
| [dsh-a11y-scan](#plugin-1344715270-root) | 调用axe扫描本地HTML、构建页面或显式确认的URL，输出无障碍问题与多格式报告。 | 适合已有axe后端的前端团队在本地构建产物先试用。 |
| [dsh-agentdebugx](#plugin-1296792947-integrations-dsh-agentdebugx) | 连接 DSH 会话与 AgentDebugX，支持保存会话发现、当前或历史轨迹诊断和本地查看。 | 建议观察，先修明物理路径与取消契约，缩窄历史root，之后再考虑不敏感当前工作区轨迹；同模型自诊断不作为独立效果证明。 |
| [dsh-ai-armor](#plugin-1425045401-root) | 聚合 Git 排错、堆栈解码、配置检查、Shell 调用与 SQL 静态审计工具。 | 可按具体只读诊断工具需求评估；二分执行与静态扫描需分别授权和隔离，不能因本地工具或零依赖而当作无副作用。 |
| [dsh-anet](#plugin-1302597978-deploy-plugins-dist-dsh) | 将DSH接入本地anet节点，装配stdio MCP和委派、设置、状态三Skill，以统一执行路径/身份发现和跟踪跨智能体任务。 | 有条件试用，明确跨节点需求并能管理身份/daemon/hub/支出者先核实际节点和对端；普通本地任务不必增加复杂度。 |
| [dsh-asciinema](#plugin-1344714509-root) | 录制DSH工具输出为带时间轴的数据文件，提供文本提取和自包含离线HTML回放。 | 适合记录普通非敏感工具文本供本插件回放。 |
| [dsh-better-sidebar-N23](#plugin-1352600211-root) | 提供文件编辑预览、Git、终端和可扩展页签的会话工作台。 | 先在匹配宿主和隔离项目核实际lib、文件写权限与PTY清理；别仅用较新的src安全修复判断运行版本。 |
| [dsh-cache-bricks](#plugin-1386463441-root) | 可视化 DSH 模型请求、缓存命中率、活动与历史请求对比。 | 适合有明确缓存排查问题的用户试用，先核对provider usage口径与采集完整度，不据颜色直接删工具或归责某个提示改动。 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz) | 在 DSH 中把 CapMap 文档渲染为语义图谱、能力面板和状态看板。 | 适合已有CapMap规范的团队先在工作区副本浏览；核对看板关联与原文，初始化会写文档并安装Skill，先审阅预期文件，不能用状态标签代替验收证据。 |
| [dsh-codex-guard](#plugin-1340906871-dsh) | DSH 单工具包装 codex-guard CLI，执行提交前本地 diff hygiene 扫描。 | 作为提交前提示使用，始终看扫描覆盖和命令状态；CI 保护单独配置。 |
| [dsh-dep-vuln-scan](#plugin-1344714002-root) | 读取依赖锁文件并查询 OSV，生成漏洞、严重度和修复建议报告。 | 适合已知锁文件的初筛；检查跳过/错误及实际包清单，修复前核公告维护线并做项目回归，别直接执行生成命令。 |
| [dsh-diff-approval](#plugin-1335980444-root) | 在DSH web集中审阅工具写入与VCS本地变更，提供文件/块级保留、回退及评论。 | 单人可备份工作树可试用事后审阅；先核对普通回退冲突及数据留存，保留版本控制与备份。 |
| [dsh-domain-bridge](#plugin-1424063534-plugins-dsh-domain-bridge) | 为 DSH 顶层会话提供域寻址、职责交接、分级暂停和模型选择。 | 确有顶层会话分工时可评估；先明确谁负责确认任务接受与完成，不能仅凭delivered回执或暂停标记承担业务验收与系统禁用保证。 |
| [dsh-engineering-workflow](#plugin-1335988605-root) | 可选工程 preset 与六个方法 Skill，以五阶段文字门禁引导 DSH Agent；Host 自动同步本地预设并公告。 | 备份 DSH_HOME/.agent-presets/engineering-workflow，再在新会话选择 preset 做对照试验；详见[Q02](#research-q02)、[Q03](#research-q03)。 |
| [dsh-folderwatch](#plugin-1423215448-root) | 监测目录快照差异，把外部文件变化批量排队或唤醒原会话处理。 | 先以 queue 模式监听小目录，统计漏报、重复和自身写入抑制，再开放自动唤醒。 |
| [dsh-github-router](#plugin-1339462797-root) | 提供PR、Issue、文件及API只读工具，通过API、gh、Git、HTML与可选镜像在宿主内降级取数。 | 先观察；公共仓库单用户隔离环境可对照，私有多身份/共享存储先解决缓存与授权边界。 |
| [dsh-hdc-bridge](#plugin-1333258432-root) | 为 DSH 集成鸿蒙设备调试、截图/UI操作、官方知识查询及可选 DevEco 构建签名流程。 | 建议观察，先核对core作用域和面板权限；显式target与工程、使用无真实数据设备，确认状态绑定后再决定受控试用。 |
| [dsh-jev-guard](#plugin-1378138611-root) | 在 DSH 命令执行前结合静态规则与 Jev 判定，返回放行、改写、拒绝或人工升级。 | 作为已有沙箱和审批的补充先在隔离项目试；检查实际覆盖的工具、网络故障和降级提示，核对脚本变更后是否重新判断，不把allow当无风险。 |
| [dsh-leak-guard](#plugin-1422091204-root) | 在 DSH 通过本地规则扫描指定文件或目录中的凭据，并返回脱敏发现。 | 适合发布前补查明显秘密；显式传项目路径，查看所有跳过项，再检查真实打包文件与Git历史，别把ok当无泄露保证。 |
| [dsh-ledger-memory](#plugin-1412857520-root) | 为 DSH 项目维护台账、活动日志、上下文压缩与跨会话交接。 | 适合频繁压缩和接班的长期项目；先在可恢复项目副本上验证一轮压缩后的约束和原文回读，再决定是否让它维护正式台账。 |
| [dsh-lighthouse](#plugin-1422364992-root) | 汇总本地作品、GitHub、npm 与 DSH 市场状态，提供工具、面板和报告卡片。 | 维护多个作品的人可先录入少量明确身份条目；核对npm包、市场项和PR来源，再用异常排序安排人工检查，不以下载/星数认定真实采用。 |
| [dsh-local-memory](#plugin-1390103795-root) | 聚合Hindsight项目记忆库，发现缺失记忆项目并调用上游引擎播种。 | 只在已隔离配置的Hindsight上试；先检查同名项目库归属和跨库结果授权，别把“本地daemon”当完全离线。 |
| [dsh-lsp-cpp](#plugin-1344713526-dsh-lsp-cpp) | 为DSH配置clangd的C/C++语言服务路由和文件扩展映射。 | 已有clangd项目可先试。 |
| [dsh-lsp-csharp](#plugin-1344713526-dsh-lsp-csharp) | C# LSP 配置包，将 .cs 文件路由给外部 OmniSharp stdio 服务器和 DSH 共享 LSP 基座。 | 确认安装形态：若仅有 OmniSharp.dll，配置 command=dotnet 和 DLL 绝对路径；在真实 .sln/.csproj 测四操作。 |
| [dsh-lsp-go](#plugin-1344713526-dsh-lsp-go) | 以 gopls 为外部服务器的 Go LSP 配置包，复用 DSH 共享 LSP 基座。 | 先安装/验证 gopls，挂共享基座，再以真实 go.mod 项目试定义、引用、实现、hover；详见[Q03](#research-q03)。 |
| [dsh-lsp-java](#plugin-1344713526-dsh-lsp-java) | 在 DSH 中为 .java 文件配置 Eclipse JDT 语言服务导航。 | 已有 Java 环境者可对小项目试用，等索引完成并核对四项结果；若主要在成熟 IDE 中工作或无法维护独立 workspace，暂不增加此依赖。 |
| [dsh-lsp-kotlin](#plugin-1344713526-dsh-lsp-kotlin) | 为 DSH 接入 Kotlin 语言服务，配置 .kt/.kts 导航路由及外部 kotlin-language-server 启动参数。 | 建议观察，先核对包可取得性、宿主版本与外部 server，再在小 Kotlin/Gradle 工程分别验 .kt 和 .kts，避免仅按包加载判断成功。 |
| [dsh-lsp-lua](#plugin-1344713526-dsh-lsp-lua) | 为DSH配置LuaLS的Lua代码导航路由。 | 单文件Lua可先试；有宿主全局或第三方库时先核configuration，再测实际符号。 |
| [dsh-lsp-php](#plugin-1344713526-dsh-lsp-php) | 为DSH配置Intelephense或自定义PHP语言服务路由。 | 先选清楚默认服务或phpactor，再逐项测需要的导航动作；别从统一工具名推断高级功能免费可用。 |
| [dsh-lsp-pyright](#plugin-1344713526-dsh-lsp-pyright) | 为DSH配置Pyright的Python与存根文件导航路由。 | 先在小Python项目试，再核venv和.pyi优先关系；单文档hover通过不等于全项目类型信息正确。 |
| [dsh-lsp-ruby](#plugin-1344713526-dsh-lsp-ruby) | 为DSH配置ruby-lsp的Ruby代码导航路由。 | 先核当前Ruby与Gemfile，再选择全局或bundle启动并测跨文件；单文件模式结果不要外推完整项目。 |
| [dsh-lsp-rust](#plugin-1344713526-dsh-lsp-rust) | 为DSH配置rust-analyzer的Rust代码导航路由。 | 先核rustup组件与Cargo工程，再用真实trait和跨crate符号试；不要只看可执行路径。 |
| [dsh-lsp-swift](#plugin-1344713526-dsh-lsp-swift) | 为DSH配置SourceKit-LSP的Swift代码导航路由。 | 先确认所选工具链并构建测试工程，再分别检查四操作；尤其看引用/实现是否被跳过。 |
| [dsh-lsp-ts](#plugin-1344713526-dsh-lsp-ts) | 为DSH配置TypeScript/JavaScript语言服务及四类文件映射。 | 先在真实tsconfig项目核普通与React文件；需要新模块扩展时显式配置并测试失败回退，别只跑单文件样例。 |
| [dsh-mermaid](#plugin-1334569498-root) | 在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。 | 适合经常看Mermaid图的人先用小图试用，保留strict和合理限制，报错先复制后决定是否发AI；卡顿、异常交互或草稿覆盖就停相关路径。 |
| [dsh-model-everything](#plugin-1423488109-root) | 提供建模技能和确定性模型审查工具，检查状态机、结构、数据及报告对照。 | 适合有明确不变式和建模能力的团队；先用已知缺陷校准模型忠实度，读verdict及跳过/截断，不把报告ok当源码正确。 |
| [dsh-modernize-code](#plugin-1344714334-root) | 提供遗留代码预检、静态热区评估和分阶段迁移规划技能及Python工具。 | 适合先生成迁移评估材料。 |
| [dsh-multi-folder](#plugin-1334119885-root) | 为DSH项目配置副工作目录，保持主cwd并将原文件和shell工具按单次目标重定根，附UI与@发现。 | 观察，继续从无碰撞稳定身份、store不落Agent写根及明确UI能力约束着手。 |
| [dsh-mysql](#plugin-1337916824-root) | 在DSH设置管理多套MySQL连接，会话选择目标数据源，模型可查看表结构、查询，并在独立授权后执行行写与DDL。 | 先观察。 |
| [dsh-openai-oauth](#plugin-1335992154-root) | 为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。 | 可试用为本机独立模型provider，保护明文凭据与真实工具审批，保留替代路由；不外推远程部署/静态模型全部可用/免费。 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。 |
| [dsh-plugin-focus](#plugin-1336084195-root) | 将任务目标、约束与决策保存为工作区焦点板，并注入会话及展示面板。 | 适合单任务工作区先试。 |
| [dsh-plugin-gate](#plugin-1336663986-root) | 向 DSH Agent 提供插件源码静态扫描、风险差分/报告及破坏性操作建议工具，以 systemPrompt 提醒调用。 | 只在明确源码版本上扫描，逐项审阅 hits、notes 和 filesScanned；对高权限插件增加人工/沙箱审查。 |
| [dsh-plugin-orchd](#plugin-1422240642-root) | 在DSH右侧栏只读展示当前项目的orchd任务、依赖图、想法和审查时间线。 | 适合已有orchd项目先在副本试用。 |
| [dsh-pr-description](#plugin-1344714177-root) | 分析分支差异并生成PR标题和Markdown描述，可选确认及调用gh创建PR。 | 适合先生成本地草稿。 |
| [dsh-progress-viz (plugin)](#plugin-1334481905-plugin) | 把 DSH 语义会话事件即时投影成进度 JSON，供独立 Python 看板读取。 | 先把 JSON 当辅助状态并对照会话真相，修复/规避空闲恢复和估价问题后再作为运行监控依据。 |
| [dsh-project-memory](#plugin-1339316901-root) | 为DSH索引项目文档和代码符号，分层召回带来源的内容，保存任务与经验，并按动作和查询门控注入相关记忆。 | 有条件试用。 |
| [dsh-python-env](#plugin-1335843541-root) | 为 DSH 提供 Python 虚拟环境发现、创建、装包、卸包与删除工具，并支持镜像和代理重试。 | 先观察，暂不直接给日常profile启用。 |
| [dsh-qa-suite-N23](#plugin-1353726715-root) | 组合后台TypeScript诊断工具与提示驱动的本地多镜头代码审查命令。 | 先核多项目下诊断归属；审查命令是提示流程，重要问题须代码复现，置信度不是准确率。 |
| [dsh-reaper](#plugin-1423215373-root) | 盘点端口占用与进程归属，先预览再按显式参数清理可归属的进程树。 | 先仅用扫描与预览，对照系统工具确认归属；实际清理只在可丢弃开发进程上验收。 |
| [dsh-repeat-stop](#plugin-1339262076-root) | 在 DSH 中按 Agent 拦截超过阈值的连续同工具同参数调用，支持过滤与用户消息重置。 | 建议观察。 |
| [dsh-session-diff](#plugin-1372976273-root) | 在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。 | 适合快速检查当前会话的常规write/edit；跨会话、shell改动和大文件仍用Git或专门差异工具复核。 |
| [dsh-sidebar-git-graph](#plugin-1393980674-root) | 在DSH右侧栏显示当前会话仓库的分支提交图、工作树和暂存区差异。 | 适合会话内只读查看Git。 |
| [dsh-skill-7d-git-commit](#plugin-1336870027-root) | 为DSH注册7DGroup提交规范Skill，在生成提交信息前引导校验中文标签与格式。 | 仅对采用此中文提交规范的团队有直接价值。 |
| [dsh-skill-creator](#plugin-1344713683-root) | 为 DSH 创建、校验、打包 Skill，并提出或写入 description 改写。 | Skill作者先生成草稿和包；保留原description，以真实正负用例确认后再commit，中文需求别依赖保词判定。 |
| [dsh-slipway](#plugin-1422359117-root) | 将本地 DSH 插件文件发布到 GitHub，建立市场收录 PR 并回拉校验字节。 | 插件作者先在工程副本演算并人工看完整文件清单；确认目标账号和发布范围，再在临时仓库验收部分失败恢复，正式发布后仍要测试安装。 |
| [dsh-snapshot-manager](#plugin-1412896722-root) | 在DSH轮次边界保存增量文件快照，支持恢复文件并分叉到对应对话切点重新开始。 | 先在可丢弃项目测试快照和dryRun。 |
| [dsh-spring-admin-kit](#plugin-1412897663-root) | 为Spring Boot、MyBatis Plus、Thymeleaf和LayUI后台开发注册Excel导入导出及模板规则Skill。 | 适合相同技术栈先在小功能试用。 |
| [dsh-subagent](#plugin-1425006726-root) | 把 Qoder、OpenCode、Pi、CodeBuddy 等 CLI 接到 DSH 子代理。 | 已有对应CLI且可隔离工作目录者可评估；不可重复写入任务应先解决回退幂等、全程超时和进程树取消，不能因preset叫“自由”而放宽验收。 |
| [dsh-subagent-role-router](#plugin-1421306160-root) | 按角色为子代理分配模型候补池，提供故障切换、路由可见性及fork窗口裁剪。 | 多模型子代理场景可先在隔离任务试。 |
| [dsh-taskswarm](#plugin-1333800488-root) | 为DSH按任务包依赖分波并行调度worker，以Git worktree、检查点、状态/邮箱和review/merge流程集成代码产出。 | 先观察，不将默认自主流程视可靠接受门；可丢弃仓库研究需独立强制CI/人工SHA验收及权限/预算/网络控制。 |
| [dsh-tech-lead（旧组件）](#plugin-1345209661-packages-dsh-tech-lead) | 为 DSH 提供只读工程治理工具，检查任务分级、计划、证据、门禁、上下文及变更预览。 | 新采用者先核对根项目推荐的dsh-themis迁移路线，不优先安装这个旧组件；已有使用者可把它作为输入一致性检查，并保留真实测试和人工评审，先验证旧协议返回与现有调用方兼容。 |
| [dsh-token-billing](#plugin-1335139860-root) | 在DSH会话中显示实时token费用，结合路由价目与政策时间线，保存跨会话账本并提供统计、余额及CSV/JSON导出。 | 先观察。 |
| [dsh-tool-budget](#plugin-1350325873-root) | 按运行中的Agent限制工具调用总次数，支持包含与排除规则并在超额时拦截。 | 先按一类任务观察正常调用分布，再设阈值；长后台任务查询可排除，但排除列表应保持有限。 |
| [dsh-trellis](#plugin-1335559646-root) | 为DSH提供功能、缺陷和重构三轨任务产物、步骤状态、会话恢复提示及Web看板。 | 可试用为人工复核开发任务辅助，先备份同名Skill并核自动覆盖；独立保存批准/验证与固定代码版本，不以标签或只读过滤代授权。 |
| [dsh-undo-plugin](#plugin-1338526178-packages-bundle-rollback) | 为DSH组合会话回退、私有Git文件快照、归档管理和回退界面。 | 观察，备份且独占的本地Git文件任务可继续探讨，勿将聊天消失当所有副作用撤销。 |
| [dsh-update-checker](#plugin-1334836615-root) | 在DSH GUI检查主程序和第三方插件版本，提供备份更新回退与Web重启流程，Desktop主程序转原生更新。 | 当前不推荐日常安装，先修拒绝零副作用与阶段回执，再核隔离恢复；不在用户部署运行复现。 |
| [dsh-vercel](#plugin-1425044910-root) | 将Vercel官方MCP接入DSH，提供OAuth、按Agent限额加载工具及结果检索与管理界面。 | 适合已有Vercel账户者从只读项目查询核查。 |
| [dsh-verification-receipt](#plugin-1333370288-root) | 被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。 | 有条件试用，精确支持宿主+私有一进程一文件，将其当启发式观察摘要，不作验证通过/防篡改审计。 |
| [dsh-verify](#plugin-1335843750-root) | 执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。 | 建议可信本地有限spec试用，故意缺陷应失败、合法实现应通过；空覆盖、新基线和ERROR不放行，host阻塞或范围不清时停止。 |
| [dsh-which](#plugin-1423215529-root) | 解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。 | 先只查询并对照当前 shell 的解析结果，必要时对可信二进制启用版本探测。 |
| [dsh-workflow-templates](#plugin-1344715132-root) | 为 DSH 提供 Workflow 模板检索、静态校验和官方工具调用起点。 | 只有明确要workflow时再选模板；先看完整脚本和参数，检查官方工具可见与阶段输出，再在隔离任务试。 |
| [dsh-worktable（01_content）](#plugin-1336092482-01-content) | 在侧栏提供项目抽屉、分栏窗格、会话绑定与项目产物挂载。 | 先用隔离项目验证绑定、结果归属、关闭撤销和终端；本地文件和完整Shell权限须与使用环境匹配。 |
| [dsh-wrapup-guard](#plugin-841979943-root) | 提供任务收尾工具，运行项目检查并记录连续三轮无问题的检查状态。 | 可把它当收尾提醒与日志工具。 |
| [dsh-wsl-compose](#plugin-1381842592-root) | 封装Docker Compose状态、容器列表和日志，并可在配置允许及参数确认后执行up或down。 | 先仅开放ps/logs并配置明确根目录，在测试项目验证路径；需要up/down时先人工审阅Compose文件并保留运行状态。 |
| [dsh-wsl-cred](#plugin-1350379113-root) | 读取Git凭据助手与远端类型，给出WSL使用Windows Git Credential Manager的排障提示。 | 先确认工具工作目录和远端协议，只读查看配置后再人工修改；不要为了验证把token贴进会话。 |
| [dsh-wsl-db](#plugin-1381859591-root) | 通过psql和redis-cli执行受限查询与连通探针，支持配置连接别名和Redis主机范围。 | 先使用数据库端只读角色和测试库，限制主机与别名，避免在大Redis执行KEYS；敏感查询结果谨慎进入模型上下文。 |
| [dsh-wsl-editor](#plugin-1351854212-root) | 把WSL文件路径转换为Windows路径，在Cursor、VS Code或记事本中打开并可定位行列。 | 适合Windows+WSL开发，先测试当前发行版路径、中文空格和行号；自动回退后人工确认文件与定位。 |
| [dsh-wsl-git](#plugin-1381833309-root) | 提供有输出上限的Git状态、提交日志和差异统计查询。 | 先配置允许的仓库目录，拿包含未跟踪文件的工作区核对计数，不用摘要代替差异审阅。 |
| [dsh-wsl-github](#plugin-1350544211-root) | 通过GitHub App或Token查询仓库PR与Actions状态，并提供认证配置诊断。 | 用单个测试仓库配置只读权限，核对返回运行属于哪个提交；不要把仓库最新CI当作当前PR检查。 |
| [dsh-wsl-glab](#plugin-1381859919-root) | 封装glab，查询GitLab合并请求、Issue与流水线状态。 | 先明确目标仓库和GitLab主机，对照一个已知MR核验字段，不把限量列表当全量。 |
| [dsh-wsl-helm](#plugin-1381843528-root) | 在DSH内查询Helm发布列表、状态和历史，限制命令与输出范围。 | 先明确context，不依赖默认集群；只读查询也可能返回敏感配置，限制账号权限。 |
| [dsh-wsl-k8s](#plugin-1381726881-root) | 提供受限的kubectl查询工具，读取集群资源、描述与截断日志。 | 明确context和namespace，用只读账号测试；先核对省略context时的实际目标。 |
| [dsh-wsl-net](#plugin-1338965593-root) | 诊断WSL与DSH代理环境、代理TCP端口及HTTP可达性，并生成修复提示和可选子进程代理注入。 | 个人维护环境先禁用注入，有凭据环境先清理报告；不自动执行fix，不把HTTP ok当业务成功。 |
| [dsh-wsl-pkg](#plugin-1381861315-root) | 汇总npm、pip与cargo依赖信息，提供npm过期版本检查入口。 | 先限定allowRoots并核对Python环境；cargo入口须先验证参数，不能把ok当依赖无问题。 |
| [dsh-wsl-search](#plugin-1381725987-root) | 在允许目录内用ripgrep、fd和ast-grep搜索文本、文件名与代码结构。 | 显式设定项目根而非整个home，以已知命中验证工具身份和结果截断。 |
| [dsh-wsl-ssh-agent](#plugin-1351854356-root) | 诊断WSL的SSH代理环境、已加载密钥数量与Windows代理桥接条件。 | 把live socket当启发式提示，失败时查看sshAddDetail；不要在聊天中复制私钥。 |
| [dsh-wsl-tmux](#plugin-1381833652-root) | 在 DSH 中列出 tmux 会话并读取 pane 输出。 | 适合单 pane 的长任务观察；多窗口先人工确认目标，关键完成状态应另查产物或退出码，不能只凭终端尾部。 |
| [dsh-wsl-workspace](#plugin-1334205011-root) | 从DSH界面添加WSL工作区，将会话命令、文件工具和模式接到选定发行版，并提供交互终端与作业接线。 | 先观察。 |
| [dsh-wsl-workspace](#plugin-1351853812-root) | 列出 WSL 发行版并检查 Linux 工作区路径与 /mnt 放置情况。 | 适合首次选工作区时快速排查；符号链接或特殊挂载需手动核对真实路径和文件系统，迁移仓库前另行备份与确认。 |
| [dsh-zero-residence](#plugin-1366089972-workspace-plugins-dsh-zero-residence) | 把长会话内容压缩为可回查指针，提供账本、召回、强制压缩和异步命令入口。 | 先在可恢复会话副本试压缩，验证关键证据能原样回查；异步命令只用于允许的测试任务，并确认宿主权限与取消边界。 |
| [embedded-workbench](#plugin-1276714299-root) | 为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。 | 先验证安装与注入，再以专家任务检行为；保留关闭门禁开关并单独考察 Skill 效果。 |
| [ETeams](#plugin-1372993989-root) | 为 DeepSeek Harness 提供领队拆解、成员子会话接力和任务看板。 | 适合可拆分且验收条件清晰的任务；先用无外部副作用的任务验证重启、唤醒失败和重复汇报处理，再评估长期使用。 |
| [harness-github](#plugin-1343702731-root) | 为DSH提供GitHub仓库、PR、issue、CI与评审工具，通过gh或REST读取和操作，并提供工作流指引。 | 先观察，暂不依赖当前审批边界做日常写操作。 |
| [IDE Hub](#plugin-1397817235-root) | 汇总多种编码工具的本地会话、用量与规则，并提供项目规则统一分发入口。 | 先只盘点两个实际使用的 IDE，再对一个测试项目 dry-run 规则分发并检查差异。 |
| [logicprobe](#plugin-1331586818-root) | 以八个工具和 Skill 对状态机、数据模型、UML/依赖图与报告差异做模型级核验。 | 适合能提供可靠模型与人工复核的设计评审；先核转换表、verdict 和截断，再对照源码；详见[Q02](#research-q02)、[Q03](#research-q03)。 |
| [model-usage-plugin](#plugin-1334569518-root) | 在DSH Web设置中展示模型token、估算费用、工具指标、使用趋势与DeepSeek账户余额，并从会话日志补充历史日账。 | 先观察。 |
| [oh-my-dsh](#plugin-1379204512-root) | 为 DSH 提供角色、Skill 与多智能体协调协议，支持自动推进和显式团队流程。 | 先验装探测与取消，再对单仓库小任务比较原生单 agent 和一条显式 team 流程。 |
| [Plan Lattice](#plugin-1334504487-root) | 在 DSH 历史替换后恢复原生任务依据，并可显式启用完整执行门禁。 | 先用作者公开稳定包/候选在相同 DSH 版本隔离试点，重点比较替换后权威保真和门禁对合法写入的影响；无需把 rc.8 或机制比例当生产收益，详见[Q03](#research-q03)。 |
| [SSH 只读日志工具](#plugin-1346017360-root) | 通过预配置 SSH 别名读取或搜索有界远端日志，作为 MCP 工具接入 DSH。 | 适合已建立只读SSH权限的团队先用测试服务器验证；根目录不能单靠字符串约束当隔离，生产环境以服务端账号权限兜底。 |
| [Task Forge](#plugin-1399011094-root) | 把需求整理成版本化任务书，通过交接包和回读握手管理跨窗口协作。 | 先用一个有明确验收点的小任务试交接，人工比对遗漏和改版后的接收方状态。 |
| [任务监控与 Git 操作面板](#plugin-1406156934-dsh-task-monitor) | 在 DSH 右侧汇总任务活动，并提供 Git 提交、推送与 GitHub 发布入口。 | 仅在读懂当前Git/GitHub写副作用后于临时仓库验证；把监控活动当辅助线索，提交推送仍须核对差异、目标分支和结果。 |

<a id="plugin-1334304098-packages-helmd"></a>

## [@adwmc/helm-d](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md)

[![GitHub ★ 380](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=380&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)

> **用途**：供有授权分析任务的人保存样本、工具输出和结论，合格交付需证据语义与推理可复核。

> **亮点**：统一case目录、样本哈希、自动输出存档和结论编号，较散放脚本输出更便于追溯；这是记录组织增量，不能把编号存在当结论正确。详见[Q02](#research-q02)。

> **思考**：空evidence_ids仍可通过，存在编号也不证明语义支持；并发首次编号、三位解析、全局身份回退和soft gate限制完整追溯，封装persona增加审查负担。均为静态核查未复现。详见[Q03](#research-q03)。

> **建议**：可探讨语义证据审计门槛，区分引用存在、原文完整和主张支持，比较空/无关/截断引用的错误接受率；新增复核成本，未验证。详见[Q06](#research-q06)。

<a id="plugin-1324229194-dsh-autocompact"></a>

## [@indexyz/dsh-autocompact](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 735](https://img.shields.io/static/v1?label=npm+30d&message=735&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)

> **用途**：给需要按模型控制长会话压缩时机的开发者提供阈值入口，交付需核对实际摘要与任务约束而非仅设置成功。

> **亮点**：在不改真实模型窗口前提下加入会话/route/deployment三级阈值，配命令和设置，复用原生压缩并保护tail与配对；属于pi-autocompact的DSH适配，不把上游摘要算原创。详见[Q02](#research-q02)。

> **思考**：阈值只触发尝试而非硬上限，缺backend/容量、不可拆范围或失败会跳过并继续；更早压缩也可能增加摘要成本和语义丢失，未有同任务效果对照。详见[Q02](#research-q02)。

> **建议**：可探讨质量反馈阈值实验，绑定阈值、压缩成本与任务约束比较原生/多个提前值，检验净收益而非追求更低占用；额外检查有成本，未验证。详见[Q05](#research-q05)。

<a id="plugin-1336021761-root"></a>

## [7d-code-reviewer](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer)

> **用途**：团队希望用统一结构辅助审阅代码改动和整理可读报告。

> **亮点**：封装五步审查、严重度/四维评分和报告样式，使输出结构一致。详见[Q01](#research-q01)。

> **思考**：没有确定性报告渲染器，动态 HTML 转义/占位符完整性只是 Skill 文本要求；评分无校准。详见[Q02](#research-q02)。

> **建议**：加入安全模板渲染与残留占位检查，并用已标注缺陷集校准严重度/分数，可提高可复核性；待验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="plugin-1417442557-root"></a>

## [agent-clinic](../../plugins/1687210989--agent-clinic/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1687210989/agent-clinic) [![npm 30d 95](https://img.shields.io/static/v1?label=npm+30d&message=95&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/agent-clinic) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/agent-clinic)

> **用途**：用户感觉Agent循环、上下文浪费或失忆，希望从实际日志定位问题，合格结果是能回查的证据和适用建议。

> **亮点**：adapters/dsh.mjs解析事件并保留行定位，report和prescriber生成诊断与配置建议，跨会话比较用本地加盐指纹；插件与CLI共用分析核心。

> **思考**：证据定位与撤回不适用处方比只报数字更利于行动；插件目录匹配依据不能证明被推荐插件安全或有效。

> **建议**：先离线扫描少量会话并回读证据行，确认隐私与指纹保存策略；处方涉及配置修改时先备份并单独验证。

<a id="plugin-1404700411-root"></a>

## [agent-development-constraints](../../plugins/962599627--agent-development-constraints/INSIGHT.md)



> **用途**：反复遇到同类开发错误的团队希望将事故记录转成有触发、检查和证据的规则；合格结果是同类错误减少且规则维护负担可控。

> **亮点**：相对无限增长开发日志，增量是用规则/触发/检查/证据四字段加精简流程组织经验，再用宿主上下文接线提醒模型。所谓self-evolving实际依赖人或Agent执行提炼，不是自动证明规则有效或全规则强制执行。

> **思考**：“记录→规则→enforcement”闭环是否完整？通用约束主要是上下文注入，不能阻止违规则代码；确定性hook只覆盖脱敏规则。index顶部只读/无写注释与writeProbe和配置文件写入不一致，说明治理材料也需核查当前实现。无证据证明15条阈值或固定token节省普适。

> **建议**：由规则已有检查字段推导，可为每条规则绑定可执行检查与触发覆盖计数，按误报/漏报决定保留、降级或删除，提示仅承担解释。未验证假设是减少规则膨胀且提高实际拦截。以历史已知事故和新任务回放比较纯提示与检查绑定，若重复错误/维护时间不改善则否定。

<a id="plugin-1401618027-root"></a>

## [ai-look-up](../../plugins/1344738825--ai-look-up/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1344738825/ai-look-up)

> **用途**：长任务中Agent反复失败却继续调用工具，用户希望尽早提示停下来检查方向；成功标准应是减少无效尝试。

> **亮点**：index.js 监听会话事件，按spec.json阈值与冷却判定触发；可用宿主模型生成复盘建议，失败退回静态清单，另支持外部watcher通道。

> **思考**：将行为信号转为可见提醒比静默循环更可控；提醒不是强制停止，错误诊断也可能把正常重试打断。

> **建议**：先在非关键任务关闭第三通道，观察重复调用提醒的误报和冷却，再决定是否为审查增加预算。

<a id="plugin-1399279897-root"></a>

## [Crossfire 针锋](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire) [![npm 30d 669](https://img.shields.io/static/v1?label=npm+30d&message=669&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire)

> **用途**：方案或代码已有定稿，需要不同维度挑错，交付候选缺陷、用户裁决及复审记录；不负责自动修复。

> **亮点**：相对开放多Agent讨论，贡献是把红队挑错与用户裁决分离，专家只能读与报告、不能自结案，复审只核旧账。子代理与模型能力来自DSH，插件增量是评审职责/状态和可裁决缺陷材料，而非“多人一定更准”。

> **思考**：只读红队与用户认定是否保证评审有效？工具白名单依赖宿主真实限制，模型仍可引用错误证据；collect拆句/去噪会改变缺陷表达。没有Agent裁决工具不等于RPC能密码学证明人点击，受信浏览器会话与owner检查是另一保证；用户采纳也不是缺陷真值。

> **建议**：待验证假设：每缺陷绑定固定成果摘要、引用原文和可证伪断言，成果变化自动要求复审，可减少“旧版本挑错”和拆句丢条件。由当前缺陷/轮次/人裁决分层推导，未实现完整版本证据闭环。对照修复改版本、错误引用、复审未修复三类盲审，测有效缺陷率/裁决一致性与复核工时；裁决者独立于红队模型。

<a id="plugin-1340492184-root"></a>

## [dock-base](../../plugins/aks1st--dock/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock) [![npm 30d 1,532](https://img.shields.io/static/v1?label=npm+30d&message=1%2C532&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-base) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-base)

> **用途**：多个功能面板需共享布局与实例/设置接线的开发者及组合使用者。

> **亮点**：统一多插件重复的布局、实例、命令与设置接线，具体文件/Git业务由扩展实现；未证明优于所有工作台。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：异步beforeClose允许结果未绑定内容版本且未见reject处理，无hook默认允许；seed/dirty持久不等业务缓冲恢复。详见[Q02](#research-q02)。

> **建议**：可探讨实例版本绑定关闭协议，旧确认不得作用于新内容并可见处理reject；增加状态与重入成本，未验证。详见[Q04](#research-q04)。

<a id="plugin-1340492335-root"></a>

## [dock-editor](../../plugins/aks1st--dock-editor/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-editor) [![npm 30d 886](https://img.shields.io/static/v1?label=npm+30d&message=886&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-editor) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-editor)

> **用途**：适合在 DSH Web 中偶尔修改会话工作区的小型代码、配置和文档；合格结果是完整读取、编辑并核对目标文件保存。工作区外文件只读。

> **亮点**：将文件域默认查看器、工作台视图、CodeMirror 状态和读写权限连接成小文本编辑流程；高亮和历史主要属于 CodeMirror，上游 dock 提供工作台，增量在集成及写入围栏。详见[Q02](#research-q02)。

> **思考**：服务端 fs.write 直接 writeFile，不比较读取版本；外部或另一视图读后改写可能被覆盖。读取绝对路径也不限工作区，不能称作完整读隔离。风险由源码推断，未复现。详见[Q03](#research-q03)。

> **建议**：可在读取时产生版本摘要、保存时条件比较并保留冲突双方内容；以交错保存样本比较静默覆盖、误报与恢复工时。这是未实现设计，现有关闭提醒不能替代。详见[Q06](#research-q06)。

<a id="plugin-1340492214-root"></a>

## [dock-files](../../plugins/aks1st--dock-files/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-files) [![npm 30d 1,384](https://img.shields.io/static/v1?label=npm+30d&message=1%2C384&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-files) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-files)

> **用途**：需要从会话工作区浏览文件、在Dock打开并管理文件的用户。

> **亮点**：将文件资源入口、可扩展viewer和传输反馈组成文件域，使工作台扩展无需重复文件树与路径打开逻辑。服务端真实文件副作用而非模型提示；复制来的辅助方法不计独创。

> **思考**：多数请求sessionCwdOf在会话缺失时退到process.cwd，而流式上传严格要求会话；openBridge的probePath请求未带sessionId，可能按另一根目录探测并回退原生打开。任务在内存中，暂停恢复不是进程重启续传；递归删除具有实际副作用。

> **建议**：未验证假设：每个探测与变更携带明确会话资源根、缺失即拒绝，可减少跨工作区误判。以不同cwd会话、失效session、绝对/资源URL、重启传输矩阵检查目标一致性和误操作率。

<a id="plugin-1340492447-root"></a>

## [dock-git](../../plugins/aks1st--dock-git/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-git) [![npm 30d 866](https://img.shields.io/static/v1?label=npm+30d&message=866&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-git) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-git)

> **用途**：在 DSH Web 处理代码的开发者可从工作台查看会话仓库并执行 Git 操作；适用前提是能核对目标仓库和写操作结果。详见[Q01](#research-q01)。

> **亮点**：相对终端 Git 或独立客户端，增量是把提交图、差异与仓库操作接入 DSH 会话工作台，沿用系统 Git。不能由作者最高级宣传推出同类最佳。详见[Q01](#research-q01)。

> **思考**：普通提交与合并会跳过部分仓库钩子，这与依赖钩子的团队流程不等价；直接允许浏览器运行钩子又引入代码执行风险。没有通用超时的远端操作也需核查。详见[Q03](#research-q03)。

> **建议**：未验证的方向是把目标仓库、受影响 ref、钩子策略和破坏范围列入操作前确认，让可信仓库与不可信仓库采用不同执行策略，再用隔离任务检验误接受与恢复成本。详见[Q06](#research-q06)。

<a id="plugin-1414577411-root"></a>

## [DSH Harness Switch](../../plugins/alycestocking--dsh-harness-switch/INSIGHT.md)

[![npm 30d 39](https://img.shields.io/static/v1?label=npm+30d&message=39&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-harness-switch) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-harness-switch)

> **用途**：希望相同模型下比较/使用不同harness工具、Skills和压缩的开发者；合格交付是一次真实执行、正确审批和可恢复会话关联。

> **亮点**：避免把外部harness降格成模型文本：嵌入Kimi核心拥有提示/工具/权限/压缩，DSH保留会话UI与审批，外层不再执行同一真实工具第二次。贡献是执行所有权桥接；vendor Kimi内核明确上游固定提交，不将其能力或代码量算插件原创。

> **思考**：切换后权限和历史是否仍具一致含义？Kimi判免审批动作不再经过DSH逐工具allowlist，审批桥仅覆盖Kimi提出的请求；同原生权限名称不意味着同策略。pending链接在调用前落盘能标未知，但副作用已发生而completed写失败仍需恢复协议，不能只因有messageId就认定exactly-once；跨模型历史导入是参考而非状态等价。

> **建议**：给每harness显示可比较的权限能力清单，并为未知pending提供只读恢复/回执核查而非重新prompt，可能减少策略误判和重复工具副作用。固定同任务比较原生/embedded审批触发，再在工具完成后断写completed恢复，要求不自动重放；若不能核定原结果，应保持unknown并交人。

<a id="plugin-1344715270-root"></a>

## [dsh-a11y-scan](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md)

[![npm 30d 86](https://img.shields.io/static/v1?label=npm+30d&message=86&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-a11y-scan) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-a11y-scan)

> **用途**：前端开发者需要在交付前发现可自动检测的无障碍问题，合格结果是实际页面规则命中与人工复核项可追踪，而不是一份WCAG合规证书。

> **亮点**：相对直接axe CLI输出，增量是把目标发现、DSH工具接线、中文错误和修复建议/人工清单组织为Agent可用报告。检测核心属于axe，不能把上游规则库算插件原创。

> **思考**：源码与录制结果测试能否证明真实页面覆盖？实际依赖axe CLI、浏览器与目标渲染，离线fixture/模拟engine只能证明管线，不证明目标站点JS状态或真实宿主。confirmUrl是调用布尔参数，不是独立认证的用户批准记录；扫描无违规也未覆盖焦点与阅读语义等人工项。

> **建议**：由自动violations与incomplete并列推导，可为每次报告保存页面URL/DOM摘要、引擎版本与交互状态，将人工复核结果绑定同一版本，形成“已检测/未覆盖/人工确认”矩阵。未验证假设是减少零违规误当合规。对动态登录/弹窗/键盘任务比较报告，若漏覆盖仍不显式则否定。

<a id="plugin-1296792947-integrations-dsh-agentdebugx"></a>

## [dsh-agentdebugx](../../plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md)

[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/AgentDebugX/AgentDebugX) [![npm 30d 784](https://img.shields.io/static/v1?label=npm+30d&message=784&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx)

> **用途**：开发者解释Agent失败/重试，需要把已完成会话变成可回指事件的诊断报告；不以无finding当任务成功。详见[Q01](#research-q01)。

> **亮点**：将DSH完成边界、Zstandard日志、模型工具和Python诊断接成一条本地流程，保留deep失败与原任务结果；核心诊断算法仍归AgentDebugX。详见[Q01](#research-q01)。

> **思考**：持久DSH日志分支只作词法root核对后读取，和Python通用轨迹真实路径检查不一致；超时也未见终止后台诊断。静态风险未复现，足以收窄当前采用。详见[Q03](#research-q03)。

> **建议**：可研究绑定确认对象、真实路径/hash、完成边界与取消状态的输入/任务收据，用保存会话及symlink/超时反例验证是否减少错对象诊断与重复执行。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1425045401-root"></a>

## [dsh-ai-armor](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md)



> **用途**：Java后台开发者在Agent修改后取得回归定位与常见配置/SQL线索；合格交付应是可复现原因及修复验证，而非扫描命中就认定根因。

> **亮点**：相对Agent临时拼接Git命令和静态扫描脚本，增量是把常见排错动作组织成可调用工具并返回结构化线索；二分算法属于Git，模式扫描不是完整程序分析。根组件是五组工具的分发聚合，不能由“8工具”推导新的端到端修复工作流。

> **思考**：统一“armor”是否掩盖工具性质差异？bisect会先reset已有二分、切提交并执行repro，结束reset不撤销repro文件或外部副作用；MAX_STEPS常量未参与控制。POSIX构造计算了cdPart却未用于invocation，cwd仅在note中承诺，PowerShell cwd用JSON字符串不等于可靠PowerShell字面量。SQL正则只检查WHERE字样，动态条件可漏报。

> **建议**：按副作用声明分层工具，将二分放入独立工作树并固定repro摘要/逐步结果，可能减少诊断工具破坏现场；同时对Shell调用用结构化argv和工作目录字段替代生成命令文本。以已有bisect、脏仓库、repro写文件及含$的cwd反例对照，要求原仓库不变且执行目录正确，否则否定隔离和语义保真收益。

<a id="plugin-1302597978-deploy-plugins-dist-dsh"></a>

## [dsh-anet](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/ANetResearch/ANet)

> **用途**：适合已有或准备部署本地anet节点、明确要跨智能体发现能力/委派任务/等待结果或答复外来任务的DSH用户。基线手动配置MCP、管理本地节点/身份并查CLI指南；插件把stdio MCP与三份操作Skill封成profile bundle，减少找错二进制/身份和误重发的接线问题。

> **亮点**：统一MCP与Skill的二进制/身份配置、路径quoting与条件环境恢复，把节点流程适配到DSH；协议/加密/结算属于外部anet。详见[Q02](#research-q02)。

> **思考**：Skill边界不是daemon硬授权；实时下载installer先执行再由其校验二进制，全局env/多行配置影响身份一致，Windows启动器不适用。详见[Q03](#research-q03)。

> **建议**：可探索实例局部身份/授权数据与预算摘要的委派回执，对照交错环境与未知效果重试，未实现。详见[Q05](#research-q05)。

<a id="plugin-1344714509-root"></a>

## [dsh-asciinema](../../plugins/988hj7tczd-oss--dsh-asciinema/INSIGHT.md)

[![npm 30d 401](https://img.shields.io/static/v1?label=npm+30d&message=401&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-asciinema) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-asciinema)

> **用途**：开发者需要保存Agent工具输出用于演示或排错，合格记录应忠实反映收到的文本与范围；工具结果记录不等于真实终端逐字节会话。

> **亮点**：相对复制工具日志，增量是将会话内文本、标记、时间和离线回放组织成可分享材料；默认不录输入且有容量限制。自写格式核心与播放器不依赖外部CLI，但不能据自解析往返证明官方互操作。

> **思考**：asciinema命名是否暗示超过实现的保真？来源是完成后的tool/result文本，丢失工具执行中真实终端流与光标状态；cast-io保存一个含events数组的JSON对象，由自身parseCast读取。README主动排除官方播放器互操作，故回放仅应承诺本插件文本时间轴，不能承诺PTY录屏或通用.cast兼容。

> **建议**：由文本事件来源与自有序列化推导，可将“工具结果记录”和“终端字节流记录”分成明确类型，并为标准格式导出做独立官方解析验收；输出中显示缺失/截断。未验证假设是减少误用且使分享更可靠。用控制序列、连续工具流及官方工具解析对照，若事件含义或导出仍不一致则否定。

<a id="plugin-1352600211-root"></a>

## [dsh-better-sidebar-N23](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md)

[![npm 30d 1,164](https://img.shields.io/static/v1?label=npm+30d&message=1%2C164&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23)

> **用途**：开发者在DSH旁操作项目文件和持续终端，扩展作者挂自定义Tab/viewer。

> **亮点**：fork在成熟工作台上将拖动中对中心布局的重排推迟至释放，并补新模块服务兼容，属于局部性能/兼容增量；不把继承工具数量当作新机制。

> **思考**：UPSTREAM明确src领先健壮性、lib领先外壳，runtime以lib为准。实际lib fs.write只校验绝对路径并写临时rename，没有工作区containment；sessionCwd还接受clientCwd后备，因此“按会话布局/终端归属”不能推导文件能力隔离。信任fence也声明非身份认证。

> **建议**：未验证假设：重建可追溯src/lib单一产物，并把所有文件副作用绑定规范会话根和显式外部读写能力，可减少版本错认与越范围操作。对源/产物注册、跨工作区/软链和两会话PTY做矩阵；无法一致重建时限制发布承诺。

<a id="plugin-1386463441-root"></a>

## [dsh-cache-bricks](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md)



> **用途**：调试长会话上下文与缓存波动的本机DSH Web用户，需要把某次真实请求与对话位置对应。

> **亮点**：相对只看总token数字，attempt粒度观测、请求对比及会话定位把排查对象具体化；独立纯数据指标模块让视图共享同一口径。缓存本身由provider提供，插件不产生缓存优化。

> **思考**：红色砖是否能定位缓存下降原因？比例来源于宿主报告且默认三桶互斥，不同provider口径错误会传播；缺字段用未知是强支持，但比较两次请求不能建立改动导致命中率下降的因果。历史日志也未必恢复内存中全部细节。

> **建议**：适合有明确缓存排查问题的用户试用，先核对provider usage口径与采集完整度，不据颜色直接删工具或归责某个提示改动。

<a id="plugin-1356896576-dsh-capmap-viz"></a>

## [dsh-capmap-viz](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1741505640/capmap-skills) [![npm 30d 640](https://img.shields.io/static/v1?label=npm+30d&message=640&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz)

> **用途**：已经采用CapMap目录/标签规范的软件团队，想从本地文档定位能力、方案、测试和可开工切片；交付是可回到原文的状态视图。

> **亮点**：相对通用Obsidian链接图，具体增量是把方案/测试/能力和切片sidecar分层，生成依赖可开工与验证门视图；D3图布局、文件watch与Cordis接线来自上游。业务增量是将文档规范变成日常检查入口，不是自动验收系统。

> **思考**：最关键的质疑是看板的“验证门”是否真实绑定方案证据。queries.ts 把同主题测试也视作关联，可能用另一方案的已验证测试消除警报；状态来自人工标签，不读取运行验收。图谱可导航不能证明实施完毕。

> **建议**：适合已有CapMap规范的团队先在工作区副本浏览；核对看板关联与原文，初始化会写文档并安装Skill，先审阅预期文件，不能用状态标签代替验收证据。

<a id="plugin-1340906871-dsh"></a>

## [dsh-codex-guard](../../plugins/akimiya-z--codex-guard--dsh/INSIGHT.md)

[![GitHub ★ 133](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=133&color=yellow&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard)

> **用途**：Agent 提交前检查未完成标记和密钥候选；不得取代 PR CI/人工审阅。

> **亮点**：把已有 codex-guard CLI 作为 DSH 工具暴露，并避免 Windows cmd shell 解析 ref。详见[Q02](#research-q02)。

> **思考**：未传 --commits 却描述会查提交主题；同步 npx 无超时/版本锁，运行失败也只返回字符串。详见[Q03](#research-q03)。

> **建议**：绑定 CLI 版本、带覆盖率的结构化状态及受限异步执行可把提醒变成可靠本地门槛；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1344714002-root"></a>

## [dsh-dep-vuln-scan](../../plugins/988hj7tczd-oss--dsh-dep-vuln-scan/INSIGHT.md)

[![npm 30d 106](https://img.shields.io/static/v1?label=npm+30d&message=106&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-dep-vuln-scan) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-dep-vuln-scan)

> **用途**：开发者快速盘点锁定依赖的已知公告风险，交付包版本与漏洞表供人工修复；不评估实际可利用性。

> **亮点**：相对手动逐生态查公告，增量是将多锁文件解析、批量OSV查询及可回放报告集成到DSH；漏洞数据库与版本事实属于OSV，插件不创造新漏洞发现。

> **思考**：“确认存在”是否覆盖所有依赖和生态版本？pnpm/yarn行解析、requirements仅==、Maven属性等会跳过；自写semver不等于PyPI/Go/Maven完整排序，无法解析introduce/fixed可能误归类。最低fixed也不一定是当前维护线可安全升级目标，公告命中更不证明代码路径可利用。

> **建议**：待验证假设：报告把解析覆盖/未知版本、生态专属比较和可利用性证据分层，可减少“零漏洞=安全”和跨版本线错误升级。由有限parser/semver推导，未实现完整分层。以预发布、非semver、peer后缀和多修复线对照官方锁解析/公告，测漏包与修复建议错误；未知不能按干净计。

<a id="plugin-1335980444-root"></a>

## [dsh-diff-approval](../../plugins/9087--dsh-diff-approval/INSIGHT.md)

[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) [![npm 30d 5,357](https://img.shields.io/static/v1?label=npm+30d&message=5%2C357&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)

> **用途**：给在DSH web修改工作文件的读者集中核对变更，重点是目标、差异与回退结果对应。

> **亮点**：将工具写入捕获、文件/块级决策、评论及宿主fs连为连续审阅，增量在交互接线而非新diff算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：普通回退读当前内容后写旧基线，未见写时版本比较；新建删除不可undo，全局快照也需留存治理。静态核查不承诺无损回退。详见[Q02](#research-q02)。

> **建议**：可探讨版本绑定回退收据，冲突不覆盖并保存删除/批量恢复记录；增加空间与交互成本，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1424063534-plugins-dsh-domain-bridge"></a>

## [dsh-domain-bridge](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge)

> **用途**：多个顶层会话按项目/领域分工，由域声明定位负责人，在暂停期间保留待交接消息；合格交付应含任务接受与完成确认。

> **亮点**：相较宿主父子树内通信与人工转发，补充顶层职责声明、受政策约束的交接及可查询回执；把在线事实、暂停政策、生命周期分开，避免暂停等同离线。真正增量是协作寻址与责任入口，非通用可靠队列或系统级暂停。

> **思考**：落盘能否保证交接不丢不重？若多个进程共享stateDir，append的追加与updateInboxStatus的整文件.tmp重写之间未见跨进程锁或版本条件，可能覆盖其他写者的新消息；投递后再落delivered也有崩溃窗口。暂停文件坏读降级paused=false虽报告error，仍可能放行。delivered只指消息送入，不是收件方接受任务或完成，GUI/宿主直接恢复又不受此政策控制。

> **建议**：将消息业务ID与收件方接受/完成回执绑定，以单写者队列或版本条件提交状态，可能降低恢复重投的重复执行。用投递后进程中断、状态更新同时追加、并发撤回及坏政策文件反例，核对每业务ID最多执行一次且未知状态不自动重发；若只有投递日志而无收件幂等，则不能称办结保证。

<a id="plugin-1335988605-root"></a>

## [dsh-engineering-workflow](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/82c86b8z86-stack/dsh-engineering-workflow)

> **用途**：团队希望对复杂工程任务进行需求、计划、TDD、委派与验收约束。

> **亮点**：打包五阶段工程方法与 DSH preset/Skill 工具组合，减少手工配置。详见[Q01](#research-q01)。

> **思考**：自动同步同名 preset 目录时无备份覆写用户改动/删除附加文件；默认公告影响未选 preset 的新会话。详见[Q02](#research-q02)。

> **建议**：加入版本化/备份合并与轻量低风险路径、按选中 preset 公告，可降低采用摩擦；待验证。详见[Q03](#research-q03)。

<a id="plugin-1423215448-root"></a>

## [dsh-folderwatch](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md)



> **用途**：等待构建报告、下载或共享目录交接的智能体需要发现外部变化，减少反复手工查询。

> **亮点**：周期扫描与快照差分作为主路径，fs.watch 只提示加速；批量去抖、冷却和短时自身写入账本抑制回声。

> **思考**：准确变化摘要比轮询提示更利于交接；通知到达并不保证后续任务成功。

> **建议**：先以 queue 模式监听小目录，统计漏报、重复和自身写入抑制，再开放自动唤醒。

<a id="plugin-1339462797-root"></a>

## [dsh-github-router](../../plugins/angeloszou--dsh-github-router/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-github-router) [![npm 30d 1,602](https://img.shields.io/static/v1?label=npm+30d&message=1%2C602&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-github-router) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-github-router)

> **用途**：网络受限的Agent需要有来源标注的GitHub资料读取。详见[Q01](#research-q01)。

> **亮点**：将多传输故障处理和PR逐部分取数封装为Agent读取流程，减少shell重试与人工拼接。详见[Q01](#research-q01)。

> **思考**：URL缓存不绑定凭据主体，本地路径以origin匹配替代授权闭合；分页、HTML候选与镜像也限制完整性。详见[Q04](#research-q04)。

> **建议**：可研究身份分区缓存与对象/SHA/分页/截断来源清单，按换身份和错对象反例比较错误复用。当前未验证。详见[Q07](#research-q07)。

<a id="plugin-1333258432-root"></a>

## [dsh-hdc-bridge](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge) [![npm 30d 1,689](https://img.shields.io/static/v1?label=npm+30d&message=1%2C689&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge) [![最新发布 2026-10-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge)

> **用途**：鸿蒙开发者需要在DSH内观察设备、改码、部署再验证，合格结果绑定正确设备和真实产物，不只是命令exit0。详见[Q01](#research-q01)。

> **亮点**：把成熟hdc和官方工具链/知识接入DSH原生结果、图片和工程流程，减少手工材料交接；不将协议、官方文档与上游编译能力记为原创。详见[Q01](#research-q01)。

> **思考**：工具层和面板不是同一执行权限通道，preferred设备单值也需宿主实例作用域才能兑现会话隔离；多设备自动选择可能偏离意图。这些静态边界尚未运行复现。详见[Q03](#research-q03)。

> **建议**：可研究显式会话/设备/工程/产物收据，以双设备双工程和连接切换序列比较误投目标及人工负担，当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1378138611-root"></a>

## [dsh-jev-guard](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 2,072](https://img.shields.io/static/v1?label=npm+30d&message=2%2C072&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)

> **用途**：开发Agent在bash/pwsh执行前补一道误删/覆盖事故检查，交付拦截或人工升级决定及审计；不是完整安全沙箱。

> **亮点**：相对仅提示模型小心，贡献是执行管线前真实typed拦截，并将免费规则、语义灰区改写/人工升级和额度故障可见化组合。Jev是外部模型、宿主审批是上游能力；插件增量是命令状态构造、决策映射和降级生命周期。

> **思考**：事故阀门能否当安全边界？默认只覆盖bash/pwsh，网络/超时错误fail-open，降级仅L0+预筛；绕过工具或未知语法不受全面保障。cache键为cwd+command，在buildState读取脚本前命中，脚本内容变了但命令没变可能复用旧判定。作者小样本校准也不能保证任意生产命令召回。

> **建议**：待验证假设：判定缓存绑定实际被执行脚本/包脚本摘要与规则/模型版本，遇到无法固定输入时不用旧allow，可减少内容变化后的陈旧放行。由cache先于buildState及同命令复用推导，未实现。对照先安全后危险同名脚本、package.json脚本变更和模型故障，测陈旧命中、误拦与延迟；不能以缓存节省牺牲未检查内容。

<a id="plugin-1422091204-root"></a>

## [dsh-leak-guard](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md)



> **用途**：开发者在推送或外发前检查当前工作树的明显凭据，交付带位置、规则和掩码的候选发现供人处理。

> **亮点**：相对临时让模型阅读文件找秘密，增量是把固定规则、掩码与位置整理为DSH可调用工具，支持离线复核；正则秘密扫描与熵检测是既有方法，本插件不证明有新的检测算法。

> **思考**：ok=true能否当发布干净证明？只表示扫描范围内未命中critical/high，dist/build等默认排除，单文件1MiB、前20000行和超过5000字符行的限制会漏掉实际发布物；扫描不强制拦截push且不读Git历史。若模型选错path，提示“必须调用”仍无完整覆盖保证。

> **建议**：待验证假设：让扫描输入绑定实际发布文件manifest及摘要，并把跳过/截断计入incomplete而非干净，可降低遗漏发布物的假安全感。由默认目录排除与行限制推导，未实现。把测试密钥分别放dist、长行、尾部和正常源码，对照manifest扫描与当前工具的遗漏率及误报处理时间；不能用零命中替代完整性。

<a id="plugin-1412857520-root"></a>

## [dsh-ledger-memory](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory) [![npm 30d 3,016](https://img.shields.io/static/v1?label=npm+30d&message=3%2C016&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory)

> **用途**：长期开发项目的负责人需要在压缩和换会话后找回状态、原始报错与决策依据；交付物是可追溯项目记忆，而非完整聊天复制。

> **亮点**：作者强调可回溯长期记忆。相对手写 AGENTS/状态文件，实际增量是把项目语义分区、压缩前落盘义务和压缩后逐字回注连成协议；part5 的 triage 工具将需要常驻的约束与只需检索的依据分开。不是新的记忆模型，内容选择仍归模型。

> **思考**：最关键是“落盘”能否代表真正保留了任务约束。硬门可检查工具调用和持久化周期，却不能证明模型写全语义；keep 上限截断也可能丢掉末尾的重要约束。胶囊原文提供回读补救，但回读仍需模型正确判断，不能从机制存在推出连续性已保证。

> **建议**：适合频繁压缩和接班的长期项目；先在可恢复项目副本上验证一轮压缩后的约束和原文回读，再决定是否让它维护正式台账。

<a id="plugin-1422364992-root"></a>

## [dsh-lighthouse](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md)



> **用途**：维护多个插件的作者查看哪些仓库、收录PR或发布状态需要处理，交付时间相关的状态表而非真实用户采用证明。

> **亮点**：相对作者逐个打开仓库/市场/PR，贡献是用显式作品名册组织采集并按待处理状态呈现，多入口共享结果减少口径漂移。平台指标是既有API，增量在跨源作品身份关联、报告与DSH界面，不是新采用度量。

> **思考**：“有人用/留言”能否从面板指标直接判断？collectGitHub把open_issues_count作为留言，包含PR；下载也不是用户数。市场按work.name匹配、npm亦由名册name查询，同名未核实身份可误关联；API数字客观不等于解释正确，采集失败和缓存年龄还需保留。

> **建议**：待验证假设：每个指标保存明确对象ID、时间窗口、来源与含义，并把身份不匹配转unknown，可减少跨源同名误关联与热度冒充采用。依据是name关联和混合指标口径，未实现完整证据卡。以同名npm、仓库PR充当issues、缓存过期三类对照，测误判与排障时间；缺独立采用证据时明确未知。

<a id="plugin-1390103795-root"></a>

## [dsh-local-memory](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md)

[![npm 30d 155](https://img.shields.io/static/v1?label=npm+30d&message=155&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-local-memory) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-local-memory)

> **用途**：多项目开发者保留按项目的记忆库，同时主动跨库搜索和补建Git历史。

> **亮点**：在上游平级banks之上增加“有哪些项目应有记忆”的负空间视图，并以聚合读取保留原库结构。主动跨库查看拓宽可见性，但不提供新的授权隔离或记忆推理算法。

> **思考**：库ID用basename，两个不同根的同名repo映到同库，按项目隔离并非路径级保证；只读fan-out也会把多个项目内容交给同一调用者。播种复用入口不证明上游版本/配置生成相同结果。

> **建议**：未验证假设：以规范项目身份映射库、显式记录碰撞与跨库授权范围，可保留聚合视角而减少混库。用两同名repo、别名/移动、部分daemon失败核归属与越范围内容；发现碰撞不应静默播种。

<a id="plugin-1344713526-dsh-lsp-cpp"></a>

## [dsh-lsp-cpp](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：适合已有C/C++工具链、希望在DSH查询定义与引用的开发者；跨文件结果取决于实际项目构建信息。

> **亮点**：作者称开箱语言导航；本项实际增量是clangd启动默认值和C/C++扩展路由、可覆盖配置及不可用占位provider。协议和lsp工具由官方底座实现，不能将完整LSP能力归为本包原创；相对手写servers表，减少常见C/C++接线。

> **思考**：README要求精确跨文件导航生成compile_commands.json；单文件smoke不代表宏、头文件搜索路径和多目标工程都正确。.h默认路由c并不覆盖所有C++头文件语义。catch把任意LspStdio加载错误称server不可用，fallback还用默认扩展表，用户扩展可能在故障时消失。

> **建议**：待验证假设：clangd接线增加构建数据库存在性和头文件语言选择的只读诊断，可减少把项目配置错归因于模型导航。用有/无compile_commands及混合C/C++头文件项目比较定位正确率和排障时间；诊断不可替代真实server查询。

<a id="plugin-1344713526-dsh-lsp-csharp"></a>

## [dsh-lsp-csharp](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-csharp/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH Agent 中查询 C# 定义、引用、实现和 hover。

> **亮点**：将 C# 扩展映射和 OmniSharp 启动参数打包为 Cordis 组件。详见[Q01](#research-q01)。

> **思考**：只有 DLL 的环境默认命令失败；catch-all fallback 把非缺服异常也视为 unavailable，并丢弃自定义扩展映射。详见[Q02](#research-q02)。

> **建议**：按异常类型区分配置/缺服，并让 fallback 沿用 resolved extension 映射，可改善诊断；待验证。详见[Q02](#research-q02)。

<a id="plugin-1344713526-dsh-lsp-go"></a>

## [dsh-lsp-go](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-go/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH 中对 .go 文件做定义、引用、实现和 hover 查询。

> **亮点**：减少 Go LSP 装配；不实现协议，详见[Q01](#research-q01)。

> **思考**：宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](#research-q02)。

> **建议**：在 fallback 保留合并扩展、区分配置/服务器异常可改善诊断；待验证。详见[Q02](#research-q02)。

<a id="plugin-1344713526-dsh-lsp-java"></a>

## [dsh-lsp-java](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-java/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：已有 JDK 与 jdtls 的 Java 开发者在 DSH 中查询定义、引用、实现和悬停信息；合格结果需真实项目完成索引并核对位置。

> **亮点**：本包把 Java 命令、参数和扩展映射做成可覆盖的独立语言配置，复用官方 LSP 底座；贡献在接线和配置复用，不是 Java 索引或 LSP 协议。详见[Q02](#research-q02)。

> **思考**：JDK、jdtls、项目 workspace 缺一都可能影响结果；源码 catch 所有加载异常并用默认命令和扩展表建立 unavailable 占位，错误归因与覆盖项会失真，加载也不等于索引完成。详见[Q03](#research-q03)。

> **建议**：可区分命令、JVM、工作区锁、初始化与索引状态，并保留覆盖映射；以故障矩阵比较归因与恢复时间。未实现，也不能把分层诊断算作现有能力。详见[Q04](#research-q04)。

<a id="plugin-1344713526-dsh-lsp-kotlin"></a>

## [dsh-lsp-kotlin](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-kotlin/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：适合已有 Kotlin/Gradle 工程且愿意管理外部语言服务器的 DSH 开发者，减少重复配置而不提供 Kotlin 解析器。详见[Q01](#research-q01)。

> **亮点**：相对手动组合官方 LSP 底座，本包把 Kotlin 命令、扩展映射和注册行封装为配置；语言解析与进程管理归外部 server 和共享底座。详见[Q01](#research-q01)。

> **思考**：.kts 有路由不等于 Gradle 脚本语义准确；广泛 catch 会把多种 apply 错误写成 server unavailable，回退还丢自定义扩展映射。详见[Q03](#research-q03)。

> **建议**：未验证的改进方向是按命令/JDK、索引、脚本语义和配置错误区分诊断，并让回退沿用覆盖映射；用故障矩阵测根因命中与排障时间。详见[Q06](#research-q06)。

<a id="plugin-1344713526-dsh-lsp-lua"></a>

## [dsh-lsp-lua](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-lua/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：适合已有lua-language-server、希望在DSH查看Lua符号的开发者。

> **亮点**：增量是将LuaLS命令、扩展和可覆盖设置接到DSH统一导航工具；相对自建协议客户端省接线，Lua分析和协议均属上游。

> **思考**：README称单文件可索引，但Lua运行时全局变量、第三方库和嵌入环境依赖具体configuration，本包没有按游戏/宿主环境给配置。--stdio和用户参数覆盖是否适配本机LuaLS需实测；fallback丢新增扩展且catch会混淆配置与缺二进制。

> **建议**：未验证假设：提供明确来源的Lua运行时库配置预览，可降低嵌入环境全局符号漏解。比较标准Lua和宿主自定义全局两种项目，测hover/定义覆盖及误报，不能把预设当普遍正确。

<a id="plugin-1344713526-dsh-lsp-php"></a>

## [dsh-lsp-php](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-php/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：适合已有PHP工程、需要把外部语言服务接入DSH的开发者。

> **亮点**：把默认PHP服务和替代启动参数封装成独立配置包，省手写servers表；Intelephense/phpactor的分析能力不属本项实现，提供替换字段不代表两个server效果相同。

> **思考**：README把Intelephense付费高级功能与phpactor替代分别说明，故工具暴露四操作不等于默认免费server都实现。测试只在默认intelephense存在时跑真实lane，不能证明phpactor兼容；替代还需PHP运行时。fallback仅保留默认.php表，不能保全覆盖。

> **建议**：未验证假设：把server实际能力与许可条件呈现在查询前，可减少把未实现操作误当连接失败。分别用两个server和四操作验证支持矩阵及报错归因；未知能力保持未知。

<a id="plugin-1344713526-dsh-lsp-pyright"></a>

## [dsh-lsp-pyright](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-pyright/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：适合已有Python项目、希望在DSH查询源码和.pyi存根的开发者。

> **亮点**：新增Python及存根扩展的标准配置接线，减少重复注册；Pyright类型分析来自外部server，官方底座提供协议和工具，非本项新推理能力。

> **思考**：README单文档smoke和docstring hover不能覆盖虚拟环境、第三方导入及多根工程。npm/pip/pipx安装途径的PATH和实际解释器并不由本包选择；有.py路由不表示解释器环境正确。fallback用默认表会丢新增扩展，加载错误也可能不是没装server。

> **建议**：未验证假设：把所选Python环境与Pyright导入解析配置一同显示，可减少错环境导致的空定义。对两个venv同名包、.pyi与源码冲突样本比较定位和排障时间。

<a id="plugin-1344713526-dsh-lsp-ruby"></a>

## [dsh-lsp-ruby](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ruby/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：适合已有Ruby/Bundler项目、需要在DSH查询.rb符号的开发者。

> **亮点**：将Ruby语言服务默认值和DSH组合行包装，降低Ruby开发者接线成本；语义和索引归ruby-lsp，非新协议实现。

> **思考**：README要求活跃Ruby环境的gem，Bundler项目更完整，无Bundler为降级模式。默认全局ruby-lsp未自动变成bundle exec；rbenv/asdf切换后命令存在仍可能依赖不同版本。真实测试缺server会跳过，不能把总绿视为Bundler验证。

> **建议**：未验证假设：明确报告Ruby解释器、Gemfile和启动方式匹配，可减少全局gem与项目依赖错配。用两个Ruby版本及锁定Gemfile对照同符号查询和启动归因。

<a id="plugin-1344713526-dsh-lsp-rust"></a>

## [dsh-lsp-rust](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-rust/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：适合已有Cargo工程、希望在DSH查询trait实现与引用的开发者。

> **亮点**：把Rust server命令和扩展配置标准化为独立包，减少DSH手工装配；trait实现和sysroot索引归rust-analyzer，不是本包创新。

> **思考**：README测试创建Cargo.toml并要求rust工具链索引sysroot；PATH上的rustup shim存在不表示component已安装。单trait样例不能覆盖宏生成、features和workspace。catch统一错误与默认扩展fallback会弱化这些故障差异。

> **建议**：未验证假设：预检区分shim存在、rust-analyzer组件和Cargo工作区加载状态，可降低Rust导航空结果误判。用缺组件、不同features和正常trait项目测故障归因与实现查询命中。

<a id="plugin-1344713526-dsh-lsp-swift"></a>

## [dsh-lsp-swift](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-swift/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：适合已有Xcode或Swift工具链、需要DSH访问SwiftPM符号的开发者。

> **亮点**：本项提供Swift工具链服务的DSH接线与默认映射，不实现SourceKit索引；相对手配更简洁，但可用性仍取决于构建产生的索引。

> **思考**：README与测试说明引用/实现依赖SwiftPM构建；构建失败时相关测试显式skip，定义/hover通过不能当四操作全通过。默认PATH选择的SourceKit可能与项目工具链不同。配置层catch不能区分无可执行与索引缺失，错误应按阶段解释。

> **建议**：未验证假设：把编译索引就绪与可启动服务拆开显示，可减少Swift四操作半可用被当全面可用。用成功build、失败build和不同工具链比较引用/实现结果及skip提示。

<a id="plugin-1344713526-dsh-lsp-ts"></a>

## [dsh-lsp-ts](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ts/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：适合已有TypeScript/JavaScript工程、希望DSH查询普通源码与React文件的开发者。

> **亮点**：把TS/JS及React语言ID的常见映射做成独立包，减少易错手配；分析来自typescript-language-server/tsserver，协议和lsp工具归官方底座。

> **思考**：README单文件无需tsconfig的smoke不能代表monorepo、paths别名或JS配置解析。默认表未含.mts/.cts/.mjs/.cjs，用户可扩展但失败fallback只保留默认四类，覆盖后的故障路由会变。TS版本选择也需与工程匹配。

> **建议**：未验证假设：按项目配置和模块扩展预检路由，再保留覆盖后的fallback，可减少ESM/CJS与React文件漏路由。用四默认扩展和.mts/.mjs、别名monorepo比较路由及定义查询。

<a id="plugin-1334569498-root"></a>

## [dsh-mermaid](../../plugins/aks1st--dsh-mermaid/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-mermaid) [![npm 30d 4,196](https://img.shields.io/static/v1?label=npm+30d&message=4%2C196&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mermaid) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-mermaid)

> **用途**：帮助开发者/研究者就地阅读流程与架构图，保留源码核对，渲染不等业务逻辑正确。

> **亮点**：把成熟Mermaid布局接入DSH定格消息，补视口排队、主题、放大与源码回退，减少复制到外部站点；上游布局和消毒不属插件原创。详见[Q02](#research-q02)。

> **思考**：Promise超时不能中断主线程CPU，离视口只丢结果；发送AI修复会写全局首个输入框并模拟Enter，可能覆盖已有草稿，均为静态边界未复现。strict不能代替完整安全验收。详见[Q02](#research-q02)。

> **建议**：可探讨可终止渲染隔离和绑定会话的可预览修复草稿，比较病态图响应及原草稿保留；受DOM依赖与通信开销约束，未验证。详见[Q05](#research-q05)。

<a id="plugin-1423488109-root"></a>

## [dsh-model-everything](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md)

[![npm 30d 415](https://img.shields.io/static/v1?label=npm+30d&message=415&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model-everything) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model-everything)

> **用途**：开发者把设计/代码中的行为断言抽象成模型，寻找反例并回到源码核验。

> **亮点**：把自然语言主张拆成可执行模型和可复算报告，并在工具输出保留未决/未查信息，优于纯通盘模型推理的不可重算结论。算法属成熟模型检查范式，增量在DSH多域集成与报告契约，不能声称新形式化证明方法。

> **思考**：核心瓶颈是模型与实现一致性：自洽且检查通过的模型可能漏代码路径。model_verify的ok表示成功运行而不是通过，须读verdict；modelPath解析process.cwd且execute不接会话cwd，不能把描述的“即会话工作区”当普遍保证。当前gate schema默认true且bundle patch enabled:true，实际是否注入仍取决于部署覆盖与开关；消息注入不强制模型调用核查工具。

> **建议**：未验证假设：给每个模型状态/转移绑定源码指纹与可重放测试轨迹，在报告中审计抽取覆盖，可减少对错误模型的强结论。用已知实现缺陷、故意遗漏分支、两cwd同名模型及状态上限对比错误接受率/建模工时；只提高内部一致而不改善源码缺陷发现则否定收益。

<a id="plugin-1344714334-root"></a>

## [dsh-modernize-code](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md)



> **用途**：适合准备技术迁移、需要先识别环境与风险的开发团队，非普通单文件编辑。

> **亮点**：贡献是将预检、热区、路线图和逐块回滚纪律串联，脚本把部分检查变成可重复材料；相对直接让模型大改代码，明确保留未答问题和验证点。不是自动AST迁移器，模式匹配不代表死代码证明或业务优先级。

> **思考**：工具称只读是指不改项目代码，实际上默认写PREFLIGHT.md与legacy-hotspots.md。preflight的测试能力主要查测试文件/runner存在，不等于构建或测试真的通过。runScript创建超时controller却不接工具exec.signal，用户取消传播需核；环境就绪和静态命中不能替代迁移回归。

> **建议**：未验证假设：把每个迁移热区绑定可观察行为与回归证据，再按人工确认的业务影响排序，可降低正则热点驱动无价值重构。用有测试/无测试及高命中低业务影响项目比较返工率、回滚次数和工时；不以命中减少等同业务改善。

<a id="plugin-1334119885-root"></a>

## [dsh-multi-folder](../../plugins/angeloszou--dsh-multi-folder/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-multi-folder) [![npm 30d 2,036](https://img.shields.io/static/v1?label=npm+30d&message=2%2C036&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-multi-folder) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-multi-folder)

> **用途**：源码/测试/文档分仓而需同一会话协作，单命令仍一个可写根。详见[Q01](#research-q01)。

> **亮点**：不改主cwd、不加模型工具，通过原工具重定根、后台jobs适配和副根@发现提供跨仓流程。详见[Q01](#research-q01)。

> **思考**：有损workspace文件名可碰撞，保存失败内存仍生效；用户专管及native-only宣称还依宿主认证/根布局和缺服务降级条件。详见[Q03](#research-q03)。

> **建议**：稳定workspace身份和有revision的目录授权凭据，CAS保存后广播并约束host UI能力；以碰撞/失败/远程/链接反例证伪，未验证。详见[Q07](#research-q07)。

<a id="plugin-1337916824-root"></a>

## [dsh-mysql](../../plugins/1321928757--dsh-mysql/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql) [![npm 30d 35](https://img.shields.io/static/v1?label=npm+30d&message=35&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mysql) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-mysql)

> **用途**：面向在DSH中需要问数据库问题、查看schema或辅助小型数据维护的开发者。用户在设置维护连接，在会话选零/一/多个数据源，模型每次只查一个明确目标，输出标注来源、SQL和字段。它不自动联邦查询，也没有把多库数据合并为统一真相。

> **亮点**：把会话多源选择、schema先行、四类工具和独立行写/DDL权限接到动态上下文，减少手工搬运；不是SQL解析器或数据库隔离层。详见[Q02](#research-q02)。

> **思考**：只读按前缀分类，regex表名提取不覆盖全部语法且DML丢库前缀；2000行在全量读取后截断，不限服务器或内存。最小权限、TLS和网关身份仍需独立核对，未执行绕过。详见[Q03](#research-q03)。

> **建议**：可探索AST允许集合、库表操作能力句柄、最小权限账户与服务端预算，返回实际对象/取消收据；未实现。详见[Q06](#research-q06)。

<a id="plugin-1335992154-root"></a>

## [dsh-openai-oauth](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AdonisSheldon/dsh-openai-oauth) [![npm 30d 770](https://img.shields.io/static/v1?label=npm+30d&message=770&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-openai-oauth) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-openai-oauth)

> **用途**：适合希望继续使用DSH会话、工具及审批而把模型路由接到ChatGPT OAuth的本机用户。原有办法是单独Codex CLI/外部Agent或常规API Key适配；当前在DSH LLM注册openai-codex adapter，提供浏览器PKCE和设备代码两种显式登录、设置页与headless命令，不启动Codex App Server或外部Agent进程。交付是同DSH模型消息/工具调用及可恢复历史，不是获得额外账号权益或绕过额度。

> **亮点**：在DSH原生LLM路由内整合双方式OAuth、本机凭据与流/replay适配，不启动外部Agent；派生Harness转换归属上游，不是新OAuth协议。详见[Q01](#research-q01)。

> **思考**：静态模型表/零cost不证明资格或免费；明文凭据与本机账户信任、退出/持久化交错、无总deadline和非法参数退{}限制无损/可靠性主张。详见[Q03](#research-q03)。

> **建议**：可探索认证世代与持久化退出栅栏、合并signal总预算和严格工具JSON，按假依赖交错矩阵证伪；未实现。详见[Q05](#research-q05)。

<a id="plugin-1336720864-root"></a>

## [dsh-plugin-console](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-plugin-console) [![npm 30d 1,111](https://img.shields.io/static/v1?label=npm+30d&message=1%2C111&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-console) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-console)

> **用途**：本地维护者集中核对目录来源、精确版本及活动profile，需区分已装与运行中状态。

> **亮点**：把来源核验、明确确认、精确安装、完整profile兼容检查及恢复串为管理闭环，增量在流程而非新包管理算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：canary改临时HOME但仍普通用户进程并继承多项环境变量，不是OS沙箱；真实profile变更与外部初始化副作用也非原子回滚。详见[Q02](#research-q02)。

> **建议**：可探讨最小能力变更收据，列环境/目录/网络与恢复覆盖，再以白名单或OS约束缩小canary能力；兼容与隐私成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1336084195-root"></a>

## [dsh-plugin-focus](../../plugins/863683348--dsh-plugin-focus/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-focus) [![npm 30d 876](https://img.shields.io/static/v1?label=npm+30d&message=876&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus)

> **用途**：适合长任务与压缩后容易忘记约束的开发者；焦点板固定目标而非替代待办清单。

> **亮点**：作者提出durable focus board；实际增量是把目标与硬约束变成工作区可读Markdown，并自动在回合/变更时补入模型上下文。相比纯todo，强调不该漂移的信息；持久化和注入有代码实现，附带制造Skill则仅指导模型使用外部命令，不是自动发布服务。

> **思考**：同工作区会话共享同一个板文件，读改写缺少锁或版本冲突处理，并发会话可能互相覆盖。trimEntries只保留最近maxEntries，早期硬约束也会被裁掉，自动注入并不保证目标保留；set在board.js实际追加而非替换旧目标。附带dsh-factory含npm发布、topic和PR等高副作用流程，不能把加载Skill当发布已执行或授权。 固定npm files排除skills目录，因此附带Skill还存在源码可见与打包可见的差异。

> **建议**：待验证假设：将有效目标与硬约束作为稳定集合、普通发现作为有界日志，并以revision保护写入，可在不增加太多token下减少目标丢失。用超过60条记录、目标更新和双会话并发比较有效约束召回与覆盖冲突；若稳定集合积累过期约束，加入显式撤销状态。

<a id="plugin-1336663986-root"></a>

## [dsh-plugin-gate](../../plugins/863683348--dsh-plugin-gate/INSIGHT.md)

[![npm 30d 1,494](https://img.shields.io/static/v1?label=npm+30d&message=1%2C494&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-gate) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-gate)

> **用途**：安装陌生插件前检查源码与依赖风险，或在删除前提示目标范围。

> **亮点**：把静态签名、OSV 查询和基线差分整合为 Agent 可调用工具；详见[Q01](#research-q01)。

> **思考**：扫描截断/读取或 OSV 失败不一定改变 PASS；guard 不是执行钩子，“绝不写文件”不涵盖 diff/report 可选写入。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：将覆盖率不全升为 WARN、把 destructive guard 接入宿主执行层，可减少误信 PASS 和漏拦截；待验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="plugin-1422240642-root"></a>

## [dsh-plugin-orchd](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md)

[![npm 30d 301](https://img.shields.io/static/v1?label=npm+30d&message=301&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-orchd) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-orchd)

> **用途**：已经使用orchd编排项目的开发者需要在聊天旁观察任务与阻塞；合格结果是项目身份正确、状态可追溯且读操作不改变任务账本。

> **亮点**：相对手动运行多条orchd命令，增量是把当前会话与项目只读状态绑定，保留异常、未初始化与缺少能力的区别；它不是新的任务引擎，也不承担claim/review/merge。状态展示与操作责任分离是主要流程价值。

> **思考**：白名单足以保证只读吗？调用的是项目自带Python引擎，命令名称受限但具体引擎行为不由插件控制；关闭AUTO_CLEAN与剥离身份是有力支持，却不能证明任意版本status无写入。README的真引擎零变化冒烟属于作者报告，本轮未复现，需限制在可信且经过检查的引擎版本。

> **建议**：由白名单和项目引擎依赖推导，可将只读协议做成带引擎版本与状态摘要的导出接口，面板只消费快照，不执行项目代码；保留手动刷新与过期提示。未验证假设是减少观察副作用且不明显增加陈旧状态。对比CLI与快照模式的文件变化和状态延迟，若刷新负担更大且无副作用改善则否定。

<a id="plugin-1344714177-root"></a>

## [dsh-pr-description](../../plugins/988hj7tczd-oss--dsh-pr-description/INSIGHT.md)

[![npm 30d 385](https://img.shields.io/static/v1?label=npm+30d&message=385&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pr-description) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pr-description)

> **用途**：适合已有分支提交、想快速整理可复核PR草稿的开发者；动机和测试事实仍需作者补齐。

> **亮点**：作者主张PR描述自动生成；实际增量是将基线选择、差异统计、模板和可选gh动作连成DSH工具。相对手抄git diff可减少格式操作；README明确不调用LLM，确定模板不能理解业务动机，也不能凭文件变更证明测试通过。

> **思考**：正则提取最多16个符号，不能完整理解多语言、重命名和语义破坏；自动base选择可能和实际目标分支不同。输出路径resolve(workdir,outputFile)后直接Node mkdir/writeFile，无本工具ctx.fs containment，应核调用者允许写范围。confirm可选且只预览标题与路径，openPr是实际外部动作，不能把仅生成草稿和创建PR混同。

> **建议**：未验证假设：将每段描述绑定diff证据并把未知动机/未执行测试保留空项，可降低模板看似完整却陈述失真的情况。用仅重命名、多语言与未跑测试分支比较事实错误和人工改写时间；语义润色不得补造测试结果。

<a id="plugin-1334481905-plugin"></a>

## [dsh-progress-viz (plugin)](../../plugins/2008924--dsh-progress-viz--plugin/INSIGHT.md)



> **用途**：headless 长任务需要了解阶段与最近动作，插件向同目录看板提供事件投影。详见[Q01](#research-q01)。

> **亮点**：插件把噪音过滤前移到 DSH 事件源，减少看板直接读会话文件的依赖。详见[Q01](#research-q01)。

> **思考**：空闲 finished 状态不可恢复，末项未完成时也显示 100%，费用字段有重复口径风险。详见[Q02](#research-q02)和[Q03](#research-q03)。

> **建议**：与独立 zstd 解析并行对照延迟、资源和终态准确率，若会话恢复误判或误导超过收益则收窄或修正直写增量。详见[Q05](#research-q05)。

<a id="plugin-1339316901-root"></a>

## [dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,399](https://img.shields.io/static/v1?label=npm+30d&message=4%2C399&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

> **用途**：面向在同一项目持续开发或读文档的DSH用户。项目代码符号、PDF/MD/text摘要和已形成的经验可以跨会话召回，TaskBridge保存任务/文件线索，自动注入在动手前提供相关提示。输入是本地项目材料、会话todo/工具动作与用户写的经验，不是外部权威知识库。

> **亮点**：将索引材料召回和动手前须知分契约，结合TaskBridge、统一insight范围流转与候选/预算审计，减少重复上下文接线；不把文本近邻当独立知识验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **思考**：reflection虽生成task草稿，近邻路径仍可覆盖已有project/global正文而保留其审批状态；全局提升依任务数，字符预算/曝光不等于硬token和验证。根护栏不是数据沙箱，未复现污染。详见[Q04](#research-q04)、[Q05](#research-q05)。

> **建议**：可探索来源版本/适用域/审批修订链，将草稿建议、相似、曝光和结果验证分开，比较跨scope错误、任务违约与审核负担；未实现。详见[Q09](#research-q09)。

<a id="plugin-1335843541-root"></a>

## [dsh-python-env](../../plugins/angeloszou--dsh-python-env/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-python-env) [![npm 30d 1,346](https://img.shields.io/static/v1?label=npm+30d&message=1%2C346&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-python-env) [![最新发布 2026-09-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-python-env)

> **用途**：适合在 DSH 中为可信 Python 项目准备依赖、需要避开 shell 网络或临时目录限制的开发者；代码运行仍需显式使用工具返回的解释器。

> **亮点**：贡献是把标准 venv/pip 接到 DSH 的结构化工具、模式检查、错误收据和模型指引中，减少每次手写命令的接线负担；不是新的隔离技术。参照为显式解释器的手工流程，尚无同条件效果对照。详见[Q03](#research-q03)。

> **思考**：转为宿主执行后，工作区约束是否足够？词法路径守卫没有物理路径核对，发现逻辑允许符号链接，普通包规格可直接进入 pip argv，显式索引还接受 HTTP；这些限制使“仅工作区写入”不能被当作隔离保证。均为静态核查，未做越界复现。详见[Q04](#research-q04)。

> **建议**：尚未验证的假设是，由宿主签发明确目标环境、依赖与网络路由的可审阅操作计划，结合参数约束和真正受限的构建执行环境，可能保留便利并减少目标歧义。它增加确认、隔离维护和跨进程协调负担，需用正常任务与链接外指、参数改写等反例同时检验，不计为插件已有贡献。详见[Q08](#research-q08)。

<a id="plugin-1353726715-root"></a>

## [dsh-qa-suite-N23](../../plugins/all3ncn--dsh-qa-suite-n23/INSIGHT.md)

[![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@all3cn/dsh-qa-suite-n23) [![最新发布 2026-09-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-02&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@all3cn/dsh-qa-suite-n23)

> **用途**：开发者编辑TS后取诊断，或主动组织本地代码审查并人工确认问题。

> **亮点**：组合确定性诊断与模型审查两个入口，提供局部开发便利；未见二者以诊断证据约束审查放行的共同机制，不能把合包视新质量闸门。

> **思考**：code_check优先runtime.roots()[0]最近全局项目而非当前会话，已有缓存时不再用调用方cwd，可能把A项目诊断回给B。多镜头和80阈值只在提示中，由模型执行与自评分，不是可校准质量保障。

> **建议**：未验证假设：按会话/项目绑定诊断，并把诊断版本与审查范围作为输入证据，可减少错项目与泛化审查。交错两项目编辑/调用，注入真实缺陷对比问题接受率、漏报与总token；未改善则保留独立工具。

<a id="plugin-1423215373-root"></a>

## [dsh-reaper](../../plugins/11111353535--dsh-reaper/INSIGHT.md)



> **用途**：智能体遗留开发服务占用端口时，开发者需要区分可清理进程与宿主及系统服务。

> **亮点**：按宿主祖先链、工作区和保护规则评级，默认返回计划，confirm:true 才执行，发信号前再次检查保护。

> **思考**：归属和不可覆盖的保护规则比裸 kill 端口更有约束，但启发式归属仍不是授权证明。

> **建议**：先仅用扫描与预览，对照系统工具确认归属；实际清理只在可丢弃开发进程上验收。

<a id="plugin-1339262076-root"></a>

## [dsh-repeat-stop](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop)

> **用途**：为反复原样重试工具的 Agent 提供执行前保险丝，合格结果是阻断无效重复并保留合法探索；正常轮询需单独配置。详见[Q01](#research-q01)。

> **亮点**：把原样重复检测接入工具 guard，默认允许六次并拒绝第七次，同时按 Agent 隔离状态并规范化对象键；属于有用的局部机制组合，官方提醒器对照仅为作者声明。详见[Q03](#research-q03)。

> **思考**：跨步计数能否成立取决于宿主消息窗口。pre-step 遇到任何 user 消息便重置，若每步含历史用户消息就可能削弱保护；这是静态条件风险，未做故障复现。精确键还无法识别交替与改参循环。详见[Q04](#research-q04)。

> **建议**：可探讨让工具结果声明进展，在精确重复规则旁区分合法等待和无进展失败；先用固定事件反例比较误拦及漏拦，再评估状态契约的维护代价。当前未验证，不属于已有能力。详见[Q08](#research-q08)。

<a id="plugin-1372976273-root"></a>

## [dsh-session-diff](../../plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff)

> **用途**：开发者想确认本轮会话改了哪些文件，不希望Git里其他会话的改动混入；验收是对应会话工具事件的准确变更视图。

> **亮点**：相对工作区git diff，增量是会话作用域归属和就地侧栏呈现；原生查看器保留给未修改文件，避免抢占所有文档。差异算法属成熟方法，贡献在事件归属与宿主展示接线。

> **思考**：会话工具事件能覆盖多少实际文件修改最关键：shell修改、外部编辑或工具未记录旧文本，不能由write/edit节点推得完整历史；当前文件还可能被另一会话改动。readWholeFile有限行/页数，展示截断不能看作全文件审计。

> **建议**：适合快速检查当前会话的常规write/edit；跨会话、shell改动和大文件仍用Git或专门差异工具复核。

<a id="plugin-1393980674-root"></a>

## [dsh-sidebar-git-graph](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AFunDog/dsh-sidebar-git-graph)

> **用途**：开发者在会话中确认分支与改动归属，合格展示需明确仓库、分页和刷新时点，不能把图形完整误认作所有历史。

> **亮点**：相对切换CLI或IDE，增量是将仓库身份、工作树/暂存区与历史图放到会话旁；Git事实仍来自Git，本插件不管理版本操作。

> **思考**：“当前会话仓库”与图完整性是否清楚？扫描会截断并排除目录，多个只读命令并发返回也可能跨越新的提交/暂存操作。无写入避免修改仓库，却不保证一组数据来自同一时点；读图仍需看truncated与仓库选项。

> **建议**：由多命令快照推导，可每次加载前后读取HEAD/索引标识，不一致时标明刷新并避免拼接旧新图。未验证；高频提交/切仓库时检查视图是否混用，若不能区分则否定。

<a id="plugin-1336870027-root"></a>

## [dsh-skill-7d-git-commit](../../plugins/7dgroup-ai--dsh-skill-7d-git-commit/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit)

> **用途**：采用7DGroup提交规范的开发团队需要在push前减少提交信息返工；合格结果是消息符合实际服务端规则并准确描述变更。

> **亮点**：相对人工查规范文档，增量是将组织规范放到生成提交信息的工作流中，并通过invariant暴露本地同名Skill遮蔽。业务上把规则提醒前移，但并未在工具执行前提供确定性消息校验器。

> **思考**：README所谓client-side guard是否严格拦截git commit？实际src/invariant.ts只检查Provider可见，格式检查由模型遵循Skill完成；服务端hook文档又区分warn与reject并允许skip-check。因此提示前移有价值，但不能把它当不可绕过的策略执行。

> **建议**：由提示与服务端双份规范推导，可从同一机器可读规则生成Skill说明和本地/服务端校验器，消息候选先通过确定性检查再由模型解释修正。未验证假设是降低规则漂移和被拒push，不自动决定提交内容。用字符边界、豁免与多行案例对照客户端/服务端结果，若不一致率不降则否定。

<a id="plugin-1344713683-root"></a>

## [dsh-skill-creator](../../plugins/988hj7tczd-oss--dsh-skill-creator/INSIGHT.md)

[![npm 30d 790](https://img.shields.io/static/v1?label=npm+30d&message=790&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-skill-creator) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-skill-creator)

> **用途**：Skill作者从任务意图生成目录草稿，校验和打包后交付可加载资源；语义质量仍需真实触发测试。

> **亮点**：相对手工复制Skill目录，增量是DSH工具化的完整素材生命周期和运行期输出provider。作者明确参考上游skill-creator形态，新增TS适配/ZIP/frontmatter实现；方法移植与格式工具不等于自动优化触发语义。

> **思考**：“保留场景覆盖”能否由关键词证明？improve tokenize只匹配ASCII单词、最多保留8词，中文场景及否定/条件关系无法用包含关系保证；commit只替换description也可能语义退化。Node二进制打包与文本fs回退有不同权限边界。

> **建议**：待验证假设：以独立正负触发用例替代保词校验，并将候选description与测试结果绑定后再写回，可发现中文与否定边界退化。由ASCII/8词启发式推导，未实现。对中文、多条件、同词相反语义盲测召回/误触与维护时间；没有测试不能宣称提升。

<a id="plugin-1422359117-root"></a>

## [dsh-slipway](../../plugins/7gzgn--dsh-slipway/INSIGHT.md)



> **用途**：DSH插件作者把已核查工程发布到自己GitHub仓库并提交市场收录，交付上传记录、PR与逐文件回验；不替代测试或安装验收。

> **亮点**：相对手写建仓库/上传/市场PR脚本，增量是显式目标与自检、默认演算和阶段证据，并把线上字节回验纳入同一调用。GitHub API与哈希是既有能力，插件贡献在DSH作者发布流程组合；字节一致不证明可用。

> **思考**：逐文件成功是否保证一个完整发布版本？每个PUT独立提交，没有同一树原子切换；中断会暴露混合内容，旧文件也不因本地删除自动移除。verify默认分支逐项读未固定最终commit，且verify:false允许跳过；preflight对exports值以startsWith点时跳过检查，常见./lib路径可能没有被真正校验。

> **建议**：待验证假设：先构建带清单摘要的完整Git tree，统一提交到独立分支并固定commit回验，再更新发布入口，可减少部分上传与并发分支变化造成的混合版本。由逐文件PUT/浮动回读推导，未实现。对照中途第N文件失败、远端并发改动和本地删文件，验证最终树精确一致或保持旧版；代价是Git Data API与迁移复杂度。

<a id="plugin-1412896722-root"></a>

## [dsh-snapshot-manager](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md)

[![npm 30d 816](https://img.shields.io/static/v1?label=npm+30d&message=816&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-snapshot-manager) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-snapshot-manager)

> **用途**：Agent连续修改后结果不对，开发者想回到某轮之前并修改提问重来；合格结果是目标文件内容和对话切点一致，且其它会话改动不被误删。

> **亮点**：相对单独git restore或会话fork，增量是把文件状态与用户提问切点联系，提供预览、会话改动子集和恢复点。CAS与增量链为成熟存储设计，插件贡献在对话/工作区同步恢复流程。

> **思考**：内容寻址对象是否始终对应采集哈希？capture先scanWorkspace算hash，再readFile取bytes交putObject，而putObject不复核内容摘要；两次读之间若有并发写，hash名与bytes可能不一致。size+毫秒mtime复用也不是全量内容验证，turn/start排队不冻结工作区。因此“回到本轮之前”需要并发与一致性验证，不能仅凭CAS命名认定。

> **建议**：由扫描与存对象分两次读推导，可单次读同时算摘要并存对象，采集期间记录文件版本，发布快照前复核变化；对话继续执行前可等待最小基线。未验证假设是减少混合时点快照。注入扫描/读取之间并发写与同size/mtime变化，要求所有对象摘要一致，若不满足则否定。

<a id="plugin-1412897663-root"></a>

## [dsh-spring-admin-kit](../../plugins/aaalenwow--dsh-spring-admin-kit/INSIGHT.md)



> **用途**：固定后台技术栈开发者需实现模板/导入/导出与页面脚本，合格交付是字段、事务和页面编译符合项目业务，而不是模板代码齐全。

> **亮点**：相对泛化代码提示，增量是将具体栈的跨层接口一致性和模板冲突经验打包；实际实现仍由模型生成，插件不编译Java或验证数据库。

> **思考**：“强制规则/实战验证”能否泛化到当前项目？入口仅分发文本，示例路径、注解、业务唯一键和线程/事务条件须按项目改；guard是Skill指令而非模板解析门禁。没有版本对齐和真实应用复现，不能因清单完整认定业务正确。

> **建议**：由VO/端点/模板相互约束推导，可将字段与唯一键先生成机器可读契约，再产生模板并做真实解析和导入回滚样例验证。未验证；同项目对照普通Skill的字段错配和事务失败恢复，若不改善则否定。

<a id="plugin-1425006726-root"></a>

## [dsh-subagent](../../plugins/1373700184--dsh-subagent/INSIGHT.md)

[![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-subagent)

> **用途**：已有各CLI账号环境的开发者把可独立验收的任务委派出去，父侧取得最终文本、进度和文件变化；上下文必须显式交接。

> **亮点**：相比在多个终端搬运任务，插件统一委派句柄、驱动事件与父侧状态，并把外部模型链嵌入DSH。DRIVERS/sink分离减少生命周期重复；外部CLI能力与宿主子代理helper归上游，后端数量和“免费”preset名称都不证明质量或低成本。

> **思考**：归一的completed是否可靠？OpenCode/Pi的usesResultEvent=false使exit0且无timeout即可完成，error事件仅记账；首JSON后直接await handle.result，allowedWaitSeconds不是全程硬截止。POSIX取消仅杀直接子进程，末尾无换行stdout没有flush。默认bypass_permissions并自动失败换模型时，任务副作用可能重复。

> **建议**：给各驱动定义终态错误契约和产物断言，将绝对截止传播至Run，可能减少exit0误成功与有心跳无限等。固定样例覆盖error后exit0、无换行终帧、持续心跳无结果与正常交付，比较误成功率及取消残留；若统一契约误判合法协议，则返回驱动特有状态而非强装统一完成。

<a id="plugin-1421306160-root"></a>

## [dsh-subagent-role-router](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/643048695/dsh-subagent-role-router)

> **用途**：适合多供应商并行子代理任务，需要区分角色、分摊额度及排查实际模型路由的开发者。

> **亮点**：作者提供角色路由与故障切换；更具体的增量是将派发时候补工位、运行中sticky切换及可见路由结合，并通过prepareContinuable包装减少fork种子体积。相对手动指定模型，减少并行管理；轮次裁剪是上下文取舍，不是无损压缩算法。

> **思考**：候补工位不是并发上限，全部忙时会共享最少占用路由，全部冷却也会继续派发。切掉早期完整轮次即使事件协议合法，仍可能丢失未总结目标或授权；测试通过结构不变量也不证明任务语义保留。

> **建议**：待验证假设：fork窗口同时保留可追溯的任务目标与未完成依赖，可在降低种子体积时减少任务偏移。对相同长会话比较完整历史、最近N轮和目标依赖窗口的启动延迟、任务成功及信息遗漏；不将未测结果计作贡献。

<a id="plugin-1333800488-root"></a>

## [dsh-taskswarm](../../plugins/february2015--dsh-taskswarm/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm)

> **用途**：适合有Git仓库、能把目标拆成明确PROMPT/STATUS任务包、依赖与完成条件的多步骤代码工作。基线手工subagent+分支/worktree+PR/CI，由人跟踪交接；插件将任务外置、按波次启动lane、保检查点/状态/邮箱、串行集成到taskswarm/orch，用户再integrate到当前分支。单次咨询/高度耦合任务可能不值得这层管理。

> **亮点**：把TaskPlane式外置任务、wave/worktree/checkpoint与DSH内部agent/supervisor/恢复接线，支持代码现场持续推进；总管理负担减少仍是推断。详见[Q01](#research-q01)、[Q03](#research-q03)。

> **思考**：默认PASS/none与blocked可合并、首review缺.seq抛错、普通merge不统一check；worktree非权限沙箱且dashboard非显式loopback绑定，merged不能当accepted。详见[Q04](#research-q04)、[Q05](#research-q05)。

> **建议**：可探索任务/代码/策略/依赖产物绑定的接受收据与变化失效，对照简单严格CI/人工最终SHA验收；未实现。跨执行者任务包仅更远设想。详见[Q07](#research-q07)。

<a id="plugin-1345209661-packages-dsh-tech-lead"></a>

## [dsh-tech-lead（旧组件）](../../plugins/240xu--verdict-engine--packages-dsh-tech-lead/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/240xu/verdict-engine) [![npm 30d 67](https://img.shields.io/static/v1?label=npm+30d&message=67&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-tech-lead) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-tech-lead)

> **用途**：面向需要让Agent工程规范可机械复核的团队；合格结果是指出调用者输入中违反规则的字段，而非证明真实代码或环境已经满足发布标准。

> **亮点**：相对纯文本规范靠模型自觉，本项把任务分级、证据字段和门禁条件做成确定性的只读计算，减少遗漏格式与角色分工检查；原创增量在规则可执行化和一致输出，而非证明输入事实为真。组件内复制core、固定旧工具依赖，必须按所选路径评价。

> **思考**：“机械门禁通过”能否等于真实独立评审完成？gate.js比较字符串身份、非空锚点和报告数量，不读取文件、执行命令或验证评审身份，空输入在部分判据缺省时也不表达外部环境合格。最强支持是能精确检出输入矛盾，最强反例是构造格式完整但虚假的证据仍可能过机械子集。

> **建议**：新采用者先核对根项目推荐的dsh-themis迁移路线，不优先安装这个旧组件；已有使用者可把它作为输入一致性检查，并保留真实测试和人工评审，先验证旧协议返回与现有调用方兼容。

<a id="plugin-1335139860-root"></a>

## [dsh-token-billing](../../plugins/2006spy--dsh-token-billing/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing)

> **用途**：面向DSH Web中混用不同provider/模型，希望在输入框附近看到本轮消耗、并汇总跨会话支出的个人用户。核心输入是会话事件与四档usage，插件输出费用行、统计、价目配置和CSV/JSON账本。它是消费可视化工具，不负责代扣费，也不验证业务任务产出。

> **亮点**：把估算到usage修正、provider价优先和事件时间政策接入会话投影，再提供步骤账本与导出，减少手工整理；不是正式账单或新tokenizer。详见[Q02](#research-q02)。

> **思考**：投影可撤销估算，但账本仅追加且同key不更新；宿主发布中间状态时退款可能留下持久条目。“节省”还涉及累计actual和跨币种口径，未运行复现。详见[Q03](#research-q03)。

> **建议**：可探索步骤revision与upsert/tombstone修订链、价版本和原币种收据，比较投影/总账差额、重放与体积；未实现。详见[Q06](#research-q06)。

<a id="plugin-1350325873-root"></a>

## [dsh-tool-budget](../../plugins/173787247--dsh-tool-budget/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget)

> **用途**：长任务工具调用失控时，用户需要明确停止点，合格结果是在预算内办结或及时交接，而非盲目增加调用。

> **亮点**：index.js在tools.guard统计调用，默认80次；WeakSet防同一exec重复计数，WeakMap把每个Agent预算分开。

> **思考**：硬停止点可以防止无限尝试；若开多个子Agent，总调用和费用仍可能成倍增加。

> **建议**：先按一类任务观察正常调用分布，再设阈值；长后台任务查询可排除，但排除列表应保持有限。

<a id="plugin-1335559646-root"></a>

## [dsh-trellis](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) [![npm 30d 1,515](https://img.shields.io/static/v1?label=npm+30d&message=1%2C515&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)

> **用途**：适合DSH中跨会话推进功能、缺陷与重构的维护者。原有办法是聊天约定、手工Markdown清单和Git记录；当前把任务产物、task.json.steps、会话指针与每轮阶段提示接到Host，并用Web看板显示/选择任务。合格交付仍是满足业务验收的代码，附有可恢复的需求、设计、检查与归档记录，不能以绿色步骤替代业务完成。

> **亮点**：把三轨任务产物、单一steps、会话绑定/每轮提示与看板连接，降低仅靠聊天和手工清单恢复的接线负担；不归属为新通用任务算法。详见[Q01](#research-q01)。

> **思考**：human是模型可填标签，完整steps替换/verification降级与Git探测失败放行限制强验收主张；planning只读为工具组装过滤且保留shell，不是权限沙箱。详见[Q03](#research-q03)。

> **建议**：可探索与代码/要求版本绑定的独立验收凭据，把unknown与clean分开，并用假事件/Git矩阵证伪；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1338526178-packages-bundle-rollback"></a>

## [dsh-undo-plugin](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/23swccp/dsh-undo) [![npm 30d 955](https://img.shields.io/static/v1?label=npm+30d&message=955&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-undo-plugin) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-undo-plugin)

> **用途**：Git工作区内需要同步回退文件和会话的用户，限可恢复本地任务。详见[Q01](#research-q01)。

> **亮点**：把消息ID/私有Git树和会话前缀绑定为可选择回退分支，减少手动对齐文件与聊天历史；bundle是七包组合而非独立新快照算法。详见[Q01](#research-q01)。

> **思考**：文件/会话/归档非原子，异常可重写ready丢中间态，idle后台任务与其他写者未必静止；忽略文件和外部副作用不回退。详见[Q03](#research-q03)。

> **建议**：规范workspace全写者租约、不可降级事务日志与实际树核对形成覆盖明确的回退收据，按中间失败/双写者反例证伪，未验证。详见[Q06](#research-q06)。

<a id="plugin-1334836615-root"></a>

## [dsh-update-checker](../../plugins/airmetro--dsh-update-checker/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/Airmetro/dsh-update-checker) [![npm 30d 7,106](https://img.shields.io/static/v1?label=npm+30d&message=7%2C106&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-update-checker) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-update-checker)

> **用途**：面向自行维护DSH Web部署/profile插件、希望少在命令行查版本/备份/更新/恢复的维护者。基线npm/pnpm或Git tag手工查询、备份、安装、声明同步与重启；插件在GUI合并主程序/第三方插件通知、更新与回退回执。客户端加载和定期检查本身会访问源，不能理解成纯离线只读。

> **亮点**：将多源版本/频道判断、staging/备份/锁目录原地同步、声明回执与平台更新委托整合到GUI，工程增量在维护编排而非新包管理算法。详见[Q03](#research-q03)。

> **思考**：writeGate拒绝返回err=json(...)而json无返回值，if(g.err)无法退出；多条写路由拒绝后仍可继续副作用，且全局ok可能包持久化失败/身份未知。未运行复现。详见[Q04](#research-q04)、[Q05](#research-q05)。

> **建议**：可探索显式拒绝判别与绑定计划、分阶段更新收据，以假副作用日志证伪拒绝后写入/部分成功混同，未实现。详见[Q07](#research-q07)。

<a id="plugin-1425044910-root"></a>

## [dsh-vercel](../../plugins/adenxie--dsh-vercel/INSIGHT.md)

[![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adenxie/dsh-vercel)

> **用途**：Agent执行Vercel项目查询与部署协作，大工具目录需控制提示开销且保持账号/项目范围。

> **亮点**：相对全量MCP注入，主要增量是目录搜索/加载预算、子Agent继承限制及保留宿主调用链；平台能力归Vercel，附带官方skills不计插件原创。

> **思考**：字符压缩能否保持成功率和授权语义？精简schema及按需加载会增搜索回合；实测字符数不等于token/总费用节省。嵌套工具沿宿主执行接口，但本轮未验证宿主审批与策略实际拦截。

> **建议**：由预算与已加载集合推导，可按任务阶段/失败信号自适应装载，并显示最终项目归属与调用预算收据。未验证；同任务比全量目录总token、成功率、越scope拒绝和额外回合，若成本转移抵消收益则否定。

<a id="plugin-1333370288-root"></a>

## [dsh-verification-receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt)

> **用途**：适合希望回看DSH每轮记录过多少工具调用、出现哪些验证形状信号，却不愿另外持久化对话/参数/输出的个人维护者。turn/end后追加本地JSONL，包含粗粒度计数/状态/类别和会话伪名。它回答“记录中有何执行迹象”，不能回答“测试是否真运行/测试足够/代码正确”。

> **亮点**：把持久事件投影成隐私减量的每轮工具状态/词法摘要，显式不冒充测试通过，并用关闭接收/注销/drain管理卸载。详见[Q02](#research-q02)、[Q04](#research-q04)。

> **思考**：词法信号有误报/漏报且信任宿主结果；无keyhash可重算/关联，队列无界、写失败仅warning，无rotation/锁，路径需可信管理员。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索有界队列与accepted/persisted/dropped可见计数，比较内存/延迟/丢失解释，保持摘要非审计证明；未实现。详见[Q06](#research-q06)。

<a id="plugin-1335843750-root"></a>

## [dsh-verify](../../plugins/263311487-ux--dsh-verify/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/263311487-ux/dsh-verify) [![npm 30d 2,385](https://img.shields.io/static/v1?label=npm+30d&message=2%2C385&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verify) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verify)

> **用途**：Agent网页交付后用真实浏览器检查明确行为，合格结果只覆盖独立审读过的spec和基线，不是整站认证。详见[Q01](#research-q01)。

> **亮点**：将小型JSON动作、真实浏览器与可读结果接到CLI/MCP/DSH，降低手写测试接线；独立执行不等需求或作者独立。详见[Q01](#research-q01)。

> **思考**：首次expect_screenshot创建基线即PASS，结果只对应给定步骤；DSH spawnSync阻塞host且未见会话策略接线，不能当无人复核交付保证。详见[Q03](#research-q03)。

> **建议**：可研究绑定构建/spec/批准基线及browser版本的运行收据，区分新基线、比较PASS和runner错误，并盲评能否正确界定放行范围。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1423215529-root"></a>

## [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)



> **用途**：命令在终端与智能体中表现不同的开发者需要定位实际可执行文件和版本来源。

> **亮点**：自己按 PATH/PATHEXT 等规则解析候选，报告胜出与遮蔽项；版本探测使用解析后的路径、限定参数和超时。

> **思考**：让遮蔽副本成为一等输出可解释版本冲突；只有解析规则与实际 shell 一致才可信。

> **建议**：先只查询并对照当前 shell 的解析结果，必要时对可信二进制启用版本探测。

<a id="plugin-1344715132-root"></a>

## [dsh-workflow-templates](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md)

[![npm 30d 404](https://img.shields.io/static/v1?label=npm+30d&message=404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-workflow-templates) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-workflow-templates)

> **用途**：明确需要多Agent编排的人选择高频模板并填参数，交付meta/script/args起点；不是自动执行工作流。

> **亮点**：相对每次从零写编排脚本，增量是可检索的自写模板、参数提示与格式检查，并坚持由官方工具执行；引擎/子代理能力归DSH，参考结构不算插件原创引擎。

> **思考**：模板校验通过是否保证官方合法和安全？轻量语法/return检查不执行真实schema或运行时序列化，未知顶层调用仅警告；run名称不代表执行。模板也会依赖工具和任务输入，不能把12个样例概括为通用流程保证。

> **建议**：待验证假设：模板绑定宿主契约版本并用官方parser做兼容检查，再附每阶段输出断言，可减少静态通过但运行失败。由自写轻量校验与不加载官方schema推导，未实现。对计算return、未序列化对象、工具改名和失败阶段对照误接受/误拒绝及维护成本；新版本未知则标未验证。

<a id="plugin-1336092482-01-content"></a>

## [dsh-worktable（01_content）](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md)

[![GitHub ★ 772](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=772&color=yellow&logo=github&style=flat)](https://github.com/Aisland-SJL/dsh-worktable)

> **用途**：开发者把多个项目、会话和本地预览组织在同一工作台，需人工验收各项目产物。

> **亮点**：将会话产物交接绑定到具体项目窗格，避免按共享目录盲读结果的常见歧义；这是身份与交接机制的增量，终端/浏览器/原生会话能力分别来自宿主与上游。

> **思考**：manifest隔离不等于文件沙箱：主机file/write直接pathResolve用户路径，写端无本组件工作区containment；终端继承process.env且执行完整shell，路由未见本包独立信任检查。多个项目主动指同一产物仍能互改，挂载身份正确不能证明内容独立。

> **建议**：未验证假设：把产物能力绑定规范根/目标摘要和生成版本，在挂载前核引用，可同时减少错挂与旧内容覆盖。用同目录两项目、改绑/关闭、同名结果和迟到完成核身份/内容一致性；未拒迟到产物则不做自动验收。

<a id="plugin-841979943-root"></a>

## [dsh-wrapup-guard](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/566001/dsh-wrapup-guard) [![npm 30d 74](https://img.shields.io/static/v1?label=npm+30d&message=74&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wrapup-guard) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wrapup-guard)

> **用途**：适合容易在收尾遗漏测试与文档核对的软件任务；合格交付仍要由实际检查记录和人工审阅确认。

> **亮点**：作者提出三轮干净才完成；可确认增量是将检查命令执行、修复后计数清零和通知做成显式状态机。相对提示词清单，确有进度与原始输出，但不是独立代码审查器，review/build/consistency依赖模型汇报。

> **思考**：连续三轮同一自报并不构成三个独立验证。check结果未作为不可绕过的report凭据；saveState吞写盘错误，后续每次execute又loadState，故不能承诺重启或写盘故障时计数可靠。反复执行项目脚本也有副作用和成本。

> **建议**：待验证假设：将report绑定本轮命令摘要及变更摘要，仅在代码变化后重跑必要检查，可减少重复执行又防止未跑即报。用失败后误报、无变化和修复三种轨迹比较漏放行与命令次数；未验证。

<a id="plugin-1381842592-root"></a>

## [dsh-wsl-compose](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose)

> **用途**：需要从DSH检查本地Compose服务的开发者希望少写诊断命令，验收包括目标项目正确及服务实际状态。

> **亮点**：lib/compose.js规范化项目真实路径并检查allowRoots，spawn docker compose；变更入口同时要求allowMutate与confirm，日志限量返回。

> **思考**：项目边界和只读优先能减少误操作，但便利工具不能替代Docker本身的权限隔离和变更审批。

> **建议**：先仅开放ps/logs并配置明确根目录，在测试项目验证路径；需要up/down时先人工审阅Compose文件并保留运行状态。

<a id="plugin-1350379113-root"></a>

## [dsh-wsl-cred](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cred)

> **用途**：WSL中git push认证失败的开发者需要区分HTTPS凭据与SSH代理问题，交付是明确下一步核查而非得到token。

> **亮点**：lib/cred.js执行git config与remote get-url，分类HTTPS/SSH并隐藏URL userinfo，探测常见Windows GCM路径，生成相应建议。

> **思考**：把SSH与HTTPS路径分开能减少错修；找到GCM可执行文件不证明凭据存在或具备目标仓库写权限。

> **建议**：先确认工具工作目录和远端协议，只读查看配置后再人工修改；不要为了验证把token贴进会话。

<a id="plugin-1381859591-root"></a>

## [dsh-wsl-db](../../plugins/173787247--dsh-wsl-db/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db)

> **用途**：开发者想在会话里查看PostgreSQL或Redis状态，合格结果是目标正确、查询低风险且输出可复核。

> **亮点**：lib/db.js按前缀和关键字筛SQL、按命令白名单筛Redis，调用CLI并限制时间和输出；入口解析连接别名与host范围。

> **思考**：把连通与小查询标准化有排障价值；应用层读命令白名单无法证明查询成本低或没有副作用。

> **建议**：先使用数据库端只读角色和测试库，限制主机与别名，避免在大Redis执行KEYS；敏感查询结果谨慎进入模型上下文。

<a id="plugin-1351854212-root"></a>

## [dsh-wsl-editor](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor)

> **用途**：用户希望从Agent定位的源码快速跳到Windows编辑器，验收是正确文件和行号实际可见。

> **亮点**：lib/editor.js检查路径存在并realpath，调用wslpath -w转换，依序用PowerShell Start-Process启动编辑器，支持code/cursor的-g目标。

> **思考**：减少复制路径和手工跳行的步骤；自动打开入口不意味着文件修改或任务已完成。

> **建议**：适合Windows+WSL开发，先测试当前发行版路径、中文空格和行号；自动回退后人工确认文件与定位。

<a id="plugin-1381833309-root"></a>

## [dsh-wsl-git](../../plugins/173787247--dsh-wsl-git/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-git)

> **用途**：Agent检查仓库现状时，先取得简短摘要，避免完整patch占满上下文。

> **亮点**：相比自由Shell指令把常见只读检查收敛为有上限的工具；减少输出组织工作，不是新的Git分析算法。

> **思考**：状态摘要主体排除未跟踪文件，而changedFiles计数又包含未跟踪项；读者可能看到计数与明细不对应，且统计不代表代码语义正确。

> **建议**：本次未形成新的创新假设；优先让计数与明细口径一致，并比较摘要是否减少误判。

<a id="plugin-1350544211-root"></a>

## [dsh-wsl-github](../../plugins/173787247--dsh-wsl-github/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-github)

> **用途**：WSL内的Agent需要查询当前仓库协作状态，又不希望把API密钥直接放入聊天。

> **亮点**：把App安装认证和有限只读查询接入DSH工具；短期凭据减少人工搬运，认证机制本身来自GitHub。

> **思考**：fetchRepoStatus读取仓库最近一次Actions运行，未绑定PR head SHA；认证就绪和一次状态查询成功也不等于目标PR检查通过或具备合并条件。

> **建议**：待验证假设：将状态查询绑定PR head SHA而非仓库最新运行，可减少跨分支绿色检查误认；需保留权限不足状态。

<a id="plugin-1381859919-root"></a>

## [dsh-wsl-glab](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-glab)

> **用途**：使用GitLab的开发者希望在DSH内查看协作对象及流水线，而不手工复制CLI长输出。

> **亮点**：把GitLab CLI的只读子集结构化接入Agent；主要增量是输出整形与调用约束，未发现新的协作流程机制。

> **思考**：列表按单页和条数上限返回，截断或一页结果不能支持仓库全量统计；ci status与当前待审提交的对应关系需额外核对。

> **建议**：本次未形成新的创新假设；先检查分页完整性与流水线提交绑定，避免将展示便利当成验收。

<a id="plugin-1381843528-root"></a>

## [dsh-wsl-helm](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-helm)

> **用途**：维护Kubernetes发布时，先取得Helm状态而不让Agent直接执行升级或卸载。

> **亮点**：将Helm只读查询和输出限量接入工具层；增量是调用边界与结构化展示，底层部署语义仍来自Helm。

> **思考**：guardContext对空context返回undefined，使用者可能落到本机默认集群；配置allowedContexts并不等于每次实际目标都已核实。

> **建议**：待验证假设：调用前把省略context解析为明确集群并检查白名单，可减少默认上下文漂移；若增加的查询成本显著则缓存并绑定配置版本。

<a id="plugin-1381726881-root"></a>

## [dsh-wsl-k8s](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-k8s)

> **用途**：Agent辅助排查Kubernetes时，先收集状态而不直接开放apply、delete或exec。

> **亮点**：将常见kubectl读取路径缩为专用工具，降低自由命令的变更面；权限仍由kubeconfig和集群控制。

> **思考**：空context会返回undefined，实际查询可继承默认集群；列表过滤allowedContexts不能证明省略参数的后续查询也落在允许集群。

> **建议**：待验证假设：把已解析集群身份绑定到每次结果和后续调用，可降低默认上下文变化导致的错集群排障。

<a id="plugin-1338965593-root"></a>

## [dsh-wsl-net](../../plugins/173787247--dsh-wsl-net/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net)

> **用途**：WSL/Windows网络环境不一致时辅助维护者定位故障层次。详见[Q01](#research-q01)。

> **亮点**：把环境、宿主PID、代理监听和服务响应集中为Agent诊断报告，减少手工信息拼接。详见[Q01](#research-q01)。

> **思考**：HTTP<500不等业务成功，fix脚本使用未脱敏代理，默认全局包装也缺显式卸载还原。详见[Q03](#research-q03)。

> **建议**：可研究分层可达性判据、无凭据回显的修复计划与可恢复注入，以固定反例比较误诊和恢复成本。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1381861315-root"></a>

## [dsh-wsl-pkg](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-pkg)

> **用途**：开发者让Agent排查依赖状态，需要浅摘要而非大量原始输出。

> **亮点**：将多包管理器诊断统一为工具入口，并对目录和输出设边界；依赖解析和版本判断仍由上游CLI完成。

> **思考**：cargo实际参数为tree -d 1，不能仅据描述确认它按深度1工作；npm解析失败仍返回ok:true，pip取PATH环境也不等于目标项目环境。

> **建议**：待验证假设：统一返回执行状态、解析状态与环境身份，可减少把空摘要误认为健康依赖；尚未实现。

<a id="plugin-1381725987-root"></a>

## [dsh-wsl-search](../../plugins/173787247--dsh-wsl-search/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search)

> **用途**：Agent在大型工作区定位代码时，需要比整文件读取更紧凑、可追溯的匹配结果。

> **亮点**：把三种成熟搜索器接成统一工具，并给出根目录约束和模型可消费结果；搜索算法不是插件原创。

> **思考**：rg的max-count是每文件上限，且结果数在进程完成后再裁剪；ast-grep也主要事后裁剪，不能把返回条数上限等同实际工作量上限。默认允许home范围较宽，根路径检查不等于操作系统沙箱。

> **建议**：待验证假设：流式读取达到全局匹配预算即停止子进程，能减少宽目录搜索的等待和缓冲；提前停止也可能漏掉更相关文件。

<a id="plugin-1351854356-root"></a>

## [dsh-wsl-ssh-agent](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ssh-agent)

> **用途**：Git SSH认证失败时，区分环境未继承、代理失效、未加载密钥与Windows桥接未配。

> **亮点**：把常见SSH代理排障线索聚合为不回传私钥内容的提示；不自动建立代理桥接，也不证明目标Git服务认证通过。

> **思考**：sockAlive只由exists判断，路径存在不证明是可服务的socket；ssh-add失败被归为keyCount=0，与真实空代理不同，可能误导加载密钥建议。

> **建议**：待验证假设：分别表示路径存在、socket类型、代理协议可达和目标授权，可减少把不同失败合并；额外探测可能增加延迟和权限要求。

<a id="plugin-1381833652-root"></a>

## [dsh-wsl-tmux](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tmux)

> **用途**：长时间构建或训练放在 tmux 的开发者，希望由 Agent 读取当前终端尾部辅助排障，而不向任务发送输入。

> **亮点**：相对复制终端日志，增量是一个不发送按键的观察入口；tmux 继续拥有会话和滚动缓冲，插件没有任务控制或完成判定机制。

> **思考**：日志尾部是否足以代表任务完成是关键。capture 仅按会话定位默认 pane，没有精确窗口/pane 身份；list 对任意退出码1都返回空会话，可能把查询故障误解为无任务。

> **建议**：适合单 pane 的长任务观察；多窗口先人工确认目标，关键完成状态应另查产物或退出码，不能只凭终端尾部。

<a id="plugin-1334205011-root"></a>

## [dsh-wsl-workspace](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md)

[![GitHub ★ 96](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=96&color=yellow&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,975](https://img.shields.io/static/v1?label=npm+30d&message=2%2C975&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace)

> **用途**：Windows/WSL开发者需要同会话shell、文件与搜索处在相同发行版/用户和路径中，合格任务还需明确取消恢复及副作用。

> **亮点**：将既有模式的shell/fs消费者统一到WSL realm，保持会话发行版与用户并适配9P真实路径/发布语义，减少仅转发bash导致的跨世界错位；上游执行器/fs机制按NOTICE归属。详见[Q02](#research-q02)。

> **思考**：文件工具有条件守policy，普通命令由partial/no-op sandbox放行；policy解析失败文件侧也不围栏。shell消失或等待输入可自动整命令重跑，先前副作用可能重复，未做实际复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索幂等/禁止重跑声明与attempt收据，结果未知时显式交还判断，比较重复副作用、恢复成功率和人工次数；尚未实现。详见[Q07](#research-q07)。

<a id="plugin-1351853812-root"></a>

## [dsh-wsl-workspace](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-workspace)

> **用途**：首次在WSL配置DSH的开发者需要避免工作区选错发行版或落在Windows用户目录，以目录诊断和建议迁移路径为交付。

> **亮点**：相对人工检查pwd和发行版，增量是把目录放置规则与当前/默认发行版差异汇成可读诊断；不测文件系统性能，也不实施迁移。

> **思考**：核心质疑是“Linux侧路径”等不等于真实底层文件系统。源码在realpath前按原abs分类，home下符号链接指向/mnt仍可能ok；非/mnt的挂载也未探测。因此只能当启发式，不是性能/合法性认证。

> **建议**：适合首次选工作区时快速排查；符号链接或特殊挂载需手动核对真实路径和文件系统，迁移仓库前另行备份与确认。

<a id="plugin-1366089972-workspace-plugins-dsh-zero-residence"></a>

## [dsh-zero-residence](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：工具输出很长的任务希望缩小反复发送的历史，同时保留回查原文能力；验收需兼顾最终任务质量。

> **亮点**：继承BasicCompactionEngine以确定性指针代替摘要，原文从会话持久记录回读；另有zr_fast用pwsh派生进程并返回日志句柄。

> **思考**：可追溯指针比不可逆摘要更利于复核；如果模型频繁回读或遗失指针，省下的输入可能被额外轮次抵消。

> **建议**：先在可恢复会话副本试压缩，验证关键证据能原样回查；异步命令只用于允许的测试任务，并确认宿主权限与取消边界。

<a id="plugin-1276714299-root"></a>

## [embedded-workbench](../../plugins/amethystluna--embedded-workbench/INSIGHT.md)

[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 2,906](https://img.shields.io/static/v1?label=npm+30d&message=2%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench)

> **用途**：固件设计、调试和构建工作中按任务加载领域 Skill；DSH 原生 bundle 也向每个 agent 会话注入短门禁。详见[Q01](#research-q01)。

> **亮点**：把嵌入式经验指南作为跨平台 Skill 打包，并给 DSH 单独实现注册与门禁。详见[Q01](#research-q01)。

> **思考**：门禁是提示而非强制计划验收；作者兼容测试主要检安装/注入，不等于固件建议可靠。详见[Q02](#research-q02)和[Q03](#research-q03)。

> **建议**：为代表性固件问题建立专家标注与失败回归集，将 Skill 触发、建议质量和门禁成本同时测量。详见[Q05](#research-q05)。

<a id="plugin-1372993989-root"></a>

## [ETeams](../../plugins/2507483326--dsh-eteams/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2507483326/dsh-eteams) [![npm 30d 1,445](https://img.shields.io/static/v1?label=npm+30d&message=1%2C445&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-eteams) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-eteams)

> **用途**：需要多个角色接力完成代码或文档任务的用户，将验收条件与成员职责落实到可追踪任务；交付应是通过合同验收的成果。

> **亮点**：相对手工多会话交接，增量是将合同、执行链、尝试令牌及交接邮件纳入一致状态，再异步唤醒成员；唤醒失败不回滚已提交邮件，保留后续读取机会。并非仅用角色提示词模拟团队。

> **思考**：持久任务状态能否可靠区分会话死亡与观测失败？reconcile.liveAgentIds在服务缺失或抛错时返回空集合，超过60秒宽限的在办attempt会被挂起。该分支可能把宿主暂时不可观测写成业务状态；没有实测故障注入，不能宣称重启恢复无误。

> **建议**：适合可拆分且验收条件清晰的任务；先用无外部副作用的任务验证重启、唤醒失败和重复汇报处理，再评估长期使用。

<a id="plugin-1343702731-root"></a>

## [harness-github](../../plugins/988hj7tczd-oss--harness-github/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/harness-github) [![npm 30d 148](https://img.shields.io/static/v1?label=npm+30d&message=148&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/harness-github) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/harness-github)

> **用途**：帮助在DSH处理软件交付的人取得GitHub事实并准备操作，合格结果需对象、授权和最终状态可回读。

> **亮点**：把成熟gh/REST能力包装为DSH结构工具、统一凭据路径与远程审批，减少重复命令接线；价值是集成便利而非新增GitHub原语。详见[Q02](#research-q02)。

> **思考**：pr_prepare可在审批前git add -A并commit，与拒绝零副作用承诺冲突；REST对非幂等写也通用重试，断连后可能重复发布，合并未绑定head。均为源码路径判断，未向GitHub复现。详见[Q02](#research-q02)。

> **建议**：可探讨状态绑定动作收据，先明确本地/远程操作、摘要和head再审批，未知结果先回读且不重放非幂等写；新增状态与恢复负担，未验证。详见[Q05](#research-q05)。

<a id="plugin-1397817235-root"></a>

## [IDE Hub](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub)

> **用途**：跨 IDE 工作的开发者需要盘点会话、配置和预算，而非逐个工具翻找。

> **亮点**：注册盘点、迁移、导出和 hub-init 命令，从本地状态读取信息，规则本体与各 IDE 指针分开维护。

> **思考**：统一索引和单份规则可减少查找及漂移；跨 IDE 的规则优先级仍需分别验收。

> **建议**：先只盘点两个实际使用的 IDE，再对一个测试项目 dry-run 规则分发并检查差异。

<a id="plugin-1331586818-root"></a>

## [logicprobe](../../plugins/amethystluna--logicprobe/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 2,926](https://img.shields.io/static/v1?label=npm+30d&message=2%2C926&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-logicprobe)

> **用途**：核查设计/代码声称，在明示模型边界下找反例、回归与依赖图问题。

> **亮点**：把多类形式化/结构检查、报告对比与外部导出汇入 DSH 工具集；详见[Q01](#research-q01)。

> **思考**：模型转换表的用户确认在 Skill 层，verify 工具不校验来源；ok 不等于通过，截断不可当验证成功；详见[Q02](#research-q02)。 同步引擎不接signal，10秒注册期限非强停，maxStates非总资源预算。

> **建议**：把模型来源/确认与截断状态绑定报告可减少误读，但需标注题集证伪；详见[Q03](#research-q03)。

<a id="plugin-1334569518-root"></a>

## [model-usage-plugin](../../plugins/aks1st--model-usage-plugin/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/model-usage-plugin) [![npm 30d 972](https://img.shields.io/static/v1?label=npm+30d&message=972&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/model-usage-plugin) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/model-usage-plugin)

> **用途**：面向在DSH Web混用多个模型/provider、希望知道token花在哪里和何时使用较多的个人开发者。它把模型用量、估算金额、趋势、工具频率和余额放在设置页，适合形成“哪种调用值得进一步核查”的线索。合格任务是把自有会话的实际usage准确归到模型/时间/来源，并清楚显示价格、套餐与汇率口径。

> **亮点**：把流usage、工具事件、去继承历史与显式套餐/价表/汇率控制接到同一设置页，减少手工整理；金额和工具指标不证明业务价值。详见[Q02](#research-q02)。

> **思考**：历史扫描在首个会话写日键后跳过同日其它会话，自动补齐不能据此视为完整；自定义余额地址会携带回退到的key，来源检查也只比hostname。未运行漏计或越权复现。详见[Q03](#research-q03)。

> **建议**：可探索逐会话/事件稳定ID账本与独立扫描watermark，再绑定价版本，比较漏计、重复、重启和资源负担；未实现。详见[Q06](#research-q06)。

<a id="plugin-1379204512-root"></a>

## [oh-my-dsh](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) [![npm 30d 2,379](https://img.shields.io/static/v1?label=npm+30d&message=2%2C379&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)

> **用途**：复杂开发任务需要规划、委派与验证分工，用户希望复用一套宿主适配的编排约定。

> **亮点**：入口注入协议并注册资产、命令和 MCP，team 模块维护阶段、队员身份与邮箱；实际派发与合并仍由领队模型驱动。

> **思考**：统一委派与恢复数据面可降低自建成本；多代理可能放大误解、冲突和预算超支。

> **建议**：先验装探测与取消，再对单仓库小任务比较原生单 agent 和一条显式 team 流程。

<a id="plugin-1334504487-root"></a>

## [Plan Lattice](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice)

> **用途**：长任务经上下文替换后仍需沿用已批准计划、人类要求和已返回委派结果；高风险写入可显式启用完整控制。

> **亮点**：把 DSH 自有 Session/plan/委派事实在真实 surface 替换后有界回填，避免创建第二个自动计划器；显式模式把契约、目标事实与受保护变更绑定，详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：默认 auto 不装写入门禁，显式模式也仅守护列名工具且外部副作用依赖 adapter；12/12 是手工设计机制样本，V17/V18/V20 不支持通用提升，详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：已有实现已过滤隐藏来源、保成功计划/前台最近3项并按maxContextBytes降级；进一步可研究在合格候选内部按当前子任务需求提供来源引用/缺口、必要时回退原投影。若遗漏权威或增加错续写则反证。此方向尚未实现，详见[Q03](#research-q03)。

<a id="plugin-1346017360-root"></a>

## [SSH 只读日志工具](../../plugins/452926826--dsh-ssh-logs/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-ssh-logs)

> **用途**：运维和开发者在对话中定位已授权服务器日志，交付限定范围的日志片段或字面量搜索结果；不需要让模型获得任意shell能力。

> **亮点**：相对把通用SSH shell交给模型，贡献是缩小为三种只读意图、固定主机根目录和有界输出。借用OpenSSH与MCP，不是新的日志检索算法；命令生成与路径约束的组合降低误操作面。

> **思考**：最强质疑是README“每个文件必须留在允许根”只由词法路径检查支持。remote.js没有远端realpath/符号链接解析，root内符号链接若指向外部仍会被head/grep跟随；实际隔离必须依赖只读账号/ACL。grep零匹配exit1也被runSsh当失败，模型需区分无匹配与连接错误。

> **建议**：适合已建立只读SSH权限的团队先用测试服务器验证；根目录不能单靠字符串约束当隔离，生产环境以服务端账号权限兜底。

<a id="plugin-1399011094-root"></a>

## [Task Forge](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge)

> **用途**：跨模型或 IDE 交接任务时，用户需要暴露接收方理解缺口并跟踪其持有版本。

> **亮点**：命令编译任务、导出交接包并记录台账；握手解析回读、缺口、STATUS 和版本，旧版本不得视为当前放行。

> **思考**：将隐含假设和版本漂移显性化有价值；作者的无损说法不能由模板和状态字样单独证明。

> **建议**：先用一个有明确验收点的小任务试交接，人工比对遗漏和改版后的接收方状态。

<a id="plugin-1406156934-dsh-task-monitor"></a>

## [任务监控与 Git 操作面板](../../plugins/3450892121--dsh-task-monitor--dsh-task-monitor/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/3450892121/dsh-task-monitor)

> **用途**：DSH Desktop开发者查看会话活动、文件产出和Git状态，必要时手工提交/发布；合格交付物是可回查活动和已核实Git结果，活动计数不等于代码完成。

> **亮点**：相对翻聊天记录与终端，贡献是按会话聚合技能/MCP/文件/网页并连接Git工作流；将可见活动与工作区状态放到同一面板降低切换。没有发现活动记录自动约束代码验收的机制。

> **思考**：最强质疑是“只读监控”边界与实际实现冲突：README安全段称不落盘、不外联、只有只读Git，但index.js:474-505写令牌并实际建/删临时仓库，1053-1103提供写Git和发布路由。环回/工作区检查存在，仍不能把显式UI写操作描述成无副作用。

> **建议**：仅在读懂当前Git/GitHub写副作用后于临时仓库验证；把监控活动当辅助线索，提交推送仍须核对差异、目标分支和结果。

## 更新时间

2026-10-22
