# DSH Plugin Insight

![DSH Plugin Insight](assets/dsh-plugin-insight-banner.png)



## 最新

- [dsh-media-studio](data/plugins/1497105876--dsh-media-studio/INSIGHT.md) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio/commits)
- [Prompt Desk](data/plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/commits)
- [元冰可 AI 资源治理平台](data/plugins/01men--ybkkasi/INSIGHT.md) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01men/ybkkasi/commits)

## 最热

- [dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md) · [![GitHub ★ 186](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=186&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator)
- [dsh-plugin-tts](data/plugins/1624318455--dsh-plugin-tts/INSIGHT.md) · [![GitHub ★ 26](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts)
- [dsh-spotlight](data/plugins/0xsline--dsh-spotlight/INSIGHT.md) · [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight)

## 推荐

- **[dsh-folderwatch](data/plugins/11111353535--dsh-folderwatch/INSIGHT.md) · 条件试用**：适合外部文件交接频繁的任务，先用 queue 模式和小目录验证漏报、回声与扫描成本；未做宿主验收。
- **[dsh-which](data/plugins/11111353535--dsh-which/INSIGHT.md) · 条件试用**：适合经常排查多版本命令冲突的开发者，先关闭探测并对照实际 shell；未覆盖全部别名与函数语义。
- **[dsh-composer-expand](data/plugins/13071301808--dsh-composer-expand/INSIGHT.md) · 条件试用**：长提示词编辑者可条件试用，先验证输入法、候选菜单和发送快捷键，确认禁用可恢复；未做真实宿主验收。

## 分类导航

- [个人效率（23）](#category-personal-productivity)
- [办公与运营（7）](#category-office-operations)
- [研究与知识（5）](#category-research-knowledge)
- [基础设施（21）](#category-infrastructure)
- [软件交付（20）](#category-software-delivery)
- [内容生产（3）](#category-content-creation)

<a id="category-personal-productivity"></a>

### 个人效率（23）

<a id="plugin-1333328839-root"></a>

#### [dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md)

[![GitHub ★ 186](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=186&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11750](https://img.shields.io/static/v1?label=npm+30d&message=11%2C750&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/commits)

- **用途**：希望改善等待体验的桌面用户，以更清楚或有趣的状态文案替代默认状态行。
- **亮点**：Host 保存并提供配置，客户端按阶段和偏好选择文案，支持持久化覆盖与扩展词库。
- **思考**：配置持久化使个性化可重复；状态文案不是实际进度，不能拿它判断任务是否完成。
- **建议**：先只开静态文案，确认设置能保存且与原生状态共存，再逐步启用弹幕和动画。

<a id="plugin-1333136466-root"></a>

#### [dsh-spotlight](data/plugins/0xsline--dsh-spotlight/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) · [![npm 30d 667](https://img.shields.io/static/v1?label=npm+30d&message=667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight/commits)

- **用途**：大量使用快捷键的 DSH Web 用户需要减少在会话与设置之间寻找入口的操作。
- **亮点**：客户端注入 sessions、commands 和 pluginInventory，挂载面板并通过原生 commandUi 注册 /spotlight。
- **思考**：复用原生命令注册表可降低双份清单漂移；命令数量增加并不自动提升检索体验。
- **建议**：先用常用的十条命令与十个会话检查搜索命中和导航，再决定是否替代原生入口。

<a id="plugin-1334899834-root"></a>

#### [api-balance](data/plugins/02muller25--dsh-api-balance/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/commits)

- **用途**：使用 DeepSeek API 的用户希望在工作界面看到账户余额，减少切换控制台。
- **亮点**：Host 每次解析凭据并通过 curl 请求余额，客户端持久化刷新偏好并保留失败前的数据。
- **思考**：余额就近可见减少切换，但旧读数可能掩盖故障，必须保留更新时间和失败提示。
- **建议**：先用手动刷新核对官方控制台；检查凭据暴露和日志后，再按需要开启较低频率轮询。

<a id="plugin-1409724830-src"></a>

#### [蓝毛小女仆桌宠](data/plugins/12we21--cute-fat-fish-pet--src/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet) · [![最后更新 前天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E5%89%8D%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/commits)

- **用途**：个人桌面用户希望用角色动画和轻量聊天增加陪伴感，而非完成标准化办公任务。
- **亮点**：插件 Host 调用本地 Ollama 或 DSH 模型，管理辅助进程与事件；资源和浏览器交互由 src 下的已构建 bundle 提供。
- **思考**：角色交互价值高度主观；本地优先不是任何配置下都离线，在线模型可能接收聊天及选定观察内容。
- **建议**：先关闭屏幕观察和在线回退，确认数据路径、模型路由与卸载，再按个人偏好试用。

<a id="plugin-1363429979-plugin-notes"></a>

#### [Forge 便签](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2563](https://img.shields.io/static/v1?label=npm+30d&message=2%2C563&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)

- **用途**：需要从临时想法转为任务的用户，希望在聊天旁管理笔记及执行状态。
- **亮点**：便签 CRUD 通过 storage-domain 持久化；日程与任务泳道状态关联，工具就绪后再挂 agent 桥。
- **思考**：把输入、任务和状态放在同一处可减少转录；自动执行却会引入授权和重复副作用风险。
- **建议**：先只用便签与归档，再用无副作用任务检查定时运行和失败恢复。

[更多 个人效率 →](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="category-office-operations"></a>

### 办公与运营（7）

<a id="plugin-1363429979-plugin-daily-log"></a>

#### [Forge 工作报告](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1980](https://img.shields.io/static/v1?label=npm+30d&message=1%2C980&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)

- **用途**：需要周期性工作汇报的人希望从实际活动整理报告，并能回查来源。
- **亮点**：入口按 agent 作用域启用报告工具，/report 转发用户需求，扫描索引和模板为后续生成提供材料。
- **思考**：按需启用工具可减少常驻上下文；提交与对话是活动证据，不自动证明业务成果。
- **建议**：先只接一个仓库和一种会话来源，对照手写周报检查作者过滤、遗漏与错误归功。

<a id="plugin-1342742812-root"></a>

#### [dsh-crypto-portfolio](data/plugins/0xrabit--dsh-crypto-portfolio/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio) · [![最后更新 14天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=14%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/commits)

- **用途**：同时管理多个钱包与交易所账户的人需要统一查看持仓，而非在多个页面手工汇总。
- **亮点**：Node 入口初始化配置模板并启动 run.py 子进程，默认绑定回环地址，卸载时发送 SIGTERM。
- **思考**：多来源汇总有明确便利，但看板属于数据呈现，不能提供资产真实性或收益保证。
- **建议**：先使用公开钱包和无资金操作权限的测试账户，对照账户原始持仓再考虑正式使用。

<a id="plugin-1364961230-root"></a>

#### [dsh-team-cost](data/plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1569126506-sudo/dsh-team-cost) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1569126506-sudo/dsh-team-cost/commits)

- **用途**：共用宿主的团队需要把用量归到成员并管预算，验收应对齐账单与身份，不能只看报表有数字。
- **亮点**：src/index.ts监听assistant/message用量，按cwd最长前缀归因，写JSONL及汇总；agent/request可按团队或成员预算拒绝新请求。
- **思考**：把团队汇总接到请求门禁有管理价值；若归属或单价缺失，报表精确显示也会掩盖错误。
- **建议**：先只监测不拦截，对照实际账单和子代理用量，补全模型价格并检查相似工作区前缀；金额可信后再考虑预算阻断。

<a id="plugin-1384810806-root"></a>

#### [dsh-device-bridge](data/plugins/173787247--dsh-device-bridge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-device-bridge) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-device-bridge/commits)

- **用途**：用户希望从会话触发已知设备动作，合格交付是正确设备实际完成动作并能报告失败。
- **亮点**：index.js注册三个工具，按配置选择设备和允许动作，再委托dsh-wsl-common的Companion客户端发送HTTP请求。
- **思考**：统一轻量协议能降低多设备接入重复工作；动作名白名单并不证明动作本身无副作用。
- **建议**：先只开放ping/status等无副作用动作，在隔离网络核对设备身份；固定共享依赖与设备端实现后再启用实际控制。

<a id="plugin-1384810483-root"></a>

#### [dsh-mac-companion](data/plugins/173787247--dsh-mac-companion/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion/commits)

- **用途**：主Agent在WSL等环境运行，用户希望触达Mac桌面动作；验收应是目标Mac正确执行且数据未送错。
- **亮点**：index.js注册Mac专用工具，将通知、shortcut和剪贴板动作交给共享Companion客户端；Mac侧Python服务调用系统能力。
- **思考**：为跨系统桌面任务提供薄协议有便利；读取剪贴板会把潜在敏感文本带入工具输出及模型上下文。
- **建议**：先只测试通知，再检查剪贴板和快捷指令权限；写入前保留剪贴板副本，并使用专门的低风险Shortcut。

[更多 办公与运营 →](data/views/categories/OFFICE-OPERATIONS.md)

<a id="category-research-knowledge"></a>

### 研究与知识（5）

<a id="plugin-1366089972-workspace-plugins-dsh-cortex"></a>

#### [dsh-cortex](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-cortex/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/commits)

- **用途**：长期运行Agent-Body的用户希望跨会话保留失败教训和重复做法，并减少常驻告警噪声。
- **亮点**：组件src/index.ts以agent/pre-step判断活动，静默后按工具记录确定性生成卡片，关键词加权召回，权重衰减归档；重复告警收敛静默。
- **思考**：不让心跳和维护调用冒充会话活动能避免永不巩固；自动抽取的打法可能只记录偶然成功，需要真实任务对照。
- **建议**：先少量召回并定期抽查卡片来源，重要故障保持外部告警；先验证重启后记忆仍可恢复再长期使用。

<a id="plugin-1334269686-root"></a>

#### [dsh-scrape-webpage](data/plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) · [![npm 30d 1151](https://img.shields.io/static/v1?label=npm+30d&message=1%2C151&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage/commits)

- **用途**：研究者读取具体网页时希望得到可引用正文与结构，原有办法是浏览器复制或宿主抓取工具。
- **亮点**：lib/index.js 优先宿主 web.fetch，缺失或异常后经 shell 调用 curl；解析与统计分层，图片逐张下载并调用注册分析器。
- **思考**：分析器注册接口避免把视觉服务绑死，但自动提取并不证明正文完整或网页内容可信。
- **建议**：已有用户可保留正文抓取用途，先在公开测试页核对重定向、动态内容与超时；非 Windows 环境先验证 shell 回退，限制敏感网络目标。

<a id="plugin-1363429979-plugin-memory"></a>

#### [Forge 记忆](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2404](https://img.shields.io/static/v1?label=npm+30d&message=2%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)

- **用途**：反复在项目间切换的使用者需要可管理的长期偏好和决策，而非无差别保存聊天。
- **亮点**：storage-domain 支撑实体、关系和审计记录，服务统一管理写入、查询与导入校验。
- **思考**：结构化存储比散落提示词更可管理；错误或跨范围记忆可能持续影响后续决策。
- **建议**：先记录少量明确偏好，测试修改和删除后是否停止影响回答，再扩展自动积累。

<a id="plugin-1334654243-root"></a>

#### [dsh-plugin-tavily](data/plugins/1624318455--dsh-plugin-tavily/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily/commits)

- **用途**：经常做联网研究的用户希望统一搜索参数并取回来源，合格结果是相关且可追溯的证据，不只是搜索成功。
- **亮点**：src/provider.ts实现web.search与fetch提供者，按请求解析密钥环，支持缓存与受限重试；可显式切换或在特定故障时回退DeepSeek。
- **思考**：统一设置和明确回退类型有利于诊断；丰富参数并不能代替同问题的检索质量比较。
- **建议**：先确认安装后的默认引擎和查询数据去向，用少量已知问题核对来源；额度错误时处理key，不期待自动换引擎掩盖失败。

<a id="plugin-1359423472-root"></a>

#### [dsh-codevault](data/plugins/1014029855--dsh-codevault/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault/commits)

- **用途**：反复阅读相同代码的人需要保留带对象身份的笔记，减少重复整理。
- **亮点**：入口注册 code-reading Skill、read/vault 工具及 /codevault，配置档案目录与可选只读 vault。
- **思考**：对象卡片比聊天时间线容易复用；写得整齐不等于理解准确或跟上代码变更。
- **建议**：先给一个常读模块建卡，代码更新后核对引用和过期结论，不把历史笔记直接当现状。

[更多 研究与知识 →](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="category-infrastructure"></a>

### 基础设施（21）

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

#### [dsh-anatomy-panel](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/commits)

- **用途**：维护Agent-Body部署的人需要查看后台状态，合格交付是实际文件异常能被看到，而非仅有漂亮仪表盘。
- **亮点**：组件lib/index.js注册/anatomy与数据路由，每次请求重读organism文件，脉冲只读尾部256KB，页面约每三秒轮询。
- **思考**：直接从运行文件投影避免另建采集服务；仪表盘显示已愈合不能证明业务故障真正恢复。
- **建议**：先限制在本地受控宿主使用，检查缺失数据能否报503，并核对脉冲文本的展示边界后再接入多人环境。

<a id="plugin-1346196699-root"></a>

#### [dsh-api-dashboard](data/plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) · [![npm 30d 4246](https://img.shields.io/static/v1?label=npm+30d&message=4%2C246&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard) · [![最后更新 10天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=10%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard/commits)

- **用途**：同时使用多个供应商的用户需要观察额度和花费趋势，合格输出应能区分实际余额、估算与无法查询。
- **亮点**：src/index.js 从凭据及平台接口取余额，以内置或自定义单价计算会话消耗，混合币种分别显示；客户端定时刷新看板。
- **思考**：集中显示和明确未知值有实用价值；估算若被当成收费真相，会把价格漂移和缓存差异隐藏起来。
- **建议**：先选择实际可查询的平台，对照控制台账单和混合币种；把看板作为预警与估算入口，自更新前保留配置和回退。

<a id="plugin-1366089972-workspace-plugins-dsh-organism"></a>

#### [dsh-organism](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/commits)

- **用途**：多插件组合维护者希望统一发现工具、跟踪故障和触发恢复，合格结果是可追踪的实际恢复而非状态计数增长。
- **亮点**：组件src/index.ts连接tools与session事件、心跳和持久账本；按器官选择工具schema，反射可再次执行工具，带副作用处方要求人工裁决。
- **思考**：统一事件与恢复账本有集成价值；把任意插件命名为器官不能自动消除兼容差异，也不能证明任务成功。
- **建议**：适合愿意维护统一器官协议的实验环境；先只开启观测，再逐条批准恢复路径，验证重复故障不会重复副作用。

<a id="plugin-1343420855-root"></a>

#### [dsh-ui-auth](data/plugins/0qwq0--dsh-ui-auth/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1608](https://img.shields.io/static/v1?label=npm+30d&message=1%2C608&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/commits)

- **用途**：需要让多个用户访问 DSH Web 的部署者，需要认证入口和数据访问边界。
- **亮点**：包装 HTTP 与 upgrade 入口，现代网关按会话处理认证；宿主能力缺失时 fail-closed。
- **思考**：统一入口与关闭式失败路径是有效机制；全接口安全仍依赖覆盖、宿主升级和反代配置。
- **建议**：先在隔离环境逐一测试 HTTP、WebSocket 和多用户访问，不把安装成功当成公网安全保证。

<a id="plugin-1363429979-plugin-usage-billing"></a>

#### [Forge 用量计费](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1814](https://img.shields.io/static/v1?label=npm+30d&message=1%2C814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)

- **用途**：需要了解模型使用支出的开发者希望把日志用量与预算放在同一视图。
- **亮点**：服务聚合账本分片并锁定价格快照，联网价表与汇率有缓存和降级；未知项目不静默记零。
- **思考**：锁定历史价格能避免改价反写旧账；价格来源或使用日志不准时，账本仍可能精确记录错误值。
- **建议**：先选择一个模型和一天真实账单，逐项核对 token、缓存计价、币种和未计价行。

[更多 基础设施 →](data/views/categories/INFRASTRUCTURE.md)

<a id="category-software-delivery"></a>

### 软件交付（20）

<a id="plugin-1339316901-root"></a>

#### [dsh-project-memory](data/plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4717](https://img.shields.io/static/v1?label=npm+30d&message=4%2C717&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/commits)

- **用途**：长周期开发者在换会话时找回任务及文件依据，交付物是可定位的上下文。
- **亮点**：session 事件同步任务，工具负责索引和检索；when 触发与 guard 收窄限制经验注入。
- **思考**：任务与文件关联有助于定位；错误经验也会持久化，引用存在不代表当前结论正确。
- **建议**：先在一个可丢弃项目中测试旧结论纠错和跨项目隔离，再决定是否长期启用。

<a id="plugin-1366089972-workspace-plugins-dsh-zero-residence"></a>

#### [dsh-zero-residence](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/commits)

- **用途**：工具输出很长的任务希望缩小反复发送的历史，同时保留回查原文能力；验收需兼顾最终任务质量。
- **亮点**：继承BasicCompactionEngine以确定性指针代替摘要，原文从会话持久记录回读；另有zr_fast用pwsh派生进程并返回日志句柄。
- **思考**：可追溯指针比不可逆摘要更利于复核；如果模型频繁回读或遗失指针，省下的输入可能被额外轮次抵消。
- **建议**：先在可恢复会话副本试压缩，验证关键证据能原样回查；异步命令只用于允许的测试任务，并确认宿主权限与取消边界。

<a id="plugin-1379204512-root"></a>

#### [oh-my-dsh](data/plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) · [![npm 30d 2379](https://img.shields.io/static/v1?label=npm+30d&message=2%2C379&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness/commits)

- **用途**：复杂开发任务需要规划、委派与验证分工，用户希望复用一套宿主适配的编排约定。
- **亮点**：入口注入协议并注册资产、命令和 MCP，team 模块维护阶段、队员身份与邮箱；实际派发与合并仍由领队模型驱动。
- **思考**：统一委派与恢复数据面可降低自建成本；多代理可能放大误解、冲突和预算超支。
- **建议**：先验装探测与取消，再对单仓库小任务比较原生单 agent 和一条显式 team 流程。

<a id="plugin-1335559646-root"></a>

#### [dsh-trellis](data/plugins/1264459640--dsh-trellis/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) · [![npm 30d 1576](https://img.shields.io/static/v1?label=npm+30d&message=1%2C576&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) · [![最后更新 12天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=12%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/commits)

- **用途**：复杂开发任务需要明确计划批准、步骤验证与归档状态，避免直接把写完代码当完成。
- **亮点**：Host 从项目 .trellis 状态注入阶段提示，复制缺失 Skill，工具管理任务；可选只读策略按授权状态过滤工具。
- **思考**：把完成门槛和执行清单显式化有利于协作；状态为 completed 仍需对应真实产物与验证依据。
- **建议**：先在测试项目检查任务创建、规划保护、批准和归档，再决定哪些项目启用。

<a id="plugin-1337916824-root"></a>

#### [dsh-mysql](data/plugins/1321928757--dsh-mysql/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql) · [![npm 30d 36](https://img.shields.io/static/v1?label=npm+30d&message=36&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mysql) · [![最后更新 8天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=8%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql/commits)

- **用途**：开发者在数据库排障与分析时需要先看结构再查数据，交付应是可复核SQL和正确结果，而非仅返回成功。
- **亮点**：Host 注册四个全局工具；会话选择连接后逐调用确定目标，shared.js 分类SQL并检查表范围，写入与DDL分别开关。
- **思考**：显式选库和拆分读写权限能减少误路由；应用层检查不能替代数据库授权，模型也会看到查询结果。
- **建议**：先连接脱敏测试库和数据库端只读账号，核对选库与结果；确需写入时分别启用行写和DDL，并准备备份与人工复核。

[更多 软件交付 →](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="category-content-creation"></a>

### 内容生产（3）

<a id="plugin-1334773156-root"></a>

#### [dsh-plugin-tts](data/plugins/1624318455--dsh-plugin-tts/INSIGHT.md)

[![GitHub ★ 26](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) · [![npm 30d 2693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) · [![最后更新 7天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=7%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts/commits)

- **用途**：需要长文朗读或本地音色的用户希望在会话内播放，不想逐段复制到外部软件。
- **亮点**：lib/index.mjs注册语音及音色包路由，Edge由Node子进程完成WebSocket合成，RVC等经本地HTTP服务处理，客户端分块播放。
- **思考**：统一播放器与分块流程减少切换；免费在线朗读不等于离线，音色包校验也不证明效果或服务可信。
- **建议**：先选一个后端，用短文本和长文检查播放与取消，再引入本地音色服务；需要离线或隐私边界时逐条确认所选后端数据流。

<a id="plugin-1418493685-root"></a>

#### [No AI Style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style/commits)

- **用途**：论文与专业文档作者需要减少机械表达，同时保留事实承诺和引用。
- **亮点**：filesystem provider 暴露内嵌 Skill；审阅与改写模式区分权限，真相边界优先于文风。
- **思考**：权限模式与事实优先级值得采用；提示词约束不是保真保证，仍由作者承担复核。
- **建议**：先用带数字和引用的旧稿试改，逐项对照事实与限定词，不把文风自然当作内容可靠。

<a id="plugin-1399694663-root"></a>

#### [dsh-media-studio](data/plugins/1497105876--dsh-media-studio/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio/commits) · **脚本有更新，待重新洞察**

- **用途**：内容创作者希望从同一对话发起生成、取回成品并预览，交付是可用媒体文件和可追踪任务结果。
- **亮点**：src/tools.ts解析模型与凭据，providers对接生成后端；jobs.ts启动官方后台任务，结果保存后投递会话，注册失败时退为脱离任务控制的执行。
- **思考**：同一会话内的任务与媒体展示减少手动下载转存；免费额度或异步机制本身不能证明更便宜或更稳定。
- **建议**：先用一个已授权后端生成小图，核对输出路径和取消，再试视频；对敏感参考图先确认发送对象与保留条件。

[更多 内容生产 →](data/views/categories/CONTENT-CREATION.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-10-20
