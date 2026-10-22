# dsh-sciwork

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[21c6e9d](https://github.com/58catmiao/dsh-sciwork/tree/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork) · **脚本有更新，待重新洞察**
<!-- END META -->

> **实现功能**：提供科研模式预设、本地科研库面板、文献和数据管理及投稿前检查流程。

> **核心亮点**：作者定位为科研工作台；实际增量是把文件系统作为真相源，面板与CLI共用写入路径，将数据、引用、期刊检查和包清单连接起来。相对散落文件与人工清单，增加登记及溯源；Origin绘图来自外部Fantasality插件，不属于本项目实现。

> **风险与缺陷**：期刊规则档案的机器检查只能覆盖编码条款，不能替代现行刊方要求或科学正确性。README称面板只读为主，但actions明确包含remove、writeText、runCli等写操作；采用前须按实际动作评估路径和备份，而不能按只读描述判断。

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

替代是目录+文献管理器+手工投稿清单；项目的价值在统一工作流，未替代专业统计或文献数据库。

<a id="detail-section-3"></a>

### 1.2 能力、依赖与流程

lib/index.js注册research/call精确Fetch路由；actions.js分派快照、导入、归档、变换及投稿动作，库写入转给Python脚本；技能与research预设组织工作流。

- **Agent/Preset**：research科研模式
- **Skill**：research-studio、literature-refs、paper-writing、journal-profile、origin-plot
- **Host 路由**：/api/research/call精确Fetch路由
- **界面**：科研库管理面板

宿主connection与预设/客户端能力、Node及Python3；绘图额外依赖Origin和外部dsh-origin-plugin；期刊资料有时间边界。

建库→选research预设→导入数据文献→变换或外部绘图并登记→写稿核引→按期刊档案体检→导出带摘要清单的包；归档可恢复，真删需额外谨慎。

<a id="detail-section-4"></a>

### 1.3 成本与效果

首次安装Python、建库及迁移命名；Origin另需相应系统、软件与外部插件。现金成本取决于软件和模型，人工主要是引用核实、期刊规则更新与归档恢复。

可减少跨文件整理和投稿材料收集，缺乏真实课题的差错率与工时对照。

<a id="detail-section-5"></a>

### 1.4 工程亮点

精确Fetch路由避免抢占共享/api拦截器；面板动作集中在actions、路径经resolveInside，文件索引可重建，利于迁移。复用时仍须核对Python引擎及删除恢复语义。

源码依据：[lib/index.js](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/index.js)、[lib/actions.js](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/actions.js)、[library/scripts/research.py](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：适合已有本地数据与文献、需要组织图表和稿件的科研者；交付物是可迁移的文件库与投稿包。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **Agent/Preset**：research科研模式
- **Skill**：research-studio、literature-refs、paper-writing、journal-profile、origin-plot
- **Host 路由**：/api/research/call精确Fetch路由
- **界面**：科研库管理面板

> **思考**：期刊规则档案的机器检查只能覆盖编码条款，不能替代现行刊方要求或科学正确性。README称面板只读为主，但actions明确包含remove、writeText、runCli等写操作；采用前须按实际动作评估路径和备份，而不能按只读描述判断。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：作者定位为科研工作台；实际增量是把文件系统作为真相源，面板与CLI共用写入路径，将数据、引用、期刊检查和包清单连接起来。相对散落文件与人工清单，增加登记及溯源；Origin绘图来自外部Fantasality插件，不属于本项目实现。

<a id="detail-section-9"></a>

### 1.8 使用建议

适合愿意使用目录式科研库的用户。先在副本导入、归档和恢复，再核对投稿档案是否适用于目标期刊；面板检查不能替代科研与编辑审阅。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[58catmiao/dsh-sciwork](https://github.com/58catmiao/dsh-sciwork)
- **版本号**：0.2.2（[固定提交 21c6e9d5](https://github.com/58catmiao/dsh-sciwork/tree/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/actions.js、library/scripts/research.py、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：用复制库验证路径逃逸、同名导入、归档恢复、缺DOI引用及过期期刊条款；检查投稿包逐文件摘要，本轮未执行。

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：让投稿检查每条结论绑定期刊来源日期及输入文件摘要，可在规则或稿件变化后只重验失效条目。用一组稿件修改和规则变化比较遗漏率与人工核对时间；未验证，不能宣称自动合规。

用复制库验证路径逃逸、同名导入、归档恢复、缺DOI引用及过期期刊条款；检查投稿包逐文件摘要，本轮未执行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：38081849c36a65e5c22b494ab3afdecaf4b336449557c3b29320039ad3a60e24。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2674 | — | — | 45435 |
| .js | source | 11 | 6376 | 5154 | 832 | — |
| .mjs | source | 8 | 2958 | 2461 | 295 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/58catmiao/dsh-sciwork/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
