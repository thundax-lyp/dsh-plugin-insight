# api-balance

> 在 DSH Web 输入区显示 DeepSeek 账户余额，支持手动和定时刷新。

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/commits)
<!-- END META -->

## 版本

固定提交 [c27c8b61acf97714ab08d99f97b7be3a9007e52e](https://github.com/02Muller25/dsh-api-balance/tree/c27c8b61acf97714ab08d99f97b7be3a9007e52e)

## 用途与采用点评

- **用途**：使用 DeepSeek API 的用户希望在工作界面看到账户余额，减少切换控制台。
- **亮点**：Host 每次解析凭据并通过 curl 请求余额，客户端持久化刷新偏好并保留失败前的数据。
- **思考**：余额就近可见减少切换，但旧读数可能掩盖故障，必须保留更新时间和失败提示。
- **建议**：先用手动刷新核对官方控制台；检查凭据暴露和日志后，再按需要开启较低频率轮询。

## 场景与替代办法

使用 DeepSeek API 的用户希望在工作界面看到账户余额，减少切换控制台。

官方控制台更直接且无需插件适配；本轮仍未证明显示插件能降低实际账单风险。

## 依赖与流程

需要 credentials、webServer、shell 及 curl；DeepSeek 接口可用性决定读数，不保证离线显示实时。

配置凭据后读取余额；失败时显示保留值和错误，用户需区分缓存数据与新查询结果。

## 成本与效果

配置 API 凭据与宿主服务，持续成本是轮询和排障，未测网络或时间开销。

余额就近可见减少切换，但旧读数可能掩盖故障，必须保留更新时间和失败提示。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：c6e4b9e7c87ae00c97444b83abb427eba4d050b2051b3e018f313c5eaf0a6457。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 346 | 327 | 16 | — |
| .md | source | 1 | 89 | — | — | 928 |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **Host 路由**：余额查询路由在 Host 侧解析凭据。
- **界面**：输入区余额读数与刷新设置。

## 工程亮点

凭据在请求时解析且界面不直接持钥值得借鉴；不受限 shell 调用需要单独评估部署边界。

## 分发与兼容

private 包版本 0.2.1，以 GitHub bundle 或本地包接入；不能仅凭包名推断公开 npm 分发。

## 历史对照

前次代码指纹为 c27c8b61acf97714ab08d99f97b7be3a9007e52e；本轮固定为 c27c8b61acf97714ab08d99f97b7be3a9007e52e。官方控制台更直接且无需插件适配；本轮仍未证明显示插件能降低实际账单风险。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查 Host 和客户端源码，未发起真实余额请求或验证各平台沙箱行为。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用成功、超时和无效凭据三种情况检查密钥未进入客户端、旧值标记和轮询恢复。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 0](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/issues?q=is%3Aissue+created%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天更新 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=0&color=grey&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/issues?q=is%3Aissue+updated%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z)

统计日期：2026-10-20。
