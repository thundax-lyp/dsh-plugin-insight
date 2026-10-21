# dsh-undo-plugin

> 为 DSH 组合消息级文件与会话回滚、归档管理、工具卡片及轨迹折叠界面。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/23swccp/dsh-undo) · [![npm 30d 965](https://img.shields.io/static/v1?label=npm+30d&message=965&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-undo-plugin)
<!-- END META -->

**使用建议**：只在备份过且无子模块的独立Git工作区先试，核对安装后的七个依赖版本；用可丢弃修改测试文件和分叉上下文是否一起回到目标点，再考虑日常使用。外部服务写入仍需单独处理。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
  - [源码索引](#detail-section-7)
- [未来设计假设（未验证）](#detail-section-8)
- [辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

bundle配置与同提交依赖源码支持“文件树+会话分叉”组合贡献；目标组件本身不含核心实现，依赖核查另列且未混入组件统计。未执行文件回滚或故障恢复。

[重点创新推演与最小验证](#innovation)

- **用途**：面向Agent修改代码后需要撤回某轮文件与对话上下文的开发者；合格回滚须目标文件树正确、分叉会话不再看到已撤回工具历史，且失败可恢复。

采用建议：只在备份过且无子模块的独立Git工作区先试，核对安装后的七个依赖版本；用可丢弃修改测试文件和分叉上下文是否一起回到目标点，再考虑日常使用。外部服务写入仍需单独处理。

参照用户仓库git reset、手动复制新聊天与宿主单纯归档；该组合同时管理文件及模型可见历史，不能扩展成全系统事务回滚。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **用户命令**：bundle启用的rollback-undo依赖定义/undo回滚入口
- **后台**：bundle组合私有Shadow Git、journal恢复及会话分叉依赖
- **界面**：bundle配置回滚按钮、归档设置、工具卡片及轨迹折叠客户端

**流程与依赖**

七个rollback依赖、宿主agents/sessionFork/sessionArchive、Git及本地文件权限必需；客户端卡片需web UI，headless可减界面。ShadowGit拒绝bare/submodule工作区，外部服务状态无法降级成文件快照。

捕获用户轮次前文件树→Agent执行→用户选消息/时间线或/undo→停止活动并写journal→私有Git恢复与fork→归档原会话→发布新分支；失败按阶段补偿或标需恢复，用户应先对账而不是重复点撤销。

**效果与成本**

首次需Git、受支持worktree和插件组合兼容检查，私有快照增加磁盘/扫描开销；持续回滚预览与外部副作用核对需人工。大工作树快照耗时与空间未测，不能从不碰.git推出零资源成本。

减少手动还文件和重建上下文的交接失误；效果取决于快照覆盖与失败补偿，无法替代外部系统恢复，也不等于所有命令可逆。

- **思考**：文件恢复、会话fork和归档能否构成一个可恢复的逻辑动作？rollback-undo/src/index.ts先记录restoring，再并发fork/restore，并对部分失败补偿，但这些系统并非单个原子事务。ShadowGit明确拒绝submodule，且只保存Git支持的路径；外部数据库/API副作用不在快照中。正常路径源码充分，崩溃窗口恢复仍须实际故障实验。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对git reset只还原文件、会话继续携带旧工具记忆，以及单纯新建聊天，贡献是私有Git快照与按消息边界分叉对齐。私有GIT_DIR/INDEX保护用户仓库索引，journal记录副作用阶段；bundle同时调整归档namespace所有权，因此是跨插件工作流组合而非单个撤销按钮。

相对git reset只还原文件、会话继续携带旧工具记忆，以及单纯新建聊天，贡献是私有Git快照与按消息边界分叉对齐。私有GIT_DIR/INDEX保护用户仓库索引，journal记录副作用阶段；bundle同时调整归档namespace所有权，因此是跨插件工作流组合而非单个撤销按钮。

shadow-git.ts用独立GIT_DIR/GIT_INDEX_FILE隔离快照，差异恢复只删除from中出现但目标缺失的路径，避免把未知新文件一并清掉，值得借鉴。index.ts的持久journal与compensate路径展示恢复设计，但跨fork/restore/归档仍需逐窗口验证；移植必须匹配宿主消息边界和会话生命周期。

<a id="detail-section-5"></a>

### 主要限制

文件恢复、会话fork和归档能否构成一个可恢复的逻辑动作？rollback-undo/src/index.ts先记录restoring，再并发fork/restore，并对部分失败补偿，但这些系统并非单个原子事务。ShadowGit明确拒绝submodule，且只保存Git支持的路径；外部数据库/API副作用不在快照中。正常路径源码充分，崩溃窗口恢复仍须实际故障实验。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 packages/bundle-rollback/package.json、packages/bundle-rollback/cordis.patch.yml、packages/rollback-undo/src/index.ts、packages/rollback-undo/src/shadow-git.ts、packages/client-rollback-button/src/client/controller.ts 及固定范围 inventory；组件：packages/bundle-rollback。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整核查bundle清单/依赖与同固定提交的rollback-undo入口、shadow-git及客户端controller；不把依赖源码LOC算bundleLOC，未测试Git/宿主恢复或所有七依赖。
- 下一步：在隔离worktree设置新增/修改/删除/忽略文件，逐步注入fork、restore、archive失败和进程退出，重启后核对journal、文件树、索引和会话边界；加入假外部写入检查覆盖单是否明确遗漏。覆盖单若漏掉不可恢复动作则不能支持安全感增量。

**分析版本**

- **仓库**：[23swccp/dsh-undo](https://github.com/23swccp/dsh-undo)
- **版本号**：0.1.0-rc.8（[固定提交 bc8edbe4](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 源码索引

- [packages/bundle-rollback/package.json](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/package.json)
- [packages/bundle-rollback/cordis.patch.yml](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml)
- [packages/rollback-undo/src/index.ts](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts)
- [packages/rollback-undo/src/shadow-git.ts](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts)
- [packages/client-rollback-button/src/client/controller.ts](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/client-rollback-button/src/client/controller.ts)

<a id="detail-section-8"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：回滚前列出“可恢复文件/会话状态/不可恢复外部副作用”覆盖单，并把实际变更集摘要与journal绑定。来源是ShadowGit边界与跨域事务，目的让用户知道撤回承诺范围；新增负担是工具副作用分类和摘要维护，不能伪装为自动补偿外部系统。

在隔离worktree设置新增/修改/删除/忽略文件，逐步注入fork、restore、archive失败和进程退出，重启后核对journal、文件树、索引和会话边界；加入假外部写入检查覆盖单是否明确遗漏。覆盖单若漏掉不可恢复动作则不能支持安全感增量。

<a id="detail-section-9"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 22 | — | — | 163 |
| .ts | source | 1 | 4 | 2 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/23swccp/dsh-undo/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
