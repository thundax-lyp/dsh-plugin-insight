# dsh-agent-recycle-guard

> 检查DSH的Shell工具调用，将识别到的删除改写为回收站操作，无法安全处理时拒绝。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[fd84079](https://github.com/AhYi8/dsh-agent-recycle-guard/tree/fd84079f98170d5066547c087c58c824b4e59d07)

<!-- BEGIN META -->
[![npm 30d 876](https://img.shields.io/static/v1?label=npm+30d&message=876&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agent-recycle-guard) [![首次发布 2026-10-11](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-agent-recycle-guard)
<!-- END META -->

**使用建议**：在可丢弃目录验证平台真实回收和恢复后采用。作为常见误删防护，继续保留宿主沙箱、备份和重要路径权限。

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

- **用途**：Agent清理文件时减少误删损失，合格行为须保留原权限/沙箱且回收失败不永久删除。

- **建议**：由静态改写与执行时展开分工推导，可返回覆盖范围收据，明确已检查语言/脚本及未检查加载边界，并配文件系统变更预览或沙箱作第二层。未验证；隐藏/动态删除样本应清楚标未覆盖而非安全承诺。

在可丢弃目录验证平台真实回收和恢复后采用。作为常见误删防护，继续保留宿主沙箱、备份和重要路径权限。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

备份/沙箱限制损失范围，提示约束较弱；插件补执行前改写但不能替代OS隔离。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **事件监听**：tools pre-execute/execute/result检查、改写和缓存清理。
- **后台**：按需解析运行时准备及回收决策。

**流程与依赖**

DSH tools/shell、Python解析依赖、各系统回收实现及网络镜像；PowerShell与Bash语义分别处理。

原策略判allow/ask后只读分析，allow继续、deny停止、rewrite提交新的原工具调用，系统回收回执与决策日志留存。

**效果与成本**

首次下载/准备等待和依赖供应链核对，持续解析延迟、缓存/改写脚本与回收空间；误拒绝会增加拆命令成本。

将部分不可逆删除改为可恢复操作，收益依赖覆盖和恢复可用性，未有实际事故减少数据。

- **思考**：命中常见删除是否覆盖任意破坏？只处理command/cmd参数，脚本深度/大小/编码及动态加载有限，干净脚本可能仍间接删文件；同用户竞态、模块和外部程序内部操作不受全量保护。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相比提示“别rm”，增量是工具执行前实质检查、语义保留改写与失败关闭；Shell AST和系统回收机制来自现有组件，不构成通用程序安全证明。

相比提示“别rm”，增量是工具执行前实质检查、语义保留改写与失败关闭；Shell AST和系统回收机制来自现有组件，不构成通用程序安全证明。

按exec token关联、失败拒绝、重入原工具链和无永久兜底有价值；运行时引导与同用户竞态是边界。 源码依据：[lib/plugin.js](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/plugin.js)、[lib/runtime.js](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/runtime.js)、[guard/guard.py](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/guard.py)、[guard/script_checks.py](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/script_checks.py)。

<a id="detail-section-5"></a>

### 主要限制

命中常见删除是否覆盖任意破坏？只处理command/cmd参数，脚本深度/大小/编码及动态加载有限，干净脚本可能仍间接删文件；同用户竞态、模块和外部程序内部操作不受全量保护。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AhYi8/dsh-agent-recycle-guard](https://github.com/AhYi8/dsh-agent-recycle-guard)
- **版本号**：1.2.0（[固定提交 fd84079f](https://github.com/AhYi8/dsh-agent-recycle-guard/tree/fd84079f98170d5066547c087c58c824b4e59d07)）
- **版本日期**：2026-10-12（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/plugin.js、lib/runtime.js、guard/guard.py、guard/script_checks.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/plugin.js、lib/runtime.js、guard/guard.py、guard/script_checks.py；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：临时文件验证变量/通配符/跨盘/符号链接/权限拒绝/回收失败，动态导入示例确认未覆盖声明，核对重入审批而不在host直接删除。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由静态改写与执行时展开分工推导，可返回覆盖范围收据，明确已检查语言/脚本及未检查加载边界，并配文件系统变更预览或沙箱作第二层。未验证；隐藏/动态删除样本应清楚标未覆盖而非安全承诺。

临时文件验证变量/通配符/跨盘/符号链接/权限拒绝/回收失败，动态导入示例确认未覆盖声明，核对重入审批而不在host直接删除。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d361513c449d8db6abaa04d1a374f70c7907c490edb50c4adcb5e32438daf40e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 465 | 406 | 45 | — |
| .md | source | 1 | 86 | — | — | 2117 |
| .mjs | test | 3 | 423 | 385 | 21 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AhYi8/dsh-agent-recycle-guard/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
