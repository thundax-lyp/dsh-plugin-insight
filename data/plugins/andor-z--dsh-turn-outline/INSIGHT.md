# dsh-turn-outline

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[64fad2e](https://github.com/Andor-Z/dsh-turn-outline/tree/64fad2e2ecb71af1b78031989ff01d20ad25807b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Andor-Z/dsh-turn-outline) [![npm 30d 1,546](https://img.shields.io/static/v1?label=npm+30d&message=1%2C546&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-turn-outline) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-turn-outline)
<!-- END META -->

> **实现功能**：把DSH会话事件折叠为轮次轨迹，并在better-sidebar侧栏定位回聊天或轨迹视图。

> **核心亮点**：相对LLM生成标题大纲，增量是无模型事件折叠及结构化seq跳转，降低摘要幻觉与调用费；原会话与视图索引由宿主提供。

> **风险与缺陷**：零AI是否等于“无失败态/秒开”？历史分页、过期view、缺better-sidebar或路由拒绝都有条件；摘要只取末文本和工具预览，不能当完整审计。自建browser fence防跨站/DNS rebinding而非用户认证。

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

> **用途**：长会话用户回查某轮输入、工具与输出，合格导航应指向同一事件而非看似相似文本。

宿主原轨迹完整但回看费力；此插件做导航压缩，不生成新业务交付物。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：better-sidebar轮次轨迹与结构化定位。
- **Host 路由**：只读分页会话事件。
- **事件监听**：会话变化驱动增量刷新。

**流程与依赖**

DSH sessions/sessionQuery/webServer、uiConversation和better-sidebar；旧/新host能力探测决定定位路径。

订阅会话变化→分页取增量→折叠轮次→按工具筛选→加载历史并定位anchorSeq；缺peer时不注册tab。

**效果与成本**

无额外LLM费；首次侧栏依赖，持续事件缓存/浏览器渲染与升级回归成本，未测大日志延迟。

减少回看滚动成本的机制合理，未有实测时间收益。

> **思考**：零AI是否等于“无失败态/秒开”？历史分页、过期view、缺better-sidebar或路由拒绝都有条件；摘要只取末文本和工具预览，不能当完整审计。自建browser fence防跨站/DNS rebinding而非用户认证。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对LLM生成标题大纲，增量是无模型事件折叠及结构化seq跳转，降低摘要幻觉与调用费；原会话与视图索引由宿主提供。

相对LLM生成标题大纲，增量是无模型事件折叠及结构化seq跳转，降低摘要幻觉与调用费；原会话与视图索引由宿主提供。

pure事件折叠、live/cold路径和有界LRU分开可借鉴；不能将粗摘要或信任fence解释为完整内容/认证保证。 源码依据：[src/index.ts](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/index.ts)、[src/trail-model.ts](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/trail-model.ts)、[src/client/trail-jump.ts](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/trail-jump.ts)、[src/client/useTrail.ts](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/useTrail.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

零AI是否等于“无失败态/秒开”？历史分页、过期view、缺better-sidebar或路由拒绝都有条件；摘要只取末文本和工具预览，不能当完整审计。自建browser fence防跨站/DNS rebinding而非用户认证。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已用better-sidebar的长会话用户先试，核对压缩前历史和并行工具的定位；重大追溯仍查看完整日志。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[Andor-Z/dsh-turn-outline](https://github.com/Andor-Z/dsh-turn-outline)
- **版本号**：0.3.1（[固定提交 64fad2e2](https://github.com/Andor-Z/dsh-turn-outline/tree/64fad2e2ecb71af1b78031989ff01d20ad25807b)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/trail-model.ts、src/client/trail-jump.ts、src/client/useTrail.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读src/index.ts、src/trail-model.ts、src/client/trail-jump.ts、src/client/useTrail.ts；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：用长日志含steering/compaction/并行call和重复文本，核对边界/跳转seq、缓存上限及缺peer禁用；不把测试声明当本轮运行。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由seq定位与折叠推导，可在摘要显示覆盖范围/被折叠事件数，并验证点击目标seq与当前展示一致。未验证；压缩、steering、并行工具和加载旧页时测误跳及遗漏，错误不得默默跳近似位置。

用长日志含steering/compaction/并行call和重复文本，核对边界/跳转seq、缓存上限及缺peer禁用；不把测试声明当本轮运行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：4b322525ef8927f4b4938e0e13beb2c17627968f09987ec298a8126438d9a25e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 85 | 61 | 15 | — |
| .md | source | 3 | 368 | — | — | 5329 |
| .tsx | source | 2 | 720 | 584 | 85 | — |
| .ts | source | 9 | 2891 | 2315 | 409 | — |
| .tsx | test | 2 | 375 | 302 | 45 | — |
| .ts | test | 4 | 1281 | 1121 | 64 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Andor-Z/dsh-turn-outline/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
