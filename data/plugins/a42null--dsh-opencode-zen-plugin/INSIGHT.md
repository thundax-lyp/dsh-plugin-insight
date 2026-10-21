# dsh-opencode-zen-plugin

> 把OpenCode Console模型目录与多种流式协议接入DSH模型选择和配置界面。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[e1d0054](https://github.com/A42Null/dsh-opencode-zen-plugin/tree/e1d0054333d5f8185f3d6e55f563e5fe91e19b29)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/A42Null/dsh-opencode-zen-plugin) · [![npm 30d 400](https://img.shields.io/static/v1?label=npm+30d&message=400&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a42null/dsh-opencode-zen-plugin)
<!-- END META -->

**使用建议**：适合已有Console账号的用户先对固定模型验证文本、工具和usage。目录出现不代表可用，保留原生provider回退。

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

- **用途**：持有Console API key的用户希望在DSH使用目录中的聊天模型，合格结果需文本、工具调用、usage和错误都正确映射。

- **建议**：由命名路由与回落推导，可为模型记录协议来源、元数据日期和最近能力探测状态，未知模型先标待确认。未验证；用新前缀/过期元数据/工具调用流测试，若仍把未验证项展示为完整支持则否定。

适合已有Console账号的用户先对固定模型验证文本、工具和usage。目录出现不代表可用，保留原生provider回退。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

手工配置OpenAI兼容地址更少代码但不能涵盖四协议；此插件承受目录与协议维护。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：周期同步模型目录和缓存元数据。
- **界面**：模型配置与选择接线。

**流程与依赖**

DSH llm provider注册、Console网络与授权，models.dev可选缓存；不同模型图像/工具/推理能力需独立核查。

保存key，拉目录与元数据，模型选择后按路由建请求，转换流并报告usage/错误；无事件时watchdog终止供用户处理。

**效果与成本**

配置key与资金，实际调用按服务收费，自动刷新/失败重试有开销；跨协议适配维护持续，无费用节省实测。

减少逐模型配置，但不提高模型本身能力或证明更低成本。

- **思考**：模型可选是否等于已兼容？apiForModel用名字路由、未知默认chat，目录离线可用静态回落；新模型协议变更或元数据过期会显示却不可调用。状态ok可与lastError并存，不能用目录非空认定服务健康。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相比手工逐模型配置，增量是动态目录、协议路由和错误分类一体化；模型能力与服务供给属于Console，上下文元数据来自外部目录。

相比手工逐模型配置，增量是动态目录、协议路由和错误分类一体化；模型能力与服务供给属于Console，上下文元数据来自外部目录。

协议builder/stream转换/watchdog分区、可操作错误分类可借鉴；单文件协议映射和模型命名例外是维护热点，静态元数据应标来源。 源码依据：[lib/index.js](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js)。

<a id="detail-section-5"></a>

### 主要限制

模型可选是否等于已兼容？apiForModel用名字路由、未知默认chat，目录离线可用静态回落；新模型协议变更或元数据过期会显示却不可调用。状态ok可与lastError并存，不能用目录非空认定服务健康。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[A42Null/dsh-opencode-zen-plugin](https://github.com/A42Null/dsh-opencode-zen-plugin)
- **版本号**：0.3.6（[固定提交 e1d00543](https://github.com/A42Null/dsh-opencode-zen-plugin/tree/e1d0054333d5f8185f3d6e55f563e5fe91e19b29)）
- **版本日期**：2026-10-04（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：固定模型分别验证四协议文本、工具增量、usage、错误和取消，模拟目录失败/未知ID/idle，检查不伪造支持状态。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由命名路由与回落推导，可为模型记录协议来源、元数据日期和最近能力探测状态，未知模型先标待确认。未验证；用新前缀/过期元数据/工具调用流测试，若仍把未验证项展示为完整支持则否定。

固定模型分别验证四协议文本、工具增量、usage、错误和取消，模拟目录失败/未知ID/idle，检查不伪造支持状态。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：bd216de8f156c6bae738d9a2a586b1a106b44ec47ef6ab3a03a82015bd36d854。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1716 | 1513 | 95 | — |
| .md | source | 2 | 370 | — | — | 4465 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/A42Null/dsh-opencode-zen-plugin/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/A42Null/dsh-opencode-zen-plugin/issues?q=is%3Aissue+created%3A2026-09-21T04%3A11%3A32.944Z..2026-10-21T04%3A11%3A32.944Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/A42Null/dsh-opencode-zen-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T04%3A11%3A32.944Z..2026-10-21T04%3A11%3A32.944Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
