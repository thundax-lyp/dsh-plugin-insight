# dsh-leak-guard

> 在 DSH 通过本地规则扫描指定文件或目录中的凭据，并返回脱敏发现。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[8b578f8](https://github.com/7gzgn/dsh-leak-guard/tree/8b578f80898b80acc77285f3f4c095b433dda0a4)

<!-- BEGIN META -->

<!-- END META -->

**使用建议**：适合发布前补查明显秘密；显式传项目路径，查看所有跳过项，再检查真实打包文件与Git历史，别把ok当无泄露保证。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

开发者在推送或外发前检查当前工作树的明显凭据，交付带位置、规则和掩码的候选发现供人处理。

参照常规正则秘密扫描与模型手工检查；未做与其他扫描器召回/速度基准。

<a id="detail-section-3"></a>

### 能力、流程与依赖

index注册leak_guard和系统引导；scanner先粗筛再匹配patterns规则，对占位符放行，跳目录/二进制/大文件并以严重度汇总，默认不写盘不联网。

- **模型工具**：leak_guard扫描与规则清单。

DSH工具/系统提示注册与Node文件API；目标路径权限和规则前缀决定覆盖，不依赖网络。

显式选路径→遍历/跳过→粗筛/规则→掩码排序→用户修复→重新扫描；工具本身不发布也不撤销泄露。

ESM host工具，声明DSH 0.2线；工具schema兼容降级是作者设计，不等于本轮加载通过。

<a id="detail-section-4"></a>

### 效果、成本与限制

离线脱敏降低把秘密再发给模型审计的需要；作用是有限规则的兜底，不替代发布流程控制。

首次确定扫描根和规则，持续人工确认候选、轮换实际泄露凭据及处理误报；无外部请求费用，CPU/耗时及单位发布成本未测。

ok=true能否当发布干净证明？只表示扫描范围内未命中critical/high，dist/build等默认排除，单文件1MiB、前20000行和超过5000字符行的限制会漏掉实际发布物；扫描不强制拦截push且不读Git历史。若模型选错path，提示“必须调用”仍无完整覆盖保证。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对临时让模型阅读文件找秘密，增量是把固定规则、掩码与位置整理为DSH可调用工具，支持离线复核；正则秘密扫描与熵检测是既有方法，本插件不证明有新的检测算法。

scanner与patterns分离、敏感结果只留前6字符、lstat避免跟随symlink便于复用；截断与skip必须在可靠审计中升级为明确范围状态。

源码依据：[lib/index.js](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/index.js)、[lib/scanner.js](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js)、[lib/patterns.js](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/patterns.js)、[package.json](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/package.json)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：开发者在推送或外发前检查当前工作树的明显凭据，交付带位置、规则和掩码的候选发现供人处理。

- **建议**：待验证假设：让扫描输入绑定实际发布文件manifest及摘要，并把跳过/截断计入incomplete而非干净，可降低遗漏发布物的假安全感。由默认目录排除与行限制推导，未实现。把测试密钥分别放dist、长行、尾部和正常源码，对照manifest扫描与当前工具的遗漏率及误报处理时间；不能用零命中替代完整性。

适合发布前补查明显秘密；显式传项目路径，查看所有跳过项，再检查真实打包文件与Git历史，别把ok当无泄露保证。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认本地扫描与脱敏输出；未运行扫描或测召回，未来完整性门禁是假设。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：leak_guard扫描与规则清单。

- **思考**：ok=true能否当发布干净证明？只表示扫描范围内未命中critical/high，dist/build等默认排除，单文件1MiB、前20000行和超过5000字符行的限制会漏掉实际发布物；扫描不强制拦截push且不读Git历史。若模型选错path，提示“必须调用”仍无完整覆盖保证。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对临时让模型阅读文件找秘密，增量是把固定规则、掩码与位置整理为DSH可调用工具，支持离线复核；正则秘密扫描与熵检测是既有方法，本插件不证明有新的检测算法。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：0.1.1；版本日期：2026-10-18（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[8b578f80](https://github.com/7gzgn/dsh-leak-guard/tree/8b578f80898b80acc77285f3f4c095b433dda0a4)；本次截止 2026-10-21T03:36:14Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读入口、规则与扫描遍历/限额；未跑目标测试，无准确率、全历史或发布物覆盖验证。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：00debd5fe6ada168eb51c52f4d2b87112b33135756fa0d45da5169c2a8dfe3e7。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 760 | 587 | 113 | — |
| .md | source | 1 | 107 | — | — | 1050 |
| .mjs | test | 2 | 122 | 88 | 20 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：让扫描输入绑定实际发布文件manifest及摘要，并把跳过/截断计入incomplete而非干净，可降低遗漏发布物的假安全感。由默认目录排除与行限制推导，未实现。把测试密钥分别放dist、长行、尾部和正常源码，对照manifest扫描与当前工具的遗漏率及误报处理时间；不能用零命中替代完整性。

隔离合成数据覆盖长行、尾部、dist、占位符、symlink和大文件，记录跳过与真实发布manifest差异；当前不执行目标。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/7gzgn/dsh-leak-guard/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
