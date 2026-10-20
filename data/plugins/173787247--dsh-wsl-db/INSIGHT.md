# dsh-wsl-db

> 通过psql和redis-cli执行受限查询与连通探针，支持配置连接别名和Redis主机范围。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db/commits)
<!-- END META -->

## 版本

固定提交 [7ec1796675752805913ed7d5645d91541161d8eb](https://github.com/173787247/dsh-wsl-db/tree/7ec1796675752805913ed7d5645d91541161d8eb)

## 用途与采用点评

- **用途**：开发者想在会话里查看PostgreSQL或Redis状态，合格结果是目标正确、查询低风险且输出可复核。
- **亮点**：lib/db.js按前缀和关键字筛SQL、按命令白名单筛Redis，调用CLI并限制时间和输出；入口解析连接别名与host范围。
- **思考**：把连通与小查询标准化有排障价值；应用层读命令白名单无法证明查询成本低或没有副作用。
- **建议**：先使用数据库端只读角色和测试库，限制主机与别名，避免在大Redis执行KEYS；敏感查询结果谨慎进入模型上下文。

## 场景与替代办法

开发者想在会话里查看PostgreSQL或Redis状态，合格结果是目标正确、查询低风险且输出可复核。

此前未入档；原生CLI更透明，本项减少在会话里手动拼命令，但不提供数据库管理与事务保障。

## 依赖与流程

需要可达数据库、CLI、受控凭据及准确连接配置；只读权限与查询复杂度是效果依赖，不能仅依赖工具描述。

查CLI状态和别名，再小范围ping与查询，核对结果及截断；超时先确认数据库负载和实际执行状态再重试。

## 成本与效果

首次配置只读账号、CLI和别名需人工；查询负载、网络及模型上下文有持续成本，误查大库和超时排查另计。

把连通与小查询标准化有排障价值；应用层读命令白名单无法证明查询成本低或没有副作用。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：a6f8e1bc49c8c0ca0ba07514b5cde62ab7f9d307e5f46840e01766c7960a31ad。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 470 |
| .js | source | 2 | 386 | 354 | 12 | — |
| .js | test | 1 | 18 | 17 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：db_status、db_ping、db_psql、db_redis。

## 工程亮点

连接解析和执行层分离、返回截断信息；SQL关键字正则可能误拒字符串，也可能漏语义副作用，需数据库权限兜底。

## 分发与兼容

0.1.1，Node>=18，实际需psql/redis-cli和配置凭据；与MySQL插件不同，此项是命令行薄封装，没有连接设置UI。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；原生CLI更透明，本项减少在会话里手动拼命令，但不提供数据库管理与事务保障。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：字符串过滤不是SQL完整权限模型，SELECT函数也可能有副作用；Redis KEYS即使限输出仍可能阻塞大库，不能当生产安全保证。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在临时只读库覆盖函数调用、CTE、字符串关键字、错误别名和Redis大键空间，测实际负载、拒绝行为与输出泄露范围。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 0](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db/issues?q=is%3Aissue+created%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天更新 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db/issues?q=is%3Aissue+updated%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z)

统计日期：2026-10-20。
