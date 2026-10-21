# dsh-lsp-swift

> 为DSH配置SourceKit-LSP的Swift代码导航路由。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

**使用建议**：先确认所选工具链并构建测试工程，再分别检查四操作；尤其看引用/实现是否被跳过。

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

- **用途**：适合已有Xcode或Swift工具链、需要DSH访问SwiftPM符号的开发者。

- **建议**：未验证假设：把编译索引就绪与可启动服务拆开显示，可减少Swift四操作半可用被当全面可用。用成功build、失败build和不同工具链比较引用/实现结果及skip提示。

先确认所选工具链并构建测试工程，再分别检查四操作；尤其看引用/实现是否被跳过。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

替代是Xcode/SourceKit编辑器或手配stdio；插件不提供Swift编译器或IndexStore。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：swift provider与.swift映射

**流程与依赖**

swift入口默认sourcekit-lsp空args，provider swift映射.swift；官方LspStdio负责启动。组件测试另有swift build预构建守卫以取得索引。

fs/lsp/subprocess/stdio/tool-lsp；README指定Xcode或Swift.org中的sourcekit-lsp，测试SwiftPM依赖swift build；DSH<0.2.0、Node>=22.18声明。

工具链就绪→装包→项目构建索引→.swift查询懒启动服务→四操作各自验收；缺服务回占位错误。

**效果与成本**

首次准备Xcode/Swift工具链和SwiftPM工程，持续build与索引有时间、磁盘和人工配置成本；现金取决于已有开发环境，没有插件定价证据。

减少SourceKit接线，无Swift工程整体任务收益数据。

- **思考**：README与测试说明引用/实现依赖SwiftPM构建；构建失败时相关测试显式skip，定义/hover通过不能当四操作全通过。默认PATH选择的SourceKit可能与项目工具链不同。配置层catch不能区分无可执行与索引缺失，错误应按阶段解释。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：本项提供Swift工具链服务的DSH接线与默认映射，不实现SourceKit索引；相对手配更简洁，但可用性仍取决于构建产生的索引。

本项提供Swift工具链服务的DSH接线与默认映射，不实现SourceKit索引；相对手配更简洁，但可用性仍取决于构建产生的索引。

组件保持配置层、测试显式区分预构建失败是可借鉴处；源码未因此实现构建自动化，运行期索引由外部负责。规模只计swift目录。

源码依据：[dsh-lsp-swift/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/src/index.ts)、[dsh-lsp-swift/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/README.md)、[dsh-lsp-swift/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/cordis.yml)、[dsh-lsp-swift/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/tests/smoke.e2e.ts)。

<a id="detail-section-5"></a>

### 主要限制

README与测试说明引用/实现依赖SwiftPM构建；构建失败时相关测试显式skip，定义/hover通过不能当四操作全通过。默认PATH选择的SourceKit可能与项目工具链不同。配置层catch不能区分无可执行与索引缺失，错误应按阶段解释。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-swift/src/index.ts、dsh-lsp-swift/README.md、dsh-lsp-swift/cordis.yml、dsh-lsp-swift/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：固定宿主比较有/无构建索引及工具链切换，记录refs/implementation的skip；本轮未运行swift build。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：把编译索引就绪与可启动服务拆开显示，可减少Swift四操作半可用被当全面可用。用成功build、失败build和不同工具链比较引用/实现结果及skip提示。

固定宿主比较有/无构建索引及工具链切换，记录refs/implementation的skip；本轮未运行swift build。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-swift；内容摘要：fb7c4bece6ed7aeecfdb2ddd91f7d9895b87b2f16513c4996f5f1baef180d9c1。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 124 | — | — | 967 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 194 | 146 | 28 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
