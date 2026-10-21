# dsh-ai-armor

> 聚合 Git 排错、堆栈解码、配置检查、Shell 调用与 SQL 静态审计工具。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[dedf8d3](https://github.com/AAAlenwow/dsh-ai-armor/tree/dedf8d32fcaaa70e8584f432ba1c63b103f133dc)

<!-- BEGIN META -->

<!-- END META -->

**使用建议**：可按具体只读诊断工具需求评估；二分执行与静态扫描需分别授权和隔离，不能因本地工具或零依赖而当作无副作用。

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

- **用途**：Java后台开发者在Agent修改后取得回归定位与常见配置/SQL线索；合格交付应是可复现原因及修复验证，而非扫描命中就认定根因。

- **建议**：按副作用声明分层工具，将二分放入独立工作树并固定repro摘要/逐步结果，可能减少诊断工具破坏现场；同时对Shell调用用结构化argv和工作目录字段替代生成命令文本。以已有bisect、脏仓库、repro写文件及含$的cwd反例对照，要求原仓库不变且执行目录正确，否则否定隔离和语义保真收益。

可按具体只读诊断工具需求评估；二分执行与静态扫描需分别授权和隔离，不能因本地工具或零依赖而当作无副作用。

核查状态：聚合注册、二分执行、正则审计与Shell构造可由源码确认；准确率、恢复安全与跨Shell效果未经运行验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

Git bisect、IDE堆栈跳转、现成配置检查和SQL审查均可独立完成；本项统一工具入口，原工具算法与运行责任仍保留。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：根入口导入五组工具：Git回归四项、堆栈、配置、Shell构造与MyBatis SQL审计。

**流程与依赖**

根入口动态导入五子插件的tools数组并注册；Git回归工具调用系统Git，bisectWithRepro写临时bash脚本并执行用户repro。SQL按XML/Java源码模式扫描，Shell工具返回不同shell的调用文本，其他工具各自解析堆栈和配置。

DSH tools、Node文件系统与child_process、Git/bash，部分工具面向Java/MyBatis XML；权限和运行目录由宿主/调用方决定。

Agent选择工具→参数校验→读取/执行本地动作→返回结构化线索→人工或模型结合代码/测试确认；没有自动修复或独立业务验收闭环。

MIT聚合bundle以根Host入口注册五子插件工具；独立子包使用须避同名重复注册；本地零第三方包仍依赖Git/bash与文件访问。

**效果与成本**

现金无内置模型调用，但repro可能触发构建/API/其他副作用；人工需选好坏提交、提供可信repro、核对扫描命中与失败现场。作者性能表未复现。

可能减少命令组织时间、提供定位线索；不证明缺陷消除、SQL安全或任何shell下命令等价。

- **思考**：统一“armor”是否掩盖工具性质差异？bisect会先reset已有二分、切提交并执行repro，结束reset不撤销repro文件或外部副作用；MAX_STEPS常量未参与控制。POSIX构造计算了cdPart却未用于invocation，cwd仅在note中承诺，PowerShell cwd用JSON字符串不等于可靠PowerShell字面量。SQL正则只检查WHERE字样，动态条件可漏报。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对Agent临时拼接Git命令和静态扫描脚本，增量是把常见排错动作组织成可调用工具并返回结构化线索；二分算法属于Git，模式扫描不是完整程序分析。根组件是五组工具的分发聚合，不能由“8工具”推导新的端到端修复工作流。

相对Agent临时拼接Git命令和静态扫描脚本，增量是把常见排错动作组织成可调用工具并返回结构化线索；二分算法属于Git，模式扫描不是完整程序分析。根组件是五组工具的分发聚合，不能由“8工具”推导新的端到端修复工作流。

子工具拆分利于复用，Git bisect run复用上游收敛逻辑；根入口单个子插件失败会日志并继续，部分可用状态需让调用方辨认。repro脚本生命周期有finally清理，但不是原仓库副作用回滚。

固定源码依据：[lib/index.js](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js)、[plugins/dsh-when-broke/lib/bisect-with-repro.js](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/plugins/dsh-when-broke/lib/bisect-with-repro.js)、[plugins/dsh-mp-auditor/lib/findings.js](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/plugins/dsh-mp-auditor/lib/findings.js)、[plugins/dsh-cmd-shield/lib/shell-escape.js](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/plugins/dsh-cmd-shield/lib/shell-escape.js)、[cordis.patch.yml](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/cordis.patch.yml)、[package.json](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/package.json)。

<a id="detail-section-5"></a>

### 主要限制

统一“armor”是否掩盖工具性质差异？bisect会先reset已有二分、切提交并执行repro，结束reset不撤销repro文件或外部副作用；MAX_STEPS常量未参与控制。POSIX构造计算了cdPart却未用于invocation，cwd仅在note中承诺，PowerShell cwd用JSON字符串不等于可靠PowerShell字面量。SQL正则只检查WHERE字样，动态条件可漏报。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.0；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[dedf8d32](https://github.com/AAAlenwow/dsh-ai-armor/tree/dedf8d32fcaaa70e8584f432ba1c63b103f133dc)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根聚合入口及三个关键风险路径：Git二分、SQL模式、Shell构造，另核patch/包清单；复核正式旧11项finding和证据/评分，未深入全部子工具算法，不将工具总数视为全覆盖审计。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

按副作用声明分层工具，将二分放入独立工作树并固定repro摘要/逐步结果，可能减少诊断工具破坏现场；同时对Shell调用用结构化argv和工作目录字段替代生成命令文本。以已有bisect、脏仓库、repro写文件及含$的cwd反例对照，要求原仓库不变且执行目录正确，否则否定隔离和语义保真收益。

未执行目标或repro。最小验证分别隔离二分副作用、对SQL正反例盲测误报，以及跨shell特殊cwd和命令语义对照；结果未知。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 18 | 2260 | 1756 | 355 | — |
| .md | source | 8 | 531 | — | — | 3479 |
| .mjs | test | 11 | 1133 | 929 | 110 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-ai-armor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-ai-armor/issues?q=is%3Aissue+created%3A2026-09-21T05%3A33%3A12.298Z..2026-10-21T05%3A33%3A12.298Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-ai-armor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A33%3A12.298Z..2026-10-21T05%3A33%3A12.298Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
