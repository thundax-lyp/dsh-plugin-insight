# dsh-ai-arcade

> 在 DSH 中提供双脑贪吃蛇和中国象棋，结合本地规则引擎与模型策略解说。

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)

分析版本：[877d80c](https://github.com/439436269-ctrl/dsh-ai-arcade/tree/877d80ccce081eb76343ddacfb591f6c404b8ddd)

<!-- BEGIN META -->
[![npm 30d 299](https://img.shields.io/static/v1?label=npm+30d&message=299&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ai-arcade) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ai-arcade)
<!-- END META -->

**使用建议**：娱乐用途可隔离试用并设调用预算；不要用游戏胜率或作者单机延迟数字选择生产模型。

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

已实现机制由固定源码支持；效果未独立实测，未来假设未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：希望在DSH内娱乐或观察模型策略表达的用户；合格结果是合法、流畅游戏而不是模型棋力基准。

采用建议：娱乐用途可隔离试用并设调用预算；不要用游戏胜率或作者单机延迟数字选择生产模型。

参照纯本地游戏与LLM直接出走法；本项目是拟人娱乐组合，不是新棋类搜索算法。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：贪吃蛇和中国象棋街机面板
- **后台**：宿主模型流调用及本地规则搜索

**流程与依赖**

依赖宿主llm和Web路由、游戏页面及浏览器；模型可选，失败时本地规则仍承担玩法。

打开iframe游戏→本地回合推进→按需请求brain→消费策略/说明→超时或错误显示并兜底；暂停交由本地游戏。

**效果与成本**

首次构建并配置可用模型；模型调用消耗token且可能因reasoning参数失败重试，持续游戏频率决定费用；本地渲染另占CPU。

本地规则与模型慢请求分离有助于体验稳定；娱乐满意度与模型增益未本轮实测。

- **思考**：模型真的影响胜负还是只增加拟人说明？作者明确本地引擎承担棋力，brain调用仅返回文本，合法性与具体行动还需客户端约束；模型延迟与失败时兜底让游戏可玩，却使胜率不能作为模型能力证据。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对让LLM逐帧直接控制游戏，贡献在快循环本地规则与慢循环模型意图分离；模型失联时保留可运行游戏。中国象棋棋力主要来自本地搜索，不能归为模型推理增强。

相对让LLM逐帧直接控制游戏，贡献在快循环本地规则与慢循环模型意图分离；模型失联时保留可运行游戏。中国象棋棋力主要来自本地搜索，不能归为模型推理增强。

resolveTarget先核实配置再发现可用provider；streamBrain区分finish错误并在reasoning参数拒绝时去掉参数重试一次。注释low与README off表述应由实际设置为准。 [固定源码](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/brain.js#L1)。

<a id="detail-section-5"></a>

### 主要限制

[核查分支](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/brain.js#L196)。

模型真的影响胜负还是只增加拟人说明？作者明确本地引擎承担棋力，brain调用仅返回文本，合法性与具体行动还需客户端约束；模型延迟与失败时兜底让游戏可玩，却使胜率不能作为模型能力证据。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/brain.js、src/client/games/xiangqi/ai.js、src/client/games/snake.js、lib/trust.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读指定核心源码与作者说明；未执行目标插件或测试、未安装或做真实宿主验收，未核实独立用户收益。
- 下一步：固定随机种子和对手，比较无模型、本地默认、模型策略三组的合法率/胜率/时延/费用；若采纳策略不改善结果则否定模型贡献假设。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-ai-arcade](https://github.com/439436269-ctrl/dsh-ai-arcade)
- **版本号**：0.1.0（[固定提交 877d80cc](https://github.com/439436269-ctrl/dsh-ai-arcade/tree/877d80ccce081eb76343ddacfb591f6c404b8ddd)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把策略卡可执行字段与解说分离，记录实际采纳比例，能检验模型是否提供超越本地默认策略的价值；代价是字段验证与策略回放记录。

固定随机种子和对手，比较无模型、本地默认、模型策略三组的合法率/胜率/时延/费用；若采纳策略不改善结果则否定模型贡献假设。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 115 | — | — | 1460 |
| .js | source | 18 | 3429 | 2234 | 948 | — |
| .mjs | test | 2 | 387 | 295 | 61 | — |
| .mjs | source | 2 | 194 | 145 | 35 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-ai-arcade/issues) 查看。

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)
