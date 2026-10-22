# dsh-model-auto-enricher

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[4c18dc2](https://github.com/66rapper/dsh-model-auto-enricher/tree/4c18dc2a231f336a31d49dccfff9606edc6456c9)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/66rapper/dsh-model-auto-enricher)
<!-- END META -->

> **实现功能**：按模型名称规则补写Profile中的上下文、输出、模态与思考档位配置。

> **核心亮点**：作者称自动补齐最佳模型状态；源码可确认的是规则驱动批量配置、预览、备份与幂等检测，减少逐项输入。相对手工编辑，自动化明确；但这不是实际能力发现，规则高估能力会把配置便利变成不可用请求，不能把宣告能力当真实提升。

> **风险与缺陷**：核心假设是名称正则能可靠推出实际渠道能力，源码没有端点探测，未知模型反而默认百万上下文、图片及max思考档位。只升不降保留错误高值，可能阻止纠错；备份只能恢复文件，不能证明语义安全。YAML主体重序列化也非全文件注释保真。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、依赖与流程](#detail-section-3)
  - [1.3 成本与效果](#detail-section-4)
  - [1.4 工程亮点](#detail-section-5)
  - [1.5 用途与适用场景](#detail-section-6)
  - [1.6 能力、流程与成本](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 使用建议](#detail-section-9)
  - [1.9 核查说明与分析版本](#detail-section-10)
- [2 未来设计假设（未验证）](#detail-section-11)
- [3 辅助信息](#detail-section-12)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 场景与替代办法

替代是按官方或端点规格手工设置，或使用实际能力目录；本项目批量规则降低操作量，但牺牲未知项的保守性。

<a id="detail-section-3"></a>

### 1.2 能力、依赖与流程

lib/core.js解析cordis.patch.yml，按id/name正则选择系列规则，未知名落入1M/64k/image与推理兜底；只升不降合并字段，写前备份并重序列化YAML；lib/index.js监听设置保存后自动执行。

- **后台**：监听模型设置保存并批量补写YAML
- **界面**：配置预览与补齐面板

宿主connection/settings及Profile YAML；js-yaml通过候选路径或裸模块加载，默认定位desktop Profile，可用环境变量指定。

保存模型设置→防抖监听→解析所有provider模型→名称规则计划→备份→写YAML→热载；错误规则需要人工恢复并防止再次自动写回。

<a id="detail-section-4"></a>

### 1.3 成本与效果

首次备份与核实每个实际端点规格；持续成本包括无效大请求、错误多模态调用和文件重写复核。现金随供应商失败/长输入计费，人工恢复成本可能超过省下的点选时间。

能减少机械编辑，但正确配置率未经验证；对未知或受限中转端点可能造成负价值。

<a id="detail-section-5"></a>

### 1.4 工程亮点

inspect/dryRun与planModel分离、写前copy和字段合并便于审阅；规则集中利于维护。自动watch写回与猜测能力耦合是关键短板，可借鉴规划层而应替换推断来源。

源码依据：[lib/core.js](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/core.js)、[lib/index.js](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/index.js)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：面向批量添加模型渠道的DSH用户，目的是减少逐模型编辑；正确交付应是与真实端点能力匹配的配置。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **后台**：监听模型设置保存并批量补写YAML
- **界面**：配置预览与补齐面板

> **思考**：核心假设是名称正则能可靠推出实际渠道能力，源码没有端点探测，未知模型反而默认百万上下文、图片及max思考档位。只升不降保留错误高值，可能阻止纠错；备份只能恢复文件，不能证明语义安全。YAML主体重序列化也非全文件注释保真。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：作者称自动补齐最佳模型状态；源码可确认的是规则驱动批量配置、预览、备份与幂等检测，减少逐项输入。相对手工编辑，自动化明确；但这不是实际能力发现，规则高估能力会把配置便利变成不可用请求，不能把宣告能力当真实提升。

<a id="detail-section-9"></a>

### 1.8 使用建议

不宜直接让自动补齐改生产Profile。先用配置副本预览，并逐项按供应商实际规格核对；未知模型保留未知，备份和幂等都不能替代能力验证。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[66rapper/dsh-model-auto-enricher](https://github.com/66rapper/dsh-model-auto-enricher)
- **版本号**：2.0.0（[固定提交 4c18dc2a](https://github.com/66rapper/dsh-model-auto-enricher/tree/4c18dc2a231f336a31d49dccfff9606edc6456c9)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/core.js、lib/index.js、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：在复制Profile核对小窗口纯文本模型、未知别名、手动降值、注释和多次保存；应比较真实请求而非只看YAML字段变大，本轮未执行。

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：以保守未知值、端点能力来源和用户确认差异取代旗舰兜底，可减少配置后的请求失败。收集已知小窗口、纯文本和未知模型的脱敏配置，比较规则版与保守确认版的错误声明、编辑时间及回滚率；若无改善则否定。

在复制Profile核对小窗口纯文本模型、未知别名、手动降值、注释和多次保存；应比较真实请求而非只看YAML字段变大，本轮未执行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：f3774fb6fd6ea21a753eebd614cdc67e5e63f8cfd4ee33c7f18515c7049f56c5。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 2031 | 1640 | 246 | — |
| .md | source | 2 | 180 | — | — | 3102 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/66rapper/dsh-model-auto-enricher/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/66rapper/dsh-model-auto-enricher/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/66rapper/dsh-model-auto-enricher/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
