# dsh-team-cost

> 按工作区归属成员统计模型用量，提供团队报表、预算告警和可选请求拦截。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[72f371c](https://github.com/1569126506-sudo/dsh-team-cost/tree/72f371c7cf45578791739c06b1d949e2868536dd)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1569126506-sudo/dsh-team-cost)
<!-- END META -->

**使用建议**：先只监测不拦截，对照实际账单和子代理用量，补全模型价格并检查相似工作区前缀；金额可信后再考虑预算阻断。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：共用宿主的团队需要把用量归到成员并管预算，验收应对齐账单与身份，不能只看报表有数字。

此前未入档；厂商账单与单人用量插件为对照。本项主要补团队归因，但没有独立证据支持README中的漏计倍数。

## 能力与限制

- **模型工具**：team_cost_report。
- **后台**：成员归因、用量账本、预算告警及请求拦截。
- **界面**：RPC团队成本看板。

**流程与依赖**

需要完整usage事件、准确cwd、价格表与可写账本，Webhook另依赖外部接收方；没有归属时会落默认成员。

配置成员路径和价格，积累报表，对账后设置告警；触发预算时核对请求身份，误拦先关闭enforce并修归属，不把缺价当免费。

**兼容条件**

0.2.1，Node>=22，发布入口dist/index.js，依赖zod及宿主session/request事件、Web RPC；作者说npm渠道尚待开放。

**效果与成本**

账本写入、轮询与Webhook有运维负担，价格维护和归属纠错占人工；没有实测漏计比例或账单精度。

- **思考**：把团队汇总接到请求门禁有管理价值；若归属或单价缺失，报表精确显示也会掩盖错误。

## 工程分析

- **亮点**：src/index.ts监听assistant/message用量，按cwd最长前缀归因，写JSONL及汇总；agent/request可按团队或成员预算拒绝新请求。

归因、价格、quota与store分层便于替换；路径规范化无大小写平台区分，未知价回退与字符串前缀都需独立约束。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：路径前缀不是登录身份认证，startsWith未检查目录边界；未知模型默认零价会低估金额，成员拦截依赖请求payload可解析。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：以父子会话、相邻目录前缀、重放事件与未知模型对账，验证重启去重、预算边界及并发请求超额，记录差异金额。

**分析版本**

固定提交 [72f371c](https://github.com/1569126506-sudo/dsh-team-cost/tree/72f371c7cf45578791739c06b1d949e2868536dd)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 193 | 163 | 17 | — |
| .md | source | 2 | 181 | — | — | 1918 |
| .mjs | source | 2 | 128 | 98 | 18 | — |
| .ts | source | 10 | 1038 | 795 | 156 | — |
| .mjs | test | 1 | 93 | 78 | 7 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1569126506-sudo/dsh-team-cost/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
