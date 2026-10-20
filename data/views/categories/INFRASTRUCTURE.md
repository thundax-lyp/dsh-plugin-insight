# 基础设施

[返回首页](../../../README.md)

## 快速比较

索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

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
| [Forge 用量计费](#plugin-1363429979-plugin-usage-billing) | 从会话用量建立账本，以事件时刻价格计费并展示预算、趋势与未计价项目。 | 先选择一个模型和一天真实账单，逐项核对 token、缓存计价、币种和未计价行。 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root) | 监听工具结果和会话事件，生成不保存观察明文的哈希链 JSONL 证据回执。 | 用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。 |
| [Quota 用量仪表](#plugin-1400927706-root) | 累计会话用量并注入实时仪表，按价格与历史增量估计预算和上下文余量。 | 先与一天供应商用量对账，检查缺失 usage、重复事件和价格单位，再启用预算提醒。 |
| [元冰可 AI 资源治理平台](#plugin-1416699252-root) | 将组织、权限、MCP、模型与用量管理整合为可独立运行或接入 DSH 的治理平台。 | 仅在确有多用户资源治理需求时试部署，先验证最小权限、备份恢复和一条完整业务链。 |
| [模型信息补全](#plugin-1358816037-root) | 从 models.dev 为自定义模型补齐缺失能力，并保留人工确认与未声明状态。 | 先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。 |

### 基础设施（21）

<a id="plugin-1333368566-root"></a>

#### [DSH Telemetry Redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) · [![npm 30d 1216](https://img.shields.io/static/v1?label=npm+30d&message=1%2C216&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor)

- **用途**：向观测后端发送会话遥测的部署者需要减少凭据外传，输入是遥测副本。
- **亮点**：session-telemetry/record 前置规则调用 next 后递归生成脱敏记录，不重写规范会话。
- **思考**：在统一出口处理副本有清晰边界；它是遥测防护的一层，不能替代凭据权限和全链路审计。
- **建议**：先在测试遥测里放入假密钥、普通文本和 token 计量字段，核对脱敏与保真后再接后端。

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

#### [dsh-anatomy-panel](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

- **用途**：维护Agent-Body部署的人需要查看后台状态，合格交付是实际文件异常能被看到，而非仅有漂亮仪表盘。
- **亮点**：组件lib/index.js注册/anatomy与数据路由，每次请求重读organism文件，脉冲只读尾部256KB，页面约每三秒轮询。
- **思考**：直接从运行文件投影避免另建采集服务；仪表盘显示已愈合不能证明业务故障真正恢复。
- **建议**：先限制在本地受控宿主使用，检查缺失数据能否报503，并核对脉冲文本的展示边界后再接入多人环境。

<a id="plugin-1346196699-root"></a>

#### [dsh-api-dashboard](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) · [![npm 30d 4246](https://img.shields.io/static/v1?label=npm+30d&message=4%2C246&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)

- **用途**：同时使用多个供应商的用户需要观察额度和花费趋势，合格输出应能区分实际余额、估算与无法查询。
- **亮点**：src/index.js 从凭据及平台接口取余额，以内置或自定义单价计算会话消耗，混合币种分别显示；客户端定时刷新看板。
- **思考**：集中显示和明确未知值有实用价值；估算若被当成收费真相，会把价格漂移和缓存差异隐藏起来。
- **建议**：先选择实际可查询的平台，对照控制台账单和混合币种；把看板作为预警与估算入口，自更新前保留配置和回退。

<a id="plugin-1366089972-workspace-plugins-dsh-organism"></a>

#### [dsh-organism](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

- **用途**：多插件组合维护者希望统一发现工具、跟踪故障和触发恢复，合格结果是可追踪的实际恢复而非状态计数增长。
- **亮点**：组件src/index.ts连接tools与session事件、心跳和持久账本；按器官选择工具schema，反射可再次执行工具，带副作用处方要求人工裁决。
- **思考**：统一事件与恢复账本有集成价值；把任意插件命名为器官不能自动消除兼容差异，也不能证明任务成功。
- **建议**：适合愿意维护统一器官协议的实验环境；先只开启观测，再逐条批准恢复路径，验证重复故障不会重复副作用。

<a id="plugin-1374274469-root"></a>

#### [dsh-plugin-adapter](../../plugins/1624318455--dsh-plugin-adapter/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter)

- **用途**：希望在DSH尝试Zen模型的用户需要原生会话和工具调用接口，验收需包括流式文本、工具结果与失败恢复。
- **亮点**：packages/plugin/src/index.ts默认注册zen-free及旧别名LlmAdapter，后台预热模型目录；另保留sidecar和可选IP池/代理配置。
- **思考**：原生适配减少单独进程与UI切换；上游匿名接口变化可能让全部便利失效，需与直接使用原CLI比较维护负担。
- **建议**：适合非关键试验，先用原生adapter模式验证小任务，保留可用供应商回退；不要把免费通道当生产容量保证。

<a id="plugin-1374274543-root"></a>

#### [dsh-plugin-proxy](../../plugins/1624318455--dsh-plugin-proxy/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-proxy) · [![npm 30d 94](https://img.shields.io/static/v1?label=npm+30d&message=94&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy)

- **用途**：网络环境经常变化的用户希望不重启会话就切换出站路线，验收是目标请求确实经过预期代理。
- **亮点**：lib/index.js用undici setGlobalDispatcher替换全局调度器，设置变化重新应用，旧连接宽限关闭，卸载恢复基线和本插件改过的环境变量。
- **思考**：集中运行期设置简化多处代理配置；进程全局影响也可能改变其他插件的出站路径。
- **建议**：先用可观察测试端点核验fetch与目标客户端，确认无代理或配置错误时的直连回退可接受，再切换真实任务。

<a id="plugin-1367305514-root"></a>

#### [dsh-reasoning-tiers](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1069137617/dsh-reasoning-tiers) · [![npm 30d 1061](https://img.shields.io/static/v1?label=npm+30d&message=1%2C061&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers)

- **用途**：自定义供应商模型缺少档位元数据时，用户需要恢复可选档位并识别无效配置。
- **亮点**：按知识表和实时模型信息生成设置补丁，带版本写入、重算冲突并记录撤销日志，不接管请求适配器。
- **思考**：配置缝修复比拦截模型请求侵入小；声明能力仍须与真实提供商行为一致。
- **建议**：先备份 profile，对单个模型检查实际请求与撤销结果，再考虑批量补齐。

<a id="plugin-1384810201-root"></a>

#### [dsh-remote-ssh](../../plugins/173787247--dsh-remote-ssh/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh)

- **用途**：维护Unix、AIX或Mac主机的人希望在DSH排障，合格结果是主机明确、输出可信且操作范围可控。
- **亮点**：index.js注册状态、运行及固定探针工具，lib/ssh.js过滤argv、检查命令白名单，以BatchMode调用ssh并限制超时和输出。
- **思考**：固定探针能降低重复取诊断信息的步骤；通用命令允许列表如果过宽，会把权限负担转回操作者。
- **建议**：先使用远端低权限账号和固定只读探针，严格限定命令及参数，确认超时后的远端进程状态；不要把插件白名单当完整沙箱。

<a id="plugin-1343420855-root"></a>

#### [dsh-ui-auth](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1608](https://img.shields.io/static/v1?label=npm+30d&message=1%2C608&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth)

- **用途**：需要让多个用户访问 DSH Web 的部署者，需要认证入口和数据访问边界。
- **亮点**：包装 HTTP 与 upgrade 入口，现代网关按会话处理认证；宿主能力缺失时 fail-closed。
- **思考**：统一入口与关闭式失败路径是有效机制；全接口安全仍依赖覆盖、宿主升级和反代配置。
- **建议**：先在隔离环境逐一测试 HTTP、WebSocket 和多用户访问，不把安装成功当成公网安全保证。

<a id="plugin-1335060007-root"></a>

#### [dsh-web-restart](../../plugins/1123762794--dsh-web-restart/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-restart)

- **用途**：Windows 本机调试人员希望从浏览器重启 DSH，不再切回终端。
- **亮点**：POST /restart-dsh 延迟启动隐藏 PowerShell，读取硬编码 D:\1\dsh-web-host.ps1；健康路由只报告当前进程存活。
- **思考**：便利入口不能替代可靠的进程管理；返回触发成功不能当作重启完成。
- **建议**：当前更适合参考实现，先在可丢弃 profile 验证脚本路径、失败反馈和会话恢复。

<a id="plugin-1366583376-root"></a>

#### [dsh-web-url-view](../../plugins/1032740078--dsh-web-url-view/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view)

- **用途**：桌面版每次重启更换端口和令牌时，用户希望有稳定的浏览器入口。
- **亮点**：固定端口代理在内部换取当前实例会话 cookie，转发 HTTP/WebSocket 并处理 Host、Origin 与 cookie。
- **思考**：稳定地址能减少复制地址的操作；将访问扩展到局域网会改变访问控制需求。
- **建议**：先保持回环绑定，测试重启后的令牌更新与拒绝外部 Origin，再考虑受控网络访问。

<a id="plugin-1351854066-root"></a>

#### [dsh-wsl-clock](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clock)

- **用途**：笔记本休眠后WSL联网或令牌异常，开发者希望先确认时钟是否明显漂移，验收是找到实际故障原因。
- **亮点**：lib/clock.js先取WSL Date.now，再通过PowerShell取Windows毫秒时间，计算偏差等级并返回诊断建议。
- **思考**：把常见休眠漂移变成具名探针有帮助；单次偏差不能直接解释所有TLS失败。
- **建议**：先把它当粗粒度线索，临界偏差用系统命令复核；保存工作后再考虑关闭WSL或同步时间。

<a id="plugin-1391141174-root"></a>

#### [dsh-wsl-defender](../../plugins/173787247--dsh-wsl-defender/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-defender)

- **用途**：开发者排查Windows环境状态时需要把系统安全配置带入会话，合格结果是可核对的当前状态而非安全认证。
- **亮点**：defender-exec.js经PowerShell调用Get-MpComputerStatus等只读命令，defender.js规范化结果并将杀毒数据缺失显示为不可用。
- **思考**：合并多个状态命令方便排障；快照不能代替持续防护，也不把没有返回数据当作已确认无威胁。
- **建议**：作为状态收集工具使用，对关键异常回到Windows安全中心核对；遇到unavailable先查权限和安全产品。

<a id="plugin-1350379001-root"></a>

#### [dsh-wsl-distro](../../plugins/173787247--dsh-wsl-distro/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro)

- **用途**：安装多个发行版的用户容易把Windows默认WSL与当前会话混淆，希望先确认目录属于哪一个系统。
- **亮点**：lib/distro.js读取WSL_DISTRO_NAME和os-release，执行wsl.exe -l -v并解析表格，比较当前与默认发行版。
- **思考**：提醒默认发行版不等于当前会话能避免路径误用；发行版名字本身不能证明用户、挂载和权限一致。
- **建议**：适合多发行版开发者，先核对current/default与UNC路径，再在目标发行版确认文件存在。

<a id="plugin-1351854118-root"></a>

#### [dsh-wsl-dns](../../plugins/173787247--dsh-wsl-dns/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns)

- **用途**：WSL联网异常而Windows正常时，用户需要两端同域名解析证据，以缩小故障范围。
- **亮点**：lib/dns.js读取resolv.conf，分别调用Node resolve4和Windows GetHostAddresses，去重排序后标记地址集合不一致。
- **思考**：同屏比较便于发现单侧解析失败；地址不同只支持差异事实，不支持唯一故障原因。
- **建议**：只作为差异线索，先用稳定测试域名核对，再结合HTTPS与代理探针；企业分流DNS环境不要仅因不一致改配置。

<a id="plugin-1351854301-root"></a>

#### [dsh-wsl-docker](../../plugins/173787247--dsh-wsl-docker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker)

- **用途**：开发者在Docker Desktop和WSL引擎之间排障，想确认容器、GPU和推理服务处于哪一层失败。
- **亮点**：lib/docker.js执行Docker只读命令，按名称/镜像/8000端口识别候选，查询runtime并探测HTTP，生成后续建议。
- **思考**：能把CLI存在、daemon可达和候选推理容器分开；启发式绿色状态仍需应用层验收。
- **建议**：先用作收集context与容器信息，再用受控/v1/models和小请求验证API；不要因portHealth为ok就交付推理服务。

<a id="plugin-1363429979-plugin-usage-billing"></a>

#### [Forge 用量计费](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1814](https://img.shields.io/static/v1?label=npm+30d&message=1%2C814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing)

- **用途**：需要了解模型使用支出的开发者希望把日志用量与预算放在同一视图。
- **亮点**：服务聚合账本分片并锁定价格快照，联网价表与汇率有缓存和降级；未知项目不静默记零。
- **思考**：锁定历史价格能避免改价反写旧账；价格来源或使用日志不准时，账本仍可能精确记录错误值。
- **建议**：先选择一个模型和一天真实账单，逐项核对 token、缓存计价、币种和未计价行。

<a id="plugin-1333357514-root"></a>

#### [Qiushi DSH Evidence Audit](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit) · [![npm 30d 1208](https://img.shields.io/static/v1?label=npm+30d&message=1%2C208&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)

- **用途**：需要排查执行记录是否缺失或被改动的本地部署者，关注观察链的一致性。
- **亮点**：工具结果和事件被规范化、哈希化，再以 previousRecordHash 连接到追加记录。
- **思考**：不记录参数明文可减少隐私暴露，但也限制事后解释；不能把不可读哈希当成充分审计证据。
- **建议**：用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。

<a id="plugin-1400927706-root"></a>

#### [Quota 用量仪表](../../plugins/121212165--dsh-plugin-quota/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota) · [![npm 30d 138](https://img.shields.io/static/v1?label=npm+30d&message=138&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota)

- **用途**：长任务开发者希望在继续调用前看到消耗趋势和可能的预算边界。
- **亮点**：监听 assistant/message usage 累加本地账本，通过 systemPrompt 注入一行仪表，/qm 与工具展示统计。
- **思考**：及时可见的消耗有助于做继续决策；金额和下步预测不能替代账单与强制限额。
- **建议**：先与一天供应商用量对账，检查缺失 usage、重复事件和价格单位，再启用预算提醒。

<a id="plugin-1416699252-root"></a>

#### [元冰可 AI 资源治理平台](../../plugins/01men--ybkkasi/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/01men/ybkkasi)

- **用途**：已有多个 AI 资源和使用部门的团队需要资产归属、权限及审计，而非单一聊天增强。
- **亮点**：Cordis 插件树装配业务域，REST gate 汇集权限声明；同时提供独立宿主与实验性 DSH 接入。
- **思考**：权限归属和资源生命周期有明确组织价值，但小团队用配置文件可能更经济。
- **建议**：仅在确有多用户资源治理需求时试部署，先验证最小权限、备份恢复和一条完整业务链。

<a id="plugin-1358816037-root"></a>

#### [模型信息补全](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill)

- **用途**：维护多个自定义模型的用户需要减少重复填写上下文、输出上限与推理声明。
- **亮点**：Host 拉取并缓存能力目录，构造缺失字段操作，通过 settings.mutate 带版本写入；模型保存可单独调整。
- **思考**：不凭会思考就编造离散档位是合理边界；默认值仍是用户假设而非外部事实。
- **建议**：先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。

## 更新时间

2026-10-20
