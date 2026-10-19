# dsh-project-memory

> 为 DSH 提供持久化项目记忆，索引文档与代码符号，关联任务和文件，并按需召回带出处的经验。

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4537](https://img.shields.io/static/v1?label=npm+30d&message=4%2C537&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) · [![最后更新 前天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E5%89%8D%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/commits)
<!-- END META -->

- **用途**：在同一开发项目跨会话恢复任务、文件线索和经验，减少重复梳理。
- **亮点**：12 个工具把任务、文档／代码索引和有出处召回接起来，默认自动注入与可选增强分开。
- **思考**：检索方便不等于任务恢复正确；项目经验进入全局作用域后是否误召回，仍需对照测试。
- **建议**：适合同项目反复中断的开发者小规模试用，先与交接文档加 rg 对照，暂不作安装推荐。

## 版本

固定提交 [fe7ac6cab91784a34996aede007d3586f0ff2def](https://github.com/00080000/dsh-project-memory/tree/fe7ac6cab91784a34996aede007d3586f0ff2def)

## 场景、替代办法与合格交付

合格交付物是恢复正确的任务状态、引用正确文件并继续完成开发；基线是 AGENTS、任务清单、交接文档和 rg。适用频率是同一项目经常跨会话继续，不适合仅偶尔问答时增加常驻索引。

## 实现机制与依据

src/index.js 显式注册 12 个工具及 /tasks 命令；TaskBridge 对接宿主任务，读取时索引文档与符号，installAutoInject 在 agent/pre-step 注入召回。全量首用索引是单独开关，不把自动注入理解为无条件全库扫描。

本轮重点审读：[src/index.js](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/index.js)、[src/recall.js](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/recall.js)、[src/tools/forget.js](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/forget.js)。固定文本材料已保存；完整文件统计不表示每行代码都经过人工审计。

## 安装与效果依赖

必要条件是 Cordis、宿主 tools／llm 等服务、可写项目存储；pdfjs-dist 处理 PDF。TypeScript 语义增强和额外模型路线按配置使用，模型能力、资料质量及召回噪声属于效果依赖。版本范围取 package.json 的 dsh.engines 和 peers，而非默认假设任意宿主可用。

发布核查：已读取 npm latest 0.6.2；源码 package.json 为 0.6.2。版本号一致仍不证明 tarball 内容一致。未安装、未比对发布包字节。

## 用户、后台与失败流程

准备项目资料和作用域 → 日常读文件与维护任务 → 召回附出处线索 → 人工核对并续办；误记须明确 forget 范围，跨项目污染要通过作用域与数据清理恢复。自动化主要减少重复定位，把正确性复核留给使用者。

## 首次、持续与迁移成本

首次包括索引与作用域配置；持续包括 CPU、磁盘、注入上下文 token、误召回清理，以及可选查询扩展／反思的模型费用；迁移需要导出／保留本地记忆及任务映射。本轮没有合格任务实测，不输出金额或收益比例。

## 工程规模与能力清单

| 扩展名 | 范围 | 文件数 | 总行数 | Markdown字数 | 代码行 |
|---|---|---:|---:|---:|---:|
| .md | source | 4 | 2224 | 47141 | — |
| .js | source | 52 | 14144 | — | 10338 |
| .mjs | source | 6 | 1447 | — | 1189 |
| .ts | source | 9 | 1324 | — | 924 |
| .tsx | source | 5 | 1556 | — | 1337 |
| .mjs | test | 40 | 9467 | — | 7577 |

- **模型工具**：12 个
- **用户命令**：/tasks
- **事件监听**：agent/pre-step、会话事件

## 工程亮点

任务桥、索引、召回、存储分模块，较单纯提示词有可追溯路径；自动注入、全局经验和后台观察也扩大了需要验证的行为面。测试目录覆盖较多场景，但本轮仅审读，不把测试文件存在当作通过。源码仍为 0.6.2，与前轮提交相同；会话 content_changed 来自兼容性指纹取值口径变化，不是本轮发现代码更新。

值得借鉴的是召回带出处、任务与文件关联和空闲时整理索引；移植时先实现确定性索引与明确作用域，再决定是否增加模型增强，验收引用准确度而非只测检索命中。

上述工程判断依据：[src/index.js](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/index.js)、[src/recall.js](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/recall.js)、[src/tools/forget.js](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/forget.js)。

## 采用判断与最小验证

固定同一模型、10 个中断后恢复任务，对照交接文档加 rg；测正确恢复率、错误出处、端到端耗时、人工修正与总 token。若任务合格率下降或清理成本抵消节省，则停止扩大使用。另做两个项目的反向经验隔离实验。

## 核查说明

- 已与前次版本对照，变化见工程亮点。
- 已阅读固定版本的源码、配置和测试文件。
- 未实际运行或安装插件，也未在 DSH 中试用或比较模型任务效果。
- 作者的自测和发布说明未经独立验证。
- Issue 数量仅供参考，不代表使用人数或实际收益。

## Issue 活跃度

Issue：未关闭 0／已关闭 4 · 近30天：新建 2／关闭 2／更新 2

统计日期：2026-10-19。
