# dsh-language-guard

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[9351078](https://github.com/58fly/dsh-language-guard/tree/9351078c5d264033c49d221742840aee673c0cdf)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-language-guard) · **脚本有更新，待重新洞察**
<!-- END META -->

> **实现功能**：以可配置提示片段、语言命令和周期提醒约束 DSH 输出语言。

> **核心亮点**：把重复的“用某语言回答”组织成可热配置的宿主提示策略；稳定section、纯语言解析和未设置哨兵让迁移不覆盖老用户语言。增量是配置/装配机制，不是模型语言能力，也不能因文案声称最高优先级就获得更高指令权限。

> **风险与缺陷**：约束是否作用在正确会话与正确层级？state.js的languageOverride为模块单值，/language处理器不接session ID，所谓“本会话”临时切换可能影响同进程其他会话。mapPreference把所有zh映成zh-CN；head还要求覆盖AGENTS/用户语言并不解释冲突。D档虽标notice而非冒充真实用户，仍额外进入模型上下文；无法证明不可见推理遵守。

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

> **用途**：长对话含英文工具说明与代码时，用户希望固定回答语言；合格交付是保留原始代码/引用而让说明遵循目标语言。

手动提示、AGENTS语言约定或宿主系统提示即可表达偏好；本项减少重复配置，不另建语言检测或纠错模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **用户命令**：/language读取/设置/重置进程内语言覆盖。
- **事件监听**：提示section和agent/pre-step周期notice，设置更新刷新locale缓存。
- **界面**：设置表单投影及包声明client入口；未运行界面交互。

**流程与依赖**

head/mid/tail稳定section动态取语言与B/C/D强度；auto从settings locale.preference解析，manual保留配置，空串模式哨兵保护旧配置。D档在顶层会话的命中轮首step、真实输入存在时插入带language-guard来源的notice，并保留下游决策字段。

DSH system prompt、agent/pre-step、可选commands/settings、locale preference；无可靠Host系统语言信号时回退配置。

设置决定模式/强度→按locale缓存解析→prompt动态生成→D档命中轮提醒；/language仅写进程内覆盖，reset清除，重启不持久。

DSH Host/client bundle与固定package依赖；settings/commands懒注入，Schemastery不可解析时表单投影降级告警，不将npm统计当采用证据。

**效果与成本**

现金为额外提示token和可能的重复上下文；人工配置强度、繁简及任务例外。强度更高不等于准确率更高，缺漂移率/错误翻译/时间的对照。

减少手写语言提醒，配置迁移细节可复用；不保证内部推理语言、翻译质量或全程遵守。

> **思考**：约束是否作用在正确会话与正确层级？state.js的languageOverride为模块单值，/language处理器不接session ID，所谓“本会话”临时切换可能影响同进程其他会话。mapPreference把所有zh映成zh-CN；head还要求覆盖AGENTS/用户语言并不解释冲突。D档虽标notice而非冒充真实用户，仍额外进入模型上下文；无法证明不可见推理遵守。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把重复的“用某语言回答”组织成可热配置的宿主提示策略；稳定section、纯语言解析和未设置哨兵让迁移不覆盖老用户语言。增量是配置/装配机制，不是模型语言能力，也不能因文案声称最高优先级就获得更高指令权限。

把重复的“用某语言回答”组织成可热配置的宿主提示策略；稳定section、纯语言解析和未设置哨兵让迁移不覆盖老用户语言。增量是配置/装配机制，不是模型语言能力，也不能因文案声称最高优先级就获得更高指令权限。

cycle先next再按拥有的决策插入，spread保留startsRequestSeries等字段，首step/非空/幂等/顶层门控避免无输入循环；notice显式来源可区分真实用户。state的单例覆盖与命令会话宣称不一致是可追踪实现边界。

固定源码依据：[lib/index.js](https://github.com/58fly/dsh-language-guard/blob/9351078c5d264033c49d221742840aee673c0cdf/lib/index.js)、[lib/language.js](https://github.com/58fly/dsh-language-guard/blob/9351078c5d264033c49d221742840aee673c0cdf/lib/language.js)、[lib/cycle.js](https://github.com/58fly/dsh-language-guard/blob/9351078c5d264033c49d221742840aee673c0cdf/lib/cycle.js)、[lib/commands.js](https://github.com/58fly/dsh-language-guard/blob/9351078c5d264033c49d221742840aee673c0cdf/lib/commands.js)、[lib/state.js](https://github.com/58fly/dsh-language-guard/blob/9351078c5d264033c49d221742840aee673c0cdf/lib/state.js)、[lib/text.js](https://github.com/58fly/dsh-language-guard/blob/9351078c5d264033c49d221742840aee673c0cdf/lib/text.js)、[package.json](https://github.com/58fly/dsh-language-guard/blob/9351078c5d264033c49d221742840aee673c0cdf/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

约束是否作用在正确会话与正确层级？state.js的languageOverride为模块单值，/language处理器不接session ID，所谓“本会话”临时切换可能影响同进程其他会话。mapPreference把所有zh映成zh-CN；head还要求覆盖AGENTS/用户语言并不解释冲突。D档虽标notice而非冒充真实用户，仍额外进入模型上下文；无法证明不可见推理遵守。

<a id="detail-section-6"></a>

### 1.5 使用建议

有固定输出语言需求者可评估；多会话不同语言或任务需按项目规范切换语言时，先明确模块级临时覆盖与强制文案是否符合要求。

核查状态：提示装配与三态迁移机制可确认；语言遵守率、内部推理语言及token性价比未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.3.4；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[9351078c](https://github.com/58fly/dsh-language-guard/tree/9351078c5d264033c49d221742840aee673c0cdf)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根组件提示装配、文本、语言解析、状态、命令和周期注入；未核不可见推理语言或作者测量的漂移率收益。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

将临时覆盖改为session作用域、提示只约束用户可见输出且显式保留任务语言例外，可能在减少跨会话串扰的同时保持语言稳定。用两个会话分别设ja/zh-TW并交错提问，加入多语引文与用户要求翻译的反例，统计串扰和错误改写；若只隔离设置但输出漂移不变，应分别报告配置收益和模型效果。

未执行目标；最小验证应分别记录双会话串扰、繁体手动模式、混合代码引用的误翻译及每轮token，不以源码里的测试断言作通过结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 33 | 11136 | — | — | 159119 |
| .js | source | 7 | 2440 | 1693 | 560 | — |
| .mjs | source | 7 | 1785 | 1324 | 264 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/58fly/dsh-language-guard/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
