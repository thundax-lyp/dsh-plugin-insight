# helmd

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[3c82d9d](https://github.com/ADWMC/helm-d/tree/3c82d9d7c9fedab4575061bfcf9ea6d8ded8dd39/packages/helmd)

<!-- BEGIN META -->
[![GitHub ★ 289](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=289&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 391](https://img.shields.io/static/v1?label=npm+30d&message=391&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-09-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)
<!-- END META -->

> **实现功能**：提供安全分析预设、领域工具和按需参考，并将Case证据与结论保存在磁盘。

> **核心亮点**：相比无持久材料的聊天分析，增量是Case目录、证据编号、结论关联和恢复接口形成可追踪工作流。领域方法与外部CLI归既有工具，不能从参考篇数推断新检测能力。

> **风险与缺陷**：“0幻觉”是否被代码保证？validateEvidenceIds只检查文件名编号，空数组也没有missing；记录的正文不校验证据是否支持结论，no-evidence可用文字说明。引用完整性有价值，但不能推出语义真实性或实验复现，更不能替代宿主权限边界。

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

> **用途**：授权安全分析需要跨会话复核工具输出与结论，合格结果是证据真实、相关且可复现；引用编号存在只是最低结构条件。

手工证据目录和实验记录同样可复核；插件自动组织提高便利但不自动提高事实性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：Case生命周期、证据保存和领域分析工具。
- **Agent/Preset**：安全分析预设与分层路由。

**流程与依赖**

DSH工具注册和事件契约、本地写权限、具体领域CLI；分析授权/样本可运行性和证据质量由使用者负责。

begin_case建目录，领域工具输出存E编号，record_finding关联，状态恢复后deep检查再end_case；外部CLI结果需显式入链。

**效果与成本**

首次搭分析环境，持续证据落盘、人工复核与外部工具执行成本；更多纪律也增加上下文和整理负担，未测净收益。

减少材料散失与交接重复，缺独立准确率与复现收益验证。

> **思考**：“0幻觉”是否被代码保证？validateEvidenceIds只检查文件名编号，空数组也没有missing；记录的正文不校验证据是否支持结论，no-evidence可用文字说明。引用完整性有价值，但不能推出语义真实性或实验复现，更不能替代宿主权限边界。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相比无持久材料的聊天分析，增量是Case目录、证据编号、结论关联和恢复接口形成可追踪工作流。领域方法与外部CLI归既有工具，不能从参考篇数推断新检测能力。

相比无持久材料的聊天分析，增量是Case目录、证据编号、结论关联和恢复接口形成可追踪工作流。领域方法与外部CLI归既有工具，不能从参考篇数推断新检测能力。

包装注册统一持久化与领域实现解耦，但只覆盖特定字符串输出与活跃Case。编号存在/数量门禁是结构而非语义，可复用时应保持边界。 源码依据：[packages/helmd/src/index.ts](https://github.com/ADWMC/helm-d/blob/3c82d9d7c9fedab4575061bfcf9ea6d8ded8dd39/packages/helmd/src/index.ts)、[packages/helmd/src/persist.ts](https://github.com/ADWMC/helm-d/blob/3c82d9d7c9fedab4575061bfcf9ea6d8ded8dd39/packages/helmd/src/persist.ts)、[packages/helmd/src/case.ts](https://github.com/ADWMC/helm-d/blob/3c82d9d7c9fedab4575061bfcf9ea6d8ded8dd39/packages/helmd/src/case.ts)、[packages/helmd/src/tools/caseflow.ts](https://github.com/ADWMC/helm-d/blob/3c82d9d7c9fedab4575061bfcf9ea6d8ded8dd39/packages/helmd/src/tools/caseflow.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“0幻觉”是否被代码保证？validateEvidenceIds只检查文件名编号，空数组也没有missing；记录的正文不校验证据是否支持结论，no-evidence可用文字说明。引用完整性有价值，但不能推出语义真实性或实验复现，更不能替代宿主权限边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合授权样本分析时借鉴Case工作流。先验证持久化和恢复，再人工检查每条证据与结论关系；不将零幻觉标语当准确性保证。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[ADWMC/helm-d](https://github.com/ADWMC/helm-d)
- **版本号**：0.5.0（[固定提交 3c82d9d7](https://github.com/ADWMC/helm-d/tree/3c82d9d7c9fedab4575061bfcf9ea6d8ded8dd39)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 packages/helmd/src/index.ts、packages/helmd/src/persist.ts、packages/helmd/src/case.ts、packages/helmd/src/tools/caseflow.ts 及固定范围 inventory；组件：packages/helmd。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读packages/helmd/src/index.ts、packages/helmd/src/persist.ts、packages/helmd/src/case.ts、packages/helmd/src/tools/caseflow.ts、packages/helmd/package.json；未覆盖全部参考/界面分支与真实并发宿主行为，未运行目标代码、外部工具或安装验收。
- 下一步：隔离合法样本检验空引用、不相关E、文件变更、非字符串输出、跨会话恢复和无证据说明，人工盲评结论可复现性。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由E编号检验推导，可为finding要求非空证据和明确命题/反例/复现步骤，另由独立检查绑定命题与输出摘要。未验证；用存在但不相关的证据、空引用和被改内容挑战，若仍作为已证实结论关案则否定。

隔离合法样本检验空引用、不相关E、文件变更、非字符串输出、跨会话恢复和无证据说明，人工盲评结论可复现性。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：packages/helmd；内容摘要：453d575163e882dc47dc164c875725742e5c9ef037063489293eaa070c1d397d。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 1941 | 1504 | 290 | — |
| .md | source | 367 | 95649 | — | — | 525942 |
| .mjs | source | 2 | 428 | 316 | 87 | — |
| .ts | source | 34 | 5576 | 4454 | 727 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/ADWMC/helm-d/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
