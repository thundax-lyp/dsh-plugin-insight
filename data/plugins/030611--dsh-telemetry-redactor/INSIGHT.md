# DSH Telemetry Redactor

> 在遥测记录瀑布中递归脱敏支持的凭据模式，保留原始会话日志。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[811b0b1](https://github.com/030611/dsh-telemetry-redactor/tree/811b0b1abf424e57045ab5a5eaa203660ca43908)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) [![npm 30d 1,182](https://img.shields.io/static/v1?label=npm+30d&message=1%2C182&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor) [![首次发布 2026-08-14](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor)
<!-- END META -->

**使用建议**：先在测试遥测里放入假密钥、普通文本和 token 计量字段，核对脱敏与保真后再接后端。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：向观测后端发送会话遥测的部署者需要减少凭据外传，输入是遥测副本。

也可在采集网关脱敏；该插件靠近宿主语义，但保护范围比系统级数据治理窄。

## 能力与限制

- **事件监听**：session-telemetry/record 瀑布规则对出站副本做脱敏。

**流程与依赖**

需要支持对应 telemetry waterfall 的 DSH，收益取决于真正走该出口的后端。

配置替换文本后观察遥测；漏报新增规则，误报调整例外，再验证原始日志未被改变。

**兼容条件**

清单版本 0.1.0，依赖 telemetry peer 接口；未比较发布包与固定提交。

**效果与成本**

需要维护规则与例外，误删观测字段会增加排障时间；未测延迟和泄漏率。

- **思考**：在统一出口处理副本有清晰边界；它是遥测防护的一层，不能替代凭据权限和全链路审计。

## 工程分析

- **亮点**：session-telemetry/record 前置规则调用 next 后递归生成脱敏记录，不重写规范会话。

瀑布组合和新对象返回便于叠加规则；复用时必须验证 next 顺序及宿主副本契约。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：键名与模式匹配不能覆盖未知秘密，遥测脱敏不保护原始日志或其他联网通道。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用合成假秘密和真实字段结构做出站抓取，分别统计漏脱敏、误脱敏及额外延迟。

**分析版本**

固定提交 [811b0b1](https://github.com/030611/dsh-telemetry-redactor/tree/811b0b1abf424e57045ab5a5eaa203660ca43908)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 393 | — | — | 4906 |
| .mjs | source | 4 | 110 | 102 | 0 | — |
| .ts | source | 4 | 313 | 273 | 15 | — |
| .ts | test | 3 | 408 | 363 | 3 | — |

</details>

**活跃度**

[![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
