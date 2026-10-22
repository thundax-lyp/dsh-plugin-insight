# dsh-lsp-lua

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：为DSH配置LuaLS的Lua代码导航路由。

> **核心亮点**：增量是将LuaLS命令、扩展和可覆盖设置接到DSH统一导航工具；相对自建协议客户端省接线，Lua分析和协议均属上游。

> **风险与缺陷**：README称单文件可索引，但Lua运行时全局变量、第三方库和嵌入环境依赖具体configuration，本包没有按游戏/宿主环境给配置。--stdio和用户参数覆盖是否适配本机LuaLS需实测；fallback丢新增扩展且catch会混淆配置与缺二进制。

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

> **用途**：适合已有lua-language-server、希望在DSH查看Lua符号的开发者。

替代是编辑器LuaLS或手写servers；不提供Lua运行时或代码执行。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **后台**：lua provider、.lua映射与LuaLS配置透传

**流程与依赖**

lua入口默认lua-language-server --stdio，provider lua映射.lua；initializationOptions与configuration透传官方LspStdio。

官方fs/lsp/subprocess/stdio/tool-lsp；README前置LuaLS可执行程序，Node>=22.18及DSH<0.2.0声明。

装基础服务与Lua包→配置LuaLS及库→首次.lua查询启动服务→读取符号；缺server返回结构化错误。

**效果与成本**

首次安装LuaLS、PATH及共享底座；持续索引和自定义库配置人工维护，现金无本包固定费证据。

简化LuaLS接线，未证嵌入Lua业务工程导航收益。

> **思考**：README称单文件可索引，但Lua运行时全局变量、第三方库和嵌入环境依赖具体configuration，本包没有按游戏/宿主环境给配置。--stdio和用户参数覆盖是否适配本机LuaLS需实测；fallback丢新增扩展且catch会混淆配置与缺二进制。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：增量是将LuaLS命令、扩展和可覆盖设置接到DSH统一导航工具；相对自建协议客户端省接线，Lua分析和协议均属上游。

增量是将LuaLS命令、扩展和可覆盖设置接到DSH统一导航工具；相对自建协议客户端省接线，Lua分析和协议均属上游。

Lua包透传configuration而不复制LuaLS协议，复用边界清晰；错误归因及覆盖映射回退需核。规模仅Lua组件不等于LuaLS原创量。

源码依据：[dsh-lsp-lua/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/src/index.ts)、[dsh-lsp-lua/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/README.md)、[dsh-lsp-lua/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/cordis.yml)、[dsh-lsp-lua/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/tests/smoke.e2e.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

README称单文件可索引，但Lua运行时全局变量、第三方库和嵌入环境依赖具体configuration，本包没有按游戏/宿主环境给配置。--stdio和用户参数覆盖是否适配本机LuaLS需实测；fallback丢新增扩展且catch会混淆配置与缺二进制。

<a id="detail-section-6"></a>

### 1.5 使用建议

单文件Lua可先试；有宿主全局或第三方库时先核configuration，再测实际符号。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-lua/src/index.ts、dsh-lsp-lua/README.md、dsh-lsp-lua/cordis.yml、dsh-lsp-lua/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：核标准函数、宿主全局、库路径、--stdio参数及自定义扩展故障；本轮未启动LuaLS。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：提供明确来源的Lua运行时库配置预览，可降低嵌入环境全局符号漏解。比较标准Lua和宿主自定义全局两种项目，测hover/定义覆盖及误报，不能把预设当普遍正确。

核标准函数、宿主全局、库路径、--stdio参数及自定义扩展故障；本轮未启动LuaLS。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-lua；内容摘要：001f937d5018c84c75fc21829174d75463143282d8a0ed619c09e10c17b589cb。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 126 | — | — | 932 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 175 | 126 | 25 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
