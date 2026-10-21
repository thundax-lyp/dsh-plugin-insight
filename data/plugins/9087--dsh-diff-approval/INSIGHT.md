# dsh-diff-approval

> 汇总Agent成功文件改动供逐文件或逐块保留、回退，并支持导入本地版本控制差异。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[393bdc4](https://github.com/9087/dsh-diff-approval/tree/393bdc4c9b6ee007027c9e4da4d9732d60c9e168)

<!-- BEGIN META -->
[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) · [![npm 30d 5714](https://img.shields.io/static/v1?label=npm+30d&message=5%2C714&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval) · [![首次发布 2026-08-17](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)
<!-- END META -->

**使用建议**：适合经常逐块审阅Agent改动的开发者在临时仓库试用。先核对已写入后的审阅语义、外部改动提示与回退权限，重要工作保留版本控制备份。

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

- **用途**：开发者需要审阅Agent已经写入工作区的内容，合格结果是看到可信基线与当前差异、按授权回退且不误覆盖别人的改动。它是事后审阅，不是写前审批。

- **建议**：由事后pending与外部改动观察推导，可为每次决定绑定可见内容摘要和作用域，再由FS版本守卫提交；内容漂移时要求重新审阅而非沿旧确认回写。未验证假设是减少跨会话/外部编辑误覆盖。并发编辑、keep/revert与重启交错测试，若旧决定仍可覆盖新内容则否定。

适合经常逐块审阅Agent改动的开发者在临时仓库试用。先核对已写入后的审阅语义、外部改动提示与回退权限，重要工作保留版本控制备份。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

git diff与编辑器回退更通用，插件优势在会话关联、未提交工具改动和注释沟通；没有同任务审阅效率对照。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：待审改动面板与逐块keep/revert交互。
- **事件监听**：采集工具结果及FS intent前置基线。

**流程与依赖**

需要宿主FS、工具事件、trusted-host连接与客户端席位；VCS导入需Git/SVN/Perforce CLI，回退权限由会话策略决定。

Agent写文件，插件采集基线与结果，用户看diff并保留/回退；外部变化需重读并提示，必要时导入VCS差异；验收仍由测试与人工代码判断承担。

**效果与成本**

首次需理解基线、导入和回退删除语义；持续有审阅、冲突处理和持久数据维护成本，巨大/未跟踪扫描可能更慢，未测净节时。

将审阅与Agent讨论放近可能降低遗漏，但保留不等于代码正确或合并许可，未证实缺陷逃逸率降低。

- **思考**：“approval”会不会让用户误以为写入前被阻止？intent监听明确调用next，成功改动才进入pending；shell等未跟踪路径仍需VCS导入。回退实际写文件且新文件回退会删除；undo仅内存，不能当通用备份。源码持久层已是全局pending.json，而README仍描述按workspace文件，使用范围要以实现核对。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对仅看聊天文件列表或git diff，增量是把工具改动、逐块决定、行引用与重启后待审状态接到同一界面，降低审阅与Agent沟通的切换。差分算法和FS由上游能力支撑，主要贡献在状态与交互接线。

相对仅看聊天文件列表或git diff，增量是把工具改动、逐块决定、行引用与重启后待审状态接到同一界面，降低审阅与Agent沟通的切换。差分算法和FS由上游能力支撑，主要贡献在状态与交互接线。

FS intent旁路捕获不接管策略、回退沿请求会话权限、状态临时文件原子发布值得借鉴。大型入口承担多种状态转换，迁移/多会话/外部编辑的组合验证是维护成本；不能把UI undo当持久恢复。 源码依据：[src/index.ts](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts)、[src/pending.ts](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/pending.ts)、[src/persist.ts](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/persist.ts)、[src/atomic-write.ts](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/atomic-write.ts)。

<a id="detail-section-5"></a>

### 主要限制

“approval”会不会让用户误以为写入前被阻止？intent监听明确调用next，成功改动才进入pending；shell等未跟踪路径仍需VCS导入。回退实际写文件且新文件回退会删除；undo仅内存，不能当通用备份。源码持久层已是全局pending.json，而README仍描述按workspace文件，使用范围要以实现核对。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[9087/dsh-diff-approval](https://github.com/9087/dsh-diff-approval)
- **版本号**：0.36.1（[固定提交 393bdc4c](https://github.com/9087/dsh-diff-approval/tree/393bdc4c9b6ee007027c9e4da4d9732d60c9e168)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/pending.ts、src/persist.ts、src/atomic-write.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：临时仓库覆盖重复编辑、跨会话同路径、外部修改、重启、创建文件回退删除、read-only拒绝和未跟踪导入；核对文件与pending状态一致。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由事后pending与外部改动观察推导，可为每次决定绑定可见内容摘要和作用域，再由FS版本守卫提交；内容漂移时要求重新审阅而非沿旧确认回写。未验证假设是减少跨会话/外部编辑误覆盖。并发编辑、keep/revert与重启交错测试，若旧决定仍可覆盖新内容则否定。

临时仓库覆盖重复编辑、跨会话同路径、外部修改、重启、创建文件回退删除、read-only拒绝和未跟踪导入；核对文件与pending状态一致。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：833cabe16c3c5e89c25fad7905774204e79dbfc31f3d2dd2808e2a2070ef641e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1280 | — | — | 14419 |
| .ts | test | 58 | 18044 | 13063 | 3237 | — |
| .ts | source | 51 | 19327 | 9937 | 8466 | — |
| .mjs | source | 4 | 1304 | 802 | 421 | — |
| .tsx | source | 9 | 14853 | 9390 | 5222 | — |
| .tsx | test | 6 | 17471 | 12270 | 3680 | — |

排除 5 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
