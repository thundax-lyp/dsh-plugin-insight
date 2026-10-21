# 基础设施

[返回首页](../../../README.md)

模型接入、认证、运行环境与系统支撑。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [DSH Telemetry Redactor](#plugin-1333368566-root) | 在遥测记录瀑布中递归脱敏支持的凭据模式，保留原始会话日志。 | 先在测试遥测里放入假密钥、普通文本和 token 计量字段，核对脱敏与保真后再接后端。 |
| [dsh-anatomy-panel](#plugin-1366089972-workspace-plugins-dsh-anatomy-panel) | 读取Agent-Body运行时文件，在宿主HTTP路由展示器官体征、心跳、愈合账本与脉冲。 | 先限制在本地受控宿主使用，检查缺失数据能否报503，并核对脉冲文本的展示边界后再接入多人环境。 |
| [dsh-api-dashboard](#plugin-1346196699-root) | 在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。 | 先选择实际可查询的平台，对照控制台账单和混合币种；把看板作为预警与估算入口，自更新前保留配置和回退。 |
| [dsh-armory](#plugin-1413052822-root) | 在 DSH 中管理 MCP、技能、专家、插件市场及工具账本，支持项目作用域与授权引导。 | 已有多个MCP时在独立项目试用导入和作用域隔离，核对实际工具与来源登记；OAuth与市场安装新增路径需单独验收，不依据零调用账本批量停用工具。 |
| [DSH-Official-WorkBuddy-Credit-Proxy](#plugin-1387227102-root) | 将本机 WorkBuddy、CodeBuddy 账号接入 DSH 模型池，并提供多协议代理与积分面板。 | 仅在本人账号和明确上游使用条件下隔离试用，先验证真实客户端工具闭环与协议降级；不要只凭响应200扩大使用。 |
| [dsh-organism](#plugin-1366089972-workspace-plugins-dsh-organism) | 把插件组织为可观测器官，提供心跳、反射、自愈账本和工具schema按需门控。 | 适合愿意维护统一器官协议的实验环境；先只开启观测，再逐条批准恢复路径，验证重复故障不会重复副作用。 |
| [dsh-plugin-adapter](#plugin-1374274469-root) | 把OpenCode Zen模型接入DSH模型目录，提供原生流式适配与可选网络路由管理。 | 适合非关键试验，先用原生adapter模式验证小任务，保留可用供应商回退；不要把免费通道当生产容量保证。 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在 DSH 中搜索 GitHub 插件并提供安装、更新、冲突预检与启动恢复。 | 适合维护多个插件的DSH环境；先在隔离profile验证冲突提示和回滚，再用于日常安装，重要环境保留独立备份。 |
| [dsh-plugin-manager](#plugin-1334267268-root) | 给 DSH 插件提供中文目录说明、启停、备注编辑及配置备份管理界面。 | 需要批量辨认和启停时先在独立profile试用，核对系统保护、表达式拒绝、备份恢复及实际fiber状态后扩用。 |
| [dsh-plugin-proxy](#plugin-1374274543-root) | 通过运行时设置切换DSH全局fetch代理，支持直连、系统代理和手动HTTP或SOCKS代理。 | 先用可观察测试端点核验fetch与目标客户端，确认无代理或配置错误时的直连回退可接受，再切换真实任务。 |
| [dsh-progress-viz-plugin](#plugin-1334481905-plugin) | 监听 DSH 会话语义事件并输出进度 JSON，供外部看板展示。 | 适合看长任务活动；先验证同会话空闲后继续工作的显示，关键任务以实际产物和会话结果验收。 |
| [dsh-reasoning-tiers](#plugin-1367305514-root) | 按规则补齐第三方模型推理档位，并在设置页编辑模型能力声明。 | 先备份 profile，对单个模型检查实际请求与撤销结果，再考虑批量补齐。 |
| [dsh-remote-ssh](#plugin-1384810201-root) | 通过SSH对配置主机执行允许命令，提供状态查询、固定探针与受限远程运行工具。 | 先使用远端低权限账号和固定只读探针，严格限定命令及参数，确认超时后的远端进程状态；不要把插件白名单当完整沙箱。 |
| [dsh-router-loomy](#plugin-1376777535-root) | 将本机 Loomy 登录态与云端模型通道接入 dsh-router，提供模型目录和客户端状态页。 | 已有Loomy账号和router环境时先用非敏感只读问题验证当前模型、账号与完整收尾，再测会话刷新和中断；频繁断流时核对是否重复调用，勿直接用于要求一次副作用的任务。 |
| [dsh-token-billing](#plugin-1335139860-root) | 为 DSH 提供按供应商、模型、时段与用量计算的实时费用与账本统计。 | 适合需要多路由费用参考的用户；先对照供应商账单核实缓存、峰谷和币种口径，再据看板调整预算。 |
| [dsh-ui-auth](#plugin-1343420855-root) | 为 DSH Web 提供登录、用户管理和认证网关，并支持 TOTP、Passkey 与会话隔离。 | 先在隔离环境逐一测试 HTTP、WebSocket 和多用户访问，不把安装成功当成公网安全保证。 |
| [dsh-usage-dashboard-plus](#plugin-1334023305-root) | 在 DSH 侧栏和设置页展示账户余额、调用用量与分模型费用统计。 | 适合用量观察；先用自己账单核对一天数据，并为未知模型补价，再据此设预算。 |
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
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root) | 监听工具结果和会话事件，生成不保存观察明文的哈希链 JSONL 证据回执。 | 用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。 |
| [Quota 用量仪表](#plugin-1400927706-root) | 累计会话用量并注入实时仪表，按价格与历史增量估计预算和上下文余量。 | 先与一天供应商用量对账，检查缺失 usage、重复事件和价格单位，再启用预算提醒。 |
| [元冰可 AI 资源治理平台](#plugin-1416699252-root) | 以 Cordis 插件树整合组织、权限、模型、MCP 与数字员工资源治理。 | 适合已有明确多用户治理需求的团队先部署隔离环境；以最小权限、一条业务链和备份恢复作为采用门槛。 |
| [模型信息补全](#plugin-1358816037-root) | 从 models.dev 为自定义模型补齐缺失能力，并保留人工确认与未声明状态。 | 先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。 |

<a id="plugin-1333368566-root"></a>

## [DSH Telemetry Redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) · [![npm 30d 1216](https://img.shields.io/static/v1?label=npm+30d&message=1%2C216&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor)

- **用途**：向观测后端发送会话遥测的部署者需要减少凭据外传，输入是遥测副本。
- **亮点**：session-telemetry/record 前置规则调用 next 后递归生成脱敏记录，不重写规范会话。
- **思考**：在统一出口处理副本有清晰边界；它是遥测防护的一层，不能替代凭据权限和全链路审计。
- **建议**：先在测试遥测里放入假密钥、普通文本和 token 计量字段，核对脱敏与保真后再接后端。

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

<a id="plugin-1413052822-root"></a>

## [dsh-armory](../../plugins/2026heshao--dsh-armory/INSIGHT.md)

[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) · [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory)

- **用途**：同时维护多项目MCP和第三方技能的用户，希望集中导入、辨认安装来源并隔离会话工具。
- **亮点**：作者声明fork自Imzl-zl MCP看板，原面板不计原创。可识别贡献是项目共享连接所有权与异步释放占位、统一导入准入，以及在静态header宿主前补OAuth授权流程；目录规模并非已安装能力数量。
- **思考**：安装来源账本是否能作为可靠审计真相？wb-install-state的writeAtomic先写staging再rm正式文件再rename，存在删除后失败窗口；record是读改写且该模块未串行化，并发调用可能丢登记。登记失败不影响安装，故安装成功与来源已登记不能等同；共享连接也须区分配置落盘与运行收敛。
- **建议**：已有多个MCP时在独立项目试用导入和作用域隔离，核对实际工具与来源登记；OAuth与市场安装新增路径需单独验收，不依据零调用账本批量停用工具。

<a id="plugin-1387227102-root"></a>

## [DSH-Official-WorkBuddy-Credit-Proxy](../../plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) · [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit)

- **用途**：已有本人账号、希望在兼容客户端复用接入和故障转移的用户，交付为经过同一调度器的模型响应。
- **亮点**：作者明确基于XDTrees账号池及其他MIT代码，不能把凭据解密和原池轮转归为新贡献。可识别增量是三协议共用调度及针对工具调用/流事件的兼容投影，隔离协议错误与选号逻辑。
- **思考**：协议翻译是否语义无损？inputToMessages对工具call/result重排和补缺失结果，有利于上游接受；但input_image变成文本占位，数组输出抽文本，toolsToChat仅过滤function类型，自由格式工具声明未因此完整支持。HTTP200和模型正文不代表完整工具闭环兼容。
- **建议**：仅在本人账号和明确上游使用条件下隔离试用，先验证真实客户端工具闭环与协议降级；不要只凭响应200扩大使用。

<a id="plugin-1366089972-workspace-plugins-dsh-organism"></a>

## [dsh-organism](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

- **用途**：多插件组合维护者希望统一发现工具、跟踪故障和触发恢复，合格结果是可追踪的实际恢复而非状态计数增长。
- **亮点**：组件src/index.ts连接tools与session事件、心跳和持久账本；按器官选择工具schema，反射可再次执行工具，带副作用处方要求人工裁决。
- **思考**：统一事件与恢复账本有集成价值；把任意插件命名为器官不能自动消除兼容差异，也不能证明任务成功。
- **建议**：适合愿意维护统一器官协议的实验环境；先只开启观测，再逐条批准恢复路径，验证重复故障不会重复副作用。

<a id="plugin-1374274469-root"></a>

## [dsh-plugin-adapter](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter)

- **用途**：希望在DSH尝试Zen模型的用户需要原生会话和工具调用接口，验收需包括流式文本、工具结果与失败恢复。
- **亮点**：packages/plugin/src/index.ts默认注册zen-free及旧别名LlmAdapter，后台预热模型目录；另保留sidecar和可选IP池/代理配置。
- **思考**：原生适配减少单独进程与UI切换；上游匿名接口变化可能让全部便利失效，需与直接使用原CLI比较维护负担。
- **建议**：适合非关键试验，先用原生adapter模式验证小任务，保留可用供应商回退；不要把免费通道当生产容量保证。

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

<a id="plugin-1374274543-root"></a>

## [dsh-plugin-proxy](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-proxy) · [![npm 30d 94](https://img.shields.io/static/v1?label=npm+30d&message=94&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy)

- **用途**：网络环境经常变化的用户希望不重启会话就切换出站路线，验收是目标请求确实经过预期代理。
- **亮点**：lib/index.js用undici setGlobalDispatcher替换全局调度器，设置变化重新应用，旧连接宽限关闭，卸载恢复基线和本插件改过的环境变量。
- **思考**：集中运行期设置简化多处代理配置；进程全局影响也可能改变其他插件的出站路径。
- **建议**：先用可观察测试端点核验fetch与目标客户端，确认无代理或配置错误时的直连回退可接受，再切换真实任务。

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

<a id="plugin-1384810201-root"></a>

## [dsh-remote-ssh](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh)

- **用途**：维护Unix、AIX或Mac主机的人希望在DSH排障，合格结果是主机明确、输出可信且操作范围可控。
- **亮点**：index.js注册状态、运行及固定探针工具，lib/ssh.js过滤argv、检查命令白名单，以BatchMode调用ssh并限制超时和输出。
- **思考**：固定探针能降低重复取诊断信息的步骤；通用命令允许列表如果过宽，会把权限负担转回操作者。
- **建议**：先使用远端低权限账号和固定只读探针，严格限定命令及参数，确认超时后的远端进程状态；不要把插件白名单当完整沙箱。

<a id="plugin-1376777535-root"></a>

## [dsh-router-loomy](../../plugins/2404723600--dsh-router-loomy/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/2404723600/dsh-router-loomy) · [![npm 30d 1729](https://img.shields.io/static/v1?label=npm+30d&message=1%2C729&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-router-loomy)

- **用途**：面向已登录Loomy且使用dsh-router的用户，想在DSH中使用同一模型通道；成功标准是请求用预期账号完成、异常流可被识别且凭证不误暴露。
- **亮点**：作者明确参照dsh-router-traework同构范式，不能把核心选号、冷却和换号算插件原创。本项增量是Loomy本地会话发现、追踪头与“有[DONE]却无finish_reason”流的区分，处理常规兼容转发容易把半回答当成功的边界。
- **思考**：缺finish_reason是否总能判断坏流并安全重试？sse.ts用completion_tokens>=maxTokens区分撞上限，否则判截断，只有推理无正文也判失败；这匹配作者观测，但合法上游格式变化或usage漏报可能误判。强制核心重试还会增加费用，已产生工具副作用的流需格外核对，不能把重试等同无损补齐。
- **建议**：已有Loomy账号和router环境时先用非敏感只读问题验证当前模型、账号与完整收尾，再测会话刷新和中断；频繁断流时核对是否重复调用，勿直接用于要求一次副作用的任务。

<a id="plugin-1335139860-root"></a>

## [dsh-token-billing](../../plugins/2006spy--dsh-token-billing/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing)

- **用途**：多供应商用户要追踪不同路由与缓存桶费用，避免只看模型别名误估；合格交付是可对账的费用估算及可导出账本。
- **亮点**：相对token总量乘单价，增量是把路由、时段、缓存桶和订阅/免费/本地模式分开，且把短暂估算与落地账本区分；不是服务商结算系统，内置价格不能自动视为当前适用合同。
- **思考**：最关键是账本身份及单价可追溯：ledger.js 的 mergeSteps 对 seen.has(key) 直接 continue，既有相同 session|turn|step 记录不会经此合并路径被修订；是否实际遇到最终 usage 回补被忽略尚未运行验证。默认汇率与 fallback 价也只是估算前提。临时文件替换不单独证明多进程写入不会丢失。
- **建议**：适合需要多路由费用参考的用户；先对照供应商账单核实缓存、峰谷和币种口径，再据看板调整预算。

<a id="plugin-1343420855-root"></a>

## [dsh-ui-auth](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1608](https://img.shields.io/static/v1?label=npm+30d&message=1%2C608&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth)

- **用途**：需要让多个用户访问 DSH Web 的部署者，需要认证入口和数据访问边界。
- **亮点**：包装 HTTP 与 upgrade 入口，现代网关按会话处理认证；宿主能力缺失时 fail-closed。
- **思考**：统一入口与关闭式失败路径是有效机制；全接口安全仍依赖覆盖、宿主升级和反代配置。
- **建议**：先在隔离环境逐一测试 HTTP、WebSocket 和多用户访问，不把安装成功当成公网安全保证。

<a id="plugin-1334023305-root"></a>

## [dsh-usage-dashboard-plus](../../plugins/1helloman1--dsh-usage-dashboard-plus/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus) · [![npm 30d 1066](https://img.shields.io/static/v1?label=npm+30d&message=1%2C066&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-dashboard-plus)

- **用途**：多模型 DSH 用户希望知道账户余额及当天花费；合格交付是带价格口径的估算与可追查调用记录。
- **亮点**：相对只看服务商余额，插件将会话用量、视觉旁路调用和模型分组放到一个入口，补足主模型账单看不到辅助调用的观察盲区；余额与日志费用来自不同路径，属于观测整合而非精确账务系统。
- **思考**：同一条调用能否恰好计一次以及价格是否匹配路由最影响费用可信度。源码有默认与日期价格表，也给未识别模型 fallback 价格；未知模型被赋通用价不能当实际账单，外部日志格式/重复输入及本地日界线仍需对账。
- **建议**：适合用量观察；先用自己账单核对一天数据，并为未知模型补价，再据此设预算。

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

- **用途**：面向已拥有多部门 AI 服务的管理员，交付可追溯的资源归属、授权与访问审计；小型单用户环境的替代办法是配置文件和现成网关。
- **亮点**：相对各业务路由各写鉴权，贡献是将权限点、路由声明和审计主体收敛成共享接口。rest-gate 中 guarded 在处理器前判断权限，changeLog 缺 audit 时拒绝静默丢记录；这是可核查的治理集成增量，Cordis 插件化本身归上游。
- **思考**：最强支持是 guarded 和 changeLog 的集中实现；关键缺口是 gate 只消费 principal，不证明每个业务入口都由可信中间件赋值，也不证明所有写路由都使用 gate。console.read 蕴含 console.login 的镜像规则还要求前后端同步。若存在绕过入口，统一治理主张需进一步收窄。
- **建议**：适合已有明确多用户治理需求的团队先部署隔离环境；以最小权限、一条业务链和备份恢复作为采用门槛。

<a id="plugin-1358816037-root"></a>

## [模型信息补全](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill)

- **用途**：维护多个自定义模型的用户需要减少重复填写上下文、输出上限与推理声明。
- **亮点**：Host 拉取并缓存能力目录，构造缺失字段操作，通过 settings.mutate 带版本写入；模型保存可单独调整。
- **思考**：不凭会思考就编造离散档位是合理边界；默认值仍是用户假设而非外部事实。
- **建议**：先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。

## 更新时间

2026-10-21
