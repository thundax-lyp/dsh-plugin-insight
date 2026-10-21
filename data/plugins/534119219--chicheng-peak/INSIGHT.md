# chicheng-peak

> 按配置时区与峰谷时段显示 DSH 边缘和输入框光效，并发送阶段提醒。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b89dc9a](https://github.com/534119219/chicheng-peak/tree/b89dc9a63eb270736fae63e43445b421477c02ab)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-peak)
<!-- END META -->

**使用建议**：需要时间提示的人可先使用自定义时段；把颜色当提醒，发请求前以自己账户和模型的实际价格为准，并测试提醒渠道，别依赖它保证送达。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

按时间安排API任务的个人用户，从界面颜色与推送获知自己配置的阶段，交付阶段提示而非自动调整账单或模型路由。

参照普通日历/定时提醒与DSH主题效果；未对其他价格调度插件做测量。

<a id="detail-section-3"></a>

### 能力、流程与依赖

lib/index.js用Intl时区字段计算phaseAt/nextTransition，服务端tick触发提前/固定时点提醒，firedKeys去重；client显示独立页面边缘、输入框和角标光效。

- **Host 路由**：时段状态/配置与提醒管理API。
- **界面**：页面边缘、输入框与角标提示。
- **后台**：时段计算、提前/固定时点渠道提醒。

DSH Web与Intl时区数据；远程提醒可选pushNotifier或messaging，本地通知需浏览器权限及页面存在。

用户配置窗口/时区→host计算阶段和下次转折→客户端显示光效→tick找到提前或固定时点→记录去重键并发送→显示最近结果；渠道失败不等于重新调度。

web bundle，host零第三方运行时依赖；设置图标可能需要官方shell补丁，不等于核心时段能力的稳定扩展接口。

<a id="detail-section-4"></a>

### 效果、成本与限制

在输入操作时降低忘记时段的概率；是否节约费用仍取决于任务可延迟性及真实计价，插件没有自动迁移任务。

首次核对当前价格、时区、窗口与通知目标；持续维护规则和渠道，动画增加注意力负担。现金节省取决于真实请求计费，不能从颜色估算；无单位任务对照。

颜色所示“低峰”是否对应当前模型、账户和真实账单？代码根据固定默认窗口与可配置覆盖判断，不读取实时价格或识别每次请求是否享受折扣；作者的定价描述可能漂移。fireReminder先加入firedKeys再等待发送，失败仍记录已触发，不能推断可靠送达；zonedEpoch用参考时点估算偏移，夏令时跨越也需单独核查。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对查看时钟或设置普通日历提醒，新增DSH当前输入场景中的持续阶段信号，以及网页关闭后仍可由host分发提醒。时区/调度与pushNotifier/messaging为既有能力；贡献在时段配置与工作界面、提前提醒的组合，不是已证实节费机制。

阶段计算、模板、配置清洗与推送分离可复用；窗口校验拒绝无效区间，去重状态持久化。发送前标记与时区偏移估算是复用到可靠调度前需要重做的边界。

源码依据：[lib/index.js](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/index.js)、[lib/client.js](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/lib/client.js)、[test/engine.test.mjs](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/test/engine.test.mjs)、[package.json](https://github.com/534119219/chicheng-peak/blob/b89dc9a63eb270736fae63e43445b421477c02ab/package.json)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：按时间安排API任务的个人用户，从界面颜色与推送获知自己配置的阶段，交付阶段提示而非自动调整账单或模型路由。

- **建议**：待验证假设：把提醒绑定到带来源/生效期的模型价格规则，并把“已调度/已接收/用户已处理”分层，可减少过期时段误导及失败后漏提醒。由当前固定窗口与发送前去重推导，未实现。用规则过期、时区切换和渠道失败三组对照检查误提示率、重复/漏发与人工确认负担；必须有可靠价格源，不能自动假定低峰便宜。

需要时间提示的人可先使用自定义时段；把颜色当提醒，发请求前以自己账户和模型的实际价格为准，并测试提醒渠道，别依赖它保证送达。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码支持可配置时段与提醒；README所述官方定价没有在本轮核实，源码默认时段不能作为现行账单依据，未来实价绑定是假设。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **Host 路由**：时段状态/配置与提醒管理API。
- **界面**：页面边缘、输入框与角标提示。
- **后台**：时段计算、提前/固定时点渠道提醒。

- **思考**：颜色所示“低峰”是否对应当前模型、账户和真实账单？代码根据固定默认窗口与可配置覆盖判断，不读取实时价格或识别每次请求是否享受折扣；作者的定价描述可能漂移。fireReminder先加入firedKeys再等待发送，失败仍记录已触发，不能推断可靠送达；zonedEpoch用参考时点估算偏移，夏令时跨越也需单独核查。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对查看时钟或设置普通日历提醒，新增DSH当前输入场景中的持续阶段信号，以及网页关闭后仍可由host分发提醒。时区/调度与pushNotifier/messaging为既有能力；贡献在时段配置与工作界面、提前提醒的组合，不是已证实节费机制。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：0.1.0；版本日期：2026-08-26（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[b89dc9a6](https://github.com/534119219/chicheng-peak/tree/b89dc9a63eb270736fae63e43445b421477c02ab)；本次截止 2026-10-21T03:00:27Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读时区引擎、fired去重、渠道分发、配置校验与客户端接线；未核实现行官方价格、实际消息送达或浏览器动画兼容。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：e56a59f0ae36cc49a9526d468584e32525d5a8bea40782100047ee8c2203bb77。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 164 | — | — | 1933 |
| .js | source | 2 | 2991 | 2624 | 215 | — |
| .mjs | test | 4 | 549 | 434 | 61 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：把提醒绑定到带来源/生效期的模型价格规则，并把“已调度/已接收/用户已处理”分层，可减少过期时段误导及失败后漏提醒。由当前固定窗口与发送前去重推导，未实现。用规则过期、时区切换和渠道失败三组对照检查误提示率、重复/漏发与人工确认负担；必须有可靠价格源，不能自动假定低峰便宜。

隔离宿主验证转折前后、重启10分钟补偿窗口、失败后重试语义、DST边界与实际显示；价格需单独从官方规则核对，本轮不作节费结论。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/534119219/chicheng-peak/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
