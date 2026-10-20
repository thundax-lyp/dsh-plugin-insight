# dsh-plugin-mall

> 在 DSH 中搜索 GitHub 插件并提供安装、更新、冲突预检与启动恢复。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d38485a](https://github.com/1e0zj/dsh-plugin-mall/tree/d38485accdf8b29945c82311ce396ebef57058f1)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1e0zj/dsh-plugin-mall) · [![npm 30d 1603](https://img.shields.io/static/v1?label=npm+30d&message=1%2C603&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)
<!-- END META -->

**使用建议**：适合维护多个插件的DSH环境；先在隔离profile验证冲突提示和回滚，再用于日常安装，重要环境保留独立备份。

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

- **用途**：DSH维护者需要发现第三方插件并避免安装破坏现有profile；合格交付是可解释的安装变更及失败后的可恢复状态。

采用建议：适合维护多个插件的DSH环境；先在隔离profile验证冲突提示和回滚，再用于日常安装，重要环境保留独立备份。

参照awesome目录与原生plugin add；不把topic覆盖率当可用插件覆盖率，也不继承作者过滤比例为本次测量。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：插件市场搜索、安装与更新
- **后台**：安装预检、profile快照及启动guard恢复

**流程与依赖**

需要GitHub/包注册表网络、pnpm及匹配的DSH profile加载语义；涉及可写profile、包下载、重启子进程。源码禁脚本预装降低一种风险，不能代替第三方依赖信任。

搜索并看验证/兼容信息，选择版本后隔离预检；硬冲突阻止、警告需确认；快照后安装并记录pending，重启guard接管；失败按快照恢复，无法确认恢复时保留材料人工处理。

**效果与成本**

现金主要为网络与包存储；人工包括审批预检差异、重启维护窗口及失败恢复。大规模补丁规则和宿主加载器同步带来持续维护成本，无真实失败率收益测量。

明确暴露安装将变更的加载树能帮助判断；它降低部分安装风险，不能保证第三方功能正确或安全。

- **思考**：核心是“重启成功”如何判定：作者README已明确加载到商城位置不证明整棵树组合完成，guard launch的稳定窗口才补上部分后续失败；进程稳定也不保证业务插件可用。静态预检对动态副作用的边界不能被“验证插件”徽章掩盖。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对目录链接加手工安装，实际贡献是把发现开放性与安装冲突预检、profile快照和启动恢复连接起来；guard.js关注补丁组合结果而非单条静态扫描，能解释插件会修改谁的加载行。不是执行安全认证。

相对目录链接加手工安装，实际贡献是把发现开放性与安装冲突预检、profile快照和启动恢复连接起来；guard.js关注补丁组合结果而非单条静态扫描，能解释插件会修改谁的加载行。不是执行安全认证。

src/guard.js 区分候选身份与原依赖快照，解析补丁组合；src/installer.js 的 writeChecked 在写后解析失败时恢复原字节。值得借鉴“先可解释计划再写入”，但加载器语义更新与跨平台重启是复用成本。 源码：[src/guard.js](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js)、[src/installer.js](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/installer.js)、[src/restart-protocol.js](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/restart-protocol.js)。

<a id="detail-section-5"></a>

### 主要限制

核心是“重启成功”如何判定：作者README已明确加载到商城位置不证明整棵树组合完成，guard launch的稳定窗口才补上部分后续失败；进程稳定也不保证业务插件可用。静态预检对动态副作用的边界不能被“验证插件”徽章掩盖。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 src/guard.js、src/installer.js、src/restart-protocol.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：在隔离profile对比手工安装与guard流程，注入补丁冲突、商城之后的加载失败及延迟崩溃，核对原文件摘要和候选依赖恢复；另以只读探针检测服务不可用，若误判正常插件则保持探针可选。

**分析版本**

- **仓库**：[1e0zj/dsh-plugin-mall](https://github.com/1e0zj/dsh-plugin-mall)
- **版本号**：0.4.17（[固定提交 d38485a](https://github.com/1e0zj/dsh-plugin-mall/tree/d38485accdf8b29945c82311ce396ebef57058f1)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：在通用启动窗口后增加用户选择的只读能力探针，并把通过标准写入pending事务，可降低“进程活着但能力不可用”的漏检；来自恢复证据粒度与业务验收之间的缺口。探针必须隔离超时，不能默认为所有插件执行目标代码。

在隔离profile对比手工安装与guard流程，注入补丁冲突、商城之后的加载失败及延迟崩溃，核对原文件摘要和候选依赖恢复；另以只读探针检测服务不可用，若误判正常插件则保持探针可选。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 125 | 75 | 32 | — |
| .md | source | 4 | 1720 | — | — | 24282 |
| .js | source | 8 | 20469 | 15087 | 4530 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/1e0zj/dsh-plugin-mall/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
