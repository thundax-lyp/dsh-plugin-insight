# dsh-session-diff

> 在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f5b20d0](https://github.com/2002XiaoYu/dsh-session-diff/tree/f5b20d0001bb9955c4eebe0f2037507769e55197)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff)
<!-- END META -->

**使用建议**：适合快速检查当前会话的常规write/edit；跨会话、shell改动和大文件仍用Git或专门差异工具复核。

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

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：开发者想确认本轮会话改了哪些文件，不希望Git里其他会话的改动混入；验收是对应会话工具事件的准确变更视图。

采用建议：适合快速检查当前会话的常规write/edit；跨会话、shell改动和大文件仍用Git或专门差异工具复核。

参照git diff和原生文本侧栏；没有执行客户端DOM与真实宿主验收。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：会话文件差异视图与变更文件列表

**流程与依赖**

需要DSH会话投影、workspaceFiles Remote及sidebarRightTabs接口；只显示宿主能读取的文件和会话留下的变更记录。

打开本会话write/edit行或会话变更页，按节点聚合差异并分页读取当前文本；新事件触发重算；读取失败或截断需回到源码/Git核对。

**效果与成本**

不需要另加模型调用；代价是浏览器读取、差异计算和人工确认覆盖范围。大文件或多变更节点的耗时未测。

会话归属能减少筛选噪声；不能代替完整代码审查或仓库变更盘点。

- **思考**：会话工具事件能覆盖多少实际文件修改最关键：shell修改、外部编辑或工具未记录旧文本，不能由write/edit节点推得完整历史；当前文件还可能被另一会话改动。readWholeFile有限行/页数，展示截断不能看作全文件审计。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对工作区git diff，增量是会话作用域归属和就地侧栏呈现；原生查看器保留给未修改文件，避免抢占所有文档。差异算法属成熟方法，贡献在事件归属与宿主展示接线。

相对工作区git diff，增量是会话作用域归属和就地侧栏呈现；原生查看器保留给未修改文件，避免抢占所有文档。差异算法属成熟方法，贡献在事件归属与宿主展示接线。

src/80-apply.js 的canOpen仅接管实际有变更地址，减少与原生查看器冲突；src/50-store.js按节点数和最后seq记忆聚合，src/40-reader.js显式保留truncated。事件基线与当前文件版本一致性是后续复用重点。 源码：[src/80-apply.js](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/80-apply.js)、[src/50-store.js](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/50-store.js)、[src/40-reader.js](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/40-reader.js)、[src/30-diff.js](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/30-diff.js)。

<a id="detail-section-5"></a>

### 主要限制

会话工具事件能覆盖多少实际文件修改最关键：shell修改、外部编辑或工具未记录旧文本，不能由write/edit节点推得完整历史；当前文件还可能被另一会话改动。readWholeFile有限行/页数，展示截断不能看作全文件审计。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 src/80-apply.js、src/50-store.js、src/40-reader.js、src/30-diff.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：两会话交替修改同文件并加入shell编辑、删除与超过读取上限文件，对比git与插件显示，记录遗漏和错归属；如无可靠旧版本就只显示“事件覆盖子集”，不宣称完整差异。

**分析版本**

- **仓库**：[2002XiaoYu/dsh-session-diff](https://github.com/2002XiaoYu/dsh-session-diff)
- **版本号**：0.1.0（[固定提交 f5b20d0](https://github.com/2002XiaoYu/dsh-session-diff/tree/f5b20d0001bb9955c4eebe0f2037507769e55197)）
- **版本日期**：2026-09-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：为hunk保留文件版本摘要并把当前内容偏离显示为“外部变更”，可减少多会话归属混淆。来自事件基线和实时重读之间的差距；无需接管文件写入，但要增加版本查询与冲突UI。

两会话交替修改同文件并加入shell编辑、删除与超过读取上限文件，对比git与插件显示，记录遗漏和错归属；如无可靠旧版本就只显示“事件覆盖子集”，不宣称完整差异。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 12 | 3441 | 2803 | 406 | — |
| .md | source | 2 | 315 | — | — | 3498 |
| .mjs | source | 1 | 67 | 36 | 21 | — |
| .mjs | test | 2 | 645 | 523 | 83 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
