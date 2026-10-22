# dsh-capmap-viz

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[49228e5](https://github.com/1741505640/capmap-skills/tree/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1741505640/capmap-skills) [![npm 30d 640](https://img.shields.io/static/v1?label=npm+30d&message=640&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz)
<!-- END META -->

> **实现功能**：在 DSH 中把 CapMap 文档渲染为语义图谱、能力面板和状态看板。

> **核心亮点**：相对通用Obsidian链接图，具体增量是把方案/测试/能力和切片sidecar分层，生成依赖可开工与验证门视图；D3图布局、文件watch与Cordis接线来自上游。业务增量是将文档规范变成日常检查入口，不是自动验收系统。

> **风险与缺陷**：最关键的质疑是看板的“验证门”是否真实绑定方案证据。queries.ts 把同主题测试也视作关联，可能用另一方案的已验证测试消除警报；状态来自人工标签，不读取运行验收。图谱可导航不能证明实施完毕。

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

> **用途**：已经采用CapMap目录/标签规范的软件团队，想从本地文档定位能力、方案、测试和可开工切片；交付是可回到原文的状态视图。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：侧栏入口与图谱能力面板
- **后台**：文档 watch 与 revision 查询
- **Host 路由**：/capmap RPC解析、读取及后台初始化

**流程与依赖**

Node/DSH web Cordis与client runtime等peer、React、chokidar、js-yaml、d3-force必要；有效capmap.yaml/docs_root与标签规范决定效果。bootstrap默认npx skills安装，失败git sparse回退，需要网络/Git并写工作区。

选工作区→parse→图谱/面板→watch revision刷新→读原文；缺docs_root时可选择后台bootstrap job、安装Skill并写骨架；安装失败仍可能已写骨架，需人工检查部分成果。

**效果与成本**

无已证实订阅费用；首次迁移文档标签/目录、维护关系和搭建前后端版本是主要人工成本，大仓同步解析和watch成本未测。

规范化文档团队有具体导航价值；非CapMap仓库迁移代价可能超过图谱收益，未做团队采用或任务效率验证。

> **思考**：最关键的质疑是看板的“验证门”是否真实绑定方案证据。queries.ts 把同主题测试也视作关联，可能用另一方案的已验证测试消除警报；状态来自人工标签，不读取运行验收。图谱可导航不能证明实施完毕。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对通用Obsidian链接图，具体增量是把方案/测试/能力和切片sidecar分层，生成依赖可开工与验证门视图；D3图布局、文件watch与Cordis接线来自上游。业务增量是将文档规范变成日常检查入口，不是自动验收系统。

相对通用Obsidian链接图，具体增量是把方案/测试/能力和切片sidecar分层，生成依赖可开工与验证门视图；D3图布局、文件watch与Cordis接线来自上游。业务增量是将文档规范变成日常检查入口，不是自动验收系统。

Cordis-free parser与纯查询可独立复用；异步bootstrap job避免长RPC阻塞且报告进度。src/index.ts 的read做字符串路径边界但未realpath，不是符号链接隔离；bootstrap部分成功状态需保留。queries同主题回退适合提示但不宜强门禁。 源码：[dsh-capmap-viz/src/index.ts](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/index.ts)、[dsh-capmap-viz/src/parser/parse.ts](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/parser/parse.ts)、[dsh-capmap-viz/src/parser/queries.ts](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/parser/queries.ts)、[dsh-capmap-viz/src/client/index.tsx](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/client/index.tsx)、[dsh-capmap-viz/src/bootstrap/bootstrap.ts](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/bootstrap/bootstrap.ts)、[dsh-capmap-viz/src/bootstrap/installSkills.ts](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/bootstrap/installSkills.ts)、[dsh-capmap-viz/src/invariant.ts](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/invariant.ts)、[dsh-capmap-viz/src/parser/queries.test.ts](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/parser/queries.test.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键的质疑是看板的“验证门”是否真实绑定方案证据。queries.ts 把同主题测试也视作关联，可能用另一方案的已验证测试消除警报；状态来自人工标签，不读取运行验收。图谱可导航不能证明实施完毕。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已有CapMap规范的团队先在工作区副本浏览；核对看板关联与原文，初始化会写文档并安装Skill，先审阅预期文件，不能用状态标签代替验收证据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

- 已检查：作者 README、包清单、源码路径 dsh-capmap-viz/src/index.ts、dsh-capmap-viz/src/parser/parse.ts、dsh-capmap-viz/src/parser/queries.ts、dsh-capmap-viz/src/client/index.tsx、dsh-capmap-viz/src/bootstrap/bootstrap.ts、dsh-capmap-viz/src/bootstrap/installSkills.ts、dsh-capmap-viz/src/invariant.ts、dsh-capmap-viz/src/parser/queries.test.ts 及固定范围 inventory；组件：dsh-capmap-viz。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 49228e54a6a536ddbbb0adca85bd016334cbf4cc，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：构造同主题两方案、仅一方案有已验证测试的文档集，人工标定预期警报；比较启发式与显式边准确率，再让维护者完成同一定位任务测总耗时，误消警报即推翻可靠门控主张。

**分析版本**

- **仓库**：[1741505640/capmap-skills](https://github.com/1741505640/capmap-skills)
- **版本号**：0.2.4（[固定提交 49228e5](https://github.com/1741505640/capmap-skills/tree/49228e54a6a536ddbbb0adca85bd016334cbf4cc)）
- **版本日期**：2026-09-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：用显式方案ID—测试ID—验收artifact关系替代同主题启发，并把缺失证据保留为未知，可提高验证门准确率；代价是维护关系和证据版本，当前未实现该强绑定。

构造同主题两方案、仅一方案有已验证测试的文档集，人工标定预期警报；比较启发式与显式边准确率，再让维护者完成同一定位任务测总耗时，误消警报即推翻可靠门控主张。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 12 | 5818 | 5587 | 335 | — |
| .md | source | 1 | 119 | — | — | 740 |
| .mjs | source | 1 | 34 | 28 | 1 | — |
| .ts | source | 21 | 2713 | 2332 | 122 | — |
| .ts | test | 8 | 667 | 631 | 4 | — |
| .tsx | source | 9 | 2921 | 2747 | 28 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1741505640/capmap-skills/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
