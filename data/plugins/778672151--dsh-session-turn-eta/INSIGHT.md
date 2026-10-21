# dsh-session-turn-eta

> 根据DSH会话的轮次与步骤历史估计当前轮剩余时间，并在输入框下显示进度。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b5cdc8e](https://github.com/778672151/dsh-session-turn-eta/tree/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/778672151/dsh-session-turn-eta)
<!-- END META -->

**使用建议**：适合把进度当粗略等待提示的用户先试用。先用不同长度与中断任务看误差，不据百分比决定是否已经交付；需要可靠截止时间的任务暂不能依赖它。

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

- **用途**：等待长Agent任务的用户需要知道是否继续等待；合格交付是可校准的剩余时间和清晰结束状态，百分比动画本身不代表任务完成比例。

- **建议**：由纯事件投影与现有区间输出推导，可按工具等待/模型生成等步骤类型分别估计，并在分布漂移时降低显示置信度或只显示区间。相对持续延长总时长，这可能降低过度确定感；未验证。用按时间留出的混合任务校准区间覆盖率与用户等待决策，若覆盖不改善则保留简单模型。

适合把进度当粗略等待提示的用户先试用。先用不同长度与中断任务看误差，不据百分比决定是否已经交付；需要可靠截止时间的任务暂不能依赖它。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

仅显示elapsed无需预测假设；估计条提供更多等待信息，但也引入校准义务。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：输入框下显示ETA和结束状态。
- **事件监听**：注册turnEta事件投影。

**流程与依赖**

依赖session-projection事件与客户端dock席位，效果依赖本会话可比历史；冷启动或工作负载变更时证据不足。

轮开始后投影累积step事件估计剩余时间，客户端本地计时展示；turn结束才显示完成/中断，用户依据真实任务结果验收。

**效果与成本**

无新增模型调用或外部服务，投影缓存与本地UI刷新增加少量计算；首次核对投影API和dock席位，误估可能带来等待决策成本，未量化。

使等待状态更可见，不增加任务成功能力；没有预测误差、区间校准和用户节省时间的独立结果。

- **思考**：历史步骤能否预测未来步骤数量和耗时？predict.ts首次步数先验为10，长任务超出历史时增加runway，混合速率仍无法看到未知工具等待；README称中位历史时长，而实现RATE_PERCENTILE为0.4。故动态百分比是模型估计，不是业务里程碑，失败轮也混入历史可能改变分布。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对仅显示已耗时或固定假进度条，增量是用会话自身历史做稳健速率与长度估计，纯投影不改会话事实。中位数/分位数是成熟统计，贡献在适配可重放事件与不提前宣告完成的显示约束。

相对仅显示已耗时或固定假进度条，增量是用会话自身历史做稳健速率与长度估计，纯投影不改会话事实。中位数/分位数是成熟统计，贡献在适配可重放事件与不提前宣告完成的显示约束。

预测数学独立于投影与UI、严格状态schema和按对象缓存view值得借鉴。移植需对齐事件时钟与终止语义，bootstrap和固定分位参数应被当作待校准选择而非通用真值。 源码依据：[src/predict.ts](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/predict.ts)、[src/projection.ts](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/projection.ts)、[src/client/chat/TurnProgress.tsx](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/client/chat/TurnProgress.tsx)。

<a id="detail-section-5"></a>

### 主要限制

历史步骤能否预测未来步骤数量和耗时？predict.ts首次步数先验为10，长任务超出历史时增加runway，混合速率仍无法看到未知工具等待；README称中位历史时长，而实现RATE_PERCENTILE为0.4。故动态百分比是模型估计，不是业务里程碑，失败轮也混入历史可能改变分布。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[778672151/dsh-session-turn-eta](https://github.com/778672151/dsh-session-turn-eta)
- **版本号**：0.2.0（[固定提交 b5cdc8ec](https://github.com/778672151/dsh-session-turn-eta/tree/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/predict.ts、src/projection.ts、src/client/chat/TurnProgress.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：留出正常/工具长等候/中断/冷启动轮次，比较固定历史中位与当前模型的绝对误差、区间覆盖和提前100%次数。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由纯事件投影与现有区间输出推导，可按工具等待/模型生成等步骤类型分别估计，并在分布漂移时降低显示置信度或只显示区间。相对持续延长总时长，这可能降低过度确定感；未验证。用按时间留出的混合任务校准区间覆盖率与用户等待决策，若覆盖不改善则保留简单模型。

留出正常/工具长等候/中断/冷启动轮次，比较固定历史中位与当前模型的绝对误差、区间覆盖和提前100%次数。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：fa54d95226bf1b866faac499b17854496bc06674cda93dc6779db7da4a52d146。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 283 | — | — | 1713 |
| .js | source | 2 | 676 | 526 | 156 | — |
| .tsx | source | 1 | 148 | 92 | 43 | — |
| .ts | source | 8 | 895 | 633 | 202 | — |
| .mjs | test | 3 | 299 | 268 | 8 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/778672151/dsh-session-turn-eta/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
