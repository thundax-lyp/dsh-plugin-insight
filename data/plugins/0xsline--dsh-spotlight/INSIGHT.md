# dsh-spotlight

> 以键盘命令面板统一查找原生命令、近期会话和插件入口。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b3565e8](https://github.com/0xsline/dsh-spotlight/tree/b3565e8629d9a393d764681e96f4c41100cc12fa)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) [![npm 30d 634](https://img.shields.io/static/v1?label=npm+30d&message=634&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight)
<!-- END META -->

**使用建议**：先用常用的十条命令与十个会话检查搜索命中和导航，再决定是否替代原生入口。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：大量使用快捷键的 DSH Web 用户需要减少在会话与设置之间寻找入口的操作。

原生斜杠菜单无需额外插件；只有跨入口搜索更顺手时才有迁移价值。

## 能力与限制

- **界面**：键盘面板与会话导航。
- **用户命令**：/spotlight 打开面板。

**流程与依赖**

依赖 Web DOM、会话目录、命令 UI 和插件库存服务，没有对应服务时面板不能独立工作。

打开面板搜索，选择命令或会话交给宿主执行；异常先检查服务与快捷键冲突。

**兼容条件**

组件 @0xsline/dsh-spotlight 0.0.2，客户端与宿主服务契约绑定较紧。

**效果与成本**

不必额外调用模型，但需要学习快捷键与排查入口兼容，未测节省点击次数。

- **思考**：复用原生命令注册表可降低双份清单漂移；命令数量增加并不自动提升检索体验。

## 工程分析

- **亮点**：客户端注入 sessions、commands 和 pluginInventory，挂载面板并通过原生 commandUi 注册 /spotlight。

挂载与释放在 effect 中配对，生命周期清晰；跨版本复用需核对所有注入服务。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未验证模糊匹配质量、键盘冲突或不同宿主版本的命令枚举完整性。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试空目录、大量会话、快捷键冲突、卸载后监听释放与命令权限继承。

**分析版本**

固定提交 [b3565e8](https://github.com/0xsline/dsh-spotlight/tree/b3565e8629d9a393d764681e96f4c41100cc12fa)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 980 | — | — | 9699 |
| .mjs | source | 3 | 311 | 249 | 32 | — |
| .ts | source | 13 | 1092 | 857 | 141 | — |
| .ts | test | 8 | 545 | 474 | 12 | — |
| .md | test | 2 | 16 | — | — | 229 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/0xsline/dsh-spotlight/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
