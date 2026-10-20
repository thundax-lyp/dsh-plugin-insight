# IDE Hub

> 汇总多种编码工具的本地会话、用量与规则，并提供项目规则统一分发入口。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/commits)
<!-- END META -->

## 版本

固定提交 [814621be897a27752550b0be6f7be2bc44ccb897](https://github.com/121212165/dsh-plugin-ide-hub/tree/814621be897a27752550b0be6f7be2bc44ccb897)

## 用途与采用点评

- **用途**：跨 IDE 工作的开发者需要盘点会话、配置和预算，而非逐个工具翻找。
- **亮点**：注册盘点、迁移、导出和 hub-init 命令，从本地状态读取信息，规则本体与各 IDE 指针分开维护。
- **思考**：统一索引和单份规则可减少查找及漂移；跨 IDE 的规则优先级仍需分别验收。
- **建议**：先只盘点两个实际使用的 IDE，再对一个测试项目 dry-run 规则分发并检查差异。

## 场景与替代办法

跨 IDE 工作的开发者需要盘点会话、配置和预算，而非逐个工具翻找。

人工目录清单与版本化规则更简单；只有持续跨 IDE 使用才容易摊薄适配成本。

## 依赖与流程

依赖各工具本地会话与规则位置，迁移建议还依赖用户登记的额度和价格条件。

盘点环境、核对会话与用量，按计划初始化项目规则或导出；格式失配时回查原始文件。

## 成本与效果

无需额外查询 API 不代表零成本，目录权限、格式维护和跨工具规则冲突仍需处理。

统一索引和单份规则可减少查找及漂移；跨 IDE 的规则优先级仍需分别验收。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：85aef500fa773ce81d10fa2e27ee186efe5414d028c6fd8921fd09c7929529a3。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 136 | — | — | 2890 |
| .ts | source | 13 | 2285 | 1953 | 174 | — |
| .ts | test | 10 | 1400 | 1216 | 53 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **用户命令**：/ide-hub 盘点与 /hub-init 规则分发等入口。

## 工程亮点

规划与文件写入结果可展示有利于审阅；移除及重新初始化路径要关注用户自定义内容。

## 分发与兼容

版本 0.7.0，依赖 commands 与 @dsh-family/kit，部分集成另依赖兄弟插件的数据契约。

## 历史对照

前次代码指纹为 814621be897a27752550b0be6f7be2bc44ccb897；本轮固定为 814621be897a27752550b0be6f7be2bc44ccb897。人工目录清单与版本化规则更简单；只有持续跨 IDE 使用才容易摊薄适配成本。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未核实全部八种 IDE 的解析覆盖、会话恢复和统计完整性；本地文件格式变化会使结果过期。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试自定义规则、重复初始化、撤销、不同 IDE 版本与缺失用量，比较原始记录和导出。

## 活跃度

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+created%3A2026-09-20T02%3A57%3A34.715Z..2026-10-20T02%3A57%3A34.715Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T02%3A57%3A34.715Z..2026-10-20T02%3A57%3A34.715Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+updated%3A2026-09-20T02%3A57%3A34.715Z..2026-10-20T02%3A57%3A34.715Z)

统计日期：2026-10-20。
