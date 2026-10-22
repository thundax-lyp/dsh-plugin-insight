# dsh-lsp-csharp

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：为DSH配置OmniSharp或自定义C#语言服务的导航路由。

> **核心亮点**：贡献是将C#启动器差异纳入独立包的覆盖参数，减少手写DSH连接表；符号分析来自OmniSharp或替换server，协议来自官方底座。

> **风险与缺陷**：README的裸Sample.cs测试不能证明.sln/.csproj解析与项目引用正常。默认omnisharp并不等同dotnet DLL启动形式；替换Roslyn还需核其参数和协议，不能仅凭command字段可改就宣称drop-in兼容。catch还把配置错误统一归为服务不可用。

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

> **用途**：适合已有.NET项目、希望从DSH访问C#符号的开发者。

替代为IDE C#服务或手写servers表；本包不提供编译器或Roslyn索引。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **后台**：csharp provider及.cs默认映射、可覆盖启动参数

**流程与依赖**

csharp入口以provider csharp调用官方LspStdio，默认omnisharp --stdio，.cs→csharp；command/args可替换为dotnet及OmniSharp.dll路径。

fs/lsp/subprocess和官方LSP底座、README所述.NET SDK或Mono及OmniSharp；兼容声明DSH<0.2.0、Node>=22.18。

共享底座→C#包→解析omnisharp或覆盖dotnet DLL→查询触发索引→结果；缺服务返回LSP_UNAVAILABLE，修复后重载。

**效果与成本**

首次准备README所述.NET SDK或Mono、OmniSharp及项目；持续成本为项目加载内存与SDK升级适配，现金无插件收费证据，人工核查项目引用。

可省C#服务接线，没有跨解决方案导航效果数据。

> **思考**：README的裸Sample.cs测试不能证明.sln/.csproj解析与项目引用正常。默认omnisharp并不等同dotnet DLL启动形式；替换Roslyn还需核其参数和协议，不能仅凭command字段可改就宣称drop-in兼容。catch还把配置错误统一归为服务不可用。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：贡献是将C#启动器差异纳入独立包的覆盖参数，减少手写DSH连接表；符号分析来自OmniSharp或替换server，协议来自官方底座。

贡献是将C#启动器差异纳入独立包的覆盖参数，减少手写DSH连接表；符号分析来自OmniSharp或替换server，协议来自官方底座。

csharp组件的覆盖表和fallback复用同一生成骨架，原创建议只认配置增量；失败占位使用默认.cs表，用户新增扩展未保留，且加载错误解释较宽。

源码依据：[dsh-lsp-csharp/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/src/index.ts)、[dsh-lsp-csharp/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/README.md)、[dsh-lsp-csharp/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/cordis.yml)、[dsh-lsp-csharp/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/tests/smoke.e2e.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

README的裸Sample.cs测试不能证明.sln/.csproj解析与项目引用正常。默认omnisharp并不等同dotnet DLL启动形式；替换Roslyn还需核其参数和协议，不能仅凭command字段可改就宣称drop-in兼容。catch还把配置错误统一归为服务不可用。

<a id="detail-section-6"></a>

### 1.5 使用建议

先按本机OmniSharp分发形式设置命令，再在真实csproj检查定义和引用；单文件示例不能代表解决方案。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-csharp/src/index.ts、dsh-lsp-csharp/README.md、dsh-lsp-csharp/cordis.yml、dsh-lsp-csharp/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：分别验证exe/DLL配置、缺SDK、csproj跨文件与替换server，检查测试实际跳过项；本轮未运行。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：按可执行程序、dotnet DLL和项目文件分别预检，可缩短C#首次配置时间。对三个布局及错误SDK版本比较启动归因与跨项目引用命中；若只检查命令存在不能预测索引成功，保留人工验证。

分别验证exe/DLL配置、缺SDK、csproj跨文件与替换server，检查测试实际跳过项；本轮未运行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-csharp；内容摘要：0567515c37812ca654c3c5a851c444e85cce716c7ecae60c5dc6c80f7ca6fb4a。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 139 | — | — | 1009 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 183 | 134 | 25 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
