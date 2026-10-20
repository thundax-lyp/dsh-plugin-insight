# dsh-spotlight

> 以键盘命令面板统一查找原生命令、近期会话和插件入口。

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) · [![npm 30d 667](https://img.shields.io/static/v1?label=npm+30d&message=667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight/commits)
<!-- END META -->

## 版本

固定提交 [b3565e8629d9a393d764681e96f4c41100cc12fa](https://github.com/0xsline/dsh-spotlight/tree/b3565e8629d9a393d764681e96f4c41100cc12fa)

## 用途与采用点评

- **用途**：大量使用快捷键的 DSH Web 用户需要减少在会话与设置之间寻找入口的操作。
- **亮点**：客户端注入 sessions、commands 和 pluginInventory，挂载面板并通过原生 commandUi 注册 /spotlight。
- **思考**：复用原生命令注册表可降低双份清单漂移；命令数量增加并不自动提升检索体验。
- **建议**：先用常用的十条命令与十个会话检查搜索命中和导航，再决定是否替代原生入口。

## 场景与替代办法

大量使用快捷键的 DSH Web 用户需要减少在会话与设置之间寻找入口的操作。

原生斜杠菜单无需额外插件；只有跨入口搜索更顺手时才有迁移价值。

## 依赖与流程

依赖 Web DOM、会话目录、命令 UI 和插件库存服务，没有对应服务时面板不能独立工作。

打开面板搜索，选择命令或会话交给宿主执行；异常先检查服务与快捷键冲突。

## 成本与效果

不必额外调用模型，但需要学习快捷键与排查入口兼容，未测节省点击次数。

复用原生命令注册表可降低双份清单漂移；命令数量增加并不自动提升检索体验。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：1c49cd982a9082aeed427245684e21c7b1971cf615da1f98d21bef06ac2ba32f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 980 | — | — | 9699 |
| .mjs | source | 3 | 311 | 249 | 32 | — |
| .ts | source | 13 | 1092 | 857 | 141 | — |
| .ts | test | 8 | 545 | 474 | 12 | — |
| .md | test | 2 | 16 | — | — | 229 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **界面**：键盘面板与会话导航。
- **用户命令**：/spotlight 打开面板。

## 工程亮点

挂载与释放在 effect 中配对，生命周期清晰；跨版本复用需核对所有注入服务。

## 分发与兼容

组件 @0xsline/dsh-spotlight 0.0.2，客户端与宿主服务契约绑定较紧。

## 历史对照

前次代码指纹为 b3565e8629d9a393d764681e96f4c41100cc12fa；本轮固定为 b3565e8629d9a393d764681e96f4c41100cc12fa。原生斜杠菜单无需额外插件；只有跨入口搜索更顺手时才有迁移价值。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未验证模糊匹配质量、键盘冲突或不同宿主版本的命令枚举完整性。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试空目录、大量会话、快捷键冲突、卸载后监听释放与命令权限继承。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight/issues?q=is%3Aissue+created%3A2026-09-20T02%3A56%3A59.866Z..2026-10-20T02%3A56%3A59.866Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T02%3A56%3A59.866Z..2026-10-20T02%3A56%3A59.866Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight/issues?q=is%3Aissue+updated%3A2026-09-20T02%3A56%3A59.866Z..2026-10-20T02%3A56%3A59.866Z)

统计日期：2026-10-20。
