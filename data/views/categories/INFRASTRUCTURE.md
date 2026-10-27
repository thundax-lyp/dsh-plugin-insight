# 基础设施

[全部分类](INDEX.md) · [返回首页](../../../README.md)

模型接入、认证、运行环境与系统支撑。

<a id="category-index"></a>

**同类比较**

> 比较表与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@sueleven/dsh-auto-update](#plugin-1428034710-root) | 启动时检查已下载并启用的npm插件，展示新版并在确认后调用DSH官方通道更新。 | 先观察作更新候选，核Windows环境与路由、备份后才隔离验批量；不在生产profile依旧提示直接全更。 |
| [Awesome DSH Plugin](#plugin-1333175049-root) | 维护 DSH 社区插件目录，并生成多语言网站和宿主可读取的市场索引。 | 适合已有 DSH 环境、希望有组织地筛选扩展的用户试用索引；先确认候选包身份与目标插件自己的条件，再在不含敏感凭据的环境验收加载、核心功能和禁用。 |
| [chicheng-gate](#plugin-1334862230-root) | 以密码门禁、反向代理和 frpc 隧道把 DSH 暴露到远端。 | 当前不建议采用；不要在持有代码、凭据或生产访问权的 DSH 上暴露，优先使用 VPN/SSH 并等待独立安全审计。 |
| [DeepSeek Harness](#plugin-1333065091-root) | 基于Cordis插件组合的开源Agent运行宿主，提供会话、工具与多应用入口。 | 有Agent扩展需求的开发者可在隔离profile以同模型小任务试用，先验收权限、取消及重启，不以架构或semver替代实际功能验收。 |
| [DeepSeek Harness Tauri Desktop](#plugin-1333718792-root) | 提供DSH桌面界面、托管运行时和内核、插件与档案管理、数据迁移及移动远程访问。 | [Q04](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q04)、[Q05](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q05)建议有备份的独立profile用户先固定推荐内核，以非关键会话试托管启动与回退。 |
| [DSH Desktop](#plugin-1333321333-root) | 独立社区Windows/macOS桌面客户端，将固定DeepSeek Harness运行时与窗口、配置及更新组合。 | 先在新用户数据目录/可恢复profile试用社区包，核channel/runtime及访问开关，验证启动/切换/禁用恢复后再接主数据。 |
| [DSH Market](#plugin-1333807290-root) | 在DSH内浏览社区插件，管理安装、更新、分组、备份与诊断。 | 维护多个社区插件的DSH用户可先在克隆profile中试用安装和备份流程。 |
| [DSH Plugin Radar](#plugin-1323404274-root) | 收集DSH插件候选、归并兼容性记录，提供分类目录、静态JSON和可浏览站点。 | [Q05](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q05)建议目录维护者先作为只读发现数据试用，固定完整提交读取并校验，缓存失败保留旧版本日期。 |
| [DSH RotaKit](#plugin-1387227102-root) | 把本机 WorkBuddy/CodeBuddy 账号组成模型池，提供 Chat、Responses、Messages 本地代理与积分状态。 | 建议观察，本人账号与明确上游条件下隔离验证实际客户端闭环和积分成本；不以返回码或余额面板单独判断可用。 |
| [dsh-almost-full-access](#plugin-1336031182-root) | 为 DSH 增加近全权限预设，以命令规则、子代理和用户审批门控部分 shell 执行。 | 重要环境不推荐；仅隔离虚拟机作安全研究原型，修补强制边界并经独立验证后重评。 |
| [dsh-anatomy-panel](#plugin-1366089972-workspace-plugins-dsh-anatomy-panel) | 从 Agent-Body 运行时文件实时展示器官体征、心跳和脉冲的宿主网页。 | 限隔离本机开发 Host 观察，不能作为独立健康判据；共享可达环境应先核认证、渲染和来源状态。 |
| [dsh-anet](#plugin-1302597978-deploy-plugins-dist-dsh) | 通过本地anet节点把DSH接入AgentNetwork，提供MCP及委派、状态与设置Skill入口。 | 建议观察，先关闭自动安装并固定审阅节点与策略，再由操作者确定受控试用范围；具体缺口和决策见 [Q05](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q05)。 |
| [dsh-api-dashboard](#plugin-1346196699-root) | 在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。 | 可信单用户本地试用，限定Key接收方和刷新，未知模型先缺价核查，估算与官方账单分开，更新优先宿主管理器。 |
| [dsh-armory](#plugin-1413052822-root) | 整合DSH的MCP、Skill、专家和插件管理，提供市场入口、安装来源与工具使用账本。 | 建议隔离profile先验证非关键组件的安装、更新、卸载和重启，保留配置及技能备份；不按零调用直接禁用应急能力。 |
| [dsh-cap-profile](#plugin-1349267122-root) | 扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。 | 先确认面板显示真实数据，再选数份脱敏会话核对调用、模型和错误归属；用它缩小排查范围。 |
| [dsh-clean-desktop-shell-pro](#plugin-1389469406-root) | 将 DSH web profile 包装为 Electron 桌面壳，并增加后端自动启动、托盘退出选择与运行时准备。 | 隔离桌面 profile 分别验本地/远程、离线下载、托盘退出与升级后再替换原版。 |
| [dsh-compaction-route](#plugin-1391040578-root) | 仅对DSH压缩摘要调用选择主模型，并在终止error时用备援路线重试相同历史。 | 明确主备provider/原历史恢复的维护者可限范围试用，先核失败分类、全部成本和摘要保真。 |
| [dsh-device-bridge](#plugin-1384810806-root) | DSH 工具将 Companion v1 健康检查和动作调用转给手机/IoT/薄 Agent。 | 仅隔离网络、低风险动作且设备端认证明确时观察；危险动作须先审共享库及设备实现。 |
| [dsh-gov](#plugin-1336647931-root) | 为DSH提供规则式工具allow/deny/ask、JSONL审计查询与按Agent累计token的预算警告。 | 观察，只作可信单用户辅助诊断继续探讨，强权限/预算/审计在宿主受权面另保证。 |
| [dsh-llm-balance](#plugin-1366370702-root) | 在DSH常驻卡片显示DeepSeek/Moonshot余额与Kimi/OpenCode订阅窗口，按源缓存并保留失败旧值。 | 先观察；可信个人单账号route对照，限定sources并明确OAuth写回，默认先禁token持久化。 |
| [dsh-mcp-tunnel](#plugin-1344713826-root) | 将本地 HTTP MCP 端点经 Docker/Cloudflare Quick Tunnel 暴露，并生成待确认的 DSH MCP Client 配置。 | 仅可在无敏感数据的隔离测试环境验证。 |
| [dsh-model](#plugin-1410395082-root) | 整合模型来源、统一API中转、组合切换和每日签到，并提供DSH管理界面与命令行。 | 先在非关键任务核对单来源工具/图像兼容，再加入能力相近的combo；检查流中断和卸载残余后限定试用。 |
| [dsh-model-auto-enricher](#plugin-1425159954-root) | 按模型名称规则批量补齐 DSH 上下文、输出、图片与推理配置并默认自动写盘。 | 默认不推荐自动模式。 |
| [dsh-model-channel-manager](#plugin-1358316691-root) | 管理 DSH 模型渠道和轮询组，提供故障转移、模型测试、测速及健康统计界面。 | 在固定RC和受控额度下先用等价候选试用，验收首内容前切换、内容后失败只终止一次、用户取消及重启不重放测试。 |
| [dsh-model-info-fill](#plugin-1358816037-root) | 从models.dev按模型名补自定义供应商缺失容量、图片和思考声明，展示冲突、未匹配与旧猜档待确认。 | 先观察；个人有备份profile关自动补，目录同步完成后逐项手动审阅再补，实际供应商优先。 |
| [dsh-model-manager](#plugin-1349266980-root) | 在 DSH 管理本地推理服务、参数 Profile、GPU 检测和性能测试。 | 先在隔离端口登记已有服务、保存参数并核对测速口径。 |
| [dsh-ollama-cloud](#plugin-1394197658-root) | 接入 Ollama 云端或本地模型，动态发现模型与推理档位，并显示云端用量。 | 适合已有Ollama凭据且可锁宿主版本的用户，以短文本和一个可丢弃工具任务试接入。 |
| [dsh-opencode-zen-plugin](#plugin-1402771540-root) | 把 OpenCode Console 对话模型接入 DSH 的四协议 LLM adapter，附设置卡与模型目录刷新。 | 先隔离试用单个获授权模型，再做四协议/工具/图片/错误矩阵；保护本地诊断文件。 |
| [dsh-openviking-enhance](#plugin-1401255267-root) | 把 OpenViking Studio、会话记忆提交状态与当前召回详情接入 DSH 界面。 | 在可信个人单机和非敏感会话受控试用，先把一份归档差异与直接API核对；身份或连接不符立即退回直接查询。 |
| [dsh-permissions](#plugin-1335349535-root) | 在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。 | 有明确威胁模型、能维护规则和保留宿主沙箱的团队可在非生产 profile 试用；先用只读/模拟工具跑对抗集，再启用 hard 保护真实路径。 |
| [dsh-plugin-loopback-trust](#plugin-1394489199-root) | 在反代域名网页上将连接标为 host-owning，以恢复 DSH 设置的 Host 持久化。 | 仅受控反代部署且双层授权明确时试用；先查官方 trusted-host，验未授权浏览器被拒。 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。 | 能备份profile并理解guard重启的维护者可在可丢弃环境小范围试用，先只读发现再评估已审查候选；报告/脚本不清或快照提前消失就停止后续安装。 |
| [dsh-plugin-manager](#plugin-1331636953-packages-dsh-plugin-manager) | 在 DSH 官方插件页检查更新与宿主兼容，并通过官方通道或本机网关管理插件生命周期。 | 插件数量较多且愿意在每次重启后检查核心功能的本机用户，可在独立 profile 试用一项非关键扩展更新。 |
| [dsh-plugin-manager](#plugin-1334267268-root) | 在 DSH 设置中展示插件中文用途与备注，并提供启停、目录覆盖及配置备份导入导出。 | 建议观察，在副本先核对owner权限、全局影响和锁占用/中断恢复，确认后再定义小范围试用；关键配置保留独立备份。 |
| [dsh-plugin-proxy](#plugin-1374274543-root) | 为DSH提供直连、系统及HTTP/SOCKS手工代理设置，切换Undici全局路由并可导出子进程环境。 | 可信单一管理者且允许失败回原出口可试用。 |
| [dsh-reasoning-tiers](#plugin-1367305514-root) | 按模型知识规则补齐pi-ai推理档位声明，并提供模型上下文、输出与图片能力编辑页。 | 先观察，关闭自动写并备份，先修最终写集/撤销失败保留，再评估单profile单模型。 |
| [dsh-recipe](#plugin-1336583700-root) | 把本地场景配方展开成去重插件清单和安装命令，支持关键词搜索与多配方组合。 | 作为选型草案试用，补齐profile/版本/配置再执行。 |
| [dsh-remote-ssh](#plugin-1384810201-root) | 以 SSH 将远程 Unix/AIX/macOS 的白名单诊断命令接入 DSH Agent 工具。 | 用最小权限只读账号与固定命令，测试远端参数解释；变更另走人工审批。 |
| [dsh-router-loomy](#plugin-1376777535-root) | 将 Loomy 云端 Chat Completions 通道接入 dsh-router，自动读本机客户端登录态。 | 隔离 profile/模拟上游完成协议和脱敏验证，再以授权账户小流量试用。 |
| [dsh-sakurafrp](#plugin-1365163902-root) | 在 DSH 中管理现有移动网关，提供链路状态、开关、配对二维码、设备撤销与自愈入口。 | 先观察，并在隔离链路验证关闭后跨重启仍关闭、标记不可写有明确失败、非3080端口不操作别的实例。 |
| [dsh-ssh](#plugin-1331636953-packages-dsh-ssh) | 在 DSH 中管理 SSH 主机，提供远端命令、Web 终端、文件传输、隧道和集群工具。 | 熟悉SSH权限与远端状态核对的用户，可在无重要凭据的测试主机先试只读命令和小文件传输。 |
| [dsh-sysmon](#plugin-1334434271-root) | DSH Web 悬浮显示宿主 CPU、内存与根文件系统使用率。 | Linux 单宿主仅作辅助观察；正式容量/告警仍用现有监控，试点时注入采样失败并确认 stale 状态。 |
| [dsh-telemetry-redactor](#plugin-1333368566-root) | 在DSH遥测记录导出副本中替换受支持的敏感键和凭据模式，保留原始会话日志。 | 已有遥测需求且可审计监听器顺序的维护者可小范围试用，先用合成凭据核对后端副本、canonical与拒绝记录；不能借此主动扩大共享，遇绕过或无法发现的误删就停止依赖。 |
| [dsh-token-bi](#plugin-1428375235-root) | 汇总 DSH 本机会话 token，用日期、模型、工作目录、调用树和逐轮明细查看用量。 | 先选含搜索、标题与重试的脱敏会话，逐桶核对官方投影，再测试冷日志追加后的刷新。 |
| [dsh-token-stat](#plugin-1348535666-root) | 读取DSH会话日志累计token用量，按模型和日期展示，并保留报告及归档账本。 | 建议需长期用量趋势的维护者受控试用并核对多入口一致性；暂不用于财务结算或精确账单。 |
| [dsh-tool-budget](#plugin-1350325873-root) | 按Agent累计工具调用次数，在超过配置阈值后返回阻断说明，并支持工具名称过滤。 | 先观察。 |
| [dsh-tool-explorer](#plugin-1351594249-root) | 在DSH Web集中浏览、编辑、安装与切换技能，管理和探测MCP服务器。 | 观察，先备份技能/lock/patch，受信本机可继续核展示与独立开关，避免唯一bundle直接改名升级。 |
| [dsh-tts-flash](#plugin-1363291561-root) | DSH 桌面端流式回复语音朗读与等待短语播放插件，支持 Edge 和云端 TTS。 | 先在隔离桌面试听 Edge，再用受控云密钥验证长回复、中断、权限与费用。 |
| [dsh-ui-auth](#plugin-1343420855-root) | 为 DSH Web 提供账户登录、用户管理、TOTP/Passkey、会话授权及按用户模型配置。 | 建议观察，先固定目标宿主完成可达面和状态恢复核查；互不信任用户还需独立系统权限边界，不能把登录页当隔离验收。 |
| [dsh-usage-dashboard-plus](#plugin-1334023305-root) | 在DSH侧栏显示DeepSeek余额和日志估算消费，并汇总外部视觉调用与每会话模型/延迟统计。 | 先观察，可信单用户只作趋势对照。 |
| [dsh-vps](#plugin-1377159975-root) | 为自有 VPS 部署带登录网关、HTTPS 和服务管理的 DSH。 | 先在隔离 VPS 钉所有文件来源、演练令牌缺失/备份失败/回滚，并对照原生隧道或手工部署；正式公网持续采用需独立安全及恢复验收。 |
| [dsh-web 根工程](#plugin-1331636953-root) | 维护 dsh-web 家族的多包工程，并通过根 bundle 入口转接聚合插件安装。 | 普通使用先选明确身份的聚合/单包，根保留为源码贡献和来源研究入口。 |
| [dsh-web-all](#plugin-1331636953-packages-dsh-web-all) | 聚合安装 dsh-web 家族功能插件，并提供可选的界面兼容与响应式补丁层。 | 临时profile只启明确需要的模块，记录实际依赖和退出结果；无多模块需求优先独立包。 |
| [dsh-web-lan-access](#plugin-1334255288-root) | 通过替换 WebServer 让 DSH Web 监听所有接口、自动信任接口 IP 并给远程浏览器 Host 能力。 | 默认不推荐。 |
| [dsh-web-restart](#plugin-1335060007-root) | Windows DSH Web 的侧栏重启按钮，调用硬编码 PowerShell 外部脚本。 | 暂不直接采用；只在隔离 Windows 复核脚本、授权和失败状态后考虑。 |
| [dsh-workspace-tools](#plugin-1363511446-root) | 按已注册工作区为新根会话自动选择 Agent 与权限预设的设置页和事件监听器。 | 先在低权限工作区限定试用；全权限规则和大小写敏感环境先验证匹配及首 turn 顺序。 |
| [dsh-wsl-clock](#plugin-1351854066-root) | 提供 clock_doctor 工具，诊断 WSL 与 Windows UTC 时间偏移。 | 只在 WSL/Windows 开发环境试用，交叉对照时间与 TLS/JWT 现象，不自动执行重启。 |
| [dsh-wsl-compose](#plugin-1381842592-root) | 为 DSH 提供 Docker Compose 状态、容器列表、日志与可选 up/down 的本机运维工具。 | 默认只读并限制项目根；变更前后用宿主人工审批和 ps 对账，超时不盲重试。 |
| [dsh-wsl-db](#plugin-1381859591-root) | 经 psql/redis-cli 为 DSH Agent 提供 PostgreSQL 与 Redis 连通性和查询工具。 | 仅隔离测试库、最小权限账号试用；生产库不直接采用。 |
| [dsh-wsl-defender](#plugin-1391141174-root) | 从 WSL 查询 Windows Defender、防篡改、Firewall 与近期威胁状态。 | 仅适合 WSL 内做初步、只读环境诊断的技术用户观察，不能替代安全产品、合规审计或自动修复。 |
| [dsh-wsl-docker](#plugin-1351854301-root) | 在WSL查询Docker CLI/context/daemon、推理相关容器与GPU线索，并探固定8000端口的models状态。 | 先观察，修404/GPU/端口/吞错误谓词和分层收据后再评估受控试用。 |
| [dsh-wsl-env](#plugin-1338530482-root) | 检测WSL并给系统提示补发行版、路径映射和跨Windows操作指导，减少环境背景重复说明。 | 标准WSL用户核提示后试用，特殊挂载明确纠正。 |
| [dsh-wsl-eventlog](#plugin-1391143266-root) | 从 WSL 通过 PowerShell 只读查询 Windows 事件日志的 Agent 工具。 | 只作本机日志初筛；空结果和 full 消息需与事件查看器复核。 |
| [dsh-wsl-expose](#plugin-1351853956-root) | 为 WSL 服务给出 Windows portproxy 建议，并可经 PowerShell 实际增删转发。 | 仅参考建议；优先本地 relay。 |
| [dsh-wsl-fetch](#plugin-1362694736-root) | 为 DSH WSL 的官方 web_fetch 提供进程内 HTTP(S) 代理传输 provider。 | 可信代理与公开站点小范围试用；含敏感内网的环境先验证代理目的地址控制。 |
| [dsh-wsl-gpu](#plugin-1350378777-root) | 汇总WSL的nvidia-smi显存数据和常见本地推理端口线索，给出静态排障提示。 | 作为排障线索试用，原始query/targets和进程归属优先。 |
| [dsh-wsl-helm](#plugin-1381843528-root) | 将 Helm 的发布列表、状态和历史查询接入 DSH 模型工具。 | 建议观察，先用显式 context 的只读账号在测试集群对照原生 Helm；不要把 allowedContexts 或状态文本单独当自动决策依据。 |
| [dsh-wsl-hostsvc](#plugin-1351854010-root) | 从WSL探测Windows侧本地模型服务，输出可达地址、模型API状态、上下文提示和配置片段。 | 适合有WSL到Windows本地模型连接问题且能手工检查设置的人试用，先限单服务，YAML当草稿；API或容量不符、探测取消失控就停止依赖建议。 |
| [dsh-wsl-llamacpp](#plugin-1381832318-root) | 给 DSH Agent 提供 llama.cpp 兼容服务的模型列表状态与一次性非流式聊天工具。 | 先核 /v1/models，再以固定 prompt 对照服务端原生结果与资源；不要只看 status.ok。 |
| [dsh-wsl-mail](#plugin-1381860693-root) | 通过本机 Himalaya 与 notmuch CLI 向 DSH 提供信封列表、未读概况和邮件搜索。 | 先核 mail_status 与未读语义，Himalaya fallback 仅视近期样本，敏感邮箱限制 Agent 访问。 |
| [dsh-wsl-mnt](#plugin-1351854159-root) | 按 WSL 路径规则判断 /mnt 工作区并给出 Linux home 迁移建议。 | 观察。 |
| [dsh-wsl-ollama](#plugin-1381724774-root) | 为 DSH 在 WSL 或本机调用现有 Ollama 守护进程提供状态、模型列表、聊天和嵌入工具。 | 仅在已确认 reachable、模型和地址的环境小范围试用；长 messages 与向量返回需核宿主负担。 |
| [dsh-wsl-perf](#plugin-1391142601-root) | 从 WSL 获取 Windows 宿主 CPU、内存、固定磁盘和按内存排序的进程快照。 | 低频初筛，0 值先核 CIM；CPU 热点另用实时进程采样。 |
| [dsh-wsl-picker](#plugin-1351853863-root) | 给 DSH Agent 浏览 WSL 与 Windows 挂载盘目录名称的只读工具。 | 个人 WSL 路径定位观察；敏感机器先核工具授权和目录暴露边界，大目录须确认截断。 |
| [dsh-wsl-port](#plugin-1350378913-root) | 读取WSL IP和ss监听文本，返回指定端口线索及3080/3081套件连接排查建议。 | 本地只读线索可试用，先核结构端点/部署，不当Windows连通或进程归属结论。 |
| [dsh-wsl-power](#plugin-1391140034-root) | 从 WSL 读取 Windows 活动电源方案、电池、睡眠与休眠信息的只读工具。 | 先与 Windows 原生命令逐字段对照，缺字段视未知；不要把休眠布尔和 sleep=0 直接用于决策。 |
| [dsh-wsl-rclone](#plugin-1381859181-root) | 把 rclone 的 remote 列表、文件名枚举和配额查看暴露为 DSH 只读工具。 | 只读凭据加显式 allowedRemotes，小路径先验；勿把 count 当总量或把 ok 当健康。 |
| [dsh-wsl-registry](#plugin-1391142974-root) | 为 WSL 内 DSH 提供受路径列表约束的 Windows 注册表读取工具。 | 建议观察并限非敏感诊断；在隔离测试键验证路径与长值边界、再评估是否允许真实注册表查询。 |
| [dsh-wsl-secret](#plugin-1381733290-root) | 为 DSH 提供 pass/age 名单读取、预览和进程环境变量转交。 | 受信任单租户进程先用假密钥验名单与输出，保持 reveal=false；高敏/多插件隔离需求优先正式范围化凭据服务。 |
| [dsh-wsl-service](#plugin-1391140376-root) | 给 WSL 中的 DSH Agent 提供 Windows 服务列表与单服务详情只读工具。 | 个人本机 WSL 排障可观察试用；共享环境先核工具授权和详情字段。 |
| [dsh-wsl-struct](#plugin-1381832935-root) | 为DSH封装jq、yq与readonly SQLite查询，提供主文件allowRoots检查及输出截断标记。 | 先观察，固定CLI/缩小root并接宿主进程治理后再试，敏感配置先不用。 |
| [dsh-wsl-systemd](#plugin-1381843201-root) | 为DSH提供用户systemd可用性探测、服务列表、单位属性与近期日志的只读工具，不启动或停止服务。 | 有条件试用，先核用户bus/日志脱敏和失败截断；严格取消/内存边界场景先观察。 |
| [dsh-wsl-terraform](#plugin-1381843937-root) | 在DSH中检查Terraform/OpenTofu状态、验证配置、解析plan变更数量和列出state资源地址，不提供apply或destroy工具。 | 先观察，先假CLI验证exit/截断收据和明确批准根/最小权限，不直接在生产云项目启用。 |
| [dsh-wsl-tray-launcher](#plugin-1351853903-root) | 生成Windows PowerShell快捷方式和可选AHK托盘入口，调用可信WSL kit启动/诊断并打开token URL。 | 先观察，优先核对生成路径/分步结果与可信kit，再评估可丢弃环境；超时或hint失败先盘点不盲重试。 |
| [dsh-wsl-vllm](#plugin-1381832640-root) | 把已有本机/Docker vLLM OpenAI 兼容端点接入 DSH Agent 的状态与聊天工具。 | 仅已有可信 vLLM 的环境小范围试用；先核 reachable、模型 id、输入上限及取消时序。 |
| [dsh-wsl-winctl](#plugin-1391143632-root) | 从 WSL 枚举并控制 Windows 顶层窗口的 Agent 工具，支持窗口状态与多种变更动作。 | 先只读枚举，变更时提供 PID+标题并事后复核；close/topmost 需人类批准。 |
| [dsh-wsl-winshot](#plugin-1391140767-root) | 从 WSL 调 PowerShell 截取 Windows 前台或指定 PID 窗口到本地 PNG 的工具。 | 只在隔离桌面试用，指定私有输出目录并手工核 PNG/残留；敏感窗口需额外授权。 |
| [dsh-wsl-wslconfig](#plugin-1351854461-root) | 读取推断路径下的Windows.wslconfig前段并给网络/内存提示，不能据此确认实际生效模式。 | 确定目标路径/原文安全后只作线索试用，空字段先核错误。 |
| [dsh-zspace](#plugin-1406500233-root) | 用 19 个模型工具管理极空间 NAS 文件、容器和系统状态。 | 保持观察，不连接承载唯一数据或家庭核心服务的 NAS；先只开只读工具，在测试共享目录验证通道切换和重复请求。 |
| [EchoBird](#plugin-1158472225-root) | 桌面AI工具管理器，提供账号与模型配置、安装管理、本地模型和多候选路由入口。 | [Q04](../../plugins/edison7009--echobird/INSIGHT.md#research-q04)、[Q05](../../plugins/edison7009--echobird/INSIGHT.md#research-q05)建议能恢复配置的用户只用少量已知provider在非关键任务试路由，先核对协议和有状态续接。 |
| [feishu-dsh-plugin](#plugin-1364766828-root) | 通过自建飞书应用为 DSH 提供 IM、文档、Bitable、Sheets 和权限工具的集成插件。 | 按测试租户只读→写入→权限操作分级试用，所有发送/修改/分享需按用户范围授权。 |
| [Mirage](#plugin-1231135337-root) | 通过虚拟文件系统、命令和可配置运行时，为Agent提供统一终端接口。 | 构建跨数据源Agent的平台开发者可先用RAM和只读测试源试验Mirage。 |
| [Mirage DSH Providers](#plugin-1231135337-typescript-packages-dsh) | 将DSH文件、Shell、子进程和溢出输出接口接到Mirage虚拟工作区。 | 需要让DSH仅访问受控挂载的平台开发者可在克隆profile里试用该适配。 |
| [Our Free Model](#plugin-1385896447-root) | 为 DSH 聚合多渠道模型，提供模型选择、本地兼容网关、用量看板与降级路由。 | [Q06](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md#research-q06) 建议从单车道脱敏试用开始，核对来源、监听、凭据与失败切换；有稳定供给或严格数据要求时先补足专项证据。 |
| [plugin-usage-billing](#plugin-1363429979-plugin-usage-billing) | 从DSH会话usage建立按日/模型/项目的估价账本，展示预算、价目来源与未计价状态。 | 先观察，先核provider口径与锁价，日志估价不用于结算/硬预算，保留快照再对账。 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root) | 监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。 | 需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 |
| [Treg](#plugin-1301657572-root) | 提供统一Agent工具目录、服务端凭据注入、API中继和调用计费管理。 | 需要多供应商API或团队凭据共享的开发者可先用非敏感只读任务和明确小预算试用Treg。 |
| [Yao Agents](#plugin-403559729-root) | 自托管管理多设备上的Agent、工作区与任务，提供桌面、浏览器、移动端及API接入。 | 当前建议有多机需求且能承担自托管的团队先观察，在隔离节点做架构核验，不把真实业务迁入平台。 |
| [zcode-usage-stats](#plugin-1368192539-root) | 在 DSH 设置页展示全历史会话 Token 用量与模型/日期趋势的本地统计面板。 | 可作为本地趋势观察，财务或预算决策前必须核源事件、完整率和账单口径。 |
| [元冰可 · 企业 AI 资源管理平台](#plugin-1416699252-root) | 以插件化控制平面统一管理企业 MCP、Skill、Agent、AI 应用、身份、审计与用量。 | 观察；有平台团队、真实匿名案件和恢复责任人后，从一种资源建立闭环，暂不全栈生产铺开。 |

<a id="plugin-1428034710-root"></a>

## [@sueleven/dsh-auto-update](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sueleven/dsh-auto-update)

> **用途**：多npm插件桌面用户集中发现更新；合格交付须是同意版本被安装并通过重启功能核查。

> **亮点**：整合启动延迟检查和官方安装通道，减少逐包手工发现，默认确认前不安装。参见[Q01](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q01)。

> **思考**：runApply未把提示targets传给脚本，实际重新查latest/候选；可能安装用户未看到的版本，且apply处理器未见局部确认围栏。参见[Q02](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q02)、[Q03](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q03)。

> **建议**：未验证假设是版本/候选/profile摘要绑定的确认计划，漂移后重新确认而非自动换集合；故障对照核计划外安装。参见[Q04](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/1708994293-hue--dsh-auto-update/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333175049-root"></a>

## [Awesome DSH Plugin](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md)

[![GitHub ★ 20,675](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20%2C675&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) [![npm 30d 1,048](https://img.shields.io/static/v1?label=npm+30d&message=1%2C048&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin) [![最新发布 2026-08-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin)

> **用途**：为寻找 DSH 扩展的用户和维护插件入口的社区提供结构化目录、网站与市场索引。合格产物是能追溯仓库及安装来源的候选集合；它不是某一业务任务的执行插件。

> **亮点**：相对 README 人工复制，该项目把每个条目拆成独立 YAML，再从同一输入生成多语言页面与宿主 format-1 市场索引，减少条目提交冲突并复用官方解析器限制输出。贡献在发现和交接链路，而不是插件执行或安全保证。[Q02](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q02)

> **思考**：市场索引只纳入已记录 npm 名、精确版本与发布时间的子集，格式通过也不证明对应包在某个宿主中可用；README 明确声明收录不是安全审查。因此“同一目录能搜索”不能推导为“全部条目均可一键安装且可信”。[Q03](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q03)

> **建议**：未验证假设是让每条索引附带按固定插件版本、宿主版本及验收时间绑定的最小结果证明，同时保留无证明条目。由当前格式校验与实际可用性之间的缺口推导，增量是帮助用户判断证据新鲜度而非给出安全认证。先取20个不同来源条目，对比普通索引和证据索引的选错率、核查耗时及维护时间；若核查节省不足以覆盖证明维护，或用户将证明误当安全背书，则停止扩展。[Q05](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334862230-root"></a>

## [chicheng-gate](../../plugins/534119219--chicheng-gate/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/534119219/chicheng-gate)

> **用途**：目标是手机或公网远程访问完整 DSH；仅需局域网或单个只读页面时 SSH/VPN/官方远程方案暴露面更小。 详见[Q01](../../plugins/534119219--chicheng-gate/INSIGHT.md#research-q01)。

> **亮点**：把门禁、反代和隧道生命周期整合，降低远程接入步骤；同时也把宿主高权限能力置于新的网络边界。 详见[Q03](../../plugins/534119219--chicheng-gate/INSIGHT.md#research-q03)。

> **思考**：远端认证成功后近似完整控制；源码补丁随宿主升级易漂移，下载运行 frpc 又增加二进制供应链与公网攻击面。 详见[Q04](../../plugins/534119219--chicheng-gate/INSIGHT.md#research-q04)。

> **建议**：若改为 VPN 内访问、默认只读 RPC、设备绑定和可撤销短期令牌，可把风险从“完整公网暴露”降到可控远程入口。 详见[Q08](../../plugins/534119219--chicheng-gate/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/534119219--chicheng-gate/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333065091-root"></a>

## [DeepSeek Harness](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md)

[![GitHub ★ 261,276](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=261%2C276&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

> **用途**：适合需要替换Agent模型、工具与交互面的开发者；这是宿主基础设施，非DSH第三方插件。[Q01](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q01)

> **亮点**：相对SDK脚本或fork核心，将模型、工具、会话及loop组织为可替换配置树，复用Cordis可逆effect和事件机制；不证明同模型任务更准确。[Q01](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q01)

> **思考**：可逆注册和持久事件不等于外部副作用可回滚，声明兼容不保证运行兼容；预览软件安全边界须依赖隔离环境。[Q02](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q02) [Q03](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q03)

> **建议**：未验证假设是以作用域、持久事件、取消/清理的接缝验收预测插件互换成本，优于仅semver；同任务对照修改量与恢复，成本不降则否定。[Q04](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333718792-root"></a>

## [DeepSeek Harness Tauri Desktop](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md)

[![GitHub ★ 3,294](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C294&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-tauri/deepseek-harness-desktop)

> **用途**：这是DSH的第三方Tauri桌面应用与托管环境，不是单一npm插件。面向希望在本机用Harness而不愿手工安装Node/pnpm、管理profile和内核的人。合格结果是能在选定profile启动可用内核、执行预期任务，并在更新/搬迁后找到会话与配置；仅窗口打开或插件数量不能证明任务交付。

> **亮点**：[Q01](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q01)、[Q02](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q02)识别的贡献是将CLI运行时与内核维护转为清单驱动的桌面管理，并用ABI探测和只缓存Ready避免仅按semver判断。迁移保留源、最后切环境的编排见[Q03](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q03)，是具体恢复设计；内置插件数量、桌面截图不是用户收益证据。

> **思考**：[Q03](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q03)表明迁移covers只检查聚合文件数/字节不少于源，链接重建失败可仅warning。done不能概括为逐文件完整或全部插件恢复；[Q02](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q02)的Unknown也允许启动。最影响采用的是用户把这几层就绪当成会话可恢复，本轮无数据损坏复现。

> **建议**：[Q05](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md#research-q05)提出未验证的分层就绪与关键路径迁移清单。对会话等关键文件核对路径/哈希/链接，区分运行时、内核、插件、会话结果；用同体积变更/链接失败/未知探测/磁盘满对照误读和定位耗时，无增益或开销过大则停止。

[查看完整分析](../../plugins/dsh-tauri--deepseek-harness-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333321333-root"></a>

## [DSH Desktop](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md)

[![GitHub ★ 33,082](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33%2C082&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anywhere-labs/dsh-desktop)

> **用途**：面向不想手管Node/Host启动的Windows/macOS用户；独立社区客户端，根不是普通第三方插件。[Q01](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q01)

> **亮点**：相对上游dsh web，组织安装运行环境、窗口/托盘、profile与恢复/更新；核心Agent与Web归上游，不能将fork规模计为桌面原创。[Q01](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q01)

> **思考**：generation局部安全边界和恢复按钮不保证所有路由、启动故障与插件组合；模式替换frame存在DOM兼容成本，真实安装/更新需单独验收。[Q02](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q02) [Q03](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q03)

> **建议**：未验证假设是把profile/generation身份及恢复检查点变成用户诊断收据，减少串配置和更新故障排查；对照Web固定故障恢复时间与资源，无改善则否定。[Q04](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/anywhere-labs--dsh-desktop/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333807290-root"></a>

## [DSH Market](../../plugins/dsh-market--dsh-market/INSIGHT.md)

[![GitHub ★ 8,811](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8%2C811&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-market/dsh-market) [![npm 30d 538,384](https://img.shields.io/static/v1?label=npm+30d&message=538%2C384&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)

> **用途**：目标是维护多个社区插件的DSH用户，任务包括发现、装入、更新和恢复profile；合格结果不是下载成功，而是profile仍能启动且目标插件实际接线。原办法为原生Discover加CLI及手动备份；README已承认同一目录可直接加入原生Discover，因此纯搜索并非独占价值。分组、备注、备份与故障恢复把多步维护放到一处，反复维护工作量较大时才更有价值。

> **亮点**：[Q02](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q02)相对单次CLI安装，将新增包加载校验、entry冲突与磁盘manifest对账整合到维护链；它改变安装办结条件，但不是第三方插件安全保证。

> **思考**：[Q03](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q03)市场与宿主共处故障域，旧版鉴权及进程崩溃恢复需单独验证；单文件rename和catch回滚不能当跨文件事务。

> **建议**：[Q05](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q05)以独立profile试装和变更计划前移恢复责任，故障注入比较可启动性和修复耗时，假设未验证。

[查看完整分析](../../plugins/dsh-market--dsh-market/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1323404274-root"></a>

## [DSH Plugin Radar](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md)

[![GitHub ★ 1,484](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C484&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdamPlatin123/dsh-plugin-radar)

> **用途**：这是目录、兼容性记录聚合器和静态数据服务，不是给DSH新增运行能力的可安装插件。适合需要从大量候选中初筛、维护社区目录或接入插件市场的读者和开发者。合格结果是得到有明确出处与数据日期的候选，再回上游检查安装、权限、当前版本及退出，不是凭“可用”状态跳过验收。

> **亮点**：[Q02](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q02)识别的贡献是以canonical统一事实源替代Markdown反向解析，在身份归并和冲突政策后从最终输出行派生统计。相比手工社区清单，发现消费者得到可缓存分类与状态数据；内部一致性提高不证明运行判定正确，测试引擎仍属私有边界。

> **思考**：[Q03](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q03)指出最影响价值的是逐条状态无法普遍回指插件commit、宿主、环境与日志。项目明确披露这一限制，聚合器计数相等或成功退出不能认证当前兼容。适合发现，不能把历史可用当自动安装门槛。

> **建议**：[Q05](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q05)推导未验证的逐条最小证据接口。按实际生产者保存版本/环境/结果/日志元组，缺项不进入本条件已测试筛选；用20个候选对照误判、定位时间和保全成本，不优于发现清单则停止。它尚未实现，也不是已确认插件商业机会。

[查看完整分析](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1387227102-root"></a>

## [DSH RotaKit](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rotakit) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rotakit)

> **用途**：供已登录本人账号的用户在兼容客户端复用调度与故障转移；合格结果须验证完整模型/工具任务。详见[Q01](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md#research-q01)。

> **亮点**：作者署名说明账号池、凭据解密与部分加固来自 MIT 上游；本项目可辨识增量是多协议同调度链、工具/流兼容投影和管理界面组合，仍需实际任务与上游差异对照。详见[Q01](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md#research-q01)。

> **思考**：input_image 被转成文本占位，数组工具输出只抽文本，工具声明只保留 function；HTTP 200 可伴随语义丢失。粘性键也由相同开头文本构成，TTL/容量与“永不失效”表述不一致。详见[Q03](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md#research-q03)。

> **建议**：未验证方向是能力协商并对不能保真的请求显式拒绝/标注降级，另为图像与自由格式工具补受测通路；用协议契约夹具测失真、误拒绝和延迟。详见[Q05](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336031182-root"></a>

## [dsh-almost-full-access](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alnita-M/dsh-Almost_Full_Access) [![npm 30d 820](https://img.shields.io/static/v1?label=npm+30d&message=820&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-almost-full-access) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-almost-full-access)

> **用途**：想减少工作区外可逆操作审批、保留危险命令确认的 Windows DSH 用户；安全交付须覆盖所有实际执行路径。详见[Q01](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q01)。

> **亮点**：将确定性命令分析、无工具子代理审查和会话审批 UI 接成低摩擦权限原型；但这种应用层组合不能替代宿主的统一执行授权。详见[Q01](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q01)。

> **思考**：几处条件未满足时直接 next，而 preset 底层是 danger-full-access/approval never；remembered/LLM 缓存仅按 32 位命令哈希，GET queue 和 POST decide 无独立登录绑定。详见[Q02](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q02)、[Q03](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q03)。

> **建议**：未验证方向是宿主统一强制授权、失败默认拒绝，强摘要+原文/会话/目录绑定审批记忆，路由绑定真实认证会话；以新工具、碰撞和服务故障夹具核未授权执行。详见[Q05](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

## [dsh-anatomy-panel](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：供已安装 dsh-organism 的本地开发者观察体征与调用，需对照原始事件和来源状态。详见[Q01](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md#research-q01)。

> **亮点**：把 dsh-organism 的分散文件映射成同源可视化页面，使开发期观察更直观；体征生成与事件采集不是本组件贡献。详见[Q01](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md#research-q01)。

> **思考**：脉冲和器官等运行时字段进入 innerHTML 未转义；部分文件损坏仍返回 200 且面板可显示零/空。真实风险取决于上游字段可控性和宿主访问控制。详见[Q02](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md#research-q02)、[Q03](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md#research-q03)。

> **建议**：未验证方向是逐源 freshness/解析状态、文本安全渲染及明确路由认证边界，用恶意字段、丢源和多标签页夹具核结果与性能。详见[Q05](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1302597978-deploy-plugins-dist-dsh"></a>

## [dsh-anet](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ANetResearch/ANet)

> **用途**：适合有明确跨节点委派与验收流程的操作者，节点在线不等任务办结。CLI替代与能力归属见 [Q01](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q01)。

> **亮点**：减少MCP/命令的身份和程序分歧，并避免复制运行指南；节点A2A/加密/结算贡献归节点而非bundle。见 [Q01](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q01)。

> **思考**：固定bundle不固定自动下载的安装器与节点版本，提示规则不等底层支付/入站控制；公共hub加入和持久身份须单独核查。见 [Q03](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q03)。

> **建议**：未验证假设为任务绑定运行时能力/二进制与策略版本证明，改善跨Agent复现；版本矩阵对照与否定条件见 [Q05](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1346196699-root"></a>

## [dsh-api-dashboard](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,117](https://img.shields.io/static/v1?label=npm+30d&message=4%2C117&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-dashboard)

> **用途**：多API平台用户希望在DSH工作流内看到余额线索和会话成本量级。详见[Q01](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md#research-q01)。

> **亮点**：把多平台余额、usage/子代理成本与GUI提示联结，减少控制台切换和人工汇算。详见[Q01](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md#research-q01)。

> **思考**：部分价格未核官方、未知模型走默认价；自定义端点携Key、状态明文存Key与删拷自更新扩大信任和恢复面。详见[Q03](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md#research-q03)。

> **建议**：可研究绑定价格版本/档位/usage来源的估算收据与明确缺价，让余额/配额/成本单位分离并按账单对照。当前未验证。详见[Q06](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1413052822-root"></a>

## [dsh-armory](../../plugins/2026heshao--dsh-armory/INSIGHT.md)

[![GitHub ★ 24](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=24&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2026heshao/dsh-armory) [![npm 30d 459](https://img.shields.io/static/v1?label=npm+30d&message=459&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory)

> **用途**：适合已有多组件管理负担的DSH用户；管理对象正确、作用域清楚且可恢复才算合格。原生/手工基线见 [Q01](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q01)。

> **亮点**：相对手改配置与分散市场，增加统一生命周期、来源识别和观测反馈；fork归属和上游管理能力须保留。见 [Q01](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q01)。

> **思考**：清单摘要与零调用指标不能当可信放行；更新先删旧后换入、时间兜底和同名投影都有限制。见 [Q03](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q03)。

> **建议**：未验证假设为可恢复Skill更新事务，保留旧版并显式提交状态；故障矩阵、比较指标与否定条件见 [Q05](../../plugins/2026heshao--dsh-armory/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2026heshao--dsh-armory/INSIGHT.md) · [返回表格](#category-index)

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



> **用途**：长会话维护者选择压缩模型并恢复终止错误，需摘要保真和完整尝试收据。

> **亮点**：补可编辑摘要主备与purpose窄路由，减少手工失败切换，非新压缩算法。详见[Q01](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q01)与[Q02](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q02)。

> **思考**：缺finish被当无failure、无用摘要不备援、throw直抛且完整流缓存；备援重发历史并产生额外成本，窗口提示非成功保证。详见[Q02](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q02)。

> **建议**：可探讨每尝试压缩收据，保留route/usage/终止与预算，缺finish标不完整并核数据范围；隐私/缓存维护成本未验证。详见[Q04](../../plugins/643048695--dsh-compaction-route/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/643048695--dsh-compaction-route/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1384810806-root"></a>

## [dsh-device-bridge](../../plugins/173787247--dsh-device-bridge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-device-bridge)

> **用途**：已有 companion 的设备由 Agent 统一枚举、查状态与调用受限动作；实际设备能力需对端实现。详见[Q01](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q01)。

> **亮点**：为多个设备提供统一 Companion v1 工具入口，而具体动作和安全策略依赖共享库与设备端。详见[Q01](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q01)。

> **思考**：核心客户端仅再导出外部包，无法由本仓库证明白名单与确认；Termux 样例空 token 对局域网可达主机开放。详见[Q02](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q02)与[Q03](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q03)。

> **建议**：未验证方向是端到端验证双侧认证/确认/幂等，示例改显式 token，并以拒绝矩阵验收。详见[Q05](../../plugins/173787247--dsh-device-bridge/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-device-bridge/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1410395082-root"></a>

## [dsh-model](../../plugins/aicivilization--dsh-model/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AIcivilization/dsh-model) [![npm 30d 2,481](https://img.shields.io/static/v1?label=npm+30d&message=2%2C481&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model)

> **用途**：给已有多模型账号且愿意运维本地/服务器服务的用户统一客户端接线。

> **亮点**：在成熟代理引擎之上整合来源与客户端接线、组合和管理流程，减少多套配置；模型推理和额度仍来自上游。[Q01](../../plugins/aicivilization--dsh-model/INSIGHT.md#research-q01)、[Q02](../../plugins/aicivilization--dsh-model/INSIGHT.md#research-q02)

> **思考**：HTTP成功一旦开始转流就退出fallback，流中失败仅结束响应；替换model不保证工具、图像和质量等价，单地址不等合格交付。[Q03](../../plugins/aicivilization--dsh-model/INSIGHT.md#research-q03)

> **建议**：未验证方向是组合能力交集和首包提交边界，首包后显式不完整收据而非盲重试，以故障矩阵核对完整率及重复副作用。[Q06](../../plugins/aicivilization--dsh-model/INSIGHT.md#research-q06)

[查看完整分析](../../plugins/aicivilization--dsh-model/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1425159954-root"></a>

## [dsh-model-auto-enricher](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/66rapper/dsh-model-auto-enricher)

> **用途**：维护大量 DSH 模型渠道的用户减少逐项配置工作。

> **亮点**：把重复模型字段配置和状态展示集中化，减少人工点击；仅改变本地配置，不扩展供应商实际能力。详见[Q01](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md#research-q01)、[Q02](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md#research-q02)。

> **思考**：未知模型默认1M/图片/思考，且启动自动巡检会直接备份并覆盖 YAML；只升不降不等于安全，备份也不保护并发写。详见[Q03](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md#research-q03)。

> **建议**：默认保守、逐项可审 diff 与能力来源，配 CAS/原子替换；用真实模型/并发矩阵比较误配置与省时，现版未实现。详见[Q04](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md#research-q04)。

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

> **思考**：[Q03](../../plugins/asheblog--dsh-ollama-cloud/INSIGHT.md#research-q03) 中目录成员与能力描述不等于真实任务可用，best-effort对齐警告也不能证明兼容。暂态保留防止误下架，同时保留能力未知风险。

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

<a id="plugin-1331636953-packages-dsh-plugin-manager"></a>

## [dsh-plugin-manager](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md)

[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 78,704](https://img.shields.io/static/v1?label=npm+30d&message=78%2C704&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager)

> **用途**：为管理多个 DSH 扩展的本机用户，在官方 Plugins 页面检查版本、判断宿主兼容、逐项更新及安排重启。交付是 profile 实际出现目标依赖并能在下一次启动加载，更新按钮成功不等于运行验收。

> **亮点**：核心增量是把版本检查、宿主最低版本判断、官方写入通道与更新后的 profile 核对接成一个流程，按运行时选择官方通道、CLI 或应用内 manager，避免再造一个独立包写入器。串行变更和只处理本次新增重复挂载的防护值得借鉴，实际安装机制仍来自 DSH 与包管理器。[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md#research-q02)

> **思考**：“安全回滚”不能解释为更新一定可用。兼容声明只覆盖包所写的版本要求，--dump-config 不导入插件，运行期 import/apply 失败仍在真实重启才暴露；网关队列只串行化本实例任务，也不能据此宣称阻止外部 CLI 并发。收益需按重启后功能与恢复结果判断。[Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md#research-q03)

> **建议**：未验证假设是把依赖落盘、组合预检、重启与核心功能冒烟分成可回读状态，并在重启后续接验收，避免把 done 混同已生效。由现有 profile 核对与未导入预检的边界推导；在临时 profile 对正常、组合失败、导入失败与外部并发更新各做对照，比较误报成功、恢复时间和多余重启。若记录状态不能减少误判或增加不可恢复状态，则否定。[Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md) · [返回表格](#category-index)

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

## [dsh-remote-ssh](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-remote-ssh)

> **用途**：对配置好的旧系统主机执行诊断，前提是只读 SSH 账号与明确命令白名单。详见[Q01](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q01)。

> **亮点**：把跨平台旧主机诊断从 SSH CLI 接入 Agent 并附白名单与探测组。详见[Q01](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q01)。

> **思考**：远端命令参数解释和模型自填 confirm 不能替代安全 shell quoting/人工授权；只读依赖白名单与远端账号。详见[Q02](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q02)和[Q03](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q03)。

> **建议**：未实现改进为固定远端 wrapper、host key pinning 和真实批准通道。详见[Q05](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1331636953-packages-dsh-ssh"></a>

## [dsh-ssh](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md)

[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 85,040](https://img.shields.io/static/v1?label=npm+30d&message=85%2C040&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh)

> **用途**：为需要从 DSH 查看和操作远程服务器的运维开发者，将主机清单、终端、文件传输、隧道与集群命令接到同一宿主连接池和模型工具。合格交付应是正确主机上的预期远端状态与可追溯结果，连接成功或命令退出码本身不足以验收部署。

> **亮点**：相对另开SSH终端和重复填写主机配置，它让界面与6个模型工具共用受控主机清单、连接池和生命周期，配置变更时清理旧连接与隧道，集群调用要求非空选择器。SSH协议及SFTP来自ssh2；本插件贡献是DSH工作流接线与主机配置归属。[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md#research-q02)

> **思考**：连接断开且没有退出状态时会在预算内重连重放命令，因而非幂等操作可能已经在远端成功却再次执行；取消分支不重放只是局部保护。传输还使用宿主本机权限读写路径，密码可明文保存在私有文件。这些是明确设计边界，不能把loopback路由或默认提示当作远端业务副作用保证。[Q03](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md#research-q03)

> **建议**：未验证假设是将命令区分只读/幂等/未知副作用，未知副作用断线后先进入结果待对账状态，以操作ID和远端结果探针核对，再由用户决定是否重放。由“无退出码→重连”的不确定结果推导，增量是恢复语义而非更激进重试。临时服务器中故意在副作用完成后断网，比较重复写入、人工对账和恢复时间；若远端无法提供可靠结果探针，保持未知，不自动补跑。[Q05](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md) · [返回表格](#category-index)

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

> **思考**：搜索和标题事件使用启发式估算并混入普通总量，不能无条件称只统计上报；冷会话按createdAt缓存，外层强刷不必失效内层，可能继续陈旧。[Q03](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q03)

> **建议**：可将上报、估算、未知分账并绑定持久日志修订，强刷两层缓存；以官方投影差分与冷日志追加验证，检测成本过高或用户仍混淆则否定。未实现。[Q05](../../plugins/361533652--dsh-token-bi/INSIGHT.md#research-q05)

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

> **用途**：长任务操作者希望阻止不断更换工具的持续调用；合格结果需明确计数主体、越额拒绝和人工恢复。

> **亮点**：把按Agent累计次数规则接到工具执行前，并保留三个job管理工具的默认例外，能够约束更换名称或参数的持续调用；属于常规计数机制的宿主适配。详见[Q03](../../plugins/173787247--dsh-tool-budget/INSIGHT.md#research-q03)。

> **思考**：作者的会话预算实际以Agent对象为键，重载和新Agent不共享计数；工具次数也不约束现金与已启动后台工作。对象契约仍不明确，不能当作全局硬预算。详见[Q04](../../plugins/173787247--dsh-tool-budget/INSIGHT.md#research-q04)。

> **建议**：可探索稳定会话身份下的共享额度预留与恢复账本，先比较团队并发和重载后超额与误拒绝；当前未实现，也可能不值得额外复杂度。详见[Q08](../../plugins/173787247--dsh-tool-budget/INSIGHT.md#research-q08)。

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

## [dsh-web 根工程](../../plugins/zhu1090093659--dsh-web/INSIGHT.md)

[![GitHub ★ 9,562](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C562&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web)

> **用途**：贡献者维护多包和生成规则，用户通过载具转接聚合安装。

> **亮点**：根工程集中维护聚合生成和多包一致性，Git入口转接而不另实现子功能；相对直接聚合安装仅局部来源便利。见[Q01](../../plugins/zhu1090093659--dsh-web/INSIGHT.md#research-q01)。

> **思考**：根Git SHA不等于所有加载包的版本，^范围和registry解析需另存实际锁；全仓能力不能重复归为根插件。见[Q03](../../plugins/zhu1090093659--dsh-web/INSIGHT.md#research-q03)。

> **建议**：未验证方向是只读输出Git/npm/子包/启用行的来源闭包证明；若现有lock已足够且无真实维护收益则不另建。见[Q04](../../plugins/zhu1090093659--dsh-web/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/zhu1090093659--dsh-web/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1331636953-packages-dsh-web-all"></a>

## [dsh-web-all](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md)

[![GitHub ★ 9,562](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C562&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 91,620](https://img.shields.io/static/v1?label=npm+30d&message=91%2C620&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all)

> **用途**：已需要多个家族模块的DSH维护者可集中安装并按行管理。

> **亮点**：统一家族依赖、行名和默认配置，当前真实子包拥有各自客户端与生命周期；不重复计算子包功能贡献。见[Q01](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md#research-q01)。

> **思考**：当前patch直挂真实子包，旧故障隔离注释不构成现行保证；一键安装仍有多版本、DOM和状态维护负担。见[Q02](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md#research-q02)。

> **建议**：未验证方向是任务驱动的最小模块依赖/权限预览；若版本组合维护超过安装恢复收益就保留现有全包/单包。见[Q04](../../plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md#research-q04)。

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

> **用途**：WSL 笔记本休眠后 TLS/JWT 失败时查看两侧时钟差。

> **亮点**：把 WSL/Windows 双时钟排查封装为只读模型工具，并提示睡眠后使用；实现简单，适合故障定位而非自动修复。详见[Q01](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md#research-q02)。

> **思考**：顺序采样的耗时会误记为时钟偏移，空输出经 Number 转换为 0 也未识别为无效时间；应避免将一次读数当成精确诊断。详见[Q03](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md#research-q03)。

> **建议**：可探索前后WSL时刻中点/RTT及Windows时间有效性检查；仅在采样窗时钟线性且未中途校时等条件下讨论，成本/误警反例见[Q05](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md#research-q05)，未实现。

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

<a id="plugin-1351854301-root"></a>

## [dsh-wsl-docker](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-docker)

> **用途**：Docker Desktop/WSL/推理容器混淆时做初筛，实际context/端点/模型就绪另核。

> **亮点**：集中Docker上下文与推理线索减少手工接线，不是GPU或API完整验收。详见[Q01](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q01)与[Q02](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q02)。

> **思考**：404也health ok且遮蔽专门错误提示，空DeviceRequests可判GPU，内部8000暴露/远程context与固定本机探测错配。详见[Q02](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q02)。

> **建议**：可探讨context/映射结构解析与daemon/设备/HTTP协议分级收据、总deadline，反例仍假绿灯则证伪实现。详见[Q05](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1338530482-root"></a>

## [dsh-wsl-env](../../plugins/173787247--dsh-wsl-env/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-env)

> **用途**：浏览器在Windows、工具跑WSL的混合工作流。详见[Q01](../../plugins/173787247--dsh-wsl-env/INSIGHT.md#research-q01)。

> **亮点**：把局部环境事实和常见WSL指导自动填入模型背景。详见[Q01](../../plugins/173787247--dsh-wsl-env/INSIGHT.md#research-q01)。

> **思考**：固定/mnt/c和always强制可误述环境，排障工具未核存在，工作区提示不等隔离。详见[Q03](../../plugins/173787247--dsh-wsl-env/INSIGHT.md#research-q03)。

> **建议**：分离事实与可选建议，实测挂载/工具存在并比较错误路径率和提示成本，尚未验证。详见[Q05](../../plugins/173787247--dsh-wsl-env/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-env/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1391143266-root"></a>

## [dsh-wsl-eventlog](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-eventlog)

> **用途**：WSL 用户初筛 Windows System/Application 等日志的严重事件；非完整审计。详见[Q01](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q01)。

> **亮点**：把 Windows 事件日志的初步查询暴露给 WSL 中的 Agent，参数和结果结构较简洁。详见[Q01](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q01)。

> **思考**：后置过滤的空结果不能证明无事件；full 的实际呈现长度与执行层不一致。详见[Q03](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q03)和[Q04](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q04)。

> **建议**：未验证改进为源端过滤、分页/总量、full 渲染对齐和敏感字段控制。详见[Q05](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351853956-root"></a>

## [dsh-wsl-expose](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-expose) [![npm 30d 674](https://img.shields.io/static/v1?label=npm+30d&message=674&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-expose) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-expose)

> **用途**：从 Windows/LAN 访问 WSL 内服务；本机 dsh UI 建议使用套件 relay。

> **亮点**：把 WSL 网络模式、建议命令与 portproxy 操作集中到工具，详见[Q01](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md#research-q01)。

> **思考**：安全说明的 allowApply/端口白名单未在执行路径强制，默认全接口监听；详见[Q02](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md#research-q02)。

> **建议**：将写操作绑定管理配置许可、明确端口/地址并回读规则，反证与回退代价见[Q05](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1362694736-root"></a>

## [dsh-wsl-fetch](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-fetch)

> **用途**：WSL 中官方 web_fetch 直连失败而 Windows HTTP 代理可用的公开网页抓取。详见[Q01](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q01)。

> **亮点**：将代理放入官方 web_fetch 进程内调用链，并在无代理/已有其他 provider 时避免强行覆盖。详见[Q01](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q01)。

> **思考**：公有域名解析到私网的路径不受此插件代码校验，普通 sleep 不响应 deadline；宿主与代理外层控制未知。详见[Q03](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q03)和[Q04](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q04)。

> **建议**：未验证改进是代理最终目的地约束、可中止退避、配置上限和受控站点效果测量。详见[Q05](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350378777-root"></a>

## [dsh-wsl-gpu](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-gpu)

> **用途**：本地NVIDIA推理前排查设备可见性/显存与监听服务。详见[Q01](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md#research-q01)。

> **亮点**：把设备和端口线索放在同一报告，减少手工收集。详见[Q01](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md#research-q01)。

> **思考**：仅loopback探测可能漏Windows NAT，端口标签/争用及固定CUDA建议是启发，整体超时未向子任务传递。详见[Q03](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md#research-q03)。

> **建议**：研究分层证据/协议及GPU归属与总预算取消，比较误诊和排障时间，未验证。详见[Q05](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381843528-root"></a>

## [dsh-wsl-helm](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-helm)

> **用途**：用于 Kubernetes 发布排查前的只读查询；合格输出须明确集群与命名空间，不能代替健康判断。详见[Q01](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q01)。

> **亮点**：把 Helm CLI 的常用只读操作封装成 Agent 工具，控制动词并标识输出截断；增量是调用边界与呈现，发布语义仍属 Helm。详见[Q01](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q01)。

> **思考**：guardContext 对空值直接放行，配置白名单不约束 Helm 默认上下文；此外 stderr 只在返回时裁剪而非累计限量。不能把“只读”误解为目标正确或无敏感信息。详见[Q03](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q03)。

> **建议**：未验证方向是每次解析实际 context 并统一按白名单检查、回显目标，同时限制 stderr 累计；双集群和高输出夹具评估正确率、延迟与内存。详见[Q05](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1351854010-root"></a>

## [dsh-wsl-hostsvc](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-hostsvc)

> **用途**：帮助在WSL连接Windows本地模型的开发者集中排查IP、端口和API问题，交付诊断线索与配置草稿而非自动修复。

> **亮点**：把WSL宿主发现、常见服务探测、HTTP模型状态和配置草稿合在DSH工具中，较手工nc/curl减少切换，并区分TCP开放与models API状态。集成价值不等于新探测算法。详见[Q02](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md#research-q02)。

> **思考**：主ok、建议URL和模板仍可由TCP开放触发，apiReady不代表生成可用；固定模板容量、元数据回退和未传播取消信号限制诊断可信度，均为静态判断未复现。详见[Q02](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md#research-q02)和[Q04](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md#research-q04)。

> **建议**：可探索分层诊断收据，仅按已完成的TCP、API、认证和授权生成检查给相应强度建议，并统一预算和取消；新增请求与GPU负担，尚未验证。详见[Q05](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md) · [返回表格](#category-index)

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

> **用途**：WSL 中 git/npm 在 Windows 挂载路径可能偏慢时的初步排查。

> **亮点**：把常见 WSL 工作区位置问题变成模型可调用的路径提醒，减少人工定位。详见[Q01](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md#research-q01)、[Q02](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md#research-q02)。

> **思考**：所有 /mnt 路径统一判为不佳、非 /mnt 判为 ok，未核文件系统/符号链接或测速；建议路径可能与现有项目冲突。详见[Q03](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md#research-q03)。

> **建议**：结合 realpath、mountinfo、目标冲突预检及同机工作负载基准，使迁移建议由当前机器证据支持；本版未实现。详见[Q04](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1351853863-root"></a>

## [dsh-wsl-picker](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-picker)

> **用途**：WSL 用户在 /、/mnt 和 IM 工作区快捷入口中定位目录；并不登记工作区。详见[Q01](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md#research-q01)。

> **亮点**：将 WSL/Windows 路径浏览和 IM 快捷入口暴露给 Agent，结果结构含 parent/chips/truncated。详见[Q01](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md#research-q01)。

> **思考**：任意绝对路径和软链接可遍历目录名称；15 秒工具超时对同步文件系统调用的约束未经验证。详见[Q03](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md#research-q03)与[Q04](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md#research-q04)。

> **建议**：未验证方向为可配置浏览根、敏感路径策略、分页与异步限时枚举；先测大目录和宿主权限。详见[Q05](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1350378913-root"></a>

## [dsh-wsl-port](../../plugins/173787247--dsh-wsl-port/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-port)

> **用途**：Windows访问WSL失败时做本地只读初筛，端到端/认证另核。

> **亮点**：把常见命令/套件指引集中，减少接线，但不是进程归属或Windows端到端健康检查。详见[Q01](../../plugins/173787247--dsh-wsl-port/INSIGHT.md#research-q01)与[Q02](../../plugins/173787247--dsh-wsl-port/INSIGHT.md#research-q02)。

> **思考**：整表端口子串可混IPv6地址，未解析绑定地址/PID或探Windows；IP失败静默、静态relay指引未核部署。详见[Q02](../../plugins/173787247--dsh-wsl-port/INSIGHT.md#research-q02)。

> **建议**：可探讨精确端点与WSL/Windows/relay/HTTP认证分段收据，unknown保留且绑定kit版本，维护成本未验证。详见[Q05](../../plugins/173787247--dsh-wsl-port/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/173787247--dsh-wsl-port/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1351853903-root"></a>

## [dsh-wsl-tray-launcher](../../plugins/173787247--dsh-wsl-tray/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-tray)

> **用途**：在WSL运行DSH且想从Windows桌面启动和诊断的维护者。

> **亮点**：集中发行版、UNC、PowerShell/BOM和token URL互操作接线，核心启动与运行依赖kit/AHK而非本插件实现。详见[Q01](../../plugins/173787247--dsh-wsl-tray/INSIGHT.md#research-q01)与[Q02](../../plugins/173787247--dsh-wsl-tray/INSIGHT.md#research-q02)。

> **思考**：fallback使用未导入readdirSync，Bash路径引用、并发/取消与顺序超时存在静态边界，shortcut失败仍可ok:true；token来源只简单匹配。详见[Q02](../../plugins/173787247--dsh-wsl-tray/INSIGHT.md#research-q02)。

> **建议**：可探讨生成物与启动收据，绑定kit/脚本版本、串行可恢复写入并逐步报告；有跨系统状态和隐私成本，未验证。详见[Q04](../../plugins/173787247--dsh-wsl-tray/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/173787247--dsh-wsl-tray/INSIGHT.md) · [返回表格](#category-index)

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

<a id="plugin-1158472225-root"></a>

## [EchoBird](../../plugins/edison7009--echobird/INSIGHT.md)

[![GitHub ★ 3,442](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C442&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/edison7009/EchoBird)

> **用途**：根项目是Tauri/Rust加React的桌面AI工具管理应用，不是可安装到DSH profile的单一插件。作者覆盖工具安装、模型配置、账号切换和本地模型等场景；本轮深入Smart Router，其合格结果是兼容客户端发到本地入口后由明确候选响应，出错能说明哪个provider失败和如何退回直接调用。

> **亮点**：[Q01](../../plugins/edison7009--echobird/INSIGHT.md#research-q01)、[Q02](../../plugins/edison7009--echobird/INSIGHT.md#research-q02)支持的增量是将多provider候选与客户端入口分开，以桌面控制面、统一本地协议和健康状态减少手工改endpoint。它不是按任务质量选最佳模型，账号切换与API路由分开；本轮其他安装/账号功能仅作者范围，不据此加分。

> **思考**：[Q03](../../plugins/edison7009--echobird/INSIGHT.md#research-q03)表明previous_response_id续接绑定原候选和fingerprint，provider变化或过期需完整输入；background/conversation也被拒绝。自动failover不能概括为状态无损迁移或输出等价。文档与源码差异加重配置判断负担，实际发布二进制兼容未知，不照抄旧限制或宣称全支持。

> **建议**：[Q05](../../plugins/edison7009--echobird/INSIGHT.md#research-q05)提出未验证的协议/续接能力探针，显示固定provider任务验收而非只看延迟；用合成工具/结构化/续接任务对照优先级路由，若误选不降或探针费用维护过大就停止。该设想不计已有贡献。

[查看完整分析](../../plugins/edison7009--echobird/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1364766828-root"></a>

## [feishu-dsh-plugin](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2286893544/feishu-dsh-plugin)

> **用途**：企业自建飞书应用下的 Agent 读取与编辑协作资产；需 scopes 和对象授权。详见[Q01](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md#research-q01)。

> **亮点**：把多种飞书资源统一为 Agent 工具，含创建 wiki 文档与人类接管授权路径。详见[Q01](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md#research-q01)。

> **思考**：创建成功不保证 grantOpenId 已获 full_access；图片 URL/本地路径缺约束，写操作需明确用户授权。详见[Q03](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md#research-q03)与[Q04](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md#research-q04)。

> **建议**：未验证改进为创建/授权事务化状态、图片 allowlist/限量、写操作幂等与连接路由鉴权加强。详见[Q05](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1231135337-root"></a>

## [Mirage](../../plugins/strukto-ai--mirage/INSIGHT.md)

[![GitHub ★ 3,724](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C724&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/strukto-ai/mirage)

> **用途**：目标是Agent平台开发者将多个数据源挂成一个受控工作区，让Agent用ls/grep等熟悉操作读取材料并写出结果。合格结果是在正确权限下找到来源、产生可核对交付物，不能把统一路径当所有服务语义等价。原办法是各服务SDK/MCP或本地同步脚本；跨源管道较多时统一接口有价值，单源任务则直接API更简单。根项目是Python/TypeScript SDK与虚拟终端平台，DSH可加载适配另在typescript/packages/dsh，不能将根目录直接当宿主插件。

> **亮点**：[Q02](../../plugins/strukto-ai--mirage/INSIGHT.md#research-q02)将命令生命周期、挂载权限和session上下文统一，适合跨数据源管道；相对多SDK有实质组合增量，但不宣称文件语义消除外部系统差异。

> **思考**：[Q03](../../plugins/strukto-ai--mirage/INSIGHT.md#research-q03)权限依赖VFS正确声明effect，跨源写入和runtime隔离也需分别核对；统一接口不能当通用事务或沙箱保证。

> **建议**：[Q05](../../plugins/strukto-ai--mirage/INSIGHT.md#research-q05)提出先只读、保留来源版本再逐步放行effect的未验证方向，与独立SDK对照合格交付和维护成本。

[查看完整分析](../../plugins/strukto-ai--mirage/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1231135337-typescript-packages-dsh"></a>

## [Mirage DSH Providers](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md)

[![GitHub ★ 3,724](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C724&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/strukto-ai/mirage) [![npm 30d 1,080](https://img.shields.io/static/v1?label=npm+30d&message=1%2C080&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@struktoai/mirage-dsh) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@struktoai/mirage-dsh)

> **用途**：本组件@struktoai/mirage-dsh是可加载DSH bundle，负责把DSH文件和shell接口接到Mirage挂载工作区；根项目的虚拟终端、数据源和runtime由其他包提供。目标是需要让Agent只见一组受控数据源的平台开发者，合格结果是DSH文件工具、bash和溢出结果在同一个虚拟世界读取，而不是意外回到host磁盘。原办法保留DSH默认fs/bash加外部数据工具；仅做本地编码不需要替换整套provider。

> **亮点**：[Q02](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md#research-q02)相对独立SDK工具，本组件保留DSH接口并统一fs、shell与spill世界，workspace所有权和session绑定有明确适配增量。

> **思考**：[Q03](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md#research-q03)无版本backend让陈旧写保护降级，替换provider还改变host搜索/cwd语义；能加载不能等同完整兼容。

> **建议**：[Q05](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md#research-q05)提出fs/shell/spill一致性探针的未验证假设，用版本缺失与并发任务检验预测价值。

[查看完整分析](../../plugins/strukto-ai--mirage--typescript-packages-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1385896447-root"></a>

## [Our Free Model](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md)

[![GitHub ★ 40,083](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C083&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ebony-Vinyl/dsh-our-free-model)

> **用途**：为DSH用户统一多渠道模型选择、兼容网关与失败切换。

> **亮点**：多车道目录与虚拟组合模型减少手工接线，视觉和窗口等元信息按成员约束。

> **思考**：部分免费是作者对上游的声明；真实渠道、供给、成本和数据处理规则仍需分别核对。

> **建议**：使用可信完整分发，从单车道脱敏任务开始，并核对监听、凭据和实际尝试链。

[查看完整分析](../../plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1363429979-plugin-usage-billing"></a>

## [plugin-usage-billing](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,475](https://img.shields.io/static/v1?label=npm+30d&message=1%2C475&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing)

> **用途**：维护者核对模型用量和费用估算，要求计量、提供商价格、历史与unknown可解释。

> **亮点**：把usage、价格快照、历史估算与unknown分开并提供分维度视图，增量在可解释聚合而非生成真实provider账单。详见[Q01](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md#research-q01)与[Q02](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md#research-q02)。

> **思考**：峰谷倍率无provider限定、同名价可跨provider兜底，当前alias重折可覆盖旧ID费用；写时锁价不等所有配置变化下历史不可变。详见[Q02](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md#research-q02)。

> **建议**：可探讨provider计价契约和锁价收据，绑定usage schema/规则/FX，旧行普通重折保留，重估明确修订；维护和迁移成本未验证。详见[Q05](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333357514-root"></a>

## [Qiushi DSH Evidence Audit](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/qiushi-dsh-evidence-audit) [![npm 30d 1,150](https://img.shields.io/static/v1?label=npm+30d&message=1%2C150&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)

> **用途**：需要对 DSH 会话和工具结果保留可检测篡改记录的审计人员与开发团队可用它监听 session/event 与 tools/result，把规范化事件写成带前序哈希的追加式证据回执；合格结果是回执顺序和内容可复算，断链或修改能被检测，同时明确记录不证明事件真实性。详见[Q01](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md#research-q01)。

> **亮点**：以 observe-only 方式把 DSH 事件转成规范 JSON 与哈希链回执，降低对业务执行路径的干扰。它相对“保存普通日志文件，或由外部采集器事后抓取没有链式关系的事件”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md#research-q03)。

> **思考**：哈希链只能检测已记录内容的后续变更，不能证明事件未遗漏、主机可信或记录中的业务事实真实。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md#research-q04)。

> **建议**：未来可探索：可将周期性链头锚定到独立存储，并给每类事件增加覆盖率计数，从而同时检测篡改和采集缺口。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1301657572-root"></a>

## [Treg](../../plugins/superdesigndev--treg/INSIGHT.md)

[![GitHub ★ 6,040](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C040&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/superdesigndev/treg)

> **用途**：Treg根项目是工具网关与凭据/计费平台，DSH子入口只提供Skill和MCP连接。目标是偶尔使用多供应商API、或团队需共享受控凭据的Agent开发者；合格结果是拿到目标provider实际响应并核清调用费用，原办法为逐家账号、密钥和工具接线。按需目录和服务端注入可降低接线摩擦，但作者宣传的价格、赠额与供应商订阅对比是固定README声明，不是本轮验证的现价或节省。单一已有API账户的用户，直连通常更简单。

> **亮点**：[Q02](../../plugins/superdesigndev--treg/INSIGHT.md#research-q02)相对逐Agent分发供应商密钥，集中凭据binding与组织级幂等隔离有明确集成价值；DSH仅是Skill/MCP入口，不将全部平台贡献归于插件壳。

> **思考**：[Q03](../../plugins/superdesigndev--treg/INSIGHT.md#research-q03)网关仍处理敏感数据与secret，调用失败也可能已计费；unknown outcome需对账，不能换key盲重试。

> **建议**：[Q05](../../plugins/superdesigndev--treg/INSIGHT.md#research-q05)提出把候选价格、请求预览和失败对账纳入工具选择的未验证假设，对照直连API核对配置、费用和误重试。

[查看完整分析](../../plugins/superdesigndev--treg/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-403559729-root"></a>

## [Yao Agents](../../plugins/yaoapp--yao/INSIGHT.md)

[![GitHub ★ 8,190](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8%2C190&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YaoApp/yao)

> **用途**：Yao根项目是自托管Agent应用/运行平台，不是安装进DSH的一层插件。适合已有多台工作机器、需要把对话任务与各节点工作区统一管理的开发或运营负责人。合格结果是指定任务在预期节点处理正确工作区并产出可核查文件或业务结果；任务板显示completed不等于内容合格。简单办法是分别登录机器运行DSH/CLI并用人工任务板记录，单机用户可能无需承担平台部署。README的“越用越好”仅是作者主张，本轮未发现结果提升实验。

> **亮点**：[Q03](../../plugins/yaoapp--yao/INSIGHT.md#research-q03)识别出工作区归属、节点能力与任务队列的控制平面整合，DSH以独立runner接入。相对逐机CLI加人工任务板，增量是持续保留任务/节点身份并统一配置接线；只有跨设备任务足够频繁时才可能覆盖部署负担，不将DSH或容器能力据为原创。

> **思考**：[Q04](../../plugins/yaoapp--yao/INSIGHT.md#research-q04)指出workspace组织隔离不等于所有模式的OS沙箱，completed/maxTokensAsSuccess不证明交付合格，准备材料写入失败还可能只warn继续。正常完成Cleanup有意保留子进程，离线节点回退又带来数据落位未知；这些核心生命周期边界尚未形成可验证的恢复与退出契约，应先观察而非以只读小任务掩盖整个平台的采用负担。

> **建议**：[Q08](../../plugins/yaoapp--yao/INSIGHT.md#research-q08)提出未验证的节点/workspace、预期产物与独立验收三联收据，分离运行结束和业务办结；用掉线、token终止及产物缺失对照误办结率和人工成本，若身份无法可信绑定或负担抵消收益则否定。

[查看完整分析](../../plugins/yaoapp--yao/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1368192539-root"></a>

## [zcode-usage-stats](../../plugins/amer-cn--zcode-usage-stats/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Amer-CN/zcode-usage-stats) [![npm 30d 157](https://img.shields.io/static/v1?label=npm+30d&message=157&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/zcode-usage-stats) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/zcode-usage-stats)

> **用途**：个人/团队操作者查看模型消耗与活跃日，发现高用量时期；非账单结算。详见[Q01](../../plugins/amer-cn--zcode-usage-stats/INSIGHT.md#research-q01)。

> **亮点**：把历史 Token 分布按时间和模型本地可视化，并对路由显式调用宿主信任栅栏。详见[Q01](../../plugins/amer-cn--zcode-usage-stats/INSIGHT.md#research-q01)。

> **思考**：“全历史”扫描遇 deadline 可能只包含部分会话且仍 ok:true，总 sessionCount 未区分已处理数；费用与字段相加口径需核。详见[Q03](../../plugins/amer-cn--zcode-usage-stats/INSIGHT.md#research-q03)。

> **建议**：未验证改进是部分统计显著标记、扫描完成数/中止、缓存 schema 指纹和账单对照。详见[Q05](../../plugins/amer-cn--zcode-usage-stats/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/amer-cn--zcode-usage-stats/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1416699252-root"></a>

## [元冰可 · 企业 AI 资源管理平台](../../plugins/01men--ybkkasi/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01men/ybkkasi)

> **用途**：平台团队治理多部门 AI 资源，以授权调用、真实交付、用量和审计一致为结果。

> **亮点**：相比分散 IAM/网关/审计脚本，提供共享主体和调用状态的插件化治理面；具体支点是 permit 与步骤账本贯穿执行。不是独立的新治理算法。见 [Q01](../../plugins/01men--ybkkasi/INSIGHT.md#research-q01)、[Q02](../../plugins/01men--ybkkasi/INSIGHT.md#research-q02)。

> **思考**：本地幂等账本无法独自保证外部动作一致；单进程、演示数据开放面及各适配器权限覆盖限制生产承诺。见 [Q03](../../plugins/01men--ybkkasi/INSIGHT.md#research-q03)。

> **建议**：未验证的单资源治理试点，以10个真实匿名案件检验账实一致和管理员负担，再决定扩域；无案件不进入建设。见 [Q05](../../plugins/01men--ybkkasi/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/01men--ybkkasi/INSIGHT.md) · [返回表格](#category-index)

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-10-27
