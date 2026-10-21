# dsh-wsl-search

> 在允许目录内用ripgrep、fd和ast-grep搜索文本、文件名与代码结构。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[445b0fd](https://github.com/173787247/dsh-wsl-search/tree/445b0fd89b128696f447f28ff6dd3b0c0964885e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search)
<!-- END META -->

**使用建议**：显式设定项目根而非整个home，以已知命中验证工具身份和结果截断。

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

已有贡献：把三种成熟搜索器接成统一工具，并给出根目录约束和模型可消费结果；搜索算法不是插件原创。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：Agent在大型工作区定位代码时，需要比整文件读取更紧凑、可追溯的匹配结果。

- **建议**：待验证假设：流式读取达到全局匹配预算即停止子进程，能减少宽目录搜索的等待和缓冲；提前停止也可能漏掉更相关文件。

采用建议：显式设定项目根而非整个home，以已知命中验证工具身份和结果截断。

直接CLI搜索或宿主已有文件工具；插件提供统一参数和结果形状，不自动构成更高召回。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：search_status、search_rg、search_fd、search_astgrep。

**流程与依赖**

依赖rg、fd/fdfind、ast-grep及可读目录；sg同名命令可能不是预期工具，应检查版本和实际调用。

先search_status核对二进制，收窄allowRoots，文本搜索定位后再做结构搜索和原文复核。

**效果与成本**

搜索I/O、子进程启动与返回token，预算裁剪不保证扫描成本同比下降；未做性能实验。

把三种成熟搜索器接成统一工具，并给出根目录约束和模型可消费结果；搜索算法不是插件原创。 rg的max-count是每文件上限，且结果数在进程完成后再裁剪；ast-grep也主要事后裁剪，不能把返回条数上限等同实际工作量上限。默认允许home范围较宽，根路径检查不等于操作系统沙箱。

- **思考**：rg的max-count是每文件上限，且结果数在进程完成后再裁剪；ast-grep也主要事后裁剪，不能把返回条数上限等同实际工作量上限。默认允许home范围较宽，根路径检查不等于操作系统沙箱。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把三种成熟搜索器接成统一工具，并给出根目录约束和模型可消费结果；搜索算法不是插件原创。

把三种成熟搜索器接成统一工具，并给出根目录约束和模型可消费结果；搜索算法不是插件原创。

真实路径核对与参数数组执行可借鉴，但资源预算应与结果预算分别建模。

<a id="detail-section-5"></a>

### 主要限制

rg的max-count是每文件上限，且结果数在进程完成后再裁剪；ast-grep也主要事后裁剪，不能把返回条数上限等同实际工作量上限。默认允许home范围较宽，根路径检查不等于操作系统沙箱。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/search.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查四个工具注册、根解析、命令参数与输出处理；未搜索用户目录或运行目标工具。
- 下一步：在相同多文件语料比较原实现与流式预算的首批延迟、总扫描量和命中召回，若漏项增加超过收益则否定；检查符号链接与根目录约束。

**分析版本**

- **仓库**：[173787247/dsh-wsl-search](https://github.com/173787247/dsh-wsl-search)
- **版本号**：0.3.0（[固定提交 445b0fd](https://github.com/173787247/dsh-wsl-search/tree/445b0fd89b128696f447f28ff6dd3b0c0964885e)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：流式读取达到全局匹配预算即停止子进程，能减少宽目录搜索的等待和缓冲；提前停止也可能漏掉更相关文件。

在相同多文件语料比较原实现与流式预算的首批延迟、总扫描量和命中召回，若漏项增加超过收益则否定；检查符号链接与根目录约束。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 129 | — | — | 529 |
| .js | source | 2 | 313 | 293 | 2 | — |
| .js | test | 1 | 38 | 35 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
