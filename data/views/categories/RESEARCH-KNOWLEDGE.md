# 研究与知识

[全部分类](INDEX.md) · [返回首页](../../../README.md)

信息检索、网页读取、笔记与长期知识。

<a id="category-index"></a>

**同类比较**

> 比较表与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@240xu/dsh-session-search](#plugin-1390987906-root) | 对本地 DSH 会话日志建立消息索引，提供跨会话关键词搜索、定位摘录和独立面板。 | 单人非敏感本地范围试用，先验已知词与长消息尾部边界，命中后核原文；完整全文/多租户需求暂缓。 |
| [@240xu/dsh-websearch](#plugin-1340340493-root) | 为DSH注册unified搜索服务，聚合11后端，支持并发容错、去重、可选重排、多查询及缓存历史。 | 非敏感公开查询小集合试用，先关多查询/深覆盖，严格流程关缓存并清历史，审阅备用实例。 |
| [@hyzyn/dsh-rss](#plugin-1335046216-packages-rss) | 聚合 RSS 与 Atom 订阅生成本地日报，可选 AI 摘要，并向 DSH 会话注入有限条目。 | 先关闭AI与公告，只用少量可信源手动核对日报、latest元数据和原链接。 |
| [@hyzyn/dsh-search](#plugin-1335046216-packages-search) | 在 DSH Web 界面统一搜索历史会话、Prompt、MCP 工具与设置，并导航到命中对象。 | 可信本机用户先用已知冷热会话、旧Prompt版本和设置卡样本核对查询及导航；空结果回原入口确认。 |
| [AgentKey](#plugin-1218688296-root) | 提供统一外部数据服务的 Agent Skill、安装脚本与托管 MCP 接入配置。 | [Q04](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q04) 先固定外部CLI和宿主，在隔离profile验证完整调用与费用；当前保持观察。 |
| [AnySearch for DSH](#plugin-1333247282-root) | 在 DSH 原生网页搜索与抓取接口接入 AnySearch，并提供垂直检索和有限并发批量搜索。 | [Q04](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q04) 非敏感问题先比原provider与批量结果，以有效引用而非命中数决定继续；限流或缺证回人工。 |
| [Argo](#plugin-1304997851-root) | 为 Agent 提供多源搜索、网页取证和本地资料检索，并以 CLI、Skill 与 MCP 接口交付结果。 | [Q03](../../plugins/taxueseek--argo/INSIGHT.md#research-q03) 先固定少量公开源并关闭本地并入，保留原文和失败诊断，用同任务核对正确率与全部投入。 |
| [Argo DSH](#plugin-1304997851-packages-dsh-plugin) | 把 Argo 检索、抓取、原生 Web provider 和多轨道研究编排接入 DSH。 | [Q05](../../plugins/taxueseek--argo--packages-dsh-plugin/INSIGHT.md#research-q05) 观察自动研究报告采用；公开低后果样例先核实际工具和每条原文，发现依赖/引用缺口则退回单Agent或人工。 |
| [Awesome AI Pedia](#plugin-1321280738-root) | 按主题整理 AI 工具、Agent、Skill 和 DSH 相关文章的中文知识库。 | [Q04](../../plugins/awesome-ai-pedia--awesome-ai-pedia/INSIGHT.md#research-q04) 先作为线索入口，再按任务核对官方固定版本，不直接执行未经验证的命令。 |
| [Awesome DeepSeek Harness](#plugin-1330942675-root) | 按场景分类整理 DSH 插件、工具和基础设施，并提供生成的仓库目录。 | 建议作为发现资源试用：按场景挑少量候选后固定目标版本核查；不可访问或过时条目退回原仓库及公开搜索，不批量安装。 |
| [Awesome DeepSeek Harness](#plugin-1333173677-root) | 按任务分类收录 DeepSeek Harness 插件、Skill、MCP、客户端及其他配套资源的双语目录。 | 当读者尚不熟悉某类扩展时，可限时浏览目录，先从任务分类挑少量目标并记录链接，进入原仓库后另行核对版本和组件。 |
| [Awesome DeepSeek Harness Plugins](#plugin-1333171737-root) | 按能力分类整理 DSH 公开插件与扩展，并提供仓库、Star 与引用网页链接 | [Q03](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md#research-q03) 只读试用候选发现；目录条目必须回目标固定源码核实，无法核实时停止将该项当推荐。 |
| [Awesome DeepSeek Harness Plugins](#plugin-1333183810-root) | 面向 DSH 的双语插件、起步项目、工具与一手资源精选索引，含教程及源码级收录规范。 | 试用作只读学习/找一个候选，随后回直接仓库固定版本另验。 |
| [Awesome DeepSeek Harness Plugins](#plugin-1333844474-root) | 提供 DeepSeek Harness 社区插件目录、结构化投稿审核与双语目录生成。 | [Q04](../../plugins/imsai-sh--awesome-deepseek-harness-plugins/INSIGHT.md#research-q04) 先选一个公开且已定位 manifest 的仓库，从干净分支准备单条 JSON，用本地文件或隔离服务检查投影。 |
| [Awesome DeepSeek Harness Plugins](#plugin-1336739291-root) | 将 marketplace 索引转为可浏览、可校验的双语插件目录 | [Q04](../../plugins/web-casa--awesome-deepseek-harness-plugins/INSIGHT.md#research-q04) 用固定提交作发现源，并对实际包独立验证。 |
| [Awesome DeepSeek Harness（libukai）](#plugin-1333167552-root) | 以中英日文指南组织官方入门、教程、客户端、插件和集成，帮助读者分清对象类型与查证版本、权限及采用条件。 | 可作为学习/查证起点，使用具体对象前回固定原仓；版本/类型/授权不明则停在阅读，见 [Q04](../../plugins/libukai--awesome-deepseek-harness/INSIGHT.md#research-q04)。 |
| [Awesome DSH Plugin](#plugin-1332582761-root) | 以双语元数据整理跨场景插件候选 | [Q04](../../plugins/alex-yanggg--awesome-dsh-plugin/INSIGHT.md#research-q04) 固定提交抽样核对来源和双语。 |
| [Awesome DSH Plugin](#plugin-1333175049-root) | 整理 DSH 社区插件条目，生成双语目录、网站与插件市场索引。 | 把目录当候选清单。 |
| [Awesome DSH Plugin 目录](#plugin-1334020733-root) | 从双语 README 生成 DSH 插件分类站点、订阅源与机器可读索引。 | [Q04](../../plugins/beancookie--awesome-dsh-plugin/INSIGHT.md#research-q04) 用作候选列表，安装前重新确认目标仓库与包。 |
| [Awesome Gaussian Skills](#plugin-1223099228-root) | 提供 3D Gaussian Splatting 方法资料、Agent Skill 与 MCP 渲染服务。 | [Q04](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md#research-q04) 先隔离网络并用非敏感场景核对真实渲染；[Q03](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md#research-q03) 边界不满足时停止。 |
| [BigA](#plugin-1250326123-root) | 将 A 股观察池与市场摘要 Skill 及其 Python 扫描脚本装入 DeepSeek Harness。 | [Q03](../../plugins/kobenfang--biga/INSIGHT.md#research-q03) 仅将离线合成样本用于核格式和口径，异常回人工资料核查。 |
| [BioDSH](#plugin-1351845049-packages-dsh-biodsh) | 为生信分析组合技能选择、步数收敛、公共输出合同与重放检查的 DSH 预设包 | [Q05](../../plugins/sagirimo--biodsh--packages-dsh-biodsh/INSIGHT.md#research-q05) 建议观察，先由熟悉统计的用户在新鲜去敏金标合同上核打包资源、覆盖、重放及恢复。 |
| [BioDSH](#plugin-1351845049-root) | 内嵌 DSH 与 Python 环境的桌面生信分析工具，组织项目、脚本和可复跑交付。 | [Q05](../../plugins/sagirimo--biodsh/INSIGHT.md#research-q05) 仅用合成数据比较固定脚本及参考输出。 |
| [causal-memory](#plugin-1312924592-root) | 本地记忆引擎存储事实与决策结果关系，并以 DSH 工具提供召回。 | [Q03](../../plugins/jingxuanc--causal-memory/INSIGHT.md#research-q03) 独立库小样本对照后再扩展。 |
| [causal-memory DSH plugin](#plugin-1312924592-dsh-plugin) | 通过 stdio MCP 将 causal-memory 工具和服务接入 DSH。 | [Q03](../../plugins/jingxuanc--causal-memory--dsh-plugin/INSIGHT.md#research-q03) 用临时数据库。 |
| [CiteCiter](#plugin-1337306269-packages-citeciter) | 在 DeepSeek Harness 中从来源对话或文档选段，在独立 Topic 中引用、追问和学习。 | [Q04](../../plugins/kirkchinese--citeciter--packages-citeciter/INSIGHT.md#research-q04) 用无敏感来源试读和定位，引用不符就回原文与手工摘录。 |
| [Claude Paper](#plugin-1154333841-root) | 跨宿主论文阅读 Skill 组合：下载解析 PDF，生成摘要或学习材料，并以本地网页库组织笔记。 | 一篇公开PDF的summary对照人工原文，study/Web库逐步另验；依赖和资料都备份，见 [Q03](../../plugins/alaliqing--claude-paper/INSIGHT.md#research-q03)。 |
| [clawock](#plugin-1240554500-root) | 为外部 AI Agent 提供投资研究的证据组织、决策校验和结果复盘流程。 | [Q03](../../plugins/kcnyu--clawock/INSIGHT.md#research-q03) 仅用离线模拟材料测试可审计交接，输入和回执对不上即退回人工复核。 |
| [ClearAI](#plugin-1367299537-root) | 为 DSH 提供以问题、证据、独立评估和领域本体组织研究的 Agent 预设。 | [Q04](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q04) 在固定材料与可反驳问题上试用，保留人工复核，用错误结案及全部费用决定是否继续。 |
| [Cue Data MCP](#plugin-1244140731-dsh-cue-data-mcp) | 把 Cue 监管、宏观、披露等公开数据 MCP 域接入 DSH。 | [Q03](../../plugins/sensedeal--cue-skills--dsh-cue-data-mcp/INSIGHT.md#research-q03) 用隔离 profile 对照工具发现与授权的小查询，身份或费用不明即退回人工。 |
| [Cue Omni Reader](#plugin-1244140731-dsh-cue-omni-reader) | 将 Cue Omni Reader 的文档与网页解析 MCP 接入 DeepSeek Harness。 | [Q03](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader/INSIGHT.md#research-q03) 只有具备隔离 key、已核外部包和非敏感样本，才进一步验证。 |
| [DARE](#plugin-1154200345-root) | 由 Markdown 技能图组织的分阶段 AI 科研流程与检查点规范 | [Q05](../../plugins/yogsoth-ai--de-anthropocentric-research-engine/INSIGHT.md#research-q05) 以单一可核验问题试用，人工抽查每阶段；引用丢失或越过规格批准则停止并退回人工计划。 |
| [Deep Read Summarize](#plugin-1338654346-root) | 对书籍、论文、网页和视频做分块精读，返回 Markdown 笔记、建议路径及质量核验。 | [Q04](../../plugins/pensivefei--deep-read-summarize/INSIGHT.md#research-q04) 先用公开材料并保持缓存关闭，核对实际文件和关键引文。 |
| [DeepRead 精读助手](#plugin-1334924880-root) | 将文本、文件和微信文章整理为精读报告、知识地图与复习问题，支持预算预检及文件导出。 | 当前建议观察。 |
| [Distilly](#plugin-1195828337-root) | 从消息、文档、访谈等材料提炼人物工作方法与表达偏好，并生成可复用的 Agent Skill。 | 有合法材料并愿意逐条复核的用户，可用自己的非敏感工作资料试做一个小档案，再用未参与生成的问题检验；先关注工作事实与建议是否准确，而不是说话像不像。 |
| [DocsMint for DSH](#plugin-1249550690-packages-dsh-plugin) | 在 DSH 侧栏浏览编辑 DocsMint，并用四个模型工具通过 REST 或 MCP 检索读写文档。 | 测试工作区做已知搜索与小文档回读，更新保留原文；失败先查远端，异常停写回原界面。 |
| [DSH AI4Scholar](#plugin-1335681939-root) | 在 DeepSeek Harness 中检索和去重多个论文来源，并提供文献详情、引文及积分信息。 | [Q04](../../plugins/literaf--dsh-ai4scholar/INSIGHT.md#research-q04) 从单源合成任务起步，检查来源和真实费用；无法对账时回原站。 |
| [DSH Annotation](#plugin-1369398336-packages-dsh-annotation) | 把助手回复中的选段和批注作为原生引用加入草稿，并按顺序发送。 | [Q04](../../plugins/ecnu--eduwork--packages-dsh-annotation/INSIGHT.md#research-q04) 建议先用非敏感长回复在兼容客户端核对多处选段、撤销、刷新和历史；定位或草稿恢复异常时回退手工引用。 |
| [DSH Data Agent](#plugin-1331112087-root) | 在 DSH Web 与 TUI 中管理数据库连接、查询、版本化业务 Catalog 和分析报告。 | [Q04](../../plugins/omdsh-dev--dsh-data-agent/INSIGHT.md#research-q04) 仅在脱敏副本、数据库只读角色和显式readonly下试用，先核SQL/口径/截断；异常即回原客户端。 |
| [DSH Data Quality](#plugin-1339628067-root) | 在 DSH 中确定性分析、清理、校验表格数据，提供 citation 核值服务与持久报告回读。 | 试用限定可信无链接副本的小文件分析与clean dryRun，人工核规则/分数，不提供outputPath。 |
| [DSH Fact Check](#plugin-1380181057-root) | 将公开事实拆点核查，组织多来源检索、原文交叉验证与可选判断。 | [Q05](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q05) 建议能审查原文的研究者先选少量公开事实点并手工核引文；正文不可得或来源独立性不明时明确无法核实。 |
| [DSH Failover Search](#plugin-1374007757-plugins-dsh-failover-search-plugin) | 在宿主搜索与取回接缝按账号和平台故障转移 | [Q04](../../plugins/fnosp--fnos-dsh--plugins-dsh-failover-search-plugin/INSIGHT.md#research-q04) 模拟服务起步，保存原搜索和取回配置作为退出。 |
| [DSH Free Search](#plugin-1334384058-root) | 为 DSH 提供多引擎网页搜索、可配置回退与分层网页提取。 | 关闭用不到的提取层，在独立 profile 从公开文档、一个允许的引擎开始。 |
| [DSH Industry Research](#plugin-1339669759-root) | 提供产业链建图、公开动态追踪、公司卡片和带来源及缺口的行业研究报告。 | [Q05](../../plugins/perrylink--dsh-industry-research/INSIGHT.md#research-q05) 公开文本/非敏感副本先用unverified fallback，人工逐值核口径/来源；缺正文/冲突停并回手工。 |
| [DSH Local Memory](#plugin-1390103795-root) | 保留Hindsight项目分库，提供跨库查询、项目记忆状态总览与Git历史播种入口。 | 已有稳定daemon且库名唯一的多项目用户可试用，先显式指定少数库并核对事实；强隔离或同名项目应暂缓跨库汇总。 |
| [DSH Memory](#plugin-1353352537-root) | 为 DSH 提供 Global 与 Workspace Markdown 记忆，以及历史会话整理。 | 先用隔离、无敏感的测试会话；整理后分别核对全局、工作区及回执，异常即停用并回到手工笔记。 |
| [DSH MSDS Chain](#plugin-1216014649-plugins-dsh) | 通过 MCP 桥将托管化学安全查询服务接入 DSH。 | [Q04](../../plugins/littleblakew--msds-chain-mcp--plugins-dsh/INSIGHT.md#research-q04) 仅作为待复核线索；任何化学处置先由合格人员核对最新原始 SDS 和现场条件。 |
| [DSH Noema](#plugin-1334167430-root) | 将本地 Noema 记忆服务接入 DSH，支持检索与跨工具导入。 | [Q03](../../plugins/zseven-w--dsh-noema/INSIGHT.md#research-q03) 先隔离验证。 |
| [DSH OpenContext](#plugin-1329484633-plugins-dsh-opencontext) | 将OpenContext记忆工具、自动捕获与有界证据召回接入DSH。 | [Q03](../../plugins/melandlabs--opencontext--plugins-dsh-opencontext/INSIGHT.md#research-q03) 单scope关闭捕获先核工具闭环。 |
| [DSH Origin Plugin](#plugin-1335203486-root) | 通过 MCP 驱动 Windows 上的 Origin，从实验数据生成图、反读属性，并交付可继续编辑的工程。 | [Q04](../../plugins/fantasality--dsh-origin-plugin/INSIGHT.md#research-q04) 已有 Origin 环境时先试一份无敏感数据的 CSV 和独立工程。 |
| [DSH Paper Reader](#plugin-1373309426-root) | 在 DSH 联动 PDF 文献库、分块检索与论文会话，提供可回查的页码跳转入口。 | [Q01](../../plugins/ggboya--dsh-paper-reader/INSIGHT.md#research-q01) 先用公开短 PDF 试查一处原句，核对文献、页码和文字。 |
| [DSH PDF Reader](#plugin-1346064150-root) | 提供PDF内容扫描、单页文本与图像混合读取，以及区域渲染工具。 | 适合已经有Python环境且经常读图表论文的人在非关键材料上小范围试用。 |
| [DSH Plugin Memory](#plugin-1338123290-root) | 用 Markdown 保存 DSH 跨会话记忆和角色设定，提供启动注入、回顾和整理。 | 仅以隔离低敏笔记观察，关闭不需要的自动记录与提交，验证模型收到的上下文。 |
| [DSH Plugins 中文导航](#plugin-1335045464-root) | 提供带安装、起步建议与限制的插件发现目录 | [Q04](../../plugins/gityuanbao--dsh-plugins/INSIGHT.md#research-q04) 只作发现源，回源固定包版本并独立验收。 |
| [DSH Research Report](#plugin-1339655720-root) | 以证据快照、claim 绑定、字节核验和 manifest 哈希生成版本化研究报告。 | [Q05](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q05) 公开非敏感副本试字节回溯，外存seal并人工审所有段落/语义；不符停发布回手工对账。 |
| [DSH Scholar](#plugin-1325458176-root) | 计算研究工作台，将项目对话、资料、受控实验、证据关系与 TeX 写作放在持久项目中。 | 保留浏览器token，在监督且隔离的本地环境用已知fixture试gate-only；先故意未批/缺metrics核拒绝与终态，异常备份Kernel和原数据回独立脚本。 |
| [DSH SciWork](#plugin-1416950630-root) | 在 DSH 中组织科研课题、文献、数据和投稿材料。 | 先用备份课题核实确认、回执与材料；超时先查文件，投稿前人工复核。 |
| [DSH Trading](#plugin-1336940095-root) | 面向 DeepSeek Harness 的市场数据与回测研究工作台，支持本地行情、图表及历史成交材料核验。 | [Q04](../../plugins/maddogfinance--dsh-trading/INSIGHT.md#research-q04) 用隔离配置和合成记录试验，优先用内联数据。 |
| [DSH Video Lens](#plugin-1338640495-root) | 将本地视频抽样、可选转写和视觉问答接入 DSH | [Q04](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md#research-q04) 只用虚构短片验收抽样、时间和传输。 |
| [DSH Web Search Pro](#plugin-1333320049-root) | 以按需动作和有出处的证据包组织多来源搜索 | [Q04](../../plugins/anweat--dsh-web-search-pro/INSIGHT.md#research-q04) 公开来源起步，对照规则和远程评分。 |
| [DSH Web Tools](#plugin-1335219884-root) | 为 DeepSeek Harness 提供多来源网页搜索与抓取，支持可配置后备链及 X、小红书原生访问。 | 仅在隔离 Profile 测普通双源与单源。 |
| [DSH 插件周榜面板](#plugin-1400385991-packages-dsh-weekly-panel) | 在 DSH 侧栏查看插件周榜、免费模型摘要与推荐，并复制安装命令。 | [Q04](../../plugins/514006234--dsh-weekly-check--packages-dsh-weekly-panel/INSIGHT.md#research-q04) 先只看摘要和来源，再决定是否复制命令。 |
| [dsh_kline](#plugin-1333960520-root) | 在 DSH 会话中查看 K 线、分析历史形态并把绘图应用到当前图。 | [Q04](../../plugins/ftshare-lab--dsh_kline/INSIGHT.md#research-q04) 先用固定历史样本，在隔离 profile 比较独立图表。 |
| [dsh-anchored-monitor](#plugin-1337467566-root) | 对 DSH reasoning 流做词形波段监控，独立进程可自动中断并重置会话。 | 仅隔离 profile 显式关闭干预，先回放验证代理指标；真实使用前需默认只读、身份鉴权及人审。 |
| [dsh-auto-memory](#plugin-1381430202-root) | 将项目和用户记忆写入本地文件并注入索引，可选结束时固化。 | [Q03](../../plugins/asktheway--dsh-auto-memory/INSIGHT.md#research-q03) 只在测试项目验收核心工具和提示，随后对照自动固化。 |
| [dsh-better-deepseek](#plugin-1334388245-root) | 为 Better DeepSeek 浏览器扩展提供 DeepSeek Harness 会话控制与事件桥接。 | [Q04](../../plugins/edgetype--dsh-better-deepseek/INSIGHT.md#research-q04) 真实任务保留原生界面，只有隔离验收能证实无交叉事件和控制后再评估。 |
| [dsh-chinese-traditional-wisdom-skill](#plugin-1335061439-root) | 将玄枢传统文化 Skill、本地 TypeScript 计算和结构化事实核验资源封装进 DSH。 | 先阅读Skill和RULES，把目标限定为文化学习或核验流程研究；优先用不含个人身份的公开fixture查一个已有verifier的工具。 |
| [dsh-codevault](#plugin-1359423472-root) | 把源码阅读认识按仓库/文件/符号合并为Markdown对象卡，以JSONL保存条目并可选关联本地vault。 | 单人单写者独立备份档案可试用，vaultDir先不配置；广泛vault读取前优先修边界。 |
| [dsh-deep-research](#plugin-1324772199-root) | 基于 DeepSeek Harness 工作流编排子题研究、补证、综合报告和可选审阅。 | [Q03](../../plugins/omdsh-dev--dsh-deep-research/INSIGHT.md#research-q03) 在隔离 profile 小范围观察，按 [Q02](../../plugins/omdsh-dev--dsh-deep-research/INSIGHT.md#research-q02) 逐题核对覆盖。 |
| [dsh-feed](#plugin-1336585522-root) | 聚合 GitHub dsh-plugin topic 与 npm keyword 的本地 JSON 索引，供工具、CLI、MCP 查询。 | 隔离工作区试同步，审阅来源与错漏；search 只做候选检索，详见[Q03](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q03)。 |
| [dsh-fund-research](#plugin-1339672104-root) | 采集中国公募基金公开数据，确定性计算指标并封存带数字回溯附录的版本化研究报告。 | 懂基金数据口径者可仅在副本工作区对一支固定离线样本试用，核对来源、日期/覆盖、关键指标和hash，停止于字段漂移、无法复算或状态异常。 |
| [dsh-git-memory](#plugin-1339286962-root) | 为 DSH 提供本地 Git 长期记忆、有限检索与可恢复的记忆管理。 | [Q03](../../plugins/seriousz158--dsh-memory/INSIGHT.md#research-q03) 在可丢弃仓库先试只读。 |
| [dsh-hacker-news](#plugin-1211255316-plugins-hacker-news) | 为 DeepSeek Harness 提供 Hacker News 榜单、评论、搜索和用户信息工具。 | [Q04](../../plugins/heartleo--hn-cli--plugins-hacker-news/INSIGHT.md#research-q04) 仅用非敏感查询并检查截断，重要结论回原帖；网络或完整性不满足时停止。 |
| [dsh-handbook](#plugin-1333258936-root) | DeepSeek Harness 中文优先的学习手册与生态观察，涵盖上手、插件开发、案例和调优。 | 先用固定宿主完成一次隔离的入门练习。 |
| [dsh-insight](#plugin-1336649545-root) | 用需求匹配、环境配方、健康评分、静态安全扫描与统一 verdict 辅助选择 DSH 插件。 | 适合插件研究者把它当候选筛选和审计线索观察，不应直接驱动生产安装。 |
| [dsh-knowledge](#plugin-1335253559-root) | 为 DSH 提供文档知识库、混合检索、引用及可续读证据。 | [Q03](../../plugins/soren-abt--dsh-knowledge/INSIGHT.md#research-q03) 先用两篇资料核对范围、降级与更新后续读，再验证四类数据备份。 |
| [dsh-literature](#plugin-1351375738-root) | 在DSH侧窗识别学术文献、获取元数据和全文，提供PDF阅读、引用、笔记及本地库和目录保存。 | 先观察。 |
| [dsh-ls125-uv-probe](#plugin-1381989584-root) | 把 LS125/UVALED-X3 私有 UART 读取协议、抓取分析工具及 F103 参考固件注册成 DSH 技能。 | 只读轮询与离线抓取先行，清零单独审批；在独立仪表/标准光源下复核后才上生产设备。 |
| [dsh-math-olympiad](#plugin-1344714964-root) | 挂载竞赛数学解题 Skill，要求独立验证证明、诚实弃权，并可选编译 PDF。 | 已有可信 subagent 与 DSH base 的团队可隔离试题，逐题核验证器入参、标准解与弃权；详见[Q03](../../plugins/988hj7tczd-oss--dsh-math-olympiad/INSIGHT.md#research-q03)。 |
| [dsh-mcp-connector](#plugin-1340838178-root) | 在 DeepSeek Harness 中管理 MCP 连接、授权和工具发现，支持 OAuth、API Key 与 HTTP／stdio。 | [Q05](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md#research-q05) 用隔离项目验收一个已有权限的只读查询。 |
| [dsh-mech-workbench](#plugin-1428637034-root) | 在 DSH 提供工科题图处理、符号数值求解、可视化、校核及题目卡片工具。 | 标准答案小题先人工核题，再看checks与图，失败/超范围即退独立计算；不用于真实设计放行。 |
| [dsh-mneme](#plugin-1333254657-dsh-mneme) | 在DSH中以SQLite与Markdown维护跨会话记忆，提供检索、自动注入和摘要整理，隔离与内容门控有明确限制。 | [Q04](../../plugins/slow-stack--mneme--dsh-mneme/INSIGHT.md#research-q04) 非敏感单项目备份后试核心记忆，保持actionRun关闭并明确自动工作开关；验证任务结果和持久状态，串用/误记/超预算则关闭自动工作退手工文档，退出单独处理持久库。 |
| [dsh-mnemon](#plugin-1329424520-root) | 为 DSH 提供可组合的分层记忆、按回合固定的视图及受控读写。 | [Q05](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q05) 在两个隔离工作区用虚构资料比较现有项目说明。 |
| [dsh-moli](#plugin-1415767842-root) | 将本地 Moli 无头浏览器接入 DSH，提供渲染抓取、选择器读取、截图、PDF与引擎探测。 | 建议观察；先在隔离宿主准备已审引擎并设严格TLS，核对公开页面与退出；敏感登录、共享宿主和高可信取证应暂缓。 |
| [dsh-obsidian](#plugin-1335613118-root) | 将 DSH 连接到本地 Obsidian 笔记库，提供搜索、反链、属性和文件操作。 | 先在独立低权限环境使用无符号链接的非敏感副本，仅核对查询与反链。 |
| [dsh-obsidian-board](#plugin-1415116420-root) | 在DSH三栏面板以本地BM25检索Obsidian笔记，复用宿主模型流式回答、点引用读源并保存回答。 | 先观察，非敏感可信个人库和限定模型通道对照。 |
| [dsh-plugin-academic-writing](#plugin-1336663456-root) | 为DSH提供论文骨架、题目摘要模板、引用和LaTeX片段，以及词法表达、Markdown结构、术语和投稿清单辅助。 | 观察，先修计数/无作者引用/TeX列等基础分支，只当草稿工具，不作学术或投稿验收。 |
| [dsh-plugin-audit](#plugin-1336223158-root) | 同步 GitHub topic/npm 元数据并评分排行，按需对单插件做有限静态安全扫描。 | 只把分数作线索，确认扫描文件覆盖/错误状态后再读固定 SHA 源码、验证安装；详见[Q03](../../plugins/863683348--dsh-plugin-audit/INSIGHT.md#research-q03)。 |
| [dsh-plugin-finance-data](#plugin-1336663504-root) | DSH Agent 的确定性金融算术工具，但比率文本、跨年定投和组合再平衡路径存在可核不一致。 | 修复关键路径前不用于真实决策；以 10/100 比率、2 年月投和组合偏离样本验每个 action。 |
| [dsh-plugin-tavily](#plugin-1334654243-root) | 接管 DSH web_search 的 Tavily provider，并提供可选提取服务、设置卡和主机探测路由。 | 待修复缓存与 keyless；需用真实凭据在受控 Profile 验证搜索/提取/回退及 API 权限；详见[Q03](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md#research-q03)。 |
| [dsh-plugin-verify](#plugin-1336684054-root) | 通过关键词行号、JSON/YAML检查、URL/npm/GitHub探测及有界批量输出，提供核查线索和元数据。 | 先观察，作线索而非证实/安全通行证，先修证据语义/覆盖与网络范围再评估。 |
| [dsh-purge](#plugin-1424538914-root) | 为本机 DSH 提供提示词与宿主补丁管理、状态回滚和演练台资产记录。 | 观察：只供能检查权限/文件/加载链的研究者先阅读，后续实验需可整体丢弃的离线副本；不在日常DSH当被动插件试用。 |
| [dsh-quant](#plugin-1335718387-root) | DSH 量化研究工具集，提供行情、指标、回测、风险与执行模拟及结构化研究报告管线。 | 观察。 |
| [dsh-read-url](#plugin-1335047324-root) | 读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。 | 适合用公开网页查资料并愿意核对原来源的人在独立profile试用，先明确提供方缺失时的网络回退权限，默认不加直连例外；缺页、政策误绕过或预算失控时停用。 |
| [dsh-run2skill](#plugin-1339317132-root) | 从 DSH 会话提炼可审查的 Skill 提案，确认后按作用域发布。 | [Q03](../../plugins/qkycir-123--dsh-run2skill/INSIGHT.md#research-q03) 先显式生成项目草稿，核对下次用法后再扩展。 |
| [dsh-science](#plugin-1333737063-root) | 为DSH组织研究记录、版本化产物和SSH/SLURM远程任务，附科学Skills与模型路由依赖。 | [Q06](../../plugins/biociao--dsh-science/INSIGHT.md#research-q06)观察；低敏本地记录先核，远端需私有Host/独立账户与唯一scratch，未知回手工对账。 |
| [dsh-scrape-webpage](#plugin-1334269686-root) | 抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。 | 适合公开、无需登录且正文可抽查的研究页面小范围试用；登录态、强脚本渲染或付费墙继续使用宿主浏览器。 |
| [dsh-search](#plugin-1423253220-root) | 以 DeepSeek Search/Fetch API 提供检索、正文抓取和多页研究工具。 | 可用公开、非敏感查询小范围试用；先设 count/N 上限并以 100 个查询对照内置搜索的召回、正文成功率与实际账单。 |
| [dsh-sidebar-qa](#plugin-1334369459-root) | 在 DSH 右侧栏划选提问，按上下文策略创建同工作区独立追问会话，并可追加引文到草稿。 | 先用已知答案的小片段核子会话工作区、实际模型和背景；重要早期约束手工附原文。 |
| [dsh-sticky-note](#plugin-1333476862-root) | 在DSH对话内保存Markdown便签并送入当前输入框，带历史、归档与自动清理。 | [Q05](../../plugins/meredith2328--dsh-sticky-note/INSIGHT.md#research-q05)低敏私人Host受限试用；先关清理、备份、append并核实际读回。 |
| [dsh-stock-market](#plugin-1331846104-root) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。 |
| [dsh-tabbit](#plugin-1334076307-root) | 将 Tabbit 浏览器任务、网页抓取和标签提及接入 DSH，并为页面访问设置审批。 | [Q03](../../plugins/tabbit-browser--dsh-tabbit/INSIGHT.md#research-q03) 先试独立实例中的合成页面。 |
| [dsh-tavily-web](#plugin-1369301269-root) | 提供 Tavily 多密钥轮询检索工具，以及通过宿主 shell 的 curl 网页正文抓取工具。 | 在不含敏感查询的固定任务集试用，先限制凭据数与调用预算，核对返回URL、网页状态和正文。 |
| [dsh-teaching-board](#plugin-1358319839-root) | 在 DSH 会话中展示 HTML 板书，支持圈画、方向选择及把截图作为图片消息回传。 | 先观察并补齐消息来源和提交确认，再以非敏感课程在隔离 profile 检查四工具、增量更新和截图反馈；成功需图片进入正确会话且不覆盖用户草稿。 |
| [dsh-thoughtdag](#plugin-1160354976-dsh) | 将 ThoughtDAG 图形画布嵌入 DSH 并桥接会话读取和写回。 | [Q04](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q04) 用隔离会话并核对引用；不明写回先回原文。 |
| [dsh-timeline](#plugin-1336817611-root) | 在DSH会话中提供时间轴定位、收藏文件夹、提示词/闪记与多格式内容导出。 | 当前观察；无秘密非唯一副本会话试定位/收藏，刷新核持久，导出对轮数和附件再离线打开。 |
| [dsh-trend-radar](#plugin-1336582509-root) | 按需采集 GitHub dsh-plugin topic/awesome 快照并生成趋势报告、关键词雷达和实验性 Web 面板。 | 先隔离建立空目录并复核首轮成功，再核查报告采样分母与类别映射；勿把 top100 榜当全生态。 |
| [dsh-ultramath](#plugin-1337487779-root) | 同步数模竞赛主控/角色预设、模型库与论文模板。 | 只在备份同名 DSH 目录的隔离 profile 试点；按题目核数据、模型、数值和论文，不以提示门禁代替独立验收。 |
| [dsh-visualize](#plugin-1333132287-root) | 在 DSH 对话中生成、更新交互式 HTML 卡片与独立页面，支持图片嵌入和本机交互状态保存。 | 先在个人、非敏感会话中用一张已知答案的卡片检查参数变化、刷新和局部修订。 |
| [dsh-web-search-free](#plugin-1340558027-root) | 为 DSH 原生网页搜索与抓取提供多引擎轮换、并行策略、缓存及设置界面。 | 公开查询先单Key/fallback，核回源、页面完整与实际调用费用，再考虑第二源和并行。 |
| [dsh-wsl-obscura](#plugin-1358313559-root) | 在 WSL 中为 DSH 接入 Obscura 无头页面抓取、版本检查和 MCP 接线提示。 | 在隔离环境试非敏感公开网页，禁用私网和 eval；用静态请求或受控浏览器退出。 |
| [dsh-wsl-obsidian](#plugin-1380817560-root) | 让 WSL 中的 DSH Agent 搜索、读写 Windows Obsidian 笔记并打开桌面应用。 | [Q03](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md#research-q03) 先从复制库核路径、搜索与桌面打开。 |
| [dsh-wsl-vecmem](#plugin-1381726438-root) | 通过 Ollama 嵌入向量保存和检索 DSH 中的项目短记。 | [Q04](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q04) 先隔离存储路径并保留原件。 |
| [dsh-zotero](#plugin-1334739972-root) | 让 DSH 通过本地 Zotero API 检索、读取、定位和导出文献，提供文献界面及可选审批写入。 | 先做现有副本库的只读试用，保持写入与外部学术组件关闭；核对原文和截断后再使用引用。 |
| [dshfind](#plugin-1333082908-root) | 围绕 DeepSeek Harness 的插件发现、学习和社区网站。 | [Q04](../../plugins/hikariming--dshfind/INSIGHT.md#research-q04) 将目录当候选入口，安装前回固定源码核权限和兼容；来源或安全条件不明就停止。 |
| [EduWork Literature](#plugin-1369398336-packages-dsh-literature) | 为 DSH 提供 DBLP、arXiv 文献搜索、BibTeX 和可访问全文提取。 | 先用公开论文核对来源和引用；部分失败及取消后回原站和目录确认。 |
| [Envoy](#plugin-1262941478-integrations-dsh-envoy-dsh) | DSH 子包注册 Envoy Skill、MCP 和链接读取提示，输出可定位资料。 | [Q03](../../plugins/regrevia--envoy--integrations-dsh-envoy-dsh/INSIGHT.md#research-q03) 固定链接同预算人工对照。 |
| [GeoChat 画布](#plugin-959005755-plugins-deepseek-harness) | 让 DSH 模型操作会话右侧的 GeoGebra 画布 | [Q04](../../plugins/tiwe0--geochat--plugins-deepseek-harness/INSIGHT.md#research-q04) 使用固定 Web 版本对照双会话与断流。 |
| [GLM-5.3-Flash J-Space能力报告](#plugin-1335867536-root) | 介绍J-Space选择性加载、任务状态记录与恢复协议，并汇总作者报告的基准估计。 | 长任务Agent研究者可阅读报告并提取状态外化与恢复的验证问题；先取得原始套件固定提交和任务级数据，不把README安装指令当作本仓库已提供实现；关键材料未补齐前仅观察。 |
| [Graph Memory](#plugin-1178312395-root) | 为 DSH 和 OpenClaw 压缩历史上下文，以图与向量导航召回原始问答并持久保存记忆。 | [Q04](../../plugins/adoresever--graph-memory/INSIGHT.md#research-q04) 个人非敏感任务用副本库对照；审计或多租户任务先保留原历史并验证隔离。 |
| [Hanai Worth 值见](#plugin-1334675451-root) | 将行情快照、研究会话与可校验报告归档集中在独立 DSH 工作台 | [Q04](../../plugins/hancao97--hanai-investment-dsh/INSIGHT.md#research-q04) 用虚构历史材料确认缓存、封存与迁移。 |
| [hello-dsh](#plugin-1333303761-root) | 提供中文 DSH 入门教程、示例 Skill 和最小代码插件。 | [Q03](../../plugins/pingfanfan--hello-dsh/INSIGHT.md#research-q03) 先用临时环境和单个固定示例。 |
| [hn](#plugin-1211255316-root) | 在终端浏览 Hacker News 故事和评论，并提供可选翻译。 | [Q03](../../plugins/heartleo--hn-cli/INSIGHT.md#research-q03) 先用公开帖子并核模型端点；内容不全或不接受外发时返回网页和原文。 |
| [Jacobian](#plugin-1309745037-root) | 为 Agent 提供可搜索的数学操作、执行结果和类型化接口。 | [Q03](../../plugins/morluto--jacobian/INSIGHT.md#research-q03) 先检查后端和操作合同，以已知题及独立方法对照；结果不完整或不一致则停止依赖。 |
| [KRouter](#plugin-1341648244-root) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | 有条件试用lookup-only。 |
| [last30days-cn](#plugin-1196982492-root) | 检索中文平台近期讨论与热榜，整理附原始来源的研究结果。 | [Q04](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md#research-q04) 先在授权范围内选公开来源并检查状态和原文；覆盖不足时停止总体结论。 |
| [Learn Harness Engineering](#plugin-1195243030-root) | 项目式编码 Agent 工程课程，提供状态、验证、范围与跨会话恢复教材、示例和脚手架 Skill。 | 适合已经遇到跨会话丢状态或提前报完成的开发者，先选一个真实失败，在项目副本上加入最少文件，并用相同任务比较前后。 |
| [Market Research Cockpit](#plugin-1303848201-root) | 聚合行情、板块、新闻及市场研究数据，提供看板和 MCP 工具。 | [Q04](../../plugins/thebiggavin--marketingdashboard/INSIGHT.md#research-q04) 仅作研究线索并核对原始数据、时间与字段；发现数据过期或指标变化时停止使用。 |
| [MCP-for-Stata](#plugin-956330003-root) | 让宿主Agent调用本地Stata与数据/日志工具，保存来源快照和执行审计；默认保护、真实安装确认与研究结果验收须分别核查。 | 已有合法Stata与方法能力，匿名本地副本、不用unsafe安装；确认guard、目录、资源/timeout实际配置，按已知答案核结果再扩大，见[Q04](../../plugins/sepinetam--mcp-for-stata/INSIGHT.md#research-q04)、[Q05](../../plugins/sepinetam--mcp-for-stata/INSIGHT.md#research-q05)。 |
| [Memmy Agent](#plugin-1302496224-root) | 提供本地记忆服务、桌面及 CLI，并生成宿主适配以支持跨会话上下文。 | [Q05](../../plugins/memtensor--memmy-agent/INSIGHT.md#research-q05) 在隔离 profile 和非敏感项目先对照手工，检查模型和服务状态。 |
| [Memory Eternal](#plugin-1351908966-root) | 跨会话沉淀和审阅知识卡，并提供核心记忆与用量账本 | [Q04](../../plugins/eternalnight996--memory-eternal/INSIGHT.md#research-q04) 以隔离 vault 和虚构数据验证审核、检索和核心注入。 |
| [memsearch](#plugin-1153190876-root) | 为 Markdown 文件提供语义与关键词混合检索，支持增量索引、实时监视及多种嵌入后端。 | [Q04](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q04) 对资料副本建独立集合，核对固定题集和原文。 |
| [MemSearch for DeepSeek Harness](#plugin-1153190876-plugins-dsh) | 为 DeepSeek Harness 捕获会话记忆、检索共享 Markdown 日记并在 Web 面板审阅技能候选。 | [Q04](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q04) 先只处理无敏感内容的测试决策，逐项核对日记、检索和原会话。 |
| [Meow Memory](#plugin-1333986968-root) | 为 DeepSeek Harness 提供分层、跨会话项目记忆和自动整理。 | [Q03](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q03) 仅用非敏感项目比较注入和下一普通轮模型，不清楚时停用 delegate 与读入。 |
| [Mimir](#plugin-1340749561-root) | 在DSH中组织文献、论文编译、实验和研究记录，提供工具与工作台，编译或任务状态不替代研究结果核验。 | [Q04](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q04) 现有DSH用户从本地论文副本编译诊断试用，核实际PDF与源修改；远端unknown不自动重提。 |
| [MindMemOS](#plugin-1278033467-root) | 提供长期记忆服务、检索与写入接口，并通过CLI和Agent插件共享跨会话记忆。 | 有记忆服务运维能力且有跨任务复用需求的团队可用非敏感双用户样本试用；先核对身份、最终写回和错误恢复；若混用范围与纠错无法确认，继续明确的项目笔记或手动记忆。 |
| [MinerU文档解析桥](#plugin-1328601495-root) | 把本地文档上传到外部MinerU服务，通过DSH模型工具查询异步任务并返回Markdown/结果路径。 | [Q03](../../plugins/huanlinoto--dsh-plugin-mineru/INSIGHT.md#research-q03)观察；可信服务和可丢弃小样前提下人工核验，不敏感批量无人值守。 |
| [Mnemon](#plugin-1162230313-root) | 为 Agent 提供由宿主模型监督的本地持久记忆、图关联、意图检索与生命周期管理 CLI。 | [Q04](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q04) 先在非敏感副本库试用 Memory CLI，明确指定库并保留笔记备份。 |
| [ModLens](#plugin-1163808211-root) | 给 DSH 文本模型接入视觉工具，将截图或图表转换成结构化证据。 | [Q05](../../plugins/liustack--modlens/INSIGHT.md#research-q05) 只在隔离且允许单一批准端点的环境用虚构截图。 |
| [ModSearch](#plugin-1163808542-root) | 为 DSH 提供多引擎网页搜索、X 搜索和页面读取。 | 先用公开查询核对目标引擎、输出和引用，再检查代理与管理权限。 |
| [Molio DSH 知识库插件](#plugin-1259108597-packages-dsh-plugin-molio) | 让 DSH 通过只读工具列出、搜索和读取 Molio 本地知识库。 | [Q04](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md#research-q04)本机小库固定id，先搜索再核原文，异常回界面/CLI。 |
| [Multisim MCP for DSH](#plugin-1327922805-integrations-deepseek-harness) | 将 Multisim MCP 的电路诊断和实验工具接入 DeepSeek Harness。 | 先用已知理论的 RC 测例核工具、模型、输出与真实量测，未知时回到人工，见 [Q04](../../plugins/yxy050208--multisim-mcp--integrations-deepseek-harness/INSIGHT.md#research-q04)。 |
| [Oh My Knowledge](#plugin-1190633989-root) | 面向 AI 工作记录的知识提取、维护和载体评测工具集。 | [Q04](../../plugins/lizhiyao--oh-my-knowledge/INSIGHT.md#research-q04) 先用可信非敏感材料复核来源和模型目标；无法验证来源或执行环境不可信时停止。 |
| [Oh-My-DSH](#plugin-1333671427-root) | 提供 DSH 插件分类目录、元数据快照与检索站点。 | [Q03](../../plugins/like-study1--oh-my-dsh/INSIGHT.md#research-q03) 先在固定快照查找目标，再到候选固定源核对身份、入口及权限。 |
| [OpenContext](#plugin-1329484633-root) | 面向Agent应用的记忆、检索和图修订基础设施，提供库facade及MCP/HTTP入口。 | [Q04](../../plugins/melandlabs--opencontext/INSIGHT.md#research-q04) 先loopback单用户只读及dryRun，再由host加授权。 |
| [OpenQuantum](#plugin-1335086034-root) | 面向 DeepSeek Harness Desktop 与 Codex 的量子研究 Skills 和 Tools | [Q04](../../plugins/xi-zhao--openquantum/INSIGHT.md#research-q04) 仅隔离Home试支持域的重复复核任务，保留原SDK和结果包，先验失败/停止/回退。 |
| [OpenViking Memory for DeepSeek Harness](#plugin-1128123594-examples-dsh-memory-plugin) | 为 DeepSeek Harness 提供 OpenViking 自动召回、会话采集、URI 工具保护和 MCP 接入。 | [Q04](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q04) 先在独立 profile 用公开事实核对普通召回、MCP 与项目权限。 |
| [PaperMachine](#plugin-1345235144-root) | 本地运行 Python/R 并以版本化产物和来源记录支持审阅的科研桌面客户端 | 建议有限试用，见 [Q05](../../plugins/superjj007--papermachine/INSIGHT.md#research-q05)：macOS上先以去敏且已有正确答案的小CSV验证执行轨迹、版本、人工编辑和备份恢复。 |
| [PatentRadar](#plugin-1230059993-root) | 从公开专利号组织竞品候选、技术特征对照和公开证据线索，供人工复核。 | 仅用公开、可回源案例验证一份线索表；不能支持具体特征时回到人工检索。 |
| [Polaris](#plugin-1309135706-root) | 独立桌面/Python研究工作台，以持久Voyage驱动真实实验执行与模型反思迭代；预算审批是条件开关，运行指标和自验证不等独立科研真值。 | 可丢弃合成已知答案任务，借已核API显式confirm_budget与正max_hours，固定允许模型/Runner资源；当前创建Modal未提交确认字段，不把默认GUI当有预算人工门，见[Q03](../../plugins/zju-real--polaris/INSIGHT.md#research-q03)。 |
| [ProMentor](#plugin-1318330553-root) | 通过Agent Skill把项目组织为讲义、源码导读、Lab与行为测试，配JSON进度和可选Dashboard。 | [Q05](../../plugins/lyn-77--promentor/INSIGHT.md#research-q05) 观察一章非敏感副本；先审命令和题目，再独立迁移验证，读边界修复前不远程共享。 |
| [ReMe DSH 插件](#plugin-849121458-integrations-dsh) | 为 DSH 接入 ReMe 按需检索、自动记忆与每日整理，并提供状态界面。 | 先用虚构内容和本机假服务分别检查收到明确成功和空 2xx 时的入队／出队，再核查停用与工作区；服务记录与出队不一致就停用。 |
| [ReMe 记忆工具](#plugin-849121458-root) | 以可读 Markdown 文件、检索与自动整理为 Agent 提供可共享的长期记忆。 | [Q04](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q04) 从隔离目录和少量可纠正事实开始，回读原文。 |
| [SandBase Skills](#plugin-1315919904-root) | 提供可移植 Agent 工作流技能集合，含 DSH 目录挂载、单技能复制工具和多源研究证据账本样本。 | [Q04](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q04) 可在测试项目只取multi-source-search，预读资源并对一个不敏感主张试用；用真实能力名，不为通过伪造第二来源。 |
| [SourceDeck / 资料台](#plugin-1422910686-root) | 在 DSH 侧栏进行后台资料研究、候选筛选与对比，并将保留资料作为快照引用回对话。 | 固定RC后隔离试用，先核候选事实及草稿/附件引用，失败回到书签和手工引用。 |
| [Stock Analysis Plugin](#plugin-1238532570-root) | 多宿主证券研究工具集，共享 Python 行情、筛查与回测能力，另有 DSH 专用分发。 | 只在隔离 Profile 用已许可的固定样本核对复盘。 |
| [StudyHub](#plugin-1367673687-root) | 把讲义等资料生成有来源的练习题，支持复习、题库与音频转录。 | [Q04](../../plugins/ericwang1358--dsh-web-studyhub/INSIGHT.md#research-q04) 用可外发资料先生成少量题并人工核对。 |
| [StudyMate](#plugin-1374986657-root) | 为自学任务提供学习预设、课件与练习、答疑和独立学习工作区。 | [Q03](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q03) 限独立工作区试一课，核教材和迁移题，发现错误立即停自动推进。 |
| [Tydora](#plugin-1274335260-root) | 本地 Markdown 编辑与知识库应用，组合所见即所得编辑、双链图谱、画布、思维导图和静态站点构建。 | [Q03](../../plugins/zuorn--tydora/INSIGHT.md#research-q03) 复制小库单writer试用并核格式diff；Agent先只读，公开导出只用已核样例。 |
| [Vibe Mathematics](#plugin-1319853777-root) | 为 DSH 提供多代理数学研究预设，支持任务、表决和形式化检查。 | 先观察配置和证据链，只用已知题核对所有步骤。 |
| [WeKnora](#plugin-1024118326-root) | 面向团队文档的知识服务，提供检索问答、Agent 推理和 Wiki 管理。 | [Q05](../../plugins/tencent--weknora/INSIGHT.md#research-q05) 先取十几条含正例、无依据和越权哨兵的手册问题，关闭网络检索，确认模型和资料的权限边界。 |
| [WeKnora DSH 连接器](#plugin-1024118326-packages-dsh-weknora) | 让 DeepSeek Harness 在 WeKnora 知识库中检索片段、补读文档和请求综合问答。 | [Q05](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q05) 先用受限 retrieve 凭据和非敏感资料配置内部资源句柄，关闭 ask。 |
| [WeKnora 会话归档](#plugin-1412897932-root) | 将 DSH 会话摘要增量写入 WeKnora，并观察文档解析状态。 | [Q04](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q04) 测试先给已有库 ID 并关闭精炼。 |
| [WSL Playwright 页面读取](#plugin-1381860363-root) | 在 DSH 中通过无头 Chromium 读取网页标题、状态或正文。 | [Q04](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md#research-q04) 先用隔离环境核对依赖、出站和正文，之后再决定是否纳入会话工具。 |
| [乔木 RSS](#plugin-1396833540-root) | 把 RSS 订阅阅读、版本切换和带原文的伴读放进 DSH | [Q04](../../plugins/joeseesun--qiaomu-rss-dsh/INSIGHT.md#research-q04) 先用公开或虚构 RSS，保持实验室关闭。 |
| [乔木 UI 学习](#plugin-1435757109-root) | 在 DSH 浏览设计参考、学习UI词汇与测验，并保存点评和Markdown。 | [Q03](../../plugins/joeseesun--qiaomu-ui-learn-dsh/INSIGHT.md#research-q03) 先独立目录验证一条笔记。 |
| [刷 B 站（子代理版）](#plugin-1425127697-root) | 让 DSH 伙伴派子代理搜索 B 站、阅读字幕与评论，形成内部报告并按配置传递给用户。 | 保留观察。 |
| [灵枢（Lingshu）](#plugin-1334211162-root) | 把 DSH 会话接入 Markdown 认知图，支持长期记忆、检索与反思。 | 先用合成会话与临时根，核对 guest 拒写和可追溯召回。 |

<a id="plugin-1390987906-root"></a>

## [@240xu/dsh-session-search](../../plugins/240xu--dsh-session-search/INSIGHT.md)

[![npm 30d 1,752](https://img.shields.io/static/v1?label=npm+30d&message=1%2C752&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-session-search) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-session-search)

> **用途**：本地单人用户按关键词找历史会话，合格交付为可核原文的session/seq定位，不是语义答案。

> **亮点**：将压缩会话读取、遮蔽过滤和seq定位接入面板/Agent，减少人工解压搜索；算法为成熟子串检索。参见[Q01](../../plugins/240xu--dsh-session-search/INSIGHT.md#research-q01)。

> **思考**：全文名称不能覆盖每消息500字符外；坏日志保旧且无陈旧标识，可能在遮蔽后重扫失败时继续给旧片段。参见[Q02](../../plugins/240xu--dsh-session-search/INSIGHT.md#research-q02)。

> **建议**：未验证假设是全文分块与查询可见新鲜度，默认排除陈旧项；以尾部词/撕裂日志对照覆盖与资源。参见[Q04](../../plugins/240xu--dsh-session-search/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/240xu--dsh-session-search/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340340493-root"></a>

## [@240xu/dsh-websearch](../../plugins/240xu--dsh-websearch/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/240xu/dsh-websearch) [![npm 30d 4,731](https://img.shields.io/static/v1?label=npm+30d&message=4%2C731&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-websearch) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-websearch)

> **用途**：公开资料检索希望减少后端切换并对单服务失败软降级。详见[Q01](../../plugins/240xu--dsh-websearch/INSIGHT.md#research-q01)。

> **亮点**：将多搜索服务、查询/结果策略与故障遥测接入一个宿主provider，减少使用者切换接线。详见[Q01](../../plugins/240xu--dsh-websearch/INSIGHT.md#research-q01)。

> **思考**：缓存不含多项策略及端点，URL全小写去重可能误合并，历史留原始查询；备用实例还接收同一可选密钥。详见[Q04](../../plugins/240xu--dsh-websearch/INSIGHT.md#research-q04)。

> **建议**：可研究完整策略指纹、合并来源链及总预算约束扇出，用固定反例比较误合并、召回与总成本。当前未验证。详见[Q07](../../plugins/240xu--dsh-websearch/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/240xu--dsh-websearch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335046216-packages-rss"></a>

## [@hyzyn/dsh-rss](../../plugins/hyzyn--dsh-plugin-kit--packages-rss/INSIGHT.md)

[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 3,743](https://img.shields.io/static/v1?label=npm+30d&message=3%2C743&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-rss) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-rss)

> **用途**：已有稳定资讯源、需要在DSH回顾和引用条目的人可将多源结果整理为本地日报；合格结果须能回原文并区分发布时间与生成日期，见 [Q01](../../plugins/hyzyn--dsh-plugin-kit--packages-rss/INSIGHT.md#research-q01)。

> **亮点**：已有增量是把阅读入口和会话引用连到自动汇总，并把单源失败与全源失败分开处理，避免网络故障直接写成无新闻。标题“值得读”不代表已评质量，净收益未测，见 [Q01](../../plugins/hyzyn--dsh-plugin-kit--packages-rss/INSIGHT.md#research-q01)和[Q02](../../plugins/hyzyn--dsh-plugin-kit--packages-rss/INSIGHT.md#research-q02)。

> **思考**：AI只读feed摘要截断而非文章全文，缓存按同链接等身份复用，不比较内容、模型或提示词变化；同链接更正可能仍显示旧摘要。“今日”也只是生成日期，不保证新闻当天发布，见 [Q01](../../plugins/hyzyn--dsh-plugin-kit--packages-rss/INSIGHT.md#research-q01)和[Q03](../../plugins/hyzyn--dsh-plugin-kit--packages-rss/INSIGHT.md#research-q03)。

> **建议**：未验证方向是将缓存绑定内容与生成规则版本，分开显示日报日期与条目日期，让更正可回查；需要比较正确引用、额外调用与维护负担，见 [Q06](../../plugins/hyzyn--dsh-plugin-kit--packages-rss/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/hyzyn--dsh-plugin-kit--packages-rss/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335046216-packages-search"></a>

## [@hyzyn/dsh-search](../../plugins/hyzyn--dsh-plugin-kit--packages-search/INSIGHT.md)

[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 4,254](https://img.shields.io/static/v1?label=npm+30d&message=4%2C254&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-search) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-search)

> **用途**：可信本机DSH用户需要找回既有消息、Prompt或设置位置，可用统一面板减少跨入口寻找，合格交付仍须正确打开和回看上下文，见[Q01](../../plugins/hyzyn--dsh-plugin-kit--packages-search/INSIGHT.md#research-q01)。

> **亮点**：贡献是把四类既有资源和导航组织为一个键盘入口，并兼顾本地候选、旧响应丢弃及可见会话过滤；净找回效果未测，见[Q01](../../plugins/hyzyn--dsh-plugin-kit--packages-search/INSIGHT.md#research-q01)和[Q02](../../plugins/hyzyn--dsh-plugin-kit--packages-search/INSIGHT.md#research-q02)。

> **思考**：FTS和回退扫描的事件范围、排序与覆盖不同，内部超时截断未进入公开结果；空清单不能证明没有记录，见[Q03](../../plugins/hyzyn--dsh-plugin-kit--packages-search/INSIGHT.md#research-q03)。

> **建议**：未验证方向是将检索模式、覆盖与失败状态传到界面，并统一FTS/回退口径；应以冷历史和失败样本比较漏检误判与额外负担，见[Q06](../../plugins/hyzyn--dsh-plugin-kit--packages-search/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/hyzyn--dsh-plugin-kit--packages-search/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1218688296-root"></a>

## [AgentKey](../../plugins/chainbase-labs--agentkey/INSIGHT.md)

[![GitHub ★ 659](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=659&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chainbase-labs/Agentkey)

> **用途**：需要多个社媒或网页数据源的Agent用户，希望少管理账号与工具目录。

> **亮点**：[Q01](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q01) 与 [Q02](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q02) 支持把动态工具发现、参数确认与统一接入写成可复用操作规范；托管服务覆盖和统一计费增益仍是作者主张。

> **思考**：[Q02](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q02) 关键CLI和服务不在固定实现中，Mounted不能证明工具连接；[Q03](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q03) 预算规则属于指令约定，不能当服务硬额度。

> **建议**：[Q04](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q04) 提出绑定工具版本、费用和调用回执的审查链，尚未验证；若仍无法复核来源与消费则否定。

[查看完整分析](../../plugins/chainbase-labs--agentkey/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333247282-root"></a>

## [AnySearch for DSH](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md)

[![GitHub ★ 663](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=663&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anysearch-team/anysearch-dsh) [![npm 30d 10,592](https://img.shields.io/static/v1?label=npm+30d&message=10%2C592&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anysearch/anysearch-dsh) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anysearch/anysearch-dsh)

> **用途**：DSH研究用户需要并行获取多个角度的公开网页与垂直领域材料，最终事实仍需来源核对。

> **亮点**：[Q01](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q01) 与 [Q02](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q02) 支持保留宿主原生入口同时新增可发现垂直参数及有界并发，减少手工安排多次查询；实际检索效果未测。

> **思考**：[Q03](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q03) 远端额度和索引质量决定最终效果，五项并发仍是五次请求；无URL结构数据不能被当作可引用网页证据。

> **建议**：[Q04](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q04) 提出按来源独立性和可引用性汇合批结果并呈现缺证，尚未验证；若只增加重复结果或人工核对则否定。

[查看完整分析](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1304997851-root"></a>

## [Argo](../../plugins/taxueseek--argo/INSIGHT.md)

[![GitHub ★ 220](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=220&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/taxueseek/argo) [![npm 30d 1,572](https://img.shields.io/static/v1?label=npm+30d&message=1%2C572&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/argo-search) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/argo-search)

> **用途**：需要跨领域/语言查证公开信息的Agent开发者可以统一收集搜索结果和原文线索，再自行完成事实判断。

> **亮点**：[Q01](../../plugins/taxueseek--argo/INSIGHT.md#research-q01)、[Q02](../../plugins/taxueseek--argo/INSIGHT.md#research-q02) 把多源调度、失败分类、口径分组排名与Agent消费接口组合，减少调用侧分别接源的工作；成熟RRF与作者覆盖数不等原创算法或实际研究收益。

> **思考**：[Q02](../../plugins/taxueseek--argo/INSIGHT.md#research-q02)、[Q03](../../plugins/taxueseek--argo/INSIGHT.md#research-q03) 引擎共识不等独立证据，质量guard可降级，缺日期的时间窗可能未过滤。超时返回不保证尾部远端请求停止，默认本地并入也要求明确数据范围。

> **建议**：[Q04](../../plugins/taxueseek--argo/INSIGHT.md#research-q04) 可比较引擎共识与独立发布者/原文覆盖的分离说明，检验转载镜像是否导致错误共识，并计核验成本；未审计全仓账本也不声称全新来源机制。

[查看完整分析](../../plugins/taxueseek--argo/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1304997851-packages-dsh-plugin"></a>

## [Argo DSH](../../plugins/taxueseek--argo--packages-dsh-plugin/INSIGHT.md)

[![GitHub ★ 220](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=220&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/taxueseek/argo) [![npm 30d 1,896](https://img.shields.io/static/v1?label=npm+30d&message=1%2C896&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@taxueseek/argo-dsh) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@taxueseek/argo-dsh)

> **用途**：需要在现有DSH任务中检索和比较多视角证据的用户，可调用原生工具和研究编排。

> **亮点**：[Q01](../../plugins/taxueseek--argo--packages-dsh-plugin/INSIGHT.md#research-q01) 支持将多种检索通道与受限多轨道组织接入原生DSH；[Q02](../../plugins/taxueseek--argo--packages-dsh-plugin/INSIGHT.md#research-q02) 的阶段和账本是集成增量，不等依赖内容/引用绑定已完整。

> **思考**：[Q02](../../plugins/taxueseek--argo--packages-dsh-plugin/INSIGHT.md#research-q02) 核实阶段未传前序结果、轨道sourceKeys从未赋key的对象读取；[Q03](../../plugins/taxueseek--argo--packages-dsh-plugin/INSIGHT.md#research-q03) 闸门在综合后启发式计算，新宿主分支也不能据本地guard推全部工具白名单。

> **建议**：[Q05](../../plugins/taxueseek--argo--packages-dsh-plugin/INSIGHT.md#research-q05) 提议将前序证据显式传入依赖轨道，并在综合前检查轨道结论到S编号映射；如质量不升或上下文/盲从成本抵消收益，就否定，尚未实现。

[查看完整分析](../../plugins/taxueseek--argo--packages-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1321280738-root"></a>

## [Awesome AI Pedia](../../plugins/awesome-ai-pedia--awesome-ai-pedia/INSIGHT.md)

[![GitHub ★ 583](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=583&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia)

> **用途**：需要查找中文 AI 工具或 DSH 介绍并回源的读者。

> **亮点**：[Q01](../../plugins/awesome-ai-pedia--awesome-ai-pedia/INSIGHT.md#research-q01) 形成中文主题组织，[Q02](../../plugins/awesome-ai-pedia--awesome-ai-pedia/INSIGHT.md#research-q02) 以目录生成导航；不提供 DSH 运行能力。

> **思考**：[Q03](../../plugins/awesome-ai-pedia--awesome-ai-pedia/INSIGHT.md#research-q03) 文章中的绝对化陈述未绑定明确源码版本，站点忽略死链，需逐项回源。

> **建议**：[Q05](../../plugins/awesome-ai-pedia--awesome-ai-pedia/INSIGHT.md#research-q05) 通过版本与复核日期提示过期风险，仍需验证维护与效果。

[查看完整分析](../../plugins/awesome-ai-pedia--awesome-ai-pedia/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1330942675-root"></a>

## [Awesome DeepSeek Harness](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md)

[![GitHub ★ 1,260](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C260&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0xsline/awesome-deepseek-harness)

> **用途**：帮助DSH用户按任务发现候选仓库；本身是目录资源，不是可安装插件。[Q01](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md#research-q01)

> **亮点**：以双语场景分类与人工补充降低公开topic发现的筛选负担；不提供条目安装或可靠性认证。[Q01](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md#research-q01)

> **思考**：topic最多1000条、私有hub需权限、CATALOG日期较旧，不能把全量标题作为当前完整覆盖证明。[Q02](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md#research-q02)

> **建议**：未验证方向是逐来源展示固定版本、分页截断与失败范围，帮助读者区别未收录与未能检查。[Q04](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333173677-root"></a>

## [Awesome DeepSeek Harness](../../plugins/dominic789654--awesome-deepseek-harness/INSIGHT.md)

[![GitHub ★ 414](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=414&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Dominic789654/awesome-deepseek-harness)

> **用途**：需要为 DSH 找记忆、界面或其他扩展，却还不知道项目名时，可以从任务分类拿到一组可回源的候选。

> **亮点**：项目把跨类型候选组织成可直接浏览的双语索引，并为部分精选保留原帖线索。新增重复的检查按分类和语言与基线对比，能提示新冲突而不要求先清理历史行。其贡献限于候选组织和投稿反馈。见 [Q01](../../plugins/dominic789654--awesome-deepseek-harness/INSIGHT.md#research-q01)、[Q02](../../plugins/dominic789654--awesome-deepseek-harness/INSIGHT.md#research-q02)。

> **思考**：新增校验没有覆盖历史行，也未在可见代码中强制两份 README 成对改动。精选样例还使用随分支移动的安装命令。对兼容性敏感的任务，应先回源确认组件和固定版本。见 [Q02](../../plugins/dominic789654--awesome-deepseek-harness/INSIGHT.md#research-q02)、[Q04](../../plugins/dominic789654--awesome-deepseek-harness/INSIGHT.md#research-q04)。

> **建议**：候选卡若单列组件路径、固定提交与验证状态，可能减少将仓库推荐误读为可安装组件的次数。可用同批任务比较误选率和总人时。见 [Q05](../../plugins/dominic789654--awesome-deepseek-harness/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/dominic789654--awesome-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333171737-root"></a>

## [Awesome DeepSeek Harness Plugins](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md)

[![GitHub ★ 560](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=560&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins)

> **用途**：不知道具体仓库名称的DSH用户，可按能力分类建立待核查候选清单。

> **亮点**：[Q01](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md#research-q01) 将分散仓库按统一分类和列组织，并补充引用线索；贡献是发现资源整理，非模型工具或安装验证。

> **思考**：[Q02](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md#research-q02) 动态Star与引用网页数无法证明任务效果或独立性，固定README也没有保存排名输入。不能把893条文档行误写为893个可用插件。

> **建议**：可以推导未验证的任务索引，在候选旁保存其解决的具体失败、固定版本证据、简单替代和一项最小验证结果，并把“链接存在”与“作者声明/源码/真实运行”分开。相对Star和网页数，增量是帮助读者决定哪一项值得进入复核，而不是暗示高热度就可靠。

[查看完整分析](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333183810-root"></a>

## [Awesome DeepSeek Harness Plugins](../../plugins/walkinglabs--awesome-deepseek-harness-plugins/INSIGHT.md)

[![GitHub ★ 52](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=52&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/walkinglabs/awesome-deepseek-harness-plugins)

> **用途**：新开发者理解DSH插件机制，既有用户按一个任务找候选；结果是学习路径/直接仓库链接，见 [Q01](../../plugins/walkinglabs--awesome-deepseek-harness-plugins/INSIGHT.md#research-q01)。

> **亮点**：把官方教学/任务分类与非插件身份区分整合为发现资源，并明确topic/名字不足以收录；这是文档贡献，不是独立验收市场，见 [Q01](../../plugins/walkinglabs--awesome-deepseek-harness-plugins/INSIGHT.md#research-q01)、[Q02](../../plugins/walkinglabs--awesome-deepseek-harness-plugins/INSIGHT.md#research-q02)。

> **思考**：静态筛选政策缺逐项固定审查原件，动态链接/兼容会漂移；verified字样不能代运行/安全保证，教程执行另带依赖与权限，见 [Q02](../../plugins/walkinglabs--awesome-deepseek-harness-plugins/INSIGHT.md#research-q02)、[Q03](../../plugins/walkinglabs--awesome-deepseek-harness-plugins/INSIGHT.md#research-q03)。

> **建议**：未验证方向为按条目公开身份/固定版本/静态/Host任务证据层，用四样本盲读测误判与维护成本，已有简介足够则放弃，见 [Q04](../../plugins/walkinglabs--awesome-deepseek-harness-plugins/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/walkinglabs--awesome-deepseek-harness-plugins/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333844474-root"></a>

## [Awesome DeepSeek Harness Plugins](../../plugins/imsai-sh--awesome-deepseek-harness-plugins/INSIGHT.md)

[![GitHub ★ 359](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=359&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)

> **用途**：插件作者需要提交一条可维护的收录记录，目录维护者要持续审核投稿和生成两份目录，读者可据此定位候选仓库。

> **亮点**：[Q01](../../plugins/imsai-sh--awesome-deepseek-harness-plugins/INSIGHT.md#research-q01) 与 [Q02](../../plugins/imsai-sh--awesome-deepseek-harness-plugins/INSIGHT.md#research-q02) 表明，目录维护者可以用单一条目源数据组织投稿，并把只有一个新增条目的 PR 交给绑定 head 的自动合并流程。实质增量在于让变更范围决定审核分工，并让可浏览条目和安装入口各用自己的判据。低频、单语目录可以保留普通链接表。

> **思考**：[Q03](../../plugins/imsai-sh--awesome-deepseek-harness-plugins/INSIGHT.md#research-q03) 对采用最重要的限制是 PR 通过仅覆盖 Git 中的目录与补丁结构，npm 工件另有静态判据且作者文档声明不核回链。选择插件前仍需核包归属、版本与宿主行为。[Q04](../../plugins/imsai-sh--awesome-deepseek-harness-plugins/INSIGHT.md#research-q04) 另显示同步回执与 README 推送分开，目录提交合并后仍需回读展示。

> **建议**：[Q05](../../plugins/imsai-sh--awesome-deepseek-harness-plugins/INSIGHT.md#research-q05) 可以对照现有标签，将收录依据、可用入口和工件归属证据分别展示，测维护复核次数及读者误判。若错判不降、判断更慢或合法包误判上升，则放弃这一方案；目前未做实验。

[查看完整分析](../../plugins/imsai-sh--awesome-deepseek-harness-plugins/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336739291-root"></a>

## [Awesome DeepSeek Harness Plugins](../../plugins/web-casa--awesome-deepseek-harness-plugins/INSIGHT.md)

[![GitHub ★ 113](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=113&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins)

> **用途**：用户需按用途初步发现 DSH 插件。

> **亮点**：[Q01](../../plugins/web-casa--awesome-deepseek-harness-plugins/INSIGHT.md#research-q01) 提供可追溯到商城的双语目录和结构化索引。

> **思考**：[Q03](../../plugins/web-casa--awesome-deepseek-harness-plugins/INSIGHT.md#research-q03) 索引验证只覆盖结构，安装兼容与安全状态需另核。

> **建议**：[Q05](../../plugins/web-casa--awesome-deepseek-harness-plugins/INSIGHT.md#research-q05) 可缩短发现候选的时间并保持来源可追溯。

[查看完整分析](../../plugins/web-casa--awesome-deepseek-harness-plugins/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333167552-root"></a>

## [Awesome DeepSeek Harness（libukai）](../../plugins/libukai--awesome-deepseek-harness/INSIGHT.md)

[![GitHub ★ 335](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=335&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/libukai/awesome-deepseek-harness)

> **用途**：初学者/选型者建立生态地图，按对象类别找官方入口与原仓，见 [Q01](../../plugins/libukai--awesome-deepseek-harness/INSIGHT.md#research-q01)。

> **亮点**：官方与社区分层、客户端/发行版/插件区别和若干采用条件说明；这是资料贡献而非可执行技术机制，见 [Q01](../../plugins/libukai--awesome-deepseek-harness/INSIGHT.md#research-q01)。

> **思考**：外部CI/版本/权限陈述未独立核，代码块未钉文中基线，读者执行将产生本项目不控制的副作用，见 [Q02](../../plugins/libukai--awesome-deepseek-harness/INSIGHT.md#research-q02) 与 [Q03](../../plugins/libukai--awesome-deepseek-harness/INSIGHT.md#research-q03)。

> **建议**：在现有分类/提醒之上，把目标环境/任务与固定候选原始行为/退出证据绑定的只读采用任务卡，比较误荐与总工时，可被否定，见 [Q04](../../plugins/libukai--awesome-deepseek-harness/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/libukai--awesome-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1332582761-root"></a>

## [Awesome DSH Plugin](../../plugins/alex-yanggg--awesome-dsh-plugin/INSIGHT.md)

[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alex-Yanggg/awesome-DSH-plugin)

> **用途**：用户按用途寻找 DSH 插件。

> **亮点**：[Q01](../../plugins/alex-yanggg--awesome-dsh-plugin/INSIGHT.md#research-q01) 统一双语目录及可复查元数据。

> **思考**：[Q03](../../plugins/alex-yanggg--awesome-dsh-plugin/INSIGHT.md#research-q03) 收录状态需回到实际包核验。

> **建议**：[Q05](../../plugins/alex-yanggg--awesome-dsh-plugin/INSIGHT.md#research-q05) 可缩短发现候选时间。

[查看完整分析](../../plugins/alex-yanggg--awesome-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333175049-root"></a>

## [Awesome DSH Plugin](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md)

[![GitHub ★ 23,963](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23%2C963&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) [![npm 30d 1,974](https://img.shields.io/static/v1?label=npm+30d&message=1%2C974&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin) [![最新发布 2026-08-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin)

> **用途**：需要按类别寻找 DSH 扩展的读者，可用目录找候选、前置条件和上游链接。维护者则可从分散的条目文件生成多种展示。

> **亮点**：把条目维护、双语发现和市场索引接到同一数据链。读者能从类别入口找到实际组件位置，维护者可针对根与子包区分门禁问题。见 [Q01](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q01) 与 [Q02](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q02)。

> **思考**：目录检查、市场索引和能力扫描各自使用不同输入。扫描失败会保留旧记录，公开时间与当前版本不能直接绑定，子包还可能在工件内找不到原仓库路径。见 [Q02](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q02) 与 [Q03](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q03)。

> **建议**：用实际扫描的版本、最近成功时间和本次失败状态一起标注能力记录，可能减少旧披露被误读成当前事实。可用同一组候选比较识别错误与维护时间。见 [Q05](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334020733-root"></a>

## [Awesome DSH Plugin 目录](../../plugins/beancookie--awesome-dsh-plugin/INSIGHT.md)

[![GitHub ★ 188](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=188&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/beancookie/awesome-dsh-plugin) [![npm 30d 1,643](https://img.shields.io/static/v1?label=npm+30d&message=1%2C643&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin) [![最新发布 2026-08-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin)

> **用途**：找 DSH 插件的读者可以从双语分类目录建立候选名单。

> **亮点**：[Q01](../../plugins/beancookie--awesome-dsh-plugin/INSIGHT.md#research-q01) 将人工条目和分类同时提供给读者与索引消费者。

> **思考**：[Q03](../../plugins/beancookie--awesome-dsh-plugin/INSIGHT.md#research-q03) 安装命令是缓存和字符串匹配生成的入口，真实包及兼容仍需单独核对。

> **建议**：[Q05](../../plugins/beancookie--awesome-dsh-plugin/INSIGHT.md#research-q05) 显示缺包与未核实的区别，测试是否减少选错来源。

[查看完整分析](../../plugins/beancookie--awesome-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1223099228-root"></a>

## [Awesome Gaussian Skills](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md)

[![GitHub ★ 177](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=177&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jaccen/Awesome-Gaussian-Skills)

> **用途**：3DGS 研究和内容制作人员需要发现方法、获取辅助指引或探索场景渲染。

> **亮点**：[Q01](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md#research-q01) 和 [Q02](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md#research-q02) 集合资料、Skill 和 MCP 入口；实际研究与渲染收益未对照。

> **思考**：[Q03](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md#research-q03) 渲染桥网络与路径检查存在需验证的边界；[Q02](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md#research-q02) stub 和 headless 不能当真实结果。

> **建议**：[Q05](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md#research-q05) 假设持续传递场景来源与渲染能力可减少结果误认，需对照现有标志。

[查看完整分析](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1250326123-root"></a>

## [BigA](../../plugins/kobenfang--biga/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kobenfang/bigA)

> **用途**：需要反复制作股票观察池和市场摘要的 DSH 用户。

> **亮点**：[Q01](../../plugins/kobenfang--biga/INSIGHT.md#research-q01) 将本地股票池、脚本输出和摘要组织成可调用 Skill；行情和搜索仍来自外部。

> **思考**：[Q02](../../plugins/kobenfang--biga/INSIGHT.md#research-q02) 日历失败可能被报成休市，评分权重和区间声明与代码不一致。

> **建议**：[Q03](../../plugins/kobenfang--biga/INSIGHT.md#research-q03) 统一可核评分和明确未知标志，再测审阅误读及工时；无改善则保持人工。

[查看完整分析](../../plugins/kobenfang--biga/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351845049-packages-dsh-biodsh"></a>

## [BioDSH](../../plugins/sagirimo--biodsh--packages-dsh-biodsh/INSIGHT.md)

[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sagirimo/BioDSH) [![npm 30d 1,434](https://img.shields.io/static/v1?label=npm+30d&message=1%2C434&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-biodsh) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-biodsh)

> **用途**：生信分析者希望从自然语言完成数据分析并保留规范化可查交付，见 [Q01](../../plugins/sagirimo--biodsh--packages-dsh-biodsh/INSIGHT.md#research-q01)，实际采用仍需统计与合同审阅能力。

> **亮点**：[Q01](../../plugins/sagirimo--biodsh--packages-dsh-biodsh/INSIGHT.md#research-q01) 和 [Q04](../../plugins/sagirimo--biodsh--packages-dsh-biodsh/INSIGHT.md#research-q04) 把生信方法组织与公共合同、固定原始输入规则和干净重放连成可追溯修复循环，超过只有persona的包装；引用/规则仍由模型解释，不等于完整科学验证。

> **思考**：[Q04](../../plugins/sagirimo--biodsh--packages-dsh-biodsh/INSIGHT.md#research-q04) 默认coverage关闭且部分列检查可accepted，重放一致不能排同算法错误；[Q03](../../plugins/sagirimo--biodsh--packages-dsh-biodsh/INSIGHT.md#research-q03) 时间提示非总预算，[Q05](../../plugins/sagirimo--biodsh--packages-dsh-biodsh/INSIGHT.md#research-q05) MAGI非隔离盲法且发布有非原子恢复窗口。应明确每次究竟核过哪些科学主张。

> **建议**：[Q06](../../plugins/sagirimo--biodsh--packages-dsh-biodsh/INSIGHT.md#research-q06) 未验证的关键列覆盖、全尝试预算与带manifest原子发布契约，以错误分母未核、稳定错误重放和复制中断反例检验。

[查看完整分析](../../plugins/sagirimo--biodsh--packages-dsh-biodsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351845049-root"></a>

## [BioDSH](../../plugins/sagirimo--biodsh/INSIGHT.md)

[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sagirimo/BioDSH)

> **用途**：需要交接一项有明确输入和输出合同的研究分析的用户，希望保留会话、代码、表和验证记录，并能让同事独立复跑。[Q01](../../plugins/sagirimo--biodsh/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/sagirimo--biodsh/INSIGHT.md#research-q01) [Q02](../../plugins/sagirimo--biodsh/INSIGHT.md#research-q02) 根组件把项目文件、工作区、模型对话和分析环境放入桌面端。按公开合同触发的脚本回放与交付记录来自内嵌的独立 DSH bundle。

> **思考**：[Q03](../../plugins/sagirimo--biodsh/INSIGHT.md#research-q03) 没有合同的会话可结束而不跑交付检查。通过回放可说明同脚本按声明复现，科学结论仍依赖方法、数据和独立对照。

> **建议**：[Q05](../../plugins/sagirimo--biodsh/INSIGHT.md#research-q05) 将合同是否适用、重放是否一致与独立参考是否通过分别交付，可能减少把运行完毕当作科学验证的判断错误。

[查看完整分析](../../plugins/sagirimo--biodsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1312924592-root"></a>

## [causal-memory](../../plugins/jingxuanc--causal-memory/INSIGHT.md)

[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/JingxuanC/causal-memory)

> **用途**：代理跨会话反复处理相同决策，需要查到旧结果。

> **亮点**：[Q01](../../plugins/jingxuanc--causal-memory/INSIGHT.md#research-q01) 让决策记录独立于会话压缩并提供查询。

> **思考**：[Q02](../../plugins/jingxuanc--causal-memory/INSIGHT.md#research-q02) 超时不代表服务端取消，默认同库及能力降级要核对。

> **建议**：[Q03](../../plugins/jingxuanc--causal-memory/INSIGHT.md#research-q03) 对照手写表测实际召回与误归因。

[查看完整分析](../../plugins/jingxuanc--causal-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1312924592-dsh-plugin"></a>

## [causal-memory DSH plugin](../../plugins/jingxuanc--causal-memory--dsh-plugin/INSIGHT.md)

[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/JingxuanC/causal-memory)

> **用途**：需要复查历史决策、事实和结果的 DSH 用户。

> **亮点**：[Q01](../../plugins/jingxuanc--causal-memory--dsh-plugin/INSIGHT.md#research-q01) 将因果记忆能力暴露给模型和其他宿主插件。

> **思考**：[Q02](../../plugins/jingxuanc--causal-memory--dsh-plugin/INSIGHT.md#research-q02) 超时不决定写入结果，子进程环境需要隔离。

> **建议**：[Q04](../../plugins/jingxuanc--causal-memory--dsh-plugin/INSIGHT.md#research-q04) 操作 ID 与结果读回可改善超时恢复。

[查看完整分析](../../plugins/jingxuanc--causal-memory--dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1337306269-packages-citeciter"></a>

## [CiteCiter](../../plugins/kirkchinese--citeciter--packages-citeciter/INSIGHT.md)

[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kirkchinese/CiteCiter) [![npm 30d 2,573](https://img.shields.io/static/v1?label=npm+30d&message=2%2C573&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kirkchinese/dsh-citeciter) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kirkchinese/dsh-citeciter)

> **用途**：用户想解释 Agent 的一段命令或结果，又希望保留主任务流程和可核对来源。

> **亮点**：[Q01](../../plugins/kirkchinese--citeciter--packages-citeciter/INSIGHT.md#research-q01) 和 [Q02](../../plugins/kirkchinese--citeciter--packages-citeciter/INSIGHT.md#research-q02) 用带来源身份的独立 Topic 组织追问，减少手工拼接上下文。

> **思考**：[Q03](../../plugins/kirkchinese--citeciter--packages-citeciter/INSIGHT.md#research-q03) 页边界和缩短只描述当次读取。答案仍需核对事件范围和关键原文。

> **建议**：[Q05](../../plugins/kirkchinese--citeciter--packages-citeciter/INSIGHT.md#research-q05) 把解释与来源读取边界一同保存，有望减少源更新后的错误归因。

[查看完整分析](../../plugins/kirkchinese--citeciter--packages-citeciter/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1154333841-root"></a>

## [Claude Paper](../../plugins/alaliqing--claude-paper/INSIGHT.md)

[![GitHub ★ 353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/alaliqing/claude-paper) [![npm 30d 307](https://img.shields.io/static/v1?label=npm+30d&message=307&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zlzliqing/claude-paper) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zlzliqing/claude-paper)

> **用途**：筛论文/深读论文的研究者，把PDF与笔记按目录索引归档；宿主模型负责理解，见 [Q01](../../plugins/alaliqing--claude-paper/INSIGHT.md#research-q01)。

> **亮点**：完整文本与截断元数据分离，摘要/深读规范和目录复用，见 [Q01](../../plugins/alaliqing--claude-paper/INSIGHT.md#research-q01)。

> **思考**：生成材料不等原文/理解验收；Viewer有未净化主动内容、词法路径和非事务删除边界，安装标志也不证明依赖全就绪，见 [Q02](../../plugins/alaliqing--claude-paper/INSIGHT.md#research-q02) 与 [Q03](../../plugins/alaliqing--claude-paper/INSIGHT.md#research-q03)。

> **建议**：洞察/数字/演示绑定页表与提取/运行证据，测错漏/纠正时间与留存理解，未实现，见 [Q03](../../plugins/alaliqing--claude-paper/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/alaliqing--claude-paper/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1240554500-root"></a>

## [clawock](../../plugins/kcnyu--clawock/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KCNyu/clawock)

> **用途**：研究人员希望跨 Agent 保留判断、引用、反方意见和结果。

> **亮点**：[Q02](../../plugins/kcnyu--clawock/INSIGHT.md#research-q02) 在 Agent 外核验上下文证书、方向性证据及失效条件，可拒绝缺失的结构。

> **思考**：[Q03](../../plugins/kcnyu--clawock/INSIGHT.md#research-q03) 有效回执和方向评价各有边界，不能由此推断市场数据真实、资金实际成交或投资收益。

> **建议**：[Q03](../../plugins/kcnyu--clawock/INSIGHT.md#research-q03) 对照文档和材料证书的异构 Agent 移交，测复核错误和工时。若均无改善就停止。

[查看完整分析](../../plugins/kcnyu--clawock/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1367299537-root"></a>

## [ClearAI](../../plugins/clearailhc--clearai-dsh/INSIGHT.md)

[![GitHub ★ 673](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=673&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Clearailhc/clearai-dsh) [![npm 30d 6,213](https://img.shields.io/static/v1?label=npm+30d&message=6%2C213&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/clearai-dsh) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/clearai-dsh)

> **用途**：需要逐题证据与反例的研究团队，将研究答案沉淀为有边界的本体条目。

> **亮点**：[Q01](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q01) 与 [Q02](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q02) 支持由“执行者说完成”转为材料绑定独立裁决，并在审计后重新检查未决问题；贡献是研究完成协议，非新增宿主子 Agent。

> **思考**：[Q03](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q03) 指出独立角色仍可能共享模型偏差，结构完备不代表现实命题可信；额外评估费用是否降低错误结案尚无实测。

> **建议**：[Q04](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q04) 提出以错误结案风险选择评估强度，保留语义门与可恢复派发；若错误率不降或费用反增则否定。

[查看完整分析](../../plugins/clearailhc--clearai-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1244140731-dsh-cue-data-mcp"></a>

## [Cue Data MCP](../../plugins/sensedeal--cue-skills--dsh-cue-data-mcp/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sensedeal/cue-skills) [![npm 30d 110](https://img.shields.io/static/v1?label=npm+30d&message=110&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-cue-data-mcp) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-cue-data-mcp)

> **用途**：在 DSH 中反复查多个 Cue 数据域的研究者需要统一入口。

> **亮点**：[Q01](../../plugins/sensedeal--cue-skills--dsh-cue-data-mcp/INSIGHT.md#research-q01) 一次组合多域和一致工具命名，复用宿主传输与发现。

> **思考**：[Q02](../../plugins/sensedeal--cue-skills--dsh-cue-data-mcp/INSIGHT.md#research-q02) 15 行只证明静态接入，远端工具、权限和数据新鲜度仍需检查。

> **建议**：[Q03](../../plugins/sensedeal--cue-skills--dsh-cue-data-mcp/INSIGHT.md#research-q03) 在隔离环境测工具清单差异检查能否较早发现远端漂移。

[查看完整分析](../../plugins/sensedeal--cue-skills--dsh-cue-data-mcp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1244140731-dsh-cue-omni-reader"></a>

## [Cue Omni Reader](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sensedeal/cue-skills) [![npm 30d 1,204](https://img.shields.io/static/v1?label=npm+30d&message=1%2C204&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-omni-reader) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-omni-reader)

> **用途**：在 DSH 中需要持续提取网页或已授权文档的用户。

> **亮点**：[Q01](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader/INSIGHT.md#research-q01) 交付固定版本和环境配置的 profile 接线，复用既有 DSH 客户端与外部桥。

> **思考**：[Q02](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader/INSIGHT.md#research-q02) 默认本地根使用进程 cwd，外部进程与任意 URL 解析有独立执行和数据边界。

> **建议**：[Q03](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader/INSIGHT.md#research-q03) 对照相同版本的手配 MCP，测接线复用是否缩短失败恢复时间。

[查看完整分析](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1154200345-root"></a>

## [DARE](../../plugins/yogsoth-ai--de-anthropocentric-research-engine/INSIGHT.md)

[![GitHub ★ 505](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=505&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yogsoth-ai/de-anthropocentric-research-engine)

> **用途**：面向需阶段审阅和中断恢复的研究者，用研究Skill图组织方向、规格和证据状态。

> **亮点**：[Q02](../../plugins/yogsoth-ai--de-anthropocentric-research-engine/INSIGHT.md#research-q02) 将计划决定与科学结论分离并保留追加检查点，提供可读的研究流程合同；这属于编排贡献。

> **思考**：[Q03](../../plugins/yogsoth-ai--de-anthropocentric-research-engine/INSIGHT.md#research-q03) 提示词要求停止并非独立执行屏障，Agent越过门禁或错误写入仍需外部发现。

> **建议**：[Q05](../../plugins/yogsoth-ai--de-anthropocentric-research-engine/INSIGHT.md#research-q05) 从八类Delta合同推导外部验证器假设；用中断和损坏实验检验错误完成是否减少，未实现且未验证。

[查看完整分析](../../plugins/yogsoth-ai--de-anthropocentric-research-engine/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338654346-root"></a>

## [Deep Read Summarize](../../plugins/pensivefei--deep-read-summarize/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PensiveFei/deep-read-summarize) [![npm 30d 7,632](https://img.shields.io/static/v1?label=npm+30d&message=7%2C632&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deep-read-summarize) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deep-read-summarize)

> **用途**：长资料读者需要可回查的笔记与已知内容缺口。

> **亮点**：[Q01](../../plugins/pensivefei--deep-read-summarize/INSIGHT.md#research-q01) 与 [Q02](../../plugins/pensivefei--deep-read-summarize/INSIGHT.md#research-q02) 把长文分块、核验和候选笔记组织在一次工作流里。

> **思考**：[Q03](../../plugins/pensivefei--deep-read-summarize/INSIGHT.md#research-q03) 质量门能检查结构与报告，关键事实仍依赖实际原文和核验判断。

> **建议**：[Q05](../../plugins/pensivefei--deep-read-summarize/INSIGHT.md#research-q05) 对摘录做独立定位，可测量错引率是否下降。

[查看完整分析](../../plugins/pensivefei--deep-read-summarize/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334924880-root"></a>

## [DeepRead 精读助手](../../plugins/xiehuan123--dsh-deepread/INSIGHT.md)

[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiehuan123/dsh-deepread) [![npm 30d 2,894](https://img.shields.io/static/v1?label=npm+30d&message=2%2C894&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepread) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepread)

> **用途**：面向需要从材料提取论点、论据和引句的研究与学习者，提供模式化精读报告。[Q01](../../plugins/xiehuan123--dsh-deepread/INSIGHT.md#research-q01) 以普通摘要和人工标注为参照，合格结果要求引文真实且位置可查，字段齐全不等于证据正确。真实学习和工时收益没有本次数据。

> **亮点**：[Q01](../../plugins/xiehuan123--dsh-deepread/INSIGHT.md#research-q01) 支持结构化精读与宿主接线的集成贡献，较普通摘要提供可供人工核验的观点、论据与位置字段；[Q03](../../plugins/xiehuan123--dsh-deepread/INSIGHT.md#research-q03) 的存储epoch绑定也是可复用工程设计。但这些字段由模型生成，当前没有原文对齐保障，不能把“输出可追溯格式”升级为“证据已核真”。

> **思考**：[Q02](../../plugins/xiehuan123--dsh-deepread/INSIGHT.md#research-q02) 的PDF空页过滤后重编号和长文分段上限会改变引用位置与覆盖范围；[Q03](../../plugins/xiehuan123--dsh-deepread/INSIGHT.md#research-q03) 没有机械核验引句和支持关系。[Q04](../../plugins/xiehuan123--dsh-deepread/INSIGHT.md#research-q04) 预算是估计，取消标记不等于供应商停止。核心质疑是读者能否知道真正读了什么、引句是否存在以及失败还在花多少资源，当前只适合人工核验的辅助整理。

> **建议**：[Q06](../../plugins/xiehuan123--dsh-deepread/INSIGHT.md#research-q06) 提出未验证的阅读任务契约：固定原始锚点与覆盖账本、引句匹配后标已核、逐次模型尝试预算及端到端取消/未知状态。以空页PDF、尾部反证、近似引句与取消重试为最小反例；任何错误页号、未读全书结论或新重试都削弱充分性，新增核验成本也需比较。

[查看完整分析](../../plugins/xiehuan123--dsh-deepread/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1195828337-root"></a>

## [Distilly](../../plugins/titanwings--distilly/INSIGHT.md)

[![GitHub ★ 26,004](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26%2C004&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/titanwings/distilly)

> **用途**：为需要保留同事工作方法、整理个人偏好或研究公众表达的人，把消息、文档和访谈材料提炼为可复用 Person Profile，并打包成 Agent Skill。合格产物是能回指材料、区分事实和推断且可纠正的行为规则，不是本人复制品。

> **亮点**：相对手写“扮演某人”的提示，Distilly 将来源采集、Work 与 Persona 双轨分析、用户预览、统一 writer、版本备份及宿主安装拆成可复用流程。它改变知识交接的组织方式，而非训练出人的模型；主要执行仍依赖承载 Skill 的 Agent 判断。[Q02](../../plugins/titanwings--distilly/INSIGHT.md#research-q02)

> **思考**：source-grounded 是目标，不是 writer 或质量脚本自动证明的语义属性。流程允许无文件时仅凭访谈生成；quality_check 的 URL 形状、来源标记和 PASS 文本检查不能证明判断忠实于本人或适合新问题。工作技能内明确不足就说明缺口，但提示规则能否被宿主稳定遵守仍未知。[Q03](../../plugins/titanwings--distilly/INSIGHT.md#research-q03)

> **建议**：未验证假设是把每条行为规则绑定到具体材料片段、适用情境、反例及本人或授权审核者修正记录，让纠错有可定位的最小单元。由当前文档级质量标记与行为规则语义之间的距离推导；在20个留出工作问题上对比普通 persona 提示与规则证据版，观察事实错误、风格过拟合、拒答与修正时间。若只提高风格相似度而不改善任务忠实性，或复核负担过高，应否定。[Q05](../../plugins/titanwings--distilly/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/titanwings--distilly/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1249550690-packages-dsh-plugin"></a>

## [DocsMint for DSH](../../plugins/hiai-gg--docsmint--packages-dsh-plugin/INSIGHT.md)

[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HiAi-gg/docsmint) [![npm 30d 559](https://img.shields.io/static/v1?label=npm+30d&message=559&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hiai-gg/dsh-docsmint) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hiai-gg/dsh-docsmint)

> **用途**：已有 DocsMint 文档的个人用户在 DSH 研究写作中检索、引用和保存 Markdown。见 [Q01](../../plugins/hiai-gg--docsmint--packages-dsh-plugin/INSIGHT.md#research-q01)。

> **亮点**：双端面板与固定四工具、连接/OAuth和双传输适配减少配置与搬运；文档存储、混合检索和权限继承外部服务。见 [Q01](../../plugins/hiai-gg--docsmint--packages-dsh-plugin/INSIGHT.md#research-q01)、[Q03](../../plugins/hiai-gg--docsmint--packages-dsh-plugin/INSIGHT.md#research-q03)。

> **思考**：edit卡片不是本组件的批准流程，写请求没有本地版本前置条件与幂等核验；网络失败可能已写入，MCP逐次取消也未证实。见 [Q02](../../plugins/hiai-gg--docsmint--packages-dsh-plugin/INSIGHT.md#research-q02)。

> **建议**：验证带版本前置条件、目标差异和写后回读的可靠保存；若外部服务已有同等保护或不能减少错误就不成立。见 [Q04](../../plugins/hiai-gg--docsmint--packages-dsh-plugin/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/hiai-gg--docsmint--packages-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335681939-root"></a>

## [DSH AI4Scholar](../../plugins/literaf--dsh-ai4scholar/INSIGHT.md)

[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/literaf/dsh-ai4scholar) [![npm 30d 7,967](https://img.shields.io/static/v1?label=npm+30d&message=7%2C967&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ai4scholar) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ai4scholar)

> **用途**：在若干论文平台做初筛时，将可回源的候选集中并核对失败来源。

> **亮点**：[Q01](../../plugins/literaf--dsh-ai4scholar/INSIGHT.md#research-q01) 和 [Q02](../../plugins/literaf--dsh-ai4scholar/INSIGHT.md#research-q02) 将来源、匹配与部分失败带入同一次筛选。

> **思考**：[Q03](../../plugins/literaf--dsh-ai4scholar/INSIGHT.md#research-q03) 失败来源的积分未计入成功项汇总，工具显示不能单独作为完整账单。

> **建议**：[Q05](../../plugins/literaf--dsh-ai4scholar/INSIGHT.md#research-q05) 展示每次归并的规则与失败源，可测试是否降低误引。

[查看完整分析](../../plugins/literaf--dsh-ai4scholar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1369398336-packages-dsh-annotation"></a>

## [DSH Annotation](../../plugins/ecnu--eduwork--packages-dsh-annotation/INSIGHT.md)

[![GitHub ★ 285](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=285&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ECNU/EduWork) [![npm 30d 1,227](https://img.shields.io/static/v1?label=npm+30d&message=1%2C227&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-annotation) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-annotation)

> **用途**：需要对长回复多处追问的用户可以选择片段、附评论并在同一草稿中发送。

> **亮点**：[Q01](../../plugins/ecnu--eduwork--packages-dsh-annotation/INSIGHT.md#research-q01) 和 [Q02](../../plugins/ecnu--eduwork--packages-dsh-annotation/INSIGHT.md#research-q02) 显示选段、编号与版本化局部编辑组合到原生输入；[Q03](../../plugins/ecnu--eduwork--packages-dsh-annotation/INSIGHT.md#research-q03) 的协议使发送和展示共享消息内容，不必依赖另一套批注库。

> **思考**：[Q03](../../plugins/ecnu--eduwork--packages-dsh-annotation/INSIGHT.md#research-q03) 的来源和有限前后文不证明完整原文已读，提示也不保证模型遵守；[Q02](../../plugins/ecnu--eduwork--packages-dsh-annotation/INSIGHT.md#research-q02) 的选区依赖宿主行结构与公开身份接口。

> **建议**：[Q05](../../plugins/ecnu--eduwork--packages-dsh-annotation/INSIGHT.md#research-q05) 提出发送前展示来源可访问性、上下文范围和输入量的未验证方案；若对照中错误未减少或确认负担更大则否定。

[查看完整分析](../../plugins/ecnu--eduwork--packages-dsh-annotation/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331112087-root"></a>

## [DSH Data Agent](../../plugins/omdsh-dev--dsh-data-agent/INSIGHT.md)

[![GitHub ★ 215](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=215&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-data-agent) [![npm 30d 2,246](https://img.shields.io/static/v1?label=npm+30d&message=2%2C246&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yejiming/dsh-data-agent) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yejiming/dsh-data-agent)

> **用途**：能合法访问数据库并愿意核SQL和业务口径的分析者，可在DSH中查询与生成报告。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-data-agent/INSIGHT.md#research-q01) 与 [Q03](../../plugins/omdsh-dev--dsh-data-agent/INSIGHT.md#research-q03) 支持把连接、结构化查询、候选/审核口径和报告整合；版本冲突与needs_review让业务解释可追溯，但不证明分析建议正确。

> **思考**：[Q02](../../plugins/omdsh-dev--dsh-data-agent/INSIGHT.md#research-q02) 核实readonly默认false且连接级优先，SQL词法分类不是数据库权限边界；[Q03](../../plugins/omdsh-dev--dsh-data-agent/INSIGHT.md#research-q03) 查询rows回模型，“本地执行”不等数据永不出域。

> **建议**：[Q04](../../plugins/omdsh-dev--dsh-data-agent/INSIGHT.md#research-q04) 提议把已有Catalog版本、SQL与截断状态绑定到可回读交付收据；先核等价字段，再比较过时/错误口径发现与全部开销，无增益即否定。

[查看完整分析](../../plugins/omdsh-dev--dsh-data-agent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339628067-root"></a>

## [DSH Data Quality](../../plugins/perrylink--dsh-data-quality/INSIGHT.md)

[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-data-quality) [![npm 30d 3,462](https://img.shields.io/static/v1?label=npm+30d&message=3%2C462&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-data-quality) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-data-quality)

> **用途**：在可信本地项目重复检查CSV/JSON的数据维护者，可用明确规则和统计报告辅助复核，见 [Q01](../../plugins/perrylink--dsh-data-quality/INSIGHT.md#research-q01)。

> **亮点**：把列分析、声明式清理/校验和citation四状态接成Host服务与报告回读，避免模型心算；采样/分数有明确有限语义，见 [Q01](../../plugins/perrylink--dsh-data-quality/INSIGHT.md#research-q01)、[Q02](../../plugins/perrylink--dsh-data-quality/INSIGHT.md#research-q02)、[Q04](../../plugins/perrylink--dsh-data-quality/INSIGHT.md#research-q04)。

> **思考**：词法路径不是文件系统隔离，输出先写后contract/报告且可覆盖目标；报告键缺workspace/操作唯一性，accuracy/verified不能被当现实真相，见 [Q02](../../plugins/perrylink--dsh-data-quality/INSIGHT.md#research-q02)至 [Q05](../../plugins/perrylink--dsh-data-quality/INSIGHT.md#research-q05)。

> **建议**：未验证方向为contract前置与绑定输入hash/真实路径/operationId的提交收据，以三故障样本核误覆盖/重试，等价宿主机制或需求不足则放弃，见 [Q06](../../plugins/perrylink--dsh-data-quality/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/perrylink--dsh-data-quality/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1380181057-root"></a>

## [DSH Fact Check](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7starsseeker/dsh-fact-check) [![npm 30d 2,675](https://img.shields.io/static/v1?label=npm+30d&message=2%2C675&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fact-check) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fact-check)

> **用途**：需要核查公开声明的研究者可以按事实点检索原文、比较来源并记录仍不能核实的部分。

> **亮点**：[Q01](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q01) 与 [Q02](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q02) 显示 Skill、渠道计划与判断脚本将一套核查方法接到宿主；其好处取决于实际搜索及人工判断，不是事实正确保证。

> **思考**：[Q03](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q03) 的来源数量与双轨属于方法指引，不能代替原文和独立性核查；[Q04](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q04) 的缺密钥退出、对外传输及 sufficient 调用也要求使用者实际检查。

> **建议**：[Q06](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q06) 提出绑定原文版本和引用关系的未验证证据图；若盲测无法改善失效引用识别或增加成本过高则否定。

[查看完整分析](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1374007757-plugins-dsh-failover-search-plugin"></a>

## [DSH Failover Search](../../plugins/fnosp--fnos-dsh--plugins-dsh-failover-search-plugin/INSIGHT.md)

[![GitHub ★ 87](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=87&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FNOSP/fnos-dsh) [![npm 30d 3,733](https://img.shields.io/static/v1?label=npm+30d&message=3%2C733&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-failover-search) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-failover-search)

> **用途**：依赖网页资料的用户遇到单来源服务故障。

> **亮点**：[Q01](../../plugins/fnosp--fnos-dsh--plugins-dsh-failover-search-plugin/INSIGHT.md#research-q01) 将失败转移、用量探测和错误说明接入宿主。

> **思考**：[Q03](../../plugins/fnosp--fnos-dsh--plugins-dsh-failover-search-plugin/INSIGHT.md#research-q03) 顺序尝试带来延迟、配额与多方资料传输。

> **建议**：[Q05](../../plugins/fnosp--fnos-dsh--plugins-dsh-failover-search-plugin/INSIGHT.md#research-q05) 可在单来源故障时提高合格检索任务完成率。

[查看完整分析](../../plugins/fnosp--fnos-dsh--plugins-dsh-failover-search-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334384058-root"></a>

## [DSH Free Search](../../plugins/dddmuc--dsh-free-search/INSIGHT.md)

[![GitHub ★ 1,069](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C069&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DDDMUC/dsh-free-search) [![npm 30d 110,276](https://img.shields.io/static/v1?label=npm+30d&message=110%2C276&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search)

> **用途**：适合常用 DSH 查跨语言公开文档，且需要核对来源的开发者，见 [Q01](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q01)。

> **亮点**：把引擎选择、失败分流和实际来源放进同一个 DSH 搜索接口，便于单源失败时继续定位文档，见 [Q01](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q01) 与 [Q02](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q02)。

> **思考**：并发预算到期不能证明供应商停止计量。直连的地址校验也未自动应用到浏览器及外部提取，见 [Q02](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q02) 与 [Q03](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q03)。

> **建议**：增加逐次尝试与终态轨迹，验证用户能否更快识别失败来源并避免无效重试，见 [Q05](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/dddmuc--dsh-free-search/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339669759-root"></a>

## [DSH Industry Research](../../plugins/perrylink--dsh-industry-research/INSIGHT.md)

[![GitHub ★ 216](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=216&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-industry-research) [![npm 30d 4,124](https://img.shields.io/static/v1?label=npm+30d&message=4%2C124&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-industry-research) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-industry-research)

> **用途**：研究者反复维护产业链/公司/动态并产可回溯研究稿。

> **亮点**：[Q01](../../plugins/perrylink--dsh-industry-research/INSIGHT.md#research-q01)、[Q02](../../plugins/perrylink--dsh-industry-research/INSIGHT.md#research-q02) 将领域数据、缺口、版本和报告组织起来，降低反复整理负担。

> **思考**：[Q03](../../plugins/perrylink--dsh-industry-research/INSIGHT.md#research-q03) sourceRef/hash/结构门不证数值真实，E证据常为生成artifact；[Q02](../../plugins/perrylink--dsh-industry-research/INSIGHT.md#research-q02)红方/正反方job是确定性note非独立模型研究。

> **建议**：[Q05](../../plugins/perrylink--dsh-industry-research/INSIGHT.md#research-q05) 绑定原文段落/日期/单位与抓取状态的领域证据契约；若手工/现有引擎等效或误配更多即否定。

[查看完整分析](../../plugins/perrylink--dsh-industry-research/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1390103795-root"></a>

## [DSH Local Memory](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md)

[![npm 30d 137](https://img.shields.io/static/v1?label=npm+30d&message=137&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-local-memory) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-local-memory)

> **用途**：多项目维护者需要知道哪个项目缺记忆并对指定项目联合查询；合格结果必须有库归属和缺失诊断。

> **亮点**：相对Hindsight平级分库，增量是读取时跨库视图与“发现缺失→播种→核对状态”闭环；不复制总库，不将上游抽取引擎算作自身创新。[Q01](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md#research-q01) [Q02](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md#research-q02)

> **思考**：项目隔离能否成立取决于库身份。源码只用目录basename，同名仓库会映射到同库；分库不是访问控制，本地daemon也不自动代表离线LLM处理。[Q03](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md#research-q03)

> **建议**：未验证假设是增加稳定项目身份映射和同名碰撞预警，在不破坏上游库命名兼容的条件下改善归属可信度；用同名、worktree和重命名矩阵比较误归属与维护负担。[Q04](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1353352537-root"></a>

## [DSH Memory](../../plugins/hr98w--dsh-memory/INSIGHT.md)

[![GitHub ★ 35](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hr98w/dsh-memory) [![npm 30d 1,917](https://img.shields.io/static/v1?label=npm+30d&message=1%2C917&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hr98w/dsh-memory) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hr98w/dsh-memory)

> **用途**：反复在新会话解释同一项目背景、团队偏好及工作约定的 DSH 用户。

> **亮点**：将工作区索引和 Global 偏好接到 Host 上下文，并把版本校验和会话整理提案接入同一记忆仓库。[Q01](../../plugins/hr98w--dsh-memory/INSIGHT.md#research-q01) [Q02](../../plugins/hr98w--dsh-memory/INSIGHT.md#research-q02)

> **思考**：整理模型会收到投影证据和记忆内容。Global 与 Workspace 依次发布，后一处冲突可能保留前一处更新。[Q02](../../plugins/hr98w--dsh-memory/INSIGHT.md#research-q02) [Q03](../../plugins/hr98w--dsh-memory/INSIGHT.md#research-q03)

> **建议**：在冲突回执中显示两处写入的独立状态与版本，可能减少误判及不必要重试。[Q04](../../plugins/hr98w--dsh-memory/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/hr98w--dsh-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1216014649-plugins-dsh"></a>

## [DSH MSDS Chain](../../plugins/littleblakew--msds-chain-mcp--plugins-dsh/INSIGHT.md)



> **用途**：需要查找化学品安全资料并由专业人员复核的 DSH 用户。

> **亮点**：[Q01](../../plugins/littleblakew--msds-chain-mcp--plugins-dsh/INSIGHT.md#research-q01) 和 [Q02](../../plugins/littleblakew--msds-chain-mcp--plugins-dsh/INSIGHT.md#research-q02) 提供 DSH 桥配置，不实现或验证底层化学安全判断。

> **思考**：[Q03](../../plugins/littleblakew--msds-chain-mcp--plugins-dsh/INSIGHT.md#research-q03) 组件未含服务数据和核验逻辑，作者引用主张不能证明安全建议正确。

> **建议**：[Q05](../../plugins/littleblakew--msds-chain-mcp--plugins-dsh/INSIGHT.md#research-q05) 建议提供连接与引用状态，需验证且不泄露凭据。

[查看完整分析](../../plugins/littleblakew--msds-chain-mcp--plugins-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334167430-root"></a>

## [DSH Noema](../../plugins/zseven-w--dsh-noema/INSIGHT.md)

[![GitHub ★ 136](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=136&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-noema) [![npm 30d 1,976](https://img.shields.io/static/v1?label=npm+30d&message=1%2C976&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-noema) [![最新发布 2026-10-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-noema)

> **用途**：需要在 DSH 复用长期开发笔记的用户。

> **亮点**：[Q01](../../plugins/zseven-w--dsh-noema/INSIGHT.md#research-q01) 统一接入记忆工具与生命周期。

> **思考**：[Q02](../../plugins/zseven-w--dsh-noema/INSIGHT.md#research-q02) 已接受的记忆与去重账本不是同一提交。

> **建议**：[Q04](../../plugins/zseven-w--dsh-noema/INSIGHT.md#research-q04) 在提交前显示待导入范围。

[查看完整分析](../../plugins/zseven-w--dsh-noema/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1329484633-plugins-dsh-opencontext"></a>

## [DSH OpenContext](../../plugins/melandlabs--opencontext--plugins-dsh-opencontext/INSIGHT.md)

[![GitHub ★ 76](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=76&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/melandlabs/opencontext) [![npm 30d 1,045](https://img.shields.io/static/v1?label=npm+30d&message=1%2C045&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-opencontext) [![最新发布 2026-09-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-opencontext)

> **用途**：希望在单用户DSH项目实验持久记忆与知识召回的开发者。

> **亮点**：[Q01](../../plugins/melandlabs--opencontext--plugins-dsh-opencontext/INSIGHT.md#research-q01) 将自动事件和工具检索接到现有OpenContext。

> **思考**：[Q02](../../plugins/melandlabs--opencontext--plugins-dsh-opencontext/INSIGHT.md#research-q02) 默认scope不统一且get未检查所有权；[Q03](../../plugins/melandlabs--opencontext--plugins-dsh-opencontext/INSIGHT.md#research-q03) 超时不取消已开始写入。

> **建议**：[Q04](../../plugins/melandlabs--opencontext--plugins-dsh-opencontext/INSIGHT.md#research-q04) 统一可信scope及按ID检查是否改善闭环需两项目对照。

[查看完整分析](../../plugins/melandlabs--opencontext--plugins-dsh-opencontext/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335203486-root"></a>

## [DSH Origin Plugin](../../plugins/fantasality--dsh-origin-plugin/INSIGHT.md)

[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fantasality/dsh-origin-plugin) [![npm 30d 3,066](https://img.shields.io/static/v1?label=npm+30d&message=3%2C066&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-origin-plugin) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-origin-plugin)

> **用途**：实验人员用同一张小型实验表出图，并让同事在 Origin 中继续编辑轴与曲线。

> **亮点**：[Q01](../../plugins/fantasality--dsh-origin-plugin/INSIGHT.md#research-q01) 将计划、图页操作与可编辑工程交付串在 DSH 的同一会话。[Q03](../../plugins/fantasality--dsh-origin-plugin/INSIGHT.md#research-q03) 可按图属性和逐文件结果核对交付。

> **思考**：[Q02](../../plugins/fantasality--dsh-origin-plugin/INSIGHT.md#research-q02) 计划哈希检查陈旧，用户确认仍由调用流程负责。[Q03](../../plugins/fantasality--dsh-origin-plugin/INSIGHT.md#research-q03) 图验证通过可能含不可读项，部分文件失败时顶层仍可能返回 ok。

> **建议**：[Q04](../../plugins/fantasality--dsh-origin-plugin/INSIGHT.md#research-q04) 先确认轴和单位再做独立验收，可能降低错列或错单位交付。用同一实验表和故意错配做手工对照。

[查看完整分析](../../plugins/fantasality--dsh-origin-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1373309426-root"></a>

## [DSH Paper Reader](../../plugins/ggboya--dsh-paper-reader/INSIGHT.md)

[![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GGboya/dsh-paper-reader) [![npm 30d 9,422](https://img.shields.io/static/v1?label=npm+30d&message=9%2C422&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ggboy123/dsh-paper-reader) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ggboy123/dsh-paper-reader)

> **用途**：读论文的 DSH 用户想针对一处方法或结论提问，并用原始 PDF 的具体页码和句子复核。

> **亮点**：[Q01](../../plugins/ggboya--dsh-paper-reader/INSIGHT.md#research-q01) 和 [Q02](../../plugins/ggboya--dsh-paper-reader/INSIGHT.md#research-q02) 核对了文献、转录和会话入口相连，能够把检索片段和页码带回阅读流程。

> **思考**：[Q03](../../plugins/ggboya--dsh-paper-reader/INSIGHT.md#research-q03) 页码是块起点，旧链接的目标缺失时可能打开其他文档，范围选择只限制附加上下文。需核对文献身份、页及原句。

> **建议**：[Q05](../../plugins/ggboya--dsh-paper-reader/INSIGHT.md#research-q05) 用跨页关键词、错域文献与过期链接的成对例子，可以验证自动引用在具体阅读任务的准确性。

[查看完整分析](../../plugins/ggboya--dsh-paper-reader/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1346064150-root"></a>

## [DSH PDF Reader](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngelosZou/dsh-pdf-reader) [![npm 30d 722](https://img.shields.io/static/v1?label=npm+30d&message=722&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pdf-reader) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pdf-reader)

> **用途**：适合在DSH中阅读含图表、公式与双栏布局的论文，输出需人工核对原页。

> **亮点**：以内容画像选择文本或区域渲染，将PyMuPDF能力组织成扫描、混读和精读工具；贡献在适配与路由，不是新的PDF解析算法。[Q03](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md#research-q03)

> **思考**：缓存名缺少完整bbox、DPI与源路径，同起点区域或同名PDF可发生路径重合；尚未运行复现其读图影响。[Q04](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md#research-q04)

> **建议**：未验证假设是用PDF内容摘要、页码、完整bbox及DPI作为缓存键，并让每个问题共享总图像预算，能减少误用旧图与过量裁剪。它从当前缓存冲突及逐区域独立预算推导，不是本版已有能力。最小验证用同basename两PDF、同起点不同bbox及图表密集页，对比现版和新缓存策略，检查路径唯一性、读图正确率、总图像token和人工复核；若只有磁盘增量而无错误或总成本改善，否定其采用优势。 [Q08](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338123290-root"></a>

## [DSH Plugin Memory](../../plugins/littleblacktong--dsh-plugin-memory/INSIGHT.md)

[![GitHub ★ 35](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LittleBlackTong/dsh-plugin-memory) [![npm 30d 40,221](https://img.shields.io/static/v1?label=npm+30d&message=40%2C221&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-memory) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-memory)

> **用途**：经常在不同 DSH 会话重复提供项目背景与个人工作约定的用户。

> **亮点**：启动与近期上下文分开，使用字符预算、会话和活动条件控制注入。[Q01](../../plugins/littleblacktong--dsh-plugin-memory/INSIGHT.md#research-q01) [Q02](../../plugins/littleblacktong--dsh-plugin-memory/INSIGHT.md#research-q02)

> **思考**：会话 off 默认会过期，持久化失败可能静默。自动 Git 提交会保存已写内容，停用不会撤回历史。[Q02](../../plugins/littleblacktong--dsh-plugin-memory/INSIGHT.md#research-q02) [Q03](../../plugins/littleblacktong--dsh-plugin-memory/INSIGHT.md#research-q03)

> **建议**：将隐私禁用设为显式持久规则并回报落盘状态，可能减少恢复后的非预期注入。[Q03](../../plugins/littleblacktong--dsh-plugin-memory/INSIGHT.md#research-q03)

[查看完整分析](../../plugins/littleblacktong--dsh-plugin-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335045464-root"></a>

## [DSH Plugins 中文导航](../../plugins/gityuanbao--dsh-plugins/INSIGHT.md)

[![GitHub ★ 85](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=85&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/gityuanbao/DSH-Plugins)

> **用途**：中文读者需从候选仓库走到可核查的安装起步。

> **亮点**：[Q01](../../plugins/gityuanbao--dsh-plugins/INSIGHT.md#research-q01) 增加采用线索的集中整理。

> **思考**：[Q03](../../plugins/gityuanbao--dsh-plugins/INSIGHT.md#research-q03) 快照与来源类别不证明当前可装或安全。

> **建议**：[Q05](../../plugins/gityuanbao--dsh-plugins/INSIGHT.md#research-q05) 可减少候选初筛时间，需对照时效核实。

[查看完整分析](../../plugins/gityuanbao--dsh-plugins/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339655720-root"></a>

## [DSH Research Report](../../plugins/perrylink--dsh-research-report/INSIGHT.md)

[![GitHub ★ 213](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=213&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-research-report) [![npm 30d 5,581](https://img.shields.io/static/v1?label=npm+30d&message=5%2C581&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-research-report) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-research-report)

> **用途**：研究者和上游插件需要可移交/复算的材料与claim核验日志。

> **亮点**：[Q01](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q01)、[Q02](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q02) 将快照/claim/字节判据/反证与报告seal串联，提供可回查工程交付。

> **思考**：[Q03](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q03) substring verified非事实支持且段落可不绑定；核心ok不合claimChecks而CLI信封合；[Q04](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q04)后台killed不证明封存停写。

> **建议**：[Q05](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q05) 分开完整性/覆盖/语义/最终状态收据，若文案/手工等效或负担更大即否定。

[查看完整分析](../../plugins/perrylink--dsh-research-report/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1325458176-root"></a>

## [DSH Scholar](../../plugins/lzszq--dsh-scholar/INSIGHT.md)

[![GitHub ★ 57](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=57&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lzszq/dsh-scholar)

> **用途**：监督式计算研究中管理反复变化的假设、代码数据、作业和论文依据。见 [Q01](../../plugins/lzszq--dsh-scholar/INSIGHT.md#research-q01)。

> **亮点**：将批准责任、不可变输入、租约作业与证据验收串成持久项目；这是工程与工作组织增量，非自动科学发现的验证。见 [Q02](../../plugins/lzszq--dsh-scholar/INSIGHT.md#research-q02)至[Q04](../../plugins/lzszq--dsh-scholar/INSIGHT.md#research-q04)。

> **思考**：full-auto只执行限定fixture的survey_run，来源已验不代表科学正确；部署身份、远程隔离和人类复核负担仍决定价值。见 [Q02](../../plugins/lzszq--dsh-scholar/INSIGHT.md#research-q02)至[Q04](../../plugins/lzszq--dsh-scholar/INSIGHT.md#research-q04)。

> **建议**：以版本差异视图减少Human Gate重复阅读，同时不漏掉代码/数据/指标变化；现有UI已等效或误批增加就推翻。见 [Q05](../../plugins/lzszq--dsh-scholar/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/lzszq--dsh-scholar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1416950630-root"></a>

## [DSH SciWork](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/58catmiao/dsh-sciwork)

> **用途**：需要跨文献、图稿与投稿材料组织的研究者；基线是手工维护文件和逐项核对。[Q01](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q01)

> **亮点**：统一课题动作、计划和可审查回执，并生成投稿包。[Q01](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q01) [Q02](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q02)

> **思考**：旧动作可隐式代签；超时不取消底层写，投稿检查失败仍可导出，科学内容需人工复核。[Q03](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q03) [Q04](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q04) [Q05](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q05)

> **建议**：未验证假设：持久操作状态与完成后回读可帮助区分超时后的未知写入，须对照已有成功幂等与回执。[Q06](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336940095-root"></a>

## [DSH Trading](../../plugins/maddogfinance--dsh-trading/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/maddogfinance/dsh-trading)

> **用途**：已有回测成交记录的研究者需要对照本地行情，检查输入和报告中的缺口。

> **亮点**：[Q01](../../plugins/maddogfinance--dsh-trading/INSIGHT.md#research-q01) 和 [Q02](../../plugins/maddogfinance--dsh-trading/INSIGHT.md#research-q02) 把成交范围、重复、随机基线与样本检查组合成可追查的回测报告。

> **思考**：[Q03](../../plugins/maddogfinance--dsh-trading/INSIGHT.md#research-q03) 守卫按工具名称作判断。行情范围检查无法证明实际成交、名单完整性或盈利。

> **建议**：[Q05](../../plugins/maddogfinance--dsh-trading/INSIGHT.md#research-q05) 可试验独立生成成交清单并对账，识别提交给核验工具时遗漏的记录。

[查看完整分析](../../plugins/maddogfinance--dsh-trading/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338640495-root"></a>

## [DSH Video Lens](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md)

[![GitHub ★ 112](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=112&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dundunhan/dsh-video-lens) [![npm 30d 2,425](https://img.shields.io/static/v1?label=npm+30d&message=2%2C425&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-video-lens) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-video-lens)

> **用途**：用户要快速定位录屏中的某个事件。

> **亮点**：[Q01](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md#research-q01) 通过时间窗口和语音线索减少候选片段。

> **思考**：[Q03](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md#research-q03) 帧抽样会漏事件，外部端点可收到媒体内容。

> **建议**：[Q05](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md#research-q05) 明确时间的问答或可节约回看时间。

[查看完整分析](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333320049-root"></a>

## [DSH Web Search Pro](../../plugins/anweat--dsh-web-search-pro/INSIGHT.md)

[![GitHub ★ 84](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=84&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anweat/dsh-web-search-pro) [![npm 30d 6,045](https://img.shields.io/static/v1?label=npm+30d&message=6%2C045&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-search-pro) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-search-pro)

> **用途**：研究者要按多个要求整理来源证据。

> **亮点**：[Q01](../../plugins/anweat--dsh-web-search-pro/INSIGHT.md#research-q01) 提供需求映射、摘录及可追查原块。

> **思考**：[Q03](../../plugins/anweat--dsh-web-search-pro/INSIGHT.md#research-q03) 压缩和评分回退可能漏证，CLI及历史需管理。

> **建议**：[Q05](../../plugins/anweat--dsh-web-search-pro/INSIGHT.md#research-q05) 证据包可在保留关键事实时降低整理负担。

[查看完整分析](../../plugins/anweat--dsh-web-search-pro/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335219884-root"></a>

## [DSH Web Tools](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A3Boy/dsh-web-tools)

> **用途**：对经常需要引用原始网页的 DSH Web 用户，同一个会话可通过原有工具名访问不同检索提供者。

> **亮点**：保持 web_search 和 web_fetch 的宿主入口，按认证、限流和取消区分后备行为。相比手工切换，它能在同次请求中尝试独立提供者并保留失败边界。见 [Q01](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q01)、[Q02](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q02)。

> **思考**：Always 接受一次失败的工具完成，不能当作拿到可靠证据。平台后备也无法恢复权限受限的原生内容。见 [Q02](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q02)、[Q03](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q03)。

> **建议**：先在隔离 Profile 做单源和双源限流对照。用原文命中率、尝试次数、尾时延及费用决定是否保留后备链。见 [Q05](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/a3boy--dsh-web-tools/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1400385991-packages-dsh-weekly-panel"></a>

## [DSH 插件周榜面板](../../plugins/514006234--dsh-weekly-check--packages-dsh-weekly-panel/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/514006234/dsh-weekly-check)

> **用途**：DSH 内查周榜的读者可从侧栏进入。

> **亮点**：[Q01](../../plugins/514006234--dsh-weekly-check--packages-dsh-weekly-panel/INSIGHT.md#research-q01) 把排行榜摘要带入宿主并提供复制入口。

> **思考**：[Q03](../../plugins/514006234--dsh-weekly-check--packages-dsh-weekly-panel/INSIGHT.md#research-q03) 回环代理不能保证远程访问和榜单实时性。

> **建议**：[Q05](../../plugins/514006234--dsh-weekly-check--packages-dsh-weekly-panel/INSIGHT.md#research-q05) 验证明确标记数据年龄是否有帮助。

[查看完整分析](../../plugins/514006234--dsh-weekly-check--packages-dsh-weekly-panel/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333960520-root"></a>

## [dsh_kline](../../plugins/ftshare-lab--dsh_kline/INSIGHT.md)

[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FTShare-Lab/dsh_kline) [![npm 30d 296](https://img.shields.io/static/v1?label=npm+30d&message=296&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ftshare-lab/dsh-kline) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ftshare-lab/dsh-kline)

> **用途**：在 DSH 对话中复盘历史 K 线的用户，希望从工具结果直接定位到同一会话图表及对应标注。

> **亮点**：[Q01](../../plugins/ftshare-lab--dsh_kline/INSIGHT.md#research-q01) 将成功工具结果与对应会话的原生图表标签连起来。[Q02](../../plugins/ftshare-lab--dsh_kline/INSIGHT.md#research-q02) 把历史候选和修改申请拆开，并核对版本和来源快照。

> **思考**：[Q02](../../plugins/ftshare-lab--dsh_kline/INSIGHT.md#research-q02) 的形态取决于已加载日线和收盘判断，queued 还要等待真实应用。[Q03](../../plugins/ftshare-lab--dsh_kline/INSIGHT.md#research-q03) 的工具目录能先于后端就绪，断线前派发的操作也可能结果未知。

> **建议**：[Q04](../../plugins/ftshare-lab--dsh_kline/INSIGHT.md#research-q04) 提出并列显示工具调用来源、规则截止和图表版本，验证是否减少误用旧图和人工核对。

[查看完整分析](../../plugins/ftshare-lab--dsh_kline/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1337467566-root"></a>

## [dsh-anchored-monitor](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md)

[![GitHub ★ 13](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aik358/dsh-anchored-monitor) [![npm 30d 973](https://img.shields.io/static/v1?label=npm+30d&message=973&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor)

> **用途**：研究某模型推理表达轨迹并可视化；自动干预需极严格验证。

> **亮点**：将流式推理指纹、窗口和实验日志做成实时仪表与可配置状态机。详见[Q02](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md#research-q02)。

> **思考**：默认启用会话打断/自动续跑，README 却称默认仅监测；HTTP CORS:* 无鉴权且配置可改 monitorUrl。详见[Q03](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md#research-q03)、[Q04](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md#research-q04)。

> **建议**：默认只读、受保护的统计摘要和人工批准干预能降低误打断；尚未实现。详见[Q05](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381430202-root"></a>

## [dsh-auto-memory](../../plugins/asktheway--dsh-auto-memory/INSIGHT.md)

[![GitHub ★ 122](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=122&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AskTheWay/dsh-auto-memory) [![npm 30d 9,671](https://img.shields.io/static/v1?label=npm+30d&message=9%2C671&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-auto-memory) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-auto-memory)

> **用途**：编码用户在多个会话中反复提供相同项目背景和偏好。

> **亮点**：[Q01](../../plugins/asktheway--dsh-auto-memory/INSIGHT.md#research-q01) 在会话步骤注入工作区索引并提供记忆工具。

> **思考**：[Q02](../../plugins/asktheway--dsh-auto-memory/INSIGHT.md#research-q02) 防护为启发式，固定 API 文件含 NUL，网页权限未覆盖。

> **建议**：[Q03](../../plugins/asktheway--dsh-auto-memory/INSIGHT.md#research-q03) 比较启用前后的拒答、污染和注入成本。

[查看完整分析](../../plugins/asktheway--dsh-auto-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334388245-root"></a>

## [dsh-better-deepseek](../../plugins/edgetype--dsh-better-deepseek/INSIGHT.md)

[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EdgeTypE/dsh-better-deepseek) [![npm 30d 628](https://img.shields.io/static/v1?label=npm+30d&message=628&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-deepseek) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-deepseek)

> **用途**：浏览器扩展用户可以研究如何从网页发起并观察 DSH 任务。

> **亮点**：[Q01](../../plugins/edgetype--dsh-better-deepseek/INSIGHT.md#research-q01) 把会话创建、消息和任务结果作为扩展可调用入口提供。

> **思考**：[Q02](../../plugins/edgetype--dsh-better-deepseek/INSIGHT.md#research-q02) SSE 广播未按订阅者过滤会话，控制分支未核对会话所有者。

> **建议**：[Q04](../../plugins/edgetype--dsh-better-deepseek/INSIGHT.md#research-q04) 将订阅和控制统一绑定身份与会话，可能保留浏览器接线并阻断串流。

[查看完整分析](../../plugins/edgetype--dsh-better-deepseek/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335061439-root"></a>

## [dsh-chinese-traditional-wisdom-skill](../../plugins/dhicoc--dsh-chinese-traditional-wisdom-skill/INSIGHT.md)

[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill) [![npm 30d 1,146](https://img.shields.io/static/v1?label=npm+30d&message=1%2C146&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dhicoc/dsh-chinese-traditional-wisdom-skill) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dhicoc/dsh-chinese-traditional-wisdom-skill)

> **用途**：为明确学习传统文化或比较本地规则计算的人，在DSH发现玄枢技能和资源；不为普通人生问题自动提供术数解释，也不支持专业决策保证。

> **亮点**：[Q01](../../plugins/dhicoc--dsh-chinese-traditional-wisdom-skill/INSIGHT.md#research-q01)、[Q02](../../plugins/dhicoc--dsh-chinese-traditional-wisdom-skill/INSIGHT.md#research-q02)确认贡献是把玄枢技能与本地资源通过DSH provider暴露，并保留结构化计算和核验流程。适配器未创造排盘算法或自动强制核验，独立文化/科学效果均无证据。

> **思考**：[Q03](../../plugins/dhicoc--dsh-chinese-traditional-wisdom-skill/INSIGHT.md#research-q03)表明claims一致性不是现实预测有效性，也不证明全条对话隐私。实际调用与核验仍依赖Agent遵循流程，不能用32项CLI或本地计算主张代替自主执行验收。

> **建议**：[Q05](../../plugins/dhicoc--dsh-chinese-traditional-wisdom-skill/INSIGHT.md#research-q05)提出未验证方向，为一个非敏感、已有verifier的任务绑定本轮执行摘要与claims门禁，再允许输出“本次计算事实”。比较未验证事实泄漏、误拒和人工恢复成本，不改善或恢复过重即否定；不扩展为传统解释现实效果保证。

[查看完整分析](../../plugins/dhicoc--dsh-chinese-traditional-wisdom-skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1359423472-root"></a>

## [dsh-codevault](../../plugins/1014029855--dsh-codevault/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1014029855/dsh-codevault)

> **用途**：读者保存源码认识并重复回访，要求对象/版本坐标、真实依据和档案恢复可解释。

> **亮点**：稳定对象卡、快记展开与回访/历史接线使记录可积累，标准文本易迁移；内容依据仍由读者核查。详见[Q01](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q01)与[Q02](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q02)。

> **思考**：vault仅词法守卫且stat递归跟链接、全文读后裁剪；expand/delete改旧行限制历史，整体JSONL与多派生文件非事务。详见[Q02](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q02)。

> **建议**：可探讨修订/tombstone日志与最小vault入口，固定source ref并加realpath/扫描预算；涉及迁移、擦除与日志增长取舍，未验证。详见[Q04](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/1014029855--dsh-codevault/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1324772199-root"></a>

## [dsh-deep-research](../../plugins/omdsh-dev--dsh-deep-research/INSIGHT.md)

[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-deep-research)

> **用途**：需要围绕明确决策问题搜集公开来源的研究人员，可用既有问题清单核对覆盖与引用。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-deep-research/INSIGHT.md#research-q01) 的队列把研究、再派高优先级缺口和审阅组织到一个工具回执中。

> **思考**：[Q02](../../plugins/omdsh-dev--dsh-deep-research/INSIGHT.md#research-q02) 的轮次上限可能让待处理题退出队列且不出现在计数里；工具成功不能用作覆盖验收。

> **建议**：[Q03](../../plugins/omdsh-dev--dsh-deep-research/INSIGHT.md#research-q03) 提议返回逐题覆盖及停止原因，以容量超限和来源失败样本验证能否减少漏判。

[查看完整分析](../../plugins/omdsh-dev--dsh-deep-research/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336585522-root"></a>

## [dsh-feed](../../plugins/863683348--dsh-feed/INSIGHT.md)

[![npm 30d 92](https://img.shields.io/static/v1?label=npm+30d&message=92&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feed) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feed)

> **用途**：查询 DSH 插件候选并向其他界面复用机器可读索引。

> **亮点**：模型工具、CLI 和实验性 MCP 共用可 diff JSON 索引，详见[Q03](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q03)。

> **思考**：默认覆盖有限、同插件跨源可能双计，网络部分失败仍更新时间；路径约束仅词法检查，详见[Q01](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q01)、[Q02](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q02)。

> **建议**：以仓库/包关联身份与显式分页/失败状态减少双计和假新鲜，反证及代价见[Q05](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q05)；真实路径写入仍需独立约束。

[查看完整分析](../../plugins/863683348--dsh-feed/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339672104-root"></a>

## [dsh-fund-research](../../plugins/perrylink--dsh-fund-research/INSIGHT.md)

[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-fund-research) [![npm 30d 3,990](https://img.shields.io/static/v1?label=npm+30d&message=3%2C990&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fund-research) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fund-research)

> **用途**：需要反复整理基金公开资料且能复核口径的研究者，把版本化Markdown/JSON作为可复算底稿，不把它当交易或预测系统。[Q01](../../plugins/perrylink--dsh-fund-research/INSIGHT.md#research-q01)

> **亮点**：把公开基金数据提取、确定性指标和逐数字路径附录变为宿主工具，输出可独立保留的版本化资料包，并为缺失字段显式留gaps。其价值是可检查的资料组织，不是自动验证市场事实或预测正确。[Q01](../../plugins/perrylink--dsh-fund-research/INSIGHT.md#research-q01) [Q02](../../plugins/perrylink--dsh-fund-research/INSIGHT.md#research-q02) [Q03](../../plugins/perrylink--dsh-fund-research/INSIGHT.md#research-q03)

> **思考**：asOf只截净值却保留其他当前字段，不能作为全资料历史可得性；verified仅与同快照一致，且核查异常仍封存。review重建snapshot数字而未解析实际报告或校验其hash，恢复和tracking尽力写，不能据封存/完成推完整、无泄漏或不可篡改。[Q02](../../plugins/perrylink--dsh-fund-research/INSIGHT.md#research-q02) [Q03](../../plugins/perrylink--dsh-fund-research/INSIGHT.md#research-q03) [Q04](../../plugins/perrylink--dsh-fund-research/INSIGHT.md#research-q04)

> **建议**：给每来源/字段附观测和可得时间，并区分历史可用与当前补充章节，可研究是否减少旧截点报告的前视混入；固定披露日样本比较泄漏、覆盖和维护成本。无法提供证据就拒用历史字段，收益未验证，不计当前创新。[Q05](../../plugins/perrylink--dsh-fund-research/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/perrylink--dsh-fund-research/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339286962-root"></a>

## [dsh-git-memory](../../plugins/seriousz158--dsh-memory/INSIGHT.md)

[![GitHub ★ 169](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=169&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/seriousz158/dsh-memory) [![npm 30d 1,002](https://img.shields.io/static/v1?label=npm+30d&message=1%2C002&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-git-memory) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-git-memory)

> **用途**：需要在 DSH 复用版本化项目知识的开发者。

> **亮点**：[Q01](../../plugins/seriousz158--dsh-memory/INSIGHT.md#research-q01) 将 Git 文档的摘要、检索与开关连接到宿主。

> **思考**：[Q02](../../plugins/seriousz158--dsh-memory/INSIGHT.md#research-q02) 清理保留 Git 恢复历史，异常恢复仍需验收。

> **建议**：[Q04](../../plugins/seriousz158--dsh-memory/INSIGHT.md#research-q04) 将重置、恢复点与潜在备份分开提示。

[查看完整分析](../../plugins/seriousz158--dsh-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1211255316-plugins-hacker-news"></a>

## [dsh-hacker-news](../../plugins/heartleo--hn-cli--plugins-hacker-news/INSIGHT.md)

[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/heartleo/hn-cli) [![npm 30d 707](https://img.shields.io/static/v1?label=npm+30d&message=707&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hacker-news) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hacker-news)

> **用途**：DSH 用户希望查询 Hacker News 文章、讨论或用户资料。

> **亮点**：[Q01](../../plugins/heartleo--hn-cli--plugins-hacker-news/INSIGHT.md#research-q01) 与 [Q02](../../plugins/heartleo--hn-cli--plugins-hacker-news/INSIGHT.md#research-q02) 将多个公开来源整合为可限量的宿主工具；信息质量仍需回源。

> **思考**：[Q03](../../plugins/heartleo--hn-cli--plugins-hacker-news/INSIGHT.md#research-q03) 截断和缺失可能影响对讨论的理解，外部内容也不能当可信指令。

> **建议**：[Q05](../../plugins/heartleo--hn-cli--plugins-hacker-news/INSIGHT.md#research-q05) 假设补充缺失节点统计可改进覆盖判断，需对照现有截断标志。

[查看完整分析](../../plugins/heartleo--hn-cli--plugins-hacker-news/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333258936-root"></a>

## [dsh-handbook](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md)

[![GitHub ★ 939](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=939&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Electricitysheep/dsh-handbook)

> **用途**：刚接触 DSH 的中文开发者可以按三天学习路径，从拿到一条回复练到读懂示例插件的接线，再选案例和调优章节。

> **亮点**：把首次回复、插件生效和应用练习拆成可见的过关点，便于定位新人卡在安装、配置还是扩展接线。这个贡献来自教学编排，适合用作带新人或自学的路线。[Q01](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md#research-q01) [Q02](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md#research-q02)

> **思考**：首页更新了版本警告，入门正文和模板仍留在不同的旧版本条件。读者从章节或模板直接进入时，需要逐例核对，尤其在迁移权限或会话时。性能附录的正确率分母也需单独澄清。[Q03](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md#research-q03) [Q04](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md#research-q04)

> **建议**：可在每个练习旁写清宿主固定版本、过关结果与版本失配时的停用信号，用同背景读者对照定位时间、错版次数和求助次数。若核对负担抵消收益，或错误没有减少，就放弃这层标注。尚未验证。[Q05](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336649545-root"></a>

## [dsh-insight](../../plugins/863683348--dsh-insight/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/863683348/dsh-insight) [![npm 30d 821](https://img.shields.io/static/v1?label=npm+30d&message=821&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-insight) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-insight)

> **用途**：面对插件目录的用户需要回答“哪些值得装、如何配、是否安全”；基线是逐个读 README、源码和安装说明。合格结果是候选能追溯到数据库/源码，安全扫描与需求匹配分开呈现，最终 verdict 明确证据强弱且不会自动安装。 详见[Q01](../../plugins/863683348--dsh-insight/INSIGHT.md#research-q01)。

> **亮点**：相对人工搜索，它把发现、环境组合、健康与静态安全放到同一询问入口，减少上下文切换；但“统一 verdict”容易把不同证据等级压成单一标签。静态规则与内置数据的新鲜度决定价值，不能替代固定版本源码研究、真实安装或宿主验收。 详见[Q03](../../plugins/863683348--dsh-insight/INSIGHT.md#research-q03)。

> **思考**：核心质疑是分数与 verdict 是否具有校准意义。若插件数据过期、静态扫描误报/漏报或权重无法解释，单一建议会放大错误信心；扫描本地目录只看可匹配模式，不会运行数据流、权限或外部服务。建议名为 install 也不构成用户授权。 详见[Q04](../../plugins/863683348--dsh-insight/INSIGHT.md#research-q04)。

> **建议**：未验证假设是把 verdict 改成可追溯证据图，并在数据过期或扫描未覆盖时拒绝给出 install，可降低误导。最小实验让两名审查者对 30 个插件做盲审，与现 verdict/证据图 verdict 比较一致率、严重漏报和复核时间；若可追溯版不降低高风险误判则否定。 详见[Q08](../../plugins/863683348--dsh-insight/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/863683348--dsh-insight/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335253559-root"></a>

## [dsh-knowledge](../../plugins/soren-abt--dsh-knowledge/INSIGHT.md)

[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Soren-ABT/dsh-knowledge) [![npm 30d 2,848](https://img.shields.io/static/v1?label=npm+30d&message=2%2C848&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-knowledge) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-knowledge)

> **用途**：在项目中反复引用多份资料，需要查找并核对原文的用户。

> **亮点**：[Q01](../../plugins/soren-abt--dsh-knowledge/INSIGHT.md#research-q01) 搜索在词法和向量候选前实施范围过滤，再以带修订的证据读取保持引用定位。

> **思考**：[Q02](../../plugins/soren-abt--dsh-knowledge/INSIGHT.md#research-q02) 未配置库选择意味着全部库，功能范围依赖宿主身份；省略修订会读取当前版本。[Q03](../../plugins/soren-abt--dsh-knowledge/INSIGHT.md#research-q03) 备份还必须包含独立处理产物。

> **建议**：[Q04](../../plugins/soren-abt--dsh-knowledge/INSIGHT.md#research-q04) 旧修订已被拒绝，新的可用性假设仅针对调用方省略修订的实证情形。

[查看完整分析](../../plugins/soren-abt--dsh-knowledge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351375738-root"></a>

## [dsh-literature](../../plugins/aik358--dsh-literature/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aik358/dsh-literature) [![npm 30d 1,892](https://img.shields.io/static/v1?label=npm+30d&message=1%2C892&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-literature) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-literature)

> **用途**：在DSH中研究写作的人将文献标识归为可复读资产；合格结果需身份、版本、全文与保存目标一致，不能仅依赖saved标签。

> **亮点**：把标识识别、元数据、PDF阅读、引用与多目标归档接成会话内状态机，并用阶段错误和同key下载去重组织恢复；底层学术API和PDF.js归属上游，当前下载缺陷限制兑现。详见[Q02](../../plugins/aik358--dsh-literature/INSIGHT.md#research-q02)。

> **思考**：全文候选push读取未声明trusted，源码与lib产物相同，静态可见会在候选构造触发错误；启动还会尝试无关Doctor detached supervisor。均未运行复现，不能当作已验收闭环。详见[Q03](../../plugins/aik358--dsh-literature/INSIGHT.md#research-q03)。

> **建议**：可探索分开“文件已存”与“文献身份已确认”的归档收据，用标识/版本、PDF哈希及用户核对减少同名和预印本错归档；尚未实现和验证。详见[Q06](../../plugins/aik358--dsh-literature/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/aik358--dsh-literature/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381989584-root"></a>

## [dsh-ls125-uv-probe](../../plugins/2333hutao--dsh-ls125-uv-probe/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2333hutao/dsh-ls125-uv-probe)

> **用途**：工程师需脱离原装仪表用自制 MCU 读取紫外探头，并复核字段、单位与清零操作。

> **亮点**：针对单一探头整理命令、字段、CRC、参考固件和抓取路线，比通用串口教程更具可操作性。详见[Q02](../../plugins/2333hutao--dsh-ls125-uv-probe/INSIGHT.md#research-q02)。

> **思考**：“完全逆向/全部测量证据”范围超出本包可见材料：原始案例在另仓，列出的三份样本只见一份，部分字节和命令仍未定。详见[Q03](../../plugins/2333hutao--dsh-ls125-uv-probe/INSIGHT.md#research-q03)。

> **建议**：逐项结论绑定可重放采样偏移与硬件版本，清零加单独确认/前后快照，可降低工程误用；尚未实现。详见[Q05](../../plugins/2333hutao--dsh-ls125-uv-probe/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2333hutao--dsh-ls125-uv-probe/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344714964-root"></a>

## [dsh-math-olympiad](../../plugins/988hj7tczd-oss--dsh-math-olympiad/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-math-olympiad) [![npm 30d 104](https://img.shields.io/static/v1?label=npm+30d&message=104&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-math-olympiad) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-math-olympiad)

> **用途**：辅助 IMO/Putnam 等竞赛题解题、证明校验和讲解输出。

> **亮点**：把求解、对抗验证、最多两轮修复和弃权写成可加载流程；详见[Q01](../../plugins/988hj7tczd-oss--dsh-math-olympiad/INSIGHT.md#research-q01)。

> **思考**：验证器隔离只由 Skill 文本纪律和模拟测试示例体现，生产期未见执行性保证；详见[Q02](../../plugins/988hj7tczd-oss--dsh-math-olympiad/INSIGHT.md#research-q02)。

> **建议**：若真实独立验证器仅接证明正文，错误证明通过率或可下降；需盲测并核入参，详见[Q03](../../plugins/988hj7tczd-oss--dsh-math-olympiad/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-math-olympiad/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340838178-root"></a>

## [dsh-mcp-connector](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md)

[![GitHub ★ 125](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=125&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/duhu2000/dsh-mcp-connector) [![npm 30d 36,855](https://img.shields.io/static/v1?label=npm+30d&message=36%2C855&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-connector) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-connector)

> **用途**：维护多套 MCP 服务的 DSH 用户需要在正确工作区找到精确工具，并判断卡在授权、握手、发现还是正式调用。

> **亮点**：[Q01](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md#research-q01) 将服务目录、授权和 Host 条目配置放在同一入口。[Q02](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md#research-q02) 给目录、握手与工具发现保留独立线索，便于缩小排查范围。

> **思考**：[Q03](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md#research-q03) 会话激活的 confirmed 来自模型可传入的工具参数，不能证明用户已确认。[Q02](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md#research-q02) 列出工具也不证明当前业务调用成功。

> **建议**：[Q05](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md#research-q05) 可以让 Host 发放绑定会话和工具的单次确认票据。若错项目、过期或重复票据仍能激活，或者合法流程频繁失败，则推翻假设。

[查看完整分析](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1428637034-root"></a>

## [dsh-mech-workbench](../../plugins/insideyou-0501--dsh-mech-workbench/INSIGHT.md)

[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/insideyou-0501/dsh-mech-workbench) [![npm 30d 1,178](https://img.shields.io/static/v1?label=npm+30d&message=1%2C178&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mech-workbench) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mech-workbench)

> **用途**：工科自学/讲解中把题图变成可核对的数值、图与假设。见 [Q01](../../plugins/insideyou-0501--dsh-mech-workbench/INSIGHT.md#research-q01)。

> **亮点**：把题图、求解、图形、警告和卡片接到DSH，展示求解降级与残差；数学库和视觉模型能力为继承。见 [Q01](../../plugins/insideyou-0501--dsh-mech-workbench/INSIGHT.md#research-q01)、[Q03](../../plugins/insideyou-0501--dsh-mech-workbench/INSIGHT.md#research-q03)。

> **思考**：校核失败仍可ok:true，硬关卡没有跨工具状态约束；局部残差不能验证题面建模，视觉检查也非确定性正确性证明。见 [Q02](../../plugins/insideyou-0501--dsh-mech-workbench/INSIGHT.md#research-q02)。

> **建议**：以题面确认/spec摘要绑定计算和图，失败校核只能形成未完成交付；验证是否减少错单位、改题不重算和跳检。见 [Q04](../../plugins/insideyou-0501--dsh-mech-workbench/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/insideyou-0501--dsh-mech-workbench/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333254657-dsh-mneme"></a>

## [dsh-mneme](../../plugins/slow-stack--mneme--dsh-mneme/INSIGHT.md)

[![GitHub ★ 204](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=204&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/slow-stack/mneme) [![npm 30d 9,770](https://img.shields.io/static/v1?label=npm+30d&message=9%2C770&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@modusensus/dsh-mneme) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@modusensus/dsh-mneme)

> **用途**：持续使用DSH并愿意管理持久知识的个人用户，减少重复解释项目与偏好；敏感或跨租户资料不适合直接混入默认全局库。

> **亮点**：[Q01](../../plugins/slow-stack--mneme--dsh-mneme/INSIGHT.md#research-q01)、[Q02](../../plugins/slow-stack--mneme--dsh-mneme/INSIGHT.md#research-q02) 子包将持久库、可读镜像、工具和宿主上下文接线，并保留同步债务与部分失败状态，便于跨会话复用知识；不将根合集和作者实验算本包实测收益。

> **思考**：[Q03](../../plugins/slow-stack--mneme--dsh-mneme/INSIGHT.md#research-q03) 自动scope不是硬隔离，门控默认关闭且可降级放行；可选actionRun在truthy命令disposer路径提前访问const disposers，源码推导存在启动错误。[Q02](../../plugins/slow-stack--mneme--dsh-mneme/INSIGHT.md#research-q02) DB与镜像非共同原子提交。

> **建议**：[Q05](../../plugins/slow-stack--mneme--dsh-mneme/INSIGHT.md#research-q05) 未验证假设是把召回与下游正确完成分开归因，以过时纠正和跨项目误用对照验证净价值；已有召回评估和门控不能重复算创新。

[查看完整分析](../../plugins/slow-stack--mneme--dsh-mneme/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1329424520-root"></a>

## [dsh-mnemon](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md)

[![GitHub ★ 922](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=922&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-mnemon) [![npm 30d 105,336](https://img.shields.io/static/v1?label=npm+30d&message=105%2C336&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon)

> **用途**：反复使用 DSH 处理同一项目的用户，希望跨会话重用短偏好、项目资料和旧决策，并能核对来源、存储范围及写入结果。[Q01](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q01) [Q02](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q02) 相对手工附加上下文，Starter 让常用偏好和按需证据共享回合级组合入口。根 Host 接 DSH 生命周期并固定 View，具体来源和 Provider 分包实现。

> **思考**：[Q03](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q03) 固定 View 和 ReadGrant 约束单回合调用。默认全局存储下，两个工作区可能共享数据。无记忆回合、检索预算耗尽和未提交写入都有不同表现，用户需要对照来源及凭据核验。

> **建议**：[Q05](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q05) 给高频决策附原始来源及最近核验时间，并在用户验收步骤检查，可能减少过期引用。用同一问题集比较陈旧引用、上下文 token 和人工核对。

[查看完整分析](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1415767842-root"></a>

## [dsh-moli](../../plugins/27painter--dsh-moli/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/27painter/dsh-moli) [![npm 30d 1,991](https://img.shields.io/static/v1?label=npm+30d&message=1%2C991&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-moli) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-moli)

> **用途**：需要读取动态网页、特定容器或截图的DSH用户；静态正文已有web_fetch时无需浏览器。[Q01](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q01)

> **亮点**：把上游浏览器接为DSH工具，并显式处理选择器互斥、空输出和二进制结果；渲染能力归Moli上游，不能把字符样本推成通用收益。[Q01](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q01) [Q02](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q02)

> **思考**：默认insecureTls:true降低证书核验；抓取使用spawnSync可能占用宿主事件循环，安装器摘要若无受信预期值也不提供来源认证。[Q03](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q03) [Q04](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q04)

> **建议**：未验证方向是受信字节与引擎锁定、严格TLS和异步可取消抓取；用错误证书、替换安装器与慢页面检查是否同时保住来源和响应性。[Q05](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/27painter--dsh-moli/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335613118-root"></a>

## [dsh-obsidian](../../plugins/mingzeng21--dsh-obsidian/INSIGHT.md)

[![GitHub ★ 47](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=47&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mingzeng21/dsh-obsidian) [![npm 30d 3,836](https://img.shields.io/static/v1?label=npm+30d&message=3%2C836&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-obsidian) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-obsidian)

> **用途**：已有 Obsidian vault 的 DSH 用户经常在会话内找回笔记、属性和相关链接。[Q01](../../plugins/mingzeng21--dsh-obsidian/INSIGHT.md#research-q01)

> **亮点**：把搜索结果、YAML 属性及反链接到同一个 DSH 会话工具集，移动后还会自动尝试改写匹配的 wiki 链接。[Q01](../../plugins/mingzeng21--dsh-obsidian/INSIGHT.md#research-q01) [Q03](../../plugins/mingzeng21--dsh-obsidian/INSIGHT.md#research-q03)

> **思考**：词法根检查和扫描排除不能限制实际符号链接与直接读取。移动和逐篇重写分开，属性工具也可能在实际写入后返回读回错误。失败后应核对磁盘上的笔记、链接和回收站。[Q02](../../plugins/mingzeng21--dsh-obsidian/INSIGHT.md#research-q02) [Q03](../../plugins/mingzeng21--dsh-obsidian/INSIGHT.md#research-q03)

> **建议**：待验证方向是先显示改名影响，再逐文件确认写入，测试能否减少异常时的误重试与手动恢复。[Q05](../../plugins/mingzeng21--dsh-obsidian/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/mingzeng21--dsh-obsidian/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1415116420-root"></a>

## [dsh-obsidian-board](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2026heshao/dsh-obsidian-board) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-obsidian-board) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-obsidian-board)

> **用途**：个人笔记库问答、找原文并回存知识。详见[Q01](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md#research-q01)。

> **亮点**：把搜索、来源阅读、流式问答与保存放进同页闭环。详见[Q01](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md#research-q01)。

> **思考**：索引直接读可含外链md而读源另有realpath，自动回退可能更换资料接收者，同名保存非独占。详见[Q03](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md#research-q03)、[Q04](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md#research-q04)。

> **建议**：研究统一索引/读源物理限额、取消预算与provider白名单、独占保存和历史CAS，比较召回/停止/恢复。当前未验证。详见[Q06](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336663456-root"></a>

## [dsh-plugin-academic-writing](../../plugins/863683348--dsh-plugin-academic-writing/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/863683348/dsh-plugin-academic-writing) [![npm 30d 1,733](https://img.shields.io/static/v1?label=npm+30d&message=1%2C733&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-academic-writing) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-academic-writing)

> **用途**：服务已经有真实研究材料、需要论文骨架/引用初稿/格式片段和机械文本检查的DSH用户。单工具十种action提供outline/title/abstract/citation/check/checklist/references/latex/structure/glossary；模型或作者写正文，插件不检索文献、不核事实/引用真伪，也不生成真实研究结果。

> **亮点**：用一个模型工具提供可重复模板/格式和机械检查，纯逻辑不另发网络或写文件，帮助起草而非学术验收。详见[Q02](../../plugins/863683348--dsh-plugin-academic-writing/INSIGHT.md#research-q02)。

> **思考**：非global捕获regex的match.length不是出现次数；缺作者APA类型分支、引用去重/style覆盖、LaTeX列数/转义有缺口，passed/清单不证明质量。详见[Q03](../../plugins/863683348--dsh-plugin-academic-writing/INSIGHT.md#research-q03)、[Q04](../../plugins/863683348--dsh-plugin-academic-writing/INSIGHT.md#research-q04)。

> **建议**：可探索带位置/范围/未知的规则收据和有版本规范样例/格式前置校验，比较错误与人工纠错；未实现。详见[Q06](../../plugins/863683348--dsh-plugin-academic-writing/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/863683348--dsh-plugin-academic-writing/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336223158-root"></a>

## [dsh-plugin-audit](../../plugins/863683348--dsh-plugin-audit/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/863683348/dsh-plugin-audit) [![npm 30d 817](https://img.shields.io/static/v1?label=npm+30d&message=817&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-audit) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-audit)

> **用途**：在 DSH 生态选择待评估插件并跟踪仓库健康度。

> **亮点**：提供可解释的元数据分数与按需安全线索，详见[Q01](../../plugins/863683348--dsh-plugin-audit/INSIGHT.md#research-q01)。

> **思考**：深扫失败被落成空扫描并在工具输出中表现为 clean，可能覆盖既有证据；详见[Q02](../../plugins/863683348--dsh-plugin-audit/INSIGHT.md#research-q02)。

> **建议**：区分抓取失败与有效扫描，保留旧结果并展示覆盖范围；反证条件及代价见[Q05](../../plugins/863683348--dsh-plugin-audit/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/863683348--dsh-plugin-audit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336663504-root"></a>

## [dsh-plugin-finance-data](../../plugins/863683348--dsh-plugin-finance-data/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/863683348/dsh-plugin-finance-data)

> **用途**：Agent 在有已核来源/口径的数字上做格式化、收益与风险计算。

> **亮点**：将常见财务算术从模型口算转为确定性工具，并提示数据来源/口径。详见[Q01](../../plugins/863683348--dsh-plugin-finance-data/INSIGHT.md#research-q01)。

> **思考**：四类财务比率在计算层和展示层各乘 100；多年 plan 默认只算 12 期，portfolio 未返回再平衡单。详见[Q02](../../plugins/863683348--dsh-plugin-finance-data/INSIGHT.md#research-q02)、[Q03](../../plugins/863683348--dsh-plugin-finance-data/INSIGHT.md#research-q03)。

> **建议**：统一单位契约并分离最终计算与表格采样，配黄金样本可提高可靠性；修复效果尚未验。详见[Q04](../../plugins/863683348--dsh-plugin-finance-data/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/863683348--dsh-plugin-finance-data/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334654243-root"></a>

## [dsh-plugin-tavily](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1624318455/dsh-plugin-tavily) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tavily)

> **用途**：在 DSH 中用 Tavily 网页检索并可配置页面提取与费用控制。

> **亮点**：整合搜索、提取、参数配置、多键轮换与回退，详见[Q01](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md#research-q01)。

> **思考**：无 key search 在 HTTP 前抛缺凭据；符合持久缓存写入条件时原始 API key 会作为 JSON 键落盘；详见[Q02](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md#research-q02)。

> **建议**：对缓存 key 使用不可逆标识、明确无 key 搜索路径并以正式扩展机制显示 GUI，可改善可用性和凭据边界；待验证，详见[Q02](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md#research-q02)。

[查看完整分析](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336684054-root"></a>

## [dsh-plugin-verify](../../plugins/863683348--dsh-plugin-verify/INSIGHT.md)

[![npm 30d 831](https://img.shields.io/static/v1?label=npm+30d&message=831&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-verify) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-verify)

> **用途**：主张下结论/配置或插件元数据检查前定位材料，仍需读原文/标准解析和真实验收。

> **亮点**：统一文本定位和多类元数据入口并保留单项行号，非语义事实证明或安全审计。详见[Q01](../../plugins/863683348--dsh-plugin-verify/INSIGHT.md#research-q01)与[Q02](../../plugins/863683348--dsh-plugin-verify/INSIGHT.md#research-q02)。

> **思考**：60%关键词就verified/high未校准，batch丢证据/静默截断，YAML仅词法且rawfetch缺Host网络围栏。详见[Q02](../../plugins/863683348--dsh-plugin-verify/INSIGHT.md#research-q02)。

> **建议**：可探讨分级检查/覆盖收据，batch保完整来源/反证，语法/Schema/加载分开并核网络策略，资源/人工成本未验证。详见[Q05](../../plugins/863683348--dsh-plugin-verify/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/863683348--dsh-plugin-verify/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1424538914-root"></a>

## [dsh-purge](../../plugins/lanjingod--dsh-purge/INSIGHT.md)

[![GitHub ★ 59](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=59&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LanJinGod/dsh-purge) [![npm 30d 1,916](https://img.shields.io/static/v1?label=npm+30d&message=1%2C916&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-purge) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-purge)

> **用途**：具备可重建离线宿主的研究者可研究提示词与宿主限制分离；结果须记录具体改变和恢复，不以少拒绝当能力提高，见 [Q01](../../plugins/lanjingod--dsh-purge/INSIGHT.md#research-q01)。

> **亮点**：把提示词、宿主patch状态、回滚与演练记录集中，并显示磁盘/运行时阶段；继承模型/宿主工具能力，不证明全模型破甲或评测更准确，见 [Q01](../../plugins/lanjingod--dsh-purge/INSIGHT.md#research-q01)、[Q02](../../plugins/lanjingod--dsh-purge/INSIGHT.md#research-q02)。

> **思考**：未点应用不等于只读，新会话特定条件会提升完全访问；演练确认是布尔记录、区域gate是第一步文本启发式，不能替代执行授权与网络隔离，见 [Q03](../../plugins/lanjingod--dsh-purge/INSIGHT.md#research-q03)。

> **建议**：未验证方向是统一默认只观察，将运行时权限/注入和磁盘patch纳入同一差异/阶段账本，比较误归因与维护负担，见 [Q05](../../plugins/lanjingod--dsh-purge/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/lanjingod--dsh-purge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335718387-root"></a>

## [dsh-quant](../../plugins/pengpengyi92--dsh-quant/INSIGHT.md)

[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pengpengyi92/dsh-quant) [![npm 30d 1,035](https://img.shields.io/static/v1?label=npm+30d&message=1%2C035&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-quant) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-quant)

> **用途**：能独立复算数值/时序口径的研究者可让Agent组织固定数据到报告；交付必须可追数据与费用假设，模拟不作实盘或收益证据，见[Q01](../../plugins/pengpengyi92--dsh-quant/INSIGHT.md#research-q01)。

> **亮点**：已有增量是把多域函数以统一工具契约和固定管线交给Agent组合，并明确次根成交/等长对齐等约定；工具数与作者测试数不代替独立数值/收益验证，见[Q01](../../plugins/pengpengyi92--dsh-quant/INSIGHT.md#research-q01)至[Q03](../../plugins/pengpengyi92--dsh-quant/INSIGHT.md#research-q03)。

> **思考**：双均线完整平仓未把价差结转现金，却流入pipeline报告；fallback实际来源被丢弃、年化固定365，执行模拟还有乱序与满仓手续费边界。均为静态推导未运行，见[Q03](../../plugins/pengpengyi92--dsh-quant/INSIGHT.md#research-q03)至[Q05](../../plugins/pengpengyi92--dsh-quant/INSIGHT.md#research-q05)。

> **建议**：未验证方向是在修正数值实现后，为报告强制带实际来源/闭合/输入哈希/周期和资金守恒清单，比较口径误判与维护负担，见[Q07](../../plugins/pengpengyi92--dsh-quant/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/pengpengyi92--dsh-quant/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335047324-root"></a>

## [dsh-read-url](../../plugins/2672243194--dsh-read-url/INSIGHT.md)

[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2672243194/dsh-read-url) [![npm 30d 2,587](https://img.shields.io/static/v1?label=npm+30d&message=2%2C587&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-read-url) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-read-url)

> **用途**：研究者与开发者需要从公开来源获得可核对的紧凑正文，交付以关键事实和出处为准，不以HTTP成功或字符变少为准。

> **亮点**：把多格式解码、正文提取、分页续读、缓存及并发工具接入DSH，减少模型手工组织抓取；成熟网络与提取机制的组合不等于原创引擎，作者效果对照未独立验证。详见[Q03](../../plugins/2672243194--dsh-read-url/INSIGHT.md#research-q03)。

> **思考**：成功返回的紧凑文本不证明完整覆盖，启发式提取和分页失败会留下遗漏；提供方缺失回退与显式直连例外还改变网络信任边界。源码支持这些条件判断，未作运行复现。详见[Q04](../../plugins/2672243194--dsh-read-url/INSIGHT.md#research-q04)。

> **建议**：可探索可核对压缩阅读收据，将每页来源、通道、原文哈希和停止原因附在提取结果中，检验是否减少遗漏误判；新增存储与token负担，尚未验证。详见[Q08](../../plugins/2672243194--dsh-read-url/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/2672243194--dsh-read-url/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339317132-root"></a>

## [dsh-run2skill](../../plugins/qkycir-123--dsh-run2skill/INSIGHT.md)

[![GitHub ★ 106](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=106&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/qkycir-123/dsh-run2skill) [![npm 30d 1,898](https://img.shields.io/static/v1?label=npm+30d&message=1%2C898&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-run2skill) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-run2skill)

> **用途**：用户反复向 Agent 解释团队工作流，希望将纠正保存为可复用指令。

> **亮点**：[Q01](../../plugins/qkycir-123--dsh-run2skill/INSIGHT.md#research-q01) 连接会话经验和有来源的待审草稿。

> **思考**：[Q02](../../plugins/qkycir-123--dsh-run2skill/INSIGHT.md#research-q02) 发布绑定当前项目和审查版本，实际异常恢复与数据边界待验。

> **建议**：[Q03](../../plugins/qkycir-123--dsh-run2skill/INSIGHT.md#research-q03) 对照手写的用时、审查负担与次轮命中。

[查看完整分析](../../plugins/qkycir-123--dsh-run2skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333737063-root"></a>

## [dsh-science](../../plugins/biociao--dsh-science/INSIGHT.md)

[![GitHub ★ 47](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=47&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/biociao/dsh-science) [![npm 30d 1,384](https://img.shields.io/static/v1?label=npm+30d&message=1%2C384&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-science) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-science)

> **用途**：dsh-science0.2.0是MIT、Node>=18的DSH原生bundle/研究preset/Skills工具集，面向能审数据/脚本/结论的科研开发者。包把research/artifact/remote引擎和远程主机UI装入profile，另依赖dsh-model-tier^0.1.0；并非独立模型/科学验证器。基线是实验笔记+git/文件hash、手工SSH/SLURM或原生可信远程工具组合，成功须输入/脚本/目标和真实结果可对账，并经独立科学/数据验收。

> **亮点**：[Q02](../../plugins/biociao--dsh-science/INSIGHT.md#research-q02)结构化问题假设/实验记录；[Q03](../../plugins/biociao--dsh-science/INSIGHT.md#research-q03)版本文件/来源/hash；[Q04](../../plugins/biociao--dsh-science/INSIGHT.md#research-q04)可追真实远端执行接线，而非独立科学验证。

> **思考**：[Q04](../../plugins/biociao--dsh-science/INSIGHT.md#research-q04)approve参数可跳作业审批、远端先启动本地后记、项目Jxx/scratch冲突；[Q05](../../plugins/biociao--dsh-science/INSIGHT.md#research-q05)取消失败仍标killed、unknown/输出/UI权限和写锁边界限制采用。

> **建议**：[Q06](../../plugins/biociao--dsh-science/INSIGHT.md#research-q06)分开提交/真实终止/独立结果验收收据与唯一项目远端命名，先比人工清单/小修，不算已有成果。

[查看完整分析](../../plugins/biociao--dsh-science/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334269686-root"></a>

## [dsh-scrape-webpage](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/131CDA1/dsh-scrape-webpage) [![npm 30d 1,067](https://img.shields.io/static/v1?label=npm+30d&message=1%2C067&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-scrape-webpage) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-scrape-webpage)

> **用途**：面向需要把公开网页正文交给模型分析的 DSH 用户，用一个工具完成抓取、正文提取与失败降级。 [Q01](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md#research-q01)

> **亮点**：相对直接 curl 或 fetch，它将多获取路径与正文规整封装为单一 DSH 工具，贡献是降低网页材料进入会话的接线负担，而不是替代完整浏览器自动化。 [Q03](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md#research-q03)

> **思考**：静态抓取对登录、脚本渲染、反爬和页面结构变化敏感；源码结构能证明降级路径存在，但没有同站点样本证明正文完整性和稳定性。 [Q04](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md#research-q04)

> **建议**：可增加“证据保真模式”，同时返回正文、关键 DOM 定位和被删除区块摘要，让研究任务在压缩上下文时仍能回查来源。 [Q08](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1423253220-root"></a>

## [dsh-search](../../plugins/439436269-ctrl--dsh-search/INSIGHT.md)

[![npm 30d 239](https://img.shields.io/static/v1?label=npm+30d&message=239&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vfvrpq/dsh-search) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vfvrpq/dsh-search)

> **用途**：适合需要搜索语法、结果条数、正文和多页汇总可控的研究任务；已有 web_search/fetch 且需求简单时不必增加供应商。 详见[Q01](../../plugins/439436269-ctrl--dsh-search/INSIGHT.md#research-q01)。

> **亮点**：搜索与正文抓取在同一 API 方言下串成可预算研究，优势是字段一致与权威度/日期等元数据。 详见[Q03](../../plugins/439436269-ctrl--dsh-search/INSIGHT.md#research-q03)。

> **思考**：无法替代登录、点击和强 SPA 浏览器；转义标点、HTML 壳与正文缺失会影响结果，摘要也不是独立事实验证。 详见[Q04](../../plugins/439436269-ctrl--dsh-search/INSIGHT.md#research-q04)。

> **建议**：给 research 增加 maxCost 和逐 URL 去重/停止条件，可把“自动多页”变成可证明不超预算的检索单元。 详见[Q08](../../plugins/439436269-ctrl--dsh-search/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/439436269-ctrl--dsh-search/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334369459-root"></a>

## [dsh-sidebar-qa](../../plugins/chenruot--dsh-sidebar-qa/INSIGHT.md)

[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ChenRuoT/dsh-sidebar-qa) [![npm 30d 2,314](https://img.shields.io/static/v1?label=npm+30d&message=2%2C314&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sidebar-qa) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sidebar-qa)

> **用途**：面向阅读长DSH对话时需要解释一个片段的个人，直接在侧栏建立独立追问而保留主线。见 [Q01](../../plugins/chenruot--dsh-sidebar-qa/INSIGHT.md#research-q01)。

> **亮点**：把引文定位、上下文策略、同工作区子会话和侧栏连续问答接成一条阅读流程，相对手工复制和切换增加会话组织与装配，主会话执行队列不接收旁支prompt。净节时和正确率未实测，基础fork与模型能力来自宿主。见 [Q01](../../plugins/chenruot--dsh-sidebar-qa/INSIGHT.md#research-q01)、[Q03](../../plugins/chenruot--dsh-sidebar-qa/INSIGHT.md#research-q03)。

> **思考**：回答出现不代表背景和模型按选择兑现。摘要失败可只保留近期文本却仍报未降级，回答模型选择失败只记录警告后继续；早期约束与费用敏感任务需核真实输入和路由。见 [Q02](../../plugins/chenruot--dsh-sidebar-qa/INSIGHT.md#research-q02)。

> **建议**：可试验上下文来源与实际模型回执，在缺背景或路由不符时让用户确认后再发。固定正常/失败场景比较关键事实和错误模型发现率、人工时间与重试；若干扰大于收益，收窄到异常展示。尚未实现或验证。见 [Q04](../../plugins/chenruot--dsh-sidebar-qa/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/chenruot--dsh-sidebar-qa/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333476862-root"></a>

## [dsh-sticky-note](../../plugins/meredith2328--dsh-sticky-note/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Meredith2328/dsh-sticky-note)

> **用途**：这是MIT的DSH原生便签插件0.6.1，针对对话时临时记点子/感想/TODO的人，把普通Markdown文件记录、历史查看与当前输入框连接。最低DSH0.2.0-rc.2且排除0.3预发布，客户端依赖connection/slots/workspace与React，服务端依赖connection和可选settings；Host兼容和作者声称的0.2.1-rc.5实测本轮没有复现。

> **亮点**：[Q02](../../plugins/meredith2328--dsh-sticky-note/INSIGHT.md#research-q02)对话内保存与草稿；[Q03](../../plugins/meredith2328--dsh-sticky-note/INSIGHT.md#research-q03)普通文件归档；[Q04](../../plugins/meredith2328--dsh-sticky-note/INSIGHT.md#research-q04)真实当前输入框接线。

> **思考**：[Q02](../../plugins/meredith2328--dsh-sticky-note/INSIGHT.md#research-q02)保存非跨进程事务；[Q03](../../plugins/meredith2328--dsh-sticky-note/INSIGHT.md#research-q03)旧mtime回收站可同轮删除；[Q04](../../plugins/meredith2328--dsh-sticky-note/INSIGHT.md#research-q04)直接发送替换草稿与Host身份边界。

> **建议**：[Q05](../../plugins/meredith2328--dsh-sticky-note/INSIGHT.md#research-q05)先比较备份/append清单，再验证保存版本、入站时间与发送目标回执。

[查看完整分析](../../plugins/meredith2328--dsh-sticky-note/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331846104-root"></a>

## [dsh-stock-market](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AnacondaKC/dsh-stock-market)

> **用途**：个人用户在DSH内获取公开证券资料并核对来源、时点和口径；不以插件查询成功替代交易或投资判断。

> **亮点**：把底层公开源收敛成9个业务工具，保留来源/回退/降级原因，并把会话工具目录限制与最终拒绝结合，减少任意URL拼接和只隐藏按钮的漏洞面。详见[Q02](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md#research-q02)。

> **思考**：回退成功不是多源核验，fetched_at不是行情时间，degraded也不证明口径可比；会话guard依赖真实Agent和宿主契约，公开源无稳定服务保证。详见[Q03](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md#research-q03)。

> **建议**：可探索按原问题时效/口径需求生成数据适用性收据，以固定陈旧、缺时间及跨复权样本比较误用与解释成本；未实现。详见[Q06](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334076307-root"></a>

## [dsh-tabbit](../../plugins/tabbit-browser--dsh-tabbit/INSIGHT.md)

[![GitHub ★ 122](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=122&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tabbit-Browser/dsh-tabbit) [![npm 30d 2,395](https://img.shields.io/static/v1?label=npm+30d&message=2%2C395&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tabbit) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tabbit)

> **用途**：需要用现有浏览器读取渲染网页、登录页或标签上下文的 DSH 用户。

> **亮点**：[Q01](../../plugins/tabbit-browser--dsh-tabbit/INSIGHT.md#research-q01) 连接本地真实浏览器、会话任务与宿主工具。

> **思考**：[Q02](../../plugins/tabbit-browser--dsh-tabbit/INSIGHT.md#research-q02) 授权记忆、一般浏览器动作与抓取重定向需要区分。

> **建议**：[Q04](../../plugins/tabbit-browser--dsh-tabbit/INSIGHT.md#research-q04) 请求前逐跳检查可能减少内网目标收到的未授权请求。

[查看完整分析](../../plugins/tabbit-browser--dsh-tabbit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1369301269-root"></a>

## [dsh-tavily-web](../../plugins/arcaneorion--dsh-tavily-web/INSIGHT.md)

[![npm 30d 1,353](https://img.shields.io/static/v1?label=npm+30d&message=1%2C353&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@arcaneorion/dsh-tavily-web) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@arcaneorion/dsh-tavily-web)

> **用途**：面向需要在 DSH 中搜索公开网页并读取页面的研究者，用现有 Tavily 凭据池提高部分账号失效时的连续性。

> **亮点**：相对单钥 Tavily 包装，增加凭据引用轮询、分类错误处理及密钥更新后解除隔离，并把无钥抓页放入宿主 web seam。搜索能力和排名来自 Tavily，抓页来自 curl；本项增量在失败调度与接入，不能把多钥数量等同于检索质量或总额度收益。[Q01](../../plugins/arcaneorion--dsh-tavily-web/INSIGHT.md#research-q01)

> **思考**：池能否在失效时控制总尝试成本决定连续性价值。holding 返回永久/冷却状态后仅把钥放 deferred，第二循环无条件再次尝试，因此401与冷却钥在全池无健康钥时仍被请求。每次curl有25/30秒限制，但没有本工具全池总时限或并发租约，多钥可放大延迟和额度压力。正文只正则去标签、截20k，不能替代浏览器渲染与证据复核。[Q02](../../plugins/arcaneorion--dsh-tavily-web/INSIGHT.md#research-q02)

> **建议**：未验证方向是每次检索设置总预算，对冷却钥只给一个并发探测租约，401钥仅在指纹变化后重试。用全部429、混合成功、重复401和并发查询对照现版，若合格来源返回率不降低而请求量/尾延迟下降则支持；若错过已恢复钥或延迟无改善则否定。[Q03](../../plugins/arcaneorion--dsh-tavily-web/INSIGHT.md#research-q03)

[查看完整分析](../../plugins/arcaneorion--dsh-tavily-web/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1358319839-root"></a>

## [dsh-teaching-board](../../plugins/arcaneorion--dsh-teaching-board/INSIGHT.md)

[![npm 30d 1,341](https://img.shields.io/static/v1?label=npm+30d&message=1%2C341&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@arcaneorion/dsh-teaching-board) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@arcaneorion/dsh-teaching-board)

> **用途**：面向需要交互讲解的学习者与讲授者，把模型生成的 HTML 板书放在会话页签，并通过圈画截图表达疑问。

> **亮点**：相对生成独立 HTML 后手工截图粘贴，插件把板书增量更新、笔迹和反馈附件串进会话流程，并把使用纪律与能力同包发布。关键增量是教学反馈交接，沙箱、HTML 渲染、会话附件都来自浏览器和宿主；host 工具只返回请求元数据，真正像素必须由挂载的浏览器回传。[Q01](../../plugins/arcaneorion--dsh-teaching-board/INSIGHT.md#research-q01)

> **思考**：被当作真实用户消息的反馈是否具有可信来源决定闭环边界。onMessage 只检查数据标记，未校验 event.source 对应当前 iframe，也未绑定截图 requestId；带 localweb 标记的文本可走 setDraft/submit。iframe 的 allow-scripts 限制同源访问，但源码未见 CSP 网络禁令，不能据此承诺无外网。这些是源码可见的边界缺口，尚未运行攻击或证明宿主外层没有额外防护。[Q02](../../plugins/arcaneorion--dsh-teaching-board/INSIGHT.md#research-q02)

> **建议**：由截图请求与用户输入权限之间的缺口，可提出未验证协议：父层只接收当前 iframe 的消息，为每次截图绑定一次性 requestId，反馈先进入可确认草稿；另对 self-contained 板面施加明确 CSP。用其他 iframe 伪造 capture/panel_input、过期请求和带外链 HTML 对照，要求全部拒绝且合法反馈保留。若破坏正常附件回传或仍允许未授权提交，则方案不成立。[Q04](../../plugins/arcaneorion--dsh-teaching-board/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/arcaneorion--dsh-teaching-board/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1160354976-dsh"></a>

## [dsh-thoughtdag](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md)

[![GitHub ★ 725](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=725&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chenxiachan/thoughtdag) [![npm 30d 5,918](https://img.shields.io/static/v1?label=npm+30d&message=5%2C918&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-thoughtdag) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-thoughtdag)

> **用途**：面向需要组织历史会话和从图节点继续的 DSH 用户。

> **亮点**：[Q02](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q02) 将图节点映射为宿主会话动作；不是历史真实性或模型理解的证明。

> **思考**：[Q03](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q03) Host 检查不是完整鉴权，why 构建产物当前未验证；[Q02](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q02) 写回会改变会话。

> **建议**：[Q05](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q05) 提议写回前绑定目标与来源版本，以误操作和用户负担对照。

[查看完整分析](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336817611-root"></a>

## [dsh-timeline](../../plugins/houyanchao--dsh-timeline/INSIGHT.md)

[![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/houyanchao/dsh-timeline) [![npm 30d 1,481](https://img.shields.io/static/v1?label=npm+30d&message=1%2C481&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-timeline) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-timeline)

> **用途**：dsh-timeline0.1.3是原生浏览器UI插件，Host apply为空，不注册模型工具或服务器资料库。适合经常回查长对话、把提问/结论收成可复用资料的人；时间轴、提问列表、收藏两级文件夹、闪记、提示词和导出集中在宿主入口。成功应是更少滚动找到正确原消息、收藏可重开且导出信息足够迁移，不是看到更多按钮。

> **亮点**：[Q01](../../plugins/houyanchao--dsh-timeline/INSIGHT.md#research-q01)、[Q02](../../plugins/houyanchao--dsh-timeline/INSIGHT.md#research-q02)把定位、收藏和资料带走集中到原生槽位与输入草稿，减少手工拼入口。

> **思考**：[Q02](../../plugins/houyanchao--dsh-timeline/INSIGHT.md#research-q02)、[Q03](../../plugins/houyanchao--dsh-timeline/INSIGHT.md#research-q03)DOM不在可静默跳失败、历史stall仍部分导出、MD图片blob非自包含，localStorage写失败被吞且覆盖导入无事务；不适合作唯一知识档案。

> **建议**：[Q04](../../plugins/houyanchao--dsh-timeline/INSIGHT.md#research-q04)提出未验证的定位/导出部分/持久失败状态链，用已知fixture与故障对照测误信和恢复，不以更多格式代完整性。

[查看完整分析](../../plugins/houyanchao--dsh-timeline/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336582509-root"></a>

## [dsh-trend-radar](../../plugins/863683348--dsh-trend-radar/INSIGHT.md)

[![npm 30d 111](https://img.shields.io/static/v1?label=npm+30d&message=111&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-trend-radar) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-trend-radar)

> **用途**：想观察 DSH 插件新增、stars 变化和 awesome 收录趋势。

> **亮点**：把 GitHub/awesome 快照历史转成可查询趋势与 session 面板起点。详见[Q01](../../plugins/863683348--dsh-trend-radar/INSIGHT.md#research-q01)。

> **思考**：数据目录不存在且首次直接 collect 时，先读后建目录可使快照受 ENOENT 阻断；top100 更新排序不是全生态，详见[Q02](../../plugins/863683348--dsh-trend-radar/INSIGHT.md#research-q02)、[Q03](../../plugins/863683348--dsh-trend-radar/INSIGHT.md#research-q03)。

> **建议**：修复空目录初始化、稳定 cohort/分页及类别映射和 watch 游标，才能形成可靠趋势雷达；待验证。详见[Q02](../../plugins/863683348--dsh-trend-radar/INSIGHT.md#research-q02)、[Q03](../../plugins/863683348--dsh-trend-radar/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/863683348--dsh-trend-radar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1337487779-root"></a>

## [dsh-ultramath](../../plugins/andiii208--dsh-ultramath/INSIGHT.md)

[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Andiii208/dsh-ultramath)

> **用途**：数学建模竞赛团队需从读题、求解、验证到论文审稿的组织模板。

> **亮点**：把分阶段数模资产、五角色预设、模型库、模板和审稿脚本打包为可发现入口，降低流程搭建成本；核心流程执行依赖模型与上游工具。详见[Q01](../../plugins/andiii208--dsh-ultramath/INSIGHT.md#research-q01)、[Q02](../../plugins/andiii208--dsh-ultramath/INSIGHT.md#research-q02)。

> **思考**：“全自动/独立验算/盲评”多为提示文本，不能保证模型正确或真正独立；同步还会清理同名目标目录额外文件，安装前须核所有权和备份。详见[Q03](../../plugins/andiii208--dsh-ultramath/INSIGHT.md#research-q03)。

> **建议**：从已有阶段提示/同模型评审出发，若每席受强制异方法和可重放数字证据约束，可能降低相关错误漏检；需等预算公开题目对照漏检率与总成本，若无改善或成本超预注册阈值即证伪。条件、代价与比较详见[Q05](../../plugins/andiii208--dsh-ultramath/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/andiii208--dsh-ultramath/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333132287-root"></a>

## [dsh-visualize](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md)

[![GitHub ★ 335](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=335&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nagi-ovo/dsh-visualize) [![npm 30d 6,080](https://img.shields.io/static/v1?label=npm+30d&message=6%2C080&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-visualize) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-visualize)

> **用途**：面向在 DSH Web 中讲解算法、比较参数或讨论界面原型的人，把模型生成的 HTML 直接作为可交互卡片交付。合格结果须能按已知规则交互且可回读，具体场景依据与边界见 [Q01](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q01)。

> **亮点**：它把生成片段、沙箱展示、精确局部修订和会话重放接在同一对话内，读者选择还能在审阅后变成下一条问题；相对保存 HTML 再打开的流程，具体增量是减少文件交接并保持修订入口。浏览器、图表库与模型本身的能力不算本组件原创，实际理解效果仍未知。见 [Q01](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q01)、[Q03](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q03)。

> **思考**：能展示、能修补不等于解释正确。检查器允许未改动的旧问题随警告保留，自修复只有有限启发式提醒；公式、数据和关键图片仍需用户核对。按会话分目录也不构成会话授权隔离，更新入口接受整个可视化根下的 HTML 路径，因此共享主目录场景需另验边界。见 [Q02](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q02)、[Q03](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q03)。

> **建议**：从创建按会话分目录、更新按全局根接受路径的差异，可推导尚未验证的会话内卡片标识方案。宿主签发卡片标识，并在更新时核对会话归属与预期内容版本，可能缩小跨会话误改和陈旧补丁覆盖，同时保留局部修订便利；代价是迁移、分享与旧路径兼容。用两会话的合法更新、越界标识、过期版本三组请求检验是否明确拒绝且原件不变，再比较正常操作负担；已有等价宿主隔离或兼容负担过高都会削弱增量。见 [Q05](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340558027-root"></a>

## [dsh-web-search-free](../../plugins/mochinek0--dsh-web-search-free/INSIGHT.md)

[![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MochiNek0/dsh-web-search-free) [![npm 30d 6,350](https://img.shields.io/static/v1?label=npm+30d&message=6%2C350&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-search-free) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-search-free)

> **用途**：已有多个搜索凭据、公开查询遇单源限额/不可达的用户，可自动尝试替代来源；需以正确可回查来源和总费用验收，见 [Q01](../../plugins/mochinek0--dsh-web-search-free/INSIGHT.md#research-q01)。

> **亮点**：贡献是将多凭据容错、结构来源和可选并行接入原生web接口，并显式处理空来源和弱抓取；没有证明净搜索质量/费用胜出，见 [Q01](../../plugins/mochinek0--dsh-web-search-free/INSIGHT.md#research-q01)与 [Q02](../../plugins/mochinek0--dsh-web-search-free/INSIGHT.md#research-q02)。

> **思考**：域名排除只过滤sources而非聚合answer，抓取缓存只按URL且新TTL不清旧项；多引擎扩大调用与外发，free不等于零成本，见 [Q02](../../plugins/mochinek0--dsh-web-search-free/INSIGHT.md#research-q02)、[Q03](../../plugins/mochinek0--dsh-web-search-free/INSIGHT.md#research-q03)和 [Q05](../../plugins/mochinek0--dsh-web-search-free/INSIGHT.md#research-q05)。

> **建议**：未验证方向是给抓取缓存附实际来源/时间并绑定配置，强排除任务不使用无法归因的answer；比较错误引用改善与额外调用负担，见 [Q06](../../plugins/mochinek0--dsh-web-search-free/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/mochinek0--dsh-web-search-free/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1358313559-root"></a>

## [dsh-wsl-obscura](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-obscura)

> **用途**：从 WSL 获取需要页面渲染的公开文本或链接，并返回给 DSH 模型工具。

> **亮点**：让 WSL 代理把无头浏览器结果作为 DSH 工具结果读取，不必手动执行或搬运文本。[Q01](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md#research-q01) [Q02](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md#research-q02)

> **思考**：包装层仅检查 URL 协议，私网选项可由工具参数启用；实际网络隔离交由外部二进制。[Q03](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md#research-q03)

> **建议**：将私网权限限定给操作者，再对主导航、跳转及子资源做同一验证；用公开夹具通过率与私网访问是否被拒绝检验。尚未验证。[Q04](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1380817560-root"></a>

## [dsh-wsl-obsidian](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-obsidian)

> **用途**：使用 WSL 的 DSH 用户希望在不搬迁现有 Obsidian 库的情况下搜索笔记、阅读双链并打开桌面页。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md#research-q01) 把库发现、状态检查和双链作为 Agent 工具接入现有本地笔记，减少每次解释挂载路径的操作；没有建立独立语义索引或冲突解决机制。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md#research-q02) 写入只检查工具参数和词法路径，缺少真实路径与文件版本约束。库内链接、外部编辑与重复追加必须独立验证。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md#research-q03) 可尝试真实路径约束、预期哈希和可恢复替换，使用链接越界及同时编辑对照。若冲突与越界不降，或合法路径大量被拒绝，就放弃；尚未实现。

[查看完整分析](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381726438-root"></a>

## [dsh-wsl-vecmem](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-vecmem)

> **用途**：项目成员已经保留笔记原件，需要从 DSH 会话用自然语言找回小段项目事实。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q01) 将项目短记的写入和相似度查询接进 DSH 工具调用。[Q03](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q03) 把向量从 JSON 索引移到 Float32 文件，避免把向量解析成 JSON 数字。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q03) 文件长度异常只进入状态提示，查询仍可能返回列表。[Q02](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q02) 常规文本投影缺少检索阶段和信心字段，非空命中不足以判断是否找对事实。

> **建议**：[Q05](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q05) 向调用者显示检索阶段，已知索引不一致时拒绝返回命中。用相同有答案和无答案查询比较错引率及有效召回，观察是否值得引入。

[查看完整分析](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334739972-root"></a>

## [dsh-zotero](../../plugins/vncntvx--dsh-zotero/INSIGHT.md)

[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Vncntvx/dsh-zotero) [![npm 30d 7,835](https://img.shields.io/static/v1?label=npm+30d&message=7%2C835&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-zotero) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-zotero)

> **用途**：已有Zotero库的研究者可在对话中检索并回到条目和片段核对引用，最终论证仍由人负责。[Q01](../../plugins/vncntvx--dsh-zotero/INSIGHT.md#research-q01)

> **亮点**：把检索、来源片段和稳定条目ref贯穿到DSH研究流程，有限预算与实例身份使结果范围可说明；不是新的文献数据库或模型推理能力。[Q01](../../plugins/vncntvx--dsh-zotero/INSIGHT.md#research-q01)

> **思考**：BM25与预算可能漏掉关键无词面重合段落，空结果不等于文献无证据；单项批准和版本保护也不意味着批量写全库可回滚。[Q02](../../plugins/vncntvx--dsh-zotero/INSIGHT.md#research-q02) [Q03](../../plugins/vncntvx--dsh-zotero/INSIGHT.md#research-q03)

> **建议**：让无匹配结果引导经用户确认的同义词扩展可能改善召回而不伪造证据；须比较漏检、错误引用与成本，尚未实现。[Q05](../../plugins/vncntvx--dsh-zotero/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/vncntvx--dsh-zotero/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333082908-root"></a>

## [dshfind](../../plugins/hikariming--dshfind/INSIGHT.md)

[![GitHub ★ 359](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=359&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hikariming/dshfind)

> **用途**：DSH 用户搜索插件并学习相关概念，维护者聚合与发布目录。

> **亮点**：[Q01](../../plugins/hikariming--dshfind/INSIGHT.md#research-q01) 和 [Q02](../../plugins/hikariming--dshfind/INSIGHT.md#research-q02) 将候选、课程和发现入口集中；不证明插件已验证可用。

> **思考**：[Q03](../../plugins/hikariming--dshfind/INSIGHT.md#research-q03) 截断或手工来源失败仍可能继续执行缺席标记。

> **建议**：[Q05](../../plugins/hikariming--dshfind/INSIGHT.md#research-q05) 提出按来源完成状态控制缺席判断，需权衡漏隐藏和过期留存。

[查看完整分析](../../plugins/hikariming--dshfind/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1369398336-packages-dsh-literature"></a>

## [EduWork Literature](../../plugins/ecnu--eduwork--packages-dsh-literature/INSIGHT.md)

[![GitHub ★ 264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ECNU/EduWork) [![npm 30d 2,338](https://img.shields.io/static/v1?label=npm+30d&message=2%2C338&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-literature) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-literature)

> **用途**：需要在 DSH 查找和引用论文的研究者；基线是分别查询文献来源并手工整理。[Q01](../../plugins/ecnu--eduwork--packages-dsh-literature/INSIGHT.md#research-q01)

> **亮点**：在宿主内统一多来源检索、引用和公开全文处理。[Q01](../../plugins/ecnu--eduwork--packages-dsh-literature/INSIGHT.md#research-q01)

> **思考**：部分来源失败仍可能成功返回且未列失败来源；全文写入按文件进行，不保证取消回滚。[Q02](../../plugins/ecnu--eduwork--packages-dsh-literature/INSIGHT.md#research-q02) [Q03](../../plugins/ecnu--eduwork--packages-dsh-literature/INSIGHT.md#research-q03)

> **建议**：未验证假设：在已有部分成功结果中增加来源状态可减少覆盖误判，需测失败和限流场景。[Q05](../../plugins/ecnu--eduwork--packages-dsh-literature/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/ecnu--eduwork--packages-dsh-literature/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1262941478-integrations-dsh-envoy-dsh"></a>

## [Envoy](../../plugins/regrevia--envoy--integrations-dsh-envoy-dsh/INSIGHT.md)

[![GitHub ★ 96](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=96&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/regrevia/Envoy) [![npm 30d 2,394](https://img.shields.io/static/v1?label=npm+30d&message=2%2C394&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/envoy-dsh) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/envoy-dsh)

> **用途**：用户把文章、PDF、音视频链接交给 DSH 整理。

> **亮点**：[Q01](../../plugins/regrevia--envoy--integrations-dsh-envoy-dsh/INSIGHT.md#research-q01) 给公开链接加读取路由和可引用材料路径。

> **思考**：[Q02](../../plugins/regrevia--envoy--integrations-dsh-envoy-dsh/INSIGHT.md#research-q02) 需外部 runtime，探索基准不足以证明事实正确。

> **建议**：[Q03](../../plugins/regrevia--envoy--integrations-dsh-envoy-dsh/INSIGHT.md#research-q03) 相同时限比较材料覆盖和事实错误。

[查看完整分析](../../plugins/regrevia--envoy--integrations-dsh-envoy-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-959005755-plugins-deepseek-harness"></a>

## [GeoChat 画布](../../plugins/tiwe0--geochat--plugins-deepseek-harness/INSIGHT.md)

[![GitHub ★ 125](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=125&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tiwe0/GeoChat)

> **用途**：用户希望在 DSH 内构建可操作数学图。

> **亮点**：[Q01](../../plugins/tiwe0--geochat--plugins-deepseek-harness/INSIGHT.md#research-q01) 在同一会话内执行并检查对象。

> **思考**：[Q03](../../plugins/tiwe0--geochat--plugins-deepseek-harness/INSIGHT.md#research-q03) 回执失败后需检查真实 Applet 状态。

> **建议**：[Q05](../../plugins/tiwe0--geochat--plugins-deepseek-harness/INSIGHT.md#research-q05) 常见构图可以减少窗口切换而维持数学准确。

[查看完整分析](../../plugins/tiwe0--geochat--plugins-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335867536-root"></a>

## [GLM-5.3-Flash J-Space能力报告](../../plugins/tiger3807861189--glm-5.3-flash-j-space-capability-realization-report/INSIGHT.md)

[![GitHub ★ 1,017](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C017&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report)

> **用途**：供长任务Agent研究者阅读状态外化、选择性加载和恢复设计，提取可复核问题。

> **亮点**：将长任务状态漂移、重试和完成判断组织成一份可读机制说明，贡献是研究材料与设计框架；不把未包含的原始套件算成本组件实现。[Q01](../../plugins/tiger3807861189--glm-5.3-flash-j-space-capability-realization-report/INSIGHT.md#research-q01) [Q02](../../plugins/tiger3807861189--glm-5.3-flash-j-space-capability-realization-report/INSIGHT.md#research-q02)

> **思考**：增强成绩明确为有限实验估算，缺逐任务配置与轨迹；当前提交还缺所描述Skill入口和控制器，因此不能由报告推出可复现的提升。[Q02](../../plugins/tiger3807861189--glm-5.3-flash-j-space-capability-realization-report/INSIGHT.md#research-q02) [Q03](../../plugins/tiger3807861189--glm-5.3-flash-j-space-capability-realization-report/INSIGHT.md#research-q03)

> **建议**：用原生指令、简单账本和完整协议三组消融判断收益是否主要来自状态外化；若简单组等效且更便宜就停止增加模块，尚未验证。[Q04](../../plugins/tiger3807861189--glm-5.3-flash-j-space-capability-realization-report/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/tiger3807861189--glm-5.3-flash-j-space-capability-realization-report/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1178312395-root"></a>

## [Graph Memory](../../plugins/adoresever--graph-memory/INSIGHT.md)

[![GitHub ★ 663](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=663&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/adoresever/graph-memory) [![npm 30d 346](https://img.shields.io/static/v1?label=npm+30d&message=346&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/graph-memory) [![最新发布 2026-04-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-04-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/graph-memory)

> **用途**：长会话用户需要在有限模型上下文内继续使用旧任务知识，合格结果包含正确任务与可追回来源。

> **亮点**：[Q01](../../plugins/adoresever--graph-memory/INSIGHT.md#research-q01) 与 [Q02](../../plugins/adoresever--graph-memory/INSIGHT.md#research-q02) 将模型可见历史约束、后台抽取与源问答召回结合，保留原事件日志；这改变上下文组织，不等于原答案正确。

> **思考**：[Q03](../../plugins/adoresever--graph-memory/INSIGHT.md#research-q03) 原问答可能缺少关键工具回执，跨项目回忆亦需独立隔离判断；首请求减少不能代替全部模型与抽取消耗的总账。

> **建议**：[Q04](../../plugins/adoresever--graph-memory/INSIGHT.md#research-q04) 提出按可复核任务保留关键工具回执，未验证；若无法提升纠错质量或抵消新增上下文则否定。

[查看完整分析](../../plugins/adoresever--graph-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334675451-root"></a>

## [Hanai Worth 值见](../../plugins/hancao97--hanai-investment-dsh/INSIGHT.md)

[![GitHub ★ 120](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=120&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hancao97/hanai-investment-dsh)

> **用途**：研究者希望在同一工作台保留可复核的行情观察和报告。

> **亮点**：[Q01](../../plugins/hancao97--hanai-investment-dsh/INSIGHT.md#research-q01) 将来源状态和报告归档串到同一研究流程。

> **思考**：[Q03](../../plugins/hancao97--hanai-investment-dsh/INSIGHT.md#research-q03) 可校验文件与事实准确是独立指标。

> **建议**：[Q05](../../plugins/hancao97--hanai-investment-dsh/INSIGHT.md#research-q05) 对照任务可减少查找来源和整理报告的时间。

[查看完整分析](../../plugins/hancao97--hanai-investment-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333303761-root"></a>

## [hello-dsh](../../plugins/pingfanfan--hello-dsh/INSIGHT.md)

[![GitHub ★ 106](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=106&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pingfanfan/hello-dsh)

> **用途**：首次学习 DSH 扩展机制的中文用户。

> **亮点**：[Q01](../../plugins/pingfanfan--hello-dsh/INSIGHT.md#research-q01) 把技能发现和工具注册变为可观察的练习。

> **思考**：[Q02](../../plugins/pingfanfan--hello-dsh/INSIGHT.md#research-q02) 验证环境是早期 DSH，批量复制存在版本和同名冲突。

> **建议**：[Q03](../../plugins/pingfanfan--hello-dsh/INSIGHT.md#research-q03) 对照官方文档比较首个扩展的完成时间。

[查看完整分析](../../plugins/pingfanfan--hello-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1211255316-root"></a>

## [hn](../../plugins/heartleo--hn-cli/INSIGHT.md)

[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/heartleo/hn-cli)

> **用途**：希望在终端阅读 Hacker News 并可选翻译内容的用户。

> **亮点**：[Q01](../../plugins/heartleo--hn-cli/INSIGHT.md#research-q01) 与 [Q02](../../plugins/heartleo--hn-cli/INSIGHT.md#research-q02) 把阅读、多源回退和可选翻译放在终端。

> **思考**：[Q02](../../plugins/heartleo--hn-cli/INSIGHT.md#research-q02) 页面未处理分页、回退源有索引延迟，成功不证明评论完整。

> **建议**：[Q04](../../plugins/heartleo--hn-cli/INSIGHT.md#research-q04) 假设显示来源和完整性提示帮助读者判断，尚未验证。

[查看完整分析](../../plugins/heartleo--hn-cli/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1309745037-root"></a>

## [Jacobian](../../plugins/morluto--jacobian/INSIGHT.md)

[![GitHub ★ 353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/jacobian)

> **用途**：让 Agent 在数学任务中查找并调用受约束操作的开发者。

> **亮点**：[Q01](../../plugins/morluto--jacobian/INSIGHT.md#research-q01) 与 [Q02](../../plugins/morluto--jacobian/INSIGHT.md#research-q02) 把后端操作组织为可检索且声明类型的接口，不将后端算法归为项目原创。

> **思考**：[Q02](../../plugins/morluto--jacobian/INSIGHT.md#research-q02) 类型与错误分类不能证明操作选择或数学结果正确。

> **建议**：[Q04](../../plugins/morluto--jacobian/INSIGHT.md#research-q04) 假设执行前显式记录前提并独立核结果可降低误用，尚未对照。

[查看完整分析](../../plugins/morluto--jacobian/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1341648244-root"></a>

## [KRouter](../../plugins/398894496-arch--krouter/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/398894496-arch/KRouter)

> **用途**：面向跨Claude Code/Codex/Cursor/DSH工作的个人开发者，希望同一份Markdown记住决定与更改，不用每次重复说明。DSH包只提供七个查询工具接头，完整产品还含可选导入、夜间整理和备份，不会因dsh plugin add自动启动计时器。Obsidian是可选编辑/查看器，不是运行必须的服务。

> **亮点**：将canonical有效状态、ranked分层权重、弱近邻拒绝与来源hash设为默认，跨Agent共用可编辑Markdown；相同两规则BM25基线并未被证明显著超越。详见[Q02](../../plugins/398894496-arch--krouter/INSIGHT.md#research-q02)、[Q03](../../plugins/398894496-arch--krouter/INSIGHT.md#research-q03)。

> **思考**：canonical过滤无效页，但ranked对旧页仅乘0.25仍可召回；metadata缓存与followlinks不构成新鲜度/物理沙箱。DSH同步执行和可选writer lane权限需分开，未做越界复现。详见[Q03](../../plugins/398894496-arch--krouter/INSIGHT.md#research-q03)、[Q04](../../plugins/398894496-arch--krouter/INSIGHT.md#research-q04)。

> **建议**：可探索来源版本/适用域/证据级别与冲突收据，区分词面lock和人工确认，比较跨项目错引、覆盖与维护开销；未实现。详见[Q07](../../plugins/398894496-arch--krouter/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/398894496-arch--krouter/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1196982492-root"></a>

## [last30days-cn](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md)

[![GitHub ★ 2,044](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C044&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jesseovo/last30days-skill-cn)

> **用途**：需要查找中文平台近期讨论并复核原始出处的研究者。

> **亮点**：[Q01](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md#research-q01) 和 [Q02](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md#research-q02) 将中文来源及整理流程接入 DSH；真实覆盖和效率未知。

> **思考**：[Q03](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md#research-q03) 外层默认超时可能早于 deep 流程预算；来源缺失不能当作无讨论。

> **建议**：[Q05](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md#research-q05) 提议将来源状态与结论影响关联，需检验是否改变读者判断。

[查看完整分析](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1195243030-root"></a>

## [Learn Harness Engineering](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md)

[![GitHub ★ 21,413](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21%2C413&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/walkinglabs/learn-harness-engineering)

> **用途**：面向学习如何让编码 Agent 跨会话保持状态、范围和验证约束的开发者，提供项目式课程、示例及 harness-creator Skill。交付应是能在真实任务中遵守验证和恢复规则的项目环境；课程仓库本身不是 DSH 功能插件。

> **亮点**：相对散落工程文章和手写约定，课程以 instructions、state、verification、scope、lifecycle 五部分组织问题，并把它落实为可生成、可结构检查的最小文件组。贡献在教学与工程启动流程；框架原理有明确外部来源，结构评分也不等于 Agent 效果评测。[Q02](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md#research-q02)

> **思考**：结构评估主要检查文件、JSON字段及关键词是否出现，能发现缺少入口，却无法证明验证命令足以覆盖目标任务或 Agent 会执行它。Skill 本身承认 benchmark 是结构性的。README 中引述的外部成本案例还有预算和时间变化，本轮未独立复核，不能用它证明同预算可靠性提升。[Q03](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md#research-q03)

> **建议**：未验证假设是在五部分结构检查外，为每条“完成”规则绑定一个代表性任务及失败注入，从静态约定转为可观察遵循度。固定同模型、仓库和预算，对比未改造、仅模板与任务证据三种环境，测漏跑验证、错误完成、跨会话恢复和人工介入。若结构分提高而任务指标不变，或维护验证任务的成本超过节省，则不继续加机制。[Q05](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1303848201-root"></a>

## [Market Research Cockpit](../../plugins/thebiggavin--marketingdashboard/INSIGHT.md)

[![GitHub ★ 450](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=450&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/theBigGavin/marketingdashboard)

> **用途**：需要同时查阅多市场行情与新闻的研究人员。

> **亮点**：[Q01](../../plugins/thebiggavin--marketingdashboard/INSIGHT.md#research-q01) 和 [Q02](../../plugins/thebiggavin--marketingdashboard/INSIGHT.md#research-q02) 汇集多个市场入口并提供 MCP；时效和实际收益未知。

> **思考**：[Q03](../../plugins/thebiggavin--marketingdashboard/INSIGHT.md#research-q03) 资金流 fallback 调用涨跌排行，且通用 cached 丢弃新鲜度包装，不能一概当作实时同义数据。

> **建议**：[Q05](../../plugins/thebiggavin--marketingdashboard/INSIGHT.md#research-q05) 统一指标来源、新鲜度和降级语义，需检验消费方及用户误判。

[查看完整分析](../../plugins/thebiggavin--marketingdashboard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-956330003-root"></a>

## [MCP-for-Stata](../../plugins/sepinetam--mcp-for-stata/INSIGHT.md)

[![GitHub ★ 271](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=271&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SepineTam/mcp-for-stata)

> **用途**：已有合法本地Stata和定量能力者，在匿名副本中让宿主Agent运行/核查do任务；需求频率/收益待独立对照，见[Q01](../../plugins/sepinetam--mcp-for-stata/INSIGHT.md#research-q01)。

> **亮点**：标准接口、路径/命令检查、真执行快照与审计链接便于结果追查；独立操作见主能力表，现有审计不等研究正确，见[Q02](../../plugins/sepinetam--mcp-for-stata/INSIGHT.md#research-q02)。

> **思考**：MCP安装ctx审批停用/API自动confirm与Skill逐次询问不一致；数据边界/URLguard及RAM监视并非默认全开，进程成功/日志/全hash不等研究成立，见[Q02](../../plugins/sepinetam--mcp-for-stata/INSIGHT.md#research-q02)至[Q04](../../plugins/sepinetam--mcp-for-stata/INSIGHT.md#research-q04)。

> **建议**：超出现有do快照/审计，检验单次实证任务的数据/环境/规格和预设结果断言绑定；基线/指标/停止条件见[Q05](../../plugins/sepinetam--mcp-for-stata/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/sepinetam--mcp-for-stata/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1302496224-root"></a>

## [Memmy Agent](../../plugins/memtensor--memmy-agent/INSIGHT.md)

[![GitHub ★ 2,167](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C167&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MemTensor/memmy-agent)

> **用途**：面向需要在多个 Agent 或会话接续项目工作并能复核记忆的用户。

> **亮点**：[Q02](../../plugins/memtensor--memmy-agent/INSIGHT.md#research-q02) 将宿主事件和根记忆服务连接，提供可回退召回与异步记录；模型提炼和底层能力不因桥接成为原创。

> **思考**：[Q04](../../plugins/memtensor--memmy-agent/INSIGHT.md#research-q04) 历史不可信是提示而非事实验证，过滤可失败回退；[Q03](../../plugins/memtensor--memmy-agent/INSIGHT.md#research-q03) loopback 服务不代表模型调用离线。

> **建议**：[Q06](../../plugins/memtensor--memmy-agent/INSIGHT.md#research-q06) 对高影响记忆展示来源及确认时间并请求核对，须对照现有提示和过滤测漏用、误拦与成本。

[查看完整分析](../../plugins/memtensor--memmy-agent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351908966-root"></a>

## [Memory Eternal](../../plugins/eternalnight996--memory-eternal/INSIGHT.md)

[![GitHub ★ 139](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=139&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EternalNight996/memory-eternal) [![npm 30d 13,160](https://img.shields.io/static/v1?label=npm+30d&message=13%2C160&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/memory-eternal) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/memory-eternal)

> **用途**：开发者在 DSH 与其他 MCP 客户端之间反复交代项目知识。

> **亮点**：[Q01](../../plugins/eternalnight996--memory-eternal/INSIGHT.md#research-q01) 本地知识库配合人工审核与用量观测。

> **思考**：[Q03](../../plugins/eternalnight996--memory-eternal/INSIGHT.md#research-q03) 审核和本机存储均无法决定模型路由是否会接收对话与核心卡。

> **建议**：[Q05](../../plugins/eternalnight996--memory-eternal/INSIGHT.md#research-q05) 审核后复用稳定项目约束可能减少重复输入，需计入审核及蒸馏开销。

[查看完整分析](../../plugins/eternalnight996--memory-eternal/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1153190876-root"></a>

## [memsearch](../../plugins/zilliztech--memsearch/INSIGHT.md)

[![GitHub ★ 2,856](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C856&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch)

> **用途**：维护 Markdown 项目笔记的开发者，可用改写查询找回候选段落，再对原文核实。

> **亮点**：[Q01](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q01) 和 [Q02](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q02) 把可编辑 Markdown 与可重建的混合索引分开，提供可回查的语义候选。

> **思考**：[Q03](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q03) 旧块在新增嵌入完成前删除，批次或文件失败会使当前索引不完整，调用者必须读取报告并重试。

> **建议**：[Q05](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q05) 可试验新代际完整写入后切换可见索引，以减少失败后的缺块窗口。

[查看完整分析](../../plugins/zilliztech--memsearch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1153190876-plugins-dsh"></a>

## [MemSearch for DeepSeek Harness](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md)

[![GitHub ★ 2,856](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C856&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch) [![npm 30d 11,903](https://img.shields.io/static/v1?label=npm+30d&message=11%2C903&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh)

> **用途**：反复从新 DSH 会话接手同一项目的开发者，可以搜索上次决策并从摘要回查原话。

> **亮点**：[Q01](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q01) 用宿主事件维护项目日记，并把召回线索连接到原会话，减少每次从头翻找历史所需的入口切换。

> **思考**：[Q02](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q02) 摘要失败占位仍带有去重锚点，普通事件重放无法补摘要。[Q03](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q03) 候选安装返回 started 后仍需读回。

> **建议**：[Q04](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q04) 允许失败占位在锚点和版本匹配时定向补摘要并回读索引，可能修复可追溯但查不到有效内容的记录。

[查看完整分析](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333986968-root"></a>

## [Meow Memory](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md)

[![GitHub ★ 388](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=388&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Phant0Meow/dsh-meow-memory) [![npm 30d 36,121](https://img.shields.io/static/v1?label=npm+30d&message=36%2C121&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-memory) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-memory)

> **用途**：反复在多个会话续接项目的用户，需要自动找回已核实的上下文。

> **亮点**：[Q01](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q01) 将工作区记忆和压缩重注入接回宿主；[Q02](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q02) 通过能力探测适配两代整理模型路由。

> **思考**：[Q02](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q02) 整理后恢复依赖进程内状态和宿主选择事件，[Q03](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q03) 封存计数不能证明内容正确。

> **建议**：[Q03](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q03) 试验并列显示整理模型与恢复后的实际模型是否减少错认，尚未验证。

[查看完整分析](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340749561-root"></a>

## [Mimir](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md)

[![GitHub ★ 550](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=550&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1692775560/dsh-Mimir-Academic-research)

> **用途**：已有DSH且反复改稿、查实验日志的研究者，用统一项目入口组织编译与结果线索；交付仍需核原件、引用和数据。

> **亮点**：[Q01](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q01)、[Q02](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q02) 集中研究工具、编译诊断和源快照；[Q03](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q03) 精细job状态披露观察丢失。便利成立于DSH与原件可核，外部引擎/模型贡献分开。

> **思考**：[Q02](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q02) success、PDF时间与后置源快照不是同次输入/产物摘要绑定；[Q03](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q03) 实验failed可含unknown，取消不保证远端停，需查真实结果而非盲重提。

> **建议**：[Q05](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q05) 未验证假设是补交付时跨源、PDF/图表、精确job和人工验收绑定；先检查已有snapshot/ledger，只有减少误验收且负担可接受才扩展。

[查看完整分析](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1278033467-root"></a>

## [MindMemOS](../../plugins/mindscale-noah--mindmemos/INSIGHT.md)

[![GitHub ★ 922](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=922&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mindscale-noah/MindMemOS)

> **用途**：供需要跨会话和Agent复用偏好、项目事实与工具经验的团队使用。

> **亮点**：以共同记忆服务连接不同Agent，并把实体与属性检索结果结构化融合；相对手动项目笔记增加按需召回和自动写入，真实收益需同任务核验。[Q01](../../plugins/mindscale-noah--mindmemos/INSIGHT.md#research-q01) [Q02](../../plugins/mindscale-noah--mindmemos/INSIGHT.md#research-q02)

> **思考**：项目密钥不自动认证请求中的个人user_id；完成回合异步写回只告警，不证明最终落库，CLI包装未见有界超时，不能将插件loaded当记忆可靠。[Q02](../../plugins/mindscale-noah--mindmemos/INSIGHT.md#research-q02) [Q04](../../plugins/mindscale-noah--mindmemos/INSIGHT.md#research-q04)

> **建议**：按project/session/turn保存写回待办与最终状态，恢复先对账请求ID再重试，比较丢失与重复记忆；先核对服务已有能力，尚未验证。[Q04](../../plugins/mindscale-noah--mindmemos/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/mindscale-noah--mindmemos/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1328601495-root"></a>

## [MinerU文档解析桥](../../plugins/huanlinoto--dsh-plugin-mineru/INSIGHT.md)

[![GitHub ★ 52](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=52&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HuanLinOTO/dsh-plugin-mineru) [![npm 30d 1,575](https://img.shields.io/static/v1?label=npm+30d&message=1%2C575&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huanlin/dsh-plugin-mineru) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huanlin/dsh-plugin-mineru)

> **用途**：这是原生DSH双端插件@huanlin/dsh-plugin-mineru 0.4.2，不是OCR引擎或通用Skill。它面向已有MinerU服务、要让模型读取本地PDF/办公文档的人，提供健康、异步提交、状态、结果及一键解析五工具；成功是目标页内容和表格公式可用、可追溯且未漏页，不是completed状态。

> **亮点**：[Q01](../../plugins/huanlinoto--dsh-plugin-mineru/INSIGHT.md#research-q01)、[Q02](../../plugins/huanlinoto--dsh-plugin-mineru/INSIGHT.md#research-q02)五模型工具、配置凭据与异步轮询/文本截断/JSON路径适配，非新OCR。

> **思考**：[Q03](../../plugins/huanlinoto--dsh-plugin-mineru/INSIGHT.md#research-q03)上传范围与数据服务身份、取消不撤远端、整读和临时留存无预算；[Q02](../../plugins/huanlinoto--dsh-plugin-mineru/INSIGHT.md#research-q02)completed和首stem不证明完整可用。

> **建议**：[Q04](../../plugins/huanlinoto--dsh-plugin-mineru/INSIGHT.md#research-q04)当前可借鉴的是异步任务和输出截断的薄适配，但completed只表示引擎状态，首stem Markdown也不等完整交付。独立假设：增加任务/源文件摘要、请求页范围、全部stem、解析覆盖及输出资产位置的回执，由人确认漏页/表格公式，再交模型引用，可能减少错误引用和中断后重复上传。这是本研究提出的未验证方向，不计当前创新分。

[查看完整分析](../../plugins/huanlinoto--dsh-plugin-mineru/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1162230313-root"></a>

## [Mnemon](../../plugins/mnemon-dev--mnemon/INSIGHT.md)

[![GitHub ★ 680](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=680&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mnemon-dev/mnemon)

> **用途**：Agent 使用者可跨会话保存项目事实、偏好与决策，并用图关系和意图召回找回相关上下文。

> **亮点**：[Q01](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q01) 和 [Q02](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q02) 将模型的关系判断与本地确定性存储分开，相似候选只作提示，字节相同才跳过写入。图检索有明确既有方法参照，贡献是 CLI、监督流程与事务边界的组合，不宣称算法首创。

> **思考**：[Q03](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q03) 持久保存不保证事实正确，关系仍需模型复核；容量策略虽有保护期、关闭选项和裁剪回执，完整关系恢复尚未核实。根 DSH bundle 另依赖外部 latest 包，不能把本提交当完整 DSH 验证。

> **建议**：[Q05](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q05) 提出固定副本的只读回放评估假设，区分检索质量与访问计数对保留策略的反馈。现有只读和裁剪回执已存在，增量是组合为评估协议，尚未验证能否减少采用误判。

[查看完整分析](../../plugins/mnemon-dev--mnemon/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1163808211-root"></a>

## [ModLens](../../plugins/liustack--modlens/INSIGHT.md)

[![GitHub ★ 4,846](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C846&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liustack/modlens) [![npm 30d 257,562](https://img.shields.io/static/v1?label=npm+30d&message=257%2C562&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modlens) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modlens)

> **用途**：用文本模型处理截图、图表和图片中字段的 DSH 用户，可保留现有会话，以外部视觉工具取结构化转录。验收时需要回对原图并确认实际接收端。[Q01](../../plugins/liustack--modlens/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/liustack--modlens/INSIGHT.md#research-q01) [Q02](../../plugins/liustack--modlens/INSIGHT.md#research-q02) 把截图的视觉解析与文本对话模型分开，增加可供人工核对的转录和不确定项。统一宿主插件、CLI 与多个提供商通路。

> **思考**：[Q03](../../plugins/liustack--modlens/INSIGHT.md#research-q03) 默认 DSH 工具未传固定提供商参数。图片可能经过配置回退，远程 URL 的检查依抓取方。插件内附件引用索引未用调用会话键，实际会话隔离需实测。

> **建议**：[Q05](../../plugins/liustack--modlens/INSIGHT.md#research-q05) 在发送前列出数据形态和允许端点，结束时回传实际成功路由和尝试记录，可能减少目的地误判及额度争议。

[查看完整分析](../../plugins/liustack--modlens/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1163808542-root"></a>

## [ModSearch](../../plugins/liustack--modsearch/INSIGHT.md)

[![GitHub ★ 962](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=962&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liustack/modsearch) [![npm 30d 63,136](https://img.shields.io/static/v1?label=npm+30d&message=63%2C136&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch)

> **用途**：需要在 DSH 中检索公开资料的用户，可把网页或 X 结果纳入回答，并对照原始链接验证。

> **亮点**：为宿主既有网页搜索增加多引擎与超时回退，并在 X 降级时标出实际语料。HTTP 引擎复用同一代理选择规则，便于受限网络配置。见 [Q01](../../plugins/liustack--modsearch/INSIGHT.md#research-q01) 至 [Q03](../../plugins/liustack--modsearch/INSIGHT.md#research-q03)。

> **思考**：网页输出无法回溯每次回退。代理 DNS 与云取页另有边界，设置端点是否受鉴权保护也依赖部署。见 [Q03](../../plugins/liustack--modsearch/INSIGHT.md#research-q03) 与 [Q04](../../plugins/liustack--modsearch/INSIGHT.md#research-q04)。

> **建议**：把实际语料、引擎和回退标志加入同一份脱敏摘要，可能减少对搜索来源的误判。以固定回退场景和合格检索数比较识别效果。见 [Q05](../../plugins/liustack--modsearch/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/liustack--modsearch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1259108597-packages-dsh-plugin-molio"></a>

## [Molio DSH 知识库插件](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md)

[![GitHub ★ 442](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=442&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhuzhaoyun/Molio) [![npm 30d 522](https://img.shields.io/static/v1?label=npm+30d&message=522&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-molio) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-molio)

> **用途**：已有Molio资料用户在DSH做研究/写作/问答。

> **亮点**：[Q01](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md#research-q01)把已有daemon只读能力以五个原生DSH工具接入，减少资料切换。

> **思考**：[Q02](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md#research-q02)、[Q03](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md#research-q03)active库可漂移，只读不等内容不外发；远程需独立访问控制，force不是token预算。

> **建议**：[Q04](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md#research-q04)会话固定vault/来源版本收据可探索，须先与现有显式id比较，无差异则否定。

[查看完整分析](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1327922805-integrations-deepseek-harness"></a>

## [Multisim MCP for DSH](../../plugins/yxy050208--multisim-mcp--integrations-deepseek-harness/INSIGHT.md)

[![GitHub ★ 38](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=38&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yxy050208/multisim-mcp) [![npm 30d 2,023](https://img.shields.io/static/v1?label=npm+30d&message=2%2C023&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/multisim-mcp-dsh-plugin) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/multisim-mcp-dsh-plugin)

> **用途**：适合已有 Multisim 环境、在 DSH 里追踪简单电路实验的人，见 [Q01](../../plugins/yxy050208--multisim-mcp--integrations-deepseek-harness/INSIGHT.md#research-q01)。

> **亮点**：将解释器、运行环境和工具范围组成可装载 profile，复用既有服务，见 [Q01](../../plugins/yxy050208--multisim-mcp--integrations-deepseek-harness/INSIGHT.md#research-q01) 与 [Q02](../../plugins/yxy050208--multisim-mcp--integrations-deepseek-harness/INSIGHT.md#research-q02)。

> **思考**：实验验证与人类审批来源有独立路径，宿主超时也不能确定后台结果，见 [Q02](../../plugins/yxy050208--multisim-mcp--integrations-deepseek-harness/INSIGHT.md#research-q02) 与 [Q03](../../plugins/yxy050208--multisim-mcp--integrations-deepseek-harness/INSIGHT.md#research-q03)。

> **建议**：把运行的凭据核验状态在输出中直接标出，比较能否减少审阅误判，见 [Q05](../../plugins/yxy050208--multisim-mcp--integrations-deepseek-harness/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/yxy050208--multisim-mcp--integrations-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1190633989-root"></a>

## [Oh My Knowledge](../../plugins/lizhiyao--oh-my-knowledge/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lizhiyao/oh-my-knowledge) [![npm 30d 416](https://img.shields.io/static/v1?label=npm+30d&message=416&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/oh-my-knowledge) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/oh-my-knowledge)

> **用途**：个人和开发者从工作记录整理知识，维护知识载体并对比版本。

> **亮点**：[Q01](../../plugins/lizhiyao--oh-my-knowledge/INSIGHT.md#research-q01) 描述记录、知识维护和评测的集成；[Q02](../../plugins/lizhiyao--oh-my-knowledge/INSIGHT.md#research-q02) 给出来源覆盖决策和版本检查的源码依据。

> **思考**：[Q03](../../plugins/lizhiyao--oh-my-knowledge/INSIGHT.md#research-q03) 指出模型材料、本地代码执行和无认证服务边界；[Q04](../../plugins/lizhiyao--oh-my-knowledge/INSIGHT.md#research-q04) 说明试用及维护成本未知。

> **建议**：[Q05](../../plugins/lizhiyao--oh-my-knowledge/INSIGHT.md#research-q05) 建议关联载体实际使用与独立结果，以对照验证价值。

[查看完整分析](../../plugins/lizhiyao--oh-my-knowledge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333671427-root"></a>

## [Oh-My-DSH](../../plugins/like-study1--oh-my-dsh/INSIGHT.md)

[![GitHub ★ 100](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=100&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/like-study1/Oh-My-DSH)

> **用途**：需要查找与初筛扩展的用户。

> **亮点**：[Q01](../../plugins/like-study1--oh-my-dsh/INSIGHT.md#research-q01) 想寻找 DSH 扩展的用户可浏览分类目录和检索站点。Python 同步流程从 GitHub 查询获取元数据，结合 curated 覆盖项并排序，生成 Markdown、索引和站点。固定树表现为目录与生成器，其价值是聚合发现入口。

> **思考**：[Q02](../../plugins/like-study1--oh-my-dsh/INSIGHT.md#research-q02) 同步按 stars 排序取搜索页，类型和维护信号来自元数据与覆盖配置，不能证明安装或安全。README 声明监测 2000 仓库和收录 2133 条，仅当作固定快照作者描述。生成器有手工和覆盖路径，完整性还依赖搜索上限、去重和来源。

> **建议**：[Q04](../../plugins/like-study1--oh-my-dsh/INSIGHT.md#research-q04) 在星数和主题信号后增加固定 manifest 与实际入口的分类核验，对照客户端、目录、插件和子组件保留集。比较误分类及审核时间，若没有改善则调整。

[查看完整分析](../../plugins/like-study1--oh-my-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1329484633-root"></a>

## [OpenContext](../../plugins/melandlabs--opencontext/INSIGHT.md)

[![GitHub ★ 76](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=76&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/melandlabs/opencontext)

> **用途**：需要把多源持久证据接入自建Agent应用并能承担宿主治理的开发者。

> **亮点**：[Q01](../../plugins/melandlabs--opencontext/INSIGHT.md#research-q01) 统一可嵌入面；[Q02](../../plugins/melandlabs--opencontext/INSIGHT.md#research-q02) 多源可解释检索；[Q03](../../plugins/melandlabs--opencontext/INSIGHT.md#research-q03) 图版本和重放守卫。

> **思考**：[Q03](../../plugins/melandlabs--opencontext/INSIGHT.md#research-q03) 图和raw退役非原子且applied不等于实际写成功；[Q04](../../plugins/melandlabs--opencontext/INSIGHT.md#research-q04) HTTP身份绑定要host补足。

> **建议**：[Q05](../../plugins/melandlabs--opencontext/INSIGHT.md#research-q05) 逐路径写状态是否减少误重试需故障对照。

[查看完整分析](../../plugins/melandlabs--opencontext/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335086034-root"></a>

## [OpenQuantum](../../plugins/xi-zhao--openquantum/INSIGHT.md)

[![GitHub ★ 71](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=71&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xi-zhao/OpenQuantum)

> **用途**：量子研究者在Agent中做受限模型计算并交给同事重验，需要保存输入、数值与校验规则。

> **亮点**：[Q01](../../plugins/xi-zhao--openquantum/INSIGHT.md#research-q01) 统一按需准备与具摘要的事实/校验交付，ground-state有独立科学Validator而非仅模型解释。

> **思考**：[Q03](../../plugins/xi-zhao--openquantum/INSIGHT.md#research-q03) 模型域很窄，通用SDK结果非科学验收；Host有180秒/2MiB边界，但底层worker省略预算可不限，纯JS取消不保证即时停止。

> **建议**：[Q05](../../plugins/xi-zhao--openquantum/INSIGHT.md#research-q05) 同输入比较第三方重验率、误接受、总准备/人工时间；一次虚假passed即可否定。

[查看完整分析](../../plugins/xi-zhao--openquantum/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1128123594-examples-dsh-memory-plugin"></a>

## [OpenViking Memory for DeepSeek Harness](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md)

[![GitHub ★ 41,761](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41%2C761&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking) [![npm 30d 43,810](https://img.shields.io/static/v1?label=npm+30d&message=43%2C810&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)

> **用途**：已有 OpenViking 的 DSH 开发者，可让新会话自动查阅项目背景，减少重复粘贴和主动查询。

> **亮点**：[Q01](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q01) 和 [Q02](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q02) 显示，插件把重复的记笔记、查找和搬运上下文部分转进 DSH 生命周期，保留消息来源、会话与工作区条件。存储及提取仍由服务负责。

> **思考**：[Q03](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q03) 显示关闭采集与停止已排队数据的外发是两个动作，常驻重放仍可能运行。当前连接配置和本地队列状态也需要核实，单次提交成功无法证明后台提取完成。

> **建议**：[Q05](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q05) 提出按目标服务显示积压和提取状态，并将暂停与授权回放结合，验证能否减少误送和状态误判。

[查看完整分析](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1345235144-root"></a>

## [PaperMachine](../../plugins/superjj007--papermachine/INSIGHT.md)

[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SuperJJ007/papermachine)

> **用途**：能审阅数据与代码的研究者，用桌面会话完成Python/R分析并检查结果来源，见 [Q01](../../plugins/superjj007--papermachine/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/superjj007--papermachine/INSIGHT.md#research-q01) 与 [Q03](../../plugins/superjj007--papermachine/INSIGHT.md#research-q03) 支持将本地Python/R、执行身份、环境和版本图表组织成科研桌面工作流的集成贡献；不是新统计方法，亦不能把继承DSH代码与外部Skill算原创。

> **思考**：[Q02](../../plugins/superjj007--papermachine/INSIGHT.md#research-q02) 的持久状态和平台写隔离不保证重放或科学正确；[Q03](../../plugins/superjj007--papermachine/INSIGHT.md#research-q03) store与会话事件分离，捕获可部分成功。核心问题是可查看来源能否降低审阅负担，当前缺少同任务和恢复验收。

> **建议**：[Q06](../../plugins/superjj007--papermachine/INSIGHT.md#research-q06) 提出未验证的可重放分析交付包，以精确输入、代码次序、锁环境及未捕获原因在清洁kernel验收；隐藏状态、丢版本或错误统计均可推翻充分性，重放仍不代替领域审阅。

[查看完整分析](../../plugins/superjj007--papermachine/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1230059993-root"></a>

## [PatentRadar](../../plugins/yuc16--patentradar/INSIGHT.md)

[![GitHub ★ 68](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=68&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yuc16/PatentRadar)

> **用途**：处理公开专利资料的研究人员，可先拿到一份待逐项核查的特征与竞品表。

> **亮点**：把查找候选、逐项映射和报告拆成可回查的阶段，明确还缺什么来源。见 [Q01](../../plugins/yuc16--patentradar/INSIGHT.md#research-q01)、[Q02](../../plugins/yuc16--patentradar/INSIGHT.md#research-q02)。

> **思考**：已知竞品召回和链接含产品标识均无法证明具体特征。内部机制缺乏公开证据时，应保留缺口。见 [Q02](../../plugins/yuc16--patentradar/INSIGHT.md#research-q02)。

> **建议**：用盲审比较自动初稿与人工表格在特征支持率和复核时间上的差异。见 [Q04](../../plugins/yuc16--patentradar/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/yuc16--patentradar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1309135706-root"></a>

## [Polaris](../../plugins/zju-real--polaris/INSIGHT.md)

[![GitHub ★ 264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZJU-REAL/Polaris)

> **用途**：有模型和受控实验资源、能核方法的研究者管理长期实验；六阶段全链是作者说明，本轮不全验论文/评审，见[Q01](../../plugins/zju-real--polaris/INSIGHT.md#research-q01)。

> **亮点**：将真实计划/代码执行/指标反思组织成持久步骤、尝试/恢复与条件人介入；主能力按独立操作展开，已有终检/来源机制边界见[Q02](../../plugins/zju-real--polaris/INSIGHT.md#research-q02)、[Q03](../../plugins/zju-real--polaris/INSIGHT.md#research-q03)。

> **思考**：confirm_budget默认false且当前创建Modal不传，0小时不限时；生成脚本指标入DB不等独立测量，自检/规则/模型判定不等研究结果正确，eval_model可真实下发Key到远端，见[Q03](../../plugins/zju-real--polaris/INSIGHT.md#research-q03)、[Q04](../../plugins/zju-real--polaris/INSIGHT.md#research-q04)。

> **建议**：超出现有重挂/指标终检与文献manifest，验证Python-ML候选代码和固定独立评测器/数据划分的结果来源边界；反例/成本/停止条件见[Q05](../../plugins/zju-real--polaris/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/zju-real--polaris/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1318330553-root"></a>

## [ProMentor](../../plugins/lyn-77--promentor/INSIGHT.md)

[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Lyn-77/ProMentor)

> **用途**：[Q01](../../plugins/lyn-77--promentor/INSIGHT.md#research-q01) 开发者在项目副本逐章学习架构，合格结果是独立实现与迁移，不只是测试100分。

> **亮点**：[Q01](../../plugins/lyn-77--promentor/INSIGHT.md#research-q01)/[Q05](../../plugins/lyn-77--promentor/INSIGHT.md#research-q05) 将源码阅读与实现练习流程结构化；无可信独立判题或学习效果证据。

> **思考**：[Q02](../../plugins/lyn-77--promentor/INSIGHT.md#research-q02) 成绩/测试可同工作区改动、恢复无版本校核；[Q03](../../plugins/lyn-77--promentor/INSIGHT.md#research-q03) 面板路径与授权边界不宜敏感远程共享。

> **建议**：[Q05](../../plugins/lyn-77--promentor/INSIGHT.md#research-q05) 版本绑定与独立审核课程是假设，以迁移学习和审核成本对照证伪，当前未实现。

[查看完整分析](../../plugins/lyn-77--promentor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-849121458-integrations-dsh"></a>

## [ReMe DSH 插件](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md)

[![GitHub ★ 3,784](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C784&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentscope-ai/ReMe) [![npm 30d 4,942](https://img.shields.io/static/v1?label=npm+30d&message=4%2C942&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@agentscope-ai/reme-dsh-plugin) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@agentscope-ai/reme-dsh-plugin)

> **用途**：经常在新 DSH 会话复用旧项目事实和偏好的人，可用按需检索减少重贴历史。

> **亮点**：按需查询与后台采集分开，持久批次帮助从临时断连恢复。[Q01](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q01) [Q02](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q02)

> **思考**：自动记忆默认开启，旧批次固定原地址。空或非 JSON 2xx 在当前客户端可被当成成功并删除队列，不能将客户端出队视为服务确认。卸载也不停止独立 ReMe 服务。[Q02](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q02) [Q03](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q03)

> **建议**：可要求明确匹配批次的业务回执，并让用户确认未完成旧端点批次的去留。若空 2xx、重复和错误迁移没有减少，或合法重试大量受阻，保留现行策略。[Q04](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-849121458-root"></a>

## [ReMe 记忆工具](../../plugins/agentscope-ai--reme/INSIGHT.md)

[![GitHub ★ 3,774](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C774&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentscope-ai/ReMe)

> **用途**：使用多个 Agent 处理同一项目的开发者，可跨会话查找已有约定与原始记录。

> **亮点**：[Q02](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q02) 将可读文件、关键词、可选语义索引及链接定位组织在同一工作区。

> **思考**：[Q03](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q03) 自动记忆先写会话和记忆再记录成功回执，崩溃期间不能仅靠请求 ID 判断是否已经写入。

> **建议**：[Q04](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q04) 在使用记忆前展示近期冲突及来源，可能减少采纳过期信息。

[查看完整分析](../../plugins/agentscope-ai--reme/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1315919904-root"></a>

## [SandBase Skills](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md)

[![GitHub ★ 206](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=206&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sandbaseai/sandbase-skills)

> **用途**：需要复用研究工作流的Agent用户可按具体任务选择Skill；本次聚焦multi-source-search，不把目录数量当全部能力或质量证明。

> **亮点**：[Q01](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q01)、[Q02](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q02) 规范Skill源与多端包装分离，样本将有限检索、共同来源溯源与账本校验集成，便于复用研究流程。仅样本与分发机制已核查，不从245条声明推全库效果。

> **思考**：[Q03](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q03) validator只核声明与内部关系，不验证网页真实性、共同origin或引文支持；不同URL与自报独立数仍可语义失真。[Q02](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q02) force先删旧目录再复制，remove删全目录，不保证本地修改恢复。

> **建议**：[Q05](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q05) 未验证假设是对账本抽样做独立语义回源，记录引用支持和origin错误，比较现有流程的漏判与新增成本；已有溯源提示不能重复算新贡献。

[查看完整分析](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422910686-root"></a>

## [SourceDeck / 资料台](../../plugins/archaofan--dsh-source-deck/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Archaofan/dsh-source-deck)

> **用途**：反复做开源技术选型的开发者，可在当前DSH会话筛选资料并引用到未发送草稿。

> **亮点**：它把受限后台研究、主题内筛选和不可变引用连接起来，让选型决定有交接载体并保护原草稿。[Q01](../../plugins/archaofan--dsh-source-deck/INSIGHT.md#research-q01)、[Q02](../../plugins/archaofan--dsh-source-deck/INSIGHT.md#research-q02)、[Q03](../../plugins/archaofan--dsh-source-deck/INSIGHT.md#research-q03)

> **思考**：工具受限和元数据类型合法不保证来源事实准确，scope策略只是提示标记；精确RC与多步存储也限制通用兼容和崩溃保证。[Q04](../../plugins/archaofan--dsh-source-deck/INSIGHT.md#research-q04)

> **建议**：可在候选字段与引用快照保留固定证据定位、核查状态及未知项，用手工流程对照检验事实错误和核查负担；尚未实现。[Q05](../../plugins/archaofan--dsh-source-deck/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/archaofan--dsh-source-deck/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1238532570-root"></a>

## [Stock Analysis Plugin](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md)

[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Weaxs/stock-analysis-plugin) [![npm 30d 1,631](https://img.shields.io/static/v1?label=npm+30d&message=1%2C631&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@weaxs/stock-analysis-plugin) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@weaxs/stock-analysis-plugin)

> **用途**：已有固定历史资料的研究者可调用同一套工具复查行情与模拟结果。

> **亮点**：用共享 Python 层保持跨宿主入口，并把工具发现与成本假设明确分层。见 [Q01](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md#research-q01)、[Q02](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md#research-q02)。

> **思考**：模拟费用和时点可审阅，真实行情口径及复权仍须独立核对。见 [Q02](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md#research-q02)、[Q03](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md#research-q03)。

> **建议**：用同一历史样本对照插件与手算，检查交易序列、费用和核对人时。见 [Q04](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1367673687-root"></a>

## [StudyHub](../../plugins/ericwang1358--dsh-web-studyhub/INSIGHT.md)

[![GitHub ★ 165](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=165&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EricWang1358/dsh-web-studyhub) [![npm 30d 812](https://img.shields.io/static/v1?label=npm+30d&message=812&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ericwang1358/dsh-daily-flashcard) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ericwang1358/dsh-daily-flashcard)

> **用途**：用讲义复习的学生可评估生成题与来源回链。

> **亮点**：[Q01](../../plugins/ericwang1358--dsh-web-studyhub/INSIGHT.md#research-q01) 把选段、候选和发布组成可查流程。

> **思考**：[Q03](../../plugins/ericwang1358--dsh-web-studyhub/INSIGHT.md#research-q03) 模型审核不等于题目正确，模型调用也会外发片段。

> **建议**：[Q05](../../plugins/ericwang1358--dsh-web-studyhub/INSIGHT.md#research-q05) 比较回链对错题审核的帮助。

[查看完整分析](../../plugins/ericwang1358--dsh-web-studyhub/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1374986657-root"></a>

## [StudyMate](../../plugins/miaotofu01--study-mate/INSIGHT.md)

[![GitHub ★ 1,435](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C435&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Miaotofu01/Study-Mate) [![npm 30d 7,970](https://img.shields.io/static/v1?label=npm+30d&message=7%2C970&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunmiao/studymate) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunmiao/studymate)

> **用途**：数学或计算机自学者需要把课件、练习与答疑持续组织在同一学习计划。

> **亮点**：[Q01](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q01) 把学习资料和工具绑定到 DSH 预设，按宿主解析能力适配旧子路径。[Q02](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q02) 学习工具对实际写入回调做域校验。

> **思考**：[Q02](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q02) 域守卫和无 shell 不能隔离不可信程序；[Q03](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q03) 课件及实验回执不能代替掌握度。

> **建议**：[Q03](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q03) 对照现有流程试延迟复测和未见迁移题，判断是否应推进课程。

[查看完整分析](../../plugins/miaotofu01--study-mate/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1274335260-root"></a>

## [Tydora](../../plugins/zuorn--tydora/INSIGHT.md)

[![GitHub ★ 227](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=227&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zuorn/Tydora)

> **用途**：本地Markdown写作者希望在一个桌面中编辑、组织和导出笔记；基线是文本编辑器或Typora/Obsidian及发布工具。合格交付是可读正文/元数据/链接与正确导出，试用限定复制小库单writer。

> **亮点**：[Q01](../../plugins/zuorn--tydora/INSIGHT.md#research-q01) 将Markdown编辑、关系视图和CLI/MCP文件入口组合到本地库；[Q02](../../plugins/zuorn--tydora/INSIGHT.md#research-q02)提供可限只读的命令接口及GUI外部更新监听。主要增量是工作流整合，不把上游编辑器能力算原创，也不把DSH骨架当已注册工具。

> **思考**：[Q02](../../plugins/zuorn--tydora/INSIGHT.md#research-q02) dirty GUI缓冲忽略外部更新，随后直接写盘无expected版本，CLI原子rename不解决多writer覆盖。[Q03](../../plugins/zuorn--tydora/INSIGHT.md#research-q03)简化YAML、独立GUI/CLI逻辑与发布范围未知也限制迁移，不能因本地文件和badge承诺无损协作。

> **建议**：[Q04](../../plugins/zuorn--tydora/INSIGHT.md#research-q04)从dirty watcher与无版本save推导三版本冲突提示和保存前digest校验，可能降低GUI/Agent丢更新。复制文件三组反例计丢更新、误阻断、格式diff及恢复时间；无改善或总投入更高就否定，尚未实现不计贡献。

[查看完整分析](../../plugins/zuorn--tydora/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1319853777-root"></a>

## [Vibe Mathematics](../../plugins/chongcyrus--vibe-mathematics/INSIGHT.md)

[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ChongCyrus/Vibe-Mathematics)

> **用途**：用 DSH 探索数学命题的研究者可以组织分工，留下审查、编译和定论的轨迹。

> **亮点**：把多代理研究的策略放进可替换的 pack，并保留可回读的作业和定论凭据。运行规则和宿主预设分开。见 [Q01](../../plugins/chongcyrus--vibe-mathematics/INSIGHT.md#research-q01) 至 [Q03](../../plugins/chongcyrus--vibe-mathematics/INSIGHT.md#research-q03)。

> **思考**：Lean 作业通过、定义符合原题和 Verified 入轨是不同状态。共享状态的锁也会在有界等待后退化。见 [Q02](../../plugins/chongcyrus--vibe-mathematics/INSIGHT.md#research-q02) 与 [Q03](../../plugins/chongcyrus--vibe-mathematics/INSIGHT.md#research-q03)。

> **建议**：将原题、构建回执、忠实性判断和最终结论合成可复跑清单，可能减少不完整证明被误标。按合格结论和审阅时间做对照。见 [Q05](../../plugins/chongcyrus--vibe-mathematics/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/chongcyrus--vibe-mathematics/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1024118326-root"></a>

## [WeKnora](../../plugins/tencent--weknora/INSIGHT.md)

[![GitHub ★ 36,771](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C771&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora)

> **用途**：经常基于同一套内部手册回答问题的团队，需要限定可搜索的资料范围，并把答复和可复核的原文线索一起交给审核者。[Q01](../../plugins/tencent--weknora/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/tencent--weknora/INSIGHT.md#research-q01) 与 [Q02](../../plugins/tencent--weknora/INSIGHT.md#research-q02) 支持的贡献是把按知识库划定范围、混合检索、流式问答和复核资料组织成连续流程。归并知识库的权限与嵌入空间、提供回答前的引用事件，都是对索引和模型的组织工作。向量模型、关键词检索和排名融合算法本身已有独立来源。

> **思考**：[Q03](../../plugins/tencent--weknora/INSIGHT.md#research-q03) 自带配置允许在检索无结果后调用模型生成兜底答复，候选引用又在生成前发出。若把正常结束或出现引用当作答复有据的验收条件，就可能把没检索到支持材料的答案送入业务流程。按角色验证范围，逐条核对关键事实与引用原文。

> **建议**：[Q05](../../plugins/tencent--weknora/INSIGHT.md#research-q05) 把已有固定兜底策略和引用输出接入内部答疑复核流程。让无命中问题停止自动答复并转人工，正常回答先检查所引片段是否支持关键事实。若错误放行没有下降，或复核与转交增加的时间抵消改善，该假设不成立。

[查看完整分析](../../plugins/tencent--weknora/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1024118326-packages-dsh-weknora"></a>

## [WeKnora DSH 连接器](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md)

[![GitHub ★ 36,771](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C771&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora) [![npm 30d 8,667](https://img.shields.io/static/v1?label=npm+30d&message=8%2C667&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)

> **用途**：已经维护 WeKnora 知识库、并在 DSH 中反复答内部资料问题的团队，需要少搬运片段，同时保留按文档定位的证据。[Q01](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q01) 和 [Q02](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q02) 支持的贡献是把既有服务的搜索与补读接成可组合的宿主工具，保留文档标识、页与片段位置，让提问者能从短结果继续核对原文。嵌入、索引、重排及回答模型由服务端提供。

> **思考**：[Q03](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q03) 默认库可以被请求指定的范围覆盖，名称补充和元数据又可在请求失败后降级为空。若把默认库当授权白名单或把附加空结果当成资料不存在，就会误判覆盖范围。通过服务端受限凭据和正反例复核来约束试用。

> **建议**：[Q05](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q05) 将标题查找或补读元数据的失败独立写入工具结果，并在该状态下提示使用直接文档标识或网页核对。对照真实无命中与附加接口故障，检验这一状态是否减少错误放弃，同时计入新增上下文和复核开销。

[查看完整分析](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1412897932-root"></a>

## [WeKnora 会话归档](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md)



> **用途**：希望把历史 DSH 会话用于内部检索的团队可评估归档。

> **亮点**：[Q01](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q01) 把会话摘要和解析观察串联。

> **思考**：[Q03](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q03) 未匹配库时 dry run 仍可创建知识库。

> **建议**：[Q05](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q05) 验证预览的零写入条件。

[查看完整分析](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381860363-root"></a>

## [WSL Playwright 页面读取](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-playwright)

> **用途**：在 WSL 内需要给 DSH 查看网页标题或正文的人可评估无头读取工具。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md#research-q01) 将浏览器标题和正文结果变成专用会话工具输出。

> **思考**：[Q03](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md#research-q03) HTTP/HTTPS 校验不限制目标主机，状态检查也不能证明 Chromium 可用。

> **建议**：[Q05](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md#research-q05) 比较先看标题再按需取正文和直接抓全文的成本及效果。

[查看完整分析](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1396833540-root"></a>

## [乔木 RSS](../../plugins/joeseesun--qiaomu-rss-dsh/INSIGHT.md)

[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/joeseesun/qiaomu-rss-dsh)

> **用途**：外文 RSS 阅读和讨论常需来回复制文章。

> **亮点**：[Q01](../../plugins/joeseesun--qiaomu-rss-dsh/INSIGHT.md#research-q01) 让选段、正文和伴读在同一界面可追溯。

> **思考**：[Q03](../../plugins/joeseesun--qiaomu-rss-dsh/INSIGHT.md#research-q03) 模型、订阅读取和公开收录有不同数据去向。

> **建议**：[Q05](../../plugins/joeseesun--qiaomu-rss-dsh/INSIGHT.md#research-q05) 对照选段问答可减少切换和引用错误。

[查看完整分析](../../plugins/joeseesun--qiaomu-rss-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1435757109-root"></a>

## [乔木 UI 学习](../../plugins/joeseesun--qiaomu-ui-learn-dsh/INSIGHT.md)

[![GitHub ★ 80](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=80&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/joeseesun/qiaomu-ui-learn-dsh)

> **用途**：希望在DSH里整理设计参考并写学习笔记的用户。

> **亮点**：[Q01](../../plugins/joeseesun--qiaomu-ui-learn-dsh/INSIGHT.md#research-q01) 新增DSH容器、文件保存及可选Home接线，内容继承原项目。

> **思考**：[Q02](../../plugins/joeseesun--qiaomu-ui-learn-dsh/INSIGHT.md#research-q02) revision与etag保护有服务实例边界，不能推出跨进程安全。

> **建议**：[Q04](../../plugins/joeseesun--qiaomu-ui-learn-dsh/INSIGHT.md#research-q04) 若共享home真实并发丢写，再评估文件级条件提交。

[查看完整分析](../../plugins/joeseesun--qiaomu-ui-learn-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425127697-root"></a>

## [刷 B 站（子代理版）](../../plugins/yuuyuko-uu--dsh-bili-subagent/INSIGHT.md)

[![GitHub ★ 108](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=108&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-bili-subagent) [![npm 30d 9,155](https://img.shields.io/static/v1?label=npm+30d&message=9%2C155&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-subagent) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-subagent)

> **用途**：长期与 DSH 伙伴聊天、希望定期获得有来源的视频线索的人，可把内容筛选接入同一会话。

> **亮点**：把内容阅读和伙伴表达分开，并把自动触发与通知接进已有会话。合格报告仍要人工抽核字幕与出处。[Q01](../../plugins/yuuyuko-uu--dsh-bili-subagent/INSIGHT.md#research-q01) [Q02](../../plugins/yuuyuko-uu--dsh-bili-subagent/INSIGHT.md#research-q02)

> **思考**：force 和 rpid 可绕过部分发布开关，手动扫描也不关闭独立动态调度。评论业务失败仍可清除私信挂账，开关、授权和送达必须分别核对。[Q03](../../plugins/yuuyuko-uu--dsh-bili-subagent/INSIGHT.md#research-q03)

> **建议**：可将发布改为目标与正文绑定的一次确认动作，响应超时先查发布结果，比较撤销和重复回调的写入数。控制未改善或阻断正常只读流程时撤回。[Q04](../../plugins/yuuyuko-uu--dsh-bili-subagent/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/yuuyuko-uu--dsh-bili-subagent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334211162-root"></a>

## [灵枢（Lingshu）](../../plugins/furongjun-1999--dsh-memory/INSIGHT.md)

[![GitHub ★ 648](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=648&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FuRongJun-1999/dsh-memory) [![npm 30d 31,697](https://img.shields.io/static/v1?label=npm+30d&message=31%2C697&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@furongjun1999/dsh-memory) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@furongjun1999/dsh-memory)

> **用途**：跨会话反复处理同一项目的人，可把已有信息存进可查的记忆库再取用。

> **亮点**：将结构化记录、操作白名单和宿主回注接到一条长期记忆链，提供按来源复核的入口。[Q01](../../plugins/furongjun-1999--dsh-memory/INSIGHT.md#research-q01) [Q02](../../plugins/furongjun-1999--dsh-memory/INSIGHT.md#research-q02)

> **思考**：默认首启可自动签发令牌，没配置不能直接当只读。记忆边界标记也不能证明模型不会误用历史内容。[Q02](../../plugins/furongjun-1999--dsh-memory/INSIGHT.md#research-q02) [Q03](../../plugins/furongjun-1999--dsh-memory/INSIGHT.md#research-q03)

> **建议**：让有冲突或授权风险的记忆先经人复核再自动回注，比较错误复用与合格召回；无改善则保留手工记录。[Q04](../../plugins/furongjun-1999--dsh-memory/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/furongjun-1999--dsh-memory/INSIGHT.md) · [返回表格](#category-index)

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-11-13
