# dsh-multi-folder

> 为DSH工作区配置次级目录，在原工具和会话权限模式下读写执行，并补充目录提示与文件菜单。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[5921c0e](https://github.com/AngelosZou/dsh-multi-folder/tree/5921c0e2fd2623bc0757b8f13feaf73cee3648ca)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-multi-folder) [![npm 30d 2,077](https://img.shields.io/static/v1?label=npm+30d&message=2%2C077&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-multi-folder) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-multi-folder)
<!-- END META -->

**使用建议**：适合确需同时操作多个可信仓库者，先用临时目录核对read-only与workspace-write，并检查显示的全部授权根。跨仓库提交和回滚仍分别验收。

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

- **用途**：跨源码/测试/文档仓库任务需要同会话操作多个明确授权目录，主cwd与各目录身份仍须可追踪。

- **建议**：由re-root policy与路径配置推导，可用canonical路径hash作存储键、显示授权根变更收据并将所有工具统一交宿主多根policy。未验证；碰撞路径、符号链接、后台任务和配置删除时应保持授权归属且无旧根继续写。

适合确需同时操作多个可信仓库者，先用临时目录核对read-only与workspace-write，并检查显示的全部授权根。跨仓库提交和回滚仍分别验收。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

多个独立会话隔离更清晰，普通绝对路径在workspace-write会拒绝；插件有意扩大同任务范围。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **用户命令**：/multi-folder管理次级目录。
- **界面**：会话/新建页目录配置与@菜单。
- **事件监听**：工具管道、prompt assemble与消息边界通知。
- **后台**：目录配置与索引维护。

**流程与依赖**

DSH fs/shell/sandboxPolicy/tools/jobs/commands/systemPrompt与可选Typert客户端，目录须真实可达。

用户加目录→Host保存配置→提示注入/@菜单→命中次目录工具重新root policy执行→变更消息边界通知；明确升级请求仍走原审批。

**效果与成本**

首次目录授权、跨仓库上下文与权限理解，持续多仓库回归/提交协调和插件API维护；未测任务效率。

减少切工作区摩擦，权限范围扩大和版本耦合需用户承担。

- **思考**：等同主工作区权限是否覆盖每条路径？仅截获特定工具，显式escalation交回默认pipeline，新宿主工具/API需适配；配置文件名将非字母数字折叠并小写，不同workspace可能碰名，共享/错配目录需验证。目录配置权限不是每次操作确认。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对仅把目录路径写提示，增量是扩展原工具实际可写/执行根并保留模式与后台job接线；不产生多仓库事务，git分支/主cwd仍由宿主与工具负责。

相对仅把目录路径写提示，增量是扩展原工具实际可写/执行根并保留模式与后台job接线；不产生多仓库事务，git分支/主cwd仍由宿主与工具负责。

先await配置hydration、调用归属后不错误回退、后台使用同policy可借鉴；配置键碰撞与工具覆盖面值得优先核查。 源码依据：[lib/index.js](https://github.com/AngelosZou/dsh-multi-folder/blob/5921c0e2fd2623bc0757b8f13feaf73cee3648ca/lib/index.js)、[lib/client.js](https://github.com/AngelosZou/dsh-multi-folder/blob/5921c0e2fd2623bc0757b8f13feaf73cee3648ca/lib/client.js)。

<a id="detail-section-5"></a>

### 主要限制

等同主工作区权限是否覆盖每条路径？仅截获特定工具，显式escalation交回默认pipeline，新宿主工具/API需适配；配置文件名将非字母数字折叠并小写，不同workspace可能碰名，共享/错配目录需验证。目录配置权限不是每次操作确认。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AngelosZou/dsh-multi-folder](https://github.com/AngelosZou/dsh-multi-folder)
- **版本号**：0.3.3（[固定提交 5921c0e2](https://github.com/AngelosZou/dsh-multi-folder/tree/5921c0e2fd2623bc0757b8f13feaf73cee3648ca)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、lib/client.js；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：构造规范化同名workspace、symlink、只读/写模式、显式升级与后台job，删授权后测试新操作及通知；核对每种工具走哪层policy。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由re-root policy与路径配置推导，可用canonical路径hash作存储键、显示授权根变更收据并将所有工具统一交宿主多根policy。未验证；碰撞路径、符号链接、后台任务和配置删除时应保持授权归属且无旧根继续写。

构造规范化同名workspace、symlink、只读/写模式、显式升级与后台job，删授权后测试新操作及通知；核对每种工具走哪层policy。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：38153fffbc9697cacce1750a438e4d55797af4aca73b52721128016e6d7e2fda。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1310 | — | — | 12120 |
| .js | source | 2 | 3332 | 2439 | 756 | — |
| .mjs | test | 3 | 2313 | 1842 | 329 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-multi-folder/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-multi-folder/issues?q=is%3Aissue+created%3A2026-09-21T08%3A02%3A58.604Z..2026-10-21T08%3A02%3A58.604Z) [![近30天关闭 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-multi-folder/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A02%3A58.604Z..2026-10-21T08%3A02%3A58.604Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
