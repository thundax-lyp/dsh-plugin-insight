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
| [@y9931666/dsh-plugin-crossfire](#plugin-1399279897-root) | 按维度拉起红队评审成果，汇集候选缺陷，由用户逐条认定或驳回并保存复审历史。 | 当前先观察；确认目标profile硬只读和Web访问边界后再对非关键成果试用，逐条复现缺陷并计实际模型与人工成本。 |
| [@zzerx/dsh-plugin-memory](#plugin-1363429979-plugin-memory) | 提供全局/项目记忆库、九工具、自动提炼与注入、原文审计、实体关系及可视化管理。 | 先观察；无敏感库关autoCapture/autoInject，手工条目与独立profile对照，重要约定保留原始指引。 |
| [AgentKey](#plugin-1218688296-root) | 提供统一外部数据服务的 Agent Skill、安装脚本与托管 MCP 接入配置。 | [Q04](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q04) 先固定外部CLI和宿主，在隔离profile验证完整调用与费用；当前保持观察。 |
| [Answer me with HTML](#plugin-1401476500-root) | 将Agent撰写的扩展Markdown转换为含图表的单文件HTML页面，并提供可选视频输出。 | 需要在协议或方案比较中交付单页材料的用户，可先选一份已有答案的短稿试渲染，并逐个核对图形关系与原文。 |
| [AnySearch for DSH](#plugin-1333247282-root) | 在 DSH 原生网页搜索与抓取接口接入 AnySearch，并提供垂直检索和有限并发批量搜索。 | [Q04](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q04) 非敏感问题先比原provider与批量结果，以有效引用而非命中数决定继续；限流或缺证回人工。 |
| [Archify](#plugin-1211139949-root) | 将需求、代码关系和解释内容组织成交互式图表及单页 HTML。 | 先选一条熟悉的请求链，检查关系、来源与HTML交付，再决定扩大；无法承担源码复核时先保留简单图。 |
| [Awesome DeepSeek Harness](#plugin-1330942675-root) | 按场景分类整理 DSH 插件、工具和基础设施，并提供生成的仓库目录。 | 建议作为发现资源试用：按场景挑少量候选后固定目标版本核查；不可访问或过时条目退回原仓库及公开搜索，不批量安装。 |
| [Awesome DeepSeek Harness Plugins](#plugin-1333171737-root) | 按能力分类整理 DSH 公开插件与扩展，并提供仓库、Star 与引用网页链接 | [Q03](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md#research-q03) 只读试用候选发现；目录条目必须回目标固定源码核实，无法核实时停止将该项当推荐。 |
| [ClearAI](#plugin-1367299537-root) | 为 DSH 提供以问题、证据、独立评估和领域本体组织研究的 Agent 预设。 | [Q04](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q04) 在固定材料与可反驳问题上试用，保留人工复核，用错误结案及全部费用决定是否继续。 |
| [Distilly](#plugin-1195828337-root) | 从消息、文档、访谈等材料提炼人物工作方法与表达偏好，并生成可复用的 Agent Skill。 | 有合法材料并愿意逐条复核的用户，可用自己的非敏感工作资料试做一个小档案，再用未参与生成的问题检验；先关注工作事实与建议是否准确，而不是说话像不像。 |
| [DSH Local Memory](#plugin-1390103795-root) | 保留Hindsight项目分库，提供跨库查询、项目记忆状态总览与Git历史播种入口。 | 已有稳定daemon且库名唯一的多项目用户可试用，先显式指定少数库并核对事实；强隔离或同名项目应暂缓跨库汇总。 |
| [DSH PDF Reader](#plugin-1346064150-root) | 提供PDF内容扫描、单页文本与图像混合读取，以及区域渲染工具。 | 适合已经有Python环境且经常读图表论文的人在非关键材料上小范围试用。 |
| [dsh-anchored-monitor](#plugin-1337467566-root) | 对 DSH reasoning 流做词形波段监控，独立进程可自动中断并重置会话。 | 仅隔离 profile 显式关闭干预，先回放验证代理指标；真实使用前需默认只读、身份鉴权及人审。 |
| [dsh-codevault](#plugin-1359423472-root) | 把源码阅读认识按仓库/文件/符号合并为Markdown对象卡，以JSONL保存条目并可选关联本地vault。 | 单人单写者独立备份档案可试用，vaultDir先不配置；广泛vault读取前优先修边界。 |
| [dsh-fact-check](#plugin-1380181057-root) | 提供多源公开事实核查流程、来源路由和可选Jev判据，生成带原文定位的报告。 | 先选可对照原始资料的事实点，确认正文链可用，再人工核对转载关系及每条引文后试用；不要把模型判据作为最终裁定。 |
| [dsh-feed](#plugin-1336585522-root) | 聚合 GitHub dsh-plugin topic 与 npm keyword 的本地 JSON 索引，供工具、CLI、MCP 查询。 | 隔离工作区试同步，审阅来源与错漏；search 只做候选检索，详见[Q03](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q03)。 |
| [dsh-free-search](#plugin-1334384058-root) | 为 DSH 接入多种网页搜索引擎，提供动态切换、失败回退与多源检索。 | [Q04](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q04) 从一个免key源和一个回退开始，比人工搜索的有效引用与总尝试；不要默认大规模并发。 |
| [dsh-handbook](#plugin-1333258936-root) | 提供DeepSeek Harness中文学习路径、配置示例、插件开发案例与生态观察材料。 | 初学者可作为中文导航阅读，选一个小目标在独立目录练习；版本、权限和配置与对应官方资料交叉核对；需要当前产品比较或生产安全结论时不要只依赖本手册。 |
| [dsh-insight](#plugin-1336649545-root) | 用需求匹配、环境配方、健康评分、静态安全扫描与统一 verdict 辅助选择 DSH 插件。 | 适合插件研究者把它当候选筛选和审计线索观察，不应直接驱动生产安装。 |
| [dsh-ledger-memory](#plugin-1412857520-root) | 管理项目台账、决策目标经验卡、活动日志、压缩原文指针与跨会话交接。 | 先在可备份的V3非关键项目核对写入、授权、stage和压缩回读；定期人工比较记忆与实际工作区，出现审计或文本缺口即暂停自动依赖。 |
| [dsh-literature](#plugin-1351375738-root) | 在DSH侧窗识别学术文献、获取元数据和全文，提供PDF阅读、引用、笔记及本地库和目录保存。 | 先观察。 |
| [dsh-ls125-uv-probe](#plugin-1381989584-root) | 把 LS125/UVALED-X3 私有 UART 读取协议、抓取分析工具及 F103 参考固件注册成 DSH 技能。 | 只读轮询与离线抓取先行，清零单独审批；在独立仪表/标准光源下复核后才上生产设备。 |
| [dsh-math-olympiad](#plugin-1344714964-root) | 挂载竞赛数学解题 Skill，要求独立验证证明、诚实弃权，并可选编译 PDF。 | 已有可信 subagent 与 DSH base 的团队可隔离试题，逐题核验证器入参、标准解与弃权；详见[Q03](../../plugins/988hj7tczd-oss--dsh-math-olympiad/INSIGHT.md#research-q03)。 |
| [dsh-mnemon](#plugin-1329424520-root) | 为 DSH 组合运行记忆、项目文档和长期记忆来源，并提供每回合查看与管理界面。 | [Q05](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q05) 只启用本地来源，用虚构项目验证保存、读取、纠错及禁用，保持手工文件参照；第三方Provider和Git同步先关闭。 |
| [dsh-moli](#plugin-1415767842-root) | 将本地 Moli 无头浏览器接入 DSH，提供渲染抓取、选择器读取、截图、PDF与引擎探测。 | 建议观察；先在隔离宿主准备已审引擎并设严格TLS，核对公开页面与退出；敏感登录、共享宿主和高可信取证应暂缓。 |
| [dsh-obsidian-board](#plugin-1415116420-root) | 在DSH三栏面板以本地BM25检索Obsidian笔记，复用宿主模型流式回答、点引用读源并保存回答。 | 先观察，非敏感可信个人库和限定模型通道对照。 |
| [dsh-plugin-academic-writing](#plugin-1336663456-root) | 为DSH提供论文骨架、题目摘要模板、引用和LaTeX片段，以及词法表达、Markdown结构、术语和投稿清单辅助。 | 观察，先修计数/无作者引用/TeX列等基础分支，只当草稿工具，不作学术或投稿验收。 |
| [dsh-plugin-audit](#plugin-1336223158-root) | 同步 GitHub topic/npm 元数据并评分排行，按需对单插件做有限静态安全扫描。 | 只把分数作线索，确认扫描文件覆盖/错误状态后再读固定 SHA 源码、验证安装；详见[Q03](../../plugins/863683348--dsh-plugin-audit/INSIGHT.md#research-q03)。 |
| [dsh-plugin-finance-data](#plugin-1336663504-root) | DSH Agent 的确定性金融算术工具，但比率文本、跨年定投和组合再平衡路径存在可核不一致。 | 修复关键路径前不用于真实决策；以 10/100 比率、2 年月投和组合偏离样本验每个 action。 |
| [dsh-plugin-tavily](#plugin-1334654243-root) | 接管 DSH web_search 的 Tavily provider，并提供可选提取服务、设置卡和主机探测路由。 | 待修复缓存与 keyless；需用真实凭据在受控 Profile 验证搜索/提取/回退及 API 权限；详见[Q03](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md#research-q03)。 |
| [dsh-plugin-verify](#plugin-1336684054-root) | 通过关键词行号、JSON/YAML检查、URL/npm/GitHub探测及有界批量输出，提供核查线索和元数据。 | 先观察，作线索而非证实/安全通行证，先修证据语义/覆盖与网络范围再评估。 |
| [dsh-read-url](#plugin-1335047324-root) | 读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。 | 适合用公开网页查资料并愿意核对原来源的人在独立profile试用，先明确提供方缺失时的网络回退权限，默认不加直连例外；缺页、政策误绕过或预算失控时停用。 |
| [dsh-sciwork](#plugin-1416950630-root) | 提供科研Agent、文件资料库、文献期刊档案、绘图适配和投稿工作台。 | 先用副本课题验收导入、计划确认和回执，组织功能限定试用；投稿包逐文件及逐引文复核，遇写超时先查实际状态。 |
| [dsh-scrape-webpage](#plugin-1334269686-root) | 抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。 | 适合公开、无需登录且正文可抽查的研究页面小范围试用；登录态、强脚本渲染或付费墙继续使用宿主浏览器。 |
| [dsh-search](#plugin-1423253220-root) | 以 DeepSeek Search/Fetch API 提供检索、正文抓取和多页研究工具。 | 可用公开、非敏感查询小范围试用；先设 count/N 上限并以 100 个查询对照内置搜索的召回、正文成功率与实际账单。 |
| [dsh-source-deck](#plugin-1422910686-root) | 在会话侧栏后台查找资料，筛选和对比候选，并把保留项的不可变快照引用到当前草稿。 | 在明确支持的RC环境用非敏感选型任务试用，先检查搜索/抓页/spawn可用，再核实候选URL和关键许可。 |
| [dsh-stock-market](#plugin-1331846104-root) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。 |
| [dsh-tavily-web](#plugin-1369301269-root) | 提供 Tavily 多密钥轮询检索工具，以及通过宿主 shell 的 curl 网页正文抓取工具。 | 在不含敏感查询的固定任务集试用，先限制凭据数与调用预算，核对返回URL、网页状态和正文。 |
| [dsh-teaching-board](#plugin-1358319839-root) | 在 DSH 会话中展示 HTML 板书，支持圈画、方向选择及把截图作为图片消息回传。 | 先观察并补齐消息来源和提交确认，再以非敏感课程在隔离 profile 检查四工具、增量更新和截图反馈；成功需图片进入正确会话且不覆盖用户草稿。 |
| [dsh-thoughtdag](#plugin-1160354976-dsh) | 将 DSH 会话嵌入 ThoughtDAG 画布，并提供历史检索、上下文注入和会话继续接口。 | 首次需匹配Node/DSH及十余宿主服务，npm包应带生成SPA、why库和runtime；源码方式另外构建父项目。 |
| [dsh-trend-radar](#plugin-1336582509-root) | 按需采集 GitHub dsh-plugin topic/awesome 快照并生成趋势报告、关键词雷达和实验性 Web 面板。 | 先隔离建立空目录并复核首轮成功，再核查报告采样分母与类别映射；勿把 top100 榜当全生态。 |
| [dsh-ultramath](#plugin-1337487779-root) | 同步数模竞赛主控/角色预设、模型库与论文模板。 | 只在备份同名 DSH 目录的隔离 profile 试点；按题目核数据、模型、数值和论文，不以提示门禁代替独立验收。 |
| [dsh-web-tools](#plugin-1335219884-root) | 为DSH提供多供应商网页搜索与抓取，以及小红书和X浏览器来源接入。 | 建议在可信本机、公开材料和小预算下试用，逐项回原文验收并记录全部尝试成本。 |
| [dsh-weknora-archive](#plugin-1412897932-root) | 提取、摘要、去重并上传DSH会话到WeKnora知识库，补充官方只读检索插件的写入侧。 | 已自建WeKnora且能接受内容外发者可观察，先用脱敏样本验证筛选、删除、重试和重复归档边界。 |
| [dsh-wsl-obscura](#plugin-1358313559-root) | 从 WSL 调用 Obscura 无头浏览器的 status/fetch 工具，并提供 MCP 接线提示。 | 先 status 后公开 URL 样本 fetch，私网防线按 Obscura 版本独立验；交互用 MCP。 |
| [dsh-wsl-obsidian](#plugin-1380817560-root) | 给 WSL 中的 DSH Agent 提供 Windows Obsidian 笔记库的状态、检索、读写和桌面打开工具。 | 建议观察，在测试 vault/备份副本先核 status、读写新文件和 Windows 显示；重要共享库暂不自动覆盖。 |
| [dsh-wsl-playwright](#plugin-1381860363-root) | 在 WSL 经 npx 启动无头 Chromium，读取 URL 标题、状态或正文。 | 观察。 |
| [dsh-wsl-vecmem](#plugin-1381726438-root) | 用本地 Ollama embedding 保存短文本，并按工作区进行语义检索。 | 适合少量、非敏感、可重建的项目碎片先观察；需要事务、并发写、强隔离或不可丢数据的团队应使用成熟存储。 |
| [EverOS](#plugin-1085086903-root) | 以Markdown为真相源的本地优先记忆运行时，同步SQLite/LanceDB索引并支持用户与Agent记忆。 | 有限试用单用户非敏感记忆，先关reflection测人工笔记基线，再验证纠错、删除、重建与断连；DSH适配单独验收。 |
| [GLM-5.3-Flash J-Space能力报告](#plugin-1335867536-root) | 介绍J-Space选择性加载、任务状态记录与恢复协议，并汇总作者报告的基准估计。 | 长任务Agent研究者可阅读报告并提取状态外化与恢复的验证问题；先取得原始套件固定提交和任务级数据，不把README安装指令当作本仓库已提供实现；关键材料未补齐前仅观察。 |
| [Graph Memory](#plugin-1178312395-root) | 为 DSH 和 OpenClaw 压缩历史上下文，以图与向量导航召回原始问答并持久保存记忆。 | [Q04](../../plugins/adoresever--graph-memory/INSIGHT.md#research-q04) 个人非敏感任务用副本库对照；审计或多租户任务先保留原历史并验证隔离。 |
| [KRouter](#plugin-1341648244-root) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | 有条件试用lookup-only。 |
| [last30days-cn](#plugin-1196982492-root) | 检索近期中文平台讨论并聚合热榜，输出带来源的研究报告。 | [Q04](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md#research-q04) 适合可接受非完整样本的线索研究，先核查每源状态与抽样链接；不适合未经补证的总体舆论比例或事实定论。 |
| [Learn Harness Engineering](#plugin-1195243030-root) | 项目式编码 Agent 工程课程，提供状态、验证、范围与跨会话恢复教材、示例和脚手架 Skill。 | 适合已经遇到跨会话丢状态或提前报完成的开发者，先选一个真实失败，在项目副本上加入最少文件，并用相同任务比较前后。 |
| [Memmy Agent](#plugin-1302496224-root) | 提供本地优先的跨 Agent 记忆服务、桌面与 CLI 入口，并通过适配接力项目上下文。 | 先观察并画清具体配置的数据流/退出方案，非敏感小样本核来源与纠错后再决定接入。 |
| [MemOS](#plugin-1014729376-root) | 面向 LLM 与 Agent 的记忆管理平台，提供云、自托管及本地插件，支持长期记忆存取与管理。 | 有重复跨会话记忆需求且能审核内容的开发者，可先在独立profile、非敏感数据和固定模型路由上试用。 |
| [MemOS Local Memory](#plugin-1014729376-apps-memos-local-plugin) | 为DSH、OpenClaw和Hermes提供本地记忆、后台采集、分层检索及可选经验演化。 | [Q08](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q08)建议已有稳定DSH和可备份本地状态的开发者先试轻量跨轮召回。 |
| [MemSearch](#plugin-1153190876-root) | 面向Markdown知识库提供语义检索、混合搜索、增量索引、文件监听与多Agent接入。 | [Q05](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q05)建议已有Markdown且能管理Python/provider和索引的开发者，在独立collection用小语料比较语义与精确问题，打开原文核对并检查failed_files。 |
| [MemSearch DSH](#plugin-1153190876-plugins-dsh) | 为DSH接入共享Markdown记忆、会话摘要、检索注入、记忆Skill及候选评审面板。 | 采用结论为有界试用。 |
| [Mimir](#plugin-1340749561-root) | 在 DSH 中组织文献、论文 LaTeX、实验、图表、组会与远程任务的研究工作台 | [Q04](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q04) 从本地论文副本编译试用，不自动启用全生命周期。 |
| [MindMemOS](#plugin-1278033467-root) | 提供长期记忆服务、检索与写入接口，并通过CLI和Agent插件共享跨会话记忆。 | 有记忆服务运维能力且有跨任务复用需求的团队可用非敏感双用户样本试用；先核对身份、最终写回和错误恢复；若混用范围与纠错无法确认，继续明确的项目笔记或手动记忆。 |
| [Mnemon](#plugin-1162230313-root) | 为 Agent 提供由宿主模型监督的本地持久记忆、图关联、意图检索与生命周期管理 CLI。 | [Q04](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q04) 限定CLI副本库试用，不以本仓库提交当完整DSH兼容证明；错误关联或裁剪损失便回笔记。 |
| [ModSearch](#plugin-1163808542-root) | 为 DSH 和其他编码 Agent 提供多引擎网页搜索、X 搜索和页面读取。 | [Q04](../../plugins/liustack--modsearch/INSIGHT.md#research-q04) 用公开小查询比较已有provider，逐条检查来源和uncertainty，不发送内部URL及秘密查询。 |
| [OpenViking](#plugin-1128123594-root) | 以虚拟文件系统组织 Agent 的知识、记忆与技能，提供分层读取、语义检索和会话沉淀。 | [Q06](../../plugins/volcengine--openviking/INSIGHT.md#research-q06) 建议可承担服务维护的知识团队试用，以可追溯原文和任务正确率验收；少量静态资料仍可用简单文件方案。 |
| [OpenViking DSH Memory](#plugin-1128123594-examples-dsh-memory-plugin) | 为 DeepSeek Harness 接入 OpenViking 的跨会话记忆、上下文检索和技能访问。 | [Q06](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md#research-q06) 建议已有服务的用户在脱敏仓库试用，先确认 peer 与纠错路径，再比较总负担；不把源码接线当作当前宿主运行通过。 |
| [ReMe](#plugin-849121458-root) | 以可编辑Markdown保存Agent长期记忆，提供自动提炼、混合检索和多种运行时接入。 | 可供愿意维护本地知识目录和模型服务的开发者在独立workspace试用文件记忆。 |
| [ReMe DSH集成](#plugin-849121458-integrations-dsh) | 为DSH提供长期记忆检索、会话自动归档、每日整理与状态页面。 | 适合愿意维护本地ReMe服务的人在虚构或非敏感项目上试用跨会话检索，先检查来源、队列和单调度者。 |
| [SkillCorpus](#plugin-1330431542-root) | 汇集、筛选和检索 Agent 技能，并提供多宿主接入与语料评估工具。 | [Q04](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q04) 建议源码构建团队先限制本地白名单和任务集，比较合格率、纠错和全部 token；不改善结果便恢复目录。 |
| [StudyMate](#plugin-1374986657-root) | 在 DSH 中组织课程大纲、课件、练习和项目，持久保存学习进度并提供阅读端。 | 建议已有DSH且能核教材的自学者限定一门小课试用，备份工作区并保留人工学习计划；发现内容错误或进度虚高则停自动推进，不跑不可信实验。 |
| [WeKnora](#plugin-1024118326-root) | 面向企业文档理解、混合检索和推理的知识框架，提供问答、智能体与知识整理入口。 | 有持续知识维护与运维能力的团队可用代表性语料受控试用，先固定部署版本并核对权限、引用与恢复；少量临时文件先比较简单搜索方案。 |
| [WeKnora DSH 插件](#plugin-1024118326-packages-dsh-weknora) | 为 DeepSeek Harness 提供 WeKnora 知识库检索、文档阅读及带引用的问答。 | 已有 WeKnora 的团队可先用受限库和 retrieve key 试用搜索、读文档，再决定是否开放 ask；核对会话保存和额外模型消耗。 |

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

<a id="plugin-1399279897-root"></a>

## [@y9931666/dsh-plugin-crossfire](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9931666/dsh-plugin-crossfire) [![npm 30d 737](https://img.shields.io/static/v1?label=npm+30d&message=737&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire)

> **用途**：给已有定稿成果的用户组织反方复核，候选缺陷仍需人工复现与裁定。

> **亮点**：将多Agent反方意见变成用户逐条裁决和可复审旧账，persona执行/展示同源并保存轮次，不等自动证明成果正确。[Q01](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q01)、[Q02](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q02)

> **思考**：0.2.1+ startActivation不带toolFilter、只读退为文字；缺Connection fence放行，body session比较非强授权；预算文本估算与转录/记账非事务。[Q03](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q03)、[Q04](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q04)

> **建议**：未验证方向是成果摘要+复现收据分层裁决、已验只读preset和连接身份能力授权，用真假缺陷/可写工具/故障矩阵检验误认定与总成本。[Q06](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1363429979-plugin-memory"></a>

## [@zzerx/dsh-plugin-memory](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,810](https://img.shields.io/static/v1?label=npm+30d&message=1%2C810&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory)

> **用途**：面向希望跨会话复用偏好与项目约定的 DSH 单用户。合格结果需作用域正确、错误可纠正、来源可回看；原文与关系图不自动保证事实正确。

> **亮点**：将原文、后台提炼/判定、记忆工具与scope注入/图谱管理接为跨会话流程。详见[Q01](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md#research-q01)。

> **思考**：本地存储不等离线提炼，项目全小写可串目录，模型scope默认global，合并/遗忘多副本非事务。详见[Q03](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md#research-q03)。

> **建议**：可研究待确认候选、身份/来源版本合并及全副本遗忘收据，以串项目和并发反例比较错召回与恢复。当前未验证。详见[Q06](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1218688296-root"></a>

## [AgentKey](../../plugins/chainbase-labs--agentkey/INSIGHT.md)

[![GitHub ★ 659](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=659&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chainbase-labs/Agentkey)

> **用途**：需要多个社媒或网页数据源的Agent用户，希望少管理账号与工具目录。

> **亮点**：[Q01](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q01) 与 [Q02](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q02) 支持把动态工具发现、参数确认与统一接入写成可复用操作规范；托管服务覆盖和统一计费增益仍是作者主张。

> **思考**：[Q02](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q02) 关键CLI和服务不在固定实现中，Mounted不能证明工具连接；[Q03](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q03) 预算规则属于指令约定，不能当服务硬额度。

> **建议**：[Q04](../../plugins/chainbase-labs--agentkey/INSIGHT.md#research-q04) 提出绑定工具版本、费用和调用回执的审查链，尚未验证；若仍无法复核来源与消费则否定。

[查看完整分析](../../plugins/chainbase-labs--agentkey/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1401476500-root"></a>

## [Answer me with HTML](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md)

[![GitHub ★ 4,422](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C422&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/QingYunA/answer-me-with-html)

> **用途**：面向让Agent解释协议、架构或多维比较的读者，目标是得到可打开、可携带的含文本和图表页面。原办法是直接读Markdown或让模型手写HTML；前者简单而可读性未必差，后者要生成重复布局代码。作者称由短草稿生成单文件能减少模型输出，但复杂内容是否更易理解需读者任务对照，不由漂亮页面证明。

> **亮点**：[Q03](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q03)识别出内容草稿与布局编译分离的组合贡献，相比模型手写HTML减少重复结构输出；成立条件是任务确需图表页面且内容完整，作者小样本不证明普遍节费。

> **思考**：[Q04](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q04)说明结构渲染与CSP都不校验解释是否正确，1/8输出token也非1/8全轮成本；内容核对仍由作者承担。

> **建议**：[Q08](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q08)提出未验证的图关系来源绑定，按错误关系发现率与审核负担对照，而非继续增加模板数量。

[查看完整分析](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333247282-root"></a>

## [AnySearch for DSH](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md)

[![GitHub ★ 663](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=663&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anysearch-team/anysearch-dsh) [![npm 30d 10,592](https://img.shields.io/static/v1?label=npm+30d&message=10%2C592&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anysearch/anysearch-dsh) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anysearch/anysearch-dsh)

> **用途**：DSH研究用户需要并行获取多个角度的公开网页与垂直领域材料，最终事实仍需来源核对。

> **亮点**：[Q01](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q01) 与 [Q02](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q02) 支持保留宿主原生入口同时新增可发现垂直参数及有界并发，减少手工安排多次查询；实际检索效果未测。

> **思考**：[Q03](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q03) 远端额度和索引质量决定最终效果，五项并发仍是五次请求；无URL结构数据不能被当作可引用网页证据。

> **建议**：[Q04](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md#research-q04) 提出按来源独立性和可引用性汇合批结果并呈现缺证，尚未验证；若只增加重复结果或人工核对则否定。

[查看完整分析](../../plugins/anysearch-team--anysearch-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1211139949-root"></a>

## [Archify](../../plugins/tt-a1i--archify/INSIGHT.md)

[![GitHub ★ 88,446](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=88%2C446&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify)

> **用途**：适合向开发者或协作者解释架构、流程和复杂答案；结果需同时可读、可核对。

> **亮点**：相对直接让模型绘图，贡献是把结构化创作、交互产物和绑定实际文件的阶段验收串成流程；它提高交付可追溯性，不证明模型理解正确。[Q01](../../plugins/tt-a1i--archify/INSIGHT.md#research-q01) [Q02](../../plugins/tt-a1i--archify/INSIGHT.md#research-q02)

> **思考**：产物与收据一致不等于关系和结论正确；源码证据选择及异常流程覆盖仍由作者负责，自动可读性不能代替语义复核。[Q03](../../plugins/tt-a1i--archify/INSIGHT.md#research-q03)

> **建议**：未验证假设是在保留重要关系的前提下增加逐关系事实性质和证据覆盖门禁，比较人工清单能否减少遗漏且不放大复核负担。[Q04](../../plugins/tt-a1i--archify/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/tt-a1i--archify/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1330942675-root"></a>

## [Awesome DeepSeek Harness](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md)

[![GitHub ★ 1,260](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C260&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0xsline/awesome-deepseek-harness)

> **用途**：帮助DSH用户按任务发现候选仓库；本身是目录资源，不是可安装插件。[Q01](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md#research-q01)

> **亮点**：以双语场景分类与人工补充降低公开topic发现的筛选负担；不提供条目安装或可靠性认证。[Q01](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md#research-q01)

> **思考**：topic最多1000条、私有hub需权限、CATALOG日期较旧，不能把全量标题作为当前完整覆盖证明。[Q02](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md#research-q02)

> **建议**：未验证方向是逐来源展示固定版本、分页截断与失败范围，帮助读者区别未收录与未能检查。[Q04](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/0xsline--awesome-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333171737-root"></a>

## [Awesome DeepSeek Harness Plugins](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md)

[![GitHub ★ 560](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=560&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins)

> **用途**：不知道具体仓库名称的DSH用户，可按能力分类建立待核查候选清单。

> **亮点**：[Q01](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md#research-q01) 将分散仓库按统一分类和列组织，并补充引用线索；贡献是发现资源整理，非模型工具或安装验证。

> **思考**：[Q02](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md#research-q02) 动态Star与引用网页数无法证明任务效果或独立性，固定README也没有保存排名输入。不能把893条文档行误写为893个可用插件。

> **建议**：可以推导未验证的任务索引，在候选旁保存其解决的具体失败、固定版本证据、简单替代和一项最小验证结果，并把“链接存在”与“作者声明/源码/真实运行”分开。相对Star和网页数，增量是帮助读者决定哪一项值得进入复核，而不是暗示高热度就可靠。

[查看完整分析](../../plugins/zhiyuan-fan--awesome-deepseek-harness-plugins/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1367299537-root"></a>

## [ClearAI](../../plugins/clearailhc--clearai-dsh/INSIGHT.md)

[![GitHub ★ 673](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=673&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Clearailhc/clearai-dsh) [![npm 30d 6,213](https://img.shields.io/static/v1?label=npm+30d&message=6%2C213&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/clearai-dsh) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/clearai-dsh)

> **用途**：需要逐题证据与反例的研究团队，将研究答案沉淀为有边界的本体条目。

> **亮点**：[Q01](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q01) 与 [Q02](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q02) 支持由“执行者说完成”转为材料绑定独立裁决，并在审计后重新检查未决问题；贡献是研究完成协议，非新增宿主子 Agent。

> **思考**：[Q03](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q03) 指出独立角色仍可能共享模型偏差，结构完备不代表现实命题可信；额外评估费用是否降低错误结案尚无实测。

> **建议**：[Q04](../../plugins/clearailhc--clearai-dsh/INSIGHT.md#research-q04) 提出以错误结案风险选择评估强度，保留语义门与可恢复派发；若错误率不降或费用反增则否定。

[查看完整分析](../../plugins/clearailhc--clearai-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1195828337-root"></a>

## [Distilly](../../plugins/titanwings--distilly/INSIGHT.md)

[![GitHub ★ 26,004](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26%2C004&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/titanwings/distilly)

> **用途**：为需要保留同事工作方法、整理个人偏好或研究公众表达的人，把消息、文档和访谈材料提炼为可复用 Person Profile，并打包成 Agent Skill。合格产物是能回指材料、区分事实和推断且可纠正的行为规则，不是本人复制品。

> **亮点**：相对手写“扮演某人”的提示，Distilly 将来源采集、Work 与 Persona 双轨分析、用户预览、统一 writer、版本备份及宿主安装拆成可复用流程。它改变知识交接的组织方式，而非训练出人的模型；主要执行仍依赖承载 Skill 的 Agent 判断。[Q02](../../plugins/titanwings--distilly/INSIGHT.md#research-q02)

> **思考**：source-grounded 是目标，不是 writer 或质量脚本自动证明的语义属性。流程允许无文件时仅凭访谈生成；quality_check 的 URL 形状、来源标记和 PASS 文本检查不能证明判断忠实于本人或适合新问题。工作技能内明确不足就说明缺口，但提示规则能否被宿主稳定遵守仍未知。[Q03](../../plugins/titanwings--distilly/INSIGHT.md#research-q03)

> **建议**：未验证假设是把每条行为规则绑定到具体材料片段、适用情境、反例及本人或授权审核者修正记录，让纠错有可定位的最小单元。由当前文档级质量标记与行为规则语义之间的距离推导；在20个留出工作问题上对比普通 persona 提示与规则证据版，观察事实错误、风格过拟合、拒答与修正时间。若只提高风格相似度而不改善任务忠实性，或复核负担过高，应否定。[Q05](../../plugins/titanwings--distilly/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/titanwings--distilly/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1390103795-root"></a>

## [DSH Local Memory](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md)

[![npm 30d 137](https://img.shields.io/static/v1?label=npm+30d&message=137&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-local-memory) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-local-memory)

> **用途**：多项目维护者需要知道哪个项目缺记忆并对指定项目联合查询；合格结果必须有库归属和缺失诊断。

> **亮点**：相对Hindsight平级分库，增量是读取时跨库视图与“发现缺失→播种→核对状态”闭环；不复制总库，不将上游抽取引擎算作自身创新。[Q01](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md#research-q01) [Q02](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md#research-q02)

> **思考**：项目隔离能否成立取决于库身份。源码只用目录basename，同名仓库会映射到同库；分库不是访问控制，本地daemon也不自动代表离线LLM处理。[Q03](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md#research-q03)

> **建议**：未验证假设是增加稳定项目身份映射和同名碰撞预警，在不破坏上游库命名兼容的条件下改善归属可信度；用同名、worktree和重命名矩阵比较误归属与维护负担。[Q04](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/allenwes365--dsh-local-memory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1346064150-root"></a>

## [DSH PDF Reader](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngelosZou/dsh-pdf-reader) [![npm 30d 722](https://img.shields.io/static/v1?label=npm+30d&message=722&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pdf-reader) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pdf-reader)

> **用途**：适合在DSH中阅读含图表、公式与双栏布局的论文，输出需人工核对原页。

> **亮点**：以内容画像选择文本或区域渲染，将PyMuPDF能力组织成扫描、混读和精读工具；贡献在适配与路由，不是新的PDF解析算法。[Q03](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md#research-q03)

> **思考**：缓存名缺少完整bbox、DPI与源路径，同起点区域或同名PDF可发生路径重合；尚未运行复现其读图影响。[Q04](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md#research-q04)

> **建议**：未验证假设是用PDF内容摘要、页码、完整bbox及DPI作为缓存键，并让每个问题共享总图像预算，能减少误用旧图与过量裁剪。它从当前缓存冲突及逐区域独立预算推导，不是本版已有能力。最小验证用同basename两PDF、同起点不同bbox及图表密集页，对比现版和新缓存策略，检查路径唯一性、读图正确率、总图像token和人工复核；若只有磁盘增量而无错误或总成本改善，否定其采用优势。 [Q08](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1337467566-root"></a>

## [dsh-anchored-monitor](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md)

[![GitHub ★ 13](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aik358/dsh-anchored-monitor) [![npm 30d 973](https://img.shields.io/static/v1?label=npm+30d&message=973&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor)

> **用途**：研究某模型推理表达轨迹并可视化；自动干预需极严格验证。

> **亮点**：将流式推理指纹、窗口和实验日志做成实时仪表与可配置状态机。详见[Q02](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md#research-q02)。

> **思考**：默认启用会话打断/自动续跑，README 却称默认仅监测；HTTP CORS:* 无鉴权且配置可改 monitorUrl。详见[Q03](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md#research-q03)、[Q04](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md#research-q04)。

> **建议**：默认只读、受保护的统计摘要和人工批准干预能降低误打断；尚未实现。详见[Q05](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1359423472-root"></a>

## [dsh-codevault](../../plugins/1014029855--dsh-codevault/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1014029855/dsh-codevault)

> **用途**：读者保存源码认识并重复回访，要求对象/版本坐标、真实依据和档案恢复可解释。

> **亮点**：稳定对象卡、快记展开与回访/历史接线使记录可积累，标准文本易迁移；内容依据仍由读者核查。详见[Q01](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q01)与[Q02](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q02)。

> **思考**：vault仅词法守卫且stat递归跟链接、全文读后裁剪；expand/delete改旧行限制历史，整体JSONL与多派生文件非事务。详见[Q02](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q02)。

> **建议**：可探讨修订/tombstone日志与最小vault入口，固定source ref并加realpath/扫描预算；涉及迁移、擦除与日志增长取舍，未验证。详见[Q04](../../plugins/1014029855--dsh-codevault/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/1014029855--dsh-codevault/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1380181057-root"></a>

## [dsh-fact-check](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7starsseeker/dsh-fact-check) [![npm 30d 1,417](https://img.shields.io/static/v1?label=npm+30d&message=1%2C417&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fact-check) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fact-check)

> **用途**：给研究者组织公开资料核查，合格交付需逐事实点核对来源与未确定项。

> **亮点**：把成熟核查方法组织为可反复执行、可审阅的报告协议，路由与判据分离便于替换环境；并非自动事实真值算法。[Q01](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q01)、[Q02](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q02)

> **思考**：引用模板不能证明原文真实、来源独立或结论蕴含；双轨是规范口径，Jev数值也没有独立真值保证。[Q03](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q03)

> **建议**：未验证假设是固定来源快照并建立断言—摘录—源头图，以复核成功率和人工耗时检验其相对纯URL报告的价值。[Q06](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336585522-root"></a>

## [dsh-feed](../../plugins/863683348--dsh-feed/INSIGHT.md)

[![npm 30d 92](https://img.shields.io/static/v1?label=npm+30d&message=92&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feed) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feed)

> **用途**：查询 DSH 插件候选并向其他界面复用机器可读索引。

> **亮点**：模型工具、CLI 和实验性 MCP 共用可 diff JSON 索引，详见[Q03](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q03)。

> **思考**：默认覆盖有限、同插件跨源可能双计，网络部分失败仍更新时间；路径约束仅词法检查，详见[Q01](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q01)、[Q02](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q02)。

> **建议**：以仓库/包关联身份与显式分页/失败状态减少双计和假新鲜，反证及代价见[Q05](../../plugins/863683348--dsh-feed/INSIGHT.md#research-q05)；真实路径写入仍需独立约束。

[查看完整分析](../../plugins/863683348--dsh-feed/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334384058-root"></a>

## [dsh-free-search](../../plugins/dddmuc--dsh-free-search/INSIGHT.md)

[![GitHub ★ 642](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=642&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DDDMUC/dsh-free-search) [![npm 30d 58,071](https://img.shields.io/static/v1?label=npm+30d&message=58%2C071&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search)

> **用途**：无可用原生搜索provider的个人DSH用户，希望普通web_search仍可返回可核查网页来源。

> **亮点**：[Q01](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q01) 与 [Q02](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q02) 支持把多引擎、冷却和有限重试接到原生搜索，减少手工更换来源；这不证明每次都成功或总体成本低。

> **思考**：[Q02](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q02) 全部引擎失败会抛错，multi返回预算没有在所读层取消所有请求；[Q03](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q03) 静态免费标签不能保证零费用。

> **建议**：[Q04](../../plugins/dddmuc--dsh-free-search/INSIGHT.md#research-q04) 提出以合格答案为单位记录全部尝试和费用，并区分响应到点与请求结束；未验证，若不能改善预算判断则否定。

[查看完整分析](../../plugins/dddmuc--dsh-free-search/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333258936-root"></a>

## [dsh-handbook](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md)

[![GitHub ★ 913](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=913&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Electricitysheep/dsh-handbook)

> **用途**：为初学DSH、配置profile或开发首个插件的中文开发者组织阅读和动手顺序。

> **亮点**：将架构资料组织为有目标、动作与验收的中文学习路径，贡献是教学与编辑组织，不是新增宿主能力。[Q01](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md#research-q01) [Q02](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md#research-q02)

> **思考**：实测依赖旧版环境且完整基准输入产物未公开；五任务三轮与每Agent45/45分母不直接相符，不能据此作当前通用排名。[Q03](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md#research-q03)

> **建议**：每段练习绑定宿主固定版本、公开输入与机器验收，用同背景新手对照求助次数和定位时间；未验证。[Q04](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/electricitysheep--dsh-handbook/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336649545-root"></a>

## [dsh-insight](../../plugins/863683348--dsh-insight/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/863683348/dsh-insight) [![npm 30d 821](https://img.shields.io/static/v1?label=npm+30d&message=821&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-insight) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-insight)

> **用途**：面对插件目录的用户需要回答“哪些值得装、如何配、是否安全”；基线是逐个读 README、源码和安装说明。合格结果是候选能追溯到数据库/源码，安全扫描与需求匹配分开呈现，最终 verdict 明确证据强弱且不会自动安装。 详见[Q01](../../plugins/863683348--dsh-insight/INSIGHT.md#research-q01)。

> **亮点**：相对人工搜索，它把发现、环境组合、健康与静态安全放到同一询问入口，减少上下文切换；但“统一 verdict”容易把不同证据等级压成单一标签。静态规则与内置数据的新鲜度决定价值，不能替代固定版本源码研究、真实安装或宿主验收。 详见[Q03](../../plugins/863683348--dsh-insight/INSIGHT.md#research-q03)。

> **思考**：核心质疑是分数与 verdict 是否具有校准意义。若插件数据过期、静态扫描误报/漏报或权重无法解释，单一建议会放大错误信心；扫描本地目录只看可匹配模式，不会运行数据流、权限或外部服务。建议名为 install 也不构成用户授权。 详见[Q04](../../plugins/863683348--dsh-insight/INSIGHT.md#research-q04)。

> **建议**：未验证假设是把 verdict 改成可追溯证据图，并在数据过期或扫描未覆盖时拒绝给出 install，可降低误导。最小实验让两名审查者对 30 个插件做盲审，与现 verdict/证据图 verdict 比较一致率、严重漏报和复核时间；若可追溯版不降低高风险误判则否定。 详见[Q08](../../plugins/863683348--dsh-insight/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/863683348--dsh-insight/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1412857520-root"></a>

## [dsh-ledger-memory](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/18477514055/dsh-ledger-memory) [![npm 30d 3,126](https://img.shields.io/static/v1?label=npm+30d&message=3%2C126&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ledger-memory) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ledger-memory)

> **用途**：给跨会话持续推进项目的人维护状态记忆，合格结果要核对真实目标与工作区。

> **亮点**：在普通项目笔记之上接入检测、注入、归档、卡片索引和压缩原文回读，减少记得手动查笔记的依赖；语义正确仍需复核。[Q01](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q01)、[Q02](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q02)

> **思考**：原则grant按会话而非精确内容/root，超预算单事件无法靠seq拆分；主写与审计非事务，临时创建失败清理未判断所有权；V3禁自动stage而V2仍默认允许。[Q03](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q03)、[Q04](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q04)

> **建议**：未验证方向是绑定root/内容/版本的授权与多资产写入收据，借故障矩阵检验错写、部分审计和可恢复性，不能把新假设当已实现保证。[Q06](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1329424520-root"></a>

## [dsh-mnemon](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md)

[![GitHub ★ 719](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=719&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-mnemon) [![npm 30d 55,434](https://img.shields.io/static/v1?label=npm+30d&message=55%2C434&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon)

> **用途**：跨会话反复使用同一项目资料且愿意维护事实的用户，可用独立本地存储和虚构项目先比较手工MEMORY文件。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q01) 与 [Q02](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q02)支持的贡献是将分层来源、每回合固定视图及可管理状态组合为宿主记忆机制，减少全量注入和配置中途漂移；不把召回命中或条目数当任务收益。

> **思考**：[Q03](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q03) 的scope和[Q04](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q04) revision/容量保护解决状态一致性，不保证事实语义正确或所有Provider隔离。压缩成功、写入receipt和可见引用仍不能证明旧错已消除或最终答案正确；关闭组件也不等于删除数据。

> **建议**：[Q06](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q06) 提出跨层纠错传播的任务级验证假设，区分合理固定的旧回合与新回合过期污染，对照手工文件的错误、token和维护时间；若无改善不推广自动跨层能力。

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

<a id="plugin-1416950630-root"></a>

## [dsh-sciwork](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/58catmiao/dsh-sciwork)

> **用途**：给研究者组织文献、图、稿和投稿材料，科学与引用真实性需人工逐项复核。

> **亮点**：普通文件真相与同一动作清单连接面板、agent和CLI，新动作有参数/root绑定确认；Origin能力归上游，不等科学正确认证。[Q01](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q01)、[Q02](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q02)

> **思考**：legacy路径隐式代签；Promise.race超时不取消底层写，回执尽力落盘；格式fail仍可导出，先hash后重读不保证并发快照一致。[Q03](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q03)、[Q04](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q04)

> **建议**：未验证方向是冻结导出字节、分离机械与语义放行，以及operationId回读未知结果后重试；故障矩阵检验一致摘要和不重复执行。[Q06](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 701](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=701&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chenxiachan/thoughtdag) [![npm 30d 6,907](https://img.shields.io/static/v1?label=npm+30d&message=6%2C907&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-thoughtdag) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-thoughtdag)

> **用途**：本项是ThoughtDAG仓库dsh子目录的原生插件，不把整个桌面应用算成插件自身开发量。目标用户是在长会话与多个分支中梳理思路、追问并定位过去改动的开发者或研究者；合格结果是节点能追溯原会话与轮次，选定上下文继续执行后能找到真实输出。相对导出JSONL到外部图工具，它在同一DSH Web服务挂载同源画布，并可把图中的上下文送回原宿主会话。无限画布、图导入与why索引来自父项目，DSH插件增量是嵌入、会话桥、工具和权限适配，不是新的推理模型或因果推断算法。README列出的历史安装验证是作者报告，本轮没有重现。

> **亮点**：[Q01](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q01)、[Q02](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q02)、[Q03](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q03)把父项目图/索引接到DSH会话和工具，减少外部导出与复制；贡献归属在适配，不把图算法与CLI索引算作子插件原创。

> **思考**：[Q04](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q04)Host字符串不是身份认证，词法路径不是完整文件授权；[Q03](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q03)历史候选解释不是因果证据，fork也不恢复工作区。生成物必须按发布链核查，不能混同源码与npm包。

> **建议**：未验证方向是把选中节点编译成绑定会话ID、输入末序号、来源轮次和目标工作区的候选上下文，先预览差异与本轮工具权限，再提交一次稳定requestId；把只读历史浏览与能唤醒代理/写备份分别授权。推导来自当前Host范围、临时生成requestId和图/会话双表示的交接缺口，而不是认为已有fork即保证安全。最小验证用故意过期节点、断线、重复提交和同名备份案例，比较重复执行、错会话注入及用户确认时间；如果绑定仍无法识别副作用或确认负担大于手工复制上下文，则否定。该方案不计入当前贡献，也不宣称无需进一步用户需求验证。 [Q06](../../plugins/chenxiachan--thoughtdag--dsh/INSIGHT.md#research-q06)

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

<a id="plugin-1335219884-root"></a>

## [dsh-web-tools](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A3Boy/dsh-web-tools)

> **用途**：适合有重复资料检索与服务中断问题的用户，合格材料仍须来源可追溯且覆盖问题。原生单服务对照见 [Q01](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q01)。

> **亮点**：统一宿主接口下保留后端差异并显式处理平台失败，是检索工程组合增量；不是检索算法或完整语义理解证明。见 [Q01](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q01)。

> **思考**：工具成功和固定truncated:false不能代表来源完整、约束保真或图片/评论已覆盖；长查询与规则启发式还会改变检索语义。见 [Q03](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q03)。

> **建议**：未验证假设是输出约束执行、覆盖和降级来源证明，帮助减少可用性与完整性混淆；对照及否定条件见 [Q05](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/a3boy--dsh-web-tools/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1412897932-root"></a>

## [dsh-weknora-archive](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md)



> **用途**：已部署 WeKnora、希望把 DSH 对话沉淀为团队知识库的用户可用它按游标增量读取 DSH 会话，清洗并摘要后去重上传到 WeKnora，支持手动工具与定时归档；合格结果是只归档新增且符合筛选条件的会话，重复内容不重复写入，失败可定位并重试。详见[Q01](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q01)。

> **亮点**：补齐 DSH 到 WeKnora 的增量写入链，将会话提取、摘要、指纹去重与上传串成一个可调度流程。它相对“人工导出会话、整理 Markdown 后上传，或只使用 WeKnora 检索而不自动写入”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q03)。

> **思考**：摘要会把模型判断引入档案，隐私过滤和去重指纹不能保证敏感内容不外发或语义重复被识别。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q04)。

> **建议**：未来可探索：可在上传前增加可复核的字段级隐私清单与内容寻址回执，让删除、重放和来源追踪成为归档协议的一部分。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1358313559-root"></a>

## [dsh-wsl-obscura](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-obscura)

> **用途**：WSL 环境下定点抓取或渲染网页正文，复杂交互转原生 MCP。详见[Q01](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md#research-q01)。

> **亮点**：将无头抓取接到 DSH Agent 工具面并明确 MCP/CDP 升级路径。详见[Q01](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md#research-q01)。

> **思考**：isSafeHttpUrl 仅限协议，不能证明 SSRF 阻断；CLI 与外层超时/缓冲区可能影响结果。详见[Q03](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md#research-q03)和[Q04](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md#research-q04)。

> **建议**：未验证改进为固定二进制版本的私网回归矩阵、显式默认 stealth 与输出流式处理。详见[Q05](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1380817560-root"></a>

## [dsh-wsl-obsidian](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-obsidian)

> **用途**：用于对既有 Windows Obsidian 库进行 Agent 辅助整理；知识正确性、同步和覆盖风险仍需人核。详见[Q01](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md#research-q01)。

> **亮点**：让已有 Obsidian 库可被 Agent 以专用工具操作，并保留原有文件和双链工作方式；相比通用文件工具增加 vault 发现/路径规则，但不解决内容正确性、同步或冲突。详见[Q01](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md#research-q01)。

> **思考**：safeJoinVault 只验证词法路径，没有 realpath；writeFileSync/appendFileSync 无预期版本或恢复机制。confirm=true 与工具串行声明不足以保护库外 symlink 和 Obsidian 外部编辑。详见[Q03](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md#research-q03)。

> **建议**：未验证方向是以 realpath 约束目标，写入携带已读内容哈希并进行比较、备份和原子替换；用 symlink/双端竞争/中断夹具比较丢失与误拒绝。详见[Q05](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381860363-root"></a>

## [dsh-wsl-playwright](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-playwright)

> **用途**：DSH 用户需要读取公开、可能经 JavaScript 渲染的网页内容。

> **亮点**：把无头网页标题/正文读取接入模型工具，减少手工复制，并为 JS 渲染页面提供潜在增量。详见[Q01](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md#research-q02)。

> **思考**：临时目录 ESM 导入与 npx 包解析关系未验证，现有单测不覆盖启动；URL 无内网/重定向边界，fetch 不呈现最终 URL/HTTP 状态。详见[Q03](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md#research-q03)。

> **建议**：固定可解析的 Playwright 环境并添加目标地址门控、最终 URL/状态审计；在隔离站点矩阵比较成功率/延迟/误访问后再采用，本版未实现。详见[Q04](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381726438-root"></a>

## [dsh-wsl-vecmem](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-vecmem)

> **用途**：面向需要保存项目碎片而不想上云的 DSH 用户，把短文本写入本地向量库并按 workspace 检索。 [Q01](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q01)

> **亮点**：相对把向量直接写 JSON，它把元数据与 Float32 矩阵分离并检测双文件漂移，改善数千条规模的空间和解析负担；业务上仍是轻量碎片库。 [Q03](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q03)

> **思考**：双文件写入不是原子事务，崩溃只会被检测而不会自动修复；检索质量依赖本地模型、文本切分和可选 reranker，且缺少任务结果对照。 [Q04](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q04)

> **建议**：可加入写前 journal 与原子索引切换，并记录 embedding 模型指纹；模型变更时显式进入重建队列而不是混写或静默失配。 [Q08](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1085086903-root"></a>

## [EverOS](../../plugins/evermind-ai--everos/INSIGHT.md)

[![GitHub ★ 13,600](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13%2C600&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/EverOS)

> **用途**：小团队开发者跨会话/应用保留并可修正事实与经验，以后续任务正确使用当前记忆为交付。

> **亮点**：将Markdown原件、错误可定位的派生索引与用户/agent轨道组合成可审阅纠错路径；抽取/排名依赖everalgo与模型，不宣称新算法。见 [Q02](../../plugins/evermind-ai--everos/INSIGHT.md#research-q02)。

> **思考**：有损抽取/合并和异步索引不保证下游事实正确；抽取非幂等且客户端取消后仍可能落写，盲重发风险需验收。见 [Q03](../../plugins/evermind-ai--everos/INSIGHT.md#research-q03)。

> **建议**：未验证的修正版本/索引状态/原件引用门控可能减少陈旧和误合并错误；20个纠错任务控制模型预算比较，错误不降则否定。见 [Q05](../../plugins/evermind-ai--everos/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/evermind-ai--everos/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 1,967](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C967&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jesseovo/last30days-skill-cn)

> **用途**：中文研究与内容人员以时间窗主题检索发现线索，再核查原始出处。

> **亮点**：[Q01](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md#research-q01)、[Q02](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md#research-q02) 在上游研究Skill基础上组织中文来源与质量状态，减少手工聚合步骤；成熟检索/去重框架和上游贡献不作本项目原创。

> **思考**：[Q03](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md#research-q03) 不同采集路径、日期缺失和转载使样本不可当全网观点比例，热度与相关性分数不验证事实；关键结论必须回原文。

> **建议**：[Q05](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md#research-q05) 未验证假设是用来源路径和日期/转载覆盖矩阵约束比较资格，五份报告对照误读与阅读时间；没有改善就停止。

[查看完整分析](../../plugins/jesseovo--last30days-skill-cn/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1195243030-root"></a>

## [Learn Harness Engineering](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md)

[![GitHub ★ 21,413](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21%2C413&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/walkinglabs/learn-harness-engineering)

> **用途**：面向学习如何让编码 Agent 跨会话保持状态、范围和验证约束的开发者，提供项目式课程、示例及 harness-creator Skill。交付应是能在真实任务中遵守验证和恢复规则的项目环境；课程仓库本身不是 DSH 功能插件。

> **亮点**：相对散落工程文章和手写约定，课程以 instructions、state、verification、scope、lifecycle 五部分组织问题，并把它落实为可生成、可结构检查的最小文件组。贡献在教学与工程启动流程；框架原理有明确外部来源，结构评分也不等于 Agent 效果评测。[Q02](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md#research-q02)

> **思考**：结构评估主要检查文件、JSON字段及关键词是否出现，能发现缺少入口，却无法证明验证命令足以覆盖目标任务或 Agent 会执行它。Skill 本身承认 benchmark 是结构性的。README 中引述的外部成本案例还有预算和时间变化，本轮未独立复核，不能用它证明同预算可靠性提升。[Q03](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md#research-q03)

> **建议**：未验证假设是在五部分结构检查外，为每条“完成”规则绑定一个代表性任务及失败注入，从静态约定转为可观察遵循度。固定同模型、仓库和预算，对比未改造、仅模板与任务证据三种环境，测漏跑验证、错误完成、跨会话恢复和人工介入。若结构分提高而任务指标不变，或维护验证任务的成本超过节省，则不继续加机制。[Q05](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1302496224-root"></a>

## [Memmy Agent](../../plugins/memtensor--memmy-agent/INSIGHT.md)

[![GitHub ★ 2,144](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C144&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MemTensor/memmy-agent)

> **用途**：跨DSH及其他Agent切换的用户希望保留背景、偏好与进度；根是独立应用/服务工程。

> **亮点**：把跨Agent历史组织为服务化结构记忆并提供DSH自动捕获/召回接缝，增量在连续性与共享状态，而非单纯聊天摘要。见[Q01](../../plugins/memtensor--memmy-agent/INSIGHT.md#research-q01)。

> **思考**：local-first不等于离线，远程embedding/LLM会接收文本；后台服务与记忆库不会随关窗口或卸载DSH adapter自动消失。见[Q03](../../plugins/memtensor--memmy-agent/INSIGHT.md#research-q03)。

> **建议**：未验证方向是沿sourceMemoryIds核纠错/撤回传播，区分未来召回与历史已注入；若现有链已足够或无净收益不另建账本。见[Q04](../../plugins/memtensor--memmy-agent/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/memtensor--memmy-agent/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1014729376-root"></a>

## [MemOS](../../plugins/memtensor--memos/INSIGHT.md)

[![GitHub ★ 12,092](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12%2C092&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MemTensor/MemOS)

> **用途**：为需要跨会话保留项目经验与个人偏好的Agent用户提供记忆平台、云API、自托管服务及本地适配。本次源码研究重点核查DSH本地接入：每个直接用户轮次自动回忆、后台采集及显式查询；合格结果是任务使用正确且新鲜的记忆，并能追溯和纠正，不是召回条数增加。

> **亮点**：相对手工维护笔记再粘贴，DSH适配将接受后的用户输入接入一次有期限的召回，将采集放入每会话串行后台队列，并通过async-local固定辅助模型路由，避免多会话共享可变路由。它为前台延迟、写入吞吐和宿主接入形成明确取舍；检索、数据库与模型算法不是由适配层独立发明。[Q02](../../plugins/memtensor--memos/INSIGHT.md#research-q02)

> **思考**：后台采集不阻塞下一轮意味着紧接着的召回可读到旧提交状态，最新纠正不保证立即可见；三秒前台上限保护响应而不证明记忆正确或新鲜。另需区分“本地存储”与“不出机器”：默认辅助调用可委托宿主provider，若它是远程模型，相关材料仍会离开本机。根README的整体分数和纯本地表述不能替代这个版本、这个路由的实测。[Q03](../../plugins/memtensor--memos/INSIGHT.md#research-q03)

> **建议**：未验证假设是为已提交记忆标注revision和捕获进度，仅对用户明确纠正的事实提供短期限read-your-correction门槛或临时覆盖；普通轮次继续不等待后台。由当前延迟/新鲜度取舍推导，增量不是全局强同步，而是让高风险纠错可检验。用连续“陈述→纠正→立即追问”与跨项目反例，对比默认队列、全等待和选择性纠错门槛，测陈旧回答、误跨项目召回、P95延迟及模型费用。无明确准确收益或超出延迟预算则否定。[Q05](../../plugins/memtensor--memos/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/memtensor--memos/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1014729376-apps-memos-local-plugin"></a>

## [MemOS Local Memory](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md)

[![GitHub ★ 12,110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12%2C110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MemTensor/MemOS) [![npm 30d 8,367](https://img.shields.io/static/v1?label=npm+30d&message=8%2C367&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memtensor/memos-local-plugin) [![最新发布 2026-09-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memtensor/memos-local-plugin)

> **用途**：它服务已使用DSH、反复处理相近任务且愿意保留历史状态的开发者。合格结果是下一任务找回与当前项目有关的先前事实和行动依据，不能将旧的错误策略当作新指令。README把trace、policy、world model及Skill列为合作层级；这是整个本地组件的设计范围，不是MemOS仓库根服务的全部能力，也不是默认配置每次都会执行四层演化的证据。

> **亮点**：[Q01](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q01)与[Q02](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q02)支持的具体贡献是把跨宿主记忆核心接入DSH接受输入后的生命周期，以同轮去重、三秒上限和fail-open保护前台，并把采集留在后台。相比人工维护笔记后每次复制，自动采集与召回减少手工挑选步骤；没有同任务结果证明净节时或正确率提升。四层演化属于本地组件可选完整模式，默认轻量配置不能作为自动产出策略和Skill的证明。

> **思考**：[Q03](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q03)表明默认轻量反馈写入不等于完整演化；[Q02](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q02)表明下一轮不等待后台提交。最影响贡献的是“跨轮记忆”可能在紧接着的纠错任务中读到旧状态，这是一项可解释的时延取舍，并非本轮复现的错误。若错误历史不能被可靠识别和纠正，自动召回的便利会被复核负担抵消。

> **建议**：[Q07](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md#research-q07)推导未验证的纠错水位方案。显式纠错后展示记忆来源与提交水位，只对这些轮次短暂等待或排除旧水位结果，可能减少错误回流；需要保持同一延迟预算。用20个连续纠错任务对比当前方案与人工笔记，若错误引用不降或人工时间增加则停止，不计入已有贡献。

[查看完整分析](../../plugins/memtensor--memos--apps-memos-local-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1153190876-root"></a>

## [MemSearch](../../plugins/zilliztech--memsearch/INSIGHT.md)

[![GitHub ★ 2,797](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C797&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch)

> **用途**：根项目是Python语义记忆检索基础库与CLI，不是直接注册DSH生命周期的单个npm适配器。面向已有Markdown知识、项目历史和Agent记忆的开发者，合格结果是给自然语言问题返回相关片段及来源，可继续打开原文核对。调用者可以集成Python API或CLI，具体Agent自动捕获由各平台组件另行实现。

> **亮点**：[Q01](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q01)、[Q02](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q02)识别的贡献是以Markdown保持用户可编辑事实、让向量库成为可重建派生物，并用内容/位置/模型身份和有范围的清理组织增量索引。相比rg增加语义候选，成熟embedding、BM25和RRF来自已有方法，组合贡献不等于原创算法或任务胜出。

> **思考**：[Q03](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q03)显示旧块删除先于新块embedding；provider失败时来源原文件仍在，但索引可能暂缺内容。可重建解释恢复依据，不能保证每次查询完整或恢复免费；IndexReport应成为使用完整覆盖结论的门槛。本轮未运行复现，不称永久原件丢失。

> **建议**：[Q06](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q06)提出未验证的来源版本准备后切换方案。先准备新嵌入再切换可见版本，失败保留最后成功版本并提示陈旧；需要处理重复、查询过滤和清理成本。按阶段注入失败，对比简单重试，不能减少空窗或维护代价过大则停止。

[查看完整分析](../../plugins/zilliztech--memsearch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1153190876-plugins-dsh"></a>

## [MemSearch DSH](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md)

[![GitHub ★ 2,797](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C797&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch) [![npm 30d 3,358](https://img.shields.io/static/v1?label=npm+30d&message=3%2C358&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh)

> **用途**：它面向在同一项目中交替使用DSH和其他编码Agent、需要找回既有决策的开发者。合格交付是从历史中找出正确的项目决策并能下钻到原会话，而非仅搜索到相似文字。DSH组件将完成轮次摘要成共享Markdown，借助外部MemSearch CLI索引和检索，再把候选接到DSH模型步骤；Python检索核心和Milvus能力属于其依赖，不算DSH适配器独创。

> **亮点**：[Q01](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q01)、[Q02](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q02)识别的增量是把DSH事件转换成跨Agent共同Markdown与原会话锚点，并通过原生Skill和pre-step候选注入减去手工复制环节。检索算法来自外部MemSearch核心，适配器贡献是数据和流程接线。候选评审与主动安装分开，但不是强制审批门禁。

> **思考**：[Q03](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q03)显示摘要失败写入unavailable占位后仍带捕获锚点，事件重放先按锚点去重而不会重新摘要。幂等只能保证这一条记录不重复，不能保证里面已有可用知识；原会话可追溯也不等于已自动恢复。该源码限制尚未运行复现，试用应检查占位而非只检查日记存在。

> **建议**：[Q06](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md#research-q06)推导未验证的分状态捕获方案。保留原会话锚点，单列摘要失败/完成，并允许原位重试与索引更新；用摘要超时、退出和索引故障对照人工笔记。若出现重复、旧内容或人工时间未减少则停止，新增并发和版本维护成本必须计入。

[查看完整分析](../../plugins/zilliztech--memsearch--plugins-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340749561-root"></a>

## [Mimir](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md)

[![GitHub ★ 547](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=547&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1692775560/dsh-Mimir-Academic-research)

> **用途**：已有DSH且习惯源码/实验文件的研究者，希望在一个会话组织编译、诊断和结果线索。

> **亮点**：[Q01](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q01)将研究工具和状态组织到DSH；[Q02](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q02)提供有界日志诊断；[Q03](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q03)区分远程结果unknown和本地失败，有利于避免错误重提。外部编译、模型与服务器能力分别归原依赖。

> **思考**：[Q02](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q02)编译success不绑定论文语义和PDF新鲜度；[Q03](../../plugins/1692775560--dsh-mimir-academic-research/INSIGHT.md#research-q03)实验failed可能只是远端结果未知，不能据界面状态重跑或写论文结论。

> **建议**：可提出未验证的研究交付收据，将当前论文/数据版本、模型生成或人工修改来源、编译产物摘要、实验job精确终态和人工结论验收绑定。相对工作台里分别显示编译success与实验failed，它能指出哪些图表和文字仍依赖旧PDF、未知远端任务或未核对数据。它不会把程序运行成功提升为科学主张正确。

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

[![GitHub ★ 661](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=661&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mnemon-dev/mnemon)

> **用途**：Agent用户跨会话保存项目事实与决策，需可检索和可纠错的长期记忆。

> **亮点**：[Q01](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q01) 和 [Q02](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q02) 把语义监督与确定性存储分开，精确重复跳过但语义候选仅提示，避免相似度直接吞掉不同事实。

> **思考**：[Q03](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q03) 根DSH转接依赖latest外部插件，固定提交不能锁住完整运行链；监督、冲突与裁剪仍需有效判断和备份。

> **建议**：[Q04](../../plugins/mnemon-dev--mnemon/INSIGHT.md#research-q04) 提出为语义变更决定保存来源回执，未来方向未验证；若无法降低错误记忆和纠错投入则否定。

[查看完整分析](../../plugins/mnemon-dev--mnemon/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1163808542-root"></a>

## [ModSearch](../../plugins/liustack--modsearch/INSIGHT.md)

[![GitHub ★ 845](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=845&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liustack/modsearch) [![npm 30d 43,251](https://img.shields.io/static/v1?label=npm+30d&message=43%2C251&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modsearch)

> **用途**：需要公开资料检索且愿意核查来源的DSH用户，可先用无敏感信息的小查询集比较原provider。

> **亮点**：[Q01](../../plugins/liustack--modsearch/INSIGHT.md#research-q01) 与 [Q02](../../plugins/liustack--modsearch/INSIGHT.md#research-q02)支持的贡献是复用DSH原生搜索接口，把异质引擎回退、预算和来源不确定性组织起来；不是首次提供DSH搜索，也不证明“最强免费”。

> **思考**：[Q03](../../plugins/liustack--modsearch/INSIGHT.md#research-q03) 显示回退可能改变语料和URL披露位置，X转Web与云抽取并非同等证据，外部CLI提示也不是执行沙箱。可用性提升不能以静默扩大数据流或把降级当原请求完成为代价。

> **建议**：[Q05](../../plugins/liustack--modsearch/INSIGHT.md#research-q05) 提出按调用方语料/披露条件在规划前拒绝不合规回退的未验证方案，先排除配置已有等价功能，再比较错语料和披露错误；没有改善则停止。

[查看完整分析](../../plugins/liustack--modsearch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1128123594-root"></a>

## [OpenViking](../../plugins/volcengine--openviking/INSIGHT.md)

[![GitHub ★ 40,712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C712&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking)

> **用途**：为Agent团队组织可浏览的知识、记忆和技能，适合长期多会话知识任务。

> **亮点**：将虚拟URI、目录摘要和会话检索组合成可检查的上下文入口。

> **思考**：摘要正确性和更新一致性尚无当前任务对照，根平台不等于已验收DSH插件。

> **建议**：先用脱敏语料对照简单文件搜索，检查原文追溯、事实反转和总维护负担。

[查看完整分析](../../plugins/volcengine--openviking/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1128123594-examples-dsh-memory-plugin"></a>

## [OpenViking DSH Memory](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md)

[![GitHub ★ 40,712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C712&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking) [![npm 30d 34,730](https://img.shields.io/static/v1?label=npm+30d&message=34%2C730&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)

> **用途**：给已有OpenViking服务的DSH用户接入跨会话记忆，适合重复项目任务。

> **亮点**：以宿主事件驱动捕获、提交、召回，并把临时写入失败纳入本地重播。

> **思考**：正确记忆、纠错和项目隔离仍取决于服务与数据；队列有重试和TTL边界。

> **建议**：先在脱敏项目试用写入、纠错、重开召回和断网恢复，再决定是否持续使用。

[查看完整分析](../../plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-849121458-root"></a>

## [ReMe](../../plugins/agentscope-ai--reme/INSIGHT.md)

[![GitHub ★ 3,683](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C683&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentscope-ai/ReMe)

> **用途**：面向有大量跨会话项目知识、希望自主维护记忆文件的Agent开发者。原办法是手工Markdown加全文搜索，或专有记忆数据库；合格结果应是可回到原始文件与来源的相关片段，同时能纠正、导出和重建索引。根项目是Python记忆框架/服务，DSH桥接只是其integrations/dsh子组件，不应混为一个npm插件。

> **亮点**：相对手工笔记，增量是自动提炼、分块检索与关系扩展接入Agent流程；相对不透明数据库，Markdown让内容可读、编辑和迁出。RRF、BM25、embedding及文件图是成熟技术组合，贡献在文件真相源与多接入方式的协调，不据此宣称新的检索算法。是否优于grep和人工精选，要看误召回、纠错与总维护负担。 依据[Q03](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q03)。

> **思考**：核心质疑是自动提炼和演化会否把错误事实扩散为稳定知识。检索融合只按排名积分，不判事实真伪；有来源文件与模型输出也不能证明事实正确。auto_memory先执行再写成功回执，完成记录之前崩溃可能留下需协调的修改。LocalFileStore部分索引延期持久，关闭时落盘与原始Markdown不是同一事务，重建能力重要但不代表所有缓存状态无损恢复。 依据[Q04](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q04)。

> **建议**：未验证假设是对自动提炼的新知识实行轻量冲突暂存，召回时保留原事实与更新来源，能减少“最后写入者覆盖”的错误。用包含同名项目、过期偏好、明确纠正与重复请求的固定会话集，对比手工Markdown、现有ReMe和冲突暂存；记录任务正确率、错误记忆复用、人工纠错和总费用。若检索分数提高但任务答案更差，或纠错成本更大，应否定采用增益。 依据[Q08](../../plugins/agentscope-ai--reme/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/agentscope-ai--reme/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-849121458-integrations-dsh"></a>

## [ReMe DSH集成](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md)

[![GitHub ★ 3,683](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C683&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentscope-ai/ReMe) [![npm 30d 1,949](https://img.shields.io/static/v1?label=npm+30d&message=1%2C949&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@agentscope-ai/reme-dsh-plugin) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@agentscope-ai/reme-dsh-plugin)

> **用途**：面向跨会话反复处理同一项目、需要追溯偏好和事实的DSH用户。原办法是手工维护Markdown并粘贴相关片段；合格结果应是能追溯原文的相关记忆，而非把所有旧会话自动当指令。组件路径integrations/dsh是实际DSH桥接，不能把Python根框架直接当同一插件安装。

> **亮点**：相对每次手工粘贴历史，它把检索入口与完成轮次归档接入会话事件；相对整包记忆注入，只注入指引、按需search减少无关历史进入上下文的机会。durable outbox把暂时服务离线与会话交互分开，是桥接层具体增量；记忆质量主要仍属于ReMe服务和模型，不归功于适配器。 依据[Q03](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q03)。

> **思考**：关键质疑是自动归档会否把不完整回答长期化，以及未知网络结果会否重复写入。runtime允许max-tokens轮次入队。进一步核查同仓库服务端后确认，auto_memory按session_id与request_id哈希保存输入fingerprint及成功回执，已有同输入回执可重放、不同输入被拒绝；因此不能说服务端幂等全无材料。但执行顺序是先await _execute，再写成功回执，记忆写入与完成回执之间不是一个原子事务，进程在两者之间崩溃时仍需验证是否会再次执行。本轮只指出静态窗口，未复现重复事实。HTTP无API-key鉴权也要求可信网络。 依据[Q04](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q04)。

> **建议**：未验证假设是给每条自动记忆保留来源轮次与“未完成回答”标记，并让检索返回时突出冲突，可以减少截断回答污染长期知识。固定含纠正、截断和重复请求的会话集，对比默认归档和带标记归档的错误召回率、用户修正时间及费用；若标记不能阻止后续模型采信错误，不扩大自动写入。 依据[Q08](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/agentscope-ai--reme--integrations-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1330431542-root"></a>

## [SkillCorpus](../../plugins/evermind-ai--skillcorpus/INSIGHT.md)

[![GitHub ★ 692](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=692&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/SkillCorpus)

> **用途**：维护大量技能的 Agent 团队可按任务查询技能，合格结果应是任务办结而非仅找到文档。

> **亮点**：[Q01](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q01) 与 [Q02](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q02) 表明，贡献在于把多源检索、环境过滤和技能送达连到宿主入口；这使用户不必先知道技能名，尚不能证明 DSH 任务成功率提升。

> **思考**：[Q03](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q03) 的关键限制是依赖源码工作区接入，且没有门控时排名命中不等于适用；远端第三方正文与辅助模型开销会改变收益。

> **建议**：由 [Q04](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q04) 推导，可把是否检索和技能选择绑定到合格任务反馈；这是未验证方向，若同条件下仅增加 token 与纠错而未改善办结率则否定。

[查看完整分析](../../plugins/evermind-ai--skillcorpus/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1374986657-root"></a>

## [StudyMate](../../plugins/miaotofu01--study-mate/INSIGHT.md)

[![GitHub ★ 1,220](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C220&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Miaotofu01/Study-Mate) [![npm 30d 6,194](https://img.shields.io/static/v1?label=npm+30d&message=6%2C194&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunmiao/studymate) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunmiao/studymate)

> **用途**：数学计算机自学者按前置知识推进课程并保存练习；最终标准是独立迁移任务，不是课件生成量。[Q01](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q01)

> **亮点**：把自由聊天改为文件化课程、阅读作答和跨会话进度，工具分域约束支撑协作；并不证明教学正确或比教材更有效。[Q01](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q01) [Q02](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q02)

> **思考**：格式通过与进程退出不能代替学习掌握；实验路径guard非OS沙箱，不可信代码仍以宿主身份执行；现版不承诺旧平台支持。[Q03](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q03)

> **建议**：未验证方向是以延迟复测及未见迁移题推进学习进度，在同教材预算下比最终学习质量及全成本。[Q05](../../plugins/miaotofu01--study-mate/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/miaotofu01--study-mate/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1024118326-root"></a>

## [WeKnora](../../plugins/tencent--weknora/INSIGHT.md)

[![GitHub ★ 35,257](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C257&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora)

> **用途**：目标是有组织文档、需要集中维护与检索问答的团队。

> **亮点**：相对零散 RAG 拼接，根平台把内容权限与跨知识库检索放在同一服务中，并处理模型空间、维度和跨引擎分数口径；成熟 RRF 方法不计作原创。[Q02](../../plugins/tencent--weknora/INSIGHT.md#research-q02) [Q03](../../plugins/tencent--weknora/INSIGHT.md#research-q03)

> **思考**：归一化分数只能确认排序机制，不能证明语料相关性与答案正确率；自托管还需承担模型、存储、权限和恢复成本。[Q03](../../plugins/tencent--weknora/INSIGHT.md#research-q03) [Q04](../../plugins/tencent--weknora/INSIGHT.md#research-q04)

> **建议**：有持续知识维护与运维能力的团队可用代表性语料受控试用，先固定部署版本并核对权限、引用与恢复；少量临时文件先比较简单搜索方案。[Q04](../../plugins/tencent--weknora/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/tencent--weknora/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1024118326-packages-dsh-weknora"></a>

## [WeKnora DSH 插件](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md)

[![GitHub ★ 35,257](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C257&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora) [![npm 30d 4,785](https://img.shields.io/static/v1?label=npm+30d&message=4%2C785&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)

> **用途**：目标用户是已维护组织知识库、又在 DSH 中处理研发或研究任务的团队。

> **亮点**：它把平台检索包装成可继续阅读、可核对引用的 DSH 工具协议，并通过标题补召回和范围过滤减少模型自行拼 API 的负担；检索算法属于 WeKnora 平台。[Q03](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q03)

> **思考**：ask 会创建会话并触发服务端模型，完全只读仅适用于知识内容；默认全可见库范围也需按任务收窄。[Q02](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q02) [Q03](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q03)

> **建议**：已有 WeKnora 的团队可先用受限库和 retrieve key 试用搜索、读文档，再决定是否开放 ask；核对会话保存和额外模型消耗。[Q04](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md) · [返回表格](#category-index)

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-10-27
