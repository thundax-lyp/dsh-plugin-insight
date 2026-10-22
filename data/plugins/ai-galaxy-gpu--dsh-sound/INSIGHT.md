# dsh-sound

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[aa7be41](https://github.com/AI-Galaxy-GPU/dsh-sound/tree/aa7be415ee34570bd1c834da9d8a500e85401583)

<!-- BEGIN META -->
[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/AI-Galaxy-GPU/dsh-sound) [![npm 30d 920](https://img.shields.io/static/v1?label=npm+30d&message=920&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@ai-galaxy/dsh-sound) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@ai-galaxy/dsh-sound)
<!-- END META -->

> **实现功能**：在DSH网页中按任务完成、审批、提问、阻塞和失败事件播放可定制提示音。

> **核心亮点**：相对仅完成铃，增量是人类介入事件分类、子Agent分流与跨标签抑制噪声；不改变后台任务执行或审批结果。

> **风险与缺陷**：跨标签“只响一次”是否无条件？协商依赖BroadcastChannel及时到达和已发现peer，未发现时立即播放；多个新标签同时收到事件仍需真实调度验证。浏览器音频策略/静音也可能导致未响，不能把脚本调用当用户听见。

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

> **用途**：用户离开当前聊天视线时需要知道何时介入，合格通知应少漏报/重复且区分子Agent，声音响不代表业务成功。

宿主可见状态/系统通知可提示介入；此插件补声音与细分通道，无任务能力增量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：声音配置、本地音频选择与事件提示。
- **事件监听**：mux/host及快照变化检测。

**流程与依赖**

DSH事件接口、Web Audio/IndexedDB与可选BroadcastChannel；音频设备、浏览器策略和用户设置决定实际可听性。

配置每类声音，监听事件并判主/子Agent和重复，跨标签协商后播放，用户回到会话处理请求；配置或音频存储失败可降为内存。

**效果与成本**

无模型或网络音频费；首次选音和浏览器音频授权，持续通知噪声与本地音频存储成本，未测节省等待时间。

可减少盯屏，但漏通知/告警疲劳需真实工作负载评估。

> **思考**：跨标签“只响一次”是否无条件？协商依赖BroadcastChannel及时到达和已发现peer，未发现时立即播放；多个新标签同时收到事件仍需真实调度验证。浏览器音频策略/静音也可能导致未响，不能把脚本调用当用户听见。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对仅完成铃，增量是人类介入事件分类、子Agent分流与跨标签抑制噪声；不改变后台任务执行或审批结果。

相对仅完成铃，增量是人类介入事件分类、子Agent分流与跨标签抑制噪声；不改变后台任务执行或审批结果。

事件分类、回放抑制与音频存储分离可借鉴；固定40ms协商及浏览器后台限制应作为尽力而为边界。 源码依据：[lib/index.js](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/index.js)、[lib/client.js](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

跨标签“只响一次”是否无条件？协商依赖BroadcastChannel及时到达和已发现peer，未发现时立即播放；多个新标签同时收到事件仍需真实调度验证。浏览器音频策略/静音也可能导致未响，不能把脚本调用当用户听见。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合多任务用户先以主Agent事件试用。验证背景标签、重载和静音行为，审批与问题仍回界面查看，别靠铃声判断任务已验收。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AI-Galaxy-GPU/dsh-sound](https://github.com/AI-Galaxy-GPU/dsh-sound)
- **版本号**：0.4.1（[固定提交 aa7be415](https://github.com/AI-Galaxy-GPU/dsh-sound/tree/aa7be415ee34570bd1c834da9d8a500e85401583)）
- **版本日期**：2026-09-16（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、lib/client.js；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：固定事件回放测试刷新恢复、同时标签、后台节流、音频拒绝与子Agent分流；记录实际听到次数和误报。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由事件ID与协商推导，可增加用户可见通知收据和声音自检，明确重播恢复/未播放原因；跨标签用租约而非短时随机窗口。未验证；后台节流/同时开标签/权限拒绝时测漏重报，若不改善则否定。

固定事件回放测试刷新恢复、同时标签、后台节流、音频拒绝与子Agent分流；记录实际听到次数和误报。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：83410795efbfba70ab37fd8edb86c9f2176b3ff923cd7cb7f31eb4763d08fd5e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 510 | — | — | 5315 |
| .js | source | 2 | 1716 | 1468 | 171 | — |
| .mjs | source | 2 | 1201 | 1084 | 35 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AI-Galaxy-GPU/dsh-sound/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
