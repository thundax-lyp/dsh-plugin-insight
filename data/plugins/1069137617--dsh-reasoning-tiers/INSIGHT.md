# dsh-reasoning-tiers

> 按规则补齐第三方模型推理档位，并在设置页编辑模型能力声明。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1069137617/dsh-reasoning-tiers) · [![npm 30d 1061](https://img.shields.io/static/v1?label=npm+30d&message=1%2C061&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers) · [![最后更新 14天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=14%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1069137617/dsh-reasoning-tiers/commits)
<!-- END META -->

## 版本

固定提交 [fe642c8ec878b6ba46a7c1831fc6cea557083e5b](https://github.com/1069137617/dsh-reasoning-tiers/tree/fe642c8ec878b6ba46a7c1831fc6cea557083e5b)

## 用途与采用点评

- **用途**：自定义供应商模型缺少档位元数据时，用户需要恢复可选档位并识别无效配置。
- **亮点**：按知识表和实时模型信息生成设置补丁，带版本写入、重算冲突并记录撤销日志，不接管请求适配器。
- **思考**：配置缝修复比拦截模型请求侵入小；声明能力仍须与真实提供商行为一致。
- **建议**：先备份 profile，对单个模型检查实际请求与撤销结果，再考虑批量补齐。

## 场景与替代办法

自定义供应商模型缺少档位元数据时，用户需要恢复可选档位并识别无效配置。

手工填写提供商官方能力更费时但来源直接；不能用插件自己的表格自证档位有效。

## 依赖与流程

依赖 settings、llm、llm-pi-ai 和内置知识表；宿主版本决定事件和表单接口。

检查模型能力后补缺失配置，重启需要启动读取的部分；有误时按日志撤销并核对。

## 成本与效果

规则维护、备份和撤销演练是主要成本；模型高档位可能增加实际推理费用，未测增益。

配置缝修复比拦截模型请求侵入小；声明能力仍须与真实提供商行为一致。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d93c2f565125ca5897b875f4db296e645ceede70acc8f5b615b44e86127153bd。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1416 | — | — | 10572 |
| .mjs | source | 3 | 526 | 382 | 98 | — |
| .ts | source | 11 | 2640 | 1770 | 671 | — |
| .tsx | source | 1 | 245 | 209 | 25 | — |
| .mjs | test | 9 | 1330 | 1133 | 68 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **后台**：模型档位配置补齐与诊断。
- **界面**：模型能力设置页。

## 工程亮点

版本冲突后重算一次、知识表异常拒写和独立日志可借鉴；撤销日志与实际写入一致性需实测。

## 分发与兼容

版本 0.3.1；Host 兼容旧事件与 0.2.0 document-updated，能力界面要求 0.2.0。

## 历史对照

前次代码指纹为 fe642c8ec878b6ba46a7c1831fc6cea557083e5b；本轮固定为 fe642c8ec878b6ba46a7c1831fc6cea557083e5b。手工填写提供商官方能力更费时但来源直接；不能用插件自己的表格自证档位有效。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：档位出现不证明服务端确实改变推理量；本轮未做请求字节或质量对照。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试已有配置保留、并发修改、撤销、平坦档位与不支持档位的服务端错误。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-20。
