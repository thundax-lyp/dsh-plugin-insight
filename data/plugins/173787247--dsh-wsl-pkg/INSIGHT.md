# dsh-wsl-pkg

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c795535](https://github.com/173787247/dsh-wsl-pkg/tree/c79553532eda43f86f3d056ad31e35d11710ad33)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-pkg)
<!-- END META -->

> **实现功能**：汇总npm、pip与cargo依赖信息，提供npm过期版本检查入口。

> **核心亮点**：将多包管理器诊断统一为工具入口，并对目录和输出设边界；依赖解析和版本判断仍由上游CLI完成。

> **风险与缺陷**：cargo实际参数为tree -d 1，不能仅据描述确认它按深度1工作；npm解析失败仍返回ok:true，pip取PATH环境也不等于目标项目环境。

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

> **用途**：开发者让Agent排查依赖状态，需要浅摘要而非大量原始输出。

直接运行npm ls/outdated、pip list、cargo tree。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：pkg_status、pkg_npm_ls、pkg_npm_outdated、pkg_pip_list和pkg_cargo_tree入口。

**流程与依赖**

需要相应CLI、目标项目和必要网络；allowRoots默认空表示不限制，pip不接受项目目录，npm outdated可能访问registry。

先查CLI和环境，明确项目目录及allowRoots，再查询并复核原始退出信息；不自动安装或升级。

**效果与成本**

CLI运行、registry请求和人工解释是主要成本；摘要省token的幅度与诊断合格率未测。

将多包管理器诊断统一为工具入口，并对目录和输出设边界；依赖解析和版本判断仍由上游CLI完成。 cargo实际参数为tree -d 1，不能仅据描述确认它按深度1工作；npm解析失败仍返回ok:true，pip取PATH环境也不等于目标项目环境。

> **思考**：cargo实际参数为tree -d 1，不能仅据描述确认它按深度1工作；npm解析失败仍返回ok:true，pip取PATH环境也不等于目标项目环境。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将多包管理器诊断统一为工具入口，并对目录和输出设边界；依赖解析和版本判断仍由上游CLI完成。

将多包管理器诊断统一为工具入口，并对目录和输出设边界；依赖解析和版本判断仍由上游CLI完成。

真实路径检查比字符串前缀更稳健；进程执行器限制stdout，但stderr累积与非零退出处理仍需复核。

<a id="detail-section-5"></a>

### 1.4 主要限制

cargo实际参数为tree -d 1，不能仅据描述确认它按深度1工作；npm解析失败仍返回ok:true，pip取PATH环境也不等于目标项目环境。

<a id="detail-section-6"></a>

### 1.5 使用建议

先限定allowRoots并核对Python环境；cargo入口须先验证参数，不能把ok当依赖无问题。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献：将多包管理器诊断统一为工具入口，并对目录和输出设边界；依赖解析和版本判断仍由上游CLI完成。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/pkg.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查注册和进程/摘要代码，未调用任何包管理器或运行测试。
- 下一步：在锁定CLI版本下核对cargo参数语义，测试npm损坏树、非JSON错误与截断，比较虚拟环境pip和项目解释器；观察模型是否正确区分失败和空结果。

**分析版本**

- **仓库**：[173787247/dsh-wsl-pkg](https://github.com/173787247/dsh-wsl-pkg)
- **版本号**：0.1.1（[固定提交 c795535](https://github.com/173787247/dsh-wsl-pkg/tree/c79553532eda43f86f3d056ad31e35d11710ad33)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：统一返回执行状态、解析状态与环境身份，可减少把空摘要误认为健康依赖；尚未实现。

在锁定CLI版本下核对cargo参数语义，测试npm损坏树、非JSON错误与截断，比较虚拟环境pip和项目解释器；观察模型是否正确区分失败和空结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 488 |
| .js | source | 2 | 320 | 299 | 3 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-pkg/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
