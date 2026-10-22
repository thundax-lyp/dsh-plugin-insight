# dsh-wsl-workspace

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f14cb21](https://github.com/173787247/dsh-wsl-workspace/tree/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-workspace)
<!-- END META -->

> **实现功能**：列出 WSL 发行版并检查 Linux 工作区路径与 /mnt 放置情况。

> **核心亮点**：相对人工检查pwd和发行版，增量是把目录放置规则与当前/默认发行版差异汇成可读诊断；不测文件系统性能，也不实施迁移。

> **风险与缺陷**：核心质疑是“Linux侧路径”等不等于真实底层文件系统。源码在realpath前按原abs分类，home下符号链接指向/mnt仍可能ok；非/mnt的挂载也未探测。因此只能当启发式，不是性能/合法性认证。

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

> **用途**：首次在WSL配置DSH的开发者需要避免工作区选错发行版或落在Windows用户目录，以目录诊断和建议迁移路径为交付。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：wsl_workspace

**流程与依赖**

Node≥18、DSH、WSL与wsl.exe必要；check需文件系统访问，list失败会退回当前发行版，不能认为列表完整。

list确认当前/默认发行版→check路径→读exists/git/mnt提示→用户决定新位置并自行迁移；不复制、不改仓库。

**效果与成本**

无服务费；首次只读配置小，迁移耗时与工具重装由用户承担，未测路径对Git/npm性能影响。

对入门者有具体指导，熟练用户手工检查成本低，插件不提供真实速度保证。

> **思考**：核心质疑是“Linux侧路径”等不等于真实底层文件系统。源码在realpath前按原abs分类，home下符号链接指向/mnt仍可能ok；非/mnt的挂载也未探测。因此只能当启发式，不是性能/合法性认证。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对人工检查pwd和发行版，增量是把目录放置规则与当前/默认发行版差异汇成可读诊断；不测文件系统性能，也不实施迁移。

相对人工检查pwd和发行版，增量是把目录放置规则与当前/默认发行版差异汇成可读诊断；不测文件系统性能，也不实施迁移。

classifyWorkspacePath与advice分开便于复用及测试；但分类/realpath先后顺序改变判断语义；list错误降级没有完整性标记，维护时应分开“已安装全部”和“仅当前已知”。 源码：[index.js](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/index.js)、[lib/workspace.js](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/lib/workspace.js)、[test/workspace.test.js](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/test/workspace.test.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心质疑是“Linux侧路径”等不等于真实底层文件系统。源码在realpath前按原abs分类，home下符号链接指向/mnt仍可能ok；非/mnt的挂载也未探测。因此只能当启发式，不是性能/合法性认证。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合首次选工作区时快速排查；符号链接或特殊挂载需手动核对真实路径和文件系统，迁移仓库前另行备份与确认。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

- 已检查：作者 README、包清单、源码路径 index.js、lib/workspace.js、test/workspace.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：给出正常home、/mnt路径、home→/mnt符号链接及非/mnt挂载，对照分类与实际mount；若路径误归合格，建议应显示未知而非“良好Linux根”。

**分析版本**

- **仓库**：[173787247/dsh-wsl-workspace](https://github.com/173787247/dsh-wsl-workspace)
- **版本号**：0.2.0（[固定提交 f14cb21](https://github.com/173787247/dsh-wsl-workspace/tree/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：先规范化真实路径再结合mount类型与轻量性能探针，可降低目录字符串启发误报；探针引入测量负担，需先验证真实误判量是否值得。

给出正常home、/mnt路径、home→/mnt符号链接及非/mnt挂载，对照分类与实际mount；若路径误归合格，建议应显示未知而非“良好Linux根”。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 98 | — | — | 559 |
| .js | source | 3 | 323 | 293 | 2 | — |
| .js | test | 1 | 65 | 60 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-workspace/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
