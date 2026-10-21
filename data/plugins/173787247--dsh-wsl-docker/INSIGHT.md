# dsh-wsl-docker

> 检查WSL的Docker CLI、daemon与context，汇总疑似推理容器及本地API端口线索。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[89b19c3](https://github.com/173787247/dsh-wsl-docker/tree/89b19c3428df8dffa4c6771050e774bf1f1eb22b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker)
<!-- END META -->

**使用建议**：先用作收集context与容器信息，再用受控/v1/models和小请求验证API；不要因portHealth为ok就交付推理服务。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：开发者在Docker Desktop和WSL引擎之间排障，想确认容器、GPU和推理服务处于哪一层失败。

此前未入档；原生docker context/version/ps提供同类证据，插件减少汇总步骤但不取代推理验收。

## 能力与限制

- **模型工具**：docker_doctor。

**流程与依赖**

需要正确Docker context与读取权限，GPU能力依赖实际容器配置和驱动；端口可达不等于模型已加载。

查docker_doctor，区分CLI、daemon、容器、GPU与HTTP层，逐层复核；失败后先确认目标引擎，不随意重建容器。

**兼容条件**

0.2.2，Node>=18，需WSL及Docker CLI/daemon；本轮未连接Docker或执行GPU推理。

**效果与成本**

无新模型服务费用，但Docker查询与端口探测耗时；真实推理测试的显存、模型加载及费用不包含在诊断结果里。

- **思考**：能把CLI存在、daemon可达和候选推理容器分开；启发式绿色状态仍需应用层验收。

## 工程分析

- **亮点**：lib/docker.js执行Docker只读命令，按名称/镜像/8000端口识别候选，查询runtime并探测HTTP，生成后续建议。

容器解析、GPU特征和HTTP探针分开便于复用；执行错误回退空字符串使权限失败与不存在可能混同，需原生命令补证。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：容器名与端口是启发式线索；HTTP健康函数把小于500的状态都算响应正常，401/404不能证明OpenAI兼容推理可用。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：覆盖无CLI、错误context、无权限、404端口和实际模型服务，比较诊断标签与已知状态，并记录误判。

**分析版本**

固定提交 [89b19c3](https://github.com/173787247/dsh-wsl-docker/tree/89b19c3428df8dffa4c6771050e774bf1f1eb22b)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 133 | — | — | 775 |
| .js | source | 3 | 330 | 298 | 2 | — |
| .js | test | 1 | 60 | 54 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
