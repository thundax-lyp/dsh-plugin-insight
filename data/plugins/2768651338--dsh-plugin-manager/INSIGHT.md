# dsh-plugin-manager

> 给 DSH 插件提供中文目录说明、启停、备注编辑及配置备份管理界面。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[df0a232](https://github.com/2768651338/dsh-plugin-manager/tree/df0a23258ed3761bcce12ad20958ba2c2a647a4c)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-plugin-manager) [![npm 30d 923](https://img.shields.io/static/v1?label=npm+30d&message=923&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager) [![首次发布 2026-10-01](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager)
<!-- END META -->

**使用建议**：需要批量辨认和启停时先在独立profile试用，核对系统保护、表达式拒绝、备份恢复及实际fiber状态后扩用。

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

已实现机制由固定源码支持；效果未独立实测，未来假设未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：维护多个DSH插件但不熟悉模块名的用户，需要辨认当前Loader行并安全启停，保留已有手写补丁。

采用建议：需要批量辨认和启停时先在独立profile试用，核对系统保护、表达式拒绝、备份恢复及实际fiber状态后扩用。

参照官方插件管理与手改disabled；本项目是说明和配置维护增强，官方安装卸载仍为另一责任层。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：插件中文目录、备注与启停设置
- **后台**：目标行补丁编辑、共享写队列与备份

**流程与依赖**

需要宿主loader、Typert与Web客户端、可写DSH_HOME以及热加载支持；备份导入还依赖当前profile路径。

读取loader和目录→展示分类说明→预检系统/表达式→串行写补丁和备份→宿主异步重载→界面再读状态。

**效果与成本**

首次安装并整理目录备注；持续目录维护、备份保留和宿主兼容验证的人力，无必要额外模型费用。

中文说明与局部编辑降低误改负担有机制依据；用户错误率与维护时间收益未实测。

- **思考**：写盘accepted是否代表插件已激活？setEnabled返回写入结果，实际热加载依赖宿主HMR与fiber状态；保留表达式和系统行限制是强支持，但Loader异步失败仍可能发生。目录说明数量也不等于插件可安装兼容。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对官方安装卸载服务，明确增量是可解释目录、行级启停与可编辑备注；独立命名空间保留官方服务。保留注释和表达式的局部编辑比普通解析再序列化更适合既有手写配置，但非通用YAML编辑器。

相对官方安装卸载服务，明确增量是可解释目录、行级启停与可编辑备注；独立命名空间保留官方服务。保留注释和表达式的局部编辑比普通解析再序列化更适合既有手写配置，但非通用YAML编辑器。

写队列then(run,run)并恢复tail避免一次失败毒化后续操作；parsePatchFile保留原文，但只支持明确的顶层id行形态并主动拒绝其他形式。 [固定源码](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/patch-file.ts#L1)。

<a id="detail-section-5"></a>

### 主要限制

[核查分支](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/index.ts#L532)。

写盘accepted是否代表插件已激活？setEnabled返回写入结果，实际热加载依赖宿主HMR与fiber状态；保留表达式和系统行限制是强支持，但Loader异步失败仍可能发生。目录说明数量也不等于插件可安装兼容。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 src/patch-file.ts、src/index.ts、src/typert-host.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读指定核心源码与作者说明；未执行目标插件或测试、未安装或做真实宿主验收，未核实独立用户收益。
- 下一步：连续对同一行启停并注入加载失败，检查界面是否区分文件已写与fiber失败；若旧代次成功仍误报当前成功则否定假设。

**分析版本**

- **仓库**：[2768651338/dsh-plugin-manager](https://github.com/2768651338/dsh-plugin-manager)
- **版本号**：0.9.0（[固定提交 df0a2325](https://github.com/2768651338/dsh-plugin-manager/tree/df0a23258ed3761bcce12ad20958ba2c2a647a4c)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：启停结果绑定配置版本并等待目标fiber代次状态，能把已写入与已生效分开；新增负担为超时、重载竞态和可撤销操作状态。

连续对同一行启停并注入加载失败，检查界面是否区分文件已写与fiber失败；若旧代次成功仍误报当前成功则否定假设。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 2398 | — | — | 31250 |
| .js | source | 4 | 16781 | 15927 | 1500 | — |
| .ts | source | 17 | 3405 | 2667 | 513 | — |
| .mjs | source | 1 | 23 | 21 | 1 | — |
| .tsx | source | 1 | 973 | 886 | 49 | — |
| .mjs | test | 14 | 1514 | 1270 | 125 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2768651338/dsh-plugin-manager/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
