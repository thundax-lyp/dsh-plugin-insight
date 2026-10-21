# dsh-wsl-vllm

> 为 DSH 提供本机或 Docker vLLM 服务状态与对话补全工具。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[e42e1dc](https://github.com/173787247/dsh-wsl-vllm/tree/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-vllm)
<!-- END META -->

**使用建议**：适合已有 vLLM 服务的人做少量文本任务试用；先查 reachable 和 model，长提示自行拆分，不把 status.ok 当服务健康或完整回答保证。

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

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

[重点创新推演与最小验证](#innovation)

- **用途**：已运行 vLLM 的开发者让当前 Agent 调用另一个本地模型生成文本，以模型回复和 usage 为交付。

采用建议：适合已有 vLLM 服务的人做少量文本任务试用；先查 reachable 和 model，长提示自行拆分，不把 status.ok 当服务健康或完整回答保证。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：vllm_status、vllm_chat

**流程与依赖**

Node≥18 fetch、DSH、可达 OpenAI兼容 vLLM 服务及模型必要；API key 依部署而定；本插件不安装 GPU/CUDA/容器。

配置 baseUrl/defaultModel/key→status 列模型→chat→人工验收文本；超时只中止HTTP等待，服务端任务状态需另查。

**效果与成本**

本地GPU/内存/模型部署维护与宿主模型调用均计成本；无当前价格与负载测量，不给节约比例。

减少手写接口请求，适合低耦合第二模型工具；无法证明自托管经济性或输出质量。

- **思考**：核心问题是工具级第二次模型调用是否增加合格交付。status 的 ok:true 可同时 reachable:false；prompt 超32,000字符静默切片，可能丢关键尾部，不返回截断标记。无任务级评估不能说替代云模型成本更低。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对直接 curl OpenAI 兼容端点，增量是 DSH 状态/调用工具和错误归一；不是宿主模型供应商注册，也未实现 vLLM 部署、调度或推理优化。

相对直接 curl OpenAI 兼容端点，增量是 DSH 状态/调用工具和错误归一；不是宿主模型供应商注册，也未实现 vLLM 部署、调度或推理优化。

lib/client.js 依赖注入 fetchImpl 和 finally清定时器便于验证HTTP行为；返回 usage 可用于记账，仍需把截断与服务端取消责任显式化。 源码：[index.js](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/index.js)、[lib/client.js](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/lib/client.js)、[test/client.test.js](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/test/client.test.js)。

<a id="detail-section-5"></a>

### 主要限制

核心问题是工具级第二次模型调用是否增加合格交付。status 的 ok:true 可同时 reachable:false；prompt 超32,000字符静默切片，可能丢关键尾部，不返回截断标记。无任务级评估不能说替代云模型成本更低。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/client.js、test/client.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 e42e1dc23a89ea7cc87474dcd5d8c610b37c651b，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：用可控服务记录短/长提示和HTTP失败，对照输入字节、错误状态及实际输出；再同任务比较直接宿主模型与vLLM工具路径的合格率、GPU时间和复核时间。

**分析版本**

- **仓库**：[173787247/dsh-wsl-vllm](https://github.com/173787247/dsh-wsl-vllm)
- **版本号**：0.1.0（[固定提交 e42e1dc](https://github.com/173787247/dsh-wsl-vllm/tree/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

未形成新机制假设：当前是窄 HTTP 适配。优先增加输入截断显式状态并评估第二模型的端到端价值，证据不足以提出新的推理优化主张。

用可控服务记录短/长提示和HTTP失败，对照输入字节、错误状态及实际输出；再同任务比较直接宿主模型与vLLM工具路径的合格率、GPU时间和复核时间。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 109 | — | — | 451 |
| .js | source | 2 | 166 | 155 | 3 | — |
| .js | test | 1 | 16 | 15 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-vllm/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
