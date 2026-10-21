# dsh-trellis

> 在 DSH 以任务阶段、步骤状态和验收门禁组织开发，并提供任务看板与可选规划保护。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[86e1aa5](https://github.com/1264459640/dsh-trellis/tree/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) · [![npm 30d 1538](https://img.shields.io/static/v1?label=npm+30d&message=1%2C538&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)
<!-- END META -->

**使用建议**：复杂且多人验收的开发任务可先在测试项目试；核对未批准写入、真实人工确认和局部Git文件清单，再决定开哪些项目，简单修改保持较轻流程。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

多阶段开发团队把方案、实现、验证与归档组织成项目任务，交付任务状态及对应文件；小修改可继续使用人工计划和Git/CI。

参照人工计划+Git/CI及Trellis阶段思想；本次未做与上游或其他工作流同任务性能比较。

<a id="detail-section-3"></a>

### 能力、流程与依赖

lib/index.js按allowlist解析.trellis，注入阶段提示、复制缺失Skill并注册任务工具；task.js约束步骤状态和verified字段，readonly.js按授权裁剪指定写工具，board/client提供看板。

- **Skill**：按项目复制缺失的工作流Skill供宿主发现。
- **模型工具**：任务创建、更新、归档、状态与产物诊断。
- **界面**：任务列表/泳道看板与步骤详情。
- **事件监听**：阶段提示与规划期指定工具过滤。

DSH fs/skills/tools/agents与system prompt接缝、项目.trellis、Git和allowlist；其他工作流与插件工具可能影响规则。

启用项目→补缺Skill→创建并绑定任务→规划批准→步骤in_progress/verifying→记录验证→完成与Git检查→归档；看板点击仅生成推进输入/文件引用。

面向DSH 0.2.0-rc.2的peer范围及bundle/client入口，需allowlist主动启用；桌面安装依赖carrier CLI，未验证当前安装包。

<a id="detail-section-4"></a>

### 效果、成本与限制

集中任务真相与完成门槛可减少交接遗漏，但需要真实验证证据；状态字段和Git干净均不能独立证明结果正确。

首次配置项目白名单与迁移既有任务；每任务需计划、步骤、批准和验证记录，现金依赖宿主模型，人工流程负担未测。自动补缺Skill影响清理/升级管理。

verifiedBy=human是否真的证明人批准？task.js检查模型传入的verified=true及verifiedBy枚举，未把该值绑定到独立的人类批准事件，因此是记录规则而非不可伪造签署。规划保护只deny指定write/edit和任务工具，其余子代理/shell类副作用不构成全面沙箱；modified_files又由调用方声明，局部Git干净不证明变更全集完整。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对分散TODO和口头批准，贡献在于以task.json.steps集中状态、分阶段推进并在完结/归档前核验步骤与Git；看板只把推进意图交给Agent，不直接绕过状态机。项目明确借鉴Trellis阶段思想，Git与DSH工具裁剪属于既有机制；插件增量是项目/会话绑定、受控任务操作和DSH呈现。

task、archive、git、readonly分模块，任务记录与会话绑定分离；ctx.sandboxPolicy缺失时部分操作失败关闭有借鉴意义。只读工具denylist与自报验证字段的保证边界应明确。

源码依据：[lib/index.js](https://github.com/1264459640/dsh-trellis/blob/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489/lib/index.js)、[lib/task.js](https://github.com/1264459640/dsh-trellis/blob/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489/lib/task.js)、[lib/readonly.js](https://github.com/1264459640/dsh-trellis/blob/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489/lib/readonly.js)、[lib/git.js](https://github.com/1264459640/dsh-trellis/blob/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489/lib/git.js)、[lib/archive.js](https://github.com/1264459640/dsh-trellis/blob/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489/lib/archive.js)、[lib/board.js](https://github.com/1264459640/dsh-trellis/blob/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489/lib/board.js)、[lib/client.js](https://github.com/1264459640/dsh-trellis/blob/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489/lib/client.js)、[lib/skills.js](https://github.com/1264459640/dsh-trellis/blob/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489/lib/skills.js)、[package.json](https://github.com/1264459640/dsh-trellis/blob/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489/package.json)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：多阶段开发团队把方案、实现、验证与归档组织成项目任务，交付任务状态及对应文件；小修改可继续使用人工计划和Git/CI。

- **建议**：待验证假设：用宿主原生的人类批准事件ID绑定步骤、方案摘要和版本，并在提交验收时核对真实变更集合，可减少模型自签和漏报文件。由verifiedBy自报与modified_files自选的缺口推导，当前未实现。以伪造human标记、批准后改方案、漏列修改文件三类反例对照，要求均拒绝而合法批准可通过；代价是宿主事件依赖与人工批准时间，若小任务成本明显上升应按任务复杂度启用。

复杂且多人验收的开发任务可先在测试项目试；核对未批准写入、真实人工确认和局部Git文件清单，再决定开哪些项目，简单修改保持较轻流程。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码支持状态门禁与任务组织；已显式复核旧8项findings，当前未运行宿主、真实验收或并发恢复；新增假设仍未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **Skill**：按项目复制缺失的工作流Skill供宿主发现。
- **模型工具**：任务创建、更新、归档、状态与产物诊断。
- **界面**：任务列表/泳道看板与步骤详情。
- **事件监听**：阶段提示与规划期指定工具过滤。

- **思考**：verifiedBy=human是否真的证明人批准？task.js检查模型传入的verified=true及verifiedBy枚举，未把该值绑定到独立的人类批准事件，因此是记录规则而非不可伪造签署。规划保护只deny指定write/edit和任务工具，其余子代理/shell类副作用不构成全面沙箱；modified_files又由调用方声明，局部Git干净不证明变更全集完整。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对分散TODO和口头批准，贡献在于以task.json.steps集中状态、分阶段推进并在完结/归档前核验步骤与Git；看板只把推进意图交给Agent，不直接绕过状态机。项目明确借鉴Trellis阶段思想，Git与DSH工具裁剪属于既有机制；插件增量是项目/会话绑定、受控任务操作和DSH呈现。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：0.4.0；版本日期：2026-10-21（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[86e1aa52](https://github.com/1264459640/dsh-trellis/tree/86e1aa521c19ca91cd92b74df8b8c59a8f6f2489)；本次截止 2026-10-21T03:36:14Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读入口、步骤门禁、只读策略、Git检查、归档与看板接线；未跑任务或目标测试，不把状态completed当业务验收。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：aef314478ab2d4e7328fbea4f2d744de18e6f2e5a1884e61a5d080c75a0a5e31。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 135 | 8424 | — | — | 132964 |
| .md | test | 2 | 285 | — | — | 5291 |
| .mjs | source | 3 | 728 | 571 | 106 | — |
| .js | source | 15 | 7940 | 6003 | 1595 | — |
| .js | test | 12 | 3127 | 2524 | 313 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：用宿主原生的人类批准事件ID绑定步骤、方案摘要和版本，并在提交验收时核对真实变更集合，可减少模型自签和漏报文件。由verifiedBy自报与modified_files自选的缺口推导，当前未实现。以伪造human标记、批准后改方案、漏列修改文件三类反例对照，要求均拒绝而合法批准可通过；代价是宿主事件依赖与人工批准时间，若小任务成本明显上升应按任务复杂度启用。

隔离项目检查伪human记录、间接写工具、no-trellis、并发绑定、漏列modified_files、重启与归档；本轮仅静态证据。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+created%3A2026-09-21T03%3A39%3A53.086Z..2026-10-21T03%3A39%3A53.086Z) · [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T03%3A39%3A53.086Z..2026-10-21T03%3A39%3A53.086Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
