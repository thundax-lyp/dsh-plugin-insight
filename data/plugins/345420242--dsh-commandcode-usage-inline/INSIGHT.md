# dsh-commandcode-usage-inline

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[67ae018](https://github.com/345420242/dsh-commandcode-usage-inline/tree/67ae01891935472467cdf77562861062e91d9b5b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/345420242/dsh-commandcode-usage-inline)
<!-- END META -->

> **实现功能**：在 DSH 输入栏内联展示 Command Code 账户窗口用量和剩余 credits。

> **核心亮点**：相对作者指出的侧栏用量面板，增量是把额度缩到模型选择旁的徽章，详情按需展开；复用provider认证与report接口，避免重复实现账户API。主要是界面适配贡献。

> **风险与缺陷**：active账户缺失时选首个configured账户，可能与实际请求轮换账户不同；“剩余”是report快照，不是本次请求额度承诺。外部provider Remote形状或挂载顺序变化也会让纯界面插件失效。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Command Code用户在发起请求前查看额度和重置窗口，避免切到单独账户页面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

作者明确参照zouxiaoyang的侧栏版；本次只核查该插件当前源码，不推断两个插件可以稳定共存。

纯客户端读取已挂载commandcode/report Remote，按当前会话provider显隐；解析账户report并优先active账户，每60秒刷新，错误时展示警告。


DSH客户端Remote和会话模型目录，已安装并启用@mars-sea/dsh-commandcode-provider；不直接持有API key。

订阅会话模型目录，匹配commandcode后取得report，选当前账户渲染徽章，点击看明细；周期刷新，失败显示警告供重试。

本地轮询和少量UI开销；人工为provider安装、兼容升级和账户归属核对，未测轮询对上游请求成本。

在输入位置提示额度便于及时观察；显示百分比不能确保请求可用或准确预算。

**能力**

- **界面**：Command Code窗口用量徽章与账户详情浮层

> **思考**：active账户缺失时选首个configured账户，可能与实际请求轮换账户不同；“剩余”是report快照，不是本次请求额度承诺。外部provider Remote形状或挂载顺序变化也会让纯界面插件失效。

<a id="detail-section-4"></a>

### 1.3 工程贡献

report边界解析容忍缺段，Host为显式no-op；客户端保留Remote错误并按provider显隐。复用时需保留未知账户和错误状态。 源码依据：[dsh/client.js](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/dsh/client.js#L47)、[dsh/index.js](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/dsh/index.js#L12)。

> **亮点**：相对作者指出的侧栏用量面板，增量是把额度缩到模型选择旁的徽章，详情按需展开；复用provider认证与report接口，避免重复实现账户API。主要是界面适配贡献。

<a id="detail-section-5"></a>

### 1.4 使用建议

已用对应Command Code provider的用户可评估；多账户轮换时核对active标记，勿据首账户默认值作预算决定。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[345420242/dsh-commandcode-usage-inline](https://github.com/345420242/dsh-commandcode-usage-inline)
- **版本号**：0.1.0（[固定提交 67ae018](https://github.com/345420242/dsh-commandcode-usage-inline/tree/67ae01891935472467cdf77562861062e91d9b5b)）
- **版本日期**：2026-09-06（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

待验证假设：当缺少active标记时明确显示“账户未确认”，并标注采集时间，比默认首账户更少诱发额度误判；由当前fallback选择规则推导，不需要增加API权限。

最小验证：构造active缺失、账户切换、过期report和Remote晚挂载，比较默认首账户与未知提示的错误归属率；若提示仍导致预算误判则调整。

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 609 | 520 | 56 | — |
| .md | source | 1 | 53 | — | — | 482 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/345420242/dsh-commandcode-usage-inline/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
