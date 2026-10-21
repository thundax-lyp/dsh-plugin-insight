# dsh-gui-guard

> 在Windows窗口点击或输入前检查并准备前台状态，换算坐标口径并返回动作诊断。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[dd118db](https://github.com/7gzgn/dsh-gui-guard/tree/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/7gzgn/dsh-gui-guard)
<!-- END META -->

**使用建议**：适合已有可靠目标坐标的Windows用户在无破坏性窗口先检查。必须查看isForeground与cursorMatches，并回读应用结果；混合DPI、多屏和失焦场景验证前不要依赖ok作成功判据。

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

- **用途**：已从截图/OCR取得坐标的Agent需要在Windows应用准确执行点击或输入；合格结果是目标控件产生预期状态变化，而不是鼠标移动到请求坐标。

- **建议**：由前台诊断已存在而未作门禁推导，可把动作拆为prepare令牌与执行后条件：前台不成立拒绝发送，坐标绑定截图时刻/窗口矩形，动作后由调用者检查控件状态。未验证假设是降低误点而非只增日志。用焦点抢占与混合DPI双屏对照，若错误动作率不降则否定。

适合已有可靠目标坐标的Windows用户在无破坏性窗口先检查。必须查看isForeground与cursorMatches，并回读应用结果；混合DPI、多屏和失焦场景验证前不要依赖ok作成功判据。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

原始键鼠API更简单但缺诊断；UIA语义控件操作能避免部分坐标问题，自绘应用仍可能需坐标。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：gui_guard提供list/probe/prepare/click/type与动作诊断。

**流程与依赖**

必要为Windows桌面、PowerShell/user32与可操作窗口，定位坐标由外部截图/OCR提供；受桌面锁定、权限、DPI及焦点抢占影响。

调用方定位窗口与坐标，probe检查，prepare恢复前台，再click/type发送动作，读取诊断并独立检查应用变化；失败需重新截图定位，不能盲目同点重试。

**效果与成本**

无模型/网络服务成本；每次spawn与多段固定Sleep增加延迟，首次需理解坐标口径与窗口定位，误点后恢复费用未测。

可使坐标/焦点错误更可诊断，是否减少端到端误操作未验证，不能保证自绘控件响应。

- **思考**：“可靠性层”会否把失败前提继续执行为ok？Ensure-Foreground返回isForeground，但click/type不以false阻断；click的ok=true也不取决于cursorMatches，更没有控件效果回读。全局坐标直接除以目标窗口scale在混合DPI多屏布局是否正确亦需验证。因此诊断比盲点有增量，但不是原子成功保证。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对直接mouse_event与SendKeys，增量是把最小化、激活、坐标口径和诊断统一封装，给调用方保留requested/applied证据。它是输入可靠性适配层，不提供OCR或业务验收。

相对直接mouse_event与SendKeys，增量是把最小化、激活、坐标口径和诊断统一封装，给调用方保留requested/applied证据。它是输入可靠性适配层，不提供OCR或业务验收。

ASCII脚本与base64 JSON边界减少编码转义问题，动作诊断输出值得借鉴。维护重点是DPI虚拟化和输入时序；SendKeys还具有特殊字符语义，文本输入应验证最终内容而非仅sentLength。 源码依据：[lib/index.js](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/index.js)、[lib/win32.ps1](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/win32.ps1)。

<a id="detail-section-5"></a>

### 主要限制

“可靠性层”会否把失败前提继续执行为ok？Ensure-Foreground返回isForeground，但click/type不以false阻断；click的ok=true也不取决于cursorMatches，更没有控件效果回读。全局坐标直接除以目标窗口scale在混合DPI多屏布局是否正确亦需验证。因此诊断比盲点有增量，但不是原子成功保证。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[7gzgn/dsh-gui-guard](https://github.com/7gzgn/dsh-gui-guard)
- **版本号**：0.1.1（[固定提交 dd118dbc](https://github.com/7gzgn/dsh-gui-guard/tree/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/win32.ps1 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：无破坏性测试窗口覆盖最小化、前台被抢、混合DPI双屏、窗口移动、特殊字符输入；比较实际控件结果、误点率和恢复时间。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由前台诊断已存在而未作门禁推导，可把动作拆为prepare令牌与执行后条件：前台不成立拒绝发送，坐标绑定截图时刻/窗口矩形，动作后由调用者检查控件状态。未验证假设是降低误点而非只增日志。用焦点抢占与混合DPI双屏对照，若错误动作率不降则否定。

无破坏性测试窗口覆盖最小化、前台被抢、混合DPI双屏、窗口移动、特殊字符输入；比较实际控件结果、误点率和恢复时间。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：0967a1e123a686d0281f1e5d4ea19d8eccfc73c40c72c9578a7f330f3c118c37。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 304 | 245 | 41 | — |
| .md | source | 1 | 116 | — | — | 1328 |
| .mjs | test | 1 | 112 | 92 | 8 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-gui-guard/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-gui-guard/issues?q=is%3Aissue+created%3A2026-09-21T03%3A10%3A48.012Z..2026-10-21T03%3A10%3A48.012Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-gui-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T03%3A10%3A48.012Z..2026-10-21T03%3A10%3A48.012Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
