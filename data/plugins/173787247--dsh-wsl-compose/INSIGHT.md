# dsh-wsl-compose

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[bea57df](https://github.com/173787247/dsh-wsl-compose/tree/bea57df86854983d90c8ac9219d15db1235c1652)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-compose)
<!-- END META -->

> **实现功能**：封装Docker Compose状态、容器列表和日志，并可在配置允许及参数确认后执行up或down。

> **核心亮点**：lib/compose.js规范化项目真实路径并检查allowRoots，spawn docker compose；变更入口同时要求allowMutate与confirm，日志限量返回。

> **风险与缺陷**：项目边界和只读优先能减少误操作，但便利工具不能替代Docker本身的权限隔离和变更审批。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：需要从DSH检查本地Compose服务的开发者希望少写诊断命令，验收包括目标项目正确及服务实际状态。

此前未入档；原生docker compose命令更透明，本项主要统一工具schema和默认门禁。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **模型工具**：compose_status、compose_ps、compose_logs、compose_up、compose_down。

**流程与依赖**

需要可达Docker daemon、正确context与Compose配置；容器实际健康需要应用探针，CLI成功不等于服务可用。

先查status、ps和日志，确认项目后才变更；超时核对容器实际状态再重试，不把中止CLI当成远端操作取消。

**兼容条件**

0.1.1，Node>=18，需要Docker CLI及compose插件；探测legacy docker-compose存在不表示执行器会回退它。

**效果与成本**

部署Docker及维护权限为首次成本，启动服务消耗CPU/内存/磁盘；错误down和重建恢复需人工，没有效率实测。

> **思考**：项目边界和只读优先能减少误操作，但便利工具不能替代Docker本身的权限隔离和变更审批。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：lib/compose.js规范化项目真实路径并检查allowRoots，spawn docker compose；变更入口同时要求allowMutate与confirm，日志限量返回。

realpath检查覆盖符号链接路径，输出与超时有界；composeBin只返回docker，legacy探测与执行能力之间有差距。

<a id="detail-section-4"></a>

## 4 使用建议

先仅开放ps/logs并配置明确根目录，在测试项目验证路径；需要up/down时先人工审阅Compose文件并保留运行状态。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：默认禁止变更，但空allowRoots不限制项目；confirm=true是模型参数而非独立人工批准，Compose文件自身仍可定义有副作用服务。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用临时项目测试根目录逃逸、无compose插件、变更关闭和超时，随后通过应用健康请求验收而非只看退出码。

**分析版本**

固定提交 [bea57df](https://github.com/173787247/dsh-wsl-compose/tree/bea57df86854983d90c8ac9219d15db1235c1652)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 120 | — | — | 508 |
| .js | source | 2 | 306 | 284 | 5 | — |
| .js | test | 1 | 13 | 12 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-compose/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
