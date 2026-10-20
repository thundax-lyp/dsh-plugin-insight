# dsh-prompt-ErrorNotes-desk

> 在会话页管理全局提示、会话补充与待确认的错误经验。

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/commits)
<!-- END META -->

## 版本

固定提交 [c76ffa0cb3f4f8de4b914ab64f3580f7aefab78f](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/tree/c76ffa0cb3f4f8de4b914ab64f3580f7aefab78f)

## 用途与采用点评

- **用途**：反复纠正相同模型行为的用户，希望把确认过的教训转成后续提醒。
- **亮点**：Host 原子写入本地状态和全局提示，通过同源路由供面板编辑，近期经验按限制注入系统提示。
- **思考**：把候选与确认分开有助于保留人工判断；自动沉淀不等于持续改善。
- **建议**：只确认能复现的经验，先限少量条目，并检查删除后是否停止影响回答。

## 场景与替代办法

反复纠正相同模型行为的用户，希望把确认过的教训转成后续提醒。

直接维护 AGENTS.md 更透明；面板减少编辑摩擦，也增加自动提取与作用域复杂度。

## 依赖与流程

需要 Web 路由和提示注入，数据保存在 DSH_HOME；宿主事件格式影响候选识别。

编辑提示或检查待确认经验，确认后在后续任务观察；不适用的规则及时撤销。

## 成本与效果

持续维护经验、避免提示膨胀与冲突需要人工时间，没有测量实际重复错误下降。

把候选与确认分开有助于保留人工判断；自动沉淀不等于持续改善。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：0632ccbafe3880250822acdb3f54c7df01319fe2a7016400862a30afb48b0669。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1034 | — | — | 13964 |
| .js | source | 2 | 2703 | 1347 | 1167 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **界面**：提示与错误经验面板。
- **Host 路由**：经验候选和配置读写端点。

## 工程亮点

宿主文件写入与客户端展示分离、临时文件重命名可借鉴；全局提示修改影响范围广。

## 分发与兼容

版本 1.2.1，作者以 GitHub 方式分发；不能由包名直接推断 npm 可安装。

## 历史对照

前次代码指纹为 c76ffa0cb3f4f8de4b914ab64f3580f7aefab78f；本轮固定为 c76ffa0cb3f4f8de4b914ab64f3580f7aefab78f。直接维护 AGENTS.md 更透明；面板减少编辑摩擦，也增加自动提取与作用域复杂度。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：没有验证自动候选提取精度或跨会话隔离；错误经验可能把一次失误过度概括。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试候选确认、撤销、并发编辑、跨会话和重启，再用同一错误样本比较修正效果。

## Issue 活跃度

Issue：未关闭 0／已关闭 0 · 近30天：新建 0／关闭 0／更新 0

统计日期：2026-10-20。
