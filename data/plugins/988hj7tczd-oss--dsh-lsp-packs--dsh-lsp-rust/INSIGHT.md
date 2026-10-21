# dsh-lsp-rust

> 为DSH配置rust-analyzer的Rust代码导航路由。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

**使用建议**：先核rustup组件与Cargo工程，再用真实trait和跨crate符号试；不要只看可执行路径。

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

- **用途**：适合已有Cargo工程、希望在DSH查询trait实现与引用的开发者。

- **建议**：未验证假设：预检区分shim存在、rust-analyzer组件和Cargo工作区加载状态，可降低Rust导航空结果误判。用缺组件、不同features和正常trait项目测故障归因与实现查询命中。

先核rustup组件与Cargo工程，再用真实trait和跨crate符号试；不要只看可执行路径。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

替代是IDE rust-analyzer或自配server；本项不构建或验证Rust代码。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：rust provider与.rs映射

**流程与依赖**

rust入口默认rust-analyzer空args，provider rust映射.rs，所有初始化和限制字段传官方stdio底座。

官方fs/lsp/subprocess及LSP工具，README要求rust-analyzer、rustc/rustup和Cargo项目；DSH<0.2.0、Node>=22.18声明。

配置工具链→装Rust包→.rs查询触发底座与Cargo/sysroot索引→返回结果；缺组件以不可用错误暴露。

**效果与成本**

首次安装工具链及server组件、准备Cargo工程；持续索引和特性配置占资源，人工核宏/feature条件；现金无插件费依据。

减少Rust接线，无真实workspace导航收益对照。

- **思考**：README测试创建Cargo.toml并要求rust工具链索引sysroot；PATH上的rustup shim存在不表示component已安装。单trait样例不能覆盖宏生成、features和workspace。catch统一错误与默认扩展fallback会弱化这些故障差异。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把Rust server命令和扩展配置标准化为独立包，减少DSH手工装配；trait实现和sysroot索引归rust-analyzer，不是本包创新。

把Rust server命令和扩展配置标准化为独立包，减少DSH手工装配；trait实现和sysroot索引归rust-analyzer，不是本包创新。

rust/src配置层明确而不复制分析器，fallback可维持默认路由；广泛catch和扩展丢失需修。统计限定组件，不含rust-analyzer和官方底座。

源码依据：[dsh-lsp-rust/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/src/index.ts)、[dsh-lsp-rust/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/README.md)、[dsh-lsp-rust/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/cordis.yml)、[dsh-lsp-rust/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/tests/smoke.e2e.ts)。

<a id="detail-section-5"></a>

### 主要限制

README测试创建Cargo.toml并要求rust工具链索引sysroot；PATH上的rustup shim存在不表示component已安装。单trait样例不能覆盖宏生成、features和workspace。catch统一错误与默认扩展fallback会弱化这些故障差异。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-rust/src/index.ts、dsh-lsp-rust/README.md、dsh-lsp-rust/cordis.yml、dsh-lsp-rust/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：检查缺组件shim、feature切换、workspace跨crate及实现查询；本轮未启动Rust工具链。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：预检区分shim存在、rust-analyzer组件和Cargo工作区加载状态，可降低Rust导航空结果误判。用缺组件、不同features和正常trait项目测故障归因与实现查询命中。

检查缺组件shim、feature切换、workspace跨crate及实现查询；本轮未启动Rust工具链。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-rust；内容摘要：4dd7801cd4c0040b69bea7c4da92d0791b8c2d382db0524878beafb1328add06。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 124 | — | — | 962 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 187 | 139 | 25 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
