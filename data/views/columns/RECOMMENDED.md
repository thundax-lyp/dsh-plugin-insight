[返回首页](../../../README.md)

# 推荐

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

<a id="column-index"></a>

**快速比较**

> 表格与下方说明按相同顺序排列；点击插件名跳转到本页说明。

| 插件 | 主要用途 | 为什么值得推荐 |
| --- | --- | --- |
| [dsh-scrape-webpage](#plugin-1334269686-root) | 抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。 | 公开静态正文抓取可小范围试用；必须逐页回查来源，动态或登录页面直接切浏览器。 |
| [dsh-message-copy-enhance](#plugin-1337978261-root) | 将助手消息选区复制为 Markdown，恢复链接、LaTeX 源码和代码围栏。 | 适合常摘录技术回答的Web用户，先在目标编辑器核对公式、链接和代码；逐字原稿归档应另保留源文。 |
| [@dsh-lsp-packs/dsh-lsp-cpp](#plugin-1344713526-dsh-lsp-cpp) | 把 clangd 配置为 DSH 的 C/C++ LSP 后端，为共享 lsp 工具提供导航、引用、实现和 hover。 | 具备 clangd 与编译数据库的 C/C++ 项目可先试用只读导航，并用 rg/编译器结果交叉核对。 |
| [dsh-plugin-preflight](#plugin-1378350155-root) | 以 CLI 和模型工具预检 DSH 插件清单、patch、客户端包和预发布 peer 范围。 | 适合插件作者作为额外提交前检查试用，明确宿主解析环境，并保留打包、审阅和宿主验证。 |
| [dsh-fullscreen-input](#plugin-1407166868-root) | 为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。 | 固定宿主长文输入可试用，先核多引用/附件/发送状态；不依赖其独立草稿归档或绝对IME安全保证。 |
| [no-ai-style](#plugin-1418493685-root) | 提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 | 适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。 |
| [dsh-plugin-veriscope](#plugin-1422943787-root) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 |
| [dsh-markdown-live](#plugin-1426477683-root) | 在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。 | Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。 |
| [dsh-nav-history](#plugin-1429464857-root) | 为 DSH 会话与整页面板提供后退、前进、历史底栏和本地持久化。 | 适合频繁跨会话面板的人先核对交错导航与持久化后试用，接受历史记录可能失效及不恢复滚动的边界。 |
| [dsh-wsl-browser](#plugin-1350379388-root) | 从 WSL 调用 Windows 默认浏览器打开经过协议校验的网页地址。 | 频繁从 WSL 打开网页的用户可试用；把浏览器页面可见而非 PowerShell 返回作为验收。 |
| [dsh-wsl-cal](#plugin-1381860995-root) | 把本机 khal 日历以只读状态、今日和未来日程工具暴露给 DSH。 | 已稳定使用 khal 且只需只读日程的 WSL 用户可试用；必须验证时区和同步陈旧边界。 |
| [dsh-subagent](#plugin-1425006726-root) | 把多个已登录的外部编码 CLI 注册为 DSH 子代理并提供进度与恢复。 | 已信任多个外部 CLI 且能独立验收子任务的开发者可隔离试用；先验证权限、回退预算和重启去重。 |
| [OpenViking](#plugin-1128123594-root) | 以虚拟文件系统组织 Agent 的知识、记忆与技能，提供分层读取、语义检索和会话沉淀。 | 对知识密集团队有明确试用路径，但当前效果与运维成本需专项对照。 |
| [Archify](#plugin-1211139949-root) | 将需求、代码关系和解释内容组织成交互式图表及单页 HTML。 | 适合愿意核查来源的开发者在单一架构路径试用；自动门禁不替代语义审核。 |
| [embedded-workbench](#plugin-1276714299-root) | 为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。 | 可小规模验证八 Skill 与门禁，并以专家样例评估专业正确性。 |
| [@indexyz/dsh-autocompact](#plugin-1324229194-dsh-autocompact) | 为Harness按会话与模型配置提前自动压缩阈值，提供持久设置和输入区状态显示。 | 单route会话覆盖可控且有明确回默认路径，需同时核语义和全部摘要成本。 |
| [LogicProbe](#plugin-1331586818-root) | 为 DSH 提供状态机、数据模型、结构、并发线索和 UML 检查工具与 Skill。 | 确定性模型检查有可控用途，但抽象忠实性与实际缺陷收益须由用户复核。 |
| [dsh-stock-market](#plugin-1331846104-root) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。 |
| [DSH Vision Toolkit](#plugin-1333100071-root) | 为DSH文本模型接入图片问答、OCR、定位和本地图像处理工具，并提供粘贴图片与产物预览。 | 文本模型用户可用非敏感截图受控试用；先测真实图像请求和最终任务质量，核实外部服务政策、费用及宿主兼容。 |
| [DSH Turn Rewind](#plugin-1333100390-root) | 按用户消息关联检查点恢复项目文件，并可独立或同时创建回退后的新会话。 | 在非关键项目副本演练覆盖、过期计划及rescue后可控试用，不代替外部副作用与备份管理。 |
| [DSH Computer Use](#plugin-1333116579-root) | 为DSH提供macOS原生应用观察、元素操作、定向输入、截图与权限诊断。 | 明确原生应用需求可在单应用和可撤销任务上试用，先核对焦点策略及敏感动作确认。 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root) | 监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。 | 需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 |
| [dsh-verification-receipt](#plugin-1333370288-root) | 被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。 | 被动最小字段与边界文档清楚，适合精确宿主私有单进程路径观察；词法/可重算hash与无界queue不适合验证门禁或强审计。 |
| [dsh-wsl-workspace](#plugin-1334205011-root) | 从DSH界面创建WSL工作区，使会话命令、文件操作和搜索在选定发行版中协同运行。 | Windows 上长期使用 WSL 工程者可在隔离项目试用，先核对双平面权限边界与固定 DSH 版本。 |
| [@awiki/dsh-plugin](#plugin-1334428397-root) | 将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 | 已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 |
| [dsh-plugin-tts](#plugin-1334773156-root) | 为DSH Web消息提供手动与自动朗读，支持Edge、Cloud及多种本地音色和长文本分块播放。 | 消息内朗读与可取消长读有明确试用价值；先用非敏感文本核对Edge外发、停止与错误恢复，再按需增加本地音色，源码级证据不足以持续安装。 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。 | 开放发现和预检有明确价值，能备份并使用guard路径的维护者可在可丢弃profile试用；早commit与运行验收缺口不支持持续安装结论。详见[Q07](#research-q07)。 |
| [dsh-web-tools](#plugin-1335219884-root) | 为DSH统一搜索与抓取接口适配多Provider、自定义JSON源及X/小红书原生浏览器检索。 | 适合可信本机公开资料检索的小范围试用，需核原来源/全文和实际支出；不可把off、required或false截断标记当全局保证。 |
| [dsh-md-annotator](#plugin-1335286261-root) | 在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。 | 适合已有Better Sidebar且文稿有备份的用户试用；保存源码、导出批注并核对报告所属会话，刷新前防丢稿。 |
| [dsh-permissions](#plugin-1335349535-root) | 在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。 | 需要细粒度工具门禁的团队可在保留宿主沙箱前提下试用，并先验证路径旁路与规则回滚。 |
| [dsh-verify](#plugin-1335843750-root) | 执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。 | 适合可信本地应用的有限浏览器验收试用；独立审读spec和批准基线，不把新基线或runner错误当交付通过。 |
| [dsh-diff-approval](#plugin-1335980444-root) | 捕获DSH成功文件编辑并集中展示差异，支持Keep/Revert、评论、撤销及VCS变更导入。 | 单人可备份工作树可试用事后审阅，回退前冻结外写并核实际文件，创建删除不可undo且持久失败需查日志。 |
| [dsh-openai-oauth](#plugin-1335992154-root) | 为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。 | 本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。详见[Q06](#research-q06)。 |
| [dsh-project-memory](#plugin-1339316901-root) | 索引项目文档与代码符号，分层召回经验和insight，并将任务记录跨会话保存。 | 长期单项目非敏感语料可有限试用，先核引用、触发截断和global；反思默认关闭，近邻/命中不能作为知识验证。 |
| [KRouter](#plugin-1341648244-root) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。 |
| [dsh-thumb](#plugin-1341694685-root) | 将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。 | 适合愿意自行维护的个人窄屏DSH用户受控试用，先核对列定位、设置与轨迹交互并保留关闭重载路径；不把免hash当免维护。 |
| [dsh-wsl-open](#plugin-1347958944-root) | 让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。 | 适合个人本地WSL办公文件流程试用；仅打开可信文件，核对宿主路由权限和真实窗口结果。 |
| [dsh-cap-profile](#plugin-1349267122-root) | 扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。 | 适合将其作为本地日志排查索引试用，先核对真实数据和模型归因，不据错误率直接做能力排名。 |
| [dsh-soul](#plugin-1352089397-root) | 为DSH提供可切换人格、会话与工作区范围绑定、提示注入和个性化界面。 | 频繁切换项目角色者可在非敏感工作区试用，先验证作用域优先级、撤销和跨会话隔离。 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz) | 解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。 | 对已有 CapMap 文档的团队有清晰只读导航价值，但必须把图视为声明并回查原文。 |
| [dsh-usage-analytics](#plugin-1356960582-root) | 在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。 | 适合本机个人用户对小样本受控试用并核对用量字段和索引状态；不作账单、技能成果成功率或多人权限保证。 |
| [dsh-model-channel-manager](#plugin-1358316691-root) | 管理 DSH 模型渠道和轮询组，提供故障转移、模型测试、测速及健康统计界面。 | 适合已有多个可替代渠道且愿意核对输出、预算和RC契约的用户试用，先验收流中失败与取消。 |
| [dsh-plugin-notes](#plugin-1363429979-plugin-notes) | 把 Markdown 便签、任务泳道、新会话执行、定时调度与 WebDAV 备份组合在 DSH 中。 | 先个人隔离试用，删除后手动备份，定时任务加强监控。 |
| [dsh-super-code](#plugin-1367482095-root) | 提供编码 Agent 预设、任务与委派台账、专业方法、分层记忆和可配置运行预算。 | 适合已有代码验收流程的DSH开发者在独立分支试复杂任务，确认预设预算和删除模式，并保留真实测试把关。 |
| [dsh-eteams](#plugin-1372993989-root) | 为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。 | 可在备份和明确人工验收的任务中试用真实多会话协作；先修正个人状态路径、限定Web管理面并处理近期重启对账缺口。 |
| [3chat-customer-growth](#plugin-1374055714-root) | 连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。 | 适合已有3Chat组织团队用测试组织先只读再极小授权发送；动态契约、单次防重放和unknown收据具体，仍须核完整确认/权限和跨调用幂等。 |
| [@240xu/dsh-session-lazy-view](#plugin-1377185339-root) | 以独立网页只读查看本地会话尾帧，提供时间线、搜索、统计及Markdown导出。 | 本机只读尾部排查有明确可控试用路径，全文资源与投影完整性限制必须保留。 |
| [dsh-jev-interceptor](#plugin-1382292535-root) | 为 DSH 工具调用提供 Jev 风险判断、审批辅助、语义会话保留与决策遥测。 | 适合工具调用频繁且能在隔离 profile 审阅遥测的开发者试用；保持图像卸载关闭、预批白名单为空并先验证 shadow 零副作用。 |
| [Our Free Model](#plugin-1385896447-root) | 为 DSH 聚合多渠道模型，提供模型选择、本地兼容网关、用量看板与降级路由。 | 可信来源与脱敏单车道有可控试用价值，多渠道供给和数据边界不能由统一UI保证。 |

<a id="plugin-1334269686-root"></a>

## [dsh-scrape-webpage](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) [![npm 30d 1,067](https://img.shields.io/static/v1?label=npm+30d&message=1%2C067&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)

**主要用途**：抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。

**推荐理由**：公开静态正文抓取可小范围试用；必须逐页回查来源，动态或登录页面直接切浏览器。

**使用条件**：适合公开、无需登录且正文可抽查的研究页面小范围试用；登录态、强脚本渲染或付费墙继续使用宿主浏览器。成功标准是关键段落召回、标题与链接保留达到预定样本门槛，且人工修正少于复制粘贴；连续出现空正文、错正文或反爬重试时应停止并切换浏览器。 Q09(#research-q09)

[返回表格](#column-index)

<a id="plugin-1337978261-root"></a>

## [dsh-message-copy-enhance](../../plugins/asianfleet--dsh-message-copy-enhance/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Asianfleet/dsh-message-copy-enhance) [![npm 30d 1,109](https://img.shields.io/static/v1?label=npm+30d&message=1%2C109&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-message-copy-enhance) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-message-copy-enhance)

**主要用途**：将助手消息选区复制为 Markdown，恢复链接、LaTeX 源码和代码围栏。

**推荐理由**：适合常摘录技术回答的Web用户，先在目标编辑器核对公式、链接和代码；逐字原稿归档应另保留源文。

**使用条件**：经常摘录技术回答的人可先试，选取链接、公式和多行代码各一段，粘贴到常用编辑器并逐字核对URL、TeX和换行，再测试禁用后默认复制恢复。首次涉及客户端加载，持续在copy时遍历选区DOM，不调用模型；现金、延迟和人工复核时间没有实测值，不写为零。发布包和Git源码的构建路径不同，源码安装含prepare构建，需确认拿到可加载客户端。失败时可禁用并用原消息或手工复制；若静默丢掉代码符号、公式或链接目标，应停止自动依赖。它不适合要求逐字原始Markdown的归档流程。 Q04(#research-q04)

[返回表格](#column-index)

<a id="plugin-1344713526-dsh-lsp-cpp"></a>

## [@dsh-lsp-packs/dsh-lsp-cpp](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

**主要用途**：把 clangd 配置为 DSH 的 C/C++ LSP 后端，为共享 lsp 工具提供导航、引用、实现和 hover。

**推荐理由**：具备 clangd 与编译数据库的 C/C++ 项目可先试用只读导航，并用 rg/编译器结果交叉核对。

**使用条件**：有稳定 clangd 与 compile_commands 的 C/C++ 项目可在只读导航任务中试用；先核四个操作对 sample 和本项目代表文件的结果，再允许模型依赖它改代码。没有共享 base、依赖重型交叉编译或无法限制 server资源的环境先观察，保留 rg/编译器作为基线。 详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1378350155-root"></a>

## [dsh-plugin-preflight](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AphyTOT/dsh-plugin-preflight)

**主要用途**：以 CLI 和模型工具预检 DSH 插件清单、patch、客户端包和预发布 peer 范围。

**推荐理由**：适合插件作者作为额外提交前检查试用，明确宿主解析环境，并保留打包、审阅和宿主验证。

**使用条件**：先对已知正确和已知错误的插件各检查一次，核对规则是否符合当前宿主。把它加入提交前流程，保留真实打包和加载检查；本地链接导致工具缺席时确认CLI路径。Q03(#research-q03)

[返回表格](#column-index)

<a id="plugin-1407166868-root"></a>

## [dsh-fullscreen-input](../../plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input)

**主要用途**：为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。

**推荐理由**：固定宿主长文输入可试用，先核多引用/附件/发送状态；不依赖其独立草稿归档或绝对IME安全保证。

**使用条件**：固定宿主长文编辑可试用，先小草稿检查引用附件。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1418493685-root"></a>

## [no-ai-style](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

**主要用途**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。

**推荐理由**：适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。

**使用条件**：作者留原文并逐命题复核的可控范围试用，先audit再授权编辑。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1422943787-root"></a>

## [dsh-plugin-veriscope](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)

**主要用途**：重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。

**推荐理由**：已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。

**使用条件**：可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1426477683-root"></a>

## [dsh-markdown-live](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/9426Haruka/dsh-markdown-live)

**主要用途**：在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。

**推荐理由**：Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。

**使用条件**：经常写 Markdown 且能接受表格/图片限制的 DSH Desktop 用户可在非关键草稿试用；先复制带中英混排、列表、链接和代码围栏的固定样本，校验发送前后字节与撤销。依赖无障碍输入、超长文档或宿主版本频繁升级的人应先观察。 详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1429464857-root"></a>

## [dsh-nav-history](../../plugins/ahacrazy--dsh-nav-history/INSIGHT.md)



**主要用途**：为 DSH 会话与整页面板提供后退、前进、历史底栏和本地持久化。

**推荐理由**：适合频繁跨会话面板的人先核对交错导航与持久化后试用，接受历史记录可能失效及不恢复滚动的边界。

**使用条件**：先用普通会话和面板交错导航，检查后退后新访问的分支截断、重载和失效目标；只把它当主视图位置入口。记录不稳定时回侧栏手动查找。Q03(#research-q03)

[返回表格](#column-index)

<a id="plugin-1350379388-root"></a>

## [dsh-wsl-browser](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-browser)

**主要用途**：从 WSL 调用 Windows 默认浏览器打开经过协议校验的网页地址。

**推荐理由**：频繁从 WSL 打开网页的用户可试用；把浏览器页面可见而非 PowerShell 返回作为验收。

**使用条件**：适合频繁从 WSL 打开文档或本地服务、且只需要“打开”而非抓取/交互的用户试用。成功标准是 http(s) 非法输入全部拒绝、目标页在预定秒数内可见且 localhost 失败能按提示恢复；如果命令返回成功但页面不可见率高，应退回复制链接或专门端口工具。 Q09(#research-q09)

[返回表格](#column-index)

<a id="plugin-1381860995-root"></a>

## [dsh-wsl-cal](../../plugins/173787247--dsh-wsl-cal/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cal)

**主要用途**：把本机 khal 日历以只读状态、今日和未来日程工具暴露给 DSH。

**推荐理由**：已稳定使用 khal 且只需只读日程的 WSL 用户可试用；必须验证时区和同步陈旧边界。

**使用条件**：适合已经稳定使用 khal、只需代理读取日程的 WSL 用户试用；需要创建、修改、提醒或同步保证的人不适用。成功标准是 status 能暴露配置问题、today/list 与 khal 在事件数和时间上一致、陈旧同步被用户识别；出现时区偏移或遗漏时应停止将输出用于自动计划。 Q09(#research-q09)

[返回表格](#column-index)

<a id="plugin-1425006726-root"></a>

## [dsh-subagent](../../plugins/1373700184--dsh-subagent/INSIGHT.md)

[![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-subagent)

**主要用途**：把多个已登录的外部编码 CLI 注册为 DSH 子代理并提供进度与恢复。

**推荐理由**：已信任多个外部 CLI 且能独立验收子任务的开发者可隔离试用；先验证权限、回退预算和重启去重。

**使用条件**：适合已安装并信任多个 CLI、能写出自足任务并独立验收结果的开发者做受限试用；敏感仓库或无法授予 headless 权限的环境不应启用。成功标准是回退链在总预算内提高合格子任务数、重启接管不重复执行且父代理复核时间低于手工多终端；若上下文遗漏、权限暴露或迟到结果重复产生，应停止。 Q09(#research-q09)

[返回表格](#column-index)

<a id="plugin-1128123594-root"></a>

## [OpenViking](../../plugins/volcengine--openviking/INSIGHT.md)

[![GitHub ★ 40,712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C712&color=yellow&logo=github&style=flat)](https://github.com/volcengine/OpenViking)

**主要用途**：以虚拟文件系统组织 Agent 的知识、记忆与技能，提供分层读取、语义检索和会话沉淀。

**推荐理由**：对知识密集团队有明确试用路径，但当前效果与运维成本需专项对照。

**使用条件**：Q06(#research-q06) 建议可承担服务维护的知识团队试用，以可追溯原文和任务正确率验收；少量静态资料仍可用简单文件方案。

[返回表格](#column-index)

<a id="plugin-1211139949-root"></a>

## [Archify](../../plugins/tt-a1i--archify/INSIGHT.md)

[![GitHub ★ 88,446](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=88%2C446&color=yellow&logo=github&style=flat)](https://github.com/tt-a1i/archify)

**主要用途**：将需求、代码关系和解释内容组织成交互式图表及单页 HTML。

**推荐理由**：适合愿意核查来源的开发者在单一架构路径试用；自动门禁不替代语义审核。

**使用条件**：先选一条熟悉的请求链，检查关系、来源与HTML交付，再决定扩大；无法承担源码复核时先保留简单图。Q04(#research-q04)

[返回表格](#column-index)

<a id="plugin-1276714299-root"></a>

## [embedded-workbench](../../plugins/amethystluna--embedded-workbench/INSIGHT.md)

[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 2,906](https://img.shields.io/static/v1?label=npm+30d&message=2%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench)

**主要用途**：为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。

**推荐理由**：可小规模验证八 Skill 与门禁，并以专家样例评估专业正确性。

**使用条件**：先验证安装与注入，再以专家任务检行为；保留关闭门禁开关并单独考察 Skill 效果。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1324229194-dsh-autocompact"></a>

## [@indexyz/dsh-autocompact](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 735](https://img.shields.io/static/v1?label=npm+30d&message=735&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)

**主要用途**：为Harness按会话与模型配置提前自动压缩阈值，提供持久设置和输入区状态显示。

**推荐理由**：单route会话覆盖可控且有明确回默认路径，需同时核语义和全部摘要成本。

**使用条件**：熟悉原生压缩的开发者可单route试用，保留原生对照并检查摘要与关键约束；不要按pill猜有效覆盖，不把off当关闭宿主溢出恢复。任务质量变差或总成本上升时回默认。参见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1331586818-root"></a>

## [LogicProbe](../../plugins/amethystluna--logicprobe/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 2,746](https://img.shields.io/static/v1?label=npm+30d&message=2%2C746&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-logicprobe)

**主要用途**：为 DSH 提供状态机、数据模型、结构、并发线索和 UML 检查工具与 Skill。

**推荐理由**：确定性模型检查有可控用途，但抽象忠实性与实际缺陷收益须由用户复核。

**使用条件**：适合愿意人工检查模型的开发者在小型状态机上试用。先核对模型与源码关系，读取verdict、覆盖和未决，不把pass当上线许可。Q04(#research-q04)

[返回表格](#column-index)

<a id="plugin-1331846104-root"></a>

## [dsh-stock-market](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)

**主要用途**：在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。

**推荐理由**：适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。

**使用条件**：资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1333100071-root"></a>

## [DSH Vision Toolkit](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md)

[![GitHub ★ 905](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=905&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,948](https://img.shields.io/static/v1?label=npm+30d&message=10%2C948&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

**主要用途**：为DSH文本模型接入图片问答、OCR、定位和本地图像处理工具，并提供粘贴图片与产物预览。

**推荐理由**：文本模型用户可用非敏感截图受控试用；先测真实图像请求和最终任务质量，核实外部服务政策、费用及宿主兼容。

**使用条件**：建议文本模型用户在非敏感截图和可撤销任务中先试用，核对真实图片请求、定位框与OCR边界；敏感数据、自动GUI及持续预算需先确认服务和兼容条件。Q08(#research-q08)

[返回表格](#column-index)

<a id="plugin-1333100390-root"></a>

## [DSH Turn Rewind](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md)

[![GitHub ★ 135](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=135&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-turn-rewind) [![npm 30d 4,574](https://img.shields.io/static/v1?label=npm+30d&message=4%2C574&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind)

**主要用途**：按用户消息关联检查点恢复项目文件，并可独立或同时创建回退后的新会话。

**推荐理由**：在非关键项目副本演练覆盖、过期计划及rescue后可控试用，不代替外部副作用与备份管理。

**使用条件**：经常让Agent改本地项目且愿意审阅差异的开发者可在非关键副本试用。先手工备份并覆盖新增/删除/二进制/符号链接样本，核对skip清单，再测试预览后改文件会拒绝、fork失败补偿和rescue可读。正式项目恢复前停掉其他写入者；外部部署和服务状态由用户单独处理。未做本版本安装与恢复演练，因此只支持可控试用，不代替备份制度。 Q09(#research-q09)

[返回表格](#column-index)

<a id="plugin-1333116579-root"></a>

## [DSH Computer Use](../../plugins/anionex--dsh-computer-use/INSIGHT.md)

[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-computer-use) [![npm 30d 3,269](https://img.shields.io/static/v1?label=npm+30d&message=3%2C269&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use)

**主要用途**：为DSH提供macOS原生应用观察、元素操作、定向输入、截图与权限诊断。

**推荐理由**：明确原生应用需求可在单应用和可撤销任务上试用，先核对焦点策略及敏感动作确认。

**使用条件**：有明确原生应用任务的macOS用户可在可撤销夹具上试用。先给单一应用读权限，再给控制，检查keyboardPolicy并对键盘激活做好预期；观察后动作，遇过期或目标不明时重新观察。发送、付款、删除等由人确认并核对结果，不把敏感flag当独立业务风险识别。未做本版本安装、动作与退出验收，因此不建议直接扩展到所有应用。 Q09(#research-q09)

[返回表格](#column-index)

<a id="plugin-1333357514-root"></a>

## [Qiushi DSH Evidence Audit](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit) [![npm 30d 1,150](https://img.shields.io/static/v1?label=npm+30d&message=1%2C150&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)

**主要用途**：监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。

**推荐理由**：需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。

**使用条件**：需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 采用结论是试用，不是安装保证；成功与停止标准见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1333370288-root"></a>

## [dsh-verification-receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt)

**主要用途**：被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。

**推荐理由**：被动最小字段与边界文档清楚，适合精确宿主私有单进程路径观察；词法/可重算hash与无界queue不适合验证门禁或强审计。

**使用条件**：有条件试用，精确支持宿主+私有一进程一文件，将其当启发式观察摘要，不作验证通过/防篡改审计。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1334205011-root"></a>

## [dsh-wsl-workspace](../../plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md)

[![GitHub ★ 97](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=97&color=yellow&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,975](https://img.shields.io/static/v1?label=npm+30d&message=2%2C975&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace)

**主要用途**：从DSH界面创建WSL工作区，使会话命令、文件操作和搜索在选定发行版中协同运行。

**推荐理由**：Windows 上长期使用 WSL 工程者可在隔离项目试用，先核对双平面权限边界与固定 DSH 版本。

**使用条件**：Windows 上长期使用 WSL 工程者可在隔离项目试用，先核对双平面权限边界与固定 DSH 版本。 采用结论是试用，不是安装保证；成功与停止标准见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1334428397-root"></a>

## [@awiki/dsh-plugin](../../plugins/agentconnect--dsh-awiki/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

**主要用途**：将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。

**推荐理由**：已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。

**使用条件**：已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 采用结论是试用，不是安装保证；成功与停止标准见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1334773156-root"></a>

## [dsh-plugin-tts](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md)

[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) [![npm 30d 2,693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

**主要用途**：为DSH Web消息提供手动与自动朗读，支持Edge、Cloud及多种本地音色和长文本分块播放。

**推荐理由**：消息内朗读与可取消长读有明确试用价值；先用非敏感文本核对Edge外发、停止与错误恢复，再按需增加本地音色，源码级证据不足以持续安装。

**使用条件**：建议先小范围试用。用非敏感短文本核对按钮、停止、自动播放和错误提示，再单独验证长文本；纯本地场景关闭外部回退，逐一加入所需音色。出现未经确认外发、重复漏读、取消不释放或宿主入口失效时停用。详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1335098475-root"></a>

## [dsh-plugin-mall](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1e0zj/dsh-plugin-mall) [![npm 30d 1,485](https://img.shields.io/static/v1?label=npm+30d&message=1%2C485&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)

**主要用途**：在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。

**推荐理由**：开放发现和预检有明确价值，能备份并使用guard路径的维护者可在可丢弃profile试用；早commit与运行验收缺口不支持持续安装结论。详见Q07(#research-q07)。

**使用条件**：能备份profile并理解guard重启的维护者可在可丢弃环境小范围试用，先只读发现再评估已审查候选；报告/脚本不清或快照提前消失就停止后续安装。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1335219884-root"></a>

## [dsh-web-tools](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=yellow&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools)

**主要用途**：为DSH统一搜索与抓取接口适配多Provider、自定义JSON源及X/小红书原生浏览器检索。

**推荐理由**：适合可信本机公开资料检索的小范围试用，需核原来源/全文和实际支出；不可把off、required或false截断标记当全局保证。

**使用条件**：可信本机公开任务试用并核原始来源/预算，严格隔离/全量内容要求先核具体缺口。详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1335286261-root"></a>

## [dsh-md-annotator](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-md-annotator)

**主要用途**：在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。

**推荐理由**：适合已有Better Sidebar且文稿有备份的用户试用；保存源码、导出批注并核对报告所属会话，刷新前防丢稿。

**使用条件**：建议有备份文稿的小范围试用，先验块引用/归属和冲突，结束前保存源码导出批注；复杂语法或导出不可靠时回外部编辑器。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1335349535-root"></a>

## [dsh-permissions](../../plugins/940842546--dsh-permissions/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-permissions) [![npm 30d 588](https://img.shields.io/static/v1?label=npm+30d&message=588&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-permissions) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-permissions)

**主要用途**：在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。

**推荐理由**：需要细粒度工具门禁的团队可在保留宿主沙箱前提下试用，并先验证路径旁路与规则回滚。

**使用条件**：有明确威胁模型、能维护规则和保留宿主沙箱的团队可在非生产 profile 试用；先用只读/模拟工具跑对抗集，再启用 hard 保护真实路径。把它当唯一安全边界、规则无人维护或工具大量通过 shell 二次解释的环境不适合。 详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1335843750-root"></a>

## [dsh-verify](../../plugins/263311487-ux--dsh-verify/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/263311487-ux/dsh-verify) [![npm 30d 2,385](https://img.shields.io/static/v1?label=npm+30d&message=2%2C385&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verify) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verify)

**主要用途**：执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。

**推荐理由**：适合可信本地应用的有限浏览器验收试用；独立审读spec和批准基线，不把新基线或runner错误当交付通过。

**使用条件**：建议可信本地有限spec试用，故意缺陷应失败、合法实现应通过；空覆盖、新基线和ERROR不放行，host阻塞或范围不清时停止。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1335980444-root"></a>

## [dsh-diff-approval](../../plugins/9087--dsh-diff-approval/INSIGHT.md)

[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) [![npm 30d 4,906](https://img.shields.io/static/v1?label=npm+30d&message=4%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)

**主要用途**：捕获DSH成功文件编辑并集中展示差异，支持Keep/Revert、评论、撤销及VCS变更导入。

**推荐理由**：单人可备份工作树可试用事后审阅，回退前冻结外写并核实际文件，创建删除不可undo且持久失败需查日志。

**使用条件**：单人可备份工作树试用；普通回退先冻结其他写入，删除先确认，保留Git/备份和持久日志核查。参见Q04(#research-q04)。

[返回表格](#column-index)

<a id="plugin-1335992154-root"></a>

## [dsh-openai-oauth](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AdonisSheldon/dsh-openai-oauth) [![npm 30d 770](https://img.shields.io/static/v1?label=npm+30d&message=770&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-openai-oauth) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-openai-oauth)

**主要用途**：为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。

**推荐理由**：本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。

**使用条件**：可试用为本机独立模型provider，保护明文凭据与真实工具审批，保留替代路由；不外推远程部署/静态模型全部可用/免费。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1336720864-root"></a>

## [dsh-plugin-console](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-plugin-console) [![npm 30d 1,111](https://img.shields.io/static/v1?label=npm+30d&message=1%2C111&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-console) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-console)

**主要用途**：在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。

**推荐理由**：维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。详见Q06(#research-q06)。

**使用条件**：本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1339316901-root"></a>

## [dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,202](https://img.shields.io/static/v1?label=npm+30d&message=4%2C202&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

**主要用途**：索引项目文档与代码符号，分层召回经验和insight，并将任务记录跨会话保存。

**推荐理由**：长期单项目非敏感语料可有限试用，先核引用、触发截断和global；反思默认关闭，近邻/命中不能作为知识验证。

**使用条件**：先单项目非敏感语料和少量人工经验试用，反思/扩展保持默认关；核原文、trigger正文和global，重要规则保权威原件。参见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1341648244-root"></a>

## [KRouter](../../plugins/398894496-arch--krouter/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)

**主要用途**：让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。

**推荐理由**：lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。

**使用条件**：有条件试用lookup-only。先非敏感个人vault核对来源、旧页与拒答，保持原件；nightly/导入/writer按各lane权限另评，不把接头卸载当timer停止。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1341694685-root"></a>

## [dsh-thumb](../../plugins/aliceljy--dsh-thumb/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb)

**主要用途**：将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。

**推荐理由**：适合愿意自行维护的个人窄屏DSH用户受控试用，先核对列定位、设置与轨迹交互并保留关闭重载路径；不把免hash当免维护。

**使用条件**：个人窄屏用户可受控试用，先检查会话切换、设置与轨迹，保留?thumb=0后重载的退出路径；定位或触控出现影响任务的问题就停用。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1347958944-root"></a>

## [dsh-wsl-open](../../plugins/173787247--dsh-wsl-open/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-open)

**主要用途**：让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。

**推荐理由**：适合个人本地WSL办公文件流程试用；仅打开可信文件，核对宿主路由权限和真实窗口结果。

**使用条件**：建议个人本地WSL用户限定试用可信办公文件，验收以正确窗口实际显示为准；复杂路径误点、权限不清或不明应用启动时停止。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1349267122-root"></a>

## [dsh-cap-profile](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Ansonfishing/dsh-cap-profile)

**主要用途**：扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。

**推荐理由**：适合将其作为本地日志排查索引试用，先核对真实数据和模型归因，不据错误率直接做能力排名。

**使用条件**：先确认面板显示真实数据，再选数份脱敏会话核对调用、模型和错误归属；用它缩小排查范围。需要模型选型结论时补同任务结果对照。Q03(#research-q03)

[返回表格](#column-index)

<a id="plugin-1352089397-root"></a>

## [dsh-soul](../../plugins/aliuyanfeng--dsh-soul/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul) [![npm 30d 2,337](https://img.shields.io/static/v1?label=npm+30d&message=2%2C337&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-soul) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-soul)

**主要用途**：为DSH提供可切换人格、会话与工作区范围绑定、提示注入和个性化界面。

**推荐理由**：频繁切换项目角色者可在非敏感工作区试用，先验证作用域优先级、撤销和跨会话隔离。

**使用条件**：频繁切换项目角色者可在非敏感工作区试用，先验证作用域优先级、撤销和跨会话隔离。 采用结论是试用，不是安装保证；成功与停止标准见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1356896576-dsh-capmap-viz"></a>

## [dsh-capmap-viz](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1741505640/capmap-skills) [![npm 30d 640](https://img.shields.io/static/v1?label=npm+30d&message=640&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz)

**主要用途**：解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。

**推荐理由**：对已有 CapMap 文档的团队有清晰只读导航价值，但必须把图视为声明并回查原文。

**使用条件**：建议试用。适合已经维护 CapMap 文档的小团队，只把图当导航并要求关键判断回到原文；先在单 workspace、小图验证 parse/watch/read 和错误展示。没有文档纪律的项目不应为了图而先引入整套格式。 参见Q04(#research-q04)、Q06(#research-q06)与Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1356960582-root"></a>

## [dsh-usage-analytics](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-usage-analytics)

**主要用途**：在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。

**推荐理由**：适合本机个人用户对小样本受控试用并核对用量字段和索引状态；不作账单、技能成果成功率或多人权限保证。

**使用条件**：个人本机用户可用少量可人工核对的会话试用；先确认宿主依赖与访问控制，遇到用量无法对账、索引持续失败即停止依赖图表。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1358316691-root"></a>

## [dsh-model-channel-manager](../../plugins/arcaneorion--dsh-model-channel-manager/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/ArcaneOrion/dsh-model-channel-manager) [![npm 30d 2,291](https://img.shields.io/static/v1?label=npm+30d&message=2%2C291&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@arcaneorion/dsh-model-channel-manager) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@arcaneorion/dsh-model-channel-manager)

**主要用途**：管理 DSH 模型渠道和轮询组，提供故障转移、模型测试、测速及健康统计界面。

**推荐理由**：适合已有多个可替代渠道且愿意核对输出、预算和RC契约的用户试用，先验收流中失败与取消。

**使用条件**：在固定RC和受控额度下先用等价候选试用，验收首内容前切换、内容后失败只终止一次、用户取消及重启不重放测试。核对实际上游费用和合格结果；长流不能只依赖totalBudgetMs作硬限额，必要时外加截止。Q03(#research-q03)

[返回表格](#column-index)

<a id="plugin-1363429979-plugin-notes"></a>

## [dsh-plugin-notes](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,413](https://img.shields.io/static/v1?label=npm+30d&message=2%2C413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes)

**主要用途**：把 Markdown 便签、任务泳道、新会话执行、定时调度与 WebDAV 备份组合在 DSH 中。

**推荐理由**：先个人隔离试用，删除后手动备份，定时任务加强监控。

**使用条件**：先小规模个人便签试用；任务派发用隔离工作区，定时执行须监控；删除后手动备份并验证远端。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1367482095-root"></a>

## [dsh-super-code](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md)

[![GitHub ★ 16](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=16&color=yellow&logo=github&style=flat)](https://github.com/ArtlexYoung/dsh-super-code) [![npm 30d 2,714](https://img.shields.io/static/v1?label=npm+30d&message=2%2C714&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-super-code) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-super-code)

**主要用途**：提供编码 Agent 预设、任务与委派台账、专业方法、分层记忆和可配置运行预算。

**推荐理由**：适合已有代码验收流程的DSH开发者在独立分支试复杂任务，确认预设预算和删除模式，并保留真实测试把关。

**使用条件**：熟悉DSH且已有代码验收流程的开发者可在独立分支试用。首次加载预设并确认安装所有权冲突、模型权限与删除模式；持续成本包括父子模型调用、上下文、压缩、检查和长期记忆维护，不能只看调用次数。可选storageDomain不可用会保留任务记忆但失去长期记忆。失败后检查pending持久化和旧binding，不盲重放写工具；以项目原测试、需求对照、总费用与人工时间共同验收。简单任务不应强建台账，未测到收益或出现未经确认的范围扩展就退回宿主原预设。 Q04(#research-q04)

[返回表格](#column-index)

<a id="plugin-1372993989-root"></a>

## [dsh-eteams](../../plugins/2507483326--dsh-eteams/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2507483326/dsh-eteams) [![npm 30d 1,404](https://img.shields.io/static/v1?label=npm+30d&message=1%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-eteams) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-eteams)

**主要用途**：为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。

**推荐理由**：可在备份和明确人工验收的任务中试用真实多会话协作；先修正个人状态路径、限定Web管理面并处理近期重启对账缺口。

**使用条件**：试用，备份/可信管理面/明确人工验收，completed按成员报告解读，不能当全自动业务验收。详见Q08(#research-q08)。

[返回表格](#column-index)

<a id="plugin-1374055714-root"></a>

## [3chat-customer-growth](../../plugins/3chatai-nct--3chatai-deepseek-harness-plugin/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)

**主要用途**：连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。

**推荐理由**：适合已有3Chat组织团队用测试组织先只读再极小授权发送；动态契约、单次防重放和unknown收据具体，仍须核完整确认/权限和跨调用幂等。

**使用条件**：有条件试用。已有3Chat组织团队先测试组织只读，再经完整内容/目标确认核极小授权发送、unknown与批次恢复。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1377185339-root"></a>

## [@240xu/dsh-session-lazy-view](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md)

[![npm 30d 1,359](https://img.shields.io/static/v1?label=npm+30d&message=1%2C359&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-session-lazy-view) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-session-lazy-view)

**主要用途**：以独立网页只读查看本地会话尾帧，提供时间线、搜索、统计及Markdown导出。

**推荐理由**：本机只读尾部排查有明确可控试用路径，全文资源与投影完整性限制必须保留。

**使用条件**：适合本机维护者先用只读小范围试用，默认tail或fast统计；搜索未命中和统计异常必须回原件复核。远程共享服务、任意符号链接目录或需完整审计时暂缓。参见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1382292535-root"></a>

## [dsh-jev-interceptor](../../plugins/asktheway--dsh-jev-interceptor/INSIGHT.md)

[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=yellow&logo=github&style=flat)](https://github.com/AskTheWay/dsh-jev-interceptor) [![npm 30d 2,667](https://img.shields.io/static/v1?label=npm+30d&message=2%2C667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-interceptor) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-jev-interceptor)

**主要用途**：为 DSH 工具调用提供 Jev 风险判断、审批辅助、语义会话保留与决策遥测。

**推荐理由**：适合工具调用频繁且能在隔离 profile 审阅遥测的开发者试用；保持图像卸载关闭、预批白名单为空并先验证 shadow 零副作用。

**使用条件**：建议只在隔离 profile 条件试用。保持 `imageOffloadEnabled: false`、预批白名单为空和主插件 shadow，先验证所有挂点零状态变化与故障回到 stock；再对可逆、可重建工具逐项扩范围。任何 shadow 副作用、无遥测有效动作或 session-reference 缺失都应停止。详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1385896447-root"></a>

## [Our Free Model](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md)

[![GitHub ★ 40,083](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C083&color=yellow&logo=github&style=flat)](https://github.com/Ebony-Vinyl/dsh-our-free-model)

**主要用途**：为 DSH 聚合多渠道模型，提供模型选择、本地兼容网关、用量看板与降级路由。

**推荐理由**：可信来源与脱敏单车道有可控试用价值，多渠道供给和数据边界不能由统一UI保证。

**使用条件**：Q06(#research-q06) 建议从单车道脱敏试用开始，核对来源、监听、凭据与失败切换；有稳定供给或严格数据要求时先补足专项证据。

[返回表格](#column-index)

## 更新时间

2026-10-24
