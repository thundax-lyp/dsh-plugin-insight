# dsh-lsp-kotlin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：为DSH配置Kotlin语言服务及.kt、.kts导航路由。

> **核心亮点**：将Kotlin与脚本扩展及服务启动默认值包装成可安装配置，减少DSH手工接线；编译索引来自外部language server。

> **风险与缺陷**：README说明JDK17+且服务偏好Gradle、首次工作区遍历较慢；.kts有路由不等于任意Gradle脚本语义支持。自动跳过缺server的smoke不证明实际工程可用；catch错误类别过宽，不能把JVM或初始化错误都解释为没安装。

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

> **用途**：适合已有JDK和Kotlin/Gradle工程的开发者。

替代是Kotlin IDE或手写stdio配置；本项不替代Gradle导入或编译。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **后台**：kotlin provider与.kt/.kts映射

**流程与依赖**

kotlin入口默认kotlin-language-server空args，provider kotlin把.kt/.kts映射kotlin；配置转交官方stdio底座而不实现语言解析。

fs/lsp/subprocess、官方LSP底座；README要求JDK17+及kotlin-language-server，偏好Gradle；DSH<0.2.0、Node>=22.18声明。

外部环境就绪→挂载包→.kt/.kts触发懒服务→首次工作区遍历→导航；失败重载前检查JVM和项目配置。

**效果与成本**

首次准备JDK、外部server与Gradle项目，持续JVM/索引占资源；人工解决构建导入，现金无插件费用证据。

可减少Kotlin配置重复，无脚本或真实工程命中率数据。

> **思考**：README说明JDK17+且服务偏好Gradle、首次工作区遍历较慢；.kts有路由不等于任意Gradle脚本语义支持。自动跳过缺server的smoke不证明实际工程可用；catch错误类别过宽，不能把JVM或初始化错误都解释为没安装。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将Kotlin与脚本扩展及服务启动默认值包装成可安装配置，减少DSH手工接线；编译索引来自外部language server。

将Kotlin与脚本扩展及服务启动默认值包装成可安装配置，减少DSH手工接线；编译索引来自外部language server。

组件只提供配置合并与fallback，协议归上游；fallback默认映射丢自定义扩展，JVM诊断需要更精细。统计不包含其他语言包。

源码依据：[dsh-lsp-kotlin/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts)、[dsh-lsp-kotlin/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/README.md)、[dsh-lsp-kotlin/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/cordis.yml)、[dsh-lsp-kotlin/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/tests/smoke.e2e.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

README说明JDK17+且服务偏好Gradle、首次工作区遍历较慢；.kts有路由不等于任意Gradle脚本语义支持。自动跳过缺server的smoke不证明实际工程可用；catch错误类别过宽，不能把JVM或初始化错误都解释为没安装。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在小Gradle项目试，分别核.kt和.kts，等待首次索引；不要只看包加载。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-kotlin/src/index.ts、dsh-lsp-kotlin/README.md、dsh-lsp-kotlin/cordis.yml、dsh-lsp-kotlin/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：固定宿主验证脚本与源码、首次索引、JDK不匹配和缺serverskip；本轮未运行。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：将.kt与.kts分别验收，并记录Gradle依赖索引状态，可发现脚本被误当普通源码的导航缺口。对纯Kotlin、Gradle脚本及缺JDK项目比较查询结果和误归因。

固定宿主验证脚本与源码、首次索引、JDK不匹配和缺serverskip；本轮未运行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-kotlin；内容摘要：ba8fd5fac834433b4e4c0f5c3a52a0d529dbcbca9ccd0e215fe5fb3baa6cca9d。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 125 | — | — | 939 |
| .ts | source | 1 | 172 | 96 | 60 | — |
| .ts | test | 1 | 176 | 127 | 25 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
