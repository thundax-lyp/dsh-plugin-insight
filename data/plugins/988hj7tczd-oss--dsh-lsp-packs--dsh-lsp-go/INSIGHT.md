# dsh-lsp-go

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：为DSH配置gopls的Go代码导航路由。

> **核心亮点**：本项将gopls默认命令和Go扩展装配为语言包，比手写servers配置更直接；接口实现与引用计算归gopls和官方工具，不属于本包新算法。

> **风险与缺陷**：README的测试有go.mod和特定shape/circle样例；成功不能外推多模块、工作区或依赖下载条件。PATH内gopls不表示Go工具链与模块环境一致，测试server缺失会skip。fallback使用默认表而非合并扩展，配置变化的故障状态需单验。

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

> **用途**：适合已有Go模块、需要在DSH查定义、引用与接口实现的开发者。

替代是编辑器gopls或自定义DSH servers行；插件只是标准接线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **后台**：go provider：gopls和.go映射

**流程与依赖**

go入口注册go provider，默认gopls空args与.go→go，调用官方LspStdio；README要求Go安装目录下bin可被PATH找到。

官方fs/lsp/subprocess及LSP工具，README要求gopls和Go模块环境；DSH声明>=0.1.2-alpha.3 <0.2.0、Node>=22.18。

装底座与Go包→外部gopls可用→.go查询触发懒启动→模块索引→导航；缺server回占位错误。

**效果与成本**

首次安装Go/gopls并设置GOPATH bin和共享底座；持续索引与依赖解析占资源，人工维护模块环境，现金无额外固定费证据。

减少Go路由设置，无多模块任务准确性对照。

> **思考**：README的测试有go.mod和特定shape/circle样例；成功不能外推多模块、工作区或依赖下载条件。PATH内gopls不表示Go工具链与模块环境一致，测试server缺失会skip。fallback使用默认表而非合并扩展，配置变化的故障状态需单验。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：本项将gopls默认命令和Go扩展装配为语言包，比手写servers配置更直接；接口实现与引用计算归gopls和官方工具，不属于本包新算法。

本项将gopls默认命令和Go扩展装配为语言包，比手写servers配置更直接；接口实现与引用计算归gopls和官方工具，不属于本包新算法。

go的resolveServerConfig保留显式args替换和extension合并，配置层清晰；组件统计不包含gopls或stdio底座，catch-all不可用提示需保留原错误。

源码依据：[dsh-lsp-go/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/src/index.ts)、[dsh-lsp-go/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/README.md)、[dsh-lsp-go/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/cordis.yml)、[dsh-lsp-go/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/tests/smoke.e2e.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

README的测试有go.mod和特定shape/circle样例；成功不能外推多模块、工作区或依赖下载条件。PATH内gopls不表示Go工具链与模块环境一致，测试server缺失会skip。fallback使用默认表而非合并扩展，配置变化的故障状态需单验。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有Go模块可试。先核gopls PATH和go.mod，再测接口实现与跨包引用，测试skip应单独查看。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-go/src/index.ts、dsh-lsp-go/README.md、dsh-lsp-go/cordis.yml、dsh-lsp-go/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：测单模块/嵌套模块、缺PATH、用户扩展和接口实现，再检查四操作真实结果；本轮未启动gopls。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：在Go包查询前报告模块根与gopls/Go环境是否匹配，可减少错误工作区导致的空结果。用go.mod缺失、嵌套模块和正常接口项目比较定义/实现命中与排障时间。

测单模块/嵌套模块、缺PATH、用户扩展和接口实现，再检查四操作真实结果；本轮未启动gopls。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-go；内容摘要：691e01e445ebd427d0ba52ed967028d89dd25bc9d08638839dd601aa4d952453。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 123 | — | — | 956 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 187 | 139 | 25 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
