# 研究与知识

[返回首页](../../../README.md)

信息检索、网页读取、笔记与长期知识。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@240xu/dsh-websearch](#plugin-1340340493-root) | 为DSH注册unified搜索服务，聚合11后端，支持并发容错、去重、可选重排、多查询及缓存历史。 | 非敏感公开查询小集合试用，先关多查询/深覆盖，严格流程关缓存并清历史，审阅备用实例。 |
| [@y9931666/dsh-plugin-crossfire](#plugin-1399279897-root) | 把待核成果按维度交给只读工具受限的红队子agent，收集候选缺陷，由读者逐条认定或驳回，并保存定稿与旧缺陷复审历史。 | 有条件试用，须真实connection认证栅栏、可信同信任用户、单进程状态与人工核证据；先小规模匿名成果。 |
| [@zzerx/dsh-plugin-memory](#plugin-1363429979-plugin-memory) | 提供全局/项目记忆库、九工具、自动提炼与注入、原文审计、实体关系及可视化管理。 | 先观察；无敏感库关autoCapture/autoInject，手工条目与独立profile对照，重要约定保留原始指引。 |
| [dsh-anchored-monitor](#plugin-1337467566-root) | 对 DSH reasoning 流做词形波段监控，独立进程可自动中断并重置会话。 | 仅隔离 profile 显式关闭干预，先回放验证代理指标；真实使用前需默认只读、身份鉴权及人审。 |
| [dsh-codevault](#plugin-1359423472-root) | 把源码阅读认识按仓库/文件/符号合并为Markdown对象卡，以JSONL保存条目并可选关联本地vault。 | 单人单写者独立备份档案可试用，vaultDir先不配置；广泛vault读取前优先修边界。 |
| [dsh-fact-check](#plugin-1380181057-root) | 提供多源公开事实核查方法、确定性来源路由和可选Jev降档判据，要求结论附可追溯原文。 | 已有可信搜索/正文环境可试用公开事实研究，Jev按隐私选装，结论依证据并独立复核。 |
| [dsh-feed](#plugin-1336585522-root) | 聚合 GitHub dsh-plugin topic 与 npm keyword 的本地 JSON 索引，供工具、CLI、MCP 查询。 | 隔离工作区试同步，审阅来源与错漏；search 只做候选检索，详见[Q03](#research-q03)。 |
| [dsh-insight](#plugin-1336649545-root) | 用需求匹配、环境配方、健康评分、静态安全扫描与统一 verdict 辅助选择 DSH 插件。 | 适合插件研究者把它当候选筛选和审计线索观察，不应直接驱动生产安装。 |
| [dsh-ledger-memory](#plugin-1412857520-root) | 为DSH项目维护台账、决策目标经验卡和活动日志，自动注入记忆、压缩前后提供胶囊与seq回读，并支持跨会话交接和项目锁定。 | 先观察，无敏感项目副本中核授权目标/内容、压缩旁路、回读cap、日志披露与Git index变化，再考虑重要记忆。 |
| [dsh-literature](#plugin-1351375738-root) | 在DSH侧窗识别学术文献、获取元数据和全文，提供PDF阅读、引用、笔记及本地库和目录保存。 | 先观察。 |
| [dsh-ls125-uv-probe](#plugin-1381989584-root) | 把 LS125/UVALED-X3 私有 UART 读取协议、抓取分析工具及 F103 参考固件注册成 DSH 技能。 | 只读轮询与离线抓取先行，清零单独审批；在独立仪表/标准光源下复核后才上生产设备。 |
| [dsh-math-olympiad](#plugin-1344714964-root) | 挂载竞赛数学解题 Skill，要求独立验证证明、诚实弃权，并可选编译 PDF。 | 已有可信 subagent 与 DSH base 的团队可隔离试题，逐题核验证器入参、标准解与弃权；详见[Q03](#research-q03)。 |
| [dsh-moli](#plugin-1415767842-root) | 把 Moli 无头浏览器封装成网页抓取、探测和按需安装工具。 | 仅在确需 SPA、截图或登录态抽取时于隔离 profile 小范围试用；先手工固定 Moli 版本和哈希，静态页继续用普通 fetch。 |
| [dsh-obsidian-board](#plugin-1415116420-root) | 在DSH三栏面板以本地BM25检索Obsidian笔记，复用宿主模型流式回答、点引用读源并保存回答。 | 先观察，非敏感可信个人库和限定模型通道对照。 |
| [dsh-plugin-academic-writing](#plugin-1336663456-root) | 为DSH提供论文骨架、题目摘要模板、引用和LaTeX片段，以及词法表达、Markdown结构、术语和投稿清单辅助。 | 观察，先修计数/无作者引用/TeX列等基础分支，只当草稿工具，不作学术或投稿验收。 |
| [dsh-plugin-audit](#plugin-1336223158-root) | 同步 GitHub topic/npm 元数据并评分排行，按需对单插件做有限静态安全扫描。 | 只把分数作线索，确认扫描文件覆盖/错误状态后再读固定 SHA 源码、验证安装；详见[Q03](#research-q03)。 |
| [dsh-plugin-finance-data](#plugin-1336663504-root) | DSH Agent 的确定性金融算术工具，但比率文本、跨年定投和组合再平衡路径存在可核不一致。 | 修复关键路径前不用于真实决策；以 10/100 比率、2 年月投和组合偏离样本验每个 action。 |
| [dsh-plugin-tavily](#plugin-1334654243-root) | 接管 DSH web_search 的 Tavily provider，并提供可选提取服务、设置卡和主机探测路由。 | 待修复缓存与 keyless；需用真实凭据在受控 Profile 验证搜索/提取/回退及 API 权限；详见[Q03](#research-q03)。 |
| [dsh-plugin-verify](#plugin-1336684054-root) | 通过关键词行号、JSON/YAML检查、URL/npm/GitHub探测及有界批量输出，提供核查线索和元数据。 | 先观察，作线索而非证实/安全通行证，先修证据语义/覆盖与网络范围再评估。 |
| [dsh-read-url](#plugin-1335047324-root) | 读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。 | 适合用公开网页查资料并愿意核对原来源的人在独立profile试用，先明确提供方缺失时的网络回退权限，默认不加直连例外；缺页、政策误绕过或预算失控时停用。 |
| [dsh-sciwork](#plugin-1416950630-root) | 把科研Agent预设、普通文件库、文献与期刊档案、绘图指引和投稿材料面板接到同一工作流。 | 先观察，在无敏感单人副本核引用/路径/快照/恢复；档案检查和导出不等投稿合规。 |
| [dsh-scrape-webpage](#plugin-1334269686-root) | 抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。 | 适合公开、无需登录且正文可抽查的研究页面小范围试用；登录态、强脚本渲染或付费墙继续使用宿主浏览器。 |
| [dsh-search](#plugin-1423253220-root) | 以 DeepSeek Search/Fetch API 提供检索、正文抓取和多页研究工具。 | 可用公开、非敏感查询小范围试用；先设 count/N 上限并以 100 个查询对照内置搜索的召回、正文成功率与实际账单。 |
| [dsh-stock-market](#plugin-1331846104-root) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。 |
| [dsh-trend-radar](#plugin-1336582509-root) | 按需采集 GitHub dsh-plugin topic/awesome 快照并生成趋势报告、关键词雷达和实验性 Web 面板。 | 先隔离建立空目录并复核首轮成功，再核查报告采样分母与类别映射；勿把 top100 榜当全生态。 |
| [dsh-ultramath](#plugin-1337487779-root) | 同步数模竞赛主控/角色预设、模型库与论文模板。 | 只在备份同名 DSH 目录的隔离 profile 试点；按题目核数据、模型、数值和论文，不以提示门禁代替独立验收。 |
| [dsh-web-tools](#plugin-1335219884-root) | 为DSH统一搜索与抓取接口适配多Provider、自定义JSON源及X/小红书原生浏览器检索。 | 可信本机公开任务试用并核原始来源/预算，严格隔离/全量内容要求先核具体缺口。 |
| [dsh-weekly-panel](#plugin-1400385991-packages-dsh-weekly-panel) | 将外部 DSH 插件周榜代理到 Web 主面板，展示排行、模型与推荐位并复制安装命令。 | 仅作非关键周榜浏览观察；复制安装命令及赞助内容前核原始仓库和数据，关键决策待修正新鲜度提示。 |
| [dsh-weknora-archive](#plugin-1412897932-root) | 提取、摘要、去重并上传DSH会话到WeKnora知识库，补充官方只读检索插件的写入侧。 | 已自建WeKnora且能接受内容外发者可观察，先用脱敏样本验证筛选、删除、重试和重复归档边界。 |
| [dsh-wsl-obscura](#plugin-1358313559-root) | 从 WSL 调用 Obscura 无头浏览器的 status/fetch 工具，并提供 MCP 接线提示。 | 先 status 后公开 URL 样本 fetch，私网防线按 Obscura 版本独立验；交互用 MCP。 |
| [dsh-wsl-obsidian](#plugin-1380817560-root) | 给 WSL 中的 DSH Agent 提供 Windows Obsidian 笔记库的状态、检索、读写和桌面打开工具。 | 建议观察，在测试 vault/备份副本先核 status、读写新文件和 Windows 显示；重要共享库暂不自动覆盖。 |
| [dsh-wsl-playwright](#plugin-1381860363-root) | 在 WSL 经 npx 启动无头 Chromium，读取 URL 标题、状态或正文。 | 观察。 |
| [dsh-wsl-vecmem](#plugin-1381726438-root) | 用本地 Ollama embedding 保存短文本，并按工作区进行语义检索。 | 适合少量、非敏感、可重建的项目碎片先观察；需要事务、并发写、强隔离或不可丢数据的团队应使用成熟存储。 |
| [KRouter](#plugin-1341648244-root) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | 有条件试用lookup-only。 |

<a id="plugin-1340340493-root"></a>

## [@240xu/dsh-websearch](../../plugins/240xu--dsh-websearch/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) [![npm 30d 4,731](https://img.shields.io/static/v1?label=npm+30d&message=4%2C731&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)

> **用途**：公开资料检索希望减少后端切换并对单服务失败软降级。详见[Q01](#research-q01)。

> **亮点**：将多搜索服务、查询/结果策略与故障遥测接入一个宿主provider，减少使用者切换接线。详见[Q01](#research-q01)。

> **思考**：缓存不含多项策略及端点，URL全小写去重可能误合并，历史留原始查询；备用实例还接收同一可选密钥。详见[Q04](#research-q04)。

> **建议**：可研究完整策略指纹、合并来源链及总预算约束扇出，用固定反例比较误合并、召回与总成本。当前未验证。详见[Q07](#research-q07)。

<a id="plugin-1399279897-root"></a>

## [@y9931666/dsh-plugin-crossfire](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire) [![npm 30d 669](https://img.shields.io/static/v1?label=npm+30d&message=669&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire)

> **用途**：面向已形成方案、代码解释或其他待核成果的人。开评审明确subject/立场/维度，红队专家挑缺陷，收集成逐条pending，由读者认定/驳回并写理由，定稿保历史；复审只核上一轮认定项。目标是让缺陷与个人裁决可见，而不是让多个模型投票自动证真。

> **亮点**：将只读工具受限专家、真实persona/发言、pending缺陷与人工理由/历史复审接为一套可追踪流程，不让专家自动作最终真值。详见[Q02](#research-q02)。

> **思考**：Web缺connection时放行，actor和preferredRoot来自body非强授权；锁仅进程内，report发言/预算非事务，RPC collect没透传坏行数。endorsed/settled仍是人的状态而非独立复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索认证actor/允许根与record版本绑定、缺陷证据版本收据和可恢复发言/预算事件，比较未授权接受/缺口/复核成本；未实现。详见[Q07](#research-q07)。

<a id="plugin-1363429979-plugin-memory"></a>

## [@zzerx/dsh-plugin-memory](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,223](https://img.shields.io/static/v1?label=npm+30d&message=2%2C223&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory)

> **用途**：DSH用户希望跨会话复用偏好和项目约定，并可人工修订与回看来源。详见[Q01](#research-q01)。

> **亮点**：将原文、后台提炼/判定、记忆工具与scope注入/图谱管理接为跨会话流程。详见[Q01](#research-q01)。

> **思考**：本地存储不等离线提炼，项目全小写可串目录，模型scope默认global，合并/遗忘多副本非事务。详见[Q03](#research-q03)。

> **建议**：可研究待确认候选、身份/来源版本合并及全副本遗忘收据，以串项目和并发反例比较错召回与恢复。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1337467566-root"></a>

## [dsh-anchored-monitor](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md)

[![GitHub ★ 13](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-anchored-monitor) [![npm 30d 973](https://img.shields.io/static/v1?label=npm+30d&message=973&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor)

> **用途**：研究某模型推理表达轨迹并可视化；自动干预需极严格验证。

> **亮点**：将流式推理指纹、窗口和实验日志做成实时仪表与可配置状态机。详见[Q02](#research-q02)。

> **思考**：默认启用会话打断/自动续跑，README 却称默认仅监测；HTTP CORS:* 无鉴权且配置可改 monitorUrl。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：默认只读、受保护的统计摘要和人工批准干预能降低误打断；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1359423472-root"></a>

## [dsh-codevault](../../plugins/1014029855--dsh-codevault/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault)

> **用途**：读者保存源码认识并重复回访，要求对象/版本坐标、真实依据和档案恢复可解释。

> **亮点**：稳定对象卡、快记展开与回访/历史接线使记录可积累，标准文本易迁移；内容依据仍由读者核查。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：vault仅词法守卫且stat递归跟链接、全文读后裁剪；expand/delete改旧行限制历史，整体JSONL与多派生文件非事务。详见[Q02](#research-q02)。

> **建议**：可探讨修订/tombstone日志与最小vault入口，固定source ref并加realpath/扫描预算；涉及迁移、擦除与日志增长取舍，未验证。详见[Q04](#research-q04)。

<a id="plugin-1380181057-root"></a>

## [dsh-fact-check](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/7starsseeker/dsh-fact-check) [![npm 30d 1,388](https://img.shields.io/static/v1?label=npm+30d&message=1%2C388&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fact-check) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fact-check)

> **用途**：读者核实公开主张/数字，需真实正文、独立来源与反证，而非模型记忆。

> **亮点**：将来源独立、反证、未知分级和可选降档判据组织为可复用流程，取证/判断仍由执行者承担。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：提示规则不自动保证正文/引用真实或来源独立，小语料判据也不等泛化准确；URL无版本快照影响长期复核。详见[Q02](#research-q02)。

> **建议**：可探讨逐主张证据账本，绑定源头/固定原文/位置/矛盾和判据版本再装配报告；有隐私/存储和维护成本，未验证。详见[Q05](#research-q05)。

<a id="plugin-1336585522-root"></a>

## [dsh-feed](../../plugins/863683348--dsh-feed/INSIGHT.md)

[![npm 30d 92](https://img.shields.io/static/v1?label=npm+30d&message=92&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feed) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-feed)

> **用途**：查询 DSH 插件候选并向其他界面复用机器可读索引。

> **亮点**：模型工具、CLI 和实验性 MCP 共用可 diff JSON 索引，详见[Q03](#research-q03)。

> **思考**：默认覆盖有限、同插件跨源可能双计，网络部分失败仍更新时间；路径约束仅词法检查，详见[Q01](#research-q01)、[Q02](#research-q02)。

> **建议**：以仓库/包关联身份与显式分页/失败状态减少双计和假新鲜，反证及代价见[Q05](#research-q05)；真实路径写入仍需独立约束。

<a id="plugin-1336649545-root"></a>

## [dsh-insight](../../plugins/863683348--dsh-insight/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-insight) [![npm 30d 821](https://img.shields.io/static/v1?label=npm+30d&message=821&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-insight) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-insight)

> **用途**：面对插件目录的用户需要回答“哪些值得装、如何配、是否安全”；基线是逐个读 README、源码和安装说明。合格结果是候选能追溯到数据库/源码，安全扫描与需求匹配分开呈现，最终 verdict 明确证据强弱且不会自动安装。 详见[Q01](#research-q01)。

> **亮点**：相对人工搜索，它把发现、环境组合、健康与静态安全放到同一询问入口，减少上下文切换；但“统一 verdict”容易把不同证据等级压成单一标签。静态规则与内置数据的新鲜度决定价值，不能替代固定版本源码研究、真实安装或宿主验收。 详见[Q03](#research-q03)。

> **思考**：核心质疑是分数与 verdict 是否具有校准意义。若插件数据过期、静态扫描误报/漏报或权重无法解释，单一建议会放大错误信心；扫描本地目录只看可匹配模式，不会运行数据流、权限或外部服务。建议名为 install 也不构成用户授权。 详见[Q04](#research-q04)。

> **建议**：未验证假设是把 verdict 改成可追溯证据图，并在数据过期或扫描未覆盖时拒绝给出 install，可降低误导。最小实验让两名审查者对 30 个插件做盲审，与现 verdict/证据图 verdict 比较一致率、严重漏报和复核时间；若可追溯版不降低高风险误判则否定。 详见[Q08](#research-q08)。

<a id="plugin-1412857520-root"></a>

## [dsh-ledger-memory](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory) [![npm 30d 3,016](https://img.shields.io/static/v1?label=npm+30d&message=3%2C016&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory)

> **用途**：面向跨很多轮/会话推进同一项目的DSH用户。活跃台账承接现状，决策/目标/经验卡存长期资产，活动日志保事件，压缩前后胶囊和seq索引帮助找回原话，handoff让新会话继续。它管理的是人和模型维护的项目记忆，不是自动证明项目事实的数据库。

> **亮点**：将项目文件/卡片、每轮记忆接线、被压seq索引和先index后点读组合，settings缺认证拒绝、原则用真实卡片grant，减少纯摘要盲回读。详见[Q02](#research-q02)、[Q04](#research-q04)。

> **思考**：原则grant按sid未绑定root/正文/版本；全量落盘有manual/紧急旁路；超cap单事件按事件边界无法回读，文本不是原始事件全结构。记忆写可自动git add，多资产非事务。详见[Q03](#research-q03)、[Q05](#research-q05)、[Q07](#research-q07)。

> **建议**：可探索项目/材料/省略收据、原则内容与版本授权、压缩对象hash/超大事件分块及独立Git偏好，比较污染/恢复和总成本；未实现。详见[Q09](#research-q09)。

<a id="plugin-1351375738-root"></a>

## [dsh-literature](../../plugins/aik358--dsh-literature/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-literature) [![npm 30d 1,892](https://img.shields.io/static/v1?label=npm+30d&message=1%2C892&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-literature) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-literature)

> **用途**：在DSH中研究写作的人将文献标识归为可复读资产；合格结果需身份、版本、全文与保存目标一致，不能仅依赖saved标签。

> **亮点**：把标识识别、元数据、PDF阅读、引用与多目标归档接成会话内状态机，并用阶段错误和同key下载去重组织恢复；底层学术API和PDF.js归属上游，当前下载缺陷限制兑现。详见[Q02](#research-q02)。

> **思考**：全文候选push读取未声明trusted，源码与lib产物相同，静态可见会在候选构造触发错误；启动还会尝试无关Doctor detached supervisor。均未运行复现，不能当作已验收闭环。详见[Q03](#research-q03)。

> **建议**：可探索分开“文件已存”与“文献身份已确认”的归档收据，用标识/版本、PDF哈希及用户核对减少同名和预印本错归档；尚未实现和验证。详见[Q06](#research-q06)。

<a id="plugin-1381989584-root"></a>

## [dsh-ls125-uv-probe](../../plugins/2333hutao--dsh-ls125-uv-probe/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2333hutao/dsh-ls125-uv-probe)

> **用途**：工程师需脱离原装仪表用自制 MCU 读取紫外探头，并复核字段、单位与清零操作。

> **亮点**：针对单一探头整理命令、字段、CRC、参考固件和抓取路线，比通用串口教程更具可操作性。详见[Q02](#research-q02)。

> **思考**：“完全逆向/全部测量证据”范围超出本包可见材料：原始案例在另仓，列出的三份样本只见一份，部分字节和命令仍未定。详见[Q03](#research-q03)。

> **建议**：逐项结论绑定可重放采样偏移与硬件版本，清零加单独确认/前后快照，可降低工程误用；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1344714964-root"></a>

## [dsh-math-olympiad](../../plugins/988hj7tczd-oss--dsh-math-olympiad/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-math-olympiad) [![npm 30d 104](https://img.shields.io/static/v1?label=npm+30d&message=104&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-math-olympiad) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-math-olympiad)

> **用途**：辅助 IMO/Putnam 等竞赛题解题、证明校验和讲解输出。

> **亮点**：把求解、对抗验证、最多两轮修复和弃权写成可加载流程；详见[Q01](#research-q01)。

> **思考**：验证器隔离只由 Skill 文本纪律和模拟测试示例体现，生产期未见执行性保证；详见[Q02](#research-q02)。

> **建议**：若真实独立验证器仅接证明正文，错误证明通过率或可下降；需盲测并核入参，详见[Q03](#research-q03)。

<a id="plugin-1415767842-root"></a>

## [dsh-moli](../../plugins/27painter--dsh-moli/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/27painter/dsh-moli) [![npm 30d 1,514](https://img.shields.io/static/v1?label=npm+30d&message=1%2C514&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-moli) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-moli)

> **用途**：面向 JavaScript 渲染、选择器抽取、登录态页面和截图/PDF；静态公开页用普通 fetch 更短、更少供应链。 详见[Q01](#research-q01)。

> **亮点**：同一工具覆盖 Markdown、HTML、语义树、JSON、截图和 PDF，价值在浏览器渲染与可编程提取，而非替代所有网页读取。 详见[Q03](#research-q03)。

> **思考**：约 101MB 的独立二进制与下载执行扩大供应链；安装器只报告 SHA256，未内置可信期望值，登录页效果也取决于 Moli 配置。 详见[Q04](#research-q04)。

> **建议**：若把期望 SHA256 绑定到发行版本，并记录冷启动/选择器成功率，可把“自动装浏览器”从便利功能变成可审计依赖。 详见[Q08](#research-q08)。

<a id="plugin-1415116420-root"></a>

## [dsh-obsidian-board](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board)

> **用途**：个人笔记库问答、找原文并回存知识。详见[Q01](#research-q01)。

> **亮点**：把搜索、来源阅读、流式问答与保存放进同页闭环。详见[Q01](#research-q01)。

> **思考**：索引直接读可含外链md而读源另有realpath，自动回退可能更换资料接收者，同名保存非独占。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：研究统一索引/读源物理限额、取消预算与provider白名单、独占保存和历史CAS，比较召回/停止/恢复。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1336663456-root"></a>

## [dsh-plugin-academic-writing](../../plugins/863683348--dsh-plugin-academic-writing/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-academic-writing) [![npm 30d 1,733](https://img.shields.io/static/v1?label=npm+30d&message=1%2C733&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-academic-writing) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-academic-writing)

> **用途**：服务已经有真实研究材料、需要论文骨架/引用初稿/格式片段和机械文本检查的DSH用户。单工具十种action提供outline/title/abstract/citation/check/checklist/references/latex/structure/glossary；模型或作者写正文，插件不检索文献、不核事实/引用真伪，也不生成真实研究结果。

> **亮点**：用一个模型工具提供可重复模板/格式和机械检查，纯逻辑不另发网络或写文件，帮助起草而非学术验收。详见[Q02](#research-q02)。

> **思考**：非global捕获regex的match.length不是出现次数；缺作者APA类型分支、引用去重/style覆盖、LaTeX列数/转义有缺口，passed/清单不证明质量。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索带位置/范围/未知的规则收据和有版本规范样例/格式前置校验，比较错误与人工纠错；未实现。详见[Q06](#research-q06)。

<a id="plugin-1336223158-root"></a>

## [dsh-plugin-audit](../../plugins/863683348--dsh-plugin-audit/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-audit) [![npm 30d 817](https://img.shields.io/static/v1?label=npm+30d&message=817&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-audit) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-audit)

> **用途**：在 DSH 生态选择待评估插件并跟踪仓库健康度。

> **亮点**：提供可解释的元数据分数与按需安全线索，详见[Q01](#research-q01)。

> **思考**：深扫失败被落成空扫描并在工具输出中表现为 clean，可能覆盖既有证据；详见[Q02](#research-q02)。

> **建议**：区分抓取失败与有效扫描，保留旧结果并展示覆盖范围；反证条件及代价见[Q05](#research-q05)。

<a id="plugin-1336663504-root"></a>

## [dsh-plugin-finance-data](../../plugins/863683348--dsh-plugin-finance-data/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-finance-data)

> **用途**：Agent 在有已核来源/口径的数字上做格式化、收益与风险计算。

> **亮点**：将常见财务算术从模型口算转为确定性工具，并提示数据来源/口径。详见[Q01](#research-q01)。

> **思考**：四类财务比率在计算层和展示层各乘 100；多年 plan 默认只算 12 期，portfolio 未返回再平衡单。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：统一单位契约并分离最终计算与表格采样，配黄金样本可提高可靠性；修复效果尚未验。详见[Q04](#research-q04)。

<a id="plugin-1334654243-root"></a>

## [dsh-plugin-tavily](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tavily)

> **用途**：在 DSH 中用 Tavily 网页检索并可配置页面提取与费用控制。

> **亮点**：整合搜索、提取、参数配置、多键轮换与回退，详见[Q01](#research-q01)。

> **思考**：无 key search 在 HTTP 前抛缺凭据；符合持久缓存写入条件时原始 API key 会作为 JSON 键落盘；详见[Q02](#research-q02)。

> **建议**：对缓存 key 使用不可逆标识、明确无 key 搜索路径并以正式扩展机制显示 GUI，可改善可用性和凭据边界；待验证，详见[Q02](#research-q02)。

<a id="plugin-1336684054-root"></a>

## [dsh-plugin-verify](../../plugins/863683348--dsh-plugin-verify/INSIGHT.md)

[![npm 30d 831](https://img.shields.io/static/v1?label=npm+30d&message=831&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-verify) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-verify)

> **用途**：主张下结论/配置或插件元数据检查前定位材料，仍需读原文/标准解析和真实验收。

> **亮点**：统一文本定位和多类元数据入口并保留单项行号，非语义事实证明或安全审计。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：60%关键词就verified/high未校准，batch丢证据/静默截断，YAML仅词法且rawfetch缺Host网络围栏。详见[Q02](#research-q02)。

> **建议**：可探讨分级检查/覆盖收据，batch保完整来源/反证，语法/Schema/加载分开并核网络策略，资源/人工成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1335047324-root"></a>

## [dsh-read-url](../../plugins/2672243194--dsh-read-url/INSIGHT.md)

[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=yellow&logo=github&style=flat)](https://github.com/2672243194/dsh-read-url) [![npm 30d 2,587](https://img.shields.io/static/v1?label=npm+30d&message=2%2C587&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-read-url) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-read-url)

> **用途**：研究者与开发者需要从公开来源获得可核对的紧凑正文，交付以关键事实和出处为准，不以HTTP成功或字符变少为准。

> **亮点**：把多格式解码、正文提取、分页续读、缓存及并发工具接入DSH，减少模型手工组织抓取；成熟网络与提取机制的组合不等于原创引擎，作者效果对照未独立验证。详见[Q03](#research-q03)。

> **思考**：成功返回的紧凑文本不证明完整覆盖，启发式提取和分页失败会留下遗漏；提供方缺失回退与显式直连例外还改变网络信任边界。源码支持这些条件判断，未作运行复现。详见[Q04](#research-q04)。

> **建议**：可探索可核对压缩阅读收据，将每页来源、通道、原文哈希和停止原因附在提取结果中，检验是否减少遗漏误判；新增存储与token负担，尚未验证。详见[Q08](#research-q08)。

<a id="plugin-1416950630-root"></a>

## [dsh-sciwork](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork)

> **用途**：单人科研组织和写稿/图/投稿准备，须人工核原文、统计和现行刊方要求。

> **亮点**：普通文件科研库把方法指引、登记、引用与投稿材料接线集中，便于迁移和复用，非新科学方法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：字段/引用键检查不证明原文支持；面板检查较CLI弱，fail仍可导出；词法路径和并发快照不构成真实隔离/一致收据。详见[Q02](#research-q02)。

> **建议**：可探讨一致快照与分级证据收据，绑定实际ZIP字节、档案版本和人工支持关系，事务/存储成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1334269686-root"></a>

## [dsh-scrape-webpage](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) [![npm 30d 1,067](https://img.shields.io/static/v1?label=npm+30d&message=1%2C067&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)

> **用途**：面向需要把公开网页正文交给模型分析的 DSH 用户，用一个工具完成抓取、正文提取与失败降级。 [Q01](#research-q01)

> **亮点**：相对直接 curl 或 fetch，它将多获取路径与正文规整封装为单一 DSH 工具，贡献是降低网页材料进入会话的接线负担，而不是替代完整浏览器自动化。 [Q03](#research-q03)

> **思考**：静态抓取对登录、脚本渲染、反爬和页面结构变化敏感；源码结构能证明降级路径存在，但没有同站点样本证明正文完整性和稳定性。 [Q04](#research-q04)

> **建议**：可增加“证据保真模式”，同时返回正文、关键 DOM 定位和被删除区块摘要，让研究任务在压缩上下文时仍能回查来源。 [Q08](#research-q08)

<a id="plugin-1423253220-root"></a>

## [dsh-search](../../plugins/439436269-ctrl--dsh-search/INSIGHT.md)

[![npm 30d 239](https://img.shields.io/static/v1?label=npm+30d&message=239&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-search) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-search)

> **用途**：适合需要搜索语法、结果条数、正文和多页汇总可控的研究任务；已有 web_search/fetch 且需求简单时不必增加供应商。 详见[Q01](#research-q01)。

> **亮点**：搜索与正文抓取在同一 API 方言下串成可预算研究，优势是字段一致与权威度/日期等元数据。 详见[Q03](#research-q03)。

> **思考**：无法替代登录、点击和强 SPA 浏览器；转义标点、HTML 壳与正文缺失会影响结果，摘要也不是独立事实验证。 详见[Q04](#research-q04)。

> **建议**：给 research 增加 maxCost 和逐 URL 去重/停止条件，可把“自动多页”变成可证明不超预算的检索单元。 详见[Q08](#research-q08)。

<a id="plugin-1331846104-root"></a>

## [dsh-stock-market](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)

> **用途**：个人用户在DSH内获取公开证券资料并核对来源、时点和口径；不以插件查询成功替代交易或投资判断。

> **亮点**：把底层公开源收敛成9个业务工具，保留来源/回退/降级原因，并把会话工具目录限制与最终拒绝结合，减少任意URL拼接和只隐藏按钮的漏洞面。详见[Q02](#research-q02)。

> **思考**：回退成功不是多源核验，fetched_at不是行情时间，degraded也不证明口径可比；会话guard依赖真实Agent和宿主契约，公开源无稳定服务保证。详见[Q03](#research-q03)。

> **建议**：可探索按原问题时效/口径需求生成数据适用性收据，以固定陈旧、缺时间及跨复权样本比较误用与解释成本；未实现。详见[Q06](#research-q06)。

<a id="plugin-1336582509-root"></a>

## [dsh-trend-radar](../../plugins/863683348--dsh-trend-radar/INSIGHT.md)

[![npm 30d 111](https://img.shields.io/static/v1?label=npm+30d&message=111&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-trend-radar) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-trend-radar)

> **用途**：想观察 DSH 插件新增、stars 变化和 awesome 收录趋势。

> **亮点**：把 GitHub/awesome 快照历史转成可查询趋势与 session 面板起点。详见[Q01](#research-q01)。

> **思考**：数据目录不存在且首次直接 collect 时，先读后建目录可使快照受 ENOENT 阻断；top100 更新排序不是全生态，详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：修复空目录初始化、稳定 cohort/分页及类别映射和 watch 游标，才能形成可靠趋势雷达；待验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="plugin-1337487779-root"></a>

## [dsh-ultramath](../../plugins/andiii208--dsh-ultramath/INSIGHT.md)

[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/dsh-ultramath)

> **用途**：数学建模竞赛团队需从读题、求解、验证到论文审稿的组织模板。

> **亮点**：把分阶段数模资产、五角色预设、模型库、模板和审稿脚本打包为可发现入口，降低流程搭建成本；核心流程执行依赖模型与上游工具。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：“全自动/独立验算/盲评”多为提示文本，不能保证模型正确或真正独立；同步还会清理同名目标目录额外文件，安装前须核所有权和备份。详见[Q03](#research-q03)。

> **建议**：从已有阶段提示/同模型评审出发，若每席受强制异方法和可重放数字证据约束，可能降低相关错误漏检；需等预算公开题目对照漏检率与总成本，若无改善或成本超预注册阈值即证伪。条件、代价与比较详见[Q05](#research-q05)。

<a id="plugin-1335219884-root"></a>

## [dsh-web-tools](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=yellow&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools)

> **用途**：需要多源可用性和社媒详情的研究任务，必须区分发现片段/原生详情与完整范围。详见[Q01](#research-q01)。

> **亮点**：在标准Web接口下保留服务商特性、健康容灾、自定义协议与原生平台接线，减少逐接口维护。详见[Q01](#research-q01)。

> **思考**：统一外包装丢截断/最终URL/检索方式，off仅限制两Web工具、required失败完成也放行；通用页DNS预检未绑定最终socket。详见[Q04](#research-q04)。

> **建议**：从源到工具贯穿策略/完整性/成本收据，并给page fetch预检IP绑定；按裁剪/降级/DNS/模式与预算反例比较误用，未验证。详见[Q09](#research-q09)。

<a id="plugin-1400385991-packages-dsh-weekly-panel"></a>

## [dsh-weekly-panel](../../plugins/514006234--dsh-weekly-check--packages-dsh-weekly-panel/INSIGHT.md)



> **用途**：DSH Web 内查看插件周榜与免费模型状态，减少切换页面；安装与效率待核。详见[Q01](#research-q01)。

> **亮点**：把外部榜单接入 DSH Web 槽位，提供可复制安装命令和只读数据代理；不是榜单生产者。详见[Q01](#research-q01)。

> **思考**：重试无法强制上游刷新且宿主旧值回退被客户端当正常新数据；未经校验 repo 进入粘贴命令、非 reciprocal 一律标赞助。详见[Q03](#research-q03)与[Q04](#research-q04)。

> **建议**：未验证方向是将数据年龄和 stale 显示到面板、明确刷新语义，并限制 repo 与赞助分类输入，以契约矩阵和目标宿主体验验收。详见[Q06](#research-q06)。

<a id="plugin-1412897932-root"></a>

## [dsh-weknora-archive](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md)



> **用途**：已部署 WeKnora、希望把 DSH 对话沉淀为团队知识库的用户可用它按游标增量读取 DSH 会话，清洗并摘要后去重上传到 WeKnora，支持手动工具与定时归档；合格结果是只归档新增且符合筛选条件的会话，重复内容不重复写入，失败可定位并重试。详见[Q01](#research-q01)。

> **亮点**：补齐 DSH 到 WeKnora 的增量写入链，将会话提取、摘要、指纹去重与上传串成一个可调度流程。它相对“人工导出会话、整理 Markdown 后上传，或只使用 WeKnora 检索而不自动写入”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **思考**：摘要会把模型判断引入档案，隐私过滤和去重指纹不能保证敏感内容不外发或语义重复被识别。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

> **建议**：未来可探索：可在上传前增加可复核的字段级隐私清单与内容寻址回执，让删除、重放和来源追踪成为归档协议的一部分。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

<a id="plugin-1358313559-root"></a>

## [dsh-wsl-obscura](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-obscura)

> **用途**：WSL 环境下定点抓取或渲染网页正文，复杂交互转原生 MCP。详见[Q01](#research-q01)。

> **亮点**：将无头抓取接到 DSH Agent 工具面并明确 MCP/CDP 升级路径。详见[Q01](#research-q01)。

> **思考**：isSafeHttpUrl 仅限协议，不能证明 SSRF 阻断；CLI 与外层超时/缓冲区可能影响结果。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进为固定二进制版本的私网回归矩阵、显式默认 stealth 与输出流式处理。详见[Q05](#research-q05)。

<a id="plugin-1380817560-root"></a>

## [dsh-wsl-obsidian](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-obsidian)

> **用途**：用于对既有 Windows Obsidian 库进行 Agent 辅助整理；知识正确性、同步和覆盖风险仍需人核。详见[Q01](#research-q01)。

> **亮点**：让已有 Obsidian 库可被 Agent 以专用工具操作，并保留原有文件和双链工作方式；相比通用文件工具增加 vault 发现/路径规则，但不解决内容正确性、同步或冲突。详见[Q01](#research-q01)。

> **思考**：safeJoinVault 只验证词法路径，没有 realpath；writeFileSync/appendFileSync 无预期版本或恢复机制。confirm=true 与工具串行声明不足以保护库外 symlink 和 Obsidian 外部编辑。详见[Q03](#research-q03)。

> **建议**：未验证方向是以 realpath 约束目标，写入携带已读内容哈希并进行比较、备份和原子替换；用 symlink/双端竞争/中断夹具比较丢失与误拒绝。详见[Q05](#research-q05)。

<a id="plugin-1381860363-root"></a>

## [dsh-wsl-playwright](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-playwright)

> **用途**：DSH 用户需要读取公开、可能经 JavaScript 渲染的网页内容。

> **亮点**：把无头网页标题/正文读取接入模型工具，减少手工复制，并为 JS 渲染页面提供潜在增量。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：临时目录 ESM 导入与 npx 包解析关系未验证，现有单测不覆盖启动；URL 无内网/重定向边界，fetch 不呈现最终 URL/HTTP 状态。详见[Q03](#research-q03)。

> **建议**：固定可解析的 Playwright 环境并添加目标地址门控、最终 URL/状态审计；在隔离站点矩阵比较成功率/延迟/误访问后再采用，本版未实现。详见[Q04](#research-q04)。

<a id="plugin-1381726438-root"></a>

## [dsh-wsl-vecmem](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-vecmem)

> **用途**：面向需要保存项目碎片而不想上云的 DSH 用户，把短文本写入本地向量库并按 workspace 检索。 [Q01](#research-q01)

> **亮点**：相对把向量直接写 JSON，它把元数据与 Float32 矩阵分离并检测双文件漂移，改善数千条规模的空间和解析负担；业务上仍是轻量碎片库。 [Q03](#research-q03)

> **思考**：双文件写入不是原子事务，崩溃只会被检测而不会自动修复；检索质量依赖本地模型、文本切分和可选 reranker，且缺少任务结果对照。 [Q04](#research-q04)

> **建议**：可加入写前 journal 与原子索引切换，并记录 embedding 模型指纹；模型变更时显式进入重建队列而不是混写或静默失配。 [Q08](#research-q08)

<a id="plugin-1341648244-root"></a>

## [KRouter](../../plugins/398894496-arch--krouter/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)

> **用途**：面向跨Claude Code/Codex/Cursor/DSH工作的个人开发者，希望同一份Markdown记住决定与更改，不用每次重复说明。DSH包只提供七个查询工具接头，完整产品还含可选导入、夜间整理和备份，不会因dsh plugin add自动启动计时器。Obsidian是可选编辑/查看器，不是运行必须的服务。

> **亮点**：将canonical有效状态、ranked分层权重、弱近邻拒绝与来源hash设为默认，跨Agent共用可编辑Markdown；相同两规则BM25基线并未被证明显著超越。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **思考**：canonical过滤无效页，但ranked对旧页仅乘0.25仍可召回；metadata缓存与followlinks不构成新鲜度/物理沙箱。DSH同步执行和可选writer lane权限需分开，未做越界复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索来源版本/适用域/证据级别与冲突收据，区分词面lock和人工确认，比较跨项目错引、覆盖与维护开销；未实现。详见[Q07](#research-q07)。

## 更新时间

2026-10-23
