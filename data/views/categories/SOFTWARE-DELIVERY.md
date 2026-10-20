# 软件交付

[返回首页](../../../README.md)

## 分类导航

- [DSH Verification Receipt](#plugin-1333370288-root)：代码协作者希望追问某轮究竟记录过哪些执行信号，而不是只看模型完成声明。
- [dsh-folderwatch](#plugin-1423215448-root)：等待构建报告、下载或共享目录交接的智能体需要发现外部变化，减少反复手工查询。
- [dsh-project-memory](#plugin-1339316901-root)：长周期开发者在换会话时找回任务及文件依据，交付物是可定位的上下文。
- [dsh-reaper](#plugin-1423215373-root)：智能体遗留开发服务占用端口时，开发者需要区分可清理进程与宿主及系统服务。
- [dsh-trellis](#plugin-1335559646-root)：复杂开发任务需要明确计划批准、步骤验证与归档状态，避免直接把写完代码当完成。
- [dsh-which](#plugin-1423215529-root)：命令在终端与智能体中表现不同的开发者需要定位实际可执行文件和版本来源。
- [IDE Hub](#plugin-1397817235-root)：跨 IDE 工作的开发者需要盘点会话、配置和预算，而非逐个工具翻找。
- [oh-my-dsh](#plugin-1379204512-root)：复杂开发任务需要规划、委派与验证分工，用户希望复用一套宿主适配的编排约定。
- [Plan Lattice](#plugin-1334504487-root)：跨压缩和重启的长任务需要恢复已批准计划、待办及委派结果，减少依据丢失。
- [Task Forge](#plugin-1399011094-root)：跨模型或 IDE 交接任务时，用户需要暴露接收方理解缺口并跟踪其持有版本。

### 软件交付（10）

<a id="plugin-1333370288-root"></a>

#### [DSH Verification Receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) · [![npm 30d 881](https://img.shields.io/static/v1?label=npm+30d&message=881&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt/commits)

- **用途**：代码协作者希望追问某轮究竟记录过哪些执行信号，而不是只看模型完成声明。
- **亮点**：监听 turn/end 相关 session 事件，按执行轨迹和词法信号生成摘要并串行追加 JSONL。
- **思考**：缩小到可检查的执行信号比声称自动验收更可靠；回执本身不能代替失败放行规则。
- **建议**：先对照一次明确成功和一次失败的测试任务，逐项比对回执与真实命令结果。

<a id="plugin-1423215448-root"></a>

#### [dsh-folderwatch](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-folderwatch) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/commits)

- **用途**：等待构建报告、下载或共享目录交接的智能体需要发现外部变化，减少反复手工查询。
- **亮点**：周期扫描与快照差分作为主路径，fs.watch 只提示加速；批量去抖、冷却和短时自身写入账本抑制回声。
- **思考**：准确变化摘要比轮询提示更利于交接；通知到达并不保证后续任务成功。
- **建议**：先以 queue 模式监听小目录，统计漏报、重复和自身写入抑制，再开放自动唤醒。

<a id="plugin-1339316901-root"></a>

#### [dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4717](https://img.shields.io/static/v1?label=npm+30d&message=4%2C717&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/commits)

- **用途**：长周期开发者在换会话时找回任务及文件依据，交付物是可定位的上下文。
- **亮点**：session 事件同步任务，工具负责索引和检索；when 触发与 guard 收窄限制经验注入。
- **思考**：任务与文件关联有助于定位；错误经验也会持久化，引用存在不代表当前结论正确。
- **建议**：先在一个可丢弃项目中测试旧结论纠错和跨项目隔离，再决定是否长期启用。

<a id="plugin-1423215373-root"></a>

#### [dsh-reaper](../../plugins/11111353535--dsh-reaper/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reaper) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper/commits)

- **用途**：智能体遗留开发服务占用端口时，开发者需要区分可清理进程与宿主及系统服务。
- **亮点**：按宿主祖先链、工作区和保护规则评级，默认返回计划，confirm:true 才执行，发信号前再次检查保护。
- **思考**：归属和不可覆盖的保护规则比裸 kill 端口更有约束，但启发式归属仍不是授权证明。
- **建议**：先仅用扫描与预览，对照系统工具确认归属；实际清理只在可丢弃开发进程上验收。

<a id="plugin-1335559646-root"></a>

#### [dsh-trellis](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) · [![npm 30d 1576](https://img.shields.io/static/v1?label=npm+30d&message=1%2C576&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) · [![最后更新 12天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=12%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/commits)

- **用途**：复杂开发任务需要明确计划批准、步骤验证与归档状态，避免直接把写完代码当完成。
- **亮点**：Host 从项目 .trellis 状态注入阶段提示，复制缺失 Skill，工具管理任务；可选只读策略按授权状态过滤工具。
- **思考**：把完成门槛和执行清单显式化有利于协作；状态为 completed 仍需对应真实产物与验证依据。
- **建议**：先在测试项目检查任务创建、规划保护、批准和归档，再决定哪些项目启用。

<a id="plugin-1423215529-root"></a>

#### [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-which) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-which) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/11111353535/dsh-which/commits)

- **用途**：命令在终端与智能体中表现不同的开发者需要定位实际可执行文件和版本来源。
- **亮点**：自己按 PATH/PATHEXT 等规则解析候选，报告胜出与遮蔽项；版本探测使用解析后的路径、限定参数和超时。
- **思考**：让遮蔽副本成为一等输出可解释版本冲突；只有解析规则与实际 shell 一致才可信。
- **建议**：先只查询并对照当前 shell 的解析结果，必要时对可信二进制启用版本探测。

<a id="plugin-1397817235-root"></a>

#### [IDE Hub](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-ide-hub) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/commits)

- **用途**：跨 IDE 工作的开发者需要盘点会话、配置和预算，而非逐个工具翻找。
- **亮点**：注册盘点、迁移、导出和 hub-init 命令，从本地状态读取信息，规则本体与各 IDE 指针分开维护。
- **思考**：统一索引和单份规则可减少查找及漂移；跨 IDE 的规则优先级仍需分别验收。
- **建议**：先只盘点两个实际使用的 IDE，再对一个测试项目 dry-run 规则分发并检查差异。

<a id="plugin-1379204512-root"></a>

#### [oh-my-dsh](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) · [![npm 30d 2379](https://img.shields.io/static/v1?label=npm+30d&message=2%2C379&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness/commits)

- **用途**：复杂开发任务需要规划、委派与验证分工，用户希望复用一套宿主适配的编排约定。
- **亮点**：入口注入协议并注册资产、命令和 MCP，team 模块维护阶段、队员身份与邮箱；实际派发与合并仍由领队模型驱动。
- **思考**：统一委派与恢复数据面可降低自建成本；多代理可能放大误解、冲突和预算超支。
- **建议**：先验装探测与取消，再对单仓库小任务比较原生单 agent 和一条显式 team 流程。

<a id="plugin-1334504487-root"></a>

#### [Plan Lattice](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plan-lattice) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/commits)

- **用途**：跨压缩和重启的长任务需要恢复已批准计划、待办及委派结果，减少依据丢失。
- **亮点**：native-continuity 从会话事件折叠计划、当回合 Todo 和最近委派结果；完整 Lattice 另有契约与行动依据控制。
- **思考**：从宿主已有事实恢复比模型重写计划更易追溯；恢复正确也不等于任务产出质量提升。
- **建议**：先对照原生行为测试压缩和重启恢复，再单独评估显式完整控制，避免将两模式效果混为一谈。

<a id="plugin-1399011094-root"></a>

#### [Task Forge](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-task-forge) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge/commits)

- **用途**：跨模型或 IDE 交接任务时，用户需要暴露接收方理解缺口并跟踪其持有版本。
- **亮点**：命令编译任务、导出交接包并记录台账；握手解析回读、缺口、STATUS 和版本，旧版本不得视为当前放行。
- **思考**：将隐含假设和版本漂移显性化有价值；作者的无损说法不能由模板和状态字样单独证明。
- **建议**：先用一个有明确验收点的小任务试交接，人工比对遗漏和改版后的接收方状态。

## 更新时间

2026-10-20
