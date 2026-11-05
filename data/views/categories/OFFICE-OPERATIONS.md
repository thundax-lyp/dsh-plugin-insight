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
| [BrowserSkill DSH 插件](#plugin-1276665883-packages-dsh-plugin-browserskill) | 将 BrowserSkill 的浏览器操作接入 DSH 模型工具并提供会话观察。 | [Q05](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q05) 先用测试账号、显式会话和只读网页；操作结果或目标不明时停止并核对页面与本机保存文件。 |
| [BrowserSkill 浏览器连接工具](#plugin-1276665883-root) | 通过 bsk CLI、daemon 和浏览器扩展，让 Agent 操作已有登录态的 Chrome 或 Edge。 | [Q05](../../plugins/tencent--browserskill/INSIGHT.md#research-q05) 在测试账号先做只读任务，确认组件版本和回执；状态不明时停止并人工核对网页及已保存副本。 |
| [chicheng-stats](#plugin-1335725068-root) | DSH Web 全局用量统计、历史会话回填和可配置侧栏面板，附 DeepSeek 平台余额提示。 | 先禁用平台 token 导入，仅测本地统计并对账；再评估同源 API 和浏览器凭据边界；详见[Q03](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q03)。 |
| [DeepSeek Harness GenUI](#plugin-1334554248-root) | 以可保存任务状态和受控桥接的生成应用承接多轮任务 | [Q04](../../plugins/pengyue-polaron--deepseek-harness-genui/INSIGHT.md#research-q04) 先测无外部权限表单，再测撤权与回退。 |
| [DSH Ego Browser](#plugin-1326394141-root) | 为 DSH 提供浏览器操作、会话空间和实时观察入口。 | [Q04](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q04) 从隔离只读操作开始，外部状态不明时人工核查。 |
| [DSH Generative UI](#plugin-1340581082-root) | 让回复中的 TSX 成为内联交互界面或持续画布 | [Q04](../../plugins/mindlab-research--dsh-generative-ui/INSIGHT.md#research-q04) 以隔离 Web profile 装固定版本，首先试不导入外部依赖的纯 React 计算卡。 |
| [DSH Notes Export](#plugin-1182135360-dsh-plugin) | 把整理后的对话导出为工作区便签，或通过演示服务渲染为图片。 | [Q04](../../plugins/zhaoolee--notes--dsh-plugin/INSIGHT.md#research-q04) 建议已有可信便签服务的用户先用非敏感短文本核实目的地、内容与结果；超时后先回查再决定是否重试。 |
| [DSH Reaudit](#plugin-1172884215-packages-dsh-reaudit) | 通过 DSH MCP 客户端连接 Reaudit 托管服务，使用其远端工具。 | [Q04](../../plugins/rosesamaras--reaudit-ai-plugin--packages-dsh-reaudit/INSIGHT.md#research-q04) 建议先核服务政策与权限，再在隔离账户尝试非敏感只读请求；结果或目标不明时停止并人工回查。 |
| [dsh-feishu](#plugin-1418842530-root) | 以应用或用户身份把飞书主要办公 API 接入 DSH。 | 建议观察。 |
| [dsh-feishu-bot](#plugin-1346023250-root) | 通过飞书WebSocket操作DSH项目与会话，支持扫码绑定、聊天审批和完成通知。 | 观察，受信owner/允许群与最低权限Profile，审批/广播分别明确，未知投递不重放任务。 |
| [dsh-file-handover](#plugin-1422380986-root) | 将本地文件路径填入Windows原生文件框，按Win32/UIA/剪贴板回读并可确认，返回候选与动作记录。 | 先观察，单可见框probe+click=false人工核对。 |
| [dsh-im](#plugin-1334561781-root) | 把即时通讯机器人与本机 DSH 会话和工作区连接。 | [Q05](../../plugins/xmanrui--dsh-im/INSIGHT.md#research-q05) 在非敏感私聊和固定工作区试用，结果未知时暂停并对账。 |
| [dsh-im-connect](#plugin-1335758624-root) | 把多账号 IM 聊天接入 DSH，支持会话绑定、审批和断线后交付。 | [Q03](../../plugins/michengai--dsh-im-connect/INSIGHT.md#research-q03) 从隔离私聊开始验收，随后扩展至群聊。 |
| [dsh-invoice-tools](#plugin-1344714819-root) | 本地抽取电子发票PDF的XML/文本字段并作算术核对，汇总类别与重复提示，生成Markdown或xlsx.b64。 | 先观察；无敏感样票对照可继续研究，正式草稿也需显式files与原票复核，不把high或勾稽通过当放行。 |
| [dsh-mac-companion](#plugin-1384810483-root) | 通过 Mac Companion 在 DSH 发通知、运行 Shortcuts 和读写剪贴板。 | [Q03](../../plugins/173787247--dsh-mac-companion/INSIGHT.md#research-q03) 仅用隔离 Mac 和无敏感通知开始，执行状态不明时回本机。 |
| [dsh-md-annotator](#plugin-1335286261-root) | 在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。 | 建议有备份文稿的小范围试用，先验块引用/归属和冲突，结束前保存源码导出批注；复杂语法或导出不可靠时回外部编辑器。 |
| [dsh-msg-hub](#plugin-1335387524-root) | 把微信、QQ、飞书消息接入 DSH 会话，并提供主动推送与远程审批/状态功能。 | 远程批准应先停用或仅在严格可信单 peer 环境隔离评估，修复来源绑定后再用真实渠道；详见[Q02](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q02)、[Q03](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q03)。 |
| [dsh-notify-relay](#plugin-1385913707-root) | 把 DSH 生命周期事件经过去重、免打扰、摘要和重试规则转发到多种通知服务或 webhook。 | 先观察，在隔离接收器验证每类事件和部分通道失败，确认哪些内容会外发。 |
| [dsh-plugin-balance](#plugin-1340280087-root) | DSH Web 额度悬浮窗，整合多供应商查询、会话 token 统计与费用估算。 | 先禁自定义任意 URL，以假 key 试验并同官方账单对账；只把费用视为估算。 |
| [dsh-plugin-education](#plugin-1336663611-root) | 用edu_kit提供教案与题目骨架、测验结构检查、格式转换和成绩/计划统计，不替代教学内容审阅。 | 教师审阅下试用模板/转换，数值与答案复核后使用。 |
| [dsh-plugin-mission-control](#plugin-1337780031-integrations-deepseek-harness-dsh-plugin-mission-control) | 将 DSH 会话、消息与工具活动镜像到 JARVIS 看板，并把结束回合送入人工审查。 | 已有可信自托管JARVIS看板的用户可在无敏感信息的会话先试。 |
| [dsh-plugin-nlbi](#plugin-1343622602-root) | 把MySQL连接、Schema驱动Text2SQL、查询结果与BI报表接入DSH对话和侧栏。 | 先观察，优先修/核多入口策略与确认，DB原生权限兜底后再评估脱敏测试库。 |
| [dsh-team-cost](#plugin-1364961230-root) | 从 DSH 会话事件记团队 token/成本，提供成员预算、告警和报表。 | 隔离 profile 先固定成员路径、模型价和真实账单对照，测试崩溃/事件 replay/相邻路径，再考虑 alert；不要以此版结算或启用强制拦截。 |
| [dsh-usage-billing](#plugin-1333954586-root) | 监听本机 LLM 流量并按峰谷价持久化 token/费用，提供面板、预算告警、导出和余额查询。 | 只建议把它当预算观察工具，不用于报销或财务结算。 |
| [dsh-wsl-im](#plugin-1370460115-root) | 把多个即时通信平台的消息、附件和回复桥接到 WSL 中的 DSH Agent。 | [Q03](../../plugins/173787247--dsh-wsl-im/INSIGHT.md#research-q03) 先隔离验证本机 mock；真实 bot 仅在 [Q02](../../plugins/173787247--dsh-wsl-im/INSIGHT.md#research-q02) 的白名单与实际最小权限均可确认后再评估。 |
| [dsh-wsl-mail](#plugin-1381860693-root) | 在 DSH 中查看邮件信封与未读概况，并通过 notmuch 搜索。 | [Q03](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md#research-q03) 只用合成信封验证，明确 notmuch 未读计数和 Himalaya 样本的区别。 |
| [EduWork DSH Mail](#plugin-1369398336-packages-dsh-mail) | 为 DSH 提供邮件读取、附件保存与受控 SMTP 发送工具。 | [Q04](../../plugins/ecnu--eduwork--packages-dsh-mail/INSIGHT.md#research-q04) 隔离账户先验证权限并由用户核对；外发需明确授权，异常先查询。 |
| [EduWork OIDC](#plugin-1369398336-packages-dsh-oidc) | 为 DSH 提供机构身份登录与授权模型接入。 | 先用隔离身份测试登录、模型类型及撤销失败，状态不明由管理员核查。 |
| [InvoiceFlowAI DSH 发票插件](#plugin-1170373459-dsh-invoice-downloader) | 在 DSH 边栏收集邮箱发票、识别字段、分类归档并导出 Excel | 仅在 Windows x64 或 macOS Apple Silicon 上，用测试邮箱和有真值的混合批次试用；先验收原件、关键字段和可用导出，再比较人工总时间。 |
| [InvoiceFlowAI 发票整理工具](#plugin-1170373459-root) | 从邮箱收集电子发票和下载链接，识别分类并生成 Excel 汇总 | 用测试邮箱与混合票据真值批次试用，按原件、关键字段、邮箱范围和可用导出验收；不合格先人工补齐，再决定是否继续。 |
| [LeLogin for DeepSeek Harness](#plugin-1226490932-root) | 在 DSH 注册 LeLogin Skill，指导凭据引用、注入和已认证应用的本地使用。 | 先观察注册和假账号发现；对实际凭据操作保留手工退路，直到验证运行时与审批。 |
| [NocoBase](#plugin-306829688-root) | 以无代码配置数据、页面、权限和工作流，并可接入 AI 员工与外部工具。 | 先用匿名隔离实例和两个角色验证人工、AI、MCP 及 workflow 入口；对远端成功后本地失败进行对账，异常时停用相关工具并回退人工。 |
| [QQBot 增强版](#plugin-1357268674-root) | 把 QQ 消息接入 DSH 会话，并提供富媒体、交付文件发送和 Web 设置。 | [Q04](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q04) 先在受控群确认名单和静默策略，再测试一个文件并保留人工退路。 |
| [Recruiting Copilot](#plugin-1294614772-root) | 将招聘 Skill、平台浏览器观察和本地招聘看板接入 DSH。 | [Q03](../../plugins/viy1204--recruiting-copilot/INSIGHT.md#research-q03) 先用独立工作区。 |
| [Tencent Meeting CLI](#plugin-1203725733-root) | 基于 OAuth2 的腾讯会议命令行工具，支持会议、录制、纪要、报告及事件操作。 | [Q04](../../plugins/tencentcloud--tencentmeeting-cli/INSIGHT.md#research-q04) 小范围只读核身份/分页/原文，写和上传须具体授权；状态不明停并回GUI。 |
| [Univer Office](#plugin-1335241492-root) | 在 DSH 中以 Univer 草稿编辑、预览和审阅表格、文档与演示。 | 先备份并在隔离工作区测试小型文件，验证审批、权限和目标 Office 打开效果，再决定交付；失败时保留原件。 |
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

<a id="plugin-1276665883-packages-dsh-plugin-browserskill"></a>

## [BrowserSkill DSH 插件](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md)

[![GitHub ★ 9,857](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C857&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/BrowserSkill) [![npm 30d 32,326](https://img.shields.io/static/v1?label=npm+30d&message=32%2C326&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin)

> **用途**：面向已有 BrowserSkill CLI 和浏览器扩展、希望从 DSH 会话操作网页并查看进度的用户。

> **亮点**：[Q01](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q01) 和 [Q02](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q02) 说明该插件将已有 bsk 能力映射为模型工具和可见会话，并管理注册与清理；不归因上游浏览器引擎。

> **思考**：[Q03](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q03) 的插件级当前会话不是对话隔离证明；[Q04](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q04) 的取消和 Web 请求检查也不等于撤销网站操作或完整认证。

> **建议**：[Q06](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q06) 在可信宿主会话身份存在时对默认及显式浏览器会话做归属检查，并保留合法共享；收益与误拒均未验证。

[查看完整分析](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1276665883-root"></a>

## [BrowserSkill 浏览器连接工具](../../plugins/tencent--browserskill/INSIGHT.md)

[![GitHub ★ 9,857](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C857&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/BrowserSkill)

> **用途**：面向需要使用既有网页登录态，并能观察和核对动作的 Agent 用户。

> **亮点**：[Q01](../../plugins/tencent--browserskill/INSIGHT.md#research-q01) 与 [Q02](../../plugins/tencent--browserskill/INSIGHT.md#research-q02) 表明根工具把登录态、可见窗口和跨宿主 CLI 接到浏览器；未测净节时和业务正确性。

> **思考**：[Q03](../../plugins/tencent--browserskill/INSIGHT.md#research-q03) 与 [Q04](../../plugins/tencent--browserskill/INSIGHT.md#research-q04) 显示停止不会回滚网页动作，本地来源检查不绑定具体扩展身份，且登录态和保存副本有各自边界。

> **建议**：[Q06](../../plugins/tencent--browserskill/INSIGHT.md#research-q06) 探索可撤销的本地连接方身份绑定；不能只 pin 可伪造的 Origin，安全收益、兼容及操作负担尚未测试。

[查看完整分析](../../plugins/tencent--browserskill/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1326394141-root"></a>

## [DSH Ego Browser](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md)

[![GitHub ★ 361](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=361&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fisfzy/dsh-ego-browser) [![npm 30d 14,386](https://img.shields.io/static/v1?label=npm+30d&message=14%2C386&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ego-browser) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ego-browser)

> **用途**：面向需要 Agent 操作网页且愿意监督和核对外部结果的用户。

> **亮点**：[Q01](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q01) 与 [Q03](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q03) 将浏览器动作及分类重试接入 DSH；是否避免重复仍需核查，页面和浏览器不属插件原创。

> **思考**：[Q02](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q02) 空间 ID 截取可能碰撞；[Q03](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q03) 冷启动签名可触发回退，其确实无副作用未独立证明。

> **建议**：[Q05](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md#research-q05) 以完整会话随机映射和结果未知状态试验隔离及重复提交，尚未验证。

[查看完整分析](../../plugins/fisfzy--dsh-ego-browser/INSIGHT.md) · [返回表格](#category-index)

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



> **用途**：浏览器上传/应用打开文件需要跨到Windows原生文件框。详见[Q01](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q01)。

> **亮点**：把原生文件选择框环节接进模型工具，给回读与候选记录。详见[Q01](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q01)。

> **思考**：默认首结构匹配无PID/HWND绑定，路径回读仅子串兜底，确认消息不等应用接收且取消未传播。详见[Q03](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q03)、[Q04](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q04)。

> **建议**：研究目标租约、精确路径集合与应用回执，拒多候选并限制全局输入，比较误投/重复确认。当前未验证。详见[Q05](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334561781-root"></a>

## [dsh-im](../../plugins/xmanrui--dsh-im/INSIGHT.md)

[![GitHub ★ 3,023](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C023&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xmanrui/dsh-im) [![npm 30d 79,244](https://img.shields.io/static/v1?label=npm+30d&message=79%2C244&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xmanrui/dsh-im) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xmanrui/dsh-im)

> **用途**：[Q01](../../plugins/xmanrui--dsh-im/INSIGHT.md#research-q01) 用户希望从授权 IM 私聊操作本机 DSH，并把结果回到正确会话。

> **亮点**：[Q02](../../plugins/xmanrui--dsh-im/INSIGHT.md#research-q02) 把 IM 消息映射到 DSH 工作区会话并回传，减少单独搭桥工作；不保证所有渠道具备相同能力。

> **思考**：[Q03](../../plugins/xmanrui--dsh-im/INSIGHT.md#research-q03) 部分交付、未知结果及文件读取范围使目标、权限与平台记录核验必要。

> **建议**：[Q04](../../plugins/xmanrui--dsh-im/INSIGHT.md#research-q04) 会话发送前展示目标和文件范围或能减少误投；需要对照实验，尚未验证。

[查看完整分析](../../plugins/xmanrui--dsh-im/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1333954586-root"></a>

## [dsh-usage-billing](../../plugins/940842546--dsh-usage-billing/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/940842546/dsh-usage-billing) [![npm 30d 1,051](https://img.shields.io/static/v1?label=npm+30d&message=1%2C051&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-usage-billing) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-usage-billing)

> **用途**：频繁使用 DeepSeek 模型的个人或团队希望按会话、模型、日期追踪 token 和估算费用，基线是手工导出日志乘官方单价。合格结果是每次调用只计一次、时区/节假日/模型档位正确、共享文件不丢写，估算与官方账单在定义误差内可对账。 详见[Q01](../../plugins/940842546--dsh-usage-billing/INSIGHT.md#research-q01)。

> **亮点**：相对表格手算，它把实时采集、历史回填、价格分段、预算告警和会话导航整合进 DSH。价值是本地可见性而非正式账单；模型按名称子串归类、价格表与节假日需要持续维护，多实例共享文件会互相覆盖。 详见[Q03](../../plugins/940842546--dsh-usage-billing/INSIGHT.md#research-q03)。

> **思考**：核心质疑是估算准确性。llm/stream 事件缺失/重复、历史回填去重、模型别名、价格变更、法定调休和汇率都可能偏差；官方余额只是账户总额，不能反证插件按会话分摊正确。若用户把估算当财务账单，错误告警会误导预算决策。 详见[Q04](../../plugins/940842546--dsh-usage-billing/INSIGHT.md#research-q04)。

> **建议**：未验证假设是从官方账单抽取每日总额做只读校准，并显示“覆盖率/差额”而非单一费用，可防止估算被误当账单。最小实验连续30天比较插件日汇总、官方账单和原始调用样本，按模型/时段定位差额；95%日期超出预设误差即否定当前计价可用性。 详见[Q08](../../plugins/940842546--dsh-usage-billing/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/940842546--dsh-usage-billing/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1226490932-root"></a>

## [LeLogin for DeepSeek Harness](../../plugins/zcmilan--lelogin-skill/INSIGHT.md)



> **用途**：已授权 LeLogin 用户希望按账号运行本地凭据或 Web 应用流程。

> **亮点**：把凭据引用与 Profile 选择写成宿主可发现的工作流，减少引导用户直接粘贴秘密的需求。[Q01](../../plugins/zcmilan--lelogin-skill/INSIGHT.md#research-q01) [Q02](../../plugins/zcmilan--lelogin-skill/INSIGHT.md#research-q02)

> **思考**：注册器不强制批准或脱敏，真实数据边界取决于未核验的外部运行时和下游命令。[Q03](../../plugins/zcmilan--lelogin-skill/INSIGHT.md#research-q03)

> **建议**：对比带非敏感目标预览和本地审计的方案，核错号率与泄漏。尚未验证。[Q04](../../plugins/zcmilan--lelogin-skill/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/zcmilan--lelogin-skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-306829688-root"></a>

## [NocoBase](../../plugins/nocobase--nocobase/INSIGHT.md)

[![GitHub ★ 24,798](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=24%2C798&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nocobase/nocobase)

> **用途**：需要反复建设内部数据录入和审批系统的业务及技术团队可用平台组合数据、页面和流程；它是独立平台，不是 DSH 插件。[Q01](../../plugins/nocobase--nocobase/INSIGHT.md#research-q01)

> **亮点**：相对逐项手写业务 CRUD 与模型接口，平台将数据与角色权限、可视化配置和 AI 工作流工具纳入同一业务底座；模型和底层数据库并非本项目原创。[Q01](../../plugins/nocobase--nocobase/INSIGHT.md#research-q01) [Q02](../../plugins/nocobase--nocobase/INSIGHT.md#research-q02) [Q03](../../plugins/nocobase--nocobase/INSIGHT.md#research-q03)

> **思考**：ACL 入口和调用状态不能证明所有 AI 路径同权限，也不能保证外部动作可撤销；同用户缓存和以 get 命名推断自动调用需在真实配置下核验。[Q02](../../plugins/nocobase--nocobase/INSIGHT.md#research-q02) [Q04](../../plugins/nocobase--nocobase/INSIGHT.md#research-q04)

> **建议**：未验证假设：可信权限上下文版本驱动用户连接失效，并将业务操作 ID 与远端收据用于恢复对账；以现有 TTL、配置清理和调用状态为对照，测授权、重复写、误拒及恢复成本。[Q06](../../plugins/nocobase--nocobase/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/nocobase--nocobase/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1357268674-root"></a>

## [QQBot 增强版](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md)

[![GitHub ★ 221](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=221&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zaofan-make/dsh-qqbot) [![npm 30d 32,354](https://img.shields.io/static/v1?label=npm+30d&message=32%2C354&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zaofan/dsh-qqbot) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zaofan/dsh-qqbot)

> **用途**：在 QQ 内给 DSH 发任务并接收文件的使用者，可观察渠道桥的自动交付。

> **亮点**：[Q01](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q01) 把宿主交付事件衔接到当前 QQ 会话，省去重复标记或手动转发。

> **思考**：[Q03](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q03) 默认访问开放，选定命令的主人回调和群聊访问是两层。

> **建议**：[Q05](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md#research-q05) 对照按安排去重，测试带确认状态的去重和可控重试。

[查看完整分析](../../plugins/zaofan-make--dsh-qqbot/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1335241492-root"></a>

## [Univer Office](../../plugins/dream-num--dsh-univer-office/INSIGHT.md)

[![GitHub ★ 650](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=650&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dream-num/dsh-univer-office) [![npm 30d 46,073](https://img.shields.io/static/v1?label=npm+30d&message=46%2C073&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office)

> **用途**：DSH 用户希望在会话里生成、修改并审阅办公文件，按需交付常见格式。[Q01](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q01)

> **亮点**：连接 DSH 工具、Univer 协作进程与审阅视图，集中编辑与发布路径；引擎和文件格式能力由上游提供。[Q01](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q01) [Q02](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q02)

> **思考**：多进程草稿、导出和权限是否在真实宿主中可靠，收益能否超过格式保真和运维成本？[Q03](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q03) [Q04](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q04)

> **建议**：假设审批卡展示导出结构差异及抽样渲染可减少格式损失漏检；以固定文件集和审阅人比较漏检、误报及时间，若收益不足则否定。[Q05](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/dream-num--dsh-univer-office/INSIGHT.md) · [返回表格](#category-index)

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

2026-11-05
