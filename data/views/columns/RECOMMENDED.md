[返回首页](../../../README.md)

# 推荐

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

<a id="column-index"></a>

**快速比较**

> 表格与下方说明按相同顺序排列；点击插件名跳转到本页说明。

| 插件 | 主要用途 | 为什么值得推荐 |
| --- | --- | --- |
| [dsh-scrape-webpage](#plugin-1334269686-root) | 抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。 | 公开静态正文抓取可小范围试用；必须逐页回查来源，动态或登录页面直接切浏览器。 |
| [@dsh-lsp-packs/dsh-lsp-cpp](#plugin-1344713526-dsh-lsp-cpp) | 把 clangd 配置为 DSH 的 C/C++ LSP 后端，为共享 lsp 工具提供导航、引用、实现和 hover。 | 具备 clangd 与编译数据库的 C/C++ 项目可先试用只读导航，并用 rg/编译器结果交叉核对。 |
| [dsh-fullscreen-input](#plugin-1407166868-root) | 为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。 | 固定宿主长文输入可试用，先核多引用/附件/发送状态；不依赖其独立草稿归档或绝对IME安全保证。 |
| [no-ai-style](#plugin-1418493685-root) | 提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 | 适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。 |
| [dsh-plugin-veriscope](#plugin-1422943787-root) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 |
| [dsh-markdown-live](#plugin-1426477683-root) | 在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。 | Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。 |
| [dsh-wsl-browser](#plugin-1350379388-root) | 从 WSL 调用 Windows 默认浏览器打开经过协议校验的网页地址。 | 频繁从 WSL 打开网页的用户可试用；把浏览器页面可见而非 PowerShell 返回作为验收。 |
| [dsh-wsl-cal](#plugin-1381860995-root) | 把本机 khal 日历以只读状态、今日和未来日程工具暴露给 DSH。 | 已稳定使用 khal 且只需只读日程的 WSL 用户可试用；必须验证时区和同步陈旧边界。 |
| [dsh-subagent](#plugin-1425006726-root) | 把多个已登录的外部编码 CLI 注册为 DSH 子代理并提供进度与恢复。 | 已信任多个外部 CLI 且能独立验收子任务的开发者可隔离试用；先验证权限、回退预算和重启去重。 |
| [embedded-workbench](#plugin-1276714299-root) | 为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。 | 可小规模验证八 Skill 与门禁，并以专家样例评估专业正确性。 |
| [dsh-stock-market](#plugin-1331846104-root) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。 |
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
| [dsh-openai-oauth](#plugin-1335992154-root) | 为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。 | 本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。详见[Q06](#research-q06)。 |
| [dsh-project-memory](#plugin-1339316901-root) | 为DSH索引项目文档和代码符号，分层召回带来源的内容，保存任务与经验，并按动作和查询门控注入相关记忆。 | 分层召回、项目根护栏与注入审计有明确试用价值；先单项目非敏感语料、审核引用和global，反思默认关闭，不能依近邻/曝光认定知识正确。 |
| [KRouter](#plugin-1341648244-root) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。 |
| [dsh-thumb](#plugin-1341694685-root) | 将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。 | 适合愿意自行维护的个人窄屏DSH用户受控试用，先核对列定位、设置与轨迹交互并保留关闭重载路径；不把免hash当免维护。 |
| [dsh-wsl-open](#plugin-1347958944-root) | 让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。 | 适合个人本地WSL办公文件流程试用；仅打开可信文件，核对宿主路由权限和真实窗口结果。 |
| [dsh-soul](#plugin-1352089397-root) | 为DSH提供可切换人格、会话与工作区范围绑定、提示注入和个性化界面。 | 频繁切换项目角色者可在非敏感工作区试用，先验证作用域优先级、撤销和跨会话隔离。 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz) | 解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。 | 对已有 CapMap 文档的团队有清晰只读导航价值，但必须把图视为声明并回查原文。 |
| [dsh-usage-analytics](#plugin-1356960582-root) | 在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。 | 适合本机个人用户对小样本受控试用并核对用量字段和索引状态；不作账单、技能成果成功率或多人权限保证。 |
| [dsh-plugin-notes](#plugin-1363429979-plugin-notes) | 把 Markdown 便签、任务泳道、新会话执行、定时调度与 WebDAV 备份组合在 DSH 中。 | 先个人隔离试用，删除后手动备份，定时任务加强监控。 |
| [dsh-eteams](#plugin-1372993989-root) | 为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。 | 可在备份和明确人工验收的任务中试用真实多会话协作；先修正个人状态路径、限定Web管理面并处理近期重启对账缺口。 |
| [3chat-customer-growth](#plugin-1374055714-root) | 连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。 | 适合已有3Chat组织团队用测试组织先只读再极小授权发送；动态契约、单次防重放和unknown收据具体，仍须核完整确认/权限和跨调用幂等。 |
| [dsh-cache-bricks](#plugin-1386463441-root) | 用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。 | 适合本地单用户维护者试用缓存诊断；先核对usage口径、隐私访问和记录淘汰，不把颜色当优化效果。 |
| [dsh-mimotts](#plugin-1397477851-root) | 为已定稿助手消息提供 MiMo TTS 朗读、播放器、配置卡和语音历史。 | 需要高频听取回复且接受 MiMo 服务的兼容 DSH 用户可用专用 Key 试用；先验证密钥、延迟和历史删除。 |
| [@y9931666/dsh-plugin-crossfire](#plugin-1399279897-root) | 把待核成果按维度交给只读工具受限的红队子agent，收集候选缺陷，由读者逐条认定或驳回，并保存定稿与旧缺陷复审历史。 | 逐条人工裁决/理由和只读专家接线实用；仅可信用户、真实connection认证和单进程状态条件下小规模试用，先核参数授权/坏行与实际成本。 |
| [dock-spreadsheet](#plugin-1400109121-root) | 在DSH dock-files中只读预览XLSX、XLS、ODS、CSV与TSV，支持切表、搜索筛选、坐标检查和显式链接导航。 | 同屏五格式与坐标/文本细节实用，可信私有Host普通文件可试；先核授权/资源和缓存/排序边界。 |
| [dsh-redstone-music](#plugin-1401037852-root) | 把 MIDI 与 SoundFont 渲染结果编排成 Minecraft 红石音乐数据包。 | 本地工件可控，但远程前必须证明听感和回滚。 |
| [AI 残渣清运](#plugin-1406611614-root) | 按规则把代理副产物移入可恢复回收站，并支持项目结项归档。 | 规则稳定且有版本控制的项目可先 dry-run 后试用；正式产物零误收和可恢复是硬门槛。 |
| [AIR-pixel Liquid Glass](#plugin-1414238544-root) | 为DSH提供可配置的液态玻璃主题、壁纸、桌面透明、光标与点击涟漪。 | 重视界面个性化者可在非关键工作区试用，先验证目标宿主版本、文字对比、性能与一键恢复。 |
| [dsh-subagent-role-router](#plugin-1421306160-root) | 按探索、规划、修补角色为子代理分配模型候补池，并处理故障转移与 fork 窗口切片。 | 多模型子代理团队可在带角色标签的低风险任务中试用，先核路由命中和失败重试预算。 |
| [dsh-ark-coding-provider](#plugin-1421741516-root) | 为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。 | 适合已有Ark订阅的本机DSH先单账户小样；专用流式/失败轮换和最小CLI环境明确，多账号/额度需核身份/HOME/取消与平台口径。 |
| [dsh-slipway](#plugin-1422359117-root) | 预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉逐文件校验发布字节。 | GitHub 插件维护者可在测试仓以默认 dry-run/verify 试用，真实发布仍需逐次人工授权。 |
| [dsh-which](#plugin-1423215529-root) | 为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。 | 适合多版本工具链维护者在可信环境试用只读诊断；关闭默认探测，并用真实shell查询核对关键结论。 |
| [dsh-vercel](#plugin-1425044910-root) | 通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。 | 匹配宿主可信单profile可先只读工具试用，核账户/团队再写；多账户并发和强撤销需先补凭据版本契约。 |
| [dsh-ai-armor](#plugin-1425045401-root) | 将Git回归、堆栈、配置、shell转义和MyBatis Plus静态审计工具合并分发。 | 可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。 |
| [dsh-zh-ui](#plugin-1427300390-root) | 提供中文UI设计Skill、项目设计规范注入和静态zh_design_lint检查工具。 | 中文界面团队可在源码审查阶段试用，并以真实渲染和可访问性测试复核静态结果。 |
| [dsh-composer-expand](#plugin-1334850903-root) | 在DSH会话输入工具行增加展开按钮，切换70vh长稿视图、记忆浏览器状态，并在展开时调整普通Enter行为。 | 功能窄且无额外外部数据面，长稿单composer场景可控试用；先核IME/菜单/撤销和收起，广兼容表不等于操作验证。 |
| [dsh-archived-conversations](#plugin-1335060115-root) | 在DSH设置页列归档会话并只读预览最近六条用户/助手文本，不切换或恢复会话。 | 可信本地HTTP单用户辨认归档可试用，知晓不能恢复/全文且快切要核标题正文。 |
| [dsh-recipe](#plugin-1336583700-root) | 把本地场景配方展开成去重插件清单和安装命令，支持关键词搜索与多配方组合。 | 适合作场景清单与命令草案，逐组件检查并补profile、版本和配置后使用；不能按一行命令假定整套可靠。 |

<a id="plugin-1334269686-root"></a>

## [dsh-scrape-webpage](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) [![npm 30d 1,067](https://img.shields.io/static/v1?label=npm+30d&message=1%2C067&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)

**主要用途**：抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。

**推荐理由**：公开静态正文抓取可小范围试用；必须逐页回查来源，动态或登录页面直接切浏览器。

**使用条件**：适合公开、无需登录且正文可抽查的研究页面小范围试用；登录态、强脚本渲染或付费墙继续使用宿主浏览器。成功标准是关键段落召回、标题与链接保留达到预定样本门槛，且人工修正少于复制粘贴；连续出现空正文、错正文或反爬重试时应停止并切换浏览器。 Q09(#research-q09)

[返回表格](#column-index)

<a id="plugin-1344713526-dsh-lsp-cpp"></a>

## [@dsh-lsp-packs/dsh-lsp-cpp](../../plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)

**主要用途**：把 clangd 配置为 DSH 的 C/C++ LSP 后端，为共享 lsp 工具提供导航、引用、实现和 hover。

**推荐理由**：具备 clangd 与编译数据库的 C/C++ 项目可先试用只读导航，并用 rg/编译器结果交叉核对。

**使用条件**：有稳定 clangd 与 compile_commands 的 C/C++ 项目可在只读导航任务中试用；先核四个操作对 sample 和本项目代表文件的结果，再允许模型依赖它改代码。没有共享 base、依赖重型交叉编译或无法限制 server资源的环境先观察，保留 rg/编译器作为基线。 详见Q09(#research-q09)。

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

<a id="plugin-1276714299-root"></a>

## [embedded-workbench](../../plugins/amethystluna--embedded-workbench/INSIGHT.md)

[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 2,906](https://img.shields.io/static/v1?label=npm+30d&message=2%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench)

**主要用途**：为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。

**推荐理由**：可小规模验证八 Skill 与门禁，并以专家样例评估专业正确性。

**使用条件**：先验证安装与注入，再以专家任务检行为；保留关闭门禁开关并单独考察 Skill 效果。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1331846104-root"></a>

## [dsh-stock-market](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)

**主要用途**：在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。

**推荐理由**：适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。

**使用条件**：资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。详见Q06(#research-q06)。

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

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,399](https://img.shields.io/static/v1?label=npm+30d&message=4%2C399&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

**主要用途**：为DSH索引项目文档和代码符号，分层召回带来源的内容，保存任务与经验，并按动作和查询门控注入相关记忆。

**推荐理由**：分层召回、项目根护栏与注入审计有明确试用价值；先单项目非敏感语料、审核引用和global，反思默认关闭，不能依近邻/曝光认定知识正确。

**使用条件**：有条件试用。先非敏感单项目/少量人工经验，核对引用和注入日志；反思/扩展保持默认关，global知识与近邻覆盖先审核，重要规范保留权威原件。详见Q09(#research-q09)。

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

<a id="plugin-1363429979-plugin-notes"></a>

## [dsh-plugin-notes](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,413](https://img.shields.io/static/v1?label=npm+30d&message=2%2C413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes)

**主要用途**：把 Markdown 便签、任务泳道、新会话执行、定时调度与 WebDAV 备份组合在 DSH 中。

**推荐理由**：先个人隔离试用，删除后手动备份，定时任务加强监控。

**使用条件**：先小规模个人便签试用；任务派发用隔离工作区，定时执行须监控；删除后手动备份并验证远端。详见Q05(#research-q05)。

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

<a id="plugin-1386463441-root"></a>

## [dsh-cache-bricks](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md)



**主要用途**：用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。

**推荐理由**：适合本地单用户维护者试用缓存诊断；先核对usage口径、隐私访问和记录淘汰，不把颜色当优化效果。

**使用条件**：建议本地单用户维护者用不敏感会话试用，先核对attempt、usage和访问边界；主链延迟、字段错位、UI干扰或权限不清时停止，回到宿主日志。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1397477851-root"></a>

## [dsh-mimotts](../../plugins/1497105876--dsh-mimotts/INSIGHT.md)



**主要用途**：为已定稿助手消息提供 MiMo TTS 朗读、播放器、配置卡和语音历史。

**推荐理由**：需要高频听取回复且接受 MiMo 服务的兼容 DSH 用户可用专用 Key 试用；先验证密钥、延迟和历史删除。

**使用条件**：适合已接受 MiMo 数据处理、需要经常听取定稿回复且可控制历史留存的 DSH Web 用户小范围试用；敏感文本、离线要求或不兼容宿主不适用。成功标准是消息与音频一一对应、密钥不出 Host、键盘播放器可用、延迟和每千字符成本低于用户上限；若历史无限增长、文本归一化丢失关键信息或路由鉴权失败，应停用。 Q09(#research-q09)

[返回表格](#column-index)

<a id="plugin-1399279897-root"></a>

## [@y9931666/dsh-plugin-crossfire](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire) [![npm 30d 669](https://img.shields.io/static/v1?label=npm+30d&message=669&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire)

**主要用途**：把待核成果按维度交给只读工具受限的红队子agent，收集候选缺陷，由读者逐条认定或驳回，并保存定稿与旧缺陷复审历史。

**推荐理由**：逐条人工裁决/理由和只读专家接线实用；仅可信用户、真实connection认证和单进程状态条件下小规模试用，先核参数授权/坏行与实际成本。

**使用条件**：有条件试用，须真实connection认证栅栏、可信同信任用户、单进程状态与人工核证据；先小规模匿名成果。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1400109121-root"></a>

## [dock-spreadsheet](../../plugins/aks1st--dock-spreadsheet/INSIGHT.md)

[![npm 30d 413](https://img.shields.io/static/v1?label=npm+30d&message=413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-spreadsheet) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-spreadsheet)

**主要用途**：在DSH dock-files中只读预览XLSX、XLS、ODS、CSV与TSV，支持切表、搜索筛选、坐标检查和显式链接导航。

**推荐理由**：同屏五格式与坐标/文本细节实用，可信私有Host普通文件可试；先核授权/资源和缓存/排序边界。

**使用条件**：可信私有Host普通文件可条件试用，先核三方加载/路径权限、缓存与字符串排序；公开Host/恶意大书/验算不宜直接依赖。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1401037852-root"></a>

## [dsh-redstone-music](../../plugins/19north--dsh-redstone-music/INSIGHT.md)



**主要用途**：把 MIDI 与 SoundFont 渲染结果编排成 Minecraft 红石音乐数据包。

**推荐理由**：本地工件可控，但远程前必须证明听感和回滚。

**使用条件**：建议试用，但只限本地世界和测试服。先短曲 render、审计划、build、离线试听，备份后再开 RCON；丢音、TPS 异常、凭据暴露或无法恢复旧包即停止。 参见Q04(#research-q04)、Q06(#research-q06)与Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1406611614-root"></a>

## [AI 残渣清运](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md)



**主要用途**：按规则把代理副产物移入可恢复回收站，并支持项目结项归档。

**推荐理由**：规则稳定且有版本控制的项目可先 dry-run 后试用；正式产物零误收和可恢复是硬门槛。

**使用条件**：适合副产物命名规律稳定、能先维护 ignore 且使用版本控制的项目试用；高价值数据目录或命名混乱仓库只运行 dry-run。成功标准是目标残渣召回达到门槛、正式文件零误收、结项引用全部可打开且 restore latest 可恢复；出现一次无法恢复的误收或 detached 清理无清单即停止自动模式。 Q09(#research-q09)

[返回表格](#column-index)

<a id="plugin-1414238544-root"></a>

## [AIR-pixel Liquid Glass](../../plugins/air-pixel--air-pixel-liquid-glass/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AIR-pixel/air-pixel-liquid-glass)

**主要用途**：为DSH提供可配置的液态玻璃主题、壁纸、桌面透明、光标与点击涟漪。

**推荐理由**：重视界面个性化者可在非关键工作区试用，先验证目标宿主版本、文字对比、性能与一键恢复。

**使用条件**：重视界面个性化者可在非关键工作区试用，先验证目标宿主版本、文字对比、性能与一键恢复。 采用结论是试用，不是安装保证；成功与停止标准见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1421306160-root"></a>

## [dsh-subagent-role-router](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/643048695/dsh-subagent-role-router)

**主要用途**：按探索、规划、修补角色为子代理分配模型候补池，并处理故障转移与 fork 窗口切片。

**推荐理由**：多模型子代理团队可在带角色标签的低风险任务中试用，先核路由命中和失败重试预算。

**使用条件**：适合已经并行使用多个子代理、拥有多供应商额度且能审查路由日志的团队做隔离试用；单模型、强合规固定路由或不能容忍凭据切换的环境不宜启用。先用带显式角色标签的小任务，验收角色命中、显式覆盖、冷却恢复和 seed 完整性，出现跨角色切换或重复烧额度即停用。 详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1421741516-root"></a>

## [dsh-ark-coding-provider](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Akiyuki1130/dsh-ark-coding-provider)

**主要用途**：为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。

**推荐理由**：适合已有Ark订阅的本机DSH先单账户小样；专用流式/失败轮换和最小CLI环境明确，多账号/额度需核身份/HOME/取消与平台口径。

**使用条件**：有条件试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1422359117-root"></a>

## [dsh-slipway](../../plugins/7gzgn--dsh-slipway/INSIGHT.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-slipway)

**主要用途**：预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉逐文件校验发布字节。

**推荐理由**：GitHub 插件维护者可在测试仓以默认 dry-run/verify 试用，真实发布仍需逐次人工授权。

**使用条件**：有固定 GitHub 发布流程的插件维护者可先在测试组织以 dry-run 和只读 verify 试用；真实 publish 必须由人核对 owner/repo、文件清单、secret 扫描与市场描述后单独授权。含大文件、需要 npm/GitLab、无法轮换 PAT 或不能接受部分远端状态的项目不适合。 详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1423215529-root"></a>

## [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)



**主要用途**：为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。

**推荐理由**：适合多版本工具链维护者在可信环境试用只读诊断；关闭默认探测，并用真实shell查询核对关键结论。

**使用条件**：建议在可信工具链环境限定试用只读报告，关闭默认probe，关键决策用真实shell交叉核对；一旦builtin、别名或cwd不一致，停止据此修改环境。详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1425044910-root"></a>

## [dsh-vercel](../../plugins/adenxie--dsh-vercel/INSIGHT.md)

[![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adenxie/dsh-vercel)

**主要用途**：通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。

**推荐理由**：匹配宿主可信单profile可先只读工具试用，核账户/团队再写；多账户并发和强撤销需先补凭据版本契约。

**使用条件**：可信单profile从只读工具试用，写操作核官方结果。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1425045401-root"></a>

## [dsh-ai-armor](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md)



**主要用途**：将Git回归、堆栈、配置、shell转义和MyBatis Plus静态审计工具合并分发。

**推荐理由**：可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。

**使用条件**：可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。 采用结论是试用，不是安装保证；成功与停止标准见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1427300390-root"></a>

## [dsh-zh-ui](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md)



**主要用途**：提供中文UI设计Skill、项目设计规范注入和静态zh_design_lint检查工具。

**推荐理由**：中文界面团队可在源码审查阶段试用，并以真实渲染和可访问性测试复核静态结果。

**使用条件**：中文界面团队可在源码审查阶段试用，并以真实渲染和可访问性测试复核静态结果。 采用结论是试用，不是安装保证；成功与停止标准见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1334850903-root"></a>

## [dsh-composer-expand](../../plugins/13071301808--dsh-composer-expand/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand) [![npm 30d 969](https://img.shields.io/static/v1?label=npm+30d&message=969&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-composer-expand) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-composer-expand)

**主要用途**：在DSH会话输入工具行增加展开按钮，切换70vh长稿视图、记忆浏览器状态，并在展开时调整普通Enter行为。

**推荐理由**：功能窄且无额外外部数据面，长稿单composer场景可控试用；先核IME/菜单/撤销和收起，广兼容表不等于操作验证。

**使用条件**：有条件试用，长草稿/单composer用户先核Enter、IME、菜单与收起行为；不作为草稿备份。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1335060115-root"></a>

## [dsh-archived-conversations](../../plugins/aks1st--dsh-archived-conversations/INSIGHT.md)

[![npm 30d 804](https://img.shields.io/static/v1?label=npm+30d&message=804&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-archived-conversations) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-archived-conversations)

**主要用途**：在DSH设置页列归档会话并只读预览最近六条用户/助手文本，不切换或恢复会话。

**推荐理由**：可信本地HTTP单用户辨认归档可试用，知晓不能恢复/全文且快切要核标题正文。

**使用条件**：本地HTTP单用户只读辨认可试用。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1336583700-root"></a>

## [dsh-recipe](../../plugins/863683348--dsh-recipe/INSIGHT.md)

[![npm 30d 123](https://img.shields.io/static/v1?label=npm+30d&message=123&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-recipe) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-recipe)

**主要用途**：把本地场景配方展开成去重插件清单和安装命令，支持关键词搜索与多配方组合。

**推荐理由**：适合作场景清单与命令草案，逐组件检查并补profile、版本和配置后使用；不能按一行命令假定整套可靠。

**使用条件**：作为选型草案试用，补齐profile/版本/配置再执行。详见Q05(#research-q05)。

[返回表格](#column-index)

## 更新时间

2026-10-23
