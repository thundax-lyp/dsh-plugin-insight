# dsh-file-handover

> 将显式指定的本地文件填入Windows原生文件对话框，逐项回读后再确认。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[e1c6158](https://github.com/7gzgn/dsh-file-handover/tree/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/7gzgn/dsh-file-handover)
<!-- END META -->

**使用建议**：适合单一明确文件对话框的Windows任务先试用。先dryRun检查窗口PID与标题，再填文件，最后在接收应用核对文件名和大小；多窗口并存先收敛到唯一目标。

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

- **用途**：浏览器上传或桌面应用打开文件时，Agent已触发系统对话框，需要可靠递交指定文件；合格结果还要由应用回读实际收到的文件，不能只看对话框关闭。

- **建议**：由候选窗口诊断与目标归属缺口推导，可要求触发方先给PID/句柄与创建时间，递文件只接受该窗口，候选不唯一时停下。未验证假设是减少跨应用误投，而不显著增加单窗流程成本。并行打开两个同标题对话框，若仍不能稳定绑定触发窗口则否定。

适合单一明确文件对话框的Windows任务先试用。先dryRun检查窗口PID与标题，再填文件，最后在接收应用核对文件名和大小；多窗口并存先收敛到唯一目标。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

手动选文件最直观；原始键盘模拟易受焦点/IME影响，此插件增加验证但仍需目标归属控制。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：handover_file：文件校验、窗口识别、回读一致后确认。

**流程与依赖**

Windows user32/UIAutomation与PowerShell、原生#32770控件、可访问本地文件；前一步真实点击由调用方负责，后一步应用验收也由调用方负责。

调用方打开对话框，插件等待结构匹配窗口，填路径并多轮回读，一致才在选中窗口确认；失败保留对话框和诊断供人工接管。

**效果与成本**

无外部服务费；每次PowerShell冷启动、轮询和重试增加等待，首次需确认桌面会话与目标窗口；误投文件的人工恢复成本未量化。

有望减少IME路径污染与假成功，但不保证应用真的接收或上传文件，作者事故回放不是本轮复现。

- **思考**：显式文件路径是否也意味着显式目标窗口？源码在所有#32770窗口中选择第一个含文件名控件者，expectTitle仅可选且不绑定调用方PID/句柄；记录pid不等于校验归属。因此单窗口场景有力，多文件对话框并存时仍可能递给错误应用，不能把“只点选中对话框”泛化为“选中了正确对话框”。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对盲打路径和Enter，增量是将等窗口、结构识别、输入、逐字回读与确认组成可诊断调用，绕过中文输入法污染。Win32/UIA与剪贴板均为系统能力，插件贡献在前置校验与失败保留现场。

相对盲打路径和Enter，增量是将等窗口、结构识别、输入、逐字回读与确认组成可诊断调用，绕过中文输入法污染。Win32/UIA与剪贴板均为系统能力，插件贡献在前置校验与失败保留现场。

Node编排与GUI后端分离、未回读则拒绝确认、返回每次实际值值得借鉴。结构控件ID比本地化标题稳定，但跨应用目标绑定仍是复用前提；剪贴板也会触及用户当前系统状态。 源码依据：[lib/handover.js](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.js)、[lib/handover.ps1](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1)、[lib/plan.js](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/plan.js)、[lib/index.js](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/index.js)。

<a id="detail-section-5"></a>

### 主要限制

显式文件路径是否也意味着显式目标窗口？源码在所有#32770窗口中选择第一个含文件名控件者，expectTitle仅可选且不绑定调用方PID/句柄；记录pid不等于校验归属。因此单窗口场景有力，多文件对话框并存时仍可能递给错误应用，不能把“只点选中对话框”泛化为“选中了正确对话框”。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[7gzgn/dsh-file-handover](https://github.com/7gzgn/dsh-file-handover)
- **版本号**：0.2.1（[固定提交 e1c6158d](https://github.com/7gzgn/dsh-file-handover/tree/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/handover.js、lib/handover.ps1、lib/plan.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：临时文件测试中文/空格/多选路径、读回失败不确认、两个同标题窗口、焦点切换和接收页文件名/字节数一致性。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由候选窗口诊断与目标归属缺口推导，可要求触发方先给PID/句柄与创建时间，递文件只接受该窗口，候选不唯一时停下。未验证假设是减少跨应用误投，而不显著增加单窗流程成本。并行打开两个同标题对话框，若仍不能稳定绑定触发窗口则否定。

临时文件测试中文/空格/多选路径、读回失败不确认、两个同标题窗口、焦点切换和接收页文件名/字节数一致性。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：8acf9d8e1cecc14ef14d7f233eee4a95a9424575a65243e668522fcb7dc9f943。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 95 | 71 | 11 | — |
| .js | source | 3 | 508 | 352 | 121 | — |
| .md | source | 1 | 122 | — | — | 1577 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-file-handover/issues?q=is%3Aissue+created%3A2026-09-21T03%3A10%3A42.255Z..2026-10-21T03%3A10%3A42.255Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-file-handover/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T03%3A10%3A42.255Z..2026-10-21T03%3A10%3A42.255Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
