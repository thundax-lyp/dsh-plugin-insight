# dsh-wsl-obscura

> 封装Obscura浏览器CLI，提供状态、网页抓取与MCP接入提示。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[f1dfad4](https://github.com/173787247/dsh-wsl-obscura/tree/f1dfad47dd78722babc61633805caade6557dc68)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-obscura)
<!-- END META -->

**使用建议**：从无eval、无私网访问的小页面开始，核对正文和截断，不把MCP提示当已接通服务。

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

已有贡献：把浏览器CLI与WSL路径接通，降低二进制查找和输出处理负担；浏览器能力来自Obscura。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：网页需要浏览器处理而普通HTTP抓取不足时，在DSH中调用已有Obscura。

- **建议**：本次未形成新的创新假设；先为普通抓取与额外权限建立可见的调用边界，再衡量与直接CLI的差异。

采用建议：从无eval、无私网访问的小页面开始，核对正文和截断，不把MCP提示当已接通服务。

直接Obscura CLI或宿主浏览器；插件主要接线与整形。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：obscura_status、obscura_fetch和obscura_mcp_hint。

**流程与依赖**

需要Obscura二进制及浏览器运行环境，跨系统路径和网络策略影响执行。

先查status，确认二进制，再对公开页执行最小抓取；需要eval或截图时逐项核对参数。

**效果与成本**

浏览器启动、渲染与截图存储成本，失败重试及页面核对人工另计，无效能实测。

把浏览器CLI与WSL路径接通，降低二进制查找和输出处理负担；浏览器能力来自Obscura。 允许eval、截图和私网开关时副作用与数据范围扩大；CLI存在不证明浏览器依赖安装齐全，抓到文本也不等于正文完整。

- **思考**：允许eval、截图和私网开关时副作用与数据范围扩大；CLI存在不证明浏览器依赖安装齐全，抓到文本也不等于正文完整。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把浏览器CLI与WSL路径接通，降低二进制查找和输出处理负担；浏览器能力来自Obscura。

把浏览器CLI与WSL路径接通，降低二进制查找和输出处理负担；浏览器能力来自Obscura。

二进制定位、参数构造与执行分层有复用价值，特殊选项需要独立解释权限。

<a id="detail-section-5"></a>

### 主要限制

允许eval、截图和私网开关时副作用与数据范围扩大；CLI存在不证明浏览器依赖安装齐全，抓到文本也不等于正文完整。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/obscura.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读入口和Obscura参数执行，未启动浏览器或核实外部二进制实现。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：用动态页面、重定向和受限测试站点核对内容、截图路径及私网开关，禁用高权限选项时不得静默启用。

**分析版本**

- **仓库**：[173787247/dsh-wsl-obscura](https://github.com/173787247/dsh-wsl-obscura)
- **版本号**：0.1.0（[固定提交 f1dfad4](https://github.com/173787247/dsh-wsl-obscura/tree/f1dfad47dd78722babc61633805caade6557dc68)）
- **版本日期**：2026-10-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

本次未形成新的创新假设；先为普通抓取与额外权限建立可见的调用边界，再衡量与直接CLI的差异。

用动态页面、重定向和受限测试站点核对内容、截图路径及私网开关，禁用高权限选项时不得静默启用。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 206 | — | — | 1095 |
| .js | source | 3 | 517 | 467 | 19 | — |
| .js | test | 1 | 89 | 82 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-obscura/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
