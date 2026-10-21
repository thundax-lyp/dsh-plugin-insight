# dsh-lsp-pyright

> 为DSH配置Pyright的Python与存根文件导航路由。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

**使用建议**：先在小Python项目试，再核venv和.pyi优先关系；单文档hover通过不等于全项目类型信息正确。

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

- **用途**：适合已有Python项目、希望在DSH查询源码和.pyi存根的开发者。

- **建议**：未验证假设：把所选Python环境与Pyright导入解析配置一同显示，可减少错环境导致的空定义。对两个venv同名包、.pyi与源码冲突样本比较定位和排障时间。

先在小Python项目试，再核venv和.pyi优先关系；单文档hover通过不等于全项目类型信息正确。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

替代是编辑器Pyright或自配DSH server；插件不安装Python包、不提供类型推断实现。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：pyright provider与.py/.pyi映射

**流程与依赖**

pyright入口默认pyright-langserver --stdio，provider pyright将.py/.pyi映射python，配置与字节/超时限制交官方LspStdio处理。

fs/lsp/subprocess、官方LSP底座与外部pyright-langserver；README列npm/pip/pipx安装路径；兼容声明Node>=22.18、DSH<0.2.0。

外部Pyright就绪→装包并配置Python工程→首次.py/.pyi查询→底座启动→导航；缺server回LSP_UNAVAILABLE。

**效果与成本**

首次安装Pyright并配置项目环境和底座；持续维护解释器与类型存根，现金无本包费用证据，人工需核依赖版本。

减少Python服务配置，无真实多环境工程效果数据。

- **思考**：README单文档smoke和docstring hover不能覆盖虚拟环境、第三方导入及多根工程。npm/pip/pipx安装途径的PATH和实际解释器并不由本包选择；有.py路由不表示解释器环境正确。fallback用默认表会丢新增扩展，加载错误也可能不是没装server。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：新增Python及存根扩展的标准配置接线，减少重复注册；Pyright类型分析来自外部server，官方底座提供协议和工具，非本项新推理能力。

新增Python及存根扩展的标准配置接线，减少重复注册；Pyright类型分析来自外部server，官方底座提供协议和工具，非本项新推理能力。

Pyright配置包本身小且透传initializationOptions/configuration，避免复制类型引擎；扩展默认清晰，环境发现与错误细分需由使用者/底座解决。统计只计本组件。

源码依据：[dsh-lsp-pyright/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/src/index.ts)、[dsh-lsp-pyright/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/README.md)、[dsh-lsp-pyright/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/cordis.yml)、[dsh-lsp-pyright/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/tests/smoke.e2e.ts)。

<a id="detail-section-5"></a>

### 主要限制

README单文档smoke和docstring hover不能覆盖虚拟环境、第三方导入及多根工程。npm/pip/pipx安装途径的PATH和实际解释器并不由本包选择；有.py路由不表示解释器环境正确。fallback用默认表会丢新增扩展，加载错误也可能不是没装server。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-pyright/src/index.ts、dsh-lsp-pyright/README.md、dsh-lsp-pyright/cordis.yml、dsh-lsp-pyright/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：核venv导入、.pyi符号、缺PATH、覆盖扩展和真实四操作；本轮未运行Pyright。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：把所选Python环境与Pyright导入解析配置一同显示，可减少错环境导致的空定义。对两个venv同名包、.pyi与源码冲突样本比较定位和排障时间。

核venv导入、.pyi符号、缺PATH、覆盖扩展和真实四操作；本轮未运行Pyright。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-pyright；内容摘要：e434e0bea36d668025e6df8f0b05fb6c79b5211bf55a2e1cf949eedfb5cb3c19。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 125 | — | — | 952 |
| .ts | source | 1 | 172 | 96 | 60 | — |
| .ts | test | 1 | 177 | 128 | 25 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
