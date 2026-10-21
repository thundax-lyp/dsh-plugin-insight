# dsh-memory-setup

> 保存工作区偏好、约定与纠错教训，支持知识检索、快照和上下文注入。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[989e8a5](https://github.com/863683348/dsh-memory-setup/tree/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-memory-setup) · [![npm 30d 158](https://img.shields.io/static/v1?label=npm+30d&message=158&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-memory-setup) · [![首次发布 2026-08-19](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-memory-setup)
<!-- END META -->

**使用建议**：适合在单个非敏感项目先试。先确认记忆来源、备份恢复和并发写入，再决定是否启用外部embedding；重复出现的教训也要核实后再升为约定。

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

替代是项目AGENTS、手写笔记及外部记忆服务；项目提供本地结构化工作流，仍需人工治理内容。

<a id="detail-section-3"></a>

### 能力、依赖与流程

lib/index.js通过ctx.fs读取工作区JSON，保存时做revision比较、备份及sha256；memory.js去重教训、分层和渲染；kb-tools.js可向配置的embeddingEndpoint发送内容以做语义检索。

- **模型工具**：memory_setup/status/update/project/review及快照、导入导出、知识检索工具
- **后台**：工作区JSON记忆、备份及可选embedding
- **事件监听**：上下文记忆刷新

宿主tools/fs/systemPrompt及消息接口；本地工作区.dsh-memory-setup目录。可选OpenAI兼容embedding服务、密钥和模型，启用后网络不再为零。

初次录入或项目提取预览→保存版本/备份→定时刷新上下文→记录错误修复→相似合并/可选晋升→快照导出；冲突提示重新读取再应用。

<a id="detail-section-4"></a>

### 成本与效果

首次整理现有约定与导入资料；持续成本为注入token、错误教训复核及快照维护。启用embedding时有端点费用和内容外传，人工纠错成本不能被自动去重掩盖。

可减少每次重复提供偏好，未证真实长期任务成功率或重复错误下降。

<a id="detail-section-5"></a>

### 工程亮点

纯记忆变换与宿主IO分离、revision校验和hash提高可审阅性；revision检查与写入并非原子事务，不能宣称彻底避免并发覆盖。KB写入与主记忆也有不同的保护强度，应分别验证。

源码依据：[lib/index.js](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js)、[lib/memory.js](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js)、[lib/kb-tools.js](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/kb-tools.js)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合反复在同一工作区工作、愿意审阅长期记忆的用户；记忆正确性要靠来源与复核。

- **建议**：待验证假设：将上下文缓存按工作区隔离，并在教训晋升前要求独立证据状态，可减少跨项目污染及错误固化。用两个工作区不同约定、快速交替和重复错误教训轨迹比较注入命中与误晋升；若证据门槛阻碍有效记忆，保留人工确认通道。

适合在单个非敏感项目先试。先确认记忆来源、备份恢复和并发写入，再决定是否启用外部embedding；重复出现的教训也要核实后再升为约定。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：memory_setup/status/update/project/review及快照、导入导出、知识检索工具
- **后台**：工作区JSON记忆、备份及可选embedding
- **事件监听**：上下文记忆刷新

- **思考**：README的nothing leaves your machine只适用于未启用外部embedding：kb-tools会把查询或条目发到配置端点。上下文memCtx、focusQuery与30秒节流是插件级状态，多个工作区同时使用时须验证是否会串用或延迟刷新。自动按hits提升为约定会强化重复但错误的教训，evidence可为null，不能把频次当真值。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者定位可审计个人记忆层；实际增量是把偏好、项目约定、纠错复盘与知识库整合成可导出JSON，并让宿主上下文自动读取。相对手写AGENTS，新增结构化更新、快照与相似教训合并；不会自动证明被记住的教训正确或改善长期任务。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[863683348/dsh-memory-setup](https://github.com/863683348/dsh-memory-setup)
- **版本号**：1.2.0（[固定提交 989e8a5e](https://github.com/863683348/dsh-memory-setup/tree/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/memory.js、lib/kb-tools.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：验证双工作区隔离、30秒内保存刷新、并发revision冲突、空evidence晋升及embedding实际请求目标；本轮未执行。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：将上下文缓存按工作区隔离，并在教训晋升前要求独立证据状态，可减少跨项目污染及错误固化。用两个工作区不同约定、快速交替和重复错误教训轨迹比较注入命中与误晋升；若证据门槛阻碍有效记忆，保留人工确认通道。

验证双工作区隔离、30秒内保存刷新、并发revision冲突、空evidence晋升及embedding实际请求目标；本轮未执行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：23625d0b0a800f22b6780e39a245a0e6e0f8be1be7e0120b7586ba08147642e7。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 2204 | 1947 | 148 | — |
| .md | source | 3 | 109 | — | — | 1126 |
| .mjs | source | 1 | 117 | 103 | 7 | — |
| .mjs | test | 4 | 417 | 369 | 6 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-memory-setup/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
