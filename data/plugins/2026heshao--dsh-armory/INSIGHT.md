# dsh-armory

> 在 DSH 中管理 MCP、技能、专家、市场和工具使用账本，支持全局与项目作用域。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[fe18654](https://github.com/2026heshao/dsh-armory/tree/fe186548b391524d52a29efc263cde6a886a18b2)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) · [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory)
<!-- END META -->

**使用建议**：已有多个 MCP 和跨项目隔离需求时可先在独立项目试用导入预览、重名冲突和重连；保存后核对实际工具可见性，再扩大使用范围。不要仅凭零调用账本批量停用偶发必需工具。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
  - [源码索引](#detail-section-7)
- [未来设计假设（未验证）](#detail-section-8)
- [辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

源码支持配置准入与作用域共享连接的工程贡献；市场规模、使用账本的节省量及真实热重载兼容尚未独立验证；行为回放假设为未来设计。

[重点创新推演与最小验证](#innovation)

- **用途**：面向同时维护多个项目 MCP 与技能的 DSH 用户，期望可追溯地导入配置、查看连接和控制项目工具暴露。

采用建议：已有多个 MCP 和跨项目隔离需求时可先在独立项目试用导入预览、重名冲突和重连；保存后核对实际工具可见性，再扩大使用范围。不要仅凭零调用账本批量停用偶发必需工具。

参照原 MCP 管理 UI、手改 profile YAML 以及每会话独立启动服务；贡献是管理流程和作用域生命周期组合，未核对全球同类首创性。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Host 路由**：Typert管理面提供MCP配置、导入预览及运行诊断
- **后台**：项目MCP共享连接及会话工具作用域投射

**流程与依赖**

需要 DSH 的 loader、MCP 注册表、scope 和配置写链；每个市场服务另有程序/账号/权限。项目配置 .dsh/mcp.json、profile patch 与主目录客户端导入来源构成不同状态域，升级需保留备份并核对范围。

扫描来源→预览并选择导入→整批准入和冲突报告→串行写配置→异步对齐连接→面板读状态/工具。对齐失败保留诊断，由用户重连或修正配置；配置已写入的事实不会因 teardown 失败自动撤销。

**效果与成本**

首次需整理作用域、环境变量和各 MCP 凭据；持续有第三方服务费用、外部程序生命周期与坏配置恢复的人力，工具 schema token 是估算而非真实账单。未核算采用前后完整任务成本。

配置可视化和集中导入减少分散编辑，项目单连接减少重复进程的机制成立；能否节约上下文与排障时间仍取决于日志覆盖、真实调用分布和服务器行为。

- **思考**：看板写入成功是否等于存活会话已使用新配置？lib/index.js 把配置写盘与 reconcile 放在不同阶段，避免慢 teardown 阻塞写锁，但对齐失败只报告诊断；因此落盘和运行态可能短暂不一致。反例是正常重载时状态会收敛，这个边界不证明所有更新失败，却要求用户不能只凭保存提示验收。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：作者声明从 Imzl-zl/dsh-mcp-manager-ui 的 MCP 看板 fork 并扩展，不能将原看板功能全部算新贡献。相对手改配置和每会话建连接，workspace-runtime.js 将 pending/entry/disposing 三态与 effect 引用所有权结合，解决同名注册和异步 teardown 重建窗口；同时把市场浏览、导入预览和操作诊断放进一个管理流程。

作者声明从 Imzl-zl/dsh-mcp-manager-ui 的 MCP 看板 fork 并扩展，不能将原看板功能全部算新贡献。相对手改配置和每会话建连接，workspace-runtime.js 将 pending/entry/disposing 三态与 effect 引用所有权结合，解决同名注册和异步 teardown 重建窗口；同时把市场浏览、导入预览和操作诊断放进一个管理流程。

lib/import-admission.js 将表达式规范和整批重名检查集中为幂等准入层，值得迁移到配置导入边界。workspace-runtime.js 以 app root WeakMap 隔离共享连接并保留 disposing 占位，避免旧连接未退完便重建；移植需匹配 cordis effect 和 dsh-scope，不是独立通用池。

<a id="detail-section-5"></a>

### 主要限制

看板写入成功是否等于存活会话已使用新配置？lib/index.js 把配置写盘与 reconcile 放在不同阶段，避免慢 teardown 阻塞写锁，但对齐失败只报告诊断；因此落盘和运行态可能短暂不一致。反例是正常重载时状态会收敛，这个边界不证明所有更新失败，却要求用户不能只凭保存提示验收。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/import-admission.js、lib/workspace-runtime.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读准入、配置写入和项目运行时核心代码及作者说明，未遍历全部市场条目、未联网安装任何 MCP、未将静态规模声明当可安装数量。
- 下一步：固定两个项目各两会话，导入同名不同服务器并连续改配置，注入慢 teardown 和启动失败；检查连接数、隔离工具与落盘/运行指纹，比较手工重启所需人工步骤。若对账提示不能定位未收敛会话，则否定新假设。

**分析版本**

- **仓库**：[2026heshao/dsh-armory](https://github.com/2026heshao/dsh-armory)
- **版本号**：1.10.0（[固定提交 fe186548](https://github.com/2026heshao/dsh-armory/tree/fe186548b391524d52a29efc263cde6a886a18b2)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 源码索引

- [lib/index.js](https://github.com/2026heshao/dsh-armory/blob/fe186548b391524d52a29efc263cde6a886a18b2/lib/index.js)
- [lib/import-admission.js](https://github.com/2026heshao/dsh-armory/blob/fe186548b391524d52a29efc263cde6a886a18b2/lib/import-admission.js)
- [lib/workspace-runtime.js](https://github.com/2026heshao/dsh-armory/blob/fe186548b391524d52a29efc263cde6a886a18b2/lib/workspace-runtime.js)

<a id="detail-section-8"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：为每次配置变更显示“已落盘指纹/会话已应用指纹”，并能只重试未收敛作用域。它从已有 configFingerprint 与分离式 reconcile 推导，可把恢复责任从猜测重启改成明确对账；新增负担是维护代次状态与过期诊断。

固定两个项目各两会话，导入同名不同服务器并连续改配置，注入慢 teardown 和启动失败；检查连接数、隔离工具与落盘/运行指纹，比较手工重启所需人工步骤。若对账提示不能定位未收敛会话，则否定新假设。

<a id="detail-section-9"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2690 | — | — | 48853 |
| .mjs | source | 1 | 123 | 97 | 23 | — |
| .js | source | 18 | 15748 | 12571 | 2930 | — |
| .mjs | test | 28 | 4469 | 3280 | 844 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory/issues?q=is%3Aissue+created%3A2026-09-20T10%3A44%3A50.459Z..2026-10-20T10%3A44%3A50.459Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T10%3A44%3A50.459Z..2026-10-20T10%3A44%3A50.459Z)



统计日期：2026-10-20。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
