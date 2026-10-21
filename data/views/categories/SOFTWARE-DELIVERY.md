# 软件交付

[返回首页](../../../README.md)

代码开发、任务编排、调试与交付流程。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [agent-clinic](#plugin-1417442557-root) | 读取本地Agent会话与配置，生成带证据定位的诊断报告，并匹配可复核的改进处方。 | 先离线扫描少量会话并回读证据行，确认隐私与指纹保存策略；处方涉及配置修改时先备份并单独验证。 |
| [ai-look-up](#plugin-1401618027-root) | 监测重复命令、连续失败与目标漂移，向会话注入复盘提示并可调用审查模型。 | 先在非关键任务关闭第三通道，观察重复调用提醒的误报和冷却，再决定是否为审查增加预算。 |
| [DSH Verification Receipt](#plugin-1333370288-root) | 在每轮持久化结束时保存工具次数和验证形态信号的本地 JSONL 回执。 | 先对照一次明确成功和一次失败的测试任务，逐项比对回执与真实命令结果。 |
| [dsh-cache-bricks](#plugin-1386463441-root) | 可视化 DSH 模型请求、缓存命中率、活动与历史请求对比。 | 适合有明确缓存排查问题的用户试用，先核对provider usage口径与采集完整度，不据颜色直接删工具或归责某个提示改动。 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz) | 在 DSH 中把 CapMap 文档渲染为语义图谱、能力面板和状态看板。 | 适合已有CapMap规范的团队先在工作区副本浏览；核对看板关联与原文，初始化会写文档并安装Skill，先审阅预期文件，不能用状态标签代替验收证据。 |
| [dsh-domain-bridge](#plugin-1424063534-plugins-dsh-domain-bridge) | 为 DSH 顶层会话提供域寻址、消息投递、分级暂停与模型分派。 | 适合确有顶层会话分工的项目；先用无副作用消息验证暂停与恢复，正式任务自行加完成确认和幂等标识。 |
| [dsh-folderwatch](#plugin-1423215448-root) | 监测目录快照差异，把外部文件变化批量排队或唤醒原会话处理。 | 先以 queue 模式监听小目录，统计漏报、重复和自身写入抑制，再开放自动唤醒。 |
| [dsh-hdc-bridge](#plugin-1333258432-root) | 在 DSH 中连接鸿蒙设备，构建调试应用并查询版本化开发知识。 | 已有鸿蒙环境的开发者可在测试设备评估；先验证构建产物与设备身份，再评价闭环是否省时。 |
| [dsh-ledger-memory](#plugin-1412857520-root) | 为 DSH 项目维护台账、活动日志、上下文压缩与跨会话交接。 | 适合频繁压缩和接班的长期项目；先在可恢复项目副本上验证一轮压缩后的约束和原文回读，再决定是否让它维护正式台账。 |
| [dsh-mysql](#plugin-1337916824-root) | 管理多套MySQL连接，为会话提供选库入口及查询、表结构、数据写入和DDL工具。 | 先连接脱敏测试库和数据库端只读账号，核对选库与结果；确需写入时分别启用行写和DDL，并准备备份与人工复核。 |
| [dsh-project-memory](#plugin-1339316901-root) | 为项目保存任务、文档、代码符号与经验记录，支持跨会话检索和按条件注入。 | 先在一个可丢弃项目中测试旧结论纠错和跨项目隔离，再决定是否长期启用。 |
| [dsh-reaper](#plugin-1423215373-root) | 盘点端口占用与进程归属，先预览再按显式参数清理可归属的进程树。 | 先仅用扫描与预览，对照系统工具确认归属；实际清理只在可丢弃开发进程上验收。 |
| [dsh-repeat-stop](#plugin-1339262076-root) | 拦截同一Agent连续出现的同工具同参数调用，提供可配置阈值与排除规则。 | 先在短任务记录触发次数，按轮询工具配置排除；被拦后检查输入和错误原因，不通过无意义改参数规避限制。 |
| [dsh-session-diff](#plugin-1372976273-root) | 在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。 | 适合快速检查当前会话的常规write/edit；跨会话、shell改动和大文件仍用Git或专门差异工具复核。 |
| [dsh-tech-lead（旧组件）](#plugin-1345209661-packages-dsh-tech-lead) | 为 DSH 提供只读工程治理工具，检查任务分级、计划、证据、门禁、上下文及变更预览。 | 新采用者先核对根项目推荐的dsh-themis迁移路线，不优先安装这个旧组件；已有使用者可把它作为输入一致性检查，并保留真实测试和人工评审，先验证旧协议返回与现有调用方兼容。 |
| [dsh-tool-budget](#plugin-1350325873-root) | 按运行中的Agent限制工具调用总次数，支持包含与排除规则并在超额时拦截。 | 先按一类任务观察正常调用分布，再设阈值；长后台任务查询可排除，但排除列表应保持有限。 |
| [dsh-trellis](#plugin-1335559646-root) | 以任务步骤和阶段约束开发流程，提供验收门禁与可选规划期写工具过滤。 | 先在测试项目检查任务创建、规划保护、批准和归档，再决定哪些项目启用。 |
| [dsh-undo-plugin](#plugin-1338526178-packages-bundle-rollback) | 为 DSH 组合消息级文件与会话回滚、归档管理、工具卡片及轨迹折叠界面。 | 只在备份过且无子模块的独立Git工作区先试，核对安装后的七个依赖版本；用可丢弃修改测试文件和分叉上下文是否一起回到目标点，再考虑日常使用。 |
| [dsh-verify](#plugin-1335843750-root) | 通过 JSON 清单执行浏览器断言，提供 CLI、MCP 与 HTML 检查报告。 | 适合已有明确浏览器验收条件的网页团队先试用；分别审查规范、首次基线和运行错误，保留结构化结果，不用 PASS 代表完整需求或独立审计。 |
| [dsh-which](#plugin-1423215529-root) | 解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。 | 先只查询并对照当前 shell 的解析结果，必要时对可信二进制启用版本探测。 |
| [dsh-wsl-compose](#plugin-1381842592-root) | 封装Docker Compose状态、容器列表和日志，并可在配置允许及参数确认后执行up或down。 | 先仅开放ps/logs并配置明确根目录，在测试项目验证路径；需要up/down时先人工审阅Compose文件并保留运行状态。 |
| [dsh-wsl-cred](#plugin-1350379113-root) | 读取Git凭据助手与远端类型，给出WSL使用Windows Git Credential Manager的排障提示。 | 先确认工具工作目录和远端协议，只读查看配置后再人工修改；不要为了验证把token贴进会话。 |
| [dsh-wsl-db](#plugin-1381859591-root) | 通过psql和redis-cli执行受限查询与连通探针，支持配置连接别名和Redis主机范围。 | 先使用数据库端只读角色和测试库，限制主机与别名，避免在大Redis执行KEYS；敏感查询结果谨慎进入模型上下文。 |
| [dsh-wsl-editor](#plugin-1351854212-root) | 把WSL文件路径转换为Windows路径，在Cursor、VS Code或记事本中打开并可定位行列。 | 适合Windows+WSL开发，先测试当前发行版路径、中文空格和行号；自动回退后人工确认文件与定位。 |
| [dsh-wsl-git](#plugin-1381833309-root) | 提供有输出上限的Git状态、提交日志和差异统计查询。 | 先配置允许的仓库目录，拿包含未跟踪文件的工作区核对计数，不用摘要代替差异审阅。 |
| [dsh-wsl-github](#plugin-1350544211-root) | 通过GitHub App或Token查询仓库PR与Actions状态，并提供认证配置诊断。 | 用单个测试仓库配置只读权限，核对返回运行属于哪个提交；不要把仓库最新CI当作当前PR检查。 |
| [dsh-wsl-glab](#plugin-1381859919-root) | 封装glab，查询GitLab合并请求、Issue与流水线状态。 | 先明确目标仓库和GitLab主机，对照一个已知MR核验字段，不把限量列表当全量。 |
| [dsh-wsl-helm](#plugin-1381843528-root) | 在DSH内查询Helm发布列表、状态和历史，限制命令与输出范围。 | 先明确context，不依赖默认集群；只读查询也可能返回敏感配置，限制账号权限。 |
| [dsh-wsl-k8s](#plugin-1381726881-root) | 提供受限的kubectl查询工具，读取集群资源、描述与截断日志。 | 明确context和namespace，用只读账号测试；先核对省略context时的实际目标。 |
| [dsh-wsl-pkg](#plugin-1381861315-root) | 汇总npm、pip与cargo依赖信息，提供npm过期版本检查入口。 | 先限定allowRoots并核对Python环境；cargo入口须先验证参数，不能把ok当依赖无问题。 |
| [dsh-wsl-search](#plugin-1381725987-root) | 在允许目录内用ripgrep、fd和ast-grep搜索文本、文件名与代码结构。 | 显式设定项目根而非整个home，以已知命中验证工具身份和结果截断。 |
| [dsh-wsl-ssh-agent](#plugin-1351854356-root) | 诊断WSL的SSH代理环境、已加载密钥数量与Windows代理桥接条件。 | 把live socket当启发式提示，失败时查看sshAddDetail；不要在聊天中复制私钥。 |
| [dsh-wsl-tmux](#plugin-1381833652-root) | 在 DSH 中列出 tmux 会话并读取 pane 输出。 | 适合单 pane 的长任务观察；多窗口先人工确认目标，关键完成状态应另查产物或退出码，不能只凭终端尾部。 |
| [dsh-wsl-workspace](#plugin-1351853812-root) | 列出 WSL 发行版并检查 Linux 工作区路径与 /mnt 放置情况。 | 适合首次选工作区时快速排查；符号链接或特殊挂载需手动核对真实路径和文件系统，迁移仓库前另行备份与确认。 |
| [dsh-zero-residence](#plugin-1366089972-workspace-plugins-dsh-zero-residence) | 把长会话内容压缩为可回查指针，提供账本、召回、强制压缩和异步命令入口。 | 先在可恢复会话副本试压缩，验证关键证据能原样回查；异步命令只用于允许的测试任务，并确认宿主权限与取消边界。 |
| [ETeams](#plugin-1372993989-root) | 为 DeepSeek Harness 提供领队拆解、成员子会话接力和任务看板。 | 适合可拆分且验收条件清晰的任务；先用无外部副作用的任务验证重启、唤醒失败和重复汇报处理，再评估长期使用。 |
| [IDE Hub](#plugin-1397817235-root) | 汇总多种编码工具的本地会话、用量与规则，并提供项目规则统一分发入口。 | 先只盘点两个实际使用的 IDE，再对一个测试项目 dry-run 规则分发并检查差异。 |
| [oh-my-dsh](#plugin-1379204512-root) | 为 DSH 提供角色、Skill 与多智能体协调协议，支持自动推进和显式团队流程。 | 先验装探测与取消，再对单仓库小任务比较原生单 agent 和一条显式 team 流程。 |
| [Plan Lattice](#plugin-1334504487-root) | 从原生会话事实恢复长任务连续性，并提供显式启用的递归工作图控制。 | 先对照原生行为测试压缩和重启恢复，再单独评估显式完整控制，避免将两模式效果混为一谈。 |
| [Qoder 子代理聚合](#plugin-1425006726-root) | 把 Qoder 与 QoderCN 订阅 CLI 接入 DSH 子代理，展示进度与执行状态。 | 已有对应订阅且能隔离工作目录的团队可先做可撤销任务；配置明确超时与权限后，再评估写任务，不以可查询进度代替验收。 |
| [SSH 只读日志工具](#plugin-1346017360-root) | 通过预配置 SSH 别名读取或搜索有界远端日志，作为 MCP 工具接入 DSH。 | 适合已建立只读SSH权限的团队先用测试服务器验证；根目录不能单靠字符串约束当隔离，生产环境以服务端账号权限兜底。 |
| [Task Forge](#plugin-1399011094-root) | 把需求整理成版本化任务书，通过交接包和回读握手管理跨窗口协作。 | 先用一个有明确验收点的小任务试交接，人工比对遗漏和改版后的接收方状态。 |
| [TaskSwarm — 贡献与交付证据研究](#plugin-1333800488-root) | 按依赖分波，在 Git worktree 中执行任务包，并提供评审、集成、状态观察与恢复。 | 优先检验“与版本绑定的验收凭据能否同时约束集成、依赖放行和恢复”。 |
| [任务监控与 Git 操作面板](#plugin-1406156934-dsh-task-monitor) | 在 DSH 右侧汇总任务活动，并提供 Git 提交、推送与 GitHub 发布入口。 | 仅在读懂当前Git/GitHub写副作用后于临时仓库验证；把监控活动当辅助线索，提交推送仍须核对差异、目标分支和结果。 |

<a id="plugin-1417442557-root"></a>

## [agent-clinic](../../plugins/1687210989--agent-clinic/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1687210989/agent-clinic) · [![npm 30d 95](https://img.shields.io/static/v1?label=npm+30d&message=95&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/agent-clinic)

- **用途**：用户感觉Agent循环、上下文浪费或失忆，希望从实际日志定位问题，合格结果是能回查的证据和适用建议。
- **亮点**：adapters/dsh.mjs解析事件并保留行定位，report和prescriber生成诊断与配置建议，跨会话比较用本地加盐指纹；插件与CLI共用分析核心。
- **思考**：证据定位与撤回不适用处方比只报数字更利于行动；插件目录匹配依据不能证明被推荐插件安全或有效。
- **建议**：先离线扫描少量会话并回读证据行，确认隐私与指纹保存策略；处方涉及配置修改时先备份并单独验证。

<a id="plugin-1401618027-root"></a>

## [ai-look-up](../../plugins/1344738825--ai-look-up/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1344738825/ai-look-up)

- **用途**：长任务中Agent反复失败却继续调用工具，用户希望尽早提示停下来检查方向；成功标准应是减少无效尝试。
- **亮点**：index.js 监听会话事件，按spec.json阈值与冷却判定触发；可用宿主模型生成复盘建议，失败退回静态清单，另支持外部watcher通道。
- **思考**：将行为信号转为可见提醒比静默循环更可控；提醒不是强制停止，错误诊断也可能把正常重试打断。
- **建议**：先在非关键任务关闭第三通道，观察重复调用提醒的误报和冷却，再决定是否为审查增加预算。

<a id="plugin-1333370288-root"></a>

## [DSH Verification Receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) · [![npm 30d 881](https://img.shields.io/static/v1?label=npm+30d&message=881&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt)

- **用途**：代码协作者希望追问某轮究竟记录过哪些执行信号，而不是只看模型完成声明。
- **亮点**：监听 turn/end 相关 session 事件，按执行轨迹和词法信号生成摘要并串行追加 JSONL。
- **思考**：缩小到可检查的执行信号比声称自动验收更可靠；回执本身不能代替失败放行规则。
- **建议**：先对照一次明确成功和一次失败的测试任务，逐项比对回执与真实命令结果。

<a id="plugin-1386463441-root"></a>

## [dsh-cache-bricks](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/3289192-bot/dsh-cache-bricks)

- **用途**：调试长会话上下文与缓存波动的本机DSH Web用户，需要把某次真实请求与对话位置对应。
- **亮点**：相对只看总token数字，attempt粒度观测、请求对比及会话定位把排查对象具体化；独立纯数据指标模块让视图共享同一口径。缓存本身由provider提供，插件不产生缓存优化。
- **思考**：红色砖是否能定位缓存下降原因？比例来源于宿主报告且默认三桶互斥，不同provider口径错误会传播；缺字段用未知是强支持，但比较两次请求不能建立改动导致命中率下降的因果。历史日志也未必恢复内存中全部细节。
- **建议**：适合有明确缓存排查问题的用户试用，先核对provider usage口径与采集完整度，不据颜色直接删工具或归责某个提示改动。

<a id="plugin-1356896576-dsh-capmap-viz"></a>

## [dsh-capmap-viz](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1741505640/capmap-skills) · [![npm 30d 640](https://img.shields.io/static/v1?label=npm+30d&message=640&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz)

- **用途**：已经采用CapMap目录/标签规范的软件团队，想从本地文档定位能力、方案、测试和可开工切片；交付是可回到原文的状态视图。
- **亮点**：相对通用Obsidian链接图，具体增量是把方案/测试/能力和切片sidecar分层，生成依赖可开工与验证门视图；D3图布局、文件watch与Cordis接线来自上游。业务增量是将文档规范变成日常检查入口，不是自动验收系统。
- **思考**：最关键的质疑是看板的“验证门”是否真实绑定方案证据。queries.ts 把同主题测试也视作关联，可能用另一方案的已验证测试消除警报；状态来自人工标签，不读取运行验收。图谱可导航不能证明实施完毕。
- **建议**：适合已有CapMap规范的团队先在工作区副本浏览；核对看板关联与原文，初始化会写文档并安装Skill，先审阅预期文件，不能用状态标签代替验收证据。

<a id="plugin-1424063534-plugins-dsh-domain-bridge"></a>

## [dsh-domain-bridge](../../plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role) · [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge)

- **用途**：多个顶层会话按项目领域分工，需要明确负责人和暂停期间可追踪消息；交付是有回执的任务交接。
- **亮点**：相对宿主子树内通讯及人工搬运，实际补上顶层会话寻址和职责声明；把在线事实、暂停政策、终结生命周期分开，避免将暂停误作离线。不是全局调度器，约束只覆盖插件介导路径。
- **思考**：“落盘队列”是否等于可靠交接最关键。messaging.js 的 delivered 表示投递成功，不是收件方完成；rewriteInbox 用固定 .tmp 重写，不能从原子 rename 推出多写者事务保证。暂停也拦不住 GUI 或宿主直接 resume，因此不能承诺系统级停机。
- **建议**：适合确有顶层会话分工的项目；先用无副作用消息验证暂停与恢复，正式任务自行加完成确认和幂等标识。

<a id="plugin-1423215448-root"></a>

## [dsh-folderwatch](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch)

- **用途**：等待构建报告、下载或共享目录交接的智能体需要发现外部变化，减少反复手工查询。
- **亮点**：周期扫描与快照差分作为主路径，fs.watch 只提示加速；批量去抖、冷却和短时自身写入账本抑制回声。
- **思考**：准确变化摘要比轮询提示更利于交接；通知到达并不保证后续任务成功。
- **建议**：先以 queue 模式监听小目录，统计漏报、重复和自身写入抑制，再开放自动唤醒。

<a id="plugin-1333258432-root"></a>

## [dsh-hdc-bridge](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge) · [![npm 30d 1740](https://img.shields.io/static/v1?label=npm+30d&message=1%2C740&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge)

- **用途**：鸿蒙应用开发者在会话中观察设备、修改代码、构建部署并复核行为；合格交付是目标设备上符合预期的应用。
- **亮点**：作者明确以hdc_mcp为已有参照、不重写协议。增量在将会话策略、设备观察、构建回退和版本知识接入同一工作流；shell seam缺失与沙箱环境失败独立报告，减少把环境故障误认成hdc缺失。
- **思考**：构建成功是否真的对应本次代码？build_project允许devecocli产物未更新时返回成功并附stale警告；hvigorw回退则要求mtime增长，增量无变化可能被拒。产物存在与mtime均不足以证明包对应目标配置，不能把ok视为部署验收。设备自动回退首台也可能改变观察对象。
- **建议**：已有鸿蒙环境的开发者可在测试设备评估；先验证构建产物与设备身份，再评价闭环是否省时。

<a id="plugin-1412857520-root"></a>

## [dsh-ledger-memory](../../plugins/18477514055--dsh-ledger-memory/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory) · [![npm 30d 3016](https://img.shields.io/static/v1?label=npm+30d&message=3%2C016&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory)

- **用途**：长期开发项目的负责人需要在压缩和换会话后找回状态、原始报错与决策依据；交付物是可追溯项目记忆，而非完整聊天复制。
- **亮点**：作者强调可回溯长期记忆。相对手写 AGENTS/状态文件，实际增量是把项目语义分区、压缩前落盘义务和压缩后逐字回注连成协议；part5 的 triage 工具将需要常驻的约束与只需检索的依据分开。不是新的记忆模型，内容选择仍归模型。
- **思考**：最关键是“落盘”能否代表真正保留了任务约束。硬门可检查工具调用和持久化周期，却不能证明模型写全语义；keep 上限截断也可能丢掉末尾的重要约束。胶囊原文提供回读补救，但回读仍需模型正确判断，不能从机制存在推出连续性已保证。
- **建议**：适合频繁压缩和接班的长期项目；先在可恢复项目副本上验证一轮压缩后的约束和原文回读，再决定是否让它维护正式台账。

<a id="plugin-1337916824-root"></a>

## [dsh-mysql](../../plugins/1321928757--dsh-mysql/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql) · [![npm 30d 36](https://img.shields.io/static/v1?label=npm+30d&message=36&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mysql)

- **用途**：开发者在数据库排障与分析时需要先看结构再查数据，交付应是可复核SQL和正确结果，而非仅返回成功。
- **亮点**：Host 注册四个全局工具；会话选择连接后逐调用确定目标，shared.js 分类SQL并检查表范围，写入与DDL分别开关。
- **思考**：显式选库和拆分读写权限能减少误路由；应用层检查不能替代数据库授权，模型也会看到查询结果。
- **建议**：先连接脱敏测试库和数据库端只读账号，核对选库与结果；确需写入时分别启用行写和DDL，并准备备份与人工复核。

<a id="plugin-1339316901-root"></a>

## [dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4717](https://img.shields.io/static/v1?label=npm+30d&message=4%2C717&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

- **用途**：长周期开发者在换会话时找回任务及文件依据，交付物是可定位的上下文。
- **亮点**：session 事件同步任务，工具负责索引和检索；when 触发与 guard 收窄限制经验注入。
- **思考**：任务与文件关联有助于定位；错误经验也会持久化，引用存在不代表当前结论正确。
- **建议**：先在一个可丢弃项目中测试旧结论纠错和跨项目隔离，再决定是否长期启用。

<a id="plugin-1423215373-root"></a>

## [dsh-reaper](../../plugins/11111353535--dsh-reaper/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper)

- **用途**：智能体遗留开发服务占用端口时，开发者需要区分可清理进程与宿主及系统服务。
- **亮点**：按宿主祖先链、工作区和保护规则评级，默认返回计划，confirm:true 才执行，发信号前再次检查保护。
- **思考**：归属和不可覆盖的保护规则比裸 kill 端口更有约束，但启发式归属仍不是授权证明。
- **建议**：先仅用扫描与预览，对照系统工具确认归属；实际清理只在可丢弃开发进程上验收。

<a id="plugin-1339262076-root"></a>

## [dsh-repeat-stop](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop)

- **用途**：Agent原样重试却不进展时，用户希望及时切断循环，合格结果是阻断无效调用且不妨碍正常轮询。
- **亮点**：tools.guard与post-execute共用观察函数，以WeakSet避免同一exec重复计数，参数递归排序生成调用键，WeakMap保存每个Agent连续次数。
- **思考**：在执行前阻断比只注入提醒更强；阈值并不证明剩余调用有用，也不提供跨Agent团队总限额。
- **建议**：先在短任务记录触发次数，按轮询工具配置排除；被拦后检查输入和错误原因，不通过无意义改参数规避限制。

<a id="plugin-1372976273-root"></a>

## [dsh-session-diff](../../plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff)

- **用途**：开发者想确认本轮会话改了哪些文件，不希望Git里其他会话的改动混入；验收是对应会话工具事件的准确变更视图。
- **亮点**：相对工作区git diff，增量是会话作用域归属和就地侧栏呈现；原生查看器保留给未修改文件，避免抢占所有文档。差异算法属成熟方法，贡献在事件归属与宿主展示接线。
- **思考**：会话工具事件能覆盖多少实际文件修改最关键：shell修改、外部编辑或工具未记录旧文本，不能由write/edit节点推得完整历史；当前文件还可能被另一会话改动。readWholeFile有限行/页数，展示截断不能看作全文件审计。
- **建议**：适合快速检查当前会话的常规write/edit；跨会话、shell改动和大文件仍用Git或专门差异工具复核。

<a id="plugin-1345209661-packages-dsh-tech-lead"></a>

## [dsh-tech-lead（旧组件）](../../plugins/240xu--verdict-engine--packages-dsh-tech-lead/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/240xu/verdict-engine) · [![npm 30d 68](https://img.shields.io/static/v1?label=npm+30d&message=68&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-tech-lead)

- **用途**：面向需要让Agent工程规范可机械复核的团队；合格结果是指出调用者输入中违反规则的字段，而非证明真实代码或环境已经满足发布标准。
- **亮点**：相对纯文本规范靠模型自觉，本项把任务分级、证据字段和门禁条件做成确定性的只读计算，减少遗漏格式与角色分工检查；原创增量在规则可执行化和一致输出，而非证明输入事实为真。组件内复制core、固定旧工具依赖，必须按所选路径评价。
- **思考**：“机械门禁通过”能否等于真实独立评审完成？gate.js比较字符串身份、非空锚点和报告数量，不读取文件、执行命令或验证评审身份，空输入在部分判据缺省时也不表达外部环境合格。最强支持是能精确检出输入矛盾，最强反例是构造格式完整但虚假的证据仍可能过机械子集。
- **建议**：新采用者先核对根项目推荐的dsh-themis迁移路线，不优先安装这个旧组件；已有使用者可把它作为输入一致性检查，并保留真实测试和人工评审，先验证旧协议返回与现有调用方兼容。

<a id="plugin-1350325873-root"></a>

## [dsh-tool-budget](../../plugins/173787247--dsh-tool-budget/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget)

- **用途**：长任务工具调用失控时，用户需要明确停止点，合格结果是在预算内办结或及时交接，而非盲目增加调用。
- **亮点**：index.js在tools.guard统计调用，默认80次；WeakSet防同一exec重复计数，WeakMap把每个Agent预算分开。
- **思考**：硬停止点可以防止无限尝试；若开多个子Agent，总调用和费用仍可能成倍增加。
- **建议**：先按一类任务观察正常调用分布，再设阈值；长后台任务查询可排除，但排除列表应保持有限。

<a id="plugin-1335559646-root"></a>

## [dsh-trellis](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) · [![npm 30d 1576](https://img.shields.io/static/v1?label=npm+30d&message=1%2C576&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)

- **用途**：复杂开发任务需要明确计划批准、步骤验证与归档状态，避免直接把写完代码当完成。
- **亮点**：Host 从项目 .trellis 状态注入阶段提示，复制缺失 Skill，工具管理任务；可选只读策略按授权状态过滤工具。
- **思考**：把完成门槛和执行清单显式化有利于协作；状态为 completed 仍需对应真实产物与验证依据。
- **建议**：先在测试项目检查任务创建、规划保护、批准和归档，再决定哪些项目启用。

<a id="plugin-1338526178-packages-bundle-rollback"></a>

## [dsh-undo-plugin](../../plugins/23swccp--dsh-undo--packages-bundle-rollback/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/23swccp/dsh-undo) · [![npm 30d 979](https://img.shields.io/static/v1?label=npm+30d&message=979&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-undo-plugin)

- **用途**：面向Agent修改代码后需要撤回某轮文件与对话上下文的开发者；合格回滚须目标文件树正确、分叉会话不再看到已撤回工具历史，且失败可恢复。
- **亮点**：相对git reset只还原文件、会话继续携带旧工具记忆，以及单纯新建聊天，贡献是私有Git快照与按消息边界分叉对齐。私有GIT_DIR/INDEX保护用户仓库索引，journal记录副作用阶段；bundle同时调整归档namespace所有权，因此是跨插件工作流组合而非单个撤销按钮。
- **思考**：文件恢复、会话fork和归档能否构成一个可恢复的逻辑动作？rollback-undo/src/index.ts先记录restoring，再并发fork/restore，并对部分失败补偿，但这些系统并非单个原子事务。ShadowGit明确拒绝submodule，且只保存Git支持的路径；外部数据库/API副作用不在快照中。正常路径源码充分，崩溃窗口恢复仍须实际故障实验。
- **建议**：只在备份过且无子模块的独立Git工作区先试，核对安装后的七个依赖版本；用可丢弃修改测试文件和分叉上下文是否一起回到目标点，再考虑日常使用。外部服务写入仍需单独处理。

<a id="plugin-1335843750-root"></a>

## [dsh-verify](../../plugins/263311487-ux--dsh-verify/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/263311487-ux/dsh-verify) · [![npm 30d 2432](https://img.shields.io/static/v1?label=npm+30d&message=2%2C432&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verify)

- **用途**：给 Agent 生成的网页做可重复验收，交付物是具体浏览器断言结果及截图，而不是模型口头完成声明。
- **亮点**：相对直接写 Playwright 脚本，贡献是可审阅 JSON 规范与报告的轻量组合，并通过计算样式断言覆盖只检查 CSS class 的盲点。浏览器和像素比较是既有机制，不归为本项目原创；清单仍由人或模型决定。
- **思考**：浏览器执行能否证明交付完整且独立？runOne 只判断给定 steps，空清单拒绝通过，但缺漏需求不会自动成为失败；expect_screenshot 缺少基线时创建并通过，不能视为已比较过视觉基线。良好人工规范可以收窄这些边界，但执行本身不建立清单独立性。
- **建议**：适合已有明确浏览器验收条件的网页团队先试用；分别审查规范、首次基线和运行错误，保留结构化结果，不用 PASS 代表完整需求或独立审计。

<a id="plugin-1423215529-root"></a>

## [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-which)

- **用途**：命令在终端与智能体中表现不同的开发者需要定位实际可执行文件和版本来源。
- **亮点**：自己按 PATH/PATHEXT 等规则解析候选，报告胜出与遮蔽项；版本探测使用解析后的路径、限定参数和超时。
- **思考**：让遮蔽副本成为一等输出可解释版本冲突；只有解析规则与实际 shell 一致才可信。
- **建议**：先只查询并对照当前 shell 的解析结果，必要时对可信二进制启用版本探测。

<a id="plugin-1381842592-root"></a>

## [dsh-wsl-compose](../../plugins/173787247--dsh-wsl-compose/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose)

- **用途**：需要从DSH检查本地Compose服务的开发者希望少写诊断命令，验收包括目标项目正确及服务实际状态。
- **亮点**：lib/compose.js规范化项目真实路径并检查allowRoots，spawn docker compose；变更入口同时要求allowMutate与confirm，日志限量返回。
- **思考**：项目边界和只读优先能减少误操作，但便利工具不能替代Docker本身的权限隔离和变更审批。
- **建议**：先仅开放ps/logs并配置明确根目录，在测试项目验证路径；需要up/down时先人工审阅Compose文件并保留运行状态。

<a id="plugin-1350379113-root"></a>

## [dsh-wsl-cred](../../plugins/173787247--dsh-wsl-cred/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cred)

- **用途**：WSL中git push认证失败的开发者需要区分HTTPS凭据与SSH代理问题，交付是明确下一步核查而非得到token。
- **亮点**：lib/cred.js执行git config与remote get-url，分类HTTPS/SSH并隐藏URL userinfo，探测常见Windows GCM路径，生成相应建议。
- **思考**：把SSH与HTTPS路径分开能减少错修；找到GCM可执行文件不证明凭据存在或具备目标仓库写权限。
- **建议**：先确认工具工作目录和远端协议，只读查看配置后再人工修改；不要为了验证把token贴进会话。

<a id="plugin-1381859591-root"></a>

## [dsh-wsl-db](../../plugins/173787247--dsh-wsl-db/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db)

- **用途**：开发者想在会话里查看PostgreSQL或Redis状态，合格结果是目标正确、查询低风险且输出可复核。
- **亮点**：lib/db.js按前缀和关键字筛SQL、按命令白名单筛Redis，调用CLI并限制时间和输出；入口解析连接别名与host范围。
- **思考**：把连通与小查询标准化有排障价值；应用层读命令白名单无法证明查询成本低或没有副作用。
- **建议**：先使用数据库端只读角色和测试库，限制主机与别名，避免在大Redis执行KEYS；敏感查询结果谨慎进入模型上下文。

<a id="plugin-1351854212-root"></a>

## [dsh-wsl-editor](../../plugins/173787247--dsh-wsl-editor/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor)

- **用途**：用户希望从Agent定位的源码快速跳到Windows编辑器，验收是正确文件和行号实际可见。
- **亮点**：lib/editor.js检查路径存在并realpath，调用wslpath -w转换，依序用PowerShell Start-Process启动编辑器，支持code/cursor的-g目标。
- **思考**：减少复制路径和手工跳行的步骤；自动打开入口不意味着文件修改或任务已完成。
- **建议**：适合Windows+WSL开发，先测试当前发行版路径、中文空格和行号；自动回退后人工确认文件与定位。

<a id="plugin-1381833309-root"></a>

## [dsh-wsl-git](../../plugins/173787247--dsh-wsl-git/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-git)

- **用途**：Agent检查仓库现状时，先取得简短摘要，避免完整patch占满上下文。
- **亮点**：相比自由Shell指令把常见只读检查收敛为有上限的工具；减少输出组织工作，不是新的Git分析算法。
- **思考**：状态摘要主体排除未跟踪文件，而changedFiles计数又包含未跟踪项；读者可能看到计数与明细不对应，且统计不代表代码语义正确。
- **建议**：本次未形成新的创新假设；优先让计数与明细口径一致，并比较摘要是否减少误判。

<a id="plugin-1350544211-root"></a>

## [dsh-wsl-github](../../plugins/173787247--dsh-wsl-github/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-github)

- **用途**：WSL内的Agent需要查询当前仓库协作状态，又不希望把API密钥直接放入聊天。
- **亮点**：把App安装认证和有限只读查询接入DSH工具；短期凭据减少人工搬运，认证机制本身来自GitHub。
- **思考**：fetchRepoStatus读取仓库最近一次Actions运行，未绑定PR head SHA；认证就绪和一次状态查询成功也不等于目标PR检查通过或具备合并条件。
- **建议**：待验证假设：将状态查询绑定PR head SHA而非仓库最新运行，可减少跨分支绿色检查误认；需保留权限不足状态。

<a id="plugin-1381859919-root"></a>

## [dsh-wsl-glab](../../plugins/173787247--dsh-wsl-glab/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-glab)

- **用途**：使用GitLab的开发者希望在DSH内查看协作对象及流水线，而不手工复制CLI长输出。
- **亮点**：把GitLab CLI的只读子集结构化接入Agent；主要增量是输出整形与调用约束，未发现新的协作流程机制。
- **思考**：列表按单页和条数上限返回，截断或一页结果不能支持仓库全量统计；ci status与当前待审提交的对应关系需额外核对。
- **建议**：本次未形成新的创新假设；先检查分页完整性与流水线提交绑定，避免将展示便利当成验收。

<a id="plugin-1381843528-root"></a>

## [dsh-wsl-helm](../../plugins/173787247--dsh-wsl-helm/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-helm)

- **用途**：维护Kubernetes发布时，先取得Helm状态而不让Agent直接执行升级或卸载。
- **亮点**：将Helm只读查询和输出限量接入工具层；增量是调用边界与结构化展示，底层部署语义仍来自Helm。
- **思考**：guardContext对空context返回undefined，使用者可能落到本机默认集群；配置allowedContexts并不等于每次实际目标都已核实。
- **建议**：待验证假设：调用前把省略context解析为明确集群并检查白名单，可减少默认上下文漂移；若增加的查询成本显著则缓存并绑定配置版本。

<a id="plugin-1381726881-root"></a>

## [dsh-wsl-k8s](../../plugins/173787247--dsh-wsl-k8s/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-k8s)

- **用途**：Agent辅助排查Kubernetes时，先收集状态而不直接开放apply、delete或exec。
- **亮点**：将常见kubectl读取路径缩为专用工具，降低自由命令的变更面；权限仍由kubeconfig和集群控制。
- **思考**：空context会返回undefined，实际查询可继承默认集群；列表过滤allowedContexts不能证明省略参数的后续查询也落在允许集群。
- **建议**：待验证假设：把已解析集群身份绑定到每次结果和后续调用，可降低默认上下文变化导致的错集群排障。

<a id="plugin-1381861315-root"></a>

## [dsh-wsl-pkg](../../plugins/173787247--dsh-wsl-pkg/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-pkg)

- **用途**：开发者让Agent排查依赖状态，需要浅摘要而非大量原始输出。
- **亮点**：将多包管理器诊断统一为工具入口，并对目录和输出设边界；依赖解析和版本判断仍由上游CLI完成。
- **思考**：cargo实际参数为tree -d 1，不能仅据描述确认它按深度1工作；npm解析失败仍返回ok:true，pip取PATH环境也不等于目标项目环境。
- **建议**：待验证假设：统一返回执行状态、解析状态与环境身份，可减少把空摘要误认为健康依赖；尚未实现。

<a id="plugin-1381725987-root"></a>

## [dsh-wsl-search](../../plugins/173787247--dsh-wsl-search/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search)

- **用途**：Agent在大型工作区定位代码时，需要比整文件读取更紧凑、可追溯的匹配结果。
- **亮点**：把三种成熟搜索器接成统一工具，并给出根目录约束和模型可消费结果；搜索算法不是插件原创。
- **思考**：rg的max-count是每文件上限，且结果数在进程完成后再裁剪；ast-grep也主要事后裁剪，不能把返回条数上限等同实际工作量上限。默认允许home范围较宽，根路径检查不等于操作系统沙箱。
- **建议**：待验证假设：流式读取达到全局匹配预算即停止子进程，能减少宽目录搜索的等待和缓冲；提前停止也可能漏掉更相关文件。

<a id="plugin-1351854356-root"></a>

## [dsh-wsl-ssh-agent](../../plugins/173787247--dsh-wsl-ssh-agent/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ssh-agent)

- **用途**：Git SSH认证失败时，区分环境未继承、代理失效、未加载密钥与Windows桥接未配。
- **亮点**：把常见SSH代理排障线索聚合为不回传私钥内容的提示；不自动建立代理桥接，也不证明目标Git服务认证通过。
- **思考**：sockAlive只由exists判断，路径存在不证明是可服务的socket；ssh-add失败被归为keyCount=0，与真实空代理不同，可能误导加载密钥建议。
- **建议**：待验证假设：分别表示路径存在、socket类型、代理协议可达和目标授权，可减少把不同失败合并；额外探测可能增加延迟和权限要求。

<a id="plugin-1381833652-root"></a>

## [dsh-wsl-tmux](../../plugins/173787247--dsh-wsl-tmux/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tmux)

- **用途**：长时间构建或训练放在 tmux 的开发者，希望由 Agent 读取当前终端尾部辅助排障，而不向任务发送输入。
- **亮点**：相对复制终端日志，增量是一个不发送按键的观察入口；tmux 继续拥有会话和滚动缓冲，插件没有任务控制或完成判定机制。
- **思考**：日志尾部是否足以代表任务完成是关键。capture 仅按会话定位默认 pane，没有精确窗口/pane 身份；list 对任意退出码1都返回空会话，可能把查询故障误解为无任务。
- **建议**：适合单 pane 的长任务观察；多窗口先人工确认目标，关键完成状态应另查产物或退出码，不能只凭终端尾部。

<a id="plugin-1351853812-root"></a>

## [dsh-wsl-workspace](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-workspace)

- **用途**：首次在WSL配置DSH的开发者需要避免工作区选错发行版或落在Windows用户目录，以目录诊断和建议迁移路径为交付。
- **亮点**：相对人工检查pwd和发行版，增量是把目录放置规则与当前/默认发行版差异汇成可读诊断；不测文件系统性能，也不实施迁移。
- **思考**：核心质疑是“Linux侧路径”等不等于真实底层文件系统。源码在realpath前按原abs分类，home下符号链接指向/mnt仍可能ok；非/mnt的挂载也未探测。因此只能当启发式，不是性能/合法性认证。
- **建议**：适合首次选工作区时快速排查；符号链接或特殊挂载需手动核对真实路径和文件系统，迁移仓库前另行备份与确认。

<a id="plugin-1366089972-workspace-plugins-dsh-zero-residence"></a>

## [dsh-zero-residence](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

- **用途**：工具输出很长的任务希望缩小反复发送的历史，同时保留回查原文能力；验收需兼顾最终任务质量。
- **亮点**：继承BasicCompactionEngine以确定性指针代替摘要，原文从会话持久记录回读；另有zr_fast用pwsh派生进程并返回日志句柄。
- **思考**：可追溯指针比不可逆摘要更利于复核；如果模型频繁回读或遗失指针，省下的输入可能被额外轮次抵消。
- **建议**：先在可恢复会话副本试压缩，验证关键证据能原样回查；异步命令只用于允许的测试任务，并确认宿主权限与取消边界。

<a id="plugin-1372993989-root"></a>

## [ETeams](../../plugins/2507483326--dsh-eteams/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2507483326/dsh-eteams) · [![npm 30d 1445](https://img.shields.io/static/v1?label=npm+30d&message=1%2C445&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-eteams)

- **用途**：需要多个角色接力完成代码或文档任务的用户，将验收条件与成员职责落实到可追踪任务；交付应是通过合同验收的成果。
- **亮点**：相对手工多会话交接，增量是将合同、执行链、尝试令牌及交接邮件纳入一致状态，再异步唤醒成员；唤醒失败不回滚已提交邮件，保留后续读取机会。并非仅用角色提示词模拟团队。
- **思考**：持久任务状态能否可靠区分会话死亡与观测失败？reconcile.liveAgentIds在服务缺失或抛错时返回空集合，超过60秒宽限的在办attempt会被挂起。该分支可能把宿主暂时不可观测写成业务状态；没有实测故障注入，不能宣称重启恢复无误。
- **建议**：适合可拆分且验收条件清晰的任务；先用无外部副作用的任务验证重启、唤醒失败和重复汇报处理，再评估长期使用。

<a id="plugin-1397817235-root"></a>

## [IDE Hub](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub)

- **用途**：跨 IDE 工作的开发者需要盘点会话、配置和预算，而非逐个工具翻找。
- **亮点**：注册盘点、迁移、导出和 hub-init 命令，从本地状态读取信息，规则本体与各 IDE 指针分开维护。
- **思考**：统一索引和单份规则可减少查找及漂移；跨 IDE 的规则优先级仍需分别验收。
- **建议**：先只盘点两个实际使用的 IDE，再对一个测试项目 dry-run 规则分发并检查差异。

<a id="plugin-1379204512-root"></a>

## [oh-my-dsh](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) · [![npm 30d 2379](https://img.shields.io/static/v1?label=npm+30d&message=2%2C379&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)

- **用途**：复杂开发任务需要规划、委派与验证分工，用户希望复用一套宿主适配的编排约定。
- **亮点**：入口注入协议并注册资产、命令和 MCP，team 模块维护阶段、队员身份与邮箱；实际派发与合并仍由领队模型驱动。
- **思考**：统一委派与恢复数据面可降低自建成本；多代理可能放大误解、冲突和预算超支。
- **建议**：先验装探测与取消，再对单仓库小任务比较原生单 agent 和一条显式 team 流程。

<a id="plugin-1334504487-root"></a>

## [Plan Lattice](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice)

- **用途**：跨压缩和重启的长任务需要恢复已批准计划、待办及委派结果，减少依据丢失。
- **亮点**：native-continuity 从会话事件折叠计划、当回合 Todo 和最近委派结果；完整 Lattice 另有契约与行动依据控制。
- **思考**：从宿主已有事实恢复比模型重写计划更易追溯；恢复正确也不等于任务产出质量提升。
- **建议**：先对照原生行为测试压缩和重启恢复，再单独评估显式完整控制，避免将两模式效果混为一谈。

<a id="plugin-1425006726-root"></a>

## [Qoder 子代理聚合](../../plugins/1373700184--dsh-subagent/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent) · [![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent)

- **用途**：已有 Qoder 订阅和本地 CLI 的开发者把独立任务从父会话委派出去，交付最终文本和可查询执行记录；需在任务里显式附全上下文。
- **亮点**：相对手工切 CLI，贡献在于复用 DSH 子代理接口连接外部订阅执行，并让父 Agent/UI 查询同一个运行 id。传输与结算复用 dsh-subagent 上游 helper，新增的是 qoder-json 协议适配和有界活动账本。
- **思考**：进度可见不代表任务完成合格。默认 permissionMode=bypass_permissions、timeoutSeconds 无上限，而且子代理不继承父上下文；收益可能被上下文补写、越权操作和结果复核抵消。只有记录了 result 事件也不能证明代码变更正确。
- **建议**：已有对应订阅且能隔离工作目录的团队可先做可撤销任务；配置明确超时与权限后，再评估写任务，不以可查询进度代替验收。

<a id="plugin-1346017360-root"></a>

## [SSH 只读日志工具](../../plugins/452926826--dsh-ssh-logs/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-ssh-logs)

- **用途**：运维和开发者在对话中定位已授权服务器日志，交付限定范围的日志片段或字面量搜索结果；不需要让模型获得任意shell能力。
- **亮点**：相对把通用SSH shell交给模型，贡献是缩小为三种只读意图、固定主机根目录和有界输出。借用OpenSSH与MCP，不是新的日志检索算法；命令生成与路径约束的组合降低误操作面。
- **思考**：最强质疑是README“每个文件必须留在允许根”只由词法路径检查支持。remote.js没有远端realpath/符号链接解析，root内符号链接若指向外部仍会被head/grep跟随；实际隔离必须依赖只读账号/ACL。grep零匹配exit1也被runSsh当失败，模型需区分无匹配与连接错误。
- **建议**：适合已建立只读SSH权限的团队先用测试服务器验证；根目录不能单靠字符串约束当隔离，生产环境以服务端账号权限兜底。

<a id="plugin-1399011094-root"></a>

## [Task Forge](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge)

- **用途**：跨模型或 IDE 交接任务时，用户需要暴露接收方理解缺口并跟踪其持有版本。
- **亮点**：命令编译任务、导出交接包并记录台账；握手解析回读、缺口、STATUS 和版本，旧版本不得视为当前放行。
- **思考**：将隐含假设和版本漂移显性化有价值；作者的无损说法不能由模板和状态字样单独证明。
- **建议**：先用一个有明确验收点的小任务试交接，人工比对遗漏和改版后的接收方状态。

<a id="plugin-1333800488-root"></a>

## [TaskSwarm — 贡献与交付证据研究](../../plugins/february2015--dsh-taskswarm/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm)

- **用途**：面向能拆分依赖、能定义验收的仓库开发任务，把多个执行者的工作组织为任务包、并行 lane 和串行集成流程。
- **亮点**：源码支持 DSH 原生 Agent 的创建、工具接线、任务进度持久化、隔离工作区与恢复编排。贡献主要是宿主适配和流程整合，waves、worktree、Reviewer 等方法明确来自 TaskPlane；尚无独立效果对照。
- **思考**：最关键的缺口是“完成”的证据约束：worker 自报完成、Reviewer 文本和 Git 合并能推进流程，但并未共同构成绑定最终代码版本的验收证明。因此协调能力成立，可靠交付增益仍待验证。
- **建议**：优先检验“与版本绑定的验收凭据能否同时约束集成、依赖放行和恢复”。先与简单 required checks／人工验收对照；若复杂协议没有额外收益，就采用简单方案。

<a id="plugin-1406156934-dsh-task-monitor"></a>

## [任务监控与 Git 操作面板](../../plugins/3450892121--dsh-task-monitor--dsh-task-monitor/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/3450892121/dsh-task-monitor)

- **用途**：DSH Desktop开发者查看会话活动、文件产出和Git状态，必要时手工提交/发布；合格交付物是可回查活动和已核实Git结果，活动计数不等于代码完成。
- **亮点**：相对翻聊天记录与终端，贡献是按会话聚合技能/MCP/文件/网页并连接Git工作流；将可见活动与工作区状态放到同一面板降低切换。没有发现活动记录自动约束代码验收的机制。
- **思考**：最强质疑是“只读监控”边界与实际实现冲突：README安全段称不落盘、不外联、只有只读Git，但index.js:474-505写令牌并实际建/删临时仓库，1053-1103提供写Git和发布路由。环回/工作区检查存在，仍不能把显式UI写操作描述成无副作用。
- **建议**：仅在读懂当前Git/GitHub写副作用后于临时仓库验证；把监控活动当辅助线索，提交推送仍须核对差异、目标分支和结果。

## 更新时间

2026-10-21
