[返回首页](../../../README.md)

# 推荐

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

<a id="column-index"></a>

**快速比较**

> 表格与下方说明按相同顺序排列；点击插件名跳转到本页说明。

| 插件 | 主要用途 | 为什么值得推荐 |
| --- | --- | --- |
| [dsh-tool-budget](#plugin-1350325873-root) | 按运行中的Agent限制工具调用总次数，支持包含与排除规则并在超额时拦截。 | 适合需要明确工具调用停止点的长任务，先观察同类任务调用量再设阈值；只限制每Agent调用次数，不是团队现金预算，尚未进行真实宿主验证。 |
| [DSH Telemetry Redactor](#plugin-1333368566-root) | 在遥测记录瀑布中递归脱敏支持的凭据模式，保留原始会话日志。 | 已有遥测出口的部署者可用假密钥试验脱敏，先核对漏删、误删及原始日志保留。 |
| [dsh-wsl-hostsvc](#plugin-1351854010-root) | 从WSL探测Windows端本地模型服务，并生成连接与上下文配置建议。 | Windows本地模型用户可试TCP/API分层探测，先核IP、模型ID与实际小生成，再采用配置片段。 |
| [dsh-fullscreen-input](#plugin-1407166868-root) | 为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。 | 固定宿主长文输入可试用，先核多引用/附件/发送状态；不依赖其独立草稿归档或绝对IME安全保证。 |
| [dsh-plugin-veriscope](#plugin-1422943787-root) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 |
| [embedded-workbench](#plugin-1276714299-root) | 为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。 | 可小规模验证八 Skill 与门禁，并以专家样例评估专业正确性。 |
| [dsh-anet](#plugin-1302597978-deploy-plugins-dist-dsh) | 将DSH接入本地anet节点，装配stdio MCP和委派、设置、状态三Skill，以统一执行路径/身份发现和跟踪跨智能体任务。 | 统一节点/MCP/Skill接线实用，适合能管理身份/daemon/支出的技术用户，先核真实节点和安装信任，不把指南当隔离。 |
| [dsh-stock-market](#plugin-1331846104-root) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。 |
| [dsh-verification-receipt](#plugin-1333370288-root) | 被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。 | 被动最小字段与边界文档清楚，适合精确宿主私有单进程路径观察；词法/可重算hash与无界queue不适合验证门禁或强审计。 |
| [dsh-plugin-manager](#plugin-1334267268-root) | 给 DSH 插件提供中文目录说明、启停、备注编辑及配置备份管理界面。 | 维护多插件者可在独立profile试用中文目录与启停；先验系统保护、表达式拒绝、备份恢复和真实fiber状态。 |
| [dsh-LorebookMD](#plugin-1334395883-root) | 管理提示词预设并导入酒馆角色卡、世界书及正则资料，按需注入对话上下文。 | 已有酒馆角色资料的作者可导入副本试用；核对占位符丢语义和世界书命中，外部卡注入前审内容。 |
| [@awiki/dsh-plugin](#plugin-1334428397-root) | 将AWiki身份、私信群聊与邮件接入DSH，提供Web界面和十个通信工具，支持用户摘要及可选白名单来信到Agent。 | 已有AWiki通信需求可固定依赖试用，保持listener关闭、明确发送与模型数据边界；生产身份恢复需另核SDK。 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在 DSH 中搜索 GitHub 插件并提供安装、更新、冲突预检与启动恢复。 | 维护多插件环境可在隔离profile试用冲突预检与恢复；先注入加载失败并核对备份，不把进程稳定视作功能验收。 |
| [dsh-web-tools](#plugin-1335219884-root) | 为DSH统一搜索与抓取接口适配多Provider、自定义JSON源及X/小红书原生浏览器检索。 | 适合可信本机公开资料检索的小范围试用，需核原来源/全文和实际支出；不可把off、required或false截断标记当全局保证。 |
| [Markdown 批注器](#plugin-1335286261-root) | 在 Better Sidebar 中预览和编辑 Markdown，把批注整理为会话草稿。 | 审阅中等Markdown者可按次试用定位批注；重生成后核对重复段落锚点并及时导出，不用于跨日未保存档案。 |
| [dsh-verify](#plugin-1335843750-root) | 执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。 | 适合可信本地应用的有限浏览器验收试用；独立审读spec和批准基线，不把新基线或runner错误当交付通过。 |
| [dsh-openai-oauth](#plugin-1335992154-root) | 为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。 | 本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。 |
| [dsh-plugin-translation](#plugin-1336663562-root) | 为Agent翻译提供分段、术语提取、一致性检查、风格指南及工作区翻译记忆。 | 持续技术翻译者可试分段术语记忆与数字检查；以否定和主客体样例验规则，高分仍需语义校译，词表先审后存。 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。详见[Q06](#research-q06)。 |
| [dsh-project-memory](#plugin-1339316901-root) | 为DSH索引项目文档和代码符号，分层召回带来源的内容，保存任务与经验，并按动作和查询门控注入相关记忆。 | 分层召回、项目根护栏与注入审计有明确试用价值；先单项目非敏感语料、审核引用和global，反思默认关闭，不能依近邻/曝光认定知识正确。 |
| [gzhflow](#plugin-1339888505-root) | 为公众号内容提供素材、写作、风格质检、配图、排版和推草稿箱的技能及工具流程。 | 已有公众号编辑流程者可先试本地质检和排版；分数非事实质量，推草稿需逐次授权核远端结果，未知响应不要直接重试。 |
| [KRouter](#plugin-1341648244-root) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。 |
| [dsh-thumb](#plugin-1341694685-root) | 将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。 | 适合愿意自行维护的个人窄屏DSH用户受控试用，先核对列定位、设置与轨迹交互并保留关闭重载路径；不把免hash当免维护。 |
| [dsh-plugin-nlbi](#plugin-1343622602-root) | 在 DSH 中用自然语言查询 MySQL，生成表格、图表与可保存报表。 | 有只读MySQL环境的分析者可用标准答案试SQL报表，先核业务口径与数据权限，重跑仍验Schema。 |
| [dsh-invoice-tools](#plugin-1344714819-root) | 在本地解析电子发票字段，核对金额并汇总生成报销单资料。 | 个人可用脱敏XML或文本票试汇总草稿；逐张核票号金额与买卖方，显式会话，xlsx.b64解码后再交财务，不支持OCR真伪查验。 |
| [dsh-api-dashboard](#plugin-1346196699-root) | 在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。 | 多供应商用户可限可查询平台试额度看板，先对账和核对币种，自更新单独验备份回滚。 |
| [dsh-wsl-open](#plugin-1347958944-root) | 让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。 | 适合个人本地WSL办公文件流程试用；仅打开可信文件，核对宿主路由权限和真实窗口结果。 |
| [dsh-wsl-tray](#plugin-1351853903-root) | 为 WSL 内的 DSH Web 安装或报告 Windows 托盘与快捷方式启动入口。 | 已有dsh-wsl-kit者可显式kitPath试桌面恢复入口，先从快捷方式真实启动，核token去向与回退。 |
| [dsh-usage-analytics](#plugin-1356960582-root) | 在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。 | 适合本机个人用户对小样本受控试用并核对用量字段和索引状态；不作账单、技能成果成功率或多人权限保证。 |
| [模型信息补全](#plugin-1358816037-root) | 从 models.dev 为自定义模型补齐缺失能力，并保留人工确认与未声明状态。 | 维护多模型者可备份后试单供应商填充，核对官方能力及同名端点，未匹配项保留人工确认。 |
| [dsh-plugin-notes](#plugin-1363429979-plugin-notes) | 把 Markdown 便签、任务泳道、新会话执行、定时调度与 WebDAV 备份组合在 DSH 中。 | 先个人隔离试用，删除后手动备份，定时任务加强监控。 |
| [Forge 用量计费](#plugin-1363429979-plugin-usage-billing) | 从会话用量建立账本，以事件时刻价格计费并展示预算、趋势与未计价项目。 | 需核对模型支出的用户可先选单模型一天账单，检查缓存计价、币种及未知金额。 |
| [dsh-llm-balance-siderbar](#plugin-1366370702-root) | 按已挂载模型路由查询余额或套餐额度，并在侧栏保留独立错误和陈旧状态。 | 多provider用户可在每类仅一个账户路由时试额度面板；同provider多key会共用首路由缓存，不能当当前各账户余额。 |
| [dsh-reasoning-tiers](#plugin-1367305514-root) | 按规则补齐第三方模型推理档位，并在设置页编辑模型能力声明。 | 自定义模型用户可备份profile后试单模型档位修补，先核对真实请求和撤销结果。 |
| [dsh-eteams](#plugin-1372993989-root) | 为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。 | 可在备份和明确人工验收的任务中试用真实多会话协作；先修正个人状态路径、限定Web管理面并处理近期重启对账缺口。 |
| [3Chat 私域客户运营](#plugin-1374055714-root) | 连接 3Chat 客户和会话，准备跟进消息并经确认发送及查询批次结果。 | 已有3Chat渠道团队可先在测试客户试用查询和确认单发；批量前核对收件人，未知发送结果须人工查证。 |
| [dsh-plugin-proxy](#plugin-1374274543-root) | 通过运行时设置切换DSH全局fetch代理，支持直连、系统代理和手动HTTP或SOCKS代理。 | 频繁换网络者可用测试端点试热切换，先确认错误配置直连回退可接受并验卸载恢复。 |
| [dsh-wsl-media](#plugin-1381725238-root) | 在DSH中调用本地媒体与文档CLI，进行探测、转写、OCR及格式处理。 | 媒体资料处理者可设小范围目录逐工具试样本，核原件和输出，禁止复用同名路径避免ffmpeg -y覆盖。 |
| [dsh-wsl-struct](#plugin-1381832935-root) | 在 DSH 中调用 jq、yq 和只读 SQLite 查询本地结构化数据。 | 固定配置查询者可在副本限根试结构化工具，先核yq方言与表达式权限，复杂SQL结果人工复核。 |
| [dsh-wsl-terraform](#plugin-1381843937-root) | 在 DSH 中查看 Terraform/OpenTofu 校验、计划摘要与状态资源列表。 | 已有Terraform审批者可限沙盒试计划摘要，显式根目录和凭据，部署前必须回看完整计划。 |
| [dsh-cache-bricks](#plugin-1386463441-root) | 用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。 | 适合本地单用户维护者试用缓存诊断；先核对usage口径、隐私访问和记录淘汰，不把颜色当优化效果。 |
| [@y9931666/dsh-plugin-crossfire](#plugin-1399279897-root) | 把待核成果按维度交给只读工具受限的红队子agent，收集候选缺陷，由读者逐条认定或驳回，并保存定稿与旧缺陷复审历史。 | 逐条人工裁决/理由和只读专家接线实用；仅可信用户、真实connection认证和单进程状态条件下小规模试用，先核参数授权/坏行与实际成本。 |
| [dock-spreadsheet](#plugin-1400109121-root) | 在DSH dock-files中只读预览XLSX、XLS、ODS、CSV与TSV，支持切表、搜索筛选、坐标检查和显式链接导航。 | 同屏五格式与坐标/文本细节实用，可信私有Host普通文件可试；先核授权/资源和缓存/排序边界。 |
| [dsh-ark-coding-provider](#plugin-1421741516-root) | 为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。 | 适合已有Ark订阅的本机DSH先单账户小样；专用流式/失败轮换和最小CLI环境明确，多账号/额度需核身份/HOME/取消与平台口径。 |
| [dsh-file-handover](#plugin-1422380986-root) | 将显式指定的本地文件填入Windows原生文件对话框，逐项回读后再确认。 | 仅Windows单一明确文件框可试用；dryRun核PID标题并收敛唯一窗口，应用回读文件名大小，多窗口当前不能保证目标归属。 |
| [dsh-douyin-publish](#plugin-1422396858-root) | 把本地视频上传到抖音或B站投稿页并填写内容，默认私密且停在发布前。 | 固定抖音/B站工作流者可从dryRun再非公开draft试用；逐字段回读视频及可见性，发布未知先查平台勿重跑。 |
| [dsh-which](#plugin-1423215529-root) | 为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。 | 适合多版本工具链维护者在可信环境试用只读诊断；关闭默认探测，并用真实shell查询核对关键结论。 |
| [dsh-vercel](#plugin-1425044910-root) | 通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。 | 匹配宿主可信单profile可先只读工具试用，核账户/团队再写；多账户并发和强撤销需先补凭据版本契约。 |
| [dsh-usage-dashboard-plus](#plugin-1334023305-root) | 在 DSH 侧栏和设置页展示账户余额、调用用量与分模型费用统计。 | 多模型用户可试用统一用量观察；先对账一天主调用与视觉日志并补未知模型价，不能当财务账本。 |
| [dsh-composer-expand](#plugin-1334850903-root) | 在DSH会话输入工具行增加展开按钮，切换70vh长稿视图、记忆浏览器状态，并在展开时调整普通Enter行为。 | 功能窄且无额外外部数据面，长稿单composer场景可控试用；先核IME/菜单/撤销和收起，广兼容表不等于操作验证。 |

<a id="plugin-1350325873-root"></a>

## [dsh-tool-budget](../../plugins/173787247--dsh-tool-budget/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget)

**主要用途：**按运行中的Agent限制工具调用总次数，支持包含与排除规则并在超额时拦截。

**推荐理由：**适合需要明确工具调用停止点的长任务，先观察同类任务调用量再设阈值；只限制每Agent调用次数，不是团队现金预算，尚未进行真实宿主验证。

**使用条件：**先按一类任务观察正常调用分布，再设阈值；长后台任务查询可排除，但排除列表应保持有限。

[返回表格](#column-index)

<a id="plugin-1333368566-root"></a>

## [DSH Telemetry Redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) [![npm 30d 1,182](https://img.shields.io/static/v1?label=npm+30d&message=1%2C182&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor)

**主要用途：**在遥测记录瀑布中递归脱敏支持的凭据模式，保留原始会话日志。

**推荐理由：**已有遥测出口的部署者可用假密钥试验脱敏，先核对漏删、误删及原始日志保留。

**使用条件：**先在测试遥测里放入假密钥、普通文本和 token 计量字段，核对脱敏与保真后再接后端。

[返回表格](#column-index)

<a id="plugin-1351854010-root"></a>

## [dsh-wsl-hostsvc](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-hostsvc)

**主要用途：**从WSL探测Windows端本地模型服务，并生成连接与上下文配置建议。

**推荐理由：**Windows本地模型用户可试TCP/API分层探测，先核IP、模型ID与实际小生成，再采用配置片段。

**使用条件：**优先核对apiReady而非仅TCP，再确认模型ID和真实上下文上限。

[返回表格](#column-index)

<a id="plugin-1407166868-root"></a>

## [dsh-fullscreen-input](../../plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input)

**主要用途：**为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。

**推荐理由：**固定宿主长文输入可试用，先核多引用/附件/发送状态；不依赖其独立草稿归档或绝对IME安全保证。

**使用条件：**固定宿主长文编辑可试用，先小草稿检查引用附件。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1422943787-root"></a>

## [dsh-plugin-veriscope](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)

**主要用途：**重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。

**推荐理由：**已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。

**使用条件：**可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1276714299-root"></a>

## [embedded-workbench](../../plugins/amethystluna--embedded-workbench/INSIGHT.md)

[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 2,906](https://img.shields.io/static/v1?label=npm+30d&message=2%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench)

**主要用途：**为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。

**推荐理由：**可小规模验证八 Skill 与门禁，并以专家样例评估专业正确性。

**使用条件：**先验证安装与注入，再以专家任务检行为；保留关闭门禁开关并单独考察 Skill 效果。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1302597978-deploy-plugins-dist-dsh"></a>

## [dsh-anet](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/ANetResearch/ANet)

**主要用途：**将DSH接入本地anet节点，装配stdio MCP和委派、设置、状态三Skill，以统一执行路径/身份发现和跟踪跨智能体任务。

**推荐理由：**统一节点/MCP/Skill接线实用，适合能管理身份/daemon/支出的技术用户，先核真实节点和安装信任，不把指南当隔离。

**使用条件：**有条件试用，明确跨节点需求并能管理身份/daemon/hub/支出者先核实际节点和对端；普通本地任务不必增加复杂度。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1331846104-root"></a>

## [dsh-stock-market](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)

**主要用途：**在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。

**推荐理由：**适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。

**使用条件：**资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1333370288-root"></a>

## [dsh-verification-receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt)

**主要用途：**被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。

**推荐理由：**被动最小字段与边界文档清楚，适合精确宿主私有单进程路径观察；词法/可重算hash与无界queue不适合验证门禁或强审计。

**使用条件：**有条件试用，精确支持宿主+私有一进程一文件，将其当启发式观察摘要，不作验证通过/防篡改审计。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1334267268-root"></a>

## [dsh-plugin-manager](../../plugins/2768651338--dsh-plugin-manager/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-plugin-manager) [![npm 30d 923](https://img.shields.io/static/v1?label=npm+30d&message=923&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager)

**主要用途：**给 DSH 插件提供中文目录说明、启停、备注编辑及配置备份管理界面。

**推荐理由：**维护多插件者可在独立profile试用中文目录与启停；先验系统保护、表达式拒绝、备份恢复和真实fiber状态。

**使用条件：**需要批量辨认和启停时先在独立profile试用，核对系统保护、表达式拒绝、备份恢复及实际fiber状态后扩用。

[返回表格](#column-index)

<a id="plugin-1334395883-root"></a>

## [dsh-LorebookMD](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 705](https://img.shields.io/static/v1?label=npm+30d&message=705&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

**主要用途：**管理提示词预设并导入酒馆角色卡、世界书及正则资料，按需注入对话上下文。

**推荐理由：**已有酒馆角色资料的作者可导入副本试用；核对占位符丢语义和世界书命中，外部卡注入前审内容。

**使用条件：**已有酒馆资料的写作者可先导入副本。检查占位符、世界书命中与激活预设，别直接把原平台效果视为DSH已复现。

[返回表格](#column-index)

<a id="plugin-1334428397-root"></a>

## [@awiki/dsh-plugin](../../plugins/agentconnect--dsh-awiki/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

**主要用途：**将AWiki身份、私信群聊与邮件接入DSH，提供Web界面和十个通信工具，支持用户摘要及可选白名单来信到Agent。

**推荐理由：**已有AWiki通信需求可固定依赖试用，保持listener关闭、明确发送与模型数据边界；生产身份恢复需另核SDK。

**使用条件：**有条件试用，已有AWiki需求者先固定依赖与身份/发送审批，listener保持关闭直到独立评估效果重试。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1335098475-root"></a>

## [dsh-plugin-mall](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1e0zj/dsh-plugin-mall) [![npm 30d 1,526](https://img.shields.io/static/v1?label=npm+30d&message=1%2C526&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)

**主要用途：**在 DSH 中搜索 GitHub 插件并提供安装、更新、冲突预检与启动恢复。

**推荐理由：**维护多插件环境可在隔离profile试用冲突预检与恢复；先注入加载失败并核对备份，不把进程稳定视作功能验收。

**使用条件：**适合维护多个插件的DSH环境；先在隔离profile验证冲突提示和回滚，再用于日常安装，重要环境保留独立备份。

[返回表格](#column-index)

<a id="plugin-1335219884-root"></a>

## [dsh-web-tools](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=yellow&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools)

**主要用途：**为DSH统一搜索与抓取接口适配多Provider、自定义JSON源及X/小红书原生浏览器检索。

**推荐理由：**适合可信本机公开资料检索的小范围试用，需核原来源/全文和实际支出；不可把off、required或false截断标记当全局保证。

**使用条件：**可信本机公开任务试用并核原始来源/预算，严格隔离/全量内容要求先核具体缺口。详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1335286261-root"></a>

## [Markdown 批注器](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-md-annotator)

**主要用途：**在 Better Sidebar 中预览和编辑 Markdown，把批注整理为会话草稿。

**推荐理由：**审阅中等Markdown者可按次试用定位批注；重生成后核对重复段落锚点并及时导出，不用于跨日未保存档案。

**使用条件：**适合短期人工审阅中等大小Markdown；接受批注不持久化且能按次导出时再试用，不用于未经保存的跨日批注存档。

[返回表格](#column-index)

<a id="plugin-1335843750-root"></a>

## [dsh-verify](../../plugins/263311487-ux--dsh-verify/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/263311487-ux/dsh-verify) [![npm 30d 2,385](https://img.shields.io/static/v1?label=npm+30d&message=2%2C385&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verify) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verify)

**主要用途：**执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。

**推荐理由：**适合可信本地应用的有限浏览器验收试用；独立审读spec和批准基线，不把新基线或runner错误当交付通过。

**使用条件：**建议可信本地有限spec试用，故意缺陷应失败、合法实现应通过；空覆盖、新基线和ERROR不放行，host阻塞或范围不清时停止。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1335992154-root"></a>

## [dsh-openai-oauth](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AdonisSheldon/dsh-openai-oauth) [![npm 30d 770](https://img.shields.io/static/v1?label=npm+30d&message=770&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-openai-oauth) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-openai-oauth)

**主要用途：**为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。

**推荐理由：**本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。

**使用条件：**可试用为本机独立模型provider，保护明文凭据与真实工具审批，保留替代路由；不外推远程部署/静态模型全部可用/免费。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1336663562-root"></a>

## [dsh-plugin-translation](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation) [![npm 30d 1,042](https://img.shields.io/static/v1?label=npm+30d&message=1%2C042&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation)

**主要用途：**为Agent翻译提供分段、术语提取、一致性检查、风格指南及工作区翻译记忆。

**推荐理由：**持续技术翻译者可试分段术语记忆与数字检查；以否定和主客体样例验规则，高分仍需语义校译，词表先审后存。

**使用条件：**适合技术文档翻译先检查数字与术语一致。先用正反译和否定样例验证规则，quality高分后仍人工核对意义；不要将词表自动积累当正确性保证。

[返回表格](#column-index)

<a id="plugin-1336720864-root"></a>

## [dsh-plugin-console](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-plugin-console) [![npm 30d 1,111](https://img.shields.io/static/v1?label=npm+30d&message=1%2C111&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-console) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-console)

**主要用途：**在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。

**推荐理由：**维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。详见Q06(#research-q06)。

**使用条件：**本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1339316901-root"></a>

## [dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,399](https://img.shields.io/static/v1?label=npm+30d&message=4%2C399&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

**主要用途：**为DSH索引项目文档和代码符号，分层召回带来源的内容，保存任务与经验，并按动作和查询门控注入相关记忆。

**推荐理由：**分层召回、项目根护栏与注入审计有明确试用价值；先单项目非敏感语料、审核引用和global，反思默认关闭，不能依近邻/曝光认定知识正确。

**使用条件：**有条件试用。先非敏感单项目/少量人工经验，核对引用和注入日志；反思/扩展保持默认关，global知识与近邻覆盖先审核，重要规范保留权威原件。详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1339888505-root"></a>

## [gzhflow](../../plugins/andiii208--gzhflow/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)

**主要用途：**为公众号内容提供素材、写作、风格质检、配图、排版和推草稿箱的技能及工具流程。

**推荐理由：**已有公众号编辑流程者可先试本地质检和排版；分数非事实质量，推草稿需逐次授权核远端结果，未知响应不要直接重试。

**使用条件：**适合已有公众号编辑流程者先只做本地质检/排版；事实审阅和正式发布仍由人确认，API权限与账户条件另核。

[返回表格](#column-index)

<a id="plugin-1341648244-root"></a>

## [KRouter](../../plugins/398894496-arch--krouter/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)

**主要用途：**让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。

**推荐理由：**lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。

**使用条件：**有条件试用lookup-only。先非敏感个人vault核对来源、旧页与拒答，保持原件；nightly/导入/writer按各lane权限另评，不把接头卸载当timer停止。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1341694685-root"></a>

## [dsh-thumb](../../plugins/aliceljy--dsh-thumb/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb)

**主要用途：**将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。

**推荐理由：**适合愿意自行维护的个人窄屏DSH用户受控试用，先核对列定位、设置与轨迹交互并保留关闭重载路径；不把免hash当免维护。

**使用条件：**个人窄屏用户可受控试用，先检查会话切换、设置与轨迹，保留?thumb=0后重载的退出路径；定位或触控出现影响任务的问题就停用。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1343622602-root"></a>

## [dsh-plugin-nlbi](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi) [![npm 30d 906](https://img.shields.io/static/v1?label=npm+30d&message=906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi)

**主要用途：**在 DSH 中用自然语言查询 MySQL，生成表格、图表与可保存报表。

**推荐理由：**有只读MySQL环境的分析者可用标准答案试SQL报表，先核业务口径与数据权限，重跑仍验Schema。

**使用条件：**适合有可复核SQL和只读数据环境的分析任务；先定义关键指标标准答案，核对生成SQL再复用报表。

[返回表格](#column-index)

<a id="plugin-1344714819-root"></a>

## [dsh-invoice-tools](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-invoice-tools) [![npm 30d 437](https://img.shields.io/static/v1?label=npm+30d&message=437&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-invoice-tools) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-invoice-tools)

**主要用途：**在本地解析电子发票字段，核对金额并汇总生成报销单资料。

**推荐理由：**个人可用脱敏XML或文本票试汇总草稿；逐张核票号金额与买卖方，显式会话，xlsx.b64解码后再交财务，不支持OCR真伪查验。

**使用条件：**先用脱敏且有XML/文本层的发票做汇总草稿；逐张核票号、买卖方与金额，确认缓存会话和.xlsx.b64解码后再交财务。

[返回表格](#column-index)

<a id="plugin-1346196699-root"></a>

## [dsh-api-dashboard](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,179](https://img.shields.io/static/v1?label=npm+30d&message=4%2C179&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)

**主要用途：**在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。

**推荐理由：**多供应商用户可限可查询平台试额度看板，先对账和核对币种，自更新单独验备份回滚。

**使用条件：**先选择实际可查询的平台，对照控制台账单和混合币种；把看板作为预警与估算入口，自更新前保留配置和回退。

[返回表格](#column-index)

<a id="plugin-1347958944-root"></a>

## [dsh-wsl-open](../../plugins/173787247--dsh-wsl-open/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-open)

**主要用途：**让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。

**推荐理由：**适合个人本地WSL办公文件流程试用；仅打开可信文件，核对宿主路由权限和真实窗口结果。

**使用条件：**建议个人本地WSL用户限定试用可信办公文件，验收以正确窗口实际显示为准；复杂路径误点、权限不清或不明应用启动时停止。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1351853903-root"></a>

## [dsh-wsl-tray](../../plugins/173787247--dsh-wsl-tray/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tray)

**主要用途：**为 WSL 内的 DSH Web 安装或报告 Windows 托盘与快捷方式启动入口。

**推荐理由：**已有dsh-wsl-kit者可显式kitPath试桌面恢复入口，先从快捷方式真实启动，核token去向与回退。

**使用条件：**适合已使用 dsh-wsl-kit 的 Windows 用户；显式设置 kitPath，先从快捷方式实际启动一次，再依赖托盘恢复，不把生成脚本成功当启动成功。

[返回表格](#column-index)

<a id="plugin-1356960582-root"></a>

## [dsh-usage-analytics](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-usage-analytics)

**主要用途：**在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。

**推荐理由：**适合本机个人用户对小样本受控试用并核对用量字段和索引状态；不作账单、技能成果成功率或多人权限保证。

**使用条件：**个人本机用户可用少量可人工核对的会话试用；先确认宿主依赖与访问控制，遇到用量无法对账、索引持续失败即停止依赖图表。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1358816037-root"></a>

## [模型信息补全](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill)

**主要用途：**从 models.dev 为自定义模型补齐缺失能力，并保留人工确认与未声明状态。

**推荐理由：**维护多模型者可备份后试单供应商填充，核对官方能力及同名端点，未匹配项保留人工确认。

**使用条件：**先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。

[返回表格](#column-index)

<a id="plugin-1363429979-plugin-notes"></a>

## [dsh-plugin-notes](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,413](https://img.shields.io/static/v1?label=npm+30d&message=2%2C413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes)

**主要用途：**把 Markdown 便签、任务泳道、新会话执行、定时调度与 WebDAV 备份组合在 DSH 中。

**推荐理由：**先个人隔离试用，删除后手动备份，定时任务加强监控。

**使用条件：**先小规模个人便签试用；任务派发用隔离工作区，定时执行须监控；删除后手动备份并验证远端。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1363429979-plugin-usage-billing"></a>

## [Forge 用量计费](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,814](https://img.shields.io/static/v1?label=npm+30d&message=1%2C814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing)

**主要用途：**从会话用量建立账本，以事件时刻价格计费并展示预算、趋势与未计价项目。

**推荐理由：**需核对模型支出的用户可先选单模型一天账单，检查缓存计价、币种及未知金额。

**使用条件：**先选择一个模型和一天真实账单，逐项核对 token、缓存计价、币种和未计价行。

[返回表格](#column-index)

<a id="plugin-1366370702-root"></a>

## [dsh-llm-balance-siderbar](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md)

[![npm 30d 859](https://img.shields.io/static/v1?label=npm+30d&message=859&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-llm-balance) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-llm-balance)

**主要用途：**按已挂载模型路由查询余额或套餐额度，并在侧栏保留独立错误和陈旧状态。

**推荐理由：**多provider用户可在每类仅一个账户路由时试额度面板；同provider多key会共用首路由缓存，不能当当前各账户余额。

**使用条件：**适合路由较多且有额度查询接口者；先核账户匹配、来源新鲜度和外层路由授权。

[返回表格](#column-index)

<a id="plugin-1367305514-root"></a>

## [dsh-reasoning-tiers](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md)

[![npm 30d 1,044](https://img.shields.io/static/v1?label=npm+30d&message=1%2C044&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers)

**主要用途：**按规则补齐第三方模型推理档位，并在设置页编辑模型能力声明。

**推荐理由：**自定义模型用户可备份profile后试单模型档位修补，先核对真实请求和撤销结果。

**使用条件：**先备份 profile，对单个模型检查实际请求与撤销结果，再考虑批量补齐。

[返回表格](#column-index)

<a id="plugin-1372993989-root"></a>

## [dsh-eteams](../../plugins/2507483326--dsh-eteams/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2507483326/dsh-eteams) [![npm 30d 1,404](https://img.shields.io/static/v1?label=npm+30d&message=1%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-eteams) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-eteams)

**主要用途：**为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。

**推荐理由：**可在备份和明确人工验收的任务中试用真实多会话协作；先修正个人状态路径、限定Web管理面并处理近期重启对账缺口。

**使用条件：**试用，备份/可信管理面/明确人工验收，completed按成员报告解读，不能当全自动业务验收。详见Q08(#research-q08)。

[返回表格](#column-index)

<a id="plugin-1374055714-root"></a>

## [3Chat 私域客户运营](../../plugins/3chatai-nct--3chatai-deepseek-harness-plugin/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)

**主要用途：**连接 3Chat 客户和会话，准备跟进消息并经确认发送及查询批次结果。

**推荐理由：**已有3Chat渠道团队可先在测试客户试用查询和确认单发；批量前核对收件人，未知发送结果须人工查证。

**使用条件：**已有3Chat渠道的团队先用测试客户验证查询和确认发送，再启用批量；保留人工处理未知结果和业务回复的流程。

[返回表格](#column-index)

<a id="plugin-1374274543-root"></a>

## [dsh-plugin-proxy](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md)

[![npm 30d 85](https://img.shields.io/static/v1?label=npm+30d&message=85&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy)

**主要用途：**通过运行时设置切换DSH全局fetch代理，支持直连、系统代理和手动HTTP或SOCKS代理。

**推荐理由：**频繁换网络者可用测试端点试热切换，先确认错误配置直连回退可接受并验卸载恢复。

**使用条件：**先用可观察测试端点核验fetch与目标客户端，确认无代理或配置错误时的直连回退可接受，再切换真实任务。

[返回表格](#column-index)

<a id="plugin-1381725238-root"></a>

## [dsh-wsl-media](../../plugins/173787247--dsh-wsl-media/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media)

**主要用途：**在DSH中调用本地媒体与文档CLI，进行探测、转写、OCR及格式处理。

**推荐理由：**媒体资料处理者可设小范围目录逐工具试样本，核原件和输出，禁止复用同名路径避免ffmpeg -y覆盖。

**使用条件：**先配置小范围目录，逐项确认依赖；把OCR和ASR文本与原件抽查，避免复用同名输出。

[返回表格](#column-index)

<a id="plugin-1381832935-root"></a>

## [dsh-wsl-struct](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct)

**主要用途：**在 DSH 中调用 jq、yq 和只读 SQLite 查询本地结构化数据。

**推荐理由：**固定配置查询者可在副本限根试结构化工具，先核yq方言与表达式权限，复杂SQL结果人工复核。

**使用条件：**适合有固定配置查询的开发者先在副本中试用；显式缩小 allowRoots，核实 yq 版本及表达式权限，不把它当不可信查询隔离器。

[返回表格](#column-index)

<a id="plugin-1381843937-root"></a>

## [dsh-wsl-terraform](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-terraform)

**主要用途：**在 DSH 中查看 Terraform/OpenTofu 校验、计划摘要与状态资源列表。

**推荐理由：**已有Terraform审批者可限沙盒试计划摘要，显式根目录和凭据，部署前必须回看完整计划。

**使用条件：**适合已有 Terraform 审批流程的人先审阅沙盒计划；显式配置 allowRoots 和凭据，任何摘要都要回看完整计划后决定部署。

[返回表格](#column-index)

<a id="plugin-1386463441-root"></a>

## [dsh-cache-bricks](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md)



**主要用途：**用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。

**推荐理由：**适合本地单用户维护者试用缓存诊断；先核对usage口径、隐私访问和记录淘汰，不把颜色当优化效果。

**使用条件：**建议本地单用户维护者用不敏感会话试用，先核对attempt、usage和访问边界；主链延迟、字段错位、UI干扰或权限不清时停止，回到宿主日志。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1399279897-root"></a>

## [@y9931666/dsh-plugin-crossfire](../../plugins/9931666--dsh-plugin-crossfire/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire) [![npm 30d 669](https://img.shields.io/static/v1?label=npm+30d&message=669&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire)

**主要用途：**把待核成果按维度交给只读工具受限的红队子agent，收集候选缺陷，由读者逐条认定或驳回，并保存定稿与旧缺陷复审历史。

**推荐理由：**逐条人工裁决/理由和只读专家接线实用；仅可信用户、真实connection认证和单进程状态条件下小规模试用，先核参数授权/坏行与实际成本。

**使用条件：**有条件试用，须真实connection认证栅栏、可信同信任用户、单进程状态与人工核证据；先小规模匿名成果。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1400109121-root"></a>

## [dock-spreadsheet](../../plugins/aks1st--dock-spreadsheet/INSIGHT.md)

[![npm 30d 413](https://img.shields.io/static/v1?label=npm+30d&message=413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-spreadsheet) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-spreadsheet)

**主要用途：**在DSH dock-files中只读预览XLSX、XLS、ODS、CSV与TSV，支持切表、搜索筛选、坐标检查和显式链接导航。

**推荐理由：**同屏五格式与坐标/文本细节实用，可信私有Host普通文件可试；先核授权/资源和缓存/排序边界。

**使用条件：**可信私有Host普通文件可条件试用，先核三方加载/路径权限、缓存与字符串排序；公开Host/恶意大书/验算不宜直接依赖。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1421741516-root"></a>

## [dsh-ark-coding-provider](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Akiyuki1130/dsh-ark-coding-provider)

**主要用途：**为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。

**推荐理由：**适合已有Ark订阅的本机DSH先单账户小样；专用流式/失败轮换和最小CLI环境明确，多账号/额度需核身份/HOME/取消与平台口径。

**使用条件：**有条件试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1422380986-root"></a>

## [dsh-file-handover](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md)



**主要用途：**将显式指定的本地文件填入Windows原生文件对话框，逐项回读后再确认。

**推荐理由：**仅Windows单一明确文件框可试用；dryRun核PID标题并收敛唯一窗口，应用回读文件名大小，多窗口当前不能保证目标归属。

**使用条件：**适合单一明确文件对话框的Windows任务先试用。先dryRun检查窗口PID与标题，再填文件，最后在接收应用核对文件名和大小；多窗口并存先收敛到唯一目标。

[返回表格](#column-index)

<a id="plugin-1422396858-root"></a>

## [dsh-douyin-publish](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md)



**主要用途：**把本地视频上传到抖音或B站投稿页并填写内容，默认私密且停在发布前。

**推荐理由：**固定抖音/B站工作流者可从dryRun再非公开draft试用；逐字段回读视频及可见性，发布未知先查平台勿重跑。

**使用条件：**适合固定抖音/B站工作流的创作者在非公开测试稿先检查。先用dryRun，再用draft逐字段核对视频与可见性；遇到发布结果不明时先去平台查状态，不重复发布。

[返回表格](#column-index)

<a id="plugin-1423215529-root"></a>

## [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)



**主要用途：**为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。

**推荐理由：**适合多版本工具链维护者在可信环境试用只读诊断；关闭默认探测，并用真实shell查询核对关键结论。

**使用条件：**建议在可信工具链环境限定试用只读报告，关闭默认probe，关键决策用真实shell交叉核对；一旦builtin、别名或cwd不一致，停止据此修改环境。详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1425044910-root"></a>

## [dsh-vercel](../../plugins/adenxie--dsh-vercel/INSIGHT.md)

[![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adenxie/dsh-vercel)

**主要用途：**通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。

**推荐理由：**匹配宿主可信单profile可先只读工具试用，核账户/团队再写；多账户并发和强撤销需先补凭据版本契约。

**使用条件：**可信单profile从只读工具试用，写操作核官方结果。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1334023305-root"></a>

## [dsh-usage-dashboard-plus](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus) [![npm 30d 1,049](https://img.shields.io/static/v1?label=npm+30d&message=1%2C049&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-dashboard-plus) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-usage-dashboard-plus)

**主要用途：**在 DSH 侧栏和设置页展示账户余额、调用用量与分模型费用统计。

**推荐理由：**多模型用户可试用统一用量观察；先对账一天主调用与视觉日志并补未知模型价，不能当财务账本。

**使用条件：**适合用量观察；先用自己账单核对一天数据，并为未知模型补价，再据此设预算。

[返回表格](#column-index)

<a id="plugin-1334850903-root"></a>

## [dsh-composer-expand](../../plugins/13071301808--dsh-composer-expand/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand) [![npm 30d 969](https://img.shields.io/static/v1?label=npm+30d&message=969&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-composer-expand) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-composer-expand)

**主要用途：**在DSH会话输入工具行增加展开按钮，切换70vh长稿视图、记忆浏览器状态，并在展开时调整普通Enter行为。

**推荐理由：**功能窄且无额外外部数据面，长稿单composer场景可控试用；先核IME/菜单/撤销和收起，广兼容表不等于操作验证。

**使用条件：**有条件试用，长草稿/单composer用户先核Enter、IME、菜单与收起行为；不作为草稿备份。详见Q06(#research-q06)。

[返回表格](#column-index)

## 更新时间

2026-10-22
