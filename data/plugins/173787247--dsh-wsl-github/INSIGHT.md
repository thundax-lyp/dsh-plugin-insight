# dsh-wsl-github

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[60345a0](https://github.com/173787247/dsh-wsl-github/tree/60345a0269abaa476131fc06b9e1e8eb6409c724)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-github)
<!-- END META -->

> **实现功能**：通过GitHub App或Token查询仓库PR与Actions状态，并提供认证配置诊断。

> **核心亮点**：把App安装认证和有限只读查询接入DSH工具；短期凭据减少人工搬运，认证机制本身来自GitHub。

> **风险与缺陷**：fetchRepoStatus读取仓库最近一次Actions运行，未绑定PR head SHA；认证就绪和一次状态查询成功也不等于目标PR检查通过或具备合并条件。

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

> **用途**：WSL内的Agent需要查询当前仓库协作状态，又不希望把API密钥直接放入聊天。

gh或GitHub网页查询；插件提供有限入口而非完整GitHub连接器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：github_app_hint与github_repo_status：认证诊断和仓库协作状态。

**流程与依赖**

依赖GitHub API、App安装与私钥或Token；网络和仓库权限独立于git push认证。

先检查认证模式，再明确repo查询PR和运行链接，最终回到具体提交核对检查。

**效果与成本**

App初始配置和凭据轮换有人工成本，API限额与重试影响可用性，未测协作效率。

把App安装认证和有限只读查询接入DSH工具；短期凭据减少人工搬运，认证机制本身来自GitHub。 fetchRepoStatus读取仓库最近一次Actions运行，未绑定PR head SHA；认证就绪和一次状态查询成功也不等于目标PR检查通过或具备合并条件。

> **思考**：fetchRepoStatus读取仓库最近一次Actions运行，未绑定PR head SHA；认证就绪和一次状态查询成功也不等于目标PR检查通过或具备合并条件。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把App安装认证和有限只读查询接入DSH工具；短期凭据减少人工搬运，认证机制本身来自GitHub。

把App安装认证和有限只读查询接入DSH工具；短期凭据减少人工搬运，认证机制本身来自GitHub。

认证状态只返回布尔与模式，Token在内存缓存；需继续审阅错误路径和日志是否同样不含敏感值。

<a id="detail-section-5"></a>

### 1.4 主要限制

fetchRepoStatus读取仓库最近一次Actions运行，未绑定PR head SHA；认证就绪和一次状态查询成功也不等于目标PR检查通过或具备合并条件。

<a id="detail-section-6"></a>

### 1.5 使用建议

用单个测试仓库配置只读权限，核对返回运行属于哪个提交；不要把仓库最新CI当作当前PR检查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献：把App安装认证和有限只读查询接入DSH工具；短期凭据减少人工搬运，认证机制本身来自GitHub。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/auth.js、lib/api.js、lib/git.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查入口及auth/api仓库解析文件；没有签发App凭据或访问用户私有仓库。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：设置两个分支并产生相反CI结果，对照仓库最新运行与PR head检查，错误匹配必须显式可见；同时测试Token过期和无权限。

**分析版本**

- **仓库**：[173787247/dsh-wsl-github](https://github.com/173787247/dsh-wsl-github)
- **版本号**：0.2.0（[固定提交 60345a0](https://github.com/173787247/dsh-wsl-github/tree/60345a0269abaa476131fc06b9e1e8eb6409c724)）
- **版本日期**：2026-10-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：将状态查询绑定PR head SHA而非仓库最新运行，可减少跨分支绿色检查误认；需保留权限不足状态。

设置两个分支并产生相反CI结果，对照仓库最新运行与PR head检查，错误匹配必须显式可见；同时测试Token过期和无权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 347 | — | — | 2201 |
| .js | source | 5 | 597 | 560 | 6 | — |
| .mjs | source | 1 | 145 | 132 | 15 | — |
| .js | test | 1 | 193 | 178 | 10 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-github/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
