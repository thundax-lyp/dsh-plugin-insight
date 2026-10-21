# dsh-desktop-uia

> 通过 Windows UI Automation 为 DSH 提供桌面控件读取、操作与审计面板。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[8237631](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/tree/8237631e1dc7d1aaf37466e9682bf3299ad53cd0)

<!-- BEGIN META -->
[![npm 30d 516](https://img.shields.io/static/v1?label=npm+30d&message=516&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-desktop-uia) [![首次发布 2026-10-06](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-06&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-desktop-uia)
<!-- END META -->

**使用建议**：适合控件可访问性良好的Windows应用；先对照审批模式检查实际放行条件，在无敏感数据的应用里验证动作和后置状态。

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

- **用途**：Windows用户希望模型操作普通桌面应用；验收是找对窗口控件、按策略执行并核对操作后状态。

采用建议：适合控件可访问性良好的Windows应用；先对照审批模式检查实际放行条件，在无敏感数据的应用里验证动作和后置状态。

参照截图坐标自动化和直接UIA脚本；未执行Windows真机测试，也未复核README的所有支持矩阵。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：desktop_windows、desktop_snapshot、desktop_inspect、desktop_act、desktop_input、desktop_wait、desktop_launch、desktop_clipboard、desktop_screenshot（源码注册）
- **界面**：桌面控制设置面板
- **后台**：Windows UIA sidecar与操作审计

**流程与依赖**

仅Windows10/11 x64；需要本机.NET Framework编译器与UIA可访问应用、DSH审批/工具服务。权限等级、应用自绘和完整性级别可能限制读取/操作。

编译启动sidecar，选窗口读树并取得控件ID；写操作进入统一策略，执行UIA模式或输入回退，再读状态审计；慢Provider减深度，连续无效点击拒绝后人工接管。

**效果与成本**

无强制外部API服务，但模型调用仍需预算；人工成本包括目标应用适配、审批策略配置和失败后接管，不能把无需SDK等同零部署成本。

语义控件减少坐标脆弱性有机制支持；不覆盖所有应用，工作办结仍依赖模型选对对象与用户检查。

- **思考**：“每次写操作审批”须按模式解释。approval.js 的 ask 跟随宿主never政策，这是文档已声明的设计；此外在无approval服务、缺agent、request抛错或无明确回答时，ask也会放行，always则拒绝。属于具体配置边界，不据此断言全插件缺陷；UIA不存在的控件也不能靠语义保证。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对坐标截图操作，UIA树提供控件语义与Invoke/Value/Selection能力；插件的增量是把Windows原生UIA与DSH策略、日志、面板统一。控件可访问性来自Windows/应用，并非插件发明。

相对坐标截图操作，UIA树提供控件语义与Invoke/Value/Selection能力；插件的增量是把Windows原生UIA与DSH策略、日志、面板统一。控件可访问性来自Windows/应用，并非插件发明。

lib/service.js 让面板和工具共享审批及审计，减少旁路；lib/approval.js 明确区分ask与always失效策略，便于测试；慢树限制与重复点击保护可借鉴，移植需重写系统sidecar与权限边界。 源码：[lib/approval.js](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/approval.js)、[lib/service.js](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/service.js)、[sidecar/UiaSidecar.cs](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/sidecar/UiaSidecar.cs)。

<a id="detail-section-5"></a>

### 主要限制

“每次写操作审批”须按模式解释。approval.js 的 ask 跟随宿主never政策，这是文档已声明的设计；此外在无approval服务、缺agent、request抛错或无明确回答时，ask也会放行，always则拒绝。属于具体配置边界，不据此断言全插件缺陷；UIA不存在的控件也不能靠语义保证。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/approval.js、lib/service.js、sidecar/UiaSidecar.cs、lib/tools.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：用记事本和一个自绘应用，对比坐标点击与UIA操作，测试控件重建、遮挡、重复点击及审批服务缺失；分别跑ask/always策略矩阵并核对审计。若后置差异不能识别状态变化则不能作为自动成功判据。

**分析版本**

- **仓库**：[1jiegejiayouxuewangan1/dsh-desktop-uia](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia)
- **版本号**：1.1.3（[固定提交 8237631](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/tree/8237631e1dc7d1aaf37466e9682bf3299ad53cd0)）
- **版本日期**：2026-10-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：为高影响写操作增加“控件状态前置条件+执行后差异”声明，可比统一点击审批更有效地防错；来自service里已做快照和无效点击控制。需要处理UIA Provider不完整和状态不在结构树内的控件。

用记事本和一个自绘应用，对比坐标点击与UIA操作，测试控件重建、遮挡、重复点击及审批服务缺失；分别跑ask/always策略矩阵并核对审计。若后置差异不能识别状态变化则不能作为自动成功判据。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 858 | — | — | 11088 |
| .js | source | 9 | 3224 | 2603 | 438 | — |
| .mjs | source | 1 | 302 | 241 | 31 | — |
| .mjs | test | 13 | 2284 | 1994 | 109 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
