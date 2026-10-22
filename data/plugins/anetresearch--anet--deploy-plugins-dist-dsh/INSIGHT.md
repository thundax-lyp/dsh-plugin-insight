# ANet DSH 适配组件

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[429ce91](https://github.com/ANetResearch/ANet/tree/429ce915f6438295078e53739dbb1dfe70074ccc/deploy/plugins/dist/dsh)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/ANetResearch/ANet) · 脚本更新状态暂未确认
<!-- END META -->

> **实现功能**：以 Skill 与 MCP 启动器将 DSH 接到本地 ANet 节点。

> **核心亮点**：组件的实际贡献是让MCP与Skill命令到达同一身份/二进制，并把长等待、未知执行效果和运营者限额写进使用协议；不把整仓A2A、加密、支付系统当作本适配组件原创。相对手写MCP配置，减少路径与身份不一致。

> **风险与缺陷**：协议说明能否保证跨Agent副作用不重复？Skill要求wait超时继续等、未知效果不重发，并区分completed/UNVERIFIED，但执行保障在外部daemon，组件未实现幂等或支付限额校验。组件改process.env是进程共享状态，多profile/其他插件并行时的设置归属也不能只靠dispose恢复证明隔离。

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

> **用途**：已有ANet身份与节点的用户从DSH发现其他Agent、发任务、跟踪回执并处理报价；交付物是外部任务结果与状态，不代表结果已验真。

直接把anet mcp填入MCP配置并手工使用CLI；本组件补Skill注册、统一身份与超时配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Skill**：注册anet、anet-setup、anet-status三份组件Skill。
- **模型工具**：patch经官方MCP client接入外部anet mcp；14项工具为作者说明，本组件只确认连接配置。
- **后台**：stdio MCP launcher统一二进制与identity；daemon由外部ANet维护。

**流程与依赖**

组件index提供bundle root/两项设置，并把可执行文件与identity映射进进程环境；skills.js读取三份Skill、替换转义后的bundle路径。patch用官方MCP client启动POSIX脚本，再由anet-run统一可执行文件/身份执行anet mcp；实际任务、加密、支付和审计位于外部ANet程序。

DSH skills与官方MCP client、POSIX shell、外部anet二进制及daemon/hub；setup另依赖curl/gzip/ssh-keygen。

配置身份/路径→启动MCP→按Skill发现Agent/派单→保留task/context/message ID→等待查询→人工核对结果/报价；节点需用户自行保持运行，DSH会话退出可能终止会话启动的daemon。

组件是整仓deploy/plugins/dist/dsh的dsh-anet 0.1.3 bundle，声明DSH 0.2范围；POSIX launcher不支持Windows，需外部anet>=0.3.0与运行中的daemon。

**效果与成本**

现金：外部报价和本地Agent模型开销由限额与任务决定；人工：安装身份、常驻节点、hub加入、授权和未知结果追踪。setup可能下载执行安装器，仅按Skill要求经用户同意，本轮未做。

统一DSH到节点的配置，强调完成状态不等于正确、未知效果不能重试；尚无跨Agent质量/费用收益验证。

> **思考**：协议说明能否保证跨Agent副作用不重复？Skill要求wait超时继续等、未知效果不重发，并区分completed/UNVERIFIED，但执行保障在外部daemon，组件未实现幂等或支付限额校验。组件改process.env是进程共享状态，多profile/其他插件并行时的设置归属也不能只靠dispose恢复证明隔离。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：组件的实际贡献是让MCP与Skill命令到达同一身份/二进制，并把长等待、未知执行效果和运营者限额写进使用协议；不把整仓A2A、加密、支付系统当作本适配组件原创。相对手写MCP配置，减少路径与身份不一致。

组件的实际贡献是让MCP与Skill命令到达同一身份/二进制，并把长等待、未知执行效果和运营者限额写进使用协议；不把整仓A2A、加密、支付系统当作本适配组件原创。相对手写MCP配置，减少路径与身份不一致。

显式配置路径必须绝对且可执行，错误不偷偷换另一副本；Skill路径转义支持特殊字符；环境恢复仅在值仍为本插件所设时进行。MCP 15分钟timeout配置只是等待上限，不是任务取消保证。

固定源码依据：[deploy/plugins/dist/dsh/index.js](https://github.com/ANetResearch/ANet/blob/429ce915f6438295078e53739dbb1dfe70074ccc/deploy/plugins/dist/dsh/index.js)、[deploy/plugins/dist/dsh/skills.js](https://github.com/ANetResearch/ANet/blob/429ce915f6438295078e53739dbb1dfe70074ccc/deploy/plugins/dist/dsh/skills.js)、[deploy/plugins/dist/dsh/cordis.patch.yml](https://github.com/ANetResearch/ANet/blob/429ce915f6438295078e53739dbb1dfe70074ccc/deploy/plugins/dist/dsh/cordis.patch.yml)、[deploy/plugins/dist/dsh/bin/anet-run.sh](https://github.com/ANetResearch/ANet/blob/429ce915f6438295078e53739dbb1dfe70074ccc/deploy/plugins/dist/dsh/bin/anet-run.sh)、[deploy/plugins/dist/dsh/bin/anet-mcp.sh](https://github.com/ANetResearch/ANet/blob/429ce915f6438295078e53739dbb1dfe70074ccc/deploy/plugins/dist/dsh/bin/anet-mcp.sh)、[deploy/plugins/dist/dsh/skills/anet/SKILL.md](https://github.com/ANetResearch/ANet/blob/429ce915f6438295078e53739dbb1dfe70074ccc/deploy/plugins/dist/dsh/skills/anet/SKILL.md)、[deploy/plugins/dist/dsh/package.json](https://github.com/ANetResearch/ANet/blob/429ce915f6438295078e53739dbb1dfe70074ccc/deploy/plugins/dist/dsh/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

协议说明能否保证跨Agent副作用不重复？Skill要求wait超时继续等、未知效果不重发，并区分completed/UNVERIFIED，但执行保障在外部daemon，组件未实现幂等或支付限额校验。组件改process.env是进程共享状态，多profile/其他插件并行时的设置归属也不能只靠dispose恢复证明隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有受信ANet场景者可把它当连接器评估；没有节点/身份或无法确认外部能力边界时，不据此推荐发送业务数据或支付。

核查状态：DSH启动/设置/Skill接线由组件源码确认；14项MCP能力、加密与支付安全仅据作者材料，未核外部实现或运行。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.1.3；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[429ce915](https://github.com/ANetResearch/ANet/tree/429ce915f6438295078e53739dbb1dfe70074ccc)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：只统计deploy/plugins/dist/dsh组件；抽读index、skills注册、patch、两个launcher和anet主Skill，未审计上游daemon/密码学/支付实现，README主张不升级成独立验证。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

如果适配层把任务ID、message_id、效果状态和支付回执组成只读交接凭证，父Agent在未知状态下只能继续查询原任务，可能降低重复派单/支付。对超时、断线、相同文本新任务及换身份四种案例检查既不重发又不吞新请求；若只提示而无可核验状态，不能声称获得执行级保证。

未安装、运行ANet或联网派单/支付；假设验证应在隔离节点和零支付限额下覆盖未知效果与幂等，不把README端到端加密宣称当审计结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/ANetResearch/ANet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=grey&logo=github&style=flat)](https://github.com/ANetResearch/ANet/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=grey&logo=github&style=flat)](https://github.com/ANetResearch/ANet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
