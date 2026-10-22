# 研究与知识

[返回首页](../../../README.md)

信息检索、网页读取、笔记与长期知识。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [dock-markdown](#plugin-1340492424-root) | 将Markdown净化渲染、目录与本地资源解析接入Dock。 | 适合有限Markdown阅读；先确认editor依赖、资源来源与截断提示。 |
| [DSH Literature](#plugin-1351375738-root) | 在 DSH 侧窗识别文献、抓取元数据、下载阅读 PDF 并管理本地文献库。 | 需要会话旁阅读/归档可评估其设计；先修复并核对下载候选变量，再考虑核心全文流程，不依据作者一键/全文宣称直接采用。 |
| [dsh-butler-memory](#plugin-1335928912-root) | 通过MCP向DSH模型和用户面板接入Butler长期记忆、修订历史与候选接受/拒绝。 | 当前不建议直接用于重要记忆。 |
| [dsh-codevault](#plugin-1359423472-root) | 把源码阅读整理成可检索的仓库、文件和符号卡片，并关联本地知识库。 | 先给一个常读模块建卡，代码更新后核对引用和过期结论，不把历史笔记直接当现状。 |
| [dsh-cortex](#plugin-1366089972-workspace-plugins-dsh-cortex) | 按会话活动安排静默巩固，将工具经历归为持久记忆卡，并召回相关卡片与压低重复告警。 | 先少量召回并定期抽查卡片来源，重要故障保持外部告警；先验证重启后记忆仍可恢复再长期使用。 |
| [dsh-evidence-gate](#plugin-1365519118-root) | 按工具活动索引检查结论自报依据，提供判定卡、会话开关与账本。 | 需要声明可追溯性的团队可评估其账本；不能将绿色VERIFIED作为测试通过、真实阅读或事实正确的唯一证据。 |
| [dsh-fact-check](#plugin-1380181057-root) | 为 DSH 提供多源网页事实核查 Skill，含来源路由和可选 Jev 判据工具。 | 经常做资料核查的人可先用低风险题目检查来源和正文；保留未核实，遇到转载、封闭生态或无反证时别自动升置信，重要结论由人复核。 |
| [dsh-inpage-translator](#plugin-1422488467-root) | 在DSH浏览器页面注入翻译按钮，用宿主模型分块翻译可见文本并支持还原。 | 适合普通公开网页阅读时先试用。 |
| [dsh-ls125-uv-probe](#plugin-1381989584-root) | 为 LS125 UVALED-X3 紫外探头提供 UART 协议、抓取分析工具与 STM32F103 主机固件的技能包。 | 已有对应硬件的工程人员可把它当复核起点，先只读轮询并对照原表，核对电气连接、CRC与单位后再试清零；不直接将示例读数用于要求校准证明的交付。 |
| [dsh-math-olympiad](#plugin-1344714964-root) | 提供竞赛数学求解、独立验证及信心/弃权输出的技能流程，可选编译PDF。 | 适合学习和初步证明检查。 |
| [dsh-mermaid](#plugin-1334569498-root) | 按视口延迟渲染已完成Mermaid代码块，并提供缩放与错误报告入口。 | 先核宿主代码块兼容；错误修复按钮会尝试发送消息，使用前保留已有草稿。 |
| [dsh-obsidian-board](#plugin-1415116420-root) | 将本地 Obsidian 笔记库接入 DSH 三栏问答面板，提供本地关键词检索和可点击引用。 | 已有结构清楚的Markdown笔记库可先用已知答案测试原词、同义改写和外部资料问题，逐条点引用核对；涉及敏感笔记时先确认所选模型通道允许发送检索片段。 |
| [dsh-openviking-enhance](#plugin-1401255267-root) | 在DSH显示OpenViking Studio、会话记忆提交状态及按会话查询的召回内容。 | 适合已有OpenViking的本机用户先观察。 |
| [dsh-pdf-reader](#plugin-1346064150-root) | 用PyMuPDF分析PDF页面内容，按文本、全页预览和高分辨率局部图像组合供视觉模型阅读。 | 适合含图表论文的只读研究，先用标注页面检查漏区与权限边界；关键信息对照原PDF并明确引用页/区域。 |
| [dsh-plugin-academic-writing](#plugin-1336663456-root) | 提供论文结构、标题、摘要、引文格式和措辞检查等确定性写作辅助。 | 适合用来起草骨架和初筛格式。 |
| [dsh-plugin-education](#plugin-1336663611-root) | 提供教案、测验结构校验、量规、学习卡片、可读性及成绩统计辅助。 | 适合生成初稿和整理已有成绩。 |
| [dsh-plugin-roundtable 圆桌会议](#plugin-1342524723-root) | 在 DSH 以拓扑视图组织多角色专家协作、讨论、汇聚与用户决策。 | 有明确讨论目标的人先用少数专家；定预算并读原文分歧，核对真实状态和消息路径，再扩大阵容，别让会议代替最终验收。 |
| [dsh-plugin-tavily](#plugin-1334654243-root) | 把Tavily搜索与页面提取接入宿主web服务，提供参数设置、额度状态与引擎切换。 | 先确认安装后的默认引擎和查询数据去向，用少量已知问题核对来源；额度错误时处理key，不期待自动换引擎掩盖失败。 |
| [dsh-plugin-verify](#plugin-1336684054-root) | 提供工作区关键词证据检索、配置检查及URL、npm和GitHub只读探测。 | 适合把它当检索和体检辅助。 |
| [dsh-sciwork](#plugin-1416950630-root) | 提供科研模式预设、本地科研库面板、文献和数据管理及投稿前检查流程。 | 适合愿意使用目录式科研库的用户。 |
| [dsh-scrape-webpage](#plugin-1334269686-root) | 抓取网页正文、结构、链接与关键词，可选下载内容图片并交给扩展分析器。 | 已有用户可保留正文抓取用途，先在公开测试页核对重定向、动态内容与超时；非 Windows 环境先验证 shell 回退，限制敏感网络目标。 |
| [dsh-search](#plugin-1423253220-root) | 把 DeepSeek Search/Fetch 接口接入 DSH，支持结构化搜索与正文抓取。 | 需要结构化公开网页材料的用户可评估；版本、价格和API字段回读原文，登录态或交互站点另用浏览器，先核实账户计费口径。 |
| [dsh-stock-market](#plugin-1331846104-root) | 为DSH提供沪深A股行情侧栏与股票数据工具，按会话控制工具访问并标注多源回退口径。 | 适合只读资料研究，先交叉核对报价时点和来源，降级结果分开用。 |
| [dsh-study-coach](#plugin-1400498179-root) | 用学习教练预设、知识图谱和证据账本组织个人学习，面板与专属工具共享学习档案。 | 有长期证据整理需求时可评估；先把档位用于复习安排，升学或资格判断仍需独立测评，不能用计数代替正确性核验。 |
| [dsh-trend-radar](#plugin-1336582509-root) | 采集插件目录与GitHub主题快照，分析新增、Star变化和分类分布，并输出趋势面板。 | 适合对限定样本做探索性观察。 |
| [dsh-ultramath](#plugin-1337487779-root) | 向DSH同步数学建模竞赛预设、模型库和论文模板，组织推导、编码、验算及评审流程。 | 适合学习或可控建模试验，先用已知解小题验证数据→代码→论文链。 |
| [dsh-vision](#plugin-1335664137-root) | 为纯文本模型接入多通道识图，提供图片面板、视觉工具和会话证据记忆。 | 已有可用视觉通道且愿意核对原图时可试。 |
| [dsh-web-tools](#plugin-1335219884-root) | 将多个Web搜索和提取服务以及社交平台接到DSH标准搜索接口，提供路由和故障切换。 | 适合已有多搜索服务的用户先用固定研究问题对照。 |
| [dsh-websearch](#plugin-1340340493-root) | 为 DSH 提供聚合网页搜索 provider，合并多个后端结果并支持过滤、缓存和故障降级。 | 先选少量可访问后端，用常见中文与时效问题核对出处、耗时和全部调用预算；逐步增加有独立增益的服务。 |
| [dsh-weekly-panel](#plugin-1400385991-packages-dsh-weekly-panel) | 在 DSH 侧栏展示插件周榜、免费模型状态和标明来源性质的推荐位。 | 想在DSH里查看中文榜单可先试只读面板；看清数据日期与赞助/互推标识，复制安装命令后仍要检查插件自身要求。 |
| [dsh-weknora-archive](#plugin-1412897932-root) | 提取DSH会话并生成启发式总结，增量上传到用户配置的WeKnora知识库。 | 先审阅脱敏摘要并在测试WeKnora使用固定库ID。 |
| [dsh-wsl-fetch](#plugin-1362694736-root) | 为DSH网页抓取注册代理感知的HTTP提供者，限制重定向、响应大小与返回文本。 | 先用公开小页面确认代理生效，保留抓取截断标志；不要把URL过滤当作完整网络访问隔离。 |
| [dsh-wsl-obscura](#plugin-1358313559-root) | 封装Obscura浏览器CLI，提供状态、网页抓取与MCP接入提示。 | 从无eval、无私网访问的小页面开始，核对正文和截断，不把MCP提示当已接通服务。 |
| [dsh-wsl-obsidian](#plugin-1380817560-root) | 连接Windows或WSL的Obsidian笔记库，提供搜索、读取、写入与打开笔记。 | 明确指定测试vault并备份，避免在正在编辑的重要笔记上直接写入；检查符号链接。 |
| [dsh-wsl-playwright](#plugin-1381860363-root) | 在WSL中通过无头Chromium读取网页标题、状态与正文。 | 先在干净WSL完成小页面验证；有登录态、复杂交互或完整取证需求时不要只依赖body文本。 |
| [dsh-wsl-vecmem](#plugin-1381726438-root) | 使用 Ollama 嵌入在本地存储短文本，并按工作区进行语义检索。 | 适合可丢弃的项目碎片试用；保留独立原始笔记和双文件备份，固定嵌入模型，不按 strong 自动采信，不用作唯一记录。 |
| [dsh-youreyes](#plugin-1335045545-root) | 为文本模型接入OpenAI兼容、Gemini、Ollama及IDE视觉通道并保存视觉证据。 | 需要多端点或本地视觉的用户可先在隔离会话试用；显式设置通道与允许目录，别只凭图片输入开关判断模型已经支持原图推理。 |
| [Forge 记忆](#plugin-1363429979-plugin-memory) | 为 DSH 保存偏好、项目决策与关系化记忆，支持检索和跨会话使用。 | 先记录少量明确偏好，测试修改和删除后是否停止影响回答，再扩展自动积累。 |
| [GLM 图片视觉工具](#plugin-1335070045-packages-vision-tool) | 将本地单张图片发送至智谱 GLM，返回图片问答或 OCR 中文文本。 | 适合允许图片出网且缺原生视觉的场景做非敏感样本验证；财务、身份或关键数字需人工回读，不将OCR文本当真值。 |
| [KRouter](#plugin-1341648244-root) | 以本地 Markdown 知识库为多种 Agent 提供带出处的记忆查询、纠错与拒答机制。 | 有决策知识库且愿维护状态时可先只读试用，核查来源页与拒答；不要把默认检索成功等同于记忆正确，导入与夜间写作应单独设置。 |
| [Moli 浏览器工具](#plugin-1415767842-root) | 通过本地 Moli 引擎渲染页面，读取选区并生成截图或 PDF。 | 确需JS渲染时可在隔离环境先验证引擎；确认TLS策略和安装来源后再接真实账号，普通文章优先比较轻量HTTP路径。 |
| [URL 正文阅读器](#plugin-1335047324-root) | 读取网页、JSON 与订阅源，清理正文并提供分页续读和批量读取。 | 适合已有抓取结果噪声多、常需中文编码和续读的场景先对照使用；答案依赖表格或动态页面时核对原文与截断标记。 |
| [VeriScope 门禁重放](#plugin-1422943787-root) | 对已有逐条评分执行三态阈值判定，保存并复验绑定输入与策略的回执。 | 已有评测结果且需要可追溯裁决的团队可先用构造样本核验策略；把PASS解释为当前输入满足该阈值，真正发布仍由接入方执行器负责。 |

<a id="plugin-1340492424-root"></a>

## [dock-markdown](../../plugins/aks1st--dock-markdown/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-markdown) [![npm 30d 900](https://img.shields.io/static/v1?label=npm+30d&message=900&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-markdown) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-markdown)

> **用途**：阅读工作区说明文档并跳转相关文件，必要时切换编辑器。

> **亮点**：把文档目录、锚点、资源优先级和编辑切换整合成阅读工作流；渲染与净化归上游库，不是新Markdown方言。

> **思考**：文件读取实际依赖另一个插件路由，workbench/files注入成功不能证明文档可读。资源解析有意不限工作区，读取外部绝对资源是功能边界；继承editor截断意味着长文可能不完整，不能当全文审阅。

> **建议**：未验证假设：为每个资源展示最终来源根并对缺依赖/截断显式告警，可减少错误阅读。用同名资源多根、缺editor、大文档和失效链接核定位正确率及用户误读。

<a id="plugin-1351375738-root"></a>

## [DSH Literature](../../plugins/aik358--dsh-literature/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-literature) [![npm 30d 1,971](https://img.shields.io/static/v1?label=npm+30d&message=1%2C971&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-literature) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-literature)

> **用途**：研究者把对话中的标识符/标题转成可阅读归档条目，并将阅读问题送回当前会话；合格交付是标识、全文与引用对应正确。

> **亮点**：将文献发现、元数据、阅读与引用集中在会话旁，并把文献状态与Zotero内部schema隔离；工具按意图/面板启用减少无关上下文负担。增量是研究资料交接与本地库集成，不是文献正确性或AI阅读算法创新。

> **思考**：一键落入全文库的核心路径是否成立？src/node/fetch/pdf.js的push闭包读取未声明trusted，且提交lib/index.js同样存在Boolean(trusted)；遇到非空候选URL时有ReferenceError风险，不能以源码/构建目录区别回避。即使修复，AI全文只截前60000字符且页码由模型概括，不能当完整论文核读；“本地”指转发/存储，不代表外部元数据与模型调用不联网。

> **建议**：把每条资料的标识、下载来源、PDF摘要和覆盖页段绑定到引用/问答输出，可减少“元数据正确但全文错误/未读全”的误归属。先以已知PDF和错误候选测试下载链，再对超长论文尾部问题要求明确未覆盖；若仍生成未见页码或引用错误，则不成立。

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

> **用途**：反复阅读相同代码的人需要保留带对象身份的笔记，减少重复整理。

> **亮点**：入口注册 code-reading Skill、read/vault 工具及 /codevault，配置档案目录与可选只读 vault。

> **思考**：对象卡片比聊天时间线容易复用；写得整齐不等于理解准确或跟上代码变更。

> **建议**：先给一个常读模块建卡，代码更新后核对引用和过期结论，不把历史笔记直接当现状。

<a id="plugin-1366089972-workspace-plugins-dsh-cortex"></a>

## [dsh-cortex](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-cortex/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：长期运行Agent-Body的用户希望跨会话保留失败教训和重复做法，并减少常驻告警噪声。

> **亮点**：组件src/index.ts以agent/pre-step判断活动，静默后按工具记录确定性生成卡片，关键词加权召回，权重衰减归档；重复告警收敛静默。

> **思考**：不让心跳和维护调用冒充会话活动能避免永不巩固；自动抽取的打法可能只记录偶然成功，需要真实任务对照。

> **建议**：先少量召回并定期抽查卡片来源，重要故障保持外部告警；先验证重启后记忆仍可恢复再长期使用。

<a id="plugin-1365519118-root"></a>

## [dsh-evidence-gate](../../plugins/aaronandwork--dsh-evidence-gate/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AaronandWork/dsh-evidence-gate) [![npm 30d 888](https://img.shields.io/static/v1?label=npm+30d&message=888&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@aaronandwork/dsh-evidence-gate) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@aaronandwork/dsh-evidence-gate)

> **用途**：用户希望区分Agent亲查、引用和假设，尤其审查“读过文件/测试通过”的承重结论；交付物是可查的声明与匹配记录，非事实真值。

> **亮点**：比纯“不要猜测”的提示多了可追踪活动索引和显式声明判定，区分已引用/未核验以及弱采信计数。贡献是声明纪律与审查线索，而非独立证据验证器；工具日志来自宿主，事实正确性仍需人工或专门验证。

> **思考**：VERIFIED是否超过机制能证明的范围？entryMatches可用basename与包含关系命中，且跨任意其他会话无父子关系限制；某路径存在就能weak却仍verdict=verified。它关联的是活动与文本而非claim语义，也不核工具是否成功或版本一致；模型可跳过工具直接回答，未见输出拦截器。因此“结构强制/实证”应降格为协作约束和启发式匹配。

> **建议**：把活动回执绑定成功状态、内容摘要、当前版本与会话委派谱系，并将weak保持UNVERIFIED，可能降低假验证。用同basename异文件、失败read、旧版本测试及无关会话同路径反例，比较误VERIFIED率和真实证据召回；若误报下降代价是大量真实证据被拒，应展示置信分层而非二值真值。

<a id="plugin-1380181057-root"></a>

## [dsh-fact-check](../../plugins/7starsseeker--dsh-fact-check/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/7starsseeker/dsh-fact-check) [![npm 30d 1,495](https://img.shields.io/static/v1?label=npm+30d&message=1%2C495&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fact-check) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fact-check)

> **用途**：研究者把传闻或数字拆成可核实事实点，抓原文交叉与反向搜索，交付结论、缺口及可追溯来源。

> **亮点**：相对直接问模型凭记忆回答，贡献是把原文、来源独立性、反证和未核实状态写成可复用流程，并以确定性路由和可选判据辅助；DSH增量是Skill provider、同名优先级与编辑失效。搜索服务和Jev判断为外部能力，实际报告质量依执行者，非插件自动保证。

> **思考**：两三来源和“没搜到反证”是否足以高置信？转载可共用单源，检索无反证也可能是覆盖不足；SKILL的要求不是机械验证。作者MEASUREMENTS的小型自建集只测局部判据，sufficient表现不足且工具明确不据此停止搜索，不能把support命中率外推整份事实报告可靠性。

> **建议**：待验证假设：把每条事实的原始发布链与检索覆盖保存为证据图，并让结论门槛依事实类型和时效变化，可减少重复转载计独立及来源数够但要素缺失。依据是当前来源独立规范与局部判据不足，未实现图校验。用同源多转载、单一权威原件和新事件无反证三组盲审，对照独立性误判、未核实标注与时间成本；必须由独立标注者核对，模型自评不作真值。

<a id="plugin-1422488467-root"></a>

## [dsh-inpage-translator](../../plugins/7gzgn--dsh-inpage-translator/INSIGHT.md)



> **用途**：在DSH浏览器阅读外文网页的用户希望原位翻译并可对照原文；合格交付是重点信息忠实、覆盖范围明确且页面交互可恢复。

> **亮点**：相对复制网页文字到聊天，增量是宿主凭据留在宿主侧、页面按钮仅提交标记，再将批量译文映回原文位置。去重后限额与按模型路线缓存减少重复文本处理，属于成熟翻译/DOM机制在缺少工具栏扩展点下的组合。

> **思考**：整页原位替换是否保留语义与页面行为？固定范围不含iframe/图像/输入框，动态DOM可覆盖译文，失败块又按原文回退；因此按钮完成并不表示整页已翻。后台枚举私有runtime.providers与provider.sessions也使当前页面选择、导航期间回填和兼容性成为核心边界。没有翻译忠实度评测。

> **建议**：由部分覆盖和可还原标记推导，可将翻译结果作为带DOM文本摘要与版本的旁路层：回填前核对节点原文未变，失败/跳过区域可见标记，并保留原文可一键比较。未验证假设是提高覆盖可信度且减少动态页面错位。对实时更新与嵌套标签页测试，若错配或阅读负担不降则否定。

<a id="plugin-1381989584-root"></a>

## [dsh-ls125-uv-probe](../../plugins/2333hutao--dsh-ls125-uv-probe/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2333hutao/dsh-ls125-uv-probe)

> **用途**：面向已有LS125/UVALED-X3硬件、想用自有MCU读取紫外测量的嵌入式研究者；合格结果须帧校验正确、量纲匹配并与原仪表对照。

> **亮点**：相比仅给AI一段设备说明，本项把反向协议、否定实验陷阱、示例捕获和MCU实现一起作为资源分发，使Agent能追溯字段和采样方法。CRC/UART均为成熟技术，具体贡献在该探头的协议知识与从仪表脱离的实现材料，不宣称通用仪器协议创新。

> **思考**：样本设备实验能否支持该型号所有探头？PROTOCOL有字段对照、清零和排除实验，提供比单段演示更强的作者证据；但文中“完整原始证据”指向另一技能的case文件，当前分发未含全部原始轮次，偏移16–17含义也未知。21帧正确不能覆盖批次、固件、漂移和长时间计时溢出。

> **建议**：已有对应硬件的工程人员可把它当复核起点，先只读轮询并对照原表，核对电气连接、CRC与单位后再试清零；不直接将示例读数用于要求校准证明的交付。

<a id="plugin-1344714964-root"></a>

## [dsh-math-olympiad](../../plugins/988hj7tczd-oss--dsh-math-olympiad/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-math-olympiad) [![npm 30d 108](https://img.shields.io/static/v1?label=npm+30d&message=108&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-math-olympiad) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-math-olympiad)

> **用途**：适合希望把竞赛题求解与证明质疑分开的学习者；输出是证明、验证结论和有边界的信心。

> **亮点**：作者强调对抗验证与诚实弃权；本项贡献是将Pólya启发、具体失败模式、最多两轮修正和弃权写成可执行提示流程，另有可靠路径挂载。不是形式化证明器，也没有代码强制保证验证器隔离或验证结果正确；数学方法归公开参照，非本项目新定理。

> **思考**：high由模型验证器零缺口决定，并没有校准数据，故不能把标签称统计校准的正确概率。隔离与只传证明是Skill纪律，locator没有调度器 enforcing；smoke的stub传参结构不证明真实宿主不共享历史。用开放问题特化作红旗有启发价值，不能替代逐步证明检查。

> **建议**：未验证假设：将求解者/验证者输入和具体缺口保存为可审阅记录，并用已知真伪题评估high标签，可减少错而自信。对正确证明、隐含条件错误和无解题比较错误接受率、弃权率及额外模型费用；若高信心未改善，取消校准表述。

<a id="plugin-1334569498-root"></a>

## [dsh-mermaid](../../plugins/aks1st--dsh-mermaid/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-mermaid) [![npm 30d 4,325](https://img.shields.io/static/v1?label=npm+30d&message=4%2C325&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mermaid) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-mermaid)

> **用途**：阅读模型生成的流程图、时序图，遇语法错误再主动请求模型修复。

> **亮点**：将流式消息与图渲染时机分离，防半成品反复渲染，并串行处理近视口任务；图布局与净化来自Mermaid上游。

> **思考**：sendToAI会覆盖现有textarea草稿，30ms后只检查非空就发Enter，不证明草稿等于报告或已真正提交；DOM与按键模拟绑定宿主约定。strict与文本/边数上限不能保证任意图渲染性能。

> **建议**：未验证假设：改用宿主草稿事务并在已有草稿时追加/确认，可避免修复入口破坏草稿。以非空草稿、忙状态、不同发送键及快速会话切换核内容保留和实际发送状态。

<a id="plugin-1415116420-root"></a>

## [dsh-obsidian-board](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board)

> **用途**：适合已有Markdown笔记库、希望边问边查出处的知识工作者；合格答案应引用实际支持结论的笔记，而不是仅能打开一个文件。

> **亮点**：相对在Obsidian关键词搜索后复制到聊天，插件把查找、回答和原文核对放在三栏；BM25和中文bigram是成熟方法，具体增量是笔记标题/标签/别名、收集语料降权以及attempt切换时重置输出偏移，减少来源库与模型回退造成的使用断点。不能将算法名称或作者万条笔记耗时认作本次实测。

> **思考**：最影响价值的是引用能否覆盖真正支持结论的笔记。BM25更适合词面匹配，固定0.45收集语料降权能让自有笔记优先，却可能压低用户此刻正要找的外部材料。可点击[n]只证明可回看，不证明检索召回或引用蕴含关系；同义改写与外部资料问题是最强反例。

> **建议**：已有结构清楚的Markdown笔记库可先用已知答案测试原词、同义改写和外部资料问题，逐条点引用核对；涉及敏感笔记时先确认所选模型通道允许发送检索片段。

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

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-academic-writing) [![npm 30d 1,803](https://img.shields.io/static/v1?label=npm+30d&message=1%2C803&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-academic-writing) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-academic-writing)

> **用途**：适合研究者快速准备稿件骨架和检查明显格式问题；研究事实与论证仍需作者确认。

> **亮点**：作者明确模型负责行文、插件负责结构；可确认增量是将常见论文模板和格式操作封成可重复工具，减少模型临时编造格式。相对纯提示生成，更可预测；这不是自动研究、引用真实性验证或投稿规范完整实现。

> **思考**：formatCitation按提供字段拼接，不能验证文献存在，也未覆盖不同姓名文化与所有样式细节。academicCheck的PASSIVE/FIRST_PERSON/HEDGING非全局正则，因此match计数最多1，与出现次数不同；把谨慎措辞或第一人称标出也不表示文风错误。LaTeX转义仅覆盖部分字符，不能承诺片段任意输入可编译。

> **建议**：待验证假设：把格式规则与目标期刊配置及真实引用元数据对齐，可降低一刀切文风误报。用已人工校对的多语引文和不同期刊段落比较格式错误、误报及编辑时间；若规则不能跨语适用，应明确支持子集。

<a id="plugin-1336663611-root"></a>

## [dsh-plugin-education](../../plugins/863683348--dsh-plugin-education/INSIGHT.md)

[![npm 30d 955](https://img.shields.io/static/v1?label=npm+30d&message=955&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-education) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-education)

> **用途**：适合教师准备材料骨架和汇总已有分数，内容正确性与教学适切性仍由教师负责。

> **亮点**：作者定位教学工具包；可确认增量是把结构化准备和基础计算作为确定工具交给模型调用，减少反复排版和数值汇总。相对纯模型生成，形式校验可重复；并没有自动理解题意、确认答案或评估学生真实能力。

> **思考**：validateQuiz只检查结构和答案索引范围，合法索引也可能指向错误答案。readability把Flesch启发式分数映射A1-A2至C2，没有语言测评校准；中文只看句长。index参数对象重复定义items，后定义的grade通用对象覆盖quiz详细schema，削弱工具层字段约束。

> **建议**：待验证假设：让工具输出结构有效、答案已核、教学适配三种独立状态，可减少valid被误读为题目正确。用格式合法但答案错误、文化背景依赖和多语阅读样本，比较教师漏检与改稿时间；不把可读性分数当能力认证。

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

> **用途**：经常做联网研究的用户希望统一搜索参数并取回来源，合格结果是相关且可追溯的证据，不只是搜索成功。

> **亮点**：src/provider.ts实现web.search与fetch提供者，按请求解析密钥环，支持缓存与受限重试；可显式切换或在特定故障时回退DeepSeek。

> **思考**：统一设置和明确回退类型有利于诊断；丰富参数并不能代替同问题的检索质量比较。

> **建议**：先确认安装后的默认引擎和查询数据去向，用少量已知问题核对来源；额度错误时处理key，不期待自动换引擎掩盖失败。

<a id="plugin-1336684054-root"></a>

## [dsh-plugin-verify](../../plugins/863683348--dsh-plugin-verify/INSIGHT.md)

[![npm 30d 839](https://img.shields.io/static/v1?label=npm+30d&message=839&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-verify) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-verify)

> **用途**：Agent研究或插件提交前需要把主张定位到文件与外部元数据；合格交付应是证据与主张逻辑关系清楚，访问成功并不等于主张成立。

> **亮点**：相对模型无依据口述，增量是统一文件行号引用和常见只读探测，把原始线索带回研究过程。它实现的是证据发现与结构体检，不是语义事实验证引擎。

> **思考**：verified与high confidence标签是否过强？scoreClaim仅60%关键词命中即verified，batch的high可由至少两条命中触发；否定、主体归属与相反陈述都可能共享关键词。YAML又只是结构烟检。因此引用可追溯是支持，但不能从覆盖率推出事实正确性或置信概率。

> **建议**：由行级证据与过强判定推导，可将verdict改为“检索覆盖”并附待验证关系，增加相反证据和数字条件核对，再由人或独立验证器形成结论。未验证假设是减少引用正确但结论错误。用相同关键词正反命题盲测，若误verified不降则否定。

<a id="plugin-1416950630-root"></a>

## [dsh-sciwork](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork)

> **用途**：适合已有本地数据与文献、需要组织图表和稿件的科研者；交付物是可迁移的文件库与投稿包。

> **亮点**：作者定位为科研工作台；实际增量是把文件系统作为真相源，面板与CLI共用写入路径，将数据、引用、期刊检查和包清单连接起来。相对散落文件与人工清单，增加登记及溯源；Origin绘图来自外部Fantasality插件，不属于本项目实现。

> **思考**：期刊规则档案的机器检查只能覆盖编码条款，不能替代现行刊方要求或科学正确性。README称面板只读为主，但actions明确包含remove、writeText、runCli等写操作；采用前须按实际动作评估路径和备份，而不能按只读描述判断。

> **建议**：待验证假设：让投稿检查每条结论绑定期刊来源日期及输入文件摘要，可在规则或稿件变化后只重验失效条目。用一组稿件修改和规则变化比较遗漏率与人工核对时间；未验证，不能宣称自动合规。

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

> **用途**：研究者查询公开市场资料，需要来源、时点和指标口径可追溯；行情数据不是交易建议或成交能力。

> **亮点**：相对任意网页抓取或57端点直接暴露，增量是业务动作收敛、来源差异显式化与会话级真实执行拒绝；数据内容来自公开财经站点，不归插件。

> **思考**：自动换源能否维持同一数据语义？源码已标成交额缺失、成交量和排行范围差异，说明成功响应未必可直接横比。免费/免登录可调用不代表授权商业复用或稳定SLA，本轮未接入验证实时性。

> **建议**：由degraded元数据推导，可对每种研究任务声明所需字段/时效/口径契约，回退不满足时拒绝产出可比指标而保留原始差异。未验证；故障换源时比较结论一致性、错误混算和人工复核时间。

<a id="plugin-1400498179-root"></a>

## [dsh-study-coach](../../plugins/ame-choo--dsh-study-coach/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/Ame-Choo/dsh-study-coach) [![npm 30d 353](https://img.shields.io/static/v1?label=npm+30d&message=353&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-study-coach) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-study-coach)

> **用途**：需要长期追踪目标、材料版本、错题与复习的个人学习者；交付是可回看的学习证据和阶段判断，不能把教练给的档位当外部考试认证。

> **亮点**：把“教练说学会了”拆成可追溯证据、受限阶段提升与可撤销重算，并将学习工具限定在教练预设，避免污染所有会话。真正变化是学习进展的记录与修订责任，非工具数量或人格提示本身。

> **思考**：quiz/photo标签怎样证明真实做题且做对？study_record直接接收调用方kind、note与stage；闸门确认类型和累计数量，不独立检查题目难度、重复提交、答案正确性或照片内容。证据ID存在能约束引用悬空，却不能证明掌握度；文件级临时写rename也不构成多个档案间的原子事务。

> **建议**：把“已提交作业”“已核验作答”“迁移题通过”分开，升档只消费可去重的核验证据，可能使阶段更接近真实掌握。以重复照片、自述伪装quiz、训练题通过但迁移题失败的固定案例盲评；若高档位仍不能预测独立迁移题表现，就否定该阶段设计的有效性。

<a id="plugin-1336582509-root"></a>

## [dsh-trend-radar](../../plugins/863683348--dsh-trend-radar/INSIGHT.md)

[![npm 30d 117](https://img.shields.io/static/v1?label=npm+30d&message=117&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-trend-radar) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-trend-radar)

> **用途**：生态研究者想追踪插件供给变化，合格结果须有稳定样本范围和时间基线，不能把被搜索返回的条目数当完整生态规模。

> **亮点**：相对单次静态目录，增量是本地时间序列与可追溯差分，把新增和关注变化变成重复分析流程；不是完整生态监测，也不是用户需求测量。

> **思考**：“新增/移除/热度”是否可由这套快照推断？搜索限前100且按updated滚动，排名退出可能被当移除，新进入可能早已存在；awesome tree也未证明完整无截断。README开头说每小时但FAQ与源码为按工具触发，无后台timer，不能承诺连续观测。Star增速不等于采用增长。

> **建议**：由滚动样本与时间差分推导，可保存total_count、incomplete/truncated状态和稳定repo ID，只对完整已覆盖样本判移除，新增区分首次发现与首次发布。未验证假设是显著减少伪趋势。用固定集合交换搜索顺序的样本检验，若新增/移除仍随排序变化则否定。

<a id="plugin-1337487779-root"></a>

## [dsh-ultramath](../../plugins/andiii208--dsh-ultramath/INSIGHT.md)

[![GitHub ★ 35](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/dsh-ultramath) [![npm 30d 1,512](https://img.shields.io/static/v1?label=npm+30d&message=1%2C512&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ultramath) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ultramath)

> **用途**：竞赛/学习团队需要从题目到可复算论文的产物链，合格交付须数据、代码、数值与论文一致且遵守赛事规则。

> **亮点**：增量是产物目录、阶段责任、独立验算和数字冻结组织成可复用工作流；模型库/LaTeX与宿主delegation由既有工具提供，不据“首个/获奖级”宣称创新。

> **思考**：门禁是否强制保证正确和诚信？多数B1-B9、独立盲评和数字冻结是persona/技能纪律，lib主要同步/公告，未见中央产物状态机硬执行；同模型评委不等于独立专家。启动同步还可能覆盖目标自定义内容并清退旧预设。

> **建议**：由目录产物与数字冻结推导，可把各阶段收据绑定脚本/数据hash，独立验算只读输入与结果，验收通过才提升论文引用版本。未验证；改CSV或代码后应使引用失效，并用异方法核算检验错误传播。

<a id="plugin-1335664137-root"></a>

## [dsh-vision](../../plugins/54xkeee--dsh-vision/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-vision) [![npm 30d 1,431](https://img.shields.io/static/v1?label=npm+30d&message=1%2C431&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-web) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-web)

> **用途**：适合保持文本主模型、额外理解截图或表格的用户；应保留原图作为最终核对依据。

> **亮点**：作者把免API key的豆包Web作为默认卖点；源码更有价值的增量是将识图结果分成中性证据与当前问题回答，绑定图片摘要并复用到后续对话。相对每轮手工截图另问视觉模型，减少重复调用；视觉推断仍由通道模型完成。

> **思考**：Web桥接依赖已登录Chrome及页面结构，零API现金不等于零维护成本。auto档根据视觉模型自己给出的complexity决定是否深查，漏判可能跳过必要第二遍；JSON解析失败回退文本且默认simple，不能据此宣称可靠升级。

> **建议**：待验证假设：用OCR密度与用户任务类型等确定信号补充complexity自报，可降低密集界面漏升级。对固定标注截图比较漏字率、额外调用和延迟；若召回改善不足以抵消双遍开销，则保持人工深查。

<a id="plugin-1335219884-root"></a>

## [dsh-web-tools](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)

[![GitHub ★ 38](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=38&color=yellow&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools)

> **用途**：研究Agent单一搜索配额或服务失败时需继续检索，合格结果还要遵守日期、域名等条件，不能仅以有返回值验收。

> **亮点**：相对最低公分母代理，增量是区分显式硬过滤与软偏好，并在统一接口下编译原生参数与故障链。搜索内容与原生抓取能力属于外部供应商，插件贡献在约束适配和可用性组织。

> **思考**：故障切换后语义是否仍等价？不同provider日期/域名/内容提取接口能力不齐，确定性hint不保证用户自然语言约束完全识别；社交路径还依赖登录浏览器和页面。可用性提高不等于召回正确或证据独立性增加。

> **建议**：由硬软条件和异构后端推导，可在路由前比较每个后端的能力矩阵，不支持硬约束则明确拒绝/标注，返回实际应用条件。未验证；用相同日期和域名任务注入429后比较切换前后的违规结果，若仍静默放宽则否定。

<a id="plugin-1340340493-root"></a>

## [dsh-websearch](../../plugins/240xu--dsh-websearch/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) [![npm 30d 4,802](https://img.shields.io/static/v1?label=npm+30d&message=4%2C802&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)

> **用途**：面向研究/开发问答中需要多个网络来源的DSH用户；合格检索是相关、可访问且支持任务的结果，而非返回链接数量多。

> **亮点**：相对宿主选择单provider或逐后端手搜，本项在一个provider后并发多种来源，避免配置多个provider造成歧义，并把失败原因/冷却状态收敛。RRF源码归因Cormack及RAG-Fusion，不计为原创算法；具体增量是DSH服务接线和失败/取消/结果融合组合。

> **思考**：多后端与RRF是否真正提升证据而非放大共同转载？多个结果列表可能来自相同索引和镜像，RRF积累重复URL排名能提高共识，却不提供独立来源鉴别。并发还会等待失败尾部并增加API预算；部分成功只证明有结果，不能证明覆盖用户问题。

> **建议**：先选少量可访问后端，用常见中文与时效问题核对出处、耗时和全部调用预算；逐步增加有独立增益的服务。重要研究仍应打开原文核查，不能把聚合排序当事实验证。

<a id="plugin-1400385991-packages-dsh-weekly-panel"></a>

## [dsh-weekly-panel](../../plugins/514006234--dsh-weekly-check--packages-dsh-weekly-panel/INSIGHT.md)



> **用途**：希望在DSH内浏览中文插件榜的用户，读取TOP10和免费模型摘要，并复制原生bundle安装命令；判断选型仍需回到项目与核查材料。

> **亮点**：相对打开外部周报页面，本组件把中文榜单与安装命令复制放入DSH流内面板，并对上游不可用保留带stale标记的缓存。loopback防护与槽位写法作者归于dsh-workbench-lite，周报的策展与模型探测属于仓库其他工具；本组件增量是单上游数据桥、面板展示与降级。

> **思考**：“免费模型可用”和“值得装”是否会被读者理解为本机可用与质量保证？面板只消费latest.json，不执行本地模型或插件验收；缓存30分钟叠加周报更新周期，会使成功读取仍展示旧状态。star排序、赞助位与模型极短补全都不证明本地长期可靠，复制命令也不是已安装。

> **建议**：待验证假设：每个条目附固定版本、探测出口地区和数据年龄的小型证据卡，可降低从榜单热度直接推导本机可用的误判。当前只有摘要与stale信息，新增卡片未实现。用同一榜单让用户判断安装前置条件，对照有无卡片的误判率与阅读耗时；若字段缺失导致卡片装饰化，则先要求上游提供可追溯探测记录。

<a id="plugin-1412897932-root"></a>

## [dsh-weknora-archive](../../plugins/aaalenwow--dsh-weknora-archive/INSIGHT.md)



> **用途**：团队想将完成会话变成可检索知识，需要避免重复、保留更新且明确上传范围；合格归档还要确认远端解析成功与敏感信息处理。

> **亮点**：相对手动复制聊天到知识库，增量是把会话发现、去重与结构化总结接到写入端；检索与embedding来自WeKnora，不由本插件提供。

> **思考**：dry_run是否真无外部写入？目标库解析在dryRun分支前，找不到库就调用createKnowledgeBase，因此预览也可能新建库。标题短ID去重还会把已归档但继续增长的会话当跳过，增量是新会话而非内容更新；上传成功也不证明解析成功。

> **建议**：由预览提前建库与标题去重推导，可先构造纯只读计划，确认后以完整session ID+内容摘要幂等写入，新增解析状态验收。未验证；空库dry-run和同会话追加消息对照，若仍写库/漏更新则否定。

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

> **用途**：网页需要浏览器处理而普通HTTP抓取不足时，在DSH中调用已有Obscura。

> **亮点**：把浏览器CLI与WSL路径接通，降低二进制查找和输出处理负担；浏览器能力来自Obscura。

> **思考**：允许eval、截图和私网开关时副作用与数据范围扩大；CLI存在不证明浏览器依赖安装齐全，抓到文本也不等于正文完整。

> **建议**：本次未形成新的创新假设；先为普通抓取与额外权限建立可见的调用边界，再衡量与直接CLI的差异。

<a id="plugin-1380817560-root"></a>

## [dsh-wsl-obsidian](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-obsidian)

> **用途**：Agent需要在既有Obsidian知识库中整理结果，而不重复复制到独立记忆系统。

> **亮点**：把已有笔记文件变为Agent可调用的读写接口，保留Obsidian工作方式；知识正确性和同步语义不由文件桥接自动解决。

> **思考**：safeJoinVault做词法路径包含检查，没有在该函数中解析符号链接；并发编辑与直接writeFileSync也未构成版本冲突保护。

> **建议**：待验证假设：写入要求预期内容摘要并原子替换，可减少Agent覆盖用户同时编辑；需与直接备份策略比较恢复成本。

<a id="plugin-1381860363-root"></a>

## [dsh-wsl-playwright](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-playwright)

> **用途**：普通HTTP抓取不足时，Agent需要浏览器渲染后的页面文字，无需操作Windows交互浏览器。

> **亮点**：把Playwright读网页流程封装成限定工具；浏览器能力来自上游，增量是DSH接线与结果裁剪，不包含通用交互自动化。

> **思考**：npx未锁包版本，临时脚本能否解析到临时包和浏览器是否已安装未经验证；domcontentloaded与body取文不能保证动态内容完整，取文异常还可能返回空正文成功。

> **建议**：待验证假设：锁版本并报告页面就绪条件、取文失败和截断，可提升抓取结果可复核性；收益尚未验证。

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

<a id="plugin-1363429979-plugin-memory"></a>

## [Forge 记忆](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,385](https://img.shields.io/static/v1?label=npm+30d&message=2%2C385&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory)

> **用途**：反复在项目间切换的使用者需要可管理的长期偏好和决策，而非无差别保存聊天。

> **亮点**：storage-domain 支撑实体、关系和审计记录，服务统一管理写入、查询与导入校验。

> **思考**：结构化存储比散落提示词更可管理；错误或跨范围记忆可能持续影响后续决策。

> **建议**：先记录少量明确偏好，测试修改和删除后是否停止影响回答，再扩展自动积累。

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

> **用途**：跨Claude Code、Codex、Cursor和DSH维护决策的用户，需优先引用仍有效页面，未知时不硬凑相近答案。

> **亮点**：相对普通全文检索，实质贡献是默认启用过期页排除和低置信拒答、带出处收据的组合；作者README承认匹配同样规则的全文基线无显著差异，因此不归因为新检索算法。跨Agent共享可编辑Markdown是明确流程增量。

> **思考**：作者基准改善是否说明算法领先？作者报告200题及错误引用率，但同规则BM25差异区间跨零；默认策略、拒答覆盖率和数据构造均可解释部分差异。源码阈值可见，真实知识库写作质量和纠错标注决定有效性，未独立复跑。

> **建议**：有决策知识库且愿维护状态时可先只读试用，核查来源页与拒答；不要把默认检索成功等同于记忆正确，导入与夜间写作应单独设置。

<a id="plugin-1415767842-root"></a>

## [Moli 浏览器工具](../../plugins/27painter--dsh-moli/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/27painter/dsh-moli) [![npm 30d 1,514](https://img.shields.io/static/v1?label=npm+30d&message=1%2C514&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-moli) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-moli)

> **用途**：需要读取JS渲染网页、登录页面或保存页面图片的研究者；交付可读正文、选区文本或本地截图/PDF，静态页优先与普通HTTP抓取对照。

> **亮点**：浏览器能力来自 lexmount/moli；插件的贡献是DSH工具契约、选择器读取、Windows文件捕获及引擎探测/安装的集成。选择器计数可区分“没有匹配”与正文为空，比直接把空输出当成功更清楚。

> **思考**：能调用浏览器不证明网页可信或默认安全。index.js 默认 insecureTls=true；引擎独立下载，安装器默认没有预期校验和，记录其SHA只证明执行了哪些字节。作者选择器字符缩减示例不是同质量跨站收益验证。

> **建议**：确需JS渲染时可在隔离环境先验证引擎；确认TLS策略和安装来源后再接真实账号，普通文章优先比较轻量HTTP路径。

<a id="plugin-1335047324-root"></a>

## [URL 正文阅读器](../../plugins/2672243194--dsh-read-url/INSIGHT.md)

[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=yellow&logo=github&style=flat)](https://github.com/2672243194/dsh-read-url) [![npm 30d 2,642](https://img.shields.io/static/v1?label=npm+30d&message=2%2C642&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-read-url) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-read-url)

> **用途**：研究者和开发者从文档、文章或 API 提取适量内容，交付保留来源及续读位置的正文；已能返回完整正文的宿主 web_fetch 是首选对照。

> **亮点**：相对直接把整页传给模型，增量是内容类型归一、正文清理、按段落截断和可续读的组合。index.js:358-409 保留 provider 的 HTTP/策略错误，减少降级路径绕过上游规则；这比仅比较输出字符数更值得复用。

> **思考**：压缩输出可能把关键表格行、导航或分页上下文一起丢掉。作者旧版竞品表明确不适用于新 DeepSeek Fetch provider，不能据其推出当前优势；缓存、清理和额外分页也会影响新鲜度与耗时。

> **建议**：适合已有抓取结果噪声多、常需中文编码和续读的场景先对照使用；答案依赖表格或动态页面时核对原文与截断标记。

<a id="plugin-1422943787-root"></a>

## [VeriScope 门禁重放](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)

> **用途**：已有RAG或模型逐条评分的评测维护者，判断给定策略下能否放行并保存复验材料；合格交付是范围明确、当前有效的回执，评分真值和实际发布由其他系统负责。

> **亮点**：相对只看均值或旧报告，贡献是把缺证据作为REVIEW、已知FAIL不被留痕异常掩盖，以及让回执有效性依赖输入/策略/环境绑定。V2把最差行诊断与显式逐行门槛分开，避免把“展示最差行”偷换成拒绝规则。

> **思考**：核心质疑是PASS究竟约束到哪里。源码支持当前回执的完整性与阈值裁决，不证明原始评分准确或输入未提前删行；builtin B2明确不支持bind/complete，原replay的managed complete只写自有完成文件，没有拦截外部发布副作用。不能据“门禁”名称声称所有发布被强制保护。

> **建议**：已有评测结果且需要可追溯裁决的团队可先用构造样本核验策略；把PASS解释为当前输入满足该阈值，真正发布仍由接入方执行器负责。

## 更新时间

2026-10-21
