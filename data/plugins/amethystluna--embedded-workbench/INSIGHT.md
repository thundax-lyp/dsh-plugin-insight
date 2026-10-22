# embedded-workbench

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[1bb1bcf](https://github.com/AmethystLuna/embedded-workbench/tree/1bb1bcfc45ca6efab327967a252d4d9203a323a7)

<!-- BEGIN META -->
[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 2,906](https://img.shields.io/static/v1?label=npm+30d&message=2%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench)
<!-- END META -->

> **实现功能**：提供嵌入式C/C++开发技能库，并在DSH首个模型步骤注入计划核查与上下文预算提示。

> **核心亮点**：相对散落提示文档，增量是领域经验按触发场景组织并纳入宿主技能目录，首步核查提示用持久历史避免重复。宿主技能发现与会话能力、编译工具来自上游，未证领域经验独创或普遍有效。

> **风险与缺陷**：“Gate”是否真正阻止未验证计划？源码只追加用户消息，未挂exit_plan_mode执行guard；技能可能要求核查，但依赖模型遵循。路径/API事实核查亦不能证明中断时序或固件行为，不能把文档纪律当编译/硬件验证。

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

> **用途**：固件开发者处理RTOS、中断、HardFault或Keil构建问题，需要工程知识和可查证计划；合格交付仍是目标固件构建/测试结果。

手工工程检查表更少上下文但难按需检索；技能使经验可调用，未改变固件验证责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Skill**：嵌入式开发、调试、构建与事实核查技能。
- **事件监听**：首个模型步骤注入及持久历史判重。
- **界面**：插件提示开关与状态查询接线。

**流程与依赖**

DSH skills/agent pre-step和会话日志；效果依赖仓库源码、编译器、芯片资料及工程师核对，logicprobe可选，fact-check只作事实回退。

安装注册目录→任务加载领域技能→首步提示计划核查→工具链构建/调试→人工与硬件验收；未知上下文预算不应猜测。

**效果与成本**

首次选择目标工具链和技能，日常加载文档、核查和编译人工时间；提示增加上下文，无实测端到端节时。

有助经验复用，收益取决于模型选择技能和工程证据质量。

> **思考**：“Gate”是否真正阻止未验证计划？源码只追加用户消息，未挂exit_plan_mode执行guard；技能可能要求核查，但依赖模型遵循。路径/API事实核查亦不能证明中断时序或固件行为，不能把文档纪律当编译/硬件验证。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对散落提示文档，增量是领域经验按触发场景组织并纳入宿主技能目录，首步核查提示用持久历史避免重复。宿主技能发现与会话能力、编译工具来自上游，未证领域经验独创或普遍有效。

相对散落提示文档，增量是领域经验按触发场景组织并纳入宿主技能目录，首步核查提示用持久历史避免重复。宿主技能发现与会话能力、编译工具来自上游，未证领域经验独创或普遍有效。

持久source判重、标准技能provider和旧volatile能力探测可借鉴；提示语义不提供硬门禁。 源码依据：[src/index.ts](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/src/index.ts)、[skills/embedded-workbench/SKILL.md](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/skills/embedded-workbench/SKILL.md)、[skills/hardfault-triage/SKILL.md](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/skills/hardfault-triage/SKILL.md)、[skills/fact-check/SKILL.md](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/skills/fact-check/SKILL.md)、[cordis.patch.yml](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“Gate”是否真正阻止未验证计划？源码只追加用户消息，未挂exit_plan_mode执行guard；技能可能要求核查，但依赖模型遵循。路径/API事实核查亦不能证明中断时序或固件行为，不能把文档纪律当编译/硬件验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合有固件经验者把技能当核对清单使用。先用已知故障样例查建议是否适配芯片/工具链，关键结论继续做构建与目标硬件验证。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AmethystLuna/embedded-workbench](https://github.com/AmethystLuna/embedded-workbench)
- **版本号**：0.9.4（[固定提交 1bb1bcfc](https://github.com/AmethystLuna/embedded-workbench/tree/1bb1bcfc45ca6efab327967a252d4d9203a323a7)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、skills/embedded-workbench/SKILL.md、skills/hardfault-triage/SKILL.md、skills/fact-check/SKILL.md、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读src/index.ts、skills/embedded-workbench/SKILL.md、skills/hardfault-triage/SKILL.md、skills/fact-check/SKILL.md、cordis.patch.yml；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：准备真实API/虚构API、ISR竞态和工具链不匹配样例，核对技能路由、证据清单、首步重复与启停；不以提示出现判核查通过。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由首步注入与事实/行为分流推导，可将每项计划声称绑定证据类型和有效期，计划审批前显示未核查清单，由用户决定而非隐式“已验”。未验证；故意加入不存在API和时序错误计划，对照仅提示测漏报与人工负担。

准备真实API/虚构API、ISR竞态和工具链不匹配样例，核对技能路由、证据清单、首步重复与启停；不以提示出现判核查通过。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：7d2a3437437216382710faea8b7a067335cfc957b144b93277110d4d8dd62a57。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 41 | 4641 | — | — | 36437 |
| .js | source | 3 | 784 | 494 | 247 | — |
| .mjs | source | 2 | 213 | 168 | 28 | — |
| .ts | source | 1 | 300 | 146 | 131 | — |
| .mjs | test | 5 | 868 | 658 | 123 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench/issues?q=is%3Aissue+created%3A2026-09-21T08%3A01%3A47.868Z..2026-10-21T08%3A01%3A47.868Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A01%3A47.868Z..2026-10-21T08%3A01%3A47.868Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
