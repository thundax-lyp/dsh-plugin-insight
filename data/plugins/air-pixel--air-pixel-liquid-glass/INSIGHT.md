# air-pixel-liquid-glass

> 为DSH提供可配置半透明玻璃主题、壁纸、光标和点击效果，并可选适配桌面窗口透明。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[4b980fb](https://github.com/AIR-pixel/air-pixel-liquid-glass/tree/4b980fb2cbac292274a6b3136696ab27e3b1decc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AIR-pixel/air-pixel-liquid-glass)
<!-- END META -->

**使用建议**：先试CSS主题并保留足够消息对比度。需要桌面透明时另审补丁范围和恢复备份，升级后重新检查，勿将演示渲染当真机验收。

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

- **用途**：希望定制界面且保持可读性的DSH用户，合格体验需对比度和性能可接受、禁用可恢复；桌面透明与网页CSS是不同能力。

- **建议**：由patch外部通道推导，可通过宿主正式窗口材质API和可达性能力声明替代归档修改，同时按实测对比度限制强度。未验证；不同背景/主题/升级下测文本可读与恢复，若仍需不可追踪patch则不成立。

先试CSS主题并保留足够消息对比度。需要桌面透明时另审补丁范围和恢复备份，升级后重新检查，勿将演示渲染当真机验收。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

普通CSS主题维护成本更低；窗口透明需主进程授权，不可用CSS代替。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：玻璃主题、壁纸、光标、ripple与对比度设置。
- **Host 路由**：配置持久化与窗口材质状态接口。

**流程与依赖**

DSH客户端设计token/webServer，桌面效果还依赖patched主进程和系统窗口材质；权限/平台不足时应清楚降级。

设置主题、保存host配置并应用CSS；可选工具备份/patch宿主，主进程读材质请求并反馈；禁用主题与恢复patch分开验收。

**效果与成本**

首次调对比度与可选patch备份，持续GPU模糊、升级回归和排错成本；无渲染性能或阅读效率实测。

视觉个性与状态层次可能改善偏好，未证明效率，过透明可能损可读。

- **思考**：是否“装主题”就得到桌面透明？README明确需主进程patch，运行宿主本身不能直接调BrowserWindow；更新替换asar后需重新核对。截图是stand-in shell渲染而非真实透明截图，不能据示例认定当前目标机器效果或性能。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对单一换色，增量是玻璃强度与双侧消息对比度一起可配，并显式区分窗口材质与CSS。Electron窗口效果归平台机制，插件实现主题和接线。

相对单一换色，增量是玻璃强度与双侧消息对比度一起可配，并显式区分窗口材质与CSS。Electron窗口效果归平台机制，插件实现主题和接线。

主题token和host持久配置分离、补丁可用性检测值得借鉴；资源文件通道和asar修改引入版本耦合，卸载插件不自动等于归档恢复。 源码依据：[index.js](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/index.js)、[client.js](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/client.js)、[tools/asarpatch.py](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/tools/asarpatch.py)。

<a id="detail-section-5"></a>

### 主要限制

是否“装主题”就得到桌面透明？README明确需主进程patch，运行宿主本身不能直接调BrowserWindow；更新替换asar后需重新核对。截图是stand-in shell渲染而非真实透明截图，不能据示例认定当前目标机器效果或性能。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AIR-pixel/air-pixel-liquid-glass](https://github.com/AIR-pixel/air-pixel-liquid-glass)
- **版本号**：0.2.0（[固定提交 4b980fb2](https://github.com/AIR-pixel/air-pixel-liquid-glass/tree/4b980fb2cbac292274a6b3136696ab27e3b1decc)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 index.js、client.js、tools/asarpatch.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读index.js、client.js、tools/asarpatch.py；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：测试明暗/复杂壁纸的对比度、光标/ripple清理、刷新配置一致与GPU开销；另在临时应用副本验证patch/check/revert及升级。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由patch外部通道推导，可通过宿主正式窗口材质API和可达性能力声明替代归档修改，同时按实测对比度限制强度。未验证；不同背景/主题/升级下测文本可读与恢复，若仍需不可追踪patch则不成立。

测试明暗/复杂壁纸的对比度、光标/ripple清理、刷新配置一致与GPU开销；另在临时应用副本验证patch/check/revert及升级。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：1382d780d6b95449742b368eabc1cb3a49502e4d3705664c2543191b0ebcfef5。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4541 | 2367 | 1968 | — |
| .md | source | 2 | 106 | — | — | 1050 |
| .mjs | source | 19 | 10092 | 7057 | 2559 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AIR-pixel/air-pixel-liquid-glass/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
