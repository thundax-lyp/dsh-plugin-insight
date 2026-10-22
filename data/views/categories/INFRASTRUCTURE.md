# 基础设施

[返回首页](../../../README.md)

模型接入、认证、运行环境与系统支撑。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [chicheng-gate](#plugin-1334862230-root) | 在 DSH Web 管理远程访问、frpc 隧道、面板密码门禁与移动端界面。 | 仅适合了解DSH远程控制范围、能维护网络的人在隔离环境先检查；先设置密码，验证HTTP和WebSocket都被挡住，再考虑外网，并单独确认加密传输及升级后的补丁恢复。 |
| [DSH RotaKit](#plugin-1387227102-root) | 把本机 WorkBuddy/CodeBuddy 账号组成模型池，提供 Chat、Responses、Messages 本地代理与积分状态。 | 建议观察，本人账号与明确上游条件下隔离验证实际客户端闭环和积分成本；不以返回码或余额面板单独判断可用。 |
| [dsh-almost-full-access](#plugin-1336031182-root) | 为 DSH 增加近全权限预设，以命令规则、子代理和用户审批门控部分 shell 执行。 | 重要环境不推荐；仅隔离虚拟机作安全研究原型，修补强制边界并经独立验证后重评。 |
| [dsh-anatomy-panel](#plugin-1366089972-workspace-plugins-dsh-anatomy-panel) | 从 Agent-Body 运行时文件实时展示器官体征、心跳和脉冲的宿主网页。 | 限隔离本机开发 Host 观察，不能作为独立健康判据；共享可达环境应先核认证、渲染和来源状态。 |
| [dsh-api-dashboard](#plugin-1346196699-root) | 在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。 | 可信单用户本地试用，限定Key接收方和刷新，未知模型先缺价核查，估算与官方账单分开，更新优先宿主管理器。 |
| [dsh-armor-switch](#plugin-1409096911-root) | 提供运行时提示契约切换及可选的宿主、Profile文案维护和恢复操作。 | 只建议在可恢复的独立Profile中检查机制。 |
| [dsh-armory](#plugin-1413052822-root) | 在 DSH 中管理 MCP、技能、专家、插件市场及工具账本，支持项目作用域与授权引导。 | 已有多个MCP时在独立项目试用导入和作用域隔离，核对实际工具与来源登记；OAuth与市场安装新增路径需单独验收，不依据零调用账本批量停用工具。 |
| [dsh-capability-index](#plugin-1335594781-root) | 扫描已启用工具，结合规则与语义召回向Agent上下文提示可能适用的插件能力。 | 更适合作为工具发现设计样本阅读。 |
| [dsh-clean-desktop-shell-pro](#plugin-1389469406-root) | 将 DSH web profile 包装为 Electron 桌面壳，并增加后端自动启动、托盘退出选择与运行时准备。 | 隔离桌面 profile 分别验本地/远程、离线下载、托盘退出与升级后再替换原版。 |
| [dsh-compaction-route](#plugin-1391040578-root) | 仅对DSH压缩摘要调用选择主模型，并在终止error时用备援路线重试相同历史。 | 明确主备provider/原历史恢复的维护者可限范围试用，先核失败分类、全部成本和摘要保真。 |
| [dsh-device-bridge](#plugin-1384810806-root) | DSH 工具将 Companion v1 健康检查和动作调用转给手机/IoT/薄 Agent。 | 仅隔离网络、低风险动作且设备端认证明确时观察；危险动作须先审共享库及设备实现。 |
| [dsh-gov](#plugin-1336647931-root) | 为DSH提供规则式工具allow/deny/ask、JSONL审计查询与按Agent累计token的预算警告。 | 观察，只作可信单用户辅助诊断继续探讨，强权限/预算/审计在宿主受权面另保证。 |
| [dsh-insight](#plugin-1336649545-root) | 整合插件需求匹配、环境配方、健康评分、静态扫描与安装结论工具。 | 当前只适合作为离线目录与扫描线索。 |
| [dsh-jev-guard](#plugin-1378138611-root) | 在DSH shell执行前组合静态规则与Jev语义风险判定，提供人工出口、降级与审计。 | 观察，仅在保有宿主权限和备份时继续研究，不当全权限唯一保护。 |
| [dsh-llm-balance](#plugin-1366370702-root) | 在DSH常驻卡片显示DeepSeek/Moonshot余额与Kimi/OpenCode订阅窗口，按源缓存并保留失败旧值。 | 先观察；可信个人单账号route对照，限定sources并明确OAuth写回，默认先禁token持久化。 |
| [dsh-mcp-tunnel](#plugin-1344713826-root) | 将本地 HTTP MCP 端点经 Docker/Cloudflare Quick Tunnel 暴露，并生成待确认的 DSH MCP Client 配置。 | 仅可在无敏感数据的隔离测试环境验证。 |
| [dsh-model](#plugin-1410395082-root) | 聚合多种模型来源为统一鉴权端点，提供模型目录、来源登录、组合切换与DSH管理页。 | 适合能维护本地daemon的多来源用户在临时profile试用。 |
| [dsh-model-auto-enricher](#plugin-1425159954-root) | 按模型名称规则批量补齐 DSH 上下文、输出、图片与推理配置并默认自动写盘。 | 默认不推荐自动模式。 |
| [dsh-model-info-fill](#plugin-1358816037-root) | 从models.dev按模型名补自定义供应商缺失容量、图片和思考声明，展示冲突、未匹配与旧猜档待确认。 | 先观察；个人有备份profile关自动补，目录同步完成后逐项手动审阅再补，实际供应商优先。 |
| [dsh-opencode-zen-plugin](#plugin-1402771540-root) | 把 OpenCode Console 对话模型接入 DSH 的四协议 LLM adapter，附设置卡与模型目录刷新。 | 先隔离试用单个获授权模型，再做四协议/工具/图片/错误矩阵；保护本地诊断文件。 |
| [dsh-openviking-enhance](#plugin-1401255267-root) | 把本地 OpenViking Studio、会话提交状态与记忆召回详情接入 DSH 的只读观察插件。 | 仅在可信单机试用；核服务、身份、会话与原生 API 一致性，配置保存后重查实际连接。 |
| [dsh-permissions](#plugin-1335349535-root) | 为DSH工具调用配置hard、deny、ask、allow权限规则，提供工作区作用域和可视化编辑。 | 适合将它作为宿主沙箱之上的附加规则层先试用。 |
| [dsh-plugin-adapter](#plugin-1374274469-root) | 把匿名 Zen 模型通道接为 DSH 原生 LlmAdapter，附目录回退和可选 IP 池。 | 确认当前上游允许的接入和模型，固定版本先直连试用；只有可信代理和明确出口需求才开启池。 |
| [dsh-plugin-loopback-trust](#plugin-1394489199-root) | 在反代域名网页上将连接标为 host-owning，以恢复 DSH 设置的 Host 持久化。 | 仅受控反代部署且双层授权明确时试用；先查官方 trusted-host，验未授权浏览器被拒。 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。 | 能备份profile并理解guard重启的维护者可在可丢弃环境小范围试用，先只读发现再评估已审查候选；报告/脚本不清或快照提前消失就停止后续安装。 |
| [dsh-plugin-manager](#plugin-1334267268-root) | 在 DSH 设置中展示插件中文用途与备注，并提供启停、目录覆盖及配置备份导入导出。 | 建议观察，在副本先核对owner权限、全局影响和锁占用/中断恢复，确认后再定义小范围试用；关键配置保留独立备份。 |
| [dsh-plugin-proxy](#plugin-1374274543-root) | 为DSH提供直连、系统及HTTP/SOCKS手工代理设置，切换Undici全局路由并可导出子进程环境。 | 可信单一管理者且允许失败回原出口可试用。 |
| [dsh-plugin-quota](#plugin-1400927706-root) | 会话 token/估算花费仪表与趋势预测插件，提供系统提示、命令、Agent 工具及跨插件摘要。 | 限定为会话用量趋势工具；需要逐项验证价格、投影、清零和写盘后再让其他插件消费 summary.json。 |
| [dsh-reasoning-tiers](#plugin-1367305514-root) | 按模型知识规则补齐pi-ai推理档位声明，并提供模型上下文、输出与图片能力编辑页。 | 先观察，关闭自动写并备份，先修最终写集/撤销失败保留，再评估单profile单模型。 |
| [dsh-recipe](#plugin-1336583700-root) | 把本地场景配方展开成去重插件清单和安装命令，支持关键词搜索与多配方组合。 | 作为选型草案试用，补齐profile/版本/配置再执行。 |
| [dsh-remote-ssh](#plugin-1384810201-root) | 以 SSH 将远程 Unix/AIX/macOS 的白名单诊断命令接入 DSH Agent 工具。 | 用最小权限只读账号与固定命令，测试远端参数解释；变更另走人工审批。 |
| [dsh-restart-dock](#plugin-1424433303-root) | 在 DSH 显示可拖动贴边的刷新和重启按钮，提供延迟选择与重启状态。 | Windows上需要手动重载插件的人先检查没有任务写入；先验证状态与取消、保留工作，再测试重启，macOS/Linux只期待刷新。 |
| [dsh-restart-planner](#plugin-1422176522-root) | 让 DSH Agent 排程宿主重启，由独立 helper 等待、重拉、体检并可投递继续提示。 | 需要自动重载的维护者先在隔离宿主看计划与报告；显式确认任务可中断、保留工作，先关自动续话检查重拉，再验证未知结果不重复投递。 |
| [dsh-router-loomy](#plugin-1376777535-root) | 将 Loomy 云端 Chat Completions 通道接入 dsh-router，自动读本机客户端登录态。 | 隔离 profile/模拟上游完成协议和脱敏验证，再以授权账户小流量试用。 |
| [dsh-skill-manager](#plugin-1336106328-root) | 在设置界面分层浏览、编辑和导入导出技能目录。 | 可先只读浏览；在验证多文件ZIP完整性前不要依赖导入成功作为可运行验收。 |
| [dsh-sysmon](#plugin-1334434271-root) | DSH Web 悬浮显示宿主 CPU、内存与根文件系统使用率。 | Linux 单宿主仅作辅助观察；正式容量/告警仍用现有监控，试点时注入采样失败并确认 stale 状态。 |
| [dsh-telemetry-redactor](#plugin-1333368566-root) | 在DSH遥测记录导出副本中替换受支持的敏感键和凭据模式，保留原始会话日志。 | 已有遥测需求且可审计监听器顺序的维护者可小范围试用，先用合成凭据核对后端副本、canonical与拒绝记录；不能借此主动扩大共享，遇绕过或无法发现的误删就停止依赖。 |
| [dsh-tool-budget](#plugin-1350325873-root) | 按Agent累计工具调用次数，在超过配置阈值后返回阻断说明，并支持工具名称过滤。 | 先观察。 |
| [dsh-tool-explorer](#plugin-1351594249-root) | 在DSH Web集中浏览、编辑、安装与切换技能，管理和探测MCP服务器。 | 观察，先备份技能/lock/patch，受信本机可继续核展示与独立开关，避免唯一bundle直接改名升级。 |
| [dsh-tts-flash](#plugin-1363291561-root) | DSH 桌面端流式回复语音朗读与等待短语播放插件，支持 Edge 和云端 TTS。 | 先在隔离桌面试听 Edge，再用受控云密钥验证长回复、中断、权限与费用。 |
| [dsh-ui-auth](#plugin-1343420855-root) | 为 DSH Web 提供账户登录、用户管理、TOTP/Passkey、会话授权及按用户模型配置。 | 建议观察，先固定目标宿主完成可达面和状态恢复核查；互不信任用户还需独立系统权限边界，不能把登录页当隔离验收。 |
| [dsh-usage-billing](#plugin-1333954586-root) | 统计DSH的DeepSeek模型调用与估算消费，提供预算提醒、历史回填、导出和余额展示。 | 适合本机单实例做大致用量观察。 |
| [dsh-usage-dashboard-plus](#plugin-1334023305-root) | 在DSH侧栏显示DeepSeek余额和日志估算消费，并汇总外部视觉调用与每会话模型/延迟统计。 | 先观察，可信单用户只作趋势对照。 |
| [dsh-vps](#plugin-1377159975-root) | 为自有 VPS 部署带登录网关、HTTPS 和服务管理的 DSH。 | 先在隔离 VPS 钉所有文件来源、演练令牌缺失/备份失败/回滚，并对照原生隧道或手工部署；正式公网持续采用需独立安全及恢复验收。 |
| [dsh-web-lan-access](#plugin-1334255288-root) | 通过替换 WebServer 让 DSH Web 监听所有接口、自动信任接口 IP 并给远程浏览器 Host 能力。 | 默认不推荐。 |
| [dsh-web-restart](#plugin-1335060007-root) | Windows DSH Web 的侧栏重启按钮，调用硬编码 PowerShell 外部脚本。 | 暂不直接采用；只在隔离 Windows 复核脚本、授权和失败状态后考虑。 |
| [dsh-workspace-tools](#plugin-1363511446-root) | 按已注册工作区为新根会话自动选择 Agent 与权限预设的设置页和事件监听器。 | 先在低权限工作区限定试用；全权限规则和大小写敏感环境先验证匹配及首 turn 顺序。 |
| [dsh-wsl-clock](#plugin-1351854066-root) | 提供 clock_doctor 工具，诊断 WSL 与 Windows UTC 时间偏移。 | 只在 WSL/Windows 开发环境试用，交叉对照时间与 TLS/JWT 现象，不自动执行重启。 |
| [dsh-wsl-compose](#plugin-1381842592-root) | 为 DSH 提供 Docker Compose 状态、容器列表、日志与可选 up/down 的本机运维工具。 | 默认只读并限制项目根；变更前后用宿主人工审批和 ps 对账，超时不盲重试。 |
| [dsh-wsl-db](#plugin-1381859591-root) | 经 psql/redis-cli 为 DSH Agent 提供 PostgreSQL 与 Redis 连通性和查询工具。 | 仅隔离测试库、最小权限账号试用；生产库不直接采用。 |
| [dsh-wsl-defender](#plugin-1391141174-root) | 从WSL读取Windows Defender、防火墙、近期检测和排除项，形成安全状态摘要。 | 作为状态收集工具使用，对关键异常回到Windows安全中心核对；遇到unavailable先查权限和安全产品。 |
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
| [dsh-zspace](#plugin-1406500233-root) | 将极空间 NAS 文件管理与容器诊断能力接入 DSH，自动选择直连或中转。 | 先用只读列表、stat及测试文件评估；重要写入和删除固定通道并核对结果，网络失败后确认实际状态再重试。 |
| [feishu-dsh-plugin](#plugin-1364766828-root) | 通过自建飞书应用为 DSH 提供 IM、文档、Bitable、Sheets 和权限工具的集成插件。 | 按测试租户只读→写入→权限操作分级试用，所有发送/修改/分享需按用户范围授权。 |
| [plugin-usage-billing](#plugin-1363429979-plugin-usage-billing) | 从DSH会话usage建立按日/模型/项目的估价账本，展示预算、价目来源与未计价状态。 | 先观察，先核provider口径与锁价，日志估价不用于结算/硬预算，保留快照再对账。 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root) | 监听工具结果和会话事件，生成不保存观察明文的哈希链 JSONL 证据回执。 | 用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。 |
| [zcode-usage-stats](#plugin-1368192539-root) | 在 DSH 设置页展示全历史会话 Token 用量与模型/日期趋势的本地统计面板。 | 可作为本地趋势观察，财务或预算决策前必须核源事件、完整率和账单口径。 |
| [元冰可 AI 资源治理平台](#plugin-1416699252-root) | 以 Cordis 插件树组织企业 AI 资源、身份权限、模型与数字员工治理。 | 已有多用户治理需求的团队先在隔离环境跑一条业务链；核对拒绝、例外入口与备份恢复，再扩部门和资源，避免把启动健康当业务验收。 |
| [模型接力](#plugin-1415863200-root) | 把已接入 DSH 的模型组成候选队列，失败时重试、轮换并记录会话隔离。 | 已有多模型且主要做可复核任务时可评估；涉及不可重复动作或不希望插件代发用户消息时，应先明确自动续轮范围和来源。 |

<a id="plugin-1334862230-root"></a>

## [chicheng-gate](../../plugins/534119219--chicheng-gate/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-gate)

> **用途**：需要从其他设备访问自用DSH的人，通过面板管理监听范围、隧道和密码登录；交付可访问的Web界面，仍需核查网络与宿主权限。

> **亮点**：相对手工配置frpc、反向代理和DSH监听参数，贡献是把网络开关、登录门禁与独立隧道网关放进同一DSH设置流程，使来自loopback的隧道流量也先过密码。scrypt、frpc与反向代理均为既有机制，插件增量在DSH访问接缝及生命周期集成。

> **思考**：集成门禁是否抵消了扩大宿主信任面的代价？源码同时修改trustedHosts和特权接口路径，且applyPatches按字符串改官方文件，revertPatches直接回写旧.bak；宿主升级后关闭开关可能覆盖新的官方内容。frpc校验文件HTTP失败只警告并跳过，缺少匹配行也不终止，不能把“带SHA256”概括为强制校验。cookie构造未设Secure，传输保密也不是插件已证明能力。

> **建议**：待验证假设：将宿主接缝转换为按版本/哈希守卫的显式适配层，恢复时仅撤销自己仍匹配的补丁，并让frpc安装校验失败即停止，可降低升级与供应链不确定性。依据是当前.bak恢复与可跳过校验。用官方文件已升级/用户另改/校验404三类输入，验证拒绝覆盖与拒绝运行，同时记录维护多版本适配的人工成本；当前均未实现。

<a id="plugin-1387227102-root"></a>

## [DSH RotaKit](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-rotakit)

> **用途**：供已登录本人账号的用户在兼容客户端复用调度与故障转移；合格结果须验证完整模型/工具任务。详见[Q01](#research-q01)。

> **亮点**：作者署名说明账号池、凭据解密与部分加固来自 MIT 上游；本项目可辨识增量是多协议同调度链、工具/流兼容投影和管理界面组合，仍需实际任务与上游差异对照。详见[Q01](#research-q01)。

> **思考**：input_image 被转成文本占位，数组工具输出只抽文本，工具声明只保留 function；HTTP 200 可伴随语义丢失。粘性键也由相同开头文本构成，TTL/容量与“永不失效”表述不一致。详见[Q03](#research-q03)。

> **建议**：未验证方向是能力协商并对不能保真的请求显式拒绝/标注降级，另为图像与自由格式工具补受测通路；用协议契约夹具测失真、误拒绝和延迟。详见[Q05](#research-q05)。

<a id="plugin-1336031182-root"></a>

## [dsh-almost-full-access](../../plugins/alnita-m--dsh-almost_full_access/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Alnita-M/dsh-Almost_Full_Access) [![npm 30d 820](https://img.shields.io/static/v1?label=npm+30d&message=820&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-almost-full-access) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-almost-full-access)

> **用途**：想减少工作区外可逆操作审批、保留危险命令确认的 Windows DSH 用户；安全交付须覆盖所有实际执行路径。详见[Q01](#research-q01)。

> **亮点**：将确定性命令分析、无工具子代理审查和会话审批 UI 接成低摩擦权限原型；但这种应用层组合不能替代宿主的统一执行授权。详见[Q01](#research-q01)。

> **思考**：几处条件未满足时直接 next，而 preset 底层是 danger-full-access/approval never；remembered/LLM 缓存仅按 32 位命令哈希，GET queue 和 POST decide 无独立登录绑定。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：未验证方向是宿主统一强制授权、失败默认拒绝，强摘要+原文/会话/目录绑定审批记忆，路由绑定真实认证会话；以新工具、碰撞和服务故障夹具核未授权执行。详见[Q05](#research-q05)。

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

## [dsh-anatomy-panel](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：供已安装 dsh-organism 的本地开发者观察体征与调用，需对照原始事件和来源状态。详见[Q01](#research-q01)。

> **亮点**：把 dsh-organism 的分散文件映射成同源可视化页面，使开发期观察更直观；体征生成与事件采集不是本组件贡献。详见[Q01](#research-q01)。

> **思考**：脉冲和器官等运行时字段进入 innerHTML 未转义；部分文件损坏仍返回 200 且面板可显示零/空。真实风险取决于上游字段可控性和宿主访问控制。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：未验证方向是逐源 freshness/解析状态、文本安全渲染及明确路由认证边界，用恶意字段、丢源和多标签页夹具核结果与性能。详见[Q05](#research-q05)。

<a id="plugin-1346196699-root"></a>

## [dsh-api-dashboard](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,117](https://img.shields.io/static/v1?label=npm+30d&message=4%2C117&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)

> **用途**：多API平台用户希望在DSH工作流内看到余额线索和会话成本量级。详见[Q01](#research-q01)。

> **亮点**：把多平台余额、usage/子代理成本与GUI提示联结，减少控制台切换和人工汇算。详见[Q01](#research-q01)。

> **思考**：部分价格未核官方、未知模型走默认价；自定义端点携Key、状态明文存Key与删拷自更新扩大信任和恢复面。详见[Q03](#research-q03)。

> **建议**：可研究绑定价格版本/档位/usage来源的估算收据与明确缺价，让余额/配额/成本单位分离并按账单对照。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1409096911-root"></a>

## [dsh-armor-switch](../../plugins/571242--dsh-armor-switch/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/571242/dsh-armor-switch)

> **用途**：适合研究DSH提示装配与自有环境维护的开发者；提示开关、宿主改写和配置改写要分别核对。

> **亮点**：作者主张减少过度自审；源码可确认的是把提示装配热切换、偏好持久化和可逆维护统一到UI。相对直接编辑提示，开关不需反复注册；host-clean的锚点及manifest为特定宿主字节修改提供恢复依据。它不能改变供应商模型规则或增加网络能力。

> **思考**：提示文字优先权宣告不等于实际指令优先权，效果依赖模型；minimal完整预设会抑制这些注册。更关键的是主开关关闭不代表独立host-clean已还原，等长字节改写绑定宿主版本，升级或不完整恢复可能留下不同状态。 profile-clean的BLOCK_BODY还会设置danger-full-access、approval never及默认权限预设，实际作用不仅是文案维护，需独立核对执行权限变化。

> **建议**：待验证假设：以纯只读差异预览和逐模块恢复状态代替单一总开关，可减少用户误判。用运行时开关、磁盘归档、新会话配置的组合场景测状态理解与恢复成功；不把解除模型限制当实验目标。

<a id="plugin-1413052822-root"></a>

## [dsh-armory](../../plugins/2026heshao--dsh-armory/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-armory)

> **用途**：同时维护多项目MCP和第三方技能的用户，希望集中导入、辨认安装来源并隔离会话工具。

> **亮点**：作者声明fork自Imzl-zl MCP看板，原面板不计原创。可识别贡献是项目共享连接所有权与异步释放占位、统一导入准入，以及在静态header宿主前补OAuth授权流程；目录规模并非已安装能力数量。

> **思考**：安装来源账本是否能作为可靠审计真相？wb-install-state的writeAtomic先写staging再rm正式文件再rename，存在删除后失败窗口；record是读改写且该模块未串行化，并发调用可能丢登记。登记失败不影响安装，故安装成功与来源已登记不能等同；共享连接也须区分配置落盘与运行收敛。

> **建议**：已有多个MCP时在独立项目试用导入和作用域隔离，核对实际工具与来源登记；OAuth与市场安装新增路径需单独验收，不依据零调用账本批量停用工具。

<a id="plugin-1335594781-root"></a>

## [dsh-capability-index](../../plugins/777-zen--dsh-capability-index/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/777-Zen/dsh-capability-index)

> **用途**：工具库较大的DSH会话需要减少遗漏可用工具；合格交付应是正确工具被使用且任务更可靠，不能只用提示命中率代替任务成功。

> **亮点**：相对将所有工具说明直接塞进上下文，增量是以任务触发、语义召回和负向声明分层压缩候选，同时把纯排序逻辑与宿主适配分开。使用的向量模型与检索原理是上游能力，插件贡献在能力发现的流程组合。

> **思考**：提升插件利用率是否提升任务质量？README作者主动承认仅16条评估不足以证明价值并已归档；源码中词表、Top-K池及模型降级表明召回受工具描述和声明质量约束。错误提示也可能增加调用或挤占上下文，不能从命中率推出净收益。

> **建议**：由not_for负向声明和不强制调用推导，可增加“本任务不调用”的解释性拒绝记录与按任务结果校准阈值，而不是只追求召回。未验证假设：将误触发成本纳入阈值后可在固定token预算下提高合格交付率。用未参与调参的新任务与无提示基线盲评；若质量未升或复核负担更高则否定。

<a id="plugin-1389469406-root"></a>

## [dsh-clean-desktop-shell-pro](../../plugins/aicksion--dsh-clean-desktop-shell-pro/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aicksion/dsh-clean-desktop-shell-pro)

> **用途**：桌面用户管理本地 DSH web 服务与窗口；替换原壳前需避免双实例。详见[Q01](#research-q01)。

> **亮点**：相对原版增加自动后端生命周期、无浏览器启动和退出选择，源码路径可核。详见[Q01](#research-q01)。

> **思考**：远程配置的本地隔离宣称与 earlyBackend 无条件 start 不一致；运行时下载校验为尽力而为。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进是远程目标判别先于 start、强制完整性校验或显式放行、保留旧运行时回滚。详见[Q05](#research-q05)。

<a id="plugin-1391040578-root"></a>

## [dsh-compaction-route](../../plugins/643048695--dsh-compaction-route/INSIGHT.md)



> **用途**：长会话维护者选择压缩模型并恢复终止错误，需摘要保真和完整尝试收据。

> **亮点**：补可编辑摘要主备与purpose窄路由，减少手工失败切换，非新压缩算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：缺finish被当无failure、无用摘要不备援、throw直抛且完整流缓存；备援重发历史并产生额外成本，窗口提示非成功保证。详见[Q02](#research-q02)。

> **建议**：可探讨每尝试压缩收据，保留route/usage/终止与预算，缺finish标不完整并核数据范围；隐私/缓存维护成本未验证。详见[Q04](#research-q04)。

<a id="plugin-1384810806-root"></a>

## [dsh-device-bridge](../../plugins/173787247--dsh-device-bridge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-device-bridge)

> **用途**：已有 companion 的设备由 Agent 统一枚举、查状态与调用受限动作；实际设备能力需对端实现。详见[Q01](#research-q01)。

> **亮点**：为多个设备提供统一 Companion v1 工具入口，而具体动作和安全策略依赖共享库与设备端。详见[Q01](#research-q01)。

> **思考**：核心客户端仅再导出外部包，无法由本仓库证明白名单与确认；Termux 样例空 token 对局域网可达主机开放。详见[Q02](#research-q02)与[Q03](#research-q03)。

> **建议**：未验证方向是端到端验证双侧认证/确认/幂等，示例改显式 token，并以拒绝矩阵验收。详见[Q05](#research-q05)。

<a id="plugin-1336647931-root"></a>

## [dsh-gov](../../plugins/863683348--dsh-gov/INSIGHT.md)

[![npm 30d 146](https://img.shields.io/static/v1?label=npm+30d&message=146&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-gov) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-gov)

> **用途**：维护者需要统一解释工具策略、观察事件和预算提示，强治理需额外权限边界。详见[Q01](#research-q01)。

> **亮点**：把工具策略解释、JSONL事件与预算提示用纯模块和一个工具整合，减少分散hook接线。详见[Q01](#research-q01)。

> **思考**：被治理模型也能改全局策略/预算，quota不硬停且启动/global键与计量delta未闭合，持久失败和坏配置可静默失去治理。详见[Q02](#research-q02)。

> **建议**：管理员签发的版本化政策、明确usage delta/预算预留与关联审计收据，按自改政策/计量/坏盘反例检验，未验证。详见[Q05](#research-q05)。

<a id="plugin-1336649545-root"></a>

## [dsh-insight](../../plugins/863683348--dsh-insight/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-insight) [![npm 30d 828](https://img.shields.io/static/v1?label=npm+30d&message=828&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-insight) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-insight)

> **用途**：适合先整理候选插件再人工审阅的用户；不应把工具生成的install文字当宿主验收。

> **亮点**：作者试图以单一入口回答值得装吗；实际增量是将需求匹配、配方、健康信号和静态扫描汇到一个决策接口，减少多工具手工拼接。其核心是集成而非已验证的质量预测，当前评分到结论的字段接线存在明显缺口。

> **思考**：scoreRecord返回total而verdictFor读取points，index原样传入，因此非高危且没有低匹配分支的记录也不能命中>=70的install或>=40的caution，输出score为undefined、理由health undefined。另plugin_audit用findings.length作scanned计数，不能据此知道读了几文件；零发现与未扫描也被混为not-scanned。

> **建议**：待验证假设：用统一带Schema的证据对象表达扫描覆盖、健康分及需求适配，再把结论限定为可追溯规则，可避免组合工具因字段漂移失真。以高分/低分、已扫零发现、未扫及高危四组端到端用例检查分支；只有接线通过后再研究阈值是否预测真实可用性。

<a id="plugin-1378138611-root"></a>

## [dsh-jev-guard](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 1,817](https://img.shields.io/static/v1?label=npm+30d&message=1%2C817&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)

> **用途**：希望减少Agent误删/覆盖风险，需保留宿主权限与备份。详见[Q01](#research-q01)。

> **亮点**：在真实执行hook把便宜规则/预筛与语义信号、人工和降级接线，语言与问法可追溯；模型及安全证明不属本插件新增。详见[Q01](#research-q01)。

> **思考**：抹引号/只读头预筛可省略真实副作用，同命令cache未绑定脚本内容，一次许可不绑定cwd/用户；异常允许依赖宿主兜底。详见[Q03](#research-q03)。

> **建议**：固定执行对象摘要、版本化可失效cache与独立签发原子消费许可，按变脚本/跨目录/并发和未知语法反例证伪，未验证。详见[Q08](#research-q08)。

<a id="plugin-1366370702-root"></a>

## [dsh-llm-balance](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md)

[![npm 30d 847](https://img.shields.io/static/v1?label=npm+30d&message=847&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-llm-balance) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-llm-balance)

> **用途**：多LLM账号用户希望少切控制台并清楚余额/套餐剩余。详见[Q01](#research-q01)。

> **亮点**：将余额/配额语义分开并接入逐源缓存和常驻GUI，减少控制台切换。详见[Q01](#research-q01)。

> **思考**：同类route共用首账号和probe缓存；Kimi默认刷新写CLI token、读比较rename非原子CAS，HTTP handler未本地认证。详见[Q03](#research-q03)。

> **建议**：可研究账号/端点/revision缓存和显式续期能力，逐route归属与CLI统一版本写，比较错账号及恢复工时。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1344713826-root"></a>

## [dsh-mcp-tunnel](../../plugins/988hj7tczd-oss--dsh-mcp-tunnel/INSIGHT.md)



> **用途**：本机 MCP 服务需让远程 DSH Agent 调用，但操作者不愿逐项搭建代理和隧道。

> **亮点**：把 HTTP MCP 的代理、隧道和客户端片段组合到 DSH 工具流程；减少手工配置但不自动接入 profile。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：含 Bearer 的 pending YAML 默认权限未收紧，且自定义 deployDir 创建后 status/stop 按默认路径寻址；公开隧道真实鉴权依赖未固定镜像。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：把秘密片段权限和目录生命周期做成闭环、锁定代理镜像并加入真实未授权/授权 MCP 握手测试，可提高生产适用性；现版未实现。详见[Q04](#research-q04)。

<a id="plugin-1410395082-root"></a>

## [dsh-model](../../plugins/aicivilization--dsh-model/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model) [![npm 30d 2,009](https://img.shields.io/static/v1?label=npm+30d&message=2%2C009&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model)

> **用途**：多账号/本机模型用户需要统一连接和额度回退，合格请求须保留模型语义、授权与工具流，不是只拿到HTTP成功。

> **亮点**：相对每个客户端配置多个provider，增量是端点、设备鉴权、来源管理和组合回退一体化。核心模型转接依赖CLIProxyAPI等上游，不应把模型供给与账号额度归为插件创新。

> **思考**：统一可用性是否掩盖不同模型与账户条件？combo允许换模型，虽避免输出后再换，但不同上下文/工具语义和未知请求结果需验收；setup含系统服务、凭据和配置修改，多阶段部分失败不等于全量回滚。README免费/订阅可转接均未在本轮核实。

> **建议**：由输出前回退边界推导，可将组合限制为经验证兼容任务能力集，返回最终来源/回退原因，并把未知结果与可重试失败区分。未验证；相同工具任务注入限流/断流，若结果归属或副作用重复不清则否定。

<a id="plugin-1425159954-root"></a>

## [dsh-model-auto-enricher](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/66rapper/dsh-model-auto-enricher)

> **用途**：维护大量 DSH 模型渠道的用户减少逐项配置工作。

> **亮点**：把重复模型字段配置和状态展示集中化，减少人工点击；仅改变本地配置，不扩展供应商实际能力。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：未知模型默认1M/图片/思考，且启动自动巡检会直接备份并覆盖 YAML；只升不降不等于安全，备份也不保护并发写。详见[Q03](#research-q03)。

> **建议**：默认保守、逐项可审 diff 与能力来源，配 CAS/原子替换；用真实模型/并发矩阵比较误配置与省时，现版未实现。详见[Q04](#research-q04)。

<a id="plugin-1358816037-root"></a>

## [dsh-model-info-fill](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill)

> **用途**：DSH自定义模型维护者希望减少手查能力字段，仍以实际供应商能力为准。详见[Q01](#research-q01)。

> **亮点**：将模型目录、冲突/未知档区分与宿主补缺保存联结，降低重复能力配置。详见[Q01](#research-q01)。

> **思考**：目录未到即自动填默认且以后不覆盖；命中缺容量也fallback，配置/遗漏偏好非事务，HTTP自检不等身份认证。详见[Q03](#research-q03)。

> **建议**：可研究逐字段exact/归一/默认来源收据与catalog-ready确认计划，用慢目录和受限变体反例比较错误填值。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1402771540-root"></a>

## [dsh-opencode-zen-plugin](../../plugins/a42null--dsh-opencode-zen-plugin/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/A42Null/dsh-opencode-zen-plugin) [![npm 30d 400](https://img.shields.io/static/v1?label=npm+30d&message=400&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a42null/dsh-opencode-zen-plugin)

> **用途**：已有 Console 账户的 DSH 用户调用付费模型；需确认当前账号权限和模型端点。详见[Q01](#research-q01)。

> **亮点**：一个插件承接四类网关协议及 Web 配置入口，降低 DSH 多模型手工配置量。详见[Q01](#research-q01)。

> **思考**：模型选择器的静态并集不代表可用性；本地 plugin-load.json 保存密钥前10字符且错误响应片段入日志。详见[Q02](#research-q02)及[Q03](#research-q03)。

> **建议**：未验证改进是仅失败时启用静态目录、移除密钥前缀、用结构化错误与持续测试路由表。详见[Q05](#research-q05)。

<a id="plugin-1401255267-root"></a>

## [dsh-openviking-enhance](../../plugins/a2chitect--dsh-openviking-enhance/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/A2chitect/dsh-openviking-enhance) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-openviking-enhance) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-openviking-enhance)

> **用途**：适合可信单机的 OpenViking 记忆调试与会话解释。详见[Q01](#research-q01)。

> **亮点**：在 DSH UI 直接追踪 commit 进度、archive diff 和当前召回证据，减少跨应用诊断。详见[Q01](#research-q01)。

> **思考**：当前召回不是历史注入记录；HTTP 防线是 loopback 而非用户身份授权；volatile 保存后的 host 重构需验证。详见[Q02](#research-q02)至[Q04](#research-q04)。

> **建议**：未验证改进是路由授权/会话绑定、历史注入痕迹与配置热重建。详见[Q05](#research-q05)。

<a id="plugin-1335349535-root"></a>

## [dsh-permissions](../../plugins/940842546--dsh-permissions/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-permissions) [![npm 30d 606](https://img.shields.io/static/v1?label=npm+30d&message=606&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-permissions) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-permissions)

> **用途**：团队需要在宿主既有沙箱上增加工具级规则，合格结果是匹配的敏感操作确实被拒绝，规则修改与审批有可审计边界。

> **亮点**：相对只靠系统提示，增量是在真正工具执行链上增加可视规则判定，并将hard与会话never策略分开；这是可执行接线，不仅是提示承诺。但规则覆盖不是OS级隔离。

> **思考**：hard是否在所有异常下仍有效？index.js最外catch记录engine-error后return next，工作区解析失败还会只用global；match按工具名称/原参数字符串，不能解析shell等价写法、符号链接或未枚举工具。因此正常匹配可阻断，不等于不可绕过的安全边界，异常放行是核心限制。

> **建议**：由异常放行与硬规则承诺张力推导，可将hard判定做成最小fail-closed核，加载失败时拒绝相关写工具；ask/便利规则可单独降级。未验证假设是减少策略错误时漏放而不使无关读取不可用。注入设置/解析/审批异常并测敏感写是否被阻止，若仍放行则不成立。

<a id="plugin-1374274469-root"></a>

## [dsh-plugin-adapter](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter)

> **用途**：DSH 用户希望在模型选择器直接使用上游匿名通道；合格结果须当前可用且符合上游接入条件。

> **亮点**：在 DSH 提供原生 LlmAdapter、动态目录和流错误处理；沿用 OpenCode 通道及上游项目和 pi-ai，贡献重点是宿主接线与韧性修正。详见[Q02](#research-q02)。

> **思考**：静态目录可在实时列表缺席时暴露模型，选择器可见不保证可用；伪装请求头及可选代理池还依赖上游准入和信任。详见[Q03](#research-q03)。

> **建议**：可把目录来源、模型请求结果和出口健康联成每模型可信度闸门；通过目录变更与故障注入对照误展示、误归因及成本，尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1394489199-root"></a>

## [dsh-plugin-loopback-trust](../../plugins/6mt--dsh-plugin-loopback-trust/INSIGHT.md)



> **用途**：反代域名的 DSH 设置页被作者描述为降级到内存；合格结果须兼顾可持久化与未授权浏览器拒绝。

> **亮点**：用短客户端补丁绕过反代域名的本地分类，恢复作者所述设置持久化路径；依赖 DSH 私有时序和字段。详见[Q02](#research-q02)。

> **思考**：它对所有非 loopback、无既存 transport 的网页统一标记 host-owning，插件无 origin 白名单或身份校验；服务端 fence 保留仅作者声称，不能替代代理授权。详见[Q03](#research-q03)。

> **建议**：可由服务端授权后签发范围化的持久化 capability，避免客户端自宣告；双浏览器/Origin/Host 对照功能与拒绝率，尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1335098475-root"></a>

## [dsh-plugin-mall](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1e0zj/dsh-plugin-mall) [![npm 30d 1,485](https://img.shields.io/static/v1?label=npm+30d&message=1%2C485&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)

> **用途**：供希望集中发现/管理社区插件的用户和维护者，合格结果需重启后目标profile功能可用且失败可恢复。

> **亮点**：将物化预检、profile快照和绑定材料的一次批准接入发现/安装，较手工add提供具体兼容与恢复线索；包管理与loader来自上游，徽章不是安全审查。详见[Q02](#research-q02)。

> **思考**：普通web启动在市场自身加载时可能静态commit并删除快照，后序插件失败便失自动回退件；guard存活窗口仍非核心功能验收，源码与作者已知#24一致。详见[Q03](#research-q03)。

> **建议**：可探讨完整启动收据，分开loader完成、功能回读和存活窗口，保留回退目标直到真实提交点；需要宿主事件与存储责任，未验证。详见[Q06](#research-q06)。

<a id="plugin-1334267268-root"></a>

## [dsh-plugin-manager](../../plugins/2768651338--dsh-plugin-manager/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-plugin-manager) [![npm 30d 923](https://img.shields.io/static/v1?label=npm+30d&message=923&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager)

> **用途**：多插件用户需要识别用途并正确启停，合格结果包括只改预期配置且宿主实际生效；目录备注不是能力证明。详见[Q01](#research-q01)。

> **亮点**：将用途说明、备注和局部启停编辑整合进设置，保留原生包管理并区分来源与用户安装；增量是维护流程便利而非新包管理能力。详见[Q01](#research-q01)。

> **思考**：写入安全不能只看函数名，rename受阻后直接覆盖、备份失败仍继续，队列也非跨进程锁；全局patch与多文件导入可能部分完成。静态风险尚未故障注入。详见[Q03](#research-q03)。

> **建议**：可研究预览diff、基线摘要、写后读回和宿主生效回执，配合导入恢复清单，以并发/锁占用/中断反例验证配置保留。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1374274543-root"></a>

## [dsh-plugin-proxy](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md)

[![npm 30d 80](https://img.shields.io/static/v1?label=npm+30d&message=80&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy)

> **用途**：需要集中配置DSH模型/搜索等出站代理的维护者。详见[Q01](#research-q01)。

> **亮点**：统一现成代理能力与设置、白名单和连接退休，减少逐插件配置。详见[Q01](#research-q01)。

> **思考**：无效配置先撤旧代理再回baseline，恢复缺所有权比较，不能保证严格禁直连或跨插件恢复。详见[Q03](#research-q03)。

> **建议**：研究先构建再替换、失败关闭、dispatcher所有权和环境逐键恢复，比较误出口和恢复工时。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1400927706-root"></a>

## [dsh-plugin-quota](../../plugins/121212165--dsh-plugin-quota/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota) [![npm 30d 126](https://img.shields.io/static/v1?label=npm+30d&message=126&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota)

> **用途**：长会话观察 token 消耗与预计窗口/预算余量；预算是提示而非硬限制。详见[Q01](#research-q01)。

> **亮点**：把实时用量注入模型、提供按模型榜单和 summary.json 跨插件接口。详见[Q01](#research-q01)。

> **思考**：billingDbPath 的校准只影响显示配置，未改变真实累计/预测；/qm-reset 不清投影，可能继续显示旧用量。详见[Q03](#research-q03)及[Q04](#research-q04)。

> **建议**：未实现的改进：统一价格来源、让 reset 进入投影语义、展示时明确数据刷新与今日重启边界。详见[Q05](#research-q05)。

<a id="plugin-1367305514-root"></a>

## [dsh-reasoning-tiers](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md)

[![npm 30d 1,017](https://img.shields.io/static/v1?label=npm+30d&message=1%2C017&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers)

> **用途**：维护DSH第三方pi-ai模型metadata缺口，需真实协议支持与可恢复配置。

> **亮点**：不接管adapter而补齐能力声明/选择器接线，尊重已有档位并显示来源，未证明模型推理增强。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：重试实际patch与原plan记录可能不同，revert失败仍消费remaining，journal缺profile身份；有undo不等所有失败可恢复。详见[Q02](#research-q02)。

> **建议**：可探讨profile/版本绑定实际写收据，commit返回最终写集，失败保留撤销依据；有迁移/恢复状态成本，未验证。详见[Q05](#research-q05)。

<a id="plugin-1336583700-root"></a>

## [dsh-recipe](../../plugins/863683348--dsh-recipe/INSIGHT.md)

[![npm 30d 123](https://img.shields.io/static/v1?label=npm+30d&message=123&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-recipe) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-recipe)

> **用途**：按业务场景整理多插件候选，减少逐个找目录。详见[Q01](#research-q01)。

> **亮点**：把固定场景清单接入模型工具，减少整理命令步骤。详见[Q01](#research-q01)。

> **思考**：config被输出剥离，合并不报冲突，命令缺profile/版本与失败恢复，不能等同可复现环境。详见[Q03](#research-q03)。

> **建议**：研究可解释版本/配置冲突计划与分步收据，相对首胜拼串比较误安装和恢复成本，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1384810201-root"></a>

## [dsh-remote-ssh](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh)

> **用途**：对配置好的旧系统主机执行诊断，前提是只读 SSH 账号与明确命令白名单。详见[Q01](#research-q01)。

> **亮点**：把跨平台旧主机诊断从 SSH CLI 接入 Agent 并附白名单与探测组。详见[Q01](#research-q01)。

> **思考**：远端命令参数解释和模型自填 confirm 不能替代安全 shell quoting/人工授权；只读依赖白名单与远端账号。详见[Q02](#research-q02)和[Q03](#research-q03)。

> **建议**：未实现改进为固定远端 wrapper、host key pinning 和真实批准通道。详见[Q05](#research-q05)。

<a id="plugin-1424433303-root"></a>

## [dsh-restart-dock](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md)



> **用途**：Windows DSH用户改完宿主插件后主动重载进程，或仅刷新客户端；交付窗口/宿主恢复状态，不承诺继续旧任务。

> **亮点**：相对找托盘/快捷方式重启，把客户端刷新与宿主重启明确拆成两个界面动作，并加入延迟、状态轮询与进程树报告。独立helper和Windows重拉为既有系统机制，增量是DSH入口及确定目标的恢复接线。

> **思考**：延迟倒计时能否保证当前任务安全落盘？代码只等待设定延迟并强停进程，没有宿主排空或会话提交确认；请求来源护栏也只是本地Web信任控制，不证明任何正在执行任务可中断。只实现Windows重启，helper在job/Explorer失败时可能降级；进程回来了仍不证明插件初始化和业务任务已恢复。

> **建议**：待验证假设：重启前让宿主报告活动任务和持久化屏障，并给用户明确“强制/等待”的选择，可减少延迟够了但会话仍写入的中断。依据是当前时间等待与状态轮询，未实现屏障。用持续日志写入、后台子进程和空闲三类对照，测丢失事件、恢复时间与取消有效性；屏障不可达时需明确强制语义。

<a id="plugin-1422176522-root"></a>

## [dsh-restart-planner](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md)



> **用途**：Agent安装或修改插件后需要无人值守重载，先返回安排，再由宿主外helper重启并留报告；原任务续接需要核对结果。

> **亮点**：相对Agent要求用户手动重启，贡献是把自重启拆为排程、独立交接和重拉体检，使调用方可先返回。自动续接参考dsh-restart思路，适配0.2的sessionController.prompt；进程管理能力来自系统，新增是DSH恢复生命周期与报告。

> **思考**：日志静默是否等于会话安全提交，续话是否恰好一次？静默是时间启发式，maxWait到期仍可动手；强杀不能保证最后写入。resume每次尝试生成新requestId，网络超时可能已接受，deliverResume会重试；成功后删标记失败又会再次投，因此“失败保留”不能宣称无重放。健康检查也不证明原任务业务恢复。

> **建议**：待验证假设：每个排程持久化唯一resume requestId，并在未知结果先查询原请求、获落盘屏障后才重启，可减少续话重复与末尾事件丢失。由当前随机ID重试和静默观察推导，未实现。用prompt已接受但响应丢失、标记删除失败、持续写日志三类对照，测重复turn、遗漏与等待；宿主不支持查询时应保留unknown请人核对。

<a id="plugin-1376777535-root"></a>

## [dsh-router-loomy](../../plugins/2404723600--dsh-router-loomy/INSIGHT.md)



> **用途**：已使用 dsh-router 的用户希望调用 Loomy 模型；需要有效客户端会话和上游可用。

> **亮点**：将客户端会话/追踪头和流式截断判据封装成 router 供应商。详见[Q02](#research-q02)。

> **思考**：截断触发整段重试会消耗积分，且状态昵称原样带 phone，README 脱敏示例与代码不一致。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：持久重试预算和敏感字段统一脱敏可降低积分与展示风险；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1336106328-root"></a>

## [dsh-skill-manager](../../plugins/aks1st--dsh-skill-manager/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-skill-manager) [![npm 30d 1,061](https://img.shields.io/static/v1?label=npm+30d&message=1%2C061&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-skill-manager) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-skill-manager)

> **用途**：维护用户或项目技能并识别只读系统/预设来源。

> **亮点**：把来源层级与文件可写性绑定，系统/预设只读，realpath校验避免路径逃逸；SKILL前置校验减少错误保存导致技能消失。

> **思考**：ZIP规范化时skillNameByEntry只记录SKILL.md或顶层md，提取循环对其他条目因未映射而continue，因此脚本/引用附件可能未导入，技能列表成功不等于资源包完整。写入也无版本冲突比较，前置格式校验不等于技能语义正确。

> **建议**：未验证假设：按顶层技能目录归属解包全部合法资源，并以manifest摘要做导出再导入一致性核查，可防“有Skill无脚本”。用含references/scripts、多技能与路径逃逸ZIP比较字节集合及拒绝行为。

<a id="plugin-1334434271-root"></a>

## [dsh-sysmon](../../plugins/aks1st--dsh-sysmon/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-sysmon)

> **用途**：在 Web 页面粗看运行 DSH 的 Linux 宿主资源，及时识别明显压力。

> **亮点**：将常规宿主指标集成到 DSH Web，分离采样和请求以避免访问放大进程启动。详见[Q02](#research-q02)。

> **思考**：采样失败/接口故障时旧读数无时间戳或过期提示，可能被当作实时状态；同源头检查不能替代宿主鉴权。详见[Q03](#research-q03)。

> **建议**：为快照补采样时间、主机身份及过期态，故障时明确灰显；用故障注入对照误认率和开销，尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1333368566-root"></a>

## [dsh-telemetry-redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) [![npm 30d 1,162](https://img.shields.io/static/v1?label=npm+30d&message=1%2C162&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor)

> **用途**：给已有遥测共享需求的维护者减少特定凭据进入后端的机会，验收同时核对副本过滤、canonical保留与计数器完整。

> **亮点**：在后端收到记录前统一处理出站副本，保留原始事件，并用结构键、计数器例外及键冲突拒绝补足纯正则过滤。贡献是宿主边界内的安全组合，不是新秘密识别算法。详见[Q02](#research-q02)。

> **思考**：局部过滤不能证明全局无泄漏，未知凭据、输入外配置、直接backend调用和更外层prepend均不受完全保护；fail-closed还依赖官方协调器只丢弃失败副本。以上为源码及作者边界，未独立复现。详见[Q02](#research-q02)。

> **建议**：可探讨只含聚合原因的隐私安全丢弃收据，让过滤异常可观察而不带出原秘密；需核对收据自身泄漏和新增开销，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1350325873-root"></a>

## [dsh-tool-budget](../../plugins/173787247--dsh-tool-budget/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget)

> **用途**：长任务操作者希望阻止不断更换工具的持续调用；合格结果需明确计数主体、越额拒绝和人工恢复。

> **亮点**：把按Agent累计次数规则接到工具执行前，并保留三个job管理工具的默认例外，能够约束更换名称或参数的持续调用；属于常规计数机制的宿主适配。详见[Q03](#research-q03)。

> **思考**：作者的会话预算实际以Agent对象为键，重载和新Agent不共享计数；工具次数也不约束现金与已启动后台工作。对象契约仍不明确，不能当作全局硬预算。详见[Q04](#research-q04)。

> **建议**：可探索稳定会话身份下的共享额度预留与恢复账本，先比较团队并发和重载后超额与误拒绝；当前未实现，也可能不值得额外复杂度。详见[Q08](#research-q08)。

<a id="plugin-1351594249-root"></a>

## [dsh-tool-explorer](../../plugins/6pofx--dsh-tool-explorer/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/6pofx/dsh-tool-explorer) [![npm 30d 655](https://img.shields.io/static/v1?label=npm+30d&message=655&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-tool-explorer) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-tool-explorer)

> **用途**：本机DSH管理员集中维护技能与MCP，需受信管理面和备份。详见[Q01](#research-q01)。

> **亮点**：将技能文件、共享lock/回收对象及MCP patch组织成可视管理交付，批选同仓一次下载省重复资源；承认作者所列社区参照。详见[Q01](#research-q01)。

> **思考**：技能改名只写MD后删旧目录，表单userInvocable键不等平台键，升级不保ref；Origin不等认证，多文件恢复不能靠HTTP成功判断。详见[Q04](#research-q04)。

> **建议**：服务端commit/完整目录摘要与必填版本绑定管理事务，整bundle改名、文件与lock/manifest可辨认提交，按漂移和失败反例检验，未验证。详见[Q08](#research-q08)。

<a id="plugin-1363291561-root"></a>

## [dsh-tts-flash](../../plugins/2021heei--dsh-tts-flash/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2021Heei/dsh-tts-flash)

> **用途**：桌面会话的听读辅助与等待反馈，适合可联网/可播放音频的本机环境。详见[Q01](#research-q01)。

> **亮点**：把桌面浮条、等待语音和可替换 TTS 引擎接入 DSH 文本流。详见[Q01](#research-q01)。

> **思考**：朗读音频不是完整覆盖；/engines 返回含 apiKey，探测把非401/403错误视可用，readJsonBody 异常分支引用未定义 res。详见[Q02](#research-q02)至[Q04](#research-q04)。

> **建议**：未验证改进为传播取消信号、引擎列表脱敏、成功码探测和统一同步/异步路由错误处理。详见[Q05](#research-q05)。

<a id="plugin-1343420855-root"></a>

## [dsh-ui-auth](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) [![npm 30d 1,561](https://img.shields.io/static/v1?label=npm+30d&message=1%2C561&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ui-auth)

> **用途**：多人共用DSH Web时需要登录与按对象授权，合格结果涵盖未登录拒绝、跨用户不可见和管理员可恢复访问。详见[Q01](#research-q01)。

> **亮点**：将账户主体、对象归属、端点/结果/流帧策略和用户模型配置接入原宿主，超出单纯外部登录门，但属于应用层组合而非系统级租户隔离。详见[Q01](#research-q01)。

> **思考**：多用户隔离是否覆盖所有传输面是核心前提，mux排障退避可直接转发；本轮也未核查全部端点和底层工具共享，不能以登录页或作者测试计数替代完整隔离结论。详见[Q03](#research-q03)。

> **建议**：可探讨固定宿主端点/流帧与策略语义覆盖映射，升级遇未知项先拒绝并报告，再用跨用户反例比较漏放、误拒和维护成本。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1333954586-root"></a>

## [dsh-usage-billing](../../plugins/940842546--dsh-usage-billing/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-usage-billing) [![npm 30d 1,231](https://img.shields.io/static/v1?label=npm+30d&message=1%2C231&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-billing) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-usage-billing)

> **用途**：自管DSH用户想按会话理解模型花费，合格结果是token来源、计价版本与官方账单可对齐，估算与实际扣费必须区分。

> **亮点**：相对只看单次token，增量是把历史、时间价格段、预算阈值和会话组织为持续消费视图。它是本地估算与观测，不是供应商账单或费用硬上限。

> **思考**：缺失价格或usage会不会显示得像免费？classifyModel仅用flash/pro子串，其余other；recordUsage找不到价格回落hit/miss/out全0，num也将非数值回为0。因此真实未知模型可能有调用但估费为0，不能据此结算或宣称免费。当前官方价格未在本轮独立核实，内置规则只能作为固定版本作者配置。

> **建议**：由可配置价格与未知归零推导，可将“已计价/未计价/usage缺失”分账，价格表绑定生效日期与来源，并用官方账单差额校准。未验证假设是减少被低估的预算决策。用未知模型、缺usage、调价跨界和缓存字段缺失事件对照账单，若仍把未知金额合入零则否定。

<a id="plugin-1334023305-root"></a>

## [dsh-usage-dashboard-plus](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus) [![npm 30d 1,036](https://img.shields.io/static/v1?label=npm+30d&message=1%2C036&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-dashboard-plus) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-usage-dashboard-plus)

> **用途**：个人用户查看会话内外调用趋势、余额和缓存表现。详见[Q01](#research-q01)。

> **亮点**：把外部视觉用量和原会话统计接到余额/消费看板。详见[Q01](#research-q01)。

> **思考**：明文session.jsonl被仅zstd解码成空，cacheWrite侧栏按input而投影按output，未知价仍套默认金额。详见[Q03](#research-q03)。

> **建议**：研究统一版本化计量核、明确格式/覆盖/去重回执与账户cache，比较漏计/金额差。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1377159975-root"></a>

## [dsh-vps](../../plugins/aicivilization--dsh-vps/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-vps)

> **用途**：有 Linux VPS 且需要公网浏览器访问 DSH 完整管理界面的个人/小团队。

> **亮点**：把公网 DSH 部署、登录代理、受信任会话转译和服务器管理打包成连续流程；相对手工反代、认证、systemd 拼装有交付便利，具体增量与未验收边界见[Q01](#research-q01)及[Q02](#research-q02)。

> **思考**：辅助文件默认main漂移，setup.lock未建立且令牌缺失/不可读时向导退回开放；卸载tar失败但部分备份仍可chmod成功时可能继续删除，不保证备份可恢复。均为有条件静态核查，未作公网攻击或删除复现。详见[Q03](#research-q03)。

> **建议**：基于网关交付增量和令牌/供应链/备份反例，提出未验证的可验证部署清单、封闭首次注册和恢复闸门组合；相对现版增加哈希钉住及失败拒绝，也增加维护和救援负担。故障注入对照与否定条件见[Q05](#research-q05)。

<a id="plugin-1334255288-root"></a>

## [dsh-web-lan-access](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md)

[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access)

> **用途**：从局域网/Tailscale/VPN 其它设备访问 DSH Web 与 Host-backed 设置。

> **亮点**：把多接口远程 GUI/Host 设置可用性集合为一个 bundle，减少逐接口配置；同时扩大暴露面。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：插件有意绕过上游 wildcard 禁止，0.0.0.0 监听所有可达接口，自动信任非 internal IPv4；Host 栅栏不是身份认证。详见[Q03](#research-q03)。

> **建议**：限制为显式单接口或审核后的接口白名单，并与防火墙/认证验证绑定，比较可用性与实际暴露面；本版未实现。详见[Q04](#research-q04)。

<a id="plugin-1335060007-root"></a>

## [dsh-web-restart](../../plugins/1123762794--dsh-web-restart/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart)

> **用途**：作者 Windows Web profile 的维护操作；单击会中断 DSH 服务，脚本路径必须按机器改。详见[Q01](#research-q01)。

> **亮点**：将重启入口与在线状态点放进 DSH Web 侧栏；用户可从界面触发作者环境的维护动作。详见[Q01](#research-q01)。

> **思考**：已触发 UI 不代表重启成功，路由只有方法/重入检查；全权限外部脚本和单击中断需核外层授权。详见[Q03](#research-q03)与[Q04](#research-q04)。

> **建议**：未验证改进为受控脚本路径、管理员授权/确认、异步 job 回执和恢复验收；先在隔离环境实测。详见[Q05](#research-q05)。

<a id="plugin-1363511446-root"></a>

## [dsh-workspace-tools](../../plugins/ahiosuz--dsh-workspace-tools/INSIGHT.md)



> **用途**：多个工作区有不同默认 Agent/权限要求，减少新会话重复选择。详见[Q01](#research-q01)。

> **亮点**：在官方扩展点上提供工作区级默认规则与设置 UI，避免每次新建根会话手动重选。详见[Q01](#research-q01)。

> **思考**：权限可能在异步 Agent 预设选择之后才更新，首 turn 时序未知；旧/大小写路径回退可能误匹配。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进是创建时等待应用、区分 OS 路径语义、隔离已删除工作区规则并明确保存冲突提示。详见[Q05](#research-q05)。

<a id="plugin-1351854066-root"></a>

## [dsh-wsl-clock](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clock)

> **用途**：WSL 笔记本休眠后 TLS/JWT 失败时查看两侧时钟差。

> **亮点**：把 WSL/Windows 双时钟排查封装为只读模型工具，并提示睡眠后使用；实现简单，适合故障定位而非自动修复。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：顺序采样的耗时会误记为时钟偏移，空输出经 Number 转换为 0 也未识别为无效时间；应避免将一次读数当成精确诊断。详见[Q03](#research-q03)。

> **建议**：可探索前后WSL时刻中点/RTT及Windows时间有效性检查；仅在采样窗时钟线性且未中途校时等条件下讨论，成本/误警反例见[Q05](#research-q05)，未实现。

<a id="plugin-1381842592-root"></a>

## [dsh-wsl-compose](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose)

> **用途**：可信项目目录中的 Docker Compose 初筛与受控变更；生产操作需宿主审批。详见[Q01](#research-q01)。

> **亮点**：把 Compose 诊断与基本启动/停止接入 DSH 工具，并默认关闭变更。详见[Q01](#research-q01)。

> **思考**：双布尔条件不等于人工二次确认，开启变更且空 allowRoots 时可触及任意项目；超时需核实际 daemon 状态。详见[Q03](#research-q03)与[Q04](#research-q04)。

> **建议**：未验证改进为强制目录根、宿主用户审批、stderr 流界及超时返回待复核状态。详见[Q05](#research-q05)。

<a id="plugin-1381859591-root"></a>

## [dsh-wsl-db](../../plugins/173787247--dsh-wsl-db/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db)

> **用途**：开发者在受信 WSL 测试数据库做连通性与有限读取排障。详见[Q01](#research-q01)。

> **亮点**：将常见 PostgreSQL/Redis 排障入口统一为 Agent 工具，默认限制连接 URL/Redis host。详见[Q01](#research-q01)。

> **思考**：SQL SELECT/EXPLAIN 仍可触发副作用，连接 URI 进入 psql argv；输出截断不限制 DB 端资源。详见[Q03](#research-q03)与[Q04](#research-q04)。

> **建议**：未验证改进为角色级只读、禁高成本 Redis 命令、凭据保护和探测分项状态明确化。详见[Q05](#research-q05)。

<a id="plugin-1391141174-root"></a>

## [dsh-wsl-defender](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-defender)

> **用途**：开发者排查Windows环境状态时需要把系统安全配置带入会话，合格结果是可核对的当前状态而非安全认证。

> **亮点**：defender-exec.js经PowerShell调用Get-MpComputerStatus等只读命令，defender.js规范化结果并将杀毒数据缺失显示为不可用。

> **思考**：合并多个状态命令方便排障；快照不能代替持续防护，也不把没有返回数据当作已确认无威胁。

> **建议**：作为状态收集工具使用，对关键异常回到Windows安全中心核对；遇到unavailable先查权限和安全产品。

<a id="plugin-1351854301-root"></a>

## [dsh-wsl-docker](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker)

> **用途**：Docker Desktop/WSL/推理容器混淆时做初筛，实际context/端点/模型就绪另核。

> **亮点**：集中Docker上下文与推理线索减少手工接线，不是GPU或API完整验收。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：404也health ok且遮蔽专门错误提示，空DeviceRequests可判GPU，内部8000暴露/远程context与固定本机探测错配。详见[Q02](#research-q02)。

> **建议**：可探讨context/映射结构解析与daemon/设备/HTTP协议分级收据、总deadline，反例仍假绿灯则证伪实现。详见[Q05](#research-q05)。

<a id="plugin-1338530482-root"></a>

## [dsh-wsl-env](../../plugins/173787247--dsh-wsl-env/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-env)

> **用途**：浏览器在Windows、工具跑WSL的混合工作流。详见[Q01](#research-q01)。

> **亮点**：把局部环境事实和常见WSL指导自动填入模型背景。详见[Q01](#research-q01)。

> **思考**：固定/mnt/c和always强制可误述环境，排障工具未核存在，工作区提示不等隔离。详见[Q03](#research-q03)。

> **建议**：分离事实与可选建议，实测挂载/工具存在并比较错误路径率和提示成本，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1391143266-root"></a>

## [dsh-wsl-eventlog](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-eventlog)

> **用途**：WSL 用户初筛 Windows System/Application 等日志的严重事件；非完整审计。详见[Q01](#research-q01)。

> **亮点**：把 Windows 事件日志的初步查询暴露给 WSL 中的 Agent，参数和结果结构较简洁。详见[Q01](#research-q01)。

> **思考**：后置过滤的空结果不能证明无事件；full 的实际呈现长度与执行层不一致。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进为源端过滤、分页/总量、full 渲染对齐和敏感字段控制。详见[Q05](#research-q05)。

<a id="plugin-1351853956-root"></a>

## [dsh-wsl-expose](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-expose) [![npm 30d 674](https://img.shields.io/static/v1?label=npm+30d&message=674&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-expose) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wsl-expose)

> **用途**：从 Windows/LAN 访问 WSL 内服务；本机 dsh UI 建议使用套件 relay。

> **亮点**：把 WSL 网络模式、建议命令与 portproxy 操作集中到工具，详见[Q01](#research-q01)。

> **思考**：安全说明的 allowApply/端口白名单未在执行路径强制，默认全接口监听；详见[Q02](#research-q02)。

> **建议**：将写操作绑定管理配置许可、明确端口/地址并回读规则，反证与回退代价见[Q05](#research-q05)。

<a id="plugin-1362694736-root"></a>

## [dsh-wsl-fetch](../../plugins/173787247--dsh-wsl-fetch/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-fetch)

> **用途**：WSL 中官方 web_fetch 直连失败而 Windows HTTP 代理可用的公开网页抓取。详见[Q01](#research-q01)。

> **亮点**：将代理放入官方 web_fetch 进程内调用链，并在无代理/已有其他 provider 时避免强行覆盖。详见[Q01](#research-q01)。

> **思考**：公有域名解析到私网的路径不受此插件代码校验，普通 sleep 不响应 deadline；宿主与代理外层控制未知。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进是代理最终目的地约束、可中止退避、配置上限和受控站点效果测量。详见[Q05](#research-q05)。

<a id="plugin-1350378777-root"></a>

## [dsh-wsl-gpu](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-gpu)

> **用途**：本地NVIDIA推理前排查设备可见性/显存与监听服务。详见[Q01](#research-q01)。

> **亮点**：把设备和端口线索放在同一报告，减少手工收集。详见[Q01](#research-q01)。

> **思考**：仅loopback探测可能漏Windows NAT，端口标签/争用及固定CUDA建议是启发，整体超时未向子任务传递。详见[Q03](#research-q03)。

> **建议**：研究分层证据/协议及GPU归属与总预算取消，比较误诊和排障时间，未验证。详见[Q05](#research-q05)。

<a id="plugin-1381843528-root"></a>

## [dsh-wsl-helm](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-helm)

> **用途**：用于 Kubernetes 发布排查前的只读查询；合格输出须明确集群与命名空间，不能代替健康判断。详见[Q01](#research-q01)。

> **亮点**：把 Helm CLI 的常用只读操作封装成 Agent 工具，控制动词并标识输出截断；增量是调用边界与呈现，发布语义仍属 Helm。详见[Q01](#research-q01)。

> **思考**：guardContext 对空值直接放行，配置白名单不约束 Helm 默认上下文；此外 stderr 只在返回时裁剪而非累计限量。不能把“只读”误解为目标正确或无敏感信息。详见[Q03](#research-q03)。

> **建议**：未验证方向是每次解析实际 context 并统一按白名单检查、回显目标，同时限制 stderr 累计；双集群和高输出夹具评估正确率、延迟与内存。详见[Q05](#research-q05)。

<a id="plugin-1351854010-root"></a>

## [dsh-wsl-hostsvc](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-hostsvc)

> **用途**：帮助在WSL连接Windows本地模型的开发者集中排查IP、端口和API问题，交付诊断线索与配置草稿而非自动修复。

> **亮点**：把WSL宿主发现、常见服务探测、HTTP模型状态和配置草稿合在DSH工具中，较手工nc/curl减少切换，并区分TCP开放与models API状态。集成价值不等于新探测算法。详见[Q02](#research-q02)。

> **思考**：主ok、建议URL和模板仍可由TCP开放触发，apiReady不代表生成可用；固定模板容量、元数据回退和未传播取消信号限制诊断可信度，均为静态判断未复现。详见[Q02](#research-q02)和[Q04](#research-q04)。

> **建议**：可探索分层诊断收据，仅按已完成的TCP、API、认证和授权生成检查给相应强度建议，并统一预算和取消；新增请求与GPU负担，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1381832318-root"></a>

## [dsh-wsl-llamacpp](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-llamacpp)

> **用途**：已有 GGUF/llama.cpp 服务时将个别辅助请求交给本地模型。详见[Q01](#research-q01)。

> **亮点**：降低 Agent 调用本地 OpenAI 兼容 GGUF 服务的接线成本。详见[Q01](#research-q01)。

> **思考**：健康 ok:true 与可达性分离、状态超时不一致，最大 prompt 限制只对单 prompt 生效。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进为一致健康语义、输入/输出边界和本机 URL 限制。详见[Q05](#research-q05)。

<a id="plugin-1381860693-root"></a>

## [dsh-wsl-mail](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-mail)

> **用途**：本机邮件客户端已配置时做只读收件箱初筛；不读完整正文或发送邮件。详见[Q01](#research-q01)。

> **亮点**：把本机邮件元数据和索引摘要以只读工具给 Agent，降低命令行检索步骤。详见[Q01](#research-q01)。

> **思考**：notmuch 缺失时“未读”计数实际为近期信封数；长 JSON 输出截断后仍可能以 ok:true 文本呈现。详见[Q02](#research-q02)与[Q03](#research-q03)。

> **建议**：未验证改进为返回 countKind/索引时间、严格标示截断并限制 stderr 内存。详见[Q05](#research-q05)。

<a id="plugin-1351854159-root"></a>

## [dsh-wsl-mnt](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-mnt)

> **用途**：WSL 中 git/npm 在 Windows 挂载路径可能偏慢时的初步排查。

> **亮点**：把常见 WSL 工作区位置问题变成模型可调用的路径提醒，减少人工定位。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：所有 /mnt 路径统一判为不佳、非 /mnt 判为 ok，未核文件系统/符号链接或测速；建议路径可能与现有项目冲突。详见[Q03](#research-q03)。

> **建议**：结合 realpath、mountinfo、目标冲突预检及同机工作负载基准，使迁移建议由当前机器证据支持；本版未实现。详见[Q04](#research-q04)。

<a id="plugin-1381724774-root"></a>

## [dsh-wsl-ollama](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ollama)

> **用途**：已有 Ollama 模型的本机/WSL 辅助调用；不是 DSH 主模型提供器。详见[Q01](#research-q01)。

> **亮点**：简化 Agent 对本地 Ollama 模型的自查、聊天与向量获取。详见[Q01](#research-q01)。

> **思考**：只看 status.ok 会误判连通；maxPromptChars 不限制 messages 分支，且 baseUrl 并非保证本地。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进为统一 reachable/ok、传播取消、限所有消息/向量长度及展示地址边界。详见[Q05](#research-q05)。

<a id="plugin-1391142601-root"></a>

## [dsh-wsl-perf](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-perf)

> **用途**：Windows 宿主低频性能初筛，需与任务管理器对照。详见[Q01](#research-q01)。

> **亮点**：把 Windows 宿主多个指标一次聚合给 WSL 中的 Agent。详见[Q01](#research-q01)。

> **思考**：缺失数据归零与单次 CPU/进程 CPU 混用会误导瓶颈归因；top 只限输出不限制枚举。详见[Q02](#research-q02)至[Q04](#research-q04)。

> **建议**：未验证改进为每字段状态、采样时间和进程 CPU 差分。详见[Q05](#research-q05)。

<a id="plugin-1351853863-root"></a>

## [dsh-wsl-picker](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-picker)

> **用途**：WSL 用户在 /、/mnt 和 IM 工作区快捷入口中定位目录；并不登记工作区。详见[Q01](#research-q01)。

> **亮点**：将 WSL/Windows 路径浏览和 IM 快捷入口暴露给 Agent，结果结构含 parent/chips/truncated。详见[Q01](#research-q01)。

> **思考**：任意绝对路径和软链接可遍历目录名称；15 秒工具超时对同步文件系统调用的约束未经验证。详见[Q03](#research-q03)与[Q04](#research-q04)。

> **建议**：未验证方向为可配置浏览根、敏感路径策略、分页与异步限时枚举；先测大目录和宿主权限。详见[Q05](#research-q05)。

<a id="plugin-1350378913-root"></a>

## [dsh-wsl-port](../../plugins/173787247--dsh-wsl-port/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-port)

> **用途**：Windows访问WSL失败时做本地只读初筛，端到端/认证另核。

> **亮点**：把常见命令/套件指引集中，减少接线，但不是进程归属或Windows端到端健康检查。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：整表端口子串可混IPv6地址，未解析绑定地址/PID或探Windows；IP失败静默、静态relay指引未核部署。详见[Q02](#research-q02)。

> **建议**：可探讨精确端点与WSL/Windows/relay/HTTP认证分段收据，unknown保留且绑定kit版本，维护成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1391140034-root"></a>

## [dsh-wsl-power](../../plugins/173787247--dsh-wsl-power/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-power)

> **用途**：WSL Agent 对本机 Windows 电源状态做初步诊断。详见[Q01](#research-q01)。

> **亮点**：以单工具聚合多个 Windows 电源状态指标。详见[Q01](#research-q01)。

> **思考**：英语字符串解析、休眠关键词匹配与数值失败归零可能把未知当事实。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进是改用稳定结构化 API/GUID、保留每字段错误状态。详见[Q05](#research-q05)。

<a id="plugin-1381859181-root"></a>

## [dsh-wsl-rclone](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-rclone)

> **用途**：已有 rclone remote 时辅助查看云端目录与用量，适合只读诊断。详见[Q01](#research-q01)。

> **亮点**：把现有 rclone 配置的只读观察能力接入 Agent。详见[Q01](#research-q01)。

> **思考**：允许列表默认开放、lsf 先递归后切片可能带来远端访问与计费；健康 ok:true 易误判。详见[Q02](#research-q02)至[Q04](#research-q04)。

> **建议**：未实现的改进为默认拒绝远程、显式阻断动态 backend、真实上游分页/限额与健康语义。详见[Q05](#research-q05)。

<a id="plugin-1391142974-root"></a>

## [dsh-wsl-registry](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-registry)

> **用途**：在 WSL 里运行 DSH、需核 Windows 软件或系统键值的诊断用户。

> **亮点**：把 WSL 到 Windows PowerShell 的注册表读取封装为模型工具，提供常用前缀与 Run 段筛选；底层读取仍由 Windows 命令和 ACL 完成。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：路径白名单只用 startsWith，无段边界；具名值不受作者所称400字符裁剪。通配符/权限影响未实测，不把静态缺口说成已读取禁区。详见[Q03](#research-q03)。

> **建议**：可用规范化 Hive/段边界及统一值裁剪，并在隔离测试键上比较前缀碰撞、通配符、合法路径与长值的拒绝/保留；当前未实现。详见[Q04](#research-q04)。

<a id="plugin-1381733290-root"></a>

## [dsh-wsl-secret](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-secret)

> **用途**：WSL/Linux 用户用已有 pass/age 密钥驱动同一 DSH 进程的其他工具，需避免聊天暴露与跨插件扩散。

> **亮点**：把已有 pass/age 操作接入 DSH 工具并提供默认拒读和 to_env 流程；底层加密仍由外部工具承担。详见[Q02](#research-q02)。

> **思考**：to_env 将明文放进整个进程环境，预览泄露首尾字符/长度；age 路径仅词法前缀判断、reveal 可给原始 value，不能当跨插件隔离。详见[Q03](#research-q03)。

> **建议**：短时工具级句柄结合 realpath 路径复核可能缩小明文可见范围和符号链接越界；需假密钥双插件对照，尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1391140376-root"></a>

## [dsh-wsl-service](../../plugins/173787247--dsh-wsl-service/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-service)

> **用途**：开发者跨 WSL/Windows 排查服务运行状态和启动方式；不负责启停。详见[Q01](#research-q01)。

> **亮点**：把 Windows 服务元数据带进 WSL Agent 对话，省手工跨系统查询。详见[Q01](#research-q01)。

> **思考**：详情包含系统账户/路径，权限由宿主决定；全量枚举可能在服务多时变慢。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进为按名服务端查询、分页/时间戳和敏感字段按需返回。详见[Q05](#research-q05)。

<a id="plugin-1381832935-root"></a>

## [dsh-wsl-struct](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct)

> **用途**：在明确授权数据上重复进行结构化查询，需正确结果和实际进程边界。

> **亮点**：将参数化CLI、主路径realpath、SQLite readonly和错误输出接到DSH，算法与表达式能力来自上游。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：主路径谓词在POSIX接受反斜杠前缀可误认兄弟目录，也不限制CLI全部能力；raw spawn无宿主沙箱且默认HOME/tmp过宽；which/取消/输出资源边界也不完整。详见[Q02](#research-q02)。

> **建议**：可探讨固定CLI的最小进程能力查询，接宿主policy/abort、环境/表达式与输出预算；兼容维护成本未验证。详见[Q04](#research-q04)。

<a id="plugin-1381843201-root"></a>

## [dsh-wsl-systemd](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-systemd)

> **用途**：适合DSH宿主处在目标Linux/WSL用户会话、需要查看Ollama/自托管API等用户服务的状态和近期日志的维护者。基线手工执行systemctl --user与journalctl --user，再把结果交给模型；插件提供可调用的固定读操作与结构化/文本回执，不启动/停止/enable服务。

> **亮点**：把用户systemd手工list/show/journal整合为五入口四操作，提供单位约束、固定argv与结构化观察回执；不提供修复。详见[Q02](#research-q02)。

> **思考**：发现命令which没有error/timeout，执行取消未贯穿；stderr无界、成功render隐藏truncated，日志只读仍可能披露秘密。详见[Q03](#research-q03)。

> **建议**：可探索贯穿发现/执行deadline、双流预算和显式截断/阶段回执，以假执行器对照终止和信息保留；未实现。详见[Q05](#research-q05)。

<a id="plugin-1381843937-root"></a>

## [dsh-wsl-terraform](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-terraform)

> **用途**：面向已有初始化Terraform/OpenTofu项目的开发/运维人员，在DSH查CLI版本、validate、变更计数摘要和state资源地址列表。适合先了解拟变更数量、验证配置与资源范围，不提供apply/destroy接口，不取代完整plan评审、云权限和变更审批。

> **亮点**：把固定validate/plan/state命令与参数化目录、计数/错误结果接入DSH，限制模型可选IaC动作。详见[Q02](#research-q02)。

> **思考**：plan仅exit1拒绝，其他exit/null可ok:true；先截stdout可能丢Plan尾行，state500条截断未标，render隐藏部分状态。allowRoots默认空无限制且继承Host环境，不等价沙箱。详见[Q03](#research-q03)。

> **建议**：可探索仅exit0/2成功、完整原件hash/摘要来源、state完整性收据和最小env/signal/单目录串行，比较误判与资源成本；未实现。详见[Q06](#research-q06)。

<a id="plugin-1351853903-root"></a>

## [dsh-wsl-tray-launcher](../../plugins/173787247--dsh-wsl-tray/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tray)

> **用途**：在WSL运行DSH且想从Windows桌面启动和诊断的维护者。

> **亮点**：集中发行版、UNC、PowerShell/BOM和token URL互操作接线，核心启动与运行依赖kit/AHK而非本插件实现。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：fallback使用未导入readdirSync，Bash路径引用、并发/取消与顺序超时存在静态边界，shortcut失败仍可ok:true；token来源只简单匹配。详见[Q02](#research-q02)。

> **建议**：可探讨生成物与启动收据，绑定kit/脚本版本、串行可恢复写入并逐步报告；有跨系统状态和隐私成本，未验证。详见[Q04](#research-q04)。

<a id="plugin-1381832640-root"></a>

## [dsh-wsl-vllm](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-vllm)

> **用途**：已有 vLLM 的 WSL 开发者让 Agent 按需查询模型并调用本地聊天补全。详见[Q01](#research-q01)。

> **亮点**：为现有 vLLM 提供轻量按需工具，包含状态探测和补全返回 usage。详见[Q01](#research-q01)。

> **思考**：总输入不受 maxPromptChars 保证，reachable:false 仍 ok:true；服务资源和取消语义未知。详见[Q03](#research-q03)与[Q04](#research-q04)。

> **建议**：未验证改进为组合消息总上限、宿主取消信号传递和状态超时一致化。详见[Q05](#research-q05)。

<a id="plugin-1391143632-root"></a>

## [dsh-wsl-winctl](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-winctl)

> **用途**：可交互 Windows 桌面的窗口管理辅助；变更前需明确唯一目标。详见[Q01](#research-q01)。

> **亮点**：把 Windows 窗口枚举和基础控制封装为 WSL Agent 工具。详见[Q01](#research-q01)。

> **思考**：作者显式目标承诺与空目标首窗选择不符；activate/close 等返回值被忽略，成功状态不可直接信。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进为强制目标唯一、标题字面匹配、实际焦点调用及事后状态确认。详见[Q05](#research-q05)。

<a id="plugin-1391140767-root"></a>

## [dsh-wsl-winshot](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-winshot)

> **用途**：可见 Windows 桌面窗口的取图辅助；非无头或完整窗口内容保证。详见[Q01](#research-q01)。

> **亮点**：把 Windows 指定窗口画面转为 WSL PNG，支持元素名/坐标裁剪。详见[Q01](#research-q01)。

> **思考**：CopyFromScreen 捕获屏幕可见像素并恢复最小化窗口；临时图位于 Public 且异常未保证清理，Agent 输出仅是文本路径。详见[Q02](#research-q02)至[Q04](#research-q04)。

> **建议**：未验证改进为句柄选择、遮挡无关捕获、finally 清理与私有目录/受控图片展示。详见[Q05](#research-q05)。

<a id="plugin-1351854461-root"></a>

## [dsh-wsl-wslconfig](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wslconfig)

> **用途**：Windows与WSL网络/资源配置初步排查。详见[Q01](#research-q01)。

> **亮点**：把找配置和常见提示接入单工具，减少手工整理。详见[Q01](#research-q01)。

> **思考**：猜测/Public文件未必生效配置，后2000字符不参与解析，读取失败仍ok并按空模式建议。详见[Q03](#research-q03)。

> **建议**：研究来源/读取诊断及声明-加载-连通分层，比较误诊和原文外发量，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1406500233-root"></a>

## [dsh-zspace](../../plugins/439436269-ctrl--dsh-zspace/INSIGHT.md)

[![npm 30d 1,242](https://img.shields.io/static/v1?label=npm+30d&message=1%2C242&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-zspace) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-zspace)

> **用途**：已有极空间NAS的用户在本地或远程网络用会话管理文件与诊断容器；交付是核实后的文件状态和设备状态。

> **亮点**：相对手工NAS界面或单WebDAV连接，将跨网络桌面中转与局域网直连封装为同一模型工具面；容器健康用真实进程列表区别于表面running，避免把探针没运行解释为健康。

> **思考**：自动回退对读取和写入并不等价。router将remove/move/copy/upload等均路由，WebDAV请求已生效但响应超时仍可能在relay重试，存在结果未知后重复副作用；两通道删除回收站语义也不同。confirm=true是参数条件，不能代替用户意图确认或幂等保证。

> **建议**：先用只读列表、stat及测试文件评估；重要写入和删除固定通道并核对结果，网络失败后确认实际状态再重试。

<a id="plugin-1364766828-root"></a>

## [feishu-dsh-plugin](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2286893544/feishu-dsh-plugin)

> **用途**：企业自建飞书应用下的 Agent 读取与编辑协作资产；需 scopes 和对象授权。详见[Q01](#research-q01)。

> **亮点**：把多种飞书资源统一为 Agent 工具，含创建 wiki 文档与人类接管授权路径。详见[Q01](#research-q01)。

> **思考**：创建成功不保证 grantOpenId 已获 full_access；图片 URL/本地路径缺约束，写操作需明确用户授权。详见[Q03](#research-q03)与[Q04](#research-q04)。

> **建议**：未验证改进为创建/授权事务化状态、图片 allowlist/限量、写操作幂等与连接路由鉴权加强。详见[Q05](#research-q05)。

<a id="plugin-1363429979-plugin-usage-billing"></a>

## [plugin-usage-billing](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,814](https://img.shields.io/static/v1?label=npm+30d&message=1%2C814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing)

> **用途**：维护者核对模型用量和费用估算，要求计量、提供商价格、历史与unknown可解释。

> **亮点**：把usage、价格快照、历史估算与unknown分开并提供分维度视图，增量在可解释聚合而非生成真实provider账单。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：峰谷倍率无provider限定、同名价可跨provider兜底，当前alias重折可覆盖旧ID费用；写时锁价不等所有配置变化下历史不可变。详见[Q02](#research-q02)。

> **建议**：可探讨provider计价契约和锁价收据，绑定usage schema/规则/FX，旧行普通重折保留，重估明确修订；维护和迁移成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1333357514-root"></a>

## [Qiushi DSH Evidence Audit](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit) [![npm 30d 1,173](https://img.shields.io/static/v1?label=npm+30d&message=1%2C173&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)

> **用途**：需要排查执行记录是否缺失或被改动的本地部署者，关注观察链的一致性。

> **亮点**：工具结果和事件被规范化、哈希化，再以 previousRecordHash 连接到追加记录。

> **思考**：不记录参数明文可减少隐私暴露，但也限制事后解释；不能把不可读哈希当成充分审计证据。

> **建议**：用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。

<a id="plugin-1368192539-root"></a>

## [zcode-usage-stats](../../plugins/amer-cn--zcode-usage-stats/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Amer-CN/zcode-usage-stats) [![npm 30d 157](https://img.shields.io/static/v1?label=npm+30d&message=157&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/zcode-usage-stats) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/zcode-usage-stats)

> **用途**：个人/团队操作者查看模型消耗与活跃日，发现高用量时期；非账单结算。详见[Q01](#research-q01)。

> **亮点**：把历史 Token 分布按时间和模型本地可视化，并对路由显式调用宿主信任栅栏。详见[Q01](#research-q01)。

> **思考**：“全历史”扫描遇 deadline 可能只包含部分会话且仍 ok:true，总 sessionCount 未区分已处理数；费用与字段相加口径需核。详见[Q03](#research-q03)。

> **建议**：未验证改进是部分统计显著标记、扫描完成数/中止、缓存 schema 指纹和账单对照。详见[Q05](#research-q05)。

<a id="plugin-1416699252-root"></a>

## [元冰可 AI 资源治理平台](../../plugins/01men--ybkkasi/INSIGHT.md)



> **用途**：已有多部门AI资源的管理员需要统一资源责任、授权与审计，交付受控访问和治理记录；单用户可先用配置文件加API网关。

> **亮点**：相对业务路由重复鉴权样板，增量是将principal、权限点、路由声明和审计主体统一到rest-gate接口，并在bootAll恢复存储后做装配健康检查。Cordis依赖树与通用RBAC归既有方法，插件贡献是企业AI资源治理接线与责任归属，不是由模块规模推导创新。

> **思考**：共享gate是否证明所有入口受同一治理？console是principal构造点，bootAll也明确portal公开只读先于console，部分public path内部自校验；只审gate不能推断全入口覆盖。IMPLIED_POINTS在前端有镜像，声明与真实写副作用可能漂移；审计record调用也不等于事务已持久化，需故障恢复和越权反例。

> **建议**：待验证假设：从routeMatrix生成主体×权限×副作用清单，再与实际存储写入/公开入口逐一比对，可更早发现漏接治理。由注册声明集中但覆盖尚未完整验证推导，未实现自动覆盖证明。选两个部门及一条MCP业务链，测试许可、拒绝、public例外、令牌吊销与审计写失败；若越权写入或无审计变更存在则否定治理闭环，维护映射人时应单列。

<a id="plugin-1415863200-root"></a>

## [模型接力](../../plugins/airisey--dsh-model-failover/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Airisey/dsh-model-failover)

> **用途**：已有多模型渠道的用户希望额度/上游故障时继续任务；合格交付是任务正确完成，而不是某个模型开始输出。

> **亮点**：相较盲目重试整条请求，明确“已提交内容”的边界，避免在模型开始产出后静默换人；分开候选故障和整轮截断，隔离按会话/模板而非全局误伤。贡献是失败恢复取舍与宿主集成，不能把字节产出当任务完成。

> **思考**：自动“继续”是否仍是用户授权的同一任务？轮级hook对全部DSH模型生效，构造source.kind=user，看起来与人亲发相同；一次错误可能发生在已有工具副作用后，重启一轮并不具任务幂等。adapter将非空text/tool delta当提交能减少混流，却不能证明答案合格；隔离跨日清空也不代表凭证/配额已恢复。

> **建议**：把续轮标成插件来源并绑定原turn、错误种类与已完成工具副作用账本，要求未知副作用先查结果而非重发，可能减少重复执行和授权混淆。对工具已成功但响应丢失、纯文本截断、用户停止和用户新输入对照，测重复动作与不当续轮率；若只多发继续且无副作用状态，则不能称业务恢复。

## 更新时间

2026-10-22
