# dsh-plugin-audit

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[e5c9c5d](https://github.com/863683348/dsh-plugin-audit/tree/e5c9c5df08a56a23e37966640390d07052fcc9a6)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-audit) [![npm 30d 821](https://img.shields.io/static/v1?label=npm+30d&message=821&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-audit) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-audit)
<!-- END META -->

> **实现功能**：同步插件目录与元数据，生成健康评分、静态扫描报告和榜单。

> **核心亮点**：作者提出生态体检及高危否决；实际增量是把有界同步、历史Star信号、静态发现和本地榜单连起来，便于维护者优先排查。相对只看Star，增加安全线索；高分仍主要是维护和包装代理信号，不是插件运行质量。

> **风险与缺陷**：guessPackageName按仓库短名探测npm，可能把同名其他作者包绑定给仓库。scanner读取HEAD树后再取contents默认分支，没有固定commit绑定，多请求间可能混版本；有限入口抽样不能代表全仓库。评分中的README长度/推送/Star不能证明安全或采用，扫描失败为空材料不能等同零问题。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、依赖与流程](#detail-section-3)
  - [1.3 成本与效果](#detail-section-4)
  - [1.4 工程亮点](#detail-section-5)
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

替代是手工GitHub/npm核查或专业安全扫描器；项目擅长生态初筛，不能替代完整供应链与运行审计。

<a id="detail-section-3"></a>

### 1.2 能力、依赖与流程

lib/index.js注册audit工具及可选投影/定时；audit.js抓topic、猜包名探测npm并更新存储；scanner.js取HEAD树和有界关键文件；security.js用文本规则给发现，scoring.js按维护/文档/npm/生态打分。

- **模型工具**：audit_sync、audit_top、audit_plugin、audit_scan及趋势查询
- **界面**：实验性插件榜单面板
- **后台**：本地catalog/meta/history与可选定时同步

宿主tools为硬依赖，sessionProjections和schedule及客户端按功能可选；源码静态import zod，但本固定package.json未声明zod依赖，能否从宿主解析需另验。同步依赖GitHub/npm网络及本地DSH数据目录。

同步topic→探测npm并更新目录→重算健康分→按需扫关键文件→存发现/再评分→模型或面板查询；失败需保留范围及原值。

<a id="detail-section-4"></a>

### 1.3 成本与效果

首次配置GitHub token、存储与可选同步周期；持续消耗API和人工审阅每条发现，现金无固定费用依据。猜包和代理分误导可能增加选型返工，需计入收益。

能把大目录变成可筛线索，缺少误报漏报标注集与独立维护者效果数据。

<a id="detail-section-5"></a>

### 1.4 工程亮点

同步、存储、评分、扫描分层且fetch可注入，便于离线验证；扫描原件与固定版本绑定不足是重要复用代价。可选UI和schedule应单独检查实际挂载。

源码依据：[lib/index.js](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/index.js)、[lib/audit.js](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/audit.js)、[lib/scanner.js](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/scanner.js)、[lib/security.js](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/security.js)、[lib/scoring.js](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/scoring.js)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：适合生态维护者筛选需深入检查的仓库，交付物是本地目录和带信号的初筛报告。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **模型工具**：audit_sync、audit_top、audit_plugin、audit_scan及趋势查询
- **界面**：实验性插件榜单面板
- **后台**：本地catalog/meta/history与可选定时同步

> **思考**：guessPackageName按仓库短名探测npm，可能把同名其他作者包绑定给仓库。scanner读取HEAD树后再取contents默认分支，没有固定commit绑定，多请求间可能混版本；有限入口抽样不能代表全仓库。评分中的README长度/推送/Star不能证明安全或采用，扫描失败为空材料不能等同零问题。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：作者提出生态体检及高危否决；实际增量是把有界同步、历史Star信号、静态发现和本地榜单连起来，便于维护者优先排查。相对只看Star，增加安全线索；高分仍主要是维护和包装代理信号，不是插件运行质量。

<a id="detail-section-9"></a>

### 1.8 使用建议

适合作为候选体检面板。先核npm对应仓库与扫描固定版本，再读具体命中；高健康分和没发现模式都不能代替安装前源码复核。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[863683348/dsh-plugin-audit](https://github.com/863683348/dsh-plugin-audit)
- **版本号**：0.5.2（[固定提交 e5c9c5df](https://github.com/863683348/dsh-plugin-audit/tree/e5c9c5df08a56a23e37966640390d07052fcc9a6)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/audit.js、lib/scanner.js、lib/security.js、lib/scoring.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：用同名npm、限流分页、HEAD移动、缺入口及文档中的命令样本，检查身份、版本与误报；本轮不运行目标扫描。

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：先核实包仓身份并把所有被扫文件固定到同一SHA，再让报告显式显示未覆盖项，可减少误归因和虚假安全感。用同名异仓npm、移动HEAD和隐藏深层脚本样本比较误关联与漏报；无完整覆盖时只输出初筛状态。

用同名npm、限流分页、HEAD移动、缺入口及文档中的命令样本，检查身份、版本与误报；本轮不运行目标扫描。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：a5ec74a3c2795feb519067ce3762d327c432accb9c920ff857c059794337ace0。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1540 | 1258 | 202 | — |
| .md | source | 3 | 257 | — | — | 2416 |
| .mjs | source | 4 | 373 | 313 | 36 | — |
| .mjs | test | 8 | 726 | 661 | 31 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-plugin-audit/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
