# dsh-lighthouse

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[d72f8ac](https://github.com/7gzgn/dsh-lighthouse/tree/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：汇总本地作品、GitHub、npm 与 DSH 市场状态，提供工具、面板和报告卡片。

> **核心亮点**：相对作者逐个打开仓库/市场/PR，贡献是用显式作品名册组织采集并按待处理状态呈现，多入口共享结果减少口径漂移。平台指标是既有API，增量在跨源作品身份关联、报告与DSH界面，不是新采用度量。

> **风险与缺陷**：“有人用/留言”能否从面板指标直接判断？collectGitHub把open_issues_count作为留言，包含PR；下载也不是用户数。市场按work.name匹配、npm亦由名册name查询，同名未核实身份可误关联；API数字客观不等于解释正确，采集失败和缓存年龄还需保留。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、流程与依赖](#detail-section-3)
  - [1.3 效果、成本与限制](#detail-section-4)
  - [1.4 核心贡献与工程亮点](#detail-section-5)
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

维护多个插件的作者查看哪些仓库、收录PR或发布状态需要处理，交付时间相关的状态表而非真实用户采用证明。

参照浏览器逐站查询和脚本报表；不把API采集替代独立采用调查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与依赖

collect读取fleet作品名册并采集本地/GitHub/市场/npm；registry按fetch实例缓存5分钟，collectAll共享采集结果；index工具/只读status路由与client面板使用同一数据。

- **模型工具**：作品采集报告与名册管理工具。
- **Host 路由**：只读作品status接口。
- **界面**：侧栏观察面板与报告卡片。

Node文件API、GitHub/npm/本地市场HTTP、DSH webServer与槽位；私有仓库需用户token且本轮未读取。

维护fleet→读取本地版本→采集仓库/PR/市场/npm→关联作品→报告/面板排序→用户处理异常；失败保留原因。

host/client及CLI，DSH 0.2线声明；市场URL可由webServer origin推导，需市场服务存在；token可选用于GitHub配额。

<a id="detail-section-4"></a>

### 1.3 效果、成本与限制

把“哪里需要处理”集中在一屏有操作价值；仓库存在、收录和下载都不是插件可安装或业务收益的证明。

首次维护准确fleet和发布源身份，持续承担API限额、缓存与来源变化；查询成本以平台为准，节省人工时间未测。

“有人用/留言”能否从面板指标直接判断？collectGitHub把open_issues_count作为留言，包含PR；下载也不是用户数。市场按work.name匹配、npm亦由名册name查询，同名未核实身份可误关联；API数字客观不等于解释正确，采集失败和缓存年龄还需保留。

<a id="detail-section-5"></a>

### 1.4 核心贡献与工程亮点

相对作者逐个打开仓库/市场/PR，贡献是用显式作品名册组织采集并按待处理状态呈现，多入口共享结果减少口径漂移。平台指标是既有API，增量在跨源作品身份关联、报告与DSH界面，不是新采用度量。

采集函数可注入fetch、registry一次读取并缓存、多入口共用结果有借鉴处；同名匹配与openIssues口径必须与UI文案一致。

源码依据：[lib/index.js](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/index.js)、[lib/collect.js](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/collect.js)、[lib/fleet.js](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/lib/fleet.js)、[client.js](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/client.js)、[package.json](https://github.com/7gzgn/dsh-lighthouse/blob/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb/package.json)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：维护多个插件的作者查看哪些仓库、收录PR或发布状态需要处理，交付时间相关的状态表而非真实用户采用证明。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **模型工具**：作品采集报告与名册管理工具。
- **Host 路由**：只读作品status接口。
- **界面**：侧栏观察面板与报告卡片。

> **思考**：“有人用/留言”能否从面板指标直接判断？collectGitHub把open_issues_count作为留言，包含PR；下载也不是用户数。市场按work.name匹配、npm亦由名册name查询，同名未核实身份可误关联；API数字客观不等于解释正确，采集失败和缓存年龄还需保留。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：相对作者逐个打开仓库/市场/PR，贡献是用显式作品名册组织采集并按待处理状态呈现，多入口共享结果减少口径漂移。平台指标是既有API，增量在跨源作品身份关联、报告与DSH界面，不是新采用度量。

<a id="detail-section-9"></a>

### 1.8 使用建议

维护多个作品的人可先录入少量明确身份条目；核对npm包、市场项和PR来源，再用异常排序安排人工检查，不以下载/星数认定真实采用。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认聚合与统一展示；未访问被监控平台或运行宿主，数据正确性与真实采用未验证，未来证据口径卡是假设。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.3.3；版本日期：2026-10-19（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[d72f8acf](https://github.com/7gzgn/dsh-lighthouse/tree/d72f8acf3009712bd1a9d536a4d2f9ccd13ac1cb)；本次截止 2026-10-21T03:36:14Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读采集、名册验证、工具/路由、报告与client；未实际采集或核实各作品身份。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d084a3cc95077c30e25d8e435778339756b583c9c33955482906bcfe40d162bb。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 131 | 106 | 12 | — |
| .js | source | 6 | 1914 | 1460 | 347 | — |
| .md | source | 1 | 168 | — | — | 1752 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：每个指标保存明确对象ID、时间窗口、来源与含义，并把身份不匹配转unknown，可减少跨源同名误关联与热度冒充采用。依据是name关联和混合指标口径，未实现完整证据卡。以同名npm、仓库PR充当issues、缓存过期三类对照，测误判与排障时间；缺独立采用证据时明确未知。

用固定fixture核对同名对象、API失败、PR/Issue口径、缓存年龄与大名册排序，再隔离host验收；本轮未执行。

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/7gzgn/dsh-lighthouse/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
