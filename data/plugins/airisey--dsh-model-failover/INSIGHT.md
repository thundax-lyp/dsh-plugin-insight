# 模型接力

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[3221de6](https://github.com/Airisey/dsh-model-failover/tree/3221de6a1c9a02333f78e48449fcc272e1b430c0)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Airisey/dsh-model-failover)
<!-- END META -->

> **实现功能**：把已接入 DSH 的模型组成候选队列，失败时重试、轮换并记录会话隔离。

> **核心亮点**：相较盲目重试整条请求，明确“已提交内容”的边界，避免在模型开始产出后静默换人；分开候选故障和整轮截断，隔离按会话/模板而非全局误伤。贡献是失败恢复取舍与宿主集成，不能把字节产出当任务完成。

> **风险与缺陷**：自动“继续”是否仍是用户授权的同一任务？轮级hook对全部DSH模型生效，构造source.kind=user，看起来与人亲发相同；一次错误可能发生在已有工具副作用后，重启一轮并不具任务幂等。adapter将非空text/tool delta当提交能减少混流，却不能证明答案合格；隔离跨日清空也不代表凭证/配额已恢复。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多模型渠道的用户希望额度/上游故障时继续任务；合格交付是任务正确完成，而不是某个模型开始输出。

宿主重试、手动切模型或网关fallback；本项在宿主chunk与turn两层补恢复策略，但原任务验收仍需外部。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Host 路由**：模型目录、模板/隔离及会话运行说明管理API。
- **事件监听**：整轮结束/开始触发自动继续状态机。
- **后台**：注册model-failover adapter执行候选重试与会话隔离。

**流程与依赖**

注册model-failover adapter，队列模板成为可选模型；候选流在出现可见文本或工具调用前缓冲，提交后不在本次流切换。health按会话/模板记录隔离，JSON持久化；另监听整轮结局，在错误/max-tokens时按分开上限followup继续，对所有模型会话生效。

DSH llm adapter、会话事件/Agent followup、已接入模型和可写state；Web settings/HTTP为可选管理面。

选队列→缓冲候选流→无输出失败重试/隔离/换候选→有内容提交→整轮结束另判断续轮→到上限等待人；停止与部分配置错误不续轮。

DSH adapter/bundle加Web设置，复用已经配置的providers；不提供新模型账号，配置/health/log写独立DSH_HOME目录。

**效果与成本**

现金包括同模型再试、备用调用与自动续轮全部token；人工配置模型/推理档、核对重复副作用和隔离误判。概念容错不能直接推出更省钱。

可能减少上游无输出中断和手动换模型；不保证任务完成、模型质量或总成本改善。

> **思考**：自动“继续”是否仍是用户授权的同一任务？轮级hook对全部DSH模型生效，构造source.kind=user，看起来与人亲发相同；一次错误可能发生在已有工具副作用后，重启一轮并不具任务幂等。adapter将非空text/tool delta当提交能减少混流，却不能证明答案合格；隔离跨日清空也不代表凭证/配额已恢复。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相较盲目重试整条请求，明确“已提交内容”的边界，避免在模型开始产出后静默换人；分开候选故障和整轮截断，隔离按会话/模板而非全局误伤。贡献是失败恢复取舍与宿主集成，不能把字节产出当任务完成。

相较盲目重试整条请求，明确“已提交内容”的边界，避免在模型开始产出后静默换人；分开候选故障和整轮截断，隔离按会话/模板而非全局误伤。贡献是失败恢复取舍与宿主集成，不能把字节产出当任务完成。

主动向宿主声明maxRetries=0避免双重队列重试；提前中断向下游iterator.return传播取消；配置与隔离运行事实分文件，原子写仅单文件非多进程事务。

固定源码依据：[index.js](https://github.com/Airisey/dsh-model-failover/blob/3221de6a1c9a02333f78e48449fcc272e1b430c0/index.js)、[lib/adapter.js](https://github.com/Airisey/dsh-model-failover/blob/3221de6a1c9a02333f78e48449fcc272e1b430c0/lib/adapter.js)、[lib/autocontinue.js](https://github.com/Airisey/dsh-model-failover/blob/3221de6a1c9a02333f78e48449fcc272e1b430c0/lib/autocontinue.js)、[lib/store.js](https://github.com/Airisey/dsh-model-failover/blob/3221de6a1c9a02333f78e48449fcc272e1b430c0/lib/store.js)、[package.json](https://github.com/Airisey/dsh-model-failover/blob/3221de6a1c9a02333f78e48449fcc272e1b430c0/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动“继续”是否仍是用户授权的同一任务？轮级hook对全部DSH模型生效，构造source.kind=user，看起来与人亲发相同；一次错误可能发生在已有工具副作用后，重启一轮并不具任务幂等。adapter将非空text/tool delta当提交能减少混流，却不能证明答案合格；隔离跨日清空也不代表凭证/配额已恢复。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有多模型且主要做可复核任务时可评估；涉及不可重复动作或不希望插件代发用户消息时，应先明确自动续轮范围和来源。

核查状态：缓冲提交点、隔离与自动续轮源码支持；端到端恢复正确性、成本和真实渠道效果未测。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：1.0.0；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[3221de6a](https://github.com/Airisey/dsh-model-failover/tree/3221de6a1c9a02333f78e48449fcc272e1b430c0)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根adapter提交/重试、autocontinue来源/次数、store和入口注册；未核每家模型错误协议、真实账号或UI兼容。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

把续轮标成插件来源并绑定原turn、错误种类与已完成工具副作用账本，要求未知副作用先查结果而非重发，可能减少重复执行和授权混淆。对工具已成功但响应丢失、纯文本截断、用户停止和用户新输入对照，测重复动作与不当续轮率；若只多发继续且无副作用状态，则不能称业务恢复。

未执行。最小验证固定错误序列与副作用结果未知案例，分别记录换模型、输出提交、重复动作和真实调用成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 4599 | 2922 | 1376 | — |
| .md | source | 1 | 255 | — | — | 5452 |
| .mjs | test | 4 | 4533 | 3596 | 421 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Airisey/dsh-model-failover/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
