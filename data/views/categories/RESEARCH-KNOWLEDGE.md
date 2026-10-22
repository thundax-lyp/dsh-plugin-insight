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
| [dock-markdown](#plugin-1340492424-root) | 将Markdown净化渲染、目录与本地资源解析接入Dock。 | 适合有限Markdown阅读；先确认editor依赖、资源来源与截断提示。 |
| [dsh-anchored-monitor](#plugin-1337467566-root) | 对 DSH reasoning 流做词形波段监控，独立进程可自动中断并重置会话。 | 仅隔离 profile 显式关闭干预，先回放验证代理指标；真实使用前需默认只读、身份鉴权及人审。 |
| [dsh-butler-memory](#plugin-1335928912-root) | 通过MCP向DSH模型和用户面板接入Butler长期记忆、修订历史与候选接受/拒绝。 | 当前不建议直接用于重要记忆。 |
| [dsh-codevault](#plugin-1359423472-root) | 把源码阅读认识按仓库/文件/符号合并为Markdown对象卡，以JSONL保存条目并可选关联本地vault。 | 单人单写者独立备份档案可试用，vaultDir先不配置；广泛vault读取前优先修边界。 |
| [dsh-cortex](#plugin-1366089972-workspace-plugins-dsh-cortex) | 按会话活动安排静默巩固，将工具经历归为持久记忆卡，并召回相关卡片与压低重复告警。 | 先少量召回并定期抽查卡片来源，重要故障保持外部告警；先验证重启后记忆仍可恢复再长期使用。 |
| [dsh-fact-check](#plugin-1380181057-root) | 提供多源公开事实核查方法、确定性来源路由和可选Jev降档判据，要求结论附可追溯原文。 | 已有可信搜索/正文环境可试用公开事实研究，Jev按隐私选装，结论依证据并独立复核。 |
| [dsh-feed](#plugin-1336585522-root) | 聚合 GitHub dsh-plugin topic 与 npm keyword 的本地 JSON 索引，供工具、CLI、MCP 查询。 | 隔离工作区试同步，审阅来源与错漏；search 只做候选检索，详见[Q03](#research-q03)。 |
| [dsh-inpage-translator](#plugin-1422488467-root) | 在DSH浏览器页面注入翻译按钮，用宿主模型分块翻译可见文本并支持还原。 | 适合普通公开网页阅读时先试用。 |
| [dsh-ledger-memory](#plugin-1412857520-root) | 为DSH项目维护台账、决策目标经验卡和活动日志，自动注入记忆、压缩前后提供胶囊与seq回读，并支持跨会话交接和项目锁定。 | 先观察，无敏感项目副本中核授权目标/内容、压缩旁路、回读cap、日志披露与Git index变化，再考虑重要记忆。 |
| [dsh-literature](#plugin-1351375738-root) | 在DSH侧窗识别学术文献、获取元数据和全文，提供PDF阅读、引用、笔记及本地库和目录保存。 | 先观察。 |
| [dsh-ls125-uv-probe](#plugin-1381989584-root) | 把 LS125/UVALED-X3 私有 UART 读取协议、抓取分析工具及 F103 参考固件注册成 DSH 技能。 | 只读轮询与离线抓取先行，清零单独审批；在独立仪表/标准光源下复核后才上生产设备。 |
| [dsh-math-olympiad](#plugin-1344714964-root) | 挂载竞赛数学解题 Skill，要求独立验证证明、诚实弃权，并可选编译 PDF。 | 已有可信 subagent 与 DSH base 的团队可隔离试题，逐题核验证器入参、标准解与弃权；详见[Q03](#research-q03)。 |
| [dsh-obsidian-board](#plugin-1415116420-root) | 在DSH三栏面板以本地BM25检索Obsidian笔记，复用宿主模型流式回答、点引用读源并保存回答。 | 先观察，非敏感可信个人库和限定模型通道对照。 |
| [dsh-openviking-enhance](#plugin-1401255267-root) | 在DSH显示OpenViking Studio、会话记忆提交状态及按会话查询的召回内容。 | 适合已有OpenViking的本机用户先观察。 |
| [dsh-pdf-reader](#plugin-1346064150-root) | 用PyMuPDF分析PDF页面内容，按文本、全页预览和高分辨率局部图像组合供视觉模型阅读。 | 适合含图表论文的只读研究，先用标注页面检查漏区与权限边界；关键信息对照原PDF并明确引用页/区域。 |
| [dsh-plugin-academic-writing](#plugin-1336663456-root) | 为DSH提供论文骨架、题目摘要模板、引用和LaTeX片段，以及词法表达、Markdown结构、术语和投稿清单辅助。 | 观察，先修计数/无作者引用/TeX列等基础分支，只当草稿工具，不作学术或投稿验收。 |
| [dsh-plugin-audit](#plugin-1336223158-root) | 同步 GitHub topic/npm 元数据并评分排行，按需对单插件做有限静态安全扫描。 | 只把分数作线索，确认扫描文件覆盖/错误状态后再读固定 SHA 源码、验证安装；详见[Q03](#research-q03)。 |
| [dsh-plugin-education](#plugin-1336663611-root) | 提供教案、测验结构校验、量规、学习卡片、可读性及成绩统计辅助。 | 适合生成初稿和整理已有成绩。 |
| [dsh-plugin-finance-data](#plugin-1336663504-root) | DSH Agent 的确定性金融算术工具，但比率文本、跨年定投和组合再平衡路径存在可核不一致。 | 修复关键路径前不用于真实决策；以 10/100 比率、2 年月投和组合偏离样本验每个 action。 |
| [dsh-plugin-roundtable 圆桌会议](#plugin-1342524723-root) | 在 DSH 以拓扑视图组织多角色专家协作、讨论、汇聚与用户决策。 | 有明确讨论目标的人先用少数专家；定预算并读原文分歧，核对真实状态和消息路径，再扩大阵容，别让会议代替最终验收。 |
| [dsh-plugin-tavily](#plugin-1334654243-root) | 接管 DSH web_search 的 Tavily provider，并提供可选提取服务、设置卡和主机探测路由。 | 待修复缓存与 keyless；需用真实凭据在受控 Profile 验证搜索/提取/回退及 API 权限；详见[Q03](#research-q03)。 |
| [dsh-plugin-verify](#plugin-1336684054-root) | 通过关键词行号、JSON/YAML检查、URL/npm/GitHub探测及有界批量输出，提供核查线索和元数据。 | 先观察，作线索而非证实/安全通行证，先修证据语义/覆盖与网络范围再评估。 |
| [dsh-read-url](#plugin-1335047324-root) | 读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。 | 适合用公开网页查资料并愿意核对原来源的人在独立profile试用，先明确提供方缺失时的网络回退权限，默认不加直连例外；缺页、政策误绕过或预算失控时停用。 |
| [dsh-sciwork](#plugin-1416950630-root) | 把科研Agent预设、普通文件库、文献与期刊档案、绘图指引和投稿材料面板接到同一工作流。 | 先观察，在无敏感单人副本核引用/路径/快照/恢复；档案检查和导出不等投稿合规。 |
| [dsh-scrape-webpage](#plugin-1334269686-root) | 抓取网页正文、结构、链接与关键词，可选下载内容图片并交给扩展分析器。 | 已有用户可保留正文抓取用途，先在公开测试页核对重定向、动态内容与超时；非 Windows 环境先验证 shell 回退，限制敏感网络目标。 |
| [dsh-search](#plugin-1423253220-root) | 把 DeepSeek Search/Fetch 接口接入 DSH，支持结构化搜索与正文抓取。 | 需要结构化公开网页材料的用户可评估；版本、价格和API字段回读原文，登录态或交互站点另用浏览器，先核实账户计费口径。 |
| [dsh-stock-market](#plugin-1331846104-root) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。 |
| [dsh-study-coach](#plugin-1400498179-root) | 用学习教练预设、知识图谱和证据账本组织个人学习，面板与专属工具共享学习档案。 | 有长期证据整理需求时可评估；先把档位用于复习安排，升学或资格判断仍需独立测评，不能用计数代替正确性核验。 |
| [dsh-trend-radar](#plugin-1336582509-root) | 按需采集 GitHub dsh-plugin topic/awesome 快照并生成趋势报告、关键词雷达和实验性 Web 面板。 | 先隔离建立空目录并复核首轮成功，再核查报告采样分母与类别映射；勿把 top100 榜当全生态。 |
| [dsh-ultramath](#plugin-1337487779-root) | 同步数模竞赛主控/角色预设、模型库与论文模板。 | 只在备份同名 DSH 目录的隔离 profile 试点；按题目核数据、模型、数值和论文，不以提示门禁代替独立验收。 |
| [dsh-vision](#plugin-1335664137-root) | 为纯文本模型接入多通道识图，提供图片面板、视觉工具和会话证据记忆。 | 已有可用视觉通道且愿意核对原图时可试。 |
| [dsh-web-tools](#plugin-1335219884-root) | 为DSH统一搜索与抓取接口适配多Provider、自定义JSON源及X/小红书原生浏览器检索。 | 可信本机公开任务试用并核原始来源/预算，严格隔离/全量内容要求先核具体缺口。 |
| [dsh-weekly-panel](#plugin-1400385991-packages-dsh-weekly-panel) | 将外部 DSH 插件周榜代理到 Web 主面板，展示排行、模型与推荐位并复制安装命令。 | 仅作非关键周榜浏览观察；复制安装命令及赞助内容前核原始仓库和数据，关键决策待修正新鲜度提示。 |
| [dsh-weknora-archive](#plugin-1412897932-root) | 抽取 DSH 本地会话，规则生成 Markdown 摘要并写入 WeKnora 知识库。 | 仅无敏感样本指定已存在知识库先试用，人工审摘要并核远端解析；含密钥历史会话暂不自动上传。 |
| [dsh-wsl-fetch](#plugin-1362694736-root) | 为DSH网页抓取注册代理感知的HTTP提供者，限制重定向、响应大小与返回文本。 | 先用公开小页面确认代理生效，保留抓取截断标志；不要把URL过滤当作完整网络访问隔离。 |
| [dsh-wsl-obscura](#plugin-1358313559-root) | 从 WSL 调用 Obscura 无头浏览器的 status/fetch 工具，并提供 MCP 接线提示。 | 先 status 后公开 URL 样本 fetch，私网防线按 Obscura 版本独立验；交互用 MCP。 |
| [dsh-wsl-obsidian](#plugin-1380817560-root) | 给 WSL 中的 DSH Agent 提供 Windows Obsidian 笔记库的状态、检索、读写和桌面打开工具。 | 建议观察，在测试 vault/备份副本先核 status、读写新文件和 Windows 显示；重要共享库暂不自动覆盖。 |
| [dsh-wsl-playwright](#plugin-1381860363-root) | 在 WSL 经 npx 启动无头 Chromium，读取 URL 标题、状态或正文。 | 观察。 |
| [dsh-wsl-vecmem](#plugin-1381726438-root) | 使用 Ollama 嵌入在本地存储短文本，并按工作区进行语义检索。 | 适合可丢弃的项目碎片试用；保留独立原始笔记和双文件备份，固定嵌入模型，不按 strong 自动采信，不用作唯一记录。 |
| [dsh-youreyes](#plugin-1335045545-root) | 为文本模型接入OpenAI兼容、Gemini、Ollama及IDE视觉通道并保存视觉证据。 | 需要多端点或本地视觉的用户可先在隔离会话试用；显式设置通道与允许目录，别只凭图片输入开关判断模型已经支持原图推理。 |
| [GLM 图片视觉工具](#plugin-1335070045-packages-vision-tool) | 将本地单张图片发送至智谱 GLM，返回图片问答或 OCR 中文文本。 | 适合允许图片出网且缺原生视觉的场景做非敏感样本验证；财务、身份或关键数字需人工回读，不将OCR文本当真值。 |
| [KRouter](#plugin-1341648244-root) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | 有条件试用lookup-only。 |
| [Moli 浏览器工具](#plugin-1415767842-root) | 通过本地 Moli 引擎渲染页面，读取选区并生成截图或 PDF。 | 确需JS渲染时可在隔离环境先验证引擎；确认TLS策略和安装来源后再接真实账号，普通文章优先比较轻量HTTP路径。 |

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

<a id="plugin-1340492424-root"></a>

## [dock-markdown](../../plugins/aks1st--dock-markdown/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-markdown) [![npm 30d 900](https://img.shields.io/static/v1?label=npm+30d&message=900&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-markdown) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-markdown)

> **用途**：阅读工作区说明文档并跳转相关文件，必要时切换编辑器。

> **亮点**：把文档目录、锚点、资源优先级和编辑切换整合成阅读工作流；渲染与净化归上游库，不是新Markdown方言。

> **思考**：文件读取实际依赖另一个插件路由，workbench/files注入成功不能证明文档可读。资源解析有意不限工作区，读取外部绝对资源是功能边界；继承editor截断意味着长文可能不完整，不能当全文审阅。

> **建议**：未验证假设：为每个资源展示最终来源根并对缺依赖/截断显式告警，可减少错误阅读。用同名资源多根、缺editor、大文档和失效链接核定位正确率及用户误读。

<a id="plugin-1337467566-root"></a>

## [dsh-anchored-monitor](../../plugins/aik358--dsh-anchored-monitor/INSIGHT.md)

[![GitHub ★ 13](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-anchored-monitor) [![npm 30d 973](https://img.shields.io/static/v1?label=npm+30d&message=973&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor)

> **用途**：研究某模型推理表达轨迹并可视化；自动干预需极严格验证。

> **亮点**：将流式推理指纹、窗口和实验日志做成实时仪表与可配置状态机。详见[Q02](#research-q02)。

> **思考**：默认启用会话打断/自动续跑，README 却称默认仅监测；HTTP CORS:* 无鉴权且配置可改 monitorUrl。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：默认只读、受保护的统计摘要和人工批准干预能降低误打断；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1335928912-root"></a>

## [dsh-butler-memory](../../plugins/andyyang12345--dsh-butler-memory/INSIGHT.md)

[![npm 30d 773](https://img.shields.io/static/v1?label=npm+30d&message=773&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-butler-memory) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-butler-memory)

> **用途**：用户与Agent共同管理长期记忆，合格写入需正确owner/revision/audit且用户知道候选与已存记忆区别。

> **亮点**：贡献是模型与可视管理两条通道接同一记忆体系、离线健康提示；真正记忆检索/权限/审计归独立butler-memory-mcp与数据库，本接入不重实现。

> **思考**：双通道是否共享一致权限与状态？独立进程各有生命周期，候选接受只传candidate_id，owner/revision校验依赖上游不能凭面板宣称确认；10秒超时不取消已提交MCP动作。作者已明确此DSH接入停止维护，旧兼容不能外推当前版本。

> **建议**：由双进程及未知结果推导，可统一共享桥接并返回写入收据/版本冲突，超时仅查候选最终状态而不重放。未验证；并发accept/reject、丢响应、进程重启后双方视图应一致且不重复写。

<a id="plugin-1359423472-root"></a>

## [dsh-codevault](../../plugins/1014029855--dsh-codevault/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault)

> **用途**：读者保存源码认识并重复回访，要求对象/版本坐标、真实依据和档案恢复可解释。

> **亮点**：稳定对象卡、快记展开与回访/历史接线使记录可积累，标准文本易迁移；内容依据仍由读者核查。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：vault仅词法守卫且stat递归跟链接、全文读后裁剪；expand/delete改旧行限制历史，整体JSONL与多派生文件非事务。详见[Q02](#research-q02)。

> **建议**：可探讨修订/tombstone日志与最小vault入口，固定source ref并加realpath/扫描预算；涉及迁移、擦除与日志增长取舍，未验证。详见[Q04](#research-q04)。

<a id="plugin-1366089972-workspace-plugins-dsh-cortex"></a>

## [dsh-cortex](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-cortex/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：长期运行Agent-Body的用户希望跨会话保留失败教训和重复做法，并减少常驻告警噪声。

> **亮点**：组件src/index.ts以agent/pre-step判断活动，静默后按工具记录确定性生成卡片，关键词加权召回，权重衰减归档；重复告警收敛静默。

> **思考**：不让心跳和维护调用冒充会话活动能避免永不巩固；自动抽取的打法可能只记录偶然成功，需要真实任务对照。

> **建议**：先少量召回并定期抽查卡片来源，重要故障保持外部告警；先验证重启后记忆仍可恢复再长期使用。

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

<a id="plugin-1422488467-root"></a>

## [dsh-inpage-translator](../../plugins/7gzgn--dsh-inpage-translator/INSIGHT.md)



> **用途**：在DSH浏览器阅读外文网页的用户希望原位翻译并可对照原文；合格交付是重点信息忠实、覆盖范围明确且页面交互可恢复。

> **亮点**：相对复制网页文字到聊天，增量是宿主凭据留在宿主侧、页面按钮仅提交标记，再将批量译文映回原文位置。去重后限额与按模型路线缓存减少重复文本处理，属于成熟翻译/DOM机制在缺少工具栏扩展点下的组合。

> **思考**：整页原位替换是否保留语义与页面行为？固定范围不含iframe/图像/输入框，动态DOM可覆盖译文，失败块又按原文回退；因此按钮完成并不表示整页已翻。后台枚举私有runtime.providers与provider.sessions也使当前页面选择、导航期间回填和兼容性成为核心边界。没有翻译忠实度评测。

> **建议**：由部分覆盖和可还原标记推导，可将翻译结果作为带DOM文本摘要与版本的旁路层：回填前核对节点原文未变，失败/跳过区域可见标记，并保留原文可一键比较。未验证假设是提高覆盖可信度且减少动态页面错位。对实时更新与嵌套标签页测试，若错配或阅读负担不降则否定。

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

<a id="plugin-1415116420-root"></a>

## [dsh-obsidian-board](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board)

> **用途**：个人笔记库问答、找原文并回存知识。详见[Q01](#research-q01)。

> **亮点**：把搜索、来源阅读、流式问答与保存放进同页闭环。详见[Q01](#research-q01)。

> **思考**：索引直接读可含外链md而读源另有realpath，自动回退可能更换资料接收者，同名保存非独占。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：研究统一索引/读源物理限额、取消预算与provider白名单、独占保存和历史CAS，比较召回/停止/恢复。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1401255267-root"></a>

## [dsh-openviking-enhance](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/A2chitect/dsh-openviking-enhance) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-openviking-enhance) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-openviking-enhance)

> **用途**：使用OpenViking记忆服务的用户需要知道会话何时入库和能检索什么；合格结果是提交/失败状态可追溯，不能把可检索内容当模型实际采用内容。

> **亮点**：相比切到独立Studio，增量是在会话旁汇总记忆写入与查询状态，保留失败和具体viking路径；不实现OpenViking提取算法，也不负责记忆写入。

> **思考**：Memory recall是否就是该轮真实用过的证据？代码基于最近消息重新search，结果受查询截断、缓存和服务当前状态影响，且加入resources来源；它是可重做的查询观察，不是历史召回收据。分数颜色也不代表事实可信度或模型采用。

> **建议**：由重新查询与真实使用差异推导，可由原记忆插件输出不可变召回收据，绑定查询、结果版本及注入状态，面板分别展示历史实际召回与当前重新检索。未验证；以记忆更新前后同会话检查是否仍能还原原轮证据，若不能则否定。

<a id="plugin-1346064150-root"></a>

## [dsh-pdf-reader](../../plugins/angeloszou--dsh-pdf-reader/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-pdf-reader) [![npm 30d 774](https://img.shields.io/static/v1?label=npm+30d&message=774&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pdf-reader) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pdf-reader)

> **用途**：读论文图表/公式时整页缩图可能丢细节，合格交付是答案引用的页面与区域可核而非只生成PNG。

> **亮点**：增量是内容感知的预览→区域→定点放大流程和路径交付，避免整页平均分配图像预算；提取/渲染归PyMuPDF，视觉理解归模型。

> **思考**：自动裁图是否保证“无布局丢失”？列数、math fonts和表格块检测是启发式，图题或跨栏公式可能漏/裁断，路径返回也不表示模型已读。absPath允许绝对路径，helper宿主执行未见独立session sandboxPolicy检查，不能认定与普通read权限等价。

> **建议**：由低清全页与局部裁图推导，可返回区域覆盖图和可疑未覆盖块，让视觉模型选择补裁并绑定page/bbox引用。未验证；标注双栏/跨页表/公式集比较漏读率、答案正确率及总图像调用成本，若只增图不增正确率则否定。

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

<a id="plugin-1336663611-root"></a>

## [dsh-plugin-education](../../plugins/863683348--dsh-plugin-education/INSIGHT.md)

[![npm 30d 955](https://img.shields.io/static/v1?label=npm+30d&message=955&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-education) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-education)

> **用途**：适合教师准备材料骨架和汇总已有分数，内容正确性与教学适切性仍由教师负责。

> **亮点**：作者定位教学工具包；可确认增量是把结构化准备和基础计算作为确定工具交给模型调用，减少反复排版和数值汇总。相对纯模型生成，形式校验可重复；并没有自动理解题意、确认答案或评估学生真实能力。

> **思考**：validateQuiz只检查结构和答案索引范围，合法索引也可能指向错误答案。readability把Flesch启发式分数映射A1-A2至C2，没有语言测评校准；中文只看句长。index参数对象重复定义items，后定义的grade通用对象覆盖quiz详细schema，削弱工具层字段约束。

> **建议**：待验证假设：让工具输出结构有效、答案已核、教学适配三种独立状态，可减少valid被误读为题目正确。用格式合法但答案错误、文化背景依赖和多语阅读样本，比较教师漏检与改稿时间；不把可读性分数当能力认证。

<a id="plugin-1336663504-root"></a>

## [dsh-plugin-finance-data](../../plugins/863683348--dsh-plugin-finance-data/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-finance-data)

> **用途**：Agent 在有已核来源/口径的数字上做格式化、收益与风险计算。

> **亮点**：将常见财务算术从模型口算转为确定性工具，并提示数据来源/口径。详见[Q01](#research-q01)。

> **思考**：四类财务比率在计算层和展示层各乘 100；多年 plan 默认只算 12 期，portfolio 未返回再平衡单。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：统一单位契约并分离最终计算与表格采样，配黄金样本可提高可靠性；修复效果尚未验。详见[Q04](#research-q04)。

<a id="plugin-1342524723-root"></a>

## [dsh-plugin-roundtable 圆桌会议](../../plugins/9931666--dsh-plugin-roundtable/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-roundtable) [![npm 30d 1,464](https://img.shields.io/static/v1?label=npm+30d&message=1%2C464&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable) [![最新发布 2026-10-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable)

> **用途**：复杂问题需要多角色观点和分歧记录，主持人组织专家并把需拍板事项交用户，交付会议记录与结论材料。

> **亮点**：相对一个聊天内模拟角色，增量是持久专家会话、显式通信/预算与用户操作队列，并把状态图与真实子代理状态区分。模型/子代理归DSH，插件主要贡献在协作调度和可追踪材料，不是由专家数推导决策更好。

> **思考**：汇聚和预算是否保留关键分歧并控制全部成本？aggregator按发言顺序每条160字、整体4000字符前截，后来的重要反证可能不进入摘要；预算含估计token与真实计量不同，不能当精确账单硬上限。图中骨架通道也不表示真实传输，持久写入原子不等于所有多文件事实同事务。

> **建议**：待验证假设：摘要按主张/证据/分歧覆盖选取并保留被截反证索引，预算区分实际/估计/在途开销，可减少后发异议被淹没和账单误解。由当前截断与估计计量推导，未实现。把关键反证放末尾、专家长输出与预算边界三组对照，测主持人采纳反证率及真实费用偏差；新增摘要模型成本要单列。

<a id="plugin-1334654243-root"></a>

## [dsh-plugin-tavily](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily)

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

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) [![npm 30d 1,132](https://img.shields.io/static/v1?label=npm+30d&message=1%2C132&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)

> **用途**：研究者读取具体网页时希望得到可引用正文与结构，原有办法是浏览器复制或宿主抓取工具。

> **亮点**：lib/index.js 优先宿主 web.fetch，缺失或异常后经 shell 调用 curl；解析与统计分层，图片逐张下载并调用注册分析器。

> **思考**：分析器注册接口避免把视觉服务绑死，但自动提取并不证明正文完整或网页内容可信。

> **建议**：已有用户可保留正文抓取用途，先在公开测试页核对重定向、动态内容与超时；非 Windows 环境先验证 shell 回退，限制敏感网络目标。

<a id="plugin-1423253220-root"></a>

## [dsh-search](../../plugins/439436269-ctrl--dsh-search/INSIGHT.md)

[![npm 30d 239](https://img.shields.io/static/v1?label=npm+30d&message=239&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-search) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-search)

> **用途**：研究或开发用户先搜候选页面再读取正文，以原始URL为证据完成回答；交付应是可追溯原文依据。

> **亮点**：相对内置搜索入口，提供显式条数、正文预算、查询操作符和搜索加抓取组合；错误与正文节选可直接交给模型复核。上游检索与rerank能力不应归为插件原创。

> **思考**：rerank与authority字段不是事实正确性保证；research只保留开头节选，可能丢失限定条件。billedRequests按成功抓取计数，网络失败自动重试可能已被服务端执行，插件无法证明账单精确等于该字段。README费用和QPS是作者主张，本次未独立核价。

> **建议**：需要结构化公开网页材料的用户可评估；版本、价格和API字段回读原文，登录态或交互站点另用浏览器，先核实账户计费口径。

<a id="plugin-1331846104-root"></a>

## [dsh-stock-market](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)

> **用途**：个人用户在DSH内获取公开证券资料并核对来源、时点和口径；不以插件查询成功替代交易或投资判断。

> **亮点**：把底层公开源收敛成9个业务工具，保留来源/回退/降级原因，并把会话工具目录限制与最终拒绝结合，减少任意URL拼接和只隐藏按钮的漏洞面。详见[Q02](#research-q02)。

> **思考**：回退成功不是多源核验，fetched_at不是行情时间，degraded也不证明口径可比；会话guard依赖真实Agent和宿主契约，公开源无稳定服务保证。详见[Q03](#research-q03)。

> **建议**：可探索按原问题时效/口径需求生成数据适用性收据，以固定陈旧、缺时间及跨复权样本比较误用与解释成本；未实现。详见[Q06](#research-q06)。

<a id="plugin-1400498179-root"></a>

## [dsh-study-coach](../../plugins/ame-choo--dsh-study-coach/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/Ame-Choo/dsh-study-coach) [![npm 30d 353](https://img.shields.io/static/v1?label=npm+30d&message=353&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-study-coach) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-study-coach)

> **用途**：需要长期追踪目标、材料版本、错题与复习的个人学习者；交付是可回看的学习证据和阶段判断，不能把教练给的档位当外部考试认证。

> **亮点**：把“教练说学会了”拆成可追溯证据、受限阶段提升与可撤销重算，并将学习工具限定在教练预设，避免污染所有会话。真正变化是学习进展的记录与修订责任，非工具数量或人格提示本身。

> **思考**：quiz/photo标签怎样证明真实做题且做对？study_record直接接收调用方kind、note与stage；闸门确认类型和累计数量，不独立检查题目难度、重复提交、答案正确性或照片内容。证据ID存在能约束引用悬空，却不能证明掌握度；文件级临时写rename也不构成多个档案间的原子事务。

> **建议**：把“已提交作业”“已核验作答”“迁移题通过”分开，升档只消费可去重的核验证据，可能使阶段更接近真实掌握。以重复照片、自述伪装quiz、训练题通过但迁移题失败的固定案例盲评；若高档位仍不能预测独立迁移题表现，就否定该阶段设计的有效性。

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

<a id="plugin-1335664137-root"></a>

## [dsh-vision](../../plugins/54xkeee--dsh-vision/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-vision) [![npm 30d 1,431](https://img.shields.io/static/v1?label=npm+30d&message=1%2C431&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-web) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-web)

> **用途**：适合保持文本主模型、额外理解截图或表格的用户；应保留原图作为最终核对依据。

> **亮点**：作者把免API key的豆包Web作为默认卖点；源码更有价值的增量是将识图结果分成中性证据与当前问题回答，绑定图片摘要并复用到后续对话。相对每轮手工截图另问视觉模型，减少重复调用；视觉推断仍由通道模型完成。

> **思考**：Web桥接依赖已登录Chrome及页面结构，零API现金不等于零维护成本。auto档根据视觉模型自己给出的complexity决定是否深查，漏判可能跳过必要第二遍；JSON解析失败回退文本且默认simple，不能据此宣称可靠升级。

> **建议**：待验证假设：用OCR密度与用户任务类型等确定信号补充complexity自报，可降低密集界面漏升级。对固定标注截图比较漏字率、额外调用和延迟；若召回改善不足以抵消双遍开销，则保持人工深查。

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



> **用途**：本地会话沉淀为可检索知识，需要项目/会话身份、敏感内容审阅和远端解析验收。

> **亮点**：提供 DSH 会话抽取与 WeKnora 写侧编排，规则摘要无需 LLM；检索与嵌入效果仍依赖 WeKnora。详见[Q02](#research-q02)。

> **思考**：dry_run 在创建库之后才生效，摘要直接引用用户文本/命令且无凭据脱敏；短 ID 和固定 100 项列表限制去重可靠性。详见[Q03](#research-q03)。

> **建议**：可先本地脱敏并审阅带强会话身份的摘要，再幂等上传、验解析；用 canary、碰撞与 >100 文档对照，尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1362694736-root"></a>

## [dsh-wsl-fetch](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-fetch)

> **用途**：WSL内直接访问公开网页失败而Windows代理可用时，让现有web_fetch使用代理通路。

> **亮点**：在宿主原抓取接口下替换传输路径，而不是让用户另学一套工具；有内容上限和取消信号，贡献是代理与宿主的受限集成。

> **思考**：私网检查主要基于URL字面主机名，源码未在该路径固定域名解析结果；因此拦截私有IP字面量不能证明域名最终不会访问私网。

> **建议**：待验证假设：代理侧统一检查解析目的地与重定向，可能比插件内重复维护IP规则更一致；需要明确代理与宿主的职责边界。

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

> **用途**：已有本地模型的个人开发者保存项目碎片，期望跨会话查到正确事实；交付是带原文和检索阶段的候选片段，不是权威知识库。

> **亮点**：相对 JSON 内嵌浮点向量，sidecar 降低文本解析/存储负担；相对单阶段相似度，增加可降级 rerank 和显式阶段信息。算法本身继承成熟向量检索，作者注释中的体积/命中实例不是本次独立实测。

> **思考**：关键是返回 confidence 能否代表可相信的事实。源码对 embedding 和 rerank 分数用同一0.15/0.45阈值，未见校准；仅检维数不足以识别同维度换模型。JSON 解析失败回空库，双文件非事务，不能当可靠长期存储。

> **建议**：适合可丢弃的项目碎片试用；保留独立原始笔记和双文件备份，固定嵌入模型，不按 strong 自动采信，不用作唯一记录。

<a id="plugin-1335045545-root"></a>

## [dsh-youreyes](../../plugins/54xkeee--dsh-youreyes/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-youreyes) [![npm 30d 1,126](https://img.shields.io/static/v1?label=npm+30d&message=1%2C126&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-youreyes) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-youreyes)

> **用途**：适合已有多种视觉端点、希望保留文本主模型的截图分析；本地Ollama适合需要控制图片外传的任务。

> **亮点**：作者主张给纯文本模型看图；可确认的贡献是将通用兼容端点及本地Ollama纳入同一视觉证据流程，而非限定单一视觉供应商。README明确继承vision-toolkit机制；缓存、分层证据和压缩恢复属集成实现，不是新视觉算法。

> **思考**：插件声明图片输入只表示能转交外部识图，不会改变主模型固有能力。空的allowedImageDirs不限制本地图片目录；auto通道选择和云端回退须核对，否则本地识图的预期可能与实际数据路径不符。文字证据可能遗漏原图细节。

> **建议**：待验证假设：给每条视觉证据附加不可变通道与外传策略，并在回退前检查策略，可减少本地隐私预期错配。以本地失效和云端可用的组合验证是否阻止未授权回退，同时测可用性损失。

<a id="plugin-1335070045-packages-vision-tool"></a>

## [GLM 图片视觉工具](../../plugins/314857493--dsh-vision--packages-vision-tool/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/314857493/dsh-vision) [![npm 30d 1,192](https://img.shields.io/static/v1?label=npm+30d&message=1%2C192&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-free-eyes) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-free-eyes)

> **用途**：缺少原生图片输入的DSH会话，针对已知绝对路径图片提问或转录文字；交付GLM生成的文本观察，需按用途复核关键数字。

> **亮点**：相对用户另开视觉模型复制结果，贡献是单工具完成本地读图、问答/OCR及缓存，避免依赖外部CLI。图片理解与识别能力归GLM；提示明确图像文字不应当作执行指令，但这只是工具语义约束。

> **思考**：“免费眼睛”不保证长期无成本，更不保证结果正确。图片一定上传第三方，缓存命中会跳过新请求；顺序回退可能增加延迟。包声明DSH<0.2.0，不能从工具注册代码存在推出现代宿主兼容。

> **建议**：适合允许图片出网且缺原生视觉的场景做非敏感样本验证；财务、身份或关键数字需人工回读，不将OCR文本当真值。

<a id="plugin-1341648244-root"></a>

## [KRouter](../../plugins/398894496-arch--krouter/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)

> **用途**：面向跨Claude Code/Codex/Cursor/DSH工作的个人开发者，希望同一份Markdown记住决定与更改，不用每次重复说明。DSH包只提供七个查询工具接头，完整产品还含可选导入、夜间整理和备份，不会因dsh plugin add自动启动计时器。Obsidian是可选编辑/查看器，不是运行必须的服务。

> **亮点**：将canonical有效状态、ranked分层权重、弱近邻拒绝与来源hash设为默认，跨Agent共用可编辑Markdown；相同两规则BM25基线并未被证明显著超越。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **思考**：canonical过滤无效页，但ranked对旧页仅乘0.25仍可召回；metadata缓存与followlinks不构成新鲜度/物理沙箱。DSH同步执行和可选writer lane权限需分开，未做越界复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索来源版本/适用域/证据级别与冲突收据，区分词面lock和人工确认，比较跨项目错引、覆盖与维护开销；未实现。详见[Q07](#research-q07)。

<a id="plugin-1415767842-root"></a>

## [Moli 浏览器工具](../../plugins/27painter--dsh-moli/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/27painter/dsh-moli) [![npm 30d 1,514](https://img.shields.io/static/v1?label=npm+30d&message=1%2C514&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-moli) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-moli)

> **用途**：需要读取JS渲染网页、登录页面或保存页面图片的研究者；交付可读正文、选区文本或本地截图/PDF，静态页优先与普通HTTP抓取对照。

> **亮点**：浏览器能力来自 lexmount/moli；插件的贡献是DSH工具契约、选择器读取、Windows文件捕获及引擎探测/安装的集成。选择器计数可区分“没有匹配”与正文为空，比直接把空输出当成功更清楚。

> **思考**：能调用浏览器不证明网页可信或默认安全。index.js 默认 insecureTls=true；引擎独立下载，安装器默认没有预期校验和，记录其SHA只证明执行了哪些字节。作者选择器字符缩减示例不是同质量跨站收益验证。

> **建议**：确需JS渲染时可在隔离环境先验证引擎；确认TLS策略和安装来源后再接真实账号，普通文章优先比较轻量HTTP路径。

## 更新时间

2026-10-22
