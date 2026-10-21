# dsh-side-session

> 从命令菜单创建可继续的旁会话，并跳转到原生子会话聊天视图。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[39443eb](https://github.com/123dbl/dsh-side-session/tree/39443eb1ea15fb080121a3a6474426980f346a6c)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/123dbl/dsh-side-session)
<!-- END META -->

**使用建议**：先测试主会话忙碌、双击和连续创建，确认旁会话可恢复且不会跳错子会话。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：主任务运行时，用户需要另外讨论独立问题，同时保留主会话上下文。

原生新会话操作更透明；该插件主要减少在主任务旁开讨论的入口步骤。

## 能力与限制

- **用户命令**：/side-chat 新建可继续子会话。
- **界面**：自动打开原生子会话视图。

**流程与依赖**

需要 commands、subagents 和实时子目录，模型与子会话生命周期由宿主承担。

菜单创建旁会话、确认跳转后聊天；若跳转失败，回到子会话列表检查是否已创建再重试。

**兼容条件**

版本 0.1.0，依赖支持 continuable children 的宿主以及 sessions 客户端服务。

**效果与成本**

开场确认与额外对话消耗模型额度；简单问题直接新建原生会话可能更低成本。

- **思考**：复用原生聊天视图避免维护第二套面板；便利不代表资源或权限完全隔离。

## 工程分析

- **亮点**：/side-chat 调用 startContinuable 创建子会话，客户端在成功事件后比较子目录并打开新会话。

Host 只负责创建、Client 负责导航职责清晰；通过目录差分猜测新 ID 有并发与回退边界。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未验证并发创建或目录冷启动时准确跳转；所谓独立会话仍是父会话下的 continuable 子代理。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：覆盖目录未预热、同时创建多个子代理、超时、取消和重启继续，避免未知结果后重复创建。

**分析版本**

固定提交 [39443eb](https://github.com/123dbl/dsh-side-session/tree/39443eb1ea15fb080121a3a6474426980f346a6c)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 59 | 40 | 13 | — |
| .js | source | 2 | 119 | 114 | 8 | — |
| .md | source | 1 | 60 | — | — | 528 |
| .ts | source | 2 | 176 | 98 | 64 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/123dbl/dsh-side-session/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
