# 软件交付

[全部分类](INDEX.md) · [返回首页](../../../README.md)

代码开发、任务编排、调试与交付流程。

<a id="category-index"></a>

**同类比较**

> 比较表与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@240xu/dsh-session-lazy-view](#plugin-1377185339-root) | 以独立网页只读查看本地会话尾帧，提供时间线、搜索、统计及Markdown导出。 | 适合本机维护者先用只读小范围试用，默认tail或fast统计；搜索未命中和统计异常必须回原件复核。 |
| [@240xu/dsh-tech-lead](#plugin-1345209661-packages-dsh-tech-lead) | 面向 DSH 的旧版只读工程治理工具集，对调用方提交的结构化事实做分级、审计、Gate 与变更预览。 | 现有旧包用户可用于辅助 lint；新部署先比较 dsh-themis。 |
| [@7dgroup/dsh-skill-7d-git-commit](#plugin-1336870027-root) | 把 7DGroup Git 提交规范作为低优先级内嵌 Skill 注册到 DSH，并允许本地同名 Skill 覆盖。 | 适合已明确采用 7DGroup commit 规范且愿意保留提交授权门禁的团队试用；其他团队应先读 Skill 内容，和本地 COMMIT-RULES 对齐后再装。 |
| [@dsh-external/dsh-zero-residence](#plugin-1366089972-workspace-plugins-dsh-zero-residence) | 用确定性工具指针清单替换模型摘要，提供日志召回、近似上下文账本、强制压缩探针及异步PowerShell命令句柄。 | 先观察，先验证原件恢复hash、会话范围和受控后台任务生命周期，勿当生产无损压缩/沙箱。 |
| [@dsh-lsp-packs/dsh-lsp-cpp](#plugin-1344713526-dsh-lsp-cpp) | 把 clangd 配置为 DSH 的 C/C++ LSP 后端，为共享 lsp 工具提供导航、引用、实现和 hover。 | 有稳定 clangd 与 compile_commands 的 C/C++ 项目可在只读导航任务中试用；先核四个操作对 sample 和本项目代表文件的结果，再允许模型依赖它改代码。 |
| [@indexyz/dsh-autocompact](#plugin-1324229194-dsh-autocompact) | 按会话和精确模型路由设置提前压缩阈值，调用宿主摘要并保留结构尾部。 | 可重做单route有限试用，丢约束或总成本升即回原生；非安装验收。 |
| [@y9931666/dsh-plugin-roundtable](#plugin-1342524723-root) | 把DSH会话组织为可视化专家圆桌，支持持久子代理、协作发言、红队评审和人类决策。 | 建议2–3专家和非敏感方案小范围试用，另设真实供应商额度并独立验收；观点重复或预算无法解释时停止扩员。 |
| [7d-code-reviewer](#plugin-1336021761-root) | 一个注册到 DSH skills 的模板驱动代码审查 Skill，要求模型输出分级问题、评分与文字/HTML 报告。 | 以小范围 diff 试用，人工核行号/复现与 HTML 安全；避免分数代替审查结论。 |
| [Aegis Method Pack](#plugin-1225840521-root) | 为编码 Agent 提供按需技能路由、基线读取、变更治理与完成证据流程，含 DSH 适配。 | 先在单个中等任务核当前证据与实际路由，保留项目规则优先；流程过载就改explicit或退回原工作法。 |
| [Agent Vision Toolkit](#plugin-1319174653-root) | 为文本编码 Agent 提供图像问答、定位、长截图 OCR、像素处理与可选视觉代理。 | 建议公开截图的手工CLI限定试用，先保留原图复核和现有模型；敏感出站、漏段或重试成本不可控时停用并回原生视觉/人工检查。 |
| [agent-development-constraints](#plugin-1404700411-root) | 提供项目开发规则库与提炼精简合并流程，DSH按症状查询规则并一次注入入口目录，另有上下文成本观察和可选提交脱敏检查。 | 先观察，可人工择取规则方法，先核隐私/路由/会话和安装保留再在重要项目启用运行面。 |
| [agent-qa](#plugin-1232322871-root) | 以自然语言运行Web、Android和iOS测试旅程，保存步骤观察、条件判断与知识材料。 | 有QA能力团队可在测试副本把它作为补充探索回归，保留确定性断言并审阅失败证据；关键后台状态或模型误判频繁时缩小范围，不替代既有放行检查。 |
| [AgentRQ](#plugin-1190390511-root) | 以共享任务板、MCP/ACP、权限请求和机器接入组织人工与多 Agent 协作。 | 建议有自托管能力和人工负责人的团队用非敏感只读任务试用，不从Done联动生产；归属、重复或产物不明时回普通看板人工验收。 |
| [AI Look-Up](#plugin-1401618027-root) | 监测代理重复调用、失败循环和目标漂移，并在触发时注入自检提示。 | 适合经常运行长时编码代理、能审阅提醒台账的团队先观察，不适合短任务或对中断敏感的会话。 |
| [AI 残渣清运](#plugin-1406611614-root) | 按规则把代理副产物移入可恢复回收站，并支持项目结项归档。 | 适合副产物命名规律稳定、能先维护 ignore 且使用版本控制的项目试用；高价值数据目录或命名混乱仓库只运行 dry-run。 |
| [ANet DSH Bundle](#plugin-1302597978-deploy-plugins-dist-dsh) | 为 DSH 操作者将本机 anet 节点接到 MCP 与 Skill，以统一可执行路径和身份发现对端、委派任务并跟踪结果。 | 观察优先，操作者先关闭自动装并固定审阅运行时/guide/身份/节点政策，才确定非敏感无消费小样；版本/政策不明或任务/worker仍未知先停扩张并核状态。 |
| [Archify](#plugin-1211139949-root) | 通过结构化规格生成可交互图形与独立 HTML 说明页的 Agent Skill | 熟悉系统的人先对一条请求链做受控试用，以关系正确、读者理解和总人工分钟为验收；关键边无事实支持或修复负担更高时退回简单图。 |
| [Archify DSH 适配器](#plugin-1211139949-integrations-deepseek-harness) | 为 DeepSeek Harness 提供 Archify 架构图 Skill 的可选 npm 分发包 | 观察默认根修复正式发布；若已有受支持 CLI 环境，先验证 Archify 与所有默认根正文共同加载，失败即移除并回到原安装方式。 |
| [billion-context](#plugin-1324949198-root) | 为长会话提供模型驱动的增量分层压缩、原文恢复、上下文搜索及多客户端代理/原生通道。 | [Q05](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q05)建议长任务维护者以独立profile、原日志和固定模型比较宿主compact，先验收关键事实再看token。 |
| [brooks-lint](#plugin-1192608669-root) | 以十二本工程经典的风险框架组织代码、架构和测试评审，提供六种 Agent Skills 模式。 | 先用小diff的review模式，保留人工评审与静态lint；不要凭健康分自动改代码或合并。 |
| [CA 参考库](#plugin-1349267272-root) | 为Clean Architecture审查提供本地参考仓全文检索、基线清单、审查留账和观察面板。 | 建议先观察，补齐可核对的外部语料并验证过滤与健康状态后再做受控审查辅助；不能自动据基线放行项目。 |
| [CC Safety Net](#plugin-1122873619-root) | 在编码 Agent 工具执行前检查破坏性命令和秘密文件访问，支持 DSH 等多个宿主。 | 在临时无秘密仓库受控试用，先核工具覆盖和应放/应拒语料；不执行危险命令来证明阻止。 |
| [Chat Import](#plugin-1333200468-root) | 将其他编码 Agent 历史转换为 DSH 事件会话，提供预览、重导保护、路径映射及反向导出入口。 | 固定宿主和代表日志，先副本预览、少量导入及核对后续聊；源原件和附件保留，不在重要数据试purge或源删除，见 [Q03](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q03)。 |
| [CI Diet](#plugin-1426954291-root) | 发现 GitHub Actions 潜在浪费，保留证据并预览供人工审查的小幅工作流补丁。 | 有限试用，离线scan后只审查一个受支持工作流；净收益或质量不达标即回退。 |
| [CloudBase AI Toolkit](#plugin-988892963-root) | 以 MCP、场景 Skill 和 IDE 插件把 CloudBase 数据库、存储、函数与部署接入 AI 编码工具。 | 建议已有测试环境的开发者固定MCP后限定只读查询试用；未核客户端确认/IAM/环境前不生产删除，状态不明退控制台。 |
| [CloudBase DSH 插件](#plugin-988892963-dsh-plugin) | 把 CloudBase MCP、包内 Skill 和数据库/部署结果卡片接入 DSH 会话。 | 建议观察，先固定MCP并做单会话测试环境只读核查；环境/审批未清前不删除或发布，失败退回控制台核对原资源。 |
| [Code RAG 索引面板](#plugin-1347752454-plugins-dsh-code-rag-index-panel) | 在DSH会话显示Code RAG索引状态与进度，并提供索引操作、设置和诊断卡片。 | 建议已有本机code-rag基础设施且能核对目标根的开发者试用；普通搜索需求先比较现有工具，setup和重建须按实际写入与算力操作处理。 |
| [Codex Taskboard 本地任务看板](#plugin-1311108439-root) | 本地优先任务看板，通过浏览器、taskctl和Skill管理项目与AI任务交接。 | [Q01](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q01)、[Q04](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q04) 先在非关键项目试用浏览器与CLI，验证任务版本冲突和待审接受；有明确同步收益后才考虑桌面注入或云模式，不把根目录作为DSH可装插件。 |
| [Coding Tools MCP](#plugin-1245329241-root) | 通过 MCP 为编码客户端提供工作区文件、结构化修改、命令会话和 Git 工具。 | 建议缺原生工具的MCP用户在可丢弃repo以safe/stdio试用，先读再做可审单改；不可信命令需外部容器，状态不明则停并回原工具。 |
| [DeepSec](#plugin-1295322882-root) | 结合 Shield 代码审计、Spear 授权测试、CLI/TUI 与 IDE 接入的安全工具平台 | [Q04](../../plugins/unclecheng-li--deepsec/INSIGHT.md#research-q04) 仅在自有副本试用本地Shield并人工确认finding；不可读文件或覆盖不明时停止依赖零发现结论，回原扫描和人工审阅。 |
| [DeepSeek Harness Desktop（社区版）](#plugin-1333486649-root) | 集成官方 DSH Runtime 和 Web UI 的社区桌面客户端，提供窗口、插件及桌面操作入口。 | [Q04](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q04) 仅建议能核对发行来源和权限的开发者用独立profile及非关键目录探索，先确认启动、完整输出和重启保留结果；权限或恢复不清立即停止，回到官方Web。 |
| [DeepTide](#plugin-1230068255-root) | 提供 DeepTide 编码客户端入口、Zero CLI 命令别名、Rust实现与 Apple Silicon 本地推理引导。 | 建议先观察并固定单一形态和上游版本；本地profile不满足或自测失败时不继续切配置，保留原客户端/云API作为退路。 |
| [deja-vu](#plugin-1300173275-root) | 本地索引多个编码 Agent 的历史会话，并向 DSH 提供检索工具和自动上下文。 | 建议个人工作机限定非敏感项目试用，召回仅当线索、原会话与当前代码共同核对；隐私跨项目或错误无匹配出现时关闭自动注入并回原日志。 |
| [Desktop CC GUI](#plugin-1148960257-root) | 用独立桌面界面接入DSH及多个编码CLI，管理会话、工具输出和项目。 | 同时使用多个编码CLI的开发者可关注这个统一桌面客户端。 |
| [dock-base](#plugin-1340492184-root) | 为DSH web提供统一布局、视图实例、命令和设置注册服务，供功能插件按需组合。 | 有多视图组合需求可试用，先核对上下文与异步关闭；逐个研究功能插件而非默认全装。 |
| [dock-editor](#plugin-1340492335-root) | 为 dock 文件域增加同工作台的文本查看、编辑、保存与关闭提醒。 | 可对非关键小文本进行受控试用，保存后回读目标并留版本库或备份；对并发编辑和重要配置沿用有冲突检测的工具。 |
| [dock-git](#plugin-1340492447-root) | 在 DSH Dock 中查看 Git 提交图与差异，并对会话仓库执行暂存、提交、分支和远端操作。 | 建议观察，先在隔离仓库核对钩子策略、破坏操作确认和远端失败恢复；团队质量门禁另作明确安排。 |
| [DS Harness Remote](#plugin-1334325657-root) | 从浏览器或移动设备连接原工作电脑上的 DSH 会话、工作区和远程操作。 | [Q04](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q04) 使用自己的可信设备和非关键Host，先验证只读会话，确认Host用户及身份后才考虑最小写操作；终端关闭直到明确权限。 |
| [DSH Agent Team GUI](#plugin-1334766747-root) | 为 DSH Web 保存可复用多模型团队，编排任务依赖、查看运行记录并汇总供应商报告的 Token 用量。 | 先在匹配宿主的空白项目，用一个模型与有限成员验证完整交付，给成员明确且不重叠的文件范围；逐次核对产物、测试和计量覆盖。 |
| [DSH AgentTeams](#plugin-1332073142-root) | 让当前DSH会话组织持久子Agent团队、依赖任务、消息和协作界面。 | [Q01](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q01)、[Q04](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q04) 先用两成员只读任务确认依赖、消息、停止与恢复，再考虑互不重叠写任务；没有可分任务或复核人时继续单Agent。 |
| [DSH Armory](#plugin-1413052822-root) | 为 DSH 提供 MCP、Skill、专家与插件的统一管理看板、市场入口和工具使用账本。 | 已有多对象负担者可隔离profile先备份再试非关键Skill，核目录和宿主；旧目录丢失、生效不符或工具裁剪损任务时停止更多写入，从备份恢复并回原生管理。 |
| [DSH Better Sidebar](#plugin-1326893710-root) | 为DSH提供文件编辑预览、Git、任务和侧聊工作台，并开放标签页与预览器扩展接口。 | 适合希望减少DSH与IDE切换且能核对版本的开发者，先在独立低权限宿主和可丢弃目录只试文件预览、一个文本修改及只读Git图。 |
| [DSH Better Sidebar N23](#plugin-1352600211-root) | 为DSH提供文件编辑预览、真实终端、Git、浏览器与可扩展双面板工作台。 | 建议先观察发布源与运行产物同步、宿主范围；如自行评估，只在备份的小仓库试验文件/Git/PTY，不用它承担工作区隔离。 |
| [DSH Codex Taskboard 侧栏集成](#plugin-1311108439-integrations-deepseek-harness) | 在DeepSeek Harness侧栏嵌入已启动的Codex Taskboard本地看板。 | [Q03](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q03) 仅建议已有Taskboard服务的人试用这一薄入口；首次接触者先确认独立浏览器看板工作，再接DSH。 |
| [DSH Graphlint](#plugin-1285824983-integrations-dsh) | 为DSH提供graphlint依赖图查询、索引构建、配置工具和使用Skill。 | 已有graphlint使用经验且愿意逐项核对告警的开发者可先在分支试用。 |
| [DSH Harness Switch](#plugin-1414577411-root) | 在DSH原生会话中绑定模型与harness，嵌入固定Kimi Code执行核心并桥接审批与历史。 | 熟悉Kimi和DSH的开发者可在单进程隔离profile及副本工作区试用；出现pending未知结果先查日志与文件，不自动重试，要求无损迁移或完整计费者暂缓。 |
| [DSH Integration Settings](#plugin-1429103083-root) | 为本地 DSH 管理员提供 MCP JSON 导入和网关模型、思考档位的设置页，含差异预览、受管配置及文件备份。 | 来源缺口另核，固定实现仅本地可恢复管理员隔离手动小样；错误profile/意外移除/部分成功时停写停调度，逐文件恢复后重启，别盲重放。 |
| [DSH iOS](#plugin-1339882322-root) | 在 macOS/Xcode 侧为 DSH 提供模拟器与 USB 测试 iPhone 的构建、观察和输入工具，并在会话中显示可交互实时画面。 | 自有小App模拟器先测，真机独立授权/签名/恢复，失败核状态，见 [Q03](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q03)。 |
| [DSH Model Router](#plugin-1353534254-root) | 在DSH中规划任务、比较模型路由，并通过模型API或厂商CLI执行依赖工作包。 | 可供已有多路模型配置的开发者先在只读、小额、可人工验收的依赖任务里试用；先检查价格缺失、quality来源和执行权限，验收每包结果及通道回执。 |
| [DSH Orchestrator2](#plugin-1409845351-plugins-dsh-orchestrator2) | 提供自动开发调度预设，以任务包组织设计、开发、审查、预算与人工验收。 | 建议先观察并核对派工回执与角色参数，再做隔离任务包验收。 |
| [DSH Python Env](#plugin-1335843541-root) | 管理工作区Python虚拟环境，提供发现、创建、安装、卸载和删除工具。 | 可信代码仓库的开发者可在一次性工作区试用。 |
| [DSH Reverse Skill](#plugin-1334214605-root) | 将上游逆向与安全研究技能目录递归注册进 DSH skills 服务的适配插件。 | 保持观察。 |
| [DSH Router Standard](#plugin-1334459444-root) | 以 Agent/Preset 和 Cordis 模块为软件任务分阶段展示、限制工具，并提供目录帮助、路由状态和交付证据清单检查。 | 先独立可回退小任务对照Standard，验FAIL/阶段分离及持久恢复，再扩大使用，见 [Q03](../../plugins/yjh051108--dsh-router-standard/INSIGHT.md#research-q03)。 |
| [DSH Skills Manager](#plugin-1334830521-root) | 在 DSH 中浏览、启停和管理本地及项目技能，并从仓库安装、更新与恢复技能。 | 先在单个测试项目核对同名启停，再给一个有本地修改的仓库技能预览更新并验收回滚；不熟来源先停用。 |
| [DSH Task Board](#plugin-1331636953-packages-dsh-task-board) | 在 DSH Web 界面管理任务，由 Host 执行真实会话、定时调度并记录验证与执行状态。 | 临时工作区单任务试用，分开手工列、执行终态和验证结果；先保留人工验收。 |
| [DSH Taskboard](#plugin-1333732838-root) | 以 SQLite 权威任务状态连接 DSH Agent 执行、排他认领、自动化和人工验收入口。 | 有限试独立测试库和可丢弃目录，先手动后自动，额外控制CLI/DB及模型工具权限。 |
| [DSH Turn Rewind](#plugin-1333100390-root) | 为DSH消息提供文件检查点、变更预览、选择恢复及会话重新开始。 | 适合经常需要撤销Agent文件修改且愿意核对路径的开发者，在可丢弃副本中先做一次“文件恢复+消息新建”，对照受管理路径内容与原会话。 |
| [DSH Vision Router](#plugin-1333446374-root) | 为 DSH 文本模型会话提供图像工具、视觉后端回退、像素处理和会话开关。 | 建议公开截图测试会话限定试用，先明确云出站或配置local-only；敏感内容、连续错误或无法核原图则关Vision回原生/本地流程。 |
| [DSH Vision Toolkit](#plugin-1333100071-root) | 在DSH会话中接入图像问答、OCR、定位、截图差异和视觉产物。 | 使用文字模型的DSH开发者可先拿非敏感截图做定位或差异检查。 |
| [DSH 插件市场](#plugin-1367597810-root) | 从 DSH 侧栏浏览社区目录，查看已安装和可更新插件，并执行安装与 profile 重载。 | 建议在独立测试profile对一个可信包试用；先备份清单与锁文件，确认目标和来源，安装后核对加载；来源替换或恢复状态不清即停止并退回固定命令。 |
| [dsh-a11y-scan](#plugin-1344715270-root) | 在DSH中调用axe扫描本地HTML或确认URL，输出定位、修复线索、人工复核项和多格式报告。 | 可信无敏感页面可限范围试用作自动线索，先核实际网络/文件与规则覆盖，保留人工复核。 |
| [dsh-about](#plugin-1354283280-root) | 在 DSH Web 设置页展示推断的运行版本、插件版本和 GitHub Releases 摘要。 | 仅作排障辅助，报告版本同时附 CLI 输出；试点核多安装布局和离线回退。 |
| [dsh-agent-recycle-guard](#plugin-1414323673-root) | 将 Agent 常见直接删除改为系统回收，并对执行脚本做有限内容检查，异常时阻止命令。 | 建议有独立备份的维护者在可丢弃目录受控试用常见删除缓冲；不以此替代权限隔离，准备长期阻断、语义不一致或需要动态程序全覆盖时停止。 |
| [dsh-agentdebugx](#plugin-1296792947-integrations-dsh-agentdebugx) | 连接 DSH 会话与 AgentDebugX，支持保存会话发现、当前或历史轨迹诊断和本地查看。 | 建议观察，先修明物理路径与取消契约，缩窄历史root，之后再考虑不敏感当前工作区轨迹；同模型自诊断不作为独立效果证明。 |
| [dsh-ai-armor](#plugin-1425045401-root) | 将Git回归、堆栈、配置、shell转义和MyBatis Plus静态审计工具合并分发。 | 可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。 |
| [dsh-anchored-standard](#plugin-1334245678-root) | 提供实验性DSH预设，通过首轮上下文门控、工具分阶段暴露与历史种子控制模型轨迹。 | 当前生产采用不推荐，研究者可只借鉴epoch门控实现做隔离实验。 |
| [dsh-approval-explainer](#plugin-1417137113-root) | 为 DSH 真实审批弹窗生成操作、意图、风险和选项含义的 AI 注释，并提供历史与诊断视图。 | 先观察并确认同意把审批参数和近期上下文交给所选模型，在低风险可撤销样本中核对目标、权限和选项含义。 |
| [dsh-ark-coding-provider](#plugin-1421741516-root) | 为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。 | 有条件试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。 |
| [dsh-asciinema](#plugin-1344714509-root) | 把DSH会话工具结果文字缓冲为自有cast对象文件，提供会话录制/标记、HTML回看与纯文本转换。 | 观察，先修模板路径/时间与保存pending恢复，非秘密小样也须核采集/分享范围。 |
| [dsh-auto-reviewer](#plugin-1336185734-root) | 为 DSH 增加 auto-review 权限预设，按规则与可选 LLM 裁决提权并显示通知。 | 先在可恢复的宿主副本用无副作用样本比较决策，特别检查旧确认、新目标和参数缺失。 |
| [dsh-cache-bricks](#plugin-1386463441-root) | 用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。 | 建议本地单用户维护者用不敏感会话试用，先核对attempt、usage和访问边界；主链延迟、字段错位、UI干扰或权限不清时停止，回到宿主日志。 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz) | 解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。 | 建议试用。 |
| [dsh-codex-bridge](#plugin-1427331352-root) | 通过Codex CLI读取账号额度与模型建议，并以可选模型和推理强度委派独立任务。 | 单人已有账号先只读短任务，核模型/额度/结果；写任务用可恢复工作树，超时先验产物，高价/低额需真实用户接受。 |
| [dsh-codex-guard](#plugin-1340906871-dsh) | 在 DSH 中调用 codex-guard，对 Git 变更进行提交前卫生检查。 | 建议观察；先核实际 CLI 版本、cwd 和覆盖，再对六类场景隔离验证，不能将字符串成功返回当提交放行。 |
| [dsh-context](#plugin-1333961389-root) | 展示DSH上下文组成、请求趋势、事件与会话网络，提供诊断视图和提示前后缀配置。 | 需要排查上下文膨胀的DSH用户，可在匹配宿主上保持prompt前后缀为空，从一个已知请求核对token环、Context Browser与原始日志。 |
| [dsh-deja](#plugin-1300173275-extensions-dsh) | 在 DSH 中搜索同机其他编码 Agent 的历史，并通过工具、命令和可选自动召回提供上下文。 | 先手动精确查询，核实际CLI版本与内容，再决定是否开启自动上下文。 |
| [dsh-dep-vuln-scan](#plugin-1344714002-root) | 读取常见项目锁文件，向OSV批量查询依赖版本公告，展示漏洞、修复候选与命令建议，并保存可重放结构化报告。 | 先观察。 |
| [dsh-diff-approval](#plugin-1335980444-root) | 将工具改动汇入会话内待审面板，支持差异决定、批注及有条件撤销。 | 单人可备份树有限试用；发现分歧或持久错误先停动作保现场。 |
| [dsh-domain-bridge](#plugin-1424063534-plugins-dsh-domain-bridge) | 提供声明优先域寻址、分层暂停、持久消息队列、会话工厂、模型分派、命令菜单与静态工作台入口。 | 建议观察。 |
| [dsh-engineering-workflow](#plugin-1335988605-root) | 可选工程 preset 与六个方法 Skill，以五阶段文字门禁引导 DSH Agent；Host 自动同步本地预设并公告。 | 备份 DSH_HOME/.agent-presets/engineering-workflow，再在新会话选择 preset 做对照试验；详见[Q02](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q02)、[Q03](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q03)。 |
| [dsh-eteams](#plugin-1372993989-root) | 为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。 | 试用，备份/可信管理面/明确人工验收，completed按成员报告解读，不能当全自动业务验收。 |
| [dsh-evidence-gate](#plugin-1365519118-root) | 为 DSH 会话提供可切换的证据提示、主张裁定工具及持久活动索引。 | 建议观察，单人本地可作为提醒和线索索引；关键事实须回查原始输出，不能依赖 verified 机器标签自动放行。 |
| [dsh-expert-mode](#plugin-1334811048-root) | 提供专家协调预设、领域委派工具、渐进式方法、文件消息总线和任务看板。 | 当前建议观察。 |
| [dsh-fail-logger](#plugin-1333463381-root) | 从 DSH 会话事件采集工具失败，去重计数后写入本地 Skill，并可注入预防和恢复提示。 | 先在复制的非敏感日志上观察，关闭全局提示做基线，验证不同模式失败覆盖及文件写失败恢复。 |
| [dsh-folderwatch](#plugin-1423215448-root) | 监控目录元数据快照变化，经批处理与路径回声过滤后唤醒或排队通知DSH Agent，提供挂载、检查、触发和移除工具。 | 观察，先可信单profile窄目录queue核扫描/接收/恢复，不作为可靠生产触发或多用户隔离。 |
| [dsh-git-graph](#plugin-1331636953-packages-dsh-git-graph) | 在 DSH 界面显示 Git 分支与提交图，并管理独立 worktree 和新会话工作区。 | 多会话开发者可在临时仓库试用，先验证新会话确实进入独立 cwd，再测试脏目录删除被拒绝及禁用后的状态保留。 |
| [dsh-github-router](#plugin-1339462797-root) | 提供PR、Issue、文件及API只读工具，通过API、gh、Git、HTML与可选镜像在宿主内降级取数。 | 先观察；公共仓库单用户隔离环境可对照，私有多身份/共享存储先解决缓存与授权边界。 |
| [dsh-hdc-bridge](#plugin-1333258432-root) | 为 DSH 集成鸿蒙设备调试、截图/UI操作、官方知识查询及可选 DevEco 构建签名流程。 | 建议观察，先核对core作用域和面板权限；显式target与工程、使用无真实数据设备，确认状态绑定后再决定受控试用。 |
| [DSH-HoneyBee](#plugin-1355618827-packages-dshb) | 将 DSH 文件、命令和终端操作路由到本地、SSH 或 Docker 节点，并管理认证、工作区指令与同步。 | 当前先观察。 |
| [dsh-j-space](#plugin-1344270011-root) | 将 J-Space Cognition Suite 接入 DSH 原生 Agent Preset 并保留证据控制器 | 兼容环境的复杂任务先单agent受控试用，明确合作协议与宿主强制门禁区别；简单任务用原生记录，重读/复核负担不能换来质量时停止扩展。 |
| [dsh-jev-guard](#plugin-1378138611-root) | 在DSH工具执行前组合静态规则、Jev判据和人工升级，检查删除或覆盖风险。 | 先在可恢复目录验证良性、危险及断网样本，再把它作为附加事故阀；降级时看status，保留原生沙箱和审批，不依赖单一判据。 |
| [dsh-jev-interceptor](#plugin-1382292535-root) | 将 Jev typed 决策接入 DSH 工具风险分流、证据门控预批及上下文保留 | 隔离profile条件试用：图像卸载保持关闭、白名单空并从shadow审起；任何shadow状态变化、无遥测有效动作或resolver缺失即停用整个bundle回原生。 |
| [dsh-leak-guard](#plugin-1422091204-root) | 发布前本地遍历文本和敏感文件名，按凭据模式返回位置、级别与六字符预览，提供scan和rules工具动作。 | 先观察，仅额外线索，不自动发布；先修覆盖/错误/预算状态，保留独立扫描与人工审查。 |
| [dsh-lighthouse](#plugin-1422364992-root) | 按显式名册汇总作品本地、GitHub、市场、npm和PR等待，提供面板/工具/CLI及落盘卡片。 | 先观察，公开本机使用也核PR/权限/失败状态。 |
| [dsh-lsp-csharp](#plugin-1344713526-dsh-lsp-csharp) | C# LSP 配置包，将 .cs 文件路由给外部 OmniSharp stdio 服务器和 DSH 共享 LSP 基座。 | 确认安装形态：若仅有 OmniSharp.dll，配置 command=dotnet 和 DLL 绝对路径；在真实 .sln/.csproj 测四操作。 |
| [dsh-lsp-go](#plugin-1344713526-dsh-lsp-go) | 以 gopls 为外部服务器的 Go LSP 配置包，复用 DSH 共享 LSP 基座。 | 先安装/验证 gopls，挂共享基座，再以真实 go.mod 项目试定义、引用、实现、hover；详见[Q03](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-go/INSIGHT.md#research-q03)。 |
| [dsh-lsp-java](#plugin-1344713526-dsh-lsp-java) | 在 DSH 中为 .java 文件配置 Eclipse JDT 语言服务导航。 | 已有 Java 环境者可对小项目试用，等索引完成并核对四项结果；若主要在成熟 IDE 中工作或无法维护独立 workspace，暂不增加此依赖。 |
| [dsh-lsp-kotlin](#plugin-1344713526-dsh-lsp-kotlin) | 为 DSH 接入 Kotlin 语言服务，配置 .kt/.kts 导航路由及外部 kotlin-language-server 启动参数。 | 建议观察，先核对包可取得性、宿主版本与外部 server，再在小 Kotlin/Gradle 工程分别验 .kt 和 .kts，避免仅按包加载判断成功。 |
| [dsh-lsp-lua](#plugin-1344713526-dsh-lsp-lua) | 以 lua-language-server 为外部服务器的 Lua LSP 配置包，默认 --stdio 与 .lua→lua。 | 先核 lua-language-server --stdio 和共享基座，再以真实 Lua 模块试四操作；详见[Q03](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-lua/INSIGHT.md#research-q03)。 |
| [dsh-lsp-php](#plugin-1344713526-dsh-lsp-php) | 为 DSH 预置 PHP LSP 的服务器命令与扩展名映射，并复用共享 stdio 底座。 | 当前建议观察；若能获得包并已配置底座，可先在隔离工作区检验四操作、故障提示和移除行为，再决定是否小范围试用。 |
| [dsh-lsp-pyright](#plugin-1344713526-dsh-lsp-pyright) | Python/Python stub 的 Pyright LSP 配置包，委托 DSH 共享基座启动外部 pyright-langserver。 | 先确认 pyright-langserver 在 DSH 执行环境 PATH，使用实际 .py/.pyi 与 venv 项目测试；详见[Q03](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-pyright/INSIGHT.md#research-q03)。 |
| [dsh-lsp-ruby](#plugin-1344713526-dsh-lsp-ruby) | 为 DSH 的 .rb 文件预设 ruby-lsp 路由和语言服务配置。 | 先选定解释器与 Gemfile，明确全局或 bundle 启动，再对真实项目的跨文件查询试用；不把单文件 smoke 外推。 |
| [dsh-lsp-rust](#plugin-1344713526-dsh-lsp-rust) | 以 rust-analyzer 为外部服务器的 Rust LSP 配置包，复用 DSH 共享基座。 | 确认 rustup 组件、rustc 与 DSH PATH；用真实 Cargo workspace 试四操作、首次索引；详见[Q03](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-rust/INSIGHT.md#research-q03)。 |
| [dsh-lsp-swift](#plugin-1344713526-dsh-lsp-swift) | 为 DSH 接入 Swift 的 sourcekit-lsp，配置 .swift 文件导航所需的服务器命令和语言映射。 | 建议观察，先核包与工具链来源，在小 SwiftPM 工程构建后分别验四操作；失败构建时只记部分可用。 |
| [dsh-lsp-ts](#plugin-1344713526-dsh-lsp-ts) | 以外部 TypeScript language server 为 TS/JS 文件提供四扩展路由的 DSH LSP 配置包。 | 先核主机 server、共享基座，再在真实 TS/TSX/JS/JSX 项目试四操作；详见[Q03](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ts/INSIGHT.md#research-q03)。 |
| [dsh-memory-evolve](#plugin-1323731026-root) | 为 DSH 提供分层记忆、确认队列、待办与可选会话协作能力的组合插件 | [Q04](../../plugins/csyangwen--dsh-memory-evolve/INSIGHT.md#research-q04) 先在独立profile/备份库验证关键记忆确认和分支切换；若未知分支造成错引用或队列状态不明，停用自动快照并回AGENTS.md/人工日志。 |
| [dsh-mermaid](#plugin-1334569498-root) | 在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。 | 适合经常看Mermaid图的人先用小图试用，保留strict和合理限制，报错先复制后决定是否发AI；卡顿、异常交互或草稿覆盖就停相关路径。 |
| [dsh-model-everything](#plugin-1423488109-root) | 把设计和代码断言建成模型，执行验证、图审查和前后报告比较。 | [Q01](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md#research-q01)、[Q04](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md#research-q04) 建议仅对已有小模型能力的架构师隔离试用，先检查已知反例与抽取覆盖，再核对报告是否正确区分skip和未决；不以模型通过放行实际代码。 |
| [dsh-model-failover](#plugin-1415863200-root) | 把已接入 DSH 的模型组成队列，提供失败重试、切换、会话隔离与自动继续。 | 有限试用可回滚任务，先设总尝试上限并验证取消、隔离和副作用；不可逆操作暂缓。 |
| [dsh-modernize-code](#plugin-1344714334-root) | 通过 Skill 和两个 Python 工具辅助遗留代码预检与热点扫描；迁移方案与改码依赖模型/人工。 | 用隔离副本运行两工具，限定 out，人工标注热点、运行真实构建/测试后再定路线图；详见[Q03](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md#research-q03)。 |
| [dsh-multi-folder](#plugin-1334119885-root) | 为DSH项目配置副工作目录，保持主cwd并将原文件和shell工具按单次目标重定根，附UI与@发现。 | 观察，继续从无碰撞稳定身份、store不落Agent写根及明确UI能力约束着手。 |
| [dsh-mysql](#plugin-1337916824-root) | 在DSH设置管理多套MySQL连接，会话选择目标数据源，模型可查看表结构、查询，并在独立授权后执行行写与DDL。 | 先观察。 |
| [dsh-openai-oauth](#plugin-1335992154-root) | 为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。 | 可试用为本机独立模型provider，保护明文凭据与真实工具审批，保留替代路由；不外推远程部署/静态模型全部可用/免费。 |
| [dsh-ops](#plugin-1409893258-root) | 为DSH提供紧凑文件、文档与PTC工具，并按需加载能力和替换部分官方工具。 | 可在备份或Git工作区内试用一个批量文件读取任务，先保持官方工具可恢复，再检查结果完整性。 |
| [dsh-organism](#plugin-1366089972-workspace-plugins-dsh-organism) | 以器官模型聚合 DSH 工具，提供心跳体征、反射、代理调用和工具显影。 | 先隔离核 body_map/status 与宿主工具表，再分别启用门控和反射；保持最小权限与直接调用回退。 |
| [dsh-ouroboros 配置桥](#plugin-1133901637-integrations-dsh-plugin) | 通过DSH的MCP客户端挂载Ouroboros访谈、规格、执行与评估工具。 | 已会配置Ouroboros且需要DSH入口的用户，可在副本profile先固定已审阅引擎版本，只试短访谈和Seed生成，确认实际后端及env。 |
| [dsh-pentest](#plugin-1335155355-root) | 为 DSH 提供授权安全调查的目标、线索、事实、资产、漏洞图与报告视图 | [Q03](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q03) 观察旧版与自维护样本，不把归档包可下载当当前兼容。 |
| [dsh-plugin-adapter](#plugin-1374274469-root) | 在 DSH 注册原生 LlmAdapter，接入 OpenCode Zen 匿名模型并维护模型目录。 | 观察，先完成非敏感隔离环境的 relay/代理/工具事件/退出验收；受控出站环境暂缓采用。 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。 |
| [dsh-plugin-gate](#plugin-1336663986-root) | 向 DSH Agent 提供插件源码静态扫描、风险差分/报告及破坏性操作建议工具，以 systemPrompt 提醒调用。 | 只在明确源码版本上扫描，逐项审阅 hits、notes 和 filesScanned；对高权限插件增加人工/沙箱审查。 |
| [dsh-plugin-ide-hub](#plugin-1397817235-root) | 汇总多IDE本地会话、用量和规则，生成规则指针、配额计划与Obsidian快照。 | 先验证包在隔离profile可加载，再用项目副本dry-run检查扫描范围和指针；计量对齐真实账单后才依赖预算建议。 |
| [dsh-plugin-preflight](#plugin-1378350155-root) | 以 CLI 和模型工具预检 DSH 插件清单、patch、客户端包和预发布 peer 范围。 | 先对已知正确和已知错误的插件各检查一次，核对规则是否符合当前宿主。 |
| [dsh-plugin-task-forge](#plugin-1399011094-root) | 将需求写成版本任务书，导出跨窗口交接包，记录回读、缺口答案和任务台账。 | 先观察ACK条件和全局注入问题；可人工借鉴任务书格式，但不要将自动ready视为语义验收或允许开工的独立证明。 |
| [dsh-plugin-veriscope](#plugin-1422943787-root) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。 |
| [dsh-pr-description](#plugin-1344714177-root) | 读取分支差异生成 PR 标题和五段描述，可选确认、保存与调用 gh 创建 PR。 | 先显式给 base 和安全输出路径，生成本地草稿并核对动机、测试、breaking；只有明确要发 PR 时才启用 openPr。 |
| [dsh-progress-viz (plugin)](#plugin-1334481905-plugin) | 把 DSH 语义会话事件即时投影成进度 JSON，供独立 Python 看板读取。 | 先把 JSON 当辅助状态并对照会话真相，修复/规避空闲恢复和估价问题后再作为运行监控依据。 |
| [dsh-project-memory](#plugin-1339316901-root) | 关联跨会话任务、项目文件和经验记忆，提供分层召回与自动上下文提示。 | 单项目保留笔记基线，先按需再自动；先解释持久状态后扩大范围。 |
| [dsh-qa-suite-n23](#plugin-1353726715-root) | 提供编辑后 TypeScript 诊断工具和本地多镜头代码审查命令。 | 先独立使用并复核 code_check 的项目根和时间，重要审查问题需要源码复现；跨项目或自动放行场景暂观察。 |
| [dsh-reaper](#plugin-1423215373-root) | 扫描监听端点并给进程归属分级，预览后代终止计划，经confirm后结束进程并检查端口。 | 先观察，以只读诊断为限；身份/后代保护/取消与精确端点协议补齐后再评估受控试用。 |
| [dsh-redteam-model](#plugin-1336856993-root) | 管理 DSH 安全研究预设与运行时插件，提供工作流、阶段检查和过程记录入口。 | [Q04](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q04) 当前观察，先限定具体管理或结构检查目标，确认授权、隔离profile、备份和实际变更；不把完整安全套件默认引入重要环境。 |
| [dsh-repeat-stop](#plugin-1339262076-root) | 在 DSH 中按 Agent 拦截超过阈值的连续同工具同参数调用，支持过滤与用户消息重置。 | 建议观察。 |
| [dsh-restart-dock](#plugin-1424433303-root) | 在 DSH Web 界面提供可拖动的刷新/Windows 宿主重启坞，并用独立 helper 留下重启报告。 | 只建议 Windows DSH 插件开发者观察使用，先在无重要任务环境完成 dry-run、一次真实停拉和手工救援演练。 |
| [dsh-restart-planner](#plugin-1422176522-root) | 让代理排程宿主自重启，等待会话落盘后由外部 helper 停拉进程并向原会话投递继续提示。 | 仅建议具备救援入口的插件开发环境观察；先 dryRun，随后在空闲会话做一次 confirm=true、resume=false 的真实重启，再单独验证恢复投递。 |
| [dsh-routing-suite](#plugin-1334586481-root) | 组合运行时注入器、思维模式路由预设与分级任务协议。 | 当前建议观察套装整体；先核对目标宿主版本与组件独立装配结果，再决定是否在隔离profile做开发实验。 |
| [dsh-session-diff](#plugin-1372976273-root) | 在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。 | 适合用Git兜底的开发者在独立web profile试用，先核对已知改动与显示路径；出现未提示错归因或接管异常就停用，不能当完整审计。 |
| [dsh-sidebar-git-graph](#plugin-1393980674-root) | 在DSH右侧栏查看当前会话仓库的提交关系、工作树改动和文件差异。 | 本地单用户开发者可先用小仓库试用并与CLI核对；先审查webServer访问控制，出现静默换库、未说明截断或无法解释的差异即回到CLI。 |
| [dsh-skill-creator](#plugin-1344713683-root) | DSH 内四个模型工具，用确定性规则草拟、校验、打包和改写技能描述，可挂载输出目录。 | 隔离 outputDir，先 dry-run 再人工核对 SKILL.md；文本技能再打包并解包核查文件，二进制资源不用当前打包路径。 |
| [dsh-slipway](#plugin-1422359117-root) | 预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉逐文件校验发布字节。 | 有固定 GitHub 发布流程的插件维护者可先在测试组织以 dry-run 和只读 verify 试用；真实 publish 必须由人核对 owner/repo、文件清单、secret 扫描与市场描述后单独授权。 |
| [dsh-snapshot-manager](#plugin-1412896722-root) | 每轮前增量快照工作区，并用预览令牌、事务日志和会话 fork 组合文件/对话回滚。 | 重要仓库不应仅依赖本插件；已有 Git/备份并能理解排除边界的开发者可先观察。 |
| [dsh-spring-admin-kit](#plugin-1412897663-root) | 注册Excel批量导入导出及Thymeleaf/LayUI模板规范两个DSH技能。 | 先观察并修示例，隔离库验事务/重复键/权限和模板渲染后再有限复用；不直接生产套用。 |
| [dsh-ssh-logs](#plugin-1346017360-root) | 通过DSH内置MCP桥提供服务器列表、限量日志读取和固定字符串搜索，使用预设SSH主机与日志根别名返回来源片段。 | 有条件试用。 |
| [dsh-subagent](#plugin-1425006726-root) | 把外部CLI注册为DSH子代理提供方，提供动态委派工具、进度、调度和崩溃后跟踪。 | 观察；先在隔离仓库用最小权限和总预算验收每个后端的取消、重启与结果消费。 |
| [dsh-subagent-role-router](#plugin-1421306160-root) | 为 DSH 子代理按角色分配候补模型，支持请求失败切换、fork 历史窗口和运行中换模。 | 先观察。 |
| [dsh-super-code](#plugin-1367482095-root) | 提供编码 Agent 预设、需求绑定任务台账、分层记忆与本机 MCP 委派连接。 | 熟悉DSH且已有代码验收流程的开发者可在独立分支试用。 |
| [dsh-task-monitor](#plugin-1406156934-dsh-task-monitor) | 在侧边浮层汇总任务环境、Git、技能、MCP 与发布动作。 | 保持观察；不要在含生产 remote 的工作区启用写动作，先用一次性仓库核提交、推送、切支和发布失败恢复。 |
| [dsh-taskswarm](#plugin-1333800488-root) | 为DSH按任务包依赖分波并行调度worker，以Git worktree、检查点、状态/邮箱和review/merge流程集成代码产出。 | 先观察，不将默认自主流程视可靠接受门；可丢弃仓库研究需独立强制CI/人工SHA验收及权限/预算/网络控制。 |
| [dsh-tianshu-tui](#plugin-1332692519-root) | 在官方 DSH 上装配终端 runner、ANSI 交互与预设/LSP接缝，并带本地审批和启动更新。 | 有限试一次性profile/可丢弃目录，先普通模式与固定版本，独立核自动更新、LSP和伴生能力。 |
| [dsh-token-billing](#plugin-1335139860-root) | 在DSH会话中显示实时token费用，结合路由价目与政策时间线，保存跨会话账本并提供统计、余额及CSV/JSON导出。 | 先观察。 |
| [dsh-trellis](#plugin-1335559646-root) | 为DSH提供功能、缺陷和重构三轨任务产物、步骤状态、会话恢复提示及Web看板。 | 可试用为人工复核开发任务辅助，先备份同名Skill并核自动覆盖；独立保存批准/验证与固定代码版本，不以标签或只读过滤代授权。 |
| [dsh-TUI](#plugin-1333111893-root) | 为DSH提供交互终端界面，显示流式回答、工具、审批与会话状态。 | 偏好终端或SSH的DSH开发者可先在测试profile试用长会话界面。 |
| [dsh-undo-plugin](#plugin-1338526178-packages-bundle-rollback) | 为DSH组合会话回退、私有Git文件快照、归档管理和回退界面。 | 观察，备份且独占的本地Git文件任务可继续探讨，勿将聊天消失当所有副作用撤销。 |
| [dsh-update-checker](#plugin-1334836615-root) | 在DSH GUI检查主程序和第三方插件版本，提供备份更新回退与Web重启流程，Desktop主程序转原生更新。 | 当前不推荐日常安装，先修拒绝零副作用与阶段回执，再核隔离恢复；不在用户部署运行复现。 |
| [dsh-vercel](#plugin-1425044910-root) | 通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。 | 可信单profile从只读工具试用，写操作核官方结果。 |
| [dsh-verification-receipt](#plugin-1333370288-root) | 被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。 | 有条件试用，精确支持宿主+私有一进程一文件，将其当启发式观察摘要，不作验证通过/防篡改审计。 |
| [dsh-which](#plugin-1423215529-root) | 为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。 | 建议在可信工具链环境限定试用只读报告，关闭默认probe，关键决策用真实shell交叉核对；一旦builtin、别名或cwd不一致，停止据此修改环境。 |
| [dsh-workflow-templates](#plugin-1344715132-root) | 12 个预置 JS workflow 编排脚本目录，提供列出、搜索、渲染调用起点和静态校验四工具。 | 先 list/search，审模板代码及来源；补真实 args 和数据接入，只有明确需要多 Agent 时调用官方 workflow；详见[Q03](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md#research-q03)。 |
| [dsh-worktable](#plugin-1336092482-root) | 为 DSH 提供项目分屏工作台与控制室，集中查看会话、文件、终端和窗口。 | [Q04](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md#research-q04) 当前观察，先核清精确宿主的HTTP/Upgrade权限与布局媒体备份；不要把项目目录设定当授权。 |
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
| [dsh-wsl-workspace](#plugin-1334205011-root) | 在DSH界面添加WSL工作区，并接入Linux命令、文件、搜索和终端工具。 | 建议在临时发行版与非生产工程先试用，验收shell/fs身份、写入与恢复，不将作者兼容列表等同本轮通过。 |
| [dsh-wsl-workspace](#plugin-1351853812-root) | 列出 WSL 发行版并检查 Linux 工作区路径，提示避开 /mnt 性能与语义陷阱。 | 建议试用。 |
| [easyeda-agent](#plugin-1280115203-root) | 通过 CLI、MCP 和 Skill 连接 EasyEDA Pro，读取工程并执行原理图及 PCB 操作。 | [Q04](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q04) 在备份工程副本中先确认health、window/project/doc和只读动作，再试小范围操作并回读。 |
| [Embedded Workbench](#plugin-1276714299-root) | 分发嵌入式 C/C++ 开发与逐声称核查 Skills，并在 DSH 首步注入可关闭的计划核查提醒。 | 先手动选匹配Skill，在可回滚固件分支核实际编译/测试，再决定提醒开关；只有核查格式而无证据时停用结论，见 [Q03](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q03)。 |
| [HarmonyOS NEXT Skills](#plugin-1179983747-root) | 通过 DSH 单技能 provider 提供离线 HarmonyOS 资料导航及 DevEco/HDC 证据脚本。 | 可先试固定版本普通参考，自动化仅在无外部副作用测试页确认before/after；版本不明、敏感采集不可控或动作状态未知时停止，回官方资料/IDE与手工读回。 |
| [harness-github](#plugin-1343702731-root) | 为DSH提供GitHub仓库、PR、issue、CI与评审工具，通过gh或REST读取和操作，并提供工作流指引。 | 先观察，暂不依赖当前审批边界做日常写操作。 |
| [HelloAGENTS](#plugin-1064776002-root) | 为AI编码CLI提供任务路由、质量Skill、项目知识、会话恢复和交付检查脚本。 | 有跨轮编码任务且愿维护计划的用户可在单宿主副本试用，先备份配置并核对真实验证日志；与项目规则冲突或只增加填表负担时退回原有AGENTS和CI。 |
| [Helm D](#plugin-1334304098-packages-helmd) | 在 DSH 中组织安全分析案例、工具输出证据、引用结论与资料路由，并组合多层提示策略。 | 观察为主，先审提示/脚本及health默认写策略，确认独立原patch备份与重启退路，再决定离线验证证据层；不接重要交付，见 [Q04](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q04)。 |
| [helm-d](#plugin-1334304098-root) | 为 DSH 提供领域参考、分析工具和带编号证据的安全分析案卷 | 采用单位是一份可由他人复核的授权样本案卷，不是一次工具输出或一条 finding。 |
| [Hindsight 编码 Agent 记忆集成](#plugin-1086419061-hindsight-integrations-coding-agents) | 为编码 Agent 提供 Hindsight 长期记忆、自动摄取和按需知识工具 | 在独立非敏感bank试用，先验收启动目录工具可见、fork切片和停止后服务端确认；出现串扰、无法确认保存或错误决策即停用并回到人工摘要。 |
| [iPolloWork](#plugin-1044010907-root) | 独立桌面工作台，连接多种Agent运行时、项目任务与可编辑创作产物。 | 需要多Agent项目与可编辑创作工作台的用户可关注iPolloWork。 |
| [J-Space Cognition Suite](#plugin-1308234922-root) | 用可选Skill模块与Python控制器维护长任务状态、源码映射和证据检查。 | [Q04](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q04) 先在单个非关键长任务验证证据变化会被拒绝，再看维护负担是否换来少返工；短直接任务用轻量级别，不强行跑完整控制循环。 |
| [Ledger Memory](#plugin-1412857520-root) | 为 DSH 项目保存活跃台账、经验卡与交接资料，自动注入记忆并提供压缩胶囊和会话文本指针回读。 | 可备份V3非关键项目先核拒写/授权/stage和压缩回读，定期人工比对真实工作区；缺口出现暂停自动依赖，见 [Q04](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q04)。 |
| [LogicProbe](#plugin-1331586818-root) | 为 DSH 开发者提供状态机、数据模型、结构图与并发声称检查工具和 Skill，返回模型判决、反例、回归及覆盖边界。 | 能核对源码模型的小型协议/状态机可有限试用；先保full/预算/版本，模型不可核、持续未决或仅单一pass验收时停自动链，回普通测试/专用检查。 |
| [LoopX for DSH](#plugin-1255217938-packages-dsh-loopx-plugin) | 在DSH接入LoopX技能、同会话续轮Driver和GoalBar，展示权威目标状态并控制后续推进。 | 建议已使用LoopX的DSH开发者在可回滚工作区试用一个短目标，先核对唯一绑定、quota与回执，再允许续轮。 |
| [Matt Skills Deck](#plugin-1336488925-root) | 在 DSH 中分发工程 Skills，并提供任务板、后端票据读写、关系核对和开发流程入口。 | 先只读观察任务与环境，待测试仓库验证目标、权限、超时、部分写入及回读后再考虑写流程。 |
| [MC Mods Dev Bridge](#plugin-1426070939-root) | 驱动真实 Minecraft 服务端与客户端运行场景 JSON，采集探针证据并覆盖 Fabric、Forge、NeoForge。 | 适合维护 MC 26.3 多 loader 模组、已有合法实例且能承担真实进程成本的团队观察；先只做 preflight 和一个 smoke 场景，验收 teardown、证据目录、/mods 双侧一致与端口恢复。 |
| [Minke](#plugin-1334714311-root) | 基于 DeepSeek Harness 的本地桌面工作区，整合会话、文件、终端与共享浏览器。 | 首次成本比小插件更大：下载匹配OS架构的完整客户端，迁移或配置模型凭据、工作区和插件，确认其内嵌DSH版本；源码开发还需pnpm、Electron及多workspace产品包构建。 |
| [MisakaNet](#plugin-1224734286-root) | 通过 Git 管理的故障教训与 MCP 检索，为 Agent 提供失败修复线索和反馈流程 | [Q04](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q04) 仅脱敏公开故障搜索回读试用，不自动运行社区修复。 |
| [model-usage-plugin](#plugin-1334569518-root) | 在DSH Web设置中展示模型token、估算费用、工具指标、使用趋势与DeepSeek账户余额，并从会话日志补充历史日账。 | 先观察。 |
| [Oh-DSH](#plugin-1330531961-root) | 围绕同一 DSH runtime 提供 Desktop、Web、TUI 发行表面及带预览/恢复的插件市场。 | 保持观察；熟悉DSH且有跨端需要者可主动用独立根做临时工程验证。 |
| [oh-my-dsh](#plugin-1379204512-root) | 为DSH提供角色技能、任务编排协议、团队状态与代码智能工具。 | 本次建议观察，尚不建议把团队编排交给该账本。 |
| [OMA for DeepSeek Harness](#plugin-1145914675-integrations-dsh) | 将OMA项目Skill与验证钩子接入DSH，支持自动项目准备、工具前后检查及有限停止跟进。 | [Q04](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q04)建议规则维护者在项目副本固定版本，先用允许与拒绝两个工具检查，必要时先关autoSetup手工审查模板。 |
| [OpenBitFun Agent 工作区](#plugin-1147866277-root) | 提供多模式Agent工作区、跨设备远程控制和可定制Mini App能力。 | [Q04](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q04) 当前观察；两设备独立测试区先确认观察关闭不取消、显式停止有效、主机重启与未知结果可识别；不直接迁移唯一旧数据。 |
| [OrcaReplay](#plugin-1350419329-root) | 外置 CLI 调试工具，记录 Agent 请求、工具和文件变化，支持模型响应回放、检查点分叉与模型比较。 | 先用可丢弃、无真实秘密的项目做严格回放，只把匹配视为协议重现；分叉需另看真实任务质量与费用。 |
| [orchd项目任务面板](#plugin-1422240642-root) | 在DSH右侧栏只读查看当前项目的orchd任务、依赖图、想法和审查时间线。 | 观察；先验收来源/会话权限和引擎零写，受信本地项目再决定试用。 |
| [Ouroboros 规格先行引擎](#plugin-1133901637-root) | 通过访谈、固定Seed、执行与多阶段评估组织AI软件开发任务，提供CLI和MCP接口。 | 适合愿意写明确验收且已有模型runtime的开发者，在可丢弃项目先只完成访谈→Seed→一个可自动检查的小改动，独立核对产物与检查覆盖。 |
| [phi](#plugin-1321152436-root) | 提供多模型、技能、子 Agent、权限控制与渐进 MCP 工具访问的终端编码客户端。 | [Q04](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q04) 只读任务中对照试用，核对全部工具调用、任务正确性及额外发现费用；失配则回原客户端。 |
| [Plan Lattice](#plugin-1334504487-root) | 在 DSH 历史替换后恢复原生任务依据，并可显式启用完整执行门禁。 | 先用作者公开稳定包/候选在相同 DSH 版本隔离试点，重点比较替换后权威保真和门禁对合法写入的影响；无需把 rc.8 或机制比例当生产收益，详见[Q03](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q03)。 |
| [REA](#plugin-1209966933-root) | 独立CLI和MCP服务器，为应用、二进制及运行行为逆向分析返回证据和限制。 | 有逆向经验者可在已知源码、非敏感的许可内JS/Electron样本做静态试用，先满足Node引擎并验证证据定位，不外推其他provider。 |
| [Reasonix](#plugin-1216785679-root) | 独立开源编码Agent，提供终端、Studio、Web及ACP入口，可由DSH委派任务。 | 先以可丢弃项目和默认reject做只读研究/评审试用，核对真实tool委派、同版provider和模型home；不把正常结束或rewind当完整验收。 |
| [Ruflo](#plugin-995029641-root) | 面向Claude Code、Codex等客户端的Agent元宿主，提供任务、路由、状态与协调工具。 | 有明确多Agent需求者可在隔离项目以最小MCP工具试用，先对照单Agent预算验收产物；不把mission/state/API成功当完成。 |
| [SkillHub for DSH](#plugin-1178833585-plugins-dsh) | 在DSH搜索和查看SkillHub技能，管理用户或项目级安装、升级、卸载及当前可用性。 | 可供技能维护频繁且能核对宿主依赖的用户在独立账户或容器里试用公开测试技能的固定版本安装。 |
| [VibeSkills](#plugin-1164005541-root) | 通过本地Skill发现、任务分解、阶段控制和验收组织复杂工作流。 | 拥有大量本地Skill并组织多交付物任务的用户可关注VibeSkills。 |
| [WeSight](#plugin-1232030145-root) | 为多种本地编码Agent提供桌面聊天、文件变化、配置与运行指标工作区。 | 已有多CLI需求的开发者可先用一个已有引擎在副本仓库试用，核对权限、文件与中断状态；若配置资源负担高于切换便利，或要求各引擎同等审批而未证实，就退回原CLI与编辑器。 |
| [Witness（dsh-verify）](#plugin-1335843750-root) | 用可复跑 JSON 浏览器断言检查网页行为，并输出逐步报告与截图 | 已有明确标准的开发者先在localhost用正确/故意错误断言试用，回读实际URL和报告；未审spec或基线不能放行，Host阻塞或目标不符退回CLI/手写Playwright。 |
| [working-activity](#plugin-1309769324-root) | 为 pi 与 DSH 提供实时工具活动、模型自述、耗时和收尾统计的工作状态行。 | [Q04](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q04) 先仅事件模式，以工具日志为事实核对；若增加干扰或误导，回宿主原状态。 |
| [无限五代 IG5](#plugin-1335211378-root) | 在DSH中整合二进制静态分析、原生调试、网络采集与证据工作台。 | 熟悉逆向工具的DSH用户可先在克隆profile与可丢弃授权样本上试静态分析链。 |

<a id="plugin-1377185339-root"></a>

## [@240xu/dsh-session-lazy-view](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md)

[![npm 30d 1,359](https://img.shields.io/static/v1?label=npm+30d&message=1%2C359&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-session-lazy-view) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-session-lazy-view)

> **用途**：面向排查超大会话最后发生了什么的Harness维护者。合格输出是可追溯到会话和seq的最近事件，而非替代完整轨迹或修改会话；原办法为完整解压后检索。多帧格式使读取尾窗口具有针对性增量，旧单帧没有同等收益。

> **亮点**：多帧尾部读取把“找最近事件”从完整解压拆成有界窗口查看，并把seq、turn和遮蔽投影组合为只读诊断入口；收益依赖多帧文件与局部问题，不代表全文检索有界。参见[Q01](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md#research-q01)、[Q02](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md#research-q02)。

> **思考**：“惰性”仅对tail和fast统计成立，搜索/全统计先分配文件大小buffer；搜索匹配文本化后最多2000字且有500帧上限。路径防护是词法normalize前缀，未解析realpath，因此不能把根目录边界称为抗符号链接隔离。参见[Q03](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md#research-q03)。

> **建议**：可把搜索改为带文件身份与大小边界的逐帧流式游标，返回已扫字节/seq及截断原因，缓存只绑定不可变前缀。对照当前实现用追加、截断、超大帧和长文本测峰值内存与漏检；内存未降或漏检上升则否定，维护索引成本也须计入。假设未验证。参见[Q05](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1345209661-packages-dsh-tech-lead"></a>

## [@240xu/dsh-tech-lead](../../plugins/240xu--verdict-engine--packages-dsh-tech-lead/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/240xu/verdict-engine)

> **用途**：已有 DSH 工程代理希望对状态、证据、计划和评审材料做重复、可复核的规则检查。

> **亮点**：将工程治理规则变为可反复调用的只读函数，辅助发现已提供材料的不一致。详见[Q01](../../plugins/240xu--verdict-engine--packages-dsh-tech-lead/INSIGHT.md#research-q01)、[Q02](../../plugins/240xu--verdict-engine--packages-dsh-tech-lead/INSIGHT.md#research-q02)。

> **思考**：调用方控制事实与身份，空分类输入默认 T0；旧式裸结果超过 500 条静默截断。Gate 的 pass 不是实际授权或独立评审。详见[Q02](../../plugins/240xu--verdict-engine--packages-dsh-tech-lead/INSIGHT.md#research-q02)、[Q03](../../plugins/240xu--verdict-engine--packages-dsh-tech-lead/INSIGHT.md#research-q03)。

> **建议**：对缺失高风险输入 fail-closed、所有输出加完整性元数据，并接入锚点/身份对账后才能进一步承担强治理角色；现版未实现。详见[Q04](../../plugins/240xu--verdict-engine--packages-dsh-tech-lead/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/240xu--verdict-engine--packages-dsh-tech-lead/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336870027-root"></a>

## [@7dgroup/dsh-skill-7d-git-commit](../../plugins/7dgroup-ai--dsh-skill-7d-git-commit/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit)

> **用途**：采用 7DGroup commit 约定的团队希望代理在提交前稳定生成类型、范围、主题、正文等结构；基线是把规范复制进仓库 AGENTS 或人工审查。合格结果是消息符合仓库约定且不替用户执行未授权提交，本地项目规则能覆盖包内默认。 详见[Q01](../../plugins/7dgroup-ai--dsh-skill-7d-git-commit/INSIGHT.md#research-q01)。

> **亮点**：相对复制 Markdown，它提供可安装、可版本化且可被本地同名规则覆盖的规范载体；增量主要是分发和优先级接线，不是新的 Git 算法。其价值取决于团队确实使用 7DGroup 约定，通用 Conventional Commits 团队可能只需更小的本地说明。 详见[Q03](../../plugins/7dgroup-ai--dsh-skill-7d-git-commit/INSIGHT.md#research-q03)。

> **思考**：关键质疑是组织规范是否与目标仓库一致。Skill 内容可指导消息，但无法证明 diff 已审阅、测试已通过或提交得到授权；若被更高优先级同名 Skill 阴影，安装包存在却不生效。把格式合规误当提交质量会放大自动提交风险。 详见[Q04](../../plugins/7dgroup-ai--dsh-skill-7d-git-commit/INSIGHT.md#research-q04)。

> **建议**：未验证假设是将组织级提交 Skill 与服务端 hook 共享同一机器可读规则，可减少代理建议与 GitLab 拒绝规则漂移。最小验证在 50 个历史 diff 上比较人工消息、仅 Skill、Skill+同源 hook，统计一次通过率、语义误分类和人工修订分钟；hook 与 Skill 不一致仍频繁发生即否定。 详见[Q08](../../plugins/7dgroup-ai--dsh-skill-7d-git-commit/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/7dgroup-ai--dsh-skill-7d-git-commit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1366089972-workspace-plugins-dsh-zero-residence"></a>

## [@dsh-external/dsh-zero-residence](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：面向工具结果很长、历史不断重复送模型的DSH会话。插件用确定性指针清单替代LLM压缩摘要，提供recall、近似token账本与强制压缩探针，并附带后台PowerShell命令句柄。场景应限于有可靠持久日志、能按需读取旧工具内容的可信环境。

> **亮点**：把确定性callId指针接入BasicCompactionEngine，提供owner/probe和日志召回，减少摘要步骤模型调用。详见[Q02](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md#research-q02)。

> **思考**：recall对call/result首个同ID即返回、叙述无seq恢复且有限量截断，不能普遍无损；强制arm全局。fast直接pwsh无宿主策略/取消/配额，缺error监听，内存jobs不支持重载旧handle恢复。详见[Q03](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md#research-q03)、[Q04](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md#research-q04)。

> **建议**：可探索完整对象hash验收后再驱逐、session/type绑定指针与agent绑定arm，后台任务走宿主托管并持久化取消/恢复收据；未实现。详见[Q06](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-cpp"></a>

## [@dsh-lsp-packs/dsh-lsp-cpp](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：C/C++ 仓库中的代理需要跨文件定义、引用、实现和 hover；基线是 grep/rg、编译器诊断或手工启动 clangd。合格结果是.c/.h/.cpp/.hpp/.cc映射正确、首次查询惰性启动每工作区进程、缺 server 返回结构化错误，跨文件精度可由 compile_commands.json 复现。 详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md#research-q01)。

> **亮点**：相对手工配置，它把 clangd 默认值、扩展映射、依赖约束和缺 server 降级封装为可安装 pack；十二语言包复用同一基座，增量是 C/C++ 配置而非实现 LSP。没有 compile database 时只能做有限单文件导航，价值取决于项目构建信息。 详见[Q03](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md#research-q03)。

> **思考**：核心质疑是“即插即用”是否会被误解为无需工具链/编译数据库。插件不下载 clangd，复杂宏、生成头、交叉编译和多配置项目若缺 compile_commands.json 会给错误或不完整结果；长期 clangd 进程占资源，server版本与参数兼容未固定。 详见[Q04](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md#research-q04)。

> **建议**：未验证假设是由 pack 自动检测 compile_commands 缺失/过期并向模型标记“导航置信度”，可减少错误跳转被当事实。最小实验在20个含宏/生成头/多配置的C++查询上比较有无提示组的正确定位率、无结果率和错误引用率；提示不能降低错误采纳即否定。 详见[Q08](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1324229194-dsh-autocompact"></a>

## [@indexyz/dsh-autocompact](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 1,270](https://img.shields.io/static/v1?label=npm+30d&message=1%2C270&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)

> **用途**：熟悉原生摘要的长会话开发者，结果看约束保留与合格任务成本。见[Q01](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q01)。

> **亮点**：把精确route/Session控制与宿主范围压缩接线，保持真实窗口和结构配对前提。见[Q01](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q01)、[Q02](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q02)。

> **思考**：阈值是触发尝试非硬上限，pill不含Session覆盖，off/default仍需backend和容量，语义/总成本未验。见[Q03](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q03)。

> **建议**：把命令已有有效来源投影UI，并绑定阈值实验/质量/成本收据，能否减少误判和总恢复成本待验证。见[Q05](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1342524723-root"></a>

## [@y9931666/dsh-plugin-roundtable](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9931666/dsh-plugin-roundtable) [![npm 30d 1,570](https://img.shields.io/static/v1?label=npm+30d&message=1%2C570&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable) [![最新发布 2026-10-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable)

> **用途**：适合确有不同视角与人工裁决需要的方案评审，合格观点须有独立可核查依据。单模型/人工基线见 [Q01](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md#research-q01)。

> **亮点**：把原生子代理调用组织成有状态、可讨论和可导出的评审流程；不是独立知识或正确共识保证。见 [Q01](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md#research-q01)。

> **思考**：发言粗估熔断不等真实账单硬上限，结构化证据和人类支持也不等已复现缺陷；复审授权布尔值和进程内锁有明确边界。见 [Q03](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md#research-q03)。

> **建议**：未验证假设为按证据独立性与观点边际增益决定追加评审，以减少重复发言和预算浪费；同现金预算对照及否定条件见 [Q05](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336021761-root"></a>

## [7d-code-reviewer](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer)

> **用途**：团队希望用统一结构辅助审阅代码改动和整理可读报告。

> **亮点**：封装五步审查、严重度/四维评分和报告样式，使输出结构一致。详见[Q01](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md#research-q01)。

> **思考**：没有确定性报告渲染器，动态 HTML 转义/占位符完整性只是 Skill 文本要求；评分无校准。详见[Q02](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md#research-q02)。

> **建议**：加入安全模板渲染与残留占位检查，并用已标注缺陷集校准严重度/分数，可提高可复核性；待验证。详见[Q02](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md#research-q02)、[Q03](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1225840521-root"></a>

## [Aegis Method Pack](../../plugins/ganyuanran--aegis/INSIGHT.md)

[![GitHub ★ 1,386](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C386&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GanyuanRan/Aegis)

> **用途**：有既有工程规则的开发者可用方法包辅助非平凡变更的基线对齐和完成核验。

> **亮点**：把基线、风险路由与完成证据原则组织为按需Skill，并适配DSH生命周期，减少反复提醒属于有条件推断。见[Q01](../../plugins/ganyuanran--aegis/INSIGHT.md#research-q01)。

> **思考**：自动bootstrap在首个durable活动后才投递，依赖模型遵守；作者旧Codex基准不能当本版DSH的安全/完成保证。见[Q02](../../plugins/ganyuanran--aegis/INSIGHT.md#research-q02)。

> **建议**：未验证方向是比较auto、explicit与原AGENTS的最小指南路由，记录返工和总投入；自动模式仅增材料无改善则收窄。见[Q04](../../plugins/ganyuanran--aegis/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/ganyuanran--aegis/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1319174653-root"></a>

## [Agent Vision Toolkit](../../plugins/anionex--agent-vision-toolkit/INSIGHT.md)

[![GitHub ★ 1,250](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C250&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/agent-vision-toolkit)

> **用途**：文本模型编码Agent需读图或长截图时按需调用视觉CLI；已具备合格原生视觉可继续原流程。[Q01](../../plugins/anionex--agent-vision-toolkit/INSIGHT.md#research-q01)

> **亮点**：保留文本Agent工作流而把视觉推理按需外置，结合任务路由和精确像素工具；视觉模型能力不归本仓库原创。[Q01](../../plugins/anionex--agent-vision-toolkit/INSIGHT.md#research-q01) [Q02](../../plugins/anionex--agent-vision-toolkit/INSIGHT.md#research-q02)

> **思考**：描述转文本可能损失视觉信息，坐标网格非像素精确；图像API出站及切块/重试投入会抵消预期便利，不能仅凭演示认定更好。[Q03](../../plugins/anionex--agent-vision-toolkit/INSIGHT.md#research-q03)

> **建议**：未验证方向是逐项绑定原图摘要、区域和风险，只补读高风险边界，比较完整性与全部复核成本。[Q04](../../plugins/anionex--agent-vision-toolkit/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/anionex--agent-vision-toolkit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1404700411-root"></a>

## [agent-development-constraints](../../plugins/962599627--agent-development-constraints/INSIGHT.md)



> **用途**：面向反复用AI开发、已积累错误案例而想减少重犯的人。主体是项目内constraints规则库、按技术栈的坑位、DISTILL/PRUNE/MERGE文档流程、可选脱敏hook，以及DSH读取规则/观察上下文成本的工具面。规则要求触发、检查和证据，目标让复盘可复用而不是保存长日志。

> **亮点**：把规则/触发/检查/证据模板、症状索引与DSH一次入口提醒连接，减少复盘只留长日志的问题。详见[Q02](../../plugins/962599627--agent-development-constraints/INSIGHT.md#research-q02)。

> **思考**：非每步强制执行；当前DSH面跨home日志/写probe/cache与隐私承诺不符。status无独立守卫且全局last资料可能混会话；Linux基线缺失/标记替换及自改资产保留有边界。详见[Q03](../../plugins/962599627--agent-development-constraints/INSIGHT.md#research-q03)、[Q04](../../plugins/962599627--agent-development-constraints/INSIGHT.md#research-q04)。

> **建议**：可探索项目/版本/适用/检查证据收据、plugin来源/session授权缓存与路由、安装diff/备份及ID+hash基线，比较误触发与资产保留；未实现。详见[Q07](../../plugins/962599627--agent-development-constraints/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/962599627--agent-development-constraints/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1232322871-root"></a>

## [agent-qa](../../plugins/vostride--agent-qa/INSIGHT.md)

[![GitHub ★ 896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vostride/agent-qa)

> **用途**：面向需要对Web和移动用户旅程做补充回归并保留可检查失败证据的开发/QA团队。

> **亮点**：把自然语言旅程拆成带观察引用的条件，并由运行器计算是否全满足，较planner自报完成更可追查；不等于完整业务验收。[Q01](../../plugins/vostride--agent-qa/INSIGHT.md#research-q01) [Q02](../../plugins/vostride--agent-qa/INSIGHT.md#research-q02)

> **思考**：模型分解和屏幕观察仍可能漏业务语义，结构覆盖不能证明后端成功；README关闭记忆的基准也不能证明self-improvement收益。[Q01](../../plugins/vostride--agent-qa/INSIGHT.md#research-q01) [Q02](../../plugins/vostride--agent-qa/INSIGHT.md#research-q02)

> **建议**：为关键条件组合独立后端/文件oracle，对照植入故障下假通过与复核时间；尚未验证，优先限定少数高影响条件。[Q04](../../plugins/vostride--agent-qa/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/vostride--agent-qa/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1190390511-root"></a>

## [AgentRQ](../../plugins/agentrq--agentrq/INSIGHT.md)

[![GitHub ★ 1,169](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C169&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentrq/agentrq)

> **用途**：多Agent和人工负责人共享任务、阻塞与工具轨迹；Done需要产物验收。[Q01](../../plugins/agentrq--agentrq/INSIGHT.md#research-q01)

> **亮点**：把Agent任务回写、人工审批和机器状态纳入同一工作区，减少在看板与聊天间手工同步；不证明任务真正完成。[Q01](../../plugins/agentrq--agentrq/INSIGHT.md#research-q01)

> **思考**：完成事件随Agent状态done/completed触发，所读路径不核产物，不能把卡片和事件当发布放行；审批也不能当OS沙箱。[Q03](../../plugins/agentrq--agentrq/INSIGHT.md#research-q03)

> **建议**：未验证方向是在完成事件前绑定任务特定证据和摘要，比较错误下游触发、误阻及人工投入。[Q04](../../plugins/agentrq--agentrq/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/agentrq--agentrq/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1401618027-root"></a>

## [AI Look-Up](../../plugins/1344738825--ai-look-up/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1344738825/ai-look-up)

> **用途**：面向长时间运行编码代理的用户，在重复命令、无产出密集调用或目标漂移时获得可见的收束提醒。 [Q01](../../plugins/1344738825--ai-look-up/INSIGHT.md#research-q01)

> **亮点**：相对人工盯守日志，它把行为节奏检测、独立审查和提示注入放进宿主事件链，并保留静态降级；增量在持续监督接线和多种漂移信号组合。 [Q03](../../plugins/1344738825--ai-look-up/INSIGHT.md#research-q03)

> **思考**：触发阈值与“生产性工具”名单会把探索性工作误判为漂移，独立审查还增加调用成本；尚无对照数据证明提醒减少返工而不增加打断。 [Q04](../../plugins/1344738825--ai-look-up/INSIGHT.md#research-q04)

> **建议**：可把提醒升级为可归因实验，每次随机延迟一小部分提醒并比较后续有效编辑、任务完成与人工接管，从而学习不同任务的阈值。 [Q08](../../plugins/1344738825--ai-look-up/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/1344738825--ai-look-up/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1406611614-root"></a>

## [AI 残渣清运](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md)



> **用途**：面向代理频繁生成探测脚本、备份、日志和缓存的项目，在不直接删除文件的前提下恢复整洁并保留结项清单。 [Q01](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md#research-q01)

> **亮点**：相对 `find` 加删除脚本，它把自动清理改成可逆移动，并用 open/close 项目状态保护进行中的产出、在结项时分类归档和改写引用。 [Q03](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md#research-q03)

> **思考**：规则匹配仍可能把有价值但命名像临时文件的材料移走，后台 detached 进程也无法让当前回合确认最终结果；可恢复降低损失但没有消除误分类。 [Q04](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md#research-q04)

> **建议**：可加入“来源感知清理”，要求候选文件同时满足命名规则和本回合创建记录，再用清单预览训练项目级白名单，降低误收。 [Q08](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1302597978-deploy-plugins-dist-dsh"></a>

## [ANet DSH Bundle](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ANetResearch/ANet)

> **用途**：为已有跨节点委派需求的操作者，把同一 anet 路径/身份接入 DSH 的 MCP 和 Skill。见[Q01](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q01)。

> **亮点**：显式路径/identity与运行时指南减少MCP/CLI分叉，安装锁/日志改善并发诊断，不证明节点协议/付费安全。见[Q02](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q02)、[Q03](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q03)。

> **思考**：固定bundle不固定HTTPS动态installer/binary/guide，提示不等入站/支付控制，900秒等安装不取消后台。见[Q03](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q03)。

> **建议**：未验证方向为任务绑定binary/guide/identity/政策收据，已有resolve诊断之上新增版本失效和结果关联，用版本×政策对照否定。见[Q05](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1211139949-root"></a>

## [Archify](../../plugins/tt-a1i--archify/INSIGHT.md)

[![GitHub ★ 90,283](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=90%2C283&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify)

> **用途**：熟悉系统的开发者与知识工作者将复杂关系交给协作者理解。

> **亮点**：将结构化创作、交互 HTML 和绑定实际字节的阶段验收串联，使“文件曾通过”和“当前文件被检验”有可检查区别；图形语义仍需人工。[Q01](../../plugins/tt-a1i--archify/INSIGHT.md#research-q01) [Q02](../../plugins/tt-a1i--archify/INSIGHT.md#research-q02)

> **思考**：自动验收约束产物和展示机制，不能保证引用解释、关系方向或读者理解；节点引用并不独立约束每一条关系。感知视觉复核也不包含在普通通过中。[Q03](../../plugins/tt-a1i--archify/INSIGHT.md#research-q03)

> **建议**：未验证假设是增加逐关系事实性质与调用位置映射，和现有节点引用作错误注入对照，检验是否减少假边而不过度增加作者负担；无改善即停止。[Q05](../../plugins/tt-a1i--archify/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/tt-a1i--archify/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1211139949-integrations-deepseek-harness"></a>

## [Archify DSH 适配器](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md)

[![GitHub ★ 90,283](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=90%2C283&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify) [![npm 30d 36,510](https://img.shields.io/static/v1?label=npm+30d&message=36%2C510&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)

> **用途**：已经使用 DSH、希望按 profile 管理 Archify 架构图 Skill 的开发者。

> **亮点**：本包把固定 Skill 版本、profile bundle 和 npm 移除路径串为分发契约；实际入口是 patch 的 filesystem provider。默认根共存验收检查正文与路径，超过仅发现名称的检查，但不证明图本身正确。[Q01](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q01) [Q03](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q03)

> **思考**：源码修复不等于公开安装已修复：当前 patch 保留默认根，而 README 明示公开 1.0.0 仍不保留默认根；新 Desktop 尚缺原生验收。这使新用户无法靠文档安装命令取得本轮研究的修复。[Q02](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q02)

> **建议**：未验证假设是将适配器、内嵌 Skill、宿主与默认根正文身份组成发布收据，比仅检查名称更早发现分发回归。用默认 provider 开启／关闭、干净安装／同 profile 升级四格对照注入错根和旧正文，记录检出率、误报及排查分钟；不能提前发现问题或维护成本超过手工清单时停止扩展。[Q05](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1324949198-root"></a>

## [billion-context](../../plugins/ranxianglei--billion-context/INSIGHT.md)

[![GitHub ★ 2,923](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C923&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ranxianglei/billion-context) [![npm 30d 2,010,311](https://img.shields.io/static/v1?label=npm+30d&message=2%2C010%2C311&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)

> **用途**：它服务长时间编码会话，试图在有限模型窗口内持续携带决策、错误和代码引用。合格交付是长任务仍能正确利用关键历史，需要精确细节时找回原文，而非只是累计请求很多token或没有超过窗口。名称和README累计B级token不是单次上下文容量扩成十亿，也不是本研究对质量的实测。

> **亮点**：[Q01](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q01)、[Q02](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q02)识别的贡献是让模型按范围增量折叠、按需恢复，而非只在达到阈值时全量总结；DSH工具准备与session归属控制把代理状态接到宿主请求。[Q03](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q03)支持状态可恢复，不证明所有摘要保真；kernel与vendored机制来源保留，不宣称全新原创。

> **思考**：[Q03](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q03)指出summary长度/边界合格不等关键事实保留，可恢复也不等模型会知道何时恢复。若遗漏的否定或纠错不被意识到，窗口正常仍可任务失败；[Q04](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q04)还要求区分wire-mode、双压缩及原生compact恢复。不能以宣传token倍数覆盖这些条件。

> **建议**：[Q06](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q06)提出未验证的关键事实索引与决策前原文回查。用否定、跨代纠错和文件重命名长任务对照同总预算的宿主compact/原方案，统计合格率、恢复、额外token和人工时间；无净改善就停止，不计现有创新。

[查看完整分析](../../plugins/ranxianglei--billion-context/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1192608669-root"></a>

## [brooks-lint](../../plugins/hyhmrright--brooks-lint/INSIGHT.md)

[![GitHub ★ 1,546](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C546&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyhmrright/brooks-lint) [![npm 30d 582](https://img.shields.io/static/v1?label=npm+30d&message=582&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/brooks-lint) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/brooks-lint)

> **用途**：已有模型评审流程的开发者可用一致诊断结构检查非敏感小diff。

> **亮点**：把既有工程书目与风险分类组织成症状—出处—后果—修法的评审流程，便于人工核对，不是新静态分析器。见[Q01](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q01)。

> **思考**：冻结报告解析保真不等于发现正确；Health Score随范围和权重变化，不能当代码质量真值或DSH实测。见[Q03](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q03)。

> **建议**：未验证方向是每项发现显式记录反例与本例取舍，比较合理例外PR的误报和复核时间；只增篇幅无净收益则停止。见[Q04](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/hyhmrright--brooks-lint/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1349267272-root"></a>

## [CA 参考库](../../plugins/ansonfishing--dsh-ca-ref/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ansonfishing/dsh-ca-ref)

> **用途**：面向Clean Architecture/DDD审查者，检索参考断言、获取基线并记录目标项目证据。

> **亮点**：把参考检索、路径引用、基线和审查留账组织成可复用流程，减少散落材料查找的重复步骤。[Q03](../../plugins/ansonfishing--dsh-ca-ref/INSIGHT.md#research-q03) 不等于自动验证架构或提供普适标准答案。

> **思考**：索引读取当前工作树且重建把缺失与漂移仓都标ok，健康标记不代表内容完整；混合查询OR与AND过滤也可能越过语言边界。[Q04](../../plugins/ansonfishing--dsh-ca-ref/INSIGHT.md#research-q04)

> **建议**：未验证假设是为证据块绑定实际版本并记录适用条件、反例和复核质量，可避免把命中频率当规则正确性反馈。[Q07](../../plugins/ansonfishing--dsh-ca-ref/INSIGHT.md#research-q07)

[查看完整分析](../../plugins/ansonfishing--dsh-ca-ref/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1122873619-root"></a>

## [CC Safety Net](../../plugins/kenryu42--cc-safety-net/INSIGHT.md)

[![GitHub ★ 1,792](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C792&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenryu42/cc-safety-net) [![npm 30d 67,218](https://img.shields.io/static/v1?label=npm+30d&message=67%2C218&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net)

> **用途**：让Agent在本地仓库操作的开发者可增加执行前命令/秘密访问检查，保留原生权限控制。

> **亮点**：相对提示词约束，DSH工具guard形成执行前拒绝；多CLI复用裁决而分别提取输入，增量属于策略适配。见[Q01](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q01)。

> **思考**：未声明自定义命令工具可能先执行再收到未检查提示，且它不隔离进程或网络；不能当唯一安全边界。见[Q03](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q03)。

> **建议**：未验证方向是首次执行前给出工具覆盖矩阵，将本机/远端和cwd解释显式化；若误标或配置负担超过发现收益就不推广。见[Q05](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/kenryu42--cc-safety-net/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333200468-root"></a>

## [Chat Import](../../plugins/nwflower--dsh-chat-import/INSIGHT.md)

[![GitHub ★ 264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nwflower/dsh-chat-import) [![npm 30d 14,913](https://img.shields.io/static/v1?label=npm+30d&message=14%2C913&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-import) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-import)

> **用途**：迁入DSH的编码用户可从代表Codex/Claude历史保留结构上下文继续工作；必须另核cwd、环境和工具，不等于搬迁原运行状态，见 [Q01](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q01)。

> **亮点**：来源解析到宿主代次适配、缺结果显式结构闭合、降级计数公开和续聊后重导保护构成可核查工程增量；原Agent推理方法不归此插件，见 [Q01](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q01) 与 [Q02](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q02)。

> **思考**：工具结果空补、图片占位、子Agent跳过及部分落盘都限制“保留完整”主张；registry最后记账而非全局事务，异常须核实际对象，见 [Q02](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q02)。

> **建议**：用逐对象迁移验收单显式分清原样、修补、占位、跳过和未验，验证能否减少误判无损与续聊纠错；未实现且需求未知，见 [Q03](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/nwflower--dsh-chat-import/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1426954291-root"></a>

## [CI Diet](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0disoft/dsh-ci-diet) [![npm 30d 208](https://img.shields.io/static/v1?label=npm+30d&message=208&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ci-diet) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ci-diet)

> **用途**：工作流维护者审核一项资源优化，以质量不退化且实际资源改善为合格交付。

> **亮点**：把规则证据、覆盖、局部diff、人工批准和恢复材料串成可追溯流程，减少手工对照工作；不将缓存机制算原创。见 [Q01](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q01)、[Q02](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q02)。

> **思考**：规则命中、缓存或取消不保证净节省，可能转移到缓存开销、重跑或交付损失；预检不是强制优化门禁。见 [Q03](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q03)。

> **建议**：未验证的质量约束采纳门槛，以交错冷/热缓存和同任务对照检验净资源收益，若退化就回退。见 [Q05](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-988892963-root"></a>

## [CloudBase AI Toolkit](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md)

[![GitHub ★ 1,150](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C150&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit)

> **用途**：CloudBase应用开发者需要从代码继续管理后端；目标是正确环境中真实资源可验收。[Q01](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md#research-q01)

> **亮点**：把场景知识、MCP真实云操作及宿主接线组织为统一开发入口，减少只写代码后手工切控制台；云后端不属该集成原创。[Q01](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md#research-q01)

> **思考**：确认是兼容性软护栏，unsupported/skip可放行，快速无内容decline默认也可放行；凭证形态检查不认证真实授权，不能当生产删除边界。[Q03](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md#research-q03)

> **建议**：未验证方向是严格模式将环境/资源摘要与一次授权绑定，能力不足拒绝敏感动作，并衡量CI误阻及人工成本。[Q05](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-988892963-dsh-plugin"></a>

## [CloudBase DSH 插件](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md)

[![GitHub ★ 1,150](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C150&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit) [![npm 30d 2,254](https://img.shields.io/static/v1?label=npm+30d&message=2%2C254&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cloudbase/dsh-plugin) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cloudbase/dsh-plugin)

> **用途**：已有CloudBase环境的DSH开发者从代码继续管理后端与部署；合格结果在正确环境可验证。[Q01](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md#research-q01)

> **亮点**：减少会话与CloudBase控制台间切换，统一展示数据库和部署结果，云后端能力归上游；不是从一句话到可用应用的效果证明。[Q01](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md#research-q01)

> **思考**：插件固定SHA不固定cached/latest MCP；两条bridge环境语义不同，面板set_env与调用未作为所读路径中的原子事务，不应先用于生产写入。[Q03](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md#research-q03)

> **建议**：未验证方向是请求绑定session/env/MCP版本和资源，原子选择环境与调用，两会话交错测试错环境和取消副作用。[Q05](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1347752454-plugins-dsh-code-rag-index-panel"></a>

## [Code RAG 索引面板](../../plugins/ankali-aylina--code-rag--plugins-dsh-code-rag-index-panel/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ankali-Aylina/code-rag) [![npm 30d 711](https://img.shields.io/static/v1?label=npm+30d&message=711&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-code-rag-index-panel) [![最新发布 2026-08-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-code-rag-index-panel)

> **用途**：适合已运行code-rag的开发者在DSH会话中查看和维护当前根索引。

> **亮点**：把索引状态、进度、依赖诊断与手动动作放入编码现场，并分离选模式与资源触发。[Q03](../../plugins/ankali-aylina--code-rag--plugins-dsh-code-rag-index-panel/INSIGHT.md#research-q03) 贡献属于控制流程，不是新检索算法。

> **思考**：端口在线与诊断绿灯并不证明当前根和索引新鲜度；多实例选最新、集合404判不可达及setup执行脚本须明确。[Q04](../../plugins/ankali-aylina--code-rag--plugins-dsh-code-rag-index-panel/INSIGHT.md#research-q04)

> **建议**：未验证假设是以工作区和索引代次指纹标记过期检索，并允许明确选择刷新，可减少旧代码引用；需同时计等待和嵌入资源。[Q07](../../plugins/ankali-aylina--code-rag--plugins-dsh-code-rag-index-panel/INSIGHT.md#research-q07)

[查看完整分析](../../plugins/ankali-aylina--code-rag--plugins-dsh-code-rag-index-panel/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1311108439-root"></a>

## [Codex Taskboard 本地任务看板](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md)

[![GitHub ★ 3,401](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C401&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chuspeeism/dashi-taskboard)

> **用途**：有跨AI会话交接需求的开发者维护任务、需求、附件和当前责任，用户验收后才办结。

> **亮点**：[Q03](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q03) 把成熟的乐观并发和AI会话绑定、需求重读、待审/接受边界组织成任务交接协议，相对手工列表增加责任与状态追溯；不以任务记录宣称软件交付正确。

> **思考**：[Q03](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q03) 数据库保护写入版本，不能保护交付真实性；Skill约束依赖执行者遵守，done与评论不能替代代码和用户验收证据。

> **建议**：[Q05](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q05) 未验证假设是把需求版本、代码revision和验证结果绑定为接受包，用五个需求变动任务对照错配办结与人工成本；无改善或维护更重即停止。

[查看完整分析](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1245329241-root"></a>

## [Coding Tools MCP](../../plugins/xytom--coding-tools-mcp/INSIGHT.md)

[![GitHub ★ 1,214](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C214&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xyTom/coding-tools-mcp)

> **用途**：MCP聊天客户端缺少本地仓库能力时接入；已有原生等价工具的用户需比较重复负担。[Q01](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q01)

> **亮点**：把编码执行和可审修改统一为MCP运行时，并用权限模式、基线与恢复减少自建工具负担；不代表所有客户端或任意代码安全。[Q01](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q01) [Q02](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q02)

> **思考**：非Linux命令仍有用户完整权限，dangerous会关关键限制；多文件备份替换不等瞬时跨文件原子可见或崩溃恢复通过。[Q03](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q03)

> **建议**：未验证方向是跨请求可查询修改事务，响应丢失先核状态再重发，在固定强杀点比较重复、损失和恢复时间。[Q05](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/xytom--coding-tools-mcp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1295322882-root"></a>

## [DeepSec](../../plugins/unclecheng-li--deepsec/INSIGHT.md)

[![GitHub ★ 498](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=498&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Unclecheng-li/DeepSec)

> **用途**：面向开发者的代码安全工具平台；本轮核查Shield本地审计主线，输出待人工复核的候选问题。

> **亮点**：[Q02](../../plugins/unclecheng-li--deepsec/INSIGHT.md#research-q02) 把规则、Python AST、本地启发式和可选LLM组织成可输出统一finding的流程，实际贡献是分层审阅接线。

> **思考**：[Q03](../../plugins/unclecheng-li--deepsec/INSIGHT.md#research-q03) 文件读取失败被跳过而filesScanned仍计候选，零发现不代表完整扫描；默认排除和远端选项还会改变覆盖及数据流。

> **建议**：[Q04](../../plugins/unclecheng-li--deepsec/INSIGHT.md#research-q04) 推导候选/已分析/跳过/失败覆盖回执的未验证改进；以混合失败样本测覆盖判断和误放行，不能降低误判则推翻。

[查看完整分析](../../plugins/unclecheng-li--deepsec/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333486649-root"></a>

## [DeepSeek Harness Desktop（社区版）](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md)

[![GitHub ★ 869](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=869&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ningbainb/deepseek-harness-desktop)

> **用途**：希望用安装包进入DSH编程环境且理解本机执行权限的开发者，可在独立profile试用社区客户端。

> **亮点**：[Q01](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q01) 显示项目的贡献是独立桌面环境集成，模型和Agent能力仍归官方Runtime；[Q02](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q02)的消费确认背压相对截断输出保留了更合理的完整性目标，不代表全部接线已验证。

> **思考**：[Q02](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q02) 已贯通主preload到renderer的消费确认链，但空窗口可发送超大帧，yield后推进确认也不等于最终绘制或落盘；[Q03](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q03)说明宿主不是第三方代码沙箱，不能把安装便利等同安全保证。

> **建议**：[Q05](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q05) 推导等待确认的诊断快照，先排除现有上层已实现，再用慢消费者比较定位耗时与重启次数；不伪造确认，不能改善定位则否定。

[查看完整分析](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1230068255-root"></a>

## [DeepTide](../../plugins/paean-ai--deeptide/INSIGHT.md)

[![GitHub ★ 1,105](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C105&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/paean-ai/deeptide) [![npm 30d 100](https://img.shields.io/static/v1?label=npm+30d&message=100&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deeptide) [![最新发布 2026-05-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-05-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deeptide)

> **用途**：需要DeepSeek编码客户端或本地模型的开发者，先区分Zero别名/Rust/原生形态再选；合格结果是可审代码任务。[Q01](../../plugins/paean-ai--deeptide/INSIGHT.md#research-q01)

> **亮点**：根npm普通路径主要是Zero CLI命令入口包装；仓库另有Rust与本地bootstrap，不能把全部上游工具算根原创或同版能力。[Q01](../../plugins/paean-ai--deeptide/INSIGHT.md#research-q01)

> **思考**：不同形态的权限、资源和成功信号容易混读；本地自测失败exitCode2后仍写settings，npm安装成功也不证明Rust二进制已下载。[Q03](../../plugins/paean-ai--deeptide/INSIGHT.md#research-q03)

> **建议**：未验证方向是在临时profile自测后才提交现用配置，失败保留原状态，以故障注入比较配置变动和残留服务。[Q05](../../plugins/paean-ai--deeptide/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/paean-ai--deeptide/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1300173275-root"></a>

## [deja-vu](../../plugins/vshulcz--deja-vu/INSIGHT.md)

[![GitHub ★ 1,310](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C310&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu)

> **用途**：多Agent轮换的个人开发者找回旧错误、命令和决定；原生查询足够时不必另建索引。[Q01](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q01)

> **亮点**：把分散Agent历史接到统一召回与当前会话上下文，减少主动查找与工具切换；重复排障减少仍需任务对照，不能由R@5直接推出。[Q01](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q01)

> **思考**：同步CLI异常变空串后可能显示无匹配，且模板转义与模式去敏不保证历史无敏感或指令；跨项目和过期决定需用户复核。[Q03](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q03)

> **建议**：未验证设计是在召回结果保留引擎/索引/无匹配三态及当前文件变化，比较错误确信、误用旧决定和复核时间。[Q05](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/vshulcz--deja-vu/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1148960257-root"></a>

## [Desktop CC GUI](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md)

[![GitHub ★ 4,520](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C520&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhukunpenglinyutong/desktop-cc-gui)

> **用途**：适合同时使用多个编码CLI且希望统一项目、会话和工具输出的开发者。合格结果是DSH会话正确恢复、输出和工具状态不重复，并保留各引擎自身边界；原办法是多个终端或DSH Web。它是独立Tauri应用而不是可直接add的DSH插件，安装整个客户端的负担要与统一入口收益一起判断。仅使用DSH一个引擎时，原生Web通常已覆盖主要需求。

> **亮点**：[Q02](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q02)DSH适配通过持久host session流而非终端抓屏，能保留结构化工具输出和恢复语义；多引擎统一界面有条件增量，不是DSH原生插件。

> **思考**：[Q03](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q03)DSH审批请求自动allowed-once，plan并非只读沙箱；对需要人工放行的用户，统一界面不能抹平权限差异。

> **建议**：[Q05](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q05)提出引擎权限契约显式展示与人工卡片的未验证假设，比较用户误判和误批准。

[查看完整分析](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340492184-root"></a>

## [dock-base](../../plugins/aks1st--dock/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dock) [![npm 30d 1,532](https://img.shields.io/static/v1?label=npm+30d&message=1%2C532&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-base) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-base)

> **用途**：多个功能面板需共享布局与实例/设置接线的开发者及组合使用者。

> **亮点**：统一多插件重复的布局、实例、命令与设置接线，具体文件/Git业务由扩展实现；未证明优于所有工作台。详见[Q01](../../plugins/aks1st--dock/INSIGHT.md#research-q01)与[Q02](../../plugins/aks1st--dock/INSIGHT.md#research-q02)。

> **思考**：异步beforeClose允许结果未绑定内容版本且未见reject处理，无hook默认允许；seed/dirty持久不等业务缓冲恢复。详见[Q02](../../plugins/aks1st--dock/INSIGHT.md#research-q02)。

> **建议**：可探讨实例版本绑定关闭协议，旧确认不得作用于新内容并可见处理reject；增加状态与重入成本，未验证。详见[Q04](../../plugins/aks1st--dock/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/aks1st--dock/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340492335-root"></a>

## [dock-editor](../../plugins/aks1st--dock-editor/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dock-editor) [![npm 30d 886](https://img.shields.io/static/v1?label=npm+30d&message=886&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-editor) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-editor)

> **用途**：适合在 DSH Web 中偶尔修改会话工作区的小型代码、配置和文档；合格结果是完整读取、编辑并核对目标文件保存。工作区外文件只读。

> **亮点**：将文件域默认查看器、工作台视图、CodeMirror 状态和读写权限连接成小文本编辑流程；高亮和历史主要属于 CodeMirror，上游 dock 提供工作台，增量在集成及写入围栏。详见[Q02](../../plugins/aks1st--dock-editor/INSIGHT.md#research-q02)。

> **思考**：服务端 fs.write 直接 writeFile，不比较读取版本；外部或另一视图读后改写可能被覆盖。读取绝对路径也不限工作区，不能称作完整读隔离。风险由源码推断，未复现。详见[Q03](../../plugins/aks1st--dock-editor/INSIGHT.md#research-q03)。

> **建议**：可在读取时产生版本摘要、保存时条件比较并保留冲突双方内容；以交错保存样本比较静默覆盖、误报与恢复工时。这是未实现设计，现有关闭提醒不能替代。详见[Q06](../../plugins/aks1st--dock-editor/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/aks1st--dock-editor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340492447-root"></a>

## [dock-git](../../plugins/aks1st--dock-git/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dock-git) [![npm 30d 866](https://img.shields.io/static/v1?label=npm+30d&message=866&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-git) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-git)

> **用途**：在 DSH Web 处理代码的开发者可从工作台查看会话仓库并执行 Git 操作；适用前提是能核对目标仓库和写操作结果。详见[Q01](../../plugins/aks1st--dock-git/INSIGHT.md#research-q01)。

> **亮点**：相对终端 Git 或独立客户端，增量是把提交图、差异与仓库操作接入 DSH 会话工作台，沿用系统 Git。不能由作者最高级宣传推出同类最佳。详见[Q01](../../plugins/aks1st--dock-git/INSIGHT.md#research-q01)。

> **思考**：普通提交与合并会跳过部分仓库钩子，这与依赖钩子的团队流程不等价；直接允许浏览器运行钩子又引入代码执行风险。没有通用超时的远端操作也需核查。详见[Q03](../../plugins/aks1st--dock-git/INSIGHT.md#research-q03)。

> **建议**：未验证的方向是把目标仓库、受影响 ref、钩子策略和破坏范围列入操作前确认，让可信仓库与不可信仓库采用不同执行策略，再用隔离任务检验误接受与恢复成本。详见[Q06](../../plugins/aks1st--dock-git/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/aks1st--dock-git/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334325657-root"></a>

## [DS Harness Remote](../../plugins/liguobao--ds-harness-remote/INSIGHT.md)

[![GitHub ★ 869](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=869&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liguobao/ds-harness-remote)

> **用途**：需离开工作电脑继续自己会话的开发者，可以在可信设备和非关键Host上先验证只读访问。

> **亮点**：[Q01](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q01) 相对远程桌面或手工隧道，把原生会话和工作区访问与多端传输回退集中起来；[Q02](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q02)与[Q03](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q03)显示身份、连接和终端所有权有独立机制，不能把标准Noise算法算原创。

> **思考**：[Q03](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q03) 显示加密不减少受信任设备已有的系统命令权限，Linux安装器还以root运行；[Q04](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q04)说明重连不是写入恰好一次。安全采用必须核对Host账户、设备信任和未知操作结果。

> **建议**：[Q05](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q05) 提出按业务操作ID先查询再决定重试的未验证方案，先核对现有Host是否已有实现，再用断线点对照评估重复副作用；不能统一自动重放写调用。

[查看完整分析](../../plugins/liguobao--ds-harness-remote/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334766747-root"></a>

## [DSH Agent Team GUI](../../plugins/toolclub--dsh-agent-team-gui/INSIGHT.md)

[![GitHub ★ 283](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=283&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/toolclub/dsh-agent-team-gui)

> **用途**：固定兼容DSH Web环境的开发者可保存规划、实现和评审成员，用于反复需要分工的任务；最终合格交付仍须检查文件与测试，见 [Q01](../../plugins/toolclub--dsh-agent-team-gui/INSIGHT.md#research-q01)。

> **亮点**：可持久复用的团队定义、消息认领、有界依赖计划和逐尝试计量覆盖，把一次性分派组织为可检查运行。源码存在真正子Agent调用，超出纯静态流程图，但不证明更优交付，见 [Q01](../../plugins/toolclub--dsh-agent-team-gui/INSIGHT.md#research-q01)、[Q02](../../plugins/toolclub--dsh-agent-team-gui/INSIGHT.md#research-q02) 和 [Q04](../../plugins/toolclub--dsh-agent-team-gui/INSIGHT.md#research-q04)。

> **思考**：质量门只审阅有界成员交接文本且无工具，重启只是把活动记录结算为中断；这些机制不独立验收代码或回滚外部副作用。用户仍须核对真实文件、测试与重复写入，见 [Q03](../../plugins/toolclub--dsh-agent-team-gui/INSIGHT.md#research-q03)。

> **建议**：可探索带产物摘要与独立验证记录的交接，并给最终评审受限验证能力，补足纯文本approved与真实交付之间的空隙。这是未验证假设；同预算下若错误放行和人工返工不降、只增调用，即停止，见 [Q05](../../plugins/toolclub--dsh-agent-team-gui/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/toolclub--dsh-agent-team-gui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1332073142-root"></a>

## [DSH AgentTeams](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md)

[![GitHub ★ 2,455](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C455&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NanmiCoder/dsh-agent-teams) [![npm 30d 46,019](https://img.shields.io/static/v1?label=npm+30d&message=46%2C019&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams)

> **用途**：能拆分任务和验收的负责人在当前会话分派独立工作并汇总为同一目标交付。

> **亮点**：[Q02](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q02)、[Q03](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q03) 可靠性增量在持久任务图、attempt归属与区分idle/冷恢复的调度，而非角色数量；清空旧结果避免重试直接继承已失效证据。

> **思考**：[Q03](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q03) 旧attempt状态更新被撤销不代表外部文件副作用已撤销，质量gate是完成审计而非写入拦截；调度记录不能替代产物与验证的独立复核。

> **建议**：[Q05](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q05) 未验证假设是按attempt隔离工作区并只接纳当前快照，以中断重派对照过期产物污染与恢复成本；收益不足或迁移成本更高即停止。

[查看完整分析](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1413052822-root"></a>

## [DSH Armory](../../plugins/2026heshao--dsh-armory/INSIGHT.md)

[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2026heshao/dsh-armory) [![npm 30d 2,752](https://img.shields.io/static/v1?label=npm+30d&message=2%2C752&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory)

> **用途**：为维护多个 MCP、Skill、专家和社区插件的 DSH 用户，提供统一看板、市场安装、来源检查和工具使用账本。见[Q01](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q01)。

> **亮点**：统一生命周期、来源识别和有界使用观测，来源导入哈希及配置/live回滚有具体接线；净管理效果未测。见[Q01](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q01)、[Q04](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q04)。

> **思考**：Skill更新实际rm旧目录后rename，无自动保旧；摘要条件可跳无摘要/空响应，stat不是生效验收，零调用/字符粗估不是可信或节费放行。见[Q02](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q02)、[Q03](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q03)。

> **建议**：未验证方向是可恢复Skill更新/发现回读与明确提交，用故障矩阵对比旧版保留和恢复时间；备份已足够或维护更重则不扩复杂事务平台。见[Q05](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2026heshao--dsh-armory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1326893710-root"></a>

## [DSH Better Sidebar](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md)

[![GitHub ★ 4,528](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C528&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/DSH-better-sidebar) [![npm 30d 182,354](https://img.shields.io/static/v1?label=npm+30d&message=182%2C354&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar)

> **用途**：面向以DSH Web进行软件修改并频繁在聊天、编辑器、Git终端之间切换的开发者。合格结果是在正确会话目录核对改动、预览/编辑文件并明确提交动作，而非仅打开面板。原办法是IDE和终端；插件提供双工作台与会话作用域入口，但成熟IDE用户可能无须替换。README的终端能力明确由宿主提供，不能把插件界面当独立PTY实现。

> **亮点**：[Q03](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q03)识别出把会话目录、编辑和Git入口结合的工作流贡献，以及内外部页面共用的注册契约。相对IDE不是能力普遍领先，只有频繁在DSH会话中核对修改时同上下文整合才有增量。

> **思考**：[Q04](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q04)核实workspace围栏已移除，路由准入不能收窄已准入用户的文件权限。当前版本又要求明确宿主版本，不能将会话作用域或latest安装命令理解成隔离或兼容保证。

> **建议**：[Q08](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q08)提出未验证的路径能力边界，以真实目标与symlink一致校验减小误操作范围，需用合法跨目录任务和越界拒绝的取舍对照证伪。

[查看完整分析](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1352600211-root"></a>

## [DSH Better Sidebar N23](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md)

[![npm 30d 1,125](https://img.shields.io/static/v1?label=npm+30d&message=1%2C125&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23)

> **用途**：希望在对话旁完成文件检查、终端与Git操作的开发者；需接受插件以本机权限执行操作。

> **亮点**：现有工作台把文件、终端和Git交接集中到DSH旁；fork可识别增量是布局提交策略、外壳与模块兼容，整体设计归上游，不能全部计为原创。[Q01](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q01)

> **思考**：src/lib刻意分轨意味着“源码有修复”不能证明发布包具有同一修复；发布fs.write也没有版本比较或cwd写入边界。兼容与编辑可靠性应先于功能广度判断。[Q02](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q02) [Q03](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q03)

> **建议**：未验证假设为分离拖拽临时视觉状态与最终持久化提交，并用统一可重建源消除产物漂移；在相同大对话负载下检验帧耗时和构建一致性，收益消失或布局回归即否定。[Q04](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1311108439-integrations-deepseek-harness"></a>

## [DSH Codex Taskboard 侧栏集成](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md)

[![GitHub ★ 3,401](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C401&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chuspeeism/dashi-taskboard)

> **用途**：已运行Taskboard的DSH Web使用者在工作界面查看与管理原有任务。

> **亮点**：[Q01](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q01)、[Q02](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q02) 把启动器拥有的运行时描述符接到DSH入口，相对写死端口或手工打开URL减少地址维护；不包含独立看板引擎或自动启动能力。

> **思考**：[Q02](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q02) 统一503会把描述符格式、权限和服务未运行混为一类，动态发现不等于健康验证；读取者依赖启动器维护正确可信的URL。

> **建议**：[Q04](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q04) 未验证假设是在受限本地健康探测下区分描述符故障，以故障注入比较定位时间；无改善或出现额外误报即停止。

[查看完整分析](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1285824983-integrations-dsh"></a>

## [DSH Graphlint](../../plugins/angeloszou--graphlint--integrations-dsh/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngelosZou/graphlint) [![npm 30d 1,244](https://img.shields.io/static/v1?label=npm+30d&message=1%2C244&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-graphlint) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-graphlint)

> **用途**：适合AI生成代码后需要筛选死代码、未用导入和不可达组件的开发者。合格交付是经测试与人工核对的清理补丁，而不是告警清单本身。简单替代为终端graphlint query加人工复制结果；插件让Agent直接查图、重建索引和调整入口规则。不能根据告警自动删除框架回调或动态注册代码。

> **亮点**：把graphlint CLI查询、建索引和入口规则配置接到DSH模型工具，增量在结果契约与后台任务接线。[Q03](../../plugins/angeloszou--graphlint--integrations-dsh/INSIGHT.md#research-q03)

> **思考**：静态图告警依赖入口建模，且PATH优先CLI未绑定版本；可解析告警不足以支持自动删除。[Q04](../../plugins/angeloszou--graphlint--integrations-dsh/INSIGHT.md#research-q04)

> **建议**：未验证假设是每个删除候选附带“入口假设、CLI版本、关联测试及反例”证据卡，人工确认后再清理，可降低动态引用误删而保留检索便利。推导自入口建模限制和可调规则工具。最小验证用静态函数与动态回调混合仓库，对比单看告警、证据卡和普通终端三组，计量错误删除、合格补丁率与总时间；若误删不降或复核负担超过收益，则否定该方案。 [Q08](../../plugins/angeloszou--graphlint--integrations-dsh/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/angeloszou--graphlint--integrations-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1414577411-root"></a>

## [DSH Harness Switch](../../plugins/alycestocking--dsh-harness-switch/INSIGHT.md)

[![npm 30d 39](https://img.shields.io/static/v1?label=npm+30d&message=39&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-harness-switch) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-harness-switch)

> **用途**：希望保留DSH原生会话入口并使用Kimi执行核心、需要在模型间继续工作的开发者。

> **亮点**：相对提示词替换，已实现增量是完整执行核心与DSH原生入口的桥接，以及显式审批/会话映射；核心能力归固定上游Kimi，不计为插件原创。[Q01](../../plugins/alycestocking--dsh-harness-switch/INSIGHT.md#research-q01) [Q02](../../plugins/alycestocking--dsh-harness-switch/INSIGHT.md#research-q02)

> **思考**：“同一会话”不等于两边状态无损一致。pending避免未知结果重复执行，但用户承担多存储备份与人工恢复，外层token统计也不完整；这些限制直接约束持续采用。[Q03](../../plugins/alycestocking--dsh-harness-switch/INSIGHT.md#research-q03)

> **建议**：未验证假设是跨harness交接回执能显式暴露历史、图片、压缩、计费与未确认副作用范围，减少误继续；以故障注入后的遗漏识别与实际重复执行次数对照验证。[Q04](../../plugins/alycestocking--dsh-harness-switch/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/alycestocking--dsh-harness-switch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1429103083-root"></a>

## [DSH Integration Settings](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md)



> **用途**：为本地 profile 管理员在设置页导入 MCP、配置网关及模型/思考档位，替代部分手改 YAML。见[Q01](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q01)。

> **亮点**：将JSON正规化/差异预览与单文件保护接进设置页，真正收益取决目标profile加载、代表请求与恢复。见[Q01](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q01)、[Q02](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q02)。

> **思考**：广告不是逐档验证；非空少报可删模型、可选目标digest不绑原文件，MCP/网关/调度分步非共同事务。当前来源身份另有缺口。见[Q01](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q01)至[Q04](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q04)。

> **建议**：未验证方向为原文件绑定计划、延迟删除/确认与跨文件进度，故障矩阵比误删/丢修改/恢复和负担。见[Q05](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339882322-root"></a>

## [DSH iOS](../../plugins/zseven-w--dsh-ios/INSIGHT.md)

[![GitHub ★ 349](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=349&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-ios) [![npm 30d 1,695](https://img.shields.io/static/v1?label=npm+30d&message=1%2C695&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-ios) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-ios)

> **用途**：iOS开发者在Agent会话里构建/观察/操作自有测试App，用户可看和接管；非iPhone上的DSH客户端，见 [Q01](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q01)。

> **亮点**：设备开发/观看链与fresh树+可比较计数验证，入口有MAC期限与loopback来源围栏，见 [Q01](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q01) 与 [Q02](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q02)。

> **思考**：局部标签计数非业务成功，真机输入/构建有副作用且runner不因关面板停，未实测兼容/拒绝/恢复，见 [Q02](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q02) 与 [Q03](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q03)。

> **建议**：设备/目标/构建身份与业务断言绑定，显示不确定执行并测误报/恢复成本，未实现，见 [Q03](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/zseven-w--dsh-ios/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1353534254-root"></a>

## [DSH Model Router](../../plugins/alice-marx--dsh-model-router/INSIGHT.md)

[![GitHub ★ 383](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=383&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 4,234](https://img.shields.io/static/v1?label=npm+30d&message=4%2C234&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router)

> **用途**：适合已配置多家模型、需要把分析、执行和验收拆成依赖工作包的开发者。原办法是手工分配模型、搬运上游输出和记录账单；合格结果应包括每包输出、执行通道、已报用量及失败状态，而不只是一个低价推荐。README明确区分本地规划与付费执行，因此只有反复编排多路任务的人群才有足够采用动机，单一模型日常聊天通常不需要这层工作台。

> **亮点**：相对手动选择一个模型，实质增量是把依赖工作包、候选路由和预算准入组成可回查的执行契约；相对纯最低价格排序，它把质量下限和路由交接成本纳入选择。小空间精确与大空间有界搜索是组合优化的工程适配，并非全局质量最优或实测省钱。作者主动限定历史厂商运行属于0.20.0，当前0.25.5没有新端到端厂商验收，故贡献只落在可见控制机制。 依据[Q03](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q03)。

> **思考**：最关键的质疑是路由效用的质量与价格输入是否足够代表真实任务。分配器以数值qualityShortfall/score比较候选，有限预算排除未知价，却无法自行证明输入评分可靠；README明确公共LiveBench为聚合表，没有逐题质量成本矩阵。另一个影响持续采用的边界是中断后预留仍占额度，当前没有手工核销入口，不能为了恢复容量删除状态。它可防重复花费，但也把异常对账交给用户。 依据[Q04](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q04)。

> **建议**：未验证假设是把每类工作包的实际合格结果与资源回执绑定，按任务类别校准质量下限，能够减少聚合榜单与真实任务的错配。最小对照固定模型集合、输入与总预算，对比固定强模型、最低价路由和当前策略，记录全包合格率、实付额、重试及人工时间。若质量不降条件下实际支出没有改善，或校准样本的维护成本超过节约，应否定该方向而保留手工指定。 依据[Q08](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/alice-marx--dsh-model-router/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1409845351-plugins-dsh-orchestrator2"></a>

## [DSH Orchestrator2](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2)

> **用途**：面向需要把需求、设计、开发、审查和人工测试串成可追溯任务包的软件负责人。合格交付是有验收证据且人工测试通过的软件版本，不能把多Agent输出或状态文件完成当交付。相对普通Agent加任务清单，它要求采用v2.1六区结构、冻结设计、预算台账和角色分工；简单修改可能得不偿失。

> **亮点**：将任务包、预算预登记、设计冻结和持久角色路由组合为可追溯协作流程，先绑定再启动减少路由竞争窗口。[Q03](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md#research-q03)

> **思考**：派工成功回执要求后台参数false，但角色工具明确拒绝false；同时旧目录同步的实际副作用与移除声明冲突，需先核对。[Q04](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md#research-q04)

> **建议**：未验证假设是把派工协议写成单一可执行状态契约，生成工具参数、成功回执及persona对应段，并在启动前做无副作用协议检查，能减少“回执要求工具拒绝参数”的交接失败。推导来自false参数冲突和旧目录同步漂移。最小验证固定最小任务包，在新旧API宿主mock和真实沙箱分别走begin→角色→end、失败与重启；比较人工修正次数、重复派工及完成率，若漂移仍需手工多处修改则否定单源收益。 [Q08](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335843541-root"></a>

## [DSH Python Env](../../plugins/angeloszou--dsh-python-env/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngelosZou/dsh-python-env) [![npm 30d 1,121](https://img.shields.io/static/v1?label=npm+30d&message=1%2C121&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-python-env) [![最新发布 2026-09-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-python-env)

> **用途**：目标用户是在DSH沙箱shell里遇到venv、临时目录或网络安装失败的开发者。合格结果是项目解释器能导入所需固定版本包，并可删除环境，不影响全局Python。简单替代是开发者在外部终端创建venv或使用uv；这里的增量是让Agent调用受控工具完成环境准备，而不是新的Python包管理器。

> **亮点**：将host侧venv/pip接入会话写权限、镜像回退和job状态，减少环境准备的人工交接；核心包管理来自Python。[Q03](../../plugins/angeloszou--dsh-python-env/INSIGHT.md#research-q03)

> **思考**：词法路径检查不等于进程隔离，第三方构建仍拥有host权限，符号链接与pip选项需独立检验。[Q04](../../plugins/angeloszou--dsh-python-env/INSIGHT.md#research-q04)

> **建议**：未验证假设是把允许包规格、完整真实路径和审批后的索引记录成安装计划，执行前显示目标与副作用，配合隔离构建，可保留自动配置便利而缩小host写入范围。推导来自词法guard和host pip的边界差距。最小验证使用常规wheel、源码构建包、符号链接及异常pip选项，对比当前与受限计划路线的拒绝准确性、完成率与额外人工；若合法任务阻塞而越界仍可发生，则否定该方案。 [Q08](../../plugins/angeloszou--dsh-python-env/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/angeloszou--dsh-python-env/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334214605-root"></a>

## [DSH Reverse Skill](../../plugins/dhicoc--dsh-reverse-skill/INSIGHT.md)

[![GitHub ★ 306](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=306&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dhicoc/dsh-reverse-skill) [![npm 30d 2,563](https://img.shields.io/static/v1?label=npm+30d&message=2%2C563&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dhicoc/dsh-reverse-skill) [![最新发布 2026-08-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dhicoc/dsh-reverse-skill)

> **用途**：有授权范围及已有领域工具的安全研究者，需要在DSH发现根路由和嵌套技能；不是自动完成研究的Agent。见[Q01](../../plugins/dhicoc--dsh-reverse-skill/INSIGHT.md#research-q01)。

> **亮点**：提供DSH递归发现、生命周期和partial语义适配，研究技术来自上游，技能数量不是效果证据。见[Q01](../../plugins/dhicoc--dsh-reverse-skill/INSIGHT.md#research-q01)、[Q02](../../plugins/dhicoc--dsh-reverse-skill/INSIGHT.md#research-q02)。

> **思考**：provider不执行路由/授权/权限约束，未投影的frontmatter被get剥离；Windows/Bash入口均存在，但tool-index及领域环境需本机生成/准备，正常list不代表任务就绪。见[Q02](../../plugins/dhicoc--dsh-reverse-skill/INSIGHT.md#research-q02)、[Q03](../../plugins/dhicoc--dsh-reverse-skill/INSIGHT.md#research-q03)。

> **建议**：未验证方向是技能打开前的环境/资源就绪清单，以离线样本比较误启动、准备与纠错；普通链接检查足够则止于共享工具。见[Q04](../../plugins/dhicoc--dsh-reverse-skill/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/dhicoc--dsh-reverse-skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334459444-root"></a>

## [DSH Router Standard](../../plugins/yjh051108--dsh-router-standard/INSIGHT.md)

[![GitHub ★ 347](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=347&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yjh051108/dsh-router-standard)

> **用途**：工具繁多的软件交付会话，用阶段减少急于执行并提示验证；用户仍需真实产物验收，见 [Q01](../../plugins/yjh051108--dsh-router-standard/INSIGHT.md#research-q01)。

> **亮点**：把阶段、可调工具和目录帮助集中在同一会话模块，并提供结构证据自检，见 [Q01](../../plugins/yjh051108--dsh-router-standard/INSIGHT.md#research-q01) 与 [Q02](../../plugins/yjh051108--dsh-router-standard/INSIGHT.md#research-q02)。

> **思考**：推进看调用而非成功；restrict异常可开放，结构证据不证明语义，持久状态直写，见 [Q02](../../plugins/yjh051108--dsh-router-standard/INSIGHT.md#research-q02)。

> **建议**：分开调用/通过/业务验收，推进绑定实际结果及稳定证据摘要并测错误晋级与返工，未实现，见 [Q03](../../plugins/yjh051108--dsh-router-standard/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/yjh051108--dsh-router-standard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334830521-root"></a>

## [DSH Skills Manager](../../plugins/michengai--dsh-skills-manager/INSIGHT.md)

[![GitHub ★ 386](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=386&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-skills-manager) [![npm 30d 138,355](https://img.shields.io/static/v1?label=npm+30d&message=138%2C355&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager)

> **用途**：维护多个助手和项目技能目录的人可统一查找副本并管理更新，合格结果应是目标会话调用正确正文且可恢复。见[Q01](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q01)。

> **亮点**：它把外部技能实际接入DSH调用链，并让同名选择、启停和可追溯仓库更新共享管理入口，超出单纯文件列表；收益仍以实际任务为准。见[Q01](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q01)至[Q03](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q03)。

> **思考**：只读来源保护原文件，却仍能把正文送入模型调用；名称合法和文件摘要不证明指令可信。更新恢复设计也未独立证明任意硬中断和外部竞态下无损。见[Q02](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q02)与[Q03](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q03)。

> **建议**：可研究首次启用和内容变更时绑定技能摘要的适用确认，分清文件管理与指令信任；须比较误启用与审阅负担，尚未验证。见[Q06](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/michengai--dsh-skills-manager/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-packages-dsh-task-board"></a>

## [DSH Task Board](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md)

[![GitHub ★ 9,562](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C562&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 110,197](https://img.shields.io/static/v1?label=npm+30d&message=110%2C197&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board)

> **用途**：已有DSH的维护者可管理可回查的巡检/评审任务和子任务。

> **亮点**：把任务、Host调度、会话和验证记录串成可回查执行流程，增量在状态所有权和完成门槛。见[Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q01)。

> **思考**：卡片列可人工声明，gate只拦识别的goal完成；裁判仍可能语义误判，不能将Done或No False Completion当通用验收。见[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q02)。

> **建议**：未验证方向是默认区分手工声明、Host执行和证据验收及副作用状态；固定卡片理解测试无减误信则不推广。见[Q04](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333732838-root"></a>

## [DSH Taskboard](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md)

[![GitHub ★ 323](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=323&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shengsheng90/DSH-taskboard) [![npm 30d 1,310](https://img.shields.io/static/v1?label=npm+30d&message=1%2C310&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard)

> **用途**：本地DSH项目操作者用持久看板管理多会话工作，合格结果是成果、owner和验收有据。见[Q01](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q01)。

> **亮点**：把权威任务状态、原生Agent工具循环、排他认领与人工review入口接在一起，并区分设计节点和可执行provider。见[Q01](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q01)至[Q03](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q03)。

> **思考**：human actor是入口信任约定，CLI/DB本地能力仍可由持权者调用；Goal Completed和非空verification不证明成果已验证。SQLite事务不包Agent与外部写入。见[Q02](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q02)、[Q03](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q03)。

> **建议**：把任务revision、产物摘要与真实验证结果绑定为可复核验收包，验证是否降低误接受且不增加过多审核成本。见[Q06](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333100390-root"></a>

## [DSH Turn Rewind](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md)

[![GitHub ★ 138](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=138&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-turn-rewind) [![npm 30d 4,502](https://img.shields.io/static/v1?label=npm+30d&message=4%2C502&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind)

> **用途**：适合在一个工作目录中连续让Agent改文件、又需要撤回某次请求的开发者。合格结果是恢复该消息前被管理路径的内容，并可新建截至前一轮的会话；原会话保留。简单办法是事前手工提交或复制目录，再分别重开对话。作者用消息按钮减少两类状态人工对齐，但这不等于数据库、外部服务或忽略文件也被恢复。

> **亮点**：依据 [Q02](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md#research-q02) 和 [Q03](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md#research-q03)，它把消息锚点、短期会话计划、写前救援与恢复后校验串成持久生命周期。相对手工提交再分别重开对话，增量是两个状态的显式编排以及路径级防过期检查；普通目录CAS与Git对象复用均为既有技术的组合，不宣称原创。该贡献成立于所需路径确实被捕获、存储可用且用户能核对计划时，不能外推成环境级事务回滚或保证节时。

> **思考**：[Q04](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md#research-q04)指出检查点管理集合小于整个工作环境，超限跳过文案与安全契约不一致，外部状态和忽略路径也不会回退。救援和journal是可核查保护而非绝对保证，恢复与回滚可能同时失败；试用应先检查覆盖清单和独立备份，否则“回到请求前”的心理模型会超过机制承诺。

> **建议**：[Q08](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md#research-q08)提出未验证的检查点覆盖差集契约，先将任务涉及路径与已管理、跳过和排除项对照，再允许用户明确选择恢复。它由超大文件跳过及非托管路径限制推导，相对现有变更预览增加的是“本次不能恢复什么”。在同目录放入普通、忽略及超大文件，对照两种预览下用户识别未恢复路径的正确率和操作时间；若误判率不下降或额外负担抵消收益，则否定此设计价值，不计为当前插件能力。

[查看完整分析](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333446374-root"></a>

## [DSH Vision Router](../../plugins/ysr666--dsh-vision-router/INSIGHT.md)

[![GitHub ★ 1,180](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C180&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ysr666/dsh-vision-router) [![npm 30d 34,951](https://img.shields.io/static/v1?label=npm+30d&message=34%2C951&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router)

> **用途**：以文本模型为主但需问截图和局部定位的DSH用户；已有合格原生视觉可比较后选择。[Q01](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q01)

> **亮点**：把文本主模型与视觉工具分工接入DSH，结合失败分层回退和像素核对；不把模型视觉能力和演示差异归为独立效果证明。[Q01](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q01) [Q02](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q02)

> **思考**：免Key云回退默认开启，图片会出站；本地过滤存在不等全路径隐私验收，供应商失败也不能随意绕适配再请求。[Q03](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q03)

> **建议**：未验证方向是无敏感内容的逐尝试账本，记录出站和预算以验证隐私/重复费用并减少排障。[Q05](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/ysr666--dsh-vision-router/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333100071-root"></a>

## [DSH Vision Toolkit](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md)

[![GitHub ★ 907](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=907&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,773](https://img.shields.io/static/v1?label=npm+30d&message=10%2C773&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

> **用途**：适合使用文字模型的DSH开发者检查截图错误、界面位置和视觉差异。原办法是把图转到另一个视觉模型，再手工复制描述或坐标回来；本插件把上传、定位和Artifacts返回连入同一会话。合格结果是能追溯到输入图的文本证据或坐标，并由用户核对相应区域，而不是模型自称看见了。已有原生多模态模型或只做偶发看图的人，转接价值较小。作者长期使用和首创表述未作为独立需求证明。

> **亮点**：[Q02](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q02)支持上游视觉执行与DSH会话、设置和Artifacts的整合；按Agent激活有明确增量，不将视觉推理本身计为新贡献。

> **思考**：[Q03](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q03)服务和接口就绪不能证明定位准确；错误坐标直接驱动动作会放大影响，建议保留人工核对。

> **建议**：[Q05](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q05)提出原图指纹与动作前状态校验的未验证假设，用变化界面对照误点和额外调用。

[查看完整分析](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1367597810-root"></a>

## [DSH 插件市场](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md)

[![npm 30d 1,557](https://img.shields.io/static/v1?label=npm+30d&message=1%2C557&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market) [![最新发布 2026-09-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market)

> **用途**：供已有 DSH profile 的个人用户集中发现、安装及管理扩展；固定来源或少量偶发安装仍可保留手工命令。[Q01](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q01)

> **亮点**：将浏览目录、核对已装版本和执行安装集中到同一宿主页面；目录内容和包管理由上游提供，贡献是profile感知的接线与状态整理，而非新包管理技术。[Q01](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q01) [Q02](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q02)

> **思考**：安装退出成功不等于原来源被保留或新插件已加载；目录命令可能把固定Git来源变为npm，恢复也未形成完整事务。[Q03](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q03) [Q04](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q04)

> **建议**：未验证假设是加入来源审阅、依赖快照与安装后加载核对；用来源替换、断网和需重启三类故障检验是否减少误改和恢复负担。[Q06](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344715270-root"></a>

## [dsh-a11y-scan](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md)

[![npm 30d 83](https://img.shields.io/static/v1?label=npm+30d&message=83&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-a11y-scan) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-a11y-scan)

> **用途**：前端开发者把可访问性自动检查接入工具流程，仍需人工确认真实任务与规则覆盖。

> **亮点**：把目标发现、axe错误与命中、修复线索和人工复核接入结构化DSH工具，贡献在编排而非新检测算法。详见[Q01](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md#research-q01)与[Q02](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md#research-q02)。

> **思考**：静态服务只作词法目录检查再原生读文件，未核物理路径；浏览器加载本地HTML仍可有网络/脚本副作用，confirmUrl不是授权收据。详见[Q02](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md#research-q02)。

> **建议**：可探讨扫描能力清单，绑定资源realpath、引擎/规则和网络源，静态服务只暴露计划文件；动态资源兼容成本未验证。详见[Q05](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1354283280-root"></a>

## [dsh-about](../../plugins/1010n111--dsh-about/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1010n111/dsh-about)

> **用途**：用户排障或核版本时，在界面内快速获得版本与更新日志。

> **亮点**：把本地版本与远端 Release 信息集中到 Web 设置页，降低查找步骤。详见[Q02](../../plugins/1010n111--dsh-about/INSIGHT.md#research-q02)。

> **思考**：通过 clientModules bundle 路径拼 node_modules 候选无法保证与实际 dsh --version 一致；路由统一 200 且未限 GET。详见[Q03](../../plugins/1010n111--dsh-about/INSIGHT.md#research-q03)。

> **建议**：由宿主提供进程版本/commit 与安装来源，并为 Release 标记时间/tag，可提高诊断可信度；尚未实现。详见[Q05](../../plugins/1010n111--dsh-about/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1010n111--dsh-about/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1414323673-root"></a>

## [dsh-agent-recycle-guard](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md)

[![npm 30d 876](https://img.shields.io/static/v1?label=npm+30d&message=876&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-recycle-guard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-recycle-guard)

> **用途**：本机项目维护者希望给Agent常见删除提供可恢复缓冲，合格结果是目标与语义不扩大、失败不降级永久删除，不把插件当系统级隔离。详见[Q01](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md#research-q01)。

> **亮点**：将有限删除识别、真实Shell参数展开和系统回收接入DSH原工具权限链，并在分析失败时拒绝，而非宿主插件直接越过工具执行回收；增量是边界清楚的机制组合。详见[Q01](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md#research-q01)。

> **思考**：有限脚本检查并不证明任意代码安全，超大、未知编码和深层加载可能放行，路径复核也非原子隔离；这些静态边界必须限制其作为删除缓冲的用途。详见[Q03](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md#research-q03)。

> **建议**：可探讨最小检查覆盖收据，区分实际读取、跳过和重写内容，再连接最终回收回执；先验证是否减少用户安全误解并控制隐私和日志负担。当前未验证。详见[Q06](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1296792947-integrations-dsh-agentdebugx"></a>

## [dsh-agentdebugx](../../plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md)

[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AgentDebugX/AgentDebugX) [![npm 30d 784](https://img.shields.io/static/v1?label=npm+30d&message=784&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agentdebugx) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agentdebugx)

> **用途**：开发者解释Agent失败/重试，需要把已完成会话变成可回指事件的诊断报告；不以无finding当任务成功。详见[Q01](../../plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md#research-q01)。

> **亮点**：将DSH完成边界、Zstandard日志、模型工具和Python诊断接成一条本地流程，保留deep失败与原任务结果；核心诊断算法仍归AgentDebugX。详见[Q01](../../plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md#research-q01)。

> **思考**：持久DSH日志分支只作词法root核对后读取，和Python通用轨迹真实路径检查不一致；超时也未见终止后台诊断。静态风险未复现，足以收窄当前采用。详见[Q03](../../plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md#research-q03)。

> **建议**：可研究绑定确认对象、真实路径/hash、完成边界与取消状态的输入/任务收据，用保存会话及symlink/超时反例验证是否减少错对象诊断与重复执行。当前未验证。详见[Q06](../../plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425045401-root"></a>

## [dsh-ai-armor](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md)



> **用途**：希望在 AI 改码后按事故类型调用定向诊断工具的开发者可用它一次安装注册 Git 回归定位、堆栈解码、配置校验、跨平台 shell 转义和 SQL 静态审计工具；合格结果是输出可回指提交、堆栈、配置或 SQL 位置，并经项目测试或人工复核。详见[Q01](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md#research-q01)。

> **亮点**：将五个既有子插件统一装载，降低发现与安装入口数量，但没有形成跨工具联合诊断机制。它相对“分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md#research-q03)。

> **思考**：其中 bisect 需要执行复现脚本并切换 Git 状态，不能把整包概括为完全不执行代码或无副作用。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md#research-q04)。

> **建议**：未来可探索：可按场景延迟注册工具，并把 bisect 固定在临时 worktree 与显式命令预览中，降低误选与仓库副作用。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334245678-root"></a>

## [dsh-anchored-standard](../../plugins/xiaobright--dsh-anchored-standard/INSIGHT.md)

[![GitHub ★ 3,739](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C739&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiaobright/dsh-anchored-standard)

> **用途**：对象是研究模型对首轮工具与上下文敏感性的预设实验者。原办法是使用原生Minimal或Standard并手工改提示；合格结果是固定模型和任务下可重放的轨迹及质量成本对照。README已冻结项目且主调优模型退役，不应将历史样本直接用于当前模型的生产推荐。

> **亮点**：相对重复写“认真思考”提示，实际增量是工具与上下文暴露的结构控制，晋升状态还能跨压缩重建。相对原生Minimal，它允许后续恢复较完整目录。该设计可用于研究首轮条件，但锚定改善任务质量仍依赖具体模型和试验，不能把API表面变化当作通用认知提升。 依据[Q03](../../plugins/xiaobright--dsh-anchored-standard/INSIGHT.md#research-q03)。

> **思考**：最强反证来自作者冻结说明：原目标V4 Pro退役，后继V4.1 Flash未在该任务条件下测量，先前flash家族探针不能代替后继实测。首轮清空contexts也包含自动工作区和策略快照，门控行为不等于宿主权限检查被移除，但可能使模型缺少任务指引。includeSubagents与其他phase插件配置不一致还会让实验条件漂移。 依据[Q04](../../plugins/xiaobright--dsh-anchored-standard/INSIGHT.md#research-q04)。

> **建议**：未验证假设是把首轮门控从固定模型补丁改成显式实验开关，自动记录门控前后输入差异，能更便宜地区分提示面效应与额外思考轮次。固定当前模型、任务、预算，比较原生Minimal、Standard和门控Standard；同时记录指引漏读、合格率和调用费。若门控只增加轮次或漏掉关键指引且无质量改善，应停止这一模型上的调优。 依据[Q08](../../plugins/xiaobright--dsh-anchored-standard/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/xiaobright--dsh-anchored-standard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1417137113-root"></a>

## [dsh-approval-explainer](../../plugins/arisuyuuko--dsh-approval-explainer/INSIGHT.md)



> **用途**：面向看不懂提权命令或权限请求的 DSH 用户，在作出允许或拒绝决定前阅读具体操作及选项后果。

> **亮点**：相对只展示命令，插件把操作、用户目标、风险依据和允许/拒绝后果组织成同屏解释，改变审批时的信息交接；后台执行保留原审批链继续处理。它提供的是模型解释而非安全证明，审批权威仍在宿主和人。[Q01](../../plugins/arisuyuuko--dsh-approval-explainer/INSIGHT.md#research-q01)

> **思考**：讲解模型能否独立识别发起模型的误判决定解释价值。输入包含发起模型自身推理、近期用户指令和截断后的原始参数，路由优先沿用会话模型；这可能复述错误理由或受不可信文本影响。系统提示要求把材料当数据、缺证时保守，但格式归一化只限制枚举和长度，不能验证事实、脚本实际内容或风险归因。[Q02](../../plugins/arisuyuuko--dsh-approval-explainer/INSIGHT.md#research-q02)

> **建议**：可提出未验证的证据分离注释，把可直接解析的目标、权限与副作用显示为确定事实，把模型推断与缺失文件显式标注，并让用户先看原始目标再看建议。对同组含混命令和诱导文本比较现版与分离版的误允许率、正确拒绝率及决策耗时；若仅增加阅读时间而不改善错误决定，就否定其采用价值。[Q04](../../plugins/arisuyuuko--dsh-approval-explainer/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/arisuyuuko--dsh-approval-explainer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1421741516-root"></a>

## [dsh-ark-coding-provider](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Akiyuki1130/dsh-ark-coding-provider)

> **用途**：面向已有Ark Coding Plan订阅及密钥/SSO权限的DSH用户，将专用route、流式工具和控制面目录/额度接入宿主；不同认证类型覆盖不同能力。

> **亮点**：把Coding Plan专用流式、错误轮换、账户HOME/凭据和控制面额度接成宿主provider，并在已yield后拒绝混账户续接；固定二进制安装降低桌面外部npm依赖。[Q02](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md#research-q02)、[Q08](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md#research-q08)

> **思考**：静态能力表与额度不是本轮模型或账单实测；HOME约束为词法，冷却为排序；直接下载的实际字节限额在完整缓冲后判断，不能当流式内存硬上限。[Q03](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md#research-q03)、[Q04](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md#research-q04)、[Q08](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md#research-q08)

> **建议**：可探索账户/端点/能力版本与请求阶段/终止usage收据、物理HOME和body预算，比较错身份/重复请求及元数据成本；未实现。详见[Q07](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344714509-root"></a>

## [dsh-asciinema](../../plugins/988hj7tczd-oss--dsh-asciinema/INSIGHT.md)

[![npm 30d 384](https://img.shields.io/static/v1?label=npm+30d&message=384&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-asciinema) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-asciinema)

> **用途**：适合把DSH会话中工具结果的可见文字留成可回看/分享的本地材料。term_rec开始/停止/标记/状态，term_play生成HTML或文本，term_cat拼接输出。不是终端PTY逐字节录像、视频录屏、命令重放或可验证执行审计。

> **亮点**：结合Session对象/ID隔离、单writer事件字节护栏及cast/HTML/文本三入口，减少手工保存工具文字。详见[Q02](../../plugins/988hj7tczd-oss--dsh-asciinema/INSIGHT.md#research-q02)。

> **思考**：模板../../定位错误、帧间隔max再求和导致计时偏差，stop先移除再保存无重试句柄/卸载drain；输出含秘密/内容替换与导入上限需核，非官方互通。详见[Q03](../../plugins/988hj7tczd-oss--dsh-asciinema/INSIGHT.md#research-q03)、[Q04](../../plugins/988hj7tczd-oss--dsh-asciinema/INSIGHT.md#research-q04)。

> **建议**：可探索统一时间语义与范围/模板版本/保存pending收据，字面嵌入与失败可恢复，比较完整率/资源；未实现。详见[Q07](../../plugins/988hj7tczd-oss--dsh-asciinema/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-asciinema/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336185734-root"></a>

## [dsh-auto-reviewer](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AntaresCorn/dsh-auto-reviewer)

> **用途**：希望减少重复审批提示的开发者可研究单次自动裁决，但合格结果必须保留具体操作的用户授权。[Q01](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q01)

> **亮点**：为DSH组合预设、逐次审批与可读通知，提供规则到LLM再到人工的路由；价值在减少打断的机制，未证明与任何官方产品保障等价。[Q01](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q01) [Q02](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q02)

> **思考**：最近用户文本命中英语肯定词就标用户确认，没有绑定当前操作；参数缺失仍可能因未命中风险规则走默认自动放行。加载还会改宿主客户端文件，均需独立核查。[Q03](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q03) [Q04](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q04)

> **建议**：可用绑定工具、参数、工作区和期限的授权凭据，未知操作转人工；以无副作用桩检验旧确认和目标变更，若碰撞或大量误阻塞则否定。未实现。[Q05](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1386463441-root"></a>

## [dsh-cache-bricks](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md)



> **用途**：维护者排查长会话的缓存变化与重试，需要把usage和请求证据关联到对话位置；目标是正确诊断，不是只追求绿色。详见[Q01](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md#research-q01)。

> **亮点**：把attempt级请求、缓存指标和对话位置组织成可视诊断流程，保留重试和缺字段区别；增量是观察证据与阅读操作的组合，不会自动优化缓存。详见[Q01](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md#research-q01)。

> **思考**：缓存颜色不能独立解释原因，公式依赖宿主分桶口径；记录会淘汰且敏感blob需要明确访问边界，历史重建也不等于原始请求完整恢复。详见[Q03](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md#research-q03)。

> **建议**：可探讨在颜色旁显式表达attempt/估算及证据完整性，并要求归因回指可比请求；先用缺字段和淘汰样例比较误归因与操作时间，当前未验证。详见[Q06](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1356896576-dsh-capmap-viz"></a>

## [dsh-capmap-viz](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1741505640/capmap-skills) [![npm 30d 640](https://img.shields.io/static/v1?label=npm+30d&message=640&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz)

> **用途**：面向已经用 CapMap 结构化文档维护能力、主题和依赖的项目成员。输入是 docs root 下的 YAML/Markdown；合格结果是图节点、边、状态颜色、能力面板和派生查询与文件内容一致，工作区切换不串状态，变更后 revision 更新。简单替代是目录浏览、Markdown 搜索或通用图工具。

> **亮点**：相对 Markdown 搜索，它把同一 CapMap 规范直接转为可交互图、状态描边和项目级派生问题，并能在文档变化后刷新。核心增量是领域文档模型与宿主侧栏的结合；d3-force 和 YAML 解析属于成熟组件，图形本身不证明文档代表真实实现。 参见[Q03](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q03)。

> **思考**：关键前提是文档持续、准确且有明确来源。解析成功只能证明格式满足规则，不能证明能力已实现、验证门已通过或依赖仍有效；图的视觉权威感可能放大陈旧文档。大图的布局稳定性、可访问性、watch 风暴和多 workspace 内存也未验证。 参见[Q04](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q04)。

> **建议**：可让每个能力/关系附 Git blob、代码/测试证据、负责人和 checked_at，把节点状态分成‘声明／实现／验证／过期’，并让 validation gate 只基于有效证据。它可能把漂亮图升级为可审计决策图，但会增加维护字段与证据采集成本。 参见[Q08](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1427331352-root"></a>

## [dsh-codex-bridge](../../plugins/ak-blank--dsh-codex-bridge/INSIGHT.md)

[![npm 30d 47](https://img.shields.io/static/v1?label=npm+30d&message=47&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-bridge) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-bridge)

> **用途**：已登录Codex的DSH开发者委派自包含任务，须同时验答案/产物与用量；调用方负责上下文整理。

> **亮点**：把只读额度、委派执行、模型/effort护栏和结构化结果连成DSH双工具，减少手工终端接线。参见[Q01](../../plugins/ak-blank--dsh-codex-bridge/INSIGHT.md#research-q01)。

> **思考**：缓存百分比与进程内锁不是额度预留；超时/取消并不回滚已写产物，布尔开关也不能独立证明用户授权。参见[Q03](../../plugins/ak-blank--dsh-codex-bridge/INSIGHT.md#research-q03)。

> **建议**：未验证假设为任务预算/产物收据和未知结果先核后续，比较共享消费、中断和截断下的总用量及重复副作用。参见[Q04](../../plugins/ak-blank--dsh-codex-bridge/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/ak-blank--dsh-codex-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340906871-dsh"></a>

## [dsh-codex-guard](../../plugins/akimiya-z--codex-guard--dsh/INSIGHT.md)

[![GitHub ★ 133](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=133&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Akimiya-z/codex-guard)

> **用途**：面向希望在DSH编码会话中扫描未提交Git变更的开发者，交付由人复核的TODO/密钥候选报告；需要强制合并门槛时，本组件的字符串报告不足以担当放行依据。

> **亮点**：将既有 CLI 接入 DSH 工具链，并在 Windows 绕过 cmd shell 传参。增量是接线便利和平台适配，扫描算法归属原 CLI。参见[Q01](../../plugins/akimiya-z--codex-guard--dsh/INSIGHT.md#research-q01)、[Q02](../../plugins/akimiya-z--codex-guard--dsh/INSIGHT.md#research-q02)。

> **思考**：工具描述包含提交主题检查，但调用未传 --commits；同时将执行状态折叠成字符串，不能承担可靠放行。参见[Q03](../../plugins/akimiya-z--codex-guard--dsh/INSIGHT.md#research-q03)。

> **建议**：未验证假设是固定 CLI 版本并输出覆盖与退出状态收据，受限异步执行可能减少 Agent 把调用完成误作检查通过；需六类故障对照，失败时否定。参见[Q05](../../plugins/akimiya-z--codex-guard--dsh/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/akimiya-z--codex-guard--dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333961389-root"></a>

## [dsh-context](../../plugins/bowenliang123--dsh-context/INSIGHT.md)

[![GitHub ★ 3,566](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C566&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 145,261](https://img.shields.io/static/v1?label=npm+30d&message=145%2C261&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)

> **用途**：面向长会话、多工具和子Agent较多、需要知道上下文为何膨胀或压缩的DSH开发者。合格结果是能定位某请求的组成、注入、文件/命令活动与相关会话，再决定精简什么；不是图表本身越多越好。简单办法是看宿主token环和原始日志；插件把总量和逐请求来源连起来，但诊断并不自动改善模型回答或降低账单。

> **亮点**：[Q03](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q03)识别出从总量环到逐请求来源定位的可观察性贡献，头/明细分离把重集合按需读取。相对手查日志改善定位组织，不把宿主投影或估算规则当原创，也不宣称自动提高模型效果。

> **思考**：[Q04](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q04)说明密度估算、有界保留与冷读跳过会收窄“完整”含义，全局prompt设置又可改变被观察对象；诊断试用应先保持空前后缀并明确数据来源。

> **建议**：[Q08](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q08)提出未验证的来源覆盖条，把精确值、估算、裁剪与跳过分开，按用户识别缺数据正确率和提示负担检验，不能将该假设计为本版能力。

[查看完整分析](../../plugins/bowenliang123--dsh-context/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1300173275-extensions-dsh"></a>

## [dsh-deja](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md)

[![GitHub ★ 1,310](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C310&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu) [![npm 30d 5,274](https://img.shields.io/static/v1?label=npm+30d&message=5%2C274&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja)

> **用途**：已有同机旧Agent历史的开发者可找回过去决策、错误修法与命令。

> **亮点**：把DSH原生历史范围之外的同机Agent日志接成统一检索与上下文入口；核心索引机制归deja CLI，不重复当适配器原创。见[Q01](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q01)。

> **思考**：本地无LLM索引不等于召回不发模型，旧结论可污染当前任务；同步CLI失败转空串也会混淆无匹配。见[Q03](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q03)。

> **建议**：未验证方向是先核核心现有出处，再比较项目/时间/失效条件标注能否减少过期记忆误用；无净改善则保留手动查询。见[Q04](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344714002-root"></a>

## [dsh-dep-vuln-scan](../../plugins/988hj7tczd-oss--dsh-dep-vuln-scan/INSIGHT.md)

[![npm 30d 103](https://img.shields.io/static/v1?label=npm+30d&message=103&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dep-vuln-scan) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dep-vuln-scan)

> **用途**：面向在DSH里维护多语言项目、希望先看到锁定依赖是否匹配已知OSV公告的开发者。输入是目录/单锁文件、生态过滤和fast/full，输出包版本、公告、修复建议与可重放报告。插件只建议命令，不运行安装或改锁文件。

> **亮点**：把多生态锁输入、批量ID/共享详情查询与宿主可重放报告统一，减少手工切换；只读建议，不是新漏洞情报或可利用性验证。详见[Q02](../../plugins/988hj7tczd-oss--dsh-dep-vuln-scan/INSIGHT.md#research-q02)。

> **思考**：同生态多锁来源被最后路径覆盖，fixed未按包/区间完整约束且多漏洞仍取最小；扫描cap静默、错误时也可显示0受影响，不能据此clean，未运行真实公告对照。详见[Q03](../../plugins/988hj7tczd-oss--dsh-dep-vuln-scan/INSIGHT.md#research-q03)。

> **建议**：可探索包occurrence来源与四段覆盖收据，并按生态/分支求所有公告修复约束，无法证明时给候选；比较错源/欠修复/假clean与成本，未实现。详见[Q06](../../plugins/988hj7tczd-oss--dsh-dep-vuln-scan/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-dep-vuln-scan/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335980444-root"></a>

## [dsh-diff-approval](../../plugins/9087--dsh-diff-approval/INSIGHT.md)

[![GitHub ★ 15](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=15&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9087/dsh-diff-approval) [![npm 30d 5,099](https://img.shields.io/static/v1?label=npm+30d&message=5%2C099&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-diff-approval)

> **用途**：共同编辑代码时逐块审阅和讨论；合格决定必须与盘面及测试一致。见[Q01](../../plugins/9087--dsh-diff-approval/INSIGHT.md#research-q01)。

> **亮点**：把改动捕获、细粒度审阅与批注入口放到会话流程中，不承担写前授权或测试验收。见[Q01](../../plugins/9087--dsh-diff-approval/INSIGHT.md#research-q01)。

> **思考**：普通回退无展示内容比较前提，Undo读后再写也非原子CAS；新建删除和重启不在普遍Undo保证内。见[Q03](../../plugins/9087--dsh-diff-approval/INSIGHT.md#research-q03)。

> **建议**：展示摘要绑定后端原子比较发布，联合部分完成/持久回执，是否减少误覆盖和总恢复成本须对照。见[Q05](../../plugins/9087--dsh-diff-approval/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/9087--dsh-diff-approval/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1424063534-plugins-dsh-domain-bridge"></a>

## [dsh-domain-bridge](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1Lany2a/dsh-domain-role) [![npm 30d 377](https://img.shields.io/static/v1?label=npm+30d&message=377&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-domain-bridge) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-domain-bridge)

> **用途**：面向按业务域分工的DSH会话协作，要求目标、暂停级和消息处理结果可追溯，不能只以delivered推断业务办结。

> **亮点**：把域寻址、分层暂停、持久队列与会话/模型接线组合，并加入跨进程状态锁、投递租约和可查询队列；增量是协作控制面，不是业务隔离或exactly-once。[Q01](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md#research-q01)、[Q03](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md#research-q03)

> **思考**：持久认领已实现，但投递成功与终态非原子；追加队列不走重写锁，损坏暂停状态可放行。hub仅按Host判本机，不能独立证明请求身份。[Q04](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md#research-q04)、[Q10](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md#research-q10)

> **建议**：在现有租约上加入稳定消费ID、接收端去重/完成收据、fencing及统一所有inbox写者协议，比较故障后重复/漏投及恢复负担；不是把已实现租约算新设想。[Q08](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335988605-root"></a>

## [dsh-engineering-workflow](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/82c86b8z86-stack/dsh-engineering-workflow)

> **用途**：团队希望对复杂工程任务进行需求、计划、TDD、委派与验收约束。

> **亮点**：打包五阶段工程方法与 DSH preset/Skill 工具组合，减少手工配置。详见[Q01](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q01)。

> **思考**：自动同步同名 preset 目录时无备份覆写用户改动/删除附加文件；默认公告影响未选 preset 的新会话。详见[Q02](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q02)。

> **建议**：加入版本化/备份合并与轻量低风险路径、按选中 preset 公告，可降低采用摩擦；待验证。详见[Q03](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1372993989-root"></a>

## [dsh-eteams](../../plugins/2507483326--dsh-eteams/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2507483326/dsh-eteams) [![npm 30d 1,404](https://img.shields.io/static/v1?label=npm+30d&message=1%2C404&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-eteams) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-eteams)

> **用途**：需要角色分工和持续交接的DSH任务，需人工定义独立验收与共享目录责任。详见[Q01](../../plugins/2507483326--dsh-eteams/INSIGHT.md#research-q01)。

> **亮点**：把手工多会话交接变成任务合同、成员副本、attempt token和事件/邮箱持久单元，角色可用不同模型；不把本地状态或角色数当效果。详见[Q01](../../plugins/2507483326--dsh-eteams/INSIGHT.md#research-q01)。

> **思考**：非空报告即完成、依赖/链为弱序，spawn和文件不受DB事务回滚；启动10s快扫与60s grace可遗漏近期死尝试。详见[Q04](../../plugins/2507483326--dsh-eteams/INSIGHT.md#research-q04)。

> **建议**：持久受理intent/固定childID、输入产物版本和独立验收收据，延期补判并区分查询未知与死亡，按崩溃/假完成反例证伪。详见[Q08](../../plugins/2507483326--dsh-eteams/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/2507483326--dsh-eteams/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1365519118-root"></a>

## [dsh-evidence-gate](../../plugins/aaronandwork--dsh-evidence-gate/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AaronandWork/dsh-evidence-gate) [![npm 30d 888](https://img.shields.io/static/v1?label=npm+30d&message=888&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@aaronandwork/dsh-evidence-gate) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@aaronandwork/dsh-evidence-gate)

> **用途**：面向需要把亲测、引用和猜测分开的 DSH 会话；合格答复仍需逐项复查事实与原始证据。详见[Q01](../../plugins/aaronandwork--dsh-evidence-gate/INSIGHT.md#research-q01)。

> **亮点**：相较单纯提醒或静态提示，插件把工具活动做成持久、按会话可查的核验线索，并记录亲测/引用/猜测的处理结果；其辅助复核价值取决于模型调用和人工回查，不能称为强制事实门。详见[Q01](../../plugins/aaronandwork--dsh-evidence-gate/INSIGHT.md#research-q01)。

> **思考**：“已实证”可由同名、子串、单词、跨会话活动或仅存在路径触发，且未核对工具成功、内容、时间和主张语义；弱命中仍返回 verified。这使裁定标签可能超过证据强度。详见[Q03](../../plugins/aaronandwork--dsh-evidence-gate/INSIGHT.md#research-q03)。

> **建议**：未验证方向是把证据绑定委派关系、成功状态、内容/版本与时间，弱关联降为待复核，并在提交最终答复前检查承载结论的裁定；用固定误判夹具评估假阳性、假阴性和成本。详见[Q05](../../plugins/aaronandwork--dsh-evidence-gate/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aaronandwork--dsh-evidence-gate/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334811048-root"></a>

## [dsh-expert-mode](../../plugins/asher-2000--dsh-expert-mode/INSIGHT.md)

[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Asher-2000/dsh-expert-mode) [![npm 30d 307](https://img.shields.io/static/v1?label=npm+30d&message=307&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-expert-mode) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-expert-mode)

> **用途**：面向跨前后端、数据或内容等多个领域的复合任务。协调官应选择合适方法、分配目标并回收带证据的结果，合格交付仍由用户具体验收决定，专家角色数量不表示专业正确性。相对普通subagent，这个预设提供领域persona、按需方法、文件消息和任务板，是现成协作约定与入口组合。简单任务保留直接做的通道，有助避免固定多agent成本；法务与金融角色只是提示词，不能据名称赋予资质或真实专业验证。

> **亮点**：[Q01](../../plugins/asher-2000--dsh-expert-mode/INSIGHT.md#research-q01) 与 [Q02](../../plugins/asher-2000--dsh-expert-mode/INSIGHT.md#research-q02) 支持领域方法与宿主spawn、文件协作协议的组合增量。任务板和总线提供持久材料，模型必须主动调用；角色数量与提示内容不构成专业效果证据。

> **思考**：[Q03](../../plugins/asher-2000--dsh-expert-mode/INSIGHT.md#research-q03) 的核心问题是运行状态与预设部署同树，apply清理可能破坏协作持久性；认领代码未呈现原子锁，package.files未列必需router目录。提示质量门也不能替代产物真实验收。

> **建议**：[Q05](../../plugins/asher-2000--dsh-expert-mode/INSIGHT.md#research-q05) 提出资源/运行态隔离加原子租约和交付版本绑定，未验证；应对照重载损失、重复认领和陈旧交付接受率，出现迁移破坏则否定收益。

[查看完整分析](../../plugins/asher-2000--dsh-expert-mode/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333463381-root"></a>

## [dsh-fail-logger](../../plugins/areium--dsh-fail-logger/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Areium/dsh-fail-logger) [![npm 30d 1,149](https://img.shields.io/static/v1?label=npm+30d&message=1%2C149&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fail-logger) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fail-logger)

> **用途**：面向反复排查工具错误的 DSH 使用者，把散落会话中的失败沉淀为后续可加载的本地记录。

> **亮点**：相对人工翻查会话日志，插件把明确标记的工具失败变成按原因计数和分类的本地 Skill，并可在后续步骤提供预防提示。它没有模型修复器或自动纠错保证，贡献是把运行事实组织成可复用恢复资料；规则注入的行为影响应单独评估。[Q01](../../plugins/areium--dsh-fail-logger/INSIGHT.md#research-q01)

> **思考**：能否可靠保存失败记录决定后续记忆价值。flush 在 writeAtomic 状态文件之前就 dirty=false，而 catch 只安排再次调用 flush，没有恢复 dirty；下一次回调可能直接被开头 guard 忽略。因此写失败不必然如注释所说保持重试，Skill 写失败时还可能出现账本已提交而文本未更新。该路径来自源码顺序，未执行故障复现。[Q02](../../plugins/areium--dsh-fail-logger/INSIGHT.md#research-q02)

> **建议**：可提出未验证的事件账本加可重建投影方案：先给增量稳定 ID，原子提交账本后独立生成 Skill，失败只重做投影，提交完成前保持 dirty。用状态写失败、Skill 写失败和双进程竞争注入验证，若出现丢事件、重复计数或投影不能收敛，方案即不成立；额外 ID 和恢复元数据会增加维护成本。[Q04](../../plugins/areium--dsh-fail-logger/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/areium--dsh-fail-logger/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1423215448-root"></a>

## [dsh-folderwatch](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md)



> **用途**：面向开发会话等待构建报告、下载或共享目录交接的用户。插件提供五个folderwatch工具与/watch命令，按目录元数据变化生成消息，可wake新回合或queue到后续步骤。它不直接理解报告内容，不保证构建/测试业务成功，也不是文件内容备份或可靠事件日志。

> **亮点**：以快照差分为主、fs.watch提示为辅，结合quiet/上限/冷却与Agent消息入口减少主动查目录。详见[Q02](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md#research-q02)。

> **思考**：stat递归会跟随目录链接，partial/不可读仍作差分；共享echo不区分成功写或会话，目标失效可fallback别Agent；批次先drain且送达Promise未await。详见[Q03](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md#research-q03)至[Q05](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md#research-q05)。

> **建议**：可探索扫描质量/物理root与owner绑定、成功写echo和批次受理ack，比较误报/漏报/错收件和恢复成本；未实现。详见[Q06](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-packages-dsh-git-graph"></a>

## [dsh-git-graph](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md)

[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 94,671](https://img.shields.io/static/v1?label=npm+30d&message=94%2C671&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph)

> **用途**：为在 DSH Web 或官方桌面中操作 Git 仓库、并行开展多会话开发的用户，提供空会话分支选择、提交图和独立 worktree 管理。合格产物是正确仓库状态和可进入的新工作区；图形展示不代替合并验收。

> **亮点**：它把原生 git worktree 能力与 DSH 工作区注册及空会话入口组合，创建独立 wt/ 分支后将路径交给新会话，而不是让现有会话静默换目录。宿主执行与浏览器展示分开，工作区 realpath 门禁与托管目录约束为集成提供边界；Git 隔离机制本身归属上游。[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q02)

> **思考**：隔离只成立于实际进入新 worktree 的会话。当前会话 cwd 不变，分支切换仍作用于整个共享工作区；此外模型工具先创建磁盘 worktree、再注册 workspace，两步间没有在该入口看到补偿，注册失败可能留下需人工核对的部分状态。这是源码推断的恢复风险，未复现。[Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q03)

> **建议**：未验证假设是给“创建 worktree → 注册 workspace → 打开会话”加入可回读操作记录与阶段补偿，让中断后按真实 Git 和注册表对账再继续。由两种状态系统分开提交推导，增量在恢复语义而非再包装 Git。用故障注入分别在磁盘创建后、注册后中断，与当前流程对比孤儿 worktree、重复工作区和人工恢复时间；若同等负担下无改善，或误删用户状态，否定方案。[Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339462797-root"></a>

## [dsh-github-router](../../plugins/angeloszou--dsh-github-router/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngelosZou/dsh-github-router) [![npm 30d 1,602](https://img.shields.io/static/v1?label=npm+30d&message=1%2C602&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-github-router) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-github-router)

> **用途**：网络受限的Agent需要有来源标注的GitHub资料读取。详见[Q01](../../plugins/angeloszou--dsh-github-router/INSIGHT.md#research-q01)。

> **亮点**：将多传输故障处理和PR逐部分取数封装为Agent读取流程，减少shell重试与人工拼接。详见[Q01](../../plugins/angeloszou--dsh-github-router/INSIGHT.md#research-q01)。

> **思考**：URL缓存不绑定凭据主体，本地路径以origin匹配替代授权闭合；分页、HTML候选与镜像也限制完整性。详见[Q04](../../plugins/angeloszou--dsh-github-router/INSIGHT.md#research-q04)。

> **建议**：可研究身份分区缓存与对象/SHA/分页/截断来源清单，按换身份和错对象反例比较错误复用。当前未验证。详见[Q07](../../plugins/angeloszou--dsh-github-router/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/angeloszou--dsh-github-router/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333258432-root"></a>

## [dsh-hdc-bridge](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1na-ko/dsh-hdc-bridge) [![npm 30d 1,689](https://img.shields.io/static/v1?label=npm+30d&message=1%2C689&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hdc-bridge) [![最新发布 2026-10-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hdc-bridge)

> **用途**：鸿蒙开发者需要在DSH内观察设备、改码、部署再验证，合格结果绑定正确设备和真实产物，不只是命令exit0。详见[Q01](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q01)。

> **亮点**：把成熟hdc和官方工具链/知识接入DSH原生结果、图片和工程流程，减少手工材料交接；不将协议、官方文档与上游编译能力记为原创。详见[Q01](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q01)。

> **思考**：工具层和面板不是同一执行权限通道，preferred设备单值也需宿主实例作用域才能兑现会话隔离；多设备自动选择可能偏离意图。这些静态边界尚未运行复现。详见[Q03](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q03)。

> **建议**：可研究显式会话/设备/工程/产物收据，以双设备双工程和连接切换序列比较误投目标及人工负担，当前未验证。详见[Q06](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1355618827-packages-dshb"></a>

## [DSH-HoneyBee](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md)

[![npm 30d 1,319](https://img.shields.io/static/v1?label=npm+30d&message=1%2C319&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@artenx/dshb) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@artenx/dshb)

> **用途**：已有 SSH 或 Docker 开发环境的用户可在 DSH 中绑定远程工作区，集中处理文件、命令和会话；真实频率与节时尚未验证，详见 [Q01](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q01)。

> **亮点**：DSHB 把工作区到执行节点的映射复用到文件、命令和终端接口，并以摘要、事件前缀校验及待恢复日志支持会话同步，减少模型自行选择SSH入口的责任；这属于可核查的组合设计，实际节时尚未知，见 [Q02](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q02) 与 [Q04](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q04)。

> **思考**：透明路由只有在目标和中断语义可靠时才有价值。绑定文件读取异常会变成空绑定并走本机，普通远端 shell 的 kill 返回 false，执行 SSH 也未接入已登记主机指纹；这些源码边界使重要数据和公网持续使用应暂缓，实际副作用尚未复现，见 [Q02](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q02) 与 [Q03](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q03)。

> **建议**：可探索携带节点身份、绑定版本和取消能力的操作凭据，并将绑定损坏与无绑定分开处理，以减少错误目标和取消误判。这是从 [Q02](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q02) 推导的未验证假设；先用隔离目录与手动 SSH 对照，出现错误目标或取消后状态仍不一致即推翻，见 [Q06](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344270011-root"></a>

## [dsh-j-space](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AnonyJcy/dsh-j-space) [![npm 30d 2,043](https://img.shields.io/static/v1?label=npm+30d&message=2%2C043&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anonyjcy/dsh-j-space) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anonyjcy/dsh-j-space)

> **用途**：复杂多阶段工程任务中需要持久来源、问题、报告与验收记录的开发者。

> **亮点**：原生preset声明、包内Skill定位和DSH执行authority覆盖让上游协议可进入现有宿主；复杂度不自动授权团队，证据参与者不冒充宿主身份。[Q01](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md#research-q01) [Q03](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md#research-q03)

> **思考**：来源hash、轮次和独立review字段只能约束记录，不能证明结论正确；没有可信hook时依赖agent主动调用，不能称自动强制治理，也不能借上游成绩证明适配效果。[Q02](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md#research-q02) [Q04](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md#research-q04)

> **建议**：未验证假设是来源依赖图提出定向复核建议，以原版全文刷新为保真对照；在有关/无关来源改动故障集上比较漏复核和全成本，漏检增加或成本不降即否定。[Q05](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1378138611-root"></a>

## [dsh-jev-guard](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 1,591](https://img.shields.io/static/v1?label=npm+30d&message=1%2C591&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-guard)

> **用途**：给编码Agent shell任务提供附加事故检查，仍保留原生沙箱与审批。

> **亮点**：把成熟规则和语义判据接到工具执行前的硬决策点，区分改写/阻断/人工；是附加事故阀而非完整安全边界。[Q01](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md#research-q01)、[Q02](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md#research-q02)

> **思考**：模型或adapter错误可能放回原生管线，非指定工具跳过；令牌未绑cwd/状态/TTL且折叠命令空白，局部一次性不等严格资源授权。[Q03](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md#research-q03)

> **建议**：未验证方向是准确命令+real cwd+资源摘要+session/TTL授权，以及显式降级停/问策略；用状态变更、并发和断网矩阵检验错误放行与负担。[Q06](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1382292535-root"></a>

## [dsh-jev-interceptor](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md)

[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AskTheWay/dsh-jev-interceptor) [![npm 30d 2,815](https://img.shields.io/static/v1?label=npm+30d&message=2%2C815&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-interceptor) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-interceptor)

> **用途**：频繁工具调用且愿校准遥测的DSH开发者，以可控风险分流和任务正确为目标。

> **亮点**：typed fan-out接多宿主决策点，并用next委托、空白名单、session/call/tool新鲜参数证据与字节预算限制部分权限和信息损失；贡献在编排，不等分类准确或最终任务收益。[Q01](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q01) [Q02](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q02)

> **思考**：确认逻辑缺陷：opt-in图像卸载在shadow也可直接落盘image/offload，违反只记录承诺；默认关闭收窄触发面但不消除缺陷。其他挂点有mode门，不能泛化。[Q03](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q03)

> **建议**：未验证统一effect gate让所有动作携带mode/provenance/证据/可逆性，单一提交边界强制shadow只建议；跨五类挂点矩阵中任意shadow状态变化即否定，再与原生比误判和全成本。[Q06](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422091204-root"></a>

## [dsh-leak-guard](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md)



> **用途**：适合开发者在公开仓库/publish/外发目录前，以本地启发式检查现有文本中的凭据线索，再人工复核/移除。基线手工grep/检查文件名或专门secret scanner；插件把规则扫描接入DSH工具并返回脱敏发现，便于模型/人看位置。

> **亮点**：把本地模式/文件名审计整合为DSH工具，按位置级别给克制预览，模块可独立复核；非有效凭据验证。详见[Q02](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md#research-q02)。

> **思考**：缺失根/权限失败/静默长行与限额可使未完整扫描仍ok=true，工具丢截断且小正数预算可round0；绿灯不能当发布安全证明。详见[Q03](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md#research-q03)。

> **建议**：可探索complete/partial/error覆盖收据与精确发布对象摘要、正整数预算和范围去重，按合成真值/变更矩阵证伪；未实现。详见[Q06](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422364992-root"></a>

## [dsh-lighthouse](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md)



> **用途**：多作品发布后的收录与使用线索跟踪。详见[Q01](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q01)。

> **亮点**：显式作品名册结合多源状态与可点击看板，少手工切平台。详见[Q01](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q01)。

> **思考**：PR首50标题匹配/失败空、无来源HTTP放行可能暴露PAT可见私有信息，无预算遍历与直接覆盖写需补。详见[Q03](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q03)。

> **建议**：研究可追溯快照/精确PR身份和受控有界采集写入，比较误诊/披露/恢复成本，尚未验证。详见[Q07](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-csharp"></a>

## [dsh-lsp-csharp](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-csharp/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH Agent 中查询 C# 定义、引用、实现和 hover。

> **亮点**：将 C# 扩展映射和 OmniSharp 启动参数打包为 Cordis 组件。详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-csharp/INSIGHT.md#research-q01)。

> **思考**：只有 DLL 的环境默认命令失败；catch-all fallback 把非缺服异常也视为 unavailable，并丢弃自定义扩展映射。详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-csharp/INSIGHT.md#research-q02)。

> **建议**：按异常类型区分配置/缺服，并让 fallback 沿用 resolved extension 映射，可改善诊断；待验证。详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-csharp/INSIGHT.md#research-q02)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-csharp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-go"></a>

## [dsh-lsp-go](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-go/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH 中对 .go 文件做定义、引用、实现和 hover 查询。

> **亮点**：减少 Go LSP 装配；不实现协议，详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-go/INSIGHT.md#research-q01)。

> **思考**：宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-go/INSIGHT.md#research-q02)。

> **建议**：在 fallback 保留合并扩展、区分配置/服务器异常可改善诊断；待验证。详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-go/INSIGHT.md#research-q02)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-go/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-java"></a>

## [dsh-lsp-java](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-java/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：已有 JDK 与 jdtls 的 Java 开发者在 DSH 中查询定义、引用、实现和悬停信息；合格结果需真实项目完成索引并核对位置。

> **亮点**：本包把 Java 命令、参数和扩展映射做成可覆盖的独立语言配置，复用官方 LSP 底座；贡献在接线和配置复用，不是 Java 索引或 LSP 协议。详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-java/INSIGHT.md#research-q02)。

> **思考**：JDK、jdtls、项目 workspace 缺一都可能影响结果；源码 catch 所有加载异常并用默认命令和扩展表建立 unavailable 占位，错误归因与覆盖项会失真，加载也不等于索引完成。详见[Q03](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-java/INSIGHT.md#research-q03)。

> **建议**：可区分命令、JVM、工作区锁、初始化与索引状态，并保留覆盖映射；以故障矩阵比较归因与恢复时间。未实现，也不能把分层诊断算作现有能力。详见[Q04](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-java/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-java/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-kotlin"></a>

## [dsh-lsp-kotlin](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-kotlin/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：适合已有 Kotlin/Gradle 工程且愿意管理外部语言服务器的 DSH 开发者，减少重复配置而不提供 Kotlin 解析器。详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-kotlin/INSIGHT.md#research-q01)。

> **亮点**：相对手动组合官方 LSP 底座，本包把 Kotlin 命令、扩展映射和注册行封装为配置；语言解析与进程管理归外部 server 和共享底座。详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-kotlin/INSIGHT.md#research-q01)。

> **思考**：.kts 有路由不等于 Gradle 脚本语义准确；广泛 catch 会把多种 apply 错误写成 server unavailable，回退还丢自定义扩展映射。详见[Q03](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-kotlin/INSIGHT.md#research-q03)。

> **建议**：未验证的改进方向是按命令/JDK、索引、脚本语义和配置错误区分诊断，并让回退沿用覆盖映射；用故障矩阵测根因命中与排障时间。详见[Q06](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-kotlin/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-kotlin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-lua"></a>

## [dsh-lsp-lua](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-lua/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH 中查询 Lua 文件定义、引用、实现、hover。

> **亮点**：减少 Lua LSP 装配；不实现协议，详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-lua/INSIGHT.md#research-q01)。

> **思考**：宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-lua/INSIGHT.md#research-q02)。

> **建议**：保留合并扩展并区分配置、服务器和注册错误，反证条件与代价见[Q05](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-lua/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-lua/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-php"></a>

## [dsh-lsp-php](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-php/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：已配置 DSH LSP 底座、在本地 PHP 工作区需要模型辅助代码导航的开发者。

> **亮点**：独立 PHP 包将固定服务器启动参数及语言映射接到共享 LSP 底座，减少逐项目重复接线；语言分析与协议能力归外部 server 和底座。详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-php/INSIGHT.md#research-q01)、[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-php/INSIGHT.md#research-q02)。

> **思考**：apply 任意异常都被归为命令不可用，fallback 用默认扩展映射和默认命令日志，覆盖配置后可能误导诊断或丢失自定义后缀路由；这是源码风险，未在本轮复现。详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-php/INSIGHT.md#research-q02)。

> **建议**：可让 fallback 保留解析后的路由，并按错误来源区分诊断；以默认/覆写命令、后缀与非法配置故障对照检验收益和新冲突。尚未实现。详见[Q05](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-php/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-php/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-pyright"></a>

## [dsh-lsp-pyright](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-pyright/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH Agent 中查询 Python .py 与 .pyi 的定义、引用、实现和悬浮信息。

> **亮点**：减少 Python/Pyright LSP 命令与扩展配置工作；详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-pyright/INSIGHT.md#research-q01)。

> **思考**：缺服 fallback 捕获所有初始化异常且仅保留默认映射，配置故障可误归因，自定义扩展在故障时失去路由。详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-pyright/INSIGHT.md#research-q02)。

> **建议**：保留解析后的扩展表并区分缺服/配置/注册异常，可提高诊断准确度；待验证。详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-pyright/INSIGHT.md#research-q02)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-pyright/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-ruby"></a>

## [dsh-lsp-ruby](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ruby/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：已有 Ruby/Bundler 项目的 DSH 开发者可查询 .rb 符号；合格结果需目标解释器与项目依赖一致并核对跨文件位置。

> **亮点**：把 Ruby LSP 默认命令、参数和扩展映射做成独立可覆盖的 DSH 组合包，节省重复接线；语义分析与协议仍归 ruby-lsp 和官方底座。详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ruby/INSIGHT.md#research-q02)。

> **思考**：默认全局 ruby-lsp 未自动匹配项目 Bundler 或 rbenv/asdf 选中的解释器；catch 折叠加载异常，测试的 real-server lane 可能跳过。单文件成功不能证明项目导航。详见[Q03](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ruby/INSIGHT.md#research-q03)。

> **建议**：可在启动前报告 Ruby、Gemfile、命令来源与参数的一致性，比较两版本锁定项目中的误报、归因与恢复分钟；未实现。详见[Q04](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ruby/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ruby/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-rust"></a>

## [dsh-lsp-rust](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-rust/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH 中对 .rs 文件执行定义、引用、实现、hover 查询。

> **亮点**：减少 Rust LSP 装配；不实现协议，详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-rust/INSIGHT.md#research-q01)。

> **思考**：宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-rust/INSIGHT.md#research-q02)。

> **建议**：在 fallback 保留合并扩展、区分配置/服务器异常可改善诊断；待验证。详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-rust/INSIGHT.md#research-q02)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-rust/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-swift"></a>

## [dsh-lsp-swift](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-swift/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：已有 SwiftPM 项目、Xcode 或 Swift 工具链的 DSH 开发者，可借本包少写 SourceKit 接线；项目索引仍由工具链承担。详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-swift/INSIGHT.md#research-q01)。

> **亮点**：相对手工接入 SourceKit-LSP，本包提供 DSH 中的命令、映射与组合行，减少配置重复；Swift 编译索引和 LSP 语义不属于本包实现。详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-swift/INSIGHT.md#research-q01)。

> **思考**：SourceKit 可启动不代表引用和实现可用：作者测试在 swift build 失败时跳过这两项，PATH 选错工具链也可能影响索引；不能按定义/hover 成功推断四操作完成。详见[Q03](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-swift/INSIGHT.md#research-q03)。

> **建议**：未验证方向是分开展示服务器启动、项目构建、索引就绪和各操作可用状态；用构建成败及双工具链场景比较误报和排障成本。详见[Q05](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-swift/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-swift/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713526-dsh-lsp-ts"></a>

## [dsh-lsp-ts](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ts/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

> **用途**：在 DSH 中查询 TS、TSX、JS、JSX 文件的定义、引用、实现、hover。

> **亮点**：减少 TS/JS LSP 命令和语言 id 装配；协议由共享基座实现，详见[Q01](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ts/INSIGHT.md#research-q01)。

> **思考**：宽 catch 可能误判配置故障，fallback 丢失自定义扩展；详见[Q02](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ts/INSIGHT.md#research-q02)。

> **建议**：故障分类并让fallback保留合并映射，可证伪对照及代价见[Q05](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ts/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-ts/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1323731026-root"></a>

## [dsh-memory-evolve](../../plugins/csyangwen--dsh-memory-evolve/INSIGHT.md)

[![GitHub ★ 451](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=451&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/csyangwen/dsh-memory-evolve)

> **用途**：面向多项目开发者，把长期事实、项目关键记忆与日志分轨，在DSH会话中按项目取回上下文。

> **亮点**：[Q02](../../plugins/csyangwen--dsh-memory-evolve/INSIGHT.md#research-q02) 将关键记忆的候选、确认与注入连成可读本地文件流程，并保留项目和分支标签。

> **思考**：[Q03](../../plugins/csyangwen--dsh-memory-evolve/INSIGHT.md#research-q03) 用户确认主要约束key add，其他轨有直接写入；分支无法解析时项目key全部注入，不构成严格分支隔离。

> **建议**：[Q04](../../plugins/csyangwen--dsh-memory-evolve/INSIGHT.md#research-q04) 推导分支未知时暂停scope记忆自动注入并提示状态的未验证改进；同时测错引用和漏用，若漏用损失更大则推翻。

[查看完整分析](../../plugins/csyangwen--dsh-memory-evolve/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334569498-root"></a>

## [dsh-mermaid](../../plugins/aks1st--dsh-mermaid/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dsh-mermaid) [![npm 30d 4,196](https://img.shields.io/static/v1?label=npm+30d&message=4%2C196&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mermaid) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mermaid)

> **用途**：帮助开发者/研究者就地阅读流程与架构图，保留源码核对，渲染不等业务逻辑正确。

> **亮点**：把成熟Mermaid布局接入DSH定格消息，补视口排队、主题、放大与源码回退，减少复制到外部站点；上游布局和消毒不属插件原创。详见[Q02](../../plugins/aks1st--dsh-mermaid/INSIGHT.md#research-q02)。

> **思考**：Promise超时不能中断主线程CPU，离视口只丢结果；发送AI修复会写全局首个输入框并模拟Enter，可能覆盖已有草稿，均为静态边界未复现。strict不能代替完整安全验收。详见[Q02](../../plugins/aks1st--dsh-mermaid/INSIGHT.md#research-q02)。

> **建议**：可探讨可终止渲染隔离和绑定会话的可预览修复草稿，比较病态图响应及原草稿保留；受DOM依赖与通信开销约束，未验证。详见[Q05](../../plugins/aks1st--dsh-mermaid/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aks1st--dsh-mermaid/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1423488109-root"></a>

## [dsh-model-everything](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md)

[![npm 30d 1,186](https://img.shields.io/static/v1?label=npm+30d&message=1%2C186&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-everything) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-everything)

> **用途**：面向能抽取有限模型的架构与重构审查者，用可复算模型报告回查行为断言。

> **亮点**：[Q03](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md#research-q03) 核心增量是将有限模型验证、版本哈希和重构对照组织为宿主内可归档的审查交付；成熟搜索算法及哈希不作原创归属，代码到模型的忠实性仍由人负责。

> **思考**：[Q03](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md#research-q03) 模型通过能否说明实际代码通过？引擎明确不建立抽象，漏抽一个实现事件便能使模型结论失去代表性；应把报告当抽象范围内的证据，不能替代实现验收。

> **建议**：[Q05](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md#research-q05) 未验证假设是把每个转换的代码出处与独立摘要作为抽取交接清单，在运行验证前确认覆盖，以减少模型和实现脱节；五个已知缺陷协议对照漏检与人工时间，未改善即停止。

[查看完整分析](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1415863200-root"></a>

## [dsh-model-failover](../../plugins/airisey--dsh-model-failover/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Airisey/dsh-model-failover)

> **用途**：多模型 DSH 用户在配额和短时故障下保持可回滚任务推进，验收最终任务而非吐字。

> **亮点**：以可见输出提交点控制切换，并将会话×模板隔离纳入恢复队列，相比手工 provider 切换有明确流程增量。见 [Q01](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q01)、[Q02](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q02)。

> **思考**：可见输出提交不等于业务事务完成，轮级自动继续可能重做非幂等动作；有限重试也扩大总预算。没有复现重复写入，保留风险性质。见 [Q03](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q03)。

> **建议**：未验证的提交状态与工具副作用确认联动，可能改善安全恢复；四处故障注入比较重复写入和合格率，若牺牲恢复而无收益即否定。见 [Q05](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/airisey--dsh-model-failover/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344714334-root"></a>

## [dsh-modernize-code](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md)



> **用途**：规划遗留代码迁移前，先收集环境缺口与静态热点，再制定分阶段路线图。

> **亮点**：把五问六检与热点线索纳入可重复入口，详见[Q01](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md#research-q01)。

> **思考**：浅层检查的 READY 与固定权重热点不能当迁移安全结论；out 文件写入范围也须约束，详见[Q02](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md#research-q02)、[Q03](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md#research-q03)。

> **建议**：将实际构建/测试证据及人工热点标注接入报告、限制 out 到指定目录，可提升决策可靠性；待验证，详见[Q02](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md#research-q02)、[Q03](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334119885-root"></a>

## [dsh-multi-folder](../../plugins/angeloszou--dsh-multi-folder/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngelosZou/dsh-multi-folder) [![npm 30d 2,056](https://img.shields.io/static/v1?label=npm+30d&message=2%2C056&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-multi-folder) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-multi-folder)

> **用途**：面向源码、测试和文档分布多个仓的DSH用户，保持主cwd并把每次原生写/执行定向一个受权副根，最终仍逐仓验收真实变更。

> **亮点**：不改主cwd、不加模型工具，通过原工具重定根、后台jobs适配和副根@发现提供跨仓流程。详见[Q01](../../plugins/angeloszou--dsh-multi-folder/INSIGHT.md#research-q01)。

> **思考**：有损workspace文件名可碰撞，保存失败内存仍生效；用户专管及native-only宣称还依宿主认证/根布局和缺服务降级条件。详见[Q03](../../plugins/angeloszou--dsh-multi-folder/INSIGHT.md#research-q03)。

> **建议**：稳定workspace身份和有revision的目录授权凭据，CAS保存后广播并约束host UI能力；以碰撞/失败/远程/链接反例证伪，未验证。详见[Q07](../../plugins/angeloszou--dsh-multi-folder/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/angeloszou--dsh-multi-folder/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1337916824-root"></a>

## [dsh-mysql](../../plugins/1321928757--dsh-mysql/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1321928757/dsh-mysql) [![npm 30d 30](https://img.shields.io/static/v1?label=npm+30d&message=30&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mysql) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mysql)

> **用途**：面向需要在DSH中读取MySQL schema和辅助查询的开发者，多源会话每次明确一个目标；重要库需要数据库自身最小权限与恢复方案。

> **亮点**：把会话多源选择、schema先行、四类工具和独立行写/DDL权限接到动态上下文，减少手工搬运；不是SQL解析器或数据库隔离层。详见[Q02](../../plugins/1321928757--dsh-mysql/INSIGHT.md#research-q02)。

> **思考**：只读按前缀分类，regex表名提取不覆盖全部语法且DML丢库前缀；2000行在全量读取后截断，不限服务器或内存。最小权限、TLS和网关身份仍需独立核对，未执行绕过。详见[Q03](../../plugins/1321928757--dsh-mysql/INSIGHT.md#research-q03)。

> **建议**：可探索AST允许集合、库表操作能力句柄、最小权限账户与服务端预算，返回实际对象/取消收据；未实现。详见[Q06](../../plugins/1321928757--dsh-mysql/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/1321928757--dsh-mysql/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335992154-root"></a>

## [dsh-openai-oauth](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdonisSheldon/dsh-openai-oauth) [![npm 30d 770](https://img.shields.io/static/v1?label=npm+30d&message=770&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openai-oauth) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openai-oauth)

> **用途**：适合希望继续使用DSH会话、工具及审批而把模型路由接到ChatGPT OAuth的本机用户。原有办法是单独Codex CLI/外部Agent或常规API Key适配；当前在DSH LLM注册openai-codex adapter，提供浏览器PKCE和设备代码两种显式登录、设置页与headless命令，不启动Codex App Server或外部Agent进程。交付是同DSH模型消息/工具调用及可恢复历史，不是获得额外账号权益或绕过额度。

> **亮点**：在DSH原生LLM路由内整合双方式OAuth、本机凭据与流/replay适配，不启动外部Agent；派生Harness转换归属上游，不是新OAuth协议。详见[Q01](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q01)。

> **思考**：静态模型表/零cost不证明资格或免费；明文凭据与本机账户信任、退出/持久化交错、无总deadline和非法参数退{}限制无损/可靠性主张。详见[Q03](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q03)。

> **建议**：可探索认证世代与持久化退出栅栏、合并signal总预算和严格工具JSON，按假依赖交错矩阵证伪；未实现。详见[Q05](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1409893258-root"></a>

## [dsh-ops](../../plugins/t-auto--dsh-ops/INSIGHT.md)

[![GitHub ★ 4,272](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C272&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-ops) [![npm 30d 31,257](https://img.shields.io/static/v1?label=npm+30d&message=31%2C257&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops)

> **用途**：面向反复读写大量文件或文档的DSH编码用户，目标是在可核对交付不变时减少冗长工具结果和模型往返。原办法是原生工具及模型自行写PTC脚本；合格结果必须同时保留完整文件修改、可追溯行号和错误，而不是单看输出token变少。README称其减少token是目标及作者实验，本轮不继承为已验证收益。

> **亮点**：相对把全部工具schema常驻，渐进发现让常用面较小；相对只有字符串截断，结构化结果与session生命周期提供更明确的使用边界。具体贡献是紧凑工具面和替代准备检查的组合，而非工具数量多。是否少调用还取决于模型能否正确发现能力及紧凑结果是否保留足够信息。 依据[Q03](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q03)。

> **思考**：核心质疑是减少工具描述与结果内容会否增加漏读、重试或错误修改。源码的readiness只证明替代定义与归属可见，不证明与每个官方工具语义等价；结果缓存物理清理失败会留下临时文件，源码仅警告且不自动重试。安装dry-run同样只作静态路径检查，不能替代实际宿主兼容。 依据[Q04](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q04)。

> **建议**：未验证假设是为渐进工具加载加入“任务完整性优先”的回退：一旦紧凑结果缺少所需区域就回原生完整读取，可能减少节省token却多次返工的问题。固定文件/文档语料和模型，对比原生、OPS以及带回退策略，记录合格交付率、总token、重读和人工修复。若总成本无下降或漏改更多，则不应隐藏原生工具。 依据[Q08](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/t-auto--dsh-ops/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1366089972-workspace-plugins-dsh-organism"></a>

## [dsh-organism](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：多插件 DSH 环境需要能力导航和故障观察；合格性依赖宿主事件、权限和任务对照。

> **亮点**：在 DSH 基础工具之上叠加器官视图、体征账本、代理调用与按需显影；规则和命名启发式不等于语义理解。详见[Q02](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md#research-q02)。

> **思考**：body_law 的最高指令是提示与版本盖章，未见身份授权或违反规则的执行阻断；反射能调用真实工具，需宿主权限兜底。详见[Q03](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md#research-q03)。

> **建议**：若将器官契约、故障体征和最小权限降级路径联合验证，可能减少错路由和排障；须做固定任务对照，尚未实现效果。详见[Q05](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1133901637-integrations-dsh-plugin"></a>

## [dsh-ouroboros 配置桥](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md)

[![GitHub ★ 6,272](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C272&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)

> **用途**：面向已决定使用Ouroboros规格先行流程、希望从DSH对话调用而非切到独立CLI的开发者。合格结果不是工具列表出现，而是访谈生成Seed并能交给执行/评估流程。简单替代是在profile手写MCP stdio配置，或直接用Ouroboros CLI。这个组件只是配置bundle，不把上游引擎贡献算作桥接原创。

> **亮点**：[Q03](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q03)说明这是可安装的MCP配置桥，增量是合理默认值与显式凭据边界，核心规格/执行算法归上游。相对手写等效配置便利有限，不能把整套引擎能力当此组件原创。

> **思考**：[Q04](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q04)揭示工具列出不等于访谈可用，且uvx不固定引擎版本，使本轮固定配置证据无法完整约束实际执行。应先解决版本锁与后端可调用性，再讨论长任务采用。

> **建议**：[Q08](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q08)提出未验证的配置锁与分段能力预检，在缺uv、缺后端和部分可用三类环境测错误定位和放行率，反证是预检漂移或维护负担超出收益。

[查看完整分析](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335155355-root"></a>

## [dsh-pentest](../../plugins/howmp--dsh-pentest/INSIGHT.md)

[![GitHub ★ 609](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=609&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/howmp/dsh-pentest) [![npm 30d 2,144](https://img.shields.io/static/v1?label=npm+30d&message=2%2C144&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@howmp/dsh-pentest) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@howmp/dsh-pentest)

> **用途**：授权安全团队需要交接目标、观察、可复现步骤与关联资产，不只是展示扫描工具输出。

> **亮点**：[Q01](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q01)以领域图组织记录并检查引用、要求可复现步骤；[Q02](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q02)子Agent可向活跃父会话存储提交，减少纯聊天交接。

> **思考**：[Q02](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q02)父图不含所有子提交、批量写用尽力清理而非底层原子事务，重置目标清旧图；[Q03](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q03)归档后维护负担需用户承担。

> **建议**：可以推导未验证的提交回执，把子提交的稳定ID、父intent、存储版本和完整记录摘要返回父编排者，父图显示独立“已存储但未入父日志”状态，并提供只读回查。相对伪造父日志事件，增量是让两种真相边界可见，不让UI空缺被误解为子任务没交付。

[查看完整分析](../../plugins/howmp--dsh-pentest/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1374274469-root"></a>

## [dsh-plugin-adapter](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1624318455/dsh-plugin-adapter)

> **用途**：适合已有 DSH、需要在同一会话选择 Zen 匿名模型的开发者，以有效响应及工具事件为交付。

> **亮点**：相对手填兼容 provider，增加目录过滤、事件转换与上下文/输出预算协调；协议能力继承 pi-ai，仓库注明 fork。见 [Q01](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q01)、[Q02](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q02)。

> **思考**：默认路径可能启动 Bun 子进程和回环端口，与无额外进程的作者描述不一致；代理失败还可能直连。缺 Bun 的可用性需要验证。见 [Q03](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q03)。

> **建议**：未验证的分层就绪状态与显式降级策略，可能减少误重试；以四种故障比较诊断时间和额外流量，收益不显著即否定。见 [Q05](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336720864-root"></a>

## [dsh-plugin-console](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AlexYin-Tongji/dsh-plugin-console) [![npm 30d 1,111](https://img.shields.io/static/v1?label=npm+30d&message=1%2C111&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-console) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-console)

> **用途**：本地维护者集中核对目录来源、精确版本及活动profile，需区分已装与运行中状态。

> **亮点**：把来源核验、明确确认、精确安装、完整profile兼容检查及恢复串为管理闭环，增量在流程而非新包管理算法。详见[Q01](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md#research-q01)与[Q02](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md#research-q02)。

> **思考**：canary改临时HOME但仍普通用户进程并继承多项环境变量，不是OS沙箱；真实profile变更与外部初始化副作用也非原子回滚。详见[Q02](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md#research-q02)。

> **建议**：可探讨最小能力变更收据，列环境/目录/网络与恢复覆盖，再以白名单或OS约束缩小canary能力；兼容与隐私成本未验证。详见[Q05](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336663986-root"></a>

## [dsh-plugin-gate](../../plugins/863683348--dsh-plugin-gate/INSIGHT.md)

[![npm 30d 1,494](https://img.shields.io/static/v1?label=npm+30d&message=1%2C494&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-gate) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-gate)

> **用途**：安装陌生插件前检查源码与依赖风险，或在删除前提示目标范围。

> **亮点**：把静态签名、OSV 查询和基线差分整合为 Agent 可调用工具；详见[Q01](../../plugins/863683348--dsh-plugin-gate/INSIGHT.md#research-q01)。

> **思考**：扫描截断/读取或 OSV 失败不一定改变 PASS；guard 不是执行钩子，“绝不写文件”不涵盖 diff/report 可选写入。详见[Q02](../../plugins/863683348--dsh-plugin-gate/INSIGHT.md#research-q02)、[Q03](../../plugins/863683348--dsh-plugin-gate/INSIGHT.md#research-q03)。

> **建议**：将覆盖率不全升为 WARN、把 destructive guard 接入宿主执行层，可减少误信 PASS 和漏拦截；待验证。详见[Q02](../../plugins/863683348--dsh-plugin-gate/INSIGHT.md#research-q02)、[Q03](../../plugins/863683348--dsh-plugin-gate/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/863683348--dsh-plugin-gate/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1397817235-root"></a>

## [dsh-plugin-ide-hub](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/121212165/dsh-plugin-ide-hub) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-ide-hub)

> **用途**：给多IDE用户定位旧任务、维护共享规则和查看本地记录，不能直接迁移厂商额度。

> **亮点**：把分散会话/规则与手填额度计划放到同一交接入口，保留用户规则本体；价值主要是适配和流程组织。[Q01](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q01)、[Q02](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q02)

> **思考**：运行导入依赖只列为devDependencies，扫描用stat跟随链接，计量字段依赖私有格式，批量写无事务；静态风险尚未等同真实失败。[Q03](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q03)、[Q04](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q04)

> **建议**：未验证方向是版本化适配器输出覆盖与计量可信度，加内容摘要清单确认批写；用跨版本日志和中断样本衡量错误暴露与恢复质量。[Q06](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1378350155-root"></a>

## [dsh-plugin-preflight](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AphyTOT/dsh-plugin-preflight)

> **用途**：插件作者在提交或发布前反复核对结构规则，可把报告接入CI；绿色结果只覆盖已实现检查。[Q01](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q01)

> **亮点**：把DSH特有组合与预发布peer约束变成可重复结构报告，并在不知道宿主版本时限制判断，避免猜测兼容；增量是提交前诊断而非功能验收。[Q01](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q01) [Q02](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q02)

> **思考**：正则外形检查和简化semver不能证明宿主组合正确；宿主版本无法解析时部分规则静默，工具注册失败也静默，用户可能误读无错误为完整通过。[Q03](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q03)

> **建议**：可增加已检查/未知的覆盖报告，并以固定官方解析器差分核对边界；若提示不能促成行动或依赖破坏离线诊断，应收窄。未验证。[Q04](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1399011094-root"></a>

## [dsh-plugin-task-forge](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/121212165/dsh-plugin-task-forge)

> **用途**：给多AI窗口交接复杂需求的人明确目标/验收/决策和持有版本。

> **亮点**：把自由文本交接改成版本化任务和缺口闭环，便于指出谁读过哪版；READY自报仍不证明语义理解或字节一致。[Q01](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md#research-q01)、[Q02](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md#research-q02)

> **思考**：缺口段问题不影响parse ok；NEED-INPUT且空gaps也可能passing；全局pending可干扰无关会话，定义的queue没有在主要写路径使用，任务/ledger非事务。[Q03](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md#research-q03)、[Q04](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md#research-q04)

> **建议**：未验证方向是ID/版本/正文摘要ACK、逐验收语义映射与严格READY闸门，加项目会话作用域和版本CAS；用错文/空缺口/并发矩阵检验。[Q06](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422943787-root"></a>

## [dsh-plugin-veriscope](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-veriscope)

> **用途**：维护者交付前核已有评测与阈值，避免旧PASS被无条件复用。详见[Q01](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q01)。

> **亮点**：把阈值判定、缺证据保留和当前性回执接合，减少只看旧均值的误读。详见[Q01](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q01)。

> **思考**：门禁仅消费所提供分数，不证明样本总体/评分真实，本地摘要不抵抗整体重写，child kill不等进程树回收。详见[Q03](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q03)、[Q05](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q05)。

> **建议**：研究独立签名评测清单/总体计数及可恢复受管ID、进程组强杀，比较错放行与恢复。当前未验证。详见[Q06](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344714177-root"></a>

## [dsh-pr-description](../../plugins/988hj7tczd-oss--dsh-pr-description/INSIGHT.md)

[![npm 30d 368](https://img.shields.io/static/v1?label=npm+30d&message=368&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pr-description) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pr-description)

> **用途**：适合已有分支提交、需要快速整理可编辑 PR 草稿的开发者；合格结果须正确 base 和人工核事实。

> **亮点**：将 Git 差异事实、有限符号与 breaking 规则、五段模板、可选确认和 gh 动作连接成 DSH 工具；减少统计排版，未实现模型理解业务动机。详见[Q02](../../plugins/988hj7tczd-oss--dsh-pr-description/INSIGHT.md#research-q02)。

> **思考**：自动 base 可选错；正则符号与模板不知真实测试。输出经 Node fs 按用户路径直接写，未见本工具内 containment；confirm 只预览标题与路径，openPr 是实际远端创建。详见[Q03](../../plugins/988hj7tczd-oss--dsh-pr-description/INSIGHT.md#research-q03)。

> **建议**：可让描述每段引用 diff 事实，无法由 diff 证明的动机与测试保留待填写，并用重命名、多语言和未跑测试样本比较错误与改写时间；未实现。详见[Q05](../../plugins/988hj7tczd-oss--dsh-pr-description/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-pr-description/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334481905-plugin"></a>

## [dsh-progress-viz (plugin)](../../plugins/2008924--dsh-progress-viz--plugin/INSIGHT.md)



> **用途**：headless 长任务需要了解阶段与最近动作，插件向同目录看板提供事件投影。详见[Q01](../../plugins/2008924--dsh-progress-viz--plugin/INSIGHT.md#research-q01)。

> **亮点**：插件把噪音过滤前移到 DSH 事件源，减少看板直接读会话文件的依赖。详见[Q01](../../plugins/2008924--dsh-progress-viz--plugin/INSIGHT.md#research-q01)。

> **思考**：空闲 finished 状态不可恢复，末项未完成时也显示 100%，费用字段有重复口径风险。详见[Q02](../../plugins/2008924--dsh-progress-viz--plugin/INSIGHT.md#research-q02)和[Q03](../../plugins/2008924--dsh-progress-viz--plugin/INSIGHT.md#research-q03)。

> **建议**：与独立 zstd 解析并行对照延迟、资源和终态准确率，若会话恢复误判或误导超过收益则收窄或修正直写增量。详见[Q05](../../plugins/2008924--dsh-progress-viz--plugin/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2008924--dsh-progress-viz--plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339316901-root"></a>

## [dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 28](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=28&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/00080000/dsh-project-memory) [![npm 30d 5,047](https://img.shields.io/static/v1?label=npm+30d&message=5%2C047&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

> **用途**：同一代码项目跨会话续接，价值应按正确完成任务而非条目数量衡量。见[Q01](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q01)。

> **亮点**：把任务、文件索引与经验召回连为跨会话开发辅助流程，减少重新定位的潜在步骤。见[Q01](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q01)、[Q02](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q02)。

> **思考**：exact是占位，Saved不证明已落盘；相关性和作用域也不能保证经验仍正确。见[Q03](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q03)。

> **建议**：让接受/待持久化/读回确认与陈旧来源状态可见，能否减少误信及总恢复成本须对照。见[Q06](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/00080000--dsh-project-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1353726715-root"></a>

## [dsh-qa-suite-n23](../../plugins/all3ncn--dsh-qa-suite-n23/INSIGHT.md)



> **用途**：TS 开发者可在模型编辑后读 tsc 诊断，并用 /code-review 召集本地审查；前者是编译器结果，后者是待复核问题候选。

> **亮点**：吸收两份上游的 TS 诊断与模型审查流程，提供一个 host 包的工具和命令入口；未见诊断自动约束审查放行的共同机制。详见[Q02](../../plugins/all3ncn--dsh-qa-suite-n23/INSIGHT.md#research-q02)。

> **思考**：code_check 优先全局最近缓存项目而非调用会话 cwd，可能返回别的项目诊断；审查阈值只是 Agent 提示，不是校准准确率或程序验收。详见[Q03](../../plugins/all3ncn--dsh-qa-suite-n23/INSIGHT.md#research-q03)。

> **建议**：可按会话绑定项目与诊断版本，并要求审查意见引用同版本证据；以双项目交错和缺陷注入对照错根率、接受率及成本。未实现。详见[Q05](../../plugins/all3ncn--dsh-qa-suite-n23/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/all3ncn--dsh-qa-suite-n23/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1423215373-root"></a>

## [dsh-reaper](../../plugins/11111353535--dsh-reaper/INSIGHT.md)



> **用途**：维护者诊断遗留dev服务器占端口，需核完整影响和可恢复服务。

> **亮点**：将归属理由、后代影响预览和端口回查集中，优于仅按端口kill，但非进程身份或会话授权保证。详见[Q01](../../plugins/11111353535--dsh-reaper/INSIGHT.md#research-q01)与[Q02](../../plugins/11111353535--dsh-reaper/INSIGHT.md#research-q02)。

> **思考**：后代漏保护端口、信号前无身份重核，free_port不强制归属，取消和IPv4 TCP探测不足以证明安全回收。详见[Q02](../../plugins/11111353535--dsh-reaper/INSIGHT.md#research-q02)。

> **建议**：可探讨身份/计划hash绑定和精确端点回收收据，逐信号重核保护/取消并保留unknown，跨OS成本未验证。详见[Q05](../../plugins/11111353535--dsh-reaper/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/11111353535--dsh-reaper/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336856993-root"></a>

## [dsh-redteam-model](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md)

[![GitHub ★ 758](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=758&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SeaOf0/dsh-redteam-model)

> **用途**：已有明确授权与专业工具环境的安全研究人员，可关注合集的管理及结构/语义分工设计。

> **亮点**：[Q01](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q01) 与 [Q02](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q02)支持的贡献是将安全研究资产及多插件管理收拢，并记录变更状态；[Q03](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q03)结构与manual分工可借鉴，不能算新模型或已验证安全结果。

> **思考**：[Q03](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q03)说明pass只由结构checks决定，manual语义未因此通过；[Q02](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q02)取消不终止运行中的变更，中断failed也非回滚。根管理和流程文本不能代替全套授权及安全结论验收。

> **建议**：[Q05](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q05) 提出复用已有pass/manual字段的分离呈现假设，先排除现UI已有，再用结构齐全但结论错误的离线报告比较误放行；不能改善就不推广。

[查看完整分析](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339262076-root"></a>

## [dsh-repeat-stop](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-repeat-stop)

> **用途**：为反复原样重试工具的 Agent 提供执行前保险丝，合格结果是阻断无效重复并保留合法探索；正常轮询需单独配置。详见[Q01](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md#research-q01)。

> **亮点**：把原样重复检测接入工具 guard，默认允许六次并拒绝第七次，同时按 Agent 隔离状态并规范化对象键；属于有用的局部机制组合，官方提醒器对照仅为作者声明。详见[Q03](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md#research-q03)。

> **思考**：跨步计数能否成立取决于宿主消息窗口。pre-step 遇到任何 user 消息便重置，若每步含历史用户消息就可能削弱保护；这是静态条件风险，未做故障复现。精确键还无法识别交替与改参循环。详见[Q04](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md#research-q04)。

> **建议**：可探讨让工具结果声明进展，在精确重复规则旁区分合法等待和无进展失败；先用固定事件反例比较误拦及漏拦，再评估状态契约的维护代价。当前未验证，不属于已有能力。详见[Q08](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1424433303-root"></a>

## [dsh-restart-dock](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md)



> **用途**：Windows 上调试 DSH 插件的开发者需要频繁区分客户端刷新和 Host 重启；基线是关窗口、找快捷方式再打开。合格结果是只在用户二次确认后重启明确的 DSH 进程树，页面能区分失败、取消和恢复，正在执行的任务不会被误认为已保存。 详见[Q01](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md#research-q01)。

> **亮点**：相对手工重开，它把“只刷新 client”和“重启 Host”分成明确按钮，并加入包重建门禁、倒计时撤回和重启报告。贡献是开发交互与安全接线，不是跨平台进程管理；Windows-only 和强制停止限制了普适性。 详见[Q03](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md#research-q03)。

> **思考**：关键风险是重启属于破坏性副作用。自定义头/CORS 防跨站不等于完整鉴权，同源受害页面或宿主路由暴露仍需核对；helper 若受 job object 牵连可能无法拉起。插件不等本轮结束、不自动续话，未保存状态会被中断。 详见[Q04](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md#research-q04)。

> **建议**：未验证假设是把当前任务忙闲状态接入重启坞，只在会话已落盘且无活跃工具时启用“安全重启”，可减少中断事故。最小实验注入活跃/空闲/写盘三种状态各 20 次，比较当前按钮与门控版的误中断率、恢复成功率和等待时间；若忙闲信号漏报一次破坏性中断即不应自动启用。 详见[Q08](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422176522-root"></a>

## [dsh-restart-planner](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-restart-planner)

> **用途**：代理安装或修改 Host 插件后需要重启才能继续，但当前进程不能杀死自己；基线是让用户手工重开并再次提示继续。合格结果是本轮回复先送达、会话落盘、明确目标被重拉、状态可审计，且自动继续只在新进程接受 prompt 后清标记。 详见[Q01](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md#research-q01)。

> **亮点**：相对人工重启，它把进程死亡点放到回复与写盘之后，并用外部 helper 与持久恢复标记跨越宿主生命周期；比按钮插件更适合 agent 自主流程。优势依赖目标解析和会话静默确实可靠，且“继续”提示不等于原任务状态自动恢复。 详见[Q03](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md#research-q03)。

> **思考**：最关键质疑是强制停止前的“静默”只能近似落盘完整，最后写入仍可能丢失；自动继续可能在环境尚未完全恢复时重复动作。默认 confirm=false 与 resume=true 对无人值守有利，却扩大误排程后果；重复 schedule 覆盖旧排程而不排队。 详见[Q04](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md#research-q04)。

> **建议**：未验证假设是给恢复标记增加原任务幂等键与上一步完成摘要，可把“继续一句话”升级为可判重的恢复协议。最小实验让 20 个含外部写入的任务在四个阶段重启，比较当前 prompt 与幂等恢复的重复副作用、丢步骤率和人工接管次数；任一重复写远端即否定自动恢复。 详见[Q08](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334586481-root"></a>

## [dsh-routing-suite](../../plugins/yjh051108--dsh-routing-suite/INSIGHT.md)

[![GitHub ★ 6,997](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C997&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yjh051108/dsh-routing-suite)

> **用途**：面向反复调试DSH插件、调节任务persona并维护较长开发清单的高级用户。原办法是重启宿主、手工复制预设及聊天中打卡；合格结果是插件正确加载、当前路由可解释、任务按明确验收完成。它是三个组件的套装，不能把根包的收录理解为三个组件已经兼容当前宿主。

> **亮点**：相对单纯提示词，分级模块为任务编辑与锁定提供结构约束；相对每次重启开发，注入器试图缩短调试链。组合也增加了装配和状态责任，不能把三个部分的声明相加成整体收益。核心增量是开发时热装配与规格化交接，路由优于原生行为仍主要来自作者实验。 依据[Q03](../../plugins/yjh051108--dsh-routing-suite/INSIGHT.md#research-q03)。

> **思考**：核心限制有两项。README声明目标宿主<0.2.0，注入器实际访问loader.internal.loadCache并用registry.delete/plugin重建fiber，所以不能从目录收录推断当前0.2.x兼容。持久化调用链现已核清：mode-state.saveState捕获写错返回false，而index的setState不传播返回值；tools的revise_do调用saveState后直接返回ok:true，lock_stage也不检查保存结果。因此写失败时至少部分工具可能给出成功文本而磁盘仍旧，属于源码可见的错误传播缺口，尚未进行权限故障注入确认表现。不能把内存迁移和回执称为持久成功。 依据[Q04](../../plugins/yjh051108--dsh-routing-suite/INSIGHT.md#research-q04)。

> **建议**：未验证假设是将分级状态提交与工具成功结果绑定，磁盘失败时拒绝宣告阶段锁定，可以避免内存状态与重启后清单分歧。用同一清单分别注入写权限拒绝、截断JSON和热重载，检查用户看到的阶段及重载后的状态；若只能靠人工重建或工具仍报告成功，则假设未实现。 依据[Q08](../../plugins/yjh051108--dsh-routing-suite/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/yjh051108--dsh-routing-suite/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1372976273-root"></a>

## [dsh-session-diff](../../plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2002XiaoYu/dsh-session-diff)

> **用途**：给同时处理多个会话的开发者一个会话级审查入口，以保留的write/edit事件和当前文件形成差异视图；不代替全仓库验收。

> **亮点**：把会话工具hunk、逆序还原与侧栏路由组合为会话级审查视图，并仅接管存在会话改动的文件。相对Git提供不同归因入口，Myers与宿主格式不属原创贡献；没有同条件审查收益对照。详见[Q03](../../plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md#research-q03)。

> **思考**：可信会话归因仍依赖启发式基线。后缀路径、重复片段和未校验跨页版本可能造成歧义，已发现的降级提示也不覆盖所有错配条件；均为源码推断，未复现。不能据此证明修改完整性。详见[Q04](../../plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md#research-q04)。

> **建议**：可进一步探讨版本绑定会话差异，用规范路径、事件前后版本与一致分页取代部分启发式还原；新增宿主接口和存储负担，须与当前实现及Git对照错归因与资源成本，未验证。详见[Q08](../../plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1393980674-root"></a>

## [dsh-sidebar-git-graph](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AFunDog/dsh-sidebar-git-graph)

> **用途**：开发者在多工作树会话中确认仓库、分支和改动归属；合格结果需交代选择来源、截断和本地新鲜度。

> **亮点**：把Git图谱、工作树与差异接到DSH会话，在手选、标签和历史提示间明确优先级并显示回退原因；贡献属于可解释的接线与信息组织，不是新的Git机制。详见[Q03](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md#research-q03)。

> **思考**：只读不能保证授权隔离或快照一致性。无工作区候选时存在claimed-unfenced退路，图谱与改动独立读取可能跨时点；这些是静态边界，未作越权或竞态复现。详见[Q04](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md#research-q04)。

> **建议**：可探索共同读取收据与状态变化提示，以显式呈现跨请求不一致；需比较误判、误报和尾延迟，当前未实现，不计为已有创新。详见[Q08](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713683-root"></a>

## [dsh-skill-creator](../../plugins/988hj7tczd-oss--dsh-skill-creator/INSIGHT.md)

[![npm 30d 762](https://img.shields.io/static/v1?label=npm+30d&message=762&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-creator) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-creator)

> **用途**：把已有工作流固化为 DSH SKILL.md 并在会话中分发或使用。

> **亮点**：提供从工作流描述到 SKILL.md、校验、ZIP 分发和目录挂载的一站式入口；详见[Q01](../../plugins/988hj7tczd-oss--dsh-skill-creator/INSIGHT.md#research-q01)。

> **思考**：fromSession 只改变 sessionNote，不改变草稿；ZIP 对所有文件做 UTF-8 解码/重编码，二进制资源不保真。详见[Q02](../../plugins/988hj7tczd-oss--dsh-skill-creator/INSIGHT.md#research-q02)、[Q03](../../plugins/988hj7tczd-oss--dsh-skill-creator/INSIGHT.md#research-q03)。

> **建议**：让会话摘要显式进入 dry-run 审阅后再生成，并按原字节打包、校验哈希，可提高可信度；待验证。详见[Q02](../../plugins/988hj7tczd-oss--dsh-skill-creator/INSIGHT.md#research-q02)、[Q03](../../plugins/988hj7tczd-oss--dsh-skill-creator/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-skill-creator/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422359117-root"></a>

## [dsh-slipway](../../plugins/7gzgn--dsh-slipway/INSIGHT.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-slipway)

> **用途**：重复发布 DSH 插件的维护者需要把建仓、逐文件上传、市场登记 PR 和线上回验串成一次可审计交付；基线是 gh/API 脚本加人工核对。合格结果是目标完全显式、敏感信息未上传、远端文件逐字节一致、PR 幂等且每个副作用可追踪。 详见[Q01](../../plugins/7gzgn--dsh-slipway/INSIGHT.md#research-q01)。

> **亮点**：相对零散脚本，它把发布前阻断、远端幂等和发布后字节回验放在同一事务叙事中，减少漏步骤；但没有真正原子事务，仓库上传成功而市场 PR 失败会留下部分完成状态。仅支持 GitHub contents API，不处理 npm、GitLab 或大文件。 详见[Q03](../../plugins/7gzgn--dsh-slipway/INSIGHT.md#research-q03)。

> **思考**：核心质疑是多阶段远端副作用失败后的恢复是否足够。幂等查询可减少重复仓库/PR，却不能回滚已上传文件、错误 topic 或已公开敏感内容；密钥扫描是模式启发式，不能证明无秘密。PAT repo 权限很大，错误目标参数的后果高。 详见[Q04](../../plugins/7gzgn--dsh-slipway/INSIGHT.md#research-q04)。

> **建议**：未验证假设是为每次发布生成不可变 manifest 并在远端写入批次标识，可在部分失败后精确续跑或补偿，而不依赖当前目录重算。最小故障注入在五阶段各中断 10 次，比较当前幂等与 manifest 续跑的重复提交、孤儿分支、人工判断步骤和最终字节一致率；出现错误覆盖即否定。 详见[Q08](../../plugins/7gzgn--dsh-slipway/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/7gzgn--dsh-slipway/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1412896722-root"></a>

## [dsh-snapshot-manager](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md)

[![npm 30d 1,088](https://img.shields.io/static/v1?label=npm+30d&message=1%2C088&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-snapshot-manager) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-snapshot-manager)

> **用途**：长会话多轮改代码后结果不对，开发者希望回到某轮提问前的文件与对话；基线是 Git checkout/stash 加手工新会话。合格结果是预览精确列出恢复/删除、只改工作区内目标、快照链完整、文件恢复可撤销、对话 fork 不覆盖原会话，排除项被明确告知。 详见[Q01](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q01)。

> **亮点**：相对 Git，它覆盖未跟踪文件和对话时间点，并把文件恢复与会话 fork 放在同一 UI；预览令牌、叶子删除、链完整性拒绝和撤销点降低误回滚。它不保存 .git 状态、权限/可执行位/mtime，session scope journal 也漏掉 shell/build/subagent 修改。 详见[Q03](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q03)。

> **思考**：核心质疑是用户是否误解“快照”为完整工作区。默认排除、8MiB上限、符号链接、.git和元数据都不回滚；session-only 范围只认三个编辑工具，可能留下关联修改。全量 restore 会删除快照后新增文件，若 cwd/realpath 判定或链损坏处理出错后果严重。 运行态双源检查也有明确边界：controller.list不可用且没有已见事件状态时返回null，restore只拒绝true，故“未知”会放行；不能宣称无法确认时必定阻断。工作区队列是当前服务内存队列，不是跨进程文件锁，外部编辑或另一个进程不受该队列保护。 [Q04](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q04)

> **建议**：未验证假设是把排除项、Git状态和元数据做成独立不可恢复清单，并在风险超过阈值时阻止全量回滚，可显著减少错误安全感。最小实验构造50个含大文件、symlink、权限、git index、shell改动的工作区，比较当前提示与风险门禁的误回滚和人工发现率；仍有未提示数据损失即否定。 详见[Q08](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1412897663-root"></a>

## [dsh-spring-admin-kit](../../plugins/aaalenwow--dsh-spring-admin-kit/INSIGHT.md)



> **用途**：特定Java后台栈开发者复用步骤与检查单，合格交付必须通过实际模板/数据库验收。

> **亮点**：把Excel三件套与模板冲突经验变成可发现技能，减少临时提示与拷贝遗漏；不是运行时代码生成服务。参见[Q01](../../plugins/aaalenwow--dsh-spring-admin-kit/INSIGHT.md#research-q01)。

> **思考**：导入示例catch异常返回字符串且插入不更新已有键map，事务注解不能保证整批回滚；提示式守卫也不强制拦截。参见[Q02](../../plugins/aaalenwow--dsh-spring-admin-kit/INSIGHT.md#research-q02)。

> **建议**：未验证假设为技能携带项目契约与故障验收样例，比较纯提示生成的部分提交/重复键/模板失败及复核负担。参见[Q03](../../plugins/aaalenwow--dsh-spring-admin-kit/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/aaalenwow--dsh-spring-admin-kit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1346017360-root"></a>

## [dsh-ssh-logs](../../plugins/452926826--dsh-ssh-logs/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/452926826/dsh-ssh-logs)

> **用途**：面向需要在DSH会话里读取预先授权服务器日志的开发/运维人员。主机和日志根由人配置alias，模型只能列服务器、读文件头尾/范围或grep固定字符串，适合围绕request ID、时间附近异常取有限片段。它不是远程终端、日志采集平台或任意主机管理器。

> **亮点**：将固定主机/根别名、quote保护的读命令和有界输出接到MCP/DSH，减少人手复制日志，并不提供任意shell或新SSH协议。详见[Q02](../../plugins/452926826--dsh-ssh-logs/INSIGHT.md#research-q02)。

> **思考**：root只词法normalize，符号链接目标未核；child env不继承SSH_AUTH_SOCK，空grep退出1被当SSH失败。取消/远端后代停止未确认，未实际连接复现。详见[Q03](../../plugins/452926826--dsh-ssh-logs/INSIGHT.md#research-q03)、[Q05](../../plugins/452926826--dsh-ssh-logs/INSIGHT.md#research-q05)。

> **建议**：可探索远端规范路径/文件身份和empty/truncated/cancel状态收据，最小传递agent socket，比较目标/状态正确、清理与延迟；未实现。详见[Q06](../../plugins/452926826--dsh-ssh-logs/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/452926826--dsh-ssh-logs/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425006726-root"></a>

## [dsh-subagent](../../plugins/1373700184--dsh-subagent/INSIGHT.md)

[![npm 30d 21](https://img.shields.io/static/v1?label=npm+30d&message=21&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-subagent) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-subagent)

> **用途**：多CLI使用者委派自包含独立任务，以正确产物和父agent独立验收为交付。

> **亮点**：集中CLI驱动、动态工具、并发槽和日志恢复，减少手工终端编排；模型与官方subagent契约为继承能力。见 [Q01](../../plugins/1373700184--dsh-subagent/INSIGHT.md#research-q01)、[Q02](../../plugins/1373700184--dsh-subagent/INSIGHT.md#research-q02)。

> **思考**：默认bypass权限可映射为跳过批准与沙箱，detached存活扩大操作责任；先发notice后标记不保证端到端只一次。见 [Q03](../../plugins/1373700184--dsh-subagent/INSIGHT.md#research-q03)。

> **建议**：未验证的稳定完成回执与父会话消费确认，可能减少崩溃窗口重复/遗漏；用五阶段强杀实验测净收益。见 [Q05](../../plugins/1373700184--dsh-subagent/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1373700184--dsh-subagent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1421306160-root"></a>

## [dsh-subagent-role-router](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/643048695/dsh-subagent-role-router)

> **用途**：已有多模型额度、反复委派探索与修补任务的 DSH 操作者，可集中配置角色路由；合格结果仍须逐项核对模型与交付。见[Q01](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q01)。

> **亮点**：它把角色启发式、候补占用、请求级切换和人工下次请求覆盖连接到 DSH 子代理派发层，减少分散维护路由约定的入口；可追溯机制见[Q01](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q01)、[Q02](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q02)和[Q04](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q04)，节费效果尚无对照。

> **思考**：出生时的角色与豁免并不等于完整运行期路由契约。单角色候补可能回全局失败池，preset/cwd 豁免运行中仅按标签复核，白名单写回又会留下持久配置；这些源码边界使严格隔离场景不宜直接采用，实际影响尚未复现。见[Q02](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q02)至[Q04](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q04)。

> **建议**：未验证假设是保存一次派发的允许路由、豁免来源与预算契约，让出生、fork、失败切换统一读取，可能减少跨阶段越界；以有限用例矩阵比较越界数、合格率和配置负担，若显式路由已足够或复杂度增加却无改善则放弃。推导与否定条件见[Q06](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1367482095-root"></a>

## [dsh-super-code](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md)

[![GitHub ★ 16](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=16&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ArtlexYoung/dsh-super-code) [![npm 30d 2,783](https://img.shields.io/static/v1?label=npm+30d&message=2%2C783&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-code) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-code)

> **用途**：面向需要跨多文件调查、实现和验证的DSH开发任务，合格交付仍是满足用户需求且通过项目验收的补丁，任务台账和Agent树只是辅助。普通宿主agent也有工具和子agent，此插件增加按需方法、带来源需求的台账、版本绑定成员交接及工作区长期经验。它明确不另建agent loop，模型、权限、持久化和子agent执行归宿主；贡献应归于任务组织与证据交接而非声称新模型或自动正确性。 外部 MCP 客户端还可把明确工作目录的任务交给 DSH，但这不是预置 INSIGHT 报告服务。

> **亮点**：[Q01](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q01) 与 [Q02](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q02) 的主要增量在需求来源可核查、任务修订绑定与分层上下文，而执行loop和spawn继承宿主。它改善协作材料的可审查性，不能把reviewable直接当补丁正确。 [Q06](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q06) 的本机 MCP 以请求去重、目录白名单和可观测会话把 DSH 接为外部执行 worker；这增加跨客户端交接路径，模型执行仍归宿主。

> **思考**：[Q03](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q03) 指出成员checks与cost仍可自报，结构一致不证明完成验收；历史冻结候选评测亦不能直接套到固定0.3.8和新宿主。默认宽松删除提示不是全面删除防线。 [Q06](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q06) 进一步说明服务级 Bearer 不是多用户隔离，finished 不是报告验收，单工作树排他也限制并发。

> **建议**：[Q05](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q05) 提出宿主事件按任务attempt归因、按合格结果反馈预算，尚未验证；必须同时看完整账单和补丁质量，漏记或降质会推翻优势。

[查看完整分析](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1406156934-dsh-task-monitor"></a>

## [dsh-task-monitor](../../plugins/3450892121--dsh-task-monitor--dsh-task-monitor/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/3450892121/dsh-task-monitor)

> **用途**：适合同时查看工作区、Git 分支、任务、技能、MCP、产物与网页访问；只需 git status 时终端命令更透明。 详见[Q01](../../plugins/3450892121--dsh-task-monitor--dsh-task-monitor/INSIGHT.md#research-q01)。

> **亮点**：把研究/开发上下文与交付动作放到同一面板，减少窗口切换；差异点是可操作监控而非单纯只读仪表盘。 详见[Q03](../../plugins/3450892121--dsh-task-monitor--dsh-task-monitor/INSIGHT.md#research-q03)。

> **思考**：提交、推送、切分支和发布会改变仓库或远端；根 README 与组件安全说明对写动作边界表述不一致，不能按只读工具信任。 详见[Q04](../../plugins/3450892121--dsh-task-monitor--dsh-task-monitor/INSIGHT.md#research-q04)。

> **建议**：若所有写按钮先展示精确命令、目标 remote/ref 和差异摘要，并记录操作结果，面板才可能胜过终端而不牺牲可审计性。 详见[Q08](../../plugins/3450892121--dsh-task-monitor--dsh-task-monitor/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/3450892121--dsh-task-monitor--dsh-task-monitor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333800488-root"></a>

## [dsh-taskswarm](../../plugins/february2015--dsh-taskswarm/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/february2015/dsh-taskswarm)

> **用途**：适合有Git仓库、能把目标拆成明确PROMPT/STATUS任务包、依赖与完成条件的多步骤代码工作。基线手工subagent+分支/worktree+PR/CI，由人跟踪交接；插件将任务外置、按波次启动lane、保检查点/状态/邮箱、串行集成到taskswarm/orch，用户再integrate到当前分支。单次咨询/高度耦合任务可能不值得这层管理。

> **亮点**：把TaskPlane式外置任务、wave/worktree/checkpoint与DSH内部agent/supervisor/恢复接线，支持代码现场持续推进；总管理负担减少仍是推断。详见[Q01](../../plugins/february2015--dsh-taskswarm/INSIGHT.md#research-q01)、[Q03](../../plugins/february2015--dsh-taskswarm/INSIGHT.md#research-q03)。

> **思考**：默认PASS/none与blocked可合并、首review缺.seq抛错、普通merge不统一check；worktree非权限沙箱且dashboard非显式loopback绑定，merged不能当accepted。详见[Q04](../../plugins/february2015--dsh-taskswarm/INSIGHT.md#research-q04)、[Q05](../../plugins/february2015--dsh-taskswarm/INSIGHT.md#research-q05)。

> **建议**：可探索任务/代码/策略/依赖产物绑定的接受收据与变化失效，对照简单严格CI/人工最终SHA验收；未实现。跨执行者任务包仅更远设想。详见[Q07](../../plugins/february2015--dsh-taskswarm/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/february2015--dsh-taskswarm/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1332692519-root"></a>

## [dsh-tianshu-tui](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md)

[![GitHub ★ 295](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=295&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/huiliyi37/dsh-tianshu-tui) [![npm 30d 1,860](https://img.shields.io/static/v1?label=npm+30d&message=1%2C860&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huiliyi37/dsh-tianshu-tui) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huiliyi37/dsh-tianshu-tui)

> **用途**：面向终端偏好且能管理profile的DSH操作者，合格结果是输入/状态/审批/恢复正确和终端退出正常。见[Q01](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q01)。

> **亮点**：移植渲染核心并将原生Agent状态/输入、会话与工程诊断接到终端工作面，保持展示与会话权威分层。来源映射不等于新Agent算法。见[Q01](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q01)、[Q02](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q02)。

> **思考**：整个bundle超出展示层：本地快捷模式可自动allowed-once，LSP可npx启动，npm启动更新会改profile；skip在fetch之后判，不能保证完全无查询。见[Q03](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q03)、[Q04](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q04)。

> **建议**：用可审阅条记录临时授权范围与环境变更，检验能否减少误放行/意外版本变更而不增加过多打断。见[Q06](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335139860-root"></a>

## [dsh-token-billing](../../plugins/2006spy--dsh-token-billing/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2006spy/dsh-token-billing)

> **用途**：面向DSH Web中混用不同provider/模型，希望在输入框附近看到本轮消耗、并汇总跨会话支出的个人用户。核心输入是会话事件与四档usage，插件输出费用行、统计、价目配置和CSV/JSON账本。它是消费可视化工具，不负责代扣费，也不验证业务任务产出。

> **亮点**：把估算到usage修正、provider价优先和事件时间政策接入会话投影，再提供步骤账本与导出，减少手工整理；不是正式账单或新tokenizer。详见[Q02](../../plugins/2006spy--dsh-token-billing/INSIGHT.md#research-q02)。

> **思考**：投影可撤销估算，但账本仅追加且同key不更新；宿主发布中间状态时退款可能留下持久条目。“节省”还涉及累计actual和跨币种口径，未运行复现。详见[Q03](../../plugins/2006spy--dsh-token-billing/INSIGHT.md#research-q03)。

> **建议**：可探索步骤revision与upsert/tombstone修订链、价版本和原币种收据，比较投影/总账差额、重放与体积；未实现。详见[Q06](../../plugins/2006spy--dsh-token-billing/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/2006spy--dsh-token-billing/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335559646-root"></a>

## [dsh-trellis](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1264459640/dsh-trellis) [![npm 30d 1,504](https://img.shields.io/static/v1?label=npm+30d&message=1%2C504&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)

> **用途**：适合跨会话推进功能、缺陷与重构的维护者，用版本化任务产物、单一steps状态、会话指针和阶段提示恢复工作；最终仍验真实业务代码。

> **亮点**：把三轨任务产物、单一steps、会话绑定/每轮提示与看板连接，降低仅靠聊天和手工清单恢复的接线负担；不归属为新通用任务算法。详见[Q01](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q01)。

> **思考**：human是模型可填标签，完整steps替换/verification降级与Git探测失败放行限制强验收主张；planning只读为工具组装过滤且保留shell，不是权限沙箱。详见[Q03](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q03)。

> **建议**：可探索与代码/要求版本绑定的独立验收凭据，把unknown与clean分开，并用假事件/Git矩阵证伪；尚未实现。详见[Q05](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1264459640--dsh-trellis/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333111893-root"></a>

## [dsh-TUI](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md)

[![GitHub ★ 5,735](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C735&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ccch1mneyyy/dsh-TUI) [![npm 30d 44,529](https://img.shields.io/static/v1?label=npm+30d&message=44%2C529&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui)

> **用途**：适合长期在终端/SSH里使用DSH、希望查看流式回答、工具卡与会话状态的开发者。合格结果是输入、审批、历史恢复与当前Agent状态对应，原办法为DSH原生CLI或Web。该项目既有plugin入口也有独立启动与composition root，不是修改DSH核心代码；对主要在浏览器工作的人，换成终端未必更方便。丰富显示改善可见性，但不是代码正确性或任务办结率证据。

> **亮点**：[Q02](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q02)将宿主适配、共享事件投影与终端显示分离，live/replay同路和生命周期接线比日志抓取更可核对；不是提升模型能力。

> **思考**：[Q03](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q03)全局与profile副本、终端协议及shared home会影响兼容和恢复；safe profile不代表与当前环境完全隔离。

> **建议**：[Q05](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q05)提出固定事件轨迹的实时/重放状态等价检验，假设未验证，以工具行和审批一致性作为否定条件。

[查看完整分析](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338526178-packages-bundle-rollback"></a>

## [dsh-undo-plugin](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/23swccp/dsh-undo) [![npm 30d 955](https://img.shields.io/static/v1?label=npm+30d&message=955&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin)

> **用途**：Git工作区内需要同步回退文件和会话的用户，限可恢复本地任务。详见[Q01](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md#research-q01)。

> **亮点**：把消息ID/私有Git树和会话前缀绑定为可选择回退分支，减少手动对齐文件与聊天历史；bundle是七包组合而非独立新快照算法。详见[Q01](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md#research-q01)。

> **思考**：文件/会话/归档非原子，异常可重写ready丢中间态，idle后台任务与其他写者未必静止；忽略文件和外部副作用不回退。详见[Q03](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md#research-q03)。

> **建议**：规范workspace全写者租约、不可降级事务日志与实际树核对形成覆盖明确的回退收据，按中间失败/双写者反例证伪，未验证。详见[Q06](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334836615-root"></a>

## [dsh-update-checker](../../plugins/airmetro--dsh-update-checker/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Airmetro/dsh-update-checker) [![npm 30d 7,106](https://img.shields.io/static/v1?label=npm+30d&message=7%2C106&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-update-checker) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-update-checker)

> **用途**：面向自行维护DSH Web部署/profile插件、希望少在命令行查版本/备份/更新/恢复的维护者。基线npm/pnpm或Git tag手工查询、备份、安装、声明同步与重启；插件在GUI合并主程序/第三方插件通知、更新与回退回执。客户端加载和定期检查本身会访问源，不能理解成纯离线只读。

> **亮点**：将多源版本/频道判断、staging/备份/锁目录原地同步、声明回执与平台更新委托整合到GUI，工程增量在维护编排而非新包管理算法。详见[Q03](../../plugins/airmetro--dsh-update-checker/INSIGHT.md#research-q03)。

> **思考**：writeGate拒绝返回err=json(...)而json无返回值，if(g.err)无法退出；多条写路由拒绝后仍可继续副作用，且全局ok可能包持久化失败/身份未知。未运行复现。详见[Q04](../../plugins/airmetro--dsh-update-checker/INSIGHT.md#research-q04)、[Q05](../../plugins/airmetro--dsh-update-checker/INSIGHT.md#research-q05)。

> **建议**：可探索显式拒绝判别与绑定计划、分阶段更新收据，以假副作用日志证伪拒绝后写入/部分成功混同，未实现。详见[Q07](../../plugins/airmetro--dsh-update-checker/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/airmetro--dsh-update-checker/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425044910-root"></a>

## [dsh-vercel](../../plugins/adenxie--dsh-vercel/INSIGHT.md)

[![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@adenxie/dsh-vercel)

> **用途**：DSH用户管理Vercel项目/部署，希望少手工配置MCP。详见[Q01](../../plugins/adenxie--dsh-vercel/INSIGHT.md#research-q01)。

> **亮点**：把OAuth、Agent工具面预算与结果分页接合，减少整目录上下文和接线。详见[Q01](../../plugins/adenxie--dsh-vercel/INSIGHT.md#research-q01)。

> **思考**：单机全profile共享token，整份保存无CAS，clear未阻止已在途exchange后commit，投影可能截断单项。详见[Q04](../../plugins/adenxie--dsh-vercel/INSIGHT.md#research-q04)。

> **建议**：研究凭据epoch/CAS与profile分区、截断继续标识和远端写幂等回执，比较token复活/误重试。当前未验证。详见[Q06](../../plugins/adenxie--dsh-vercel/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/adenxie--dsh-vercel/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333370288-root"></a>

## [dsh-verification-receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verification-receipt) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verification-receipt)

> **用途**：适合希望回看DSH每轮记录过多少工具调用、出现哪些验证形状信号，却不愿另外持久化对话/参数/输出的个人维护者。turn/end后追加本地JSONL，包含粗粒度计数/状态/类别和会话伪名。它回答“记录中有何执行迹象”，不能回答“测试是否真运行/测试足够/代码正确”。

> **亮点**：把持久事件投影成隐私减量的每轮工具状态/词法摘要，显式不冒充测试通过，并用关闭接收/注销/drain管理卸载。详见[Q02](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q02)、[Q04](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q04)。

> **思考**：词法信号有误报/漏报且信任宿主结果；无keyhash可重算/关联，队列无界、写失败仅warning，无rotation/锁，路径需可信管理员。详见[Q03](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q03)、[Q04](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q04)。

> **建议**：可探索有界队列与accepted/persisted/dropped可见计数，比较内存/延迟/丢失解释，保持摘要非审计证明；未实现。详见[Q06](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/030611--dsh-verification-receipt/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1423215529-root"></a>

## [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)



> **用途**：多版本工具链出现命令找错、版本不一致时，开发者可收集胜出路径和遮蔽原因；结果是诊断材料，不是自动修复。详见[Q01](../../plugins/11111353535--dsh-which/INSIGHT.md#research-q01)。

> **亮点**：把胜出文件、遮蔽项和PATH异常组织成同一结构化诊断流程，并以可注入文件系统支持固定反例核查；增量是取证接线和解释，不是新的shell解析规则。详见[Q03](../../plugins/11111353535--dsh-which/INSIGHT.md#research-q03)。

> **思考**：报告是否对应实际shell仍受建模边界限制，Windows解析默认cmd表而环境可显示PowerShell；版本旗标也不能保证候选程序无副作用。这些为静态核查所得，未做运行复现。详见[Q04](../../plugins/11111353535--dsh-which/INSIGHT.md#research-q04)。

> **建议**：可从shell种类的显式传递和模型边界标注入手，将文件候选与实际shell事实分层；先用固定反例对照，再决定是否增加受控适配，当前未验证。详见[Q08](../../plugins/11111353535--dsh-which/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/11111353535--dsh-which/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344715132-root"></a>

## [dsh-workflow-templates](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md)

[![npm 30d 385](https://img.shields.io/static/v1?label=npm+30d&message=385&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workflow-templates) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workflow-templates)

> **用途**：用户明确需要 DSH workflow 大规模多 Agent 编排时，从常见任务模板起步。

> **亮点**：提供可检索的编排脚本起点和轻量格式诊断，减少空白起草。详见[Q01](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md#research-q01)。

> **思考**：invalid 模板仍可 run，缺参仅文字提醒；部分模板返回与描述不符，不能把格式校验当业务验收。详见[Q02](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md#research-q02)、[Q03](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md#research-q03)。

> **建议**：默认拒绝已知invalid/缺参并补业务输入输出契约，反证条件与维护代价见[Q05](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336092482-root"></a>

## [dsh-worktable](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md)

[![GitHub ★ 800](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=800&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-worktable)

> **用途**：并行管理多个Agent项目的用户，可用分屏和会话绑定集中查看状态，但done不代表交付验收。

> **亮点**：[Q01](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md#research-q01) 与 [Q02](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md#research-q02)支持的贡献是多项目会话和窗格统一组织，以及按binding隔离晚到自定义结果；它是管理界面增量，不是新的Agent执行或业务完成证明。

> **思考**：[Q03](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md#research-q03)显示文件读写handler接受原始路径，终端启动真实shell，未在这些段落看到项目级约束。宿主认证未核查，不能断言匿名漏洞，但也不能把浏览器folder或窗口所有权当文件权限；这足以暂缓真实项目采用。

> **建议**：[Q05](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md#research-q05) 提出复用可信宿主项目根及许可约束文件/终端的未验证接线方案，先查已有接口，再测试跨根、旧binding和撤销后请求；已有等价约束时不重造。

[查看完整分析](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-841979943-root"></a>

## [dsh-wrapup-guard](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/566001/dsh-wrapup-guard) [![npm 30d 74](https://img.shields.io/static/v1?label=npm+30d&message=74&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wrapup-guard) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wrapup-guard)

> **用途**：DSH 开发任务交付前的测试、审查、构建和一致性核对。

> **亮点**：把收尾过程显式化为检查工具、轮次状态和通知，降低遗漏提醒成本，但保证依赖如实调用/上报。详见[Q01](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md#research-q01)、[Q02](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md#research-q02)。

> **思考**：check 未与 report 门槛绑定，缺人工 checks 只是提醒，三次空 problems 可绕开所谓全面检查；状态落盘失败也被吞掉。详见[Q03](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md#research-q03)。

> **建议**：同轮证据绑定、失败阻断和按会话隔离通知，若在漏查/失败/多会话测试中降低误放行且耗时可接受，再考虑作为质量门；本版未实现。详见[Q04](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350379113-root"></a>

## [dsh-wsl-cred](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-cred)

> **用途**：WSL Git HTTPS/SSH配置排障，先区分配置线索与认证成功。详见[Q01](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md#research-q01)。

> **亮点**：把常用Git凭据配置线索放入单一模型报告。详见[Q01](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md#research-q01)。

> **思考**：内联helper可能含敏感值却原样输出，错误吞成未配，宿主cwd不等会话仓库。详见[Q03](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md#research-q03)。

> **建议**：研究只回类型/状态的最小化输出及明确cwd/错误层级，比较敏感片段和归属误判，尚未验证。详见[Q05](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350379001-root"></a>

## [dsh-wsl-distro](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-distro)

> **用途**：面向DSH host在WSL里、Windows默认发行版与当前进程所在发行版可能不同的用户。distro_info展示当前env名称、os-release、wsl.exe -l -v结构列表/默认星号并提示UNC不要跨发行版猜/home。

> **亮点**：把env/os与固定wsl列表结构化并提醒当前/默认不同，减少跨发行版路径猜测和手查。详见[Q02](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md#research-q02)。

> **思考**：current/os缓存与实时list无时点，UTF8去NUL非完整编码处理、单token/英文状态可能漏；直接exec内10s不接外timeout/signal，ok不证明完整/路径可用。详见[Q03](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md#research-q03)。

> **建议**：可探索来源/时点/partial与编码明确的环境收据，统一宿主进程signal/预算，比较误判与采集开销；未实现。详见[Q05](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854118-root"></a>

## [dsh-wsl-dns](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-dns)

> **用途**：面向WSL中DSH访问DeepSeek/GitHub/npm失败、希望比较两侧IPv4解析现象的用户。dns_doctor默认查三个域名，可传hosts，读/etc/resolv.conf第一条nameserver并展示WSL/Windows地址集合和建议。不改DNS/代理配置、不访问HTTPS业务端点，不证明TLS/应用可用。

> **亮点**：把两侧IPv4查询、集合差异和配置片段汇成模型工具，减少手查；固定PowerShell脚本对host单引号转义。详见[Q02](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q02)。

> **思考**：两侧错误折叠[]、ok只WSL非空，地址不同非劫持根因；多host串行总预算不接config/signal，直接exec与域名/内网披露需核。详见[Q03](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q03)。

> **建议**：可探索带解析来源/时点/错误与统一deadline的比较收据，分开观察/一致/诊断，比较误诊与额外披露/等待；未实现。详见[Q05](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854212-root"></a>

## [dsh-wsl-editor](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-editor)

> **用途**：WSL开发者在Windows桌面查看源码/日志。详见[Q01](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md#research-q01)。

> **亮点**：减少跨系统路径转换和编辑器goto命令步骤。详见[Q01](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md#research-q01)。

> **思考**：启动完成不等文档验收，相对路径非session cwd，逐重试超时未与宿主取消联动。详见[Q03](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md#research-q03)。

> **建议**：研究会话目标解析/分层启动状态与统一取消，比较错文件和重复窗口，尚未验证。详见[Q05](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854402-root"></a>

## [dsh-wsl-encoding](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-encoding)

> **用途**：WSL 调 Windows 命令时汉字路径乱码，或 /mnt/c 脚本因 CRLF 在 bash 中失败。

> **亮点**：以一工具汇合 Windows/WSL 编码和 CRLF 初诊，给出修复提示。详见[Q01](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md#research-q01)。

> **思考**：所谓 8192 字节采样先完整读文件；任意路径/大文件成本和采样失败仍 ok=true 易误导。详见[Q02](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md#research-q02)。

> **建议**：可探索分端observed/error/unknown、有界fd样本和总deadline收据，以冲突/不可读/后段CRLF/取消反例核查；未实现。详见[Q05](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381833309-root"></a>

## [dsh-wsl-git](../../plugins/173787247--dsh-wsl-git/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-git)

> **用途**：开发任务先看仓库摘要，减少整段diff进入模型。详见[Q01](../../plugins/173787247--dsh-wsl-git/INSIGHT.md#research-q01)。

> **亮点**：把常用Git摘要、返回上限与路径根配置接入模型工具。详见[Q01](../../plugins/173787247--dsh-wsl-git/INSIGHT.md#research-q01)。

> **思考**：porcelain失败仍计数ok，文本render漏截断，allowRoots只守cwd非父仓/Git环境范围。详见[Q03](../../plugins/173787247--dsh-wsl-git/INSIGHT.md#research-q03)。

> **建议**：研究仓库来源约束/统一预算和显式partial摘要，比较误判断与token，尚未验证。详见[Q05](../../plugins/173787247--dsh-wsl-git/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-git/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350544211-root"></a>

## [dsh-wsl-github](../../plugins/173787247--dsh-wsl-github/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-github)

> **用途**：DSH Agent 在 WSL 开发，需要只读查看当前 GitHub 仓库的 PR 和 CI 状态。

> **亮点**：把 GitHub App 最小只读状态查询封装为两模型工具，并区分 API 与推送凭据。详见[Q01](../../plugins/173787247--dsh-wsl-github/INSIGHT.md#research-q01)。

> **思考**：installation token 缓存未按仓库/owner 隔离，跨账号查询可复用错误 token；子请求失败仍 ok=true。详见[Q02](../../plugins/173787247--dsh-wsl-github/INSIGHT.md#research-q02)。

> **建议**：按安装与凭据版本缓存、明确不匹配和部分结果，反证及维护代价见[Q05](../../plugins/173787247--dsh-wsl-github/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-github/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381859919-root"></a>

## [dsh-wsl-glab](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-glab)

> **用途**：已认证GitLab开发者查询项目协作状态。详见[Q01](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md#research-q01)。

> **亮点**：把常见GitLab读取命令统一到模型摘要入口。详见[Q01](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md#research-q01)。

> **思考**：auth正则可能漏空格分隔秘密，issue parse失败render假空，CI错误包装ok，项目和CLI版本隐式。详见[Q03](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md#research-q03)。

> **建议**：研究白名单认证摘要/显式项目来源与parse-partial状态契约，对照假空和敏感外发，尚未验证。详见[Q05](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381389698-root"></a>

## [dsh-wsl-jev](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-jev)

> **用途**：在 WSL/DSH 中以短结构化结果辅助选择、评分和声称/证据匹配。

> **亮点**：把 Jev System One API 包装为 DSH 工具并处理 WSL 代理和候选键映射；模型能力归外部服务。详见[Q02](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md#research-q02)。

> **思考**：缺 evidence 仍可问模型，有限清洗不能保证外发安全，未知 rank key 仍可 ok:true。详见[Q03](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md#research-q03)。

> **建议**：外发字段白名单、缺证据拒绝与无效 choice 校验可形成可核决策门槛；尚未实现。详见[Q05](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381726881-root"></a>

## [dsh-wsl-k8s](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-k8s)

> **用途**：已有 kubeconfig 的开发/运维人员用 DSH 辅助集群只读排障。

> **亮点**：将常用 kubectl 只读查询做成模型工具并限制动词与输出，减少手工复制诊断信息；集群权限和语义仍由 kubectl/RBAC 提供。详见[Q01](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md#research-q02)。

> **思考**：allowedContexts 对空 context 直接放行，get/describe/logs 可沿用 kubeconfig 当前集群；contexts 过滤仅影响显示，status 也不门控。不能将该配置当生产隔离。详见[Q03](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md#research-q03)。

> **建议**：可对所有查询解析并固定当前 context，非允许上下文拒绝，配合两测试集群比较误放行、误拒与延迟；本版未实现。详见[Q04](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338965593-root"></a>

## [dsh-wsl-net](../../plugins/173787247--dsh-wsl-net/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-net)

> **用途**：WSL/Windows网络环境不一致时辅助维护者定位故障层次。详见[Q01](../../plugins/173787247--dsh-wsl-net/INSIGHT.md#research-q01)。

> **亮点**：把环境、宿主PID、代理监听和服务响应集中为Agent诊断报告，减少手工信息拼接。详见[Q01](../../plugins/173787247--dsh-wsl-net/INSIGHT.md#research-q01)。

> **思考**：HTTP<500不等业务成功，fix脚本使用未脱敏代理，默认全局包装也缺显式卸载还原。详见[Q03](../../plugins/173787247--dsh-wsl-net/INSIGHT.md#research-q03)。

> **建议**：可研究分层可达性判据、无凭据回显的修复计划与可恢复注入，以固定反例比较误诊和恢复成本。当前未验证。详见[Q05](../../plugins/173787247--dsh-wsl-net/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-net/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350378631-root"></a>

## [dsh-wsl-path](../../plugins/173787247--dsh-wsl-path/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-path)

> **用途**：面向DSH实际运行在WSL、频繁把/mnt/c或Linux home路径交给Windows程序的用户。path_convert双向生成文本路径并给drvfs/Linux提示，不打开、不复制、不执行目标，不检查文件存在或权限。

> **亮点**：将盘符/WSL UNC文字映射、WSL识别和词法FS提示接到并发安全的小工具，减少手改分隔符。详见[Q02](../../plugins/173787247--dsh-wsl-path/INSIGHT.md#research-q02)。

> **思考**：UNC发行版被helper解析后在工具输出丢弃，默认/mnt与字面WSL假设/盘符相对路径和特殊名不保真；ok非存在/权限保证，raw注册需核宿主。详见[Q03](../../plugins/173787247--dsh-wsl-path/INSIGHT.md#research-q03)。

> **建议**：可探索保发行版/卷映射来源与可表示状态的转换收据，拒绝身份歧义，比较误转与探测代价；未实现。详见[Q05](../../plugins/173787247--dsh-wsl-path/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-path/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381861315-root"></a>

## [dsh-wsl-pkg](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-pkg)

> **用途**：DSH 用户快速看多语言项目依赖和 npm 更新候选；需核环境归属与截断，不能代替全量审计。

> **亮点**：把既有包管理器命令包成 DSH 工具与浅摘要，提供可选项目根限制；不增加依赖解析算法。详见[Q02](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md#research-q02)。

> **思考**：allowRoots 空时不限目录，pip list 跟随 DSH 进程 PATH 而非指定项目；解析失败也可能 ok:true，须核项目、退出和截断。详见[Q03](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md#research-q03)。

> **建议**：绑定项目根、解释器/包管理器路径、退出码和完整性标签，可能减少多环境错配；双 venv 对照验证，尚未实现。详见[Q05](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381725987-root"></a>

## [dsh-wsl-search](../../plugins/173787247--dsh-wsl-search/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-search)

> **用途**：可信WSL项目内由模型查文本、文件名及AST模式。详见[Q01](../../plugins/173787247--dsh-wsl-search/INSIGHT.md#research-q01)。

> **亮点**：统一现成搜索器、模型参数及根检查，减少手写shell。详见[Q01](../../plugins/173787247--dsh-wsl-search/INSIGHT.md#research-q01)。

> **思考**：默认HOME范围宽，先缓冲后全局截断且无截断标志，AST坐标和长度与rg未统一。详见[Q03](../../plugins/173787247--dsh-wsl-search/INSIGHT.md#research-q03)。

> **建议**：研究流式全局停止、截断回执和统一坐标，将CLI查找/子进程纳入可取消限额，固定宿主沙箱root。当前未验证。详见[Q05](../../plugins/173787247--dsh-wsl-search/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-search/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854356-root"></a>

## [dsh-wsl-ssh-agent](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-ssh-agent)

> **用途**：面向WSL内DSH做Git SSH失败、需要知道当前host进程有无SSH_AUTH_SOCK、agent身份数量和常见Windows桥安装痕迹的用户。ssh_agent_hint是诊断/文字建议，不启动agent/桥、不加载私钥、不执行ssh -T或Git推送，也不读密钥文件正文。

> **亮点**：将socket/身份数量和常见桥痕迹聚合为只读提示，正常结果不回key指纹正文、不读私钥内容，区分SSH/HTTPS。详见[Q02](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md#research-q02)。

> **思考**：sockAlive仅exists、key文件仅名字，ssh-add失败变0并丢ok/code且render漏detail，易把错误当无身份；直接exec不接signal/config，ok非目标授权。详见[Q03](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md#research-q03)。

> **建议**：可探索分层socket/查询退出/身份与时点收据，最小化内容并统一host预算，比较误建议/披露；未实现。详见[Q05](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381833652-root"></a>

## [dsh-wsl-tmux](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-tmux)

> **用途**：长任务已在tmux运行，用户希望模型查看输出线索。详见[Q01](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md#research-q01)。

> **亮点**：将原生tmux查询包装为受限模型入口，减少手工复制输出。详见[Q01](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md#research-q01)。

> **思考**：默认socket不绑定agent工作区，code1一律空与文本隐藏截断可能误读任务，头部切片可漏最新尾部。详见[Q03](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md#research-q03)。

> **建议**：研究server/pane精确句柄、带时间的partial尾部回执和统一预算，按错目标/假空/漏尾反例比较，尚未验证。详见[Q05](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334205011-root"></a>

## [dsh-wsl-workspace](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md)

[![GitHub ★ 100](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=100&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,765](https://img.shields.io/static/v1?label=npm+30d&message=2%2C765&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-workspace)

> **用途**：Windows界面与WSL工程长期并用的人群有明确集成需求；是否优于直接Linux宿主取决于界面与工作流约束。见 [Q01](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md#research-q01)。

> **亮点**：相对手动wsl.exe包装，贡献在会话级工作区、工具提供者和预设的组合；宿主执行器与fs机制的继承须保留归属。见 [Q01](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md#research-q01)。

> **思考**：完整工作区不能被理解成统一用户身份、统一沙箱或恰好一次执行；自动伪终端重跑尤其需要副作用核对。见 [Q03](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md#research-q03)。

> **建议**：未验证假设为对潜在重跑建立执行阶段账本，减少含副作用命令的重复执行误判。临时标记命令的对照和否定条件见 [Q05](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351853812-root"></a>

## [dsh-wsl-workspace](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-workspace)

> **用途**：面向在 WSL 中启动 DSH 项目、需要选择发行版和 Linux 工作区路径的开发者。输入是 list/check 操作及路径；合格结果是识别当前/默认发行版、确认路径存在并区分 Linux home、/mnt Windows 挂载或异常位置，给出不越权迁移建议。简单替代是手工跑 wsl.exe 和检查 pwd/mount。

> **亮点**：相对手工命令，它把发行版发现与 /mnt 卫生检查包装成模型可调用、只读且结构化的单工具；核心判断是常见 WSL 路径经验，不是新的文件系统机制。窄范围与无写副作用使它比通用部署插件更易审计。 参见[Q03](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q03)。

> **思考**：路径位于 /mnt 只是性能和权限风险信号，不等于所有项目都更慢；自定义挂载、WSL2 配置、网络文件系统和跨发行版路径可能让启发式误判。只验证路径存在也不能证明 Git、文件监听、权限、大小写或构建性能符合项目需要。 参见[Q04](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q04)。

> **建议**：可在用户同意后运行无破坏的微基准和语义探针，例如小文件创建/删除、大小写、文件监听与 Git status，用工作负载证据补充路径标签。它可能减少把所有 /mnt 一概判坏的误报，但基准本身会写临时文件并增加等待。 参见[Q08](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1280115203-root"></a>

## [easyeda-agent](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md)

[![GitHub ★ 837](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=837&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhoushoujianwork/easyeda-agent)

> **用途**：能核对电路与规则的工程师，可在工程副本先读取和诊断，再试有限可回退操作。

> **亮点**：[Q01](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q01) 与 [Q02](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q02) 表明价值是把类型化EDA动作、真实文档身份和知识流程接到Agent，避免只凭截图操作；根DSH入口为空，贡献不能夸成新EDA算法或自主生产整板。

> **思考**：[Q03](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q03) 明确CLI超时不代表EDA没修改，handler晚到效果须回读核对；动作成功和局部DRC也不等于电气及制造全部合格。因此只能由工程师监督，不能盲重试或无人值守出板。

> **建议**：[Q05](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q05) 提出基于已有abandoned/mutationContext的只读恢复核对假设，先排除CLI与Skill已等价实现，再比较延迟动作的重复修改和恢复时间；不能确定时保持未知。

[查看完整分析](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1276714299-root"></a>

## [Embedded Workbench](../../plugins/amethystluna--embedded-workbench/INSIGHT.md)

[![GitHub ★ 25](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=25&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 3,501](https://img.shields.io/static/v1?label=npm+30d&message=3%2C501&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench)

> **用途**：固件开发者处理异常、RTOS/ISR与构建现场时可按需调用领域方法，目标是实际修复而非核查段存在，见 [Q01](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q01)。

> **亮点**：按需材料、小首步提醒、持久历史去重与旧宿主volatile降级减少接线分散，领域方法组合有实用增量，见 [Q01](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q01) 和 [Q02](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q02)。

> **思考**：Gate无代码级计划校验，静态fact-check不能证明状态机/并发行为；作者优先级文案和兼容矩阵不等权限或实测，见 [Q02](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q02) 与 [Q03](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q03)。

> **建议**：把逐声称证据绑定代码/计划版本并区分行为未验，对照误放行与负担；未实现、无效则停止，见 [Q03](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/amethystluna--embedded-workbench/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1179983747-root"></a>

## [HarmonyOS NEXT Skills](../../plugins/linhay--harmony-next.skills/INSIGHT.md)

[![GitHub ★ 366](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=366&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/linhay/harmony-next.skills)

> **用途**：HarmonyOS开发者查固定版本API或准备DevEco/设备证据；先区分普通参考与实际自动化。见[Q01](../../plugins/linhay--harmony-next.skills/INSIGHT.md#research-q01)。

> **亮点**：分层本地导航、版本提示和带目标约束/ledger的有界设备动作，内容与工具链统一入口。见[Q01](../../plugins/linhay--harmony-next.skills/INSIGHT.md#research-q01)、[Q03](../../plugins/linhay--harmony-next.skills/INSIGHT.md#research-q03)。

> **思考**：API26主要为声明快照，不是完整行为指南；动作completed只证命令/采集完成，未验业务目标，rawSensitiveContentStored说明原始证据仍敏感。见[Q02](../../plugins/linhay--harmony-next.skills/INSIGHT.md#research-q02)、[Q03](../../plugins/linhay--harmony-next.skills/INSIGHT.md#research-q03)。

> **建议**：未验证方向是基于before/after增加期望后置条件，把动作完成与业务验证分开；用遮挡/无响应/正常样本比较误报和回看时间，用户简单回看足够则仅改善提示。见[Q04](../../plugins/linhay--harmony-next.skills/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/linhay--harmony-next.skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1343702731-root"></a>

## [harness-github](../../plugins/988hj7tczd-oss--harness-github/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/harness-github) [![npm 30d 148](https://img.shields.io/static/v1?label=npm+30d&message=148&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/harness-github) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/harness-github)

> **用途**：帮助在DSH处理软件交付的人取得GitHub事实并准备操作，合格结果需对象、授权和最终状态可回读。

> **亮点**：把成熟gh/REST能力包装为DSH结构工具、统一凭据路径与远程审批，减少重复命令接线；价值是集成便利而非新增GitHub原语。详见[Q02](../../plugins/988hj7tczd-oss--harness-github/INSIGHT.md#research-q02)。

> **思考**：pr_prepare可在审批前git add -A并commit，与拒绝零副作用承诺冲突；REST对非幂等写也通用重试，断连后可能重复发布，合并未绑定head。均为源码路径判断，未向GitHub复现。详见[Q02](../../plugins/988hj7tczd-oss--harness-github/INSIGHT.md#research-q02)。

> **建议**：可探讨状态绑定动作收据，先明确本地/远程操作、摘要和head再审批，未知结果先回读且不重放非幂等写；新增状态与恢复负担，未验证。详见[Q05](../../plugins/988hj7tczd-oss--harness-github/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/988hj7tczd-oss--harness-github/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1064776002-root"></a>

## [HelloAGENTS](../../plugins/hellowind777--helloagents/INSIGHT.md)

[![GitHub ★ 709](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=709&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hellowind777/helloagents) [![npm 30d 829](https://img.shields.io/static/v1?label=npm+30d&message=829&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/helloagents) [![最新发布 2026-07-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-07-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/helloagents)

> **用途**：面向需要计划、实现、复核及跨轮继续的AI编码CLI用户。

> **亮点**：将项目知识、分支会话状态、任务清单和质量检查组织成可恢复编码流程，增益在避免遗漏而非提高模型能力。[Q01](../../plugins/hellowind777--helloagents/INSIGHT.md#research-q01) [Q02](../../plugins/hellowind777--helloagents/INSIGHT.md#research-q02)

> **思考**：QA记录可由调用方提供clean和命令名，所查验证器不执行命令或核对退出日志；无计划和非auto/loop也有明确范围，不能称普遍强制交付保证。[Q02](../../plugins/hellowind777--helloagents/INSIGHT.md#research-q02)

> **建议**：复用CI或最小runner生成命令/目录/退出码/日志绑定记录，检查是否减少填表式错误放行；不替代需求与视觉判断，尚未验证。[Q04](../../plugins/hellowind777--helloagents/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/hellowind777--helloagents/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334304098-packages-helmd"></a>

## [Helm D](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md)

[![GitHub ★ 827](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=827&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ADWMC/helm-d) [![npm 30d 463](https://img.shields.io/static/v1?label=npm+30d&message=463&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@adwmc/helm-d)

> **用途**：为授权样本分析人员集中建案、留存受包裹工具输出并登记引用结论，合格标准仍是证据相关且结论正确，见 [Q01](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q01)。

> **亮点**：横切持久化、磁盘恢复与finding结构检查使证据整理集中；health把生成preset和宿主指纹关联并尝试重生成，备份/写入/重启边界见 [Q05](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q05)，见 [Q01](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q01) 与 [Q02](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q02)。

> **思考**：编号存在/命令非空不证明蕴含与复现，长证据截断与完整hash不同；行为干预不是授权或安全边界，见 [Q02](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q02) 和 [Q03](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q03)。

> **建议**：分离可审证据层与模型干预，明确原始/留存hash并为finding加入摘录和独立支持复核；新样本对照失败则否定，见 [Q04](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334304098-root"></a>

## [helm-d](../../plugins/adwmc--helm-d/INSIGHT.md)

[![GitHub ★ 700](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=700&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ADWMC/helm-d)

> **用途**：对反复做授权样本分析且需要向同事交接结论的人，合格结果应当包含样本身份、实际观察、结论依据和可恢复进度。原办法可以是一个手工目录加 Markdown 报告。helm-d 把建目录、复制样本、SHA-256 记录、时间线和恢复清单组成固定案卷，减少模型把依据只留在聊天中的机会。这是流程集成贡献，不是新的分析算法。

> **亮点**：[Q01](../../plugins/adwmc--helm-d/INSIGHT.md#research-q01) 表明样本哈希、工具输出编号、时间线和恢复清单形成了可交接案卷，这是集成贡献；底层分析效果来自实际工具、模型和人工判断，不能归于“不拒绝输出”。

> **思考**：[Q02](../../plugins/adwmc--helm-d/INSIGHT.md#research-q02) 中编号存在性检查允许空引用，也不验证关联性；关闭案卷只检查数量。因此案卷关闭不能作为安全分析正确性的验收决定。

> **建议**：可以提出未验证的案卷验收扩展。先要求每条 finding 至少一个有效引用，再保存不可变证据摘要、引用范围和“此材料支持哪一步”的解释，并让独立复核者给出接受或退回决定后才关闭。相对现有文件名集合检查，增量在于把“文件存在”推进到“结论对材料的关系已审查”，而不是增加更多领域工具。

[查看完整分析](../../plugins/adwmc--helm-d/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1086419061-hindsight-integrations-coding-agents"></a>

## [Hindsight 编码 Agent 记忆集成](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md)

[![GitHub ★ 54,364](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54%2C364&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vectorize-io/hindsight) [![npm 30d 61,353](https://img.shields.io/static/v1?label=npm+30d&message=61%2C353&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)

> **用途**：面向长期维护同一项目的开发者，在 DSH 中召回历史决策并自动写回完成的交流。

> **亮点**：按会话工作区绑定 RuntimeCore、fork 切片和历史注入去重组成具体适配增量，避免把进程工作目录或继承对话当作当前项目新输入。[Q01](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q01) [Q02](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q02)

> **思考**：停止边界不代表异步 retain 已确认；提前推进长度和只记诊断可能让静态会话尾部缺失。启动目录禁用和重构 decision 也限制多工作区及扩展组合。[Q03](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q03)

> **建议**：未验证假设是以服务确认推进写回水位，并将待确认和失败状态暴露给用户，以减少静态会话尾部漏写。先核实文档幂等契约，再对照当前游标与确认游标，注入断网、超时后重启和 fork；记录漏写、重复提炼、恢复时长和敏感数据残留。重复与存储负担抵消漏写改善时否定方案。[Q05](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1044010907-root"></a>

## [iPolloWork](../../plugins/devin-axis--ipollowork/INSIGHT.md)

[![GitHub ★ 7,286](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C286&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/iPolloWork)

> **用途**：iPolloWork根项目是独立桌面工作台，默认OpenCode、可接Codex和DSH；Design/PPT/Video另有可在DSH Web装入的子产品，不能用子插件安装命令代表根应用。目标是多人或多Agent项目将任务、会话与可编辑产物集中管理，原办法为多个运行时界面加文件编辑器。合格结果应是任务与实际产物保持对应、可继续编辑和核对，而非只在一个窗内出现多个引擎名称。本轮聚焦DSH适配切面，尚不足支持全套团队创作闭环收益。

> **亮点**：[Q02](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q02)DSH接入采用认证mux和显式pending交互回复，较终端嵌入有协议层增量；根工作台的可编辑产物闭环尚未由这段适配证明。

> **思考**：[Q03](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q03)流关闭不证明后台turn停止，统一界面也不能代替跨引擎权限和产物恢复验收；当前研究范围不足支撑迁移生产任务。

> **建议**：[Q05](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q05)提出以单项真实交付和可编辑修订闭环验证统一价值的未验证假设，对照原DSH Web加编辑器检查搬运和保真。

[查看完整分析](../../plugins/devin-axis--ipollowork/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1308234922-root"></a>

## [J-Space Cognition Suite](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md)

[![GitHub ★ 2,960](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C960&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tiger3807861189/J-Space-Cognition-Suite)

> **用途**：多文件长任务中需要防止陈旧源码与报告继续流转的开发或研究负责人。

> **亮点**：[Q02](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q02)、[Q03](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q03) 相对人工清单，脚本可机械拒绝过期读取、改变的证据和不匹配的任务契约，增量是证据失效治理，不是验证模型内部认知。

> **思考**：[Q03](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q03) 摘要一致不能证明验证文件真实，一份虚构而未变的日志仍需独立事实核对；门控exit 0不代表工程任务已正确完成。

> **建议**：[Q05](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q05) 未验证假设是在关键门槛增加可重放命令与独立抽样复跑，以真假/过期材料对照误接受和时间；不改善或成本更高则停止。

[查看完整分析](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1412857520-root"></a>

## [Ledger Memory](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/18477514055/dsh-ledger-memory) [![npm 30d 4,123](https://img.shields.io/static/v1?label=npm+30d&message=4%2C123&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ledger-memory) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ledger-memory)

> **用途**：持续跨会话推进同项目的用户可维护状态/卡片/交接并自动注入，合格接续仍核真实目标与文件，见 [Q01](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q01)。

> **亮点**：坏manifest/路径拒写、记忆根真实路径复核和实际stage判据，加上记忆接线提高可检查性，见 [Q01](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q01) 至 [Q03](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q03)。

> **思考**：grant不绑root/正文，主写与审计非事务，超大事件seq回读可缺整事件，V2仍默认stage；不能承诺无损或完整追责，见 [Q02](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q02) 与 [Q03](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q03)。

> **建议**：精确内容/版本授权、多资产收据与片内文本回读，故障矩阵若不能减少错写/遗漏则否定，见 [Q04](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331586818-root"></a>

## [LogicProbe](../../plugins/amethystluna--logicprobe/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 3,087](https://img.shields.io/static/v1?label=npm+30d&message=3%2C087&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe)

> **用途**：为能复核模型的开发者，将设计/重构声称接到可执行模型、反例与版本报告。见[Q01](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q01)。

> **亮点**：模型检查、Skill方法、反例/哈希和前后/delta报告连接Agent审查，超出口头自信但不自动证明源码。见[Q01](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q01)、[Q03](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q03)。

> **思考**：ask/auto非强制确认闸；预算/叙述/元数据边界不能靠ok或单一verdict概括，delta可掩已存在/升级错误，源码映射仍人工。见[Q02](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q02)、[Q03](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q03)。

> **建议**：未验证方向是独立来源/确认审查记录与报告消费规则，已有file:line和元数据之上新增变更失效绑定，已知错误盲测收益/工时否定。见[Q05](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/amethystluna--logicprobe/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1255217938-packages-dsh-loopx-plugin"></a>

## [LoopX for DSH](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md)

[![GitHub ★ 6,421](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C421&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/loopx-project/loopx)

> **用途**：面向已用LoopX管理长期目标、希望在DSH同一会话持续推进任务的用户。原办法是在终端手工读取quota和heartbeat再把任务贴回对话；合格结果应是唯一目标/Agent绑定、被允许的下一轮和可核对任务产物。此项只研究packages/dsh-loopx-plugin桥接，不把整仓LoopX所有能力归于插件。

> **亮点**：相对手工搬运heartbeat，增量是把LoopX权威准入与DSH活会话关联，而不再维护第二份Goal/Todo状态。绑定与quota回执核对比简单定时“继续”更能收窄误续轮范围。GoalBar的状态显示和Start/Pause减少界面切换，但安装不等于激活、模型任务质量仍非Driver保证。 依据[Q03](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q03)。

> **思考**：关键质疑是暂停和自动准入是否被用户误读成停止当前工作。README明确Pause只撤销未来queued/scheduled续轮，不中断已claimed/running turn；不能拿GoalBar暂停按钮当紧急撤销。跨CLI权威读取、队列提交和模型执行并非单个事务，代码的会话fence和typed回执能减少错绑，却不能单独证明业务动作exactly-once。 依据[Q04](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q04)。

> **建议**：未验证假设是给GoalBar同时显示“当前轮仍运行”和“未来续轮已暂停”的两种收据，能降低暂停含义误判。以相同长任务分别在queued、claimed、running时暂停，比较显示与实际续轮、重复动作和用户理解；若界面仍把未结束工作呈现为已停止，或只能靠重复点按钮确认，不应扩大自动推进。 依据[Q08](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336488925-root"></a>

## [Matt Skills Deck](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md)

[![GitHub ★ 251](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=251&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck)

> **用途**：已有Issue开发流程的DSH用户可集中使用工程Skills、任务层级和后端票据；合格交付须另核代码/测试，不以工单数量判断效率，见 [Q01](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q01)。

> **亮点**：随包Skill provider与真实票据工具形成宿主控制面，代表建票链区分父容器校验、幂等复用、部分成功和写后关系证据；相对只生成工单文本有具体工程增量，见 [Q01](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q01) 和 [Q02](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q02)。

> **思考**：通道失败不代表后端没有写，五分钟建票锚不覆盖所有改票与Git操作；票据状态也不是实际交付验收。本次仅核代表链，尚不足以采信完整多后端和效率主张，见 [Q02](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q02) 与 [Q03](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q03)。

> **建议**：可探索跨通道共享操作ID、可查询未知结果，并将票据写回确认与业务交付验收分开。此方案未实现，故障注入若不减少重复/误报或人工负担更高则停止，见 [Q04](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1426070939-root"></a>

## [MC Mods Dev Bridge](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md)

[![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/mcmodsdevbridge)

> **用途**：Minecraft 26.3 模组开发者在 AI 写完代码后仍需手工启动游戏、连接、op、操作 UI 和收集证据；基线是人工点测或单侧单元测试。合格结果是同一场景在目标 loader 的真实 server/client 上完成断言，保留日志、截图与 probe 响应，失败后进程和安装文件可清理。 详见[Q01](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md#research-q01)。

> **亮点**：相对人工点测，它把真实双端启动、交互、断言、证据和清理压成可调用流程，并从上游 Forge 1.20.1 扩到 26.3 三 loader。它提供验证基础设施而非测试设计；绿色只证明已写断言，声音、动画手感等仍需人工。 详见[Q03](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md#research-q03)。

> **思考**：最关键质疑是探针观察面是否代表玩家体验。HTTP probe 会改变被测环境，场景可能只验证探针可见状态而漏掉渲染、时序或 loader 特有问题；固定端口 39002 使客户端并发受限。环境包含游戏账号/安装、Java 25、loader 和大型进程，失败恢复成本高。 详见[Q04](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md#research-q04)。

> **建议**：未验证假设是为场景 DSL 加入“人类观察检查点”，在自动 probe 通过后只抽取无法数据化的声音/动画/UI 手感步骤，可显著压缩人工验收。最小实验选 20 个模组功能，对纯人工、纯 probe、混合检查点比较缺陷发现、人工分钟、假阳性与遗漏；混合组漏掉任何高严重度体验缺陷即削弱假设。 详见[Q08](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334714311-root"></a>

## [Minke](../../plugins/lencx--minke/INSIGHT.md)

[![GitHub ★ 693](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=693&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lencx/Minke)

> **用途**：Minke是独立Electron桌面客户端，内嵌DeepSeek Harness及产品overlay，不是装进已有DSH的一项npm插件。它面向需要把代码会话、文件、终端和浏览器放在同一窗口的开发者/知识工作者，合格结果是从对话到工具操作的上下文连贯且能人工接管，不是面板数量。相对原DSH加外部编辑器/浏览器，它把可见共享浏览器、文件终端和本地模型/远程入口组织进一个客户端；预设、Skill、子Agent和模型执行基础归属DSH，不能算Minke新代理引擎。作者明确当前源码与打包发行可能不同，所以本轮固定0.9.0源码不自动代表可下载版本。

> **亮点**：[Q01](../../plugins/lencx--minke/INSIGHT.md#research-q01)、[Q02](../../plugins/lencx--minke/INSIGHT.md#research-q02)增量在可见桌面工作区与私有浏览器桥；[Q03](../../plugins/lencx--minke/INSIGHT.md#research-q03)先关动作入场门和修订校验可借鉴，DSH代理基础与CDP归上游。

> **思考**：[Q03](../../plugins/lencx--minke/INSIGHT.md#research-q03)控制权不等于用户认证，接管不能撤销外部副作用；[Q04](../../plugins/lencx--minke/INSIGHT.md#research-q04)迁移整个客户端的负担可能大于局部便利，源码与发行包不能互认。

> **建议**：可提出未验证的窄范围适配假设：将当前私有IPC背后的可见浏览器控制权、revision和停止语义做成宿主可插拔能力，使已有DSH用户无需迁移整个客户端也能获得人机交接。相对通用浏览器MCP的差异候选是同屏接管及旧修订拒绝，而不是把CDP或owner字段当原创。现有实现强依赖Electron主进程、WebContents、overlay与生命周期，抽离会新增浏览器宿主分发、认证和数据维护成本；本次没有充分需求或替代比较，不能据代码可拆就认定值得生产。最小验证先找到五个经常人工接管网页任务的现有DSH用户，以原浏览器办法、现成可见浏览器工具和窄适配做同任务比较，观察接管后误继续、完成率与迁移意愿；若现成方案已足够或无人愿意配置宿主，就否定独立插件机会。 [Q05](../../plugins/lencx--minke/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/lencx--minke/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1224734286-root"></a>

## [MisakaNet](../../plugins/ikalus1988--misakanet/INSIGHT.md)

[![GitHub ★ 543](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=543&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ikalus1988/MisakaNet) [![npm 30d 7,216](https://img.shields.io/static/v1?label=npm+30d&message=7%2C216&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/misakanet) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/misakanet)

> **用途**：开发者反复遇到工程错误，希望把教训供后续Agent检索，而不是重复从零排障。

> **亮点**：[Q01](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q01) 将问题、修复和来源组织为Git教训；[Q02](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q02) 默认MCP接入及渐进披露使Agent能按需回读，推理与实际修复仍由使用者完成。

> **思考**：[Q03](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q03) 匹配与证据等级不能证明本环境适用，服务器脱敏也不能阻止查询已外发；[Q02](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q02) 服务可启动不等于工具已挂载。

> **建议**：可以提出未验证的环境匹配收据，查询时只携带脱敏软件版本与可公开条件，返回支持/不适用/未知边界及原证据；应用后把真实环境、验证动作和结果作为独立回执，不用检索分数替代修复通过。相对已有搜索与反馈，增量是将“找到相似错误”推进到“本环境已验证或明确不适用”，避免跨机器直接套用。

[查看完整分析](../../plugins/ikalus1988--misakanet/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334569518-root"></a>

## [model-usage-plugin](../../plugins/aks1st--model-usage-plugin/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/model-usage-plugin) [![npm 30d 972](https://img.shields.io/static/v1?label=npm+30d&message=972&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/model-usage-plugin) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/model-usage-plugin)

> **用途**：面向在DSH Web混用多个模型/provider、希望知道token花在哪里和何时使用较多的个人开发者。它把模型用量、估算金额、趋势、工具频率和余额放在设置页，适合形成“哪种调用值得进一步核查”的线索。合格任务是把自有会话的实际usage准确归到模型/时间/来源，并清楚显示价格、套餐与汇率口径。

> **亮点**：把流usage、工具事件、去继承历史与显式套餐/价表/汇率控制接到同一设置页，减少手工整理；金额和工具指标不证明业务价值。详见[Q02](../../plugins/aks1st--model-usage-plugin/INSIGHT.md#research-q02)。

> **思考**：历史扫描在首个会话写日键后跳过同日其它会话，自动补齐不能据此视为完整；自定义余额地址会携带回退到的key，来源检查也只比hostname。未运行漏计或越权复现。详见[Q03](../../plugins/aks1st--model-usage-plugin/INSIGHT.md#research-q03)。

> **建议**：可探索逐会话/事件稳定ID账本与独立扫描watermark，再绑定价版本，比较漏计、重复、重启和资源负担；未实现。详见[Q06](../../plugins/aks1st--model-usage-plugin/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/aks1st--model-usage-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1330531961-root"></a>

## [Oh-DSH](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md)

[![GitHub ★ 323](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=323&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hust-open-atom-club/oh-dsh)

> **用途**：跨桌面、Web及SSH终端开发的DSH用户需要组织同一会话/插件状态；单端用户可先保留原入口。见[Q01](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md#research-q01)。

> **亮点**：发行/表面契约整合与候选Profile预览/恢复减少接线；不证明真实任务效率。见[Q01](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md#research-q01)。

> **思考**：共享不是三端同时可写；apply工具202/accepted只是排队，重启后需读snapshot与功能，Undo仅回退Profile不撤外部副作用。见[Q02](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md#research-q02)。

> **建议**：未验证方向是用transactionId串联受理、重启ready和目标surface功能探针的最终变更回执；以202断连/启动失败比较误报与恢复时间，简单snapshot足够则止于轻量提示。见[Q05](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1379204512-root"></a>

## [oh-my-dsh](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1225Sakura/oh-my-deepseekharness) [![npm 30d 2,109](https://img.shields.io/static/v1?label=npm+30d&message=2%2C109&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)

> **用途**：目标是需要多角色规划、执行和评审的DSH开发者，原办法是人工分派代理并在聊天里维护状态。合格交付应是可定位的各队员产物、完成状态与主仓验收，而非角色数量。README将其定位为OMC/OMX适配，三种模式承担不同任务组织方式；短问题和单文件修改通常不值得额外协议开销。

> **亮点**：相对单纯提示词角色集合，可核查增量是结构化阶段迁移、队员身份、文件邮箱和终态守卫，为团队交接提供外部状态。相对宿主原生子代理，它增加编排约定及可查看的进度账本；角色和skills继承OMC/OMX理念，不应把移植数量当原创。恢复能力仍不等同自动续跑或主仓合并正确性。 依据[Q03](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md#research-q03)。

> **思考**：关键质疑是持久账本能否覆盖读写失败并约束真正执行。readPhaseState的JSON解析失败会抛错，但readFile包在未检查错误码的catch中，读权限或I/O错误也可能返回null；transitionPhasePersist会将null作为initialPhaseState继续，静态链路因此不能支持所有异常都保留阶段的强主张。本轮未制造文件故障，不能称已复现丢失；此外队员登记发生在spawn之后，两个动作不是同一事务。 依据[Q04](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md#research-q04)。

> **建议**：未验证假设是给每次spawn加持久意图和唯一dispatchId，再把未确认派发显式列为待协调，能减少代理已启动但登记缺失时的重复执行。最小实验在spawn前后、registry写前后分别中断，对比原流程与意图账本的重复派发数、可恢复任务数和人工核对时间。若宿主无法以dispatchId查询原代理，意图账本只增加文件而不能降低不确定性，应否定自动恢复收益。 依据[Q08](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1145914675-integrations-dsh"></a>

## [OMA for DeepSeek Harness](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md)

[![GitHub ★ 1,354](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C354&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/first-fluke/oh-my-agent)

> **用途**：它面向已使用或准备采用OMA项目规则、希望DSH工具执行可受规则检查的开发者。合格交付是特定不允许的工具在执行前被拒绝，并把后续质量问题交给Agent修正；不能只因为Agent读过Skill就认定规则已经执行。简单替代是AGENTS/Skill提醒加人工运行检查，规则可靠性依赖模型遵从和人工交接。

> **亮点**：[Q01](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q01)、[Q02](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q02)识别的增量是把原来仅靠Skill提醒和人工检查的OMA项目规则接到DSH执行前后，冻结参数不匹配时拒绝原调用。规则和CLI来自OMA上游；适配价值在准确转换宿主决策，不能宣称自动角色调度或全部交付质量门禁。

> **思考**：[Q02](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q02)表明Stop达到maxStopBlocks只警告并返回，post检查也不能撤销已执行工具。最影响贡献边界的是用户把结束误当验收通过；pre阻断仍有独立价值，严格交付流程需另管未解决状态。本轮未运行反例，不把有限继续设计称为故障复现。

> **建议**：[Q05](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q05)提出未验证的持久验收状态：绑定会话与规则版本保存通过/未解决，最终交付读取；上限结束作为中断而非成功。对持续失败、修正、规则更改和恢复比较错误放行与人工负担，无收益或新过期误拒绝就停止。

[查看完整分析](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1147866277-root"></a>

## [OpenBitFun Agent 工作区](../../plugins/gcwing--openbitfun/INSIGHT.md)

[![GitHub ★ 3,263](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C263&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GCWing/OpenBitFun)

> **用途**：需要跨电脑/手机观察长任务的个人开发者，在选定主机执行并验收成果。

> **亮点**：[Q02](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q02)、[Q03](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q03) 运行时拥有状态投影而非前端拥有执行，使切控制端不必重发任务即可补看当前状态；集成贡献限所查路径，不以作者基准分或模式数量推导。

> **思考**：[Q03](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q03) 可重连的记录不等于主机故障后继续，更不等于副作用一次且仅一次；未知结果时先回读实际状态，不能重发掩盖观察缺口。

> **建议**：[Q05](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q05) 未验证假设是按控制端/网络/Relay/主机/工具结果建立恢复合同，以故障注入比较重复执行、错误完成判断和恢复时间；无改善即停止。

[查看完整分析](../../plugins/gcwing--openbitfun/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350419329-root"></a>

## [OrcaReplay](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md)

[![GitHub ★ 287](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=287&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Continuum-AI-Corp/OrcaReplay)

> **用途**：已有Agent故障调试需求的开发者可在隔离项目中记录模型请求、工具结果和文件变化，用于回放和分叉分析，详见 [Q01](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q01)。

> **亮点**：以外部代理、适配器及文件checkpoint组织同一份可读录制，再用匹配游标承接严格回放和新模型分叉；未匹配与近似匹配明确留痕，能帮助区分录制重现与新调用，见 [Q01](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q01) 和 [Q02](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q02)。

> **思考**：模型回放仍真实执行Agent工具，默认文件恢复也不撤销外部副作用；MCP原件与文件快照还有敏感内容边界。旧字节一致不能证明新模型更好，compare未提供verify时的pass也可能只代表进程退出成功，见 [Q02](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q02) 与 [Q03](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q03)。

> **建议**：可探索逐次列明模型、工具、文件与外部状态冻结范围的回放覆盖清单，把verify和覆盖共同作为模型比较资格。它尚未实现验证，同模型重复/跨模型/外部状态变化对照仍不能解释差异时应否定，见 [Q04](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422240642-root"></a>

## [orchd项目任务面板](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md)

[![npm 30d 359](https://img.shields.io/static/v1?label=npm+30d&message=359&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-orchd) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-orchd)

> **用途**：已有orchd项目在对话旁查任务与依赖，以正确项目、新鲜数据和无意外写入为结果。

> **亮点**：将CLI任务状态映射成会话绑定侧栏，并以参数白名单和去身份环境限制读调用，任务引擎由项目提供。见 [Q01](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md#research-q01)、[Q02](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md#research-q02)。

> **思考**：命令白名单不是项目Python沙箱；Web前缀来源栅栏未统一验证，安装确认还会注入真实用户消息。见 [Q03](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md#research-q03)。

> **建议**：未验证的只读策略/引擎hash/来源状态凭据，可能帮助发现边界漂移；用引擎变更和请求矩阵证伪。见 [Q05](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1133901637-root"></a>

## [Ouroboros 规格先行引擎](../../plugins/q00--ouroboros/INSIGHT.md)

[![GitHub ★ 6,272](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C272&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)

> **用途**：根项目是Python规格先行开发引擎，不是根路径可直接安装的DSH插件。面向需求含糊、需要把访谈结论变成固定验收标准再交给编码运行时的开发者。合格结果必须包含Seed、实现产物和实际可追溯验证，模型讨论或ambiguous分数下降都不等于工作代码。简单基线是人工写验收清单、让单Agent实现并运行测试；本项目增加事件化执行和多阶段评估，需求与最终效益仍需独立任务验证。

> **亮点**：[Q03](../../plugins/q00--ouroboros/INSIGHT.md#research-q03)识别的贡献是不可变目标、执行迭代和证据门槛的组合，相对人工清单+单Agent提供统一事件化编排；并非规格、CI或MCP概念原创。价值成立于验收可执行且命令覆盖实际目标，简单任务可能无需该层。

> **思考**：[Q04](../../plugins/q00--ouroboros/INSIGHT.md#research-q04)说明实际执行绿灯仍不证明业务覆盖；跨验收项共享Stage1依赖严格不变量，模型意见不得提升证据但也不能填补错误验收。根仓库审阅只是关键路径，不等于全运行时审计。

> **建议**：[Q08](../../plugins/q00--ouroboros/INSIGHT.md#research-q08)提出未验证的逐验收项检查覆盖映射，用测试绿但业务错、产物缺失等反例测误放行率和维护负担，反证可直接否定增加这一层的价值。

[查看完整分析](../../plugins/q00--ouroboros/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1321152436-root"></a>

## [phi](../../plugins/pulseaiclub--phi/INSIGHT.md)

[![GitHub ★ 681](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=681&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pulseaiclub/phi)

> **用途**：终端开发者连接多个 MCP 服务，在编码任务中按需发现与调用工具。

> **亮点**：[Q01](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q01) 与 [Q02](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q02) 的增量是将 MCP 工具发现、详情与调用映射到既有文件工具；减少静态工具定义并保留按需探索路径，实际总 token 未测。

> **思考**：[Q02](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q02) 未完整核验全部 Agent 调度权限链，[Q03](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q03) 显示 --tools 仅约束内建工具；渐进披露不能自动代表完整隔离或远端副作用可撤销。

> **建议**：[Q04](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q04) 提出以合格任务总 token 检验渐进披露；若额外探索抵消 Schema 减少，或漏用工具增加，则否定成本优势。

[查看完整分析](../../plugins/pulseaiclub--phi/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334504487-root"></a>

## [Plan Lattice](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1052326311/dsh-plan-lattice)

> **用途**：长任务经上下文替换后仍需沿用已批准计划、人类要求和已返回委派结果；高风险写入可显式启用完整控制。

> **亮点**：把 DSH 自有 Session/plan/委派事实在真实 surface 替换后有界回填，避免创建第二个自动计划器；显式模式把契约、目标事实与受保护变更绑定，详见[Q01](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q01)、[Q02](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q02)。

> **思考**：默认 auto 不装写入门禁，显式模式也仅守护列名工具且外部副作用依赖 adapter；12/12 是手工设计机制样本，V17/V18/V20 不支持通用提升，详见[Q02](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q02)、[Q03](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q03)。

> **建议**：已有实现已过滤隐藏来源、保成功计划/前台最近3项并按maxContextBytes降级；进一步可研究在合格候选内部按当前子任务需求提供来源引用/缺口、必要时回退原投影。若遗漏权威或增加错续写则反证。此方向尚未实现，详见[Q03](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1209966933-root"></a>

## [REA](../../plugins/morluto--rea/INSIGHT.md)

[![GitHub ★ 383,061](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=383%2C061&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/rea) [![npm 30d 634,260](https://img.shields.io/static/v1?label=npm+30d&message=634%2C260&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)

> **用途**：用于许可内本地应用功能理解和证据辅助重实现；本项重点是JavaScript/Electron静态路径，不是DSH专用插件。[Q01](../../plugins/morluto--rea/INSIGHT.md#research-q01)

> **亮点**：相对直接调用分散分析器，贡献是统一契约、可取消会话及可追溯/带限制的证据交付；不能将上游反编译能力或工具数量计为原创算法。[Q01](../../plugins/morluto--rea/INSIGHT.md#research-q01)

> **思考**：哈希、推断标签与结构化结果保证可追溯表达，不保证静态图和功能解释正确；可选提供者和变更操作也需要具体环境与权限。[Q02](../../plugins/morluto--rea/INSIGHT.md#research-q02) [Q03](../../plugins/morluto--rea/INSIGHT.md#research-q03)

> **建议**：未验证假设是以证据覆盖和反证缺口约束下游重实现，减少错误复刻；对照已知源码构建物的直接工具人工分析，若错误或复核成本不降则否定。[Q04](../../plugins/morluto--rea/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/morluto--rea/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1216785679-root"></a>

## [Reasonix](../../plugins/esengine--deepseek-reasonix/INSIGHT.md)

[![GitHub ★ 35,959](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C959&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/esengine/DeepSeek-Reasonix)

> **用途**：面向需要本地编码Agent或DSH委派只读研究/评审的开发者；根项目是工具/应用，DSH bundle只是子目录配置。[Q01](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q01)

> **亮点**：本体把编码引擎组织为多前端与权限接口；DSH集成复用ACP以配置完成委派，增量是可用接线而非新协议或宿主保证。[Q01](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q01)

> **思考**：自动allow不是逐次人工审批，nil Approver与Ask语义需按前端核对；新进程不共享父会话，rewind不覆盖shell副作用。[Q02](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q02) [Q03](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q03)

> **建议**：未验证假设是父子交换验证命令、修改范围及不可恢复副作用收据，减少正常结束被误当完成验收；对照错误/取消任务的父误判和恢复时间，无改善则否定。[Q04](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/esengine--deepseek-reasonix/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-995029641-root"></a>

## [Ruflo](../../plugins/ruvnet--ruflo/INSIGHT.md)

[![GitHub ★ 79,217](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=79%2C217&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ruvnet/ruflo) [![npm 30d 49,674](https://img.shields.io/static/v1?label=npm+30d&message=49%2C674&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow)

> **用途**：已有多Agent软件任务的开发者可用CLI/MCP组织分工与状态；独立元宿主，Claude专用mods不外推DSH。[Q01](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q01)

> **亮点**：相对手工分配多个Agent，统一状态、模型执行和观察入口；增量是协调接线而非角色/工具数量或已证实自学习收益。[Q01](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q01)

> **思考**：静态关键词confidence非成功概率，API无错误也非产物正确；多个JSON状态不构成端到端任务事务，需独立验收和恢复对账。[Q02](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q02) [Q03](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q03)

> **建议**：未验证假设是将API成功与独立产物验收分通道，只让合格交付影响质量路由；同模型预算隐藏测试对照，若通过率与成本取舍不改善则否定。[Q04](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/ruvnet--ruflo/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1178833585-plugins-dsh"></a>

## [SkillHub for DSH](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md)

[![GitHub ★ 5,292](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C292&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iflytek/skillhub) [![npm 30d 257](https://img.shields.io/static/v1?label=npm+30d&message=257&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh)

> **用途**：面向需要经常从SkillHub发现、固定版本安装和维护技能的DSH用户。原办法是浏览网页、下载归档、复制技能目录和手工记录版本；合格结果应区分文件完成、库存记录、DSH发现与模型实际调用。组件仅是plugins/dsh原生桥接，不将SkillHub服务或CLI整体能力算成插件实现。

> **亮点**：相对网页下载加手工复制，增量是精确版本与指纹、用户/项目位置、来源和会话范围绑定，以及结果未知时查原操作。它把“安装成功”的多个阶段拆开，避免同名目录认领其他来源或把accepted当完成。业务仍是技能分发维护，不是自动证明技能安全或更好完成用户任务；匿名市场审核不可访问不能当通过。 依据[Q03](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q03)。

> **思考**：关键质疑是安装文件到模型真正可用之间存在多层状态。Host已经把discovery confirmed/unconfirmed分开，README明确本地文件存在不代表DSH启用、历史完成不代表当前安装。兼容门禁严格到Host/Client发行版和Cordis组合，普通profile隔离也不隔离共享inventory。旧CLI与v2库存混写、或只恢复旧inventory而不恢复技能文件，会破坏管理假设。 依据[Q04](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q04)。

> **建议**：未验证假设是将“文件已完成、当前发现、允许调用、最近真实使用”并列显示，能减少用户因技能不可用而重复安装。用同名覆盖、禁用用户调用、旧回执、来源变更和Host重启场景，比较当前提示与四状态卡的重复提交数和问题定位时间。若用户仍把历史成功误解为当前可用，或检查扰动文件状态，应停止扩大自动管理。 依据[Q08](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1164005541-root"></a>

## [VibeSkills](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md)

[![GitHub ★ 3,768](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C768&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/foryourhealth111-pixel/Vibe-Skills)

> **用途**：VibeSkills针对已有很多本地Skill、需要多种专业交付物的用户，目标把需求冻结、模块分解、Skill选择和验收连成流程。合格结果是实际交付物满足任务标准，不是生成计划与proof文件。原办法由用户手选Skill并维护计划；作者给出195个Skill池的SkillsBench对照，但这是作者报告，不能代表当前提交在DSH上的效果。简单问答或单命令任务不应承担完整治理流程，SKILL入口也明确允许不进入vibe。

> **亮点**：[Q02](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q02)相对只写计划，把原任务、模块选择、阶段重入和验收记录接入可核查runtime；贡献在组织与治理，bundled第三方Skills本身不计原创。

> **思考**：[Q03](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q03)、[Q04](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q04)proof链不能替代专业交付验收，作者OpenHands评测也不能直接证明当前DSH收益；部署和多次确认负担必须计入。

> **建议**：[Q05](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q05)提出按风险缩减proof与阶段开销的未验证假设，用完整流程和手选Skill作对照检验合格率及人工时间。

[查看完整分析](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1232030145-root"></a>

## [WeSight](../../plugins/freestylefly--wesight/INSIGHT.md)

[![GitHub ★ 961](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=961&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/freestylefly/wesight)

> **用途**：面向需要在多个本地编码CLI间切换并查看文件和任务状态的开发者。

> **亮点**：把CLI配置、图形会话、文件变化与指标集中到桌面，贡献在工作流整合，推理和工具执行仍由各引擎承担。[Q01](../../plugins/freestylefly--wesight/INSIGHT.md#research-q01)

> **思考**：统一界面不等于统一权限、取消或恢复语义；本次Codex路径显式传权限参数，也不能证明其他引擎和IM入口同等约束。[Q02](../../plugins/freestylefly--wesight/INSIGHT.md#research-q02)

> **建议**：按固定引擎版本保存并展示能力契约，仅开放已验证的恢复与审批操作，比较误操作和排障时间；尚未验证。[Q04](../../plugins/freestylefly--wesight/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/freestylefly--wesight/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335843750-root"></a>

## [Witness（dsh-verify）](../../plugins/263311487-ux--dsh-verify/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/263311487-ux/dsh-verify) [![npm 30d 2,530](https://img.shields.io/static/v1?label=npm+30d&message=2%2C530&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verify) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verify)

> **用途**：有明确网页验收标准的开发者/CI用户，需要真实浏览器检查交付中的具体行为。

> **亮点**：把常见动作/断言、真实浏览器和报告封装为JSON流程，并接CLI/MCP/DSH，减少手写接线；确定性执行不等需求、覆盖或作者独立。[Q01](../../plugins/263311487-ux--dsh-verify/INSIGHT.md#research-q01) [Q02](../../plugins/263311487-ux--dsh-verify/INSIGHT.md#research-q02)

> **思考**：首次截图基线创建即PASS不能当视觉回归通过；DSH spawnSync阻塞Host且注册失败静默；serve优先于url还可能使实际目标与工具描述不符。通过只对应本次给定断言。[Q03](../../plugins/263311487-ux--dsh-verify/INSIGHT.md#research-q03)

> **建议**：未验证假设是运行收据绑定构建、spec、浏览器及批准基线，并分开新建基线/比较通过/runner错误；故障集盲评判断范围与误放行，无改善或额外成本过高即否定。[Q05](../../plugins/263311487-ux--dsh-verify/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/263311487-ux--dsh-verify/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1309769324-root"></a>

## [working-activity](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md)

[![GitHub ★ 667](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=667&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ccch1mneyyy/working-activity) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/pi-working-activity) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/pi-working-activity)

> **用途**：长时间编码任务操作者需要看懂当前活动，原办法是转圈提示和完整日志。

> **亮点**：[Q01](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q01) 与 [Q02](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q02) 的增量是把工具事件、耗时和实时自述集中成可消费的状态投影，降低查找活动的步骤；不证明编码任务更快。

> **思考**：[Q03](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q03) 默认自述增加上下文和输出，且活动结束不等于交付通过；宿主事件与客户端版本会影响显示。

> **建议**：[Q04](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q04) 提出分开显示已观察活动与模型意图；若不能减少误取消和卡住误判，增加文案没有成立的收益。

[查看完整分析](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335211378-root"></a>

## [无限五代 IG5](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md)

[![GitHub ★ 3,459](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C459&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Minglink/dsh-infinite-gen-5)

> **用途**：面向处理自有或获授权二进制的逆向分析人员，将静态函数检视、调试、网络采集和证据报告连到DSH。合格交付物应绑定样本哈希、数据库修订和实际观察，区分反编译/仿真推断与执行证据。原办法是独立Ghidra、调试器和人工报告；需要跨引擎来回复核的任务才可能受益，偶发查看字符串不必承担整个工作台。作者说明Core8/Full40是暴露配置，不把工具数量当业务收益。

> **亮点**：[Q02](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q02)把样本稳定身份、多引擎worker、宿主审批与报告归属连成流程，减少地址/样本错配；底层反编译和调试能力归属原引擎。

> **思考**：[Q03](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q03)审批不等于sandbox或完全Undo，事后审计写失败还可能无日志；静态推断不能替代真实执行证据。

> **建议**：[Q05](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q05)提出关键修改意图与结果双记录的未验证假设，用磁盘故障和worker退出对照结果可判定性。

[查看完整分析](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md) · [返回表格](#category-index)

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-10-29
