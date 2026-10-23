# 软件交付

[返回首页](../../../README.md)

代码开发、任务编排、调试与交付流程。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@240xu/dsh-session-lazy-view](#plugin-1377185339-root) | 以独立网页只读查看本地会话尾帧，提供时间线、搜索、统计及Markdown导出。 | 适合本机维护者先用只读小范围试用，默认tail或fast统计；搜索未命中和统计异常必须回原件复核。 |
| [@240xu/dsh-tech-lead](#plugin-1345209661-packages-dsh-tech-lead) | 面向 DSH 的旧版只读工程治理工具集，对调用方提交的结构化事实做分级、审计、Gate 与变更预览。 | 现有旧包用户可用于辅助 lint；新部署先比较 dsh-themis。 |
| [@7dgroup/dsh-skill-7d-git-commit](#plugin-1336870027-root) | 把 7DGroup Git 提交规范作为低优先级内嵌 Skill 注册到 DSH，并允许本地同名 Skill 覆盖。 | 适合已明确采用 7DGroup commit 规范且愿意保留提交授权门禁的团队试用；其他团队应先读 Skill 内容，和本地 COMMIT-RULES 对齐后再装。 |
| [@adwmc/helm-d](#plugin-1334304098-packages-helmd) | 为安全分析任务提供知识路由、参考资料、工具门控、案例记录和多类分析脚本。 | 有授权安全研究流程的专业用户可观察，正式试用前需逐项核对脚本来源、目标授权、工具链和失败恢复。 |
| [@dsh-external/dsh-zero-residence](#plugin-1366089972-workspace-plugins-dsh-zero-residence) | 用确定性工具指针清单替换模型摘要，提供日志召回、近似上下文账本、强制压缩探针及异步PowerShell命令句柄。 | 先观察，先验证原件恢复hash、会话范围和受控后台任务生命周期，勿当生产无损压缩/沙箱。 |
| [@dsh-lsp-packs/dsh-lsp-cpp](#plugin-1344713526-dsh-lsp-cpp) | 把 clangd 配置为 DSH 的 C/C++ LSP 后端，为共享 lsp 工具提供导航、引用、实现和 hover。 | 有稳定 clangd 与 compile_commands 的 C/C++ 项目可在只读导航任务中试用；先核四个操作对 sample 和本项目代表文件的结果，再允许模型依赖它改代码。 |
| [@indexyz/dsh-autocompact](#plugin-1324229194-dsh-autocompact) | 为Harness按会话与模型配置提前自动压缩阈值，提供持久设置和输入区状态显示。 | 熟悉原生压缩的开发者可单route试用，保留原生对照并检查摘要与关键约束；不要按pill猜有效覆盖，不把off当关闭宿主溢出恢复。 |
| [@y9931666/dsh-plugin-roundtable](#plugin-1342524723-root) | 把Harness会话组织成持久专家圆桌，提供拓扑、发言汇聚、人工决策和红队评审。 | 适合能主持和审证的方案维护者先用少量专家、短轮数试用，比较同预算单Agent；严格费用封顶、无人值守交付或不可重复副作用任务先观察。 |
| [7d-code-reviewer](#plugin-1336021761-root) | 一个注册到 DSH skills 的模板驱动代码审查 Skill，要求模型输出分级问题、评分与文字/HTML 报告。 | 以小范围 diff 试用，人工核行号/复现与 HTML 安全；避免分数代替审查结论。 |
| [agent-development-constraints](#plugin-1404700411-root) | 提供项目开发规则库与提炼精简合并流程，DSH按症状查询规则并一次注入入口目录，另有上下文成本观察和可选提交脱敏检查。 | 先观察，可人工择取规则方法，先核隐私/路由/会话和安装保留再在重要项目启用运行面。 |
| [AI Look-Up](#plugin-1401618027-root) | 监测代理重复调用、失败循环和目标漂移，并在触发时注入自检提示。 | 适合经常运行长时编码代理、能审阅提醒台账的团队先观察，不适合短任务或对中断敏感的会话。 |
| [AI 残渣清运](#plugin-1406611614-root) | 按规则把代理副产物移入可恢复回收站，并支持项目结项归档。 | 适合副产物命名规律稳定、能先维护 ignore 且使用版本控制的项目试用；高价值数据目录或命名混乱仓库只运行 dry-run。 |
| [dock-base](#plugin-1340492184-root) | 为DSH web提供统一布局、视图实例、命令和设置注册服务，供功能插件按需组合。 | 有多视图组合需求可试用，先核对上下文与异步关闭；逐个研究功能插件而非默认全装。 |
| [dock-editor](#plugin-1340492335-root) | 为 dock 文件域增加同工作台的文本查看、编辑、保存与关闭提醒。 | 可对非关键小文本进行受控试用，保存后回读目标并留版本库或备份；对并发编辑和重要配置沿用有冲突检测的工具。 |
| [dock-git](#plugin-1340492447-root) | 在 DSH Dock 中查看 Git 提交图与差异，并对会话仓库执行暂存、提交、分支和远端操作。 | 建议观察，先在隔离仓库核对钩子策略、破坏操作确认和远端失败恢复；团队质量门禁另作明确安排。 |
| [DSH Harness Switch](#plugin-1414577411-root) | 在DSH原生会话中绑定模型与harness，嵌入固定Kimi Code执行核心并桥接审批与历史。 | 熟悉Kimi和DSH的开发者可在单进程隔离profile及副本工作区试用；出现pending未知结果先查日志与文件，不自动重试，要求无损迁移或完整计费者暂缓。 |
| [DSH Model Everything](#plugin-1423488109-root) | 为设计与代码断言提供建模Skill、有限模型验证、UML/依赖审查及可复算报告工具。 | 适合理解有限模型、愿意维护源码映射的工程师小范围试用；未决、跳过关键性质或无法映射实现时停止放行，不把它当自动程序正确性证明。 |
| [DSH Model Router](#plugin-1353534254-root) | 在DSH工作台规划任务、比较模型路由并通过API或官方CLI执行依赖工作包。 | 建议多模型开发者在隔离小仓库试用只读流程，逐包盲评与核对全部支出；身份或权限不清、支出未知时暂停扩大使用。 |
| [DSH Orchestrator2](#plugin-1409845351-plugins-dsh-orchestrator2) | 提供自动开发调度预设，以任务包组织设计、开发、审查、预算与人工验收。 | 建议先观察并核对派工回执与角色参数，再做隔离任务包验收。 |
| [dsh-a11y-scan](#plugin-1344715270-root) | 在DSH中调用axe扫描本地HTML或确认URL，输出定位、修复线索、人工复核项和多格式报告。 | 可信无敏感页面可限范围试用作自动线索，先核实际网络/文件与规则覆盖，保留人工复核。 |
| [dsh-about](#plugin-1354283280-root) | 在 DSH Web 设置页展示推断的运行版本、插件版本和 GitHub Releases 摘要。 | 仅作排障辅助，报告版本同时附 CLI 输出；试点核多安装布局和离线回退。 |
| [dsh-agent-recycle-guard](#plugin-1414323673-root) | 将 Agent 常见直接删除改为系统回收，并对执行脚本做有限内容检查，异常时阻止命令。 | 建议有独立备份的维护者在可丢弃目录受控试用常见删除缓冲；不以此替代权限隔离，准备长期阻断、语义不一致或需要动态程序全覆盖时停止。 |
| [dsh-agentdebugx](#plugin-1296792947-integrations-dsh-agentdebugx) | 连接 DSH 会话与 AgentDebugX，支持保存会话发现、当前或历史轨迹诊断和本地查看。 | 建议观察，先修明物理路径与取消契约，缩窄历史root，之后再考虑不敏感当前工作区轨迹；同模型自诊断不作为独立效果证明。 |
| [dsh-ai-armor](#plugin-1425045401-root) | 将Git回归、堆栈、配置、shell转义和MyBatis Plus静态审计工具合并分发。 | 可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。 |
| [dsh-ark-coding-provider](#plugin-1421741516-root) | 为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。 | 有条件试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。 |
| [dsh-asciinema](#plugin-1344714509-root) | 把DSH会话工具结果文字缓冲为自有cast对象文件，提供会话录制/标记、HTML回看与纯文本转换。 | 观察，先修模板路径/时间与保存pending恢复，非秘密小样也须核采集/分享范围。 |
| [dsh-cache-bricks](#plugin-1386463441-root) | 用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。 | 建议本地单用户维护者用不敏感会话试用，先核对attempt、usage和访问边界；主链延迟、字段错位、UI干扰或权限不清时停止，回到宿主日志。 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz) | 解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。 | 建议试用。 |
| [dsh-ci-diet](#plugin-1426954291-root) | 分析GitHub Actions运行与工作流，标注浪费候选并生成需明确审批的本地YAML补丁。 | 适合熟悉自家CI的维护者先用只读scan/sync/report试用，再逐个plan审语义；复杂部署副作用、保护归属不清或无工件owner时只观察不apply。 |
| [dsh-codex-bridge](#plugin-1427331352-root) | 通过Codex CLI读取账号额度与模型建议，并以可选模型和推理强度委派独立任务。 | 单人已有账号先只读短任务，核模型/额度/结果；写任务用可恢复工作树，超时先验产物，高价/低额需真实用户接受。 |
| [dsh-codex-guard](#plugin-1340906871-dsh) | 在 DSH 中调用 codex-guard，对 Git 变更进行提交前卫生检查。 | 建议观察；先核实际 CLI 版本、cwd 和覆盖，再对六类场景隔离验证，不能将字符串成功返回当提交放行。 |
| [dsh-dep-vuln-scan](#plugin-1344714002-root) | 读取常见项目锁文件，向OSV批量查询依赖版本公告，展示漏洞、修复候选与命令建议，并保存可重放结构化报告。 | 先观察。 |
| [dsh-diff-approval](#plugin-1335980444-root) | 捕获DSH成功文件编辑并集中展示差异，支持Keep/Revert、评论、撤销及VCS变更导入。 | 单人可备份工作树试用；普通回退先冻结其他写入，删除先确认，保留Git/备份和持久日志核查。 |
| [dsh-domain-bridge](#plugin-1424063534-plugins-dsh-domain-bridge) | 以四级状态协调多会话投递、暂停、恢复、建会话与模型分派。 | 建议观察。 |
| [dsh-engineering-workflow](#plugin-1335988605-root) | 可选工程 preset 与六个方法 Skill，以五阶段文字门禁引导 DSH Agent；Host 自动同步本地预设并公告。 | 备份 DSH_HOME/.agent-presets/engineering-workflow，再在新会话选择 preset 做对照试验；详见[Q02](#research-q02)、[Q03](#research-q03)。 |
| [dsh-eteams](#plugin-1372993989-root) | 为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。 | 试用，备份/可信管理面/明确人工验收，completed按成员报告解读，不能当全自动业务验收。 |
| [dsh-evidence-gate](#plugin-1365519118-root) | 为 DSH 会话提供可切换的证据提示、主张裁定工具及持久活动索引。 | 建议观察，单人本地可作为提醒和线索索引；关键事实须回查原始输出，不能依赖 verified 机器标签自动放行。 |
| [dsh-folderwatch](#plugin-1423215448-root) | 监控目录元数据快照变化，经批处理与路径回声过滤后唤醒或排队通知DSH Agent，提供挂载、检查、触发和移除工具。 | 观察，先可信单profile窄目录queue核扫描/接收/恢复，不作为可靠生产触发或多用户隔离。 |
| [dsh-github-router](#plugin-1339462797-root) | 提供PR、Issue、文件及API只读工具，通过API、gh、Git、HTML与可选镜像在宿主内降级取数。 | 先观察；公共仓库单用户隔离环境可对照，私有多身份/共享存储先解决缓存与授权边界。 |
| [dsh-hdc-bridge](#plugin-1333258432-root) | 为 DSH 集成鸿蒙设备调试、截图/UI操作、官方知识查询及可选 DevEco 构建签名流程。 | 建议观察，先核对core作用域和面板权限；显式target与工程、使用无真实数据设备，确认状态绑定后再决定受控试用。 |
| [dsh-jev-guard](#plugin-1378138611-root) | 在shell执行前调用Jev判定不可逆删除或覆盖风险，并给出允许、改写、阻断或升级结果。 | 有高风险shell自动化的团队值得观察，试用前应以真实命令集测漏拦截、误拦截和Jev不可用时的策略。 |
| [dsh-leak-guard](#plugin-1422091204-root) | 发布前本地遍历文本和敏感文件名，按凭据模式返回位置、级别与六字符预览，提供scan和rules工具动作。 | 先观察，仅额外线索，不自动发布；先修覆盖/错误/预算状态，保留独立扫描与人工审查。 |
| [dsh-lighthouse](#plugin-1422364992-root) | 按显式名册汇总作品本地、GitHub、市场、npm和PR等待，提供面板/工具/CLI及落盘卡片。 | 先观察，公开本机使用也核PR/权限/失败状态。 |
| [dsh-lsp-csharp](#plugin-1344713526-dsh-lsp-csharp) | C# LSP 配置包，将 .cs 文件路由给外部 OmniSharp stdio 服务器和 DSH 共享 LSP 基座。 | 确认安装形态：若仅有 OmniSharp.dll，配置 command=dotnet 和 DLL 绝对路径；在真实 .sln/.csproj 测四操作。 |
| [dsh-lsp-go](#plugin-1344713526-dsh-lsp-go) | 以 gopls 为外部服务器的 Go LSP 配置包，复用 DSH 共享 LSP 基座。 | 先安装/验证 gopls，挂共享基座，再以真实 go.mod 项目试定义、引用、实现、hover；详见[Q03](#research-q03)。 |
| [dsh-lsp-java](#plugin-1344713526-dsh-lsp-java) | 在 DSH 中为 .java 文件配置 Eclipse JDT 语言服务导航。 | 已有 Java 环境者可对小项目试用，等索引完成并核对四项结果；若主要在成熟 IDE 中工作或无法维护独立 workspace，暂不增加此依赖。 |
| [dsh-lsp-kotlin](#plugin-1344713526-dsh-lsp-kotlin) | 为 DSH 接入 Kotlin 语言服务，配置 .kt/.kts 导航路由及外部 kotlin-language-server 启动参数。 | 建议观察，先核对包可取得性、宿主版本与外部 server，再在小 Kotlin/Gradle 工程分别验 .kt 和 .kts，避免仅按包加载判断成功。 |
| [dsh-lsp-lua](#plugin-1344713526-dsh-lsp-lua) | 以 lua-language-server 为外部服务器的 Lua LSP 配置包，默认 --stdio 与 .lua→lua。 | 先核 lua-language-server --stdio 和共享基座，再以真实 Lua 模块试四操作；详见[Q03](#research-q03)。 |
| [dsh-lsp-php](#plugin-1344713526-dsh-lsp-php) | 为 DSH 预置 PHP LSP 的服务器命令与扩展名映射，并复用共享 stdio 底座。 | 当前建议观察；若能获得包并已配置底座，可先在隔离工作区检验四操作、故障提示和移除行为，再决定是否小范围试用。 |
| [dsh-lsp-pyright](#plugin-1344713526-dsh-lsp-pyright) | Python/Python stub 的 Pyright LSP 配置包，委托 DSH 共享基座启动外部 pyright-langserver。 | 先确认 pyright-langserver 在 DSH 执行环境 PATH，使用实际 .py/.pyi 与 venv 项目测试；详见[Q03](#research-q03)。 |
| [dsh-lsp-ruby](#plugin-1344713526-dsh-lsp-ruby) | 为 DSH 的 .rb 文件预设 ruby-lsp 路由和语言服务配置。 | 先选定解释器与 Gemfile，明确全局或 bundle 启动，再对真实项目的跨文件查询试用；不把单文件 smoke 外推。 |
| [dsh-lsp-rust](#plugin-1344713526-dsh-lsp-rust) | 以 rust-analyzer 为外部服务器的 Rust LSP 配置包，复用 DSH 共享基座。 | 确认 rustup 组件、rustc 与 DSH PATH；用真实 Cargo workspace 试四操作、首次索引；详见[Q03](#research-q03)。 |
| [dsh-lsp-swift](#plugin-1344713526-dsh-lsp-swift) | 为 DSH 接入 Swift 的 sourcekit-lsp，配置 .swift 文件导航所需的服务器命令和语言映射。 | 建议观察，先核包与工具链来源，在小 SwiftPM 工程构建后分别验四操作；失败构建时只记部分可用。 |
| [dsh-lsp-ts](#plugin-1344713526-dsh-lsp-ts) | 以外部 TypeScript language server 为 TS/JS 文件提供四扩展路由的 DSH LSP 配置包。 | 先核主机 server、共享基座，再在真实 TS/TSX/JS/JSX 项目试四操作；详见[Q03](#research-q03)。 |
| [dsh-mermaid](#plugin-1334569498-root) | 在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。 | 适合经常看Mermaid图的人先用小图试用，保留strict和合理限制，报错先复制后决定是否发AI；卡顿、异常交互或草稿覆盖就停相关路径。 |
| [dsh-modernize-code](#plugin-1344714334-root) | 通过 Skill 和两个 Python 工具辅助遗留代码预检与热点扫描；迁移方案与改码依赖模型/人工。 | 用隔离副本运行两工具，限定 out，人工标注热点、运行真实构建/测试后再定路线图；详见[Q03](#research-q03)。 |
| [dsh-multi-folder](#plugin-1334119885-root) | 为DSH项目配置副工作目录，保持主cwd并将原文件和shell工具按单次目标重定根，附UI与@发现。 | 观察，继续从无碰撞稳定身份、store不落Agent写根及明确UI能力约束着手。 |
| [dsh-mysql](#plugin-1337916824-root) | 在DSH设置管理多套MySQL连接，会话选择目标数据源，模型可查看表结构、查询，并在独立授权后执行行写与DDL。 | 先观察。 |
| [dsh-openai-oauth](#plugin-1335992154-root) | 为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。 | 可试用为本机独立模型provider，保护明文凭据与真实工具审批，保留替代路由；不外推远程部署/静态模型全部可用/免费。 |
| [dsh-organism](#plugin-1366089972-workspace-plugins-dsh-organism) | 以器官模型聚合 DSH 工具，提供心跳体征、反射、代理调用和工具显影。 | 先隔离核 body_map/status 与宿主工具表，再分别启用门控和反射；保持最小权限与直接调用回退。 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。 |
| [dsh-plugin-gate](#plugin-1336663986-root) | 向 DSH Agent 提供插件源码静态扫描、风险差分/报告及破坏性操作建议工具，以 systemPrompt 提醒调用。 | 只在明确源码版本上扫描，逐项审阅 hits、notes 和 filesScanned；对高权限插件增加人工/沙箱审查。 |
| [dsh-plugin-ide-hub](#plugin-1397817235-root) | 汇总多IDE本地会话与用量、手填额度建议和日程规则，生成共享提示词指针并导出Obsidian快照。 | 先观察，可信本地只读盘点优先，规则写入先dry-run和Git备份。 |
| [dsh-plugin-market](#plugin-1367597810-root) | 在 DSH 设置页展示社区目录、已安装与可更新项，并触发插件安装。 | 建议观察；web profile 中可浏览目录，但点击安装/更新前须核来源、版本、目标，完成后重启检加载。 |
| [dsh-plugin-task-forge](#plugin-1399011094-root) | 将需求组织为版本任务书，导出跨窗口交接包，并记录回读状态、缺口答案与任务台账。 | 先观察，修ACK缺口和作用域/版本边界再评估单写者，不把READY当理解或权限证明。 |
| [dsh-plugin-veriscope](#plugin-1422943787-root) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。 |
| [dsh-pr-description](#plugin-1344714177-root) | 读取分支差异生成 PR 标题和五段描述，可选确认、保存与调用 gh 创建 PR。 | 先显式给 base 和安全输出路径，生成本地草稿并核对动机、测试、breaking；只有明确要发 PR 时才启用 openPr。 |
| [dsh-progress-viz (plugin)](#plugin-1334481905-plugin) | 把 DSH 语义会话事件即时投影成进度 JSON，供独立 Python 看板读取。 | 先把 JSON 当辅助状态并对照会话真相，修复/规避空闲恢复和估价问题后再作为运行监控依据。 |
| [dsh-project-memory](#plugin-1339316901-root) | 索引项目文档与代码符号，分层召回经验和insight，并将任务记录跨会话保存。 | 先单项目非敏感语料和少量人工经验试用，反思/扩展保持默认关；核原文、trigger正文和global，重要规则保权威原件。 |
| [dsh-qa-suite-n23](#plugin-1353726715-root) | 提供编辑后 TypeScript 诊断工具和本地多镜头代码审查命令。 | 先独立使用并复核 code_check 的项目根和时间，重要审查问题需要源码复现；跨项目或自动放行场景暂观察。 |
| [dsh-reaper](#plugin-1423215373-root) | 扫描监听端点并给进程归属分级，预览后代终止计划，经confirm后结束进程并检查端口。 | 先观察，以只读诊断为限；身份/后代保护/取消与精确端点协议补齐后再评估受控试用。 |
| [dsh-repeat-stop](#plugin-1339262076-root) | 在 DSH 中按 Agent 拦截超过阈值的连续同工具同参数调用，支持过滤与用户消息重置。 | 建议观察。 |
| [dsh-restart-dock](#plugin-1424433303-root) | 在 DSH Web 界面提供可拖动的刷新/Windows 宿主重启坞，并用独立 helper 留下重启报告。 | 只建议 Windows DSH 插件开发者观察使用，先在无重要任务环境完成 dry-run、一次真实停拉和手工救援演练。 |
| [dsh-restart-planner](#plugin-1422176522-root) | 让代理排程宿主自重启，等待会话落盘后由外部 helper 停拉进程并向原会话投递继续提示。 | 仅建议具备救援入口的插件开发环境观察；先 dryRun，随后在空闲会话做一次 confirm=true、resume=false 的真实重启，再单独验证恢复投递。 |
| [dsh-session-diff](#plugin-1372976273-root) | 在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。 | 适合用Git兜底的开发者在独立web profile试用，先核对已知改动与显示路径；出现未提示错归因或接管异常就停用，不能当完整审计。 |
| [dsh-settings-hub](#plugin-1347749203-root) | 接管 DSH 设置侧边栏，将第三方 settings.section 聚合、分组并持久化排序。 | 先在 Web/桌面分开安装，检查 native 与多个第三方设置页、拖拽、重载和跨源 API；详见[Q03](#research-q03)。 |
| [dsh-sidebar-git-graph](#plugin-1393980674-root) | 在DSH右侧栏查看当前会话仓库的提交关系、工作树改动和文件差异。 | 本地单用户开发者可先用小仓库试用并与CLI核对；先审查webServer访问控制，出现静默换库、未说明截断或无法解释的差异即回到CLI。 |
| [dsh-skill-creator](#plugin-1344713683-root) | DSH 内四个模型工具，用确定性规则草拟、校验、打包和改写技能描述，可挂载输出目录。 | 隔离 outputDir，先 dry-run 再人工核对 SKILL.md；文本技能再打包并解包核查文件，二进制资源不用当前打包路径。 |
| [dsh-slipway](#plugin-1422359117-root) | 预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉逐文件校验发布字节。 | 有固定 GitHub 发布流程的插件维护者可先在测试组织以 dry-run 和只读 verify 试用；真实 publish 必须由人核对 owner/repo、文件清单、secret 扫描与市场描述后单独授权。 |
| [dsh-snapshot-manager](#plugin-1412896722-root) | 每轮前增量快照工作区，并用预览令牌、事务日志和会话 fork 组合文件/对话回滚。 | 重要仓库不应仅依赖本插件；已有 Git/备份并能理解排除边界的开发者可先观察。 |
| [dsh-spring-admin-kit](#plugin-1412897663-root) | 注册Excel批量导入导出及Thymeleaf/LayUI模板规范两个DSH技能。 | 先观察并修示例，隔离库验事务/重复键/权限和模板渲染后再有限复用；不直接生产套用。 |
| [dsh-ssh-logs](#plugin-1346017360-root) | 通过DSH内置MCP桥提供服务器列表、限量日志读取和固定字符串搜索，使用预设SSH主机与日志根别名返回来源片段。 | 有条件试用。 |
| [dsh-stl-preview](#plugin-1427978231-root) | 在Harness文档预览中查看STL三维网格，显示尺寸、体积、表面积与水密性检查。 | 建议有STL检查需求者先用小网格试用，明确单位并保留切片器复核；内存紧张、要求制造质量或不可信超大文件时暂缓。 |
| [dsh-subagent](#plugin-1425006726-root) | 把多个已登录的外部编码 CLI 注册为 DSH 子代理并提供进度与恢复。 | 适合已安装并信任多个 CLI、能写出自足任务并独立验收结果的开发者做受限试用；敏感仓库或无法授予 headless 权限的环境不应启用。 |
| [dsh-subagent-role-router](#plugin-1421306160-root) | 按探索、规划、修补角色为子代理分配模型候补池，并处理故障转移与 fork 窗口切片。 | 适合已经并行使用多个子代理、拥有多供应商额度且能审查路由日志的团队做隔离试用；单模型、强合规固定路由或不能容忍凭据切换的环境不宜启用。 |
| [dsh-task-monitor](#plugin-1406156934-dsh-task-monitor) | 在侧边浮层汇总任务环境、Git、技能、MCP 与发布动作。 | 保持观察；不要在含生产 remote 的工作区启用写动作，先用一次性仓库核提交、推送、切支和发布失败恢复。 |
| [dsh-taskswarm](#plugin-1333800488-root) | 为DSH按任务包依赖分波并行调度worker，以Git worktree、检查点、状态/邮箱和review/merge流程集成代码产出。 | 先观察，不将默认自主流程视可靠接受门；可丢弃仓库研究需独立强制CI/人工SHA验收及权限/预算/网络控制。 |
| [dsh-token-billing](#plugin-1335139860-root) | 在DSH会话中显示实时token费用，结合路由价目与政策时间线，保存跨会话账本并提供统计、余额及CSV/JSON导出。 | 先观察。 |
| [dsh-tokenrhythm-bill](#plugin-1351903192-root) | 在DSH侧栏集中查看基元及可选四平台的余额、模型价格和用量，管理多账号会话与平台密钥。 | 先观察，先核宿主敏感路由访问边界、缓存身份与凭据写入并发，再考虑可信单人环境只读单平台评估。 |
| [dsh-trellis](#plugin-1335559646-root) | 为DSH提供功能、缺陷和重构三轨任务产物、步骤状态、会话恢复提示及Web看板。 | 可试用为人工复核开发任务辅助，先备份同名Skill并核自动覆盖；独立保存批准/验证与固定代码版本，不以标签或只读过滤代授权。 |
| [dsh-undo-plugin](#plugin-1338526178-packages-bundle-rollback) | 为DSH组合会话回退、私有Git文件快照、归档管理和回退界面。 | 观察，备份且独占的本地Git文件任务可继续探讨，勿将聊天消失当所有副作用撤销。 |
| [dsh-update-checker](#plugin-1334836615-root) | 在DSH GUI检查主程序和第三方插件版本，提供备份更新回退与Web重启流程，Desktop主程序转原生更新。 | 当前不推荐日常安装，先修拒绝零副作用与阶段回执，再核隔离恢复；不在用户部署运行复现。 |
| [dsh-vercel](#plugin-1425044910-root) | 通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。 | 可信单profile从只读工具试用，写操作核官方结果。 |
| [dsh-verification-receipt](#plugin-1333370288-root) | 被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。 | 有条件试用，精确支持宿主+私有一进程一文件，将其当启发式观察摘要，不作验证通过/防篡改审计。 |
| [dsh-verify](#plugin-1335843750-root) | 执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。 | 建议可信本地有限spec试用，故意缺陷应失败、合法实现应通过；空覆盖、新基线和ERROR不放行，host阻塞或范围不清时停止。 |
| [dsh-which](#plugin-1423215529-root) | 为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。 | 建议在可信工具链环境限定试用只读报告，关闭默认probe，关键决策用真实shell交叉核对；一旦builtin、别名或cwd不一致，停止据此修改环境。 |
| [dsh-workflow-templates](#plugin-1344715132-root) | 12 个预置 JS workflow 编排脚本目录，提供列出、搜索、渲染调用起点和静态校验四工具。 | 先 list/search，审模板代码及来源；补真实 args 和数据接入，只有明确需要多 Agent 时调用官方 workflow；详见[Q03](#research-q03)。 |
| [dsh-worktable](#plugin-1336092482-01-content) | 在Harness侧栏提供项目容器、分栏窗口、会话绑定与控制室，挂载文件、终端和任务产物。 | 适合愿管理本地目录和会话的Windows个人开发者先用两个低风险项目试用；macOS、多人/高权限共享服务和要求完整自动交付者先观察。 |
| [dsh-wrapup-guard](#plugin-841979943-root) | 用 wrapup_check 记录收尾检查轮次并在三轮空问题报告后提示完成。 | 仅建议隔离项目观察试用。 |
| [dsh-wsl-cred](#plugin-1350379113-root) | 汇总Git helper配置、Windows GCM候选路径与origin类型，但原样helper输出存在敏感配置外发边界。 | 先观察，补最小化输出/明确目标再评估。 |
| [dsh-wsl-distro](#plugin-1350379001-root) | 查询WSL宿主当前发行版与os-release，解析Windows默认/已安装发行版列表，并提示跨发行版路径身份差异。 | 有条件试用，可信本机WSL常规英文列表先看raw/ok并核路径身份；本地化/远端身份/严格治理先观察。 |
| [dsh-wsl-dns](#plugin-1351854118-root) | 在WSL内比较指定域名的WSL与Windows IPv4解析集合，展示首个nameserver及差异/排查提示。 | 观察，先补两侧错误/来源/时间和总预算，mismatch仅现象不作自动修DNS依据。 |
| [dsh-wsl-editor](#plugin-1351854212-root) | 将WSL路径转换后在Windows编辑器打开，支持Code/Cursor行列定位和命令存在查询。 | 显式绝对路径试用并人工确认文档，重试核现状。 |
| [dsh-wsl-encoding](#plugin-1351854402-root) | WSL 编码诊断工具，读取 Windows PowerShell/chcp 状态并可选检查脚本开头的 CRLF。 | 只在可信小脚本路径上附加 path；结合具体乱码/CRLF 命令复核三端编码，不把未采样当成功。 |
| [dsh-wsl-git](#plugin-1381833309-root) | 提供固定Git状态、历史与diff stat摘要，限制返回长度并可设允许目录根。 | 摘要入口试用，完整审查另读变更，确认根与截断。 |
| [dsh-wsl-github](#plugin-1350544211-root) | WSL 场景下用 GitHub App 或 token 回退查询当前仓库的 open PR 与最近 Actions run，另提供配置提示。 | 先以单账号最小权限 App 试用，确认 repo 与 PR/Actions 两字段；多账号需隔离进程或修复缓存。 |
| [dsh-wsl-glab](#plugin-1381859919-root) | 将glab认证概览、MR/issue单页列表和CI文本接入模型工具，脱敏与错误展示仍有缺口。 | 先观察，补输出和状态契约再重评。 |
| [dsh-wsl-jev](#plugin-1381389698-root) | 向 DSH 注册四个 Jev 工具，经 OpenRouter 或 TypeSafe System One 获取 typed 判断。 | 仅低敏任务试点并保存人工标签；check 仍须外部证据或人工确认。 |
| [dsh-wsl-k8s](#plugin-1381726881-root) | 将 kubectl 状态、上下文、get、describe 与日志读取封装为 DSH 工具。 | 建议观察。 |
| [dsh-wsl-net](#plugin-1338965593-root) | 诊断WSL与DSH代理环境、代理TCP端口及HTTP可达性，并生成修复提示和可选子进程代理注入。 | 个人维护环境先禁用注入，有凭据环境先清理报告；不自动执行fix，不把HTTP ok当业务成功。 |
| [dsh-wsl-path](#plugin-1350378631-root) | 在WSL中的DSH提供Linux盘符挂载和Windows/WSL UNC路径文本转换，并附文件系统使用提示。 | 有条件试用，仅默认挂载/同distro/常规绝对路径先人工核身份；多distro或特殊名先观察。 |
| [dsh-wsl-pkg](#plugin-1381861315-root) | 将 npm、pip、cargo 查询接为 DSH 工具，给出有限长度的依赖摘要。 | 配置 allowRoots 后作为快速导航；Python 环境与锁文件/原命令另核，不能用有限摘要做全量结论。 |
| [dsh-wsl-search](#plugin-1381725987-root) | 把ripgrep、fd与ast-grep接成DSH模型搜索工具，检查起始根白名单并限制返回条目和文本长度。 | 可信单用户最小项目根可试用，结果只作线索。 |
| [dsh-wsl-ssh-agent](#plugin-1351854356-root) | 检查WSL宿主SSH_AUTH_SOCK路径、ssh-add身份数量与常见密钥文件名/npiperelay存在，提供转发和认证排查提示。 | 有条件试用，可信个人WSL只读提示，明确存在/身份不等认证；共享桥授权/强治理先观察。 |
| [dsh-wsl-tmux](#plugin-1381833652-root) | 提供tmux状态、会话列表和pane文字捕获模型工具，不发送按键或终止会话。 | 明确server/pane、无敏感内容的可控范围试用，真实任务结果另核。 |
| [dsh-wsl-workspace](#plugin-1334205011-root) | 从DSH界面创建WSL工作区，使会话命令、文件操作和搜索在选定发行版中协同运行。 | Windows 上长期使用 WSL 工程者可在隔离项目试用，先核对双平面权限边界与固定 DSH 版本。 |
| [dsh-wsl-workspace](#plugin-1351853812-root) | 列出 WSL 发行版并检查 Linux 工作区路径，提示避开 /mnt 性能与语义陷阱。 | 建议试用。 |
| [embedded-workbench](#plugin-1276714299-root) | 为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。 | 先验证安装与注入，再以专家任务检行为；保留关闭门禁开关并单独考察 Skill 效果。 |
| [harness-github](#plugin-1343702731-root) | 为DSH提供GitHub仓库、PR、issue、CI与评审工具，通过gh或REST读取和操作，并提供工作流指引。 | 先观察，暂不依赖当前审批边界做日常写操作。 |
| [J-Space Cognition Suite DSH适配](#plugin-1344270011-root) | 将J-Space问题拆解、持久控制器和工作区账本作为DSH Agent预设接入。 | 建议兼容环境下的复杂工程任务先单Agent试用，明确合作协议与真实门禁区别；简单任务先用原生工具，不据上游实验宣称收益。 |
| [LogicProbe](#plugin-1331586818-root) | 为 DSH 提供状态机、数据模型、结构、并发线索和 UML 检查工具与 Skill。 | 适合愿意人工检查模型的开发者在小型状态机上试用。 |
| [MC Mods Dev Bridge](#plugin-1426070939-root) | 驱动真实 Minecraft 服务端与客户端运行场景 JSON，采集探针证据并覆盖 Fabric、Forge、NeoForge。 | 适合维护 MC 26.3 多 loader 模组、已有合法实例且能承担真实进程成本的团队观察；先只做 preflight 和一个 smoke 场景，验收 teardown、证据目录、/mods 双侧一致与端口恢复。 |
| [model-usage-plugin](#plugin-1334569518-root) | 在DSH Web设置中展示模型token、估算费用、工具指标、使用趋势与DeepSeek账户余额，并从会话日志补充历史日账。 | 先观察。 |
| [oh-my-dsh](#plugin-1379204512-root) | 为 DSH 提供多智能体编排、角色资产、状态工具、团队运行时与恢复机制。 | 适合已经有长链路、多阶段或并行冲突任务，并愿意维护 `.omd` 状态的 DSH 团队先观察；普通单文件任务继续用原生 goal 或直接工具。 |
| [orchd项目任务面板](#plugin-1422240642-root) | 在DSH右侧栏显示会话项目的orchd任务、依赖图、想法和审查时间线，并提供接入指令。 | 观察，从可信引擎、受权session和检测接线边界继续研究。 |
| [Plan Lattice](#plugin-1334504487-root) | 在 DSH 历史替换后恢复原生任务依据，并可显式启用完整执行门禁。 | 先用作者公开稳定包/候选在相同 DSH 版本隔离试点，重点比较替换后权威保真和门禁对合法写入的影响；无需把 rc.8 或机制比例当生产收益，详见[Q03](#research-q03)。 |

<a id="plugin-1377185339-root"></a>

## [@240xu/dsh-session-lazy-view](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md)

[![npm 30d 1,359](https://img.shields.io/static/v1?label=npm+30d&message=1%2C359&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-session-lazy-view) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-session-lazy-view)

> **用途**：面向排查超大会话最后发生了什么的Harness维护者。合格输出是可追溯到会话和seq的最近事件，而非替代完整轨迹或修改会话；原办法为完整解压后检索。多帧格式使读取尾窗口具有针对性增量，旧单帧没有同等收益。

> **亮点**：多帧尾部读取把“找最近事件”从完整解压拆成有界窗口查看，并把seq、turn和遮蔽投影组合为只读诊断入口；收益依赖多帧文件与局部问题，不代表全文检索有界。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：“惰性”仅对tail和fast统计成立，搜索/全统计先分配文件大小buffer；搜索匹配文本化后最多2000字且有500帧上限。路径防护是词法normalize前缀，未解析realpath，因此不能把根目录边界称为抗符号链接隔离。参见[Q03](#research-q03)。

> **建议**：可把搜索改为带文件身份与大小边界的逐帧流式游标，返回已扫字节/seq及截断原因，缓存只绑定不可变前缀。对照当前实现用追加、截断、超大帧和长文本测峰值内存与漏检；内存未降或漏检上升则否定，维护索引成本也须计入。假设未验证。参见[Q05](#research-q05)。

<a id="plugin-1345209661-packages-dsh-tech-lead"></a>

## [@240xu/dsh-tech-lead](../../plugins/240xu--verdict-engine--packages-dsh-tech-lead/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/240xu/verdict-engine)

> **用途**：已有 DSH 工程代理希望对状态、证据、计划和评审材料做重复、可复核的规则检查。

> **亮点**：将工程治理规则变为可反复调用的只读函数，辅助发现已提供材料的不一致。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：调用方控制事实与身份，空分类输入默认 T0；旧式裸结果超过 500 条静默截断。Gate 的 pass 不是实际授权或独立评审。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：对缺失高风险输入 fail-closed、所有输出加完整性元数据，并接入锚点/身份对账后才能进一步承担强治理角色；现版未实现。详见[Q04](#research-q04)。

<a id="plugin-1336870027-root"></a>

## [@7dgroup/dsh-skill-7d-git-commit](../../plugins/7dgroup-ai--dsh-skill-7d-git-commit/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit)

> **用途**：采用 7DGroup commit 约定的团队希望代理在提交前稳定生成类型、范围、主题、正文等结构；基线是把规范复制进仓库 AGENTS 或人工审查。合格结果是消息符合仓库约定且不替用户执行未授权提交，本地项目规则能覆盖包内默认。 详见[Q01](#research-q01)。

> **亮点**：相对复制 Markdown，它提供可安装、可版本化且可被本地同名规则覆盖的规范载体；增量主要是分发和优先级接线，不是新的 Git 算法。其价值取决于团队确实使用 7DGroup 约定，通用 Conventional Commits 团队可能只需更小的本地说明。 详见[Q03](#research-q03)。

> **思考**：关键质疑是组织规范是否与目标仓库一致。Skill 内容可指导消息，但无法证明 diff 已审阅、测试已通过或提交得到授权；若被更高优先级同名 Skill 阴影，安装包存在却不生效。把格式合规误当提交质量会放大自动提交风险。 详见[Q04](#research-q04)。

> **建议**：未验证假设是将组织级提交 Skill 与服务端 hook 共享同一机器可读规则，可减少代理建议与 GitLab 拒绝规则漂移。最小验证在 50 个历史 diff 上比较人工消息、仅 Skill、Skill+同源 hook，统计一次通过率、语义误分类和人工修订分钟；hook 与 Skill 不一致仍频繁发生即否定。 详见[Q08](#research-q08)。

<a id="plugin-1334304098-packages-helmd"></a>

## [@adwmc/helm-d](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md)

[![GitHub ★ 431](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=431&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)

> **用途**：需要在 DSH 内组织授权安全分析材料和工具流程的研究者可用它围绕移动端、Web 与原生安全分析提供参考路由、案例台账、解锁门控、提示注入和脚本工作台；合格结果是任务被路由到适当参考与工具，授权范围可见，分析过程与结论能回写案例。详见[Q01](#research-q01)。

> **亮点**：把知识路由、工具闸门、案例账本与宿主提示生命周期组合为面向安全分析的工作台。它相对“手工维护安全分析笔记、脚本目录和任务清单，再由研究者自行选择工具”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **思考**：大量参考和脚本扩大能力面也扩大授权、依赖和版本维护面；静态存在不证明目标环境可用或分析结论正确。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

> **建议**：未来可探索：可把每次路由、解锁和脚本执行绑定到案例的授权范围与证据哈希，形成可审计的安全分析执行图。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

<a id="plugin-1366089972-workspace-plugins-dsh-zero-residence"></a>

## [@dsh-external/dsh-zero-residence](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：面向工具结果很长、历史不断重复送模型的DSH会话。插件用确定性指针清单替代LLM压缩摘要，提供recall、近似token账本与强制压缩探针，并附带后台PowerShell命令句柄。场景应限于有可靠持久日志、能按需读取旧工具内容的可信环境。

> **亮点**：把确定性callId指针接入BasicCompactionEngine，提供owner/probe和日志召回，减少摘要步骤模型调用。详见[Q02](#research-q02)。

> **思考**：recall对call/result首个同ID即返回、叙述无seq恢复且有限量截断，不能普遍无损；强制arm全局。fast直接pwsh无宿主策略/取消/配额，缺error监听，内存jobs不支持重载旧handle恢复。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索完整对象hash验收后再驱逐、session/type绑定指针与agent绑定arm，后台任务走宿主托管并持久化取消/恢复收据；未实现。详见[Q06](#research-q06)。

<a id="plugin-1344713526-dsh-lsp-cpp"></a>

## [@dsh-lsp-packs/dsh-lsp-cpp](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：C/C++ 仓库中的代理需要跨文件定义、引用、实现和 hover；基线是 grep/rg、编译器诊断或手工启动 clangd。合格结果是.c/.h/.cpp/.hpp/.cc映射正确、首次查询惰性启动每工作区进程、缺 server 返回结构化错误，跨文件精度可由 compile_commands.json 复现。 详见[Q01](#research-q01)。

> **亮点**：相对手工配置，它把 clangd 默认值、扩展映射、依赖约束和缺 server 降级封装为可安装 pack；十二语言包复用同一基座，增量是 C/C++ 配置而非实现 LSP。没有 compile database 时只能做有限单文件导航，价值取决于项目构建信息。 详见[Q03](#research-q03)。

> **思考**：核心质疑是“即插即用”是否会被误解为无需工具链/编译数据库。插件不下载 clangd，复杂宏、生成头、交叉编译和多配置项目若缺 compile_commands.json 会给错误或不完整结果；长期 clangd 进程占资源，server版本与参数兼容未固定。 详见[Q04](#research-q04)。

> **建议**：未验证假设是由 pack 自动检测 compile_commands 缺失/过期并向模型标记“导航置信度”，可减少错误跳转被当事实。最小实验在20个含宏/生成头/多配置的C++查询上比较有无提示组的正确定位率、无结果率和错误引用率；提示不能降低错误采纳即否定。 详见[Q08](#research-q08)。

<a id="plugin-1324229194-dsh-autocompact"></a>

## [@indexyz/dsh-autocompact](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 735](https://img.shields.io/static/v1?label=npm+30d&message=735&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)

> **用途**：给需要按provider/model调整长会话压缩时机的开发者，提供会话覆盖与部署阈值；合格结果仍是任务约束保留和总费用可接受，不是占用数字变小。

> **亮点**：在原生压缩上增加不改真实窗口的精确route阈值控制，并保护当前surface配对和tail；它明确是pi-autocompact的DSH移植，摘要算法仍属于宿主。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：提前阈值是触发尝试而非硬上限，缺后台/容量、不可拆范围或失败都会继续；更早摘要可能增加费用与语义丢失。pill不显示内存会话覆盖，持久默认不等于实际有效阈值。参见[Q03](#research-q03)。

> **建议**：可加入按任务约束校验的阈值实验收据，并把有效阈值及来源投影到UI；对照原生与多个提前值，记录摘要费、合格任务、遗漏与恢复工时。净成本不降或约束丢失上升则否定；假设未验证，验证本身有调用/人工负担。参见[Q05](#research-q05)。

<a id="plugin-1342524723-root"></a>

## [@y9931666/dsh-plugin-roundtable](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-roundtable) [![npm 30d 1,464](https://img.shields.io/static/v1?label=npm+30d&message=1%2C464&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable) [![最新发布 2026-10-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable)

> **用途**：为需要多个观点、人工拍板和可留档评审的方案维护者，把主持会话组织成持久专家讨论；合格交付是观点、证据与决策可追踪，不是专家人数或拓扑图本身。

> **亮点**：将专家持久身份、发言留档与即时唤醒分开，并把红队观点、人类表态与修订轮次结构化；贡献是协作责任与可检查记录，不是独立证据或多模型必然更准。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：预算门按发言字符估算，真实usage仅状态派生且冷节点不可测；网关按发言顺序拼接后整体截前4000字符，后续观点可能消失。角色讨论和支持表态不能替代缺陷复现，图上的边也不能自动等同严格执行流程。参见[Q03](#research-q03)。

> **建议**：可用按轮次/观点ID的增量汇聚收据，明确覆盖/遗漏与未决冲突，再以真实请求预算而非文本量限制新唤醒。对照单Agent和当前圆桌同预算任务，若质量不升、关键观点仍漏或实际费用越界则否定；假设未验证，追踪和收据会增上下文成本。参见[Q05](#research-q05)。

<a id="plugin-1336021761-root"></a>

## [7d-code-reviewer](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer)

> **用途**：团队希望用统一结构辅助审阅代码改动和整理可读报告。

> **亮点**：封装五步审查、严重度/四维评分和报告样式，使输出结构一致。详见[Q01](#research-q01)。

> **思考**：没有确定性报告渲染器，动态 HTML 转义/占位符完整性只是 Skill 文本要求；评分无校准。详见[Q02](#research-q02)。

> **建议**：加入安全模板渲染与残留占位检查，并用已标注缺陷集校准严重度/分数，可提高可复核性；待验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="plugin-1404700411-root"></a>

## [agent-development-constraints](../../plugins/962599627--agent-development-constraints/INSIGHT.md)



> **用途**：面向反复用AI开发、已积累错误案例而想减少重犯的人。主体是项目内constraints规则库、按技术栈的坑位、DISTILL/PRUNE/MERGE文档流程、可选脱敏hook，以及DSH读取规则/观察上下文成本的工具面。规则要求触发、检查和证据，目标让复盘可复用而不是保存长日志。

> **亮点**：把规则/触发/检查/证据模板、症状索引与DSH一次入口提醒连接，减少复盘只留长日志的问题。详见[Q02](#research-q02)。

> **思考**：非每步强制执行；当前DSH面跨home日志/写probe/cache与隐私承诺不符。status无独立守卫且全局last资料可能混会话；Linux基线缺失/标记替换及自改资产保留有边界。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索项目/版本/适用/检查证据收据、plugin来源/session授权缓存与路由、安装diff/备份及ID+hash基线，比较误触发与资产保留；未实现。详见[Q07](#research-q07)。

<a id="plugin-1401618027-root"></a>

## [AI Look-Up](../../plugins/1344738825--ai-look-up/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1344738825/ai-look-up)

> **用途**：面向长时间运行编码代理的用户，在重复命令、无产出密集调用或目标漂移时获得可见的收束提醒。 [Q01](#research-q01)

> **亮点**：相对人工盯守日志，它把行为节奏检测、独立审查和提示注入放进宿主事件链，并保留静态降级；增量在持续监督接线和多种漂移信号组合。 [Q03](#research-q03)

> **思考**：触发阈值与“生产性工具”名单会把探索性工作误判为漂移，独立审查还增加调用成本；尚无对照数据证明提醒减少返工而不增加打断。 [Q04](#research-q04)

> **建议**：可把提醒升级为可归因实验，每次随机延迟一小部分提醒并比较后续有效编辑、任务完成与人工接管，从而学习不同任务的阈值。 [Q08](#research-q08)

<a id="plugin-1406611614-root"></a>

## [AI 残渣清运](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md)



> **用途**：面向代理频繁生成探测脚本、备份、日志和缓存的项目，在不直接删除文件的前提下恢复整洁并保留结项清单。 [Q01](#research-q01)

> **亮点**：相对 `find` 加删除脚本，它把自动清理改成可逆移动，并用 open/close 项目状态保护进行中的产出、在结项时分类归档和改写引用。 [Q03](#research-q03)

> **思考**：规则匹配仍可能把有价值但命名像临时文件的材料移走，后台 detached 进程也无法让当前回合确认最终结果；可恢复降低损失但没有消除误分类。 [Q04](#research-q04)

> **建议**：可加入“来源感知清理”，要求候选文件同时满足命名规则和本回合创建记录，再用清单预览训练项目级白名单，降低误收。 [Q08](#research-q08)

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

> **用途**：希望保留DSH原生会话入口并使用Kimi执行核心、需要在模型间继续工作的开发者。

> **亮点**：相对提示词替换，已实现增量是完整执行核心与DSH原生入口的桥接，以及显式审批/会话映射；核心能力归固定上游Kimi，不计为插件原创。[Q01](#research-q01) [Q02](#research-q02)

> **思考**：“同一会话”不等于两边状态无损一致。pending避免未知结果重复执行，但用户承担多存储备份与人工恢复，外层token统计也不完整；这些限制直接约束持续采用。[Q03](#research-q03)

> **建议**：未验证假设是跨harness交接回执能显式暴露历史、图片、压缩、计费与未确认副作用范围，减少误继续；以故障注入后的遗漏识别与实际重复执行次数对照验证。[Q04](#research-q04)

<a id="plugin-1423488109-root"></a>

## [DSH Model Everything](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md)

[![npm 30d 415](https://img.shields.io/static/v1?label=npm+30d&message=415&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model-everything) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model-everything)

> **用途**：需要检查复杂行为断言及保存反例/报告的开发者，目标是对明确模型性质给出可追溯判断。

> **亮点**：已有增量是把断言核验、有限模型执行、反例和可复算报告接入DSH工作流，报告明确区分跳过、未决和判定；有限状态方法本身及外部检查器不是插件原创。[Q01](#research-q01) [Q02](#research-q02)

> **思考**：忠实抽象是贡献成立的前提。模型pass、规范化hash和工具ok均不能证明源码程序安全；漏掉现实异常或截断搜索时必须收窄结论，构模成本也可能超过简单办法。[Q03](#research-q03)

> **建议**：未验证假设是性质—源码—模型映射—可回放反例的最小证据闭环，能减少模型正确而程序有错的假放行；以已知缺陷和遗漏迁移对照，计入构模/复核成本。[Q04](#research-q04)

<a id="plugin-1353534254-root"></a>

## [DSH Model Router](../../plugins/alice-marx--dsh-model-router/INSIGHT.md)

[![GitHub ★ 281](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=281&color=yellow&logo=github&style=flat)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 4,168](https://img.shields.io/static/v1?label=npm+30d&message=4%2C168&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router)

> **用途**：已配置多模型的开发者需要对依赖任务形成可解释的分配与执行记录；合格结果包含实际交付与验收。

> **亮点**：相对手动单模型分配，实质增量是把依赖约束、可行性和成本不确定性纳入统一计划，并将执行结果回接账本。质量评分仍为代理，贡献限于可解释编排机制。[Q01](#research-q01) [Q02](#research-q02)

> **思考**：代理质量能否约束真实交付，是成本感知路由是否有用的关键。字符token估计、配置价格和历史评分均不能替代同任务实测；不完整尝试账本保留未知，反馈不等于准确率。[Q03](#research-q03)

> **建议**：未验证假设是用任务匹配的客观通过证据形成保守可行域，再用显式人工反馈微调选择。应对照固定模型与当前算法，并计入失败重试和人工复核；收益消失或依赖额外预算即否定。[Q05](#research-q05)

<a id="plugin-1409845351-plugins-dsh-orchestrator2"></a>

## [DSH Orchestrator2](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2)

> **用途**：面向需要把需求、设计、开发、审查和人工测试串成可追溯任务包的软件负责人。合格交付是有验收证据且人工测试通过的软件版本，不能把多Agent输出或状态文件完成当交付。相对普通Agent加任务清单，它要求采用v2.1六区结构、冻结设计、预算台账和角色分工；简单修改可能得不偿失。

> **亮点**：将任务包、预算预登记、设计冻结和持久角色路由组合为可追溯协作流程，先绑定再启动减少路由竞争窗口。[Q03](#research-q03)

> **思考**：派工成功回执要求后台参数false，但角色工具明确拒绝false；同时旧目录同步的实际副作用与移除声明冲突，需先核对。[Q04](#research-q04)

> **建议**：未验证假设是把派工协议写成单一可执行状态契约，生成工具参数、成功回执及persona对应段，并在启动前做无副作用协议检查，能减少“回执要求工具拒绝参数”的交接失败。推导来自false参数冲突和旧目录同步漂移。最小验证固定最小任务包，在新旧API宿主mock和真实沙箱分别走begin→角色→end、失败与重启；比较人工修正次数、重复派工及完成率，若漂移仍需手工多处修改则否定单源收益。 [Q08](#research-q08)

<a id="plugin-1344715270-root"></a>

## [dsh-a11y-scan](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md)

[![npm 30d 83](https://img.shields.io/static/v1?label=npm+30d&message=83&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-a11y-scan) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-a11y-scan)

> **用途**：前端开发者把可访问性自动检查接入工具流程，仍需人工确认真实任务与规则覆盖。

> **亮点**：把目标发现、axe错误与命中、修复线索和人工复核接入结构化DSH工具，贡献在编排而非新检测算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：静态服务只作词法目录检查再原生读文件，未核物理路径；浏览器加载本地HTML仍可有网络/脚本副作用，confirmUrl不是授权收据。详见[Q02](#research-q02)。

> **建议**：可探讨扫描能力清单，绑定资源realpath、引擎/规则和网络源，静态服务只暴露计划文件；动态资源兼容成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1354283280-root"></a>

## [dsh-about](../../plugins/1010n111--dsh-about/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1010n111/dsh-about)

> **用途**：用户排障或核版本时，在界面内快速获得版本与更新日志。

> **亮点**：把本地版本与远端 Release 信息集中到 Web 设置页，降低查找步骤。详见[Q02](#research-q02)。

> **思考**：通过 clientModules bundle 路径拼 node_modules 候选无法保证与实际 dsh --version 一致；路由统一 200 且未限 GET。详见[Q03](#research-q03)。

> **建议**：由宿主提供进程版本/commit 与安装来源，并为 Release 标记时间/tag，可提高诊断可信度；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1414323673-root"></a>

## [dsh-agent-recycle-guard](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md)

[![npm 30d 876](https://img.shields.io/static/v1?label=npm+30d&message=876&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agent-recycle-guard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-agent-recycle-guard)

> **用途**：本机项目维护者希望给Agent常见删除提供可恢复缓冲，合格结果是目标与语义不扩大、失败不降级永久删除，不把插件当系统级隔离。详见[Q01](#research-q01)。

> **亮点**：将有限删除识别、真实Shell参数展开和系统回收接入DSH原工具权限链，并在分析失败时拒绝，而非宿主插件直接越过工具执行回收；增量是边界清楚的机制组合。详见[Q01](#research-q01)。

> **思考**：有限脚本检查并不证明任意代码安全，超大、未知编码和深层加载可能放行，路径复核也非原子隔离；这些静态边界必须限制其作为删除缓冲的用途。详见[Q03](#research-q03)。

> **建议**：可探讨最小检查覆盖收据，区分实际读取、跳过和重写内容，再连接最终回收回执；先验证是否减少用户安全误解并控制隐私和日志负担。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1296792947-integrations-dsh-agentdebugx"></a>

## [dsh-agentdebugx](../../plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md)

[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/AgentDebugX/AgentDebugX) [![npm 30d 784](https://img.shields.io/static/v1?label=npm+30d&message=784&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx)

> **用途**：开发者解释Agent失败/重试，需要把已完成会话变成可回指事件的诊断报告；不以无finding当任务成功。详见[Q01](#research-q01)。

> **亮点**：将DSH完成边界、Zstandard日志、模型工具和Python诊断接成一条本地流程，保留deep失败与原任务结果；核心诊断算法仍归AgentDebugX。详见[Q01](#research-q01)。

> **思考**：持久DSH日志分支只作词法root核对后读取，和Python通用轨迹真实路径检查不一致；超时也未见终止后台诊断。静态风险未复现，足以收窄当前采用。详见[Q03](#research-q03)。

> **建议**：可研究绑定确认对象、真实路径/hash、完成边界与取消状态的输入/任务收据，用保存会话及symlink/超时反例验证是否减少错对象诊断与重复执行。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1425045401-root"></a>

## [dsh-ai-armor](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md)



> **用途**：希望在 AI 改码后按事故类型调用定向诊断工具的开发者可用它一次安装注册 Git 回归定位、堆栈解码、配置校验、跨平台 shell 转义和 SQL 静态审计工具；合格结果是输出可回指提交、堆栈、配置或 SQL 位置，并经项目测试或人工复核。详见[Q01](#research-q01)。

> **亮点**：将五个既有子插件统一装载，降低发现与安装入口数量，但没有形成跨工具联合诊断机制。它相对“分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **思考**：其中 bisect 需要执行复现脚本并切换 Git 状态，不能把整包概括为完全不执行代码或无副作用。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

> **建议**：未来可探索：可按场景延迟注册工具，并把 bisect 固定在临时 worktree 与显式命令预览中，降低误选与仓库副作用。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

<a id="plugin-1421741516-root"></a>

## [dsh-ark-coding-provider](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Akiyuki1130/dsh-ark-coding-provider)

> **用途**：面向已有火山方舟Coding Plan订阅和密钥/SSO权限的DSH用户。插件注册ark-coding路由，把兼容OpenAI的聊天/SSE、模型目录、CLI账户与额度界面接到宿主，API Key账户用于聊天，CLI账户还可读套餐/官方目录。不是免费模型、官方产品或替用户购买订阅。

> **亮点**：将专用模型能力/流式与错误分类、多账户HOME/cache、固定CLI/额度统一接到DSH，并在yield后禁止混账号重试。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **思考**：能力/容量是固定作者材料，额度不是账单；HOME只词法prefix、重复ID后者丢弃，冷却仍可请求且偏好优先。usage body不受headers timer完整保护，跨平台进程/授权需核。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索账户/端点/能力版本与请求阶段/终止usage收据、物理HOME和body预算，比较错身份/重复请求及元数据成本；未实现。详见[Q07](#research-q07)。

<a id="plugin-1344714509-root"></a>

## [dsh-asciinema](../../plugins/988hj7tczd-oss--dsh-asciinema/INSIGHT.md)

[![npm 30d 384](https://img.shields.io/static/v1?label=npm+30d&message=384&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-asciinema) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-asciinema)

> **用途**：适合把DSH会话中工具结果的可见文字留成可回看/分享的本地材料。term_rec开始/停止/标记/状态，term_play生成HTML或文本，term_cat拼接输出。不是终端PTY逐字节录像、视频录屏、命令重放或可验证执行审计。

> **亮点**：结合Session对象/ID隔离、单writer事件字节护栏及cast/HTML/文本三入口，减少手工保存工具文字。详见[Q02](#research-q02)。

> **思考**：模板../../定位错误、帧间隔max再求和导致计时偏差，stop先移除再保存无重试句柄/卸载drain；输出含秘密/内容替换与导入上限需核，非官方互通。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索统一时间语义与范围/模板版本/保存pending收据，字面嵌入与失败可恢复，比较完整率/资源；未实现。详见[Q07](#research-q07)。

<a id="plugin-1386463441-root"></a>

## [dsh-cache-bricks](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md)



> **用途**：维护者排查长会话的缓存变化与重试，需要把usage和请求证据关联到对话位置；目标是正确诊断，不是只追求绿色。详见[Q01](#research-q01)。

> **亮点**：把attempt级请求、缓存指标和对话位置组织成可视诊断流程，保留重试和缺字段区别；增量是观察证据与阅读操作的组合，不会自动优化缓存。详见[Q01](#research-q01)。

> **思考**：缓存颜色不能独立解释原因，公式依赖宿主分桶口径；记录会淘汰且敏感blob需要明确访问边界，历史重建也不等于原始请求完整恢复。详见[Q03](#research-q03)。

> **建议**：可探讨在颜色旁显式表达attempt/估算及证据完整性，并要求归因回指可比请求；先用缺字段和淘汰样例比较误归因与操作时间，当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1356896576-dsh-capmap-viz"></a>

## [dsh-capmap-viz](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1741505640/capmap-skills) [![npm 30d 640](https://img.shields.io/static/v1?label=npm+30d&message=640&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz)

> **用途**：面向已经用 CapMap 结构化文档维护能力、主题和依赖的项目成员。输入是 docs root 下的 YAML/Markdown；合格结果是图节点、边、状态颜色、能力面板和派生查询与文件内容一致，工作区切换不串状态，变更后 revision 更新。简单替代是目录浏览、Markdown 搜索或通用图工具。

> **亮点**：相对 Markdown 搜索，它把同一 CapMap 规范直接转为可交互图、状态描边和项目级派生问题，并能在文档变化后刷新。核心增量是领域文档模型与宿主侧栏的结合；d3-force 和 YAML 解析属于成熟组件，图形本身不证明文档代表真实实现。 参见[Q03](#research-q03)。

> **思考**：关键前提是文档持续、准确且有明确来源。解析成功只能证明格式满足规则，不能证明能力已实现、验证门已通过或依赖仍有效；图的视觉权威感可能放大陈旧文档。大图的布局稳定性、可访问性、watch 风暴和多 workspace 内存也未验证。 参见[Q04](#research-q04)。

> **建议**：可让每个能力/关系附 Git blob、代码/测试证据、负责人和 checked_at，把节点状态分成‘声明／实现／验证／过期’，并让 validation gate 只基于有效证据。它可能把漂亮图升级为可审计决策图，但会增加维护字段与证据采集成本。 参见[Q08](#research-q08)。

<a id="plugin-1426954291-root"></a>

## [dsh-ci-diet](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/0disoft/dsh-ci-diet) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ci-diet)

> **用途**：供维护GitHub Actions且愿逐条核业务语义的工程团队，定位重复/长耗时运行并形成小范围可审YAML补丁；交付是有覆盖说明的建议，不是已兑现账单节省。

> **亮点**：把CI节省建议和可写补丁资格分离，结合覆盖、人工声明、精确字节编辑与重校，形成受限本地变更流程；同时不把观测分钟冒充实际账单。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：是否可取消旧run和减少保留期取决于CI之外的发布、保护及工件消费者。代码能在coverage/claim不足时拒写，但人类声明仍是外部前提；历史counterfactual与价目估计不能证明真实收益或用户等待减少。参见[Q03](#research-q03)。

> **建议**：可在补丁后自动生成只读的前后任务/工件可用性收据，绑定同类工作量与实际计费区间，区分规则命中、owner采纳及结果。若必要检查/消费者受损或实际净成本未降即否定；假设未验证，采集与长期观察增加负担。参见[Q05](#research-q05)。

<a id="plugin-1427331352-root"></a>

## [dsh-codex-bridge](../../plugins/ak-blank--dsh-codex-bridge/INSIGHT.md)

[![npm 30d 47](https://img.shields.io/static/v1?label=npm+30d&message=47&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-codex-bridge) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-codex-bridge)

> **用途**：已登录Codex的DSH开发者委派自包含任务，须同时验答案/产物与用量；调用方负责上下文整理。

> **亮点**：把只读额度、委派执行、模型/effort护栏和结构化结果连成DSH双工具，减少手工终端接线。参见[Q01](#research-q01)。

> **思考**：缓存百分比与进程内锁不是额度预留；超时/取消并不回滚已写产物，布尔开关也不能独立证明用户授权。参见[Q03](#research-q03)。

> **建议**：未验证假设为任务预算/产物收据和未知结果先核后续，比较共享消费、中断和截断下的总用量及重复副作用。参见[Q04](#research-q04)。

<a id="plugin-1340906871-dsh"></a>

## [dsh-codex-guard](../../plugins/akimiya-z--codex-guard--dsh/INSIGHT.md)

[![GitHub ★ 133](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=133&color=yellow&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard)

> **用途**：面向希望在DSH编码会话中扫描未提交Git变更的开发者，交付由人复核的TODO/密钥候选报告；需要强制合并门槛时，本组件的字符串报告不足以担当放行依据。

> **亮点**：将既有 CLI 接入 DSH 工具链，并在 Windows 绕过 cmd shell 传参。增量是接线便利和平台适配，扫描算法归属原 CLI。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：工具描述包含提交主题检查，但调用未传 --commits；同时将执行状态折叠成字符串，不能承担可靠放行。参见[Q03](#research-q03)。

> **建议**：未验证假设是固定 CLI 版本并输出覆盖与退出状态收据，受限异步执行可能减少 Agent 把调用完成误作检查通过；需六类故障对照，失败时否定。参见[Q05](#research-q05)。

<a id="plugin-1344714002-root"></a>

## [dsh-dep-vuln-scan](../../plugins/988hj7tczd-oss--dsh-dep-vuln-scan/INSIGHT.md)

[![npm 30d 103](https://img.shields.io/static/v1?label=npm+30d&message=103&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-dep-vuln-scan) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-dep-vuln-scan)

> **用途**：面向在DSH里维护多语言项目、希望先看到锁定依赖是否匹配已知OSV公告的开发者。输入是目录/单锁文件、生态过滤和fast/full，输出包版本、公告、修复建议与可重放报告。插件只建议命令，不运行安装或改锁文件。

> **亮点**：把多生态锁输入、批量ID/共享详情查询与宿主可重放报告统一，减少手工切换；只读建议，不是新漏洞情报或可利用性验证。详见[Q02](#research-q02)。

> **思考**：同生态多锁来源被最后路径覆盖，fixed未按包/区间完整约束且多漏洞仍取最小；扫描cap静默、错误时也可显示0受影响，不能据此clean，未运行真实公告对照。详见[Q03](#research-q03)。

> **建议**：可探索包occurrence来源与四段覆盖收据，并按生态/分支求所有公告修复约束，无法证明时给候选；比较错源/欠修复/假clean与成本，未实现。详见[Q06](#research-q06)。

<a id="plugin-1335980444-root"></a>

## [dsh-diff-approval](../../plugins/9087--dsh-diff-approval/INSIGHT.md)

[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) [![npm 30d 4,906](https://img.shields.io/static/v1?label=npm+30d&message=4%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)

> **用途**：编码用户在宿主中事后审阅已发生的修改，验收决定与实际文件一致，不当写前审批。

> **亮点**：把工具捕获、差异/评论与文件决策连成连续审阅，lineage视图与请求方策略分离可借鉴；算法依成熟库。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：普通回退不做写时版本比较、创建删除不可undo，持久失败不拒动作成功；外改检测/undo预检不能当无损保证。参见[Q03](#research-q03)。

> **建议**：未验证假设为expected hash动作收据、删除恢复包及显式持久结果，批量按已写状态恢复；故障对照检查丢改/误报。参见[Q04](#research-q04)。

<a id="plugin-1424063534-plugins-dsh-domain-bridge"></a>

## [dsh-domain-bridge](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge)

> **用途**：面向按业务域拆分 DSH 会话并需暂停/恢复的用户。输入是域、消息、暂停范围和模型；合格结果是正确目标恰好处理一次，暂停时持久排队，恢复后重评。替代是手工会话表和复制消息。

> **亮点**：把域寻址、持久队列、层级暂停、会话创建和模型分派组成控制面，并区分 create/attach 失败。它复用宿主会话能力，不是隔离系统。 参见[Q03](#research-q03)。

> **思考**：只控制插件介导发送，手动/宿主唤醒和已运行 agent 不受阻断。并发恢复、崩溃与文件写交错可能重复/漏投；子代理无独立模型，切换还触碰全局默认。 参见[Q04](#research-q04)。

> **建议**：加入 message_id、解析版本、租约和消费收据，分开排队/投递/接收/完成；若故障注入下重复漏投不降则否定。 参见[Q08](#research-q08)。

<a id="plugin-1335988605-root"></a>

## [dsh-engineering-workflow](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/82c86b8z86-stack/dsh-engineering-workflow)

> **用途**：团队希望对复杂工程任务进行需求、计划、TDD、委派与验收约束。

> **亮点**：打包五阶段工程方法与 DSH preset/Skill 工具组合，减少手工配置。详见[Q01](#research-q01)。

> **思考**：自动同步同名 preset 目录时无备份覆写用户改动/删除附加文件；默认公告影响未选 preset 的新会话。详见[Q02](#research-q02)。

> **建议**：加入版本化/备份合并与轻量低风险路径、按选中 preset 公告，可降低采用摩擦；待验证。详见[Q03](#research-q03)。

<a id="plugin-1372993989-root"></a>

## [dsh-eteams](../../plugins/2507483326--dsh-eteams/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2507483326/dsh-eteams) [![npm 30d 1,404](https://img.shields.io/static/v1?label=npm+30d&message=1%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-eteams) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-eteams)

> **用途**：需要角色分工和持续交接的DSH任务，需人工定义独立验收与共享目录责任。详见[Q01](#research-q01)。

> **亮点**：把手工多会话交接变成任务合同、成员副本、attempt token和事件/邮箱持久单元，角色可用不同模型；不把本地状态或角色数当效果。详见[Q01](#research-q01)。

> **思考**：非空报告即完成、依赖/链为弱序，spawn和文件不受DB事务回滚；启动10s快扫与60s grace可遗漏近期死尝试。详见[Q04](#research-q04)。

> **建议**：持久受理intent/固定childID、输入产物版本和独立验收收据，延期补判并区分查询未知与死亡，按崩溃/假完成反例证伪。详见[Q08](#research-q08)。

<a id="plugin-1365519118-root"></a>

## [dsh-evidence-gate](../../plugins/aaronandwork--dsh-evidence-gate/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AaronandWork/dsh-evidence-gate) [![npm 30d 888](https://img.shields.io/static/v1?label=npm+30d&message=888&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@aaronandwork/dsh-evidence-gate) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@aaronandwork/dsh-evidence-gate)

> **用途**：面向需要把亲测、引用和猜测分开的 DSH 会话；合格答复仍需逐项复查事实与原始证据。详见[Q01](#research-q01)。

> **亮点**：相较单纯提醒或静态提示，插件把工具活动做成持久、按会话可查的核验线索，并记录亲测/引用/猜测的处理结果；其辅助复核价值取决于模型调用和人工回查，不能称为强制事实门。详见[Q01](#research-q01)。

> **思考**：“已实证”可由同名、子串、单词、跨会话活动或仅存在路径触发，且未核对工具成功、内容、时间和主张语义；弱命中仍返回 verified。这使裁定标签可能超过证据强度。详见[Q03](#research-q03)。

> **建议**：未验证方向是把证据绑定委派关系、成功状态、内容/版本与时间，弱关联降为待复核，并在提交最终答复前检查承载结论的裁定；用固定误判夹具评估假阳性、假阴性和成本。详见[Q05](#research-q05)。

<a id="plugin-1423215448-root"></a>

## [dsh-folderwatch](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md)



> **用途**：面向开发会话等待构建报告、下载或共享目录交接的用户。插件提供五个folderwatch工具与/watch命令，按目录元数据变化生成消息，可wake新回合或queue到后续步骤。它不直接理解报告内容，不保证构建/测试业务成功，也不是文件内容备份或可靠事件日志。

> **亮点**：以快照差分为主、fs.watch提示为辅，结合quiet/上限/冷却与Agent消息入口减少主动查目录。详见[Q02](#research-q02)。

> **思考**：stat递归会跟随目录链接，partial/不可读仍作差分；共享echo不区分成功写或会话，目标失效可fallback别Agent；批次先drain且送达Promise未await。详见[Q03](#research-q03)至[Q05](#research-q05)。

> **建议**：可探索扫描质量/物理root与owner绑定、成功写echo和批次受理ack，比较误报/漏报/错收件和恢复成本；未实现。详见[Q06](#research-q06)。

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

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 1,817](https://img.shields.io/static/v1?label=npm+30d&message=1%2C817&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)

> **用途**：允许 Agent 执行 shell、同时需要对真实数据破坏动作设置额外审批的团队可用它在工具执行前截获 shell 命令，结合本地规则、Jev 判定、一次性令牌和审计记录实施安全闸门；合格结果是危险命令在执行前有明确判定、人工接管路径和可追溯记录，普通命令不过度阻塞。详见[Q01](#research-q01)。

> **亮点**：把语义风险判断置于 tools/pre-execute，并设计 allow/revise/block/escalate 四态与配额耗尽降级。它相对“只依赖宿主审批策略、静态命令黑名单或人工逐条查看命令”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **思考**：外部 Jev 判断、提示设计与命令抽取共同决定结果；源码没有同条件误拦截、漏拦截与区域可用性数据。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

> **建议**：未来可探索：可将高风险命令拆成资源、动作与可逆性结构，再以本地确定性规则和模型复核双层输出减少单次模型误判。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

<a id="plugin-1422091204-root"></a>

## [dsh-leak-guard](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md)



> **用途**：适合开发者在公开仓库/publish/外发目录前，以本地启发式检查现有文本中的凭据线索，再人工复核/移除。基线手工grep/检查文件名或专门secret scanner；插件把规则扫描接入DSH工具并返回脱敏发现，便于模型/人看位置。

> **亮点**：把本地模式/文件名审计整合为DSH工具，按位置级别给克制预览，模块可独立复核；非有效凭据验证。详见[Q02](#research-q02)。

> **思考**：缺失根/权限失败/静默长行与限额可使未完整扫描仍ok=true，工具丢截断且小正数预算可round0；绿灯不能当发布安全证明。详见[Q03](#research-q03)。

> **建议**：可探索complete/partial/error覆盖收据与精确发布对象摘要、正整数预算和范围去重，按合成真值/变更矩阵证伪；未实现。详见[Q06](#research-q06)。

<a id="plugin-1422364992-root"></a>

## [dsh-lighthouse](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md)



> **用途**：多作品发布后的收录与使用线索跟踪。详见[Q01](#research-q01)。

> **亮点**：显式作品名册结合多源状态与可点击看板，少手工切平台。详见[Q01](#research-q01)。

> **思考**：PR首50标题匹配/失败空、无来源HTTP放行可能暴露PAT可见私有信息，无预算遍历与直接覆盖写需补。详见[Q03](#research-q03)。

> **建议**：研究可追溯快照/精确PR身份和受控有界采集写入，比较误诊/披露/恢复成本，尚未验证。详见[Q07](#research-q07)。

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

> **用途**：在 DSH 中查询 Lua 文件定义、引用、实现、hover。

> **亮点**：减少 Lua LSP 装配；不实现协议，详见[Q01](#research-q01)。

> **思考**：宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](#research-q02)。

> **建议**：保留合并扩展并区分配置、服务器和注册错误，反证条件与代价见[Q05](#research-q05)。

<a id="plugin-1344713526-dsh-lsp-php"></a>

## [dsh-lsp-php](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-php/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：已配置 DSH LSP 底座、在本地 PHP 工作区需要模型辅助代码导航的开发者。

> **亮点**：独立 PHP 包将固定服务器启动参数及语言映射接到共享 LSP 底座，减少逐项目重复接线；语言分析与协议能力归外部 server 和底座。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：apply 任意异常都被归为命令不可用，fallback 用默认扩展映射和默认命令日志，覆盖配置后可能误导诊断或丢失自定义后缀路由；这是源码风险，未在本轮复现。详见[Q02](#research-q02)。

> **建议**：可让 fallback 保留解析后的路由，并按错误来源区分诊断；以默认/覆写命令、后缀与非法配置故障对照检验收益和新冲突。尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1344713526-dsh-lsp-pyright"></a>

## [dsh-lsp-pyright](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-pyright/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH Agent 中查询 Python .py 与 .pyi 的定义、引用、实现和悬浮信息。

> **亮点**：减少 Python/Pyright LSP 命令与扩展配置工作；详见[Q01](#research-q01)。

> **思考**：缺服 fallback 捕获所有初始化异常且仅保留默认映射，配置故障可误归因，自定义扩展在故障时失去路由。详见[Q02](#research-q02)。

> **建议**：保留解析后的扩展表并区分缺服/配置/注册异常，可提高诊断准确度；待验证。详见[Q02](#research-q02)。

<a id="plugin-1344713526-dsh-lsp-ruby"></a>

## [dsh-lsp-ruby](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ruby/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：已有 Ruby/Bundler 项目的 DSH 开发者可查询 .rb 符号；合格结果需目标解释器与项目依赖一致并核对跨文件位置。

> **亮点**：把 Ruby LSP 默认命令、参数和扩展映射做成独立可覆盖的 DSH 组合包，节省重复接线；语义分析与协议仍归 ruby-lsp 和官方底座。详见[Q02](#research-q02)。

> **思考**：默认全局 ruby-lsp 未自动匹配项目 Bundler 或 rbenv/asdf 选中的解释器；catch 折叠加载异常，测试的 real-server lane 可能跳过。单文件成功不能证明项目导航。详见[Q03](#research-q03)。

> **建议**：可在启动前报告 Ruby、Gemfile、命令来源与参数的一致性，比较两版本锁定项目中的误报、归因与恢复分钟；未实现。详见[Q04](#research-q04)。

<a id="plugin-1344713526-dsh-lsp-rust"></a>

## [dsh-lsp-rust](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-rust/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH 中对 .rs 文件执行定义、引用、实现、hover 查询。

> **亮点**：减少 Rust LSP 装配；不实现协议，详见[Q01](#research-q01)。

> **思考**：宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](#research-q02)。

> **建议**：在 fallback 保留合并扩展、区分配置/服务器异常可改善诊断；待验证。详见[Q02](#research-q02)。

<a id="plugin-1344713526-dsh-lsp-swift"></a>

## [dsh-lsp-swift](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-swift/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：已有 SwiftPM 项目、Xcode 或 Swift 工具链的 DSH 开发者，可借本包少写 SourceKit 接线；项目索引仍由工具链承担。详见[Q01](#research-q01)。

> **亮点**：相对手工接入 SourceKit-LSP，本包提供 DSH 中的命令、映射与组合行，减少配置重复；Swift 编译索引和 LSP 语义不属于本包实现。详见[Q01](#research-q01)。

> **思考**：SourceKit 可启动不代表引用和实现可用：作者测试在 swift build 失败时跳过这两项，PATH 选错工具链也可能影响索引；不能按定义/hover 成功推断四操作完成。详见[Q03](#research-q03)。

> **建议**：未验证方向是分开展示服务器启动、项目构建、索引就绪和各操作可用状态；用构建成败及双工具链场景比较误报和排障成本。详见[Q05](#research-q05)。

<a id="plugin-1344713526-dsh-lsp-ts"></a>

## [dsh-lsp-ts](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ts/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH 中查询 TS、TSX、JS、JSX 文件的定义、引用、实现、hover。

> **亮点**：减少 TS/JS LSP 命令和语言 id 装配；协议由共享基座实现，详见[Q01](#research-q01)。

> **思考**：宽 catch 可能误判配置故障，fallback 丢失自定义扩展；详见[Q02](#research-q02)。

> **建议**：故障分类并让fallback保留合并映射，可证伪对照及代价见[Q05](#research-q05)。

<a id="plugin-1334569498-root"></a>

## [dsh-mermaid](../../plugins/aks1st--dsh-mermaid/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-mermaid) [![npm 30d 4,196](https://img.shields.io/static/v1?label=npm+30d&message=4%2C196&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mermaid) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-mermaid)

> **用途**：帮助开发者/研究者就地阅读流程与架构图，保留源码核对，渲染不等业务逻辑正确。

> **亮点**：把成熟Mermaid布局接入DSH定格消息，补视口排队、主题、放大与源码回退，减少复制到外部站点；上游布局和消毒不属插件原创。详见[Q02](#research-q02)。

> **思考**：Promise超时不能中断主线程CPU，离视口只丢结果；发送AI修复会写全局首个输入框并模拟Enter，可能覆盖已有草稿，均为静态边界未复现。strict不能代替完整安全验收。详见[Q02](#research-q02)。

> **建议**：可探讨可终止渲染隔离和绑定会话的可预览修复草稿，比较病态图响应及原草稿保留；受DOM依赖与通信开销约束，未验证。详见[Q05](#research-q05)。

<a id="plugin-1344714334-root"></a>

## [dsh-modernize-code](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md)



> **用途**：规划遗留代码迁移前，先收集环境缺口与静态热点，再制定分阶段路线图。

> **亮点**：把五问六检与热点线索纳入可重复入口，详见[Q01](#research-q01)。

> **思考**：浅层检查的 READY 与固定权重热点不能当迁移安全结论；out 文件写入范围也须约束，详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：将实际构建/测试证据及人工热点标注接入报告、限制 out 到指定目录，可提升决策可靠性；待验证，详见[Q02](#research-q02)、[Q03](#research-q03)。

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

<a id="plugin-1366089972-workspace-plugins-dsh-organism"></a>

## [dsh-organism](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：多插件 DSH 环境需要能力导航和故障观察；合格性依赖宿主事件、权限和任务对照。

> **亮点**：在 DSH 基础工具之上叠加器官视图、体征账本、代理调用与按需显影；规则和命名启发式不等于语义理解。详见[Q02](#research-q02)。

> **思考**：body_law 的最高指令是提示与版本盖章，未见身份授权或违反规则的执行阻断；反射能调用真实工具，需宿主权限兜底。详见[Q03](#research-q03)。

> **建议**：若将器官契约、故障体征和最小权限降级路径联合验证，可能减少错路由和排障；须做固定任务对照，尚未实现效果。详见[Q05](#research-q05)。

<a id="plugin-1336720864-root"></a>

## [dsh-plugin-console](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-plugin-console) [![npm 30d 1,111](https://img.shields.io/static/v1?label=npm+30d&message=1%2C111&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-console) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-console)

> **用途**：本地维护者集中核对目录来源、精确版本及活动profile，需区分已装与运行中状态。

> **亮点**：把来源核验、明确确认、精确安装、完整profile兼容检查及恢复串为管理闭环，增量在流程而非新包管理算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：canary改临时HOME但仍普通用户进程并继承多项环境变量，不是OS沙箱；真实profile变更与外部初始化副作用也非原子回滚。详见[Q02](#research-q02)。

> **建议**：可探讨最小能力变更收据，列环境/目录/网络与恢复覆盖，再以白名单或OS约束缩小canary能力；兼容与隐私成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1336663986-root"></a>

## [dsh-plugin-gate](../../plugins/863683348--dsh-plugin-gate/INSIGHT.md)

[![npm 30d 1,494](https://img.shields.io/static/v1?label=npm+30d&message=1%2C494&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-gate) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-gate)

> **用途**：安装陌生插件前检查源码与依赖风险，或在删除前提示目标范围。

> **亮点**：把静态签名、OSV 查询和基线差分整合为 Agent 可调用工具；详见[Q01](#research-q01)。

> **思考**：扫描截断/读取或 OSV 失败不一定改变 PASS；guard 不是执行钩子，“绝不写文件”不涵盖 diff/report 可选写入。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：将覆盖率不全升为 WARN、把 destructive guard 接入宿主执行层，可减少误信 PASS 和漏拦截；待验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="plugin-1397817235-root"></a>

## [dsh-plugin-ide-hub](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub)

> **用途**：多编码工具用户集中找会话、查本地用量和管理项目规则。详见[Q01](#research-q01)。

> **亮点**：汇总分散IDE磁盘事实并让规则共用正文，减少切换。详见[Q01](#research-q01)。

> **思考**：workspace运行依赖未闭合，用量字段可能重复计量，结构扫描跟链接而规则批写缺事务。详见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：研究版本化适配器/差分计数与损失回执、物理root扫描预算及内容hash导出，比较误差和恢复。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1367597810-root"></a>

## [dsh-plugin-market](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md)

[![npm 30d 1,454](https://img.shields.io/static/v1?label=npm+30d&message=1%2C454&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market) [![最新发布 2026-09-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market)

> **用途**：供 web profile 用户在设置页浏览和安装插件；合格结果需要明确目标、来源、重启及真实加载。详见[Q01](#research-q01)。

> **亮点**：把手工查目录、比版本、复制命令整合到一页；上游目录和 pnpm 是依赖，本插件的增量是 UI/host/helper 接线及状态整理。效果取决于 profile 与来源是否符合预期。详见[Q01](#research-q01)。

> **思考**：host 把读取和安装目标固定为 web，更新又执行目录命令，可能把固定 Git 来源替换为 npm；目录多源回退未核同一性，pnpm 成功未验证重启加载。详见[Q03](#research-q03)。

> **建议**：未验证方向是从宿主明确取得目标 profile，安装前审阅旧/新 spec、来源与摘要，跨源目录校验同一性并在重启后确认加载；用错 profile 和来源漂移夹具评估。详见[Q05](#research-q05)。

<a id="plugin-1399011094-root"></a>

## [dsh-plugin-task-forge](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge)

> **用途**：多个AI窗口/IDE传递复杂需求，需明确约束/验收和真实送达/结果。

> **亮点**：集中需求/验收/缺口和版本回读台账，改善可审阅协作接线，不证明无损理解或字节一致。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：ACK缺缺口section仍可ok、无语义/hash校验，实例队列不保证跨进程唯一版本，全局pending主动注入可串任务。详见[Q02](#research-q02)。

> **建议**：可探讨作用域/内容hash绑定交接收据，跨进程版本CAS和逐约束ACK，pending仅当前选择任务；身份/冲突维护成本未验证。详见[Q04](#research-q04)。

<a id="plugin-1422943787-root"></a>

## [dsh-plugin-veriscope](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)

> **用途**：维护者交付前核已有评测与阈值，避免旧PASS被无条件复用。详见[Q01](#research-q01)。

> **亮点**：把阈值判定、缺证据保留和当前性回执接合，减少只看旧均值的误读。详见[Q01](#research-q01)。

> **思考**：门禁仅消费所提供分数，不证明样本总体/评分真实，本地摘要不抵抗整体重写，child kill不等进程树回收。详见[Q03](#research-q03)、[Q05](#research-q05)。

> **建议**：研究独立签名评测清单/总体计数及可恢复受管ID、进程组强杀，比较错放行与恢复。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1344714177-root"></a>

## [dsh-pr-description](../../plugins/988hj7tczd-oss--dsh-pr-description/INSIGHT.md)

[![npm 30d 368](https://img.shields.io/static/v1?label=npm+30d&message=368&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pr-description) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pr-description)

> **用途**：适合已有分支提交、需要快速整理可编辑 PR 草稿的开发者；合格结果须正确 base 和人工核事实。

> **亮点**：将 Git 差异事实、有限符号与 breaking 规则、五段模板、可选确认和 gh 动作连接成 DSH 工具；减少统计排版，未实现模型理解业务动机。详见[Q02](#research-q02)。

> **思考**：自动 base 可选错；正则符号与模板不知真实测试。输出经 Node fs 按用户路径直接写，未见本工具内 containment；confirm 只预览标题与路径，openPr 是实际远端创建。详见[Q03](#research-q03)。

> **建议**：可让描述每段引用 diff 事实，无法由 diff 证明的动机与测试保留待填写，并用重命名、多语言和未跑测试样本比较错误与改写时间；未实现。详见[Q05](#research-q05)。

<a id="plugin-1334481905-plugin"></a>

## [dsh-progress-viz (plugin)](../../plugins/2008924--dsh-progress-viz--plugin/INSIGHT.md)



> **用途**：headless 长任务需要了解阶段与最近动作，插件向同目录看板提供事件投影。详见[Q01](#research-q01)。

> **亮点**：插件把噪音过滤前移到 DSH 事件源，减少看板直接读会话文件的依赖。详见[Q01](#research-q01)。

> **思考**：空闲 finished 状态不可恢复，末项未完成时也显示 100%，费用字段有重复口径风险。详见[Q02](#research-q02)和[Q03](#research-q03)。

> **建议**：与独立 zstd 解析并行对照延迟、资源和终态准确率，若会话恢复误判或误导超过收益则收窄或修正直写增量。详见[Q05](#research-q05)。

<a id="plugin-1339316901-root"></a>

## [dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,202](https://img.shields.io/static/v1?label=npm+30d&message=4%2C202&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

> **用途**：长期项目跨会话复用已读材料/经验与任务，命中须回源确认适用版本，合格交付以真实代码/问题完成衡量。

> **亮点**：将材料召回和行动前须知分契约，结合任务绑定、git语料/分片锁与注入审计减少重复接线，不把相关性当真值。参见[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)。

> **思考**：反思草稿已有隔离，但非草稿近邻仍可继承高confidence覆盖全局，任务数提升非适用域验证；trigger也会截断、索引CAS不读源。参见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：未验证假设为来源版本/适用域/审批修订链与完整触发引用，先验互斥知识污染和长procedure约束，再比较合格任务及审核负担。参见[Q06](#research-q06)。

<a id="plugin-1353726715-root"></a>

## [dsh-qa-suite-n23](../../plugins/all3ncn--dsh-qa-suite-n23/INSIGHT.md)



> **用途**：TS 开发者可在模型编辑后读 tsc 诊断，并用 /code-review 召集本地审查；前者是编译器结果，后者是待复核问题候选。

> **亮点**：吸收两份上游的 TS 诊断与模型审查流程，提供一个 host 包的工具和命令入口；未见诊断自动约束审查放行的共同机制。详见[Q02](#research-q02)。

> **思考**：code_check 优先全局最近缓存项目而非调用会话 cwd，可能返回别的项目诊断；审查阈值只是 Agent 提示，不是校准准确率或程序验收。详见[Q03](#research-q03)。

> **建议**：可按会话绑定项目与诊断版本，并要求审查意见引用同版本证据；以双项目交错和缺陷注入对照错根率、接受率及成本。未实现。详见[Q05](#research-q05)。

<a id="plugin-1423215373-root"></a>

## [dsh-reaper](../../plugins/11111353535--dsh-reaper/INSIGHT.md)



> **用途**：维护者诊断遗留dev服务器占端口，需核完整影响和可恢复服务。

> **亮点**：将归属理由、后代影响预览和端口回查集中，优于仅按端口kill，但非进程身份或会话授权保证。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：后代漏保护端口、信号前无身份重核，free_port不强制归属，取消和IPv4 TCP探测不足以证明安全回收。详见[Q02](#research-q02)。

> **建议**：可探讨身份/计划hash绑定和精确端点回收收据，逐信号重核保护/取消并保留unknown，跨OS成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1339262076-root"></a>

## [dsh-repeat-stop](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop)

> **用途**：为反复原样重试工具的 Agent 提供执行前保险丝，合格结果是阻断无效重复并保留合法探索；正常轮询需单独配置。详见[Q01](#research-q01)。

> **亮点**：把原样重复检测接入工具 guard，默认允许六次并拒绝第七次，同时按 Agent 隔离状态并规范化对象键；属于有用的局部机制组合，官方提醒器对照仅为作者声明。详见[Q03](#research-q03)。

> **思考**：跨步计数能否成立取决于宿主消息窗口。pre-step 遇到任何 user 消息便重置，若每步含历史用户消息就可能削弱保护；这是静态条件风险，未做故障复现。精确键还无法识别交替与改参循环。详见[Q04](#research-q04)。

> **建议**：可探讨让工具结果声明进展，在精确重复规则旁区分合法等待和无进展失败；先用固定事件反例比较误拦及漏拦，再评估状态契约的维护代价。当前未验证，不属于已有能力。详见[Q08](#research-q08)。

<a id="plugin-1424433303-root"></a>

## [dsh-restart-dock](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md)



> **用途**：Windows 上调试 DSH 插件的开发者需要频繁区分客户端刷新和 Host 重启；基线是关窗口、找快捷方式再打开。合格结果是只在用户二次确认后重启明确的 DSH 进程树，页面能区分失败、取消和恢复，正在执行的任务不会被误认为已保存。 详见[Q01](#research-q01)。

> **亮点**：相对手工重开，它把“只刷新 client”和“重启 Host”分成明确按钮，并加入包重建门禁、倒计时撤回和重启报告。贡献是开发交互与安全接线，不是跨平台进程管理；Windows-only 和强制停止限制了普适性。 详见[Q03](#research-q03)。

> **思考**：关键风险是重启属于破坏性副作用。自定义头/CORS 防跨站不等于完整鉴权，同源受害页面或宿主路由暴露仍需核对；helper 若受 job object 牵连可能无法拉起。插件不等本轮结束、不自动续话，未保存状态会被中断。 详见[Q04](#research-q04)。

> **建议**：未验证假设是把当前任务忙闲状态接入重启坞，只在会话已落盘且无活跃工具时启用“安全重启”，可减少中断事故。最小实验注入活跃/空闲/写盘三种状态各 20 次，比较当前按钮与门控版的误中断率、恢复成功率和等待时间；若忙闲信号漏报一次破坏性中断即不应自动启用。 详见[Q08](#research-q08)。

<a id="plugin-1422176522-root"></a>

## [dsh-restart-planner](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-restart-planner)

> **用途**：代理安装或修改 Host 插件后需要重启才能继续，但当前进程不能杀死自己；基线是让用户手工重开并再次提示继续。合格结果是本轮回复先送达、会话落盘、明确目标被重拉、状态可审计，且自动继续只在新进程接受 prompt 后清标记。 详见[Q01](#research-q01)。

> **亮点**：相对人工重启，它把进程死亡点放到回复与写盘之后，并用外部 helper 与持久恢复标记跨越宿主生命周期；比按钮插件更适合 agent 自主流程。优势依赖目标解析和会话静默确实可靠，且“继续”提示不等于原任务状态自动恢复。 详见[Q03](#research-q03)。

> **思考**：最关键质疑是强制停止前的“静默”只能近似落盘完整，最后写入仍可能丢失；自动继续可能在环境尚未完全恢复时重复动作。默认 confirm=false 与 resume=true 对无人值守有利，却扩大误排程后果；重复 schedule 覆盖旧排程而不排队。 详见[Q04](#research-q04)。

> **建议**：未验证假设是给恢复标记增加原任务幂等键与上一步完成摘要，可把“继续一句话”升级为可判重的恢复协议。最小实验让 20 个含外部写入的任务在四个阶段重启，比较当前 prompt 与幂等恢复的重复副作用、丢步骤率和人工接管次数；任一重复写远端即否定自动恢复。 详见[Q08](#research-q08)。

<a id="plugin-1372976273-root"></a>

## [dsh-session-diff](../../plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff)

> **用途**：给同时处理多个会话的开发者一个会话级审查入口，以保留的write/edit事件和当前文件形成差异视图；不代替全仓库验收。

> **亮点**：把会话工具hunk、逆序还原与侧栏路由组合为会话级审查视图，并仅接管存在会话改动的文件。相对Git提供不同归因入口，Myers与宿主格式不属原创贡献；没有同条件审查收益对照。详见[Q03](#research-q03)。

> **思考**：可信会话归因仍依赖启发式基线。后缀路径、重复片段和未校验跨页版本可能造成歧义，已发现的降级提示也不覆盖所有错配条件；均为源码推断，未复现。不能据此证明修改完整性。详见[Q04](#research-q04)。

> **建议**：可进一步探讨版本绑定会话差异，用规范路径、事件前后版本与一致分页取代部分启发式还原；新增宿主接口和存储负担，须与当前实现及Git对照错归因与资源成本，未验证。详见[Q08](#research-q08)。

<a id="plugin-1347749203-root"></a>

## [dsh-settings-hub](../../plugins/amengclass--dsh-settings-hub/INSIGHT.md)

[![npm 30d 939](https://img.shields.io/static/v1?label=npm+30d&message=939&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-settings-hub) [![最新发布 2026-08-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-settings-hub)

> **用途**：插件较多时减少设置侧栏散乱。

> **亮点**：提供可拖拽第三方设置分组，详见[Q01](#research-q01)。

> **思考**：依赖源码字符串正则识别和一次性定时重扫，可能漏检/错误归属；完整 shadow 带来兼容成本，详见[Q02](#research-q02)。

> **建议**：稳定slot来源元数据与异步状态更新替代正则/单次重扫，反证和兼容代价见[Q05](#research-q05)。

<a id="plugin-1393980674-root"></a>

## [dsh-sidebar-git-graph](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AFunDog/dsh-sidebar-git-graph)

> **用途**：开发者在多工作树会话中确认仓库、分支和改动归属；合格结果需交代选择来源、截断和本地新鲜度。

> **亮点**：把Git图谱、工作树与差异接到DSH会话，在手选、标签和历史提示间明确优先级并显示回退原因；贡献属于可解释的接线与信息组织，不是新的Git机制。详见[Q03](#research-q03)。

> **思考**：只读不能保证授权隔离或快照一致性。无工作区候选时存在claimed-unfenced退路，图谱与改动独立读取可能跨时点；这些是静态边界，未作越权或竞态复现。详见[Q04](#research-q04)。

> **建议**：可探索共同读取收据与状态变化提示，以显式呈现跨请求不一致；需比较误判、误报和尾延迟，当前未实现，不计为已有创新。详见[Q08](#research-q08)。

<a id="plugin-1344713683-root"></a>

## [dsh-skill-creator](../../plugins/988hj7tczd-oss--dsh-skill-creator/INSIGHT.md)

[![npm 30d 762](https://img.shields.io/static/v1?label=npm+30d&message=762&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-skill-creator) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-skill-creator)

> **用途**：把已有工作流固化为 DSH SKILL.md 并在会话中分发或使用。

> **亮点**：提供从工作流描述到 SKILL.md、校验、ZIP 分发和目录挂载的一站式入口；详见[Q01](#research-q01)。

> **思考**：fromSession 只改变 sessionNote，不改变草稿；ZIP 对所有文件做 UTF-8 解码/重编码，二进制资源不保真。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：让会话摘要显式进入 dry-run 审阅后再生成，并按原字节打包、校验哈希，可提高可信度；待验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="plugin-1422359117-root"></a>

## [dsh-slipway](../../plugins/7gzgn--dsh-slipway/INSIGHT.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-slipway)

> **用途**：重复发布 DSH 插件的维护者需要把建仓、逐文件上传、市场登记 PR 和线上回验串成一次可审计交付；基线是 gh/API 脚本加人工核对。合格结果是目标完全显式、敏感信息未上传、远端文件逐字节一致、PR 幂等且每个副作用可追踪。 详见[Q01](#research-q01)。

> **亮点**：相对零散脚本，它把发布前阻断、远端幂等和发布后字节回验放在同一事务叙事中，减少漏步骤；但没有真正原子事务，仓库上传成功而市场 PR 失败会留下部分完成状态。仅支持 GitHub contents API，不处理 npm、GitLab 或大文件。 详见[Q03](#research-q03)。

> **思考**：核心质疑是多阶段远端副作用失败后的恢复是否足够。幂等查询可减少重复仓库/PR，却不能回滚已上传文件、错误 topic 或已公开敏感内容；密钥扫描是模式启发式，不能证明无秘密。PAT repo 权限很大，错误目标参数的后果高。 详见[Q04](#research-q04)。

> **建议**：未验证假设是为每次发布生成不可变 manifest 并在远端写入批次标识，可在部分失败后精确续跑或补偿，而不依赖当前目录重算。最小故障注入在五阶段各中断 10 次，比较当前幂等与 manifest 续跑的重复提交、孤儿分支、人工判断步骤和最终字节一致率；出现错误覆盖即否定。 详见[Q08](#research-q08)。

<a id="plugin-1412896722-root"></a>

## [dsh-snapshot-manager](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md)

[![npm 30d 816](https://img.shields.io/static/v1?label=npm+30d&message=816&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-snapshot-manager) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-snapshot-manager)

> **用途**：长会话多轮改代码后结果不对，开发者希望回到某轮提问前的文件与对话；基线是 Git checkout/stash 加手工新会话。合格结果是预览精确列出恢复/删除、只改工作区内目标、快照链完整、文件恢复可撤销、对话 fork 不覆盖原会话，排除项被明确告知。 详见[Q01](#research-q01)。

> **亮点**：相对 Git，它覆盖未跟踪文件和对话时间点，并把文件恢复与会话 fork 放在同一 UI；预览令牌、叶子删除、链完整性拒绝和撤销点降低误回滚。它不保存 .git 状态、权限/可执行位/mtime，session scope journal 也漏掉 shell/build/subagent 修改。 详见[Q03](#research-q03)。

> **思考**：核心质疑是用户是否误解“快照”为完整工作区。默认排除、8MiB上限、符号链接、.git和元数据都不回滚；session-only 范围只认三个编辑工具，可能留下关联修改。全量 restore 会删除快照后新增文件，若 cwd/realpath 判定或链损坏处理出错后果严重。 详见[Q04](#research-q04)。

> **建议**：未验证假设是把排除项、Git状态和元数据做成独立不可恢复清单，并在风险超过阈值时阻止全量回滚，可显著减少错误安全感。最小实验构造50个含大文件、symlink、权限、git index、shell改动的工作区，比较当前提示与风险门禁的误回滚和人工发现率；仍有未提示数据损失即否定。 详见[Q08](#research-q08)。

<a id="plugin-1412897663-root"></a>

## [dsh-spring-admin-kit](../../plugins/aaalenwow--dsh-spring-admin-kit/INSIGHT.md)



> **用途**：特定Java后台栈开发者复用步骤与检查单，合格交付必须通过实际模板/数据库验收。

> **亮点**：把Excel三件套与模板冲突经验变成可发现技能，减少临时提示与拷贝遗漏；不是运行时代码生成服务。参见[Q01](#research-q01)。

> **思考**：导入示例catch异常返回字符串且插入不更新已有键map，事务注解不能保证整批回滚；提示式守卫也不强制拦截。参见[Q02](#research-q02)。

> **建议**：未验证假设为技能携带项目契约与故障验收样例，比较纯提示生成的部分提交/重复键/模板失败及复核负担。参见[Q03](#research-q03)。

<a id="plugin-1346017360-root"></a>

## [dsh-ssh-logs](../../plugins/452926826--dsh-ssh-logs/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-ssh-logs)

> **用途**：面向需要在DSH会话里读取预先授权服务器日志的开发/运维人员。主机和日志根由人配置alias，模型只能列服务器、读文件头尾/范围或grep固定字符串，适合围绕request ID、时间附近异常取有限片段。它不是远程终端、日志采集平台或任意主机管理器。

> **亮点**：将固定主机/根别名、quote保护的读命令和有界输出接到MCP/DSH，减少人手复制日志，并不提供任意shell或新SSH协议。详见[Q02](#research-q02)。

> **思考**：root只词法normalize，符号链接目标未核；child env不继承SSH_AUTH_SOCK，空grep退出1被当SSH失败。取消/远端后代停止未确认，未实际连接复现。详见[Q03](#research-q03)、[Q05](#research-q05)。

> **建议**：可探索远端规范路径/文件身份和empty/truncated/cancel状态收据，最小传递agent socket，比较目标/状态正确、清理与延迟；未实现。详见[Q06](#research-q06)。

<a id="plugin-1427978231-root"></a>

## [dsh-stl-preview](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md)

[![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-stl-preview)

> **用途**：为在Harness工作区生成或检查STL的开发者提供就地旋转查看与几何摘要；合格输出是确认形状和尺寸假设，再交切片器验证打印，不是出具可制造证明。

> **亮点**：把轻量WebGL、浏览器STL解析和Host权限文件流接入文档预览，减少看形状时切换工具；查看器沿用blend-preview思路，几何公式和边计数不声称原创。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：水密标记仅检查量化焊接后的无向边使用数与退化顶点，不检查自交、面朝向或可打印性；大三角数只跳过边表，解析和面积体积仍走主线程。不能从绿色标记推断打印成功或内存有界。参见[Q03](#research-q03)。

> **建议**：可将解析与拓扑分析移到worker并分阶段给出“形状可见／单位确认／拓扑部分检查”收据；用相反绕序、自交壳、极近顶点和大网格对照专业检查器，若取消无效或误导标记未降则否定。代价是worker传输和版本化诊断，假设未验证。参见[Q05](#research-q05)。

<a id="plugin-1425006726-root"></a>

## [dsh-subagent](../../plugins/1373700184--dsh-subagent/INSIGHT.md)

[![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-subagent)

> **用途**：面向同时拥有多个编码代理订阅或 CLI 的开发者，把独立子任务分派到不同后端并从 DSH 汇总结果。 [Q01](#research-q01)

> **亮点**：相对手工开多个终端，它统一多种事件协议、模型回退、进度展示和崩溃接管，使外部额度成为 DSH 可调度的子代理资源。 [Q03](#research-q03)

> **思考**：子代理不继承父上下文且默认无头权限较宽，任务说明、工作目录和验证责任全部回到父代理；多后端并不自动带来更好结果。 [Q04](#research-q04)

> **建议**：可在派发前生成最小上下文包并在返回后执行统一验收契约，只把失败证据和产物摘要回流，从而降低上下文遗漏与汇总偏差。 [Q08](#research-q08)

<a id="plugin-1421306160-root"></a>

## [dsh-subagent-role-router](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/643048695/dsh-subagent-role-router)

> **用途**：多子代理开发中，操作者希望探索任务使用便宜模型、修补任务使用更强模型，并在单一路由限流时保持派发。简单基线是每次调用显式传 provider/model；合格结果是角色匹配、显式覆盖不被改写、失败候补可见且 fork 上下文仍完整。 详见[Q01](#research-q01)。

> **亮点**：相对逐次显式指定模型，它把角色分类、同角色并发工位、短期冷却和跨供应商失败切换合并在派发层；相对上游默认模型插件，新增角色池和保守的 fork 活跃窗口，但关键词分类仍是启发式，不是任务语义证明。 详见[Q03](#research-q03)。

> **思考**：最关键质疑是误分类和失败归因会否把任务送往不合适模型或重复消耗额度。默认模糊任务归 patch 降低弱模型误用，却可能提高费用；认证失败也切换会暂时保活，但可能掩盖需要修复的凭据。切片放弃条件保护正确性，却在长会话上退回原始大种子。 详见[Q04](#research-q04)。

> **建议**：未验证假设是用任务声明而非关键词作为角色契约，并把预算上限纳入候补选择，可同时降低误路由和超额重试。最小实验对同一组 30 个探索/规划/修补任务比较显式基线与自动路由，记录角色混淆矩阵、合格率、总 token、失败重试和人工改派次数；任一任务质量下降或成本不降即削弱假设。 详见[Q08](#research-q08)。

<a id="plugin-1406156934-dsh-task-monitor"></a>

## [dsh-task-monitor](../../plugins/3450892121--dsh-task-monitor--dsh-task-monitor/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/3450892121/dsh-task-monitor)

> **用途**：适合同时查看工作区、Git 分支、任务、技能、MCP、产物与网页访问；只需 git status 时终端命令更透明。 详见[Q01](#research-q01)。

> **亮点**：把研究/开发上下文与交付动作放到同一面板，减少窗口切换；差异点是可操作监控而非单纯只读仪表盘。 详见[Q03](#research-q03)。

> **思考**：提交、推送、切分支和发布会改变仓库或远端；根 README 与组件安全说明对写动作边界表述不一致，不能按只读工具信任。 详见[Q04](#research-q04)。

> **建议**：若所有写按钮先展示精确命令、目标 remote/ref 和差异摘要，并记录操作结果，面板才可能胜过终端而不牺牲可审计性。 详见[Q08](#research-q08)。

<a id="plugin-1333800488-root"></a>

## [dsh-taskswarm](../../plugins/february2015--dsh-taskswarm/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm)

> **用途**：适合有Git仓库、能把目标拆成明确PROMPT/STATUS任务包、依赖与完成条件的多步骤代码工作。基线手工subagent+分支/worktree+PR/CI，由人跟踪交接；插件将任务外置、按波次启动lane、保检查点/状态/邮箱、串行集成到taskswarm/orch，用户再integrate到当前分支。单次咨询/高度耦合任务可能不值得这层管理。

> **亮点**：把TaskPlane式外置任务、wave/worktree/checkpoint与DSH内部agent/supervisor/恢复接线，支持代码现场持续推进；总管理负担减少仍是推断。详见[Q01](#research-q01)、[Q03](#research-q03)。

> **思考**：默认PASS/none与blocked可合并、首review缺.seq抛错、普通merge不统一check；worktree非权限沙箱且dashboard非显式loopback绑定，merged不能当accepted。详见[Q04](#research-q04)、[Q05](#research-q05)。

> **建议**：可探索任务/代码/策略/依赖产物绑定的接受收据与变化失效，对照简单严格CI/人工最终SHA验收；未实现。跨执行者任务包仅更远设想。详见[Q07](#research-q07)。

<a id="plugin-1335139860-root"></a>

## [dsh-token-billing](../../plugins/2006spy--dsh-token-billing/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing)

> **用途**：面向DSH Web中混用不同provider/模型，希望在输入框附近看到本轮消耗、并汇总跨会话支出的个人用户。核心输入是会话事件与四档usage，插件输出费用行、统计、价目配置和CSV/JSON账本。它是消费可视化工具，不负责代扣费，也不验证业务任务产出。

> **亮点**：把估算到usage修正、provider价优先和事件时间政策接入会话投影，再提供步骤账本与导出，减少手工整理；不是正式账单或新tokenizer。详见[Q02](#research-q02)。

> **思考**：投影可撤销估算，但账本仅追加且同key不更新；宿主发布中间状态时退款可能留下持久条目。“节省”还涉及累计actual和跨币种口径，未运行复现。详见[Q03](#research-q03)。

> **建议**：可探索步骤revision与upsert/tombstone修订链、价版本和原币种收据，比较投影/总账差额、重放与体积；未实现。详见[Q06](#research-q06)。

<a id="plugin-1351903192-root"></a>

## [dsh-tokenrhythm-bill](../../plugins/162568316--dsh-tokenrhythm-bill/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/162568316/dsh-tokenrhythm-bill) [![npm 30d 1,642](https://img.shields.io/static/v1?label=npm+30d&message=1%2C642&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-tokenrhythm-bill) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-tokenrhythm-bill)

> **用途**：面向在DSH使用基元律动，并可能跨阶跃、ZCode、清枢和OpenCSG账户工作的个人用户。余额、限时额度、模型价目、用量和密钥管理聚到侧栏，减少在多个门户间切换。默认仅启用基元，其他平台显式开启；不是所有供应商的统一正式结算账本，也不建立每个DSH任务与账单项的因果归属。

> **亮点**：将五套费用/会话协议、账号槽、字段归一和密钥操作接入DSH面板，减少门户切换；不提供新计费协议。详见[Q02](#research-q02)。

> **思考**：按需密码/key明文与宿主凭据写入要求可信访问控制；插件自身没有独立请求授权守卫。模型探测缓存仅model ID，切平台/key可能误复用；state直写及并发回滚缺版本协调。详见[Q03](#research-q03)、[Q05](#research-q05)。

> **建议**：可探索平台/账号/密钥指纹绑定的数据收据、敏感操作授权和文件版本写入，比较误归属、丢更新与额外开销；未实现。详见[Q09](#research-q09)。

<a id="plugin-1335559646-root"></a>

## [dsh-trellis](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) [![npm 30d 1,515](https://img.shields.io/static/v1?label=npm+30d&message=1%2C515&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)

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

> **用途**：DSH用户管理Vercel项目/部署，希望少手工配置MCP。详见[Q01](#research-q01)。

> **亮点**：把OAuth、Agent工具面预算与结果分页接合，减少整目录上下文和接线。详见[Q01](#research-q01)。

> **思考**：单机全profile共享token，整份保存无CAS，clear未阻止已在途exchange后commit，投影可能截断单项。详见[Q04](#research-q04)。

> **建议**：研究凭据epoch/CAS与profile分区、截断继续标识和远端写幂等回执，比较token复活/误重试。当前未验证。详见[Q06](#research-q06)。

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



> **用途**：多版本工具链出现命令找错、版本不一致时，开发者可收集胜出路径和遮蔽原因；结果是诊断材料，不是自动修复。详见[Q01](#research-q01)。

> **亮点**：把胜出文件、遮蔽项和PATH异常组织成同一结构化诊断流程，并以可注入文件系统支持固定反例核查；增量是取证接线和解释，不是新的shell解析规则。详见[Q03](#research-q03)。

> **思考**：报告是否对应实际shell仍受建模边界限制，Windows解析默认cmd表而环境可显示PowerShell；版本旗标也不能保证候选程序无副作用。这些为静态核查所得，未做运行复现。详见[Q04](#research-q04)。

> **建议**：可从shell种类的显式传递和模型边界标注入手，将文件候选与实际shell事实分层；先用固定反例对照，再决定是否增加受控适配，当前未验证。详见[Q08](#research-q08)。

<a id="plugin-1344715132-root"></a>

## [dsh-workflow-templates](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md)

[![npm 30d 385](https://img.shields.io/static/v1?label=npm+30d&message=385&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-workflow-templates) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-workflow-templates)

> **用途**：用户明确需要 DSH workflow 大规模多 Agent 编排时，从常见任务模板起步。

> **亮点**：提供可检索的编排脚本起点和轻量格式诊断，减少空白起草。详见[Q01](#research-q01)。

> **思考**：invalid 模板仍可 run，缺参仅文字提醒；部分模板返回与描述不符，不能把格式校验当业务验收。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：默认拒绝已知invalid/缺参并补业务输入输出契约，反证条件与维护代价见[Q05](#research-q05)。

<a id="plugin-1336092482-01-content"></a>

## [dsh-worktable](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md)

[![GitHub ★ 781](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=781&color=yellow&logo=github&style=flat)](https://github.com/Aisland-SJL/dsh-worktable)

> **用途**：给同时处理多个Agent项目/会话的人，将文件、终端、网页和产物窗口收在项目容器中；合格交付是项目/窗格/会话绑定不串挂、状态可解释，不能仅看控制室灯变绿。

> **亮点**：以显式项目/窗格/绑定所有权代替“文件夹相同即项目相同”，并把宿主会话状态与多窗工作区相连，减少旧结果串挂；贡献是组织与生命周期边界，不是文件系统隔离。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：客户端所有权校验不约束Host文件权限，文件读取/写入使用用户或产物路径，PTY继承process.env；多个项目改同一真实文件仍互相影响。撤销持久化失败只在内存生效，刷新后状态需核对；作者也未完成全部审批/子代理/挂载业务验收。参见[Q03](#research-q03)。

> **建议**：可为结果建立内容摘要/生成版本及只读预览收据，把“绑定当前”“文件已变”“业务已验收”分开，并对撤销写失败做可见错误和持久恢复。对照同目录两项目、晚到写者、重绑及存储满，错挂/旧结果复活或额外负担不降就否定；假设未验证。参见[Q05](#research-q05)。

<a id="plugin-841979943-root"></a>

## [dsh-wrapup-guard](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/566001/dsh-wrapup-guard) [![npm 30d 74](https://img.shields.io/static/v1?label=npm+30d&message=74&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wrapup-guard) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wrapup-guard)

> **用途**：DSH 开发任务交付前的测试、审查、构建和一致性核对。

> **亮点**：把收尾过程显式化为检查工具、轮次状态和通知，降低遗漏提醒成本，但保证依赖如实调用/上报。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：check 未与 report 门槛绑定，缺人工 checks 只是提醒，三次空 problems 可绕开所谓全面检查；状态落盘失败也被吞掉。详见[Q03](#research-q03)。

> **建议**：同轮证据绑定、失败阻断和按会话隔离通知，若在漏查/失败/多会话测试中降低误放行且耗时可接受，再考虑作为质量门；本版未实现。详见[Q04](#research-q04)。

<a id="plugin-1350379113-root"></a>

## [dsh-wsl-cred](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cred)

> **用途**：WSL Git HTTPS/SSH配置排障，先区分配置线索与认证成功。详见[Q01](#research-q01)。

> **亮点**：把常用Git凭据配置线索放入单一模型报告。详见[Q01](#research-q01)。

> **思考**：内联helper可能含敏感值却原样输出，错误吞成未配，宿主cwd不等会话仓库。详见[Q03](#research-q03)。

> **建议**：研究只回类型/状态的最小化输出及明确cwd/错误层级，比较敏感片段和归属误判，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1350379001-root"></a>

## [dsh-wsl-distro](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro)

> **用途**：面向DSH host在WSL里、Windows默认发行版与当前进程所在发行版可能不同的用户。distro_info展示当前env名称、os-release、wsl.exe -l -v结构列表/默认星号并提示UNC不要跨发行版猜/home。

> **亮点**：把env/os与固定wsl列表结构化并提醒当前/默认不同，减少跨发行版路径猜测和手查。详见[Q02](#research-q02)。

> **思考**：current/os缓存与实时list无时点，UTF8去NUL非完整编码处理、单token/英文状态可能漏；直接exec内10s不接外timeout/signal，ok不证明完整/路径可用。详见[Q03](#research-q03)。

> **建议**：可探索来源/时点/partial与编码明确的环境收据，统一宿主进程signal/预算，比较误判与采集开销；未实现。详见[Q05](#research-q05)。

<a id="plugin-1351854118-root"></a>

## [dsh-wsl-dns](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns)

> **用途**：面向WSL中DSH访问DeepSeek/GitHub/npm失败、希望比较两侧IPv4解析现象的用户。dns_doctor默认查三个域名，可传hosts，读/etc/resolv.conf第一条nameserver并展示WSL/Windows地址集合和建议。不改DNS/代理配置、不访问HTTPS业务端点，不证明TLS/应用可用。

> **亮点**：把两侧IPv4查询、集合差异和配置片段汇成模型工具，减少手查；固定PowerShell脚本对host单引号转义。详见[Q02](#research-q02)。

> **思考**：两侧错误折叠[]、ok只WSL非空，地址不同非劫持根因；多host串行总预算不接config/signal，直接exec与域名/内网披露需核。详见[Q03](#research-q03)。

> **建议**：可探索带解析来源/时点/错误与统一deadline的比较收据，分开观察/一致/诊断，比较误诊与额外披露/等待；未实现。详见[Q05](#research-q05)。

<a id="plugin-1351854212-root"></a>

## [dsh-wsl-editor](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor)

> **用途**：WSL开发者在Windows桌面查看源码/日志。详见[Q01](#research-q01)。

> **亮点**：减少跨系统路径转换和编辑器goto命令步骤。详见[Q01](#research-q01)。

> **思考**：启动完成不等文档验收，相对路径非session cwd，逐重试超时未与宿主取消联动。详见[Q03](#research-q03)。

> **建议**：研究会话目标解析/分层启动状态与统一取消，比较错文件和重复窗口，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1351854402-root"></a>

## [dsh-wsl-encoding](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-encoding)

> **用途**：WSL 调 Windows 命令时汉字路径乱码，或 /mnt/c 脚本因 CRLF 在 bash 中失败。

> **亮点**：以一工具汇合 Windows/WSL 编码和 CRLF 初诊，给出修复提示。详见[Q01](#research-q01)。

> **思考**：所谓 8192 字节采样先完整读文件；任意路径/大文件成本和采样失败仍 ok=true 易误导。详见[Q02](#research-q02)。

> **建议**：可探索分端observed/error/unknown、有界fd样本和总deadline收据，以冲突/不可读/后段CRLF/取消反例核查；未实现。详见[Q05](#research-q05)。

<a id="plugin-1381833309-root"></a>

## [dsh-wsl-git](../../plugins/173787247--dsh-wsl-git/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-git)

> **用途**：开发任务先看仓库摘要，减少整段diff进入模型。详见[Q01](#research-q01)。

> **亮点**：把常用Git摘要、返回上限与路径根配置接入模型工具。详见[Q01](#research-q01)。

> **思考**：porcelain失败仍计数ok，文本render漏截断，allowRoots只守cwd非父仓/Git环境范围。详见[Q03](#research-q03)。

> **建议**：研究仓库来源约束/统一预算和显式partial摘要，比较误判断与token，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1350544211-root"></a>

## [dsh-wsl-github](../../plugins/173787247--dsh-wsl-github/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-github)

> **用途**：DSH Agent 在 WSL 开发，需要只读查看当前 GitHub 仓库的 PR 和 CI 状态。

> **亮点**：把 GitHub App 最小只读状态查询封装为两模型工具，并区分 API 与推送凭据。详见[Q01](#research-q01)。

> **思考**：installation token 缓存未按仓库/owner 隔离，跨账号查询可复用错误 token；子请求失败仍 ok=true。详见[Q02](#research-q02)。

> **建议**：按安装与凭据版本缓存、明确不匹配和部分结果，反证及维护代价见[Q05](#research-q05)。

<a id="plugin-1381859919-root"></a>

## [dsh-wsl-glab](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-glab)

> **用途**：已认证GitLab开发者查询项目协作状态。详见[Q01](#research-q01)。

> **亮点**：把常见GitLab读取命令统一到模型摘要入口。详见[Q01](#research-q01)。

> **思考**：auth正则可能漏空格分隔秘密，issue parse失败render假空，CI错误包装ok，项目和CLI版本隐式。详见[Q03](#research-q03)。

> **建议**：研究白名单认证摘要/显式项目来源与parse-partial状态契约，对照假空和敏感外发，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1381389698-root"></a>

## [dsh-wsl-jev](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-jev)

> **用途**：在 WSL/DSH 中以短结构化结果辅助选择、评分和声称/证据匹配。

> **亮点**：把 Jev System One API 包装为 DSH 工具并处理 WSL 代理和候选键映射；模型能力归外部服务。详见[Q02](#research-q02)。

> **思考**：缺 evidence 仍可问模型，有限清洗不能保证外发安全，未知 rank key 仍可 ok:true。详见[Q03](#research-q03)。

> **建议**：外发字段白名单、缺证据拒绝与无效 choice 校验可形成可核决策门槛；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1381726881-root"></a>

## [dsh-wsl-k8s](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-k8s)

> **用途**：已有 kubeconfig 的开发/运维人员用 DSH 辅助集群只读排障。

> **亮点**：将常用 kubectl 只读查询做成模型工具并限制动词与输出，减少手工复制诊断信息；集群权限和语义仍由 kubectl/RBAC 提供。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：allowedContexts 对空 context 直接放行，get/describe/logs 可沿用 kubeconfig 当前集群；contexts 过滤仅影响显示，status 也不门控。不能将该配置当生产隔离。详见[Q03](#research-q03)。

> **建议**：可对所有查询解析并固定当前 context，非允许上下文拒绝，配合两测试集群比较误放行、误拒与延迟；本版未实现。详见[Q04](#research-q04)。

<a id="plugin-1338965593-root"></a>

## [dsh-wsl-net](../../plugins/173787247--dsh-wsl-net/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net)

> **用途**：WSL/Windows网络环境不一致时辅助维护者定位故障层次。详见[Q01](#research-q01)。

> **亮点**：把环境、宿主PID、代理监听和服务响应集中为Agent诊断报告，减少手工信息拼接。详见[Q01](#research-q01)。

> **思考**：HTTP<500不等业务成功，fix脚本使用未脱敏代理，默认全局包装也缺显式卸载还原。详见[Q03](#research-q03)。

> **建议**：可研究分层可达性判据、无凭据回显的修复计划与可恢复注入，以固定反例比较误诊和恢复成本。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1350378631-root"></a>

## [dsh-wsl-path](../../plugins/173787247--dsh-wsl-path/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-path)

> **用途**：面向DSH实际运行在WSL、频繁把/mnt/c或Linux home路径交给Windows程序的用户。path_convert双向生成文本路径并给drvfs/Linux提示，不打开、不复制、不执行目标，不检查文件存在或权限。

> **亮点**：将盘符/WSL UNC文字映射、WSL识别和词法FS提示接到并发安全的小工具，减少手改分隔符。详见[Q02](#research-q02)。

> **思考**：UNC发行版被helper解析后在工具输出丢弃，默认/mnt与字面WSL假设/盘符相对路径和特殊名不保真；ok非存在/权限保证，raw注册需核宿主。详见[Q03](#research-q03)。

> **建议**：可探索保发行版/卷映射来源与可表示状态的转换收据，拒绝身份歧义，比较误转与探测代价；未实现。详见[Q05](#research-q05)。

<a id="plugin-1381861315-root"></a>

## [dsh-wsl-pkg](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-pkg)

> **用途**：DSH 用户快速看多语言项目依赖和 npm 更新候选；需核环境归属与截断，不能代替全量审计。

> **亮点**：把既有包管理器命令包成 DSH 工具与浅摘要，提供可选项目根限制；不增加依赖解析算法。详见[Q02](#research-q02)。

> **思考**：allowRoots 空时不限目录，pip list 跟随 DSH 进程 PATH 而非指定项目；解析失败也可能 ok:true，须核项目、退出和截断。详见[Q03](#research-q03)。

> **建议**：绑定项目根、解释器/包管理器路径、退出码和完整性标签，可能减少多环境错配；双 venv 对照验证，尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1381725987-root"></a>

## [dsh-wsl-search](../../plugins/173787247--dsh-wsl-search/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search)

> **用途**：可信WSL项目内由模型查文本、文件名及AST模式。详见[Q01](#research-q01)。

> **亮点**：统一现成搜索器、模型参数及根检查，减少手写shell。详见[Q01](#research-q01)。

> **思考**：默认HOME范围宽，先缓冲后全局截断且无截断标志，AST坐标和长度与rg未统一。详见[Q03](#research-q03)。

> **建议**：研究流式全局停止、截断回执和统一坐标，将CLI查找/子进程纳入可取消限额，固定宿主沙箱root。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1351854356-root"></a>

## [dsh-wsl-ssh-agent](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ssh-agent)

> **用途**：面向WSL内DSH做Git SSH失败、需要知道当前host进程有无SSH_AUTH_SOCK、agent身份数量和常见Windows桥安装痕迹的用户。ssh_agent_hint是诊断/文字建议，不启动agent/桥、不加载私钥、不执行ssh -T或Git推送，也不读密钥文件正文。

> **亮点**：将socket/身份数量和常见桥痕迹聚合为只读提示，正常结果不回key指纹正文、不读私钥内容，区分SSH/HTTPS。详见[Q02](#research-q02)。

> **思考**：sockAlive仅exists、key文件仅名字，ssh-add失败变0并丢ok/code且render漏detail，易把错误当无身份；直接exec不接signal/config，ok非目标授权。详见[Q03](#research-q03)。

> **建议**：可探索分层socket/查询退出/身份与时点收据，最小化内容并统一host预算，比较误建议/披露；未实现。详见[Q05](#research-q05)。

<a id="plugin-1381833652-root"></a>

## [dsh-wsl-tmux](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tmux)

> **用途**：长任务已在tmux运行，用户希望模型查看输出线索。详见[Q01](#research-q01)。

> **亮点**：将原生tmux查询包装为受限模型入口，减少手工复制输出。详见[Q01](#research-q01)。

> **思考**：默认socket不绑定agent工作区，code1一律空与文本隐藏截断可能误读任务，头部切片可漏最新尾部。详见[Q03](#research-q03)。

> **建议**：研究server/pane精确句柄、带时间的partial尾部回执和统一预算，按错目标/假空/漏尾反例比较，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1334205011-root"></a>

## [dsh-wsl-workspace](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md)

[![GitHub ★ 97](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=97&color=yellow&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,975](https://img.shields.io/static/v1?label=npm+30d&message=2%2C975&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace)

> **用途**：在 Windows 上以 WSL Linux 工程为主工作区的开发者可用它把整个 DSH 会话映射到选定 WSL 发行版，并补齐 bash、文件、搜索、终端和工作区界面接线；合格结果是模型看到一致的 Linux 路径，命令与文件工具指向同一项目且写入边界可解释。详见[Q01](#research-q01)。

> **亮点**：将工作区选择、路径翻译、shell、文件、搜索与客户端入口组合成会话级 WSL 运行平面。它相对“手动在 WSL 终端运行命令，再在 Windows/UNC 路径与 DSH 文件工具之间转换”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **思考**：WSL bash 不受 Windows ACL 沙箱包裹，文件工具与 bash 的隔离边界不同；源码不能证明所有发行版和宿主组合均通过。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

> **建议**：未来可探索：可探索在会话创建时生成可见的双平面权限清单，并对 bash 与文件工具分别给出可执行的最小权限探针。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

<a id="plugin-1351853812-root"></a>

## [dsh-wsl-workspace](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-workspace)

> **用途**：面向在 WSL 中启动 DSH 项目、需要选择发行版和 Linux 工作区路径的开发者。输入是 list/check 操作及路径；合格结果是识别当前/默认发行版、确认路径存在并区分 Linux home、/mnt Windows 挂载或异常位置，给出不越权迁移建议。简单替代是手工跑 wsl.exe 和检查 pwd/mount。

> **亮点**：相对手工命令，它把发行版发现与 /mnt 卫生检查包装成模型可调用、只读且结构化的单工具；核心判断是常见 WSL 路径经验，不是新的文件系统机制。窄范围与无写副作用使它比通用部署插件更易审计。 参见[Q03](#research-q03)。

> **思考**：路径位于 /mnt 只是性能和权限风险信号，不等于所有项目都更慢；自定义挂载、WSL2 配置、网络文件系统和跨发行版路径可能让启发式误判。只验证路径存在也不能证明 Git、文件监听、权限、大小写或构建性能符合项目需要。 参见[Q04](#research-q04)。

> **建议**：可在用户同意后运行无破坏的微基准和语义探针，例如小文件创建/删除、大小写、文件监听与 Git status，用工作负载证据补充路径标签。它可能减少把所有 /mnt 一概判坏的误报，但基准本身会写临时文件并增加等待。 参见[Q08](#research-q08)。

<a id="plugin-1276714299-root"></a>

## [embedded-workbench](../../plugins/amethystluna--embedded-workbench/INSIGHT.md)

[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 2,906](https://img.shields.io/static/v1?label=npm+30d&message=2%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench)

> **用途**：固件设计、调试和构建工作中按任务加载领域 Skill；DSH 原生 bundle 也向每个 agent 会话注入短门禁。详见[Q01](#research-q01)。

> **亮点**：把嵌入式经验指南作为跨平台 Skill 打包，并给 DSH 单独实现注册与门禁。详见[Q01](#research-q01)。

> **思考**：门禁是提示而非强制计划验收；作者兼容测试主要检安装/注入，不等于固件建议可靠。详见[Q02](#research-q02)和[Q03](#research-q03)。

> **建议**：为代表性固件问题建立专家标注与失败回归集，将 Skill 触发、建议质量和门禁成本同时测量。详见[Q05](#research-q05)。

<a id="plugin-1343702731-root"></a>

## [harness-github](../../plugins/988hj7tczd-oss--harness-github/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/harness-github) [![npm 30d 148](https://img.shields.io/static/v1?label=npm+30d&message=148&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/harness-github) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/harness-github)

> **用途**：帮助在DSH处理软件交付的人取得GitHub事实并准备操作，合格结果需对象、授权和最终状态可回读。

> **亮点**：把成熟gh/REST能力包装为DSH结构工具、统一凭据路径与远程审批，减少重复命令接线；价值是集成便利而非新增GitHub原语。详见[Q02](#research-q02)。

> **思考**：pr_prepare可在审批前git add -A并commit，与拒绝零副作用承诺冲突；REST对非幂等写也通用重试，断连后可能重复发布，合并未绑定head。均为源码路径判断，未向GitHub复现。详见[Q02](#research-q02)。

> **建议**：可探讨状态绑定动作收据，先明确本地/远程操作、摘要和head再审批，未知结果先回读且不重放非幂等写；新增状态与恢复负担，未验证。详见[Q05](#research-q05)。

<a id="plugin-1344270011-root"></a>

## [J-Space Cognition Suite DSH适配](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AnonyJcy/dsh-j-space) [![npm 30d 2,004](https://img.shields.io/static/v1?label=npm+30d&message=2%2C004&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anonyjcy/dsh-j-space) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anonyjcy/dsh-j-space)

> **用途**：适合多阶段工程任务维护来源、问题、报告与验收记录；简单任务按轻量流程。

> **亮点**：适配增量是原生预设、包内技能定位与DSH权限映射；上游认知模块和控制器明确归上游，不计为适配原创。[Q03](#research-q03)

> **思考**：结构、hash和轮次能约束记录，却不能证明结论正确；没有可信hook时只属合作控制，不能视作自动强制门禁。[Q04](#research-q04)

> **建议**：未验证假设是用来源依赖图安排定向复核，降低无关重做；改动全文刷新须另作方法实验并以漏复核和最终缺陷证伪。[Q07](#research-q07)

<a id="plugin-1331586818-root"></a>

## [LogicProbe](../../plugins/amethystluna--logicprobe/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 2,746](https://img.shields.io/static/v1?label=npm+30d&message=2%2C746&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-logicprobe)

> **用途**：面向用Agent设计状态机、迁移或架构的开发者；合格结果是可追溯模型、具体反例和覆盖边界，不能只看通过标签。

> **亮点**：相对单靠模型口头审查，增量在封闭模型语言、可执行反例、前后版本回归与结构化判决的组合；模型转换正确性仍由人和Agent承担。[Q01](#research-q01)

> **思考**：最强证据是引擎明确输出预算耗尽未决和覆盖注记，但被检对象仍是用户提供的抽象模型；模型通过无法推出源程序或真实并发正确。[Q03](#research-q03)

> **建议**：未验证假设是把模型每个转移绑定到源码片段及声明假设，要求模型变更时复核映射，以降低抽象遗漏；用已知缺陷比较映射前后的漏检与建模时间，收益不抵成本则否定。[Q05](#research-q05)

<a id="plugin-1426070939-root"></a>

## [MC Mods Dev Bridge](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md)

[![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/mcmodsdevbridge)

> **用途**：Minecraft 26.3 模组开发者在 AI 写完代码后仍需手工启动游戏、连接、op、操作 UI 和收集证据；基线是人工点测或单侧单元测试。合格结果是同一场景在目标 loader 的真实 server/client 上完成断言，保留日志、截图与 probe 响应，失败后进程和安装文件可清理。 详见[Q01](#research-q01)。

> **亮点**：相对人工点测，它把真实双端启动、交互、断言、证据和清理压成可调用流程，并从上游 Forge 1.20.1 扩到 26.3 三 loader。它提供验证基础设施而非测试设计；绿色只证明已写断言，声音、动画手感等仍需人工。 详见[Q03](#research-q03)。

> **思考**：最关键质疑是探针观察面是否代表玩家体验。HTTP probe 会改变被测环境，场景可能只验证探针可见状态而漏掉渲染、时序或 loader 特有问题；固定端口 39002 使客户端并发受限。环境包含游戏账号/安装、Java 25、loader 和大型进程，失败恢复成本高。 详见[Q04](#research-q04)。

> **建议**：未验证假设是为场景 DSL 加入“人类观察检查点”，在自动 probe 通过后只抽取无法数据化的声音/动画/UI 手感步骤，可显著压缩人工验收。最小实验选 20 个模组功能，对纯人工、纯 probe、混合检查点比较缺陷发现、人工分钟、假阳性与遗漏；混合组漏掉任何高严重度体验缺陷即削弱假设。 详见[Q08](#research-q08)。

<a id="plugin-1334569518-root"></a>

## [model-usage-plugin](../../plugins/aks1st--model-usage-plugin/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/model-usage-plugin) [![npm 30d 972](https://img.shields.io/static/v1?label=npm+30d&message=972&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/model-usage-plugin) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/model-usage-plugin)

> **用途**：面向在DSH Web混用多个模型/provider、希望知道token花在哪里和何时使用较多的个人开发者。它把模型用量、估算金额、趋势、工具频率和余额放在设置页，适合形成“哪种调用值得进一步核查”的线索。合格任务是把自有会话的实际usage准确归到模型/时间/来源，并清楚显示价格、套餐与汇率口径。

> **亮点**：把流usage、工具事件、去继承历史与显式套餐/价表/汇率控制接到同一设置页，减少手工整理；金额和工具指标不证明业务价值。详见[Q02](#research-q02)。

> **思考**：历史扫描在首个会话写日键后跳过同日其它会话，自动补齐不能据此视为完整；自定义余额地址会携带回退到的key，来源检查也只比hostname。未运行漏计或越权复现。详见[Q03](#research-q03)。

> **建议**：可探索逐会话/事件稳定ID账本与独立扫描watermark，再绑定价版本，比较漏计、重复、重启和资源负担；未实现。详见[Q06](#research-q06)。

<a id="plugin-1379204512-root"></a>

## [oh-my-dsh](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) [![npm 30d 2,166](https://img.shields.io/static/v1?label=npm+30d&message=2%2C166&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)

> **用途**：面向希望在 DSH 内组织长链路编码任务的开发者，把规划、委派、评审、恢复与团队协作收进一套显式协议。 [Q01](#research-q01)

> **亮点**：相对直接使用 DSH 原生工具，它把 OMC/OMX 的编排资产适配为 DSH 服务、降级矩阵和可恢复团队状态，增量主要是系统化组合与宿主接线，而非全新基础算法。 [Q03](#research-q03)

> **思考**：覆盖面很大，但价值依赖模型遵循协议、宿主服务契约与大量状态文件持续一致；源码可见注册和守卫，尚无同任务对照证明端到端合格率高于更小的原生流程。 [Q04](#research-q04)

> **建议**：可验证“按任务风险渐进开启编排能力”的设计，只在跨阶段或并行冲突出现时启用 team/graph，以降低常规任务的提示与状态负担。 [Q08](#research-q08)

<a id="plugin-1422240642-root"></a>

## [orchd项目任务面板](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md)

[![npm 30d 301](https://img.shields.io/static/v1?label=npm+30d&message=301&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-orchd) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-orchd)

> **用途**：已有orchd项目的开发者同屏查任务及依赖，原有基线为多次CLI与定义文档。详见[Q01](#research-q01)。

> **亮点**：把任务目标、运行态、依赖和审查来源并置，保留孤儿/未知/裁剪，而不另造任务状态权威。详见[Q01](#research-q01)。

> **思考**：白名单不约束项目Python副作用；detect未接运行runner，ready并不保证CLI健康或项目名一致；HTTP确认不是调用者授权。详见[Q02](#research-q02)。

> **建议**：把session/主树/引擎身份与多源采集批次组成受权观察快照，按越权/不一致/资源和裁剪反例证伪，未验证。详见[Q07](#research-q07)。

<a id="plugin-1334504487-root"></a>

## [Plan Lattice](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice)

> **用途**：长任务经上下文替换后仍需沿用已批准计划、人类要求和已返回委派结果；高风险写入可显式启用完整控制。

> **亮点**：把 DSH 自有 Session/plan/委派事实在真实 surface 替换后有界回填，避免创建第二个自动计划器；显式模式把契约、目标事实与受保护变更绑定，详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：默认 auto 不装写入门禁，显式模式也仅守护列名工具且外部副作用依赖 adapter；12/12 是手工设计机制样本，V17/V18/V20 不支持通用提升，详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：已有实现已过滤隐藏来源、保成功计划/前台最近3项并按maxContextBytes降级；进一步可研究在合格候选内部按当前子任务需求提供来源引用/缺口、必要时回退原投影。若遗漏权威或增加错续写则反证。此方向尚未实现，详见[Q03](#research-q03)。

## 更新时间

2026-10-23
