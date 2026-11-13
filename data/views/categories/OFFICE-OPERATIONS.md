# 办公与运营

[全部分类](INDEX.md) · [返回首页](../../../README.md)

工作记录、日程、团队用量与日常运营。

<a id="category-index"></a>

**同类比较**

> 比较表与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@awiki/dsh-plugin](#plugin-1334428397-root) | 将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 | 已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 |
| [@zzerx/dsh-plugin-daily-log](#plugin-1363429979-plugin-daily-log) | 汇总Git和本地Agent活动，按需下钻并由会话模型按模板撰写工作报告。 | 先观察，匿名样本验证日期/partial/写入和启用恢复后再评真实数据范围。 |
| [AX Feishu Bridge](#plugin-1249325080-root) | 把飞书或 Lark 消息和回复卡片桥接到本机 DeepSeek Harness 或 Pi。 | [Q03](../../plugins/ax1202--ax-feishu-bridge/INSIGHT.md#research-q03) 先核隔离 app 的身份和 Host 工具，无法证实时保留 Web 工作流。 |
| [BrowserSkill](#plugin-1276665883-root) | 把可调用 bsk 的 Agent 接入 Chrome 或 Edge 的任务窗口，支持网页观察、交互和人工协作。 | [Q05](../../plugins/tencent--browserskill/INSIGHT.md#research-q05) 用独立 home 和测试 profile 验证配对后再读取只读页面，给测试页加独有标记以识别错窗。 |
| [BrowserSkill for DeepSeek Harness](#plugin-1276665883-packages-dsh-plugin-browserskill) | 在 DeepSeek Harness 中使用 bsk 工具浏览网页、操作页面并查看截图和会话状态。 | [Q05](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q05) 用单独测试 profile 和只读页面验收，明确指定浏览器与会话标识。 |
| [chicheng-stats](#plugin-1335725068-root) | DSH Web 全局用量统计、历史会话回填和可配置侧栏面板，附 DeepSeek 平台余额提示。 | 先禁用平台 token 导入，仅测本地统计并对账；再评估同源 API 和浏览器凭据边界；详见[Q03](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q03)。 |
| [DeepSeek Harness GenUI](#plugin-1334554248-root) | 以可保存任务状态和受控桥接的生成应用承接多轮任务 | [Q04](../../plugins/pengyue-polaron--deepseek-harness-genui/INSIGHT.md#research-q04) 先测无外部权限表单，再测撤权与回退。 |
| [DeepSeek Harness Intelligent UI](#plugin-1412721907-root) | 在 DSH 会话内生成可交互组件、更新视图和运行隔离小部件。 | 先用固定非敏感小表核对实际筛选和一次补丁，结果不符则恢复原表，见 [Q04](../../plugins/dreamfarer-space--deepseek-harness-intelligent-ui/INSIGHT.md#research-q04)。 |
| [DSH Ego Browser](#plugin-1326394141-root) | 为 DSH 提供浏览器操作、会话空间和实时观察入口。 | [Q04](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q04) 从隔离只读操作开始，外部状态不明时人工核查。 |
| [DSH Email](#plugin-1333512933-root) | 在 DSH 中浏览、搜索邮件并编辑回复草稿，支持确认发送与可选邮件任务。 | 试用只限虚构邮件的草稿预览与禁止外发的替身，关闭定时与邮件任务。 |
| [DSH Files](#plugin-1333699356-root) | 在 DSH 内查找和引用已上传附件，通过宿主文件系统抽取常见办公文档的文字。 | [Q04](../../plugins/taxueseek--dsh-files/INSIGHT.md#research-q04) 在单用户测试 profile 用公开文字 PDF 验证检索、引用和按页抽取。 |
| [DSH fnOS Integration](#plugin-1374007757-plugins-dsh-fnos-plugin) | 把NAS授权目录、文件打开和主题接入fnOS应用载体 | [Q04](../../plugins/fnosp--fnos-dsh--plugins-dsh-fnos-plugin/INSIGHT.md#research-q04) 只在单用户隔离测试目录观察，先审外层网关和直达宿主路径；依赖多用户隔离的部署应继续使用fnOS原生文件管理器，直至逐入口证明用户权限。 |
| [DSH Generative UI](#plugin-1340581082-root) | 让回复中的 TSX 成为内联交互界面或持续画布 | [Q04](../../plugins/mindlab-research--dsh-generative-ui/INSIGHT.md#research-q04) 以隔离 Web profile 装固定版本，首先试不导入外部依赖的纯 React 计算卡。 |
| [DSH Notes Export](#plugin-1182135360-dsh-plugin) | 把整理后的对话导出为工作区便签，或通过演示服务渲染为图片。 | [Q04](../../plugins/zhaoolee--notes--dsh-plugin/INSIGHT.md#research-q04) 建议已有可信便签服务的用户先用非敏感短文本核实目的地、内容与结果；超时后先回查再决定是否重试。 |
| [DSH Reaudit](#plugin-1172884215-packages-dsh-reaudit) | 通过 DSH MCP 客户端连接 Reaudit 托管服务，使用其远端工具。 | [Q04](../../plugins/rosesamaras--reaudit-ai-plugin--packages-dsh-reaudit/INSIGHT.md#research-q04) 建议先核服务政策与权限，再在隔离账户尝试非敏感只读请求；结果或目标不明时停止并人工回查。 |
| [dsh-automation](#plugin-1333150357-root) | 按日程创建新的 DSH 根 Agent 执行完整任务，保存权限快照与运行历史。 | [Q03](../../plugins/titanwings--dsh-automation/INSIGHT.md#research-q03) 单个只读周期任务先验收。 |
| [dsh-better-sidebar-plugin-office](#plugin-1331821326-root) | 为 better-sidebar 注册 docx、xlsx 和 pptx 侧栏预览，失败时提供原件下载。 | 先确认better-sidebar=0.6.0，用非敏感代表文件逐格式比对关键内容。 |
| [dsh-feishu](#plugin-1418842530-root) | 以应用或用户身份把飞书主要办公 API 接入 DSH。 | 建议观察。 |
| [dsh-feishu-bot](#plugin-1346023250-root) | 通过飞书WebSocket操作DSH项目与会话，支持扫码绑定、聊天审批和完成通知。 | 观察，受信owner/允许群与最低权限Profile，审批/广播分别明确，未知投递不重放任务。 |
| [dsh-file-handover](#plugin-1422380986-root) | 将本地文件路径填入Windows原生文件框，按Win32/UIA/剪贴板回读并可确认，返回候选与动作记录。 | 先观察，单可见框probe+click=false人工核对。 |
| [dsh-im-connect](#plugin-1335758624-root) | 把多账号 IM 聊天接入 DSH，支持会话绑定、审批和断线后交付。 | [Q03](../../plugins/michengai--dsh-im-connect/INSIGHT.md#research-q03) 从隔离私聊开始验收，随后扩展至群聊。 |
| [dsh-invoice-tools](#plugin-1344714819-root) | 本地抽取电子发票PDF的XML/文本字段并作算术核对，汇总类别与重复提示，生成Markdown或xlsx.b64。 | 先观察；无敏感样票对照可继续研究，正式草稿也需显式files与原票复核，不把high或勾稽通过当放行。 |
| [dsh-lark-link](#plugin-1333470417-root) | DSH原生飞书/Lark桥，组合会话Agent、卡片、入站重放/出站队列及媒体回传。 | [Q06](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md#research-q06)观察；所有入口/实际只读/回放副作用未核前不接真实群或生产目录，未知回官方Web和人工对账。 |
| [dsh-mac-companion](#plugin-1384810483-root) | 通过 Mac Companion 在 DSH 发通知、运行 Shortcuts 和读写剪贴板。 | [Q03](../../plugins/173787247--dsh-mac-companion/INSIGHT.md#research-q03) 仅用隔离 Mac 和无敏感通知开始，执行状态不明时回本机。 |
| [dsh-md-annotator](#plugin-1335286261-root) | 在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。 | 建议有备份文稿的小范围试用，先验块引用/归属和冲突，结束前保存源码导出批注；复杂语法或导出不可靠时回外部编辑器。 |
| [dsh-msg-hub](#plugin-1335387524-root) | 把微信、QQ、飞书消息接入 DSH 会话，并提供主动推送与远程审批/状态功能。 | 远程批准应先停用或仅在严格可信单 peer 环境隔离评估，修复来源绑定后再用真实渠道；详见[Q02](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q02)、[Q03](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q03)。 |
| [dsh-notify-relay](#plugin-1385913707-root) | 把 DSH 生命周期事件经过去重、免打扰、摘要和重试规则转发到多种通知服务或 webhook。 | 先观察，在隔离接收器验证每类事件和部分通道失败，确认哪些内容会外发。 |
| [dsh-office-tools](#plugin-1334828310-root) | 为 DSH 会话工作区提供 Word、Excel 与 PowerPoint 文件创建、读取和部分更新工具。 | 在隔离 profile 试用新建简报、预算表和轻量 PPT，用收件环境打开核对并保留源文件。 |
| [dsh-plugin-balance](#plugin-1340280087-root) | DSH Web 额度悬浮窗，整合多供应商查询、会话 token 统计与费用估算。 | 先禁自定义任意 URL，以假 key 试验并同官方账单对账；只把费用视为估算。 |
| [dsh-plugin-education](#plugin-1336663611-root) | 用edu_kit提供教案与题目骨架、测验结构检查、格式转换和成绩/计划统计，不替代教学内容审阅。 | 教师审阅下试用模板/转换，数值与答案复核后使用。 |
| [dsh-plugin-mission-control](#plugin-1337780031-integrations-deepseek-harness-dsh-plugin-mission-control) | 将 DSH 会话、消息与工具活动镜像到 JARVIS 看板，并把结束回合送入人工审查。 | 已有可信自托管JARVIS看板的用户可在无敏感信息的会话先试。 |
| [dsh-plugin-nlbi](#plugin-1343622602-root) | 把MySQL连接、Schema驱动Text2SQL、查询结果与BI报表接入DSH对话和侧栏。 | 先观察，优先修/核多入口策略与确认，DB原生权限兜底后再评估脱敏测试库。 |
| [dsh-team-cost](#plugin-1364961230-root) | 从 DSH 会话事件记团队 token/成本，提供成员预算、告警和报表。 | 隔离 profile 先固定成员路径、模型价和真实账单对照，测试崩溃/事件 replay/相邻路径，再考虑 alert；不要以此版结算或启用强制拦截。 |
| [dsh-univer-office](#plugin-1335241492-root) | 在 DeepSeek Harness 中创建、编辑和审阅电子表格、文档与演示文稿，并导出受支持的办公文件。 | [Q03](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q03) 用合成小表验证草稿、批准和 Excel 重开，保留原件。 |
| [dsh-whale-catch](#plugin-1425215508-root) | 在 DSH 侧栏收集会话产物，提供预览、差异、交付台账、体检、归档和还原。 | 先用含旧mtime复制件的固定目录核对漏收，仅复制归档；还原放在可丢弃目录并逐项确认，异常退回人工打包。 |
| [dsh-windows-mcp](#plugin-1413849053-root) | 把 Windows-MCP 接到 DSH 内置 MCP 桥接，并提供桌面开关、诊断和依赖管理。 | [Q05](../../plugins/hellohub1212--dsh-windows-mcp/INSIGHT.md#research-q05) 保持观察，先在无业务数据的 Windows VM 验收鉴权、tools.guard、双 Agent 及关闭后派发。 |
| [dsh-wsl-im](#plugin-1370460115-root) | 把多个即时通信平台的消息、附件和回复桥接到 WSL 中的 DSH Agent。 | [Q03](../../plugins/173787247--dsh-wsl-im/INSIGHT.md#research-q03) 先隔离验证本机 mock；真实 bot 仅在 [Q02](../../plugins/173787247--dsh-wsl-im/INSIGHT.md#research-q02) 的白名单与实际最小权限均可确认后再评估。 |
| [dsh-wsl-mail](#plugin-1381860693-root) | 在 DSH 中查看邮件信封与未读概况，并通过 notmuch 搜索。 | [Q03](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md#research-q03) 只用合成信封验证，明确 notmuch 未读计数和 Himalaya 样本的区别。 |
| [EduWork DSH Mail](#plugin-1369398336-packages-dsh-mail) | 为 DSH 提供邮件读取、附件保存与受控 SMTP 发送工具。 | [Q04](../../plugins/ecnu--eduwork--packages-dsh-mail/INSIGHT.md#research-q04) 隔离账户先验证权限并由用户核对；外发需明确授权，异常先查询。 |
| [EduWork OIDC](#plugin-1369398336-packages-dsh-oidc) | 为 DSH 提供机构身份登录与授权模型接入。 | 先用隔离身份测试登录、模型类型及撤销失败，状态不明由管理员核查。 |
| [InvoiceFlowAI DSH 发票插件](#plugin-1170373459-dsh-invoice-downloader) | 在 DSH 边栏收集邮箱发票、识别字段、分类归档并导出 Excel | 仅在 Windows x64 或 macOS Apple Silicon 上，用测试邮箱和有真值的混合批次试用；先验收原件、关键字段和可用导出，再比较人工总时间。 |
| [InvoiceFlowAI 发票整理工具](#plugin-1170373459-root) | 从邮箱收集电子发票和下载链接，识别分类并生成 Excel 汇总 | 用测试邮箱与混合票据真值批次试用，按原件、关键字段、邮箱范围和可用导出验收；不合格先人工补齐，再决定是否继续。 |
| [LazyMind](#plugin-823606893-root) | 提供知识、技能和可审核工作流的独立运行环境，并支持连接 DSH。 | 先用测试账号连接隔离 profile，用非敏感素材做一次带人工检查点的短演示稿。 |
| [LeLogin for DeepSeek Harness](#plugin-1226490932-root) | 在 DSH 注册 LeLogin Skill，指导凭据引用、注入和已认证应用的本地使用。 | 先观察注册和假账号发现；对实际凭据操作保留手工退路，直到验证运行时与审批。 |
| [NocoBase](#plugin-306829688-root) | 用于构建、运行和持续演进业务系统的开源应用平台，提供权限、工作流及 Agent 集成。 | [Q04](../../plugins/nocobase--nocobase/INSIGHT.md#research-q04) 先隔离 runner 和样本仓库，核查实际权限、模型和受控网络。 |
| [Plugin Session Export](#plugin-1333152408-packages-plugins-plugin-session-export) | 把 DSH live 会话投影为可读 Markdown 或自包含 HTML，并可隐藏工具参数结果 | [Q04](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-session-export/INSIGHT.md#research-q04) 建议个人去敏单会话有限试用，写新目录并对JSONL核查；mini必须人工审阅后才分享。 |
| [QQBot 增强版](#plugin-1357268674-root) | 为 DeepSeek Harness 接入 QQ 群聊和单聊，支持管理会话、切换模型及发送交付文件。 | 已有 QQ 应用的 DSH 用户可以用专用单聊做一次低风险试用。 |
| [Reactive Resume](#plugin-249995750-root) | 独立简历/求职文档应用，以认证MCP/API编辑用户文档、保留版本并生成PDF导出。 | [Q05](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q05)独立账户虚构数据/只读起步，版本+差异核后小写，PDF逐页验；不明退Web和本机已验文档。 |
| [Recruiting Copilot](#plugin-1294614772-root) | 将招聘 Skill、平台浏览器观察和本地招聘看板接入 DSH。 | [Q03](../../plugins/viy1204--recruiting-copilot/INSIGHT.md#research-q03) 先用独立工作区。 |
| [Tencent Meeting CLI](#plugin-1203725733-root) | 基于 OAuth2 的腾讯会议命令行工具，支持会议、录制、纪要、报告及事件操作。 | [Q04](../../plugins/tencentcloud--tencentmeeting-cli/INSIGHT.md#research-q04) 小范围只读核身份/分页/原文，写和上传须具体授权；状态不明停并回GUI。 |
| [WeLink DSH 插件](#plugin-1184366339-plugins-dsh-welink) | 在 DSH 中按需查看授权 WeLink 会话的日期，并在获准时读取或搜索有限消息。 | 先用虚构聊天与假后端，区分日期与正文许可；无法验证后端拒绝或结果去向时保留手工复制。 |
| [公文全流程处理专家](#plugin-1306637593-root) | 在 DSH 中调用公文检查、修复与修订工具 | [Q04](../../plugins/linhut--gongwen-skill/INSIGHT.md#research-q04) 用虚构文档验证原件、取消与渲染。 |
| [新诉讼可视化](#plugin-1294942686-root) | 把案件材料整理成有出处、可编辑和可打印的图表 | [Q04](../../plugins/miaoqichuan--new-litigation-visualization/INSIGHT.md#research-q04) 先以虚构材料试用时间轴，限制目标格式并保留复核。 |
| [赤诚推送 chicheng-push](#plugin-1335382133-root) | 统一管理多种推送渠道，通过设置页、pushNotifier服务和HTTP API发送任务通知。 | 观察，继续从本机认证、最小凭证/目标与脱敏内容及明确受理证据入手。 |

<a id="plugin-1334428397-root"></a>

## [@awiki/dsh-plugin](../../plugins/agentconnect--dsh-awiki/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@awiki/dsh-plugin)

> **用途**：已经使用 AWiki 身份与通信、希望在 DSH 中处理消息的用户可用它把 AWiki 身份、私信、群聊、邮件、摘要与可选入站 Agent 监听接到 DSH 工具和 Web 界面；合格结果是操作绑定正确身份和租户，发送对象与内容经授权，收发结果和未知状态可追踪。详见[Q01](../../plugins/agentconnect--dsh-awiki/INSIGHT.md#research-q01)。

> **亮点**：整合独立身份和 IM Core、Host 公共 DTO、通信工具与界面，并增加会话/租户范围控制。它相对“在独立 AWiki 客户端收发消息，再人工复制给模型并把生成结果复制回去”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](../../plugins/agentconnect--dsh-awiki/INSIGHT.md#research-q03)。

> **思考**：可选入站监听会把外部消息触发 Agent；效果发生后再失败可能导致重放，且底层密钥、网络和租户服务不由本插件证明。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](../../plugins/agentconnect--dsh-awiki/INSIGHT.md#research-q04)。

> **建议**：未来可探索：可将入站消息ID、身份、租户和每个副作用阶段绑定到执行日志，对未知效果禁止自动重放。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](../../plugins/agentconnect--dsh-awiki/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/agentconnect--dsh-awiki/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1363429979-plugin-daily-log"></a>

## [@zzerx/dsh-plugin-daily-log](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,782](https://img.shields.io/static/v1?label=npm+30d&message=1%2C782&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log)

> **用途**：定期整合多项目/多日志的个人工作汇报，以可回源、区分讨论和交付为目标。见[Q01](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md#research-q01)。

> **亮点**：把跨源活动、按需工具和可缩放浏览接到报告草稿流程，保留模型/用户各自撰写与核验责任。见[Q01](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md#research-q01)、[Q02](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md#research-q02)。

> **思考**：截断/probe/partial和日期语义不形成全链覆盖收据，确认/导出也无绑定版本前提。见[Q03](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md#research-q03)、[Q04](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md#research-q04)。

> **建议**：活动覆盖收据、事实链接和正文/导出版本确认，能否减少漏项误报及总恢复成本待验证。见[Q06](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1249325080-root"></a>

## [AX Feishu Bridge](../../plugins/ax1202--ax-feishu-bridge/INSIGHT.md)

[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AX1202/ax-feishu-bridge) [![npm 30d 556](https://img.shields.io/static/v1?label=npm+30d&message=556&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/ax-feishu-bridge) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/ax-feishu-bridge)

> **用途**：已有 DSH 或 Pi 的团队希望从飞书持续处理协作消息。

> **亮点**：[Q01](../../plugins/ax1202--ax-feishu-bridge/INSIGHT.md#research-q01) 复用宿主 Agent 和会话，同时把引用及附件带到聊天侧。

> **思考**：[Q02](../../plugins/ax1202--ax-feishu-bridge/INSIGHT.md#research-q02) 群触发只筛事件，消息 claim 与 flush 也不能保证严格一次和持久。

> **建议**：[Q03](../../plugins/ax1202--ax-feishu-bridge/INSIGHT.md#research-q03) 比较隔离飞书桥与手工交接的确认时间和误回复；不改善即退出。

[查看完整分析](../../plugins/ax1202--ax-feishu-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1276665883-root"></a>

## [BrowserSkill](../../plugins/tencent--browserskill/INSIGHT.md)

[![GitHub ★ 10,163](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C163&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/BrowserSkill)

> **用途**：已有 Chromium 账号且反复查网页资料的操作者，希望让 Agent 在指定 profile 中执行可观察的任务，并在结果不明时人工接手。[Q01](../../plugins/tencent--browserskill/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/tencent--browserskill/INSIGHT.md#research-q01) 和 [Q02](../../plugins/tencent--browserskill/INSIGHT.md#research-q02) 显示根项目把跨宿主 CLI、本机 IPC 和现有浏览器窗口接成一条可观察的操作路径，用户可在当前 profile 中核查任务。独立 DSH 插件负责把这条能力接入宿主工具层。

> **思考**：[Q03](../../plugins/tencent--browserskill/INSIGHT.md#research-q03) 本机未配对连接在默认 Warn 下仍能使用，连接状态不能单独作为设备身份证明。已配对流程能绑定设备，但业务流量和同账号进程仍有独立边界。取消仅能说明本地等待或对端控制器状态，网页动作需另行核对。

> **建议**：[Q05](../../plugins/tencent--browserskill/INSIGHT.md#research-q05) 将已有 Required 模式、已验证设备和只读页面回读纳入统一试用验收。对照默认 Warn 流程，检查能否减少误接纳，同时量化正确设备恢复时间及人工配置负担。

[查看完整分析](../../plugins/tencent--browserskill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1276665883-packages-dsh-plugin-browserskill"></a>

## [BrowserSkill for DeepSeek Harness](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md)

[![GitHub ★ 10,163](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C163&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/BrowserSkill) [![npm 30d 46,565](https://img.shields.io/static/v1?label=npm+30d&message=46%2C565&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin)

> **用途**：已有 BrowserSkill CLI、daemon 与浏览器扩展的 DSH 用户，希望在会话里执行网页检查，并在需要时查看页面状态或接手。[Q01](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q01) 和 [Q02](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q02) 显示插件将 bsk 的会话、控制上下文和操作回执接到 DSH 工具及可选 Web 观察。用户能在宿主里跟进调用，窗口与网页执行仍由 CLI、daemon 和扩展承担。

> **思考**：[Q03](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q03) 同一插件实例的默认会话按最近使用切换，侧栏的对话归属过滤没有进入普通工具的会话解析。多个对话交错时，应显式指定并回读窗口状态。中断结果也只说明插件侧尝试结束命令，页面操作可能已经发生。

> **建议**：[Q05](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q05) 用可信的 DSH 会话身份选择默认窗口，显式目标需符合登记归属或共享授权；身份缺失则转人工确认。对照现有最近会话策略，检验交错操作的错窗率，同时记录合法共享的误拒与恢复时间。

[查看完整分析](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335725068-root"></a>

## [chicheng-stats](../../plugins/534119219--chicheng-stats/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/534119219/chicheng-stats)

> **用途**：跨 Web/headless 会话查看 token 请求趋势、模型/提供方分布。

> **亮点**：把实时/历史用量与 Web 面板结合，详见[Q01](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q01)。

> **思考**：桌面 zstd 历史默认跳过、水位淘汰可重计，自动导入平台 token 经同源 API 返回给浏览器；详见[Q02](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q02)、[Q03](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q03)。

> **建议**：以稳定会话复合键和持久去重索引提升准确度，并将 token 导入限定到明确授权流程且不向浏览器返回原值；待验证，详见[Q02](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q02)、[Q03](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/534119219--chicheng-stats/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334554248-root"></a>

## [DeepSeek Harness GenUI](../../plugins/pengyue-polaron--deepseek-harness-genui/INSIGHT.md)

[![GitHub ★ 124](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=124&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pengyue-polaron/deepseek-harness-genui) [![npm 30d 2,099](https://img.shields.io/static/v1?label=npm+30d&message=2%2C099&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-genui) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-genui)

> **用途**：用户需跨轮保留多个相关选择。

> **亮点**：[Q01](../../plugins/pengyue-polaron--deepseek-harness-genui/INSIGHT.md#research-q01) 将选择和后续动作组织为可回读任务状态。

> **思考**：[Q03](../../plugins/pengyue-polaron--deepseek-harness-genui/INSIGHT.md#research-q03) 需验证跨会话隔离、撤权及回退时状态边界。

> **建议**：[Q05](../../plugins/pengyue-polaron--deepseek-harness-genui/INSIGHT.md#research-q05) 保存和回读可在减少重述时维持状态准确。

[查看完整分析](../../plugins/pengyue-polaron--deepseek-harness-genui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1412721907-root"></a>

## [DeepSeek Harness Intelligent UI](../../plugins/dreamfarer-space--deepseek-harness-intelligent-ui/INSIGHT.md)

[![GitHub ★ 38](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=38&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui) [![npm 30d 4,273](https://img.shields.io/static/v1?label=npm+30d&message=4%2C273&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-harness-intelligent-ui) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-harness-intelligent-ui)

> **用途**：适合在 DSH 反复比较结构化数据的用户，见 [Q01](../../plugins/dreamfarer-space--deepseek-harness-intelligent-ui/INSIGHT.md#research-q01)。

> **亮点**：把校验、会话内渲染和按 ID 更新接到原 DSH 对话，见 [Q01](../../plugins/dreamfarer-space--deepseek-harness-intelligent-ui/INSIGHT.md#research-q01) 与 [Q02](../../plugins/dreamfarer-space--deepseek-harness-intelligent-ui/INSIGHT.md#research-q02)。

> **思考**：通过树校验只能确认结构，需核对数据内容。小部件的资源策略和受控动作也各有边界，见 [Q03](../../plugins/dreamfarer-space--deepseek-harness-intelligent-ui/INSIGHT.md#research-q03)。

> **建议**：让用户核对版本与来源，比较能否减少误把本地筛选当作数据更新，见 [Q05](../../plugins/dreamfarer-space--deepseek-harness-intelligent-ui/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/dreamfarer-space--deepseek-harness-intelligent-ui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1326394141-root"></a>

## [DSH Ego Browser](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md)

[![GitHub ★ 361](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=361&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fisfzy/dsh-ego-browser) [![npm 30d 14,386](https://img.shields.io/static/v1?label=npm+30d&message=14%2C386&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ego-browser) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ego-browser)

> **用途**：面向需要 Agent 操作网页且愿意监督和核对外部结果的用户。

> **亮点**：[Q01](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q01) 与 [Q03](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q03) 将浏览器动作及分类重试接入 DSH；是否避免重复仍需核查，页面和浏览器不属插件原创。

> **思考**：[Q02](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q02) 空间 ID 截取可能碰撞；[Q03](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q03) 冷启动签名可触发回退，其确实无副作用未独立证明。

> **建议**：[Q05](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q05) 以完整会话随机映射和结果未知状态试验隔离及重复提交，尚未验证。

[查看完整分析](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333512933-root"></a>

## [DSH Email](../../plugins/stardustlc666--dsh-email/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/STARDUSTLC666/dsh-email) [![npm 30d 11,059](https://img.shields.io/static/v1?label=npm+30d&message=11%2C059&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-email) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-email)

> **用途**：经常处理邮件回复且已使用 DSH 的用户，可在工作台集中准备与核对草稿。

> **亮点**：把邮件检索、草稿、收件人规则与版本核对接到同一工作台，便于发前检查。[Q01](../../plugins/stardustlc666--dsh-email/INSIGHT.md#research-q01) [Q02](../../plugins/stardustlc666--dsh-email/INSIGHT.md#research-q02)

> **思考**：普通草稿与邮件任务自动回复是不同路径，未验证实际收件；未知提交应查邮箱，不能直接重发。[Q02](../../plugins/stardustlc666--dsh-email/INSIGHT.md#research-q02) [Q03](../../plugins/stardustlc666--dsh-email/INSIGHT.md#research-q03)

> **建议**：将外部提交标识和可查回执关联，比较未知时能否防止重复；不可查时维持暂停而不是自动重试。[Q04](../../plugins/stardustlc666--dsh-email/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/stardustlc666--dsh-email/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333699356-root"></a>

## [DSH Files](../../plugins/taxueseek--dsh-files/INSIGHT.md)

[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/taxueseek/dsh-files) [![npm 30d 204](https://img.shields.io/static/v1?label=npm+30d&message=204&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-files) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-files)

> **用途**：用户在新会话复用旧会话的公开 PDF，找到指定页并核对原文。

> **亮点**：[Q01](../../plugins/taxueseek--dsh-files/INSIGHT.md#research-q01) 将附件库浏览和宿主引用接进会话。[Q02](../../plugins/taxueseek--dsh-files/INSIGHT.md#research-q02) 文档内容可按页或表选择后分窗口取用。

> **思考**：[Q03](../../plugins/taxueseek--dsh-files/INSIGHT.md#research-q03) Web 与模型导出使用不同写入路径，Web 的 Host 守卫未核对用户身份，递归删除也会影响此前引用。

> **建议**：[Q04](../../plugins/taxueseek--dsh-files/INSIGHT.md#research-q04) 复用宿主已有附件或能减少找原件和重复粘贴，需按同一 PDF 记录时间、段落一致性和扫描件失败信号。

[查看完整分析](../../plugins/taxueseek--dsh-files/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1374007757-plugins-dsh-fnos-plugin"></a>

## [DSH fnOS Integration](../../plugins/fnosp--fnos-dsh--plugins-dsh-fnos-plugin/INSIGHT.md)

[![GitHub ★ 87](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=87&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FNOSP/fnos-dsh) [![npm 30d 9,447](https://img.shields.io/static/v1?label=npm+30d&message=9%2C447&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-fnos) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-fnos)

> **用途**：fnOS用户需从DSH打开授权NAS文件。

> **亮点**：[Q01](../../plugins/fnosp--fnos-dsh--plugins-dsh-fnos-plugin/INSIGHT.md#research-q01) 集中系统载体、授权目录和主题接线。

> **思考**：[Q03](../../plugins/fnosp--fnos-dsh--plugins-dsh-fnos-plugin/INSIGHT.md#research-q03) 缺uid时不执行用户ACL，ACL接口失败时可退为应用目录授权。来源门禁不能证明用户身份，当前源码不支持共享NAS用户隔离结论。

> **建议**：[Q05](../../plugins/fnosp--fnos-dsh--plugins-dsh-fnos-plugin/INSIGHT.md#research-q05) 可减少定位路径步骤而保持拒绝可见。

[查看完整分析](../../plugins/fnosp--fnos-dsh--plugins-dsh-fnos-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340581082-root"></a>

## [DSH Generative UI](../../plugins/mindlab-research--dsh-generative-ui/INSIGHT.md)

[![GitHub ★ 137](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=137&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MindLab-Research/dsh-generative-ui) [![npm 30d 1,951](https://img.shields.io/static/v1?label=npm+30d&message=1%2C951&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-generative-ui) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-generative-ui)

> **用途**：用户需多次调整计算参数。

> **亮点**：[Q01](../../plugins/mindlab-research--dsh-generative-ui/INSIGHT.md#research-q01) 提供可直接操作和跨轮保留的界面。

> **思考**：[Q03](../../plugins/mindlab-research--dsh-generative-ui/INSIGHT.md#research-q03) 命令桥默认开启，但还要 webServer、shell 与 sandboxPolicy，关闭 allowExec 或缺服务时路由不挂载。已挂载时执行采用会话沙箱且没有逐命令审批。文件桥依赖 fs 与 sandboxPolicy，拒绝不在活动工作区清单的 cwd，拒绝码与文件不存在要区分。模型桥依赖 llm 与 agentDefaultModel，拒绝不在活动清单的 cwd，并通过宿主选中模型处理卡片 prompt。浏览器依赖加载、文件访问、命令执行和模型调用应分别检查。

> **建议**：[Q05](../../plugins/mindlab-research--dsh-generative-ui/INSIGHT.md#research-q05) 交互面板可减少重新询问参数的轮数。

[查看完整分析](../../plugins/mindlab-research--dsh-generative-ui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1182135360-dsh-plugin"></a>

## [DSH Notes Export](../../plugins/zhaoolee--notes--dsh-plugin/INSIGHT.md)

[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhaoolee/notes) [![npm 30d 770](https://img.shields.io/static/v1?label=npm+30d&message=770&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zhaoolee/dsh-notes) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zhaoolee/dsh-notes)

> **用途**：需要将对话整理成可编辑便签或分享图片的 DSH 用户，可以调用统一导出工具。

> **亮点**：[Q01](../../plugins/zhaoolee--notes--dsh-plugin/INSIGHT.md#research-q01) 和 [Q02](../../plugins/zhaoolee--notes--dsh-plugin/INSIGHT.md#research-q02) 显示统一工具连接两种导出，[Q03](../../plugins/zhaoolee--notes--dsh-plugin/INSIGHT.md#research-q03) 的条件更新保留未修改字段；不证明内容保真或节时。

> **思考**：[Q02](../../plugins/zhaoolee--notes--dsh-plugin/INSIGHT.md#research-q02) 的缺省路径会发送 Markdown 到演示服务且只生成图片；[Q03](../../plugins/zhaoolee--notes--dsh-plugin/INSIGHT.md#research-q03) 的 409 重试不能解决成功后响应丢失导致的新建重复。

> **建议**：[Q05](../../plugins/zhaoolee--notes--dsh-plugin/INSIGHT.md#research-q05) 提出稳定操作 ID 与结果未知时回读确认的未验证方案；服务不支持查询或收益不抵成本时否定。

[查看完整分析](../../plugins/zhaoolee--notes--dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1172884215-packages-dsh-reaudit"></a>

## [DSH Reaudit](../../plugins/rosesamaras--reaudit-ai-plugin--packages-dsh-reaudit/INSIGHT.md)



> **用途**：已有 Reaudit 账户且需查看品牌搜索可见性或站点数据的团队，可评估在 DSH 中使用远端工具。

> **亮点**：[Q01](../../plugins/rosesamaras--reaudit-ai-plugin--packages-dsh-reaudit/INSIGHT.md#research-q01) 与 [Q02](../../plugins/rosesamaras--reaudit-ai-plugin--packages-dsh-reaudit/INSIGHT.md#research-q02) 显示组件将端点、命名空间、凭据与超时封装为宿主配置；远端审查能力本身不归因于此子包。

> **思考**：[Q03](../../plugins/rosesamaras--reaudit-ai-plugin--packages-dsh-reaudit/INSIGHT.md#research-q03) 的远端实现、工具权限和数据处理不在固定子包中；[Q04](../../plugins/rosesamaras--reaudit-ai-plugin--packages-dsh-reaudit/INSIGHT.md#research-q04) 的潜在写入或发布必须先核账户与服务契约。

> **建议**：[Q05](../../plugins/rosesamaras--reaudit-ai-plugin--packages-dsh-reaudit/INSIGHT.md#research-q05) 提出逐调用权限和目标预览及结果回查的未验证设想；元数据不可靠或负担大于收益时否定。

[查看完整分析](../../plugins/rosesamaras--reaudit-ai-plugin--packages-dsh-reaudit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333150357-root"></a>

## [dsh-automation](../../plugins/titanwings--dsh-automation/INSIGHT.md)

[![GitHub ★ 103](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=103&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/titanwings/dsh-automation)

> **用途**：用户需定期生成代码检查或工作区报告。

> **亮点**：[Q01](../../plugins/titanwings--dsh-automation/INSIGHT.md#research-q01) 把任务和权限完整保存后独立派发。

> **思考**：[Q02](../../plugins/titanwings--dsh-automation/INSIGHT.md#research-q02) 中断标失败不能说明外部效果不存在。

> **建议**：[Q03](../../plugins/titanwings--dsh-automation/INSIGHT.md#research-q03) 对照人工重复任务的漏跑与报告质量。

[查看完整分析](../../plugins/titanwings--dsh-automation/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331821326-root"></a>

## [dsh-better-sidebar-plugin-office](../../plugins/huanlinoto--dsh-plugin-better-sidebar-plugin-office/INSIGHT.md)

[![GitHub ★ 63](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=63&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HuanLinOTO/dsh-plugin-better-sidebar-plugin-office) [![npm 30d 3,010](https://img.shields.io/static/v1?label=npm+30d&message=3%2C010&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huanlin/dsh-plugin-better-sidebar-plugin-office) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huanlin/dsh-plugin-better-sidebar-plugin-office)

> **用途**：供已用better-sidebar的DSH Web用户在会话内查阅Office文件，需对关键数据与版式回原件核对，不作为完整编辑保存或精确核算工具。

> **亮点**：[Q01](../../plugins/huanlinoto--dsh-plugin-better-sidebar-plugin-office/INSIGHT.md#research-q01)、[Q02](../../plugins/huanlinoto--dsh-plugin-better-sidebar-plugin-office/INSIGHT.md#research-q02)支持通过稳定viewer描述符复用侧栏路由与设置，将三种Office预览独立分发。收益是依赖边界与查阅流程便利，不证明保真和性能节省。

> **思考**：[Q03](../../plugins/huanlinoto--dsh-plugin-better-sidebar-plugin-office/INSIGHT.md#research-q03)最影响价值的限制是渲染ready不代表内容完整，xlsx不保留样式、条件格式和图表，公式交给另一引擎重算。动态import仍在同bundle，客户端参数不证明Host文件隔离。

> **建议**：[Q04](../../plugins/huanlinoto--dsh-plugin-better-sidebar-plugin-office/INSIGHT.md#research-q04)提出未验证的文件特征级保真提示，按可靠解析识别不保留内容并引导原件核对。对照误判和查阅耗时，若不降低错误或误报过多则放弃，不是当前能力。

[查看完整分析](../../plugins/huanlinoto--dsh-plugin-better-sidebar-plugin-office/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1418842530-root"></a>

## [dsh-feishu](../../plugins/2048lr--dsh-feishu/INSIGHT.md)

[![npm 30d 71](https://img.shields.io/static/v1?label=npm+30d&message=71&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feishu) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feishu)

> **用途**：面向查询/更新飞书消息、文档、云盘、表格、多维表格和知识库的用户。输入是应用凭据或用户 OAuth、资源和动作；合格结果是预期身份访问正确租户，写可追踪且不泄露令牌。替代是 UI、SDK 或脚本。

> **亮点**：提供 DSH 原生身份、授权 UI、十领域工具和两代 Bitable 兼容；相对通用 MCP，token 留在 Host。飞书平台能力非插件贡献。 参见[Q03](../../plugins/2048lr--dsh-feishu/INSIGHT.md#research-q03)。

> **思考**：宽 scopes 和身份差异会越权/空结果；两代 API、分页、限流和 token 类型分叉。消息、文档、表格和上传都有协作可见副作用。 参见[Q04](../../plugins/2048lr--dsh-feishu/INSIGHT.md#research-q04)。

> **建议**：任务前生成身份、租户、scope、目标、预计 API 次数和写 diff；高风险写预览并幂等提交。若错身份/重复写不降则否定。 参见[Q08](../../plugins/2048lr--dsh-feishu/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/2048lr--dsh-feishu/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1346023250-root"></a>

## [dsh-feishu-bot](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/452926826/dsh-feishu-bot) [![npm 30d 884](https://img.shields.io/static/v1?label=npm+30d&message=884&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feishu-bot) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feishu-bot)

> **用途**：从飞书远程操作本机DSH，需受信聊天及最低权限Profile。详见[Q01](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md#research-q01)。

> **亮点**：把扫码创建应用、WebSocket、项目/会话选择和一次审批接到DSH，省手接远程入口；交付仍为原Agent文本。详见[Q01](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md#research-q01)。

> **思考**：授权与审批按chat共享、空ACL放行，晚批准不绑定请求；内存去重、广播与失败写队列不能保证任务/收件人一致。详见[Q04](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md#research-q04)。

> **建议**：持久远程任务身份与callID/nonce/TTL审批、逐收件人投递收据，未知结果不重放，按同群错批/崩溃反例证伪。详见[Q07](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422380986-root"></a>

## [dsh-file-handover](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md)

[![npm 30d 714](https://img.shields.io/static/v1?label=npm+30d&message=714&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-file-handover) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-file-handover)

> **用途**：浏览器上传/应用打开文件需要跨到Windows原生文件框。详见[Q01](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q01)。

> **亮点**：把原生文件选择框环节接进模型工具，给回读与候选记录。详见[Q01](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q01)。

> **思考**：默认首结构匹配无PID/HWND绑定，路径回读仅子串兜底，确认消息不等应用接收且取消未传播。详见[Q03](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q03)、[Q04](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q04)。

> **建议**：研究目标租约、精确路径集合与应用回执，拒多候选并限制全局输入，比较误投/重复确认。当前未验证。详见[Q05](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335758624-root"></a>

## [dsh-im-connect](../../plugins/michengai--dsh-im-connect/INSIGHT.md)

[![GitHub ★ 122](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=122&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-im-connect) [![npm 30d 61,624](https://img.shields.io/static/v1?label=npm+30d&message=61%2C624&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-im-connect) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-im-connect)

> **用途**：团队离开 DSH 网页后仍希望在一个聊天里提交和跟进任务。

> **亮点**：[Q01](../../plugins/michengai--dsh-im-connect/INSIGHT.md#research-q01) 将宿主会话映射到已用聊天并保留历史。

> **思考**：[Q02](../../plugins/michengai--dsh-im-connect/INSIGHT.md#research-q02) 未知送达有独立状态，平台 ACK 和身份隔离待验。

> **建议**：[Q03](../../plugins/michengai--dsh-im-connect/INSIGHT.md#research-q03) 比较单渠道接入与网页流程的跟进时间和重复交付。

[查看完整分析](../../plugins/michengai--dsh-im-connect/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344714819-root"></a>

## [dsh-invoice-tools](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-invoice-tools) [![npm 30d 419](https://img.shields.io/static/v1?label=npm+30d&message=419&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-invoice-tools) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-invoice-tools)

> **用途**：电子票据用户希望辅助抄录和报销草稿整理，真实票据与资格仍需独立核对。详见[Q01](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md#research-q01)。

> **亮点**：把本地票据字段抽取、缺失/算术提示与报销草稿输出接入DSH工具，减少人工搬运。详见[Q01](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md#research-q01)。

> **思考**：旧缓存无TTL/版本失效，低置信及重复均入合计；XML高置信非验真，解压无显式输出预算。详见[Q03](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md#research-q03)。

> **建议**：可研究源hash/规则版本批次清单与待审核集合，确认条目才结算，并在受限worker限解压预算。当前未验证。详见[Q06](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333470417-root"></a>

## [dsh-lark-link](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md)

[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/amlyczz/dsh-lark-link) [![npm 30d 3,293](https://img.shields.io/static/v1?label=npm+30d&message=3%2C293&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lark-link) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lark-link)

> **用途**：dsh-lark-link0.6.2是MIT的DSH原生飞书/Lark双向桥，Node>=24、Lark SDK^1.73及大量Host服务peer为*，开发依赖0.1.2-rc.1不等当前Host兼容已验。面对已有私人DSH且需要手机派低风险任务/看结果的人，相比原生Web/终端和普通飞书机器人，新增是通道会话/卡片/重投组合；真实Agent模型/工具执行属于外部Host，卡片DONE和聊天回复不证明任务正确。

> **亮点**：[Q02](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md#research-q02)真实远程Host接线；[Q03](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md#research-q03)有界replay/salvage；[Q04](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md#research-q04)outbox lane/回卡组合。

> **思考**：[Q02](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md#research-q02)默认开放/full access及卡片访问控制不同；[Q03](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md#research-q03)/[Q04](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md#research-q04)吞写盘失败/误完成/重复任务送达；[Q05](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md#research-q05)链接与raw诊断敏感面。

> **建议**：[Q06](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md#research-q06)先统一操作者/逐请求关联与三层收据，比继续重试/卡片更值得验证。

[查看完整分析](../../plugins/amlyczz--dsh-lark-link/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1384810483-root"></a>

## [dsh-mac-companion](../../plugins/173787247--dsh-mac-companion/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-mac-companion)

> **用途**：用户需要从 WSL 的 DSH 会话调用另一台已配置的 Mac。

> **亮点**：[Q01](../../plugins/173787247--dsh-mac-companion/INSIGHT.md#research-q01) 把 Mac 通知、Shortcut 与剪贴板操作接成结构化 DSH 工具。

> **思考**：[Q02](../../plugins/173787247--dsh-mac-companion/INSIGHT.md#research-q02) 远端确认是请求字段，服务可能无 token，超时也没有远端停止证明。

> **建议**：[Q03](../../plugins/173787247--dsh-mac-companion/INSIGHT.md#research-q03) 用名称约束、严格确认和操作 ID 对照错动作及重试副作用。

[查看完整分析](../../plugins/173787247--dsh-mac-companion/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335286261-root"></a>

## [dsh-md-annotator](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/3361805598-gif/dsh-md-annotator)

> **用途**：文稿审阅者需要将指向原文的意见交回模型，合格结果是批注正确、源码不误覆盖、报告进入正确草稿并由用户发送。详见[Q01](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md#research-q01)。

> **亮点**：将文件预览、块/选区批注、源码编辑与模型草稿连接，保留人对发送控制；增量是审稿交接而非新的Markdown标准。详见[Q01](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md#research-q01)。

> **思考**：原文件冲突保护不等批注永久保存，刷新/重启会失运行期草稿；复杂语法和无法唯一重锚只保留stale，需读者主动导出核对。详见[Q03](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md#research-q03)。

> **建议**：可研究绑定会话/文件版本的可恢复审稿快照，恢复仅作待核对草稿，用重载/改写/重复块比较错挂和敏感残留。当前未验证。详见[Q05](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335387524-root"></a>

## [dsh-msg-hub](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AbcdefgXW/dsh-msg-hub) [![npm 30d 1,164](https://img.shields.io/static/v1?label=npm+30d&message=1%2C164&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-msg-hub) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-msg-hub)

> **用途**：在 IM 中与 DSH Agent 会话、接收定时任务回复和远程审批通知。

> **亮点**：将三渠道收发、媒体、主动推送和远程监控整合到 DSH；详见[Q01](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q01)。

> **思考**：全局 pending 第一项可由任意经桥进入的 peer 的“批准”应答，/bind 也缺会话授权核对；详见[Q02](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q02)。 回传失败仍可返回ok，入站无全链deadline，处理完成不能当送达回执。

> **建议**：以 peer/session/callId 做严格关联并授权 /bind 可收窄远程批准风险；需双 peer 并发试验，详见[Q03](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1385913707-root"></a>

## [dsh-notify-relay](../../plugins/archaofan--dsh-notify-relay/INSIGHT.md)



> **用途**：面向离开 DSH 窗口仍需关注完成、失败和审批的用户，集中管理哪些事件进入个人或团队通知通道。

> **亮点**：相对单个通知转发器，插件在通道适配器上方增加是否发送、何时聚合与为何抑制的规则和日志，并持久保存失败队列，改变离线关注任务的交接方式。通道投递与客户端呈现仍由外部服务承担，不把发送请求当用户已收到。[Q01](../../plugins/archaofan--dsh-notify-relay/INSIGHT.md#research-q01)

> **思考**：成功回执及重试粒度决定规则是否减少打扰。deliverTo 仅用response.ok判断，未读取服务业务错误；outbox保存整条通知却不保存失败通道集合，drain调用默认channelsFor重发所有匹配通道，部分成功时可能重复推送。网络超时但远端已接受也无幂等回执，不能承诺一次送达。[Q02](../../plugins/archaofan--dsh-notify-relay/INSIGHT.md#research-q02)

> **建议**：未验证方向是每通知每通道保存独立投递状态和幂等键，适配器解析服务业务回执，重试只针对未确认通道。用A成功B失败、HTTP200业务失败和响应丢失矩阵比较现版，要求确认失败不被记成功且A不重复；若服务不支持幂等导致仍无法界定重复，应明确至少一次边界而不宣称严格一次。[Q03](../../plugins/archaofan--dsh-notify-relay/INSIGHT.md#research-q03)

[查看完整分析](../../plugins/archaofan--dsh-notify-relay/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334828310-root"></a>

## [dsh-office-tools](../../plugins/kw78--dsh-office-tools/INSIGHT.md)

[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kw78/dsh-office-tools) [![npm 30d 12,871](https://img.shields.io/static/v1?label=npm+30d&message=12%2C871&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-office-tools) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-office-tools)

> **用途**：需要从同一季度数据写简报、预算和汇报稿的 DSH 用户，可让代理直接生成低复杂度 Office 初稿。见 [Q01](../../plugins/kw78--dsh-office-tools/INSIGHT.md#research-q01)。

> **亮点**：用 ASCII STORE 包适配宿主文本写通道，给模型提供三种文件的结构化生成和提取。见 [Q02](../../plugins/kw78--dsh-office-tools/INSIGHT.md#research-q02)。

> **思考**：Excel 更新会重建工作簿，受改单元格所在表中的缓存公式可能退化为值。PPT 图像使用外链，Word 追加会拒绝其余部件中含非 ASCII 字节的文件。见 [Q03](../../plugins/kw78--dsh-office-tools/INSIGHT.md#research-q03)。

> **建议**：同源季度数据同时生成低复杂度三件套，可能减少录入和核对。以每组合格文件和收件端返工做对照。见 [Q05](../../plugins/kw78--dsh-office-tools/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/kw78--dsh-office-tools/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340280087-root"></a>

## [dsh-plugin-balance](../../plugins/andrew111888--dsh-plugin-balance/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Andrew111888/dsh-plugin-balance) [![npm 30d 1,245](https://img.shields.io/static/v1?label=npm+30d&message=1%2C245&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-balance) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-balance)

> **用途**：个人/团队粗看供应商余额、DSH 消耗和预算趋势，需与正式账单分开。

> **亮点**：把额度和 DSH 会话事件统一展示、按模型/日期做本地估算。详见[Q02](../../plugins/andrew111888--dsh-plugin-balance/INSIGHT.md#research-q02)。

> **思考**：自定义 baseUrl 由请求提供、key 由宿主凭据解析并以 Bearer 发给该地址，缺源绑定与组件内访问控制。详见[Q03](../../plugins/andrew111888--dsh-plugin-balance/INSIGHT.md#research-q03)。

> **建议**：将供应商域名与密钥引用管理员绑定、隔离缓存、价目注明版本可提高安全和对账可信度；尚未实现。详见[Q05](../../plugins/andrew111888--dsh-plugin-balance/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/andrew111888--dsh-plugin-balance/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336663611-root"></a>

## [dsh-plugin-education](../../plugins/863683348--dsh-plugin-education/INSIGHT.md)

[![npm 30d 940](https://img.shields.io/static/v1?label=npm+30d&message=940&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-education) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-education)

> **用途**：教师/助教准备材料与常规算表，模型创作而插件做结构和计算。详见[Q01](../../plugins/863683348--dsh-plugin-education/INSIGHT.md#research-q01)。

> **亮点**：把模板、格式和统计接入模型工具减少手排手算。详见[Q01](../../plugins/863683348--dsh-plugin-education/INSIGHT.md#research-q01)。

> **思考**：重复items覆盖quiz schema，超满分/零阈值与分箱可能误导，题目和难度标签需人工复核。详见[Q03](../../plugins/863683348--dsh-plugin-education/INSIGHT.md#research-q03)。

> **建议**：按action契约/域校验/剩余需求形成可解释结果，比较教师校正与误算，当前未验证。详见[Q05](../../plugins/863683348--dsh-plugin-education/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/863683348--dsh-plugin-education/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1337780031-integrations-deepseek-harness-dsh-plugin-mission-control"></a>

## [dsh-plugin-mission-control](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek) [![npm 30d 809](https://img.shields.io/static/v1?label=npm+30d&message=809&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-mission-control) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-mission-control)

> **用途**：面向想在独立JARVIS看板观察DSH多个会话、并由人确认完成的用户。合格结果是看板可定位对应会话、活动和待审状态，而任务是否真正满足需求仍由人工验收。原来需手动写任务状态，此插件把session建任务、消息和工具事件变活动日志，将正常turn结束送REVIEW，保留人从REVIEW批准DONE的责任。它是事件镜像集成，不是新的agent调度或交付验证器。

> **亮点**：[Q01](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md#research-q01) 与 [Q02](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md#research-q02) 的贡献是把会话状态转成独立看板可审阅的工作流，并保留REVIEW到DONE的人类责任。真实调度和质量验证仍不属于这个镜像组件。

> **思考**：[Q03](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md#research-q03) 表明队列清空可包含失败丢弃，flush不证明送达；未知reason会默认REVIEW，重启跨日还可能重复任务。因此核心价值应限定best-effort可见性，不能宣传完整审计。

> **建议**：[Q05](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md#research-q05) 提出稳定事件幂等键、持久outbox及确认水位，未验证；以丢失、重复、错状态与flush延迟共同检验，不能只看最终队列为空。

[查看完整分析](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1343622602-root"></a>

## [dsh-plugin-nlbi](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1byteone/dsh-plugin-nlbi) [![npm 30d 899](https://img.shields.io/static/v1?label=npm+30d&message=899&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-nlbi) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-nlbi)

> **用途**：已有MySQL库的分析者希望自然语言查数并复用SQL/图表，需正确口径和原生权限范围。

> **亮点**：在dsh-mysql底座上连接Schema、模型生成、校验执行与BI展示，贡献在流程接线而非新SQL/图表算法。详见[Q02](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md#research-q02)。

> **思考**：生成链校验后直接查库并非待确认草稿，行列权限配置未在主query/Text2SQL/rerun执行链强制，不能视为数据隔离。详见[Q03](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md#research-q03)。

> **建议**：可探讨统一查询计划与策略收据，绑定主体/连接/SQL/版本并对所有入口强制策略和明确确认；语义改写与迁移成本未验证。详见[Q06](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1364961230-root"></a>

## [dsh-team-cost](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1569126506-sudo/dsh-team-cost)

> **用途**：共用 DSH 主机的团队需看成员/模型消耗并控制预算。

> **亮点**：把会话事件的 token 桶汇入成员/模型/天账本并连接预算通知、工具报告和看板；较单会话用量视图形成团队管理入口。详见[Q01](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md#research-q01)。

> **思考**：rollup 不从 JSONL 重建，崩溃/缺缓存可少报；归因纯前缀可串成员，未知模型费用为 0，CSV 按天导出丢成员/模型。见[Q02](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md#research-q02)、[Q03](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md#research-q03)。 正确价/无崩溃也只是事后计量，无并发在途预留；团队全量报表访问依宿主外层授权。

> **建议**：现版声明 JSONL 真相源却不重建/去重，未知价零与路径前缀错归；若按 sid+seq 重建、缺价标 unknown、身份/路径段归因，或可降漏计/误拦，但增启动/管理成本。故障、重复、相邻路径和未知模型对照事件/账单；若误差不降或成本超阈值即证伪。详见[Q05](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335241492-root"></a>

## [dsh-univer-office](../../plugins/dream-num--dsh-univer-office/INSIGHT.md)

[![GitHub ★ 706](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=706&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dream-num/dsh-univer-office) [![npm 30d 61,768](https://img.shields.io/static/v1?label=npm+30d&message=61%2C768&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office)

> **用途**：对需要复核公式、样式和数据变化的周期性工作簿，先审阅 Agent 草稿，再生成供收件人打开的文件。

> **亮点**：[Q01](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q01) 把文件内的隔离工作副本和审阅状态带入 Agent 的办公工作流。审阅者仍需验证最终交付文件。

> **思考**：[Q02](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q02) 模型侧返回宿主 ask，Gateway 合并后还有删除和资产发布。宿主审批与失败后的主线状态都需要独立核实。

> **建议**：[Q04](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q04) 可用源修订、文件哈希与收件方复核结果绑定导出交付，试验它能否区分版本变化和转换损失。

[查看完整分析](../../plugins/dream-num--dsh-univer-office/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425215508-root"></a>

## [dsh-whale-catch](../../plugins/rosynb666--dsh-whale-catch/INSIGHT.md)

[![GitHub ★ 101](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=101&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Rosynb666/dsh-whale-catch) [![npm 30d 1,968](https://img.shields.io/static/v1?label=npm+30d&message=1%2C968&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-catch) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-catch)

> **用途**：会话内产物较多的交付者可集中查看并复制归档；完整性仍由显式清单核对。[Q01](../../plugins/rosynb666--dsh-whale-catch/INSIGHT.md#research-q01)

> **亮点**：把显式产物、宿主改动和mtime扫描汇为常驻工作台，并连到hash归档清单与历史回看，减少入口分散；收益尚无同任务对照。[Q01](../../plugins/rosynb666--dsh-whale-catch/INSIGHT.md#research-q01) [Q03](../../plugins/rosynb666--dsh-whale-catch/INSIGHT.md#research-q03)

> **思考**：自动集合既不证明完整也不证明归属；敏感体检只是有界提示，还原可能部分成功，界面预览未在Host绑定计划。[Q01](../../plugins/rosynb666--dsh-whale-catch/INSIGHT.md#research-q01) [Q02](../../plugins/rosynb666--dsh-whale-catch/INSIGHT.md#research-q02)

> **建议**：未验证假设是预览时固定清单及hash，在应用前拒绝版本漂移，减少错版本交付；以预览后改文件的对照检验，不降错配或等待过大就放弃。[Q03](../../plugins/rosynb666--dsh-whale-catch/INSIGHT.md#research-q03)

[查看完整分析](../../plugins/rosynb666--dsh-whale-catch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1413849053-root"></a>

## [dsh-windows-mcp](../../plugins/hellohub1212--dsh-windows-mcp/INSIGHT.md)

[![GitHub ★ 224](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=224&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/helloHub1212/dsh-windows-mcp) [![npm 30d 716,731](https://img.shields.io/static/v1?label=npm+30d&message=716%2C731&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-windows-mcp) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-windows-mcp)

> **用途**：在 Windows 隔离测试桌面中重复读取原生应用界面的 DSH 用户，需要可核对的画面、明确的工具暴露和可验证的停用结果。[Q01](../../plugins/hellohub1212--dsh-windows-mcp/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/hellohub1212--dsh-windows-mcp/INSIGHT.md#research-q01) [Q02](../../plugins/hellohub1212--dsh-windows-mcp/INSIGHT.md#research-q02) 根插件把依赖选择、工具诊断和宿主调用开关接入 DSH，减少手写配置。实际屏幕和输入工具由 Windows-MCP 经宿主 MCP 桥接提供。

> **思考**：[Q03](../../plugins/hellohub1212--dsh-windows-mcp/INSIGHT.md#research-q03) Computer Use 是宿主共享状态。派发拒绝依赖 tools.guard，浏览器鉴权不可观测时插件层会继续处理修改。关闭无法据此证明已派发动作撤销，揭示也无法约束为只读。

> **建议**：[Q05](../../plugins/hellohub1212--dsh-windows-mcp/INSIGHT.md#research-q05) 默认拒绝不可观测的鉴权，并在隔离环境引入限时观察许可，可能减少误开放桌面控制。用两个会话和长调用区分后续拒绝及在途效果。

[查看完整分析](../../plugins/hellohub1212--dsh-windows-mcp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1370460115-root"></a>

## [dsh-wsl-im](../../plugins/173787247--dsh-wsl-im/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-im)

> **用途**：已有 WSL 上 DSH 的用户，希望在 Telegram 等聊天平台继续处理任务并收到回复。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-im/INSIGHT.md#research-q01) 将平台接入和 Agent 会话/工作区组织分离，多个渠道共享附件和回复通路；工具、模型和附件存储仍由宿主提供。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-im/INSIGHT.md#research-q02) 默认允许空白名单并用 danger-full-access，设置更低权限失败仍继续。真实 bot 试用前要能核实平台 ID 和实际宿主工具边界。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-im/INSIGHT.md#research-q03) 比较当前警告后继续与权限设置失败即停止的策略，观察错权限下的工具触发及正常任务完成率。若越界未减少或合法流程代价过高则放弃；未做实验。

[查看完整分析](../../plugins/173787247--dsh-wsl-im/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381860693-root"></a>

## [dsh-wsl-mail](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-mail)

> **用途**：已有本地邮件工具的用户想先定位需要跟进的消息。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md#research-q01) 把常用邮件初筛接到工作会话。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md#research-q02) 未读计数只在 notmuch 分支成立，Himalaya 返回近期收件箱样本。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md#research-q03) 拆分两种计数并显式标记后端和失败，比较误读率。

[查看完整分析](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1369398336-packages-dsh-mail"></a>

## [EduWork DSH Mail](../../plugins/ecnu--eduwork--packages-dsh-mail/INSIGHT.md)

[![GitHub ★ 264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ECNU/EduWork) [![npm 30d 2,110](https://img.shields.io/static/v1?label=npm+30d&message=2%2C110&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-mail) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-mail)

> **用途**：需要在 DSH 工作中查看邮件或按用户授权发送回复的用户。

> **亮点**：[Q02](../../plugins/ecnu--eduwork--packages-dsh-mail/INSIGHT.md#research-q02) 把邮箱能力接入 Agent 并区分发送开关与审批策略。

> **思考**：[Q03](../../plugins/ecnu--eduwork--packages-dsh-mail/INSIGHT.md#research-q03) Full Access 不增加逐次审批；SMTP accepted 或其他错误不能证明最终投递状态。

> **建议**：[Q05](../../plugins/ecnu--eduwork--packages-dsh-mail/INSIGHT.md#research-q05) 对照现有 Message-ID 和手工查询提示，验证辅助核对能否降低重复。

[查看完整分析](../../plugins/ecnu--eduwork--packages-dsh-mail/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1369398336-packages-dsh-oidc"></a>

## [EduWork OIDC](../../plugins/ecnu--eduwork--packages-dsh-oidc/INSIGHT.md)

[![GitHub ★ 264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ECNU/EduWork) [![npm 30d 1,987](https://img.shields.io/static/v1?label=npm+30d&message=1%2C987&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-oidc) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-oidc)

> **用途**：希望通过机构身份访问 DSH 的用户；基线是独立管理身份及模型凭据。[Q01](../../plugins/ecnu--eduwork--packages-dsh-oidc/INSIGHT.md#research-q01)

> **亮点**：把机构认证、会话和授权模型目录接入宿主。[Q01](../../plugins/ecnu--eduwork--packages-dsh-oidc/INSIGHT.md#research-q01)

> **思考**：本地凭据清除不证明远端 access token 已失效；不同网关协议需分别验收。[Q03](../../plugins/ecnu--eduwork--packages-dsh-oidc/INSIGHT.md#research-q03)

> **建议**：未验证假设：明确展示本地清理与远端撤销的确认状态可减少用户误解，须对照现有清理和日志。[Q05](../../plugins/ecnu--eduwork--packages-dsh-oidc/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/ecnu--eduwork--packages-dsh-oidc/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1170373459-dsh-invoice-downloader"></a>

## [InvoiceFlowAI DSH 发票插件](../../plugins/ethanyoq--invoice-downloader--dsh-invoice-downloader/INSIGHT.md)

[![GitHub ★ 526](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=526&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/Invoice-Downloader) [![npm 30d 1,348](https://img.shields.io/static/v1?label=npm+30d&message=1%2C348&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ethanyoq/dsh-invoice-downloader) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ethanyoq/dsh-invoice-downloader)

> **用途**：面向固定 QQ 或 163 邮箱的重复收票者，在 DSH 边栏下载、识别并整理报销准备材料。

> **亮点**：把既有收票引擎接到DSH当前模型、凭据、作业记录和边栏，减少跨程序交接，并对输出目录和作业状态建立约束。[Q01](../../plugins/ethanyoq--invoice-downloader--dsh-invoice-downloader/INSIGHT.md#research-q01) [Q02](../../plugins/ethanyoq--invoice-downloader--dsh-invoice-downloader/INSIGHT.md#research-q02)

> **思考**：语法字段校验不证明账实一致；导出引用注册失败仍可complete，取消后已有文件也需核对，不能把完成状态当合格交付。[Q03](../../plugins/ethanyoq--invoice-downloader--dsh-invoice-downloader/INSIGHT.md#research-q03)

> **建议**：未验证假设是显式字段门控与人工复核触发模型降级可降低资源而不损害质量；用固定真值批次比较错字段、漏票、人工修正、全部重试与模型费用，静默错误增加或总工时不降则推翻。[Q04](../../plugins/ethanyoq--invoice-downloader--dsh-invoice-downloader/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/ethanyoq--invoice-downloader--dsh-invoice-downloader/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1170373459-root"></a>

## [InvoiceFlowAI 发票整理工具](../../plugins/ethanyoq--invoice-downloader/INSIGHT.md)

[![GitHub ★ 526](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=526&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/Invoice-Downloader)

> **用途**：面向每月批量收票的个人和小团队，独立桌面工具将邮箱票据整理为分类原件和报销准备报表。

> **亮点**：把收票、候选识别、归档和最终化组织成有范围及终态的批次流程，明确区分未读邮件、识别失败和可人工处理结果，超出单张OCR入口。[Q01](../../plugins/ethanyoq--invoice-downloader/INSIGHT.md#research-q01) [Q02](../../plugins/ethanyoq--invoice-downloader/INSIGHT.md#research-q02)

> **思考**：本地归档不代表全链离线，远端识别和字段净化需要原件复核；成功数量不证明邮箱完整或关键字段一致。[Q03](../../plugins/ethanyoq--invoice-downloader/INSIGHT.md#research-q03)

> **建议**：未验证假设是用邮箱范围完整、原件保留与关键字段核对组成批次验收门槛，较成功数量能减少漏交付；固定真值对照漏票发现、人工时间和重试，若只增工时不降错误则推翻。[Q04](../../plugins/ethanyoq--invoice-downloader/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/ethanyoq--invoice-downloader/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-823606893-root"></a>

## [LazyMind](../../plugins/lazyagi--lazymind/INSIGHT.md)

[![GitHub ★ 644](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=644&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LazyAGI/LazyMind)

> **用途**：需要在生成演示稿中途审查大纲或内容的 DSH 用户，可连接 LazyMind 并在原会话核对运行。

> **亮点**：把外部流程的状态、人工审核点与宿主会话接起来。Core 的通知投递与执行准入分别处理，失去回执时可按持久输入对账。见 [Q01](../../plugins/lazyagi--lazymind/INSIGHT.md#research-q01) 至 [Q03](../../plugins/lazyagi--lazymind/INSIGHT.md#research-q03)。

> **思考**：宿主接收、步骤执行和文件交付是不同状态。停止仍以会话为目标，无法按预期轮次原子取消。见 [Q02](../../plugins/lazyagi--lazymind/INSIGHT.md#research-q02) 与 [Q03](../../plugins/lazyagi--lazymind/INSIGHT.md#research-q03)。

> **建议**：在面板分开呈现可确认的投递、审核和文件状态，可能减少误交付。以相同演示稿任务比较断线和返工。见 [Q05](../../plugins/lazyagi--lazymind/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/lazyagi--lazymind/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1226490932-root"></a>

## [LeLogin for DeepSeek Harness](../../plugins/zcmilan--lelogin-skill/INSIGHT.md)



> **用途**：已授权 LeLogin 用户希望按账号运行本地凭据或 Web 应用流程。

> **亮点**：把凭据引用与 Profile 选择写成宿主可发现的工作流，减少引导用户直接粘贴秘密的需求。[Q01](../../plugins/zcmilan--lelogin-skill/INSIGHT.md#research-q01) [Q02](../../plugins/zcmilan--lelogin-skill/INSIGHT.md#research-q02)

> **思考**：注册器不强制批准或脱敏，真实数据边界取决于未核验的外部运行时和下游命令。[Q03](../../plugins/zcmilan--lelogin-skill/INSIGHT.md#research-q03)

> **建议**：对比带非敏感目标预览和本地审计的方案，核错号率与泄漏。尚未验证。[Q04](../../plugins/zcmilan--lelogin-skill/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/zcmilan--lelogin-skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-306829688-root"></a>

## [NocoBase](../../plugins/nocobase--nocobase/INSIGHT.md)

[![GitHub ★ 24,868](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=24%2C868&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nocobase/nocobase)

> **用途**：维护 NocoBase 应用的团队可以将任务分派给已注册的 DSH runner，跟踪会话事件和交付回执。

> **亮点**：[Q01](../../plugins/nocobase--nocobase/INSIGHT.md#research-q01) 和 [Q02](../../plugins/nocobase--nocobase/INSIGHT.md#research-q02) 表明，NocoBase 将独立 DSH 进程变成可领取任务的应用执行工具，记录配置、会话事件和结果状态，从而替代部分手工交接。

> **思考**：[Q03](../../plugins/nocobase--nocobase/INSIGHT.md#research-q03) 表明，runner 领用授权与 DSH 子进程权限分开。正式 DSH 路径请求全权限模式，worker 回调直接允许 ACP 权限请求，因而不能将应用任务门禁当成逐工具审批或操作系统隔离。

> **建议**：[Q05](../../plugins/nocobase--nocobase/INSIGHT.md#research-q05) 提出绑定实际运行环境与外部副作用状态，验证是否能让操作者更准确地判断任务终止和恢复。

[查看完整分析](../../plugins/nocobase--nocobase/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333152408-packages-plugins-plugin-session-export"></a>

## [Plugin Session Export](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-session-export/INSIGHT.md)

[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite) [![npm 30d 135](https://img.shields.io/static/v1?label=npm+30d&message=135&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-session-export) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-session-export)

> **用途**：个人DSH用户整理对话供复盘/周报，见 [Q01](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-session-export/INSIGHT.md#research-q01)。

> **亮点**：[Q01](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-session-export/INSIGHT.md#research-q01) 和 [Q02](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-session-export/INSIGHT.md#research-q02) 把同一事件投影输出两类便读报告，HTML escaping与动态代码围栏具体减少展示破坏，便于人工复盘；非新记忆/审计算法。

> **思考**：[Q03](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-session-export/INSIGHT.md#research-q03) mini仍含system/reasoning/路径，逐文件覆盖写失败可部分落盘；[Q02](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-session-export/INSIGHT.md#research-q02)首prompt末模型和regex委派标签丢时间/关系，不能当安全分享或完整轨迹。

> **建议**：[Q05](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-session-export/INSIGHT.md#research-q05) 未验证的最少字段、授权范围、seq覆盖清单及不覆盖逐项结果契约，以秘密prompt/模型切换/第二项失败反例验收。

[查看完整分析](../../plugins/whyihaveyou--dsh-suite--packages-plugins-plugin-session-export/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1357268674-root"></a>

## [QQBot 增强版](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md)

[![GitHub ★ 237](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=237&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zaofan-make/dsh-qqbot) [![npm 30d 37,967](https://img.shields.io/static/v1?label=npm+30d&message=37%2C967&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zaofan/dsh-qqbot) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zaofan/dsh-qqbot)

> **用途**：在 QQ 里讨论任务、已有 DSH 工作流的操作者，可以从一对一聊天触发固定会话，并在聊天里核对非敏感任务的回复和附件。

> **亮点**：把 QQ 聊天映射到 DSH 会话，可在聊天里调整活动模型，并把宿主声明的文件送回任务对话。只改思考强度时保留会话标识，切模型时派生带历史的子会话。相对只做 QQ 收发或手工复制，主要增量是会话与交付接线。见 [Q01](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q01)、[Q02](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q02) 和 [Q03](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q03)。

> **思考**：最需要核对的是成功回执是否和实际状态一致。旧宿主可能只更新模型字段，文件路径又在上传完成前被登记用于去重。同群控制命令也存在与切模不同的权限路径。见 [Q02](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q02)、[Q03](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q03) 和 [Q04](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q04)。

> **建议**：若切模确认绑定实际请求版本、投递确认绑定远端收件结果，操作者或许能减少跨端返工。以交错切模和失败上传比较每份正确交付的人工步骤和误投，结果不明时由人核对再决定是否补发。见 [Q05](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-249995750-root"></a>

## [Reactive Resume](../../plugins/reactive-resume--reactive-resume/INSIGHT.md)

[![GitHub ★ 45,386](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45%2C386&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/reactive-resume/reactive-resume)

> **用途**：Reactive Resume6.1.0是独立Web/服务应用及MCP接口，根包为private workspace，不是DSH原生插件或单个Skill。它面向需要维护、修改、导出和分享简历/求职信并追踪申请的人；外部助手可经MCP操作用户文档，DSH若接入也只是兼容客户端。合格结果是事实准确、目标岗位匹配、文件可读且公开范围符合本人意愿，不是保存成功或录用保证。

> **亮点**：[Q02](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q02)结构化履历的认证可编程编辑、版本与客户端同步；[Q04](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q04)短链接连接实际渲染导出，非录用或事实保证。

> **思考**：[Q03](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q03)预期版本可选、写可影响公开，恢复不撤外流；[Q04](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q04)链接非冻结版本，PDF缺字/告警和真实排版仍须人验。

> **建议**：[Q05](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q05)写前版本/公开差异和写后导出件/告警签收，故障对照验误写/误公开/返工，未实现不加分。

[查看完整分析](../../plugins/reactive-resume--reactive-resume/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1294614772-root"></a>

## [Recruiting Copilot](../../plugins/viy1204--recruiting-copilot/INSIGHT.md)

[![GitHub ★ 107](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=107&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Viy1204/recruiting-copilot)

> **用途**：有稳定招聘流程、需要整理岗位和人选的团队。

> **亮点**：[Q01](../../plugins/viy1204--recruiting-copilot/INSIGHT.md#research-q01) 统一招聘流程、回执与本地进展。

> **思考**：[Q02](../../plugins/viy1204--recruiting-copilot/INSIGHT.md#research-q02) Skill 授权约定与实际外发约束需分别验收。

> **建议**：[Q04](../../plugins/viy1204--recruiting-copilot/INSIGHT.md#research-q04) 持久未知状态收据可能减少重复联系。

[查看完整分析](../../plugins/viy1204--recruiting-copilot/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1203725733-root"></a>

## [Tencent Meeting CLI](../../plugins/tencentcloud--tencentmeeting-cli/INSIGHT.md)

[![GitHub ★ 248](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=248&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloud/tencentmeeting-cli) [![npm 30d 10,141](https://img.shields.io/static/v1?label=npm+30d&message=10%2C141&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencentcloud/tmeet) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencentcloud/tmeet)

> **用途**：授权会议用户/Agent需用结构化命令查会议内容与报告。

> **亮点**：[Q01](../../plugins/tencentcloud--tencentmeeting-cli/INSIGHT.md#research-q01) 会议API命令化与配套范围/确认指引降低对接负担，独立tool非原生DSH插件。

> **思考**：[Q02](../../plugins/tencentcloud--tencentmeeting-cli/INSIGHT.md#research-q02) 远程写重试/取消不等未发生，设备/Agent元数据会随请求发出；Skill护栏不等服务端权限与幂等。

> **建议**：[Q04](../../plugins/tencentcloud--tencentmeeting-cli/INSIGHT.md#research-q04) 连接trace/目标/分页/最终状态收据，若现有JSON等价或隐私负担更高即否定。

[查看完整分析](../../plugins/tencentcloud--tencentmeeting-cli/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1184366339-plugins-dsh-welink"></a>

## [WeLink DSH 插件](../../plugins/runzhliu--welink--plugins-dsh-welink/INSIGHT.md)

[![GitHub ★ 319](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=319&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/runzhliu/welink)

> **用途**：需要查回 WeLink 会话中的日期和约定的人，可在 DSH 中定向查询已配置会话。

> **亮点**：把聊天检索变成几个有会话、日期和输出限额的工具，保留按需范围和截断信息。[Q01](../../plugins/runzhliu--welink--plugins-dsh-welink/INSIGHT.md#research-q01) [Q02](../../plugins/runzhliu--welink--plugins-dsh-welink/INSIGHT.md#research-q02)

> **思考**：客户端名单不证明后端授权；回环或 HTTPS 缺 token 仍可发请求，真实后端必须独立拒绝。撤销也无法清除已传出内容。[Q03](../../plugins/runzhliu--welink--plugins-dsh-welink/INSIGHT.md#research-q03)

> **建议**：可把本地名单与后端有效授权的交集作为可核验状态，比较误判和恢复耗时；无改善或增加标识外发则放弃。[Q04](../../plugins/runzhliu--welink--plugins-dsh-welink/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/runzhliu--welink--plugins-dsh-welink/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1306637593-root"></a>

## [公文全流程处理专家](../../plugins/linhut--gongwen-skill/INSIGHT.md)

[![GitHub ★ 99](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=99&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/linhut/gongwen-skill) [![npm 30d 3,414](https://img.shields.io/static/v1?label=npm+30d&message=3%2C414&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/gongwen-skill) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/gongwen-skill)

> **用途**：文秘人员反复处理公文格式与修订。

> **亮点**：[Q01](../../plugins/linhut--gongwen-skill/INSIGHT.md#research-q01) 把格式、模板和修订处理集中到 Agent 入口。

> **思考**：[Q03](../../plugins/linhut--gongwen-skill/INSIGHT.md#research-q03) 直接子进程权限和最终渲染需核对。

> **建议**：[Q05](../../plugins/linhut--gongwen-skill/INSIGHT.md#research-q05) 能减少固定排版工时而保持文本可核查。

[查看完整分析](../../plugins/linhut--gongwen-skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1294942686-root"></a>

## [新诉讼可视化](../../plugins/miaoqichuan--new-litigation-visualization/INSIGHT.md)

[![GitHub ★ 142](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=142&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MiaoQichuan/new-litigation-visualization)

> **用途**：法律工作人员需要向当事人解释案件经过并保留出处。

> **亮点**：[Q01](../../plugins/miaoqichuan--new-litigation-visualization/INSIGHT.md#research-q01) 以独立布局和出处索引减少反复排版，同时提供 DSH 原生启动工具。

> **思考**：[Q03](../../plugins/miaoqichuan--new-litigation-visualization/INSIGHT.md#research-q03) 字符子序列守卫允许删字，人工仍须核查否定、事实归属和争议口径。

> **建议**：[Q05](../../plugins/miaoqichuan--new-litigation-visualization/INSIGHT.md#research-q05) 同一虚构卷宗经插件制作的时间轴或可减少排版工时且保留出处核对质量。

[查看完整分析](../../plugins/miaoqichuan--new-litigation-visualization/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335382133-root"></a>

## [赤诚推送 chicheng-push](../../plugins/534119219--chicheng-push/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/534119219/chicheng-push)

> **用途**：已有后台任务/脚本需要通知出口，不自带任务监听或调度。详见[Q01](../../plugins/534119219--chicheng-push/INSIGHT.md#research-q01)。

> **亮点**：把常见通知适配、配置表单与host/HTTP出口统一，减少其他任务插件重复接多服务商。详见[Q01](../../plugins/534119219--chicheng-push/INSIGHT.md#research-q01)。

> **思考**：Host围栏不是对端认证且list回明文secret，部分HTTP失败可误记已发；未持久确认/无幂等不能作为可靠到账证明。详见[Q02](../../plugins/534119219--chicheng-push/INSIGHT.md#research-q02)。

> **建议**：将目标授权/凭证服务与每渠道受理状态、稳定ID/outbox及unknown恢复结合，用假ack/超时/重复/存储失败反例证伪，未验证。详见[Q06](../../plugins/534119219--chicheng-push/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/534119219--chicheng-push/INSIGHT.md) · [返回表格](#category-index)

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-11-12
