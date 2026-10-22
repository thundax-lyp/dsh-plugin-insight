# dsh-custom-plugin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[901a665](https://github.com/AlexPeng07/dsh-custom-plugin/tree/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin) [![npm 30d 2,207](https://img.shields.io/static/v1?label=npm+30d&message=2%2C207&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin)
<!-- END META -->

> **实现功能**：组合外观、项目文件夹、提示库、会话导出、搜索与用量观察。

> **核心亮点**：将用户便利数据归为统一可备份状态，并把凭据从公开state投影剥离；价值在本地操作一致性，Mermaid/计价/外观来自成熟方法，不视为新的交付机制。

> **风险与缺陷**：credentialStore.set失败时明确退回state.apiKey明文，saveStateFile普通JSON写入未显式0600；“备份无密钥/前端不返回”不等于磁盘不落密钥。扫描/计价依赖宿主usage与价格，不能把消费数字当项目真实成本或成果。

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

> **用途**：希望集中管理本地会话资料和个性化设置的DSH用户。

参照宿主设置、手动导出和多个便利插件；增量为统一状态与备份/搜索交互，功能数量不当作机制创新。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：custom_plugin_status状态查询
- **Host 路由**：状态、会话导出/搜索、备份和余额等接口
- **事件监听**：会话usage与模型上下文折叠
- **界面**：外观、项目资料与便利面板

**流程与依赖**

主机CustomPluginHost串行状态操作，事件折叠usage，路由提供状态/时间线/导出/备份/搜索/余额及Mermaid；客户端官方slots挂便利界面，状态保存DSH_HOME。

webServer/tools、会话查询/持久化、客户端slots与可选系统凭据；余额需DeepSeek网络，Mermaid本地包缺失时CDN回退。

读取状态/迁移→用户编辑/搜索/导出→校验并串行保存→UI刷新；备份可预览后merge/replace并保留恢复点；usage只是观察，提示库插入后仍用户提交。

**效果与成本**

首配和多功能状态迁移、模型提示另计token；扫描历史/导出有I/O，外观GPU与CDN网络，人工确认备份替换和导出隐私。

集中便利与secret-free备份有实现，无节约工时或任务质量提升验证。

> **思考**：credentialStore.set失败时明确退回state.apiKey明文，saveStateFile普通JSON写入未显式0600；“备份无密钥/前端不返回”不等于磁盘不落密钥。扫描/计价依赖宿主usage与价格，不能把消费数字当项目真实成本或成果。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将用户便利数据归为统一可备份状态，并把凭据从公开state投影剥离；价值在本地操作一致性，Mermaid/计价/外观来自成熟方法，不视为新的交付机制。

将用户便利数据归为统一可备份状态，并把凭据从公开state投影剥离；价值在本地操作一致性，Mermaid/计价/外观来自成熟方法，不视为新的交付机制。

状态加载失败保持只读、防未加载默认覆盖、applyEdit错误恢复内存和备份严格形状有实质设计；功能组合需持续跟宿主API。

源码依据：[src/index.ts](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/index.ts)、[src/routes.ts](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/routes.ts)、[src/host-service.ts](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/host-service.ts)、[src/backup.ts](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/backup.ts)、[src/state.ts](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/state.ts)、[src/client/index.ts](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/client/index.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

credentialStore.set失败时明确退回state.apiKey明文，saveStateFile普通JSON写入未显式0600；“备份无密钥/前端不返回”不等于磁盘不落密钥。扫描/计价依赖宿主usage与价格，不能把消费数字当项目真实成本或成果。

<a id="detail-section-6"></a>

### 1.5 使用建议

按实际需要启用，先核备份恢复、密钥存储来源与导出内容；用量/余额提示不替代账单。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AlexPeng07/dsh-custom-plugin](https://github.com/AlexPeng07/dsh-custom-plugin)
- **版本号**：0.8.0（[固定提交 901a665f](https://github.com/AlexPeng07/dsh-custom-plugin/tree/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/routes.ts、src/host-service.ts、src/backup.ts、src/state.ts、src/client/index.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来隔离配置核凭据降级、备份往返、状态漂移与导出/搜索范围；本轮未读取真实凭据或会话。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：凭据写失败默认拒绝持久化并给可选明确本地权限方案，可避免用户误以为已用系统密钥库。以凭据不可用、只读状态、备份/导出及重启核秘密落点和恢复行为；发现秘密进入备份即否定。

未来隔离配置核凭据降级、备份往返、状态漂移与导出/搜索范围；本轮未读取真实凭据或会话。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：510f5e70e725a05143b283bd29741dc3b5e2bdbd02943f99b54fcbae8778c913。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1628 | — | — | 25466 |
| .mjs | source | 5 | 825 | 591 | 174 | — |
| .ts | source | 24 | 4714 | 3652 | 785 | — |
| .tsx | source | 1 | 3038 | 2689 | 298 | — |
| .ts | test | 26 | 3397 | 2809 | 318 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=grey&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 7](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=7&color=grey&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
