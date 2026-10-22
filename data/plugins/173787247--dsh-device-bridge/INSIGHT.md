# dsh-device-bridge

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[25699df](https://github.com/173787247/dsh-device-bridge/tree/25699dfd31f32500e5016e90d271c8e6674c1945)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-device-bridge)
<!-- END META -->

> **实现功能**：把实现Companion协议的手机或设备接入DSH，提供设备列表、健康查询和动作调用。

> **核心亮点**：index.js注册三个工具，按配置选择设备和允许动作，再委托dsh-wsl-common的Companion客户端发送HTTP请求。

> **风险与缺陷**：统一轻量协议能降低多设备接入重复工作；动作名白名单并不证明动作本身无副作用。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：用户希望从会话触发已知设备动作，合格交付是正确设备实际完成动作并能报告失败。

此前未入档；设备原生API和SSH为替代，本项适合已有统一HTTP动作协议的薄设备。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **模型工具**：device_list、device_status、device_invoke。

**流程与依赖**

需要可达且受控的Companion服务、与协议匹配的动作实现和共享包；效果依赖设备在线及动作结果可核查。

列设备、查健康、选择白名单动作并调用，随后核对设备状态；超时先查询实际结果，避免重复触发有副作用动作。

**兼容条件**

0.1.1，Node>=18，需要DSH tools/systemPrompt及外部dsh-wsl-common；是可选桥接，不随套件默认安装。

**效果与成本**

需要部署并维护设备端服务、网络及token，失败重试与人工确认设备状态占时间；没有端到端完成率或费用实测。

> **思考**：统一轻量协议能降低多设备接入重复工作；动作名白名单并不证明动作本身无副作用。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：index.js注册三个工具，按配置选择设备和允许动作，再委托dsh-wsl-common的Companion客户端发送HTTP请求。

工具层显式设备选择与allowActions清单清楚；实际确认、鉴权和传输边界主要落在未固定共享依赖与设备服务。

<a id="detail-section-4"></a>

## 4 使用建议

先只开放ping/status等无副作用动作，在隔离网络核对设备身份；固定共享依赖与设备端实现后再启用实际控制。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仓库只重导出共享客户端，依赖为未固定SHA的GitHub引用；mock与Termux样例不证明任意IoT实际可用。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：固定依赖后测试错设备、错误token、动作拒绝、超时已执行与重试；以设备端日志核对是否重复执行。

**分析版本**

固定提交 [25699df](https://github.com/173787247/dsh-device-bridge/tree/25699dfd31f32500e5016e90d271c8e6674c1945)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 125 | — | — | 551 |
| .js | source | 2 | 127 | 119 | 1 | — |
| .js | test | 1 | 13 | 12 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-device-bridge/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
