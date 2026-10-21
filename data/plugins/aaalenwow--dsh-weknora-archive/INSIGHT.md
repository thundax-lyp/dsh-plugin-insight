# dsh-weknora-archive

> 提取DSH会话并生成启发式总结，增量上传到用户配置的WeKnora知识库。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[46079ec](https://github.com/AAAlenwow/dsh-weknora-archive/tree/46079ecb3554239797b1dcbe2e82f74a21adb9a1)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-weknora-archive)
<!-- END META -->

**使用建议**：先审阅脱敏摘要并在测试WeKnora使用固定库ID。不要在未知目标上把dry_run当无写入保证，归档后核对文档解析和后续会话更新。

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

- **用途**：团队想将完成会话变成可检索知识，需要避免重复、保留更新且明确上传范围；合格归档还要确认远端解析成功与敏感信息处理。

- **建议**：由预览提前建库与标题去重推导，可先构造纯只读计划，确认后以完整session ID+内容摘要幂等写入，新增解析状态验收。未验证；空库dry-run和同会话追加消息对照，若仍写库/漏更新则否定。

先审阅脱敏摘要并在测试WeKnora使用固定库ID。不要在未知目标上把dry_run当无写入保证，归档后核对文档解析和后续会话更新。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

人工归档可审阅细节但成本高；插件自动化可重复新会话处理，未实现会话版本同步。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：会话归档、状态、列库与创建知识库工具。

**流程与依赖**

本地DSH会话压缩格式、Node解压能力、WeKnora写key/API与embedding；效果依赖摘要准确性和服务解析。

选唯一项目，解析/创建库，列文档去重，读会话总结，预览或上传；状态工具另查解析，用户复核内容。

**效果与成本**

首次需WeKnora与embedding配置、权限和会话目录；持续存储/解析费用与人工校摘要成本，启发式不能保证保留关键决策。

降低归档重复劳动，但知识质量、检索效果与完整保密性未验证。

- **思考**：dry_run是否真无外部写入？目标库解析在dryRun分支前，找不到库就调用createKnowledgeBase，因此预览也可能新建库。标题短ID去重还会把已归档但继续增长的会话当跳过，增量是新会话而非内容更新；上传成功也不证明解析成功。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对手动复制聊天到知识库，增量是把会话发现、去重与结构化总结接到写入端；检索与embedding来自WeKnora，不由本插件提供。

相对手动复制聊天到知识库，增量是把会话发现、去重与结构化总结接到写入端；检索与embedding来自WeKnora，不由本插件提供。

reader/summarizer/client编排分离与409去重处理可借鉴；写前计划、完整身份和远端状态是复用需补的边界。 源码依据：[lib/archive.js](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/archive.js)、[lib/session-reader.js](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/session-reader.js)、[lib/summarizer.js](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/summarizer.js)。

<a id="detail-section-5"></a>

### 主要限制

dry_run是否真无外部写入？目标库解析在dryRun分支前，找不到库就调用createKnowledgeBase，因此预览也可能新建库。标题短ID去重还会把已归档但继续增长的会话当跳过，增量是新会话而非内容更新；上传成功也不证明解析成功。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AAAlenwow/dsh-weknora-archive](https://github.com/AAAlenwow/dsh-weknora-archive)
- **版本号**：0.2.0（[固定提交 46079ecb](https://github.com/AAAlenwow/dsh-weknora-archive/tree/46079ecb3554239797b1dcbe2e82f74a21adb9a1)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/archive.js、lib/session-reader.js、lib/summarizer.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：mock与测试实例验证dryRun零写、短ID碰撞、继续增长会话、409/超时和解析失败；对原文盲评决策保留与敏感值漏出。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由预览提前建库与标题去重推导，可先构造纯只读计划，确认后以完整session ID+内容摘要幂等写入，新增解析状态验收。未验证；空库dry-run和同会话追加消息对照，若仍写库/漏更新则否定。

mock与测试实例验证dryRun零写、短ID碰撞、继续增长会话、409/超时和解析失败；对原文盲评决策保留与敏感值漏出。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：b230b420e1d88c6c04cba51887a1586c758ad0d3337a94e4fbb400e415b8b162。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 932 | 693 | 181 | — |
| .md | source | 1 | 124 | — | — | 1170 |
| .mjs | test | 1 | 158 | 140 | 17 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-weknora-archive/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-weknora-archive/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-weknora-archive/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
