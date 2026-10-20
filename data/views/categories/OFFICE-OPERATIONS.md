# 办公与运营

[返回首页](../../../README.md)

工作记录、日程、团队用量与日常运营。

**快速比较**

索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [AI 残渣清运](#plugin-1406611614-root) | 按规则把会话副产物移入可还原回收站，并提供项目结项归类、归档与清理清单。 | 先在完整副本执行dry-run，核对日志和backup类文件是否仍需保留，再启用自动清理并设置合适保留期。 |
| [dsh-crypto-portfolio](#plugin-1342742812-root) | 以 DSH 插件启动 Python 资产看板，汇集链上钱包和交易所账户数据。 | 先使用公开钱包和无资金操作权限的测试账户，对照账户原始持仓再考虑正式使用。 |
| [dsh-device-bridge](#plugin-1384810806-root) | 把实现Companion协议的手机或设备接入DSH，提供设备列表、健康查询和动作调用。 | 先只开放ping/status等无副作用动作，在隔离网络核对设备身份；固定共享依赖与设备端实现后再启用实际控制。 |
| [dsh-mac-companion](#plugin-1384810483-root) | 从DSH经HTTP调用Mac端Companion，支持通知、快捷指令和剪贴板读写。 | 先只测试通知，再检查剪贴板和快捷指令权限；写入前保留剪贴板副本，并使用专门的低风险Shortcut。 |
| [dsh-team-cost](#plugin-1364961230-root) | 按工作区归属成员统计模型用量，提供团队报表、预算告警和可选请求拦截。 | 先只监测不拦截，对照实际账单和子代理用量，补全模型价格并检查相似工作区前缀；金额可信后再考虑预算阻断。 |
| [dsh-wsl-cal](#plugin-1381860995-root) | 通过本地khal读取日历列表、今日日程和未来指定天数的安排。 | 适合已配置khal的人，先核对本地日期、时区与日历数量；空输出先确认同步与过滤，不直接判断没有安排。 |
| [Forge 工作报告](#plugin-1363429979-plugin-daily-log) | 汇集 Git 提交和本地智能体对话，按模板生成并保存日报、周报或月报。 | 先只接一个仓库和一种会话来源，对照手写周报检查作者过滤、遗漏与错误归功。 |

<a id="plugin-1406611614-root"></a>

## [AI 残渣清运](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1344738825/ai-residue-cleaner)

- **用途**：AI生成的探测、草稿和缓存污染工作区，用户需要减少整理负担并能恢复误收文件。
- **亮点**：Host在turn/end后台派生Python清运；cleanup.py按规则移动文件并写manifest，项目open时跳过自动清理，结项时分类与归档。
- **思考**：可逆移动及清单降低首次误收损失；规则覆盖面广且会过期真删，不应替代项目引用和保留策略。
- **建议**：先在完整副本执行dry-run，核对日志和backup类文件是否仍需保留，再启用自动清理并设置合适保留期。

<a id="plugin-1342742812-root"></a>

## [dsh-crypto-portfolio](../../plugins/0xrabit--dsh-crypto-portfolio/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio)

- **用途**：同时管理多个钱包与交易所账户的人需要统一查看持仓，而非在多个页面手工汇总。
- **亮点**：Node 入口初始化配置模板并启动 run.py 子进程，默认绑定回环地址，卸载时发送 SIGTERM。
- **思考**：多来源汇总有明确便利，但看板属于数据呈现，不能提供资产真实性或收益保证。
- **建议**：先使用公开钱包和无资金操作权限的测试账户，对照账户原始持仓再考虑正式使用。

<a id="plugin-1384810806-root"></a>

## [dsh-device-bridge](../../plugins/173787247--dsh-device-bridge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-device-bridge)

- **用途**：用户希望从会话触发已知设备动作，合格交付是正确设备实际完成动作并能报告失败。
- **亮点**：index.js注册三个工具，按配置选择设备和允许动作，再委托dsh-wsl-common的Companion客户端发送HTTP请求。
- **思考**：统一轻量协议能降低多设备接入重复工作；动作名白名单并不证明动作本身无副作用。
- **建议**：先只开放ping/status等无副作用动作，在隔离网络核对设备身份；固定共享依赖与设备端实现后再启用实际控制。

<a id="plugin-1384810483-root"></a>

## [dsh-mac-companion](../../plugins/173787247--dsh-mac-companion/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion)

- **用途**：主Agent在WSL等环境运行，用户希望触达Mac桌面动作；验收应是目标Mac正确执行且数据未送错。
- **亮点**：index.js注册Mac专用工具，将通知、shortcut和剪贴板动作交给共享Companion客户端；Mac侧Python服务调用系统能力。
- **思考**：为跨系统桌面任务提供薄协议有便利；读取剪贴板会把潜在敏感文本带入工具输出及模型上下文。
- **建议**：先只测试通知，再检查剪贴板和快捷指令权限；写入前保留剪贴板副本，并使用专门的低风险Shortcut。

<a id="plugin-1364961230-root"></a>

## [dsh-team-cost](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1569126506-sudo/dsh-team-cost)

- **用途**：共用宿主的团队需要把用量归到成员并管预算，验收应对齐账单与身份，不能只看报表有数字。
- **亮点**：src/index.ts监听assistant/message用量，按cwd最长前缀归因，写JSONL及汇总；agent/request可按团队或成员预算拒绝新请求。
- **思考**：把团队汇总接到请求门禁有管理价值；若归属或单价缺失，报表精确显示也会掩盖错误。
- **建议**：先只监测不拦截，对照实际账单和子代理用量，补全模型价格并检查相似工作区前缀；金额可信后再考虑预算阻断。

<a id="plugin-1381860995-root"></a>

## [dsh-wsl-cal](../../plugins/173787247--dsh-wsl-cal/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cal)

- **用途**：已有khal日历的用户希望在会话内查询近期安排，交付应与本地日历一致，不误以为已创建事件。
- **亮点**：lib/cal.js查找khal，分别调用printcalendars和list，限制未来天数、超时与输出长度；Host注册状态、日历与日程工具。
- **思考**：把已有日历读取接入会话有便利，安装它不能自动把企业日历同步进来。
- **建议**：适合已配置khal的人，先核对本地日期、时区与日历数量；空输出先确认同步与过滤，不直接判断没有安排。

<a id="plugin-1363429979-plugin-daily-log"></a>

## [Forge 工作报告](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1980](https://img.shields.io/static/v1?label=npm+30d&message=1%2C980&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log)

- **用途**：面向需要定期汇报工作的个人或团队，从实际活动记录生成报告，并支持回查来源。
- **亮点**：入口按 agent 作用域启用报告工具，/report 转发用户需求，扫描索引和模板为后续生成提供材料。
- **思考**：按需启用工具可减少常驻上下文；提交与对话是活动证据，不自动证明业务成果。
- **建议**：先只接一个仓库和一种会话来源，对照手写周报检查作者过滤、遗漏与错误归功。

## 更新时间

2026-10-20
