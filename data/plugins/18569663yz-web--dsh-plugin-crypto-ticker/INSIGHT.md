# dsh-plugin-crypto-ticker

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[84f1be4](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/tree/84f1be429c04c5d426e54d02b993d8972d4d841d)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker)
<!-- END META -->

> **实现功能**：在 DSH 侧栏显示加密货币价格、涨跌与走势图，支持多来源降级。

> **核心亮点**：作者主张免密钥行情卡片。相对浏览器行情标签页，增量是宿主集中获取、侧栏呈现与来源降级，减少重复切页；index.js 明确把趋势缓存与头部报价分开，是实用集成而非行情算法创新。

> **风险与缺陷**：“多标签共享请求”只在缓存命中后成立：apply 的 fetch 路由在缓存过期时直接 await build，没有共享 in-flight Promise；同时到来的标签可能重复请求。collect 只需至少一个有效币就接受来源，因此不能把一次源成功理解为所有币均刷新；逐币 stale 才是边界。

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

> **用途**：希望在 DSH 工作时顺手看常用代币行情的个人用户；合格输出是标明来源、新旧状态的参考报价。

参照独立行情网站或每标签直接请求 API；未核实价格与成交量的跨交易所一致性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：侧栏行情卡片
- **Host 路由**：/api/crypto.ticker
- **后台**：多来源报价与趋势缓存

**流程与依赖**

需要 DSH connection 与客户端插槽、可访问公开行情 API；无密钥仍受网络、代理和上游限流影响，https.mjs 仅支持 http CONNECT 代理。

安装并重启，侧栏轮询宿主；宿主顺序尝试来源并刷新趋势；缺币展示旧值，全部失败标降级，用户可强制刷新并查看来源。

**效果与成本**

现金未见强制行情订阅；人工成本包括网络/代理排障及核对旧报价。轮询与趋势请求消耗网络，公开源免费不代表无限额度。

减少切换窗口的便利可以从集成解释，但没有衡量注意力收益；报价来源差异和过期数据限制使用。

> **思考**：“多标签共享请求”只在缓存命中后成立：apply 的 fetch 路由在缓存过期时直接 await build，没有共享 in-flight Promise；同时到来的标签可能重复请求。collect 只需至少一个有效币就接受来源，因此不能把一次源成功理解为所有币均刷新；逐币 stale 才是边界。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：作者主张免密钥行情卡片。相对浏览器行情标签页，增量是宿主集中获取、侧栏呈现与来源降级，减少重复切页；index.js 明确把趋势缓存与头部报价分开，是实用集成而非行情算法创新。

作者主张免密钥行情卡片。相对浏览器行情标签页，增量是宿主集中获取、侧栏呈现与来源降级，减少重复切页；index.js 明确把趋势缓存与头部报价分开，是实用集成而非行情算法创新。

index.js 用 lastGood 与逐币 stale 避免全空界面，值得复用降级可见性；https.mjs 自带 TLS/CONNECT/HTTP 解码增加维护面，需检验代理响应与截断；缓存不等同于请求合并。 源码：[index.js](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/index.js)、[https.mjs](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/blob/84f1be429c04c5d426e54d02b993d8972d4d841d/https.mjs)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“多标签共享请求”只在缓存命中后成立：apply 的 fetch 路由在缓存过期时直接 await build，没有共享 in-flight Promise；同时到来的标签可能重复请求。collect 只需至少一个有效币就接受来源，因此不能把一次源成功理解为所有币均刷新；逐币 stale 才是边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合参考性看盘；先检查当前来源和逐币 stale 状态，遇到来源切换时到交易平台复核价格。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

- 已检查：作者 README、包清单、源码路径 index.js、https.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：用可控行情服务同时发十个冷缓存读取，比较当前路由与合并在途请求的上游调用数、取消行为及逐币旧数据标记；若引用计数取消导致其他页面失败则否定方案。

**分析版本**

- **仓库**：[18569663yz-web/dsh-plugin-crypto-ticker](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker)
- **版本号**：0.1.0（[固定提交 84f1be4](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/tree/84f1be429c04c5d426e54d02b993d8972d4d841d)）
- **版本日期**：2026-09-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：以规范化币种集为键合并在途请求，能在缓存冷启动时降低上游峰值且不增加等待；来自缓存窗口外并发路径的观察。需处理单请求取消不能取消全部订阅者的状态所有权。

用可控行情服务同时发十个冷缓存读取，比较当前路由与合并在途请求的上游调用数、取消行为及逐币旧数据标记；若引用计数取消导致其他页面失败则否定方案。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1124 | 726 | 335 | — |
| .mjs | source | 1 | 205 | 135 | 58 | — |
| .md | source | 1 | 202 | — | — | 2448 |
| .mjs | test | 2 | 389 | 309 | 56 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
