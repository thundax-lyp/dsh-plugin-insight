# dock-editor

> 把受限文本读写与CodeMirror编辑接入Dock文件查看器。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f6e5e08](https://github.com/AKS1st/dock-editor/tree/f6e5e0845c42e2b09a7a8d671a66b331fe094634)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-editor) [![npm 30d 903](https://img.shields.io/static/v1?label=npm+30d&message=903&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-editor) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-editor)
<!-- END META -->

**使用建议**：适合工作区小文本的辅助编辑；先验证保存冲突与关闭恢复，再处理重要文件。

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

- **用途**：在聊天旁查看和编辑会话工作区的小型文本文件，外部绝对路径只读。

- **建议**：未验证假设：保存请求附读取时内容摘要并在冲突时提供重新载入/差异视图，可减少静默覆盖。以两个编辑者交错保存及外部修改样本比较覆盖率和恢复工时，冲突必须保留双方内容。

适合工作区小文本的辅助编辑；先验证保存冲突与关闭恢复，再处理重要文件。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照CodeMirror编辑器与外部IDE；增量是Dock资源分派、脏状态关闭保护和会话工作区写入约束，不是新编辑引擎。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：Dock文本编辑与默认文件viewer
- **Host 路由**：/desk-editor/fs.read和fs.write

**流程与依赖**

服务端注册/desk-editor读写路由，客户端向files注册默认文本viewer、向workbench注册编辑视图；EditorView管理加载、dirty与保存，CodeMirror负责编辑器能力。

依赖Dock的workbench、dock-files文件viewer服务及宿主webServer/sessions/webRuntime；CodeMirror随构建打包，服务契约副本须与运行版本一致。

文件分派→fs.read返回内容、binary/truncated/writable→编辑→fs.write→更新dirty；关闭前用seed元数据提示未保存内容。

**效果与成本**

需三个插件兼容与构建产物，日常维护编辑状态和API版本；无模型token调用，浏览器内存与文本限制约束大文件。

减少小改动切换应用的步骤，未有耗时/丢失率对照或真实宿主验收。

- **思考**：fs.write最终直接writeFile且没有原内容/mtime版本比较；外部程序或另一视图修改后，保存可能覆盖新内容。关闭提示不能解决并发写；读取允许任意绝对路径，工作区约束只适用于写入，不能将其描述为完整读隔离。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：将编辑权限和显示状态接起来：读取最多256KiB并识别NUL二进制，截断或外部只读文件禁保存，写端独立realpath约束会话工作区。核心编辑能力归CodeMirror，项目贡献在宿主接线和有限文本操作。

将编辑权限和显示状态接起来：读取最多256KiB并识别NUL二进制，截断或外部只读文件禁保存，写端独立realpath约束会话工作区。核心编辑能力归CodeMirror，项目贡献在宿主接线和有限文本操作。

读写权限分层、服务端独立写约束、dirty同步到工作台关闭钩子可复用；生成bundle与CodeMirror体量不能当作本插件原创实现。

源码依据：[src/index.ts](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts)、[src/client/index.ts](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/index.ts)、[src/client/EditorView.tsx](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/EditorView.tsx)、[src/client/CodeMirrorEditor.tsx](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/CodeMirrorEditor.tsx)。

跨插件比较：dock基座提供视图注册、实例seed和beforeClose；dock-files把带session的资源地址解析成路径，再交workbench.openPath；dock-editor读端允许绝对路径、写端独立限制会话工作区，并直接writeFile。它们分别解决界面生命周期、资源分派和写入范围，关闭提示与路径围栏都不能替代保存时的版本比较。由此推导未验证假设：跨插件资源句柄统一携带原会话身份、读写能力及读取版本，保存时比较内容摘要，冲突保留两份内容。这可能降低Agent与人工编辑同一文件时的静默覆盖，也便于追踪资源归属。最小验证用两个会话和外部改写交错打开/保存，对照现有路径传递，测错误目标、覆盖率及恢复工时；若冲突率或恢复成本未改善则否定，不宣称当前组合已通过安全或并发验收。

对照源码：[AKS1st/dock/src/client/service.ts](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts)、[AKS1st/dock-files/src/client/openBridge.ts](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/client/openBridge.ts)、[AKS1st/dock-editor/src/index.ts](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts)。

<a id="detail-section-5"></a>

### 主要限制

fs.write最终直接writeFile且没有原内容/mtime版本比较；外部程序或另一视图修改后，保存可能覆盖新内容。关闭提示不能解决并发写；读取允许任意绝对路径，工作区约束只适用于写入，不能将其描述为完整读隔离。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AKS1st/dock-editor](https://github.com/AKS1st/dock-editor)
- **版本号**：0.2.2（[固定提交 f6e5e084](https://github.com/AKS1st/dock-editor/tree/f6e5e0845c42e2b09a7a8d671a66b331fe094634)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/client/index.ts、src/client/EditorView.tsx、src/client/CodeMirrorEditor.tsx、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：在隔离工作区检查同时保存、软链接外写拒绝、超限/二进制只读和取消关闭；本轮未执行。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：保存请求附读取时内容摘要并在冲突时提供重新载入/差异视图，可减少静默覆盖。以两个编辑者交错保存及外部修改样本比较覆盖率和恢复工时，冲突必须保留双方内容。

在隔离工作区检查同时保存、软链接外写拒绝、超限/二进制只读和取消关闭；本轮未执行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：bae481108bb81042acec8ec2bfcf27c0fc4c4cd98b04cc50010fb0a621642608。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 30952 | 26213 | 5076 | — |
| .md | source | 2 | 131 | — | — | 1838 |
| .ts | source | 8 | 1310 | 872 | 348 | — |
| .tsx | source | 3 | 808 | 625 | 129 | — |
| .mjs | source | 1 | 52 | 38 | 12 | — |

排除 11 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-editor/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
