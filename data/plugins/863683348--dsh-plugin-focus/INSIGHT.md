# dsh-plugin-focus

> 将任务目标、约束与决策保存为工作区焦点板，并注入会话及展示面板。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[6aabf70](https://github.com/863683348/dsh-plugin-focus/tree/6aabf70615a191a14c7a1e25141b4d15560f3a47)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-focus) · [![npm 30d 876](https://img.shields.io/static/v1?label=npm+30d&message=876&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus) · [![首次发布 2026-08-17](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus)
<!-- END META -->

**使用建议**：适合单任务工作区先试。重要约束保持简短并检查是否被条目上限裁掉，多会话共用目录时先明确所有权；不要自动执行附带发布Skill。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、依赖与流程](#detail-section-3)
  - [成本与效果](#detail-section-4)
  - [工程亮点](#detail-section-5)
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

替代是手工FOCUS.md/AGENTS或todo；项目增加自动注入和投影，仍不能让提示内容变成硬执行约束。

<a id="detail-section-3"></a>

### 能力、依赖与流程

lib/index.js注册focus操作并经ctx.fs containment读写.dsh/focus.md；agent/pre-step读取并注入变更，focus/write投影供UI使用；board.js解析时间条目、标签和摘要。附带dsh-factory Skill是发布流程文档。 固定package.json的files仅包含lib、补丁及文档，未包含skills目录，也未声明Skill自动注册，故仓库中的dsh-factory不等于npm安装后可见。

- **模型工具**：focus set/get/append/summary/clear
- **事件监听**：agent/pre-step自动焦点板注入及focus/write投影
- **界面**：只读焦点板面板

宿主tools/fs/systemPrompt/agents、Schemastery和zod，可选sessionProjections及客户端；板和备份位于会话工作区。dsh-factory另依赖外部发布工具与授权。

set/append记录→写板并生成事件→每回合或变化时注入→summary回读→clear归档；发布Skill需另行明确调用与执行。

<a id="detail-section-4"></a>

### 成本与效果

首次需整理焦点目标和约束，持续支付注入token与板清理人工；共用目录并发要协调。附带发布Skill另需凭据和外部发布成本，本轮没有调用其流程。

可减少压缩后重复解释目标，但没有漂移率或长任务成功率对照。

<a id="detail-section-5"></a>

### 工程亮点

board纯解析/渲染与宿主fs分开，包含关系检查、clear归档和lastInjected去重值得借鉴；trim和共享文件写入语义需要比UI更优先验证。

源码依据：[lib/index.js](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/index.js)、[lib/board.js](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/lib/board.js)、[skills/dsh-factory/SKILL.md](https://github.com/863683348/dsh-plugin-focus/blob/6aabf70615a191a14c7a1e25141b4d15560f3a47/skills/dsh-factory/SKILL.md)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合长任务与压缩后容易忘记约束的开发者；焦点板固定目标而非替代待办清单。

- **建议**：待验证假设：将有效目标与硬约束作为稳定集合、普通发现作为有界日志，并以revision保护写入，可在不增加太多token下减少目标丢失。用超过60条记录、目标更新和双会话并发比较有效约束召回与覆盖冲突；若稳定集合积累过期约束，加入显式撤销状态。

适合单任务工作区先试。重要约束保持简短并检查是否被条目上限裁掉，多会话共用目录时先明确所有权；不要自动执行附带发布Skill。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：focus set/get/append/summary/clear
- **事件监听**：agent/pre-step自动焦点板注入及focus/write投影
- **界面**：只读焦点板面板

- **思考**：同工作区会话共享同一个板文件，读改写缺少锁或版本冲突处理，并发会话可能互相覆盖。trimEntries只保留最近maxEntries，早期硬约束也会被裁掉，自动注入并不保证目标保留；set在board.js实际追加而非替换旧目标。附带dsh-factory含npm发布、topic和PR等高副作用流程，不能把加载Skill当发布已执行或授权。 固定npm files排除skills目录，因此附带Skill还存在源码可见与打包可见的差异。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者提出durable focus board；实际增量是把目标与硬约束变成工作区可读Markdown，并自动在回合/变更时补入模型上下文。相比纯todo，强调不该漂移的信息；持久化和注入有代码实现，附带制造Skill则仅指导模型使用外部命令，不是自动发布服务。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[863683348/dsh-plugin-focus](https://github.com/863683348/dsh-plugin-focus)
- **版本号**：1.1.2（[固定提交 6aabf706](https://github.com/863683348/dsh-plugin-focus/tree/6aabf70615a191a14c7a1e25141b4d15560f3a47)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/board.js、skills/dsh-factory/SKILL.md、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：在复制工作区验证set重复、超60条重要约束、双会话写入、clear归档和压缩后注入；本轮不执行目标或附带Skill。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：将有效目标与硬约束作为稳定集合、普通发现作为有界日志，并以revision保护写入，可在不增加太多token下减少目标丢失。用超过60条记录、目标更新和双会话并发比较有效约束召回与覆盖冲突；若稳定集合积累过期约束，加入显式撤销状态。

在复制工作区验证set重复、超60条重要约束、双会话写入、clear归档和压缩后注入；本轮不执行目标或附带Skill。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：f04eae1656a47abae750e0fd9f0bb71152942073ad935c1411c1f744ed7e282f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 602 | — | — | 5337 |
| .js | source | 4 | 665 | 462 | 163 | — |
| .mjs | source | 1 | 30 | 18 | 6 | — |
| .mjs | test | 1 | 247 | 223 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-plugin-focus/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
