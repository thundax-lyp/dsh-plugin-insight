# dsh-stock-market

> 为DSH提供沪深A股行情侧栏与股票数据工具，按会话控制工具访问并标注多源回退口径。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[02278af](https://github.com/AnacondaKC/dsh-stock-market/tree/02278af12330102c534c843a668d1c8407dbde1b)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)
<!-- END META -->

**使用建议**：适合只读资料研究，先交叉核对报价时点和来源，降级结果分开用。商业或高频场景先确认数据授权与服务条件。

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

- **用途**：研究者查询公开市场资料，需要来源、时点和指标口径可追溯；行情数据不是交易建议或成交能力。

- **建议**：由degraded元数据推导，可对每种研究任务声明所需字段/时效/口径契约，回退不满足时拒绝产出可比指标而保留原始差异。未验证；故障换源时比较结论一致性、错误混算和人工复核时间。

适合只读资料研究，先交叉核对报价时点和来源，降级结果分开用。商业或高频场景先确认数据授权与服务条件。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

原网站/授权行情服务更直接可核；插件统一接口但不能统一所有源的统计定义。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：行情、走势、排行、资金流、财务、事件、研报和资讯业务动作。
- **界面**：行情侧栏与会话工具开关。
- **事件监听**：持久访问选择及工具执行拒绝。

**流程与依赖**

DSH agents/connection/tools/settings、固定财经网站与GBK解码；站点变更会破坏解析，关闭总开关仍保留配置RPC。

打开会话工具→选择业务动作→固定源请求/有限回退→返回来源与降级标识→人工核对→关闭后目录与执行同时拒绝。

**效果与成本**

首次构建/工作区链接与指标口径学习，持续请求与模型分析/复核成本；无key不等于免费稳定业务服务。

可减少数据检索接线，研究结论质量依赖时效/口径复核，未测收益。

- **思考**：自动换源能否维持同一数据语义？源码已标成交额缺失、成交量和排行范围差异，说明成功响应未必可直接横比。免费/免登录可调用不代表授权商业复用或稳定SLA，本轮未接入验证实时性。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对任意网页抓取或57端点直接暴露，增量是业务动作收敛、来源差异显式化与会话级真实执行拒绝；数据内容来自公开财经站点，不归插件。

相对任意网页抓取或57端点直接暴露，增量是业务动作收敛、来源差异显式化与会话级真实执行拒绝；数据内容来自公开财经站点，不归插件。

持久会话开关配双执行拒绝、固定Host参数和取消保持队列顺序有价值；口径警告需一直传到最终结论。 源码依据：[src/index.ts](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/index.ts)、[src/stock-tool-access.ts](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-tool-access.ts)、[src/stock-agent-service.ts](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-agent-service.ts)、[src/stock-api/request-control.ts](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-api/request-control.ts)、[src/stock-tools.ts](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-tools.ts)。

<a id="detail-section-5"></a>

### 主要限制

自动换源能否维持同一数据语义？源码已标成交额缺失、成交量和排行范围差异，说明成功响应未必可直接横比。免费/免登录可调用不代表授权商业复用或稳定SLA，本轮未接入验证实时性。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AnacondaKC/dsh-stock-market](https://github.com/AnacondaKC/dsh-stock-market)
- **版本号**：0.2.0（[固定提交 02278af1](https://github.com/AnacondaKC/dsh-stock-market/tree/02278af12330102c534c843a668d1c8407dbde1b)）
- **版本日期**：2026-08-13（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/stock-tool-access.ts、src/stock-agent-service.ts、src/stock-api/request-control.ts、src/stock-tools.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读src/index.ts、src/stock-tool-access.ts、src/stock-agent-service.ts、src/stock-api/request-control.ts、src/stock-tools.ts；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：固定响应模拟不同源缺字段/限流/取消，伪造关闭后调用应拒绝；用已知日期样本核对同口径，不访问真实账户。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由degraded元数据推导，可对每种研究任务声明所需字段/时效/口径契约，回退不满足时拒绝产出可比指标而保留原始差异。未验证；故障换源时比较结论一致性、错误混算和人工复核时间。

固定响应模拟不同源缺字段/限流/取消，伪造关闭后调用应拒绝；用已知日期样本核对同口径，不访问真实账户。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：9906abd449e467b727bcb47c5b46763ab9b6494f214c43330f0841e6ea04d39d。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 123 | — | — | 1470 |
| .mjs | source | 8 | 356 | 316 | 2 | — |
| .ts | source | 29 | 8421 | 7676 | 171 | — |
| .tsx | source | 7 | 2123 | 1953 | 12 | — |
| .ts | test | 11 | 2892 | 2135 | 589 | — |
| .tsx | test | 5 | 837 | 737 | 4 | — |

排除 2 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market/issues?q=is%3Aissue+created%3A2026-09-21T08%3A02%3A07.545Z..2026-10-21T08%3A02%3A07.545Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A02%3A07.545Z..2026-10-21T08%3A02%3A07.545Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
