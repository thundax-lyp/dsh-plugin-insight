# dsh-plugin-proxy

> 通过运行时设置切换DSH全局fetch代理，支持直连、系统代理和手动HTTP或SOCKS代理。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-proxy) · [![npm 30d 94](https://img.shields.io/static/v1?label=npm+30d&message=94&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-proxy/commits)
<!-- END META -->

## 版本

固定提交 [b5b5af209e7bd36a6a7008db703a4a9d6d67c1df](https://github.com/1624318455/dsh-plugin-proxy/tree/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df)

## 用途与采用点评

- **用途**：网络环境经常变化的用户希望不重启会话就切换出站路线，验收是目标请求确实经过预期代理。
- **亮点**：lib/index.js用undici setGlobalDispatcher替换全局调度器，设置变化重新应用，旧连接宽限关闭，卸载恢复基线和本插件改过的环境变量。
- **思考**：集中运行期设置简化多处代理配置；进程全局影响也可能改变其他插件的出站路径。
- **建议**：先用可观察测试端点核验fetch与目标客户端，确认无代理或配置错误时的直连回退可接受，再切换真实任务。

## 场景与替代办法

网络环境经常变化的用户希望不重启会话就切换出站路线，验收是目标请求确实经过预期代理。

此前未入档；环境变量或宿主启动代理更简单，本项主要提供热切换与还原，不证明所有协议统一走代理。

## 依赖与流程

需要可用代理及宿主fetch实现兼容，子进程是否继承取决于exportEnv和工具自身；系统代理探测失败会降级。

保存路由模式，查看生效日志并探测出口，观察当前请求；异常时明确切回基线，检查在途任务再重试。

## 成本与效果

代理服务、链路延迟和排障有持续成本；切换时在途连接可能中断，不能把无需重启等同零损耗。

集中运行期设置简化多处代理配置；进程全局影响也可能改变其他插件的出站路径。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：be31f16460cca68a189106fb79e3106174b87e3004906e164e4d76272cf44d46。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 771 | 513 | 194 | — |
| .md | source | 2 | 361 | — | — | 2754 |
| .mjs | source | 2 | 373 | 280 | 47 | — |
| .mjs | test | 1 | 633 | 498 | 94 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **后台**：全局undici调度器切换与环境变量管理。
- **界面**：代理模式设置卡片。

## 工程亮点

环境快照和条件恢复避免覆盖操作者后续修改，日志脱敏proxy userinfo；多个插件同时修改global dispatcher时的卸载顺序仍需核对。

## 分发与兼容

0.1.3，Node>=20，依赖undici ^8.10.0；宿主Node与undici版本兼容须实际验证，Web卡片依赖设置服务。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；环境变量或宿主启动代理更简单，本项主要提供热切换与还原，不证明所有协议统一走代理。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：全局fetch不等于任意网络库都受控；错误配置可能回退直连，因此不能当成禁止直连的数据出口策略。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：覆盖fetch、独立HTTP库、MCP与子进程，切换过程中观察出口和取消；验证配置错误、禁用及多代理插件共存。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-20。
