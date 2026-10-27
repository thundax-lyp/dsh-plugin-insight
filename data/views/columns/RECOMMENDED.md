# 推荐尝试

[返回首页](../../../README.md)

> 从用途、实际增量和试用条件中，找到值得继续了解的插件。

<a id="column-index"></a>

**快速比较**

> 表格与下方说明按相同顺序排列；点击插件名跳转到本页说明。

| 插件 | 主要用途 | 适用人群与推荐增量 | 采&#8288;用&#8288;建&#8288;议 |
| --- | --- | --- | --- |
| [Answer me with HTML](#plugin-1401476500-root) | 将Agent撰写的扩展Markdown转换为含图表的单文件HTML页面，并提供可选视频输出。 | 需要交付协议解释或多维比较页面的Agent用户可用已核实短稿试生成单文件HTML。相比手写HTML，源码支持将布局和图坐标交给CLI，作者节时结果尚未在当前任务复现。若图形误导、渲染反复失败或纠错慢于Markdown，应关闭自动附页并退回原草稿。 | 建&#8288;议&#8288;试&#8288;用 |
| [no-ai-style](#plugin-1418493685-root) | 提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 | 适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-plugin-veriscope](#plugin-1422943787-root) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-markdown-live](#plugin-1426477683-root) | 在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。 | Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-nav-history](#plugin-1429464857-root) | 为 DSH 会话与整页面板提供后退、前进、历史底栏和本地持久化。 | 适合频繁跨会话面板的人先核对交错导航与持久化后试用，接受历史记录可能失效及不恢复滚动的边界。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-wsl-browser](#plugin-1350379388-root) | 从 WSL 调用 Windows 默认浏览器打开经过协议校验的网页地址。 | 频繁从 WSL 打开网页的用户可试用；把浏览器页面可见而非 PowerShell 返回作为验收。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-wsl-cal](#plugin-1381860995-root) | 把本机 khal 日历以只读状态、今日和未来日程工具暴露给 DSH。 | 已稳定使用 khal 且只需只读日程的 WSL 用户可试用；必须验证时区和同步陈旧边界。 | 建&#8288;议&#8288;试&#8288;用 |
| [WeKnora DSH 插件](#plugin-1024118326-packages-dsh-weknora) | 为 DeepSeek Harness 提供 WeKnora 知识库检索、文档阅读及带引用的问答。 | 已有可用WeKnora及受限密钥的团队可试用按知识库检索并回读组织文档。相比切换网页或手写接口，源码支持把段落与全文用文档标识串接，实际准确率和节时未测。出现范围越界、引用无法回读或正文截断影响结论时应停止推断并回WeKnora原界面核查。 | 建&#8288;议&#8288;试&#8288;用 |
| [EverOS](#plugin-1085086903-root) | 以Markdown为真相源的本地优先记忆运行时，同步SQLite/LanceDB索引并支持用户与Agent记忆。 | 单用户非敏感memory root先关闭reflection建立基线，验收纠错/索引/取消和恢复后再决定扩展。 | 建&#8288;议&#8288;试&#8288;用 |
| [OpenViking DSH Memory](#plugin-1128123594-examples-dsh-memory-plugin) | 为 DeepSeek Harness 接入 OpenViking 的跨会话记忆、上下文检索和技能访问。 | 已有OpenViking服务且能配置独立身份的DSH用户，可在脱敏项目试用跨会话事实捕获与召回。相比每轮手选Markdown上下文，源码支持事件捕获、提交和后续注入，减少搬运尚未实测。若召回其他项目事实、事实无法纠正或pending持续失败，停止自动注入并退回人工维护项目说明，同时核对服务器与本地队列。 | 建&#8288;议&#8288;试&#8288;用 |
| [OpenViking](#plugin-1128123594-root) | 以虚拟文件系统组织 Agent 的知识、记忆与技能，提供分层读取、语义检索和会话沉淀。 | 对知识密集团队有明确试用路径，但当前效果与运维成本需专项对照。 | 建&#8288;议&#8288;试&#8288;用 |
| [OMA for DeepSeek Harness](#plugin-1145914675-integrations-dsh) | 将OMA项目Skill与验证钩子接入DSH，支持自动项目准备、工具前后检查及有限停止跟进。 | 已有或愿意维护OMA项目规则的DSH开发者，可在项目副本试工具前检查桥。相比只读Skill再人工检查，它把规则接到真实工具决策，收益仍需统计误拒绝与任务结果。持续误拒绝、关键动作不覆盖或Stop结束被误当通过时，停用桥并回到人工运行检查。 | 建&#8288;议&#8288;试&#8288;用 |
| [Archify](#plugin-1211139949-root) | 将需求、代码关系和解释内容组织成交互式图表及单页 HTML。 | 适合愿意核查来源的开发者在单一架构路径试用；自动门禁不替代语义审核。 | 建&#8288;议&#8288;试&#8288;用 |
| [OpenDesign](#plugin-1223170290-root) | 协作AI设计工作区，把设计系统、Agent生成、预览与团队反馈组织在同一项目。 | 本地非敏感小项目可控试用，先核验DSH版本/预览/取消，协作与设计收益单独测。[Q04](../../plugins/nexu-io--open-design/INSIGHT.md#research-q04) | 建&#8288;议&#8288;试&#8288;用 |
| [BrowserSkill DSH 插件](#plugin-1276665883-packages-dsh-plugin-browserskill) | 为 DeepSeek Harness 提供 BrowserSkill 浏览器工具、任务预览与截图展示。 | 已有BrowserSkill CLI和已连接扩展的DSH用户，可在非敏感网页试用人工监督的读取与截图核对。相比在终端单独调用bsk再搬回结果，源码支持模型工具、任务预览和截图呈现，减少交接属于推断。若context失效、观察与页面不符或取消后任务不收敛，停止后续动作并退回浏览器人工检查，不把队列当业务回滚。 | 建&#8288;议&#8288;试&#8288;用 |
| [@indexyz/dsh-autocompact](#plugin-1324229194-dsh-autocompact) | 为Harness按会话与模型配置提前自动压缩阈值，提供持久设置和输入区状态显示。 | 单route会话覆盖可控且有明确回默认路径，需同时核语义和全部摘要成本。 | 建&#8288;议&#8288;试&#8288;用 |
| [LogicProbe](#plugin-1331586818-root) | 为 DSH 提供状态机、数据模型、结构、并发线索和 UML 检查工具与 Skill。 | 能人工核对源码与模型对应关系的开发者可试用小型协议状态机检查。相比模型口头认可，源码提供可重复判决、反例和预算未决信息，但真实缺陷发现率与建模收益未测。缺失关键转移、结果undecided或语义超出支持范围时，应停止放行并补建模型或退回专业检查器与人工审查。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-git-graph](#plugin-1331636953-packages-dsh-git-graph) | 在 DSH 界面显示 Git 分支与提交图，并管理独立 worktree 和新会话工作区。 | 已有Git基础且使用兼容DSH的开发者，可在临时仓库试用为并行任务创建worktree并打开对应新会话。相比终端创建后再手工登记工作区，源码支持把分支、checkout与DSH工作区串接，减少交接步骤仍属推断。若新会话cwd或分支不符、注册失败或清理遇到未提交内容，停止操作并用git worktree list及终端核对保留现场后恢复。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-plugin-manager](#plugin-1331636953-packages-dsh-plugin-manager) | 在 DSH 官方插件页检查更新与宿主兼容，并通过官方通道或本机网关管理插件生命周期。 | 使用兼容DSH且可备份临时profile的本机用户，可试用单个npm插件更新后手动重启并核对核心功能。相比逐个查npm和执行CLI，源码支持版本比较、写入结果回读与部分失败回退，便利尚未实测。若profile或版本不符、重启加载失败或回滚报错，停止后续更新并恢复备份，退回官方插件管理器或CLI处理。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-skill-explorer](#plugin-1331636953-packages-dsh-skill-explorer) | 在 DSH 中按来源浏览、创建、编辑和导入 Skill，并提供文件启用标记与回收站管理。 | 已有DSH且需要维护多个普通文件型Skill的用户，可在目录备份后试用集中创建、导入和编辑。相比逐个进入项目与用户目录，源码支持按来源集中定位并核对写入对象，节省切换属于推断。若来源不完整、目标路径不符或需要保证模型撤权，停止面板写入并恢复备份、改用文件编辑和目标会话官方Skill目录核查。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-stock-market](#plugin-1331846104-root) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。 | 建&#8288;议&#8288;试&#8288;用 |
| [DeepSeek Harness](#plugin-1333065091-root) | 基于Cordis插件组合的开源Agent运行宿主，提供会话、工具与多应用入口。 | 隔离profile适合有扩展需求的开发者验证可替换契约，未证明生产安全或所有插件兼容。[Q04](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q04) | 建&#8288;议&#8288;试&#8288;用 |
| [DSH Vision Toolkit](#plugin-1333100071-root) | 在DSH会话中接入图像问答、OCR、定位、截图差异和视觉产物。 | 使用文字模型的DSH开发者可先拿非敏感截图做定位或差异检查。相比另开视觉工具再搬运结果，插件把图像证据与产物带回同一会话，这项便利有源码支持但节时未实测。若图像不能出网或坐标核对不可靠，就停止自动动作并退回人工或原生应用接口。 | 建&#8288;议&#8288;试&#8288;用 |
| [DSH Turn Rewind](#plugin-1333100390-root) | 为DSH消息提供文件检查点、变更预览、选择恢复及会话重新开始。 | 反复让Agent修改同一工作目录的开发者可在副本试用消息锚定文件恢复。相比手工对齐Git恢复与新会话，源码支持把预览、救援点及重新开始串联，节时尚未实测。若预览漏掉目标路径、检查点缺失或回滚报错，应停止写回并保留救援材料，退回独立备份或手工Git恢复。 | 建&#8288;议&#8288;试&#8288;用 |
| [DSH Computer Use](#plugin-1333116579-root) | 为DSH提供macOS原生应用观察、语义操作和定向输入能力。 | 需要操作无API原生应用的macOS开发者可先试可丢弃表单或编辑任务。相比临时坐标脚本，插件用观察、租约和确认约束动作，但办结率尚未实测。若应用状态无法可靠观察或操作不可逆，就停止自动重放并改用人工或专用接口。 | 建&#8288;议&#8288;试&#8288;用 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root) | 监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。 | 需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-verification-receipt](#plugin-1333370288-root) | 被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。 | 被动最小字段与边界文档清楚，适合精确宿主私有单进程路径观察；词法/可重算hash与无界queue不适合验证门禁或强审计。 | 建&#8288;议&#8288;试&#8288;用 |
| [DSH Market](#plugin-1333807290-root) | 在DSH内浏览社区插件，管理安装、更新、分组、备份与诊断。 | 维护多个社区插件的DSH用户可先在克隆profile中试用安装和备份流程。相比分散CLI操作，市场加入加载校验和状态对账，但维护节时与全故障恢复未实测。若无法备份恢复或宿主鉴权版本不明，就停止修改主profile并退回原生Discover与人工维护。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-context](#plugin-1333961389-root) | 展示DSH上下文组成、请求趋势、事件与会话网络，提供诊断视图和提示前后缀配置。 | 需要定位长会话上下文膨胀的DSH用户，可在匹配宿主并保持空提示前后缀时核对单个请求。相比原生token环或手查日志，源码支持从总量跳到请求组成和来源，诊断节时尚未实测。若出现版本fallback、冷读无数据或裁剪/估算无法解释，应停止完整审计用途并退回宿主日志和供应商usage。 | 建&#8288;议&#8288;试&#8288;用 |
| [@awiki/dsh-plugin](#plugin-1334428397-root) | 将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 | 已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-mermaid](#plugin-1334569498-root) | 在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。 | 经常在DSH阅读流程图的用户可保持严格模式和大小限制试用小型Mermaid就地渲染。相比复制到独立渲染器，源码支持同页展示、放大并保留源码，理解效率未测。出现页面卡顿、源码与图不符或需要AI修复时，应保留草稿并退回复制源码到独立工具，不直接点击自动发送。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-plugin-tts](#plugin-1334773156-root) | 为DSH Web消息提供手动与自动朗读，支持Edge、Cloud及多种本地音色和长文本分块播放。 | 需要听取助手回答的DSH Web用户可先用单一Edge后端试用非敏感消息朗读。相比复制到独立TTS工具，源码把消息归属、播放和停止接在同一界面，完整朗读率与节时未测。发生未经确认的文本外发、持续漏段或停止失效时，应停用插件并退回系统朗读或单一受信语音服务。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-read-url](#plugin-1335047324-root) | 读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。 | 经常读取公开网页资料且能核对原文的DSH用户，可在网络权限明确的profile中试用批次正文提取。相对逐页fetch和手工清理HTML，源码分析支持统一去噪、分片续读与批次异常隔离，但未实测节时或信息完整率。出现关键事实缺失、分页不完整或网络回退不符合预期时停止使用该结果，退回原页面或受控浏览器核查。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。 | 开放发现和预检有明确价值，能备份并使用guard路径的维护者可在可丢弃profile试用；早commit与运行验收缺口不支持持续安装结论。详见[Q07](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md#research-q07)。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-web-tools](#plugin-1335219884-root) | 为DSH提供多供应商网页搜索与抓取，以及小红书和X浏览器来源接入。 | 公开资料检索有具体价值和小范围试用路径；需核来源、全文/截断和真实支出，不能把可用性当完整性保证。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-md-annotator](#plugin-1335286261-root) | 在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。 | 适合已有Better Sidebar且文稿有备份的用户试用；保存源码、导出批注并核对报告所属会话，刷新前防丢稿。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-permissions](#plugin-1335349535-root) | 在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。 | 需要细粒度工具门禁的团队可在保留宿主沙箱前提下试用，并先验证路径旁路与规则回滚。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-verify](#plugin-1335843750-root) | 执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。 | 能审读测试步骤的网页开发者，可在可信本地构建上试用浏览器交互断言与已批准截图基线。相对每次手写Playwright工程，源码分析支持统一动作描述和HTML记录，但PASS只覆盖已写断言且首次截图只是创建基线。必要断言未执行、基线未经批准或宿主被同步调用阻塞时停止自动放行，退回直接Playwright和人工需求验收。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-openai-oauth](#plugin-1335992154-root) | 为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。 | 本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。详见[Q06](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md#research-q06)。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-message-copy-enhance](#plugin-1337978261-root) | 将助手消息选区复制为 Markdown，恢复链接、LaTeX 源码和代码围栏。 | 经常将技术回答片段摘入Markdown的Web用户可在常用编辑器先试单条消息内的链接、公式和代码，并核对源文；不用于逐字原稿归档或跨消息选区。若符号、URL或换行静默丢失，禁用并回原消息复制。 | 建&#8288;议&#8288;试&#8288;用 |
| [@yolk_vat-y/dsh-project-memory](#plugin-1339316901-root) | 为DSH项目持久保存任务、文档、代码符号与经验，支持检索和自动上下文注入。 | 反复接续同一非敏感项目的开发者可备份存储后试用任务记忆检索与按需注入。相比手写任务笔记再搜索文件，源码支持把任务、经验和出处关联，实际接续正确率与token节省未测。出现跨项目内容、无依据指令或保存状态不明时，应暂停注入并回源码及人工任务笔记核查。 | 建&#8288;议&#8288;试&#8288;用 |
| [KRouter](#plugin-1341648244-root) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-thumb](#plugin-1341694685-root) | 将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。 | 适合愿意自行维护的个人窄屏DSH用户受控试用，先核对列定位、设置与轨迹交互并保留关闭重载路径；不把免hash当免维护。 | 建&#8288;议&#8288;试&#8288;用 |
| [J-Space Cognition Suite DSH适配](#plugin-1344270011-root) | 将J-Space问题拆解、持久控制器和工作区账本作为DSH Agent预设接入。 | 已用兼容DSH且愿意维护证据记录的开发者，可先在单Agent复杂工程任务中试用J-Space预设。相对原生todos加普通文档，源码分析支持来源hash、报告轮次和失效复核记录，但它是合作协议而非自动强制门禁。来源变更后结论未复核、控制器未被调用或账本状态无法解释时停止依赖其放行，退回原生任务板和人工证据审阅并保留账本。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-api-dashboard](#plugin-1346196699-root) | 在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。 | 使用多平台API的单用户可在审阅密钥接收方后试用余额与会话估算看板。相比切各平台控制台和手算token，源码支持同页汇总及旧数据提示，实际对账精度和节费未测。未知模型套默认价、旧余额被当实时或密钥去向不符时，应停止预算判断并回官方控制台，不用自更新修复账单问题。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-wsl-open](#plugin-1347958944-root) | 让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。 | 适合个人本地WSL办公文件流程试用；仅打开可信文件，核对宿主路由权限和真实窗口结果。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-cap-profile](#plugin-1349267122-root) | 扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。 | 适合将其作为本地日志排查索引试用，先核对真实数据和模型归因，不据错误率直接做能力排名。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz) | 解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。 | 对已有 CapMap 文档的团队有清晰只读导航价值，但必须把图视为声明并回查原文。 | 建&#8288;议&#8288;试&#8288;用 |
| [dsh-usage-analytics](#plugin-1356960582-root) | 在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。 | 适合本机个人用户对小样本受控试用并核对用量字段和索引状态；不作账单、技能成果成功率或多人权限保证。 | 建&#8288;议&#8288;试&#8288;用 |

<a id="plugin-1401476500-root"></a>

## [Answer me with HTML](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md)

**主要用途**：将Agent撰写的扩展Markdown转换为含图表的单文件HTML页面，并提供可选视频输出。

**采用建议**：建议试用

**适用人群与推荐增量**：需要交付协议解释或多维比较页面的Agent用户可用已核实短稿试生成单文件HTML。相比手写HTML，源码支持将布局和图坐标交给CLI，作者节时结果尚未在当前任务复现。若图形误导、渲染反复失败或纠错慢于Markdown，应关闭自动附页并退回原草稿。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：需要在协议或方案比较中交付单页材料的用户，可先选一份已有答案的短稿试渲染，并逐个核对图形关系与原文。若组件错误、图形误导或纠错时间超过直接Markdown，停止自动附页并回到原草稿；敏感文件不因可内联就自动加入输出。视频仅在明确请求且成本可接受时另试。 依据 [Q09](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q09)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 4,422](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C422&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/QingYunA/answer-me-with-html)

[返回索引](#column-index)

<a id="plugin-1418493685-root"></a>

## [no-ai-style](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

**主要用途**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。

**采用建议**：建议试用

**适用人群与推荐增量**：适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：作者留原文并逐命题复核的可控范围试用，先audit再授权编辑。详见[Q05](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md#research-q05)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01NGVI-QINGYI/no-ai-style)

[返回索引](#column-index)

<a id="plugin-1422943787-root"></a>

## [dsh-plugin-veriscope](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

**主要用途**：重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。

**采用建议**：建议试用

**适用人群与推荐增量**：已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。详见[Q06](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q06)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-veriscope)

[返回索引](#column-index)

<a id="plugin-1426477683-root"></a>

## [dsh-markdown-live](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md)

**主要用途**：在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。

**采用建议**：建议试用

**适用人群与推荐增量**：Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：经常写 Markdown 且能接受表格/图片限制的 DSH Desktop 用户可在非关键草稿试用；先复制带中英混排、列表、链接和代码围栏的固定样本，校验发送前后字节与撤销。依赖无障碍输入、超长文档或宿主版本频繁升级的人应先观察。 详见[Q09](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q09)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9426Haruka/dsh-markdown-live)

[返回索引](#column-index)

<a id="plugin-1429464857-root"></a>

## [dsh-nav-history](../../plugins/ahacrazy--dsh-nav-history/INSIGHT.md)

**主要用途**：为 DSH 会话与整页面板提供后退、前进、历史底栏和本地持久化。

**采用建议**：建议试用

**适用人群与推荐增量**：适合频繁跨会话面板的人先核对交错导航与持久化后试用，接受历史记录可能失效及不恢复滚动的边界。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：先用普通会话和面板交错导航，检查后退后新访问的分支截断、重载和失效目标；只把它当主视图位置入口。记录不稳定时回侧栏手动查找。[Q03](../../plugins/ahacrazy--dsh-nav-history/INSIGHT.md#research-q03)

**试用方法、成本与证据**：[查看完整分析](../../plugins/ahacrazy--dsh-nav-history/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。



[返回索引](#column-index)

<a id="plugin-1350379388-root"></a>

## [dsh-wsl-browser](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md)

**主要用途**：从 WSL 调用 Windows 默认浏览器打开经过协议校验的网页地址。

**采用建议**：建议试用

**适用人群与推荐增量**：频繁从 WSL 打开网页的用户可试用；把浏览器页面可见而非 PowerShell 返回作为验收。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：适合频繁从 WSL 打开文档或本地服务、且只需要“打开”而非抓取/交互的用户试用。成功标准是 http(s) 非法输入全部拒绝、目标页在预定秒数内可见且 localhost 失败能按提示恢复；如果命令返回成功但页面不可见率高，应退回复制链接或专门端口工具。 [Q09](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md#research-q09)

**试用方法、成本与证据**：[查看完整分析](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-browser)

[返回索引](#column-index)

<a id="plugin-1381860995-root"></a>

## [dsh-wsl-cal](../../plugins/173787247--dsh-wsl-cal/INSIGHT.md)

**主要用途**：把本机 khal 日历以只读状态、今日和未来日程工具暴露给 DSH。

**采用建议**：建议试用

**适用人群与推荐增量**：已稳定使用 khal 且只需只读日程的 WSL 用户可试用；必须验证时区和同步陈旧边界。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：适合已经稳定使用 khal、只需代理读取日程的 WSL 用户试用；需要创建、修改、提醒或同步保证的人不适用。成功标准是 status 能暴露配置问题、today/list 与 khal 在事件数和时间上一致、陈旧同步被用户识别；出现时区偏移或遗漏时应停止将输出用于自动计划。 [Q09](../../plugins/173787247--dsh-wsl-cal/INSIGHT.md#research-q09)

**试用方法、成本与证据**：[查看完整分析](../../plugins/173787247--dsh-wsl-cal/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-cal)

[返回索引](#column-index)

<a id="plugin-1024118326-packages-dsh-weknora"></a>

## [WeKnora DSH 插件](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md)

**主要用途**：为 DeepSeek Harness 提供 WeKnora 知识库检索、文档阅读及带引用的问答。

**采用建议**：建议试用

**适用人群与推荐增量**：已有可用WeKnora及受限密钥的团队可试用按知识库检索并回读组织文档。相比切换网页或手写接口，源码支持把段落与全文用文档标识串接，实际准确率和节时未测。出现范围越界、引用无法回读或正文截断影响结论时应停止推断并回WeKnora原界面核查。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：已有 WeKnora 的团队可先用受限库和 retrieve key 试用搜索、读文档，再决定是否开放 ask；核对会话保存和额外模型消耗。[Q04](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q04)

**试用方法、成本与证据**：[查看完整分析](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 35,257](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C257&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora) [![npm 30d 4,785](https://img.shields.io/static/v1?label=npm+30d&message=4%2C785&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)

[返回索引](#column-index)

<a id="plugin-1085086903-root"></a>

## [EverOS](../../plugins/evermind-ai--everos/INSIGHT.md)

**主要用途**：以Markdown为真相源的本地优先记忆运行时，同步SQLite/LanceDB索引并支持用户与Agent记忆。

**采用建议**：建议试用

**适用人群与推荐增量**：单用户非敏感memory root先关闭reflection建立基线，验收纠错/索引/取消和恢复后再决定扩展。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：有限试用单用户非敏感记忆，先关reflection测人工笔记基线，再验证纠错、删除、重建与断连；DSH适配单独验收。见 [Q05](../../plugins/evermind-ai--everos/INSIGHT.md#research-q05)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/evermind-ai--everos/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 13,600](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13%2C600&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/EverOS)

[返回索引](#column-index)

<a id="plugin-1128123594-examples-dsh-memory-plugin"></a>

## [OpenViking DSH Memory](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md)

**主要用途**：为 DeepSeek Harness 接入 OpenViking 的跨会话记忆、上下文检索和技能访问。

**采用建议**：建议试用

**适用人群与推荐增量**：已有OpenViking服务且能配置独立身份的DSH用户，可在脱敏项目试用跨会话事实捕获与召回。相比每轮手选Markdown上下文，源码支持事件捕获、提交和后续注入，减少搬运尚未实测。若召回其他项目事实、事实无法纠正或pending持续失败，停止自动注入并退回人工维护项目说明，同时核对服务器与本地队列。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：[Q06](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q06) 建议已有服务的用户在脱敏仓库试用，先确认 peer 与纠错路径，再比较总负担；不把源码接线当作当前宿主运行通过。

**试用方法、成本与证据**：[查看完整分析](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 40,712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C712&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking) [![npm 30d 34,730](https://img.shields.io/static/v1?label=npm+30d&message=34%2C730&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)

[返回索引](#column-index)

<a id="plugin-1128123594-root"></a>

## [OpenViking](../../plugins/volcengine--openviking/INSIGHT.md)

**主要用途**：以虚拟文件系统组织 Agent 的知识、记忆与技能，提供分层读取、语义检索和会话沉淀。

**采用建议**：建议试用

**适用人群与推荐增量**：对知识密集团队有明确试用路径，但当前效果与运维成本需专项对照。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：[Q06](../../plugins/volcengine--openviking/INSIGHT.md#research-q06) 建议可承担服务维护的知识团队试用，以可追溯原文和任务正确率验收；少量静态资料仍可用简单文件方案。

**试用方法、成本与证据**：[查看完整分析](../../plugins/volcengine--openviking/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 40,712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C712&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking)

[返回索引](#column-index)

<a id="plugin-1145914675-integrations-dsh"></a>

## [OMA for DeepSeek Harness](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md)

**主要用途**：将OMA项目Skill与验证钩子接入DSH，支持自动项目准备、工具前后检查及有限停止跟进。

**采用建议**：建议试用

**适用人群与推荐增量**：已有或愿意维护OMA项目规则的DSH开发者，可在项目副本试工具前检查桥。相比只读Skill再人工检查，它把规则接到真实工具决策，收益仍需统计误拒绝与任务结果。持续误拒绝、关键动作不覆盖或Stop结束被误当通过时，停用桥并回到人工运行检查。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：[Q04](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q04)建议规则维护者在项目副本固定版本，先用允许与拒绝两个工具检查，必要时先关autoSetup手工审查模板。把pre阻断、post反馈和有限Stop分开验收；误拒绝持续或未解决被误放行时，停用桥并回人工检查。

**试用方法、成本与证据**：[查看完整分析](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 1,354](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C354&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/first-fluke/oh-my-agent)

[返回索引](#column-index)

<a id="plugin-1211139949-root"></a>

## [Archify](../../plugins/tt-a1i--archify/INSIGHT.md)

**主要用途**：将需求、代码关系和解释内容组织成交互式图表及单页 HTML。

**采用建议**：建议试用

**适用人群与推荐增量**：适合愿意核查来源的开发者在单一架构路径试用；自动门禁不替代语义审核。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：先选一条熟悉的请求链，检查关系、来源与HTML交付，再决定扩大；无法承担源码复核时先保留简单图。[Q04](../../plugins/tt-a1i--archify/INSIGHT.md#research-q04)

**试用方法、成本与证据**：[查看完整分析](../../plugins/tt-a1i--archify/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 88,446](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=88%2C446&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify)

[返回索引](#column-index)

<a id="plugin-1223170290-root"></a>

## [OpenDesign](../../plugins/nexu-io--open-design/INSIGHT.md)

**主要用途**：协作AI设计工作区，把设计系统、Agent生成、预览与团队反馈组织在同一项目。

**采用建议**：建议试用

**适用人群与推荐增量**：本地非敏感小项目可控试用，先核验DSH版本/预览/取消，协作与设计收益单独测。[Q04](../../plugins/nexu-io--open-design/INSIGHT.md#research-q04)

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：熟悉Agent/设计系统者可本地非敏感brief试用，先确认DSH版本和预览/取消，云分享与数据范围另验收。[Q04](../../plugins/nexu-io--open-design/INSIGHT.md#research-q04)

**试用方法、成本与证据**：[查看完整分析](../../plugins/nexu-io--open-design/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 103,910](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=103%2C910&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nexu-io/open-design)

[返回索引](#column-index)

<a id="plugin-1276665883-packages-dsh-plugin-browserskill"></a>

## [BrowserSkill DSH 插件](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md)

**主要用途**：为 DeepSeek Harness 提供 BrowserSkill 浏览器工具、任务预览与截图展示。

**采用建议**：建议试用

**适用人群与推荐增量**：已有BrowserSkill CLI和已连接扩展的DSH用户，可在非敏感网页试用人工监督的读取与截图核对。相比在终端单独调用bsk再搬回结果，源码支持模型工具、任务预览和截图呈现，减少交接属于推断。若context失效、观察与页面不符或取消后任务不收敛，停止后续动作并退回浏览器人工检查，不把队列当业务回滚。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：已用 DSH Web 的用户可从只读网页或测试表单试用，先核对 CLI 和扩展版本、技能显露、任务预览及结束清理，再扩展到实际工作流。[Q04](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q04)

**试用方法、成本与证据**：[查看完整分析](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 9,474](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C474&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/BrowserSkill) [![npm 30d 27,866](https://img.shields.io/static/v1?label=npm+30d&message=27%2C866&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin)

[返回索引](#column-index)

<a id="plugin-1324229194-dsh-autocompact"></a>

## [@indexyz/dsh-autocompact](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md)

**主要用途**：为Harness按会话与模型配置提前自动压缩阈值，提供持久设置和输入区状态显示。

**采用建议**：建议试用

**适用人群与推荐增量**：单route会话覆盖可控且有明确回默认路径，需同时核语义和全部摘要成本。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：熟悉原生压缩的开发者可单route试用，保留原生对照并检查摘要与关键约束；不要按pill猜有效覆盖，不把off当关闭宿主溢出恢复。任务质量变差或总成本上升时回默认。参见[Q06](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md#research-q06)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 804](https://img.shields.io/static/v1?label=npm+30d&message=804&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)

[返回索引](#column-index)

<a id="plugin-1331586818-root"></a>

## [LogicProbe](../../plugins/amethystluna--logicprobe/INSIGHT.md)

**主要用途**：为 DSH 提供状态机、数据模型、结构、并发线索和 UML 检查工具与 Skill。

**采用建议**：建议试用

**适用人群与推荐增量**：能人工核对源码与模型对应关系的开发者可试用小型协议状态机检查。相比模型口头认可，源码提供可重复判决、反例和预算未决信息，但真实缺陷发现率与建模收益未测。缺失关键转移、结果undecided或语义超出支持范围时，应停止放行并补建模型或退回专业检查器与人工审查。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：适合愿意人工检查模型的开发者在小型状态机上试用。先核对模型与源码关系，读取verdict、覆盖和未决，不把pass当上线许可。[Q04](../../plugins/amethystluna--logicprobe/INSIGHT.md#research-q04)

**试用方法、成本与证据**：[查看完整分析](../../plugins/amethystluna--logicprobe/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 2,723](https://img.shields.io/static/v1?label=npm+30d&message=2%2C723&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe)

[返回索引](#column-index)

<a id="plugin-1331636953-packages-dsh-git-graph"></a>

## [dsh-git-graph](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md)

**主要用途**：在 DSH 界面显示 Git 分支与提交图，并管理独立 worktree 和新会话工作区。

**采用建议**：建议试用

**适用人群与推荐增量**：已有Git基础且使用兼容DSH的开发者，可在临时仓库试用为并行任务创建worktree并打开对应新会话。相比终端创建后再手工登记工作区，源码支持把分支、checkout与DSH工作区串接，减少交接步骤仍属推断。若新会话cwd或分支不符、注册失败或清理遇到未提交内容，停止操作并用git worktree list及终端核对保留现场后恢复。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：多会话开发者可在临时仓库试用，先验证新会话确实进入独立 cwd，再测试脏目录删除被拒绝及禁用后的状态保留。已有终端 worktree 流程且不需图形入口者收益较小。若出现孤儿 checkout、注册失配或共享工作区被误切换，应先人工对账并暂停自动隔离。[Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md#research-q05)

**试用方法、成本与证据**：[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 94,671](https://img.shields.io/static/v1?label=npm+30d&message=94%2C671&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph)

[返回索引](#column-index)

<a id="plugin-1331636953-packages-dsh-plugin-manager"></a>

## [dsh-plugin-manager](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md)

**主要用途**：在 DSH 官方插件页检查更新与宿主兼容，并通过官方通道或本机网关管理插件生命周期。

**采用建议**：建议试用

**适用人群与推荐增量**：使用兼容DSH且可备份临时profile的本机用户，可试用单个npm插件更新后手动重启并核对核心功能。相比逐个查npm和执行CLI，源码支持版本比较、写入结果回读与部分失败回退，便利尚未实测。若profile或版本不符、重启加载失败或回滚报错，停止后续更新并恢复备份，退回官方插件管理器或CLI处理。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：插件数量较多且愿意在每次重启后检查核心功能的本机用户，可在独立 profile 试用一项非关键扩展更新。先记录旧版本和可恢复来源，再验证更新、禁用与卸载；远程运维、关键生产 profile 或不能接受重启中断的场景先观察。若出现 profile 与加载版本不一致，停止批量操作并按实际状态恢复。[Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md#research-q05)

**试用方法、成本与证据**：[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 78,704](https://img.shields.io/static/v1?label=npm+30d&message=78%2C704&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager)

[返回索引](#column-index)

<a id="plugin-1331636953-packages-dsh-skill-explorer"></a>

## [dsh-skill-explorer](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md)

**主要用途**：在 DSH 中按来源浏览、创建、编辑和导入 Skill，并提供文件启用标记与回收站管理。

**采用建议**：建议试用

**适用人群与推荐增量**：已有DSH且需要维护多个普通文件型Skill的用户，可在目录备份后试用集中创建、导入和编辑。相比逐个进入项目与用户目录，源码支持按来源集中定位并核对写入对象，节省切换属于推断。若来源不完整、目标路径不符或需要保证模型撤权，停止面板写入并恢复备份、改用文件编辑和目标会话官方Skill目录核查。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：需要频繁浏览和管理普通文件型 Skill 的用户，可在备份的测试目录试用导入、同名处理、编辑与回收站。先在目标会话核对真实 catalog；若目的是撤销插件提供的能力，应从 provider 配置处理，不能依赖面板关闭。需要全局权限治理或完整preset视图的场景先观察。[Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md#research-q05)

**试用方法、成本与证据**：[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 116,190](https://img.shields.io/static/v1?label=npm+30d&message=116%2C190&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer)

[返回索引](#column-index)

<a id="plugin-1331846104-root"></a>

## [dsh-stock-market](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

**主要用途**：在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。

**采用建议**：建议试用

**适用人群与推荐增量**：适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。详见[Q06](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md#research-q06)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AnacondaKC/dsh-stock-market)

[返回索引](#column-index)

<a id="plugin-1333065091-root"></a>

## [DeepSeek Harness](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md)

**主要用途**：基于Cordis插件组合的开源Agent运行宿主，提供会话、工具与多应用入口。

**采用建议**：建议试用

**适用人群与推荐增量**：隔离profile适合有扩展需求的开发者验证可替换契约，未证明生产安全或所有插件兼容。[Q04](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q04)

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：有Agent扩展需求的开发者可在隔离profile以同模型小任务试用，先验收权限、取消及重启，不以架构或semver替代实际功能验收。[Q04](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q04)

**试用方法、成本与证据**：[查看完整分析](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 261,276](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=261%2C276&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

[返回索引](#column-index)

<a id="plugin-1333100071-root"></a>

## [DSH Vision Toolkit](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md)

**主要用途**：在DSH会话中接入图像问答、OCR、定位、截图差异和视觉产物。

**采用建议**：建议试用

**适用人群与推荐增量**：使用文字模型的DSH开发者可先拿非敏感截图做定位或差异检查。相比另开视觉工具再搬运结果，插件把图像证据与产物带回同一会话，这项便利有源码支持但节时未实测。若图像不能出网或坐标核对不可靠，就停止自动动作并退回人工或原生应用接口。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：使用文字模型的DSH开发者可先拿非敏感截图做定位或差异检查。相比另开视觉工具再搬运结果，插件把图像证据与产物带回同一会话，这项便利有源码支持但节时未实测。若图像不能出网或坐标核对不可靠，就停止自动动作并退回人工或原生应用接口。 依据 [Q01](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q01)、[Q03](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q03)、[Q04](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q04)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 907](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=907&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,773](https://img.shields.io/static/v1?label=npm+30d&message=10%2C773&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

[返回索引](#column-index)

<a id="plugin-1333100390-root"></a>

## [DSH Turn Rewind](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md)

**主要用途**：为DSH消息提供文件检查点、变更预览、选择恢复及会话重新开始。

**采用建议**：建议试用

**适用人群与推荐增量**：反复让Agent修改同一工作目录的开发者可在副本试用消息锚定文件恢复。相比手工对齐Git恢复与新会话，源码支持把预览、救援点及重新开始串联，节时尚未实测。若预览漏掉目标路径、检查点缺失或回滚报错，应停止写回并保留救援材料，退回独立备份或手工Git恢复。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：适合经常需要撤销Agent文件修改且愿意核对路径的开发者，在可丢弃副本中先做一次“文件恢复+消息新建”，对照受管理路径内容与原会话。只有预览范围、救援点和原有Git状态都符合预期才扩大使用；发现缺检查点、范围遗漏或回滚错误时停止写回，保留journal与rescue，以独立备份或手工Git恢复接管。不用于外部数据库或未纳管文件的整体事务回滚。 依据 [Q09](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md#research-q09)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 138](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=138&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-turn-rewind) [![npm 30d 4,502](https://img.shields.io/static/v1?label=npm+30d&message=4%2C502&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind)

[返回索引](#column-index)

<a id="plugin-1333116579-root"></a>

## [DSH Computer Use](../../plugins/anionex--dsh-computer-use/INSIGHT.md)

**主要用途**：为DSH提供macOS原生应用观察、语义操作和定向输入能力。

**采用建议**：建议试用

**适用人群与推荐增量**：需要操作无API原生应用的macOS开发者可先试可丢弃表单或编辑任务。相比临时坐标脚本，插件用观察、租约和确认约束动作，但办结率尚未实测。若应用状态无法可靠观察或操作不可逆，就停止自动重放并改用人工或专用接口。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：需要操作无API原生应用的macOS开发者可先试可丢弃表单或编辑任务。相比临时坐标脚本，插件用观察、租约和确认约束动作，但办结率尚未实测。若应用状态无法可靠观察或操作不可逆，就停止自动重放并改用人工或专用接口。 依据 [Q01](../../plugins/anionex--dsh-computer-use/INSIGHT.md#research-q01)、[Q03](../../plugins/anionex--dsh-computer-use/INSIGHT.md#research-q03)、[Q04](../../plugins/anionex--dsh-computer-use/INSIGHT.md#research-q04)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/anionex--dsh-computer-use/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-computer-use) [![npm 30d 3,322](https://img.shields.io/static/v1?label=npm+30d&message=3%2C322&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-computer-use) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-computer-use)

[返回索引](#column-index)

<a id="plugin-1333357514-root"></a>

## [Qiushi DSH Evidence Audit](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

**主要用途**：监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。

**采用建议**：建议试用

**适用人群与推荐增量**：需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md#research-q09)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/qiushi-dsh-evidence-audit) [![npm 30d 1,150](https://img.shields.io/static/v1?label=npm+30d&message=1%2C150&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)

[返回索引](#column-index)

<a id="plugin-1333370288-root"></a>

## [dsh-verification-receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

**主要用途**：被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。

**采用建议**：建议试用

**适用人群与推荐增量**：被动最小字段与边界文档清楚，适合精确宿主私有单进程路径观察；词法/可重算hash与无界queue不适合验证门禁或强审计。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：有条件试用，精确支持宿主+私有一进程一文件，将其当启发式观察摘要，不作验证通过/防篡改审计。详见[Q06](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q06)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verification-receipt) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verification-receipt)

[返回索引](#column-index)

<a id="plugin-1333807290-root"></a>

## [DSH Market](../../plugins/dsh-market--dsh-market/INSIGHT.md)

**主要用途**：在DSH内浏览社区插件，管理安装、更新、分组、备份与诊断。

**采用建议**：建议试用

**适用人群与推荐增量**：维护多个社区插件的DSH用户可先在克隆profile中试用安装和备份流程。相比分散CLI操作，市场加入加载校验和状态对账，但维护节时与全故障恢复未实测。若无法备份恢复或宿主鉴权版本不明，就停止修改主profile并退回原生Discover与人工维护。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：维护多个社区插件的DSH用户可先在克隆profile中试用安装和备份流程。相比分散CLI操作，市场加入加载校验和状态对账，但维护节时与全故障恢复未实测。若无法备份恢复或宿主鉴权版本不明，就停止修改主profile并退回原生Discover与人工维护。 依据 [Q01](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q01)、[Q03](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q03)、[Q04](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q04)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/dsh-market--dsh-market/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 8,811](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8%2C811&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-market/dsh-market) [![npm 30d 538,384](https://img.shields.io/static/v1?label=npm+30d&message=538%2C384&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)

[返回索引](#column-index)

<a id="plugin-1333961389-root"></a>

## [dsh-context](../../plugins/bowenliang123--dsh-context/INSIGHT.md)

**主要用途**：展示DSH上下文组成、请求趋势、事件与会话网络，提供诊断视图和提示前后缀配置。

**采用建议**：建议试用

**适用人群与推荐增量**：需要定位长会话上下文膨胀的DSH用户，可在匹配宿主并保持空提示前后缀时核对单个请求。相比原生token环或手查日志，源码支持从总量跳到请求组成和来源，诊断节时尚未实测。若出现版本fallback、冷读无数据或裁剪/估算无法解释，应停止完整审计用途并退回宿主日志和供应商usage。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：需要排查上下文膨胀的DSH用户，可在匹配宿主上保持prompt前后缀为空，从一个已知请求核对token环、Context Browser与原始日志。只有能回指具体来源才扩大到跨会话统计；遇版本fallback、压力无数据、历史裁剪或估算与账单不符，应停止把图表当完整审计，改看宿主日志/供应商usage。若不需细粒度来源，原生token环足够，无须增加观测层。 依据 [Q09](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q09)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/bowenliang123--dsh-context/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 3,566](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C566&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 145,261](https://img.shields.io/static/v1?label=npm+30d&message=145%2C261&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)

[返回索引](#column-index)

<a id="plugin-1334428397-root"></a>

## [@awiki/dsh-plugin](../../plugins/agentconnect--dsh-awiki/INSIGHT.md)

**主要用途**：将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。

**采用建议**：建议试用

**适用人群与推荐增量**：已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](../../plugins/agentconnect--dsh-awiki/INSIGHT.md#research-q09)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/agentconnect--dsh-awiki/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@awiki/dsh-plugin)

[返回索引](#column-index)

<a id="plugin-1334569498-root"></a>

## [dsh-mermaid](../../plugins/aks1st--dsh-mermaid/INSIGHT.md)

**主要用途**：在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。

**采用建议**：建议试用

**适用人群与推荐增量**：经常在DSH阅读流程图的用户可保持严格模式和大小限制试用小型Mermaid就地渲染。相比复制到独立渲染器，源码支持同页展示、放大并保留源码，理解效率未测。出现页面卡顿、源码与图不符或需要AI修复时，应保留草稿并退回复制源码到独立工具，不直接点击自动发送。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：适合经常看Mermaid图的人先用小图试用，保留strict和合理限制，报错先复制后决定是否发AI；卡顿、异常交互或草稿覆盖就停相关路径。详见[Q06](../../plugins/aks1st--dsh-mermaid/INSIGHT.md#research-q06)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/aks1st--dsh-mermaid/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dsh-mermaid) [![npm 30d 4,196](https://img.shields.io/static/v1?label=npm+30d&message=4%2C196&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mermaid) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mermaid)

[返回索引](#column-index)

<a id="plugin-1334773156-root"></a>

## [dsh-plugin-tts](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md)

**主要用途**：为DSH Web消息提供手动与自动朗读，支持Edge、Cloud及多种本地音色和长文本分块播放。

**采用建议**：建议试用

**适用人群与推荐增量**：需要听取助手回答的DSH Web用户可先用单一Edge后端试用非敏感消息朗读。相比复制到独立TTS工具，源码把消息归属、播放和停止接在同一界面，完整朗读率与节时未测。发生未经确认的文本外发、持续漏段或停止失效时，应停用插件并退回系统朗读或单一受信语音服务。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：建议先小范围试用。用非敏感短文本核对按钮、停止、自动播放和错误提示，再单独验证长文本；纯本地场景关闭外部回退，逐一加入所需音色。出现未经确认外发、重复漏读、取消不释放或宿主入口失效时停用。详见[Q09](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md#research-q09)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1624318455/dsh-plugin-tts) [![npm 30d 2,693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

[返回索引](#column-index)

<a id="plugin-1335047324-root"></a>

## [dsh-read-url](../../plugins/2672243194--dsh-read-url/INSIGHT.md)

**主要用途**：读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。

**采用建议**：建议试用

**适用人群与推荐增量**：经常读取公开网页资料且能核对原文的DSH用户，可在网络权限明确的profile中试用批次正文提取。相对逐页fetch和手工清理HTML，源码分析支持统一去噪、分片续读与批次异常隔离，但未实测节时或信息完整率。出现关键事实缺失、分页不完整或网络回退不符合预期时停止使用该结果，退回原页面或受控浏览器核查。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：适合用公开网页查资料并愿意核对原来源的人在独立profile试用，先明确提供方缺失时的网络回退权限，默认不加直连例外；缺页、政策误绕过或预算失控时停用。详见[Q09](../../plugins/2672243194--dsh-read-url/INSIGHT.md#research-q09)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/2672243194--dsh-read-url/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2672243194/dsh-read-url) [![npm 30d 2,587](https://img.shields.io/static/v1?label=npm+30d&message=2%2C587&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-read-url) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-read-url)

[返回索引](#column-index)

<a id="plugin-1335098475-root"></a>

## [dsh-plugin-mall](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)

**主要用途**：在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。

**采用建议**：建议试用

**适用人群与推荐增量**：开放发现和预检有明确价值，能备份并使用guard路径的维护者可在可丢弃profile试用；早commit与运行验收缺口不支持持续安装结论。详见[Q07](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md#research-q07)。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：能备份profile并理解guard重启的维护者可在可丢弃环境小范围试用，先只读发现再评估已审查候选；报告/脚本不清或快照提前消失就停止后续安装。详见[Q07](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md#research-q07)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1e0zj/dsh-plugin-mall) [![npm 30d 1,485](https://img.shields.io/static/v1?label=npm+30d&message=1%2C485&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)

[返回索引](#column-index)

<a id="plugin-1335219884-root"></a>

## [dsh-web-tools](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)

**主要用途**：为DSH提供多供应商网页搜索与抓取，以及小红书和X浏览器来源接入。

**采用建议**：建议试用

**适用人群与推荐增量**：公开资料检索有具体价值和小范围试用路径；需核来源、全文/截断和真实支出，不能把可用性当完整性保证。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：建议在可信本机、公开材料和小预算下试用，逐项回原文验收并记录全部尝试成本。平台来源及停止条件见 [Q05](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q05)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A3Boy/dsh-web-tools)

[返回索引](#column-index)

<a id="plugin-1335286261-root"></a>

## [dsh-md-annotator](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)

**主要用途**：在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。

**采用建议**：建议试用

**适用人群与推荐增量**：适合已有Better Sidebar且文稿有备份的用户试用；保存源码、导出批注并核对报告所属会话，刷新前防丢稿。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：建议有备份文稿的小范围试用，先验块引用/归属和冲突，结束前保存源码导出批注；复杂语法或导出不可靠时回外部编辑器。详见[Q05](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md#research-q05)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/3361805598-gif/dsh-md-annotator)

[返回索引](#column-index)

<a id="plugin-1335349535-root"></a>

## [dsh-permissions](../../plugins/940842546--dsh-permissions/INSIGHT.md)

**主要用途**：在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。

**采用建议**：建议试用

**适用人群与推荐增量**：需要细粒度工具门禁的团队可在保留宿主沙箱前提下试用，并先验证路径旁路与规则回滚。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：有明确威胁模型、能维护规则和保留宿主沙箱的团队可在非生产 profile 试用；先用只读/模拟工具跑对抗集，再启用 hard 保护真实路径。把它当唯一安全边界、规则无人维护或工具大量通过 shell 二次解释的环境不适合。 详见[Q09](../../plugins/940842546--dsh-permissions/INSIGHT.md#research-q09)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/940842546--dsh-permissions/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/940842546/dsh-permissions) [![npm 30d 588](https://img.shields.io/static/v1?label=npm+30d&message=588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permissions) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permissions)

[返回索引](#column-index)

<a id="plugin-1335843750-root"></a>

## [dsh-verify](../../plugins/263311487-ux--dsh-verify/INSIGHT.md)

**主要用途**：执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。

**采用建议**：建议试用

**适用人群与推荐增量**：能审读测试步骤的网页开发者，可在可信本地构建上试用浏览器交互断言与已批准截图基线。相对每次手写Playwright工程，源码分析支持统一动作描述和HTML记录，但PASS只覆盖已写断言且首次截图只是创建基线。必要断言未执行、基线未经批准或宿主被同步调用阻塞时停止自动放行，退回直接Playwright和人工需求验收。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：建议可信本地有限spec试用，故意缺陷应失败、合法实现应通过；空覆盖、新基线和ERROR不放行，host阻塞或范围不清时停止。详见[Q05](../../plugins/263311487-ux--dsh-verify/INSIGHT.md#research-q05)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/263311487-ux--dsh-verify/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/263311487-ux/dsh-verify) [![npm 30d 2,385](https://img.shields.io/static/v1?label=npm+30d&message=2%2C385&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verify) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verify)

[返回索引](#column-index)

<a id="plugin-1335992154-root"></a>

## [dsh-openai-oauth](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md)

**主要用途**：为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。

**采用建议**：建议试用

**适用人群与推荐增量**：本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：可试用为本机独立模型provider，保护明文凭据与真实工具审批，保留替代路由；不外推远程部署/静态模型全部可用/免费。详见[Q05](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q05)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdonisSheldon/dsh-openai-oauth) [![npm 30d 770](https://img.shields.io/static/v1?label=npm+30d&message=770&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openai-oauth) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openai-oauth)

[返回索引](#column-index)

<a id="plugin-1336720864-root"></a>

## [dsh-plugin-console](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)

**主要用途**：在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。

**采用建议**：建议试用

**适用人群与推荐增量**：维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。详见[Q06](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md#research-q06)。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。详见[Q06](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md#research-q06)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AlexYin-Tongji/dsh-plugin-console) [![npm 30d 1,111](https://img.shields.io/static/v1?label=npm+30d&message=1%2C111&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-console) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-console)

[返回索引](#column-index)

<a id="plugin-1337978261-root"></a>

## [dsh-message-copy-enhance](../../plugins/asianfleet--dsh-message-copy-enhance/INSIGHT.md)

**主要用途**：将助手消息选区复制为 Markdown，恢复链接、LaTeX 源码和代码围栏。

**采用建议**：建议试用

**适用人群与推荐增量**：经常将技术回答片段摘入Markdown的Web用户可在常用编辑器先试单条消息内的链接、公式和代码，并核对源文；不用于逐字原稿归档或跨消息选区。若符号、URL或换行静默丢失，禁用并回原消息复制。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：经常摘录技术回答的人可先试，选取链接、公式和多行代码各一段，粘贴到常用编辑器并逐字核对URL、TeX和换行，再测试禁用后默认复制恢复。首次涉及客户端加载，持续在copy时遍历选区DOM，不调用模型；现金、延迟和人工复核时间没有实测值，不写为零。发布包和Git源码的构建路径不同，源码安装含prepare构建，需确认拿到可加载客户端。失败时可禁用并用原消息或手工复制；若静默丢掉代码符号、公式或链接目标，应停止自动依赖。它不适合要求逐字原始Markdown的归档流程。 [Q04](../../plugins/asianfleet--dsh-message-copy-enhance/INSIGHT.md#research-q04)

**试用方法、成本与证据**：[查看完整分析](../../plugins/asianfleet--dsh-message-copy-enhance/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Asianfleet/dsh-message-copy-enhance) [![npm 30d 1,109](https://img.shields.io/static/v1?label=npm+30d&message=1%2C109&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-message-copy-enhance) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-message-copy-enhance)

[返回索引](#column-index)

<a id="plugin-1339316901-root"></a>

## [@yolk_vat-y/dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

**主要用途**：为DSH项目持久保存任务、文档、代码符号与经验，支持检索和自动上下文注入。

**采用建议**：建议试用

**适用人群与推荐增量**：反复接续同一非敏感项目的开发者可备份存储后试用任务记忆检索与按需注入。相比手写任务笔记再搜索文件，源码支持把任务、经验和出处关联，实际接续正确率与token节省未测。出现跨项目内容、无依据指令或保存状态不明时，应暂停注入并回源码及人工任务笔记核查。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：建议单一非敏感工程小范围试用，先按需查询和回源，后逐步开启自动注入；串项目和未落盘等停止标准见 [Q05](../../plugins/00080000--dsh-project-memory/INSIGHT.md#research-q05)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/00080000--dsh-project-memory/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 25](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=25&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/00080000/dsh-project-memory) [![npm 30d 3,686](https://img.shields.io/static/v1?label=npm+30d&message=3%2C686&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

[返回索引](#column-index)

<a id="plugin-1341648244-root"></a>

## [KRouter](../../plugins/398894496-arch--krouter/INSIGHT.md)

**主要用途**：让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。

**采用建议**：建议试用

**适用人群与推荐增量**：lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：有条件试用lookup-only。先非敏感个人vault核对来源、旧页与拒答，保持原件；nightly/导入/writer按各lane权限另评，不把接头卸载当timer停止。详见[Q07](../../plugins/398894496-arch--krouter/INSIGHT.md#research-q07)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/398894496-arch--krouter/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/398894496-arch/KRouter)

[返回索引](#column-index)

<a id="plugin-1341694685-root"></a>

## [dsh-thumb](../../plugins/aliceljy--dsh-thumb/INSIGHT.md)

**主要用途**：将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。

**采用建议**：建议试用

**适用人群与推荐增量**：适合愿意自行维护的个人窄屏DSH用户受控试用，先核对列定位、设置与轨迹交互并保留关闭重载路径；不把免hash当免维护。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：个人窄屏用户可受控试用，先检查会话切换、设置与轨迹，保留?thumb=0后重载的退出路径；定位或触控出现影响任务的问题就停用。详见[Q06](../../plugins/aliceljy--dsh-thumb/INSIGHT.md#research-q06)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/aliceljy--dsh-thumb/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AliceLJY/dsh-thumb)

[返回索引](#column-index)

<a id="plugin-1344270011-root"></a>

## [J-Space Cognition Suite DSH适配](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md)

**主要用途**：将J-Space问题拆解、持久控制器和工作区账本作为DSH Agent预设接入。

**采用建议**：建议试用

**适用人群与推荐增量**：已用兼容DSH且愿意维护证据记录的开发者，可先在单Agent复杂工程任务中试用J-Space预设。相对原生todos加普通文档，源码分析支持来源hash、报告轮次和失效复核记录，但它是合作协议而非自动强制门禁。来源变更后结论未复核、控制器未被调用或账本状态无法解释时停止依赖其放行，退回原生任务板和人工证据审阅并保留账本。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：建议兼容环境下的复杂工程任务先单Agent试用，明确合作协议与真实门禁区别；简单任务先用原生工具，不据上游实验宣称收益。[Q08](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md#research-q08)

**试用方法、成本与证据**：[查看完整分析](../../plugins/anonyjcy--dsh-j-space/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AnonyJcy/dsh-j-space) [![npm 30d 2,004](https://img.shields.io/static/v1?label=npm+30d&message=2%2C004&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anonyjcy/dsh-j-space) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anonyjcy/dsh-j-space)

[返回索引](#column-index)

<a id="plugin-1346196699-root"></a>

## [dsh-api-dashboard](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

**主要用途**：在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。

**采用建议**：建议试用

**适用人群与推荐增量**：使用多平台API的单用户可在审阅密钥接收方后试用余额与会话估算看板。相比切各平台控制台和手算token，源码支持同页汇总及旧数据提示，实际对账精度和节费未测。未知模型套默认价、旧余额被当实时或密钥去向不符时，应停止预算判断并回官方控制台，不用自更新修复账单问题。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：可信单用户本地试用，限定Key接收方和刷新，未知模型先缺价核查，估算与官方账单分开，更新优先宿主管理器。详见[Q06](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md#research-q06)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,117](https://img.shields.io/static/v1?label=npm+30d&message=4%2C117&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-dashboard)

[返回索引](#column-index)

<a id="plugin-1347958944-root"></a>

## [dsh-wsl-open](../../plugins/173787247--dsh-wsl-open/INSIGHT.md)

**主要用途**：让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。

**采用建议**：建议试用

**适用人群与推荐增量**：适合个人本地WSL办公文件流程试用；仅打开可信文件，核对宿主路由权限和真实窗口结果。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：建议个人本地WSL用户限定试用可信办公文件，验收以正确窗口实际显示为准；复杂路径误点、权限不清或不明应用启动时停止。详见[Q06](../../plugins/173787247--dsh-wsl-open/INSIGHT.md#research-q06)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/173787247--dsh-wsl-open/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-open)

[返回索引](#column-index)

<a id="plugin-1349267122-root"></a>

## [dsh-cap-profile](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md)

**主要用途**：扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。

**采用建议**：建议试用

**适用人群与推荐增量**：适合将其作为本地日志排查索引试用，先核对真实数据和模型归因，不据错误率直接做能力排名。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：先确认面板显示真实数据，再选数份脱敏会话核对调用、模型和错误归属；用它缩小排查范围。需要模型选型结论时补同任务结果对照。[Q03](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md#research-q03)

**试用方法、成本与证据**：[查看完整分析](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ansonfishing/dsh-cap-profile)

[返回索引](#column-index)

<a id="plugin-1356896576-dsh-capmap-viz"></a>

## [dsh-capmap-viz](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md)

**主要用途**：解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。

**采用建议**：建议试用

**适用人群与推荐增量**：对已有 CapMap 文档的团队有清晰只读导航价值，但必须把图视为声明并回查原文。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：建议试用。适合已经维护 CapMap 文档的小团队，只把图当导航并要求关键判断回到原文；先在单 workspace、小图验证 parse/watch/read 和错误展示。没有文档纪律的项目不应为了图而先引入整套格式。 参见[Q04](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q04)、[Q06](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q06)与[Q09](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q09)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1741505640/capmap-skills) [![npm 30d 640](https://img.shields.io/static/v1?label=npm+30d&message=640&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz)

[返回索引](#column-index)

<a id="plugin-1356960582-root"></a>

## [dsh-usage-analytics](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md)

**主要用途**：在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。

**采用建议**：建议试用

**适用人群与推荐增量**：适合本机个人用户对小样本受控试用并核对用量字段和索引状态；不作账单、技能成果成功率或多人权限保证。

**验证范围**：固定版本源码核查；尚无支撑该建议的同版本宿主验收记录。

**试用前提、限制与退出条件**：个人本机用户可用少量可人工核对的会话试用；先确认宿主依赖与访问控制，遇到用量无法对账、索引持续失败即停止依赖图表。详见[Q06](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md#research-q06)。

**试用方法、成本与证据**：[查看完整分析](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md)，按其中的使用建议和核查边界决定是否尝试。

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/3361805598-gif/dsh-usage-analytics)

[返回索引](#column-index)

[返回首页](../../../README.md)

## 更新时间

2026-10-27
