# dsh-pinned-sessions

> 在侧栏集中展示跨工作区的置顶会话，提供搜索、状态与取消置顶操作。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[20044d9](https://github.com/439436269-ctrl/dsh-pinned-sessions/tree/20044d963ce5d0a780915be97491b9d330285bf3)

<!-- BEGIN META -->
[![npm 30d 479](https://img.shields.io/static/v1?label=npm+30d&message=479&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions) [![首次发布 2026-10-06](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-06&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions)
<!-- END META -->

**使用建议**：已有跨工作区置顶需求时可试用；先验证搜索、归档过滤与取消置顶，宿主升级后检查入口是否仍在。

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

- **用途**：经常跨多个工作区切换会话的DSH用户，需从一个平面入口快速找到已置顶会话。

采用建议：已有跨工作区置顶需求时可试用；先验证搜索、归档过滤与取消置顶，宿主升级后检查入口是否仍在。

参照DSH原生工作区内置顶与手工搜索；价值来自聚合入口，不增加后端会话能力。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：跨工作区置顶分组、搜索、状态提示与取消置顶

**流程与依赖**

需要slots、sessions、workspaces、uiWorkspace、uiSession等客户端服务和匹配侧栏结构。

原生置顶→读取集合→过滤隐藏项→挂载分组→搜索或打开→原生取消置顶；锚点消失则移除自身节点。

**效果与成本**

首次安装刷新界面；无新增模型调用费用，持续成本主要为宿主DOM适配与跨版本验证。

集中导航可减少展开工作区的步骤；实际定位时间与长列表性能尚未本轮测量。

- **思考**：原生样式一致是否等于长期兼容？代码依赖data-slot及具体侧栏列表结构，找不到时隐藏，降低破坏性但功能仍消失；README前后对挂载位置和是否共享滚动有不同叙述，应该以当前源码和宿主实测为准。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对原生只在各工作区内部重排置顶，会话集合跨工作区聚合有明确导航价值；重用原生状态避免第二套置顶真相。DOM锚点portal是宿主缺少扩展槽位时的适配，不是新状态模型。

相对原生只在各工作区内部重排置顶，会话集合跨工作区聚合有明确导航价值；重用原生状态避免第二套置顶真相。DOM锚点portal是宿主缺少扩展槽位时的适配，不是新状态模型。

pinnedSessionIds过滤归档、空白与subagent，状态来自uiSession，取消置顶不直接改store；MutationObserver加定时重对齐降低重渲染丢挂载。 [固定源码](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L1)。

<a id="detail-section-5"></a>

### 主要限制

原生样式一致是否等于长期兼容？代码依赖data-slot及具体侧栏列表结构，找不到时隐藏，降低破坏性但功能仍消失；README前后对挂载位置和是否共享滚动有不同叙述，应该以当前源码和宿主实测为准。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/client.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读指定核心源码与作者说明；未执行目标插件或测试、未安装或做真实宿主验收，未核实独立用户收益。
- 下一步：比较现有锚点方式与slot原型在扁平/分组/搜索/折叠及DOM重排后的可见性；若slot同样需要内部DOM猜测则否定简化假设。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-pinned-sessions](https://github.com/439436269-ctrl/dsh-pinned-sessions)
- **版本号**：0.4.1（[固定提交 20044d96](https://github.com/439436269-ctrl/dsh-pinned-sessions/tree/20044d963ce5d0a780915be97491b9d330285bf3)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：宿主增加只负责列表首部的扩展slot，可消除DOM探测并保留原生浏览器所有权；代价是需要宿主API设计与版本适配。

比较现有锚点方式与slot原型在扁平/分组/搜索/折叠及DOM重排后的可见性；若slot同样需要内部DOM猜测则否定简化假设。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 917 | — | — | 11206 |
| .js | source | 2 | 804 | 613 | 192 | — |
| .mjs | test | 1 | 422 | 332 | 65 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-pinned-sessions/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
