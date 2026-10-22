# dsh-plugin-orchd

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[ef331b3](https://github.com/7bder/dsh-plugin-orchd/tree/ef331b30c89854e29dc9d4954bd86e457a24b850)

<!-- BEGIN META -->
[![npm 30d 301](https://img.shields.io/static/v1?label=npm+30d&message=301&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-orchd) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-orchd)
<!-- END META -->

> **实现功能**：在DSH右侧栏只读展示当前项目的orchd任务、依赖图、想法和审查时间线。

> **核心亮点**：相对手动运行多条orchd命令，增量是把当前会话与项目只读状态绑定，保留异常、未初始化与缺少能力的区别；它不是新的任务引擎，也不承担claim/review/merge。状态展示与操作责任分离是主要流程价值。

> **风险与缺陷**：白名单足以保证只读吗？调用的是项目自带Python引擎，命令名称受限但具体引擎行为不由插件控制；关闭AUTO_CLEAN与剥离身份是有力支持，却不能证明任意版本status无写入。README的真引擎零变化冒烟属于作者报告，本轮未复现，需限制在可信且经过检查的引擎版本。

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

> **用途**：已经使用orchd编排项目的开发者需要在聊天旁观察任务与阻塞；合格结果是项目身份正确、状态可追溯且读操作不改变任务账本。

人工运行status/pool/review命令直接且可审计；面板聚合可读性更好但引入缓存和渲染层。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：当前项目orchd任务和依赖只读面板。
- **Host 路由**：session绑定的只读状态API。

**流程与依赖**

必要为右侧栏席位、session项目身份、可信orchd引擎和Python；效果取决于账本及时正确，缓存不是权威新事实。

打开项目会话，检测orchd状态并查询只读命令，按需看任务/图/时间线；未安装时给出命令或需确认的会话注入，面板本身不执行安装。

**效果与成本**

首次需项目orchd与Python路径；日常缓存TTL减少重复调用但可能陈旧，升级需验证引擎输出兼容。无模型调用增加，未测大型项目刷新时间。

减少聊天与CLI状态查询之间切换，依赖图有助定位阻塞；没有独立采用或办结效率对照。

> **思考**：白名单足以保证只读吗？调用的是项目自带Python引擎，命令名称受限但具体引擎行为不由插件控制；关闭AUTO_CLEAN与剥离身份是有力支持，却不能证明任意版本status无写入。README的真引擎零变化冒烟属于作者报告，本轮未复现，需限制在可信且经过检查的引擎版本。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对手动运行多条orchd命令，增量是把当前会话与项目只读状态绑定，保留异常、未初始化与缺少能力的区别；它不是新的任务引擎，也不承担claim/review/merge。状态展示与操作责任分离是主要流程价值。

相对手动运行多条orchd命令，增量是把当前会话与项目只读状态绑定，保留异常、未初始化与缺少能力的区别；它不是新的任务引擎，也不承担claim/review/merge。状态展示与操作责任分离是主要流程价值。

单一spawn入口、参数形状白名单、明确timeout与不支持命令区别可借鉴。维护代价在项目布局、引擎版本与JSON契约；白名单是调用约束，不能成为不可信代码沙箱。 源码依据：[lib/orchd-cli.js](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/orchd-cli.js)、[lib/cli-invoke.js](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/cli-invoke.js)、[lib/install-entry.js](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/install-entry.js)、[lib/routes.js](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/routes.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

白名单足以保证只读吗？调用的是项目自带Python引擎，命令名称受限但具体引擎行为不由插件控制；关闭AUTO_CLEAN与剥离身份是有力支持，却不能证明任意版本status无写入。README的真引擎零变化冒烟属于作者报告，本轮未复现，需限制在可信且经过检查的引擎版本。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已有orchd项目先在副本试用。先核对会话对应项目、Python/引擎版本以及刷新前后文件和账本不变，勿把面板就绪当作任务验收通过。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[7bder/dsh-plugin-orchd](https://github.com/7bder/dsh-plugin-orchd)
- **版本号**：0.1.0（[固定提交 ef331b30](https://github.com/7bder/dsh-plugin-orchd/tree/ef331b30c89854e29dc9d4954bd86e457a24b850)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/orchd-cli.js、lib/cli-invoke.js、lib/install-entry.js、lib/routes.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：可信固定引擎的临时项目检查状态/图与CLI一致、白名单拒绝、超时分类、旧版ideas降级和刷新前后文件/事件数不变。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由白名单和项目引擎依赖推导，可将只读协议做成带引擎版本与状态摘要的导出接口，面板只消费快照，不执行项目代码；保留手动刷新与过期提示。未验证假设是减少观察副作用且不明显增加陈旧状态。对比CLI与快照模式的文件变化和状态延迟，若刷新负担更大且无副作用改善则否定。

可信固定引擎的临时项目检查状态/图与CLI一致、白名单拒绝、超时分类、旧版ideas降级和刷新前后文件/事件数不变。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：4a12593adbb3e284baedfc15e9f8f1f14fecc6b4b278a665a59a72d0fe5189de。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 15 | 7194 | 5232 | 1510 | — |
| .md | source | 1 | 121 | — | — | 1318 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7bder/dsh-plugin-orchd/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7bder/dsh-plugin-orchd/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7bder/dsh-plugin-orchd/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
