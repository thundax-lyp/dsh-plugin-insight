# dsh-harness-chat-control

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[061e9a8](https://github.com/1985899182/dsh-harness-chat-control/tree/061e9a8563ffec3b2353d785e268b88984bd4890)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control)
<!-- END META -->

> **实现功能**：为 DSH 会话提供引用、侧聊、会话编辑及侧聊模型与历史控制。

> **核心亮点**：作者提供会话操作集合。相对手工复制文本再开子会话，增量在于引用、侧聊和模型选择贯通；源码明确借助 Better Sidebar，并在 vendor 保存来源声明，不能把上游侧栏归为原创。自己补的是宿主未暴露的地址化侧聊与编辑接缝。

> **风险与缺陷**：核心质疑是界面中的“编辑”能否与模型看到的 surface 一致。原生历史与投影视图分离，插件为 replacement 做专门处理，说明不是普通文本编辑；多次编辑、重载后引用及图片附件一致性仍需真实宿主验证。

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

> **用途**：开发者需要从主会话引用一段内容发起侧聊，并把局部问题与主线区分；合格交付是可追溯引用和保留身份的会话交互。

参照手工复制、原生子代理树和 Better Sidebar；未验证对每个支持版本的适配。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：引用、侧聊与会话编辑
- **Host 路由**：sidechat-model、sidechat-history、session-edit

**流程与依赖**

需要包声明的 DSH 客户端插槽、会话/附件/模型接口及 Better Sidebar 衔接；不是独立聊天系统，私有模块兼容需要随宿主维护。

选择文本加入引用草稿，打开侧聊并选模型，宿主校验目标后排入消息；编辑主会话先在宿主登记一次替换，再走原生发送；失败保留草稿并核对回执。

**效果与成本**

现金为真实侧聊新增模型调用；人工包括选择范围、复核引用、升级后的界面回归。源码中的结构性 fallback 方便加载检查，不构成宿主可用证据。

可能降低侧聊准备成本；若引用与模型输入不同步，会把省下的复制时间转化为排查成本。

> **思考**：核心质疑是界面中的“编辑”能否与模型看到的 surface 一致。原生历史与投影视图分离，插件为 replacement 做专门处理，说明不是普通文本编辑；多次编辑、重载后引用及图片附件一致性仍需真实宿主验证。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：作者提供会话操作集合。相对手工复制文本再开子会话，增量在于引用、侧聊和模型选择贯通；源码明确借助 Better Sidebar，并在 vendor 保存来源声明，不能把上游侧栏归为原创。自己补的是宿主未暴露的地址化侧聊与编辑接缝。

作者提供会话操作集合。相对手工复制文本再开子会话，增量在于引用、侧聊和模型选择贯通；源码明确借助 Better Sidebar，并在 vendor 保存来源声明，不能把上游侧栏归为原创。自己补的是宿主未暴露的地址化侧聊与编辑接缝。

lib/index.js 的 createIdentifiedUserMessage 保证 fallback 也有 UUID，避免无身份消息碰撞；lib/client.js 追踪表面替换的来源序列，值得借鉴双视图一致性处理。浏览器大文件与宿主私有 seam 使升级回归成本较高。 源码：[lib/index.js](https://github.com/1985899182/dsh-harness-chat-control/blob/061e9a8563ffec3b2353d785e268b88984bd4890/lib/index.js)、[lib/client.js](https://github.com/1985899182/dsh-harness-chat-control/blob/061e9a8563ffec3b2353d785e268b88984bd4890/lib/client.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心质疑是界面中的“编辑”能否与模型看到的 surface 一致。原生历史与投影视图分离，插件为 replacement 做专门处理，说明不是普通文本编辑；多次编辑、重载后引用及图片附件一致性仍需真实宿主验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合经常引用局部问题开侧聊的用户；先验证编辑与重载后的引用一致性，再将其纳入重要讨论记录。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：同一段回复先引用、再连续编辑源消息、刷新页面并发送侧聊；核对引用文本、事件身份、模型输入与附件。与手工复制对比错引率和操作数，若额外警告无法识别陈旧内容则不采纳版本引用。

**分析版本**

- **仓库**：[1985899182/dsh-harness-chat-control](https://github.com/1985899182/dsh-harness-chat-control)
- **版本号**：0.3.3（[固定提交 061e9a8](https://github.com/1985899182/dsh-harness-chat-control/tree/061e9a8563ffec3b2353d785e268b88984bd4890)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：引用携带源事件及 surface 版本并在发送前提示失效，能减少编辑后引用过期。推导自客户端对 replacementOriginSeq 的追踪；需要由宿主提供可稳定恢复的事件身份。

同一段回复先引用、再连续编辑源消息、刷新页面并发送侧聊；核对引用文本、事件身份、模型输入与附件。与手工复制对比错引率和操作数，若额外警告无法识别陈旧内容则不采纳版本引用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 6239 | 5063 | 997 | — |
| .md | source | 5 | 455 | — | — | 6119 |
| .mjs | source | 2 | 1320 | 1203 | 64 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1985899182/dsh-harness-chat-control/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
