# dsh-RTL-chat

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[cb47d87](https://github.com/AdilAlmahmoud/dsh-RTL-chat/tree/cb47d8708ae0c95205926f03b6c7228c50de5e29)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AdilAlmahmoud/dsh-RTL-chat)
<!-- END META -->

> **实现功能**：为DSH对话阅读区提供可持久化的RTL/LTR切换，并保持代码块从左向右。

> **核心亮点**：贡献是窄作用域方向控制与代码例外，复用CSS双向排版和宿主slot；不是翻译或整套阿拉伯语本地化。

> **风险与缺陷**：容器级RTL能否正确处理混合语言、表格与引用？CSS direction无法识别每段语义，可能改变标点和布局；BTN_CSS插入返回的disposer未登记，卸载RTL样式与按钮样式清理不同。

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

> **用途**：阿拉伯语等RTL文本阅读者希望调整答案方向同时不扰动侧栏与代码。

浏览器/宿主逐段auto方向更语义化；插件提供用户显式切换并避免整个应用反转。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：对话RTL/LTR切换与代码LTR保留。

**流程与依赖**

DSH conversation slot和data-conversation-scroll、浏览器localStorage、CSS bidi。

默认读取本地方向（缺省RTL），注入样式与按钮，切换更新存储和订阅；卸载移除RTL样式。

**效果与成本**

首次选择阅读偏好，升级选择器与混排可达性回归，无已证阅读速度收益。

解决特定语言阅读障碍的潜力明确，效果仍需目标语言用户验证。

> **思考**：容器级RTL能否正确处理混合语言、表格与引用？CSS direction无法识别每段语义，可能改变标点和布局；BTN_CSS插入返回的disposer未登记，卸载RTL样式与按钮样式清理不同。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：贡献是窄作用域方向控制与代码例外，复用CSS双向排版和宿主slot；不是翻译或整套阿拉伯语本地化。

贡献是窄作用域方向控制与代码例外，复用CSS双向排版和宿主slot；不是翻译或整套阿拉伯语本地化。

对话区域隔离、代码方向例外与存储异常回退清楚；样式生命周期应覆盖所有插入。 源码依据：[index.js](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/index.js)、[client.js](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js)、[package.json](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

容器级RTL能否正确处理混合语言、表格与引用？CSS direction无法识别每段语义，可能改变标点和布局；BTN_CSS插入返回的disposer未登记，卸载RTL样式与按钮样式清理不同。

<a id="detail-section-6"></a>

### 1.5 使用建议

有RTL阅读需求时可先用混排样例核查；检查代码复制、链接及卸载样式残留。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AdilAlmahmoud/dsh-RTL-chat](https://github.com/AdilAlmahmoud/dsh-RTL-chat)
- **版本号**：1.0.0（[固定提交 cb47d870](https://github.com/AdilAlmahmoud/dsh-RTL-chat/tree/cb47d8708ae0c95205926f03b6c7228c50de5e29)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 index.js、client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读index.js、client.js、package.json；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：RTL/LTR混排、代码/数学/表格、窄屏和无localStorage，反复启停检查残留与按钮键盘可达性。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由容器方向例外推导，可按段落dir=auto并允许用户覆盖，代码仍显式LTR。未验证；混合数字/URL/列表对照人工阅读，错误顺序与切换次数应低于整容器RTL。

RTL/LTR混排、代码/数学/表格、窄屏和无localStorage，反复启停检查残留与按钮键盘可达性。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：8125f7cd558ce676f54bed09e73cc541ec8818537cc8ca35dd4da6c380c13b91。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 133 | 114 | 11 | — |
| .md | source | 1 | 48 | — | — | 383 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AdilAlmahmoud/dsh-RTL-chat/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AdilAlmahmoud/dsh-RTL-chat/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AdilAlmahmoud/dsh-RTL-chat/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
