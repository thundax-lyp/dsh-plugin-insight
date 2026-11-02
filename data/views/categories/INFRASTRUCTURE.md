# 基础设施

[全部分类](INDEX.md) · [返回首页](../../../README.md)

模型接入、认证、运行环境与系统支撑。

<a id="category-index"></a>

**同类比较**

> 比较表与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@sueleven/dsh-auto-update](#plugin-1428034710-root) | 启动时检查已下载并启用的npm插件，展示新版并在确认后调用DSH官方通道更新。 | 先观察作更新候选，核Windows环境与路由、备份后才隔离验批量；不在生产profile依旧提示直接全更。 |
| [Almost Full Access](#plugin-1336031182-root) | 在DSH完全访问预设上，为部分命名shell工具加入确定性/子代理审查、人工审批面板和命令记忆。 | 日常安全权限用途不推荐；只保留无敏感权限的隔离研究边界。 |
| [ANOLISA](#plugin-1195873793-root) | 为 Agent 环境提供上下文优化、技能、工作区恢复、安全和观测组件的系统软件栈。 | [Q04](../../plugins/agentic-os-org--anolisa/INSIGHT.md#research-q04) 仅对已能维护运行环境和保留原文的开发者，建议以任务副本小范围试用所查压缩链路；内容丢失、取回失败或净成本不降就停用。 |
| [Browser4](#plugin-124882400-root) | 通过 Rust CLI 和浏览器后端提供网页交互与批量提取。 | [Q04](../../plugins/platonai--browser4/INSIGHT.md#research-q04) 从隔离只读站点开始，写操作状态不明时人工核查。 |
| [Bruce Awesome DSH Plugins](#plugin-1333144072-root) | 整理 DSH 插件目录，并生成核实 npm/Git 安装目标的官方发现页订阅索引 | [Q04](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md#research-q04) 可先作候选线索，独立profile只试一个任务相关目标；来源、权限或兼容不清就回上游核实，不批量安装。 |
| [chicheng-gate](#plugin-1334862230-root) | 以密码门禁、反向代理和 frpc 隧道把 DSH 暴露到远端。 | 当前不建议采用；不要在持有代码、凭据或生产访问权的 DSH 上暴露，优先使用 VPN/SSH 并等待独立安全审计。 |
| [ClawMetry](#plugin-1156882085-root) | 读取 Agent 会话与运行日志，统一展示时间轴、工具事件及可得用量的观测工具 | [Q04](../../plugins/vivekchand--clawmetry/INSIGHT.md#research-q04) 已有OpenClaw数据者可对照原JSONL条件试读；本目录DSH用途先观察，未核Pro适配前不采用其健康/控制判断。 |
| [DeepSeek Harness](#plugin-1333065091-root) | 基于插件组合提供 Agent 运行、工具调用、会话和交互的开源宿主。 | 适合有 Agent 扩展需求的开发者先在隔离 profile、固定模型和小任务上验收；服务缺失、非预期写入或重启不一致时停止并回到已知配置。 |
| [DeepSeek Harness Channel BCN](#plugin-1290565606-apps-bcs-crates-plugins-deepseek-harness-channel-bcn) | 将 DeepSeek Harness Agent 接入 Avernet Bot Collaboration Network。 | [Q04](../../plugins/inclusionai--avernet--apps-bcs-crates-plugins-deepseek-harness-channel-bcn/INSIGHT.md#research-q04) 先在受控服务和兼容宿主用低敏消息试通，并对照终态；异常时双方核查后再处理。 |
| [DeepSeek Harness Studio](#plugin-1334747723-root) | 将 Harness 打包为桌面工作区，提供插件需求检索、确定版本安装和事务恢复界面。 | 首次要安装完整Studio、配置模型和选择profile，迁移既有插件时需记录原版本与数据；候选自然语言搜索另产生模型与npm网络成本。 |
| [DeepSeek Harness Tauri Desktop](#plugin-1333718792-root) | 提供 DSH 桌面界面、内核与运行时管理和数据迁移。 | 在副本上验证核心、插件与关键数据；失败停止切换并核验备份。 |
| [DSH Better Sidebar](#plugin-1326893710-root) | 为 DSH 提供会话侧栏与底部工作台，支持文件、编辑器、Git 和扩展页面。 | [Q06](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q06) 建议已确认宿主版本的开发者先用低权限宿主和可丢弃目录试读、编辑；若实际路径不符或需要工作目录隔离，停止并回到 IDE。 |
| [DSH Codex Subscription](#plugin-1333528857-root) | 将 Codex 订阅授权与可选连接器等能力接入 DSH。 | [Q05](../../plugins/wsl043--dsh-codex-subscription/INSIGHT.md#research-q05) 在隔离 profile 先试单模型，权限不明时回原生入口。 |
| [DSH Connect WorkBuddy](#plugin-1349641014-root) | 将本机 WorkBuddy 账号和模型接入 DeepSeek Harness。 | [Q05](../../plugins/dingminhua--dsh-connect-workbuddy/INSIGHT.md#research-q05) 建议仅在允许该接入方式的隔离配置下核对账号、请求和预算；费用、凭据或输入变化不明时停止并回退。 |
| [DSH Cost Meter](#plugin-1333235870-root) | 统计 DSH 会话模型用量及估算费用，并提供预算、历史与额度信息。 | [Q06](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q06) 建议先对照少量已知调用，遇到缺记录或未知价格即停止将本地金额作为费用依据，回看供应商账单。 |
| [DSH Desktop](#plugin-1333321333-root) | 将 DeepSeek Harness 的本地 Web 界面、Host 和插件系统集成到原生桌面应用。 | [Q05](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q05) 建议使用隔离账户与数据根试单项任务，检查网络范围和退出；数据归属或恢复不明确时保留原备份并回到现有 CLI 或 Web。 |
| [DSH Market](#plugin-1333807290-root) | 在 DeepSeek Harness 中浏览社区插件，并管理安装、更新和配置。 | [Q06](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q06) 建议维护多个插件且已备份 profile 的用户先在隔离副本试装；发现取消后状态不清或无法恢复时停止并退回宿主 Discover 与 CLI。 |
| [DSH Plugin Manager](#plugin-1331636953-packages-dsh-plugin-manager) | 在 DSH 官方插件页面检查更新与兼容声明，并提供更新和重启入口。 | 熟悉 profile 的维护者先在备份过的可弃置环境试更新一个可信非关键包；版本、目标或恢复不明时停下并人工核对，再用官方固定版本命令和回归。 |
| [DSH Plugin Radar](#plugin-1323404274-root) | 收集 DSH 插件候选，归并兼容性记录并发布可浏览目录与机器可读数据。 | [Q04](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q04) 先按固定提交读取少量候选，再回原仓核对版本和权限；数据日期或逐条证据不明时停止自动安装并人工查找。 |
| [DSH RotaKit](#plugin-1387227102-root) | 把本机 WorkBuddy/CodeBuddy 账号组成模型池，提供 Chat、Responses、Messages 本地代理与积分状态。 | 建议观察，本人账号与明确上游条件下隔离验证实际客户端闭环和积分成本；不以返回码或余额面板单独判断可用。 |
| [DSH SSH](#plugin-1331636953-packages-dsh-ssh) | 在 DSH 中管理 SSH 主机，并提供远端命令、终端、文件传输与隧道。 | [Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md#research-q05) 建议熟悉 SSH 的用户只在隔离测试机和独立 home 试用人工审核的只读命令；要求 host key pin 时使用现有 SSH 方案。 |
| [DSH XD Pool](#plugin-1356951582-root) | 将自有 WorkBuddy 多账号与可选渠道接入 DSH，按额度和失败分类换号，并提供路由与网关。 | 有限试主池，使用自有账号、非敏感任务，默认关闭网关/积分/额外链路，核实际状态后再扩。 |
| [DSH 订阅模型适配插件](#plugin-1333964468-root) | 将多个订阅 provider 的账号与可选候选池接入 DSH。 | [Q04](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md#research-q04) 先限定候选可接收数据范围，状态不明则停池回直连。 |
| [dsh-anatomy-panel](#plugin-1366089972-workspace-plugins-dsh-anatomy-panel) | 从 Agent-Body 运行时文件实时展示器官体征、心跳和脉冲的宿主网页。 | 限隔离本机开发 Host 观察，不能作为独立健康判据；共享可达环境应先核认证、渲染和来源状态。 |
| [dsh-api-dashboard](#plugin-1346196699-root) | 在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。 | 可信单用户本地试用，限定Key接收方和刷新，未知模型先缺价核查，估算与官方账单分开，更新优先宿主管理器。 |
| [dsh-cap-profile](#plugin-1349267122-root) | 扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。 | 先确认面板显示真实数据，再选数份脱敏会话核对调用、模型和错误归属；用它缩小排查范围。 |
| [dsh-clean-desktop-shell-pro](#plugin-1389469406-root) | 将 DSH web profile 包装为 Electron 桌面壳，并增加后端自动启动、托盘退出选择与运行时准备。 | 隔离桌面 profile 分别验本地/远程、离线下载、托盘退出与升级后再替换原版。 |
| [dsh-compaction-route](#plugin-1391040578-root) | 在 DSH 设置页选择会话压缩摘要模型，并配置终止错误后的备用模型。 | 适合能保留原会话并复核摘要的长会话维护者限范围试用。 |
| [dsh-deepseek-web-login](#plugin-1364181676-root) | 以网页版登录态向 DSH 提供 DeepSeek 模型，桥接流式回答、图片和提示词工具调用。 | 先观察。 |
| [dsh-device-bridge](#plugin-1384810806-root) | DSH 工具将 Companion v1 健康检查和动作调用转给手机/IoT/薄 Agent。 | 仅隔离网络、低风险动作且设备端认证明确时观察；危险动作须先审共享库及设备实现。 |
| [dsh-find-plugin](#plugin-1333689922-root) | 在 DSH 对话中搜索插件仓库，补充目录描述和安装命令，并在在线搜索失败时回退目录关键词匹配。 | [Q03](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md#research-q03) 把工具当候选入口，读来源note并回仓库核固定提交、兼容与权限。 |
| [dsh-gov](#plugin-1336647931-root) | 为DSH提供规则式工具allow/deny/ask、JSONL审计查询与按Agent累计token的预算警告。 | 观察，只作可信单用户辅助诊断继续探讨，强权限/预算/审计在宿主受权面另保证。 |
| [dsh-llm-balance](#plugin-1366370702-root) | 在DSH常驻卡片显示DeepSeek/Moonshot余额与Kimi/OpenCode订阅窗口，按源缓存并保留失败旧值。 | 先观察；可信个人单账号route对照，限定sources并明确OAuth写回，默认先禁token持久化。 |
| [dsh-mcp-tunnel](#plugin-1344713826-root) | 将本地 HTTP MCP 端点经 Docker/Cloudflare Quick Tunnel 暴露，并生成待确认的 DSH MCP Client 配置。 | 仅可在无敏感数据的隔离测试环境验证。 |
| [dsh-model-auto-enricher](#plugin-1425159954-root) | 按名称规则批量补齐DSH模型配置，提供预览、自动写入、备份和停用入口。 | 不推荐默认自动；只读/复制profile研究不等真实渠道可靠采用。 |
| [dsh-model-channel-manager](#plugin-1358316691-root) | 管理 DSH 模型渠道和轮询组，提供故障转移、模型测试、测速及健康统计界面。 | 在固定RC和受控额度下先用等价候选试用，验收首内容前切换、内容后失败只终止一次、用户取消及重启不重放测试。 |
| [dsh-model-info-fill](#plugin-1358816037-root) | 从models.dev按模型名补自定义供应商缺失容量、图片和思考声明，展示冲突、未匹配与旧猜档待确认。 | 先观察；个人有备份profile关自动补，目录同步完成后逐项手动审阅再补，实际供应商优先。 |
| [dsh-model-manager](#plugin-1349266980-root) | 在 DSH 管理本地推理服务、参数 Profile、GPU 检测和性能测试。 | 先在隔离端口登记已有服务、保存参数并核对测速口径。 |
| [dsh-ollama-cloud](#plugin-1394197658-root) | 接入 Ollama 云端或本地模型，动态发现模型与推理档位，并显示云端用量。 | 适合已有Ollama凭据且可锁宿主版本的用户，以短文本和一个可丢弃工具任务试接入。 |
| [dsh-opencode-zen-plugin](#plugin-1402771540-root) | 把 OpenCode Console 对话模型接入 DSH 的四协议 LLM adapter，附设置卡与模型目录刷新。 | 先隔离试用单个获授权模型，再做四协议/工具/图片/错误矩阵；保护本地诊断文件。 |
| [dsh-openviking-enhance](#plugin-1401255267-root) | 把 OpenViking Studio、会话记忆提交状态与当前召回详情接入 DSH 界面。 | 在可信个人单机和非敏感会话受控试用，先把一份归档差异与直接API核对；身份或连接不符立即退回直接查询。 |
| [dsh-permissions](#plugin-1335349535-root) | 在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。 | 有明确威胁模型、能维护规则和保留宿主沙箱的团队可在非生产 profile 试用；先用只读/模拟工具跑对抗集，再启用 hard 保护真实路径。 |
| [dsh-plugin-loopback-trust](#plugin-1394489199-root) | 在反代域名网页上将连接标为 host-owning，以恢复 DSH 设置的 Host 持久化。 | 仅受控反代部署且双层授权明确时试用；先查官方 trusted-host，验未授权浏览器被拒。 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。 | 能备份profile并理解guard重启的维护者可在可丢弃环境小范围试用，先只读发现再评估已审查候选；报告/脚本不清或快照提前消失就停止后续安装。 |
| [dsh-plugin-manager](#plugin-1334267268-root) | 在 DSH 设置中展示插件中文用途与备注，并提供启停、目录覆盖及配置备份导入导出。 | 建议观察，在副本先核对owner权限、全局影响和锁占用/中断恢复，确认后再定义小范围试用；关键配置保留独立备份。 |
| [dsh-plugin-proxy](#plugin-1374274543-root) | 为DSH提供直连、系统及HTTP/SOCKS手工代理设置，切换Undici全局路由并可导出子进程环境。 | 可信单一管理者且允许失败回原出口可试用。 |
| [dsh-purge Community](#plugin-1421822085-root) | 集中管理 DSH 提示注入、宿主补丁、自检与备份回滚。 | 只在授权隔离实例核对补丁、完整状态和回滚；依赖原生控制的日常环境保留原配置。 |
| [dsh-reasoning-tiers](#plugin-1367305514-root) | 按模型知识规则补齐pi-ai推理档位声明，并提供模型上下文、输出与图片能力编辑页。 | 先观察，关闭自动写并备份，先修最终写集/撤销失败保留，再评估单profile单模型。 |
| [dsh-recipe](#plugin-1336583700-root) | 把本地场景配方展开成去重插件清单和安装命令，支持关键词搜索与多配方组合。 | 作为选型草案试用，补齐profile/版本/配置再执行。 |
| [dsh-remote-ssh-run](#plugin-1384810201-root) | 在 DSH 中对配置主机执行白名单 SSH 命令。 | [Q04](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q04) 用隔离测试机与低权限账户预核 host key，只运行审查过的只读探针；未知状态先查远端。 |
| [dsh-repeat-stop](#plugin-1339262076-root) | 在 DSH 工具执行前，按 Agent 对连续相同工具和参数的调用计数，并拒绝超过阈值的调用。 | [Q04](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md#research-q04) 当前观察，先核对宿主消息窗口和双钩子对象身份；确认后只在可丢弃任务检查阈值与合法等待。 |
| [dsh-router-loomy](#plugin-1376777535-root) | 将 Loomy 云端 Chat Completions 通道接入 dsh-router，自动读本机客户端登录态。 | 隔离 profile/模拟上游完成协议和脱敏验证，再以授权账户小流量试用。 |
| [dsh-sakurafrp](#plugin-1365163902-root) | 在 DSH 中管理现有移动网关，提供链路状态、开关、配对二维码、设备撤销与自愈入口。 | 先观察，并在隔离链路验证关闭后跨重启仍关闭、标记不可写有明确失败、非3080端口不操作别的实例。 |
| [dsh-skill-mcp-panel](#plugin-1333673564-root) | 在 DSH 侧栏与 dsh-panel 命令行管理工作区技能及 profile 的 MCP 服务器配置。 | [Q04](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q04) 可在完整备份和临时作用域中试用管理便利，先只读再导入可丢弃Skill；测试MCP前核对命令/地址/表达式。 |
| [dsh-sysmon](#plugin-1334434271-root) | DSH Web 悬浮显示宿主 CPU、内存与根文件系统使用率。 | Linux 单宿主仅作辅助观察；正式容量/告警仍用现有监控，试点时注入采样失败并确认 stale 状态。 |
| [dsh-telemetry-redactor](#plugin-1333368566-root) | 在DSH遥测记录导出副本中替换受支持的敏感键和凭据模式，保留原始会话日志。 | 已有遥测需求且可审计监听器顺序的维护者可小范围试用，先用合成凭据核对后端副本、canonical与拒绝记录；不能借此主动扩大共享，遇绕过或无法发现的误删就停止依赖。 |
| [dsh-token-bi](#plugin-1428375235-root) | 汇总 DSH 本机会话 token，用日期、模型、工作目录、调用树和逐轮明细查看用量。 | 先选含搜索、标题与重试的脱敏会话，逐桶核对官方投影，再测试冷日志追加后的刷新。 |
| [dsh-token-stat](#plugin-1348535666-root) | 读取DSH会话日志累计token用量，按模型和日期展示，并保留报告及归档账本。 | 建议需长期用量趋势的维护者受控试用并核对多入口一致性；暂不用于财务结算或精确账单。 |
| [dsh-tool-budget](#plugin-1350325873-root) | 为 DSH Agent 的工具调用设置按对象计数的上限。 | [Q04](../../plugins/173787247--dsh-tool-budget/INSIGHT.md#research-q04) 先在隔离会话校验计数与过滤，把它作为附加提示而非资金预算。 |
| [dsh-tool-explorer](#plugin-1351594249-root) | 在DSH Web集中浏览、编辑、安装与切换技能，管理和探测MCP服务器。 | 观察，先备份技能/lock/patch，受信本机可继续核展示与独立开关，避免唯一bundle直接改名升级。 |
| [dsh-tts-flash](#plugin-1363291561-root) | DSH 桌面端流式回复语音朗读与等待短语播放插件，支持 Edge 和云端 TTS。 | 先在隔离桌面试听 Edge，再用受控云密钥验证长回复、中断、权限与费用。 |
| [dsh-ui-auth](#plugin-1343420855-root) | 为 DSH Web 提供账户登录、用户管理、TOTP/Passkey、会话授权及按用户模型配置。 | 建议观察，先固定目标宿主完成可达面和状态恢复核查；互不信任用户还需独立系统权限边界，不能把登录页当隔离验收。 |
| [dsh-usage-dashboard-plus](#plugin-1334023305-root) | 在DSH侧栏显示DeepSeek余额和日志估算消费，并汇总外部视觉调用与每会话模型/延迟统计。 | 先观察，可信单用户只作趋势对照。 |
| [dsh-vps](#plugin-1377159975-root) | 为自有 VPS 部署带登录网关、HTTPS 和服务管理的 DSH。 | 先在隔离 VPS 钉所有文件来源、演练令牌缺失/备份失败/回滚，并对照原生隧道或手工部署；正式公网持续采用需独立安全及恢复验收。 |
| [dsh-web](#plugin-1331636953-root) | 面向 DeepSeek Harness Web GUI 的模块化插件与主题集合。 | [Q05](../../plugins/zhu1090093659--dsh-web/INSIGHT.md#research-q05) 建议备份并在隔离 profile 先核实来源和所需行；版本、权限或恢复状态不明时暂停并改用按需安装。 |
| [dsh-web-all](#plugin-1331636953-packages-dsh-web-all) | 将 DSH Web 家族插件组合为可按行配置的聚合安装包。 | [Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md#research-q05) 建议备份并在隔离 profile 核对所需行和权限；版本或副作用不明时停止并恢复或改按需安装。 |
| [dsh-web-lan-access](#plugin-1334255288-root) | 通过替换 WebServer 让 DSH Web 监听所有接口、自动信任接口 IP 并给远程浏览器 Host 能力。 | 默认不推荐。 |
| [dsh-web-restart](#plugin-1335060007-root) | Windows DSH Web 的侧栏重启按钮，调用硬编码 PowerShell 外部脚本。 | 暂不直接采用；只在隔离 Windows 复核脚本、授权和失败状态后考虑。 |
| [dsh-workspace-tools](#plugin-1363511446-root) | 按已注册工作区为新根会话自动选择 Agent 与权限预设的设置页和事件监听器。 | 先在低权限工作区限定试用；全权限规则和大小写敏感环境先验证匹配及首 turn 顺序。 |
| [dsh-wsl-clock](#plugin-1351854066-root) | 提供 clock_doctor 工具，诊断 WSL 与 Windows UTC 时间偏移。 | [Q04](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md#research-q04) 只读试用并手工交叉核对，不自动重启；不一致回原诊断。 |
| [dsh-wsl-compose](#plugin-1381842592-root) | 为 DSH 提供 Docker Compose 状态、容器列表、日志与可选 up/down 的本机运维工具。 | 默认只读并限制项目根；变更前后用宿主人工审批和 ps 对账，超时不盲重试。 |
| [dsh-wsl-db](#plugin-1381859591-root) | 经 psql/redis-cli 为 DSH Agent 提供 PostgreSQL 与 Redis 连通性和查询工具。 | 仅隔离测试库、最小权限账号试用；生产库不直接采用。 |
| [dsh-wsl-defender](#plugin-1391141174-root) | 从 WSL 查询 Windows Defender、防篡改、Firewall 与近期威胁状态。 | 仅适合 WSL 内做初步、只读环境诊断的技术用户观察，不能替代安全产品、合规审计或自动修复。 |
| [dsh-wsl-dns](#plugin-1351854118-root) | 提供 dns_doctor，对照 WSL 与 Windows 的 DNS IPv4 解析和 resolv.conf。 | [Q04](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q04) 观察并先补错误和预算，不以ok/mismatch自动修DNS；回原生查询核实。 |
| [dsh-wsl-docker](#plugin-1351854301-root) | 在WSL查询Docker CLI/context/daemon、推理相关容器与GPU线索，并探固定8000端口的models状态。 | 先观察，修404/GPU/端口/吞错误谓词和分层收据后再评估受控试用。 |
| [dsh-wsl-editor](#plugin-1351854212-root) | 在 Windows Cursor、VS Code 或 Notepad 中打开 WSL 路径并支持可选行列。 | [Q04](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md#research-q04) 显式绝对路径/可信样例试用，人工确认文档；取消或失败先核窗口再重试。 |
| [dsh-wsl-eventlog](#plugin-1391143266-root) | 从 WSL 通过 PowerShell 只读查询 Windows 事件日志的 Agent 工具。 | 只作本机日志初筛；空结果和 full 消息需与事件查看器复核。 |
| [dsh-wsl-fetch](#plugin-1362694736-root) | 为 DSH WSL 的官方 web_fetch 提供进程内 HTTP(S) 代理传输 provider。 | 可信代理与公开站点小范围试用；含敏感内网的环境先验证代理目的地址控制。 |
| [dsh-wsl-helm](#plugin-1381843528-root) | 将 Helm 的发布列表、状态和历史查询接入 DSH 模型工具。 | 建议观察，先用显式 context 的只读账号在测试集群对照原生 Helm；不要把 allowedContexts 或状态文本单独当自动决策依据。 |
| [dsh-wsl-llamacpp](#plugin-1381832318-root) | 给 DSH Agent 提供 llama.cpp 兼容服务的模型列表状态与一次性非流式聊天工具。 | 先核 /v1/models，再以固定 prompt 对照服务端原生结果与资源；不要只看 status.ok。 |
| [dsh-wsl-mail](#plugin-1381860693-root) | 通过本机 Himalaya 与 notmuch CLI 向 DSH 提供信封列表、未读概况和邮件搜索。 | 先核 mail_status 与未读语义，Himalaya fallback 仅视近期样本，敏感邮箱限制 Agent 访问。 |
| [dsh-wsl-mnt](#plugin-1351854159-root) | 提供 mnt_doctor，按路径分类 Windows 挂载工作区并给出 Linux home 建议。 | [Q04](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md#research-q04) 显式path并核挂载/基准，不按ok自动迁移，冲突或误判回原检查。 |
| [dsh-wsl-net](#plugin-1338965593-root) | 为 WSL 中的 DeepSeek Harness 诊断代理环境、宿主进程、端口监听与 HTTPS 可达性，并生成修复建议。 | [Q03](../../plugins/173787247--dsh-wsl-net/INSIGHT.md#research-q03) 个人无凭据测试环境先关闭注入并核对PID，只把报告作为排障线索。 |
| [dsh-wsl-ollama](#plugin-1381724774-root) | 为 DSH 在 WSL 或本机调用现有 Ollama 守护进程提供状态、模型列表、聊天和嵌入工具。 | 仅在已确认 reachable、模型和地址的环境小范围试用；长 messages 与向量返回需核宿主负担。 |
| [dsh-wsl-perf](#plugin-1391142601-root) | 从 WSL 获取 Windows 宿主 CPU、内存、固定磁盘和按内存排序的进程快照。 | 低频初筛，0 值先核 CIM；CPU 热点另用实时进程采样。 |
| [dsh-wsl-power](#plugin-1391140034-root) | 从 WSL 读取 Windows 活动电源方案、电池、睡眠与休眠信息的只读工具。 | 先与 Windows 原生命令逐字段对照，缺字段视未知；不要把休眠布尔和 sleep=0 直接用于决策。 |
| [dsh-wsl-rclone](#plugin-1381859181-root) | 把 rclone 的 remote 列表、文件名枚举和配额查看暴露为 DSH 只读工具。 | 只读凭据加显式 allowedRemotes，小路径先验；勿把 count 当总量或把 ok 当健康。 |
| [dsh-wsl-registry](#plugin-1391142974-root) | 为 WSL 内 DSH 提供受路径列表约束的 Windows 注册表读取工具。 | 建议观察并限非敏感诊断；在隔离测试键验证路径与长值边界、再评估是否允许真实注册表查询。 |
| [dsh-wsl-secret](#plugin-1381733290-root) | 为 DSH 提供 pass/age 名单读取、预览和进程环境变量转交。 | 受信任单租户进程先用假密钥验名单与输出，保持 reveal=false；高敏/多插件隔离需求优先正式范围化凭据服务。 |
| [dsh-wsl-service](#plugin-1391140376-root) | 给 WSL 中的 DSH Agent 提供 Windows 服务列表与单服务详情只读工具。 | 个人本机 WSL 排障可观察试用；共享环境先核工具授权和详情字段。 |
| [dsh-wsl-shot](#plugin-1351854253-root) | 将 Windows 剪贴板图片保存为 WSL 文件，供后续多模态会话引用。 | [Q04](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md#research-q04) 非敏感样图/独立目录先核Public权限/失败残留与后续接图；异常回手工。 |
| [dsh-wsl-struct](#plugin-1381832935-root) | 为DSH封装jq、yq与readonly SQLite查询，提供主文件allowRoots检查及输出截断标记。 | 先观察，固定CLI/缩小root并接宿主进程治理后再试，敏感配置先不用。 |
| [dsh-wsl-systemd](#plugin-1381843201-root) | 为DSH提供用户systemd可用性探测、服务列表、单位属性与近期日志的只读工具，不启动或停止服务。 | 有条件试用，先核用户bus/日志脱敏和失败截断；严格取消/内存边界场景先观察。 |
| [dsh-wsl-terraform](#plugin-1381843937-root) | 在DSH中检查Terraform/OpenTofu状态、验证配置、解析plan变更数量和列出state资源地址，不提供apply或destroy工具。 | 先观察，先假CLI验证exit/截断收据和明确批准根/最小权限，不直接在生产云项目启用。 |
| [dsh-wsl-vllm](#plugin-1381832640-root) | 把已有本机/Docker vLLM OpenAI 兼容端点接入 DSH Agent 的状态与聊天工具。 | 仅已有可信 vLLM 的环境小范围试用；先核 reachable、模型 id、输入上限及取消时序。 |
| [dsh-wsl-winctl](#plugin-1391143632-root) | 从 WSL 枚举并控制 Windows 顶层窗口的 Agent 工具，支持窗口状态与多种变更动作。 | 先只读枚举，变更时提供 PID+标题并事后复核；close/topmost 需人类批准。 |
| [dsh-wsl-winshot](#plugin-1391140767-root) | 从 WSL 调 PowerShell 截取 Windows 前台或指定 PID 窗口到本地 PNG 的工具。 | 只在隔离桌面试用，指定私有输出目录并手工核 PNG/残留；敏感窗口需额外授权。 |
| [dsh-wsl-wslconfig](#plugin-1351854461-root) | 读取推断路径下的Windows.wslconfig前段并给网络/内存提示，不能据此确认实际生效模式。 | 确定目标路径/原文安全后只作线索试用，空字段先核错误。 |
| [dsh-zspace](#plugin-1406500233-root) | 用 19 个模型工具管理极空间 NAS 文件、容器和系统状态。 | 保持观察，不连接承载唯一数据或家庭核心服务的 NAS；先只开只读工具，在测试共享目录验证通道切换和重复请求。 |
| [DSHBox](#plugin-1336708336-root) | 在 Android 中集成 PRoot/Debian、Node 与 DSH 运行时、WebView、终端和文件工作区，并附浏览器与手机助手适配。 | 备用兼容设备测试资料先启动/文件/终端，再单核Browser/Pilot，不以数量代验收，见 [Q03](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q03)。 |
| [EchoBird](#plugin-1158472225-root) | 桌面 AI 工具管理应用，提供模型配置、账号管理和本地多候选路由。 | [Q05](../../plugins/edison7009--echobird/INSIGHT.md#research-q05) 在独立配置使用受控任务比较直连，数据或续接边界不清时回退。 |
| [Enterprise Connection](#plugin-1363739656-packages-enterprise-connection) | 以固定版本捆绑企业身份与协作依赖的 WorkDSH 安装壳，安装代码后仍须后台验证企业账号权限。 | 观察为主，已有公司测试后台和对应Desktop才验证包与账号全链；不把它推荐为独立通用企业插件，见 [Q03](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md#research-q03)。 |
| [feishu-dsh-plugin](#plugin-1364766828-root) | 通过自建飞书应用为 DSH 提供 IM、文档、Bitable、Sheets 和权限工具的集成插件。 | 按测试租户只读→写入→权限操作分级试用，所有发送/修改/分享需按用户范围授权。 |
| [HOL Guard](#plugin-1194748811-root) | 为 Agent 动作提供策略审查、审批、扫描和证据入口。 | [Q04](../../plugins/hashgraph-online--hol-guard/INSIGHT.md#research-q04) 隔离验证实际钩子，不能以静态扫描代替执行覆盖。 |
| [K8E](#plugin-292529340-root) | 自托管 AI Agent 沙箱平台，提供会话、执行、文件与 DSH 接入 | [Q05](../../plugins/xiaods--k8e/INSIGHT.md#research-q05) 建议已有运维条件的团队以独立 profile 试用读写、断连和销毁；发生本机误写、串扰或残留会话则停止并退回 CLI。 |
| [mem9](#plugin-1175756746-root) | 为 AI Agent 提供跨会话、跨设备的持久共享记忆和检索。 | [Q05](../../plugins/mem9-ai--mem9/INSIGHT.md#research-q05) 先关闭自动写入，在隔离空间用合成事实验证读取、更正和删除；数据授权或传播不明时回本地笔记。 |
| [Mirage](#plugin-1231135337-root) | 用虚拟文件系统、命令及运行时为 Agent 组合统一终端。 | 先用低权限假源验证权限、输出及失败恢复；无法核实 effect 时停止真实写接入。 |
| [Mirage DSH Providers](#plugin-1231135337-typescript-packages-dsh) | 为 DSH 的文件和 shell provider 接入 Mirage 工作区。 | 先在独立 profile 验证只读挂载、长输出和审批；不一致则回原生 provider。 |
| [Open Managed Agents (OpenMA)](#plugin-1206555053-root) | 自托管 Agent 控制面与执行基础设施，组合会话持久化、模型 harness、工具、沙箱、确认和恢复，提供多种 API 与部署适配。 | 先观察并准备单组合隔离测试任务与模拟外部服务，达到权限/恢复/退出对账再扩大，见 [Q03](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q03)。 |
| [opencode2dsh](#plugin-1350368388-packages-plugin) | 为 DSH 提供 OpenCode Zen 匿名模型适配与可选本地委派。 | 非敏感任务核对实际来源、输出与网络资格；不明结果先对账。 |
| [OpenGuardrails](#plugin-1081166515-root) | 以本地规则、模型裁决、秘密替换、网关和 sandbox 为 AI Agent 提供安全检查与行为记录。 | [Q03](../../plugins/openguardrails--openguardrails/INSIGHT.md#research-q03) 仅在一次性工作区以合成秘密评本地规则，保留宿主审批，明确 observe/enforce 差异。 |
| [OpenViking](#plugin-1128123594-root) | 为 AI Agent 组织知识、记忆与技能的上下文数据库。 | [Q05](../../plugins/volcengine--openviking/INSIGHT.md#research-q05) 建议先对非敏感可回滚语料逐步试用并核验原文；数据外发、来源或权限不明时暂停并使用原文件搜索。 |
| [Our Free Model](#plugin-1385896447-root) | 为 DSH 提供免费模型、账户渠道和自带密钥提供者的统一模型接入。 | [Q05](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md#research-q05) 建议在确认供应商政策后以脱敏内容试单车道；数据去向不明、限额或工具异常时停止并切回已知官方端点。 |
| [pi2dsh](#plugin-1333452358-root) | 在 DSH 中提供 Pi 扩展兼容层，发现已安装 Pi 包并映射工具、命令、会话和界面能力。 | [Q04](../../plugins/weijiafu14--pi2dsh/INSIGHT.md#research-q04) 已有Pi任务的用户可在独立profile逐包试用，固定宿主/surface/扩展，先inspect再对照真实关键任务。 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root) | 监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。 | 需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 |
| [SandBase Harness](#plugin-1297278222-root) | 本地优先的 Agent 运行时，管理持久会话、工具、记忆、凭据、审计与控制台 | [Q04](../../plugins/sandbaseai--sandbase-harness/INSIGHT.md#research-q04) 建议先观察，只用可信只读输入评估会话回收与产物接口；报告不绑定固定提交或结果未知时停止并回到单次脚本加人工验收。 |
| [SkillCorpus](#plugin-1330431542-root) | 聚合、筛选和评估技能语料，并按任务从本地与远端来源检索技能，供不同 Agent 宿主使用。 | [Q03](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q03) 先限定本地审核目录，关闭远端与共享，用少量可独立验收任务比较固定目录。 |
| [Tingly Box](#plugin-1100971867-root) | 独立统一模型网关，为多客户端和团队提供协议转换、模型选路、凭据与团队 key 管理，以及请求路径和用量观察。 | 熟悉凭据/规则的管理员可localhost隔离渐进小样；身份/协议/规则不符、scope或DSH部分写不明时停扩流/自动配置，核attempt和文件、退原endpoint/副本。 |
| [TokenLedger](#plugin-1333969047-root) | 从 DSH 会话日志聚合 Token 用量，按路由、模型和项目展示，并提供费用估算与可选账户余额查询。 | [Q03](../../plugins/zh667--tokenledger/INSIGHT.md#research-q03) 先用副本日志核usage与归因，读failed/未知/未定价。 |
| [Treg](#plugin-1301657572-root) | 为 Agent 提供工具目录、凭据注入代理和调用计费。 | 选择受控只读任务、核对账单及费用上限，异常时撤销 token 并回退直连。 |
| [Usage Billing](#plugin-1363429979-plugin-usage-billing) | 从 DSH 会话日志聚合 token 用量，以价格与汇率快照估算费用并显示历史回填、预算和未计价状态。 | 先观察并用合成夹具核规则和锁价，不用于结算/硬预算；对账不一致保留旧账本回provider原始记录，见 [Q03](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md#research-q03)。 |
| [Yao Agents](#plugin-403559729-root) | 自托管管理多设备上的Agent、工作区与任务，提供桌面、浏览器、移动端及API接入。 | 当前建议有多机需求且能承担自托管的团队先观察，在隔离节点做架构核验，不把真实业务迁入平台。 |
| [元冰可](#plugin-1416699252-root) | 企业AI资源治理平台，管理身份、MCP/Agent等资产，提供受控调用、模型接入、计量审计与控制台。 | 观察，先有真实匿名案件与平台/恢复责任人，再做一个资源的小样；无账实一致、结果恢复及净维护收益就不扩域，详见[Q06](../../plugins/01men--ybkkasi/INSIGHT.md#research-q06)。 |

<a id="plugin-1428034710-root"></a>

## [@sueleven/dsh-auto-update](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sueleven/dsh-auto-update)

> **用途**：多npm插件桌面用户集中发现更新；合格交付须是同意版本被安装并通过重启功能核查。

> **亮点**：整合启动延迟检查和官方安装通道，减少逐包手工发现，默认确认前不安装。参见[Q01](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q01)。

> **思考**：runApply未把提示targets传给脚本，实际重新查latest/候选；可能安装用户未看到的版本，且apply处理器未见局部确认围栏。参见[Q02](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q02)、[Q03](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q03)。

> **建议**：未验证假设是版本/候选/profile摘要绑定的确认计划，漂移后重新确认而非自动换集合；故障对照核计划外安装。参见[Q04](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336031182-root"></a>

## [Almost Full Access](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alnita-M/dsh-Almost_Full_Access) [![npm 30d 1,006](https://img.shields.io/static/v1?label=npm+30d&message=1%2C006&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-almost-full-access) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-almost-full-access)

> **用途**：希望减少工作区外可逆操作审批、仍确认危险命令的用户；作为安全权限用途，必须验证全部真实执行入口。它是原生DSH插件，但底层仍是完全访问预设。见[Q01](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q01)。

> **亮点**：确定性风险优先、无工具审查与可见审批/错误构成低中断的权限交互原型；但只对已覆盖路径成立，不能替代宿主统一授权。已有增量与归因见[Q01](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q01)、[Q02](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q02)。

> **思考**：完全访问前提下，缺会话/预设、未命名工具等条件可绕过门控；短哈希复用未绑定会话/cwd/脚本版本，审批端点也不独立绑定操作者。局部超时拒绝与随机ID不足以证明整体安全，见[Q02](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q02)、[Q03](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q03)。

> **建议**：先将真实执行边界、缺身份默认值与精确授权复用做成可否定的安全验收，再评是否需要跨组件上下文描述；账户、历史范围与凭据目的地必须分别约束。方案未实现/未执行，最小验证见[Q05](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q05)、[Q07](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q07)。

[查看完整分析](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1195873793-root"></a>

## [ANOLISA](../../plugins/agentic-os-org--anolisa/INSIGHT.md)

[![GitHub ★ 650](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=650&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentic-os-org/ANOLISA)

> **用途**：维护 Agent 运行环境的开发者可保留原宿主，并按任务接入系统能力；本次具体检查 DSH 大工具输出的选择性压缩。

> **亮点**：[Q01](../../plugins/agentic-os-org--anolisa/INSIGHT.md#research-q01) 与 [Q02](../../plugins/agentic-os-org--anolisa/INSIGHT.md#research-q02) 支持将工具生命周期、来源分类和可恢复压缩接合的贡献；根项目负责系统能力组合，压缩器和宿主原能力归属分别保留。

> **思考**：[Q02](../../plugins/agentic-os-org--anolisa/INSIGHT.md#research-q02) 的格式与节省仲裁不能证明任务敏感信息保持，取回还依赖CLI与状态存续；[Q03](../../plugins/agentic-os-org--anolisa/INSIGHT.md#research-q03) 因而不能从压缩率推净费用，更不能从status推全栈安全或轨迹已工作。

> **建议**：[Q04](../../plugins/agentic-os-org--anolisa/INSIGHT.md#research-q04) 的任务字段与实际恢复探针回执是待验证增量；与已有仲裁对照，只有同时改善合格任务质量且总负担可接受才成立。

[查看完整分析](../../plugins/agentic-os-org--anolisa/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-124882400-root"></a>

## [Browser4](../../plugins/platonai--browser4/INSIGHT.md)

[![GitHub ★ 1,171](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C171&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/platonai/Browser4)

> **用途**：面向需要多页面交互和结构提取的自动化开发者。

> **亮点**：[Q02](../../plugins/platonai--browser4/INSIGHT.md#research-q02) 组合 CLI、后端工具和不同会话所有权；不把底层浏览器或 CDP 视为原创。

> **思考**：[Q03](../../plugins/platonai--browser4/INSIGHT.md#research-q03) 本地会话状态不能证明网站操作未发生或自动幂等；[Q04](../../plugins/platonai--browser4/INSIGHT.md#research-q04) 远端和数据范围未测。

> **建议**：[Q05](../../plugins/platonai--browser4/INSIGHT.md#research-q05) 提议持久操作意图并在恢复前核对站点，需对照现有 stale 和 URL 检查。

[查看完整分析](../../plugins/platonai--browser4/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333144072-root"></a>

## [Bruce Awesome DSH Plugins](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md)

[![GitHub ★ 472](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=472&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bruc3van/awesome-dsh-plugin)

> **用途**：为DSH用户提供可浏览目录和官方发现页订阅，根对象是资源而非单个插件。

> **亮点**：[Q02](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md#research-q02) 将目录目标转为宿主可读且核实安装身份的索引，保留产物依据和发布异常门禁。

> **思考**：[Q03](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md#research-q03) 元数据核验、Star和featured选择不等于安全审查、实机兼容或采用效果；索引有1000上限和编辑优先。

> **建议**：[Q04](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md#research-q04) 推导明确展示核验层级和入选原因的未验证改进，用误信率与选包耗时比较；不改善则推翻。

[查看完整分析](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334862230-root"></a>

## [chicheng-gate](../../plugins/534119219--chicheng-gate/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/534119219/chicheng-gate)

> **用途**：目标是手机或公网远程访问完整 DSH；仅需局域网或单个只读页面时 SSH/VPN/官方远程方案暴露面更小。 详见[Q01](../../plugins/534119219--chicheng-gate/INSIGHT.md#research-q01)。

> **亮点**：把门禁、反代和隧道生命周期整合，降低远程接入步骤；同时也把宿主高权限能力置于新的网络边界。 详见[Q03](../../plugins/534119219--chicheng-gate/INSIGHT.md#research-q03)。

> **思考**：远端认证成功后近似完整控制；源码补丁随宿主升级易漂移，下载运行 frpc 又增加二进制供应链与公网攻击面。 详见[Q04](../../plugins/534119219--chicheng-gate/INSIGHT.md#research-q04)。

> **建议**：若改为 VPN 内访问、默认只读 RPC、设备绑定和可撤销短期令牌，可把风险从“完整公网暴露”降到可控远程入口。 详见[Q08](../../plugins/534119219--chicheng-gate/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/534119219--chicheng-gate/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1156882085-root"></a>

## [ClawMetry](../../plugins/vivekchand--clawmetry/INSIGHT.md)

[![GitHub ★ 435](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=435&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vivekchand/clawmetry)

> **用途**：面向需要回查Agent运行轨迹的操作者；本轮重点是开放OpenClaw会话观测路径，DSH适配在闭源付费层。

> **亮点**：[Q02](../../plugins/vivekchand--clawmetry/INSIGHT.md#research-q02) 将多源会话数据归一并为部分路由标记来源，提供回放和定位入口；没有证明Agent工作质量。

> **思考**：[Q03](../../plugins/vivekchand--clawmetry/INSIGHT.md#research-q03) 空会话或空浪费标记可能来自读取失败、Pro未安装或委派异常；观测与执行前拦截也受runtime能力边界约束。

> **建议**：[Q04](../../plugins/vivekchand--clawmetry/INSIGHT.md#research-q04) 推导每个指标携带来源/覆盖/启用/错误合同的未验证改进，以盲区误判和定位时间检验，噪声或成本抵消收益则推翻。

[查看完整分析](../../plugins/vivekchand--clawmetry/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333065091-root"></a>

## [DeepSeek Harness](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md)

[![GitHub ★ 267,009](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=267%2C009&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

> **用途**：需要组装模型、工具和交互面的开发者可使用该 Agent 宿主；对既有 SDK 方案的实际收益尚无同条件对照。[Q01](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q01)

> **亮点**：宿主将插件配置、作用域工具分派和会话事件组织为可组合接缝；Cordis 基础来自上游，实际采用收益仍需任务对照。[Q01](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q01) [Q02](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q02)

> **思考**：版本声明通过不代表运行兼容；取消等待已启动工具结束也不撤销外部副作用，内存事件尚需持久化屏障，恢复必须核对实际目标。[Q03](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q03) [Q04](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q04)

> **建议**：未验证假设：在插件升级中增加作用域可见性、审批、取消和持久化接缝测试，可能比只检查版本范围发现更多真实不兼容；应比较故障检出、误报和维护时间，若额外收益不足以覆盖成本则否定。[Q05](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1290565606-apps-bcs-crates-plugins-deepseek-harness-channel-bcn"></a>

## [DeepSeek Harness Channel BCN](../../plugins/inclusionai--avernet--apps-bcs-crates-plugins-deepseek-harness-channel-bcn/INSIGHT.md)

[![GitHub ★ 598](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=598&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/inclusionAI/Avernet) [![npm 30d 1,557](https://img.shields.io/static/v1?label=npm+30d&message=1%2C557&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@avernet-plugin/deepseek-harness-channel-bcn) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@avernet-plugin/deepseek-harness-channel-bcn)

> **用途**：DSH Agent 需要在授权 BCN 会话中接收消息与返回结果。

> **亮点**：[Q01](../../plugins/inclusionai--avernet--apps-bcs-crates-plugins-deepseek-harness-channel-bcn/INSIGHT.md#research-q01) 集中 DSH 与 BCN 会话接线，[Q02](../../plugins/inclusionai--avernet--apps-bcs-crates-plugins-deepseek-harness-channel-bcn/INSIGHT.md#research-q02) 将网络请求派发给 Agent 并发送事件。

> **思考**：[Q03](../../plugins/inclusionai--avernet--apps-bcs-crates-plugins-deepseek-harness-channel-bcn/INSIGHT.md#research-q03) 内存缓冲有限，不能保证重启或断线无丢失；[Q04](../../plugins/inclusionai--avernet--apps-bcs-crates-plugins-deepseek-harness-channel-bcn/INSIGHT.md#research-q04) 凭据和对端须独立管理。

> **建议**：[Q05](../../plugins/inclusionai--avernet--apps-bcs-crates-plugins-deepseek-harness-channel-bcn/INSIGHT.md#research-q05) 假设双方确认的脱敏对账视图能减少断线误判；尚未验证。

[查看完整分析](../../plugins/inclusionai--avernet--apps-bcs-crates-plugins-deepseek-harness-channel-bcn/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334747723-root"></a>

## [DeepSeek Harness Studio](../../plugins/fufankeji--deepseek-harness-studio/INSIGHT.md)

[![GitHub ★ 695](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=695&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fufankeji/deepseek-harness-studio)

> **用途**：DeepSeek Harness Studio是独立Electron客户端/宿主分发，不是可直接安装进原DSH的一项插件。它面向想从需求发现候选、看权限兼容、确认安装到生命周期维护都在图形界面完成的人。相对手工搜npm/GitHub、装包和排查profile，它把发现、确定版本检查、安装及恢复串起来；LLM、子Agent、Skill和多数核心工作流继承Harness，不能把整仓内置能力都算Studio原创。合格结果不是候选多或安装按钮变绿，而是用户选到匹配任务的包、准确版本被激活、出错能回到可解释的原状态且实际任务可完成。固定桌面包0.1.0-rc.19与上游版本分开，README的真实Electron验收属于作者报告，本轮未复现。

> **亮点**：[Q02](../../plugins/fufankeji--deepseek-harness-studio/INSIGHT.md#research-q02)、[Q03](../../plugins/fufankeji--deepseek-harness-studio/INSIGHT.md#research-q03)把自然语言候选、可信版本预检查、真实包验证和host重启后清单对照接成产品链；贡献在流程与证据交接，原代理能力继承Harness。

> **思考**：[Q03](../../plugins/fufankeji--deepseek-harness-studio/INSIGHT.md#research-q03)元数据可信、哈希一致、loader active都不证明业务功能或插件最小权限；恢复profile也不撤销外部写入。[Q02](../../plugins/fufankeji--deepseek-harness-studio/INSIGHT.md#research-q02)新会话和单一key检查仍有交接负担。

> **建议**：未验证方向是在已有候选检索和安装事务之后，增加用户任务的最小可撤销验收配方：说明输入样例、预期输出、必要权限和停止条件，安装成功后只在用户确认的隔离profile执行并回传可核对证据。推导来自推荐元数据与runtime激活不等于业务有效的缺口；它相对当前链新增的是需求到验证的交接，不是再次做目录、评分或安装按钮。配方会带来隔离环境、版本绑定和失败清理成本，不能自动执行陌生插件任意样例。先找五个真正需要选插件的用户，以目录推荐和有配方推荐比较选错率、首次合格任务时间与愿意继续比例；若配方只转移人工、测试不能代表任务或现有手工方案已足够，则否定独立机会。当前未实现且无付费意愿证据。 [Q05](../../plugins/fufankeji--deepseek-harness-studio/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/fufankeji--deepseek-harness-studio/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333718792-root"></a>

## [DeepSeek Harness Tauri Desktop](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md)

[![GitHub ★ 3,385](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C385&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-tauri/deepseek-harness-desktop)

> **用途**：希望图形化管理 DSH 内核、profile 和数据的用户；基线是 CLI、浏览器与手工目录管理。[Q01](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q01)

> **亮点**：将运行时、内核和档案管理集成到第三方桌面；不是单一 DSH 插件。[Q01](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q01) [Q02](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q02)

> **思考**：迁移统计仅比较文件数和字节，链接重建失败只告警；不能据成功提示断言关键内容和插件完全恢复。[Q03](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q03)

> **建议**：未验证假设：分层展示内核、插件及关键文件/链接核对结果，可减少迁移成功误判；须测漏报和成本。[Q05](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1326893710-root"></a>

## [DSH Better Sidebar](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md)

[![GitHub ★ 4,789](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C789&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/DSH-better-sidebar) [![npm 30d 233,365](https://img.shields.io/static/v1?label=npm+30d&message=233%2C365&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar)

> **用途**：面向在 DSH 会话中频繁查看文件、编辑和核对 Git 的开发者；成熟 IDE 与终端仍可完成同类任务。

> **亮点**：[Q02](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q02) 和 [Q04](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q04) 显示会话目录、编辑与可注销扩展服务在一个工作台接线；相对 IDE 的增量主要是上下文组织，不能据此推断功能全面领先。

> **思考**：[Q03](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q03) 表明请求准入不等于工作目录隔离，文件操作可达宿主账户有权限访问的其他路径；目录误判或错误操作的影响不能仅凭会话作用域排除。

> **建议**：[Q07](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q07) 提出未验证的按真实路径授予写权限假设；若合法跨目录任务受阻或符号链接仍可绕过，应放弃。

[查看完整分析](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333528857-root"></a>

## [DSH Codex Subscription](../../plugins/wsl043--dsh-codex-subscription/INSIGHT.md)

[![GitHub ★ 329](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=329&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WSL043/dsh-codex-subscription) [![npm 30d 27,412](https://img.shields.io/static/v1?label=npm+30d&message=27%2C412&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-subscription) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-subscription)

> **用途**：面向已有适用账号并希望在 DSH 会话中使用 Codex 模型的用户。

> **亮点**：[Q02](../../plugins/wsl043--dsh-codex-subscription/INSIGHT.md#research-q02) 将订阅凭据和 provider 接入 DSH；不创造账号权益或证明节费。

> **思考**：[Q03](../../plugins/wsl043--dsh-codex-subscription/INSIGHT.md#research-q03) write 模式不逐次询问，审批参数裁剪；[Q04](../../plugins/wsl043--dsh-codex-subscription/INSIGHT.md#research-q04) 凭据、远控与费用仍需核查。

> **建议**：[Q06](../../plugins/wsl043--dsh-codex-subscription/INSIGHT.md#research-q06) 提议以账号代次检测切换竞争，须与现有串行和账号检查对照。

[查看完整分析](../../plugins/wsl043--dsh-codex-subscription/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1349641014-root"></a>

## [DSH Connect WorkBuddy](../../plugins/dingminhua--dsh-connect-workbuddy/INSIGHT.md)

[![GitHub ★ 950](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=950&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingminhua/dsh-connect-workbuddy) [![npm 30d 54,110](https://img.shields.io/static/v1?label=npm+30d&message=54%2C110&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-workbuddy) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-workbuddy)

> **用途**：面向已有 WorkBuddy 账号、希望在 DSH 中使用对应模型的用户。

> **亮点**：[Q01](../../plugins/dingminhua--dsh-connect-workbuddy/INSIGHT.md#research-q01) 与 [Q02](../../plugins/dingminhua--dsh-connect-workbuddy/INSIGHT.md#research-q02) 显示将本机账号和双地区模型目录接入 DSH，提供统一宿主入口；模型能力和用户收益不归功于插件。

> **思考**：[Q03](../../plugins/dingminhua--dsh-connect-workbuddy/INSIGHT.md#research-q03) 的输出前换号不能证明无重复计费；[Q04](../../plugins/dingminhua--dsh-connect-workbuddy/INSIGHT.md#research-q04) 的拒绝后请求变化可能影响内容保真及上游规则，off 也不是全面关闭恢复链。

> **建议**：[Q06](../../plugins/dingminhua--dsh-connect-workbuddy/INSIGHT.md#research-q06) 假设跨所有尝试设置显式预算并提供脱敏收据，可帮助用户识别未知费用和无效重试；相对现有分类和换号提示的收益未验证。

[查看完整分析](../../plugins/dingminhua--dsh-connect-workbuddy/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333235870-root"></a>

## [DSH Cost Meter](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md)

[![GitHub ★ 589](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=589&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Han-1413141/dsh-cost-meter) [![npm 30d 117,828](https://img.shields.io/static/v1?label=npm+30d&message=117%2C828&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter)

> **用途**：面向需要按 DSH 会话和模型查看用量的用户；供应商账单仍是账号实际结算的主要核对基线。

> **亮点**：[Q01](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q01) 与 [Q02](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q02) 显示将流用量按会话聚合并将 API 金额与 Plan 等值区分，补充账号余额无法提供的任务视角；它不能取代供应商结算。

> **思考**：[Q03](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q03) 显示缺 usage 不入普通账、未知价格按零计价且相同包装流可能误合并；显示为零不证明没有支出，必须对账。

> **建议**：[Q07](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q07) 提出保留稳定调用 ID 与缺失状态的未验证收据；若跨包装层无法传递或维护成本超过收益，应放弃。

[查看完整分析](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333321333-root"></a>

## [DSH Desktop](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md)

[![GitHub ★ 34,234](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34%2C234&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anywhere-labs/dsh-desktop)

> **用途**：[Q01](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q01) 面向希望在桌面管理 DSH 工作区的用户，合格结果包括完成任务及安全退出。

> **亮点**：[Q02](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q02) 把上游 DSH Host、Web 界面与桌面进程生命周期组合，并在 renderer 健康后再交付工作区；核心 Agent 能力属于上游，未证明运行收益。

> **思考**：[Q03](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q03) 的 Host 停止和 checkpoint 分支显示应用有恢复保护，但失败或超时会限制操作；健康回调不证明用户数据完整可恢复。

> **建议**：[Q04](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q04) 假设切换前展示实际数据根供用户核对可减少错误归属，须在同任务记录识别正确率、耗时和可还原性；尚未验证。

[查看完整分析](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333807290-root"></a>

## [DSH Market](../../plugins/dsh-market--dsh-market/INSIGHT.md)

[![GitHub ★ 10,030](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C030&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-market/dsh-market) [![npm 30d 776,009](https://img.shields.io/static/v1?label=npm+30d&message=776%2C009&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)

> **用途**：维护多个社区插件的 DSH 用户可集中发现、安装和整理插件；偶发安装者可先使用原生 Discover 与 CLI。

> **亮点**：[Q02](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q02) 显示它将目录选择和安装后盘面检查连成操作链，相比手工 CLI 补上可加载入口与冲突判断；这是组合与防护机制，未证明全球首创或实测省时。

> **思考**：[Q04](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q04) 表明取消不等于全事务回滚，且执行中失去 Agent hold 时会请求取消；用户仍需检查剩余状态。只有在恢复负担受控时，集中管理才能兑现价值。

> **建议**：[Q07](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q07) 提出先在独立 profile 试装并生成迁移计划的未验证假设；若状态无法可靠迁移或恢复负担反增，应放弃。

[查看完整分析](../../plugins/dsh-market--dsh-market/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-packages-dsh-plugin-manager"></a>

## [DSH Plugin Manager](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md)

[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 85,019](https://img.shields.io/static/v1?label=npm+30d&message=85%2C019&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager)

> **用途**：熟悉 profile 的本机用户管理多个 DSH 扩展时，可以集中检查更新；实际维护收益尚无同条件对照。[Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md#research-q01)

> **亮点**：组件将多通道版本检查、目标版本回读与重启入口接入官方页面，队列和写后校验有明确接线；不证明插件已加载或更新更省时。[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md#research-q02) [Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md#research-q03)

> **思考**：客户端更新只传 ID，服务端重新读取 latest，用户先前看到的版本未绑定；启动修复不走普通队列，退出码或 done 也不能证明磁盘、进程与功能完全恢复。[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md#research-q02) [Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md#research-q03)

> **建议**：未验证假设：把用户看到的 expectedVersion 绑定到更新、协调启动修复并在重启后回读加载版本与核心功能，可能减少版本漂移及半完成误判；对照官方固定 spec 与人工清单测错误率和总成本，若无额外收益则否定。[Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1323404274-root"></a>

## [DSH Plugin Radar](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md)

[![GitHub ★ 1,488](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C488&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdamPlatin123/dsh-plugin-radar)

> **用途**：插件使用者需要发现候选，市场或社区维护者需要可处理的目录与状态。

> **亮点**：[Q01](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q01) 与 [Q02](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q02) 把历史快照和登记候选合并为统一目录，便于发现和接入；这不证明逐条状态当前正确。

> **思考**：[Q03](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q03) 公开状态缺逐条 commit、宿主环境和日志，私有测试生产者不可审计；历史 ok 不能当当前兼容或安全证明。

> **建议**：[Q05](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q05) 假设生产者提供逐条版本、环境与可核验日志元组可减少误分类；依赖私有生产者配合，尚未实现或验证。

[查看完整分析](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1387227102-root"></a>

## [DSH RotaKit](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rotakit) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rotakit)

> **用途**：供已登录本人账号的用户在兼容客户端复用调度与故障转移；合格结果须验证完整模型/工具任务。详见[Q01](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md#research-q01)。

> **亮点**：作者署名说明账号池、凭据解密与部分加固来自 MIT 上游；本项目可辨识增量是多协议同调度链、工具/流兼容投影和管理界面组合，仍需实际任务与上游差异对照。详见[Q01](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md#research-q01)。

> **思考**：input_image 被转成文本占位，数组工具输出只抽文本，工具声明只保留 function；HTTP 200 可伴随语义丢失。粘性键也由相同开头文本构成，TTL/容量与“永不失效”表述不一致。详见[Q03](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md#research-q03)。

> **建议**：未验证方向是能力协商并对不能保真的请求显式拒绝/标注降级，另为图像与自由格式工具补受测通路；用协议契约夹具测失真、误拒绝和延迟。详见[Q05](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-packages-dsh-ssh"></a>

## [DSH SSH](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md)

[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 96,003](https://img.shields.io/static/v1?label=npm+30d&message=96%2C003&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh)

> **用途**：熟悉 SSH 的用户希望在 DSH 内集中访问测试主机及其命令、终端和文件；仍需独立核对目标与结果。

> **亮点**：[Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md#research-q01) 和 [Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md#research-q02) 显示 GUI 与工具复用别名和连接 engine，集中远端操作入口；未证明比 OpenSSH 更安全或更省时。

> **思考**：[Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md#research-q03) 显示目标构造未传主机验证回调，且执行取消信号未传入池的重试判断；失联后应先核实身份和远端状态，不能假定操作未发生。

> **建议**：[Q06](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md#research-q06) 提出绑定目标身份和作业状态的未验证假设；若现有 known_hosts、作业 ID 和简单修补足够，则不需新方案。

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1356951582-root"></a>

## [DSH XD Pool](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md)

[![GitHub ★ 311](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=311&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/XDTrees/dsh-xdpool) [![npm 30d 4,679](https://img.shields.io/static/v1?label=npm+30d&message=4%2C679&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xdpool) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xdpool)

> **用途**：面向多自有账号、希望减少手工换号的DSH用户，合格结果是明确路由和成本下完成同一任务。见[Q01](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q01)。

> **亮点**：以多账号作为默认选择面，把凭据、冷却、目录、路由和DSH provider统一接线；主增量是拒绝容错和可观测，不是厂商模型或免费额度。见[Q01](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q01)、[Q02](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q02)。

> **思考**：流已接受后并非透明换号续接，overrun恢复可能新增摘要并截断历史；集中JSON凭据、HTTP共享网关与积分写动作扩大维护范围。当前源码积分默认关闭，与README全自动文案分开。见[Q02](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q02)、[Q03](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q03)。

> **建议**：请求级恢复账同时记录物理尝试、部分输出、摘要截断和费用来源，检验是否减少误重试/损失而不过度增加日志与核对负担。见[Q06](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333964468-root"></a>

## [DSH 订阅模型适配插件](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md)

[![GitHub ★ 541](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=541&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/V1ki/dsh-plugin-subscriptions) [![npm 30d 11,004](https://img.shields.io/static/v1?label=npm+30d&message=11%2C004&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-subscriptions) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-subscriptions)

> **用途**：面向已有适用订阅且希望在 DSH 会话中管理多账号的用户。

> **亮点**：[Q02](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md#research-q02) 接入多 provider 身份与账号管理，[Q03](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md#research-q03) 支持有限流式回退；并不创造模型或订阅权益。

> **思考**：[Q03](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md#research-q03) 首包前回退仍可能让多个账号处理输入，不能保证 exactly-once 或状态隔离。

> **建议**：[Q05](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md#research-q05) 提议展示潜在接收账号及脱敏尝试状态，须以用户理解和泄漏对照。

[查看完整分析](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

## [dsh-anatomy-panel](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：供已安装 dsh-organism 的本地开发者观察体征与调用，需对照原始事件和来源状态。详见[Q01](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md#research-q01)。

> **亮点**：把 dsh-organism 的分散文件映射成同源可视化页面，使开发期观察更直观；体征生成与事件采集不是本组件贡献。详见[Q01](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md#research-q01)。

> **思考**：脉冲和器官等运行时字段进入 innerHTML 未转义；部分文件损坏仍返回 200 且面板可显示零/空。真实风险取决于上游字段可控性和宿主访问控制。详见[Q02](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md#research-q02)、[Q03](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md#research-q03)。

> **建议**：未验证方向是逐源 freshness/解析状态、文本安全渲染及明确路由认证边界，用恶意字段、丢源和多标签页夹具核结果与性能。详见[Q05](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1346196699-root"></a>

## [dsh-api-dashboard](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,117](https://img.shields.io/static/v1?label=npm+30d&message=4%2C117&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-dashboard)

> **用途**：多API平台用户希望在DSH工作流内看到余额线索和会话成本量级。详见[Q01](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md#research-q01)。

> **亮点**：把多平台余额、usage/子代理成本与GUI提示联结，减少控制台切换和人工汇算。详见[Q01](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md#research-q01)。

> **思考**：部分价格未核官方、未知模型走默认价；自定义端点携Key、状态明文存Key与删拷自更新扩大信任和恢复面。详见[Q03](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md#research-q03)。

> **建议**：可研究绑定价格版本/档位/usage来源的估算收据与明确缺价，让余额/配额/成本单位分离并按账单对照。当前未验证。详见[Q06](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1349267122-root"></a>

## [dsh-cap-profile](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ansonfishing/dsh-cap-profile)

> **用途**：积累大量本地会话的人可用模型与工具摘要定位应回看的日志；指标属于诊断线索。[Q01](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md#research-q01)

> **亮点**：把冷会话日志转换为模型、工具和错误签名的查阅入口，减少逐份查原日志的导航负担；不需要 live agent，但不能据工具错误率直接评模型质量。[Q01](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md#research-q01) [Q02](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md#research-q02)

> **思考**：结果错误归给到达时当前模型，callId 只保留工具名，跨模型延迟结果可能使错误分母错位；任务环境混杂也阻止能力排名。定时扫描卸载释放需另核查。[Q03](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md#research-q03)

> **建议**：可绑定调用时模型并引入任务分层和人工责任标注，以同任务盲审检验画像是否预测业务问题；标注不可靠或环境主导时否定。尚未实现。[Q04](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1389469406-root"></a>

## [dsh-clean-desktop-shell-pro](../../plugins/aicksion--dsh-clean-desktop-shell-pro/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aicksion/dsh-clean-desktop-shell-pro)

> **用途**：桌面用户管理本地 DSH web 服务与窗口；替换原壳前需避免双实例。详见[Q01](../../plugins/aicksion--dsh-clean-desktop-shell-pro/INSIGHT.md#research-q01)。

> **亮点**：相对原版增加自动后端生命周期、无浏览器启动和退出选择，源码路径可核。详见[Q01](../../plugins/aicksion--dsh-clean-desktop-shell-pro/INSIGHT.md#research-q01)。

> **思考**：远程配置的本地隔离宣称与 earlyBackend 无条件 start 不一致；运行时下载校验为尽力而为。详见[Q03](../../plugins/aicksion--dsh-clean-desktop-shell-pro/INSIGHT.md#research-q03)和[Q04](../../plugins/aicksion--dsh-clean-desktop-shell-pro/INSIGHT.md#research-q04)。

> **建议**：未验证改进是远程目标判别先于 start、强制完整性校验或显式放行、保留旧运行时回滚。详见[Q05](../../plugins/aicksion--dsh-clean-desktop-shell-pro/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aicksion--dsh-clean-desktop-shell-pro/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391040578-root"></a>

## [dsh-compaction-route](../../plugins/643048695--dsh-compaction-route/INSIGHT.md)



> **用途**：长会话维护者可为压缩单独配置摘要主备，合格结果仍须保留任务关键事实，不能只看调用结束。见[Q01](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q01)。

> **亮点**：插件把主备摘要模型配置与明确错误后的自动切换接入同一压缩调用，减少人工换路线的一个环节；贡献是流程集成，不是新压缩算法。见[Q01](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q01)与[Q02](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q02)。

> **思考**：调用未报错不等于摘要合格，缺 finish 也不会触发备援；界面声明窗口不是实际 token 预算，空推理强度还可能继承上游参数。见[Q02](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q02)与[Q03](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q03)。

> **建议**：可探索只记录路线、终止类别、全部 usage 和预算判定的压缩尝试记录，以分清调用恢复与摘要恢复；隐私与排障收益尚未验证。见[Q04](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q04)与[Q05](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/643048695--dsh-compaction-route/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1364181676-root"></a>

## [dsh-deepseek-web-login](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md)

[![GitHub ★ 326](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=326&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cv-superding/dsh-deepseek-web-login) [![npm 30d 14,269](https://img.shields.io/static/v1?label=npm+30d&message=14%2C269&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepseek-web-login) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepseek-web-login)

> **用途**：已有网页账号且希望在DSH执行工具任务的操作者，可观察非官方供应商适配；合格结果要核对真实工具和必需输入。见[Q01](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q01)。

> **亮点**：工具调用从文本协议真实接到宿主事件，结合账号稳定身份及删除确认前保留清理义务，支持有条件的Agent适配研究；本轮未证明运行闭环。见[Q02](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q02)、[Q04](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q04)。

> **思考**：回复恢复可能伴随无图却仍标已附图的降级、链首约束丢失或远端会话未清，网页登录与凭据保管又是外部依赖；有文本不等于原任务办结，卸载也不等于登出。见[Q03](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q03)、[Q04](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q04)。

> **建议**：未验证假设是把输入齐备、工具实执行和结果核对作为公开任务级恢复状态，减少丢图或协议失败后的假完成；比较合格交付、遗漏和人工修正，维护代价长期高于正式替代时停止。见[Q05](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1384810806-root"></a>

## [dsh-device-bridge](../../plugins/173787247--dsh-device-bridge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-device-bridge)

> **用途**：已有 companion 的设备由 Agent 统一枚举、查状态与调用受限动作；实际设备能力需对端实现。详见[Q01](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q01)。

> **亮点**：为多个设备提供统一 Companion v1 工具入口，而具体动作和安全策略依赖共享库与设备端。详见[Q01](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q01)。

> **思考**：核心客户端仅再导出外部包，无法由本仓库证明白名单与确认；Termux 样例空 token 对局域网可达主机开放。详见[Q02](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q02)与[Q03](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q03)。

> **建议**：未验证方向是端到端验证双侧认证/确认/幂等，示例改显式 token，并以拒绝矩阵验收。详见[Q05](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-device-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333689922-root"></a>

## [dsh-find-plugin](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md)

[![GitHub ★ 214](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=214&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/awesome-dsh-plugin/dsh-find-plugin) [![npm 30d 17,029](https://img.shields.io/static/v1?label=npm+30d&message=17%2C029&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-find-plugin) [![最新发布 2026-09-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-find-plugin)

> **用途**：不知道插件名的DSH用户可以按能力关键词在对话中找候选仓库和描述。

> **亮点**：[Q01](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md#research-q01)、[Q02](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md#research-q02) 把候选发现做成模型工具，结合可选凭据、缓存和明确标识的离线目录退路。核心搜索与描述继承外部来源，不把Star当采用判断。

> **思考**：[Q02](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md#research-q02) Star仅在先截取的有限GitHub候选内排序，缓存limit也会影响覆盖；返回的目录描述和安装字符串未经源码/兼容核查。工具没有执行安装，后续Agent不能把命令返回当授权。

> **建议**：[Q04](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md#research-q04) 在已有来源note上增加有限范围、时间与未核状态的候选交接说明，比较是否减少把目录收录误认安全认可；收益和阅读成本未验证。

[查看完整分析](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336647931-root"></a>

## [dsh-gov](../../plugins/863683348--dsh-gov/INSIGHT.md)

[![npm 30d 146](https://img.shields.io/static/v1?label=npm+30d&message=146&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-gov) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-gov)

> **用途**：维护者需要统一解释工具策略、观察事件和预算提示，强治理需额外权限边界。详见[Q01](../../plugins/863683348--dsh-gov/INSIGHT.md#research-q01)。

> **亮点**：把工具策略解释、JSONL事件与预算提示用纯模块和一个工具整合，减少分散hook接线。详见[Q01](../../plugins/863683348--dsh-gov/INSIGHT.md#research-q01)。

> **思考**：被治理模型也能改全局策略/预算，quota不硬停且启动/global键与计量delta未闭合，持久失败和坏配置可静默失去治理。详见[Q02](../../plugins/863683348--dsh-gov/INSIGHT.md#research-q02)。

> **建议**：管理员签发的版本化政策、明确usage delta/预算预留与关联审计收据，按自改政策/计量/坏盘反例检验，未验证。详见[Q05](../../plugins/863683348--dsh-gov/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/863683348--dsh-gov/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1366370702-root"></a>

## [dsh-llm-balance](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md)

[![npm 30d 847](https://img.shields.io/static/v1?label=npm+30d&message=847&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-llm-balance) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-llm-balance)

> **用途**：多LLM账号用户希望少切控制台并清楚余额/套餐剩余。详见[Q01](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md#research-q01)。

> **亮点**：将余额/配额语义分开并接入逐源缓存和常驻GUI，减少控制台切换。详见[Q01](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md#research-q01)。

> **思考**：同类route共用首账号和probe缓存；Kimi默认刷新写CLI token、读比较rename非原子CAS，HTTP handler未本地认证。详见[Q03](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md#research-q03)。

> **建议**：可研究账号/端点/revision缓存和显式续期能力，逐route归属与CLI统一版本写，比较错账号及恢复工时。当前未验证。详见[Q05](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1344713826-root"></a>

## [dsh-mcp-tunnel](../../plugins/988hj7tczd-oss--dsh-mcp-tunnel/INSIGHT.md)



> **用途**：本机 MCP 服务需让远程 DSH Agent 调用，但操作者不愿逐项搭建代理和隧道。

> **亮点**：把 HTTP MCP 的代理、隧道和客户端片段组合到 DSH 工具流程；减少手工配置但不自动接入 profile。详见[Q01](../../plugins/988hj7tczd-oss--dsh-mcp-tunnel/INSIGHT.md#research-q01)、[Q02](../../plugins/988hj7tczd-oss--dsh-mcp-tunnel/INSIGHT.md#research-q02)。

> **思考**：含 Bearer 的 pending YAML 默认权限未收紧，且自定义 deployDir 创建后 status/stop 按默认路径寻址；公开隧道真实鉴权依赖未固定镜像。详见[Q02](../../plugins/988hj7tczd-oss--dsh-mcp-tunnel/INSIGHT.md#research-q02)、[Q03](../../plugins/988hj7tczd-oss--dsh-mcp-tunnel/INSIGHT.md#research-q03)。

> **建议**：把秘密片段权限和目录生命周期做成闭环、锁定代理镜像并加入真实未授权/授权 MCP 握手测试，可提高生产适用性；现版未实现。详见[Q04](../../plugins/988hj7tczd-oss--dsh-mcp-tunnel/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/988hj7tczd-oss--dsh-mcp-tunnel/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425159954-root"></a>

## [dsh-model-auto-enricher](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/66rapper/dsh-model-auto-enricher)

> **用途**：维护大量渠道模型的重复配置，合格结果看真实请求和可恢复配置而非字段数。见[Q01](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md#research-q01)。

> **亮点**：集中批量diff、四字段补齐、预览/备份和状态，降低入口切换；不扩展服务端能力。见[Q01](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md#research-q01)、[Q02](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md#research-q02)。

> **思考**：2.3.0虽加例外/白名单，未知仍1M/image且默认自动直接写，无源版本保护，值真实性和恢复未闭环。见[Q02](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md#research-q02)、[Q03](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md#research-q03)。

> **建议**：保守未知、逐项来源批准与原件身份/版本安全发布，是否减少误赋能和总核验成本待验证。见[Q05](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1358316691-root"></a>

## [dsh-model-channel-manager](../../plugins/arcaneorion--dsh-model-channel-manager/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ArcaneOrion/dsh-model-channel-manager) [![npm 30d 2,291](https://img.shields.io/static/v1?label=npm+30d&message=2%2C291&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@arcaneorion/dsh-model-channel-manager) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@arcaneorion/dsh-model-channel-manager)

> **用途**：面向维护多个真实模型渠道的用户，用虚拟轮询组处理首响应失败，并集中检查配置、测试和健康记录。

> **亮点**：相对手动换模型和单渠道调用，插件把候选能力过滤、首响应故障转移及健康/测速组织成虚拟路由，并在内容输出后拒绝拼接另一个模型，保留流语义。任务预留与配置分离减少运行指标写配置的耦合。真实模型能力、宿主LLM流和存储来自上游，不能将可用率提升直接当任务质量提升。[Q01](../../plugins/arcaneorion--dsh-model-channel-manager/INSIGHT.md#research-q01)

> **思考**：用户是否把totalBudgetMs理解为请求硬截止会改变可预期性。组层在开新尝试前检查剩余预算，streamAttempt内部只检查首响应/空闲超时，并不接收组截止时间；持续有chunk的长流可能越过组预算。切候选还可能改变模型行为与费用，健康成功只代表流终止成功，不证明合格业务结果。[Q02](../../plugins/arcaneorion--dsh-model-channel-manager/INSIGHT.md#research-q02)

> **建议**：未验证方向是把组剩余预算传入每次尝试并合成硬截止信号，另按任务能力和成本约束建立可替代候选集。用持续心跳长流、首响应失败和能力不等价模型对照现版，要求截止明确且合格任务率不降；若硬截止损失更多可接受结果或约束成本高于手工换模型，则否定。[Q04](../../plugins/arcaneorion--dsh-model-channel-manager/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/arcaneorion--dsh-model-channel-manager/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1358816037-root"></a>

## [dsh-model-info-fill](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/11zld22/dsh-model-info-fill)

> **用途**：DSH自定义模型维护者希望减少手查能力字段，仍以实际供应商能力为准。详见[Q01](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md#research-q01)。

> **亮点**：将模型目录、冲突/未知档区分与宿主补缺保存联结，降低重复能力配置。详见[Q01](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md#research-q01)。

> **思考**：目录未到即自动填默认且以后不覆盖；命中缺容量也fallback，配置/遗漏偏好非事务，HTTP自检不等身份认证。详见[Q03](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md#research-q03)。

> **建议**：可研究逐字段exact/归一/默认来源收据与catalog-ready确认计划，用慢目录和受限变体反例比较错误填值。当前未验证。详见[Q05](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1349266980-root"></a>

## [dsh-model-manager](../../plugins/ansonfishing--dsh-model-manager/INSIGHT.md)

[![npm 30d 311](https://img.shields.io/static/v1?label=npm+30d&message=311&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-manager) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-manager)

> **用途**：同时维护多套本地推理服务的用户可集中管理端口、参数与测速，仍需框架和设备运维知识。[Q01](../../plugins/ansonfishing--dsh-model-manager/INSIGHT.md#research-q01)

> **亮点**：将终端参数、服务登记和测速聚合为 DSH 工作流，框架 adapter 与校验分层便于维护；贡献为操作集成，未证明降低 OOM 或提升推理吞吐。[Q01](../../plugins/ansonfishing--dsh-model-manager/INSIGHT.md#research-q01) [Q02](../../plugins/ansonfishing--dsh-model-manager/INSIGHT.md#research-q02)

> **思考**：托管停止只检查 PID 存活，死 PID 又退为端口 fuser，可能作用于复用进程或新占用者；11437 没有服务端硬保护。KV warning 也不包含权重和多卡完整预算。均是静态边界，未实测损害。[Q03](../../plugins/ansonfishing--dsh-model-manager/INSIGHT.md#research-q03)

> **建议**：可把进程身份租约和入口一致的确认契约加入 stop，身份不符即拒绝端口级自动停止；以复用与抢占验证不误伤，若正常恢复代价过大则否定。未实现。[Q04](../../plugins/ansonfishing--dsh-model-manager/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/ansonfishing--dsh-model-manager/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1394197658-root"></a>

## [dsh-ollama-cloud](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Asheblog/dsh-ollama-cloud)

> **用途**：面向已使用Ollama云模型或自建兼容服务的DSH用户，合格结果是选择实际存在的模型、正确传递可用推理档位并完成同一聊天任务。手配兼容URL可解决基础对话，此插件增加原生tags/show发现、档位映射、目录刷新和配额界面。核心聊天继承官方PiAiAdapter，不应把上游协议转换算作本插件原创。增量是把端点特有元信息变为宿主可用选择与运维反馈。

> **亮点**：[Q01](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q01) 的增量是原生元信息与宿主模型选择、用量通道的联接；[Q02](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q02) 同代connection快照减少飞行请求与配置漂移。聊天协议能力明确归属上游PiAiAdapter。

> **思考**：[Q03](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q03) 中目录成员与能力描述不等于真实任务可用，best-effort对齐警告也不能证明兼容。暂态保留防止误下架，同时保留能力未知风险。 [Q02](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q02) 的normalizeContext是实际缓冲机制，不能因警告非阻断就否定全部适配；但包已提高宿主下限，旧宿主不能凭shim宣称受支持。

> **建议**：[Q05](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q05) 提出统一端点时效和验证状态的未验证设计，用误选与过期额度判断实验检验，而非把更多状态展示自动视为收益。

[查看完整分析](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1402771540-root"></a>

## [dsh-opencode-zen-plugin](../../plugins/a42null--dsh-opencode-zen-plugin/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A42Null/dsh-opencode-zen-plugin) [![npm 30d 400](https://img.shields.io/static/v1?label=npm+30d&message=400&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a42null/dsh-opencode-zen-plugin)

> **用途**：已有 Console 账户的 DSH 用户调用付费模型；需确认当前账号权限和模型端点。详见[Q01](../../plugins/a42null--dsh-opencode-zen-plugin/INSIGHT.md#research-q01)。

> **亮点**：一个插件承接四类网关协议及 Web 配置入口，降低 DSH 多模型手工配置量。详见[Q01](../../plugins/a42null--dsh-opencode-zen-plugin/INSIGHT.md#research-q01)。

> **思考**：模型选择器的静态并集不代表可用性；本地 plugin-load.json 保存密钥前10字符且错误响应片段入日志。详见[Q02](../../plugins/a42null--dsh-opencode-zen-plugin/INSIGHT.md#research-q02)及[Q03](../../plugins/a42null--dsh-opencode-zen-plugin/INSIGHT.md#research-q03)。

> **建议**：未验证改进是仅失败时启用静态目录、移除密钥前缀、用结构化错误与持续测试路由表。详见[Q05](../../plugins/a42null--dsh-opencode-zen-plugin/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/a42null--dsh-opencode-zen-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1401255267-root"></a>

## [dsh-openviking-enhance](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A2chitect/dsh-openviking-enhance) [![npm 30d 969](https://img.shields.io/static/v1?label=npm+30d&message=969&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openviking-enhance) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openviking-enhance)

> **用途**：已部署 DSH 与本地 OpenViking 的维护者可核对一次会话的记忆归档与当前召回。

> **亮点**：把分散的Studio、归档差异和检索查询组织到DSH同会话观察流程，增量在诊断集成而非检索算法。详见[Q01](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md#research-q01)。

> **思考**：当前重检索不能证明历史模型注入；loopback来源防线也不构成用户或会话授权，仅适合可信单机边界。详见[Q03](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md#research-q03)。

> **建议**：未验证假设是在注入边界保存轮次命中快照，与当前重检索并列解释；须以修改记忆后的前后对照证明差异，同时核对敏感数据保留代价。详见[Q05](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335349535-root"></a>

## [dsh-permissions](../../plugins/940842546--dsh-permissions/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/940842546/dsh-permissions) [![npm 30d 588](https://img.shields.io/static/v1?label=npm+30d&message=588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permissions) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permissions)

> **用途**：团队希望在 DSH 沙箱之外增加按工具参数和路径的可审计细粒度门禁，例如永久保护 .ssh/.env；基线是宿主全局审批姿态或每次人工确认。合格结果是 hard 永不可绕过、deny/ask/allow 优先级确定、workspace 隔离正确，规则编辑未保存前不改变执行。 详见[Q01](../../plugins/940842546--dsh-permissions/INSIGHT.md#research-q01)。

> **亮点**：相对宿主粗粒度审批，它加入不可豁免 hard 层、workspace/global 作用域和参数模式，并让草稿保存成为明确生效点。价值在额外收窄而非提升权限；它不替代 DSH sandbox/tools.guard，也不证明路径字符串与真实文件解析完全等价。 详见[Q03](../../plugins/940842546--dsh-permissions/INSIGHT.md#research-q03)。

> **思考**：核心质疑是字符串匹配能否覆盖别名、转义、相对路径、shell 拼接和工具 schema 变化。规则漏匹配会给出虚假安全感，过宽 hard/deny 会阻断正常任务；自建同源设置路由若缺鉴权或写入竞争，会改变全局策略。默认规则也可能不适合非 Windows 路径。 详见[Q04](../../plugins/940842546--dsh-permissions/INSIGHT.md#research-q04)。

> **建议**：未验证假设是把匹配输入改为工具 schema 驱动的规范化资源对象，并在执行前显示最终 canonical path，可显著减少路径绕过与误拦。最小对抗集包含 100 个绝对/相对/符号链接/引号/大小写/PowerShell 嵌套用例，比较现规则和规范化规则的漏拦、误拦与审批次数；任何已知秘密路径漏拦即否定。 详见[Q08](../../plugins/940842546--dsh-permissions/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/940842546--dsh-permissions/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1394489199-root"></a>

## [dsh-plugin-loopback-trust](../../plugins/6mt--dsh-plugin-loopback-trust/INSIGHT.md)



> **用途**：反代域名的 DSH 设置页被作者描述为降级到内存；合格结果须兼顾可持久化与未授权浏览器拒绝。

> **亮点**：用短客户端补丁绕过反代域名的本地分类，恢复作者所述设置持久化路径；依赖 DSH 私有时序和字段。详见[Q02](../../plugins/6mt--dsh-plugin-loopback-trust/INSIGHT.md#research-q02)。

> **思考**：它对所有非 loopback、无既存 transport 的网页统一标记 host-owning，插件无 origin 白名单或身份校验；服务端 fence 保留仅作者声称，不能替代代理授权。详见[Q03](../../plugins/6mt--dsh-plugin-loopback-trust/INSIGHT.md#research-q03)。

> **建议**：可由服务端授权后签发范围化的持久化 capability，避免客户端自宣告；双浏览器/Origin/Host 对照功能与拒绝率，尚未实现。详见[Q05](../../plugins/6mt--dsh-plugin-loopback-trust/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/6mt--dsh-plugin-loopback-trust/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335098475-root"></a>

## [dsh-plugin-mall](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1e0zj/dsh-plugin-mall) [![npm 30d 1,485](https://img.shields.io/static/v1?label=npm+30d&message=1%2C485&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)

> **用途**：供希望集中发现/管理社区插件的用户和维护者，合格结果需重启后目标profile功能可用且失败可恢复。

> **亮点**：将物化预检、profile快照和绑定材料的一次批准接入发现/安装，较手工add提供具体兼容与恢复线索；包管理与loader来自上游，徽章不是安全审查。详见[Q02](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md#research-q02)。

> **思考**：普通web启动在市场自身加载时可能静态commit并删除快照，后序插件失败便失自动回退件；guard存活窗口仍非核心功能验收，源码与作者已知#24一致。详见[Q03](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md#research-q03)。

> **建议**：可探讨完整启动收据，分开loader完成、功能回读和存活窗口，保留回退目标直到真实提交点；需要宿主事件与存储责任，未验证。详见[Q06](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334267268-root"></a>

## [dsh-plugin-manager](../../plugins/2768651338--dsh-plugin-manager/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2768651338/dsh-plugin-manager) [![npm 30d 923](https://img.shields.io/static/v1?label=npm+30d&message=923&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager)

> **用途**：多插件用户需要识别用途并正确启停，合格结果包括只改预期配置且宿主实际生效；目录备注不是能力证明。详见[Q01](../../plugins/2768651338--dsh-plugin-manager/INSIGHT.md#research-q01)。

> **亮点**：将用途说明、备注和局部启停编辑整合进设置，保留原生包管理并区分来源与用户安装；增量是维护流程便利而非新包管理能力。详见[Q01](../../plugins/2768651338--dsh-plugin-manager/INSIGHT.md#research-q01)。

> **思考**：写入安全不能只看函数名，rename受阻后直接覆盖、备份失败仍继续，队列也非跨进程锁；全局patch与多文件导入可能部分完成。静态风险尚未故障注入。详见[Q03](../../plugins/2768651338--dsh-plugin-manager/INSIGHT.md#research-q03)。

> **建议**：可研究预览diff、基线摘要、写后读回和宿主生效回执，配合导入恢复清单，以并发/锁占用/中断反例验证配置保留。当前未验证。详见[Q05](../../plugins/2768651338--dsh-plugin-manager/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2768651338--dsh-plugin-manager/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1374274543-root"></a>

## [dsh-plugin-proxy](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md)

[![npm 30d 80](https://img.shields.io/static/v1?label=npm+30d&message=80&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy)

> **用途**：需要集中配置DSH模型/搜索等出站代理的维护者。详见[Q01](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md#research-q01)。

> **亮点**：统一现成代理能力与设置、白名单和连接退休，减少逐插件配置。详见[Q01](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md#research-q01)。

> **思考**：无效配置先撤旧代理再回baseline，恢复缺所有权比较，不能保证严格禁直连或跨插件恢复。详见[Q03](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md#research-q03)。

> **建议**：研究先构建再替换、失败关闭、dispatcher所有权和环境逐键恢复，比较误出口和恢复工时。当前未验证。详见[Q05](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1421822085-root"></a>

## [dsh-purge Community](../../plugins/kingcharleslzy-ai--dsh-purge/INSIGHT.md)

[![GitHub ★ 3,840](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C840&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kingcharleslzy-ai/dsh-purge)

> **用途**：有权管理 DSH 宿主、研究提示和控制行为的用户；基线是原生权限配置和手动备份。[Q01](../../plugins/kingcharleslzy-ai--dsh-purge/INSIGHT.md#research-q01)

> **亮点**：将状态、配置与多宿主变更组织到统一入口；减少确认不证明模型任务质量提升。[Q01](../../plugins/kingcharleslzy-ai--dsh-purge/INSIGHT.md#research-q01)

> **思考**：补丁会改写文件写限制和默认沙箱语义；profile 快照失败仍继续且应用结果可能部分成功。[Q02](../../plugins/kingcharleslzy-ai--dsh-purge/INSIGHT.md#research-q02) [Q03](../../plugins/kingcharleslzy-ai--dsh-purge/INSIGHT.md#research-q03)

> **建议**：未验证假设：统一显示备份、逐目标差异及重启回读的状态凭据，可减少误认全成功；须对照现有审计测误报和恢复。[Q05](../../plugins/kingcharleslzy-ai--dsh-purge/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/kingcharleslzy-ai--dsh-purge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1367305514-root"></a>

## [dsh-reasoning-tiers](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md)

[![npm 30d 1,017](https://img.shields.io/static/v1?label=npm+30d&message=1%2C017&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-reasoning-tiers) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-reasoning-tiers)

> **用途**：维护DSH第三方pi-ai模型metadata缺口，需真实协议支持与可恢复配置。

> **亮点**：不接管adapter而补齐能力声明/选择器接线，尊重已有档位并显示来源，未证明模型推理增强。详见[Q01](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md#research-q01)与[Q02](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md#research-q02)。

> **思考**：重试实际patch与原plan记录可能不同，revert失败仍消费remaining，journal缺profile身份；有undo不等所有失败可恢复。详见[Q02](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md#research-q02)。

> **建议**：可探讨profile/版本绑定实际写收据，commit返回最终写集，失败保留撤销依据；有迁移/恢复状态成本，未验证。详见[Q05](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336583700-root"></a>

## [dsh-recipe](../../plugins/863683348--dsh-recipe/INSIGHT.md)

[![npm 30d 123](https://img.shields.io/static/v1?label=npm+30d&message=123&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-recipe) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-recipe)

> **用途**：按业务场景整理多插件候选，减少逐个找目录。详见[Q01](../../plugins/863683348--dsh-recipe/INSIGHT.md#research-q01)。

> **亮点**：把固定场景清单接入模型工具，减少整理命令步骤。详见[Q01](../../plugins/863683348--dsh-recipe/INSIGHT.md#research-q01)。

> **思考**：config被输出剥离，合并不报冲突，命令缺profile/版本与失败恢复，不能等同可复现环境。详见[Q03](../../plugins/863683348--dsh-recipe/INSIGHT.md#research-q03)。

> **建议**：研究可解释版本/配置冲突计划与分步收据，相对首胜拼串比较误安装和恢复成本，尚未验证。详见[Q05](../../plugins/863683348--dsh-recipe/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/863683348--dsh-recipe/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1384810201-root"></a>

## [dsh-remote-ssh-run](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-remote-ssh)

> **用途**：授权用户希望从 DSH 查询远程 Unix 类主机。

> **亮点**：[Q01](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q01) 集中远程查询入口，[Q02](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q02) 将受配置限制的命令接到本机 SSH。

> **思考**：[Q03](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q03) 有限变更名单不能保证只读；accept-new 不预先核验首次主机密钥，超时不证明远端停止。

> **建议**：[Q05](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q05) 假设显示身份来源及远端未知状态可减少误重跑；未验证。

[查看完整分析](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339262076-root"></a>

## [dsh-repeat-stop](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-repeat-stop)

> **用途**：为原样重复失败调用提供执行前保险丝，合格结果是减少无效重复同时保留合法探索和等待。

> **亮点**：[Q01](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md#research-q02) 把精确重复键与工具guard相接，默认允许六次并拒绝第七次，按Agent对象隔离状态。该局部保险丝有明确机制，不能称通用防循环或已验证节费。

> **思考**：[Q03](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md#research-q03) 跨步计数依赖宿主user消息窗口与exec对象身份；若历史user每步重现就可能重置，若双钩子包装不同可能双计数，均未真实复现。被排除工具不重置旧链，合法轮询也可能触阈值。

> **建议**：[Q05](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md#research-q05) 未验证假设是使用可信工具结果区分进展、等待和无效失败，以误拦/漏拦及额外副作用比较现有精确规则；不接受模型自报进展，信号维护无净收益时放弃。

[查看完整分析](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1376777535-root"></a>

## [dsh-router-loomy](../../plugins/2404723600--dsh-router-loomy/INSIGHT.md)



> **用途**：已使用 dsh-router 的用户希望调用 Loomy 模型；需要有效客户端会话和上游可用。

> **亮点**：将客户端会话/追踪头和流式截断判据封装成 router 供应商。详见[Q02](../../plugins/2404723600--dsh-router-loomy/INSIGHT.md#research-q02)。

> **思考**：截断触发整段重试会消耗积分，且状态昵称原样带 phone，README 脱敏示例与代码不一致。详见[Q03](../../plugins/2404723600--dsh-router-loomy/INSIGHT.md#research-q03)、[Q04](../../plugins/2404723600--dsh-router-loomy/INSIGHT.md#research-q04)。

> **建议**：持久重试预算和敏感字段统一脱敏可降低积分与展示风险；尚未实现。详见[Q05](../../plugins/2404723600--dsh-router-loomy/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2404723600--dsh-router-loomy/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1365163902-root"></a>

## [dsh-sakurafrp](../../plugins/arimakana-akane--dsh-sakurafrp/INSIGHT.md)



> **用途**：面向已有 dsh-mobile 和 SakuraFrp 隧道的 Linux/WSL2 用户，从会话界面检查手机访问并管理配对设备。

> **亮点**：相对手工调用网关管理 API 和查看 systemd，插件把状态、配对及设备撤销集中到会话内，并用用户关闭标记限制自愈。它没有实现隧道或手机网关，访问能力归属上游；贡献是现有链路的管理交接。[Q01](../../plugins/arimakana-akane--dsh-sakurafrp/INSIGHT.md#research-q01)

> **思考**：用户关闭意图能否可靠压过自愈是核心条件。control 先停网关再写抑制文件，文件失败仍返回 ok:true 和 suppressed:true，后台可能再次开启；后台 ensureGateway 使用 null 请求，adminBase 回退固定3080，非默认端口的面板控制与自愈可能指向不同实例。健康探测关闭证书校验，只支持连通响应判断。[Q02](../../plugins/arimakana-akane--dsh-sakurafrp/INSIGHT.md#research-q02)

> **建议**：可提出未验证的统一期望状态方案，由网关权威配置保存 enabled 及版本，自愈只恢复已启用状态，管理壳不另存关闭文件，并从宿主取得实例端口。对关闭时写失败、两个端口及重启竞争测试，若仍重新打开或控制错误实例，就否定方案；需要上游 API 协作和迁移旧标记。[Q03](../../plugins/arimakana-akane--dsh-sakurafrp/INSIGHT.md#research-q03)

[查看完整分析](../../plugins/arimakana-akane--dsh-sakurafrp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333673564-root"></a>

## [dsh-skill-mcp-panel](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md)

[![GitHub ★ 241](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=241&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fishquito7/dsh-skill-mcp-panel) [![npm 30d 5,726](https://img.shields.io/static/v1?label=npm+30d&message=5%2C726&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-mcp-panel) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-mcp-panel)

> **用途**：管理多个工作区Skill和MCP服务器的DSH用户可在侧栏或CLI读写配置，合格结果须文件/作用域正确且宿主实际发现预期能力。

> **亮点**：[Q01](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q01)、[Q02](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q02)、[Q03](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q03) 把多作用域技能操作、精确MCP条目编辑与CLI组织在同一管理面，避免仅按同名误改其他工作区。管理便利不能推出配置即生效或服务业务成功。

> **思考**：[Q02](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q02) 删除撤销只回填SKILL.md，不能恢复脚本/资源；注册表异常时导入仍可能记added。[Q03](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q03) 测试连接会求值!!js并启动进程/网络，配置写入、loader协调与业务可用须分别确认。

> **建议**：[Q05](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q05) 未验证假设是把落盘/发现/协调分层，异常发现保留未知，并提供完整目录恢复依据；已有added/skipped及reconciled不能被忽略，对照误判与恢复投入无改善就不增加操作负担。

[查看完整分析](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334434271-root"></a>

## [dsh-sysmon](../../plugins/aks1st--dsh-sysmon/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dsh-sysmon)

> **用途**：在 Web 页面粗看运行 DSH 的 Linux 宿主资源，及时识别明显压力。

> **亮点**：将常规宿主指标集成到 DSH Web，分离采样和请求以避免访问放大进程启动。详见[Q02](../../plugins/aks1st--dsh-sysmon/INSIGHT.md#research-q02)。

> **思考**：采样失败/接口故障时旧读数无时间戳或过期提示，可能被当作实时状态；同源头检查不能替代宿主鉴权。详见[Q03](../../plugins/aks1st--dsh-sysmon/INSIGHT.md#research-q03)。

> **建议**：为快照补采样时间、主机身份及过期态，故障时明确灰显；用故障注入对照误认率和开销，尚未实现。详见[Q05](../../plugins/aks1st--dsh-sysmon/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aks1st--dsh-sysmon/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333368566-root"></a>

## [dsh-telemetry-redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/dsh-telemetry-redactor) [![npm 30d 1,162](https://img.shields.io/static/v1?label=npm+30d&message=1%2C162&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-telemetry-redactor) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-telemetry-redactor)

> **用途**：给已有遥测共享需求的维护者减少特定凭据进入后端的机会，验收同时核对副本过滤、canonical保留与计数器完整。

> **亮点**：在后端收到记录前统一处理出站副本，保留原始事件，并用结构键、计数器例外及键冲突拒绝补足纯正则过滤。贡献是宿主边界内的安全组合，不是新秘密识别算法。详见[Q02](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md#research-q02)。

> **思考**：局部过滤不能证明全局无泄漏，未知凭据、输入外配置、直接backend调用和更外层prepend均不受完全保护；fail-closed还依赖官方协调器只丢弃失败副本。以上为源码及作者边界，未独立复现。详见[Q02](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md#research-q02)。

> **建议**：可探讨只含聚合原因的隐私安全丢弃收据，让过滤异常可观察而不带出原秘密；需核对收据自身泄漏和新增开销，尚未验证。详见[Q05](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1428375235-root"></a>

## [dsh-token-bi](../../plugins/361533652--dsh-token-bi/INSIGHT.md)



> **用途**：多项目和父子会话用户可用跨会话看板定位用量异常，token不是货币账单。[Q01](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q01)

> **亮点**：将公开会话服务的用量整理为交叉筛选和下钻入口，纯折叠与IO分离、活跃优先减少手工汇总；效益在排查便利，未证明精确账单或节费。[Q01](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q01) [Q02](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q02)

> **思考**：[Q03](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q03) 搜索/标题估算混入总量；磁盘缓存已增加日志摘要，但createdAt内存命中在前，强刷重建不能保证发现外部追加。报告显式先返stale并后台更新是首屏取舍，不能当实时计量。

> **建议**：可提出未验证的计量来源分账，保留provider_reported与estimated两个平行桶，缺usage另列unknown，不把估算合并到可对账总量；同时把已有磁盘摘要检查前置到内存命中之前，或统一绑定宿主持久修订令牌，强刷显式失效各层缓存。推导来自Q03的两个独立缺口，新增代价是报告Schema、CSV兼容和宿主修订获取成本。最小验证以固定事件集逐桶对照官方投影，再追加冷会话事件要求强刷可见；若修订检测需完整读日志而抵消缓存收益，或使用者仍混淆估算总量，就不能认为方案完整成立。当前未实现，不计入现有贡献。 [Q05](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/361533652--dsh-token-bi/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1348535666-root"></a>

## [dsh-token-stat](../../plugins/anna-la--dsh-token-stat/INSIGHT.md)



> **用途**：适合查看长期模型用量构成和日期趋势的DSH维护者；交付为可核对用量账本。

> **亮点**：独立归档让用量可跨日志删除保留，设置页和目录迁移降低长期维护门槛。[Q03](../../plugins/anna-la--dsh-token-stat/INSIGHT.md#research-q03) 主要贡献是生命周期组织，计量语义沿用既有usage。

> **思考**：模型工具只汇总当前folds，设置视图和报表合并归档；已删除会话可能造成入口口径不同。[Q04](../../plugins/anna-la--dsh-token-stat/INSIGHT.md#research-q04) 缓存字段和重试账单也不能由源码计数直接推断。

> **建议**：未验证假设是统一归档聚合并显示覆盖率及字段口径，可改善预算诊断可信度；以入口一致性和用户误判率验证。[Q07](../../plugins/anna-la--dsh-token-stat/INSIGHT.md#research-q07)

[查看完整分析](../../plugins/anna-la--dsh-token-stat/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350325873-root"></a>

## [dsh-tool-budget](../../plugins/173787247--dsh-tool-budget/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-tool-budget)

> **用途**：希望控制长任务中工具调用次数的 DSH 用户；真实频率和节省未知。

> **亮点**：[Q02](../../plugins/173787247--dsh-tool-budget/INSIGHT.md#research-q02) 对被跟踪工具累计对象级调用，在 guard 越限时拒绝；不等于共享费用预算。

> **思考**：[Q03](../../plugins/173787247--dsh-tool-budget/INSIGHT.md#research-q03) 无持久或跨 Agent 共享计数，且未验证前后执行对象同一性。

> **建议**：[Q05](../../plugins/173787247--dsh-tool-budget/INSIGHT.md#research-q05) 在现有提示外验证计数与范围展示对用户决策的影响；这是未实现假设。

[查看完整分析](../../plugins/173787247--dsh-tool-budget/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351594249-root"></a>

## [dsh-tool-explorer](../../plugins/6pofx--dsh-tool-explorer/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/6pofx/dsh-tool-explorer) [![npm 30d 655](https://img.shields.io/static/v1?label=npm+30d&message=655&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tool-explorer) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tool-explorer)

> **用途**：本机DSH管理员集中维护技能与MCP，需受信管理面和备份。详见[Q01](../../plugins/6pofx--dsh-tool-explorer/INSIGHT.md#research-q01)。

> **亮点**：将技能文件、共享lock/回收对象及MCP patch组织成可视管理交付，批选同仓一次下载省重复资源；承认作者所列社区参照。详见[Q01](../../plugins/6pofx--dsh-tool-explorer/INSIGHT.md#research-q01)。

> **思考**：技能改名只写MD后删旧目录，表单userInvocable键不等平台键，升级不保ref；Origin不等认证，多文件恢复不能靠HTTP成功判断。详见[Q04](../../plugins/6pofx--dsh-tool-explorer/INSIGHT.md#research-q04)。

> **建议**：服务端commit/完整目录摘要与必填版本绑定管理事务，整bundle改名、文件与lock/manifest可辨认提交，按漂移和失败反例检验，未验证。详见[Q08](../../plugins/6pofx--dsh-tool-explorer/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/6pofx--dsh-tool-explorer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1363291561-root"></a>

## [dsh-tts-flash](../../plugins/2021heei--dsh-tts-flash/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2021Heei/dsh-tts-flash)

> **用途**：桌面会话的听读辅助与等待反馈，适合可联网/可播放音频的本机环境。详见[Q01](../../plugins/2021heei--dsh-tts-flash/INSIGHT.md#research-q01)。

> **亮点**：把桌面浮条、等待语音和可替换 TTS 引擎接入 DSH 文本流。详见[Q01](../../plugins/2021heei--dsh-tts-flash/INSIGHT.md#research-q01)。

> **思考**：朗读音频不是完整覆盖；/engines 返回含 apiKey，探测把非401/403错误视可用，readJsonBody 异常分支引用未定义 res。详见[Q02](../../plugins/2021heei--dsh-tts-flash/INSIGHT.md#research-q02)至[Q04](../../plugins/2021heei--dsh-tts-flash/INSIGHT.md#research-q04)。

> **建议**：未验证改进为传播取消信号、引擎列表脱敏、成功码探测和统一同步/异步路由错误处理。详见[Q05](../../plugins/2021heei--dsh-tts-flash/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2021heei--dsh-tts-flash/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1343420855-root"></a>

## [dsh-ui-auth](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0QwQ0/dsh-ui-auth) [![npm 30d 1,561](https://img.shields.io/static/v1?label=npm+30d&message=1%2C561&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ui-auth) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ui-auth)

> **用途**：多人共用DSH Web时需要登录与按对象授权，合格结果涵盖未登录拒绝、跨用户不可见和管理员可恢复访问。详见[Q01](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md#research-q01)。

> **亮点**：将账户主体、对象归属、端点/结果/流帧策略和用户模型配置接入原宿主，超出单纯外部登录门，但属于应用层组合而非系统级租户隔离。详见[Q01](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md#research-q01)。

> **思考**：多用户隔离是否覆盖所有传输面是核心前提，mux排障退避可直接转发；本轮也未核查全部端点和底层工具共享，不能以登录页或作者测试计数替代完整隔离结论。详见[Q03](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md#research-q03)。

> **建议**：可探讨固定宿主端点/流帧与策略语义覆盖映射，升级遇未知项先拒绝并报告，再用跨用户反例比较漏放、误拒和维护成本。当前未验证。详见[Q06](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334023305-root"></a>

## [dsh-usage-dashboard-plus](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus) [![npm 30d 1,036](https://img.shields.io/static/v1?label=npm+30d&message=1%2C036&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-usage-dashboard-plus) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-usage-dashboard-plus)

> **用途**：个人用户查看会话内外调用趋势、余额和缓存表现。详见[Q01](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md#research-q01)。

> **亮点**：把外部视觉用量和原会话统计接到余额/消费看板。详见[Q01](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md#research-q01)。

> **思考**：明文session.jsonl被仅zstd解码成空，cacheWrite侧栏按input而投影按output，未知价仍套默认金额。详见[Q03](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md#research-q03)。

> **建议**：研究统一版本化计量核、明确格式/覆盖/去重回执与账户cache，比较漏计/金额差。当前未验证。详见[Q05](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1377159975-root"></a>

## [dsh-vps](../../plugins/aicivilization--dsh-vps/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AIcivilization/dsh-vps)

> **用途**：有 Linux VPS 且需要公网浏览器访问 DSH 完整管理界面的个人/小团队。

> **亮点**：把公网 DSH 部署、登录代理、受信任会话转译和服务器管理打包成连续流程；相对手工反代、认证、systemd 拼装有交付便利，具体增量与未验收边界见[Q01](../../plugins/aicivilization--dsh-vps/INSIGHT.md#research-q01)及[Q02](../../plugins/aicivilization--dsh-vps/INSIGHT.md#research-q02)。

> **思考**：辅助文件默认main漂移，setup.lock未建立且令牌缺失/不可读时向导退回开放；卸载tar失败但部分备份仍可chmod成功时可能继续删除，不保证备份可恢复。均为有条件静态核查，未作公网攻击或删除复现。详见[Q03](../../plugins/aicivilization--dsh-vps/INSIGHT.md#research-q03)。

> **建议**：基于网关交付增量和令牌/供应链/备份反例，提出未验证的可验证部署清单、封闭首次注册和恢复闸门组合；相对现版增加哈希钉住及失败拒绝，也增加维护和救援负担。故障注入对照与否定条件见[Q05](../../plugins/aicivilization--dsh-vps/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aicivilization--dsh-vps/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-root"></a>

## [dsh-web](../../plugins/zhu1090093659--dsh-web/INSIGHT.md)

[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web)

> **用途**：面向需要多项 DSH Web 功能的用户和维护多包组件的贡献者。

> **亮点**：[Q01](../../plugins/zhu1090093659--dsh-web/INSIGHT.md#research-q01) 与 [Q02](../../plugins/zhu1090093659--dsh-web/INSIGHT.md#research-q02) 显示根载具及生成器集中组织多包配置和维护；子包本身的功能不能归为根包独立实现。

> **思考**：[Q03](../../plugins/zhu1090093659--dsh-web/INSIGHT.md#research-q03) 与 [Q04](../../plugins/zhu1090093659--dsh-web/INSIGHT.md#research-q04) 表明固定根提交不锁定 profile 实际 registry 闭包，插入行也不等于启用、运行或故障隔离。

> **建议**：[Q06](../../plugins/zhu1090093659--dsh-web/INSIGHT.md#research-q06) 假设在用户同意下只读对照实际运行闭包与安装记录，可补充开发 lock 的运行状态盲区；方案、兼容和收益均未验证。

[查看完整分析](../../plugins/zhu1090093659--dsh-web/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-packages-dsh-web-all"></a>

## [dsh-web-all](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md)

[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 94,608](https://img.shields.io/static/v1?label=npm+30d&message=94%2C608&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all)

> **用途**：[Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md#research-q01) 面向需要多项家族功能且能管理 profile 的 DSH 用户。

> **亮点**：[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md#research-q02) 将多个插件依赖和行集中到一个 bundle，提供统一组合和可选兼容层；具体功能仍由对应子包实现。

> **思考**：[Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md#research-q03) 当前 patch 直挂子包，旧隔离壳代码不能证明所有行都具故障隔离；默认停用和依赖包含也需分开核对。

> **建议**：[Q04](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md#research-q04) 假设安装前逐行展示权限和默认状态可减少多余启用，需以相同需求对照正确率和配置时间，尚未验证。

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334255288-root"></a>

## [dsh-web-lan-access](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md)

[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-lan-access)

> **用途**：从局域网/Tailscale/VPN 其它设备访问 DSH Web 与 Host-backed 设置。

> **亮点**：把多接口远程 GUI/Host 设置可用性集合为一个 bundle，减少逐接口配置；同时扩大暴露面。详见[Q01](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md#research-q01)、[Q02](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md#research-q02)。

> **思考**：插件有意绕过上游 wildcard 禁止，0.0.0.0 监听所有可达接口，自动信任非 internal IPv4；Host 栅栏不是身份认证。详见[Q03](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md#research-q03)。

> **建议**：限制为显式单接口或审核后的接口白名单，并与防火墙/认证验证绑定，比较可用性与实际暴露面；本版未实现。详见[Q04](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335060007-root"></a>

## [dsh-web-restart](../../plugins/1123762794--dsh-web-restart/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1123762794/dsh-web-restart)

> **用途**：作者 Windows Web profile 的维护操作；单击会中断 DSH 服务，脚本路径必须按机器改。详见[Q01](../../plugins/1123762794--dsh-web-restart/INSIGHT.md#research-q01)。

> **亮点**：将重启入口与在线状态点放进 DSH Web 侧栏；用户可从界面触发作者环境的维护动作。详见[Q01](../../plugins/1123762794--dsh-web-restart/INSIGHT.md#research-q01)。

> **思考**：已触发 UI 不代表重启成功，路由只有方法/重入检查；全权限外部脚本和单击中断需核外层授权。详见[Q03](../../plugins/1123762794--dsh-web-restart/INSIGHT.md#research-q03)与[Q04](../../plugins/1123762794--dsh-web-restart/INSIGHT.md#research-q04)。

> **建议**：未验证改进为受控脚本路径、管理员授权/确认、异步 job 回执和恢复验收；先在隔离环境实测。详见[Q05](../../plugins/1123762794--dsh-web-restart/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1123762794--dsh-web-restart/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1363511446-root"></a>

## [dsh-workspace-tools](../../plugins/ahiosuz--dsh-workspace-tools/INSIGHT.md)



> **用途**：多个工作区有不同默认 Agent/权限要求，减少新会话重复选择。详见[Q01](../../plugins/ahiosuz--dsh-workspace-tools/INSIGHT.md#research-q01)。

> **亮点**：在官方扩展点上提供工作区级默认规则与设置 UI，避免每次新建根会话手动重选。详见[Q01](../../plugins/ahiosuz--dsh-workspace-tools/INSIGHT.md#research-q01)。

> **思考**：权限可能在异步 Agent 预设选择之后才更新，首 turn 时序未知；旧/大小写路径回退可能误匹配。详见[Q03](../../plugins/ahiosuz--dsh-workspace-tools/INSIGHT.md#research-q03)和[Q04](../../plugins/ahiosuz--dsh-workspace-tools/INSIGHT.md#research-q04)。

> **建议**：未验证改进是创建时等待应用、区分 OS 路径语义、隔离已删除工作区规则并明确保存冲突提示。详见[Q05](../../plugins/ahiosuz--dsh-workspace-tools/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/ahiosuz--dsh-workspace-tools/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854066-root"></a>

## [dsh-wsl-clock](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-clock)

> **用途**：WSL笔记本睡眠后出现TLS/JWT失败时，开发者需要先核双时钟。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md#research-q01) 把双时钟只读比较接入模型工具和提示，复用系统读数，不是自动校时。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md#research-q02) 顺序采样混入命令延迟，空输出Number为0未拒绝；一次fail不等时钟根因。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md#research-q04) 可探索采样窗/不确定区间与有效性校验，若误警不降或中途校时使结论误导即否定。

[查看完整分析](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381842592-root"></a>

## [dsh-wsl-compose](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-compose)

> **用途**：可信项目目录中的 Docker Compose 初筛与受控变更；生产操作需宿主审批。详见[Q01](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md#research-q01)。

> **亮点**：把 Compose 诊断与基本启动/停止接入 DSH 工具，并默认关闭变更。详见[Q01](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md#research-q01)。

> **思考**：双布尔条件不等于人工二次确认，开启变更且空 allowRoots 时可触及任意项目；超时需核实际 daemon 状态。详见[Q03](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md#research-q03)与[Q04](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md#research-q04)。

> **建议**：未验证改进为强制目录根、宿主用户审批、stderr 流界及超时返回待复核状态。详见[Q05](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381859591-root"></a>

## [dsh-wsl-db](../../plugins/173787247--dsh-wsl-db/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-db)

> **用途**：开发者在受信 WSL 测试数据库做连通性与有限读取排障。详见[Q01](../../plugins/173787247--dsh-wsl-db/INSIGHT.md#research-q01)。

> **亮点**：将常见 PostgreSQL/Redis 排障入口统一为 Agent 工具，默认限制连接 URL/Redis host。详见[Q01](../../plugins/173787247--dsh-wsl-db/INSIGHT.md#research-q01)。

> **思考**：SQL SELECT/EXPLAIN 仍可触发副作用，连接 URI 进入 psql argv；输出截断不限制 DB 端资源。详见[Q03](../../plugins/173787247--dsh-wsl-db/INSIGHT.md#research-q03)与[Q04](../../plugins/173787247--dsh-wsl-db/INSIGHT.md#research-q04)。

> **建议**：未验证改进为角色级只读、禁高成本 Redis 命令、凭据保护和探测分项状态明确化。详见[Q05](../../plugins/173787247--dsh-wsl-db/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-db/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391141174-root"></a>

## [dsh-wsl-defender](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-defender)

> **用途**：面向在 WSL 内工作的 Windows 开发者，让代理在诊断环境时读取宿主安全态势而不修改设置。 [Q01](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md#research-q01)

> **亮点**：相对手工切到 PowerShell，它把多个安全查询聚合成 DSH 可读结果并保持只读，降低跨系统诊断交接。 [Q03](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md#research-q03)

> **思考**：返回值受 Windows 版本、权限、Defender 可用性和本地化字段影响，聚合结果也不是合规审计或威胁已处置证明。 [Q04](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md#research-q04)

> **建议**：可增加带时间戳的差异快照，只突出防护关闭、签名过旧和新增排除项，并要求用户确认后再建议任何修复动作。 [Q08](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md#research-q08)

[查看完整分析](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854118-root"></a>

## [dsh-wsl-dns](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-dns)

> **用途**：WSL访问模型/GitHub/npm异常时需要比较两侧解析现象。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q01) 两侧查询/配置片段汇为模型工具减少手查，复用既有系统解析能力。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q02) 错误折叠为空、ok只看WSL，两侧不同非劫持证明；总预算/取消未贯通。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q04) 比较收据保留来源/时间/错误与统一deadline；误改配置不降或额外披露不值得即否定。

[查看完整分析](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854301-root"></a>

## [dsh-wsl-docker](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-docker)

> **用途**：Docker Desktop/WSL/推理容器混淆时做初筛，实际context/端点/模型就绪另核。

> **亮点**：集中Docker上下文与推理线索减少手工接线，不是GPU或API完整验收。详见[Q01](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q01)与[Q02](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q02)。

> **思考**：404也health ok且遮蔽专门错误提示，空DeviceRequests可判GPU，内部8000暴露/远程context与固定本机探测错配。详见[Q02](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q02)。

> **建议**：可探讨context/映射结构解析与daemon/设备/HTTP协议分级收据、总deadline，反例仍假绿灯则证伪实现。详见[Q05](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854212-root"></a>

## [dsh-wsl-editor](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-editor)

> **用途**：在WSL完成任务后到Windows桌面查看源码/日志。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md#research-q01) 减少路径转换和goto命令手填步骤，原生DSH双工具入口成立。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md#research-q02) launcher成功非文档验收；status和.exe启动不对称，相对path非session cwd，逐次预算/取消未贯通。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md#research-q04) 会话目标与分层收据/统一deadline可降低错文件和重复窗口，若不优于手工即否定。

[查看完整分析](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391143266-root"></a>

## [dsh-wsl-eventlog](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-eventlog)

> **用途**：WSL 用户初筛 Windows System/Application 等日志的严重事件；非完整审计。详见[Q01](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q01)。

> **亮点**：把 Windows 事件日志的初步查询暴露给 WSL 中的 Agent，参数和结果结构较简洁。详见[Q01](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q01)。

> **思考**：后置过滤的空结果不能证明无事件；full 的实际呈现长度与执行层不一致。详见[Q03](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q03)和[Q04](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q04)。

> **建议**：未验证改进为源端过滤、分页/总量、full 渲染对齐和敏感字段控制。详见[Q05](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1362694736-root"></a>

## [dsh-wsl-fetch](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-fetch)

> **用途**：WSL 中官方 web_fetch 直连失败而 Windows HTTP 代理可用的公开网页抓取。详见[Q01](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q01)。

> **亮点**：将代理放入官方 web_fetch 进程内调用链，并在无代理/已有其他 provider 时避免强行覆盖。详见[Q01](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q01)。

> **思考**：公有域名解析到私网的路径不受此插件代码校验，普通 sleep 不响应 deadline；宿主与代理外层控制未知。详见[Q03](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q03)和[Q04](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q04)。

> **建议**：未验证改进是代理最终目的地约束、可中止退避、配置上限和受控站点效果测量。详见[Q05](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381843528-root"></a>

## [dsh-wsl-helm](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-helm)

> **用途**：用于 Kubernetes 发布排查前的只读查询；合格输出须明确集群与命名空间，不能代替健康判断。详见[Q01](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q01)。

> **亮点**：把 Helm CLI 的常用只读操作封装成 Agent 工具，控制动词并标识输出截断；增量是调用边界与呈现，发布语义仍属 Helm。详见[Q01](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q01)。

> **思考**：guardContext 对空值直接放行，配置白名单不约束 Helm 默认上下文；此外 stderr 只在返回时裁剪而非累计限量。不能把“只读”误解为目标正确或无敏感信息。详见[Q03](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q03)。

> **建议**：未验证方向是每次解析实际 context 并统一按白名单检查、回显目标，同时限制 stderr 累计；双集群和高输出夹具评估正确率、延迟与内存。详见[Q05](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381832318-root"></a>

## [dsh-wsl-llamacpp](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-llamacpp)

> **用途**：已有 GGUF/llama.cpp 服务时将个别辅助请求交给本地模型。详见[Q01](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md#research-q01)。

> **亮点**：降低 Agent 调用本地 OpenAI 兼容 GGUF 服务的接线成本。详见[Q01](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md#research-q01)。

> **思考**：健康 ok:true 与可达性分离、状态超时不一致，最大 prompt 限制只对单 prompt 生效。详见[Q03](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md#research-q03)和[Q04](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md#research-q04)。

> **建议**：未验证改进为一致健康语义、输入/输出边界和本机 URL 限制。详见[Q05](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381860693-root"></a>

## [dsh-wsl-mail](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-mail)

> **用途**：本机邮件客户端已配置时做只读收件箱初筛；不读完整正文或发送邮件。详见[Q01](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md#research-q01)。

> **亮点**：把本机邮件元数据和索引摘要以只读工具给 Agent，降低命令行检索步骤。详见[Q01](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md#research-q01)。

> **思考**：notmuch 缺失时“未读”计数实际为近期信封数；长 JSON 输出截断后仍可能以 ok:true 文本呈现。详见[Q02](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md#research-q02)与[Q03](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md#research-q03)。

> **建议**：未验证改进为返回 countKind/索引时间、严格标示截断并限制 stderr 内存。详见[Q05](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854159-root"></a>

## [dsh-wsl-mnt](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-mnt)

> **用途**：WSL git/npm慢时先检查是否使用Windows目录。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md#research-q01) 将常见工作区位置提醒放入模型工具，减少路径信息手抄。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md#research-q02) ok仅非/mnt，未核挂载/symlink/会话cwd，建议目标未预检。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md#research-q04) 可探索挂载证据/冲突预检/同机负载，若误迁移和成本不改善即否定。

[查看完整分析](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338965593-root"></a>

## [dsh-wsl-net](../../plugins/173787247--dsh-wsl-net/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-net)

> **用途**：WSL维护者可把工具进程、宿主进程、代理监听和HTTP响应集中查看，辅助排查Windows能联网而Agent失败。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-net/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-net/INSIGHT.md#research-q02) 将进程差异、代理监听与HTTP响应组织成Agent可读报告，减少线索拼接。价值仍取决于PID正确和对探测语义的理解，未测节时。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-net/INSIGHT.md#research-q02) HTTP<500只是收到响应，不能证明业务成功；修复脚本会插入未脱敏代理值，默认共享subprocess包装没有显式还原路径。带凭据代理和共享宿主不适合直接采用。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-net/INSIGHT.md#research-q04) 可研究分层结果、只引用变量的无凭据修复计划和可还原注入，用固定故障比较误诊、回显及恢复成本；目前未实现或验证。

[查看完整分析](../../plugins/173787247--dsh-wsl-net/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381724774-root"></a>

## [dsh-wsl-ollama](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-ollama)

> **用途**：已有 Ollama 模型的本机/WSL 辅助调用；不是 DSH 主模型提供器。详见[Q01](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md#research-q01)。

> **亮点**：简化 Agent 对本地 Ollama 模型的自查、聊天与向量获取。详见[Q01](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md#research-q01)。

> **思考**：只看 status.ok 会误判连通；maxPromptChars 不限制 messages 分支，且 baseUrl 并非保证本地。详见[Q03](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md#research-q03)和[Q04](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md#research-q04)。

> **建议**：未验证改进为统一 reachable/ok、传播取消、限所有消息/向量长度及展示地址边界。详见[Q05](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391142601-root"></a>

## [dsh-wsl-perf](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-perf)

> **用途**：Windows 宿主低频性能初筛，需与任务管理器对照。详见[Q01](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md#research-q01)。

> **亮点**：把 Windows 宿主多个指标一次聚合给 WSL 中的 Agent。详见[Q01](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md#research-q01)。

> **思考**：缺失数据归零与单次 CPU/进程 CPU 混用会误导瓶颈归因；top 只限输出不限制枚举。详见[Q02](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md#research-q02)至[Q04](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md#research-q04)。

> **建议**：未验证改进为每字段状态、采样时间和进程 CPU 差分。详见[Q05](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391140034-root"></a>

## [dsh-wsl-power](../../plugins/173787247--dsh-wsl-power/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-power)

> **用途**：WSL Agent 对本机 Windows 电源状态做初步诊断。详见[Q01](../../plugins/173787247--dsh-wsl-power/INSIGHT.md#research-q01)。

> **亮点**：以单工具聚合多个 Windows 电源状态指标。详见[Q01](../../plugins/173787247--dsh-wsl-power/INSIGHT.md#research-q01)。

> **思考**：英语字符串解析、休眠关键词匹配与数值失败归零可能把未知当事实。详见[Q03](../../plugins/173787247--dsh-wsl-power/INSIGHT.md#research-q03)和[Q04](../../plugins/173787247--dsh-wsl-power/INSIGHT.md#research-q04)。

> **建议**：未验证改进是改用稳定结构化 API/GUID、保留每字段错误状态。详见[Q05](../../plugins/173787247--dsh-wsl-power/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-power/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381859181-root"></a>

## [dsh-wsl-rclone](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-rclone)

> **用途**：已有 rclone remote 时辅助查看云端目录与用量，适合只读诊断。详见[Q01](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md#research-q01)。

> **亮点**：把现有 rclone 配置的只读观察能力接入 Agent。详见[Q01](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md#research-q01)。

> **思考**：允许列表默认开放、lsf 先递归后切片可能带来远端访问与计费；健康 ok:true 易误判。详见[Q02](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md#research-q02)至[Q04](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md#research-q04)。

> **建议**：未实现的改进为默认拒绝远程、显式阻断动态 backend、真实上游分页/限额与健康语义。详见[Q05](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391142974-root"></a>

## [dsh-wsl-registry](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-registry)

> **用途**：在 WSL 里运行 DSH、需核 Windows 软件或系统键值的诊断用户。

> **亮点**：把 WSL 到 Windows PowerShell 的注册表读取封装为模型工具，提供常用前缀与 Run 段筛选；底层读取仍由 Windows 命令和 ACL 完成。详见[Q01](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md#research-q02)。

> **思考**：路径白名单只用 startsWith，无段边界；具名值不受作者所称400字符裁剪。通配符/权限影响未实测，不把静态缺口说成已读取禁区。详见[Q03](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md#research-q03)。

> **建议**：可用规范化 Hive/段边界及统一值裁剪，并在隔离测试键上比较前缀碰撞、通配符、合法路径与长值的拒绝/保留；当前未实现。详见[Q04](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381733290-root"></a>

## [dsh-wsl-secret](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-secret)

> **用途**：WSL/Linux 用户用已有 pass/age 密钥驱动同一 DSH 进程的其他工具，需避免聊天暴露与跨插件扩散。

> **亮点**：把已有 pass/age 操作接入 DSH 工具并提供默认拒读和 to_env 流程；底层加密仍由外部工具承担。详见[Q02](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md#research-q02)。

> **思考**：to_env 将明文放进整个进程环境，预览泄露首尾字符/长度；age 路径仅词法前缀判断、reveal 可给原始 value，不能当跨插件隔离。详见[Q03](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md#research-q03)。

> **建议**：短时工具级句柄结合 realpath 路径复核可能缩小明文可见范围和符号链接越界；需假密钥双插件对照，尚未实现。详见[Q05](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391140376-root"></a>

## [dsh-wsl-service](../../plugins/173787247--dsh-wsl-service/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-service)

> **用途**：开发者跨 WSL/Windows 排查服务运行状态和启动方式；不负责启停。详见[Q01](../../plugins/173787247--dsh-wsl-service/INSIGHT.md#research-q01)。

> **亮点**：把 Windows 服务元数据带进 WSL Agent 对话，省手工跨系统查询。详见[Q01](../../plugins/173787247--dsh-wsl-service/INSIGHT.md#research-q01)。

> **思考**：详情包含系统账户/路径，权限由宿主决定；全量枚举可能在服务多时变慢。详见[Q03](../../plugins/173787247--dsh-wsl-service/INSIGHT.md#research-q03)和[Q04](../../plugins/173787247--dsh-wsl-service/INSIGHT.md#research-q04)。

> **建议**：未验证改进为按名服务端查询、分页/时间戳和敏感字段按需返回。详见[Q05](../../plugins/173787247--dsh-wsl-service/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-service/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854253-root"></a>

## [dsh-wsl-shot](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-shot)

> **用途**：用户已复制Windows图片，希望在WSL的DSH会话中引用。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md#research-q01) 封装剪贴板图片跨OS落盘并返回路径，减少搬移步骤。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md#research-q02) Public临时图失败可残留，时间戳/固定目标可撞或覆盖，取消不等落盘停止。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md#research-q04) 独占临时协议/不覆盖和清理状态可减少错图残留；若误回收或负担更高即否定。

[查看完整分析](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381832935-root"></a>

## [dsh-wsl-struct](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-struct)

> **用途**：在明确授权数据上重复进行结构化查询，需正确结果和实际进程边界。

> **亮点**：将参数化CLI、主路径realpath、SQLite readonly和错误输出接到DSH，算法与表达式能力来自上游。详见[Q01](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md#research-q01)与[Q02](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md#research-q02)。

> **思考**：主路径谓词在POSIX接受反斜杠前缀可误认兄弟目录，也不限制CLI全部能力；raw spawn无宿主沙箱且默认HOME/tmp过宽；which/取消/输出资源边界也不完整。详见[Q02](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md#research-q02)。

> **建议**：可探讨固定CLI的最小进程能力查询，接宿主policy/abort、环境/表达式与输出预算；兼容维护成本未验证。详见[Q04](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381843201-root"></a>

## [dsh-wsl-systemd](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-systemd)

> **用途**：适合DSH宿主处在目标Linux/WSL用户会话、需要查看Ollama/自托管API等用户服务的状态和近期日志的维护者。基线手工执行systemctl --user与journalctl --user，再把结果交给模型；插件提供可调用的固定读操作与结构化/文本回执，不启动/停止/enable服务。

> **亮点**：把用户systemd手工list/show/journal整合为五入口四操作，提供单位约束、固定argv与结构化观察回执；不提供修复。详见[Q02](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md#research-q02)。

> **思考**：发现命令which没有error/timeout，执行取消未贯穿；stderr无界、成功render隐藏truncated，日志只读仍可能披露秘密。详见[Q03](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md#research-q03)。

> **建议**：可探索贯穿发现/执行deadline、双流预算和显式截断/阶段回执，以假执行器对照终止和信息保留；未实现。详见[Q05](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381843937-root"></a>

## [dsh-wsl-terraform](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-terraform)

> **用途**：面向已有初始化Terraform/OpenTofu项目的开发/运维人员，在DSH查CLI版本、validate、变更计数摘要和state资源地址列表。适合先了解拟变更数量、验证配置与资源范围，不提供apply/destroy接口，不取代完整plan评审、云权限和变更审批。

> **亮点**：把固定validate/plan/state命令与参数化目录、计数/错误结果接入DSH，限制模型可选IaC动作。详见[Q02](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md#research-q02)。

> **思考**：plan仅exit1拒绝，其他exit/null可ok:true；先截stdout可能丢Plan尾行，state500条截断未标，render隐藏部分状态。allowRoots默认空无限制且继承Host环境，不等价沙箱。详见[Q03](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md#research-q03)。

> **建议**：可探索仅exit0/2成功、完整原件hash/摘要来源、state完整性收据和最小env/signal/单目录串行，比较误判与资源成本；未实现。详见[Q06](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381832640-root"></a>

## [dsh-wsl-vllm](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-vllm)

> **用途**：已有 vLLM 的 WSL 开发者让 Agent 按需查询模型并调用本地聊天补全。详见[Q01](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md#research-q01)。

> **亮点**：为现有 vLLM 提供轻量按需工具，包含状态探测和补全返回 usage。详见[Q01](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md#research-q01)。

> **思考**：总输入不受 maxPromptChars 保证，reachable:false 仍 ok:true；服务资源和取消语义未知。详见[Q03](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md#research-q03)与[Q04](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md#research-q04)。

> **建议**：未验证改进为组合消息总上限、宿主取消信号传递和状态超时一致化。详见[Q05](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391143632-root"></a>

## [dsh-wsl-winctl](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-winctl)

> **用途**：可交互 Windows 桌面的窗口管理辅助；变更前需明确唯一目标。详见[Q01](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md#research-q01)。

> **亮点**：把 Windows 窗口枚举和基础控制封装为 WSL Agent 工具。详见[Q01](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md#research-q01)。

> **思考**：作者显式目标承诺与空目标首窗选择不符；activate/close 等返回值被忽略，成功状态不可直接信。详见[Q03](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md#research-q03)和[Q04](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md#research-q04)。

> **建议**：未验证改进为强制目标唯一、标题字面匹配、实际焦点调用及事后状态确认。详见[Q05](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391140767-root"></a>

## [dsh-wsl-winshot](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-winshot)

> **用途**：可见 Windows 桌面窗口的取图辅助；非无头或完整窗口内容保证。详见[Q01](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md#research-q01)。

> **亮点**：把 Windows 指定窗口画面转为 WSL PNG，支持元素名/坐标裁剪。详见[Q01](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md#research-q01)。

> **思考**：CopyFromScreen 捕获屏幕可见像素并恢复最小化窗口；临时图位于 Public 且异常未保证清理，Agent 输出仅是文本路径。详见[Q02](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md#research-q02)至[Q04](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md#research-q04)。

> **建议**：未验证改进为句柄选择、遮挡无关捕获、finally 清理与私有目录/受控图片展示。详见[Q05](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854461-root"></a>

## [dsh-wsl-wslconfig](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-wslconfig)

> **用途**：Windows与WSL网络/资源配置初步排查。详见[Q01](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md#research-q01)。

> **亮点**：把找配置和常见提示接入单工具，减少手工整理。详见[Q01](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md#research-q01)。

> **思考**：猜测/Public文件未必生效配置，后2000字符不参与解析，读取失败仍ok并按空模式建议。详见[Q03](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md#research-q03)。

> **建议**：研究来源/读取诊断及声明-加载-连通分层，比较误诊和原文外发量，尚未验证。详见[Q05](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1406500233-root"></a>

## [dsh-zspace](../../plugins/439436269-ctrl--dsh-zspace/INSIGHT.md)

[![npm 30d 1,242](https://img.shields.io/static/v1?label=npm+30d&message=1%2C242&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-zspace) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-zspace)

> **用途**：适合从对话读取/传输 NAS 文件、检查容器和健康状态；重启、删除等管理任务用官方客户端更易确认目标。 详见[Q01](../../plugins/439436269-ctrl--dsh-zspace/INSIGHT.md#research-q01)。

> **亮点**：双通道自动探测与业务错误判定提升家用 NAS 可达性，且能区分 containerd 卡死与需整机重启。 详见[Q03](../../plugins/439436269-ctrl--dsh-zspace/INSIGHT.md#research-q03)。

> **思考**：依赖社区逆向/私有 API 与本地 vuex 凭据；confirm=true 仍只是模型参数，不能替代人在设备级破坏操作前的独立批准。 详见[Q04](../../plugins/439436269-ctrl--dsh-zspace/INSIGHT.md#research-q04)。

> **建议**：把读写工具拆成不同权限，并要求重启/删除通过 Host 侧一次性批准令牌，可显著降低模型误触发半径。 详见[Q08](../../plugins/439436269-ctrl--dsh-zspace/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/439436269-ctrl--dsh-zspace/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336708336-root"></a>

## [DSHBox](../../plugins/wsk-build--dshbox/INSIGHT.md)

[![GitHub ★ 351](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=351&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WSK-build/DSHBox)

> **用途**：希望手机使用DSH、避免手搭Termux环境的Android用户；本地DSH不等本地模型推理，见 [Q01](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q01)。

> **亮点**：集成启动、当前token刷新、分层数据和移动交互，减少环境拼接，见 [Q01](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q01)。

> **思考**：PRoot/共享与Android授权非安全VM，自动化全执行链未穷核，后台/更新和真实数据恢复未验，见 [Q02](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q02) 与 [Q03](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q03)。

> **建议**：分层健康+可恢复任务检查点，对照手搭测休眠/升级/撤权后资料与任务恢复，未实现，见 [Q03](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/wsk-build--dshbox/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1158472225-root"></a>

## [EchoBird](../../plugins/edison7009--echobird/INSIGHT.md)

[![GitHub ★ 3,472](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C472&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/edison7009/EchoBird)

> **用途**：面向配置多个模型供应方、需要统一客户端入口和故障回退的桌面用户。

> **亮点**：[Q02](../../plugins/edison7009--echobird/INSIGHT.md#research-q02) 将模型候选、健康与本地协议入口组织起来；账号切换和模型路由不同，也不是按任务质量选模型。

> **思考**：[Q03](../../plugins/edison7009--echobird/INSIGHT.md#research-q03) Responses 续接绑定原供应方，配置变更或过期需完整输入；[Q04](../../plugins/edison7009--echobird/INSIGHT.md#research-q04) 切换可能产生不同数据流和费用。

> **建议**：[Q06](../../plugins/edison7009--echobird/INSIGHT.md#research-q06) 提出用脱敏固定题集在启用前比较候选输出和工具调用，需衡量误拒、费用和任务覆盖。

[查看完整分析](../../plugins/edison7009--echobird/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1363739656-packages-enterprise-connection"></a>

## [Enterprise Connection](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md)

[![GitHub ★ 274](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=274&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/techflag/workdsh)

> **用途**：公司管理员给匹配WorkDSH Desktop用户分发企业代码，再连接账号；不是给任意DSH用户即装即用的企业后台，见 [Q01](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md#research-q01)。

> **亮点**：固定依赖集合、可追commit/sha256的pack清单和复用身份客户端构成有限分发贡献；核心身份/协作归其他包和后台，不计整仓能力，见 [Q01](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md#research-q01)。

> **思考**：源码缺浏览器出口但有明确生成链，不能判空占位也不能判成品可用；安装代码不等授权，装配不复制个人profile也不等登录后企业正文不上传，见 [Q01](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md#research-q01) 与 [Q02](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md#research-q02)。

> **建议**：未形成独立产品方向；可验证交付/身份/资源/正文各状态的验收收据能否减少安装即授权误判，依赖现有manifest与状态而未实现，见 [Q03](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1364766828-root"></a>

## [feishu-dsh-plugin](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2286893544/feishu-dsh-plugin)

> **用途**：企业自建飞书应用下的 Agent 读取与编辑协作资产；需 scopes 和对象授权。详见[Q01](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md#research-q01)。

> **亮点**：把多种飞书资源统一为 Agent 工具，含创建 wiki 文档与人类接管授权路径。详见[Q01](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md#research-q01)。

> **思考**：创建成功不保证 grantOpenId 已获 full_access；图片 URL/本地路径缺约束，写操作需明确用户授权。详见[Q03](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md#research-q03)与[Q04](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md#research-q04)。

> **建议**：未验证改进为创建/授权事务化状态、图片 allowlist/限量、写操作幂等与连接路由鉴权加强。详见[Q05](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1194748811-root"></a>

## [HOL Guard](../../plugins/hashgraph-online--hol-guard/INSIGHT.md)

[![GitHub ★ 1,038](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C038&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hashgraph-online/hol-guard)

> **用途**：面向需要管理多个 Agent 和工具调用风险的开发者或团队。

> **亮点**：[Q02](../../plugins/hashgraph-online--hol-guard/INSIGHT.md#research-q02) 统一不同宿主 verdict 映射及代表性失败拒绝；不等于所有入口被保护。

> **思考**：[Q03](../../plugins/hashgraph-online--hol-guard/INSIGHT.md#research-q03) DSH 格式扫描不证明 DSH 运行时拦截，post 钩子不能撤销已执行动作。

> **建议**：[Q05](../../plugins/hashgraph-online--hol-guard/INSIGHT.md#research-q05) 对每个宿主入口展示最近受控探针的阻断/记录/未知状态，须测覆盖与负担。

[查看完整分析](../../plugins/hashgraph-online--hol-guard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-292529340-root"></a>

## [K8E](../../plugins/xiaods--k8e/INSIGHT.md)

[![GitHub ★ 512](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=512&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiaods/k8e)

> **用途**：面向已有 Linux 运维能力的团队，为 AI 任务提供持续沙箱工作区；根组件是基础设施，DSH 接入位于子目录。

> **亮点**：[Q02](../../plugins/xiaods--k8e/INSIGHT.md#research-q02) 的实际贡献是把文件、执行和生命周期放入同一会话所有权，减少接入方自行维护上下文；底层隔离与集群能力来自所选运行时。

> **思考**：[Q03](../../plugins/xiaods--k8e/INSIGHT.md#research-q03) 的文件适配保留工作区外绝对路径的本机访问，销毁还依赖 GC 兜底，不能把统一入口等同于全访问隔离或确定回收。

> **建议**：[Q05](../../plugins/xiaods--k8e/INSIGHT.md#research-q05) 提出未验证的位置与会话归属可见性假设；同任务比较错误归属、人工核对和残留资源，若不改善则推翻。

[查看完整分析](../../plugins/xiaods--k8e/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1175756746-root"></a>

## [mem9](../../plugins/mem9-ai--mem9/INSIGHT.md)

[![GitHub ★ 1,233](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C233&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mem9-ai/mem9)

> **用途**：多助手和多设备用户需要保留、召回及更正长期事实。

> **亮点**：[Q01](../../plugins/mem9-ai--mem9/INSIGHT.md#research-q01) 与 [Q02](../../plugins/mem9-ai--mem9/INSIGHT.md#research-q02) 将多客户端持久状态接到统一服务；向量能力归底层，相关性不等于事实正确。

> **思考**：[Q03](../../plugins/mem9-ai--mem9/INSIGHT.md#research-q03) 部分搜索分支清空 source/session 条件，[Q04](../../plugins/mem9-ai--mem9/INSIGHT.md#research-q04) 默认自动出站且异步写入不保证崩溃后送达。

> **建议**：[Q06](../../plugins/mem9-ai--mem9/INSIGHT.md#research-q06) 假设待确认及版本化撤销可减少共享错误事实传播，须先核现有功能且尚未验证。

[查看完整分析](../../plugins/mem9-ai--mem9/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1231135337-root"></a>

## [Mirage](../../plugins/strukto-ai--mirage/INSIGHT.md)

[![GitHub ★ 3,759](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C759&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/strukto-ai/mirage)

> **用途**：需要跨数据源管道的 Agent 平台开发者；单源任务可比较专用 API。[Q01](../../plugins/strukto-ai--mirage/INSIGHT.md#research-q01)

> **亮点**：组合多源虚拟路径、命令、session 和权限，DSH 是可选接入入口，本项不研究其实现。[Q01](../../plugins/strukto-ai--mirage/INSIGHT.md#research-q01) [Q02](../../plugins/strukto-ai--mirage/INSIGHT.md#research-q02)

> **思考**：VFS 写入复查依赖 effect 声明；外部授权、runtime 隔离和跨源部分失败不能由统一路径自动保证。[Q03](../../plugins/strukto-ai--mirage/INSIGHT.md#research-q03)

> **建议**：未验证假设：显示后端、声明 effect 和部分失败恢复信息可减少误判；对照 SDK 测正确率与成本。[Q05](../../plugins/strukto-ai--mirage/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/strukto-ai--mirage/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1231135337-typescript-packages-dsh"></a>

## [Mirage DSH Providers](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md)

[![GitHub ★ 3,759](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C759&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/strukto-ai/mirage) [![npm 30d 1,152](https://img.shields.io/static/v1?label=npm+30d&message=1%2C152&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@struktoai/mirage-dsh) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@struktoai/mirage-dsh)

> **用途**：希望 DSH 操作 Mirage 挂载工作区的平台开发者；基线为原生文件和 shell。[Q01](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md#research-q01)

> **亮点**：把两个 DSH provider 接到同一虚拟路径空间；Mirage 平台功能不归子组件。[Q01](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md#research-q01) [Q02](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md#research-q02)

> **思考**：单次 VFS 操作不能在内部取消，spill 可能失败；无 approver 保持待决而不是自动通过。[Q02](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md#research-q02) [Q03](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md#research-q03)

> **建议**：未验证假设：非破坏性检查 fs、shell、spill 和审批的一致性可减少错配；须对照现有共享分发验证。[Q05](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1206555053-root"></a>

## [Open Managed Agents (OpenMA)](../../plugins/openma-ai--open-managed-agents/INSIGHT.md)

[![GitHub ★ 342](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=342&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openma-ai/open-managed-agents)

> **用途**：需要自行管理Agent会话、执行环境和恢复的团队；使用范围须固定harness/部署/存储合同，见 [Q01](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q01)。

> **亮点**：会话/执行环境/harness分层，真工具循环、领取续租和可配置确认成为托管执行基础，见 [Q01](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q01) 与 [Q02](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q02)。

> **思考**：持久租约非外部动作exactly-once；缺省许可可allow、确认/共享sandbox/凭据隔离依配置，API与云合同不同，见 [Q02](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q02)。

> **建议**：动作ID/许可/后置证据连接租约、事件与检查点，接手先对账，测故障重复/遗漏和总成本，未实现，见 [Q03](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/openma-ai--open-managed-agents/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350368388-packages-plugin"></a>

## [opencode2dsh](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md)

[![GitHub ★ 384](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=384&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FishBottle7/opencode2dsh) [![npm 30d 13,802](https://img.shields.io/static/v1?label=npm+30d&message=13%2C802&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencode2dsh/dsh-plugin) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencode2dsh/dsh-plugin)

> **用途**：希望在 DSH 使用 OpenCode Zen 匿名模型的用户；基线是现有 provider 或直接使用上游。[Q01](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q01)

> **亮点**：将目录与流协议接入 DSH，不将模型服务归于适配器。[Q01](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q01) [Q02](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q02)

> **思考**：目录探测与直接调用门控不同；答案或工具后中断仍需对账，不能保证恰好一次。[Q02](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q02) [Q03](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q03)

> **建议**：未验证假设：分开展示目录、出口探测和实际中断状态可减少误判；须与现有机制对照。[Q05](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/fishbottle7--opencode2dsh--packages-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1081166515-root"></a>

## [OpenGuardrails](../../plugins/openguardrails--openguardrails/INSIGHT.md)

[![GitHub ★ 361](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=361&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openguardrails/openguardrails)

> **用途**：根项目面向维护本机编码 Agent 的开发者：重复工具调用中，希望让明确只读或工作区内普通操作少打断，同时对危险动作提供拒绝原因和审计线索。合格结果不是“无人打断”，而是允许动作可继续、拒绝动作未交给工具、未知明确留给原宿主处理。简单基线是宿主逐次审批加 OS 权限；已有 sandbox 提供进程限制。该项目把本地规则、模型通道的秘密替换、工具调用裁决与进程观测组合为一个 CLI／本地服务，根真实类型为 infrastructure，DSH 适配子包不是根项目的原生导出。

> **亮点**：[Q01](../../plugins/openguardrails--openguardrails/INSIGHT.md#research-q01) 与 [Q02](../../plugins/openguardrails--openguardrails/INSIGHT.md#research-q02) 表明根项目将模型通道秘密替换、规则先行和工具拒绝反馈统一到本地网关，适合避免为每个 harness 单独改写调用链。重要增量是组合与责任分层；Seatbelt／bubblewrap 及规则方法来自成熟先例，不能归为新隔离算法。

> **思考**：[Q02](../../plugins/openguardrails--openguardrails/INSIGHT.md#research-q02) 无模型与额度耗尽的未知调用仍前进，failMode=closed 也不代表所有未决都拒绝；[Q03](../../plugins/openguardrails--openguardrails/INSIGHT.md#research-q03) 识别范围和默认网络 observe 又限制安全承诺。必须保留宿主权限检查，并把未决、绕过与秘密规则遗漏纳入验收，不能据日志沉默判断安全。

> **建议**：[Q04](../../plugins/openguardrails--openguardrails/INSIGHT.md#research-q04) 从明确 unjudged 语义推导任务级未知汇总与人工接管清单，可能减少未知被误当通过；它尚未实现或验证。用同任务双组比较未知遗漏、人工核对和完成率；若遗漏不降或总时间增则否定。

[查看完整分析](../../plugins/openguardrails--openguardrails/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1128123594-root"></a>

## [OpenViking](../../plugins/volcengine--openviking/INSIGHT.md)

[![GitHub ★ 41,264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41%2C264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking)

> **用途**：面向需要组织、检索并核对 Agent 上下文的开发者和平台团队。

> **亮点**：[Q01](../../plugins/volcengine--openviking/INSIGHT.md#research-q01) 至 [Q03](../../plugins/volcengine--openviking/INSIGHT.md#research-q03) 显示将 URI、分层读取、来源范围及可选会话检索组合为可核查的上下文机制；真实召回和节时未测。

> **思考**：[Q04](../../plugins/volcengine--openviking/INSIGHT.md#research-q04) 显示特定大目录条件下摘要可暂缓刷新，锁忙时该次父聚合可能跳过；不能以摘要存在证明当前任务使用的内容新鲜。

> **建议**：[Q06](../../plugins/volcengine--openviking/INSIGHT.md#research-q06) 假设将 freshness 状态用于关键任务的选择性原文回查，可减少陈旧摘要导致的错误；增量、代价及安全尚未验证。

[查看完整分析](../../plugins/volcengine--openviking/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1385896447-root"></a>

## [Our Free Model](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md)

[![GitHub ★ 54,137](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54%2C137&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ebony-Vinyl/dsh-our-free-model)

> **用途**：[Q01](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md#research-q01) 面向需要尝试多个模型渠道的 DSH 用户；合格任务需明确供应商、费用与结果。

> **亮点**：[Q02](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md#research-q02) 将匿名、账户和自带密钥渠道纳入统一模型选择并提供受限降级，相对手工逐个切换具有可解释的流程增量；不证明所有渠道免费或稳定。

> **思考**：[Q03](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md#research-q03) 的免费识别依赖名称规则，且作者记录 429；实际限额、费用和隐私由上游决定，不能把目录标签视为担保。

> **建议**：[Q04](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md#research-q04) 假设组合请求前展示每个候选的数据接收方和费用状态可减少误路由，须测识别正确率、耗时及信息过期，尚未验证。

[查看完整分析](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333452358-root"></a>

## [pi2dsh](../../plugins/weijiafu14--pi2dsh/INSIGHT.md)

[![GitHub ★ 217](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=217&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/weijiafu14/pi2dsh) [![npm 30d 3,875](https://img.shields.io/static/v1?label=npm+30d&message=3%2C875&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/pi2dsh) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/pi2dsh)

> **用途**：已有Pi扩展工具链的用户可在DSH探索同包迁移，合格结果是固定版本关键任务和退出语义等价，不只是工具挂载。

> **亮点**：[Q01](../../plugins/weijiafu14--pi2dsh/INSIGHT.md#research-q01)、[Q02](../../plugins/weijiafu14--pi2dsh/INSIGHT.md#research-q02) 集中实现Pi ABI到DSH服务的翻译和按Agent生命周期归属，让扩展作者不必为每包写第二份接线。贡献限定为映射机制，作者样例/挂载探测不是本次复现或全生态兼容证明。

> **思考**：[Q03](../../plugins/weijiafu14--pi2dsh/INSIGHT.md#research-q03) inspect只筛查，mount失败可降级继续普通DSH；自绘卡片和project_trust等仍有语义差异。扩展factory在宿主进程执行，兼容层不是不可信包隔离；[Q02](../../plugins/weijiafu14--pi2dsh/INSIGHT.md#research-q02) 同名工具行为更新与参数schema生效也不同步。

> **建议**：[Q05](../../plugins/weijiafu14--pi2dsh/INSIGHT.md#research-q05) 未验证假设是把静态诊断、实际挂载和任务结果绑定到相同扩展/宿主/surface版本，减少把片段支持当完整迁移。先排现有诊断等价功能，以误判/定位时间和维护成本证伪。

[查看完整分析](../../plugins/weijiafu14--pi2dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333357514-root"></a>

## [Qiushi DSH Evidence Audit](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/qiushi-dsh-evidence-audit) [![npm 30d 1,150](https://img.shields.io/static/v1?label=npm+30d&message=1%2C150&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)

> **用途**：需要对 DSH 会话和工具结果保留可检测篡改记录的审计人员与开发团队可用它监听 session/event 与 tools/result，把规范化事件写成带前序哈希的追加式证据回执；合格结果是回执顺序和内容可复算，断链或修改能被检测，同时明确记录不证明事件真实性。详见[Q01](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md#research-q01)。

> **亮点**：以 observe-only 方式把 DSH 事件转成规范 JSON 与哈希链回执，降低对业务执行路径的干扰。它相对“保存普通日志文件，或由外部采集器事后抓取没有链式关系的事件”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md#research-q03)。

> **思考**：哈希链只能检测已记录内容的后续变更，不能证明事件未遗漏、主机可信或记录中的业务事实真实。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md#research-q04)。

> **建议**：未来可探索：可将周期性链头锚定到独立存储，并给每类事件增加覆盖率计数，从而同时检测篡改和采集缺口。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1297278222-root"></a>

## [SandBase Harness](../../plugins/sandbaseai--sandbase-harness/INSIGHT.md)

[![GitHub ★ 636](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=636&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sandbaseai/sandbase-harness)

> **用途**：需要持久会话、产物查询与停止接口的Agent开发者，可以用它替代自行拼装脚本worker管理层；DSH通过示例MCP桥连接独立运行时。

> **亮点**：[Q01](../../plugins/sandbaseai--sandbase-harness/INSIGHT.md#research-q01) 将会话和产物管理集中到独立运行时；[Q02](../../plugins/sandbaseai--sandbase-harness/INSIGHT.md#research-q02) 提供真实MCP到会话API桥接。其贡献是资源管理和接入组织，模型推理与MCP协议不是本项目原创。

> **思考**：[Q02](../../plugins/sandbaseai--sandbase-harness/INSIGHT.md#research-q02) 的idle和文本回传不等于研究报告验收。[Q03](../../plugins/sandbaseai--sandbase-harness/INSIGHT.md#research-q03) 本地provider非强隔离且路径写入有末端悬空链接边界，不应对任意仓库开放执行。

> **建议**：可以推导未验证的研究交付适配层。保留现有会话管理，在结果里增加固定仓库提交、问题/答案/证据、材料摘要与报告位置，并将父端逐题决定和交付摘要绑定。相对现在只返回文本和最后事件，增量是让脚本预查版本、文件和覆盖关系，父模型只检查逐题语义与关键依赖，而不重做材料整理。

[查看完整分析](../../plugins/sandbaseai--sandbase-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1330431542-root"></a>

## [SkillCorpus](../../plugins/evermind-ai--skillcorpus/INSIGHT.md)

[![GitHub ★ 694](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=694&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/SkillCorpus)

> **用途**：维护大量技能的 Agent 团队可以按任务搜索可用操作指引，减少先知道技能名的要求。

> **亮点**：[Q01](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q01)、[Q02](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q02) 把按任务检索、环境线索和正文/文件送达接到宿主入口，并保留技能ID，用户无需先知道名字。尚无本轮证据证明DSH任务办结率更高。

> **思考**：[Q03](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q03) gate失败会退回排名前K，没有模型配置时不构建gate；它不是远端内容安全阻断。文件准备失败仍可送正文，第三方指令可读不等于所需文件可执行。

> **建议**：[Q04](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q04) 联合记录门控/送达状态与独立合格任务结果，比较本地目录、按需和自动检索的全部成本。已有诊断与技能ID可复用，此方法增量及收益尚未验证。

[查看完整分析](../../plugins/evermind-ai--skillcorpus/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1100971867-root"></a>

## [Tingly Box](../../plugins/tingly-dev--tingly-box/INSIGHT.md)

[![GitHub ★ 370](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=370&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tingly-dev/tingly-box)

> **用途**：为需接多个模型/客户端的个人或管理员，在统一入口管理规则、scope和用量，减少重复baseURL/key接线。见[Q01](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q01)。

> **亮点**：把角色scope/分区亲和与异构failover/观察接成统一管理路径，有首chunk不混流和非global probe剥头等明确边界。见[Q02](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q02)、[Q03](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q03)。

> **思考**：degrade可保不健康候选，首chunk后不重试、quota非硬财务限额、usage非全厂商扣费；DSH两文件备份直写非事务，团队全路径隔离未验。见[Q02](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q02)至[Q04](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q04)。

> **建议**：未验证方向是在既有timeline/usage之上加政策版本/客户端语义核对，比较误scope/错路/消费未知和定位负担，现trace充分则否定。见[Q06](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/tingly-dev--tingly-box/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333969047-root"></a>

## [TokenLedger](../../plugins/zh667--tokenledger/INSIGHT.md)

[![GitHub ★ 202](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=202&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zh667/TokenLedger) [![npm 30d 1,709](https://img.shields.io/static/v1?label=npm+30d&message=1%2C709&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tokenledger) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tokenledger)

> **用途**：多模型/中转路由的DSH用户可以按会话、日期和项目解释宿主报告用量，减少手工拼表。

> **亮点**：[Q01](../../plugins/zh667--tokenledger/INSIGHT.md#research-q01)、[Q02](../../plugins/zh667--tokenledger/INSIGHT.md#research-q02) fork前缀去重、同样本替换和rollup/checkpoint事务让重建账本更可解释，缺价格保持未知而非零。并未证明财务对账准确或真实费用降低。

> **思考**：[Q02](../../plugins/zh667--tokenledger/INSIGHT.md#research-q02) 区间费用先按模型合并，再用一个day选价且未传时刻，不能保证跨生效日/峰谷正确分段；宿主未报usage和当前路由重建也影响结果。金额不得直接作结算凭据。

> **建议**：[Q04](../../plugins/zh667--tokenledger/INSIGHT.md#research-q04) 用已有day粒度逐段选价，显式分开估算/上游金额/不可解释差额，以固定日志与人工oracle比较误差和资源成本；历史时刻缺失不能补造，尚未实现验证。

[查看完整分析](../../plugins/zh667--tokenledger/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1301657572-root"></a>

## [Treg](../../plugins/superdesigndev--treg/INSIGHT.md)

[![GitHub ★ 6,887](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C887&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/superdesigndev/treg)

> **用途**：需要偶尔访问多供应商工具、或团队共享受控凭据的 Agent 开发者；直连单一供应商是基线。[Q01](../../plugins/superdesigndev--treg/INSIGHT.md#research-q01)

> **亮点**：将目录、服务端密钥代理、费用与有限幂等结合；DSH Skill/MCP 是入口，服务主体属于根项目。[Q01](../../plugins/superdesigndev--treg/INSIGHT.md#research-q01) [Q02](../../plugins/superdesigndev--treg/INSIGHT.md#research-q02)

> **思考**：客户端需主动提供 key 且保护有期限；未知结果可能已到达供应商，新 key 可能再次付费。[Q03](../../plugins/superdesigndev--treg/INSIGHT.md#research-q03)

> **建议**：未验证假设：在工具选择中连接费用上限、幂等和对账入口，比较现有状态和直连下的误重试、成本与隐私代价。[Q05](../../plugins/superdesigndev--treg/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/superdesigndev--treg/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1363429979-plugin-usage-billing"></a>

## [Usage Billing](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,937](https://img.shields.io/static/v1?label=npm+30d&message=1%2C937&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing)

> **用途**：维护者可看会话/项目/模型的日志用量与费用估算，合格结果需可解释计量和价差，见 [Q01](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md#research-q01)。

> **亮点**：usage、snapshot、backfilled与priced分开并以稳定ID分片，方便解释历史估算和unknown，见 [Q01](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md#research-q01)。

> **思考**：全局峰谷/跨provider同名兜底可能错价，当前alias重折可覆盖旧ID费用，写时快照不等历史不可变，见 [Q02](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md#research-q02)。

> **建议**：提供商计量/合同/FX的不可变行收据，普通重折保旧、重估显式修订，以新夹具和授权对账证伪，见 [Q03](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md#research-q03)。

[查看完整分析](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-403559729-root"></a>

## [Yao Agents](../../plugins/yaoapp--yao/INSIGHT.md)

[![GitHub ★ 8,190](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8%2C190&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YaoApp/yao)

> **用途**：Yao根项目是自托管Agent应用/运行平台，不是安装进DSH的一层插件。适合已有多台工作机器、需要把对话任务与各节点工作区统一管理的开发或运营负责人。合格结果是指定任务在预期节点处理正确工作区并产出可核查文件或业务结果；任务板显示completed不等于内容合格。简单办法是分别登录机器运行DSH/CLI并用人工任务板记录，单机用户可能无需承担平台部署。README的“越用越好”仅是作者主张，本轮未发现结果提升实验。

> **亮点**：[Q03](../../plugins/yaoapp--yao/INSIGHT.md#research-q03)识别出工作区归属、节点能力与任务队列的控制平面整合，DSH以独立runner接入。相对逐机CLI加人工任务板，增量是持续保留任务/节点身份并统一配置接线；只有跨设备任务足够频繁时才可能覆盖部署负担，不将DSH或容器能力据为原创。

> **思考**：[Q04](../../plugins/yaoapp--yao/INSIGHT.md#research-q04)指出workspace组织隔离不等于所有模式的OS沙箱，completed/maxTokensAsSuccess不证明交付合格，准备材料写入失败还可能只warn继续。正常完成Cleanup有意保留子进程，离线节点回退又带来数据落位未知；这些核心生命周期边界尚未形成可验证的恢复与退出契约，应先观察而非以只读小任务掩盖整个平台的采用负担。

> **建议**：[Q08](../../plugins/yaoapp--yao/INSIGHT.md#research-q08)提出未验证的节点/workspace、预期产物与独立验收三联收据，分离运行结束和业务办结；用掉线、token终止及产物缺失对照误办结率和人工成本，若身份无法可信绑定或负担抵消收益则否定。

[查看完整分析](../../plugins/yaoapp--yao/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1416699252-root"></a>

## [元冰可](../../plugins/01men--ybkkasi/INSIGHT.md)

[![GitHub ★ 16](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=16&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01men/ybkkasi)

> **用途**：面向有平台团队的多部门AI资源治理；单位成果是已授权主体完成一项真实调用并能核对结果、用量与审计，不是资产条目或演示通过。根组件是基础设施平台，见[Q01](../../plugins/01men--ybkkasi/INSIGHT.md#research-q01)。

> **亮点**：共享治理对象真正接到受控调用：调用方身份进入permit/manifest检查，预留后才经实际MCP传输，结果再回领域状态。增量是这些边界的组合，不是声明所有域已闭环或内置通用自治Agent。见[Q02](../../plugins/01men--ybkkasi/INSIGHT.md#research-q02)、[Q03](../../plugins/01men--ybkkasi/INSIGHT.md#research-q03)。

> **思考**：本地completed和去重不等完整业务恢复：同键只核参数，首次value/content没有随账本完整持久回放，网关强收据也有降级；SSE/错误/动态撤权需按实际接口验收，不能凭状态和方法名补齐。见[Q04](../../plugins/01men--ybkkasi/INSIGHT.md#research-q04)。

> **建议**：在现有permit/账本上把资源目标与可恢复结果收据绑定，再交已有宿主Agent继续决策；先用一种资源的真实匿名案件比较错结果、重复动作和管理员负担，无优势就不扩域。该增量未实现/未验证，详见[Q06](../../plugins/01men--ybkkasi/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/01men--ybkkasi/INSIGHT.md) · [返回表格](#category-index)

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-11-02
