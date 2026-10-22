# dsh-cua-pre

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[6b64708](https://github.com/Aik358/dsh-cua-pre/tree/6b64708e2514ef4a1b9cb6004adb4838d4b114bb)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-cua-pre) [![npm 30d 381](https://img.shields.io/static/v1?label=npm+30d&message=381&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-cua-pre) [![最新发布 2026-09-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-06&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-cua-pre)
<!-- END META -->

> **实现功能**：以Windows无障碍树优先的工具、Python worker和可视面板，为DSH提供桌面观察与操作。

> **核心亮点**：将观察失效、目标校验、未知动作结果和持久停止纳入同一工具协议，比裸pyautogui坐标脚本更可治理；UIA/SendInput及视觉模型本身来自系统与上游。

> **风险与缺陷**：安全语义是否等于实际动作保证？RuntimeId不支持时会降级，矩形容差也不能保证同语义控件；timeout只是等待结果结束，noop不能撤销已发原生动作。付款/删除/外发确认主要是GUIDANCE措辞，不是通用Host硬审批。

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

> **用途**：Windows桌面任务需先观察、定位后动作，并区分未执行与可能已执行，尤其不能重复发送/支付等副作用。

裸坐标自动化更少状态开销但易点错；无障碍优先保留语义信息，仍须真实应用验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：桌面观察、点击、键盘、截图与停止控制。
- **后台**：Windows Python UIA worker与协议桥接。
- **Host 路由**：loopback配置、状态和帧接口。
- **界面**：操作记录、帧墙与设置。

**流程与依赖**

DSH tools/attachments/llm/webServer、Windows UIA/SendInput、Python worker，视觉可选模型；屏幕与应用权限影响观察覆盖。

启用并配置目标→观察树得state/index→校验并执行最小动作→旧观察失效→重新观察；timeout先核实当前UI，停止后人工恢复。

**效果与成本**

首次解释器/依赖与权限、允许PID设置，持续UI变动回归、截图存储和可选视觉模型调用；分块缓存节费无本轮测量。

可减少坐标猜测、提高动作可追踪性，实际任务成功率和跨应用稳定性未测。

> **思考**：安全语义是否等于实际动作保证？RuntimeId不支持时会降级，矩形容差也不能保证同语义控件；timeout只是等待结果结束，noop不能撤销已发原生动作。付款/删除/外发确认主要是GUIDANCE措辞，不是通用Host硬审批。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将观察失效、目标校验、未知动作结果和持久停止纳入同一工具协议，比裸pyautogui坐标脚本更可治理；UIA/SendInput及视觉模型本身来自系统与上游。

将观察失效、目标校验、未知动作结果和持久停止纳入同一工具协议，比裸pyautogui坐标脚本更可治理；UIA/SendInput及视觉模型本身来自系统与上游。

旧观察失权、epoch隔离、未知结果提示和持久kill switch可借鉴；默认空PID列表、UIA降级与原生动作不可取消须明确。 源码依据：[lib/index.js](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/index.js)、[lib/cua-tools-pre.js](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-tools-pre.js)、[lib/cua-session-pre.js](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-session-pre.js)、[lib/cua-sidecar-client-pre.js](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/lib/cua-sidecar-client-pre.js)、[python/worker_cua_v2.py](https://github.com/Aik358/dsh-cua-pre/blob/6b64708e2514ef4a1b9cb6004adb4838d4b114bb/python/worker_cua_v2.py)。

<a id="detail-section-5"></a>

### 1.4 主要限制

安全语义是否等于实际动作保证？RuntimeId不支持时会降级，矩形容差也不能保证同语义控件；timeout只是等待结果结束，noop不能撤销已发原生动作。付款/删除/外发确认主要是GUIDANCE措辞，不是通用Host硬审批。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在可丢弃窗口、明确PID范围验证观察/动作/停止；高影响任务保留人工确认和结果核对，不能将提示纪律当已实现审批。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[Aik358/dsh-cua-pre](https://github.com/Aik358/dsh-cua-pre)
- **版本号**：0.6.2（[固定提交 6b64708e](https://github.com/Aik358/dsh-cua-pre/tree/6b64708e2514ef4a1b9cb6004adb4838d4b114bb)）
- **版本日期**：2026-09-08（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/cua-tools-pre.js、lib/cua-session-pre.js、lib/cua-sidecar-client-pre.js、python/worker_cua_v2.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、lib/cua-tools-pre.js、lib/cua-session-pre.js、lib/cua-sidecar-client-pre.js、python/worker_cua_v2.py；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：测试RuntimeId缺失、同名控件、窗口移动、worker迟到/崩溃和重复请求，核对stop跨重启、PID拒绝及敏感动作确认边界；不用真实账户外发。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由epoch和观察状态推导，可对高影响动作增加Host授权令牌和动作后可核查收据，未知结果冻结同业务动作直到人工或只读对账。未验证；注入worker迟响应/崩溃与UI漂移时应不重放、不误点，确认不可仅靠模型守提示。

测试RuntimeId缺失、同名控件、窗口移动、worker迟到/崩溃和重复请求，核对stop跨重启、PID拒绝及敏感动作确认边界；不用真实账户外发。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：5fe7dd5b243a8bda3d3b6881b89ee43f12fe14d24a25e9b87284a6dab4618891。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 303 | — | — | 4104 |
| .js | source | 6 | 3372 | 2990 | 220 | — |
| .mjs | source | 4 | 514 | 382 | 74 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Aik358/dsh-cua-pre/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
