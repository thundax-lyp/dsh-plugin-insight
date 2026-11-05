# 基础设施

[全部分类](INDEX.md) · [返回首页](../../../README.md)

模型接入、认证、运行环境与系统支撑。

<a id="category-index"></a>

**同类比较**

> 比较表与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@sueleven/dsh-auto-update](#plugin-1428034710-root) | 启动时检查已下载并启用的npm插件，展示新版并在确认后调用DSH官方通道更新。 | 先观察作更新候选，核Windows环境与路由、备份后才隔离验批量；不在生产profile依旧提示直接全更。 |
| [AI Infrastructure Agent Skills](#plugin-1129378320-root) | 面向 AI 基础设施工程师的 Skill 集合，涵盖 GPU 开发、显存估算、训练指导和技术图表。 | [Q03](../../plugins/yzlnew--infra-skills/INSIGHT.md#research-q03) 先观察，按一项已知结果任务筛选并固定独立环境。 |
| [Almost Full Access](#plugin-1336031182-root) | 在DSH完全访问预设上，为部分命名shell工具加入确定性/子代理审查、人工审批面板和命令记忆。 | 日常安全权限用途不推荐；只保留无敏感权限的隔离研究边界。 |
| [ANOLISA](#plugin-1195873793-root) | 为 Agent 环境提供上下文优化、技能、工作区恢复、安全和观测组件的系统软件栈。 | [Q04](../../plugins/agentic-os-org--anolisa/INSIGHT.md#research-q04) 仅对已能维护运行环境和保留原文的开发者，建议以任务副本小范围试用所查压缩链路；内容丢失、取回失败或净成本不降就停用。 |
| [Ark Plan API](#plugin-1269979871-dsh-plugins-ark-plan-api) | 为 DSH 的原生模型适配器声明火山方舟 Plan 和后付费路由。 | [Q03](../../plugins/volcengine--ark-cli--dsh-plugins-ark-plan-api/INSIGHT.md#research-q03) 先做无钥匙组合核对，再按需验收。 |
| [Awesome DSH Plugins](#plugin-1333144072-root) | 提供 DSH 插件分类目录与可订阅到官方发现页的安装目标索引。 | [Q04](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md#research-q04) 独立profile只试单个任务候选，上游核权限/版本，不批装；不清回原仓库。 |
| [billion-context-dsh](#plugin-1333322877-root) | 为 DSH 提供模型驱动的上下文压缩、恢复与压缩提示。 | [Q03](../../plugins/tyan66666--billion-context-dsh/INSIGHT.md#research-q03) 新部署保留宿主原生路径，既有安装先检查历史。 |
| [Browser4](#plugin-124882400-root) | 通过 Rust CLI 和浏览器后端提供网页交互与批量提取。 | [Q04](../../plugins/platonai--browser4/INSIGHT.md#research-q04) 从隔离只读站点开始，写操作状态不明时人工核查。 |
| [chicheng-gate](#plugin-1334862230-root) | 以密码门禁、反向代理和 frpc 隧道把 DSH 暴露到远端。 | 当前不建议采用；不要在持有代码、凭据或生产访问权的 DSH 上暴露，优先使用 VPN/SSH 并等待独立安全审计。 |
| [ClawMetry](#plugin-1156882085-root) | 读取 Agent 会话与运行日志，统一展示时间轴、工具事件及可得用量的观测工具 | [Q04](../../plugins/vivekchand--clawmetry/INSIGHT.md#research-q04) 已有OpenClaw数据者可对照原JSONL条件试读；本目录DSH用途先观察，未核Pro适配前不采用其健康/控制判断。 |
| [Codex Connect](#plugin-1333646693-root) | 为 DSH 增加 ChatGPT OAuth 授权的 Codex 模型路由及可选辅助能力。 | [Q03](../../plugins/franksong2702--dsh-codex-connect/INSIGHT.md#research-q03) 先做无钥匙诊断再决定是否授权。 |
| [Cue Omni Reader Guard](#plugin-1244140731-dsh-cue-omni-reader-guard) | 在 DeepSeek Harness 调用 Omni Reader 解析前检查 URL、文件根与审批策略。 | [Q03](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader-guard/INSIGHT.md#research-q03) 用隔离测试验证应用层门槛。 |
| [DeepSeek Harness](#plugin-1333065091-root) | 基于插件组合提供 Agent 运行、工具调用、会话和交互的开源宿主。 | 适合有 Agent 扩展需求的开发者先在隔离 profile、固定模型和小任务上验收；服务缺失、非预期写入或重启不一致时停止并回到已知配置。 |
| [DeepSeek Harness Channel BCN](#plugin-1290565606-apps-bcs-crates-plugins-deepseek-harness-channel-bcn) | 将 DeepSeek Harness Agent 接入 Avernet Bot Collaboration Network。 | [Q04](../../plugins/inclusionai--avernet--apps-bcs-crates-plugins-deepseek-harness-channel-bcn/INSIGHT.md#research-q04) 先在受控服务和兼容宿主用低敏消息试通，并对照终态；异常时双方核查后再处理。 |
| [DeepSeek Harness Desktop](#plugin-1341972254-root) | 以 Tauri 管理独立 DSH 实例、桌面入口及多实例协作。 | [Q03](../../plugins/baihejiangnan--deepseek-harness-desktop/INSIGHT.md#research-q03) 空home验证后再考虑第二套实例。 |
| [DeepSeek Harness for fnOS](#plugin-1333252932-root) | 将 DSH 打包为 fnOS 常驻应用，并提供网关与管理面板。 | [Q02](../../plugins/techysy--deepseek-harness-fnos/INSIGHT.md#research-q02) 先核实身份及直连端口，再考虑隔离NAS试用。 |
| [DeepSeek Harness Studio](#plugin-1334747723-root) | 将 Harness 打包为桌面工作区，提供插件需求检索、确定版本安装和事务恢复界面。 | 首次要安装完整Studio、配置模型和选择profile，迁移既有插件时需记录原版本与数据；候选自然语言搜索另产生模型与npm网络成本。 |
| [DeepSeek Harness Tauri Desktop](#plugin-1333718792-root) | 提供 DSH 桌面界面、内核与运行时管理和数据迁移。 | 在副本上验证核心、插件与关键数据；失败停止切换并核验备份。 |
| [DeepSeek Harness 桌面版](#plugin-1333310793-root) | 将 Harness Web 与 Node 打包进独立 Electron 桌面应用。 | [Q03](../../plugins/wess09--deepseekharnessdesktop/INSIGHT.md#research-q03) 先核对制品。 |
| [deepseek-harness-docker](#plugin-1333277183-root) | 将官方 DSH 发行物封装为带 Web UI 和 Chromium 桌面的容器运行环境。 | [Q03](../../plugins/runzhliu--deepseek-harness-docker/INSIGHT.md#research-q03) 用空卷在回环验收实际会话、浏览器和恢复，再扩大访问。 |
| [DSH Better Sidebar](#plugin-1326893710-root) | 为 DSH 提供会话侧栏与底部工作台，支持文件、编辑器、Git 和扩展页面。 | [Q06](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q06) 建议已确认宿主版本的开发者先用低权限宿主和可丢弃目录试读、编辑；若实际路径不符或需要工作目录隔离，停止并回到 IDE。 |
| [DSH Capability Menu](#plugin-1339185691-root) | 按常驻、按需和禁用管理工具与技能 | [Q04](../../plugins/pkufudawei--dsh-capability-menu/INSIGHT.md#research-q04) 隔离 profile 对照三层策略及权限。 |
| [DSH Codex Auth](#plugin-1374007757-plugins-dsh-codex-auth-plugin) | 在 DSH 中管理 Codex 授权、模型目录和用量状态 | [Q04](../../plugins/fnosp--fnos-dsh--plugins-dsh-codex-auth-plugin/INSIGHT.md#research-q04) 限定本机profile测试登录请求退出闭环。 |
| [DSH Codex Desktop](#plugin-1333748978-root) | 以 Electron 启动本地 DSH，在独立桌面窗口接入工作台和预置插件。 | [Q03](../../plugins/michengai--dsh-codex-desktop/INSIGHT.md#research-q03) 隔离测试首次启动和迁移。 |
| [DSH Codex Subscription](#plugin-1333528857-root) | 将 Codex 订阅授权与可选连接器等能力接入 DSH。 | [Q05](../../plugins/wsl043--dsh-codex-subscription/INSIGHT.md#research-q05) 在隔离 profile 先试单模型，权限不明时回原生入口。 |
| [DSH Connect WorkBuddy](#plugin-1349641014-root) | 将本机 WorkBuddy 账号和模型接入 DeepSeek Harness。 | [Q05](../../plugins/dingminhua--dsh-connect-workbuddy/INSIGHT.md#research-q05) 建议仅在允许该接入方式的隔离配置下核对账号、请求和预算；费用、凭据或输入变化不明时停止并回退。 |
| [DSH Cost Meter](#plugin-1333235870-root) | 统计 DSH 会话模型用量及估算费用，并提供预算、历史与额度信息。 | [Q06](../../plugins/han-1413141--dsh-cost-meter/INSIGHT.md#research-q06) 建议先对照少量已知调用，遇到缺记录或未知价格即停止将本地金额作为费用依据，回看供应商账单。 |
| [DSH Crew](#plugin-1336068061-root) | 把DSH Agent作为Claude Code、Codex等编排器可分派的子任务worker并展示进度。 | [Q03](../../plugins/zseven-w--dsh-crew/INSIGHT.md#research-q03)正式写任务observe；仅丢弃目录单进程只读评估，固定强制hub、禁CLI与升级，任何未知状态先人工核查。 |
| [DSH DeepSeek Web Login](#plugin-1364181676-root) | 把 DeepSeek 网页登录态接为 DSH 模型供应商，支持流式回复、图片输入和提示词工具调用桥接。 | [Q05](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q05)先观察；后续仅以非敏感只读任务核输入齐备、工具实执行和产物，任何缺图、协议代执行或清理不明都停止并回已验证供应商。 |
| [DSH Desktop](#plugin-1331608070-root) | 独立 Electron 客户端，发现或启动 DSH 并呈现 Web UI。 | [Q03](../../plugins/bruc3van--dsh-desktop/INSIGHT.md#research-q03) 选择固定平台制品，在独立数据环境用合成配置试启动和连接。 |
| [DSH Desktop](#plugin-1333321333-root) | 将 DeepSeek Harness 的本地 Web 界面、Host 和插件系统集成到原生桌面应用。 | [Q05](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q05) 建议使用隔离账户与数据根试单项任务，检查网络范围和退出；数据归属或恢复不明确时保留原备份并回到现有 CLI 或 Web。 |
| [DSH Desktop](#plugin-1334496914-root) | 通过桌面控制器与 sidecar 启停内置 DeepSeek Harness，并管理插件和预设。 | [Q03](../../plugins/web-casa--deepseek-harness-desktop/INSIGHT.md#research-q03) 先验证固定制品。 |
| [DSH Ecosystem Spec](#plugin-1336850842-root) | 汇集 DSH 社区协议、实现与准入 Profile，并提供索引结构校验。 | [Q03](../../plugins/t-auto--dsh-ecosystem-spec/INSIGHT.md#research-q03) 小样本声明对照后评估维护负担。 |
| [DSH HoneyBee / DSHB](#plugin-1355618827-packages-dshb) | 在 DSH 中管理 SSH/Docker 节点并路由文件、命令与终端，提供工作区指令和多实例会话同步。 | [Q03](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q03) 保持观察。 |
| [DSH Market](#plugin-1333807290-root) | 在 DeepSeek Harness 中浏览社区插件，并管理安装、更新和配置。 | [Q06](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q06) 建议维护多个插件且已备份 profile 的用户先在隔离副本试装；发现取消后状态不清或无法恢复时停止并退回宿主 Discover 与 CLI。 |
| [DSH Multi Subscription Hub](#plugin-1334025844-root) | 集中订阅线路、账号池和模型运行配置 | [Q04](../../plugins/aa728848--dsh-chatgpt-subscription/INSIGHT.md#research-q04) 只观察已允许线路，隔离账号及原profile快照。 |
| [DSH Plugin Manager](#plugin-1331636953-packages-dsh-plugin-manager) | 在 DSH 官方插件页面检查更新与兼容声明，并提供更新和重启入口。 | 熟悉 profile 的维护者先在备份过的可弃置环境试更新一个可信非关键包；版本、目标或恢复不明时停下并人工核对，再用官方固定版本命令和回归。 |
| [DSH Plugin Radar](#plugin-1323404274-root) | 收集 DSH 插件候选，归并兼容性记录并发布可浏览目录与机器可读数据。 | [Q04](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q04) 先按固定提交读取少量候选，再回原仓核对版本和权限；数据日期或逐条证据不明时停止自动安装并人工查找。 |
| [DSH Plugins Marketplace](#plugin-1333295863-root) | 在 DSH 设置页浏览第三方插件与 Skill 索引，识别安装形态并组织材料、确认、安装和版本状态。 | [Q03](../../plugins/bradegithub--dsh-plugins-marketplace/INSIGHT.md#research-q03)正式管理observe，先修并在丢弃profile验multi-skill只删所属项。 |
| [DSH RotaKit](#plugin-1387227102-root) | 把本机 WorkBuddy/CodeBuddy 账号组成模型池，提供 Chat、Responses、Messages 本地代理与积分状态。 | 建议观察，本人账号与明确上游条件下隔离验证实际客户端闭环和积分成本；不以返回码或余额面板单独判断可用。 |
| [DSH SSH](#plugin-1331636953-packages-dsh-ssh) | 在 DSH 中管理 SSH 主机，并提供远端命令、终端、文件传输与隧道。 | [Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md#research-q05) 建议熟悉 SSH 的用户只在隔离测试机和独立 home 试用人工审核的只读命令；要求 host key pin 时使用现有 SSH 方案。 |
| [DSH Standard](#plugin-1336081431-root) | 提供可独立实现的协议声明、协商器与 DeepSeek Harness 映射。 | [Q04](../../plugins/t-auto--dsh-std/INSIGHT.md#research-q04) 先用于单领域 CI，并另验运行映射。 |
| [DSH UI Usage Billing](#plugin-1335651249-root) | 在 DSH 聚合模型用量和估算费用，并提供可选任务队列。 | [Q03](../../plugins/kenz1117--dsh-ui-usage-billing/INSIGHT.md#research-q03) 在隔离 profile 导入合成会话，核对按模型、日与会话统计以及价格来源。 |
| [DSH WebUI Market](#plugin-1333447648-root) | 在 Web 内浏览插件并向 profile 安装或卸载 | [Q04](../../plugins/sanqi-normal--dsh-webui-market-plugin/INSIGHT.md#research-q04) 临时 profile 检查试装、真实写与恢复。 |
| [DSH XD Pool](#plugin-1356951582-root) | 将自有 WorkBuddy 多账号接成 DSH 模型池，提供渠道接入、用量、路由、网关与可选积分自动化。 | [Q03](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q03) 备份profile并核凭据目录，主池只用自有账号和非敏感任务，保持额外lane、网关与积分自动化关闭；核所有尝试与最终回答。 |
| [DSH 订阅模型适配插件](#plugin-1333964468-root) | 将多个订阅 provider 的账号与可选候选池接入 DSH。 | [Q04](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md#research-q04) 先限定候选可接收数据范围，状态不明则停池回直连。 |
| [dsh-agy-link](#plugin-1339101586-root) | 把本地 Antigravity CLI 接入 DSH，并提供账号池和配额管理。 | [Q03](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q03) 先检查隔离条件。 |
| [dsh-anatomy-panel](#plugin-1366089972-workspace-plugins-dsh-anatomy-panel) | 从 Agent-Body 运行时文件实时展示器官体征、心跳和脉冲的宿主网页。 | 限隔离本机开发 Host 观察，不能作为独立健康判据；共享可达环境应先核认证、渲染和来源状态。 |
| [dsh-api-dashboard](#plugin-1346196699-root) | 在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。 | 可信单用户本地试用，限定Key接收方和刷新，未知模型先缺价核查，估算与官方账单分开，更新优先宿主管理器。 |
| [dsh-approval-gate](#plugin-1333918421-root) | 按会话预设、规则和 Flash 判断处理 DSH 审批，附审查和快照界面。 | [Q03](../../plugins/moon09300731--dsh-approval-gate/INSIGHT.md#research-q03) 只做隔离对照，确认严格解析前维持人工。 |
| [dsh-AuthInOne](#plugin-1333722443-root) | 在 DSH 原生模型与用量设置增加账号接入、模型切换和费用分析。 | [Q03](../../plugins/stormycry-cryp--dsh-authinone/INSIGHT.md#research-q03) 先现有 API Provider，再单账号授权验收。 |
| [dsh-auto-mode](#plugin-1333939283-root) | 在 DSH 的 workspace-write 中为部分工具提供确定性与语义审批策略。 | [Q03](../../plugins/nanmicoder--dsh-auto-mode/INSIGHT.md#research-q03) 新配置使用适合任务的宿主手工模式，旧会话先备份后退出。 |
| [dsh-builtin-browser](#plugin-1334400504-root) | 在 DSH 中为模型提供浏览器导航、页面操作和可选远程观看。 | [Q03](../../plugins/wqty123--dsh-browser/INSIGHT.md#research-q03) 从无登录页面开始。 |
| [dsh-cap-profile](#plugin-1349267122-root) | 扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。 | 先确认面板显示真实数据，再选数份脱敏会话核对调用、模型和错误归属；用它缩小排查范围。 |
| [dsh-clean-desktop-shell-pro](#plugin-1389469406-root) | 将 DSH web profile 包装为 Electron 桌面壳，并增加后端自动启动、托盘退出选择与运行时准备。 | 隔离桌面 profile 分别验本地/远程、离线下载、托盘退出与升级后再替换原版。 |
| [dsh-codex](#plugin-1333367960-root) | 通过插件自身 OAuth 凭据把 Codex 模型、搜索和图像能力接入 DSH。 | [Q03](../../plugins/yan-zero--dsh-codex/INSIGHT.md#research-q03) 单模型核心流程完成后再加可选能力。 |
| [dsh-compaction-route](#plugin-1391040578-root) | 在 DSH 为会话压缩选择主摘要模型及失败后的备用模型。 | [Q03](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q03) 用允许发送的虚拟历史验证。 |
| [dsh-daruma](#plugin-1348357631-packages-dsh-daruma) | 在 DSH 请求路径内按故障与预算切换模型通道。 | [Q03](../../plugins/sischoi--daruma--packages-dsh-daruma/INSIGHT.md#research-q03) 先用可计数的模拟模型。 |
| [dsh-device-bridge](#plugin-1384810806-root) | 在 DSH 中列出配置设备、探测 Companion 状态并请求命名动作。 | [Q03](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q03) 先用隔离 mock 对照请求与设备日志，再评估真实服务。 |
| [dsh-find-plugin](#plugin-1333689922-root) | 在 DSH 对话中搜索插件仓库，补充目录描述和安装命令，并在在线搜索失败时回退目录关键词匹配。 | [Q03](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md#research-q03) 把工具当候选入口，读来源note并回仓库核固定提交、兼容与权限。 |
| [dsh-gitbash-preset](#plugin-1334692596-root) | 复制旧式用户预设文件并提供 Git Bash 执行器，已记录版本发现障碍。 | [Q03](../../plugins/liceses--dsh-gitbash-preset/INSIGHT.md#research-q03) 先验收预设发现和权限，适配前维持官方入口。 |
| [dsh-gov](#plugin-1336647931-root) | 为DSH提供规则式工具allow/deny/ask、JSONL审计查询与按Agent累计token的预算警告。 | 观察，只作可信单用户辅助诊断继续探讨，强权限/预算/审计在宿主受权面另保证。 |
| [dsh-green-meter](#plugin-1333913099-root) | Electron DSH 桌面整合 GPU 采样、能碳估算账本和费用控制台。 | [Q03](../../plugins/dclichang2022--dsh-green-meter/INSIGHT.md#research-q03) 校准前仅观察趋势。 |
| [dsh-launcher](#plugin-1333146829-root) | Windows轻量启动器，双击启动DSH并管理服务生命周期与诊断。 | [Q03](../../plugins/ruler4396--dsh-launcher/INSIGHT.md#research-q03)新增部署observe；既有用户先离线清点、备份与人工审诊断，副本评估退出，不为假设安装停更版本。 |
| [dsh-llm-balance](#plugin-1366370702-root) | 在DSH常驻卡片显示DeepSeek/Moonshot余额与Kimi/OpenCode订阅窗口，按源缓存并保留失败旧值。 | 先观察；可信个人单账号route对照，限定sources并明确OAuth写回，默认先禁token持久化。 |
| [dsh-llm-workbuddy](#plugin-1333868738-root) | 为 DSH 提供 WorkBuddy API Key、账号登录和会话独立凭据选择。 | [Q03](../../plugins/axiaohungry--dsh-llm-workbuddy/INSIGHT.md#research-q03) 单号验收后测试双号并发。 |
| [dsh-mcp-connector](#plugin-1340838178-root) | 管理 MCP 连接、凭据和工具缓存，并按工作区与 Agent 控制可见性。 | [Q03](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md#research-q03) 单个只读服务逐层验收。 |
| [dsh-mcp-panel](#plugin-1333768172-root) | 为官方MCP桥提供配置、诊断、备份写入和宿主管道试调用。 | [Q03](../../plugins/perrylink--dsh-mcp-panel/INSIGHT.md#research-q03) 只读trial和副本写入分开验收。 |
| [dsh-mcp-tunnel](#plugin-1344713826-root) | 将本地 HTTP MCP 端点经 Docker/Cloudflare Quick Tunnel 暴露，并生成待确认的 DSH MCP Client 配置。 | 仅可在无敏感数据的隔离测试环境验证。 |
| [dsh-model-auto-enricher](#plugin-1425159954-root) | 按名称规则批量补齐DSH模型配置，提供预览、自动写入、备份和停用入口。 | 不推荐默认自动；只读/复制profile研究不等真实渠道可靠采用。 |
| [dsh-model-channel-manager](#plugin-1358316691-root) | 管理 DSH 模型渠道和轮询组，提供故障转移、模型测试、测速及健康统计界面。 | 在固定RC和受控额度下先用等价候选试用，验收首内容前切换、内容后失败只终止一次、用户取消及重启不重放测试。 |
| [dsh-model-info-fill](#plugin-1358816037-root) | 从models.dev按模型名补自定义供应商缺失容量、图片和思考声明，展示冲突、未匹配与旧猜档待确认。 | 先观察；个人有备份profile关自动补，目录同步完成后逐项手动审阅再补，实际供应商优先。 |
| [dsh-model-manager](#plugin-1349266980-root) | 在 DSH 管理本地推理服务、参数 Profile、GPU 检测和性能测试。 | 先在隔离端口登记已有服务、保存参数并核对测速口径。 |
| [dsh-network-settings](#plugin-1337292910-root) | 在 DSH 设置中提供平台网络诊断、配置预览与快照恢复。 | [Q03](../../plugins/kanneiren--dsh-network-settings/INSIGHT.md#research-q03) 报告与人工命令对照后再改配置。 |
| [dsh-ollama-cloud](#plugin-1394197658-root) | 为 DSH 接入 Ollama Cloud，提供模型发现、推理档位、额度视图及搜索和抓取。 | [Q03](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q03) 先保留可恢复的宿主配置并锁定已声明版本。 |
| [dsh-opencode-go](#plugin-1371644959-root) | 为 DSH 接入 OpenCode Go 与 Free 模型，提供多账号管理、额度显示和本地用量估算。 | [Q04](../../plugins/duskriver--dsh-opencode-go/INSIGHT.md#research-q04) 在独立 profile 配置可撤销测试凭据。 |
| [dsh-opencode-zen-plugin](#plugin-1402771540-root) | 把 OpenCode Console 对话模型接入 DSH 的四协议 LLM adapter，附设置卡与模型目录刷新。 | 先隔离试用单个获授权模型，再做四协议/工具/图片/错误矩阵；保护本地诊断文件。 |
| [dsh-openviking-enhance](#plugin-1401255267-root) | 在 DSH Web 界面展示 OpenViking Studio、会话记忆提交状态和当前召回结果。 | [Q05](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md#research-q05) 建议可信个人单机以非敏感会话对照一条归档和当前搜索；身份、端点或权限不符时停止并回服务端核查。 |
| [dsh-permission-rules](#plugin-1333515275-root) | 把可配置的工具权限规则、审批分流和代理网络判断接入 DSH。 | [Q03](../../plugins/perrylink--dsh-permission-rules/INSIGHT.md#research-q03) 在测试 profile 先预演并记录差异。 |
| [dsh-permissions](#plugin-1335349535-root) | 在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。 | 有明确威胁模型、能维护规则和保留宿主沙箱的团队可在非生产 profile 试用；先用只读/模拟工具跑对抗集，再启用 hard 保护真实路径。 |
| [dsh-plugin-gating-hub](#plugin-1333974533-root) | 在 DSH 内检查框架变更和插件兼容，提供升级备份、回滚与证据禁用。 | [Q03](../../plugins/noob-stupid--dsh-plugin-gating-hub/INSIGHT.md#research-q03) 先在可弃用副本演练并保存独立恢复点。 |
| [dsh-plugin-loopback-trust](#plugin-1394489199-root) | 在反代域名网页上将连接标为 host-owning，以恢复 DSH 设置的 Host 持久化。 | 仅受控反代部署且双层授权明确时试用；先查官方 trusted-host，验未授权浏览器被拒。 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。 | 能备份profile并理解guard重启的维护者可在可丢弃环境小范围试用，先只读发现再评估已审查候选；报告/脚本不清或快照提前消失就停止后续安装。 |
| [dsh-plugin-manager](#plugin-1334267268-root) | 在 DSH 设置中展示插件中文用途与备注，并提供启停、目录覆盖及配置备份导入导出。 | 建议观察，在副本先核对owner权限、全局影响和锁占用/中断恢复，确认后再定义小范围试用；关键配置保留独立备份。 |
| [dsh-plugin-mobile-gateway](#plugin-1338398749-root) | 为 DSH 提供设备配对、移动会话同步和可选实验传输。 | [Q03](../../plugins/clarklevis1995--dsh-plugin-mobile-gateway/INSIGHT.md#research-q03) 先只在受控 LAN 检查。 |
| [dsh-plugin-proxy](#plugin-1374274543-root) | 为DSH提供直连、系统及HTTP/SOCKS手工代理设置，切换Undici全局路由并可导出子进程环境。 | 可信单一管理者且允许失败回原出口可试用。 |
| [DSH-Portable](#plugin-1333591877-root) | 提供便携DSH桌面运行环境、分离更新及数据维护工具。 | [Q03](../../plugins/wsl043--dsh-portable/INSIGHT.md#research-q03) 稳定线同平台副本演练后再搬日常数据。 |
| [dsh-purge Community](#plugin-1421822085-root) | 集中管理 DSH 提示注入、宿主补丁、自检与备份回滚。 | 只在授权隔离实例核对补丁、完整状态和回滚；依赖原生控制的日常环境保留原配置。 |
| [dsh-reasoning-tiers](#plugin-1367305514-root) | 按模型知识规则补齐pi-ai推理档位声明，并提供模型上下文、输出与图片能力编辑页。 | 先观察，关闭自动写并备份，先修最终写集/撤销失败保留，再评估单profile单模型。 |
| [dsh-recipe](#plugin-1336583700-root) | 把本地场景配方展开成去重插件清单和安装命令，支持关键词搜索与多配方组合。 | 作为选型草案试用，补齐profile/版本/配置再执行。 |
| [dsh-remote-ssh-run](#plugin-1384810201-root) | 在 DSH 中对配置主机执行白名单 SSH 命令。 | [Q04](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q04) 用隔离测试机与低权限账户预核 host key，只运行审查过的只读探针；未知状态先查远端。 |
| [dsh-repeat-stop](#plugin-1339262076-root) | 在 DSH 工具执行前，按 Agent 对连续相同工具和参数的调用计数，并拒绝超过阈值的调用。 | [Q04](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md#research-q04) 当前观察，先核对宿主消息窗口和双钩子对象身份；确认后只在可丢弃任务检查阈值与合法等待。 |
| [dsh-router-loomy](#plugin-1376777535-root) | 将 Loomy 云端 Chat Completions 通道接入 dsh-router，自动读本机客户端登录态。 | 隔离 profile/模拟上游完成协议和脱敏验证，再以授权账户小流量试用。 |
| [dsh-sakurafrp](#plugin-1365163902-root) | 在 DSH 中管理现有移动网关，提供链路状态、开关、配对二维码、设备撤销与自愈入口。 | 先观察，并在隔离链路验证关闭后跨重启仍关闭、标记不可写有明确失败、非3080端口不操作别的实例。 |
| [dsh-sev](#plugin-1346872712-root) | 通过 SSH 隧道在本地 DSH 查看远端会话、打开界面并提交任务。 | [Q03](../../plugins/buzzso--dsh-sev/INSIGHT.md#research-q03) 先观察隔离远端，只用无副作用测试输入，未知状态回远端查证。 |
| [dsh-skill-mcp-panel](#plugin-1333673564-root) | 在 DSH 侧栏与 dsh-panel 命令行管理工作区技能及 profile 的 MCP 服务器配置。 | [Q04](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q04) 可在完整备份和临时作用域中试用管理便利，先只读再导入可丢弃Skill；测试MCP前核对命令/地址/表达式。 |
| [dsh-studio](#plugin-1334791300-root) | 独立 Tauri 客户端监督本机 Harness，提供插件浏览和配对网关。 | [Q03](../../plugins/moresyl--dsh-studio/INSIGHT.md#research-q03) 先在测试 profile 对照原流程并验收进程恢复。 |
| [dsh-subagent-role-router](#plugin-1421306160-root) | 为 DSH 子代理分配模型路由，提供失败切换与当前会话的改路由工具。 | [Q03](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q03) 先用虚拟请求检查回退。 |
| [dsh-sysmon](#plugin-1334434271-root) | DSH Web 悬浮显示宿主 CPU、内存与根文件系统使用率。 | Linux 单宿主仅作辅助观察；正式容量/告警仍用现有监控，试点时注入采样失败并确认 stale 状态。 |
| [dsh-telemetry-redactor](#plugin-1333368566-root) | 在DSH遥测记录导出副本中替换受支持的敏感键和凭据模式，保留原始会话日志。 | 已有遥测需求且可审计监听器顺序的维护者可小范围试用，先用合成凭据核对后端副本、canonical与拒绝记录；不能借此主动扩大共享，遇绕过或无法发现的误删就停止依赖。 |
| [dsh-token-bi](#plugin-1428375235-root) | 聚合 DSH 会话的 Token 用量，并按模型、日期和会话显示报告。 | [Q03](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q03) 先用虚拟数据验收。 |
| [dsh-token-stat](#plugin-1348535666-root) | 读取DSH会话日志累计token用量，按模型和日期展示，并保留报告及归档账本。 | 建议需长期用量趋势的维护者受控试用并核对多入口一致性；暂不用于财务结算或精确账单。 |
| [dsh-tool-budget](#plugin-1350325873-root) | 为 DSH Agent 的工具调用设置按对象计数的上限。 | [Q04](../../plugins/173787247--dsh-tool-budget/INSIGHT.md#research-q04) 先在隔离会话校验计数与过滤，把它作为附加提示而非资金预算。 |
| [dsh-tool-explorer](#plugin-1351594249-root) | 在DSH Web集中浏览、编辑、安装与切换技能，管理和探测MCP服务器。 | 观察，先备份技能/lock/patch，受信本机可继续核展示与独立开关，避免唯一bundle直接改名升级。 |
| [dsh-tts-flash](#plugin-1363291561-root) | DSH 桌面端流式回复语音朗读与等待短语播放插件，支持 Edge 和云端 TTS。 | 先在隔离桌面试听 Edge，再用受控云密钥验证长回复、中断、权限与费用。 |
| [dsh-ui-auth](#plugin-1343420855-root) | 为 DSH Web 提供账户登录、用户管理、TOTP/Passkey、会话授权及按用户模型配置。 | 建议观察，先固定目标宿主完成可达面和状态恢复核查；互不信任用户还需独立系统权限边界，不能把登录页当隔离验收。 |
| [dsh-usage](#plugin-1335815757-root) | 在 DSH Web 中展示会话 Token 用量与供应商余额。 | [Q03](../../plugins/aisland-sjl--dsh-usage/INSIGHT.md#research-q03) 从关闭余额的临时目录开始。 |
| [dsh-usage-dashboard-plus](#plugin-1334023305-root) | 在DSH侧栏显示DeepSeek余额和日志估算消费，并汇总外部视觉调用与每会话模型/延迟统计。 | 先观察，可信单用户只作趋势对照。 |
| [dsh-usage-stats](#plugin-1333685863-root) | 在 DSH 中展示供应商账户、Token 用量、费用估算和预算，支持聚合导出。 | [Q03](../../plugins/ychris12138--dsh-usage-stats/INSIGHT.md#research-q03) 先关闭账户轮询做本地统计对照，再按 [Q02](../../plugins/ychris12138--dsh-usage-stats/INSIGHT.md#research-q02) 检查真实部署的回环和导出边界。 |
| [dsh-vps](#plugin-1377159975-root) | 为自有 VPS 部署带登录网关、HTTPS 和服务管理的 DSH。 | 先在隔离 VPS 钉所有文件来源、演练令牌缺失/备份失败/回滚，并对照原生隧道或手工部署；正式公网持续采用需独立安全及恢复验收。 |
| [dsh-web](#plugin-1331636953-root) | 面向 DeepSeek Harness Web GUI 的模块化插件与主题集合。 | [Q05](../../plugins/zhu1090093659--dsh-web/INSIGHT.md#research-q05) 建议备份并在隔离 profile 先核实来源和所需行；版本、权限或恢复状态不明时暂停并改用按需安装。 |
| [dsh-web-all](#plugin-1331636953-packages-dsh-web-all) | 将 DSH Web 家族插件组合为可按行配置的聚合安装包。 | [Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md#research-q05) 建议备份并在隔离 profile 核对所需行和权限；版本或副作用不明时停止并恢复或改按需安装。 |
| [dsh-web-lan-access](#plugin-1334255288-root) | 为 DSH Web 提供多接口访问与远程宿主设置支持。 | [Q03](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md#research-q03) 优先核对原生单接口是否足够，确需多接口时做 [Q02](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md#research-q02) 的隔离验证。 |
| [dsh-web-restart](#plugin-1335060007-root) | Windows DSH Web 的侧栏重启按钮，调用硬编码 PowerShell 外部脚本。 | 暂不直接采用；只在隔离 Windows 复核脚本、授权和失败状态后考虑。 |
| [dsh-win32](#plugin-1334876923-root) | 诊断原生 Windows 的 DSH 组件，提供快捷方式、组件验证和旧 bundle 停用。 | [Q03](../../plugins/sjh9714--dsh-win32/INSIGHT.md#research-q03) 先检查测试 profile，组件验证成功后再独立验收真实会话。 |
| [dsh-workspace-tools](#plugin-1363511446-root) | 按已注册工作区为新根会话自动选择 Agent 与权限预设的设置页和事件监听器。 | 先在低权限工作区限定试用；全权限规则和大小写敏感环境先验证匹配及首 turn 顺序。 |
| [dsh-wsl-clock](#plugin-1351854066-root) | 提供 clock_doctor 工具，诊断 WSL 与 Windows UTC 时间偏移。 | [Q04](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md#research-q04) 只读试用并手工交叉核对，不自动重启；不一致回原诊断。 |
| [dsh-wsl-compose](#plugin-1381842592-root) | 在 DSH 中读取 Docker Compose 服务状态与日志，并按配置启停项目。 | [Q03](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md#research-q03) 在隔离测试项目只评估只读工具，变更时使用经核对目标的原生命令。 |
| [dsh-wsl-db](#plugin-1381859591-root) | 在 DSH 中探测 PostgreSQL 和 Redis，并运行受规则限制的查询。 | [Q03](../../plugins/173787247--dsh-wsl-db/INSIGHT.md#research-q03) 在合成实例验收显式目标和读权限，避免用真实业务凭据作首次试验。 |
| [dsh-wsl-defender](#plugin-1391141174-root) | 从 WSL 查看 Windows Defender、防火墙、检测记录与排除项。 | [Q03](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md#research-q03) 先在隔离 Windows 主机对照每个探针，空结果不用于结论。 |
| [dsh-wsl-dns](#plugin-1351854118-root) | 提供 dns_doctor，对照 WSL 与 Windows 的 DNS IPv4 解析和 resolv.conf。 | [Q04](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q04) 观察并先补错误和预算，不以ok/mismatch自动修DNS；回原生查询核实。 |
| [dsh-wsl-editor](#plugin-1351854212-root) | 在 Windows Cursor、VS Code 或 Notepad 中打开 WSL 路径并支持可选行列。 | [Q04](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md#research-q04) 显式绝对路径/可信样例试用，人工确认文档；取消或失败先核窗口再重试。 |
| [dsh-wsl-eventlog](#plugin-1391143266-root) | 从 WSL 查看 Windows 事件日志的有限条目与消息摘要。 | [Q03](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q03) 用测试事件对照样本与原始日志。 |
| [dsh-wsl-fetch](#plugin-1362694736-root) | 让 WSL 中 DSH 的 web_fetch 通过 Windows HTTP 代理读取公开网页。 | 先用无敏感 URL 的公开文本页确认 provider 和结果。 |
| [dsh-wsl-helm](#plugin-1381843528-root) | 在 DSH 中列出 Helm 发布并查看状态与历史。 | [Q03](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q03) 仅用测试 kubeconfig 对照同名发布，确定目标后再解释结果。 |
| [dsh-wsl-k8s](#plugin-1381726881-root) | 在 DSH 中查询 kubectl 上下文、资源状态、对象详情和 Pod 日志。 | [Q03](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md#research-q03) 只在无生产凭据的测试 profile 验证两类 context 和非零退出，确认读取边界后再评估采用。 |
| [dsh-wsl-llamacpp](#plugin-1381832318-root) | 在 DSH 中探测 llama.cpp 兼容服务并请求单次聊天生成。 | [Q03](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md#research-q03) 用测试 profile 验证列表及一个已知可用模型的非空输出。 |
| [dsh-wsl-mnt](#plugin-1351854159-root) | 提供 mnt_doctor，按路径分类 Windows 挂载工作区并给出 Linux home 建议。 | [Q04](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md#research-q04) 显式path并核挂载/基准，不按ok自动迁移，冲突或误判回原检查。 |
| [dsh-wsl-net](#plugin-1338965593-root) | 为 WSL 中的 DeepSeek Harness 诊断代理环境、宿主进程、端口监听与 HTTPS 可达性，并生成修复建议。 | [Q03](../../plugins/173787247--dsh-wsl-net/INSIGHT.md#research-q03) 个人无凭据测试环境先关闭注入并核对PID，只把报告作为排障线索。 |
| [dsh-wsl-ollama](#plugin-1381724774-root) | 为 DSH 提供 Ollama 状态、模型列表、非流式对话和向量工具。 | 先固定可信本地地址，用短文本确认结果；路由或宿主数据范围不清时回本地 CLI。 |
| [dsh-wsl-perf](#plugin-1391142601-root) | 从 WSL 的 DSH 会话查看 Windows 主机 CPU、内存、磁盘和进程快照。 | [Q03](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md#research-q03) 在测试机对照工作集排行和 CIM 指标，遇到未知零值回原生。 |
| [dsh-wsl-power](#plugin-1391140034-root) | 从 WSL 查询 Windows 活动电源方案、电池和交流供电睡眠设置。 | [Q03](../../plugins/173787247--dsh-wsl-power/INSIGHT.md#research-q03) 在测试机核对 AC、语言和无电池情况。 |
| [dsh-wsl-registry](#plugin-1391142974-root) | 从 WSL 查询部分 Windows 注册表键、子键和键值。 | [Q03](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md#research-q03) 在合成键上先验证段边界和字面路径，避免读取生产值。 |
| [dsh-wsl-secret](#plugin-1381733290-root) | 在 DSH 中查找 pass 条目、解密 pass 或 age 内容，并按需写入环境变量。 | [Q03](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md#research-q03) 只在独立测试进程中用虚拟密钥核对作用域与日志。 |
| [dsh-wsl-service](#plugin-1391140376-root) | 从 WSL 查看 Windows 服务列表、状态、启动配置和依赖。 | [Q03](../../plugins/173787247--dsh-wsl-service/INSIGHT.md#research-q03) 先通过测试列表核对真实 Name，再查询详情和依赖。 |
| [dsh-wsl-shot](#plugin-1351854253-root) | 将 Windows 剪贴板图片保存为 WSL 文件，供后续多模态会话引用。 | [Q04](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md#research-q04) 非敏感样图/独立目录先核Public权限/失败残留与后续接图；异常回手工。 |
| [dsh-wsl-systemd](#plugin-1381843201-root) | 在 DSH 中查询 systemd 用户单元、状态和近期日志。 | [Q03](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md#research-q03) 先对照原命令验证可读范围和日志截断，再用于测试服务排障。 |
| [dsh-wsl-terraform](#plugin-1381843937-root) | 在 DSH 中验证 Terraform 或 OpenTofu 配置，并读取计划摘要和状态地址。 | [Q03](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md#research-q03) 用隔离工程验证真正无变更与信号退出，遇不确定结果回原计划。 |
| [dsh-wsl-vllm](#plugin-1381832640-root) | 在 DSH 中查看 vLLM 服务可达性和模型，并调用聊天补全。 | [Q03](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md#research-q03) 使用独立测试 profile 对比直接请求，核对模型和非空回复。 |
| [dsh-zspace](#plugin-1406500233-root) | 用 19 个模型工具管理极空间 NAS 文件、容器和系统状态。 | 保持观察，不连接承载唯一数据或家庭核心服务的 NAS；先只开只读工具，在测试共享目录验证通道切换和重复请求。 |
| [DSHBox](#plugin-1336708336-root) | 在 Android 设备上运行 DeepSeek Harness，集成 Debian 环境、双渲染变体、终端和移动工具。 | 用测试机和非敏感工作区做一次本地会话及重启恢复，保持开发者通道关闭。 |
| [EchoBird](#plugin-1158472225-root) | 桌面 AI 工具管理应用，提供模型配置、账号管理和本地多候选路由。 | [Q05](../../plugins/edison7009--echobird/INSIGHT.md#research-q05) 在独立配置使用受控任务比较直连，数据或续接边界不清时回退。 |
| [Engramory DSH 适配目录](#plugin-1268424426-adapters-dsh) | Engramory 仓库中存放 DeepSeek Harness 插件实现的适配器分组目录。 | [Q02](../../plugins/tinqiao-oss--engramory--adapters-dsh/INSIGHT.md#research-q02)仅observe资源导航，运行需求直接转固定plugin子包；不要把根和容器重复安装或把一份运行贡献计三次。 |
| [feishu-dsh-plugin](#plugin-1364766828-root) | 通过自建飞书应用为 DSH 提供 IM、文档、Bitable、Sheets 和权限工具的集成插件。 | 按测试租户只读→写入→权限操作分级试用，所有发送/修改/分享需按用户范围授权。 |
| [HOL Guard](#plugin-1194748811-root) | 为 Agent 动作提供策略审查、审批、扫描和证据入口。 | [Q04](../../plugins/hashgraph-online--hol-guard/INSIGHT.md#research-q04) 隔离验证实际钩子，不能以静态扫描代替执行覆盖。 |
| [K8E](#plugin-292529340-root) | 自托管 AI Agent 沙箱平台，提供会话、执行、文件与 DSH 接入 | [Q05](../../plugins/xiaods--k8e/INSIGHT.md#research-q05) 建议已有运维条件的团队以独立 profile 试用读写、断连和销毁；发生本机误写、串扰或残留会话则停止并退回 CLI。 |
| [Local Shell MCP for DSH](#plugin-1249040497-root) | 将 Local Shell MCP 服务的执行工具和会话工作区接入 DeepSeek Harness。 | [Q03](../../plugins/fwerkor--local-shell-mcp/INSIGHT.md#research-q03) 先检查隔离会话归属与远端认证，再决定是否引入工具。 |
| [Mebular DSH Plugin](#plugin-1339704814-packages-dsh-plugin) | 把 Mebular daemon 的 MCP 与 Console 接入 DSH，并管理连接和受管进程状态。 | [Q03](../../plugins/windsander--mebular--packages-dsh-plugin/INSIGHT.md#research-q03) 先测试节点只读。 |
| [mem9](#plugin-1175756746-root) | 为 AI Agent 提供跨会话、跨设备的持久共享记忆和检索。 | [Q05](../../plugins/mem9-ai--mem9/INSIGHT.md#research-q05) 先关闭自动写入，在隔离空间用合成事实验证读取、更正和删除；数据授权或传播不明时回本地笔记。 |
| [Mirage](#plugin-1231135337-root) | 用虚拟文件系统、命令及运行时为 Agent 组合统一终端。 | 先用低权限假源验证权限、输出及失败恢复；无法核实 effect 时停止真实写接入。 |
| [Mirage DSH Providers](#plugin-1231135337-typescript-packages-dsh) | 为 DSH 的文件和 shell provider 接入 Mirage 工作区。 | 先在独立 profile 验证只读挂载、长输出和审批；不一致则回原生 provider。 |
| [MultiVibe Companion for DSH](#plugin-1168322081-plugins-dsh-multivibe) | 连接 DSH 与 MultiVibe 网关，并查看可用模型及连接状态。 | [Q05](../../plugins/thibautrey--multivibe--plugins-dsh-multivibe/INSIGHT.md#research-q05) 建议已有网关者在隔离 profile 使用专用密钥试配置，确认容量、状态与费用后再做获授权测试。 |
| [Open Managed Agents](#plugin-1206555053-root) | 提供自托管 Agent 会话、工具执行和恢复基础设施。 | [Q03](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q03) 先以固定组合和模拟外部服务观察；认证、沙箱或对账不满足时停止并保留现有方案。 |
| [opencode2dsh](#plugin-1350368388-packages-plugin) | 为 DSH 提供 OpenCode Zen 匿名模型适配与可选本地委派。 | 非敏感任务核对实际来源、输出与网络资格；不明结果先对账。 |
| [OpenGuardrails](#plugin-1081166515-root) | 以本地规则、模型裁决、秘密替换、网关和 sandbox 为 AI Agent 提供安全检查与行为记录。 | [Q03](../../plugins/openguardrails--openguardrails/INSIGHT.md#research-q03) 仅在一次性工作区以合成秘密评本地规则，保留宿主审批，明确 observe/enforce 差异。 |
| [OpenViking](#plugin-1128123594-root) | 为 AI Agent 组织知识、记忆与技能的上下文数据库。 | [Q05](../../plugins/volcengine--openviking/INSIGHT.md#research-q05) 建议先对非敏感可回滚语料逐步试用并核验原文；数据外发、来源或权限不明时暂停并使用原文件搜索。 |
| [Our Free Model](#plugin-1385896447-root) | 为 DSH 提供免费模型、账户渠道和自带密钥提供者的统一模型接入。 | [Q05](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md#research-q05) 建议在确认供应商政策后以脱敏内容试单车道；数据去向不明、限额或工具异常时停止并切回已知官方端点。 |
| [pi2dsh](#plugin-1333452358-root) | 在 DSH 中提供 Pi 扩展兼容层，发现已安装 Pi 包并映射工具、命令、会话和界面能力。 | [Q04](../../plugins/weijiafu14--pi2dsh/INSIGHT.md#research-q04) 已有Pi任务的用户可在独立profile逐包试用，固定宿主/surface/扩展，先inspect再对照真实关键任务。 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root) | 监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。 | 需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 |
| [SandBase Harness](#plugin-1297278222-root) | 本地优先的 Agent 运行时，管理持久会话、工具、记忆、凭据、审计与控制台 | [Q04](../../plugins/sandbaseai--sandbase-harness/INSIGHT.md#research-q04) 建议先观察，只用可信只读输入评估会话回收与产物接口；报告不绑定固定提交或结果未知时停止并回到单次脚本加人工验收。 |
| [Sealos Skills](#plugin-1150374613-root) | 向 DSH 注册 Sealos 部署与运维技能，提供模板部署、数据库、存储及故障诊断指引。 | [Q04](../../plugins/labring--sealos-skills/INSIGHT.md#research-q04) 限定本地、无生产数据的小应用；同时验收页面和工作负载，托管资源缺失立即停止。 |
| [SeekTTY](#plugin-1334096871-root) | 复用DeepSeek Harness原生服务的终端工作区，提供会话、设置及审批交互。 | [Q03](../../plugins/hilbert-beinghappy--seektty/INSIGHT.md#research-q03)复制profile固定Host/spec并禁自动更新，先核审批/恢复/退出，失败退原入口。 |
| [SkillCorpus](#plugin-1330431542-root) | 聚合、筛选和评估技能语料，并按任务从本地与远端来源检索技能，供不同 Agent 宿主使用。 | [Q03](../../plugins/evermind-ai--skillcorpus/INSIGHT.md#research-q03) 先限定本地审核目录，关闭远端与共享，用少量可独立验收任务比较固定目录。 |
| [Tingly Box](#plugin-1100971867-root) | 统一模型网关，为客户端与团队提供协议入口、路由和管理能力。 | [Q05](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q05) 在隔离本机先测单客户端与失败路径；不满足身份、预算或恢复条件时退回原端点。 |
| [Token Bank](#plugin-1233571420-root) | 独立运行的 AI 网关客户端，集中配置模型来源、路由与用量，并提供 DSH 配置接入。 | 只用模拟上游和临时配置检验接管、失败与退出，不能确认恢复就保留直连。 |
| [TokenLedger](#plugin-1333969047-root) | 从 DSH 会话日志聚合 Token 用量，按路由、模型和项目展示，并提供费用估算与可选账户余额查询。 | [Q03](../../plugins/zh667--tokenledger/INSIGHT.md#research-q03) 先用副本日志核usage与归因，读failed/未知/未定价。 |
| [Treg](#plugin-1301657572-root) | 为 Agent 提供工具目录、凭据注入代理和调用计费。 | 选择受控只读任务、核对账单及费用上限，异常时撤销 token 并回退直连。 |
| [Usage Billing](#plugin-1363429979-plugin-usage-billing) | 从 DSH 会话日志聚合 token 用量，以价格与汇率快照估算费用并显示历史回填、预算和未计价状态。 | 先观察并用合成夹具核规则和锁价，不用于结算/硬预算；对账不一致保留旧账本回provider原始记录，见 [Q03](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md#research-q03)。 |
| [WorkDSH 企业连接](#plugin-1363739656-packages-enterprise-connection) | 从个人空间安装管理员归档后连接 WorkDSH 企业账号与协作。 | [Q03](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md#research-q03) 有匹配 Desktop 与测试后台才验证归档、身份和退出；任一边界未确认即暂停分发并退回个人空间。 |
| [Yao Agents](#plugin-403559729-root) | 自托管管理多设备上的Agent、工作区与任务，提供桌面、浏览器、移动端及API接入。 | 当前建议有多机需求且能承担自托管的团队先观察，在隔离节点做架构核验，不把真实业务迁入平台。 |
| [ybkkasi](#plugin-1416699252-root) | 基于 DSH 和 Cordis 的企业 Agent 治理平台，提供组织、任务、审批、用量及审计。 | [Q03](../../plugins/01men--ybkkasi/INSIGHT.md#research-q03) 在隔离实例先完成双组织拒绝验收与单任务回读，再评估真实接入。 |

<a id="plugin-1428034710-root"></a>

## [@sueleven/dsh-auto-update](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sueleven/dsh-auto-update)

> **用途**：多npm插件桌面用户集中发现更新；合格交付须是同意版本被安装并通过重启功能核查。

> **亮点**：整合启动延迟检查和官方安装通道，减少逐包手工发现，默认确认前不安装。参见[Q01](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q01)。

> **思考**：runApply未把提示targets传给脚本，实际重新查latest/候选；可能安装用户未看到的版本，且apply处理器未见局部确认围栏。参见[Q02](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q02)、[Q03](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q03)。

> **建议**：未验证假设是版本/候选/profile摘要绑定的确认计划，漂移后重新确认而非自动换集合；故障对照核计划外安装。参见[Q04](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1129378320-root"></a>

## [AI Infrastructure Agent Skills](../../plugins/yzlnew--infra-skills/INSIGHT.md)

[![GitHub ★ 157](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=157&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yzlnew/infra-skills)

> **用途**：已有GPU/训练或技术表达经验的工程师，可按任务选Skill资源；本集合不提供统一DSH运行时或自动生产验收。

> **亮点**：[Q01](../../plugins/yzlnew--infra-skills/INSIGHT.md#research-q01) 将领域知识、示例、调试和具体产物路线组织成任务入口；[Q02](../../plugins/yzlnew--infra-skills/INSIGHT.md#research-q02) 存在输入校验与数值对照代码，不是纯文档列表，底层框架和公式归上游。

> **思考**：[Q02](../../plugins/yzlnew--infra-skills/INSIGHT.md#research-q02) 估算不等训练峰值，测试可能跳过且只覆盖样例；--json前仍打印加载文字会影响直接解析。 [Q03](../../plugins/yzlnew--infra-skills/INSIGHT.md#research-q03) 环境与版本负担、作者未严格校对警告，使集合不宜整包作生产默认。

> **建议**：[Q04](../../plugins/yzlnew--infra-skills/INSIGHT.md#research-q04) 提出每示例附输入、框架/硬件、执行状态与对照结果的最小复核记录，检验是否减少错误推广；现有测试不自动等于目标环境通过。

[查看完整分析](../../plugins/yzlnew--infra-skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336031182-root"></a>

## [Almost Full Access](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alnita-M/dsh-Almost_Full_Access) [![npm 30d 989](https://img.shields.io/static/v1?label=npm+30d&message=989&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-almost-full-access) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-almost-full-access)

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

<a id="plugin-1269979871-dsh-plugins-ark-plan-api"></a>

## [Ark Plan API](../../plugins/volcengine--ark-cli--dsh-plugins-ark-plan-api/INSIGHT.md)

[![GitHub ★ 148](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=148&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/ark-cli) [![npm 30d 1,752](https://img.shields.io/static/v1?label=npm+30d&message=1%2C752&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@volcengine/ark-plan-api) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@volcengine/ark-plan-api)

> **用途**：已有方舟对应账号并要在 DSH 选择模型的开发者。

> **亮点**：[Q01](../../plugins/volcengine--ark-cli--dsh-plugins-ark-plan-api/INSIGHT.md#research-q01) 把不同方舟服务预置为独立路由。

> **思考**：[Q02](../../plugins/volcengine--ark-cli--dsh-plugins-ark-plan-api/INSIGHT.md#research-q02) 固定 checkout 缺载体，不能确认最终组合。

> **建议**：[Q04](../../plugins/volcengine--ark-cli--dsh-plugins-ark-plan-api/INSIGHT.md#research-q04) 在选择前展示地区和计费类别。

[查看完整分析](../../plugins/volcengine--ark-cli--dsh-plugins-ark-plan-api/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333144072-root"></a>

## [Awesome DSH Plugins](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md)

[![GitHub ★ 486](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=486&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bruc3van/awesome-dsh-plugin)

> **用途**：DSH用户需要从仓库线索找到一个任务相关候选安装目标。

> **亮点**：[Q01](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md#research-q01)、[Q02](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md#research-q02) 将候选身份/产物依据与宿主可读索引连接，减少目标解析与发布不一致。

> **思考**：[Q03](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md#research-q03) 入选编辑优先/Star混合，metadata核实非安全/实机/收益背书；顶限和缺mapping不等不适用。

> **建议**：[Q04](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md#research-q04) 决策处展示核验层级和入选原因，若不降误信或增加负担即否定。

[查看完整分析](../../plugins/bruc3van--awesome-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333322877-root"></a>

## [billion-context-dsh](../../plugins/tyan66666--billion-context-dsh/INSIGHT.md)

[![GitHub ★ 168](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=168&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tyan66666/billion-context-dsh) [![npm 30d 7,845](https://img.shields.io/static/v1?label=npm+30d&message=7%2C845&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context-dsh) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context-dsh)

> **用途**：需要理解历史 DSH 长会话压缩行为的维护者。

> **亮点**：[Q01](../../plugins/tyan66666--billion-context-dsh/INSIGHT.md#research-q01) 将上游主动压缩移植到 DSH，并保留预设区别。

> **思考**：[Q02](../../plugins/tyan66666--billion-context-dsh/INSIGHT.md#research-q02) 持久进展才重试，但结果质量仍未知。[Q03](../../plugins/tyan66666--billion-context-dsh/INSIGHT.md#research-q03) 固定项目已停止维护。

> **建议**：[Q04](../../plugins/tyan66666--billion-context-dsh/INSIGHT.md#research-q04) 在同一任务衡量保真与净 token。

[查看完整分析](../../plugins/tyan66666--billion-context-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-124882400-root"></a>

## [Browser4](../../plugins/platonai--browser4/INSIGHT.md)

[![GitHub ★ 1,171](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C171&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/platonai/Browser4)

> **用途**：面向需要多页面交互和结构提取的自动化开发者。

> **亮点**：[Q02](../../plugins/platonai--browser4/INSIGHT.md#research-q02) 组合 CLI、后端工具和不同会话所有权；不把底层浏览器或 CDP 视为原创。

> **思考**：[Q03](../../plugins/platonai--browser4/INSIGHT.md#research-q03) 本地会话状态不能证明网站操作未发生或自动幂等；[Q04](../../plugins/platonai--browser4/INSIGHT.md#research-q04) 远端和数据范围未测。

> **建议**：[Q05](../../plugins/platonai--browser4/INSIGHT.md#research-q05) 提议持久操作意图并在恢复前核对站点，需对照现有 stale 和 URL 检查。

[查看完整分析](../../plugins/platonai--browser4/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1333646693-root"></a>

## [Codex Connect](../../plugins/franksong2702--dsh-codex-connect/INSIGHT.md)

[![GitHub ★ 179](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=179&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/franksong2702/dsh-codex-connect) [![npm 30d 7,739](https://img.shields.io/static/v1?label=npm+30d&message=7%2C739&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-connect) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-connect)

> **用途**：需要在 DSH 会话中使用 Codex 模型并保留宿主工具流程的开发者。

> **亮点**：[Q01](../../plugins/franksong2702--dsh-codex-connect/INSIGHT.md#research-q01) 将 OAuth 模型纳入既有宿主模型选择和 Agent 流程。[Q02](../../plugins/franksong2702--dsh-codex-connect/INSIGHT.md#research-q02) 任务守卫单独限制指定宿主的自动化。

> **思考**：[Q02](../../plugins/franksong2702--dsh-codex-connect/INSIGHT.md#research-q02) 精确宿主矩阵、旧任务恢复和真实账号权限是三个验收范围。

> **建议**：[Q04](../../plugins/franksong2702--dsh-codex-connect/INSIGHT.md#research-q04) 将目录、包兼容与账户权限分开显示并验证是否减少误判。

[查看完整分析](../../plugins/franksong2702--dsh-codex-connect/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1244140731-dsh-cue-omni-reader-guard"></a>

## [Cue Omni Reader Guard](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader-guard/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sensedeal/cue-skills) [![npm 30d 107](https://img.shields.io/static/v1?label=npm+30d&message=107&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-omni-reader-guard) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-omni-reader-guard)

> **用途**：维护 Omni Reader 的 DSH 管理员希望对模型解析调用实施可配置入口策略。

> **亮点**：[Q01](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader-guard/INSIGHT.md#research-q01) 把 URL 和本地源策略移入模型工具调用前，提供可配置的默认拒绝。

> **思考**：[Q02](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader-guard/INSIGHT.md#research-q02) 仅检查主机字符串和词法路径，另有 IPv6、通配域及根目录语义缺口。

> **建议**：[Q03](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader-guard/INSIGHT.md#research-q03) 对照 Guard 和下游目的地复核，测越界和误拒绝，效果不改善即退出。

[查看完整分析](../../plugins/sensedeal--cue-skills--dsh-cue-omni-reader-guard/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1341972254-root"></a>

## [DeepSeek Harness Desktop](../../plugins/baihejiangnan--deepseek-harness-desktop/INSIGHT.md)

[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/baihejiangnan/deepseek-harness-desktop)

> **用途**：需要分别维护实验与演示配置的DSH用户。

> **亮点**：[Q01](../../plugins/baihejiangnan--deepseek-harness-desktop/INSIGHT.md#research-q01) 将多实例数据目录和启动步骤接到桌面。

> **思考**：[Q02](../../plugins/baihejiangnan--deepseek-harness-desktop/INSIGHT.md#research-q02) 本机RPC与取消成功不能证明身份隔离或命令静止。

> **建议**：[Q04](../../plugins/baihejiangnan--deepseek-harness-desktop/INSIGHT.md#research-q04) 取消终结读回可能降低状态误判。

[查看完整分析](../../plugins/baihejiangnan--deepseek-harness-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333252932-root"></a>

## [DeepSeek Harness for fnOS](../../plugins/techysy--deepseek-harness-fnos/INSIGHT.md)

[![GitHub ★ 85](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=85&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/techysy/deepseek-harness-fnos)

> **用途**：自行维护NAS并希望常驻DSH的运维人员。

> **亮点**：[Q01](../../plugins/techysy--deepseek-harness-fnos/INSIGHT.md#research-q01) 集中fnOS部署与服务入口，Agent能力继承所用DSH。

> **思考**：[Q02](../../plugins/techysy--deepseek-harness-fnos/INSIGHT.md#research-q02) Host围栏不构成用户认证，直接端口与网关信任不同。[Q03](../../plugins/techysy--deepseek-harness-fnos/INSIGHT.md#research-q03)停止和卸载需独立读回。

> **建议**：[Q04](../../plugins/techysy--deepseek-harness-fnos/INSIGHT.md#research-q04) 敏感API验证真实身份与限制直接端口可作为待测方向。

[查看完整分析](../../plugins/techysy--deepseek-harness-fnos/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1333310793-root"></a>

## [DeepSeek Harness 桌面版](../../plugins/wess09--deepseekharnessdesktop/INSIGHT.md)

[![GitHub ★ 130](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=130&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wess09/DeepSeekHarnessDesktop)

> **用途**：希望从桌面启动 DSH Web 的开发者。

> **亮点**：[Q01](../../plugins/wess09--deepseekharnessdesktop/INSIGHT.md#research-q01) 整合运行时、服务启动和桌面窗口。

> **思考**：[Q02](../../plugins/wess09--deepseekharnessdesktop/INSIGHT.md#research-q02) 关闭和实际停止不同，探测也未验证服务归属。

> **建议**：[Q04](../../plugins/wess09--deepseekharnessdesktop/INSIGHT.md#research-q04) 让进程归属和退出动作可见。

[查看完整分析](../../plugins/wess09--deepseekharnessdesktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333277183-root"></a>

## [deepseek-harness-docker](../../plugins/runzhliu--deepseek-harness-docker/INSIGHT.md)

[![GitHub ★ 146](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=146&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/runzhliu/deepseek-harness-docker)

> **用途**：部署者要为 DSH 建立可启动、可备份的独立实例。

> **亮点**：[Q01](../../plugins/runzhliu--deepseek-harness-docker/INSIGHT.md#research-q01) 将发行物、浏览器和默认运行配置组装为可部署单元。

> **思考**：[Q02](../../plugins/runzhliu--deepseek-harness-docker/INSIGHT.md#research-q02) 健康探针不覆盖实际模型和会话，浏览器禁用自身沙箱，容器硬化不能证明租户隔离。

> **建议**：[Q03](../../plugins/runzhliu--deepseek-harness-docker/INSIGHT.md#research-q03) 增加鉴权后写读和恢复验收，对照探针误通过率。

[查看完整分析](../../plugins/runzhliu--deepseek-harness-docker/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1326893710-root"></a>

## [DSH Better Sidebar](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md)

[![GitHub ★ 4,789](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C789&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/DSH-better-sidebar) [![npm 30d 233,365](https://img.shields.io/static/v1?label=npm+30d&message=233%2C365&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar)

> **用途**：面向在 DSH 会话中频繁查看文件、编辑和核对 Git 的开发者；成熟 IDE 与终端仍可完成同类任务。

> **亮点**：[Q02](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q02) 和 [Q04](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q04) 显示会话目录、编辑与可注销扩展服务在一个工作台接线；相对 IDE 的增量主要是上下文组织，不能据此推断功能全面领先。

> **思考**：[Q03](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q03) 表明请求准入不等于工作目录隔离，文件操作可达宿主账户有权限访问的其他路径；目录误判或错误操作的影响不能仅凭会话作用域排除。

> **建议**：[Q07](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md#research-q07) 提出未验证的按真实路径授予写权限假设；若合法跨目录任务受阻或符号链接仍可绕过，应放弃。

[查看完整分析](../../plugins/omdsh-dev--dsh-better-sidebar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339185691-root"></a>

## [DSH Capability Menu](../../plugins/pkufudawei--dsh-capability-menu/INSIGHT.md)

[![GitHub ★ 95](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=95&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PKUfudawei/dsh-capability-menu) [![npm 30d 2,976](https://img.shields.io/static/v1?label=npm+30d&message=2%2C976&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@daweifu/capability-menu) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@daweifu/capability-menu)

> **用途**：用户装有大量工具与技能。

> **亮点**：[Q01](../../plugins/pkufudawei--dsh-capability-menu/INSIGHT.md#research-q01) 在保留调用者上下文时按需呈现能力。

> **思考**：[Q03](../../plugins/pkufudawei--dsh-capability-menu/INSIGHT.md#research-q03) 需覆盖其他调用路径及检索额外成本。

> **建议**：[Q05](../../plugins/pkufudawei--dsh-capability-menu/INSIGHT.md#research-q05) 可降低提示负担而保持任务成功率。

[查看完整分析](../../plugins/pkufudawei--dsh-capability-menu/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1374007757-plugins-dsh-codex-auth-plugin"></a>

## [DSH Codex Auth](../../plugins/fnosp--fnos-dsh--plugins-dsh-codex-auth-plugin/INSIGHT.md)

[![GitHub ★ 87](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=87&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FNOSP/fnos-dsh) [![npm 30d 9,655](https://img.shields.io/static/v1?label=npm+30d&message=9%2C655&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-codex-auth) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-codex-auth)

> **用途**：已有订阅用户需在DSH完成登录、目录选择和退出。

> **亮点**：[Q01](../../plugins/fnosp--fnos-dsh--plugins-dsh-codex-auth-plugin/INSIGHT.md#research-q01) 集中授权、镜像和模型使用状态。

> **思考**：[Q03](../../plugins/fnosp--fnos-dsh--plugins-dsh-codex-auth-plugin/INSIGHT.md#research-q03) 明文文件权限、双份凭据和代理部署需核查。

> **建议**：[Q05](../../plugins/fnosp--fnos-dsh--plugins-dsh-codex-auth-plugin/INSIGHT.md#research-q05) 可减少配置步骤并保持退出状态可追溯。

[查看完整分析](../../plugins/fnosp--fnos-dsh--plugins-dsh-codex-auth-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333748978-root"></a>

## [DSH Codex Desktop](../../plugins/michengai--dsh-codex-desktop/INSIGHT.md)

[![GitHub ★ 127](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=127&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-codex-desktop)

> **用途**：希望在桌面工作台使用 DSH 会话与插件的开发者。

> **亮点**：[Q01](../../plugins/michengai--dsh-codex-desktop/INSIGHT.md#research-q01) 将本地宿主、桌面视图和首启插件准备接到同一入口。

> **思考**：[Q02](../../plugins/michengai--dsh-codex-desktop/INSIGHT.md#research-q02) 渲染层设置与插件运行权限需分别验证，重启条件也需要按实际包状态检查。

> **建议**：[Q04](../../plugins/michengai--dsh-codex-desktop/INSIGHT.md#research-q04) 迁移结果与复原入口可改善部分失败后的辨识。

[查看完整分析](../../plugins/michengai--dsh-codex-desktop/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1336068061-root"></a>

## [DSH Crew](../../plugins/zseven-w--dsh-crew/INSIGHT.md)

[![GitHub ★ 192](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=192&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-crew) [![npm 30d 2,150](https://img.shields.io/static/v1?label=npm+30d&message=2%2C150&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-crew) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-crew)

> **用途**：这是原生DSH plugin，同时提供独立stdio MCP服务和外部编排器的角色/提示安装。任务是让已有Claude Code/Codex等编排器把自包含子任务交给DSH Agent并取回job结果，保留进度/令牌观测。参照是手工启动DSH会话、复制结果，或外部编排器原生子代理；本轮未比较任务质量、费用或吞吐。DSH提供模型、工具、preset和Session持久化，Crew新增跨入口分派、tier策略、job状态与安装桥，不能把DSH工具/模型能力算新发明。

> **亮点**：[Q01](../../plugins/zseven-w--dsh-crew/INSIGHT.md#research-q01)MCP与Hub桥把已有DSH Agent接入外部编排器，并增加tier策略和job观测，不把模型/工具继承能力归Crew。

> **思考**：[Q02](../../plugins/zseven-w--dsh-crew/INSIGHT.md#research-q02)Hub未消费origin/全局cwd锁，取消状态也可能被迟到完成覆盖，不能将局部守卫宣传为每次分派的安全保障。

> **建议**：[Q04](../../plugins/zseven-w--dsh-crew/INSIGHT.md#research-q04)Hub权威侧的执行归属与确认取消或能减少未知状态下重派，尚未实现和验证。

[查看完整分析](../../plugins/zseven-w--dsh-crew/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1364181676-root"></a>

## [DSH DeepSeek Web Login](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md)

[![GitHub ★ 353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cv-superding/dsh-deepseek-web-login) [![npm 30d 7,080](https://img.shields.io/static/v1?label=npm+30d&message=7%2C080&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepseek-web-login) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepseek-web-login)

> **用途**：面向已有网页账号、希望研究非官方供应商适配的个人DSH操作者；合格结果须核对必需输入、真实工具执行和最终产物，见[Q01](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q01)。

> **亮点**：[Q02](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q02)把提示词工具协议接到真实宿主工具事件，[Q04](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q04)按请求起始账号归属记录并在删除确认前保留清理责任。这些机制为有条件适配提供可查设计，不证明运行闭环或全局幂等。

> **思考**：[Q03](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q03)确认两次图片引用拒绝后的无图重发仍可能保留附图标记且无本分支告知；当前默认链式上下文也依赖远端早期约束保留。[Q04](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q04)表明凭据明文、导出及卸载/登出/远端删除是不同生命周期，正文恢复不能直接算任务完成。

> **建议**：[Q05](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md#research-q05)提出未验证的任务级恢复契约，把输入齐备、工具实执行、结果核对和远端清理状态分开。用图片拒绝、未知工具、约束丢失和删除超时对照，错误放行不降或维护负担高于正式替代就否定。

[查看完整分析](../../plugins/cv-superding--dsh-deepseek-web-login/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331608070-root"></a>

## [DSH Desktop](../../plugins/bruc3van--dsh-desktop/INSIGHT.md)

[![GitHub ★ 97](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=97&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bruc3van/dsh-desktop)

> **用途**：想统一管理桌面连接和运行时的 DSH 用户。

> **亮点**：[Q01](../../plugins/bruc3van--dsh-desktop/INSIGHT.md#research-q01) 希望用桌面窗口访问 DSH 的用户可在智能模式选择现有或内置运行时，也能指定自行部署的 Web 地址。manager 在同一代存在时返回其 ready，在 spawn 前建立运行时锁，再启动 child。相比终端手工启动，客户端统一发现和窗口入口。

> **思考**：[Q02](../../plugins/bruc3van--dsh-desktop/INSIGHT.md#research-q02) Electron 窗口启用 contextIsolation、sandbox 并关闭 Node。模型与工具执行仍依赖实际 DSH 部署，远端自定义地址认证需用户配置。默认共享和独立 home 有不同数据路径，切换不复制数据；运行时锁的进程存活与跨进程互斥仍需故障验证。

> **建议**：[Q04](../../plugins/bruc3van--dsh-desktop/INSIGHT.md#research-q04) 同时启动两个测试客户端，在锁写入、子进程落盘和退出阶段注入故障。以真正运行的 child 数量与 home 写入代为准，对照是否出现双写；若仅 UI 阻止而进程仍双开则改进锁协议。

[查看完整分析](../../plugins/bruc3van--dsh-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333321333-root"></a>

## [DSH Desktop](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md)

[![GitHub ★ 34,234](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34%2C234&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anywhere-labs/dsh-desktop)

> **用途**：[Q01](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q01) 面向希望在桌面管理 DSH 工作区的用户，合格结果包括完成任务及安全退出。

> **亮点**：[Q02](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q02) 把上游 DSH Host、Web 界面与桌面进程生命周期组合，并在 renderer 健康后再交付工作区；核心 Agent 能力属于上游，未证明运行收益。

> **思考**：[Q03](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q03) 的 Host 停止和 checkpoint 分支显示应用有恢复保护，但失败或超时会限制操作；健康回调不证明用户数据完整可恢复。

> **建议**：[Q04](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q04) 假设切换前展示实际数据根供用户核对可减少错误归属，须在同任务记录识别正确率、耗时和可还原性；尚未验证。

[查看完整分析](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334496914-root"></a>

## [DSH Desktop](../../plugins/web-casa--deepseek-harness-desktop/INSIGHT.md)

[![GitHub ★ 128](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=128&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/web-casa/DeepSeek-Harness-Desktop)

> **用途**：希望用独立桌面应用管理 DSH 启动和插件的用户。

> **亮点**：[Q01](../../plugins/web-casa--deepseek-harness-desktop/INSIGHT.md#research-q01) 将固定运行时及其就绪状态接到桌面界面。

> **思考**：[Q02](../../plugins/web-casa--deepseek-harness-desktop/INSIGHT.md#research-q02) IPC 限制和宿主插件权限分开，卸载也有中间态。

> **建议**：[Q04](../../plugins/web-casa--deepseek-harness-desktop/INSIGHT.md#research-q04) 将包操作的中间状态明确展示。

[查看完整分析](../../plugins/web-casa--deepseek-harness-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336850842-root"></a>

## [DSH Ecosystem Spec](../../plugins/t-auto--dsh-ecosystem-spec/INSIGHT.md)

[![GitHub ★ 89](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=89&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-ecosystem-spec)

> **用途**：需要统一来源和兼容声明格式的插件及发行版维护者。

> **亮点**：[Q01](../../plugins/t-auto--dsh-ecosystem-spec/INSIGHT.md#research-q01) 为规范和实现提供结构化发现与检查。

> **思考**：[Q02](../../plugins/t-auto--dsh-ecosystem-spec/INSIGHT.md#research-q02) 结构检查与摘要内容验证、运行兼容各是独立证据。

> **建议**：[Q03](../../plugins/t-auto--dsh-ecosystem-spec/INSIGHT.md#research-q03) 真实摘要比对可能减少错误固定引用，收益未测。

[查看完整分析](../../plugins/t-auto--dsh-ecosystem-spec/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1355618827-packages-dshb"></a>

## [DSH HoneyBee / DSHB](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md)

[![npm 30d 1,500](https://img.shields.io/static/v1?label=npm+30d&message=1%2C500&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@artenx/dshb) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@artenx/dshb)

> **用途**：[Q01](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q01) 已有多节点开发环境的维护者希望统一操作入口，合格结果须明确目标并能解释中断后的远端状态。

> **亮点**：[Q01](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q01)、[Q02](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q02) 将工作区绑定统一用于文件/命令/终端，配合摘要和事件前缀校验的会话导入，属于可核查的组合设计，不证明远端隔离与恢复完成。

> **思考**：[Q01](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q01) 绑定读取异常变空并可回本机；[Q02](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q02) 普通SSH kill无终止动作、执行连接未接hostVerifier，上游认证被替代，透明便利必须先满足目标与中断可信。

> **建议**：[Q03](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md#research-q03) 未验证的显式执行凭据记录节点、绑定版本、路径与取消能力，将损坏绑定变拒绝态；用两端哨兵与中断矩阵对照，错误目标未减少或负担过高即否定。

[查看完整分析](../../plugins/artenx--dsh-honeybee--packages-dshb/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333807290-root"></a>

## [DSH Market](../../plugins/dsh-market--dsh-market/INSIGHT.md)

[![GitHub ★ 10,030](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C030&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-market/dsh-market) [![npm 30d 776,009](https://img.shields.io/static/v1?label=npm+30d&message=776%2C009&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)

> **用途**：维护多个社区插件的 DSH 用户可集中发现、安装和整理插件；偶发安装者可先使用原生 Discover 与 CLI。

> **亮点**：[Q02](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q02) 显示它将目录选择和安装后盘面检查连成操作链，相比手工 CLI 补上可加载入口与冲突判断；这是组合与防护机制，未证明全球首创或实测省时。

> **思考**：[Q04](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q04) 表明取消不等于全事务回滚，且执行中失去 Agent hold 时会请求取消；用户仍需检查剩余状态。只有在恢复负担受控时，集中管理才能兑现价值。

> **建议**：[Q07](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q07) 提出先在独立 profile 试装并生成迁移计划的未验证假设；若状态无法可靠迁移或恢复负担反增，应放弃。

[查看完整分析](../../plugins/dsh-market--dsh-market/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334025844-root"></a>

## [DSH Multi Subscription Hub](../../plugins/aa728848--dsh-chatgpt-subscription/INSIGHT.md)

[![GitHub ★ 83](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=83&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aa728848/dsh-chatgpt-subscription) [![npm 30d 23,131](https://img.shields.io/static/v1?label=npm+30d&message=23%2C131&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eddyskywalker/dsh-chatgpt-subscription) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eddyskywalker/dsh-chatgpt-subscription)

> **用途**：多订阅用户希望统一模型和账号管理。

> **亮点**：[Q01](../../plugins/aa728848--dsh-chatgpt-subscription/INSIGHT.md#research-q01) 集中管理与按调用目录绑定账号请求。

> **思考**：[Q03](../../plugins/aa728848--dsh-chatgpt-subscription/INSIGHT.md#research-q03) 根包面积大，Linux明文与多存储留存需核对，授权依线路。

> **建议**：[Q05](../../plugins/aa728848--dsh-chatgpt-subscription/INSIGHT.md#research-q05) 单线路管理可减少切换摩擦，净收益待测。

[查看完整分析](../../plugins/aa728848--dsh-chatgpt-subscription/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1333295863-root"></a>

## [DSH Plugins Marketplace](../../plugins/bradegithub--dsh-plugins-marketplace/INSIGHT.md)

[![GitHub ★ 197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=197&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bradeGithub/DSH-Plugins-Marketplace) [![npm 30d 11,597](https://img.shields.io/static/v1?label=npm+30d&message=11%2C597&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-marketplace) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-marketplace)

> **用途**：已有DSH用户在GUI发现和管理第三方能力；原GitHub手搜+官方安装器基线。合格结果需预期来源与权限、可局部卸载及加载效果，不是收录/安装记录。

> **亮点**：[Q01](../../plugins/bradegithub--dsh-plugins-marketplace/INSIGHT.md#research-q01)与[Q02](../../plugins/bradegithub--dsh-plugins-marketplace/INSIGHT.md#research-q02)把静态发现、异构安装材料/风险选择和profile管理集中GUI，减少手工识别分发形态。官方bundle拒绝不绕过与缓存来源核查是可追踪取舍，但第三方执行能力来自OS/宿主。

> **思考**：[Q02](../../plugins/bradegithub--dsh-plugins-marketplace/INSIGHT.md#research-q02)multi-skill记录共享skillsDir而卸载递归删location，缺少逐Skill归属，可波及其他Skill；[Q03](../../plugins/bradegithub--dsh-plugins-marketplace/INSIGHT.md#research-q03)仅本机/LAN控制非用户认证，确认不隔离代码，断线不取消。该缺陷限制正式安装/卸载推荐，不以安全扫描或数量抵消。

> **建议**：[Q04](../../plugins/bradegithub--dsh-plugins-marketplace/INSIGHT.md#research-q04)逐文件/目录ownership与来源commit、hash/共享引用复核可能防旁删。可丢弃profile对照多包冲突/用户修改后卸载，旁删不降或误阻断过高则否定，未实现不计贡献。

[查看完整分析](../../plugins/bradegithub--dsh-plugins-marketplace/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1336081431-root"></a>

## [DSH Standard](../../plugins/t-auto--dsh-std/INSIGHT.md)

[![GitHub ★ 160](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=160&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-std)

> **用途**：维护跨宿主扩展的开发者可评估声明协商。

> **亮点**：[Q01](../../plugins/t-auto--dsh-std/INSIGHT.md#research-q01) 把版本和能力要求变成可检查报告。

> **思考**：[Q03](../../plugins/t-auto--dsh-std/INSIGHT.md#research-q03) 兼容报告基于声明，不能代替真实运行。

> **建议**：[Q05](../../plugins/t-auto--dsh-std/INSIGHT.md#research-q05) 比较结构化报告的排障收益。

[查看完整分析](../../plugins/t-auto--dsh-std/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335651249-root"></a>

## [DSH UI Usage Billing](../../plugins/kenz1117--dsh-ui-usage-billing/INSIGHT.md)

[![GitHub ★ 95](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=95&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenz1117/dsh-ui-usage-billing) [![npm 30d 14,283](https://img.shields.io/static/v1?label=npm+30d&message=14%2C283&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kenz1117/dsh-ui-usage-billing) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kenz1117/dsh-ui-usage-billing)

> **用途**：需要核对模型使用和规划任务的用户。

> **亮点**：[Q01](../../plugins/kenz1117--dsh-ui-usage-billing/INSIGHT.md#research-q01) 希望回顾模型使用和费用的用户可从持久会话聚合用量。aggregator 按 assistant source 归属，request header 作回退，并用计价目录估算。HTTP 回应有快照回退，避免长扫描阻塞请求。相比人工看日志和价格，统一口径便于对账。

> **思考**：[Q02](../../plugins/kenz1117--dsh-ui-usage-billing/INSIGHT.md#research-q02) 统计通常只读，但 task-queue POST 能显式入队，校验 workspace 和模型后创建 queued 项并调用 pump。Origin 检查只限回环主机，不限定相同端口，本地进程与回环代理需要另测；peer 和 Host 也受 guard 限制。未知或订阅模型 token 仍计而成本为零，不能解释成实际免费。

> **建议**：[Q04](../../plugins/kenz1117--dsh-ui-usage-billing/INSIGHT.md#research-q04) 对照当前生成新 id 的入队路径，试验客户端操作 ID 与服务端去重。模拟提交后断线和重新提交，比较任务及会话数量；若仍重复或阻止合法新任务则调整。

[查看完整分析](../../plugins/kenz1117--dsh-ui-usage-billing/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333447648-root"></a>

## [DSH WebUI Market](../../plugins/sanqi-normal--dsh-webui-market-plugin/INSIGHT.md)

[![GitHub ★ 103](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=103&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Sanqi-normal/dsh-webui-market-plugin) [![npm 30d 1,137](https://img.shields.io/static/v1?label=npm+30d&message=1%2C137&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sanqi-normal/dsh-webui-market-plugin) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sanqi-normal/dsh-webui-market-plugin)

> **用途**：用户希望从界面发现并安装插件。

> **亮点**：[Q01](../../plugins/sanqi-normal--dsh-webui-market-plugin/INSIGHT.md#research-q01) 将发现、进度及 profile 操作合并。

> **思考**：[Q03](../../plugins/sanqi-normal--dsh-webui-market-plugin/INSIGHT.md#research-q03) 试装执行代码且可能修改包管理规则。

> **建议**：[Q05](../../plugins/sanqi-normal--dsh-webui-market-plugin/INSIGHT.md#research-q05) 可减少命令切换并暴露部分安装故障。

[查看完整分析](../../plugins/sanqi-normal--dsh-webui-market-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1356951582-root"></a>

## [DSH XD Pool](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md)

[![GitHub ★ 392](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=392&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/XDTrees/dsh-xdpool) [![npm 30d 5,806](https://img.shields.io/static/v1?label=npm+30d&message=5%2C806&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xdpool) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xdpool)

> **用途**：[Q01](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q01) 面向多自有账号、希望减少手工换号的本地DSH用户，验收单位是同一任务的合格结果与可解释总调用。

> **亮点**：[Q01](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q01) 把多账号当统一选择面，连接可用性、模型级冷却、拒绝原因和宿主provider；同一请求标识覆盖物理尝试，减少把尝试数误当用户任务数。

> **思考**：[Q02](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q02) 集中JSON凭据、可选HTTP共享网关和积分远端动作扩大责任；[Q01](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q01) 流接受不代表完整任务，切号与摘要不保证净节省。

> **建议**：[Q03](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md#research-q03) 在已有turnId与面板上比较恢复账的解释增量，区分拒绝、部分流、摘要改变与费用来源；以错误重试和人工复核对照，无改善或隐私负担过大即否定。

[查看完整分析](../../plugins/xdtrees--dsh-xdpool/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333964468-root"></a>

## [DSH 订阅模型适配插件](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md)

[![GitHub ★ 541](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=541&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/V1ki/dsh-plugin-subscriptions) [![npm 30d 11,004](https://img.shields.io/static/v1?label=npm+30d&message=11%2C004&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-subscriptions) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-subscriptions)

> **用途**：面向已有适用订阅且希望在 DSH 会话中管理多账号的用户。

> **亮点**：[Q02](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md#research-q02) 接入多 provider 身份与账号管理，[Q03](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md#research-q03) 支持有限流式回退；并不创造模型或订阅权益。

> **思考**：[Q03](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md#research-q03) 首包前回退仍可能让多个账号处理输入，不能保证 exactly-once 或状态隔离。

> **建议**：[Q05](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md#research-q05) 提议展示潜在接收账号及脱敏尝试状态，须以用户理解和泄漏对照。

[查看完整分析](../../plugins/v1ki--dsh-plugin-subscriptions/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339101586-root"></a>

## [dsh-agy-link](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md)

[![GitHub ★ 148](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=148&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/amlyczz/dsh-agy-link) [![npm 30d 11,371](https://img.shields.io/static/v1?label=npm+30d&message=11%2C371&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agy-link) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agy-link)

> **用途**：已有 agy 授权并希望在 DSH 使用模型的开发者。

> **亮点**：[Q01](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q01) 将 CLI 模型纳入 DSH 并接入账号池。

> **思考**：[Q02](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q02) 机器凭据槽、主环境继承和外部服务都要核对。

> **建议**：[Q04](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md#research-q04) 将轮换原因可视化并验证对排障的影响。

[查看完整分析](../../plugins/amlyczz--dsh-agy-link/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1333918421-root"></a>

## [dsh-approval-gate](../../plugins/moon09300731--dsh-approval-gate/INSIGHT.md)

[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/moon09300731/dsh-approval-gate) [![npm 30d 3,936](https://img.shields.io/static/v1?label=npm+30d&message=3%2C936&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-approval-gate) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-approval-gate)

> **用途**：经常处理沙箱越界审批的用户希望减少重复确认。

> **亮点**：[Q01](../../plugins/moon09300731--dsh-approval-gate/INSIGHT.md#research-q01) 对专用预设加入规则和模型分流。

> **思考**：[Q02](../../plugins/moon09300731--dsh-approval-gate/INSIGHT.md#research-q02) SAFE 子串可放行 UNSAFE，且撤销仅投递指令。

> **建议**：[Q03](../../plugins/moon09300731--dsh-approval-gate/INSIGHT.md#research-q03) 比较严格协议和当前解析的误放行与等待。

[查看完整分析](../../plugins/moon09300731--dsh-approval-gate/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333722443-root"></a>

## [dsh-AuthInOne](../../plugins/stormycry-cryp--dsh-authinone/INSIGHT.md)

[![GitHub ★ 102](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=102&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Stormycry-cryp/dsh-AuthInOne)

> **用途**：用户管理多种模型账号与 API Provider，需要集中查看。

> **亮点**：[Q01](../../plugins/stormycry-cryp--dsh-authinone/INSIGHT.md#research-q01) 把账号状态与模型使用放进同一界面。

> **思考**：[Q02](../../plugins/stormycry-cryp--dsh-authinone/INSIGHT.md#research-q02) 精确 Host 依赖和提供商确认边界限制真实可用性。

> **建议**：[Q03](../../plugins/stormycry-cryp--dsh-authinone/INSIGHT.md#research-q03) 单 Provider 对照配置和核账工时。

[查看完整分析](../../plugins/stormycry-cryp--dsh-authinone/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333939283-root"></a>

## [dsh-auto-mode](../../plugins/nanmicoder--dsh-auto-mode/INSIGHT.md)

[![GitHub ★ 161](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=161&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NanmiCoder/dsh-auto-mode) [![npm 30d 1,588](https://img.shields.io/static/v1?label=npm+30d&message=1%2C588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-auto-mode) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-auto-mode)

> **用途**：需要减少日常工具审批并保留工作区边界的旧版 DSH 用户。

> **亮点**：[Q01](../../plugins/nanmicoder--dsh-auto-mode/INSIGHT.md#research-q01) 在原沙箱模式内将常规和语义审核分流。

> **思考**：[Q02](../../plugins/nanmicoder--dsh-auto-mode/INSIGHT.md#research-q02) 第三方工具与分类器有独立风险边界。[Q03](../../plugins/nanmicoder--dsh-auto-mode/INSIGHT.md#research-q03) 项目已经停维。

> **建议**：[Q04](../../plugins/nanmicoder--dsh-auto-mode/INSIGHT.md#research-q04) 检验未知工具的副作用声明能否减少误放。

[查看完整分析](../../plugins/nanmicoder--dsh-auto-mode/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334400504-root"></a>

## [dsh-builtin-browser](../../plugins/wqty123--dsh-browser/INSIGHT.md)

[![GitHub ★ 167](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=167&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wqty123/dsh-browser) [![npm 30d 30,360](https://img.shields.io/static/v1?label=npm+30d&message=30%2C360&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-builtin-browser) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-builtin-browser)

> **用途**：需让 DSH Agent 操作浏览器并由人随时接手的开发者。

> **亮点**：[Q01](../../plugins/wqty123--dsh-browser/INSIGHT.md#research-q01) 将浏览器动作纳入任务会话与宿主工具。

> **思考**：[Q02](../../plugins/wqty123--dsh-browser/INSIGHT.md#research-q02) 只读画面仍可含敏感数据，需验证身份和会话边界。

> **建议**：[Q04](../../plugins/wqty123--dsh-browser/INSIGHT.md#research-q04) 限定共享会话并验证是否减少误开。

[查看完整分析](../../plugins/wqty123--dsh-browser/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1333367960-root"></a>

## [dsh-codex](../../plugins/yan-zero--dsh-codex/INSIGHT.md)

[![GitHub ★ 96](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=96&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yan-Zero/dsh-codex) [![npm 30d 2,381](https://img.shields.io/static/v1?label=npm+30d&message=2%2C381&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex)

> **用途**：已有 DSH 工作流的用户希望接入账号许可的 Codex 路由。

> **亮点**：[Q01](../../plugins/yan-zero--dsh-codex/INSIGHT.md#research-q01) 把账号模型路由接到现有 DSH 会话。

> **思考**：[Q02](../../plugins/yan-zero--dsh-codex/INSIGHT.md#research-q02) 来源信任和刷新可靠性需按部署验证。

> **建议**：[Q03](../../plugins/yan-zero--dsh-codex/INSIGHT.md#research-q03) 同任务对照上下文、工具及恢复一致性。

[查看完整分析](../../plugins/yan-zero--dsh-codex/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391040578-root"></a>

## [dsh-compaction-route](../../plugins/643048695--dsh-compaction-route/INSIGHT.md)



> **用途**：需要处理 DSH 长历史压缩失败的开发者。

> **亮点**：[Q01](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q01) 将摘要路由与普通对话分开，提供终止错误后的备用。

> **思考**：[Q02](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q02) 仅指定错误结果重试，备用仍会收到历史。

> **建议**：[Q04](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q04) 关联配置目标与实际尝试以减少错误归因。

[查看完整分析](../../plugins/643048695--dsh-compaction-route/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1348357631-packages-dsh-daruma"></a>

## [dsh-daruma](../../plugins/sischoi--daruma--packages-dsh-daruma/INSIGHT.md)

[![GitHub ★ 116](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=116&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SISCHOI/daruma) [![npm 30d 1,307](https://img.shields.io/static/v1?label=npm+30d&message=1%2C307&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-daruma) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-daruma)

> **用途**：有多条可用模型通道并希望降低故障中断的 DSH 用户。

> **亮点**：[Q01](../../plugins/sischoi--daruma--packages-dsh-daruma/INSIGHT.md#research-q01) 将有预算的切换接入模型请求生命周期。

> **思考**：[Q02](../../plugins/sischoi--daruma--packages-dsh-daruma/INSIGHT.md#research-q02) 需核对成功推断和备用供应商输入。

> **建议**：[Q04](../../plugins/sischoi--daruma--packages-dsh-daruma/INSIGHT.md#research-q04) 真实请求完成事件可能改善归因。

[查看完整分析](../../plugins/sischoi--daruma--packages-dsh-daruma/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1384810806-root"></a>

## [dsh-device-bridge](../../plugins/173787247--dsh-device-bridge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-device-bridge)

> **用途**：用户希望从会话调用已部署的轻量设备服务。

> **亮点**：[Q01](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q01) 统一配置与工具入口，复用已有设备 Companion。

> **思考**：[Q02](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q02) 客户端允许动作不等于设备端授权，样例 token 可为空，真实动作须查服务实现。

> **建议**：[Q03](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q03) 以设备和动作绑定及操作 ID 做对账，测重复请求。

[查看完整分析](../../plugins/173787247--dsh-device-bridge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333689922-root"></a>

## [dsh-find-plugin](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md)

[![GitHub ★ 214](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=214&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/awesome-dsh-plugin/dsh-find-plugin) [![npm 30d 17,029](https://img.shields.io/static/v1?label=npm+30d&message=17%2C029&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-find-plugin) [![最新发布 2026-09-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-find-plugin)

> **用途**：不知道插件名的DSH用户可以按能力关键词在对话中找候选仓库和描述。

> **亮点**：[Q01](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md#research-q01)、[Q02](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md#research-q02) 把候选发现做成模型工具，结合可选凭据、缓存和明确标识的离线目录退路。核心搜索与描述继承外部来源，不把Star当采用判断。

> **思考**：[Q02](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md#research-q02) Star仅在先截取的有限GitHub候选内排序，缓存limit也会影响覆盖；返回的目录描述和安装字符串未经源码/兼容核查。工具没有执行安装，后续Agent不能把命令返回当授权。

> **建议**：[Q04](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md#research-q04) 在已有来源note上增加有限范围、时间与未核状态的候选交接说明，比较是否减少把目录收录误认安全认可；收益和阅读成本未验证。

[查看完整分析](../../plugins/awesome-dsh-plugin--dsh-find-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334692596-root"></a>

## [dsh-gitbash-preset](../../plugins/liceses--dsh-gitbash-preset/INSIGHT.md)

[![GitHub ★ 130](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=130&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liceses/dsh-gitbash-preset) [![npm 30d 400](https://img.shields.io/static/v1?label=npm+30d&message=400&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@icelily/dsh-gitbash-preset) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@icelily/dsh-gitbash-preset)

> **用途**：原生 Windows 的 DSH 极简用户想用 Bash 语法。

> **亮点**：[Q01](../../plugins/liceses--dsh-gitbash-preset/INSIGHT.md#research-q01) 复用极简文件工具并替换命令解释器。

> **思考**：[Q02](../../plugins/liceses--dsh-gitbash-preset/INSIGHT.md#research-q02) 受限沙箱会拒绝，且每次命令重启 shell。

> **建议**：[Q03](../../plugins/liceses--dsh-gitbash-preset/INSIGHT.md#research-q03) 比较新声明预设和官方模式的兼容率及审批负担。

[查看完整分析](../../plugins/liceses--dsh-gitbash-preset/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336647931-root"></a>

## [dsh-gov](../../plugins/863683348--dsh-gov/INSIGHT.md)

[![npm 30d 146](https://img.shields.io/static/v1?label=npm+30d&message=146&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-gov) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-gov)

> **用途**：维护者需要统一解释工具策略、观察事件和预算提示，强治理需额外权限边界。详见[Q01](../../plugins/863683348--dsh-gov/INSIGHT.md#research-q01)。

> **亮点**：把工具策略解释、JSONL事件与预算提示用纯模块和一个工具整合，减少分散hook接线。详见[Q01](../../plugins/863683348--dsh-gov/INSIGHT.md#research-q01)。

> **思考**：被治理模型也能改全局策略/预算，quota不硬停且启动/global键与计量delta未闭合，持久失败和坏配置可静默失去治理。详见[Q02](../../plugins/863683348--dsh-gov/INSIGHT.md#research-q02)。

> **建议**：管理员签发的版本化政策、明确usage delta/预算预留与关联审计收据，按自改政策/计量/坏盘反例检验，未验证。详见[Q05](../../plugins/863683348--dsh-gov/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/863683348--dsh-gov/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333913099-root"></a>

## [dsh-green-meter](../../plugins/dclichang2022--dsh-green-meter/INSIGHT.md)

[![GitHub ★ 92](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dclichang2022/dsh-green-meter)

> **用途**：本地或云模型用户希望观察资源趋势和系数。

> **亮点**：[Q01](../../plugins/dclichang2022--dsh-green-meter/INSIGHT.md#research-q01) 集中展示请求账本、采样与参考系数。

> **思考**：[Q02](../../plugins/dclichang2022--dsh-green-meter/INSIGHT.md#research-q02) 时间积分不是独占请求能量，云和省钱为模型估算。

> **建议**：[Q03](../../plugins/dclichang2022--dsh-green-meter/INSIGHT.md#research-q03) 对照电表和独立监控检验归属误差。

[查看完整分析](../../plugins/dclichang2022--dsh-green-meter/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333146829-root"></a>

## [dsh-launcher](../../plugins/ruler4396--dsh-launcher/INSIGHT.md)

[![GitHub ★ 196](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=196&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ruler4396/dsh-launcher)

> **用途**：它是Windows客户端，不是DSH插件：把Node/dsh服务与WebView2窗口装成双击入口，服务仍由DSH提供，模型能力、插件和对话功能不能归给启动器。参照是终端启动dsh web再用浏览器，以及作者公告的官方桌面替代。实际增量是运行时准备、服务生命周期和诊断，而不是更强的模型或完整离线运行。

> **亮点**：[Q01](../../plugins/ruler4396--dsh-launcher/INSIGHT.md#research-q01)把运行时准备、服务就绪与WebView入口合成Windows客户端；生命周期与诊断是本组件增量，DSH能力和配套插件不归根壳。

> **思考**：[Q02](../../plugins/ruler4396--dsh-launcher/INSIGHT.md#research-q02)身份门控仍以PID与探测时序为基础，真实竞争/恢复未验；[Q03](../../plugins/ruler4396--dsh-launcher/INSIGHT.md#research-q03)诊断脱敏并不清除所有凭据，且项目已停更。

> **建议**：[Q04](../../plugins/ruler4396--dsh-launcher/INSIGHT.md#research-q04)只读迁移清单可能帮助既有部署核数据与进程归属，尚未实现或验证，不计当前贡献。

[查看完整分析](../../plugins/ruler4396--dsh-launcher/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1366370702-root"></a>

## [dsh-llm-balance](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md)

[![npm 30d 847](https://img.shields.io/static/v1?label=npm+30d&message=847&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-llm-balance) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-llm-balance)

> **用途**：多LLM账号用户希望少切控制台并清楚余额/套餐剩余。详见[Q01](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md#research-q01)。

> **亮点**：将余额/配额语义分开并接入逐源缓存和常驻GUI，减少控制台切换。详见[Q01](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md#research-q01)。

> **思考**：同类route共用首账号和probe缓存；Kimi默认刷新写CLI token、读比较rename非原子CAS，HTTP handler未本地认证。详见[Q03](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md#research-q03)。

> **建议**：可研究账号/端点/revision缓存和显式续期能力，逐route归属与CLI统一版本写，比较错账号及恢复工时。当前未验证。详见[Q05](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333868738-root"></a>

## [dsh-llm-workbuddy](../../plugins/axiaohungry--dsh-llm-workbuddy/INSIGHT.md)

[![GitHub ★ 92](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Axiaohungry/dsh-llm-workbuddy) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@axiaohungry/dsh-llm-workbuddy)

> **用途**：已有 WorkBuddy 权限的 DSH 用户需要按会话分配账号。

> **亮点**：[Q01](../../plugins/axiaohungry--dsh-llm-workbuddy/INSIGHT.md#research-q01) 将账号模型带入 DSH 并支持会话选择。

> **思考**：[Q02](../../plugins/axiaohungry--dsh-llm-workbuddy/INSIGHT.md#research-q02) 刷新调用未传取消信号，会话上下文也不等于服务侧独立账本。

> **建议**：[Q03](../../plugins/axiaohungry--dsh-llm-workbuddy/INSIGHT.md#research-q03) 双账号对照错误归因与配置成本。

[查看完整分析](../../plugins/axiaohungry--dsh-llm-workbuddy/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340838178-root"></a>

## [dsh-mcp-connector](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md)

[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/duhu2000/dsh-mcp-connector) [![npm 30d 30,432](https://img.shields.io/static/v1?label=npm+30d&message=30%2C432&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-connector) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-connector)

> **用途**：用户有多个 MCP 服务，需定位可用工具与授权故障。

> **亮点**：[Q01](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md#research-q01) 提供带来源和范围的统一发现面板。

> **思考**：[Q02](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md#research-q02) guard/restrict 是必要 Host 能力，缓存与调用状态分开。

> **建议**：[Q03](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md#research-q03) 对照原生配置的接入和过期排障时间。

[查看完整分析](../../plugins/duhu2000--dsh-mcp-connector/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333768172-root"></a>

## [dsh-mcp-panel](../../plugins/perrylink--dsh-mcp-panel/INSIGHT.md)

[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-mcp-panel) [![npm 30d 9,163](https://img.shields.io/static/v1?label=npm+30d&message=9%2C163&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-panel) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-panel)

> **用途**：维护MCP配置的DSH用户需要图形化排障。

> **亮点**：[Q01](../../plugins/perrylink--dsh-mcp-panel/INSIGHT.md#research-q01) 把配置与可见试调用集中到控制台。

> **思考**：[Q02](../../plugins/perrylink--dsh-mcp-panel/INSIGHT.md#research-q02) 语义追加实际全文件写，无并发事务；确认路径分条件。

> **建议**：[Q03](../../plugins/perrylink--dsh-mcp-panel/INSIGHT.md#research-q03) 对照手改配置的错误和恢复工时。

[查看完整分析](../../plugins/perrylink--dsh-mcp-panel/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1337292910-root"></a>

## [dsh-network-settings](../../plugins/kanneiren--dsh-network-settings/INSIGHT.md)

[![GitHub ★ 98](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=98&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kanneiren/dsh-network-settings) [![npm 30d 1,526](https://img.shields.io/static/v1?label=npm+30d&message=1%2C526&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-network-settings) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-network-settings)

> **用途**：Windows、WSL 或 macOS 用户排查 DSH 连接失败。

> **亮点**：[Q01](../../plugins/kanneiren--dsh-network-settings/INSIGHT.md#research-q01) 将进程与系统路径放在同一报告。

> **思考**：[Q02](../../plugins/kanneiren--dsh-network-settings/INSIGHT.md#research-q02) 预览与 apply 无版本绑定，外部改写需验收。

> **建议**：[Q03](../../plugins/kanneiren--dsh-network-settings/INSIGHT.md#research-q03) 对照人工排障的定位时间与修复率。

[查看完整分析](../../plugins/kanneiren--dsh-network-settings/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1394197658-root"></a>

## [dsh-ollama-cloud](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Asheblog/dsh-ollama-cloud)

> **用途**：已有 Ollama Cloud 帐户且需要在 DSH 中选用多种云模型的开发者。

> **亮点**：[Q01](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q01) 把端点原生目录变成宿主可选模型，[Q02](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q02) 解释暂态保留和退役剔除的分工。[Q03](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q03) 的包级检查让宿主发布号变更有明确的静态判据。

> **思考**：[Q03](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q03) 逐包相同只能支持所覆盖契约。[Q04](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q04) 和 [Q01](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q01) 的发现接口均将可覆盖目标地址与宿主凭据回退组合，需要分别核对调用权限和目的地限制。

> **建议**：[Q05](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q05) 在选择模型时区分目录来源、详情状态与凭据配置，检验能否减少错误重试和配置改动。

[查看完整分析](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1371644959-root"></a>

## [dsh-opencode-go](../../plugins/duskriver--dsh-opencode-go/INSIGHT.md)

[![GitHub ★ 244](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=244&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Duskriver/dsh-opencode-go) [![npm 30d 6,010](https://img.shields.io/static/v1?label=npm+30d&message=6%2C010&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-opencode-go) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-opencode-go)

> **用途**：已有 OpenCode Go 帐户，在 DSH 中重复进行多轮开发任务且希望管理额度的开发者。

> **亮点**：[Q01](../../plugins/duskriver--dsh-opencode-go/INSIGHT.md#research-q01) 将两套模型来源放入独立路由，[Q02](../../plugins/duskriver--dsh-opencode-go/INSIGHT.md#research-q02) 将部分凭据和额度拒绝的重试从手工配置移到请求开始阶段。

> **思考**：[Q02](../../plugins/duskriver--dsh-opencode-go/INSIGHT.md#research-q02) 切换条件依赖已收到的块和用量，实际额度与可见输出不总是同步。[Q03](../../plugins/duskriver--dsh-opencode-go/INSIGHT.md#research-q03) 本地费用估算还受历史记录和当前价格覆盖限制。

> **建议**：[Q05](../../plugins/duskriver--dsh-opencode-go/INSIGHT.md#research-q05) 在换号提示上区分备选响应、完成及此前尝试费用未知，通过对照故障验证用户是否更能判断下一步。

[查看完整分析](../../plugins/duskriver--dsh-opencode-go/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A2chitect/dsh-openviking-enhance) [![npm 30d 1,656](https://img.shields.io/static/v1?label=npm+30d&message=1%2C656&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openviking-enhance) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openviking-enhance)

> **用途**：已运行 DSH 与 OpenViking 的维护者可在当前会话附近查看记忆归档与检索状态。

> **亮点**：[Q01](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md#research-q01) 与 [Q02](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md#research-q02) 将 Studio、归档状态和差异组织进 DSH 界面；增量在诊断集成，未证明改变底层检索能力或节时。

> **思考**：[Q03](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md#research-q03) 是当前重检索而非历史输入；[Q04](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md#research-q04) 的本地来源限制不核验独立用户和会话授权，不能将其当作多用户权限边界。

> **建议**：[Q06](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md#research-q06) 提出把真实注入收据与当前搜索并列的未验证方案；须先比较宿主日志并评估敏感信息保留。

[查看完整分析](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333515275-root"></a>

## [dsh-permission-rules](../../plugins/perrylink--dsh-permission-rules/INSIGHT.md)

[![GitHub ★ 134](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=134&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-permission-rules) [![npm 30d 6,247](https://img.shields.io/static/v1?label=npm+30d&message=6%2C247&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permission-rules) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permission-rules)

> **用途**：团队重复审批同类工具调用，需要可审阅的项目规则。

> **亮点**：[Q01](../../plugins/perrylink--dsh-permission-rules/INSIGHT.md#research-q01) 将高频审批条件编码为有序规则。

> **思考**：[Q02](../../plugins/perrylink--dsh-permission-rules/INSIGHT.md#research-q02) 代理覆盖依赖流量路径，审计依赖宿主事件能力。

> **建议**：[Q03](../../plugins/perrylink--dsh-permission-rules/INSIGHT.md#research-q03) 用同一批历史请求比较规则预演和人工审批。

[查看完整分析](../../plugins/perrylink--dsh-permission-rules/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335349535-root"></a>

## [dsh-permissions](../../plugins/940842546--dsh-permissions/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/940842546/dsh-permissions) [![npm 30d 588](https://img.shields.io/static/v1?label=npm+30d&message=588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permissions) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permissions)

> **用途**：团队希望在 DSH 沙箱之外增加按工具参数和路径的可审计细粒度门禁，例如永久保护 .ssh/.env；基线是宿主全局审批姿态或每次人工确认。合格结果是 hard 永不可绕过、deny/ask/allow 优先级确定、workspace 隔离正确，规则编辑未保存前不改变执行。 详见[Q01](../../plugins/940842546--dsh-permissions/INSIGHT.md#research-q01)。

> **亮点**：相对宿主粗粒度审批，它加入不可豁免 hard 层、workspace/global 作用域和参数模式，并让草稿保存成为明确生效点。价值在额外收窄而非提升权限；它不替代 DSH sandbox/tools.guard，也不证明路径字符串与真实文件解析完全等价。 详见[Q03](../../plugins/940842546--dsh-permissions/INSIGHT.md#research-q03)。

> **思考**：核心质疑是字符串匹配能否覆盖别名、转义、相对路径、shell 拼接和工具 schema 变化。规则漏匹配会给出虚假安全感，过宽 hard/deny 会阻断正常任务；自建同源设置路由若缺鉴权或写入竞争，会改变全局策略。默认规则也可能不适合非 Windows 路径。 详见[Q04](../../plugins/940842546--dsh-permissions/INSIGHT.md#research-q04)。

> **建议**：未验证假设是把匹配输入改为工具 schema 驱动的规范化资源对象，并在执行前显示最终 canonical path，可显著减少路径绕过与误拦。最小对抗集包含 100 个绝对/相对/符号链接/引号/大小写/PowerShell 嵌套用例，比较现规则和规范化规则的漏拦、误拦与审批次数；任何已知秘密路径漏拦即否定。 详见[Q08](../../plugins/940842546--dsh-permissions/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/940842546--dsh-permissions/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333974533-root"></a>

## [dsh-plugin-gating-hub](../../plugins/noob-stupid--dsh-plugin-gating-hub/INSIGHT.md)

[![GitHub ★ 120](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=120&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Noob-stupid/dsh-plugin-gating-hub) [![npm 30d 15,946](https://img.shields.io/static/v1?label=npm+30d&message=15%2C946&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@noob-stupid/dsh-plugin-console) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@noob-stupid/dsh-plugin-console)

> **用途**：维护多个插件的管理员担心框架升级造成服务失效。

> **亮点**：[Q01](../../plugins/noob-stupid--dsh-plugin-gating-hub/INSIGHT.md#research-q01) 将升级与恢复点纳入同一控制台。

> **思考**：[Q02](../../plugins/noob-stupid--dsh-plugin-gating-hub/INSIGHT.md#research-q02) 启动前失效时兼容路由无法接手，且自动禁用会改写配置。

> **建议**：[Q03](../../plugins/noob-stupid--dsh-plugin-gating-hub/INSIGHT.md#research-q03) 对照手工恢复，测回滚时间和文件完整度。

[查看完整分析](../../plugins/noob-stupid--dsh-plugin-gating-hub/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1338398749-root"></a>

## [dsh-plugin-mobile-gateway](../../plugins/clarklevis1995--dsh-plugin-mobile-gateway/INSIGHT.md)

[![GitHub ★ 140](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=140&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway) [![npm 30d 5,742](https://img.shields.io/static/v1?label=npm+30d&message=5%2C742&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-mobile-gateway) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-mobile-gateway)

> **用途**：需要从受控网络上的移动设备查看或操作 DSH 会话的开发者。

> **亮点**：[Q01](../../plugins/clarklevis1995--dsh-plugin-mobile-gateway/INSIGHT.md#research-q01) 将设备配对和宿主会话调用纳入移动端协议。

> **思考**：[Q02](../../plugins/clarklevis1995--dsh-plugin-mobile-gateway/INSIGHT.md#research-q02) 设备认证与宿主授权不同，真实网络边界未验。

> **建议**：[Q04](../../plugins/clarklevis1995--dsh-plugin-mobile-gateway/INSIGHT.md#research-q04) 用重连和撤销故障对照传输可靠性。

[查看完整分析](../../plugins/clarklevis1995--dsh-plugin-mobile-gateway/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1374274543-root"></a>

## [dsh-plugin-proxy](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md)

[![npm 30d 80](https://img.shields.io/static/v1?label=npm+30d&message=80&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy)

> **用途**：需要集中配置DSH模型/搜索等出站代理的维护者。详见[Q01](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md#research-q01)。

> **亮点**：统一现成代理能力与设置、白名单和连接退休，减少逐插件配置。详见[Q01](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md#research-q01)。

> **思考**：无效配置先撤旧代理再回baseline，恢复缺所有权比较，不能保证严格禁直连或跨插件恢复。详见[Q03](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md#research-q03)。

> **建议**：研究先构建再替换、失败关闭、dispatcher所有权和环境逐键恢复，比较误出口和恢复工时。当前未验证。详见[Q05](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333591877-root"></a>

## [DSH-Portable](../../plugins/wsl043--dsh-portable/INSIGHT.md)

[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WSL043/DSH-Portable)

> **用途**：希望同平台搬移会话与环境并控制更新的用户。

> **亮点**：[Q01](../../plugins/wsl043--dsh-portable/INSIGHT.md#research-q01) 把运行准备和数据维护集中到便携目录。

> **思考**：[Q02](../../plugins/wsl043--dsh-portable/INSIGHT.md#research-q02) 稳定线与1.x不同，health回滚及制品安全仍需验收。

> **建议**：[Q03](../../plugins/wsl043--dsh-portable/INSIGHT.md#research-q03) 同平台复制对照搬移和恢复成本。

[查看完整分析](../../plugins/wsl043--dsh-portable/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1346872712-root"></a>

## [dsh-sev](../../plugins/buzzso--dsh-sev/INSIGHT.md)

[![GitHub ★ 139](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=139&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Buzzso/dsh-sev) [![npm 30d 129](https://img.shields.io/static/v1?label=npm+30d&message=129&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sev) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sev)

> **用途**：已有自有服务器的开发者要将可分离任务交给远端 DSH。

> **亮点**：[Q01](../../plugins/buzzso--dsh-sev/INSIGHT.md#research-q01) 聚合远端会话、面板和提交入口，减少手工切换。

> **思考**：[Q02](../../plugins/buzzso--dsh-sev/INSIGHT.md#research-q02) 回环围栏、端口连通和远端 shell 都需独立核对，超时后状态未知。

> **建议**：[Q03](../../plugins/buzzso--dsh-sev/INSIGHT.md#research-q03) 以稳定请求标识和会话回读减少中断后的重复提交。

[查看完整分析](../../plugins/buzzso--dsh-sev/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333673564-root"></a>

## [dsh-skill-mcp-panel](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md)

[![GitHub ★ 241](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=241&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fishquito7/dsh-skill-mcp-panel) [![npm 30d 5,726](https://img.shields.io/static/v1?label=npm+30d&message=5%2C726&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-mcp-panel) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-mcp-panel)

> **用途**：管理多个工作区Skill和MCP服务器的DSH用户可在侧栏或CLI读写配置，合格结果须文件/作用域正确且宿主实际发现预期能力。

> **亮点**：[Q01](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q01)、[Q02](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q02)、[Q03](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q03) 把多作用域技能操作、精确MCP条目编辑与CLI组织在同一管理面，避免仅按同名误改其他工作区。管理便利不能推出配置即生效或服务业务成功。

> **思考**：[Q02](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q02) 删除撤销只回填SKILL.md，不能恢复脚本/资源；注册表异常时导入仍可能记added。[Q03](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q03) 测试连接会求值!!js并启动进程/网络，配置写入、loader协调与业务可用须分别确认。

> **建议**：[Q05](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md#research-q05) 未验证假设是把落盘/发现/协调分层，异常发现保留未知，并提供完整目录恢复依据；已有added/skipped及reconciled不能被忽略，对照误判与恢复投入无改善就不增加操作负担。

[查看完整分析](../../plugins/fishquito7--dsh-skill-mcp-panel/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334791300-root"></a>

## [dsh-studio](../../plugins/moresyl--dsh-studio/INSIGHT.md)

[![GitHub ★ 128](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=128&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Moresyl/dsh-studio)

> **用途**：本地 DSH 用户希望减少启动、排障和远程查看的操作。

> **亮点**：[Q01](../../plugins/moresyl--dsh-studio/INSIGHT.md#research-q01) 用监督与退避流程替代手工重启。

> **思考**：[Q02](../../plugins/moresyl--dsh-studio/INSIGHT.md#research-q02) 网关和配对仍需实测暴露面与撤销。

> **建议**：[Q03](../../plugins/moresyl--dsh-studio/INSIGHT.md#research-q03) 对照故障恢复时间和无谓重启。

[查看完整分析](../../plugins/moresyl--dsh-studio/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1421306160-root"></a>

## [dsh-subagent-role-router](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/643048695/dsh-subagent-role-router)

> **用途**：并行使用多个获授权模型供应商的 DSH 开发者。

> **亮点**：[Q01](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q01) 将故障切换接入宿主子代理循环。

> **思考**：[Q02](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q02) 随机次数和批量写入都不能当作完整覆盖或事务。

> **建议**：[Q04](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md#research-q04) 对照未试候选抽样能否提高恢复。

[查看完整分析](../../plugins/643048695--dsh-subagent-role-router/INSIGHT.md) · [返回表格](#category-index)

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



> **用途**：需要核对 DSH 多会话用量与日期归属的开发者。

> **亮点**：[Q01](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q01) 将同一步样本替换、摘要用量和会话汇总集中展示。

> **思考**：[Q02](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q02) 固定偏移与实际读取权限要单独验证。

> **建议**：[Q04](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q04) 标明投影口径和偏移，检查日期误判。

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

<a id="plugin-1335815757-root"></a>

## [dsh-usage](../../plugins/aisland-sjl--dsh-usage/INSIGHT.md)

[![GitHub ★ 143](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=143&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-usage)

> **用途**：需要并排核对本地会话用量和账号余额的 DSH 开发者。

> **亮点**：[Q01](../../plugins/aisland-sjl--dsh-usage/INSIGHT.md#research-q01) 将事件桶和账号状态并置，保留重试计量口径。

> **思考**：[Q02](../../plugins/aisland-sjl--dsh-usage/INSIGHT.md#research-q02) 部署代理及上游适配器影响真实边界。

> **建议**：[Q04](../../plugins/aisland-sjl--dsh-usage/INSIGHT.md#research-q04) 辅助解释来源覆盖与重试造成的数字变化。

[查看完整分析](../../plugins/aisland-sjl--dsh-usage/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334023305-root"></a>

## [dsh-usage-dashboard-plus](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus) [![npm 30d 1,036](https://img.shields.io/static/v1?label=npm+30d&message=1%2C036&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-usage-dashboard-plus) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-usage-dashboard-plus)

> **用途**：个人用户查看会话内外调用趋势、余额和缓存表现。详见[Q01](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md#research-q01)。

> **亮点**：把外部视觉用量和原会话统计接到余额/消费看板。详见[Q01](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md#research-q01)。

> **思考**：明文session.jsonl被仅zstd解码成空，cacheWrite侧栏按input而投影按output，未知价仍套默认金额。详见[Q03](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md#research-q03)。

> **建议**：研究统一版本化计量核、明确格式/覆盖/去重回执与账户cache，比较漏计/金额差。当前未验证。详见[Q05](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333685863-root"></a>

## [dsh-usage-stats](../../plugins/ychris12138--dsh-usage-stats/INSIGHT.md)

[![GitHub ★ 187](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=187&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ychris12138/dsh-usage-stats) [![npm 30d 7,061](https://img.shields.io/static/v1?label=npm+30d&message=7%2C061&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ychris12138/dsh-usage-stats) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ychris12138/dsh-usage-stats)

> **用途**：在 DSH 中使用多家模型供应商并需要排查用量变化的开发者。

> **亮点**：[Q01](../../plugins/ychris12138--dsh-usage-stats/INSIGHT.md#research-q01) 将可读会话用量与估算汇总在宿主，同时保留多次独立调用。

> **思考**：[Q01](../../plugins/ychris12138--dsh-usage-stats/INSIGHT.md#research-q01) 旧日志和计价覆盖决定估算范围。[Q02](../../plugins/ychris12138--dsh-usage-stats/INSIGHT.md#research-q02) 回环守卫与导出字段依赖实际部署和分享对象。

> **建议**：[Q04](../../plugins/ychris12138--dsh-usage-stats/INSIGHT.md#research-q04) 给留空金额与旧快照分别说明原因，检验是否减少对账误判。

[查看完整分析](../../plugins/ychris12138--dsh-usage-stats/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,625](https://img.shields.io/static/v1?label=npm+30d&message=1%2C625&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-lan-access)

> **用途**：需在隔离或可信网络的多个接口操作同一 DSH 主机的使用者。

> **亮点**：[Q01](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md#research-q01) 在多接口接入时一起处理监听、目标权威和客户端表面。

> **思考**：[Q02](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md#research-q02) 监听、HTTP 权威及身份认证须分别核对。

> **建议**：[Q04](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md#research-q04) 显示实际接口并按明确选择收窄可达范围。

[查看完整分析](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335060007-root"></a>

## [dsh-web-restart](../../plugins/1123762794--dsh-web-restart/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1123762794/dsh-web-restart)

> **用途**：作者 Windows Web profile 的维护操作；单击会中断 DSH 服务，脚本路径必须按机器改。详见[Q01](../../plugins/1123762794--dsh-web-restart/INSIGHT.md#research-q01)。

> **亮点**：将重启入口与在线状态点放进 DSH Web 侧栏；用户可从界面触发作者环境的维护动作。详见[Q01](../../plugins/1123762794--dsh-web-restart/INSIGHT.md#research-q01)。

> **思考**：已触发 UI 不代表重启成功，路由只有方法/重入检查；全权限外部脚本和单击中断需核外层授权。详见[Q03](../../plugins/1123762794--dsh-web-restart/INSIGHT.md#research-q03)与[Q04](../../plugins/1123762794--dsh-web-restart/INSIGHT.md#research-q04)。

> **建议**：未验证改进为受控脚本路径、管理员授权/确认、异步 job 回执和恢复验收；先在隔离环境实测。详见[Q05](../../plugins/1123762794--dsh-web-restart/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1123762794--dsh-web-restart/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334876923-root"></a>

## [dsh-win32](../../plugins/sjh9714--dsh-win32/INSIGHT.md)

[![GitHub ★ 156](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=156&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sjh9714/dsh-win32) [![npm 30d 5,009](https://img.shields.io/static/v1?label=npm+30d&message=5%2C009&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-win32) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-win32)

> **用途**：原生 Windows 用户排查 DSH 启动或旧预设冲突。

> **亮点**：[Q01](../../plugins/sjh9714--dsh-win32/INSIGHT.md#research-q01) 将发布检查、已装组件验证和旧 bundle 修复分到明确入口。

> **思考**：[Q02](../../plugins/sjh9714--dsh-win32/INSIGHT.md#research-q02) verify 验收组件链，不能证明真实 Desktop 会话；未知清理状态会保留临时快照。

> **建议**：[Q03](../../plugins/sjh9714--dsh-win32/INSIGHT.md#research-q03) 分层显示三类证据，比较安装排障的误判与时间。

[查看完整分析](../../plugins/sjh9714--dsh-win32/INSIGHT.md) · [返回表格](#category-index)

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

> **用途**：使用 Docker Compose 的开发者需要找出本机测试服务故障。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md#research-q01) 把服务列表和尾部日志接进会话，便于先定位异常服务。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md#research-q02) 启停参数确认不证明真人批准，工作目录检查也未绑定 daemon 和项目。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md#research-q03) 在变更前绑定实际 context、项目和配置，比较错目标率与排障开销。

[查看完整分析](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381859591-root"></a>

## [dsh-wsl-db](../../plugins/173787247--dsh-wsl-db/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-db)

> **用途**：维护者需要初步判断应用数据库和缓存是否可连通。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-db/INSIGHT.md#research-q01) 将连接探测和常用读取放到同一排障会话。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-db/INSIGHT.md#research-q02) 字符串规则不等于服务端只读，默认 Redis ping 也未走主机检查。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-db/INSIGHT.md#research-q03) 显式绑定目标、区分子状态，再对照误判与非授权读取。

[查看完整分析](../../plugins/173787247--dsh-wsl-db/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391141174-root"></a>

## [dsh-wsl-defender](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-defender)

> **用途**：维护者需要从会话核对 Windows 安全配置线索。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md#research-q01) 在 WSL 排障中聚合多个 Windows 安全状态探针。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md#research-q02) 多类错误退化为空，且排除路径等敏感字段可能进入会话。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md#research-q03) 分探针回报权限、失败和空数据，比较误判。

[查看完整分析](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854118-root"></a>

## [dsh-wsl-dns](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-dns)

> **用途**：WSL访问模型/GitHub/npm异常时需要比较两侧解析现象。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q01) 两侧查询/配置片段汇为模型工具减少手查，复用既有系统解析能力。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q02) 错误折叠为空、ok只看WSL，两侧不同非劫持证明；总预算/取消未贯通。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md#research-q04) 比较收据保留来源/时间/错误与统一deadline；误改配置不降或额外披露不值得即否定。

[查看完整分析](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md) · [返回表格](#category-index)

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

> **用途**：应用异常后需要快速定位 Windows 侧错误线索。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q01) 把近期错误采样接到当前 WSL 排障会话。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q02) 先限量再筛选，空样本不能排除真实事件。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q03) 前置筛选并显式区别权限失败，比较漏检。

[查看完整分析](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1362694736-root"></a>

## [dsh-wsl-fetch](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-fetch)

> **用途**：适合已有可用代理、但原 web_fetch 直连公开站点失败的 WSL 用户。

> **亮点**：保留原 web_fetch 工具调用，在宿主 provider 层将 GET 转给已配置代理，用户无需改用 shell 抓取。[Q01](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q01) [Q02](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q02)

> **思考**：私网过滤只检查 URL 字面值，代理如何解析与连接需要独立验证。已保留自定义 provider 时，提示文本也可能误报路线。[Q02](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q02) [Q03](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q03)

> **建议**：代理侧核查最终连接并给操作者提供明确选用与拒绝信息，对照公开网页通过率和私网访问结果。假设未验证。[Q04](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381843528-root"></a>

## [dsh-wsl-helm](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-helm)

> **用途**：维护 Kubernetes 发布的值班者需要核对 release 与 revision。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q01) 将发布枚举、状态与历史接进同一诊断会话。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q02) 允许列表不约束省略 context 的调用，输出也可能因截断而不全。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q03) 绑定并回显目标后，以同名 release 对照错集群率。

[查看完整分析](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381726881-root"></a>

## [dsh-wsl-k8s](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-k8s)

> **用途**：值班者在已有 kubeconfig 的机器上，需要从 Pod 状态和日志定位部署异常。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md#research-q01) 把常用查询整理为结构化 DSH 工具，并为日志设置尾行和输出边界。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md#research-q02) 允许列表只限制显式 context。默认探测和读取仍可能使用其他当前集群，工具入口也不能代替 RBAC。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md#research-q04) 在所有远端探测前绑定并回显实际 context，有机会减少跨集群误读，需以两个测试集群做请求对照。

[查看完整分析](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381832318-root"></a>

## [dsh-wsl-llamacpp](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-llamacpp)

> **用途**：已有兼容服务的 WSL 开发者想从当前会话发送一次短文本生成任务。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md#research-q01) 在 DSH 会话里调用已有服务的两个接口，减少请求准备与终端切换。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md#research-q02) 模型列表可达和 HTTP 成功都不足以证明有效推理。调用方要核对模型、返回文本和实际上下文。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md#research-q04) 在用户请求时增加指定模型的短探针，并对照误判率和额外负载。

[查看完整分析](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md) · [返回表格](#category-index)

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

> **用途**：在保留当前 DSH 主模型的同时，按需请求已安装的 Ollama 模型。

> **亮点**：让会话按需调用本地模型而无需切换主 provider；工具分别暴露探测、生成与向量结果。[Q01](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md#research-q01) [Q02](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md#research-q02)

> **思考**：WSL 默认地址是启发式，实际请求可走配置的非本地端点；主会话也仍可能使用云模型。[Q01](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md#research-q01) [Q03](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md#research-q03)

> **建议**：让操作者确认实际选路，并在多种 WSL 网络模式中对照错连率和首次响应。未验证。[Q04](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391142601-root"></a>

## [dsh-wsl-perf](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-perf)

> **用途**：WSL 任务变慢，需要检查 Windows 主机是否资源紧张。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md#research-q01) 在 WSL 排障会话中补上 Windows 主机资源视角。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md#research-q02) 进程按内存排序，缺失数字回退为零，不能据此断定 CPU 热点或无负载。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md#research-q03) 区分缺失与真实零值，比较部分失败的误判。

[查看完整分析](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391140034-root"></a>

## [dsh-wsl-power](../../plugins/173787247--dsh-wsl-power/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-power)

> **用途**：准备在 WSL 跑长任务，需要先核对主机电源状态。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-power/INSIGHT.md#research-q01) 将 Windows 电源线索放入 WSL 的当前工作会话。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-power/INSIGHT.md#research-q02) 文本解析依赖英文，休眠布尔结果及电池空值需要回查。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-power/INSIGHT.md#research-q03) 独立标记不支持和解析失败，比较跨语言误判。

[查看完整分析](../../plugins/173787247--dsh-wsl-power/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391142974-root"></a>

## [dsh-wsl-registry](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-registry)

> **用途**：需要检查 Windows 应用或系统配置的 WSL 用户。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md#research-q01) 把键值与子键查询接入当前排障会话。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md#research-q02) 允许前缀没有段边界或字面路径保证，值输出仍可能敏感。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md#research-q03) 验证标准化和字面路径能否减少越界。

[查看完整分析](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381733290-root"></a>

## [dsh-wsl-secret](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-secret)

> **用途**：已用 pass 或 age 保存应用凭据的 WSL 开发者，需要给支持环境变量的 DSH 工具提供单行密钥。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md#research-q01) 在 DSH 中串起条目查找与环境变量注入，减少手工复制密钥的步骤。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md#research-q02) age 路径前缀是词法检查，reveal 会把明文放入结果。[Q03](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md#research-q03) 环境变量跨工具共享且可覆盖，没有单次生命周期。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md#research-q04) 在获准目标的隔离子进程做单次注入，比较授权成功率、旁观读取率和启动耗时。

[查看完整分析](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391140376-root"></a>

## [dsh-wsl-service](../../plugins/173787247--dsh-wsl-service/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-service)

> **用途**：WSL 应用依赖 Windows 后台服务，需定位哪一项异常。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-service/INSIGHT.md#research-q01) 把 Windows 服务状态与依赖线索放进 WSL 排障会话。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-service/INSIGHT.md#research-q02) 列表与详情名称语义不同，读取依赖失败也可能显示为空。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-service/INSIGHT.md#research-q03) 逐项标注依赖读取状态及筛选条件，比较误判。

[查看完整分析](../../plugins/173787247--dsh-wsl-service/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854253-root"></a>

## [dsh-wsl-shot](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-shot)

> **用途**：用户已复制Windows图片，希望在WSL的DSH会话中引用。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md#research-q01) 封装剪贴板图片跨OS落盘并返回路径，减少搬移步骤。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md#research-q02) Public临时图失败可残留，时间戳/固定目标可撞或覆盖，取消不等落盘停止。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md#research-q04) 独占临时协议/不覆盖和清理状态可减少错图残留；若误回收或负担更高即否定。

[查看完整分析](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381843201-root"></a>

## [dsh-wsl-systemd](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-systemd)

> **用途**：用户服务异常时需要检查启动状态、PID 和近期日志。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md#research-q01) 聚合用户级服务状态和有限日志，支持排障初筛。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md#research-q02) userAvailable 是退出码推断，输出还可能截断，应用健康需独立核对。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md#research-q03) 区分总线、权限和日志问题，比较是否减少错误诊断。

[查看完整分析](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381843937-root"></a>

## [dsh-wsl-terraform](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-terraform)

> **用途**：基础设施工程师在审阅 IaC 变更前核对资源影响范围。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md#research-q01) 集中给出配置验证、计划计数及资源地址的初步线索。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md#research-q02) plan 继承环境和凭据，且异常退出可能被包装成成功。

> **建议**：[Q03](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md#research-q03) 区分详细退出码、截断和来源，比较失败误判率。

[查看完整分析](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381832640-root"></a>

## [dsh-wsl-vllm](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-vllm)

> **用途**：已有 vLLM 服务的操作者在当前 DSH 会话里提交一个短文本任务。

> **亮点**：[Q01](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md#research-q01) 给现有 vLLM 服务增加会话内工具入口，减少操作界面切换。

> **思考**：[Q02](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md#research-q02) 状态可达未覆盖生成路径，工具不传结束原因，空回复也可能成功。后端容量与超时需单独验收。

> **建议**：[Q04](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md#research-q04) 把结束原因、空回复和实际模型一并投影，以相同响应样本检查诊断和重试行为。

[查看完整分析](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 511](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=511&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WSK-build/DSHBox)

> **用途**：远离工作站但需要继续 DSH 会话的 Android 用户，可以把宿主进程和工作目录放在设备上。

> **亮点**：把 Android 渲染与 Debian DSH 启动接在同一客户端，并在特定文件系统拒绝时通过不覆盖复制适配异步硬链接调用。见 [Q01](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q01)、[Q02](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q02)。

> **思考**：本地运行与额外隔离、离线模型和真实恢复是独立条件。文件复制不保留共享 inode，开发者通道也有独立权限边界。见 [Q02](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q02)、[Q03](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q03)。

> **建议**：在远程宿主断开而模型仍可用的条件下，对照本机运行与远端 Web 的会话恢复和文件完整性。见 [Q04](../../plugins/wsk-build--dshbox/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/wsk-build--dshbox/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1158472225-root"></a>

## [EchoBird](../../plugins/edison7009--echobird/INSIGHT.md)

[![GitHub ★ 3,472](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C472&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/edison7009/EchoBird)

> **用途**：面向配置多个模型供应方、需要统一客户端入口和故障回退的桌面用户。

> **亮点**：[Q02](../../plugins/edison7009--echobird/INSIGHT.md#research-q02) 将模型候选、健康与本地协议入口组织起来；账号切换和模型路由不同，也不是按任务质量选模型。

> **思考**：[Q03](../../plugins/edison7009--echobird/INSIGHT.md#research-q03) Responses 续接绑定原供应方，配置变更或过期需完整输入；[Q04](../../plugins/edison7009--echobird/INSIGHT.md#research-q04) 切换可能产生不同数据流和费用。

> **建议**：[Q06](../../plugins/edison7009--echobird/INSIGHT.md#research-q06) 提出用脱敏固定题集在启用前比较候选输出和工具调用，需衡量误拒、费用和任务覆盖。

[查看完整分析](../../plugins/edison7009--echobird/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1268424426-adapters-dsh"></a>

## [Engramory DSH 适配目录](../../plugins/tinqiao-oss--engramory--adapters-dsh/INSIGHT.md)

[![GitHub ★ 198](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=198&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tinqiao-oss/engramory)

> **用途**：维护者在仓库中寻找DSH适配代码；目录只供导航，用户实际安装目标是子包dsh-engramory。

> **亮点**：[Q01](../../plugins/tinqiao-oss--engramory--adapters-dsh/INSIGHT.md#research-q01)本目录提供DSH适配实现的组织位置，没有独立可归因功能；实际发布、apply、client和patch均在plugin。不能把根协议或子包记忆能力重复算本项贡献。

> **思考**：[Q02](../../plugins/tinqiao-oss--engramory--adapters-dsh/INSIGHT.md#research-q02)根发现清单和递归源码容易让目录看似可安装插件，实际无自己的运行入口。采用需转真实子包，目录单独观察，不继承下游兼容或记忆效果。

> **建议**：[Q04](../../plugins/tinqiao-oss--engramory--adapters-dsh/INSIGHT.md#research-q04)明确分组标记与唯一安装导航可能减少误装／重复计数；陌生用户任务比较错误与查找时间，无改善则否定。未实施不计当前贡献。

[查看完整分析](../../plugins/tinqiao-oss--engramory--adapters-dsh/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1249040497-root"></a>

## [Local Shell MCP for DSH](../../plugins/fwerkor--local-shell-mcp/INSIGHT.md)

[![GitHub ★ 106](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=106&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fwerkor/local-shell-mcp) [![npm 30d 1,446](https://img.shields.io/static/v1?label=npm+30d&message=1%2C446&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/local-shell-mcp-dsh) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/local-shell-mcp-dsh)

> **用途**：维护多个 DSH 会话的操作者希望使用已部署的 LSM 执行环境并查看活动。

> **亮点**：[Q01](../../plugins/fwerkor--local-shell-mcp/INSIGHT.md#research-q01) 将执行连接和工作区按会话组织，减少从 DSH 找到运行记录的跳转。

> **思考**：[Q02](../../plugins/fwerkor--local-shell-mcp/INSIGHT.md#research-q02) 亲和头与格式检查不等于访问控制。凭据路由、共享 fallback 和首次并发需独立验证。

> **建议**：[Q03](../../plugins/fwerkor--local-shell-mcp/INSIGHT.md#research-q03) 对照通用 bridge 测重连找回与跨会话串线；没有改善则退出。

[查看完整分析](../../plugins/fwerkor--local-shell-mcp/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339704814-packages-dsh-plugin"></a>

## [Mebular DSH Plugin](../../plugins/windsander--mebular--packages-dsh-plugin/INSIGHT.md)

[![GitHub ★ 108](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=108&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Windsander/Mebular) [![npm 30d 1,921](https://img.shields.io/static/v1?label=npm+30d&message=1%2C921&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mebular/dsh-plugin) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mebular/dsh-plugin)

> **用途**：已有 Mebular 节点并希望在 DSH 使用同一记忆库的用户。

> **亮点**：[Q01](../../plugins/windsander--mebular--packages-dsh-plugin/INSIGHT.md#research-q01) 将两种入口和 daemon 发现接到宿主。

> **思考**：[Q02](../../plugins/windsander--mebular--packages-dsh-plugin/INSIGHT.md#research-q02) 区分共享数据、显式端点和子进程所有权。

> **建议**：[Q04](../../plugins/windsander--mebular--packages-dsh-plugin/INSIGHT.md#research-q04) 可验证身份可能减少误挂载。

[查看完整分析](../../plugins/windsander--mebular--packages-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1168322081-plugins-dsh-multivibe"></a>

## [MultiVibe Companion for DSH](../../plugins/thibautrey--multivibe--plugins-dsh-multivibe/INSIGHT.md)

[![GitHub ★ 61](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/thibautrey/multivibe)

> **用途**：已使用 MultiVibe 网关与 DSH 的操作者可在面板中发现模型并配置受管理的 provider。

> **亮点**：[Q01](../../plugins/thibautrey--multivibe--plugins-dsh-multivibe/INSIGHT.md#research-q01) 与 [Q02](../../plugins/thibautrey--multivibe--plugins-dsh-multivibe/INSIGHT.md#research-q02) 将模型发现、容量确认和宿主 provider 接线集中；推理由既有适配器承担，实际收益尚未测量。

> **思考**：[Q03](../../plugins/thibautrey--multivibe--plugins-dsh-multivibe/INSIGHT.md#research-q03) 的凭据与设置变更跨服务且补偿可能失败；[Q02](../../plugins/thibautrey--multivibe--plugins-dsh-multivibe/INSIGHT.md#research-q02) 的目录成功不证明模型请求、工具或费用正常。

> **建议**：[Q06](../../plugins/thibautrey--multivibe--plugins-dsh-multivibe/INSIGHT.md#research-q06) 提出主动测试后的能力收据，需验证其是否比手工记录更少误判且值得费用。

[查看完整分析](../../plugins/thibautrey--multivibe--plugins-dsh-multivibe/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1206555053-root"></a>

## [Open Managed Agents](../../plugins/openma-ai--open-managed-agents/INSIGHT.md)

[![GitHub ★ 343](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=343&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openma-ai/open-managed-agents)

> **用途**：需要自行管理 Agent 会话与隔离执行的开发团队。

> **亮点**：[Q01](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q01) 与 [Q02](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q02) 将执行生命周期和可插拔组件组成平台，并给会话授权加入当前 claim 检查。

> **思考**：[Q03](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q03) 租约和会话 fencing 不证明对外副作用恰好一次；部署隔离与恢复取决于组合。

> **建议**：[Q04](../../plugins/openma-ai--open-managed-agents/INSIGHT.md#research-q04) 建议将外部动作凭据与可对账回执绑定，验证重复和遗漏，尚未实现或运行。

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

<a id="plugin-1150374613-root"></a>

## [Sealos Skills](../../plugins/labring--sealos-skills/INSIGHT.md)

[![GitHub ★ 83](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=83&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/labring/sealos-skills)

> **用途**：该包为在 Sealos Cloud 部署或运维应用的 DSH 用户提供 use-sealos 技能。package.json 声明 bundle patch，index.js 注入 skills 服务并注册 provider；list 返回单个候选，get 按名称返回技能定义，资源基目录指向技能文件夹。随后实际部署由模型读取技能、调用其 Python 脚本和 kubectl 完成，而不是 provider 自动执行。相比用户手动查阅部署文档并拼接命令，增量是按平台资源模型、模板路径和失败诊断组织的一份可加载操作知识。Kubernetes、Template API、数据库控制器和模型决策能力不属于本包原创；没有用户任务实测来证明15分钟路径或成功率。

> **亮点**：[Q01](../../plugins/labring--sealos-skills/INSIGHT.md#research-q01) 将平台特定资源知识和部署验证路径接入DSH技能服务，属于知识编排与接口适配增量。

> **思考**：[Q02](../../plugins/labring--sealos-skills/INSIGHT.md#research-q02) 发布白名单没有包含托管分支引用的同级技能；脚本ready也不保证页面合格，必须限定本地路径并继续检查真实页面。

> **建议**：[Q04](../../plugins/labring--sealos-skills/INSIGHT.md#research-q04) 对发布资源闭包和页面语义建立联合验收契约，可能减少错误报完；尚未实现或验证。

[查看完整分析](../../plugins/labring--sealos-skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334096871-root"></a>

## [SeekTTY](../../plugins/hilbert-beinghappy--seektty/INSIGHT.md)

[![GitHub ★ 194](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=194&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Hilbert-beinghappy/seektty) [![npm 30d 1,248](https://img.shields.io/static/v1?label=npm+30d&message=1%2C248&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/seektty) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/seektty)

> **用途**：SeekTTY面向在终端项目目录内使用DSH的开发者，把Session、审批、设置和会话投影放在同一终端表面。基线是官方终端入口或Web界面配合终端切换；成功应是同一Host会话的状态和交互可被正确展示/响应，不是另造一套Agent。根包有deepseek命令和Cordis patch，是以Bundle安装的终端客户端，真实类别取client。

> **亮点**：[Q01](../../plugins/hilbert-beinghappy--seektty/INSIGHT.md#research-q01)终端surface与启动/生命周期桥复用Host状态，避免另立会话权威；可选Bundle不归其贡献。

> **思考**：[Q02](../../plugins/hilbert-beinghappy--seektty/INSIGHT.md#research-q02)同进程与有界退出不等权限隔离或任务取消，PTY恢复/跨版本契约仍需最低验收。

> **建议**：[Q04](../../plugins/hilbert-beinghappy--seektty/INSIGHT.md#research-q04)版本化关键交互清单可能约束表面与Host状态漂移，尚未实施和比较。

[查看完整分析](../../plugins/hilbert-beinghappy--seektty/INSIGHT.md) · [返回表格](#category-index)

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

[![GitHub ★ 379](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=379&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tingly-dev/tingly-box)

> **用途**：需要管理多个模型、客户端或团队入口的个人和管理员，集中配置规则与凭据。

> **亮点**：[Q01](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q01) 和 [Q02](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q02) 将协议入口、规则和服务选择集中；具体兼容与收益未测。

> **思考**：[Q03](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q03) 首块后不再重试且所有候选不健康时仍可能请求；[Q04](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q04) 两份 DSH 配置分别写入。

> **建议**：[Q06](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q06) 假设将规则版本和语义核对关联现有 trace 有助定位错路，需对照证伪。

[查看完整分析](../../plugins/tingly-dev--tingly-box/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1233571420-root"></a>

## [Token Bank](../../plugins/wink-run--tokenbank/INSIGHT.md)

[![GitHub ★ 111](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=111&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wink-run/tokenbank)

> **用途**：使用多个模型来源的开发者可以通过一个网关管理 DSH 接入与候选切换。

> **亮点**：把源级冷却与候选切换集中于独立网关，让上游拒绝可在链内处理。见 [Q01](../../plugins/wink-run--tokenbank/INSIGHT.md#research-q01)、[Q02](../../plugins/wink-run--tokenbank/INSIGHT.md#research-q02)。

> **思考**：接管会重写 YAML。解析异常退空和流式开始后难重试是实际边界。见 [Q02](../../plugins/wink-run--tokenbank/INSIGHT.md#research-q02)、[Q03](../../plugins/wink-run--tokenbank/INSIGHT.md#research-q03)。

> **建议**：将首字节前后故障分开，对照网关和直连的完成率、流语义和回退。见 [Q04](../../plugins/wink-run--tokenbank/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/wink-run--tokenbank/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1363739656-packages-enterprise-connection"></a>

## [WorkDSH 企业连接](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md)

[![GitHub ★ 302](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=302&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/techflag/workdsh)

> **用途**：管理员向已有 WorkDSH Desktop 的组织成员分发一个企业归档，成员通过个人空间安装后从设置连接企业账号。

> **亮点**：[Q01](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md#research-q01) 把两个固定依赖和身份客户端装入单个管理员交付物，保留可比对的工件清单。账号认证和协作业务分别由依赖及 Desktop 与后台完成。

> **思考**：[Q02](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md#research-q02) 固定版本下的精确 peer 和 Desktop 导出要求可能在部署中阻止企业激活；安装不能当成授权，也不能据此宣称企业数据和个人数据已实证隔离。

> **建议**：[Q03](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md#research-q03) 可试验在企业接入流程独立显示归档核验、成员核验和退出撤销状态。若误判和二次核对均未减少，放弃扩展；目前只有源码推导。

[查看完整分析](../../plugins/techflag--workdsh--packages-enterprise-connection/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-403559729-root"></a>

## [Yao Agents](../../plugins/yaoapp--yao/INSIGHT.md)

[![GitHub ★ 8,190](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8%2C190&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YaoApp/yao)

> **用途**：Yao根项目是自托管Agent应用/运行平台，不是安装进DSH的一层插件。适合已有多台工作机器、需要把对话任务与各节点工作区统一管理的开发或运营负责人。合格结果是指定任务在预期节点处理正确工作区并产出可核查文件或业务结果；任务板显示completed不等于内容合格。简单办法是分别登录机器运行DSH/CLI并用人工任务板记录，单机用户可能无需承担平台部署。README的“越用越好”仅是作者主张，本轮未发现结果提升实验。

> **亮点**：[Q03](../../plugins/yaoapp--yao/INSIGHT.md#research-q03)识别出工作区归属、节点能力与任务队列的控制平面整合，DSH以独立runner接入。相对逐机CLI加人工任务板，增量是持续保留任务/节点身份并统一配置接线；只有跨设备任务足够频繁时才可能覆盖部署负担，不将DSH或容器能力据为原创。

> **思考**：[Q04](../../plugins/yaoapp--yao/INSIGHT.md#research-q04)指出workspace组织隔离不等于所有模式的OS沙箱，completed/maxTokensAsSuccess不证明交付合格，准备材料写入失败还可能只warn继续。正常完成Cleanup有意保留子进程，离线节点回退又带来数据落位未知；这些核心生命周期边界尚未形成可验证的恢复与退出契约，应先观察而非以只读小任务掩盖整个平台的采用负担。

> **建议**：[Q08](../../plugins/yaoapp--yao/INSIGHT.md#research-q08)提出未验证的节点/workspace、预期产物与独立验收三联收据，分离运行结束和业务办结；用掉线、token终止及产物缺失对照误办结率和人工成本，若身份无法可信绑定或负担抵消收益则否定。

[查看完整分析](../../plugins/yaoapp--yao/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1416699252-root"></a>

## [ybkkasi](../../plugins/01men--ybkkasi/INSIGHT.md)

[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01men/ybkkasi)

> **用途**：运营者需要把可执行任务、所属组织和使用量联系起来。

> **亮点**：[Q01](../../plugins/01men--ybkkasi/INSIGHT.md#research-q01) 把组织治理与 Agent 任务入口接到同一控制面。

> **思考**：[Q02](../../plugins/01men--ybkkasi/INSIGHT.md#research-q02) 权限点、组织范围、任务锁和审计各有边界，不能用部分路径推断全域隔离。

> **建议**：[Q03](../../plugins/01men--ybkkasi/INSIGHT.md#research-q03) 将稳定操作 ID 绑定组织并回读运行状态，测试重复唤醒。

[查看完整分析](../../plugins/01men--ybkkasi/INSIGHT.md) · [返回表格](#category-index)

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-11-05
