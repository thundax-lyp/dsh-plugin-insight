# dsh-sysmon

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[4cb7a24](https://github.com/AKS1st/dsh-sysmon/tree/4cb7a241f0228329d12010b4846c1bd508271ec0)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-sysmon) [![npm 30d 117](https://img.shields.io/static/v1?label=npm+30d&message=117&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-sysmon) [![最新发布 2026-08-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-28&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-sysmon)
<!-- END META -->

> **实现功能**：周期采集Linux整机CPU、内存与根磁盘并显示状态浮层。

> **核心亮点**：把采样从请求解耦，sampling锁避免重叠，3秒/4096字节限制控制子进程；整机指标呈现便捷，非新监控方法。

> **风险与缺陷**：失败保留旧缓存而响应没有采样时间/过期标记，可能把陈旧健康值当实时；CPU总核百分比可超100且首样为0，需清晰解释。数据不含进程归因，不能据此推断Agent成本。

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

> **用途**：在DSH内观察主机资源压力，不能直接归因某模型或会话。

参照top/free/df与监控面板；增量是宿主shell有界采样、缓存路由和前台展示。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **后台**：每秒Linux资源缓存采样
- **Host 路由**：/dsh-sysmon/api缓存查询
- **界面**：整机资源浮层

**流程与依赖**

每秒通过ctx.shell运行固定awk/nproc/df命令，解析/proc；CPU按前后差值乘核心数，GET只返回缓存。

宿主webServer/shell/timer、Linux /proc、awk/nproc/df及客户端overlay；其他系统没有等价采集回退。

后台单次采样→差分CPU→缓存→浏览器轮询→阈值颜色；采样失败保留旧值。

**效果与成本**

每秒固定子进程及客户端轮询有持续成本，低于每请求采样；无模型token调用，平台维护有负担。

提供就地资源线索，未证明故障定位或性能收益。

> **思考**：失败保留旧缓存而响应没有采样时间/过期标记，可能把陈旧健康值当实时；CPU总核百分比可超100且首样为0，需清晰解释。数据不含进程归因，不能据此推断Agent成本。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把采样从请求解耦，sampling锁避免重叠，3秒/4096字节限制控制子进程；整机指标呈现便捷，非新监控方法。

把采样从请求解耦，sampling锁避免重叠，3秒/4096字节限制控制子进程；整机指标呈现便捷，非新监控方法。

采样/纯解析/展示分离，缓存防请求放大可复用；sameOrigin允许无来源头，不能描述为独立身份认证。

源码依据：[src/index.ts](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/index.ts)、[src/collect.ts](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/collect.ts)、[src/client/index.ts](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/client/index.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

失败保留旧缓存而响应没有采样时间/过期标记，可能把陈旧健康值当实时；CPU总核百分比可超100且首样为0，需清晰解释。数据不含进程归因，不能据此推断Agent成本。

<a id="detail-section-6"></a>

### 1.5 使用建议

Linux主机辅助观察，先验证指标尺度和失败状态；正式告警另用监控系统。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AKS1st/dsh-sysmon](https://github.com/AKS1st/dsh-sysmon)
- **版本号**：0.2.1（[固定提交 4cb7a241](https://github.com/AKS1st/dsh-sysmon/tree/4cb7a241f0228329d12010b4846c1bd508271ec0)）
- **版本日期**：2026-09-08（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/collect.ts、src/client/index.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：隔离Linux核采样超时、失败陈旧、CPU分母与root磁盘含义；本轮未调用shell采样。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：返回采样时间、失败状态和容量归一显示可减少误读。模拟连续失败、首次启动与多核满载，比较用户对新鲜度和饱和程度的判断。

隔离Linux核采样超时、失败陈旧、CPU分母与root磁盘含义；本轮未调用shell采样。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：bc6ed3b7f338d02f16aa4f0770f6b730a404405a63a015b0a0999b3014fce6aa。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 10 | 710 | 513 | 195 | — |
| .md | source | 2 | 71 | — | — | 727 |
| .ts | source | 5 | 343 | 217 | 100 | — |
| .ts | test | 2 | 145 | 125 | 5 | — |
| .mjs | source | 1 | 30 | 29 | 0 | — |

排除 5 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AKS1st/dsh-sysmon/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
