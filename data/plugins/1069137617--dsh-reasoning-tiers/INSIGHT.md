# dsh-reasoning-tiers

> 按规则补齐第三方模型推理档位，并在设置页编辑模型能力声明。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[fe642c8](https://github.com/1069137617/dsh-reasoning-tiers/tree/fe642c8ec878b6ba46a7c1831fc6cea557083e5b)

<!-- BEGIN META -->
[![npm 30d 1,044](https://img.shields.io/static/v1?label=npm+30d&message=1%2C044&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers) [![首次发布 2026-09-12](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-09-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers)
<!-- END META -->

**使用建议**：先备份 profile，对单个模型检查实际请求与撤销结果，再考虑批量补齐。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：自定义供应商模型缺少档位元数据时，用户需要恢复可选档位并识别无效配置。

手工填写提供商官方能力更费时但来源直接；不能用插件自己的表格自证档位有效。

## 能力与限制

- **后台**：模型档位配置补齐与诊断。
- **界面**：模型能力设置页。

**流程与依赖**

依赖 settings、llm、llm-pi-ai 和内置知识表；宿主版本决定事件和表单接口。

检查模型能力后补缺失配置，重启需要启动读取的部分；有误时按日志撤销并核对。

**兼容条件**

版本 0.3.1；Host 兼容旧事件与 0.2.0 document-updated，能力界面要求 0.2.0。

**效果与成本**

规则维护、备份和撤销演练是主要成本；模型高档位可能增加实际推理费用，未测增益。

- **思考**：配置缝修复比拦截模型请求侵入小；声明能力仍须与真实提供商行为一致。

## 工程分析

- **亮点**：按知识表和实时模型信息生成设置补丁，带版本写入、重算冲突并记录撤销日志，不接管请求适配器。

版本冲突后重算一次、知识表异常拒写和独立日志可借鉴；撤销日志与实际写入一致性需实测。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：档位出现不证明服务端确实改变推理量；本轮未做请求字节或质量对照。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试已有配置保留、并发修改、撤销、平坦档位与不支持档位的服务端错误。

**分析版本**

固定提交 [fe642c8](https://github.com/1069137617/dsh-reasoning-tiers/tree/fe642c8ec878b6ba46a7c1831fc6cea557083e5b)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1416 | — | — | 10572 |
| .mjs | source | 3 | 526 | 382 | 98 | — |
| .ts | source | 11 | 2640 | 1770 | 671 | — |
| .tsx | source | 1 | 245 | 209 | 25 | — |
| .mjs | test | 9 | 1330 | 1133 | 68 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1069137617/dsh-reasoning-tiers/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
