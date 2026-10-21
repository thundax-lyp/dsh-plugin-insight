# dsh-lsp-ts

> 为DSH配置TypeScript/JavaScript语言服务及四类文件映射。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

**使用建议**：先在真实tsconfig项目核普通与React文件；需要新模块扩展时显式配置并测试失败回退，别只跑单文件样例。

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

- **用途**：适合已有TypeScript/JavaScript工程、希望DSH查询普通源码与React文件的开发者。

- **建议**：未验证假设：按项目配置和模块扩展预检路由，再保留覆盖后的fallback，可减少ESM/CJS与React文件漏路由。用四默认扩展和.mts/.mjs、别名monorepo比较路由及定义查询。

先在真实tsconfig项目核普通与React文件；需要新模块扩展时显式配置并测试失败回退，别只跑单文件样例。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

替代是编辑器tsserver或手写多个语言ID；本包增加标准配置而非新类型推理。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：ts provider及TS/JS/React四种默认扩展路由

**流程与依赖**

ts入口默认typescript-language-server --stdio，provider ts将.ts/.tsx/.js/.jsx分别映射typescript/typescriptreact/javascript/javascriptreact，调用官方stdio底座。

fs/lsp/subprocess及官方LSP底座，README要求typescript-language-server并推荐同装typescript；DSH<0.2.0、Node>=22.18声明。

外部server安装→TS包注册四类扩展→查询懒启动→工程配置解析→导航；加载失败仅默认映射的占位provider。

**效果与成本**

首次安装server与README推荐的TypeScript、底座和项目配置；持续tsserver索引及版本升级维护，现金无插件固定费证据，人工排查别名和模块边界。

减少多扩展接线，无monorepo或JS/TS混合工程效果对照。

- **思考**：README单文件无需tsconfig的smoke不能代表monorepo、paths别名或JS配置解析。默认表未含.mts/.cts/.mjs/.cjs，用户可扩展但失败fallback只保留默认四类，覆盖后的故障路由会变。TS版本选择也需与工程匹配。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把TS/JS及React语言ID的常见映射做成独立包，减少易错手配；分析来自typescript-language-server/tsserver，协议和lsp工具归官方底座。

把TS/JS及React语言ID的常见映射做成独立包，减少易错手配；分析来自typescript-language-server/tsserver，协议和lsp工具归官方底座。

显式语言ID映射比统一当typescript清楚，覆盖表合并可扩展；catch fallback未使用合并表是具体缺口。组件体量不包括tsserver或十二包共享协议。

源码依据：[dsh-lsp-ts/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/src/index.ts)、[dsh-lsp-ts/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/README.md)、[dsh-lsp-ts/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/cordis.yml)、[dsh-lsp-ts/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/tests/smoke.e2e.ts)。

<a id="detail-section-5"></a>

### 主要限制

README单文件无需tsconfig的smoke不能代表monorepo、paths别名或JS配置解析。默认表未含.mts/.cts/.mjs/.cjs，用户可扩展但失败fallback只保留默认四类，覆盖后的故障路由会变。TS版本选择也需与工程匹配。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-ts/src/index.ts、dsh-lsp-ts/README.md、dsh-lsp-ts/cordis.yml、dsh-lsp-ts/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：验证React、paths别名、多包和ESM/CJS新增扩展及故障回退；本轮未启动语言服务。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：按项目配置和模块扩展预检路由，再保留覆盖后的fallback，可减少ESM/CJS与React文件漏路由。用四默认扩展和.mts/.mjs、别名monorepo比较路由及定义查询。

验证React、paths别名、多包和ESM/CJS新增扩展及故障回退；本轮未启动语言服务。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-ts；内容摘要：0861cee7b50319bcdabf2578531986c1051e40b68f33e00185cddfb92da93376。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 127 | — | — | 947 |
| .ts | source | 1 | 174 | 98 | 60 | — |
| .ts | test | 1 | 175 | 126 | 25 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
