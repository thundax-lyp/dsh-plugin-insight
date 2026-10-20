# dsh-wsl-compose

> 封装Docker Compose状态、容器列表和日志，并可在配置允许及参数确认后执行up或down。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose/commits)
<!-- END META -->

## 版本

固定提交 [bea57df86854983d90c8ac9219d15db1235c1652](https://github.com/173787247/dsh-wsl-compose/tree/bea57df86854983d90c8ac9219d15db1235c1652)

## 用途与采用点评

- **用途**：需要从DSH检查本地Compose服务的开发者希望少写诊断命令，验收包括目标项目正确及服务实际状态。
- **亮点**：lib/compose.js规范化项目真实路径并检查allowRoots，spawn docker compose；变更入口同时要求allowMutate与confirm，日志限量返回。
- **思考**：项目边界和只读优先能减少误操作，但便利工具不能替代Docker本身的权限隔离和变更审批。
- **建议**：先仅开放ps/logs并配置明确根目录，在测试项目验证路径；需要up/down时先人工审阅Compose文件并保留运行状态。

## 场景与替代办法

需要从DSH检查本地Compose服务的开发者希望少写诊断命令，验收包括目标项目正确及服务实际状态。

此前未入档；原生docker compose命令更透明，本项主要统一工具schema和默认门禁。

## 依赖与流程

需要可达Docker daemon、正确context与Compose配置；容器实际健康需要应用探针，CLI成功不等于服务可用。

先查status、ps和日志，确认项目后才变更；超时核对容器实际状态再重试，不把中止CLI当成远端操作取消。

## 成本与效果

部署Docker及维护权限为首次成本，启动服务消耗CPU/内存/磁盘；错误down和重建恢复需人工，没有效率实测。

项目边界和只读优先能减少误操作，但便利工具不能替代Docker本身的权限隔离和变更审批。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：6809101ffd1c745ff0d6aee9385f0fc74fa94c0ea46c47b622d712d9ac40e1d4。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 120 | — | — | 508 |
| .js | source | 2 | 306 | 284 | 5 | — |
| .js | test | 1 | 13 | 12 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：compose_status、compose_ps、compose_logs、compose_up、compose_down。

## 工程亮点

realpath检查覆盖符号链接路径，输出与超时有界；composeBin只返回docker，legacy探测与执行能力之间有差距。

## 分发与兼容

0.1.1，Node>=18，需要Docker CLI及compose插件；探测legacy docker-compose存在不表示执行器会回退它。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；原生docker compose命令更透明，本项主要统一工具schema和默认门禁。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：默认禁止变更，但空allowRoots不限制项目；confirm=true是模型参数而非独立人工批准，Compose文件自身仍可定义有副作用服务。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用临时项目测试根目录逃逸、无compose插件、变更关闭和超时，随后通过应用健康请求验收而非只看退出码。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose/issues?q=is%3Aissue+created%3A2026-09-20T04%3A26%3A52.583Z..2026-10-20T04%3A26%3A52.583Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T04%3A26%3A52.583Z..2026-10-20T04%3A26%3A52.583Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose/issues?q=is%3Aissue+updated%3A2026-09-20T04%3A26%3A52.583Z..2026-10-20T04%3A26%3A52.583Z)

统计日期：2026-10-20。
