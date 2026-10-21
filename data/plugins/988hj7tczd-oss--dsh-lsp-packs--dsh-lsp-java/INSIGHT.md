# dsh-lsp-java

> 为DSH配置Eclipse JDT语言服务的Java导航路由。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

**使用建议**：已有Java开发环境可先试。确认JDK、jdtls启动参数和每项目工作区，再测真实项目；等待索引完成后才判断导航结果。

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

- **用途**：适合已有JDK与Java项目、需要在DSH使用jdtls导航的开发者；启动与工作区初始化需单独核对。

- **建议**：待验证假设：把JVM可用、启动器参数、工作区锁及索引就绪分开报告，可降低Java初次查询失败的盲重试。以错误jar、复用data目录及正常项目做故障矩阵，测归因与恢复时间；不将加载成功当索引完成。

已有Java开发环境可先试。确认JDK、jdtls启动参数和每项目工作区，再测真实项目；等待索引完成后才判断导航结果。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

替代为IDE的JDT导航或手写stdio配置；插件减少宿主接线，不能替代Java构建与索引。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：java provider配置：jdtls、.java映射及不可用占位

**流程与依赖**

dsh-lsp-java/src/index.ts注册java provider，默认jdtls、空args和.java→java，允许以java命令及jar/configuration/data参数覆盖后交给官方LspStdio。

fs/lsp/subprocess及官方stdio/tool-lsp底座；README声明JDK17+及Eclipse jdtls，必要时覆盖java -jar、-configuration、-data；DSH版本声明<0.2.0，Node>=22.18。

装共享底座及Java包→配置JVM/jdtls工作区→查询触发底座启动与JDT初始化→导航；缺服务时返回结构化不可用，需修配置后重载。

**效果与成本**

首次安装README指定JDK与jdtls并配置数据目录；持续占用JVM内存、索引时间和磁盘，人工核查构建与依赖。无插件定价证据，冷启动等待可能抵消配置便利。

可减少JDT接线重复，无真实Java工程迁移或导航效果验证。

- **思考**：README明确JDK17+、jdtls启动器与独立Eclipse工作区，首次初始化可慢；有命令并不代表项目已索引。用户自定义-data目录是否隔离不同项目要自己核实。catch所有加载错误统一missing-server类解释可能遮住jar路径、JVM与配置错误，且fallback丢自定义扩展。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：本项把Eclipse JDT启动形式包装成独立语言配置包，降低手工组合成本；其增量是Java进程和扩展参数的宿主接线，不是Java索引器或新的导航协议。作者称即插即用须以JDK和项目布局满足为条件。

本项把Eclipse JDT启动形式包装成独立语言配置包，降低手工组合成本；其增量是Java进程和扩展参数的宿主接线，不是Java索引器或新的导航协议。作者称即插即用须以JDK和项目布局满足为条件。

java/src入口仅配置LspStdio，控制参数和故障provider可检查；官方底座负责协议。组件规模按java目录统计，不把全仓十二包算成本项原创；启动状态细分是主要复用缺口。

源码依据：[dsh-lsp-java/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/src/index.ts)、[dsh-lsp-java/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/README.md)、[dsh-lsp-java/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/cordis.yml)、[dsh-lsp-java/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/tests/smoke.e2e.ts)。

<a id="detail-section-5"></a>

### 主要限制

README明确JDK17+、jdtls启动器与独立Eclipse工作区，首次初始化可慢；有命令并不代表项目已索引。用户自定义-data目录是否隔离不同项目要自己核实。catch所有加载错误统一missing-server类解释可能遮住jar路径、JVM与配置错误，且fallback丢自定义扩展。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-java/src/index.ts、dsh-lsp-java/README.md、dsh-lsp-java/cordis.yml、dsh-lsp-java/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：验证JDK/启动器缺失、错误-data与冷索引、多模块项目四操作；本轮未启动JVM或jdtls。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：把JVM可用、启动器参数、工作区锁及索引就绪分开报告，可降低Java初次查询失败的盲重试。以错误jar、复用data目录及正常项目做故障矩阵，测归因与恢复时间；不将加载成功当索引完成。

验证JDK/启动器缺失、错误-data与冷索引、多模块项目四操作；本轮未启动JVM或jdtls。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-java；内容摘要：dffec4ca66165c182c91c3180cb9c45672292fdd646785016e0ac16ef061a734。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 140 | — | — | 1039 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 180 | 131 | 25 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
