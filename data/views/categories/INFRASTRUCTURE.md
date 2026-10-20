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
| [dsh-organism](#plugin-1366089972-workspace-plugins-dsh-organism) | 把插件组织为可观测器官，提供心跳、反射、自愈账本和工具schema按需门控。 | 适合愿意维护统一器官协议的实验环境；先只开启观测，再逐条批准恢复路径，验证重复故障不会重复副作用。 |
| [dsh-plugin-adapter](#plugin-1374274469-root) | 把OpenCode Zen模型接入DSH模型目录，提供原生流式适配与可选网络路由管理。 | 适合非关键试验，先用原生adapter模式验证小任务，保留可用供应商回退；不要把免费通道当生产容量保证。 |
| [dsh-plugin-proxy](#plugin-1374274543-root) | 通过运行时设置切换DSH全局fetch代理，支持直连、系统代理和手动HTTP或SOCKS代理。 | 先用可观察测试端点核验fetch与目标客户端，确认无代理或配置错误时的直连回退可接受，再切换真实任务。 |
| [dsh-reasoning-tiers](#plugin-1367305514-root) | 按规则补齐第三方模型推理档位，并在设置页编辑模型能力声明。 | 先备份 profile，对单个模型检查实际请求与撤销结果，再考虑批量补齐。 |
| [dsh-remote-ssh](#plugin-1384810201-root) | 通过SSH对配置主机执行允许命令，提供状态查询、固定探针与受限远程运行工具。 | 先使用远端低权限账号和固定只读探针，严格限定命令及参数，确认超时后的远端进程状态；不要把插件白名单当完整沙箱。 |
| [dsh-ui-auth](#plugin-1343420855-root) | 为 DSH Web 提供登录、用户管理和认证网关，并支持 TOTP、Passkey 与会话隔离。 | 先在隔离环境逐一测试 HTTP、WebSocket 和多用户访问，不把安装成功当成公网安全保证。 |
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
| [Forge 用量计费](#plugin-1363429979-plugin-usage-billing) | 从会话用量建立账本，以事件时刻价格计费并展示预算、趋势与未计价项目。 | 先选择一个模型和一天真实账单，逐项核对 token、缓存计价、币种和未计价行。 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root) | 监听工具结果和会话事件，生成不保存观察明文的哈希链 JSONL 证据回执。 | 用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。 |
| [Quota 用量仪表](#plugin-1400927706-root) | 累计会话用量并注入实时仪表，按价格与历史增量估计预算和上下文余量。 | 先与一天供应商用量对账，检查缺失 usage、重复事件和价格单位，再启用预算提醒。 |
| [元冰可 AI 资源治理平台](#plugin-1416699252-root) | 将组织、权限、MCP、模型与用量管理整合为可独立运行或接入 DSH 的治理平台。 | 仅在确有多用户资源治理需求时试部署，先验证最小权限、备份恢复和一条完整业务链。 |
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

<a id="plugin-1374274543-root"></a>

## [dsh-plugin-proxy](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-proxy) · [![npm 30d 94](https://img.shields.io/static/v1?label=npm+30d&message=94&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy)

- **用途**：网络环境经常变化的用户希望不重启会话就切换出站路线，验收是目标请求确实经过预期代理。
- **亮点**：lib/index.js用undici setGlobalDispatcher替换全局调度器，设置变化重新应用，旧连接宽限关闭，卸载恢复基线和本插件改过的环境变量。
- **思考**：集中运行期设置简化多处代理配置；进程全局影响也可能改变其他插件的出站路径。
- **建议**：先用可观察测试端点核验fetch与目标客户端，确认无代理或配置错误时的直连回退可接受，再切换真实任务。

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

<a id="plugin-1343420855-root"></a>

## [dsh-ui-auth](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1608](https://img.shields.io/static/v1?label=npm+30d&message=1%2C608&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth)

- **用途**：需要让多个用户访问 DSH Web 的部署者，需要认证入口和数据访问边界。
- **亮点**：包装 HTTP 与 upgrade 入口，现代网关按会话处理认证；宿主能力缺失时 fail-closed。
- **思考**：统一入口与关闭式失败路径是有效机制；全接口安全仍依赖覆盖、宿主升级和反代配置。
- **建议**：先在隔离环境逐一测试 HTTP、WebSocket 和多用户访问，不把安装成功当成公网安全保证。

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

- **用途**：已有多个 AI 资源和使用部门的团队需要资产归属、权限及审计，而非单一聊天增强。
- **亮点**：Cordis 插件树装配业务域，REST gate 汇集权限声明；同时提供独立宿主与实验性 DSH 接入。
- **思考**：权限归属和资源生命周期有明确组织价值，但小团队用配置文件可能更经济。
- **建议**：仅在确有多用户资源治理需求时试部署，先验证最小权限、备份恢复和一条完整业务链。

<a id="plugin-1358816037-root"></a>

## [模型信息补全](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill)

- **用途**：维护多个自定义模型的用户需要减少重复填写上下文、输出上限与推理声明。
- **亮点**：Host 拉取并缓存能力目录，构造缺失字段操作，通过 settings.mutate 带版本写入；模型保存可单独调整。
- **思考**：不凭会思考就编造离散档位是合理边界；默认值仍是用户假设而非外部事实。
- **建议**：先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。

## 更新时间

2026-10-20
