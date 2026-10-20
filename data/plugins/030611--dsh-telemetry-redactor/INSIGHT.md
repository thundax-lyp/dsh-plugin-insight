# DSH Telemetry Redactor

> 在遥测记录瀑布中递归脱敏支持的凭据模式，保留原始会话日志。

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) · [![npm 30d 1216](https://img.shields.io/static/v1?label=npm+30d&message=1%2C216&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/commits)
<!-- END META -->

## 版本

固定提交 [811b0b1abf424e57045ab5a5eaa203660ca43908](https://github.com/030611/dsh-telemetry-redactor/tree/811b0b1abf424e57045ab5a5eaa203660ca43908)

## 用途与采用点评

- **用途**：向观测后端发送会话遥测的部署者需要减少凭据外传，输入是遥测副本。
- **亮点**：session-telemetry/record 前置规则调用 next 后递归生成脱敏记录，不重写规范会话。
- **思考**：在统一出口处理副本有清晰边界；它是遥测防护的一层，不能替代凭据权限和全链路审计。
- **建议**：先在测试遥测里放入假密钥、普通文本和 token 计量字段，核对脱敏与保真后再接后端。

## 场景与替代办法

向观测后端发送会话遥测的部署者需要减少凭据外传，输入是遥测副本。

也可在采集网关脱敏；该插件靠近宿主语义，但保护范围比系统级数据治理窄。

## 依赖与流程

需要支持对应 telemetry waterfall 的 DSH，收益取决于真正走该出口的后端。

配置替换文本后观察遥测；漏报新增规则，误报调整例外，再验证原始日志未被改变。

## 成本与效果

需要维护规则与例外，误删观测字段会增加排障时间；未测延迟和泄漏率。

在统一出口处理副本有清晰边界；它是遥测防护的一层，不能替代凭据权限和全链路审计。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：6b26ce09934a0e857f9e6c6fdaa11eba21acd81f909d5fdb2da1e59e0eec8a1a。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 393 | — | — | 4906 |
| .mjs | source | 4 | 110 | 102 | 0 | — |
| .ts | source | 4 | 313 | 273 | 15 | — |
| .ts | test | 3 | 408 | 363 | 3 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **事件监听**：session-telemetry/record 瀑布规则对出站副本做脱敏。

## 工程亮点

瀑布组合和新对象返回便于叠加规则；复用时必须验证 next 顺序及宿主副本契约。

## 分发与兼容

清单版本 0.1.0，依赖 telemetry peer 接口；未比较发布包与固定提交。

## 历史对照

前次代码指纹为 811b0b1abf424e57045ab5a5eaa203660ca43908；本轮固定为 811b0b1abf424e57045ab5a5eaa203660ca43908。也可在采集网关脱敏；该插件靠近宿主语义，但保护范围比系统级数据治理窄。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：键名与模式匹配不能覆盖未知秘密，遥测脱敏不保护原始日志或其他联网通道。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用合成假秘密和真实字段结构做出站抓取，分别统计漏脱敏、误脱敏及额外延迟。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
