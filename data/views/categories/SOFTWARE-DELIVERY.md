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
| [@99galaxy/dsh-plugin-market](#plugin-1367597810-root) | 在 DSH 侧栏浏览社区插件目录并安装插件。 | [Q04](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q04) 备份隔离 profile，先审查固定来源，再安装一项并核宿主加载。 |
| [@dsh-external/dsh-zero-residence](#plugin-1366089972-workspace-plugins-dsh-zero-residence) | 用确定性工具指针清单替换模型摘要，提供日志召回、近似上下文账本、强制压缩探针及异步PowerShell命令句柄。 | 先观察，先验证原件恢复hash、会话范围和受控后台任务生命周期，勿当生产无损压缩/沙箱。 |
| [@dsh-lsp-packs/dsh-lsp-cpp](#plugin-1344713526-dsh-lsp-cpp) | 把 clangd 配置为 DSH 的 C/C++ LSP 后端，为共享 lsp 工具提供导航、引用、实现和 hover。 | 有稳定 clangd 与 compile_commands 的 C/C++ 项目可在只读导航任务中试用；先核四个操作对 sample 和本项目代表文件的结果，再允许模型依赖它改代码。 |
| [@hyzyn/dsh-codegraph](#plugin-1335046216-packages-codegraph) | 在 DSH 中查看 Codegraph 索引、搜索符号与调用关系，并按会话项目挂载 MCP 工具。 | 已有Codegraph CLI的开发者可先用两个可重建测试项目做只读查询，核对实际挂载模式、项目根和无索引会话的工具暴露，再决定是否扩大使用。 |
| [@hyzyn/dsh-tty](#plugin-1335046216-packages-tty) | 在 DSH Web 提供真实 PTY、SSH 终端与 Agent 读写工具，支持文件传输、转发及可选模型解释。 | 先观察，在可重置非关键环境核对档位服务、未知状态、取消留活及显式清理；AI关闭且不配生产连接。 |
| [@indexyz/dsh-autocompact](#plugin-1324229194-dsh-autocompact) | 为 DSH 会话或模型设置更早触发自动上下文压缩的阈值。 | [Q04](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q04) 在可重做的单路由任务中记录摘要、约束和总成本；若结果退化或 warning 持续，停止试用并按命令语义恢复默认。 |
| [@mstar-harness/dsh](#plugin-1174622182-packages-dsh) | 将 Morning Star 工作流门禁、命令和面板接入 DeepSeek Harness。 | [Q04](../../plugins/btspoony--mstar-harness--packages-dsh/INSIGHT.md#research-q04) 在隔离 profile 先确认根、门禁模式、工具名称与 MCP 信任，出现 degraded 或身份不明时恢复人工审查。 |
| [@opencues/dsh](#plugin-1197335472-integrations-dsh) | 将 OpenCues 写作建议与下划线补全接入 DSH 输入框。 | [Q04](../../plugins/opencues--opencues--integrations-dsh/INSIGHT.md#research-q04) 先用合成文本核对路由、费用和共享配置，退出时检查残留。 |
| [@pbfuzz/dsh-kanalyzer](#plugin-1227673478-packages-dsh-kanalyzer) | 为 DSH 提供 C/C++ LLVM bitcode 准备、KAMain 静态可达分析及调用关系查询。 | 先在可信小项目核对一条已知路径；没有距离时保留未知并使用动态覆盖。 |
| [@pbfuzz/dsh-pbfuzz](#plugin-1227673478-packages-dsh-pbfuzz) | 为 DSH 提供定向 fuzz 的计划、生成、执行、复盘与触发证据报告。 | 在隔离授权的教学项目上先检查一次构建、停止和独立回放；不满足时回手工 harness。 |
| [7d-code-reviewer](#plugin-1336021761-root) | 一个注册到 DSH skills 的模板驱动代码审查 Skill，要求模型输出分级问题、评分与文字/HTML 报告。 | 以小范围 diff 试用，人工核行号/复现与 HTML 安全；避免分数代替审查结论。 |
| [Aegis](#plugin-1225840521-root) | 为 AI 编码助手提供任务路由、工程方法及验证指导。 | [Q03](../../plugins/ganyuanran--aegis/INSIGHT.md#research-q03) 在隔离仓库对照首次动作和交付证据；路由未生效或成本过高时停用自动激活。 |
| [Agency Agents](#plugin-1334939514-root) | 为 DeepSeek Harness 提供专家角色名册、单专家召唤和专家团协作。 | [Q03](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q03) 用两个互补角色对照单 Agent 审查小改动，先验任务和证据，再扩大范围。 |
| [Agent Handoff Skill](#plugin-1230123793-root) | 为多种编码 Agent 建立仓库级交接文件，并辅助初始化、维护和归档。 | 先用测试仓库预览，核对规则差异后再试一次新会话。 |
| [Agent Team](#plugin-1336524975-root) | 在DSH创建独立root Agent成员，共享工作区，通过Leader任务板与消息协作。 | [Q05](../../plugins/limuyang2--agent-team/INSIGHT.md#research-q05)观察；先私有匹配Host/两成员/隔离分文件任务，对照人工签收，完成/消息未知先停新分派。 |
| [Agent Vision Toolkit](#plugin-1319174653-root) | 为文本编码 Agent 提供图像问答、定位、长截图 OCR、像素处理与可选视觉代理。 | 建议公开截图的手工CLI限定试用，先保留原图复核和现有模型；敏感出站、漏段或重试成本不可控时停用并回原生视觉/人工检查。 |
| [agent-development-constraints](#plugin-1404700411-root) | 提供项目开发规则库与提炼精简合并流程，DSH按症状查询规则并一次注入入口目录，另有上下文成本观察和可选提交脱敏检查。 | 先观察，可人工择取规则方法，先核隐私/路由/会话和安装保留再在重要项目启用运行面。 |
| [agent-qa](#plugin-1232322871-root) | 用自然语言描述用户旅程，在 Web、Android 或 iOS 上执行测试并保留可检查证据的 QA 工具。 | [Q03](../../plugins/vostride--agent-qa/INSIGHT.md#research-q03) 先选可重置且不影响生产的少量旅程，把它作为探索补充并保留确定性断言。 |
| [AgentCompare](#plugin-1442340074-root) | 在 DSH 主对话内生成并比较 2–4 版回答、文件或网页，选择后审查采用。 | 只在无敏感数据的普通非 Git 目录试两版会生成文件的任务。 |
| [AgentDebugX](#plugin-1296792947-root) | 把Agent轨迹转为诊断报告、恢复建议和可区分模拟的重跑记录 | [Q04](../../plugins/agentdebugx--agentdebugx/INSIGHT.md#research-q04) [Q04](../../plugins/agentdebugx--agentdebugx/INSIGHT.md#research-q04) 先脱敏离线heuristic，live需外置审批、隔离runner与外部验收。 |
| [AgentRQ](#plugin-1190390511-root) | 为人类与 AI Agent 提供共享工作区、任务和协作入口。 | 隔离工作区先核验授权、审批和产物；不明状态停用远程操作。 |
| [AI Look-Up](#plugin-1401618027-root) | 观察代理工具行为并在长任务中注入自审提醒与时间锚点。 | 先审查各通道、数据和预算；非敏感任务试用并人工复核提醒。 |
| [AI 残渣清运](#plugin-1406611614-root) | 按规则把代理副产物移入可恢复回收站，并支持项目结项归档。 | 适合副产物命名规律稳定、能先维护 ignore 且使用版本控制的项目试用；高价值数据目录或命名混乱仓库只运行 dry-run。 |
| [All in Luna](#plugin-1321408361-root) | 以持久TaskGraph、资源调度、宿主动作回执和独立验收组织跨会话任务，包含DSH适配。 | 当前观察。 |
| [ANet DSH Bundle](#plugin-1302597978-deploy-plugins-dist-dsh) | 为 DSH 操作者将本机 anet 节点接到 MCP 与 Skill，以统一可执行路径和身份发现对端、委派任务并跟踪结果。 | 观察优先，操作者先关闭自动装并固定审阅运行时/guide/身份/节点政策，才确定非敏感无消费小样；版本/政策不明或任务/worker仍未知先停扩张并核状态。 |
| [API Relay Audit](#plugin-1195794651-root) | 本地探测 AI API 中转行为并生成审计报告。 | [Q04](../../plugins/toby-bridges--api-relay-audit/INSIGHT.md#research-q04) 仅在授权的隔离环境使用低权限临时凭据；审查敏感报告并撤销凭据。 |
| [Archify](#plugin-1211139949-root) | 让 Agent 将需求或代码关系制作成可交互的独立 HTML 图表和说明页。 | 按 [Q05](../../plugins/tt-a1i--archify/INSIGHT.md#research-q05) 先选一条可独立复核的缓存链，将候选与输出放进独立目录。 |
| [Archify DSH](#plugin-1211139949-integrations-deepseek-harness) | 通过 DeepSeek Harness 的文件系统 Skill 提供器加载随包分发的 Archify 图表技能。 | 按 [Q05](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q05) 在隔离 profile 记录现有个人和项目 Skill，核对 Archify 实际来源后试画一条请求链，并从工作区打开。 |
| [Aria](#plugin-1225585638-root) | 提供响应式状态、异步和跨平台 UI 绑定的 C++ MVVM 框架。 | [Q04](../../plugins/dqsjqian--aria/INSIGHT.md#research-q04) 先在单一目标平台验证工具链、线程和回滚；不能满足平台或安全条件时保留原生方案。 |
| [baro-dsh](#plugin-1188682315-packages-baro-dsh) | 将 Baro 编码流程作为 DSH 子代理委派并显示任务状态。 | [Q04](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md#research-q04) 在隔离环境核查权限、状态和退出；按 [Q03](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md#research-q03) 核验目标而非只看状态。 |
| [Better Sidebar](#plugin-1326893710-root) | 为 DSH 提供会话侧栏和底部工作台，用于文件、变更、任务和侧聊。 | [Q04](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q04) 建议先用独立低权限账号执行一个只读任务。 |
| [Better Workspace File Manager](#plugin-1425087677-root) | 在 DSH Web 中管理工作区文件，支持上传、移动、下载和带版本检查的文本编辑。 | [Q04](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md#research-q04) 先用隔离副本测试冲突和退出。 |
| [Billion Context](#plugin-1324949198-root) | 面向长会话的上下文压缩工具，可按范围生成摘要、检索并回读内容。 | 只在脱敏的独立 profile 试一个已有验收标准的范围。 |
| [Brooks Lint](#plugin-1192608669-root) | 基于工程书籍整理代码质量评审技能，提供风险诊断、分数与多种审查模式。 | [Q04](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q04) 建议先在允许外发的小 diff 试用 review 并保留人工评审；选区不全或发现无法核对时停止依据报告作决策。 |
| [CA 参考库](#plugin-1349267272-root) | 为Clean Architecture审查提供本地参考仓全文检索、基线清单、审查留账和观察面板。 | 建议先观察，补齐可核对的外部语料并验证过滤与健康状态后再做受控审查辅助；不能自动据基线放行项目。 |
| [Caliper](#plugin-1237259189-root) | 真实安装 Agent Skill，重复运行任务并分别评估激活、执行检查与有无 Skill 的差异。 | [Q03](../../plugins/edonadei--caliper/INSIGHT.md#research-q03)仅在独立环境对可信spec小试，先关闭user customizations并查实际工具清单。 |
| [CC Safety Net](#plugin-1122873619-root) | 为 DSH 等编码工具提供执行前规则，检查危险命令和敏感文件访问。 | [Q03](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q03) 先核固定 profile、工具名单和工作目录。 |
| [Cetus](#plugin-1281865940-root) | 在一个桌面客户端中管理多个 Agent CLI 的会话，包括通过 ACP 接入 DSH。 | [Q03](../../plugins/drewnekota--cetus/INSIGHT.md#research-q03) 用临时 home 验证。 |
| [ChatGPT Subscription](#plugin-1335287168-root) | 为 DSH 接入 ChatGPT 账号登录、凭据续期和宿主模型路由，并在设置页显示绑定状态。 | 继续观察。 |
| [CI Diet](#plugin-1426954291-root) | 发现GitHub Actions资源浪费，生成可审阅的局部工作流计划，提供DSH工具、批准恢复及样本比较。 | 先用可恢复仓库离线scan并人工复核一个候选，历史、写入与测量逐段启用；质量/净资源不改善就停止该规则，冲突保留后续编辑再合并。 |
| [CloudBase AI Toolkit](#plugin-988892963-root) | 通过 MCP 和 Skill 将 CloudBase 开发与资源管理接入 Agent。 | [Q04](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md#research-q04) 先用隔离、最小权限环境核查；生产写入须明确授权。 |
| [CloudBase DSH Plugin](#plugin-988892963-dsh-plugin) | 将 CloudBase MCP 工具与结果面板接入 DSH。 | 隔离环境先只读，写操作核对环境与审批；超时查云端再决定。 |
| [Clutch DSH Worktree](#plugin-1339297063-packages-clutch-dsh-worktree) | 在 DSH 工作区内浏览 Git 工作树与会话，为目标工作树创建并派发原生会话，将归档、清理和退出管理分开。 | [Q04](../../plugins/cerbur--clutch-dsh--packages-clutch-dsh-worktree/INSIGHT.md#research-q04) 使用临时仓库验证两条分支的原生会话各自绑定到对应工作树。 |
| [Cocode](#plugin-1334020974-root) | 将 DeepSeek Harness 组装为桌面和终端开发环境，通过 Supervisor 共享宿主。 | [Q04](../../plugins/cocode-agency--cocode/INSIGHT.md#research-q04) 先用独立 home 验证两端切换。 |
| [Code RAG 索引面板](#plugin-1347752454-plugins-dsh-code-rag-index-panel) | 在DSH会话显示Code RAG索引状态与进度，并提供索引操作、设置和诊断卡片。 | 建议已有本机code-rag基础设施且能核对目标根的开发者试用；普通搜索需求先比较现有工具，setup和重建须按实际写入与算力操作处理。 |
| [Codex Switch](#plugin-1269132133-root) | 独立macOS配置工具，切换Codex供应商、桥接Responses与Chat并管理本地代理。 | [Q04](../../plugins/kuangre123--codex-switch/INSIGHT.md#research-q04) 独立副本先核历史和退出，不在生产历史直接试。 |
| [Codex Taskboard](#plugin-1311108439-root) | 提供可在浏览器或 Codex 中使用的本地优先任务看板，并让界面和 taskctl 共用 HTTP API。 | 先在 loopback 的独立项目试两方交接，用小任务验证只一次认领、可查看评论、显式确认后完结。 |
| [Codex Taskboard for DeepSeek Harness](#plugin-1311108439-integrations-deepseek-harness) | 在 DeepSeek Harness Web 侧栏添加任务面板入口，打开启动器当前运行的 Codex Taskboard。 | [Q04](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q04) 仅用隔离 Web profile 的已有测试任务确认面板和独立页面读取一致，发现错实例、空白或外链失效时回独立页面。 |
| [codex-guard](#plugin-1340906871-root) | 为 DSH 注册本地 Git 差异扫描工具，仓库同时提供独立 PR 检查。 | [Q03](../../plugins/akimiya-z--codex-guard/INSIGHT.md#research-q03) 用测试仓库对照本地报告与 PR 检查。 |
| [Coding Tools MCP](#plugin-1245329241-root) | 通过 MCP 提供工作区文件、补丁、命令和 Git 编码工具。 | 在隔离环境用可丢弃仓库验证补丁和权限；不可信工作缺额外沙箱时停止。 |
| [CodingNS for DeepSeek Harness](#plugin-1386538234-root) | 在 DSH 中整合外部编程 Agent、项目工具、智能助理和按需远程访问。 | 在独立profile只选一个已登录的外部Agent，先用可丢弃项目检查正确cwd、线程续接、审批允许与拒绝、提问取消及停止结果，再考虑生产任务。 |
| [Comi Pet](#plugin-1359009818-root) | 独立桌宠可跟随编码助手的工作和审批状态，并在桌面与 DSH 界面内切换显示。 | [Q04](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q04) 先在可退出的本机 profile 试三种状态。 |
| [Context Doctor](#plugin-1332210938-root) | 只读扫描 DSH 指令、技能目录与工具信息，估算上下文成本并给出重复和冲突线索。 | 仅在受控本机profile用非敏感已知样本做来源诊断，核对cwd和scope；需要定位再取developer。 |
| [cosyncing](#plugin-1327124384-root) | 通过自托管 broker 查看和控制 CLI 编码 Agent 会话，并跨自有设备同步 | 仅对确切DSH版本、可信设备与非敏感项目做前台live交接。 |
| [create-dsh-plugin](#plugin-1333152408-packages-create-dsh-plugin) | 生成五类 DSH 插件骨架并提供编译与配置检查的开发者命令行工具 | 建议观察，见 [Q04](../../plugins/whyihaveyou--dsh-suite--packages-create-dsh-plugin/INSIGHT.md#research-q04)。 |
| [Crossfire](#plugin-1399279897-root) | 在 DSH 对已定稿成果组织红队评审并由用户逐条裁决。 | 隔离副本先核实专家工具权限，用户逐条复核，异常转人工。 |
| [DeepSec](#plugin-1295322882-root) | 结合 Shield 代码审计、Spear 授权测试、CLI/TUI 与 IDE 接入的安全工具平台 | [Q04](../../plugins/unclecheng-li--deepsec/INSIGHT.md#research-q04) 仅在自有副本试用本地Shield并人工确认finding；不可读文件或覆盖不明时停止依赖零发现结论，回原扫描和人工审阅。 |
| [DeepSeek Flow](#plugin-1334460196-root) | 以Markdown文档和可审阅画布共同编辑工作流 | [Q04](../../plugins/kanghelyu--dsh-deepseek-flow/INSIGHT.md#research-q04) 隔离小流程并备份，检验双向同步和中断恢复。 |
| [DeepSeek Harness ACP](#plugin-1333224461-root) | 把 DSH Agent、会话和工具事件接入 ACP 编辑器，提供独立启动器与原生插件入口。 | 在一次性工作区逐次审批，先读后做可恢复修改，核对实际宿主、目录及 MCP；异常停进程检查副作用。 |
| [DeepSeek Harness CLI](#plugin-1333781342-root) | DeepSeek Harness 衍生终端客户端，提供交互、exec、会话恢复及平台包启动入口。 | 已有官方宿主的开发者当前保留原环境并观察。 |
| [DeepSeek Harness Desktop（xiincs）](#plugin-1333376987-root) | 用 Tauri 封装本地 DSH Web 服务，提供托盘常驻、文件面板、终端和确认后安装插件的入口。 | 只在独立HOME和副本项目试用，核对自动恢复变更与后台进程；出现非预期覆盖或移除就回到原工具与备份。 |
| [DeepSeek Harness Desktop（社区版）](#plugin-1333486649-root) | 集成官方 DSH Runtime 和 Web UI 的社区桌面客户端，提供窗口、插件及桌面操作入口。 | [Q04](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q04) 仅建议能核对发行来源和权限的开发者用独立profile及非关键目录探索，先确认启动、完整输出和重启保留结果；权限或恢复不清立即停止，回到官方Web。 |
| [DeepSeek Harness for VS Code](#plugin-1333429325-root) | 在 VS Code 提供基于内置 Harness 运行时的原生工作台与会话入口。 | [Q04](../../plugins/skymecode--deepseek-harness-for-vscode/INSIGHT.md#research-q04) 先验证对应平台包并保留旧历史。 |
| [DeepSeek Harness for VS Code](#plugin-1333721673-root) | VS Code 客户端扩展，内嵌 DSH 网页并桥接工作区、剪贴板和可选 Copilot 模型请求。 | 观察。 |
| [DeepSeek Harness Tauri Desktop](#plugin-1333718792-root) | 提供 DSH 桌面界面、内核与运行时管理和数据迁移。 | 先在独立测试账户用不含敏感资料的档案核对真实启动、插件加载和一次会话读取。 |
| [DeepSeek Reasonix](#plugin-1216785679-root) | 独立多前端编码Agent，通过模型工具循环改文件/验证；另有DSH ACP配置包。 | [Q05](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q05)低权副本/人类普通输入小改并人工验；外部caller/来源未核不启自动委派，状态不明回IDE/VCS。 |
| [DeepSeekGUI](#plugin-1337578630-root) | 基于 DSH 的本地桌面工作台，组合项目会话、Git、记忆、浏览器及数据管理。 | 在项目副本和独立托管 Home 先读文件再小改动，核对实际模型、审批与 diff；迁移保留旧副本，异常回到原 DSH。 |
| [DeepSpider](#plugin-1142234916-root) | 基于 DSH 的浏览器分析工作台，组织请求证据、Cookie 独立生成、验证与 Solver 交付。 | [Q04](../../plugins/ma-pony--deepspider/INSIGHT.md#research-q04) 当前观察；在隔离环境先验证自有页面，权限、语义验收或独立重跑不清楚时停止。 |
| [DeepTide](#plugin-1230068255-root) | 提供 DeepTide 编码客户端入口、Zero CLI 命令别名、Rust实现与 Apple Silicon 本地推理引导。 | 建议先观察并固定单一形态和上游版本；本地profile不满足或自测失败时不继续切配置，保留原客户端/云API作为退路。 |
| [Déjà Vu](#plugin-1300173275-root) | 为编码助手索引本机会话历史，并提供跨会话检索与召回。 | [Q04](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q04) 使用隔离历史先查一条已知错误并核原文；若权限、数据去向或索引状态不清，停止自动使用并回查日志。 |
| [Desktop CC GUI](#plugin-1148960257-root) | 多引擎 AI 编码桌面客户端，接入 DSH 原生宿主会话和结构化事件流。 | [Q05](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q05) 仅用低权限宿主和本地可销毁工作区试一次非敏感读取。 |
| [dock-base](#plugin-1340492184-root) | 为DSH web提供统一布局、视图实例、命令和设置注册服务，供功能插件按需组合。 | 有多视图组合需求可试用，先核对上下文与异步关闭；逐个研究功能插件而非默认全装。 |
| [dock-editor](#plugin-1340492335-root) | 为 dock 文件域增加同工作台的文本查看、编辑、保存与关闭提醒。 | 可对非关键小文本进行受控试用，保存后回读目标并留版本库或备份；对并发编辑和重要配置沿用有冲突检测的工具。 |
| [dock-git](#plugin-1340492447-root) | 在 DSH Dock 中查看 Git 提交图与差异，并对会话仓库执行暂存、提交、分支和远端操作。 | 建议观察，先在隔离仓库核对钩子策略、破坏操作确认和远端失败恢复；团队质量门禁另作明确安排。 |
| [Dockyard DSH](#plugin-1335490343-root) | 以原生provider适配和账户池在DSH管理登录、模型目录、额度与多Key请求切换。 | [Q04](../../plugins/aitabby--dockyard-dsh/INSIGHT.md#research-q04) 独立进程先核全局补丁恢复再接测试账号。 |
| [DoYourWeb](#plugin-1417162408-root) | 在 DSH 对话引用浏览器标签、添加页面标注，并通过连接器或桌面驱动操作应用。 | [Q04](../../plugins/sheepofsheep--dsh-doyourweb/INSIGHT.md#research-q04) 只建议隔离浏览器做单标签读取，不用常用账号或上传任务作为初试。 |
| [DS Harness Remote](#plugin-1334325657-root) | 让受信设备从 Web、桌面或移动端接入原 DSH 宿主的会话、工作区和终端。 | [Q04](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q04) 从低权限只读工作区核对一条原会话，断线或身份不明时回主机查实际状态。 |
| [DSH Agent Studio](#plugin-1376053947-root) | 在 DeepSeek Harness 中配置 Agent 的提示词、工具、技能、子代理和模型，并提供按角色委派。 | [Q04](../../plugins/thissensen--dsh-agent-studio/INSIGHT.md#research-q04) 使用独立宿主进程，记录启用前的实际 PTC 预算。 |
| [DSH Agent Team](#plugin-1343951443-root) | 以持久成员、任务账本和验收角色组织多Agent协作 | [Q04](../../plugins/contexera--dsh-agent-team/INSIGHT.md#research-q04) 无凭据测试repo观察，外部发布仍人工控制。 |
| [DSH Agent Team GUI](#plugin-1334766747-root) | 为 DSH Web 保存可复用多模型团队，编排任务依赖、查看运行记录并汇总供应商报告的 Token 用量。 | 先在匹配宿主的空白项目，用一个模型与有限成员验证完整交付，给成员明确且不重叠的文件范围；逐次核对产物、测试和计量覆盖。 |
| [DSH AgentTeams](#plugin-1332073142-root) | 为 DSH 提供队长与可续聊成员、依赖任务、持久邮箱、质量门禁和 Web 团队视图。 | 先在低权限工作区做两个只读成员试用，明确审批和成本上限。 |
| [DSH Android](#plugin-1341805689-root) | 通过 adb 在 DSH 会话内构建运行 Android 应用、查看设备画面并操作与调试。 | [Q05](../../plugins/zseven-w--dsh-android/INSIGHT.md#research-q05) 本地可信Host/可丢弃AVD/显式serial，核真实业务状态；未知先停并回adb/Studio/快照。 |
| [DSH Annotation](#plugin-1330089831-root) | 在 DSH 选中文字批注并随消息发送，以编号关联回复。 | [Q04](../../plugins/omdsh-dev--dsh-annotation/INSIGHT.md#research-q04) 先测试输入法与合成数据。 |
| [DSH Automation](#plugin-1335813480-root) | 在独立 DSH 会话中按计划执行编码任务，管理权限、状态和运行记录。 | [Q03](../../plugins/michengai--dsh-automation/INSIGHT.md#research-q03) 先试隔离目录、最小权限的一次任务。 |
| [DSH Better Reasoning Effort](#plugin-1339889879-root) | 在DSH模型卡编辑第三方模型推理档位、输入模态和请求头，提供自动适配与Composer滑块。 | 能核查配置与请求的网页用户可在副本profile对单个已知模型试用，先验证auto开关路由可读、备份原字段、核对按钮信号及降级取消/离卡行为、重开卡确认最终字段并用最小请求验wire。 |
| [DSH Better Sidebar N23](#plugin-1352600211-root) | 为DSH提供文件编辑预览、真实终端、Git、浏览器与可扩展双面板工作台。 | 建议先观察发布源与运行产物同步、宿主范围；如自行评估，只在备份的小仓库试验文件/Git/PTY，不用它承担工作区隔离。 |
| [DSH Bot · 模型路由](#plugin-1353534254-root) | 为 DSH 提供模型路由、依赖工作包、官方 CLI 执行与核算，并提供完整 Bot 工作区版本。 | [Q05](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q05) 保持观察。 |
| [DSH Chat Import](#plugin-1333200468-root) | 把其他 AI 编码助手的会话历史导入 DeepSeek Harness 并继续对话。 | [Q04](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q04) 先备份和预览非敏感单个来源，再核对原文与目标会话；缺项或状态不明时暂停重导。 |
| [DSH CLIWorker Now](#plugin-1407409202-root) | 在 DSH 中派遣外部 AI CLI，查看 Worker 会话、状态和结果。 | 只在复制的 profile 用一个确定只读的外部 CLI 观察任务，按权限回执、实际进程及文件验证，见 [Q04](../../plugins/superwheel--dsh-cliworker-now/INSIGHT.md#research-q04)。 |
| [DSH Command Code Provider](#plugin-1334118559-root) | 在 DeepSeek Harness 中接入 Command Code 模型与账户。 | [Q05](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q05) 已有账户的用户可先用非敏感单轮核对模型输出与账单；目标、留存或请求结果不明时暂停并退回原供应商。 |
| [DSH Computer Use](#plugin-1334089233-root) | 让 DSH 通过语义文本和快照引用观察、操作 Chromium 或 macOS 桌面窗口。 | 继续观察。 |
| [DSH Computer Use](#plugin-1401334465-root) | 通过 DSH 在 Windows 查看桌面并操控窗口、应用和浏览器。 | 仅在无账户数据的独立 Windows 测试桌面检查一项可逆操作，失去目标就人工接管，见 [Q04](../../plugins/copylee711--dsh-computer-use/INSIGHT.md#research-q04)。 |
| [DSH Design Studio](#plugin-1425216193-root) | 在 DSH 侧栏预览设计页面、标注反馈并检查或导出设计。 | [Q04](../../plugins/orderg-x--dsh-design-studio/INSIGHT.md#research-q04) 先用本地可信单页验证会话关联，退出时核对预览和分享状态。 |
| [DSH ESP32 Agent（Handsy）](#plugin-1414685342-integrations-dsh) | 将 ESP32 Agent 的 iPhone 截图、触控和操作指引接入 DSH。 | 仅在空白测试手机检查一个无写入导航。 |
| [DSH File Review](#plugin-1333846315-root) | 把 DSH Agent 产生的文件改动放进 Web 审查面板，支持行级反馈及符合条件的撤销或重应用。 | [Q04](../../plugins/left0ver--dsh-file-review/INSIGHT.md#research-q04) 先用临时仓库和一处 UTF-8 改动验证行级反馈。 |
| [DSH for VS Code](#plugin-1335024457-root) | 在 VS Code 侧栏嵌入 DSH Web，管理自启与外部服务，提供本机认证代理和配套文件桥。 | [Q04](../../plugins/fengze233--dsh-vscode/INSIGHT.md#research-q04) 先用专用 profile 比较桥关闭和打开，再检查目录变化及登录。 |
| [DSH Git Bash Shell](#plugin-1343674616-root) | 为 Windows DSH 会话提供 Git Bash、MSYS 路径转换、原生程序调用及可选预设。 | 在独立 Windows profile 保持默认实验门禁，先核对受限命令未启动。 |
| [DSH Git Graph](#plugin-1331636953-packages-dsh-git-graph) | 在 DSH Web 中展示 Git 分支与提交图，并提供工作树管理入口。 | [Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q05) 建议先在独立测试仓库只读观察，写操作前保留工作并核对目标；状态不明时停止并使用 Git 回读。 |
| [DSH Git Panel](#plugin-1385903666-root) | 在 DeepSeek Harness 对话工作区展示 Git 分支、历史和差异，并提供暂存、提交和变更管理。 | [Q04](../../plugins/xbzbing--dsh-git-panel/INSIGHT.md#research-q04) 先用一次性仓库做只读对照，部分失败时停止并回终端核对。 |
| [DSH Graphlint](#plugin-1285824983-integrations-dsh) | 为DSH提供graphlint依赖图查询、索引构建、配置工具和使用Skill。 | 已有graphlint使用经验且愿意逐项核对告警的开发者可先在分支试用。 |
| [DSH Harness Switch](#plugin-1414577411-root) | 在DSH原生会话中绑定模型与harness，嵌入固定Kimi Code执行核心并桥接审批与历史。 | 熟悉Kimi和DSH的开发者可在单进程隔离profile及副本工作区试用；出现pending未知结果先查日志与文件，不自动重试，要求无损迁移或完整计费者暂缓。 |
| [DSH Integration Settings](#plugin-1429103083-root) | 为 DSH 设置增加 MCP JSON 导入、网关配置及模型清单和思考档位的预览同步。 | 有可信固定产物、熟悉 profile 且能逐文件恢复的管理员，可以先在隔离副本手动试一组 MCP 或单网关配置，保持定时关闭。 |
| [DSH iOS](#plugin-1339882322-root) | 在 macOS/Xcode 侧为 DSH 提供模拟器与 USB 测试 iPhone 的构建、观察和输入工具，并在会话中显示可交互实时画面。 | 自有小App模拟器先测，真机独立授权/签名/恢复，失败核状态，见 [Q03](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q03)。 |
| [DSH Lighthouse](#plugin-1422364992-root) | 汇总作品的本地、GitHub、市场与 npm 状态，并生成观察面板和报告。 | [Q05](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q05) 建议先观察并在隔离公开名册下核对接口、数据及文件恢复；监听范围或来源不明时回到官方页面。 |
| [DSH LSP Actions](#plugin-1333526401-root) | 在 DSH 中调用语言服务器诊断、补全、格式化和符号重命名等操作。 | [Q04](../../plugins/perrylink--dsh-lsp-actions/INSIGHT.md#research-q04) 先试只读诊断，待验明服务器与文件范围后再单独评估写操作。 |
| [DSH Market](#plugin-1333317835-root) | 提供 DSH 插件、技能和整合包的市场浏览、搜索及宿主侧安装管理。 | [Q03](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q03) 先比较候选，待来源和授权边界明确再在独立 profile 验证。 |
| [DSH Memoir](#plugin-1334359396-root) | 在 DSH 本地记录项目记忆，按需检索并为新会话注入预算内摘要。 | [Q04](../../plugins/qinling-melon-farmers--dsh-memoir/INSIGHT.md#research-q04) 先在隔离环境手工保存并验收一条记录，再独立评估自动蒸馏。 |
| [DSH Mobile](#plugin-1333842753-root) | 通过 Android 原生客户端连接 DeepSeek Harness，跟进会话、回答问题、审批命令并接收任务通知。 | [Q03](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q03) 先以USB／可信测试网和非敏感任务确认后台通知、待办重放与错误提示，保留桌面核对。 |
| [DSH Model Fusion](#plugin-1390487251-root) | 把强模型规划审查与低价Sidekick实施组合成可验收任务 | [Q04](../../plugins/aa2246740--dsh-model-fusion/INSIGHT.md#research-q04) [Q04](../../plugins/aa2246740--dsh-model-fusion/INSIGHT.md#research-q04) 隔离小仓、明确保护测试、禁保活起步并设置账号外限；失败回单模型。 |
| [DSH Multitask](#plugin-1408657362-root) | 用 DSH Agent 预设把协调与执行分工，支持不同工具面的子代理。 | [Q04](../../plugins/senguk520--dsh-multitask/INSIGHT.md#research-q04) 先验证隔离仓库中的只读样本和权限，再考虑并行执行任务。 |
| [DSH Orchestrator2](#plugin-1409845351-plugins-dsh-orchestrator2) | 提供自动开发调度预设，以任务包组织设计、开发、审查、预算与人工验收。 | 建议先观察并核对派工回执与角色参数，再做隔离任务包验收。 |
| [DSH Plugin Hub](#plugin-1340244547-root) | 在 DeepSeek Harness 设置中浏览、搜索、安装、升级和卸载社区插件。 | [Q04](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md#research-q04) 从已知来源的只读查包开始，任何包版本或构建许可不明时回原仓库。 |
| [DSH Plugin Template](#plugin-1333375150-root) | 展示带共享协议的宿主和客户端插件骨架 | [Q04](../../plugins/bugmaker2--dsh-plugin-template/INSIGHT.md#research-q04) 隔离 profile 检查合法、非法和卸载。 |
| [DSH PUA](#plugin-1367503416-root) | 为 DSH 注册会话纠偏提示与推进循环，可在模型报告完成后执行用户指定的验收命令。 | [Q01](../../plugins/michengai--dsh-pua/INSIGHT.md#research-q01) 有固定回归检查的用户可在可丢弃副本试一个小任务。 |
| [DSH Python Env](#plugin-1335843541-root) | 管理工作区Python虚拟环境，提供发现、创建、安装、卸载和删除工具。 | 可信代码仓库的开发者可在一次性工作区试用。 |
| [DSH RDD Goal Tree](#plugin-1222692871-dsh-rdd-goal-tree) | 在 DSH 会话中展示 goal-tree 状态并向规划者投递节点回调。 | [Q04](../../plugins/yaphethayate--coderdd--dsh-rdd-goal-tree/INSIGHT.md#research-q04) 先在隔离仓库核对视图、通知与 marker；不接受重复或权限风险时关闭 watcher 并人工核查账本。 |
| [DSH Remote Web Gateway](#plugin-1336998102-root) | 通过远程入口和设备配对，从手机访问电脑上的 DSH Web。 | [Q04](../../plugins/summer1238--dsh-remote-web-gateway/INSIGHT.md#research-q04) 先在隔离环境验证允许和拒绝，异常就关闭远程入口。 |
| [DSH Reverse Skill](#plugin-1334214605-root) | 将上游逆向与安全研究技能目录递归注册进 DSH skills 服务的适配插件。 | 保持观察。 |
| [DSH Router Standard](#plugin-1334459444-root) | 以 Agent/Preset 和 Cordis 模块为软件任务分阶段展示、限制工具，并提供目录帮助、路由状态和交付证据清单检查。 | 先独立可回退小任务对照Standard，验FAIL/阶段分离及持久恢复，再扩大使用，见 [Q03](../../plugins/yjh051108--dsh-router-standard/INSIGHT.md#research-q03)。 |
| [DSH Sidenote](#plugin-1339293057-root) | 在 DSH Web 划选批注、打开侧边会话并把选定问答带回主线。 | 在独立 profile 先做一次脱敏引文的局部评审，检查最后正文及引用后再扩大，见 [Q04](../../plugins/g-yixuan--dsh-sidenote/INSIGHT.md#research-q04)。 |
| [DSH Skill Explorer](#plugin-1331636953-packages-dsh-skill-explorer) | 在 DSH Web 面板中按来源浏览、查找和管理 Skill。 | 在独立工作区用一条可回退的普通 Skill 核对来源、文件变更和目标会话；发现三者不符时回到编辑器和官方目录，见 [Q04](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md#research-q04)。 |
| [DSH Skill Hub](#plugin-1334303719-root) | 在 DSH 中浏览、筛查、安装、更新和恢复本地 Skill。 | [Q04](../../plugins/cheshireez--dsh-skill-hub/INSIGHT.md#research-q04) 只建议先用自控固定来源完成单个试验并核对文件。 |
| [DSH Skills Manager](#plugin-1334830521-root) | 在 DeepSeek Harness 中集中发现、加载和管理本机及仓库技能，支持工作区和自定义预设。 | 先在隔离预设试一份已审阅的技能，核来源、版本和调用范围。 |
| [DSH Subagent](#plugin-1425006726-root) | 将本机外部 CLI 注册为 DSH 子代理后端，支持调度、进度及模型回退。 | [Q04](../../plugins/1373700184--dsh-subagent/INSIGHT.md#research-q04) 先检查后端权限、工作目录与费用；不能接受默认绕过审批时不要启动相应后端。 |
| [DSH Super Code](#plugin-1367482095-root) | 为 DSH 编码任务提供专家委派、分层记忆与删除保护。 | 隔离试用、限定分工并独立检查 diff 和测试；审批或版本异常即停止。 |
| [DSH Task Board](#plugin-1331636953-packages-dsh-task-board) | 在 DSH Web 管理任务卡、真实会话执行和宿主定时计划。 | 先开一次只读卡，确认关闭浏览器后宿主能触发并保留实际会话输出。 |
| [DSH Taskboard](#plugin-1333732838-root) | 为 DSH 提供本地 SQLite 项目看板、Agent 任务工具、原生会话执行与自动化。 | [Q03](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q03) 用独立测试库和可丢弃目录从手动闭环试起，再显式开少量自动规则。 |
| [DSH Taskboard](#plugin-1334866577-root) | 以持久台账、Agent工具和Web看板连接任务认领、定时执行与人工验收。 | [Q03](../../plugins/cloader--dsh-taskboard/INSIGHT.md#research-q03) 先副本手动卡验证停止和路径，再开调度。 |
| [DSH Tool Management](#plugin-1366979533-root) | 在 DSH 中集中管理 MCP、技能、记忆、场景等资源及分作用域的模型工具表。 | [Q05](../../plugins/ouli-1242--dsh-plugin-tool-management/INSIGHT.md#research-q05) 保持观察。 |
| [DSH Toolbox UI](#plugin-1335954169-root) | 为 DSH Web 提供 MCP、技能与工具加载管理面板，可按全局或项目查看和调整配置。 | [Q04](../../plugins/imzl-zl--dsh-toolbox-ui/INSIGHT.md#research-q04) 仅用隔离 profile 和无凭据的只读 MCP，核对两个会话的范围；发生降级或范围错误时回宿主配置。 |
| [DSH Turn Rewind](#plugin-1333100390-root) | 为DSH消息提供文件检查点、变更预览、选择恢复及会话重新开始。 | 适合经常需要撤销Agent文件修改且愿意核对路径的开发者，在可丢弃副本中先做一次“文件恢复+消息新建”，对照受管理路径内容与原会话。 |
| [DSH Verification Receipt](#plugin-1333370288-root) | 将 DSH 每轮观察到的验证信号写成简要 JSONL 回执。 | [Q04](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q04) 在可信独立路径使用摘要，并核对原始记录。 |
| [DSH Vision Router](#plugin-1333446374-root) | 为 DeepSeek Harness 的文本代理接入视觉模型，并提供截图对照与像素级图像工具。 | 在独立 profile 先用两张无敏感内容、尺寸和渲染环境可说明的截图做一次对照。 |
| [DSH Vision Toolkit](#plugin-1333100071-root) | 为 DSH 文本模型提供图像问答、OCR、定位、截图差异和视觉产物。 | 隔离试用优先用单张非敏感截图。 |
| [DSH with ChatGPT](#plugin-1342024605-root) | 通过 Agent Helm 集成把 ChatGPT 本地工程入口与 DSH 原生会话、工作区和工具桥接。 | 先补固定Core与宿主认证核验，再在项目副本只读起步；响应不明先查会话，权限不明关隧道回DSH。 |
| [DSH Worktable](#plugin-1336092482-root) | 为 DSH 提供组织项目、会话、文件与终端的工作台界面。 | 先备份不同存储并在隔离项目验证权限、终端及恢复。 |
| [DSH 红队模式](#plugin-1364387461-packages-redteam-bundle) | 为经授权的安全演练提供角色预设、范围检查、事实库和报告工具。 | [Q04](../../plugins/jueze-2019--dsh-redteam-mode--packages-redteam-bundle/INSIGHT.md#research-q04) 先在封闭测试配置验证，缺授权不执行。 |
| [dsh_workflow](#plugin-1332243516-root) | 在 DSH 中创建、保存和运行可复用的多 Agent 工作流，并保留运行证据。 | [Q03](../../plugins/omdsh-dev--dsh_workflow/INSIGHT.md#research-q03) 在只读任务对照一次重复运行和一次恢复，核对真实事件与结果。 |
| [dsh-a11y-scan](#plugin-1344715270-root) | 在DSH中调用axe扫描本地HTML或确认URL，输出定位、修复线索、人工复核项和多格式报告。 | 可信无敏感页面可限范围试用作自动线索，先核实际网络/文件与规则覆盖，保留人工复核。 |
| [DSH-action](#plugin-1333633428-root) | 在GitHub Actions运行DeepSeek Harness，处理评审、诊断、代码任务与自动化。 | 已有可信CI维护者先用controlled、只读、Session off、无外部扩展和独立runner，设置预算与网络策略。 |
| [dsh-advisor](#plugin-1326938666-root) | 让独立模型评阅 DeepSeek Harness 会话，注入分级建议并为 Web 提供后续提示。 | [Q03](../../plugins/omdsh-dev--dsh-advisor/INSIGHT.md#research-q03) 隔离观察公开会话，按 [Q02](../../plugins/omdsh-dev--dsh-advisor/INSIGHT.md#research-q02) 确认数据和费用，无法核对时回到人工复核。 |
| [dsh-agent-recycle-guard](#plugin-1414323673-root) | 将 Agent 常见直接删除改为系统回收，并对执行脚本做有限内容检查，异常时阻止命令。 | 建议有独立备份的维护者在可丢弃目录受控试用常见删除缓冲；不以此替代权限隔离，准备长期阻断、语义不一致或需要动态程序全覆盖时停止。 |
| [dsh-agentdebugx](#plugin-1296792947-integrations-dsh-agentdebugx) | 连接 DSH 会话与 AgentDebugX，支持保存会话发现、当前或历史轨迹诊断和本地查看。 | 建议观察，先修明物理路径与取消契约，缩窄历史root，之后再考虑不敏感当前工作区轨迹；同模型自诊断不作为独立效果证明。 |
| [dsh-agy-link](#plugin-1339101586-root) | 把 Google Antigravity CLI 的模型、流式输出和账号操作接入 DeepSeek Harness。 | [Q05](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q05) 建议已有 agy 环境的开发者先观察隔离流程，具体核对 [Q03](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q03) 的凭据写回与 [Q04](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q04) 的路径范围。 |
| [dsh-ai-armor](#plugin-1425045401-root) | 将Git回归、堆栈、配置、shell转义和MyBatis Plus静态审计工具合并分发。 | 可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。 |
| [dsh-aiignore](#plugin-1219876705-plugin) | 扫描工作区上下文噪声，并提供读取规则与报告面板。 | [Q03](../../plugins/wjddidi-1--ai-context-doctor--plugin/INSIGHT.md#research-q03) 备份后在隔离工作区观察误拦与规则变化，不一致时停用并手工比较恢复。 |
| [dsh-anchored-standard](#plugin-1334245678-root) | 提供实验性DSH预设，通过首轮上下文门控、工具分阶段暴露与历史种子控制模型轨迹。 | 当前生产采用不推荐，研究者可只借鉴epoch门控实现做隔离实验。 |
| [dsh-approval-explainer](#plugin-1417137113-root) | 为 DSH 真实审批弹窗生成操作、意图、风险和选项含义的 AI 注释，并提供历史与诊断视图。 | 先观察并确认同意把审批参数和近期上下文交给所选模型，在低风险可撤销样本中核对目标、权限和选项含义。 |
| [dsh-ark-coding-provider](#plugin-1421741516-root) | 为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。 | 有条件试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。 |
| [dsh-asciinema](#plugin-1344714509-root) | 把DSH会话工具结果文字缓冲为自有cast对象文件，提供会话录制/标记、HTML回看与纯文本转换。 | 观察，先修模板路径/时间与保存pending恢复，非秘密小样也须核采集/分享范围。 |
| [dsh-auto-review](#plugin-1333482618-root) | 为 DSH 审批请求提供可配置的第二模型审核。 | [Q04](../../plugins/perrylink--dsh-auto-review/INSIGHT.md#research-q04) 先在隔离 profile 用合成样例核策略、默认拒绝、非默认 allow-once 放行一次及 delegate 转交；转交不等于批准，取消为 cancelled。 |
| [dsh-auto-reviewer](#plugin-1336185734-root) | 为 DSH 增加 auto-review 权限预设，按规则与可选 LLM 裁决提权并显示通知。 | 先在可恢复的宿主副本用无副作用样本比较决策，特别检查旧确认、新目标和参数缺失。 |
| [dsh-baton-host](#plugin-1424249299-host) | 把 Claude Code 或 Codex 的任务交给可见的 DSH 会话，并将结果交回原客户端。 | 选隔离会话投递单一有测试判据的任务。 |
| [dsh-better-edit](#plugin-1334305197-root) | 为 DSH 提供使用内容哈希行锚点的读取、范围编辑与撤销工具。 | [Q04](../../plugins/rianico--dsh-better-edit/INSIGHT.md#research-q04) 在测试分支先改一处已知范围，读回 diff 和撤销后再决定是否扩大。 |
| [dsh-block-ptc](#plugin-1420110365-root) | 为 DSH 的 PTC 模式添加块标签，让模型提交保留内容以整理不再活跃的上下文。 | 先用有交错工作块和纠正指令的可复做任务，核对摘要前后要求与pending落地；出现遗漏就停止该预设并查看原转录。 |
| [dsh-cache-bricks](#plugin-1386463441-root) | 用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。 | 建议本地单用户维护者用不敏感会话试用，先核对attempt、usage和访问边界；主链延迟、字段错位、UI干扰或权限不清时停止，回到宿主日志。 |
| [dsh-cad](#plugin-1340230123-root) | 在 DSH Web 查看 CAD 文件，并提供几何分析与建模工具。 | [Q03](../../plugins/lau-mars--dsh-cad/INSIGHT.md#research-q03) 先核可读路径与脚本权限，再选择是否在可丢弃环境试小模型。 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz) | 解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。 | 建议试用。 |
| [dsh-claude-style](#plugin-1377512288-root) | 为 DeepSeek Harness 网页界面提供 Claude Code Desktop 风格主题与交互。 | 先在独立 profile 选一个已有最终回答且有工具过程的测试会话，记录原生界面的展开与定位结果。 |
| [DSH-Code](#plugin-1333936445-root) | DSH原生终端bundle与启动器，组合Host Agent、会话/队列、审批和模型管理。 | [Q06](../../plugins/unlinearity--dsh-code/INSIGHT.md#research-q06)低敏副本/低权限受限试用，核真实文件/回执，不凭退出码认持久成功。 |
| [dsh-codex-bridge](#plugin-1427331352-root) | 通过Codex CLI读取账号额度与模型建议，并以可选模型和推理强度委派独立任务。 | 单人已有账号先只读短任务，核模型/额度/结果；写任务用可恢复工作树，超时先验产物，高价/低额需真实用户接受。 |
| [dsh-codex-guard](#plugin-1340906871-dsh) | 在 DSH 中调用 codex-guard，对 Git 变更进行提交前卫生检查。 | 建议观察；先核实际 CLI 版本、cwd 和覆盖，再对六类场景隔离验证，不能将字符串成功返回当提交放行。 |
| [dsh-confirm-gate](#plugin-1423059076-root) | 按轮累计持久化工具调用，分档提醒并在硬阈值请求确认，另为微信会话改道中途提问。 | 先核实隔离profile能解析运行时，再检查计数和审批是否与工具轨迹相符；若需要严格安全或金额控制，继续用宿主权限与人工核对。 |
| [dsh-context](#plugin-1333961389-root) | 为 DSH 会话展示上下文组成、历史趋势和用量，提供 Context 标签及 /context 入口。 | [Q03](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q03) 在个人隔离 Web profile 检查一个已知大工具结果，保持提示词首尾为空并确认明细归属。 |
| [dsh-cost-meter](#plugin-1333235870-root) | 在 DSH 会话查看模型用量、估计费用、历史记录和订阅额度。 | [Q05](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q05) 固定模型和价表，用小批调用查本地、重启回读及供应商账单。 |
| [dsh-deja](#plugin-1300173275-extensions-dsh) | 在 DSH 中搜索本机编码助手历史，并可为当前会话召回相关上下文。 | [Q03](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q03) 用非敏感历史先核人工 Web 路径，比较原生搜索及命中打开结果。 |
| [dsh-dep-vuln-scan](#plugin-1344714002-root) | 读取常见项目锁文件，向OSV批量查询依赖版本公告，展示漏洞、修复候选与命令建议，并保存可重放结构化报告。 | 先观察。 |
| [dsh-diff-approval](#plugin-1335980444-root) | 在 DSH 会话旁捕获文件改动，提供差异审阅、保留回退、批注和版本控制变更导入。 | [Q04](../../plugins/9087--dsh-diff-approval/INSIGHT.md#research-q04) 备份后只在单写者树中小批试用，逐项核盘面与测试；分歧、保存失败或部分恢复时停止动作，用VCS和备份恢复。 |
| [dsh-domain-bridge](#plugin-1424063534-plugins-dsh-domain-bridge) | 提供声明优先域寻址、分层暂停、持久消息队列、会话工厂、模型分派、命令菜单与静态工作台入口。 | 建议观察。 |
| [dsh-doublecheck](#plugin-1333754646-root) | 通过需求规格、红绿测试轨迹、评审与交付报告，为 DSH 会话提供工程纪律提示和可配置门禁。 | 试用：非关键小改动保持默认remind，人工核spec与真实测试，再读gate四阶段。 |
| [dsh-engineering-workflow](#plugin-1335988605-root) | 可选工程 preset 与六个方法 Skill，以五阶段文字门禁引导 DSH Agent；Host 自动同步本地预设并公告。 | 备份 DSH_HOME/.agent-presets/engineering-workflow，再在新会话选择 preset 做对照试验；详见[Q02](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q02)、[Q03](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q03)。 |
| [dsh-engram · 记忆宫殿](#plugin-1353296006-root) | 为 DSH 提供本地 SQLite 分库、跨会话记忆搜索、引用核对、画像注入和管理面板。 | [Q04](../../plugins/kenz1117--dsh-engram/INSIGHT.md#research-q04) 隔离 profile 中先核对实际自动摄取、模型出口、导出路径和退化，再用非敏感样本核对最新纠正。 |
| [dsh-eteams](#plugin-1372993989-root) | 为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。 | 试用，备份/可信管理面/明确人工验收，completed按成员报告解读，不能当全自动业务验收。 |
| [dsh-evidence-gate](#plugin-1365519118-root) | 为 DSH 会话提供可切换的证据提示、主张裁定工具及持久活动索引。 | 建议观察，单人本地可作为提醒和线索索引；关键事实须回查原始输出，不能依赖 verified 机器标签自动放行。 |
| [dsh-expert-mode](#plugin-1334811048-root) | 提供专家协调预设、领域委派工具、渐进式方法、文件消息总线和任务看板。 | 当前建议观察。 |
| [dsh-fail-logger](#plugin-1333463381-root) | 从 DSH 会话事件采集工具失败，去重计数后写入本地 Skill，并可注入预防和恢复提示。 | 先在复制的非敏感日志上观察，关闭全局提示做基线，验证不同模式失败覆盖及文件写失败恢复。 |
| [dsh-find-plugins](#plugin-1333132389-root) | 按 GitHub topic 发现 DSH 插件，比较候选并引导安全检查、安装和挂载验证。 | [Q03](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md#research-q03) 先只读比较候选，再按 [Q02](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md#research-q02) 的方式明确授权和宿主作用域。 |
| [dsh-folderwatch](#plugin-1423215448-root) | 监控目录元数据快照变化，经批处理与路径回声过滤后唤醒或排队通知DSH Agent，提供挂载、检查、触发和移除工具。 | 观察，先可信单profile窄目录queue核扫描/接收/恢复，不作为可靠生产触发或多用户隔离。 |
| [dsh-github](#plugin-1333375597-root) | DSH Source Control 标签展示 Git 状态与差异，并调用本地 Git 管理仓库。 | [Q03](../../plugins/pivotstackintelligence--dsh-github/INSIGHT.md#research-q03) 只读对照后试测试分支。 |
| [dsh-github-router](#plugin-1339462797-root) | 提供PR、Issue、文件及API只读工具，通过API、gh、Git、HTML与可选镜像在宿主内降级取数。 | 先观察；公共仓库单用户隔离环境可对照，私有多身份/共享存储先解决缓存与授权边界。 |
| [dsh-godot-skill](#plugin-1333504012-root) | 将 Godot 4 开发速查、工作流与代码模板注册为 DSH 可加载的运行时技能。 | 新项目固定Godot版本，从一关卡开始，人工试玩并打开导出物；不兼容回官方示例。 |
| [dsh-hdc-bridge](#plugin-1333258432-root) | 在 DSH 中连接鸿蒙设备调试、版本化 API 知识、工程构建和部署，并提供设备面板。 | [Q04](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q04) 先观察作用域，在无真实数据设备上以显式target做列表/诊断，确认实例隔离和面板可达范围后再决定受控部署。 |
| [dsh-host-rsi](#plugin-1401710157-root) | 在 DSH Agent 的任务前后检索、捕获经验并可追加交付复查。 | [Q03](../../plugins/pk14742952-ad--dsh-host-rsi/INSIGHT.md#research-q03) 用显式独立目录和无敏感任务试验。 |
| [dsh-IDE](#plugin-1333786261-root) | 提供 DSH Web 工作区面板、SSH 运维和远程工作区三个插件的源码套件。 | 建议先观察个人隔离 profile 的本地面板，SSH 组合须核对服务桥接和所有入口的实际目标。 |
| [dsh-inject](#plugin-1417110833-root) | 为 DSH 提供按会话和模型范围选择的上下文整形、消息前缀和规则替换。 | [Q05](../../plugins/john-walks-slow--dsh-inject/INSIGHT.md#research-q05) 保持观察，只用两个隔离会话和模拟端点验证无害标记、模型范围及失败。 |
| [dsh-j-space](#plugin-1344270011-root) | 将 J-Space Cognition Suite 接入 DSH 原生 Agent Preset 并保留证据控制器 | 兼容环境的复杂任务先单agent受控试用，明确合作协议与宿主强制门禁区别；简单任务用原生记录，重读/复核负担不能换来质量时停止扩展。 |
| [dsh-jev-guard](#plugin-1378138611-root) | 在 DSH 工具执行前结合静态规则与远程风险判定。 | [Q04](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md#research-q04) 先隔离验证目标工具、宿主审批和失效告警。 |
| [dsh-jev-interceptor](#plugin-1382292535-root) | 将typed分类接入DSH工具风险、预批和引用保留，支持shadow观测；可选图像卸载存在模式门遗漏。 | [Q05](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q05) 隔离profile从shadow审起，图像关/白名单空；缺遥测动作、shadow变化或resolver异常停整个bundle回原生，核持久状态与provider输入。 |
| [dsh-leak-guard](#plugin-1422091204-root) | 发布前本地遍历文本和敏感文件名，按凭据模式返回位置、级别与六字符预览，提供scan和rules工具动作。 | 先观察，仅额外线索，不自动发布；先修覆盖/错误/预算状态，保留独立扫描与人工审查。 |
| [dsh-lowtide](#plugin-1343773044-packages-dsh-lowtide) | 为 DSH 提供按时间窗口运行的任务队列、裁定界面和批次报告。 | [Q04](../../plugins/kelaohu--dsh-lowtide--packages-dsh-lowtide/INSIGHT.md#research-q04) 先选择无敏感材料的小任务，明确使用需人工放行的档位，核对实际权限、执行差异和账单后再扩大。 |
| [dsh-lowtide](#plugin-1343773044-root) | 提供 DSH 任务队列、峰谷窗口调度及批次执行结果复核。 | [Q03](../../plugins/kelaohu--dsh-lowtide/INSIGHT.md#research-q03) 先核对子包身份和隔离 profile，再按 [Q02](../../plugins/kelaohu--dsh-lowtide/INSIGHT.md#research-q02) 测试自动等级。 |
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
| [dsh-madara-pixel-theme](#plugin-1196157387-packages-dsh-madara-pixel-theme) | 为 DSH Web 界面提供宇智波斑像素主题、字体及启动动画。 | [Q04](../../plugins/bosskrabs--product--packages-dsh-madara-pixel-theme/INSIGHT.md#research-q04) 确认版本和许可，在隔离 profile 检查外观冲突及退出。 |
| [dsh-maze](#plugin-1338527485-root) | 在 DSH 展示实时或上传会话轨迹的迷宫视图与工具判定。 | [Q03](../../plugins/lamost423--dsh-maze/INSIGHT.md#research-q03) 小合成日志先核对两路径。 |
| [dsh-mcp](#plugin-1334869464-root) | 在 DSH 设置中配置和启停 MCP 服务，并按需让模型发现和调用工具。 | [Q04](../../plugins/arvinqi--dsh-mcp/INSIGHT.md#research-q04) 在隔离 profile 对照按需与全量，按 [Q03](../../plugins/arvinqi--dsh-mcp/INSIGHT.md#research-q03) 的建议使用只读或空实现服务。 |
| [dsh-mermaid](#plugin-1334569498-root) | 在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。 | 适合经常看Mermaid图的人先用小图试用，保留strict和合理限制，报错先复制后决定是否发AI；卡顿、异常交互或草稿覆盖就停相关路径。 |
| [dsh-minimal-turbo](#plugin-1334871947-root) | 为 DSH 提供极简模式覆盖配置和新增的许愿模式预设。 | [Q03](../../plugins/changedenczd--dsh-minimal-turbo/INSIGHT.md#research-q03) 先只读比较配置。 |
| [dsh-model-everything](#plugin-1423488109-root) | 将设计抽象为模型并提供状态机等验证与图形工具。 | [Q04](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md#research-q04) 小范围建模并核对界限、原始代码和独立测试。 |
| [dsh-modernize-code](#plugin-1344714334-root) | 通过 Skill 和两个 Python 工具辅助遗留代码预检与热点扫描；迁移方案与改码依赖模型/人工。 | 用隔离副本运行两工具，限定 out，人工标注热点、运行真实构建/测试后再定路线图；详见[Q03](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md#research-q03)。 |
| [dsh-multi-folder](#plugin-1334119885-root) | 为DSH项目配置副工作目录，保持主cwd并将原文件和shell工具按单次目标重定根，附UI与@发现。 | 观察，继续从无碰撞稳定身份、store不落Agent写根及明确UI能力约束着手。 |
| [dsh-mysql](#plugin-1337916824-root) | 在DSH设置管理多套MySQL连接，会话选择目标数据源，模型可查看表结构、查询，并在独立授权后执行行写与DDL。 | 先观察。 |
| [dsh-ntr](#plugin-1367998877-root) | 把独立 ACP Agent 的会话、工具活动和权限交互接入 DSH 界面。 | [Q03](../../plugins/gdwhisper--dsh-ntr/INSIGHT.md#research-q03) 保持 wait，逐 Agent 单独对照。 |
| [dsh-oh-my-claude](#plugin-1366664192-root) | 将已有 Claude Code CLI 接入 DSH 模型提供商，支持会话续接、交互审批及 SSH 工作区。 | [Q05](../../plugins/lcestou--dsh-oh-my-claude/INSIGHT.md#research-q05) 当前观察。 |
| [dsh-open-in-vscode](#plugin-1333068322-root) | 在 DSH Web 工作区菜单添加入口，由 Host 启动配置的编辑器 CLI 打开目录。 | 仅本机Host/编辑器先试一个目录，核窗口与错误；远程或无窗口回手动CLI。 |
| [dsh-openai-oauth](#plugin-1335992154-root) | 在 DeepSeek Harness 中通过 ChatGPT OAuth 使用 Codex 模型及搜索。 | [Q05](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q05) 先保留原路由，在隔离环境核对登录、搜索选择、指令和工具行为；凭据残留或语义异常时停止并恢复原配置。 |
| [dsh-ops](#plugin-1409893258-root) | 为 DSH 提供 Native 与 PTC 文件工具、按需加载和可配置的原版工具替换。 | 按 [Q05](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q05) 取得匹配的可信发行物后，只在可恢复副本做一次带标准答案的只读搜索。 |
| [dsh-organism](#plugin-1366089972-workspace-plugins-dsh-organism) | 以器官模型聚合 DSH 工具，提供心跳体征、反射、代理调用和工具显影。 | 先隔离核 body_map/status 与宿主工具表，再分别启用门控和反射；保持最小权限与直接调用回退。 |
| [dsh-ouroboros](#plugin-1133901637-integrations-dsh-plugin) | 把 Ouroboros 的规格访谈、执行和评估工具接入 DeepSeek Harness 对话的配置包。 | [Q04](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q04) 先对公开样例验证一条访谈，核对实际包和后端后再考虑执行任务。 |
| [dsh-pentest](#plugin-1335155355-root) | 为 DSH 提供授权安全调查的目标、线索、事实、资产、漏洞图与报告视图 | [Q03](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q03) 观察旧版与自维护样本，不把归档包可下载当当前兼容。 |
| [dsh-pentester](#plugin-1338946084-root) | 在 DSH 编排分阶段渗透测试、Worker 与 Docker或SSH执行环境。 | [Q03](../../plugins/fb0sh--dsh-pentester/INSIGHT.md#research-q03) 先观察并用无网络任务核对两Runtime，不接真实目标。 |
| [dsh-pick](#plugin-1423941835-root) | 按需求检索 DSH 插件候选，比较 npm 与 GitHub 指标，并提供面板、对话工具和安装入口。 | 优先只读使用候选面板，独立检查任务证据与固定版本；不要自动按健康度安装。 |
| [dsh-plans](#plugin-1333921957-root) | 通过 Agent/Preset、五个 Skill 和可选模型的评审工具，组织版本化计划及显式 DSH goal 交接。 | 观察：复杂变更用户在独立副本先走small-plan并停在计划交接，人工核决策和清单；不把预设当硬只读。 |
| [dsh-plugin-adapter](#plugin-1374274469-root) | 以原生provider接入匿名Zen模型，含目录、消息/工具流适配及可选relay/IP池；根产物绑定待核。 | 观察：先核根真实包和退出恢复，再做一项可验文本/工具任务；严格出站、结果归属或共享网络未达标即停新请求并回退，见[Q06](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q06)。 |
| [dsh-plugin-aitelier](#plugin-1201143178-integrations-dsh) | 将 AItelier 的 MCP 流水线接口接入 DeepSeek Harness。 | [Q04](../../plugins/linxuhao--aitelier--integrations-dsh/INSIGHT.md#research-q04) 先隔离后端并验证 gate、凭据和工具；权限或后台状态不明时停止写入。 |
| [dsh-plugin-bridge](#plugin-1336849011-root) | 在 DSH 预览并确认会话交接，将上下文或已批准计划移到新会话。 | [Q03](../../plugins/totoro-qaq--dsh-plugin-bridge/INSIGHT.md#research-q03) 从短任务验证目标。 |
| [dsh-plugin-cc](#plugin-1333682494-root) | Claude Code 命令插件通过本地 bridge 委派 DSH 任务，支持结果保存及临时多轮。 | [Q03](../../plugins/cpj-dev--dsh-plugin-cc/INSIGHT.md#research-q03) 先只读任务，再演练超时停止。 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。 |
| [dsh-plugin-gate](#plugin-1336663986-root) | 向 DSH Agent 提供插件源码静态扫描、风险差分/报告及破坏性操作建议工具，以 systemPrompt 提醒调用。 | 只在明确源码版本上扫描，逐项审阅 hits、notes 和 filesScanned；对高权限插件增加人工/沙箱审查。 |
| [dsh-plugin-guard](#plugin-1335799735-root) | 为 DeepSeek Harness 提供插件操作前快照、启动回滚和事故报告。 | [Q04](../../plugins/lxzy-7--dsh-plugin-guard/INSIGHT.md#research-q04) 先保留观察结论，用隔离 profile 和已经验收的备份做恢复对照。 |
| [dsh-plugin-guide](#plugin-1333351747-root) | 提供 DSH 插件安装启动、用户流程和 Cordis 实践指南，并将检查与搭建任务路由到对应项目。 | 先用一个固定版本插件试做证据清单，另保存检查工具版本与原件；出现认证误称或路由漂移时回到固定原文。 |
| [dsh-plugin-ide-hub](#plugin-1397817235-root) | 在 DSH 汇总本地编码工具的会话、用量和项目规则。 | [Q04](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q04) 对复制项目先备份、dry-run 并核差异；不完整或删除风险不明时停止。 |
| [dsh-plugin-orchd](#plugin-1422240642-root) | 在 DSH 侧栏查看当前项目的 orchd 任务状态。 | [Q04](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md#research-q04) 仅在可信项目启用，核对根并用原始状态复核。 |
| [dsh-plugin-preflight](#plugin-1378350155-root) | 以 CLI 和模型工具预检 DSH 插件清单、patch、客户端包和预发布 peer 范围。 | 先对已知正确和已知错误的插件各检查一次，核对规则是否符合当前宿主。 |
| [dsh-plugin-rea](#plugin-1415732178-root) | 通过本地供给脚本准备 REA 运行环境，并将 REA MCP 工具接入 DeepSeek Harness。 | [Q04](../../plugins/czcdr--dsh-plugin-rea/INSIGHT.md#research-q04) 先保留观察结论，按已授权样本验证实际运行栈和证据定位，有差异则回已验收环境。 |
| [dsh-plugin-strict-spec](#plugin-1218860433-plugins-dsh-strict-spec) | 在 DeepSeek Harness 中浏览 strict 工作流文档并提供内置工作流工具。 | [Q04](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md#research-q04) 先核对宿主、工作区及实际 Skill；[Q03](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md#research-q03) 确认目标前审阅 Session 和后续授权。 |
| [dsh-plugin-task-forge](#plugin-1399011094-root) | 在 DSH 将需求编成任务书，支持跨窗口交接、版本回读、缺口和台账。 | [Q03](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md#research-q03) 从临时目录试用。 |
| [dsh-plugin-veriscope](#plugin-1422943787-root) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。 |
| [dsh-ponytail](#plugin-1342084531-root) | 将 Ponytail 工程指令和专门 Skill 接入 DSH，并提供会话内模式切换。 | [Q04](../../plugins/wenaixi--dsh-ponytail/INSIGHT.md#research-q04) 先用隔离小修复观察真实提示，发现默认关闭反例就停用并回原有规则。 |
| [dsh-pr-description](#plugin-1344714177-root) | 读取分支差异生成 PR 标题和五段描述，可选确认、保存与调用 gh 创建 PR。 | 先显式给 base 和安全输出路径，生成本地草稿并核对动机、测试、breaking；只有明确要发 PR 时才启用 openPr。 |
| [dsh-progress-viz (plugin)](#plugin-1334481905-plugin) | 把 DSH 语义会话事件即时投影成进度 JSON，供独立 Python 看板读取。 | 先把 JSON 当辅助状态并对照会话真相，修复/规避空闲恢复和估价问题后再作为运行监控依据。 |
| [dsh-project-memory](#plugin-1339316901-root) | 为 DSH 项目保存文档、代码符号、经验与任务，并提供跨会话检索和提示。 | [Q04](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q04) 先在单项目备份中按需查询，检查根和任务归属，再新进程读回；来源冲突或回读不符时停止自动注入，返回原文件与人工笔记。 |
| [dsh-qa](#plugin-1339045665-root) | 在 DeepSeek Harness 管理本地 QA 项目、受控测试、执行证据和交付门禁。 | [Q03](../../plugins/naodeng--dsh-qa/INSIGHT.md#research-q03) 先在隔离本机观察两个合成任务，按 [Q02](../../plugins/naodeng--dsh-qa/INSIGHT.md#research-q02) 对照运行归属。 |
| [dsh-qa-suite-n23](#plugin-1353726715-root) | 提供编辑后 TypeScript 诊断工具和本地多镜头代码审查命令。 | 先独立使用并复核 code_check 的项目根和时间，重要审查问题需要源码复现；跨项目或自动放行场景暂观察。 |
| [dsh-reaper](#plugin-1423215373-root) | 扫描监听端点并给进程归属分级，预览后代终止计划，经confirm后结束进程并检查端口。 | 先观察，以只读诊断为限；身份/后代保护/取消与精确端点协议补齐后再评估受控试用。 |
| [dsh-recall-plugin](#plugin-1334434866-root) | 将用户消息关联影子git快照，提供文件/会话回退、原生fork、归档与草稿回填。 | 独立备份的小型非敏感项目受限试用，先fixture核所有阶段与排除范围。 |
| [dsh-redteam-model](#plugin-1336856993-root) | 管理 DSH 安全研究预设与运行时插件，提供工作流、阶段检查和过程记录入口。 | [Q04](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q04) 当前观察，先限定具体管理或结构检查目标，确认授权、隔离profile、备份和实际变更；不把完整安全套件默认引入重要环境。 |
| [dsh-remote](#plugin-1333787962-root) | 将 SSH 主机接入 DSH 远程工作区，提供文件同步、命令、终端与端口转发。 | [Q04](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q04) 先核对低权限测试主机与镜像，只读检查通过前保留独立 SSH 路径。 |
| [dsh-remote-ssh](#plugin-1338300924-root) | 在DSH内集成SSH连接、远程工作区、文件/终端界面与模型远程工具。 | 当前观察，仅无秘密fixture只读起步，先核所有界面实际远端/目录。 |
| [dsh-restart-dock](#plugin-1424433303-root) | 在 DSH Web 界面提供可拖动的刷新/Windows 宿主重启坞，并用独立 helper 留下重启报告。 | [Q09](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md#research-q09) 仅供有人工救援通道的Windows插件开发者观察；先核状态与目标。 |
| [dsh-restart-planner](#plugin-1422176522-root) | 让代理排程宿主自重启，等待会话落盘后由外部 helper 停拉进程并向原会话投递继续提示。 | 仅建议具备救援入口的插件开发环境观察；先 dryRun，随后在空闲会话做一次 confirm=true、resume=false 的真实重启，再单独验证恢复投递。 |
| [dsh-rewind](#plugin-1336677036-root) | 在同一 DSH 对话内回退到用户消息前，并可一并恢复受跟踪的工作区文件。 | [Q03](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q03) 在固定 Web profile 与可丢弃目录先试一个小文件，用 Git 差异确认结果；[Q02](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q02) 所列跳过、失败和追踪空白出现时暂停续写，先恢复独立基准。 |
| [dsh-routing-suite](#plugin-1334586481-root) | 组合运行时注入器、思维模式路由预设与分级任务协议。 | 当前建议观察套装整体；先核对目标宿主版本与组件独立装配结果，再决定是否在隔离profile做开发实验。 |
| [dsh-sandbox-escalation-fix](#plugin-1335780030-root) | 按 DSH 会话沙箱和审批策略调整工具升级参数、归一无效请求并过滤不适用提示。 | 先测官方是否仍反复失败，再隔离profile核正常/越界/升级矩阵；不兼容或冲突就回原生。 |
| [dsh-secure-audit](#plugin-1339251799-root) | 为 DSH 提供启发式文本扫描、PII脱敏和本地配置审计工具。 | [Q03](../../plugins/pensivefei--dsh-secure-audit/INSIGHT.md#research-q03) 合成保留集逐字段验收后再考虑集成。 |
| [dsh-session-diff](#plugin-1372976273-root) | 在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。 | 适合用Git兜底的开发者在独立web profile试用，先核对已知改动与显示路径；出现未提示错归因或接管异常就停用，不能当完整审计。 |
| [dsh-sidebar-git-graph](#plugin-1393980674-root) | 在DSH右侧栏查看当前会话仓库的提交关系、工作树改动和文件差异。 | 本地单用户开发者可先用小仓库试用并与CLI核对；先审查webServer访问控制，出现静默换库、未说明截断或无法解释的差异即回到CLI。 |
| [dsh-sieve](#plugin-1404374196-packages-dsh-sieve) | 为 DSH 提供工具输出筛选、历史上下文精简、技能按需展示和长任务监督。 | 先用可丢弃测试项目，只比较输出筛选而保留其他监督为观察模式；记录同任务结果、原文重读和判断费用。 |
| [dsh-skill-creator](#plugin-1344713683-root) | DSH 内四个模型工具，用确定性规则草拟、校验、打包和改写技能描述，可挂载输出目录。 | 隔离 outputDir，先 dry-run 再人工核对 SKILL.md；文本技能再打包并解包核查文件，二进制资源不用当前打包路径。 |
| [dsh-slipway](#plugin-1422359117-root) | 预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉核对选中文件。 | 先在可丢弃个人仓库对非敏感小工程使用CLI plan，对照所有必需产物和导出路径，再核对预演阶段。 |
| [dsh-snapshot-manager](#plugin-1412896722-root) | 按会话轮次采集工作区快照，并提供文件恢复和对话回退入口。 | [Q05](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q05) 先在可丢弃副本检查排除项、运行态、文件哈希与独立备份；状态未知或预览异常时停止，不在重要工作区依赖单一快照。 |
| [dsh-spring-admin-kit](#plugin-1412897663-root) | 注册Excel批量导入导出及Thymeleaf/LayUI模板规范两个DSH技能。 | 先观察并修示例，隔离库验事务/重复键/权限和模板渲染后再有限复用；不直接生产套用。 |
| [dsh-ssh-logs](#plugin-1346017360-root) | 通过DSH内置MCP桥提供服务器列表、限量日志读取和固定字符串搜索，使用预设SSH主机与日志根别名返回来源片段。 | 有条件试用。 |
| [dsh-suite（目录与维护工具）](#plugin-1333152408-root) | 维护 DSH 插件目录、双语入口和分层兼容检查脚本，另含独立插件与脚手架子包。 | 把目录当查候选的入口，逐项回到固定版本原仓库；不要把ok、历史安装验证或根仓库子包介绍当当前任务已通过。 |
| [dsh-super-injector](#plugin-1332659211-root) | 在 DSH 运行时加载、重载和管理本地插件包。 | [Q03](../../plugins/yjh051108--dsh-super-injector/INSIGHT.md#research-q03) 只在隔离 profile 验证惰性包。 |
| [dsh-task-monitor](#plugin-1406156934-dsh-task-monitor) | 在侧边浮层汇总任务环境、Git、技能、MCP 与发布动作。 | 保持观察；不要在含生产 remote 的工作区启用写动作，先用一次性仓库核提交、推送、切支和发布失败恢复。 |
| [dsh-taskswarm](#plugin-1333800488-root) | 为DSH按任务包依赖分波并行调度worker，以Git worktree、检查点、状态/邮箱和review/merge流程集成代码产出。 | 先观察，不将默认自主流程视可靠接受门；可丢弃仓库研究需独立强制CI/人工SHA验收及权限/预算/网络控制。 |
| [dsh-tavern 启动器](#plugin-1335944000-tavern-plugin-packages-dsh-tavern) | 在官方 DSH 桌面和 DSH NEXT 安装、切换和管理酒馆 Profile，提供进程退出与失败恢复状态。 | [Q04](../../plugins/flizzywine--dsh-tavern--tavern-plugin-packages-dsh-tavern/INSIGHT.md#research-q04) 在单宿主和专用目录试一次来回切换，核对恢复路径和留存。 |
| [dsh-thinking-effort](#plugin-1334875164-root) | 为 DSH 自定义 pi-ai 模型配置思考档位，并设置子 Agent 默认思考强度与兼容选项。 | 独立profile单模型核请求再核子Agent，失败或超预算还原字段；不为内建模型重复增加控制。 |
| [dsh-tianshu-tui](#plugin-1332692519-root) | 为 DeepSeek Harness 提供流式消息、工具卡、会话操作和 LSP 诊断的交互式终端界面。 | [Q05](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q05) 建议先在独立 profile、固定版本和可丢弃目录用普通逐卡审批做一处受控修改，确认指令已投递后再测取消、切会话与退出。 |
| [dsh-token-billing](#plugin-1335139860-root) | 在DSH会话中显示实时token费用，结合路由价目与政策时间线，保存跨会话账本并提供统计、余额及CSV/JSON导出。 | 先观察。 |
| [dsh-tool-csv](#plugin-1327795364-packages-dsh-tool-csv) | 在 DeepSeek Harness 中解析 CSV 文本、按列精确查找并输出统计。 | [Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-csv/INSIGHT.md#research-q03) 建议先跑 stats，再试有唯一表头的公开样本。 |
| [dsh-tool-diff](#plugin-1327795364-packages-dsh-tool-diff) | 在 DeepSeek Harness 中比较文本、JSON、CSV 和 Markdown，并生成和校验内存补丁。 | [Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-diff/INSIGHT.md#research-q03) 限公开小样本试用，按 [Q02](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-diff/INSIGHT.md#research-q02) 核对裁切和重复键，实际仓库修改用原有 Git 流程。 |
| [dsh-tool-encoding](#plugin-1327795364-packages-dsh-tool-encoding) | 在 DeepSeek Harness 中对 UTF-8 文本编解码、计算摘要并生成 UUID。 | [Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-encoding/INSIGHT.md#research-q03) 建议在隔离 profile 仅用公开样本复核 [Q02](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-encoding/INSIGHT.md#research-q02) 的往返和拒绝行为。 |
| [dsh-tool-json](#plugin-1327795364-packages-dsh-tool-json) | 在 DeepSeek Harness 中按路径查询 JSON 值，支持数组通配符和方括号访问。 | [Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-json/INSIGHT.md#research-q03) 用公开样本验证后限小型取值试用；对照 [Q02](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-json/INSIGHT.md#research-q02) 样本确认何时改用带来源 ID 的脚本。 |
| [dsh-tool-todo-plus](#plugin-1402589370-root) | 增强 DSH 任务清单工具，提供优先级、完整清单输出和会话浮动任务面板。 | 先用可复做多步骤任务核对原工具与增强输出，手动打开浮窗；另以实际产物验收，覆盖或错显即回官方工具。 |
| [dsh-trellis](#plugin-1335559646-root) | 为 DSH 提供任务阶段、步骤状态、会话提示与可选规划期工具过滤。 | [Q05](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q05) 建议在隔离项目备份同名技能后试用非关键任务；人工独立验证批准、Git 状态和业务结果，异常时停止流程并恢复备份。 |
| [dsh-TUI](#plugin-1333111893-root) | 为 DSH 提供交互式终端客户端，显示会话、工具状态、流式输出和上下文。 | [Q03](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q03) 在隔离 DSH home 先试已知新会话，再检查恢复与退出。 |
| [dsh-undo rollback bundle](#plugin-1338526178-packages-bundle-rollback) | 为 DSH 提供消息级文件与会话回退、归档管理及网页回退界面。 | [Q04](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md#research-q04) 建议先观察。 |
| [dsh-undo-savepoint](#plugin-1333816810-root) | 为DSH配置与插件代码保存恢复点并提供宿主及局外急救入口，逐文件恢复和秘密副本仍需独立核验。 | [Q04](../../plugins/lire1131--dsh-undo-savepoint/INSIGHT.md#research-q04) 观察，先隔离假home+非敏感副本核范围、接口权限、部分恢复与重启，独立备份不省；错恢复/缺失停写查明细/字节，回人工备份。 |
| [dsh-update-checker](#plugin-1334836615-root) | 在DSH GUI检查主程序和第三方插件版本，提供备份更新回退与Web重启流程，Desktop主程序转原生更新。 | 当前不推荐日常安装，先修拒绝零副作用与阶段回执，再核隔离恢复；不在用户部署运行复现。 |
| [dsh-vercel](#plugin-1425044910-root) | 通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。 | 可信单profile从只读工具试用，写操作核官方结果。 |
| [dsh-which](#plugin-1423215529-root) | 为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。 | 建议在可信工具链环境限定试用只读报告，关闭默认probe，关键决策用真实shell交叉核对；一旦builtin、别名或cwd不一致，停止据此修改环境。 |
| [dsh-workbench-plugin](#plugin-1334909671-root) | 在 DSH Web 聊天旁提供文件编辑、Git、终端及会话控制。 | [Q04](../../plugins/loadingvx--deepseek-harness-workbench-plugin/INSIGHT.md#research-q04) 先验 Host 权限、网络和进程退出，再用同一份本地修改与 IDE／CLI 对照。 |
| [dsh-workflow-templates](#plugin-1344715132-root) | 12 个预置 JS workflow 编排脚本目录，提供列出、搜索、渲染调用起点和静态校验四工具。 | 先 list/search，审模板代码及来源；补真实 args 和数据接入，只有明确需要多 Agent 时调用官方 workflow；详见[Q03](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md#research-q03)。 |
| [dsh-worktable 内容组件](#plugin-1336092482-01-content) | 将项目窗格、文件、网页、终端与DSH会话绑定，使用owner准入和目录预览能力，项目不是文件沙箱。 | [Q05](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md#research-q05) 精确支持Windows个人环境两独立低风险项目试，先绑定文件再预览终端；错挂/旧结果复活/撤权不符停并回原生会话与独立窗口，保备份。 |
| [dsh-wrapup-guard](#plugin-841979943-root) | 用 wrapup_check 记录收尾检查轮次并在三轮空问题报告后提示完成。 | 仅建议隔离项目观察试用。 |
| [dsh-wsl-browser](#plugin-1350379388-root) | 从WSL调用Windows默认浏览器打开http(s) URL，并提供localhost访问建议，不抓取页面或确认加载。 | [Q04](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md#research-q04) 可信无敏感URL个人小试，核真实页；HTTPS localhost建议先查协议/端口，不符或不可见则停并回复制链接及专门网络诊断。 |
| [dsh-wsl-cred](#plugin-1350379113-root) | 将Git credential.helper、Windows GCM路径和origin协议线索汇成模型报告，不执行认证或修改凭据。 | [Q04](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md#research-q04) 先观察并补明确目标与最小化输出；当前不要未经预检把内联helper交给模型，回本地手工检查，不自动运行global修改建议。 |
| [dsh-wsl-distro](#plugin-1350379001-root) | 查询 WSL 当前发行版与已安装发行版，并提示路径身份差异。 | [Q04](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md#research-q04) 重要路径操作前核对系统原始输出和实际文件。 |
| [dsh-wsl-docker](#plugin-1351854301-root) | 集中Docker context、daemon和推理容器线索，给端口/GPU建议；当前health等启发判断不等模型API就绪。 | [Q04](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q04) 先观察、修布尔/吞错/归属后评小试；当前只能人工核线索，假绿灯或端点不符停用回原生命令与日志，不自动改环境。 |
| [dsh-wsl-encoding](#plugin-1351854402-root) | 汇总WSL与Windows控制台编码并可查文件前段CRLF，只读不转换；样本范围与查询失败需单独核对。 | [Q04](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md#research-q04) 可信小脚本只读初筛并逐端核对，未采样/失败不当成功；大敏感文件不读，后续修复先备份，异常回本地原生针对性检查。 |
| [dsh-wsl-env](#plugin-1338530482-root) | 把 WSL、Windows 路径和 shell 环境说明注入 DSH 系统提示。 | [Q04](../../plugins/173787247--dsh-wsl-env/INSIGHT.md#research-q04) 标准WSL布局用户核SYSTEM后，可在只读路径任务试用；发现环境/路径不符或工具不存在，就纠正或停用并新建会话。 |
| [dsh-wsl-expose](#plugin-1351853956-root) | 为 WSL 服务提供 Windows 端口映射建议及可选 netsh 操作。 | 先只读核对网络和规则；LAN 变更需明确授权并确认恢复，不依赖文档所称 opt-in。 |
| [dsh-wsl-git](#plugin-1381833309-root) | 在 DSH 中查看 Git 仓库状态、差异统计和最近提交。 | [Q03](../../plugins/173787247--dsh-wsl-git/INSIGHT.md#research-q03) 在测试仓库先比对含未跟踪内容的摘要；需要代码级变更时改用原生 Git。 |
| [dsh-wsl-github](#plugin-1350544211-root) | 以GitHub App或token回退查询仓库open PR和最新Actions，并提供凭据存在性提示，不处理git push。 | [Q04](../../plugins/173787247--dsh-wsl-github/INSIGHT.md#research-q04) 单账号固定安装最小权限可试，明确repo并核两子字段/notes；多账号先隔离或修缓存，关键CI回目标PR页核head，不自动增权。 |
| [dsh-wsl-glab](#plugin-1381859919-root) | 在 DSH 中查看 GitLab 合并请求、问题与流水线状态。 | [Q03](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md#research-q03) 用只读测试项目核对空列表和失败样本，持续以项目原件确认关键决策。 |
| [dsh-wsl-hostsvc](#plugin-1351854010-root) | 从WSL探测本地模型端口和models API，对照Ollama容量与设置并给provider草稿，不生成或自动改配置。 | [Q04](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md#research-q04) 能核设置者限单可信服务试，草稿非自动修复；API/运行容量不符或取消不可控则停依赖建议，回服务日志/nc/curl，恢复原配置。 |
| [dsh-wsl-jev](#plugin-1381389698-root) | 为 DSH 接入 TypeSafe Jev 的结构化问答、证据核对与候选排序。 | 先用非敏感材料作为辅助核对；外发不获准或标签不能复核时停用。 |
| [dsh-wsl-launch](#plugin-1350378498-root) | 在 WSL 中通过 DSH 工具启动匹配白名单的 Windows 应用。 | 先核实程序来源和参数；失败或超时后检查实际进程再决定。 |
| [dsh-wsl-path](#plugin-1350378631-root) | 在 WSL 中转换 Linux 与 Windows 路径文本并给出文件系统提示。 | [Q04](../../plugins/173787247--dsh-wsl-path/INSIGHT.md#research-q04) 对涉及写入或跨发行版的路径先独立核对文件身份。 |
| [dsh-wsl-picker](#plugin-1351853863-root) | 向Agent列出WSL目录并提供根、Windows盘符和IM快捷入口，支持过滤截断，不登记工作区。 | [Q04](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md#research-q04) 先观察并核授权/浏览根，再考虑非敏感副本试；显式路径核截断，敏感或慢盘停止回本地ls，不把只读当隐私隔离。 |
| [dsh-wsl-pkg](#plugin-1381861315-root) | 在 DSH 中读取 npm、pip 与 Cargo 的依赖和版本摘要。 | [Q03](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md#research-q03) 先在已知依赖项目验证实际包管理环境。 |
| [dsh-wsl-port](#plugin-1350378913-root) | 为 WSL 服务提供本地端口监听线索和 Windows 访问建议。 | 把结果作为 WSL 本地线索，命令失败或 Windows 不通时分层验证。 |
| [dsh-wsl-search](#plugin-1381725987-root) | 为 DSH 提供根目录受限的 ripgrep、fd 和 ast-grep 搜索工具。 | 只查明确样本根；工具重名或需要完整命中时回归受控 CLI。 |
| [dsh-wsl-ssh-agent](#plugin-1351854356-root) | 只读汇总WSL进程socket、agent身份数量及常见桥线索，不读私钥正文、不建桥或验证远程认证。 | [Q04](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md#research-q04) 可信个人WSL可只读初筛但核原生命令；共享桥/强治理先观察，错误或隐私不清停用，不自动加载key或建桥。 |
| [dsh-wsl-struct](#plugin-1381832935-root) | 在 DSH 中使用 jq、yq 与 sqlite3 查询结构化数据。 | [Q03](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md#research-q03) 在合成配置样例上验收，涉及保密数据先检查 CLI 访问范围。 |
| [dsh-wsl-tmux](#plugin-1381833652-root) | 在 DSH 中查看 tmux 会话及 pane 输出。 | [Q03](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md#research-q03) 从隔离测试 pane 开始，核对实际目标后再读运行信息。 |
| [dsh-wsl-uia](#plugin-1391141792-root) | 从 WSL 枚举 Windows 窗口、读取控件树，并按名称等待或查找路径。 | [Q03](../../plugins/173787247--dsh-wsl-uia/INSIGHT.md#research-q03) 在无敏感内容的测试窗口以原生 UIA 复核树和等待。 |
| [dsh-wsl-winctl](#plugin-1391143632-root) | 从 WSL 枚举 Windows 窗口，并调整位置、大小、可见状态或请求关闭。 | [Q03](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md#research-q03) 先只枚举测试窗口，变更时核对明确目标和可见状态。 |
| [dsh-wsl-wininput](#plugin-1391142149-root) | 从 WSL 调用 Windows 控件，并发送键盘、文字、点击和滚动操作。 | [Q03](../../plugins/173787247--dsh-wsl-wininput/INSIGHT.md#research-q03) 先在可弃用应用验证焦点和结果，暂不用于高影响动作。 |
| [dsh-wsl-winshot](#plugin-1391140767-root) | 从 WSL 捕获 Windows 窗口或指定区域并保存 PNG。 | [Q03](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md#research-q03) 只在隔离桌面用明确 PID 和目录验收，结果不符回原生。 |
| [dsh-wsl-workspace](#plugin-1334205011-root) | 在 DeepSeek Harness 中使用本机 WSL 发行版工作区。 | [Q04](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md#research-q04) 在隔离 WSL 发行版试用只读操作并备份；对写操作使用 tty:false 并核状态。 |
| [dsh-wsl-workspace](#plugin-1351853812-root) | 只读列出WSL发行版并检查工作区路径，以位置和目录状态给建议，不搬迁文件或实测性能。 | [Q04](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q04) 只读线索小试但显式给路径、核实际挂载；符号链接/自定义挂载或输出不一致停并回原生命令，迁移前保原件测真实项目。 |
| [dsh-wsl-wslconfig](#plugin-1351854461-root) | 只读寻找并解释.wslconfig前段键值，给网络和资源提示；猜测路径、截断和读取失败不能证明实际生效。 | [Q04](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md#research-q04) 先本地核真实path与原文安全后窄线索试用；空字段/冲突先查读取覆盖，不按ok改网络，后续编辑/shutdown另授权安排备份维护。 |
| [DSHana](#plugin-1334296085-root) | 将 DSH 嵌入 HanaAgent App，以受管 Node runtime、任务句柄、审批和模型桥接提供子代理执行。 | 观察：专用Hana/OS环境先核权限与两桥，再用自造小项目文字任务分别核接受、DSH结束、宿主终态和进程收尾。 |
| [easyeda-agent](#plugin-1280115203-root) | 通过 CLI、MCP 与连接器让 Agent 读取和操作 EasyEDA Pro 工程，并配套设计与回读 Skill。 | [Q04](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q04) 专业用户仅在备份副本中先确认health和目标身份，再试一项小编辑并回读、检查和保存重载。 |
| [Everything Kiro](#plugin-1139909532-root) | 面向 Kiro IDE 的 Agent、Hook、Steering、Power、MCP 示例和开发工作流配置集合。 | [Q03](../../plugins/iamaanahmad--everything-kiro/INSIGHT.md#research-q03) 先一次性工程只取手动steering/Spec，禁用MCP和自动修复；核实际IDE加载与差异，再审每条命令和权限。 |
| [Flameox](#plugin-1311955212-root) | 为编码 Agent 协调本地性能采集、分析与证据保存，返回带来源、覆盖和限制的有界结果。 | [Q03](../../plugins/morluto--flameox/INSIGHT.md#research-q03) 先分析脱敏已有artifact并保存可追溯证据，再决定是否配置特定capture provider。 |
| [FlowX for DeepSeek Harness](#plugin-1323569556-plugins-deepseek-harness-flowx) | 在 DSH Web 侧栏查看 FlowX 工作流、依赖图与流程文件。 | [Q04](../../plugins/aiprobuilder--flowx--plugins-deepseek-harness-flowx/INSIGHT.md#research-q04) 只建议已有 FlowX 的使用者在隔离环境观察，先核实 owner 请求边界，再比较一个无敏感样例。 |
| [ForkProbe](#plugin-1261092598-root) | 对同一任务并排试跑模型与候选Skill，生成本地比较报告 | [Q04](../../plugins/jayden-x-l--forkprobe/INSIGHT.md#research-q04) 仅隔离、脱敏且阻断遥测的小试；核判定落盘和子进程退出后再扩大。 |
| [Godot Bridge](#plugin-1334303936-root) | 以原生DSH工具启动/接管Godot实例，经游戏内TCP服务器执行运行态命令、截图和脚本。 | [Q05](../../plugins/smalldy--godot-bridge/INSIGHT.md#research-q05)可信副本/单操作者受限试用；核项目diff/实例/最终产物，不信stop或success字段替代验收。 |
| [Grove](#plugin-1229298801-root) | 以持久化图记录工程目标、工作项和证据，提供 CLI、MCP 及独立 DSH 适配器。 | 先用独立 CLI 小样本，不迁移生产任务；用第二会话核证据并确认项目定位。 |
| [HarmonyOS NEXT Skills](#plugin-1179983747-root) | 通过 DSH 单技能 provider 提供离线 HarmonyOS 资料导航及 DevEco/HDC 证据脚本。 | 可先试固定版本普通参考，自动化仅在无外部副作用测试页确认before/after；版本不明、敏感采集不可控或动作状态未知时停止，回官方资料/IDE与手工读回。 |
| [harness-github](#plugin-1343702731-root) | 为DSH提供GitHub仓库、PR、issue、CI与评审工具，通过gh或REST读取和操作，并提供工作流指引。 | 先观察，暂不依赖当前审批边界做日常写操作。 |
| [Hedgehog](#plugin-1307156567-root) | 为编码 Agent 安装角色与 Skill，并用 SQLite 构建图协调任务依赖、租约、范围验证和 Git 提交。 | 可弃置新仓一层任务，审verify命令与自动commit并保空index；不跑并发/外部core/目标worktree，状态或index不明先停执行者退手工清单与测试，见 [Q06](../../plugins/skyf0xx--hedgehog/INSIGHT.md#research-q06)。 |
| [HelloAGENTS](#plugin-1064776002-root) | 为AI编码CLI提供任务路由、质量Skill、项目知识、会话恢复和交付检查脚本。 | 有跨轮编码任务且愿维护计划的用户可在单宿主副本试用，先备份配置并核对真实验证日志；与项目规则冲突或只增加填表负担时退回原有AGENTS和CI。 |
| [Helm D](#plugin-1334304098-packages-helmd) | 为 DSH 提供安全分析工具、案例证据记录及相关工作流。 | [Q05](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q05) 建议先观察并审阅完整行为，确认授权、独立备份和执行边界后再考虑隔离验证。 |
| [helm-d](#plugin-1334304098-root) | 面向 DeepSeek Harness 的安全分析工具与案卷项目。 | [Q04](../../plugins/adwmc--helm-d/INSIGHT.md#research-q04) 先确认授权和包来源，在隔离环境测试后再考虑接入；保持原始证据和敏感数据访问控制。 |
| [Hindsight for Coding Agents](#plugin-1086419061-hindsight-integrations-coding-agents) | 为编码 Agent 保存会话记忆，并在后续任务中检索相关上下文。 | [Q04](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q04) 只建议在隔离 profile 和可控服务上试无敏感的样本。 |
| [iKanban](#plugin-1137545389-root) | 面向 OpenCode V2 的独立静态浏览器前端，提供项目、会话、审查、终端与多服务器管理。 | [Q03](../../plugins/isomoes--ikanban/INSIGHT.md#research-q03) 适合有OpenCode后端和网络配置能力者在可丢弃项目小范围试，先核当前服务器/会话及全局自动批准。 |
| [IllusionAgent](#plugin-1202726483-root) | 提供多模型 Agent 的命令行、网页界面、工具和扩展。 | [Q03](../../plugins/yuntaihua--illusion-agent/INSIGHT.md#research-q03) 先在隔离环境核工具允许与拒绝规则的优先级；不满足预期时停用对应模式。 |
| [iosdev-cn](#plugin-1005356138-root) | 提供面向中国区的 iOS 开发、构建、签名、测试、订阅与 App Store 上架流程 Skill。 | [Q03](../../plugins/kuangre123--iosdev/INSIGHT.md#research-q03) 先观察，只用于脱敏项目的只读差距清单。 |
| [iPolloWork](#plugin-1044010907-root) | 本地优先的多引擎 Agent 工作台，用于组织项目、任务、插件与可编辑产物，并接入 DeepSeek Harness。 | [Q04](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q04) 只用副本项目验证一次工作台会话，并保留原生入口。 |
| [J-Space Cognition Suite](#plugin-1308234922-root) | 用可选Skill模块与Python控制器维护长任务状态、源码映射和证据检查。 | [Q04](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q04) 先在单个非关键长任务验证证据变化会被拒绝，再看维护负担是否换来少返工；短直接任务用轻量级别，不强行跑完整控制循环。 |
| [Jev 决策插件](#plugin-1391049410-root) | 在 DSH 扩展点调用 Jev 或 Luna Decisions，支持按需监督、筛选、导航和单次审批辅助。 | [Q04](../../plugins/luobosibing2--dsh-jev-plugin/INSIGHT.md#research-q04) 单独启用完成检查，用受控文本与独立验收判断收益，保留审批人工路径。 |
| [Kimi Plugin CC](#plugin-1211353708-root) | 把本机 Kimi Code CLI 接入 Claude Code、Codex 与 DSH，提供第二轮审查、修复及可追踪的任务控制。 | [Q04](../../plugins/linxule--kimi-plugin-cc/INSIGHT.md#research-q04) 仅在已有授权的 CLI 与受管钩子下试一份公开小 diff，钩子不匹配或发现不可复核就回原宿主手工查。 |
| [KimiX](#plugin-1180401969-root) | 基于 Kimi CLI 的命令行代理与脚本工作流，提供文件、命令及模型工具。 | [Q04](../../plugins/sikao-engine--kimix/INSIGHT.md#research-q04) 建议熟悉代码与命令的开发者先在非敏感副本试小任务，并自行核对实际检查结果。 |
| [Knit](#plugin-1371827207-root) | 为 DSH 提供按任务检索工作区文档与代码、展示命中理由和来源的侧栏及模型工具。 | [Q05](../../plugins/polinnizhong--dsh-knit/INSIGHT.md#research-q05) 只在可信合成目录做词法试用。 |
| [lark-agent-bridge](#plugin-1339469423-root) | 把飞书消息桥接到本地 DeepSeek Harness 会话，并将代理回复流式返回原会话。 | [Q03](../../plugins/bihangchi9-creator--lark-agent-bridge/INSIGHT.md#research-q03) 在专用群和隔离 profile 观察只读链路，[Q02](../../plugins/bihangchi9-creator--lark-agent-bridge/INSIGHT.md#research-q02) 的群授权范围和副作用需验证后再评估写权限。 |
| [leantoken](#plugin-1301161244-root) | 通过本地索引和 MCP 为开发 Agent 返回带 token 预算的仓库代码上下文。 | [Q03](../../plugins/morluto--leantoken/INSIGHT.md#research-q03) 以同模型同仓库做只读对照，先确认关键证据，再判断节省。 |
| [Ledger Memory](#plugin-1412857520-root) | 为 DSH 项目保存活跃台账、经验卡与交接资料，自动注入记忆并提供压缩胶囊和会话文本指针回读。 | 可备份V3非关键项目先核拒写/授权/stage和压缩回读，定期人工比对真实工作区；缺口出现暂停自动依赖，见 [Q04](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q04)。 |
| [LogicProbe](#plugin-1331586818-root) | 检查设计和代码主张，使用可执行模型分析状态、数据和结构，并比较验证报告。 | [Q04](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q04) 建议先在可核对源码的小状态机上试用，保存完整报告；映射无法确认或检查持续未决时回到既有审查和测试。 |
| [LoopX DSH Plugin](#plugin-1255217938-packages-dsh-loopx-plugin) | 将 LoopX 初始化、同会话续轮和 GoalBar 接到 DeepSeek Harness。 | 按 [Q05](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q05) 在无外部副作用的项目试一轮。 |
| [Martty](#plugin-1333365124-npm) | 提供Martty原生painter启动、DSH插件入口、ACP会话连接池及Harness安装管理的npm子包。 | [Q05](../../plugins/openma-ai--martty--npm/INSIGHT.md#research-q05) 观察可信单Harness启动并做双会话/拒配置/安装取消测试，失败保设置回原CLI。 |
| [Martty](#plugin-1333365124-root) | Rust原生Agent TUI，以ACP连接DSH或其他agent，Node Cordis组合会话视图、命令和插件。 | [Q05](../../plugins/openma-ai--martty/INSIGHT.md#research-q05) 观察可信单Harness副本任务，验证会话与本地权限后再扩范围；故障回原CLI核实际状态。 |
| [Matt Skills Deck](#plugin-1336488925-root) | 在 DSH 中提供内置工程 Skill、工作区任务面板和工单交接，支持不同 Tracker 后端。 | 先用隔离 Profile 和只读测试仓库验证一个工单交接，发现引用或权限不一致就回到原 Tracker。 |
| [MC Mods Dev Bridge](#plugin-1426070939-root) | 驱动真实 Minecraft 服务端与客户端运行场景 JSON，采集探针证据并覆盖 Fabric、Forge、NeoForge。 | 适合维护 MC 26.3 多 loader 模组、已有合法实例且能承担真实进程成本的团队观察；先只做 preflight 和一个 smoke 场景，验收 teardown、证据目录、/mods 双侧一致与端口恢复。 |
| [MemOS Local Plugin](#plugin-1014729376-apps-memos-local-plugin) | 为 DSH 等宿主提供本地记忆、按轮召回和后台捕获的多宿主插件。 | 按 [Q05](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q05) 用非敏感项目做可核对纠正，对比手工笔记。 |
| [Minecraft Dev](#plugin-1336062434-root) | Minecraft 开发技能与工具集，用契约、清单审计和错误归属辅助多分片集成。 | 可试用临时虚拟项目的契约、brief 与 dryRun，只喂合成日志；不开 Codex、不启动 Gradle，不使用真实仓库。 |
| [Minke](#plugin-1334714311-root) | 基于 DeepSeek Harness 的本地桌面工作区，整合会话、文件、终端与共享浏览器。 | 首次成本比小插件更大：下载匹配OS架构的完整客户端，迁移或配置模型凭据、工作区和插件，确认其内嵌DSH版本；源码开发还需pnpm、Electron及多workspace产品包构建。 |
| [MisakaNet](#plugin-1224734286-root) | 为 AI Agent 提供带证据等级的故障经验检索与记录。 | [Q04](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q04) 先以合成故障搜索并阅读完整 lesson，环境不符或不能外发时停止，回本地日志。 |
| [Mobius](#plugin-1273324178-root) | 以项目工作台连接团队、编码 Agent、模型与设备，组织会话、任务、知识和执行记录。 | [Q03](../../plugins/nutshellai-tech--mobius/INSIGHT.md#research-q03)正式团队多设备场景observe，先独立做两用户/权限/文件与真实终止恢复矩阵。 |
| [model-usage-plugin](#plugin-1334569518-root) | 在DSH Web设置中展示模型token、估算费用、工具指标、使用趋势与DeepSeek账户余额，并从会话日志补充历史日账。 | 先观察。 |
| [Morning Star Harness](#plugin-1174622182-root) | 为多个编码宿主提供计划、角色分工、工作流状态与交付流程。 | [Q05](../../plugins/btspoony--mstar-harness/INSIGHT.md#research-q05) 建议先在隔离仓库使用小任务，核对实际宿主策略、身份和独立审查；退化或授权不符时暂停。 |
| [Multica DSH Runtime](#plugin-1331025830-root) | 为Multica提供DSH单次JSONL执行、模型发现、会话续接与协作取消桥接。 | [Q03](../../plugins/multica-ai--dsh-multica-runtime/INSIGHT.md#research-q03) 专用profile最小工具先核协议和停止。 |
| [Odai](#plugin-1185828998-root) | 提供代理任务治理技能、可选职责路由及独立命令行运行时。 | [Q04](../../plugins/orziz--odai/INSIGHT.md#research-q04) 建议先在隔离项目以只读任务核实；宿主权限或配置恢复不明时暂停路由安装。 |
| [odai-dsh-plugin](#plugin-1185828998-dsh-plugin) | 为 DSH profile 提供 Odai 职责路由、治理和控制中心。 | [Q04](../../plugins/orziz--odai--dsh-plugin/INSIGHT.md#research-q04) 先在隔离 profile 与合成数据上核对 guard、路线、证据和退出；任一边界不符时恢复宿主原配置。 |
| [Oh My DSH](#plugin-1363525420-root) | 面向固定 DSH 宿主版本的增强插件，提供工具结果缩减、原文回查和任务工作流。 | [Q01](../../plugins/gulagala001--oh-my-dsh/INSIGHT.md#research-q01) 需要反复读取源码且已有匹配 DSH 的用户，可先在独立 profile 观察任务副本。 |
| [Oh-DSH](#plugin-1330531961-root) | 围绕同一 DSH runtime 提供 Desktop、Web、TUI 发行表面及带预览/恢复的插件市场。 | 保持观察；熟悉DSH且有跨端需要者可主动用独立根做临时工程验证。 |
| [oh-my-deepseekharness](#plugin-1379204512-root) | 为 DeepSeek Harness 提供多代理编排与工具接入。 | [Q04](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md#research-q04) 用受限预算在隔离项目试只读委派，核结果与成本；服务降级时回原生流程。 |
| [oh-my-dsh](#plugin-1333125623-root) | 按独立 ESM 插件组织的 DSH 能力库，涵盖研究、编排、守卫等扩展示例。 | 观察：维护者围绕一明确缺口读一包，固定宿主后在隔离profile核真实任务、缺服务和取消，保留原宿主退路。 |
| [OMA for DeepSeek Harness](#plugin-1145914675-integrations-dsh) | 将 OMA 项目 Skill 和验证钩子桥接 DSH。 | [Q04](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q04) 在备份项目审查规则和 setup，停止上限须独立验收。 |
| [OPC-Nexus](#plugin-1318562243-root) | 以 Hermes 项目对话和 Electron 工作台组织数字员工的计划、审批、派工、产物验收与交付。 | [Q03](../../plugins/h4dex--opc-nexus/INSIGHT.md#research-q03) 对正式复杂交付先observe；待小项目走通真实多员工、独立验收、返工／取消／崩溃恢复和退出，再判断迁入。 |
| [open-record-replay](#plugin-1276135867-root) | 在 macOS 记录桌面操作并为 Agent 技能创建整理证据包。 | [Q03](../../plugins/humblebanana--open-record-replay/INSIGHT.md#research-q03) 用合成流程录制，单独验证并检查证据后再交接。 |
| [OpenBitFun Agent 工作区](#plugin-1147866277-root) | 独立 Agent 工作区，支持跨设备控制、远程工作区与可选 DSH 会话。 | 用测试账号和可回滚仓库先跑一次短任务，再从第二设备核对任务 ID 与审批。 |
| [opencode2dsh](#plugin-1350368388-packages-plugin) | 为 DeepSeek Harness 提供 OpenCode Zen 模型适配与可选的本地 OpenCode 委派。 | 有资格和兼容证据前维持观察。 |
| [OpenDesign](#plugin-1223170290-root) | 连接编码 Agent、设计系统、原型预览和团队反馈的独立设计工作区。 | [Q05](../../plugins/nexu-io--open-design/INSIGHT.md#research-q05) 先核独立客户端环境和 DSH probe，限定一份本地 HTML 与副本，不启云同步；逐次核运行是否截断、文件/manifest 和视觉结果。 |
| [OrcaReplay](#plugin-1350419329-root) | 外置 CLI 调试工具，记录 Agent 请求、工具和文件变化，支持模型响应回放、检查点分叉与模型比较。 | 先用可丢弃、无真实秘密的项目做严格回放，只把匹配视为协议重现；分叉需另看真实任务质量与费用。 |
| [Ouroboros](#plugin-1133901637-root) | 用访谈生成验收规格 Seed，再将机械检查和模型审阅投影为验收结果的 Python 工作流工具。 | [Q01](../../plugins/q00--ouroboros/INSIGHT.md#research-q01) 选择已有可执行测试的小改动，[Q04](../../plugins/q00--ouroboros/INSIGHT.md#research-q04) 在独立低权限副本先确认项目命令，再冻结经签认的 Seed。 |
| [Perfect Web Clone](#plugin-1128708803-root) | 以Skill驱动宿主编码Agent，配套网页采集、分区和量化工具；root提供DSH shim，但分进程CLI活动工作区与综合门控是采用前必须核实的断点。 | 先观察。 |
| [phi](#plugin-1321152436-root) | 提供终端编码、权限控制、子 Agent、扩展和按需 MCP 工具发现的独立 Go 客户端。 | [Q04](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q04) 先在可信只读MCP任务中对照试用，保留真实权限配置；漏用工具、拒绝失配或总负担上升就回原客户端。 |
| [PictureReader](#plugin-1335660277-root) | 为 DSH 提供截图分析、OCR、视觉路由、文档转图和本地图像编辑。 | 先观察无敏感图片，若数据出站无法确认则使用原生手工或本地 OCR。 |
| [Pilot Harness](#plugin-1336793734-root) | 将 DSH 底座组合为 Electron 桌面客户端与独立界面插件，提供模型配置和工作区 Files 侧栏，真实文件操作需另核目标与并发边界。 | 复制workspace、独立资料目录先只读浏览和插入草稿路径；写操作/模型权限另核，界面目标或写结果不清先停，见 [Q05](../../plugins/op7418--pilot-harness/INSIGHT.md#research-q05)。 |
| [Plan Lattice](#plugin-1334504487-root) | 在 DSH 历史替换后恢复原生任务依据，并可显式启用完整执行门禁。 | 先用作者公开稳定包/候选在相同 DSH 版本隔离试点，重点比较替换后权威保真和门禁对合法写入的影响；无需把 rc.8 或机制比例当生产收益，详见[Q03](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q03)。 |
| [Plugin Manager](#plugin-1333152408-packages-plugins-plugin-manager) | 在 DSH Web 商店浏览目录、查看兼容信息并调用官方 CLI 安装和更新插件 | [Q04](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-manager/INSIGHT.md#research-q04) 建议观察，先读目录并手工固定spec在隔离profile安装。 |
| [plugin-team-board](#plugin-1333152408-packages-plugins-plugin-team-board) | 为同一 DSH 进程提供共享任务服务、五个任务工具和三列看板，并保存任务快照。 | 先观察并核查旧依赖与路由边界，不把claim当锁、done当验收；重要任务继续用已有可靠流程。 |
| [QA Skills](#plugin-1278843763-root) | 提供跨宿主测试工程 Skill 集合，组织需求、策略、用例、执行证据、回归与报告。 | 从一项明确需求或单阶段开始，提供真实基线、环境和账号，保留原测试清单对照。 |
| [RainSkills](#plugin-1237266636-root) | 在多种 Agent 中提供 Rainbond 部署、排障与交付验证流程，DSH 包注册引导 Skill。 | 仅在测试租户验证一个应用，先回读权限，未知写入先查询，最后检查目标 API。 |
| [rdd-explore](#plugin-1222692871-dsh-dsh-rdd-explore) | 为 DSH 提供代码探索缓存查询、子代理派遣和模型目录。 | [Q03](../../plugins/yaphethayate--coderdd--dsh-dsh-rdd-explore/INSIGHT.md#research-q03) 以非敏感项目核权限与端点，结果回源码验证；不满足条件时退回原生搜索。 |
| [REA](#plugin-1209966933-root) | 通过 CLI 与 MCP 分析应用构建物、二进制和网页，并输出可回查的分析证据。 | [Q04](../../plugins/morluto--rea/INSIGHT.md#research-q04) 建议把试用限定为已知的有权样本。 |
| [Rotifer Protocol](#plugin-1188590713-plugins-rotifer) | 为 DSH 提供 Rotifer 技能及 MCP 接入，辅助发现、比较和管理 Gene。 | [Q05](../../plugins/rotifer-protocol--rotifer-playground--plugins-rotifer/INSIGHT.md#research-q05) 先在隔离仓库只读核查并独立备份；未经授权或来源不可审时停止。 |
| [RoundTable](#plugin-1342524723-root) | 在 DSH 会话中组织多专家圆桌、汇总和人工评审。 | 以小预算、两节点和非敏感任务试验，用户核对原文并承担最终决策。 |
| [Ruflo](#plugin-995029641-root) | 独立CLI/MCP协调工具，登记角色和任务、路由模型请求并集中记录状态与策略。 | [Q05](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q05)观察；确认需要时私有stdio/隔离副本最小请求，分别核状态/响应/物理worker/独立产物。 |
| [See Wxapkg](#plugin-1146519069-root) | 自托管微信小程序 wxapkg 静态恢复工具，提供解密、解包、工程整理与结果报告。 | [Q04](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q04) 只在受控环境用自有样本试阅读恢复工程，先查诊断保留和报告，停止于等价保证不足的任务。 |
| [Sessions Insight](#plugin-1427788427-plugins-sessions-insight) | 在 DSH Web 中按项目查看 Claude Code、DSH 与 Codex 会话上下文，支持搜索、交接及会话管理。 | 试用限定独立可信本地Host及脱敏三源副本，只浏览/搜索并核原客户端。 |
| [sieve 开发工作区](#plugin-1404374196-root) | 包含 dsh-sieve 上下文处理插件与 Web 面板的开发工作区。 | 仅把根仓库作为维护和研究资料，先确认需要后端还是Web包，再阅读子包补丁与版本范围；不要把根URL交给用户当作完成安装。 |
| [sivtr](#plugin-1215961903-root) | 采集并搜索终端输出与 Agent 会话，提供 CLI 和 MCP 访问。 | [Q04](../../plugins/ariestar--sivtr/INSIGHT.md#research-q04) 先用隔离记录检查采集、权限与查询；不接受数据边界时停用相应采集或共享。 |
| [SkillHub DSH](#plugin-1178833585-plugins-dsh) | 在 DSH 浏览、预览、安装和管理 SkillHub 技能。 | [Q03](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q03) 仅在隔离项目试一个已审阅的来源和版本，回读终态、当前会话发现及权限。 |
| [Skills-Link](#plugin-1208725464-root) | 以共享目录、符号链接或 Junction 在多个 AI App 间组织本地 Skill，并提供可选 Git 同步与规则同步入口。 | [Q03](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q03)复制路径关Git试少量可信Skill，先验失败恢复，再考虑真实App和显式远端。 |
| [sofagent audit（DSH 子插件）](#plugin-1273149259-engine-dsh-plugins-cordis-plugin-sofagent-audit) | 将 sofagent 审计、危险命令检查、调用留证和任务验收接口接到 DSH 事件。 | 观察并保留外部CI，在单项目测试副本先测缺包/缺身份/失败验收，不能作为唯一交付门。 |
| [SpecFusion](#plugin-1156210476-root) | 聚合中文开放平台 API 文档，提供跨源搜索、全文与摘要读取，并附带 Agent Skill 和 DSH 接入。 | [Q04](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q04)以公开已知问题小范围试用，指定平台和模式，全文对照厂商原页后再写代码；错误来源、陈旧字段或服务失败时退回官方站，管理令牌未核不对外自建。 |
| [StrataGate DSH](#plugin-1329972465-root) | 为 DSH 提供分层会话记忆、持久事件、工作日记与跨会话检索。 | [Q04](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q04) 先在不敏感测试库核对一条改过的决定，关闭不需要的外部端点。 |
| [SumSec-Skills](#plugin-1207705027-root) | 按插件整理中文写作、开发工具及其他 Agent Skill，并提供多宿主入口。 | [Q03](../../plugins/summersec--sumsec-skills/INSIGHT.md#research-q03) 在隔离 profile 审查所需 Skill、安装副作用和原配置；发现冲突时停止加载并恢复。 |
| [Supergraph](#plugin-1232531989-root) | 为编码 Agent 集成工程工作流、代码图上下文和协作工具，包含 DSH Host 与客户端接入。 | 在隔离 Profile 只试一个项目的扫描，核对图结论与实际改动；失败即回到 Git diff 与测试。 |
| [Superpowers DSH](#plugin-1333750613-root) | 将上游软件开发方法作为可调用 DSH 技能注册 | [Q04](../../plugins/laynechai--superpowers-dsh/INSIGHT.md#research-q04) 先在隔离 profile 选择一个技能，对照团队现有规范。 |
| [TapTap DSH Maker](#plugin-1074165057-packages-dsh-maker) | 将 TapTap Maker MCP、工作流与功能技能以及固定 CLI 路径接入 DSH 的 bundle 插件。 | [Q03](../../plugins/taptap--instant-games-open-mcp--packages-dsh-maker/INSIGHT.md#research-q03) 备份profile并确认L1/L2不重复，核实际Maker0.0.32入口；先显式target_dir读取状态。 |
| [TapTap Open API MCP](#plugin-1074165057-root) | 为 TapTap 小游戏和 H5 提供文档、应用与排行榜管理、H5 上传和当前游戏相关操作的 MCP 服务器。 | [Q03](../../plugins/taptap--instant-games-open-mcp/INSIGHT.md#research-q03) 先在独立缓存与测试工作区用本地stdio查指南和状态，区分根Open API与Maker。 |
| [Terrain](#plugin-1269057665-root) | 独立桌面与CLI将仓库知识、Agent工具和Git漂移组织到一起；文档完整、资料同步和回答正确是不同判据，Ask还可自动准备并写知识资产。 | 复制允许处理的仓库，先生成少量知识并核源码定位/更新；明确接受Ask准备写入及模型路由，环境安装另按选择评估，见[Q04](../../plugins/sopaco--terrain/INSIGHT.md#research-q04)、[Q05](../../plugins/sopaco--terrain/INSIGHT.md#research-q05)。 |
| [Trae 连接器](#plugin-1349635927-root) | 将本机登录的 Trae 国内、企业和国际账号接入 DSH 模型选择器，提供用量、签到及模型管理。 | [Q04](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md#research-q04) 从单面板、单账号、已知可调用的模型开始。 |
| [Unity Plugin for DeepSeek Harness](#plugin-1349900532-root) | 把 Unity CLI 和正在运行的 Editor 接成 DSH 工具，支持状态、命令、C# 和配置。 | [Q05](../../plugins/opdsh--unity-plugin/INSIGHT.md#research-q05) 在可销毁项目和最低权限宿主只验收 status/list。 |
| [Upstash Agent Skills](#plugin-1190568968-root) | 为 DSH 加载 Upstash 产品技能并接入外部 MCP 服务。 | [Q04](../../plugins/upstash--skills/INSIGHT.md#research-q04) 在隔离账号中检查权限、数据与费用，退出时分别处理凭据和资源。 |
| [VibeSkills](#plugin-1164005541-root) | 通过本地 Skill 候选审计、分阶段需求与计划、模块执行及交付验收组织复杂任务。 | 在已列的宿主中选独立 Skill 根，仅用两模块的可丢弃任务核对原文、阶段停点和产物。 |
| [WeSight](#plugin-1232030145-root) | 为多种本地编码Agent提供桌面聊天、文件变化、配置与运行指标工作区。 | 已有多CLI需求的开发者可先用一个已有引擎在副本仓库试用，核对权限、文件与中断状态；若配置资源负担高于切换便利，或要求各引擎同等审批而未证实，就退回原CLI与编辑器。 |
| [Witness（dsh-verify）](#plugin-1335843750-root) | 用可复跑 JSON 浏览器断言检查网页行为，并输出逐步报告与截图 | 已有明确标准的开发者先在localhost用正确/故意错误断言试用，回读实际URL和报告；未审spec或基线不能放行，Host阻塞或目标不符退回CLI/手写Playwright。 |
| [WorkBuddy + Trae + Qoder Connect](#plugin-1407165036-root) | 聚合 WorkBuddy、Trae CN 和 Qoder CN 模型渠道、凭据状态、额度与签到面板。 | 观察并先修停用过滤/核凭据；后续关闭自动签到，单账号区域与项目副本核已知工具结果，异常回原客户端。 |
| [working-activity](#plugin-1309769324-root) | 为 pi 与 DSH 提供实时工具活动、模型自述、耗时和收尾统计的工作状态行。 | [Q04](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q04) 先仅事件模式，以工具日志为事实核对；若增加干扰或误导，回宿主原状态。 |
| [WSL rclone 查询工具](#plugin-1381859181-root) | 在 DSH 中查询 rclone 远程名称、目录条目与用量配额。 | [Q04](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md#research-q04) 先明确非空远程名单，再验证合成目录的允许、拒绝和截断。 |
| [xskill](#plugin-1235225511-root) | 从编码 Agent 执行轨迹提取与分发可复用 Skill，包含 DSH 轨迹和安装适配。 | 保留人工 Skill 流程；仅用合成样本评估数据范围、版本及清理路径。 |
| [ZeroToken Skill](#plugin-1222262862-root) | 提供面向 Agent 的简洁输出、渐进读取与平台适配规则。 | [Q04](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md#research-q04) 先比较宿主规则并检查脚本副作用；复杂或需完整证据时按 [Q03](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md#research-q03) 停止压缩。 |
| [喵缓存账单](#plugin-1343002927-root) | 在 DSH 上下文圆环弹层展示缓存命中、未命中与输出费用，以及逐步、每轮、会话合计和历史花费曲线。 | 单脱敏会话、已知provider固定实际价，先逐步手算，再观察曲线；不自动换窗或用参考价报销。 |
| [嵌入式工作台](#plugin-1276714299-root) | 为嵌入式 C/C++ 开发提供按需技能，并在 DSH 首个模型步注入计划核查提醒。 | [Q04](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q04)先在可回滚任务中手动加载匹配领域Skill，核对同版编译和复现结果，再决定是否启用提醒；格式齐全但无证据时停止使用其结论。 |
| [提示词与错误经验面板](#plugin-1418691015-root) | 在会话标题栏编辑全局和会话提示词，并审核模型自报错误的经验草稿。 | [Q04](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md#research-q04) 先只采用经核实的合成教训。 |
| [无限五代 IG5](#plugin-1335211378-root) | 集成 Reverse、Ghidra 静态分析和 x64dbg 无头调试，并提供 HTTP 流量采集与分析。 | [Q04](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q04) 从授权副本的少量函数名开始，事先保存两个数据库的可恢复副本。 |
| [模型接力](#plugin-1415863200-root) | 把候选队列包装成模型，提交前切换并按会话/模板隔离，另有全局自动继续；停止与终态需核。 | 观察：先修/验失败终态和关闭/等待语义，限定可回滚任务与候选，再对照正确产物、人工和全成本；发生越过停止/重复/账实不符即查未决后回退，见[Q06](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q06)。 |
| [飞书 DSH 机器人](#plugin-1333496313-root) | 将 DSH 接入飞书私聊、群聊和话题，支持任务状态、通知与审批交互。 | 先用假渠道、无写权限的测试工作区核对隔离、账本和批准条件。 |
| [鲸屿 Whale Isle](#plugin-1333141598-root) | 基于 DeepSeek Harness 的社区桌面客户端，整合对话、文件预览、终端与 Git。 | [Q04](../../plugins/chisaalter--whaleisle/INSIGHT.md#research-q04)熟悉DSH者用备份/副本工作区核home与退出重开，异常停更新回官方CLI/Web对账。 |
| [鲸鱼女仆 UI 根工程资源](#plugin-1334800188-root) | 提供鲸鱼主题项目的中英文安装/开发文档，以及委派子插件构建、测试和检查的根命令。 | 作为只读工程资源先定位子包/profile与发行证据，不把根装为主题。 |

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

<a id="plugin-1367597810-root"></a>

## [@99galaxy/dsh-plugin-market](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md)

[![npm 30d 1,771](https://img.shields.io/static/v1?label=npm+30d&message=1%2C771&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market)

> **用途**：DSH 用户需要发现、安装和更新社区插件。

> **亮点**：[Q01](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q01) 集中发现与版本展示，[Q02](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q02) 将选择的规格接到包管理器。

> **思考**：[Q03](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q03) 格式和跨站检查不证明包安全；忽略脚本重试也不证明宿主加载成功。

> **建议**：[Q05](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md#research-q05) 假设安装到加载的分层收据可降低错误启用；未验证。

[查看完整分析](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1335046216-packages-codegraph"></a>

## [@hyzyn/dsh-codegraph](../../plugins/hyzyn--dsh-plugin-kit--packages-codegraph/INSIGHT.md)

[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 4,860](https://img.shields.io/static/v1?label=npm+30d&message=4%2C860&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-codegraph) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-codegraph)

> **用途**：已使用 Codegraph 的开发者可在 DSH 内查符号和调用关系，尤其关注多项目同时工作时的工具归属。合格结果是结果来自当前索引根、无索引会话不借用别项目工具，见 [Q01](../../plugins/hyzyn--dsh-plugin-kit--packages-codegraph/INSIGHT.md#research-q01)。

> **亮点**：主要增量是将项目归属纳入MCP挂载生命周期：有索引的Agent使用自己的索引根，异步挂载通过在途集合与世代号处理重复和撤销。GUI降低逐次组织CLI参数的操作分散，但未证明更快更准；作用域实际效果仍依赖宿主，见 [Q01](../../plugins/hyzyn--dsh-plugin-kit--packages-codegraph/INSIGHT.md#research-q01)和[Q02](../../plugins/hyzyn--dsh-plugin-kit--packages-codegraph/INSIGHT.md#research-q02)。

> **思考**：用户想要的per-agent模式可能因缺少事件面或手工全局行而退回managed；因此不能把默认开关当成跨项目隔离保证。配置写入也只是有限重读，冲突达到上限继续覆盖，非严格CAS，见 [Q03](../../plugins/hyzyn--dsh-plugin-kit--packages-codegraph/INSIGHT.md#research-q03)。

> **建议**：未验证方向是按索引根复用MCP连接，同时把项目身份绑定在工具视图与每次查询上；它试图减少每Agent进程负担，又不能牺牲隔离。所有权、释放、失效及可推翻对照见 [Q06](../../plugins/hyzyn--dsh-plugin-kit--packages-codegraph/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/hyzyn--dsh-plugin-kit--packages-codegraph/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335046216-packages-tty"></a>

## [@hyzyn/dsh-tty](../../plugins/hyzyn--dsh-plugin-kit--packages-tty/INSIGHT.md)

[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 5,213](https://img.shields.io/static/v1?label=npm+30d&message=5%2C213&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-tty) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-tty)

> **用途**：需要同一长驻服务、TUI或SSH现场的人Agent交接，可用共享可见终端减少上下文搬运；合格交付要交代命令完成与仍活进程责任，见[Q01](../../plugins/hyzyn--dsh-plugin-kit--packages-tty/INSIGHT.md#research-q01)。

> **亮点**：已有贡献是将可见PTY现场与Agent工具、命令边界及取消/超时状态连接，减少抓屏猜测并保留人工接管；没有证明净协作收益或比外部终端更安全，见[Q01](../../plugins/hyzyn--dsh-plugin-kit--packages-tty/INSIGHT.md#research-q01)和[Q02](../../plugins/hyzyn--dsh-plugin-kit--packages-tty/INSIGHT.md#research-q02)。

> **思考**：Agent档位闸依宿主服务且不覆盖Web终端，ProxyCommand授权也只管该入口；取消等待后命令仍活且Agent会话不走孤儿回收，需要明确收尾责任，见[Q03](../../plugins/hyzyn--dsh-plugin-kit--packages-tty/INSIGHT.md#research-q03)和[Q04](../../plugins/hyzyn--dsh-plugin-kit--packages-tty/INSIGHT.md#research-q04)。

> **建议**：未验证方向是为长命令记录创建主体、接管与可撤销租约，将取消后的待收尾状态显式交付；须比较残留减少与误杀/维护负担，不自动取消就杀进程，见[Q08](../../plugins/hyzyn--dsh-plugin-kit--packages-tty/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/hyzyn--dsh-plugin-kit--packages-tty/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1324229194-dsh-autocompact"></a>

## [@indexyz/dsh-autocompact](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 1,782](https://img.shields.io/static/v1?label=npm+30d&message=1%2C782&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)

> **用途**：需要控制长会话上下文压力的 DSH 用户可按模型和会话试设提前压缩阈值，见 [Q01](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q01) 与 [Q02](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q02) 显示该组件将会话和精确模型路由的绝对阈值接到现有压缩后端，同时检查表面节点及工具配对；它不是新的摘要引擎。

> **思考**：[Q03](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q03) 的状态行不包含会话覆盖，且 [Q02](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q02) 的阈值只能触发尝试，不能保证压缩实际发生或将请求严格限制在阈值内。

> **建议**：[Q05](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q05) 假设将当前 Session 的有效阈值来源与压缩结果投影到状态行，可减少误判；尚未实现和验证。

[查看完整分析](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1174622182-packages-dsh"></a>

## [@mstar-harness/dsh](../../plugins/btspoony--mstar-harness--packages-dsh/INSIGHT.md)

[![GitHub ★ 68](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=68&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/btspoony/mstar-harness) [![npm 30d 4,104](https://img.shields.io/static/v1?label=npm+30d&message=4%2C104&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mstar-harness/dsh) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mstar-harness/dsh)

> **用途**：已有 Morning Star 约定的团队可在 DSH 内观察调度和工作流状态，见 [Q01](../../plugins/btspoony--mstar-harness--packages-dsh/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/btspoony--mstar-harness--packages-dsh/INSIGHT.md#research-q01) 和 [Q02](../../plugins/btspoony--mstar-harness--packages-dsh/INSIGHT.md#research-q02) 将工作流约定接到 DSH 事件与部分拒绝通道，同时提供面板和原生命令；引擎本身与宿主权限不归此组件独立实现。

> **思考**：[Q02](../../plugins/btspoony--mstar-harness--packages-dsh/INSIGHT.md#research-q02) hard 调度异常仍可能退化放行，文件意图对待写正文不可见；[Q03](../../plugins/btspoony--mstar-harness--packages-dsh/INSIGHT.md#research-q03) 共享 MCP 显式信任调用者提供的会话身份，不能据此声称所有入口均受控。

> **建议**：[Q05](../../plugins/btspoony--mstar-harness--packages-dsh/INSIGHT.md#research-q05) 假设展示实际门禁覆盖、模式和 degraded 状态可减少操作者误信；尚未实现或验证。

[查看完整分析](../../plugins/btspoony--mstar-harness--packages-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1197335472-integrations-dsh"></a>

## [@opencues/dsh](../../plugins/opencues--opencues--integrations-dsh/INSIGHT.md)

[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/opencues/opencues) [![npm 30d 822](https://img.shields.io/static/v1?label=npm+30d&message=822&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencues/dsh) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencues/dsh)

> **用途**：[Q01](../../plugins/opencues--opencues--integrations-dsh/INSIGHT.md#research-q01) 面向希望在 DSH 输入框获得文本建议和补全的用户。

> **亮点**：[Q01](../../plugins/opencues--opencues--integrations-dsh/INSIGHT.md#research-q01) 与 [Q02](../../plugins/opencues--opencues--integrations-dsh/INSIGHT.md#research-q02) 把共享 OpenCues runtime 与宿主编辑器和模型接线。

> **思考**：[Q03](../../plugins/opencues--opencues--integrations-dsh/INSIGHT.md#research-q03) 草稿可能在正式发送前交给模型；密钥代理和外层鉴权不能仅凭静态接线视作安全保证。

> **建议**：[Q05](../../plugins/opencues--opencues--integrations-dsh/INSIGHT.md#research-q05) 假设显示模型调用状态可改善用户理解，尚未验证。

[查看完整分析](../../plugins/opencues--opencues--integrations-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1227673478-packages-dsh-kanalyzer"></a>

## [@pbfuzz/dsh-kanalyzer](../../plugins/sgzeng--pbfuzz--packages-dsh-kanalyzer/INSIGHT.md)

[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sgzeng/pbfuzz) [![npm 30d 436](https://img.shields.io/static/v1?label=npm+30d&message=436&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@pbfuzz/dsh-kanalyzer) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@pbfuzz/dsh-kanalyzer)

> **用途**：为 C/C++ 目标位置核对候选调用关系与静态距离。

> **亮点**：把 bitcode、后台进度、静态距离和源位置组织成可复用服务，让调用者追查分析线索。[Q01](../../plugins/sgzeng--pbfuzz--packages-dsh-kanalyzer/INSIGHT.md#research-q01) [Q02](../../plugins/sgzeng--pbfuzz--packages-dsh-kanalyzer/INSIGHT.md#research-q02)

> **思考**：默认副本不约束 shell 的所有副作用，缺距离也不构成不可达证明。[Q03](../../plugins/sgzeng--pbfuzz--packages-dsh-kanalyzer/INSIGHT.md#research-q03)

> **建议**：用静态结果排序动态探针，比较命中与漏检；在相同已知夹具上检验。尚未验证。[Q04](../../plugins/sgzeng--pbfuzz--packages-dsh-kanalyzer/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/sgzeng--pbfuzz--packages-dsh-kanalyzer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1227673478-packages-dsh-pbfuzz"></a>

## [@pbfuzz/dsh-pbfuzz](../../plugins/sgzeng--pbfuzz--packages-dsh-pbfuzz/INSIGHT.md)

[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sgzeng/pbfuzz) [![npm 30d 471](https://img.shields.io/static/v1?label=npm+30d&message=471&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@pbfuzz/dsh-pbfuzz) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@pbfuzz/dsh-pbfuzz)

> **用途**：在授权项目中从目标行或缺陷线索寻找可独立复核的本地触发输入。

> **亮点**：把计划、执行、停止和触发输入绑定到同一 campaign 及轮次，减少使用旧指标或错报输入的机会。[Q01](../../plugins/sgzeng--pbfuzz--packages-dsh-pbfuzz/INSIGHT.md#research-q01) [Q02](../../plugins/sgzeng--pbfuzz--packages-dsh-pbfuzz/INSIGHT.md#research-q02)

> **思考**：草稿确认前已经可能编译和运行，模式式保护也不能隔离任意目标代码。成功状态与独立重现仍需区分。[Q02](../../plugins/sgzeng--pbfuzz--packages-dsh-pbfuzz/INSIGHT.md#research-q02) [Q03](../../plugins/sgzeng--pbfuzz--packages-dsh-pbfuzz/INSIGHT.md#research-q03)

> **建议**：独立核查回放是否提升证据可靠性，对照误报、漏报和额外耗时。尚未验证。[Q04](../../plugins/sgzeng--pbfuzz--packages-dsh-pbfuzz/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/sgzeng--pbfuzz--packages-dsh-pbfuzz/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336021761-root"></a>

## [7d-code-reviewer](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer)

> **用途**：团队希望用统一结构辅助审阅代码改动和整理可读报告。

> **亮点**：封装五步审查、严重度/四维评分和报告样式，使输出结构一致。详见[Q01](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md#research-q01)。

> **思考**：没有确定性报告渲染器，动态 HTML 转义/占位符完整性只是 Skill 文本要求；评分无校准。详见[Q02](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md#research-q02)。

> **建议**：加入安全模板渲染与残留占位检查，并用已标注缺陷集校准严重度/分数，可提高可复核性；待验证。详见[Q02](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md#research-q02)、[Q03](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/7dgroup-ai--dsh-skill-7d-code-reviewer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1225840521-root"></a>

## [Aegis](../../plugins/ganyuanran--aegis/INSIGHT.md)

[![GitHub ★ 1,416](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C416&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GanyuanRan/Aegis)

> **用途**：使用 AI 编码助手处理有不同风险等级任务的开发团队。

> **亮点**：[Q01](../../plugins/ganyuanran--aegis/INSIGHT.md#research-q01) 将多方法集中并接到宿主发现机制；效果仍需对照。

> **思考**：[Q02](../../plugins/ganyuanran--aegis/INSIGHT.md#research-q02) 提示在首次 promotion 后才投递，不能保证第一次写工具前已约束。

> **建议**：[Q04](../../plugins/ganyuanran--aegis/INSIGHT.md#research-q04) 假设经宿主确定性拦截首个写动作能减少漏路由，尚未验证。

[查看完整分析](../../plugins/ganyuanran--aegis/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334939514-root"></a>

## [Agency Agents](../../plugins/michengai--dsh-agency-agents/INSIGHT.md)

[![GitHub ★ 240](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=240&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-agency-agents) [![npm 30d 72,802](https://img.shields.io/static/v1?label=npm+30d&message=72%2C802&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-agency-agents) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)

> **用途**：开发者需要将评审分成互补职责，并在主会话核对最终结论。

> **亮点**：[Q01](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q01) 提供固定团队职责、缺席状态和两种宿主执行接入。[Q02](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q02) 原生分派将角色与任务 ID 衔接。

> **思考**：[Q02](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q02) 启动、任务板、实际结果与取消分别核验，递归守卫只限制部分工具。

> **建议**：[Q03](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q03) 对照已有 taskId 及成员消息，尝试显示从启动到实际验收的同一条任务进展。尚未验证。

[查看完整分析](../../plugins/michengai--dsh-agency-agents/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1230123793-root"></a>

## [Agent Handoff Skill](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md)

[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WeirdSky924/agent-handoff-skill)

> **用途**：同一项目由不同会话接力时，维护者可以保存目标、验证和下一步供新会话查阅。

> **亮点**：用仓库可查的入口和分文件记录承接会话，容量治理按字节执行，减少对模型随意决定截断的依赖。见 [Q01](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md#research-q01)、[Q02](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md#research-q02)。

> **思考**：脚本理解文件形状和大小，事实正确性仍要回读仓库，权限和钩子还有独立开关。见 [Q02](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md#research-q02)、[Q03](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md#research-q03)。

> **建议**：在交接次数和事实清单一致时，比较多布局与人工单页的错误恢复和总人时。见 [Q04](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336524975-root"></a>

## [Agent Team](../../plugins/limuyang2--agent-team/INSIGHT.md)

[![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/limuyang2/agent-team) [![npm 30d 2,165](https://img.shields.io/static/v1?label=npm+30d&message=2%2C165&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@limuyang2/dsh-agent-team) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@limuyang2/dsh-agent-team)

> **用途**：@limuyang2/dsh-agent-team0.1.4是MIT的DSH原生host+Web插件；成员为独立root Agent会话、共用工作区，不是它自己实现新模型runtime或子Agent树。用户可为Leader/执行/复核角色选不同provider/model/preset/权限/Skills/MCP，并通过任务/消息显式协作。适合确有可拆分任务、能审合并产物和多模型费用的开发者；成功是任务负责人清楚、交接可核且产物通过独立验收。

> **亮点**：[Q02](../../plugins/limuyang2--agent-team/INSIGHT.md#research-q02)独立配置/owned会话到真实Host执行入口；[Q03](../../plugins/limuyang2--agent-team/INSIGHT.md#research-q03)Leader/owner真实权限与任务/通知交接；[Q04](../../plugins/limuyang2--agent-team/INSIGHT.md#research-q04)有范围的持久恢复/停止。

> **思考**：[Q03](../../plugins/limuyang2--agent-team/INSIGHT.md#research-q03)completed不等验收、fileScopes仅文本/共workspace；[Q04](../../plugins/limuyang2--agent-team/INSIGHT.md#research-q04)spliced去重非完整inbox幂等，跨表/Host非事务，Web外围认证/当前Host兼容未验。

> **建议**：[Q05](../../plugins/limuyang2--agent-team/INSIGHT.md#research-q05)在已有owner/outbox上分开完成与独立验收收据/成本责任，对比人工签收小修，不计当前贡献。

[查看完整分析](../../plugins/limuyang2--agent-team/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 915](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=915&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vostride/agent-qa)

> **用途**：开发与 QA 团队可用自然语言旅程补充探索回归，并回看逐步失败证据。

> **亮点**：[Q01](../../plugins/vostride--agent-qa/INSIGHT.md#research-q01)、[Q02](../../plugins/vostride--agent-qa/INSIGHT.md#research-q02) 将planner的完成声明拆成带引用的条件，再由runner计算通过，比仅接受执行模型自报更可追查；这不等于独立业务状态已被验证。

> **思考**：[Q02](../../plugins/vostride--agent-qa/INSIGHT.md#research-q02) 条件文字覆盖与引用命中仍不能证明屏幕之外的业务语义。README的两组基准关闭记忆和自改进，不能支持这两项收益；恢复checkpoint也不能证明外部动作幂等。

> **建议**：[Q04](../../plugins/vostride--agent-qa/INSIGHT.md#research-q04) 在现有视觉、持久化和文件guard之外，针对少量后台关键条件绑定同次运行的独立只读查询，比较植入故障下的假通过与维护成本。该限定假设未验证，也不声称全仓缺少oracle。

[查看完整分析](../../plugins/vostride--agent-qa/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1442340074-root"></a>

## [AgentCompare](../../plugins/lijiaqi-ai-product-manager--dsh-agent-compare/INSIGHT.md)

[![GitHub ★ 298](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=298&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare) [![npm 30d 8,822](https://img.shields.io/static/v1?label=npm+30d&message=8%2C822&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-compare) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-compare)

> **用途**：反复比较界面或方案并希望保留选择与验收记录的人，可从同一 DSH 对话发起候选。

> **亮点**：将独立生成、可比较结果、选择理由和采用接进同一对话，用户可先试候选再决定是否写回。[Q01](../../plugins/lijiaqi-ai-product-manager--dsh-agent-compare/INSIGHT.md#research-q01) [Q03](../../plugins/lijiaqi-ai-product-manager--dsh-agent-compare/INSIGHT.md#research-q03)

> **思考**：候选目录和 host 策略不是完整隔离保证，目标漂移与外部副作用仍需核验；有限候选的盲选也不能归因模型质量。[Q01](../../plugins/lijiaqi-ai-product-manager--dsh-agent-compare/INSIGHT.md#research-q01) [Q02](../../plugins/lijiaqi-ai-product-manager--dsh-agent-compare/INSIGHT.md#research-q02) [Q03](../../plugins/lijiaqi-ai-product-manager--dsh-agent-compare/INSIGHT.md#research-q03)

> **建议**：先两版再依验收是否需要扩展到四版，可测是否降低每个合格结果的模型和人工支出。若候选质量下降或总等待不减，则停止自动扩展策略。[Q04](../../plugins/lijiaqi-ai-product-manager--dsh-agent-compare/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/lijiaqi-ai-product-manager--dsh-agent-compare/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1296792947-root"></a>

## [AgentDebugX](../../plugins/agentdebugx--agentdebugx/INSIGHT.md)

[![GitHub ★ 73](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=73&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AgentDebugX/AgentDebugX)

> **用途**：已有Agent失败日志的开发者要定位症状并准备恢复。

> **亮点**：[Q01](../../plugins/agentdebugx--agentdebugx/INSIGHT.md#research-q01) [Q01](../../plugins/agentdebugx--agentdebugx/INSIGHT.md#research-q01) 统一事件、定位finding和恢复交接，根Python工具独立于DSH桥。

> **思考**：[Q03](../../plugins/agentdebugx--agentdebugx/INSIGHT.md#research-q03) [Q03](../../plugins/agentdebugx--agentdebugx/INSIGHT.md#research-q03) 批准只是元数据、proxy不是任务效果；runner是信任边界。

> **建议**：[Q05](../../plugins/agentdebugx--agentdebugx/INSIGHT.md#research-q05) [Q05](../../plugins/agentdebugx--agentdebugx/INSIGHT.md#research-q05) 可检验诊断辅助是否减少定位负担，当前没有收益数据。

[查看完整分析](../../plugins/agentdebugx--agentdebugx/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1190390511-root"></a>

## [AgentRQ](../../plugins/agentrq--agentrq/INSIGHT.md)

[![GitHub ★ 1,175](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C175&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentrq/agentrq)

> **用途**：需要协调多个 Agent 与人类的团队；基线是聊天与普通任务看板。[Q01](../../plugins/agentrq--agentrq/INSIGHT.md#research-q01)

> **亮点**：将任务状态与 Agent 消息及权限请求接入共享工作区。[Q01](../../plugins/agentrq--agentrq/INSIGHT.md#research-q01) [Q02](../../plugins/agentrq--agentrq/INSIGHT.md#research-q02)

> **思考**：任务 done 是状态事件，不证明产物和测试已验收；工作区及机器权限需实际验证。[Q03](../../plugins/agentrq--agentrq/INSIGHT.md#research-q03)

> **建议**：未验证假设：为完成状态附可核对产物与验收记录可降低误完结；须对照现有流程。[Q05](../../plugins/agentrq--agentrq/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/agentrq--agentrq/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1401618027-root"></a>

## [AI Look-Up](../../plugins/1344738825--ai-look-up/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1344738825/ai-look-up)

> **用途**：长编码任务中需要发现重复失败或无产出的用户；基线是人工观察工具日志。[Q01](../../plugins/1344738825--ai-look-up/INSIGHT.md#research-q01)

> **亮点**：将节奏检测、目标漂移审查和提醒接入宿主事件。[Q01](../../plugins/1344738825--ai-look-up/INSIGHT.md#research-q01) [Q02](../../plugins/1344738825--ai-look-up/INSIGHT.md#research-q02)

> **思考**：关闭 llmReview 不等于关闭 driftCheck；审查材料包含目标和工具摘要，需核对数据与费用。[Q03](../../plugins/1344738825--ai-look-up/INSIGHT.md#research-q03)

> **建议**：未验证假设：将 watcher 已有场景/时效/步数校验用于直接异步审查，可减少旧结论误导。[Q05](../../plugins/1344738825--ai-look-up/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/1344738825--ai-look-up/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1406611614-root"></a>

## [AI 残渣清运](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md)



> **用途**：面向代理频繁生成探测脚本、备份、日志和缓存的项目，在不直接删除文件的前提下恢复整洁并保留结项清单。 [Q01](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md#research-q01)

> **亮点**：相对 `find` 加删除脚本，它把自动清理改成可逆移动，并用 open/close 项目状态保护进行中的产出、在结项时分类归档和改写引用。 [Q03](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md#research-q03)

> **思考**：规则匹配仍可能把有价值但命名像临时文件的材料移走，后台 detached 进程也无法让当前回合确认最终结果；可恢复降低损失但没有消除误分类。 [Q04](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md#research-q04)

> **建议**：可加入“来源感知清理”，要求候选文件同时满足命名规则和本回合创建记录，再用清单预览训练项目级白名单，降低误收。 [Q08](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1321408361-root"></a>

## [All in Luna](../../plugins/zenx0x--allinluna/INSIGHT.md)

[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zenx0x/allinluna)

> **用途**：跨前后端、迁移、测试等大目标的维护者，需要独立任务上下文、依赖交接与可复核验收，减少单会话全日志的协调负担。[Q01](../../plugins/zenx0x--allinluna/INSIGHT.md#research-q01)

> **亮点**：将任务依赖、资源/ownership调度、意图/回执和done_when的独立验证组织为持久编排事实，避免只凭模型叙述合并结果。此结构可解释跨会话交接，但实际净效率尚无同任务证据。[Q01](../../plugins/zenx0x--allinluna/INSIGHT.md#research-q01) [Q03](../../plugins/zenx0x--allinluna/INSIGHT.md#research-q03) [Q04](../../plugins/zenx0x--allinluna/INSIGHT.md#research-q04)

> **思考**：当前DSH next_actions调用只读preview别名，缺relay所需完整字段，声明路径不闭合；relay又先物理创建child后入库回执，失败重试不由后置去重保证唯一创建。上下文和ownership不是安全隔离，receipt/hash不是业务验收。[Q02](../../plugins/zenx0x--allinluna/INSIGHT.md#research-q02) [Q03](../../plugins/zenx0x--allinluna/INSIGHT.md#research-q03)

> **建议**：可研究消费持久动作、创建前认领和创建后对账的DSH派发协议，中间失败保留unknown/reconcile；先核对provider幂等/查询能力，再在三个崩溃点重放检验实际child数与恢复成本，不以数据库去重替代外部效果保证。[Q05](../../plugins/zenx0x--allinluna/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/zenx0x--allinluna/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1302597978-deploy-plugins-dist-dsh"></a>

## [ANet DSH Bundle](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ANetResearch/ANet)

> **用途**：为已有跨节点委派需求的操作者，把同一 anet 路径/身份接入 DSH 的 MCP 和 Skill。见[Q01](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q01)。

> **亮点**：显式路径/identity与运行时指南减少MCP/CLI分叉，安装锁/日志改善并发诊断，不证明节点协议/付费安全。见[Q02](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q02)、[Q03](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q03)。

> **思考**：固定bundle不固定HTTPS动态installer/binary/guide，提示不等入站/支付控制，900秒等安装不取消后台。见[Q03](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q03)。

> **建议**：未验证方向为任务绑定binary/guide/identity/政策收据，已有resolve诊断之上新增版本失效和结果关联，用版本×政策对照否定。见[Q05](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1195794651-root"></a>

## [API Relay Audit](../../plugins/toby-bridges--api-relay-audit/INSIGHT.md)

[![GitHub ★ 902](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=902&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/toby-bridges/api-relay-audit) [![npm 30d 513](https://img.shields.io/static/v1?label=npm+30d&message=513&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-relay-audit) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-relay-audit)

> **用途**：使用第三方 AI 中转前需要了解其请求和响应行为。

> **亮点**：[Q01](../../plugins/toby-bridges--api-relay-audit/INSIGHT.md#research-q01) 集中可重复的中转行为探测与报告，[Q02](../../plugins/toby-bridges--api-relay-audit/INSIGHT.md#research-q02) 提供 DSH 凭据和命令接入。

> **思考**：[Q03](../../plugins/toby-bridges--api-relay-audit/INSIGHT.md#research-q03) curl -k 不验证 TLS 证书；报告与诊断脱敏范围不同，[Q01](../../plugins/toby-bridges--api-relay-audit/INSIGHT.md#research-q01) 信号不等于安全证明。

> **建议**：[Q05](../../plugins/toby-bridges--api-relay-audit/INSIGHT.md#research-q05) 假设按结论显示覆盖和可回溯证据帮助人工复核；未验证。

[查看完整分析](../../plugins/toby-bridges--api-relay-audit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1211139949-root"></a>

## [Archify](../../plugins/tt-a1i--archify/INSIGHT.md)

[![GitHub ★ 94,540](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94%2C540&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify)

> **用途**：需要向接手人解释跨组件请求链的开发者，可以制作带固定来源的交互页面，供接手人独立探索和核对。[Q01](../../plugins/tt-a1i--archify/INSIGHT.md#research-q01)

> **亮点**：[Q02](../../plugins/tt-a1i--archify/INSIGHT.md#research-q02) 的增量是把候选、产物和机器回执用路径与字节身份串起来，让交接者区分未能渲染、成功写入和浏览器检查通过。加上 [Q03](../../plugins/tt-a1i--archify/INSIGHT.md#research-q03) 的固定 Git 引用，复杂请求链可用一份交互 HTML 浏览，出错时也能追到具体关卡。

> **思考**：[Q03](../../plugins/tt-a1i--archify/INSIGHT.md#research-q03) 中的来源校验可以拒绝错路径和越界行，但一段真实源码也可能与连线无关。浏览器阶段检查页面容纳、主题和可读性等信号，关键调用的归属和实际读图仍需核对。

> **建议**：[Q06](../../plugins/tt-a1i--archify/INSIGHT.md#research-q06) 从节点承载来源的约束出发，提出只为关键 I/O 关系提供可勾选的证据清单。若能减少错认执行者且维持审阅预算，才有理由增加这项维护工作。

[查看完整分析](../../plugins/tt-a1i--archify/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1211139949-integrations-deepseek-harness"></a>

## [Archify DSH](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md)

[![GitHub ★ 94,540](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94%2C540&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify) [![npm 30d 45,115](https://img.shields.io/static/v1?label=npm+30d&message=45%2C115&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)

> **用途**：已有 DSH CLI 的开发者可把 Archify 纳入 profile 管理，再从工作区交付图表。[Q01](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q01)

> **亮点**：[Q02](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q02) 将固定 Skill 通过已有提供器接入 profile。[Q04](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q04) 把适配器、内置 Skill 与接受宿主分开，给版本排查和退出提供可核对的对象。

> **思考**：[Q03](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q03) 显示保留默认根也保留同名覆盖。包安装或升级完成后，仍要回读生效路径和原有技能。

> **建议**：[Q06](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q06) 提议复用装载探针，给操作员显示有效 Skill 来源和包版本差异。收益要以根缺失和同名覆盖的诊断对照验证。

[查看完整分析](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1225585638-root"></a>

## [Aria](../../plugins/dqsjqian--aria/INSIGHT.md)

[![GitHub ★ 131](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=131&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dqsjqian/Aria)

> **用途**：希望共享 C++ 状态和 ViewModel 的跨平台 UI 开发者。

> **亮点**：[Q01](../../plugins/dqsjqian--aria/INSIGHT.md#research-q01) 和 [Q02](../../plugins/dqsjqian--aria/INSIGHT.md#research-q02) 组合 C++ 状态与适配器，Web SDK 给出类型边界；与 DSH 插件不同。

> **思考**：[Q03](../../plugins/dqsjqian--aria/INSIGHT.md#research-q03) 多端线程、网络鉴权和生命周期不能由局部客户端代码证明。

> **建议**：[Q05](../../plugins/dqsjqian--aria/INSIGHT.md#research-q05) 检查重连状态标记是否补充现有协议，并通过故障实验判断。

[查看完整分析](../../plugins/dqsjqian--aria/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1188682315-packages-baro-dsh"></a>

## [baro-dsh](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md)

[![GitHub ★ 126](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=126&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jigjoy-ai/baro) [![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/baro-dsh) [![最新发布 2026-09-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/baro-dsh)

> **用途**：[Q01](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md#research-q01) 面向需要委派跨文件编码目标的 DSH 用户。

> **亮点**：[Q01](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md#research-q01) 和 [Q02](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md#research-q02) 将外部 Baro 工作流连接到 DSH 模型工具、任务及 Web 状态。

> **思考**：[Q03](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md#research-q03) 的 completed 可能包含开放合约或缺失 done；调用者应读取原始 success 与产物。

> **建议**：[Q05](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md#research-q05) 假设展示独立终态字段可减少误读，尚未验证。

[查看完整分析](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1326893710-root"></a>

## [Better Sidebar](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md)

[![GitHub ★ 5,087](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C087&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/DSH-better-sidebar) [![npm 30d 314,654](https://img.shields.io/static/v1?label=npm+30d&message=314%2C654&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar)

> **用途**：在 DSH 中按会话定位文件、差异和任务的开发者，可在侧栏或底部工作台查看相关内容。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q01) 和 [Q03](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q03) 显示，插件把会话文件入口和外部页面、预览器挂在同一工作台。

> **思考**：[Q02](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q02) 显示，会话路径只定位文件，读写范围由宿主认证与运行账号权限约束。仅分开 profile 无法限制可访问文件。

> **建议**：[Q04](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q04) 可验证会话定位是否减少切换与误开文件。若同任务排查成本抵消省时，放弃这一假设。

[查看完整分析](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425087677-root"></a>

## [Better Workspace File Manager](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Arrosam/dsh-better-workspace-file-manager) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-workspace-file-manager)

> **用途**：需要在 DSH 修改小文件的开发者可评估工作区编辑器。

> **亮点**：[Q01](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md#research-q01) 将文件管理和版本保护放进 Web 预览。

> **思考**：[Q03](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md#research-q03) 路径和权限依赖宿主，显式冲突覆盖仍会写文件。

> **建议**：[Q05](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md#research-q05) 比较差异预览对误覆盖的影响。

[查看完整分析](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1324949198-root"></a>

## [Billion Context](../../plugins/ranxianglei--billion-context/INSIGHT.md)

[![GitHub ★ 6,779](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C779&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ranxianglei/billion-context) [![npm 30d 3,310,468](https://img.shields.io/static/v1?label=npm+30d&message=3%2C310%2C468&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)

> **用途**：适合用 DSH 维护长编码任务、经常要翻回早期接口决定或失败记录的开发者。可先试一段已结束的工作，确认回读的原文足以继续完成原验收，见 [Q01](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q01)。

> **亮点**：把 DSH 工具、代理会话、范围折叠及按块取回接入同一长任务，使模型能查询旧片段并继续用摘要组织当前上下文。范围与回读由代理内核提供，宿主接入负责归属和协调双重压缩，见 [Q01](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q01) 与 [Q02](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q02)。

> **思考**：用户能否分辨恢复的是原文还是摘要？两类内容可走同一输出形式。宿主写入本地压缩检查点后，归档块可能无法取回。工具返回和保存调度也有时间差，见 [Q03](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q03) 与 [Q04](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q04)。

> **建议**：可为回读标明来源和覆盖状态，验证模型是否更少把摘要当作原文。分别回放缓存完整、仅当前消息可用及两者都缺失的会话。若误引未下降或合格任务成本上升，停止推进，见 [Q06](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/ranxianglei--billion-context/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1192608669-root"></a>

## [Brooks Lint](../../plugins/hyhmrright--brooks-lint/INSIGHT.md)

[![GitHub ★ 1,558](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C558&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyhmrright/brooks-lint) [![npm 30d 1,110](https://img.shields.io/static/v1?label=npm+30d&message=1%2C110&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/brooks-lint) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/brooks-lint)

> **用途**：已有代码评审流程的开发者可以用它组织 diff 或项目审查，再逐项核对源码、影响和建议。

> **亮点**：[Q01](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q01) 和 [Q02](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q02) 显示项目把工程方法与四段诊断接入代理技能；[Q04](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q04) 另提供可消费报告的 CI 链路，但不保证问题真实。

> **思考**：[Q03](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q03) 的健康分取决于配置与模型发现，解析保真不能证明代码正确；[Q04](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q04) 中 CI 只看到选定 diff，还需检查传输边界。

> **建议**：[Q05](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q05) 提出为每项结论保留反例与适用例外的未验证设想；若盲测不降低误报或增加漏报及负担，就不采用。

[查看完整分析](../../plugins/hyhmrright--brooks-lint/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1349267272-root"></a>

## [CA 参考库](../../plugins/ansonfishing--dsh-ca-ref/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ansonfishing/dsh-ca-ref)

> **用途**：面向Clean Architecture/DDD审查者，检索参考断言、获取基线并记录目标项目证据。

> **亮点**：把参考检索、路径引用、基线和审查留账组织成可复用流程，减少散落材料查找的重复步骤。[Q03](../../plugins/ansonfishing--dsh-ca-ref/INSIGHT.md#research-q03) 不等于自动验证架构或提供普适标准答案。

> **思考**：索引读取当前工作树且重建把缺失与漂移仓都标ok，健康标记不代表内容完整；混合查询OR与AND过滤也可能越过语言边界。[Q04](../../plugins/ansonfishing--dsh-ca-ref/INSIGHT.md#research-q04)

> **建议**：未验证假设是为证据块绑定实际版本并记录适用条件、反例和复核质量，可避免把命中频率当规则正确性反馈。[Q07](../../plugins/ansonfishing--dsh-ca-ref/INSIGHT.md#research-q07)

[查看完整分析](../../plugins/ansonfishing--dsh-ca-ref/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1237259189-root"></a>

## [Caliper](../../plugins/edonadei--caliper/INSIGHT.md)

[![GitHub ★ 229](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=229&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/edonadei/caliper)

> **用途**：自有Skill维护者要在修改／模型更新／邻居竞争后判断触发和任务正确性。替代为单次手测；合格结果是逐attempt可追溯检查与环境一致的双臂实验，不是一次漂亮成功。

> **亮点**：[Q01](../../plugins/edonadei--caliper/INSIGHT.md#research-q01) 将Skill自然发现、重复任务和activation独立评分串联，[Q02](../../plugins/edonadei--caliper/INSIGHT.md#research-q02)保留infra／timeout／judge_error与环境漂移，使单次演示之外的回归可被定位。已有CLI执行和LLM判断是继承能力，不把README示例增益当普遍收益。

> **思考**：[Q02](../../plugins/edonadei--caliper/INSIGHT.md#research-q02) Rule B只聚合产出verdict的检查，assert过而expect故障也可PASS，compare按任务名而非语义完全一致配对。[Q03](../../plugins/edonadei--caliper/INSIGHT.md#research-q03)默认用户工具和危险绕过审批选项使fresh attempt不能当隔离；正式结论须审缺判、可用分母和真实权限。

> **建议**：[Q04](../../plugins/edonadei--caliper/INSIGHT.md#research-q04) 推导补充“全检查都有verdict”的并列口径与任务语义摘要，可能减少缺判／漂移假增益。用同名换断言、judge故障、环境变化和真改进四组盲测；错误归因不降或误阻断增即否定，尚未实现不计贡献。

[查看完整分析](../../plugins/edonadei--caliper/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1122873619-root"></a>

## [CC Safety Net](../../plugins/kenryu42--cc-safety-net/INSIGHT.md)

[![GitHub ★ 1,999](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C999&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenryu42/cc-safety-net) [![npm 30d 153,287](https://img.shields.io/static/v1?label=npm+30d&message=153%2C287&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net)

> **用途**：适合维护 DSH 开发工作区的人，在保留宿主审批的情况下增加可解释的工具规则。

> **亮点**：[Q01](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q01) 在宿主实际执行前给出规则决定。[Q02](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q02) 将命令、目录、策略和审计连接起来。

> **思考**：[Q03](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q03) 的未声明第三方工具未进入完整命令分析路径，后置提示无法撤回本次调用。目录也必须与实际执行环境吻合。

> **建议**：[Q04](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q04) 用只记调用次数的假工具核对规则覆盖、错误允许和误拦。若拒绝后仍调用或未声明工具被误当已覆盖，就不扩大使用。

[查看完整分析](../../plugins/kenryu42--cc-safety-net/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1281865940-root"></a>

## [Cetus](../../plugins/drewnekota--cetus/INSIGHT.md)

[![GitHub ★ 150](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=150&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/drewnekota/cetus)

> **用途**：希望在同一桌面入口处理多个 Agent CLI 会话的开发者。

> **亮点**：[Q01](../../plugins/drewnekota--cetus/INSIGHT.md#research-q01) 将 DSH 的 ACP 会话接到多运行时客户端。

> **思考**：[Q02](../../plugins/drewnekota--cetus/INSIGHT.md#research-q02) 启动准备会读环境和处理配置，实际边界需核查。

> **建议**：[Q04](../../plugins/drewnekota--cetus/INSIGHT.md#research-q04) 预览启动准备以减少状态误判。

[查看完整分析](../../plugins/drewnekota--cetus/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335287168-root"></a>

## [ChatGPT Subscription](../../plugins/songoao25--dsh-chatgpt-sub/INSIGHT.md)

[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/songoao25/dsh-chatgpt-sub) [![npm 30d 5,332](https://img.shields.io/static/v1?label=npm+30d&message=5%2C332&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chatgpt-sub) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chatgpt-sub)

> **用途**：已有 ChatGPT/Codex 账号的 DSH 用户，希望保留当前工作区完成多轮模型任务。[Q01](../../plugins/songoao25--dsh-chatgpt-sub/INSIGHT.md#research-q01)

> **亮点**：将账号授权、续期和宿主提供方配置放入 DSH 设置页，减少重复配置路径。上游授权和实际调用尚无该组件的验收。[Q01](../../plugins/songoao25--dsh-chatgpt-sub/INSIGHT.md#research-q01) [Q03](../../plugins/songoao25--dsh-chatgpt-sub/INSIGHT.md#research-q03)

> **思考**：绑定会改共享账号及宿主默认模型，撤销跨多项状态且可部分完成。登录成功不能建立上游允许或实际模型准入。[Q02](../../plugins/songoao25--dsh-chatgpt-sub/INSIGHT.md#research-q02) [Q03](../../plugins/songoao25--dsh-chatgpt-sub/INSIGHT.md#research-q03)

> **建议**：比较隔离凭据与分阶段状态的原型，观察同名冲突、误报与恢复动作。新增凭据副本不能安全回收时推翻。[Q05](../../plugins/songoao25--dsh-chatgpt-sub/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/songoao25--dsh-chatgpt-sub/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1426954291-root"></a>

## [CI Diet](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0disoft/dsh-ci-diet) [![npm 30d 1,248](https://img.shields.io/static/v1?label=npm+30d&message=1%2C248&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ci-diet) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ci-diet)

> **用途**：有重复CI负担的工作流维护者，在质量不退化的前提下寻找净资源收益；合格结果是同类合格构建的整体改善，非候选数或安装成功。见[Q01](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q01)。

> **亮点**：把候选覆盖、计划摘要、独立批准、备份字节和不明提交收敛串成工程流程，减少审阅材料分散；事后比较明确分开样本差值与因果/账单结论。贡献限于已接线机制，见[Q01](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q01)、[Q03](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q03)、[Q04](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q04)。

> **思考**：净收益不由规则命中或measure差值保证；预检可重试且故障放行，模型claims的human-cli标签不证明独立人工核实，读后rename也非OS级CAS。摘要/状态不能代替业务前提与质量验收。见[Q02](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q02)至[Q05](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q05)。

> **建议**：在已有成功/重跑指标上，把可比任务、全尝试资源、人工负担与停止规则绑定为采纳验收，检验能否减少“局部省时、整体更差”的误采纳；不是再把已有measure当新增功能。对照、推翻与回退条件见[Q05](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md#research-q05)，尚未执行。

[查看完整分析](../../plugins/0disoft--dsh-ci-diet/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-988892963-root"></a>

## [CloudBase AI Toolkit](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md)

[![GitHub ★ 1,153](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C153&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit)

> **用途**：面向需要在云开发工作流中操作 CloudBase 资源的开发者。

> **亮点**：[Q02](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md#research-q02) 将云资源工具与确认逻辑接入 MCP；不等于云资源本身创新或全部动作被保护。

> **思考**：[Q03](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md#research-q03) 客户端缺 form 能力或命中 skip 时 guard 不拦截，默认 auto-approve 策略为 allow；不能当作无条件确认。

> **建议**：[Q05](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md#research-q05) 建议无确认能力时返回未执行并提供显式确认路径，须测自动化兼容及用户既有授权。

[查看完整分析](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-988892963-dsh-plugin"></a>

## [CloudBase DSH Plugin](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md)

[![GitHub ★ 1,153](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C153&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cloudbase/dsh-plugin) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cloudbase/dsh-plugin)

> **用途**：需要在 DSH 管理 CloudBase 数据和部署的开发者；基线是聊天与云控制台切换。[Q01](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md#research-q01)

> **亮点**：把云工具及可视结果接入会话，而非实现云基础服务。[Q01](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md#research-q01)

> **思考**：超时不证明云侧无副作用，目标环境与宿主审批须实际验证。[Q03](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md#research-q03)

> **建议**：未验证假设：目标环境、幂等键与超时后状态查询可减少重复写入；须对照现有超时与审批。[Q05](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/tencentcloudbase--cloudbase-ai-toolkit--dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339297063-packages-clutch-dsh-worktree"></a>

## [Clutch DSH Worktree](../../plugins/cerbur--clutch-dsh--packages-clutch-dsh-worktree/INSIGHT.md)

[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Cerbur/clutch-dsh) [![npm 30d 3,329](https://img.shields.io/static/v1?label=npm+30d&message=3%2C329&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cerbur/clutch-dsh-worktree) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cerbur/clutch-dsh-worktree)

> **用途**：需要在同一个仓库并行修复和试验的 DSH 用户，想按工作树快速找到会话并从对应目录执行。

> **亮点**：[Q01](../../plugins/cerbur--clutch-dsh--packages-clutch-dsh-worktree/INSIGHT.md#research-q01) 把工作树和 DSH 会话纳入同一导航，并核查原生会话归属与 cwd 后保存绑定。相比手工切换目录，插件能从目标工作树直接进入会话。

> **思考**：[Q02](../../plugins/cerbur--clutch-dsh--packages-clutch-dsh-worktree/INSIGHT.md#research-q02) 派发只证明已入队。[Q03](../../plugins/cerbur--clutch-dsh--packages-clutch-dsh-worktree/INSIGHT.md#research-q03) 归档与磁盘清理有独立状态，删除前仍需人工确认任务已停。

> **建议**：[Q04](../../plugins/cerbur--clutch-dsh--packages-clutch-dsh-worktree/INSIGHT.md#research-q04) 将准入记录与原生 cwd、执行后的 HEAD 配对，或可减少并行任务的错分支交付。需要带超时和假阳性报告的对照。

[查看完整分析](../../plugins/cerbur--clutch-dsh--packages-clutch-dsh-worktree/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334020974-root"></a>

## [Cocode](../../plugins/cocode-agency--cocode/INSIGHT.md)

[![GitHub ★ 167](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=167&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cocode-agency/cocode)

> **用途**：需要在桌面和终端交替工作的开发者可评估共享宿主。

> **亮点**：[Q01](../../plugins/cocode-agency--cocode/INSIGHT.md#research-q01) GUI 和 TUI 使用同一范围的 Host。

> **思考**：[Q03](../../plugins/cocode-agency--cocode/INSIGHT.md#research-q03) 发行需配套，租约不证明任务已停止。

> **建议**：[Q05](../../plugins/cocode-agency--cocode/INSIGHT.md#research-q05) 测试更清楚的租约诊断。

[查看完整分析](../../plugins/cocode-agency--cocode/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1347752454-plugins-dsh-code-rag-index-panel"></a>

## [Code RAG 索引面板](../../plugins/ankali-aylina--code-rag--plugins-dsh-code-rag-index-panel/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ankali-Aylina/code-rag) [![npm 30d 711](https://img.shields.io/static/v1?label=npm+30d&message=711&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-code-rag-index-panel) [![最新发布 2026-08-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-code-rag-index-panel)

> **用途**：适合已运行code-rag的开发者在DSH会话中查看和维护当前根索引。

> **亮点**：把索引状态、进度、依赖诊断与手动动作放入编码现场，并分离选模式与资源触发。[Q03](../../plugins/ankali-aylina--code-rag--plugins-dsh-code-rag-index-panel/INSIGHT.md#research-q03) 贡献属于控制流程，不是新检索算法。

> **思考**：端口在线与诊断绿灯并不证明当前根和索引新鲜度；多实例选最新、集合404判不可达及setup执行脚本须明确。[Q04](../../plugins/ankali-aylina--code-rag--plugins-dsh-code-rag-index-panel/INSIGHT.md#research-q04)

> **建议**：未验证假设是以工作区和索引代次指纹标记过期检索，并允许明确选择刷新，可减少旧代码引用；需同时计等待和嵌入资源。[Q07](../../plugins/ankali-aylina--code-rag--plugins-dsh-code-rag-index-panel/INSIGHT.md#research-q07)

[查看完整分析](../../plugins/ankali-aylina--code-rag--plugins-dsh-code-rag-index-panel/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1269132133-root"></a>

## [Codex Switch](../../plugins/kuangre123--codex-switch/INSIGHT.md)

[![GitHub ★ 75](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=75&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kuangre123/codex-switch)

> **用途**：愿意备份配置和历史、核对第三方路由的本地Codex用户。

> **亮点**：[Q01](../../plugins/kuangre123--codex-switch/INSIGHT.md#research-q01) 双provider配置及可达GUI探测；[Q03](../../plugins/kuangre123--codex-switch/INSIGHT.md#research-q03) 本地协议转换。

> **思考**：[Q02](../../plugins/kuangre123--codex-switch/INSIGHT.md#research-q02) 正常GUI重启批量改历史provider/model，与README不符；[Q04](../../plugins/kuangre123--codex-switch/INSIGHT.md#research-q04) 卸载不停止持久服务。

> **建议**：[Q05](../../plugins/kuangre123--codex-switch/INSIGHT.md#research-q05) 保存前历史改动预览能否减少误路由需对照。

[查看完整分析](../../plugins/kuangre123--codex-switch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1311108439-root"></a>

## [Codex Taskboard](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md)

[![GitHub ★ 3,475](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C475&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chuspeeism/dashi-taskboard)

> **用途**：需要在开发者与 Codex 间反复交接 issue 的项目可以共用看板、任务评论、验收状态和 CLI。

> **亮点**：把读取当前要求、乐观版本认领和人类验收接入看板与 CLI 共用的记录，减少由代理另写一套交接说明的需要。[Q01](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q01) [Q02](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q02)

> **思考**：带版本写入防止陈旧覆盖，不能凭此判断操作者是否有权关闭任务。Skill 明确的认领与完成约定也不等同于所有 HTTP 客户端都遵守它。[Q02](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q02)

> **建议**：可把操作者和允许转换与版本校验一起放到提交路径，比较双认领、直接关闭及合法续接。若权限冲突不降或合法续接大量受阻，停止这个改法。[Q04](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1311108439-integrations-deepseek-harness"></a>

## [Codex Taskboard for DeepSeek Harness](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md)

[![GitHub ★ 3,475](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C475&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chuspeeism/dashi-taskboard)

> **用途**：已在同一台机器运行 Codex Taskboard 的 DSH Web 用户，可以在会话侧栏打开面板查看现有任务。

> **亮点**：[Q01](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q01) 把已有看板和启动器提供的动态地址接到 DSH Web 侧栏，用户可在会话中按需重新打开当前实例。

> **思考**：[Q02](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q02) 307 表示路由解析出了地址，仍可能指向过期或浏览器不可达的看板。[Q03](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q03) 外链消息在此子包缺少父端处理。

> **建议**：[Q04](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q04) 将描述符解析状态与嵌入就绪分开呈现，可能减少重复刷新和故障误判，需以同条件故障注入验证。

[查看完整分析](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340906871-root"></a>

## [codex-guard](../../plugins/akimiya-z--codex-guard/INSIGHT.md)

[![GitHub ★ 131](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=131&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Akimiya-z/codex-guard) [![npm 30d 169](https://img.shields.io/static/v1?label=npm+30d&message=169&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/codex-guard) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/codex-guard)

> **用途**：代理作者提交前需要发现 TODO、疑似密钥和提交标题问题。

> **亮点**：[Q01](../../plugins/akimiya-z--codex-guard/INSIGHT.md#research-q01) 把静态问题前移到代理可调用入口。

> **思考**：[Q02](../../plugins/akimiya-z--codex-guard/INSIGHT.md#research-q02) npx 版本未固定，扫描目录是进程 cwd，结果是文本。

> **建议**：[Q03](../../plugins/akimiya-z--codex-guard/INSIGHT.md#research-q03) 用同一差异验证本地预检能否减少首轮 CI 失败。

[查看完整分析](../../plugins/akimiya-z--codex-guard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1245329241-root"></a>

## [Coding Tools MCP](../../plugins/xytom--coding-tools-mcp/INSIGHT.md)

[![GitHub ★ 1,218](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C218&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xyTom/coding-tools-mcp)

> **用途**：需让 MCP 聊天客户端处理代码仓库的开发者；基线是现有编码 Agent 或手工 shell。[Q01](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q01)

> **亮点**：把文件、补丁和命令组织成可由多客户端调用的 MCP 工作区接口。[Q01](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q01) [Q02](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q02)

> **思考**：safe 不是完整跨平台 OS 沙箱；多路径回滚不是单个原子事务。[Q02](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q02) [Q03](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q03)

> **建议**：未验证假设：逐目标展示基线、提交与回滚状态可减少恢复时间；须对照现有事务流程。[Q05](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/xytom--coding-tools-mcp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1386538234-root"></a>

## [CodingNS for DeepSeek Harness](../../plugins/jingyi0605--codingns4dsh/INSIGHT.md)

[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jingyi0605/Codingns4DSH) [![npm 30d 3,661](https://img.shields.io/static/v1?label=npm+30d&message=3%2C661&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@jingyi0605/codingns4dsh) [![最新发布 2026-10-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@jingyi0605/codingns4dsh)

> **用途**：面向在同一 DSH Host 管理多个项目和外部编程 Agent 的开发者，统一会话入口和原生交互；本轮以外部 Agent 及模块生命周期为核查主线。

> **亮点**：可核查的贡献是把外部编程 Agent 的会话身份、流式事件、审批和提问接入 DSH 原生交互，并以模块注册表组织启动与释放。相对分散 CLI 提供集中交接，但不是创造上游模型能力，也未证明任务质量或耗时改善，见 [Q01](../../plugins/jingyi0605--codingns4dsh/INSIGHT.md#research-q01)、[Q02](../../plugins/jingyi0605--codingns4dsh/INSIGHT.md#research-q02)。

> **思考**：统一界面不能证明统一执行保证。模块释放报错时仍可先记为disabled，Codex中断请求异常也会被捕获；用户必须区分本地取消、上游确认与实际副作用，不能把停用标签当作所有进程已结束，见 [Q03](../../plugins/jingyi0605--codingns4dsh/INSIGHT.md#research-q03)。

> **建议**：未来可检验适配器交互契约，把审批回传、中断请求、上游终态与副作用未知分别呈现。对照两个异构驱动的批准、拒绝、取消、崩溃和停用样本，观察错误终态表述与恢复动作；未确认停止却声称无后续写入即否定相关保证。此方向尚未验证，见 [Q05](../../plugins/jingyi0605--codingns4dsh/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/jingyi0605--codingns4dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1359009818-root"></a>

## [Comi Pet](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md)

[![GitHub ★ 239](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=239&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/IvenKooLab/desktop-pet)

> **用途**：经常离开 DSH 界面的本地开发者可以用桌宠关注工具活动和审批等待。

> **亮点**：[Q01](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q01) 的本地事件桥让桌面可提示审批等待。[Q02](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q02) 的两阶段显示租约允许同一角色在窗口间交接，并在页面失联后恢复原生显示。

> **思考**：[Q01](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q01) 中的任务动画源自事件映射，不能用来验收目标结果。[Q03](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q03) 的聊天会将输入和历史交给 DSH 模型，需要独立核对 provider 与本机文件边界。

> **建议**：[Q05](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q05) 可对照现有失败提示，验证分原因反馈能否减少无效切换。若恢复时间没有改善或误导增加，即否定增量。

[查看完整分析](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1332210938-root"></a>

## [Context Doctor](../../plugins/zhenyu98--dsh-context-doctor/INSIGHT.md)

[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Zhenyu98/dsh-context-doctor)

> **用途**：面向需要定位DSH上下文膨胀来源的维护者，按指令、技能和工具/MCP给出估算与可定位回执；适用于诊断而非精确账单。

> **亮点**：它把上下文排查从总量变成文件/技能/工具条目的归因线索，并让工具与面板复用同一报告，回执明确标出trimmed不可观测。增量是可复查诊断，不是精确tokenizer或已验证降低成本，见 [Q01](../../plugins/zhenyu98--dsh-context-doctor/INSIGHT.md#research-q01)、[Q02](../../plugins/zhenyu98--dsh-context-doctor/INSIGHT.md#research-q02)。

> **思考**：扫描估算不等于实际请求。工具参数未计token、读取失败会跳过、rank为来源启发式，重复未必可删；HTTP自身无鉴权或cwd授权规则，外层边界本轮未确认，不能把只读当作不披露信息，见 [Q03](../../plugins/zhenyu98--dsh-context-doctor/INSIGHT.md#research-q03)。

> **建议**：未来可将实际装配trace与同tokenizer结果并列，区分候选/注入/裁剪/不可观测，再用固定任务回归检验建议。实际token虽降但任务质量下降、或不可观测被当空，即否定安全优化主张；本轮未执行，见 [Q05](../../plugins/zhenyu98--dsh-context-doctor/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/zhenyu98--dsh-context-doctor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1327124384-root"></a>

## [cosyncing](../../plugins/cosyncing--cosyncing/INSIGHT.md)

[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cosyncing/cosyncing)

> **用途**：目标是已经在自己的工作机运行CLI编码Agent、希望离开终端后从桌面或手机查看同一会话并回答权限/问题的人。根项目是自托管broker、Flutter客户端与多Agent适配器组成的应用/桥接基础设施，不是装入DSH的插件bundle。package private工作区汇集broker/protocol/adapters，DSH经外部HTTP/WebSocket接入；根组件身份应为infrastructure。

> **亮点**：[Q01](../../plugins/cosyncing--cosyncing/INSIGHT.md#research-q01)、[Q02](../../plugins/cosyncing--cosyncing/INSIGHT.md#research-q02) 支持的增量是自托管多端broker统一会话入口，配对与撤销设备，并将DSH可写前台契约映射为共享transcript/审批/选择。generation、cookie和mutationRevision在await后重验，读/写失败语义分开，减少失权旧操作和副作用重试风险；未等同实际任务效率改善。

> **思考**：[Q03](../../plugins/cosyncing--cosyncing/INSIGHT.md#research-q03) DSH适配仍experimental且只有两个确切资格版本，不提供后台只读Observe；非图片文件是cosyncing限制，README归因Host不适用于0.2。命令单发不等于外部恰一次，模糊创建/取消仍需native对账；配对默认含drive/files，不能当低权限读卡器。

> **建议**：[Q05](../../plugins/cosyncing--cosyncing/INSIGHT.md#research-q05) 以native session/requestId显示动作回执和unknown状态卡，跨设备只读对账后由用户显式提交新动作；利用已有身份与generation而不建第二执行账本。以接受后丢响应/切设备/重启反证，若现有UI等价或关联不稳定则修正。未实现未验证。

[查看完整分析](../../plugins/cosyncing--cosyncing/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333152408-packages-create-dsh-plugin"></a>

## [create-dsh-plugin](../../plugins/whyihaveyou--dsh-suite--packages-create-dsh-plugin/INSIGHT.md)

[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite) [![npm 30d 350](https://img.shields.io/static/v1?label=npm+30d&message=350&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/create-dsh-plugin) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/create-dsh-plugin)

> **用途**：DSH插件开发者需要带接线示例的起始工程，见 [Q01](../../plugins/whyihaveyou--dsh-suite--packages-create-dsh-plugin/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/whyihaveyou--dsh-suite--packages-create-dsh-plugin/INSIGHT.md#research-q01) 把五类接线和生命周期示例、版本选择与社区命名声明集中到CLI，减少手抄遗漏；[Q04](../../plugins/whyihaveyou--dsh-suite--packages-create-dsh-plugin/INSIGHT.md#research-q04) verify是编译/配置检查，不能称行为验收。

> **思考**：[Q03](../../plugins/whyihaveyou--dsh-suite--packages-create-dsh-plugin/INSIGHT.md#research-q03) preset删除id未限目录、webui直接覆盖写文件且卡片显示创建，生成物必须人工修补；[Q04](../../plugins/whyihaveyou--dsh-suite--packages-create-dsh-plugin/INSIGHT.md#research-q04) 字符串dump-config检查不能证明工具/UI/清理已工作。

> **建议**：[Q05](../../plugins/whyihaveyou--dsh-suite--packages-create-dsh-plugin/INSIGHT.md#research-q05) 未验证的安全默认与分层行为契约：限定文件归属和边界、固定宿主版、逐模板实际调用和回放，以越界/旧文件/假配置反例否定。

[查看完整分析](../../plugins/whyihaveyou--dsh-suite--packages-create-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1399279897-root"></a>

## [Crossfire](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9931666/dsh-plugin-crossfire) [![npm 30d 1,021](https://img.shields.io/static/v1?label=npm+30d&message=1%2C021&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire)

> **用途**：需要在交付前审视方案缺陷的用户；基线是人工评审或单代理自查。[Q01](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q01)

> **亮点**：组织对抗观点并保留用户认定、驳回与理由。[Q01](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q01) [Q03](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q03)

> **思考**：模型观点不等于真实缺陷；新宿主仅传 persona，注释所称只读 preset 透传未在请求构造中发现。[Q02](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q02) [Q03](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q03)

> **建议**：未验证假设：由宿主提供可证明只读 preset，启动时明确选择并验证实际工具权限，无法证明时停止；当前注释提出 preset 但调用未传 agentPreset。[Q05](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1295322882-root"></a>

## [DeepSec](../../plugins/unclecheng-li--deepsec/INSIGHT.md)

[![GitHub ★ 498](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=498&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Unclecheng-li/DeepSec)

> **用途**：面向开发者的代码安全工具平台；本轮核查Shield本地审计主线，输出待人工复核的候选问题。

> **亮点**：[Q02](../../plugins/unclecheng-li--deepsec/INSIGHT.md#research-q02) 把规则、Python AST、本地启发式和可选LLM组织成可输出统一finding的流程，实际贡献是分层审阅接线。

> **思考**：[Q03](../../plugins/unclecheng-li--deepsec/INSIGHT.md#research-q03) 文件读取失败被跳过而filesScanned仍计候选，零发现不代表完整扫描；默认排除和远端选项还会改变覆盖及数据流。

> **建议**：[Q04](../../plugins/unclecheng-li--deepsec/INSIGHT.md#research-q04) 推导候选/已分析/跳过/失败覆盖回执的未验证改进；以混合失败样本测覆盖判断和误放行，不能降低误判则推翻。

[查看完整分析](../../plugins/unclecheng-li--deepsec/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334460196-root"></a>

## [DeepSeek Flow](../../plugins/kanghelyu--dsh-deepseek-flow/INSIGHT.md)

[![GitHub ★ 83](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=83&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kanghelyu/dsh-deepseek-flow) [![npm 30d 723](https://img.shields.io/static/v1?label=npm+30d&message=723&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-flow) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-flow)

> **用途**：用户维护有分支的可复用步骤。

> **亮点**：[Q01](../../plugins/kanghelyu--dsh-deepseek-flow/INSIGHT.md#research-q01) 把结构检视与可迁移步骤文档连到同一会话。

> **思考**：[Q03](../../plugins/kanghelyu--dsh-deepseek-flow/INSIGHT.md#research-q03) JSON原子不涵盖多文档，直接工具路径也非统一审核。

> **建议**：[Q05](../../plugins/kanghelyu--dsh-deepseek-flow/INSIGHT.md#research-q05) 可更快发现连接错误并保持文档可独立阅读。

[查看完整分析](../../plugins/kanghelyu--dsh-deepseek-flow/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333224461-root"></a>

## [DeepSeek Harness ACP](../../plugins/openma-ai--deepseek-harness-acp/INSIGHT.md)

[![GitHub ★ 61](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openma-ai/deepseek-harness-acp) [![npm 30d 8,391](https://img.shields.io/static/v1?label=npm+30d&message=8%2C391&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openma/deepseek-harness-acp) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openma/deepseek-harness-acp)

> **用途**：在 ACP 编辑器中直接使用 DSH 的 Agent 和工具，减少向独立客户端搬运任务。见 [Q01](../../plugins/openma-ai--deepseek-harness-acp/INSIGHT.md#research-q01)。

> **亮点**：实际增量是 DSH 会话及事件语义到 ACP 的双入口适配，含多根写范围与审批桥接；自主循环和模型能力继承宿主。见 [Q01](../../plugins/openma-ai--deepseek-harness-acp/INSIGHT.md#research-q01)、[Q03](../../plugins/openma-ai--deepseek-harness-acp/INSIGHT.md#research-q03)。

> **思考**：会话始终允许会关闭该会话后续审批，MCP 挂载却按进程共享并可同名替换；多会话不能直接当隔离域，取消不撤销副作用。见 [Q02](../../plugins/openma-ai--deepseek-harness-acp/INSIGHT.md#research-q02)。

> **建议**：给每会话提供有效宿主、模型、写根、审批和 MCP 指纹回执，验证能否减少环境误判；现有 UI 若已同等明确则推翻。见 [Q04](../../plugins/openma-ai--deepseek-harness-acp/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/openma-ai--deepseek-harness-acp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333781342-root"></a>

## [DeepSeek Harness CLI](../../plugins/peiyuwang54--deepseek-harness-cli/INSIGHT.md)

[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/peiyuwang54/deepseek-harness-cli)

> **用途**：开发者在项目目录通过终端反复提交读改代码任务；以工件和既有测试审查为合格结果，不以回合完成代替验收。[Q01](../../plugins/peiyuwang54--deepseek-harness-cli/INSIGHT.md#research-q01)

> **亮点**：以终端入口、profile组合、可脚本化exec和平台包启动组织一个Harness衍生客户端。相对自行搭建源码，平台解析和诊断入口提供可检查的分发/排障路径；相对官方宿主的独有贡献尚未充分归因。[Q01](../../plugins/peiyuwang54--deepseek-harness-cli/INSIGHT.md#research-q01) [Q04](../../plugins/peiyuwang54--deepseek-harness-cli/INSIGHT.md#research-q04)

> **思考**：采用关键不是功能数量，而是fork是否有足够独有收益抵偿整个宿主的制品、配置和权限迁移。resume不是外部操作回滚，exec退出只约束模型回合/结构输出；升级是逐文件替换，不能当原子回退。底层跨平台隔离与同版本制品均未验收。[Q02](../../plugins/peiyuwang54--deepseek-harness-cli/INSIGHT.md#research-q02) [Q03](../../plugins/peiyuwang54--deepseek-harness-cli/INSIGHT.md#research-q03) [Q04](../../plugins/peiyuwang54--deepseek-harness-cli/INSIGHT.md#research-q04)

> **建议**：比较平台shim加boot-free doctor是否相对固定官方发行物降低到首个合格任务的摩擦；先查官方是否已提供等效路径，再同OS/任务测安装成功、人工排障、权限与恢复，不牺牲业务验收。若只是包装或恢复变差则否定净收益，未执行不作已有贡献。[Q05](../../plugins/peiyuwang54--deepseek-harness-cli/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/peiyuwang54--deepseek-harness-cli/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333376987-root"></a>

## [DeepSeek Harness Desktop（xiincs）](../../plugins/xiincs--deepseek-harness-desktop/INSIGHT.md)

[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiincs/deepseek-harness-desktop)

> **用途**：本地DSH用户可把启动、文件、终端和市场放到桌面壳中，核心模型与会话仍来自上游服务。[Q01](../../plugins/xiincs--deepseek-harness-desktop/INSIGHT.md#research-q01)

> **亮点**：把DSH服务运行、文件和终端操作统一到桌面生命周期，安装区分启动与完成状态；这些是桌面适配的增量，不归因于上游模型能力。[Q01](../../plugins/xiincs--deepseek-harness-desktop/INSIGHT.md#research-q01)

> **思考**：自动恢复可能移除缺失插件，文件保存直接覆盖而无版本比较；便利同时带来profile和文件状态所有权，必须核对恢复副作用。[Q03](../../plugins/xiincs--deepseek-harness-desktop/INSIGHT.md#research-q03)

> **建议**：恢复变更预览和带版本保存可能减少无意移除/覆盖，需同故障轨迹比较损失、时间与操作负担；目前未实现或验证。[Q04](../../plugins/xiincs--deepseek-harness-desktop/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/xiincs--deepseek-harness-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333486649-root"></a>

## [DeepSeek Harness Desktop（社区版）](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md)

[![GitHub ★ 869](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=869&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ningbainb/deepseek-harness-desktop)

> **用途**：希望用安装包进入DSH编程环境且理解本机执行权限的开发者，可在独立profile试用社区客户端。

> **亮点**：[Q01](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q01) 显示项目的贡献是独立桌面环境集成，模型和Agent能力仍归官方Runtime；[Q02](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q02)的消费确认背压相对截断输出保留了更合理的完整性目标，不代表全部接线已验证。

> **思考**：[Q02](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q02) 已贯通主preload到renderer的消费确认链，但空窗口可发送超大帧，yield后推进确认也不等于最终绘制或落盘；[Q03](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q03)说明宿主不是第三方代码沙箱，不能把安装便利等同安全保证。

> **建议**：[Q05](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q05) 推导等待确认的诊断快照，先排除现有上层已实现，再用慢消费者比较定位耗时与重启次数；不伪造确认，不能改善定位则否定。

[查看完整分析](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333429325-root"></a>

## [DeepSeek Harness for VS Code](../../plugins/skymecode--deepseek-harness-for-vscode/INSIGHT.md)

[![GitHub ★ 163](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=163&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/skymecode/deepseek-harness-for-vscode)

> **用途**：需要在 VS Code 里使用 Harness 的开发者可以评估原生工作台。

> **亮点**：[Q01](../../plugins/skymecode--deepseek-harness-for-vscode/INSIGHT.md#research-q01) 把运行时与编辑器服务组合。

> **思考**：[Q03](../../plugins/skymecode--deepseek-harness-for-vscode/INSIGHT.md#research-q03) 源码和 VSIX 运行时版本有差异，数据升级要留备份。

> **建议**：[Q05](../../plugins/skymecode--deepseek-harness-for-vscode/INSIGHT.md#research-q05) 验证恢复时的版本提示。

[查看完整分析](../../plugins/skymecode--deepseek-harness-for-vscode/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333721673-root"></a>

## [DeepSeek Harness for VS Code](../../plugins/vithrive--deepseek-harness-for-vs-code/INSIGHT.md)

[![GitHub ★ 59](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=59&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code)

> **用途**：已使用DSH并希望在VS Code少切窗口的用户，可内嵌网页和导航工作区；可选Copilot入口实际委托DSH任务，须核执行身份与收尾，见 [Q01](../../plugins/vithrive--deepseek-harness-for-vs-code/INSIGHT.md#research-q01)。

> **亮点**：贡献是把完整DSH工作面与编辑器文件/剪贴板及模型入口衔接，支持远程Host与客户端中继；净效率和全平台兼容未测，见 [Q01](../../plugins/vithrive--deepseek-harness-for-vs-code/INSIGHT.md#research-q01)至 [Q03](../../plugins/vithrive--deepseek-harness-for-vs-code/INSIGHT.md#research-q03)。

> **思考**：打开面板会处理配套包/profile，Copilot工具和instructions不原样转交；取消/超时只停等待，DSH任务仍可能运行，使用者需独立核权限和收尾，见 [Q03](../../plugins/vithrive--deepseek-harness-for-vs-code/INSIGHT.md#research-q03)至 [Q05](../../plugins/vithrive--deepseek-harness-for-vs-code/INSIGHT.md#research-q05)。

> **建议**：未验证方向是提交前显式展示DSH委托的主机/cwd/preset、丢弃指令与sid/留活状态，比较双编排误判和额外提示负担，见 [Q07](../../plugins/vithrive--deepseek-harness-for-vs-code/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/vithrive--deepseek-harness-for-vs-code/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333718792-root"></a>

## [DeepSeek Harness Tauri Desktop](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md)

[![GitHub ★ 3,550](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C550&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-tauri/deepseek-harness-desktop)

> **用途**：已有 DSH 的用户希望用一个桌面入口选内核、启动档案、查看会话和管理本地数据。[Q01](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q01)

> **亮点**：在一个桌面客户端衔接内核选择、按档案的进程管理和已认证的 Harness 页面，让用户可以从图形界面启动同一档案。[Q01](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q01) [Q02](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q02) [Q03](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q03)

> **思考**：进程就绪、页面可信与会话可用是不同状态。目录迁移比较文件数和字节下限，链接重建失败只告警，仍需独立读验后再切换。[Q03](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q03) [Q04](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q04)

> **建议**：待验证方向是分别呈现进程、认证、会话和关键数据的检查结果，观察能否降低用户过早切换和误判成功。[Q05](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1216785679-root"></a>

## [DeepSeek Reasonix](../../plugins/esengine--deepseek-reasonix/INSIGHT.md)

[![GitHub ★ 36,089](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C089&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/esengine/DeepSeek-Reasonix)

> **用途**：根DeepSeek Reasonix是独立编码Agent/Studio/CLI，提供终端、桌面、Web和ACP编辑器接入；本条身份为root工具，不能将integrations/dsh-plugin的0.1.0当根版本或称整仓DSH原生插件。README区分Studio2.x开发线和npm1.x维护线，根构建有Go1.26/toolchain要求；固定Git源码不等当前发布包/宿主安装通过。

> **亮点**：[Q02](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q02)实际自主工具执行与配对反馈；[Q04](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q04)预算观测/有限文件会话恢复，多入口统一而非新模型。

> **思考**：[Q03](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q03)普通Gate不能外推!直输或信任MCP/扩展，外部caller来源未核；[Q04](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q04)预算非支付硬预授权、rewind不撤shell/外部效果。

> **建议**：[Q06](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q06)人类/委派输入分型与副作用回执，先和禁bash/隔离最小替代对照，不算当前能力。

[查看完整分析](../../plugins/esengine--deepseek-reasonix/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1337578630-root"></a>

## [DeepSeekGUI](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md)

[![GitHub ★ 274](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=274&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/See-Sol-Lab/DeepSeekGUI)

> **用途**：个人用户在本地项目中让 Agent 读改文件并核对改动，同时管理运行环境。见 [Q01](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q01)。

> **亮点**：桌面客户端与发行整合、Home/Profile 的可恢复切换、更新安装和迁移核验是可见增量；Agent、Git 能力和许多 UI 继承 DSH，不以全仓数量认定原创。见 [Q01](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q01)、[Q03](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q03)。

> **思考**：启动配置可恢复不等于任务正确；Full access 的 Git 写入并非一律逐次审批，已加载会话也不实时重读记忆。发布包稳定性与迁移外部竞争未实测。见 [Q02](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q02)、[Q03](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q03)。

> **建议**：验证工作区绑定的任务交付核验能否提高错误 diff、漏测和错误目录的检出率；若只复述自评或现有视图同样有效即推翻。见 [Q04](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1142234916-root"></a>

## [DeepSpider](../../plugins/ma-pony--deepspider/INSIGHT.md)

[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ma-pony/deepspider) [![npm 30d 1,096](https://img.shields.io/static/v1?label=npm+30d&message=1%2C096&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepspider) [![最新发布 2026-09-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepspider)

> **用途**：DeepSpider 面向在授权测试页面研究请求参数生成的工程人员，把DSH、浏览器证据和独立运行时组织为分析工作台。它是实际DSH bundle，host提供RuntimeManager，agent将工具catalog注册到ctx.tools，并由agent身份选取运行时。相对只抓一次请求或保存浏览器Cookie，本组件尝试将输出合同、运行配方、生成结果、真实请求验证与Solver关联；这种区分观察、回放与独立生成的交付组织是主要增量。浏览器控制、DSH执行、sdenv页面语义和CycleTLS网络能力来自依赖，不是项目自创。当前自动恢复能力注册只覆盖Cookie，其他输出类型不能因可建合同就称已有端到端自动恢复。

> **亮点**：[Q01](../../plugins/ma-pony--deepspider/INSIGHT.md#research-q01) 与[Q02](../../plugins/ma-pony--deepspider/INSIGHT.md#research-q02) 将观察、独立生成与有限请求验证区分，并按合同和来源绑定导出，主要增量是交付与证据组织。

> **思考**：[Q02](../../plugins/ma-pony--deepspider/INSIGHT.md#research-q02) reproduced只覆盖状态与标题，导出不证明关闭浏览器后已重跑；[Q03](../../plugins/ma-pony--deepspider/INSIGHT.md#research-q03) 默认启动宽权限与会话目录分组也不构成强隔离。

> **建议**：[Q04](../../plugins/ma-pony--deepspider/INSIGHT.md#research-q04) 为自有API增加业务断言并独立记录关闭浏览器后的重跑，可能降低把可达当正确的误判；当前未实现或验证。

[查看完整分析](../../plugins/ma-pony--deepspider/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1230068255-root"></a>

## [DeepTide](../../plugins/paean-ai--deeptide/INSIGHT.md)

[![GitHub ★ 1,105](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C105&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/paean-ai/deeptide) [![npm 30d 100](https://img.shields.io/static/v1?label=npm+30d&message=100&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deeptide) [![最新发布 2026-05-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-05-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deeptide)

> **用途**：需要DeepSeek编码客户端或本地模型的开发者，先区分Zero别名/Rust/原生形态再选；合格结果是可审代码任务。[Q01](../../plugins/paean-ai--deeptide/INSIGHT.md#research-q01)

> **亮点**：根npm普通路径主要是Zero CLI命令入口包装；仓库另有Rust与本地bootstrap，不能把全部上游工具算根原创或同版能力。[Q01](../../plugins/paean-ai--deeptide/INSIGHT.md#research-q01)

> **思考**：不同形态的权限、资源和成功信号容易混读；本地自测失败exitCode2后仍写settings，npm安装成功也不证明Rust二进制已下载。[Q03](../../plugins/paean-ai--deeptide/INSIGHT.md#research-q03)

> **建议**：未验证方向是在临时profile自测后才提交现用配置，失败保留原状态，以故障注入比较配置变动和残留服务。[Q05](../../plugins/paean-ai--deeptide/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/paean-ai--deeptide/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1300173275-root"></a>

## [Déjà Vu](../../plugins/vshulcz--deja-vu/INSIGHT.md)

[![GitHub ★ 1,343](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C343&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu)

> **用途**：使用多个编码助手的开发者需要找回旧错误、命令和决定。

> **亮点**：[Q01](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q01) 和 [Q02](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q02) 将分散历史索引并以统一入口检索；历史质量和节时仍需对照。

> **思考**：[Q03](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q03) 正则去敏可关闭且不能证明全覆盖；旧索引和跨项目历史必须核时效与授权。

> **建议**：[Q05](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q05) 假设对相互矛盾历史提供来源和版本核对视图，可减少错误采纳；须先核现有能力且未验证。

[查看完整分析](../../plugins/vshulcz--deja-vu/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1148960257-root"></a>

## [Desktop CC GUI](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md)

[![GitHub ★ 4,582](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C582&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhukunpenglinyutong/desktop-cc-gui)

> **用途**：同时使用多种编码引擎的开发者希望从一个桌面界面访问同一项目，确认每次发送的引擎、会话、工具结果和结束状态。[Q01](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q01) [Q02](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q02) 相比逐个切换原生入口，桌面界面将多个引擎的项目与会话放在同一处。DSH 使用独立宿主传输，原生 ID 和结构化事件接进客户端记录。

> **思考**：[Q03](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q03) 普通 DSH 工具审批自动回 allowed-once。计划模式的 active 回读及 typed 评审是另一层控制，批准送达只进入 Starting，当前工作区实际权限取决于宿主。

> **建议**：[Q05](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q05) 分开展示普通审批、计划确认和宿主实际限制，并标示探测时效或未知，可能减少开发者把评审当执行隔离的情况。比较权限误判及错误重发。

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

<a id="plugin-1335490343-root"></a>

## [Dockyard DSH](../../plugins/aitabby--dockyard-dsh/INSIGHT.md)

[![GitHub ★ 77](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=77&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AITabby/dockyard-dsh)

> **用途**：已有多个模型账号、愿意在独立DSH进程验证路由与凭据的开发者。

> **亮点**：[Q01](../../plugins/aitabby--dockyard-dsh/INSIGHT.md#research-q01) 账户健康opToken和输出前切换；[Q02](../../plugins/aitabby--dockyard-dsh/INSIGHT.md#research-q02) 统一授权与引用存储。

> **思考**：[Q04](../../plugins/aitabby--dockyard-dsh/INSIGHT.md#research-q04) 根无条件改198.18/15的ipaddr分类且无restore；[Q03](../../plugins/aitabby--dockyard-dsh/INSIGHT.md#research-q03) usage目的地接受配置HTTPS并携key。

> **建议**：[Q05](../../plugins/aitabby--dockyard-dsh/INSIGHT.md#research-q05) 健康保存未知的可见性是否改善重启恢复需对照。

[查看完整分析](../../plugins/aitabby--dockyard-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1417162408-root"></a>

## [DoYourWeb](../../plugins/sheepofsheep--dsh-doyourweb/INSIGHT.md)

[![GitHub ★ 55](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=55&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SheepofSheep/dsh-doyourweb) [![npm 30d 5,326](https://img.shields.io/static/v1?label=npm+30d&message=5%2C326&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-doyourweb) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-doyourweb)

> **用途**：在 DSH 聊天需要读取已打开测试网页的用户，可直接引用该标签并查看页面内容。

> **亮点**：[Q01](../../plugins/sheepofsheep--dsh-doyourweb/INSIGHT.md#research-q01) 与 [Q02](../../plugins/sheepofsheep--dsh-doyourweb/INSIGHT.md#research-q02) 显示，组件把已有页面、用户引用和工具执行连进同一会话。

> **思考**：[Q02](../../plugins/sheepofsheep--dsh-doyourweb/INSIGHT.md#research-q02) 与 [Q03](../../plugins/sheepofsheep--dsh-doyourweb/INSIGHT.md#research-q03) 指出，目标授权不能替代对上传去向与连接器动作的核查；超时后需独立确认效果。

> **建议**：[Q04](../../plugins/sheepofsheep--dsh-doyourweb/INSIGHT.md#research-q04) 的待验证假设是，持续复用同一标签能减少人工定位和复制；若目标核对增加的时间抵消节省，则放弃假设。

[查看完整分析](../../plugins/sheepofsheep--dsh-doyourweb/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334325657-root"></a>

## [DS Harness Remote](../../plugins/liguobao--ds-harness-remote/INSIGHT.md)

[![GitHub ★ 2,527](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C527&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liguobao/ds-harness-remote) [![npm 30d 41,072](https://img.shields.io/static/v1?label=npm+30d&message=41%2C072&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/ds-harness-remote) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/ds-harness-remote)

> **用途**：离开电脑的开发者可用第二设备读取原 DSH 会话，先验证相同工作区和记录。

> **亮点**：[Q01](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q01) 把跨设备连接和原宿主业务接在同一入口，[Q02](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q02) 终端按 Host 已绑定的设备归属授权。

> **思考**：[Q02](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q02) 设备和连接校验仍允许授权输入沿 Host 权限运行，[Q03](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q03) Linux 托管模式可能以 root 执行。

> **建议**：[Q04](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q04) 用 Host 可回读的请求阶段明确结果未知，可能减少断线时重复操作。

[查看完整分析](../../plugins/liguobao--ds-harness-remote/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1376053947-root"></a>

## [DSH Agent Studio](../../plugins/thissensen--dsh-agent-studio/INSIGHT.md)

[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/thissensen/dsh-agent-studio) [![npm 30d 3,345](https://img.shields.io/static/v1?label=npm+30d&message=3%2C345&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-studio) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-studio)

> **用途**：需要经常向不同角色委派独立核查任务的 DSH 使用者，可用预设和子会话身份管理批次。

> **亮点**：[Q01](../../plugins/thissensen--dsh-agent-studio/INSIGHT.md#research-q01) 和 [Q02](../../plugins/thissensen--dsh-agent-studio/INSIGHT.md#research-q02) 将角色绑定带入批次发起，并按目标配置返回启动回执或等待结算。

> **思考**：[Q03](../../plugins/thissensen--dsh-agent-studio/INSIGHT.md#research-q03) PTC 预算提高默认启用并影响整个宿主进程。阻塞批若无法写临时文件，只返回元数据与错误，正文不会回填。

> **建议**：[Q05](../../plugins/thissensen--dsh-agent-studio/INSIGHT.md#research-q05) 对每批单独限制等待并保留可查询结果，有望缩小对其他 PTC 任务的影响。

[查看完整分析](../../plugins/thissensen--dsh-agent-studio/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1343951443-root"></a>

## [DSH Agent Team](../../plugins/contexera--dsh-agent-team/INSIGHT.md)

[![GitHub ★ 84](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=84&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Contexera/dsh-agent-team) [![npm 30d 3,210](https://img.shields.io/static/v1?label=npm+30d&message=3%2C210&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@contexera/dsh-agent-team) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@contexera/dsh-agent-team)

> **用途**：单个人需要协调多条开发工作与复核。

> **亮点**：[Q01](../../plugins/contexera--dsh-agent-team/INSIGHT.md#research-q01) 将交接、负责人与验收规则持久建模。

> **思考**：[Q03](../../plugins/contexera--dsh-agent-team/INSIGHT.md#research-q03) managed agent全访问且只声明单Human，评审规则不等于安全隔离。

> **建议**：[Q05](../../plugins/contexera--dsh-agent-team/INSIGHT.md#research-q05) 可减少人工转派同时保持角色验收可追溯。

[查看完整分析](../../plugins/contexera--dsh-agent-team/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 2,903](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C903&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NanmiCoder/dsh-agent-teams) [![npm 30d 61,277](https://img.shields.io/static/v1?label=npm+30d&message=61%2C277&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams)

> **用途**：能拆分独立任务并承担整合的 DSH 负责人，希望复用成员会话并查清任务交接。

> **亮点**：把任务依赖、成员分工、attempt 和审阅字节放在同一流程，并适配新宿主的成员投递与定向停止。[Q01](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q01) [Q02](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q02) [Q04](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q04)

> **思考**：模型批准的非空字符串无法证明用户授权。Team 状态、工具过滤与审计各有边界；halt 落盘也可能早于实际停止。[Q01](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q01) [Q03](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q03) [Q04](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q04)

> **建议**：把实际路径操作权限绑定到成员及 attempt，转派时撤销旧权限，可能减少旧任务继续写入。[Q05](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1341805689-root"></a>

## [DSH Android](../../plugins/zseven-w--dsh-android/INSIGHT.md)

[![GitHub ★ 213](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=213&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-android) [![npm 30d 3,219](https://img.shields.io/static/v1?label=npm+30d&message=3%2C219&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-android) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-android)

> **用途**：Android开发者让DSH在测试设备构建/查看/操作并排错。

> **亮点**：[Q01](../../plugins/zseven-w--dsh-android/INSIGHT.md#research-q01)、[Q02](../../plugins/zseven-w--dsh-android/INSIGHT.md#research-q02) 将设备身份、画面、语义选择与构建调试整合，减少跨窗口手填。

> **思考**：[Q03](../../plugins/zseven-w--dsh-android/INSIGHT.md#research-q03) 路由Origin/HMAC非调用者身份，观察匹配不等业务完成；安装启动信号未续传，取消非无副作用；[Q04](../../plugins/zseven-w--dsh-android/INSIGHT.md#research-q04)设备设置/应用不随卸载回滚。

> **建议**：[Q05](../../plugins/zseven-w--dsh-android/INSIGHT.md#research-q05) serial/前台/采样时点/目标与最终状态收据可探索；若现有结果等效或负担更大即否定。

[查看完整分析](../../plugins/zseven-w--dsh-android/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1330089831-root"></a>

## [DSH Annotation](../../plugins/omdsh-dev--dsh-annotation/INSIGHT.md)

[![GitHub ★ 160](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=160&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-annotation) [![npm 30d 3,331](https://img.shields.io/static/v1?label=npm+30d&message=3%2C331&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-annotation) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-annotation)

> **用途**：需要逐段追问 DSH 回复的人可收集批注再统一发出。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-annotation/INSIGHT.md#research-q01) 将选段和问题统一提交。

> **思考**：[Q03](../../plugins/omdsh-dev--dsh-annotation/INSIGHT.md#research-q03) 隐藏只改气泡显示，模型仍收到内容。

> **建议**：[Q05](../../plugins/omdsh-dev--dsh-annotation/INSIGHT.md#research-q05) 测试显式预览能否减少误发。

[查看完整分析](../../plugins/omdsh-dev--dsh-annotation/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335813480-root"></a>

## [DSH Automation](../../plugins/michengai--dsh-automation/INSIGHT.md)

[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-automation) [![npm 30d 43,736](https://img.shields.io/static/v1?label=npm+30d&message=43%2C736&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-automation) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-automation)

> **用途**：适合定期重复同一项边界明确且输出可复核的 DSH 工作。

> **亮点**：[Q01](../../plugins/michengai--dsh-automation/INSIGHT.md#research-q01) 将重复启动移到计划和独立会话。[Q02](../../plugins/michengai--dsh-automation/INSIGHT.md#research-q02) 将冲突、补跑和中断作为可回查状态。

> **思考**：[Q02](../../plugins/michengai--dsh-automation/INSIGHT.md#research-q02) 中 queued 会继续领取，只有旧 running 被标失败，与 README 口径有差异。[Q03](../../plugins/michengai--dsh-automation/INSIGHT.md#research-q03) 的失败、超时或取消都不能直接推出工具副作用已回滚。

> **建议**：[Q04](../../plugins/michengai--dsh-automation/INSIGHT.md#research-q04) 用唯一文件标记验证宿主中断后三类执行边界。若实际文件与状态不能对上，保留手动执行。

[查看完整分析](../../plugins/michengai--dsh-automation/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339889879-root"></a>

## [DSH Better Reasoning Effort](../../plugins/haoyueqin--dsh-better-reasoning-effort/INSIGHT.md)

[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HaoyueQin/dsh-better-reasoning-effort) [![npm 30d 3,996](https://img.shields.io/static/v1?label=npm+30d&message=3%2C996&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-reasoning-effort) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-reasoning-effort)

> **用途**：第三方模型用户不想手写settings声明，希望在官方Models卡编辑推理/图片输入、在Composer选择档位，并核对真实wire和上游接受。[Q01](../../plugins/haoyueqin--dsh-better-reasoning-effort/INSIGHT.md#research-q01)

> **亮点**：把已有底层配置能力放进模型编辑和会话选择流程，知识库匹配自动填充与显式低置信度建议分开，保留unset与catalog override以降低手写/误覆盖负担。实际请求由宿主与上游决定，未验证任务收益。[Q01](../../plugins/haoyueqin--dsh-better-reasoning-effort/INSIGHT.md#research-q01) [Q02](../../plugins/haoyueqin--dsh-better-reasoning-effort/INSIGHT.md#research-q02) [Q04](../../plugins/haoyueqin--dsh-better-reasoning-effort/INSIGHT.md#research-q04)

> **思考**：声明/UI不等于服务支持，正常Save是先官方后插件两阶段；按钮无法识别时全局signalsUnavailable允许无Save标记的队列在卡片消失等条件下尝试写入，取消/刷新不保证撤销。browser读取autofill开关失败会回默认开启；host域名LAN信任门可能使该读取失败。defaultGuard和origin级UA覆盖扩大请求变化范围，同origin不同route不可分别UA，禁用只撤wrapper/UI不还原已存配置。[Q02](../../plugins/haoyueqin--dsh-better-reasoning-effort/INSIGHT.md#research-q02) [Q03](../../plugins/haoyueqin--dsh-better-reasoning-effort/INSIGHT.md#research-q03) [Q04](../../plugins/haoyueqin--dsh-better-reasoning-effort/INSIGHT.md#research-q04)

> **建议**：可研究显式单请求的声明—配置—wire—上游结果对照诊断，记录建议来源与guard注入而不存凭据/原提示，比较误配、排错、用量和任务质量。无净改善就保留原配置，不将未执行的诊断收益计当前创新。[Q05](../../plugins/haoyueqin--dsh-better-reasoning-effort/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/haoyueqin--dsh-better-reasoning-effort/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1352600211-root"></a>

## [DSH Better Sidebar N23](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md)

[![npm 30d 1,125](https://img.shields.io/static/v1?label=npm+30d&message=1%2C125&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23)

> **用途**：希望在对话旁完成文件检查、终端与Git操作的开发者；需接受插件以本机权限执行操作。

> **亮点**：现有工作台把文件、终端和Git交接集中到DSH旁；fork可识别增量是布局提交策略、外壳与模块兼容，整体设计归上游，不能全部计为原创。[Q01](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q01)

> **思考**：src/lib刻意分轨意味着“源码有修复”不能证明发布包具有同一修复；发布fs.write也没有版本比较或cwd写入边界。兼容与编辑可靠性应先于功能广度判断。[Q02](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q02) [Q03](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q03)

> **建议**：未验证假设为分离拖拽临时视觉状态与最终持久化提交，并用统一可重建源消除产物漂移；在相同大对话负载下检验帧耗时和构建一致性，收益消失或布局回归即否定。[Q04](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1353534254-root"></a>

## [DSH Bot · 模型路由](../../plugins/alice-marx--dsh-model-router/INSIGHT.md)

[![GitHub ★ 957](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=957&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 1,474](https://img.shields.io/static/v1?label=npm+30d&message=1%2C474&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-route-bot) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-route-bot)

> **用途**：已有多条 DSH 模型路线的开发者可预览依赖工作包，并查看选路、执行与费用记录。

> **亮点**：[Q02](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q02) 将依赖分派、路由来源和启动确认集中为可核对的工作台流程。[Q03](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q03) 对已启动但未收齐账单的工作保留未知和预占。

> **思考**：[Q01](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q01) 作者的纯路由宿主回执未打开工作台。[Q04](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q04) 任务 journal 和租约需要后端配合，无法单凭本地取消证明远端停止。

> **建议**：[Q05](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q05) 只用已验收产物和结清回执校准特定任务族，可能降低评分先验不匹配带来的无效调用。

[查看完整分析](../../plugins/alice-marx--dsh-model-router/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333200468-root"></a>

## [DSH Chat Import](../../plugins/nwflower--dsh-chat-import/INSIGHT.md)

[![GitHub ★ 273](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=273&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nwflower/dsh-chat-import) [![npm 30d 13,577](https://img.shields.io/static/v1?label=npm+30d&message=13%2C577&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-import) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-import)

> **用途**：迁入 DSH 的开发者需要查询并接续已有编码会话。

> **亮点**：[Q01](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q01) 与 [Q02](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q02) 将外部会话转换为宿主记录并接入工作区；不转移原运行环境。

> **思考**：[Q03](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q03) 创建、挂接和记账不是已证明的单一事务；[Q04](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q04) 空结果补齐与图片占位限制无损主张。

> **建议**：[Q05](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q05) 假设逐对象迁移清单可降低无损误判；需先核现有界面且未验证。

[查看完整分析](../../plugins/nwflower--dsh-chat-import/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1407409202-root"></a>

## [DSH CLIWorker Now](../../plugins/superwheel--dsh-cliworker-now/INSIGHT.md)

[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SuperWheel/dsh-cliworker-now)

> **用途**：适合已有外部 CLI 且想从 DSH 交给它一个可独立复核的代码分析任务的人，见 [Q01](../../plugins/superwheel--dsh-cliworker-now/INSIGHT.md#research-q01)。

> **亮点**：把外部 CLI 进程、父会话和权限回执接入同一派遣流程，见 [Q01](../../plugins/superwheel--dsh-cliworker-now/INSIGHT.md#research-q01) 与 [Q02](../../plugins/superwheel--dsh-cliworker-now/INSIGHT.md#research-q02)。

> **思考**：挂载会替换原生会话界面。不同 CLI 的真实权限和启动后结果需独立核查，见 [Q02](../../plugins/superwheel--dsh-cliworker-now/INSIGHT.md#research-q02) 与 [Q03](../../plugins/superwheel--dsh-cliworker-now/INSIGHT.md#research-q03)。

> **建议**：区分进程启动、消息交付与业务验收，比较是否减少异常后的重复派遣，见 [Q05](../../plugins/superwheel--dsh-cliworker-now/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/superwheel--dsh-cliworker-now/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334118559-root"></a>

## [DSH Command Code Provider](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md)

[![GitHub ★ 447](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=447&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Mars-Sea/dsh-commandcode-provider) [![npm 30d 13,208](https://img.shields.io/static/v1?label=npm+30d&message=13%2C208&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mars-sea/dsh-commandcode-provider) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mars-sea/dsh-commandcode-provider)

> **用途**：已有 Command Code 账户的 DSH 用户希望在当前宿主调用其模型。

> **亮点**：[Q01](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q01) 和 [Q02](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q02) 将上游模型和账户整合到 DSH；模型质量与可用性属于上游。

> **思考**：[Q03](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q03) 分层重试不能证明远端未执行，[Q04](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q04) 本地 ZDR 请求头与价格估算不能证明留存政策或账单。

> **建议**：[Q06](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q06) 假设脱敏逐次收据和未知状态可改善失败与费用判断；尚未实现或验证。

[查看完整分析](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334089233-root"></a>

## [DSH Computer Use](../../plugins/zrui-c--dsh-computer-use/INSIGHT.md)

[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZRui-C/dsh-computer-use)

> **用途**：需要重复操作无专用 API 的界面的 DSH 用户，可让文本模型先定位控件再执行单步任务。[Q01](../../plugins/zrui-c--dsh-computer-use/INSIGHT.md#research-q01)

> **亮点**：复用浏览器与桌面语义，并统一模型面对的观察、引用和动作结果。[Q01](../../plugins/zrui-c--dsh-computer-use/INSIGHT.md#research-q01) [Q03](../../plugins/zrui-c--dsh-computer-use/INSIGHT.md#research-q03)

> **思考**：词法路径不是实际文件范围。无 PID 的桌面输入可能走全局 HID，异常也可能发生在动作发送之后。[Q02](../../plugins/zrui-c--dsh-computer-use/INSIGHT.md#research-q02) [Q03](../../plugins/zrui-c--dsh-computer-use/INSIGHT.md#research-q03)

> **建议**：检验强制指定桌面目标和分别记录发送、确认能否减少错窗及错误重试。若拒绝率抵消收益则放弃。[Q05](../../plugins/zrui-c--dsh-computer-use/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/zrui-c--dsh-computer-use/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1401334465-root"></a>

## [DSH Computer Use](../../plugins/copylee711--dsh-computer-use/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/copylee711/dsh-computer-use) [![npm 30d 10,051](https://img.shields.io/static/v1?label=npm+30d&message=10%2C051&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@copylee/dsh-computer-use) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@copylee/dsh-computer-use)

> **用途**：适合有独立 Windows 测试桌面并需要复核 GUI 状态的开发者，见 [Q01](../../plugins/copylee711--dsh-computer-use/INSIGHT.md#research-q01)。

> **亮点**：将截图、应用上下文和命名控件接入 DSH，并在部分窗口变化时停下，见 [Q01](../../plugins/copylee711--dsh-computer-use/INSIGHT.md#research-q01) 和 [Q02](../../plugins/copylee711--dsh-computer-use/INSIGHT.md#research-q02)。

> **思考**：访问层对无法识别窗口无拒绝判定，批次中断也不会撤销先前动作，见 [Q02](../../plugins/copylee711--dsh-computer-use/INSIGHT.md#research-q02) 与 [Q03](../../plugins/copylee711--dsh-computer-use/INSIGHT.md#research-q03)。

> **建议**：对高副作用输入增加可验证窗口和新鲜画面的约束，测试是否减少错投，见 [Q05](../../plugins/copylee711--dsh-computer-use/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/copylee711--dsh-computer-use/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425216193-root"></a>

## [DSH Design Studio](../../plugins/orderg-x--dsh-design-studio/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/OrderG-X/dsh-design-studio) [![npm 30d 7,495](https://img.shields.io/static/v1?label=npm+30d&message=7%2C495&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-design-studio) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-design-studio)

> **用途**：用 DSH 迭代网页设计的开发者，可在对话旁检查同一会话的本地页面。

> **亮点**：[Q01](../../plugins/orderg-x--dsh-design-studio/INSIGHT.md#research-q01) 与 [Q02](../../plugins/orderg-x--dsh-design-studio/INSIGHT.md#research-q02) 显示，会话定位和预览注册把页面检查接入设计对话，减少切到独立页面再传达位置的步骤。

> **思考**：[Q03](../../plugins/orderg-x--dsh-design-studio/INSIGHT.md#research-q03) 指出，预览 iframe 按页面来源走不同策略，管理接口和手机接入也各自有信任条件。应先验证本地可信内容。

> **建议**：[Q04](../../plugins/orderg-x--dsh-design-studio/INSIGHT.md#research-q04) 比较同一反馈任务是否减少错页与切换。若独立浏览器同样准确而总耗时更短，放弃假设。

[查看完整分析](../../plugins/orderg-x--dsh-design-studio/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1414685342-integrations-dsh"></a>

## [DSH ESP32 Agent（Handsy）](../../plugins/onehumanbeing--esp32-iphone-agent--integrations-dsh/INSIGHT.md)

[![GitHub ★ 4,831](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C831&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/onehumanbeing/esp32-iphone-agent) [![npm 30d 947](https://img.shields.io/static/v1?label=npm+30d&message=947&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-esp32agent) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-esp32agent)

> **用途**：适合已有 Handsy 板和独立测试手机、需要复核真实界面导航的开发者，见 [Q01](../../plugins/onehumanbeing--esp32-iphone-agent--integrations-dsh/INSIGHT.md#research-q01)。

> **亮点**：把已有设备工具和一图一动作的说明组装为 DSH profile 扩展，避免分开配置和说明，见 [Q01](../../plugins/onehumanbeing--esp32-iphone-agent--integrations-dsh/INSIGHT.md#research-q01) 与 [Q02](../../plugins/onehumanbeing--esp32-iphone-agent--integrations-dsh/INSIGHT.md#research-q02)。

> **思考**：手机上动作有真实副作用，Skill 的请求确认属于行为指引。截图冻结或板号不明时，动作目标也无法靠一次返回判定，见 [Q03](../../plugins/onehumanbeing--esp32-iphone-agent--integrations-dsh/INSIGHT.md#research-q03)。

> **建议**：让动作携带设备与上一次画面标识，检验过期动作拒绝能否减少错触，见 [Q05](../../plugins/onehumanbeing--esp32-iphone-agent--integrations-dsh/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/onehumanbeing--esp32-iphone-agent--integrations-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333846315-root"></a>

## [DSH File Review](../../plugins/left0ver--dsh-file-review/INSIGHT.md)

[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/left0ver/dsh-file-review) [![npm 30d 5,026](https://img.shields.io/static/v1?label=npm+30d&message=5%2C026&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-file-review) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-file-review)

> **用途**：用户核对刚由 Agent 改动的一行文本，希望在同一会话明确指出修订要求。

> **亮点**：[Q01](../../plugins/left0ver--dsh-file-review/INSIGHT.md#research-q01) 将可捕获的本轮工具改动投到审查面板。[Q02](../../plugins/left0ver--dsh-file-review/INSIGHT.md#research-q02) 将批注及对应 diff 序列化进原生会话消息。

> **思考**：[Q03](../../plugins/left0ver--dsh-file-review/INSIGHT.md#research-q03) 撤销按文件独立匹配和写入，可能部分成功；维护期与重读无法覆盖所有外部并发。

> **建议**：[Q04](../../plugins/left0ver--dsh-file-review/INSIGHT.md#research-q04) 行级反馈携带轮次和引用或能减少手工定位错误，需要同一 diff 的手工对照。

[查看完整分析](../../plugins/left0ver--dsh-file-review/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335024457-root"></a>

## [DSH for VS Code](../../plugins/fengze233--dsh-vscode/INSIGHT.md)

[![GitHub ★ 47](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=47&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fengze233/dsh-vscode)

> **用途**：[Q01](../../plugins/fengze233--dsh-vscode/INSIGHT.md#research-q01) 频繁往返 DSH Web 和 VS Code 的开发者可把会话放在编辑器旁，基线是在独立浏览器使用。

> **亮点**：[Q01](../../plugins/fengze233--dsh-vscode/INSIGHT.md#research-q01) 与 [Q02](../../plugins/fengze233--dsh-vscode/INSIGHT.md#research-q02) 让 DSH Web 的启动与认证进入编辑器，并接原生文件和剪贴板动作。体验与时间收益未实测。

> **思考**：[Q03](../../plugins/fengze233--dsh-vscode/INSIGHT.md#research-q03) 代办认证的环回端口、可信 iframe 和可写 cwd 构成实际权限边界。[Q04](../../plugins/fengze233--dsh-vscode/INSIGHT.md#research-q04) 的自动桥接会改宿主配置和目录。

> **建议**：[Q05](../../plugins/fengze233--dsh-vscode/INSIGHT.md#research-q05) 假设脱敏的阶段回执可降低误重启与恢复用时。以已有分散的启动、认证和桥接状态作对照。

[查看完整分析](../../plugins/fengze233--dsh-vscode/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1343674616-root"></a>

## [DSH Git Bash Shell](../../plugins/kannakuron--dsh-gitbash-shell/INSIGHT.md)

[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KannaKuron/dsh-gitbash-shell) [![npm 30d 13,622](https://img.shields.io/static/v1?label=npm+30d&message=13%2C622&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-gitbash-shell) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-gitbash-shell)

> **用途**：在 Windows DSH 复用团队 Bash 命令的开发者需要减少解释器和路径切换。[Q01](../../plugins/kannakuron--dsh-gitbash-shell/INSIGHT.md#research-q01)

> **亮点**：将 Git for Windows、宿主会话工具和任务生命周期连接，并为路径方言及原生 argv 增加显式边界。[Q01](../../plugins/kannakuron--dsh-gitbash-shell/INSIGHT.md#research-q01) [Q03](../../plugins/kannakuron--dsh-gitbash-shell/INSIGHT.md#research-q03)

> **思考**：默认 Windows 受限调用拒绝启动。关闭实验门禁可恢复标注无约束的兼容行为，无法满足依赖强制写隔离的任务。[Q02](../../plugins/kannakuron--dsh-gitbash-shell/INSIGHT.md#research-q02)

> **建议**：检验结果旁的解释器、路径与门禁提示能否减少错误工具选择，在受限哨兵出现变更时立即推翻。[Q05](../../plugins/kannakuron--dsh-gitbash-shell/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/kannakuron--dsh-gitbash-shell/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-packages-dsh-git-graph"></a>

## [DSH Git Graph](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md)

[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 104,603](https://img.shields.io/static/v1?label=npm+30d&message=104%2C603&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph)

> **用途**：[Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q01) 面向需要在 DSH 工作区查看分支及历史的 Git 用户；合格操作需要保留工作并确认磁盘状态。

> **亮点**：[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q02) 把 Git 状态和分支操作接入 DSH 界面，并对工作区和分支执行前置检查；仓库数据与 Git 语义仍由上游决定。

> **思考**：[Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q03) 显示部分守卫判断未检查探测退出码，分支删除结果也未核；界面成功不能代替回读实际仓库。

> **建议**：[Q04](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q04) 假设展示受影响会话并在操作后回读状态可减少错目标和伪成功，须以隔离仓库比较错误和时间，尚未验证。

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1385903666-root"></a>

## [DSH Git Panel](../../plugins/xbzbing--dsh-git-panel/INSIGHT.md)

[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xbzbing/dsh-git-panel) [![npm 30d 9,327](https://img.shields.io/static/v1?label=npm+30d&message=9%2C327&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xbzbing/dsh-git-panel) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xbzbing/dsh-git-panel)

> **用途**：开发者在 DSH 会话内审阅工作树和暂存区，按文件核对当前改动。

> **亮点**：[Q01](../../plugins/xbzbing--dsh-git-panel/INSIGHT.md#research-q01) 和 [Q02](../../plugins/xbzbing--dsh-git-panel/INSIGHT.md#research-q02) 把 Git 状态与差异带到会话，并在宿主执行时重建可用的工作树路径集。

> **思考**：[Q03](../../plugins/xbzbing--dsh-git-panel/INSIGHT.md#research-q03) 未跟踪删除分多项执行，后续失败不恢复已删除项，错误需结合实际工作树核对。

> **建议**：[Q05](../../plugins/xbzbing--dsh-git-panel/INSIGHT.md#research-q05) 在预览和执行之间绑定工作树目标身份，可测量范围漂移是否减少。

[查看完整分析](../../plugins/xbzbing--dsh-git-panel/INSIGHT.md) · [返回表格](#category-index)

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



> **用途**：本地 DSH 管理员可在设置页导入 MCP 定义并维护网关模型与思考档位；合格结果是正确 profile 的配置经审阅、重启及代表任务验收。[Q01](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q01) 说明它是设置插件，不提供推理服务。

> **亮点**：它把 MCP JSON 正规化与逐条容错、网关广告到模型配置的转换、差异确认及单文件备份组合成可视设置流程，适合已有多项配置维护任务的本地管理员。相对手改，实际新增的是可审阅的中间结果与集中入口；单文件 rename、YAML 库和宿主槽位是已有机制，不能算分叉原创。收益成立仍需正确 profile、可信广告和重启后任务验收，偶发维护可能用手改更省事。[Q01](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q01)、[Q02](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q02)、[Q03](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q03)。

> **思考**：最强支持是模型同步会重探、拒绝空清单，并让客户端把目标摘要带到确认；但这仍不能证明“网关真正支持”或预览后原配置未变。摘要可省略且不绑定原文件，非空少报可触发删除，同 ID 元数据或档位值更新又可能被 changed 判据跳过；MCP、凭据及调度也没有跨文件共同恢复点。因而应把它当作有人工验收的配置助手，不能当无监督的能力真相源；当前来源与分发状态另有缺口。[Q02](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q02) 至 [Q05](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q05)。

> **建议**：未验证方向一是在预览中绑定原文件摘要、目标 profile 与差异，应用前拒绝外部修改，比较它是否比手改加清单或小补丁减少覆盖。方向二是把非空少报的删除改成待验收，并显示跨文件完成阶段和恢复点，比较它是否比现有三份备份减少误删与恢复时间。它们来自当前目标摘要、删除集合和分步写入的边界，不计入插件已有创新；若简单清单同样有效，或确认和账本增加的负担更大，就应放弃。[Q06](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md#research-q06) 完整说明推导、对照与否定条件。

[查看完整分析](../../plugins/2384418321--dsh-integration-settings/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339882322-root"></a>

## [DSH iOS](../../plugins/zseven-w--dsh-ios/INSIGHT.md)

[![GitHub ★ 349](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=349&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-ios) [![npm 30d 1,695](https://img.shields.io/static/v1?label=npm+30d&message=1%2C695&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-ios) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-ios)

> **用途**：iOS开发者在Agent会话里构建/观察/操作自有测试App，用户可看和接管；非iPhone上的DSH客户端，见 [Q01](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q01)。

> **亮点**：设备开发/观看链与fresh树+可比较计数验证，入口有MAC期限与loopback来源围栏，见 [Q01](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q01) 与 [Q02](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q02)。

> **思考**：局部标签计数非业务成功，真机输入/构建有副作用且runner不因关面板停，未实测兼容/拒绝/恢复，见 [Q02](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q02) 与 [Q03](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q03)。

> **建议**：设备/目标/构建身份与业务断言绑定，显示不确定执行并测误报/恢复成本，未实现，见 [Q03](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/zseven-w--dsh-ios/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422364992-root"></a>

## [DSH Lighthouse](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md)

[![npm 30d 839](https://img.shields.io/static/v1?label=npm+30d&message=839&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lighthouse) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lighthouse)

> **用途**：维护多个作品的开发者可以按显式名册集中查看版本、仓库和市场状态。

> **亮点**：[Q01](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q01) 的显式名册与 [Q02](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q02) 的多源聚合减少来回切换的组织步骤；结果仍需对照来源。

> **思考**：[Q03](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q03) 的单页标题匹配与失败空数组可能误导 PR 状态；[Q04](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q04) 的无来源头放行及本地直接写入需要按部署边界核查。

> **建议**：[Q06](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q06) 提出稳定 PR 身份、受控快照、预算及原子写入的未验证方案；若隔离对照不能降低误认和恢复风险则否定。

[查看完整分析](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333526401-root"></a>

## [DSH LSP Actions](../../plugins/perrylink--dsh-lsp-actions/INSIGHT.md)

[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-lsp-actions) [![npm 30d 7,242](https://img.shields.io/static/v1?label=npm+30d&message=7%2C242&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lsp-actions) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lsp-actions)

> **用途**：使用 DSH 排查代码的开发者可以对当前项目文件获取语言服务器反馈。

> **亮点**：[Q01](../../plugins/perrylink--dsh-lsp-actions/INSIGHT.md#research-q01) [Q02](../../plugins/perrylink--dsh-lsp-actions/INSIGHT.md#research-q02) 显示，插件把语言服务器能力接入模型并按工作区、项目标记路由。

> **思考**：[Q03](../../plugins/perrylink--dsh-lsp-actions/INSIGHT.md#research-q03) 显示，多文件重命名是逐项写入，部分失败时需检查已经改动的文件。

> **建议**：[Q04](../../plugins/perrylink--dsh-lsp-actions/INSIGHT.md#research-q04) 验证对话内诊断能否减少复制和回查；若额外启动与排查抵消节约则放弃。

[查看完整分析](../../plugins/perrylink--dsh-lsp-actions/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333317835-root"></a>

## [DSH Market](../../plugins/2bingling--dsh-market/INSIGHT.md)

[![GitHub ★ 190](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=190&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2BingLing/dsh-market)

> **用途**：需要发现、比较并在合适 profile 采用 DSH 扩展的开发者。

> **亮点**：[Q01](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q01) 将两种读者入口与市场目录关联。[Q02](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q02) 把部分重复安装复用为配方并保留验证。

> **思考**：[Q02](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q02) 过滤命令和子代理复核分别约束不同层面。[Q03](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q03) 部分失败可能保留已执行动作。

> **建议**：[Q04](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q04) 按实际验证层级展示状态，检验是否减少把安装结果当成任务成功。

[查看完整分析](../../plugins/2bingling--dsh-market/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334359396-root"></a>

## [DSH Memoir](../../plugins/qinling-melon-farmers--dsh-memoir/INSIGHT.md)

[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Qinling-Melon-Farmers/dsh-memoir) [![npm 30d 4,102](https://img.shields.io/static/v1?label=npm+30d&message=4%2C102&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-memoir) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-memoir)

> **用途**：反复开启项目会话的开发者，可以记录已确认的决定并在新会话查回。

> **亮点**：[Q01](../../plugins/qinling-melon-farmers--dsh-memoir/INSIGHT.md#research-q01) 与 [Q02](../../plugins/qinling-melon-farmers--dsh-memoir/INSIGHT.md#research-q02) 表明，本地记录、主动搜索与预算内注入能在同一宿主支持跨会话交接。

> **思考**：[Q03](../../plugins/qinling-melon-farmers--dsh-memoir/INSIGHT.md#research-q03) 显示，排队蒸馏只是新模型回合，未证明写入。热记忆也会进入模型输入，需控制数据范围。

> **建议**：[Q04](../../plugins/qinling-melon-farmers--dsh-memoir/INSIGHT.md#research-q04) 验证自动选择是否降低重复摘要。若多出纠错或回合抵消节约，则放弃。

[查看完整分析](../../plugins/qinling-melon-farmers--dsh-memoir/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333842753-root"></a>

## [DSH Mobile](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md)

[![GitHub ★ 242](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=242&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sorsama/deepseek-harness-mobile)

> **用途**：已有受控Harness与Android手机的开发者离开桌面后处理等待、审批和结果。原办法是移动Web或返回电脑；合格结果是正确会话上的及时响应与可确认接管，执行能力仍由宿主提供。

> **亮点**：[Q01](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q01) 与 [Q02](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q02) 支持原生通知与远程待办接管的组合增量，特别是把认证、mux代次与回答eventId统一，避免把旧卡片和新请求混在一起。创新归于移动工作流与协议适配，不把Harness执行或relay服务器能力算本根原创。

> **思考**：[Q03](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q03) 安全文档与真实cookie路径存在冲突，直连cookie也不同于relay token的Keystore保护；手机登录仍获得工具能力，TLS不能缩小权限。[Q02](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q02) 载体失败虽称Unsent，却不证明远端未收到，用户仍须重连核待办，不能盲目再次批准。

> **建议**：[Q04](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q04) 从载体失败语义推导“宿主接受结果未知”的可见提示和待办核对入口，可能减少重复批准；尚未实现或试验。对照丢响应、旧generation和双端并发反例，重复操作不降或恢复投入增即否定。

[查看完整分析](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1390487251-root"></a>

## [DSH Model Fusion](../../plugins/aa2246740--dsh-model-fusion/INSIGHT.md)

[![GitHub ★ 74](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=74&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/aa2246740/dsh-model-fusion) [![npm 30d 1,749](https://img.shields.io/static/v1?label=npm+30d&message=1%2C749&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-fusion) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-fusion)

> **用途**：多模型开发者希望强模型保留理解/审查，把实施交给便宜Worker。

> **亮点**：[Q01](../../plugins/aa2246740--dsh-model-fusion/INSIGHT.md#research-q01) [Q01](../../plugins/aa2246740--dsh-model-fusion/INSIGHT.md#research-q01) 将原始要求、持续Worker和验收交接持久化。

> **思考**：[Q03](../../plugins/aa2246740--dsh-model-fusion/INSIGHT.md#research-q03) [Q03](../../plugins/aa2246740--dsh-model-fusion/INSIGHT.md#research-q03) 默认model-like不强制请求预算，shell与非Fusion写者仍依赖宿主边界。

> **建议**：[Q05](../../plugins/aa2246740--dsh-model-fusion/INSIGHT.md#research-q05) [Q05](../../plugins/aa2246740--dsh-model-fusion/INSIGHT.md#research-q05) 低价执行可能省费用，需独立质量/时延/账单对照。

[查看完整分析](../../plugins/aa2246740--dsh-model-fusion/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1408657362-root"></a>

## [DSH Multitask](../../plugins/senguk520--dsh-multitask/INSIGHT.md)

[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Senguk520/dsh-multitask) [![npm 30d 3,008](https://img.shields.io/static/v1?label=npm+30d&message=3%2C008&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-multitask) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-multitask)

> **用途**：需要分解多步开发任务的 DSH 用户，可用独立协调会话安排 worker 并验收结果。

> **亮点**：[Q01](../../plugins/senguk520--dsh-multitask/INSIGHT.md#research-q01) 与 [Q02](../../plugins/senguk520--dsh-multitask/INSIGHT.md#research-q02) 显示，插件将协调者窄工具面与多种 worker 组合，分离大批量执行和主会话。

> **思考**：[Q03](../../plugins/senguk520--dsh-multitask/INSIGHT.md#research-q03) 显示，审批转呈受 ask 策略限制，最小 worker 收窄失败可能保留工具，需实际验收而非相信模式名。

> **建议**：[Q04](../../plugins/senguk520--dsh-multitask/INSIGHT.md#research-q04) 比较总 token、等待和产物准确率，验证长工具输出任务的委派是否有净收益。若多次补上下文抵消收益，放弃假设。

[查看完整分析](../../plugins/senguk520--dsh-multitask/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1409845351-plugins-dsh-orchestrator2"></a>

## [DSH Orchestrator2](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2)

> **用途**：面向需要把需求、设计、开发、审查和人工测试串成可追溯任务包的软件负责人。合格交付是有验收证据且人工测试通过的软件版本，不能把多Agent输出或状态文件完成当交付。相对普通Agent加任务清单，它要求采用v2.1六区结构、冻结设计、预算台账和角色分工；简单修改可能得不偿失。

> **亮点**：将任务包、预算预登记、设计冻结和持久角色路由组合为可追溯协作流程，先绑定再启动减少路由竞争窗口。[Q03](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md#research-q03)

> **思考**：派工成功回执要求后台参数false，但角色工具明确拒绝false；同时旧目录同步的实际副作用与移除声明冲突，需先核对。[Q04](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md#research-q04)

> **建议**：未验证假设是把派工协议写成单一可执行状态契约，生成工具参数、成功回执及persona对应段，并在启动前做无副作用协议检查，能减少“回执要求工具拒绝参数”的交接失败。推导来自false参数冲突和旧目录同步漂移。最小验证固定最小任务包，在新旧API宿主mock和真实沙箱分别走begin→角色→end、失败与重启；比较人工修正次数、重复派工及完成率，若漂移仍需手工多处修改则否定单源收益。 [Q08](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/anglezhang-zhangjiao--dsh-orchestrator2--plugins-dsh-orchestrator2/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340244547-root"></a>

## [DSH Plugin Hub](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md)

[![GitHub ★ 506](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=506&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dshplugin/dsh-plugin-hub) [![npm 30d 52,334](https://img.shields.io/static/v1?label=npm+30d&message=52%2C334&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin)

> **用途**：DSH 用户可以从设置查找已知社区包，并核对实际版本、profile 和加载结果。

> **亮点**：[Q01](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md#research-q01) 将目录、变更队列和终态日志集中到设置入口。

> **思考**：[Q02](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md#research-q02) 普通目录安装分支的映射失败未拒绝，构建拦截也可能触发自动许可变更。

> **建议**：[Q04](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md#research-q04) 绑定精确目标与构建许可的短期安装计划，可能降低误装和意外放行。

[查看完整分析](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333375150-root"></a>

## [DSH Plugin Template](../../plugins/bugmaker2--dsh-plugin-template/INSIGHT.md)

[![GitHub ★ 103](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=103&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bugmaker2/dsh-plugin-template)

> **用途**：开发者开始编写双端插件。

> **亮点**：[Q01](../../plugins/bugmaker2--dsh-plugin-template/INSIGHT.md#research-q01) 提供可追踪的最小端到端骨架。

> **思考**：[Q03](../../plugins/bugmaker2--dsh-plugin-template/INSIGHT.md#research-q03) 无副作用示例尚未覆盖授权和长任务取消。

> **建议**：[Q05](../../plugins/bugmaker2--dsh-plugin-template/INSIGHT.md#research-q05) 可降低首个双端插件的接线时间。

[查看完整分析](../../plugins/bugmaker2--dsh-plugin-template/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1367503416-root"></a>

## [DSH PUA](../../plugins/michengai--dsh-pua/INSIGHT.md)

[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-pua) [![npm 30d 26,965](https://img.shields.io/static/v1?label=npm+30d&message=26%2C965&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-pua) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-pua)

> **用途**：DSH 用户修复可重现的小型回归，需要在模型反复尝试时核对是否真实满足已有检查并可随时停止。

> **亮点**：[Q01](../../plugins/michengai--dsh-pua/INSIGHT.md#research-q01) 与 [Q03](../../plugins/michengai--dsh-pua/INSIGHT.md#research-q03) 确认将继续、停止和验收反馈接进 DSH 会话，独立命令可以把部分人工重复检查转为明确进程结果。

> **思考**：[Q03](../../plugins/michengai--dsh-pua/INSIGHT.md#research-q03) 默认无验证时可由模型标记结束，标记只是文本匹配。有验证也只能覆盖该命令测试到的条件。[Q04](../../plugins/michengai--dsh-pua/INSIGHT.md#research-q04) 默认 0 轮限制表示不限轮数，取消不撤回此前改动。

> **建议**：[Q05](../../plugins/michengai--dsh-pua/INSIGHT.md#research-q05) 用固定负样本验收命令和小轮次上限，可能降低草率宣告完成的概率，需观察实际通过、拒绝和耗时。

[查看完整分析](../../plugins/michengai--dsh-pua/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335843541-root"></a>

## [DSH Python Env](../../plugins/angeloszou--dsh-python-env/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngelosZou/dsh-python-env) [![npm 30d 1,121](https://img.shields.io/static/v1?label=npm+30d&message=1%2C121&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-python-env) [![最新发布 2026-09-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-python-env)

> **用途**：目标用户是在DSH沙箱shell里遇到venv、临时目录或网络安装失败的开发者。合格结果是项目解释器能导入所需固定版本包，并可删除环境，不影响全局Python。简单替代是开发者在外部终端创建venv或使用uv；这里的增量是让Agent调用受控工具完成环境准备，而不是新的Python包管理器。

> **亮点**：将host侧venv/pip接入会话写权限、镜像回退和job状态，减少环境准备的人工交接；核心包管理来自Python。[Q03](../../plugins/angeloszou--dsh-python-env/INSIGHT.md#research-q03)

> **思考**：词法路径检查不等于进程隔离，第三方构建仍拥有host权限，符号链接与pip选项需独立检验。[Q04](../../plugins/angeloszou--dsh-python-env/INSIGHT.md#research-q04)

> **建议**：未验证假设是把允许包规格、完整真实路径和审批后的索引记录成安装计划，执行前显示目标与副作用，配合隔离构建，可保留自动配置便利而缩小host写入范围。推导来自词法guard和host pip的边界差距。最小验证使用常规wheel、源码构建包、符号链接及异常pip选项，对比当前与受限计划路线的拒绝准确性、完成率与额外人工；若合法任务阻塞而越界仍可发生，则否定该方案。 [Q08](../../plugins/angeloszou--dsh-python-env/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/angeloszou--dsh-python-env/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1222692871-dsh-rdd-goal-tree"></a>

## [DSH RDD Goal Tree](../../plugins/yaphethayate--coderdd--dsh-rdd-goal-tree/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YaphetHayate/codeRDD)

> **用途**：使用 codeRDD goal-tree 协作并在 DSH 中查看状态的规划者和 worker。

> **亮点**：[Q01](../../plugins/yaphethayate--coderdd--dsh-rdd-goal-tree/INSIGHT.md#research-q01) 与 [Q02](../../plugins/yaphethayate--coderdd--dsh-rdd-goal-tree/INSIGHT.md#research-q02) 在 DSH 提供角色视图和回调，不是执行引擎。

> **思考**：[Q03](../../plugins/yaphethayate--coderdd--dsh-rdd-goal-tree/INSIGHT.md#research-q03) 发送和 marker 不原子，持久化失败与跨进程并发不保证严格一次。

> **建议**：[Q05](../../plugins/yaphethayate--coderdd--dsh-rdd-goal-tree/INSIGHT.md#research-q05) 区分发送、消费与裁决状态，需评估竞态与维护负担。

[查看完整分析](../../plugins/yaphethayate--coderdd--dsh-rdd-goal-tree/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336998102-root"></a>

## [DSH Remote Web Gateway](../../plugins/summer1238--dsh-remote-web-gateway/INSIGHT.md)

[![GitHub ★ 167](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=167&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/summer1238/dsh-remote-web-gateway)

> **用途**：离开电脑后仍需看进度的用户可评估手机远程 Web。

> **亮点**：[Q01](../../plugins/summer1238--dsh-remote-web-gateway/INSIGHT.md#research-q01) 把设备授权和 DSH Web 转发接起来。

> **思考**：[Q03](../../plugins/summer1238--dsh-remote-web-gateway/INSIGHT.md#research-q03) 撤销记录与正在传输的连接生命周期不同。

> **建议**：[Q05](../../plugins/summer1238--dsh-remote-web-gateway/INSIGHT.md#research-q05) 测试撤销时按设备断开活跃连接。

[查看完整分析](../../plugins/summer1238--dsh-remote-web-gateway/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1339293057-root"></a>

## [DSH Sidenote](../../plugins/g-yixuan--dsh-sidenote/INSIGHT.md)

[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/g-yixuan/dsh-sidenote) [![npm 30d 6,840](https://img.shields.io/static/v1?label=npm+30d&message=6%2C840&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sidenote) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sidenote)

> **用途**：适合需要在 DSH 评审长方案时局部追问并把结论带回主线的人，见 [Q01](../../plugins/g-yixuan--dsh-sidenote/INSIGHT.md#research-q01)。

> **亮点**：把支线继承、原文批注和选择性回流接进同一评审流程，见 [Q01](../../plugins/g-yixuan--dsh-sidenote/INSIGHT.md#research-q01) 与 [Q02](../../plugins/g-yixuan--dsh-sidenote/INSIGHT.md#research-q02)。

> **思考**：侧聊有仅快照退路，等待提交失败也需回查宿主消息，见 [Q01](../../plugins/g-yixuan--dsh-sidenote/INSIGHT.md#research-q01) 与 [Q02](../../plugins/g-yixuan--dsh-sidenote/INSIGHT.md#research-q02)。

> **建议**：显示实际继承边界与最终回流内容，比较能否减少错引，见 [Q05](../../plugins/g-yixuan--dsh-sidenote/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/g-yixuan--dsh-sidenote/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-packages-dsh-skill-explorer"></a>

## [DSH Skill Explorer](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md)

[![GitHub ★ 10,353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 161,812](https://img.shields.io/static/v1?label=npm+30d&message=161%2C812&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer)

> **用途**：适合维护多个 DSH 工作区、要辨认同名 Skill 来自何处的开发者，见 [Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md#research-q01)。

> **亮点**：把工作区、来源优先级和可操作文件汇到同一个面板，减少逐目录核对。写入目标用重新扫描的路径约束，见 [Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md#research-q01) 和 [Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md#research-q02)。

> **思考**：隐藏提供者 Skill 后，宿主仍可能把它交给模型。预设内的 Skill 也可能未出现在面板中，见 [Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md#research-q02)。

> **建议**：在开关前后显示写入对象与生效范围，观察是否能减少把面板隐藏当成会话禁用，见 [Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334303719-root"></a>

## [DSH Skill Hub](../../plugins/cheshireez--dsh-skill-hub/INSIGHT.md)

[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cheshireez/dsh-skill-hub) [![npm 30d 8,875](https://img.shields.io/static/v1?label=npm+30d&message=8%2C875&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-hub) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-hub)

> **用途**：经常维护多套 Skill 的 DSH 用户可在设置和侧栏查看来源并管理安装。

> **亮点**：[Q01](../../plugins/cheshireez--dsh-skill-hub/INSIGHT.md#research-q01) 与 [Q02](../../plugins/cheshireez--dsh-skill-hub/INSIGHT.md#research-q02) 显示，来源、审核和回收被放在同一管理流程。

> **思考**：[Q02](../../plugins/cheshireez--dsh-skill-hub/INSIGHT.md#research-q02) 显示首次导入仍可能按移动 ref 下载，记录的 SHA 不必然证明字节；[Q03](../../plugins/cheshireez--dsh-skill-hub/INSIGHT.md#research-q03) 也显示阻断前可能已移走旧占位。

> **建议**：[Q04](../../plugins/cheshireez--dsh-skill-hub/INSIGHT.md#research-q04) 比较多版本管理的人工返工。若追溯与撤销耗时高于手工 Git，放弃假设。

[查看完整分析](../../plugins/cheshireez--dsh-skill-hub/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334830521-root"></a>

## [DSH Skills Manager](../../plugins/michengai--dsh-skills-manager/INSIGHT.md)

[![GitHub ★ 550](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=550&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-skills-manager) [![npm 30d 160,217](https://img.shields.io/static/v1?label=npm+30d&message=160%2C217&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager)

> **用途**：在多个 DSH 项目与预设维护技能的用户，可在设置中核对来源、调用范围和安装记录。见 [Q01](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q01)。

> **亮点**：把自定义预设纳入宿主的技能候选与启停策略，保留官方预设只读。批量变更支持固定目标、差异预览和逐项来源记录。见 [Q02](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q02)、[Q03](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q03)。

> **思考**：成功复制技能不保证来源记录已落盘或宿主已刷新。调用和写入还依赖当前宿主作用域及审批。见 [Q02](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q02)、[Q03](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q03)、[Q04](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q04)。

> **建议**：可把来源、文件差异、目标预设及宿主可见状态组成逐项核对清单，验证是否能减少选错目录或误调用。若仍有误操作或审核负担持续高于人工，则缩小自动化范围。见 [Q05](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/michengai--dsh-skills-manager/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425006726-root"></a>

## [DSH Subagent](../../plugins/1373700184--dsh-subagent/INSIGHT.md)

[![npm 30d 33](https://img.shields.io/static/v1?label=npm+30d&message=33&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-subagent) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-subagent)

> **用途**：DSH 会话需要把独立任务委派给已安装外部 CLI 的使用者。

> **亮点**：[Q01](../../plugins/1373700184--dsh-subagent/INSIGHT.md#research-q01) 将多个 CLI 作为宿主 provider；[Q02](../../plugins/1373700184--dsh-subagent/INSIGHT.md#research-q02) 加入模型回退和并发调度，效果尚未对照。

> **思考**：[Q03](../../plugins/1373700184--dsh-subagent/INSIGHT.md#research-q03) 默认绕过权限且文件系统错误时并发门控退化，不能把委派视作隔离执行。

> **建议**：[Q05](../../plugins/1373700184--dsh-subagent/INSIGHT.md#research-q05) 建议先显示实际后端和权限并确认，需检验误授权与疲劳。

[查看完整分析](../../plugins/1373700184--dsh-subagent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1367482095-root"></a>

## [DSH Super Code](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md)

[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ArtlexYoung/dsh-super-code) [![npm 30d 3,311](https://img.shields.io/static/v1?label=npm+30d&message=3%2C311&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-code) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-code)

> **用途**：有多步骤编码或需要多个专家的 DSH 用户；基线是单代理加人工任务管理。[Q01](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q01)

> **亮点**：把任务记忆、专家分工与版本绑定结果组织进编码流程。[Q01](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q01) [Q02](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q02)

> **思考**：reviewable 不证明代码正确或硬预算受控，严格删除保护也仅覆盖识别的工具命令。[Q02](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q02) [Q03](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q03)

> **建议**：未验证假设：成员自报与独立验证结果并列可降低误接收，须对照现有 binding 和 checks 字段。[Q05](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-packages-dsh-task-board"></a>

## [DSH Task Board](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md)

[![GitHub ★ 10,353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 132,402](https://img.shields.io/static/v1?label=npm+30d&message=132%2C402&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board)

> **用途**：适合要反复做仓库检查、希望用同一张卡管理会话与运行记录的 DSH 用户，见 [Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q01)。

> **亮点**：把工作区、会话执行与定时记录归在一张卡，并让宿主继续运行任务，见 [Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q01) 和 [Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q02)。

> **思考**：子卡可能只继承父会话结果。停机触发点也会跳过，应分别核对运行和计划记录，见 [Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q02) 与 [Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q03)。

> **建议**：在子卡状态旁展示独立运行和继承结论的来源，盲评能否减少误验收，见 [Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333732838-root"></a>

## [DSH Taskboard](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md)

[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shengsheng90/DSH-taskboard) [![npm 30d 1,230](https://img.shields.io/static/v1?label=npm+30d&message=1%2C230&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard)

> **用途**：需要跨会话管理本地项目的 DSH 操作者，可跟踪任务要求、claim与人工review，成果仍需独立验收。

> **亮点**：[Q01](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q01) 把持久任务、owner认领、宿主原生会话和人工review接在一起，比聊天便签多了可拒绝的竞争与版本边界。 [Q02](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q02) 仍保留宿主执行归属，工作流仅指导而非自动引擎。

> **思考**：[Q02](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q02) human actor是入口信任约定，不能约束已获CLI/数据库能力的进程；Goal complete与非空验证文本不证明成果合格，SQLite事务也不包外部副作用。

> **建议**：[Q04](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q04) 提出版本、产物和真实验证记录绑定的验收包，检验能否减少误接受；相对现有human review新增可核材料，而非另设状态标签。

[查看完整分析](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334866577-root"></a>

## [DSH Taskboard](../../plugins/cloader--dsh-taskboard/INSIGHT.md)

[![GitHub ★ 78](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=78&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cloader/dsh-taskboard) [![npm 30d 6,697](https://img.shields.io/static/v1?label=npm+30d&message=6%2C697&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-taskboard) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-taskboard)

> **用途**：需要把DSH多项目任务、执行记录与人验收集中管理的个人或可信协作环境。

> **亮点**：[Q01](../../plugins/cloader--dsh-taskboard/INSIGHT.md#research-q01) 将Agent提交与人完成分开；[Q02](../../plugins/cloader--dsh-taskboard/INSIGHT.md#research-q02) 将持久队列和执行生命周期接到同一台账。

> **思考**：[Q03](../../plugins/cloader--dsh-taskboard/INSIGHT.md#research-q03) worktree靠路径纪律，降级可在主目录运行；[Q02](../../plugins/cloader--dsh-taskboard/INSIGHT.md#research-q02) 停插件不等于停止Agent。

> **建议**：[Q05](../../plugins/cloader--dsh-taskboard/INSIGHT.md#research-q05) 强制隔离任务降级前确认是否减少误写需对照等待代价。

[查看完整分析](../../plugins/cloader--dsh-taskboard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1366979533-root"></a>

## [DSH Tool Management](../../plugins/ouli-1242--dsh-plugin-tool-management/INSIGHT.md)

[![GitHub ★ 50](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=50&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ouli-1242/dsh-plugin-tool-management) [![npm 30d 8,802](https://img.shields.io/static/v1?label=npm+30d&message=8%2C802&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-tool-management) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-tool-management)

> **用途**：在 DSH 同时运行多个任务的开发者需要让每个任务只接触相关的管理工具，并能核对恢复工具的作用域。[Q01](../../plugins/ouli-1242--dsh-plugin-tool-management/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/ouli-1242--dsh-plugin-tool-management/INSIGHT.md#research-q01) [Q02](../../plugins/ouli-1242--dsh-plugin-tool-management/INSIGHT.md#research-q02) 让模型只在当前需要时自助发现并恢复本插件工具，作用域、审计与界面共用状态。相对全量工具，更容易减少无关 schema。

> **思考**：[Q03](../../plugins/ouli-1242--dsh-plugin-tool-management/INSIGHT.md#research-q03) 自助恢复表示隐藏通常可逆。执行约束依赖宿主 guard，HTTP 令牌和工具确认分别约束不同路径，宿主鉴权退化后回环不足以区分本机进程。

> **建议**：[Q05](../../plugins/ouli-1242--dsh-plugin-tool-management/INSIGHT.md#research-q05) 分开呈现可自助恢复与必须拒绝的能力，并显示真实作用域和执行证据，可能降低配置误判。

[查看完整分析](../../plugins/ouli-1242--dsh-plugin-tool-management/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335954169-root"></a>

## [DSH Toolbox UI](../../plugins/imzl-zl--dsh-toolbox-ui/INSIGHT.md)

[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Imzl-zl/dsh-toolbox-ui) [![npm 30d 4,831](https://img.shields.io/static/v1?label=npm+30d&message=4%2C831&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-toolbox-ui) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-toolbox-ui)

> **用途**：管理多个 DSH 工作区的用户可在会话旁核对 MCP、技能和工具加载。

> **亮点**：[Q01](../../plugins/imzl-zl--dsh-toolbox-ui/INSIGHT.md#research-q01) 工作区工具页结合宿主注册表和已跟踪会话，帮助定位不同范围的已注册工具。[Q02](../../plugins/imzl-zl--dsh-toolbox-ui/INSIGHT.md#research-q02) 按 Agent 延迟提供 schema。

> **思考**：[Q02](../../plugins/imzl-zl--dsh-toolbox-ui/INSIGHT.md#research-q02) 工具页并集不能代表当前 Agent 的准入，读取视图失败可退回宿主全量呈现。[Q03](../../plugins/imzl-zl--dsh-toolbox-ui/INSIGHT.md#research-q03) reveal 会把有效配置值送到浏览器。

> **建议**：[Q04](../../plugins/imzl-zl--dsh-toolbox-ui/INSIGHT.md#research-q04) 把工作区并集和当前 Agent 准入分别标注，可能减少范围误判。

[查看完整分析](../../plugins/imzl-zl--dsh-toolbox-ui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333100390-root"></a>

## [DSH Turn Rewind](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md)

[![GitHub ★ 138](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=138&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-turn-rewind) [![npm 30d 4,502](https://img.shields.io/static/v1?label=npm+30d&message=4%2C502&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind)

> **用途**：适合在一个工作目录中连续让Agent改文件、又需要撤回某次请求的开发者。合格结果是恢复该消息前被管理路径的内容，并可新建截至前一轮的会话；原会话保留。简单办法是事前手工提交或复制目录，再分别重开对话。作者用消息按钮减少两类状态人工对齐，但这不等于数据库、外部服务或忽略文件也被恢复。

> **亮点**：依据 [Q02](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md#research-q02) 和 [Q03](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md#research-q03)，它把消息锚点、短期会话计划、写前救援与恢复后校验串成持久生命周期。相对手工提交再分别重开对话，增量是两个状态的显式编排以及路径级防过期检查；普通目录CAS与Git对象复用均为既有技术的组合，不宣称原创。该贡献成立于所需路径确实被捕获、存储可用且用户能核对计划时，不能外推成环境级事务回滚或保证节时。

> **思考**：[Q04](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md#research-q04)指出检查点管理集合小于整个工作环境，超限跳过文案与安全契约不一致，外部状态和忽略路径也不会回退。救援和journal是可核查保护而非绝对保证，恢复与回滚可能同时失败；试用应先检查覆盖清单和独立备份，否则“回到请求前”的心理模型会超过机制承诺。

> **建议**：[Q08](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md#research-q08)提出未验证的检查点覆盖差集契约，先将任务涉及路径与已管理、跳过和排除项对照，再允许用户明确选择恢复。它由超大文件跳过及非托管路径限制推导，相对现有变更预览增加的是“本次不能恢复什么”。在同目录放入普通、忽略及超大文件，对照两种预览下用户识别未恢复路径的正确率和操作时间；若误判率不下降或额外负担抵消收益，则否定此设计价值，不计为当前插件能力。

[查看完整分析](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333370288-root"></a>

## [DSH Verification Receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 905](https://img.shields.io/static/v1?label=npm+30d&message=905&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verification-receipt) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verification-receipt)

> **用途**：希望快速回看 Agent 轮次验证信号的开发者或审查者。

> **亮点**：[Q02](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q02) 将验证信号聚合为紧凑回执并保持主流程非等待写入。

> **思考**：[Q03](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q03) 状态不是独立验证，hash 不证明完整或不可篡改。

> **建议**：[Q05](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q05) 对照已有 unresolved 状态提供匿名回溯线索，须测误放行与隐私。

[查看完整分析](../../plugins/030611--dsh-verification-receipt/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333446374-root"></a>

## [DSH Vision Router](../../plugins/ysr666--dsh-vision-router/INSIGHT.md)

[![GitHub ★ 1,249](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C249&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ysr666/dsh-vision-router) [![npm 30d 60,243](https://img.shields.io/static/v1?label=npm+30d&message=60%2C243&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router)

> **用途**：开发者在 DSH 中审查截图或对照页面原型，希望保留当前对话并得到可人工复核的差分。[Q01](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q01)

> **亮点**：在同一 DSH 会话组合可追踪的附件引用、视觉问答和独立像素差分产物，文本模型可继续完成多步核查。[Q01](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q01)

> **思考**：默认回退可以把图片和问题发送给远端，任务超时或取消也不足以判断远端是否已处理。仅本地视觉不覆盖聊天模型和外部代理链。[Q02](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q02) [Q03](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q03)

> **建议**：待验证的方向是在正常结果旁给出脱敏的发送与回退记录，并把人工标注的结果作为差分验收条件，以便检查误发、误判和核对负担。[Q05](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/ysr666--dsh-vision-router/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333100071-root"></a>

## [DSH Vision Toolkit](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md)

[![GitHub ★ 942](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=942&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 16,145](https://img.shields.io/static/v1?label=npm+30d&message=16%2C145&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

> **用途**：需要从非敏感截图核对位置、文字或界面变化的 DSH 文本模型用户。

> **亮点**：按 Agent 激活视觉工具，把检查截图到返回标注接入会话，Python 准备可以与首次发现并行。[Q01](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q01) [Q02](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q02)

> **思考**：工具可发现时运行时可能仍在准备。远端定位的坐标即使在图像范围内也可能标错对象；Desktop 转发例外依赖宿主认证。[Q01](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q01) [Q02](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q02) [Q03](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q03)

> **建议**：让下游在消费坐标前比对原图和当前画面指纹，可能减少使用过期定位结果。[Q04](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1342024605-root"></a>

## [DSH with ChatGPT](../../plugins/beforewave--dsh-with-chatgpt/INSIGHT.md)

[![GitHub ★ 63](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=63&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/BeforeWave/dsh-with-chatgpt) [![npm 30d 949](https://img.shields.io/static/v1?label=npm+30d&message=949&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@beforewave/dsh-with-chatgpt) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@beforewave/dsh-with-chatgpt)

> **用途**：作者面向希望从网页分析/小改动切到本地DSH持续执行并回查结果的开发者。见 [Q01](../../plugins/beforewave--dsh-with-chatgpt/INSIGHT.md#research-q01)。

> **亮点**：DSH会话/工作区适配、状态/历史面板及本地MCP生命周期是集成贡献，远程认证/工程工具核心在Agent Helm。见 [Q01](../../plugins/beforewave--dsh-with-chatgpt/INSIGHT.md#research-q01)、[Q03](../../plugins/beforewave--dsh-with-chatgpt/INSIGHT.md#research-q03)。

> **思考**：approval:false与Core源码边界使远程写授权尚未闭环；accepted/idle/cancelled不是独立任务验收或副作用回滚，省DSH token不能替代总成本对照。见 [Q02](../../plugins/beforewave--dsh-with-chatgpt/INSIGHT.md#research-q02)、[Q03](../../plugins/beforewave--dsh-with-chatgpt/INSIGHT.md#research-q03)。

> **建议**：验证稳定操作id的跨端委派回执能否减少断线重复与结果误判；Core已有等效机制即推翻新增必要性。见 [Q04](../../plugins/beforewave--dsh-with-chatgpt/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/beforewave--dsh-with-chatgpt/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336092482-root"></a>

## [DSH Worktable](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md)

[![GitHub ★ 823](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=823&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-worktable)

> **用途**：多项目并行的 DSH 用户；基线是宿主原会话界面和外部文件工具。[Q01](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md#research-q01)

> **亮点**：把项目布局、会话与文件/终端窗格组织到工作区。[Q01](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md#research-q01)

> **思考**：认证保护路由而非操作系统沙箱；终端按宿主进程权限执行。[Q03](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md#research-q03)

> **建议**：未验证假设：显式布局清单和恢复预览可改善跨浏览器来源迁移，须对照现有持久化及人工备份。[Q05](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/aisland-sjl--dsh-worktable/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1364387461-packages-redteam-bundle"></a>

## [DSH 红队模式](../../plugins/jueze-2019--dsh-redteam-mode--packages-redteam-bundle/INSIGHT.md)

[![GitHub ★ 147](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=147&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jueze-2019/dsh-redteam-mode) [![npm 30d 4,478](https://img.shields.io/static/v1?label=npm+30d&message=4%2C478&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-redteam-mode) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-redteam-mode)

> **用途**：授权安全演练团队可评估会话内的事实与报告组织。

> **亮点**：[Q01](../../plugins/jueze-2019--dsh-redteam-mode--packages-redteam-bundle/INSIGHT.md#research-q01) 关联角色、项目和发现记录。

> **思考**：[Q03](../../plugins/jueze-2019--dsh-redteam-mode--packages-redteam-bundle/INSIGHT.md#research-q03) 范围结果不是硬授权，未解析也可能返回 ok。

> **建议**：[Q05](../../plugins/jueze-2019--dsh-redteam-mode--packages-redteam-bundle/INSIGHT.md#research-q05) 比较明确标记未知状态的误判率。

[查看完整分析](../../plugins/jueze-2019--dsh-redteam-mode--packages-redteam-bundle/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1332243516-root"></a>

## [dsh_workflow](../../plugins/omdsh-dev--dsh_workflow/INSIGHT.md)

[![GitHub ★ 153](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=153&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh_workflow)

> **用途**：团队重复执行可检查的取证、复核或交付流程。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh_workflow/INSIGHT.md#research-q01) 将流程定义、运行图与产物独立保存，支持按名称复用和回查。

> **思考**：[Q02](../../plugins/omdsh-dev--dsh_workflow/INSIGHT.md#research-q02) 取消是协作式，缓存命中不保证外部状态一致或副作用幂等。

> **建议**：[Q03](../../plugins/omdsh-dev--dsh_workflow/INSIGHT.md#research-q03) 将可核对的外部状态纳入恢复验收，比较错误复用与执行开销。

[查看完整分析](../../plugins/omdsh-dev--dsh_workflow/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344715270-root"></a>

## [dsh-a11y-scan](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md)

[![npm 30d 83](https://img.shields.io/static/v1?label=npm+30d&message=83&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-a11y-scan) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-a11y-scan)

> **用途**：前端开发者把可访问性自动检查接入工具流程，仍需人工确认真实任务与规则覆盖。

> **亮点**：把目标发现、axe错误与命中、修复线索和人工复核接入结构化DSH工具，贡献在编排而非新检测算法。详见[Q01](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md#research-q01)与[Q02](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md#research-q02)。

> **思考**：静态服务只作词法目录检查再原生读文件，未核物理路径；浏览器加载本地HTML仍可有网络/脚本副作用，confirmUrl不是授权收据。详见[Q02](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md#research-q02)。

> **建议**：可探讨扫描能力清单，绑定资源realpath、引擎/规则和网络源，静态服务只暴露计划文件；动态资源兼容成本未验证。详见[Q05](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-a11y-scan/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333633428-root"></a>

## [DSH-action](../../plugins/lixiaoyiao--dsh-action/INSIGHT.md)

[![GitHub ★ 61](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Lixiaoyiao/DSH-action)

> **用途**：DSH-action交付GitHub Action，适合已有GitHub仓库、愿意维护可信工作流和验证命令的维护者，让评论或定时/手动任务调用DeepSeek Harness，输出评审、诊断、答案或受控代码交付。它不是安装到DSH桌面设置页的原生插件。合格结果是依据绑定源码提供可回查回答，写任务还需验证通过、明确分支/PR或未决副作用；一条机器人回复不代表代码交付完成。

> **亮点**：[Q01](../../plugins/lixiaoyiao--dsh-action/INSIGHT.md#research-q01)至[Q03](../../plugins/lixiaoyiao--dsh-action/INSIGHT.md#research-q03)支持将DSH真实工具循环与GitHub可信Controller、验证及单写后置核对组合；增量是运行/发布责任衔接，非仅新增评论入口。已有Action与事务模式构成基线，未独立证明人审或成本收益。

> **思考**：[Q03](../../plugins/lixiaoyiao--dsh-action/INSIGHT.md#research-q03)、[Q04](../../plugins/lixiaoyiao--dsh-action/INSIGHT.md#research-q04)表明Controller的验证/延迟写入保证不能覆盖自带凭证MCP，worker网络/RW是共享能力；失败也可能已有分支或possible/confirmed外部效果。必须按实际执行方核对，不能只看回复或Actions颜色。

> **建议**：[Q06](../../plugins/lixiaoyiao--dsh-action/INSIGHT.md#research-q06)提出未验证的主张→执行方/权限面→验证指纹→效果receipt交付包；用丢响应、MCP外写等对照人审误判和成本，若只增加日志负担就放弃，不计当前贡献。

[查看完整分析](../../plugins/lixiaoyiao--dsh-action/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1326938666-root"></a>

## [dsh-advisor](../../plugins/omdsh-dev--dsh-advisor/INSIGHT.md)

[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-advisor) [![npm 30d 5,247](https://img.shields.io/static/v1?label=npm+30d&message=5%2C247&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-advisor) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-advisor)

> **用途**：监督多轮 DSH 工作的开发者，可以观察评阅模型对公开会话的建议。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-advisor/INSIGHT.md#research-q01) 将独立评阅和按严重度回送接入会话，同时保留主代理审批流程。

> **思考**：[Q02](../../plugins/omdsh-dev--dsh-advisor/INSIGHT.md#research-q02) 的变化段进入配置模型，输出短不代表费用低，失败和积压也可让一些轮次没有建议。

> **建议**：[Q03](../../plugins/omdsh-dev--dsh-advisor/INSIGHT.md#research-q03) 建议尝试正文筛除和事件范围回执，比较召回、外发标记和干预频率。

[查看完整分析](../../plugins/omdsh-dev--dsh-advisor/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1339101586-root"></a>

## [dsh-agy-link](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md)

[![GitHub ★ 171](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=171&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/amlyczz/dsh-agy-link) [![npm 30d 19,331](https://img.shields.io/static/v1?label=npm+30d&message=19%2C331&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agy-link) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agy-link)

> **用途**：已有 agy 环境且反复在 DSH 会话使用对应模型的开发者，可以在同一会话选择模型、检查工具反馈并切换账号。

> **亮点**：[Q01](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q01) 的流式适配将 CLI 工具活动接到 DSH 会话，并复用记录支持工具续接。[Q02](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q02) 看到按账号探测并刷新的目录，在存在有效账号目录时能减少混入其他账号的模型。上游模型和服务资格仍由 agy 提供。

> **思考**：[Q03](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q03) 的导入成功与平台凭据写回可能分离，[Q04](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q04) 的本地文件端点可按绝对路径查找。结合 [Q05](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q05) 的默认跳过权限确认，现有证据只支持隔离核查，不足以在常用 profile 导入凭据。

> **建议**：[Q02](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q02) 提出标记模型目录来源与探测阶段，并将选择时的账号和执行账号绑定到可核对的记录。比较冷切换误选率和额外等待后再决定是否显示或限制备用目录。

[查看完整分析](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425045401-root"></a>

## [dsh-ai-armor](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md)



> **用途**：希望在 AI 改码后按事故类型调用定向诊断工具的开发者可用它一次安装注册 Git 回归定位、堆栈解码、配置校验、跨平台 shell 转义和 SQL 静态审计工具；合格结果是输出可回指提交、堆栈、配置或 SQL 位置，并经项目测试或人工复核。详见[Q01](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md#research-q01)。

> **亮点**：将五个既有子插件统一装载，降低发现与安装入口数量，但没有形成跨工具联合诊断机制。它相对“分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md#research-q03)。

> **思考**：其中 bisect 需要执行复现脚本并切换 Git 状态，不能把整包概括为完全不执行代码或无副作用。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md#research-q04)。

> **建议**：未来可探索：可按场景延迟注册工具，并把 bisect 固定在临时 worktree 与显式命令预览中，降低误选与仓库副作用。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1219876705-plugin"></a>

## [dsh-aiignore](../../plugins/wjddidi-1--ai-context-doctor--plugin/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WJDdidi-1/ai-context-doctor) [![npm 30d 9,990](https://img.shields.io/static/v1?label=npm+30d&message=9%2C990&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-aiignore) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-aiignore)

> **用途**：希望减少无关文件进入 Agent 上下文的 DSH 用户。

> **亮点**：[Q01](../../plugins/wjddidi-1--ai-context-doctor--plugin/INSIGHT.md#research-q01) 与 [Q02](../../plugins/wjddidi-1--ai-context-doctor--plugin/INSIGHT.md#research-q02) 将扫描器结果接到 DSH 守卫和面板，不声称扫描器算法为本组件原创。

> **思考**：[Q02](../../plugins/wjddidi-1--ai-context-doctor--plugin/INSIGHT.md#research-q02) 只拦特定 read 路径且异常放行；[Q03](../../plugins/wjddidi-1--ai-context-doctor--plugin/INSIGHT.md#research-q03) 撤销可能覆盖期间编辑。

> **建议**：[Q04](../../plugins/wjddidi-1--ai-context-doctor--plugin/INSIGHT.md#research-q04) 假设撤销前比较文件摘要可减少误覆盖，尚未验证。

[查看完整分析](../../plugins/wjddidi-1--ai-context-doctor--plugin/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1333482618-root"></a>

## [dsh-auto-review](../../plugins/perrylink--dsh-auto-review/INSIGHT.md)

[![GitHub ★ 245](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=245&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-auto-review) [![npm 30d 6,911](https://img.shields.io/static/v1?label=npm+30d&message=6%2C911&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-auto-review) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-auto-review)

> **用途**：用户希望对部分需要审批的操作增加自动风险判断。

> **亮点**：[Q01](../../plugins/perrylink--dsh-auto-review/INSIGHT.md#research-q01) 引入第二模型审核入口，[Q02](../../plugins/perrylink--dsh-auto-review/INSIGHT.md#research-q02) 按策略连接审核与后续审批。

> **思考**：[Q03](../../plugins/perrylink--dsh-auto-review/INSIGHT.md#research-q03) 审核失败默认拒绝，非默认 allow-once 可放行一次，delegate 仅转交；取消为 cancelled，脱敏和结构校验不证明零漏判。

> **建议**：[Q05](../../plugins/perrylink--dsh-auto-review/INSIGHT.md#research-q05) 假设合成样例分层评测可帮助用户选择人工策略；尚未验证。

[查看完整分析](../../plugins/perrylink--dsh-auto-review/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336185734-root"></a>

## [dsh-auto-reviewer](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AntaresCorn/dsh-auto-reviewer)

> **用途**：希望减少重复审批提示的开发者可研究单次自动裁决，但合格结果必须保留具体操作的用户授权。[Q01](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q01)

> **亮点**：为DSH组合预设、逐次审批与可读通知，提供规则到LLM再到人工的路由；价值在减少打断的机制，未证明与任何官方产品保障等价。[Q01](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q01) [Q02](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q02)

> **思考**：最近用户文本命中英语肯定词就标用户确认，没有绑定当前操作；参数缺失仍可能因未命中风险规则走默认自动放行。加载还会改宿主客户端文件，均需独立核查。[Q03](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q03) [Q04](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q04)

> **建议**：可用绑定工具、参数、工作区和期限的授权凭据，未知操作转人工；以无副作用桩检验旧确认和目标变更，若碰撞或大量误阻塞则否定。未实现。[Q05](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/antarescorn--dsh-auto-reviewer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1424249299-host"></a>

## [dsh-baton-host](../../plugins/jialaoliu--dsh-baton--host/INSIGHT.md)

[![GitHub ★ 216](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=216&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/JialaoLiu/dsh-baton) [![npm 30d 8,357](https://img.shields.io/static/v1?label=npm+30d&message=8%2C357&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-baton-host) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-baton-host)

> **用途**：在使用 Claude Code 或 Codex 的同时需要让 DSH 在可见工作区执行独立任务的开发者，可将任务绑定到明确会话。

> **亮点**：它把外部任务与 DSH 会话中的 requestId、run 和可回读历史关联。Team 开关使用宿主现有服务，可在送入第一条消息前配置该会话。[Q01](../../plugins/jialaoliu--dsh-baton--host/INSIGHT.md#research-q01) [Q02](../../plugins/jialaoliu--dsh-baton--host/INSIGHT.md#research-q02) 客户端在具备 BEFORE 槽的宿主上保留普通消息原渲染器，仅加来源提示。[Q05](../../plugins/jialaoliu--dsh-baton--host/INSIGHT.md#research-q05)

> **思考**：活动查询持续失败时，回执可以是 completed 并附 error。会话级取消可能仍忙，启用插件默认还会改外端 MCP 注册配置。[Q02](../../plugins/jialaoliu--dsh-baton--host/INSIGHT.md#research-q02) [Q03](../../plugins/jialaoliu--dsh-baton--host/INSIGHT.md#research-q03) steering 和旧宿主仍包装渲染器，找不到 Inner 时包装返回空，来源标签也仅来自请求元数据。[Q05](../../plugins/jialaoliu--dsh-baton--host/INSIGHT.md#research-q05)

> **建议**：单列未知静止状态，并把项目验收与 run 终态分开记录，可能降低过早复用结果的概率。该假设可用固定故障轨迹对照。[Q04](../../plugins/jialaoliu--dsh-baton--host/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/jialaoliu--dsh-baton--host/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334305197-root"></a>

## [dsh-better-edit](../../plugins/rianico--dsh-better-edit/INSIGHT.md)

[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Rianico/dsh-better-edit) [![npm 30d 3,502](https://img.shields.io/static/v1?label=npm+30d&message=3%2C502&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-edit) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-edit)

> **用途**：反复让代理修改代码的 DSH 用户，可在测试仓库验证目标范围和最终 diff。

> **亮点**：[Q01](../../plugins/rianico--dsh-better-edit/INSIGHT.md#research-q01) 将上游内容锚点接入 DSH 文件策略，代理可提交短范围引用并回查 diff。

> **思考**：[Q02](../../plugins/rianico--dsh-better-edit/INSIGHT.md#research-q02) 规范化不保留 ASCII 空白语义，[Q03](../../plugins/rianico--dsh-better-edit/INSIGHT.md#research-q03) 撤销数据库失败也可能已经写过文件。

> **建议**：[Q04](../../plugins/rianico--dsh-better-edit/INSIGHT.md#research-q04) 为语义敏感的空白保留原字节核对，可能降低错误接受，同时保留常见格式化容忍。

[查看完整分析](../../plugins/rianico--dsh-better-edit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1420110365-root"></a>

## [dsh-block-ptc](../../plugins/mengwex--dsh-block-ptc/INSIGHT.md)

[![GitHub ★ 102](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=102&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mengwEX/dsh-block-ptc) [![npm 30d 1,170](https://img.shields.io/static/v1?label=npm+30d&message=1%2C170&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-block-ptc) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-block-ptc)

> **用途**：多子任务编码会话可用块ID标记工作并主动压缩；合格结果是后续仍正确遵循约束。[Q01](../../plugins/mengwex--dsh-block-ptc/INSIGHT.md#research-q01)

> **亮点**：块协议把语义工作单元、工具配对与可恢复会话替换连接起来，避免另设摘要服务；其增量是调度与边界组织，非新PTC执行器。[Q01](../../plugins/mengwex--dsh-block-ptc/INSIGHT.md#research-q01) [Q02](../../plugins/mengwex--dsh-block-ptc/INSIGHT.md#research-q02)

> **思考**：目标块的首末连续区间也会覆盖交错块；content非空并不能证明跨块约束被摘要保留，历史可见不等于模型当前输入无损。[Q02](../../plugins/mengwex--dsh-block-ptc/INSIGHT.md#research-q02)

> **建议**：未验证假设是提交前给模型展示区间内继承ID与待保留约束，减少交错任务漏记；若同任务遗漏不降或总负担增大，就放弃该预览设计。[Q04](../../plugins/mengwex--dsh-block-ptc/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/mengwex--dsh-block-ptc/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1386463441-root"></a>

## [dsh-cache-bricks](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md)



> **用途**：维护者排查长会话的缓存变化与重试，需要把usage和请求证据关联到对话位置；目标是正确诊断，不是只追求绿色。详见[Q01](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md#research-q01)。

> **亮点**：把attempt级请求、缓存指标和对话位置组织成可视诊断流程，保留重试和缺字段区别；增量是观察证据与阅读操作的组合，不会自动优化缓存。详见[Q01](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md#research-q01)。

> **思考**：缓存颜色不能独立解释原因，公式依赖宿主分桶口径；记录会淘汰且敏感blob需要明确访问边界，历史重建也不等于原始请求完整恢复。详见[Q03](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md#research-q03)。

> **建议**：可探讨在颜色旁显式表达attempt/估算及证据完整性，并要求归因回指可比请求；先用缺字段和淘汰样例比较误归因与操作时间，当前未验证。详见[Q06](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340230123-root"></a>

## [dsh-cad](../../plugins/lau-mars--dsh-cad/INSIGHT.md)

[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LAU-MARS/dsh-cad) [![npm 30d 7,499](https://img.shields.io/static/v1?label=npm+30d&message=7%2C499&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cad) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cad)

> **用途**：面向需要在 DSH 对话中查看小型 CAD 零件的工程师。

> **亮点**：[Q01](../../plugins/lau-mars--dsh-cad/INSIGHT.md#research-q01) 把场景和任务留在同一次会话。[Q02](../../plugins/lau-mars--dsh-cad/INSIGHT.md#research-q02) 分开处理工具结果和浏览器路由。

> **思考**：[Q03](../../plugins/lau-mars--dsh-cad/INSIGHT.md#research-q03) 的 Node 读取接受绝对路径，Python 脚本从宿主启动进程。使用者需独立核工具权限和部署隔离。

> **建议**：[Q04](../../plugins/lau-mars--dsh-cad/INSIGHT.md#research-q04) 用已知几何和损坏样本对照，若错件或人工复核增加，保留原工具。

[查看完整分析](../../plugins/lau-mars--dsh-cad/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1356896576-dsh-capmap-viz"></a>

## [dsh-capmap-viz](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1741505640/capmap-skills) [![npm 30d 640](https://img.shields.io/static/v1?label=npm+30d&message=640&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz)

> **用途**：面向已经用 CapMap 结构化文档维护能力、主题和依赖的项目成员。输入是 docs root 下的 YAML/Markdown；合格结果是图节点、边、状态颜色、能力面板和派生查询与文件内容一致，工作区切换不串状态，变更后 revision 更新。简单替代是目录浏览、Markdown 搜索或通用图工具。

> **亮点**：相对 Markdown 搜索，它把同一 CapMap 规范直接转为可交互图、状态描边和项目级派生问题，并能在文档变化后刷新。核心增量是领域文档模型与宿主侧栏的结合；d3-force 和 YAML 解析属于成熟组件，图形本身不证明文档代表真实实现。 参见[Q03](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q03)。

> **思考**：关键前提是文档持续、准确且有明确来源。解析成功只能证明格式满足规则，不能证明能力已实现、验证门已通过或依赖仍有效；图的视觉权威感可能放大陈旧文档。大图的布局稳定性、可访问性、watch 风暴和多 workspace 内存也未验证。 参见[Q04](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q04)。

> **建议**：可让每个能力/关系附 Git blob、代码/测试证据、负责人和 checked_at，把节点状态分成‘声明／实现／验证／过期’，并让 validation gate 只基于有效证据。它可能把漂亮图升级为可审计决策图，但会增加维护字段与证据采集成本。 参见[Q08](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1377512288-root"></a>

## [dsh-claude-style](../../plugins/nwflower--dsh-claude-style/INSIGHT.md)

[![GitHub ★ 541](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=541&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nwflower/dsh-claude-style) [![npm 30d 44,941](https://img.shields.io/static/v1?label=npm+30d&message=44%2C941&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-style) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-style)

> **用途**：经常回看长会话的 DSH Web 用户需要尽快找到最终回答，也需要在出错时能展开关键过程。[Q01](../../plugins/nwflower--dsh-claude-style/INSIGHT.md#research-q01)

> **亮点**：用一套 Web 主题把过程组收纳、用户消息折叠和长对话布局调整接入同一界面。过程组已结束且有后续内容接续才自动收拢，原生结构仍承担实际的消息呈现。[Q01](../../plugins/nwflower--dsh-claude-style/INSIGHT.md#research-q01) [Q02](../../plugins/nwflower--dsh-claude-style/INSIGHT.md#research-q02)

> **思考**：权限预设直接调用宿主命令，归档删除可以递归移除会话目录。Sodium 也会改写宿主样式，遇到共同写入时无法保证仅靠关闭开关恢复。[Q03](../../plugins/nwflower--dsh-claude-style/INSIGHT.md#research-q03) [Q02](../../plugins/nwflower--dsh-claude-style/INSIGHT.md#research-q02)

> **建议**：待验证方向是让离屏排版与选择器改写分别通过性能与恢复验收。如果只保留前者也能减少长会话热切换的布局耗时，就可以减少直接改写宿主样式的场景。[Q05](../../plugins/nwflower--dsh-claude-style/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/nwflower--dsh-claude-style/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333936445-root"></a>

## [DSH-Code](../../plugins/unlinearity--dsh-code/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/UNLINEARITY/dsh-code) [![npm 30d 1,255](https://img.shields.io/static/v1?label=npm+30d&message=1%2C255&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-code) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-code)

> **用途**：DSH-Code2.1.0是MIT的DSH原生终端bundle，同时提供deepseek/dsh-code启动器；Node^22.19或>=24，包依赖/peer大量固定DSH0.2.1-rc.4服务及Ink/React。CLI启动器检查profile已挂本包和交互TTY，再spawn已安装DSH并继承stdio/退出状态，未安装Host/未挂profile/非TTY会拒绝，不是开箱独立模型循环。

> **亮点**：[Q02](../../plugins/unlinearity--dsh-code/INSIGHT.md#research-q02)终端输入/事件接线；[Q03](../../plugins/unlinearity--dsh-code/INSIGHT.md#research-q03)队列与生命周期处理；[Q05](../../plugins/unlinearity--dsh-code/INSIGHT.md#research-q05)版本guard与真实更新整合。

> **思考**：[Q03](../../plugins/unlinearity--dsh-code/INSIGHT.md#research-q03)退出0仍可能flush失败、取消保留队列；[Q04](../../plugins/unlinearity--dsh-code/INSIGHT.md#research-q04)隔离继承Host；[Q05](../../plugins/unlinearity--dsh-code/INSIGHT.md#research-q05)升级/依赖修复非事务。

> **建议**：[Q06](../../plugins/unlinearity--dsh-code/INSIGHT.md#research-q06)先比stderr/人工清单，再验退出/升级分步结果与恢复责任收据。

[查看完整分析](../../plugins/unlinearity--dsh-code/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1423059076-root"></a>

## [dsh-confirm-gate](../../plugins/steelunion--dsh-confirm-gate/INSIGHT.md)

[![GitHub ★ 84](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=84&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SteelUnion/dsh-confirm-gate) [![npm 30d 230](https://img.shields.io/static/v1?label=npm+30d&message=230&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@steelunion/dsh-confirm-gate) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@steelunion/dsh-confirm-gate)

> **用途**：允许代理连续改文件的 DSH 用户可用累计次数判断何时重新确认方向，目标是提醒和审批接点，而非准确计算金额或修改文件数。[Q01](../../plugins/steelunion--dsh-confirm-gate/INSIGHT.md#research-q01)

> **亮点**：相对人工查看和逐次审批，它把连续工作组织成按轮累计、阈值升级的提醒链，便于用户在明确接点重新决策；这是工具事件与上下文通知的组合，不是新的隔离机制。[Q01](../../plugins/steelunion--dsh-confirm-gate/INSIGHT.md#research-q01)

> **思考**：识别语子串会放行整轮，未知工具名可不计数，一次调用又可能批量修改；因而次数不能代表严格成本边界。默认patch名称与作用域包名的解析也仍需澄清。[Q03](../../plugins/steelunion--dsh-confirm-gate/INSIGHT.md#research-q03) 计数在执行前增加，拒绝与失败也消耗次数；消息集合是否为增量尚未核查，可能影响每轮状态连续性。

> **建议**：可验证结构化确认事件是否能保留累计提醒的便利，同时减少讨论确认词导致的无意放行；同轨迹对照误放行和人工动作，任一指标恶化时放弃该方向。这是未实现假设。[Q05](../../plugins/steelunion--dsh-confirm-gate/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/steelunion--dsh-confirm-gate/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333961389-root"></a>

## [dsh-context](../../plugins/bowenliang123--dsh-context/INSIGHT.md)

[![GitHub ★ 4,948](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C948&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 433,565](https://img.shields.io/static/v1?label=npm+30d&message=433%2C565&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)

> **用途**：面向调试长会话的人，把上下文压力与分项、历史步骤放在一个分析视图中。

> **亮点**：[Q01](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q01) 将总体压力与历史来源联系起来。[Q02](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q02) 通过活动投影、冷读和按版本缓存提供可回查的明细。

> **思考**：[Q02](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q02) 的空结果可以来自服务未就绪、兼容降级或冷读限制。[Q03](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q03) 的成本是估计，宿主授权和非空提示词配置需分别核对。

> **建议**：[Q04](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q04) 提议用已知大工具结果和历史缺失样本比较插件与原生状态。如果归因准确性下降或复核时间更长，就不支持常用。

[查看完整分析](../../plugins/bowenliang123--dsh-context/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333235870-root"></a>

## [dsh-cost-meter](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md)

[![GitHub ★ 678](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=678&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Han-1413141/dsh-cost-meter) [![npm 30d 155,790](https://img.shields.io/static/v1?label=npm+30d&message=155%2C790&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter)

> **用途**：在多模型会话中开发并需要任务级对账的用户，可以查看本地用量估计，再把账单差额定位到会话、模型渠道或价格规则。

> **亮点**：[Q01](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q01) 将宿主流的用量与会话、渠道和请求时段关联，提供可解释的本地归因。[Q02](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q02) 把包装模型 ID 的渠道前缀转为计价线索，并保留显式覆盖。[Q03](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q03) 的账本回执使丢失工作线程回报时可重读提交状态。

> **思考**：[Q01](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q01) 的断流可能缺量，普通指纹也可能混同等量包装请求。[Q02](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q02) 的参考等价成本随定价设置变化。[Q04](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q04) 的余额与授权会访问外部服务及写入凭据，需和本地账本分开核查。 [Q06](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q06) 的自动桥还会改动匹配子进程的启动与加载，退出需另核既有代理。

> **建议**：[Q01](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q01) 提出让宿主传递可信调用 ID 和包装父关系，并明确区分缺用量及无价状态。用等量独立调用、包装和断流样本比较漏重和排查成本。

[查看完整分析](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1300173275-extensions-dsh"></a>

## [dsh-deja](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md)

[![GitHub ★ 1,525](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C525&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu) [![npm 30d 8,755](https://img.shields.io/static/v1?label=npm+30d&message=8%2C755&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja)

> **用途**：曾使用多个编码助手的开发者想复用本机旧会话，也需要按正文找到 DSH 自身的历史讨论。

> **亮点**：[Q01](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q01) 将跨助手检索接入模型工具，并提供限定 DSH 会话的 Web 全文路径。索引和命中质量由 deja 提供。

> **思考**：[Q02](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q02) 自动路径的 CLI 失败会退为空，成功返回的上下文可进入模型。人工 Web 端点依赖宿主路由的访问控制。

> **建议**：[Q03](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q03) 在已有项目和更新时间的基础上加源版本确认，试验是否能减少把过期历史当作当前事实。

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

[![GitHub ★ 15](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=15&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9087/dsh-diff-approval) [![npm 30d 4,518](https://img.shields.io/static/v1?label=npm+30d&message=4%2C518&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-diff-approval)

> **用途**：与 Agent 共同编辑代码的开发者可在会话旁逐文件和逐块审阅，实际盘面与测试仍是验收依据。

> **亮点**：[Q01](../../plugins/9087--dsh-diff-approval/INSIGHT.md#research-q01) 支持把改动、引用与批注接到会话审阅流程，降低往返定位的潜在负担；它是已有写入后的审阅辅助。

> **思考**：[Q02](../../plugins/9087--dsh-diff-approval/INSIGHT.md#research-q02) 的普通回退没有所见内容比较前提，Undo读比较也不是原子比较发布；新建删除和重启不享有普遍Undo保证。

> **建议**：[Q04](../../plugins/9087--dsh-diff-approval/INSIGHT.md#research-q04) 提出未验证方向，将显示摘要与后端原子比较发布、持久和部分完成回执结合；并发与中断对照若不减少误覆盖及总恢复时间则放弃。

[查看完整分析](../../plugins/9087--dsh-diff-approval/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1424063534-plugins-dsh-domain-bridge"></a>

## [dsh-domain-bridge](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1Lany2a/dsh-domain-role) [![npm 30d 377](https://img.shields.io/static/v1?label=npm+30d&message=377&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-domain-bridge) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-domain-bridge)

> **用途**：面向按业务域分工的DSH会话协作，要求目标、暂停级和消息处理结果可追溯，不能只以delivered推断业务办结。

> **亮点**：把域寻址、分层暂停、持久队列与会话/模型接线组合，并加入跨进程状态锁、投递租约和可查询队列；增量是协作控制面，不是业务隔离或exactly-once。[Q01](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md#research-q01)、[Q03](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md#research-q03)

> **思考**：持久认领已实现，但投递成功与终态非原子；追加队列不走重写锁，损坏暂停状态可放行。hub仅按Host判本机，不能独立证明请求身份。[Q04](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md#research-q04)、[Q10](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md#research-q10)

> **建议**：在现有租约上加入稳定消费ID、接收端去重/完成收据、fencing及统一所有inbox写者协议，比较故障后重复/漏投及恢复负担；不是把已实现租约算新设想。[Q08](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333754646-root"></a>

## [dsh-doublecheck](../../plugins/perrylink--dsh-doublecheck/INSIGHT.md)

[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-doublecheck) [![npm 30d 5,123](https://img.shields.io/static/v1?label=npm+30d&message=5%2C123&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-doublecheck) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-doublecheck)

> **用途**：反复在需求不清时改代码、收尾缺测试证据的开发者，可在非关键任务中把规格和测试轨迹带回交付复核，见 [Q01](../../plugins/perrylink--dsh-doublecheck/INSIGHT.md#research-q01)。

> **亮点**：将需求规格、测试轨迹、评审和阶段裁决放同一会话，真实支持工作流checker和缺服务降级；效果与全部工具覆盖未验，见 [Q01](../../plugins/perrylink--dsh-doublecheck/INSIGHT.md#research-q01)至 [Q04](../../plugins/perrylink--dsh-doublecheck/INSIGHT.md#research-q04)。

> **思考**：默认remind不会挡写；测试依工具/命令/结果文本，gate的deliverable允许warn/skip，评审不可用不等于已证质量，见 [Q03](../../plugins/perrylink--dsh-doublecheck/INSIGHT.md#research-q03)、[Q04](../../plugins/perrylink--dsh-doublecheck/INSIGHT.md#research-q04)。

> **建议**：未验证方向是突出证据完备三态和报告调用的模型/写盘副作用，比较未知评审/写失败时的误判与阅读成本，见 [Q06](../../plugins/perrylink--dsh-doublecheck/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/perrylink--dsh-doublecheck/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335988605-root"></a>

## [dsh-engineering-workflow](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/82c86b8z86-stack/dsh-engineering-workflow)

> **用途**：团队希望对复杂工程任务进行需求、计划、TDD、委派与验收约束。

> **亮点**：打包五阶段工程方法与 DSH preset/Skill 工具组合，减少手工配置。详见[Q01](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q01)。

> **思考**：自动同步同名 preset 目录时无备份覆写用户改动/删除附加文件；默认公告影响未选 preset 的新会话。详见[Q02](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q02)。

> **建议**：加入版本化/备份合并与轻量低风险路径、按选中 preset 公告，可降低采用摩擦；待验证。详见[Q03](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1353296006-root"></a>

## [dsh-engram · 记忆宫殿](../../plugins/kenz1117--dsh-engram/INSIGHT.md)

[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenz1117/dsh-engram) [![npm 30d 13,163](https://img.shields.io/static/v1?label=npm+30d&message=13%2C163&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kenz1117/dsh-engram) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kenz1117/dsh-engram)

> **用途**：[Q01](../../plugins/kenz1117--dsh-engram/INSIGHT.md#research-q01) 用于反复恢复同项目任务及核对最新约束。相比人工笔记，可以按作用域搜历史并追踪引用。

> **亮点**：[Q01](../../plugins/kenz1117--dsh-engram/INSIGHT.md#research-q01) 和 [Q03](../../plugins/kenz1117--dsh-engram/INSIGHT.md#research-q03) 把可检索历史、会话引用批次与注入审计接入 DSH。真实任务对照和准确度未复现。

> **思考**：[Q02](../../plugins/kenz1117--dsh-engram/INSIGHT.md#research-q02) 的 0.13.9 发布补丁实际指定 light，profile 采用后可能启用宿主 LLM 摄取。[Q03](../../plugins/kenz1117--dsh-engram/INSIGHT.md#research-q03) 的证据门只核对成员和声明，真实作答及数据出口需单独验收。

> **建议**：[Q05](../../plugins/kenz1117--dsh-engram/INSIGHT.md#research-q05) 假设把关键主张与原文跨度和修订状态绑定，可降低引用真实却答错的问题。对照现有批次门和项目笔记，计入误拒和时间。

[查看完整分析](../../plugins/kenz1117--dsh-engram/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1333132389-root"></a>

## [dsh-find-plugins](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md)

[![GitHub ★ 182](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=182&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nagi-ovo/dsh-find-plugins)

> **用途**：需要按任务寻找 DSH 插件且不了解仓库名和装法的用户。

> **亮点**：[Q01](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md#research-q01) 以公共 topic 当前地址整理候选，[Q02](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md#research-q02) 将装法和风险复核分为显式步骤。

> **思考**：[Q01](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md#research-q01) 搜索窗口有上限，[Q02](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md#research-q02) 安装确认是 Agent 流程约定，权限仍由宿主和目标包决定。

> **建议**：[Q04](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md#research-q04) 将搜索不完整和截断信息传给上层，检验是否减少把未发现当成不存在。

[查看完整分析](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1423215448-root"></a>

## [dsh-folderwatch](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md)



> **用途**：面向开发会话等待构建报告、下载或共享目录交接的用户。插件提供五个folderwatch工具与/watch命令，按目录元数据变化生成消息，可wake新回合或queue到后续步骤。它不直接理解报告内容，不保证构建/测试业务成功，也不是文件内容备份或可靠事件日志。

> **亮点**：以快照差分为主、fs.watch提示为辅，结合quiet/上限/冷却与Agent消息入口减少主动查目录。详见[Q02](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md#research-q02)。

> **思考**：stat递归会跟随目录链接，partial/不可读仍作差分；共享echo不区分成功写或会话，目标失效可fallback别Agent；批次先drain且送达Promise未await。详见[Q03](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md#research-q03)至[Q05](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md#research-q05)。

> **建议**：可探索扫描质量/物理root与owner绑定、成功写echo和批次受理ack，比较误报/漏报/错收件和恢复成本；未实现。详见[Q06](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333375597-root"></a>

## [dsh-github](../../plugins/pivotstackintelligence--dsh-github/INSIGHT.md)

[![GitHub ★ 92](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PivotStackIntelligence/dsh-github) [![npm 30d 1,118](https://img.shields.io/static/v1?label=npm+30d&message=1%2C118&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-github) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-github)

> **用途**：编码用户想在会话旁检查改动和提交。

> **亮点**：[Q01](../../plugins/pivotstackintelligence--dsh-github/INSIGHT.md#research-q01) 将 diff 与提交放到当前会话。

> **思考**：[Q02](../../plugins/pivotstackintelligence--dsh-github/INSIGHT.md#research-q02) 删除不可逆，同步分步失败需核对。

> **建议**：[Q03](../../plugins/pivotstackintelligence--dsh-github/INSIGHT.md#research-q03) 对照终端测切换时间。

[查看完整分析](../../plugins/pivotstackintelligence--dsh-github/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339462797-root"></a>

## [dsh-github-router](../../plugins/angeloszou--dsh-github-router/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngelosZou/dsh-github-router) [![npm 30d 1,602](https://img.shields.io/static/v1?label=npm+30d&message=1%2C602&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-github-router) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-github-router)

> **用途**：网络受限的Agent需要有来源标注的GitHub资料读取。详见[Q01](../../plugins/angeloszou--dsh-github-router/INSIGHT.md#research-q01)。

> **亮点**：将多传输故障处理和PR逐部分取数封装为Agent读取流程，减少shell重试与人工拼接。详见[Q01](../../plugins/angeloszou--dsh-github-router/INSIGHT.md#research-q01)。

> **思考**：URL缓存不绑定凭据主体，本地路径以origin匹配替代授权闭合；分页、HTML候选与镜像也限制完整性。详见[Q04](../../plugins/angeloszou--dsh-github-router/INSIGHT.md#research-q04)。

> **建议**：可研究身份分区缓存与对象/SHA/分页/截断来源清单，按换身份和错对象反例比较错误复用。当前未验证。详见[Q07](../../plugins/angeloszou--dsh-github-router/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/angeloszou--dsh-github-router/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333504012-root"></a>

## [dsh-godot-skill](../../plugins/akira399--dsh-godot-skill/INSIGHT.md)

[![GitHub ★ 56](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=56&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/akira399/dsh-godot-skill)

> **用途**：在DSH开发Godot4小游戏时加载中文节点/API与流程参考。见 [Q01](../../plugins/akira399--dsh-godot-skill/INSIGHT.md#research-q01)。

> **亮点**：中文参考和模板随插件激活/卸载，统一分发；不增加引擎控制、自主循环或目标平台验收。见 [Q03](../../plugins/akira399--dsh-godot-skill/INSIGHT.md#research-q03)。

> **思考**：verify只测语法/文件/mock注册，disposer断言不核真实disposer；正文没有绑定Godot小版本或可玩导出回执。见 [Q02](../../plugins/akira399--dsh-godot-skill/INSIGHT.md#research-q02)。

> **建议**：以固定版本的最小可玩原型验收包替代泛化完成承诺；若官方示例更省事或不减不可玩结果即推翻。见 [Q04](../../plugins/akira399--dsh-godot-skill/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/akira399--dsh-godot-skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333258432-root"></a>

## [dsh-hdc-bridge](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md)

[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1na-ko/dsh-hdc-bridge) [![npm 30d 1,874](https://img.shields.io/static/v1?label=npm+30d&message=1%2C874&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hdc-bridge) [![最新发布 2026-10-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hdc-bridge)

> **用途**：[Q01](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q01) 为在 DSH 内反复改码、部署和看设备的鸿蒙开发者减少手动材料交接；合格结果是正确设备的真实行为，而非exit0。

> **亮点**：[Q01](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q01) 与 [Q02](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q02) 把成熟hdc、官方工具链和知识接入原生工具、图片与工程流程，结构化失败/产物核验减少只看命令成功的误判；不把上游协议/文档算原创。

> **思考**：[Q03](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q03) 的preferred设备单值需要宿主实例作用域才能兑现会话隔离，工具Shell和面板直接进程也不是同一权限通道。已有Host/Origin等请求栅栏，但多会话设备语义仍未运行验收。

> **建议**：[Q05](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q05) 用会话/工程/设备/产物收据连接已有状态，检验双设备双工程下的误投与确认负担；当前为未验证假设。

[查看完整分析](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1401710157-root"></a>

## [dsh-host-rsi](../../plugins/pk14742952-ad--dsh-host-rsi/INSIGHT.md)

[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pk14742952-AD/dsh-host-rsi)

> **用途**：同一项目反复执行可检验任务时，取用相关经验与归纳执行结果。

> **亮点**：[Q01](../../plugins/pk14742952-ad--dsh-host-rsi/INSIGHT.md#research-q01) 的经验取用移到宿主任务开始处，[Q02](../../plugins/pk14742952-ad--dsh-host-rsi/INSIGHT.md#research-q02) 说明任务变化与后续工具失败可触发检索。

> **思考**：[Q03](../../plugins/pk14742952-ad--dsh-host-rsi/INSIGHT.md#research-q03) 需核对自动追加回合的成本、写入用户任务与回答的范围，以及异常退出时经验的落盘。

> **建议**：[Q04](../../plugins/pk14742952-ad--dsh-host-rsi/INSIGHT.md#research-q04) 通过重复验证任务的启用对照检验自动注入是否改善实际测试，且增加的回合和误命中可接受。

[查看完整分析](../../plugins/pk14742952-ad--dsh-host-rsi/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333786261-root"></a>

## [dsh-IDE](../../plugins/chenw2759-wq--dsh-ide/INSIGHT.md)

[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chenw2759-wq/dsh-IDE)

> **用途**：在 DSH 聊天旁浏览项目文件和 Git 变更，或从同一界面组织 SSH 远程开发。见 [Q01](../../plugins/chenw2759-wq--dsh-ide/INSIGHT.md#research-q01)。

> **亮点**：面板在 DSH Web 集中浏览和审查，EasySSH 通过模式门面让原生模型工具可以选择远端后端。见 [Q02](../../plugins/chenw2759-wq--dsh-ide/INSIGHT.md#research-q02)。

> **思考**：面板查 sshWorkspaceCore，EasySSH 提供 easysshCore，源码未见桥接。浏览器按 Session 记忆，宿主模式仍是实例全局。见 [Q02](../../plugins/chenw2759-wq--dsh-ide/INSIGHT.md#research-q02) 与 [Q03](../../plugins/chenw2759-wq--dsh-ide/INSIGHT.md#research-q03)。

> **建议**：集中入口可能减少同一改动在聊天、文件和终端之间的切换。试验须区分本地与 SSH，并把正确目标及可复核结果作为门槛。见 [Q05](../../plugins/chenw2759-wq--dsh-ide/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/chenw2759-wq--dsh-ide/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1417110833-root"></a>

## [dsh-inject](../../plugins/john-walks-slow--dsh-inject/INSIGHT.md)

[![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/john-walks-slow/dsh-inject) [![npm 30d 1,477](https://img.shields.io/static/v1?label=npm+30d&message=1%2C477&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-inject) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-inject)

> **用途**：比较不同请求格式对模型影响的 DSH 开发者需要查看真实下游请求、原始会话及作用范围，适合用非敏感标记做对照。[Q01](../../plugins/john-walks-slow--dsh-inject/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/john-walks-slow--dsh-inject/INSIGHT.md#research-q01) [Q02](../../plugins/john-walks-slow--dsh-inject/INSIGHT.md#research-q02) 相比反复输入提示，插件提供会话覆盖、单次队列与角色限定替换，在请求副本中重用。

> **思考**：[Q03](../../plugins/john-walks-slow--dsh-inject/INSIGHT.md#research-q03) 真实请求和会话摘要不同，队列在 provider 确认前已删除，clear 只清预设。远程代理的目的地限制还需核验。

> **建议**：[Q05](../../plugins/john-walks-slow--dsh-inject/INSIGHT.md#research-q05) 把排队、已转发和结果未知分别标记，并以无敏感摘要核对，可能减少重复输入和对发送状态的误判。

[查看完整分析](../../plugins/john-walks-slow--dsh-inject/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 1,641](https://img.shields.io/static/v1?label=npm+30d&message=1%2C641&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-guard)

> **用途**：希望在 DSH 执行 shell 前增加风险判断的用户。

> **亮点**：[Q02](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md#research-q02) 把静态与语义判断接入工具前置流程。

> **思考**：[Q03](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md#research-q03) 远程故障和 adapter 异常 fail-open，显式降级 off 更会跳过 L0。

> **建议**：[Q05](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md#research-q05) 对照现有告警显示可用防护以辅助暂停决策，待检验。

[查看完整分析](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1382292535-root"></a>

## [dsh-jev-interceptor](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md)

[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AskTheWay/dsh-jev-interceptor) [![npm 30d 3,180](https://img.shields.io/static/v1?label=npm+30d&message=3%2C180&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-interceptor) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-interceptor)

> **用途**：频繁工具调用且愿校准遥测的开发者，需任务正确/权限不扩和可追全成本，不凭分类响应算成功。

> **亮点**：[Q01](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q01)、[Q02](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q02) typed多决策点与next/有界新鲜证据限制部分授权风险；[Q04](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q04) 引用反事实、缓存/预算可复用，不等准确或省钱实测。

> **思考**：[Q03](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q03) enabled且图像opt-in时shadow也可append image/offload，默认关闭收窄而非修复；[Q04](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q04) 遥测best-effort非动作前置，resolver退出要整bundle。

> **建议**：[Q06](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md#research-q06) 待验证统一effect gate携mode/provenance/证据/可逆性，shadow零状态变化与原生任务/全成本矩阵；不能重复算已有模式门。

[查看完整分析](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422091204-root"></a>

## [dsh-leak-guard](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md)



> **用途**：适合开发者在公开仓库/publish/外发目录前，以本地启发式检查现有文本中的凭据线索，再人工复核/移除。基线手工grep/检查文件名或专门secret scanner；插件把规则扫描接入DSH工具并返回脱敏发现，便于模型/人看位置。

> **亮点**：把本地模式/文件名审计整合为DSH工具，按位置级别给克制预览，模块可独立复核；非有效凭据验证。详见[Q02](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md#research-q02)。

> **思考**：缺失根/权限失败/静默长行与限额可使未完整扫描仍ok=true，工具丢截断且小正数预算可round0；绿灯不能当发布安全证明。详见[Q03](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md#research-q03)。

> **建议**：可探索complete/partial/error覆盖收据与精确发布对象摘要、正整数预算和范围去重，按合成真值/变更矩阵证伪；未实现。详见[Q06](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/7gzgn--dsh-leak-guard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1343773044-packages-dsh-lowtide"></a>

## [dsh-lowtide](../../plugins/kelaohu--dsh-lowtide--packages-dsh-lowtide/INSIGHT.md)

[![GitHub ★ 178](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=178&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KelaoHu/dsh-lowtide) [![npm 30d 1,762](https://img.shields.io/static/v1?label=npm+30d&message=1%2C762&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lowtide) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lowtide)

> **用途**：能等到下一窗口的开发任务可先排队，事后检查差异、生成内容和异常。

> **亮点**：[Q01](../../plugins/kelaohu--dsh-lowtide--packages-dsh-lowtide/INSIGHT.md#research-q01) 把可延后任务的投递、放行、窗口执行和查收连接起来，减少用户持续等待。

> **思考**：[Q02](../../plugins/kelaohu--dsh-lowtide--packages-dsh-lowtide/INSIGHT.md#research-q02) 重启回队可能重复已有副作用。[Q03](../../plugins/kelaohu--dsh-lowtide--packages-dsh-lowtide/INSIGHT.md#research-q03) 并发预检和未定价使用量使账本不能充当硬预算。

> **建议**：[Q05](../../plugins/kelaohu--dsh-lowtide--packages-dsh-lowtide/INSIGHT.md#research-q05) 为未确认结束的任务引入待核对和执行代次，对照重复写入与恢复成本。

[查看完整分析](../../plugins/kelaohu--dsh-lowtide--packages-dsh-lowtide/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1343773044-root"></a>

## [dsh-lowtide](../../plugins/kelaohu--dsh-lowtide/INSIGHT.md)

[![GitHub ★ 178](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=178&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KelaoHu/dsh-lowtide)

> **用途**：需要延后运行非紧急 DSH 任务并集中验收的开发者。

> **亮点**：[Q01](../../plugins/kelaohu--dsh-lowtide/INSIGHT.md#research-q01) 把任务队列和跨日窗口纳入固定工作流。

> **思考**：[Q02](../../plugins/kelaohu--dsh-lowtide/INSIGHT.md#research-q02) 自动等级、窗口和实际计价要分别验收。

> **建议**：[Q04](../../plugins/kelaohu--dsh-lowtide/INSIGHT.md#research-q04) 将实际请求和账单关联以检查净节省。

[查看完整分析](../../plugins/kelaohu--dsh-lowtide/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1196157387-packages-dsh-madara-pixel-theme"></a>

## [dsh-madara-pixel-theme](../../plugins/bosskrabs--product--packages-dsh-madara-pixel-theme/INSIGHT.md)



> **用途**：[Q01](../../plugins/bosskrabs--product--packages-dsh-madara-pixel-theme/INSIGHT.md#research-q01) 面向希望定制 DSH Web 界面的用户。

> **亮点**：[Q01](../../plugins/bosskrabs--product--packages-dsh-madara-pixel-theme/INSIGHT.md#research-q01) 与 [Q02](../../plugins/bosskrabs--product--packages-dsh-madara-pixel-theme/INSIGHT.md#research-q02) 将像素视觉与设置面板集成到宿主。

> **思考**：[Q03](../../plugins/bosskrabs--product--packages-dsh-madara-pixel-theme/INSIGHT.md#research-q03) 首页样式依赖具体哈希类名，进度条只是装饰；宿主版本兼容未验证。

> **建议**：[Q05](../../plugins/bosskrabs--product--packages-dsh-madara-pixel-theme/INSIGHT.md#research-q05) 假设检测宿主界面或使用稳定槽位可减少静默失效；尚未实现。

[查看完整分析](../../plugins/bosskrabs--product--packages-dsh-madara-pixel-theme/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338527485-root"></a>

## [dsh-maze](../../plugins/lamost423--dsh-maze/INSIGHT.md)

[![GitHub ★ 87](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=87&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lamost423/dsh-maze) [![npm 30d 1,840](https://img.shields.io/static/v1?label=npm+30d&message=1%2C840&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-maze) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-maze)

> **用途**：复核长工具任务、并行时长和重试路径的开发者。

> **亮点**：[Q01](../../plugins/lamost423--dsh-maze/INSIGHT.md#research-q01) 用视觉路径统一比较调用时序和分支。

> **思考**：[Q02](../../plugins/lamost423--dsh-maze/INSIGHT.md#research-q02) 自动标签仅是规则结果，损坏行可能被跳过。

> **建议**：[Q04](../../plugins/lamost423--dsh-maze/INSIGHT.md#research-q04) 结果变化与重试理由可作为独立校准候选。

[查看完整分析](../../plugins/lamost423--dsh-maze/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334869464-root"></a>

## [dsh-mcp](../../plugins/arvinqi--dsh-mcp/INSIGHT.md)

[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ArvinQi/dsh-mcp) [![npm 30d 3,556](https://img.shields.io/static/v1?label=npm+30d&message=3%2C556&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp)

> **用途**：需要在多个 MCP 服务之间切换的 DSH 用户，可以在设置中管理服务器、核对状态和控制模型可见工具。

> **亮点**：[Q01](../../plugins/arvinqi--dsh-mcp/INSIGHT.md#research-q01) 将定义、凭据和挂载状态组织进同一设置页。[Q02](../../plugins/arvinqi--dsh-mcp/INSIGHT.md#research-q02) 用注册期条件在 DSH 每步工具集合中联动搜索、开关和现有调用方条件。

> **思考**：[Q02](../../plugins/arvinqi--dsh-mcp/INSIGHT.md#research-q02) 的热度是服务实例级，先注册的工具可能直到重挂载才受准入约束。[Q03](../../plugins/arvinqi--dsh-mcp/INSIGHT.md#research-q03) 的 stdio 仍运行外部命令，工具可见性与服务授权应分别核对。

> **建议**：[Q04](../../plugins/arvinqi--dsh-mcp/INSIGHT.md#research-q04) 提出为热集合加入会话隔离，比较两会话的无关工具数、额外搜索轮次和合格任务结果。

[查看完整分析](../../plugins/arvinqi--dsh-mcp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334569498-root"></a>

## [dsh-mermaid](../../plugins/aks1st--dsh-mermaid/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dsh-mermaid) [![npm 30d 4,196](https://img.shields.io/static/v1?label=npm+30d&message=4%2C196&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mermaid) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mermaid)

> **用途**：帮助开发者/研究者就地阅读流程与架构图，保留源码核对，渲染不等业务逻辑正确。

> **亮点**：把成熟Mermaid布局接入DSH定格消息，补视口排队、主题、放大与源码回退，减少复制到外部站点；上游布局和消毒不属插件原创。详见[Q02](../../plugins/aks1st--dsh-mermaid/INSIGHT.md#research-q02)。

> **思考**：Promise超时不能中断主线程CPU，离视口只丢结果；发送AI修复会写全局首个输入框并模拟Enter，可能覆盖已有草稿，均为静态边界未复现。strict不能代替完整安全验收。详见[Q02](../../plugins/aks1st--dsh-mermaid/INSIGHT.md#research-q02)。

> **建议**：可探讨可终止渲染隔离和绑定会话的可预览修复草稿，比较病态图响应及原草稿保留；受DOM依赖与通信开销约束，未验证。详见[Q05](../../plugins/aks1st--dsh-mermaid/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aks1st--dsh-mermaid/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334871947-root"></a>

## [dsh-minimal-turbo](../../plugins/changedenczd--dsh-minimal-turbo/INSIGHT.md)

[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ChangedenCZD/dsh-minimal-turbo)

> **用途**：面向希望调整 DSH Agent 工具范围与首轮探索方式的使用者。

> **亮点**：[Q01](../../plugins/changedenczd--dsh-minimal-turbo/INSIGHT.md#research-q01) 与 [Q02](../../plugins/changedenczd--dsh-minimal-turbo/INSIGHT.md#research-q02) 将较窄本地编辑配置和首轮探索提示整理为两份可选预设。

> **思考**：[Q03](../../plugins/changedenczd--dsh-minimal-turbo/INSIGHT.md#research-q03) 的直接覆盖会改变宿主目录，且本地文件服务的实际权限需要核查。提示词约束无法直接保证思考或质量。

> **建议**：[Q04](../../plugins/changedenczd--dsh-minimal-turbo/INSIGHT.md#research-q04) 用固定任务对比标准与 wish，若测试通过、时间及人工补救无改善则保留原配置。

[查看完整分析](../../plugins/changedenczd--dsh-minimal-turbo/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1423488109-root"></a>

## [dsh-model-everything](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md)

[![npm 30d 1,952](https://img.shields.io/static/v1?label=npm+30d&message=1%2C952&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-everything) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-everything)

> **用途**：希望形式化检查软件设计行为的开发者或审查者。

> **亮点**：[Q02](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md#research-q02) 把受限模型探索及审查结论带入 DSH。

> **思考**：[Q03](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md#research-q03) 模型通过不证明源码忠实或无界正确。

> **建议**：[Q05](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md#research-q05) 对照已有覆盖和截断显示，验证源码断言映射缺口。

[查看完整分析](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1367998877-root"></a>

## [dsh-ntr](../../plugins/gdwhisper--dsh-ntr/INSIGHT.md)

[![GitHub ★ 94](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GDWhisper/dsh-ntr) [![npm 30d 5,424](https://img.shields.io/static/v1?label=npm+30d&message=5%2C424&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ntr) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ntr)

> **用途**：用户希望沿用 DSH 会话界面操作其他 Agent。

> **亮点**：[Q01](../../plugins/gdwhisper--dsh-ntr/INSIGHT.md#research-q01) 统一操作界面并保留 Agent 的执行选择。

> **思考**：[Q02](../../plugins/gdwhisper--dsh-ntr/INSIGHT.md#research-q02) auto 优先长期放行，取消本地收尾不证明外部停止。

> **建议**：[Q03](../../plugins/gdwhisper--dsh-ntr/INSIGHT.md#research-q03) 对照目标 CLI 的事件完整度和恢复。

[查看完整分析](../../plugins/gdwhisper--dsh-ntr/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1366664192-root"></a>

## [dsh-oh-my-claude](../../plugins/lcestou--dsh-oh-my-claude/INSIGHT.md)

[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lcestou/dsh-oh-my-claude) [![npm 30d 6,113](https://img.shields.io/static/v1?label=npm+30d&message=6%2C113&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-oh-my-claude) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-oh-my-claude)

> **用途**：已有 Claude Code 的用户希望从 DSH 续接代码任务与审批。

> **亮点**：[Q01](../../plugins/lcestou--dsh-oh-my-claude/INSIGHT.md#research-q01) 把登录后的 CLI 挂成 DSH provider，支持会话及协议转译。[Q03](../../plugins/lcestou--dsh-oh-my-claude/INSIGHT.md#research-q03) keeper 提供有界重放。

> **思考**：[Q02](../../plugins/lcestou--dsh-oh-my-claude/INSIGHT.md#research-q02) Host 审批取决于 CLI 回调。[Q04](../../plugins/lcestou--dsh-oh-my-claude/INSIGHT.md#research-q04) SSH 目录失败会退 HOME，远端凭据可传回本机。

> **建议**：[Q05](../../plugins/lcestou--dsh-oh-my-claude/INSIGHT.md#research-q05) 将输出恢复和外部工具回执分别显示，测量是否减少盲目重跑。

[查看完整分析](../../plugins/lcestou--dsh-oh-my-claude/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333068322-root"></a>

## [dsh-open-in-vscode](../../plugins/omdsh-dev--dsh-open-in-vscode/INSIGHT.md)

[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-open-in-vscode)

> **用途**：本机Web用户把当前工作区切到本机VS Code，手动终端code是基线。见 [Q01](../../plugins/omdsh-dev--dsh-open-in-vscode/INSIGHT.md#research-q01)。

> **亮点**：目录菜单、Windows默认发现与新旧菜单适配；编辑器/OS与Host Remote继承现成能力。见 [Q03](../../plugins/omdsh-dev--dsh-open-in-vscode/INSIGHT.md#research-q03)。

> **思考**：Host只验绝对path不验Workspace，strict非授权；执行位置在Host且opened非窗口可见，UI错误仅控制台。见 [Q02](../../plugins/omdsh-dev--dsh-open-in-vscode/INSIGHT.md#research-q02)。

> **建议**：复用工作区注册表解析workspaceId，并区分启动与可见/远程限制；五条件对照，已有Host服务足够则组合。见 [Q04](../../plugins/omdsh-dev--dsh-open-in-vscode/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/omdsh-dev--dsh-open-in-vscode/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335992154-root"></a>

## [dsh-openai-oauth](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdonisSheldon/dsh-openai-oauth) [![npm 30d 895](https://img.shields.io/static/v1?label=npm+30d&message=895&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openai-oauth) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openai-oauth)

> **用途**：已有 Codex 账号权限且希望留在 DSH 的本机用户可观察独立模型路由，见 [Q01](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q01) 与 [Q03](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q03) 将 OAuth、账号模型目录和原生搜索接入 DSH；消息转换部分依据第三方声明继承上游，不属于新 OAuth 协议。

> **思考**：[Q02](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q02) 凭据未加密且退出与完成写入存在条件性交错；[Q04](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q04) 多个 system 消息可被覆盖、非法工具参数可回退空对象，需要结合宿主实际路径验证。

> **建议**：[Q06](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q06) 假设认证世代栅栏及严格消息转换能减少凭据残留和静默语义变化；尚未实现或验证。

[查看完整分析](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1409893258-root"></a>

## [dsh-ops](../../plugins/t-auto--dsh-ops/INSIGHT.md)

[![GitHub ★ 5,591](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C591&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-ops) [![npm 30d 125,600](https://img.shields.io/static/v1?label=npm+30d&message=125%2C600&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops)

> **用途**：经常在仓库中定位调用点并能核查搜索范围的 DSH 开发者，可用可恢复副本衡量是否减少重复工具调用。[Q01](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q01)

> **亮点**：[Q02](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q02) 将文件 worker、会话策略和共享工具面串接。[Q03](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q03) 的关键组合是按实际工具视图判断替换，并在分页中分开展示和源执行完整性。它为有界工具结果提供可核查的调用路径。

> **思考**：[Q03](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q03) 指出替换守卫能确认对应定义可执行，但不确认原版与替换语义等价。短引用和分页节省上下文的前提是模型没有遗漏关键证据。

> **建议**：[Q06](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q06) 提出在已知任务目标时对照实际覆盖，避免把局部正确的结果当成仓库搜索完结。用同任务漏检和总体投入验证是否值得。

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

## [dsh-ouroboros](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md)

[![GitHub ★ 6,332](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C332&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)

> **用途**：已有 DSH 和规格工作流需求的开发者，可在一个 profile 挂载 Ouroboros 工具，避免重复写 MCP 启动配置。

> **亮点**：[Q01](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q01) 和 [Q02](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q02) 显示子包将常用 stdio 连接和默认设置打包，降低多 profile 重复配置；工作流机制由根服务提供。

> **思考**：[Q02](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q02) 的 uvx 参数没有锁定 Ouroboros 版本，[Q03](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q03) 的工具就绪也不检查独立 DSH 模型后端。因此不能从固定配置包推断实际版本或首调成功。

> **建议**：[Q05](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q05) 提出将实际解析版本和最小后端检查单独显示，验证是否能减少工具可见却无法工作的情况。

[查看完整分析](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335155355-root"></a>

## [dsh-pentest](../../plugins/howmp--dsh-pentest/INSIGHT.md)

[![GitHub ★ 609](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=609&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/howmp/dsh-pentest) [![npm 30d 2,144](https://img.shields.io/static/v1?label=npm+30d&message=2%2C144&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@howmp/dsh-pentest) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@howmp/dsh-pentest)

> **用途**：授权安全团队需要交接目标、观察、可复现步骤与关联资产，不只是展示扫描工具输出。

> **亮点**：[Q01](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q01)以领域图组织记录并检查引用、要求可复现步骤；[Q02](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q02)子Agent可向活跃父会话存储提交，减少纯聊天交接。

> **思考**：[Q02](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q02)父图不含所有子提交、批量写用尽力清理而非底层原子事务，重置目标清旧图；[Q03](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q03)归档后维护负担需用户承担。

> **建议**：可以推导未验证的提交回执，把子提交的稳定ID、父intent、存储版本和完整记录摘要返回父编排者，父图显示独立“已存储但未入父日志”状态，并提供只读回查。相对伪造父日志事件，增量是让两种真相边界可见，不让UI空缺被误解为子任务没交付。

[查看完整分析](../../plugins/howmp--dsh-pentest/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338946084-root"></a>

## [dsh-pentester](../../plugins/fb0sh--dsh-pentester/INSIGHT.md)

[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fb0sh/dsh-pentester) [![npm 30d 3,995](https://img.shields.io/static/v1?label=npm+30d&message=3%2C995&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pentester) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pentester)

> **用途**：在自有授权靶场组织多阶段测试和结果复核的人员。

> **亮点**：[Q01](../../plugins/fb0sh--dsh-pentester/INSIGHT.md#research-q01) Root与Worker分工、Run冻结Runtime和审计把阶段任务接到持久结果，但交付回拉是尽力执行。

> **思考**：[Q02](../../plugins/fb0sh--dsh-pentester/INSIGHT.md#research-q02) cwd与目标注册不能限制实际命令权限。[Q05](../../plugins/fb0sh--dsh-pentester/INSIGHT.md#research-q05) drain超时仍closed，SSH停止又依赖前序取消，终态不能独立证明远端已静止。

> **建议**：[Q04](../../plugins/fb0sh--dsh-pentester/INSIGHT.md#research-q04) 对未排空保留未知状态并要求独立终结读回，可能减少错误停止提示。

[查看完整分析](../../plugins/fb0sh--dsh-pentester/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1423941835-root"></a>

## [dsh-pick](../../plugins/aicivilization--dsh-pick/INSIGHT.md)

[![npm 30d 2,415](https://img.shields.io/static/v1?label=npm+30d&message=2%2C415&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pick) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pick)

> **用途**：需要在多个DSH候选间比较的用户，可按需求查目录与统计，再独立核查任务适配。

> **亮点**：它把需求词项搜索、去噪统计和四个对话工具接到同一目录，减少信息分散，贡献是信息组织而非质量保证。[Q01](../../plugins/aicivilization--dsh-pick/INSIGHT.md#research-q01)、[Q02](../../plugins/aicivilization--dsh-pick/INSIGHT.md#research-q02)

> **思考**：剔除发布日不能识别全部自动流量，健康度还为缺指标填默认值；高分不证明真实用户、可靠性或任务适配。[Q03](../../plugins/aicivilization--dsh-pick/INSIGHT.md#research-q03)

> **建议**：可将描述性热度与固定版本任务适配、证据覆盖分开，让选择对照实际合格任务；尚未实现和验证。[Q05](../../plugins/aicivilization--dsh-pick/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/aicivilization--dsh-pick/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333921957-root"></a>

## [dsh-plans](../../plugins/optim-agent--dsh-plans/INSIGHT.md)

[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Optim-Agent/dsh-plans)

> **用途**：愿意先澄清复杂仓库变更再执行的人，可生成带决策和验收表的版本计划；简单任务未必值得多轮，见 [Q01](../../plugins/optim-agent--dsh-plans/INSIGHT.md#research-q01)。

> **亮点**：把语言/模型偏好、计划版本与评审/交接组织成可追溯工作流，真实工具可选模型并区分执行/释放失败；净质量未测，见 [Q01](../../plugins/optim-agent--dsh-plans/INSIGHT.md#research-q01)至 [Q03](../../plugins/optim-agent--dsh-plans/INSIGHT.md#research-q03)。

> **思考**：内置plan mode关闭，交接/不改目标主要靠模型遵循；子评审deny未移除shell，不能把局部工具过滤当硬只读；状态并发/公共计划目录也有边界，见 [Q02](../../plugins/optim-agent--dsh-plans/INSIGHT.md#research-q02)至 [Q04](../../plugins/optim-agent--dsh-plans/INSIGHT.md#research-q04)。

> **建议**：未验证方向是已接受plan hash/用户选择的结构化交接，加真实受限评审preset，比较错误执行/错版本与额外交互成本，见 [Q05](../../plugins/optim-agent--dsh-plans/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/optim-agent--dsh-plans/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1374274469-root"></a>

## [dsh-plugin-adapter](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1624318455/dsh-plugin-adapter)

> **用途**：已有DSH用户在同一会话进行匿名文本/工具任务，验收应看真实产物、结果续接与终态；目录及ready不是任务成功。见[Q01](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q01)。

> **亮点**：将匿名目录、消息/工具事件、预算夹紧和故障终态接到宿主模型契约；首交付后不再重放有可检查边界，但不是插件独立实现Agent循环或已验证服务保障。见[Q02](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q02)。

> **思考**：根^0.3.4未锁定到所审子包0.6.0；入口池开时relay句柄未接Zen，池关仍受fetch owner与失败ambient回落约束，installer在setter返回void时没有保存/恢复旧slot。条件源码缺口未作为真实宿主故障，产物、实际出口与退出仍是采用门槛。见[Q01](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q01)、[Q03](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q03)。

> **建议**：在已有诊断上绑定一次调用的真实产物/路径、首交付、终态与释放确认，先用匿名失败任务对照原生日志和简单修补；无定位/纠错收益就不产品化。尚未实现或验证，见[Q05](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1201143178-integrations-dsh"></a>

## [dsh-plugin-aitelier](../../plugins/linxuhao--aitelier--integrations-dsh/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/linxuhao/AItelier) [![npm 30d 882](https://img.shields.io/static/v1?label=npm+30d&message=882&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-aitelier) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-aitelier)

> **用途**：使用 DSH 且已有 AItelier 后端的操作者，希望从会话中操作或观察流水线。

> **亮点**：[Q01](../../plugins/linxuhao--aitelier--integrations-dsh/INSIGHT.md#research-q01) 与 [Q02](../../plugins/linxuhao--aitelier--integrations-dsh/INSIGHT.md#research-q02) 提供预设接线与流程指南；流水线执行本身属于后端。

> **思考**：[Q03](../../plugins/linxuhao--aitelier--integrations-dsh/INSIGHT.md#research-q03) 后端未启用 Cloudflare Access gate 时直接放过写入，不能无条件把无 token 当只读。

> **建议**：[Q05](../../plugins/linxuhao--aitelier--integrations-dsh/INSIGHT.md#research-q05) 假设显示握手和实际授权状态能减少诊断误判，需与现有检查对照。

[查看完整分析](../../plugins/linxuhao--aitelier--integrations-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336849011-root"></a>

## [dsh-plugin-bridge](../../plugins/totoro-qaq--dsh-plugin-bridge/INSIGHT.md)

[![GitHub ★ 165](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=165&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Totoro-qaq/dsh-plugin-bridge) [![npm 30d 4,040](https://img.shields.io/static/v1?label=npm+30d&message=4%2C040&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-bridge) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-bridge)

> **用途**：需要在任务中切换工具预设且希望保留关键决策的 DSH 用户。

> **亮点**：[Q01](../../plugins/totoro-qaq--dsh-plugin-bridge/INSIGHT.md#research-q01) 将可编辑预览与目标创建接起来。

> **思考**：[Q02](../../plugins/totoro-qaq--dsh-plugin-bridge/INSIGHT.md#research-q02) 进程内批准和宿主取消不能保证跨重启恰好一次。

> **建议**：[Q04](../../plugins/totoro-qaq--dsh-plugin-bridge/INSIGHT.md#research-q04) 对照检查表能否减少迁移遗漏。

[查看完整分析](../../plugins/totoro-qaq--dsh-plugin-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333682494-root"></a>

## [dsh-plugin-cc](../../plugins/cpj-dev--dsh-plugin-cc/INSIGHT.md)

[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cpj-dev/dsh-plugin-cc)

> **用途**：Claude Code 用户需要在当前仓库调用 DSH 审阅或执行任务。

> **亮点**：[Q01](../../plugins/cpj-dev--dsh-plugin-cc/INSIGHT.md#research-q01) 命令化委派并提供结果管理。

> **思考**：[Q02](../../plugins/cpj-dev--dsh-plugin-cc/INSIGHT.md#research-q02) 等待超时仍执行，停止会丢失内存会话。

> **建议**：[Q03](../../plugins/cpj-dev--dsh-plugin-cc/INSIGHT.md#research-q03) 对照手工入口测切换和恢复成本。

[查看完整分析](../../plugins/cpj-dev--dsh-plugin-cc/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1335799735-root"></a>

## [dsh-plugin-guard](../../plugins/lxzy-7--dsh-plugin-guard/INSIGHT.md)

[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lxzy-7/dsh-plugin-guard) [![npm 30d 706](https://img.shields.io/static/v1?label=npm+30d&message=706&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-guard) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-guard)

> **用途**：常更换 DSH 插件的维护者可以研究配置备份和启动故障恢复。

> **亮点**：[Q01](../../plugins/lxzy-7--dsh-plugin-guard/INSIGHT.md#research-q01) 把配置备份接在常见插件工具之前，并提供可定位的事故与回滚入口。

> **思考**：[Q02](../../plugins/lxzy-7--dsh-plugin-guard/INSIGHT.md#research-q02) good 标签没有验证历史启动，[Q03](../../plugins/lxzy-7--dsh-plugin-guard/INSIGHT.md#research-q03) 配置恢复和依赖安装可出现不同结果。

> **建议**：[Q04](../../plugins/lxzy-7--dsh-plugin-guard/INSIGHT.md#research-q04) 将真实启动、渲染与会话验收绑定到快照，可能减少错误回滚点。

[查看完整分析](../../plugins/lxzy-7--dsh-plugin-guard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333351747-root"></a>

## [dsh-plugin-guide](../../plugins/perrylink--dsh-plugin-guide/INSIGHT.md)

[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-plugin-guide) [![npm 30d 8,679](https://img.shields.io/static/v1?label=npm+30d&message=8%2C679&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-guide) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-guide)

> **用途**：DSH插件作者可在设计和评审时查找该收集什么证据、该使用哪个检查入口。[Q01](../../plugins/perrylink--dsh-plugin-guide/INSIGHT.md#research-q01)

> **亮点**：它把兼容识别、完整用户旅程和工程实践分成不同证据轨道，减少把静态识别误称运行通过的概念混淆；实际减少误称的效果未测。[Q01](../../plugins/perrylink--dsh-plugin-guide/INSIGHT.md#research-q01)

> **思考**：知识包不拥有检查结论，且外部main链接与未锁版本的命令可能漂移，读者须另固定检查器与结果，不能据指南出认证。[Q03](../../plugins/perrylink--dsh-plugin-guide/INSIGHT.md#research-q03)

> **建议**：版本绑定路由卡片可能提高升级后结论变化的可解释性；需比较解释率和维护时间，不成立就保留现有日志。这是未实现假设。[Q05](../../plugins/perrylink--dsh-plugin-guide/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/perrylink--dsh-plugin-guide/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1397817235-root"></a>

## [dsh-plugin-ide-hub](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/121212165/dsh-plugin-ide-hub) [![npm 30d 554](https://img.shields.io/static/v1?label=npm+30d&message=554&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-ide-hub) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-ide-hub)

> **用途**：在多个编码工具间查看会话并维护项目规则。

> **亮点**：[Q01](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q01) 集中本地盘点，[Q02](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q02) 提供恢复命令与规则初始化。

> **思考**：[Q03](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q03) 移除直接删除 STRUCTURE.json，标记外空白也可能规范；扫描失败可被跳过。

> **建议**：[Q05](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q05) 假设结合覆盖、删除与备份的计划可减少误判；未验证。

[查看完整分析](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422240642-root"></a>

## [dsh-plugin-orchd](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md)

[![npm 30d 660](https://img.shields.io/static/v1?label=npm+30d&message=660&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-orchd) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-orchd)

> **用途**：在 DSH 中跟踪 orchd 项目任务和评审的用户。

> **亮点**：[Q02](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md#research-q02) 将会话绑定、只读调用与面板集中。

> **思考**：[Q03](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md#research-q03) 项目引擎仍是可执行代码，安装入口会注入会话提示。

> **建议**：[Q05](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md#research-q05) 对照现有刷新与 TTL 展示状态来源，测过期误判。

[查看完整分析](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1378350155-root"></a>

## [dsh-plugin-preflight](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AphyTOT/dsh-plugin-preflight)

> **用途**：插件作者在提交或发布前反复核对结构规则，可把报告接入CI；绿色结果只覆盖已实现检查。[Q01](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q01)

> **亮点**：把DSH特有组合与预发布peer约束变成可重复结构报告，并在不知道宿主版本时限制判断，避免猜测兼容；增量是提交前诊断而非功能验收。[Q01](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q01) [Q02](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q02)

> **思考**：正则外形检查和简化semver不能证明宿主组合正确；宿主版本无法解析时部分规则静默，工具注册失败也静默，用户可能误读无错误为完整通过。[Q03](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q03)

> **建议**：可增加已检查/未知的覆盖报告，并以固定官方解析器差分核对边界；若提示不能促成行动或依赖破坏离线诊断，应收窄。未验证。[Q04](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1415732178-root"></a>

## [dsh-plugin-rea](../../plugins/czcdr--dsh-plugin-rea/INSIGHT.md)

[![GitHub ★ 82](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=82&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/czcdr/dsh-plugin-rea) [![npm 30d 8,519](https://img.shields.io/static/v1?label=npm+30d&message=8%2C519&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-rea) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-rea)

> **用途**：需要在 DSH 中查看已授权样本证据的工程师，可以研究 REA 工具接入及实际引擎选择。

> **亮点**：[Q01](../../plugins/czcdr--dsh-plugin-rea/INSIGHT.md#research-q01) 把组件环境与标准 MCP 行连接，[Q02](../../plugins/czcdr--dsh-plugin-rea/INSIGHT.md#research-q02) 显式提供系统与 bundle 的选择和供给线索。

> **思考**：[Q02](../../plugins/czcdr--dsh-plugin-rea/INSIGHT.md#research-q02) auto 可能运行系统 REA，[Q03](../../plugins/czcdr--dsh-plugin-rea/INSIGHT.md#research-q03) 版本探针和 doctor JSON 可读都不足以验收指定分析引擎。

> **建议**：[Q04](../../plugins/czcdr--dsh-plugin-rea/INSIGHT.md#research-q04) 随单项分析证据记录实际启动和引擎就绪范围，可能提高多机复现与故障归因。

[查看完整分析](../../plugins/czcdr--dsh-plugin-rea/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1218860433-plugins-dsh-strict-spec"></a>

## [dsh-plugin-strict-spec](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md)

[![npm 30d 543](https://img.shields.io/static/v1?label=npm+30d&message=543&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-strict-spec) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-strict-spec)

> **用途**：使用 strict-spec-driven 的 DSH 用户希望在会话中查阅工作区文档和推进里程碑。

> **亮点**：[Q01](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md#research-q01) 和 [Q02](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md#research-q02) 组织会话文档及读取错误；[Q03](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md#research-q03) 提供确认式目标入口。

> **思考**：[Q03](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md#research-q03) 查看本身与目标驱动的后续修改必须分开判断；[Q04](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md#research-q04) 实际 Skill 来源依赖宿主。

> **建议**：[Q05](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md#research-q05) 假设显示目标工作区与 Skill 来源能减少误认，需与现有确认对照。

[查看完整分析](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1399011094-root"></a>

## [dsh-plugin-task-forge](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/121212165/dsh-plugin-task-forge)

> **用途**：在多个 Agent 窗口交接同一开发任务的操作者。

> **亮点**：[Q01](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md#research-q01) 将交接包和版本回读纳入同一工作流。

> **思考**：[Q02](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md#research-q02) 结构 READY 不能证明理解，多文件状态仍可部分更新。

> **建议**：[Q04](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md#research-q04) 用验收项 ID 的缺失提示减少错误放行。

[查看完整分析](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422943787-root"></a>

## [dsh-plugin-veriscope](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-veriscope)

> **用途**：维护者交付前核已有评测与阈值，避免旧PASS被无条件复用。详见[Q01](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q01)。

> **亮点**：把阈值判定、缺证据保留和当前性回执接合，减少只看旧均值的误读。详见[Q01](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q01)。

> **思考**：门禁仅消费所提供分数，不证明样本总体/评分真实，本地摘要不抵抗整体重写，child kill不等进程树回收。详见[Q03](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q03)、[Q05](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q05)。

> **建议**：研究独立签名评测清单/总体计数及可恢复受管ID、进程组强杀，比较错放行与恢复。当前未验证。详见[Q06](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1342084531-root"></a>

## [dsh-ponytail](../../plugins/wenaixi--dsh-ponytail/INSIGHT.md)

[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Wenaixi/dsh-ponytail) [![npm 30d 5,421](https://img.shields.io/static/v1?label=npm+30d&message=5%2C421&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wenaixi/dsh-ponytail) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wenaixi/dsh-ponytail)

> **用途**：希望减少过度实现的开发者可以在隔离会话观察小修复的任务范围及真实提示。

> **亮点**：[Q01](../../plugins/wenaixi--dsh-ponytail/INSIGHT.md#research-q01) 将上游工程规则适配成 DSH 提示段、Skill 目录与会话模式。

> **思考**：[Q02](../../plugins/wenaixi--dsh-ponytail/INSIGHT.md#research-q02) 默认 off 的新具名会话可回退 full，[Q03](../../plugins/wenaixi--dsh-ponytail/INSIGHT.md#research-q03) 本地基线锁定不足以证明供应商缓存。

> **建议**：[Q04](../../plugins/wenaixi--dsh-ponytail/INSIGHT.md#research-q04) 分开保存明确关闭与未初始化，并记录真实前缀，可能让切档可查。

[查看完整分析](../../plugins/wenaixi--dsh-ponytail/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 29](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=29&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/00080000/dsh-project-memory) [![npm 30d 6,120](https://img.shields.io/static/v1?label=npm+30d&message=6%2C120&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

> **用途**：面向反复返回同一代码项目的开发者，提供任务续接、带来源的索引召回与经验记录；合格续接仍须回原文件核对。

> **亮点**：[Q01](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q01) 和 [Q02](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q02) 支持把任务、相关文件与经验召回组合进跨会话开发流程；可减少重新整理的潜在步骤，尚无端到端收益数据。

> **思考**：[Q03](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q03) 显示 exact 是状态占位，Saved 只反映变更被接受；锁失败后的待持久化与经验是否仍正确须另行核对。

> **建议**：[Q04](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q04) 提出未验证方向，将接受、待持久化、读回确认及来源变化分别展示；用锁竞争和源文件改动对照误信与恢复时间，若总负担不降则放弃。

[查看完整分析](../../plugins/00080000--dsh-project-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339045665-root"></a>

## [dsh-qa](../../plugins/naodeng--dsh-qa/INSIGHT.md)

[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/naodeng/dsh-qa) [![npm 30d 2,032](https://img.shields.io/static/v1?label=npm+30d&message=2%2C032&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-qa) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-qa)

> **用途**：个人 QA 或测试负责人可以在 DSH 项目旁管理需求、测试执行与交付证据。

> **亮点**：[Q01](../../plugins/naodeng--dsh-qa/INSIGHT.md#research-q01) 的工作台把受控执行、证据保全和可解释门禁放到本机工作流。

> **思考**：[Q02](../../plugins/naodeng--dsh-qa/INSIGHT.md#research-q02) 发现任务门禁取项目最后一条运行，任务来源相同仍不足以证明证据属于所选任务。

> **建议**：[Q03](../../plugins/naodeng--dsh-qa/INSIGHT.md#research-q03) 提出贯通运行、证据和门禁的任务身份，并用交错运行验证归属。

[查看完整分析](../../plugins/naodeng--dsh-qa/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1334434866-root"></a>

## [dsh-recall-plugin](../../plugins/limbo947--dsh-recall-plugin/INSIGHT.md)

[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/limbo947/dsh-recall-plugin) [![npm 30d 7,107](https://img.shields.io/static/v1?label=npm+30d&message=7%2C107&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-recall-plugin) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-recall-plugin)

> **用途**：dsh-recall-plugin2.6.5是原生Host/客户端插件，目标是用户发现自己发错指令、Agent已改工作区，希望回到那轮前重新表述。完整撤回同时处理文件、会话版本与草稿；仅消息撤回/编辑重发则不动文件。成功须纳入范围的文件符合目标快照、会话确在正确turn边界、原会话可查且草稿/附件缺失被明确告知，不是按钮变成功。

> **亮点**：[Q01](../../plugins/limbo947--dsh-recall-plugin/INSIGHT.md#research-q01)、[Q03](../../plugins/limbo947--dsh-recall-plugin/INSIGHT.md#research-q03)将文件回退、会话切点和重发接入同一UI，真实预览/树指纹/忙碌/格式/救援与中断恢复护栏比单独fork多保护工作区。

> **思考**：[Q02](../../plugins/limbo947--dsh-recall-plugin/INSIGHT.md#research-q02)、[Q04](../../plugins/limbo947--dsh-recall-plugin/INSIGHT.md#research-q04)快照异步且范围有限，安全tag/journal可失败继续，文件/fork/归档/附件部分完成；不撤外部效果/所有人工改动，不是全组事务或秘密擦除。

> **建议**：[Q06](../../plugins/limbo947--dsh-recall-plugin/INSIGHT.md#research-q06)提出未验证的严格恢复锚档/阶段回执及捕获时点标注，用故障对照测无锚覆盖/误完成/人工编辑损失和恢复成本，不重造git。

[查看完整分析](../../plugins/limbo947--dsh-recall-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336856993-root"></a>

## [dsh-redteam-model](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md)

[![GitHub ★ 758](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=758&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SeaOf0/dsh-redteam-model)

> **用途**：已有明确授权与专业工具环境的安全研究人员，可关注合集的管理及结构/语义分工设计。

> **亮点**：[Q01](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q01) 与 [Q02](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q02)支持的贡献是将安全研究资产及多插件管理收拢，并记录变更状态；[Q03](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q03)结构与manual分工可借鉴，不能算新模型或已验证安全结果。

> **思考**：[Q03](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q03)说明pass只由结构checks决定，manual语义未因此通过；[Q02](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q02)取消不终止运行中的变更，中断failed也非回滚。根管理和流程文本不能代替全套授权及安全结论验收。

> **建议**：[Q05](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q05) 提出复用已有pass/manual字段的分离呈现假设，先排除现UI已有，再用结构齐全但结论错误的离线报告比较误放行；不能改善就不推广。

[查看完整分析](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333787962-root"></a>

## [dsh-remote](../../plugins/flymysql--dsh-remote/INSIGHT.md)

[![GitHub ★ 275](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=275&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/flymysql/dsh-remote) [![npm 30d 103,257](https://img.shields.io/static/v1?label=npm+30d&message=103%2C257&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote)

> **用途**：管理 SSH 主机的开发者可在 DSH 会话查看指定远端工作区及镜像。

> **亮点**：[Q01](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q01) 将会话绑定到镜像来源，[Q02](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q02) 提供可读的三路冲突反馈。

> **思考**：[Q02](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q02) 低约束默认可能允许远端命令，[Q03](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q03) 取消文案强于退出证据。

> **建议**：[Q04](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q04) 选择性内容回读和远端退出确认可能减少错误同步和重复执行。

[查看完整分析](../../plugins/flymysql--dsh-remote/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338300924-root"></a>

## [dsh-remote-ssh](../../plugins/zhangfengshun--dsh-remote-ssh/INSIGHT.md)

[![GitHub ★ 56](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=56&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZhangFengshun/dsh-remote-ssh) [![npm 30d 7,255](https://img.shields.io/static/v1?label=npm+30d&message=7%2C255&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zhangfengshun/dsh-remote-ssh) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zhangfengshun/dsh-remote-ssh)

> **用途**：这是原生DSH双面插件2.4.44，面向已有SSH服务器/超算账号、想在DSH同一会话操作远端工作区的人。Host接SSH工具/工作区和文件路由，客户端提供连接设置与远程目录流程，betterSidebar软注入才有远程编辑器页签；patch同时配置better-sidebar及新版terminal-controller的shell wrapper。因此不是新的SSH协议/沙箱，也不是仅把ssh命令提示给模型。成功须所选远端/目录真正收到命令和文件、模型/文件页/终端一致，结果与取消可核，不是工作区名字显示远程。

> **亮点**：[Q01](../../plugins/zhangfengshun--dsh-remote-ssh/INSIGHT.md#research-q01)、[Q02](../../plugins/zhangfengshun--dsh-remote-ssh/INSIGHT.md#research-q02)将连接、工作区上下文、原生目录/终端/文件及模型工具串起来，池化/缓存降低重复连接步骤；未测性能收益。

> **思考**：[Q02](../../plugins/zhangfengshun--dsh-remote-ssh/INSIGHT.md#research-q02)exec的cd失败仍继续、显式write直接覆盖且与README原子主张不符；[Q03](../../plugins/zhangfengshun--dsh-remote-ssh/INSIGHT.md#research-q03)、[Q04](../../plugins/zhangfengshun--dsh-remote-ssh/INSIGHT.md#research-q04)路径非权限界、超时不杀远端/取消尽力HUP，不能用于未核敏感写/计算。

> **建议**：[Q05](../../plugins/zhangfengshun--dsh-remote-ssh/INSIGHT.md#research-q05)提出未验证的canonical目标拒绝、临时写版本/rename和远端operation/job回执，在既有SSH/调度器上核错目录/损坏/重复与人审。

[查看完整分析](../../plugins/zhangfengshun--dsh-remote-ssh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1424433303-root"></a>

## [dsh-restart-dock](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md)

[![npm 30d 350](https://img.shields.io/static/v1?label=npm+30d&message=350&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-restart-dock) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-restart-dock)

> **用途**：Windows 上调试 DSH 插件的开发者需要频繁区分客户端刷新和 Host 重启；基线是关窗口、找快捷方式再打开。合格结果是只在用户二次确认后重启明确的 DSH 进程树，页面能区分失败、取消和恢复，正在执行的任务不会被误认为已保存。 详见[Q01](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md#research-q01)。

> **亮点**：[Q03](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md#research-q03) 将刷新/重启区分、尽力构建检查、页面倒计时和本地报告组合成开发入口；不是保证落盘的安全重启协议。

> **思考**：[Q04](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md#research-q04) 页面确认没有Host凭据约束，强停没有任务交接；[Q02](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md#research-q02) POST后无取消且恢复未绑定本次id。

> **建议**：未验证假设是把当前任务忙闲状态接入重启坞，只在会话已落盘且无活跃工具时启用“安全重启”，可减少中断事故。最小实验注入活跃/空闲/写盘三种状态各 20 次，比较当前按钮与门控版的误中断率、恢复成功率和等待时间；若忙闲信号漏报一次破坏性中断即不应自动启用。 详见[Q08](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422176522-root"></a>

## [dsh-restart-planner](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7gzgn/dsh-restart-planner) [![npm 30d 777](https://img.shields.io/static/v1?label=npm+30d&message=777&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-restart-planner) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-restart-planner)

> **用途**：代理安装或修改 Host 插件后需要重启才能继续，但当前进程不能杀死自己；基线是让用户手工重开并再次提示继续。合格结果是本轮回复先送达、会话落盘、明确目标被重拉、状态可审计，且自动继续只在新进程接受 prompt 后清标记。 详见[Q01](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md#research-q01)。

> **亮点**：[Q03](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md#research-q03) 增量是延迟重启计划、跨生命周期helper与会话继续标记的组合；静默只是一种启发式，不保证回复送达或落盘完成。

> **思考**：[Q04](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md#research-q04) 静默超时、取消与TCP健康都不能证明原任务安全交接；[Q07](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md#research-q07) 继续提示缺幂等收据。

> **建议**：未验证假设是给恢复标记增加原任务幂等键与上一步完成摘要，可把“继续一句话”升级为可判重的恢复协议。最小实验让 20 个含外部写入的任务在四个阶段重启，比较当前 prompt 与幂等恢复的重复副作用、丢步骤率和人工接管次数；任一重复写远端即否定自动恢复。 详见[Q08](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336677036-root"></a>

## [dsh-rewind](../../plugins/sirilee--dsh-rewind/INSIGHT.md)

[![GitHub ★ 260](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=260&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SiriLee/dsh-rewind) [![npm 30d 40,496](https://img.shields.io/static/v1?label=npm+30d&message=40%2C496&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rewind-plugin) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rewind-plugin)

> **用途**：在一个 DSH 会话中反复试探实现方案的开发者，可以回到某次指令之前，修改提示再发送。关键验收是上下文停在预期位置，选择文件恢复时工作区差异也符合预期。

> **亮点**：[Q01](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q01) 和 [Q02](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q02) 展示了同窗回退的组合贡献。插件复用 DSH 消息替换保持原日志，把真实用户消息同时作为文件检查点和提示词回填的锚点，使两种回退可以用一个界面发起。文件侧依靠稠密记录复用未变版本，适用范围由实际跟踪和保留窗口决定。

> **思考**：[Q02](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q02) 和 [Q03](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q03) 显示，宿主先提交对话标记，再逐文件删除或替换，旧格式快照会被忽略。跳过、版本缺失或进程中断后可能留下部分恢复，未被工具跟踪的改动也无法从这些文件记录追回。预览缺失或失败回执需触发独立核对。

> **建议**：[Q04](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q04) 提出把预览覆盖缺口、对话提交和逐文件结果拆成可核对的状态。以缺失备份和同大小外部编辑为对照样本，比较误继续频率及核对耗时，判断是否值得增加确认步骤。

[查看完整分析](../../plugins/sirilee--dsh-rewind/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334586481-root"></a>

## [dsh-routing-suite](../../plugins/yjh051108--dsh-routing-suite/INSIGHT.md)

[![GitHub ★ 6,997](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C997&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yjh051108/dsh-routing-suite)

> **用途**：面向反复调试DSH插件、调节任务persona并维护较长开发清单的高级用户。原办法是重启宿主、手工复制预设及聊天中打卡；合格结果是插件正确加载、当前路由可解释、任务按明确验收完成。它是三个组件的套装，不能把根包的收录理解为三个组件已经兼容当前宿主。

> **亮点**：相对单纯提示词，分级模块为任务编辑与锁定提供结构约束；相对每次重启开发，注入器试图缩短调试链。组合也增加了装配和状态责任，不能把三个部分的声明相加成整体收益。核心增量是开发时热装配与规格化交接，路由优于原生行为仍主要来自作者实验。 依据[Q03](../../plugins/yjh051108--dsh-routing-suite/INSIGHT.md#research-q03)。

> **思考**：核心限制有两项。README声明目标宿主<0.2.0，注入器实际访问loader.internal.loadCache并用registry.delete/plugin重建fiber，所以不能从目录收录推断当前0.2.x兼容。持久化调用链现已核清：mode-state.saveState捕获写错返回false，而index的setState不传播返回值；tools的revise_do调用saveState后直接返回ok:true，lock_stage也不检查保存结果。因此写失败时至少部分工具可能给出成功文本而磁盘仍旧，属于源码可见的错误传播缺口，尚未进行权限故障注入确认表现。不能把内存迁移和回执称为持久成功。 依据[Q04](../../plugins/yjh051108--dsh-routing-suite/INSIGHT.md#research-q04)。

> **建议**：未验证假设是将分级状态提交与工具成功结果绑定，磁盘失败时拒绝宣告阶段锁定，可以避免内存状态与重启后清单分歧。用同一清单分别注入写权限拒绝、截断JSON和热重载，检查用户看到的阶段及重载后的状态；若只能靠人工重建或工具仍报告成功，则假设未实现。 依据[Q08](../../plugins/yjh051108--dsh-routing-suite/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/yjh051108--dsh-routing-suite/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335780030-root"></a>

## [dsh-sandbox-escalation-fix](../../plugins/hakureimonika--dsh-sandbox-escalation-fix/INSIGHT.md)

[![GitHub ★ 56](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=56&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix) [![npm 30d 341](https://img.shields.io/static/v1?label=npm+30d&message=341&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sandbox-escalation-fix) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sandbox-escalation-fix)

> **用途**：受支持旧DSH上第三方模型反复发送无效升级参数时的局部修复。见 [Q01](../../plugins/hakureimonika--dsh-sandbox-escalation-fix/INSIGHT.md#research-q01)。

> **亮点**：会话级schema/参数/提示一致性修复，保留原delegate；不增加权限或替代沙箱。见 [Q01](../../plugins/hakureimonika--dsh-sandbox-escalation-fix/INSIGHT.md#research-q01)、[Q03](../../plugins/hakureimonika--dsh-sandbox-escalation-fix/INSIGHT.md#research-q03)。

> **思考**：官方已缓解使必要性待测，补丁又依赖具体工具契约；运行中不兼容可仅日志停包装，启动成功不证所有目标持续生效。见 [Q02](../../plugins/hakureimonika--dsh-sandbox-escalation-fix/INSIGHT.md#research-q02)、[Q03](../../plugins/hakureimonika--dsh-sandbox-escalation-fix/INSIGHT.md#research-q03)。

> **建议**：把会话权限投影与执行回执迁入原生宿主，比较无效调用和错误放行；官方已等效或陈旧schema更差即推翻。见 [Q04](../../plugins/hakureimonika--dsh-sandbox-escalation-fix/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/hakureimonika--dsh-sandbox-escalation-fix/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339251799-root"></a>

## [dsh-secure-audit](../../plugins/pensivefei--dsh-secure-audit/INSIGHT.md)

[![GitHub ★ 86](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=86&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PensiveFei/dsh-secure-audit) [![npm 30d 2,799](https://img.shields.io/static/v1?label=npm+30d&message=2%2C799&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-secure-audit) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-secure-audit)

> **用途**：需要在文本转交前检查风险与敏感字段的开发者。

> **亮点**：[Q01](../../plugins/pensivefei--dsh-secure-audit/INSIGHT.md#research-q01) 把扫描依据与覆盖状态接到模型工具；不自动强制阻断。

> **思考**：[Q02](../../plugins/pensivefei--dsh-secure-audit/INSIGHT.md#research-q02) 不完整默认allow与可配模型原文传输需要调用方处理。

> **建议**：[Q04](../../plugins/pensivefei--dsh-secure-audit/INSIGHT.md#research-q04) 对scanComplete的显式集成可能减少错误放行，尚未验证。

[查看完整分析](../../plugins/pensivefei--dsh-secure-audit/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1404374196-packages-dsh-sieve"></a>

## [dsh-sieve](../../plugins/sev7een7--dsh-sieve--packages-dsh-sieve/INSIGHT.md)

[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Sev7eEn7/dsh-sieve) [![npm 30d 1,523](https://img.shields.io/static/v1?label=npm+30d&message=1%2C523&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sieve) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sieve)

> **用途**：长编码会话维护者可用它减少重复日志进入模型的机会；任务质量和原文可取回是合格条件。[Q01](../../plugins/sev7een7--dsh-sieve--packages-dsh-sieve/INSIGHT.md#research-q01)

> **亮点**：它在工具结果入档前做有门槛的删减，并把历史批量替换与原文指针连接起来；这是可复用的集成设计，部分机制有第三方移植归属，不能称为全新算法。[Q01](../../plugins/sev7een7--dsh-sieve--packages-dsh-sieve/INSIGHT.md#research-q01) [Q02](../../plugins/sev7een7--dsh-sieve--packages-dsh-sieve/INSIGHT.md#research-q02)

> **思考**：保全原文并不保证模型会及时重读，判断失效也可能留下规则删减结果；净字符减少不能代替任务质量和总费用对照。[Q02](../../plugins/sev7een7--dsh-sieve--packages-dsh-sieve/INSIGHT.md#research-q02) [Q03](../../plugins/sev7een7--dsh-sieve--packages-dsh-sieve/INSIGHT.md#research-q03)

> **建议**：未验证假设是用重读输入、判断账单与人工恢复共同反馈删减策略，而不只最大化删字符；三组同任务对照若不能保持质量并降低总负担，应推翻它。[Q04](../../plugins/sev7een7--dsh-sieve--packages-dsh-sieve/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/sev7een7--dsh-sieve--packages-dsh-sieve/INSIGHT.md) · [返回表格](#category-index)

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

[![npm 30d 661](https://img.shields.io/static/v1?label=npm+30d&message=661&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-slipway) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-slipway)

> **用途**：面向反复发布 DSH 插件的个人维护者，串联本地预检、GitHub 上传、市场登记及选中文件回验。

> **亮点**：它把本地文件选择、预检、GitHub 上传、市场 PR 与哈希回验组织为可重复调用的阶段流程，相对零散 API 脚本提供统一交接记录；平台与哈希能力来自既有机制。该贡献限定编排便利，不能解释为原子发布或已证实节时，见 [Q01](../../plugins/7gzgn--dsh-slipway/INSIGHT.md#research-q01)。

> **思考**：所选文件的哈希相等不等于完整发布。dist 被无条件排除、常见 ./ exports 未核查、远端旧文件与同一提交未受回验约束；非预演报告还会在跳过回验或失败时追加回验完成尾句，必须读取真实阶段，见 [Q03](../../plugins/7gzgn--dsh-slipway/INSIGHT.md#research-q03)。

> **建议**：未来设计假设是将人工确认的完整清单固化为批次，再绑定单一目标提交和市场 PR 状态，生成可独立复核的发布证书。先用漏产物、中断和并发样本比较错误成功报告、恢复动作及总耗时；出现错误覆盖或恢复成本增加即削弱假设。此方向未验证，见 [Q05](../../plugins/7gzgn--dsh-slipway/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/7gzgn--dsh-slipway/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1412896722-root"></a>

## [dsh-snapshot-manager](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md)

[![npm 30d 1,642](https://img.shields.io/static/v1?label=npm+30d&message=1%2C642&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-snapshot-manager) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-snapshot-manager)

> **用途**：已有独立备份的 DSH 开发者可观察如何将工作区恢复与会话分支关联，见 [Q01](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q01) 与 [Q04](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q04) 将范围内文件恢复和会话 fork 放进同一预览流程，并以计划令牌与恢复点减轻部分误操作；不代表完整事务或备份。

> **思考**：[Q02](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q02) 异步采集可能混入轮次中的写入；[Q03](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q03) 的默认排除和全量删除，加上 [Q05](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q05) 运行态未知仍可能继续，使快照不能等同完整、隔离的备份。

> **建议**：[Q06](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q06) 假设将准确入队时间、未知项与运行状态做成明确门禁可降低误回滚；尚未实现或验证。

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

<a id="plugin-1333152408-root"></a>

## [dsh-suite（目录与维护工具）](../../plugins/whyihaveyou--dsh-suite/INSIGHT.md)

[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite)

> **用途**：寻找DSH扩展的用户可用统一目录筛候选，维护者可查看分层兼容线索，再逐项核查原仓库。[Q01](../../plugins/whyihaveyou--dsh-suite/INSIGHT.md#research-q01)

> **亮点**：把候选发现、分类、兼容检查和可读表格接在同一维护链，为人工筛选提供连续入口；增量是信息组织，不是插件功能验收。[Q01](../../plugins/whyihaveyou--dsh-suite/INSIGHT.md#research-q01)

> **思考**：统一ok/broken可混合静态、环境策略和组装检查，历史成功并集又不随失败退出；因此徽章可能被误读为当前版本功能通过。[Q03](../../plugins/whyihaveyou--dsh-suite/INSIGHT.md#research-q03)

> **建议**：利用已有分层报告给各项加精确版本与失效条件，可能减少把历史组装结果当当前功能结果的误读；同样本比较误读和维护负担，不能视为已实现。[Q04](../../plugins/whyihaveyou--dsh-suite/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/whyihaveyou--dsh-suite/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1332659211-root"></a>

## [dsh-super-injector](../../plugins/yjh051108--dsh-super-injector/INSIGHT.md)

[![GitHub ★ 167](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=167&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yjh051108/dsh-super-injector)

> **用途**：频繁构建与验证本地 DSH 插件的开发者。

> **亮点**：[Q01](../../plugins/yjh051108--dsh-super-injector/INSIGHT.md#research-q01) 将本地开发构建产物接到运行时 loader。

> **思考**：[Q02](../../plugins/yjh051108--dsh-super-injector/INSIGHT.md#research-q02) Web 和模型工具入口的预检及串行边界有差异。

> **建议**：[Q04](../../plugins/yjh051108--dsh-super-injector/INSIGHT.md#research-q04) 共用预检和状态回执以减少边界差异。

[查看完整分析](../../plugins/yjh051108--dsh-super-injector/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1335944000-tavern-plugin-packages-dsh-tavern"></a>

## [dsh-tavern 启动器](../../plugins/flizzywine--dsh-tavern--tavern-plugin-packages-dsh-tavern/INSIGHT.md)

[![GitHub ★ 1,520](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C520&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/flizzywine/dsh-tavern) [![npm 30d 10,991](https://img.shields.io/static/v1?label=npm+30d&message=10%2C991&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tavern) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tavern)

> **用途**：[Q01](../../plugins/flizzywine--dsh-tavern--tavern-plugin-packages-dsh-tavern/INSIGHT.md#research-q01) 面向需同时用原版 DSH 和酒馆的桌面用户。CLI 可手动指定 profile，官方 GUI 用户需要处理固定入口和回原版。

> **亮点**：[Q01](../../plugins/flizzywine--dsh-tavern--tavern-plugin-packages-dsh-tavern/INSIGHT.md#research-q01) 与 [Q02](../../plugins/flizzywine--dsh-tavern--tavern-plugin-packages-dsh-tavern/INSIGHT.md#research-q02) 将桌面切换、启动偏好及安装状态纳入同一面板。迁移、卸载和故障退让有单独边界。

> **思考**：[Q03](../../plugins/flizzywine--dsh-tavern--tavern-plugin-packages-dsh-tavern/INSIGHT.md#research-q03) 固定源码下载可变分支安装脚本，换入失败可能进入人工恢复。[Q02](../../plugins/flizzywine--dsh-tavern--tavern-plugin-packages-dsh-tavern/INSIGHT.md#research-q02) HTTP 备用路由依赖宿主栅栏和绑定，需核对真实环境。

> **建议**：[Q05](../../plugins/flizzywine--dsh-tavern--tavern-plugin-packages-dsh-tavern/INSIGHT.md#research-q05) 给普通链接切换增加阶段收据与实际路径复核，可能缩短中断恢复。应与已有 pending、journal 和人工检查对照。

[查看完整分析](../../plugins/flizzywine--dsh-tavern--tavern-plugin-packages-dsh-tavern/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334875164-root"></a>

## [dsh-thinking-effort](../../plugins/hytime--dsh-thinking-effort/INSIGHT.md)

[![GitHub ★ 57](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=57&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hytime/dsh-thinking-effort) [![npm 30d 5,406](https://img.shields.io/static/v1?label=npm+30d&message=5%2C406&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hytime/dsh-thinking-effort) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hytime/dsh-thinking-effort)

> **用途**：自定义模型缺少原生档位声明时，管理映射和子Agent默认。见 [Q01](../../plugins/hytime--dsh-thinking-effort/INSIGHT.md#research-q01)。

> **亮点**：最小设置层写入、新旧宿主适配和子Agent档位控制减少配置工作；不改变推理算法或替代网关transport。见 [Q03](../../plugins/hytime--dsh-thinking-effort/INSIGHT.md#research-q03)。

> **思考**：配置/点击不是生效证明，失败可继续原选择；默认补档也不证明网关支持，卸载不撤销持久写入。见 [Q02](../../plugins/hytime--dsh-thinking-effort/INSIGHT.md#research-q02)、[Q03](../../plugins/hytime--dsh-thinking-effort/INSIGHT.md#research-q03)。

> **建议**：验证从用户选择到最终transport参数的回执能否减少错映射和继承误判；宿主已等效或无改善即推翻。见 [Q04](../../plugins/hytime--dsh-thinking-effort/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/hytime--dsh-thinking-effort/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1332692519-root"></a>

## [dsh-tianshu-tui](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md)

[![GitHub ★ 297](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=297&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/huiliyi37/dsh-tianshu-tui) [![npm 30d 2,075](https://img.shields.io/static/v1?label=npm+30d&message=2%2C075&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huiliyi37/dsh-tianshu-tui) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huiliyi37/dsh-tianshu-tui)

> **用途**：[Q01](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q01) 面向在终端反复输入、读工具、审批和切换会话的 DSH 开发者；验收以准确投递、状态一致及最终文件正确为准。

> **亮点**：[Q01](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q01) 与 [Q02](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q02) 支持把移植渲染核心、宿主输入、只读投影和生命周期整合为终端工作面。增量是 DSH 接缝与交互组织，模型执行和大部分工具归属宿主/依赖，不把主题数或移植算法当原创。

> **思考**：[Q03](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q03) 表明整个 bundle 超出外观替换，审批白名单会直接放行，npm 启动更新会改 profile；skip 检查发生在 latest 获取之后，不能保证无查询。[Q02](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q02) 的本地排队也不等于指令已持久投递。

> **建议**：[Q06](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q06) 提出把当前工具/前缀授权和运行/安装版本合到可展开摘要，检验能否减少误放行或误判版本。现有模式、白名单读取和更新通知已存在，新增价值未验证。

[查看完整分析](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335139860-root"></a>

## [dsh-token-billing](../../plugins/2006spy--dsh-token-billing/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2006spy/dsh-token-billing)

> **用途**：面向DSH Web中混用不同provider/模型，希望在输入框附近看到本轮消耗、并汇总跨会话支出的个人用户。核心输入是会话事件与四档usage，插件输出费用行、统计、价目配置和CSV/JSON账本。它是消费可视化工具，不负责代扣费，也不验证业务任务产出。

> **亮点**：把估算到usage修正、provider价优先和事件时间政策接入会话投影，再提供步骤账本与导出，减少手工整理；不是正式账单或新tokenizer。详见[Q02](../../plugins/2006spy--dsh-token-billing/INSIGHT.md#research-q02)。

> **思考**：投影可撤销估算，但账本仅追加且同key不更新；宿主发布中间状态时退款可能留下持久条目。“节省”还涉及累计actual和跨币种口径，未运行复现。详见[Q03](../../plugins/2006spy--dsh-token-billing/INSIGHT.md#research-q03)。

> **建议**：可探索步骤revision与upsert/tombstone修订链、价版本和原币种收据，比较投影/总账差额、重放与体积；未实现。详见[Q06](../../plugins/2006spy--dsh-token-billing/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/2006spy--dsh-token-billing/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1327795364-packages-dsh-tool-csv"></a>

## [dsh-tool-csv](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-csv/INSIGHT.md)

[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)

> **用途**：在会话临时查看小型公开 CSV 的开发者可核对字段、行数和指定列的匹配样本。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-csv/INSIGHT.md#research-q01) 的引号状态和列级匹配让会话直接复核带逗号、换行的字段。

> **思考**：[Q02](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-csv/INSIGHT.md#research-q02) 发现 query 取首个同名列，parse 却由后值覆盖；limit 也不限制预解析成本。

> **建议**：[Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-csv/INSIGHT.md#research-q03) 提议回执显示列索引及截断，使用重名表头对照可否复原源列。

[查看完整分析](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-csv/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1327795364-packages-dsh-tool-diff"></a>

## [dsh-tool-diff](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-diff/INSIGHT.md)

[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)

> **用途**：开发者可在会话中复核两份小型公开配置或样例数据的差异。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-diff/INSIGHT.md#research-q01) 的路径级和键级回执让小型配置差异可在会话里复核，省去临时构造脚本。

> **思考**：[Q02](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-diff/INSIGHT.md#research-q02) 的重复键和裁切可让返回只覆盖部分差异；截断的补丁明示不可应用。

> **建议**：[Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-diff/INSIGHT.md#research-q03) 提出逐载荷公布截断和剩余变化计数，用接近预算的样本检查误读。

[查看完整分析](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-diff/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1327795364-packages-dsh-tool-encoding"></a>

## [dsh-tool-encoding](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-encoding/INSIGHT.md)

[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)

> **用途**：需要反复检查公开 API 样本或构造 URL 参数片段的开发者，可以直接请求会话工具并复核转换结果。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-encoding/INSIGHT.md#research-q01) 将公开文本转换做成直接的会话工具，[Q02](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-encoding/INSIGHT.md#research-q02) 的严格 Base64 门槛补足宽容解码可能忽略的字符与未用位错误。

> **思考**：[Q02](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-encoding/INSIGHT.md#research-q02) 的 UTF-8 解码器可能丢弃前导 BOM。[Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-encoding/INSIGHT.md#research-q03) 的参数记录意味着把文本转成摘要也不会避免原文进入会话。

> **建议**：[Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-encoding/INSIGHT.md#research-q03) 提出在工具契约中显式公布 BOM 策略，用多种编解码往返样本检查用户能否选到与数据一致的动作。

[查看完整分析](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-encoding/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1327795364-packages-dsh-tool-json"></a>

## [dsh-tool-json](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-json/INSIGHT.md)

[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)

> **用途**：开发者可在会话里从公开 API 样本取明确的字段及保留 JSON 类型的值。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-json/INSIGHT.md#research-q01) 核实查询直接消耗结构化参数，减少每次为简单取值建立 shell 命令。

> **思考**：[Q02](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-json/INSIGHT.md#research-q02) 的投影可能跳过元素并改变位置对应；输出上限在序列化后检查。

> **建议**：[Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-json/INSIGHT.md#research-q03) 提出可选的来源索引包装，以缺字段的对账样本检查可追溯性及输出代价。

[查看完整分析](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-json/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1402589370-root"></a>

## [dsh-tool-todo-plus](../../plugins/shuxidemosheng--dsh-tool-todo-plus/INSIGHT.md)

[![GitHub ★ 105](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=105&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shuxidemosheng/dsh-tool-todo-plus) [![npm 30d 1,503](https://img.shields.io/static/v1?label=npm+30d&message=1%2C503&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tool-todo-plus) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tool-todo-plus)

> **用途**：多步骤任务的用户可用完整清单与浮窗跟踪模型自报进度，不把它当结果验收。[Q01](../../plugins/shuxidemosheng--dsh-tool-todo-plus/INSIGHT.md#research-q01)

> **亮点**：把模型写入的完整清单和优先级持续展示，同时复用宿主日志；增量是可见性与交互，不是新的任务执行器。[Q01](../../plugins/shuxidemosheng--dsh-tool-todo-plus/INSIGHT.md#research-q01)

> **思考**：完成状态由模型直接声明，没有证据门禁；工具激活、浮窗可见和任务实际完成必须分开，2秒历史恢复启发式也可能误判。[Q02](../../plugins/shuxidemosheng--dsh-tool-todo-plus/INSIGHT.md#research-q02)

> **建议**：未验证假设是用明确恢复完成信号替代2秒窗口，减少历史误弹与即时写入漏弹；固定轨迹若错误不降或适配负担过大，就放弃。[Q03](../../plugins/shuxidemosheng--dsh-tool-todo-plus/INSIGHT.md#research-q03)

[查看完整分析](../../plugins/shuxidemosheng--dsh-tool-todo-plus/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335559646-root"></a>

## [dsh-trellis](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1264459640/dsh-trellis) [![npm 30d 2,737](https://img.shields.io/static/v1?label=npm+30d&message=2%2C737&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)

> **用途**：跨会话推进功能、缺陷或重构的 DSH 开发者可保存阶段产物与执行步骤，并在会话中查看当前任务。

> **亮点**：[Q01](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q01) 与 [Q02](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q02) 显示阶段文件、步骤及会话指针连接每轮提示，减少用户手工将状态重新放入会话的接线；这属于已有工作流的宿主适配。

> **思考**：[Q03](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q03) 的人工验证为工具输入字段，Git 超时等情况会放行；[Q04](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q04) 仅过滤指定工具，保留 shell，因此这些约束不能代替独立审批或写权限控制。

> **建议**：[Q06](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q06) 提出将独立验收收据绑定任务与代码提交并保留 Git 未知状态；这是未验证假设，需与现有 CI 及人工记录对照。

[查看完整分析](../../plugins/1264459640--dsh-trellis/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333111893-root"></a>

## [dsh-TUI](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md)

[![GitHub ★ 7,515](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C515&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ccch1mneyyy/dsh-TUI) [![npm 30d 74,635](https://img.shields.io/static/v1?label=npm+30d&message=74%2C635&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui)

> **用途**：面向经常在终端运行 DSH 的用户，用同一屏处理会话和工具活动。

> **亮点**：[Q01](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q01) 将 DSH 工作反馈放进同一终端。[Q02](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q02) 明确区分已有屏幕复用和独立挂载。

> **思考**：[Q03](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q03) 首次启动会写专用 profile，实际兼容和旧会话恢复需要先用固定宿主核对。

> **建议**：[Q04](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q04) 对照终端会话中断后的恢复，出现错会话或准备时间抵消节省时保持原用法。

[查看完整分析](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338526178-packages-bundle-rollback"></a>

## [dsh-undo rollback bundle](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md)

[![npm 30d 1,256](https://img.shields.io/static/v1?label=npm+30d&message=1%2C256&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin)

> **用途**：在 DSH 网页端修改本地代码的用户，可用组合入口协调文件恢复、会话分叉与归档；共享写者和外部副作用须另行处理。

> **亮点**：[Q01](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md#research-q01) 与 [Q02](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md#research-q02) 显示，它把私有文件树、精确会话前缀和归档接成一个 DSH 安装入口，减少手工对齐责任。私有索引与恢复算法由内部包实现，组合配置本身不构成独立新算法。

> **思考**：[Q03](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md#research-q03) 发现，文件恢复或补偿失败后仍可能写回 ready，而启动恢复不会重新核验该阶段。保护机制存在，但不能把可再次回退的状态名当无损恢复证明；目前应观察，并保留独立备份。

> **建议**：[Q05](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md#research-q05) 提出把普通异常的补偿结果纳入现有三资源核对，未核清前保持恢复要求。它相对现有启动恢复增加运行时约束；能否减少错误继续写入，需同条件故障对照，尚未验证。

[查看完整分析](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333816810-root"></a>

## [dsh-undo-savepoint](../../plugins/lire1131--dsh-undo-savepoint/INSIGHT.md)

[![GitHub ★ 194](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=194&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lire1131/dsh-undo-savepoint) [![npm 30d 5,289](https://img.shields.io/static/v1?label=npm+30d&message=5%2C289&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-savepoint) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-savepoint)

> **用途**：频繁改DSH配置/插件的用户要从坏配置恢复，需字节/依赖/重启正确，不是任意项目工作树撤销。

> **亮点**：[Q01](../../plugins/lire1131--dsh-undo-savepoint/INSIGHT.md#research-q01)、[Q02](../../plugins/lire1131--dsh-undo-savepoint/INSIGHT.md#research-q02) 限定配置/插件捕获与pre恢复、敏感占位拒写/字节回读/结果报告改善人工备份接线，外部面和作者跨平台声明不当本轮验收。

> **思考**：[Q03](../../plugins/lire1131--dsh-undo-savepoint/INSIGHT.md#research-q03) 逐文件覆盖无整批补偿且快照非整树，missing/skipped仍ok；手写route仅Origin约束、全局准入未核，vault真实秘密副本不是脱敏即安全。

> **建议**：[Q04](../../plugins/lire1131--dsh-undo-savepoint/INSIGHT.md#research-q04) 未验证内容版本/持久阶段收据、partial语义与前置预检，参照已有pre/明细/回读，用故障并发矩阵比误认恢复和停机成本。

[查看完整分析](../../plugins/lire1131--dsh-undo-savepoint/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1423215529-root"></a>

## [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)



> **用途**：多版本工具链出现命令找错、版本不一致时，开发者可收集胜出路径和遮蔽原因；结果是诊断材料，不是自动修复。详见[Q01](../../plugins/11111353535--dsh-which/INSIGHT.md#research-q01)。

> **亮点**：把胜出文件、遮蔽项和PATH异常组织成同一结构化诊断流程，并以可注入文件系统支持固定反例核查；增量是取证接线和解释，不是新的shell解析规则。详见[Q03](../../plugins/11111353535--dsh-which/INSIGHT.md#research-q03)。

> **思考**：报告是否对应实际shell仍受建模边界限制，Windows解析默认cmd表而环境可显示PowerShell；版本旗标也不能保证候选程序无副作用。这些为静态核查所得，未做运行复现。详见[Q04](../../plugins/11111353535--dsh-which/INSIGHT.md#research-q04)。

> **建议**：可从shell种类的显式传递和模型边界标注入手，将文件候选与实际shell事实分层；先用固定反例对照，再决定是否增加受控适配，当前未验证。详见[Q08](../../plugins/11111353535--dsh-which/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/11111353535--dsh-which/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334909671-root"></a>

## [dsh-workbench-plugin](../../plugins/loadingvx--deepseek-harness-workbench-plugin/INSIGHT.md)

[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/loadingvx/deepseek-harness-workbench-plugin) [![npm 30d 720](https://img.shields.io/static/v1?label=npm+30d&message=720&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workbench-plugin) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workbench-plugin)

> **用途**：在 DSH Web 与代理协作的开发者需要查看修改、处理本地代码和 Git。

> **亮点**：[Q01](../../plugins/loadingvx--deepseek-harness-workbench-plugin/INSIGHT.md#research-q01) 把 Web 会话与实际工作区和 Git 操作接起来。[Q03](../../plugins/loadingvx--deepseek-harness-workbench-plugin/INSIGHT.md#research-q03) 会话设置绑定到真实代理事件。

> **思考**：[Q02](../../plugins/loadingvx--deepseek-harness-workbench-plugin/INSIGHT.md#research-q02) 通用 Host 路由和已认证文件传输的身份检查有区别，PTY 还会继承环境。[Q03](../../plugins/loadingvx--deepseek-harness-workbench-plugin/INSIGHT.md#research-q03) 控制面会修改提示词，浏览代理发起 Host 网络请求。

> **建议**：[Q04](../../plugins/loadingvx--deepseek-harness-workbench-plugin/INSIGHT.md#research-q04) 以连接身份绑定工作区与会话，对浏览代理另设目标约束，用拒绝率和正常任务开销验证。

[查看完整分析](../../plugins/loadingvx--deepseek-harness-workbench-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344715132-root"></a>

## [dsh-workflow-templates](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md)

[![npm 30d 385](https://img.shields.io/static/v1?label=npm+30d&message=385&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workflow-templates) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workflow-templates)

> **用途**：用户明确需要 DSH workflow 大规模多 Agent 编排时，从常见任务模板起步。

> **亮点**：提供可检索的编排脚本起点和轻量格式诊断，减少空白起草。详见[Q01](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md#research-q01)。

> **思考**：invalid 模板仍可 run，缺参仅文字提醒；部分模板返回与描述不符，不能把格式校验当业务验收。详见[Q02](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md#research-q02)、[Q03](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md#research-q03)。

> **建议**：默认拒绝已知invalid/缺参并补业务输入输出契约，反证条件与维护代价见[Q05](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-workflow-templates/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336092482-01-content"></a>

## [dsh-worktable 内容组件](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md)

[![GitHub ★ 823](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=823&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-worktable)

> **用途**：个人多项目开发者集中文件/网页/终端/结果，正确归属与可恢复是结果，非窗口数量。

> **亮点**：[Q01](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md#research-q01)、[Q02](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md#research-q02) 显式身份降低旧结果串挂；[Q03](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md#research-q03) owner与opaque目录cap分离私有API/页面资源，不是项目文件隔离。

> **思考**：[Q02](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md#research-q02)、[Q04](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md#research-q04) 当前绑定不证内容版本，owner写可覆盖共享路径，撤销落盘吞错/旧WS不即时撤权；安全准入不能掩盖状态边界。

> **建议**：[Q06](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md#research-q06) 未验证产物generation/摘要与可见撤销持久收据，对照已有身份/handle复核测晚到错认和恢复负担，不称文件沙箱。

[查看完整分析](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-841979943-root"></a>

## [dsh-wrapup-guard](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/566001/dsh-wrapup-guard) [![npm 30d 74](https://img.shields.io/static/v1?label=npm+30d&message=74&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wrapup-guard) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wrapup-guard)

> **用途**：DSH 开发任务交付前的测试、审查、构建和一致性核对。

> **亮点**：把收尾过程显式化为检查工具、轮次状态和通知，降低遗漏提醒成本，但保证依赖如实调用/上报。详见[Q01](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md#research-q01)、[Q02](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md#research-q02)。

> **思考**：check 未与 report 门槛绑定，缺人工 checks 只是提醒，三次空 problems 可绕开所谓全面检查；状态落盘失败也被吞掉。详见[Q03](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md#research-q03)。

> **建议**：同轮证据绑定、失败阻断和按会话隔离通知，若在漏查/失败/多会话测试中降低误放行且耗时可接受，再考虑作为质量门；本版未实现。详见[Q04](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/566001--dsh-wrapup-guard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350379388-root"></a>

## [dsh-wsl-browser](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-browser)

> **用途**：WSL开发者需在Windows浏览器看本地服务/文档，正确页面实际可见才是结果。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md#research-q02) 模型可调用跨系统URL桥与协议限制，局部减少交接步骤；浏览器/服务可达来自外部环境。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md#research-q03) opened只进程级；localhost建议硬编码http且未验证首IP，不等端口修复，href/参数可能含敏感信息而未脱敏。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md#research-q04) 未验证方向为requested与Windows侧可达分离、保留scheme的建议；探测位置/隐私成本须明确，不能把预检当内容正确。

[查看完整分析](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350379113-root"></a>

## [dsh-wsl-cred](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-cred)

> **用途**：WSL用户配置Git HTTPS/SSH或排错时需要辨认helper与origin，报告准确归属不等认证已通过。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md#research-q02) 两命令和路径线索加协议建议合成模型可读报告，remote仅host回传、固定execFile可借鉴；价值限配置提示而非登录成功。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md#research-q03) 内联helper可能带敏感片段却原样进入helper/advice/render，绝对不回秘密主张不成立；[Q02](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md#research-q02) 错误当未配置、宿主cwd非会话仓库使诊断可误归属。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md#research-q04) 未验证方向是明确目标并只回类型/状态，区分执行失败与未配置，以假内联helper等夹具比较最终输出和诊断，不重复计已有remote最小化。

[查看完整分析](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350379001-root"></a>

## [dsh-wsl-distro](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-distro)

> **用途**：需要在 WSL 内辨认当前和 Windows 默认发行版的 DSH 用户。

> **亮点**：[Q02](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md#research-q02) 把多来源身份和路径提醒汇集到工具结果。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md#research-q03) 部分行可静默略过，工具层超时未传入内部固定子进程超时。

> **建议**：[Q05](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md#research-q05) 对照已有 raw 与差异提示，验证未解析行提示能否减少误选。

[查看完整分析](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854301-root"></a>

## [dsh-wsl-docker](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-docker)

> **用途**：Docker Desktop/WSL/推理容器混淆时初筛，真实daemon/端点/GPU与模型就绪另核。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q02) 聚合daemon与容器线索、focus和可注入run/fetch减少接线，非新探测算法，关键布尔仍需修正。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q03) 404/401也health ok遮专门404提示，空DeviceRequests可判GPU，仅expose可判publish，远程daemon与固定localhost错配；[Q02](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q02)吞错/无总取消。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q04) 待验证结构解析endpoint/映射/设备与分层收据/总deadline，反例仍绿灯即否定，生成测试不自动运行。

[查看完整分析](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854402-root"></a>

## [dsh-wsl-encoding](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-encoding)

> **用途**：WSL调Windows中文路径乱码或脚本CRLF故障，以实际命令/编码端与样本观测为准。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md#research-q02) 一工具汇合三端编码线索/换行样本，固定参数和纯core分层减少接线，不新增编码算法。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md#research-q03) 采样先整读、任意大路径无读限，失败false可让ok真；OR能力与前段无CRLF非全链通过，不能仅看主布尔。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md#research-q04) 未验证分端观测/error、fd有界样本覆盖和统一deadline，以冲突/不可读/后段CRLF/取消测假绿灯与总代价。

[查看完整分析](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338530482-root"></a>

## [dsh-wsl-env](../../plugins/173787247--dsh-wsl-env/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-env)

> **用途**：浏览器在Windows、工具在WSL的DSH用户，可在新会话获得本地发行版和路径背景。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-env/INSIGHT.md#research-q01) 支持自动填充局部环境事实并整合重复说明，降低每个会话手工组织背景的动作；这是提示集成，不是路径转换或安全隔离。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-env/INSIGHT.md#research-q02) 中always仍写WSL肯定句、路径固定/mnt/c且建议未探测的套件工具，可能让建议被误认成事实；自然语言不能约束真实工具参数。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-env/INSIGHT.md#research-q04) 提议分开已读事实与可选建议，并只在有挂载/工具依据时展示具体引导；若任务误导不降或额外成本抵消收益，则否定，尚未验证。

[查看完整分析](../../plugins/173787247--dsh-wsl-env/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351853956-root"></a>

## [dsh-wsl-expose](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-expose)

> **用途**：需从 LAN 访问 WSL 开发服务的用户；基线是手动检查网络并配置 Windows 规则。[Q01](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md#research-q01)

> **亮点**：把网络模式探测、命令建议和端口映射封装为 DSH 工具。[Q01](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md#research-q01) [Q02](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md#research-q02)

> **思考**：当前执行路径未检查文档所称 allowApply 或白名单，默认监听 0.0.0.0；删除未核对规则归属。[Q03](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md#research-q03) [Q04](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md#research-q04)

> **建议**：未验证假设：实际执行前强制 opt-in、白名单与前后快照可降低误暴露或误删；需对照现有 advise 与输入检查。[Q05](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381833309-root"></a>

## [dsh-wsl-git](../../plugins/173787247--dsh-wsl-git/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-git)

> **用途**：维护者接手工作区时需要快速判断分支和变更规模。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-git/INSIGHT.md#research-q01) 从会话直接取有限状态摘要，帮助选择随后要读的变更。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-git/INSIGHT.md#research-q02) 输入路径检查未绑定实际仓库顶层，多次状态读取可能不一致。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-git/INSIGHT.md#research-q03) 复核并显示 Git 顶层并统一状态输入，比较对错仓库和错误计数判断。

[查看完整分析](../../plugins/173787247--dsh-wsl-git/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350544211-root"></a>

## [dsh-wsl-github](../../plugins/173787247--dsh-wsl-github/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-github)

> **用途**：DSH开发Agent只读查看明确GitHub仓库PR/Actions状态，需核目标ref和权限，不替代PR合并检查。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-github/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-github/INSIGHT.md#research-q02) App最小字段提示/只读状态工具与API/push分工明确，正常路径不返回PEM/token；认证协议属于GitHub。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-github/INSIGHT.md#research-q03) 单槽token不比owner/安装/凭据版本，未匹配可取首安装；子查询失败仍ok/none，latest run也非目标PR检查全貌。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-github/INSIGHT.md#research-q04) 待验证是按安装/凭据版本缓存、owner不匹配拒绝与逐子状态/head绑定，对照已有note/error降低错误复用和误CI判断。

[查看完整分析](../../plugins/173787247--dsh-wsl-github/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381859919-root"></a>

## [dsh-wsl-glab](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-glab)

> **用途**：项目成员需要从交付会话快速定位待处理 MR、issue 和 CI 线索。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md#research-q01) 在会话内取得项目条目和流水线线索，便于跟进原件。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md#research-q02) 项目范围沿用宿主认证，issue 文本会将部分解析失败呈现为空，CI 状态需看实际退出和结果。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md#research-q03) 显示查询目标和格式状态，比较是否减少空列表与流水线结果误判。

[查看完整分析](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854010-root"></a>

## [dsh-wsl-hostsvc](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-hostsvc)

> **用途**：开发者排WSL到Windows本地模型连接/容量问题，需分TCP/API/生成，不把诊断草稿当已修复。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md#research-q02) 将host发现、常用端口、模型API/容量与草稿汇成工具，HTTP层失败可见；模型/网络能力归环境，不算新诊断算法。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md#research-q03) 主ok/URL/模板仍可TCP触发，apiReady非生成；元数据回退/固定模板非真实runner容量，顺序探测缺总deadline/取消，自定义host非仅Windows。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md#research-q04) 未验证分层收据与统一预算/取消，以每层实证限制建议强度，授权生成有新增资源负担，不能把已有apiReady重复算增量。

[查看完整分析](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381389698-root"></a>

## [dsh-wsl-jev](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-jev)

> **用途**：用预设判据核对主张、回答标签或从若干候选中选一项。

> **亮点**：给 DSH 一组固定类型的判断入口，调用方可直接复核标签和候选，不必从散文抽取。[Q01](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md#research-q01) [Q02](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md#research-q02)

> **思考**：脱敏只识别有限键名和形状，证据可能重复出现在未限长的题目中，不能据此传敏感内容。[Q03](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md#research-q03)

> **建议**：用证据引用与响应校验减少外发，在人工标签集上测误判、外发字符和复核时长。尚未验证。[Q04](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350378498-root"></a>

## [dsh-wsl-launch](../../plugins/173787247--dsh-wsl-launch/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-launch)

> **用途**：使用 WSL DSH 并需启动 Windows 应用的用户；基线为手工在 Windows 启动。[Q01](../../plugins/173787247--dsh-wsl-launch/INSIGHT.md#research-q01)

> **亮点**：将受名称规则约束的 Windows 应用启动接入 DSH 工具。[Q01](../../plugins/173787247--dsh-wsl-launch/INSIGHT.md#research-q01)

> **思考**：名称匹配不验证程序身份；参数不受限且成功输出包含参数。[Q03](../../plugins/173787247--dsh-wsl-launch/INSIGHT.md#research-q03)

> **建议**：未验证假设：绝对路径身份核验与脱敏预览可减少同名程序与敏感参数风险，须对照现有规则。[Q05](../../plugins/173787247--dsh-wsl-launch/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/173787247--dsh-wsl-launch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350378631-root"></a>

## [dsh-wsl-path](../../plugins/173787247--dsh-wsl-path/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-path)

> **用途**：需要在 WSL 与 Windows 之间交接路径的 DSH 用户。

> **亮点**：[Q02](../../plugins/173787247--dsh-wsl-path/INSIGHT.md#research-q02) 将常见驱动器及 WSL UNC 文本转换与说明接入 DSH 工具。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-path/INSIGHT.md#research-q03) 工具保留原 UNC 的 input，但未单列解析出的发行版，也不验证 output 是否与当前发行版中的文件相同。

> **建议**：[Q05](../../plugins/173787247--dsh-wsl-path/INSIGHT.md#research-q05) 对照已有原 UNC input、标签和 advice，验证单列发行版及差异提示能否减少错误目标。

[查看完整分析](../../plugins/173787247--dsh-wsl-path/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351853863-root"></a>

## [dsh-wsl-picker](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-picker)

> **用途**：WSL用户定位/筛选目录再选择工作区，非图形文件选择和登记服务，路径元数据进入模型需授权。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md#research-q02) 将根/盘符/IM快捷入口、过滤与截断结构交给Agent，减少人工拼目录结果；不混入工作区登记或Windows对话框。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md#research-q03) 无允许根/realpath隔离可列进程可读目录并跟软链接，名称外发有隐私；先全量同步读排序，15秒timeout与200返回项不保证限时/限工作量。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md#research-q04) 待验证允许根/敏感元数据与异步限时分页，对照已有filter/truncated和宿主策略测越界/完整性/负担，未实现不计贡献。

[查看完整分析](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381861315-root"></a>

## [dsh-wsl-pkg](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-pkg)

> **用途**：维护者快速定位项目依赖或环境异常。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md#research-q01) 在同一会话取得三类依赖线索，方便决定接下来读哪些原件。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md#research-q02) npm 错误与摘要切片可能没有清楚标记，pip 口径也不同。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md#research-q03) 独立标记失败及两种截断，测完整性误读。

[查看完整分析](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350378913-root"></a>

## [dsh-wsl-port](../../plugins/173787247--dsh-wsl-port/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-port)

> **用途**：Windows 无法访问 WSL 服务时需要初步诊断的用户；基线为手工查询本地网络。[Q01](../../plugins/173787247--dsh-wsl-port/INSIGHT.md#research-q01)

> **亮点**：将本地监听线索和 DSH relay 操作建议集中到工具。[Q01](../../plugins/173787247--dsh-wsl-port/INSIGHT.md#research-q01)

> **思考**：WSL 本地 ss 匹配不证明 Windows relay、HTTP 或 token 登录成功。[Q03](../../plugins/173787247--dsh-wsl-port/INSIGHT.md#research-q03)

> **建议**：未验证假设：经用户同意分层检查 WSL 与 Windows relay，可补充现有本地 ss 和健康脚本建议。[Q05](../../plugins/173787247--dsh-wsl-port/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/173787247--dsh-wsl-port/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381725987-root"></a>

## [dsh-wsl-search](../../plugins/173787247--dsh-wsl-search/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-search)

> **用途**：在固定项目根目录内从文件名、文本或结构模式定位源码。

> **亮点**：让代理在同一会话中按任务选择文本、文件或结构搜索，返回可定位线索。[Q01](../../plugins/173787247--dsh-wsl-search/INSIGHT.md#research-q01) [Q02](../../plugins/173787247--dsh-wsl-search/INSIGHT.md#research-q02)

> **思考**：允许根约束的是查询起点，默认含整个 HOME；返回计数也不能解释是否已截断。[Q02](../../plugins/173787247--dsh-wsl-search/INSIGHT.md#research-q02) [Q03](../../plugins/173787247--dsh-wsl-search/INSIGHT.md#research-q03)

> **建议**：显式暴露截断与计数口径，测可复核任务的误归纳和补查率。尚未验证。[Q04](../../plugins/173787247--dsh-wsl-search/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/173787247--dsh-wsl-search/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854356-root"></a>

## [dsh-wsl-ssh-agent](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-ssh-agent)

> **用途**：WSL Git SSH排障的个人用户需分socket/可通信/身份/目标授权，报告不是认证完成。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md#research-q02) 元数据减量诊断与SSH/HTTPS分工，成功不返key全文/指纹注释，不启动桥或读私钥内容。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md#research-q03) sockAlive只是exists、私钥只是名字；查询失败归0并在文本漏detail，ok不等目标授权，配置/取消未接内部命令。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md#research-q04) 未验证socket/查询退出/身份/时点分层与统一预算，最小化输出下比较误建议/披露/等待，非新私钥读取。

[查看完整分析](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381832935-root"></a>

## [dsh-wsl-struct](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-struct)

> **用途**：开发者从模型会话查看 JSON、YAML 和数据库样例。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md#research-q01) 把三类文件查询接到模型工具，适合只取几个字段而非读入整文件。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md#research-q02) 主文件路径检查与表达式进程隔离是两层边界，实际 CLI 权限仍需核对。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md#research-q04) 用受控文件集合运行表达式，比较根外可读性和合法查询回归。

[查看完整分析](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381833652-root"></a>

## [dsh-wsl-tmux](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-tmux)

> **用途**：维护者要从当前会话查明后台任务是否报错。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md#research-q01) 把会话枚举和输出快照接到 DSH，可快速查一段运行线索。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md#research-q02) 当前只接受会话目标，读到哪个 pane 取决于 tmux，退出码 1 还可能表现成空列表。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md#research-q03) 按精确 pane ID 捕获并回显，对照是否减少多 pane 误选。

[查看完整分析](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391141792-root"></a>

## [dsh-wsl-uia](../../plugins/173787247--dsh-wsl-uia/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-uia)

> **用途**：测试者需要查看 Windows 控件的身份、能力和结构线索。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-uia/INSIGHT.md#research-q01) 在会话内提供语义控件与父级路径线索。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-uia/INSIGHT.md#research-q02) 句柄只属于观测结果，结果上限和等待预算也不能保证遍历完整或严格时限。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-uia/INSIGHT.md#research-q03) 回显遍历停止原因并传播剩余时间，比较漏检误读。

[查看完整分析](../../plugins/173787247--dsh-wsl-uia/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391143632-root"></a>

## [dsh-wsl-winctl](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-winctl)

> **用途**：桌面测试者需要安排测试窗口布局并检查结果。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md#research-q01) 将窗口枚举及布局动作接到 WSL 会话。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md#research-q02) 缺省目标可能选到第一扇窗口，成功响应不证明 Win32 动作完成。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md#research-q03) 强制唯一目标并验证新状态，比较误操作。

[查看完整分析](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391142149-root"></a>

## [dsh-wsl-wininput](../../plugins/173787247--dsh-wsl-wininput/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-wininput)

> **用途**：开发者调试可弃用 Windows 桌面流程。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-wininput/INSIGHT.md#research-q01) 将语义调用与桌面输入接入 WSL 会话。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-wininput/INSIGHT.md#research-q02) 实际按名称找控件，键盘和坐标路径没有验证实际输入目标。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-wininput/INSIGHT.md#research-q03) 绑定窗口并复核焦点及坐标，比较误输入。

[查看完整分析](../../plugins/173787247--dsh-wsl-wininput/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391140767-root"></a>

## [dsh-wsl-winshot](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-winshot)

> **用途**：桌面流程排查需要将指定窗口画面保存到 WSL。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md#research-q01) 将目标选择、元素裁剪和 PNG 落盘串成一个会话工具。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md#research-q02) 矩形抓取读取实际屏幕，可能包含遮挡内容，也会恢复最小化窗口并写文件。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md#research-q03) 在抓取前复核身份与遮挡，比较错捕和额外延迟。

[查看完整分析](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334205011-root"></a>

## [dsh-wsl-workspace](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md)

[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,542](https://img.shields.io/static/v1?label=npm+30d&message=2%2C542&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-workspace)

> **用途**：Windows 上的 DSH 用户希望操作 WSL 项目。

> **亮点**：[Q01](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md#research-q01) 让会话使用 WSL 工作区，[Q02](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md#research-q02) 连接发行版、shell 和文件路径。

> **思考**：[Q03](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md#research-q03) 自动伪终端重跑可能重复副作用；WSL 仍可访问 Windows 挂载盘。

> **建议**：[Q05](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md#research-q05) 假设重跑前的人工确认可减少重复副作用；尚未验证。

[查看完整分析](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351853812-root"></a>

## [dsh-wsl-workspace](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-workspace)

> **用途**：在WSL开始或排查DSH项目的用户需辨发行版和路径位置，最终项目构建/权限另核。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q02) 将发行版和路径常识整理成窄只读模型工具，分离纯规则与命令，减少手工拼结果，不继承套件其他诊断能力。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q03) 分类先于realpath可使path与kind/onMnt/ok不一致；/mnt标签不证性能，list吞错仍ok、宿主cwd和.git存在性也有限。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q04) 未验证是按真实路径/明确错误再选授权工作负载探针，比较符号链接/自定义挂载误建议；不把临时写探针伪装只读。

[查看完整分析](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854461-root"></a>

## [dsh-wsl-wslconfig](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-wslconfig)

> **用途**：个人用户排Windows/WSL网络资源配置，先核真实profile及声明/加载/连通层。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md#research-q02) 配置定位/解释与常见建议接单工具，pure可注入便于核查，不提供生效/性能机制。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md#research-q03) 首存在候选非权威profile，截后键缺失/读取错仍ok和空mode建议；原文外发与整读成本不可被2000限额掩盖。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md#research-q04) 待验证来源确认/读取覆盖与声明-加载-连通收据及最小键输出，测误诊/原文外发和总代价，不自动改/shutdown。

[查看完整分析](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334296085-root"></a>

## [DSHana](../../plugins/nyasers--dshana/INSIGHT.md)

[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nyasers/DSHana)

> **用途**：已在Hana工作且需委派DSH编码任务的人，可少拷贝任务/结果；runtime、接受、终态和业务验收分别核实，见 [Q01](../../plugins/nyasers--dshana/INSIGHT.md#research-q01)。

> **亮点**：把受管启动、来源句柄、后台回投、审批与宿主模型接成委派链，不只是内嵌网页；真实兼容/效果未验，见 [Q01](../../plugins/nyasers--dshana/INSIGHT.md#research-q01)至 [Q04](../../plugins/nyasers--dshana/INSIGHT.md#research-q04)。

> **思考**：local-machine无文件系统隔离，ready不保证两桥成功，DSH回合完成非业务验收；终态回投/stop失败可能只日志，句柄归属有显式ID/无context退路，见 [Q02](../../plugins/nyasers--dshana/INSIGHT.md#research-q02)至 [Q04](../../plugins/nyasers--dshana/INSIGHT.md#research-q04)。

> **建议**：未验证方向是独立桥健康与结算待确认/收尾证据，以四故障样本比较未知误判、重复提交与维护负担，见 [Q06](../../plugins/nyasers--dshana/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/nyasers--dshana/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1280115203-root"></a>

## [easyeda-agent](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md)

[![GitHub ★ 906](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=906&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhoushoujianwork/easyeda-agent)

> **用途**：能核对电路和制造规则的工程师可在工程副本中读取真实对象、试有限编辑并回读，最终结果需身份、引脚、几何、检查和保存证据，而非单一动作成功。

> **亮点**：[Q01](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q01)、[Q02](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q02) 支持的贡献是DSH配置接线、类型化工具目录与真实目标约束，配合领域Skill要求回读和保存。CLI、EDA官方接口与专业资料各有独立职责，不把根空apply误作无功能，也不把集成夸为新EDA算法。

> **思考**：[Q03](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q03) 超时不等于EDA未修改，普通放弃后仍可晚到；整文档roundtrip则继续占住FIFO直到handler结束。handler返回、局部DRC与外层ok都不能证明保存或生产合格，不能用盲重试解决未知状态。

> **建议**：[Q05](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q05) 条件性未验证假设是把未知写、原目标与后续只读核对组织为审阅记录，减少错误解除未知和重复修改。现有Skill已有先回读/不盲重发，须先排除CLI/audit等价能力，再比较恢复错误与复核投入。

[查看完整分析](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1139909532-root"></a>

## [Everything Kiro](../../plugins/iamaanahmad--everything-kiro/INSIGHT.md)

[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iamaanahmad/everything-kiro)

> **用途**：[Q01](../../plugins/iamaanahmad--everything-kiro/INSIGHT.md#research-q01) 熟悉Kiro的开发者选择复用工作流与配置，合格结果是目标工程正确加载且每条副作用可解释。

> **亮点**：[Q01](../../plugins/iamaanahmad--everything-kiro/INSIGHT.md#research-q01) 将角色、分阶段Spec、事件检查和外部工具示例整理为可按项审阅的配置起点，减少重复收集文档的责任，未证明运行收益。

> **思考**：[Q02](../../plugins/iamaanahmad--everything-kiro/INSIGHT.md#research-q02) 保存hook可自动写回且依赖npx/pwsh；敏感规则有限，postgres query默认autoApprove与Power指南冲突，广泛allow示例不能当安全边界。

> **建议**：[Q03](../../plugins/iamaanahmad--everything-kiro/INSIGHT.md#research-q03) 未验证项目配置验收清单绑定依赖、触发、写回和权限，默认关闭未验项；以错误启用/意外写入/耗时对照，无改善或维护更贵即否定。

[查看完整分析](../../plugins/iamaanahmad--everything-kiro/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1311955212-root"></a>

## [Flameox](../../plugins/morluto--flameox/INSIGHT.md)

[![GitHub ★ 231](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=231&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/flameox)

> **用途**：有Profiler知识的开发者让编码Agent解释性能材料；先处理显式脱敏artifact，合格结果需原材料身份、覆盖和限制，最终优化仍需语义测试与代表性工作负载。

> **亮点**：[Q01](../../plugins/morluto--flameox/INSIGHT.md#research-q01) 与 [Q02](../../plugins/morluto--flameox/INSIGHT.md#research-q02)表明工具把异构Profiler结果变为有输入身份、coverage和limitation的证据，capture和分页分离，临时analysis_id与持久evidence_id分清。相对手写脚本可减少上下文和来源口径漂移，原Profiler采集／统计不归根原创。

> **思考**：[Q03](../../plugins/morluto--flameox/INSIGHT.md#research-q03) cwd不是sandbox，capture运行可信本地程序，预算抽样且部分可选，原始证据也可能含敏感信息。[Q04](../../plugins/morluto--flameox/INSIGHT.md#research-q04) profile与描述估计不能证明语义正确、因果或性能提升；统一接口不等所有provider可用。

> **建议**：[Q04](../../plugins/morluto--flameox/INSIGHT.md#research-q04)由过期analysis_id和显式preserve推导按结论依赖提示最小保留证据清单，可能降低重启丢证与盲目全保存。用另一人重建结论比较成功率、存储和工时；重现不增或总投入升即否定，尚未实现不计贡献。

[查看完整分析](../../plugins/morluto--flameox/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1323569556-plugins-deepseek-harness-flowx"></a>

## [FlowX for DeepSeek Harness](../../plugins/aiprobuilder--flowx--plugins-deepseek-harness-flowx/INSIGHT.md)

[![GitHub ★ 202](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=202&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AIpRoBuilder/FlowX)

> **用途**：已有 FlowX 项目的 DSH Web 使用者可从对话旁查看当前计划图和已发布流程资料。

> **亮点**：[Q01](../../plugins/aiprobuilder--flowx--plugins-deepseek-harness-flowx/INSIGHT.md#research-q01) 与 [Q02](../../plugins/aiprobuilder--flowx--plugins-deepseek-harness-flowx/INSIGHT.md#research-q02) 显示，查看器把流程索引、计划图和发布资料带入 DSH 的同一界面，底层解析复用 FlowX SDK。

> **思考**：[Q03](../../plugins/aiprobuilder--flowx--plugins-deepseek-harness-flowx/INSIGHT.md#research-q03) 确认界面只提供浏览和设置，但宿主仍保留实际构建 API，且调用者身份依赖宿主的共享 Fetch 入口。

> **建议**：[Q04](../../plugins/aiprobuilder--flowx--plugins-deepseek-harness-flowx/INSIGHT.md#research-q04) 的待验证假设是计划和发布并列能减少误读及查找时间。若额外配置抵消收益或无法区分两者，放弃假设。

[查看完整分析](../../plugins/aiprobuilder--flowx--plugins-deepseek-harness-flowx/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1261092598-root"></a>

## [ForkProbe](../../plugins/jayden-x-l--forkprobe/INSIGHT.md)

[![GitHub ★ 74](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=74&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jayden-X-L/forkprobe)

> **用途**：用户想在投入任务前选择合适Skill。

> **亮点**：[Q01](../../plugins/jayden-x-l--forkprobe/INSIGHT.md#research-q01) 把候选真实输出和选择交接放在同一记录。

> **思考**：[Q03](../../plugins/jayden-x-l--forkprobe/INSIGHT.md#research-q03) 关闭分享不能阻止旧outbox启动重发；[Q04](../../plugins/jayden-x-l--forkprobe/INSIGHT.md#research-q04) 独立判定进程与完整本地bundle需显式清理。

> **建议**：[Q05](../../plugins/jayden-x-l--forkprobe/INSIGHT.md#research-q05) 比较报告可改善选型，但需质量与总成本对照。

[查看完整分析](../../plugins/jayden-x-l--forkprobe/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334303936-root"></a>

## [Godot Bridge](../../plugins/smalldy--godot-bridge/INSIGHT.md)

[![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Smalldy/godot-bridge) [![npm 30d 150](https://img.shields.io/static/v1?label=npm+30d&message=150&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/godot-bridge) [![最新发布 2021-03-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2021-03-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/godot-bridge)

> **用途**：godot-bridge0.2.1是原生DSH工具/客户端配置插件，让Agent启动Godot4项目、查询场景/UI、操作运行态、截图/eval和执行headless/项目文件操作。目标是开发时从改代码到实际游戏观察的短反馈回路，不是仅生成GDScript；成功仍需目标场景状态/交互与导出产物被核验。

> **亮点**：[Q01](../../plugins/smalldy--godot-bridge/INSIGHT.md#research-q01)原生替代MCP并整合运行/headless/项目操作；[Q02](../../plugins/smalldy--godot-bridge/INSIGHT.md#research-q02)真实运行态反馈；[Q03](../../plugins/smalldy--godot-bridge/INSIGHT.md#research-q03)实例归属/调试trap边界。

> **思考**：[Q03](../../plugins/smalldy--godot-bridge/INSIGHT.md#research-q03)token非认证、eval真代码/共享实例，超时stop不保证回滚；[Q04](../../plugins/smalldy--godot-bridge/INSIGHT.md#research-q04)export success判据不足、autoload会改项目，运行态不等持久修复。

> **建议**：[Q05](../../plugins/smalldy--godot-bridge/INSIGHT.md#research-q05)项目/实例/前后状态/保存/可运行导出回执，故障与人工对照验返工，不把未实现算创新。

[查看完整分析](../../plugins/smalldy--godot-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1229298801-root"></a>

## [Grove](../../plugins/alxshelepenok--grove/INSIGHT.md)

[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/alxshelepenok/grove)

> **用途**：用于跨会话维护工程目标、任务依赖和验收记录。

> **亮点**：为跨会话进度增加前置条件和可核查的记录字段，后续代理可查下一项及对应包。[Q01](../../plugins/alxshelepenok--grove/INSIGHT.md#research-q01) [Q02](../../plugins/alxshelepenok--grove/INSIGHT.md#research-q02)

> **思考**：CLI 检查图条件和证据字段，仍需要独立核验实际测试；DSH 适配器的项目目录和版本要另查。[Q03](../../plugins/alxshelepenok--grove/INSIGHT.md#research-q03)

> **建议**：对比引入可重放命令和固定输入后的误报、误拒及维护成本。尚未验证。[Q04](../../plugins/alxshelepenok--grove/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/alxshelepenok--grove/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1307156567-root"></a>

## [Hedgehog](../../plugins/skyf0xx--hedgehog/INSIGHT.md)

[![GitHub ★ 47](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=47&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/skyf0xx/hedgehog) [![npm 30d 1,076](https://img.shields.io/static/v1?label=npm+30d&message=1%2C076&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@skyf0xx/hedgehog) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@skyf0xx/hedgehog)

> **用途**：愿意声明intent/scope/verify并审Git的仓库维护者，在可弃置新仓单任务试纪律，见 [Q01](../../plugins/skyf0xx--hedgehog/INSIGHT.md#research-q01)/[Q06](../../plugins/skyf0xx--hedgehog/INSIGHT.md#research-q06)。

> **亮点**：把intent/依赖/范围/租约/验证和commit记录接成可查询交接，协调者有真实程序入口而非只信done，见 [Q03](../../plugins/skyf0xx--hedgehog/INSIGHT.md#research-q03)-[Q04](../../plugins/skyf0xx--hedgehog/INSIGHT.md#research-q04)。

> **思考**：verify会执行shell并自动commit，noop可不跑测试、reconcile有人判断路径，Git与DB非共同事务；index/lease/外部writer和业务验收不能靠complete证明，见 [Q04](../../plugins/skyf0xx--hedgehog/INSIGHT.md#research-q04)-[Q05](../../plugins/skyf0xx--hedgehog/INSIGHT.md#research-q05)。

> **建议**：提交前只读核完整index归属，拒绝未许可异task暂存而不自动reset，和现范围门/人工cached diff对照，误归属不降或误拒更重即否定，见 [Q07](../../plugins/skyf0xx--hedgehog/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/skyf0xx--hedgehog/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 1,024](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C024&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ADWMC/helm-d) [![npm 30d 545](https://img.shields.io/static/v1?label=npm+30d&message=545&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@adwmc/helm-d)

> **用途**：授权安全分析人员可将样本分析的部分工具输出和发现组织到案例中，并在后续会话恢复。

> **亮点**：[Q01](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q01) 与 [Q02](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q02) 显示案例绑定、部分工具输出编号和恢复入口的集中接线；它有助于组织材料，但不能代替原件和结论审核。

> **思考**：[Q03](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q03) 的编号、命令文本及可选调用轨迹检查不验证证据蕴含或实际复现；[Q02](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q02) 长输出可能只留截断片段，需独立保存原始材料。

> **建议**：[Q06](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q06) 提出可审证据层与行为干预分离的未验证假设，需对照完整原始日志及人工审查。

[查看完整分析](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334304098-root"></a>

## [helm-d](../../plugins/adwmc--helm-d/INSIGHT.md)

[![GitHub ★ 933](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=933&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ADWMC/helm-d)

> **用途**：授权安全评估中需要记录分析工具输出和结论。

> **亮点**：[Q01](../../plugins/adwmc--helm-d/INSIGHT.md#research-q01) 作者描述集中工具和案卷；[Q02](../../plugins/adwmc--helm-d/INSIGHT.md#research-q02) 根项目维护版本和发布包检查。

> **思考**：[Q03](../../plugins/adwmc--helm-d/INSIGHT.md#research-q03) 文档的引用门禁声明不证明实现或结论真实性；[Q04](../../plugins/adwmc--helm-d/INSIGHT.md#research-q04) 目标授权与供应链仍需独立确认。

> **建议**：[Q05](../../plugins/adwmc--helm-d/INSIGHT.md#research-q05) 假设将固定提交、构建及资产摘要绑定为可验证发行收据可减少错配；未验证。

[查看完整分析](../../plugins/adwmc--helm-d/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1086419061-hindsight-integrations-coding-agents"></a>

## [Hindsight for Coding Agents](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md)

[![GitHub ★ 60,482](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60%2C482&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vectorize-io/hindsight) [![npm 30d 126,990](https://img.shields.io/static/v1?label=npm+30d&message=126%2C990&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)

> **用途**：经常在同一代码库开新会话的开发者，可以用 Hindsight 在新任务中带入过去决定，并选择保留新增会话内容。

> **亮点**：[Q01](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q01) 和 [Q02](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q02) 的增量是将共享记忆内核接到 DSH 的新输入及回合结束，并按会话目录路由读取、工具和写回。共享检索和存储来自 Hindsight 内核，DSH 接入提供生命周期和工作区绑定。

> **思考**：[Q02](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q02) 与 [Q03](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q03) 显示，bank 路由受目录与配置影响，后台写回也可能失败。依赖团队隔离或处理敏感内容时，需先核实凭据和部署权限以及服务端记录，不能仅凭会话继续来判断已成功或已隔离。

> **建议**：[Q04](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q04) 提出待验证假设：对有较多分散决定的项目，自动交接能减少重复整理。用准确恢复约定且可回查来源的任务，对照人工摘要，计入等待和纠错后若无净节省则放弃假设。

[查看完整分析](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1137545389-root"></a>

## [iKanban](../../plugins/isomoes--ikanban/INSIGHT.md)

[![GitHub ★ 15](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=15&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/isomoes/ikanban)

> **用途**：[Q01](../../plugins/isomoes--ikanban/INSIGHT.md#research-q01) 面向已有OpenCode V2后端、需要浏览器/PWA和多服务器的开发者；以正确后端/会话投递和任务结果为验收。

> **亮点**：[Q01](../../plugins/isomoes--ikanban/INSIGHT.md#research-q01) 独立静态部署与多服务器交互组织，加上 [Q02](../../plugins/isomoes--ikanban/INSIGHT.md#research-q02) 的连接/缓存owner分层，为浏览器管理提供集成价值；任务节时和跨端可靠性未实测。

> **思考**：[Q03](../../plugins/isomoes--ikanban/INSIGHT.md#research-q03) 自动批准是全局客户端偏好，可能应答所有连接/会话和重连挂起请求，不能当当前标签的局部授权；scope键只隔开本地状态，不是后端租户权限。

> **建议**：[Q04](../../plugins/isomoes--ikanban/INSIGHT.md#research-q04) 试验自动批准范围预览和按服务器限定能否减少误放行，已有设置/守卫和未知请求覆盖需保留，当前未验证。

[查看完整分析](../../plugins/isomoes--ikanban/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1202726483-root"></a>

## [IllusionAgent](../../plugins/yuntaihua--illusion-agent/INSIGHT.md)

[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YunTaiHua/illusion-agent)

> **用途**：希望通过命令行或 Web 使用多模型 Agent 执行任务的开发者。

> **亮点**：[Q01](../../plugins/yuntaihua--illusion-agent/INSIGHT.md#research-q01) 组合多界面和扩展，[Q02](../../plugins/yuntaihua--illusion-agent/INSIGHT.md#research-q02) 连接工具权限及执行；实际效果未知。

> **思考**：[Q02](../../plugins/yuntaihua--illusion-agent/INSIGHT.md#research-q02) 工具级允许先于路径和命令拒绝，配置组合需按实际优先级核查。

> **建议**：[Q04](../../plugins/yuntaihua--illusion-agent/INSIGHT.md#research-q04) 假设明确优先级并提供拒绝优先策略可减少误解，尚未验证。

[查看完整分析](../../plugins/yuntaihua--illusion-agent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1005356138-root"></a>

## [iosdev-cn](../../plugins/kuangre123--iosdev/INSIGHT.md)

[![GitHub ★ 28](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=28&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kuangre123/iosdev)

> **用途**：需要整理iOS开发与上架准备的开发者，可据四主题参考生成候选清单；真实构建和审核仍由项目工具与负责人完成。

> **亮点**：[Q01](../../plugins/kuangre123--iosdev/INSIGHT.md#research-q01) 与 [Q02](../../plugins/kuangre123--iosdev/INSIGHT.md#research-q02) 将开发、发布、订阅和隐私主题固定路由，帮助复用准备结构；增量是知识组织，不是执行或合规判断能力。

> **思考**：[Q02](../../plugins/kuangre123--iosdev/INSIGHT.md#research-q02) 清单没有逐项绑定当前规则、环境与项目证据，不能把文字覆盖当测试、签名或审核已通过。优先官方来源的约束存在，但需要实际回源。

> **建议**：[Q04](../../plugins/kuangre123--iosdev/INSIGHT.md#research-q04) 假设逐项记录适用条件、官方依据与项目证据能减少过期误用，需和现有总入口清单比较正确性与核查负担。

[查看完整分析](../../plugins/kuangre123--iosdev/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1044010907-root"></a>

## [iPolloWork](../../plugins/devin-axis--ipollowork/INSIGHT.md)

[![GitHub ★ 7,427](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C427&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/iPolloWork)

> **用途**：在同一项目管理多个 Agent 会话的团队，可以从工作台进入 DSH 运行时，关联进度和产物。

> **亮点**：[Q01](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q01) 和 [Q02](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q02) 显示，工作台复用原生 DSH 的会话执行，同时提供项目绑定和消息投影，减少了在原生引擎与任务记录之间的手工转移。

> **思考**：[Q03](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q03) 显示，订阅取消、会话取消、进程停止和文件交付分别有不同入口。历史终态也未按明确的 turn 标识验证产物，不宜将界面 done 当作验收完成。

> **建议**：[Q05](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q05) 提出将原生运行、预期文件和核验状态可追溯地绑定，观察能否降低错认完成。

[查看完整分析](../../plugins/devin-axis--ipollowork/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1308234922-root"></a>

## [J-Space Cognition Suite](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md)

[![GitHub ★ 2,960](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C960&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tiger3807861189/J-Space-Cognition-Suite)

> **用途**：多文件长任务中需要防止陈旧源码与报告继续流转的开发或研究负责人。

> **亮点**：[Q02](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q02)、[Q03](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q03) 相对人工清单，脚本可机械拒绝过期读取、改变的证据和不匹配的任务契约，增量是证据失效治理，不是验证模型内部认知。

> **思考**：[Q03](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q03) 摘要一致不能证明验证文件真实，一份虚构而未变的日志仍需独立事实核对；门控exit 0不代表工程任务已正确完成。

> **建议**：[Q05](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q05) 未验证假设是在关键门槛增加可重放命令与独立抽样复跑，以真假/过期材料对照误接受和时间；不改善或成本更高则停止。

[查看完整分析](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391049410-root"></a>

## [Jev 决策插件](../../plugins/luobosibing2--dsh-jev-plugin/INSIGHT.md)

[![GitHub ★ 202](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=202&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/luobosibing2/dsh-jev-plugin)

> **用途**：需要在 DSH 输出前检查本轮要求的人，可以为使用 Todo 的任务评估第二判断路径。

> **亮点**：[Q01](../../plugins/luobosibing2--dsh-jev-plugin/INSIGHT.md#research-q01) 把报告审阅接到宿主生命周期，并为同轮有限补充保留可追溯记录。

> **思考**：[Q03](../../plugins/luobosibing2--dsh-jev-plugin/INSIGHT.md#research-q03) 复核没有读工件；独立的提权功能确实可能给出单次授权。

> **建议**：[Q05](../../plugins/luobosibing2--dsh-jev-plugin/INSIGHT.md#research-q05) 用独立工件验收验证额外判断是否减少任务遗漏。

[查看完整分析](../../plugins/luobosibing2--dsh-jev-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1211353708-root"></a>

## [Kimi Plugin CC](../../plugins/linxule--kimi-plugin-cc/INSIGHT.md)

[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/linxule/kimi-plugin-cc) [![npm 30d 3,392](https://img.shields.io/static/v1?label=npm+30d&message=3%2C392&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/kimi-plugin-cc) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/kimi-plugin-cc)

> **用途**：经常需要在合并前复核小型 Git diff 的开发者，在宿主会话内发起第二轮审查并检查文件行号。

> **亮点**：[Q01](../../plugins/linxule--kimi-plugin-cc/INSIGHT.md#research-q01) 宿主可直接启动同一 diff 的复审，审查提示保存证据范围并返回文件行号。[Q03](../../plugins/linxule--kimi-plugin-cc/INSIGHT.md#research-q03) MCP 任务状态关联实际工作目录。

> **思考**：[Q02](../../plugins/linxule--kimi-plugin-cc/INSIGHT.md#research-q02) 安全边界依赖实际 Kimi 版本及受管钩子。[Q03](../../plugins/linxule--kimi-plugin-cc/INSIGHT.md#research-q03) 取消可能保留已做的编辑，钩子范围也无法覆盖所有内部子进程。

> **建议**：[Q04](../../plugins/linxule--kimi-plugin-cc/INSIGHT.md#research-q04) 将第二轮审查放进宿主会话可能减少整理 diff 的步骤并补足部分回归线索，需用同一 diff 记录真实发现与复核耗时。

[查看完整分析](../../plugins/linxule--kimi-plugin-cc/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1180401969-root"></a>

## [KimiX](../../plugins/sikao-engine--kimix/INSIGHT.md)

[![GitHub ★ 112](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=112&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Sikao-Engine/KimiX)

> **用途**：熟悉命令行的开发者可在受控工作区用模型辅助代码和文件任务，并自行核验结果。

> **亮点**：[Q01](../../plugins/sikao-engine--kimix/INSIGHT.md#research-q01) 和 [Q02](../../plugins/sikao-engine--kimix/INSIGHT.md#research-q02) 显示项目将命令行、SDK 和工具循环组合为脚本化代理工作流；实际效率和质量没有对照。

> **思考**：[Q03](../../plugins/sikao-engine--kimix/INSIGHT.md#research-q03) 的验证闸按调用分类且提醒有上限，不能证明测试成功；审批在 yolo 或 afk 下可自动通过。

> **建议**：[Q05](../../plugins/sikao-engine--kimix/INSIGHT.md#research-q05) 提出绑定检查结果与修改范围的未验证记录；若不减少误判或误拦过多则否定。

[查看完整分析](../../plugins/sikao-engine--kimix/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1371827207-root"></a>

## [Knit](../../plugins/polinnizhong--dsh-knit/INSIGHT.md)

[![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PolinniZhong/dsh-knit) [![npm 30d 3,757](https://img.shields.io/static/v1?label=npm+30d&message=3%2C757&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-knit) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-knit)

> **用途**：维护多个文档与源码的 DSH 用户需要为当前任务定位可回读的关键文件和行号。[Q01](../../plugins/polinnizhong--dsh-knit/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/polinnizhong--dsh-knit/INSIGHT.md#research-q01) [Q02](../../plugins/polinnizhong--dsh-knit/INSIGHT.md#research-q02) 把文档与代码的任务检索、分层和行号接入 DSH，让结果可按理由回到原文。

> **思考**：[Q03](../../plugins/polinnizhong--dsh-knit/INSIGHT.md#research-q03) 缺失可能由扫描预算或类型造成。混合可发送原查询和摘要，且纯语义项只能追加在相关层。面板的预览词法范围不足以证明符号链接边界。

> **建议**：[Q05](../../plugins/polinnizhong--dsh-knit/INSIGHT.md#research-q05) 用预先标注的任务比较有理由的结果与手工搜索，若减少打开次数并维持原文可核对性，才说明交接有增量。

[查看完整分析](../../plugins/polinnizhong--dsh-knit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339469423-root"></a>

## [lark-agent-bridge](../../plugins/bihangchi9-creator--lark-agent-bridge/INSIGHT.md)

[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bihangchi9-creator/lark-agent-bridge) [![npm 30d 811](https://img.shields.io/static/v1?label=npm+30d&message=811&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@bihangchi9/lark-agent-bridge) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@bihangchi9/lark-agent-bridge)

> **用途**：需要从专用飞书群查看或询问本地 DSH 的用户可用群消息触发隔离会话。

> **亮点**：[Q01](../../plugins/bihangchi9-creator--lark-agent-bridge/INSIGHT.md#research-q01) 的按群分流与会话适配把飞书消息、固定运行时及流式回复接成一条调用链。

> **思考**：[Q02](../../plugins/bihangchi9-creator--lark-agent-bridge/INSIGHT.md#research-q02) 的群授权对整个群生效；超时 dispose 不确认之前的副作用已撤回。

> **建议**：[Q03](../../plugins/bihangchi9-creator--lark-agent-bridge/INSIGHT.md#research-q03) 提出可回读的超时状态，检查群用户能否减少盲重试。

[查看完整分析](../../plugins/bihangchi9-creator--lark-agent-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1301161244-root"></a>

## [leantoken](../../plugins/morluto--leantoken/INSIGHT.md)

[![GitHub ★ 144](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=144&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/leantoken)

> **用途**：代码修改前需要在大仓库定位相关实现和证据。

> **亮点**：[Q01](../../plugins/morluto--leantoken/INSIGHT.md#research-q01) 把任务检索与有限上下文打包，帮助 Agent 决定下一步精读位置。

> **思考**：[Q02](../../plugins/morluto--leantoken/INSIGHT.md#research-q02) 预算会裁掉诊断或片段，覆盖与索引状态仍需核对。[Q03](../../plugins/morluto--leantoken/INSIGHT.md#research-q03) 作者结果限特定只读任务。

> **建议**：[Q03](../../plugins/morluto--leantoken/INSIGHT.md#research-q03) 在同一测试集比较总输入、必要证据覆盖和冷索引成本，判断何时启用。

[查看完整分析](../../plugins/morluto--leantoken/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 3,301](https://img.shields.io/static/v1?label=npm+30d&message=3%2C301&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe)

> **用途**：能够核对代码和模型的开发者可用它审阅状态机、数据迁移和设计主张，并保留人工确认。

> **亮点**：[Q01](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q01) 与 [Q02](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q02) 显示它将模型检查、Skill 提示和报告比较接到同一会话；这不证明模型自动对应源码，也未验证实际节时。

> **思考**：[Q03](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q03) 显示未决、摘要和差异结论都有边界；同一发现从警告升级为错误可能不使增量判决失败，必须同时检查当前结果与 changed。[Q02](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q02) 的确认模式是提示，不应当作强制审批。

> **建议**：[Q05](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q05) 提出源码变化触发模型映射复核的未验证假设；用已知变更盲测，若无法提高识别率或成本超过收益则否定。

[查看完整分析](../../plugins/amethystluna--logicprobe/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1255217938-packages-dsh-loopx-plugin"></a>

## [LoopX DSH Plugin](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md)

[![GitHub ★ 6,562](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C562&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/loopx-project/loopx)

> **用途**：已有 LoopX 目标并想连续推进可逐轮验收的小任务的 DSH 用户，可在原会话核对绑定和续轮。[Q01](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q01)

> **亮点**：[Q02](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q02) 将 Goal、Agent、轮次和宿主当前会话绑定到同一预约。[Q03](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q03) 提供分离的目标暂停和待处理队列撤销路径。业务状态与执行责任仍分属 LoopX 与 DSH。

> **思考**：[Q03](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q03) 显示暂停后已认领预约可能保留，GoalBar 的 paused 不能说明当前执行或外部副作用停止。

> **建议**：[Q06](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q06) 提出把新轮停止、当前轮保留和效果未知分开显示，以误判率和恢复耗时比较是否值得。

[查看完整分析](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333365124-npm"></a>

## [Martty](../../plugins/openma-ai--martty--npm/INSIGHT.md)

[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openma-ai/Martty) [![npm 30d 1,981](https://img.shields.io/static/v1?label=npm+30d&message=1%2C981&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/martty) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/martty)

> **用途**：[Q01](../../plugins/openma-ai--martty--npm/INSIGHT.md#research-q01) npm/DSH终端用户需要知道实际启动的painter、agent与profile，并能保存/移除配方。

> **亮点**：[Q03](../../plugins/openma-ai--martty--npm/INSIGHT.md#research-q03) owner绑定/请求映射和[Q02](../../plugins/openma-ai--martty--npm/INSIGHT.md#research-q02) 安装取消清理是实质接线；best-effort配置不等强会话策略。

> **思考**：[Q03](../../plugins/openma-ai--martty--npm/INSIGHT.md#research-q03) 配置重assert失败仍可发送prompt；关闭本地pool非远端强停止。[Q04](../../plugins/openma-ai--martty--npm/INSIGHT.md#research-q04) 动态JS及包安装需信任。

> **建议**：[Q05](../../plugins/openma-ai--martty--npm/INSIGHT.md#research-q05) 配置收敛收据门禁未实现，以拒绝/迟到回执下错模型和额外阻塞证伪。

[查看完整分析](../../plugins/openma-ai--martty--npm/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333365124-root"></a>

## [Martty](../../plugins/openma-ai--martty/INSIGHT.md)

[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openma-ai/Martty)

> **用途**：[Q01](../../plugins/openma-ai--martty/INSIGHT.md#research-q01) 终端开发者在一个界面管理多会话/排队/打断与工具结果；结果正确比界面完整更重要。

> **亮点**：[Q02](../../plugins/openma-ai--martty/INSIGHT.md#research-q02) 多会话控制、队列与诚实cancel结束状态是实质客户端贡献；[Q03](../../plugins/openma-ai--martty/INSIGHT.md#research-q03) 插件生命周期不等安全隔离。

> **思考**：[Q03](../../plugins/openma-ai--martty/INSIGHT.md#research-q03) 本地fs宽读/词法内写及动态JS不是沙盒；[Q02](../../plugins/openma-ai--martty/INSIGHT.md#research-q02) 取消和历史恢复不证明远端停止/判重。

> **建议**：[Q05](../../plugins/openma-ai--martty/INSIGHT.md#research-q05) 会话本地能力收据与真实路径授权是假设，需含取消后写入等反例验证。

[查看完整分析](../../plugins/openma-ai--martty/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336488925-root"></a>

## [Matt Skills Deck](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md)

[![GitHub ★ 285](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=285&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck)

> **用途**：在 DSH 里接续工单的开发者可从当前工作区浏览票和详情，并从会话交接入口继续处理。

> **亮点**：将工作区选择、票详情与会话交接组织为同一个宿主入口。权限和后端能力仍按具体 Tracker 返回。见 [Q01](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q01)、[Q02](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q02)。

> **思考**：统一界面不能把所有后端的操作和权限视为相同。GitHub 权限未知时还要回到原 Tracker 核对，写入不会因卸载自动撤销。见 [Q02](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q02)、[Q03](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q03)。

> **建议**：以同一组工单比较手工复制与面板交接，检验是否减少遗漏或重复认领，并同时记录人工排障。见 [Q04](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/featherhunter--dsh-mattpocock-skills-deck/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1426070939-root"></a>

## [MC Mods Dev Bridge](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md)

[![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/mcmodsdevbridge)

> **用途**：Minecraft 26.3 模组开发者在 AI 写完代码后仍需手工启动游戏、连接、op、操作 UI 和收集证据；基线是人工点测或单侧单元测试。合格结果是同一场景在目标 loader 的真实 server/client 上完成断言，保留日志、截图与 probe 响应，失败后进程和安装文件可清理。 详见[Q01](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md#research-q01)。

> **亮点**：相对人工点测，它把真实双端启动、交互、断言、证据和清理压成可调用流程，并从上游 Forge 1.20.1 扩到 26.3 三 loader。它提供验证基础设施而非测试设计；绿色只证明已写断言，声音、动画手感等仍需人工。 详见[Q03](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md#research-q03)。

> **思考**：最关键质疑是探针观察面是否代表玩家体验。HTTP probe 会改变被测环境，场景可能只验证探针可见状态而漏掉渲染、时序或 loader 特有问题；固定端口 39002 使客户端并发受限。环境包含游戏账号/安装、Java 25、loader 和大型进程，失败恢复成本高。 详见[Q04](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md#research-q04)。

> **建议**：未验证假设是为场景 DSL 加入“人类观察检查点”，在自动 probe 通过后只抽取无法数据化的声音/动画/UI 手感步骤，可显著压缩人工验收。最小实验选 20 个模组功能，对纯人工、纯 probe、混合检查点比较缺陷发现、人工分钟、假阳性与遗漏；混合组漏掉任何高严重度体验缺陷即削弱假设。 详见[Q08](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/7starsseeker--mcmodsdevbridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1014729376-apps-memos-local-plugin"></a>

## [MemOS Local Plugin](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md)

[![GitHub ★ 12,316](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12%2C316&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MemTensor/MemOS) [![npm 30d 10,300](https://img.shields.io/static/v1?label=npm+30d&message=10%2C300&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memtensor/memos-local-plugin) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memtensor/memos-local-plugin)

> **用途**：在 DSH 中反复处理同一项目并需要找回已确认约束的开发者，可用隔离数据检验自动召回。[Q01](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q01)

> **亮点**：[Q02](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q02) 将有界召回接到实际被接受的 DSH 输入。[Q03](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q03) 以会话队列承载较慢的捕获，这给同步问答和后台记忆分配了不同延迟预算。

> **思考**：[Q03](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q03) 中的后台提交没有成为下一轮的屏障，纠正可能未写入时已被下一轮查询。[Q04](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q04) 表明本地存储与模型及其他数据出口分属不同路径。

> **建议**：[Q06](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q06) 提出让关键纠正的写入结果可见，在预算内提示可能陈旧的召回。需与不等写入的现状比较误引和延时。

[查看完整分析](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336062434-root"></a>

## [Minecraft Dev](../../plugins/sikadi233-hub--minecraft-dev/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sikadi233-hub/minecraft-dev) [![npm 30d 4,332](https://img.shields.io/static/v1?label=npm+30d&message=4%2C332&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/minecraft-dev) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/minecraft-dev)

> **用途**：面向同时维护多个 Minecraft 插件或模组模块、需要共享接口和注册资源的开发者。

> **亮点**：把共享接口、文件所有权与生命周期排序转换成可检查的项目材料。[Q02](../../plugins/sikadi233-hub--minecraft-dev/INSIGHT.md#research-q02)

> **思考**：缺清单时仍可继续合并，常规写入无事务，未解析诊断可能被结果摘要掩盖。[Q03](../../plugins/sikadi233-hub--minecraft-dev/INSIGHT.md#research-q03)

> **建议**：用两片虚拟项目与合成日志核对拒写、变更计划和漏诊断，估计相对手工的定位成本。[Q04](../../plugins/sikadi233-hub--minecraft-dev/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/sikadi233-hub--minecraft-dev/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 549](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=549&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ikalus1988/MisakaNet) [![npm 30d 6,970](https://img.shields.io/static/v1?label=npm+30d&message=6%2C970&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/misakanet) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/misakanet)

> **用途**：开发者遇到工程错误时希望查找可核验的既有经验。

> **亮点**：[Q01](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q01) 与 [Q02](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q02) 把结构化故障经验检索接入 Agent，仍需用户依据当前环境验证。

> **思考**：[Q03](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q03) 语义回退和 CJK 融合依配置与数据，[Q04](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q04) 服务端脱敏发生在请求到达后。

> **建议**：[Q05](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q05) 假设本机环境验证收据能减少错误套用；须先核现有功能，尚未验证。

[查看完整分析](../../plugins/ikalus1988--misakanet/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1273324178-root"></a>

## [Mobius](../../plugins/nutshellai-tech--mobius/INSIGHT.md)

[![GitHub ★ 208](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=208&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nutshellai-tech/mobius)

> **用途**：多项目维护者希望集中模型、Agent会话与设备工作记录；原办法多个CLI/Web人工汇总。合格结果需正确授权、可追溯投递与真实成果，ok或在线不等任务完成。

> **亮点**：[Q01](../../plugins/nutshellai-tech--mobius/INSIGHT.md#research-q01) 与 [Q02](../../plugins/nutshellai-tech--mobius/INSIGHT.md#research-q02) 将多项目成员、模型白名单、会话消息和不同Agent记录集中，降低人工跨终端跟踪的组织负担。此为工作台与适配层贡献，不把上游Agent编程或自进化演示当已验业务效果。

> **思考**：[Q02](../../plugins/nutshellai-tech--mobius/INSIGHT.md#research-q02) RPC超时不取消执行，失败／stop后setIdle不证进程树停止；[Q03](../../plugins/nutshellai-tech--mobius/INSIGHT.md#research-q03) download允许共享tmp/upload且词法路径非symlink隔离，模型限制仅新Session。正式团队接管须先解决授权、UNKNOWN结果和恢复，不能据JWT或界面角色承诺租户安全。

> **建议**：[Q04](../../plugins/nutshellai-tech--mobius/INSIGHT.md#research-q04) 从超时和空闲投影不一致推导稳定operation id、UNKNOWN与query/reconcile，可能减少重复副作用。以丢响应、重启和退出延迟比较重复/误空闲/恢复；不改善或锁死即否定，尚未实现不计贡献。

[查看完整分析](../../plugins/nutshellai-tech--mobius/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334569518-root"></a>

## [model-usage-plugin](../../plugins/aks1st--model-usage-plugin/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/model-usage-plugin) [![npm 30d 972](https://img.shields.io/static/v1?label=npm+30d&message=972&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/model-usage-plugin) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/model-usage-plugin)

> **用途**：面向在DSH Web混用多个模型/provider、希望知道token花在哪里和何时使用较多的个人开发者。它把模型用量、估算金额、趋势、工具频率和余额放在设置页，适合形成“哪种调用值得进一步核查”的线索。合格任务是把自有会话的实际usage准确归到模型/时间/来源，并清楚显示价格、套餐与汇率口径。

> **亮点**：把流usage、工具事件、去继承历史与显式套餐/价表/汇率控制接到同一设置页，减少手工整理；金额和工具指标不证明业务价值。详见[Q02](../../plugins/aks1st--model-usage-plugin/INSIGHT.md#research-q02)。

> **思考**：历史扫描在首个会话写日键后跳过同日其它会话，自动补齐不能据此视为完整；自定义余额地址会携带回退到的key，来源检查也只比hostname。未运行漏计或越权复现。详见[Q03](../../plugins/aks1st--model-usage-plugin/INSIGHT.md#research-q03)。

> **建议**：可探索逐会话/事件稳定ID账本与独立扫描watermark，再绑定价版本，比较漏计、重复、重启和资源负担；未实现。详见[Q06](../../plugins/aks1st--model-usage-plugin/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/aks1st--model-usage-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1174622182-root"></a>

## [Morning Star Harness](../../plugins/btspoony--mstar-harness/INSIGHT.md)

[![GitHub ★ 68](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=68&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/btspoony/mstar-harness)

> **用途**：需要跨会话组织开发计划、实现、审查和交付的团队可使用其工作流基础设施。

> **亮点**：[Q01](../../plugins/btspoony--mstar-harness/INSIGHT.md#research-q01) 与 [Q02](../../plugins/btspoony--mstar-harness/INSIGHT.md#research-q02) 将跨会话计划、共享命令和多宿主入口组织为开发流程；未证明比手工治理节时或减少缺陷。

> **思考**：[Q03](../../plugins/btspoony--mstar-harness/INSIGHT.md#research-q03) 表明 DSH 部分调度默认告警，输入异常或引擎失败存在允许并提示的退化路径；不能据此推断所有宿主动作被强制阻止。

> **建议**：[Q06](../../plugins/btspoony--mstar-harness/INSIGHT.md#research-q06) 提出绑定交付版本的 gate 覆盖与退化收据，需与现有日志比较误判和审核成本。

[查看完整分析](../../plugins/btspoony--mstar-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331025830-root"></a>

## [Multica DSH Runtime](../../plugins/multica-ai--dsh-multica-runtime/INSIGHT.md)

[![GitHub ★ 77](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=77&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/multica-ai/dsh-multica-runtime)

> **用途**：需要以Multica daemon驱动DSH且能管理独立运行边界的集成者。

> **亮点**：[Q01](../../plugins/multica-ai--dsh-multica-runtime/INSIGHT.md#research-q01) 版本化单次协议与显式resume拒绝；[Q02](../../plugins/multica-ai--dsh-multica-runtime/INSIGHT.md#research-q02) 处理子任务唤醒后的静默。

> **思考**：[Q02](../../plugins/multica-ai--dsh-multica-runtime/INSIGHT.md#research-q02) drain失败不阻cancelled，EOF不取消；[Q03](../../plugins/multica-ai--dsh-multica-runtime/INSIGHT.md#research-q03) headless自动批准依赖可信调用方。

> **建议**：[Q04](../../plugins/multica-ai--dsh-multica-runtime/INSIGHT.md#research-q04) cleanup未知信号是否改善daemon资源回收需要故障对照。

[查看完整分析](../../plugins/multica-ai--dsh-multica-runtime/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1185828998-root"></a>

## [Odai](../../plugins/orziz--odai/INSIGHT.md)

[![GitHub ★ 119](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=119&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/orziz/odai)

> **用途**：希望代理依据明确目标、授权和证据完成开发任务的人，可以评估其治理技能和独立工具运行时。

> **亮点**：[Q01](../../plugins/orziz--odai/INSIGHT.md#research-q01) 和 [Q02](../../plugins/orziz--odai/INSIGHT.md#research-q02) 显示项目将治理规则与可执行工具门禁、可选路由组织在同一工程；效果仍取决于宿主和实际任务。

> **思考**：[Q03](../../plugins/orziz--odai/INSIGHT.md#research-q03) 的安装会修改宿主配置，传递只读参数不证明外部 CLI 已实际隔离；[Q02](../../plugins/orziz--odai/INSIGHT.md#research-q02) 的默认 skipped 命令不能冒充执行。

> **建议**：[Q05](../../plugins/orziz--odai/INSIGHT.md#research-q05) 提出跨宿主能力及实际执行凭据的未验证方案；若状态不可核实或负担过高则否定。

[查看完整分析](../../plugins/orziz--odai/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1185828998-dsh-plugin"></a>

## [odai-dsh-plugin](../../plugins/orziz--odai--dsh-plugin/INSIGHT.md)

[![GitHub ★ 119](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=119&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/orziz/odai) [![npm 30d 2,356](https://img.shields.io/static/v1?label=npm+30d&message=2%2C356&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/odai-dsh-plugin) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/odai-dsh-plugin)

> **用途**：希望在 DSH profile 内组织职责路由与治理的用户可观察本组件，见 [Q01](../../plugins/orziz--odai--dsh-plugin/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/orziz--odai--dsh-plugin/INSIGHT.md#research-q01) 与 [Q02](../../plugins/orziz--odai--dsh-plugin/INSIGHT.md#research-q02) 将共享运行时打包为 profile 级路由、只读工具限制和控制面；由共享源码提供的实现不归因给子包单独原创。

> **思考**：[Q03](../../plugins/orziz--odai--dsh-plugin/INSIGHT.md#research-q03) 的 guard 是可选注册、restrict 也可能缺失；控制中心 fetch 路由依赖宿主连接的鉴权，不能仅凭加载或配置宣称权限边界已生效。

> **建议**：[Q05](../../plugins/orziz--odai--dsh-plugin/INSIGHT.md#research-q05) 假设启动能力验证与实际保护状态展示可减少误信；尚未实现或验证。

[查看完整分析](../../plugins/orziz--odai--dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1363525420-root"></a>

## [Oh My DSH](../../plugins/gulagala001--oh-my-dsh/INSIGHT.md)

[![GitHub ★ 50](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=50&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/gulagala001/oh-my-dsh)

> **用途**：长代码会话中反复读同一批源码的 DSH 维护者，希望减少输入内容并仍能回查关键证据。

> **亮点**：[Q01](../../plugins/gulagala001--oh-my-dsh/INSIGHT.md#research-q01) 和 [Q02](../../plugins/gulagala001--oh-my-dsh/INSIGHT.md#research-q02) 确认原文档案与工具结果缩减分层，可在同请求有完整基线时使用重复引用及精确差异。

> **思考**：[Q03](../../plugins/gulagala001--oh-my-dsh/INSIGHT.md#research-q03) 原文可读依赖存档、事件绑定和作用域。输入估算与实际费用不同。[Q04](../../plugins/gulagala001--oh-my-dsh/INSIGHT.md#research-q04) 根 bundle 扩大宿主变更范围，单独开关不等于全包退出。

> **建议**：[Q05](../../plugins/gulagala001--oh-my-dsh/INSIGHT.md#research-q05) 固定重复读取与一行变化，比较开关、原文回查及真实用量，可以验证缩减在具体任务的净价值。

[查看完整分析](../../plugins/gulagala001--oh-my-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1330531961-root"></a>

## [Oh-DSH](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md)

[![GitHub ★ 323](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=323&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hust-open-atom-club/oh-dsh)

> **用途**：跨桌面、Web及SSH终端开发的DSH用户需要组织同一会话/插件状态；单端用户可先保留原入口。见[Q01](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md#research-q01)。

> **亮点**：发行/表面契约整合与候选Profile预览/恢复减少接线；不证明真实任务效率。见[Q01](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md#research-q01)。

> **思考**：共享不是三端同时可写；apply工具202/accepted只是排队，重启后需读snapshot与功能，Undo仅回退Profile不撤外部副作用。见[Q02](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md#research-q02)。

> **建议**：未验证方向是用transactionId串联受理、重启ready和目标surface功能探针的最终变更回执；以202断连/启动失败比较误报与恢复时间，简单snapshot足够则止于轻量提示。见[Q05](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/hust-open-atom-club--oh-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1379204512-root"></a>

## [oh-my-deepseekharness](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)

[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1225Sakura/oh-my-deepseekharness) [![npm 30d 3,136](https://img.shields.io/static/v1?label=npm+30d&message=3%2C136&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)

> **用途**：DSH 用户希望把复杂任务拆分并委派给子代理。

> **亮点**：[Q01](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md#research-q01) 整合资产与路由，[Q02](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md#research-q02) 将决策接入宿主子代理。

> **思考**：[Q03](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md#research-q03) 路由日志发生在启动前且可能缺失，不能当成功执行证明。

> **建议**：[Q05](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md#research-q05) 假设关联派发到终态的脱敏记录有助区分失败；尚未验证。

[查看完整分析](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333125623-root"></a>

## [oh-my-dsh](../../plugins/laplaceyoung--oh-my-dsh/INSIGHT.md)

[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LaplaceYoung/oh-my-dsh)

> **用途**：已维护DSH并有单一扩展缺口的工程师，可挑包改造；根库非一个完整产品，合格结果是单包真实任务验收，见 [Q01](../../plugins/laplaceyoung--oh-my-dsh/INSIGHT.md#research-q01)。

> **亮点**：贡献是按扩展接缝拆分同行能力为可选包和测试素材，代表样本有真实服务调用；不把根包/作者数量当全部插件可用，见 [Q01](../../plugins/laplaceyoung--oh-my-dsh/INSIGHT.md#research-q01)至 [Q03](../../plugins/laplaceyoung--oh-my-dsh/INSIGHT.md#research-q03)。

> **思考**：报告存在、run complete、注册成功各不等于业务完成；研究可空源模板，tower无文件互斥/失败全收尾，guard缺服务可不挂，见 [Q02](../../plugins/laplaceyoung--oh-my-dsh/INSIGHT.md#research-q02)至 [Q04](../../plugins/laplaceyoung--oh-my-dsh/INSIGHT.md#research-q04)。

> **建议**：未验证方向是按宿主版本维护逐包退化/取消/业务验收资格台账，以三失败样本比较错误采用与维护负担，见 [Q05](../../plugins/laplaceyoung--oh-my-dsh/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/laplaceyoung--oh-my-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1145914675-integrations-dsh"></a>

## [OMA for DeepSeek Harness](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md)

[![GitHub ★ 1,356](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C356&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/first-fluke/oh-my-agent)

> **用途**：面向希望在 DSH 项目中使用 OMA 工具前后检查的开发者。

> **亮点**：[Q02](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q02) 将钩子 deny/ask、post 反馈与有限 Stop 接入宿主；不提供完整上游原生派工。

> **思考**：[Q02](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q02) post 不能撤销工具副作用，Stop 到上限只警告，不能当通过。

> **建议**：[Q05](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q05) 提议显式未解决状态，须对照已有警告评估误判和阻塞。

[查看完整分析](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1318562243-root"></a>

## [OPC-Nexus](../../plugins/h4dex--opc-nexus/INSIGHT.md)

[![GitHub ★ 239](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=239&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/h4dex/opc-nexus)

> **用途**：个人工作室／小公司的维护者希望从需求到多员工成果有统一项目、审批和验收责任；替代为单CLI加人工衔接。合格交付是可核文件与经确认验收的结果，非聊天完成文字。

> **亮点**：[Q01](../../plugins/h4dex--opc-nexus/INSIGHT.md#research-q01) 与 [Q02](../../plugins/h4dex--opc-nexus/INSIGHT.md#research-q02)显示把Hermes建议与Main权威状态分开，并把createTask、项目文件manifest与独立员工PASS门控连到桌面结果读取。相对单CLI人工对账，增加明确交接与交付控制；不把上游Agent能力或“verified”文件等同业务验收。

> **思考**：[Q02](../../plugins/h4dex--opc-nexus/INSIGHT.md#research-q02) gate仅计划任务强制，直达员工例外；PASS是身份／任务关系加前缀文本，没有绑定产物hash或实际检查记录。文件时间窗和SHA清单只证候选存在，不证归属和正确性；[Q03](../../plugins/h4dex--opc-nexus/INSIGHT.md#research-q03)完整多员工闭环仍未完成，不能据治理文案接管业务。

> **建议**：[Q04](../../plugins/h4dex--opc-nexus/INSIGHT.md#research-q04)从manifest hash和文本PASS之间的缺口推导验收绑定产物版本，可能降低陈旧PASS放行。用验收后改文件、重跑与并发修改试验；陈旧放行未降或误阻断代价超收益则否定，尚未实现不计当前贡献。

[查看完整分析](../../plugins/h4dex--opc-nexus/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1276135867-root"></a>

## [open-record-replay](../../plugins/humblebanana--open-record-replay/INSIGHT.md)

[![GitHub ★ 148](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=148&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/humblebanana/open-record-replay) [![npm 30d 53](https://img.shields.io/static/v1?label=npm+30d&message=53&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/open-record-replay) [![最新发布 2026-06-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-06-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/open-record-replay)

> **用途**：桌面流程包含菜单、拖拽或多个应用，文字难以交代步骤。

> **亮点**：[Q01](../../plugins/humblebanana--open-record-replay/INSIGHT.md#research-q01) 将桌面操作留下结构化证据，便于宿主技能工具读取。

> **思考**：[Q02](../../plugins/humblebanana--open-record-replay/INSIGHT.md#research-q02) 打包复制原始证据，质量校验与隐私预览需要另做。

> **建议**：[Q03](../../plugins/humblebanana--open-record-replay/INSIGHT.md#research-q03) 分离受控原件与人工确认的分享副本，比较泄露和复现。

[查看完整分析](../../plugins/humblebanana--open-record-replay/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1147866277-root"></a>

## [OpenBitFun Agent 工作区](../../plugins/gcwing--openbitfun/INSIGHT.md)

[![GitHub ★ 3,986](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C986&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openBitFun/OpenBitFun)

> **用途**：使用常开开发主机的操作者希望从另一设备查看任务进度、处理一次审批，并回到原会话继续工作。

> **亮点**：DSH 接入复用已安装宿主，桥接会话重开与选定工具审批。跨设备视图按游标恢复主机事件，减少手工找日志和重新打开上下文的环节。见 [Q01](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q01) 至 [Q03](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q03)。

> **思考**：界面回放经过筛选，活跃与归档重载的目录校验不同。断线丢失确认时，目标操作仍可能已经完成。见 [Q02](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q02) 与 [Q03](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q03)。

> **建议**：将操作收据与目标状态绑定，可能减少重连后误判和重复操作。通过同一批可回滚任务对照故障后的人工回读时间及误写次数。见 [Q05](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/gcwing--openbitfun/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350368388-packages-plugin"></a>

## [opencode2dsh](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md)

[![GitHub ★ 388](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=388&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FishBottle7/opencode2dsh) [![npm 30d 14,534](https://img.shields.io/static/v1?label=npm+30d&message=14%2C534&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencode2dsh/dsh-plugin) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencode2dsh/dsh-plugin)

> **用途**：已有 DSH 会话的开发者希望在同一工具和对话界面选择 OpenCode Zen 模型。[Q01](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q01)

> **亮点**：把 OpenCode Zen 的模型目录和两类流协议接入 DSH，并在兼容范围内处理无内容中断及纯推理耗尽场景。[Q01](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q01) [Q03](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q03)

> **思考**：目录探测通过仍可能遇到 429 或实际调用拒绝，且无内容中断不证明请求未被远端接收。委派还会留下独立凭据副本。[Q02](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q02) [Q03](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q03) [Q04](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q04)

> **建议**：待验证方向是分开展示探测结果、真实请求状态和中断后的未知结果，观察能否降低误重试及漏查副作用。[Q05](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1223170290-root"></a>

## [OpenDesign](../../plugins/nexu-io--open-design/INSIGHT.md)

[![GitHub ★ 106,098](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=106%2C098&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nexu-io/open-design)

> **用途**：[Q01](../../plugins/nexu-io--open-design/INSIGHT.md#research-q01) 面向已有编码 Agent 的设计开发者，将一份 brief 做成可预览 HTML，并在同项目接续修改；结果须由人核对设计要求与版本。

> **亮点**：[Q01](../../plugins/nexu-io--open-design/INSIGHT.md#research-q01) 至 [Q04](../../plugins/nexu-io--open-design/INSIGHT.md#research-q04) 的贡献是把设计者的 Agent 运行、可定位制品及评论交接意图放进同项目，并提供实际会话匹配、有限发布门和 revision 条件 ACK。相比手工传文件/截图，它为交接提供结构与恢复位置；不是全新模型或自动设计验收，也没有证明所有云协作可用。

> **思考**：[Q02](../../plugins/nexu-io--open-design/INSIGHT.md#research-q02) 的 completed 含 max-tokens，[Q03](../../plugins/nexu-io--open-design/INSIGHT.md#research-q03) 的 body 与 manifest 分开写，[Q04](../../plugins/nexu-io--open-design/INSIGHT.md#research-q04) 的单条 Vela 弱回执仍能消费队列：客户端状态能否可靠对应可打开、版本一致且远端可读的交付？现有门禁只覆盖具体链路，不能将未运行的缺口写成已发生丢失，也不能把 delivered 当接收或验收。

> **建议**：[Q06](../../plugins/nexu-io--open-design/INSIGHT.md#research-q06) 提议把运行终态、制品字节、远端读回与人的验收分别绑定同一版本，先用截断、半写和空回执故障与人工清单比较；若状态辨别及恢复不优于清单或代价更大，就放弃。候选尚未实现或验证。

[查看完整分析](../../plugins/nexu-io--open-design/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350419329-root"></a>

## [OrcaReplay](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md)

[![GitHub ★ 287](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=287&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Continuum-AI-Corp/OrcaReplay)

> **用途**：已有Agent故障调试需求的开发者可在隔离项目中记录模型请求、工具结果和文件变化，用于回放和分叉分析，详见 [Q01](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q01)。

> **亮点**：以外部代理、适配器及文件checkpoint组织同一份可读录制，再用匹配游标承接严格回放和新模型分叉；未匹配与近似匹配明确留痕，能帮助区分录制重现与新调用，见 [Q01](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q01) 和 [Q02](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q02)。

> **思考**：模型回放仍真实执行Agent工具，默认文件恢复也不撤销外部副作用；MCP原件与文件快照还有敏感内容边界。旧字节一致不能证明新模型更好，compare未提供verify时的pass也可能只代表进程退出成功，见 [Q02](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q02) 与 [Q03](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q03)。

> **建议**：可探索逐次列明模型、工具、文件与外部状态冻结范围的回放覆盖清单，把verify和覆盖共同作为模型比较资格。它尚未实现验证，同模型重复/跨模型/外部状态变化对照仍不能解释差异时应否定，见 [Q04](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1133901637-root"></a>

## [Ouroboros](../../plugins/q00--ouroboros/INSIGHT.md)

[![GitHub ★ 6,332](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C332&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)

> **用途**：开发者收到含糊的修复或功能请求，需要把讨论变成有留档的规格并逐条验收。

> **亮点**：[Q01](../../plugins/q00--ouroboros/INSIGHT.md#research-q01) 与 [Q03](../../plugins/q00--ouroboros/INSIGHT.md#research-q03) 核对了固定规格、执行证据和模型否决的职责。访谈产物能与验收记录关联，机械缺证据有单独状态。

> **思考**：[Q03](../../plugins/q00--ouroboros/INSIGHT.md#research-q03) 共享项目检查覆盖哪些条款，哪些条款仍缺专属机器证据？[Q04](../../plugins/q00--ouroboros/INSIGHT.md#research-q04) 评估命令能否在可控的运行环境中执行？

> **建议**：[Q05](../../plugins/q00--ouroboros/INSIGHT.md#research-q05) 使用按条款设计的反例，可能提升对不符合规格改动的区分力，效果取决于检查覆盖与维护成本。

[查看完整分析](../../plugins/q00--ouroboros/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1128708803-root"></a>

## [Perfect Web Clone](../../plugins/ericshang98--perfect-web-clone/INSIGHT.md)

[![GitHub ★ 276](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=276&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ericshang98/Perfect-Web-Clone)

> **用途**：前端从受控网页复刻React并查看分区残差；需求强度未验证，见[Q01](../../plugins/ericshang98--perfect-web-clone/INSIGHT.md#research-q01)。

> **亮点**：分区证据/采集完整性、量化工具和残差交接组合；真实工具caller/callee已核，完整能力/活动步骤见[Q01](../../plugins/ericshang98--perfect-web-clone/INSIGHT.md#research-q01)，度量边界见[Q02](../../plugins/ericshang98--perfect-web-clone/INSIGHT.md#research-q02)。

> **思考**：CLI/DSH逐次进程无法继承内存sandbox；分区平均ok允许未评分或单项红，不能当完整交付，见[Q02](../../plugins/ericshang98--perfect-web-clone/INSIGHT.md#research-q02)。

> **建议**：先修生命周期/门结果语义，再验证固定产物与必需状态的交付核验接口；相对已有Skill增量、对照/指标/停止条件见[Q04](../../plugins/ericshang98--perfect-web-clone/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/ericshang98--perfect-web-clone/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1321152436-root"></a>

## [phi](../../plugins/pulseaiclub--phi/INSIGHT.md)

[![GitHub ★ 809](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=809&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pulseaiclub/phi)

> **用途**：配置多个MCP服务的终端开发者，可按任务逐步发现与调用少数工具；本次不覆盖独立客户端全部编码与扩展功能。

> **亮点**：[Q01](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q01) 和 [Q02](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q02) 支持把工具发现与调用接入既有文件工具命名空间，并保留权限链；这是具体集成增量，不宣称渐进发现首创或总费用已降低。

> **思考**：[Q02](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q02) 核实autopilot源码把Ask转Deny，与README表格冲突；[Q03](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q03) 显示--tools不能单独禁止MCP。少量静态定义并不证明正确发现、完整授权或远端副作用可撤销。

> **建议**：[Q04](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q04) 提出按任务仅前载高频工具的混合策略，和当前零schema及全量前载比较；若没有降低完整负担或缓存失效增加错误，就否定该新增方案。

[查看完整分析](../../plugins/pulseaiclub--phi/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335660277-root"></a>

## [PictureReader](../../plugins/jing-hy--picturereader/INSIGHT.md)

[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jing-hy/picturereader) [![npm 30d 3,124](https://img.shields.io/static/v1?label=npm+30d&message=3%2C124&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/picturereader) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/picturereader)

> **用途**：需要在文本模型的 DSH 会话中核对截图和文档的开发者。

> **亮点**：为文本模型接入图片入口，并将 OCR、视觉桥接及文档转换放在同一会话。[Q01](../../plugins/jing-hy--picturereader/INSIGHT.md#research-q01) [Q02](../../plugins/jing-hy--picturereader/INSIGHT.md#research-q02)

> **思考**：privacy 对 vision_analyze 的 VLM 有硬门槛，孪生流在转换抛错时仍会传原消息；临时文件和输出路径需验证。[Q01](../../plugins/jing-hy--picturereader/INSIGHT.md#research-q01) [Q03](../../plugins/jing-hy--picturereader/INSIGHT.md#research-q03)

> **建议**：为文本模型在附件转换失败时停住原图转发并明确给出补救，可能减少异常出站。[Q04](../../plugins/jing-hy--picturereader/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/jing-hy--picturereader/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336793734-root"></a>

## [Pilot Harness](../../plugins/op7418--pilot-harness/INSIGHT.md)

[![GitHub ★ 281](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=281&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/op7418/pilot-harness)

> **用途**：DSH用户在聊天旁查看工作区并把相对路径放入草稿；本轮核桌面、模型/Loop与Files代表链，见 [Q01](../../plugins/op7418--pilot-harness/INSIGHT.md#research-q01) 至 [Q03](../../plugins/op7418--pilot-harness/INSIGHT.md#research-q03)。

> **亮点**：桌面托管与声明式Provider组合、可独立使用的主题/Files等插件结构；本轮证实Files目标目录/草稿/变更主链，不外推所有自定义模块，见 [Q03](../../plugins/op7418--pilot-harness/INSIGHT.md#research-q03)。

> **思考**：Host根约束不等UI意图归属；异步旧回包及check-then-rename需核，模型catalog/进程ready不等任务完成，退出也有平台差异，见 [Q02](../../plugins/op7418--pilot-harness/INSIGHT.md#research-q02) 至 [Q04](../../plugins/op7418--pilot-harness/INSIGHT.md#research-q04)。

> **建议**：相对已有workspace/path检查增加读回包代次/目标绑定和rename前置状态/未知写结果对账，先复现再测错对象/字节与工时，见 [Q05](../../plugins/op7418--pilot-harness/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/op7418--pilot-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334504487-root"></a>

## [Plan Lattice](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1052326311/dsh-plan-lattice)

> **用途**：长任务经上下文替换后仍需沿用已批准计划、人类要求和已返回委派结果；高风险写入可显式启用完整控制。

> **亮点**：把 DSH 自有 Session/plan/委派事实在真实 surface 替换后有界回填，避免创建第二个自动计划器；显式模式把契约、目标事实与受保护变更绑定，详见[Q01](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q01)、[Q02](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q02)。

> **思考**：默认 auto 不装写入门禁，显式模式也仅守护列名工具且外部副作用依赖 adapter；12/12 是手工设计机制样本，V17/V18/V20 不支持通用提升，详见[Q02](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q02)、[Q03](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q03)。

> **建议**：已有实现已过滤隐藏来源、保成功计划/前台最近3项并按maxContextBytes降级；进一步可研究在合格候选内部按当前子任务需求提供来源引用/缺口、必要时回退原投影。若遗漏权威或增加错续写则反证。此方向尚未实现，详见[Q03](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333152408-packages-plugins-plugin-manager"></a>

## [Plugin Manager](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-manager/INSIGHT.md)

[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite) [![npm 30d 1,244](https://img.shields.io/static/v1?label=npm+30d&message=1%2C244&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-manager) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-manager)

> **用途**：DSH Web用户从查找插件到确认安装/管理更新，见 [Q01](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-manager/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-manager/INSIGHT.md#research-q01) 将发现、确认、真实日志和已装/更新集中到Web面板；[Q02](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-manager/INSIGHT.md#research-q02) Host缓存和压缩减少重复目录传输。兼容徽章是外部元数据，不等于本机已验。

> **思考**：[Q03](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-manager/INSIGHT.md#research-q03) 断流自动重发安装且Host无幂等/锁，原操作结果未知时可能并发副作用；仅包在盘可标mounted，timeout也不证明后代停止。便利界面尚缺可靠事务状态。

> **建议**：[Q05](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-manager/INSIGHT.md#research-q05) 未验证的持久operation、profile串行、流重连与分层验收，可用断流/并发/未挂载在盘包反例推翻。

[查看完整分析](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-manager/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333152408-packages-plugins-plugin-team-board"></a>

## [plugin-team-board](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-team-board/INSIGHT.md)

[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite) [![npm 30d 1,037](https://img.shields.io/static/v1?label=npm+30d&message=1%2C037&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-team-board) [![最新发布 2026-08-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-team-board)

> **用途**：同一DSH进程内的协作者可共享结构化任务和三列视图，但任务完成仍需另行验收。[Q01](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-team-board/INSIGHT.md#research-q01)

> **亮点**：共同服务把跨agent的主题、负责人、状态和依赖ID变为可查询对象，工具与界面共享同一状态，是相对文字交接的具体增量；不承诺自动调度或首创。[Q01](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-team-board/INSIGHT.md#research-q01)

> **思考**：认领可被后写覆盖，持久化错误被吞且全HOME共用文件；返回成功不等于排他获得任务或重启后仍保留，不能用于重要任务的可靠分派。[Q03](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-team-board/INSIGHT.md#research-q03)

> **建议**：带版本更新、原子文件替换和显式写错响应可能使冲突与恢复可核对；应比较双认领和中断轨迹，若仍误报成功或负担过高则放弃。这是未实现设计。[Q04](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-team-board/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-team-board/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1278843763-root"></a>

## [QA Skills](../../plugins/fishzjp--qa-skills/INSIGHT.md)

[![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fishzjp/qa-skills)

> **用途**：供已有Agent、测试环境和工具的开发/QA团队，把一个明确需求转成可复核策略、用例和真实运行报告；仅方法文本不代表测试系统已运行。

> **亮点**：[Q01](../../plugins/fishzjp--qa-skills/INSIGHT.md#research-q01)、[Q02](../../plugins/fishzjp--qa-skills/INSIGHT.md#research-q02)支持将既有测试方法组织成12任务技能与core、阶段产物和机械门槛。贡献在流程与证据衔接，不是新测试引擎或自动保证缺陷检出。

> **思考**：[Q02](../../plugins/fishzjp--qa-skills/INSIGHT.md#research-q02)、[Q03](../../plugins/fishzjp--qa-skills/INSIGHT.md#research-q03)说明文件、Schema和路径存在不证明测试真实有效；重要语义仍需人工/Agent回原件。安装多目录切换非原子，外部工具和账号也不会随技能安装齐备。

> **建议**：[Q04](../../plugins/fishzjp--qa-skills/INSIGHT.md#research-q04)提出未验证的需求风险到用例再到真实运行原件的抽样语义审计，对照重要漏测/假通过与总工时调用成本。只扩字段不能证明改善，成本不抵结果就收窄或退出，不计已有贡献。

[查看完整分析](../../plugins/fishzjp--qa-skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1237266636-root"></a>

## [RainSkills](../../plugins/goodrain--rainskills/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/goodrain/rainskills) [![npm 30d 2,378](https://img.shields.io/static/v1?label=npm+30d&message=2%2C378&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rainskills) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rainskills)

> **用途**：已有多组件项目和 Rainbond 环境的维护者，可按应用范围核对部署与交付状态。

> **亮点**：把单应用内的步骤范围、部分写入和访问探测分开表达，便于定位需人工核对的环节。见 [Q01](../../plugins/goodrain--rainskills/INSIGHT.md#research-q01)、[Q02](../../plugins/goodrain--rainskills/INSIGHT.md#research-q02)。

> **思考**：批量失败不会回滚前面的成功步骤，HTTP verified 不能替代业务请求断言。见 [Q02](../../plugins/goodrain--rainskills/INSIGHT.md#research-q02)。

> **建议**：在错误路由与未知写入下，对照平台启动状态和交付探测的误报率。见 [Q04](../../plugins/goodrain--rainskills/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/goodrain--rainskills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1222692871-dsh-dsh-rdd-explore"></a>

## [rdd-explore](../../plugins/yaphethayate--coderdd--dsh-dsh-rdd-explore/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YaphetHayate/codeRDD)

> **用途**：在同一代码库反复研究实现的 DSH 使用者。

> **亮点**：[Q01](../../plugins/yaphethayate--coderdd--dsh-dsh-rdd-explore/INSIGHT.md#research-q01) 与 [Q02](../../plugins/yaphethayate--coderdd--dsh-dsh-rdd-explore/INSIGHT.md#research-q02) 将现有探索索引和子代理组合成缓存优先工具。

> **思考**：[Q02](../../plugins/yaphethayate--coderdd--dsh-dsh-rdd-explore/INSIGHT.md#research-q02) 锚点有效不证明摘要完整或新文件未改变答案；[Q03](../../plugins/yaphethayate--coderdd--dsh-dsh-rdd-explore/INSIGHT.md#research-q03) 可选向量服务有外发边界。

> **建议**：[Q04](../../plugins/yaphethayate--coderdd--dsh-dsh-rdd-explore/INSIGHT.md#research-q04) 假设记录依赖集合摘要可改善新增文件导致的遗漏，尚未验证。

[查看完整分析](../../plugins/yaphethayate--coderdd--dsh-dsh-rdd-explore/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1209966933-root"></a>

## [REA](../../plugins/morluto--rea/INSIGHT.md)

[![GitHub ★ 452,144](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=452%2C144&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/rea) [![npm 30d 1,945,914](https://img.shields.io/static/v1?label=npm+30d&message=1%2C945%2C914&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)

> **用途**：面向需要调查有权检查的 Electron 构建物的工程师。REA 可以从同一份产物中梳理脚本、模块和入口线索，并为团队保留证据身份与覆盖范围。

> **亮点**：[Q02](../../plugins/morluto--rea/INSIGHT.md#research-q02) 的 setup 把 REA 的真实启动路径交给 DSH 原生 MCP 客户端，并在配置写入后回读。相比手工解包和分散记笔记，[Q03](../../plugins/morluto--rea/INSIGHT.md#research-q03) 将产物、选择范围、图和部分失败绑定到同一证据对象，交接时能追溯判断基于哪份构建物。

> **思考**：[Q03](../../plugins/morluto--rea/INSIGHT.md#research-q03) 的哈希只绑定产物字节。延迟加载的入口、未选择的文件及部分解析会缩小可判断范围。[Q02](../../plugins/morluto--rea/INSIGHT.md#research-q02) 中配置回读和真实工具握手也属于两个阶段，需分别检查。

> **建议**：[Q05](../../plugins/morluto--rea/INSIGHT.md#research-q05) 提出让每条功能主张绑定源位置、未覆盖范围和待查行为。以相同模型、预算和 REA 工具对照自由汇报，比较误报、定位率与复核时间。若误报未减或总复核成本上升，就不采纳约束。此方案待验证。

[查看完整分析](../../plugins/morluto--rea/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1188590713-plugins-rotifer"></a>

## [Rotifer Protocol](../../plugins/rotifer-protocol--rotifer-playground--plugins-rotifer/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/rotifer-protocol/rotifer-playground) [![npm 30d 285](https://img.shields.io/static/v1?label=npm+30d&message=285&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rotifer) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rotifer)

> **用途**：希望在 DSH 中发现和评估 Rotifer Gene 的开发者。

> **亮点**：[Q01](../../plugins/rotifer-protocol--rotifer-playground--plugins-rotifer/INSIGHT.md#research-q01) 与 [Q02](../../plugins/rotifer-protocol--rotifer-playground--plugins-rotifer/INSIGHT.md#research-q02) 把技能与 MCP 配置接入 DSH；不将外部 Gene 引擎归因于此 bundle。

> **思考**：[Q03](../../plugins/rotifer-protocol--rotifer-playground--plugins-rotifer/INSIGHT.md#research-q03) 审批、工具限制与沙箱是作者说明，配置只能证明传参，其他工具入口也需独立约束。

> **建议**：[Q06](../../plugins/rotifer-protocol--rotifer-playground--plugins-rotifer/INSIGHT.md#research-q06) 提出集中呈现候选及排名依据供人工审批，需要用户实验。

[查看完整分析](../../plugins/rotifer-protocol--rotifer-playground--plugins-rotifer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1342524723-root"></a>

## [RoundTable](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md)

[![GitHub ★ 13](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9931666/dsh-plugin-roundtable) [![npm 30d 1,891](https://img.shields.io/static/v1?label=npm+30d&message=1%2C891&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable) [![最新发布 2026-10-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable)

> **用途**：需要讨论设计或评审复杂方案的用户；基线是单代理回答并由用户自行比较。[Q01](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md#research-q01)

> **亮点**：结合节点拓扑、发言记录、汇总与人工选择组织多视角讨论。[Q01](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md#research-q01)

> **思考**：截断摘要并非完整证据，发言 token 预算也不是账单上限。[Q02](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md#research-q02) [Q03](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md#research-q03)

> **建议**：未验证假设：完整显示覆盖率并提示未测账单，可降低费用误判；须对照已有 provider 用量及不可测提示。[Q05](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-995029641-root"></a>

## [Ruflo](../../plugins/ruvnet--ruflo/INSIGHT.md)

[![GitHub ★ 80,987](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=80%2C987&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ruvnet/ruflo) [![npm 30d 55,572](https://img.shields.io/static/v1?label=npm+30d&message=55%2C572&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow)

> **用途**：根项目Ruflo当前npm包名claude-flow3.72.1，是独立CLI/MCP协调工具/多包工程，非DSH原生插件。它面向确需跨会话登记角色、配置模型、分配任务/归档和治理调用的开发者，基线是原生Task/Todo和直接模型API。成功须任务产物合格、协调责任清楚且费用可核，不是Agent登记数/状态completed/模型API成功。

> **亮点**：[Q02](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q02)统一角色配置/调用/结果和完成新快照重读；[Q04](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q04)中央policy/envelope/可选caller验证接线。

> **思考**：[Q03](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q03)complete/terminate是状态，API success非任务质量；[Q04](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q04)mode与caller开关决定实际防线，schema广告非授权；[Q05](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q05)净收益/退出仍未知。

> **建议**：[Q06](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q06)登记/响应/停止/独立验收四收据，先与人工清单/小修对照，不算当前gold学习或生命周期事务。

[查看完整分析](../../plugins/ruvnet--ruflo/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1146519069-root"></a>

## [See Wxapkg](../../plugins/leslie-sss--seewxapkg/INSIGHT.md)

[![GitHub ★ 128](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=128&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Leslie-SSS/seeWxapkg)

> **用途**：See Wxapkg 是独立自托管Web工具，不是DSH原生插件。它面向有权分析小程序编译包的开发者，把上传、类型识别、AppID解密、解包、结构归一、静态恢复、格式整理、检查及ZIP交付串成任务。输入是wxapkg和必要AppID，合格结果是有来源与缺口说明、可以继续阅读的恢复工程，不是原始源码或可运行保证。实际StartTask保存上传与一次性凭据、创建任务并入队，RunTask按阶段调用解密、解包、归一与恢复，再验证和打包。相对单独调用解包脚本，它增加任务状态、部分结果和报告；fallback明确来自wxappUnpacker，不能把第三方恢复能力归为原创。

> **亮点**：[Q01](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q01) 与[Q02](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q02) 将多阶段恢复、来源和不完整状态组织成可下载工程与报告；第三方fallback明确归属。

> **思考**：[Q02](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q02) 静态分数与completed不证明原工程语义等价；[Q03](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q03) 启用诊断样本时，partial/failed保留包与AppID至后台周期清理，不能承诺终态立即全删，停机或删除失败也可能延后。

> **建议**：[Q04](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q04) 以每项产物来源和缺口替代单总分决策，可能更容易识别不可运行的恢复结果，尚待用户对照。

[查看完整分析](../../plugins/leslie-sss--seewxapkg/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1427788427-plugins-sessions-insight"></a>

## [Sessions Insight](../../plugins/mt-youya--dsh-plugins--plugins-sessions-insight/INSIGHT.md)

[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Mt-Youya/dsh-plugins) [![npm 30d 742](https://img.shields.io/static/v1?label=npm+30d&message=742&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cyrusdoyle/dsh-sessions-insight) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cyrusdoyle/dsh-sessions-insight)

> **用途**：跨Claude/Codex/DSH工作的本地开发者按项目找历史上下文/工具/压缩片段，先用脱敏副本验证，见 [Q01](../../plugins/mt-youya--dsh-plugins--plugins-sessions-insight/INSIGHT.md#research-q01)。

> **亮点**：项目轴汇合三源并显式呈现估算/实值与缺口；handoff区分排队、一轮运行和结束，避免只凭prompt接受当成功，见 [Q01](../../plugins/mt-youya--dsh-plugins--plugins-sessions-insight/INSIGHT.md#research-q01)至 [Q04](../../plugins/mt-youya--dsh-plugins--plugins-sessions-insight/INSIGHT.md#research-q04)。

> **思考**：同源header不是鉴权，删除不可逆且多文件可部分成功；handoff内存baseline不耐重启、completed非业务验收，数值/价表不等真账，见 [Q03](../../plugins/mt-youya--dsh-plugins--plugins-sessions-insight/INSIGHT.md#research-q03)至 [Q05](../../plugins/mt-youya--dsh-plugins--plugins-sessions-insight/INSIGHT.md#research-q05)。

> **建议**：未验证方向为持久handoff操作收据与分层验收，先核Host现有去重能力，再以三故障样本测误重试/误成功；已有能力足够则不开发，见 [Q07](../../plugins/mt-youya--dsh-plugins--plugins-sessions-insight/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/mt-youya--dsh-plugins--plugins-sessions-insight/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1404374196-root"></a>

## [sieve 开发工作区](../../plugins/sev7een7--dsh-sieve/INSIGHT.md)

[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Sev7eEn7/dsh-sieve)

> **用途**：维护者可从此根工作区研究上下文处理与Web面板的分包方式；终端用户应选择实际子包。[Q01](../../plugins/sev7een7--dsh-sieve/INSIGHT.md#research-q01)

> **亮点**：根工作区清晰区分后端判断处理与浏览器面板，并用统一脚本构建；价值在开发组织，不把根目录重复计算为另一套上下文算法。[Q01](../../plugins/sev7een7--dsh-sieve/INSIGHT.md#research-q01)

> **思考**：根包private且无bundle补丁，目录收录的根URL不能被当成可直接启用的插件；界面可见也不证明判断器和净节省已成立。[Q01](../../plugins/sev7een7--dsh-sieve/INSIGHT.md#research-q01) [Q03](../../plugins/sev7een7--dsh-sieve/INSIGHT.md#research-q03)

> **建议**：未验证假设是把自检分成后端挂载、判断来源与界面连接三个状态，减少把根工作区或面板当功能生效的误判；以首次安装判读和排障时间对照，不能改善就放弃。[Q04](../../plugins/sev7een7--dsh-sieve/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/sev7een7--dsh-sieve/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1215961903-root"></a>

## [sivtr](../../plugins/ariestar--sivtr/INSIGHT.md)

[![GitHub ★ 255](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=255&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ariestar/sivtr)

> **用途**：需要跨终端和 Agent 工作记录查找错误及上下文的开发者。

> **亮点**：[Q01](../../plugins/ariestar--sivtr/INSIGHT.md#research-q01) 和 [Q02](../../plugins/ariestar--sivtr/INSIGHT.md#research-q02) 统一工作记录并对 DSH 提供格式解析；效果未对照。

> **思考**：[Q03](../../plugins/ariestar--sivtr/INSIGHT.md#research-q03) DSH 不受 MCP 自动安装管理，日志采集和远程脱敏仍需核查权限与覆盖。

> **建议**：[Q05](../../plugins/ariestar--sivtr/INSIGHT.md#research-q05) 提出显示解析覆盖和截断信息，需对照现有界面与用户误判。

[查看完整分析](../../plugins/ariestar--sivtr/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1178833585-plugins-dsh"></a>

## [SkillHub DSH](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md)

[![GitHub ★ 5,410](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C410&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iflytek/skillhub) [![npm 30d 2,064](https://img.shields.io/static/v1?label=npm+30d&message=2%2C064&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh)

> **用途**：在 DSH 反复寻找和复用技能的开发者，需要在安装前审阅对应版本并验明当前会话实际可用。

> **亮点**：[Q01](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q01) 将受限版本预览和技能发现接入宿主，[Q02](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q02)、[Q03](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q03) 连接选择、确认、操作与后续实际状态。

> **思考**：[Q02](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q02) 兼容门按实际依赖图拒绝写入，已受理仍可能失败。[Q03](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q03) 当前会话可能使用同名的另一安装。

> **建议**：[Q03](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q03) 对照当前预览与诊断，在一处标明预览、安装和宿主胜者，观察是否减少误用。尚未验证。

[查看完整分析](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1208725464-root"></a>

## [Skills-Link](../../plugins/shanliuling--skills-link/INSIGHT.md)

[![GitHub ★ 197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=197&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shanliuling/skills-link) [![npm 30d 78](https://img.shields.io/static/v1?label=npm+30d&message=78&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/skills-link) [![最新发布 2026-04-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-04-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/skills-link)

> **用途**：多AI App个人用户集中可信Skill；基线手工复制/ln/Git。合格结果需各App确见预期版本且原目录可恢复，不是路径数量。

> **亮点**：[Q01](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q01)与[Q02](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q02) 把多App路径发现、导入与跨平台链接组织起来，少维护多份Skill字节。成熟ln/Git不归原创，目录同步不证明Skill在各Agent正确生效。

> **思考**：[Q02](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q02) 创建失败不自动还原，reset可删除master并覆盖多backup，rollback实际hard reset；[Q03](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q03)普通start可pull/add/commit/push，共享writer与远端变更影响所有App。必须先外部备份/关Git试，不把同步当安全分发。

> **建议**：[Q04](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q04)逐host Skill版本/工具条件和改后待复核提示可能减少静默回归；三类变更比较漏错/误阻断/审核成本，不改善即否定，尚未实现不计贡献。

[查看完整分析](../../plugins/shanliuling--skills-link/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1273149259-engine-dsh-plugins-cordis-plugin-sofagent-audit"></a>

## [sofagent audit（DSH 子插件）](../../plugins/kongfangxun--sofagent--engine-dsh-plugins-cordis-plugin-sofagent-audit/INSIGHT.md)

[![GitHub ★ 55](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=55&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KongFangXun/sofagent) [![npm 30d 793](https://img.shields.io/static/v1?label=npm+30d&message=793&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cordis-plugin-sofagent-audit) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cordis-plugin-sofagent-audit)

> **用途**：开发者希望在DSH工具调用与收尾时接入机器检查和审计记录。见 [Q01](../../plugins/kongfangxun--sofagent--engine-dsh-plugins-cordis-plugin-sofagent-audit/INSIGHT.md#research-q01)。

> **亮点**：将已有sofagent判定源和留证接入DSH生命周期；规则/验收算法继承引擎包，自动全diff审查未由四事件直接成立。见 [Q01](../../plugins/kongfangxun--sofagent--engine-dsh-plugins-cordis-plugin-sofagent-audit/INSIGHT.md#research-q01)、[Q03](../../plugins/kongfangxun--sofagent--engine-dsh-plugins-cordis-plugin-sofagent-audit/INSIGHT.md#research-q03)。

> **思考**：文件写入事件放行，依赖失败fail-open，验收失败仅每turn一次steer；硬门禁表述超过实现，全局任务ID非会话绑定。见 [Q02](../../plugins/kongfangxun--sofagent--engine-dsh-plugins-cordis-plugin-sofagent-audit/INSIGHT.md#research-q02)。

> **建议**：分观察与强制模式，用UNKNOWN终态、会话任务绑定和外部关口验证误放行/等待取舍；Host不能阻断则回CI。见 [Q04](../../plugins/kongfangxun--sofagent--engine-dsh-plugins-cordis-plugin-sofagent-audit/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/kongfangxun--sofagent--engine-dsh-plugins-cordis-plugin-sofagent-audit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1156210476-root"></a>

## [SpecFusion](../../plugins/wxkingstar--specfusion/INSIGHT.md)

[![GitHub ★ 76](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=76&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wxkingstar/SpecFusion)

> **用途**：面向反复对接中文开放平台的开发者，按平台、开发模式与关键词查接口并回读原文，见[Q01](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q01)、[Q02](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q02)把中文/API标识分词、平台与模式过滤、摘要到全文的查询入口组合起来，减少跨站组织资料的步骤。它不证明文档覆盖完整、始终最新或生成代码正确。

> **思考**：[Q03](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q03)发现last_updated可回退为入库时间，关键词只重排最多200候选而响应仍写共N条；未指定模式的去重键不含来源。自部署默认管理令牌和全接口监听还需显式配置，托管服务配置不能据此推断。

> **建议**：[Q05](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q05)提出未验证的上游日期、抓取时间、内容hash和覆盖缺口分离协议；相对已有来源链接增量在减少“最新/全部”的误述，以预置缺页和截断查询对照，负担更大或错误不降则否定。

[查看完整分析](../../plugins/wxkingstar--specfusion/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1329972465-root"></a>

## [StrataGate DSH](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md)

[![GitHub ★ 115](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=115&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/diqierjia/StrataGate-AgentMemory) [![npm 30d 10,676](https://img.shields.io/static/v1?label=npm+30d&message=10%2C676&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/stratagate-dsh) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/stratagate-dsh)

> **用途**：反复切换 DSH 会话的项目开发者，需要依据历史原文确认旧决定、后续更正和当前状态。

> **亮点**：[Q01](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q01) 将历史目录、项目空间与日记快照接入新会话，[Q02](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q02) 用事件来源及采用回执区分候选和实际使用。可在原 DSH 流程找回旧决定并复核来源。

> **思考**：[Q01](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q01) 的持久画像属于安装级范围，[Q03](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q03) 的外部检索可送出查询及候选文本。[Q02](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q02) 的回执失败可能阻止任务正常结束，使用前应核对这三条边界。

> **建议**：[Q04](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q04) 提议先识别历史指代，再只为命中问题增加候选，用来源准确率和上下文成本对照现有自动组装及手工笔记。

[查看完整分析](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1207705027-root"></a>

## [SumSec-Skills](../../plugins/summersec--sumsec-skills/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SummerSec/SumSec-Skills)

> **用途**：需要跨多个 Agent 宿主复用写作与开发指引的用户。

> **亮点**：[Q01](../../plugins/summersec--sumsec-skills/INSIGHT.md#research-q01) 与 [Q02](../../plugins/summersec--sumsec-skills/INSIGHT.md#research-q02) 组织多个来源和 DSH 目录，不将镜像能力算作本仓原创。

> **思考**：[Q02](../../plugins/summersec--sumsec-skills/INSIGHT.md#research-q02) 后层替换 provider 整体配置，其他自定义根能否保留取决于宿主合并。

> **建议**：[Q04](../../plugins/summersec--sumsec-skills/INSIGHT.md#research-q04) 假设可组合追加或预览根目录可减少配置误失，尚未验证。

[查看完整分析](../../plugins/summersec--sumsec-skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1232531989-root"></a>

## [Supergraph](../../plugins/datit309--supergraph/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/datit309/supergraph) [![npm 30d 69](https://img.shields.io/static/v1?label=npm+30d&message=69&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/supergraph) [![最新发布 2017-11-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2017-11-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/supergraph)

> **用途**：需要核对跨模块改动的开发者可用图索引辅助定位，再回到源码和测试核实。

> **亮点**：把图状态检查接入工程工作流，并要求缓存仍可复查。图和 LSP 能力继承各自上游。见 [Q01](../../plugins/datit309--supergraph/INSIGHT.md#research-q01)、[Q02](../../plugins/datit309--supergraph/INSIGHT.md#research-q02)。

> **思考**：HEAD 一致不能单独覆盖未提交文件，索引可用也不等于影响面完整。外部 MCP 和宿主权限应单独核查。见 [Q02](../../plugins/datit309--supergraph/INSIGHT.md#research-q02)、[Q03](../../plugins/datit309--supergraph/INSIGHT.md#research-q03)。

> **建议**：将图辅助和 Git 搜索在同一跨模块任务上配对比较，记录关键依赖漏项和总人时。见 [Q04](../../plugins/datit309--supergraph/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/datit309--supergraph/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333750613-root"></a>

## [Superpowers DSH](../../plugins/laynechai--superpowers-dsh/INSIGHT.md)

[![GitHub ★ 139](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=139&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LayneChai/superpowers-dsh) [![npm 30d 6,155](https://img.shields.io/static/v1?label=npm+30d&message=6%2C155&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/superpowers-dsh) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/superpowers-dsh)

> **用途**：开发者希望在 DSH 中复用规划、调试与验证约定。

> **亮点**：[Q01](../../plugins/laynechai--superpowers-dsh/INSIGHT.md#research-q01) 把上游方法统一接入 DSH 技能目录。

> **思考**：[Q03](../../plugins/laynechai--superpowers-dsh/INSIGHT.md#research-q03) 技能内容为模型指导，执行和同名优先级需实测。

> **建议**：[Q05](../../plugins/laynechai--superpowers-dsh/INSIGHT.md#research-q05) 统一注册可能减少配置成本，并提高缺陷修复中实际执行验证的比例。

[查看完整分析](../../plugins/laynechai--superpowers-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1074165057-packages-dsh-maker"></a>

## [TapTap DSH Maker](../../plugins/taptap--instant-games-open-mcp--packages-dsh-maker/INSIGHT.md)

[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/taptap/instant-games-open-mcp) [![npm 30d 719](https://img.shields.io/static/v1?label=npm+30d&message=719&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@taptap/dsh-maker) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@taptap/dsh-maker)

> **用途**：[Q01](../../plugins/taptap--instant-games-open-mcp--packages-dsh-maker/INSIGHT.md#research-q01) 面向已有或准备使用Maker的DSH游戏开发者，以明确项目的可解释状态作为接入验收。

> **亮点**：[Q01](../../plugins/taptap--instant-games-open-mcp--packages-dsh-maker/INSIGHT.md#research-q01) 固定依赖解析、非重复扫描的技能挂载和CLI发现合并为DSH原生入口，减少路径猜测与手工配置责任。

> **思考**：[Q02](../../plugins/taptap--instant-games-open-mcp--packages-dsh-maker/INSIGHT.md#research-q02) 宽容启动只作用外部MCP阶段，缺包可先throw；1小时等待不是取消，target_dir与意图约束是指南，不能当服务端权限保证。

> **建议**：[Q03](../../plugins/taptap--instant-games-open-mcp--packages-dsh-maker/INSIGHT.md#research-q03) 未验证能力快照绑定实际runtime、工具、CLI与项目，比较现有inspect，测版本错用和恢复；无改善或误导即否定。

[查看完整分析](../../plugins/taptap--instant-games-open-mcp--packages-dsh-maker/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1074165057-root"></a>

## [TapTap Open API MCP](../../plugins/taptap--instant-games-open-mcp/INSIGHT.md)

[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/taptap/instant-games-open-mcp) [![npm 30d 5,074](https://img.shields.io/static/v1?label=npm+30d&message=5%2C074&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@taptap/instant-games-open-mcp) [![最新发布 2026-09-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@taptap/instant-games-open-mcp)

> **用途**：[Q01](../../plugins/taptap--instant-games-open-mcp/INSIGHT.md#research-q01) TapTap小游戏/H5开发者在明确应用上查指南和管理状态，验收须核实际应用结果。

> **亮点**：[Q01](../../plugins/taptap--instant-games-open-mcp/INSIGHT.md#research-q01) 将应用上下文、文档指南与管理handler统一在Agent接口，模块内定义与handler同置降低分派漂移；[Q02](../../plugins/taptap--instant-games-open-mcp/INSIGHT.md#research-q02) 方向检查及写后回读提供具体失败区分。

> **思考**：[Q02](../../plugins/taptap--instant-games-open-mcp/INSIGHT.md#research-q02) 上传描述的确认没有准备摘要绑定；token为JSON缓存，HTTP用户标识和会话独立不足以证明隔离；写后读回警告可能已有远端副作用，不能盲重试。

> **建议**：[Q03](../../plugins/taptap--instant-games-open-mcp/INSIGHT.md#research-q03) 未验证确认快照绑定app、目录与字段，执行前验摘要、写后回读操作标识；以错配和未知结果对照，无改善或负担过高即否定。

[查看完整分析](../../plugins/taptap--instant-games-open-mcp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1269057665-root"></a>

## [Terrain](../../plugins/sopaco--terrain/INSIGHT.md)

[![GitHub ★ 274](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=274&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sopaco/terrain)

> **用途**：仓库维护者和编码Agent复用架构/源索引、查证变更影响；需求强度与相对手写文档收益待核，见[Q01](../../plugins/sopaco--terrain/INSIGHT.md#research-q01)。

> **亮点**：仓库资料共址、增量/skip和分层漂移信任、GUI与真实检索工具组合；独立能力主表、步骤见Q01，结果边界见[Q02](../../plugins/sopaco--terrain/INSIGHT.md#research-q02)。

> **思考**：完整/新鲜不等语义正确；无freshness和ledger时预载默许，Ask可写知识/调模型，Hybrid异常fallback不证明未写，见[Q02](../../plugins/sopaco--terrain/INSIGHT.md#research-q02)、[Q03](../../plugins/sopaco--terrain/INSIGHT.md#research-q03)。

> **建议**：超出现有Git分层指标与正则引用，检验固定树的关键架构命题和变更反证；独立任务/指标/停止条件见[Q05](../../plugins/sopaco--terrain/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/sopaco--terrain/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1349635927-root"></a>

## [Trae 连接器](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md)

[![GitHub ★ 217](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=217&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingminhua/dsh-connect-trae) [![npm 30d 24,622](https://img.shields.io/static/v1?label=npm+30d&message=24%2C622&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-trae) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-trae)

> **用途**：开发者可在 DSH 对话里调用已获准使用的 Trae 模型，并接续宿主的本地工具。

> **亮点**：[Q01](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md#research-q01) 供应商适配器将 Trae 模型输出接入 DSH 原有工具循环，并按供应商选择对应上游路由。

> **思考**：[Q02](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md#research-q02) 企业目录会展示租户自配条目，现有企业聊天通道缺少这类模型所需的直连路径。企业图片预算也依赖宿主卸载和重发。

> **建议**：[Q04](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md#research-q04) 分开标示目录发现与经验证的可调用性，并在提交前估算完整请求体积，可能减少无效请求和不必要的图片卸载。

[查看完整分析](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1349900532-root"></a>

## [Unity Plugin for DeepSeek Harness](../../plugins/opdsh--unity-plugin/INSIGHT.md)

[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/opdsh/unity-plugin) [![npm 30d 2,230](https://img.shields.io/static/v1?label=npm+30d&message=2%2C230&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opdsh/unity-plugin) [![最新发布 2026-09-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opdsh/unity-plugin)

> **用途**：已使用 DSH 的 Unity 开发者需要在一个会话确认项目、发现 Editor 命令并回读结果，合格结果应能核对真实项目和状态。[Q01](../../plugins/opdsh--unity-plugin/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/opdsh--unity-plugin/INSIGHT.md#research-q01) [Q02](../../plugins/opdsh--unity-plugin/INSIGHT.md#research-q02) 用结构工具、配置与暖会话减少反复启动和手工转接，真实命令和执行仍由 Unity CLI 和 Editor 提供。

> **思考**：[Q03](../../plugins/opdsh--unity-plugin/INSIGHT.md#research-q03) cwd 复用与目标 projectPath 是不同边界。工具允许 C# 和原始 argv，取消只在本地终止暖会话，Editor 是否已执行须重读。暖 stdout 限制覆盖残余缓冲。

> **建议**：[Q05](../../plugins/opdsh--unity-plugin/INSIGHT.md#research-q05) 将目标 Editor 标识、写后回读与效果未知记录带入调度，可能减少误操作与重复修改。用故障注入比较用户的重试决定。

[查看完整分析](../../plugins/opdsh--unity-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1190568968-root"></a>

## [Upstash Agent Skills](../../plugins/upstash--skills/INSIGHT.md)

[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/upstash/skills)

> **用途**：[Q01](../../plugins/upstash--skills/INSIGHT.md#research-q01) 面向开发或管理 Upstash 服务的 DSH 用户。

> **亮点**：[Q01](../../plugins/upstash--skills/INSIGHT.md#research-q01) 与 [Q02](../../plugins/upstash--skills/INSIGHT.md#research-q02) 把产品文档和条件式 MCP 连接汇入宿主。

> **思考**：[Q03](../../plugins/upstash--skills/INSIGHT.md#research-q03) 固定仓库提交仍执行 MCP latest，服务权限和运行版本未固定。

> **建议**：[Q05](../../plugins/upstash--skills/INSIGHT.md#research-q05) 假设固定版本、连接状态和凭据预检查可改善可控性；尚未验证。

[查看完整分析](../../plugins/upstash--skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1164005541-root"></a>

## [VibeSkills](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md)

[![GitHub ★ 3,807](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C807&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/foryourhealth111-pixel/Vibe-Skills)

> **用途**：已有多个本地 Skill 的开发者需在一个复杂任务中明确依赖、写入边界和可复核的结果。[Q01](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q01)

> **亮点**：将用户决策、Skill 组织、实际计划摘要和每模块验收结果连接起来，继续工作时能检查输入和依赖是否仍有效。[Q02](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q02) [Q03](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q03)

> **思考**：候选匹配、安装回执和启动证明分别覆盖不同事实。业务验收仍需审阅真实产物，且固定版本没有 DSH 原生接线证据。[Q01](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q01) [Q03](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q03) [Q04](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q04)

> **建议**：待验证方向是把保留的停点与实际会改变交付或写入边界的决策对应，通过同任务对照检验能否减少等待而不增加返工。[Q05](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q05)

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

<a id="plugin-1407165036-root"></a>

## [WorkBuddy + Trae + Qoder Connect](../../plugins/chengshenyangtai--dsh-workbuddy-trae-qoder-connect/INSIGHT.md)

[![GitHub ★ 61](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect)

> **用途**：已有多渠道账号的个人开发者在同一DSH会话选择模型并管理状态。见 [Q01](../../plugins/chengshenyangtai--dsh-workbuddy-trae-qoder-connect/INSIGHT.md#research-q01)。

> **亮点**：渠道编排、统一状态/偏好、目录/档位和工具协议适配减少分散入口；自主循环继承DSH，上游额度和推理能力不由插件产生。见 [Q01](../../plugins/chengshenyangtai--dsh-workbuddy-trae-qoder-connect/INSIGHT.md#research-q01)、[Q03](../../plugins/chengshenyangtai--dsh-workbuddy-trae-qoder-connect/INSIGHT.md#research-q03)。

> **思考**：停用标记未进入自动/一键签到过滤，违背不参与签到的控制承诺；历史修复和流中断也使统一界面不能证明输入与结果完整。见 [Q02](../../plugins/chengshenyangtai--dsh-workbuddy-trae-qoder-connect/INSIGHT.md#research-q02)。

> **建议**：先修停用过滤，再验证有效输入/账号/领取目标回执能否减少误调用与结果误判；无独立改善即推翻。见 [Q04](../../plugins/chengshenyangtai--dsh-workbuddy-trae-qoder-connect/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/chengshenyangtai--dsh-workbuddy-trae-qoder-connect/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1309769324-root"></a>

## [working-activity](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md)

[![GitHub ★ 667](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=667&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ccch1mneyyy/working-activity) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/pi-working-activity) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/pi-working-activity)

> **用途**：长时间编码任务操作者需要看懂当前活动，原办法是转圈提示和完整日志。

> **亮点**：[Q01](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q01) 与 [Q02](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q02) 的增量是把工具事件、耗时和实时自述集中成可消费的状态投影，降低查找活动的步骤；不证明编码任务更快。

> **思考**：[Q03](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q03) 默认自述增加上下文和输出，且活动结束不等于交付通过；宿主事件与客户端版本会影响显示。

> **建议**：[Q04](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q04) 提出分开显示已观察活动与模型意图；若不能减少误取消和卡住误判，增加文案没有成立的收益。

[查看完整分析](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381859181-root"></a>

## [WSL rclone 查询工具](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-rclone)

> **用途**：已配置 rclone 的 DSH 用户可查询远程的文件名和用量。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md#research-q01) 用专用入口把远程文件枚举和配额结果带进 DSH。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md#research-q03) 名单为空等于不限远程名，非空名单也不限制目录前缀。

> **建议**：[Q05](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md#research-q05) 测试前缀策略能否减少同一远程内的越界枚举。

[查看完整分析](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1235225511-root"></a>

## [xskill](../../plugins/skillnerds--xskill/INSIGHT.md)

[![GitHub ★ 128](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=128&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SkillNerds/xskill)

> **用途**：有重复任务的团队可把已有做法沉淀为候选 Skill，再由独立流程评估。

> **亮点**：把跨宿主采集、候选版本和采样归因接成可回查流程。见 [Q01](../../plugins/skillnerds--xskill/INSIGHT.md#research-q01)、[Q02](../../plugins/skillnerds--xskill/INSIGHT.md#research-q02)。

> **思考**：匹配脱敏只覆盖已知文本模式，评分不能替代安全与语义核验。见 [Q02](../../plugins/skillnerds--xskill/INSIGHT.md#research-q02)、[Q03](../../plugins/skillnerds--xskill/INSIGHT.md#research-q03)。

> **建议**：以合成故障对照人工与自动抽取，并独立记录泄露、成功率和审阅人时。见 [Q04](../../plugins/skillnerds--xskill/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/skillnerds--xskill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1222262862-root"></a>

## [ZeroToken Skill](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md)

[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/phoenixlucky/zerotoken-skill)

> **用途**：用户明确要求简洁或低 token 时，助手需控制上下文和输出，同时保持任务质量。

> **亮点**：[Q01](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md#research-q01) 和 [Q02](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md#research-q02) 提供任务模式、工具路由与环境脚本；效益尚未对照。

> **思考**：[Q03](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md#research-q03) 需求更新时机械替换旧方案可能影响仍有效要求，须结合文档的追加确认及上级约束；[Q04](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md#research-q04) 工具有文件副作用。

> **建议**：[Q05](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md#research-q05) 假设以风险分层任务同时衡量 token 和质量可识别适用边界。

[查看完整分析](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1343002927-root"></a>

## [喵缓存账单](../../plugins/phant0meow--dsh-meow-cachebilling/INSIGHT.md)

[![GitHub ★ 50](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=50&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Phant0Meow/dsh-meow-cachebilling) [![npm 30d 2,588](https://img.shields.io/static/v1?label=npm+30d&message=2%2C588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-cachebilling) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-cachebilling)

> **用途**：已有DSH用户想理解缓存高命中仍增费，可对一个已知价表会话观察；未匹配模型不作账单，见 [Q01](../../plugins/phant0meow--dsh-meow-cachebilling/INSIGHT.md#research-q01)。

> **亮点**：把缓存读/未命中/输出价格与step/turn/session组织到上下文弹层，并给模型峰谷桶的历史曲线，便于针对当前会话追问费用来源，见 [Q01](../../plugins/phant0meow--dsh-meow-cachebilling/INSIGHT.md#research-q01)至 [Q03](../../plugins/phant0meow--dsh-meow-cachebilling/INSIGHT.md#research-q03)。

> **思考**：usage口径与flash兜底不保证现金正确；逐位置平均不是同群体总成本，失效标签非缓存过期证明，历史落盘可降级，见 [Q02](../../plugins/phant0meow--dsh-meow-cachebilling/INSIGHT.md#research-q02)至 [Q04](../../plugins/phant0meow--dsh-meow-cachebilling/INSIGHT.md#research-q04)。

> **建议**：同任务同质量的续窗/换窗净成本实验，纳入重读和人类交接；不降总费或质量/时间损失抵消即推翻，原版未实现该策略，见 [Q05](../../plugins/phant0meow--dsh-meow-cachebilling/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/phant0meow--dsh-meow-cachebilling/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1276714299-root"></a>

## [嵌入式工作台](../../plugins/amethystluna--embedded-workbench/INSIGHT.md)

[![GitHub ★ 29](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=29&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 3,820](https://img.shields.io/static/v1?label=npm+30d&message=3%2C820&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench)

> **用途**：面向已有固件仓库和工具链的开发者，按当前异常、构建或并发问题加载方法，以可复现修复而非报告格式作为结果，见[Q01](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q01)的按需领域材料与风险比例流程，[Q02](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q02)的持久来源去重和可选状态服务降级，形成比全量复制提示更可控的接线。方法和宿主能力的组合有局部增量，不宣称原创硬件知识或已测缺陷降低。

> **思考**：[Q03](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q03)确认“计划核查门”是提示消息，没有代码级拦截计划或校验证据；静态fact-check不证明状态机、并发和超时行为。出现核查章节不能作为固件交付通过。

> **建议**：[Q05](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q05)提出未验证的版本绑定逐声称证据层，用计划摘要和代码版本暴露陈旧核查，并区分静态确认与行为未验。若对照无法减少误放行或维护负担更大就停止。

[查看完整分析](../../plugins/amethystluna--embedded-workbench/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1418691015-root"></a>

## [提示词与错误经验面板](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk)

> **用途**：维护 Agent 提示及错误经验的操作者可先审核模型草稿。

> **亮点**：[Q01](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md#research-q01) 把错误草稿和提示管理接进宿主。

> **思考**：[Q03](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md#research-q03) 模型自述有误判，状态并发写也需验证。

> **建议**：[Q05](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md#research-q05) 比较可追溯提示对审核的帮助。

[查看完整分析](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335211378-root"></a>

## [无限五代 IG5](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md)

[![GitHub ★ 4,110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Minglink/dsh-infinite-gen-5)

> **用途**：在两个分析数据库之间交接同一授权样本的少量标注与字节改动，并保留审阅依据。

> **亮点**：[Q01](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q01) 和 [Q02](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q02) 将跨数据库标注交接变成可预览的单向计划。摘要绑定计划，双会话锁内重新核对修订与前后值，能在写入前拦住已过时的计划。

> **思考**：[Q03](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q03) 按行执行可留下部分修改，进程中断还可能使目的库变动与本地计划记录无法直接对账。

> **建议**：[Q05](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q05) 假设用绑定计划摘要的逐行待执行记录和后端回执，可以缩小进程中断后须人工对账的范围。

[查看完整分析](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1415863200-root"></a>

## [模型接力](../../plugins/airisey--dsh-model-failover/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Airisey/dsh-model-failover)

> **用途**：已有多个provider的DSH用户在额度/短时故障下推进可回滚任务，以正确产物和总成本验收，不以吐字/绿数/继续次数当完成。见[Q01](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q01)。

> **亮点**：以可见输出提交点约束一次调用内的静默混流，把候选选择、真实调用和会话×模板隔离组织为恢复机制；可借鉴的是边界与接线，不是已证明任务正确率或工具事务恢复。见[Q02](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q02)。

> **思考**：已提交内容后的抛错/idle可能没有补错误finish却记good；enabled只缩候选仍可重试首模型，全局继续默认独立开启且等待后不重读开关。可见提交、停止与业务办结不能互相替代，源码条件未作运行复现，见[Q02](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q02)、[Q03](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q03)。

> **建议**：先修终态/开关/待补与空probe等具体语义，再用宿主工具回执/未决摘要约束恢复，比较小修补、关继续和人工查询；若无重复动作/纠错成本净改善就否定独立方向。尚未实现/验证，见[Q05](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/airisey--dsh-model-failover/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333496313-root"></a>

## [飞书 DSH 机器人](../../plugins/plutokeating--dsh-lark-bot/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PlutoKeating/dsh-lark-bot) [![npm 30d 2,163](https://img.shields.io/static/v1?label=npm+30d&message=2%2C163&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lark-bot) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lark-bot)

> **用途**：用飞书沟通开发、需要远程追踪 DSH 任务的人，可在既有会话中接收状态和结果。

> **亮点**：用会话范围和持久任务账本把远程消息、运行状态和恢复接入飞书渠道。[Q01](../../plugins/plutokeating--dsh-lark-bot/INSIGHT.md#research-q01) [Q02](../../plugins/plutokeating--dsh-lark-bot/INSIGHT.md#research-q02)

> **思考**：中断只说明没有终态；旧 running 不自动重跑。审批策略有 allow 和低风险直通，卡片不能证明每次都会询问。[Q02](../../plugins/plutokeating--dsh-lark-bot/INSIGHT.md#research-q02) [Q03](../../plugins/plutokeating--dsh-lark-bot/INSIGHT.md#research-q03)

> **建议**：给外部动作独立回执供显式重试前对账，比较未知结果的重复率和恢复成本；无改善就撤回。[Q04](../../plugins/plutokeating--dsh-lark-bot/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/plutokeating--dsh-lark-bot/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333141598-root"></a>

## [鲸屿 Whale Isle](../../plugins/chisaalter--whaleisle/INSIGHT.md)

[![GitHub ★ 200](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=200&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ChisaAlter/WhaleIsle)

> **用途**：希望同窗口完成DSH对话与文件/终端/Git的桌面用户。

> **亮点**：[Q01](../../plugins/chisaalter--whaleisle/INSIGHT.md#research-q01)、[Q02](../../plugins/chisaalter--whaleisle/INSIGHT.md#research-q02)桌面统一生命周期、独立home与真实Host准入协调，基础Agent继承上游。

> **思考**：[Q03](../../plugins/chisaalter--whaleisle/INSIGHT.md#research-q03)排空注册操作非业务任务结束，force更新/退出deadline可继续；未知远端结果不能当取消成功。

> **建议**：[Q04](../../plugins/chisaalter--whaleisle/INSIGHT.md#research-q04)将已有forced/pending诊断形成重开待对账收据可探索，日志同效或提示误导即否定。

[查看完整分析](../../plugins/chisaalter--whaleisle/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334800188-root"></a>

## [鲸鱼女仆 UI 根工程资源](../../plugins/yunxiiqwq--dsh-maid-whale-ui/INSIGHT.md)

[![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yunxiiQwQ/dsh-maid-whale-UI)

> **用途**：使用者定位正确安装包，维护者查CI/构建路径；根本身不是运行主题。见 [Q01](../../plugins/yunxiiqwq--dsh-maid-whale-ui/INSIGHT.md#research-q01)。

> **亮点**：中英导航与维护门禁索引；子包功能不重复计为根运行贡献。见 [Q03](../../plugins/yunxiiqwq--dsh-maid-whale-ui/INSIGHT.md#research-q03)。

> **思考**：private根没有DSH入口；旧EXE hash检查后重建，脚本未生成新SHA或证明发行源码一致，CI非Host验收。见 [Q02](../../plugins/yunxiiqwq--dsh-maid-whale-ui/INSIGHT.md#research-q02)。

> **建议**：复用manifest/CI建立单一安装与发行映射，五静态情形证伪；发布页足够则仅链接。见 [Q04](../../plugins/yunxiiqwq--dsh-maid-whale-ui/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/yunxiiqwq--dsh-maid-whale-ui/INSIGHT.md) · [返回表格](#category-index)

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-11-13
