# dsh-tech-lead（旧组件）

> 为 DSH 提供只读工程治理工具，检查任务分级、计划、证据、门禁、上下文及变更预览。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c7e23f9](https://github.com/240xu/verdict-engine/tree/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/240xu/verdict-engine) [![npm 30d 67](https://img.shields.io/static/v1?label=npm+30d&message=67&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-tech-lead) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-tech-lead)
<!-- END META -->

**使用建议**：新采用者先核对根项目推荐的dsh-themis迁移路线，不优先安装这个旧组件；已有使用者可把它作为输入一致性检查，并保留真实测试和人工评审，先验证旧协议返回与现有调用方兼容。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
  - [源码索引](#detail-section-7)
- [未来设计假设（未验证）](#detail-section-8)
- [辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

目标固定组件支持只读治理判定，当前根README主推dsh-themis并明确旧拆分包弃用；不能将新包24入口或v2协议承诺归给本组件。未运行工具或检验实际工程结果，证据真实性绑定假设未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：面向需要让Agent工程规范可机械复核的团队；合格结果是指出调用者输入中违反规则的字段，而非证明真实代码或环境已经满足发布标准。

采用建议：新采用者先核对根项目推荐的dsh-themis迁移路线，不优先安装这个旧组件；已有使用者可把它作为输入一致性检查，并保留真实测试和人工评审，先验证旧协议返回与现有调用方兼容。

参照同仓纯文本Skill和常规schema/lint：增量是工程治理规则计算化；当前新单包与旧组件同时存在，采用判断须以目标路径和实际协议为准。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：只读任务分级、状态/计划/证据/门禁检查、上下文分析及变更预览工具定义

**流程与依赖**

必需DSH tools注册服务和固定旧版dsh-tools，输入事实/角色/证据由调用者提供；目标没有自动读取仓库或验真服务，效果依赖账本质量。向新单包迁移需核对工具名、输入模式与输出协议。

调用者收集事实→序列化JSON→选分级/计划/证据/门禁工具→解析结果与截断边界→人工或外部流程决定改动/发布；非法输入返回结构错误，工具自身不执行修复或放行外部系统。

**效果与成本**

首次需把工程事实整理成JSON与角色/证据账本，持续维护指纹、时间和规则版本；本组件无网络/子进程的路径可见，但生成输入仍消耗模型和人工，未测是否比简洁检查表省时间。

能让规则违例更稳定地被呈现，对重复治理有潜在价值；实际交付质量取决于事实包和执行责任，不能将只读判定升级为自动阻止发布或已完成验收。

- **思考**：“机械门禁通过”能否等于真实独立评审完成？gate.js比较字符串身份、非空锚点和报告数量，不读取文件、执行命令或验证评审身份，空输入在部分判据缺省时也不表达外部环境合格。最强支持是能精确检出输入矛盾，最强反例是构造格式完整但虚假的证据仍可能过机械子集。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对纯文本规范靠模型自觉，本项把任务分级、证据字段和门禁条件做成确定性的只读计算，减少遗漏格式与角色分工检查；原创增量在规则可执行化和一致输出，而非证明输入事实为真。组件内复制core、固定旧工具依赖，必须按所选路径评价。

相对纯文本规范靠模型自觉，本项把任务分级、证据字段和门禁条件做成确定性的只读计算，减少遗漏格式与角色分工检查；原创增量在规则可执行化和一致输出，而非证明输入事实为真。组件内复制core、固定旧工具依赖，必须按所选路径评价。

纯core与tools分离便于单独复用判据，mutation preview把命令作为惰性字符串有清晰副作用边界。protocol.js会将超500条裸finding数组直接slice而无法附warning，可能使调用方误读完整性；复用时应约定截断标志并注意本组件与新包协议不同。

<a id="detail-section-5"></a>

### 主要限制

“机械门禁通过”能否等于真实独立评审完成？gate.js比较字符串身份、非空锚点和报告数量，不读取文件、执行命令或验证评审身份，空输入在部分判据缺省时也不表达外部环境合格。最强支持是能精确检出输入矛盾，最强反例是构造格式完整但虚假的证据仍可能过机械子集。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 packages/dsh-tech-lead/package.json、packages/dsh-tech-lead/src/index.js、packages/dsh-tech-lead/src/tools.js、packages/dsh-tech-lead/src/tools/mutation.js、packages/dsh-tech-lead/src/core/gate.js、packages/dsh-tech-lead/src/protocol.js 及固定范围 inventory；组件：packages/dsh-tech-lead。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅研究packages/dsh-tech-lead固定旧组件，抽读入口、工具定义、gate及protocol，不将同仓dsh-themis和nomos的新功能迁入；未执行工具/目标测试或真实门禁。
- 下一步：对同一组真实工程事实注入缺锚点、重叠身份、虚构证据、陈旧revision和超500finding，对比本组件/手工检查表及外部事实绑定；观察漏报、误放行和输入整理时间。若采集绑定不能识别虚构/过期事实或成本过高，则否定假设。

**分析版本**

- **仓库**：[240xu/verdict-engine](https://github.com/240xu/verdict-engine)
- **版本号**：1.0.0（[固定提交 c7e23f9e](https://github.com/240xu/verdict-engine/tree/c7e23f9e131694af6dbd9f3ed11301602a514864)）
- **版本日期**：2026-09-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 源码索引

- [packages/dsh-tech-lead/package.json](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/package.json)
- [packages/dsh-tech-lead/src/index.js](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/index.js)
- [packages/dsh-tech-lead/src/tools.js](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/tools.js)
- [packages/dsh-tech-lead/src/tools/mutation.js](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/tools/mutation.js)
- [packages/dsh-tech-lead/src/core/gate.js](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/core/gate.js)
- [packages/dsh-tech-lead/src/protocol.js](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/protocol.js)

<a id="detail-section-8"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：由外部只读证据采集器产生签名/摘要绑定的事实包，工具只检验来源与当前revision匹配，并将自报字段与已采集事实分开。来源是纯计算边界与虚假锚点问题；代价是信任根、版本更新和证据采集维护，不能把模型自报签名当真实性。

对同一组真实工程事实注入缺锚点、重叠身份、虚构证据、陈旧revision和超500finding，对比本组件/手工检查表及外部事实绑定；观察漏报、误放行和输入整理时间。若采集绑定不能识别虚构/过期事实或成本过高，则否定假设。

<a id="detail-section-9"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 26 | 1711 | 1479 | 140 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/240xu/verdict-engine/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
