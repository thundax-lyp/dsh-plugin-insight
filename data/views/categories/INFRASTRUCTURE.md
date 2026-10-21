# 基础设施

[返回首页](../../../README.md)

模型接入、认证、运行环境与系统支撑。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [ANet DSH 适配组件](#plugin-1302597978-deploy-plugins-dist-dsh) | 以 Skill 与 MCP 启动器将 DSH 接到本地 ANet 节点。 | 已有受信ANet场景者可把它当连接器评估；没有节点/身份或无法确认外部能力边界时，不据此推荐发送业务数据或支付。 |
| [chicheng-gate](#plugin-1334862230-root) | 在 DSH Web 管理远程访问、frpc 隧道、面板密码门禁与移动端界面。 | 仅适合了解DSH远程控制范围、能维护网络的人在隔离环境先检查；先设置密码，验证HTTP和WebSocket都被挡住，再考虑外网，并单独确认加密传输及升级后的补丁恢复。 |
| [chicheng-stats](#plugin-1335725068-root) | 在 DSH 汇总请求用量、展示趋势和模型明细，并支持历史会话扫描。 | 想查看DSH资源分布的人可先对一个已知会话核对请求数和token；Desktop先确认是否有历史回填，平台余额和本地统计分开看，不用它直接结算费用。 |
| [dock](#plugin-1340492184-root) | 向扩展提供活动栏、浮窗、编辑视图、状态和设置注册服务的客户端工作台。 | 先与少量扩展验证打开、关闭和重载；将布局持久化与文件保存分别验收。 |
| [DSH Telemetry Redactor](#plugin-1333368566-root) | 在遥测记录瀑布中递归脱敏支持的凭据模式，保留原始会话日志。 | 先在测试遥测里放入假密钥、普通文本和 token 计量字段，核对脱敏与保真后再接后端。 |
| [dsh-agent-recycle-guard](#plugin-1414323673-root) | 检查DSH的Shell工具调用，将识别到的删除改写为回收站操作，无法安全处理时拒绝。 | 在可丢弃目录验证平台真实回收和恢复后采用。 |
| [dsh-anatomy-panel](#plugin-1366089972-workspace-plugins-dsh-anatomy-panel) | 读取Agent-Body运行时文件，在宿主HTTP路由展示器官体征、心跳、愈合账本与脉冲。 | 先限制在本地受控宿主使用，检查缺失数据能否报503，并核对脉冲文本的展示边界后再接入多人环境。 |
| [dsh-api-dashboard](#plugin-1346196699-root) | 在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。 | 先选择实际可查询的平台，对照控制台账单和混合币种；把看板作为预警与估算入口，自更新前保留配置和回退。 |
| [dsh-armor-switch](#plugin-1409096911-root) | 提供运行时提示契约切换及可选的宿主、Profile文案维护和恢复操作。 | 只建议在可恢复的独立Profile中检查机制。 |
| [dsh-armory](#plugin-1413052822-root) | 在 DSH 中管理 MCP、技能、专家、插件市场及工具账本，支持项目作用域与授权引导。 | 已有多个MCP时在独立项目试用导入和作用域隔离，核对实际工具与来源登记；OAuth与市场安装新增路径需单独验收，不依据零调用账本批量停用工具。 |
| [dsh-capability-index](#plugin-1335594781-root) | 扫描已启用工具，结合规则与语义召回向Agent上下文提示可能适用的插件能力。 | 更适合作为工具发现设计样本阅读。 |
| [dsh-compaction-route](#plugin-1391040578-root) | 为会话压缩请求指定主模型和备用模型，在失败时切换摘要路由。 | 已遇到压缩路由失败时可试。 |
| [dsh-feed](#plugin-1336585522-root) | 聚合GitHub topic与npm插件条目为本地JSON索引，提供搜索、统计、CLI和实验性MCP。 | 适合把它作为候选索引接口试用。 |
| [dsh-gov](#plugin-1336647931-root) | 提供工具调用策略、JSONL审计及按Agent记录的token配额提示。 | 可在独立Profile试验工具deny/ask与审计。 |
| [dsh-insight](#plugin-1336649545-root) | 整合插件需求匹配、环境配方、健康评分、静态扫描与安装结论工具。 | 当前只适合作为离线目录与扫描线索。 |
| [dsh-mcp-tunnel](#plugin-1344713826-root) | 生成并管理MCP代理与Cloudflare隧道容器栈，输出待确认的客户端配置片段。 | 只在隔离示例端点试。 |
| [dsh-model](#plugin-1410395082-root) | 聚合多种模型来源为统一鉴权端点，提供模型目录、来源登录、组合切换与DSH管理页。 | 适合能维护本地daemon的多来源用户在临时profile试用。 |
| [dsh-model-auto-enricher](#plugin-1425159954-root) | 按模型名称规则补写Profile中的上下文、输出、模态与思考档位配置。 | 不宜直接让自动补齐改生产Profile。 |
| [dsh-monitor](#plugin-1333440937-root) | 轮询文件或命令输出，将新增内容送入 DSH 会话并唤醒 Agent。 | 仅在已授权、可信本地消息源且能接受进程内监视语义时评估；不据“persistent”措辞当作跨重启队列或权限隔离。 |
| [dsh-need-finder](#plugin-1336571882-root) | 按中英文需求匹配精选插件，并生成预设环境配方的有序安装计划。 | 适合找候选和列清单。 |
| [DSH-Official-WorkBuddy-Credit-Proxy](#plugin-1387227102-root) | 将本机 WorkBuddy、CodeBuddy 账号接入 DSH 模型池，并提供多协议代理与积分面板。 | 仅在本人账号和明确上游使用条件下隔离试用，先验证真实客户端工具闭环与协议降级；不要只凭响应200扩大使用。 |
| [dsh-opencode-zen-plugin](#plugin-1402771540-root) | 把OpenCode Console模型目录与多种流式协议接入DSH模型选择和配置界面。 | 适合已有Console账号的用户先对固定模型验证文本、工具和usage。 |
| [dsh-organism](#plugin-1366089972-workspace-plugins-dsh-organism) | 把插件组织为可观测器官，提供心跳、反射、自愈账本和工具schema按需门控。 | 适合愿意维护统一器官协议的实验环境；先只开启观测，再逐条批准恢复路径，验证重复故障不会重复副作用。 |
| [dsh-permissions](#plugin-1335349535-root) | 为DSH工具调用配置hard、deny、ask、allow权限规则，提供工作区作用域和可视化编辑。 | 适合将它作为宿主沙箱之上的附加规则层先试用。 |
| [dsh-plugin-adapter](#plugin-1374274469-root) | 把OpenCode Zen模型接入DSH模型目录，提供原生流式适配与可选网络路由管理。 | 适合非关键试验，先用原生adapter模式验证小任务，保留可用供应商回退；不要把免费通道当生产容量保证。 |
| [dsh-plugin-audit](#plugin-1336223158-root) | 同步插件目录与元数据，生成健康评分、静态扫描报告和榜单。 | 适合作为候选体检面板。 |
| [dsh-plugin-gate](#plugin-1336663986-root) | 对插件目录或npm包做静态风险扫描，并提供危险命令、路径及扫描差异检查。 | 适合作安装前静态检查。 |
| [dsh-plugin-loopback-trust](#plugin-1394489199-root) | 为反向代理域名访问的DSH网页恢复宿主设置持久化。 | 仅适合已经配置访问控制的自管反代管理员核查后试用。 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在 DSH 中搜索 GitHub 插件并提供安装、更新、冲突预检与启动恢复。 | 适合维护多个插件的DSH环境；先在隔离profile验证冲突提示和回滚，再用于日常安装，重要环境保留独立备份。 |
| [dsh-plugin-manager](#plugin-1334267268-root) | 给 DSH 插件提供中文目录说明、启停、备注编辑及配置备份管理界面。 | 需要批量辨认和启停时先在独立profile试用，核对系统保护、表达式拒绝、备份恢复及实际fiber状态后扩用。 |
| [dsh-plugin-market（99galaxy）](#plugin-1367597810-root) | 在 DSH 设置页浏览社区插件目录、查看安装版本并执行安装。 | 主要用web profile的人先浏览目录；点击前检查来源和版本，固定commit用户别直接更新，其他profile先核目标，安装后重启确认加载。 |
| [dsh-plugin-proxy](#plugin-1374274543-root) | 通过运行时设置切换DSH全局fetch代理，支持直连、系统代理和手动HTTP或SOCKS代理。 | 先用可观察测试端点核验fetch与目标客户端，确认无代理或配置错误时的直连回退可接受，再切换真实任务。 |
| [dsh-plugin-recommend](#plugin-1336684098-root) | 按需求、分类和标签搜索插件目录，提供相似项及在线目录刷新。 | 适合找候选和同类线索。 |
| [dsh-progress-viz-plugin](#plugin-1334481905-plugin) | 监听 DSH 会话语义事件并输出进度 JSON，供外部看板展示。 | 适合看长任务活动；先验证同会话空闲后继续工作的显示，关键任务以实际产物和会话结果验收。 |
| [dsh-reasoning-tiers](#plugin-1367305514-root) | 按规则补齐第三方模型推理档位，并在设置页编辑模型能力声明。 | 先备份 profile，对单个模型检查实际请求与撤销结果，再考虑批量补齐。 |
| [dsh-recipe](#plugin-1336583700-root) | 按场景检索插件配方，展开有序插件列表与安装命令，并合并去重多套配方。 | 适合先找候选组合的用户。 |
| [dsh-remote-ssh](#plugin-1384810201-root) | 通过SSH对配置主机执行允许命令，提供状态查询、固定探针与受限远程运行工具。 | 先使用远端低权限账号和固定只读探针，严格限定命令及参数，确认超时后的远端进程状态；不要把插件白名单当完整沙箱。 |
| [dsh-restart-dock](#plugin-1424433303-root) | 在 DSH 显示可拖动贴边的刷新和重启按钮，提供延迟选择与重启状态。 | Windows上需要手动重载插件的人先检查没有任务写入；先验证状态与取消、保留工作，再测试重启，macOS/Linux只期待刷新。 |
| [dsh-restart-planner](#plugin-1422176522-root) | 让 DSH Agent 排程宿主重启，由独立 helper 等待、重拉、体检并可投递继续提示。 | 需要自动重载的维护者先在隔离宿主看计划与报告；显式确认任务可中断、保留工作，先关自动续话检查重拉，再验证未知结果不重复投递。 |
| [dsh-router-loomy](#plugin-1376777535-root) | 将本机 Loomy 登录态与云端模型通道接入 dsh-router，提供模型目录和客户端状态页。 | 已有Loomy账号和router环境时先用非敏感只读问题验证当前模型、账号与完整收尾，再测会话刷新和中断；频繁断流时核对是否重复调用，勿直接用于要求一次副作用的任务。 |
| [dsh-skill-manager](#plugin-1336106328-root) | 在设置界面分层浏览、编辑和导入导出技能目录。 | 可先只读浏览；在验证多文件ZIP完整性前不要依赖导入成功作为可运行验收。 |
| [dsh-sysmon](#plugin-1334434271-root) | 周期采集Linux整机CPU、内存与根磁盘并显示状态浮层。 | Linux主机辅助观察，先验证指标尺度和失败状态；正式告警另用监控系统。 |
| [dsh-token-billing](#plugin-1335139860-root) | 为 DSH 提供按供应商、模型、时段与用量计算的实时费用与账本统计。 | 适合需要多路由费用参考的用户；先对照供应商账单核实缓存、峰谷和币种口径，再据看板调整预算。 |
| [dsh-tool-explorer](#plugin-1351594249-root) | 在DSH设置页浏览管理Skills与MCP，支持安装、编辑、开关、连接测试及跨工具配置导入。 | 适合经常管理多套Skills与MCP且能备份profile的用户试用。 |
| [dsh-ui-auth](#plugin-1343420855-root) | 为 DSH Web 提供登录、用户管理和认证网关，并支持 TOTP、Passkey 与会话隔离。 | 先在隔离环境逐一测试 HTTP、WebSocket 和多用户访问，不把安装成功当成公网安全保证。 |
| [dsh-usage-billing](#plugin-1333954586-root) | 统计DSH的DeepSeek模型调用与估算消费，提供预算提醒、历史回填、导出和余额展示。 | 适合本机单实例做大致用量观察。 |
| [dsh-usage-dashboard-plus](#plugin-1334023305-root) | 在 DSH 侧栏和设置页展示账户余额、调用用量与分模型费用统计。 | 适合用量观察；先用自己账单核对一天数据，并为未知模型补价，再据此设预算。 |
| [dsh-vps](#plugin-1377159975-root) | 在VPS部署DSH并提供登录网关、HTTPS、远程安装和升级回滚管理页面。 | 适合能维护Linux服务器的管理员在测试VPS验证。 |
| [dsh-web-lan-access](#plugin-1334255288-root) | 让DSH网页监听全部网卡，并为局域网页面提供Host能力声明与地址信任配置。 | 只在已有可信访问控制的临时私网环境核查；先证明未认证请求不能写宿主，再考虑日常远程使用。 |
| [dsh-web-restart](#plugin-1335060007-root) | 在 Web 侧边栏提供重启按钮，通过独立 PowerShell 进程触发宿主重启脚本。 | 当前更适合参考实现，先在可丢弃 profile 验证脚本路径、失败反馈和会话恢复。 |
| [dsh-web-url-view](#plugin-1366583376-root) | 显示当前 Web 地址，并提供转发到当前 DSH 实例的固定端口入口。 | 先保持回环绑定，测试重启后的令牌更新与拒绝外部 Origin，再考虑受控网络访问。 |
| [dsh-wsl-clock](#plugin-1351854066-root) | 比较WSL与Windows时间，报告时钟偏差并给出休眠后TLS或令牌故障的排查建议。 | 先把它当粗粒度线索，临界偏差用系统命令复核；保存工作后再考虑关闭WSL或同步时间。 |
| [dsh-wsl-defender](#plugin-1391141174-root) | 从WSL读取Windows Defender、防火墙、近期检测和排除项，形成安全状态摘要。 | 作为状态收集工具使用，对关键异常回到Windows安全中心核对；遇到unavailable先查权限和安全产品。 |
| [dsh-wsl-distro](#plugin-1350379001-root) | 识别当前WSL发行版、Windows默认发行版与系统信息，并提示跨发行版路径差异。 | 适合多发行版开发者，先核对current/default与UNC路径，再在目标发行版确认文件存在。 |
| [dsh-wsl-dns](#plugin-1351854118-root) | 比较WSL与Windows的IPv4解析结果，读取nameserver并提供DNS、VPN与网络排查提示。 | 只作为差异线索，先用稳定测试域名核对，再结合HTTPS与代理探针；企业分流DNS环境不要仅因不一致改配置。 |
| [dsh-wsl-docker](#plugin-1351854301-root) | 检查WSL的Docker CLI、daemon与context，汇总疑似推理容器及本地API端口线索。 | 先用作收集context与容器信息，再用受控/v1/models和小请求验证API；不要因portHealth为ok就交付推理服务。 |
| [dsh-wsl-encoding](#plugin-1351854402-root) | 检查WSL与Windows代码页、UTF-8设置及脚本中的CRLF换行。 | 先在小脚本上核对代码页和换行结果，大文件不要把采样字节数当作读取上限。 |
| [dsh-wsl-env](#plugin-1338530482-root) | 向DSH系统提示词注入WSL发行版、路径规则、Shell及本地模型连接提示。 | 先检查新会话实际系统提示，核对用户路径；不要把提示中的网络建议当作已检测的网络配置。 |
| [dsh-wsl-eventlog](#plugin-1391143266-root) | 从WSL读取Windows事件日志，支持日志名、级别、来源和时间条件。 | 先用一个已知事件核对查询结果；遇到空结果时放宽数量并用系统原生工具复查。 |
| [dsh-wsl-expose](#plugin-1351853956-root) | 诊断WSL端口访问方式，提供端口转发建议并可添加或删除Windows portproxy。 | 先只看建议；确需局域网转发时限制监听地址，另查防火墙，完成后检查删除规则是否生效。 |
| [dsh-wsl-gpu](#plugin-1350378777-root) | 汇总WSL中的GPU、显存压力及常见本地推理端口诊断信息。 | 把报告当排障起点，使用实际模型小任务核对显存余量，端口开放不当作GPU争用证据。 |
| [dsh-wsl-hostsvc](#plugin-1351854010-root) | 从WSL探测Windows端本地模型服务，并生成连接与上下文配置建议。 | 优先核对apiReady而非仅TCP，再确认模型ID和真实上下文上限。 |
| [dsh-wsl-jev](#plugin-1381389698-root) | 通过TypeSafe或OpenRouter的System One接口进行判断、检查和候选排序。 | 先用可独立核验的小问题试验，检查发送内容和截断；重要决策保留人工或确定性验收。 |
| [dsh-wsl-llamacpp](#plugin-1381832318-root) | 查询llama.cpp等OpenAI兼容本地服务，并发起非流式聊天请求。 | 先确认模型和服务地址，测试prompt与messages两条输入路径，不把字符上限当完整上下文保证。 |
| [dsh-wsl-mnt](#plugin-1351854159-root) | 检查当前工作目录是否位于Windows挂载盘，并给出WSL目录与Git使用建议。 | 先核对实际慢操作，再决定是否迁移；保留原目录并验证文件一致。 |
| [dsh-wsl-net](#plugin-1338965593-root) | 检查WSL代理、DSH进程环境与常见服务连通性，并给出修复建议。 | 先核对报告中的进程和代理地址，修复后在实际DSH会话验证；不要只重开Shell就认为宿主已更新。 |
| [dsh-wsl-ollama](#plugin-1381724774-root) | 访问本地Ollama，提供模型列表、聊天和嵌入工具。 | 显式配置服务地址和模型，分别核对聊天与嵌入结果，不把本地标签当无数据外发保证。 |
| [dsh-wsl-perf](#plugin-1391142601-root) | 从WSL读取Windows宿主CPU、内存、磁盘及高内存进程指标。 | 适合偶发诊断；先确认CPU累计值与内存排序含义，再作处置。 |
| [dsh-wsl-port](#plugin-1350378913-root) | 检查WSL本地TCP监听及IP，并提供Windows访问DSH的排障步骤。 | 适合故障分层第一步；3081裸地址与带认证入口须区分，完整登录访问后才算恢复。 |
| [dsh-wsl-power](#plugin-1391140034-root) | 从WSL查询Windows电源计划、电池与睡眠配置。 | 仅作状态参考；中文系统和休眠可用性必须先对照原始结果，不据工具返回直接承诺任务不中断。 |
| [dsh-wsl-registry](#plugin-1391142974-root) | 从WSL只读查询Windows注册表值和子键，并限制可访问键前缀。 | 从已知非敏感键试读，避免把白名单与截断承诺视为已验证安全边界。 |
| [dsh-wsl-secret](#plugin-1381733290-root) | 按允许前缀读取pass或age秘密，并可注入当前DSH进程环境。 | 仅给最小前缀并使用非敏感测试值，默认不reveal；不要把进程内注入当秘密永不进入其他工具。 |
| [dsh-wsl-service](#plugin-1391140376-root) | 从WSL查询Windows服务列表、状态、运行账户、进程和依赖关系。 | 先对已知服务核对detail；不要由停止状态或空依赖直接决定删除、重启。 |
| [dsh-wsl-struct](#plugin-1381832935-root) | 在 DSH 中调用 jq、yq 和只读 SQLite 查询本地结构化数据。 | 适合有固定配置查询的开发者先在副本中试用；显式缩小 allowRoots，核实 yq 版本及表达式权限，不把它当不可信查询隔离器。 |
| [dsh-wsl-systemd](#plugin-1381843201-root) | 在 DSH 中只读查看 systemd 用户服务的状态与近期日志。 | 适合已用 systemd --user 管理服务的人做只读排障；先确认用户总线和日志权限，修复服务仍需人工操作。 |
| [dsh-wsl-terraform](#plugin-1381843937-root) | 在 DSH 中查看 Terraform/OpenTofu 校验、计划摘要与状态资源列表。 | 适合已有 Terraform 审批流程的人先审阅沙盒计划；显式配置 allowRoots 和凭据，任何摘要都要回看完整计划后决定部署。 |
| [dsh-wsl-tray](#plugin-1351853903-root) | 为 WSL 内的 DSH Web 安装或报告 Windows 托盘与快捷方式启动入口。 | 适合已使用 dsh-wsl-kit 的 Windows 用户；显式设置 kitPath，先从快捷方式实际启动一次，再依赖托盘恢复，不把生成脚本成功当启动成功。 |
| [dsh-wsl-vllm](#plugin-1381832640-root) | 为 DSH 提供本机或 Docker vLLM 服务状态与对话补全工具。 | 适合已有 vLLM 服务的人做少量文本任务试用；先查 reachable 和 model，长提示自行拆分，不把 status.ok 当服务健康或完整回答保证。 |
| [dsh-wsl-wslconfig](#plugin-1351854461-root) | 只读解析 Windows .wslconfig，给出网络模式、内存与 DSH 中继提示。 | 适合查配置的辅助入口；先确认实际Windows用户路径，网络问题仍要测端口，修改和 wsl --shutdown 由用户评估后执行。 |
| [dsh-zspace](#plugin-1406500233-root) | 将极空间 NAS 文件管理与容器诊断能力接入 DSH，自动选择直连或中转。 | 先用只读列表、stat及测试文件评估；重要写入和删除固定通道并核对结果，网络失败后确认实际状态再重试。 |
| [Forge 用量计费](#plugin-1363429979-plugin-usage-billing) | 从会话用量建立账本，以事件时刻价格计费并展示预算、趋势与未计价项目。 | 先选择一个模型和一天真实账单，逐项核对 token、缓存计价、币种和未计价行。 |
| [model-usage-plugin](#plugin-1334569518-root) | 聚合模型用量、工具活动及按可配置单价估算的费用趋势。 | 作为估算面板使用，先校准provider、套餐和单价口径；正式费用以供应商账单核对。 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root) | 监听工具结果和会话事件，生成不保存观察明文的哈希链 JSONL 证据回执。 | 用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。 |
| [Quota 用量仪表](#plugin-1400927706-root) | 累计会话用量并注入实时仪表，按价格与历史增量估计预算和上下文余量。 | 先与一天供应商用量对账，检查缺失 usage、重复事件和价格单位，再启用预算提醒。 |
| [元冰可 AI 资源治理平台](#plugin-1416699252-root) | 以 Cordis 插件树组织企业 AI 资源、身份权限、模型与数字员工治理。 | 已有多用户治理需求的团队先在隔离环境跑一条业务链；核对拒绝、例外入口与备份恢复，再扩部门和资源，避免把启动健康当业务验收。 |
| [模型信息补全](#plugin-1358816037-root) | 从 models.dev 为自定义模型补齐缺失能力，并保留人工确认与未声明状态。 | 先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。 |

<a id="plugin-1302597978-deploy-plugins-dist-dsh"></a>

## [ANet DSH 适配组件](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/ANetResearch/ANet)

- **用途**：已有ANet身份与节点的用户从DSH发现其他Agent、发任务、跟踪回执并处理报价；交付物是外部任务结果与状态，不代表结果已验真。
- **亮点**：组件的实际贡献是让MCP与Skill命令到达同一身份/二进制，并把长等待、未知执行效果和运营者限额写进使用协议；不把整仓A2A、加密、支付系统当作本适配组件原创。相对手写MCP配置，减少路径与身份不一致。
- **思考**：协议说明能否保证跨Agent副作用不重复？Skill要求wait超时继续等、未知效果不重发，并区分completed/UNVERIFIED，但执行保障在外部daemon，组件未实现幂等或支付限额校验。组件改process.env是进程共享状态，多profile/其他插件并行时的设置归属也不能只靠dispose恢复证明隔离。
- **建议**：如果适配层把任务ID、message_id、效果状态和支付回执组成只读交接凭证，父Agent在未知状态下只能继续查询原任务，可能降低重复派单/支付。对超时、断线、相同文本新任务及换身份四种案例检查既不重发又不吞新请求；若只提示而无可核验状态，不能声称获得执行级保证。

<a id="plugin-1334862230-root"></a>

## [chicheng-gate](../../plugins/534119219--chicheng-gate/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-gate)

- **用途**：需要从其他设备访问自用DSH的人，通过面板管理监听范围、隧道和密码登录；交付可访问的Web界面，仍需核查网络与宿主权限。
- **亮点**：相对手工配置frpc、反向代理和DSH监听参数，贡献是把网络开关、登录门禁与独立隧道网关放进同一DSH设置流程，使来自loopback的隧道流量也先过密码。scrypt、frpc与反向代理均为既有机制，插件增量在DSH访问接缝及生命周期集成。
- **思考**：集成门禁是否抵消了扩大宿主信任面的代价？源码同时修改trustedHosts和特权接口路径，且applyPatches按字符串改官方文件，revertPatches直接回写旧.bak；宿主升级后关闭开关可能覆盖新的官方内容。frpc校验文件HTTP失败只警告并跳过，缺少匹配行也不终止，不能把“带SHA256”概括为强制校验。cookie构造未设Secure，传输保密也不是插件已证明能力。
- **建议**：待验证假设：将宿主接缝转换为按版本/哈希守卫的显式适配层，恢复时仅撤销自己仍匹配的补丁，并让frpc安装校验失败即停止，可降低升级与供应链不确定性。依据是当前.bak恢复与可跳过校验。用官方文件已升级/用户另改/校验404三类输入，验证拒绝覆盖与拒绝运行，同时记录维护多版本适配的人工成本；当前均未实现。

<a id="plugin-1335725068-root"></a>

## [chicheng-stats](../../plugins/534119219--chicheng-stats/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-stats)

- **用途**：想了解不同会话和模型资源消耗的用户查看用量趋势与请求明细；用于排查资源分布，账单应与平台实际计费分别核对。
- **亮点**：相对只看当前对话用量，增量是共享fold同时接实时事件和日志扫描，以水位降低重复摄取，并提供跨会话模型/提供方明细。token计量沿用宿主事件语义，平台余额来自外部API；本插件贡献在归集、呈现和回填工程。
- **思考**：累计量能否在重启与跨进程场景保持可核对？lastUsage仅内存保存，重启后同turn/step的更高seq补报可能无法替换旧计数；watermarks超过5000会剪掉旧会话，重新扫描可能再计。decodeSessionLog在Electron默认返回空数组以避免zstd崩溃，因此README“包括其他进程”不能无条件适用于Desktop。余额差估算也可能受充值和外部请求影响。
- **建议**：待验证假设：用持久请求键保存最后用量版本，将扫描水位与聚合更新做同一可恢复提交，可使重启后补报替换与历史重扫可核对。依据是当前持久水位与内存lastUsage不对称，未实现。对照实时chunk后重启再final、超过5000会话重扫和异常中断，比较总量与独立事件账本；权衡是台账体积与迁移维护成本。

<a id="plugin-1340492184-root"></a>

## [dock](../../plugins/aks1st--dock/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock) · [![npm 30d 1532](https://img.shields.io/static/v1?label=npm+30d&message=1%2C532&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-base)

- **用途**：需要在DSH聊天旁组织多个文件/工具面板的用户与扩展作者。
- **亮点**：以独立注册域、实例seed和关闭钩子减少每个扩展自建窗口的重复工作；注册ID冲突拒绝、释放时按定义身份清理，生命周期比单纯固定按钮更完整。没有实现新窗口协议或远程一致性。
- **思考**：各扩展vendored类型契约只在编译时检查，真实ctx.workbench版本兼容仍需验收。localStorage是浏览器本地状态，不等于跨设备同步或可靠工作成果存储；异步关闭钩子正确性不代表业务保存已成功。
- **建议**：未验证假设：服务启动公开能力版本并让扩展按需求协商，可将方法缺失转为明确兼容提示。用旧新扩展、拒绝/异步关闭和卸载重载矩阵比较故障定位时间及状态丢失。

<a id="plugin-1333368566-root"></a>

## [DSH Telemetry Redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) · [![npm 30d 1216](https://img.shields.io/static/v1?label=npm+30d&message=1%2C216&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor)

- **用途**：向观测后端发送会话遥测的部署者需要减少凭据外传，输入是遥测副本。
- **亮点**：session-telemetry/record 前置规则调用 next 后递归生成脱敏记录，不重写规范会话。
- **思考**：在统一出口处理副本有清晰边界；它是遥测防护的一层，不能替代凭据权限和全链路审计。
- **建议**：先在测试遥测里放入假密钥、普通文本和 token 计量字段，核对脱敏与保真后再接后端。

<a id="plugin-1414323673-root"></a>

## [dsh-agent-recycle-guard](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/AhYi8/dsh-agent-recycle-guard) · [![npm 30d 876](https://img.shields.io/static/v1?label=npm+30d&message=876&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agent-recycle-guard)

- **用途**：Agent清理文件时减少误删损失，合格行为须保留原权限/沙箱且回收失败不永久删除。
- **亮点**：相比提示“别rm”，增量是工具执行前实质检查、语义保留改写与失败关闭；Shell AST和系统回收机制来自现有组件，不构成通用程序安全证明。
- **思考**：命中常见删除是否覆盖任意破坏？只处理command/cmd参数，脚本深度/大小/编码及动态加载有限，干净脚本可能仍间接删文件；同用户竞态、模块和外部程序内部操作不受全量保护。
- **建议**：由静态改写与执行时展开分工推导，可返回覆盖范围收据，明确已检查语言/脚本及未检查加载边界，并配文件系统变更预览或沙箱作第二层。未验证；隐藏/动态删除样本应清楚标未覆盖而非安全承诺。

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

## [dsh-anatomy-panel](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

- **用途**：维护Agent-Body部署的人需要查看后台状态，合格交付是实际文件异常能被看到，而非仅有漂亮仪表盘。
- **亮点**：组件lib/index.js注册/anatomy与数据路由，每次请求重读organism文件，脉冲只读尾部256KB，页面约每三秒轮询。
- **思考**：直接从运行文件投影避免另建采集服务；仪表盘显示已愈合不能证明业务故障真正恢复。
- **建议**：先限制在本地受控宿主使用，检查缺失数据能否报503，并核对脉冲文本的展示边界后再接入多人环境。

<a id="plugin-1346196699-root"></a>

## [dsh-api-dashboard](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) · [![npm 30d 4246](https://img.shields.io/static/v1?label=npm+30d&message=4%2C246&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)

- **用途**：同时使用多个供应商的用户需要观察额度和花费趋势，合格输出应能区分实际余额、估算与无法查询。
- **亮点**：src/index.js 从凭据及平台接口取余额，以内置或自定义单价计算会话消耗，混合币种分别显示；客户端定时刷新看板。
- **思考**：集中显示和明确未知值有实用价值；估算若被当成收费真相，会把价格漂移和缓存差异隐藏起来。
- **建议**：先选择实际可查询的平台，对照控制台账单和混合币种；把看板作为预警与估算入口，自更新前保留配置和回退。

<a id="plugin-1409096911-root"></a>

## [dsh-armor-switch](../../plugins/571242--dsh-armor-switch/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/571242/dsh-armor-switch)

- **用途**：适合研究DSH提示装配与自有环境维护的开发者；提示开关、宿主改写和配置改写要分别核对。
- **亮点**：作者主张减少过度自审；源码可确认的是把提示装配热切换、偏好持久化和可逆维护统一到UI。相对直接编辑提示，开关不需反复注册；host-clean的锚点及manifest为特定宿主字节修改提供恢复依据。它不能改变供应商模型规则或增加网络能力。
- **思考**：提示文字优先权宣告不等于实际指令优先权，效果依赖模型；minimal完整预设会抑制这些注册。更关键的是主开关关闭不代表独立host-clean已还原，等长字节改写绑定宿主版本，升级或不完整恢复可能留下不同状态。 profile-clean的BLOCK_BODY还会设置danger-full-access、approval never及默认权限预设，实际作用不仅是文案维护，需独立核对执行权限变化。
- **建议**：待验证假设：以纯只读差异预览和逐模块恢复状态代替单一总开关，可减少用户误判。用运行时开关、磁盘归档、新会话配置的组合场景测状态理解与恢复成功；不把解除模型限制当实验目标。

<a id="plugin-1413052822-root"></a>

## [dsh-armory](../../plugins/2026heshao--dsh-armory/INSIGHT.md)

[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) · [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory)

- **用途**：同时维护多项目MCP和第三方技能的用户，希望集中导入、辨认安装来源并隔离会话工具。
- **亮点**：作者声明fork自Imzl-zl MCP看板，原面板不计原创。可识别贡献是项目共享连接所有权与异步释放占位、统一导入准入，以及在静态header宿主前补OAuth授权流程；目录规模并非已安装能力数量。
- **思考**：安装来源账本是否能作为可靠审计真相？wb-install-state的writeAtomic先写staging再rm正式文件再rename，存在删除后失败窗口；record是读改写且该模块未串行化，并发调用可能丢登记。登记失败不影响安装，故安装成功与来源已登记不能等同；共享连接也须区分配置落盘与运行收敛。
- **建议**：已有多个MCP时在独立项目试用导入和作用域隔离，核对实际工具与来源登记；OAuth与市场安装新增路径需单独验收，不依据零调用账本批量停用工具。

<a id="plugin-1335594781-root"></a>

## [dsh-capability-index](../../plugins/777-zen--dsh-capability-index/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/777-Zen/dsh-capability-index)

- **用途**：工具库较大的DSH会话需要减少遗漏可用工具；合格交付应是正确工具被使用且任务更可靠，不能只用提示命中率代替任务成功。
- **亮点**：相对将所有工具说明直接塞进上下文，增量是以任务触发、语义召回和负向声明分层压缩候选，同时把纯排序逻辑与宿主适配分开。使用的向量模型与检索原理是上游能力，插件贡献在能力发现的流程组合。
- **思考**：提升插件利用率是否提升任务质量？README作者主动承认仅16条评估不足以证明价值并已归档；源码中词表、Top-K池及模型降级表明召回受工具描述和声明质量约束。错误提示也可能增加调用或挤占上下文，不能从命中率推出净收益。
- **建议**：由not_for负向声明和不强制调用推导，可增加“本任务不调用”的解释性拒绝记录与按任务结果校准阈值，而不是只追求召回。未验证假设：将误触发成本纳入阈值后可在固定token预算下提高合格交付率。用未参与调参的新任务与无提示基线盲评；若质量未升或复核负担更高则否定。

<a id="plugin-1391040578-root"></a>

## [dsh-compaction-route](../../plugins/643048695--dsh-compaction-route/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/643048695/dsh-compaction-route)

- **用途**：适合主聊天模型可用但压缩模型额度或窗口不足的长会话用户。
- **亮点**：作者针对压缩无备用路由的问题；可确认贡献是在请求瀑布层限定purpose，给摘要加入显式主备，而不影响聊天、标题等请求。相对手动改配置重试，故障路径更集中；摘要质量仍取决于实际后端与模型。
- **思考**：切换同一长请求到备用模型不保证窗口适配，fallback也可能同样溢出。collectAttempt缓冲整个流，outcomeOf没找到finish会视作无failure，这使异常截断边界值得重点验证；兼容provider的reasoning effort也需检查。
- **建议**：待验证假设：主备选择同时核对请求估算与目标模型窗口，可降低盲目重试。用不同窗口和限流故障矩阵比较有效摘要率、请求次数与费用；若估算不准导致误跳过健康路由，则保持显式选择。

<a id="plugin-1336585522-root"></a>

## [dsh-feed](../../plugins/863683348--dsh-feed/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-feed) · [![npm 30d 97](https://img.shields.io/static/v1?label=npm+30d&message=97&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feed)

- **用途**：适合要在DSH之外复用插件发现数据的工具开发者；交付物是可检查的本地JSON索引。
- **亮点**：作者定位开放聚合底座；实际增量是在宿主工具、CLI与极简MCP之间共享同一JSON索引和纯查询逻辑，降低下游重复抓取成本。相对人工浏览两个目录，能复用归一化数据；这是数据接入与接口整合，不是全生态语义理解或插件可用性验证。
- **思考**：默认GitHub只读两页、npm只取100项，npm失败被catch为[]；合并键使用GitHub owner/repo与npm包名，通常不是同一身份，无法保证跨源去重。结果count和sources只表示此次得到条目，不能当完整生态覆盖或可安装数量。npm缺Star还被置0，混淆未知与真实0。
- **建议**：待验证假设：为每源加入覆盖范围、失败状态及仓库数字ID—包名映射，可让下游区分完整索引与局部结果。用同仓库不同包名、超过两页和npm失效输入，比较重复率与缺失报告；若身份来源不足，应保留未关联而不猜。

<a id="plugin-1336647931-root"></a>

## [dsh-gov](../../plugins/863683348--dsh-gov/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-gov) · [![npm 30d 152](https://img.shields.io/static/v1?label=npm+30d&message=152&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-gov)

- **用途**：适合研究DSH集中工具权限与审计的维护者；要区分执行前策略拒绝与用量提醒。
- **亮点**：作者称企业治理套件；源码可确认增量是把实际执行前钩子、结果日志和Agent用量状态统一到gov工具及持久化目录。相对只写禁止提示，deny/ask返回确实位于工具执行链；但企业合规、不可篡改审计和硬费用控制没有因此成立。
- **思考**：配额超过后返回enter消息而不是reject，不能硬停请求；hook仅在启动时defaultLimit>0或已有配额时注册，空初始状态中之后quota_set可能没有计量hook。totalTokens是会话测量值却作为delta反复相加，可能重复累计上下文压力；状态与日志写入失败均吞掉，不能承诺审计完整。
- **建议**：待验证假设：将预算分成请求压力、实际计费用量与可执行拒绝三种状态，再绑定不可变调用ID，可减少误计量和提示被误当硬配额。以重复pre-step、写盘失败、运行中设置quota及跨Agent轨迹验证计数和阻断；若宿主没有可靠计费用量，保留压力指标。

<a id="plugin-1336649545-root"></a>

## [dsh-insight](../../plugins/863683348--dsh-insight/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-insight) · [![npm 30d 828](https://img.shields.io/static/v1?label=npm+30d&message=828&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-insight)

- **用途**：适合先整理候选插件再人工审阅的用户；不应把工具生成的install文字当宿主验收。
- **亮点**：作者试图以单一入口回答值得装吗；实际增量是将需求匹配、配方、健康信号和静态扫描汇到一个决策接口，减少多工具手工拼接。其核心是集成而非已验证的质量预测，当前评分到结论的字段接线存在明显缺口。
- **思考**：scoreRecord返回total而verdictFor读取points，index原样传入，因此非高危且没有低匹配分支的记录也不能命中>=70的install或>=40的caution，输出score为undefined、理由health undefined。另plugin_audit用findings.length作scanned计数，不能据此知道读了几文件；零发现与未扫描也被混为not-scanned。
- **建议**：待验证假设：用统一带Schema的证据对象表达扫描覆盖、健康分及需求适配，再把结论限定为可追溯规则，可避免组合工具因字段漂移失真。以高分/低分、已扫零发现、未扫及高危四组端到端用例检查分支；只有接线通过后再研究阈值是否预测真实可用性。

<a id="plugin-1344713826-root"></a>

## [dsh-mcp-tunnel](../../plugins/988hj7tczd-oss--dsh-mcp-tunnel/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel) · [![npm 30d 778](https://img.shields.io/static/v1?label=npm+30d&message=778&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mcp-tunnel)

- **用途**：适合明确要远程访问本机HTTP MCP端点的维护者；公网URL、鉴权及客户端接入须分别验收。
- **亮点**：增量是把容器栈、证书、token文件、状态和待确认客户端片段组织为DSH生命周期工具，相对手动Compose降低重复操作。隧道传输来自cloudflared、MCP转发来自外部mcp-proxy；本项目不实现MCP协议，也不自动提供应用级授权。
- **思考**：虽然文字称本地MCP，resolveFromMcpJson遇stdio会拒绝并要求先转HTTP，不能宣称任意本地server即用。Compose引用latest镜像，代理API_KEY是否真正强制鉴权需固定镜像实测；pending片段包含Bearer且writePendingFragment无显式0600，与.env明确0600不同。provider anthropic模板的命名隧道启动仍是注释，不是可直接运行的第二方案。
- **建议**：未验证假设：固定镜像摘要并在生成客户端片段前运行未授权拒绝/授权成功探针，可降低有URL就当安全可用。对空token、错token、健康上游及stdio输入验证结果；缺鉴权时不生成可用声明。

<a id="plugin-1410395082-root"></a>

## [dsh-model](../../plugins/aicivilization--dsh-model/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model) · [![npm 30d 2009](https://img.shields.io/static/v1?label=npm+30d&message=2%2C009&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model)

- **用途**：多账号/本机模型用户需要统一连接和额度回退，合格请求须保留模型语义、授权与工具流，不是只拿到HTTP成功。
- **亮点**：相对每个客户端配置多个provider，增量是端点、设备鉴权、来源管理和组合回退一体化。核心模型转接依赖CLIProxyAPI等上游，不应把模型供给与账号额度归为插件创新。
- **思考**：统一可用性是否掩盖不同模型与账户条件？combo允许换模型，虽避免输出后再换，但不同上下文/工具语义和未知请求结果需验收；setup含系统服务、凭据和配置修改，多阶段部分失败不等于全量回滚。README免费/订阅可转接均未在本轮核实。
- **建议**：由输出前回退边界推导，可将组合限制为经验证兼容任务能力集，返回最终来源/回退原因，并把未知结果与可重试失败区分。未验证；相同工具任务注入限流/断流，若结果归属或副作用重复不清则否定。

<a id="plugin-1425159954-root"></a>

## [dsh-model-auto-enricher](../../plugins/66rapper--dsh-model-auto-enricher/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/66rapper/dsh-model-auto-enricher)

- **用途**：面向批量添加模型渠道的DSH用户，目的是减少逐模型编辑；正确交付应是与真实端点能力匹配的配置。
- **亮点**：作者称自动补齐最佳模型状态；源码可确认的是规则驱动批量配置、预览、备份与幂等检测，减少逐项输入。相对手工编辑，自动化明确；但这不是实际能力发现，规则高估能力会把配置便利变成不可用请求，不能把宣告能力当真实提升。
- **思考**：核心假设是名称正则能可靠推出实际渠道能力，源码没有端点探测，未知模型反而默认百万上下文、图片及max思考档位。只升不降保留错误高值，可能阻止纠错；备份只能恢复文件，不能证明语义安全。YAML主体重序列化也非全文件注释保真。
- **建议**：待验证假设：以保守未知值、端点能力来源和用户确认差异取代旗舰兜底，可减少配置后的请求失败。收集已知小窗口、纯文本和未知模型的脱敏配置，比较规则版与保守确认版的错误声明、编辑时间及回滚率；若无改善则否定。

<a id="plugin-1333440937-root"></a>

## [dsh-monitor](../../plugins/abnerai--dsh-monitor/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AbnerAI/dsh-monitor) · [![npm 30d 831](https://img.shields.io/static/v1?label=npm+30d&message=831&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-monitor)

- **用途**：Agent在等待追加式消息源时避免自行忙轮询；交付物是属于原Agent的插件notice，不是监控源事实已核验。
- **亮点**：把Agent忙等改成后台timer，在宿主空闲与运行中使用不同消息入口，统一文件与命令差分；相较Agent循环调用shell减少上下文轮询。作者以Claude Monitor作类比，但本项并非同等耐久消息队列或完整跨会话授权。
- **思考**：新增消息能否不丢不重且仅原会话可管理？文件按当前size推进游标，即使末行没换行也发送，下一段会成为另一条；setInterval的async tick无busy锁，慢命令可重叠并乱序更新cursor。list列全部watcher，stop仅按ID不校owner；计数在未await followup/inject后递增。maxNoticeBytes配置被读但未用于noticeFor，不能承诺配置的字节上限。
- **建议**：把每watcher做串行状态机：完整行缓冲、owner校验、投递确认后推进游标，并显式定义重启恢复，可能改善可靠性。用半行分次追加、命令超poll时长、两个会话互停和投递失败案例，要求不拆消息、不重叠、不跨会话并可说明未知投递；没有回执时应标至少一次/可能丢失而非“已送达”。

<a id="plugin-1336571882-root"></a>

## [dsh-need-finder](../../plugins/863683348--dsh-need-finder/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-need-finder) · [![npm 30d 850](https://img.shields.io/static/v1?label=npm+30d&message=850&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-need-finder)

- **用途**：适合不会记插件名、想先找少量候选的用户；安装计划仍需人工逐项确认。
- **亮点**：作者称需求语义导购；可确认增量是把可解释词面匹配和配方清单接进模型工具，避免模型自行猜名称。相对浏览目录，返回命中理由与命令更直接；这里语义是词典/子串规则，没有向量或模型语义推理。
- **思考**：84项精选属于有意子集，词面相关不能证明实际能力和兼容。中文category兜底的实际代码仅拿en词集合匹配，中文词典项不会凭空增加中文分类召回。recipe apply只返回计划，dependsOn校验存在性但installPlan按order排序，不做真实依赖求解或执行。
- **建议**：待验证假设：在匹配结果中加入经过验证的场景条件与未满足条件，比单纯提高词权重更能缩短选型。对同义但无词面重合、中文分类和互斥配方需求比较人工合适率与误装率；没有宿主证据的条件保持未知。

<a id="plugin-1387227102-root"></a>

## [DSH-Official-WorkBuddy-Credit-Proxy](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) · [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit)

- **用途**：已有本人账号、希望在兼容客户端复用接入和故障转移的用户，交付为经过同一调度器的模型响应。
- **亮点**：作者明确基于XDTrees账号池及其他MIT代码，不能把凭据解密和原池轮转归为新贡献。可识别增量是三协议共用调度及针对工具调用/流事件的兼容投影，隔离协议错误与选号逻辑。
- **思考**：协议翻译是否语义无损？inputToMessages对工具call/result重排和补缺失结果，有利于上游接受；但input_image变成文本占位，数组输出抽文本，toolsToChat仅过滤function类型，自由格式工具声明未因此完整支持。HTTP200和模型正文不代表完整工具闭环兼容。
- **建议**：仅在本人账号和明确上游使用条件下隔离试用，先验证真实客户端工具闭环与协议降级；不要只凭响应200扩大使用。

<a id="plugin-1402771540-root"></a>

## [dsh-opencode-zen-plugin](../../plugins/a42null--dsh-opencode-zen-plugin/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/A42Null/dsh-opencode-zen-plugin) · [![npm 30d 400](https://img.shields.io/static/v1?label=npm+30d&message=400&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a42null/dsh-opencode-zen-plugin)

- **用途**：持有Console API key的用户希望在DSH使用目录中的聊天模型，合格结果需文本、工具调用、usage和错误都正确映射。
- **亮点**：相比手工逐模型配置，增量是动态目录、协议路由和错误分类一体化；模型能力与服务供给属于Console，上下文元数据来自外部目录。
- **思考**：模型可选是否等于已兼容？apiForModel用名字路由、未知默认chat，目录离线可用静态回落；新模型协议变更或元数据过期会显示却不可调用。状态ok可与lastError并存，不能用目录非空认定服务健康。
- **建议**：由命名路由与回落推导，可为模型记录协议来源、元数据日期和最近能力探测状态，未知模型先标待确认。未验证；用新前缀/过期元数据/工具调用流测试，若仍把未验证项展示为完整支持则否定。

<a id="plugin-1366089972-workspace-plugins-dsh-organism"></a>

## [dsh-organism](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

- **用途**：多插件组合维护者希望统一发现工具、跟踪故障和触发恢复，合格结果是可追踪的实际恢复而非状态计数增长。
- **亮点**：组件src/index.ts连接tools与session事件、心跳和持久账本；按器官选择工具schema，反射可再次执行工具，带副作用处方要求人工裁决。
- **思考**：统一事件与恢复账本有集成价值；把任意插件命名为器官不能自动消除兼容差异，也不能证明任务成功。
- **建议**：适合愿意维护统一器官协议的实验环境；先只开启观测，再逐条批准恢复路径，验证重复故障不会重复副作用。

<a id="plugin-1335349535-root"></a>

## [dsh-permissions](../../plugins/940842546--dsh-permissions/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-permissions) · [![npm 30d 606](https://img.shields.io/static/v1?label=npm+30d&message=606&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-permissions)

- **用途**：团队需要在宿主既有沙箱上增加工具级规则，合格结果是匹配的敏感操作确实被拒绝，规则修改与审批有可审计边界。
- **亮点**：相对只靠系统提示，增量是在真正工具执行链上增加可视规则判定，并将hard与会话never策略分开；这是可执行接线，不仅是提示承诺。但规则覆盖不是OS级隔离。
- **思考**：hard是否在所有异常下仍有效？index.js最外catch记录engine-error后return next，工作区解析失败还会只用global；match按工具名称/原参数字符串，不能解析shell等价写法、符号链接或未枚举工具。因此正常匹配可阻断，不等于不可绕过的安全边界，异常放行是核心限制。
- **建议**：由异常放行与硬规则承诺张力推导，可将hard判定做成最小fail-closed核，加载失败时拒绝相关写工具；ask/便利规则可单独降级。未验证假设是减少策略错误时漏放而不使无关读取不可用。注入设置/解析/审批异常并测敏感写是否被阻止，若仍放行则不成立。

<a id="plugin-1374274469-root"></a>

## [dsh-plugin-adapter](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter)

- **用途**：希望在DSH尝试Zen模型的用户需要原生会话和工具调用接口，验收需包括流式文本、工具结果与失败恢复。
- **亮点**：packages/plugin/src/index.ts默认注册zen-free及旧别名LlmAdapter，后台预热模型目录；另保留sidecar和可选IP池/代理配置。
- **思考**：原生适配减少单独进程与UI切换；上游匿名接口变化可能让全部便利失效，需与直接使用原CLI比较维护负担。
- **建议**：适合非关键试验，先用原生adapter模式验证小任务，保留可用供应商回退；不要把免费通道当生产容量保证。

<a id="plugin-1336223158-root"></a>

## [dsh-plugin-audit](../../plugins/863683348--dsh-plugin-audit/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-audit) · [![npm 30d 821](https://img.shields.io/static/v1?label=npm+30d&message=821&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-audit)

- **用途**：适合生态维护者筛选需深入检查的仓库，交付物是本地目录和带信号的初筛报告。
- **亮点**：作者提出生态体检及高危否决；实际增量是把有界同步、历史Star信号、静态发现和本地榜单连起来，便于维护者优先排查。相对只看Star，增加安全线索；高分仍主要是维护和包装代理信号，不是插件运行质量。
- **思考**：guessPackageName按仓库短名探测npm，可能把同名其他作者包绑定给仓库。scanner读取HEAD树后再取contents默认分支，没有固定commit绑定，多请求间可能混版本；有限入口抽样不能代表全仓库。评分中的README长度/推送/Star不能证明安全或采用，扫描失败为空材料不能等同零问题。
- **建议**：待验证假设：先核实包仓身份并把所有被扫文件固定到同一SHA，再让报告显式显示未覆盖项，可减少误归因和虚假安全感。用同名异仓npm、移动HEAD和隐藏深层脚本样本比较误关联与漏报；无完整覆盖时只输出初筛状态。

<a id="plugin-1336663986-root"></a>

## [dsh-plugin-gate](../../plugins/863683348--dsh-plugin-gate/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-gate) · [![npm 30d 1535](https://img.shields.io/static/v1?label=npm+30d&message=1%2C535&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-gate)

- **用途**：适合安装前收集风险线索及审阅危险操作；扫描结论不等于宿主执行层已经阻断。
- **亮点**：作者称安装安全闸门；可确认增量是给模型一个带逐行证据、扫描边界和差异输出的静态检查工具，扫描不执行目标代码。相比仅凭README安装，增加可审阅证据；所谓gate主要是工具结果与模型指引，不是不可绕过的安装拦截器。
- **思考**：gate_guard需模型主动调用并遵守结果，入口未接执行前拦截，因此不保证rm等命令会被宿主挡住。evaluatePath只规范斜线和尾分隔符，不解析..或符号链接；根匹配也只是字符串启发式。PASS表示没命中所扫模式，不能推出依赖安全或无恶意；OSV只查有限精确直接版本并可离线降级。
- **建议**：待验证假设：把扫描摘要绑定固定包摘要和待执行目标，再由独立执行前策略检查，可减少扫描后换包或漏调用；仅把两个工具装一起不足以成立。用相同包、换包、未扫描、路径别名和取消轨迹验证是否错误放行，必须先核宿主钩子契约。

<a id="plugin-1394489199-root"></a>

## [dsh-plugin-loopback-trust](../../plugins/6mt--dsh-plugin-loopback-trust/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/6mt/dsh-plugin-loopback-trust)

- **用途**：自管DSH经反向代理域名访问时，管理员需要修改模型与持久设置；合格结果是刷新后保留设置，且访问域仍满足部署方信任条件。
- **亮点**：相对用户反复改内存设置或直接修补宿主，插件把反代网页的宿主拥有者事实作为独立客户端适配，零额外服务。它修复的是访问分类与持久设置的衔接，不提供新的认证或设置存储。
- **思考**：恢复持久化所依赖的信任是否与实际来源匹配？client.js对所有非loopback且无已有transport的页面设ownsHost，不按域名白名单判断。它保留服务器Host围栏，但前端能力分类已被放宽；因此有效性依赖反代认证和受信任访问者，不能把设置可写解释为部署安全得到增强。README兼容段残留<0.2表述而package实际<0.3，也需以安装清单核实。
- **建议**：由全页布尔信任替代细分权限推导，可改为服务端签发、绑定会话与origin的设置能力声明，客户端仅在验证声明后开放持久化。相比伪造loopback可减少代理配置与权限分类不一致，但需要宿主协议改造；未验证。以受信任/未授权origin与过期会话测试，若未授权仍可开放设置则否定方案。

<a id="plugin-1335098475-root"></a>

## [dsh-plugin-mall](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1e0zj/dsh-plugin-mall) · [![npm 30d 1603](https://img.shields.io/static/v1?label=npm+30d&message=1%2C603&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)

- **用途**：DSH维护者需要发现第三方插件并避免安装破坏现有profile；合格交付是可解释的安装变更及失败后的可恢复状态。
- **亮点**：相对目录链接加手工安装，实际贡献是把发现开放性与安装冲突预检、profile快照和启动恢复连接起来；guard.js关注补丁组合结果而非单条静态扫描，能解释插件会修改谁的加载行。不是执行安全认证。
- **思考**：核心是“重启成功”如何判定：作者README已明确加载到商城位置不证明整棵树组合完成，guard launch的稳定窗口才补上部分后续失败；进程稳定也不保证业务插件可用。静态预检对动态副作用的边界不能被“验证插件”徽章掩盖。
- **建议**：适合维护多个插件的DSH环境；先在隔离profile验证冲突提示和回滚，再用于日常安装，重要环境保留独立备份。

<a id="plugin-1334267268-root"></a>

## [dsh-plugin-manager](../../plugins/2768651338--dsh-plugin-manager/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-plugin-manager) · [![npm 30d 923](https://img.shields.io/static/v1?label=npm+30d&message=923&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager)

- **用途**：维护多个DSH插件但不熟悉模块名的用户，需要辨认当前Loader行并安全启停，保留已有手写补丁。
- **亮点**：相对官方安装卸载服务，明确增量是可解释目录、行级启停与可编辑备注；独立命名空间保留官方服务。保留注释和表达式的局部编辑比普通解析再序列化更适合既有手写配置，但非通用YAML编辑器。
- **思考**：写盘accepted是否代表插件已激活？setEnabled返回写入结果，实际热加载依赖宿主HMR与fiber状态；保留表达式和系统行限制是强支持，但Loader异步失败仍可能发生。目录说明数量也不等于插件可安装兼容。
- **建议**：需要批量辨认和启停时先在独立profile试用，核对系统保护、表达式拒绝、备份恢复及实际fiber状态后扩用。

<a id="plugin-1367597810-root"></a>

## [dsh-plugin-market（99galaxy）](../../plugins/99galaxy--dsh-plugin-market/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/99galaxy/dsh-plugin-market) · [![npm 30d 1454](https://img.shields.io/static/v1?label=npm+30d&message=1%2C454&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market)

- **用途**：用户在GUI查目录与已安装/可更新项，点击安装；交付profile依赖变化，仍须重启和核对插件加载。
- **亮点**：相对逐条复制安装命令，增量是同屏目录/安装/更新比较、多源缓存与界面操作。目录与pnpm能力归上游，本插件提供接线与状态整理；目录收录/下载不等于质量或兼容。
- **思考**：“装当前profile”与更新是否符合用户预期？index硬编码PROFILE=web，安装/清单都传web；放到其他profile不自动跟随。更新执行目录命令可能从固定Git commit转npm源；多来源回退没有内容同一性证明。pnpm exit0也只说明安装流程结束，不是插件加载或宿主业务验收。
- **建议**：待验证假设：从宿主取得明确profile并让用户审核旧spec→新spec/版本摘要，目录回退绑定签名或摘要，可减少错profile与来源漂移。由硬编码web和目录命令驱动推导，未实现。对照desktop/custom profile、Git固定版转npm及镜像内容不同，测目标准确性和拒绝未知来源；更新保持人工确认。

<a id="plugin-1374274543-root"></a>

## [dsh-plugin-proxy](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-proxy) · [![npm 30d 94](https://img.shields.io/static/v1?label=npm+30d&message=94&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy)

- **用途**：网络环境经常变化的用户希望不重启会话就切换出站路线，验收是目标请求确实经过预期代理。
- **亮点**：lib/index.js用undici setGlobalDispatcher替换全局调度器，设置变化重新应用，旧连接宽限关闭，卸载恢复基线和本插件改过的环境变量。
- **思考**：集中运行期设置简化多处代理配置；进程全局影响也可能改变其他插件的出站路径。
- **建议**：先用可观察测试端点核验fetch与目标客户端，确认无代理或配置错误时的直连回退可接受，再切换真实任务。

<a id="plugin-1336684098-root"></a>

## [dsh-plugin-recommend](../../plugins/863683348--dsh-plugin-recommend/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-recommend) · [![npm 30d 739](https://img.shields.io/static/v1?label=npm+30d&message=739&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-recommend)

- **用途**：适合从广泛目录获取插件候选与替代项，之后还需检查源码与宿主条件。
- **亮点**：作者主张按需推荐；实际增量是将大目录的可解释关键词检索、相似项、去重和分类多样化封成工具。相对模型凭记忆猜名，输出对应条目与命中理由；相似度仅是共享标签/描述词，不能证明可替代性或效果。
- **思考**：在线解析依赖###标题和特定Markdown列表形式，来源改版可能少量成功却漏项。刷新得到的条目没有内嵌目录自动标签，排序条件与静态结果不完全相同；去重在排序前保留首个同仓项，可能丢掉更匹配组件。刷新在进程内生效不等于持久档案或固定版本研究。
- **建议**：待验证假设：采用结构化目录源并对刷新前后覆盖及标签变化做显式审计，比只要parsed非空就成功更可靠。用README改版、部分解析和同仓多组件需求比较漏项与候选质量；无法确认完整时保留旧目录并标未知。

<a id="plugin-1334481905-plugin"></a>

## [dsh-progress-viz-plugin](../../plugins/2008924--dsh-progress-viz--plugin/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/2008924/dsh-progress-viz)

- **用途**：运行长任务的用户希望离开聊天后仍能看到阶段、动作和时间线；交付是会话活动观测，不是业务完成证明。
- **亮点**：相对看板直接解压会话日志，组件增量是由宿主实时输出归一化进度，减少重复解析和噪音；外部Python看板属于仓库其他部分，本组件只提供事件适配与文件协议。
- **思考**：finished语义最影响用户判断：源码handleEvent开头对finished直接return，armIdleTimer会在turn/end后空闲超时设置finished；因此同一会话过了默认15秒再有新一轮时，ensureState仍复用旧对象，后续语义事件会被忽略，直到销毁/重建。它是观测生命周期边界，不可当成任务永久办结。
- **建议**：适合看长任务活动；先验证同会话空闲后继续工作的显示，关键任务以实际产物和会话结果验收。

<a id="plugin-1367305514-root"></a>

## [dsh-reasoning-tiers](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1069137617/dsh-reasoning-tiers) · [![npm 30d 1061](https://img.shields.io/static/v1?label=npm+30d&message=1%2C061&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers)

- **用途**：自定义供应商模型缺少档位元数据时，用户需要恢复可选档位并识别无效配置。
- **亮点**：按知识表和实时模型信息生成设置补丁，带版本写入、重算冲突并记录撤销日志，不接管请求适配器。
- **思考**：配置缝修复比拦截模型请求侵入小；声明能力仍须与真实提供商行为一致。
- **建议**：先备份 profile，对单个模型检查实际请求与撤销结果，再考虑批量补齐。

<a id="plugin-1336583700-root"></a>

## [dsh-recipe](../../plugins/863683348--dsh-recipe/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-recipe) · [![npm 30d 128](https://img.shields.io/static/v1?label=npm+30d&message=128&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-recipe)

- **用途**：新用户想配置一套特定用途的DSH环境，需要先拿到可审阅的插件清单；合格交付是依赖兼容且可恢复的环境，本插件实际终点仅为安装计划。
- **亮点**：相对逐个搜索插件，增量是将场景知识保存为可合并配方并给有序计划；本地、只读的设计使用户可先审阅。数组顺序与名称去重是常规清单处理，不构成依赖求解或安装事务。
- **思考**：“一套环境”是否因清单有序而可用？compose仅first-seen去重，重复插件的不同config没有冲突合并，installSequence只生成plugin add而不应用config、锁版本或校验依赖。故输出可降低选择负担，但不能证明整套兼容或“一键安装成功”。
- **建议**：由配方已有config但安装命令未携带推导，可增加固定版本/配置冲突的只读计划器，先显示冲突与回滚清单再执行。未验证假设是减少配方组合后返工；用两个共享插件但配置相反的配方测试，若不能确定提示冲突则不成立。

<a id="plugin-1384810201-root"></a>

## [dsh-remote-ssh](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh)

- **用途**：维护Unix、AIX或Mac主机的人希望在DSH排障，合格结果是主机明确、输出可信且操作范围可控。
- **亮点**：index.js注册状态、运行及固定探针工具，lib/ssh.js过滤argv、检查命令白名单，以BatchMode调用ssh并限制超时和输出。
- **思考**：固定探针能降低重复取诊断信息的步骤；通用命令允许列表如果过宽，会把权限负担转回操作者。
- **建议**：先使用远端低权限账号和固定只读探针，严格限定命令及参数，确认超时后的远端进程状态；不要把插件白名单当完整沙箱。

<a id="plugin-1424433303-root"></a>

## [dsh-restart-dock](../../plugins/7gzgn--dsh-restart-dock/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/7gzgn/dsh-restart-dock)

- **用途**：Windows DSH用户改完宿主插件后主动重载进程，或仅刷新客户端；交付窗口/宿主恢复状态，不承诺继续旧任务。
- **亮点**：相对找托盘/快捷方式重启，把客户端刷新与宿主重启明确拆成两个界面动作，并加入延迟、状态轮询与进程树报告。独立helper和Windows重拉为既有系统机制，增量是DSH入口及确定目标的恢复接线。
- **思考**：延迟倒计时能否保证当前任务安全落盘？代码只等待设定延迟并强停进程，没有宿主排空或会话提交确认；请求来源护栏也只是本地Web信任控制，不证明任何正在执行任务可中断。只实现Windows重启，helper在job/Explorer失败时可能降级；进程回来了仍不证明插件初始化和业务任务已恢复。
- **建议**：待验证假设：重启前让宿主报告活动任务和持久化屏障，并给用户明确“强制/等待”的选择，可减少延迟够了但会话仍写入的中断。依据是当前时间等待与状态轮询，未实现屏障。用持续日志写入、后台子进程和空闲三类对照，测丢失事件、恢复时间与取消有效性；屏障不可达时需明确强制语义。

<a id="plugin-1422176522-root"></a>

## [dsh-restart-planner](../../plugins/7gzgn--dsh-restart-planner/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/7gzgn/dsh-restart-planner)

- **用途**：Agent安装或修改插件后需要无人值守重载，先返回安排，再由宿主外helper重启并留报告；原任务续接需要核对结果。
- **亮点**：相对Agent要求用户手动重启，贡献是把自重启拆为排程、独立交接和重拉体检，使调用方可先返回。自动续接参考dsh-restart思路，适配0.2的sessionController.prompt；进程管理能力来自系统，新增是DSH恢复生命周期与报告。
- **思考**：日志静默是否等于会话安全提交，续话是否恰好一次？静默是时间启发式，maxWait到期仍可动手；强杀不能保证最后写入。resume每次尝试生成新requestId，网络超时可能已接受，deliverResume会重试；成功后删标记失败又会再次投，因此“失败保留”不能宣称无重放。健康检查也不证明原任务业务恢复。
- **建议**：待验证假设：每个排程持久化唯一resume requestId，并在未知结果先查询原请求、获落盘屏障后才重启，可减少续话重复与末尾事件丢失。由当前随机ID重试和静默观察推导，未实现。用prompt已接受但响应丢失、标记删除失败、持续写日志三类对照，测重复turn、遗漏与等待；宿主不支持查询时应保留unknown请人核对。

<a id="plugin-1376777535-root"></a>

## [dsh-router-loomy](../../plugins/2404723600--dsh-router-loomy/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/2404723600/dsh-router-loomy) · [![npm 30d 1729](https://img.shields.io/static/v1?label=npm+30d&message=1%2C729&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-router-loomy)

- **用途**：面向已登录Loomy且使用dsh-router的用户，想在DSH中使用同一模型通道；成功标准是请求用预期账号完成、异常流可被识别且凭证不误暴露。
- **亮点**：作者明确参照dsh-router-traework同构范式，不能把核心选号、冷却和换号算插件原创。本项增量是Loomy本地会话发现、追踪头与“有[DONE]却无finish_reason”流的区分，处理常规兼容转发容易把半回答当成功的边界。
- **思考**：缺finish_reason是否总能判断坏流并安全重试？sse.ts用completion_tokens>=maxTokens区分撞上限，否则判截断，只有推理无正文也判失败；这匹配作者观测，但合法上游格式变化或usage漏报可能误判。强制核心重试还会增加费用，已产生工具副作用的流需格外核对，不能把重试等同无损补齐。
- **建议**：已有Loomy账号和router环境时先用非敏感只读问题验证当前模型、账号与完整收尾，再测会话刷新和中断；频繁断流时核对是否重复调用，勿直接用于要求一次副作用的任务。

<a id="plugin-1336106328-root"></a>

## [dsh-skill-manager](../../plugins/aks1st--dsh-skill-manager/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-skill-manager) · [![npm 30d 1061](https://img.shields.io/static/v1?label=npm+30d&message=1%2C061&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-skill-manager)

- **用途**：维护用户或项目技能并识别只读系统/预设来源。
- **亮点**：把来源层级与文件可写性绑定，系统/预设只读，realpath校验避免路径逃逸；SKILL前置校验减少错误保存导致技能消失。
- **思考**：ZIP规范化时skillNameByEntry只记录SKILL.md或顶层md，提取循环对其他条目因未映射而continue，因此脚本/引用附件可能未导入，技能列表成功不等于资源包完整。写入也无版本冲突比较，前置格式校验不等于技能语义正确。
- **建议**：未验证假设：按顶层技能目录归属解包全部合法资源，并以manifest摘要做导出再导入一致性核查，可防“有Skill无脚本”。用含references/scripts、多技能与路径逃逸ZIP比较字节集合及拒绝行为。

<a id="plugin-1334434271-root"></a>

## [dsh-sysmon](../../plugins/aks1st--dsh-sysmon/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-sysmon) · [![npm 30d 117](https://img.shields.io/static/v1?label=npm+30d&message=117&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-sysmon)

- **用途**：在DSH内观察主机资源压力，不能直接归因某模型或会话。
- **亮点**：把采样从请求解耦，sampling锁避免重叠，3秒/4096字节限制控制子进程；整机指标呈现便捷，非新监控方法。
- **思考**：失败保留旧缓存而响应没有采样时间/过期标记，可能把陈旧健康值当实时；CPU总核百分比可超100且首样为0，需清晰解释。数据不含进程归因，不能据此推断Agent成本。
- **建议**：未验证假设：返回采样时间、失败状态和容量归一显示可减少误读。模拟连续失败、首次启动与多核满载，比较用户对新鲜度和饱和程度的判断。

<a id="plugin-1335139860-root"></a>

## [dsh-token-billing](../../plugins/2006spy--dsh-token-billing/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing)

- **用途**：多供应商用户要追踪不同路由与缓存桶费用，避免只看模型别名误估；合格交付是可对账的费用估算及可导出账本。
- **亮点**：相对token总量乘单价，增量是把路由、时段、缓存桶和订阅/免费/本地模式分开，且把短暂估算与落地账本区分；不是服务商结算系统，内置价格不能自动视为当前适用合同。
- **思考**：最关键是账本身份及单价可追溯：ledger.js 的 mergeSteps 对 seen.has(key) 直接 continue，既有相同 session|turn|step 记录不会经此合并路径被修订；是否实际遇到最终 usage 回补被忽略尚未运行验证。默认汇率与 fallback 价也只是估算前提。临时文件替换不单独证明多进程写入不会丢失。
- **建议**：适合需要多路由费用参考的用户；先对照供应商账单核实缓存、峰谷和币种口径，再据看板调整预算。

<a id="plugin-1351594249-root"></a>

## [dsh-tool-explorer](../../plugins/6pofx--dsh-tool-explorer/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/6pofx/dsh-tool-explorer) · [![npm 30d 673](https://img.shields.io/static/v1?label=npm+30d&message=673&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-tool-explorer)

- **用途**：维护多个Skill和MCP的DSH用户需要从配置文件转向统一管理，合格交付是配置正确生效、变更冲突被发现、删除可恢复，而非仅列表显示成功。
- **亮点**：相对手工编辑多个配置、复制Skill目录，增量是将发现、编辑、生效与恢复组织到一处，并对模型/用户调用开关分轴管理。README承认参考已有Skill管理插件，垃圾箱与配置管理是成熟机制的场景组合，不是新的分布式配置算法。
- **思考**：界面中的“可恢复管理”能否覆盖全部失败？更新路径先复制备份、删除本地目录，再复制新内容；只有新内容复制异常分支回滚，备份阶段及后续lock写入不在同一事务，不能推断任意中断均原子恢复。MCP expectedHash在undefined时跳过围栏，也不能将可选冲突检测解释为所有写入都受保护。
- **建议**：由磁盘Skill、lock与宿主热加载分阶段更新推导，可增加带预期哈希的变更计划与事务日志，先暂存完整目录再原子切换，并在重启时完成/回滚lock。相对当前异常捕获，它覆盖进程终止窗口；未验证。对复制后、目录切换后、lock写入前注入终止，若无法恢复一致版本则不成立。

<a id="plugin-1343420855-root"></a>

## [dsh-ui-auth](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1608](https://img.shields.io/static/v1?label=npm+30d&message=1%2C608&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth)

- **用途**：需要让多个用户访问 DSH Web 的部署者，需要认证入口和数据访问边界。
- **亮点**：包装 HTTP 与 upgrade 入口，现代网关按会话处理认证；宿主能力缺失时 fail-closed。
- **思考**：统一入口与关闭式失败路径是有效机制；全接口安全仍依赖覆盖、宿主升级和反代配置。
- **建议**：先在隔离环境逐一测试 HTTP、WebSocket 和多用户访问，不把安装成功当成公网安全保证。

<a id="plugin-1333954586-root"></a>

## [dsh-usage-billing](../../plugins/940842546--dsh-usage-billing/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-usage-billing) · [![npm 30d 1231](https://img.shields.io/static/v1?label=npm+30d&message=1%2C231&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-billing)

- **用途**：自管DSH用户想按会话理解模型花费，合格结果是token来源、计价版本与官方账单可对齐，估算与实际扣费必须区分。
- **亮点**：相对只看单次token，增量是把历史、时间价格段、预算阈值和会话组织为持续消费视图。它是本地估算与观测，不是供应商账单或费用硬上限。
- **思考**：缺失价格或usage会不会显示得像免费？classifyModel仅用flash/pro子串，其余other；recordUsage找不到价格回落hit/miss/out全0，num也将非数值回为0。因此真实未知模型可能有调用但估费为0，不能据此结算或宣称免费。当前官方价格未在本轮独立核实，内置规则只能作为固定版本作者配置。
- **建议**：由可配置价格与未知归零推导，可将“已计价/未计价/usage缺失”分账，价格表绑定生效日期与来源，并用官方账单差额校准。未验证假设是减少被低估的预算决策。用未知模型、缺usage、调价跨界和缓存字段缺失事件对照账单，若仍把未知金额合入零则否定。

<a id="plugin-1334023305-root"></a>

## [dsh-usage-dashboard-plus](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus) · [![npm 30d 1066](https://img.shields.io/static/v1?label=npm+30d&message=1%2C066&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-dashboard-plus)

- **用途**：多模型 DSH 用户希望知道账户余额及当天花费；合格交付是带价格口径的估算与可追查调用记录。
- **亮点**：相对只看服务商余额，插件将会话用量、视觉旁路调用和模型分组放到一个入口，补足主模型账单看不到辅助调用的观察盲区；余额与日志费用来自不同路径，属于观测整合而非精确账务系统。
- **思考**：同一条调用能否恰好计一次以及价格是否匹配路由最影响费用可信度。源码有默认与日期价格表，也给未识别模型 fallback 价格；未知模型被赋通用价不能当实际账单，外部日志格式/重复输入及本地日界线仍需对账。
- **建议**：适合用量观察；先用自己账单核对一天数据，并为未知模型补价，再据此设预算。

<a id="plugin-1377159975-root"></a>

## [dsh-vps](../../plugins/aicivilization--dsh-vps/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-vps) · [![npm 30d 3485](https://img.shields.io/static/v1?label=npm+30d&message=3%2C485&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vps)

- **用途**：管理员希望从公网使用自管DSH，合格部署需认证、代理和特权接口一致且升级可恢复；页面能打开不等于全部权限/生命周期验收。
- **亮点**：相比裸反代，增量是将登录门、DSH会话认证、远程部署与可恢复升级串为管理流程。TLS/systemd/DSH能力归上游，插件承担安全接线和运维责任。
- **思考**：“原生界面全部可用”是否保持原信任边界？网关注入ownsHost使公网页获得本来loopback拥有者分类，因此认证门必须覆盖HTTP/WS/插件控制路径。远程安装拉main脚本，固定研究SHA不约束未来下载内容；SSH断线后后台仍运行，未知结果不能直接重装。源码不是公网渗透/恢复验收。
- **建议**：由登录与宿主信任提升绑定推导，可输出版本化权限/代理覆盖清单，并固定远程脚本摘要与安装任务ID，重连先查询状态再决定重试。未验证；逐路由未登录/过期cookie/WS与断线恢复测试，若特权路径漏门或重复安装则否定。

<a id="plugin-1334255288-root"></a>

## [dsh-web-lan-access](../../plugins/acidgr--dsh-web-lan-access/INSIGHT.md)

[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access) · [![npm 30d 1548](https://img.shields.io/static/v1?label=npm+30d&message=1%2C548&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access)

- **用途**：可信私网内跨设备访问DSH，要求能打开设置且访问边界明确。
- **亮点**：将监听、Host地址围栏与客户端能力声明配套，解决只加载页面但API/设置不可用的问题。网络服务和权限机制来自宿主，插件主要是兼容适配。
- **思考**：能访问是否等于已认证？trustedHosts按本机地址生成、ownsHost是页面声明，均不鉴别人或设备。通配监听还主动解除宿主原有限制；有VPN网卡不等于所有可达请求可信。
- **建议**：由三层接线推导，可将远程能力声明绑定短期认证会话及允许接口清单，保持监听地址与用户身份分离。未验证；无凭据、过期会话和新网卡加入均应不能取得Host写能力，否则否定。

<a id="plugin-1335060007-root"></a>

## [dsh-web-restart](../../plugins/1123762794--dsh-web-restart/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-restart)

- **用途**：Windows 本机调试人员希望从浏览器重启 DSH，不再切回终端。
- **亮点**：POST /restart-dsh 延迟启动隐藏 PowerShell，读取硬编码 D:\1\dsh-web-host.ps1；健康路由只报告当前进程存活。
- **思考**：便利入口不能替代可靠的进程管理；返回触发成功不能当作重启完成。
- **建议**：当前更适合参考实现，先在可丢弃 profile 验证脚本路径、失败反馈和会话恢复。

<a id="plugin-1366583376-root"></a>

## [dsh-web-url-view](../../plugins/1032740078--dsh-web-url-view/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view)

- **用途**：桌面版每次重启更换端口和令牌时，用户希望有稳定的浏览器入口。
- **亮点**：固定端口代理在内部换取当前实例会话 cookie，转发 HTTP/WebSocket 并处理 Host、Origin 与 cookie。
- **思考**：稳定地址能减少复制地址的操作；将访问扩展到局域网会改变访问控制需求。
- **建议**：先保持回环绑定，测试重启后的令牌更新与拒绝外部 Origin，再考虑受控网络访问。

<a id="plugin-1351854066-root"></a>

## [dsh-wsl-clock](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clock)

- **用途**：笔记本休眠后WSL联网或令牌异常，开发者希望先确认时钟是否明显漂移，验收是找到实际故障原因。
- **亮点**：lib/clock.js先取WSL Date.now，再通过PowerShell取Windows毫秒时间，计算偏差等级并返回诊断建议。
- **思考**：把常见休眠漂移变成具名探针有帮助；单次偏差不能直接解释所有TLS失败。
- **建议**：先把它当粗粒度线索，临界偏差用系统命令复核；保存工作后再考虑关闭WSL或同步时间。

<a id="plugin-1391141174-root"></a>

## [dsh-wsl-defender](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-defender)

- **用途**：开发者排查Windows环境状态时需要把系统安全配置带入会话，合格结果是可核对的当前状态而非安全认证。
- **亮点**：defender-exec.js经PowerShell调用Get-MpComputerStatus等只读命令，defender.js规范化结果并将杀毒数据缺失显示为不可用。
- **思考**：合并多个状态命令方便排障；快照不能代替持续防护，也不把没有返回数据当作已确认无威胁。
- **建议**：作为状态收集工具使用，对关键异常回到Windows安全中心核对；遇到unavailable先查权限和安全产品。

<a id="plugin-1350379001-root"></a>

## [dsh-wsl-distro](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro)

- **用途**：安装多个发行版的用户容易把Windows默认WSL与当前会话混淆，希望先确认目录属于哪一个系统。
- **亮点**：lib/distro.js读取WSL_DISTRO_NAME和os-release，执行wsl.exe -l -v并解析表格，比较当前与默认发行版。
- **思考**：提醒默认发行版不等于当前会话能避免路径误用；发行版名字本身不能证明用户、挂载和权限一致。
- **建议**：适合多发行版开发者，先核对current/default与UNC路径，再在目标发行版确认文件存在。

<a id="plugin-1351854118-root"></a>

## [dsh-wsl-dns](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns)

- **用途**：WSL联网异常而Windows正常时，用户需要两端同域名解析证据，以缩小故障范围。
- **亮点**：lib/dns.js读取resolv.conf，分别调用Node resolve4和Windows GetHostAddresses，去重排序后标记地址集合不一致。
- **思考**：同屏比较便于发现单侧解析失败；地址不同只支持差异事实，不支持唯一故障原因。
- **建议**：只作为差异线索，先用稳定测试域名核对，再结合HTTPS与代理探针；企业分流DNS环境不要仅因不一致改配置。

<a id="plugin-1351854301-root"></a>

## [dsh-wsl-docker](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker)

- **用途**：开发者在Docker Desktop和WSL引擎之间排障，想确认容器、GPU和推理服务处于哪一层失败。
- **亮点**：lib/docker.js执行Docker只读命令，按名称/镜像/8000端口识别候选，查询runtime并探测HTTP，生成后续建议。
- **思考**：能把CLI存在、daemon可达和候选推理容器分开；启发式绿色状态仍需应用层验收。
- **建议**：先用作收集context与容器信息，再用受控/v1/models和小请求验证API；不要因portHealth为ok就交付推理服务。

<a id="plugin-1351854402-root"></a>

## [dsh-wsl-encoding](../../plugins/173787247--dsh-wsl-encoding/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-encoding)

- **用途**：在WSL运行Windows目录中的脚本时，先识别编码和换行问题，避免反复猜测bash错误。
- **亮点**：相对手动分别执行chcp和检查脚本，把跨系统编码信息与修复建议汇成一个诊断结果；贡献是诊断集成，未证明新的编码识别方法。
- **思考**：sampleLineEndings先读取完整文件再切片，8192字节仅限制分析而不限制读取成本；采样未发现CRLF也不能排除文件后部的问题。
- **建议**：本次未形成新的创新假设；优先验证有界读取与报告范围是否一致，再考虑跨文件诊断。

<a id="plugin-1338530482-root"></a>

## [dsh-wsl-env](../../plugins/173787247--dsh-wsl-env/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-env)

- **用途**：Agent运行在WSL而浏览器位于Windows时，避免混用Windows路径、Shell和工具安装位置。
- **亮点**：把启动时环境事实写入宿主提示词，相比每次人工提醒减少环境说明重复；这是环境适配，没有证据证明提示词能强制约束工具行为。
- **思考**：提示段混合探测事实与固定经验规则，存在设置变化后提示过期的可能；新会话是否使用该段仍需宿主核查。
- **建议**：待验证假设：把动态探测事实与静态建议分开并标明观察时间，可能降低模型把经验规则当成当前环境的错误。

<a id="plugin-1391143266-root"></a>

## [dsh-wsl-eventlog](../../plugins/173787247--dsh-wsl-eventlog/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-eventlog)

- **用途**：排查Windows端故障时，在Agent对话内取得可定位的事件记录，而不是来回打开事件查看器。
- **亮点**：把Windows事件查看器中的只读查询变成结构化工具，降低跨界面取证成本；事件采集方法来自系统接口。
- **思考**：Get-WinEvent先应用MaxEvents，再过滤provider和since条件；返回空集不表示该来源在完整时间范围内没有事件。
- **建议**：待验证假设：将来源与时间条件尽量下推到事件查询，可在相同输出上限下提高相关故障召回；需比较执行时间。

<a id="plugin-1351853956-root"></a>

## [dsh-wsl-expose](../../plugins/173787247--dsh-wsl-expose/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-expose)

- **用途**：需要从Windows或局域网访问WSL服务时，明确监听地址和转发路径，避免盲目修改网络设置。
- **亮点**：把诊断、命令预览和受限执行整合为单一流程；相对手工netsh降低参数拼接负担，尚不能证明对所有WSL网络模式有效。
- **思考**：apply仅添加portproxy，展示的防火墙命令没有一并执行；返回ok不能证明局域网访问已经打通，默认监听地址为0.0.0.0也扩大了暴露范围。
- **建议**：本次未提出新创新假设；先补充转发后可达性与回滚验证，比增加更多网络配置开关更有价值。

<a id="plugin-1350378777-root"></a>

## [dsh-wsl-gpu](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-gpu)

- **用途**：部署本地模型时，先区分驱动不可见、显存紧张和推理服务连接问题。
- **亮点**：把设备状态与服务端口放在同一诊断报告中；相比手动排查减少信息拼接，但未建立实际显存归因模型。
- **思考**：端口开放不能证明对应进程占用GPU，显存比例也不等同目标任务可运行；服务争用建议主要是启发式。
- **建议**：待验证假设：把进程显存和端口所属进程关联，可比单纯开放端口更准确地解释争用；若权限与维护成本过高则保留基础诊断。

<a id="plugin-1351854010-root"></a>

## [dsh-wsl-hostsvc](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-hostsvc)

- **用途**：本地模型运行在Windows而DSH运行于WSL时，找到实际可用的服务地址。
- **亮点**：把传输连通、API就绪和配置生成串联，相比只看TCP端口更接近模型接入需求；没有证明真实生成成功。
- **思考**：models接口就绪不证明聊天、工具调用或目标上下文大小可用，自动生成配置仍需核对模型实际能力。
- **建议**：待验证假设：将探测拆为TCP、模型列表、最小生成三层，可能减少配置看似正确但首个任务失败的情况；最后一层需单独执行授权。

<a id="plugin-1381389698-root"></a>

## [dsh-wsl-jev](../../plugins/173787247--dsh-wsl-jev/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-jev)

- **用途**：已有Agent希望把有限判断交给专用决策服务，同时记录返回模型和耗时。
- **亮点**：将Jev决策接口转换为宿主工具，支持选择、检查与排序的共同入口；判断能力归于外部模型，插件贡献是协议适配。
- **思考**：截断state可能删去决定性证据，规则脱敏也不能识别全部敏感信息；服务返回answers并不证明判断准确或已校准。
- **建议**：待验证假设：在发送前附带截断与证据覆盖标记，可能使调用方对信息不足的判断选择弃答；需与简单长度限制对照。

<a id="plugin-1381832318-root"></a>

## [dsh-wsl-llamacpp](../../plugins/173787247--dsh-wsl-llamacpp/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-llamacpp)

- **用途**：DSH用户希望把部分明确任务交给本地模型，而不更换主会话模型。
- **亮点**：把标准OpenAI兼容服务封装为独立工具，便于主Agent按需调用本地模型；推理能力来自后端，不构成新的模型算法。
- **思考**：maxPromptChars仅在prompt回退分支截断，显式messages不经过同一限制；status可达也不代表模型支持目标任务和上下文。
- **建议**：待验证假设：按最终序列化messages统一预算，并明确拒绝而非静默截断关键证据，可能减少难以解释的本地模型失败。

<a id="plugin-1351854159-root"></a>

## [dsh-wsl-mnt](../../plugins/173787247--dsh-wsl-mnt/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-mnt)

- **用途**：在WSL开发时识别工作区是否落在/mnt盘，避免把挂载盘性能与换行问题误归给模型。
- **亮点**：把目录位置和常见开发问题联系到可操作提示；属于路径启发式诊断，未测量文件系统实际吞吐。
- **思考**：路径在/mnt与否不等同实际性能，工具的建议不能证明迁移一定更快，也不负责迁移后的数据一致性。
- **建议**：本次未形成新创新假设；优先用目标工作负载比较迁移前后耗时，避免把路径标签当性能结论。

<a id="plugin-1338965593-root"></a>

## [dsh-wsl-net](../../plugins/173787247--dsh-wsl-net/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net)

- **用途**：Agent或npm无法联网时，区分代理未继承、端口不可达和目标HTTPS失败。
- **亮点**：把当前进程、DSH进程和子进程的代理差异显式化，相对只看Shell环境更接近故障来源；不是自动网络修复保证。
- **思考**：检测到的DSH PID可能不是当前会话所属进程，子进程补环境也不会修复已运行宿主；探测成功不保证所有目标和模型调用成功。
- **建议**：待验证假设：以宿主实例身份而非进程名匹配诊断对象，可减少多实例下的错误环境归因。

<a id="plugin-1381724774-root"></a>

## [dsh-wsl-ollama](../../plugins/173787247--dsh-wsl-ollama/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ollama)

- **用途**：Agent按需把任务或文本嵌入交给已有本地模型服务，保留主会话工作流。
- **亮点**：将本地推理服务包装为DSH工具；地址探测便利于WSL接线，模型能力和隐私边界仍取决于实际服务。
- **思考**：自动地址推断可能受WSL网络模式与resolv.conf影响，不能把自动选中地址当正确服务；模型列表不证明聊天和嵌入均可用。
- **建议**：本次未形成新创新假设；先将服务地址、模型ID和具体能力分别验证，避免通过一个状态探测推断全部就绪。

<a id="plugin-1391142601-root"></a>

## [dsh-wsl-perf](../../plugins/173787247--dsh-wsl-perf/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-perf)

- **用途**：WSL开发者排查整机资源紧张，需要区分Windows宿主与Linux侧指标。
- **亮点**：相对在Windows任务管理器人工查看，增量是将宿主资源快照接入Agent；指标与采集机制继承Windows接口，不是新监控算法。
- **思考**：高内存进程列表不等于高CPU列表，cpuSec是累计CPU时间；单次CPU快照不足以定位持续瓶颈，缺字段又会被num归零。
- **建议**：待验证假设：连续两次采样并保留缺失值，可把累计CPU时间转为区间占用并减少缺失当零的误判；尚未实现。

<a id="plugin-1350378913-root"></a>

## [dsh-wsl-port](../../plugins/173787247--dsh-wsl-port/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-port)

- **用途**：Windows无法打开WSL服务时，需要先分辨本地无监听与跨系统访问链路问题。
- **亮点**：把本地监听检查和DSH特定操作手册合成诊断入口；不执行Windows端连接测试，也不自动修复网络。
- **思考**：监听成立只证明Linux局部状态；建议绑定套件脚本与特定端口，Windows中继是否可达和认证是否通过没有观测。
- **建议**：待验证假设：把Linux监听、Windows中继和带认证UI检查分成独立证据，可减少把监听当办结；需要安全传递状态而非把token写入报告。

<a id="plugin-1391140034-root"></a>

## [dsh-wsl-power](../../plugins/173787247--dsh-wsl-power/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-power)

- **用途**：运行长任务前，用户希望查看宿主电源策略和电池状态以评估中断可能。
- **亮点**：将Windows电源只读查询放进Agent上下文，减少切换设置页；不修改计划，也未建立任务防中断机制。
- **思考**：计划与睡眠解析匹配英文输出，本地化Windows可能漏报；Hibernate子串判断不区分可用与不可用列表，不能把该布尔值当可靠能力验收。
- **建议**：本次未形成新创新假设；先验证语言无关查询与休眠可用性语义，避免据错误状态推演调度。

<a id="plugin-1391142974-root"></a>

## [dsh-wsl-registry](../../plugins/173787247--dsh-wsl-registry/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-registry)

- **用途**：WSL中的Agent排查Windows安装和配置，输出可追溯键值而非让用户反复复制注册表信息。
- **亮点**：把Get-Item/Get-ItemProperty接成受限只读工具；增量是跨系统接线和输出约束，注册表查询能力来自Windows。
- **思考**：白名单用startsWith而非路径段边界匹配，不能仅凭前缀断言严密隔离；指定name的查询没有像批量值分支一样在脚本内截断400字符，作者笼统截断说明需限定。
- **建议**：待验证假设：按注册表规范化路径段校验并统一所有输出分支预算，可保留配置诊断便利而减少越界和过大结果；规则复杂度可能抵消便利。

<a id="plugin-1381733290-root"></a>

## [dsh-wsl-secret](../../plugins/173787247--dsh-wsl-secret/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-secret)

- **用途**：Agent调用外部服务时，希望避免用户把完整密钥直接粘贴进聊天。
- **亮点**：复用已有秘密存储并把解密值交给后续工具，减少直接回传完整秘密；这不是密钥隔离服务。
- **思考**：process.env是进程共享状态，后续插件或子进程可能继承；前后缀预览仍泄漏部分秘密。age路径仅词法检查未realpath，符号链接边界需验证，不能把allowPrefixes视为完整隔离。
- **建议**：待验证假设：为单次获准子进程注入环境并在结束后撤销，可缩小暴露范围；依赖工具若只读宿主全局环境则需新增接口。

<a id="plugin-1391140376-root"></a>

## [dsh-wsl-service](../../plugins/173787247--dsh-wsl-service/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-service)

- **用途**：Agent排查Windows后台服务问题时，先收集状态和依赖证据再由用户决定修复。
- **亮点**：把服务概况和详细依赖接入对话，减少人工跨系统采集；服务控制与诊断结论仍不由插件提供。
- **思考**：detail中依赖查询异常被吞掉为空数组，空依赖可能是未能读取而非确实没有；状态参数all被直接用于Status比较也需核对实际语义。
- **建议**：待验证假设：每个依赖字段附带读取成功状态，可减少把未知依赖当无依赖的误诊；增加字段能否改善判断仍需试验。

<a id="plugin-1381832935-root"></a>

## [dsh-wsl-struct](../../plugins/173787247--dsh-wsl-struct/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct)

- **用途**：需要从本地 JSON/YAML 配置和 SQLite 缓存提取字段的开发者，以查询结果而非完整文件作为交付物。
- **亮点**：作者称为沙箱化查询；相对直接让模型拼 bash，已实现的增量是统一文件入口、SQL 只读开关和截断标记，而 jq/yq/SQLite 的查询算法来自外部 CLI。能减少常见命令拼接，但不构成操作系统沙箱。
- **思考**：最关键的条件是文件 allowRoots 是否等于表达式的全部读边界。源码仅检查主文件，yq 表达式原样交给外部程序；不同 yq 实现可能带额外文件/环境读取功能，不能据此宣称完整沙箱。SQL 黑名单也会误拒字符串中的 UPDATE 等词。
- **建议**：适合有固定配置查询的开发者先在副本中试用；显式缩小 allowRoots，核实 yq 版本及表达式权限，不把它当不可信查询隔离器。

<a id="plugin-1381843201-root"></a>

## [dsh-wsl-systemd](../../plugins/173787247--dsh-wsl-systemd/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-systemd)

- **用途**：WSL 内维护 Ollama 等用户服务的人，想从服务状态和日志定位故障，交付是可人工解释的诊断材料。
- **亮点**：相对原生 systemctl/journalctl 手工执行，贡献是把用户会话范围和有限日志抽成模型工具，未新增服务管理机制；注册层没有 start/stop/enable，有利于把诊断和修复责任分开。
- **思考**：userAvailable 把退出码0/1/3映为可用，这只是探测近似；能访问用户总线并不证明目标服务存在或健康。缺日志权限、无用户会话和应用故障应分别判定，否则诊断会把环境问题归到服务。
- **建议**：适合已用 systemd --user 管理服务的人做只读排障；先确认用户总线和日志权限，修复服务仍需人工操作。

<a id="plugin-1381843937-root"></a>

## [dsh-wsl-terraform](../../plugins/173787247--dsh-wsl-terraform/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-terraform)

- **用途**：基础设施维护者需要审阅拟变更资源，以计划计数、验证输出和资源地址交付复核，不在工具内执行部署。
- **亮点**：相对任意 shell 运维，增量在于暴露计划审阅的窄接口、禁止注册 apply/destroy；Terraform 的规划与 provider 行为仍属上游。用户可先看变更再走独立审批，不能把无 apply 等于无副作用。
- **思考**：核心质疑是“只读计划”是否可靠。plan 默认 refresh=true，可能联网、读取凭据和 provider/数据源；allowRoots 空时不限制目录。tfPlanSummary 只把退出码1当失败，其他异常退出可能被包装 ok:true，故摘要不能作为放行凭证。
- **建议**：适合已有 Terraform 审批流程的人先审阅沙盒计划；显式配置 allowRoots 和凭据，任何摘要都要回看完整计划后决定部署。

<a id="plugin-1351853903-root"></a>

## [dsh-wsl-tray](../../plugins/173787247--dsh-wsl-tray/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tray)

- **用途**：Windows 使用者希望在 DSH Web 不可达时从桌面启动、重启或查看健康，以能打开当前令牌 URL 为交付。
- **亮点**：相对记忆 WSL 命令，贡献是把恢复入口放在宿主 UI 外、保留 token URL 并处理 UNC/引号/BOM 互操作；实际重启和中继仍由 dsh-wsl-kit 实现，不应归为本插件的服务恢复算法。
- **思考**：关键是故障时外部恢复链是否可用。kit 仅以 restart 脚本存在确认，启动后固定等12秒、只检查 URL 含 token=；不保证令牌新鲜或服务健康。FALLBACK_KIT_PATHS 调用未导入的 readdirSync，被 catch 吞掉，Windows fallback 自动发现不会执行成功。
- **建议**：适合已使用 dsh-wsl-kit 的 Windows 用户；显式设置 kitPath，先从快捷方式实际启动一次，再依赖托盘恢复，不把生成脚本成功当启动成功。

<a id="plugin-1381832640-root"></a>

## [dsh-wsl-vllm](../../plugins/173787247--dsh-wsl-vllm/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-vllm)

- **用途**：已运行 vLLM 的开发者让当前 Agent 调用另一个本地模型生成文本，以模型回复和 usage 为交付。
- **亮点**：相对直接 curl OpenAI 兼容端点，增量是 DSH 状态/调用工具和错误归一；不是宿主模型供应商注册，也未实现 vLLM 部署、调度或推理优化。
- **思考**：核心问题是工具级第二次模型调用是否增加合格交付。status 的 ok:true 可同时 reachable:false；prompt 超32,000字符静默切片，可能丢关键尾部，不返回截断标记。无任务级评估不能说替代云模型成本更低。
- **建议**：适合已有 vLLM 服务的人做少量文本任务试用；先查 reachable 和 model，长提示自行拆分，不把 status.ok 当服务健康或完整回答保证。

<a id="plugin-1351854461-root"></a>

## [dsh-wsl-wslconfig](../../plugins/173787247--dsh-wsl-wslconfig/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wslconfig)

- **用途**：Windows/WSL用户排查localhost和本地模型连接，交付为配置摘录及需人工验证的网络建议。
- **亮点**：相对手工打开配置文档，增量是聚合配置与DSH :3081中继提醒；没有主动网络测试或Windows设置更改，网络机制来自WSL平台。
- **思考**：关键是配置文本能否代表运行网络模式。文件可能尚未应用、找错用户或超过2000字符；读取异常被吞，仍ok:true。静态mirrored/NAT建议不能替代实际端点探测，NAT也不能一概判不可达。
- **建议**：适合查配置的辅助入口；先确认实际Windows用户路径，网络问题仍要测端口，修改和 wsl --shutdown 由用户评估后执行。

<a id="plugin-1406500233-root"></a>

## [dsh-zspace](../../plugins/439436269-ctrl--dsh-zspace/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-zspace) · [![npm 30d 1242](https://img.shields.io/static/v1?label=npm+30d&message=1%2C242&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-zspace)

- **用途**：已有极空间NAS的用户在本地或远程网络用会话管理文件与诊断容器；交付是核实后的文件状态和设备状态。
- **亮点**：相对手工NAS界面或单WebDAV连接，将跨网络桌面中转与局域网直连封装为同一模型工具面；容器健康用真实进程列表区别于表面running，避免把探针没运行解释为健康。
- **思考**：自动回退对读取和写入并不等价。router将remove/move/copy/upload等均路由，WebDAV请求已生效但响应超时仍可能在relay重试，存在结果未知后重复副作用；两通道删除回收站语义也不同。confirm=true是参数条件，不能代替用户意图确认或幂等保证。
- **建议**：先用只读列表、stat及测试文件评估；重要写入和删除固定通道并核对结果，网络失败后确认实际状态再重试。

<a id="plugin-1363429979-plugin-usage-billing"></a>

## [Forge 用量计费](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1814](https://img.shields.io/static/v1?label=npm+30d&message=1%2C814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing)

- **用途**：需要了解模型使用支出的开发者希望把日志用量与预算放在同一视图。
- **亮点**：服务聚合账本分片并锁定价格快照，联网价表与汇率有缓存和降级；未知项目不静默记零。
- **思考**：锁定历史价格能避免改价反写旧账；价格来源或使用日志不准时，账本仍可能精确记录错误值。
- **建议**：先选择一个模型和一天真实账单，逐项核对 token、缓存计价、币种和未计价行。

<a id="plugin-1334569518-root"></a>

## [model-usage-plugin](../../plugins/aks1st--model-usage-plugin/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/model-usage-plugin) · [![npm 30d 991](https://img.shields.io/static/v1?label=npm+30d&message=991&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/model-usage-plugin)

- **用途**：在DSH内理解模型消费结构，作预算线索而非财务账单。
- **亮点**：将缓存读写、失败调用、工具活动和时间台账组成消费观察链，并有价格迁移与用户配置保护；统计机制是接线和账本管理，不是新计费模型。
- **思考**：费用依赖内置/自填价格、汇率和provider/套餐归属；TokenPlan只记token不计费不代表订阅经济成本为零。流包装只保留最后usage，依赖宿主usage为完整口径；工具按最近模型归因是启发式，不等于工具由该模型因果产生。
- **建议**：未验证假设：每个费用单元带价格生效版本、usage口径与归因可信度，再与供应商账单对账，可降低预算误差。比较跨provider同名模型、缓存、套餐、中断和历史迁移，报告无法对账而非归零。

<a id="plugin-1333357514-root"></a>

## [Qiushi DSH Evidence Audit](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit) · [![npm 30d 1208](https://img.shields.io/static/v1?label=npm+30d&message=1%2C208&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)

- **用途**：需要排查执行记录是否缺失或被改动的本地部署者，关注观察链的一致性。
- **亮点**：工具结果和事件被规范化、哈希化，再以 previousRecordHash 连接到追加记录。
- **思考**：不记录参数明文可减少隐私暴露，但也限制事后解释；不能把不可读哈希当成充分审计证据。
- **建议**：用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。

<a id="plugin-1400927706-root"></a>

## [Quota 用量仪表](../../plugins/121212165--dsh-plugin-quota/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota) · [![npm 30d 138](https://img.shields.io/static/v1?label=npm+30d&message=138&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota)

- **用途**：长任务开发者希望在继续调用前看到消耗趋势和可能的预算边界。
- **亮点**：监听 assistant/message usage 累加本地账本，通过 systemPrompt 注入一行仪表，/qm 与工具展示统计。
- **思考**：及时可见的消耗有助于做继续决策；金额和下步预测不能替代账单与强制限额。
- **建议**：先与一天供应商用量对账，检查缺失 usage、重复事件和价格单位，再启用预算提醒。

<a id="plugin-1416699252-root"></a>

## [元冰可 AI 资源治理平台](../../plugins/01men--ybkkasi/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/01men/ybkkasi)

- **用途**：已有多部门AI资源的管理员需要统一资源责任、授权与审计，交付受控访问和治理记录；单用户可先用配置文件加API网关。
- **亮点**：相对业务路由重复鉴权样板，增量是将principal、权限点、路由声明和审计主体统一到rest-gate接口，并在bootAll恢复存储后做装配健康检查。Cordis依赖树与通用RBAC归既有方法，插件贡献是企业AI资源治理接线与责任归属，不是由模块规模推导创新。
- **思考**：共享gate是否证明所有入口受同一治理？console是principal构造点，bootAll也明确portal公开只读先于console，部分public path内部自校验；只审gate不能推断全入口覆盖。IMPLIED_POINTS在前端有镜像，声明与真实写副作用可能漂移；审计record调用也不等于事务已持久化，需故障恢复和越权反例。
- **建议**：待验证假设：从routeMatrix生成主体×权限×副作用清单，再与实际存储写入/公开入口逐一比对，可更早发现漏接治理。由注册声明集中但覆盖尚未完整验证推导，未实现自动覆盖证明。选两个部门及一条MCP业务链，测试许可、拒绝、public例外、令牌吊销与审计写失败；若越权写入或无审计变更存在则否定治理闭环，维护映射人时应单列。

<a id="plugin-1358816037-root"></a>

## [模型信息补全](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill)

- **用途**：维护多个自定义模型的用户需要减少重复填写上下文、输出上限与推理声明。
- **亮点**：Host 拉取并缓存能力目录，构造缺失字段操作，通过 settings.mutate 带版本写入；模型保存可单独调整。
- **思考**：不凭会思考就编造离散档位是合理边界；默认值仍是用户假设而非外部事实。
- **建议**：先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。

## 更新时间

2026-10-21
