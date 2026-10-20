# 软件交付

[返回首页](../../../README.md)

## 分类导航

- [@banana-peeljj12/dsh-trellis](#plugin-1335559646-root)：以阶段速记、技能和任务状态实现 Trellis 风格开发工作流。
- [@sakura12/oh-my-deepseekharness](#plugin-1379204512-root)：提供多 Agent 编排模式、角色技能、MCP 工具与图运行时。
- [dsh-folderwatch](#plugin-1423215448-root)：监视目录并在安静窗口后投递去重变更，过滤本会话写入。
- [dsh-plan-lattice](#plugin-1334504487-root)：为长任务提供持久执行合同、工作图与连续性恢复。
- [dsh-plugin-ide-hub](#plugin-1397817235-root)：统一盘点多种编码 IDE 的会话、用量、恢复命令与共享规则。
- [dsh-plugin-task-forge](#plugin-1399011094-root)：把粗略需求编译为版本化任务书，并用回读握手交接给其他 AI。
- [dsh-reaper](#plugin-1423215373-root)：识别 Agent 遗留进程与端口，预览后回收限定范围的进程树。
- [dsh-which](#plugin-1423215529-root)：解释命令实际解析路径、遮蔽关系、重复项与版本差异。

### 软件交付（8）

<a id="plugin-1335559646-root"></a>

#### [@banana-peeljj12/dsh-trellis](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) · [![npm 30d 1766](https://img.shields.io/static/v1?label=npm+30d&message=1%2C766&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) · [![最后更新 11天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=11%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/commits)

- **用途**：以阶段速记、技能和任务状态实现 Trellis 风格开发工作流。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：流程纪律会增加每回合状态维护；只有在降低遗忘和错误提交时才值得，并依赖特定 DSH 0.2.0 RC。
- **建议**：在中型代码任务上比较有无该流程的恢复、Git 清洁度和人工维护时间。

<a id="plugin-1379204512-root"></a>

#### [@sakura12/oh-my-deepseekharness](../../plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)

[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) · [![npm 30d 2379](https://img.shields.io/static/v1?label=npm+30d&message=2%2C379&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness/commits)

- **用途**：提供多 Agent 编排模式、角色技能、MCP 工具与图运行时。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：大规模角色和工具会增加上下文、协调与失败恢复成本；数量不等于交付质量，且兼容范围很宽。
- **建议**：只选一个可并行且结果可验收的任务，与单 Agent 基线比较总 token、人工介入和合格率。

<a id="plugin-1423215448-root"></a>

#### [dsh-folderwatch](../../plugins/11111353535--dsh-folderwatch/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-folderwatch) · [![最后更新 前天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E5%89%8D%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/commits)

- **用途**：监视目录并在安静窗口后投递去重变更，过滤本会话写入。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：自写过滤和安静窗口可能漏掉外部快速改动或制造重复唤醒；大目录的资源成本也未知。
- **建议**：用包含重命名、删除、批量写入和本会话写入的目录测试漏报、重复与 CPU 占用。

<a id="plugin-1334504487-root"></a>

#### [dsh-plan-lattice](../../plugins/1052326311--dsh-plan-lattice/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plan-lattice) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/commits)

- **用途**：为长任务提供持久执行合同、工作图与连续性恢复。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：复杂状态机只有在中断恢复率和交付质量优于简单任务文档时才值得；作者 benchmark 不是本轮宿主验收。
- **建议**：用可中断的多步骤仓库任务，与手工 RUNBOOK 对照恢复正确率、重复工作和维护负担。

<a id="plugin-1397817235-root"></a>

#### [dsh-plugin-ide-hub](../../plugins/121212165--dsh-plugin-ide-hub/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-ide-hub) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/commits)

- **用途**：统一盘点多种编码 IDE 的会话、用量、恢复命令与共享规则。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：它读取多种工具的私有磁盘状态，格式漂移、权限和规则写回冲突是主要维护成本。
- **建议**：先只读盘点两种实际 IDE，核对会话与用量；确认指针文件幂等后再启用共享规则。

<a id="plugin-1399011094-root"></a>

#### [dsh-plugin-task-forge](../../plugins/121212165--dsh-plugin-task-forge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-task-forge) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge/commits)

- **用途**：把粗略需求编译为版本化任务书，并用回读握手交接给其他 AI。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：握手能确认文本被复述，却不能证明接收方具备正确上下文或会按验收执行；任务书维护也有额外成本。
- **建议**：用一次跨窗口真实交接，对比普通复制粘贴的遗漏、返工和维护时间。

<a id="plugin-1423215373-root"></a>

#### [dsh-reaper](../../plugins/11111353535--dsh-reaper/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reaper) · [![最后更新 前天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E5%89%8D%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper/commits)

- **用途**：识别 Agent 遗留进程与端口，预览后回收限定范围的进程树。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：进程归属误判可能终止用户服务；只有受限类别可自动选择仍需真实系统矩阵验证。
- **建议**：在容器或测试账号中构造工作区、系统和无归属进程，确认预览闭包后再允许终止。

<a id="plugin-1423215529-root"></a>

#### [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-which) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-which) · [![最后更新 前天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E5%89%8D%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/11111353535/dsh-which/commits)

- **用途**：解释命令实际解析路径、遮蔽关系、重复项与版本差异。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：版本探针会执行目标命令的版本参数，仍可能有副作用或超时；跨 shell 解析规则也未宿主验证。
- **建议**：先在含重复、失效和包装脚本的测试 PATH 中核对结果，再用于真实环境排障。

## 更新时间

2026-10-19
