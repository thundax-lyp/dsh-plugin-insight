# dsh-wsl-workspace

> 在DSH界面添加WSL工作区，让会话的命令和文件工具使用Linux路径与发行版环境。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[00106d9](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/tree/00106d9575d8d087daec0596dd51f283f78dcdbb)

<!-- BEGIN META -->
[![GitHub ★ 94](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94&color=yellow&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) · [![npm 30d 3340](https://img.shields.io/static/v1?label=npm+30d&message=3%2C340&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace)
<!-- END META -->

**使用建议**：适合已有WSL项目的Windows开发者先在临时目录试用。先核对发行版用户、文件访问权限和所用模式；需要PTC写沙箱的工作先验证明确支持的路径。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：Windows开发者需要在已有WSL项目里使用DSH，合格交付是同一会话的命令、读写与搜索确实落在选定发行版，而不是只打开一个Linux终端。

- **建议**：由文件与命令分属两种执行通道推导，可增加按操作声明的环境能力矩阵：在发起任务前明确报告身份、文件策略与PTY能力，只有匹配的工具进入预设。相对单纯版本兼容表，它把限制前移到任务路由；目前是未验证设计。用不同用户与只读/写入/PTC任务组合检验，若误路由和人工恢复不减少则否定收益。

适合已有WSL项目的Windows开发者先在临时目录试用。先核对发行版用户、文件访问权限和所用模式；需要PTC写沙箱的工作先验证明确支持的路径。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

直接在WSL中运行DSH可避免跨Windows的文件后端差异，但需要额外部署；只用wsl.exe执行bash更简单，却不能统一文件工具的路径。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Host 路由**：浏览发行版目录并创建WSL工作区。
- **界面**：WSL工作区选择与创建入口。

**流程与依赖**

必要条件为Windows、可访问的WSL发行版、Node>=24及匹配的DSH服务；Linux路径映射与9P共享需工作。兼容矩阵与实测日志属于作者材料，本轮未复现。

用户从界面选发行版、检查目录并创建工作区；宿主生成WSL变体，模型通过重定向文件和命令工具工作。权限或沙箱形状不支持时需人工改模式/环境，不能将拒绝解释为任务完成。

**效果与成本**

首次要准备Windows WSL与发行版、配置工作区；日常额外承担跨9P文件访问及权限排查。现金包含原DSH模型调用，未取得费用与延迟对照。升级需回归多宿主版本与权限模式。

若统一路径和工具后端成功，可减少在Windows/WSL间手工翻译路径与重复装宿主；没有任务级耗时或合格率证据，不能宣称整体提效。

- **思考**：“整个会话在WSL”是否意味着统一权限边界？fs.ts实际经Windows的9P共享访问文件，而README说明指定Linux用户只改变bash身份；wsl-run-code-guard.ts也明确workspace-write的run_code不能启动。故路径一致不等于所有工具身份和隔离一致，对依赖Linux权限或PTC的任务必须收窄承诺。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：参照手动在WSL内安装另一套DSH或仅替换bash，增量是将工作区、文件后端、命令与预设统一接到既有宿主；核心是执行环境的组合适配而非新Shell。NOTICE明确承认文件后端和预设继承上游，不能把这些机制全部归为插件原创。

参照手动在WSL内安装另一套DSH或仅替换bash，增量是将工作区、文件后端、命令与预设统一接到既有宿主；核心是执行环境的组合适配而非新Shell。NOTICE明确承认文件后端和预设继承上游，不能把这些机制全部归为插件原创。

值得借鉴的是将执行世界作为预设变体、保留上游文件语义，再对不成立的9P沙箱形状明确拒绝。代价是深度依赖多个宿主服务及版本分支；fs后端与shell身份差异需要作为公开契约维护。wsl-bash-tty.ts把PTY封装与输出归一化独立，便于隔离终端特性，但重试可能重复副作用须在会话层处理。 源码依据：[src/index.ts](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/index.ts)、[src/fs.ts](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/fs.ts)、[src/host/wsl-run-code-guard.ts](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-run-code-guard.ts)、[src/host/wsl-bash-tty.ts](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-tty.ts)、[NOTICE](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/NOTICE)。

<a id="detail-section-5"></a>

### 主要限制

“整个会话在WSL”是否意味着统一权限边界？fs.ts实际经Windows的9P共享访问文件，而README说明指定Linux用户只改变bash身份；wsl-run-code-guard.ts也明确workspace-write的run_code不能启动。故路径一致不等于所有工具身份和隔离一致，对依赖Linux权限或PTC的任务必须收窄承诺。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[dsh-wsl-workspace-maintainers/dsh-wsl-workspace](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace)
- **版本号**：0.7.9（[固定提交 00106d95](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/tree/00106d9575d8d087daec0596dd51f283f78dcdbb)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/fs.ts、src/host/wsl-run-code-guard.ts、src/host/wsl-bash-tty.ts、NOTICE 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：用相同仓库对比原生WSL内DSH与插件：核对读写目标、不同Linux用户、符号链接、命令副作用、禁用后恢复；记录权限失败和人工恢复时间。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由文件与命令分属两种执行通道推导，可增加按操作声明的环境能力矩阵：在发起任务前明确报告身份、文件策略与PTY能力，只有匹配的工具进入预设。相对单纯版本兼容表，它把限制前移到任务路由；目前是未验证设计。用不同用户与只读/写入/PTC任务组合检验，若误路由和人工恢复不减少则否定收益。

用相同仓库对比原生WSL内DSH与插件：核对读写目标、不同Linux用户、符号链接、命令副作用、禁用后恢复；记录权限失败和人工恢复时间。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：3737ba7dd77d14295bbedc199d0ddfc2ba8123d7eaf85290e2167f682ad58008。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 29 | 4832 | — | — | 175795 |
| .mjs | source | 33 | 5977 | 4080 | 1573 | — |
| .js | source | 17 | 9756 | 6464 | 3385 | — |
| .mjs | test | 41 | 11888 | 7852 | 3327 | — |
| .tsx | source | 2 | 530 | 398 | 109 | — |
| .ts | source | 31 | 12128 | 6817 | 4690 | — |
| .ts | test | 23 | 5541 | 3810 | 1293 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 58](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=58&color=grey&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 54](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=54&color=grey&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
