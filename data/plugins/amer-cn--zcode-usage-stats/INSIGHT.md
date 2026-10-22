# zcode-usage-stats

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[9a43816](https://github.com/Amer-CN/zcode-usage-stats/tree/9a4381658e754515dac50611da461970462032ec)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Amer-CN/zcode-usage-stats) [![npm 30d 157](https://img.shields.io/static/v1?label=npm+30d&message=157&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/zcode-usage-stats) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/zcode-usage-stats)
<!-- END META -->

> **实现功能**：扫描历史会话用量并在设置页展示趋势、模型分布与活跃热力图。

> **核心亮点**：把已有持久化事件变成多粒度可读视图，并用SWR缓解重复扫描等待。视觉与本地聚合为主要增量，模型用量语义归宿主。

> **风险与缺陷**：去重只在turn/step都是数字时成立，同一步若多条usage不同将取首条；完整性依赖宿主事件契约。磁盘缓存固定web目录可能跨profile复用错误历史，空/部分扫描与真实低用量需看warnings。

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

> **用途**：本地回顾各模型token使用与活跃天数，不用于核账或产出质量评价。

参照宿主历史usage与手工聚合；增量是历史扫描、缓存和SVG可视化，不实现费用计价。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **后台**：历史用量扫描与SWR缓存
- **Host 路由**：/api/usage-stats
- **界面**：用量趋势、模型分布与活跃统计

**流程与依赖**

sessionPersistence全量枚举/逐日志读事件，assistant/message usage按turn:step去重，模型回退request/context；内存/磁盘缓存SWR，精确GET路由显式调用connection.requestRejection。

宿主sessionPersistence、webServer、connection及settings slot；缓存路径固定~/.dsh/profiles/web，桌面/自定义DSH_HOME需核。

首次或刷新扫描→日/小时/模型聚合→写JSON缓存→客户端筛时间窗画SVG；过期先返旧缓存后台刷新，warning保存部分读取失败。

**效果与成本**

历史规模决定磁盘读取和内存，20秒deadline主要控制调度不取消已开始读取；无模型/API费，需维护事件兼容与缓存迁移。

提供历史可见性，无账单对账、节约金额或效率收益验证。

> **思考**：去重只在turn/step都是数字时成立，同一步若多条usage不同将取首条；完整性依赖宿主事件契约。磁盘缓存固定web目录可能跨profile复用错误历史，空/部分扫描与真实低用量需看warnings。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把已有持久化事件变成多粒度可读视图，并用SWR缓解重复扫描等待。视觉与本地聚合为主要增量，模型用量语义归宿主。

把已有持久化事件变成多粒度可读视图，并用SWR缓解重复扫描等待。视觉与本地聚合为主要增量，模型用量语义归宿主。

宿主信任栅栏缺失时拒绝、日志handle finally关闭、inflight合并扫描、同step去重值得复用；生成bundle重复代码不算原创统计。

源码依据：[lib/index.mjs](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs)、[build/body.js](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/build/body.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

去重只在turn/step都是数字时成立，同一步若多条usage不同将取首条；完整性依赖宿主事件契约。磁盘缓存固定web目录可能跨profile复用错误历史，空/部分扫描与真实低用量需看warnings。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合本地用量回顾；先核事件口径、缓存新鲜度和扫描warning，勿把token活动当生产成果。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[Amer-CN/zcode-usage-stats](https://github.com/Amer-CN/zcode-usage-stats)
- **版本号**：0.1.0（[固定提交 9a438165](https://github.com/Amer-CN/zcode-usage-stats/tree/9a4381658e754515dac50611da461970462032ec)）
- **版本日期**：2026-09-13（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.mjs、build/body.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来合成历史核重复事件、失败读取、deadline、缓存profile及本地日期边界；本轮未扫真实会话。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：缓存键绑定profile/事件契约并输出扫描覆盖与usage去重依据，可避免错范围趋势。用两profile、重复/修正usage、失败日志及大历史对比总量与coverage；不能对齐原事件则不作预算依据。

未来合成历史核重复事件、失败读取、deadline、缓存profile及本地日期边界；本轮未扫真实会话。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d0c3e491db87780d4bb08804f33a1a4086ea0981b0bc0ce9aa9857afe3e12755。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1124 | 965 | 88 | — |
| .mjs | source | 1 | 416 | 351 | 58 | — |
| .md | source | 1 | 176 | — | — | 1859 |
| .cjs | test | 4 | 530 | 467 | 50 | — |

排除 3 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Amer-CN/zcode-usage-stats/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A01%3A43.721Z..2026-10-21T08%3A01%3A43.721Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
