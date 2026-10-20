# dsh-wsl-docker

> 检查WSL的Docker CLI、daemon与context，汇总疑似推理容器及本地API端口线索。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker/commits)
<!-- END META -->

## 版本

固定提交 [89b19c3428df8dffa4c6771050e774bf1f1eb22b](https://github.com/173787247/dsh-wsl-docker/tree/89b19c3428df8dffa4c6771050e774bf1f1eb22b)

## 用途与采用点评

- **用途**：开发者在Docker Desktop和WSL引擎之间排障，想确认容器、GPU和推理服务处于哪一层失败。
- **亮点**：lib/docker.js执行Docker只读命令，按名称/镜像/8000端口识别候选，查询runtime并探测HTTP，生成后续建议。
- **思考**：能把CLI存在、daemon可达和候选推理容器分开；启发式绿色状态仍需应用层验收。
- **建议**：先用作收集context与容器信息，再用受控/v1/models和小请求验证API；不要因portHealth为ok就交付推理服务。

## 场景与替代办法

开发者在Docker Desktop和WSL引擎之间排障，想确认容器、GPU和推理服务处于哪一层失败。

此前未入档；原生docker context/version/ps提供同类证据，插件减少汇总步骤但不取代推理验收。

## 依赖与流程

需要正确Docker context与读取权限，GPU能力依赖实际容器配置和驱动；端口可达不等于模型已加载。

查docker_doctor，区分CLI、daemon、容器、GPU与HTTP层，逐层复核；失败后先确认目标引擎，不随意重建容器。

## 成本与效果

无新模型服务费用，但Docker查询与端口探测耗时；真实推理测试的显存、模型加载及费用不包含在诊断结果里。

能把CLI存在、daemon可达和候选推理容器分开；启发式绿色状态仍需应用层验收。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：a6a90157a34f1ba2451636f0b9671f270b3da5e6ddcdda68bb80aa9592546e89。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 133 | — | — | 775 |
| .js | source | 3 | 330 | 298 | 2 | — |
| .js | test | 1 | 60 | 54 | 3 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：docker_doctor。

## 工程亮点

容器解析、GPU特征和HTTP探针分开便于复用；执行错误回退空字符串使权限失败与不存在可能混同，需原生命令补证。

## 分发与兼容

0.2.2，Node>=18，需WSL及Docker CLI/daemon；本轮未连接Docker或执行GPU推理。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；原生docker context/version/ps提供同类证据，插件减少汇总步骤但不取代推理验收。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：容器名与端口是启发式线索；HTTP健康函数把小于500的状态都算响应正常，401/404不能证明OpenAI兼容推理可用。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：覆盖无CLI、错误context、无权限、404端口和实际模型服务，比较诊断标签与已知状态，并记录误判。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+created%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+updated%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z)

统计日期：2026-10-20。
