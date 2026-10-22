# drag-and-drop（AKIRACOD fork）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c20646a](https://github.com/AKIRACOD/dsh-drag-and-drop/tree/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AKIRACOD/dsh-drag-and-drop)
<!-- END META -->

> **实现功能**：将拖入的本地文件/目录定位为真实路径，以可删除芯片送入会话。

> **核心亮点**：这是README明确承认的omdsh-dev/bill9109上游fork，不能把路径定位全算本fork原创。本项可辨认的增量是把路径文本暂存改成可删芯片、独立发送按钮并保留纯图片原生路径；底层分阶段识别降低大文件每次全量摘要的开销。价值是输入操作改进，未改变Agent对文件的权限。

> **风险与缺陷**：芯片是否与拖放时的会话绑定？pending是apply级数组，flushPending才读取当前会话；切换会话后可能送入另一会话。定位的唯一元数据候选会直接found而不核内容，因此同名同大小的错误候选仍可能被接受；Host后续摘要阶段接受客户端candidates，未见插件内工作区授权校验，不能将搜索范围当权限隔离。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同机运行浏览器与DSH的用户把现有文档或源码目录交给Agent，无需上传副本或手敲绝对路径；合格交付是指向用户原件的正确路径。

原生图片附件、复制文件路径或上游拖放插件均可完成部分任务；本fork主要减少文档输入和发送摩擦。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Host 路由**：POST /file-drop/locate执行本地路径定位与摘要比对。
- **界面**：全局拖放覆盖层、路径芯片、发送/移除按钮和错误提示。
- **事件监听**：浏览器drag/drop、Enter与pointerdown，在提交前把路径写入input服务。

**流程与依赖**

先解析拖放URI，缺失路径时向/file-drop/locate提交名字、大小和时间等元数据；Host依次查工作区、常用目录与系统索引。多候选再比较抽样/完整文件摘要或目录结构/内容摘要，最终无法区分时由用户选择。浏览器把路径暂存为芯片，在发送前写入当前会话input服务。

DSH webServer、sessions/workspaces/conversation服务，浏览器File API；定位回退依赖mdfind/plocate/Everything或PowerShell及Host文件可读性。

拖放非纯图片→异步定位→成功进入全局pending芯片→发送时合并路径与草稿并清空；失败toast，歧义选择，dispose删除窗口监听和覆盖层。

DSH Web双面bundle，包导出lib而源码在src；README称含构建物，本轮未构建或证明src与lib完全对应。

**效果与成本**

现金：无新增模型API；人工：构建物/宿主输入接口维护，定位失败需手选或手抄路径。摘要会读取内容，广域目录搜索、系统索引与大目录扫描消耗IO和等待时间。

相较上传副本保留邻接文件关系，减少路径输入；原文件仍可能由Agent随后修改，拖放并不提供只读保证。

> **思考**：芯片是否与拖放时的会话绑定？pending是apply级数组，flushPending才读取当前会话；切换会话后可能送入另一会话。定位的唯一元数据候选会直接found而不核内容，因此同名同大小的错误候选仍可能被接受；Host后续摘要阶段接受客户端candidates，未见插件内工作区授权校验，不能将搜索范围当权限隔离。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：这是README明确承认的omdsh-dev/bill9109上游fork，不能把路径定位全算本fork原创。本项可辨认的增量是把路径文本暂存改成可删芯片、独立发送按钮并保留纯图片原生路径；底层分阶段识别降低大文件每次全量摘要的开销。价值是输入操作改进，未改变Agent对文件的权限。

这是README明确承认的omdsh-dev/bill9109上游fork，不能把路径定位全算本fork原创。本项可辨认的增量是把路径文本暂存改成可删芯片、独立发送按钮并保留纯图片原生路径；底层分阶段识别降低大文件每次全量摘要的开销。价值是输入操作改进，未改变Agent对文件的权限。

请求体上限4MiB，搜索有候选数/深度/遍历数上限，execFile平台命令有限时；多候选逐级摘要控制IO，最终歧义不强行选一。副作用路由的输入是类型断言而非完整运行时schema，限流和范围检查仍需宿主保障。

固定源码依据：[src/index.ts](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/index.ts)、[src/locator.ts](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/locator.ts)、[src/platform-search.ts](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/platform-search.ts)、[src/protocol.ts](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/protocol.ts)、[src/client/index.ts](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/client/index.ts)、[src/client/locator.ts](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/client/locator.ts)、[package.json](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

芯片是否与拖放时的会话绑定？pending是apply级数组，flushPending才读取当前会话；切换会话后可能送入另一会话。定位的唯一元数据候选会直接found而不核内容，因此同名同大小的错误候选仍可能被接受；Host后续摘要阶段接受客户端candidates，未见插件内工作区授权校验，不能将搜索范围当权限隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

可作为同机本地文件输入方案候选；需跨会话频繁操作、远程Host或敏感目录访问控制的场景，先解决会话归属和搜索授权边界。

核查状态：分阶段定位与芯片输入路径可由源码确认；原件识别准确率、跨平台兼容和发送会话正确性未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.2.0；版本日期：2026-08-14（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[c20646ad](https://github.com/AKIRACOD/dsh-drag-and-drop/tree/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根组件src Host路由、定位、平台搜索、浏览器拖放与输入代码、协议、包清单及fork说明。统计根组件，未核定与上游逐行差异，不将所有机制归属fork原创。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

把待发送项绑定到拖入时的session及文件标识，并在唯一候选也验证小摘要，可能同时降低跨会话误发与误识别。用两个同名同大小不同内容文件、搜索索引过时和拖后切会话的固定案例，要求全部拒绝错误归属；若仅改善外观而误发率不变则假设失败。

提出而未执行：切换会话、同名不同内容、重复副本、远程Host以及索引缺失案例，分别记录误识别与IO耗时；不把仓库测试文件当通过记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 603 | — | — | 5921 |
| .js | source | 21 | 2541 | 2416 | 108 | — |
| .mjs | source | 3 | 149 | 127 | 8 | — |
| .ts | source | 19 | 1357 | 1200 | 29 | — |
| .ts | test | 9 | 420 | 378 | 11 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AKIRACOD/dsh-drag-and-drop/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
