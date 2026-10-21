# dsh-lsp-cpp

> 为DSH配置clangd的C/C++语言服务路由和文件扩展映射。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

**使用建议**：已有clangd项目可先试。先确认构建数据库和头文件语言，再在真实工程测跨文件定义/引用；单文件通过不能直接覆盖整个代码库。

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

- **用途**：适合已有C/C++工具链、希望在DSH查询定义与引用的开发者；跨文件结果取决于实际项目构建信息。

- **建议**：待验证假设：clangd接线增加构建数据库存在性和头文件语言选择的只读诊断，可减少把项目配置错归因于模型导航。用有/无compile_commands及混合C/C++头文件项目比较定位正确率和排障时间；诊断不可替代真实server查询。

已有clangd项目可先试。先确认构建数据库和头文件语言，再在真实工程测跨文件定义/引用；单文件通过不能直接覆盖整个代码库。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

替代是编辑器clangd或手写DSH servers配置；本项提供标准默认接线，不实现clangd或LSP协议。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：cpp provider配置：clangd及C/C++扩展路由、不可用占位

**流程与依赖**

dsh-lsp-cpp/src/index.ts以provider cpp、command clangd和空args配置官方LspStdio，映射.c/.h到c、.cpp/.hpp/.cc到cpp；cordis.yml只插入语言包行。

依赖fs/lsp/subprocess同一执行世界及官方dsh-lsp-stdio/tool-lsp；README前置clangd及C/C++工具链，精确跨文件需compile_commands。package兼容Node>=22.18、DSH>=0.1.2-alpha.3且<0.2.0。

部署共享底座→安装语言包和外部clangd→首次匹配查询由底座懒启动→返回导航结果；加载失败注册LSP_UNAVAILABLE占位而非执行查询。

**效果与成本**

首次安装clangd并配置PATH、共享LSP底座及构建数据库；持续索引耗CPU/内存，人工维护编译参数。无本包固定现金费，失败导航与错误修改需另计人工成本。

可减少语言配置重复，但没有真实C/C++工程导航准确率或工时对照。

- **思考**：README要求精确跨文件导航生成compile_commands.json；单文件smoke不代表宏、头文件搜索路径和多目标工程都正确。.h默认路由c并不覆盖所有C++头文件语义。catch把任意LspStdio加载错误称server不可用，fallback还用默认扩展表，用户扩展可能在故障时消失。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：作者称开箱语言导航；本项实际增量是clangd启动默认值和C/C++扩展路由、可覆盖配置及不可用占位provider。协议和lsp工具由官方底座实现，不能将完整LSP能力归为本包原创；相对手写servers表，减少常见C/C++接线。

作者称开箱语言导航；本项实际增量是clangd启动默认值和C/C++扩展路由、可覆盖配置及不可用占位provider。协议和lsp工具由官方底座实现，不能将完整LSP能力归为本包原创；相对手写servers表，减少常见C/C++接线。

本包resolveServerConfig把默认值与覆盖合并，再经官方Config填界限，fallback有生命周期清理。统计仅本组件文件，生成骨架不等于协议创新；错误分类和扩展回退需改进。

源码依据：[dsh-lsp-cpp/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp/src/index.ts)、[dsh-lsp-cpp/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp/README.md)、[dsh-lsp-cpp/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp/cordis.yml)、[dsh-lsp-cpp/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp/tests/smoke.e2e.ts)。

跨插件比较：cpp与java的入口均把默认命令、扩展表和可覆盖参数交给同一官方LspStdio，协议复用相同；差异主要在项目就绪条件。cpp依赖clangd与compile_commands.json，java依赖作者README所列JDK/jdtls及独立Eclipse工作区。两者catch均把加载异常统称服务不可用，且故障provider使用默认扩展表。由此推导待验证假设：统一诊断框架应保留实际扩展配置并按“宿主装配、命令、项目元数据、索引就绪”逐层报告，各语言提供独立探针。在C/C++缺编译数据库与Java工作区锁冲突的故障矩阵中，对照当前统一错误，比较归因正确率和恢复时间；未执行该验证，不能从同骨架推断同等导航质量。

对照源码：[Java入口](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/src/index.ts)、[Java前置条件](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/README.md)。

<a id="detail-section-5"></a>

### 主要限制

README要求精确跨文件导航生成compile_commands.json；单文件smoke不代表宏、头文件搜索路径和多目标工程都正确。.h默认路由c并不覆盖所有C++头文件语义。catch把任意LspStdio加载错误称server不可用，fallback还用默认扩展表，用户扩展可能在故障时消失。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-cpp/src/index.ts、dsh-lsp-cpp/README.md、dsh-lsp-cpp/cordis.yml、dsh-lsp-cpp/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：固定宿主检查混合.h、构建数据库缺失、用户新增扩展与加载故障，分别记录四个导航操作；本轮未启动clangd。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：clangd接线增加构建数据库存在性和头文件语言选择的只读诊断，可减少把项目配置错归因于模型导航。用有/无compile_commands及混合C/C++头文件项目比较定位正确率和排障时间；诊断不可替代真实server查询。

固定宿主检查混合.h、构建数据库缺失、用户新增扩展与加载故障，分别记录四个导航操作；本轮未启动clangd。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-cpp；内容摘要：ebf891edaf7384303300d2c908536fc22d43d207d9a7715699e583d084e6c8ae。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 132 | — | — | 982 |
| .ts | source | 1 | 175 | 99 | 60 | — |
| .ts | test | 1 | 185 | 136 | 25 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+created%3A2026-09-21T04%3A10%3A32.362Z..2026-10-21T04%3A10%3A32.362Z)

暂未获取：近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
