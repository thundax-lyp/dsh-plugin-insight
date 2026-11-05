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
| [AgentKey](#plugin-1218688296-root) | 提供统一外部数据服务的 Agent Skill、安装脚本与托管 MCP 接入配置。 | [Q04](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q04) 先固定外部CLI和宿主，在隔离profile验证完整调用与费用；当前保持观察。 |
| [AnySearch for DSH](#plugin-1333247282-root) | 在 DSH 原生网页搜索与抓取接口接入 AnySearch，并提供垂直检索和有限并发批量搜索。 | [Q04](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q04) 非敏感问题先比原provider与批量结果，以有效引用而非命中数决定继续；限流或缺证回人工。 |
| [Argo](#plugin-1304997851-root) | 为 Agent 提供多源搜索、网页取证和本地资料检索，并以 CLI、Skill 与 MCP 接口交付结果。 | [Q03](../../plugins/taxueseek--argo/INSIGHT.md#research-q03) 先固定少量公开源并关闭本地并入，保留原文和失败诊断，用同任务核对正确率与全部投入。 |
| [Argo DSH](#plugin-1304997851-packages-dsh-plugin) | 把 Argo 检索、抓取、原生 Web provider 和多轨道研究编排接入 DSH。 | [Q05](../../plugins/taxueseek--argo--packages-dsh-plugin/INSIGHT.md#research-q05) 观察自动研究报告采用；公开低后果样例先核实际工具和每条原文，发现依赖/引用缺口则退回单Agent或人工。 |
| [Awesome AI Pedia](#plugin-1321280738-root) | 按主题整理 AI 工具、Agent、Skill 和 DSH 相关文章的中文知识库。 | [Q04](../../plugins/awesome-ai-pedia--awesome-ai-pedia/INSIGHT.md#research-q04) 先作为线索入口，再按任务核对官方固定版本，不直接执行未经验证的命令。 |
| [Awesome DeepSeek Harness](#plugin-1330942675-root) | 按场景分类整理 DSH 插件、工具和基础设施，并提供生成的仓库目录。 | 建议作为发现资源试用：按场景挑少量候选后固定目标版本核查；不可访问或过时条目退回原仓库及公开搜索，不批量安装。 |
| [Awesome DeepSeek Harness](#plugin-1333173677-root) | 按任务分类收录 DeepSeek Harness 插件、Skill、MCP、客户端及其他配套资源的双语目录。 | 当读者尚不熟悉某类扩展时，可限时浏览目录，先从任务分类挑少量目标并记录链接，进入原仓库后另行核对版本和组件。 |
| [Awesome DeepSeek Harness Plugins](#plugin-1333171737-root) | 按能力分类整理 DSH 公开插件与扩展，并提供仓库、Star 与引用网页链接 | [Q03](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md#research-q03) 只读试用候选发现；目录条目必须回目标固定源码核实，无法核实时停止将该项当推荐。 |
| [Awesome DeepSeek Harness Plugins](#plugin-1333844474-root) | 提供 DeepSeek Harness 社区插件目录、结构化投稿审核与双语目录生成。 | [Q04](../../plugins/imsai-sh--awesome-deepseek-harness-plugins/INSIGHT.md#research-q04) 先选一个公开且已定位 manifest 的仓库，从干净分支准备单条 JSON，用本地文件或隔离服务检查投影。 |
| [Awesome DeepSeek Harness Plugins](#plugin-1336739291-root) | 将 marketplace 索引转为可浏览、可校验的双语插件目录 | [Q04](../../plugins/web-casa--awesome-deepseek-harness-plugins/INSIGHT.md#research-q04) 用固定提交作发现源，并对实际包独立验证。 |
| [Awesome DeepSeek Harness（libukai）](#plugin-1333167552-root) | 以中英日文指南组织官方入门、教程、客户端、插件和集成，帮助读者分清对象类型与查证版本、权限及采用条件。 | 可作为学习/查证起点，使用具体对象前回固定原仓；版本/类型/授权不明则停在阅读，见 [Q04](../../plugins/libukai--awesome-deepseek-harness/INSIGHT.md#research-q04)。 |
| [Awesome DSH Plugin](#plugin-1332582761-root) | 以双语元数据整理跨场景插件候选 | [Q04](../../plugins/alex-yanggg--awesome-dsh-plugin/INSIGHT.md#research-q04) 固定提交抽样核对来源和双语。 |
| [Awesome DSH Plugin](#plugin-1333175049-root) | 整理 DSH 插件候选并生成可读目录与市场索引。 | 先发现，再固定候选版本、独立核验权限与宿主兼容；不要把目录收录当安装背书。 |
| [Awesome DSH Plugin 目录](#plugin-1334020733-root) | 从双语 README 生成 DSH 插件分类站点、订阅源与机器可读索引。 | [Q04](../../plugins/beancookie--awesome-dsh-plugin/INSIGHT.md#research-q04) 用作候选列表，安装前重新确认目标仓库与包。 |
| [Awesome Gaussian Skills](#plugin-1223099228-root) | 提供 3D Gaussian Splatting 方法资料、Agent Skill 与 MCP 渲染服务。 | [Q04](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md#research-q04) 先隔离网络并用非敏感场景核对真实渲染；[Q03](../../plugins/jaccen--awesome-gaussian-skills/INSIGHT.md#research-q03) 边界不满足时停止。 |
| [BigA](#plugin-1250326123-root) | 将 A 股观察池与市场摘要 Skill 及其 Python 扫描脚本装入 DeepSeek Harness。 | [Q03](../../plugins/kobenfang--biga/INSIGHT.md#research-q03) 仅将离线合成样本用于核格式和口径，异常回人工资料核查。 |
| [causal-memory](#plugin-1312924592-root) | 本地记忆引擎存储事实与决策结果关系，并以 DSH 工具提供召回。 | [Q03](../../plugins/jingxuanc--causal-memory/INSIGHT.md#research-q03) 独立库小样本对照后再扩展。 |
| [causal-memory DSH plugin](#plugin-1312924592-dsh-plugin) | 通过 stdio MCP 将 causal-memory 工具和服务接入 DSH。 | [Q03](../../plugins/jingxuanc--causal-memory--dsh-plugin/INSIGHT.md#research-q03) 用临时数据库。 |
| [Claude Paper](#plugin-1154333841-root) | 跨宿主论文阅读 Skill 组合：下载解析 PDF，生成摘要或学习材料，并以本地网页库组织笔记。 | 一篇公开PDF的summary对照人工原文，study/Web库逐步另验；依赖和资料都备份，见 [Q03](../../plugins/alaliqing--claude-paper/INSIGHT.md#research-q03)。 |
| [clawock](#plugin-1240554500-root) | 为外部 AI Agent 提供投资研究的证据组织、决策校验和结果复盘流程。 | [Q03](../../plugins/kcnyu--clawock/INSIGHT.md#research-q03) 仅用离线模拟材料测试可审计交接，输入和回执对不上即退回人工复核。 |
| [ClearAI](#plugin-1367299537-root) | 为 DSH 提供以问题、证据、独立评估和领域本体组织研究的 Agent 预设。 | [Q04](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q04) 在固定材料与可反驳问题上试用，保留人工复核，用错误结案及全部费用决定是否继续。 |
| [Cue Data MCP](#plugin-1244140731-dsh-cue-data-mcp) | 把 Cue 监管、宏观、披露等公开数据 MCP 域接入 DSH。 | [Q03](../../plugins/sensedeal--cue-skills--dsh-cue-data-mcp/INSIGHT.md#research-q03) 用隔离 profile 对照工具发现与授权的小查询，身份或费用不明即退回人工。 |
| [Cue Omni Reader](#plugin-1244140731-dsh-cue-omni-reader) | 将 Cue Omni Reader 的文档与网页解析 MCP 接入 DeepSeek Harness。 | [Q03](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader/INSIGHT.md#research-q03) 只有具备隔离 key、已核外部包和非敏感样本，才进一步验证。 |
| [DARE](#plugin-1154200345-root) | 由 Markdown 技能图组织的分阶段 AI 科研流程与检查点规范 | [Q05](../../plugins/yogsoth-ai--de-anthropocentric-research-engine/INSIGHT.md#research-q05) 以单一可核验问题试用，人工抽查每阶段；引用丢失或越过规格批准则停止并退回人工计划。 |
| [Distilly](#plugin-1195828337-root) | 从消息、文档、访谈等材料提炼人物工作方法与表达偏好，并生成可复用的 Agent Skill。 | 有合法材料并愿意逐条复核的用户，可用自己的非敏感工作资料试做一个小档案，再用未参与生成的问题检验；先关注工作事实与建议是否准确，而不是说话像不像。 |
| [DSH Annotation](#plugin-1369398336-packages-dsh-annotation) | 把助手回复中的选段和批注作为原生引用加入草稿，并按顺序发送。 | [Q04](../../plugins/ecnu--eduwork--packages-dsh-annotation/INSIGHT.md#research-q04) 建议先用非敏感长回复在兼容客户端核对多处选段、撤销、刷新和历史；定位或草稿恢复异常时回退手工引用。 |
| [DSH Data Agent](#plugin-1331112087-root) | 在 DSH Web 与 TUI 中管理数据库连接、查询、版本化业务 Catalog 和分析报告。 | [Q04](../../plugins/omdsh-dev--dsh-data-agent/INSIGHT.md#research-q04) 仅在脱敏副本、数据库只读角色和显式readonly下试用，先核SQL/口径/截断；异常即回原客户端。 |
| [DSH Fact Check](#plugin-1380181057-root) | 将公开事实拆点核查，组织多来源检索、原文交叉验证与可选判断。 | [Q05](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q05) 建议能审查原文的研究者先选少量公开事实点并手工核引文；正文不可得或来源独立性不明时明确无法核实。 |
| [DSH Industry Research](#plugin-1339669759-root) | 提供产业链建图、公开动态追踪、公司卡片和带来源及缺口的行业研究报告。 | [Q05](../../plugins/perrylink--dsh-industry-research/INSIGHT.md#research-q05) 公开文本/非敏感副本先用unverified fallback，人工逐值核口径/来源；缺正文/冲突停并回手工。 |
| [DSH Local Memory](#plugin-1390103795-root) | 保留Hindsight项目分库，提供跨库查询、项目记忆状态总览与Git历史播种入口。 | 已有稳定daemon且库名唯一的多项目用户可试用，先显式指定少数库并核对事实；强隔离或同名项目应暂缓跨库汇总。 |
| [DSH MSDS Chain](#plugin-1216014649-plugins-dsh) | 通过 MCP 桥将托管化学安全查询服务接入 DSH。 | [Q04](../../plugins/littleblakew--msds-chain-mcp--plugins-dsh/INSIGHT.md#research-q04) 仅作为待复核线索；任何化学处置先由合格人员核对最新原始 SDS 和现场条件。 |
| [DSH Noema](#plugin-1334167430-root) | 将本地 Noema 记忆服务接入 DSH，支持检索与跨工具导入。 | [Q03](../../plugins/zseven-w--dsh-noema/INSIGHT.md#research-q03) 先隔离验证。 |
| [DSH PDF Reader](#plugin-1346064150-root) | 提供PDF内容扫描、单页文本与图像混合读取，以及区域渲染工具。 | 适合已经有Python环境且经常读图表论文的人在非关键材料上小范围试用。 |
| [DSH Research Report](#plugin-1339655720-root) | 以证据快照、claim 绑定、字节核验和 manifest 哈希生成版本化研究报告。 | [Q05](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q05) 公开非敏感副本试字节回溯，外存seal并人工审所有段落/语义；不符停发布回手工对账。 |
| [DSH SciWork](#plugin-1416950630-root) | 在 DSH 中组织科研课题、文献、数据和投稿材料。 | 先用备份课题核实确认、回执与材料；超时先查文件，投稿前人工复核。 |
| [DSH Video Lens](#plugin-1338640495-root) | 将本地视频抽样、可选转写和视觉问答接入 DSH | [Q04](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md#research-q04) 只用虚构短片验收抽样、时间和传输。 |
| [DSH Web Tools](#plugin-1335219884-root) | 为 DeepSeek Harness 提供多来源网页搜索与抓取，支持可配置后备链及 X、小红书原生访问。 | 仅在隔离 Profile 测普通双源与单源。 |
| [DSH 插件周榜面板](#plugin-1400385991-packages-dsh-weekly-panel) | 在 DSH 侧栏查看插件周榜、免费模型摘要与推荐，并复制安装命令。 | [Q04](../../plugins/514006234--dsh-weekly-check--packages-dsh-weekly-panel/INSIGHT.md#research-q04) 先只看摘要和来源，再决定是否复制命令。 |
| [dsh-anchored-monitor](#plugin-1337467566-root) | 对 DSH reasoning 流做词形波段监控，独立进程可自动中断并重置会话。 | 仅隔离 profile 显式关闭干预，先回放验证代理指标；真实使用前需默认只读、身份鉴权及人审。 |
| [dsh-auto-memory](#plugin-1381430202-root) | 将项目和用户记忆写入本地文件并注入索引，可选结束时固化。 | [Q03](../../plugins/asktheway--dsh-auto-memory/INSIGHT.md#research-q03) 只在测试项目验收核心工具和提示，随后对照自动固化。 |
| [dsh-codevault](#plugin-1359423472-root) | 把源码阅读认识按仓库/文件/符号合并为Markdown对象卡，以JSONL保存条目并可选关联本地vault。 | 单人单写者独立备份档案可试用，vaultDir先不配置；广泛vault读取前优先修边界。 |
| [dsh-feed](#plugin-1336585522-root) | 聚合 GitHub dsh-plugin topic 与 npm keyword 的本地 JSON 索引，供工具、CLI、MCP 查询。 | 隔离工作区试同步，审阅来源与错漏；search 只做候选检索，详见[Q03](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q03)。 |
| [dsh-git-memory](#plugin-1339286962-root) | 为 DSH 提供本地 Git 长期记忆、有限检索与可恢复的记忆管理。 | [Q03](../../plugins/seriousz158--dsh-memory/INSIGHT.md#research-q03) 在可丢弃仓库先试只读。 |
| [dsh-hacker-news](#plugin-1211255316-plugins-hacker-news) | 为 DeepSeek Harness 提供 Hacker News 榜单、评论、搜索和用户信息工具。 | [Q04](../../plugins/heartleo--hn-cli--plugins-hacker-news/INSIGHT.md#research-q04) 仅用非敏感查询并检查截断，重要结论回原帖；网络或完整性不满足时停止。 |
| [dsh-handbook](#plugin-1333258936-root) | DeepSeek Harness 中文优先的学习手册与生态观察，涵盖上手、插件开发、案例和调优。 | 先用固定宿主完成一次隔离的入门练习。 |
| [dsh-insight](#plugin-1336649545-root) | 用需求匹配、环境配方、健康评分、静态安全扫描与统一 verdict 辅助选择 DSH 插件。 | 适合插件研究者把它当候选筛选和审计线索观察，不应直接驱动生产安装。 |
| [dsh-literature](#plugin-1351375738-root) | 在DSH侧窗识别学术文献、获取元数据和全文，提供PDF阅读、引用、笔记及本地库和目录保存。 | 先观察。 |
| [dsh-ls125-uv-probe](#plugin-1381989584-root) | 把 LS125/UVALED-X3 私有 UART 读取协议、抓取分析工具及 F103 参考固件注册成 DSH 技能。 | 只读轮询与离线抓取先行，清零单独审批；在独立仪表/标准光源下复核后才上生产设备。 |
| [dsh-math-olympiad](#plugin-1344714964-root) | 挂载竞赛数学解题 Skill，要求独立验证证明、诚实弃权，并可选编译 PDF。 | 已有可信 subagent 与 DSH base 的团队可隔离试题，逐题核验证器入参、标准解与弃权；详见[Q03](../../plugins/988hj7tczd-oss--dsh-math-olympiad/INSIGHT.md#research-q03)。 |
| [dsh-mneme](#plugin-1333254657-dsh-mneme) | 在DSH中以SQLite与Markdown维护跨会话记忆，提供检索、自动注入和摘要整理，隔离与内容门控有明确限制。 | [Q04](../../plugins/slow-stack--mneme--dsh-mneme/INSIGHT.md#research-q04) 非敏感单项目备份后试核心记忆，保持actionRun关闭并明确自动工作开关；验证任务结果和持久状态，串用/误记/超预算则关闭自动工作退手工文档，退出单独处理持久库。 |
| [dsh-mnemon](#plugin-1329424520-root) | 为 DSH 提供可组合的分层记忆视图、读取与写入。 | [Q05](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q05) 用虚构项目和本地独立存储试用；串项目或旧错误持续出现时停用并核查数据。 |
| [dsh-moli](#plugin-1415767842-root) | 将本地 Moli 无头浏览器接入 DSH，提供渲染抓取、选择器读取、截图、PDF与引擎探测。 | 建议观察；先在隔离宿主准备已审引擎并设严格TLS，核对公开页面与退出；敏感登录、共享宿主和高可信取证应暂缓。 |
| [dsh-obsidian-board](#plugin-1415116420-root) | 在DSH三栏面板以本地BM25检索Obsidian笔记，复用宿主模型流式回答、点引用读源并保存回答。 | 先观察，非敏感可信个人库和限定模型通道对照。 |
| [dsh-plugin-academic-writing](#plugin-1336663456-root) | 为DSH提供论文骨架、题目摘要模板、引用和LaTeX片段，以及词法表达、Markdown结构、术语和投稿清单辅助。 | 观察，先修计数/无作者引用/TeX列等基础分支，只当草稿工具，不作学术或投稿验收。 |
| [dsh-plugin-audit](#plugin-1336223158-root) | 同步 GitHub topic/npm 元数据并评分排行，按需对单插件做有限静态安全扫描。 | 只把分数作线索，确认扫描文件覆盖/错误状态后再读固定 SHA 源码、验证安装；详见[Q03](../../plugins/863683348--dsh-plugin-audit/INSIGHT.md#research-q03)。 |
| [dsh-plugin-finance-data](#plugin-1336663504-root) | DSH Agent 的确定性金融算术工具，但比率文本、跨年定投和组合再平衡路径存在可核不一致。 | 修复关键路径前不用于真实决策；以 10/100 比率、2 年月投和组合偏离样本验每个 action。 |
| [dsh-plugin-tavily](#plugin-1334654243-root) | 接管 DSH web_search 的 Tavily provider，并提供可选提取服务、设置卡和主机探测路由。 | 待修复缓存与 keyless；需用真实凭据在受控 Profile 验证搜索/提取/回退及 API 权限；详见[Q03](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md#research-q03)。 |
| [dsh-plugin-verify](#plugin-1336684054-root) | 通过关键词行号、JSON/YAML检查、URL/npm/GitHub探测及有界批量输出，提供核查线索和元数据。 | 先观察，作线索而非证实/安全通行证，先修证据语义/覆盖与网络范围再评估。 |
| [dsh-read-url](#plugin-1335047324-root) | 读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。 | 适合用公开网页查资料并愿意核对原来源的人在独立profile试用，先明确提供方缺失时的网络回退权限，默认不加直连例外；缺页、政策误绕过或预算失控时停用。 |
| [dsh-run2skill](#plugin-1339317132-root) | 从 DSH 会话提炼可审查的 Skill 提案，确认后按作用域发布。 | [Q03](../../plugins/qkycir-123--dsh-run2skill/INSIGHT.md#research-q03) 先显式生成项目草稿，核对下次用法后再扩展。 |
| [dsh-scrape-webpage](#plugin-1334269686-root) | 抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。 | 适合公开、无需登录且正文可抽查的研究页面小范围试用；登录态、强脚本渲染或付费墙继续使用宿主浏览器。 |
| [dsh-search](#plugin-1423253220-root) | 以 DeepSeek Search/Fetch API 提供检索、正文抓取和多页研究工具。 | 可用公开、非敏感查询小范围试用；先设 count/N 上限并以 100 个查询对照内置搜索的召回、正文成功率与实际账单。 |
| [dsh-source-deck](#plugin-1422910686-root) | 在会话侧栏后台查找资料，筛选和对比候选，并把保留项的不可变快照引用到当前草稿。 | 在明确支持的RC环境用非敏感选型任务试用，先检查搜索/抓页/spawn可用，再核实候选URL和关键许可。 |
| [dsh-stock-market](#plugin-1331846104-root) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。 |
| [dsh-tabbit](#plugin-1334076307-root) | 将 Tabbit 浏览器任务、网页抓取和标签提及接入 DSH，并为页面访问设置审批。 | [Q03](../../plugins/tabbit-browser--dsh-tabbit/INSIGHT.md#research-q03) 先试独立实例中的合成页面。 |
| [dsh-tavily-web](#plugin-1369301269-root) | 提供 Tavily 多密钥轮询检索工具，以及通过宿主 shell 的 curl 网页正文抓取工具。 | 在不含敏感查询的固定任务集试用，先限制凭据数与调用预算，核对返回URL、网页状态和正文。 |
| [dsh-teaching-board](#plugin-1358319839-root) | 在 DSH 会话中展示 HTML 板书，支持圈画、方向选择及把截图作为图片消息回传。 | 先观察并补齐消息来源和提交确认，再以非敏感课程在隔离 profile 检查四工具、增量更新和截图反馈；成功需图片进入正确会话且不覆盖用户草稿。 |
| [dsh-thoughtdag](#plugin-1160354976-dsh) | 将 ThoughtDAG 图形画布嵌入 DSH 并桥接会话读取和写回。 | [Q04](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q04) 用隔离会话并核对引用；不明写回先回原文。 |
| [dsh-trend-radar](#plugin-1336582509-root) | 按需采集 GitHub dsh-plugin topic/awesome 快照并生成趋势报告、关键词雷达和实验性 Web 面板。 | 先隔离建立空目录并复核首轮成功，再核查报告采样分母与类别映射；勿把 top100 榜当全生态。 |
| [dsh-ultramath](#plugin-1337487779-root) | 同步数模竞赛主控/角色预设、模型库与论文模板。 | 只在备份同名 DSH 目录的隔离 profile 试点；按题目核数据、模型、数值和论文，不以提示门禁代替独立验收。 |
| [dsh-visualize](#plugin-1333132287-root) | 在 DSH Web 中生成、修订和重放隔离交互卡片或页面，并提供图片与草稿桥接。 | 有限试用小规模非敏感解释/原型，核已知答案再扩大；正式计算或业务系统另验。 |
| [dsh-wsl-obscura](#plugin-1358313559-root) | 在 WSL 中为 DSH 接入 Obscura 无头页面抓取、版本检查和 MCP 接线提示。 | 在隔离环境试非敏感公开网页，禁用私网和 eval；用静态请求或受控浏览器退出。 |
| [dsh-wsl-obsidian](#plugin-1380817560-root) | 让 WSL 中的 DSH Agent 搜索、读写 Windows Obsidian 笔记并打开桌面应用。 | [Q03](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md#research-q03) 先从复制库核路径、搜索与桌面打开。 |
| [dsh-wsl-vecmem](#plugin-1381726438-root) | 通过 Ollama 嵌入向量保存和检索 DSH 中的项目短记。 | [Q04](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q04) 先隔离存储路径并保留原件。 |
| [dshfind](#plugin-1333082908-root) | 围绕 DeepSeek Harness 的插件发现、学习和社区网站。 | [Q04](../../plugins/hikariming--dshfind/INSIGHT.md#research-q04) 将目录当候选入口，安装前回固定源码核权限和兼容；来源或安全条件不明就停止。 |
| [EduWork Literature](#plugin-1369398336-packages-dsh-literature) | 为 DSH 提供 DBLP、arXiv 文献搜索、BibTeX 和可访问全文提取。 | 先用公开论文核对来源和引用；部分失败及取消后回原站和目录确认。 |
| [Envoy](#plugin-1262941478-integrations-dsh-envoy-dsh) | DSH 子包注册 Envoy Skill、MCP 和链接读取提示，输出可定位资料。 | [Q03](../../plugins/regrevia--envoy--integrations-dsh-envoy-dsh/INSIGHT.md#research-q03) 固定链接同预算人工对照。 |
| [EverOS](#plugin-1085086903-root) | 面向 Agent 和应用的本地优先 Markdown 记忆服务与检索框架。 | 隔离数据根，用低敏样例测试 add、flush、任务状态及检索；核对文件、成本与备份，DSH 桥接需单独验收。 |
| [Free Search](#plugin-1334384058-root) | 为 DSH 提供多来源网页搜索、回退和研究证据整理工具。 | 先备份并隔离 profile，用非敏感查询测试允许的来源；核对 provider、实际费用和出处，停用前恢复原配置。 |
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
| [MemOS](#plugin-1014729376-root) | 为 Agent 提供记忆存储、检索及本地或云端接入的基础设施。 | 在隔离 profile 用低敏样例核对召回、捕获、外发与删除；出现错误或费用不明时关闭捕获并保留可核对原记录。 |
| [MemSearch](#plugin-1153190876-root) | 面向 Markdown 知识库提供增量索引和语义加关键词混合搜索。 | [Q05](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q05) 在隔离 collection 先验报告并对照 grep；有失败或不能核对来源时回原文件。 |
| [MemSearch DSH](#plugin-1153190876-plugins-dsh) | 为 DSH 提供会话摘要日记、按需召回 Skill 与候选评审入口。 | [Q05](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q05) 先在隔离项目核查日记、索引和原会话，失败时回原文。 |
| [meow-memory](#plugin-1333986968-root) | 为 DSH 提供跨会话项目记忆、召回和自动整理。 | 隔离项目核验首轮、压缩和外部库；错误时停用并回人工笔记。 |
| [Mimir](#plugin-1340749561-root) | 在DSH中组织文献、论文编译、实验和研究记录，提供工具与工作台，编译或任务状态不替代研究结果核验。 | [Q04](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q04) 现有DSH用户从本地论文副本编译诊断试用，核实际PDF与源修改；远端unknown不自动重提。 |
| [MindMemOS](#plugin-1278033467-root) | 提供长期记忆服务、检索与写入接口，并通过CLI和Agent插件共享跨会话记忆。 | 有记忆服务运维能力且有跨任务复用需求的团队可用非敏感双用户样本试用；先核对身份、最终写回和错误恢复；若混用范围与纠错无法确认，继续明确的项目笔记或手动记忆。 |
| [Mnemon](#plugin-1162230313-root) | 为 Agent 提供由宿主模型监督的本地持久记忆、图关联、意图检索与生命周期管理 CLI。 | [Q04](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q04) 先在非敏感副本库试用 Memory CLI，明确指定库并保留笔记备份。 |
| [ModSearch](#plugin-1163808542-root) | 为 DSH 提供多引擎网页搜索、X 搜索和页面读取。 | [Q05](../../plugins/liustack--modsearch/INSIGHT.md#research-q05) 建议在可信配置和隔离凭据下小范围试用，逐项核对来源；数据不能外发或降级不适合时回退。 |
| [Molio DSH 知识库插件](#plugin-1259108597-packages-dsh-plugin-molio) | 让 DSH 通过只读工具列出、搜索和读取 Molio 本地知识库。 | [Q04](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md#research-q04)本机小库固定id，先搜索再核原文，异常回界面/CLI。 |
| [Oh My Knowledge](#plugin-1190633989-root) | 面向 AI 工作记录的知识提取、维护和载体评测工具集。 | [Q04](../../plugins/lizhiyao--oh-my-knowledge/INSIGHT.md#research-q04) 先用可信非敏感材料复核来源和模型目标；无法验证来源或执行环境不可信时停止。 |
| [Oh-My-DSH](#plugin-1333671427-root) | 提供 DSH 插件分类目录、元数据快照与检索站点。 | [Q03](../../plugins/like-study1--oh-my-dsh/INSIGHT.md#research-q03) 先在固定快照查找目标，再到候选固定源核对身份、入口及权限。 |
| [OpenViking DSH 记忆插件](#plugin-1128123594-examples-dsh-memory-plugin) | 为 DSH 提供 OpenViking 画像、召回、消息采集及记忆工具。 | 以非敏感独立项目核验 peer、召回、短断网及停用后队列；出现串扰或缺失时停止相关进程并回退人工笔记。 |
| [PatentRadar](#plugin-1230059993-root) | 从公开专利号组织竞品候选、技术特征对照和公开证据线索，供人工复核。 | 仅用公开、可回源案例验证一份线索表；不能支持具体特征时回到人工检索。 |
| [Polaris](#plugin-1309135706-root) | 独立桌面/Python研究工作台，以持久Voyage驱动真实实验执行与模型反思迭代；预算审批是条件开关，运行指标和自验证不等独立科研真值。 | 可丢弃合成已知答案任务，借已核API显式confirm_budget与正max_hours，固定允许模型/Runner资源；当前创建Modal未提交确认字段，不把默认GUI当有预算人工门，见[Q03](../../plugins/zju-real--polaris/INSIGHT.md#research-q03)。 |
| [ReMe](#plugin-849121458-root) | 以文件记忆、搜索与模型演化为 Agent 提供可读长期记忆。 | [Q05](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q05) 以少量可纠正资料试默认检索和回读；冲突或回执不明时暂停演化。 |
| [ReMe DSH 集成](#plugin-849121458-integrations-dsh) | 将 ReMe 长期记忆检索、会话记录和后台整理桥接 DSH。 | [Q05](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q05) 隔离试搜索、先关闭自动归档；检查隐私和质量再决定开启。 |
| [SandBase Skills](#plugin-1315919904-root) | 提供可移植 Agent 工作流技能集合，含 DSH 目录挂载、单技能复制工具和多源研究证据账本样本。 | [Q04](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q04) 可在测试项目只取multi-source-search，预读资源并对一个不敏感主张试用；用真实能力名，不为通过伪造第二来源。 |
| [Stock Analysis Plugin](#plugin-1238532570-root) | 多宿主证券研究工具集，共享 Python 行情、筛查与回测能力，另有 DSH 专用分发。 | 只在隔离 Profile 用已许可的固定样本核对复盘。 |
| [StrataGate AgentMemory](#plugin-1329972465-root) | 为 DSH 提供分层会话记忆、事件检索、目录和提示词上下文。 | [Q03](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q03) 用无敏感信息的测试库。 |
| [StudyHub](#plugin-1367673687-root) | 把讲义等资料生成有来源的练习题，支持复习、题库与音频转录。 | [Q04](../../plugins/ericwang1358--dsh-web-studyhub/INSIGHT.md#research-q04) 用可外发资料先生成少量题并人工核对。 |
| [StudyMate](#plugin-1374986657-root) | 在 DSH 中组织课程大纲、课件、练习和项目，持久保存学习进度并提供阅读端。 | 建议已有DSH且能核教材的自学者限定一门小课试用，备份工作区并保留人工学习计划；发现内容错误或进度虚高则停自动推进，不跑不可信实验。 |
| [Tydora](#plugin-1274335260-root) | 本地 Markdown 编辑与知识库应用，组合所见即所得编辑、双链图谱、画布、思维导图和静态站点构建。 | [Q03](../../plugins/zuorn--tydora/INSIGHT.md#research-q03) 复制小库单writer试用并核格式diff；Agent先只读，公开导出只用已核样例。 |
| [WeKnora DSH 插件](#plugin-1024118326-packages-dsh-weknora) | 为 DSH 提供 WeKnora 知识库检索、文档补读与综合问答工具。 | 先以受限 API key 和匿名资料关闭 ask 试验检索与补读；核对库范围、原文和裁剪，异常时停用工具并回平台。 |
| [WeKnora 会话归档](#plugin-1412897932-root) | 将 DSH 会话摘要增量写入 WeKnora，并观察文档解析状态。 | [Q04](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q04) 测试先给已有库 ID 并关闭精炼。 |
| [WeKnora 知识平台](#plugin-1024118326-root) | 集中管理组织知识库，提供检索问答、Agent 与 wiki 能力。 | 先以非敏感语料和两个角色核验拒绝、引用与恢复，再对照现有搜索；出现越权或状态不明时停用自动答复。 |
| [WSL Playwright 页面读取](#plugin-1381860363-root) | 在 DSH 中通过无头 Chromium 读取网页标题、状态或正文。 | [Q04](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md#research-q04) 先用隔离环境核对依赖、出站和正文，之后再决定是否纳入会话工具。 |
| [乔木 RSS](#plugin-1396833540-root) | 把 RSS 订阅阅读、版本切换和带原文的伴读放进 DSH | [Q04](../../plugins/joeseesun--qiaomu-rss-dsh/INSIGHT.md#research-q04) 先用公开或虚构 RSS，保持实验室关闭。 |

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

[![GitHub ★ 21,705](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21%2C705&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) [![npm 30d 1,467](https://img.shields.io/static/v1?label=npm+30d&message=1%2C467&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin) [![最新发布 2026-08-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin)

> **用途**：寻找 DSH 插件的用户和维护候选目录的维护者；基线是逐仓搜索及人工审计。[Q01](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q01)

> **亮点**：将人工条目、可读清单、机器索引及能力披露组织到统一发现入口，不是候选插件运行时。[Q01](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q01) [Q02](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q02)

> **思考**：索引跳过缺元数据及 Git-only 项；扫描失败保留旧结果，收录和未检出都不是安全或完整性证明。[Q02](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q02) [Q03](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q03)

> **建议**：未验证假设：显示实际扫描版本、最近成功时间和失败原因可减少旧记录误读；须测识别、误报及维护成本。[Q05](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q05)

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

<a id="plugin-1195828337-root"></a>

## [Distilly](../../plugins/titanwings--distilly/INSIGHT.md)

[![GitHub ★ 26,004](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26%2C004&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/titanwings/distilly)

> **用途**：为需要保留同事工作方法、整理个人偏好或研究公众表达的人，把消息、文档和访谈材料提炼为可复用 Person Profile，并打包成 Agent Skill。合格产物是能回指材料、区分事实和推断且可纠正的行为规则，不是本人复制品。

> **亮点**：相对手写“扮演某人”的提示，Distilly 将来源采集、Work 与 Persona 双轨分析、用户预览、统一 writer、版本备份及宿主安装拆成可复用流程。它改变知识交接的组织方式，而非训练出人的模型；主要执行仍依赖承载 Skill 的 Agent 判断。[Q02](../../plugins/titanwings--distilly/INSIGHT.md#research-q02)

> **思考**：source-grounded 是目标，不是 writer 或质量脚本自动证明的语义属性。流程允许无文件时仅凭访谈生成；quality_check 的 URL 形状、来源标记和 PASS 文本检查不能证明判断忠实于本人或适合新问题。工作技能内明确不足就说明缺口，但提示规则能否被宿主稳定遵守仍未知。[Q03](../../plugins/titanwings--distilly/INSIGHT.md#research-q03)

> **建议**：未验证假设是把每条行为规则绑定到具体材料片段、适用情境、反例及本人或授权审核者修正记录，让纠错有可定位的最小单元。由当前文档级质量标记与行为规则语义之间的距离推导；在20个留出工作问题上对比普通 persona 提示与规则证据版，观察事实错误、风格过拟合、拒答与修正时间。若只提高风格相似度而不改善任务忠实性，或复核负担过高，应否定。[Q05](../../plugins/titanwings--distilly/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/titanwings--distilly/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1380181057-root"></a>

## [DSH Fact Check](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7starsseeker/dsh-fact-check) [![npm 30d 2,675](https://img.shields.io/static/v1?label=npm+30d&message=2%2C675&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fact-check) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fact-check)

> **用途**：需要核查公开声明的研究者可以按事实点检索原文、比较来源并记录仍不能核实的部分。

> **亮点**：[Q01](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q01) 与 [Q02](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q02) 显示 Skill、渠道计划与判断脚本将一套核查方法接到宿主；其好处取决于实际搜索及人工判断，不是事实正确保证。

> **思考**：[Q03](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q03) 的来源数量与双轨属于方法指引，不能代替原文和独立性核查；[Q04](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q04) 的缺密钥退出、对外传输及 sufficient 调用也要求使用者实际检查。

> **建议**：[Q06](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q06) 提出绑定原文版本和引用关系的未验证证据图；若盲测无法改善失效引用识别或增加成本过高则否定。

[查看完整分析](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1346064150-root"></a>

## [DSH PDF Reader](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngelosZou/dsh-pdf-reader) [![npm 30d 722](https://img.shields.io/static/v1?label=npm+30d&message=722&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pdf-reader) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pdf-reader)

> **用途**：适合在DSH中阅读含图表、公式与双栏布局的论文，输出需人工核对原页。

> **亮点**：以内容画像选择文本或区域渲染，将PyMuPDF能力组织成扫描、混读和精读工具；贡献在适配与路由，不是新的PDF解析算法。[Q03](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md#research-q03)

> **思考**：缓存名缺少完整bbox、DPI与源路径，同起点区域或同名PDF可发生路径重合；尚未运行复现其读图影响。[Q04](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md#research-q04)

> **建议**：未验证假设是用PDF内容摘要、页码、完整bbox及DPI作为缓存键，并让每个问题共享总图像预算，能减少误用旧图与过量裁剪。它从当前缓存冲突及逐区域独立预算推导，不是本版已有能力。最小验证用同basename两PDF、同起点不同bbox及图表密集页，对比现版和新缓存策略，检查路径唯一性、读图正确率、总图像token和人工复核；若只有磁盘增量而无错误或总成本改善，否定其采用优势。 [Q08](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339655720-root"></a>

## [DSH Research Report](../../plugins/perrylink--dsh-research-report/INSIGHT.md)

[![GitHub ★ 213](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=213&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-research-report) [![npm 30d 5,581](https://img.shields.io/static/v1?label=npm+30d&message=5%2C581&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-research-report) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-research-report)

> **用途**：研究者和上游插件需要可移交/复算的材料与claim核验日志。

> **亮点**：[Q01](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q01)、[Q02](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q02) 将快照/claim/字节判据/反证与报告seal串联，提供可回查工程交付。

> **思考**：[Q03](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q03) substring verified非事实支持且段落可不绑定；核心ok不合claimChecks而CLI信封合；[Q04](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q04)后台killed不证明封存停写。

> **建议**：[Q05](../../plugins/perrylink--dsh-research-report/INSIGHT.md#research-q05) 分开完整性/覆盖/语义/最终状态收据，若文案/手工等效或负担更大即否定。

[查看完整分析](../../plugins/perrylink--dsh-research-report/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1416950630-root"></a>

## [DSH SciWork](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/58catmiao/dsh-sciwork)

> **用途**：需要跨文献、图稿与投稿材料组织的研究者；基线是手工维护文件和逐项核对。[Q01](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q01)

> **亮点**：统一课题动作、计划和可审查回执，并生成投稿包。[Q01](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q01) [Q02](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q02)

> **思考**：旧动作可隐式代签；超时不取消底层写，投稿检查失败仍可导出，科学内容需人工复核。[Q03](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q03) [Q04](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q04) [Q05](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q05)

> **建议**：未验证假设：持久操作状态与完成后回读可帮助区分超时后的未知写入，须对照已有成功幂等与回执。[Q06](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338640495-root"></a>

## [DSH Video Lens](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md)

[![GitHub ★ 112](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=112&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dundunhan/dsh-video-lens) [![npm 30d 2,425](https://img.shields.io/static/v1?label=npm+30d&message=2%2C425&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-video-lens) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-video-lens)

> **用途**：用户要快速定位录屏中的某个事件。

> **亮点**：[Q01](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md#research-q01) 通过时间窗口和语音线索减少候选片段。

> **思考**：[Q03](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md#research-q03) 帧抽样会漏事件，外部端点可收到媒体内容。

> **建议**：[Q05](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md#research-q05) 明确时间的问答或可节约回看时间。

[查看完整分析](../../plugins/dundunhan--dsh-video-lens/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1359423472-root"></a>

## [dsh-codevault](../../plugins/1014029855--dsh-codevault/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1014029855/dsh-codevault)

> **用途**：读者保存源码认识并重复回访，要求对象/版本坐标、真实依据和档案恢复可解释。

> **亮点**：稳定对象卡、快记展开与回访/历史接线使记录可积累，标准文本易迁移；内容依据仍由读者核查。详见[Q01](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q01)与[Q02](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q02)。

> **思考**：vault仅词法守卫且stat递归跟链接、全文读后裁剪；expand/delete改旧行限制历史，整体JSONL与多派生文件非事务。详见[Q02](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q02)。

> **建议**：可探讨修订/tombstone日志与最小vault入口，固定source ref并加realpath/扫描预算；涉及迁移、擦除与日志增长取舍，未验证。详见[Q04](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/1014029855--dsh-codevault/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336585522-root"></a>

## [dsh-feed](../../plugins/863683348--dsh-feed/INSIGHT.md)

[![npm 30d 92](https://img.shields.io/static/v1?label=npm+30d&message=92&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feed) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feed)

> **用途**：查询 DSH 插件候选并向其他界面复用机器可读索引。

> **亮点**：模型工具、CLI 和实验性 MCP 共用可 diff JSON 索引，详见[Q03](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q03)。

> **思考**：默认覆盖有限、同插件跨源可能双计，网络部分失败仍更新时间；路径约束仅词法检查，详见[Q01](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q01)、[Q02](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q02)。

> **建议**：以仓库/包关联身份与显式分页/失败状态减少双计和假新鲜，反证及代价见[Q05](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q05)；真实路径写入仍需独立约束。

[查看完整分析](../../plugins/863683348--dsh-feed/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 815](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=815&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-mnemon) [![npm 30d 69,103](https://img.shields.io/static/v1?label=npm+30d&message=69%2C103&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon)

> **用途**：[Q01](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q01) 跨会话反复使用偏好和项目资料的 DSH 用户需要正确范围的可核验记忆。

> **亮点**：[Q02](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q02) 把多个来源按固定视图组合并区分常驻与按需读取，相比单一记忆文件提供可配置路由，但不保证内容真实。

> **思考**：[Q03](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q03) 作用域约束不能证明事实正确或全 Provider 隔离；关闭组件也不删除数据。

> **建议**：[Q04](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q04) 对高频注入事实提示来源和最近核验时间或可减少过期引用，需对照验证。

[查看完整分析](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1415767842-root"></a>

## [dsh-moli](../../plugins/27painter--dsh-moli/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/27painter/dsh-moli) [![npm 30d 1,991](https://img.shields.io/static/v1?label=npm+30d&message=1%2C991&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-moli) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-moli)

> **用途**：需要读取动态网页、特定容器或截图的DSH用户；静态正文已有web_fetch时无需浏览器。[Q01](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q01)

> **亮点**：把上游浏览器接为DSH工具，并显式处理选择器互斥、空输出和二进制结果；渲染能力归Moli上游，不能把字符样本推成通用收益。[Q01](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q01) [Q02](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q02)

> **思考**：默认insecureTls:true降低证书核验；抓取使用spawnSync可能占用宿主事件循环，安装器摘要若无受信预期值也不提供来源认证。[Q03](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q03) [Q04](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q04)

> **建议**：未验证方向是受信字节与引擎锁定、严格TLS和异步可取消抓取；用错误证书、替换安装器与慢页面检查是否同时保住来源和响应性。[Q05](../../plugins/27painter--dsh-moli/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/27painter--dsh-moli/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1422910686-root"></a>

## [dsh-source-deck](../../plugins/archaofan--dsh-source-deck/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Archaofan/dsh-source-deck)

> **用途**：面向技术选型和可复用开源实现调研者，把发现后的筛选理由、对比和引用交接集中在当前会话。

> **亮点**：相对浏览器标签页加手工书签，插件把研究、人工保留/排除和引用到开发对话串成可回看的交接链。不可变快照保留当时筛选理由，输入桥防止异步插入覆盖用户新草稿，是比简单搜索列表更具体的增量；搜索和推理能力仍来自宿主工具及模型。[Q01](../../plugins/archaofan--dsh-source-deck/INSIGHT.md#research-q01)

> **思考**：可复查的选择过程是否包含可信资料决定技术选型价值。scope-policy明确不自行取元数据，Agent提交stars、license等，Host主要检查类型和按策略给非阻断标记。快照保存的是当时内容，能阻止后续改判悄悄改变引用，却不能证明URL、许可证、活跃度或研究判断正确。不能把筛选排序界面当独立代码审计。[Q02](../../plugins/archaofan--dsh-source-deck/INSIGHT.md#research-q02)

> **建议**：由不可变选择与未核实元数据的落差，可推导未验证的候选证据账本：每个判断保留获取URL、时间、版本和原始片段，区分模型推断与已核事实，引用时携带证据缺口。对同组真实与伪造候选比较用户选型准确率、复核时间和模型预算；若只是加表单但不能降低错误选择或负担过高，则否定其价值。[Q04](../../plugins/archaofan--dsh-source-deck/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/archaofan--dsh-source-deck/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nagi-ovo/dsh-visualize) [![npm 30d 4,553](https://img.shields.io/static/v1?label=npm+30d&message=4%2C553&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-visualize) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-visualize)

> **用途**：面向参数探索、解释和UI原型，将独立HTML制作搬进DSH对话，合格结果是正确交互与可重放修订。见[Q01](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q01)。

> **亮点**：把生成、修订、隔离展示、重放与用户继续提问接成对话内闭环，并有有限自修复循环；模型内容和浏览器/CDN库能力不算原创。见[Q01](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q01)、[Q02](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q02)。

> **思考**：可见与可交互不等于公式或解释正确，lint/修复有范围；本机state、已开page更新、素材策略和CDN仍有限制，不能当生产应用或完整安全保证。见[Q02](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q02)至[Q05](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q05)。

> **建议**：把数据、单位、公式和边界断言独立绑定到交互卡，检验是否减少误导而不过度增加核验成本。见[Q06](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/nagi-ovo--dsh-visualize/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1085086903-root"></a>

## [EverOS](../../plugins/evermind-ai--everos/INSIGHT.md)

[![GitHub ★ 13,732](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13%2C732&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/EverOS)

> **用途**：为 Agent 或应用引入跨会话记忆的开发者，通过本地服务写入并检索记忆；DSH 插件为独立仓库。[Q01](../../plugins/evermind-ai--everos/INSIGHT.md#research-q01)

> **亮点**：把记忆提取、可读 Markdown、后台索引与查询接入同一服务；不能把 DSH 外部插件、模型或数据库归因于本仓。[Q01](../../plugins/evermind-ai--everos/INSIGHT.md#research-q01) [Q03](../../plugins/evermind-ai--everos/INSIGHT.md#research-q03)

> **思考**：异步索引与生成记忆是否足够准确、及时且可恢复，收益能否覆盖模型和维护成本？[Q02](../../plugins/evermind-ai--everos/INSIGHT.md#research-q02) [Q04](../../plugins/evermind-ai--everos/INSIGHT.md#research-q04)

> **建议**：假设向调用者暴露逐记忆索引可见性水位可减少已保存但不可搜索的误判；对照注入延迟时的误判、等待与维护成本，不改善则否定。[Q05](../../plugins/evermind-ai--everos/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/evermind-ai--everos/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334384058-root"></a>

## [Free Search](../../plugins/dddmuc--dsh-free-search/INSIGHT.md)

[![GitHub ★ 770](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=770&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DDDMUC/dsh-free-search) [![npm 30d 68,731](https://img.shields.io/static/v1?label=npm+30d&message=68%2C731&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search)

> **用途**：需要在 DSH Agent 会话中检索并核对网页出处的用户，按配置使用多个搜索来源与正文研究工具。[Q01](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q01)

> **亮点**：将多源路由、失败分类、缓存和证据整理接到 DSH，而非创造各上游搜索索引。[Q01](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q01) [Q02](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q02)

> **思考**：额外来源、回退和正文整理能否在可接受的外发数据、费用与维护成本下提高可核验结果？[Q03](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q03) [Q04](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q04)

> **建议**：假设按已验证来源质量与额度调整并发可提升固定预算下的有效来源覆盖；用相同查询集比较现有策略，若覆盖不改善或成本与错误增加则否定。[Q05](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/dddmuc--dsh-free-search/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1014729376-root"></a>

## [MemOS](../../plugins/memtensor--memos/INSIGHT.md)

[![GitHub ★ 12,203](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12%2C203&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MemTensor/MemOS)

> **用途**：开发 Agent 的用户希望跨会话召回上下文，可选 Python 服务、本地 DSH 适配或独立云端插件。[Q01](../../plugins/memtensor--memos/INSIGHT.md#research-q01)

> **亮点**：连接记忆核心、DSH 生命周期、限时召回和后台捕获，不能将基础模型、数据库或宿主归功于本仓。[Q01](../../plugins/memtensor--memos/INSIGHT.md#research-q01) [Q02](../../plugins/memtensor--memos/INSIGHT.md#research-q02)

> **思考**：记忆能否在可接受的隐私、时延和维护成本下准确且可恢复，而不把陈旧信息误作事实？[Q03](../../plugins/memtensor--memos/INSIGHT.md#research-q03) [Q04](../../plugins/memtensor--memos/INSIGHT.md#research-q04)

> **建议**：假设注入前展示出处与过期风险并提供纠正可减少陈旧记忆错误；固定任务对照错误、覆盖与人工成本，不改善则否定。[Q05](../../plugins/memtensor--memos/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/memtensor--memos/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1153190876-root"></a>

## [MemSearch](../../plugins/zilliztech--memsearch/INSIGHT.md)

[![GitHub ★ 2,814](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C814&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch)

> **用途**：面向需要跨 Markdown 文件用不同措辞查找资料、能回读原文的用户。

> **亮点**：[Q02](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q02) 组合文件来源、增量索引与混合检索；embedding、BM25 和 RRF 本身是既有方法。

> **思考**：[Q03](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q03) stale 旧块先删，随后 embedding 或 upsert 失败时索引可能暂缺，报告必须与结果一起核查。

> **建议**：[Q06](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q06) 提议隔离新版本并在完整写入后切换可见范围；后端原子性和成本需要验证。

[查看完整分析](../../plugins/zilliztech--memsearch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1153190876-plugins-dsh"></a>

## [MemSearch DSH](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md)

[![GitHub ★ 2,814](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C814&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch) [![npm 30d 3,948](https://img.shields.io/static/v1?label=npm+30d&message=3%2C948&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh)

> **用途**：面向需要跨 DSH 会话回查项目历史且能核对来源的用户。

> **亮点**：[Q02](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q02) 将宿主生命周期、日记和按需 Skill 连接；根检索算法不属子包原创。

> **思考**：[Q03](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q03) 摘要失败仍生成 anchor，重放去重不保证自动修复；根索引失败也可能暂缺块。

> **建议**：[Q06](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q06) 对失败占位做版本检查后定向补摘要并重建索引，需验证并发、误覆盖和成本。

[查看完整分析](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333986968-root"></a>

## [meow-memory](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md)

[![GitHub ★ 342](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=342&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Phant0Meow/dsh-meow-memory) [![npm 30d 20,717](https://img.shields.io/static/v1?label=npm+30d&message=20%2C717&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-memory) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-memory)

> **用途**：希望跨会话复用项目事实的 DSH 用户；基线是人工笔记与显式检索。[Q01](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q01)

> **亮点**：将项目记忆、压缩后重注入和外部库信任门接入宿主；效果与节时未对照。[Q01](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q01) [Q02](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q02)

> **思考**：注入失败会放行无记忆的原消息；信任来源不保证事实准确或以后无污染。[Q02](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q02) [Q03](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q03)

> **建议**：未验证假设：显示来源、项目、确认时间及失败状态可减少误用；须比较现有信任门与人工笔记。[Q05](../../plugins/phant0meow--dsh-meow-memory/INSIGHT.md#research-q05)

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

<a id="plugin-1162230313-root"></a>

## [Mnemon](../../plugins/mnemon-dev--mnemon/INSIGHT.md)

[![GitHub ★ 680](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=680&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mnemon-dev/mnemon)

> **用途**：Agent 使用者可跨会话保存项目事实、偏好与决策，并用图关系和意图召回找回相关上下文。

> **亮点**：[Q01](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q01) 和 [Q02](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q02) 将模型的关系判断与本地确定性存储分开，相似候选只作提示，字节相同才跳过写入。图检索有明确既有方法参照，贡献是 CLI、监督流程与事务边界的组合，不宣称算法首创。

> **思考**：[Q03](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q03) 持久保存不保证事实正确，关系仍需模型复核；容量策略虽有保护期、关闭选项和裁剪回执，完整关系恢复尚未核实。根 DSH bundle 另依赖外部 latest 包，不能把本提交当完整 DSH 验证。

> **建议**：[Q05](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q05) 提出固定副本的只读回放评估假设，区分检索质量与访问计数对保留策略的反馈。现有只读和裁剪回执已存在，增量是组合为评估协议，尚未验证能否减少采用误判。

[查看完整分析](../../plugins/mnemon-dev--mnemon/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1163808542-root"></a>

## [ModSearch](../../plugins/liustack--modsearch/INSIGHT.md)

[![GitHub ★ 898](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=898&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liustack/modsearch) [![npm 30d 47,908](https://img.shields.io/static/v1?label=npm+30d&message=47%2C908&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch)

> **用途**：面向在 DSH 对话中检索外部信息并核查页面的用户。

> **亮点**：[Q01](../../plugins/liustack--modsearch/INSIGHT.md#research-q01) 和 [Q02](../../plugins/liustack--modsearch/INSIGHT.md#research-q02) 显示多引擎搜索接入 DSH，同时提供 X 与页面读取；没有独立对照证明更强。

> **思考**：[Q03](../../plugins/liustack--modsearch/INSIGHT.md#research-q03) 与 [Q04](../../plugins/liustack--modsearch/INSIGHT.md#research-q04) 显示不同 DSH 输出保留的路由信息不同，代理和云路径存在限制，不能将私网防护当作全面隔离。

> **建议**：[Q06](../../plugins/liustack--modsearch/INSIGHT.md#research-q06) 假设在 web 和 X 输出增加由实际尝试记录生成的统一脱敏路由摘要，可降低回退来源误识别；X 现有 source/status 不是新增，效果和宿主兼容尚未验证。

[查看完整分析](../../plugins/liustack--modsearch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1259108597-packages-dsh-plugin-molio"></a>

## [Molio DSH 知识库插件](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md)

[![GitHub ★ 442](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=442&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhuzhaoyun/Molio) [![npm 30d 522](https://img.shields.io/static/v1?label=npm+30d&message=522&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-molio) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-molio)

> **用途**：已有Molio资料用户在DSH做研究/写作/问答。

> **亮点**：[Q01](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md#research-q01)把已有daemon只读能力以五个原生DSH工具接入，减少资料切换。

> **思考**：[Q02](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md#research-q02)、[Q03](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md#research-q03)active库可漂移，只读不等内容不外发；远程需独立访问控制，force不是token预算。

> **建议**：[Q04](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md#research-q04)会话固定vault/来源版本收据可探索，须先与现有显式id比较，无差异则否定。

[查看完整分析](../../plugins/zhuzhaoyun--molio--packages-dsh-plugin-molio/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1128123594-examples-dsh-memory-plugin"></a>

## [OpenViking DSH 记忆插件](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md)

[![GitHub ★ 41,264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41%2C264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking) [![npm 30d 35,062](https://img.shields.io/static/v1?label=npm+30d&message=35%2C062&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)

> **用途**：已有 OpenViking 服务并愿意管理隐私和留存的 DSH 用户，希望跨会话复用项目背景。[Q01](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q01)

> **亮点**：把 DSH 生命周期、工作区 peer、合成消息过滤与可重试待发恢复组合；服务端存储和记忆提取归 OpenViking，不归功于适配器。[Q01](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q01) [Q02](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q02)

> **思考**：会话不中断不等于记忆完整或停止外发：关闭采集与常驻 drainer 的行为不同，TTL、非可重试失败和后台提取均需单独核对。[Q02](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q02) [Q03](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q03)

> **建议**：未验证假设：用户授权后分别显示本地待发、永久失败和根服务后台提取状态，可能降低静默缺失；对照现有日志和 task 回执测误报、识别率与隐私成本。[Q05](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-849121458-root"></a>

## [ReMe](../../plugins/agentscope-ai--reme/INSIGHT.md)

[![GitHub ★ 3,730](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C730&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentscope-ai/ReMe)

> **用途**：面向需要跨会话查找和维护资料的 Agent 开发者。

> **亮点**：[Q02](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q02) 组合可读文件、关键词和可选向量检索；成熟 RRF 和 BM25 不是新算法。

> **思考**：[Q03](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q03) 成功回执在执行后写入，崩溃窗口可能重复更改；排名和来源链接不验证事实。

> **建议**：[Q06](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q06) 提议在采用记忆前显示近期冲突及来源，高影响事项要求用户判断；须对照已有筛选和溯源验证。

[查看完整分析](../../plugins/agentscope-ai--reme/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-849121458-integrations-dsh"></a>

## [ReMe DSH 集成](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md)

[![GitHub ★ 3,730](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C730&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentscope-ai/ReMe) [![npm 30d 2,944](https://img.shields.io/static/v1?label=npm+30d&message=2%2C944&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@agentscope-ai/reme-dsh-plugin) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@agentscope-ai/reme-dsh-plugin)

> **用途**：面向需要跨 DSH 会话检索历史且能审核保存内容的用户。

> **亮点**：[Q02](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q02) 接入 DSH 搜索与事件，[Q03](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q03) 使用本地 outbox 跨短暂服务故障；检索和记忆质量属于根服务及模型。

> **思考**：[Q03](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q03) 根服务在执行后才写成功回执，崩溃窗口尚不能保证恰好一次；[Q02](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q02) 截断轮次也可入队。

> **建议**：[Q06](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q06) 为截断轮次保留结束原因并要求复核，须对照现有事件筛选和根服务去重检验效果。

[查看完整分析](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1315919904-root"></a>

## [SandBase Skills](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md)

[![GitHub ★ 206](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=206&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sandbaseai/sandbase-skills)

> **用途**：需要复用研究工作流的Agent用户可按具体任务选择Skill；本次聚焦multi-source-search，不把目录数量当全部能力或质量证明。

> **亮点**：[Q01](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q01)、[Q02](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q02) 规范Skill源与多端包装分离，样本将有限检索、共同来源溯源与账本校验集成，便于复用研究流程。仅样本与分发机制已核查，不从245条声明推全库效果。

> **思考**：[Q03](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q03) validator只核声明与内部关系，不验证网页真实性、共同origin或引文支持；不同URL与自报独立数仍可语义失真。[Q02](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q02) force先删旧目录再复制，remove删全目录，不保证本地修改恢复。

> **建议**：[Q05](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md#research-q05) 未验证假设是对账本抽样做独立语义回源，记录引用支持和origin错误，比较现有流程的漏判与新增成本；已有溯源提示不能重复算新贡献。

[查看完整分析](../../plugins/sandbaseai--sandbase-skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1238532570-root"></a>

## [Stock Analysis Plugin](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md)

[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Weaxs/stock-analysis-plugin) [![npm 30d 1,631](https://img.shields.io/static/v1?label=npm+30d&message=1%2C631&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@weaxs/stock-analysis-plugin) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@weaxs/stock-analysis-plugin)

> **用途**：已有固定历史资料的研究者可调用同一套工具复查行情与模拟结果。

> **亮点**：用共享 Python 层保持跨宿主入口，并把工具发现与成本假设明确分层。见 [Q01](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md#research-q01)、[Q02](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md#research-q02)。

> **思考**：模拟费用和时点可审阅，真实行情口径及复权仍须独立核对。见 [Q02](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md#research-q02)、[Q03](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md#research-q03)。

> **建议**：用同一历史样本对照插件与手算，检查交易序列、费用和核对人时。见 [Q04](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/weaxs--stock-analysis-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1329972465-root"></a>

## [StrataGate AgentMemory](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md)

[![GitHub ★ 112](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=112&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/diqierjia/StrataGate-AgentMemory) [![npm 30d 8,539](https://img.shields.io/static/v1?label=npm+30d&message=8%2C539&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/stratagate-dsh) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/stratagate-dsh)

> **用途**：需要在长期项目中查找较早对话证据的用户。

> **亮点**：[Q01](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q01) 把分层记忆与可查询历史接到 DSH。

> **思考**：[Q02](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q02) 画像共享、后台模型输入及评测归因需分别判断。

> **建议**：[Q04](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md#research-q04) 历史指代触发可能减少漏检。

[查看完整分析](../../plugins/diqierjia--stratagate-agentmemory/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 1,220](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C220&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Miaotofu01/Study-Mate) [![npm 30d 6,194](https://img.shields.io/static/v1?label=npm+30d&message=6%2C194&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunmiao/studymate) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunmiao/studymate)

> **用途**：数学计算机自学者按前置知识推进课程并保存练习；最终标准是独立迁移任务，不是课件生成量。[Q01](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q01)

> **亮点**：把自由聊天改为文件化课程、阅读作答和跨会话进度，工具分域约束支撑协作；并不证明教学正确或比教材更有效。[Q01](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q01) [Q02](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q02)

> **思考**：格式通过与进程退出不能代替学习掌握；实验路径guard非OS沙箱，不可信代码仍以宿主身份执行；现版不承诺旧平台支持。[Q03](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q03)

> **建议**：未验证方向是以延迟复测及未见迁移题推进学习进度，在同教材预算下比最终学习质量及全成本。[Q05](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/miaotofu01--study-mate/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1274335260-root"></a>

## [Tydora](../../plugins/zuorn--tydora/INSIGHT.md)

[![GitHub ★ 227](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=227&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zuorn/Tydora)

> **用途**：本地Markdown写作者希望在一个桌面中编辑、组织和导出笔记；基线是文本编辑器或Typora/Obsidian及发布工具。合格交付是可读正文/元数据/链接与正确导出，试用限定复制小库单writer。

> **亮点**：[Q01](../../plugins/zuorn--tydora/INSIGHT.md#research-q01) 将Markdown编辑、关系视图和CLI/MCP文件入口组合到本地库；[Q02](../../plugins/zuorn--tydora/INSIGHT.md#research-q02)提供可限只读的命令接口及GUI外部更新监听。主要增量是工作流整合，不把上游编辑器能力算原创，也不把DSH骨架当已注册工具。

> **思考**：[Q02](../../plugins/zuorn--tydora/INSIGHT.md#research-q02) dirty GUI缓冲忽略外部更新，随后直接写盘无expected版本，CLI原子rename不解决多writer覆盖。[Q03](../../plugins/zuorn--tydora/INSIGHT.md#research-q03)简化YAML、独立GUI/CLI逻辑与发布范围未知也限制迁移，不能因本地文件和badge承诺无损协作。

> **建议**：[Q04](../../plugins/zuorn--tydora/INSIGHT.md#research-q04)从dirty watcher与无版本save推导三版本冲突提示和保存前digest校验，可能降低GUI/Agent丢更新。复制文件三组反例计丢更新、误阻断、格式diff及恢复时间；无改善或总投入更高就否定，尚未实现不计贡献。

[查看完整分析](../../plugins/zuorn--tydora/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1024118326-packages-dsh-weknora"></a>

## [WeKnora DSH 插件](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md)

[![GitHub ★ 36,141](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C141&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora) [![npm 30d 5,698](https://img.shields.io/static/v1?label=npm+30d&message=5%2C698&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)

> **用途**：已维护 WeKnora 知识库的用户希望在 DSH 中检索资料并补读原文，减少在服务网页和宿主之间手动搬运。[Q01](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q01)

> **亮点**：把服务端检索、文档补读和综合问答接成可组合的 DSH 工具，保留文档定位和部分截断信息；检索算法及索引能力归根服务。[Q01](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q01) [Q02](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q02)

> **思考**：默认库不是白名单，缓存和降级空结果可能使范围或证据不清；分页结束不代表无裁剪，ask 还会写服务端会话。[Q03](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q03)

> **建议**：假设为 ask 引用补充逐条裁剪标志与补读提示，可减少片段被当成完整证据的误判；对照现有 search/read 标志及人工补读，测错误、token 和时间，收益不足则否定。[Q05](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1412897932-root"></a>

## [WeKnora 会话归档](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md)



> **用途**：希望把历史 DSH 会话用于内部检索的团队可评估归档。

> **亮点**：[Q01](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q01) 把会话摘要和解析观察串联。

> **思考**：[Q03](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q03) 未匹配库时 dry run 仍可创建知识库。

> **建议**：[Q05](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q05) 验证预览的零写入条件。

[查看完整分析](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1024118326-root"></a>

## [WeKnora 知识平台](../../plugins/tencent--weknora/INSIGHT.md)

[![GitHub ★ 36,141](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C141&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora)

> **用途**：维护组织资料并按角色查找知识的团队需要把资料、权限和可核查回答连接；根项目是知识平台而非 DSH 原生插件。[Q01](../../plugins/tencent--weknora/INSIGHT.md#research-q01)

> **亮点**：将知识库权限、跨库向量空间与多个检索结果的融合接线组织在一起；模型、数据库和 RRF 本身不属于该项目原创。[Q02](../../plugins/tencent--weknora/INSIGHT.md#research-q02) [Q03](../../plugins/tencent--weknora/INSIGHT.md#research-q03)

> **思考**：权限检查和分数归一能否在目标语料、角色和服务故障下产生正确且可追溯的回答？归一分数不是相关性概率，无可检索管线时空结果也不证明资料不存在。[Q02](../../plugins/tencent--weknora/INSIGHT.md#research-q02) [Q03](../../plugins/tencent--weknora/INSIGHT.md#research-q03)

> **建议**：假设按审核过的资料类型与查询结构选择权重并记录策略版本，可改善弱类召回；对照默认权重及单检索，在留出集检查最差类别、引用和人工成本，无改善或越权即否定。[Q05](../../plugins/tencent--weknora/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/tencent--weknora/INSIGHT.md) · [返回表格](#category-index)

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

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-11-05
