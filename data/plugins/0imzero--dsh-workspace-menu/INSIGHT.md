# dsh-workspace-menu

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[afd5551](https://github.com/0imzero/dsh-workspace-menu/tree/afd55510f82821cde60a8364e42f752e244b5b31)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu)
<!-- END META -->

> **实现功能**：在 DSH 工作区与会话行增加右键操作、置顶、归档及文件管理器入口。

> **核心亮点**：客户端用 DOM/React fiber 定位行，Host 执行文件管理器调用；危险删除与归档管理器协作。

> **风险与缺陷**：就地管理减少界面跳转，但把磁盘删除与日常菜单放在一起增加误操作后果。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：经常整理多个工作区和会话的用户，希望减少查找管理入口的步骤。

宿主原有管理页面更稳定但操作分散；本轮仍未证明 DOM 兼容或危险操作全面安全。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **界面**：工作区与会话右键菜单及通用设置。
- **Host 路由**：打开系统文件管理器与受保护目录操作。

**流程与依赖**

需要 Web 客户端插槽、Host 路由及系统文件管理器；记录永久删除另依赖归档管理插件。

打开菜单执行轻操作；删除前二次确认，失败时区分列表移除、归档与实际磁盘删除。

**兼容条件**

private 包版本 1.2.0，以发布压缩包或源码构建方式安装；依赖 archive-manager 的删除能力另核对。

**效果与成本**

基本操作无需模型，但宿主更新后可能需要排查菜单和选择器；未测管理任务节省时间。

> **思考**：就地管理减少界面跳转，但把磁盘删除与日常菜单放在一起增加误操作后果。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：客户端用 DOM/React fiber 定位行，Host 执行文件管理器调用；危险删除与归档管理器协作。

Host 路由租约和目录保护检查可借鉴；React fiber 适配不是稳定公共接口的替代保证。

<a id="detail-section-4"></a>

## 4 使用建议

先只开启置顶、复制路径和归档，对测试目录验证删除确认后再决定是否启用删除功能。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：DOM 定位受宿主内部结构影响；删除涉及磁盘副作用，未做路径边界或跨平台验收。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在临时工作区测试同名目录、根目录保护、双确认、插件重载和三平台打开目录。

**分析版本**

固定提交 [afd5551](https://github.com/0imzero/dsh-workspace-menu/tree/afd55510f82821cde60a8364e42f752e244b5b31)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 340 | — | — | 2797 |
| .js | source | 2 | 1251 | 1215 | 37 | — |
| .mjs | source | 1 | 34 | 24 | 4 | — |
| .ts | source | 3 | 1472 | 1355 | 43 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/0imzero/dsh-workspace-menu/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
