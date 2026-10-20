# DPH 任务看板

> 把真实会话归入任务状态列，并保存备注和可供智能体读取的看板快照。

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard/commits)
<!-- END META -->

## 版本

固定提交 [ceda7a378b713afdfcae4d94b670b026f2e24100](https://github.com/1070296335-create/dph-taskboard/tree/ceda7a378b713afdfcae4d94b670b026f2e24100)

## 用途与采用点评

- **用途**：同时推进多个会话的用户希望按待办、进行中、评审和完成整理任务。
- **亮点**：浏览器以 localStorage 管理分类，宿主路由接收快照原子落盘，恢复归档优先走 workspaceRegistry。
- **思考**：卡片直接对应会话可减少重复建账；浏览器状态与落盘镜像仍可能出现不同步。
- **建议**：用可丢弃 profile 测试归档与恢复，先验证备份导入再放入重要任务。

## 场景与替代办法

同时推进多个会话的用户希望按待办、进行中、评审和完成整理任务。

宿主会话分组更少维护；额外看板只有在工作量管理收益超过补丁成本时才值得保留。

## 依赖与流程

依赖 Web 会话服务、浏览器存储和 workspaceRegistry，缺服务时使用文件回退需重启。

拖拽分类、添加备注并导出备份；恢复会话后检查目录和看板状态是否一致。

## 成本与效果

维护本地分类、备份和宿主补丁会增加升级成本，未测减少会话切换耗时。

卡片直接对应会话可减少重复建账；浏览器状态与落盘镜像仍可能出现不同步。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：6dd5fc2425a46178cb172e3d90a7b6af9d6cc5517f82f418aee0d911c45c9d92。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 231 | — | — | 1675 |
| .js | source | 2 | 1188 | 1076 | 105 | — |
| .mjs | source | 4 | 396 | 303 | 56 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **界面**：会话任务看板。
- **Host 路由**：看板快照与归档恢复。

## 工程亮点

registry 写失败不回退文件避免状态反写值得借鉴；直接改 workspace 存储的兼容性成本较高。

## 分发与兼容

组件 @dph/taskboard 0.1.0，安装说明涉及宿主挂载补丁和手工路径，成熟度需审慎评估。

## 历史对照

前次代码指纹为 ceda7a378b713afdfcae4d94b670b026f2e24100；本轮固定为 ceda7a378b713afdfcae4d94b670b026f2e24100。宿主会话分组更少维护；额外看板只有在工作量管理收益超过补丁成本时才值得保留。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：状态列是人工组织而非完成证明；未验证并发浏览器同步和不同归档格式恢复。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试两个浏览器修改、归档恢复、导入覆盖、宿主升级和快照写失败。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard/issues?q=is%3Aissue+created%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard/issues?q=is%3Aissue+updated%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z)

统计日期：2026-10-20。
