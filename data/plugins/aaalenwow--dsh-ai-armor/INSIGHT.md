# dsh-ai-armor

> 打包堆栈定位、Git溯源与二分、配置检查、Shell命令构造和MyBatis Plus静态审计工具。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[b6e11ab](https://github.com/AAAlenwow/dsh-ai-armor/tree/b6e11aba82798af575119e1beffd5534f9b1f5c7)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-ai-armor)
<!-- END META -->

**使用建议**：适合逐项使用本地排错工具。先核对副作用，二分仅在隔离仓库且repro可信时使用；静态命中要回到代码与测试验证。

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

- **用途**：Java后台开发者在Agent修改后排查常见错误，需要快速取得定位线索；合格交付是可复现原因与修复验证，不能仅以静态finding判定生产根因。

- **建议**：由混合只读/执行工具推导，可给每项声明副作用等级，二分在独立工作树中跑固定repro并保留每步结果。未验证；在已有bisect/脏工作区及repro超时情形检查原仓库是否保持，若不能则否定隔离收益。

适合逐项使用本地排错工具。先核对副作用，二分仅在隔离仓库且repro可信时使用；静态命中要回到代码与测试验证。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

Git/IDE/配置解析器均能完成底层工作，插件降低Agent接线负担但不取代专用分析。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：聚合when_broke系列、decode_stack、validate_config、build_shell_invocation和audit_mp_code。

**流程与依赖**

DSH tools、Node、Git与执行repro所需工具；效果依赖可重复good/bad判据、目标源码形式与Shell环境。

选择故障类型，工具提供位置/静态线索或执行二分，人工复核后修复并回归；不自动修代码。

**效果与成本**

初始需确认工具范围，二分每步repro消耗时间和可能构建资源，静态扫描需人工复核；作者延迟表未复现。

可能缩短定位和命令拼接时间，未证明缺陷消除率或所有Shell正确性。

- **思考**：README“不执行任何代码”与bisect实现不一致：工具会写临时脚本并执行用户repro、多次切换Git提交，开头还bisect reset。它与只读扫描的副作用不同，不能以全本地或无第三方包推断无风险。SQL正则也可能误报/漏报动态条件。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对Agent手工拼Git/转义/扫描命令，增量是将常见排错动作结构化聚合；Git二分与系统Shell能力归上游，正则审计不是完整程序分析。

相对Agent手工拼Git/转义/扫描命令，增量是将常见排错动作结构化聚合；Git二分与系统Shell能力归上游，正则审计不是完整程序分析。

子插件拆分可复用，Git内置bisect避免自写收敛逻辑；执行类与静态类须分层。shell构造与正则扫描需明确不证明命令/业务安全。 源码依据：[plugins/dsh-when-broke/lib/bisect-with-repro.js](https://github.com/AAAlenwow/dsh-ai-armor/blob/b6e11aba82798af575119e1beffd5534f9b1f5c7/plugins/dsh-when-broke/lib/bisect-with-repro.js)、[plugins/dsh-mp-auditor/lib/findings.js](https://github.com/AAAlenwow/dsh-ai-armor/blob/b6e11aba82798af575119e1beffd5534f9b1f5c7/plugins/dsh-mp-auditor/lib/findings.js)、[plugins/dsh-cmd-shield/lib/shell-escape.js](https://github.com/AAAlenwow/dsh-ai-armor/blob/b6e11aba82798af575119e1beffd5534f9b1f5c7/plugins/dsh-cmd-shield/lib/shell-escape.js)。

<a id="detail-section-5"></a>

### 主要限制

README“不执行任何代码”与bisect实现不一致：工具会写临时脚本并执行用户repro、多次切换Git提交，开头还bisect reset。它与只读扫描的副作用不同，不能以全本地或无第三方包推断无风险。SQL正则也可能误报/漏报动态条件。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AAAlenwow/dsh-ai-armor](https://github.com/AAAlenwow/dsh-ai-armor)
- **版本号**：0.1.0（[固定提交 b6e11aba](https://github.com/AAAlenwow/dsh-ai-armor/tree/b6e11aba82798af575119e1beffd5534f9b1f5c7)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 plugins/dsh-when-broke/lib/bisect-with-repro.js、plugins/dsh-mp-auditor/lib/findings.js、plugins/dsh-cmd-shield/lib/shell-escape.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：隔离仓库验证二分reset/超时与副作用，SQL正负样例盲评误报，Shell特殊字符按实际执行结果对照。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由混合只读/执行工具推导，可给每项声明副作用等级，二分在独立工作树中跑固定repro并保留每步结果。未验证；在已有bisect/脏工作区及repro超时情形检查原仓库是否保持，若不能则否定隔离收益。

隔离仓库验证二分reset/超时与副作用，SQL正负样例盲评误报，Shell特殊字符按实际执行结果对照。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：7a9c7bbf200f301061e0a6e193fa1d5b03af1ee0d53d4b7574b469851e0fd0e4。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 18 | 2260 | 1756 | 355 | — |
| .md | source | 8 | 531 | — | — | 3471 |
| .mjs | test | 11 | 1133 | 929 | 110 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-ai-armor/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-ai-armor/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-ai-armor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
