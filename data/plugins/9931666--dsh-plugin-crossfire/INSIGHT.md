# Crossfire 针锋

> 在 DSH 对定稿成果组织只读红队评审，并由用户逐条认定或驳回缺陷。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[a6d4be3](https://github.com/9931666/dsh-plugin-crossfire/tree/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire) · [![npm 30d 669](https://img.shields.io/static/v1?label=npm+30d&message=669&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire)
<!-- END META -->

**使用建议**：有具体定稿要验的人先选少量维度；核对每条证据，保留驳回理由与成果版本，再决定复审，不把认定数当客观质量。

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

- **用途**：方案或代码已有定稿，需要不同维度挑错，交付候选缺陷、用户裁决及复审记录；不负责自动修复。

- **建议**：待验证假设：每缺陷绑定固定成果摘要、引用原文和可证伪断言，成果变化自动要求复审，可减少“旧版本挑错”和拆句丢条件。由当前缺陷/轮次/人裁决分层推导，未实现完整版本证据闭环。对照修复改版本、错误引用、复审未修复三类盲审，测有效缺陷率/裁决一致性与复核工时；裁决者独立于红队模型。

有具体定稿要验的人先选少量维度；核对每条证据，保留驳回理由与成果版本，再决定复审，不把认定数当客观质量。

核查状态：源码支持评审状态机与用户裁决入口；未拉起专家/宿主，缺陷准确率、只读工具实际隔离与人类裁决真实性未验。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

参照人工红队与多角色会议；本轮未对照其他插件效果，不给跨插件优劣结论。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：crossfire评审组织/报告/导出工具。
- **Host 路由**：评审RPC与快照。
- **界面**：用户逐条裁决卡片与设置。
- **后台**：红队专家编排及评审状态持久化。

**流程与依赖**

tools/engine组织draft-attacking-judging-settled，members为专家配置只读allow+deny，report入transcript后拆缺陷；RPC卡片调用setDefectStatus，状态与导出独立持久化。

DSH子代理/会话/工具、认证RPC及本地状态目录，专家只读策略需宿主落实。

开评审/立场→维度专家→只读取证/report→拆候选缺陷→用户认定/驳回/待定→定稿导出→复审；不改成果。

TS源码需构建lib，面向DSH0.2与Node>=22；固定包scope与宿主API须核对。

**效果与成本**

首次准备明确定稿和维度，持续专家模型、拆分与逐条人审；现金和单位有效缺陷人工时间未测。

把挑错与拍板责任明确化，适合审查交接；不证明专家结论正确或覆盖完整。

- **思考**：只读红队与用户认定是否保证评审有效？工具白名单依赖宿主真实限制，模型仍可引用错误证据；collect拆句/去噪会改变缺陷表达。没有Agent裁决工具不等于RPC能密码学证明人点击，受信浏览器会话与owner检查是另一保证；用户采纳也不是缺陷真值。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对开放多Agent讨论，贡献是把红队挑错与用户裁决分离，专家只能读与报告、不能自结案，复审只核旧账。子代理与模型能力来自DSH，插件增量是评审职责/状态和可裁决缺陷材料，而非“多人一定更准”。

相对开放多Agent讨论，贡献是把红队挑错与用户裁决分离，专家只能读与报告、不能自结案，复审只核旧账。子代理与模型能力来自DSH，插件增量是评审职责/状态和可裁决缺陷材料，而非“多人一定更准”。

allow与deny双层限制、owner/workspace从会话推导、裁决与报告工具分离可借鉴；语义拆分和版本证据仍需人审。

固定源码依据：[src/index.ts](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/index.ts)、[src/tools.ts](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/tools.ts)、[src/engine.ts](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/engine.ts)、[src/redteam.ts](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/redteam.ts)、[src/rpc.ts](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/rpc.ts)、[src/review.ts](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/review.ts)、[src/state.ts](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/state.ts)、[src/client/ReviewCard.tsx](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/src/client/ReviewCard.tsx)、[package.json](https://github.com/9931666/dsh-plugin-crossfire/blob/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca/package.json)。

<a id="detail-section-5"></a>

### 主要限制

只读红队与用户认定是否保证评审有效？工具白名单依赖宿主真实限制，模型仍可引用错误证据；collect拆句/去噪会改变缺陷表达。没有Agent裁决工具不等于RPC能密码学证明人点击，受信浏览器会话与owner检查是另一保证；用户采纳也不是缺陷真值。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.3；版本日期：2026-10-18（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[a6d4be3d](https://github.com/9931666/dsh-plugin-crossfire/tree/a6d4be3d6a6e58c54f6d7e91248ec24d7a9ccfca)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读index/tools/engine/redteam/rpc/review/state与卡片；未执行子代理、目标测试或真实裁决。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：每缺陷绑定固定成果摘要、引用原文和可证伪断言，成果变化自动要求复审，可减少“旧版本挑错”和拆句丢条件。由当前缺陷/轮次/人裁决分层推导，未实现完整版本证据闭环。对照修复改版本、错误引用、复审未修复三类盲审，测有效缺陷率/裁决一致性与复核工时；裁决者独立于红队模型。

隔离宿主验证专家写工具不可见、owner拒绝、拆句不丢条件、版本变化与复审正确性；本轮不执行。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 293 | — | — | 3861 |
| .ts | source | 30 | 7881 | 4948 | 2419 | — |
| .tsx | source | 4 | 2548 | 2045 | 422 | — |
| .mjs | test | 20 | 3264 | 2548 | 400 | — |
| .js | test | 1 | 172 | 127 | 37 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire/issues?q=is%3Aissue+created%3A2026-09-21T04%3A11%3A20.063Z..2026-10-21T04%3A11%3A20.063Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T04%3A11%3A20.063Z..2026-10-21T04%3A11%3A20.063Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
