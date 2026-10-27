# 办公与运营

[返回分类索引](INDEX.md) · [返回首页](../../../README.md)

工作记录、日程、团队用量与日常运营。

<a id="category-index"></a>

**同类比较**

> 比较表与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@awiki/dsh-plugin](#plugin-1334428397-root) | 将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 | 已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 |
| [BrowserSkill](#plugin-1276665883-root) | 通过 CLI 和浏览器扩展，让智能体使用现有 Chrome 或 Edge 登录状态执行网页任务。 | 需要利用既有网页登录态的用户可先在专用 profile 做读取任务，确认会话停止和借用页归还，再考虑有写入的工作；已有可靠 API 时先比较 API 路径。 |
| [BrowserSkill DSH 插件](#plugin-1276665883-packages-dsh-plugin-browserskill) | 为 DeepSeek Harness 提供 BrowserSkill 浏览器工具、任务预览与截图展示。 | 已用 DSH Web 的用户可从只读网页或测试表单试用，先核对 CLI 和扩展版本、技能显露、任务预览及结束清理，再扩展到实际工作流。 |
| [chicheng-stats](#plugin-1335725068-root) | DSH Web 全局用量统计、历史会话回填和可配置侧栏面板，附 DeepSeek 平台余额提示。 | 先禁用平台 token 导入，仅测本地统计并对账；再评估同源 API 和浏览器凭据边界；详见[Q03](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q03)。 |
| [dsh-feishu](#plugin-1418842530-root) | 以应用或用户身份把飞书主要办公 API 接入 DSH。 | 建议观察。 |
| [dsh-feishu-bot](#plugin-1346023250-root) | 通过飞书WebSocket操作DSH项目与会话，支持扫码绑定、聊天审批和完成通知。 | 观察，受信owner/允许群与最低权限Profile，审批/广播分别明确，未知投递不重放任务。 |
| [dsh-file-handover](#plugin-1422380986-root) | 将本地文件路径填入Windows原生文件框，按Win32/UIA/剪贴板回读并可确认，返回候选与动作记录。 | 先观察，单可见框probe+click=false人工核对。 |
| [dsh-im](#plugin-1334561781-root) | 把微信、飞书等 IM 渠道与多机器人接入 DSH，并提供会话同步和主动投递。 | 一个非敏感私聊、一个固定工作区、明确收件目标可受控试用；不将Matrix实验加密用于敏感内容。 |
| [dsh-invoice-tools](#plugin-1344714819-root) | 本地抽取电子发票PDF的XML/文本字段并作算术核对，汇总类别与重复提示，生成Markdown或xlsx.b64。 | 先观察；无敏感样票对照可继续研究，正式草稿也需显式files与原票复核，不把high或勾稽通过当放行。 |
| [dsh-md-annotator](#plugin-1335286261-root) | 在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。 | 建议有备份文稿的小范围试用，先验块引用/归属和冲突，结束前保存源码导出批注；复杂语法或导出不可靠时回外部编辑器。 |
| [dsh-msg-hub](#plugin-1335387524-root) | 把微信、QQ、飞书消息接入 DSH 会话，并提供主动推送与远程审批/状态功能。 | 远程批准应先停用或仅在严格可信单 peer 环境隔离评估，修复来源绑定后再用真实渠道；详见[Q02](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q02)、[Q03](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q03)。 |
| [dsh-notify-relay](#plugin-1385913707-root) | 把 DSH 生命周期事件经过去重、免打扰、摘要和重试规则转发到多种通知服务或 webhook。 | 先观察，在隔离接收器验证每类事件和部分通道失败，确认哪些内容会外发。 |
| [dsh-plugin-balance](#plugin-1340280087-root) | DSH Web 额度悬浮窗，整合多供应商查询、会话 token 统计与费用估算。 | 先禁自定义任意 URL，以假 key 试验并同官方账单对账；只把费用视为估算。 |
| [dsh-plugin-education](#plugin-1336663611-root) | 用edu_kit提供教案与题目骨架、测验结构检查、格式转换和成绩/计划统计，不替代教学内容审阅。 | 教师审阅下试用模板/转换，数值与答案复核后使用。 |
| [dsh-plugin-mission-control](#plugin-1337780031-integrations-deepseek-harness-dsh-plugin-mission-control) | 将 DSH 会话、消息与工具活动镜像到 JARVIS 看板，并把结束回合送入人工审查。 | 已有可信自托管JARVIS看板的用户可在无敏感信息的会话先试。 |
| [dsh-plugin-nlbi](#plugin-1343622602-root) | 把MySQL连接、Schema驱动Text2SQL、查询结果与BI报表接入DSH对话和侧栏。 | 先观察，优先修/核多入口策略与确认，DB原生权限兜底后再评估脱敏测试库。 |
| [dsh-team-cost](#plugin-1364961230-root) | 从 DSH 会话事件记团队 token/成本，提供成员预算、告警和报表。 | 隔离 profile 先固定成员路径、模型价和真实账单对照，测试崩溃/事件 replay/相邻路径，再考虑 alert；不要以此版结算或启用强制拦截。 |
| [dsh-usage-billing](#plugin-1333954586-root) | 监听本机 LLM 流量并按峰谷价持久化 token/费用，提供面板、预算告警、导出和余额查询。 | 只建议把它当预算观察工具，不用于报销或财务结算。 |
| [dsh-wsl-im](#plugin-1370460115-root) | 把多平台 IM 消息、媒体和聊天会话桥接到 DSH Agent，再把文本回复送回原聊天。 | 不按默认设置暴露真实 bot。 |
| [NocoBase](#plugin-306829688-root) | AI与可视化无代码业务平台，将数据模型、页面、权限、工作流及Agent工具组合。 | 有明确内部数据/审批场景及数据库治理能力的团队可在匿名隔离应用试用最小流程；先验两个角色所有入口权限及恢复，再接真实数据和外部写动作。 |
| [Reactive Resume](#plugin-249995750-root) | 开源简历与求职应用，组织编辑、导出、内容检查、AI建议及投递记录。 | 先以虚构/脱敏履历试用非AI编辑、导出和检查，验收权限与PDF再接模型；不用规则分替代事实或招聘效果判断。 |
| [赤诚推送 chicheng-push](#plugin-1335382133-root) | 统一管理多种推送渠道，通过设置页、pushNotifier服务和HTTP API发送任务通知。 | 观察，继续从本机认证、最小凭证/目标与脱敏内容及明确受理证据入手。 |

<a id="plugin-1334428397-root"></a>

## [@awiki/dsh-plugin](../../plugins/agentconnect--dsh-awiki/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

> **用途**：已经使用 AWiki 身份与通信、希望在 DSH 中处理消息的用户可用它把 AWiki 身份、私信、群聊、邮件、摘要与可选入站 Agent 监听接到 DSH 工具和 Web 界面；合格结果是操作绑定正确身份和租户，发送对象与内容经授权，收发结果和未知状态可追踪。详见[Q01](../../plugins/agentconnect--dsh-awiki/INSIGHT.md#research-q01)。

> **亮点**：整合独立身份和 IM Core、Host 公共 DTO、通信工具与界面，并增加会话/租户范围控制。它相对“在独立 AWiki 客户端收发消息，再人工复制给模型并把生成结果复制回去”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](../../plugins/agentconnect--dsh-awiki/INSIGHT.md#research-q03)。

> **思考**：可选入站监听会把外部消息触发 Agent；效果发生后再失败可能导致重放，且底层密钥、网络和租户服务不由本插件证明。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](../../plugins/agentconnect--dsh-awiki/INSIGHT.md#research-q04)。

> **建议**：未来可探索：可将入站消息ID、身份、租户和每个副作用阶段绑定到执行日志，对未知效果禁止自动重放。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](../../plugins/agentconnect--dsh-awiki/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/agentconnect--dsh-awiki/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1276665883-root"></a>

## [BrowserSkill](../../plugins/tencent--browserskill/INSIGHT.md)

[![GitHub ★ 9,474](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C474&color=yellow&logo=github&style=flat)](https://github.com/Tencent/BrowserSkill)

> **用途**：面对只有网页界面或已有登录态的办公系统，用户要让任意 shell 型智能体读取资料、填表或调查请求，同时保留人工接管。

> **亮点**：根产品将现有 profile 的网页操作变成带会话所有权、可见任务窗口与归还语义的跨宿主连接层，增量是人机交接与资源组织；DSH 工具呈现属于可选适配层。[Q01](../../plugins/tencent--browserskill/INSIGHT.md#research-q01) [Q03](../../plugins/tencent--browserskill/INSIGHT.md#research-q03)

> **思考**：Agent Window 共享普通 profile 的权限，不能视为账号沙箱；原生弹窗仍可激活，取消不回滚已发生的网页业务写入。[Q03](../../plugins/tencent--browserskill/INSIGHT.md#research-q03)

> **建议**：需要利用既有网页登录态的用户可先在专用 profile 做读取任务，确认会话停止和借用页归还，再考虑有写入的工作；已有可靠 API 时先比较 API 路径。[Q04](../../plugins/tencent--browserskill/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/tencent--browserskill/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1276665883-packages-dsh-plugin-browserskill"></a>

## [BrowserSkill DSH 插件](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md)

[![GitHub ★ 9,474](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C474&color=yellow&logo=github&style=flat)](https://github.com/Tencent/BrowserSkill) [![npm 30d 27,866](https://img.shields.io/static/v1?label=npm+30d&message=27%2C866&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin)

> **用途**：用户在 DSH 对话中处理网页资料、表单或调试任务，希望模型能调用浏览器且人在 Web UI 看到任务进展。

> **亮点**：六个域工具保留私有操作的取消、并发与呈现语义，配合技能按需显露和会话清理，使 DSH 原生接入比 shell 拼接更可管理；浏览器执行属于根产品。[Q02](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q02) [Q03](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q03)

> **思考**：CLI、扩展与插件需要协同升级；共享标签页的上下文协议不能代替用户对网页业务操作的授权，也不提供业务回滚。[Q03](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q03)

> **建议**：已用 DSH Web 的用户可从只读网页或测试表单试用，先核对 CLI 和扩展版本、技能显露、任务预览及结束清理，再扩展到实际工作流。[Q04](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1335725068-root"></a>

## [chicheng-stats](../../plugins/534119219--chicheng-stats/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-stats)

> **用途**：跨 Web/headless 会话查看 token 请求趋势、模型/提供方分布。

> **亮点**：把实时/历史用量与 Web 面板结合，详见[Q01](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q01)。

> **思考**：桌面 zstd 历史默认跳过、水位淘汰可重计，自动导入平台 token 经同源 API 返回给浏览器；详见[Q02](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q02)、[Q03](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q03)。

> **建议**：以稳定会话复合键和持久去重索引提升准确度，并将 token 导入限定到明确授权流程且不向浏览器返回原值；待验证，详见[Q02](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q02)、[Q03](../../plugins/534119219--chicheng-stats/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/534119219--chicheng-stats/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1418842530-root"></a>

## [dsh-feishu](../../plugins/2048lr--dsh-feishu/INSIGHT.md)

[![npm 30d 71](https://img.shields.io/static/v1?label=npm+30d&message=71&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feishu) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-feishu)

> **用途**：面向查询/更新飞书消息、文档、云盘、表格、多维表格和知识库的用户。输入是应用凭据或用户 OAuth、资源和动作；合格结果是预期身份访问正确租户，写可追踪且不泄露令牌。替代是 UI、SDK 或脚本。

> **亮点**：提供 DSH 原生身份、授权 UI、十领域工具和两代 Bitable 兼容；相对通用 MCP，token 留在 Host。飞书平台能力非插件贡献。 参见[Q03](../../plugins/2048lr--dsh-feishu/INSIGHT.md#research-q03)。

> **思考**：宽 scopes 和身份差异会越权/空结果；两代 API、分页、限流和 token 类型分叉。消息、文档、表格和上传都有协作可见副作用。 参见[Q04](../../plugins/2048lr--dsh-feishu/INSIGHT.md#research-q04)。

> **建议**：任务前生成身份、租户、scope、目标、预计 API 次数和写 diff；高风险写预览并幂等提交。若错身份/重复写不降则否定。 参见[Q08](../../plugins/2048lr--dsh-feishu/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/2048lr--dsh-feishu/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1346023250-root"></a>

## [dsh-feishu-bot](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-feishu-bot) [![npm 30d 884](https://img.shields.io/static/v1?label=npm+30d&message=884&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feishu-bot) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-feishu-bot)

> **用途**：从飞书远程操作本机DSH，需受信聊天及最低权限Profile。详见[Q01](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md#research-q01)。

> **亮点**：把扫码创建应用、WebSocket、项目/会话选择和一次审批接到DSH，省手接远程入口；交付仍为原Agent文本。详见[Q01](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md#research-q01)。

> **思考**：授权与审批按chat共享、空ACL放行，晚批准不绑定请求；内存去重、广播与失败写队列不能保证任务/收件人一致。详见[Q04](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md#research-q04)。

> **建议**：持久远程任务身份与callID/nonce/TTL审批、逐收件人投递收据，未知结果不重放，按同群错批/崩溃反例证伪。详见[Q07](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1422380986-root"></a>

## [dsh-file-handover](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md)



> **用途**：浏览器上传/应用打开文件需要跨到Windows原生文件框。详见[Q01](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q01)。

> **亮点**：把原生文件选择框环节接进模型工具，给回读与候选记录。详见[Q01](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q01)。

> **思考**：默认首结构匹配无PID/HWND绑定，路径回读仅子串兜底，确认消息不等应用接收且取消未传播。详见[Q03](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q03)、[Q04](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q04)。

> **建议**：研究目标租约、精确路径集合与应用回执，拒多候选并限制全局输入，比较误投/重复确认。当前未验证。详见[Q05](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1334561781-root"></a>

## [dsh-im](../../plugins/xmanrui--dsh-im/INSIGHT.md)

[![GitHub ★ 2,599](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C599&color=yellow&logo=github&style=flat)](https://github.com/xmanrui/dsh-im) [![npm 30d 66,600](https://img.shields.io/static/v1?label=npm+30d&message=66%2C600&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@xmanrui/dsh-im) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@xmanrui/dsh-im)

> **用途**：有机器人维护经验的用户可在IM私聊调用固定DSH工作区并接收结果。

> **亮点**：相对独立机器人脚本，把多渠道身份、DSH会话和主动投递组织到同Host服务；增量在交付编排与共享路由。见[Q01](../../plugins/xmanrui--dsh-im/INSIGHT.md#research-q01)。

> **思考**：unknown停止重试有明确保护，但发送成功到pending删除之间仍有崩溃窗口；多渠道权限与宿主认证不能由统一UI代替。见[Q02](../../plugins/xmanrui--dsh-im/INSIGHT.md#research-q02)。

> **建议**：未验证方向是将延迟交付attempt与已有receipt关联，重启先按幂等键和平台messageId对账；断响应/杀进程对照无改善则停止。见[Q05](../../plugins/xmanrui--dsh-im/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/xmanrui--dsh-im/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1344714819-root"></a>

## [dsh-invoice-tools](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-invoice-tools) [![npm 30d 419](https://img.shields.io/static/v1?label=npm+30d&message=419&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-invoice-tools) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-invoice-tools)

> **用途**：电子票据用户希望辅助抄录和报销草稿整理，真实票据与资格仍需独立核对。详见[Q01](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md#research-q01)。

> **亮点**：把本地票据字段抽取、缺失/算术提示与报销草稿输出接入DSH工具，减少人工搬运。详见[Q01](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md#research-q01)。

> **思考**：旧缓存无TTL/版本失效，低置信及重复均入合计；XML高置信非验真，解压无显式输出预算。详见[Q03](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md#research-q03)。

> **建议**：可研究源hash/规则版本批次清单与待审核集合，确认条目才结算，并在受限worker限解压预算。当前未验证。详见[Q06](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1335286261-root"></a>

## [dsh-md-annotator](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-md-annotator)

> **用途**：文稿审阅者需要将指向原文的意见交回模型，合格结果是批注正确、源码不误覆盖、报告进入正确草稿并由用户发送。详见[Q01](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md#research-q01)。

> **亮点**：将文件预览、块/选区批注、源码编辑与模型草稿连接，保留人对发送控制；增量是审稿交接而非新的Markdown标准。详见[Q01](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md#research-q01)。

> **思考**：原文件冲突保护不等批注永久保存，刷新/重启会失运行期草稿；复杂语法和无法唯一重锚只保留stale，需读者主动导出核对。详见[Q03](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md#research-q03)。

> **建议**：可研究绑定会话/文件版本的可恢复审稿快照，恢复仅作待核对草稿，用重载/改写/重复块比较错挂和敏感残留。当前未验证。详见[Q05](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1335387524-root"></a>

## [dsh-msg-hub](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub) [![npm 30d 1,164](https://img.shields.io/static/v1?label=npm+30d&message=1%2C164&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-msg-hub) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-msg-hub)

> **用途**：在 IM 中与 DSH Agent 会话、接收定时任务回复和远程审批通知。

> **亮点**：将三渠道收发、媒体、主动推送和远程监控整合到 DSH；详见[Q01](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q01)。

> **思考**：全局 pending 第一项可由任意经桥进入的 peer 的“批准”应答，/bind 也缺会话授权核对；详见[Q02](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q02)。 回传失败仍可返回ok，入站无全链deadline，处理完成不能当送达回执。

> **建议**：以 peer/session/callId 做严格关联并授权 /bind 可收窄远程批准风险；需双 peer 并发试验，详见[Q03](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1385913707-root"></a>

## [dsh-notify-relay](../../plugins/archaofan--dsh-notify-relay/INSIGHT.md)



> **用途**：面向离开 DSH 窗口仍需关注完成、失败和审批的用户，集中管理哪些事件进入个人或团队通知通道。

> **亮点**：相对单个通知转发器，插件在通道适配器上方增加是否发送、何时聚合与为何抑制的规则和日志，并持久保存失败队列，改变离线关注任务的交接方式。通道投递与客户端呈现仍由外部服务承担，不把发送请求当用户已收到。[Q01](../../plugins/archaofan--dsh-notify-relay/INSIGHT.md#research-q01)

> **思考**：成功回执及重试粒度决定规则是否减少打扰。deliverTo 仅用response.ok判断，未读取服务业务错误；outbox保存整条通知却不保存失败通道集合，drain调用默认channelsFor重发所有匹配通道，部分成功时可能重复推送。网络超时但远端已接受也无幂等回执，不能承诺一次送达。[Q02](../../plugins/archaofan--dsh-notify-relay/INSIGHT.md#research-q02)

> **建议**：未验证方向是每通知每通道保存独立投递状态和幂等键，适配器解析服务业务回执，重试只针对未确认通道。用A成功B失败、HTTP200业务失败和响应丢失矩阵比较现版，要求确认失败不被记成功且A不重复；若服务不支持幂等导致仍无法界定重复，应明确至少一次边界而不宣称严格一次。[Q03](../../plugins/archaofan--dsh-notify-relay/INSIGHT.md#research-q03)

[查看完整分析](../../plugins/archaofan--dsh-notify-relay/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1340280087-root"></a>

## [dsh-plugin-balance](../../plugins/andrew111888--dsh-plugin-balance/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/Andrew111888/dsh-plugin-balance) [![npm 30d 1,245](https://img.shields.io/static/v1?label=npm+30d&message=1%2C245&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-balance) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-balance)

> **用途**：个人/团队粗看供应商余额、DSH 消耗和预算趋势，需与正式账单分开。

> **亮点**：把额度和 DSH 会话事件统一展示、按模型/日期做本地估算。详见[Q02](../../plugins/andrew111888--dsh-plugin-balance/INSIGHT.md#research-q02)。

> **思考**：自定义 baseUrl 由请求提供、key 由宿主凭据解析并以 Bearer 发给该地址，缺源绑定与组件内访问控制。详见[Q03](../../plugins/andrew111888--dsh-plugin-balance/INSIGHT.md#research-q03)。

> **建议**：将供应商域名与密钥引用管理员绑定、隔离缓存、价目注明版本可提高安全和对账可信度；尚未实现。详见[Q05](../../plugins/andrew111888--dsh-plugin-balance/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/andrew111888--dsh-plugin-balance/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1336663611-root"></a>

## [dsh-plugin-education](../../plugins/863683348--dsh-plugin-education/INSIGHT.md)

[![npm 30d 940](https://img.shields.io/static/v1?label=npm+30d&message=940&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-education) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-education)

> **用途**：教师/助教准备材料与常规算表，模型创作而插件做结构和计算。详见[Q01](../../plugins/863683348--dsh-plugin-education/INSIGHT.md#research-q01)。

> **亮点**：把模板、格式和统计接入模型工具减少手排手算。详见[Q01](../../plugins/863683348--dsh-plugin-education/INSIGHT.md#research-q01)。

> **思考**：重复items覆盖quiz schema，超满分/零阈值与分箱可能误导，题目和难度标签需人工复核。详见[Q03](../../plugins/863683348--dsh-plugin-education/INSIGHT.md#research-q03)。

> **建议**：按action契约/域校验/剩余需求形成可解释结果，比较教师校正与误算，当前未验证。详见[Q05](../../plugins/863683348--dsh-plugin-education/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/863683348--dsh-plugin-education/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1337780031-integrations-deepseek-harness-dsh-plugin-mission-control"></a>

## [dsh-plugin-mission-control](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/Asif2BD/JARVIS-Mission-Control-DeepSeek) [![npm 30d 809](https://img.shields.io/static/v1?label=npm+30d&message=809&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-mission-control) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-mission-control)

> **用途**：面向想在独立JARVIS看板观察DSH多个会话、并由人确认完成的用户。合格结果是看板可定位对应会话、活动和待审状态，而任务是否真正满足需求仍由人工验收。原来需手动写任务状态，此插件把session建任务、消息和工具事件变活动日志，将正常turn结束送REVIEW，保留人从REVIEW批准DONE的责任。它是事件镜像集成，不是新的agent调度或交付验证器。

> **亮点**：[Q01](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md#research-q01) 与 [Q02](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md#research-q02) 的贡献是把会话状态转成独立看板可审阅的工作流，并保留REVIEW到DONE的人类责任。真实调度和质量验证仍不属于这个镜像组件。

> **思考**：[Q03](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md#research-q03) 表明队列清空可包含失败丢弃，flush不证明送达；未知reason会默认REVIEW，重启跨日还可能重复任务。因此核心价值应限定best-effort可见性，不能宣传完整审计。

> **建议**：[Q05](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md#research-q05) 提出稳定事件幂等键、持久outbox及确认水位，未验证；以丢失、重复、错状态与flush延迟共同检验，不能只看最终队列为空。

[查看完整分析](../../plugins/asif2bd--jarvis-mission-control-deepseek--integrations-deepseek-harness-dsh-plugin-mission-control/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1343622602-root"></a>

## [dsh-plugin-nlbi](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi) [![npm 30d 899](https://img.shields.io/static/v1?label=npm+30d&message=899&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi)

> **用途**：已有MySQL库的分析者希望自然语言查数并复用SQL/图表，需正确口径和原生权限范围。

> **亮点**：在dsh-mysql底座上连接Schema、模型生成、校验执行与BI展示，贡献在流程接线而非新SQL/图表算法。详见[Q02](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md#research-q02)。

> **思考**：生成链校验后直接查库并非待确认草稿，行列权限配置未在主query/Text2SQL/rerun执行链强制，不能视为数据隔离。详见[Q03](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md#research-q03)。

> **建议**：可探讨统一查询计划与策略收据，绑定主体/连接/SQL/版本并对所有入口强制策略和明确确认；语义改写与迁移成本未验证。详见[Q06](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1364961230-root"></a>

## [dsh-team-cost](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1569126506-sudo/dsh-team-cost)

> **用途**：共用 DSH 主机的团队需看成员/模型消耗并控制预算。

> **亮点**：把会话事件的 token 桶汇入成员/模型/天账本并连接预算通知、工具报告和看板；较单会话用量视图形成团队管理入口。详见[Q01](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md#research-q01)。

> **思考**：rollup 不从 JSONL 重建，崩溃/缺缓存可少报；归因纯前缀可串成员，未知模型费用为 0，CSV 按天导出丢成员/模型。见[Q02](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md#research-q02)、[Q03](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md#research-q03)。 正确价/无崩溃也只是事后计量，无并发在途预留；团队全量报表访问依宿主外层授权。

> **建议**：现版声明 JSONL 真相源却不重建/去重，未知价零与路径前缀错归；若按 sid+seq 重建、缺价标 unknown、身份/路径段归因，或可降漏计/误拦，但增启动/管理成本。故障、重复、相邻路径和未知模型对照事件/账单；若误差不降或成本超阈值即证伪。详见[Q05](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1333954586-root"></a>

## [dsh-usage-billing](../../plugins/940842546--dsh-usage-billing/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-usage-billing) [![npm 30d 1,051](https://img.shields.io/static/v1?label=npm+30d&message=1%2C051&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-billing) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-usage-billing)

> **用途**：频繁使用 DeepSeek 模型的个人或团队希望按会话、模型、日期追踪 token 和估算费用，基线是手工导出日志乘官方单价。合格结果是每次调用只计一次、时区/节假日/模型档位正确、共享文件不丢写，估算与官方账单在定义误差内可对账。 详见[Q01](../../plugins/940842546--dsh-usage-billing/INSIGHT.md#research-q01)。

> **亮点**：相对表格手算，它把实时采集、历史回填、价格分段、预算告警和会话导航整合进 DSH。价值是本地可见性而非正式账单；模型按名称子串归类、价格表与节假日需要持续维护，多实例共享文件会互相覆盖。 详见[Q03](../../plugins/940842546--dsh-usage-billing/INSIGHT.md#research-q03)。

> **思考**：核心质疑是估算准确性。llm/stream 事件缺失/重复、历史回填去重、模型别名、价格变更、法定调休和汇率都可能偏差；官方余额只是账户总额，不能反证插件按会话分摊正确。若用户把估算当财务账单，错误告警会误导预算决策。 详见[Q04](../../plugins/940842546--dsh-usage-billing/INSIGHT.md#research-q04)。

> **建议**：未验证假设是从官方账单抽取每日总额做只读校准，并显示“覆盖率/差额”而非单一费用，可防止估算被误当账单。最小实验连续30天比较插件日汇总、官方账单和原始调用样本，按模型/时段定位差额；95%日期超出预设误差即否定当前计价可用性。 详见[Q08](../../plugins/940842546--dsh-usage-billing/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/940842546--dsh-usage-billing/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1370460115-root"></a>

## [dsh-wsl-im](../../plugins/173787247--dsh-wsl-im/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-im)

> **用途**：希望从飞书、企微、钉钉、QQ、Slack、Discord、Telegram 或 Mattermost 远程访问 DSH。

> **亮点**：把现有 DSH Agent 工具能力带到多个聊天入口，支持工作区与多媒体转接。详见[Q01](../../plugins/173787247--dsh-wsl-im/INSIGHT.md#research-q01)。

> **思考**：requireAllowlist 默认关闭、空名单放行，Agent 默认 danger-full-access；权限设置失败仍继续。这使远程聊天可能驱动宿主工具。详见[Q02](../../plugins/173787247--dsh-wsl-im/INSIGHT.md#research-q02)。

> **建议**：把白名单与最小权限设为默认 fail-closed，并验证各平台身份/附件/权限矩阵后再开放真实 bot；现版未实现。详见[Q04](../../plugins/173787247--dsh-wsl-im/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/173787247--dsh-wsl-im/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-306829688-root"></a>

## [NocoBase](../../plugins/nocobase--nocobase/INSIGHT.md)

[![GitHub ★ 24,708](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=24%2C708&color=yellow&logo=github&style=flat)](https://github.com/nocobase/nocobase)

> **用途**：面向反复构建内部CRUD/审批系统的业务团队；完整平台基础设施，非DSH插件。[Q01](../../plugins/nocobase--nocobase/INSIGHT.md#research-q01)

> **亮点**：相对任意LLM脚本写库或手工CRUD，把Agent接到已有数据、动作权限和业务工作流中，与人共同配置同一底座；核心增量是业务集成，非新模型算法。[Q02](../../plugins/nocobase--nocobase/INSIGHT.md#research-q02)

> **思考**：有ACL和user-context连接不等每个AI路径已验证同权限；仅用户ID的MCP缓存、done状态和数据库事务不能独立保证角色撤销及时生效或外部动作exactly-once。[Q03](../../plugins/nocobase--nocobase/INSIGHT.md#research-q03)

> **建议**：未验证假设是绑定权限上下文版本、流程ID和外部收据并按权限变更失效缓存，减少陈旧授权和重复动作；跨角色/撤销/中断对照，无错误与恢复改善则否定。[Q05](../../plugins/nocobase--nocobase/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/nocobase--nocobase/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-249995750-root"></a>

## [Reactive Resume](../../plugins/reactive-resume--reactive-resume/INSIGHT.md)

[![GitHub ★ 44,843](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44%2C843&color=yellow&logo=github&style=flat)](https://github.com/reactive-resume/reactive-resume)

> **用途**：面向反复按岗位调整履历、求职信及跟踪投递版本的用户；独立应用，MCP可供Agent连接。[Q01](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q01)

> **亮点**：相对Word加独立岗位表，将结构化履历、设计/检查和投递文档组织在同流程，并以Schema/JSON Patch暴露Agent接口；不证明招聘结果改善。[Q01](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q01)

> **思考**：规则分数/关键词匹配不等跨ATS兼容或录用概率，AI分隔符封装不保证事实与指令安全，保存接口存在也不等离线恢复已验收。[Q02](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q02) [Q03](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q03)

> **建议**：未验证假设是用导出PDF文本顺序和履历事实差异作AI修改放行门，降低最终文档错误；同履历/岗位对照错误与修正时间，无改善则否定。[Q04](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/reactive-resume--reactive-resume/INSIGHT.md) · [返回比较表](#category-index)

<a id="plugin-1335382133-root"></a>

## [赤诚推送 chicheng-push](../../plugins/534119219--chicheng-push/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-push)

> **用途**：已有后台任务/脚本需要通知出口，不自带任务监听或调度。详见[Q01](../../plugins/534119219--chicheng-push/INSIGHT.md#research-q01)。

> **亮点**：把常见通知适配、配置表单与host/HTTP出口统一，减少其他任务插件重复接多服务商。详见[Q01](../../plugins/534119219--chicheng-push/INSIGHT.md#research-q01)。

> **思考**：Host围栏不是对端认证且list回明文secret，部分HTTP失败可误记已发；未持久确认/无幂等不能作为可靠到账证明。详见[Q02](../../plugins/534119219--chicheng-push/INSIGHT.md#research-q02)。

> **建议**：将目标授权/凭证服务与每渠道受理状态、稳定ID/outbox及unknown恢复结合，用假ack/超时/重复/存储失败反例证伪，未验证。详见[Q06](../../plugins/534119219--chicheng-push/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/534119219--chicheng-push/INSIGHT.md) · [返回比较表](#category-index)

[返回分类索引](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-10-27
