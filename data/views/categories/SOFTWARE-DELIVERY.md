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
| [@indexyz/dsh-autocompact](#plugin-1324229194-dsh-autocompact) | 为 DSH 会话或模型设置更早触发自动上下文压缩的阈值。 | [Q04](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q04) 在可重做的单路由任务中记录摘要、约束和总成本；若结果退化或 warning 持续，停止试用并按命令语义恢复默认。 |
| [@mstar-harness/dsh](#plugin-1174622182-packages-dsh) | 将 Morning Star 工作流门禁、命令和面板接入 DeepSeek Harness。 | [Q04](../../plugins/btspoony--mstar-harness--packages-dsh/INSIGHT.md#research-q04) 在隔离 profile 先确认根、门禁模式、工具名称与 MCP 信任，出现 degraded 或身份不明时恢复人工审查。 |
| [@opencues/dsh](#plugin-1197335472-integrations-dsh) | 将 OpenCues 写作建议与下划线补全接入 DSH 输入框。 | [Q04](../../plugins/opencues--opencues--integrations-dsh/INSIGHT.md#research-q04) 先用合成文本核对路由、费用和共享配置，退出时检查残留。 |
| [@pbfuzz/dsh-kanalyzer](#plugin-1227673478-packages-dsh-kanalyzer) | 为 DSH 提供 C/C++ LLVM bitcode 准备、KAMain 静态可达分析及调用关系查询。 | 先在可信小项目核对一条已知路径；没有距离时保留未知并使用动态覆盖。 |
| [@pbfuzz/dsh-pbfuzz](#plugin-1227673478-packages-dsh-pbfuzz) | 为 DSH 提供定向 fuzz 的计划、生成、执行、复盘与触发证据报告。 | 在隔离授权的教学项目上先检查一次构建、停止和独立回放；不满足时回手工 harness。 |
| [7d-code-reviewer](#plugin-1336021761-root) | 一个注册到 DSH skills 的模板驱动代码审查 Skill，要求模型输出分级问题、评分与文字/HTML 报告。 | 以小范围 diff 试用，人工核行号/复现与 HTML 安全；避免分数代替审查结论。 |
| [Aegis](#plugin-1225840521-root) | 为 AI 编码助手提供任务路由、工程方法及验证指导。 | [Q03](../../plugins/ganyuanran--aegis/INSIGHT.md#research-q03) 在隔离仓库对照首次动作和交付证据；路由未生效或成本过高时停用自动激活。 |
| [Agent Handoff Skill](#plugin-1230123793-root) | 为多种编码 Agent 建立仓库级交接文件，并辅助初始化、维护和归档。 | 先用测试仓库预览，核对规则差异后再试一次新会话。 |
| [Agent Vision Toolkit](#plugin-1319174653-root) | 为文本编码 Agent 提供图像问答、定位、长截图 OCR、像素处理与可选视觉代理。 | 建议公开截图的手工CLI限定试用，先保留原图复核和现有模型；敏感出站、漏段或重试成本不可控时停用并回原生视觉/人工检查。 |
| [agent-development-constraints](#plugin-1404700411-root) | 提供项目开发规则库与提炼精简合并流程，DSH按症状查询规则并一次注入入口目录，另有上下文成本观察和可选提交脱敏检查。 | 先观察，可人工择取规则方法，先核隐私/路由/会话和安装保留再在重要项目启用运行面。 |
| [agent-qa](#plugin-1232322871-root) | 用自然语言描述用户旅程，在 Web、Android 或 iOS 上执行测试并保留可检查证据的 QA 工具。 | [Q03](../../plugins/vostride--agent-qa/INSIGHT.md#research-q03) 先选可重置且不影响生产的少量旅程，把它作为探索补充并保留确定性断言。 |
| [AgentRQ](#plugin-1190390511-root) | 为人类与 AI Agent 提供共享工作区、任务和协作入口。 | 隔离工作区先核验授权、审批和产物；不明状态停用远程操作。 |
| [AI Look-Up](#plugin-1401618027-root) | 观察代理工具行为并在长任务中注入自审提醒与时间锚点。 | 先审查各通道、数据和预算；非敏感任务试用并人工复核提醒。 |
| [AI 残渣清运](#plugin-1406611614-root) | 按规则把代理副产物移入可恢复回收站，并支持项目结项归档。 | 适合副产物命名规律稳定、能先维护 ignore 且使用版本控制的项目试用；高价值数据目录或命名混乱仓库只运行 dry-run。 |
| [ANet DSH Bundle](#plugin-1302597978-deploy-plugins-dist-dsh) | 为 DSH 操作者将本机 anet 节点接到 MCP 与 Skill，以统一可执行路径和身份发现对端、委派任务并跟踪结果。 | 观察优先，操作者先关闭自动装并固定审阅运行时/guide/身份/节点政策，才确定非敏感无消费小样；版本/政策不明或任务/worker仍未知先停扩张并核状态。 |
| [API Relay Audit](#plugin-1195794651-root) | 本地探测 AI API 中转行为并生成审计报告。 | [Q04](../../plugins/toby-bridges--api-relay-audit/INSIGHT.md#research-q04) 仅在授权的隔离环境使用低权限临时凭据；审查敏感报告并撤销凭据。 |
| [Archify](#plugin-1211139949-root) | 将结构化图形与说明页渲染为可交互 HTML，并提供交付与证据检查。 | 先用一条可核查请求链和隔离目录试用，按实际类型确认浏览器门禁，再由人核查每条关系与视觉；材料或环境不足时回到简单图。 |
| [Archify DSH 适配器](#plugin-1211139949-integrations-deepseek-harness) | 以 DSH 文件系统 Skill provider 分发 Archify 架构图技能。 | [Q05](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q05) 先观察正式发布和宿主验收；隔离 profile 核对默认技能及实际来源。 |
| [Aria](#plugin-1225585638-root) | 提供响应式状态、异步和跨平台 UI 绑定的 C++ MVVM 框架。 | [Q04](../../plugins/dqsjqian--aria/INSIGHT.md#research-q04) 先在单一目标平台验证工具链、线程和回滚；不能满足平台或安全条件时保留原生方案。 |
| [baro-dsh](#plugin-1188682315-packages-baro-dsh) | 将 Baro 编码流程作为 DSH 子代理委派并显示任务状态。 | [Q04](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md#research-q04) 在隔离环境核查权限、状态和退出；按 [Q03](../../plugins/jigjoy-ai--baro--packages-baro-dsh/INSIGHT.md#research-q03) 核验目标而非只看状态。 |
| [Better Workspace File Manager](#plugin-1425087677-root) | 在 DSH Web 中管理工作区文件，支持上传、移动、下载和带版本检查的文本编辑。 | [Q04](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md#research-q04) 先用隔离副本测试冲突和退出。 |
| [billion-context](#plugin-1324949198-root) | 为长会话提供分层上下文压缩、按需恢复和搜索，并通过代理或原生集成接入多个客户端。 | [Q05](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q05) 建议保留原日志并在独立 profile 试用，先检查代理流量和关键事实；出现持续直连、双压缩或无法恢复时移除整个 bundle，核对原生压缩。 |
| [Brooks Lint](#plugin-1192608669-root) | 基于工程书籍整理代码质量评审技能，提供风险诊断、分数与多种审查模式。 | [Q04](../../plugins/hyhmrright--brooks-lint/INSIGHT.md#research-q04) 建议先在允许外发的小 diff 试用 review 并保留人工评审；选区不全或发现无法核对时停止依据报告作决策。 |
| [CA 参考库](#plugin-1349267272-root) | 为Clean Architecture审查提供本地参考仓全文检索、基线清单、审查留账和观察面板。 | 建议先观察，补齐可核对的外部语料并验证过滤与健康状态后再做受控审查辅助；不能自动据基线放行项目。 |
| [Caliper](#plugin-1237259189-root) | 真实安装 Agent Skill，重复运行任务并分别评估激活、执行检查与有无 Skill 的差异。 | [Q03](../../plugins/edonadei--caliper/INSIGHT.md#research-q03)仅在独立环境对可信spec小试，先关闭user customizations并查实际工具清单。 |
| [CC Safety Net](#plugin-1122873619-root) | 在编码 Agent 的工具调用前检查危险命令和敏感文件访问。 | [Q05](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q05) 建议保留宿主审批并用非破坏样本核查工具覆盖；误拦或未检查提示出现时停止依赖并人工复核。 |
| [Cetus](#plugin-1281865940-root) | 在一个桌面客户端中管理多个 Agent CLI 的会话，包括通过 ACP 接入 DSH。 | [Q03](../../plugins/drewnekota--cetus/INSIGHT.md#research-q03) 用临时 home 验证。 |
| [CI Diet](#plugin-1426954291-root) | 发现GitHub Actions资源浪费，生成可审阅的局部工作流计划，提供DSH工具、批准恢复及样本比较。 | 先用可恢复仓库离线scan并人工复核一个候选，历史、写入与测量逐段启用；质量/净资源不改善就停止该规则，冲突保留后续编辑再合并。 |
| [CloudBase AI Toolkit](#plugin-988892963-root) | 通过 MCP 和 Skill 将 CloudBase 开发与资源管理接入 Agent。 | [Q04](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md#research-q04) 先用隔离、最小权限环境核查；生产写入须明确授权。 |
| [CloudBase DSH Plugin](#plugin-988892963-dsh-plugin) | 将 CloudBase MCP 工具与结果面板接入 DSH。 | 隔离环境先只读，写操作核对环境与审批；超时查云端再决定。 |
| [Cocode](#plugin-1334020974-root) | 将 DeepSeek Harness 组装为桌面和终端开发环境，通过 Supervisor 共享宿主。 | [Q04](../../plugins/cocode-agency--cocode/INSIGHT.md#research-q04) 先用独立 home 验证两端切换。 |
| [Code RAG 索引面板](#plugin-1347752454-plugins-dsh-code-rag-index-panel) | 在DSH会话显示Code RAG索引状态与进度，并提供索引操作、设置和诊断卡片。 | 建议已有本机code-rag基础设施且能核对目标根的开发者试用；普通搜索需求先比较现有工具，setup和重建须按实际写入与算力操作处理。 |
| [Codex Taskboard 本地任务看板](#plugin-1311108439-root) | 本地优先任务看板，通过浏览器、taskctl和Skill管理项目与AI任务交接。 | [Q01](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q01)、[Q04](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q04) 先在非关键项目试用浏览器与CLI，验证任务版本冲突和待审接受；有明确同步收益后才考虑桌面注入或云模式，不把根目录作为DSH可装插件。 |
| [codex-guard](#plugin-1340906871-root) | 为 DSH 注册本地 Git 差异扫描工具，仓库同时提供独立 PR 检查。 | [Q03](../../plugins/akimiya-z--codex-guard/INSIGHT.md#research-q03) 用测试仓库对照本地报告与 PR 检查。 |
| [Coding Tools MCP](#plugin-1245329241-root) | 通过 MCP 提供工作区文件、补丁、命令和 Git 编码工具。 | 在隔离环境用可丢弃仓库验证补丁和权限；不可信工作缺额外沙箱时停止。 |
| [Comi Pet](#plugin-1359009818-root) | 独立桌宠可跟随编码助手的工作和审批状态，并在桌面与 DSH 界面内切换显示。 | [Q04](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q04) 先在可退出的本机 profile 试三种状态。 |
| [Crossfire](#plugin-1399279897-root) | 在 DSH 对已定稿成果组织红队评审并由用户逐条裁决。 | 隔离副本先核实专家工具权限，用户逐条复核，异常转人工。 |
| [DeepSec](#plugin-1295322882-root) | 结合 Shield 代码审计、Spear 授权测试、CLI/TUI 与 IDE 接入的安全工具平台 | [Q04](../../plugins/unclecheng-li--deepsec/INSIGHT.md#research-q04) 仅在自有副本试用本地Shield并人工确认finding；不可读文件或覆盖不明时停止依赖零发现结论，回原扫描和人工审阅。 |
| [DeepSeek Harness Desktop（社区版）](#plugin-1333486649-root) | 集成官方 DSH Runtime 和 Web UI 的社区桌面客户端，提供窗口、插件及桌面操作入口。 | [Q04](../../plugins/ningbainb--deepseek-harness-desktop/INSIGHT.md#research-q04) 仅建议能核对发行来源和权限的开发者用独立profile及非关键目录探索，先确认启动、完整输出和重启保留结果；权限或恢复不清立即停止，回到官方Web。 |
| [DeepSeek Harness for VS Code](#plugin-1333429325-root) | 在 VS Code 提供基于内置 Harness 运行时的原生工作台与会话入口。 | [Q04](../../plugins/skymecode--deepseek-harness-for-vscode/INSIGHT.md#research-q04) 先验证对应平台包并保留旧历史。 |
| [DeepSeek Reasonix](#plugin-1216785679-root) | 提供终端、桌面、浏览器和编辑器入口的开源编码助手，支持模型驱动的代码修改。 | [Q05](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q05) 建议能审代码的开发者在低权限隔离副本试一项可验证任务，暂不启自动委派；来源或停止后状态不明即退出并回原 IDE。 |
| [DeepSeekGUI](#plugin-1337578630-root) | 第三方DSH Fork桌面工作台，沿用真实模型工具循环并接入可见内嵌浏览器；页面目标、有效权限、网络地址和业务完成是不同边界。 | 只读会话与复制workspace先核代码/公开网页任务，明确模型和页面数据流；不基于本轮直接授权Git/PR或真实网页写入，见[Q04](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q04)、[Q05](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q05)。 |
| [DeepSpider](#plugin-1142234916-root) | 基于 DSH 的浏览器分析工作台，组织请求证据、Cookie 独立生成、验证与 Solver 交付。 | [Q04](../../plugins/ma-pony--deepspider/INSIGHT.md#research-q04) 当前观察；在隔离环境先验证自有页面，权限、语义验收或独立重跑不清楚时停止。 |
| [DeepTide](#plugin-1230068255-root) | 提供 DeepTide 编码客户端入口、Zero CLI 命令别名、Rust实现与 Apple Silicon 本地推理引导。 | 建议先观察并固定单一形态和上游版本；本地profile不满足或自测失败时不继续切配置，保留原客户端/云API作为退路。 |
| [Déjà Vu](#plugin-1300173275-root) | 为编码助手索引本机会话历史，并提供跨会话检索与召回。 | [Q04](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q04) 使用隔离历史先查一条已知错误并核原文；若权限、数据去向或索引状态不清，停止自动使用并回查日志。 |
| [Desktop CC GUI](#plugin-1148960257-root) | 以独立桌面界面接入 DSH 和多种编码引擎。 | 固定 host 和客户端，在隔离工作区验证会话与权限；不满足权限要求时回退原生入口。 |
| [dock-base](#plugin-1340492184-root) | 为DSH web提供统一布局、视图实例、命令和设置注册服务，供功能插件按需组合。 | 有多视图组合需求可试用，先核对上下文与异步关闭；逐个研究功能插件而非默认全装。 |
| [dock-editor](#plugin-1340492335-root) | 为 dock 文件域增加同工作台的文本查看、编辑、保存与关闭提醒。 | 可对非关键小文本进行受控试用，保存后回读目标并留版本库或备份；对并发编辑和重要配置沿用有冲突检测的工具。 |
| [dock-git](#plugin-1340492447-root) | 在 DSH Dock 中查看 Git 提交图与差异，并对会话仓库执行暂存、提交、分支和远端操作。 | 建议观察，先在隔离仓库核对钩子策略、破坏操作确认和远端失败恢复；团队质量门禁另作明确安排。 |
| [DS Harness Remote](#plugin-1334325657-root) | 为 DSH 和其他工作区提供跨设备远程访问。 | 低权限隔离工作区验证设备与终端；不明结果先回 Host 对账。 |
| [DSH Agency Agents](#plugin-1334939514-root) | 在 DSH 中选择领域角色与专家团，委派任务并由主会话核验汇总结果。 | [Q04](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q04)副本2人小团对照单Agent，核partial/native真实消息，异常停扩团回人工核证。 |
| [DSH Agent Team GUI](#plugin-1334766747-root) | 为 DSH Web 保存可复用多模型团队，编排任务依赖、查看运行记录并汇总供应商报告的 Token 用量。 | 先在匹配宿主的空白项目，用一个模型与有限成员验证完整交付，给成员明确且不重叠的文件范围；逐次核对产物、测试和计量覆盖。 |
| [DSH AgentTeams](#plugin-1332073142-root) | 为 DSH 提供持久多成员任务、依赖调度与协作。 | [Q05](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q05) 用两成员只读任务试用并检查共享工作区，出现重复或成本超预算时暂停。 |
| [DSH Android](#plugin-1341805689-root) | 通过 adb 在 DSH 会话内构建运行 Android 应用、查看设备画面并操作与调试。 | [Q05](../../plugins/zseven-w--dsh-android/INSIGHT.md#research-q05) 本地可信Host/可丢弃AVD/显式serial，核真实业务状态；未知先停并回adb/Studio/快照。 |
| [DSH Annotation](#plugin-1330089831-root) | 在 DSH 选中文字批注并随消息发送，以编号关联回复。 | [Q04](../../plugins/omdsh-dev--dsh-annotation/INSIGHT.md#research-q04) 先测试输入法与合成数据。 |
| [DSH Armory](#plugin-1413052822-root) | 为 DSH 提供 MCP、技能、专家与插件的统一管理面板、市场入口和工具使用账本。 | [Q05](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q05) 建议有多项扩展的用户先准备可恢复备份，在隔离 profile 用非关键技能核对完整过程；若发现状态与目录不一致，停止并恢复。 |
| [DSH Better Sidebar N23](#plugin-1352600211-root) | 为DSH提供文件编辑预览、真实终端、Git、浏览器与可扩展双面板工作台。 | 建议先观察发布源与运行产物同步、宿主范围；如自行评估，只在备份的小仓库试验文件/Git/PTY，不用它承担工作区隔离。 |
| [DSH Chat Import](#plugin-1333200468-root) | 把其他 AI 编码助手的会话历史导入 DeepSeek Harness 并继续对话。 | [Q04](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q04) 先备份和预览非敏感单个来源，再核对原文与目标会话；缺项或状态不明时暂停重导。 |
| [DSH Codex Taskboard 侧栏集成](#plugin-1311108439-integrations-deepseek-harness) | 在DeepSeek Harness侧栏嵌入已启动的Codex Taskboard本地看板。 | [Q03](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q03) 仅建议已有Taskboard服务的人试用这一薄入口；首次接触者先确认独立浏览器看板工作，再接DSH。 |
| [DSH Command Code Provider](#plugin-1334118559-root) | 在 DeepSeek Harness 中接入 Command Code 模型与账户。 | [Q05](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q05) 已有账户的用户可先用非敏感单轮核对模型输出与账单；目标、留存或请求结果不明时暂停并退回原供应商。 |
| [DSH GenUI](#plugin-1333128726-root) | 在 DSH 对话中按受限组件规格呈现交互界面，并把动作送回模型。 | [Q05](../../plugins/omdsh-dev--dsh-genui/INSIGHT.md#research-q05) 建议用非敏感数据在隔离宿主先验证界面和会话动作，遇缺项或目标不明时回退文本。 |
| [DSH Git Graph](#plugin-1331636953-packages-dsh-git-graph) | 在 DSH Web 中展示 Git 分支与提交图，并提供工作树管理入口。 | [Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q05) 建议先在独立测试仓库只读观察，写操作前保留工作并核对目标；状态不明时停止并使用 Git 回读。 |
| [DSH Graphlint](#plugin-1285824983-integrations-dsh) | 为DSH提供graphlint依赖图查询、索引构建、配置工具和使用Skill。 | 已有graphlint使用经验且愿意逐项核对告警的开发者可先在分支试用。 |
| [DSH Harness Switch](#plugin-1414577411-root) | 在DSH原生会话中绑定模型与harness，嵌入固定Kimi Code执行核心并桥接审批与历史。 | 熟悉Kimi和DSH的开发者可在单进程隔离profile及副本工作区试用；出现pending未知结果先查日志与文件，不自动重试，要求无损迁移或完整计费者暂缓。 |
| [DSH Integration Settings](#plugin-1429103083-root) | 为 DSH 设置增加 MCP JSON 导入、网关配置及模型清单和思考档位的预览同步。 | 有可信固定产物、熟悉 profile 且能逐文件恢复的管理员，可以先在隔离副本手动试一组 MCP 或单网关配置，保持定时关闭。 |
| [DSH iOS](#plugin-1339882322-root) | 在 macOS/Xcode 侧为 DSH 提供模拟器与 USB 测试 iPhone 的构建、观察和输入工具，并在会话中显示可交互实时画面。 | 自有小App模拟器先测，真机独立授权/签名/恢复，失败核状态，见 [Q03](../../plugins/zseven-w--dsh-ios/INSIGHT.md#research-q03)。 |
| [DSH Lighthouse](#plugin-1422364992-root) | 汇总作品的本地、GitHub、市场与 npm 状态，并生成观察面板和报告。 | [Q05](../../plugins/7gzgn--dsh-lighthouse/INSIGHT.md#research-q05) 建议先观察并在隔离公开名册下核对接口、数据及文件恢复；监听范围或来源不明时回到官方页面。 |
| [DSH Market](#plugin-1333317835-root) | 提供 DSH 插件、技能和整合包的市场浏览、搜索及宿主侧安装管理。 | [Q03](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q03) 先比较候选，待来源和授权边界明确再在独立 profile 验证。 |
| [DSH Mobile](#plugin-1333842753-root) | 通过 Android 原生客户端连接 DeepSeek Harness，跟进会话、回答问题、审批命令并接收任务通知。 | [Q03](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q03) 先以USB／可信测试网和非敏感任务确认后台通知、待办重放与错误提示，保留桌面核对。 |
| [DSH Model Router](#plugin-1353534254-root) | 为 DSH 提供多模型任务路由、依赖工作包、预算记账及官方 CLI 执行入口。 | [Q05](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q05) 当前保持观察，隔离home只评估可人工验收的只读小任务；未决费用、迁移拒绝或状态不符时停止新任务，保留状态并回独立稳定配置。 |
| [DSH Orchestrator2](#plugin-1409845351-plugins-dsh-orchestrator2) | 提供自动开发调度预设，以任务包组织设计、开发、审查、预算与人工验收。 | 建议先观察并核对派工回执与角色参数，再做隔离任务包验收。 |
| [DSH Plugin Hub](#plugin-1340244547-root) | 在 DeepSeek Harness 中浏览、搜索和安装社区插件。 | [Q05](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md#research-q05) 有隔离 profile 的用户可先查找并核对一个已知包，再人工确认目标与任务状态；来源、版本或构建许可不明时停止并回到手动核查。 |
| [DSH Python Env](#plugin-1335843541-root) | 管理工作区Python虚拟环境，提供发现、创建、安装、卸载和删除工具。 | 可信代码仓库的开发者可在一次性工作区试用。 |
| [DSH RDD Goal Tree](#plugin-1222692871-dsh-rdd-goal-tree) | 在 DSH 会话中展示 goal-tree 状态并向规划者投递节点回调。 | [Q04](../../plugins/yaphethayate--coderdd--dsh-rdd-goal-tree/INSIGHT.md#research-q04) 先在隔离仓库核对视图、通知与 marker；不接受重复或权限风险时关闭 watcher 并人工核查账本。 |
| [DSH Remote Web Gateway](#plugin-1336998102-root) | 通过远程入口和设备配对，从手机访问电脑上的 DSH Web。 | [Q04](../../plugins/summer1238--dsh-remote-web-gateway/INSIGHT.md#research-q04) 先在隔离环境验证允许和拒绝，异常就关闭远程入口。 |
| [DSH Reverse Skill](#plugin-1334214605-root) | 将上游逆向与安全研究技能目录递归注册进 DSH skills 服务的适配插件。 | 保持观察。 |
| [DSH Router Standard](#plugin-1334459444-root) | 以 Agent/Preset 和 Cordis 模块为软件任务分阶段展示、限制工具，并提供目录帮助、路由状态和交付证据清单检查。 | 先独立可回退小任务对照Standard，验FAIL/阶段分离及持久恢复，再扩大使用，见 [Q03](../../plugins/yjh051108--dsh-router-standard/INSIGHT.md#research-q03)。 |
| [DSH Skills Manager](#plugin-1334830521-root) | 在 DSH 中管理本地与项目 Skills，并提供仓库导入、更新和备份恢复。 | 适合在 DSH 管理多个来源且愿意审阅变更的维护者先用隔离工作区试用；来源不明、文件在预览后变化或恢复报错时停止并人工核对备份。 |
| [DSH Subagent](#plugin-1425006726-root) | 将本机外部 CLI 注册为 DSH 子代理后端，支持调度、进度及模型回退。 | [Q04](../../plugins/1373700184--dsh-subagent/INSIGHT.md#research-q04) 先检查后端权限、工作目录与费用；不能接受默认绕过审批时不要启动相应后端。 |
| [DSH Super Code](#plugin-1367482095-root) | 为 DSH 编码任务提供专家委派、分层记忆与删除保护。 | 隔离试用、限定分工并独立检查 diff 和测试；审批或版本异常即停止。 |
| [DSH Task Board](#plugin-1331636953-packages-dsh-task-board) | 在 DSH 中组织任务卡片、调度宿主会话，并提供执行记录与可选验收。 | [Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q05) 建议可审查结果的维护者先在临时工作区运行无外部副作用的单卡；终态或副作用不明时停止自动重跑并人工检查。 |
| [DSH Taskboard](#plugin-1333732838-root) | 为 DSH 提供本地 SQLite 项目看板、Agent 任务工具、原生会话执行与自动化。 | [Q03](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q03) 用独立测试库和可丢弃目录从手动闭环试起，再显式开少量自动规则。 |
| [DSH TUI](#plugin-1333111893-root) | 为 DeepSeek Harness 提供交互式终端客户端、会话投影及审批界面。 | [Q05](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q05) 建议在隔离环境小范围试用并保留原入口；出现丢行、误归属或审批来源异常时停止。 |
| [DSH Turn Rewind](#plugin-1333100390-root) | 为DSH消息提供文件检查点、变更预览、选择恢复及会话重新开始。 | 适合经常需要撤销Agent文件修改且愿意核对路径的开发者，在可丢弃副本中先做一次“文件恢复+消息新建”，对照受管理路径内容与原会话。 |
| [DSH Verification Receipt](#plugin-1333370288-root) | 将 DSH 每轮观察到的验证信号写成简要 JSONL 回执。 | [Q04](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q04) 在可信独立路径使用摘要，并核对原始记录。 |
| [DSH Vision Router](#plugin-1333446374-root) | 为 DeepSeek Harness 提供视觉模型路由和像素级图像工具。 | [Q05](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q05) 建议先用非敏感图像在固定配置试用并对照原图；出站目标或费用不明时停止并回退人工核图。 |
| [DSH Vision Toolkit](#plugin-1333100071-root) | 在DSH会话中接入图像问答、OCR、定位、截图差异和视觉产物。 | 使用文字模型的DSH开发者可先拿非敏感截图做定位或差异检查。 |
| [DSH Worktable](#plugin-1336092482-root) | 为 DSH 提供组织项目、会话、文件与终端的工作台界面。 | 先备份不同存储并在隔离项目验证权限、终端及恢复。 |
| [DSH 红队模式](#plugin-1364387461-packages-redteam-bundle) | 为经授权的安全演练提供角色预设、范围检查、事实库和报告工具。 | [Q04](../../plugins/jueze-2019--dsh-redteam-mode--packages-redteam-bundle/INSIGHT.md#research-q04) 先在封闭测试配置验证，缺授权不执行。 |
| [dsh_workflow](#plugin-1332243516-root) | 在 DSH 中创建、保存和运行可复用的多 Agent 工作流，并保留运行证据。 | [Q03](../../plugins/omdsh-dev--dsh_workflow/INSIGHT.md#research-q03) 在只读任务对照一次重复运行和一次恢复，核对真实事件与结果。 |
| [dsh-a11y-scan](#plugin-1344715270-root) | 在DSH中调用axe扫描本地HTML或确认URL，输出定位、修复线索、人工复核项和多格式报告。 | 可信无敏感页面可限范围试用作自动线索，先核实际网络/文件与规则覆盖，保留人工复核。 |
| [dsh-agent-recycle-guard](#plugin-1414323673-root) | 将 Agent 常见直接删除改为系统回收，并对执行脚本做有限内容检查，异常时阻止命令。 | 建议有独立备份的维护者在可丢弃目录受控试用常见删除缓冲；不以此替代权限隔离，准备长期阻断、语义不一致或需要动态程序全覆盖时停止。 |
| [dsh-agentdebugx](#plugin-1296792947-integrations-dsh-agentdebugx) | 连接 DSH 会话与 AgentDebugX，支持保存会话发现、当前或历史轨迹诊断和本地查看。 | 建议观察，先修明物理路径与取消契约，缩窄历史root，之后再考虑不敏感当前工作区轨迹；同模型自诊断不作为独立效果证明。 |
| [dsh-ai-armor](#plugin-1425045401-root) | 将Git回归、堆栈、配置、shell转义和MyBatis Plus静态审计工具合并分发。 | 可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。 |
| [dsh-aiignore](#plugin-1219876705-plugin) | 扫描工作区上下文噪声，并提供读取规则与报告面板。 | [Q03](../../plugins/wjddidi-1--ai-context-doctor--plugin/INSIGHT.md#research-q03) 备份后在隔离工作区观察误拦与规则变化，不一致时停用并手工比较恢复。 |
| [dsh-anchored-standard](#plugin-1334245678-root) | 提供实验性DSH预设，通过首轮上下文门控、工具分阶段暴露与历史种子控制模型轨迹。 | 当前生产采用不推荐，研究者可只借鉴epoch门控实现做隔离实验。 |
| [dsh-approval-explainer](#plugin-1417137113-root) | 为 DSH 真实审批弹窗生成操作、意图、风险和选项含义的 AI 注释，并提供历史与诊断视图。 | 先观察并确认同意把审批参数和近期上下文交给所选模型，在低风险可撤销样本中核对目标、权限和选项含义。 |
| [dsh-ark-coding-provider](#plugin-1421741516-root) | 为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。 | 有条件试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。 |
| [dsh-asciinema](#plugin-1344714509-root) | 把DSH会话工具结果文字缓冲为自有cast对象文件，提供会话录制/标记、HTML回看与纯文本转换。 | 观察，先修模板路径/时间与保存pending恢复，非秘密小样也须核采集/分享范围。 |
| [dsh-auto-review](#plugin-1333482618-root) | 为 DSH 审批请求提供可配置的第二模型审核。 | [Q04](../../plugins/perrylink--dsh-auto-review/INSIGHT.md#research-q04) 先在隔离 profile 用合成样例核策略、默认拒绝、非默认 allow-once 放行一次及 delegate 转交；转交不等于批准，取消为 cancelled。 |
| [dsh-auto-reviewer](#plugin-1336185734-root) | 为 DSH 增加 auto-review 权限预设，按规则与可选 LLM 裁决提权并显示通知。 | 先在可恢复的宿主副本用无副作用样本比较决策，特别检查旧确认、新目标和参数缺失。 |
| [dsh-cache-bricks](#plugin-1386463441-root) | 用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。 | 建议本地单用户维护者用不敏感会话试用，先核对attempt、usage和访问边界；主链延迟、字段错位、UI干扰或权限不清时停止，回到宿主日志。 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz) | 解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。 | 建议试用。 |
| [dsh-codex-bridge](#plugin-1427331352-root) | 通过Codex CLI读取账号额度与模型建议，并以可选模型和推理强度委派独立任务。 | 单人已有账号先只读短任务，核模型/额度/结果；写任务用可恢复工作树，超时先验产物，高价/低额需真实用户接受。 |
| [dsh-codex-guard](#plugin-1340906871-dsh) | 在 DSH 中调用 codex-guard，对 Git 变更进行提交前卫生检查。 | 建议观察；先核实际 CLI 版本、cwd 和覆盖，再对六类场景隔离验证，不能将字符串成功返回当提交放行。 |
| [dsh-context](#plugin-1333961389-root) | 为 DeepSeek Harness 提供上下文仪表盘与命令，查看会话组成和变化。 | [Q05](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q05) 建议在隔离 profile、空提示词前后缀下先对照单个请求；低版本降级、冷读缺失或估算无法解释时回到原始事件和供应商 usage。 |
| [dsh-deja](#plugin-1300173275-extensions-dsh) | 在 DeepSeek Harness 中搜索并召回本机其他编码助手的会话历史。 | [Q05](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q05) 先以手动 /deja 检索一个已知历史并回查原文；不能允许内容外发或项目来源无法核实时关闭自动召回。 |
| [dsh-dep-vuln-scan](#plugin-1344714002-root) | 读取常见项目锁文件，向OSV批量查询依赖版本公告，展示漏洞、修复候选与命令建议，并保存可重放结构化报告。 | 先观察。 |
| [dsh-diff-approval](#plugin-1335980444-root) | 在 DSH 会话旁捕获文件改动，提供差异审阅、保留回退、批注和版本控制变更导入。 | [Q04](../../plugins/9087--dsh-diff-approval/INSIGHT.md#research-q04) 备份后只在单写者树中小批试用，逐项核盘面与测试；分歧、保存失败或部分恢复时停止动作，用VCS和备份恢复。 |
| [dsh-domain-bridge](#plugin-1424063534-plugins-dsh-domain-bridge) | 提供声明优先域寻址、分层暂停、持久消息队列、会话工厂、模型分派、命令菜单与静态工作台入口。 | 建议观察。 |
| [dsh-engineering-workflow](#plugin-1335988605-root) | 可选工程 preset 与六个方法 Skill，以五阶段文字门禁引导 DSH Agent；Host 自动同步本地预设并公告。 | 备份 DSH_HOME/.agent-presets/engineering-workflow，再在新会话选择 preset 做对照试验；详见[Q02](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q02)、[Q03](../../plugins/82c86b8z86-stack--dsh-engineering-workflow/INSIGHT.md#research-q03)。 |
| [dsh-eteams](#plugin-1372993989-root) | 为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。 | 试用，备份/可信管理面/明确人工验收，completed按成员报告解读，不能当全自动业务验收。 |
| [dsh-evidence-gate](#plugin-1365519118-root) | 为 DSH 会话提供可切换的证据提示、主张裁定工具及持久活动索引。 | 建议观察，单人本地可作为提醒和线索索引；关键事实须回查原始输出，不能依赖 verified 机器标签自动放行。 |
| [dsh-expert-mode](#plugin-1334811048-root) | 提供专家协调预设、领域委派工具、渐进式方法、文件消息总线和任务看板。 | 当前建议观察。 |
| [dsh-fail-logger](#plugin-1333463381-root) | 从 DSH 会话事件采集工具失败，去重计数后写入本地 Skill，并可注入预防和恢复提示。 | 先在复制的非敏感日志上观察，关闭全局提示做基线，验证不同模式失败覆盖及文件写失败恢复。 |
| [dsh-find-plugins](#plugin-1333132389-root) | 按 GitHub topic 发现 DSH 插件，比较候选并引导安全检查、安装和挂载验证。 | [Q03](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md#research-q03) 先只读比较候选，再按 [Q02](../../plugins/nagi-ovo--dsh-find-plugins/INSIGHT.md#research-q02) 的方式明确授权和宿主作用域。 |
| [dsh-folderwatch](#plugin-1423215448-root) | 监控目录元数据快照变化，经批处理与路径回声过滤后唤醒或排队通知DSH Agent，提供挂载、检查、触发和移除工具。 | 观察，先可信单profile窄目录queue核扫描/接收/恢复，不作为可靠生产触发或多用户隔离。 |
| [dsh-github-router](#plugin-1339462797-root) | 提供PR、Issue、文件及API只读工具，通过API、gh、Git、HTML与可选镜像在宿主内降级取数。 | 先观察；公共仓库单用户隔离环境可对照，私有多身份/共享存储先解决缓存与授权边界。 |
| [dsh-hdc-bridge](#plugin-1333258432-root) | 在 DSH 中连接鸿蒙设备调试、版本化 API 知识、工程构建和部署，并提供设备面板。 | [Q04](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q04) 先观察作用域，在无真实数据设备上以显式target做列表/诊断，确认实例隔离和面板可达范围后再决定受控部署。 |
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
| [dsh-mermaid](#plugin-1334569498-root) | 在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。 | 适合经常看Mermaid图的人先用小图试用，保留strict和合理限制，报错先复制后决定是否发AI；卡顿、异常交互或草稿覆盖就停相关路径。 |
| [dsh-model-everything](#plugin-1423488109-root) | 将设计抽象为模型并提供状态机等验证与图形工具。 | [Q04](../../plugins/amethystluna--dsh-model-everything/INSIGHT.md#research-q04) 小范围建模并核对界限、原始代码和独立测试。 |
| [dsh-modernize-code](#plugin-1344714334-root) | 通过 Skill 和两个 Python 工具辅助遗留代码预检与热点扫描；迁移方案与改码依赖模型/人工。 | 用隔离副本运行两工具，限定 out，人工标注热点、运行真实构建/测试后再定路线图；详见[Q03](../../plugins/988hj7tczd-oss--dsh-modernize-code/INSIGHT.md#research-q03)。 |
| [dsh-multi-folder](#plugin-1334119885-root) | 为DSH项目配置副工作目录，保持主cwd并将原文件和shell工具按单次目标重定根，附UI与@发现。 | 观察，继续从无碰撞稳定身份、store不落Agent写根及明确UI能力约束着手。 |
| [dsh-mysql](#plugin-1337916824-root) | 在DSH设置管理多套MySQL连接，会话选择目标数据源，模型可查看表结构、查询，并在独立授权后执行行写与DDL。 | 先观察。 |
| [dsh-openai-oauth](#plugin-1335992154-root) | 在 DeepSeek Harness 中通过 ChatGPT OAuth 使用 Codex 模型及搜索。 | [Q05](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q05) 先保留原路由，在隔离环境核对登录、搜索选择、指令和工具行为；凭据残留或语义异常时停止并恢复原配置。 |
| [dsh-ops](#plugin-1409893258-root) | 为 DSH 提供文件、文档和 PTC 工具，以及按需发现和可配置的官方工具替换。 | [Q07](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q07) 先在可恢复副本做只读任务并检查结果完整性和回退；遇到准备失败、遗漏或状态未知先核对文件，不盲目重试。 |
| [dsh-organism](#plugin-1366089972-workspace-plugins-dsh-organism) | 以器官模型聚合 DSH 工具，提供心跳体征、反射、代理调用和工具显影。 | 先隔离核 body_map/status 与宿主工具表，再分别启用门控和反射；保持最小权限与直接调用回退。 |
| [dsh-ouroboros 配置桥](#plugin-1133901637-integrations-dsh-plugin) | 通过 DSH MCP client 挂载 Ouroboros 工作流工具。 | 固定引擎版本、确认凭据与预算，先验证访谈及产物；故障时重载或回退 CLI。 |
| [dsh-pentest](#plugin-1335155355-root) | 为 DSH 提供授权安全调查的目标、线索、事实、资产、漏洞图与报告视图 | [Q03](../../plugins/howmp--dsh-pentest/INSIGHT.md#research-q03) 观察旧版与自维护样本，不把归档包可下载当当前兼容。 |
| [dsh-plugin-adapter](#plugin-1374274469-root) | 以原生provider接入匿名Zen模型，含目录、消息/工具流适配及可选relay/IP池；根产物绑定待核。 | 观察：先核根真实包和退出恢复，再做一项可验文本/工具任务；严格出站、结果归属或共享网络未达标即停新请求并回退，见[Q06](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md#research-q06)。 |
| [dsh-plugin-aitelier](#plugin-1201143178-integrations-dsh) | 将 AItelier 的 MCP 流水线接口接入 DeepSeek Harness。 | [Q04](../../plugins/linxuhao--aitelier--integrations-dsh/INSIGHT.md#research-q04) 先隔离后端并验证 gate、凭据和工具；权限或后台状态不明时停止写入。 |
| [dsh-plugin-bridge](#plugin-1336849011-root) | 在 DSH 预览并确认会话交接，将上下文或已批准计划移到新会话。 | [Q03](../../plugins/totoro-qaq--dsh-plugin-bridge/INSIGHT.md#research-q03) 从短任务验证目标。 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。 |
| [dsh-plugin-gate](#plugin-1336663986-root) | 向 DSH Agent 提供插件源码静态扫描、风险差分/报告及破坏性操作建议工具，以 systemPrompt 提醒调用。 | 只在明确源码版本上扫描，逐项审阅 hits、notes 和 filesScanned；对高权限插件增加人工/沙箱审查。 |
| [dsh-plugin-ide-hub](#plugin-1397817235-root) | 在 DSH 汇总本地编码工具的会话、用量和项目规则。 | [Q04](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md#research-q04) 对复制项目先备份、dry-run 并核差异；不完整或删除风险不明时停止。 |
| [dsh-plugin-orchd](#plugin-1422240642-root) | 在 DSH 侧栏查看当前项目的 orchd 任务状态。 | [Q04](../../plugins/7bder--dsh-plugin-orchd/INSIGHT.md#research-q04) 仅在可信项目启用，核对根并用原始状态复核。 |
| [dsh-plugin-preflight](#plugin-1378350155-root) | 以 CLI 和模型工具预检 DSH 插件清单、patch、客户端包和预发布 peer 范围。 | 先对已知正确和已知错误的插件各检查一次，核对规则是否符合当前宿主。 |
| [dsh-plugin-strict-spec](#plugin-1218860433-plugins-dsh-strict-spec) | 在 DeepSeek Harness 中浏览 strict 工作流文档并提供内置工作流工具。 | [Q04](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md#research-q04) 先核对宿主、工作区及实际 Skill；[Q03](../../plugins/kw12121212--strict-spec-driven--plugins-dsh-strict-spec/INSIGHT.md#research-q03) 确认目标前审阅 Session 和后续授权。 |
| [dsh-plugin-task-forge](#plugin-1399011094-root) | 在 DSH 将需求编成任务书，支持跨窗口交接、版本回读、缺口和台账。 | [Q03](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md#research-q03) 从临时目录试用。 |
| [dsh-plugin-veriscope](#plugin-1422943787-root) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。 |
| [dsh-pr-description](#plugin-1344714177-root) | 读取分支差异生成 PR 标题和五段描述，可选确认、保存与调用 gh 创建 PR。 | 先显式给 base 和安全输出路径，生成本地草稿并核对动机、测试、breaking；只有明确要发 PR 时才启用 openPr。 |
| [dsh-progress-viz (plugin)](#plugin-1334481905-plugin) | 把 DSH 语义会话事件即时投影成进度 JSON，供独立 Python 看板读取。 | 先把 JSON 当辅助状态并对照会话真相，修复/规避空闲恢复和估价问题后再作为运行监控依据。 |
| [dsh-project-memory](#plugin-1339316901-root) | 为 DSH 项目保存文档、代码符号、经验与任务，并提供跨会话检索和提示。 | [Q04](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q04) 先在单项目备份中按需查询，检查根和任务归属，再新进程读回；来源冲突或回读不符时停止自动注入，返回原文件与人工笔记。 |
| [dsh-qa-suite-n23](#plugin-1353726715-root) | 提供编辑后 TypeScript 诊断工具和本地多镜头代码审查命令。 | 先独立使用并复核 code_check 的项目根和时间，重要审查问题需要源码复现；跨项目或自动放行场景暂观察。 |
| [dsh-reaper](#plugin-1423215373-root) | 扫描监听端点并给进程归属分级，预览后代终止计划，经confirm后结束进程并检查端口。 | 先观察，以只读诊断为限；身份/后代保护/取消与精确端点协议补齐后再评估受控试用。 |
| [dsh-redteam-model](#plugin-1336856993-root) | 管理 DSH 安全研究预设与运行时插件，提供工作流、阶段检查和过程记录入口。 | [Q04](../../plugins/seaof0--dsh-redteam-model/INSIGHT.md#research-q04) 当前观察，先限定具体管理或结构检查目标，确认授权、隔离profile、备份和实际变更；不把完整安全套件默认引入重要环境。 |
| [dsh-remote](#plugin-1333787962-root) | 通过 SSH 连接远程主机，在 DSH 会话中绑定远程工作区并提供文件、命令、镜像同步与隧道操作。 | [Q04](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q04) 当前观察，先在低权限测试主机核对有效模式、会话绑定和dryRun/回读，再考虑有限写。 |
| [dsh-restart-dock](#plugin-1424433303-root) | 在 DSH Web 界面提供可拖动的刷新/Windows 宿主重启坞，并用独立 helper 留下重启报告。 | 只建议 Windows DSH 插件开发者观察使用，先在无重要任务环境完成 dry-run、一次真实停拉和手工救援演练。 |
| [dsh-restart-planner](#plugin-1422176522-root) | 让代理排程宿主自重启，等待会话落盘后由外部 helper 停拉进程并向原会话投递继续提示。 | 仅建议具备救援入口的插件开发环境观察；先 dryRun，随后在空闲会话做一次 confirm=true、resume=false 的真实重启，再单独验证恢复投递。 |
| [dsh-rewind](#plugin-1336677036-root) | 在 DSH 原会话内回退到较早用户消息，并可按轻量写前备份还原已跟踪的工作区文件。 | [Q03](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q03) 固定版本并保留Git/独立备份，只在可丢弃目录先核对预览与实际结果。 |
| [dsh-routing-suite](#plugin-1334586481-root) | 组合运行时注入器、思维模式路由预设与分级任务协议。 | 当前建议观察套装整体；先核对目标宿主版本与组件独立装配结果，再决定是否在隔离profile做开发实验。 |
| [dsh-session-diff](#plugin-1372976273-root) | 在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。 | 适合用Git兜底的开发者在独立web profile试用，先核对已知改动与显示路径；出现未提示错归因或接管异常就停用，不能当完整审计。 |
| [dsh-sidebar-git-graph](#plugin-1393980674-root) | 在DSH右侧栏查看当前会话仓库的提交关系、工作树改动和文件差异。 | 本地单用户开发者可先用小仓库试用并与CLI核对；先审查webServer访问控制，出现静默换库、未说明截断或无法解释的差异即回到CLI。 |
| [dsh-skill-creator](#plugin-1344713683-root) | DSH 内四个模型工具，用确定性规则草拟、校验、打包和改写技能描述，可挂载输出目录。 | 隔离 outputDir，先 dry-run 再人工核对 SKILL.md；文本技能再打包并解包核查文件，二进制资源不用当前打包路径。 |
| [dsh-slipway](#plugin-1422359117-root) | 预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉逐文件校验发布字节。 | 有固定 GitHub 发布流程的插件维护者可先在测试组织以 dry-run 和只读 verify 试用；真实 publish 必须由人核对 owner/repo、文件清单、secret 扫描与市场描述后单独授权。 |
| [dsh-snapshot-manager](#plugin-1412896722-root) | 按会话轮次采集工作区快照，并提供文件恢复和对话回退入口。 | [Q05](../../plugins/985451842--dsh-snapshot-manager/INSIGHT.md#research-q05) 先在可丢弃副本检查排除项、运行态、文件哈希与独立备份；状态未知或预览异常时停止，不在重要工作区依赖单一快照。 |
| [dsh-spring-admin-kit](#plugin-1412897663-root) | 注册Excel批量导入导出及Thymeleaf/LayUI模板规范两个DSH技能。 | 先观察并修示例，隔离库验事务/重复键/权限和模板渲染后再有限复用；不直接生产套用。 |
| [dsh-ssh-logs](#plugin-1346017360-root) | 通过DSH内置MCP桥提供服务器列表、限量日志读取和固定字符串搜索，使用预设SSH主机与日志根别名返回来源片段。 | 有条件试用。 |
| [dsh-super-injector](#plugin-1332659211-root) | 在 DSH 运行时加载、重载和管理本地插件包。 | [Q03](../../plugins/yjh051108--dsh-super-injector/INSIGHT.md#research-q03) 只在隔离 profile 验证惰性包。 |
| [dsh-task-monitor](#plugin-1406156934-dsh-task-monitor) | 在侧边浮层汇总任务环境、Git、技能、MCP 与发布动作。 | 保持观察；不要在含生产 remote 的工作区启用写动作，先用一次性仓库核提交、推送、切支和发布失败恢复。 |
| [dsh-taskswarm](#plugin-1333800488-root) | 为DSH按任务包依赖分波并行调度worker，以Git worktree、检查点、状态/邮箱和review/merge流程集成代码产出。 | 先观察，不将默认自主流程视可靠接受门；可丢弃仓库研究需独立强制CI/人工SHA验收及权限/预算/网络控制。 |
| [dsh-tianshu-tui](#plugin-1332692519-root) | 为 DeepSeek Harness 提供流式消息、工具卡、会话操作和 LSP 诊断的交互式终端界面。 | [Q05](../../plugins/huiliyi37--dsh-tianshu-tui/INSIGHT.md#research-q05) 建议先在独立 profile、固定版本和可丢弃目录用普通逐卡审批做一处受控修改，确认指令已投递后再测取消、切会话与退出。 |
| [dsh-token-billing](#plugin-1335139860-root) | 在DSH会话中显示实时token费用，结合路由价目与政策时间线，保存跨会话账本并提供统计、余额及CSV/JSON导出。 | 先观察。 |
| [dsh-trellis](#plugin-1335559646-root) | 为 DSH 提供任务阶段、步骤状态、会话提示与可选规划期工具过滤。 | [Q05](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q05) 建议在隔离项目备份同名技能后试用非关键任务；人工独立验证批准、Git 状态和业务结果，异常时停止流程并恢复备份。 |
| [dsh-undo rollback bundle](#plugin-1338526178-packages-bundle-rollback) | 为 DSH 提供消息级文件与会话回退、归档管理及网页回退界面。 | [Q04](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md#research-q04) 建议先观察。 |
| [dsh-undo-savepoint](#plugin-1333816810-root) | 为DSH配置与插件代码保存恢复点并提供宿主及局外急救入口，逐文件恢复和秘密副本仍需独立核验。 | [Q04](../../plugins/lire1131--dsh-undo-savepoint/INSIGHT.md#research-q04) 观察，先隔离假home+非敏感副本核范围、接口权限、部分恢复与重启，独立备份不省；错恢复/缺失停写查明细/字节，回人工备份。 |
| [dsh-update-checker](#plugin-1334836615-root) | 在DSH GUI检查主程序和第三方插件版本，提供备份更新回退与Web重启流程，Desktop主程序转原生更新。 | 当前不推荐日常安装，先修拒绝零副作用与阶段回执，再核隔离恢复；不在用户部署运行复现。 |
| [dsh-vercel](#plugin-1425044910-root) | 通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。 | 可信单profile从只读工具试用，写操作核官方结果。 |
| [dsh-which](#plugin-1423215529-root) | 为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。 | 建议在可信工具链环境限定试用只读报告，关闭默认probe，关键决策用真实shell交叉核对；一旦builtin、别名或cwd不一致，停止据此修改环境。 |
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
| [easyeda-agent](#plugin-1280115203-root) | 通过 CLI、MCP 与连接器让 Agent 读取和操作 EasyEDA Pro 工程，并配套设计与回读 Skill。 | [Q04](../../plugins/zhoushoujianwork--easyeda-agent/INSIGHT.md#research-q04) 专业用户仅在备份副本中先确认health和目标身份，再试一项小编辑并回读、检查和保存重载。 |
| [Everything Kiro](#plugin-1139909532-root) | 面向 Kiro IDE 的 Agent、Hook、Steering、Power、MCP 示例和开发工作流配置集合。 | [Q03](../../plugins/iamaanahmad--everything-kiro/INSIGHT.md#research-q03) 先一次性工程只取手动steering/Spec，禁用MCP和自动修复；核实际IDE加载与差异，再审每条命令和权限。 |
| [Flameox](#plugin-1311955212-root) | 为编码 Agent 协调本地性能采集、分析与证据保存，返回带来源、覆盖和限制的有界结果。 | [Q03](../../plugins/morluto--flameox/INSIGHT.md#research-q03) 先分析脱敏已有artifact并保存可追溯证据，再决定是否配置特定capture provider。 |
| [Grove](#plugin-1229298801-root) | 以持久化图记录工程目标、工作项和证据，提供 CLI、MCP 及独立 DSH 适配器。 | 先用独立 CLI 小样本，不迁移生产任务；用第二会话核证据并确认项目定位。 |
| [HarmonyOS NEXT Skills](#plugin-1179983747-root) | 通过 DSH 单技能 provider 提供离线 HarmonyOS 资料导航及 DevEco/HDC 证据脚本。 | 可先试固定版本普通参考，自动化仅在无外部副作用测试页确认before/after；版本不明、敏感采集不可控或动作状态未知时停止，回官方资料/IDE与手工读回。 |
| [harness-github](#plugin-1343702731-root) | 为DSH提供GitHub仓库、PR、issue、CI与评审工具，通过gh或REST读取和操作，并提供工作流指引。 | 先观察，暂不依赖当前审批边界做日常写操作。 |
| [HelloAGENTS](#plugin-1064776002-root) | 为AI编码CLI提供任务路由、质量Skill、项目知识、会话恢复和交付检查脚本。 | 有跨轮编码任务且愿维护计划的用户可在单宿主副本试用，先备份配置并核对真实验证日志；与项目规则冲突或只增加填表负担时退回原有AGENTS和CI。 |
| [Helm D](#plugin-1334304098-packages-helmd) | 为 DSH 提供安全分析工具、案例证据记录及相关工作流。 | [Q05](../../plugins/adwmc--helm-d--packages-helmd/INSIGHT.md#research-q05) 建议先观察并审阅完整行为，确认授权、独立备份和执行边界后再考虑隔离验证。 |
| [helm-d](#plugin-1334304098-root) | 面向 DeepSeek Harness 的安全分析工具与案卷项目。 | [Q04](../../plugins/adwmc--helm-d/INSIGHT.md#research-q04) 先确认授权和包来源，在隔离环境测试后再考虑接入；保持原始证据和敏感数据访问控制。 |
| [Hindsight 编码 Agent 记忆集成](#plugin-1086419061-hindsight-integrations-coding-agents) | 为 DSH 编码会话自动召回并后台保存项目记忆。 | [Q05](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q05) 用独立 bank 和虚构项目试用，写回未确认或项目不符时暂停并手工核查。 |
| [iKanban](#plugin-1137545389-root) | 面向 OpenCode V2 的独立静态浏览器前端，提供项目、会话、审查、终端与多服务器管理。 | [Q03](../../plugins/isomoes--ikanban/INSIGHT.md#research-q03) 适合有OpenCode后端和网络配置能力者在可丢弃项目小范围试，先核当前服务器/会话及全局自动批准。 |
| [IllusionAgent](#plugin-1202726483-root) | 提供多模型 Agent 的命令行、网页界面、工具和扩展。 | [Q03](../../plugins/yuntaihua--illusion-agent/INSIGHT.md#research-q03) 先在隔离环境核工具允许与拒绝规则的优先级；不满足预期时停用对应模式。 |
| [iosdev-cn](#plugin-1005356138-root) | 提供面向中国区的 iOS 开发、构建、签名、测试、订阅与 App Store 上架流程 Skill。 | [Q03](../../plugins/kuangre123--iosdev/INSIGHT.md#research-q03) 先观察，只用于脱敏项目的只读差距清单。 |
| [iPolloWork](#plugin-1044010907-root) | 提供多 Agent 运行时、项目任务和可编辑创作产物的独立工作台。 | [Q04](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q04) 先在副本观察一项只读 DSH 会话与原生产物；权限、终态或来源不明时停止并回原生引擎核对。 |
| [J-Space Cognition Suite](#plugin-1308234922-root) | 用可选Skill模块与Python控制器维护长任务状态、源码映射和证据检查。 | [Q04](../../plugins/tiger3807861189--j-space-cognition-suite/INSIGHT.md#research-q04) 先在单个非关键长任务验证证据变化会被拒绝，再看维护负担是否换来少返工；短直接任务用轻量级别，不强行跑完整控制循环。 |
| [Jev 决策插件](#plugin-1391049410-root) | 在 DSH 扩展点调用 Jev 或 Luna Decisions，支持按需监督、筛选、导航和单次审批辅助。 | [Q04](../../plugins/luobosibing2--dsh-jev-plugin/INSIGHT.md#research-q04) 单独启用完成检查，用受控文本与独立验收判断收益，保留审批人工路径。 |
| [KimiX](#plugin-1180401969-root) | 基于 Kimi CLI 的命令行代理与脚本工作流，提供文件、命令及模型工具。 | [Q04](../../plugins/sikao-engine--kimix/INSIGHT.md#research-q04) 建议熟悉代码与命令的开发者先在非敏感副本试小任务，并自行核对实际检查结果。 |
| [leantoken](#plugin-1301161244-root) | 通过本地索引和 MCP 为开发 Agent 返回带 token 预算的仓库代码上下文。 | [Q03](../../plugins/morluto--leantoken/INSIGHT.md#research-q03) 以同模型同仓库做只读对照，先确认关键证据，再判断节省。 |
| [Ledger Memory](#plugin-1412857520-root) | 为 DSH 项目保存活跃台账、经验卡与交接资料，自动注入记忆并提供压缩胶囊和会话文本指针回读。 | 可备份V3非关键项目先核拒写/授权/stage和压缩回读，定期人工比对真实工作区；缺口出现暂停自动依赖，见 [Q04](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q04)。 |
| [LogicProbe](#plugin-1331586818-root) | 检查设计和代码主张，使用可执行模型分析状态、数据和结构，并比较验证报告。 | [Q04](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q04) 建议先在可核对源码的小状态机上试用，保存完整报告；映射无法确认或检查持续未决时回到既有审查和测试。 |
| [LoopX for DSH](#plugin-1255217938-packages-dsh-loopx-plugin) | 为 DSH 接入 LoopX 同会话续轮与 GoalBar。 | 以独立项目核验绑定与 quota，用非敏感任务试验暂停前后状态；异常时检查当前轮并回退手工。 |
| [Matt Skills Deck](#plugin-1336488925-root) | 在 DSH 中提供内置工程 Skill、工作区任务面板和工单交接，支持不同 Tracker 后端。 | 先用隔离 Profile 和只读测试仓库验证一个工单交接，发现引用或权限不一致就回到原 Tracker。 |
| [MC Mods Dev Bridge](#plugin-1426070939-root) | 驱动真实 Minecraft 服务端与客户端运行场景 JSON，采集探针证据并覆盖 Fabric、Forge、NeoForge。 | 适合维护 MC 26.3 多 loader 模组、已有合法实例且能承担真实进程成本的团队观察；先只做 preflight 和一个 smoke 场景，验收 teardown、证据目录、/mods 双侧一致与端口恢复。 |
| [MemOS Local Plugin](#plugin-1014729376-apps-memos-local-plugin) | 为 Agent 提供本地分层记忆、召回和反馈的多宿主插件。 | [Q05](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q05) 建议在固定宿主和非敏感项目试用并备份；发现纠正缺失或数据边界不明时暂停并回到项目笔记。 |
| [Minke](#plugin-1334714311-root) | 基于 DeepSeek Harness 的本地桌面工作区，整合会话、文件、终端与共享浏览器。 | 首次成本比小插件更大：下载匹配OS架构的完整客户端，迁移或配置模型凭据、工作区和插件，确认其内嵌DSH版本；源码开发还需pnpm、Electron及多workspace产品包构建。 |
| [MisakaNet](#plugin-1224734286-root) | 为 AI Agent 提供带证据等级的故障经验检索与记录。 | [Q04](../../plugins/ikalus1988--misakanet/INSIGHT.md#research-q04) 先以合成故障搜索并阅读完整 lesson，环境不符或不能外发时停止，回本地日志。 |
| [Mobius](#plugin-1273324178-root) | 以项目工作台连接团队、编码 Agent、模型与设备，组织会话、任务、知识和执行记录。 | [Q03](../../plugins/nutshellai-tech--mobius/INSIGHT.md#research-q03)正式团队多设备场景observe，先独立做两用户/权限/文件与真实终止恢复矩阵。 |
| [model-usage-plugin](#plugin-1334569518-root) | 在DSH Web设置中展示模型token、估算费用、工具指标、使用趋势与DeepSeek账户余额，并从会话日志补充历史日账。 | 先观察。 |
| [Morning Star Harness](#plugin-1174622182-root) | 为多个编码宿主提供计划、角色分工、工作流状态与交付流程。 | [Q05](../../plugins/btspoony--mstar-harness/INSIGHT.md#research-q05) 建议先在隔离仓库使用小任务，核对实际宿主策略、身份和独立审查；退化或授权不符时暂停。 |
| [Odai](#plugin-1185828998-root) | 提供代理任务治理技能、可选职责路由及独立命令行运行时。 | [Q04](../../plugins/orziz--odai/INSIGHT.md#research-q04) 建议先在隔离项目以只读任务核实；宿主权限或配置恢复不明时暂停路由安装。 |
| [odai-dsh-plugin](#plugin-1185828998-dsh-plugin) | 为 DSH profile 提供 Odai 职责路由、治理和控制中心。 | [Q04](../../plugins/orziz--odai--dsh-plugin/INSIGHT.md#research-q04) 先在隔离 profile 与合成数据上核对 guard、路线、证据和退出；任一边界不符时恢复宿主原配置。 |
| [Oh-DSH](#plugin-1330531961-root) | 围绕同一 DSH runtime 提供 Desktop、Web、TUI 发行表面及带预览/恢复的插件市场。 | 保持观察；熟悉DSH且有跨端需要者可主动用独立根做临时工程验证。 |
| [oh-my-deepseekharness](#plugin-1379204512-root) | 为 DeepSeek Harness 提供多代理编排与工具接入。 | [Q04](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md#research-q04) 用受限预算在隔离项目试只读委派，核结果与成本；服务降级时回原生流程。 |
| [OMA for DeepSeek Harness](#plugin-1145914675-integrations-dsh) | 将 OMA 项目 Skill 和验证钩子桥接 DSH。 | [Q04](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q04) 在备份项目审查规则和 setup，停止上限须独立验收。 |
| [OPC-Nexus](#plugin-1318562243-root) | 以 Hermes 项目对话和 Electron 工作台组织数字员工的计划、审批、派工、产物验收与交付。 | [Q03](../../plugins/h4dex--opc-nexus/INSIGHT.md#research-q03) 对正式复杂交付先observe；待小项目走通真实多员工、独立验收、返工／取消／崩溃恢复和退出，再判断迁入。 |
| [open-record-replay](#plugin-1276135867-root) | 在 macOS 记录桌面操作并为 Agent 技能创建整理证据包。 | [Q03](../../plugins/humblebanana--open-record-replay/INSIGHT.md#research-q03) 用合成流程录制，单独验证并检查证据后再交接。 |
| [OpenBitFun Agent 工作区](#plugin-1147866277-root) | 独立 Agent 工作区，支持跨设备控制和可选 DSH 客户端。 | [Q05](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q05) 建议先以隔离账号和可回滚任务验证；Relay 端点、身份、数据迁移或未知副作用不能核实时停止。 |
| [OrcaReplay](#plugin-1350419329-root) | 外置 CLI 调试工具，记录 Agent 请求、工具和文件变化，支持模型响应回放、检查点分叉与模型比较。 | 先用可丢弃、无真实秘密的项目做严格回放，只把匹配视为协议重现；分叉需另看真实任务质量与费用。 |
| [Ouroboros 规格先行引擎](#plugin-1133901637-root) | 通过访谈、固定规格、执行与多阶段评估组织 AI 软件开发任务。 | [Q05](../../plugins/q00--ouroboros/INSIGHT.md#research-q05) 仅在可丢弃副本试小任务并检查命令与各项验收；无有效证据或状态不明时暂停并回人工核对。 |
| [Perfect Web Clone](#plugin-1128708803-root) | 以Skill驱动宿主编码Agent，配套网页采集、分区和量化工具；root提供DSH shim，但分进程CLI活动工作区与综合门控是采用前必须核实的断点。 | 先观察。 |
| [phi](#plugin-1321152436-root) | 提供终端编码、权限控制、子 Agent、扩展和按需 MCP 工具发现的独立 Go 客户端。 | [Q04](../../plugins/pulseaiclub--phi/INSIGHT.md#research-q04) 先在可信只读MCP任务中对照试用，保留真实权限配置；漏用工具、拒绝失配或总负担上升就回原客户端。 |
| [Pilot Harness](#plugin-1336793734-root) | 将 DSH 底座组合为 Electron 桌面客户端与独立界面插件，提供模型配置和工作区 Files 侧栏，真实文件操作需另核目标与并发边界。 | 复制workspace、独立资料目录先只读浏览和插入草稿路径；写操作/模型权限另核，界面目标或写结果不清先停，见 [Q05](../../plugins/op7418--pilot-harness/INSIGHT.md#research-q05)。 |
| [Plan Lattice](#plugin-1334504487-root) | 在 DSH 历史替换后恢复原生任务依据，并可显式启用完整执行门禁。 | 先用作者公开稳定包/候选在相同 DSH 版本隔离试点，重点比较替换后权威保真和门禁对合法写入的影响；无需把 rc.8 或机制比例当生产收益，详见[Q03](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md#research-q03)。 |
| [RainSkills](#plugin-1237266636-root) | 在多种 Agent 中提供 Rainbond 部署、排障与交付验证流程，DSH 包注册引导 Skill。 | 仅在测试租户验证一个应用，先回读权限，未知写入先查询，最后检查目标 API。 |
| [rdd-explore](#plugin-1222692871-dsh-dsh-rdd-explore) | 为 DSH 提供代码探索缓存查询、子代理派遣和模型目录。 | [Q03](../../plugins/yaphethayate--coderdd--dsh-dsh-rdd-explore/INSIGHT.md#research-q03) 以非敏感项目核权限与端点，结果回源码验证；不满足条件时退回原生搜索。 |
| [REA](#plugin-1209966933-root) | 通过命令行和 MCP 提供应用与二进制逆向分析工具。 | 有逆向经验且具备目标检查权限的用户可在匹配 Node 的隔离环境中用已知样本试用；关键来源缺失或推断不可回查时停止使用结论，改看原始材料。 |
| [Rotifer Protocol](#plugin-1188590713-plugins-rotifer) | 为 DSH 提供 Rotifer 技能及 MCP 接入，辅助发现、比较和管理 Gene。 | [Q05](../../plugins/rotifer-protocol--rotifer-playground--plugins-rotifer/INSIGHT.md#research-q05) 先在隔离仓库只读核查并独立备份；未经授权或来源不可审时停止。 |
| [RoundTable](#plugin-1342524723-root) | 在 DSH 会话中组织多专家圆桌、汇总和人工评审。 | 以小预算、两节点和非敏感任务试验，用户核对原文并承担最终决策。 |
| [Ruflo](#plugin-995029641-root) | 提供 CLI 和 MCP 工具以登记 Agent、组织任务并调用模型服务。 | [Q05](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q05) 建议先观察；确有需要时在隔离副本及私有受控 stdio 只测一个明确模型请求，分别核查状态、返回和独立产物。 |
| [See Now](#plugin-1441851226-root) | 从屏幕、摄像头或视频筛选变化帧并拼图，作为 DSH 视觉工具的输入。 | [Q04](../../plugins/saos-3624--dsh-see-now/INSIGHT.md#research-q04) 先核查短文件上的画面覆盖、清晰度与退出，再决定是否打开实时源。 |
| [See Wxapkg](#plugin-1146519069-root) | 自托管微信小程序 wxapkg 静态恢复工具，提供解密、解包、工程整理与结果报告。 | [Q04](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q04) 只在受控环境用自有样本试阅读恢复工程，先查诊断保留和报告，停止于等价保证不足的任务。 |
| [sivtr](#plugin-1215961903-root) | 采集并搜索终端输出与 Agent 会话，提供 CLI 和 MCP 访问。 | [Q04](../../plugins/ariestar--sivtr/INSIGHT.md#research-q04) 先用隔离记录检查采集、权限与查询；不接受数据边界时停用相应采集或共享。 |
| [SkillHub for DSH](#plugin-1178833585-plugins-dsh) | 在 DSH 内搜索、安装和管理 SkillHub 技能。 | 测试 profile 选择明确候选并核验范围、回执和发现；不兼容或歧义时停止写入。 |
| [Skills-Link](#plugin-1208725464-root) | 以共享目录、符号链接或 Junction 在多个 AI App 间组织本地 Skill，并提供可选 Git 同步与规则同步入口。 | [Q03](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q03)复制路径关Git试少量可信Skill，先验失败恢复，再考虑真实App和显式远端。 |
| [SpecFusion](#plugin-1156210476-root) | 聚合中文开放平台 API 文档，提供跨源搜索、全文与摘要读取，并附带 Agent Skill 和 DSH 接入。 | [Q04](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q04)以公开已知问题小范围试用，指定平台和模式，全文对照厂商原页后再写代码；错误来源、陈旧字段或服务失败时退回官方站，管理令牌未核不对外自建。 |
| [SumSec-Skills](#plugin-1207705027-root) | 按插件整理中文写作、开发工具及其他 Agent Skill，并提供多宿主入口。 | [Q03](../../plugins/summersec--sumsec-skills/INSIGHT.md#research-q03) 在隔离 profile 审查所需 Skill、安装副作用和原配置；发现冲突时停止加载并恢复。 |
| [Supergraph](#plugin-1232531989-root) | 为编码 Agent 集成工程工作流、代码图上下文和协作工具，包含 DSH Host 与客户端接入。 | 在隔离 Profile 只试一个项目的扫描，核对图结论与实际改动；失败即回到 Git diff 与测试。 |
| [Superpowers DSH](#plugin-1333750613-root) | 将上游软件开发方法作为可调用 DSH 技能注册 | [Q04](../../plugins/laynechai--superpowers-dsh/INSIGHT.md#research-q04) 先在隔离 profile 选择一个技能，对照团队现有规范。 |
| [TapTap DSH Maker](#plugin-1074165057-packages-dsh-maker) | 将 TapTap Maker MCP、工作流与功能技能以及固定 CLI 路径接入 DSH 的 bundle 插件。 | [Q03](../../plugins/taptap--instant-games-open-mcp--packages-dsh-maker/INSIGHT.md#research-q03) 备份profile并确认L1/L2不重复，核实际Maker0.0.32入口；先显式target_dir读取状态。 |
| [TapTap Open API MCP](#plugin-1074165057-root) | 为 TapTap 小游戏和 H5 提供文档、应用与排行榜管理、H5 上传和当前游戏相关操作的 MCP 服务器。 | [Q03](../../plugins/taptap--instant-games-open-mcp/INSIGHT.md#research-q03) 先在独立缓存与测试工作区用本地stdio查指南和状态，区分根Open API与Maker。 |
| [Terrain](#plugin-1269057665-root) | 独立桌面与CLI将仓库知识、Agent工具和Git漂移组织到一起；文档完整、资料同步和回答正确是不同判据，Ask还可自动准备并写知识资产。 | 复制允许处理的仓库，先生成少量知识并核源码定位/更新；明确接受Ask准备写入及模型路由，环境安装另按选择评估，见[Q04](../../plugins/sopaco--terrain/INSIGHT.md#research-q04)、[Q05](../../plugins/sopaco--terrain/INSIGHT.md#research-q05)。 |
| [Trae 连接器](#plugin-1349635927-root) | 将本机 Trae 账号接入 DSH 模型供应商，提供地区、用量和模型设置。 | [Q04](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md#research-q04) 先只用一个已核对的面板，保持账号池关闭并独立查账。 |
| [Upstash Agent Skills](#plugin-1190568968-root) | 为 DSH 加载 Upstash 产品技能并接入外部 MCP 服务。 | [Q04](../../plugins/upstash--skills/INSIGHT.md#research-q04) 在隔离账号中检查权限、数据与费用，退出时分别处理凭据和资源。 |
| [VibeSkills](#plugin-1164005541-root) | 通过候选 Skill 审计、分阶段需求计划与执行验收组织复杂任务。 | [Q04](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q04) 先确认目标宿主、任务和授权边界；轻任务直接使用原生 Skill。 |
| [WeSight](#plugin-1232030145-root) | 为多种本地编码Agent提供桌面聊天、文件变化、配置与运行指标工作区。 | 已有多CLI需求的开发者可先用一个已有引擎在副本仓库试用，核对权限、文件与中断状态；若配置资源负担高于切换便利，或要求各引擎同等审批而未证实，就退回原CLI与编辑器。 |
| [Witness（dsh-verify）](#plugin-1335843750-root) | 用可复跑 JSON 浏览器断言检查网页行为，并输出逐步报告与截图 | 已有明确标准的开发者先在localhost用正确/故意错误断言试用，回读实际URL和报告；未审spec或基线不能放行，Host阻塞或目标不符退回CLI/手写Playwright。 |
| [working-activity](#plugin-1309769324-root) | 为 pi 与 DSH 提供实时工具活动、模型自述、耗时和收尾统计的工作状态行。 | [Q04](../../plugins/ccch1mneyyy--working-activity/INSIGHT.md#research-q04) 先仅事件模式，以工具日志为事实核对；若增加干扰或误导，回宿主原状态。 |
| [WSL rclone 查询工具](#plugin-1381859181-root) | 在 DSH 中查询 rclone 远程名称、目录条目与用量配额。 | [Q04](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md#research-q04) 先明确非空远程名单，再验证合成目录的允许、拒绝和截断。 |
| [xskill](#plugin-1235225511-root) | 从编码 Agent 执行轨迹提取与分发可复用 Skill，包含 DSH 轨迹和安装适配。 | 保留人工 Skill 流程；仅用合成样本评估数据范围、版本及清理路径。 |
| [ZeroToken Skill](#plugin-1222262862-root) | 提供面向 Agent 的简洁输出、渐进读取与平台适配规则。 | [Q04](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md#research-q04) 先比较宿主规则并检查脚本副作用；复杂或需完整证据时按 [Q03](../../plugins/phoenixlucky--zerotoken-skill/INSIGHT.md#research-q03) 停止压缩。 |
| [嵌入式工作台](#plugin-1276714299-root) | 为嵌入式 C/C++ 开发提供按需技能，并在 DSH 首个模型步注入计划核查提醒。 | [Q04](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q04)先在可回滚任务中手动加载匹配领域Skill，核对同版编译和复现结果，再决定是否启用提醒；格式齐全但无证据时停止使用其结论。 |
| [提示词与错误经验面板](#plugin-1418691015-root) | 在会话标题栏编辑全局和会话提示词，并审核模型自报错误的经验草稿。 | [Q04](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md#research-q04) 先只采用经核实的合成教训。 |
| [无限五代 IG5](#plugin-1335211378-root) | 在 DSH 工作台中集成二进制静态分析、调试、流量与证据管理。 | [Q05](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q05) 用隔离 profile 和授权副本先验证代表性路径，不明副作用时暂停并人工核查。 |
| [模型接力](#plugin-1415863200-root) | 把候选队列包装成模型，提交前切换并按会话/模板隔离，另有全局自动继续；停止与终态需核。 | 观察：先修/验失败终态和关闭/等待语义，限定可回滚任务与候选，再对照正确产物、人工和全成本；发生越过停止/重复/账实不符即查未决后回退，见[Q06](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q06)。 |
| [鲸屿 Whale Isle](#plugin-1333141598-root) | 基于 DeepSeek Harness 的社区桌面客户端，整合对话、文件预览、终端与 Git。 | [Q04](../../plugins/chisaalter--whaleisle/INSIGHT.md#research-q04)熟悉DSH者用备份/副本工作区核home与退出重开，异常停更新回官方CLI/Web对账。 |

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

<a id="plugin-1230123793-root"></a>

## [Agent Handoff Skill](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md)

[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WeirdSky924/agent-handoff-skill)

> **用途**：同一项目由不同会话接力时，维护者可以保存目标、验证和下一步供新会话查阅。

> **亮点**：用仓库可查的入口和分文件记录承接会话，容量治理按字节执行，减少对模型随意决定截断的依赖。见 [Q01](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md#research-q01)、[Q02](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md#research-q02)。

> **思考**：脚本理解文件形状和大小，事实正确性仍要回读仓库，权限和钩子还有独立开关。见 [Q02](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md#research-q02)、[Q03](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md#research-q03)。

> **建议**：在交接次数和事实清单一致时，比较多布局与人工单页的错误恢复和总人时。见 [Q04](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/weirdsky924--agent-handoff-skill/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 92,198](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92%2C198&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify)

> **用途**：需要把系统或问题解释给他人的开发者与知识工作者，可以构造图表或说明页并逐项核对来源；根仓是 Skill 而非 DSH 原生插件。[Q01](../../plugins/tt-a1i--archify/INSIGHT.md#research-q01)

> **亮点**：相对手工组织图形与检查，Skill 将结构化候选、交互 HTML 和绑定实际字节的阶段收据组合；不将模型、源码事实或浏览器本身算作其原创。[Q01](../../plugins/tt-a1i--archify/INSIGHT.md#research-q01) [Q02](../../plugins/tt-a1i--archify/INSIGHT.md#research-q02)

> **思考**：有效来源位置和通过收据能否避免错误关系及误导视觉？关系无独立 sources，自动浏览器检查也不是人眼审阅，explainer 默认不运行该检查。[Q03](../../plugins/tt-a1i--archify/INSIGHT.md#research-q03)

> **建议**：假设对关键关系独立记录调用位置、事实性质和人工核对状态，可减少图中假边；与现有节点引用和人工核对比较误报、漏检及耗时，不能改善时放弃。[Q05](../../plugins/tt-a1i--archify/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/tt-a1i--archify/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1211139949-integrations-deepseek-harness"></a>

## [Archify DSH 适配器](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md)

[![GitHub ★ 92,197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92%2C197&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify) [![npm 30d 40,336](https://img.shields.io/static/v1?label=npm+30d&message=40%2C336&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)

> **用途**：[Q01](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q01) 希望在 DSH 中调用 Archify 生成架构图的开发者需要加载正确技能及工作区产物。

> **亮点**：[Q02](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q02) 用包和 profile 管理固定 Skill 来源，相对手工复制增加受版本控制的发现路径。

> **思考**：[Q03](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q03) 文档称已发布 1.0.0 可能隐藏默认 Skill，源码修复仍是候选；同名 Skill 也可能遮蔽包内版本。

> **建议**：[Q04](../../plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md#research-q04) 展示有效 Skill 来源与同名遮蔽可减少升级诊断时间，需在隔离配置验证。

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

<a id="plugin-1425087677-root"></a>

## [Better Workspace File Manager](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Arrosam/dsh-better-workspace-file-manager) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-workspace-file-manager)

> **用途**：需要在 DSH 修改小文件的开发者可评估工作区编辑器。

> **亮点**：[Q01](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md#research-q01) 将文件管理和版本保护放进 Web 预览。

> **思考**：[Q03](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md#research-q03) 路径和权限依赖宿主，显式冲突覆盖仍会写文件。

> **建议**：[Q05](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md#research-q05) 比较差异预览对误覆盖的影响。

[查看完整分析](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1324949198-root"></a>

## [billion-context](../../plugins/ranxianglei--billion-context/INSIGHT.md)

[![GitHub ★ 3,521](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C521&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ranxianglei/billion-context) [![npm 30d 2,315,214](https://img.shields.io/static/v1?label=npm+30d&message=2%2C315%2C214&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)

> **用途**：维护长期编码任务的人需要在窗口限制下继续使用关键决策和原始细节；合格结果是正确完成任务而不是累计 token 数。[Q01](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q01)

> **亮点**：[Q02](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q02) 显示 DSH 代理工具与范围块、按需恢复相结合，提供相对整段压缩更细的操作；方法包含 kernel 既有贡献，不能据此断言原创或效果提升。

> **思考**：[Q03](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q03) 显示启动失败可直连且作者报告部分传输可能绕开代理；[Q02](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q02) 的恢复路径在缓存和原消息缺失时可能退回摘要，不能视为无条件原文恢复。

> **建议**：[Q04](../../plugins/ranxianglei--billion-context/INSIGHT.md#research-q04) 提出在关键事实输出前展示对应原文引用供确认，可能减少摘要误用；同任务对照、全成本与否定条件尚待验证，不是现有能力。

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

[![GitHub ★ 1,877](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C877&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenryu42/cc-safety-net) [![npm 30d 89,094](https://img.shields.io/static/v1?label=npm+30d&message=89%2C094&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net)

> **用途**：[Q01](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q01) 面向希望减少编码 Agent 误执行危险命令的用户，合格结果须兼顾阻断与正常工作。

> **亮点**：[Q02](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q02) 将可配置命令和敏感路径检查接入 DSH 执行前 guard，相对仅依赖提示词提供一个可解释的判断点；它不是进程隔离。

> **思考**：[Q03](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q03) 中标准模式允许部分动态形式，未知工具的提醒在执行后；覆盖遗漏不能由异常拒绝机制消除。

> **建议**：[Q04](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q04) 假设安装后提供待审阅的工具覆盖清单可减少首次不受检调用，需用安全样本对照覆盖与误声明，尚未验证。

[查看完整分析](../../plugins/kenryu42--cc-safety-net/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1281865940-root"></a>

## [Cetus](../../plugins/drewnekota--cetus/INSIGHT.md)

[![GitHub ★ 150](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=150&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/drewnekota/cetus)

> **用途**：希望在同一桌面入口处理多个 Agent CLI 会话的开发者。

> **亮点**：[Q01](../../plugins/drewnekota--cetus/INSIGHT.md#research-q01) 将 DSH 的 ACP 会话接到多运行时客户端。

> **思考**：[Q02](../../plugins/drewnekota--cetus/INSIGHT.md#research-q02) 启动准备会读环境和处理配置，实际边界需核查。

> **建议**：[Q04](../../plugins/drewnekota--cetus/INSIGHT.md#research-q04) 预览启动准备以减少状态误判。

[查看完整分析](../../plugins/drewnekota--cetus/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1311108439-root"></a>

## [Codex Taskboard 本地任务看板](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md)

[![GitHub ★ 3,401](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C401&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chuspeeism/dashi-taskboard)

> **用途**：有跨AI会话交接需求的开发者维护任务、需求、附件和当前责任，用户验收后才办结。

> **亮点**：[Q03](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q03) 把成熟的乐观并发和AI会话绑定、需求重读、待审/接受边界组织成任务交接协议，相对手工列表增加责任与状态追溯；不以任务记录宣称软件交付正确。

> **思考**：[Q03](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q03) 数据库保护写入版本，不能保护交付真实性；Skill约束依赖执行者遵守，done与评论不能替代代码和用户验收证据。

> **建议**：[Q05](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md#research-q05) 未验证假设是把需求版本、代码revision和验证结果绑定为接受包，用五个需求变动任务对照错配办结与人工成本；无改善或维护更重即停止。

[查看完整分析](../../plugins/chuspeeism--dashi-taskboard/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1359009818-root"></a>

## [Comi Pet](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md)

[![GitHub ★ 239](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=239&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/IvenKooLab/desktop-pet)

> **用途**：经常离开 DSH 界面的本地开发者可以用桌宠关注工具活动和审批等待。

> **亮点**：[Q01](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q01) 的本地事件桥让桌面可提示审批等待。[Q02](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q02) 的两阶段显示租约允许同一角色在窗口间交接，并在页面失联后恢复原生显示。

> **思考**：[Q01](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q01) 中的任务动画源自事件映射，不能用来验收目标结果。[Q03](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q03) 的聊天会将输入和历史交给 DSH 模型，需要独立核对 provider 与本机文件边界。

> **建议**：[Q05](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md#research-q05) 可对照现有失败提示，验证分原因反馈能否减少无效切换。若恢复时间没有改善或误导增加，即否定增量。

[查看完整分析](../../plugins/ivenkoolab--desktop-pet/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1216785679-root"></a>

## [DeepSeek Reasonix](../../plugins/esengine--deepseek-reasonix/INSIGHT.md)

[![GitHub ★ 36,014](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C014&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/esengine/DeepSeek-Reasonix)

> **用途**：能审代码的开发者在可恢复项目中描述任务，由编码助手读文件、修改和运行验证；仍须人工验收。

> **亮点**：[Q01](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q01) 和 [Q02](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q02) 显示实际模型、工具、配对结果和多入口的集成，相比人工复制建议可改变操作流程；不证明算法原创或实测省时。

> **思考**：[Q03](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q03) 表明普通 Gate 不覆盖显式 shell 分支，本轮 DSH caller 与 Reasonix 配置锁定版本不同；自动委派前必须确认来源、能力检查和实际双方版本。

> **建议**：[Q06](../../plugins/esengine--deepseek-reasonix/INSIGHT.md#research-q06) 提出区分人类直输和委派输入的未验证授权适配；若简单禁用 bash 与隔离已满足条件，增加协议不值得。

[查看完整分析](../../plugins/esengine--deepseek-reasonix/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1337578630-root"></a>

## [DeepSeekGUI](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md)

[![GitHub ★ 273](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=273&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/See-Sol-Lab/DeepSeekGUI)

> **用途**：需要在DSH会话旁查看代码与公开网页的用户；本轮只核代表链，不扩到README全部Git/PR/记忆/迁移功能，见[Q01](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q01)。

> **亮点**：统一桌面托管和真实内嵌浏览器、分mode工具/目标与网络检查组合；已有护栏范围见[Q03](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q03)，独立能力主表只列本轮已核操作。

> **思考**：Full access内部不发审批，但approveSubmission未填URL导致正常非空页面敏感动作误拒的源码条件；一般模式不一概失败。role/name/URL/facts不等业务对象，clicked/submitted不等服务受理，SSRF不等网页可信或整机隔离，见[Q03](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q03)。

> **建议**：先修Full access helper的URL误拒；在已有审批后facts复比之外做有限业务的后置事实核验和未知结果对账；受控基线/指标/停止条件见[Q05](../../plugins/see-sol-lab--deepseekgui/INSIGHT.md#research-q05)。

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

[![GitHub ★ 4,553](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C553&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhukunpenglinyutong/desktop-cc-gui)

> **用途**：同时使用多种编码引擎并希望统一项目、会话和输出的开发者；单引擎可比较原生入口。[Q01](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q01)

> **亮点**：持久 host session 与结构化流接入多引擎桌面，而非终端截屏或 DSH 原生插件。[Q01](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q01) [Q02](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q02)

> **思考**：普通 DSH 工具审批自动 allowed-once；计划评审是独立流程且软约束，不是只读沙箱。[Q03](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q03)

> **建议**：未验证假设：发送前按引擎与实测 host 能力分别展示工具审批、计划评审与沙箱状态，可降低误解；须验证过期和误导。[Q05](../../plugins/zhukunpenglinyutong--desktop-cc-gui/INSIGHT.md#research-q05)

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

[![GitHub ★ 1,156](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C156&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liguobao/ds-harness-remote)

> **用途**：需要离开电脑继续本机 DSH 会话的个人；基线是 VPN 和本地网页。[Q01](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q01)

> **亮点**：整合跨设备连接与原工作区访问，宿主保留原会话和工具。[Q01](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q01) [Q02](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q02)

> **思考**：加密不限制已授权终端副作用；Linux 安装方式可使 Host 和远程工具以 root 运行。[Q03](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q03)

> **建议**：未验证假设：显示设备、请求及 Host 结果状态可减少断线误重试；需对照现有 RPC。[Q05](../../plugins/liguobao--ds-harness-remote/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/liguobao--ds-harness-remote/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334939514-root"></a>

## [DSH Agency Agents](../../plugins/michengai--dsh-agency-agents/INSIGHT.md)

[![GitHub ★ 200](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=200&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-agency-agents) [![npm 30d 48,981](https://img.shields.io/static/v1?label=npm+30d&message=48%2C981&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-agency-agents) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)

> **用途**：DSH用户需要明确分工的代码/产品/研究评审。

> **亮点**：[Q01](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q01)、[Q02](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q02)目录/角色职责与有界团队执行合同，主会话统一核证据。

> **思考**：[Q03](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q03)角色不是资质或不同模型，有限递归守卫非只读沙箱；[Q02](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q02)native started非结论。

> **建议**：[Q04](../../plugins/michengai--dsh-agency-agents/INSIGHT.md#research-q04)按本次taskId形成启动到完成的结果收据可探索，宿主已同效或负担抵消则否定。

[查看完整分析](../../plugins/michengai--dsh-agency-agents/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 2,619](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C619&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NanmiCoder/dsh-agent-teams) [![npm 30d 48,673](https://img.shields.io/static/v1?label=npm+30d&message=48%2C673&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams)

> **用途**：[Q01](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q01) 能拆分工作并复核整合的 DSH 用户希望让多个成员按依赖协作。

> **亮点**：[Q02](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q02) 为可续聊子 Agent 增加持久任务图、归属与自动调度，相比手工跟踪减少协调步骤。

> **思考**：[Q03](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q03) attempt 只限制团队任务更新，不能撤销已发生的文件或外部副作用；范围门禁是完成时审计。

> **建议**：[Q04](../../plugins/nanmicoder--dsh-agent-teams/INSIGHT.md#research-q04) 假设在宿主实际写入前核对成员 attempt 与声明范围并阻止越界，可能减少未声明文件并行修改；现有实现已在建任务时拒绝部分已声明范围重叠，不能把该检查当成新增功能。需对照冲突、误拦与延迟。

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

<a id="plugin-1413052822-root"></a>

## [DSH Armory](../../plugins/2026heshao--dsh-armory/INSIGHT.md)

[![GitHub ★ 80](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=80&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2026heshao/dsh-armory) [![npm 30d 3,041](https://img.shields.io/static/v1?label=npm+30d&message=3%2C041&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory)

> **用途**：维护多个 MCP 连接和技能的 DSH 用户可集中查看和管理扩展；只有少量扩展时额外面板的价值未确定。

> **亮点**：[Q01](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q01) 与 [Q03](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q03) 显示面板把扩展管理和使用账本接到宿主注册表和日志；相对分别查配置和会话日志，减少分散查找的机制有据，净收益仍需对照。

> **思考**：[Q02](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q02) 中技能更新先删除旧目录再换入，失败清理不会恢复旧内容；条件式摘要校验和文件存在检查也不等同宿主已加载，故应先备份并核实发现结果。

> **建议**：[Q06](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q06) 提出保留旧目录直至新目录得到宿主发现确认的未验证方案；若普通备份更可靠或事务成本更高，则不推广。

[查看完整分析](../../plugins/2026heshao--dsh-armory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1352600211-root"></a>

## [DSH Better Sidebar N23](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md)

[![npm 30d 1,125](https://img.shields.io/static/v1?label=npm+30d&message=1%2C125&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23)

> **用途**：希望在对话旁完成文件检查、终端与Git操作的开发者；需接受插件以本机权限执行操作。

> **亮点**：现有工作台把文件、终端和Git交接集中到DSH旁；fork可识别增量是布局提交策略、外壳与模块兼容，整体设计归上游，不能全部计为原创。[Q01](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q01)

> **思考**：src/lib刻意分轨意味着“源码有修复”不能证明发布包具有同一修复；发布fs.write也没有版本比较或cwd写入边界。兼容与编辑可靠性应先于功能广度判断。[Q02](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q02) [Q03](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q03)

> **建议**：未验证假设为分离拖拽临时视觉状态与最终持久化提交，并用统一可重建源消除产物漂移；在相同大对话负载下检验帧耗时和构建一致性，收益消失或布局回归即否定。[Q04](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/all3ncn--dsh-better-sidebar-n23/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333200468-root"></a>

## [DSH Chat Import](../../plugins/nwflower--dsh-chat-import/INSIGHT.md)

[![GitHub ★ 273](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=273&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nwflower/dsh-chat-import) [![npm 30d 13,577](https://img.shields.io/static/v1?label=npm+30d&message=13%2C577&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-import) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-import)

> **用途**：迁入 DSH 的开发者需要查询并接续已有编码会话。

> **亮点**：[Q01](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q01) 与 [Q02](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q02) 将外部会话转换为宿主记录并接入工作区；不转移原运行环境。

> **思考**：[Q03](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q03) 创建、挂接和记账不是已证明的单一事务；[Q04](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q04) 空结果补齐与图片占位限制无损主张。

> **建议**：[Q05](../../plugins/nwflower--dsh-chat-import/INSIGHT.md#research-q05) 假设逐对象迁移清单可降低无损误判；需先核现有界面且未验证。

[查看完整分析](../../plugins/nwflower--dsh-chat-import/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1311108439-integrations-deepseek-harness"></a>

## [DSH Codex Taskboard 侧栏集成](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md)

[![GitHub ★ 3,401](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C401&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chuspeeism/dashi-taskboard)

> **用途**：已运行Taskboard的DSH Web使用者在工作界面查看与管理原有任务。

> **亮点**：[Q01](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q01)、[Q02](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q02) 把启动器拥有的运行时描述符接到DSH入口，相对写死端口或手工打开URL减少地址维护；不包含独立看板引擎或自动启动能力。

> **思考**：[Q02](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q02) 统一503会把描述符格式、权限和服务未运行混为一类，动态发现不等于健康验证；读取者依赖启动器维护正确可信的URL。

> **建议**：[Q04](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md#research-q04) 未验证假设是在受限本地健康探测下区分描述符故障，以故障注入比较定位时间；无改善或出现额外误报即停止。

[查看完整分析](../../plugins/chuspeeism--dashi-taskboard--integrations-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334118559-root"></a>

## [DSH Command Code Provider](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md)

[![GitHub ★ 447](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=447&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Mars-Sea/dsh-commandcode-provider) [![npm 30d 13,208](https://img.shields.io/static/v1?label=npm+30d&message=13%2C208&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mars-sea/dsh-commandcode-provider) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mars-sea/dsh-commandcode-provider)

> **用途**：已有 Command Code 账户的 DSH 用户希望在当前宿主调用其模型。

> **亮点**：[Q01](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q01) 和 [Q02](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q02) 将上游模型和账户整合到 DSH；模型质量与可用性属于上游。

> **思考**：[Q03](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q03) 分层重试不能证明远端未执行，[Q04](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q04) 本地 ZDR 请求头与价格估算不能证明留存政策或账单。

> **建议**：[Q06](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md#research-q06) 假设脱敏逐次收据和未知状态可改善失败与费用判断；尚未实现或验证。

[查看完整分析](../../plugins/mars-sea--dsh-commandcode-provider/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333128726-root"></a>

## [DSH GenUI](../../plugins/omdsh-dev--dsh-genui/INSIGHT.md)

[![GitHub ★ 832](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=832&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-genui) [![npm 30d 44,380](https://img.shields.io/static/v1?label=npm+30d&message=44%2C380&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-genui) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-genui)

> **用途**：面向需要在对话中查看图表、表单和结构化内容的用户。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-genui/INSIGHT.md#research-q01) 与 [Q02](../../plugins/omdsh-dev--dsh-genui/INSIGHT.md#research-q02) 显示将受限组件树嵌入会话，便于在不单独开发应用的情况下呈现交互；效果尚未实测。

> **思考**：[Q03](../../plugins/omdsh-dev--dsh-genui/INSIGHT.md#research-q03) 和 [Q04](../../plugins/omdsh-dev--dsh-genui/INSIGHT.md#research-q04) 显示动作是后续消息且可能丢失，具体防护不证明所有生成内容安全。

> **建议**：[Q06](../../plugins/omdsh-dev--dsh-genui/INSIGHT.md#research-q06) 提出用隔离假会话对照动作投递与会话身份，仍需验证。

[查看完整分析](../../plugins/omdsh-dev--dsh-genui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-packages-dsh-git-graph"></a>

## [DSH Git Graph](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md)

[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 104,603](https://img.shields.io/static/v1?label=npm+30d&message=104%2C603&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph)

> **用途**：[Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q01) 面向需要在 DSH 工作区查看分支及历史的 Git 用户；合格操作需要保留工作并确认磁盘状态。

> **亮点**：[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q02) 把 Git 状态和分支操作接入 DSH 界面，并对工作区和分支执行前置检查；仓库数据与 Git 语义仍由上游决定。

> **思考**：[Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q03) 显示部分守卫判断未检查探测退出码，分支删除结果也未核；界面成功不能代替回读实际仓库。

> **建议**：[Q04](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q04) 假设展示受影响会话并在操作后回读状态可减少错目标和伪成功，须以隔离仓库比较错误和时间，尚未验证。

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1333317835-root"></a>

## [DSH Market](../../plugins/2bingling--dsh-market/INSIGHT.md)

[![GitHub ★ 190](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=190&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2BingLing/dsh-market)

> **用途**：需要发现、比较并在合适 profile 采用 DSH 扩展的开发者。

> **亮点**：[Q01](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q01) 将两种读者入口与市场目录关联。[Q02](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q02) 把部分重复安装复用为配方并保留验证。

> **思考**：[Q02](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q02) 过滤命令和子代理复核分别约束不同层面。[Q03](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q03) 部分失败可能保留已执行动作。

> **建议**：[Q04](../../plugins/2bingling--dsh-market/INSIGHT.md#research-q04) 按实际验证层级展示状态，检验是否减少把安装结果当成任务成功。

[查看完整分析](../../plugins/2bingling--dsh-market/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333842753-root"></a>

## [DSH Mobile](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md)

[![GitHub ★ 242](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=242&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sorsama/deepseek-harness-mobile)

> **用途**：已有受控Harness与Android手机的开发者离开桌面后处理等待、审批和结果。原办法是移动Web或返回电脑；合格结果是正确会话上的及时响应与可确认接管，执行能力仍由宿主提供。

> **亮点**：[Q01](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q01) 与 [Q02](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q02) 支持原生通知与远程待办接管的组合增量，特别是把认证、mux代次与回答eventId统一，避免把旧卡片和新请求混在一起。创新归于移动工作流与协议适配，不把Harness执行或relay服务器能力算本根原创。

> **思考**：[Q03](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q03) 安全文档与真实cookie路径存在冲突，直连cookie也不同于relay token的Keystore保护；手机登录仍获得工具能力，TLS不能缩小权限。[Q02](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q02) 载体失败虽称Unsent，却不证明远端未收到，用户仍须重连核待办，不能盲目再次批准。

> **建议**：[Q04](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md#research-q04) 从载体失败语义推导“宿主接受结果未知”的可见提示和待办核对入口，可能减少重复批准；尚未实现或试验。对照丢响应、旧generation和双端并发反例，重复操作不降或恢复投入增即否定。

[查看完整分析](../../plugins/sorsama--deepseek-harness-mobile/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1353534254-root"></a>

## [DSH Model Router](../../plugins/alice-marx--dsh-model-router/INSIGHT.md)

[![GitHub ★ 700](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=700&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 5,824](https://img.shields.io/static/v1?label=npm+30d&message=5%2C824&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router)

> **用途**：面向已有多路模型或官方CLI配置、反复处理依赖工作包的开发者，提供路由规划和带回执的执行组织；当前预览须与生产数据隔离。

> **亮点**：[Q02](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q02)、[Q03](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q03) 支持把依赖路由和预算准入组成可回查执行约束；[Q04](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q04) 的托管任务保留UNKNOWN及对账能力，但未证明端到端节约或全部远程安全。

> **思考**：[Q01](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q01) 的README仍指旧预览与稳定版，而固定包是preview.7且默认启动Bot产品；[Q02](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q02)、[Q04](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q04) 的质量先验与迁移、远端恢复证据不足，使无人值守采用条件未成立。

> **建议**：[Q06](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q06) 提出未验证方向，仅让合格任务与范围明确的费用回执参与现有质量资源校准；若同预算不改善合格率或净成本，或对账负担超过收益则否定。

[查看完整分析](../../plugins/alice-marx--dsh-model-router/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 407](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=407&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dshplugin/dsh-plugin-hub) [![npm 30d 34,388](https://img.shields.io/static/v1?label=npm+30d&message=34%2C388&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin)

> **用途**：DSH Web 用户希望从设置中发现并安装社区插件。

> **亮点**：[Q01](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md#research-q01) 与 [Q02](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md#research-q02) 把发现、变更任务及状态反馈集中到设置页；执行仍由宿主和包管理器完成。

> **思考**：[Q03](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md#research-q03) 来源标记不能证明目录成员或包安全，自动构建放行改变 profile；[Q04](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md#research-q04) 旧缓存及取消状态不能证明实时或回滚。

> **建议**：[Q06](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md#research-q06) 假设以目标版本、完整性和构建权限绑定的短期计划可降低误装及未经确认许可；尚未实现或验证。

[查看完整分析](../../plugins/dshplugin--dsh-plugin-hub/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1334830521-root"></a>

## [DSH Skills Manager](../../plugins/michengai--dsh-skills-manager/INSIGHT.md)

[![GitHub ★ 426](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=426&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-skills-manager) [![npm 30d 142,851](https://img.shields.io/static/v1?label=npm+30d&message=142%2C851&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager)

> **用途**：在 DSH 使用多个本地和项目 Skill 来源的维护者，可以在界面统一查看与配置；重复需求和效率尚无独立用户材料。[Q01](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q01)

> **亮点**：插件将多个来源的候选、启停策略及仓库更新流程接入 DSH，并用预览令牌和本地复验限制部分过期覆盖；相对于手工记录提供可核查的组织机制，不证明净节时或内容安全。[Q02](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q02) [Q03](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q03)

> **思考**：更新失败可能留下文件已安装但来源状态未确认，回退也可能失败；旧 webServer 回退的实际认证及接收阶段大小限制尚未确认，不能把界面上的备份和路由检查视为完整安全保障。[Q03](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q03) [Q04](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q04)

> **建议**：未验证假设：预览时将权限敏感指令与来源信任说明并列，可能帮助维护者发现不适合安装的 Skill，但会增加审阅成本；对照普通文件差异测发现率、误报和时间，若无改善或负担不可接受则否定。[Q05](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q05)

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

[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 120,209](https://img.shields.io/static/v1?label=npm+30d&message=120%2C209&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board)

> **用途**：需要组织周期性巡检或代码任务的 DSH 维护者可按卡片查看执行与结果；仍需对业务结果负责。

> **亮点**：[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q02) 显示任务、持久台账和宿主会话的连接；[Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q03) 对启用验收的完成声明增加通过记录要求。相对人工看板是可回查流程，不证明业务结果一定合格。

> **思考**：[Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q03) 显示手工 Done、普通单轮与通过验收的 goal 运行并不相同；把卡片列当完成证据会掩盖未执行或未验收。

> **建议**：[Q06](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md#research-q06) 提出同时展示手工声明、执行、证据及副作用的未验证假设；若固定卡片理解实验未减少误信则不推广。

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333732838-root"></a>

## [DSH Taskboard](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md)

[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shengsheng90/DSH-taskboard) [![npm 30d 1,230](https://img.shields.io/static/v1?label=npm+30d&message=1%2C230&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard)

> **用途**：需要跨会话管理本地项目的 DSH 操作者，可跟踪任务要求、claim与人工review，成果仍需独立验收。

> **亮点**：[Q01](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q01) 把持久任务、owner认领、宿主原生会话和人工review接在一起，比聊天便签多了可拒绝的竞争与版本边界。 [Q02](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q02) 仍保留宿主执行归属，工作流仅指导而非自动引擎。

> **思考**：[Q02](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q02) human actor是入口信任约定，不能约束已获CLI/数据库能力的进程；Goal complete与非空验证文本不证明成果合格，SQLite事务也不包外部副作用。

> **建议**：[Q04](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q04) 提出版本、产物和真实验证记录绑定的验收包，检验能否减少误接受；相对现有human review新增可核材料，而非另设状态标签。

[查看完整分析](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333111893-root"></a>

## [DSH TUI](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md)

[![GitHub ★ 6,458](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C458&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ccch1mneyyy/dsh-TUI) [![npm 30d 53,368](https://img.shields.io/static/v1?label=npm+30d&message=53%2C368&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui)

> **用途**：面向希望在终端内处理 DSH 会话和状态的用户。

> **亮点**：[Q01](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q01) 与 [Q02](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q02) 显示终端入口组合宿主 channel 与 UI，提供集中状态视图；用户效率未测。

> **思考**：[Q03](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q03) 和 [Q04](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q04) 显示恢复与实时存在有意差异，救援 profile 仍共享 home 与环境；不能视为完全等价或安全沙箱。

> **建议**：[Q06](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md#research-q06) 提议比较同一事件序列的最终稳定行，以检验恢复一致性；这仍是假设。

[查看完整分析](../../plugins/ccch1mneyyy--dsh-tui/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 1,202](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C202&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ysr666/dsh-vision-router) [![npm 30d 38,122](https://img.shields.io/static/v1?label=npm+30d&message=38%2C122&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router)

> **用途**：面向需要在 DSH 任务中读取截图、识别图片和核对视觉内容的用户。

> **亮点**：[Q01](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q01) 与 [Q02](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q02) 显示将图片入口、后端与工具组合接入 DSH；模型视觉能力和任务收益不能归为插件自身证明。

> **思考**：[Q03](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q03) 的窄桥不能保证全部调用不重复；[Q04](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q04) 默认可向远端发送图像，本地视觉开关也不能让远程聊天模型离线。

> **建议**：[Q06](../../plugins/ysr666--dsh-vision-router/INSIGHT.md#research-q06) 假设可见的脱敏尝试收据与出站前确认能改善隐私和费用判断；既有失败列表与日志是直接对照，方案尚未验证。

[查看完整分析](../../plugins/ysr666--dsh-vision-router/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333100071-root"></a>

## [DSH Vision Toolkit](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md)

[![GitHub ★ 907](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=907&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,773](https://img.shields.io/static/v1?label=npm+30d&message=10%2C773&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

> **用途**：适合使用文字模型的DSH开发者检查截图错误、界面位置和视觉差异。原办法是把图转到另一个视觉模型，再手工复制描述或坐标回来；本插件把上传、定位和Artifacts返回连入同一会话。合格结果是能追溯到输入图的文本证据或坐标，并由用户核对相应区域，而不是模型自称看见了。已有原生多模态模型或只做偶发看图的人，转接价值较小。作者长期使用和首创表述未作为独立需求证明。

> **亮点**：[Q02](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q02)支持上游视觉执行与DSH会话、设置和Artifacts的整合；按Agent激活有明确增量，不将视觉推理本身计为新贡献。

> **思考**：[Q03](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q03)服务和接口就绪不能证明定位准确；错误坐标直接驱动动作会放大影响，建议保留人工核对。

> **建议**：[Q05](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q05)提出原图指纹与动作前状态校验的未验证假设，用变化界面对照误点和额外调用。

[查看完整分析](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 3,940](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C940&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 255,407](https://img.shields.io/static/v1?label=npm+30d&message=255%2C407&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)

> **用途**：[Q01](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q01) 面向需要定位长会话上下文膨胀来源的 DSH 用户；合格结果是能够解释请求构成并核对来源。

> **亮点**：[Q02](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q02) 将已有宿主事件和估算组织成按请求分类与详情导航，相比只看总量提供可检查的线索；这不是独立网络抓包或已证实的节时。

> **思考**：[Q03](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q03) 中估算公式、低版本零值降级和冷读门控会改变数值含义或让详情缺失；[Q02](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q02) 因而不能保证完整精确账单。

> **建议**：[Q04](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q04) 假设将估算、usage 和缺失状态并列显示可减少误判，须以相同请求测正确率和人工时间；尚未验证且不是已实现贡献。

[查看完整分析](../../plugins/bowenliang123--dsh-context/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1300173275-extensions-dsh"></a>

## [dsh-deja](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md)

[![GitHub ★ 1,343](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C343&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu) [![npm 30d 5,751](https://img.shields.io/static/v1?label=npm+30d&message=5%2C751&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja)

> **用途**：已有同机编码助手旧历史的开发者，希望在 DSH 查找旧错误、文件讨论和决定。

> **亮点**：[Q01](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q01) 和 [Q02](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q02) 展示 DSH 工具与历史 CLI 的接线；上游索引机制和实际效果不归因于扩展。

> **思考**：[Q03](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q03) 某些错误可变为空结果，[Q04](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q04) 本地查询不保证召回内容不会进入云模型。

> **建议**：[Q06](../../plugins/vshulcz--deja-vu--extensions-dsh/INSIGHT.md#research-q06) 假设逐条展示来源、版本关系并让作者确认可减少过期历史误用；须先核对核心已有能力且未验证。

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

[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1na-ko/dsh-hdc-bridge) [![npm 30d 1,874](https://img.shields.io/static/v1?label=npm+30d&message=1%2C874&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hdc-bridge) [![最新发布 2026-10-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hdc-bridge)

> **用途**：[Q01](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q01) 为在 DSH 内反复改码、部署和看设备的鸿蒙开发者减少手动材料交接；合格结果是正确设备的真实行为，而非exit0。

> **亮点**：[Q01](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q01) 与 [Q02](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q02) 把成熟hdc、官方工具链和知识接入原生工具、图片与工程流程，结构化失败/产物核验减少只看命令成功的误判；不把上游协议/文档算原创。

> **思考**：[Q03](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q03) 的preferred设备单值需要宿主实例作用域才能兑现会话隔离，工具Shell和面板直接进程也不是同一权限通道。已有Host/Origin等请求栅栏，但多会话设备语义仍未运行验收。

> **建议**：[Q05](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md#research-q05) 用会话/工程/设备/产物收据连接已有状态，检验双设备双工程下的误投与确认负担；当前为未验证假设。

[查看完整分析](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 4,935](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C935&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-ops) [![npm 30d 97,591](https://img.shields.io/static/v1?label=npm+30d&message=97%2C591&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops)

> **用途**：面向能复核文件结果、反复进行代码和文档操作的 DSH 用户；合格结果是修改正确、范围完整且成本可接受。

> **亮点**：[Q01](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q01) 与 [Q02](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q02) 表明它将 worker 文件能力、预设与动态发布组合进宿主；[Q03](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q03) 的归属检查降低错误替换表面的风险，但不证明节省或语义等价。

> **思考**：[Q03](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q03) 和 [Q04](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q04) 的核心问题是隐藏原生工具及压缩输出是否导致漏读或错误修改；准备检查不是语义对照，中断和缓存清理也不能保证没有残留。

> **建议**：[Q06](../../plugins/t-auto--dsh-ops/INSIGHT.md#research-q06) 假设以宿主观察对账任务目标文件与实际结果，可暴露局部完整但任务不完整；现有截断与分页提示是反证，收益、误报和成本未测。

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

[![GitHub ★ 6,299](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C299&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)

> **用途**：已使用 Ouroboros、希望在 DSH 对话调用的开发者；替代为手写 MCP 配置或直接 CLI。[Q01](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q01)

> **亮点**：可安装的默认配置减少手工接线；上游访谈和执行能力不属于桥自身。[Q01](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q01)

> **思考**：工具可见不等于后端可调用；动态解析使固定配置不能固定实际执行的引擎版本。[Q02](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q02) [Q03](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q03)

> **建议**：未验证假设：显示实际引擎版本及后端预检可减少首个访谈失败，须对照现有文档测误报和泄露。[Q05](../../plugins/q00--ouroboros--integrations-dsh-plugin/INSIGHT.md#research-q05)

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

<a id="plugin-1333787962-root"></a>

## [dsh-remote](../../plugins/flymysql--dsh-remote/INSIGHT.md)

[![GitHub ★ 222](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=222&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/flymysql/dsh-remote) [![npm 30d 36,398](https://img.shields.io/static/v1?label=npm+30d&message=36%2C398&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote)

> **用途**：维护SSH主机的开发者可在DSH中按会话操作远端代码与构建，合格结果是目标不串线、两端变更可回读且命令结果明确。

> **亮点**：[Q01](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q01)、[Q02](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q02) 会话镜像origin与可变当前机分离，并用三路状态提示冲突，使远程工作更可审阅。贡献是集成与身份组织，不能从工具数或协议声明推任务效果。

> **思考**：[Q03](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q03) workspace-write仅词法限制文件路径，任意远端命令仍按SSH账户权限执行；默认inherit在策略缺失/解析失败时会回退全权限。取消路径尝试SIGTERM后即可返回，文案“已停止”不证明远端子进程和副作用终止。

> **建议**：[Q05](../../plugins/flymysql--dsh-remote/INSIGHT.md#research-q05) 未验证假设是选择性内容回读与停止确认，补足现有size/mtime三路状态和取消信号的漏判；先排除等价实现，再比较漏判和网络/人工开销，无净收益不增加。

[查看完整分析](../../plugins/flymysql--dsh-remote/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1336677036-root"></a>

## [dsh-rewind](../../plugins/sirilee--dsh-rewind/INSIGHT.md)

[![GitHub ★ 225](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=225&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SiriLee/dsh-rewind) [![npm 30d 28,940](https://img.shields.io/static/v1?label=npm+30d&message=28%2C940&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rewind-plugin) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rewind-plugin)

> **用途**：在同一DSH会话探索方案的用户，可撤回错误轮次并选择恢复已跟踪文件，减少另建分支的切换。

> **亮点**：[Q01](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q01)、[Q02](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q02) 用追加标记保留原日志并改变模型/界面可见内容，结合消息锚定的轻量文件备份与影响预览，形成更连贯的探索退路。源码机制不能证明所有状态已恢复。

> **思考**：[Q02](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q02)、[Q03](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q03) 对话先重绕，文件可能跳过/失败；journal写入和rescue取得均可降级继续，无法无条件保证崩溃完整回滚。未跟踪、超限和关闭备份的历史仍有缺口。

> **建议**：[Q04](../../plugins/sirilee--dsh-rewind/INSIGHT.md#research-q04) 在已有预览与分类结果上研究可恢复等级，把覆盖、rescue完整性和journal持久化结果转成确认前决策，比较误继续与额外负担；尚未验证。

[查看完整分析](../../plugins/sirilee--dsh-rewind/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1335559646-root"></a>

## [dsh-trellis](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1264459640/dsh-trellis) [![npm 30d 2,737](https://img.shields.io/static/v1?label=npm+30d&message=2%2C737&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)

> **用途**：跨会话推进功能、缺陷或重构的 DSH 开发者可保存阶段产物与执行步骤，并在会话中查看当前任务。

> **亮点**：[Q01](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q01) 与 [Q02](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q02) 显示阶段文件、步骤及会话指针连接每轮提示，减少用户手工将状态重新放入会话的接线；这属于已有工作流的宿主适配。

> **思考**：[Q03](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q03) 的人工验证为工具输入字段，Git 超时等情况会放行；[Q04](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q04) 仅过滤指定工具，保留 shell，因此这些约束不能代替独立审批或写权限控制。

> **建议**：[Q06](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q06) 提出将独立验收收据绑定任务与代码提交并保留 Git 未知状态；这是未验证假设，需与现有 CI 及人工记录对照。

[查看完整分析](../../plugins/1264459640--dsh-trellis/INSIGHT.md) · [返回表格](#category-index)

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

## [Hindsight 编码 Agent 记忆集成](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md)

[![GitHub ★ 57,033](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=57%2C033&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vectorize-io/hindsight) [![npm 30d 62,152](https://img.shields.io/static/v1?label=npm+30d&message=62%2C152&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)

> **用途**：[Q01](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q01) 长期维护同一项目的编码用户希望跨会话召回正确的历史决策。

> **亮点**：[Q02](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q02) 自动把相关历史带入新一轮并写回对话，减少手工搬运；异步触发不代表记忆已保存。

> **思考**：[Q03](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q03) cwd 回退、失败开放与后台写回要求核对实际 bank 和服务状态，不能推断写回必然成功。

> **建议**：[Q04](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q04) 展示 bank 与来源时间并允许停用单条可能降低旧决策误用，需对照验证。

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

[![GitHub ★ 7,326](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C326&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/iPolloWork)

> **用途**：面向需要在项目中组织多个 Agent 会话和可编辑产物、并能独立验收结果的用户。

> **亮点**：[Q01](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q01) 与 [Q02](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q02) 表明独立工作台提供项目与 DSH 会话适配；上游引擎、模型和 DSH 子插件不归因于根应用。

> **思考**：[Q03](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q03) 订阅关闭、执行终态和产物验收是不同事实；已有媒体检查也不覆盖视觉和全部引擎。

> **建议**：[Q05](../../plugins/devin-axis--ipollowork/INSIGHT.md#research-q05) 假设跨引擎显示原生终态、产物版本和未知范围可降低误认完成；需对照已有媒体回执及人工方式，效果未验证。

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

<a id="plugin-1180401969-root"></a>

## [KimiX](../../plugins/sikao-engine--kimix/INSIGHT.md)

[![GitHub ★ 112](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=112&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Sikao-Engine/KimiX)

> **用途**：熟悉命令行的开发者可在受控工作区用模型辅助代码和文件任务，并自行核验结果。

> **亮点**：[Q01](../../plugins/sikao-engine--kimix/INSIGHT.md#research-q01) 和 [Q02](../../plugins/sikao-engine--kimix/INSIGHT.md#research-q02) 显示项目将命令行、SDK 和工具循环组合为脚本化代理工作流；实际效率和质量没有对照。

> **思考**：[Q03](../../plugins/sikao-engine--kimix/INSIGHT.md#research-q03) 的验证闸按调用分类且提醒有上限，不能证明测试成功；审批在 yolo 或 afk 下可自动通过。

> **建议**：[Q05](../../plugins/sikao-engine--kimix/INSIGHT.md#research-q05) 提出绑定检查结果与修改范围的未验证记录；若不减少误判或误拦过多则否定。

[查看完整分析](../../plugins/sikao-engine--kimix/INSIGHT.md) · [返回表格](#category-index)

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

## [LoopX for DSH](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md)

[![GitHub ★ 6,516](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C516&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/loopx-project/loopx)

> **用途**：已有 LoopX 目标且希望在同一 DSH 会话持续推进的用户；原办法为人工查询 heartbeat 并复制任务。[Q01](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q01)

> **亮点**：把 LoopX 权威准入接到 DSH 会话和 GoalBar，不把整仓目标引擎归于桥接包。[Q01](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q01) [Q02](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q02)

> **思考**：Pause 撤销待处理工作，但保留已 claimed/admitted 预约；界面停止状态不能证明当前轮或外部副作用停止。[Q03](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q03)

> **建议**：未验证假设：在 Pause 后明确显示剩余当前轮与已撤销的预约，可能减少用户误判；须对照已有 UI 验证延迟和错误。[Q05](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/loopx-project--loopx--packages-dsh-loopx-plugin/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 12,203](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12%2C203&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MemTensor/MemOS) [![npm 30d 8,572](https://img.shields.io/static/v1?label=npm+30d&message=8%2C572&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memtensor/memos-local-plugin) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memtensor/memos-local-plugin)

> **用途**：面向在 DSH 中反复处理项目并希望复用历史上下文的用户。

> **亮点**：[Q01](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q01) 至 [Q03](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q03) 显示将记忆召回与捕获接入 DSH 生命周期，提供有界失败回退和后台处理；并非已证明准确或节省时间。

> **思考**：[Q03](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q03) 的后台采集不保证下一轮可见；[Q04](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q04) 的基础轻量配置及数据流限制不能等同完整自动演化或绝对本地保密。

> **建议**：[Q06](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q06) 假设持久回合收据配合有界纠错等待，可减少过期记忆误引用；现有队列与 flush 不算新增，该方案尚未验证。

[查看完整分析](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 3,423](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C423&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GCWing/OpenBitFun)

> **用途**：开发者希望在选定主机运行长任务，从电脑或手机查看状态与处理审批。

> **亮点**：[Q01](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q01) 与 [Q02](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q02) 将多设备控制与主机事件投影组合；实际节时及恢复成功率未验证。

> **思考**：[Q03](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q03) 未知写入不能自动视为失败，[Q05](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q05) 文档对 Relay 部署存在冲突。

> **建议**：[Q06](../../plugins/gcwing--openbitfun/INSIGHT.md#research-q06) 假设可回读的持久操作收据能减少误判和重复写入，尚未实现或验证。

[查看完整分析](../../plugins/gcwing--openbitfun/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350419329-root"></a>

## [OrcaReplay](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md)

[![GitHub ★ 287](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=287&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Continuum-AI-Corp/OrcaReplay)

> **用途**：已有Agent故障调试需求的开发者可在隔离项目中记录模型请求、工具结果和文件变化，用于回放和分叉分析，详见 [Q01](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q01)。

> **亮点**：以外部代理、适配器及文件checkpoint组织同一份可读录制，再用匹配游标承接严格回放和新模型分叉；未匹配与近似匹配明确留痕，能帮助区分录制重现与新调用，见 [Q01](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q01) 和 [Q02](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q02)。

> **思考**：模型回放仍真实执行Agent工具，默认文件恢复也不撤销外部副作用；MCP原件与文件快照还有敏感内容边界。旧字节一致不能证明新模型更好，compare未提供verify时的pass也可能只代表进程退出成功，见 [Q02](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q02) 与 [Q03](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q03)。

> **建议**：可探索逐次列明模型、工具、文件与外部状态冻结范围的回放覆盖清单，把verify和覆盖共同作为模型比较资格。它尚未实现验证，同模型重复/跨模型/外部状态变化对照仍不能解释差异时应否定，见 [Q04](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1133901637-root"></a>

## [Ouroboros 规格先行引擎](../../plugins/q00--ouroboros/INSIGHT.md)

[![GitHub ★ 6,299](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C299&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)

> **用途**：面向任务目标较模糊、可以写出可执行验收条件并审查结果的软件开发者。

> **亮点**：[Q02](../../plugins/q00--ouroboros/INSIGHT.md#research-q02) 与 [Q03](../../plugins/q00--ouroboros/INSIGHT.md#research-q03) 展示评分门槛、规格和已执行证据的组合；不是验收、测试或模型审阅概念原创，也不保证需求正确。

> **思考**：[Q04](../../plugins/q00--ouroboros/INSIGHT.md#research-q04) 的共享项目检查需要验收项无关的不变量；实际执行和模型审阅仍无法证明检查覆盖全部业务承诺。

> **建议**：[Q06](../../plugins/q00--ouroboros/INSIGHT.md#research-q06) 提议以预先定义的隔离负样本检验检查对所选违例的区分力；现有逐项证据与模型对抗审阅是反证，覆盖收益和成本未验证。

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

[![GitHub ★ 413,586](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=413%2C586&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/rea) [![npm 30d 1,172,617](https://img.shields.io/static/v1?label=npm+30d&message=1%2C172%2C617&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)

> **用途**：具备逆向经验的开发者对有权检查的应用构建物开展分析，可以通过 CLI 或 MCP 请求工具；真实任务频率和收益仍缺材料。[Q01](../../plugins/morluto--rea/INSIGHT.md#research-q01)

> **亮点**：固定版本将来源身份、静态分析结果、覆盖和限制放入同一证据结构，并提供可保留的摘要视图；这是相对手工记录的机制增量，不证明解释正确。[Q02](../../plugins/morluto--rea/INSIGHT.md#research-q02) [Q03](../../plugins/morluto--rea/INSIGHT.md#research-q03)

> **思考**：证据哈希绑定输入与结果，无法证明对功能的推断正确；未选文件、动态路径和环境状态可改变结论，使用者仍须回查来源并进行必要对照。[Q03](../../plugins/morluto--rea/INSIGHT.md#research-q03)

> **建议**：未验证假设：在现有 Evidence 上增加功能主张的来源、未覆盖输入和反证清单，可能减少错误重实现，但会增加复核成本；同一批已知行为样本上比较正确率与总时间，若无改善或成本抵消则否定。[Q05](../../plugins/morluto--rea/INSIGHT.md#research-q05)

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

[![GitHub ★ 80,349](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=80%2C349&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ruvnet/ruflo) [![npm 30d 52,361](https://img.shields.io/static/v1?label=npm+30d&message=52%2C361&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow)

> **用途**：已有协调需求的开发者可以登记角色并组织模型调用；产物审查和业务验收仍由使用者负责。

> **亮点**：[Q02](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q02) 显示统一登记、模型调用与结果归档，以及中央策略接线；相对原生任务的净收益未知，登记不是已启动工作者。

> **思考**：[Q03](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q03) 显示 task 完成和终止是状态操作；[Q04](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q04) 的 schema 过滤也不是授权。不能把 API 成功、隐藏 schema 或状态终止当成产物验收和物理退出。

> **建议**：[Q06](../../plugins/ruvnet--ruflo/INSIGHT.md#research-q06) 提出分别保存登记、响应、工作者停止和独立验收收据的未验证假设；若人工清单或原工具小修足够则不增加新系统。

[查看完整分析](../../plugins/ruvnet--ruflo/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1441851226-root"></a>

## [See Now](../../plugins/saos-3624--dsh-see-now/INSIGHT.md)

[![GitHub ★ 334](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=334&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SAOS-3624/dsh-see-now) [![npm 30d 6,403](https://img.shields.io/static/v1?label=npm+30d&message=6%2C403&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-see-now) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-see-now)

> **用途**：需要让 DSH 复核界面操作过程的开发者，可以先用短视频给出一段有时间信息的视觉上下文。

> **亮点**：[Q01](../../plugins/saos-3624--dsh-see-now/INSIGHT.md#research-q01) 用一张有时间信息的拼图承载多个操作时点，降低对重复截图的依赖。

> **思考**：[Q03](../../plugins/saos-3624--dsh-see-now/INSIGHT.md#research-q03) 采集停止只作用于后续流程，已保存附件有自己的生命周期。

> **建议**：[Q05](../../plugins/saos-3624--dsh-see-now/INSIGHT.md#research-q05) 在同图预算下测试区域加权能否保留小面积关键信号。

[查看完整分析](../../plugins/saos-3624--dsh-see-now/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1146519069-root"></a>

## [See Wxapkg](../../plugins/leslie-sss--seewxapkg/INSIGHT.md)

[![GitHub ★ 128](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=128&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Leslie-SSS/seeWxapkg)

> **用途**：See Wxapkg 是独立自托管Web工具，不是DSH原生插件。它面向有权分析小程序编译包的开发者，把上传、类型识别、AppID解密、解包、结构归一、静态恢复、格式整理、检查及ZIP交付串成任务。输入是wxapkg和必要AppID，合格结果是有来源与缺口说明、可以继续阅读的恢复工程，不是原始源码或可运行保证。实际StartTask保存上传与一次性凭据、创建任务并入队，RunTask按阶段调用解密、解包、归一与恢复，再验证和打包。相对单独调用解包脚本，它增加任务状态、部分结果和报告；fallback明确来自wxappUnpacker，不能把第三方恢复能力归为原创。

> **亮点**：[Q01](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q01) 与[Q02](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q02) 将多阶段恢复、来源和不完整状态组织成可下载工程与报告；第三方fallback明确归属。

> **思考**：[Q02](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q02) 静态分数与completed不证明原工程语义等价；[Q03](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q03) 启用诊断样本时，partial/failed保留包与AppID至后台周期清理，不能承诺终态立即全删，停机或删除失败也可能延后。

> **建议**：[Q04](../../plugins/leslie-sss--seewxapkg/INSIGHT.md#research-q04) 以每项产物来源和缺口替代单总分决策，可能更容易识别不可运行的恢复结果，尚待用户对照。

[查看完整分析](../../plugins/leslie-sss--seewxapkg/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1215961903-root"></a>

## [sivtr](../../plugins/ariestar--sivtr/INSIGHT.md)

[![GitHub ★ 255](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=255&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ariestar/sivtr)

> **用途**：需要跨终端和 Agent 工作记录查找错误及上下文的开发者。

> **亮点**：[Q01](../../plugins/ariestar--sivtr/INSIGHT.md#research-q01) 和 [Q02](../../plugins/ariestar--sivtr/INSIGHT.md#research-q02) 统一工作记录并对 DSH 提供格式解析；效果未对照。

> **思考**：[Q03](../../plugins/ariestar--sivtr/INSIGHT.md#research-q03) DSH 不受 MCP 自动安装管理，日志采集和远程脱敏仍需核查权限与覆盖。

> **建议**：[Q05](../../plugins/ariestar--sivtr/INSIGHT.md#research-q05) 提出显示解析覆盖和截断信息，需对照现有界面与用户误判。

[查看完整分析](../../plugins/ariestar--sivtr/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1178833585-plugins-dsh"></a>

## [SkillHub for DSH](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md)

[![GitHub ★ 5,347](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C347&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iflytek/skillhub) [![npm 30d 1,055](https://img.shields.io/static/v1?label=npm+30d&message=1%2C055&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh)

> **用途**：在 DSH 中发现、安装并复用技能的用户；基线是手工查找、审阅与复制技能。[Q01](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q01)

> **亮点**：将目录、确认范围、安装回执和当前可用性衔接到 DSH；技能服务本身不归插件。[Q01](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q01) [Q02](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q02)

> **思考**：精确 Host/Client/Node 组合限制写入；回执或文件存在不等于当前技能可用，也不证明技能安全。[Q03](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q03)

> **建议**：未验证假设：在确认与当前可用性之间显示同一来源、版本和状态可降低误判；须对照现有诊断验证。[Q05](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/iflytek--skillhub--plugins-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1208725464-root"></a>

## [Skills-Link](../../plugins/shanliuling--skills-link/INSIGHT.md)

[![GitHub ★ 197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=197&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shanliuling/skills-link) [![npm 30d 78](https://img.shields.io/static/v1?label=npm+30d&message=78&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/skills-link) [![最新发布 2026-04-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-04-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/skills-link)

> **用途**：多AI App个人用户集中可信Skill；基线手工复制/ln/Git。合格结果需各App确见预期版本且原目录可恢复，不是路径数量。

> **亮点**：[Q01](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q01)与[Q02](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q02) 把多App路径发现、导入与跨平台链接组织起来，少维护多份Skill字节。成熟ln/Git不归原创，目录同步不证明Skill在各Agent正确生效。

> **思考**：[Q02](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q02) 创建失败不自动还原，reset可删除master并覆盖多backup，rollback实际hard reset；[Q03](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q03)普通start可pull/add/commit/push，共享writer与远端变更影响所有App。必须先外部备份/关Git试，不把同步当安全分发。

> **建议**：[Q04](../../plugins/shanliuling--skills-link/INSIGHT.md#research-q04)逐host Skill版本/工具条件和改后待复核提示可能减少静默回归；三类变更比较漏错/误阻断/审核成本，不改善即否定，尚未实现不计贡献。

[查看完整分析](../../plugins/shanliuling--skills-link/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1156210476-root"></a>

## [SpecFusion](../../plugins/wxkingstar--specfusion/INSIGHT.md)

[![GitHub ★ 76](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=76&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wxkingstar/SpecFusion)

> **用途**：面向反复对接中文开放平台的开发者，按平台、开发模式与关键词查接口并回读原文，见[Q01](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q01)、[Q02](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q02)把中文/API标识分词、平台与模式过滤、摘要到全文的查询入口组合起来，减少跨站组织资料的步骤。它不证明文档覆盖完整、始终最新或生成代码正确。

> **思考**：[Q03](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q03)发现last_updated可回退为入库时间，关键词只重排最多200候选而响应仍写共N条；未指定模式的去重键不含来源。自部署默认管理令牌和全接口监听还需显式配置，托管服务配置不能据此推断。

> **建议**：[Q05](../../plugins/wxkingstar--specfusion/INSIGHT.md#research-q05)提出未验证的上游日期、抓取时间、内容hash和覆盖缺口分离协议；相对已有来源链接增量在减少“最新/全部”的误述，以预置缺页和截断查询对照，负担更大或错误不降则否定。

[查看完整分析](../../plugins/wxkingstar--specfusion/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 191](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=191&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingminhua/dsh-connect-trae) [![npm 30d 20,364](https://img.shields.io/static/v1?label=npm+30d&message=20%2C364&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-trae) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-trae)

> **用途**：在 DSH 使用已登录 Trae 模型的人可评估按面板分离的供应商接入。

> **亮点**：[Q01](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md#research-q01) 把 Trae 模型输出接入 DSH 会话，并让面板选择固定到相应路由。

> **思考**：[Q03](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md#research-q03) 本机回环不代表凭据只读；部分账号操作会改写原应用存储。

> **建议**：[Q05](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md#research-q05) 用不含凭据的实际路由与账号标签检验能否减少计费误判。

[查看完整分析](../../plugins/dingminhua--dsh-connect-trae/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 3,786](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C786&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/foryourhealth111-pixel/Vibe-Skills)

> **用途**：面向拥有多个本地 Skill 并需组织多步骤、多交付物的 Agent 用户。

> **亮点**：[Q02](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q02) 将任务原文、阶段和受限重入接入核心，[Q03](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q03) 将 Skill 候选与执行证明分开；组织机制不代表捆绑 Skill 内容原创。

> **思考**：[Q03](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q03) 的选择与启动证明不能替代真实模块交付验收；[Q05](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q05) 作者测评不能直接外推至当前版本和 DSH。

> **建议**：[Q06](../../plugins/foryourhealth111-pixel--vibe-skills/INSIGHT.md#research-q06) 在用户授权、保留验收条件下合并低风险非必要确认，需对照现有轻任务例外验证遗漏决策和成本。

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

[![GitHub ★ 3,759](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C759&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Minglink/dsh-infinite-gen-5)

> **用途**：面向分析自有或获授权二进制、需要跨工具整理证据的逆向工程人员。

> **亮点**：[Q02](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q02) 将会话、目标证据和审批接入宿主工作流；原生反编译、仿真和调试仍依赖各引擎。

> **思考**：[Q03](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q03) 事后审计写入可能失败而操作仍保留，审批和有限 Undo 不保证隔离或完全撤销；[Q04](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q04) 非审批静态入口也可能写文件。

> **建议**：[Q06](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md#research-q06) 提出操作前预留持久请求记录，故障时保留未知状态并人工对照；不可假定跨外部动作原子性，收益需故障注入验证。

[查看完整分析](../../plugins/minglink--dsh-infinite-gen-5/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1415863200-root"></a>

## [模型接力](../../plugins/airisey--dsh-model-failover/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Airisey/dsh-model-failover)

> **用途**：已有多个provider的DSH用户在额度/短时故障下推进可回滚任务，以正确产物和总成本验收，不以吐字/绿数/继续次数当完成。见[Q01](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q01)。

> **亮点**：以可见输出提交点约束一次调用内的静默混流，把候选选择、真实调用和会话×模板隔离组织为恢复机制；可借鉴的是边界与接线，不是已证明任务正确率或工具事务恢复。见[Q02](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q02)。

> **思考**：已提交内容后的抛错/idle可能没有补错误finish却记good；enabled只缩候选仍可重试首模型，全局继续默认独立开启且等待后不重读开关。可见提交、停止与业务办结不能互相替代，源码条件未作运行复现，见[Q02](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q02)、[Q03](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q03)。

> **建议**：先修终态/开关/待补与空probe等具体语义，再用宿主工具回执/未决摘要约束恢复，比较小修补、关继续和人工查询；若无重复动作/纠错成本净改善就否定独立方向。尚未实现/验证，见[Q05](../../plugins/airisey--dsh-model-failover/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/airisey--dsh-model-failover/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333141598-root"></a>

## [鲸屿 Whale Isle](../../plugins/chisaalter--whaleisle/INSIGHT.md)

[![GitHub ★ 200](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=200&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ChisaAlter/WhaleIsle)

> **用途**：希望同窗口完成DSH对话与文件/终端/Git的桌面用户。

> **亮点**：[Q01](../../plugins/chisaalter--whaleisle/INSIGHT.md#research-q01)、[Q02](../../plugins/chisaalter--whaleisle/INSIGHT.md#research-q02)桌面统一生命周期、独立home与真实Host准入协调，基础Agent继承上游。

> **思考**：[Q03](../../plugins/chisaalter--whaleisle/INSIGHT.md#research-q03)排空注册操作非业务任务结束，force更新/退出deadline可继续；未知远端结果不能当取消成功。

> **建议**：[Q04](../../plugins/chisaalter--whaleisle/INSIGHT.md#research-q04)将已有forced/pending诊断形成重开待对账收据可探索，日志同效或提示误导即否定。

[查看完整分析](../../plugins/chisaalter--whaleisle/INSIGHT.md) · [返回表格](#category-index)

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-11-05
