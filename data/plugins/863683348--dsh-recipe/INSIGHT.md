# dsh-recipe

> 按场景检索插件配方，展开有序插件列表与安装命令，并合并去重多套配方。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[67f2d4c](https://github.com/863683348/dsh-recipe/tree/67f2d4c662954ccd25c771fa0e0a99433cf3b530)

<!-- BEGIN META -->
[![npm 30d 128](https://img.shields.io/static/v1?label=npm+30d&message=128&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-recipe) [![首次发布 2026-08-17](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-recipe)
<!-- END META -->

**使用建议**：适合先找候选组合的用户。执行前逐项核对当前版本、依赖与可选配置，合并配方时检查同名项冲突；不要直接把生成命令当已验收部署。

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

- **用途**：新用户想配置一套特定用途的DSH环境，需要先拿到可审阅的插件清单；合格交付是依赖兼容且可恢复的环境，本插件实际终点仅为安装计划。

- **建议**：由配方已有config但安装命令未携带推导，可增加固定版本/配置冲突的只读计划器，先显示冲突与回滚清单再执行。未验证假设是减少配方组合后返工；用两个共享插件但配置相反的配方测试，若不能确定提示冲突则不成立。

适合先找候选组合的用户。执行前逐项核对当前版本、依赖与可选配置，合并配方时检查同名项冲突；不要直接把生成命令当已验收部署。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

手工维护dotfiles/插件清单同样可用；插件增加自然语言检索与组合入口，但不替代包管理器。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：recipe提供list/search/apply/compose计划输出。

**流程与依赖**

只需宿主tools与包内JSON即可生成计划；实际安装另需网络、包来源、宿主兼容与权限，均不由recipe验证。

用户描述场景，搜索并审阅配方，展开或组合，检查未知项与顺序，再由人或独立流程执行命令和验收。

**效果与成本**

首次由维护者整理配方；用户仍需核实来源、版本与配置并承担每项安装成本。未量化节省搜索时间，失败安装和迁移不由清单工具消除。

把“按任务选环境”从口头经验转为可重复清单；实际业务交付和安装成功率未验证。

- **思考**：“一套环境”是否因清单有序而可用？compose仅first-seen去重，重复插件的不同config没有冲突合并，installSequence只生成plugin add而不应用config、锁版本或校验依赖。故输出可降低选择负担，但不能证明整套兼容或“一键安装成功”。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对逐个搜索插件，增量是将场景知识保存为可合并配方并给有序计划；本地、只读的设计使用户可先审阅。数组顺序与名称去重是常规清单处理，不构成依赖求解或安装事务。

相对逐个搜索插件，增量是将场景知识保存为可合并配方并给有序计划；本地、只读的设计使用户可先审阅。数组顺序与名称去重是常规清单处理，不构成依赖求解或安装事务。

数据/纯逻辑/宿主入口分离，未知插件不静默丢失可借鉴；first-seen去重简洁但会隐藏配置选择，复用时要显式冲突策略。 源码依据：[lib/recipe.js](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/recipe.js)、[lib/recipe-data.json](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/recipe-data.json)、[lib/index.js](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/index.js)。

<a id="detail-section-5"></a>

### 主要限制

“一套环境”是否因清单有序而可用？compose仅first-seen去重，重复插件的不同config没有冲突合并，installSequence只生成plugin add而不应用config、锁版本或校验依赖。故输出可降低选择负担，但不能证明整套兼容或“一键安装成功”。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[863683348/dsh-recipe](https://github.com/863683348/dsh-recipe)
- **版本号**：0.1.0（[固定提交 67f2d4c6](https://github.com/863683348/dsh-recipe/tree/67f2d4c662954ccd25c771fa0e0a99433cf3b530)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/recipe.js、lib/recipe-data.json、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：用缺失目录项、重复插件不同config、版本冲突和错误顺序配方检查输出是否充分暴露问题，再在隔离profile衡量安装返工。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由配方已有config但安装命令未携带推导，可增加固定版本/配置冲突的只读计划器，先显示冲突与回滚清单再执行。未验证假设是减少配方组合后返工；用两个共享插件但配置相反的配方测试，若不能确定提示冲突则不成立。

用缺失目录项、重复插件不同config、版本冲突和错误顺序配方检查输出是否充分暴露问题，再在隔离profile衡量安装返工。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：63d8bea5784a29917e0ad729442c5f1b7f5d1ab9f1890a25e983572bf47c2509。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 124 | — | — | 890 |
| .js | source | 2 | 324 | 266 | 39 | — |
| .mjs | test | 1 | 77 | 66 | 1 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-recipe/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
