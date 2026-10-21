# 研究与知识

[返回首页](../../../README.md)

信息检索、网页读取、笔记与长期知识。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [dsh-codevault](#plugin-1359423472-root) | 把源码阅读整理成可检索的仓库、文件和符号卡片，并关联本地知识库。 | 先给一个常读模块建卡，代码更新后核对引用和过期结论，不把历史笔记直接当现状。 |
| [dsh-cortex](#plugin-1366089972-workspace-plugins-dsh-cortex) | 按会话活动安排静默巩固，将工具经历归为持久记忆卡，并召回相关卡片与压低重复告警。 | 先少量召回并定期抽查卡片来源，重要故障保持外部告警；先验证重启后记忆仍可恢复再长期使用。 |
| [dsh-ls125-uv-probe](#plugin-1381989584-root) | 为 LS125 UVALED-X3 紫外探头提供 UART 协议、抓取分析工具与 STM32F103 主机固件的技能包。 | 已有对应硬件的工程人员可把它当复核起点，先只读轮询并对照原表，核对电气连接、CRC与单位后再试清零；不直接将示例读数用于要求校准证明的交付。 |
| [dsh-obsidian-board](#plugin-1415116420-root) | 将本地 Obsidian 笔记库接入 DSH 三栏问答面板，提供本地关键词检索和可点击引用。 | 已有结构清楚的Markdown笔记库可先用已知答案测试原词、同义改写和外部资料问题，逐条点引用核对；涉及敏感笔记时先确认所选模型通道允许发送检索片段。 |
| [dsh-plugin-tavily](#plugin-1334654243-root) | 把Tavily搜索与页面提取接入宿主web服务，提供参数设置、额度状态与引擎切换。 | 先确认安装后的默认引擎和查询数据去向，用少量已知问题核对来源；额度错误时处理key，不期待自动换引擎掩盖失败。 |
| [dsh-scrape-webpage](#plugin-1334269686-root) | 抓取网页正文、结构、链接与关键词，可选下载内容图片并交给扩展分析器。 | 已有用户可保留正文抓取用途，先在公开测试页核对重定向、动态内容与超时；非 Windows 环境先验证 shell 回退，限制敏感网络目标。 |
| [dsh-search](#plugin-1423253220-root) | 把 DeepSeek Search/Fetch 接口接入 DSH，支持结构化搜索与正文抓取。 | 需要结构化公开网页材料的用户可评估；版本、价格和API字段回读原文，登录态或交互站点另用浏览器，先核实账户计费口径。 |
| [dsh-websearch](#plugin-1340340493-root) | 为 DSH 提供聚合网页搜索 provider，合并多个后端结果并支持过滤、缓存和故障降级。 | 先选少量可访问后端，用常见中文与时效问题核对出处、耗时和全部调用预算；逐步增加有独立增益的服务。 |
| [dsh-wsl-fetch](#plugin-1362694736-root) | 为DSH网页抓取注册代理感知的HTTP提供者，限制重定向、响应大小与返回文本。 | 先用公开小页面确认代理生效，保留抓取截断标志；不要把URL过滤当作完整网络访问隔离。 |
| [dsh-wsl-obscura](#plugin-1358313559-root) | 封装Obscura浏览器CLI，提供状态、网页抓取与MCP接入提示。 | 从无eval、无私网访问的小页面开始，核对正文和截断，不把MCP提示当已接通服务。 |
| [dsh-wsl-obsidian](#plugin-1380817560-root) | 连接Windows或WSL的Obsidian笔记库，提供搜索、读取、写入与打开笔记。 | 明确指定测试vault并备份，避免在正在编辑的重要笔记上直接写入；检查符号链接。 |
| [dsh-wsl-playwright](#plugin-1381860363-root) | 在WSL中通过无头Chromium读取网页标题、状态与正文。 | 先在干净WSL完成小页面验证；有登录态、复杂交互或完整取证需求时不要只依赖body文本。 |
| [dsh-wsl-vecmem](#plugin-1381726438-root) | 使用 Ollama 嵌入在本地存储短文本，并按工作区进行语义检索。 | 适合可丢弃的项目碎片试用；保留独立原始笔记和双文件备份，固定嵌入模型，不按 strong 自动采信，不用作唯一记录。 |
| [Forge 记忆](#plugin-1363429979-plugin-memory) | 为 DSH 保存偏好、项目决策与关系化记忆，支持检索和跨会话使用。 | 先记录少量明确偏好，测试修改和删除后是否停止影响回答，再扩展自动积累。 |
| [GLM 图片视觉工具](#plugin-1335070045-packages-vision-tool) | 将本地单张图片发送至智谱 GLM，返回图片问答或 OCR 中文文本。 | 适合允许图片出网且缺原生视觉的场景做非敏感样本验证；财务、身份或关键数字需人工回读，不将OCR文本当真值。 |
| [KRouter](#plugin-1341648244-root) | 以本地 Markdown 知识库为多种 Agent 提供带出处的记忆查询、纠错与拒答机制。 | 有决策知识库且愿维护状态时可先只读试用，核查来源页与拒答；不要把默认检索成功等同于记忆正确，导入与夜间写作应单独设置。 |
| [Moli 浏览器工具](#plugin-1415767842-root) | 通过本地 Moli 引擎渲染页面，读取选区并生成截图或 PDF。 | 确需JS渲染时可在隔离环境先验证引擎；确认TLS策略和安装来源后再接真实账号，普通文章优先比较轻量HTTP路径。 |
| [URL 正文阅读器](#plugin-1335047324-root) | 读取网页、JSON 与订阅源，清理正文并提供分页续读和批量读取。 | 适合已有抓取结果噪声多、常需中文编码和续读的场景先对照使用；答案依赖表格或动态页面时核对原文与截断标记。 |
| [VeriScope 门禁重放](#plugin-1422943787-root) | 对已有逐条评分执行三态阈值判定，保存并复验绑定输入与策略的回执。 | 已有评测结果且需要可追溯裁决的团队可先用构造样本核验策略；把PASS解释为当前输入满足该阈值，真正发布仍由接入方执行器负责。 |

<a id="plugin-1359423472-root"></a>

## [dsh-codevault](../../plugins/1014029855--dsh-codevault/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault)

- **用途**：反复阅读相同代码的人需要保留带对象身份的笔记，减少重复整理。
- **亮点**：入口注册 code-reading Skill、read/vault 工具及 /codevault，配置档案目录与可选只读 vault。
- **思考**：对象卡片比聊天时间线容易复用；写得整齐不等于理解准确或跟上代码变更。
- **建议**：先给一个常读模块建卡，代码更新后核对引用和过期结论，不把历史笔记直接当现状。

<a id="plugin-1366089972-workspace-plugins-dsh-cortex"></a>

## [dsh-cortex](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-cortex/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

- **用途**：长期运行Agent-Body的用户希望跨会话保留失败教训和重复做法，并减少常驻告警噪声。
- **亮点**：组件src/index.ts以agent/pre-step判断活动，静默后按工具记录确定性生成卡片，关键词加权召回，权重衰减归档；重复告警收敛静默。
- **思考**：不让心跳和维护调用冒充会话活动能避免永不巩固；自动抽取的打法可能只记录偶然成功，需要真实任务对照。
- **建议**：先少量召回并定期抽查卡片来源，重要故障保持外部告警；先验证重启后记忆仍可恢复再长期使用。

<a id="plugin-1381989584-root"></a>

## [dsh-ls125-uv-probe](../../plugins/2333hutao--dsh-ls125-uv-probe/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2333hutao/dsh-ls125-uv-probe)

- **用途**：面向已有LS125/UVALED-X3硬件、想用自有MCU读取紫外测量的嵌入式研究者；合格结果须帧校验正确、量纲匹配并与原仪表对照。
- **亮点**：相比仅给AI一段设备说明，本项把反向协议、否定实验陷阱、示例捕获和MCU实现一起作为资源分发，使Agent能追溯字段和采样方法。CRC/UART均为成熟技术，具体贡献在该探头的协议知识与从仪表脱离的实现材料，不宣称通用仪器协议创新。
- **思考**：样本设备实验能否支持该型号所有探头？PROTOCOL有字段对照、清零和排除实验，提供比单段演示更强的作者证据；但文中“完整原始证据”指向另一技能的case文件，当前分发未含全部原始轮次，偏移16–17含义也未知。21帧正确不能覆盖批次、固件、漂移和长时间计时溢出。
- **建议**：已有对应硬件的工程人员可把它当复核起点，先只读轮询并对照原表，核对电气连接、CRC与单位后再试清零；不直接将示例读数用于要求校准证明的交付。

<a id="plugin-1415116420-root"></a>

## [dsh-obsidian-board](../../plugins/2026heshao--dsh-obsidian-board/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board) · [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board)

- **用途**：适合已有Markdown笔记库、希望边问边查出处的知识工作者；合格答案应引用实际支持结论的笔记，而不是仅能打开一个文件。
- **亮点**：相对在Obsidian关键词搜索后复制到聊天，插件把查找、回答和原文核对放在三栏；BM25和中文bigram是成熟方法，具体增量是笔记标题/标签/别名、收集语料降权以及attempt切换时重置输出偏移，减少来源库与模型回退造成的使用断点。不能将算法名称或作者万条笔记耗时认作本次实测。
- **思考**：最影响价值的是引用能否覆盖真正支持结论的笔记。BM25更适合词面匹配，固定0.45收集语料降权能让自有笔记优先，却可能压低用户此刻正要找的外部材料。可点击[n]只证明可回看，不证明检索召回或引用蕴含关系；同义改写与外部资料问题是最强反例。
- **建议**：已有结构清楚的Markdown笔记库可先用已知答案测试原词、同义改写和外部资料问题，逐条点引用核对；涉及敏感笔记时先确认所选模型通道允许发送检索片段。

<a id="plugin-1334654243-root"></a>

## [dsh-plugin-tavily](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily)

- **用途**：经常做联网研究的用户希望统一搜索参数并取回来源，合格结果是相关且可追溯的证据，不只是搜索成功。
- **亮点**：src/provider.ts实现web.search与fetch提供者，按请求解析密钥环，支持缓存与受限重试；可显式切换或在特定故障时回退DeepSeek。
- **思考**：统一设置和明确回退类型有利于诊断；丰富参数并不能代替同问题的检索质量比较。
- **建议**：先确认安装后的默认引擎和查询数据去向，用少量已知问题核对来源；额度错误时处理key，不期待自动换引擎掩盖失败。

<a id="plugin-1334269686-root"></a>

## [dsh-scrape-webpage](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) · [![npm 30d 1151](https://img.shields.io/static/v1?label=npm+30d&message=1%2C151&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)

- **用途**：研究者读取具体网页时希望得到可引用正文与结构，原有办法是浏览器复制或宿主抓取工具。
- **亮点**：lib/index.js 优先宿主 web.fetch，缺失或异常后经 shell 调用 curl；解析与统计分层，图片逐张下载并调用注册分析器。
- **思考**：分析器注册接口避免把视觉服务绑死，但自动提取并不证明正文完整或网页内容可信。
- **建议**：已有用户可保留正文抓取用途，先在公开测试页核对重定向、动态内容与超时；非 Windows 环境先验证 shell 回退，限制敏感网络目标。

<a id="plugin-1423253220-root"></a>

## [dsh-search](../../plugins/439436269-ctrl--dsh-search/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-search) · [![npm 30d 239](https://img.shields.io/static/v1?label=npm+30d&message=239&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-search)

- **用途**：研究或开发用户先搜候选页面再读取正文，以原始URL为证据完成回答；交付应是可追溯原文依据。
- **亮点**：相对内置搜索入口，提供显式条数、正文预算、查询操作符和搜索加抓取组合；错误与正文节选可直接交给模型复核。上游检索与rerank能力不应归为插件原创。
- **思考**：rerank与authority字段不是事实正确性保证；research只保留开头节选，可能丢失限定条件。billedRequests按成功抓取计数，网络失败自动重试可能已被服务端执行，插件无法证明账单精确等于该字段。README费用和QPS是作者主张，本次未独立核价。
- **建议**：需要结构化公开网页材料的用户可评估；版本、价格和API字段回读原文，登录态或交互站点另用浏览器，先核实账户计费口径。

<a id="plugin-1340340493-root"></a>

## [dsh-websearch](../../plugins/240xu--dsh-websearch/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) · [![npm 30d 4850](https://img.shields.io/static/v1?label=npm+30d&message=4%2C850&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)

- **用途**：面向研究/开发问答中需要多个网络来源的DSH用户；合格检索是相关、可访问且支持任务的结果，而非返回链接数量多。
- **亮点**：相对宿主选择单provider或逐后端手搜，本项在一个provider后并发多种来源，避免配置多个provider造成歧义，并把失败原因/冷却状态收敛。RRF源码归因Cormack及RAG-Fusion，不计为原创算法；具体增量是DSH服务接线和失败/取消/结果融合组合。
- **思考**：多后端与RRF是否真正提升证据而非放大共同转载？多个结果列表可能来自相同索引和镜像，RRF积累重复URL排名能提高共识，却不提供独立来源鉴别。并发还会等待失败尾部并增加API预算；部分成功只证明有结果，不能证明覆盖用户问题。
- **建议**：先选少量可访问后端，用常见中文与时效问题核对出处、耗时和全部调用预算；逐步增加有独立增益的服务。重要研究仍应打开原文核查，不能把聚合排序当事实验证。

<a id="plugin-1362694736-root"></a>

## [dsh-wsl-fetch](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-fetch)

- **用途**：WSL内直接访问公开网页失败而Windows代理可用时，让现有web_fetch使用代理通路。
- **亮点**：在宿主原抓取接口下替换传输路径，而不是让用户另学一套工具；有内容上限和取消信号，贡献是代理与宿主的受限集成。
- **思考**：私网检查主要基于URL字面主机名，源码未在该路径固定域名解析结果；因此拦截私有IP字面量不能证明域名最终不会访问私网。
- **建议**：待验证假设：代理侧统一检查解析目的地与重定向，可能比插件内重复维护IP规则更一致；需要明确代理与宿主的职责边界。

<a id="plugin-1358313559-root"></a>

## [dsh-wsl-obscura](../../plugins/173787247--dsh-wsl-obscura/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-obscura)

- **用途**：网页需要浏览器处理而普通HTTP抓取不足时，在DSH中调用已有Obscura。
- **亮点**：把浏览器CLI与WSL路径接通，降低二进制查找和输出处理负担；浏览器能力来自Obscura。
- **思考**：允许eval、截图和私网开关时副作用与数据范围扩大；CLI存在不证明浏览器依赖安装齐全，抓到文本也不等于正文完整。
- **建议**：本次未形成新的创新假设；先为普通抓取与额外权限建立可见的调用边界，再衡量与直接CLI的差异。

<a id="plugin-1380817560-root"></a>

## [dsh-wsl-obsidian](../../plugins/173787247--dsh-wsl-obsidian/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-obsidian)

- **用途**：Agent需要在既有Obsidian知识库中整理结果，而不重复复制到独立记忆系统。
- **亮点**：把已有笔记文件变为Agent可调用的读写接口，保留Obsidian工作方式；知识正确性和同步语义不由文件桥接自动解决。
- **思考**：safeJoinVault做词法路径包含检查，没有在该函数中解析符号链接；并发编辑与直接writeFileSync也未构成版本冲突保护。
- **建议**：待验证假设：写入要求预期内容摘要并原子替换，可减少Agent覆盖用户同时编辑；需与直接备份策略比较恢复成本。

<a id="plugin-1381860363-root"></a>

## [dsh-wsl-playwright](../../plugins/173787247--dsh-wsl-playwright/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-playwright)

- **用途**：普通HTTP抓取不足时，Agent需要浏览器渲染后的页面文字，无需操作Windows交互浏览器。
- **亮点**：把Playwright读网页流程封装成限定工具；浏览器能力来自上游，增量是DSH接线与结果裁剪，不包含通用交互自动化。
- **思考**：npx未锁包版本，临时脚本能否解析到临时包和浏览器是否已安装未经验证；domcontentloaded与body取文不能保证动态内容完整，取文异常还可能返回空正文成功。
- **建议**：待验证假设：锁版本并报告页面就绪条件、取文失败和截断，可提升抓取结果可复核性；收益尚未验证。

<a id="plugin-1381726438-root"></a>

## [dsh-wsl-vecmem](../../plugins/173787247--dsh-wsl-vecmem/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-vecmem)

- **用途**：已有本地模型的个人开发者保存项目碎片，期望跨会话查到正确事实；交付是带原文和检索阶段的候选片段，不是权威知识库。
- **亮点**：相对 JSON 内嵌浮点向量，sidecar 降低文本解析/存储负担；相对单阶段相似度，增加可降级 rerank 和显式阶段信息。算法本身继承成熟向量检索，作者注释中的体积/命中实例不是本次独立实测。
- **思考**：关键是返回 confidence 能否代表可相信的事实。源码对 embedding 和 rerank 分数用同一0.15/0.45阈值，未见校准；仅检维数不足以识别同维度换模型。JSON 解析失败回空库，双文件非事务，不能当可靠长期存储。
- **建议**：适合可丢弃的项目碎片试用；保留独立原始笔记和双文件备份，固定嵌入模型，不按 strong 自动采信，不用作唯一记录。

<a id="plugin-1363429979-plugin-memory"></a>

## [Forge 记忆](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2404](https://img.shields.io/static/v1?label=npm+30d&message=2%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory)

- **用途**：反复在项目间切换的使用者需要可管理的长期偏好和决策，而非无差别保存聊天。
- **亮点**：storage-domain 支撑实体、关系和审计记录，服务统一管理写入、查询与导入校验。
- **思考**：结构化存储比散落提示词更可管理；错误或跨范围记忆可能持续影响后续决策。
- **建议**：先记录少量明确偏好，测试修改和删除后是否停止影响回答，再扩展自动积累。

<a id="plugin-1335070045-packages-vision-tool"></a>

## [GLM 图片视觉工具](../../plugins/314857493--dsh-vision--packages-vision-tool/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/314857493/dsh-vision) · [![npm 30d 1192](https://img.shields.io/static/v1?label=npm+30d&message=1%2C192&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-free-eyes)

- **用途**：缺少原生图片输入的DSH会话，针对已知绝对路径图片提问或转录文字；交付GLM生成的文本观察，需按用途复核关键数字。
- **亮点**：相对用户另开视觉模型复制结果，贡献是单工具完成本地读图、问答/OCR及缓存，避免依赖外部CLI。图片理解与识别能力归GLM；提示明确图像文字不应当作执行指令，但这只是工具语义约束。
- **思考**：“免费眼睛”不保证长期无成本，更不保证结果正确。图片一定上传第三方，缓存命中会跳过新请求；顺序回退可能增加延迟。包声明DSH<0.2.0，不能从工具注册代码存在推出现代宿主兼容。
- **建议**：适合允许图片出网且缺原生视觉的场景做非敏感样本验证；财务、身份或关键数字需人工回读，不将OCR文本当真值。

<a id="plugin-1341648244-root"></a>

## [KRouter](../../plugins/398894496-arch--krouter/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)

- **用途**：跨Claude Code、Codex、Cursor和DSH维护决策的用户，需优先引用仍有效页面，未知时不硬凑相近答案。
- **亮点**：相对普通全文检索，实质贡献是默认启用过期页排除和低置信拒答、带出处收据的组合；作者README承认匹配同样规则的全文基线无显著差异，因此不归因为新检索算法。跨Agent共享可编辑Markdown是明确流程增量。
- **思考**：作者基准改善是否说明算法领先？作者报告200题及错误引用率，但同规则BM25差异区间跨零；默认策略、拒答覆盖率和数据构造均可解释部分差异。源码阈值可见，真实知识库写作质量和纠错标注决定有效性，未独立复跑。
- **建议**：有决策知识库且愿维护状态时可先只读试用，核查来源页与拒答；不要把默认检索成功等同于记忆正确，导入与夜间写作应单独设置。

<a id="plugin-1415767842-root"></a>

## [Moli 浏览器工具](../../plugins/27painter--dsh-moli/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/27painter/dsh-moli) · [![npm 30d 1514](https://img.shields.io/static/v1?label=npm+30d&message=1%2C514&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-moli)

- **用途**：需要读取JS渲染网页、登录页面或保存页面图片的研究者；交付可读正文、选区文本或本地截图/PDF，静态页优先与普通HTTP抓取对照。
- **亮点**：浏览器能力来自 lexmount/moli；插件的贡献是DSH工具契约、选择器读取、Windows文件捕获及引擎探测/安装的集成。选择器计数可区分“没有匹配”与正文为空，比直接把空输出当成功更清楚。
- **思考**：能调用浏览器不证明网页可信或默认安全。index.js 默认 insecureTls=true；引擎独立下载，安装器默认没有预期校验和，记录其SHA只证明执行了哪些字节。作者选择器字符缩减示例不是同质量跨站收益验证。
- **建议**：确需JS渲染时可在隔离环境先验证引擎；确认TLS策略和安装来源后再接真实账号，普通文章优先比较轻量HTTP路径。

<a id="plugin-1335047324-root"></a>

## [URL 正文阅读器](../../plugins/2672243194--dsh-read-url/INSIGHT.md)

[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=yellow&logo=github&style=flat)](https://github.com/2672243194/dsh-read-url) · [![npm 30d 2642](https://img.shields.io/static/v1?label=npm+30d&message=2%2C642&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-read-url)

- **用途**：研究者和开发者从文档、文章或 API 提取适量内容，交付保留来源及续读位置的正文；已能返回完整正文的宿主 web_fetch 是首选对照。
- **亮点**：相对直接把整页传给模型，增量是内容类型归一、正文清理、按段落截断和可续读的组合。index.js:358-409 保留 provider 的 HTTP/策略错误，减少降级路径绕过上游规则；这比仅比较输出字符数更值得复用。
- **思考**：压缩输出可能把关键表格行、导航或分页上下文一起丢掉。作者旧版竞品表明确不适用于新 DeepSeek Fetch provider，不能据其推出当前优势；缓存、清理和额外分页也会影响新鲜度与耗时。
- **建议**：适合已有抓取结果噪声多、常需中文编码和续读的场景先对照使用；答案依赖表格或动态页面时核对原文与截断标记。

<a id="plugin-1422943787-root"></a>

## [VeriScope 门禁重放](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/4444wjt/dsh-plugin-veriscope) · [![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)

- **用途**：已有RAG或模型逐条评分的评测维护者，判断给定策略下能否放行并保存复验材料；合格交付是范围明确、当前有效的回执，评分真值和实际发布由其他系统负责。
- **亮点**：相对只看均值或旧报告，贡献是把缺证据作为REVIEW、已知FAIL不被留痕异常掩盖，以及让回执有效性依赖输入/策略/环境绑定。V2把最差行诊断与显式逐行门槛分开，避免把“展示最差行”偷换成拒绝规则。
- **思考**：核心质疑是PASS究竟约束到哪里。源码支持当前回执的完整性与阈值裁决，不证明原始评分准确或输入未提前删行；builtin B2明确不支持bind/complete，原replay的managed complete只写自有完成文件，没有拦截外部发布副作用。不能据“门禁”名称声称所有发布被强制保护。
- **建议**：已有评测结果且需要可追溯裁决的团队可先用构造样本核验策略；把PASS解释为当前输入满足该阈值，真正发布仍由接入方执行器负责。

## 更新时间

2026-10-21
