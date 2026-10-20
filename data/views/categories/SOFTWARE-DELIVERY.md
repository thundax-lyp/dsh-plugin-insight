# 软件交付

[返回首页](../../../README.md)

## 快速比较

索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [agent-clinic](#plugin-1417442557-root) | 读取本地Agent会话与配置，生成带证据定位的诊断报告，并匹配可复核的改进处方。 | 先离线扫描少量会话并回读证据行，确认隐私与指纹保存策略；处方涉及配置修改时先备份并单独验证。 |
| [ai-look-up](#plugin-1401618027-root) | 监测重复命令、连续失败与目标漂移，向会话注入复盘提示并可调用审查模型。 | 先在非关键任务关闭第三通道，观察重复调用提醒的误报和冷却，再决定是否为审查增加预算。 |
| [DSH Verification Receipt](#plugin-1333370288-root) | 在每轮持久化结束时保存工具次数和验证形态信号的本地 JSONL 回执。 | 先对照一次明确成功和一次失败的测试任务，逐项比对回执与真实命令结果。 |
| [dsh-folderwatch](#plugin-1423215448-root) | 监测目录快照差异，把外部文件变化批量排队或唤醒原会话处理。 | 先以 queue 模式监听小目录，统计漏报、重复和自身写入抑制，再开放自动唤醒。 |
| [dsh-mysql](#plugin-1337916824-root) | 管理多套MySQL连接，为会话提供选库入口及查询、表结构、数据写入和DDL工具。 | 先连接脱敏测试库和数据库端只读账号，核对选库与结果；确需写入时分别启用行写和DDL，并准备备份与人工复核。 |
| [dsh-project-memory](#plugin-1339316901-root) | 为项目保存任务、文档、代码符号与经验记录，支持跨会话检索和按条件注入。 | 先在一个可丢弃项目中测试旧结论纠错和跨项目隔离，再决定是否长期启用。 |
| [dsh-reaper](#plugin-1423215373-root) | 盘点端口占用与进程归属，先预览再按显式参数清理可归属的进程树。 | 先仅用扫描与预览，对照系统工具确认归属；实际清理只在可丢弃开发进程上验收。 |
| [dsh-repeat-stop](#plugin-1339262076-root) | 拦截同一Agent连续出现的同工具同参数调用，提供可配置阈值与排除规则。 | 先在短任务记录触发次数，按轮询工具配置排除；被拦后检查输入和错误原因，不通过无意义改参数规避限制。 |
| [dsh-tool-budget](#plugin-1350325873-root) | 按运行中的Agent限制工具调用总次数，支持包含与排除规则并在超额时拦截。 | 先按一类任务观察正常调用分布，再设阈值；长后台任务查询可排除，但排除列表应保持有限。 |
| [dsh-trellis](#plugin-1335559646-root) | 以任务步骤和阶段约束开发流程，提供验收门禁与可选规划期写工具过滤。 | 先在测试项目检查任务创建、规划保护、批准和归档，再决定哪些项目启用。 |
| [dsh-which](#plugin-1423215529-root) | 解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。 | 先只查询并对照当前 shell 的解析结果，必要时对可信二进制启用版本探测。 |
| [dsh-wsl-compose](#plugin-1381842592-root) | 封装Docker Compose状态、容器列表和日志，并可在配置允许及参数确认后执行up或down。 | 先仅开放ps/logs并配置明确根目录，在测试项目验证路径；需要up/down时先人工审阅Compose文件并保留运行状态。 |
| [dsh-wsl-cred](#plugin-1350379113-root) | 读取Git凭据助手与远端类型，给出WSL使用Windows Git Credential Manager的排障提示。 | 先确认工具工作目录和远端协议，只读查看配置后再人工修改；不要为了验证把token贴进会话。 |
| [dsh-wsl-db](#plugin-1381859591-root) | 通过psql和redis-cli执行受限查询与连通探针，支持配置连接别名和Redis主机范围。 | 先使用数据库端只读角色和测试库，限制主机与别名，避免在大Redis执行KEYS；敏感查询结果谨慎进入模型上下文。 |
| [dsh-wsl-editor](#plugin-1351854212-root) | 把WSL文件路径转换为Windows路径，在Cursor、VS Code或记事本中打开并可定位行列。 | 适合Windows+WSL开发，先测试当前发行版路径、中文空格和行号；自动回退后人工确认文件与定位。 |
| [dsh-zero-residence](#plugin-1366089972-workspace-plugins-dsh-zero-residence) | 把长会话内容压缩为可回查指针，提供账本、召回、强制压缩和异步命令入口。 | 先在可恢复会话副本试压缩，验证关键证据能原样回查；异步命令只用于允许的测试任务，并确认宿主权限与取消边界。 |
| [IDE Hub](#plugin-1397817235-root) | 汇总多种编码工具的本地会话、用量与规则，并提供项目规则统一分发入口。 | 先只盘点两个实际使用的 IDE，再对一个测试项目 dry-run 规则分发并检查差异。 |
| [oh-my-dsh](#plugin-1379204512-root) | 为 DSH 提供角色、Skill 与多智能体协调协议，支持自动推进和显式团队流程。 | 先验装探测与取消，再对单仓库小任务比较原生单 agent 和一条显式 team 流程。 |
| [Plan Lattice](#plugin-1334504487-root) | 从原生会话事实恢复长任务连续性，并提供显式启用的递归工作图控制。 | 先对照原生行为测试压缩和重启恢复，再单独评估显式完整控制，避免将两模式效果混为一谈。 |
| [Task Forge](#plugin-1399011094-root) | 把需求整理成版本化任务书，通过交接包和回读握手管理跨窗口协作。 | 先用一个有明确验收点的小任务试交接，人工比对遗漏和改版后的接收方状态。 |
| [TaskSwarm — 贡献与交付证据研究](#plugin-1333800488-root) | 按依赖分波，在 Git worktree 中执行任务包，并提供评审、集成、状态观察与恢复。 | 优先检验“与版本绑定的验收凭据能否同时约束集成、依赖放行和恢复”。先与简单 required checks／人工验收对照；若复杂协议没有额外收益，就采用简单方案。 |

### 软件交付（21）

<a id="plugin-1417442557-root"></a>

#### [agent-clinic](../../plugins/1687210989--agent-clinic/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1687210989/agent-clinic) · [![npm 30d 95](https://img.shields.io/static/v1?label=npm+30d&message=95&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/agent-clinic)

- **用途**：用户感觉Agent循环、上下文浪费或失忆，希望从实际日志定位问题，合格结果是能回查的证据和适用建议。
- **亮点**：adapters/dsh.mjs解析事件并保留行定位，report和prescriber生成诊断与配置建议，跨会话比较用本地加盐指纹；插件与CLI共用分析核心。
- **思考**：证据定位与撤回不适用处方比只报数字更利于行动；插件目录匹配依据不能证明被推荐插件安全或有效。
- **建议**：先离线扫描少量会话并回读证据行，确认隐私与指纹保存策略；处方涉及配置修改时先备份并单独验证。

<a id="plugin-1401618027-root"></a>

#### [ai-look-up](../../plugins/1344738825--ai-look-up/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1344738825/ai-look-up)

- **用途**：长任务中Agent反复失败却继续调用工具，用户希望尽早提示停下来检查方向；成功标准应是减少无效尝试。
- **亮点**：index.js 监听会话事件，按spec.json阈值与冷却判定触发；可用宿主模型生成复盘建议，失败退回静态清单，另支持外部watcher通道。
- **思考**：将行为信号转为可见提醒比静默循环更可控；提醒不是强制停止，错误诊断也可能把正常重试打断。
- **建议**：先在非关键任务关闭第三通道，观察重复调用提醒的误报和冷却，再决定是否为审查增加预算。

<a id="plugin-1333370288-root"></a>

#### [DSH Verification Receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) · [![npm 30d 881](https://img.shields.io/static/v1?label=npm+30d&message=881&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt)

- **用途**：代码协作者希望追问某轮究竟记录过哪些执行信号，而不是只看模型完成声明。
- **亮点**：监听 turn/end 相关 session 事件，按执行轨迹和词法信号生成摘要并串行追加 JSONL。
- **思考**：缩小到可检查的执行信号比声称自动验收更可靠；回执本身不能代替失败放行规则。
- **建议**：先对照一次明确成功和一次失败的测试任务，逐项比对回执与真实命令结果。

<a id="plugin-1423215448-root"></a>

#### [dsh-folderwatch](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch)

- **用途**：等待构建报告、下载或共享目录交接的智能体需要发现外部变化，减少反复手工查询。
- **亮点**：周期扫描与快照差分作为主路径，fs.watch 只提示加速；批量去抖、冷却和短时自身写入账本抑制回声。
- **思考**：准确变化摘要比轮询提示更利于交接；通知到达并不保证后续任务成功。
- **建议**：先以 queue 模式监听小目录，统计漏报、重复和自身写入抑制，再开放自动唤醒。

<a id="plugin-1337916824-root"></a>

#### [dsh-mysql](../../plugins/1321928757--dsh-mysql/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql) · [![npm 30d 36](https://img.shields.io/static/v1?label=npm+30d&message=36&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mysql)

- **用途**：开发者在数据库排障与分析时需要先看结构再查数据，交付应是可复核SQL和正确结果，而非仅返回成功。
- **亮点**：Host 注册四个全局工具；会话选择连接后逐调用确定目标，shared.js 分类SQL并检查表范围，写入与DDL分别开关。
- **思考**：显式选库和拆分读写权限能减少误路由；应用层检查不能替代数据库授权，模型也会看到查询结果。
- **建议**：先连接脱敏测试库和数据库端只读账号，核对选库与结果；确需写入时分别启用行写和DDL，并准备备份与人工复核。

<a id="plugin-1339316901-root"></a>

#### [dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4717](https://img.shields.io/static/v1?label=npm+30d&message=4%2C717&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

- **用途**：长周期开发者在换会话时找回任务及文件依据，交付物是可定位的上下文。
- **亮点**：session 事件同步任务，工具负责索引和检索；when 触发与 guard 收窄限制经验注入。
- **思考**：任务与文件关联有助于定位；错误经验也会持久化，引用存在不代表当前结论正确。
- **建议**：先在一个可丢弃项目中测试旧结论纠错和跨项目隔离，再决定是否长期启用。

<a id="plugin-1423215373-root"></a>

#### [dsh-reaper](../../plugins/11111353535--dsh-reaper/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper)

- **用途**：智能体遗留开发服务占用端口时，开发者需要区分可清理进程与宿主及系统服务。
- **亮点**：按宿主祖先链、工作区和保护规则评级，默认返回计划，confirm:true 才执行，发信号前再次检查保护。
- **思考**：归属和不可覆盖的保护规则比裸 kill 端口更有约束，但启发式归属仍不是授权证明。
- **建议**：先仅用扫描与预览，对照系统工具确认归属；实际清理只在可丢弃开发进程上验收。

<a id="plugin-1339262076-root"></a>

#### [dsh-repeat-stop](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop)

- **用途**：Agent原样重试却不进展时，用户希望及时切断循环，合格结果是阻断无效调用且不妨碍正常轮询。
- **亮点**：tools.guard与post-execute共用观察函数，以WeakSet避免同一exec重复计数，参数递归排序生成调用键，WeakMap保存每个Agent连续次数。
- **思考**：在执行前阻断比只注入提醒更强；阈值并不证明剩余调用有用，也不提供跨Agent团队总限额。
- **建议**：先在短任务记录触发次数，按轮询工具配置排除；被拦后检查输入和错误原因，不通过无意义改参数规避限制。

<a id="plugin-1350325873-root"></a>

#### [dsh-tool-budget](../../plugins/173787247--dsh-tool-budget/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget)

- **用途**：长任务工具调用失控时，用户需要明确停止点，合格结果是在预算内办结或及时交接，而非盲目增加调用。
- **亮点**：index.js在tools.guard统计调用，默认80次；WeakSet防同一exec重复计数，WeakMap把每个Agent预算分开。
- **思考**：硬停止点可以防止无限尝试；若开多个子Agent，总调用和费用仍可能成倍增加。
- **建议**：先按一类任务观察正常调用分布，再设阈值；长后台任务查询可排除，但排除列表应保持有限。

<a id="plugin-1335559646-root"></a>

#### [dsh-trellis](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) · [![npm 30d 1576](https://img.shields.io/static/v1?label=npm+30d&message=1%2C576&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)

- **用途**：复杂开发任务需要明确计划批准、步骤验证与归档状态，避免直接把写完代码当完成。
- **亮点**：Host 从项目 .trellis 状态注入阶段提示，复制缺失 Skill，工具管理任务；可选只读策略按授权状态过滤工具。
- **思考**：把完成门槛和执行清单显式化有利于协作；状态为 completed 仍需对应真实产物与验证依据。
- **建议**：先在测试项目检查任务创建、规划保护、批准和归档，再决定哪些项目启用。

<a id="plugin-1423215529-root"></a>

#### [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-which)

- **用途**：命令在终端与智能体中表现不同的开发者需要定位实际可执行文件和版本来源。
- **亮点**：自己按 PATH/PATHEXT 等规则解析候选，报告胜出与遮蔽项；版本探测使用解析后的路径、限定参数和超时。
- **思考**：让遮蔽副本成为一等输出可解释版本冲突；只有解析规则与实际 shell 一致才可信。
- **建议**：先只查询并对照当前 shell 的解析结果，必要时对可信二进制启用版本探测。

<a id="plugin-1381842592-root"></a>

#### [dsh-wsl-compose](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose)

- **用途**：需要从DSH检查本地Compose服务的开发者希望少写诊断命令，验收包括目标项目正确及服务实际状态。
- **亮点**：lib/compose.js规范化项目真实路径并检查allowRoots，spawn docker compose；变更入口同时要求allowMutate与confirm，日志限量返回。
- **思考**：项目边界和只读优先能减少误操作，但便利工具不能替代Docker本身的权限隔离和变更审批。
- **建议**：先仅开放ps/logs并配置明确根目录，在测试项目验证路径；需要up/down时先人工审阅Compose文件并保留运行状态。

<a id="plugin-1350379113-root"></a>

#### [dsh-wsl-cred](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cred)

- **用途**：WSL中git push认证失败的开发者需要区分HTTPS凭据与SSH代理问题，交付是明确下一步核查而非得到token。
- **亮点**：lib/cred.js执行git config与remote get-url，分类HTTPS/SSH并隐藏URL userinfo，探测常见Windows GCM路径，生成相应建议。
- **思考**：把SSH与HTTPS路径分开能减少错修；找到GCM可执行文件不证明凭据存在或具备目标仓库写权限。
- **建议**：先确认工具工作目录和远端协议，只读查看配置后再人工修改；不要为了验证把token贴进会话。

<a id="plugin-1381859591-root"></a>

#### [dsh-wsl-db](../../plugins/173787247--dsh-wsl-db/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db)

- **用途**：开发者想在会话里查看PostgreSQL或Redis状态，合格结果是目标正确、查询低风险且输出可复核。
- **亮点**：lib/db.js按前缀和关键字筛SQL、按命令白名单筛Redis，调用CLI并限制时间和输出；入口解析连接别名与host范围。
- **思考**：把连通与小查询标准化有排障价值；应用层读命令白名单无法证明查询成本低或没有副作用。
- **建议**：先使用数据库端只读角色和测试库，限制主机与别名，避免在大Redis执行KEYS；敏感查询结果谨慎进入模型上下文。

<a id="plugin-1351854212-root"></a>

#### [dsh-wsl-editor](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor)

- **用途**：用户希望从Agent定位的源码快速跳到Windows编辑器，验收是正确文件和行号实际可见。
- **亮点**：lib/editor.js检查路径存在并realpath，调用wslpath -w转换，依序用PowerShell Start-Process启动编辑器，支持code/cursor的-g目标。
- **思考**：减少复制路径和手工跳行的步骤；自动打开入口不意味着文件修改或任务已完成。
- **建议**：适合Windows+WSL开发，先测试当前发行版路径、中文空格和行号；自动回退后人工确认文件与定位。

<a id="plugin-1366089972-workspace-plugins-dsh-zero-residence"></a>

#### [dsh-zero-residence](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

- **用途**：工具输出很长的任务希望缩小反复发送的历史，同时保留回查原文能力；验收需兼顾最终任务质量。
- **亮点**：继承BasicCompactionEngine以确定性指针代替摘要，原文从会话持久记录回读；另有zr_fast用pwsh派生进程并返回日志句柄。
- **思考**：可追溯指针比不可逆摘要更利于复核；如果模型频繁回读或遗失指针，省下的输入可能被额外轮次抵消。
- **建议**：先在可恢复会话副本试压缩，验证关键证据能原样回查；异步命令只用于允许的测试任务，并确认宿主权限与取消边界。

<a id="plugin-1397817235-root"></a>

#### [IDE Hub](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub)

- **用途**：跨 IDE 工作的开发者需要盘点会话、配置和预算，而非逐个工具翻找。
- **亮点**：注册盘点、迁移、导出和 hub-init 命令，从本地状态读取信息，规则本体与各 IDE 指针分开维护。
- **思考**：统一索引和单份规则可减少查找及漂移；跨 IDE 的规则优先级仍需分别验收。
- **建议**：先只盘点两个实际使用的 IDE，再对一个测试项目 dry-run 规则分发并检查差异。

<a id="plugin-1379204512-root"></a>

#### [oh-my-dsh](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) · [![npm 30d 2379](https://img.shields.io/static/v1?label=npm+30d&message=2%2C379&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)

- **用途**：复杂开发任务需要规划、委派与验证分工，用户希望复用一套宿主适配的编排约定。
- **亮点**：入口注入协议并注册资产、命令和 MCP，team 模块维护阶段、队员身份与邮箱；实际派发与合并仍由领队模型驱动。
- **思考**：统一委派与恢复数据面可降低自建成本；多代理可能放大误解、冲突和预算超支。
- **建议**：先验装探测与取消，再对单仓库小任务比较原生单 agent 和一条显式 team 流程。

<a id="plugin-1334504487-root"></a>

#### [Plan Lattice](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice)

- **用途**：跨压缩和重启的长任务需要恢复已批准计划、待办及委派结果，减少依据丢失。
- **亮点**：native-continuity 从会话事件折叠计划、当回合 Todo 和最近委派结果；完整 Lattice 另有契约与行动依据控制。
- **思考**：从宿主已有事实恢复比模型重写计划更易追溯；恢复正确也不等于任务产出质量提升。
- **建议**：先对照原生行为测试压缩和重启恢复，再单独评估显式完整控制，避免将两模式效果混为一谈。

<a id="plugin-1399011094-root"></a>

#### [Task Forge](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge)

- **用途**：跨模型或 IDE 交接任务时，用户需要暴露接收方理解缺口并跟踪其持有版本。
- **亮点**：命令编译任务、导出交接包并记录台账；握手解析回读、缺口、STATUS 和版本，旧版本不得视为当前放行。
- **思考**：将隐含假设和版本漂移显性化有价值；作者的无损说法不能由模板和状态字样单独证明。
- **建议**：先用一个有明确验收点的小任务试交接，人工比对遗漏和改版后的接收方状态。

<a id="plugin-1333800488-root"></a>

#### [TaskSwarm — 贡献与交付证据研究](../../plugins/february2015--dsh-taskswarm/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm)

- **用途**：面向能拆分依赖、能定义验收的仓库开发任务，把多个执行者的工作组织为任务包、并行 lane 和串行集成流程。
- **亮点**：源码支持 DSH 原生 Agent 的创建、工具接线、任务进度持久化、隔离工作区与恢复编排。贡献主要是宿主适配和流程整合，waves、worktree、Reviewer 等方法明确来自 TaskPlane；尚无独立效果对照。
- **思考**：最关键的缺口是“完成”的证据约束：worker 自报完成、Reviewer 文本和 Git 合并能推进流程，但并未共同构成绑定最终代码版本的验收证明。因此协调能力成立，可靠交付增益仍待验证。
- **建议**：优先检验“与版本绑定的验收凭据能否同时约束集成、依赖放行和恢复”。先与简单 required checks／人工验收对照；若复杂协议没有额外收益，就采用简单方案。

## 更新时间

2026-10-20
